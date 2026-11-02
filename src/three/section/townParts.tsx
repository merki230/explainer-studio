import React, {useEffect, useMemo} from 'react';
import {random} from 'remotion';
import * as THREE from 'three';
import {MOODS, REAL, section, STREET, theme, TOWER, type Mood} from '../../theme';
import {Plume} from '../Atmosphere';
import {raw, roundedBox, softTexture} from '../plaster';
import {CutOutline, InkLine, INK, type Rect} from './cutLook';
import {Pipe, Rod, type DcMats} from './dcParts';
import {House} from './StreetSlice';
import {SECTION_ANGLE} from './SectionCamera';

/*
 * The town sheet's parts (No. 013 `town-slice`, av-script § 4 N2): everything outside the data centre, drawn at the
 * fixed angle and cut by the sheet's section plane (z = `zCut`, facing +z) like every Section set. All in metres, y up.
 * Every part is a pure function of its props (the scene passes times and key-track values); seeded `random` only.
 *
 *  - `ProfileBlock`: a ground block whose cut face is any polygon (a river channel, a pond), hatched, inked.
 *  - `TownHouse` (StreetSlice `House`, turned to face the camera), `KitchenHouse` (cut open, YOU's sink),
 *    `HouseField` (the 400 small houses, row by row), `WaterTower`, `Fence`.
 *  - `PlantTease`: a hyperbolic cooling tower cut in half, its turbine hall, the water path that lights orange.
 *  - `AerationBasin`, `Clarifier`: the wastewater plant.
 *  - `RiverSection`: the river cut across (water, sand bed, rocks, drifting grains, one-way flow), the outfall headwall
 *    with its gate, a sampler bottle and three unlabelled gauges, the warm (orange) plume spreading downstream.
 *  - `LimeTank`, `BrinePonds`: Quincy's reuse plant.
 */

type V3 = [number, number, number];

const smooth = (a: number, b: number, x: number) => {
  const u = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return u * u * (3 - 2 * u);
};

// ------------------------------------------------------------------------------------------------ materials

