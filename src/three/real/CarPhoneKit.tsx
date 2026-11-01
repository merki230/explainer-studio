import React, {useEffect, useMemo} from 'react';
import * as THREE from 'three';
import {MOODS, REAL, section, type Mood} from '../../theme';
import {raw, roundedBox} from '../plaster';
import {PhoneTeardown} from './PhoneTeardown';
import {REAL_PHONE, RealPhone} from './RealPhone';

type V3 = [number, number, number];

/*
 * No. 012 (`insurance-app`, R1–R3): the car-side parts of the phone that senses the drive, mounted by `SlicedCar`.
 *  - `CupConsole`: the centre console between the front seats with a cupholder (car frame, inside the car's group).
 *  - `CupPhone`: the generic phone (`RealPhone`, no logo, one camera strip) at a pose in the world, its screen dark or
 *    lit (the § 3 screen light on the face), opened in place (`open`, the front lifting off) on the board with the
 *    motion sensor (`PhoneTeardown` `motion`).
 *  - `EventPin`: the system's mark for a logged event, an orange node-dot head on a short stem standing on the road;
 *    `ghost`: a dashed orange outline (could count), not filled.
 *  - `InkTick`: the threshold tick across the feel arrow's track, ink, flat, never bloomed.
 * Colours from the theme (`REAL`, `section`); orange only on the system's marks.
 */

/**
 * The centre console between the front seats (car frame): a trim block from `back` to under the dash (`front`), its top at
 * the cupholder's rim, an armrest behind the cupholder, the cupholder a dark well with a raised rim.
 */
export const CupConsole: React.FC<{cup: V3; back: number; front: number; floor: number}> = ({
  cup,
  back,
  front,
  floor,
}) => {
  const mats = useMemo(
    () => ({
      trim: new THREE.MeshPhysicalMaterial({color: raw(REAL.dash), roughness: 0.7}),
      lid: new THREE.MeshPhysicalMaterial({color: raw(REAL.seat), roughness: 0.85}),
      well: new THREE.MeshStandardMaterial({color: raw(REAL.tab), roughness: 0.9}),
    }),
    [],
  );
  useEffect(() => () => Object.values(mats).forEach((m) => m.dispose()), [mats]);
  const W = 0.24;
  const len = Math.max(0.3, front - back);
  const h = cup[1] - floor;
  const arm = Math.max(0.1, cup[0] - 0.1 - back);
  const geo = useMemo(() => roundedBox(len, h, W, 0.025), [len, h]);
  const armrest = useMemo(() => roundedBox(arm, 0.07, W + 0.02, 0.03), [arm]);
  useEffect(() => () => [geo, armrest].forEach((g) => g.dispose()), [geo, armrest]);
  return (
    <group>
      <mesh
        geometry={geo}
        material={mats.trim}
        position={[(front + back) / 2, floor + h / 2, cup[2]]}
        castShadow
        receiveShadow
      />
      {/* the armrest lid at the back */}
      <mesh
        geometry={armrest}
        material={mats.lid}
        position={[back + arm / 2, cup[1] + 0.035, cup[2]]}
        castShadow
        receiveShadow
      />
      {/* the cupholder: a dark well with a raised rim */}
      <mesh position={[cup[0], cup[1] + 0.001, cup[2]]} material={mats.well} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.075, 32]} />
      </mesh>
      <mesh position={[cup[0], cup[1] + 0.006, cup[2]]} material={mats.trim} rotation={[-Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.078, 0.008, 8, 32]} />
      </mesh>
    </group>
  );
};

export type CupPhoneProps = {
  mood: Mood;
  /** Centre and rotation (world). The screen is the local +z face, the top +y. */
  position: V3;
  quaternion: THREE.Quaternion;
  /** The phone's height (m). */
  height: number;
  /** 0 asleep (dark glass) → 1 lit (`ui`, its light on the holder's face). */
  screen: number;
  /** 0 closed → 1 the front lifted off (the object cut-away). */
  open: number;
  /** The motion sensor (see `PhoneTeardown` `motion`), drawn once the phone is opening. */
  motion?: {lid: number; swing: number};
  /** Which face comes off (`RealPhone` `openSide`): the one toward the camera. Default 'front'. */
  openSide?: 'front' | 'back';
};

/** The cupholder phone (see the file comment). */
export const CupPhone: React.FC<CupPhoneProps> = ({
  mood,
  position,
  quaternion,
  height,
  screen,
  open,
  motion,
  openSide = 'front',
}) => {
  const display = useMemo(() => new THREE.MeshBasicMaterial({color: raw(REAL.panelOff), toneMapped: false}), []);
  useEffect(() => () => display.dispose(), [display]);
  const on = Math.max(0, Math.min(1, screen));
  display.color.copy(raw(REAL.panelOff)).lerp(raw(MOODS[mood].ui), on);
  const s = height / REAL_PHONE.h;
  return (
    <group position={position} quaternion={quaternion}>
      <RealPhone scale={s} display={display} open={Math.max(0, Math.min(1, open))} openSide={openSide} shadows>
        {open > 0.001 ? <PhoneTeardown motion={motion} /> : null}
      </RealPhone>
      {/* the § 3 screen light, on the face it turns to (Figure's call-phone values) */}
      <pointLight
        position={[0, 0.03, 0.05]}
        color={raw(section.screenLight)}
        intensity={on > 0.01 ? (0.15 + 0.45 * on) * 0.15 * (1 - Math.min(1, open * 2)) : 0}
        distance={0.9}
        decay={2}
      />
    </group>
  );
};

