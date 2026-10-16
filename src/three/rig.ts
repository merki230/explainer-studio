import {Easing, interpolate, random} from 'remotion';
import * as THREE from 'three';

/*
 * The seated mannequin's skeleton, pose library and idle life (pure maths, no React).
 *
 * The rest pose IS the original seated pose: every joint sits where the old part ended, every
 * rotation is a delta from rest, so a figure at rest renders exactly as before.
 *
 *   pelvis ─┬─ spine ── chest ─┬─ neck ── head
 *           │                  ├─ shoulder L/R ── upper arm ── forearm ── hand
 *           │                  └─ phone (both hands are solved onto it, two-bone IK)
 *           └─ hip L/R ── thigh ── shin ── foot
 *
 * Figure-local space: origin on the floor under the pelvis, facing +z, +x is the figure's left.
 */

export type V3 = [number, number, number];
const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

// ---------------------------------------------------------------- rest skeleton (figure-local)

export const REST = {
  pelvis: V(0, 0.6, -0.1),
  spine: V(0, 0.62, -0.1),
  /** Chest pivot: on the torso line, where the two torso capsules meet. */
  chest: V(0, 0.85, -0.13),
  torsoTop: V(0, 1.08, -0.16),
  neck: V(0, 1.06, -0.12),
  neckTop: V(0, 1.2, -0.07),
  head: V(0, 1.2, -0.08),
  /** Head pitch at rest (looking down at the phone). */
  headPitch: 0.12,
  /** Head sphere centre in the head bone's frame. */
  headCentre: V(0, 0.1, 0.03),
  phone: V(0, 0.9, 0.32),
  phonePitch: -0.9,
  shoulder: (s: number) => V(s * 0.27, 1.04, -0.14),
  elbow: (s: number) => V(s * 0.3, 0.76, 0.06),
  wrist: (s: number) => V(s * 0.09, 0.86, 0.28),
  hand: (s: number) => V(s * 0.08, 0.86, 0.3),
  hip: (s: number) => V(s * 0.12, 0.6, -0.08),
  thighEnd: (s: number) => V(s * 0.13, 0.6, 0.4),
  knee: (s: number) => V(s * 0.13, 0.59, 0.42),
  shinStart: (s: number) => V(s * 0.13, 0.58, 0.44),
  ankle: (s: number) => V(s * 0.13, 0.1, 0.5),
  foot: (s: number) => V(s * 0.13, 0.04, 0.58),
};

/** Where a figure's eyes would be (for aiming the head at a world point). */
const EYE = V(0, 1.3, 0.0);
/** The notional pitch of the gaze at rest (down at the phone), radians, up positive. */
const REST_GAZE_PITCH = -0.5;

/** The phone's rest transform in the chest bone's frame. */
const PHONE_IN_CHEST = REST.phone.clone().sub(REST.chest);

/** Each hand's grip point (the wrist) in the phone's frame, from the rest pose. */
/** Each hand's grip point (the wrist) in the phone's frame, from the rest pose, for a rest pitch. */
const gripCache = new Map<number, [THREE.Vector3, THREE.Vector3]>();
const gripFor = (pitch: number) => {
  let g = gripCache.get(pitch);
  if (!g) {
    g = [-1, 1].map((s) =>
      REST.wrist(s)
        .clone()
        .sub(REST.phone)
        .applyEuler(new THREE.Euler(-pitch, 0, 0)),
    ) as [THREE.Vector3, THREE.Vector3];
    gripCache.set(pitch, g);
  }
  return g;
};

/**
 * Phone pitch at rest for a figure whose screen faces its owner (style guide § 3): tilted back
 * 0.75 rad in the hands, the screen on the phone's back (−z) face, toward the eyes.
 */
export const PHONE_PITCH_TO_FACE = 0.75;

// ---------------------------------------------------------------- poses

export type PoseName = 'idle' | 'scroll' | 'lean-in' | 'lift-phone' | 'look-up' | 'turn-to' | 'glance-down';
export const POSE_NAMES: PoseName[] = ['idle', 'scroll', 'lean-in', 'lift-phone', 'look-up', 'turn-to', 'glance-down'];

