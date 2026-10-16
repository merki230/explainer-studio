import {Easing, interpolate} from 'remotion';
import {fonts} from '../fonts';
import {section, type Mood} from '../theme';

/*
 * The phone-screen kit (style guide v0.8 § 8 "Phone-screen kit"): generic, realistic, full-colour
 * interfaces drawn on a canvas, so the 3D phone's screen texture and the detail box are drawn by
 * the same function from the same state and always match. No real app, logo, brand colour or
 * trade dress; invented names ("Shop", "Feed") and products. Orange appears only where the system
 * shows: the targeted ad's 5 px edge.
 *
 * Coordinates are in screen units: the screen is 360 × 686 (the phone's 0.105 × 0.2 glass).
 */

export const SCREEN_W = 360;
export const SCREEN_H = 686;

export type ScreenApp = 'lock' | 'notification' | 'search' | 'results' | 'feed' | 'assistant';

/** One step of a phone's screen script: from `at` (seconds into the scene) the phone shows `app`. */
export type ScreenStep = {
  at: number;
  app: ScreenApp;
  /** search / results: the query. */
  query?: string;
  /** search: seconds the typing takes (default 0.11 s a letter), starting 0.2 s after `at`. */
  typeFor?: number;
  /** feed: seconds after `at` when the ad slides in (default 0.5). */
  adAt?: number;
  /** feed: seconds into the scene when the ad gets the system's orange edge (it stays: the trace). */
  markAt?: number;
  /** notification: who it's from and what it says (generic). assistant: the line it shows (`text`). */
  from?: string;
  text?: string;
  /**
   * Mic-in-use indicator in the status bar: 'on' (neutral: an app is using the mic) or 'system' (the
   * system's orange: only when the story says the mic is the hidden system). Default off.
   */
  mic?: 'off' | 'on' | 'system';
};

/** Everything the drawing needs at one instant. */
export type ScreenState = {
  app: ScreenApp;
  mood: Mood;
  clock: string;
  date: string;
  query: string;
  /** Letters typed so far. */
  typed: number;
  /** The key being pressed right now, if any. */
  pressed: string | null;
  /** 0–1: results / notification / ad arriving. */
  enter: number;
  /** 0–1: the system's orange edge on the ad. */
  mark: number;
  from: string;
  text: string;
  mic: 'off' | 'on' | 'system';
  /** Seconds since this step started (drives the assistant's waveform). */
  local: number;
};

