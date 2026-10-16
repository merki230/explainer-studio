import {useThree} from '@react-three/fiber';
import React, {useMemo} from 'react';
import {random} from 'remotion';
import * as THREE from 'three';
import {MOODS, section, type Mood} from '../../theme';
import {BlobShadow} from '../MuseumStage';
import {plaster as matte, raw, roundedBox} from '../plaster';
import {CutOutline, cutMaterial, type Rect} from './cutLook';
import type {MoodPalette} from './moods';
import {skyTexture, windowTexture} from './textures';
import {RealLivingRoom} from '../real/RealLivingRoom';
import {RealRouter} from '../real/RealRouter';

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

/** The X-ray cut-away in the back wall: [x left, x right, y top, y bottom], round the router's route. */
const XRAY: [number, number, number, number] = [0.36, 1.04, 2.12, 0.04];

/** The cut faces' outlines: ground front and right faces, wall ends, and the L-shaped wall top. */
export const CUT_RECTS: Rect[] = [
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
export const CUT_EDGES: [V3, V3][] = TOP.map((p, i) => [p, TOP[(i + 1) % TOP.length]]);

/** Leaf clusters of the plant: [x, y, z, radius, darker]. Fixed, so the plant is the same everywhere. */
const PLANT: [number, number, number, number, boolean][] = [
  [0, 0.48, 0, 0.17, false],
  [-0.1, 0.62, 0.04, 0.12, true],
  [0.09, 0.66, -0.03, 0.13, false],
  [0.02, 0.8, 0.02, 0.1, true],
  [0.12, 0.45, 0.09, 0.1, true],
];

const LEAF = new THREE.CircleGeometry(1, 10);

/**
 * Leaves falling past the window, just outside the glass: each crosses the window on a slow
 * diagonal with a sway and a spin, on its own seeded loop, fading at the window's edges.
 */
const Leaves: React.FC<{clock: number; level?: number}> = ({clock, level = 1}) => {
  const [wx, wy, wz] = SLICE.window;
  const [ww, wh] = SLICE.windowSize;
  const mats = useMemo(() => [matte(section.leaf, 0.9), matte(section.leafDark, 0.9)], []);
  return (
    <group>
      {[0, 1, 2, 3].map((i) => {
        const period = 7 + 5 * random(`leaf-p-${i}`);
        const u = ((((clock + random(`leaf-o-${i}`) * period) / period) % 1) + 1) % 1;
        const x = wx + ww * (0.55 - 1.1 * u) + 0.25 * (random(`leaf-x-${i}`) - 0.5);
        const y = wy + wh * (0.6 - 1.2 * u) + 0.04 * Math.sin(u * 14 + i);
        const inside = Math.min(1, (ww / 2 - Math.abs(x - wx)) / 0.08, (wh / 2 - Math.abs(y - wy)) / 0.08);
        const s = Math.max(0, inside) * level;
        return (
          <mesh
            key={i}
            geometry={LEAF}
            material={mats[i % 2]}
            position={[x, y, wz + 0.008]}
            rotation={[0, 0, u * 9 + i]}
            scale={[0.032 * s, 0.016 * s, 1]}
            visible={s > 0.01}
          />
        );
      })}
    </group>
  );
};

const Box: React.FC<{
  size: V3;
  position: V3;
  /** A material (mood colours: stable, recoloured every frame), or a fixed colour. */
  mat?: THREE.Material;
  color?: string;
  radius?: number;
  roughness?: number;
  segments?: number;
}> = ({size, position, mat, color = '#888888', radius, roughness = 0.9, segments}) => (
  <mesh
    geometry={roundedBox(size[0], size[1], size[2], radius ?? Math.min(...size) * 0.06, segments)}
    material={mat ?? matte(color, roughness)}
    position={position}
    castShadow
    receiveShadow
  />
);

const Cyl: React.FC<{
  p: V3;
  args: [number, number, number, number];
  mat?: THREE.Material;
  color?: string;
  roughness?: number;
}> = ({p, args, mat, color = '#888888', roughness = 0.7}) => (
  <mesh position={p} material={mat ?? matte(color, roughness)} castShadow receiveShadow>
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
  /**
   * X-ray, 0–1: a cut-away opens in the back wall around the router's route (§ 5): the wall's face
   * is cut back over a rectangle, its reveal edges hatched like every cut face, an ink line round it,
   * a dark cavity behind, so the route inside the wall shows. It opens top-down as `xray` rises.
   */
  xray?: number;
  /** Seconds on the video clock (drives the leaves past the window in Day; continuous across cuts). */
  clock?: number;
  /** Leaves drifting past the window in Day (default on). */
  leaves?: boolean;
  /**
   * Realism pass (owner rule "objects realistic, people stylized"): realistic router, couch, table,
   * cup, rug, plant and lamp, with studio reflections. Cut faces, ink and hatch stay. Default false.
   */
  realism?: boolean;
  /** A blended palette (the time-passes beat): every colour follows it, rendered once. */
  palette?: MoodPalette;
  /**
   * The time-passes beat's still pictures (sky, the view through the window): the `mood` ones,
   * with the `from` mood's laid over at `amount` (they don't move, so a crossfade is exact).
   */
  skyFrom?: {mood: Mood; amount: number};
};

/** Materials for the mood colours, made once per slice and recoloured every frame. */
const moodMaterials = () => {
  const std = (roughness: number) => new THREE.MeshStandardMaterial({roughness, metalness: 0});
  return {
    trim: std(0.8),
    soft: std(0.9),
    softLight: std(0.9),
    wood: std(0.7),
    ceramic: std(0.6),
    device4: std(0.4),
    device5: std(0.5),
    shelf: std(1),
    appliance: std(1),
    antenna: std(0.85),
    rug: std(1),
  };
};

/**
 * A living room cut open (style guide v0.8 § 3): ground block (floor on top, cut faces front and
 * right), back and left walls cut on top and at the front, a window, the couch, the coffee table
 * with a cup, the shelf with the router, and a floor lamp (lit in Night). The sky backdrop sits
 * far behind. No people (add `Figure`s at SLICE.seats).
 */
export const LivingRoomSlice: React.FC<LivingRoomSliceProps> = ({
  mood,
  led = 0,
  lamp = 1,
  laptop = false,
  xray = 0,
  clock = 0,
  leaves = true,
  palette,
  skyFrom,
  realism = false,
}) => {
  const m = palette ?? MOODS[mood];
  // Made once; every colour is set from the palette each frame (so a blended palette renders once).
  const mats = useMemo(() => {
    const cut = cutMaterial();
    const earth = new THREE.MeshStandardMaterial({roughness: 1});
    const floor = new THREE.MeshStandardMaterial({roughness: 0.95});
    // The inner wall faces get their own material: the X-ray cuts it away.
    const wall = new THREE.MeshStandardMaterial({roughness: 0.95});
    const wallOut = new THREE.MeshStandardMaterial({roughness: 0.95});
    // Pictures, not lit surfaces: undo the post exposure so they show as authored.
    const sky = new THREE.MeshBasicMaterial({fog: false});
    const view = new THREE.MeshBasicMaterial({fog: false});
    const skyFromMat = new THREE.MeshBasicMaterial({fog: false, transparent: true, depthWrite: false});
    const viewFromMat = new THREE.MeshBasicMaterial({fog: false, transparent: true, depthWrite: false});
    const ledMat = new THREE.MeshBasicMaterial({color: raw(section.orange), transparent: true, opacity: 0});
    const shade = new THREE.MeshStandardMaterial({
      emissive: raw(MOODS.night.lamp!.glow),
      emissiveIntensity: 0,
      roughness: 0.9,
      side: THREE.DoubleSide,
    });
    // the wall's inside, seen only through the X-ray cut-away: a dark cavity behind the route
    const cavity = new THREE.MeshStandardMaterial({roughness: 1});
    // the cut-away: four planes that clip the wall's inner face over a rectangle (clipIntersection)
    const planes = [0, 1, 2, 3].map(() => new THREE.Plane());
    wall.clippingPlanes = planes;
    wall.clipIntersection = true;
    return {
      cut,
      earth,
      floor,
      wall,
      wallOut,
      sky,
      view,
      skyFromMat,
      viewFromMat,
      ledMat,
      shade,
      cavity,
      planes,
      col: moodMaterials(),
    };
  }, []);
  mats.earth.color.copy(raw(m.earth));
  mats.floor.color.copy(raw(m.floor));
  mats.wall.color.copy(raw(m.wall));
  mats.wallOut.color.copy(raw(m.wall));
  mats.shade.color.copy(raw(m.shade));
  mats.cavity.color.copy(raw(m.cavity));
  const setMap = (mat: THREE.MeshBasicMaterial, tex: THREE.Texture) => {
    if (mat.map !== tex) {
      mat.map = tex;
      mat.needsUpdate = true;
    }
  };
  setMap(mats.sky, skyTexture(mood));
  setMap(mats.view, windowTexture(mood));
  mats.sky.color.setScalar(1 / m.exposure);
  mats.view.color.setScalar(1 / m.exposure);
  const from = skyFrom && skyFrom.amount > 0.001 ? skyFrom : undefined;
  if (from) {
    setMap(mats.skyFromMat, skyTexture(from.mood));
    setMap(mats.viewFromMat, windowTexture(from.mood));
    mats.skyFromMat.color.setScalar(1 / m.exposure);
    mats.viewFromMat.color.setScalar(1 / m.exposure);
    mats.skyFromMat.opacity = from.amount;
    mats.viewFromMat.opacity = from.amount;
  }
  const {col} = mats;
  col.trim.color.copy(raw(m.trim));
  col.soft.color.copy(raw(m.soft));
  col.softLight.color.copy(raw(m.softLight));
  col.wood.color.copy(raw(m.wood));
  col.ceramic.color.copy(raw(m.ceramic));
  col.device4.color.copy(raw(m.device));
  col.device5.color.copy(raw(m.device));
  col.shelf.color.copy(raw(m.shelf));
  col.appliance.color.copy(raw(m.appliance));
  col.antenna.color.copy(raw(m.appliance));
  col.rug.color.copy(raw(m.rug));
  // the leaves are a Day thing: they fade with the time-passes beat
  const dayness = (mood === 'day' ? 1 : 0) * (1 - (from?.amount ?? 0)) + (from?.mood === 'day' ? from.amount : 0);
  const l = Math.max(0, Math.min(1, led));
  const x = Math.max(0, Math.min(1, xray));
  const gl = useThree((st) => st.gl);
  gl.localClippingEnabled = true;
  // the cut-away rectangle, opening from the top down (empty when closed)
  const [cx0, cx1, cyTop, cyBottom] = XRAY;
  const cy0 = cyTop - (cyTop - cyBottom) * x;
  const [pa, pb, pc, pd] = mats.planes;
  pa.set(new THREE.Vector3(-1, 0, 0), cx0);
  pb.set(new THREE.Vector3(1, 0, 0), -cx1);
  pc.set(new THREE.Vector3(0, -1, 0), cy0);
  pd.set(new THREE.Vector3(0, 1, 0), -cyTop);
  const open = x > 0.001;
  const ch = cyTop - cy0;
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

  return (
    <group>
      {/* sky backdrop, far behind */}
      <mesh position={[0, 6, -9]} material={mats.sky}>
        <planeGeometry args={[40, 30]} />
      </mesh>
      {from ? (
        <mesh position={[0, 6, -8.99]} material={mats.skyFromMat} renderOrder={-1}>
          <planeGeometry args={[40, 30]} />
        </mesh>
      ) : null}

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

      {/* the X-ray cut-away: cavity, hatched reveal edges, ink outline */}
      {open ? (
        <group>
          <mesh position={[(cx0 + cx1) / 2, (cy0 + cyTop) / 2, Z0 - WALL_T + 0.02]} material={mats.cavity}>
            <planeGeometry args={[cx1 - cx0, ch]} />
          </mesh>
          {[
            {
              p: [(cx0 + cx1) / 2, cyTop, Z0 - WALL_T / 2 + 0.01],
              r: [Math.PI / 2, 0, 0],
              s: [cx1 - cx0, WALL_T - 0.02],
            },
            {p: [(cx0 + cx1) / 2, cy0, Z0 - WALL_T / 2 + 0.01], r: [-Math.PI / 2, 0, 0], s: [cx1 - cx0, WALL_T - 0.02]},
            {p: [cx0, (cy0 + cyTop) / 2, Z0 - WALL_T / 2 + 0.01], r: [0, Math.PI / 2, 0], s: [WALL_T - 0.02, ch]},
            {p: [cx1, (cy0 + cyTop) / 2, Z0 - WALL_T / 2 + 0.01], r: [0, -Math.PI / 2, 0], s: [WALL_T - 0.02, ch]},
          ].map((f, i) => (
            <mesh key={i} position={f.p as V3} rotation={f.r as V3} material={cut} receiveShadow>
              <planeGeometry args={f.s as [number, number]} />
            </mesh>
          ))}
          <CutOutline
            rects={[
              [
                [cx0, cy0, Z0 + 0.003],
                [cx1, cyTop, Z0 + 0.003],
              ],
            ]}
          />
        </group>
      ) : null}

      {/* Day: a few leaves drift past outside the window (seeded, slow) */}
      {leaves && dayness > 0.01 ? <Leaves clock={clock} level={dayness} /> : null}

      {/* window: the view, a trim frame and a sill */}
      <mesh position={[wx, wy, wz]} material={mats.view}>
        <planeGeometry args={[ww, wh]} />
      </mesh>
      {from ? (
        <mesh position={[wx, wy, wz + 0.0005]} material={mats.viewFromMat}>
          <planeGeometry args={[ww, wh]} />
        </mesh>
      ) : null}
      <Box size={[ww + 0.08, 0.04, 0.04]} position={[wx, wy + wh / 2 + 0.02, wz + 0.02]} mat={col.trim} />
      <Box size={[ww + 0.14, 0.04, 0.09]} position={[wx, wy - wh / 2 - 0.02, wz + 0.045]} mat={col.trim} />
      {[-1, 1].map((s) => (
        <Box key={s} size={[0.04, wh, 0.04]} position={[wx + (s * (ww + 0.04)) / 2, wy, wz + 0.02]} mat={col.trim} />
      ))}
      <Box size={[0.025, wh, 0.025]} position={[wx, wy, wz + 0.013]} mat={col.trim} />

      {realism ? null : (
        <>
          {/* couch */}
          <Box size={[2.5, 0.42, 1.0]} radius={0.08} position={[0, 0.21, cz]} mat={col.soft} segments={8} />
          <Box size={[2.5, 0.78, 0.26]} radius={0.08} position={[0, 0.75, cz - 0.4]} mat={col.soft} segments={8} />
          {[-1, 1].map((s) => (
            <group key={s}>
              <Box size={[0.26, 0.66, 1.0]} radius={0.08} position={[s * 1.25, 0.33, cz]} mat={col.soft} segments={8} />
              <Box
                size={[1.14, 0.16, 0.86]}
                radius={0.06}
                position={[s * 0.59, 0.49, cz + 0.05]}
                mat={col.softLight}
                segments={8}
              />
              <Box
                size={[1.14, 0.6, 0.16]}
                radius={0.06}
                position={[s * 0.59, 0.93, cz - 0.23]}
                mat={col.softLight}
                segments={8}
              />
            </group>
          ))}
        </>
      )}
      {/* coffee table, cup, laptop */}
      {realism ? null : (
        <>
          <Box size={[1.4, 0.06, 0.6]} radius={0.02} position={SLICE.table} mat={col.wood} />
          {[-0.6, 0.6].flatMap((x) =>
            [0.38, 0.82].map((z) => (
              <Cyl key={`${x}${z}`} p={[x, 0.205, z]} args={[0.025, 0.02, 0.41, 10]} mat={col.wood} />
            )),
          )}
          <Cyl p={[SLICE.cup[0], 0.53, SLICE.cup[2]]} args={[0.06, 0.05, 0.12, 20]} mat={col.ceramic} />
        </>
      )}
      {laptop ? (
        <group position={[0.3, 0.47, 0.72]} rotation={[0, Math.PI, 0]}>
          <Box size={[0.36, 0.018, 0.24]} radius={0.006} position={[0, 0.009, 0.12]} mat={col.device4} />
          <group rotation={[-0.32, 0, 0]}>
            <Box size={[0.36, 0.23, 0.012]} radius={0.005} position={[0, 0.115, -0.006]} mat={col.device4} />
          </group>
        </group>
      ) : null}

      {/* shelf, router (vent slot, antennas, status LED: dark until the system is active) */}
      <Box size={[0.95, 0.05, 0.3]} radius={0.01} position={[rx, 1.75, Z0 + 0.15]} mat={col.shelf} />
      {realism ? (
        <RealRouter position={SLICE.router} color={m.appliance} />
      ) : (
        <>
          <Box size={[0.56, 0.13, 0.24]} radius={0.035} position={SLICE.router} mat={col.appliance} />
          {[-0.2, 0.2].map((x) => (
            <Cyl key={x} p={[rx + x, 2.08, rz - 0.07]} args={[0.014, 0.014, 0.36, 8]} mat={col.antenna} />
          ))}
          <Box size={[0.3, 0.02, 0.004]} radius={0.0015} position={[rx - 0.06, ry, rz + 0.121]} mat={col.device5} />
        </>
      )}
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

      {realism ? (
        <RealLivingRoom
          palette={m}
          couchZ={cz}
          table={SLICE.table}
          cup={SLICE.cup}
          plant={SLICE.plant}
          lamp={SLICE.lamp}
          shade={mats.shade}
        />
      ) : (
        <>
          {/* lived-in: a rug under the table, a plant right of the couch */}
          <Box size={[2.1, 0.012, 1.25]} radius={0.005} position={[0, 0.006, 0.55]} mat={col.rug} />
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
          <Cyl p={[lx, 0.015, lz]} args={[0.14, 0.15, 0.03, 24]} mat={col.device5} />
          <Cyl p={[lx, 0.65, lz]} args={[0.02, 0.02, 1.3, 8]} mat={col.device5} />
          <mesh position={[lx, 1.38, lz]} material={mats.shade} castShadow>
            <cylinderGeometry args={[0.16, 0.24, 0.26, 24, 1, true]} />
          </mesh>
        </>
      )}

      {/* the architect's-section look: ink along every cut edge (the hatch is in the cut material) */}
      <CutOutline rects={CUT_RECTS} edges={CUT_EDGES} />

      {/* contact shadows (the realistic objects bring their own) */}
      {realism ? null : (
        <>
          <BlobShadow position={[0, 0.004, cz]} size={[3.0, 1.5]} opacity={0.35} />
          <BlobShadow position={[0, 0.004, 0.6]} size={[1.8, 1.0]} opacity={0.28} />
        </>
      )}
    </group>
  );
};