/** Every joint as a delta from rest. Angles in radians, Euler [x pitch (forward +), y yaw (to +x), z roll]. */
export type PoseParams = {
  spine: V3;
  chest: V3;
  neck: V3;
  head: V3;
  /** Head offset in the neck's frame (units): a faceless head reads its direction through where it sits. */
  headShift: V3;
  /** Phone offset from its rest place, in the chest's frame. */
  phonePos: V3;
  /** Phone rotation on top of its rest pitch; x > 0 stands it up toward vertical, x < 0 lays it flatter. */
  phoneRot: V3;
  /** Thumb scrolling, 0 (still) to 1 (steady scrolling). */
  scroll: number;
  /** Shoulder shrug (units up). */
  shrug: number;
  /** Gaze: the dot eyes move up the face (radians on the head sphere; > 0 up, < 0 down). */
  eyesUp: number;
};

const Z: V3 = [0, 0, 0];
const base = (p: Partial<PoseParams>): PoseParams => ({
  spine: Z,
  chest: Z,
  neck: Z,
  head: Z,
  headShift: Z,
  phonePos: Z,
  phoneRot: Z,
  scroll: 0.35,
  shrug: 0,
  eyesUp: 0,
  ...p,
});

const FIXED: Record<Exclude<PoseName, 'look-up' | 'turn-to'>, PoseParams> = {
  // The original seated pose, scrolling now and then.
  idle: base({}),
  // Engaged: phone a little higher and more upright, head down on it, thumb going.
  scroll: base({phonePos: [0, 0.03, 0.02], phoneRot: [0.1, 0, 0], head: [0.06, 0, 0], scroll: 1}),
  // Into the phone: the whole back curls forward, head closer to the screen.
  'lean-in': base({
    spine: [0.13, 0, 0],
    chest: [0.09, 0, 0],
    neck: [0.06, 0, 0],
    head: [0.1, 0, 0],
    phonePos: [0, 0.03, 0.02],
    phoneRot: [0.1, 0, 0],
    scroll: 1,
  }),
  // Phone up toward the face and stood up to it (it lit up: look at it); the figure sits up to look.
  'lift-phone': base({
    spine: [-0.05, 0, 0],
    chest: [-0.06, 0, 0],
    neck: [0.02, 0, 0],
    head: [0.1, 0, 0],
    phonePos: [0, 0.2, 0.05],
    phoneRot: [0.35, 0, 0],
    scroll: 0.15,
    shrug: 0.01,
  }),
  // A look down from whatever came before (e.g. back to the phone after a look up).
  'glance-down': base({neck: [0.05, 0, 0], head: [0.2, 0, 0], scroll: 0.1}),
};

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));

/** How a turn's yaw is shared down the body: fractions of the yaw for spine, chest, neck, head. */
type YawShare = {spine: number; chest: number; neck: number; head: number};
/** Look-up's share (the original): the chest turns more than the spine. */
const SHARE_LOOK: YawShare = {spine: 0.2, chest: 0.32, neck: 0.22, head: 0.4};
/**
 * Turn-to's share: the turn led by the spine. The torso is one part on the spine, the shoulders,
 * arms and YOU's hood ride on the chest: a chest twist off the spine pinched the torso into a bump
 * at the shoulder.
 */
const SHARE_TURN: YawShare = {spine: 0.3, chest: 0.15, neck: 0.22, head: 0.45};

/**
 * Aim the head (and some of the chest) at a point in figure-local space.
 * Faceless heads read their direction through the neck, the shoulders and a tilt, so the
 * turn is spread down the spine and the head tilts toward what it looks at. Looking up, the
 * figure sits back a little, the neck and head tip back (chin up) and the eyes rise.
 */
