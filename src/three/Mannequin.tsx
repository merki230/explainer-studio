import React, {useMemo} from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import * as THREE from 'three';
import {theme} from '../theme';
import {OrangeLight} from './OrangePath';
import {limb, plaster, raw, roundedBox, roundedCylinder} from './plaster';
import {breath, idleOffsets, lifeSeed, phoneInChest, poseAt, REST, solveArm, thumbSwipe, type Gesture} from './rig';

type V3 = [number, number, number];
const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

/** Where the phone sits in a Mannequin's local space (before position/rotationY). */
export const PHONE_LOCAL: V3 = [0, 0.9, 0.32];

/** World position of a Mannequin's phone, for paths that start or end there. */
export const phoneWorld = (position: V3 = [0, 0, 0], rotationY = 0): V3 => {
  const p = V(...PHONE_LOCAL).applyAxisAngle(V(0, 1, 0), rotationY);
  return [p.x + position[0], p.y + position[1], p.z + position[2]];
};

type Part = {geometry: THREE.BufferGeometry; position: THREE.Vector3; quaternion?: THREE.Quaternion};

const sphere = (r: number) => new THREE.SphereGeometry(r, 24, 18);
const HEAD = sphere(0.165);
const HAND = sphere(0.07);
const PHONE_BODY = roundedBox(0.11, 0.19, 0.02, 0.008);
/** The scrolling thumb: a short capsule on the +x hand, lying on the screen. */
const THUMB_R = 0.013;
const THUMB_L = 0.03;
const THUMB = new THREE.CapsuleGeometry(THUMB_R, THUMB_L, 4, 10);
const THUMB_BASE = V(0.056, -0.05, 0.014);

/** A capsule between two rest points, placed relative to the bone pivot it hangs from. */
const seg = (a: THREE.Vector3, b: THREE.Vector3, pivot: THREE.Vector3, r: number): Part =>
  limb(a.clone().sub(pivot), b.clone().sub(pivot), r);
const rel = (p: THREE.Vector3, pivot: THREE.Vector3): V3 => [p.x - pivot.x, p.y - pivot.y, p.z - pivot.z];