const ease = (x: number, a: number, b: number) =>
  interpolate(x, [a, b], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

/** The screen's state at `t` seconds into the scene (the last step that has started). */
export const screenStateAt = (
  script: ScreenStep[],
  t: number,
  o: {mood: Mood; clock: string; date: string},
): ScreenState => {
  const steps = [...script].sort((a, b) => a.at - b.at);
  const s = [...steps].reverse().find((x) => t >= x.at) ?? steps[0] ?? {at: 0, app: 'lock' as const};
  const query = s.query ?? '';
  const local = t - s.at;
  let typed = query.length;
  let pressed: string | null = null;
  let enter = 1;
  if (s.app === 'search') {
    const per = (s.typeFor ?? 0.11 * query.length) / Math.max(1, query.length);
    const k = (local - 0.2) / per;
    typed = Math.max(0, Math.min(query.length, Math.floor(k) + 1));
    if (local < 0.2) typed = 0;
    // a key shows pressed for the first 60% of its letter's slot
    if (typed > 0 && typed <= query.length && k - Math.floor(k) < 0.6 && k < query.length) {
      pressed = query[typed - 1];
    }
  } else if (s.app === 'results' || s.app === 'notification') {
    enter = ease(local, 0, 0.35);
  } else if (s.app === 'feed') {
    const adAt = s.adAt ?? 0.5;
    enter = ease(local, adAt, adAt + 0.45);
  }
  const mark = s.app === 'feed' && s.markAt !== undefined ? ease(t, s.markAt, s.markAt + 0.3) : 0;
  return {
    app: s.app,
    mood: o.mood,
    clock: o.clock,
    date: o.date,
    query,
    typed,
    pressed,
    enter,
    mark,
    from: s.from ?? 'Shop',
    text: s.text ?? (s.app === 'assistant' ? 'Waiting for the wake word' : 'New deals picked for you'),
    mic: s.mic ?? 'off',
    local,
  };
};

/** A key that changes when the drawing would change (to skip redrawing identical frames). */
export const screenKey = (s: ScreenState) =>
  [
    s.app,
    s.mood,
    s.clock,
    s.query,
    s.typed,
    s.pressed,
    s.enter.toFixed(3),
    s.mark.toFixed(3),
    s.text,
    s.mic,
    s.app === 'assistant' ? Math.round(s.local * 30) : 0,
  ].join('|');

/** Night: dark UI; Day: light UI (§ 8 kit). Neutral accents only. */
const palette = (mood: Mood) =>
  mood === 'night'
    ? {
        bg: '#121318',
        text: '#e9ecf2',
        sub: '#9aa1ad',
        field: '#22252d',
        card: '#1b1d23',
        line: '#2c3039',
        kb: '#1d1f25',
        key: '#3a3f4b',
        keyDown: '#6b7280',
        button: '#e9ecf2',
        buttonInk: '#121318',
        tile: '#2a2d35',
      }
    : {
        bg: '#fafafa',
        text: '#15171a',
        sub: '#6b7078',
        field: '#eef0f3',
        card: '#fdfdfd',
        line: '#dfe2e7',
        kb: '#d5d8de',
        key: '#fdfdfd',
        keyDown: '#a8adb6',
        button: '#15171a',
        buttonInk: '#fafafa',
        tile: '#f2f3f5',
      };

const rr = (cx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
  cx.beginPath();
  cx.moveTo(x + r, y);
  cx.arcTo(x + w, y, x + w, y + h, r);
  cx.arcTo(x + w, y + h, x, y + h, r);
  cx.arcTo(x, y + h, x, y, r);
  cx.arcTo(x, y, x + w, y, r);
  cx.closePath();
};

const font = (weight: number, size: number) => `${weight} ${size}px ${fonts.sans}, Arial, sans-serif`;

const mix = (a: number, b: number, k: number) => a + (b - a) * k;

/** `text` cut with an ellipsis to fit `maxW` (in the context's current font). */
const fitText = (cx: CanvasRenderingContext2D, text: string, maxW: number) => {
  if (cx.measureText(text).width <= maxW) return text;
  let n = text.length;
  while (n > 1 && cx.measureText(`${text.slice(0, n).trimEnd()}…`).width > maxW) n--;
  return `${text.slice(0, n).trimEnd()}…`;
};

/*
 * Full-frame layout (style guide § 8 "Screen placement"): when a screen fills the frame (the
 * bookends), nothing readable sits above y 520 of the 1920 frame (screen y ≈ 186) and all text
 * stays at x ≤ 888 (screen x ≈ 300). `full` 0–1 blends the phone layout into it: the status bar
 * fades out, the lock clock drops to ≈ y 640, the search and results content moves down, and only
 * the first suggestion row stays (its text ends above y 1000, clear of a 2-line caption page).
 */
/** Right edge for text, screen units: the phone's own margin, or x 888 of the frame when full-frame. */
const textRight = (full: number) => mix(334, 300, full);

/** The invented product: a small espresso machine (neutral colours, no orange). */
const machine = (cx: CanvasRenderingContext2D, x: number, y: number, s: number) => {
  cx.save();
  cx.translate(x, y);
  cx.scale(s, s);
  cx.fillStyle = '#2b2b30';
  rr(cx, -28, -42, 56, 18, 4);
  cx.fill();
  cx.fillStyle = '#c8ccd2';
  cx.fillRect(-25, -24, 50, 46);
  cx.fillStyle = '#2b2b30';
  cx.fillRect(-13, -12, 26, 9);
  cx.fillRect(-2, -3, 4, 7);
  cx.fillStyle = '#f4f1ea';
  cx.fillRect(-10, 6, 20, 12);
  cx.fillStyle = '#6b3e22';
  cx.fillRect(-9, 7, 18, 3);
  cx.fillStyle = '#2b2b30';
  rr(cx, -30, 22, 60, 5, 2);
  cx.fill();
  cx.fillStyle = '#5a8f6a'; // power light: green, never the system's orange
  cx.beginPath();
  cx.arc(20, -33, 3, 0, Math.PI * 2);
  cx.fill();
  cx.restore();
};

const statusBar = (cx: CanvasRenderingContext2D, s: ScreenState, p: ReturnType<typeof palette>, full = 0) => {
  if (full >= 0.999) return;
  cx.save();
  cx.globalAlpha *= 1 - full;
  cx.fillStyle = p.text;
  cx.font = font(600, 20);
  cx.textBaseline = 'middle';
  cx.textAlign = 'left';
  cx.fillText(s.clock, 24, 24);
  // signal bars and battery, drawn
  for (let i = 0; i < 4; i++) cx.fillRect(268 + i * 8, 30 - (i + 1) * 4, 5, (i + 1) * 4);
  cx.strokeStyle = p.text;
  cx.lineWidth = 2;
  rr(cx, 304, 16, 34, 16, 4);
  cx.stroke();
  cx.fillRect(307, 19, 22, 10);
  micIndicator(cx, s, p);
  cx.restore();
};

/** The mic-in-use indicator: a pill with a mic glyph left of the signal bars. */
const micIndicator = (cx: CanvasRenderingContext2D, s: ScreenState, p: ReturnType<typeof palette>) => {
  if (s.mic === 'off') return;
  const c = s.mic === 'system' ? section.orange : p.text;
  cx.fillStyle = c;
  rr(cx, 216, 12, 40, 24, 12);
  cx.fill();
  cx.fillStyle = s.mic === 'system' ? '#fff0e0' : p.bg;
  rr(cx, 232, 16, 8, 12, 4);
  cx.fill();
  cx.strokeStyle = cx.fillStyle;
  cx.lineWidth = 2;
  cx.beginPath();
  cx.arc(236, 24, 7, 0.15 * Math.PI, 0.85 * Math.PI);
  cx.stroke();
};

const field = (cx: CanvasRenderingContext2D, y: number, s: ScreenState, p: ReturnType<typeof palette>, full = 0) => {
  cx.fillStyle = p.field;
  rr(cx, 14, y, 332, 64, 14);
  cx.fill();
  // magnifier
  cx.strokeStyle = p.sub;
  cx.lineWidth = 3.5;
  cx.beginPath();
  cx.arc(44, y + 30, 10, 0, Math.PI * 2);
  cx.stroke();
  cx.beginPath();
  cx.moveTo(51, y + 37);
  cx.lineTo(59, y + 45);
  cx.stroke();
  const shown = s.query.slice(0, s.typed);
  cx.textBaseline = 'middle';
  cx.textAlign = 'left';
  // the whole query at the size it fits (down to 24), so it never runs past the text edge
  const room = textRight(full) - 72 - 6;
  cx.font = font(600, 32);
  const w32 = cx.measureText(s.query || 'Search').width;
  cx.font = font(600, Math.max(24, Math.min(32, (32 * room) / Math.max(1, w32))));
  const text = fitText(cx, shown || 'Search', room);
  cx.fillStyle = shown ? p.text : p.sub;
  cx.fillText(text, 72, y + 33);
  if (s.app === 'search') {
    const w = shown ? cx.measureText(text).width : 0;
    cx.fillStyle = p.text;
    cx.fillRect(74 + w, y + 16, 3, 34);
  }
};

const keyboard = (cx: CanvasRenderingContext2D, s: ScreenState, p: ReturnType<typeof palette>) => {
  const top = 420;
  cx.fillStyle = p.kb;
  cx.fillRect(0, top, SCREEN_W, SCREEN_H - top);
  const rows = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];
  const kw = 34;
  rows.forEach((row, ri) => {
    const off = (SCREEN_W - row.length * kw) / 2;
    row.split('').forEach((k, ki) => {
      const x = off + ki * kw + 2;
      const y = top + 14 + ri * 62;
      cx.fillStyle = k === s.pressed ? p.keyDown : p.key;
      rr(cx, x, y, kw - 4, 52, 6);
      cx.fill();
      cx.fillStyle = p.text;
      cx.font = font(500, 24);
      cx.textAlign = 'center';
      cx.textBaseline = 'middle';
      cx.fillText(k, x + (kw - 4) / 2, y + 27);
    });
  });
  cx.fillStyle = s.pressed === ' ' ? p.keyDown : p.key;
  rr(cx, 90, top + 14 + 3 * 62, 180, 50, 6);
  cx.fill();
};