const aimAt = (
  target: THREE.Vector3,
  body: number,
  /** Share of the turn toward the target (1: all of it). Less turn reads more as "up" from a 3/4 view. */
  turn = 1,
  /** Extra lift on the look up (1: as computed). */
  lift = 1,
  share: YawShare = SHARE_LOOK,
): Pick<PoseParams, 'spine' | 'chest' | 'neck' | 'head' | 'headShift' | 'eyesUp'> => {
  const d = target.clone().sub(EYE);
  const yaw = clamp(Math.atan2(d.x, d.z), -1.45, 1.45) * turn;
  const pitch = Math.atan2(d.y, Math.hypot(d.x, d.z));
  const up = clamp((pitch - REST_GAZE_PITCH) * lift, -0.4, 1.3);
  // the part of the lift above level (from the rest gaze down at the phone, ≈ 0.5 of `up` is level)
  const above = Math.max(0, up - 0.5);
  const side = clamp(yaw / 1.2, -1, 1);
  return {
    spine: [0.08 * up - 0.06 * above, clamp(share.spine * yaw * body, -0.3, 0.3), -0.07 * side * body],
    chest: [-0.02 * up - 0.03 * above, clamp(share.chest * yaw * body, -0.42, 0.42), -0.04 * side * body],
    // chin up: above level, the neck tips back too and the head goes further back
    neck: [0.04 * up - 0.1 * above, clamp(share.neck * yaw, -0.3, 0.3), -0.05 * side],
    head: [-0.6 * up - 0.12 * above, clamp(share.head * yaw, -0.6, 0.6), -0.26 * side],
    // the head rises and comes forward off the torso as the chin lifts, and shifts toward a side target
    headShift: [0.03 * side, 0.035 * up + 0.015 * above, 0.05 * up - 0.02 * above],
    // the eyes rise toward what is above
    eyesUp: 0.2 * Math.min(1, above / 0.6),
  };
};

/** Turn-to's share of the full turn toward the other person: ≈ 35° of head yaw in all (≈ 0.6 rad). */
const TURN_TO = 0.37;

/**
 * A pose's joint values. `target` (figure-local) is where `look-up` and `turn-to` aim;
 * without one, `look-up` looks up and ahead and `turn-to` turns to the figure's left (+x).
 */
export const poseParams = (pose: PoseName, target?: THREE.Vector3): PoseParams => {
  if (pose === 'look-up') {
    // A target behind and above (the router on the wall) would turn the head away from a front 3/4
    // camera and read as "to the side": turn a third of the way, lift more, so it reads as "up there".
    const aim = aimAt(target ?? V(0, 2.6, 1.2), 0.5, 0.35, 1.25);
    return base({...aim, phonePos: [0, -0.07, -0.02], phoneRot: [-0.3, 0, 0], scroll: 0});
  }
  if (pose === 'turn-to') {
    // ≈ 35° (owner review): at ≈ 90° both faces showed one eye on the silhouette edge. The phone
    // stays up in the hands (lowered to the lap, the near arm hung straight as a stub).
    // lift 1.3: the gaze comes up level with the other's face (at 1 it stayed on the phone)
    const aim = aimAt(target ?? V(1.2, 1.3, 0), 1, TURN_TO, 1.3, SHARE_TURN);
    return base({...aim, phonePos: [0, -0.01, 0.01], phoneRot: [-0.08, 0, 0], scroll: 0});
  }
  return FIXED[pose] ?? FIXED.idle;
};

const lerpN = (a: number, b: number, w: number) => a + (b - a) * w;
const lerp3 = (a: V3, b: V3, w: number): V3 => [lerpN(a[0], b[0], w), lerpN(a[1], b[1], w), lerpN(a[2], b[2], w)];
export const lerpPose = (a: PoseParams, b: PoseParams, w: number): PoseParams => ({
  spine: lerp3(a.spine, b.spine, w),
  chest: lerp3(a.chest, b.chest, w),
  neck: lerp3(a.neck, b.neck, w),
  head: lerp3(a.head, b.head, w),
  headShift: lerp3(a.headShift, b.headShift, w),
  phonePos: lerp3(a.phonePos, b.phonePos, w),
  phoneRot: lerp3(a.phoneRot, b.phoneRot, w),
  scroll: lerpN(a.scroll, b.scroll, w),
  shrug: lerpN(a.shrug, b.shrug, w),
  eyesUp: lerpN(a.eyesUp, b.eyesUp, w),
});

