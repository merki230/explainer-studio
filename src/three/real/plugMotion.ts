/*
 * No. 016 (`plug-sheet`): what moves on the plug sheet, as pure functions of time (no React, no three).
 *
 *  - `laneDriveAt`: a car along its section's lane (x), parked at x 0 facing −x: it arrives forward (from +x) or in
 *    reverse (from −x) and leaves forward (toward −x) or in reverse (toward +x). The home garage uses it (YOU's EV
 *    reverses out to the driveway and drives back in nose first: `homeDriveAt` over a list of trips).
 *  - `stallPoseAt`: a car at a fast-charger stall (back-in, perpendicular to the row). It comes along the aisle in
 *    front of the stalls (camera side) from frame right, nose first, stops past its stall, then reverses on a quarter
 *    circle and straight back into the stall, its rear to the post at the stall's far end; it leaves forward along the
 *    same path and away to frame left.
 *  - `stallRevs` / `laneRevs`: the wheels' drawn turn (capped under the spokes' alias limit, `wheelMotion.ts`).
 *  - The station's meter (`meterAt`): the needle follows the row's load (busy posts × a step, eased) and pushes a peak
 *    pointer that stays at the highest reading since `resetAt`.
 *  - The fee slab (`slabAt`): lift, split into n pieces, each slides along the feed on the cut face to its post.
 *
 * Frames: a section's lane frame is the charge kit's bay frame (x along the lane, y up, z toward the camera). A stall's
 * own frame (xs across the row, zs toward the camera; the parked car's centre at 0, its nose toward +zs) is the bay
 * frame turned a quarter turn about y (a pure yaw, never a reflection): bay (x, y, z) → stall (z, y, −x)
 * (`bayToStall`, `stallToBay`). So the car's left (driver's, cut) side faces +xs, the camera's side, the driver sits on
 * the left as at any US charger, and the post stands behind the car's left rear corner, at the stall's far end.
 */
import {carDriveAt, carWheelRevs, WHEEL_R, type ChargeArrive, type ChargeLeave} from './chargeMotion';
import {capSpeed} from './wheelMotion';

type V3 = [number, number, number];

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const e3 = (u: number) => {
  const x = clamp01(u);
  return x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2;
};
/** A soft step 0 → 1 between a and b (cubic in-out). */
export const step = (t: number, a: number, b: number) => (b <= a ? (t >= b ? 1 : 0) : e3((t - a) / (b - a)));

// ---------------------------------------------------------------- the lane (home, pump)

/** Arriving at the lane's mark: `dir` 'forward' (nose first, from +x) or 'reverse' (from −x). `from` m over `for` s. */
export type LaneArrive = {at: number; from?: number; for?: number; dir?: 'forward' | 'reverse'};
/** Leaving the mark: `dir` 'forward' (toward −x) or 'reverse' (toward +x). `to` m over `for` s, then on at that speed. */
export type LaneLeave = {at: number; to?: number; for?: number; dir?: 'forward' | 'reverse'};

export type LaneDrive = {
  /** The car's centre along the lane (0 = parked). */
  x: number;
  /** m/s, + forward (nose first), − reversing. */
  speed: number;
  /** Brake lamps 0 → 1. */
  brake: number;
  /** Reverse lamps 0 → 1. */
  reverse: number;
  parked: boolean;
};

const kitArrive = (a: LaneArrive): ChargeArrive => ({at: a.at, from: a.from ?? 9, for: a.for ?? 3});
const kitLeave = (l: LaneLeave): ChargeLeave => ({at: l.at, to: l.to ?? 16, for: l.for ?? 3.2});

