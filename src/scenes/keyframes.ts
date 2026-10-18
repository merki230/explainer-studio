import {Easing, interpolate} from 'remotion';

/** A speed keyframe: from `at` (s), the speed eases to `speed` over the ramp. */
export type SpeedKey = {at: number; speed: number};

/** Speed at t: each keyframe eases in over `ramp` seconds (sine in-out) from wherever the speed was. */
export const speedAt = (keys: SpeedKey[], t: number, ramp: number) => {
  const ks = [...keys].sort((a, b) => a.at - b.at);
  if (!ks.length) return 0;
  let v = ks[0].at <= 0 ? ks[0].speed : 0;
  for (const k of ks) {
    if (t < k.at) break;
    const u = ramp > 0 ? Math.min(1, (t - k.at) / ramp) : 1;
    v = v + (k.speed - v) * (0.5 - 0.5 * Math.cos(Math.PI * u));
  }
  return v;
};

const STEP = 1 / 120;
/** ∫ speed dt from 0 to t (deterministic fixed-step sum). */
export const integrateSpeed = (keys: SpeedKey[], t: number, ramp: number) => {
  let a = 0;
  for (let x = 0; x < t; x += STEP) a += speedAt(keys, x + STEP / 2, ramp) * Math.min(STEP, t - x);
  return a;
};

/** 0 → 1 between a and b, cubic in-out, clamped. */
export const ease = (x: number, a: number, b: number) =>
  interpolate(x, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});

/** A keyframed value eased between keys (cubic in-out); before the first key, the first value. */
export const keyed = (keys: {at: number; value: number}[] | undefined, t: number, dflt: number) => {
  if (!keys || !keys.length) return dflt;
  const ks = [...keys].sort((a, b) => a.at - b.at);
  if (t <= ks[0].at) return ks[0].value;
  for (let i = 0; i < ks.length - 1; i++) {
    if (t < ks[i + 1].at) return ks[i].value + (ks[i + 1].value - ks[i].value) * ease(t, ks[i].at, ks[i + 1].at);
  }
  return ks[ks.length - 1].value;
};

type V3 = [number, number, number];

/**
 * A camera keyframe (wheel and car slices): the camera eases from the previous framing to this one,
 * arriving at `at` seconds into the scene, then holds until the next key. `ease`: 'inOut' (cubic,
 * default), 'out' (cubic ease-out: moves from the first frame, settles gently) or 'sine' (sine in-out).
 */
export type CameraKey = {at: number; look: V3; distance: number; ease?: 'out' | 'inOut' | 'sine'};

const EASES = {
  inOut: Easing.inOut(Easing.cubic),
  out: Easing.out(Easing.cubic),
  sine: Easing.inOut(Easing.sin),
};

/**
 * The framing at `t` from camera keys. The first segment starts at 0 from `base` (the scene's own
 * starting framing); a key at ≤ 0 is where the scene starts. After the last key the camera holds.
 */
export const framingAtKeys = (keys: CameraKey[], base: {look: V3; distance: number}, t: number): {look: V3; distance: number} => {
  const ks = [...keys].sort((a, b) => a.at - b.at);
  let prev = {look: base.look, distance: base.distance};
  let t0 = 0;
  for (const k of ks) {
    if (k.at <= t0 + 1e-6 && k.at <= 0) {
      prev = {look: k.look, distance: k.distance};
      continue;
    }
    if (t < k.at) {
      const u = interpolate(t, [t0, k.at], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASES[k.ease ?? 'inOut']});
      return {
        look: prev.look.map((v, i) => v + (k.look[i] - v) * u) as V3,
        distance: prev.distance + (k.distance - prev.distance) * u,
      };
    }
    prev = {look: k.look, distance: k.distance};
    t0 = k.at;
  }
  return prev;
};
