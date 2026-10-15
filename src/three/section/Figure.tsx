import React, {useMemo} from 'react';
import {random, useCurrentFrame, useVideoConfig} from 'remotion';
import * as THREE from 'three';
import {CAST, MOODS, section, type CastName, type Mood} from '../../theme';
import {limb, plaster as matte, raw, roundedBox} from '../plaster';
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
/** At rest the face looks down a little more than the head bone (the mock-up's 0.32 total). */
const FACE_PITCH = 0.2;
/** Eyes: ±0.055 across, slightly below the centre, on the sphere's front (§ 8). */
const EYE_AT = (s: number): V3 => [s * 0.055, -0.01, 0.152];

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
  /** The system's orange on the screen and its light, 0–1 (stage 2 wires it). */
  system?: number;
  /** Breathing, weight shifts, head drift, thumb and blinks (default on). */
  life?: boolean;
  /** Seconds added to the scene time for the idle life (the scene's start in the video). */
  clockOffset?: number;
};

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
  life = true,
  clockOffset = 0,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const clock = t + clockOffset;
  const look = CAST[who];
  const key = seed ?? who;
  const mats = useMemo(
    () => ({
      top: matte(look.top, 0.9),
      bottom: matte(look.bottom, 0.9),
      skin: matte(look.skin, 0.75),
      hair: matte(look.hair, 0.9),
      shoe: matte(section.shoe, 0.8),
      eye: matte(section.eye, 0.4),
      glasses: matte(section.glasses, 0.5),
      device: matte(MOODS[mood].device, 0.4),
    }),
    [look, mood],
  );
  const screenMat = useMemo(() => new THREE.MeshBasicMaterial({color: raw(MOODS[mood].ui)}), [mood]);
  const on = Math.max(0, Math.min(1, screenOn));
  const sys = Math.max(0, Math.min(1, system));
  const dark = raw('#0f1116');
  const lit = raw(MOODS[mood].ui);
  screenMat.color.copy(dark).lerp(lit, on).lerp(raw(section.orange), sys);
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
  const arms = [0, 1].map((i) => {
    const s = i === 0 ? -1 : 1;
    const shoulder = REST.shoulder(s)
      .sub(REST.chest)
      .add(V(0, shrug, 0));
    return {s, shoulder, ...solveArm(s, shoulder, ph.grips[i])};
  });
  const thumbDir = V(-0.6, 0.55 + 0.55 * swipe, -0.12 - 0.25 * swipe).normalize();
  const thumbPos = THUMB_BASE.clone().addScaledVector(thumbDir, THUMB_L / 2 + THUMB_R);
  const thumbQ = new THREE.Quaternion().setFromUnitVectors(V(0, 1, 0), thumbDir);
  // light on the face from the screen (§ 3: 0.6 on, 0.15 locked), × 0.15 for three's inverse-square
  // falloff over the ≈ 0.3 units to the face (the mock-up's legacy light had none)
  const faceLight = holdsPhone ? (0.15 + 0.45 * on) * 0.15 : 0;

  const P = PARTS;
  const c = REST.headCentre;
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <group position={REST.pelvis}>
        {P.side.map((side) => (
          <group key={side.s} position={rel(REST.hip(side.s), REST.pelvis)} rotation={[0, idle.hipYaw * L, 0]}>
            <PartMesh part={side.thigh} material={mats.bottom} />
            <group position={rel(REST.knee(side.s), REST.hip(side.s))}>
              <PartMesh part={side.shin} material={mats.bottom} />
              <group position={rel(REST.ankle(side.s), REST.knee(side.s))}>
                <PartMesh part={side.foot} material={mats.shoe} />
              </group>
            </group>
          </group>
        ))}
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
                      position={EYE_AT(s)}
                      scale={[1, 1 - 0.9 * blink, 1]}
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
                    <PartMesh part={side.hand} material={mats.skin} />
                  </group>
                </group>
              );
            })}
            {holdsPhone ? (
              <group position={ph.pos} rotation={ph.euler}>
                <mesh geometry={PHONE_BODY} material={mats.device} castShadow receiveShadow />
                {/* the screen is on the back (−z) face: toward the holder's eyes */}
                <mesh position={[0, 0, -PHONE.d / 2 - 0.0006]} rotation={[0, Math.PI, 0]} material={screenMat}>
                  <planeGeometry args={[PHONE.w - 0.015, PHONE.h - 0.02]} />
                </mesh>
                <mesh geometry={THUMB} material={mats.skin} position={thumbPos} quaternion={thumbQ} castShadow />
                <pointLight
                  position={[0, 0.04, -0.04]}
                  color={raw(sys > 0.5 ? section.orange : section.screenLight)}
                  intensity={faceLight}
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
