import React, {useMemo} from 'react';
import * as THREE from 'three';
import {theme} from '../theme';

type V3 = [number, number, number];

const TUBULAR = 80;
const RADIAL = 8;

/**
 * Simple arc that draws itself from `from` to `to` as `progress` goes 0 → 1.
 * No bloom or stain: inside a MuseumStage use OrangePath instead.
 */
export const Arc: React.FC<{
  from: V3;
  to: V3;
  lift?: number;
  progress: number;
  radius?: number;
  color?: string;
  /** Show a bright packet travelling along the arc. */
  packet?: number;
}> = ({from, to, lift = 0.8, progress, radius = 0.014, color = theme.orange, packet}) => {
  const {curve, geometry} = useMemo(() => {
    const a = new THREE.Vector3(...from);
    const b = new THREE.Vector3(...to);
    const mid = a.clone().add(b).multiplyScalar(0.5);
    mid.y += lift;
    const c = new THREE.QuadraticBezierCurve3(a, mid, b);
    return {curve: c, geometry: new THREE.TubeGeometry(c, TUBULAR, radius, RADIAL, false)};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from.join(), to.join(), lift, radius]);

  const p = Math.min(1, Math.max(0, progress));
  // Each tubular segment is RADIAL quads = RADIAL * 6 indices.
  geometry.setDrawRange(0, Math.floor(TUBULAR * p) * RADIAL * 6);

  const head = curve.getPoint(packet ?? p);
  const showHead = packet !== undefined || (p > 0 && p < 1);

  return (
    <group>
      <mesh geometry={geometry}>
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      {showHead ? (
        <mesh position={head}>
          <sphereGeometry args={[radius * 3.2, 16, 16]} />
          <meshBasicMaterial color={theme.orangeDot} toneMapped={false} />
        </mesh>
      ) : null}
    </group>
  );
};

/** Expanding rings, e.g. around a router. `t` is seconds. */
export const Ripple: React.FC<{position: V3; t: number; color?: string; size?: number}> = ({
  position,
  t,
  color = theme.orange,
  size = 0.5,
}) => (
  <group position={position} rotation={[-Math.PI / 2, 0, 0]}>
    {[0, 0.5].map((offset) => {
      const c = (t * 0.8 + offset) % 1;
      return (
        <mesh key={offset} scale={0.2 + c * size * 2}>
          <ringGeometry args={[0.46, 0.5, 64]} />
          <meshBasicMaterial color={color} transparent opacity={1 - c} toneMapped={false} side={THREE.DoubleSide} />
        </mesh>
      );
    })}
  </group>
);
