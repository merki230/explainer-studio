import React, {useMemo} from 'react';
import * as THREE from 'three';
import {theme} from '../theme';
import {BlobShadow, PlasterBox} from './MuseumStage';
import {OrangeLight, OrangeWash} from './OrangePath';
import {plaster, raw, roundedBox} from './plaster';
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
  /**
   * Wall plate spots [x, y] on the wall face, in order of preference: left of the shelf at
   * shelf height (the standard; inside x 120–888 on wide shots), then upper left, above the
   * route's left arch (for close cameras, where the standard spot falls off the left of the
   * frame). Both stay clear of the route's stain.
   */
  plateSpots: [
    [-0.87, 1.95],
    [-0.68, 2.3],
  ] as [number, number][],
  plateSize: [0.4, 0.22] as [number, number],
  /** Laptop on the coffee table in front of seat B: the hinge centre (base top, back edge). */
  laptop: [0.36, 0.488, 0.9] as V3,
  /** Wall surface z (front face of the wall slab). */
  wallZ: -0.93,
};

const Cylinder: React.FC<{p: V3; args: [number, number, number, number]; color?: string}> = ({p, args, color}) => (
  <mesh position={p} material={plaster(color)} castShadow receiveShadow>
    <cylinderGeometry args={args} />
  </mesh>
);

const LAPTOP = {w: 0.36, d: 0.24, base: 0.018, lid: 0.23, open: 0.36, yaw: -0.18};

/**
 * Plaster laptop, lid open a little past upright, the screen facing the camera.
 * Origin at the hinge centre. `screen` 0–1 lights it orange (with a little bleed).
 */
const Laptop: React.FC<{screen: number; material: THREE.Material}> = ({screen, material}) => {
  const screenMat = useMemo(
    () => new THREE.MeshBasicMaterial({color: raw(theme.orange), transparent: true, opacity: 0, depthWrite: false}),
    [],
  );
  const s = Math.max(0, Math.min(1, screen));
  screenMat.opacity = s;
  return (
    <group>
      <mesh
        geometry={roundedBox(LAPTOP.w, LAPTOP.base, LAPTOP.d, 0.006)}
        material={material}
        position={[0, -LAPTOP.base / 2, LAPTOP.d / 2]}
        castShadow
        receiveShadow
      />
      {/* keyboard well */}
      <PlasterBox
        size={[LAPTOP.w - 0.05, 0.004, LAPTOP.d * 0.42]}
        radius={0.0015}
        position={[0, 0.0005, LAPTOP.d * 0.3]}
        color={theme.plasterShade}
      />
      <group rotation={[-LAPTOP.open, 0, 0]}>
        <mesh
          geometry={roundedBox(LAPTOP.w, LAPTOP.lid, 0.012, 0.005)}
          material={material}
          position={[0, LAPTOP.lid / 2, -0.006]}
          castShadow
          receiveShadow
        />
        <mesh
          geometry={roundedBox(LAPTOP.w - 0.03, LAPTOP.lid - 0.03, 0.004, 0.0015)}
          material={plaster(theme.plasterGlass, 0.7)}
          position={[0, LAPTOP.lid / 2 + 0.004, 0.0005]}
          receiveShadow
        />
        <mesh
          position={[0, LAPTOP.lid / 2 + 0.004, 0.003]}
          material={screenMat}
          userData={{glow: true}}
          visible={s > 0.001}
        >
          <planeGeometry args={[LAPTOP.w - 0.034, LAPTOP.lid - 0.034]} />
        </mesh>
        <OrangeLight position={[0, LAPTOP.lid / 2, 0.3]} intensity={0.3 * s} reach={1.2} />
      </group>
    </group>
  );
};

/**
 * Plaster living room on a museum plinth: couch with cushions, coffee table
 * (cup, laptop), rug, wall shelf with the router, and the exhibit's wall plate
 * (upper left, clear of the route and its stain). No people (add Mannequins at ROOM.seats).
 */
export const LivingRoom: React.FC<{
  /** Router status LED, 0–1 (orange, blooms). */
  led?: number;
  /** Orange wash spreading on the wall behind the router, 0–1. Persistent stain. */
  wash?: number;
  /**
   * "One home": 0–1 brightens the router's light and the wall wash on top of `led`/`wash`
   * (+35% bleed, wash 0.40 → 0.50, LED strip grows). Never dims them: stains stay.
   */
  household?: number;
  /** Laptop screen, 0–1 (orange, blooms, small bleed). Null hides the laptop. */
  laptop?: number | null;
  /** Wall plate text. Omit for a bare wall. */
  plate?: {number: string; title: string};
  /** Where the plate hangs [x, y] on the wall face. Default: the first of ROOM.plateSpots. */
  plateAt?: [number, number];
}> = ({led = 0, wash = 0, household = 0, laptop = 0, plate, plateAt = ROOM.plateSpots[0]}) => {
  const ledMat = useMemo(
    () => new THREE.MeshBasicMaterial({color: raw(theme.orange), transparent: true, opacity: 0}),
    [],
  );
  ledMat.opacity = Math.max(0, Math.min(1, led));
  const h = Math.max(0, Math.min(1, household));
  const [rx, ry, rz] = ROOM.router;
  const [lx, ly, lz] = ROOM.laptop;

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
      {laptop === null ? null : (
        <group position={[lx, ly, lz]} rotation={[0, LAPTOP.yaw, 0]}>
          <Laptop screen={laptop} material={plaster()} />
        </group>
      )}

      {/* rug */}
      <Cylinder p={[0, 0.006, 0.3]} args={[1.7, 1.7, 0.012, 48]} />

      {/* wall shelf + router */}
      <PlasterBox size={[0.95, 0.05, 0.28]} radius={0.01} position={[0, 1.75, -0.8]} />
      <PlasterBox size={[0.46, 0.1, 0.2]} radius={0.03} position={ROOM.router} />
      {[-0.16, 0.16].map((x) => (
        <Cylinder key={x} p={[x, 2.02, -0.86]} args={[0.012, 0.012, 0.3, 8]} />
      ))}
      <mesh
        position={[rx, ry + 0.005, rz + 0.101]}
        scale={[1 + 0.12 * h, 1 + 0.5 * h, 1]}
        material={ledMat}
        userData={{glow: true}}
        visible={led > 0.001}
      >
        <planeGeometry args={[0.3, 0.025]} />
      </mesh>
      <OrangeLight position={[rx, ry + 0.15, rz + 0.35]} intensity={1.3 * led * (1 + 0.35 * h)} reach={2.8} />
      <OrangeWash
        position={[rx, ry + 0.2, ROOM.wallZ + 0.005]}
        size={[2.4, 1.8]}
        amount={wash}
        strength={0.4 * (1 + 0.25 * h)}
      />

      {/* wall plate (see ROOM.plateSpots) */}
      {plate ? (
        <WallPlate
          number={plate.number}
          title={plate.title}
          position={[plateAt[0], plateAt[1], ROOM.wallZ]}
          size={ROOM.plateSize}
        />
      ) : null}

      {/* contact shadows */}
      <BlobShadow position={[0, 0.016, -0.3]} size={[3.4, 2.0]} opacity={0.55} />
      <BlobShadow position={[0, 0.016, 0.95]} size={[2.1, 1.2]} opacity={0.44} />
    </group>
  );
};
