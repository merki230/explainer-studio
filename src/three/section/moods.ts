import {MOODS, type Mood} from '../../theme';

/** One mood's palette and lights (theme `MOODS`), or a blend of two. */
export type MoodPalette = (typeof MOODS)[Mood];

const hex = (h: string) => {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const toHex = (c: number[]) => `#${c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')}`;
const mixHex = (a: string, b: string, k: number) => {
  if (!a.startsWith('#') || !b.startsWith('#')) return k < 0.5 ? a : b;
  const x = hex(a);
  const y = hex(b);
  return toHex(x.map((v, i) => v + (y[i] - v) * k));
};
const mixN = (a: number, b: number, k: number) => a + (b - a) * k;
const mixV3 = (a: [number, number, number], b: [number, number, number], k: number): [number, number, number] => [
  mixN(a[0], b[0], k),
  mixN(a[1], b[1], k),
  mixN(a[2], b[2], k),
];

type Light = {color: string; intensity: number; position: [number, number, number]};
const mixLight = (a: Light, b: Light, k: number): Light => ({
  color: mixHex(a.color, b.color, k),
  intensity: mixN(a.intensity, b.intensity, k),
  position: mixV3(a.position, b.position, k),
});
/** A light that exists in only one mood fades in or out (intensity 0 on the other side). */
const mixOptional = <T extends {intensity: number}>(a: T | null, b: T | null, k: number, mix: (x: T, y: T, k: number) => T) => {
  if (!a && !b) return null;
  const x = a ?? {...(b as T), intensity: 0};
  const y = b ?? {...(a as T), intensity: 0};
  return mix(x, y, k);
};

/**
 * The palette between two moods (k 0 → `a`, 1 → `b`): every colour, light and exposure value
 * interpolated, for the time-passes beat (§ 4) rendered as one scene.
 */
export const blendMood = (a: Mood, b: Mood, k: number): MoodPalette => {
  const A = MOODS[a];
  const B = MOODS[b];
  if (k <= 0) return A;
  if (k >= 1) return B;
  const c = (key: keyof MoodPalette) => mixHex(A[key] as string, B[key] as string, k);
  return {
    bg: c('bg'),
    sky: A.sky.map((v, i) => mixHex(v, B.sky[i], k)) as [string, string, string],
    wall: c('wall'),
    floor: c('floor'),
    soft: c('soft'),
    softLight: c('softLight'),
    wood: c('wood'),
    trim: c('trim'),
    device: c('device'),
    earth: c('earth'),
    ink: c('ink'),
    paper: c('paper'),
    inkSub: k < 0.5 ? A.inkSub : B.inkSub,
    capBg: k < 0.5 ? A.capBg : B.capBg,
    window: A.window.map((v, i) => mixHex(v, B.window[i], k)) as [string, string, string],
    hemi: [mixHex(A.hemi[0], B.hemi[0], k), mixHex(A.hemi[1], B.hemi[1], k), mixN(A.hemi[2], B.hemi[2], k)],
    key: mixLight(A.key, B.key, k),
    fill: mixLight(A.fill, B.fill, k),
    lamp: mixOptional(A.lamp, B.lamp, k, (x, y, q) => ({
      light: mixHex(x.light, y.light, q),
      intensity: mixN(x.intensity, y.intensity, q),
      reach: mixN(x.reach, y.reach, q),
      shade: mixHex(x.shade, y.shade, q),
      glow: mixHex(x.glow, y.glow, q),
      glowIntensity: mixN(x.glowIntensity, y.glowIntensity, q),
    })),
    vignette: mixN(A.vignette, B.vignette, k),
    exposure: mixN(A.exposure, B.exposure, k),
    shoulder: mixN(A.shoulder, B.shoulder, k),
    env: mixN(A.env, B.env, k),
    albedo: mixN(A.albedo, B.albedo, k),
    ui: k < 0.5 ? A.ui : B.ui,
    rug: c('rug'),
    appliance: c('appliance'),
    ceramic: c('ceramic'),
    shelf: c('shelf'),
    cavity: c('cavity'),
    shade: c('shade'),
    bounce: mixOptional(A.bounce, B.bounce, k, mixLight),
    figureLight: mixOptional(A.figureLight, B.figureLight, k, (x, y, q) => ({
      ...mixLight(x, y, q),
      target: mixV3(x.target, y.target, q),
    })),
  };
};
