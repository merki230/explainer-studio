import React, {useMemo} from 'react';
import * as THREE from 'three';
import {MOODS, section, type Mood} from '../../theme';
import {BlobShadow} from '../MuseumStage';
import {plaster as matte, raw, roundedBox} from '../plaster';
import {CutOutline, cutMaterial, type Rect} from './cutLook';
import {skyTexture, windowTexture} from './textures';

type V3 = [number, number, number];

const W = 3.4;
const D = 2.4;
const X0 = -W / 2;
const Z0 = -1.1;
const WALL_H = 2.7;
const WALL_T = 0.18;
const GROUND = 2.2;

/**
 * The living-room slice's layout (style guide v0.8 § 3): a block 3.4 wide × 2.4 deep, cut on its
 * front (+z) and right (+x); back and left walls standing, cut on top and at the front edge.
 * Positions other parts need (seats, router, cup, lamp) live here.
 */
export const SLICE = {
  width: W,
  depth: D,
  /** Left inner wall face x, back inner wall face z, front cut face z. */
  x0: X0,
  z0: Z0,
  z1: Z0 + D,
  wallHeight: WALL_H,
  wallThickness: WALL_T,
  groundDepth: GROUND,
  /** Where seated figures go: left seat (FRIEND in the pilot), right seat (YOU). */
  seats: [
    [-0.58, 0, -0.5],
    [0.58, 0, -0.5],
  ] as V3[],
  /** Router body centre on the shelf (0.56 × 0.13 × 0.24: big enough to read from the wide shot). */
  router: [0.7, 1.84, Z0 + 0.15] as V3,
  /** Router status LED (front face, right of the vent). */
  led: [0.92, 1.85, Z0 + 0.272] as V3,
  cup: [-0.35, 0.59, 0.55] as V3,
  table: [0, 0.44, 0.6] as V3,
  /** The floor lamp's base; its light sits at lampLight. */
  lamp: [-1.45, 0, -0.85] as V3,
  lampLight: [-1.45, 1.3, -0.75] as V3,
  /** Window centre on the back wall's inner face, and its size. */
  window: [-1.0, 1.95, Z0 + 0.005] as V3,
  windowSize: [1.3, 0.95] as [number, number],
  /** House plant on the floor, front left (in frame at the wide framing). */
  plant: [-1.42, 0, 0.45] as V3,
};

/** The cut faces' outlines: ground front and right faces, wall ends, and the L-shaped wall top. */
const CUT_RECTS: Rect[] = [
  [
    [X0, -GROUND, Z0 + D],
    [-X0, 0, Z0 + D],
  ],
  [
    [-X0, -GROUND, Z0],
    [-X0, 0, Z0 + D],
  ],
  [
    [-X0, 0, Z0 - WALL_T],
    [-X0, WALL_H, Z0],
  ],
  [
    [X0 - WALL_T, 0, Z0 + D],
    [X0, WALL_H, Z0 + D],
  ],
];
const TOP: V3[] = [
  [X0 - WALL_T, WALL_H, Z0 - WALL_T],
  [-X0, WALL_H, Z0 - WALL_T],
  [-X0, WALL_H, Z0],
  [X0, WALL_H, Z0],
  [X0, WALL_H, Z0 + D],
  [X0 - WALL_T, WALL_H, Z0 + D],
];
const CUT_EDGES: [V3, V3][] = TOP.map((p, i) => [p, TOP[(i + 1) % TOP.length]]);

/** Leaf clusters of the plant: [x, y, z, radius, darker]. Fixed, so the plant is the same everywhere. */
const PLANT: [number, number, number, number, boolean][] = [
  [0, 0.48, 0, 0.17, false],
  [-0.1, 0.62, 0.04, 0.12, true],
  [0.09, 0.66, -0.03, 0.13, false],
  [0.02, 0.8, 0.02, 0.1, true],
  [0.12, 0.45, 0.09, 0.1, true],
];

const Box: React.FC<{
  size: V3;
  position: V3;
  color: string;
  radius?: number;
  roughness?: number;
  segments?: number;
}> = ({size, position, color, radius, roughness = 0.9, segments}) => (
  <mesh
    geometry={roundedBox(size[0], size[1], size[2], radius ?? Math.min(...size) * 0.06, segments)}
    material={matte(color, roughness)}
    position={position}
    castShadow
    receiveShadow
  />
);

const Cyl: React.FC<{p: V3; args: [number, number, number, number]; color: string; roughness?: number}> = ({
  p,
  args,
  color,
  roughness = 0.7,
}) => (
  <mesh position={p} material={matte(color, roughness)} castShadow receiveShadow>
    <cylinderGeometry args={args} />
  </mesh>
);

export type LivingRoomSliceProps = {
  mood: Mood;
  /** Router LED in the system's orange, 0–1 (blooms). 0: a dark idle LED. */
  led?: number;
  /** Lamp level (Night): the shade's glow follows it (the scene breathes it ±3%). */
  lamp?: number;
  /** Laptop on the coffee table, lid open toward the couch (its screen faces the people, not the camera). */
  laptop?: boolean;
};

