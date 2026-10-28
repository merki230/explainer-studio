/*
 * No. 010 draft 2: what moves at the charging station, as pure functions of scene time (no React, no three).
 *
 *  - The car's drive (`carDriveAt`): it reverses into its bay from `from` metres along −x, slowing steadily to a
 *    stop at `arrive.at` (brake lamps lit over the stop, off 0.5 s after it), and later drives out forward
 *    (toward −x), speeding up steadily over `leave.for` seconds, then on at that speed. Before and after those
 *    windows it carries on at its end speed, so any key may sit outside the scene (negative or past its end).
 *    The wheels' drawn turn is capped under the spokes' alias limit (`wheelMotion.ts`, forward by default).
 *  - The driver (`driverTimeline` → `driverPoseAt`): a grey extra acting out keys (`DriverKey`): get out, walk,
 *    plug in, lean, sit on the curb, phone, glance, unplug, get back in. Each key that needs the driver somewhere
 *    walks them there first (as late as it can, after the previous key; squeezed when there isn't time), so a
 *    director keys the beats, not the footsteps.
 *  - The plug: in the holster, in the hand, or latched in the port (`plugAt`). The current flows only while
 *    it's latched (the scene gates the bay's `amps` by it).
 *
 * World: the bay's frame (x along the bay, the parked car's centre at x 0, facing −x; y up from the bay's
 * surface; z toward the camera). Metres, seconds.
 */
import {CABINET, CHARGER_AT, CURB, ISLAND_H} from './ChargeSite';
import type {ShellProfile} from './CarShell';
import {carLayout, chargePortAt} from './RealCar';
import {capSpeed} from './wheelMotion';

type V3 = [number, number, number];
type P2 = [number, number];

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
/** Cubic in-out on 0 → 1. */
const e3 = (u: number) => {
  const x = clamp01(u);
  return x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2;
};
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
/** The shortest turn from a to b, by u. */
const lerpAngle = (a: number, b: number, u: number) => {
  let d = (b - a) % (Math.PI * 2);
  if (d > Math.PI) d -= Math.PI * 2;
  if (d < -Math.PI) d += Math.PI * 2;
  return a + d * u;
};

// ---------------------------------------------------------------- the car's drive

/** Reversing into the bay: it stops (parked) at `at`, having come `from` metres (default 8) over `for` s (default 3). */
export type ChargeArrive = {at: number; from?: number; for?: number};
/** Driving out forward from `at`: `to` metres (default 14) over `for` s (default 3.2), speeding up steadily; then on at that speed. */
export type ChargeLeave = {at: number; to?: number; for?: number};

/** The wheel radius (m) of every cut car. */
export const WHEEL_R = 0.36;

export type CarDrive = {
  /** World x of the car's centre (0 = parked at the charger). */
  x: number;
  /** Speed (m/s), + forward (toward −x), − reversing. */
  speed: number;
  /** Brake lamps 0 → 1. */
  brake: number;
  /** True while it stands at the charger (x 0, not moving). */
  parked: boolean;
};

/** Where a bay's car is at t (see the file comment). No `arrive`: parked from the start; no `leave`: stays. */
export const carDriveAt = (arrive: ChargeArrive | undefined, leave: ChargeLeave | undefined, t: number): CarDrive => {
  const lv = leave && (!arrive || leave.at > arrive.at) ? leave : undefined;
  let x = 0;
  let speed = 0;
  if (arrive && t < arrive.at) {
    const D = Math.max(0.01, arrive.from ?? 8);
    const T = Math.max(0.05, arrive.for ?? 3);
    const v0 = (2 * D) / T;
    const t0 = arrive.at - T;
    if (t < t0) {
      x = -D - v0 * (t0 - t);
      speed = -v0;
    } else {
      const u = (t - t0) / T;
      x = -D * (1 - u) ** 2;
      speed = -v0 * (1 - u);
    }
  } else if (lv && t > lv.at) {
    const L = Math.max(0.01, lv.to ?? 14);
    const T = Math.max(0.05, lv.for ?? 3.2);
    const v1 = (2 * L) / T;
    if (t < lv.at + T) {
      const u = (t - lv.at) / T;
      x = -L * u * u;
      speed = v1 * u;
    } else {
      x = -L - v1 * (t - lv.at - T);
      speed = v1;
    }
  }
  let brake = 0;
  if (arrive) {
    const T = Math.max(0.05, arrive.for ?? 3);
    const on = arrive.at - Math.min(0.6, 0.4 * T);
    const off = arrive.at + 0.5;
    brake = t < on || t > off + 0.12 ? 0 : Math.min(clamp01((t - on) / 0.08), 1 - clamp01((t - off) / 0.12));
  }
  return {x, speed, brake, parked: Math.abs(x) < 1e-6 && speed === 0};
};

/**
 * The wheels' drawn turn (revolutions, + forward) at t, 0 at the stop: ∫ min(|v|, cap) of the drive, so a fast
 * car never strobes backward (`wheelMotion.ts`); the extra speed is the smear's (`SlicedCar` from `driving`).
 */
