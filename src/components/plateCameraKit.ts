import {fonts} from '../fonts';
import {CAR, CHARGE, CITY, HIGHWAY, MOODS, REAL, section, STREET} from '../theme';
import {SNAP_PARTS, SNAP_VIEWS, snapBox, snapPlateChars} from '../three/real/cameraSnapshot';
import type {Snapshots} from './cameraSnapshots';

/*
 * No. 015 (N3, N7): what a plate camera captured, and the screens that search it, drawn flat on a canvas for the detail
 * box (style guide v0.18.7 § 6 "Detail box: what a camera captured").
 *
 *  - `drawCameraView`: the pole camera's still of YOU's car from behind and above (the same car, paint, roof rack,
 *    lamps and invented plate as the 3D). Since the owner's "the car photo need to be improve" (2026-11-03) the still is
 *    a render of the 3D car itself (`cameraSnapshots.ts`, `three/real/cameraSnapshot.ts`) and every orange mark is the
 *    projection of its 3D part through the same camera; the flat drawing below stays only as the fallback for a video
 *    with no rendered stills. Four modes: 'color' (the still with the software's orange outline boxes and
 *    one scan band), 'ir' (the same picture zoomed on the plate, desaturated to neutral greys, the plate bright ≤ 244,
 *    per-character boxes, the text copied under it), 'training' (the still shrinks into one tile of a grid of invented,
 *    labelled cars streaming upward, then the grid collapses back), 'record' (a thumbnail and the record's fields, its
 *    saved edge orange). Chips under the photo: ink on paper, Inter 700 ≥ 28 px.
 *  - `drawSearch`: a generic light search screen (no real product's look): a query field filling with chips and result
 *    rows (thumb, plate field, label, time); matches get the 5 px orange edge.
 *  - `drawSettings`: KEEP SIGHTINGS FOR [ n ] DAYS with − / +, an optional ink range bracket (no number).
 *
 * Orange only for the system's marks (outline boxes, the scan band, the saved edge, the match edge); everything else ink,
 * paper and the scene's own tokens. Every text ≥ 28 px at the default sizes. All of it illustrative (🎭).
 */

type Cx = CanvasRenderingContext2D;
const day = MOODS.day;
const font = (w: number, px: number, face = fonts.sans) => `${w} ${px}px ${face}, Arial, sans-serif`;

/** A theme colour with an alpha (for gradients). */
const withAlpha = (hex: string, a: number) => {
  const h = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  return `rgba(${r},${g},${b},${a})`;
};

/** A neutral grey of a colour's luminance, mapped into ink … 244 (the IR still, § 2). */
const grey = (hex: string, lift = 0) => {
  const h = hex.replace('#', '');
  const v = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  const lin = v.map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  const y = 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
  const s = Math.min(1, Math.max(0, (y <= 0.0031308 ? 12.92 * y : 1.055 * y ** (1 / 2.4) - 0.055) + lift));
  const g = Math.round(27 + (244 - 27) * s);
  return `rgb(${g},${g},${g})`;
};

// ---------------------------------------------------------------- the still

export type MarkName = 'plate' | 'badge' | 'color' | 'body' | 'rack';

/** The still's layout as fractions of the photo (w, h): YOU's crossover from behind, a little right and above. */
const CAR_2D = {
  rearFace: [
    [0.27, 0.5],
    [0.6, 0.48],
    [0.62, 0.86],
    [0.26, 0.87],
  ],
  side: [
    [0.6, 0.48],
    [0.9, 0.34],
    [0.93, 0.62],
    [0.62, 0.86],
  ],
  roof: [
    [0.31, 0.3],
    [0.57, 0.28],
    [0.86, 0.17],
    [0.6, 0.18],
  ],
  rearGlass: [
    [0.31, 0.31],
    [0.57, 0.29],
    [0.59, 0.47],
    [0.28, 0.49],
  ],
  sideGlass: [
    [0.61, 0.46],
    [0.86, 0.18],
    [0.89, 0.33],
    [0.62, 0.46],
  ],
  lampL: [0.27, 0.56, 0.1, 0.035],
  lampR: [0.5, 0.55, 0.1, 0.035],
  plate: [0.385, 0.64, 0.12, 0.07],
  badge: [0.445, 0.575, 0.032, 0.022],
  sample: [0.5, 0.68, 0.06, 0.06],
  bumper: [0.26, 0.78, 0.36, 0.09],
  wheels: [
    [0.66, 0.86, 0.035, 0.075],
    [0.9, 0.62, 0.03, 0.065],
  ],
  rack: [0.3, 0.13, 0.58, 0.18],
};