/**
 * A living room cut open (style guide v0.8 § 3): ground block (floor on top, cut faces front and
 * right), back and left walls cut on top and at the front, a window, the couch, the coffee table
 * with a cup, the shelf with the router, and a floor lamp (lit in Night). The sky backdrop sits
 * far behind. No people (add `Figure`s at SLICE.seats).
 */
export const LivingRoomSlice: React.FC<LivingRoomSliceProps> = ({mood, led = 0, lamp = 1, laptop = false}) => {
  const m = MOODS[mood];
  const mats = useMemo(() => {
    const cut = cutMaterial();
    const earth = new THREE.MeshStandardMaterial({color: raw(m.earth), roughness: 1});
    const floor = new THREE.MeshStandardMaterial({color: raw(m.floor), roughness: 0.95});
    // The inner wall faces get their own material: the X-ray (stage 2) fades them.
    const wall = new THREE.MeshStandardMaterial({color: raw(m.wall), roughness: 0.95, transparent: true});
    const wallOut = new THREE.MeshStandardMaterial({color: raw(m.wall), roughness: 0.95});
    // Pictures, not lit surfaces: undo the mood's post exposure so they show as authored.
    const sky = new THREE.MeshBasicMaterial({map: skyTexture(mood), fog: false});
    const view = new THREE.MeshBasicMaterial({map: windowTexture(mood), fog: false});
    sky.color.setScalar(1 / m.exposure);
    view.color.setScalar(1 / m.exposure);
    const ledMat = new THREE.MeshBasicMaterial({color: raw(section.orange), transparent: true, opacity: 0});
    const shade = new THREE.MeshStandardMaterial({
      color: raw(m.shade),
      emissive: raw(MOODS.night.lamp!.glow),
      emissiveIntensity: 0,
      roughness: 0.9,
      side: THREE.DoubleSide,
    });
    return {cut, earth, floor, wall, wallOut, sky, view, ledMat, shade};
  }, [m, mood]);
  const l = Math.max(0, Math.min(1, led));
  mats.ledMat.opacity = l;
  // × 0.12 on a warm shade colour: at the spec's 0.8 the lit shade clipped to pure white under the
  // Night exposure; now it reads as a warm off-white glow
  mats.shade.emissiveIntensity = m.lamp ? m.lamp.glowIntensity * 0.12 * lamp : 0;

  const {cut, earth, floor, wall, wallOut} = mats;
  const cz = -0.55; // couch
  const [rx, ry, rz] = SLICE.router;
  const [wx, wy, wz] = SLICE.window;
  const [ww, wh] = SLICE.windowSize;
  const [lx, , lz] = SLICE.lamp;
  const trim = m.trim;

  return (
    <group>
      {/* sky backdrop, far behind */}
      <mesh position={[0, 6, -9]} material={mats.sky}>
        <planeGeometry args={[40, 30]} />
      </mesh>

      {/* ground block: the floor on top, cut faces on the front (+z) and right (+x) */}
      <mesh position={[0, -GROUND / 2, Z0 + D / 2]} material={[cut, earth, floor, earth, cut, earth]} receiveShadow>
        <boxGeometry args={[W, GROUND, D]} />
      </mesh>
      {/* back wall (+x end and top cut) and left wall (front end and top cut) */}
      <mesh
        position={[0, WALL_H / 2, Z0 - WALL_T / 2]}
        material={[cut, cut, cut, cut, wall, wallOut]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[W, WALL_H, WALL_T]} />
      </mesh>
      <mesh
        position={[X0 - WALL_T / 2, WALL_H / 2, Z0 + D / 2 - WALL_T / 2]}
        material={[wall, wallOut, cut, cut, cut, cut]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[WALL_T, WALL_H, D + WALL_T]} />
      </mesh>

      {/* window: the view, a trim frame and a sill */}
      <mesh position={[wx, wy, wz]} material={mats.view}>
        <planeGeometry args={[ww, wh]} />
      </mesh>
      <Box size={[ww + 0.08, 0.04, 0.04]} position={[wx, wy + wh / 2 + 0.02, wz + 0.02]} color={trim} roughness={0.8} />
      <Box
        size={[ww + 0.14, 0.04, 0.09]}
        position={[wx, wy - wh / 2 - 0.02, wz + 0.045]}
        color={trim}
        roughness={0.8}
      />
      {[-1, 1].map((s) => (
        <Box
          key={s}
          size={[0.04, wh, 0.04]}
          position={[wx + (s * (ww + 0.04)) / 2, wy, wz + 0.02]}
          color={trim}
          roughness={0.8}
        />
      ))}
      <Box size={[0.025, wh, 0.025]} position={[wx, wy, wz + 0.013]} color={trim} roughness={0.8} />

      {/* couch */}
      <Box size={[2.5, 0.42, 1.0]} radius={0.08} position={[0, 0.21, cz]} color={m.soft} segments={8} />
      <Box size={[2.5, 0.78, 0.26]} radius={0.08} position={[0, 0.75, cz - 0.4]} color={m.soft} segments={8} />
      {[-1, 1].map((s) => (
        <group key={s}>
          <Box size={[0.26, 0.66, 1.0]} radius={0.08} position={[s * 1.25, 0.33, cz]} color={m.soft} segments={8} />
          <Box
            size={[1.14, 0.16, 0.86]}
            radius={0.06}
            position={[s * 0.59, 0.49, cz + 0.05]}
            color={m.softLight}
            segments={8}
          />
          <Box
            size={[1.14, 0.6, 0.16]}
            radius={0.06}
            position={[s * 0.59, 0.93, cz - 0.23]}
            color={m.softLight}
            segments={8}
          />
        </group>
      ))}

      {/* coffee table, cup, laptop */}
      <Box size={[1.4, 0.06, 0.6]} radius={0.02} position={SLICE.table} color={m.wood} roughness={0.7} />
      {[-0.6, 0.6].flatMap((x) =>
        [0.38, 0.82].map((z) => (
          <Cyl key={`${x}${z}`} p={[x, 0.205, z]} args={[0.025, 0.02, 0.41, 10]} color={m.wood} />
        )),
      )}
      <Cyl p={[SLICE.cup[0], 0.53, SLICE.cup[2]]} args={[0.06, 0.05, 0.12, 20]} color={m.ceramic} roughness={0.6} />
      {laptop ? (
        <group position={[0.3, 0.47, 0.72]} rotation={[0, Math.PI, 0]}>
          <Box size={[0.36, 0.018, 0.24]} radius={0.006} position={[0, 0.009, 0.12]} color={m.device} roughness={0.4} />
          <group rotation={[-0.32, 0, 0]}>
            <Box
              size={[0.36, 0.23, 0.012]}
              radius={0.005}
              position={[0, 0.115, -0.006]}
              color={m.device}
              roughness={0.4}
            />
          </group>
        </group>
      ) : null}

      {/* shelf, router (vent slot, antennas, status LED: dark until the system is active) */}
      <Box size={[0.95, 0.05, 0.3]} radius={0.01} position={[rx, 1.75, Z0 + 0.15]} color={m.shelf} roughness={1} />
      <Box size={[0.56, 0.13, 0.24]} radius={0.035} position={SLICE.router} color={m.appliance} roughness={1} />
      {[-0.2, 0.2].map((x) => (
        <Cyl
          key={x}
          p={[rx + x, 2.08, rz - 0.07]}
          args={[0.014, 0.014, 0.36, 8]}
          color={m.appliance}
          roughness={0.85}
        />
      ))}
      <Box
        size={[0.3, 0.02, 0.004]}
        radius={0.0015}
        position={[rx - 0.06, ry, rz + 0.121]}
        color={m.device}
        roughness={0.5}
      />
      <mesh position={SLICE.led} material={matte(section.ledOff, 0.5)}>
        <circleGeometry args={[0.014, 16]} />
      </mesh>
      <mesh
        position={[SLICE.led[0], SLICE.led[1], SLICE.led[2] + 0.001]}
        material={mats.ledMat}
        userData={{glow: true}}
        visible={l > 0.001}
      >
        <circleGeometry args={[0.016, 16]} />
      </mesh>

      {/* lived-in: a rug under the table, a plant right of the couch */}
      <Box size={[2.1, 0.012, 1.25]} radius={0.005} position={[0, 0.006, 0.55]} color={m.rug} roughness={1} />
      <group position={SLICE.plant}>
        <Cyl p={[0, 0.16, 0]} args={[0.13, 0.1, 0.32, 20]} color={section.pot} roughness={0.8} />
        {PLANT.map(([x, y, z, r, dark], i) => (
          <mesh
            key={i}
            position={[x, y, z]}
            material={matte(dark ? section.leafDark : section.leaf, 0.85)}
            castShadow
            receiveShadow
          >
            <sphereGeometry args={[r, 14, 10]} />
          </mesh>
        ))}
      </group>

      {/* floor lamp (lit in Night) */}
      <Cyl p={[lx, 0.015, lz]} args={[0.14, 0.15, 0.03, 24]} color={m.device} roughness={0.5} />
      <Cyl p={[lx, 0.65, lz]} args={[0.02, 0.02, 1.3, 8]} color={m.device} roughness={0.5} />
      <mesh position={[lx, 1.38, lz]} material={mats.shade} castShadow>
        <cylinderGeometry args={[0.16, 0.24, 0.26, 24, 1, true]} />
      </mesh>

      {/* the architect's-section look: ink along every cut edge (the hatch is in the cut material) */}
      <CutOutline rects={CUT_RECTS} edges={CUT_EDGES} />

      {/* contact shadows */}
      <BlobShadow position={[0, 0.004, cz]} size={[3.0, 1.5]} opacity={0.35} />
      <BlobShadow position={[0, 0.004, 0.6]} size={[1.8, 1.0]} opacity={0.28} />
    </group>
  );
};