/** The town's own materials on top of the data centre's (`useDcMats`). */
export const useTownMats = (mood: Mood) => {
  const mats = useMemo(() => {
    const m = MOODS[mood];
    const std = (c: string, r = 0.9, o: THREE.MeshStandardMaterialParameters = {}) =>
      new THREE.MeshStandardMaterial({color: raw(c), roughness: r, metalness: 0, ...o});
    return {
      sidings: STREET.sidings.map((c) => std(c, 0.85)),
      roof: std(STREET.roof, 0.9),
      trim: std(m.trim, 0.6),
      win: new THREE.MeshPhysicalMaterial({color: raw(REAL.carGlass), roughness: 0.1, metalness: 0.2, clearcoat: 1}),
      winLit: new THREE.MeshBasicMaterial({color: raw(theme.plasterGlass).multiplyScalar(0.92 / m.exposure)}),
      asphalt: std(STREET.asphalt, 0.9),
      grass: std(STREET.grass, 0.95),
      grassDark: std(STREET.grassDark, 0.95),
      field: std(STREET.grassDark, 1),
      earth: std(m.earth, 1),
      sand: std(TOWER.stone, 0.95),
      rock: std(STREET.gravel, 0.9, {flatShading: true}),
      concrete: std(STREET.concrete, 0.9),
      tank: new THREE.MeshPhysicalMaterial({color: raw(STREET.tank), roughness: 0.6, metalness: 0.1}),
      water: new THREE.MeshStandardMaterial({
        color: raw(STREET.water),
        roughness: 0.25,
        transparent: true,
        opacity: 0.62,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
      waterFace: std(STREET.water, 0.4, {transparent: true, opacity: 0.82, depthWrite: false}),
      waterTop: std(STREET.stream, 0.15, {transparent: true, opacity: 0.55, depthWrite: false}),
      liner: std(REAL.cable, 0.6),
      salt: std(section.cut, 0.95),
      lime: new THREE.MeshBasicMaterial({color: raw(theme.plasterGlass).multiplyScalar(0.9 / m.exposure), transparent: true}),
      sludge: std(STREET.gravel, 1),
      sludgeDark: std(STREET.box, 1),
      bubble: new THREE.MeshBasicMaterial({color: raw(theme.plasterGlass).multiplyScalar(0.95 / m.exposure), transparent: true, opacity: 0.8}),
      fence: new THREE.MeshStandardMaterial({
        color: raw(STREET.receiverBox),
        roughness: 0.6,
        metalness: 0.5,
        transparent: true,
        opacity: 0.35,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
      plume: new THREE.MeshBasicMaterial({color: raw(section.orange), transparent: true, opacity: 0.42, depthWrite: false}),
      dial: std(STREET.dial, 0.6),
      bottle: new THREE.MeshPhysicalMaterial({
        color: raw(TOWER.glass),
        roughness: 0.05,
        transparent: true,
        opacity: 0.3,
        depthWrite: false,
      }),
      shell: std(TOWER.paint, 0.9),
      shellIn: std(STREET.concrete, 0.95, {side: THREE.BackSide}),
      hall: std(m.wall, 0.95),
    };
  }, [mood]);
  useEffect(() => () => Object.values(mats).forEach((x) => (Array.isArray(x) ? x.forEach((y) => y.dispose()) : x.dispose())), [mats]);
  return mats;
};
export type TownMats = ReturnType<typeof useTownMats>;

// ------------------------------------------------------------------------------------------------ ground

/** A box with listed cut faces (hatched); their rectangles go to `rects` for the ink (like N1's `cutBox`). */
export const cutBlock = (
  key: string,
  min: V3,
  max: V3,
  faces: string,
  mat: THREE.Material,
  cut: THREE.Material,
  rects: Rect[],
  top?: THREE.Material,
  shadow = false,
) => {
  const has = (f: string) => faces.includes(f);
  const m = [has('+x') ? cut : mat, has('-x') ? cut : mat, has('+y') ? cut : (top ?? mat), mat, has('+z') ? cut : mat, mat];
  if (has('+x')) rects.push([[max[0], min[1], min[2]], [max[0], max[1], max[2]]]);
  if (has('-x')) rects.push([[min[0], min[1], min[2]], [min[0], max[1], max[2]]]);
  if (has('+y')) rects.push([[min[0], max[1], min[2]], [max[0], max[1], max[2]]]);
  if (has('+z')) rects.push([[min[0], min[1], max[2]], [max[0], max[1], max[2]]]);
  return (
    <mesh key={key} material={m} position={[(min[0] + max[0]) / 2, (min[1] + max[1]) / 2, (min[2] + max[2]) / 2]} castShadow={shadow} receiveShadow>
      <boxGeometry args={[max[0] - min[0], max[1] - min[1], max[2] - min[2]]} />
    </mesh>
  );
};

/**
 * A ground block whose cut face (z = `z1`) is the polygon `pts` (x, y; counter-clockwise), extruded back to `z0`. The
 * cut face is hatched and inked; every other face (the top, the channel's banks) takes `side`.
 */
export const ProfileBlock: React.FC<{
  pts: [number, number][];
  z0: number;
  z1: number;
  side: THREE.Material;
  cut: THREE.Material;
  ink: number;
  /** Ink only the cut face's outline (default) or none. */
  inked?: boolean;
}> = ({pts, z0, z1, side, cut, ink, inked = true}) => {
  const k = JSON.stringify([pts, z0, z1]);
  const geo = useMemo(() => {
    const [p, a, b] = JSON.parse(k) as [[number, number][], number, number];
    const s = new THREE.Shape(p.map(([x, y]) => new THREE.Vector2(x, y)));
    const g = new THREE.ExtrudeGeometry(s, {depth: b - a, bevelEnabled: false, curveSegments: 1});
    g.translate(0, 0, a);
    return g;
  }, [k]);
  useEffect(() => () => geo.dispose(), [geo]);
  return (
    <group>
      <mesh geometry={geo} material={[cut, side]} receiveShadow />
      {inked ? <InkLine points={pts.map(([x, y]) => [x, y, z1 + 0.002] as V3)} thickness={ink} /> : null}
    </group>
  );
};

// ------------------------------------------------------------------------------------------------ houses

/** A neighbour's house (StreetSlice `House`) turned so its front (door, two windows) faces the camera (+z). */
export const TownHouse: React.FC<{
  at: V3;
  w?: number;
  d?: number;
  siding: THREE.Material;
  mats: TownMats;
  /** Each window's material (lit or not), left to right. */
  windows?: THREE.Material[];
}> = ({at, w = 8, d = 8, siding, mats, windows}) => (
  <group position={at} rotation={[0, -Math.PI / 2, 0]}>
    <House x0={-d / 2} x1={d / 2} z0={w / 2} z1={-w / 2} siding={siding} roof={mats.roof} trim={mats.trim} win={mats.win} faceX={1} ground={0} windows={windows} />
  </group>
);

/** The kitchen house's layout (house-local: origin at the front cut's centre on the ground, facing +z). */
export const KITCHEN = {
  w: 9,
  d: 8,
  floor: 0.35,
  wallH: 2.8,
  wallT: 0.2,
  /** The counter along the left wall (x), its top, the sink's centre, the faucet's spout, YOU's spot (house-local). */
  counterX: -4.5 + 0.2 + 0.32,
  counterTop: 0.35 + 0.9,
  sink: [-3.98, 0.35 + 0.9, -3.2] as V3,
  spout: [-4.12, 0.35 + 1.18, -3.2] as V3,
  you: [-3.15, 0.35, -3.2] as V3,
};

/**
 * One house cut open at its front wall (a stepped section behind the street): floor slab, back and side walls, the
 * ceiling slab and the gable roof, all cut at the front with hatch and ink; inside, a kitchen counter along the left
 * wall with a sink, a window over it, and the faucet's stream (`stream` 0 → 1). YOU is the scene's to place.
 */
export const KitchenHouse: React.FC<{
  at: V3;
  mats: TownMats;
  dc: DcMats;
  siding: THREE.Material;
  stream: number;
  lit: boolean;
  ink: number;
}> = ({at, mats, dc, siding, stream, lit, ink}) => {
  const K = KITCHEN;
  const {w, d, floor, wallH, wallT} = K;
  const cut = dc.cut;
  const rects: Rect[] = [];
  const x0 = -w / 2;
  const x1 = w / 2;
  const zb = -d;
  const parts: React.ReactNode[] = [];
  parts.push(cutBlock('fl', [x0, 0, zb], [x1, floor, 0], '+z', mats.concrete, cut, rects, dc.floor));
  parts.push(cutBlock('bw', [x0, floor, zb], [x1, floor + wallH, zb + wallT], '+y', siding, cut, rects));
  parts.push(cutBlock('lw', [x0, floor, zb + wallT], [x0 + wallT, floor + wallH, 0], '+z+y', siding, cut, rects));
  parts.push(cutBlock('rw', [x1 - wallT, floor, zb + wallT], [x1, floor + wallH, 0], '+z+y', siding, cut, rects));
  // the roof: a gable prism (ridge front to back), its front cap cut
  const roofGeo = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-w / 2 - 0.35, 0);
    s.lineTo(0, 2.0);
    s.lineTo(w / 2 + 0.35, 0);
    s.closePath();
    const g = new THREE.ExtrudeGeometry(s, {depth: d + 0.35, bevelEnabled: false});
    g.translate(0, 0, -d - 0.35);
    return g;
  }, [w, d]);
  const roofY = floor + wallH + 0.3;
  const roofPts: V3[] = [
    [-w / 2 - 0.35, roofY, 0.002],
    [0, roofY + 2.0, 0.002],
    [w / 2 + 0.35, roofY, 0.002],
  ];
  // ceiling slab under the roof
  parts.push(cutBlock('cl', [x0, floor + wallH, zb], [x1, roofY, 0], '+z', mats.concrete, cut, rects));
  // the counter, the base cabinets, the sink and the window over it
  const cz = K.sink[2];
  return (
    <group position={at}>
      {parts}
      <mesh geometry={roofGeo} material={[cut, mats.roof]} position={[0, roofY, 0]} castShadow receiveShadow />
      <InkLine points={roofPts} thickness={ink} />
      <CutOutline rects={rects} thickness={ink} />
      <group>
        <mesh material={dc.cabinet} position={[K.counterX, floor + 0.43, cz]} castShadow receiveShadow>
          <boxGeometry args={[0.6, 0.86, 3.2]} />
        </mesh>
        <mesh geometry={roundedBox(0.66, 0.05, 3.3, 0.01)} material={dc.concrete} position={[K.counterX + 0.02, K.counterTop - 0.02, cz]} castShadow receiveShadow />
        <mesh material={dc.steel} position={[K.sink[0], K.counterTop + 0.001, cz]}>
          <boxGeometry args={[0.42, 0.01, 0.6]} />
        </mesh>
        {/* the faucet: a goose-neck over the sink, toward the room */}
        <Pipe
          points={[
            [K.counterX - 0.25, K.counterTop, cz],
            [K.counterX - 0.25, K.spout[1] + 0.08, cz],
            [K.spout[0], K.spout[1] + 0.08, cz],
            [K.spout[0], K.spout[1], cz],
          ]}
          r={0.018}
          mat={dc.steel}
        />
        {stream > 0.01 ? (
          <mesh material={dc.stream} position={[K.spout[0], (K.spout[1] + K.counterTop) / 2, cz]} scale={[1, stream, 1]}>
            <cylinderGeometry args={[0.012, 0.016, K.spout[1] - K.counterTop, 10]} />
          </mesh>
        ) : null}
        {/* window over the sink in the left wall (lit from inside when the windows light) */}
        <mesh material={lit ? mats.winLit : mats.win} position={[x0 + wallT + 0.002, floor + 1.75, cz]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[1.4, 1.0]} />
        </mesh>
        {/* upper cabinets beside the window */}
        {[-1, 1].map((s) => (
          <mesh key={s} material={dc.cabinet} position={[x0 + wallT + 0.18, floor + 2.05, cz + s * 1.25]} castShadow>
            <boxGeometry args={[0.35, 0.7, 0.8]} />
          </mesh>
        ))}
        {/* a table and two chairs in the room */}
        <mesh material={dc.concrete} position={[0.6, floor + 0.74, -4.2]} castShadow receiveShadow>
          <boxGeometry args={[1.4, 0.05, 0.9]} />
        </mesh>
        {[-0.55, 0.55].flatMap((dx) =>
          [-0.35, 0.35].map((dz) => (
            <Rod key={`${dx}${dz}`} a={[0.6 + dx, floor, -4.2 + dz]} b={[0.6 + dx, floor + 0.72, -4.2 + dz]} r={0.025} mat={dc.galv} />
          )),
        )}
      </group>
    </group>
  );
};

/**
 * The 400 small houses on the field behind the town: `cols` × `rows` on a grid from the front row back, each popping up
 * (0.35 s) as `fill` (0 → 1) passes its row (rows fill front to back, a row's houses left to right within it).
 */
export const HouseField: React.FC<{
  x0: number;
  x1: number;
  z0: number;
  z1: number;
  cols?: number;
  rows?: number;
  fill: number;
  mats: TownMats;
}> = ({x0, x1, z0, z1, cols = 20, rows = 20, fill, mats}) => {
  const n = cols * rows;
  const geo = useMemo(() => {
    const body = new THREE.BoxGeometry(1.3, 1.1, 1.1);
    body.translate(0, 0.55, 0);
    const s = new THREE.Shape();
    s.moveTo(-0.75, 0);
    s.lineTo(0, 0.45);
    s.lineTo(0.75, 0);
    s.closePath();
    const roof = new THREE.ExtrudeGeometry(s, {depth: 1.25, bevelEnabled: false});
    roof.translate(0, 1.1, -0.625);
    return {body, roof};
  }, []);
  useEffect(() => () => Object.values(geo).forEach((g) => g.dispose()), [geo]);
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const sv = new THREE.Vector3();
  const pv = new THREE.Vector3();
  const set = (im: THREE.InstancedMesh | null) => {
    if (!im) return;
    let k = 0;
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++) {
        const i = r * cols + c;
        const share = (r + (c / cols) * 0.9) / rows;
        const pop = smooth(share, share + 0.35 / rows + 0.02, fill);
        if (pop <= 0.001) continue;
        const jx = (random(`hf-x-${i}`) - 0.5) * 0.5;
        const jz = (random(`hf-z-${i}`) - 0.5) * 0.4;
        // rows run from the front (z1) back to z0
        pv.set(x0 + ((c + 0.5) / cols) * (x1 - x0) + jx, 0, z1 - ((r + 0.5) / rows) * (z1 - z0) + jz);
        q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), (random(`hf-r-${i}`) - 0.5) * 0.2);
        sv.set(1, pop, 1);
        m.compose(pv, q, sv);
        im.setMatrixAt(k++, m);
      }
    im.count = k;
    im.instanceMatrix.needsUpdate = true;
  };
  return (
    <group>
      <instancedMesh
        // an inline callback ref runs on every commit, so the matrices follow `fill` each frame
        ref={(im) => set(im)}
        args={[geo.body, mats.sidings[0], n]}
        castShadow
        receiveShadow
        frustumCulled={false}
      />
      <instancedMesh
        ref={(im) => set(im)}
        args={[geo.roof, mats.roof, n]}
        castShadow
        receiveShadow
        frustumCulled={false}
      />
    </group>
  );
};