/** A car on its lane at t (see the file comment). */
export const laneDriveAt = (arrive: LaneArrive | undefined, leave: LaneLeave | undefined, t: number): LaneDrive => {
  if (arrive && t < arrive.at) {
    const d = carDriveAt(kitArrive(arrive), undefined, t);
    const fwd = (arrive.dir ?? 'forward') === 'forward';
    const T = arrive.for ?? 3;
    // the kit's arrive reverses in from −x; a forward arrival is its mirror (from +x, nose first)
    const rev = fwd ? 0 : step(t, arrive.at - T - 0.4, arrive.at - T - 0.25) * (1 - step(t, arrive.at + 0.1, arrive.at + 0.25));
    return {x: fwd ? -d.x : d.x, speed: fwd ? -d.speed : d.speed, brake: d.brake, reverse: rev, parked: false};
  }
  if (leave && t > leave.at && (!arrive || leave.at >= arrive.at)) {
    const d = carDriveAt(undefined, kitLeave(leave), t);
    const fwd = (leave.dir ?? 'forward') === 'forward';
    return {x: fwd ? d.x : -d.x, speed: fwd ? d.speed : -d.speed, brake: 0, reverse: fwd ? 0 : 1, parked: false};
  }
  // standing: the brake held just after an arrival, the reverse lamps on just before a reversing leave
  const b = arrive ? carDriveAt(kitArrive(arrive), undefined, t).brake : 0;
  const rev = leave && (leave.dir ?? 'forward') === 'reverse' ? step(t, leave.at - 0.4, leave.at - 0.25) : 0;
  return {x: 0, speed: 0, brake: b, reverse: rev, parked: true};
};

/** The wheels' drawn turn on the lane (rev, + forward), 0 while parked. */
export const laneRevs = (arrive: LaneArrive | undefined, leave: LaneLeave | undefined, t: number, fps = 30) => {
  if (arrive && t < arrive.at) {
    const r = carWheelRevs(kitArrive(arrive), undefined, t, fps);
    // reversing in from −x the kit's turn is negative before the stop; the mirror (nose first) turns forward
    return (arrive.dir ?? 'forward') === 'forward' ? -r : r;
  }
  if (leave && t > leave.at && (!arrive || leave.at >= arrive.at)) {
    const r = carWheelRevs(undefined, kitLeave(leave), t, fps);
    return (leave.dir ?? 'forward') === 'forward' ? r : -r;
  }
  return 0;
};

/** One trip of YOU's EV from home: it reverses out at `out` and drives back in, nose first, stopping at `back`. */
export type HomeTrip = {out: number; back: number; outFor?: number; backFor?: number; dist?: number};

/** The home car at t over its trips (between the out and back legs it is off frame, up the driveway). */
export const homeLegs = (trips: HomeTrip[] | undefined, t: number): {arrive?: LaneArrive; leave?: LaneLeave} => {
  for (const tr of trips ?? []) {
    if (t < tr.out || t >= tr.back + 0.0001) continue;
    const mid = (tr.out + tr.back) / 2;
    const dist = tr.dist ?? 14;
    return t < mid
      ? {leave: {at: tr.out, dir: 'reverse', to: dist, for: tr.outFor ?? 3}}
      : {arrive: {at: tr.back, dir: 'forward', from: dist, for: tr.backFor ?? 3}};
  }
  // parked: the last arrival's brake still fading, or the next reversing leave's lamps coming on
  const last = [...(trips ?? [])].filter((tr) => tr.back <= t).sort((a, b) => b.back - a.back)[0];
  const next = [...(trips ?? [])].filter((tr) => tr.out > t).sort((a, b) => a.out - b.out)[0];
  return {
    arrive: last ? {at: last.back, dir: 'forward', from: last.dist ?? 14, for: last.backFor ?? 3} : undefined,
    leave: next ? {at: next.out, dir: 'reverse', to: next.dist ?? 14, for: next.outFor ?? 3} : undefined,
  };
};

// ---------------------------------------------------------------- the stall (fast-charger row)

/**
 * Backing into a stall, stopping (parked) at `at`. Before that: it comes along the aisle from frame right, nose first,
 * `from` m (default 10) over `approach` s (default 2.2), slowing to a stop past the stall (brake lamps lit), waits
 * `wait` s (default 0.35; the reverse lamps come on), then reverses on the quarter circle and straight back over `for`
 * s (default 2.6). Every key may lie outside the scene.
 */
export type StallArrive = {at: number; from?: number; approach?: number; wait?: number; for?: number};
/** Leaving forward from `at`: out of the stall along the same path and away to frame left, `for` s (default 3) to cover `to` m (default 14), speeding up, then on. */
export type StallLeave = {at: number; to?: number; for?: number};

/** The stall path: the straight leg (m) ahead of the parked spot, the turn's radius (m). The aisle is at zs +(straight + radius). */
export const STALL_PATH = {straight: 1.4, radius: 4.4};
/** Where the path's turn ends on the aisle (the stop before reversing): u along the path from the parked spot. */
export const STALL_U_TURN = STALL_PATH.straight + (Math.PI / 2) * STALL_PATH.radius;

