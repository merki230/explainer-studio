import React, {useEffect, useMemo} from 'react';
import {random, useCurrentFrame, useVideoConfig} from 'remotion';
import * as THREE from 'three';
import {theme} from '../theme';
import {raw, softTexture} from './plaster';

type V3 = [number, number, number];

const smooth = (a: number, b: number, x: number) => {
  const u = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return u * u * (3 - 2 * u);
};
const wrap = (x: number, lo: number, hi: number) => lo + ((((x - lo) % (hi - lo)) + (hi - lo)) % (hi - lo));

/**
 * A plaster-white air particle: unlit and a touch brighter than lit plaster, so it reads as
 * dust catching the light (never blooms: no `glow` flag).
 */
const moteMaterial = (opacity: number) => {
  const m = new THREE.MeshBasicMaterial({
    color: raw(theme.plasterGlass),
    transparent: true,
    depthWrite: false,
    opacity,
  });
  m.color.multiplyScalar(1.35);
  return m;
};
const MOTE = new THREE.SphereGeometry(1, 8, 6);

/**
 * Dust motes drifting slowly in a spot light's beam: seeded positions inside `box`, a slow fall
 * and sway, wrapping top to bottom; each mote shows only while it is inside the cone (it fades
 * at the beam's edge), so they follow the light if it drifts.
 */
export const DustMotes: React.FC<{
  /** The light's position and where it points. */
  from: V3;
  to: V3;
  /** Cone half-angle of the beam (radians; MuseumLights' key is 0.5). */
  angle?: number;
  /** Where motes live: [min corner, max corner] in world units. */
  box?: [V3, V3];
  count?: number;
  /** Mote radius in world units. */
  size?: number;
  opacity?: number;
  seed?: string;
  /** Seconds added to the scene time (the scene's start in the video, for continuity across cuts). */
  clockOffset?: number;
}> = ({
  from,
  to,
  angle = 0.5,
  box = [
    [-1.5, 0.5, -0.6],
    [1.5, 2.7, 1.8],
  ],
  count = 40,
  size = 0.0065,
  opacity = 0.42,
  seed = 'dust',
  clockOffset = 0,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps + clockOffset;
  const material = useMemo(() => moteMaterial(opacity), [opacity]);
  useEffect(() => () => material.dispose(), [material]);
  const motes = useMemo(
    () =>
      new Array(count).fill(0).map((_, i) => {
        const r = (k: string) => random(`${seed}-${k}-${i}`);
        return {
          p: [r('x'), r('y'), r('z')],
          fall: 0.012 + 0.02 * r('f'),
          sway: 0.04 + 0.05 * r('s'),
          period: 7 + 8 * r('p'),
          ph: r('ph') * Math.PI * 2,
          scale: 0.6 + 0.8 * r('k'),
        };
      }),
    [count, seed],
  );
  const [lo, hi] = box;
  const L = new THREE.Vector3(...from);
  const axis = new THREE.Vector3(...to).sub(L).normalize();
  const cosEdge = Math.cos(angle * 0.95);
  const cosIn = Math.cos(angle * 0.6);
  const v = new THREE.Vector3();
  return (
    <group>
      {motes.map((m, i) => {
        const w = (Math.PI * 2 * t) / m.period + m.ph;
        const x = lo[0] + m.p[0] * (hi[0] - lo[0]) + m.sway * Math.sin(w);
        const y = wrap(lo[1] + m.p[1] * (hi[1] - lo[1]) - m.fall * t, lo[1], hi[1]);
        const z = lo[2] + m.p[2] * (hi[2] - lo[2]) + m.sway * 0.7 * Math.cos(w * 0.8);
        v.set(x, y, z).sub(L).normalize();
        const inBeam = smooth(cosEdge, cosIn, v.dot(axis));
        // fade in and out at the top and bottom of the box, so wrapping never pops
        const ends = smooth(lo[1], lo[1] + 0.25, y) * (1 - smooth(hi[1] - 0.25, hi[1], y));
        const s = size * m.scale * inBeam * ends;
        return <mesh key={i} geometry={MOTE} material={material} position={[x, y, z]} scale={s} visible={s > 1e-4} />;
      })}
    </group>
  );
};

/**
 * Steam rising from a cup: soft white wisps that rise, widen, sway and fade, in a slow loop.
 * The planes face +z (the museum cameras are always in front).
 */
export const Steam: React.FC<{
  /** Where the steam leaves the cup (centre of the rim). */
  position: V3;
  /** Number of wisps alive at once. */
  count?: number;
  /** Seconds a wisp lives. */
  life?: number;
  /** Rise over a wisp's life (units). */
  rise?: number;
  opacity?: number;
  clockOffset?: number;
}> = ({position, count = 7, life = 3.6, rise = 0.32, opacity = 0.2, clockOffset = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps + clockOffset;
  const mats = useMemo(
    () =>
      new Array(count).fill(0).map(() => {
        const m = new THREE.MeshBasicMaterial({
          map: softTexture(),
          color: raw(theme.plasterGlass),
          transparent: true,
          depthWrite: false,
          opacity: 0,
        });
        m.color.multiplyScalar(1.3);
        return m;
      }),
    [count],
  );
  useEffect(() => () => mats.forEach((m) => m.dispose()), [mats]);
  return (
    <group position={position}>
      {mats.map((m, i) => {
        const u = (((t / life + i / count) % 1) + 1) % 1;
        const n = Math.floor(t / life + i / count);
        const jitter = random(`steam-${i}-${n}`) - 0.5;
        const y = 0.02 + rise * u;
        const x = 0.025 * jitter + 0.03 * Math.sin(u * 5 + i * 1.7) * u;
        const s = 0.05 + 0.13 * u;
        m.opacity = opacity * smooth(0, 0.2, u) * (1 - smooth(0.45, 1, u));
        return (
          <mesh key={i} material={m} position={[x, y, 0.01 * i]} scale={[s, s * 1.3, 1]} renderOrder={4}>
            <planeGeometry args={[1, 1]} />
          </mesh>
        );
      })}
    </group>
  );
};