/** A pedestal water tower: a column on a footing, a tank on top (neutral steel), its pipe down into the ground. */
export const WaterTower: React.FC<{at: V3; mats: TownMats; dc: DcMats; h?: number}> = ({at, mats, dc, h = 16}) => (
  <group position={at}>
    <mesh material={dc.concrete} position={[0, 0.2, 0]} receiveShadow>
      <cylinderGeometry args={[2.2, 2.4, 0.4, 32]} />
    </mesh>
    <mesh material={mats.tank} position={[0, h / 2, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[0.9, 1.3, h, 24]} />
    </mesh>
    <mesh material={mats.tank} position={[0, h + 0.4, 0]} castShadow>
      <cylinderGeometry args={[4.2, 1.2, 3.4, 32]} />
    </mesh>
    <mesh material={mats.tank} position={[0, h + 3.6, 0]} castShadow>
      <cylinderGeometry args={[4.2, 4.2, 3.0, 32]} />
    </mesh>
    <mesh material={mats.tank} position={[0, h + 5.6, 0]} castShadow>
      <coneGeometry args={[4.3, 1.0, 32]} />
    </mesh>
  </group>
);

/** A chain-link fence along z from `z0` to `z1` at x, 2.2 m high: posts, a top rail, the mesh panel. */
export const Fence: React.FC<{x: number; z0: number; z1: number; mats: TownMats; dc: DcMats; h?: number}> = ({x, z0, z1, mats, dc, h = 2.2}) => {
  const n = Math.max(1, Math.round((z1 - z0) / 2.4));
  return (
    <group>
      {[...Array(n + 1).keys()].map((i) => {
        const z = z0 + ((z1 - z0) * i) / n;
        return <Rod key={i} a={[x, 0, z]} b={[x, h, z]} r={0.04} mat={dc.galv} shadow />;
      })}
      <Rod a={[x, h, z0]} b={[x, h, z1]} r={0.03} mat={dc.galv} />
      <mesh material={mats.fence} position={[x, h / 2, (z0 + z1) / 2]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[Math.abs(z1 - z0), h]} />
      </mesh>
    </group>
  );
};

// ------------------------------------------------------------------------------------------------ the power plant (tease)

/** The hyperbolic tower's profile (radius at height), base 12 m, throat 7.4 m at 27 m, mouth 8.3 m at 36 m. */
export const PLANT = {base: 12, throat: 7.4, throatY: 27, top: 36, mouth: 8.3, shell: 0.5, hall: {x0: 15, x1: 33, h: 13, z0: -12}};
const towerR = (y: number) => {
  const P = PLANT;
  if (y <= P.throatY) {
    const u = y / P.throatY;
    return P.throat + (P.base - P.throat) * Math.pow(1 - u, 1.7);
  }
  const u = (y - P.throatY) / (P.top - P.throatY);
  return P.throat + (P.mouth - P.throat) * u * u;
};

/** The plant's water path (local): the condenser in the hall → under the ground's cut face → up the tower's inside → the spray. */
export const plantPath = (): V3[] => [
  [24, 3.2, -1.5],
  [24, -1.2, 0.35],
  [6, -1.2, 0.35],
  [6, 9.5, 0.35],
  [-6, 9.5, 0.35],
];

/**
 * The power plant (tease): a hyperbolic cooling tower cut in half by the section plane (its shell's cut faces hatched
 * and inked, the inside lit: the fill and the rain over the basin), its plume (`plume` strength), the turbine hall cut
 * open at the front with a condenser, and the dead-end pole the line leaves from. The water path itself (orange) is
 * the scene's to draw (`plantPath`).
 */
export const PlantTease: React.FC<{
  at: V3;
  mats: TownMats;
  dc: DcMats;
  plume: number;
  clock: number;
  ink: number;
  mood: Mood;
  clockOffset: number;
}> = ({at, mats, dc, plume, clock, ink, mood}) => {
  const P = PLANT;
  const geo = useMemo(() => {
    const ys = [...Array(25).keys()].map((i) => (i / 24) * P.top);
    const outer = ys.map((y) => new THREE.Vector2(towerR(y), y));
    const inner = ys.map((y) => new THREE.Vector2(towerR(y) - P.shell, y));
    // the back half (z < 0): phi from π/2 to 3π/2
    const o = new THREE.LatheGeometry(outer, 48, Math.PI / 2, Math.PI);
    const i = new THREE.LatheGeometry(inner, 48, Math.PI / 2, Math.PI);
    // the shell's cut band on each side (z = 0)
    const band = (sgn: number) => {
      const s = new THREE.Shape();
      s.moveTo(sgn * outer[0].x, 0);
      outer.forEach((p) => s.lineTo(sgn * p.x, p.y));
      [...inner].reverse().forEach((p) => s.lineTo(sgn * p.x, p.y));
      s.closePath();
      return new THREE.ShapeGeometry(s, 1);
    };
    return {o, i, bL: band(-1), bR: band(1), outline: outer.map((p) => [p.x, p.y] as [number, number]), inline: inner.map((p) => [p.x, p.y] as [number, number])};
  }, [P.top, P.shell]);
  useEffect(() => () => [geo.o, geo.i, geo.bL, geo.bR].forEach((g) => g.dispose()), [geo]);
  const rects: Rect[] = [];
  const H = P.hall;
  const hallParts: React.ReactNode[] = [];
  const hz1 = 0;
  hallParts.push(cutBlock('hb', [H.x0, 0, H.z0], [H.x1, H.h, H.z0 + 0.4], '+y', mats.hall, dc.cut, rects, undefined, true));
  hallParts.push(cutBlock('hl', [H.x0, 0, H.z0 + 0.4], [H.x0 + 0.4, H.h, hz1], '+z+y', mats.hall, dc.cut, rects, undefined, true));
  hallParts.push(cutBlock('hr', [H.x1 - 0.4, 0, H.z0 + 0.4], [H.x1, H.h, hz1], '+z+y', mats.hall, dc.cut, rects, undefined, true));
  // the floor slab runs between the walls: spanning the whole hall, its ends were flush with the walls' outer faces and
  // the concrete z-fought the wall paint along their foot (No. 013 flicker)
  hallParts.push(cutBlock('hf', [H.x0 + 0.4, 0, H.z0 + 0.4], [H.x1 - 0.4, 0.3, hz1], '+z', dc.concrete, dc.cut, rects));
  // rain inside the tower over the fill (neutral streaks falling)
  const rain: React.ReactNode[] = [];
  for (let k = 0; k < 26; k++) {
    const x = (random(`pr-x-${k}`) - 0.5) * 2 * (P.base - 2.5);
    const z = -0.6 - random(`pr-z-${k}`) * 5;
    const u = (clock * 0.9 + random(`pr-p-${k}`)) % 1;
    const y = 8.6 - u * 6.6;
    rain.push(
      <mesh key={k} material={dc.stream} position={[x, y, z]}>
        <boxGeometry args={[0.08, 0.9, 0.08]} />
      </mesh>,
    );
  }
  const sideOut = (pts: [number, number][], sgn: number): V3[] => pts.map(([x, y]) => [sgn * x, y, 0.003] as V3);
  return (
    <group position={at}>
      <mesh geometry={geo.o} material={mats.shell} castShadow receiveShadow />
      <mesh geometry={geo.i} material={mats.shellIn} receiveShadow />
      <mesh geometry={geo.bL} material={dc.cut} position={[0, 0, 0.001]} />
      <mesh geometry={geo.bR} material={dc.cut} position={[0, 0, 0.001]} />
      {[-1, 1].map((s) => (
        <React.Fragment key={s}>
          <InkLine points={sideOut(geo.outline, s)} closed={false} thickness={ink} />
          <InkLine points={sideOut(geo.inline, s)} closed={false} thickness={ink} />
        </React.Fragment>
      ))}
      {/* basin, fill pack, the spray header */}
      <mesh material={dc.concrete} position={[0, 0.5, -P.base / 2]} receiveShadow>
        <boxGeometry args={[P.base * 2 - 1, 1, P.base]} />
      </mesh>
      <mesh material={dc.waterSolid} position={[0, 1.02, -P.base / 2]}>
        <boxGeometry args={[P.base * 2 - 1.6, 0.04, P.base - 0.4]} />
      </mesh>
      <mesh material={dc.fins} position={[0, 3.2, -3.5]} receiveShadow>
        <boxGeometry args={[P.base * 2 - 3.2, 1.6, 6.5]} />
      </mesh>
      <Rod a={[-P.base + 2.4, 9.5, -0.5]} b={[P.base - 2.4, 9.5, -0.5]} r={0.25} mat={dc.pipeWarm} />
      {rain}
      {plume > 0.01 ? (
        <Plume
          position={[0, P.top + 0.5, -2]}
          strength={Math.min(2, plume * 1.3)}
          radius={6.5}
          rise={34}
          life={10}
          count={44}
          wind={9}
          tone={1.2 / MOODS[mood].exposure}
          shade={0.95}
          opacity={1}
          pulse={0.18}
          pulseEvery={2.6}
          facing={SECTION_ANGLE}
          seed="plant-plume"
          clockOffset={clock}
        />
      ) : null}
      {/* the turbine hall, cut open: the condenser (a long drum) and the turbine casing */}
      {hallParts}
      <mesh material={mats.roof} position={[(H.x0 + H.x1) / 2, H.h + 0.2, (H.z0 + hz1) / 2 - 1]} castShadow>
        <boxGeometry args={[H.x1 - H.x0, 0.4, -H.z0 - 2]} />
      </mesh>
      <mesh material={dc.tank} position={[24, 3.2, -4]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[1.6, 1.6, 9, 24]} />
      </mesh>
      <mesh material={dc.cabinetDark} position={[24, 6.6, -6]} castShadow receiveShadow>
        <boxGeometry args={[11, 2.6, 3.4]} />
      </mesh>
      <Pipe points={[[24, 3.2, -2.4], [24, 3.2, -1.5], [24, 0.3, -1.5]]} r={0.35} mat={dc.pipeWarm} />
      <CutOutline rects={rects} thickness={ink} />
    </group>
  );
};

// ------------------------------------------------------------------------------------------------ the wastewater plant

/** A rectangular aeration basin cut across by the section plane: concrete walls, mixed liquor, bubbles rising from the floor. */
export const AerationBasin: React.FC<{x0: number; x1: number; z0: number; zCut: number; depth?: number; mats: TownMats; dc: DcMats; clock: number; ink: number}> = ({
  x0,
  x1,
  z0,
  zCut,
  depth = 4,
  mats,
  dc,
  clock,
  ink,
}) => {
  const rects: Rect[] = [];
  const t = 0.35;
  const parts: React.ReactNode[] = [];
  parts.push(cutBlock('fl', [x0, -depth - t, z0], [x1, -depth, zCut], '+z', dc.concrete, dc.cut, rects));
  parts.push(cutBlock('wl', [x0, -depth, z0], [x0 + t, 0.6, zCut], '+z+y', dc.concrete, dc.cut, rects));
  parts.push(cutBlock('wr', [x1 - t, -depth, z0], [x1, 0.6, zCut], '+z+y', dc.concrete, dc.cut, rects));
  parts.push(cutBlock('wb', [x0 + t, -depth, z0], [x1 - t, 0.6, z0 + t], '+y', dc.concrete, dc.cut, rects));
  const level = -0.25;
  const bubbles: React.ReactNode[] = [];
  for (let k = 0; k < 70; k++) {
    const x = x0 + 0.6 + random(`ab-x-${k}`) * (x1 - x0 - 1.2);
    const z = zCut - 0.15 - random(`ab-z-${k}`) * (zCut - z0 - 0.6);
    const u = (clock * (0.35 + random(`ab-s-${k}`) * 0.25) + random(`ab-p-${k}`)) % 1;
    const y = -depth + 0.3 + u * (depth - 0.3 + level);
    bubbles.push(
      <mesh key={k} material={mats.bubble} position={[x + 0.1 * Math.sin(u * 9 + k), y, z]} scale={0.06 + 0.05 * u}>
        <sphereGeometry args={[1, 8, 6]} />
      </mesh>,
    );
  }
  return (
    <group>
      {parts}
      <mesh material={mats.waterFace} position={[(x0 + x1) / 2, (-depth + level) / 2, zCut - 0.01]}>
        <planeGeometry args={[x1 - x0 - 2 * t, depth + level]} />
      </mesh>
      <mesh material={mats.waterTop} position={[(x0 + x1) / 2, level, (z0 + zCut) / 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[x1 - x0 - 2 * t, zCut - z0 - t]} />
      </mesh>
      {bubbles}
      <CutOutline rects={rects} thickness={ink} />
    </group>
  );
};

/**
 * A round clarifier cut in half by the section plane (its centre on the plane): the wall's and the sloped floor's cut
 * faces, the water's section, the sludge blanket, the centre column, and the rake bridge turning about the centre
 * (`turns`, rev); the arm in the cut-away half is not drawn.
 */
export const Clarifier: React.FC<{cx: number; r?: number; zCut: number; depth?: number; turns: number; mats: TownMats; dc: DcMats; ink: number; sludge?: number}> = ({
  cx,
  r = 7,
  zCut,
  depth = 3.6,
  turns,
  mats,
  dc,
  ink,
  sludge = 0.5,
}) => {
  const t = 0.35;
  const geo = useMemo(() => {
    const wall = new THREE.CylinderGeometry(r, r, depth + 0.8, 48, 1, true, Math.PI / 2, Math.PI);
    const floor = new THREE.CircleGeometry(r, 48, Math.PI, Math.PI);
    floor.rotateX(-Math.PI / 2);
    const water = new THREE.CircleGeometry(r - t, 48, Math.PI, Math.PI);
    water.rotateX(-Math.PI / 2);
    return {wall, floor, water};
  }, [r, depth]);
  useEffect(() => () => Object.values(geo).forEach((g) => g.dispose()), [geo]);
  // the cut face: the two wall strips, the floor slab (sloping to the centre hopper), the water and the sludge
  const fy = -depth;
  const prof: [number, number][] = [
    [-r, fy - t],
    [r, fy - t],
    [r, fy],
    [1.0, fy - 0.8],
    [-1.0, fy - 0.8],
    [-r, fy],
  ];
  const ang = (turns % 1) * Math.PI * 2;
  const arms = [0, Math.PI].map((o) => ang + o).filter((a) => Math.sin(a) < -0.02);
  const sl = 0.4 + 0.8 * sludge;
  return (
    <group position={[cx, 0, zCut]}>
      <mesh geometry={geo.wall} material={dc.concrete} position={[0, (fy + 0.8) / 2, 0]} receiveShadow />
      {[-1, 1].map((s) => (
        <mesh key={s} material={dc.cut} position={[s * (r - t / 2), (fy + 0.8) / 2, 0.002]}>
          <planeGeometry args={[t, -fy + 0.8]} />
        </mesh>
      ))}
      <mesh material={dc.cut} position={[0, 0, 0.003]}>
        <shapeGeometry args={[new THREE.Shape(prof.map(([x, y]) => new THREE.Vector2(x, y))), 1]} />
      </mesh>
      <InkLine points={prof.map(([x, y]) => [x, y, 0.005] as V3)} thickness={ink} />
      {[-1, 1].map((s) => (
        <InkLine key={s} closed points={[[s * r, fy, 0.005], [s * r, 0.8, 0.005], [s * (r - t), 0.8, 0.005], [s * (r - t), fy, 0.005]]} thickness={ink} />
      ))}
      {/* water section and surface */}
      <mesh material={mats.waterFace} position={[0, (fy - 0.25) / 2, -0.01]}>
        <planeGeometry args={[2 * (r - t), -fy - 0.25]} />
      </mesh>
      <mesh geometry={geo.water} material={mats.waterTop} position={[0, -0.25, 0]} />
      {/* sludge blanket at the bottom (a darker band in the section) */}
      <mesh material={mats.sludgeDark} position={[0, fy + sl / 2 - 0.2, -0.005]}>
        <planeGeometry args={[2 * (r - t) - 0.4, sl]} />
      </mesh>
      {/* centre column, the bridge and the rake arm on the back half */}
      <mesh material={dc.galv} position={[0, (fy + 1.2) / 2, -0.8]}>
        <cylinderGeometry args={[0.5, 0.5, -fy + 1.2, 16]} />
      </mesh>
      {arms.map((a, i) => (
        <group key={i} rotation={[0, -a, 0]} position={[0, 0, 0]}>
          <mesh material={dc.galv} position={[(r - t) / 2, 1.0, 0]} castShadow>
            <boxGeometry args={[r - t, 0.35, 0.9]} />
          </mesh>
          <mesh material={dc.galv} position={[(r - t) / 2, fy + 0.4, 0]}>
            <boxGeometry args={[r - t - 0.6, 0.15, 0.2]} />
          </mesh>
          <Rod a={[r - t - 0.3, 1.0, 0]} b={[r - t - 0.3, fy + 0.4, 0]} r={0.06} mat={dc.galv} />
        </group>
      ))}
    </group>
  );
};

// ------------------------------------------------------------------------------------------------ the river

/** The river segment's profile (local: origin on the left bank's edge, ground top y 0, the cut face at z = 0). */
export const RIVER = {
  left: -8,
  right: 16,
  bottom: -4.6,
  level: -1.4,
  bedY: -3.5,
  /** The channel from the bank edge (0) to 10; the outfall headwall and its mouth on the left bank. */
  chan: [0, 10] as [number, number],
  mouth: [0.55, -1.2] as [number, number],
  back: -40,
  /** The gauges' post and the sampler on the left bank. */
  gauges: [-2.6, 0, -0.6] as V3,
  sampler: [-1.0, 0, -0.4] as V3,
};
const riverProfile = (): [number, number][] => {
  const R = RIVER;
  return [
    [R.left, R.bottom],
    [R.right, R.bottom],
    [R.right, 0],
    [10, 0],
    [8.6, -3.1],
    [7, -3.5],
    [3, -3.5],
    [1.5, -3.1],
    [0, 0],
    [R.left, 0],
  ];
};
/** Where the channel's water surface meets each bank (x). */
const waterX = () => {
  const R = RIVER;
  const k = -R.level / 3.1;
  return [1.5 * k, 10 - 1.4 * k] as [number, number];
};

/** Three unlabelled round gauges on a post; each needle at `needles[i]` (0 → 1 of its sweep), a limit mark at 0.6. */
const Gauges: React.FC<{at: V3; needles: number[]; mats: TownMats; dc: DcMats}> = ({at, needles, mats, dc}) => (
  <group position={at}>
    <Rod a={[0, 0, 0]} b={[0, 1.6, 0]} r={0.05} mat={dc.galv} />
    <mesh material={dc.galv} position={[0, 1.35, 0.02]}>
      <boxGeometry args={[1.1, 0.42, 0.06]} />
    </mesh>
    {needles.map((v, i) => {
      const x = (i - 1) * 0.34;
      const a = Math.PI * 0.75 - v * Math.PI * 1.5;
      const lim = Math.PI * 0.75 - 0.6 * Math.PI * 1.5;
      return (
        <group key={i} position={[x, 1.35, 0.06]}>
          <mesh material={mats.dial} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.14, 0.14, 0.02, 24]} />
          </mesh>
          <mesh material={dc.ink} position={[0.11 * Math.cos(lim), 0.11 * Math.sin(lim), 0.012]} rotation={[0, 0, lim]}>
            <boxGeometry args={[0.05, 0.012, 0.004]} />
          </mesh>
          <mesh material={dc.ink} position={[0.05 * Math.cos(a), 0.05 * Math.sin(a), 0.014]} rotation={[0, 0, a]}>
            <boxGeometry args={[0.11, 0.012, 0.004]} />
          </mesh>
        </group>
      );
    })}
  </group>
);

