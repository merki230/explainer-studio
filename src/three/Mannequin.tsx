import React, {useMemo} from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import * as THREE from 'three';
import {theme} from '../theme';
import {OrangeLight} from './OrangePath';
import {limb, plaster, raw, roundedBox, roundedCylinder} from './plaster';

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

// Seated, slouched, both hands on the phone, looking down at it. Origin on the
// seat's floor under the pelvis; hips at y ≈ 0.6 (a couch seat top at ~0.57).
const sphere = (r: number) => new THREE.SphereGeometry(r, 24, 18);
const HEAD = sphere(0.165);
const HAND = sphere(0.07);
const buildPose = () => {
  const legs: Part[] = [];
  const upper: Part[] = [];
  upper.push(limb(V(0, 0.62, -0.1), V(0, 1.08, -0.16), 0.2)); // torso
  upper.push(limb(V(0, 1.06, -0.12), V(0, 1.2, -0.07), 0.07)); // neck
  for (const s of [-1, 1]) {
    legs.push(limb(V(s * 0.12, 0.6, -0.08), V(s * 0.13, 0.6, 0.4), 0.1)); // thigh
    legs.push(limb(V(s * 0.13, 0.58, 0.44), V(s * 0.13, 0.1, 0.5), 0.085)); // shin
    legs.push({geometry: roundedBox(0.13, 0.08, 0.26, 0.03), position: V(s * 0.13, 0.04, 0.58)}); // foot
    upper.push(limb(V(s * 0.27, 1.04, -0.14), V(s * 0.3, 0.76, 0.06), 0.07)); // upper arm
    upper.push(limb(V(s * 0.3, 0.76, 0.06), V(s * 0.09, 0.86, 0.28), 0.062)); // forearm
    upper.push({geometry: HAND, position: V(s * 0.08, 0.86, 0.3)});
  }
  return {legs, upper};
};

const PartMesh: React.FC<{part: Part; material: THREE.Material}> = ({part, material}) => (
  <mesh
    geometry={part.geometry}
    material={material}
    position={part.position}
    quaternion={part.quaternion}
    castShadow
    receiveShadow
  />
);

/**
 * Seated, faceless plaster mannequin holding a phone in both hands.
 * Origin is on the ground under the pelvis; seat height ≈ 0.57.
 */
export const Mannequin: React.FC<{
  position?: V3;
  rotationY?: number;
  /** Plaster tint. Keep it plaster: the orange is reserved for the system. */
  color?: string;
  /** Different phase per character so they don't breathe in sync. */
  phase?: number;
  /** Lean the head toward the other person (radians-ish, ±0.5 is plenty). */
  look?: number;
  /** Orange glow on the phone screen, 0–1. */
  screen?: number;
}> = ({position = [0, 0, 0], rotationY = 0, color = theme.plaster, phase = 0, look = 0, screen = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps + phase;
  const pose = useMemo(buildPose, []);
  const material = plaster(color);
  const screenMat = useMemo(
    () => new THREE.MeshBasicMaterial({color: raw(theme.orange), transparent: true, opacity: 0, depthWrite: false}),
    [],
  );
  screenMat.opacity = Math.max(0, Math.min(1, screen));

  const breathe = Math.sin(t * 1.6) * 0.008;
  const nod = Math.sin(t * 0.9 + 1) * 0.03;

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {pose.legs.map((p, i) => (
        <PartMesh key={i} part={p} material={material} />
      ))}
      <group position={[0, breathe, 0]}>
        {pose.upper.map((p, i) => (
          <PartMesh key={i} part={p} material={material} />
        ))}
        {/* head leans toward `look` and nods slightly while reading */}
        <group position={[0, 1.2, -0.08]} rotation={[nod + 0.12, 0, -look * 0.35]}>
          <mesh
            geometry={HEAD}
            material={material}
            position={[look * 0.06, 0.1, 0.03]}
            scale={[0.95, 1.06, 1]}
            castShadow
            receiveShadow
          />
        </group>
        <group position={PHONE_LOCAL} rotation={[-0.9, 0, 0]}>
          <mesh geometry={roundedBox(0.11, 0.19, 0.02, 0.008)} material={material} castShadow receiveShadow />
          <mesh position={[0, 0, 0.0115]} material={screenMat} userData={{glow: true}} visible={screen > 0.001}>
            <planeGeometry args={[0.095, 0.17]} />
          </mesh>
        </group>
        {/* bleed from the screen; kept moderate so lit plaster stays under 90% */}
        <OrangeLight
          position={[PHONE_LOCAL[0], PHONE_LOCAL[1] + 0.15, PHONE_LOCAL[2] + 0.25]}
          intensity={0.3 * screen}
          reach={1.4}
        />
      </group>
    </group>
  );
};

// Bust: a turned chest (classical bust silhouette, flattened front to back),
// a neck, the head.
const CHEST = (() => {
  const profile = new THREE.SplineCurve(
    [
      [0.0, 0.0],
      [0.27, 0.0],
      [0.3, 0.08],
      [0.3, 0.17],
      [0.26, 0.26],
      [0.15, 0.32],
      [0.06, 0.345],
      [0.0, 0.35],
    ].map(([x, y]) => new THREE.Vector2(x, y)),
  ).getPoints(40);
  const g = new THREE.LatheGeometry(profile, 48);
  g.computeVertexNormals();
  return g;
})();
const BUST_PARTS: Part[] = [{geometry: CHEST, position: V(0, 0, 0)}, limb(V(0, 0.28, -0.01), V(0, 0.46, 0), 0.07)];
const CHEST_SCALE: V3 = [1, 1, 0.55];

/**
 * Faceless plaster bust (shoulders, neck, head) on a rounded pedestal: a person
 * as an exhibit. Origin on the ground under the pedestal; the bust is ≈ 0.8
 * tall before `scale` (head centre at pedestal + 0.62 × scale).
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
}> = ({position = [0, 0, 0], pedestal = 0.9, turn = 0, tilt = 0.08, scale = 1, color = theme.plaster}) => {
  const material = plaster(color);
  return (
    <group position={position}>
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
            scale={i === 0 ? CHEST_SCALE : 1}
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