const useGlowMats = () => {
  const mats = useMemo(
    () => ({
      core: new THREE.MeshBasicMaterial({color: raw(section.orange), transparent: true}),
      halo: new THREE.MeshBasicMaterial({color: raw(section.orange), transparent: true, depthWrite: false}),
      ink: new THREE.MeshBasicMaterial({color: raw(section.cutLine), transparent: true, depthTest: false}),
    }),
    [],
  );
  useEffect(() => () => Object.values(mats).forEach((m) => m.dispose()), [mats]);
  return mats;
};

/** The § 5 halo ratio and the vibration path's core (the pins' stem weight at camera distance 12.75). */
const HALO = {scale: 0.055 / 0.018, opacity: 0.25};
const STEM_R = 0.0225;

export type EventPinProps = {
  /** The head's centre and the foot on the road (world). */
  head: V3;
  foot: V3;
  /** 0 → 1: how far the stem has grown down from the head. */
  stem: number;
  /** × the sizes (keeps the screen size across framings). */
  k: number;
  /** The head's swell (1: § 5 size). */
  swell?: number;
  opacity?: number;
  /** A dashed orange outline instead (could count). */
  ghost?: boolean;
  /** The head's radius at k = 1 (m). */
  headR?: number;
};

/** A logged event's pin (see the file comment). Bloomed like a path; the ghost is not (an outline only). */
export const EventPin: React.FC<EventPinProps> = ({
  head,
  foot,
  stem,
  k,
  swell = 1,
  opacity = 1,
  ghost = false,
  headR = 0.06,
}) => {
  const mats = useGlowMats();
  const geo = useMemo(
    () => ({
      sphere: new THREE.SphereGeometry(1, 20, 14),
      shaft: new THREE.CylinderGeometry(1, 1, 1, 12),
      ring: new THREE.TorusGeometry(1, 0.16, 8, 40),
      disc: new THREE.CircleGeometry(1, 28),
    }),
    [],
  );
  useEffect(() => () => Object.values(geo).forEach((g) => g.dispose()), [geo]);
  const o = Math.max(0, Math.min(1, opacity));
  mats.core.opacity = o;
  mats.halo.opacity = HALO.opacity * o;
  const r = STEM_R * k;
  const hr = headR * k * swell;
  // the stem from under the head down to the foot, grown by `stem`
  const top = head[1] - hr * 0.6;
  const bottom = top - (top - foot[1]) * Math.max(0, Math.min(1, stem));
  const len = Math.max(0, top - bottom);
  // the ring faces the camera (the section angle)
  const ringQ = useMemo(
    () =>
      new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        new THREE.Vector3(0.44, 0.27, 0.85).normalize(),
      ),
    [],
  );
  if (o < 0.01) return null;
  if (ghost) {
    const dashes = 4;
    const seg = len / (dashes * 2 - 1);
    return (
      <group>
        <mesh geometry={geo.ring} material={mats.core} position={head} quaternion={ringQ} scale={hr} />
        {len > 0.002
          ? [...Array(dashes).keys()].map((i) => (
              <mesh
                key={i}
                geometry={geo.shaft}
                material={mats.core}
                position={[head[0], top - seg * (2 * i + 0.5), head[2]]}
                scale={[r * 0.7, seg, r * 0.7]}
              />
            ))
          : null}
      </group>
    );
  }
  return (
    <group>
      <mesh geometry={geo.sphere} material={mats.core} position={head} scale={hr} userData={{glow: true}} />
      <mesh geometry={geo.sphere} material={mats.halo} position={head} scale={hr * 1.7} userData={{glow: true}} />
      {len > 0.002 ? (
        <>
          <mesh
            geometry={geo.shaft}
            material={mats.core}
            position={[head[0], (top + bottom) / 2, head[2]]}
            scale={[r, len, r]}
            userData={{glow: true}}
          />
          <mesh
            geometry={geo.shaft}
            material={mats.halo}
            position={[head[0], (top + bottom) / 2, head[2]]}
            scale={[r * HALO.scale, len, r * HALO.scale]}
            userData={{glow: true}}
          />
        </>
      ) : null}
      {/* where it stands: a small flat dot on the road */}
      {stem >= 0.999 ? (
        <mesh
          geometry={geo.disc}
          material={mats.core}
          position={[foot[0], foot[1] + 0.002, foot[2]]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={r * 2.4}
          userData={{glow: true}}
        />
      ) : null}
    </group>
  );
};

