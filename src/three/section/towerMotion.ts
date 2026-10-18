import {Easing, interpolate} from 'remotion';

/*
 * Pure motion for the tower and hotel slices (No. 003): car trips with a real lift's acceleration and
 * braking, doors, and the people who walk the halls and ride the cars. No React, no three: the
 * scenes render from it and the overlays (tags, callouts, readouts) place themselves with it.
 */

type V3 = [number, number, number];

/** A trip order: from `at` (s into the scene) the car travels to `level` (0 = lobby). */
export type CarKey = {at: number; level: number};
/** From `at` the car's doors (and the landing doors where it stands) open or close. */
export type DoorKey = {at: number; open: boolean};

export type CarMotion = {
  /** Where the car stands before its first trip (default: the first key's level, else 0). */
  level?: number;
  /** Trip orders, in time order. A key at ≤ 0 just places the car. */
  keys?: CarKey[];
  /** Cruise speed, floors/s (default 0.6, ≈ 2 m/s). */
  speed?: number;
  /** Seconds to reach cruise speed, and to brake from it (default 2.0; ≈ 1 m/s² peak). */
  ramp?: number;
  doors?: DoorKey[];
};

export const CAR_SPEED = 0.6;
export const CAR_RAMP = 2.0;
/** Seconds a door takes to open or close. */
export const DOOR_TIME = 1.4;

/**
 * One trip of `d` floors: the velocity rises on a half-cosine to cruise over the ramp, cruises, and
 * brakes on the mirrored curve. A trip too short to reach cruise keeps the same peak acceleration
 * at a lower top speed (a one-floor hop takes ≈ 3.7 s, four floors ≈ 8.7 s at the defaults).
 */
const tripShape = (d: number, vmax: number, ramp: number) => {
  const D = Math.abs(d);
  if (D < 1e-6) return {v: 0, ta: 0, tc: 0, T: 0};
  if (D >= vmax * ramp) return {v: vmax, ta: ramp, tc: (D - vmax * ramp) / vmax, T: 2 * ramp + (D - vmax * ramp) / vmax};
  const v = Math.sqrt((D * vmax) / ramp);
  const ta = (ramp * v) / vmax;
  return {v, ta, tc: 0, T: 2 * ta};
};

/** Seconds a trip of `floors` takes (start to level), for timing a spec. */
export const tripTime = (floors: number, speed = CAR_SPEED, ramp = CAR_RAMP) => tripShape(floors, speed, ramp).T;

export type TripPhase = 'idle' | 'accel' | 'cruise' | 'brake';

/** Distance and speed τ seconds into a trip (unsigned). */
const tripAt = (s: ReturnType<typeof tripShape>, D: number, tau: number): {x: number; v: number; phase: TripPhase} => {
  if (s.T === 0 || tau <= 0) return {x: 0, v: 0, phase: 'idle'};
  if (tau >= s.T) return {x: D, v: 0, phase: 'idle'};
  const {v, ta, tc} = s;
  const ramp = (u: number) => (v / 2) * (u - (ta / Math.PI) * Math.sin((Math.PI * u) / ta));
  if (tau < ta) return {x: ramp(tau), v: (v / 2) * (1 - Math.cos((Math.PI * tau) / ta)), phase: 'accel'};
  if (tau < ta + tc) return {x: (v * ta) / 2 + v * (tau - ta), v, phase: 'cruise'};
  const r = s.T - tau;
  return {x: D - ramp(r), v: (v / 2) * (1 - Math.cos((Math.PI * r) / ta)), phase: 'brake'};
};

export type CarState = {
  /** Fractional level of the car's floor. */
  level: number;
  /** Signed speed, floors/s (+ up). */
  v: number;
  phase: TripPhase;
  /** The level it is travelling to (its own level when idle). */
  target: number;
  /** Seconds into the scene when the current (or last) trip ends. */
  arrive: number;
  /** Doors open, 0 (shut) to 1. */
  open: number;
};

