import React from 'react';
import {interpolate, random, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {theme} from '../theme';
import {CameraRig, Stage} from '../three/Stage';

const COLS = 12;
const ROWS = 22;
const SIZE = 0.9;
const GAP = 0.12;

const TILES = new Array(COLS * ROWS).fill(0).map((_, i) => {
  const c = i % COLS;
  const r = Math.floor(i / COLS);
  return {
    x: (c - (COLS - 1) / 2) * (SIZE + GAP),
    z: -r * (SIZE + GAP) + 3,
    color: theme.tiles[Math.floor(random(`tc${i}`) * theme.tiles.length)],
    delay: r * 0.9 + random(`td${i}`) * 4,
    ph: random(`tp${i}`) * 6.28,
  };
});

export type TilesSceneProps = {durationInFrames: number};

/** A field of coloured tiles rising in a wave — "millions of homes / data points". */
export const TilesScene: React.FC<TilesSceneProps> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;

  return (
    <Stage background={theme.bgDeep} fov={42}>
      <CameraRig from={[2.5, 7.5, 9]} to={[1.2, 6.2, 6.5]} lookFrom={[0, 0, -2]} lookTo={[0, 0, -3]} durationInFrames={durationInFrames} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 10, 6]} intensity={1.6} castShadow />
      <pointLight position={[-5, 4, 2]} intensity={10} distance={14} color={theme.warm} />
      {TILES.map((tile, i) => {
        const rise = spring({frame: frame - tile.delay, fps, config: {damping: 14, mass: 0.6}});
        const h = 0.18 + 0.12 * (0.5 + 0.5 * Math.sin(t * 2.2 + tile.ph));
        const y = interpolate(rise, [0, 1], [-1.2, 0]);
        return (
          <mesh key={i} position={[tile.x, y + h / 2, tile.z]} castShadow receiveShadow>
            <boxGeometry args={[SIZE, h, SIZE]} />
            <meshStandardMaterial color={tile.color} roughness={0.45} />
          </mesh>
        );
      })}
    </Stage>
  );
};