export const carWheelRevs = (arrive: ChargeArrive | undefined, leave: ChargeLeave | undefined, t: number, fps = 30) => {
  const cap = capSpeed(WHEEL_R, fps);
  const capped = (v: number) => Math.sign(v) * Math.min(Math.abs(v), cap);
  const STEP = 1 / 240;
  // ∫ from a to b of the capped speed (fixed steps; a ≤ b)
  const integ = (a: number, b: number) => {
    let s = 0;
    for (let x = a; x < b; x += STEP) {
      const h = Math.min(STEP, b - x);
      s += capped(carDriveAt(arrive, leave, x + h / 2).speed) * h;
    }
    return s;
  };
  let m = 0;
  if (arrive && t < arrive.at) {
    const T = Math.max(0.05, arrive.for ?? 3);
    const t0 = arrive.at - T;
    const v0 = (2 * Math.max(0.01, arrive.from ?? 8)) / T;
    m = -integ(Math.max(t, t0), arrive.at) - (t < t0 ? capped(-v0) * (t0 - t) : 0);
  } else if (leave && (!arrive || leave.at > arrive.at) && t > leave.at) {
    const T = Math.max(0.05, leave.for ?? 3.2);
    const v1 = (2 * Math.max(0.01, leave.to ?? 14)) / T;
    m = integ(leave.at, Math.min(t, leave.at + T)) + (t > leave.at + T ? capped(v1) * (t - leave.at - T) : 0);
  }
  return m / (2 * Math.PI * WHEEL_R);
};

// ---------------------------------------------------------------- the driver

/** A place by the bay: a name, or [x, z] (the figure's feet). */
export type DriverSpot = 'door' | 'cabinet' | 'port' | 'quarter' | 'curb' | P2;

/**
 * One beat of the driver's path (seconds into the scene; any time, in or out of the scene):
 *  - `exit`: from `at` they swing out of the seat through the cut side and stand by the door (1.3 s).
 *  - `enter`: from `at` they sit back in (1.3 s), walking to the door first. The seat is empty while they're out.
 *  - `walkTo`: from `at`, walk to `to` (≈ 1.3 m/s, or `speed`).
 *  - `plug`: the plug **latches at `at`**: before it they walk to the charger, lift the plug from its holster,
 *    carry it to the port and push it in.
 *  - `unplug`: the plug **leaves the port at `at`**; then they carry it back and holster it.
 *  - `lean`: from `at`, lean on the car's rear quarter (walking there first), or at `to` ([x, z], the feet).
 *  - `sit`: from `at`, sit down on the curb (walking there first). `stand`: from `at`, stand up (or stop leaning).
 *  - `phone`: the phone comes out at `at` (its screen to the face, never the camera), scrolling; `pocket` puts it away.
 *  - `glance`: from `at`, the head turns to `to` ('car', 'cabinet', 'port', 'clock' or a point) and holds `hold` s (default 1).
 *  - `shift`: a weight shift (the hips sway once, 1 s).
 */
export type DriverKey =
  | {at: number; do: 'exit' | 'enter' | 'plug' | 'unplug' | 'sit' | 'stand' | 'pocket' | 'shift'}
  | {at: number; do: 'lean'; to?: P2}
  | {at: number; do: 'walkTo'; to: DriverSpot; speed?: number}
  | {at: number; do: 'phone'; scroll?: boolean}
  | {at: number; do: 'glance'; to: 'car' | 'cabinet' | 'port' | 'clock' | V3; hold?: number};

export type ChargeDriver = {
  /** The beats, in any order. */
  keys: DriverKey[];
  /** Where they are before the first key: in the car (default) or standing at a spot. */
  start?: 'car' | DriverSpot;
  /** Which grey extra: 'a' (`CAST.extra`) or 'b' (`EXTRA_B`: another skin and hair). Default: the top bay's 'b', the bottom's 'a'. */
  look?: 'a' | 'b';
  /** × every move's speed (a fast-forward driver). Default 1. */
  rate?: number;
};

/** The bay's fixed points for a driver (world, the bay's frame, the car parked). */
export type DriverGeo = {
  /** The seated driver's figure origin (on the car's floor) and turn. */
  seat: V3;
  door: P2;
  cabinet: P2;
  holster: V3;
  port: P2 | null;
  portNose: V3 | null;
  quarter: P2;
  /** On the curb: the pelvis point, its top, the way the sitter faces. */
  curb: {at: P2; top: number; rot: number};
  plugKind: 'gbt' | 'nacs';
  /** Boxes to walk round: [x0, x1, zFront] (everything behind zFront between x0 and x1). */
  avoid: [number, number, number][];
  /** Where the clock is (for a glance). */
  clock: V3;
};