/**
 * The river cut across (it flows away from the camera, −z): the ground's profile with the channel, the water's section
 * and surface with flow marks running one way, the sand bed with grains drifting downstream, rocks; on the left bank
 * the outfall headwall with its slide gate over the pipe's mouth (`gate` 0 shut → 1 open), a sampler bottle filling
 * (`sample` 0 → 1) and three gauges (`needles`); the warm plume (orange) spreading downstream from the mouth (`plume`).
 */
export const RiverSection: React.FC<{
  at: V3;
  mats: TownMats;
  dc: DcMats;
  clock: number;
  ink: number;
  gate: number;
  sample: number;
  needles: number[];
  plume: number;
  sand: number;
  /** The water backed up behind the shut gate, 0 → 1 (the mouth bulges, a ring pulses). */
  backup: number;
}> = ({at, mats, dc, clock, ink, gate, sample, needles, plume, sand, backup}) => {
  const R = RIVER;
  const [wl, wr] = waterX();
  const prof = riverProfile();
  // the water's section polygon (the channel under the level)
  const water: [number, number][] = [
    [wl, R.level],
    [1.5, -3.1],
    [3, -3.5],
    [7, -3.5],
    [8.6, -3.1],
    [wr, R.level],
  ];
  const waterGeo = useMemo(() => {
    const s = new THREE.Shape(water.map(([x, y]) => new THREE.Vector2(x, y)));
    const g = new THREE.ExtrudeGeometry(s, {depth: -R.back - 0.05, bevelEnabled: false});
    g.translate(0, 0, R.back);
    return g;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => () => waterGeo.dispose(), [waterGeo]);
  const flow = clock * 0.9;
  const marks: React.ReactNode[] = [];
  for (let k = 0; k < 18; k++) {
    const x = wl + 0.6 + random(`rv-x-${k}`) * (wr - wl - 1.2);
    const z = -(((flow + random(`rv-z-${k}`) * 30) % 30) + 0.3);
    marks.push(
      <mesh key={k} material={mats.waterTop} position={[x, R.level + 0.02, z]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.08, 1.4]} />
      </mesh>,
    );
  }
  const grains: React.ReactNode[] = [];
  if (sand > 0.01)
    for (let k = 0; k < 40; k++) {
      const x = 3.2 + random(`gr-x-${k}`) * 3.6;
      const u = (clock * 0.35 + random(`gr-p-${k}`)) % 1;
      const z = -0.2 - u * 6;
      const y = R.bedY + 0.08 + 0.15 * Math.sin(u * Math.PI) * random(`gr-h-${k}`);
      grains.push(
        <mesh key={k} material={dc.dotGrey} position={[x, y, z]} scale={0.05 * sand * smooth(0, 0.1, u) * (1 - smooth(0.85, 1, u))}>
          <sphereGeometry args={[1, 6, 5]} />
        </mesh>,
      );
    }
  const rocks: [number, number, number, number][] = [
    [2.2, -3.25, -1.2, 0.45],
    [5.4, -3.4, -2.8, 0.35],
    [7.8, -3.2, -0.9, 0.5],
    [4.1, -3.4, -5.5, 0.4],
  ];
  // the plume: a flat orange tongue in the water from the mouth, widening and lengthening downstream
  const pl = Math.max(0, Math.min(1, plume));
  const gy = 1.2 * Math.max(0, Math.min(1, gate));
  return (
    <group position={at}>
      <ProfileBlock pts={prof} z0={R.back} z1={0} side={mats.grass} cut={dc.cut} ink={ink} />
      {/* sand bed */}
      <mesh material={mats.sand} position={[5, R.bedY + 0.02, R.back / 2]} receiveShadow>
        <boxGeometry args={[4.2, 0.06, -R.back]} />
      </mesh>
      {rocks.map(([x, y, z, s], i) => (
        <mesh key={i} material={mats.rock} position={[x, y, z]} scale={[s, s * 0.7, s]} castShadow>
          <dodecahedronGeometry args={[1, 0]} />
        </mesh>
      ))}
      {grains}
      <mesh geometry={waterGeo} material={mats.water} />
      <mesh material={mats.waterFace} position={[0, 0, 0.004]}>
        <shapeGeometry args={[new THREE.Shape(water.map(([x, y]) => new THREE.Vector2(x, y))), 1]} />
      </mesh>
      <InkLine points={[[wl, R.level, 0.006], [wr, R.level, 0.006]]} closed={false} thickness={ink * 0.7} />
      {marks}
      {/* the warm plume */}
      {pl > 0.01 ? (
        <mesh material={mats.plume} position={[R.mouth[0] + 0.8 + 1.6 * pl, R.level - 0.12, -0.2 - 8 * pl]} scale={[0.8 + 2.4 * pl, 0.35, 0.5 + 16 * pl]} userData={{glow: true}} renderOrder={6}>
          <sphereGeometry args={[0.5, 20, 10]} />
        </mesh>
      ) : null}
      {/* the outfall headwall, the pipe's mouth and the slide gate (it lifts to open) */}
      <mesh material={dc.concrete} position={[R.mouth[0] - 0.1, -1.0, -1.0]} castShadow receiveShadow>
        <boxGeometry args={[0.35, 2.6, 2.4]} />
      </mesh>
      <mesh material={dc.cut} position={[R.mouth[0] - 0.1, -1.0, 0.2 + 0.001]}>
        <planeGeometry args={[0.35, 2.6]} />
      </mesh>
      <InkLine points={[[R.mouth[0] - 0.275, -2.3, 0.21], [R.mouth[0] + 0.075, -2.3, 0.21], [R.mouth[0] + 0.075, 0.3, 0.21], [R.mouth[0] - 0.275, 0.3, 0.21]]} thickness={ink * 0.8} />
      <mesh material={dc.galv} position={[R.mouth[0] + 0.12, R.mouth[1] + gy, -0.3]} castShadow>
        <boxGeometry args={[0.08, 0.7, 0.75]} />
      </mesh>
      <Rod a={[R.mouth[0] + 0.12, 0.3, -0.3]} b={[R.mouth[0] + 0.12, 1.5, -0.3]} r={0.03} mat={dc.galv} />
      <mesh material={dc.galv} position={[R.mouth[0] + 0.12, 1.5, -0.3]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.18, 0.025, 8, 20]} />
      </mesh>
      {backup > 0.01 ? (
        <mesh material={dc.waterSolid} position={[R.mouth[0] - 0.2, R.mouth[1], 0.05]} scale={[0.4 * backup, 0.3 + 0.03 * Math.sin(clock * 6), 0.2]}>
          <sphereGeometry args={[0.5, 12, 8]} />
        </mesh>
      ) : null}
      {/* sampler: a bottle on a stand, a thin tube to the pipe; the water level rises as it fills */}
      <group position={RIVER.sampler}>
        <mesh material={dc.galv} position={[0, 0.3, 0]}>
          <boxGeometry args={[0.4, 0.6, 0.4]} />
        </mesh>
        <mesh material={mats.bottle} position={[0, 0.85, 0]}>
          <cylinderGeometry args={[0.14, 0.14, 0.5, 16]} />
        </mesh>
        {sample > 0.01 ? (
          <mesh material={dc.waterSolid} position={[0, 0.6 + 0.24 * sample, 0]}>
            <cylinderGeometry args={[0.125, 0.125, 0.48 * sample, 16]} />
          </mesh>
        ) : null}
        <Pipe points={[[0, 1.1, 0], [0, 1.25, 0], [0.6, 1.25, 0], [0.6, 0, 0]]} r={0.015} mat={dc.hose} />
      </group>
      <Gauges at={RIVER.gauges} needles={needles} mats={mats} dc={dc} />
    </group>
  );
};

