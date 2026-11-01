import {fonts} from '../fonts';
import {section} from '../theme';
import {palette} from './screenKit';

/*
 * No. 012 (R4): a generic driving-score app as its user sees it, drawn on a canvas for the detail box
 * (`content: 'trip-app'`). Day UI (the phone-screen kit's palette), an invented one-word name and icon, no real
 * app's look. Three pages: the trip (a grey route drawing on a plain map, orange pins landing with ink labels), the
 * scores (two rows, orange bars, no numbers) and the price (a PRICE row under them: a marker on an ink scale, ↓ / ↑
 * in ink, no numbers). Orange only for the system's marks: the pins and the score bars (style guide § 6, § 8 kit).
 * Every text ≥ 28 px at the box's default 360 px width.
 */

export type TripPin = {
  /** Seconds after the box enters when it lands. */
  at: number;
  /** Its ink label (≥ 28 px), e.g. 'HARD BRAKE'. */
  label: string;
  /** Where on the route (0 → 1, start → home). */
  k: number;
};

export type TripAppState = {
  appName: string;
  /** 0 → 1: the route drawn. */
  route: number;
  /** Each pin: 0 → 1 landing (a drop with a little bounce), its swell (1 = rest). */
  pins: {label: string; k: number; land: number; swell: number}[];
  /** 0 trip page → 1 scores page (the page slides across). */
  page: number;
  /** The score rows: fill 0 → 1 (× the value) and a swell. */
  scores: {label: string; value: number; fill: number; swell: number}[];
  /** 0 → 1: the PRICE row in; the marker −1 (lower) → 1 (higher); the arrow shown: −1 ↓, 1 ↑, 0 none (with its strength). */
  price: number;
  marker: number;
  arrow: number;
  arrowK: number;
};

const font = (weight: number, size: number) => `${weight} ${size}px ${fonts.sans}, Arial, sans-serif`;

const rr = (cx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
  cx.beginPath();
  cx.moveTo(x + r, y);
  cx.arcTo(x + w, y, x + w, y + h, r);
  cx.arcTo(x + w, y + h, x, y + h, r);
  cx.arcTo(x, y + h, x, y, r);
  cx.arcTo(x, y, x + w, y, r);
  cx.closePath();
};

