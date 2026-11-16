import {fonts} from '../fonts';
import {CITY, section} from '../theme';
import {palette} from './screenKit';

/*
 * No. 019 (N5): a generic map app counting down a red light, as its user sees it, drawn on a canvas for the detail box
 * (`content: 'light-app'`). Day UI (the phone-screen kit's palette): a plain light-grey map with one road and a cross
 * street, a neutral dark car arrow on the road, and at the intersection a signal icon (three small lenses, the lit one
 * `signalRed` / `signalGreen`) with the seconds on a chip beside it. The system's mark (style guide § 1 Never orange,
 * § 8 kit, v0.18.15): a flat 5 px `orange` rule flush under the seconds chip, the chip's full width, square ends, no glow;
 * the number stays the UI's text colour. No real map style, logo, icon, brand colour or app name.
 */

export type LightAppState = {
  /** The light's state: the lit lens. 'yellow' and 'off' leave the seconds chip empty. */
  state: 'red' | 'green' | 'yellow' | 'off';
  /** The seconds shown (null: no number). */
  n: number | null;
  /** 0 → 1: the orange estimate edge (default 1). */
  mark?: number;
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

/** The box's height for a width (the map's aspect). */
export const LIGHT_APP_ASPECT = 0.9;

/** Draw the app at one instant into a `w` × `h` box (designed at 360 wide; scales with `w`). */
export const drawLightApp = (cx: CanvasRenderingContext2D, w: number, h: number, s: LightAppState) => {
  const p = palette('day');
  const u = w / 360;
  cx.save();
  cx.setTransform(1, 0, 0, 1, 0, 0);
  cx.fillStyle = p.field;
  cx.fillRect(0, 0, w, h);
  cx.scale(u, u);
  const W = 360;
  const H = h / u;
  // the blocks: faint lines of minor streets
  cx.strokeStyle = p.line;
  cx.lineWidth = 6;
  for (const x of [52, 300]) {
    cx.beginPath();
    cx.moveTo(x, 0);
    cx.lineTo(x, H);
    cx.stroke();
  }
  for (const y of [40, H - 30]) {
    cx.beginPath();
    cx.moveTo(0, y);
    cx.lineTo(W, y);
    cx.stroke();
  }
  // the road (up the box) and the cross street, white on the grey map, edged in the line grey
  const rx = 150;
  const rw = 56;
  const cy = H * 0.42;
  cx.fillStyle = p.card;
  cx.strokeStyle = p.line;
  cx.lineWidth = 3;
  cx.fillRect(rx - rw / 2, 0, rw, H);
  cx.fillRect(0, cy - rw / 2, W, rw);
  cx.strokeRect(rx - rw / 2, -4, rw, H + 8);
  cx.strokeRect(-4, cy - rw / 2, W + 8, rw);
  cx.fillStyle = p.card;
  cx.fillRect(rx - rw / 2 + 2, cy - rw / 2 + 2, rw - 4, rw - 4);
  // the car arrow, on the road below the crossing, pointing up the road (neutral dark)
  const ay = cy + rw / 2 + 62;
  cx.fillStyle = p.text;
  cx.beginPath();
  cx.moveTo(rx, ay - 26);
  cx.lineTo(rx + 18, ay + 18);
  cx.lineTo(rx, ay + 8);
  cx.lineTo(rx - 18, ay + 18);
  cx.closePath();
  cx.fill();
  // the signal icon at the crossing's near right corner: a dark housing, three small lenses
  const ix = rx + rw / 2 + 14;
  const iy = cy + rw / 2 + 8;
  const iw = 30;
  const ih = 80;
  cx.fillStyle = CITY.signalHousing;
  rr(cx, ix, iy, iw, ih, 7);
  cx.fill();
  const lenses: ['red' | 'yellow' | 'green', string, string][] = [
    ['red', section.signalRed, CITY.lensRed],
    ['yellow', section.warning, CITY.lensYellow],
    ['green', section.signalGreen, CITY.lensGreen],
  ];
  lenses.forEach(([k, on, off], i) => {
    cx.fillStyle = s.state === k ? on : off;
    cx.beginPath();
    cx.arc(ix + iw / 2, iy + 15 + i * 25, 9, 0, Math.PI * 2);
    cx.fill();
  });
  // the seconds chip beside it: the number in the UI's text colour (Inter 700, 64 px), the orange estimate edge under it
  if (s.n !== null && (s.state === 'red' || s.state === 'green')) {
    const txt = String(s.n);
    cx.font = font(700, 64);
    const tw = cx.measureText(txt).width;
    const chipW = Math.max(84, tw + 36);
    const chipH = 82;
    const chx = ix + iw + 12;
    const chy = iy - 1;
    cx.fillStyle = p.bg;
    cx.strokeStyle = p.line;
    cx.lineWidth = 2;
    rr(cx, chx, chy, chipW, chipH, 10);
    cx.fill();
    cx.stroke();
    cx.fillStyle = p.text;
    cx.textAlign = 'center';
    cx.textBaseline = 'middle';
    cx.fillText(txt, chx + chipW / 2, chy + chipH / 2 + 3);
    // the mark: flush under the chip, its full width, square ends, 5 px (at the box's 360 px design width)
    const k = Math.max(0, Math.min(1, s.mark ?? 1));
    if (k > 0.001) {
      cx.fillStyle = section.orange;
      cx.fillRect(chx, chy + chipH, chipW * k, 5);
    }
  }
  cx.restore();
};
