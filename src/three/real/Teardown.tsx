import React, {createContext, useContext, useMemo} from 'react';
import * as THREE from 'three';
import {CHARGE, HIGHWAY, LAB, MOODS, REAL, section, STREET, TOWER, type Mood} from '../../theme';
import {raw, roundedBox, roundedCylinder} from '../plaster';
import {cutMaterial, CutOutline, INK, type Rect} from '../section/cutLook';
import {skyTexture} from '../section/textures';
import {GlowShell} from './madeBy';
import {applyAlbedo, applyEnv, useAlbedo, useEnvStrength, useStudioEnv} from './useStudioEnv';

type V3 = [number, number, number];

/*
 * No. 011 (N1): The Lab · teardown (style guide v0.14 § 3, "The Lab: teardown dressing"). The Lab's grammar scaled to
 * a car: a cut floor slab and ground block (hatched, inked), the back and left walls standing (cut on top and at the
 * front), the floor in `LAB.floor` with a floor-tape grid (`LAB.tape`, 0.03 m tape, 0.6 m cells) in front of the car;
 * the car on galvanized axle stands at the back; a rolling tool chest at the left wall; nothing readable anywhere.
 * The parts (`TEARDOWN_PARTS`): realistic generic shapes in real materials, laid flat like a teardown photo, one per
 * cell (big ones span cells), grouped by system. Which ones are "bought in" (tires, glass, seats, some chips) is part
 * data: the scene lights the others with the "made by" glow (§ 5) and darkens the bought ones × 0.8 on its `dim` key.
 *
 * World: x across the room (the car's nose toward −x), y up from the floor, z toward the camera (the slab's front
 * face is the cut). Metres.
 */

/** The room (metres): width, depth, wall height and thickness, ground block depth; the floor's back and front z. */
export const TEARDOWN_ROOM = {w: 8.0, d: 7.0, wallH: 3.0, wallT: 0.2, ground: 0.6, z0: -3.5, z1: 3.5, x0: -4.0};
/** The grid: cell size, tape width, columns and rows, its back-left corner (x, z). */
export const TEARDOWN_GRID = {cell: 0.6, tape: 0.03, cols: 10, rows: 7, x0: -3.0, z0: -0.9};
/** The car on its stands: its centre (x, z; the car's own origin), the lift (its floor's underside on the stands). */
export const TEARDOWN_CAR = {x: 0.1, z: -2.0, lift: 0.33};

/** The parts' systems (§ 3 "grouped by system"). */
export type TeardownGroup =
  | 'body'
  | 'lamps'
  | 'glass'
  | 'wheels'
  | 'seats'
  | 'trim'
  | 'pack'
  | 'drive'
  | 'electronics'
  | 'harness'
  | 'chips';

type Kind =
  | 'pack'
  | 'driveUnit'
  | 'inverter'
  | 'box'
  | 'board'
  | 'compressor'
  | 'hvac'
  | 'wheel'
  | 'glass'
  | 'seat'
  | 'bench'
  | 'door'
  | 'panel'
  | 'fender'
  | 'bumper'
  | 'headLamp'
  | 'tailLamp'
  | 'harness'
  | 'hvCable'
  | 'steering'
  | 'subframe'
  | 'radiator'
  | 'mirrors'
  | 'chargePort'
  | 'struts'
  | 'rack'
  | 'motorSmall'
  | 'regulators'
  | 'tank';

/** One part in the grid. */
export type TeardownPart = {
  id: string;
  group: TeardownGroup;
  /** Bought in (the unlit quarter: tires, glass, seats, some chips). */
  bought?: boolean;
  /** Its cells: column, row (row 0 by the car), width and depth in cells. */
  cell: [number, number, number, number];
  kind: Kind;
  /** Kind options: a box's size and finish, a panel's size, a side (mirror the shape). */
  size?: V3;
  dark?: boolean;
  flip?: boolean;
  /** Where it sits in the car (car frame: x forward, y up, z toward the cut) and how it stands there (Euler), for `apart`. */
  from: V3;
  fromRot?: V3;
};

const P = Math.PI / 2;
/**
 * The 52 parts (🎭 illustrative: generic shapes, not a real parts list), 39 made by the maker and 13 bought in
 * (4 wheels and tires, 4 glass, 3 seats, 2 chip boards): exactly 3 of every 4. Grouped by system: body panels and
 * doors, seats and trim (columns 0–3); the drive unit, the pack and the electronics (4–5); harness and small boxes
 * (6–7); wheels and tires, glass and lamps (8–9).
 */