/** The route on the map, 0 → 1 (map units: the map's own w × h): a home-bound drive with two turns. */
const routeAt = (k: number, w: number, h: number): [number, number] => {
  const pts: [number, number][] = [
    [0.1, 0.86],
    [0.1, 0.52],
    [0.48, 0.52],
    [0.48, 0.2],
    [0.88, 0.2],
  ];
  const seg: number[] = [0];
  for (let i = 1; i < pts.length; i++)
    seg.push(seg[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const s = Math.max(0, Math.min(1, k)) * seg[seg.length - 1];
  let i = 1;
  while (i < seg.length - 1 && seg[i] < s) i++;
  const u = (s - seg[i - 1]) / Math.max(1e-9, seg[i] - seg[i - 1]);
  return [(pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * u) * w, (pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * u) * h];
};

/** The invented icon: a rounded ink tile with a pale road curving to a dot (no orange, no maker's mark). */
const icon = (cx: CanvasRenderingContext2D, x: number, y: number, s: number, ink: string, bg: string) => {
  cx.save();
  cx.fillStyle = ink;
  rr(cx, x, y, s, s, s * 0.24);
  cx.fill();
  cx.strokeStyle = bg;
  cx.lineWidth = s * 0.13;
  cx.lineCap = 'round';
  cx.beginPath();
  cx.moveTo(x + s * 0.24, y + s * 0.8);
  cx.bezierCurveTo(x + s * 0.24, y + s * 0.42, x + s * 0.72, y + s * 0.62, x + s * 0.7, y + s * 0.3);
  cx.stroke();
  cx.fillStyle = bg;
  cx.beginPath();
  cx.arc(x + s * 0.7, y + s * 0.26, s * 0.11, 0, Math.PI * 2);
  cx.fill();
  cx.restore();
};

/** An orange map pin (a drop, its point at (x, y)), `s` tall. */
const pin = (cx: CanvasRenderingContext2D, x: number, y: number, s: number, hole: string) => {
  const r = s * 0.36;
  const top = y - s;
  cx.fillStyle = section.orange;
  cx.beginPath();
  cx.moveTo(x, y);
  cx.bezierCurveTo(x - r * 0.4, y - s * 0.35, x - r * 1.05, top + r * 1.3, x - r, top + r);
  cx.arc(x, top + r, r, Math.PI, 0);
  cx.bezierCurveTo(x + r * 1.05, top + r * 1.3, x + r * 0.4, y - s * 0.35, x, y);
  cx.fill();
  cx.fillStyle = hole;
  cx.beginPath();
  cx.arc(x, top + r, r * 0.4, 0, Math.PI * 2);
  cx.fill();
};

/** Draw the app at one instant into a `w` × `h` box (designed at 360 wide; scales with `w`). */
export const drawTripApp = (cx: CanvasRenderingContext2D, w: number, h: number, s: TripAppState) => {
  const p = palette('day');
  const u = w / 360;
  cx.save();
  cx.setTransform(1, 0, 0, 1, 0, 0);
  cx.fillStyle = p.bg;
  cx.fillRect(0, 0, w, h);
  cx.scale(u, u);
  const W = 360;
  const H = h / u;
  // the header: the icon and the name, the same on every page
  icon(cx, 18, 16, 44, p.text, p.bg);
  cx.fillStyle = p.text;
  cx.font = font(800, 32);
  cx.textAlign = 'left';
  cx.textBaseline = 'middle';
  cx.fillText(s.appName, 74, 39);
  cx.fillStyle = p.line;
  cx.fillRect(0, 76, W, 2);
  const page = Math.max(0, Math.min(1, s.page));
  const body = (dx: number, draw: () => void) => {
    cx.save();
    cx.beginPath();
    cx.rect(0, 78, W, H - 78);
    cx.clip();
    cx.translate(dx, 0);
    draw();
    cx.restore();
  };
  // ---- the trip page
  if (page < 0.999)
    body(-W * page, () => {
      cx.fillStyle = p.sub;
      cx.font = font(600, 28);
      cx.textAlign = 'left';
      cx.fillText('Drive home', 18, 108);
      const mx = 14;
      const my = 132;
      const mw = W - 28;
      const mh = H - my - 14;
      cx.fillStyle = p.field;
      rr(cx, mx, my, mw, mh, 10);
      cx.fill();
      // minor streets: faint lines
      cx.strokeStyle = p.line;
      cx.lineWidth = 6;
      for (const [a, b, c, d] of [
        [0.0, 0.35, 1.0, 0.35],
        [0.0, 0.7, 1.0, 0.7],
        [0.3, 0.0, 0.3, 1.0],
        [0.7, 0.0, 0.7, 1.0],
      ]) {
        cx.beginPath();
        cx.moveTo(mx + a * mw, my + b * mh);
        cx.lineTo(mx + c * mw, my + d * mh);
        cx.stroke();
      }
      // the route, drawing on (grey: the trip itself is not the system)
      const k = Math.max(0, Math.min(1, s.route));
      cx.strokeStyle = p.sub;
      cx.lineWidth = 9;
      cx.lineCap = 'round';
      cx.lineJoin = 'round';
      cx.beginPath();
      for (let i = 0; i <= 60; i++) {
        const [x, y] = routeAt((i / 60) * k, mw, mh);
        if (i === 0) cx.moveTo(mx + x, my + y);
        else cx.lineTo(mx + x, my + y);
      }
      if (k > 0.001) cx.stroke();
      // start (a ring) and home (a filled square) in ink
      const [sx, sy] = routeAt(0, mw, mh);
      cx.strokeStyle = p.text;
      cx.fillStyle = p.bg;
      cx.lineWidth = 4;
      cx.beginPath();
      cx.arc(mx + sx, my + sy, 9, 0, Math.PI * 2);
      cx.fill();
      cx.stroke();
      if (k > 0.98) {
        const [ex, ey] = routeAt(1, mw, mh);
        cx.fillStyle = p.text;
        cx.fillRect(mx + ex - 9, my + ey - 9, 18, 18);
      }
      // the pins, each with its label on a paper chip (ink, ≥ 28 px)
      s.pins.forEach((q) => {
        if (q.land <= 0.001) return;
        const [x, y] = routeAt(q.k, mw, mh);
        const drop = (1 - q.land) * 40;
        const size = 44 * q.swell;
        cx.globalAlpha = Math.min(1, q.land * 3);
        pin(cx, mx + x, my + y - drop, size, p.bg);
        cx.font = font(700, 28);
        const tw = cx.measureText(q.label).width;
        // the label on the side with room
        const right = mx + x + 20 + tw + 12 < W - 6;
        const lx = right ? mx + x + 20 : mx + x - 20 - tw - 12;
        const ly = my + y - size * 0.62 - drop;
        cx.fillStyle = p.bg;
        rr(cx, lx, ly - 21, tw + 12, 40, 6);
        cx.fill();
        cx.strokeStyle = p.text;
        cx.lineWidth = 2;
        cx.stroke();
        cx.fillStyle = p.text;
        cx.textAlign = 'left';
        cx.fillText(q.label, lx + 6, ly);
        cx.globalAlpha = 1;
      });
    });
  // ---- the scores page (and the price row under it)
  if (page > 0.001)
    body(W * (1 - page), () => {
      cx.fillStyle = p.sub;
      cx.font = font(600, 28);
      cx.textAlign = 'left';
      cx.fillText('Your scores', 18, 108);
      s.scores.forEach((r, i) => {
        const y = 150 + i * 92;
        cx.fillStyle = p.text;
        cx.font = font(700, 28);
        cx.fillText(r.label, 18, y);
        const bx = 18;
        const by = y + 24;
        const bw = W - 36;
        const bh = 22 * (1 + 0.25 * (r.swell - 1));
        cx.fillStyle = p.line;
        rr(cx, bx, by - (bh - 22) / 2, bw, bh, bh / 2);
        cx.fill();
        const f = Math.max(0, Math.min(1, r.fill)) * Math.max(0, Math.min(1, r.value));
        if (f > 0.002) {
          cx.fillStyle = section.orange;
          rr(cx, bx, by - (bh - 22) / 2, Math.max(bh, bw * f), bh, bh / 2);
          cx.fill();
        }
      });
      const pk = Math.max(0, Math.min(1, s.price));
      if (pk > 0.001) {
        const y0 = 150 + s.scores.length * 92 + 8;
        cx.globalAlpha = pk;
        cx.fillStyle = p.line;
        cx.fillRect(0, y0 - 30, W, 2);
        cx.fillStyle = p.text;
        cx.font = font(700, 28);
        cx.fillText('PRICE', 18, y0 + 4);
        // the direction it is moving, in ink
        if (s.arrow !== 0 && s.arrowK > 0.01) {
          cx.globalAlpha = pk * Math.min(1, s.arrowK);
          cx.font = font(800, 34);
          cx.fillText(s.arrow < 0 ? '↓' : '↑', 122, y0 + 4);
          cx.globalAlpha = pk;
        }
        // the ink scale: a line with end ticks and a centre tick, no numbers; lower to the left
        const sx0 = 170;
        const sx1 = W - 24;
        const sy = y0 + 4;
        cx.strokeStyle = p.text;
        cx.lineWidth = 3;
        cx.beginPath();
        cx.moveTo(sx0, sy);
        cx.lineTo(sx1, sy);
        for (const x of [sx0, (sx0 + sx1) / 2, sx1]) {
          cx.moveTo(x, sy - (x === (sx0 + sx1) / 2 ? 8 : 12));
          cx.lineTo(x, sy + (x === (sx0 + sx1) / 2 ? 8 : 12));
        }
        cx.stroke();
        // the marker: an ink triangle pointing down onto the scale
        const mx = (sx0 + sx1) / 2 + (Math.max(-1, Math.min(1, s.marker)) * (sx1 - sx0)) / 2;
        cx.fillStyle = p.text;
        cx.beginPath();
        cx.moveTo(mx, sy - 6);
        cx.lineTo(mx - 13, sy - 30);
        cx.lineTo(mx + 13, sy - 30);
        cx.closePath();
        cx.fill();
        cx.globalAlpha = 1;
      }
    });
  cx.restore();
};
