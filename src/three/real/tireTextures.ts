import * as THREE from 'three';

/*
 * Procedural textures for the realistic wheel (No. 002): the tread, the sidewall markings and the
 * brake rotor face. All three are polar: u runs round the wheel (u = φ / 2π), v across the band, so
 * a turn of the wheel is a u offset and a rotational motion blur is a box blur along u.
 *
 * Grey values are multipliers on the material's colour (the kit is display-referred, linear) and the
 * same texture is the bump map. Built once per page (and once per blur bucket), no assets, no
 * randomness: a fixed integer hash gives the small variations.
 *
 * Blur: `blurPx` is the box width in texels along u (the arc the wheel turns while the shutter is
 * open). The scenes pass an angle; `blurBucket` turns it into a bucket so a steady speed reuses one
 * texture and a speed ramp builds only a handful.
 */

type Gray = {w: number; h: number; data: Float32Array};

const cache = new Map<string, THREE.DataTexture>();
const bases = new Map<string, Gray>();

/** A fixed hash in [0, 1) from two integers (no Math.random: renders must be deterministic). */
const hash = (i: number, j: number) => {
  let x = (i * 374761393 + j * 668265263) | 0;
  x = (x ^ (x >>> 13)) * 1274126177;
  x = x ^ (x >>> 16);
  return ((x >>> 0) % 10000) / 10000;
};

const frac = (x: number) => x - Math.floor(x);
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

/** Circular box blur along u (rows wrap), `px` texels wide. */
const blurU = (g: Gray, px: number): Float32Array => {
  const {w, h, data} = g;
  const r = Math.max(0, Math.floor(px / 2));
  if (r < 1) return data;
  const out = new Float32Array(w * h);
  const n = 2 * r + 1;
  for (let j = 0; j < h; j++) {
    const row = j * w;
    let s = 0;
    for (let k = -r; k <= r; k++) s += data[row + ((k + w) % w)];
    for (let i = 0; i < w; i++) {
      out[row + i] = s / n;
      s += data[row + ((i + r + 1) % w)] - data[row + ((i - r + w) % w)];
    }
  }
  return out;
};

const toTexture = (g: Gray, values: Float32Array) => {
  const {w, h} = g;
  const bytes = new Uint8Array(w * h * 4);
  for (let p = 0; p < w * h; p++) {
    const v = Math.round(clamp01(values[p]) * 255);
    bytes[p * 4] = v;
    bytes[p * 4 + 1] = v;
    bytes[p * 4 + 2] = v;
    bytes[p * 4 + 3] = 255;
  }
  const t = new THREE.DataTexture(bytes, w, h, THREE.RGBAFormat);
  t.wrapS = THREE.RepeatWrapping;
  t.wrapT = THREE.ClampToEdgeWrapping;
  t.magFilter = THREE.LinearFilter;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.generateMipmaps = true;
  t.anisotropy = 8;
  t.needsUpdate = true;
  return t;
};

const textureFor = (key: string, base: () => Gray, blurPx: number) => {
  const k = `${key}:${blurPx}`;
  let t = cache.get(k);
  if (!t) {
    let g = bases.get(key);
    if (!g) {
      g = base();
      bases.set(key, g);
    }
    t = toTexture(g, blurU(g, blurPx));
    cache.set(k, t);
  }
  return t;
};

/** The tread's lateral span in wheel units (v 0 → 1 is a −TREAD_A → +TREAD_A). */
export const TREAD_A = 0.27;
/** Pitches (tread blocks) round the tire. */
const PITCHES = 62;

/**
 * The tread: a directional pattern (lateral grooves sweeping back from the centre on both halves),
 * sipes cut across the blocks, the centre rib siped but unbroken, wide shoulder blocks that run onto
 * the shoulder. The four circumferential grooves are in the geometry (they notch the cut profile,
 * like the dashboard symbol); this adds what runs across. 1 = block top, ≈ 0.2 = groove floor.
 */
