import React, {useMemo} from 'react';
import * as THREE from 'three';
import {theme} from '../theme';
import {BlobShadow, PlasterBox} from './MuseumStage';
import {OrangeLight, OrangeWash} from './OrangePath';
import {plaster, raw} from './plaster';
import {WallPlate} from './WallPlate';

type V3 = [number, number, number];

// Positions other parts need (paths start/end here). Mannequins sit at SEATS.
export const ROOM = {
  seats: [
    [-0.58, 0, -0.3],
    [0.58, 0, -0.3],
  ] as V3[],
  /** Router body centre on the wall shelf. */
  router: [0, 1.825, -0.8] as V3,
  /** Wall surface z (front face of the wall slab). */
  wallZ: -0.93,
};

const Cylinder: React.FC<{p: V3; args: [number, number, number, number]; color?: string}> = ({p, args, color}) => (
  <mesh position={p} material={plaster(color)} castShadow receiveShadow>
    <cylinderGeometry args={args} />
  </mesh>
);

/**
 * Plaster living room on a museum plinth: couch with cushions, coffee table,
 * rug, wall shelf with the router, and the exhibit's wall plate (left of the
 * shelf). No people (add Mannequins at ROOM.seats).
 */
export const LivingRoom: React.FC<{
  /** Router status LED, 0–1 (orange, blooms). */
  led?: number;
  /** Orange wash spreading on the wall behind the router, 0–1. Persistent stain. */
  wash?: number;
  /** Wall plate text. Omit for a bare wall. */
  plate?: {number: string; title: string};
}> = ({led = 0, wash = 0, plate}) => {
  const ledMat = useMemo(
    () => new THREE.MeshBasicMaterial({color: raw(theme.orange), transparent: true, opacity: 0}),
    [],
  );
  ledMat.opacity = Math.max(0, Math.min(1, led));
  const [rx, ry, rz] = ROOM.router;

  return (
    <group>
      {/* couch */}
      {/* (bevel segments 5: the camera gets close to these, 3 reads faceted) */}
      <PlasterBox size={[2.5, 0.42, 1.0]} radius={0.08} position={[0, 0.21, -0.35]} segments={5} />
      <PlasterBox size={[2.5, 0.78, 0.26]} radius={0.08} position={[0, 0.75, -0.75]} segments={5} />
      {[-1, 1].map((s) => (
        <group key={s}>
          <PlasterBox size={[0.26, 0.66, 1.0]} radius={0.08} position={[s * 1.25, 0.33, -0.35]} segments={5} />
          <PlasterBox size={[1.14, 0.16, 0.86]} radius={0.06} position={[s * 0.59, 0.49, -0.3]} segments={5} />
          <PlasterBox size={[1.14, 0.62, 0.16]} radius={0.06} position={[s * 0.59, 0.94, -0.58]} segments={5} />
        </group>
      ))}

      {/* coffee table, cup, book */}
      <PlasterBox size={[1.5, 0.06, 0.66]} radius={0.02} position={[0, 0.44, 0.95]} />
      {[-0.66, 0.66].flatMap((x) =>
        [0.7, 1.2].map((z) => <Cylinder key={`${x}${z}`} p={[x, 0.205, z]} args={[0.025, 0.02, 0.41, 10]} />),
      )}
      <Cylinder p={[-0.4, 0.53, 0.9]} args={[0.06, 0.05, 0.12, 20]} />
      <PlasterBox size={[0.3, 0.04, 0.22]} radius={0.01} position={[0.35, 0.49, 1.0]} rotation={[0, 0.3, 0]} />

      {/* rug */}
      <Cylinder p={[0, 0.006, 0.3]} args={[1.7, 1.7, 0.012, 48]} />

      {/* wall shelf + router */}
      <PlasterBox size={[0.95, 0.05, 0.28]} radius={0.01} position={[0, 1.75, -0.8]} />
      <PlasterBox size={[0.46, 0.1, 0.2]} radius={0.03} position={ROOM.router} />
      {[-0.16, 0.16].map((x) => (
        <Cylinder key={x} p={[x, 2.02, -0.86]} args={[0.012, 0.012, 0.3, 8]} />
      ))}
      <mesh position={[rx, ry + 0.005, rz + 0.101]} material={ledMat} userData={{glow: true}} visible={led > 0.001}>
        <planeGeometry args={[0.3, 0.025]} />
      </mesh>
      <OrangeLight position={[rx, ry + 0.15, rz + 0.35]} intensity={1.3 * led} reach={2.8} />
      <OrangeWash position={[rx, ry + 0.2, ROOM.wallZ + 0.005]} size={[2.4, 1.8]} amount={wash} strength={0.4} />

      {/* wall plate: left, at shelf height. The guide's seated-eye spot is behind the couch here;
          this spot stays clear of the stain and inside the 'push' framing. */}
      {plate ? (
        <WallPlate number={plate.number} title={plate.title} position={[-0.96, 1.95, ROOM.wallZ]} size={[0.44, 0.24]} />
      ) : null}

      {/* contact shadows */}
      <BlobShadow position={[0, 0.016, -0.3]} size={[3.4, 2.0]} opacity={0.55} />
      <BlobShadow position={[0, 0.016, 0.95]} size={[2.1, 1.2]} opacity={0.44} />
    </group>
  );
};