/** A mark's box (fractions of the photo). */
export const markBox = (m: MarkName): [number, number, number, number] => {
  const c = CAR_2D;
  if (m === 'plate') return [c.plate[0] - 0.012, c.plate[1] - 0.015, c.plate[2] + 0.024, c.plate[3] + 0.03];
  if (m === 'badge') return [c.badge[0] - 0.02, c.badge[1] - 0.02, c.badge[2] + 0.04, c.badge[3] + 0.04];
  if (m === 'color') return c.sample as [number, number, number, number];
  if (m === 'rack') return [c.rack[0] - 0.01, c.rack[1] - 0.03, c.rack[2] + 0.02, c.rack[3] + 0.02];
  return [0.23, 0.12, 0.73, 0.79];
};

/** A mark's box on the rendered still (fractions): its 3D part projected through the pole camera (`SNAP_PARTS`). */
let photoMarks: Record<MarkName, [number, number, number, number]> | null = null;
export const photoMarkBox = (m: MarkName): [number, number, number, number] => {
  if (!photoMarks) {
    const v = SNAP_VIEWS.main;
    photoMarks = {
      plate: snapBox(v, SNAP_PARTS.plate, 0.012),
      badge: snapBox(v, SNAP_PARTS.badge, 0.014),
      color: snapBox(v, SNAP_PARTS.color),
      body: snapBox(v, SNAP_PARTS.body, 0.01),
      rack: snapBox(v, SNAP_PARTS.rack, 0.014),
    };
  }
  return photoMarks[m];
};

/**
 * The IR still from the rendered plate close-up: neutral greys, ink-dark (27) to ≤ 244 (§ 2), with a 1.6 gamma so the
 * retroreflective plate (the brightest thing in the frame) stands out of the darker car, its letters dark. Cached per size.
 */
const irCache = new Map<string, HTMLCanvasElement>();
const irStill = (img: HTMLImageElement, w: number, h: number) => {
  const key = `${img.src}|${w}|${h}`;
  const hit = irCache.get(key);
  if (hit) return hit;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const cx = c.getContext('2d', {willReadFrequently: true})!;
  cx.drawImage(img, 0, 0, w, h);
  const d = cx.getImageData(0, 0, w, h);
  const px = d.data;
  for (let i = 0; i < px.length; i += 4) {
    const y = (0.2126 * px[i] + 0.7152 * px[i + 1] + 0.0722 * px[i + 2]) / 255;
    const g = Math.round(27 + (244 - 27) * Math.min(1, Math.max(0, y)) ** 1.6);
    px[i] = g;
    px[i + 1] = g;
    px[i + 2] = g;
  }
  cx.putImageData(d, 0, 0);
  irCache.set(key, c);
  return c;
};

const poly = (cx: Cx, pts: number[][], w: number, h: number, fill: string) => {
  cx.beginPath();
  pts.forEach(([x, y], i) => (i ? cx.lineTo(x * w, y * h) : cx.moveTo(x * w, y * h)));
  cx.closePath();
  cx.fillStyle = fill;
  cx.fill();
};
const rect = (cx: Cx, r: number[], w: number, h: number, fill: string) => {
  cx.fillStyle = fill;
  cx.fillRect(r[0] * w, r[1] * h, r[2] * w, r[3] * h);
};

/**
 * The still (photo area w × h, origin at its top-left), in colour or IR greys, zoomed by `zoom` about `focus` (fractions).
 * The scene's own tokens: asphalt, lane paint, YOU's paint, glass, the rack's `CHARGE.cabinetDark`, lit brake lamps,
 * the plate's dial and ink.
 */
