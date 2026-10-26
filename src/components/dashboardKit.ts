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
  /** Draw the tire-pressure symbol at all (default true). False: no symbol, not even dimmed (a cluster with no tire story). */
  tireLight?: boolean;
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
  if (s.tireLight !== false)
    drawTireSymbol(cx, w * 0.75, h * 0.64, h * 0.42, s.warning ? section.warning : section.ledOff);
  cx.restore();
};

export type EvClusterState = {
  /** The speed shown (mph). */
  speed: number;
  /** The power meter, −1 (full charge) → 0 → 1 (full power). Below 0 the CHARGE zone fills `orange` (the system's mark). */
  power: number;
  /** Draw the power meter (default true). False: the speed alone, centred in the face (No. 007, line 3b). */
  meter?: boolean;
  /**
   * The meter's POWER fill (above 0): 'ink' (default, the face's ink) or 'orange' (No. 007: the motor's
   * power as the system's mark, like the CHARGE zone).
   */
  powerColor?: 'ink' | 'orange';
};

/**
 * An electric car's cluster (No. 006), drawn into a w × h canvas (the detail box: 360 × 209): the
 * speed large with MPH beside it, and a power meter across the bottom, its CHARGE zone (left of the
 * zero mark) filling `orange` while the motor charges the battery (the system's mark on a screen,
 * § 1), its POWER side in the face's ink (or `orange` with `powerColor`). `meter: false` leaves the
 * speed alone, centred. Text ≥ 28 px at the detail box's size. No brand.
 */
export const drawEvCluster = (cx: CanvasRenderingContext2D, w: number, h: number, s: EvClusterState) => {
  cx.save();
  cx.setTransform(1, 0, 0, 1, 0, 0);
  cx.fillStyle = FACE;
  cx.fillRect(0, 0, w, h);
  const u = h / 209;
  const pad = 20 * u;
  const meter = s.meter !== false;
  // the speed, large, and its unit (without the meter: centred in the face)
  const base = meter ? 92 * u : h / 2 + 32 * u;
  cx.textBaseline = 'alphabetic';
  cx.textAlign = 'left';
  cx.fillStyle = INK;
  cx.font = `800 ${Math.round(88 * u)}px ${fonts.sans}, Arial`;
  const sp = String(Math.max(0, Math.round(s.speed)));
  const sw = cx.measureText(sp).width;
  cx.font = `700 ${Math.round(28 * u)}px ${fonts.sans}, Arial`;
  const uw = cx.measureText('MPH').width;
  const sx = meter ? pad : (w - sw - 12 * u - uw) / 2;
  cx.font = `800 ${Math.round(88 * u)}px ${fonts.sans}, Arial`;
  cx.fillText(sp, sx, base);
  cx.fillStyle = DIM;
  cx.font = `700 ${Math.round(28 * u)}px ${fonts.sans}, Arial`;
  cx.fillText('MPH', sx + sw + 12 * u, base);
  if (!meter) {
    cx.restore();
    return;
  }
  // the power meter: a bar with the zero mark at 40 %, CHARGE to its left
  const p = Math.max(-1, Math.min(1, s.power));
  const x0 = pad;
  const x1 = w - pad;
  const zero = x0 + (x1 - x0) * 0.4;
  const y0 = 120 * u;
  const bh = 26 * u;
  cx.strokeStyle = DIM;
  cx.lineWidth = 2 * u;
  cx.strokeRect(x0, y0, x1 - x0, bh);
  if (p < 0) {
    cx.fillStyle = section.orange;
    cx.fillRect(zero + (zero - x0) * p, y0, -(zero - x0) * p, bh);
  } else if (p > 0) {
    cx.fillStyle = s.powerColor === 'orange' ? section.orange : INK;
    cx.fillRect(zero, y0, (x1 - zero) * p, bh);
  }
  cx.fillStyle = INK;
  cx.fillRect(zero - 2 * u, y0 - 8 * u, 4 * u, bh + 16 * u);
  cx.font = `700 ${Math.round(28 * u)}px ${fonts.sans}, Arial`;
  cx.fillStyle = p < 0 ? INK : DIM;
  cx.fillText('CHARGE', x0, 192 * u);
  cx.textAlign = 'right';
  cx.fillStyle = p > 0 ? INK : DIM;
  cx.fillText('POWER', x1, 192 * u);
  cx.restore();
};