/**
 * The path from the parked spot, nose first (u m along it): straight toward +zs (the camera), a quarter turn to the
 * right (toward frame left), then along the aisle toward −xs. Position (stall frame) and the nose's heading [hx, hz].
 */
export const stallPathAt = (u: number): {p: [number, number]; h: [number, number]} => {
  const {straight: L, radius: R} = STALL_PATH;
  if (u <= L) return {p: [0, u], h: [0, 1]};
  const arc = (Math.PI / 2) * R;
  if (u <= L + arc) {
    const a = (u - L) / R;
    return {p: [-R + R * Math.cos(a), L + R * Math.sin(a)], h: [-Math.sin(a), Math.cos(a)]};
  }
  return {p: [-R - (u - L - arc), L + R], h: [-1, 0]};
};

export type StallPose = {
  /** The car's centre (stall frame) and the nose's heading. */
  p: [number, number];
  h: [number, number];
  /** m/s along the path, + forward. */
  speed: number;
  brake: number;
  reverse: number;
  parked: boolean;
};

/** Ease (sine in-out) of a move over [a, b]: position share and its rate (1/s). */
const sineMove = (t: number, a: number, b: number) => {
  const T = Math.max(1e-3, b - a);
  const u = clamp01((t - a) / T);
  return {k: 0.5 - 0.5 * Math.cos(Math.PI * u), rate: t > a && t < b ? (0.5 * Math.PI * Math.sin(Math.PI * u)) / T : 0};
};

/** A stall's car at t (see `StallArrive`, `StallLeave`). No `arrive`: parked from the start; no `leave`: stays. */
export const stallPoseAt = (arrive: StallArrive | undefined, leave: StallLeave | undefined, t: number): StallPose => {
  const U = STALL_U_TURN;
  if (arrive && t < arrive.at) {
    const T = arrive.for ?? 2.6;
    const W = arrive.wait ?? 0.35;
    const A = arrive.approach ?? 2.2;
    const D = arrive.from ?? 10;
    const tRev = arrive.at - T;
    const tStop = tRev - W;
    const t0 = tStop - A;
    const turn = stallPathAt(U);
    // brake lamps: over the last 0.5 s of the approach and the wait; again over the last 0.45 s into the stall
    const brakeA = step(t, tStop - 0.5, tStop - 0.42) * (1 - step(t, tRev + 0.05, tRev + 0.15));
    const brakeB = step(t, arrive.at - 0.45, arrive.at - 0.37);
    const reverse = step(t, tStop + W * 0.4, tStop + W * 0.4 + 0.08);
    if (t >= tRev) {
      // reversing: from the turn's end back to the parked spot
      const m = sineMove(t, tRev, arrive.at);
      const u = U * (1 - m.k);
      const q = stallPathAt(u);
      return {p: q.p, h: q.h, speed: -U * m.rate, brake: Math.max(brakeA, brakeB), reverse, parked: false};
    }
    if (t >= tStop) return {p: turn.p, h: [-1, 0], speed: 0, brake: brakeA, reverse, parked: false};
    // along the aisle, nose −xs, from frame right: d m short of the stop
    const v0 = (2 * D) / A;
    const d = t < t0 ? D + v0 * (t0 - t) : D * (1 - (t - t0) / A) ** 2;
    const v = t < t0 ? v0 : v0 * (1 - (t - t0) / A);
    return {p: [turn.p[0] + d, turn.p[1]], h: [-1, 0], speed: v, brake: brakeA, reverse: 0, parked: false};
  }
  if (leave && t > leave.at && (!arrive || leave.at > arrive.at)) {
    const L = leave.to ?? 14;
    const T = leave.for ?? 3;
    const v1 = (2 * L) / T;
    const tau = t - leave.at;
    const u = tau < T ? L * (tau / T) ** 2 : L + v1 * (tau - T);
    const q = stallPathAt(u);
    return {p: q.p, h: q.h, speed: tau < T ? (v1 * tau) / T : v1, brake: 0, reverse: 0, parked: false};
  }
  const b = arrive ? step(t, arrive.at - 0.45, arrive.at - 0.37) * (1 - step(t, arrive.at + 0.5, arrive.at + 0.62)) : 0;
  return {p: [0, 0], h: [0, 1], speed: 0, brake: b, reverse: 0, parked: true};
};