/** The feel arrow's threshold tick: an ink bar across the track at `position` (world), `h` tall, drawn over the cabin. */
export const InkTick: React.FC<{position: V3; h: number; w: number; opacity?: number; mood: Mood}> = ({
  position,
  h,
  w,
  opacity = 1,
  mood,
}) => {
  const mats = useGlowMats();
  mats.ink.opacity = Math.max(0, Math.min(1, opacity));
  mats.ink.color.copy(raw(section.cutLine)).multiplyScalar(1 / MOODS[mood].exposure);
  return (
    <mesh position={position} material={mats.ink} renderOrder={24}>
      <boxGeometry args={[w, h, w]} />
    </mesh>
  );
};

/** The plug-in box's ghost outline (car frame): a small box's visible edges and its plug, as polylines for `GhostLines`. */
export const plugBoxLines = (port: V3, size: V3 = [0.2, 0.12, 0.1]): V3[][] => {
  const [x, y, z] = port;
  const [w, h, d] = size;
  // the box hangs below the port, its back face against the dash's underside (x toward the driver = −)
  const x0 = x - d;
  const x1 = x;
  const y0 = y - h - 0.02;
  const y1 = y - 0.02;
  const z0 = z - w / 2;
  const z1 = z + w / 2;
  const P = (a: number, b: number, c: number): V3 => [a, b, c];
  return [
    // the face toward the driver and the camera side, closed loops
    [P(x0, y0, z0), P(x0, y0, z1), P(x0, y1, z1), P(x0, y1, z0), P(x0, y0, z0)],
    [P(x0, y0, z1), P(x1, y0, z1), P(x1, y1, z1), P(x0, y1, z1)],
    [P(x0, y1, z0), P(x1, y1, z0), P(x1, y1, z1)],
    // the plug up into the port
    [
      P(x1 - d * 0.65, y1, z - w * 0.22),
      P(x1 - d * 0.65, y + 0.015, z - w * 0.22),
      P(x1 - d * 0.3, y + 0.015, z - w * 0.22),
      P(x1 - d * 0.3, y1, z - w * 0.22),
    ],
  ];
};

/**
 * No. 012 (option C): a generic clip mount on the dash top (car frame): a round foot pad, a short ball-jointed stem and
 * a cradle (a back plate with a bottom lip and two side grips) holding the phone at its rest pose. House grey
 * (`REAL.frame`), no text or mark. `pose`: the phone's rest pose in the mount (`cupPhonePose` at lift 0).
 */
export const DashMount: React.FC<{
  foot: V3;
  pose: {pos: THREE.Vector3; q: THREE.Quaternion; n: THREE.Vector3; up: THREE.Vector3};
}> = ({foot, pose}) => {
  const mat = useMemo(
    () => new THREE.MeshStandardMaterial({color: raw(REAL.frame), roughness: 0.55, metalness: 0.2}),
    [],
  );
  const pad = useMemo(() => new THREE.MeshStandardMaterial({color: raw(REAL.rubber), roughness: 0.9}), []);
  useEffect(() => () => [mat, pad].forEach((m) => m.dispose()), [mat, pad]);
  // the cradle sits behind the phone's lower half (away from the screen)
  const h = 0.22;
  const back = pose.pos
    .clone()
    .add(pose.n.clone().multiplyScalar(-0.016))
    .add(pose.up.clone().multiplyScalar(-h * 0.18));
  const ball = new THREE.Vector3(foot[0], foot[1] + 0.03, foot[2]);
  const stem = back.clone().sub(ball);
  const stemQ = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), stem.clone().normalize());
  const lip = pose.pos
    .clone()
    .add(pose.up.clone().multiplyScalar(-h / 2 - 0.006))
    .add(pose.n.clone().multiplyScalar(-0.004));
  return (
    <group>
      <mesh position={[foot[0], foot[1] + 0.006, foot[2]]} material={pad} castShadow receiveShadow>
        <cylinderGeometry args={[0.035, 0.04, 0.012, 24]} />
      </mesh>
      <mesh position={ball} material={mat} castShadow>
        <sphereGeometry args={[0.016, 16, 12]} />
      </mesh>
      <mesh position={ball.clone().add(stem.clone().multiplyScalar(0.5))} quaternion={stemQ} material={mat} castShadow>
        <cylinderGeometry args={[0.009, 0.009, stem.length(), 12]} />
      </mesh>
      <group position={back} quaternion={pose.q}>
        <mesh geometry={roundedBox(0.075, 0.1, 0.012, 0.005)} material={mat} castShadow receiveShadow />
        {[-1, 1].map((sx) => (
          <mesh key={sx} position={[sx * 0.058, 0.01, 0.012]} material={mat} castShadow>
            <boxGeometry args={[0.012, 0.04, 0.026]} />
          </mesh>
        ))}
      </group>
      <group position={lip} quaternion={pose.q}>
        <mesh material={mat} castShadow>
          <boxGeometry args={[0.07, 0.012, 0.03]} />
        </mesh>
      </group>
    </group>
  );
};
