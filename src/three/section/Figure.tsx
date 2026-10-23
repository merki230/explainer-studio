import React, {useMemo} from 'react';
import {random, useCurrentFrame, useVideoConfig} from 'remotion';
import * as THREE from 'three';
import {drawScreen, drawScreenFit, SCREEN_H, SCREEN_W, screenKey, type ScreenState} from '../../components/screenKit';
import {CAST, MOODS, section, type CastLook, type CastName, type Mood} from '../../theme';
import {limb, plaster as matte, raw, roundedBox} from '../plaster';
import {REAL_DISPLAY, REAL_PHONE, RealPhone} from '../real/RealPhone';
import {
  breath,
  idleOffsets,
  lifeSeed,
  PHONE_PITCH_TO_FACE,
  phoneInChest,
  poseAt,
  REST,
  solveArm,
  thumbSwipe,
  type Gesture,
} from '../rig';

type V3 = [number, number, number];
const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
type Part = {geometry: THREE.BufferGeometry; position: THREE.Vector3; quaternion?: THREE.Quaternion};

const HEAD_R = 0.165;
const HEAD = new THREE.SphereGeometry(HEAD_R, 28, 20);
const HAND = new THREE.SphereGeometry(0.045, 16, 12);
const EYE = new THREE.SphereGeometry(0.018, 10, 8);
/** Hair cap (r 0.172, the top 55% of a sphere), tipped back so the brow line sits high. */
const CAP = new THREE.SphereGeometry(0.172, 28, 18, 0, Math.PI * 2, 0, Math.PI * 0.55);
/** MOM's bob: a deeper cap, tipped further back, so it reaches the jaw at the sides and back. */
const BOB = new THREE.SphereGeometry(0.18, 28, 18, 0, Math.PI * 2, 0, Math.PI * 0.7);
const BUN = new THREE.SphereGeometry(0.075, 16, 12);
/** YOU's hood: half a torus lying behind the neck. */
const HOOD = new THREE.TorusGeometry(0.135, 0.055, 12, 24, Math.PI);
const LENS = new THREE.TorusGeometry(0.034, 0.0055, 8, 24);
const PHONE = {w: 0.12, h: 0.22, d: 0.02};
const PHONE_BODY = roundedBox(PHONE.w, PHONE.h, PHONE.d, 0.008);
const THUMB_R = 0.013;
const THUMB_L = 0.03;
const THUMB = new THREE.CapsuleGeometry(THUMB_R, THUMB_L, 4, 10);
/** Thumb root on the +x hand, on the screen side (−z) of the phone. */
const THUMB_BASE = V(0.062, -0.05, -0.014);
/**
 * The pointing index finger (stylized, skin): a capsule out of the small hand along the forearm, for
 * pressing buttons and typing. `from` is where it leaves the hand's centre; the tip is `TIP` from the
 * wrist target, so a hand target given as a fingertip can be solved (see `point`).
 */
const FINGER = {r: 0.0115, len: 0.048, from: 0.024, out: 0.035};
const FINGER_GEO = new THREE.CapsuleGeometry(FINGER.r, FINGER.len, 4, 12);
const FINGER_TIP = FINGER.from + FINGER.len + 2 * FINGER.r;
/** At rest the face looks down a little more than the head bone (the mock-up's 0.32 total). */
const FACE_PITCH = 0.2;
/** Eyes: ±0.055 across, slightly below the centre, on the sphere's front (§ 8). */
const EYE_AT = (s: number): V3 => [s * 0.055, -0.01, 0.152];
/** An eye moved up the sphere by `up` radians (the gaze; the pose's `eyesUp`). */
const eyeAt = (s: number, up: number): V3 => {
  const [x, y, z] = EYE_AT(s);
  if (Math.abs(up) < 1e-4) return [x, y, z];
  const c = Math.cos(up);
  const n = Math.sin(up);
  return [x, y * c + z * n, z * c - y * n];
};

const seg = (a: THREE.Vector3, b: THREE.Vector3, pivot: THREE.Vector3, r: number): Part =>
  limb(a.clone().sub(pivot), b.clone().sub(pivot), r);