/** The wheels' drawn turn (rev, + forward) of a stall's car at t, 0 while parked. */
export const stallRevs = (arrive: StallArrive | undefined, leave: StallLeave | undefined, t: number, fps = 30) => {
  const cap = capSpeed(WHEEL_R, fps);
  const capped = (v: number) => Math.sign(v) * Math.min(Math.abs(v), cap);
  const STEP = 1 / 120;
  const integ = (a: number, b: number) => {
    let s = 0;
    for (let x = a; x < b; x += STEP) {
      const h = Math.min(STEP, b - x);
      s += capped(stallPoseAt(arrive, leave, x + h / 2).speed) * h;
    }
    return s;
  };
  const C = 2 * Math.PI * WHEEL_R;
  if (arrive && t < arrive.at) {
    const T = arrive.for ?? 2.6;
    const W = arrive.wait ?? 0.35;
    const A = arrive.approach ?? 2.2;
    const D = arrive.from ?? 10;
    const t0 = arrive.at - T - W - A;
    // −(the turn still to come): the moving windows integrated, the constant approach before t0 in closed form
    const lead = t < t0 ? capped((2 * D) / A) * (t0 - t) : 0;
    return (-integ(Math.max(t, t0), arrive.at) - lead) / C;
  }
  if (leave && t > leave.at && (!arrive || leave.at > arrive.at)) {
    const T = leave.for ?? 3;
    const v1 = (2 * (leave.to ?? 14)) / T;
    return (integ(leave.at, Math.min(t, leave.at + T)) + (t > leave.at + T ? capped(v1) * (t - leave.at - T) : 0)) / C;
  }
  return 0;
};

/** The stall group's turn about y (rad): bay (x, y, z) → stall (z, y, −x). */
export const STALL_TURN = Math.PI / 2;
/** A stall-frame point (xs, y, zs) in the bay frame the charge kit uses. */
export const stallToBay = (v: V3): V3 => [-v[2], v[1], v[0]];
/** A bay-frame point in the stall frame. */
export const bayToStall = (b: V3): V3 => [b[2], b[1], -b[0]];
/** The yaw (rad about y, bay frame) that turns a cut car (facing −x) to a stall-frame nose heading. */
export const stallYaw = (h: [number, number]) => {
  // the heading in the bay frame: (−hz, hx); the car's nose (−1, 0) turned by ψ is (−cos ψ, sin ψ)
  return Math.atan2(h[0], h[1]);
};

// ---------------------------------------------------------------- the station's meter

/** The meter's keys (scene seconds): the needle per busy post, its ease, the peak pointer's life. */
export type MeterKeys = {
  /** The needle's share of full scale per busy post (🎭). Default 0.2. */
  step?: number;
  /** The needle at no load (share of full scale). Default 0.05. */
  idle?: number;
  /** The needle's lag: it averages the load over this many seconds. Default 0.6. */
  lag?: number;
  /** The orange peak pointer fades in from here (0.4 s). Default never. */
  appearAt?: number | null;
  /** It fades out (0.4 s). Default never. */
  fadeAt?: number | null;
  /** The pointer forgets the peak here (a new month): it drops to the needle. Default: it remembers from the start. */
  resetAt?: number | null;
};

/**
 * The meter at t: the needle (0 → 1 of full scale) from `load(x)` (busy posts at time x, may be fractional while a
 * plug latches) and the peak pointer (the highest needle since `resetAt`, sampled every 1/15 s), and its glow.
 */
export const meterAt = (keys: MeterKeys | undefined, load: (x: number) => number, t: number) => {
  const k = keys ?? {};
  const st = k.step ?? 0.2;
  const idle = k.idle ?? 0.05;
  const lag = Math.max(0.05, k.lag ?? 0.6);
  const needle = (x: number) => {
    let a = 0;
    const n = 8;
    for (let i = 0; i < n; i++) a += load(x - (lag * i) / (n - 1));
    return Math.min(1, idle + (st * a) / n);
  };
  const now = needle(t);
  const from = k.resetAt ?? -Infinity;
  let peak = now;
  if (Number.isFinite(from) || from === -Infinity) {
    const start = Math.max(from, t - 120);
    for (let x = start; x < t; x += 1 / 15) peak = Math.max(peak, needle(x));
  }
  const glow =
    (k.appearAt == null ? 0 : step(t, k.appearAt, k.appearAt + 0.4)) * (k.fadeAt == null ? 1 : 1 - step(t, k.fadeAt, k.fadeAt + 0.4));
  return {needle: now, peak: Math.max(now, peak), glow};
};