// The seated pose's parts, each in its bone's frame (see rig.ts for the skeleton).
const R = REST;
const PARTS = {
  // One capsule, as before: two capsules meeting at the chest showed a stepped seam once bent.
  // The chest bone carries the shoulders, neck and arms; the round torso hides its small turns.
  torso: seg(R.spine, R.torsoTop, R.spine, 0.2),
  neck: seg(R.neck, R.neckTop, R.neck, 0.07),
  side: [-1, 1].map((s) => ({
    s,
    thigh: seg(R.hip(s), R.thighEnd(s), R.hip(s), 0.1),
    shin: seg(R.shinStart(s), R.ankle(s), R.knee(s), 0.085),
    foot: {geometry: roundedBox(0.13, 0.08, 0.26, 0.03), position: R.foot(s).sub(R.ankle(s))} as Part,
    upper: seg(R.shoulder(s), R.elbow(s), R.shoulder(s), 0.07),
    fore: seg(R.elbow(s), R.wrist(s), R.elbow(s), 0.062),
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

export type MannequinProps = {
  position?: V3;
  rotationY?: number;
  /** Plaster tint. Keep it plaster: the orange is reserved for the system. */
  color?: string;
  /** Seconds added to the idle clock (kept for old specs; `seed` is the better way to desync figures). */
  phase?: number;
  /** Seeds the idle life (breathing, weight shifts, head drift, thumb), so two figures never move in sync. */
  seed?: string;
  /** Shortcut: tilt the head toward the other person (±0.5 is plenty). Adds to any gesture. */
  look?: number;
  /** Orange glow on the phone screen, 0–1. */
  screen?: number;
  /** Cue-driven poses, blended in order (see rig.ts `Gesture`). Times are seconds into the scene. */
  gestures?: Gesture[];
  /** Breathing, weight shifts, head drift and thumb scrolling (default on). */
  life?: boolean;
  /**
   * Seconds added to the scene time for the idle life only. Pass the scene's start in the video
   * (RoomScene does) so breathing is continuous across cuts and the dissolve shows one figure.
   */
  clockOffset?: number;
};

/**
 * Seated, faceless plaster mannequin holding a phone in both hands, on a joint hierarchy
 * (rig.ts): always breathing a little, with cue-driven gestures from the pose library.
 * Origin is on the ground under the pelvis; seat height ≈ 0.57.
 */
export const Mannequin: React.FC<MannequinProps> = ({
  position = [0, 0, 0],
  rotationY = 0,
  color = theme.plaster,
  phase = 0,
  seed = 'figure',
  look = 0,
  screen = 0,
  gestures = [],
  life = true,
  clockOffset = 0,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const clock = t + phase + clockOffset;
  const material = plaster(color);
  const screenMat = useMemo(
    () => new THREE.MeshBasicMaterial({color: raw(theme.orange), transparent: true, opacity: 0, depthWrite: false}),
    [],
  );
  screenMat.opacity = Math.max(0, Math.min(1, screen));
  const lifeK = useMemo(() => lifeSeed(seed), [seed]);

  // Pose: idle, then the gestures blended in order.
  const toLocal = (p: V3) =>
    V(p[0] - position[0], p[1] - position[1], p[2] - position[2]).applyAxisAngle(V(0, 1, 0), -rotationY);
  const pose = poseAt(t, gestures, toLocal);

  // Idle life on top.
  const L = life ? 1 : 0;
  const b = breath(clock, lifeK) * L;
  const idle = idleOffsets(clock, lifeK);
  const k = (v: V3, m = L): V3 => [v[0] * m, v[1] * m, v[2] * m];
  const swipe = life ? thumbSwipe(clock, lifeK, pose.scroll) : 0;
  // the old reading nod, kept (phase-shifted per figure by the seed)
  const nod = Math.sin(clock * 0.9 + 1 + lifeK.breathPhase) * 0.02 * L;

  const spineE = euler(pose.spine, k(idle.spine));
  const chestE = euler(pose.chest, [-0.014 * b, 0, 0]);
  const neckE = euler(pose.neck);
  const headE = euler([REST.headPitch + nod, 0, -look * 0.35], pose.head, k(idle.head));
  const shrug = pose.shrug + 0.005 * b;

  const phone = phoneInChest(pose, swipe);
  const arms = [0, 1].map((i) => {
    const s = i === 0 ? -1 : 1;
    const shoulder = REST.shoulder(s)
      .sub(REST.chest)
      .add(V(0, shrug, 0));
    return {s, shoulder, ...solveArm(s, shoulder, phone.grips[i])};
  });
  // thumb: lies along the screen from the hand's edge; flicks up and lifts a touch
  const thumbDir = V(-0.6, 0.55 + 0.55 * swipe, 0.12 + 0.25 * swipe).normalize();
  const thumbPos = THUMB_BASE.clone().addScaledVector(thumbDir, THUMB_L / 2 + THUMB_R);
  const thumbQ = new THREE.Quaternion().setFromUnitVectors(V(0, 1, 0), thumbDir);

  const P = PARTS;
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <group position={REST.pelvis}>
        {P.side.map((side) => (
          <group key={side.s} position={rel(REST.hip(side.s), REST.pelvis)} rotation={[0, idle.hipYaw * L, 0]}>
            <PartMesh part={side.thigh} material={material} />
            <group position={rel(REST.knee(side.s), REST.hip(side.s))}>
              <PartMesh part={side.shin} material={material} />
              <group position={rel(REST.ankle(side.s), REST.knee(side.s))}>
                <PartMesh part={side.foot} material={material} />
              </group>
            </group>
          </group>
        ))}
        <group position={rel(REST.spine, REST.pelvis)} rotation={spineE}>
          <PartMesh part={P.torso} material={material} scale={[1 + 0.012 * b, 1, 1 + 0.018 * b]} />
          <group position={[0, REST.chest.y - REST.spine.y + 0.004 * b, REST.chest.z - REST.spine.z]} rotation={chestE}>
            <group position={rel(REST.neck, REST.chest)} rotation={neckE}>
              <PartMesh part={P.neck} material={material} />
              <group
                position={[
                  REST.head.x - REST.neck.x + pose.headShift[0],
                  REST.head.y - REST.neck.y + pose.headShift[1],
                  REST.head.z - REST.neck.z + pose.headShift[2],
                ]}
                rotation={headE}
              >
                <mesh
                  geometry={HEAD}
                  material={material}
                  position={[REST.headCentre.x + look * 0.06, REST.headCentre.y, REST.headCentre.z]}
                  scale={[0.95, 1.06, 1]}
                  castShadow
                  receiveShadow
                />
              </group>
            </group>
            {arms.map((a) => {
              const side = P.side[a.s < 0 ? 0 : 1];
              return (
                <group key={a.s} position={a.shoulder} quaternion={a.upper}>
                  <PartMesh part={side.upper} material={material} />
                  <group position={rel(REST.elbow(a.s), REST.shoulder(a.s))} quaternion={a.fore}>
                    <PartMesh part={side.fore} material={material} />
                    <PartMesh part={side.hand} material={material} />
                  </group>
                </group>
              );
            })}
            <group position={phone.pos} rotation={phone.euler}>
              <mesh geometry={PHONE_BODY} material={material} castShadow receiveShadow />
              <mesh position={[0, 0, 0.0115]} material={screenMat} userData={{glow: true}} visible={screen > 0.001}>
                <planeGeometry args={[0.095, 0.17]} />
              </mesh>
              <mesh geometry={THUMB} material={material} position={thumbPos} quaternion={thumbQ} castShadow />
            </group>
            {/* bleed from the screen; kept moderate so lit plaster stays under 90% */}
            <OrangeLight
              position={[phone.pos.x, phone.pos.y + 0.15, phone.pos.z + 0.25]}
              intensity={0.3 * screen}
              reach={1.4}
            />
          </group>
        </group>
      </group>
    </group>
  );
};

// Bust: the Mannequin's own parts cut at mid-chest (torso capsule, shoulders,
// upper-arm stubs, neck, head), so a person as an exhibit matches the room's figures.
// Origin at the cut (the pedestal top).
const BUST_TORSO = limb(V(0, 0.1, 0), V(0, 0.2, 0), 0.2);
const BUST_PARTS: (Part & {scale?: V3})[] = [
  {...BUST_TORSO, scale: [1.08, 1, 0.66]},
  // shoulder line: a short capsule across the top of the chest
  {...limb(V(-0.2, 0.31, -0.01), V(0.2, 0.31, -0.01), 0.085), scale: [1, 1, 0.8]},
  ...[-1, 1].map((s) => limb(V(s * 0.27, 0.3, -0.01), V(s * 0.31, 0.085, 0.0), 0.075)), // upper-arm stubs
  limb(V(0, 0.3, -0.01), V(0, 0.47, 0), 0.07), // neck
];

/**
 * Faceless plaster bust (chest, shoulders, upper-arm stubs, neck, head) on a
 * rounded pedestal: a person as an exhibit, built like the seated Mannequin.
 * Origin on the ground under the pedestal; the bust is ≈ 0.8 tall before
 * `scale` (head centre at pedestal + 0.62 × scale).
 */
export const Bust: React.FC<{
  position?: V3;
  /** Pedestal height (0 for none). Its top is where the bust stands. */
  pedestal?: number;
  /** Head turn around the vertical axis (radians; positive turns the face toward +x). */
  turn?: number;
  /** Head tilt down (radians). */
  tilt?: number;
  scale?: number;
  color?: string;
  /** Rotation of the whole bust and pedestal around the vertical axis (radians): a turntable. */
  spin?: number;
}> = ({position = [0, 0, 0], pedestal = 0.9, turn = 0, tilt = 0.08, scale = 1, color = theme.plaster, spin = 0}) => {
  const material = plaster(color);
  return (
    <group position={position} rotation={[0, spin, 0]}>
      {pedestal > 0 ? (
        <mesh
          geometry={roundedCylinder(0.26 * scale, pedestal, 0.035)}
          material={plaster(theme.plasterShade, 0.95)}
          position={[0, pedestal / 2, 0]}
          castShadow
          receiveShadow
        />
      ) : null}
      <group position={[0, pedestal, 0]} scale={scale}>
        {BUST_PARTS.map((p, i) => (
          <mesh
            key={i}
            geometry={p.geometry}
            material={material}
            position={p.position}
            quaternion={p.quaternion}
            scale={p.scale ?? 1}
            castShadow
            receiveShadow
          />
        ))}
        <group position={[0, 0.5, 0]} rotation={[tilt, turn, 0]}>
          <mesh
            geometry={HEAD}
            material={material}
            position={[0, 0.12, 0.02]}
            scale={[0.95, 1.06, 1]}
            castShadow
            receiveShadow
          />
        </group>
      </group>
    </group>
  );
};