const drawStill = (
  cx: Cx,
  w: number,
  h: number,
  o: {plate: string; paint: string; ir: boolean; rack: boolean; lamps: boolean; zoom?: number; focus?: [number, number]},
) => {
  const col = (hex: string, lift = 0) => (o.ir ? grey(hex, lift) : hex);
  cx.save();
  cx.beginPath();
  cx.rect(0, 0, w, h);
  cx.clip();
  const z = o.zoom ?? 1;
  const f = o.focus ?? [0.5, 0.5];
  cx.translate(w / 2 - f[0] * w * z, h / 2 - f[1] * h * z);
  cx.scale(z, z);
  // road, the lane line's dashes running away up the frame
  cx.fillStyle = col(CITY.asphalt);
  cx.fillRect(-w, -h, 3 * w, 3 * h);
  cx.fillStyle = col(HIGHWAY.lineWhite, -0.1);
  for (let i = -2; i < 6; i++) {
    cx.save();
    cx.translate(0.08 * w + i * 0.02 * w, i * 0.22 * h);
    cx.rotate(-0.42);
    cx.fillRect(0, 0, 0.012 * w, 0.12 * h);
    cx.restore();
  }
  const c = CAR_2D;
  // shadow under the car
  cx.fillStyle = 'rgba(0,0,0,0.28)';
  cx.beginPath();
  cx.ellipse(0.6 * w, 0.85 * h, 0.4 * w, 0.08 * h, -0.35, 0, Math.PI * 2);
  cx.fill();
  // wheels (the near side's two), the body, the glass
  poly(cx, c.side, w, h, col(o.paint, -0.06));
  for (const [x, y, rx, ry] of c.wheels) {
    cx.fillStyle = col(REAL.tire);
    cx.beginPath();
    cx.ellipse(x * w, y * h, rx * w, ry * h, 0, 0, Math.PI * 2);
    cx.fill();
    cx.fillStyle = col(REAL.rim);
    cx.beginPath();
    cx.ellipse(x * w, y * h, rx * w * 0.55, ry * h * 0.55, 0, 0, Math.PI * 2);
    cx.fill();
  }
  poly(cx, c.rearFace, w, h, col(o.paint));
  poly(cx, c.roof, w, h, col(o.paint, 0.06));
  poly(cx, c.rearGlass, w, h, col(REAL.carGlass));
  poly(cx, c.sideGlass, w, h, col(REAL.carGlass));
  rect(cx, c.bumper, w, h, col(REAL.dash));
  // lamps: lit brake red in colour; in IR a mid grey (no glow)
  const lamp = o.lamps ? section.brakeLit : HIGHWAY.tailLens;
  rect(cx, c.lampL, w, h, o.ir ? grey(lamp, 0.1) : lamp);
  rect(cx, c.lampR, w, h, o.ir ? grey(lamp, 0.1) : lamp);
  // the badge: a blank oval (no mark), the plate
  cx.strokeStyle = col(REAL.chrome);
  cx.lineWidth = Math.max(1, 0.004 * w);
  cx.beginPath();
  cx.ellipse((c.badge[0] + c.badge[2] / 2) * w, (c.badge[1] + c.badge[3] / 2) * h, (c.badge[2] / 2) * w, (c.badge[3] / 2) * h, 0, 0, Math.PI * 2);
  cx.stroke();
  // in IR the plate is retroreflective: bright (≤ 244), its letters dark
  rect(cx, c.plate, w, h, o.ir ? 'rgb(244,244,244)' : STREET.dial);
  cx.strokeStyle = o.ir ? grey(STREET.dialInk) : STREET.dialInk;
  cx.lineWidth = Math.max(1, 0.003 * w);
  cx.strokeRect(c.plate[0] * w, c.plate[1] * h, c.plate[2] * w, c.plate[3] * h);
  cx.fillStyle = o.ir ? grey(STREET.dialInk) : STREET.dialInk;
  cx.font = font(700, c.plate[3] * h * 0.62, fonts.mono);
  cx.textAlign = 'center';
  cx.textBaseline = 'middle';
  cx.fillText(o.plate, (c.plate[0] + c.plate[2] / 2) * w, (c.plate[1] + c.plate[3] * 0.56) * h, c.plate[2] * w * 0.9);
  // the roof rack: two rails and two crossbars
  if (o.rack) {
    cx.strokeStyle = col(CHARGE.cabinetDark);
    cx.lineCap = 'round';
    cx.lineWidth = 0.012 * w;
    const L = (a: number[], b: number[]) => {
      cx.beginPath();
      cx.moveTo(a[0] * w, a[1] * h);
      cx.lineTo(b[0] * w, b[1] * h);
      cx.stroke();
    };
    L([0.34, 0.27], [0.62, 0.155]);
    L([0.55, 0.26], [0.83, 0.15]);
    L([0.36, 0.235], [0.6, 0.225]);
    L([0.5, 0.18], [0.74, 0.17]);
  }
  cx.restore();
};