export const TEARDOWN_PARTS: TeardownPart[] = [
  // body panels and doors, seats and trim
  {id: 'hood', group: 'body', cell: [0, 0, 2, 1], kind: 'panel', size: [1.12, 0.05, 0.5], from: [1.75, 0.95, -0.05], fromRot: [0, 0, -0.12]},
  {id: 'trunk', group: 'body', cell: [2, 0, 2, 1], kind: 'panel', size: [1.05, 0.05, 0.46], from: [-2.05, 1.0, -0.05], fromRot: [0, 0, 0.1]},
  {id: 'doorFL', group: 'body', cell: [0, 1, 2, 1], kind: 'door', from: [0.45, 0.75, -0.9], fromRot: [P, 0, 0]},
  {id: 'doorRL', group: 'body', cell: [2, 1, 2, 1], kind: 'door', flip: true, from: [-0.55, 0.75, -0.9], fromRot: [P, 0, 0]},
  {id: 'doorFR', group: 'body', cell: [0, 2, 2, 1], kind: 'door', from: [0.45, 0.75, 0.75], fromRot: [-P, 0, 0]},
  {id: 'doorRR', group: 'body', cell: [2, 2, 2, 1], kind: 'door', flip: true, from: [-0.55, 0.75, 0.75], fromRot: [-P, 0, 0]},
  {id: 'bumperF', group: 'body', cell: [0, 3, 2, 1], kind: 'bumper', from: [2.3, 0.5, -0.05], fromRot: [0, P, 0]},
  {id: 'bumperR', group: 'body', cell: [2, 3, 2, 1], kind: 'bumper', flip: true, from: [-2.35, 0.55, -0.05], fromRot: [0, -P, 0]},
  {id: 'subframeF', group: 'body', cell: [0, 4, 2, 1], kind: 'subframe', from: [1.35, 0.25, -0.05]},
  {id: 'subframeR', group: 'body', cell: [2, 4, 2, 1], kind: 'subframe', flip: true, from: [-1.35, 0.25, -0.05]},
  {id: 'fenderL', group: 'body', cell: [0, 5, 1, 1], kind: 'fender', from: [1.6, 0.85, -0.88], fromRot: [P, 0, 0]},
  {id: 'fenderR', group: 'body', cell: [1, 5, 1, 1], kind: 'fender', flip: true, from: [1.6, 0.85, 0.75], fromRot: [-P, 0, 0]},
  {id: 'mirrors', group: 'body', cell: [2, 5, 1, 1], kind: 'mirrors', from: [0.85, 1.1, -0.05]},
  {id: 'steering', group: 'trim', cell: [3, 5, 1, 1], kind: 'steering', from: [0.55, 1.15, 0.38], fromRot: [0, 0, -1.1]},
  {id: 'seatL', group: 'seats', bought: true, cell: [0, 6, 1, 1], kind: 'seat', from: [0.15, 0.75, -0.38], fromRot: [0, 0, 0.9]},
  {id: 'seatR', group: 'seats', bought: true, cell: [1, 6, 1, 1], kind: 'seat', from: [0.15, 0.75, 0.38], fromRot: [0, 0, 0.9]},
  {id: 'bench', group: 'seats', bought: true, cell: [2, 6, 2, 1], kind: 'bench', from: [-1.3, 0.8, -0.05], fromRot: [0, P, 0]},
  // the drive unit, the pack, the electronics
  {id: 'driveUnit', group: 'drive', cell: [4, 0, 1, 1], kind: 'driveUnit', from: [1.25, 0.6, -0.05]},
  {id: 'inverter', group: 'drive', cell: [5, 0, 1, 1], kind: 'inverter', from: [1.2, 0.92, 0]},
  {id: 'pack', group: 'pack', cell: [4, 1, 2, 3], kind: 'pack', from: [0, 0.22, -0.05], fromRot: [0, P, 0]},
  {id: 'obc', group: 'electronics', cell: [4, 4, 1, 1], kind: 'box', size: [0.36, 0.13, 0.3], from: [1.65, 0.75, 0.3]},
  {id: 'dcdc', group: 'electronics', cell: [5, 4, 1, 1], kind: 'box', size: [0.3, 0.1, 0.24], dark: true, from: [1.65, 0.75, -0.35]},
  {id: 'bms', group: 'electronics', cell: [4, 5, 1, 1], kind: 'box', size: [0.28, 0.07, 0.22], from: [0, 0.3, 0.3]},
  {id: 'vcu', group: 'electronics', cell: [5, 5, 1, 1], kind: 'box', size: [0.24, 0.06, 0.18], dark: true, from: [0.9, 0.7, 0.3]},
  {id: 'thermal', group: 'electronics', cell: [4, 6, 1, 1], kind: 'compressor', size: [0.2, 0.16, 0.3], from: [1.8, 0.55, 0.2]},
  {id: 'chargePort', group: 'electronics', cell: [5, 6, 1, 1], kind: 'chargePort', from: [-2.05, 0.9, 0.75]},
  // harness and small boxes
  {id: 'hvac', group: 'electronics', cell: [6, 0, 1, 1], kind: 'hvac', from: [0.9, 0.95, -0.05]},
  {id: 'compressor', group: 'electronics', cell: [7, 0, 1, 1], kind: 'compressor', from: [1.75, 0.5, -0.3]},
  {id: 'radiator', group: 'harness', cell: [6, 1, 1, 1], kind: 'radiator', from: [2.15, 0.55, -0.05], fromRot: [0, 0, P]},
  {id: 'harness', group: 'harness', cell: [7, 1, 1, 1], kind: 'harness', from: [0.2, 0.5, -0.4]},
  {id: 'hvCable', group: 'harness', cell: [6, 2, 1, 1], kind: 'hvCable', from: [0.9, 0.4, 0]},
  {id: 'chipsA', group: 'chips', bought: true, cell: [7, 2, 1, 1], kind: 'board', from: [0.95, 1.0, 0.2]},
  {id: 'chipsB', group: 'chips', bought: true, cell: [6, 3, 1, 1], kind: 'board', flip: true, from: [0.95, 1.0, -0.4]},
  {id: 'rack', group: 'harness', cell: [7, 3, 1, 1], kind: 'rack', from: [1.3, 0.45, -0.05]},
  {id: 'struts', group: 'harness', cell: [6, 4, 1, 1], kind: 'struts', from: [1.35, 0.75, -0.6], fromRot: [0, 0, P]},
  {id: 'wiper', group: 'harness', cell: [7, 4, 1, 1], kind: 'motorSmall', from: [1.15, 1.05, -0.3]},
  {id: 'regulators', group: 'harness', cell: [6, 5, 1, 1], kind: 'regulators', from: [0.1, 0.9, -0.85], fromRot: [P, 0, 0]},
  {id: 'washer', group: 'harness', cell: [7, 5, 1, 1], kind: 'tank', from: [1.9, 0.6, 0.45]},
  {id: 'fuseBox', group: 'harness', cell: [6, 6, 1, 1], kind: 'box', size: [0.26, 0.1, 0.2], dark: true, from: [1.6, 0.85, -0.5]},
  {id: 'bodyCtrl', group: 'harness', cell: [7, 6, 1, 1], kind: 'box', size: [0.22, 0.05, 0.16], from: [0.75, 0.65, -0.6]},
  // wheels and tires, glass and lamps
  {id: 'wheelFL', group: 'wheels', bought: true, cell: [8, 0, 1, 1], kind: 'wheel', from: [1.35, 0.36, -0.8], fromRot: [P, 0, 0]},
  {id: 'wheelFR', group: 'wheels', bought: true, cell: [9, 0, 1, 1], kind: 'wheel', from: [1.35, 0.36, 0.8], fromRot: [P, 0, 0]},
  {id: 'wheelRL', group: 'wheels', bought: true, cell: [8, 1, 1, 1], kind: 'wheel', from: [-1.35, 0.36, -0.8], fromRot: [P, 0, 0]},
  {id: 'wheelRR', group: 'wheels', bought: true, cell: [9, 1, 1, 1], kind: 'wheel', from: [-1.35, 0.36, 0.8], fromRot: [P, 0, 0]},
  {id: 'windshield', group: 'glass', bought: true, cell: [8, 2, 2, 1], kind: 'glass', size: [1.14, 0.012, 0.5], from: [0.8, 1.3, -0.05], fromRot: [0, P, 0.7]},
  {id: 'rearGlass', group: 'glass', bought: true, cell: [8, 3, 2, 1], kind: 'glass', size: [1.04, 0.012, 0.42], from: [-1.2, 1.35, -0.05], fromRot: [0, P, -0.6]},
  {id: 'sideL', group: 'glass', bought: true, cell: [8, 4, 1, 1], kind: 'glass', size: [0.52, 0.01, 0.34], from: [0.3, 1.25, -0.88], fromRot: [P, 0, 0]},
  {id: 'sideR', group: 'glass', bought: true, cell: [9, 4, 1, 1], kind: 'glass', size: [0.52, 0.01, 0.34], from: [-0.6, 1.25, -0.88], fromRot: [P, 0, 0]},
  {id: 'headL', group: 'lamps', cell: [8, 5, 1, 1], kind: 'headLamp', from: [2.3, 0.82, -0.6], fromRot: [0, P, 0]},
  {id: 'headR', group: 'lamps', cell: [9, 5, 1, 1], kind: 'headLamp', flip: true, from: [2.3, 0.82, 0.55], fromRot: [0, P, 0]},
  {id: 'tailL', group: 'lamps', cell: [8, 6, 1, 1], kind: 'tailLamp', from: [-2.4, 0.98, -0.68], fromRot: [0, -P, 0]},
  {id: 'tailR', group: 'lamps', cell: [9, 6, 1, 1], kind: 'tailLamp', flip: true, from: [-2.4, 0.98, 0.66], fromRot: [0, -P, 0]},
];