const header = (cx: CanvasRenderingContext2D, title: string, p: ReturnType<typeof palette>, y = 74, x = 20) => {
  cx.fillStyle = p.text;
  cx.font = font(800, 30);
  cx.textAlign = 'left';
  cx.textBaseline = 'middle';
  cx.fillText(title, x, y);
};

/**
 * Draw a screen state into a 2D context, in screen units (360 × 686). Scale the context first to
 * draw at another size. `full` 0–1: the full-frame layout (see above; the bookends), default 0.
 */
export const drawScreen = (cx: CanvasRenderingContext2D, s: ScreenState, full = 0) => {
  const p = palette(s.mood);
  const f = Math.max(0, Math.min(1, full));
  cx.save();
  cx.fillStyle = p.bg;
  cx.fillRect(0, 0, SCREEN_W, SCREEN_H);
  cx.textAlign = 'left';

  if (s.app === 'assistant') {
    statusBar(cx, s, p, f);
    // a generic voice assistant waiting for its wake word: a mic button and a quiet waveform
    cx.fillStyle = p.field;
    cx.beginPath();
    cx.arc(SCREEN_W / 2, 250, 74, 0, Math.PI * 2);
    cx.fill();
    cx.fillStyle = p.text;
    rr(cx, SCREEN_W / 2 - 15, 210, 30, 54, 15);
    cx.fill();
    cx.strokeStyle = p.text;
    cx.lineWidth = 6;
    cx.beginPath();
    cx.arc(SCREEN_W / 2, 248, 30, 0.1 * Math.PI, 0.9 * Math.PI);
    cx.stroke();
    cx.fillRect(SCREEN_W / 2 - 3, 278, 6, 18);
    // waveform: small, slow, deterministic
    for (let i = 0; i < 15; i++) {
      const hgt = 8 + 18 * (0.5 + 0.5 * Math.sin(s.local * 4 + i * 0.9)) * (0.4 + 0.6 * Math.sin((i / 14) * Math.PI));
      cx.fillStyle = p.sub;
      rr(cx, 62 + i * 16, 390 - hgt / 2, 8, hgt, 4);
      cx.fill();
    }
    cx.fillStyle = p.text;
    cx.font = font(700, 32);
    cx.textAlign = 'center';
    cx.textBaseline = 'middle';
    cx.fillText(s.text, SCREEN_W / 2, 470, 330);
  } else if (s.app === 'lock' || s.app === 'notification') {
    cx.fillStyle = p.text;
    cx.textAlign = 'center';
    cx.textBaseline = 'middle';
    // full-frame: the clock centred at ≈ y 640 of the frame (screen y 229)
    const dy = 29 * f;
    cx.font = font(700, 96);
    cx.fillText(s.clock, SCREEN_W / 2, 200 + dy);
    micIndicator(cx, s, p);
    cx.font = font(500, 26);
    cx.fillStyle = p.sub;
    cx.fillText(s.date, SCREEN_W / 2, 268 + dy);
    if (s.app === 'notification') {
      const y = 320 + dy + (1 - s.enter) * -40;
      cx.globalAlpha = s.enter;
      cx.fillStyle = p.card;
      rr(cx, 14, y, 332, 120, 18);
      cx.fill();
      cx.fillStyle = p.tile;
      rr(cx, 30, y + 22, 44, 44, 10);
      cx.fill();
      cx.textAlign = 'left';
      cx.fillStyle = p.text;
      cx.font = font(700, 28);
      cx.fillText(s.from, 88, y + 42);
      cx.font = font(500, 26);
      cx.fillStyle = p.sub;
      cx.fillText(s.text, 30, y + 92, 300);
      cx.globalAlpha = 1;
    }
  } else if (s.app === 'search' || s.app === 'results') {
    statusBar(cx, s, p, f);
    // full-frame: the header's text below y 520 of the frame, the field and rows under it
    header(cx, 'Shop', p, mix(74, 200, f), mix(20, 32, f));
    field(cx, mix(110, 222, f), s, p, f);
    if (s.app === 'search') {
      // suggestions that match what's typed so far
      const typed = s.query.slice(0, s.typed);
      if (typed.length > 0) {
        const sugg = [s.query, `${s.query} with grinder`, `${s.query} small`];
        const top = mix(206, 296, f);
        const gap = mix(62, 46, f);
        // full-frame: no row text near the caption page (a 2-line page reaches up to ≈ y 1040): one row
        const lowest = mix(SCREEN_H, 340, f);
        sugg.forEach((q, i) => {
          const y = top + i * gap;
          if (y + 24 > lowest) return;
          cx.fillStyle = p.text;
          cx.font = font(500, 28);
          cx.textBaseline = 'middle';
          cx.fillText(fitText(cx, q, textRight(f) - 64), 64, y + 24);
          cx.strokeStyle = p.sub;
          cx.lineWidth = 2.5;
          cx.beginPath();
          cx.arc(38, y + 22, 7, 0, Math.PI * 2);
          cx.stroke();
          cx.fillStyle = p.line;
          cx.fillRect(20, y + gap - 8, 320, 2);
        });
      }
      keyboard(cx, s, p);
    } else {
      cx.globalAlpha = s.enter;
      for (let i = 0; i < 4; i++) {
        const y = mix(196, 306, f) + i * 118 + (1 - s.enter) * 16;
        if (y + 100 > SCREEN_H) break;
        cx.fillStyle = p.tile;
        rr(cx, 16, y, 100, 100, 12);
        cx.fill();
        machine(cx, 66, y + 52, 0.9);
        cx.fillStyle = p.text;
        cx.font = font(700, 26);
        cx.textBaseline = 'middle';
        cx.fillText(['Café Pro', 'Brewmate 2', 'Crema One', 'Barista S'][i], 132, y + 30);
        cx.fillStyle = p.sub;
        cx.font = font(600, 24);
        cx.fillText(['$249', '$189', '$329', '$219'][i], 132, y + 70);
      }
      cx.globalAlpha = 1;
    }
  } else if (s.app === 'feed') {
    statusBar(cx, s, p, f);
    // full-frame: the header fades out (it would sit above y 520 of the frame)
    if (f < 0.999) {
      cx.globalAlpha = 1 - f;
      header(cx, 'Feed', p);
      cx.globalAlpha = 1;
    }
    // a post at the top
    cx.fillStyle = p.card;
    rr(cx, 14, 110, 332, 96, 16);
    cx.fill();
    cx.fillStyle = p.tile;
    cx.beginPath();
    cx.arc(52, 158, 22, 0, Math.PI * 2);
    cx.fill();
    cx.fillStyle = p.line;
    rr(cx, 88, 138, 180, 14, 7);
    cx.fill();
    rr(cx, 88, 164, 120, 14, 7);
    cx.fill();
    // the ad slides in from below
    const y = 226 + (1 - s.enter) * 300;
    cx.globalAlpha = Math.min(1, s.enter * 1.5);
    cx.fillStyle = p.card;
    rr(cx, 14, y, 332, 368, 18);
    cx.fill();
    if (s.mark > 0) {
      // the system's mark: a 5 px orange edge (the only orange on a screen)
      cx.globalAlpha = s.mark * Math.min(1, s.enter * 1.5);
      cx.strokeStyle = section.orange;
      cx.lineWidth = 5;
      rr(cx, 16.5, y + 2.5, 327, 363, 16);
      cx.stroke();
      cx.globalAlpha = Math.min(1, s.enter * 1.5);
    }
    cx.fillStyle = p.sub;
    cx.font = font(700, 20);
    cx.textBaseline = 'middle';
    cx.fillText('SPONSORED', 34, y + 30);
    const g = cx.createLinearGradient(0, y + 50, 0, y + 220);
    g.addColorStop(0, s.mood === 'night' ? '#2d2a28' : '#fdf3e6');
    g.addColorStop(1, s.mood === 'night' ? '#24211f' : '#f2e2cf');
    cx.fillStyle = g;
    rr(cx, 30, y + 50, 300, 170, 12);
    cx.fill();
    machine(cx, 180, y + 140, 1.5);
    cx.fillStyle = p.text;
    cx.font = font(800, 32);
    const title = 'Café Pro Espresso';
    const tw = cx.measureText(title).width;
    cx.font = font(800, Math.min(32, (32 * (textRight(f) - 34)) / Math.max(1, tw)));
    cx.fillText(title, 34, y + 258);
    cx.fillStyle = p.sub;
    cx.font = font(600, 30);
    cx.fillText('$249', 34, y + 314);
    // full-frame: the button moves in so its text stays at x ≤ 888 of the frame
    const bx = 196 - 30 * f;
    cx.fillStyle = p.button;
    rr(cx, bx, y + 290, 132, 48, 10);
    cx.fill();
    cx.fillStyle = p.buttonInk;
    cx.font = font(700, 24);
    cx.textAlign = 'center';
    cx.fillText('Shop now', bx + 66, y + 315);
    cx.globalAlpha = 1;
  }
  cx.restore();
};