const rel = (p: THREE.Vector3, pivot: THREE.Vector3): V3 => [p.x - pivot.x, p.y - pivot.y, p.z - pivot.z];

const R = REST;
const PARTS = {
  torso: seg(R.spine, R.torsoTop, R.spine, 0.2),
  neck: seg(R.neck, R.neckTop, R.neck, 0.07),
  side: [-1, 1].map((s) => ({
    s,
    thigh: seg(R.hip(s), R.thighEnd(s), R.hip(s), 0.1),
    shin: seg(R.shinStart(s), R.ankle(s), R.knee(s), 0.085),
    foot: {geometry: roundedBox(0.13, 0.08, 0.26, 0.03), position: R.foot(s).sub(R.ankle(s))} as Part,
    upper: seg(R.shoulder(s), R.elbow(s), R.shoulder(s), 0.07),
    // sleeve to the wrist (shirt colour), then a small hand
    fore: seg(R.elbow(s), R.wrist(s), R.elbow(s), 0.058),
    hand: {geometry: HAND, position: R.hand(s).sub(R.elbow(s))} as Part,
  })),
};

const PartMesh: React.FC<{part: Part; material: THREE.Material; scale?: V3}> = ({part, material, scale}) => (
  <mesh
    geometry={part.geometry}
    material={material}
    position={part.position}
    quaternion={part.quaternion}
    scale={scale}
    castShadow
    receiveShadow
  />
);

const euler = (base: V3, ...adds: V3[]) => {
  const e: V3 = [...base];
  for (const a of adds) for (let i = 0; i < 3; i++) e[i] += a[i];
  return new THREE.Euler(e[0], e[1], e[2], 'YXZ');
};

/**
 * Eyelid closure 0 (open) → 1 (shut): a blink every 3–5 s (seeded per character), each closing
 * and opening over 4 frames (style guide § 8 motion principles).
 */
export const blinkAt = (clock: number, seed: string, fps: number) => {
  const dur = 4 / fps;
  let t = random(`${seed}-blink-0`) * 3;
  for (let k = 1; t <= clock && k < 10000; k++) {
    if (clock < t + dur) return 1 - Math.abs((clock - t) / dur - 0.5) * 2;
    t += 3 + 2 * random(`${seed}-blink-${k}`);
  }
  return 0;
};

/** The index finger in the forearm's frame (rest pose), out of the hand along the forearm, scaled by `k`. */
const Finger: React.FC<{s: number; k: number; material: THREE.Material}> = ({s, k, material}) => {
  const dir = REST.wrist(s).sub(REST.elbow(s)).normalize();
  const hand = REST.hand(s).sub(REST.elbow(s));
  const len = FINGER.from + (FINGER.len / 2 + FINGER.r) * k;
  const q = new THREE.Quaternion().setFromUnitVectors(V(0, 1, 0), dir);
  return (
    <mesh
      geometry={FINGER_GEO}
      material={material}
      position={hand.clone().addScaledVector(dir, len)}
      quaternion={q}
      scale={[1, Math.max(0.05, k), 1]}
      castShadow
      receiveShadow
    />
  );
};