/** A part's centre on the floor (x, z). */
export const partCentre = (p: TeardownPart): [number, number] => {
  const G = TEARDOWN_GRID;
  const [c, r, w, h] = p.cell;
  return [G.x0 + (c + w / 2) * G.cell, G.z0 + (r + h / 2) * G.cell];
};

/** The parts' materials (real, neutral; never orange). `bought` parts get their own set so `dim` darkens only them. */
export const useTeardownMaterials = (mood: Mood, paint: string, dim: number) => {
  const env = useStudioEnv();
  const envScale = useEnvStrength();
  const albedo = useAlbedo();
  const make = () => {
    const ph = (c: string, o: THREE.MeshPhysicalMaterialParameters = {}) => new THREE.MeshPhysicalMaterial({color: raw(c), ...o});
    return {
      paint: ph(paint, {roughness: 0.32, metalness: 0.35, clearcoat: 1, clearcoatRoughness: 0.14}),
      eCoat: ph(REAL.labDark, {roughness: 0.6, metalness: 0.2}),
      housing: ph(REAL.housing, {roughness: 0.5, metalness: 0.55}),
      alu: ph(REAL.alu, {roughness: 0.35, metalness: 0.8}),
      steel: ph(REAL.steel, {roughness: 0.4, metalness: 0.7}),
      darkSteel: ph(REAL.rimPaint, {roughness: 0.55, metalness: 0.4}),
      plastic: ph(REAL.dash, {roughness: 0.6}),
      black: ph(REAL.receiver, {roughness: 0.5}),
      copper: ph(REAL.copper, {roughness: 0.4, metalness: 0.7}),
      cable: ph(REAL.cable, {roughness: 0.6}),
      greyCable: ph(TOWER.wireGrey, {roughness: 0.6}),
      rubber: ph(REAL.tire, {roughness: 0.85}),
      rim: ph(REAL.rim, {roughness: 0.3, metalness: 0.85}),
      glass: ph(REAL.carGlass, {roughness: 0.06, clearcoat: 1, transparent: true, opacity: 0.62, depthWrite: false}),
      frit: ph(REAL.labDark, {roughness: 0.4}),
      seat: ph(REAL.seat, {roughness: 0.85}),
      trim: ph(REAL.dash, {roughness: 0.7}),
      pcb: ph(REAL.pcb, {roughness: 0.55}),
      chip: ph(REAL.chip, {roughness: 0.4}),
      lens: ph(STREET.lamp, {roughness: 0.12, clearcoat: 1}),
      tailLens: ph(HIGHWAY.tailLens, {roughness: 0.2, clearcoat: 1}),
      module: ph(REAL.module, {roughness: 0.55}),
      tank: ph(REAL.liner, {roughness: 0.5}),
    };
  };
  const mats = useMemo(make, [paint]);
  const boughtMats = useMemo(make, [paint]);
  const envList = (m: ReturnType<typeof make>): [THREE.MeshStandardMaterial, number][] => [
    [m.paint, 0.8],
    [m.housing, 0.6],
    [m.alu, 0.9],
    [m.steel, 0.8],
    [m.darkSteel, 0.6],
    [m.copper, 0.7],
    [m.rim, 1],
    [m.glass, 1.4],
    [m.lens, 0.8],
    [m.tailLens, 0.6],
  ];
  applyEnv(env, envList(mats), envScale);
  applyEnv(env, envList(boughtMats), envScale);
  const all = (m: ReturnType<typeof make>) => Object.values(m) as THREE.Material[];
  applyAlbedo(all(mats), albedo);
  // the bought quarter a step darker on the `dim` key (§ 3: × 0.8, never further)
  applyAlbedo(all(boughtMats), albedo * (1 - 0.2 * Math.max(0, Math.min(1, dim))));
  void mood;
  return {mats, boughtMats};
};
export type TeardownMats = ReturnType<typeof useTeardownMaterials>['mats'];