/** A car's state at t (seconds into the scene). */
export const carStateAt = (c: CarMotion, t: number): CarState => {
  const keys = [...(c.keys ?? [])].sort((a, b) => a.at - b.at);
  const vmax = c.speed ?? CAR_SPEED;
  const ramp = c.ramp ?? CAR_RAMP;
  let pos = c.level ?? keys[0]?.level ?? 0;
  let st: CarState = {level: pos, v: 0, phase: 'idle', target: pos, arrive: -Infinity, open: 0};
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    if (k.at <= 0 && i === 0 && c.level === undefined) {
      pos = k.level;
      st = {...st, level: pos, target: pos};
      continue;
    }
    if (t < k.at) break;
    const d = k.level - pos;
    const s = tripShape(d, vmax, ramp);
    // where this trip has got to by the next key (a new order mid-trip starts from there)
    const next = keys[i + 1];
    const tau = (next && next.at < t ? next.at : t) - k.at;
    const r = tripAt(s, Math.abs(d), tau);
    const sign = Math.sign(d) || 1;
    st = {level: pos + sign * r.x, v: sign * r.v, phase: r.phase, target: k.level, arrive: k.at + s.T, open: 0};
    pos = st.level;
  }
  st.open = doorsAt(c.doors, t);
  return st;
};

/** Doors open fraction at t from keys (each move takes `DOOR_TIME`, cubic in-out). */
export const doorsAt = (keys: DoorKey[] | undefined, t: number, initial = false) => {
  let o = initial ? 1 : 0;
  for (const k of [...(keys ?? [])].sort((a, b) => a.at - b.at)) {
    if (t < k.at) break;
    const u = interpolate(t, [k.at, k.at + DOOR_TIME], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.inOut(Easing.cubic),
    });
    o = o + ((k.open ? 1 : 0) - o) * u;
  }
  return o;
};

// ---------------------------------------------------------------- people

/** Where a spot is: a point on a level's floor (world x, z), or a place inside a car. */
export type SpotPos = {x: number; z: number; car?: string; face?: number; via?: {x: number; z: number}[]};

/**
 * A spot the scene knows by name ('panel', 'corridor', 'door:B', 'car:C', 'keypad', ...) or a world
 * [x, z] on the person's level.
 */
export type Spot = string | [number, number];

export type PersonSpec = {
  /** Cast member (default 'extra'). */
  who?: 'you' | 'friend' | 'mom' | 'extra';
  /** Seeds idle life and the slot in a car (default: the index). */
  seed?: string;
  /** Level the person starts on (default 0). Riding a car changes it. */
  level?: number;
  /** Where they start (default 'corridor' on the tower, 'entrance' in the hotel). */
  start?: Spot;
  /** Seconds into the scene when they appear at `start` (default: there from the start). */
  appear?: number;
  /**
   * Walks, in time order: from `at` they walk to `to` (≈ 1.1 units/s). 'car:X' walks in through
   * X's door and rides it (its doors should be open at their level); walking out of a car lands
   * on the level where it stands. Reaching 'corridor', 'entrance' or 'exit' they leave the slice.
   */
  path?: {at: number; to: Spot}[];
  /**
   * The right hand on a button: `true` holds it there, or keys [{at, on}] raise (on) and lower it.
   * The button is the one at their spot: the call panel ('panel'), the keypad ('keypad'), the bare
   * wall ('wall:B', a pat where a button would be).
   */
  press?: boolean | {at: number; on: boolean}[];
  /** Finger pushes (s): with the hand off, it rises, pushes, and drops again; on, it pushes in and eases back. */
  pushes?: number[];
  /** At a call panel: which button the hand is on (default 'down'; the lobby has only 'up'). */
  button?: 'up' | 'down';
  /** At the keypad: the key each push lands on (0–9; the last one repeats; default 9). */
  keys?: number[];
  /** A hand raised, puzzled (s; held ≈ 1.2 s). */
  raise?: number[];
  /** Looks round (s; left, right, back over ≈ 2 s). */
  lookAround?: number[];
  /** Checks a watch: left wrist up, head down (s; ≈ 1.6 s). */
  watch?: number[];
  /** Rig poses on top (look-up, turn-to, glance-down; targets in world space). */
  gestures?: {pose: 'look-up' | 'turn-to' | 'glance-down'; at: number; target?: V3; hold?: number; blend?: number}[];
  /** Pulls a rolling suitcase. */
  suitcase?: boolean;
  /** Facing when standing still at a spot without one, radians about y (0 faces the camera's side, +z). */
  face?: number;
};

export const WALK_SPEED = 1.1;
/** Units walked per full step cycle (two steps). */
export const STRIDE = 1.3;

