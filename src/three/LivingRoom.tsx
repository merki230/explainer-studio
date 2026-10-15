import React from 'react';
import {random} from 'remotion';
import {theme} from '../theme';

type V3 = [number, number, number];

const Box: React.FC<{p: V3; s: V3; color: string; emissive?: string; e?: number}> = ({
  p,
  s,
  color,
  emissive,
  e = 0,
}) => (
  <mesh position={p} castShadow receiveShadow>
    <boxGeometry args={s} />
    <meshStandardMaterial color={color} roughness={0.8} emissive={emissive ?? '#000000'} emissiveIntensity={e} />
  </mesh>
);

// Positions other scenes need (arcs start/end here).
export const ROOM = {
  phoneA: [-0.38, 0.475, 1.25] as V3,
  phoneB: [0.3, 0.475, 1.38] as V3,
  router: [0, 1.6, -1.05] as V3,
};

const STARS = new Array(46)
  .fill(0)
  .map((_, i) => [-1.05 + random(`sx${i}`) * 2.1, 1.98 + random(`sy${i}`) * 1.15, 0.006 + random(`ss${i}`) * 0.008]);

/** Night-time living room: wall + window + moon, couch, coffee table, router shelf. */
export const LivingRoom: React.FC<{screenGlow?: number}> = ({screenGlow = 0.6}) => (
  <group>
    {/* lights: cool moonlight through the window, warm lamp from the left */}
    <ambientLight intensity={0.35} color="#8090ff" />
    <directionalLight
      position={[1.5, 4, -3]}
      intensity={0.9}
      color="#a9b8ff"
      castShadow
      shadow-mapSize-width={1024}
      shadow-mapSize-height={1024}
    />
    <pointLight position={[-2.2, 1.9, 1.6]} intensity={9} distance={7} decay={1.6} color={theme.warm} />
    <pointLight position={[0, 1.2, 3.5]} intensity={2.2} distance={6} color="#6d7cff" />

    {/* floor + wall */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial color={theme.floor} roughness={1} />
    </mesh>
    <mesh position={[0, 5, -1.2]} receiveShadow>
      <planeGeometry args={[20, 10]} />
      <meshStandardMaterial color={theme.wall} roughness={1} />
    </mesh>

    {/* window: night sky, stars, moon, frame */}
    <mesh position={[0, 2.55, -1.19]}>
      <planeGeometry args={[2.3, 1.35]} />
      <meshBasicMaterial color="#0c1640" />
    </mesh>
    {STARS.map(([x, y, r], i) => (
      <mesh key={i} position={[x, y, -1.18]}>
        <sphereGeometry args={[r, 6, 6]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>
    ))}
    <mesh position={[0.62, 2.95, -1.17]}>
      <circleGeometry args={[0.13, 40]} />
      <meshBasicMaterial color={theme.moon} toneMapped={false} />
    </mesh>
    <Box p={[0, 1.86, -1.15]} s={[2.42, 0.06, 0.08]} color="#2c3563" />
    <Box p={[0, 3.24, -1.15]} s={[2.42, 0.06, 0.08]} color="#2c3563" />
    <Box p={[-1.18, 2.55, -1.15]} s={[0.06, 1.44, 0.08]} color="#2c3563" />
    <Box p={[1.18, 2.55, -1.15]} s={[0.06, 1.44, 0.08]} color="#2c3563" />
    <Box p={[0, 2.55, -1.15]} s={[0.04, 1.36, 0.06]} color="#2c3563" />

    {/* router on a wall shelf (between the two heads so it's never hidden) */}
    <group position={[ROOM.router[0], 0, ROOM.router[2]]}>
      <Box p={[0, 1.5, 0]} s={[0.6, 0.04, 0.24]} color={theme.wood} />
      <Box p={[0, 1.555, 0]} s={[0.3, 0.07, 0.17]} color="#d9dcef" emissive={theme.glow} e={0.15} />
      {[-0.1, 0.1].map((x) => (
        <mesh key={x} position={[x, 1.66, -0.05]} rotation={[0, 0, x * 1.5]}>
          <cylinderGeometry args={[0.008, 0.008, 0.16, 8]} />
          <meshStandardMaterial color="#d9dcef" />
        </mesh>
      ))}
    </group>

    {/* couch */}
    <Box p={[0, 0.22, 0]} s={[2.4, 0.44, 0.9]} color={theme.couch} />
    <Box p={[0, 0.8, -0.36]} s={[2.4, 0.72, 0.22]} color={theme.couch} />
    <Box p={[-1.3, 0.38, 0]} s={[0.22, 0.6, 0.92]} color="#253060" />
    <Box p={[1.3, 0.38, 0]} s={[0.22, 0.6, 0.92]} color="#253060" />

    {/* coffee table + props */}
    <Box p={[0, 0.42, 1.3]} s={[1.6, 0.07, 0.72]} color={theme.wood} />
    {[
      [-0.72, 1.0],
      [0.72, 1.0],
      [-0.72, 1.6],
      [0.72, 1.6],
    ].map(([x, z]) => (
      <Box key={`${x}${z}`} p={[x, 0.19, z]} s={[0.05, 0.38, 0.05]} color={theme.wood} />
    ))}
    {[ROOM.phoneA, ROOM.phoneB].map((p, i) => (
      <group key={i} position={p} rotation={[0, i ? -0.4 : 0.3, 0]}>
        <Box p={[0, 0, 0]} s={[0.09, 0.012, 0.18]} color="#151829" />
        <mesh position={[0, 0.007, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.078, 0.165]} />
          <meshBasicMaterial color="#5a6cff" transparent opacity={0.25 + screenGlow * 0.75} toneMapped={false} />
        </mesh>
      </group>
    ))}
    <Box p={[0.5, 0.49, 1.22]} s={[0.36, 0.07, 0.26]} color="#a8262f" />
    <mesh position={[-0.6, 0.53, 1.12]} castShadow>
      <cylinderGeometry args={[0.055, 0.05, 0.16, 24]} />
      <meshStandardMaterial color="#c9cbd8" roughness={0.4} />
    </mesh>
  </group>
);
