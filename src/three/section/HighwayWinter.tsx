import React, {useMemo} from 'react';
import {useThree} from '@react-three/fiber';
import {random} from 'remotion';
import * as THREE from 'three';
import {WINTER} from '../../theme';
import {raw} from '../plaster';

/*
 * No. 017 (N8): the car slice's highway in its winter dressing (`SlicedCar` `road: 'highway'`, `dressing: 'winter'`; the
 * twin highway of `city-twin`). On the block (x along the road, ±`half`; the near cut at z 0.8, the back at z −4.2; the
 * car's lane z −1.83 → 0.8, the dashes at z −1.83, the other lane behind): packed snow along the far edge with a
 * snowbank riding the road, slush in the wheel paths, and packed-snow streaks riding the road so the drive reads. All
 * `WINTER` tokens, nothing the system. Everything that rides is clipped to the block's ends.
 */

/** Things that repeat along the road and ride it: their x now and a stable id. */
const riding = (scroll: number, period: number, from: number, to: number, pad: number) => {
  const out: {x: number; id: number}[] = [];
  for (let n = Math.floor((from - pad - scroll) / period); n <= Math.ceil((to + pad - scroll) / period); n++) out.push({x: scroll + n * period, id: n});
  return out;
};

export const HIGHWAY_WINTER = {
  /** The far edge: packed snow from the block's back to here, the bank's line. */
  edge: -3.45,
  back: -4.2,
  bankZ: -3.95,
  /** Wheel paths (z centres) and their width. */
  paths: [-2.86, -0.8, 0.62] as number[],
  pathW: 0.34,
};

export const HighwayWinter: React.FC<{scroll: number; half: number}> = ({scroll, half}) => {
  const gl = useThree((s) => s.gl);
  gl.localClippingEnabled = true;
  const planes = useMemo(() => [new THREE.Plane(new THREE.Vector3(1, 0, 0), half), new THREE.Plane(new THREE.Vector3(-1, 0, 0), half)], [half]);
  const mats = useMemo(
    () => ({
      snow: new THREE.MeshStandardMaterial({color: raw(WINTER.snow), roughness: 0.95, clippingPlanes: planes}),
      snowShade: new THREE.MeshStandardMaterial({color: raw(WINTER.snowShade), roughness: 0.95, clippingPlanes: planes}),
      packed: new THREE.MeshStandardMaterial({color: raw(WINTER.packed), roughness: 0.9, clippingPlanes: planes, polygonOffset: true, polygonOffsetFactor: -2}),
      streak: new THREE.MeshStandardMaterial({
        color: raw(WINTER.packed),
        roughness: 0.9,
        transparent: true,
        opacity: 0.7,
        depthWrite: false,
        clippingPlanes: planes,
        polygonOffset: true,
        polygonOffsetFactor: -3,
      }),
      slush: new THREE.MeshStandardMaterial({
        color: raw(WINTER.slush),
        roughness: 0.35,
        transparent: true,
        opacity: 0.55,
        depthWrite: false,
        clippingPlanes: planes,
        polygonOffset: true,
        polygonOffsetFactor: -2,
      }),
    }),
    [planes],
  );
  const W = HIGHWAY_WINTER;
  return (
    <group>
      {/* packed snow along the far edge */}
      <mesh material={mats.packed} position={[0, 0.003, (W.edge + W.back) / 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[2 * half, W.edge - W.back]} />
      </mesh>
      {/* slush in the wheel paths */}
      {W.paths.map((z) => (
        <mesh key={z} material={mats.slush} position={[0, 0.004, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2 * half, W.pathW]} />
        </mesh>
      ))}
      {/* the snowbank: lumps along the far edge, riding the road */}
      {riding(scroll, 1.3, -half, half, 1.5).map(({x, id}) => {
        const r = (k: string) => random(`hw-bank-${id}-${k}`);
        return (
          <mesh
            key={`b${id}`}
            material={r('s') > 0.5 ? mats.snow : mats.snowShade}
            position={[x, 0.04, W.bankZ + 0.1 * r('z')]}
            scale={[0.85 + 0.5 * r('l'), 0.28 + 0.2 * r('h'), 0.34 + 0.08 * r('w')]}
            castShadow
            receiveShadow
          >
            <sphereGeometry args={[1, 16, 10]} />
          </mesh>
        );
      })}
      {/* packed-snow streaks between the wheel paths and along the lane line, riding the road (the drive reads) */}
      {riding(scroll, 3.7, -half, half, 3).map(({x, id}) => {
        const r = (k: string) => random(`hw-streak-${id}-${k}`);
        const lanes = [-1.83, -0.05, -3.3];
        const z = lanes[Math.floor(r('lane') * lanes.length) % lanes.length] + (r('z') - 0.5) * 0.3;
        return (
          <mesh key={`s${id}`} material={mats.streak} position={[x, 0.005, z]} rotation={[-Math.PI / 2, 0, 0.04 * (r('a') - 0.5)]}>
            <planeGeometry args={[0.9 + 1.8 * r('l'), 0.14 + 0.16 * r('w')]} />
          </mesh>
        );
      })}
    </group>
  );
};
