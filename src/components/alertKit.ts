import {fonts} from '../fonts';
import {section} from '../theme';
import {palette} from './screenKit';

/*
 * No. 020 (N7, style guide v0.18.17 § 8 Phone-screen kit "Alert screens"): a phone's own crash alert, generic, in the Day
 * phone UI (`#fafafa`, text `#15171a`). One headline and at most one button label per state; a `warning` triangle with an
 * ink outline; no slider, no red or green, no capsule buttons (corners ≤ 8 px on the 360-wide screen), no maker wording,
 * no app name, no orange (an alert shown to the user is not the system's mark).
 */

/** What the alert shows at one moment (all values already resolved from the box's clock). */
export type CrashAlertState = {
  /** 'alert' (the triangle, `Crash detected`, `Cancel`), 'countdown' (the digits, `Cancel`) or 'calling' (`Calling 911`). */
  mode: 'alert' | 'countdown' | 'calling';
  /** 'alert': how much of the ring round the triangle has run, 0 → 1. */
  ring: number;
  /** 'countdown': the number shown. */
  digits: number;
  /** 'countdown': the ink box drawn round `Cancel`, 0 → 1. */
  cancelBox: number;
  /** 'calling': the `Message playing` line's opacity (0: not yet), and its waveform's phase (s). */
  message: number;
  wave: number;
};

/** The alert's keys, seconds after the box enters (see `DetailBoxProps.alert`). */
export type CrashAlertKeys = {
  /** The ring round the triangle runs this long (default 10 s). */
  ringFor?: number;
  /** The screen turns to the countdown (default null: stays on the alert). */
  countdownAt?: number | null;
  /** When the digits read `countFrom` and start ticking in real seconds (default `countdownAt`). */
  countStartAt?: number;
  /** The number the countdown starts at (default 30). */
  countFrom?: number;
  /** A time-lapse of the digits (🎭, disclosed): from `from` to `to` over `for` s from `at`. */
  timelapse?: {from: number; to: number; at: number; for: number} | null;
  /** An ink box draws round `Cancel` (0.4 s). */
  cancelBoxAt?: number | null;
  /** The screen turns to `Calling 911`. */
  callingAt?: number | null;
  /** The speaker line comes in (`Message playing`, a neutral waveform). */
  messageAt?: number | null;
};

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

/** The alert's state at `t` s after the box enters. */
export const crashAlertAt = (k: CrashAlertKeys, t: number): CrashAlertState => {
  const calling = k.callingAt != null && t >= k.callingAt;
  const counting = !calling && k.countdownAt != null && t >= k.countdownAt;
  const from = k.countFrom ?? 30;
  const start = k.countStartAt ?? k.countdownAt ?? 0;
  let digits = Math.max(0, from - Math.max(0, Math.floor(t - start)));
  const tl = k.timelapse;
  if (tl && t >= tl.at) {
    const u = clamp01((t - tl.at) / Math.max(0.01, tl.for));
    digits = Math.round(tl.from + (tl.to - tl.from) * u);
  }
  return {
    mode: calling ? 'calling' : counting ? 'countdown' : 'alert',
    ring: clamp01(t / (k.ringFor ?? 10)),
    digits,
    cancelBox: k.cancelBoxAt == null ? 0 : clamp01((t - k.cancelBoxAt) / 0.4),
    message: k.messageAt == null ? 0 : clamp01((t - k.messageAt) / 0.3),
    wave: k.messageAt == null ? 0 : Math.max(0, t - k.messageAt),
  };
};

/** A cache key for redrawing only when the picture changes. */
export const crashAlertKey = (s: CrashAlertState) =>
  `${s.mode}|${Math.round(s.ring * 300)}|${s.digits}|${Math.round(s.cancelBox * 20)}|${Math.round(s.message * 20)}|${Math.round(s.wave * 15)}`;