/** A cue-driven change of pose for one figure. Times are seconds into the scene. */
export type Gesture = {
  pose: PoseName;
  /** Seconds into the scene when the blend into the pose starts (negative: already in it). */
  at: number;
  /** World point to look at (`look-up`, `turn-to`). */
  target?: V3;
  /** Seconds to hold before blending back to what came before. Omit to hold until the next gesture. */
  hold?: number;
  /** Seconds the blend takes, in and out (default 0.6; keep it 0.4–0.8). */
  blend?: number;
};

export const DEFAULT_BLEND = 0.6;

const seg = (x: number, a: number, b: number) =>
  interpolate(x, [a, b], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

/**
 * The pose at time `t` (seconds into the scene): idle, then each gesture in time order blended over
 * what came before it (cubic in-out), and blended back out after its `hold`.
 * `toLocal` maps a world target into figure-local space.
 */
export const poseAt = (t: number, gestures: Gesture[], toLocal: (p: V3) => THREE.Vector3): PoseParams => {
  let p = FIXED.idle;
  const sorted = [...gestures].sort((a, b) => a.at - b.at);
  for (const g of sorted) {
    const b = g.blend ?? DEFAULT_BLEND;
    let w = seg(t, g.at, g.at + b);
    if (g.hold !== undefined) w *= 1 - seg(t, g.at + b + g.hold, g.at + 2 * b + g.hold);
    if (w <= 0) continue;
    p = lerpPose(p, poseParams(g.pose, g.target ? toLocal(g.target) : undefined), w);
  }
  return p;
};

// ---------------------------------------------------------------- idle life

/** Per-figure constants for the idle life, from a seed (two figures never move in sync). */
export const lifeSeed = (seed: string) => {
  const r = (k: string) => random(`${seed}-${k}`);
  return {
    breathPeriod: 3.7 + 0.6 * r('bp'), // ≈ 4 s
    breathPhase: r('bph') * Math.PI * 2,
    shift: [0, 1, 2].map((i) => ({period: 9 + 7 * r(`sp${i}`), phase: r(`sph${i}`) * Math.PI * 2})),
    drift: [0, 1, 2, 3].map((i) => ({period: 5.5 + 5 * r(`dp${i}`), phase: r(`dph${i}`) * Math.PI * 2})),
    scrollPeriod: 1.7 + 1.1 * r('scp'),
    scrollPhase: r('scph'),
  };
};
export type Life = ReturnType<typeof lifeSeed>;

const wave = (t: number, w: {period: number; phase: number}) => Math.sin((t / w.period) * Math.PI * 2 + w.phase);

/** Breathing, −1 (out) to 1 (in), ≈ 4 s period. */
export const breath = (t: number, life: Life) => Math.sin((t / life.breathPeriod) * Math.PI * 2 + life.breathPhase);

/** Idle offsets added on top of the pose: slow weight shifts and head drift (radians). */
export const idleOffsets = (t: number, life: Life) => {
  const [s0, s1, s2] = life.shift;
  const [d0, d1, d2, d3] = life.drift;
  return {
    spine: [0.012 * wave(t, s2), 0.025 * wave(t, s0), 0.02 * wave(t, s1)] as V3,
    hipYaw: 0.035 * wave(t, s0),
    head: [
      0.03 * wave(t, d0) + 0.012 * wave(t, d3),
      0.06 * wave(t, d1) + 0.02 * wave(t, d3),
      0.025 * wave(t, d2),
    ] as V3,
  };
};

/**
 * Thumb swipe, 0 (resting) to 1 (top of the flick): a quick flick up and a slower return, every
 * ≈ 2 s at full scroll (less often when idle), with seeded irregular gaps.
 */
export const thumbSwipe = (t: number, life: Life, scroll: number) => {
  if (scroll <= 0.001) return 0;
  const period = life.scrollPeriod / (0.45 + 0.55 * scroll);
  const x = t / period + life.scrollPhase;
  const n = Math.floor(x);
  const u = x - n;
  // skip some flicks (seeded per flick) so it never ticks like a metronome
  if (random(`swipe-${n}-${life.scrollPhase.toFixed(4)}`) > 0.35 + 0.6 * scroll) return 0;
  const up = seg(u, 0.0, 0.12);
  const down = seg(u, 0.12, 0.4);
  return (up - down) * Math.min(1, 0.4 + scroll);
};

// ---------------------------------------------------------------- arms (two-bone IK)

/**
 * Solve one arm in the chest's frame: shoulder → elbow → wrist reaching `target`, the elbow
 * bending toward its rest side. Returns the upper arm's rotation (chest frame) and the forearm's
 * rotation relative to the upper arm, both deltas from rest.
 */
export const solveArm = (s: number, shoulder: THREE.Vector3, target: THREE.Vector3) => {
  const S0 = REST.shoulder(s).sub(REST.chest);
  const E0 = REST.elbow(s).sub(REST.chest);
  const W0 = REST.wrist(s).sub(REST.chest);
  const l1 = E0.distanceTo(S0);
  const l2 = W0.distanceTo(E0);
  const toT = target.clone().sub(shoulder);
  const d = clamp(toT.length(), Math.abs(l1 - l2) + 1e-3, l1 + l2 - 1e-3);
  const u = toT.normalize();
  const pole = E0.clone().sub(S0);
  const v = pole.sub(u.clone().multiplyScalar(pole.dot(u)));
  if (v.lengthSq() < 1e-8) v.set(s, -1, 0);
  v.normalize();
  const a = (l1 * l1 - l2 * l2 + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(0, l1 * l1 - a * a));
  const E = shoulder.clone().addScaledVector(u, a).addScaledVector(v, h);
  const W = shoulder.clone().addScaledVector(u, d);
  const q1 = new THREE.Quaternion().setFromUnitVectors(
    E0.clone().sub(S0).normalize(),
    E.clone().sub(shoulder).normalize(),
  );
  const q2w = new THREE.Quaternion().setFromUnitVectors(W0.clone().sub(E0).normalize(), W.clone().sub(E).normalize());
  const q2 = q1.clone().invert().multiply(q2w);
  return {upper: q1, fore: q2};
};

/** The phone's transform in the chest's frame for a pose, and both wrist targets on it. */
export const phoneInChest = (p: PoseParams, swipe: number, restPitch = REST.phonePitch) => {
  const pos = PHONE_IN_CHEST.clone().add(V(...p.phonePos));
  // phoneRot[0] > 0 stands the phone up (toward vertical), < 0 lays it flatter, whichever way it faces
  const pitch = restPitch - Math.sign(restPitch) * p.phoneRot[0];
  const euler = new THREE.Euler(pitch, p.phoneRot[1], p.phoneRot[2]);
  const q = new THREE.Quaternion().setFromEuler(euler);
  const grips = gripFor(restPitch).map((g, i) => {
    // the scrolling hand (+x) follows its thumb a little
    const extra = i === 1 ? V(0, 0.006 * swipe, 0) : V(0, 0, 0);
    return g.clone().add(extra).applyQuaternion(q).add(pos);
  }) as [THREE.Vector3, THREE.Vector3];
  return {pos, euler, grips};
};

/**
 * The phone's position in figure-local space for a pose (spine and chest rotations applied; idle
 * life ignored, it moves the phone by millimetres). For things that start or end at the phone:
 * the route's node dot, the detail box's leader.
 */
export const phoneLocalAt = (p: PoseParams, restPitch = REST.phonePitch): THREE.Vector3 => {
  const e = (v: V3) => new THREE.Euler(v[0], v[1], v[2], 'YXZ');
  const inChest = phoneInChest(p, 0, restPitch).pos;
  const inSpine = REST.chest
    .clone()
    .sub(REST.spine)
    .add(inChest.applyEuler(e(p.chest)));
  return REST.spine.clone().add(inSpine.applyEuler(e(p.spine)));
};