/** One chip: ink text on paper, a 3 px ink border, square corners; `badge` adds a blank oval before the text (MAKE). */
const chip = (cx: Cx, x: number, y: number, text: string, badge: boolean, alpha: number) => {
  cx.save();
  cx.globalAlpha = alpha;
  cx.font = font(700, 28);
  const tw = cx.measureText(text).width;
  const bw = badge ? 40 : 0;
  const w = tw + 28 + bw;
  const h = 46;
  cx.fillStyle = day.paper;
  cx.fillRect(x, y, w, h);
  cx.strokeStyle = day.ink;
  cx.lineWidth = 3;
  cx.strokeRect(x + 1.5, y + 1.5, w - 3, h - 3);
  cx.fillStyle = day.ink;
  cx.textAlign = 'left';
  cx.textBaseline = 'middle';
  cx.fillText(text, x + 14, y + h / 2 + 1);
  if (badge) {
    cx.lineWidth = 3;
    cx.beginPath();
    cx.ellipse(x + 14 + tw + 22, y + h / 2, 13, 9, 0, 0, Math.PI * 2);
    cx.stroke();
  }
  cx.restore();
  return w;
};

/** An orange outline box (the software's mark): 3 px, square corners; `k` 0 → 1 draws it on (clockwise). */
const markRect = (cx: Cx, x: number, y: number, w: number, h: number, k: number, lw = 3) => {
  if (k <= 0) return;
  const per = 2 * (w + h);
  let left = per * Math.min(1, k);
  cx.save();
  cx.strokeStyle = section.orange;
  cx.lineWidth = lw;
  cx.lineCap = 'square';
  cx.beginPath();
  cx.moveTo(x, y);
  const legs: [number, number][] = [
    [x + w, y],
    [x + w, y + h],
    [x, y + h],
    [x, y],
  ];
  let px = x;
  let py = y;
  for (const [nx, ny] of legs) {
    const l = Math.hypot(nx - px, ny - py);
    if (left >= l) {
      cx.lineTo(nx, ny);
      left -= l;
    } else {
      cx.lineTo(px + ((nx - px) * left) / l, py + ((ny - py) * left) / l);
      left = 0;
      break;
    }
    px = nx;
    py = ny;
  }
  cx.stroke();
  cx.restore();
};

/** A generic labelled training tile: an invented car (side view, flat), a one-word ink label under it. */
const tile = (cx: Cx, x: number, y: number, w: number, h: number, paint: string, label: string, kind: number) => {
  cx.fillStyle = day.ui;
  cx.fillRect(x, y, w, h);
  const ph = h - 40;
  cx.fillStyle = CITY.asphalt;
  cx.fillRect(x + 4, y + 4, w - 8, ph - 4);
  const bx = x + 12;
  const by = y + ph * 0.35;
  const bw = w - 24;
  const bh = ph * 0.38;
  cx.fillStyle = paint;
  if (kind === 2) {
    // pickup: cab and bed
    cx.fillRect(bx, by + bh * 0.35, bw, bh * 0.65);
    cx.fillRect(bx + bw * 0.45, by, bw * 0.3, bh * 0.5);
  } else {
    cx.fillRect(bx, by + bh * 0.4, bw, bh * 0.6);
    cx.fillRect(bx + bw * (kind === 1 ? 0.25 : 0.15), by, bw * (kind === 1 ? 0.45 : 0.62), bh * 0.5);
  }
  cx.fillStyle = REAL.tire;
  for (const k of [0.22, 0.78]) {
    cx.beginPath();
    cx.arc(bx + bw * k, by + bh, bh * 0.22, 0, Math.PI * 2);
    cx.fill();
  }
  cx.fillStyle = day.ink;
  cx.font = font(700, 28);
  cx.textAlign = 'center';
  cx.textBaseline = 'alphabetic';
  cx.fillText(label, x + w / 2, y + h - 10, w - 6);
};

/** A training tile from a rendered still (cover-fit into the photo area), its own one-word ink label under it. */
const photoTile = (cx: Cx, x: number, y: number, w: number, h: number, img: HTMLImageElement, label: string) => {
  cx.fillStyle = day.ui;
  cx.fillRect(x, y, w, h);
  const pw = w - 8;
  const ph = h - 44;
  const k = Math.max(pw / img.width, ph / img.height);
  const sw = pw / k;
  const sh = ph / k;
  cx.drawImage(img, (img.width - sw) / 2, (img.height - sh) / 2, sw, sh, x + 4, y + 4, pw, ph);
  cx.fillStyle = day.ink;
  cx.font = font(700, 28);
  cx.textAlign = 'center';
  cx.textBaseline = 'alphabetic';
  cx.fillText(label, x + w / 2, y + h - 10, w - 6);
};