/** The carry pose's nose (figure-local, standing: origin on the ground, facing +z). */
const CARRY: V3 = [-0.2, 1.05, 0.5];
/** The grip's offset from the nose (back along the plug's axis, down), per kind. */
const GRIP = {gbt: [0.16, 0.1], nacs: [0.215, 0.035]} as const;
/** The figure's hands hanging (standing, figure-local). */
const HANDS_DOWN: [V3, V3] = [
  [-0.26, 0.82, 0.02],
  [0.26, 0.82, 0.02],
];
/** Arms crossed over the chest (leaning). */
const HANDS_FOLDED: [V3, V3] = [
  [0.15, 1.17, 0.2],
  [-0.15, 1.13, 0.22],
];
/** Hands on the knees (sitting on the curb; seated-mode local). */
const HANDS_KNEES: [V3, V3] = [
  [-0.15, 0.78, 0.33],
  [0.15, 0.78, 0.33],
];
/** The seated driver's hands on the wheel (as `SlicedCar`). */
const HANDS_WHEEL: [V3, V3] = [
  [-0.16, 1.02, 0.4],
  [0.16, 1.04, 0.41],
];
/** How far the body rises standing (Figure `STAND_LIFT`). */
const LIFT = 0.47;
/** Units walked per step cycle (towerMotion `STRIDE`). */
const STRIDE = 1.3;
const WALK = 1.3;
/** The lean's tilt back (rad). */
const LEAN = 0.13;
/** How far in front of the curb the feet stand (m): the hips go back this far as they sit. */
const SIT_BACK = 0.52;

/**
 * The bay's driver points for a region and car shape: the door (outside the cut side by the seat), the
 * charger (in front of its holster), the port (behind the rear wheel, the plug at arm's length), the rear
 * quarter (to lean on), the curb (`CURB`, past the charger).
 */
export const driverGeo = (region: 'china' | 'us', shape: ShellProfile): DriverGeo => {
  const kind = region === 'us' ? 'us' : 'china';
  const c = CABINET[kind];
  const foot: V3 = [CHARGER_AT[0], ISLAND_H, CHARGER_AT[2]];
  const holster: V3 = [foot[0] + c.holster[0], foot[1] + c.holster[1], foot[2] + c.holster[2] + 0.06];
  const lay = carLayout(shape, 'near');
  const p = chargePortAt(shape);
  const portNose: V3 = [-p[0], p[1], p[2]];
  // the spot whose carry pose (facing −z) puts the nose at a point: x − 0.2 → +0.2 world, z + 0.5
  const spotFor = (n: V3): P2 => [n[0] + CARRY[0], n[2] + CARRY[2]];
  const cx = CHARGER_AT[0];
  const islandFront = CHARGER_AT[2] + 0.475;
  return {
    seat: [-lay.driver[0], lay.driver[1], lay.driver[2]],
    door: [-lay.driver[0] + 0.1, 1.38],
    cabinet: spotFor(holster),
    holster,
    port: spotFor(portNose),
    portNose,
    quarter: [1.48, 1.24],
    curb: {at: [CURB.x0 + 0.75, (CURB.z0 + CURB.z1) / 2], top: CURB.h, rot: 0.48},
    plugKind: region === 'us' ? 'nacs' : 'gbt',
    avoid: [
      [cx - 0.82, cx + 0.82, islandFront + 0.26],
      [-2.6, 2.55, 1.08],
      [CURB.x0 - 0.05, CURB.x1 + 0.05, CURB.z1 + 0.05],
    ],
    clock: [CLOCK_AT[0], CLOCK_AT[1], CLOCK_AT[2]],
  };
};

/** The station clock's centre in the bay's frame (where a glance at 'clock' looks; `StationClock` stands there). */
export const CLOCK_AT: V3 = [-4.15, 2.65, 1.75];

type Plug = 'holster' | 'port' | 'hand';
type Posture = 'car' | 'stand' | 'lean' | 'sit';

/** A piece of the timeline: a move from t0 to t1 (its end state holds until the next one). */
type Seg =
  | {k: 'car'; t0: number; t1: number}
  | {k: 'exit' | 'enter'; t0: number; t1: number}
  | {k: 'hold'; t0: number; t1: number; pos: P2; rot: number; posture: 'stand' | 'lean' | 'sit'; plug: Plug; walked: number}
  | {k: 'walk'; t0: number; t1: number; path: P2[]; len: number; rot0: number; rot1: number | null; walked: number; plug: Plug}
  | {k: 'reach' | 'lift' | 'insert' | 'release'; t0: number; t1: number; pos: P2; rot: number; place: 'holster' | 'port'; walked: number}
  | {k: 'leanIn' | 'leanOut'; t0: number; t1: number; pos: P2; rot: number; walked: number}
  | {k: 'sitDown' | 'standUp'; t0: number; t1: number; stand: P2; rot: number; walked: number};

export type DriverTimeline = {segs: Seg[]; geo: DriverGeo; keys: DriverKey[]; look: 'a' | 'b'; latched: [number, number][]};

/** The polyline from a to b round the boxes (front corners), then its length. */
const routeAround = (a: P2, b: P2, avoid: [number, number, number][]): P2[] => {
  const hits = (p: P2, q: P2, r: [number, number, number]) => {
    for (let i = 0; i <= 24; i++) {
      const x = lerp(p[0], q[0], i / 24);
      const z = lerp(p[1], q[1], i / 24);
      if (x > r[0] && x < r[1] && z < r[2]) return true;
    }
    return false;
  };
  const pts: P2[] = [a];
  let from = a;
  for (const r of avoid) {
    if (!hits(from, b, r)) continue;
    const zf = r[2] + 0.08;
    const right = b[0] > from[0];
    const c1: P2 = [right ? r[0] - 0.05 : r[1] + 0.05, zf];
    const c2: P2 = [right ? r[1] + 0.05 : r[0] - 0.05, zf];
    // only the corners on the way (an end already past a corner skips it)
    if (right ? from[0] < c1[0] : from[0] > c1[0]) pts.push(c1);
    if (right ? b[0] > c2[0] : b[0] < c2[0]) pts.push(c2);
    from = pts[pts.length - 1];
  }
  pts.push(b);
  return pts;
};
const pathLen = (p: P2[]) => p.reduce((s, q, i) => (i ? s + Math.hypot(q[0] - p[i - 1][0], q[1] - p[i - 1][1]) : 0), 0);
const heading = (a: P2, b: P2) => Math.atan2(b[0] - a[0], b[1] - a[1]);

