import {fonts} from '../fonts';
import {section} from '../theme';

/** The cluster's own colours: a dark instrument face (a device screen, the same in both moods). */
const FACE = '#15171a';
const INK = '#e9ecf2';
const DIM = '#7d8592';

export type ClusterState = {
  /** The tire-pressure light on (warning yellow, flat) or off (`ledOff`). */
  warning: boolean;
  /** The speed shown (mph). */
  speed?: number;
  /** The trip line, e.g. "TRIP 12:40". */
  trip?: string;
};

/**
 * The generic tire-pressure symbol (§ 1 Warning lights): a cut-open tire's cross-section (a horseshoe
 * open at the top, tread notches on its flat bottom) with an exclamation mark inside, centred on
 * (cx, cy), `s` tall. No maker's variant.
 */
export const drawTireSymbol = (cx: CanvasRenderingContext2D, x: number, y: number, s: number, color: string) => {
  const w = s * 1.05;
  const lw = s * 0.11;
  cx.save();
  cx.strokeStyle = color;
  cx.fillStyle = color;
  cx.lineWidth = lw;
  cx.lineCap = 'round';
  cx.lineJoin = 'round';
  const l = x - w / 2;
  const r = x + w / 2;
  const top = y - s / 2;
  const bot = y + s * 0.36;
  cx.beginPath();
  // left wall from the top lip down, the flat tread, the right wall back up (rounded shoulders)
  cx.moveTo(l + w * 0.12, top);
  cx.quadraticCurveTo(l - w * 0.02, top + s * 0.38, l + w * 0.06, bot - s * 0.08);
  cx.quadraticCurveTo(l + w * 0.1, bot, l + w * 0.24, bot);
  cx.lineTo(r - w * 0.24, bot);
  cx.quadraticCurveTo(r - w * 0.1, bot, r - w * 0.06, bot - s * 0.08);
  cx.quadraticCurveTo(r + w * 0.02, top + s * 0.38, r - w * 0.12, top);
  cx.stroke();
  // tread notches under the flat bottom
  for (let i = 0; i < 4; i++) {
    const nx = l + w * (0.27 + i * 0.153);
    cx.fillRect(nx - lw * 0.35, bot + lw * 0.3, lw * 0.7, lw * 1.0);
  }
  // the exclamation mark
  cx.lineWidth = lw * 1.05;
  cx.beginPath();
  cx.moveTo(x, top + s * 0.12);
  cx.lineTo(x, y + s * 0.03);
  cx.stroke();
  cx.beginPath();
  cx.arc(x, y + s * 0.2, lw * 0.6, 0, Math.PI * 2);
  cx.fill();
  cx.restore();
};

/**
 * A flat 2D instrument cluster (No. 002), drawn into a w × h canvas: a speedometer arc with the speed,
 * the trip line, and the tire-pressure symbol, lit in `warning` yellow (flat, no glow) or off. Used by
 * the dashboard detail box and the car's own cluster face, so they match.
 */
export const drawCluster = (cx: CanvasRenderingContext2D, w: number, h: number, s: ClusterState) => {
  cx.save();
  cx.setTransform(1, 0, 0, 1, 0, 0);
  cx.fillStyle = FACE;
  cx.fillRect(0, 0, w, h);
  const k = h / 220;
  // the speedometer: an arc of ticks on the left
  const ox = w * 0.3;
  const oy = h * 0.62;
  const rad = h * 0.42;
  cx.strokeStyle = DIM;
  for (let i = 0; i <= 12; i++) {
    const a = Math.PI * (0.8 + (1.4 * i) / 12);
    const r0 = rad * (i % 2 ? 0.9 : 0.84);
    cx.lineWidth = (i % 2 ? 2 : 4) * k;
    cx.beginPath();
    cx.moveTo(ox + Math.cos(a) * r0, oy + Math.sin(a) * r0);
    cx.lineTo(ox + Math.cos(a) * rad, oy + Math.sin(a) * rad);
    cx.stroke();
  }
  const speed = s.speed ?? 38;
  const na = Math.PI * (0.8 + (1.4 * Math.min(120, speed)) / 120);
  cx.strokeStyle = INK;
  cx.lineWidth = 4 * k;
  cx.beginPath();
  cx.moveTo(ox, oy);
  cx.lineTo(ox + Math.cos(na) * rad * 0.8, oy + Math.sin(na) * rad * 0.8);
  cx.stroke();
  cx.fillStyle = INK;
  cx.textAlign = 'center';
  cx.textBaseline = 'alphabetic';
  cx.font = `800 ${Math.round(58 * k)}px ${fonts.sans}, Arial`;
  cx.fillText(String(speed), ox, oy + 30 * k);
  cx.fillStyle = DIM;
  cx.font = `700 ${Math.round(28 * k)}px ${fonts.sans}, Arial`;
  cx.fillText('MPH', ox, oy + 64 * k);
  // the trip line, top right
  cx.textAlign = 'left';
  cx.fillStyle = INK;
  cx.font = `700 ${Math.round(26 * k)}px ${fonts.mono}, monospace`;
  cx.textAlign = 'right';
  cx.fillText(s.trip ?? 'TRIP 12:40', w - 18 * k, h * 0.2);
  // the tire-pressure symbol, bottom right
  drawTireSymbol(cx, w * 0.75, h * 0.64, h * 0.42, s.warning ? section.warning : section.ledOff);
  cx.restore();
};