const TILE_PAINTS = [CITY.carBodies[1], CITY.carBodies[0], CAR.day.bodies.extra, CITY.carBodies[2], CHARGE.teslaPaint, CITY.carBodies[3], CITY.carBodies[4], CAR.day.bodies.mom];
const TILE_LABELS = ['SILVER', 'SEDAN', 'WHITE', 'PICKUP', 'SUV', 'GREY', 'VAN', 'BLUE'];

export type CameraViewState = {
  mode: 'color' | 'ir' | 'training' | 'record';
  plate: string;
  paint: string;
  rack: boolean;
  lamps: boolean;
  /** Each mark's draw-on (0 → 1) and its chip's landing (0 → 1); `chip` null for no chip. */
  marks: {mark: MarkName; draw: number; chip: string | null; land: number}[];
  /** The scan band's place, 0 → 1 down the photo (null: none). */
  scan: number | null;
  /** IR: characters boxed (0 → n, fractional = the next one drawing), text copied, the single plate box. */
  chars: number;
  plateBox: number;
  /** Training: the still → tile (0 → 1), the grid's scroll (rows), its strength (0 → 1). */
  shrink: number;
  scroll: number;
  grid: number;
  /** Record: each field's landing (0 → 1) and the saved edge (0 → 1). */
  fields: {text: string; land: number; badge?: boolean}[];
  saved: number;
};

/** The photo's height for a box width (the still's aspect). */
export const PHOTO_ASPECT = 0.64;