export type Resolver = {
  /** A named spot on a level (or in a car). */
  spot: (name: string, level: number, seed: string) => SpotPos | null;
  /** A car's world x, its floor y at t, its door front (z) and its interior centre (z). */
  car: (letter: string, t: number) => {x: number; y: number; level: number; doorZ: number; centreZ: number} | null;
  /** A level's floor height. */
  levelY: (level: number) => number;
  /** Spots that end a walk out of the slice. */
  exits: string[];
};

export type PersonState = {
  visible: boolean;
  /** World position of the feet. */
  pos: V3;
  /** Facing about y. */
  rot: number;
  /** Step phase (cycles) and stride amount 0–1. */
  walk: {phase: number; amount: number};
  level: number;
  /** Riding this car (letter), if any. */
  car?: string;
  /** The spot they stand at (or are walking to). */
  spot?: Spot;
  /** On the way (not yet at `spot`). */
  walking?: boolean;
};

const ease3 = (x: number, a: number, b: number) =>
  interpolate(x, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});

const headingOf = (dx: number, dz: number) => Math.atan2(dx, dz);
const angDiff = (a: number, b: number) => {
  let d = b - a;
  while (d > Math.PI) d -= 2 * Math.PI;
  while (d < -Math.PI) d += 2 * Math.PI;
  return d;
};

/**
 * A person at t: where their feet are, which way they face, their step. Each walk is a polyline
 * (through a car's door when boarding or leaving) at walking speed, easing in and out over its
 * first and last 0.35 s; the body turns to the heading over 0.4 s.
 */
export const personAt = (p: PersonSpec, index: number, t: number, R: Resolver): PersonState => {
  const seed = p.seed ?? `p${index}`;
  let level = p.level ?? 0;
  let car: string | undefined;
  let at: Spot = p.start ?? 'corridor';
  const resolve = (s: Spot, lv: number): SpotPos | null => (typeof s === 'string' ? R.spot(s, lv, seed) : {x: s[0], z: s[1]});
  let here = resolve(at, level) ?? {x: 0, z: 0};
  if (here.car) car = here.car;
  let rot = here.face ?? p.face ?? 0;
  let walked = 0;
  let amount = 0;
  let gone = false;
  const visibleFrom = p.appear ?? -Infinity;
  for (const leg of [...(p.path ?? [])].sort((a, b) => a.at - b.at)) {
    if (t < leg.at) break;
    // the start of the leg (riding: leave on the level where the car is when they set off)
    const pts: {x: number; z: number}[] = [];
    let startLevel = level;
    if (car) {
      const c = R.car(car, leg.at);
      if (c) {
        startLevel = Math.round(c.level);
        pts.push({x: c.x + here.x, z: c.centreZ + here.z}, {x: c.x, z: c.doorZ + 0.45});
      }
    } else {
      pts.push({x: here.x, z: here.z});
      // leaving a spot with a way in (the corridor): back out through it
      if (here.via) pts.push(...[...here.via].reverse());
    }
    const dest = resolve(leg.to, startLevel);
    if (!dest) continue;
    if (dest.via) pts.push(...dest.via);
    let destCar: string | undefined;
    if (dest.car) {
      const c = R.car(dest.car, leg.at);
      if (c) {
        pts.push({x: c.x, z: c.doorZ + 0.45}, {x: c.x + dest.x, z: c.centreZ + dest.z});
        destCar = dest.car;
      }
    } else pts.push({x: dest.x, z: dest.z});
    const lens = pts.slice(1).map((q, i) => Math.hypot(q.x - pts[i].x, q.z - pts[i].z));
    const total = lens.reduce((a, b) => a + b, 0);
    const dur = total / WALK_SPEED + 0.35;
    const u = Math.max(0, t - leg.at);
    // distance along: eased ends (a smoothstep on time, stretched by the 0.35 s it adds)
    const k = Math.min(1, u / dur);
    const s = total * (k * k * (3 - 2 * k) * 0.25 + k * 0.75);
    let rem = Math.min(total, s);
    let seg = 0;
    while (seg < lens.length - 1 && rem > lens[seg]) {
      rem -= lens[seg];
      seg++;
    }
    const a = pts[seg];
    const b = pts[seg + 1] ?? a;
    const f = lens[seg] > 0 ? rem / lens[seg] : 1;
    const x = a.x + (b.x - a.x) * f;
    const z = a.z + (b.z - a.z) * f;
    const heading = lens[seg] > 1e-4 ? headingOf(b.x - a.x, b.z - a.z) : rot;
    walked += s;
    const arrived = k >= 1;
    amount = arrived ? 0 : Math.min(1, u / 0.35, (dur - u) / 0.35);
    // the body turns toward the heading, then to the spot's facing on arrival
    const turnIn = ease3(u, 0, 0.4);
    rot = rot + angDiff(rot, heading) * turnIn;
    if (arrived) {
      const face = dest.face ?? p.face;
      if (face !== undefined) rot = rot + angDiff(rot, face) * ease3(u, dur, dur + 0.5);
    }
    level = startLevel;
    if (arrived) {
      at = leg.to;
      here = dest;
      car = destCar;
      if (typeof leg.to === 'string' && R.exits.includes(leg.to)) gone = true;
    } else {
      // walking: world position, not car-relative
      car = undefined;
      here = {x, z};
      at = leg.to;
      if (!arrived) {
        return {
          visible: t >= visibleFrom,
          pos: [x, R.levelY(level), z],
          rot,
          walk: {phase: walked / STRIDE, amount},
          level,
          spot: leg.to,
          walking: true,
        };
      }
    }
  }
  if (car) {
    const c = R.car(car, t);
    if (c) return {visible: t >= visibleFrom && !gone, pos: [c.x + here.x, c.y, c.centreZ + here.z], rot, walk: {phase: walked / STRIDE, amount: 0}, level: c.level, car, spot: at};
  }
  return {visible: t >= visibleFrom && !gone, pos: [here.x, R.levelY(level), here.z], rot, walk: {phase: walked / STRIDE, amount}, level, spot: at};
};