/** A part's hull for the glow (a box or a drum round its silhouette, centred on the part's origin). */
export const partHull = (p: TeardownPart): {geo: THREE.BufferGeometry; at: V3} => {
  const k = p.kind;
  const s = p.size;
  const box = (w: number, h: number, d: number) => ({geo: roundedBox(w, h, d, Math.min(w, h, d) * 0.3, 2), at: [0, h / 2, 0] as V3});
  switch (k) {
    case 'pack':
      return box(1.12, 0.17, 1.68);
    case 'wheel':
      return {geo: roundedCylinder(0.29, 0.19, 0.04, 40), at: [0, 0.095, 0]};
    case 'steering':
      return {geo: roundedCylinder(0.19, 0.06, 0.02, 40), at: [0, 0.035, 0]};
    case 'harness':
    case 'hvCable':
      return {geo: roundedCylinder(0.24, 0.07, 0.02, 32), at: [0, 0.035, 0]};
    case 'door':
      return box(1.12, 0.09, 0.52);
    case 'bumper':
      return box(1.12, 0.14, 0.26);
    case 'subframe':
      return box(1.04, 0.1, 0.44);
    case 'fender':
      return box(0.52, 0.06, 0.46);
    case 'seat':
      return box(0.5, 0.2, 0.52);
    case 'bench':
      return box(1.1, 0.16, 0.46);
    case 'driveUnit':
      return box(0.46, 0.3, 0.36);
    case 'inverter':
      return box(0.34, 0.12, 0.28);
    case 'compressor':
      return box(s ? s[0] + 0.1 : 0.34, s ? s[1] + 0.04 : 0.18, s ? s[2] + 0.04 : 0.24);
    case 'hvac':
      return box(0.46, 0.22, 0.34);
    case 'board':
      return box(0.32, 0.04, 0.24);
    case 'radiator':
      return box(0.5, 0.06, 0.4);
    case 'mirrors':
      return box(0.46, 0.12, 0.3);
    case 'chargePort':
      return box(0.2, 0.12, 0.2);
    case 'struts':
      return box(0.48, 0.12, 0.34);
    case 'rack':
      return box(0.52, 0.1, 0.2);
    case 'motorSmall':
      return box(0.26, 0.1, 0.2);
    case 'regulators':
      return box(0.42, 0.04, 0.36);
    case 'tank':
      return box(0.26, 0.16, 0.2);
    case 'headLamp':
    case 'tailLamp':
      return box(0.44, 0.12, 0.24);
    default:
      return box(s ? s[0] : 0.3, s ? s[1] : 0.1, s ? s[2] : 0.3);
  }
};

/**
 * The "made by" glow on the part being drawn (§ 5): every mesh of a lit part wears its own shell (the silhouette line
 * and the 25 % halo), so the glow hugs the part's real shape and never reads as a tile under it.
 */
export const PartGlow = createContext<{lit: number; surge: number; r: number; dim: number} | null>(null);

const M: React.FC<{g: THREE.BufferGeometry; m: THREE.Material; p?: V3; r?: V3; s?: V3}> = ({g, m, p, r, s}) => {
  const glow = useContext(PartGlow);
  return (
    <>
      <mesh geometry={g} material={m} position={p} rotation={r} scale={s} castShadow receiveShadow />
      {glow && glow.lit > 0.003 ? (
        <GlowShell geometry={g} lit={glow.lit} surge={glow.surge} r={glow.r} core dim={glow.dim} position={p} rotation={r} scale={s} />
      ) : null}
    </>
  );
};
const rb = (w: number, h: number, d: number, r = 0.012, seg = 2) => roundedBox(w, h, d, r, seg);
const CYL = (() => {
  const cache = new Map<string, THREE.BufferGeometry>();
  return (r0: number, r1: number, h: number, n = 24) => {
    const k = `${r0}:${r1}:${h}:${n}`;
    let g = cache.get(k);
    if (!g) {
      g = new THREE.CylinderGeometry(r0, r1, h, n);
      cache.set(k, g);
    }
    return g;
  };
})();
const TOR = (() => {
  const cache = new Map<string, THREE.BufferGeometry>();
  return (r: number, tube: number) => {
    const k = `${r}:${tube}`;
    let g = cache.get(k);
    if (!g) {
      g = new THREE.TorusGeometry(r, tube, 10, 40);
      cache.set(k, g);
    }
    return g;
  };
})();

