import React from 'react';
import {interpolate, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {theme} from '../theme';
import {Arc} from '../three/Arc';
import {Head} from '../three/Mannequin';
import {CameraRig, Stage} from '../three/Stage';

const DOTS = new Array(34).fill(0).map((_, i) => ({
  x: -2.6 + random(`px${i}`) * 5.2,
  y: 1.0 + random(`py${i}`) * 2.6,
  z: -3 + random(`pz${i}`) * 2.6,
  r: 0.05 + random(`pr${i}`) * 0.06,
  ph: random(`pp${i}`) * 6.28,
}));

const Bust: React.FC<{x: number; color: string; turn: number}> = ({x, color, turn}) => (
  <group position={[x, 0, 0]}>
    <mesh position={[0, 0.03, 0]} receiveShadow>
      <cylinderGeometry args={[0.95, 0.95, 0.06, 64]} />
      <meshStandardMaterial color="#1c2a6a" roughness={0.6} />
    </mesh>
    <mesh position={[0, 0.6, 0]} scale={[1, 0.78, 0.8]} castShadow>
      <sphereGeometry args={[0.8, 48, 48]} />
      <meshStandardMaterial color={color} roughness={0.7} />
    </mesh>
    <Head p={[0, 1.55, 0]} radius={0.52} turn={turn} />
  </group>
);

export type ProfilesSceneProps = {durationInFrames: number; leftColor?: string; rightColor?: string};

/** Two big busts linked by an arc; data points drift in — "what the ad company sees". */
export const ProfilesScene: React.FC<ProfilesSceneProps> = ({durationInFrames, leftColor = theme.red, rightColor = theme.blue}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const link = interpolate(t, [0.4, 1.4], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const gather = interpolate(t, [0.6, 3.5], [0, 0.55], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <Stage background={theme.bgDeep} fov={45}>
      <CameraRig from={[0, 2.1, 7.4]} to={[0, 1.95, 6.6]} lookFrom={[0, 1.45, 0]} durationInFrames={durationInFrames} />
      <ambientLight intensity={0.45} color="#8896ff" />
      <directionalLight position={[2, 5, 4]} intensity={1.4} castShadow />
      <pointLight position={[-3, 2, 2]} intensity={6} distance={8} color={theme.warm} />
      <gridHelper args={[24, 48, '#2a3a7a', '#18224d']} />
      <Bust x={-1.15} color={leftColor} turn={0.35} />
      <Bust x={1.15} color={rightColor} turn={-0.35} />
      <Arc from={[-0.75, 1.75, 0.15]} to={[0.75, 1.75, 0.15]} lift={0.55} progress={link} radius={0.03} />
      {DOTS.map((d, i) => {
        // drift toward the arc's midpoint as the scene goes on
        const x = d.x + (0 - d.x) * gather;
        const y = d.y + (2.3 - d.y) * gather + Math.sin(t * 1.4 + d.ph) * 0.06;
        const z = d.z + (0 - d.z) * gather;
        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[d.r, 16, 16]} />
            <meshStandardMaterial color="#3a6dff" emissive="#2a55ff" emissiveIntensity={0.6} />
          </mesh>
        );
      })}
    </Stage>
  );
};
