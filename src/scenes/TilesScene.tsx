import React, {useMemo} from 'react';
import {Easing, interpolate, random, useCurrentFrame, useVideoConfig} from 'remotion';
import * as THREE from 'three';
import {theme} from '../theme';
import {MuseumLights, MuseumSet, MuseumStage} from '../three/MuseumStage';
import {plaster, raw, roundedBox} from '../three/plaster';
import {CameraRig} from '../three/Stage';

export type TilesSceneProps = {
  durationInFrames: number;
  /** Grid size. Far rows fade into the gallery fog. */
  cols?: number;
  rows?: number;
  /** Share of tiles the system "matches" (they turn orange), 0–1. */
  matched?: number;
  /** Seconds into the scene when matched tiles start turning orange (they go row by row, front to back). */
  matchAt?: number;
  /** Seconds the matching wave takes to cross the field. */
  matchDuration?: number;
};

const SIZE = 0.9;
const GAP = 0.14;
const H = 0.2;

const seg = (x: number, a: number, b: number) =>
  interpolate(x, [a, b], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

const PLASTER = raw(theme.plaster);
// Albedo that lands on signal orange under the key light (the full value lights up
// past it and, once it blooms, drifts toward yellow).
const ORANGE = raw(theme.orange).multiplyScalar(0.62);

/**
 * A field of plaster tiles (homes) rising in a wave into the fog; the ones the
 * system matches turn orange. "Multiply that by millions of homes."
 */
export const TilesScene: React.FC<TilesSceneProps> = ({
  durationInFrames,
  cols = 12,
  rows = 22,
  matched = 0.14,
  matchAt = 1.0,
  matchDuration = 2.4,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;

  const tiles = useMemo(
    () =>
      new Array(cols * rows).fill(0).map((_, i) => {
        const c = i % cols;
        const r = Math.floor(i / cols);
        return {
          x: (c - (cols - 1) / 2) * (SIZE + GAP),
          z: -r * (SIZE + GAP) + 3,
          // Front rows are already rising when the scene fades in; the field is full by ≈ 1.2 s.
          rise: -0.25 + r * 0.025 + random(`tile-rise${i}`) * 0.3,
          ph: random(`tile-ph${i}`) * 6.28,
          match: random(`tile-match${i}`) < matched ? r / rows + random(`tile-md${i}`) * 0.15 : -1,
        };
      }),
    [cols, rows, matched],
  );
  // One material per matched tile (its colour animates); the rest share plaster.
  const mats = useMemo(
    () =>
      tiles.map((tile) =>
        tile.match >= 0 ? new THREE.MeshStandardMaterial({color: PLASTER.clone(), roughness: 0.9, metalness: 0}) : null,
      ),
    [tiles],
  );
  const geometry = roundedBox(SIZE, H, SIZE, 0.05);
  const base = plaster();

  return (
    <MuseumStage fog={[8, 24]} post={{focusY: 0.5}}>
      <CameraRig
        from={[2.2, 7.2, 8.6]}
        to={[1.2, 6.2, 6.6]}
        lookFrom={[0, 0, -2]}
        lookTo={[0, 0, -3]}
        durationInFrames={durationInFrames}
      />
      <MuseumLights target={[0, -0.5, -1]} keyPosition={[2, 9, 5]} />
      <MuseumSet plinth={null} wall={null} />
      {tiles.map((tile, i) => {
        const up = seg(t, tile.rise, tile.rise + 0.6);
        const bob = 0.03 * Math.sin(t * 1.6 + tile.ph);
        const m =
          tile.match < 0 ? 0 : seg(t, matchAt + tile.match * matchDuration, matchAt + tile.match * matchDuration + 0.5);
        const mat = mats[i];
        if (mat) {
          mat.color.copy(PLASTER).lerp(ORANGE, m);
        }
        const y = -0.5 + interpolate(up, [0, 1], [-H, H / 2]) + bob + 0.08 * m;
        return (
          <mesh
            key={i}
            geometry={geometry}
            material={mat ?? base}
            position={[tile.x, y, tile.z]}
            userData={{glow: m > 0.5}}
            castShadow
            receiveShadow
          />
        );
      })}
    </MuseumStage>
  );
};