/** Draws the alert into a w × h canvas (designed on a 360-wide screen; ≥ 28 px type at the box's size). */
export const drawCrashAlert = (cx: CanvasRenderingContext2D, w: number, h: number, s: CrashAlertState) => {
  const P = palette('day');
  const u = w / 360;
  cx.save();
  cx.setTransform(1, 0, 0, 1, 0, 0);
  cx.fillStyle = P.bg;
  cx.fillRect(0, 0, w, h);
  cx.textAlign = 'center';
  cx.textBaseline = 'middle';
  const cxm = w / 2;
  // an outlined button: 2 px ink, corners 6 px, Inter 700 ≥ 32 px
  const button = (label: string, y: number, box: number) => {
    const bw = 200 * u;
    const bh = 64 * u;
    const x = cxm - bw / 2;
    cx.strokeStyle = P.text;
    cx.lineWidth = 2 * u;
    roundRect(cx, x, y, bw, bh, 6 * u);
    cx.stroke();
    cx.fillStyle = P.text;
    cx.font = `700 ${Math.round(32 * u)}px ${fonts.sans}, Arial`;
    cx.fillText(label, cxm, y + bh / 2 + 1 * u);
    if (box > 0) {
      // the ink emphasis box drawing round the button, clockwise from top-left (3 px)
      const m = 10 * u;
      const pts: [number, number][] = [
        [x - m, y - m],
        [x + bw + m, y - m],
        [x + bw + m, y + bh + m],
        [x - m, y + bh + m],
        [x - m, y - m],
      ];
      const lens = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
      let left = box * lens.reduce((a, b) => a + b, 0);
      cx.lineWidth = 3 * u;
      cx.beginPath();
      cx.moveTo(...pts[0]);
      for (let i = 0; i < lens.length && left > 0; i++) {
        const f = Math.min(1, left / lens[i]);
        cx.lineTo(pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f);
        left -= lens[i];
      }
      cx.stroke();
    }
  };
  if (s.mode === 'alert') {
    const ty = 170 * u;
    // the thin ring running round the triangle (4 px ink), from the top, clockwise
    cx.strokeStyle = P.line;
    cx.lineWidth = 4 * u;
    cx.beginPath();
    cx.arc(cxm, ty, 92 * u, 0, Math.PI * 2);
    cx.stroke();
    cx.strokeStyle = P.text;
    cx.beginPath();
    cx.arc(cxm, ty, 92 * u, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * s.ring);
    cx.stroke();
    // the warning triangle: `warning` fill, 4 px ink outline, an ink "!"
    const r = 56 * u;
    cx.beginPath();
    cx.moveTo(cxm, ty - r);
    cx.lineTo(cxm + r * 0.95, ty + r * 0.62);
    cx.lineTo(cxm - r * 0.95, ty + r * 0.62);
    cx.closePath();
    cx.fillStyle = section.warning;
    cx.fill();
    cx.lineJoin = 'round';
    cx.lineWidth = 4 * u;
    cx.strokeStyle = P.text;
    cx.stroke();
    cx.fillStyle = P.text;
    cx.fillRect(cxm - 4 * u, ty - r * 0.42, 8 * u, r * 0.58);
    cx.beginPath();
    cx.arc(cxm, ty + r * 0.36, 5 * u, 0, Math.PI * 2);
    cx.fill();
    cx.font = `700 ${Math.round(42 * u)}px ${fonts.sans}, Arial`;
    cx.fillText('Crash detected', cxm, 318 * u);
    button('Cancel', h - 120 * u, 0);
  } else if (s.mode === 'countdown') {
    cx.fillStyle = P.text;
    cx.font = `800 ${Math.round(150 * u)}px ${fonts.sans}, Arial`;
    cx.fillText(String(s.digits), cxm, 210 * u);
    button('Cancel', h - 120 * u, s.cancelBox);
  } else {
    // a plain handset glyph (ink), the headline, the speaker line
    const gy = 150 * u;
    cx.save();
    cx.translate(cxm, gy);
    cx.rotate(-Math.PI / 4);
    cx.fillStyle = P.text;
    roundRect(cx, -14 * u, -46 * u, 28 * u, 92 * u, 8 * u);
    cx.fill();
    roundRect(cx, -26 * u, -52 * u, 40 * u, 26 * u, 8 * u);
    cx.fill();
    roundRect(cx, -26 * u, 26 * u, 40 * u, 26 * u, 8 * u);
    cx.fill();
    cx.restore();
    cx.fillStyle = P.text;
    cx.font = `700 ${Math.round(42 * u)}px ${fonts.sans}, Arial`;
    cx.fillText('Calling 911', cxm, 280 * u);
    if (s.message > 0) {
      cx.globalAlpha = s.message;
      cx.font = `600 ${Math.round(28 * u)}px ${fonts.sans}, Arial`;
      cx.fillStyle = P.sub;
      cx.fillText('Message playing', cxm, 352 * u);
      // a neutral waveform: bars swaying (no speech shape)
      cx.fillStyle = P.key;
      const n = 17;
      for (let i = 0; i < n; i++) {
        const a = 0.35 + 0.65 * Math.abs(Math.sin(s.wave * 5 + i * 0.9) * Math.cos(i * 0.37 + s.wave * 1.7));
        const bh = 50 * u * a;
        const x = cxm + (i - (n - 1) / 2) * 14 * u;
        roundRect(cx, x - 4 * u, 420 * u - bh / 2, 8 * u, bh, 4 * u);
        cx.fill();
      }
      cx.globalAlpha = 1;
    }
  }
  cx.restore();
};

const roundRect = (cx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
  cx.beginPath();
  cx.moveTo(x + r, y);
  cx.arcTo(x + w, y, x + w, y + h, r);
  cx.arcTo(x + w, y + h, x, y + h, r);
  cx.arcTo(x, y + h, x, y, r);
  cx.arcTo(x, y, x + w, y, r);
  cx.closePath();
};