export type FigureProps = {
  /** Who this is: the cast's colours, hair and detail (theme `CAST`). */
  who: CastName;
  mood: Mood;
  position?: V3;
  rotationY?: number;
  /** Seeds breathing, weight shifts, head drift, thumb and blinks. Default: `who`. */
  seed?: string;
  /** Cue-driven poses (rig.ts `Gesture`), blended in time order. Seconds into the scene. */
  gestures?: Gesture[];
  /** Holds a phone (screen toward the face). */
  phone?: boolean;
  /** Screen on, 0 (locked: dark, a faint light) to 1 (on: lit UI, its light on the face). */
  screenOn?: number;
  /** The system's orange on the screen's light (the bleed on the face), 0–1. */
  system?: number;
  /**
   * What the screen shows (phone-screen kit). Drawn into the phone's screen texture with the same
   * function as the detail box, so they match. Omit for a plain lit screen.
   */
  screen?: ScreenState;
  /**
   * Which phone: 'simple' (default, the stylized slab) or 'real' (the realistic phone of the realism
   * test: aluminium frame, glass, camera bump, studio reflections), at the same height (0.22).
   */
  phoneModel?: 'simple' | 'real';
  /** Breathing, weight shifts, head drift, thumb and blinks (default on). */
  life?: boolean;
  /** Seconds added to the scene time for the idle life (the scene's start in the video). */
  clockOffset?: number;
  /**
   * Where the hands go instead of the phone (figure-local points: origin on the floor under the
   * pelvis, facing +z, +x the figure's left): [right hand, left hand]. Use with `phone: false`: on a
   * steering wheel, a gauge. The arms solve to them (two-bone IK).
   */
  hands?: [V3, V3];
  /**
   * 'sit' (default: the rest pose, seat height ≈ 0.57) or 'stand': the legs straighten under the
   * hips (a slight knee bend), the body rises by the thigh's length, the feet flat on the ground.
   * `hands` stay figure-local (origin on the ground), so they follow.
   */
  stance?: 'sit' | 'stand';
  /**
   * Walking (standing only): the step cycle's phase (cycles; drive it from the distance walked) and
   * how much of a stride to show, 0 (standing still) to 1. The legs swing opposite, the body bobs.
   */
  walk?: {phase: number; amount: number};
  /**
   * The index finger out, per hand [right, left], 0 (curled: just the round hand) to 1 (pointing).
   * While pointing, that hand's `hands` target is where the **fingertip** goes (the arm solves so
   * the tip lands on it), so a button target can be given as the button itself.
   */
  point?: [number, number];
  /** Colour overrides on top of the cast's look (e.g. `CAST_NEUTRAL` for an extra behind tinted glass). */
  look?: Partial<CastLook>;
  /**
   * Seated only: where each foot goes instead of its rest place, [right, left] like `hands` (null: rest).
   * `ankle` is a figure-local point (origin on the floor under the pelvis, facing +z); the leg solves
   * to it in its own plane (hip, knee up, ankle; two-bone IK). `pitch` tips the foot, toes up (radians,
   * default 0: flat). For a foot on a pedal (No. 006). Default none.
   */
  legs?: [LegTarget | null, LegTarget | null];
  /** 🎭 Each foot's size, [right, left], scaled about the ankle (default 1: as the rig). For a foot the shot is about. */
  footScale?: [number, number];
  /** The shoes' colour (a theme neutral; default `section.shoe`, dark). */
  shoe?: string;
};

/**
 * A seated foot's target (see `FigureProps.legs`). `side` (m, figure-local x, + toward the figure's left)
 * swings the whole leg about the hip's vertical axis so the foot lands that far across, toes turned
 * with it (a heel pivot from pedal to pedal, No. 008). Default 0: the leg's own plane.
 */
export type LegTarget = {ankle: V3; pitch?: number; side?: number};

/** The leg's rest angles in its (y up, z forward) plane, as atan2(z, y), and its two lengths. */
const LEG = (() => {
  const th = REST.knee(1).sub(REST.hip(1));
  const sh = REST.ankle(1).sub(REST.knee(1));
  return {
    l1: Math.hypot(th.y, th.z),
    l2: Math.hypot(sh.y, sh.z),
    thigh: Math.atan2(th.z, th.y),
    shin: Math.atan2(sh.z, sh.y),
  };
})();