/** Draw the camera view (inner w × h). */
export const drawCameraView = (cx: Cx, w: number, h: number, s: CameraViewState, snaps: Snapshots | null = null) => {
  cx.setTransform(1, 0, 0, 1, 0, 0);
  cx.fillStyle = day.paper;
  cx.fillRect(0, 0, w, h);
  const ph = Math.round(w * PHOTO_ASPECT);
  const still = {plate: s.plate, paint: s.paint, rack: s.rack, lamps: s.lamps};
  if (s.mode === 'record') {
    // the record card: thumbnail top-left, the fields beside and under it; the saved edge
    const tw = Math.round(w * 0.46);
    const th = Math.round(tw * PHOTO_ASPECT);
    cx.save();
    cx.translate(16, 16);
    if (snaps) cx.drawImage(snaps.main, 0, 0, tw, th);
    else drawStill(cx, tw, th, {...still, ir: false});
    cx.restore();
    cx.textAlign = 'left';
    cx.textBaseline = 'middle';
    // the plate text beside the thumbnail, then the other fields as chips, wrapping
    let x = 16;
    let y = 16 + th + 18;
    s.fields.forEach((f, i) => {
      if (f.land <= 0) return;
      const rise = (1 - f.land) * 6;
      if (i === 0) {
        cx.save();
        cx.globalAlpha = f.land;
        cx.font = font(700, 40, fonts.mono);
        cx.fillStyle = day.ink;
        cx.fillText(f.text, 16 + tw + 18, 16 + th / 2 + rise, w - tw - 50);
        cx.restore();
        return;
      }
      cx.font = font(700, 28);
      const est = cx.measureText(f.text).width + 28 + (f.badge ? 40 : 0);
      if (x + est > w - 12) {
        x = 16;
        y += 56;
      }
      x += chip(cx, x, y + rise, f.text, !!f.badge, f.land) + 12;
    });
    if (s.saved > 0) {
      cx.save();
      cx.globalAlpha = s.saved;
      cx.strokeStyle = section.orange;
      cx.lineWidth = 5;
      cx.strokeRect(2.5, 2.5, w - 5, h - 5);
      cx.restore();
    }
    return;
  }
  // the photo
  cx.save();
  if (s.mode === 'training' && s.shrink > 0) {
    // the grid of labelled tiles streaming up; our still is one tile while it runs
    const cols = 3;
    const gw = (w - 16 * (cols + 1)) / cols;
    const gh = gw * 1.0;
    cx.globalAlpha = s.grid;
    cx.beginPath();
    cx.rect(0, 0, w, ph);
    cx.clip();
    const off = (s.scroll % 1) * (gh + 16);
    const first = Math.floor(s.scroll);
    for (let r = -1; r < Math.ceil(ph / (gh + 16)) + 1; r++) {
      for (let c = 0; c < cols; c++) {
        const n = (first + r) * cols + c;
        const k = ((n % 8) + 8) % 8;
        const gx = 16 + c * (gw + 16);
        const gy = 16 + r * (gh + 16) - off;
        if (snaps) {
          // the rendered cars in turn (no car twice on screen), each with its own label
          const p = snaps.tiles[((n % snaps.tiles.length) + snaps.tiles.length) % snaps.tiles.length];
          photoTile(cx, gx, gy, gw, gh, p.img, p.label);
        } else tile(cx, gx, gy, gw, gh, TILE_PAINTS[k], TILE_LABELS[(k * 3 + c) % 8], (n * 7) % 3);
      }
    }
    cx.globalAlpha = 1;
  }
  const k = s.mode === 'training' ? s.shrink : 0;
  if (k < 1) {
    // the still shrinking toward the middle tile (top row, middle column)
    const tw = w - k * (w - (w - 64) / 3);
    const th = ph - k * (ph - (w - 64) / 3);
    const tx = (w - tw) / 2;
    const ty = k * 16;
    cx.save();
    cx.translate(tx, ty);
    const zoom = s.mode === 'ir' ? 2.3 : 1;
    const focus: [number, number] = s.mode === 'ir' ? [0.445, 0.66] : [0.5, 0.5];
    if (snaps) {
      if (s.mode === 'ir') cx.drawImage(irStill(snaps.ir, Math.round(tw), Math.round(th)), 0, 0, tw, th);
      else {
        // cover-fit: while it shrinks into a (square) tile the photo is cropped, never stretched
        const img = snaps.main;
        const f = Math.max(tw / img.width, th / img.height);
        const sw = tw / f;
        const sh = th / f;
        cx.drawImage(img, (img.width - sw) / 2, (img.height - sh) / 2, sw, sh, 0, 0, tw, th);
      }
    } else drawStill(cx, tw, th, {...still, ir: s.mode === 'ir', zoom, focus});
    // marks on the still
    if (s.mode === 'color') {
      for (const m of s.marks) {
        const b = snaps ? photoMarkBox(m.mark) : markBox(m.mark);
        markRect(cx, b[0] * tw, b[1] * th, b[2] * tw, b[3] * th, m.draw, 3);
      }
      if (s.scan !== null && s.scan > 0 && s.scan < 1) {
        const y = s.scan * th;
        const g = cx.createLinearGradient(0, y - 40, 0, y + 6);
        g.addColorStop(0, withAlpha(section.orange, 0));
        g.addColorStop(0.85, withAlpha(section.orange, 0.35));
        g.addColorStop(1, withAlpha(section.orange, 0.9));
        cx.fillStyle = g;
        cx.fillRect(0, y - 40, tw, 46);
      }
    }
    if (s.mode === 'ir' && snaps) {
      // a box per character stepping across the rendered plate (each letter's place projected), then one plate box
      const boxes = snapPlateChars(SNAP_VIEWS.ir, s.plate);
      boxes.forEach((b, j) => {
        const vis = Math.max(0, Math.min(1, s.chars - j)) * (1 - s.plateBox);
        markRect(cx, b[0] * tw, b[1] * th, b[2] * tw, b[3] * th, vis, 2);
      });
      const p = snapBox(SNAP_VIEWS.ir, SNAP_PARTS.plate, 0.012);
      markRect(cx, p[0] * tw, p[1] * th, p[2] * tw, p[3] * th, s.plateBox, 3);
    } else if (s.mode === 'ir') {
      // the plate's place in the zoomed still, then a box per character stepping across it
      const c = CAR_2D.plate;
      const zx = (x: number) => (x - 0.445) * 2.3 * tw + tw / 2;
      const zy = (y: number) => (y - 0.66) * 2.3 * th + th / 2;
      const x0 = zx(c[0]);
      const x1 = zx(c[0] + c[2]);
      const y0 = zy(c[1]);
      const y1 = zy(c[1] + c[3]);
      const cw = ((x1 - x0) * 0.86) / s.plate.length;
      let j = 0;
      for (let i = 0; i < s.plate.length; i++) {
        if (s.plate[i] === ' ') continue;
        const vis = Math.max(0, Math.min(1, s.chars - j)) * (1 - s.plateBox);
        const cxp = x0 + (x1 - x0) * 0.07 + cw * i;
        markRect(cx, cxp + 1, y0 + (y1 - y0) * 0.2, cw - 2, (y1 - y0) * 0.65, vis, 2);
        j++;
      }
      markRect(cx, x0 - 6, y0 - 6, x1 - x0 + 12, y1 - y0 + 12, s.plateBox, 3);
    }
    cx.restore();
  }
  cx.restore();
  // under the photo: the chips (color, training) or the copied text (IR)
  const top = ph + 18;
  if (s.mode === 'ir') {
    // the boxed characters copied as ink text, one by one (spaces kept)
    let shown = '';
    let j = 0;
    for (const ch of s.plate) {
      if (ch !== ' ') j++;
      if (j > Math.floor(s.chars + 1e-6)) break;
      shown += ch;
    }
    cx.font = font(700, 48, fonts.mono);
    cx.fillStyle = day.ink;
    cx.textAlign = 'left';
    cx.textBaseline = 'top';
    cx.fillText(shown, 18, top + 6);
    return;
  }
  let x = 16;
  let y = top;
  for (const m of s.marks) {
    if (!m.chip || m.land <= 0) continue;
    cx.font = font(700, 28);
    const est = cx.measureText(m.chip).width + 28 + (m.mark === 'badge' ? 40 : 0);
    if (x + est > w - 12) {
      x = 16;
      y += 56;
    }
    const rise = (1 - m.land) * 6;
    x += chip(cx, x, y + rise, m.chip, m.mark === 'badge', m.land) + 12;
  }
};