const spotOf = (g: DriverGeo, s: DriverSpot): {pos: P2; rot: number | null} => {
  if (Array.isArray(s)) return {pos: s, rot: null};
  if (s === 'door') return {pos: g.door, rot: null};
  if (s === 'cabinet') return {pos: g.cabinet, rot: Math.PI};
  if (s === 'port') return {pos: g.port ?? g.cabinet, rot: Math.PI};
  if (s === 'quarter') return {pos: g.quarter, rot: 0.35};
  // the curb: standing just in front of the sitting place, facing the way they'll sit
  const r = g.curb.rot;
  const o: P2 = [g.curb.at[0] + Math.sin(r) * 0.1, g.curb.at[1] + Math.cos(r) * 0.1];
  return {pos: [o[0] + Math.sin(r) * SIT_BACK, o[1] + Math.cos(r) * SIT_BACK], rot: r};
};

/** Build a driver's timeline from its keys (see `DriverKey`). `notBefore`: nothing starts earlier (the car's stop). */
export const driverTimeline = (d: ChargeDriver, g: DriverGeo, notBefore = -Infinity): DriverTimeline => {
  const rate = Math.max(0.05, d.rate ?? 1);
  const segs: Seg[] = [];
  const latched: [number, number][] = [];
  const startSpot = d.start && d.start !== 'car' ? spotOf(g, d.start) : null;
  const cur = {
    t: notBefore,
    posture: (startSpot ? 'stand' : 'car') as Posture,
    pos: startSpot ? startSpot.pos : g.door,
    rot: startSpot?.rot ?? 0,
    plug: 'holster' as Plug,
    walked: 0,
  };
  if (cur.posture === 'car') segs.push({k: 'car', t0: -Infinity, t1: -Infinity});
  else segs.push({k: 'hold', t0: -Infinity, t1: -Infinity, pos: cur.pos, rot: cur.rot, posture: 'stand', plug: 'holster', walked: 0});

  type Step = {d: number; run: (t0: number, t1: number) => void};
  const walkStep = (to: P2, rot1: number | null, speed = WALK): Step | null => {
    const path = routeAround(cur.pos, to, g.avoid);
    const len = pathLen(path);
    if (len < 0.04) {
      if (rot1 === null || Math.abs(lerpAngle(cur.rot, rot1, 1) - cur.rot) < 0.05) return null;
      // a turn on the spot
      return {
        d: 0.4 / rate,
        run: (t0, t1) => {
          segs.push({k: 'walk', t0, t1, path: [cur.pos, cur.pos], len: 0, rot0: cur.rot, rot1, walked: cur.walked, plug: cur.plug});
          cur.rot = rot1;
        },
      };
    }
    return {
      d: (len / speed + 0.35) / rate,
      run: (t0, t1) => {
        segs.push({k: 'walk', t0, t1, path, len, rot0: cur.rot, rot1, walked: cur.walked, plug: cur.plug});
        cur.walked += len;
        cur.pos = to;
        cur.rot = rot1 ?? heading(path[path.length - 2], to);
      },
    };
  };
  /** Steps that get them on their feet. */
  const standSteps = (): Step[] => {
    if (cur.posture === 'car')
      return [
        {
          d: 1.3 / rate,
          run: (t0, t1) => {
            segs.push({k: 'exit', t0, t1});
            cur.posture = 'stand';
            cur.pos = g.door;
            cur.rot = 0;
          },
        },
      ];
    if (cur.posture === 'lean')
      return [
        {
          d: 0.5 / rate,
          run: (t0, t1) => {
            segs.push({k: 'leanOut', t0, t1, pos: cur.pos, rot: cur.rot, walked: cur.walked});
            cur.posture = 'stand';
          },
        },
      ];
    if (cur.posture === 'sit')
      return [
        {
          d: 0.9 / rate,
          run: (t0, t1) => {
            const s = spotOf(g, 'curb');
            segs.push({k: 'standUp', t0, t1, stand: s.pos, rot: g.curb.rot, walked: cur.walked});
            cur.posture = 'stand';
            cur.pos = s.pos;
            cur.rot = g.curb.rot;
          },
        },
      ];
    return [];
  };
  const handStep = (k: 'reach' | 'lift' | 'insert' | 'release', place: 'holster' | 'port', dur: number, after?: () => void): Step => ({
    d: dur / rate,
    run: (t0, t1) => {
      segs.push({k, t0, t1, pos: cur.pos, rot: cur.rot, place, walked: cur.walked});
      after?.();
    },
  });
  /**
   * Lay out steps: `pre` must end by `anchor` (started as late as possible after the previous beat, squeezed
   * when there isn't time), `post` runs from it. Steps are built lazily (each sees the state the last left).
   */
  const schedule = (anchor: number, pre: (() => Step | Step[] | null)[], post: (() => Step | Step[] | null)[]) => {
    // a dry run for the durations: build on a copy of the state, then roll back
    const snap = {...cur};
    const nSegs = segs.length;
    let total = 0;
    for (const f of pre) {
      const r = f();
      for (const s of r === null ? [] : Array.isArray(r) ? r : [r]) {
        total += s.d;
        s.run(0, 0);
      }
    }
    segs.length = nSegs;
    Object.assign(cur, snap);
    const earliest = cur.t;
    let start = anchor - total;
    let k = 1;
    if (start < earliest) {
      start = earliest;
      const room = anchor - earliest;
      k = total > 0 ? Math.max(0.2, Math.min(1, room / total)) : 1;
    }
    let t = start;
    for (const f of pre) {
      const r = f();
      for (const s of r === null ? [] : Array.isArray(r) ? r : [r]) {
        s.run(t, t + s.d * k);
        t += s.d * k;
      }
    }
    for (const f of post) {
      const r = f();
      for (const s of r === null ? [] : Array.isArray(r) ? r : [r]) {
        s.run(t, t + s.d);
        t += s.d;
      }
    }
    cur.t = t;
    return start + total * k;
  };

  const order = [...d.keys].map((key, i) => ({key, i})).sort((a, b) => a.key.at - b.key.at || a.i - b.i);
  for (const {key} of order) {
    switch (key.do) {
      case 'exit':
        if (cur.posture === 'car') schedule(key.at, [], [standSteps]);
        break;
      case 'enter': {
        if (cur.posture === 'car') break;
        if (cur.plug === 'hand') break;
        schedule(key.at, [standSteps, () => walkStep(g.door, 0)], [
          () => ({
            d: 1.3 / rate,
            run: (t0, t1) => {
              segs.push({k: 'enter', t0, t1});
              // seated again: from here the car's own driver is drawn (and leaves with it), not a figure at the bay's seat
              segs.push({k: 'car', t0: t1, t1});
              cur.posture = 'car';
            },
          }),
        ]);
        break;
      }
      case 'walkTo': {
        const s = spotOf(g, key.to);
        schedule(key.at, [standSteps], [() => walkStep(s.pos, s.rot, (key.speed ?? WALK) * 1)]);
        break;
      }
      case 'plug': {
        if (!g.port || cur.plug !== 'holster') break;
        const port = g.port;
        let latch = key.at;
        latch = schedule(
          key.at,
          [
            standSteps,
            () => walkStep(g.cabinet, Math.PI),
            () => handStep('reach', 'holster', 0.3),
            () => handStep('lift', 'holster', 0.35, () => (cur.plug = 'hand')),
            () => walkStep(port, Math.PI),
            () => handStep('insert', 'port', 0.4, () => (cur.plug = 'port')),
          ],
          [() => handStep('release', 'port', 0.3)],
        );
        latched.push([latch, Infinity]);
        break;
      }
      case 'unplug': {
        if (!g.port || cur.plug !== 'port') break;
        const port = g.port;
        const out = schedule(
          key.at,
          [standSteps, () => walkStep(port, Math.PI), () => handStep('reach', 'port', 0.3)],
          [
            () => handStep('lift', 'port', 0.35, () => (cur.plug = 'hand')),
            () => walkStep(g.cabinet, Math.PI),
            () => handStep('insert', 'holster', 0.4, () => (cur.plug = 'holster')),
            () => handStep('release', 'holster', 0.3),
          ],
        );
        const last = latched[latched.length - 1];
        if (last && last[1] === Infinity) last[1] = out;
        break;
      }
      case 'lean': {
        if (cur.plug === 'hand') break;
        schedule(key.at, [standSteps, () => walkStep(key.to ?? g.quarter, 0.35)], [
          () => ({
            d: 0.6 / rate,
            run: (t0, t1) => {
              segs.push({k: 'leanIn', t0, t1, pos: cur.pos, rot: cur.rot, walked: cur.walked});
              cur.posture = 'lean';
            },
          }),
        ]);
        break;
      }
      case 'sit': {
        if (cur.posture === 'sit' || cur.plug === 'hand') break;
        const s = spotOf(g, 'curb');
        schedule(key.at, [standSteps, () => walkStep(s.pos, g.curb.rot)], [
          () => ({
            d: 0.9 / rate,
            run: (t0, t1) => {
              segs.push({k: 'sitDown', t0, t1, stand: s.pos, rot: g.curb.rot, walked: cur.walked});
              cur.posture = 'sit';
            },
          }),
        ]);
        break;
      }
      case 'stand':
        if (cur.posture === 'sit' || cur.posture === 'lean') schedule(key.at, [], [standSteps]);
        break;
      default:
        break;
    }
  }
  return {segs, geo: g, keys: d.keys, look: d.look ?? 'a', latched};
};