// ---------------------------------------------------------------- the fee slab

/** The fee slab (scene seconds): it lifts off the meter at `liftAt`, splits at `splitAt`, the pieces land at `landAt`. */
export type FeeSlab = {
  liftAt: number;
  splitAt?: number;
  landAt?: number;
  /** The posts its pieces go to (0-based, left → right). Default: the posts busy at `splitAt`. */
  to?: number[];
  /** Everything fades (0.5 s): the slab, the pieces, the lit node dots. Default never. */
  fadeAt?: number | null;
};

/**
 * Where the slab and its pieces are at t, in the row's frame: `start` (above the meter's top), `entry` (the feed's start
 * on the cut face below the meter), `posts` (each target's node dot on the cut face). Returns the pieces (each a centre
 * and its width share), the opacity, and which node dots have been reached (lit, the § 5 Trace).
 */
export const slabAt = (
  s: FeeSlab,
  n: number,
  t: number,
  geo: {top: V3; entry: V3; posts: V3[]},
): {pieces: {at: V3; w: number}[]; glow: number; lit: boolean[]} => {
  const split = s.splitAt ?? s.liftAt + 0.6;
  const land = s.landAt ?? split + 1.6;
  const fade = s.fadeAt == null ? 1 : 1 - step(t, s.fadeAt, s.fadeAt + 0.5);
  const appear = step(t, s.liftAt - 0.25, s.liftAt + 0.05);
  const glow = appear * fade;
  if (t < s.liftAt - 0.25 || n <= 0) return {pieces: [], glow: 0, lit: geo.posts.map(() => false)};
  const lift = step(t, s.liftAt, s.liftAt + 0.45);
  const up: V3 = [geo.top[0], geo.top[1] + 0.05 + 0.45 * lift, geo.top[2]];
  const spread = step(t, split, split + 0.35);
  const move0 = split + 0.4;
  const pieces = geo.posts.slice(0, n).map((post, i) => {
    const w = 1 / n;
    const off = (i - (n - 1) / 2) * (1.5 / n) * (1 + 0.5 * spread);
    const a: V3 = [up[0] + off * spread, up[1], up[2]];
    // each piece: down to the feed's start on the cut face, then along the feed to its post (staggered 0.12 s)
    const t1 = move0 + i * 0.12;
    const t2 = t1 + Math.max(0.3, (land - t1) * 0.35);
    const k1 = step(t, t1, t2);
    const k2 = step(t, t2, land);
    const b: V3 = geo.entry;
    const p: V3 =
      k2 <= 0
        ? [a[0] + (b[0] - a[0]) * k1, a[1] + (b[1] - a[1]) * k1, a[2] + (b[2] - a[2]) * k1]
        : [b[0] + (post[0] - b[0]) * k2, b[1] + (post[1] - b[1]) * k2, b[2] + (post[2] - b[2]) * k2];
    return {at: p, w};
  });
  const lit = geo.posts.map((_, i) => i < n && t >= land);
  return {pieces, glow, lit};
};

// ---------------------------------------------------------------- the loop and the clock

/**
 * The loop (N8): from its switch time a section plays the lead-in to frame 0 (its time becomes t − `end`, negative),
 * so at `end` it is exactly frame 0's state. Switch each section while it's off frame (or still).
 */
export type PlugLoop = {end: number; home?: number; pump?: number; fast?: number};
export const sectionTime = (loop: PlugLoop | null | undefined, which: 'home' | 'pump' | 'fast', t: number) => {
  if (!loop) return t;
  const sw = loop[which] ?? loop.end;
  return t >= sw ? t - loop.end : t;
};

/** The sun's swing (deg) for story minutes past the story time: periodic per day, so whole days land on frame 0. */
export const sunSwing = (minutes: number, amp = 14) => amp * Math.sin((2 * Math.PI * minutes) / 1440);
/** The clouds' drift (m per story minute): a whole number of the clouds' 64 m wrap per day (8). */
export const CLOUD_SPEED = (64 * 8) / 1440;