// ---------------------------------------------------------------- the search screen

export type SearchRow = {plate: string; label: string; time: string; paint: string; land: number; match: number; odd: boolean};
export type SearchState = {query: {text: string; land: number; badge?: boolean}[]; rows: SearchRow[]};

/** A small rear-view thumb of a car (flat). */
const thumb = (cx: Cx, x: number, y: number, w: number, h: number, paint: string) => {
  cx.fillStyle = CITY.asphalt;
  cx.fillRect(x, y, w, h);
  cx.fillStyle = paint;
  cx.fillRect(x + w * 0.2, y + h * 0.3, w * 0.6, h * 0.5);
  cx.fillStyle = REAL.carGlass;
  cx.fillRect(x + w * 0.27, y + h * 0.18, w * 0.46, h * 0.22);
  cx.fillStyle = HIGHWAY.tailLens;
  cx.fillRect(x + w * 0.2, y + h * 0.42, w * 0.12, h * 0.06);
  cx.fillRect(x + w * 0.68, y + h * 0.42, w * 0.12, h * 0.06);
};

/** Draw the search screen (inner w × h): a Day UI, the query field, the result rows. */
export const drawSearch = (cx: Cx, w: number, h: number, s: SearchState) => {
  cx.setTransform(1, 0, 0, 1, 0, 0);
  cx.fillStyle = day.ui;
  cx.fillRect(0, 0, w, h);
  const pad = 18;
  // the query field: chips wrap inside it
  const fh = 128;
  cx.fillStyle = day.paper;
  cx.fillRect(pad, pad, w - 2 * pad, fh);
  cx.strokeStyle = day.inkSub;
  cx.lineWidth = 2;
  cx.strokeRect(pad + 1, pad + 1, w - 2 * pad - 2, fh - 2);
  let x = pad + 12;
  let y = pad + 12;
  for (const q of s.query) {
    if (q.land <= 0) continue;
    cx.font = font(700, 28);
    const est = cx.measureText(q.text).width + 28 + (q.badge ? 40 : 0);
    if (x + est > w - pad - 12) {
      x = pad + 12;
      y += 56;
    }
    x += chip(cx, x, y + (1 - q.land) * 6, q.text, !!q.badge, q.land) + 10;
  }
  // rows
  const rh = 64;
  let ry = pad + fh + 14;
  for (const r of s.rows) {
    if (r.land <= 0) continue;
    if (ry + rh > h - 6) break;
    cx.save();
    cx.globalAlpha = r.land;
    const yy = ry - (1 - r.land) * 10;
    cx.fillStyle = day.paper;
    cx.fillRect(pad, yy, w - 2 * pad, rh - 8);
    thumb(cx, pad + 8, yy + 8, 70, rh - 24, r.paint);
    // columns: thumb | plate (≤ 156) | label (what's left) | time (its own width, right-aligned), 16 px apart
    const mid = yy + (rh - 8) / 2;
    cx.textBaseline = 'middle';
    cx.font = font(700, 28);
    const timeW = cx.measureText(r.time).width;
    const timeR = w - pad - 12;
    const plateX = pad + 90;
    const labelX = plateX + 156 + 16;
    cx.textAlign = 'left';
    cx.font = r.odd ? font(700, 28) : font(700, 30, fonts.mono);
    cx.fillStyle = r.odd ? day.inkSub : day.ink;
    cx.fillText(r.plate, plateX, mid, 156);
    cx.font = font(700, 28);
    cx.fillStyle = day.ink;
    cx.fillText(r.label, labelX, mid, Math.max(40, timeR - timeW - 16 - labelX));
    cx.textAlign = 'right';
    cx.fillText(r.time, timeR, mid);
    if (r.match > 0) {
      cx.globalAlpha = r.land * r.match;
      cx.strokeStyle = section.orange;
      cx.lineWidth = 5;
      cx.strokeRect(pad + 2.5, yy + 2.5, w - 2 * pad - 5, rh - 13);
    }
    cx.restore();
    ry += rh;
  }
};