const treadBase = (): Gray => {
  const w = 2048;
  const h = 128;
  const data = new Float32Array(w * h);
  const SS = 3; // supersampling per texel, so the grooves' edges are smooth
  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) {
      let acc = 0;
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const u = (i + (sx + 0.5) / SS) / w;
          const v = (j + (sy + 0.5) / SS) / h;
          const a = -TREAD_A + v * 2 * TREAD_A;
          const x = Math.abs(a);
          const p = u * PITCHES;
          let val = 1;
          if (x < 0.06) {
            // centre rib: short sipes from each edge, the middle left whole
            const ph = frac(p * 2 - x * 9);
            if (x > 0.022 && ph < 0.07) val = 0.42;
          } else if (x >= 0.095 && x < 0.165) {
            // intermediate rib: a swept lateral groove each pitch, a sipe between
            const ph = frac(p - (x - 0.095) * 7);
            if (ph < 0.17) val = 0.2;
            else if (Math.abs(ph - 0.58) < 0.035) val = 0.45;
          } else if (x >= 0.2) {
            // shoulder blocks: wider grooves, less swept, open to the shoulder; a sipe in each block
            const ph = frac(p - (x - 0.2) * 3 + 0.35);
            if (ph < 0.2) val = 0.2;
            else if (Math.abs(ph - 0.6) < 0.03 && x < 0.245) val = 0.45;
          }
          acc += val;
        }
      }
      // a slight unevenness of the rubber (fixed hash, ±2%)
      data[j * w + i] = (acc / (SS * SS)) * (0.98 + 0.04 * hash(i >> 2, j >> 2));
    }
  }
  return {w, h, data};
};

/** The sidewall band's radii: v 0 → 1 is r SIDE_R0 → 1 (the bead to the tread's edge). */
export const SIDE_R0 = 0.66;
const SIDE_W = 4096;
const SIDE_H = 320;
/** The plain sidewall's grey (raised details are lighter: they catch the light like moulded rubber). */
export const SIDE_BASE = 0.76;

/**
 * The sidewall: moulded markings, generic and brand-free (size code "225/45 R17 94V", "TUBELESS",
 * "RADIAL", load and pressure limits, a DOT-style date code), the rim-protector rib, fine
 * concentric striations near the bead, a knurled band under the shoulder and tread-wear triangles.
 * Drawn on a canvas once the fonts are in; the layout repeats twice round the tire.
 */
const sideBase = (font: string) => (): Gray => {
  const w = SIDE_W;
  const h = SIDE_H;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const cx = c.getContext('2d')!;
  const g = (v: number) => {
    const b = Math.round(clamp01(v) * 255);
    return `rgb(${b},${b},${b})`;
  };
  /** canvas y of a radius (canvas top = r 1, the tread side). */
  const yOf = (r: number) => (1 - (r - SIDE_R0) / (1 - SIDE_R0)) * h;
  cx.fillStyle = g(SIDE_BASE);
  cx.fillRect(0, 0, w, h);
  // fine striations between the rim protector and the lettering
  for (let r = 0.71; r < 0.765; r += 0.0045) {
    cx.fillStyle = g(SIDE_BASE + 0.035);
    cx.fillRect(0, yOf(r), w, 1.2);
  }
  // the rim-protector rib (a raised ring just above the rim flange)
  cx.fillStyle = g(0.86);
  cx.fillRect(0, yOf(0.705), w, yOf(0.69) - yOf(0.705));
  // the knurled band under the shoulder: fine radial ribs
  for (let i = 0; i < w; i += 7) {
    cx.fillStyle = g(SIDE_BASE + 0.07);
    cx.fillRect(i, yOf(0.975), 2.5, yOf(0.935) - yOf(0.975));
  }
  cx.fillStyle = g(SIDE_BASE + 0.05);
  cx.fillRect(0, yOf(0.935), w, 2);
  // text, squeezed along u so the letters keep their shape at their radius
  const text = (s: string, u: number, r: number, px: number, weight: number, value: number) => {
    const sx = (1 - SIDE_R0) / h / ((2 * Math.PI * r) / w);
    cx.save();
    cx.translate(u * w, yOf(r));
    cx.scale(sx, 1);
    cx.font = `${weight} ${px}px ${font}, Arial`;
    cx.textBaseline = 'middle';
    cx.textAlign = 'center';
    cx.fillStyle = g(value);
    cx.fillText(s, 0, 0);
    cx.restore();
  };
  for (const off of [0, 0.5]) {
    text('225/45 R17 94V', off + 0.12, 0.84, 50, 800, 1);
    text('TUBELESS', off + 0.3, 0.845, 30, 800, 0.97);
    text('RADIAL', off + 0.4, 0.845, 30, 800, 0.97);
    text('MAX. LOAD 670 KG (1477 LBS)   MAX. PRESS. 350 KPA (51 PSI)', off + 0.2, 0.788, 15, 700, 0.93);
    text('TREADWEAR 400   TRACTION A   TEMPERATURE A', off + 0.37, 0.9, 15, 700, 0.93);
    text('DOT 7YK2 4XT 2324', off + 0.03, 0.9, 16, 700, 0.93);
  }
  // tread-wear indicator triangles at six places, on the shoulder side
  for (let k = 0; k < 6; k++) {
    const x = ((k + 0.08) / 6) * w;
    const y0 = yOf(0.985);
    cx.fillStyle = g(0.95);
    cx.beginPath();
    cx.moveTo(x - 9, y0 + 0.5);
    cx.lineTo(x + 9, y0 + 0.5);
    cx.lineTo(x, y0 + 12);
    cx.closePath();
    cx.fill();
  }
  const img = cx.getImageData(0, 0, w, h).data;
  const data = new Float32Array(w * h);
  // DataTexture rows run from v 0 (r SIDE_R0): flip the canvas
  for (let j = 0; j < h; j++) {
    const src = (h - 1 - j) * w;
    for (let i = 0; i < w; i++) data[j * w + i] = img[(src + i) * 4] / 255;
  }
  return {w, h, data};
};