/** What a driver looks like at t, in world terms the scene turns into `Figure` props. */
export type DriverPose = {
  /** In the car: the seated driver is `SlicedCar`'s own (the scene draws nothing). */
  inCar: boolean;
  /** The figure's origin (world) and turn. */
  pos: V3;
  rot: number;
  stance: 'stand' | 'sit';
  walk?: {phase: number; amount: number};
  /** Seated-mode feet (figure-local, `Figure` `legs`): [ankle y, ankle z]. */
  ankles?: [number, number];
  /** The lean back (rad, about the feet). */
  tilt: number;
  /** Hands (world): [right, left], or null for the phone's grips. */
  hands: [V3, V3] | null;
  /** The pose under the phone and glances ('drive' in the seat). */
  base: 'idle' | 'drive';
  /** Where the plug is, if this driver has it: the nose (world) and the way it points. */
  plug: {nose: V3; dir: V3} | null;
  /** The phone is shown (0 → 1 as it comes out). */
  phone: number;
  /** Scrolling. */
  scroll: boolean;
  /** When the phone came out (scene s), or null. */
  phoneAt: number | null;
  /** Glances: (world target, start, hold). */
  glances: {at: number; target: V3; hold: number}[];
};

const fwdOf = (rot: number): P2 => [Math.sin(rot), Math.cos(rot)];
/** Figure-local (standing coordinates) → world, for a figure at (pos, rot) on the ground. */
const toWorld = (pos: P2, rot: number, v: V3, y0 = 0): V3 => {
  const c = Math.cos(rot);
  const s = Math.sin(rot);
  return [pos[0] + v[0] * c + v[2] * s, y0 + v[1], pos[1] - v[0] * s + v[2] * c];
};