// ---------------------------------------------------------------- settings

export type SettingsState = {label: string; value: number; press: number; pressSide: -1 | 1; range: number};

/** Draw the settings screen (inner w × h): the label, [−] [ n ] [+] DAYS, an optional range bracket (ink, no number). */
export const drawSettings = (cx: Cx, w: number, h: number, s: SettingsState) => {
  cx.setTransform(1, 0, 0, 1, 0, 0);
  cx.fillStyle = day.ui;
  cx.fillRect(0, 0, w, h);
  cx.fillStyle = day.ink;
  cx.font = font(700, 30);
  cx.textAlign = 'left';
  cx.textBaseline = 'top';
  cx.fillText(s.label, 24, 26, w - 48);
  const y = 92;
  const bh = 96;
  const bs = 84;
  const fw = 150;
  const x0 = 24;
  const btn = (x: number, sign: string, pressed: boolean) => {
    cx.fillStyle = pressed ? day.ink : day.paper;
    cx.fillRect(x, y + (bh - bs) / 2, bs, bs);
    cx.strokeStyle = day.ink;
    cx.lineWidth = 3;
    cx.strokeRect(x + 1.5, y + (bh - bs) / 2 + 1.5, bs - 3, bs - 3);
    cx.fillStyle = pressed ? day.paper : day.ink;
    cx.font = font(800, 52, fonts.display);
    cx.textAlign = 'center';
    cx.textBaseline = 'middle';
    cx.fillText(sign, x + bs / 2, y + bh / 2 + 2);
  };
  btn(x0, '−', s.press > 0 && s.pressSide < 0);
  const fx = x0 + bs + 14;
  cx.fillStyle = day.paper;
  cx.fillRect(fx, y, fw, bh);
  cx.strokeStyle = day.ink;
  cx.lineWidth = 3;
  cx.strokeRect(fx + 1.5, y + 1.5, fw - 3, bh - 3);
  cx.fillStyle = day.ink;
  cx.font = font(800, 64, fonts.display);
  cx.textAlign = 'center';
  cx.textBaseline = 'middle';
  cx.fillText(String(s.value), fx + fw / 2, y + bh / 2 + 3);
  btn(fx + fw + 14, '+', s.press > 0 && s.pressSide > 0);
  cx.font = font(700, 30);
  cx.textAlign = 'left';
  cx.fillText('DAYS', fx + fw + 14 + bs + 18, y + bh / 2 + 1);
  if (s.range > 0) {
    // a square ink bracket under the controls: "a range", no number on it
    const bx0 = x0;
    const bx1 = fx + fw + 14 + bs;
    const by = y + bh + 22;
    cx.save();
    cx.globalAlpha = s.range;
    cx.strokeStyle = day.ink;
    cx.lineWidth = 3;
    cx.beginPath();
    cx.moveTo(bx0, by - 10);
    cx.lineTo(bx0, by);
    cx.lineTo(bx0 + (bx1 - bx0) * s.range, by);
    if (s.range >= 1) cx.lineTo(bx1, by - 10);
    cx.stroke();
    cx.restore();
  }
};