/** The part of the screen that matters, for the detail box: [x, y, w, h] in screen units. */
export const focusRect = (s: ScreenState): [number, number, number, number] => {
  if (s.app === 'feed') return [0, 214, 360, 392];
  if (s.app === 'lock') return [0, 80, 360, 300];
  if (s.app === 'notification') return [0, 150, 360, 320];
  if (s.app === 'assistant') return [0, 0, 360, 520];
  return [0, 40, 360, 360]; // search, results: the field and what's under it
};

let fitScratch: HTMLCanvasElement | null = null;

/**
 * Draw a screen state into a `w` × `h` px context whose shape is taller than the kit's 360 × 686
 * (a realistic phone's display is ≈ 1 : 2.1): the kit is drawn at the full width, centred, and its
 * first and last rows are stretched into the bands above and below (they are plain background or
 * wallpaper there), so nothing is squashed.
 */
export const drawScreenFit = (cx: CanvasRenderingContext2D, s: ScreenState, w: number, h: number) => {
  const k = w / SCREEN_W;
  const kh = Math.round(SCREEN_H * k);
  if (!fitScratch) fitScratch = document.createElement('canvas');
  if (fitScratch.width !== w || fitScratch.height !== kh) {
    fitScratch.width = w;
    fitScratch.height = kh;
  }
  const sx = fitScratch.getContext('2d');
  if (!sx) return;
  sx.setTransform(k, 0, 0, k, 0, 0);
  drawScreen(sx, s);
  const top = Math.max(0, Math.floor((h - kh) / 2));
  cx.setTransform(1, 0, 0, 1, 0, 0);
  cx.drawImage(fitScratch, 0, 0, w, kh, 0, top, w, kh);
  if (top > 0) {
    cx.drawImage(fitScratch, 0, 0, w, 1, 0, 0, w, top);
    cx.drawImage(fitScratch, 0, kh - 1, w, 1, 0, top + kh, w, h - top - kh);
  }
};