/** The plug's nose in the carry pose for a figure at (pos, rot): pointing the way they face. */
const carryNose = (pos: P2, rot: number) => toWorld(pos, rot, CARRY);
/** The grip (where the hand goes) for a plug pose. */
const gripOf = (nose: V3, dir: V3, kind: 'gbt' | 'nacs'): V3 => {
  const [b, dn] = GRIP[kind];
  return [nose[0] - dir[0] * b, nose[1] - dn, nose[2] - dir[2] * b];
};

/** The driver at t (see `DriverPose`). */
export const driverPoseAt = (tl: DriverTimeline, t: number): DriverPose => {
  const g = tl.geo;
  // the segment in play: the last one started (its end state holds)
  let seg = tl.segs[0];
  for (const s of tl.segs) if (s.t0 <= t) seg = s;
  const u = seg.t1 > seg.t0 ? clamp01((t - seg.t0) / (seg.t1 - seg.t0)) : 1;
  const placeNose = (pl: 'holster' | 'port'): V3 => (pl === 'port' && g.portNose ? g.portNose : g.holster);
  const DIR_IN: V3 = [0, 0, -1];
  const base: DriverPose = {
    inCar: false,
    pos: [0, 0, 0],
    rot: 0,
    stance: 'stand',
    tilt: 0,
    hands: null,
    base: 'idle',
    plug: null,
    phone: 0,
    scroll: false,
    phoneAt: null,
    glances: [],
  };
  const standAt = (pos: P2, rot: number, walked: number): DriverPose => ({
    ...base,
    pos: [pos[0], 0, pos[1]],
    rot,
    walk: {phase: walked / STRIDE, amount: 0},
  });
  const handsDown = (pos: P2, rot: number): [V3, V3] => [toWorld(pos, rot, HANDS_DOWN[0]), toWorld(pos, rot, HANDS_DOWN[1])];
  let p: DriverPose;
  switch (seg.k) {
    case 'car':
      p = {...base, inCar: true};
      break;
    case 'exit':
    case 'enter': {
      const v = seg.k === 'exit' ? u : 1 - u;
      const [sx, sy, sz] = g.seat;
      const [dx, dz] = g.door;
      const a = e3(v / 0.45);
      const b = e3((v - 0.45) / 0.55);
      const rot = lerp(-Math.PI / 2, 0, a);
      const ox = lerp(sx, dx, b);
      const oy = lerp(sy, LIFT, b);
      const oz = lerp(lerp(sz, sz + 0.25, a), dz, b);
      // feet: from the car's floor out over the sill, then down under the hips
      const ay = v < 0.45 ? lerp(0.1, 0.12 - sy, a) : 0.1 - oy;
      const az = v < 0.45 ? lerp(0.5, 0.62, a) : lerp(0.62, 0.0, b);
      const hw = (h: V3): V3 => {
        const c = Math.cos(rot);
        const s = Math.sin(rot);
        return [ox + h[0] * c + h[2] * s, oy + h[1], oz - h[0] * s + h[2] * c];
      };
      // the hands leave the wheel for the sides as they swing out
      const hands: [V3, V3] = [0, 1].map((i) => {
        const w = hw(HANDS_WHEEL[i]);
        const d = hw([HANDS_DOWN[i][0], HANDS_DOWN[i][1] - LIFT, HANDS_DOWN[i][2]]);
        return [lerp(w[0], d[0], a), lerp(w[1], d[1], a), lerp(w[2], d[2], a)] as V3;
      }) as [V3, V3];
      p = {...base, pos: [ox, oy, oz], rot, stance: 'sit', ankles: [ay, az], hands, base: a < 0.5 ? 'drive' : 'idle'};
      break;
    }
    case 'hold': {
      if (seg.posture === 'sit') {
        p = sitPose(g, spotOf(g, 'curb').pos, g.curb.rot, 1, base);
      } else {
        p = {...standAt(seg.pos, seg.rot, seg.walked), tilt: seg.posture === 'lean' ? LEAN : 0};
        p.hands = seg.posture === 'lean' ? [toWorld(seg.pos, seg.rot, HANDS_FOLDED[0]), toWorld(seg.pos, seg.rot, HANDS_FOLDED[1])] : null;
      }
      break;
    }
    case 'walk': {
      // a trapezoid of speed: 0.2 s up, steady, 0.2 s down; the turns at both ends
      const T = seg.t1 - seg.t0;
      const r = Math.min(0.2, T / 2);
      const tau = clamp01(u) * T;
      const vmax = seg.len / Math.max(1e-6, T - r);
      const s =
        tau < r ? (vmax * tau * tau) / (2 * r) : tau > T - r ? seg.len - (vmax * (T - tau) ** 2) / (2 * r) : vmax * (r / 2 + tau - r);
      const dist = Math.max(0, Math.min(seg.len, s));
      let pos: P2 = seg.path[0];
      let hd = seg.rot0;
      let acc = 0;
      for (let i = 1; i < seg.path.length; i++) {
        const a = seg.path[i - 1];
        const b = seg.path[i];
        const l = Math.hypot(b[0] - a[0], b[1] - a[1]);
        if (l < 1e-6) continue;
        if (dist <= acc + l || i === seg.path.length - 1) {
          const k = clamp01((dist - acc) / l);
          pos = [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];
          hd = heading(a, b);
          break;
        }
        acc += l;
      }
      const turnT = Math.min(0.35, T / 2);
      let rot = seg.len < 0.04 ? lerpAngle(seg.rot0, seg.rot1 ?? seg.rot0, e3(u)) : hd;
      if (seg.len >= 0.04) {
        if (tau < turnT) rot = lerpAngle(seg.rot0, hd, e3(tau / turnT));
        if (seg.rot1 !== null && tau > T - turnT) rot = lerpAngle(hd, seg.rot1, e3((tau - (T - turnT)) / turnT));
      }
      const amount = seg.len < 0.04 ? 0 : Math.min(1, Math.min(tau, T - tau) / 0.25) * Math.min(1, vmax / 1.0);
      p = {...standAt(pos, rot, seg.walked + dist), walk: {phase: (seg.walked + dist) / STRIDE, amount}};
      if (seg.plug === 'hand') {
        const nose = carryNose(pos, rot);
        const f = fwdOf(rot);
        const dir: V3 = [f[0], 0, f[1]];
        p.plug = {nose, dir};
        p.hands = [gripOf(nose, dir, g.plugKind), handsDown(pos, rot)[1]];
      }
      break;
    }
    case 'reach':
    case 'lift':
    case 'insert':
    case 'release': {
      p = standAt(seg.pos, seg.rot, seg.walked);
      const at = placeNose(seg.place);
      const carry = carryNose(seg.pos, seg.rot);
      const f = fwdOf(seg.rot);
      const cdir: V3 = [f[0], 0, f[1]];
      // the plug's pose: in its place, or carried, or between
      const w = seg.k === 'lift' ? e3(u) : seg.k === 'insert' ? 1 - e3(u) : seg.k === 'reach' ? (seg.place === 'port' || seg.place === 'holster' ? 0 : 1) : 0;
      const nose: V3 = [lerp(at[0], carry[0], w), lerp(at[1], carry[1], w), lerp(at[2], carry[2], w)];
      const dir: V3 = [lerp(DIR_IN[0], cdir[0], w), 0, lerp(DIR_IN[2], cdir[2], w)];
      const grip = gripOf(nose, dir, g.plugKind);
      const down = handsDown(seg.pos, seg.rot);
      // the right hand: to the grip (reach), on it (lift / insert), back down (release)
      const hk = seg.k === 'reach' ? e3(u) : seg.k === 'release' ? 1 - e3(u) : 1;
      p.hands = [[lerp(down[0][0], grip[0], hk), lerp(down[0][1], grip[1], hk), lerp(down[0][2], grip[2], hk)], down[1]];
      if (seg.k === 'lift' || seg.k === 'insert') p.plug = {nose, dir};
      break;
    }
    case 'leanIn':
    case 'leanOut': {
      const k = seg.k === 'leanIn' ? e3(u) : 1 - e3(u);
      p = {...standAt(seg.pos, seg.rot, seg.walked), tilt: LEAN * k};
      const d = handsDown(seg.pos, seg.rot);
      const fo = [toWorld(seg.pos, seg.rot, HANDS_FOLDED[0]), toWorld(seg.pos, seg.rot, HANDS_FOLDED[1])];
      p.hands = [0, 1].map((i) => [lerp(d[i][0], fo[i][0], k), lerp(d[i][1], fo[i][1], k), lerp(d[i][2], fo[i][2], k)] as V3) as [V3, V3];
      break;
    }
    case 'sitDown':
    case 'standUp': {
      const k = seg.k === 'sitDown' ? e3(u) : 1 - e3(u);
      p = sitPose(g, seg.stand, seg.rot, k, base);
      break;
    }
  }
  // the phone and glances (only on their feet or sitting, not with the plug in hand)
  const holding = p.plug !== null || (p.hands !== null && ['reach', 'lift', 'insert', 'release'].includes(seg.k));
  let phoneAt: number | null = null;
  let scroll = true;
  for (const k of [...tl.keys].sort((a, b) => a.at - b.at)) {
    if (k.at > t) break;
    if (k.do === 'phone') {
      phoneAt = k.at;
      scroll = k.scroll ?? true;
    }
    if (k.do === 'pocket') phoneAt = null;
  }
  // a beat that needs the hands puts the phone away for good (until the next `phone`)
  if (phoneAt !== null) {
    const busy = tl.segs.some((s) => s.t0 >= phoneAt! && s.t0 <= t && ['reach', 'enter', 'exit'].includes(s.k));
    if (busy) phoneAt = null;
  }
  if (!p.inCar && !holding && phoneAt !== null) {
    p.phone = clamp01((t - phoneAt) / 0.3);
    p.scroll = scroll;
    p.phoneAt = phoneAt;
    // the phone's grips replace the hands (sitting keeps them on the phone too)
    if (p.phone > 0) p.hands = null;
  }
  const targetOf = (to: 'car' | 'cabinet' | 'port' | 'clock' | V3): V3 =>
    Array.isArray(to)
      ? to
      : to === 'car'
        ? [0, 1.1, 0.4]
        : to === 'cabinet'
          ? [g.holster[0], g.holster[1] + 0.4, g.holster[2]]
          : to === 'port'
            ? (g.portNose ?? g.holster)
            : g.clock;
  p.glances = tl.keys
    .filter((k): k is Extract<DriverKey, {do: 'glance'}> => k.do === 'glance')
    .map((k) => ({at: k.at, target: targetOf(k.to), hold: k.hold ?? 1}));
  // a weight shift: the hips sway once to the side and back
  for (const k of tl.keys) {
    if (k.do !== 'shift' || p.inCar || p.stance !== 'stand') continue;
    const v = (t - k.at) / 1.0;
    if (v <= 0 || v >= 1) continue;
    const s = Math.sin(Math.PI * v) * 0.06;
    const c = Math.cos(p.rot);
    p.pos = [p.pos[0] + s * c, p.pos[1], p.pos[2] - s * Math.sin(p.rot)];
  }
  return p;
};