/**
 * How far the right hand is up on its button at t (0 at the side, 1 on it) and how far the finger
 * pushes in (0–1). Held: `press` true or keys; pushes add a press-and-release.
 */
export const handAt = (p: Pick<PersonSpec, 'press' | 'pushes'>, t: number): {up: number; push: number} => {
  const RISE = 0.5;
  let up = p.press === true ? 1 : 0;
  if (Array.isArray(p.press)) {
    for (const k of [...p.press].sort((a, b) => a.at - b.at)) {
      if (t < k.at) break;
      up = up + ((k.on ? 1 : 0) - up) * ease3(t, k.at, k.at + RISE);
    }
  }
  let push = 0;
  for (const at of p.pushes ?? []) {
    // off: rise 0.5 s, push, hold 0.4 s, drop over 0.6 s
    const held = up > 0.5;
    const p0 = held ? at : at + RISE;
    if (!held) up = Math.max(up, ease3(t, at, at + RISE) * (1 - ease3(t, p0 + 0.6, p0 + 1.2)));
    push = Math.max(push, ease3(t, p0, p0 + 0.12) * (1 - ease3(t, p0 + 0.2, p0 + 0.45)));
  }
  return {up, push};
};

/** How far the fingertip is in at a push (0–1) when it touches the button (the cap moves after this). */
export const PUSH_CONTACT = 0.75;

/** Which push (index) is current at t: the last push started by t (−1 before the first). */
export const pushIndex = (pushes: number[] | undefined, t: number) => {
  let i = -1;
  [...(pushes ?? [])].sort((a, b) => a - b).forEach((at, k) => {
    if (t >= at) i = k;
  });
  return i;
};

/** The moments (s) each push touches its button: for lighting it as the finger lands. */
export const pushContacts = (p: Pick<PersonSpec, 'press' | 'pushes'>): number[] =>
  (p.pushes ?? []).map((at) => {
    for (let x = at; x < at + 1.5; x += 1 / 240) {
      const h = handAt(p, x);
      if (h.push * h.up >= PUSH_CONTACT) return Math.round(x * 240) / 240;
    }
    return at;
  });

/** 0–1 bump for a timed action lasting `len` s with `blend` s in and out. */
export const bump = (times: number[] | undefined, t: number, len: number, blend = 0.4) =>
  Math.max(0, ...(times ?? []).map((a) => ease3(t, a, a + blend) * (1 - ease3(t, a + len - blend, a + len))));