/** One part, lying flat on the floor at its origin (x along the grid's columns, z along its rows). */
export const PartModel: React.FC<{part: TeardownPart; mats: TeardownMats}> = ({part, mats: m}) => {
  const s = part.size;
  const f = part.flip ? -1 : 1;
  switch (part.kind) {
    case 'pack':
      // the pack laid flat: its casing, lid ribs, the HV connector box at the front
      return (
        <group>
          <M g={rb(1.1, 0.15, 1.66, 0.02, 3)} m={m.housing} p={[0, 0.075, 0]} />
          {[-0.55, -0.18, 0.18, 0.55].map((z) => (
            <M key={z} g={rb(1.04, 0.012, 0.04, 0.005)} m={m.alu} p={[0, 0.155, z]} />
          ))}
          <M g={rb(0.28, 0.08, 0.12)} m={m.black} p={[0.28, 0.19, -0.74]} />
          <M g={rb(0.12, 0.05, 0.08)} m={m.black} p={[-0.3, 0.175, -0.76]} />
        </group>
      );
    case 'driveUnit':
      return (
        <group>
          <M g={CYL(0.13, 0.13, 0.26, 32)} m={m.alu} p={[-0.08, 0.13, 0]} r={[0, 0, P]} />
          <M g={rb(0.18, 0.24, 0.3, 0.03)} m={m.housing} p={[0.13, 0.12, 0]} />
          <M g={CYL(0.03, 0.03, 0.34, 16)} m={m.steel} p={[0.13, 0.08, 0]} r={[P, 0, 0]} />
          <M g={rb(0.2, 0.06, 0.18)} m={m.housing} p={[-0.06, 0.27, 0]} />
        </group>
      );
    case 'inverter':
      return (
        <group>
          <M g={rb(0.32, 0.09, 0.26, 0.015)} m={m.alu} p={[0, 0.045, 0]} />
          {[-0.09, 0, 0.09].map((x) => (
            <M key={x} g={CYL(0.018, 0.018, 0.05, 12)} m={m.black} p={[x, 0.1, -0.1]} />
          ))}
          <M g={rb(0.08, 0.04, 0.06)} m={m.black} p={[0.11, 0.1, 0.08]} />
        </group>
      );
    case 'box': {
      const [w, h, d] = s ?? [0.3, 0.1, 0.24];
      return (
        <group>
          <M g={rb(w, h, d, 0.012)} m={part.dark ? m.black : m.housing} p={[0, h / 2, 0]} />
          <M g={rb(w * 0.3, 0.035, 0.05)} m={m.black} p={[w * 0.22, h + 0.017, -d * 0.32]} />
          <M g={rb(w * 0.18, 0.03, 0.04)} m={m.black} p={[-w * 0.25, h + 0.015, -d * 0.34]} />
        </group>
      );
    }
    case 'board':
      return (
        <group>
          <M g={rb(0.3, 0.012, 0.22, 0.003)} m={m.pcb} p={[0, 0.006, 0]} />
          <M g={rb(0.07, 0.012, 0.07, 0.003)} m={m.chip} p={[-0.06 * f, 0.018, 0.02]} />
          <M g={rb(0.05, 0.01, 0.05, 0.003)} m={m.chip} p={[0.06 * f, 0.017, -0.05]} />
          <M g={rb(0.04, 0.01, 0.03, 0.003)} m={m.chip} p={[0.08 * f, 0.017, 0.06]} />
          <M g={rb(0.09, 0.02, 0.03, 0.004)} m={m.black} p={[0, 0.022, -0.09]} />
        </group>
      );
    case 'compressor': {
      const [w, h, d] = s ?? [0.24, 0.14, 0.2];
      return (
        <group>
          <M g={CYL(h / 2, h / 2, w, 24)} m={m.alu} p={[0, h / 2, 0]} r={[0, 0, P]} />
          <M g={rb(w * 0.45, h * 0.8, d, 0.01)} m={m.housing} p={[w * 0.55, h * 0.4, 0]} />
          <M g={CYL(0.025, 0.025, 0.06, 12)} m={m.black} p={[-w * 0.2, h + 0.02, 0]} />
        </group>
      );
    }
    case 'hvac':
      return (
        <group>
          <M g={rb(0.42, 0.18, 0.3, 0.02)} m={m.plastic} p={[0, 0.09, 0]} />
          <M g={CYL(0.06, 0.06, 0.12, 16)} m={m.black} p={[-0.14, 0.2, 0]} />
          <M g={rb(0.12, 0.06, 0.18, 0.01)} m={m.black} p={[0.14, 0.2, 0]} />
        </group>
      );
    case 'wheel':
      // the wheel and tire laid flat, its outer face up
      return (
        <group>
          <M g={roundedCylinder(0.29, 0.19, 0.05, 48)} m={m.rubber} p={[0, 0.095, 0]} />
          <M g={CYL(0.2, 0.2, 0.012, 40)} m={m.rim} p={[0, 0.192, 0]} />
          {[0, 1, 2, 3, 4].map((i) => (
            <M key={i} g={rb(0.17, 0.014, 0.05, 0.005)} m={m.rim} p={[0.09 * Math.cos((i * 2 * Math.PI) / 5), 0.2, 0.09 * Math.sin((i * 2 * Math.PI) / 5)]} r={[0, (-i * 2 * Math.PI) / 5, 0]} />
          ))}
          <M g={CYL(0.045, 0.045, 0.03, 20)} m={m.steel} p={[0, 0.205, 0]} />
        </group>
      );
    case 'glass': {
      const [w, , d] = s ?? [1, 0.012, 0.45];
      return (
        <group>
          <M g={rb(w, 0.012, d, 0.004)} m={m.glass} p={[0, 0.03, 0]} />
          <M g={rb(w, 0.004, 0.035, 0.002)} m={m.frit} p={[0, 0.038, d / 2 - 0.018]} />
          <M g={rb(w, 0.004, 0.035, 0.002)} m={m.frit} p={[0, 0.038, -d / 2 + 0.018]} />
          {/* two foam blocks under it, so it doesn't lie on the floor */}
          <M g={rb(0.08, 0.024, d * 0.8, 0.004)} m={m.black} p={[-w * 0.35, 0.012, 0]} />
          <M g={rb(0.08, 0.024, d * 0.8, 0.004)} m={m.black} p={[w * 0.35, 0.012, 0]} />
        </group>
      );
    }
    case 'seat':
      // a front seat on its back: cushion, back, headrest, the frame's rails
      return (
        <group>
          <M g={rb(0.46, 0.12, 0.22, 0.04, 3)} m={m.seat} p={[0, 0.1, 0.14]} />
          <M g={rb(0.46, 0.1, 0.28, 0.04, 3)} m={m.seat} p={[0, 0.05, -0.1]} />
          <M g={rb(0.22, 0.08, 0.1, 0.03, 3)} m={m.seat} p={[0, 0.04, -0.29]} />
          <M g={rb(0.04, 0.03, 0.3, 0.008)} m={m.steel} p={[-0.17, 0.175, 0.12]} />
          <M g={rb(0.04, 0.03, 0.3, 0.008)} m={m.steel} p={[0.17, 0.175, 0.12]} />
        </group>
      );
    case 'bench':
      return (
        <group>
          <M g={rb(1.08, 0.12, 0.22, 0.04, 3)} m={m.seat} p={[0, 0.06, 0.1]} />
          <M g={rb(1.08, 0.09, 0.2, 0.04, 3)} m={m.seat} p={[0, 0.045, -0.12]} />
        </group>
      );
    case 'door':
      // a door shell laid flat, outer skin up: the skin, the trim's edge under it, the handle; the window frame removed
      return (
        <group scale={[f, 1, 1]}>
          <M g={rb(1.08, 0.05, 0.5, 0.02, 3)} m={m.paint} p={[0, 0.045, 0]} />
          <M g={rb(1.0, 0.03, 0.44, 0.01)} m={m.trim} p={[0, 0.012, 0]} />
          <M g={rb(0.14, 0.012, 0.03, 0.006)} m={m.black} p={[-0.3, 0.075, -0.12]} />
        </group>
      );
    case 'panel': {
      const [w, h, d] = s ?? [1, 0.05, 0.5];
      return (
        <group>
          <M g={rb(w, h, d, 0.02, 3)} m={m.paint} p={[0, h / 2 + 0.02, 0]} />
          <M g={rb(w * 0.9, 0.02, d * 0.8, 0.006)} m={m.eCoat} p={[0, 0.01, 0]} />
        </group>
      );
    }
    case 'fender':
      return (
        <group scale={[f, 1, 1]}>
          <M g={rb(0.5, 0.05, 0.44, 0.02, 3)} m={m.paint} p={[0, 0.045, 0]} />
          <M g={CYL(0.17, 0.17, 0.052, 32)} m={m.eCoat} p={[0.06, 0.047, 0.16]} />
        </group>
      );
    case 'bumper':
      return (
        <group scale={[f, 1, 1]}>
          <M g={rb(1.1, 0.12, 0.2, 0.04, 3)} m={m.paint} p={[0, 0.06, 0.02]} />
          <M g={rb(0.7, 0.05, 0.06, 0.01)} m={m.black} p={[0, 0.06, 0.12]} />
        </group>
      );
    case 'subframe':
      return (
        <group scale={[f, 1, 1]}>
          {[-0.17, 0.17].map((z) => (
            <M key={z} g={rb(1.0, 0.07, 0.06, 0.01)} m={m.darkSteel} p={[0, 0.035, z]} />
          ))}
          {[-0.4, 0, 0.4].map((x) => (
            <M key={x} g={rb(0.06, 0.06, 0.36, 0.01)} m={m.darkSteel} p={[x, 0.07, 0]} />
          ))}
        </group>
      );
    case 'headLamp':
      return (
        <group scale={[f, 1, 1]}>
          <M g={rb(0.42, 0.1, 0.2, 0.03, 3)} m={m.black} p={[0, 0.05, 0]} />
          <M g={rb(0.38, 0.02, 0.17, 0.008)} m={m.lens} p={[0, 0.105, 0]} />
        </group>
      );
    case 'tailLamp':
      return (
        <group scale={[f, 1, 1]}>
          <M g={rb(0.4, 0.09, 0.2, 0.03, 3)} m={m.black} p={[0, 0.045, 0]} />
          <M g={rb(0.36, 0.02, 0.16, 0.008)} m={m.tailLens} p={[0, 0.095, 0]} />
        </group>
      );
    case 'harness':
      return (
        <group>
          <M g={TOR(0.17, 0.03)} m={m.cable} p={[0, 0.03, 0]} r={[P, 0, 0]} />
          <M g={TOR(0.12, 0.022)} m={m.greyCable} p={[0.03, 0.045, 0.01]} r={[P, 0, 0]} />
          <M g={rb(0.06, 0.04, 0.05)} m={m.black} p={[0.2, 0.03, 0.06]} />
          <M g={rb(0.05, 0.035, 0.04)} m={m.black} p={[-0.18, 0.03, -0.08]} />
        </group>
      );
    case 'hvCable':
      // the high-voltage cables, coiled (grey here: never in the reserved band)
      return (
        <group>
          <M g={TOR(0.18, 0.025)} m={m.greyCable} p={[0, 0.026, 0]} r={[P, 0, 0]} />
          <M g={TOR(0.13, 0.025)} m={m.greyCable} p={[0, 0.026, 0]} r={[P, 0, 0]} />
          <M g={rb(0.08, 0.05, 0.06)} m={m.alu} p={[0.21, 0.03, 0]} />
        </group>
      );
    case 'steering':
      return (
        <group>
          <M g={TOR(0.16, 0.02)} m={m.trim} p={[0, 0.03, 0]} r={[P, 0, 0]} />
          {[0, 2.1, -2.1].map((a) => (
            <M key={a} g={rb(0.13, 0.015, 0.03, 0.006)} m={m.trim} p={[0.075 * Math.cos(a), 0.03, 0.075 * Math.sin(a)]} r={[0, -a, 0]} />
          ))}
          <M g={CYL(0.055, 0.055, 0.04, 20)} m={m.trim} p={[0, 0.035, 0]} />
        </group>
      );
    case 'radiator':
      return (
        <group>
          <M g={rb(0.48, 0.04, 0.36, 0.006)} m={m.alu} p={[0, 0.02, 0]} />
          {[-0.2, 0.2].map((x) => (
            <M key={x} g={rb(0.04, 0.06, 0.38, 0.008)} m={m.black} p={[x, 0.03, 0]} />
          ))}
        </group>
      );
    case 'mirrors':
      return (
        <group>
          {[-0.12, 0.12].map((x) => (
            <group key={x} position={[x, 0, 0]}>
              <M g={rb(0.2, 0.1, 0.14, 0.04, 3)} m={m.paint} p={[0, 0.05, 0]} />
              <M g={rb(0.16, 0.012, 0.1, 0.004)} m={m.glass} p={[0, 0.103, 0]} />
            </group>
          ))}
        </group>
      );
    case 'chargePort':
      return (
        <group>
          <M g={rb(0.18, 0.06, 0.18, 0.01)} m={m.black} p={[0, 0.03, 0]} />
          <M g={CYL(0.05, 0.05, 0.05, 20)} m={m.plastic} p={[0, 0.08, 0]} />
        </group>
      );
    case 'struts':
      return (
        <group>
          {[-0.09, 0.09].map((z) => (
            <group key={z} position={[0, 0.05, z]}>
              <M g={CYL(0.035, 0.035, 0.42, 16)} m={m.steel} r={[0, 0, P]} />
              <M g={CYL(0.06, 0.06, 0.16, 16)} m={m.darkSteel} p={[0.08, 0, 0]} r={[0, 0, P]} />
            </group>
          ))}
        </group>
      );
    case 'rack':
      return (
        <group>
          <M g={CYL(0.03, 0.03, 0.5, 16)} m={m.steel} p={[0, 0.04, 0]} r={[0, 0, P]} />
          <M g={rb(0.14, 0.08, 0.1, 0.01)} m={m.alu} p={[0.06, 0.05, 0]} />
        </group>
      );
    case 'motorSmall':
      return (
        <group>
          <M g={CYL(0.04, 0.04, 0.12, 16)} m={m.steel} p={[-0.04, 0.04, 0]} r={[0, 0, P]} />
          <M g={rb(0.1, 0.07, 0.1, 0.01)} m={m.black} p={[0.07, 0.035, 0]} />
        </group>
      );
    case 'regulators':
      return (
        <group>
          <M g={rb(0.4, 0.012, 0.04, 0.004)} m={m.steel} p={[0, 0.01, -0.12]} r={[0, 0.6, 0]} />
          <M g={rb(0.4, 0.012, 0.04, 0.004)} m={m.steel} p={[0, 0.01, 0.06]} r={[0, -0.6, 0]} />
          <M g={CYL(0.035, 0.035, 0.05, 14)} m={m.black} p={[0, 0.03, -0.03]} />
        </group>
      );
    case 'tank':
      return (
        <group>
          <M g={rb(0.24, 0.14, 0.18, 0.03, 3)} m={m.tank} p={[0, 0.07, 0]} />
          <M g={CYL(0.025, 0.025, 0.04, 12)} m={m.black} p={[0.06, 0.16, 0.04]} />
        </group>
      );
    default:
      return null;
  }
};