/** Sitting down on the curb, k 0 (standing, seated-mode lifted to standing height) → 1 (on the curb). */
const sitPose = (g: DriverGeo, stand: P2, rot: number, k: number, base: DriverPose): DriverPose => {
  const f = fwdOf(rot);
  const back = SIT_BACK;
  const ox = stand[0] - f[0] * back * k;
  const oz = stand[1] - f[1] * back * k;
  const oy = lerp(LIFT, g.curb.top - 0.52, k);
  // the feet stay where they stood: local z grows as the hips go back, local y as they go down
  const ay = 0.1 - oy;
  const az = back * k;
  const knees: [V3, V3] = HANDS_KNEES.map((h) => {
    const c = Math.cos(rot);
    const s = Math.sin(rot);
    const down = HANDS_DOWN[h[0] < 0 ? 0 : 1];
    const v: V3 = [lerp(down[0], h[0], k), lerp(down[1] - LIFT, h[1], k), lerp(down[2], h[2], k)];
    return [ox + v[0] * c + v[2] * s, oy + v[1], oz - v[0] * s + v[2] * c] as V3;
  }) as [V3, V3];
  return {...base, pos: [ox, oy, oz], rot, stance: 'sit', ankles: [ay, az], hands: knees};
};

/**
 * The quick driver for a cycling car (`ChargeVisit.driver: 'auto'`): out and plug in by `plug`, unplug at
 * `unplug`, back in before `out`, the whole thing sped up to fit (a fast-forward driver).
 */