/** Two-bone IK in the leg's plane: rotations (about x) of the hip, the knee and the ankle for a foot target. */
const legIK = (leg: LegTarget, side: number) => {
  const hip = REST.hip(side);
  const dy = leg.ankle[1] - hip.y;
  const lat = leg.side ?? 0;
  const dz0 = leg.ankle[2] - hip.z;
  // with a side offset the leg swings about the hip's vertical axis: solve in the swung plane
  const dz = lat ? Math.hypot(dz0, lat) : dz0;
  const dist = Math.max(Math.abs(LEG.l1 - LEG.l2) + 1e-3, Math.min(LEG.l1 + LEG.l2 - 1e-3, Math.hypot(dy, dz)));
  const a = Math.acos(Math.max(-1, Math.min(1, (LEG.l1 ** 2 + dist ** 2 - LEG.l2 ** 2) / (2 * LEG.l1 * dist))));
  // the knee on the upper side of the hip–ankle line (as at rest)
  const thigh = Math.atan2(dz, dy) - a;
  const ky = hip.y + LEG.l1 * Math.cos(thigh);
  const kz = hip.z + LEG.l1 * Math.sin(thigh);
  const shin = Math.atan2(leg.ankle[2] - kz, leg.ankle[1] - ky);
  const h = thigh - LEG.thigh;
  const k = shin - LEG.shin - h;
  return {hip: h, knee: k, ankle: -(leg.pitch ?? 0) - h - k, yaw: lat ? Math.atan2(lat, dz0) : 0};
};

/** How far the body rises standing up (the thigh's length): the seated hip at 0.6 → 1.07. */
export const STAND_LIFT = 0.47;

/**
 * A member of the cast, seated (style guide v0.8 § 8): the Mannequin rig (rig.ts) in everyday
 * colours, adult proportions, two dot eyes that blink, hair cap plus one detail (YOU's hood,
 * FRIEND's bun, MOM's bob and glasses). Holds a phone with its screen toward the eyes, never the
 * camera; a lit screen lights the face. Origin on the ground under the pelvis; seat height ≈ 0.57.
 */
