import * as THREE from 'three';
import {MOODS, type Mood} from '../../theme';

// Computed textures (identical on every render, no canvas). Bytes are display-referred like the
// rest of the kit (see plaster.ts `raw`): no colour-space conversion.

const cache = new Map<string, THREE.DataTexture>();
const rgb = (hex: string): [number, number, number] => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const mix = (a: number[], b: number[], u: number) => a.map((x, i) => x + (b[i] - x) * u);

const make = (key: string, w: number, h: number, px: (x: number, y: number) => number[]) => {
  let t = cache.get(key);
  if (t) return t;
  const data = new Uint8Array(w * h * 4);
  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) {
      // j = 0 is the bottom row (texture v = 0)
      const c = px(i, j);
      const o = (j * w + i) * 4;
      data[o] = Math.round(c[0]);
      data[o + 1] = Math.round(c[1]);
      data[o + 2] = Math.round(c[2]);
      data[o + 3] = 255;
    }
  }
  t = new THREE.DataTexture(data, w, h, THREE.RGBAFormat);
  t.magFilter = THREE.LinearFilter;
  t.minFilter = THREE.LinearFilter;
  t.needsUpdate = true;
  cache.set(key, t);
  return t;
};

/** Vertical sky gradient behind the slice: top, middle (at 60–70%), bottom (§ 1). */
export const skyTexture = (mood: Mood) => {
  const [top, mid, bottom] = MOODS[mood].sky.map(rgb);
  const midAt = mood === 'night' ? 0.6 : 0.7; // from the top
  return make(`sky:${mood}`, 1, 256, (_, j) => {
    const fromTop = 1 - (j + 0.5) / 256;
    return fromTop < midAt ? mix(top, mid, fromTop / midAt) : mix(mid, bottom, (fromTop - midAt) / (1 - midAt));
  });
};

/** The view through the window: a sky gradient, a few stars at night, a low skyline of houses. */
export const windowTexture = (mood: Mood) => {
  const [top, bottom, skyline] = MOODS[mood].window.map(rgb);
  const W = 256;
  const H = 192;
  const stars = [
    [30, 20],
    [70, 45],
    [150, 25],
    [210, 55],
    [110, 15],
    [235, 15],
  ];
  return make(`window:${mood}`, W, H, (i, j) => {
    const y = H - 1 - j; // from the top
    // houses: blocks with pitched roofs
    const k = Math.floor((i + 5) / 40);
    const x0 = k * 40 - 5;
    const hh = 35 + (k % 3) * 11;
    const roof = 17 - Math.abs(i - (x0 + 16)) * 0.5;
    const inHouse = i >= x0 && i < x0 + 32 && y >= H - hh;
    const inRoof = i >= x0 - 3 && i < x0 + 35 && y >= H - hh - roof && y < H - hh;
    if (inHouse || inRoof) return skyline;
    if (mood === 'night' && stars.some(([sx, sy]) => i >= sx && i < sx + 2 && y >= sy && y < sy + 2)) {
      return [232, 236, 248];
    }
    return mix(top, bottom, y / H);
  });
};