export const autoDriver = (g: DriverGeo, v: {stop: number; plug: number; unplug: number; out: number}, look: 'a' | 'b'): ChargeDriver => {
  const walk = (a: P2, b: P2) => pathLen(routeAround(a, b, g.avoid)) / WALK + 0.35;
  const port = g.port ?? g.cabinet;
  const nIn = 1.3 + walk(g.door, g.cabinet) + 0.65 + walk(g.cabinet, port) + 0.4;
  const nOut = 0.3 + 0.35 + walk(port, g.cabinet) + 0.7 + walk(g.cabinet, g.door) + 1.3;
  const rate = Math.max(1, nIn / Math.max(0.1, v.plug - v.stop - 0.1), (nOut + 0.3) / Math.max(0.1, v.out - v.unplug - 0.1));
  return {
    keys: [
      {at: v.plug, do: 'plug'},
      {at: v.unplug, do: 'unplug'},
      {at: v.out - 1.3 / rate - 0.05, do: 'enter'},
    ],
    look,
    rate,
  };
};

/** The plug's place at t from a bay's drivers: in someone's hand (its pose), latched, or holstered. */
export const plugPlaceAt = (
  carried: ({nose: V3; dir: V3} | null)[],
  latched: [number, number][],
  t: number,
): {where: 'hand'; nose: V3; dir: V3} | {where: 'port'} | {where: 'holster'} => {
  for (const c of carried) if (c) return {where: 'hand', ...c};
  if (latched.some(([a, b]) => t >= a && t < b)) return {where: 'port'};
  return {where: 'holster'};
};