// ------------------------------------------------------------------------------------------------ Quincy

/**
 * Quincy's lime-softening tank, cut in half by the section plane (centre on the plane): its wall's and conical floor's
 * cut faces, the water's section, lime drifting down (`lime` 0 → 1), the sludge settling into the cone (`sludge`
 * 0 → 1), the rake arm turning on the back half (`turns`).
 */
export const LimeTank: React.FC<{cx: number; zCut: number; r?: number; h?: number; mats: TownMats; dc: DcMats; clock: number; lime: number; sludge: number; turns: number; ink: number}> = ({
  cx,
  zCut,
  r = 4.5,
  h = 7,
  mats,
  dc,
  clock,
  lime,
  sludge,
  turns,
  ink,
}) => {
  const t = 0.3;
  const cone = 1.8;
  const geo = useMemo(() => {
    const wall = new THREE.CylinderGeometry(r, r, h, 40, 1, true, Math.PI / 2, Math.PI);
    const coneG = new THREE.CylinderGeometry(r, 0.6, cone, 40, 1, true, Math.PI / 2, Math.PI);
    const top = new THREE.CircleGeometry(r - t, 40, Math.PI, Math.PI);
    top.rotateX(-Math.PI / 2);
    return {wall, coneG, top};
  }, [r, h]);
  useEffect(() => () => Object.values(geo).forEach((g) => g.dispose()), [geo]);
  const base = cone + 0.4;
  const level = base + h - 0.6;
  const prof = (s: number): [number, number][] => [
    [s * r, base + h],
    [s * (r - t), base + h],
    [s * (r - t), base],
    [s * 0.6, base - cone + 0.1],
    [s * 0.6, base - cone - 0.2],
    [s * r, base],
  ];
  const specks: React.ReactNode[] = [];
  if (lime > 0.01)
    for (let k = 0; k < 50; k++) {
      const x = (random(`lm-x-${k}`) - 0.5) * 2 * (r - 0.8);
      const z = -0.15 - random(`lm-z-${k}`) * 1.2;
      const u = (clock * 0.25 + random(`lm-p-${k}`)) % 1;
      const y = level - 0.2 - u * (h - 1.2);
      specks.push(
        <mesh key={k} material={mats.lime} position={[x * (1 - 0.4 * u), y, z]} scale={0.05 * Math.min(1, lime * 1.5)}>
          <sphereGeometry args={[1, 6, 5]} />
        </mesh>,
      );
    }
  const ang = (turns % 1) * Math.PI * 2;
  const arms = [0, Math.PI].map((o) => ang + o).filter((a) => Math.sin(a) < -0.02);
  const sl = 0.25 + 1.3 * sludge;
  return (
    <group position={[cx, 0, zCut]}>
      <mesh material={dc.concrete} position={[0, base / 2, -r / 2]} receiveShadow>
        <boxGeometry args={[2 * r + 0.6, base, r]} />
      </mesh>
      <mesh material={dc.cut} position={[0, base / 2, 0.002]}>
        <planeGeometry args={[2 * r + 0.6, base]} />
      </mesh>
      <mesh geometry={geo.wall} material={dc.tank} position={[0, base + h / 2, 0]} castShadow receiveShadow />
      <mesh geometry={geo.coneG} material={dc.tank} position={[0, base - cone / 2, 0]} />
      {[-1, 1].map((s) => (
        <React.Fragment key={s}>
          <mesh material={dc.cut} position={[0, 0, 0.004]}>
            <shapeGeometry args={[new THREE.Shape(prof(s).map(([x, y]) => new THREE.Vector2(x, y))), 1]} />
          </mesh>
          <InkLine points={prof(s).map(([x, y]) => [x, y, 0.006] as V3)} thickness={ink} />
        </React.Fragment>
      ))}
      <InkLine points={[[-r - 0.3, 0, 0.006], [r + 0.3, 0, 0.006], [r + 0.3, base, 0.006], [-r - 0.3, base, 0.006]]} thickness={ink} />
      <mesh material={mats.sludge} position={[0, 0, 0.005]}>
        <shapeGeometry
          args={[new THREE.Shape([new THREE.Vector2(-(r - t), base), new THREE.Vector2(-0.6, base - cone + 0.1), new THREE.Vector2(0.6, base - cone + 0.1), new THREE.Vector2(r - t, base)]), 1]}
        />
      </mesh>
      <mesh material={mats.waterFace} position={[0, (base + level) / 2, -0.01]}>
        <planeGeometry args={[2 * (r - t), level - base]} />
      </mesh>
      <mesh geometry={geo.top} material={mats.waterTop} position={[0, level, 0]} />
      <mesh material={mats.sludge} position={[0, base + sl / 2 - 0.4, -0.005]}>
        <planeGeometry args={[2 * (r - t) * (0.6 + 0.4 * Math.min(1, sl / 1.2)), sl]} />
      </mesh>
      {specks}
      <mesh material={dc.galv} position={[0, base + h / 2 + 0.6, -0.4]}>
        <cylinderGeometry args={[0.12, 0.12, h + 1.2, 10]} />
      </mesh>
      <mesh material={dc.galv} position={[0, base + h + 0.4, -0.4]}>
        <boxGeometry args={[1.0, 0.6, 0.6]} />
      </mesh>
      {arms.map((a, i) => (
        <group key={i} rotation={[0, -a, 0]} position={[0, base + 0.15, 0]}>
          <mesh material={dc.galv} position={[(r - t) / 2, 0, 0]}>
            <boxGeometry args={[r - t - 0.3, 0.12, 0.2]} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

/** The two brine ponds' x-extents (local to the ponds segment: origin at its left edge). */
export const PONDS = {width: 31, ponds: [[1, 14], [16, 29]] as [number, number][], depth: 2.2, back: -22};

/**
 * Quincy's lined brine ponds, cut across: the ground's profile with two pond basins, the black liner in section
 * following each, the brine (level 0 → 1 of the depth), and the white salt crust spreading from the edges (`crust` 0 → 1).
 */
export const BrinePonds: React.FC<{at: V3; mats: TownMats; dc: DcMats; level: number; crust: number; ink: number; bottom?: number}> = ({
  at,
  mats,
  dc,
  level,
  crust,
  ink,
  bottom = -4.6,
}) => {
  const P = PONDS;
  const D = P.depth;
  const prof: [number, number][] = [[0, bottom], [P.width, bottom], [P.width, 0]];
  for (const [a, b] of [...P.ponds].reverse()) {
    prof.push([b, 0], [b - 1.6, -D], [a + 1.6, -D], [a, 0]);
  }
  prof.push([0, 0]);
  const liner = (a: number, b: number): V3[] => [
    [a - 0.3, 0.02, 0.006],
    [a, 0.02, 0.006],
    [a + 1.6, -D + 0.02, 0.006],
    [b - 1.6, -D + 0.02, 0.006],
    [b, 0.02, 0.006],
    [b + 0.3, 0.02, 0.006],
  ];
  const lv = Math.max(0, Math.min(1, level));
  const c = Math.max(0, Math.min(1, crust));
  return (
    <group position={at}>
      <ProfileBlock pts={prof} z0={P.back} z1={0} side={mats.earth} cut={dc.cut} ink={ink} />
      {P.ponds.map(([a, b], i) => {
        const y = -D + lv * (D - 0.3);
        const k = (y + D) / D;
        const xa = a + 1.6 * (1 - k);
        const xb = b - 1.6 * (1 - k);
        return (
          <group key={i}>
            {/* the liner: black sheet over the basin (top and slopes), its section a thick dark line */}
            <mesh material={mats.liner} position={[(a + b) / 2, -D + 0.03, P.back / 2]} receiveShadow>
              <boxGeometry args={[b - a - 3.2, 0.04, -P.back]} />
            </mesh>
            {[-1, 1].map((s) => (
              <mesh
                key={s}
                material={mats.liner}
                position={[s < 0 ? a + 0.8 : b - 0.8, -D / 2 + 0.03, P.back / 2]}
                rotation={[0, 0, s * Math.atan2(D, 1.6)]}
              >
                <boxGeometry args={[Math.hypot(1.6, D), 0.04, -P.back]} />
              </mesh>
            ))}
            <InkLine points={liner(a, b)} closed={false} color={REAL.cable} thickness={Math.max(ink * 2.2, 0.06)} />
            {/* the salt crust: white over the bottom, spreading from both slopes inward */}
            {c > 0.01 ? (
              <mesh material={mats.salt} position={[(a + b) / 2, -D + 0.07, P.back / 2]} scale={[c, 1, 1]}>
                <boxGeometry args={[b - a - 3.2, 0.05, -P.back - 0.4]} />
              </mesh>
            ) : null}
            {lv > 0.02 ? (
              <>
                <mesh material={mats.waterFace} position={[0, 0, 0.004]}>
                  <shapeGeometry
                    args={[
                      new THREE.Shape([new THREE.Vector2(a + 1.6, -D + 0.05), new THREE.Vector2(b - 1.6, -D + 0.05), new THREE.Vector2(xb, y), new THREE.Vector2(xa, y)]),
                      1,
                    ]}
                  />
                </mesh>
                <mesh material={mats.waterTop} position={[(xa + xb) / 2, y, P.back / 2]} rotation={[-Math.PI / 2, 0, 0]}>
                  <planeGeometry args={[xb - xa, -P.back]} />
                </mesh>
              </>
            ) : null}
          </group>
        );
      })}
    </group>
  );
};

/** A soft orange heat wisp material set (the heater's warm air), as N1's `HeatWisps` but upright. */
export const useSoftOrange = (count: number) =>
  useMemo(
    () =>
      [...Array(count).keys()].map(
        () => new THREE.MeshBasicMaterial({map: softTexture(), color: raw(section.orange), transparent: true, depthWrite: false, opacity: 0}),
      ),
    [count],
  );

export {INK};