export const Figure: React.FC<FigureProps> = ({
  who,
  mood,
  position = [0, 0, 0],
  rotationY = 0,
  seed,
  gestures = [],
  phone: holdsPhone = true,
  screenOn = 1,
  system = 0,
  screen,
  phoneModel = 'simple',
  life = true,
  clockOffset = 0,
  hands,
  stance = 'sit',
  walk,
  point = [0, 0],
  look: lookOverride,
  legs,
  footScale,
  shoe: shoeColor,
}) => {
  const frame = useCurrentFrame();
  const stand = stance === 'stand';
  const wa = stand && walk ? Math.max(0, Math.min(1, walk.amount)) : 0;
  const wp = walk ? walk.phase * Math.PI * 2 : 0;
  // the body dips a little at each passing step (twice a cycle)
  const lift = stand ? STAND_LIFT - 0.015 * wa * (1 - Math.cos(2 * wp)) * 0.5 : 0;
  /** A leg's swing (radians, forward +) and knee bend for the step cycle. */
  const swing = (s: number) => 0.32 * wa * Math.sin(wp + (s > 0 ? Math.PI : 0));
  const kneeBend = (s: number) => 0.45 * wa * Math.max(0, Math.sin(wp + (s > 0 ? Math.PI : 0) + Math.PI / 2));
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const clock = t + clockOffset;
  // keyed on the override's values, so a fresh object each render doesn't rebuild the materials
  const lookKey = JSON.stringify(lookOverride ?? {});
  const look = useMemo(() => ({...CAST[who], ...(JSON.parse(lookKey) as Partial<CastLook>)}), [who, lookKey]);
  const key = seed ?? who;
  const mats = useMemo(
    () => ({
      top: matte(look.top, 0.9),
      bottom: matte(look.bottom, 0.9),
      skin: matte(look.skin, 0.75),
      hair: matte(look.hair, 0.9),
      shoe: matte(shoeColor ?? section.shoe, 0.8),
      eye: matte(section.eye, 0.4),
      glasses: matte(section.glasses, 0.5),
      device: matte(MOODS[mood].device, 0.4),
    }),
    [look, mood, shoeColor],
  );
  const screenMat = useMemo(() => new THREE.MeshBasicMaterial({color: raw(MOODS[mood].ui)}), [mood]);
  // the screen texture: a small canvas, redrawn only when what it shows changes
  const real = phoneModel === 'real';
  const tex = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = SCREEN_W / 2;
    // the realistic phone's display is taller (1 : 2.13): the kit is fitted to it, not squashed
    c.height = Math.round(real ? (c.width * REAL_DISPLAY.h) / REAL_DISPLAY.w : SCREEN_H / 2);
    const t = new THREE.CanvasTexture(c);
    return {c, t, key: ''};
  }, [real]);
  const on = Math.max(0, Math.min(1, screenOn));
  const sys = Math.max(0, Math.min(1, system));
  const dark = raw('#0f1116');
  if (screen) {
    const k = screenKey(screen);
    if (k !== tex.key) {
      const cx = tex.c.getContext('2d');
      if (cx && real) {
        drawScreenFit(cx, screen, tex.c.width, tex.c.height);
        tex.t.needsUpdate = true;
        tex.key = k;
      } else if (cx) {
        cx.setTransform(0.5, 0, 0, 0.5, 0, 0);
        drawScreen(cx, screen);
        tex.t.needsUpdate = true;
        tex.key = k;
      }
    }
    if (screenMat.map !== tex.t) {
      screenMat.map = tex.t;
      screenMat.needsUpdate = true;
    }
    screenMat.color.copy(dark).lerp(new THREE.Color(1, 1, 1), on);
  } else {
    screenMat.color.copy(dark).lerp(raw(MOODS[mood].ui), on);
  }
  const lifeK = useMemo(() => lifeSeed(key), [key]);

  const toLocal = (p: V3) =>
    V(p[0] - position[0], p[1] - position[1], p[2] - position[2]).applyAxisAngle(V(0, 1, 0), -rotationY);
  const pose = poseAt(t, gestures, toLocal);

  const L = life ? 1 : 0;
  const b = breath(clock, lifeK) * L;
  const idle = idleOffsets(clock, lifeK);
  const k = (v: V3, m = L): V3 => [v[0] * m, v[1] * m, v[2] * m];
  const swipe = life && holdsPhone ? thumbSwipe(clock, lifeK, pose.scroll) : 0;
  const nod = Math.sin(clock * 0.9 + 1 + lifeK.breathPhase) * 0.02 * L;
  const blink = life ? blinkAt(clock, key, fps) : 0;

  const spineE = euler(pose.spine, k(idle.spine));
  const chestE = euler(pose.chest, [-0.014 * b, 0, 0]);
  const neckE = euler(pose.neck);
  const headE = euler([REST.headPitch + nod, 0, 0], pose.head, k(idle.head));
  const shrug = pose.shrug + 0.006 * b;

  const ph = phoneInChest(pose, swipe, PHONE_PITCH_TO_FACE);
  // hand targets in the chest's frame: undo the spine and chest turns
  const spineQ = new THREE.Quaternion().setFromEuler(spineE);
  const chestQ = new THREE.Quaternion().setFromEuler(chestE);
  const toChest = (p: V3) =>
    V(...p)
      .sub(REST.spine)
      .applyQuaternion(spineQ.clone().invert())
      .sub(REST.chest.clone().sub(REST.spine))
      .applyQuaternion(chestQ.clone().invert());
  const grips = hands
    ? [toChest([hands[0][0], hands[0][1] - lift, hands[0][2]]), toChest([hands[1][0], hands[1][1] - lift, hands[1][2]])]
    : ph.grips;
  const arms = [0, 1].map((i) => {
    const s = i === 0 ? -1 : 1;
    const shoulder = REST.shoulder(s)
      .sub(REST.chest)
      .add(V(0, shrug, 0));
    const pk = hands ? Math.max(0, Math.min(1, point[i])) : 0;
    if (pk <= 0) return {s, shoulder, pk, ...solveArm(s, shoulder, grips[i])};
    // the target is the fingertip: solve, then pull the wrist back along the forearm by the finger's
    // reach (twice, so the forearm's direction settles), the finger growing with `point`
    const restFore = REST.wrist(s).sub(REST.elbow(s)).normalize();
    const reach =
      FINGER.from + (FINGER_TIP - FINGER.from + FINGER.out) * pk + REST.hand(s).sub(REST.wrist(s)).dot(restFore);
    let sol = solveArm(s, shoulder, grips[i]);
    for (let it = 0; it < 3; it++) {
      const dir = restFore.clone().applyQuaternion(sol.upper.clone().multiply(sol.fore));
      sol = solveArm(s, shoulder, grips[i].clone().addScaledVector(dir, -reach));
    }
    return {s, shoulder, pk, ...sol};
  });
  const thumbDir = V(-0.6, 0.55 + 0.55 * swipe, -0.12 - 0.25 * swipe).normalize();
  const thumbPos = THUMB_BASE.clone().addScaledVector(thumbDir, THUMB_L / 2 + THUMB_R);
  const thumbQ = new THREE.Quaternion().setFromUnitVectors(V(0, 1, 0), thumbDir);
  // light on the face from the screen (§ 3: 0.6 on, 0.15 locked), × 0.15 for three's inverse-square
  // falloff over the ≈ 0.3 units to the face (the mock-up's legacy light had none)
  // Night: the screen's light flickers a little on the face as what's on it changes (seeded steps)
  const step = Math.floor(clock / 0.32);
  const blend = clock / 0.32 - step;
  const flick =
    mood === 'night' && life
      ? (random(`${key}-flick-${step}`) - 0.5) * (1 - blend) + (random(`${key}-flick-${step + 1}`) - 0.5) * blend
      : 0;
  const faceLight = holdsPhone ? (0.15 + 0.45 * on) * 0.15 * (1 + 0.3 * flick * on) : 0;

  const P = PARTS;
  const c = REST.headCentre;
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <group position={[REST.pelvis.x, REST.pelvis.y + lift, REST.pelvis.z]}>
        {P.side.map((side) => {
          const leg = stand ? null : legs?.[side.s < 0 ? 0 : 1];
          const ik = leg ? legIK(leg, side.s) : null;
          return (
            // a side offset swings the leg about the hip's vertical axis, after its pitch (an outer group)
            <group key={side.s} position={rel(REST.hip(side.s), REST.pelvis)} rotation={[0, ik?.yaw ?? 0, 0]}>
              <group
                rotation={[
                  stand ? Math.PI / 2 - 0.06 - swing(side.s) : (ik?.hip ?? 0),
                  idle.hipYaw * L * (stand ? 0.3 : 1),
                  0,
                ]}
              >
                <PartMesh part={side.thigh} material={mats.bottom} />
                <group
                  position={rel(REST.knee(side.s), REST.hip(side.s))}
                  rotation={[stand ? -Math.PI / 2 + 0.12 + kneeBend(side.s) : (ik?.knee ?? 0), 0, 0]}
                >
                  <PartMesh part={side.shin} material={mats.bottom} />
                  <group
                    position={rel(REST.ankle(side.s), REST.knee(side.s))}
                    rotation={[stand ? -0.06 + swing(side.s) - kneeBend(side.s) : (ik?.ankle ?? 0), 0, 0]}
                  >
                    {footScale ? (
                      <group scale={footScale[side.s < 0 ? 0 : 1]}>
                        <PartMesh part={side.foot} material={mats.shoe} />
                      </group>
                    ) : (
                      <PartMesh part={side.foot} material={mats.shoe} />
                    )}
                  </group>
                </group>
              </group>
            </group>
          );
        })}
        <group position={rel(REST.spine, REST.pelvis)} rotation={spineE}>
          <PartMesh part={P.torso} material={mats.top} scale={[1 + 0.012 * b, 1, 1 + 0.018 * b]} />
          <group position={[0, REST.chest.y - REST.spine.y + 0.008 * b, REST.chest.z - REST.spine.z]} rotation={chestE}>
            {look.detail === 'hood' ? (
              <mesh
                geometry={HOOD}
                material={mats.top}
                position={[0, 0.215, -0.07]}
                rotation={[-Math.PI / 2 + 0.35, 0, 0]}
                scale={[1, 1, 0.8]}
                castShadow
                receiveShadow
              />
            ) : null}
            <group position={rel(REST.neck, REST.chest)} rotation={neckE}>
              <PartMesh part={P.neck} material={mats.skin} />
              <group
                position={[
                  REST.head.x - REST.neck.x + pose.headShift[0],
                  REST.head.y - REST.neck.y + pose.headShift[1],
                  REST.head.z - REST.neck.z + pose.headShift[2],
                ]}
                rotation={headE}
              >
                <group position={[c.x, c.y, c.z]} rotation={[FACE_PITCH, 0, 0]}>
                  <mesh geometry={HEAD} material={mats.skin} castShadow receiveShadow />
                  {[-1, 1].map((s) => (
                    <mesh
                      key={s}
                      geometry={EYE}
                      material={mats.eye}
                      position={eyeAt(s, pose.eyesUp)}
                      scale={[1, 1 - 0.9 * Math.max(blink, pose.lids), 1]}
                    />
                  ))}
                  {look.detail === 'bob-glasses' ? (
                    <>
                      <mesh
                        geometry={BOB}
                        material={mats.hair}
                        position={[0, 0.0, -0.012]}
                        rotation={[-1.0, 0, 0]}
                        castShadow
                        receiveShadow
                      />
                      {[-1, 1].map((s) => (
                        <mesh key={s} geometry={LENS} material={mats.glasses} position={[s * 0.058, -0.008, 0.16]} />
                      ))}
                      <mesh position={[0, -0.002, 0.168]} rotation={[0, 0, Math.PI / 2]} material={mats.glasses}>
                        <cylinderGeometry args={[0.004, 0.004, 0.05, 6]} />
                      </mesh>
                    </>
                  ) : (
                    <mesh
                      geometry={CAP}
                      material={mats.hair}
                      position={[0, 0.01, -0.01]}
                      rotation={[-0.35, 0, 0]}
                      castShadow
                      receiveShadow
                    />
                  )}
                  {look.detail === 'bun' ? (
                    <mesh geometry={BUN} material={mats.hair} position={[0, 0.12, -0.13]} castShadow receiveShadow />
                  ) : null}
                </group>
              </group>
            </group>
            {arms.map((a) => {
              const side = P.side[a.s < 0 ? 0 : 1];
              return (
                <group key={a.s} position={a.shoulder} quaternion={a.upper}>
                  <PartMesh part={side.upper} material={mats.top} />
                  <group position={rel(REST.elbow(a.s), REST.shoulder(a.s))} quaternion={a.fore}>
                    <PartMesh part={side.fore} material={mats.top} />
                    {a.pk > 0 ? (
                      // pointing: the hand comes out of the sleeve a little, the index finger out of it
                      <group
                        position={REST.wrist(a.s)
                          .sub(REST.elbow(a.s))
                          .normalize()
                          .multiplyScalar(FINGER.out * a.pk)}
                      >
                        <PartMesh part={side.hand} material={mats.skin} />
                        <Finger s={a.s} k={a.pk} material={mats.skin} />
                      </group>
                    ) : (
                      <PartMesh part={side.hand} material={mats.skin} />
                    )}
                  </group>
                </group>
              );
            })}
            {holdsPhone ? (
              <group position={ph.pos} rotation={ph.euler}>
                {real ? (
                  // the realistic phone, its screen on the −z face (toward the holder's eyes)
                  <RealPhone
                    rotation={[0, Math.PI, 0]}
                    scale={PHONE.h / REAL_PHONE.h}
                    display={screenMat}
                    section={false}
                  />
                ) : (
                  <>
                    <mesh geometry={PHONE_BODY} material={mats.device} castShadow receiveShadow />
                    {/* the screen is on the back (−z) face: toward the holder's eyes */}
                    <mesh position={[0, 0, -PHONE.d / 2 - 0.0006]} rotation={[0, Math.PI, 0]} material={screenMat}>
                      <planeGeometry args={[PHONE.w - 0.015, PHONE.h - 0.02]} />
                    </mesh>
                  </>
                )}
                <mesh geometry={THUMB} material={mats.skin} position={thumbPos} quaternion={thumbQ} castShadow />
                <pointLight
                  position={[0, 0.04, -0.04]}
                  color={raw(section.screenLight).lerp(raw(section.orange), sys)}
                  intensity={faceLight * (1 + 0.6 * sys)}
                  distance={0.9}
                  decay={2}
                />
              </group>
            ) : null}
          </group>
        </group>
      </group>
    </group>
  );
};