/** The rotor face's radii: v 0 → 1 is r ROTOR.r0 → ROTOR.r1. */
export const ROTOR = {r0: 0.27, r1: 0.47};

/**
 * The brake rotor's friction face: cross-drilled holes in three staggered rings and curved slots,
 * with fine concentric machining marks. 1 = bare cast iron, dark = holes and slots.
 */
const rotorBase = (): Gray => {
  const w = 1024;
  const h = 64;
  const data = new Float32Array(w * h);
  const holes = 24;
  const SS = 3;
  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) {
      let acc = 0;
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const u = (i + (sx + 0.5) / SS) / w;
          const v = (j + (sy + 0.5) / SS) / h;
          const r = ROTOR.r0 + v * (ROTOR.r1 - ROTOR.r0);
          let val = 0.9 + 0.06 * Math.sin(r * 900);
          // three rings of holes, each ring turned a third of a pitch
          for (let ring = 0; ring < 3; ring++) {
            const rr = 0.33 + ring * 0.05;
            const du = frac(u * holes + ring / 3 + 0.5) - 0.5;
            const arc = (du / holes) * 2 * Math.PI * rr;
            if (Math.hypot(arc, r - rr) < 0.0105) val = 0.06;
          }
          // curved slots between the hole rows
          const ph = frac(u * holes * 0.5 - (r - ROTOR.r0) * 4);
          if (ph > 0.45 && ph < 0.47 && r > 0.29 && r < 0.45) val = Math.min(val, 0.35);
          acc += val;
        }
      }
      data[j * w + i] = acc / (SS * SS);
    }
  }
  return {w, h, data};
};

/** Bucket a blur angle (radians) into texels for a texture `w` wide (steps of `step` px, capped). */
export const blurBucket = (angle: number, w: number, step: number) => {
  const px = (Math.abs(angle) / (Math.PI * 2)) * w;
  if (px < step * 0.75) return 0;
  return Math.min(Math.round(w * 0.12), Math.round(px / step) * step);
};

/** The tread texture for a blur angle (radians swept while the shutter is open). */
export const treadTexture = (blur = 0) => textureFor('tread', treadBase, blurBucket(blur, 2048, 2));
/** The sidewall texture (needs the fonts: pass whether they're in, so the text is drawn once they are). */
export const sidewallTexture = (font: string, ready: boolean, blur = 0) =>
  textureFor(`side:${ready ? font : 'none'}`, ready ? sideBase(font) : sideBlank, blurBucket(blur, SIDE_W, 4));
/** The rotor face texture. */
export const rotorTexture = (blur = 0) => textureFor('rotor', rotorBase, blurBucket(blur, 1024, 2));

/** Before the fonts are in: the plain band (never shown in a finished frame; the fonts hold it). */
const sideBlank = (): Gray => ({w: 8, h: 8, data: new Float32Array(64).fill(SIDE_BASE)});