export type GasClusterState = {
  /** Engine speed, rpm (the tach's needle). */
  rpm: number;
  /** The gear digit (1, 2, ... or a letter such as 'N'). */
  gear: number | string;
  /** The speed shown (mph). */
  speed: number;
  /** The tach's full scale, rpm (default 8000; a major tick every 1000). */
  rpmMax?: number;
  /** The power-peak band, rpm [from, to], drawn `orange` on the tach's ring (default [4500, 6500]). Omit with null. */
  band?: [number, number] | null;
};

/**
 * A gas car's cluster (No. 007), drawn into a w × h canvas (the detail box: 360 × 209): a generic tach
 * on the left (a 240° ring of ticks, no numerals, the needle in the face's ink from a hub), the
 * **power-peak band** (where the engine is strongest) as an `orange` arc on the ring (the system's
 * mark: the engine's useful zone, no text on it), the gear digit in the ring's open bottom, and the
 * speed large on the right with MPH under it. Text ≥ 28 px at the detail box's size. No brand.
 */
export const drawGasCluster = (cx: CanvasRenderingContext2D, w: number, h: number, s: GasClusterState) => {
  cx.save();
  cx.setTransform(1, 0, 0, 1, 0, 0);
  cx.fillStyle = FACE;
  cx.fillRect(0, 0, w, h);
  const u = h / 209;
  const max = s.rpmMax ?? 8000;
  const band = s.band === undefined ? ([4500, 6500] as [number, number]) : s.band;
  // the tach: 240° from lower left (150°) clockwise to lower right (390°), canvas angles
  const ox = 104 * u;
  const oy = 100 * u;
  const rad = 84 * u;
  const ang = (r: number) => ((150 + (240 * Math.max(0, Math.min(max, r))) / max) * Math.PI) / 180;
  cx.strokeStyle = DIM;
  const steps = Math.round((max / 1000) * 2);
  for (let i = 0; i <= steps; i++) {
    const a = ang((max * i) / steps);
    const major = i % 2 === 0;
    const r0 = rad * (major ? 0.8 : 0.88);
    cx.lineWidth = (major ? 4 : 2) * u;
    cx.beginPath();
    cx.moveTo(ox + Math.cos(a) * r0, oy + Math.sin(a) * r0);
    cx.lineTo(ox + Math.cos(a) * rad, oy + Math.sin(a) * rad);
    cx.stroke();
  }
  // the power-peak band over the ring's outer edge (over the ticks, so it reads as one arc)
  if (band) {
    cx.strokeStyle = section.orange;
    cx.lineWidth = 12 * u;
    cx.lineCap = 'butt';
    cx.beginPath();
    cx.arc(ox, oy, rad - 6 * u, ang(band[0]), ang(band[1]));
    cx.stroke();
  }
  // the needle and its hub
  const na = ang(s.rpm);
  cx.strokeStyle = INK;
  cx.lineWidth = 5 * u;
  cx.lineCap = 'round';
  cx.beginPath();
  cx.moveTo(ox - Math.cos(na) * 12 * u, oy - Math.sin(na) * 12 * u);
  cx.lineTo(ox + Math.cos(na) * rad * 0.9, oy + Math.sin(na) * rad * 0.9);
  cx.stroke();
  cx.fillStyle = INK;
  cx.beginPath();
  cx.arc(ox, oy, 9 * u, 0, Math.PI * 2);
  cx.fill();
  // the gear digit in the ring's open bottom
  cx.textBaseline = 'alphabetic';
  cx.textAlign = 'center';
  cx.font = `800 ${Math.round(56 * u)}px ${fonts.sans}, Arial`;
  cx.fillText(String(s.gear), ox, oy + 98 * u);
  // the speed, right
  cx.textAlign = 'right';
  cx.font = `800 ${Math.round(88 * u)}px ${fonts.sans}, Arial`;
  cx.fillText(String(Math.max(0, Math.round(s.speed))), w - 20 * u, 112 * u);
  cx.fillStyle = DIM;
  cx.font = `700 ${Math.round(28 * u)}px ${fonts.sans}, Arial`;
  cx.fillText('MPH', w - 20 * u, 150 * u);
  cx.restore();
};