/** A galvanized axle stand: a pyramid of four legs, the centre column, a saddle on top (its top at `h`). */
export const AxleStand: React.FC<{position: V3; h?: number; mat: THREE.Material}> = ({position, h = 0.45, mat}) => (
  <group position={position}>
    <mesh geometry={CYL(0.05, 0.17, 0.26, 4)} material={mat} position={[0, 0.13, 0]} rotation={[0, Math.PI / 4, 0]} castShadow receiveShadow />
    <mesh geometry={CYL(0.025, 0.025, h - 0.06, 14)} material={mat} position={[0, (h - 0.06) / 2 + 0.03, 0]} castShadow />
    <mesh geometry={rb(0.1, 0.03, 0.06, 0.006)} material={mat} position={[0, h - 0.015, 0]} castShadow />
    {[-0.04, 0.04].map((x) => (
      <mesh key={x} geometry={rb(0.012, 0.04, 0.06, 0.004)} material={mat} position={[x, h + 0.01, 0]} />
    ))}
  </group>
);

/** The rolling tool chest (`CHARGE.cabinetDark`): drawers with plain bar handles, casters; nothing readable. */
export const ToolChest: React.FC<{position: V3; mats: {body: THREE.Material; handle: THREE.Material; wheel: THREE.Material}}> = ({position, mats}) => (
  <group position={position}>
    <mesh geometry={rb(0.68, 0.92, 0.46, 0.02, 3)} material={mats.body} position={[0, 0.56, 0]} castShadow receiveShadow />
    {[0.25, 0.42, 0.59, 0.76, 0.93].map((y) => (
      <mesh key={y} geometry={rb(0.5, 0.016, 0.02, 0.006)} material={mats.handle} position={[0, y, 0.24]} />
    ))}
    {[-0.28, 0.28].flatMap((x) =>
      [-0.17, 0.17].map((z) => (
        <mesh key={`${x}${z}`} geometry={CYL(0.045, 0.045, 0.03, 16)} material={mats.wheel} position={[x, 0.05, z]} rotation={[P, 0, 0]} />
      )),
    )}
  </group>
);

