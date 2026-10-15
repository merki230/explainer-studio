import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {theme} from '../theme';

type V3 = [number, number, number];

const Capsule: React.FC<{p: V3; r?: V3; radius: number; length: number; color: string}> = ({
  p,
  r = [0, 0, 0],
  radius,
  length,
  color,
}) => (
  <mesh position={p} rotation={r} castShadow receiveShadow>
    <capsuleGeometry args={[radius, length, 8, 16]} />
    <meshStandardMaterial color={color} roughness={0.75} />
  </mesh>
);

/** Faceless head with a hair cap. Reused by the close-up busts. */
export const Head: React.FC<{p: V3; radius: number; turn?: number}> = ({p, radius, turn = 0}) => (
  <group position={p} rotation={[0, turn, 0]}>
    <mesh castShadow>
      <sphereGeometry args={[radius, 32, 32]} />
      <meshStandardMaterial color={theme.skin} roughness={0.6} />
    </mesh>
    <mesh rotation={[-0.45, 0, 0]} castShadow>
      <sphereGeometry args={[radius * 1.04, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
      <meshStandardMaterial color={theme.hair} roughness={0.9} />
    </mesh>
  </group>
);

/**
 * Seated, faceless mannequin built from capsules — the look of the reference.
 * Origin is on the floor under the pelvis; seat height ≈ 0.45.
 */
export const Mannequin: React.FC<{
  position?: V3;
  rotationY?: number;
  color?: string;
  /** Different phase per character so they don't move in sync. */
  phase?: number;
  /** Extra head turn (radians), e.g. to look at the other person. */
  look?: number;
}> = ({position = [0, 0, 0], rotationY = 0, color = theme.red, phase = 0, look = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps + phase;
  const breathe = Math.sin(t * 1.6) * 0.012;
  const headTurn = look + Math.sin(t * 0.7) * 0.12;
  const headTilt = Math.sin(t * 0.9 + 1) * 0.04;

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* pelvis + legs */}
      <Capsule p={[0, 0.58, 0.04]} r={[0, 0, Math.PI / 2]} radius={0.16} length={0.2} color={theme.pants} />
      {[-0.14, 0.14].map((x) => (
        <group key={x}>
          <Capsule p={[x, 0.56, 0.26]} r={[Math.PI / 2, 0, 0]} radius={0.115} length={0.34} color={theme.pants} />
          <Capsule p={[x, 0.29, 0.5]} radius={0.1} length={0.3} color={theme.pants} />
          <mesh position={[x, 0.05, 0.56]} castShadow>
            <boxGeometry args={[0.16, 0.1, 0.26]} />
            <meshStandardMaterial color="#111322" roughness={0.8} />
          </mesh>
        </group>
      ))}

      {/* torso, arms, head ride on a breathing group */}
      <group position={[0, breathe, 0]}>
        <Capsule p={[0, 0.98, 0]} radius={0.27} length={0.42} color={color} />
        {[-1, 1].map((s) => (
          <group key={s}>
            <Capsule p={[0.37 * s, 0.98, 0.04]} r={[0.25, 0, 0.12 * s]} radius={0.09} length={0.32} color={color} />
            <Capsule p={[0.34 * s, 0.72, 0.26]} r={[1.25, 0, 0]} radius={0.08} length={0.26} color={color} />
            <mesh position={[0.32 * s, 0.66, 0.44]} castShadow>
              <sphereGeometry args={[0.075, 16, 16]} />
              <meshStandardMaterial color={theme.skin} roughness={0.6} />
            </mesh>
          </group>
        ))}
        <group rotation={[headTilt, 0, 0]}>
          <Head p={[0, 1.62, 0]} radius={0.24} turn={headTurn} />
        </group>
      </group>
    </group>
  );
};