/** The room: the cut block, floor with the tape grid, the two walls, the sky behind (see the file comment). */
export const TeardownRoom: React.FC<{mood: Mood; inkScale?: number; grid?: boolean}> = ({mood, inkScale = 1, grid = true}) => {
  const m = MOODS[mood];
  const lab = LAB[mood];
  const albedo = useAlbedo();
  const env = useStudioEnv();
  const envScale = useEnvStrength();
  const mats = useMemo(() => {
    const std = (c: string, r = 0.9) => new THREE.MeshStandardMaterial({color: raw(c), roughness: r, metalness: 0});
    return {
      cut: cutMaterial(),
      earth: std(m.earth, 1),
      floor: std(lab.floor, 0.95),
      wall: std(m.wall, 0.95),
      tape: new THREE.MeshStandardMaterial({color: raw(lab.tape), roughness: 0.7, polygonOffset: true, polygonOffsetFactor: -2}),
      sky: new THREE.MeshBasicMaterial({map: skyTexture(mood), fog: false}),
      chest: new THREE.MeshPhysicalMaterial({color: raw(CHARGE.cabinetDark), roughness: 0.4, metalness: 0.3, clearcoat: 0.4}),
      handle: new THREE.MeshPhysicalMaterial({color: raw(REAL.steel), roughness: 0.3, metalness: 0.9}),
      wheel: new THREE.MeshStandardMaterial({color: raw(REAL.rubber), roughness: 0.8}),
    };
  }, [m, lab, mood]);
  mats.sky.color.setScalar(1 / m.exposure);
  applyEnv(env, [[mats.chest, 0.6], [mats.handle, 1]], envScale);
  applyAlbedo([mats.floor, mats.wall, mats.tape, mats.chest, mats.wheel], albedo);
  const R = TEARDOWN_ROOM;
  const G = TEARDOWN_GRID;
  const X1 = R.x0 + R.w;
  const D = R.d;
  const rects: Rect[] = [
    [
      [R.x0, -R.ground, R.z1],
      [X1, 0, R.z1],
    ],
    [
      [X1, -R.ground, R.z0],
      [X1, 0, R.z1],
    ],
    [
      [X1, 0, R.z0 - R.wallT],
      [X1, R.wallH, R.z0],
    ],
    [
      [R.x0 - R.wallT, 0, R.z1],
      [R.x0, R.wallH, R.z1],
    ],
  ];
  const top: V3[] = [
    [R.x0 - R.wallT, R.wallH, R.z0 - R.wallT],
    [X1, R.wallH, R.z0 - R.wallT],
    [X1, R.wallH, R.z0],
    [R.x0, R.wallH, R.z0],
    [R.x0, R.wallH, R.z1],
    [R.x0 - R.wallT, R.wallH, R.z1],
  ];
  const edges = top.map((p, i) => [p, top[(i + 1) % top.length]] as [V3, V3]);
  const gw = G.cols * G.cell;
  const gd = G.rows * G.cell;
  return (
    <group>
      <mesh position={[0, 8, -40]} material={mats.sky}>
        <planeGeometry args={[160, 90]} />
      </mesh>
      <mesh position={[R.x0 + R.w / 2, -R.ground / 2, R.z0 + D / 2]} material={[mats.cut, mats.earth, mats.floor, mats.earth, mats.cut, mats.earth]} receiveShadow>
        <boxGeometry args={[R.w, R.ground, D]} />
      </mesh>
      <mesh position={[R.x0 + R.w / 2 - R.wallT / 2, R.wallH / 2, R.z0 - R.wallT / 2]} material={[mats.cut, mats.cut, mats.cut, mats.cut, mats.wall, mats.wall]} castShadow receiveShadow>
        <boxGeometry args={[R.w + R.wallT, R.wallH, R.wallT]} />
      </mesh>
      <mesh position={[R.x0 - R.wallT / 2, R.wallH / 2, R.z0 + D / 2]} material={[mats.wall, mats.wall, mats.cut, mats.cut, mats.cut, mats.cut]} castShadow receiveShadow>
        <boxGeometry args={[R.wallT, R.wallH, D]} />
      </mesh>
      <CutOutline rects={rects} edges={edges} thickness={INK * inkScale} />
      {/* the floor-tape grid (LAB.tape, never ink) */}
      {grid ? (
        <group position={[0, 0.0015, 0]}>
          {[...Array(G.cols + 1).keys()].map((i) => (
            <mesh key={`c${i}`} material={mats.tape} position={[G.x0 + i * G.cell, 0, G.z0 + gd / 2]} rotation={[-P, 0, 0]} receiveShadow>
              <planeGeometry args={[G.tape, gd + G.tape]} />
            </mesh>
          ))}
          {[...Array(G.rows + 1).keys()].map((j) => (
            <mesh key={`r${j}`} material={mats.tape} position={[G.x0 + gw / 2, 0, G.z0 + j * G.cell]} rotation={[-P, 0, 0]} receiveShadow>
              <planeGeometry args={[gw + G.tape, G.tape]} />
            </mesh>
          ))}
        </group>
      ) : null}
      <ToolChest position={[R.x0 + 0.42, 0, R.z0 + 1.0]} mats={{body: mats.chest, handle: mats.handle, wheel: mats.wheel}} />
    </group>
  );
};

/** Ink line material for the scan line (`cutLine`, unlit, both moods). */
export const scanMaterial = () => new THREE.MeshBasicMaterial({color: raw(section.cutLine)});
