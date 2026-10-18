import React, {useMemo} from 'react';
import {random} from 'remotion';
import * as THREE from 'three';
import {MOODS, REAL, section, TOWER, type Mood} from '../../theme';
import {raw} from '../plaster';
import {useLabMaterials} from '../real/RealLab';
import {applyEnv, useEnvStrength, useStudioEnv} from '../real/useStudioEnv';
import type {Gesture} from '../rig';
import {cutMaterial, CutOutline, type Rect} from './cutLook';
import {
  CABINET,
  CALL_PANEL,
  CarOperatingPanel,
  cladMaterial,
  ControllerCabinet,
  DestinationKeypad,
  DoorFrame,
  HallCallPanel,
  HallLantern,
  KEYPAD,
  keypadKeyLocal,
  useKitMaterials,
  type KitMaterials,
} from './elevatorKit';
import {Figure} from './Figure';
import {
  bump,
  carStateAt,
  handAt,
  personAt,
  pushIndex,
  PUSH_CONTACT,
  type CarMotion,
  type PersonSpec,
  type PersonState,
  type Resolver,
  type SpotPos,
} from './towerMotion';
import {useFontsLoaded} from './useFontsLoaded';

type V3 = [number, number, number];

/**
 * T, the tower (No. 003): an office building cut open like a dollhouse, in The Section. The cut runs
 * across the whole front (z = `hallFront`), so every level is a horizontal band: a hall (the elevator
 * landing) in front, thin floor slabs, and behind it the bank of shafts (default A to D). The landing
 * doors are cut down to low stubs (their sections hatched) so the cars show; the cars are cut open at
 * their fronts, their door leaves cut to the same stubs. Rails, ropes and counterweights; stone piers
 * between the doors carry the call panels; a doorway at each hall's left end leads to the offices.
 * A machine room on top holds the hoist machines and the group controller (its front cut open).
 *
 * The `hotel` variant (K) uses the same kit: no call panels, a deeper, taller lobby with wings
 * (reception on the left, the street entrance on the right), full landing doors lettered A–D in the
 * lobby, and the destination keypad on its pedestal.
 */
export const TOWER_DIM = {
  outer: 0.25,
  pier: 0.4,
  shaftW: 2.2,
  /** z: the back wall, the shafts' back, the shaft front (inner, outer face), the cut at the hall's front. */
  back: -2.9,
  shaftBack: -2.7,
  frontIn: -0.3,
  frontOut: -0.2,
  hallFront: 1.6,
  lobbyH: 3.2,
  floorH: 3.0,
  hallSlab: 0.15,
  machineSlab: 0.6,
  machineH: 2.5,
  roof: 0.3,
  pit: 1.2,
  ground: 2.4,
  door: {w: 1.1, h: 2.1},
  car: {w: 1.7, d: 1.8, h: 2.4, front: -0.55},
  /** Height of the cut door stubs (landing and car doors). */
  stub: 0.42,
  /** The corridor doorway at a hall's left end: its z span and height (near the back, so the passage behind hides behind the wall). */
  corridor: {z0: -0.05, z1: 0.7, h: 2.15},
};

/** The decision lines inside a shaft: down its left side along the rail, seen through the doorways (behind the shaft front). */
export const LINE_IN = {dx: -0.98, z: -1.25};
/** Kept for older imports: the z of the decision lines inside the shafts. */
export const LINE_Z = LINE_IN.z;

export type TowerVariant = 'office' | 'hotel';
export type TowerLayout = ReturnType<typeof towerLayout>;

/**
 * Where everything is, from the number of shafts and floors above the lobby (pure, for overlays too).
 * `opts.hotel` deepens and heightens the lobby and adds its wings.
 */
export const towerLayout = (shafts: number, floors: number, opts: {hotel?: boolean} = {}) => {
  const D = TOWER_DIM;
  const hotel = !!opts.hotel;
  const width = 2 * D.outer + shafts * D.shaftW + (shafts - 1) * D.pier;
  const x0 = -width / 2;
  const xR = x0 + width;
  const shaftX = Array.from({length: shafts}, (_, i) => x0 + D.outer + D.shaftW / 2 + i * (D.shaftW + D.pier));
  /** Centre of the pier right of shaft i (between shaft i and i + 1). */
  const pierX = (i: number) => shaftX[i] + D.shaftW / 2 + D.pier / 2;
  const lobbyH = hotel ? 4.2 : D.lobbyH;
  /** Top of a level's floor: 0 is the lobby. */
  const levelY = (k: number) => (k <= 0 ? 0 : lobbyH + (k - 1) * D.floorH);
  const top = levelY(floors + 1);
  const machineFloor = top + D.machineSlab;
  const roofBottom = machineFloor + D.machineH;
  const roofTop = roofBottom + D.roof;
  /** The lobby: its cut front (z) and its extent in x (wings beyond the shaft bank in the hotel). */
  const lobby = hotel ? {front: 4.6, x0: x0 - 2.6, xR: xR + 2.6} : {front: D.hallFront, x0, xR};
  return {x0, xR, width, shaftX, pierX, levelY, top, machineFloor, roofBottom, roofTop, floors, shafts, lobbyH, lobby, hotel};
};

/** A level's floor height, fractional levels interpolated (a car between floors). */
export const levelYAt = (L: TowerLayout, level: number) => {
  const k = Math.floor(level);
  return L.levelY(k) + (L.levelY(k + 1) - L.levelY(k)) * (level - k);
};

/** A box with some faces cut (hatched, ink-outlined) and the rest in `mat`. */
type Face = 'px' | 'nx' | 'py' | 'ny' | 'pz' | 'nz';
type CutBoxSpec = {min: V3; max: V3; mat: THREE.Material; cut?: Face[]; cast?: boolean};
const FACES: Face[] = ['px', 'nx', 'py', 'ny', 'pz', 'nz'];
const faceRect = (b: CutBoxSpec, f: Face): Rect => {
  const [a, c] = [[...b.min] as V3, [...b.max] as V3];
  const axis = {px: 0, nx: 0, py: 1, ny: 1, pz: 2, nz: 2}[f];
  const v = f[0] === 'p' ? b.max[axis] : b.min[axis];
  a[axis] = v;
  c[axis] = v;
  return [a, c];
};

const Boxes: React.FC<{boxes: CutBoxSpec[]; cut: THREE.Material}> = ({boxes, cut}) => (
  <>
    {boxes.map((b, i) => {
      const size: V3 = [b.max[0] - b.min[0], b.max[1] - b.min[1], b.max[2] - b.min[2]];
      const pos: V3 = [(b.max[0] + b.min[0]) / 2, (b.max[1] + b.min[1]) / 2, (b.max[2] + b.min[2]) / 2];
      const mats = FACES.map((f) => (b.cut?.includes(f) ? cut : b.mat));
      return (
        <mesh key={i} position={pos} material={mats} castShadow={b.cast ?? true} receiveShadow>
          <boxGeometry args={size} />
        </mesh>
      );
    })}
    <CutOutline rects={boxes.flatMap((b) => (b.cut ?? []).map((f) => faceRect(b, f)))} />
  </>
);

/** A car: its motion (`level` or trip `keys`, `doors`), its anonymous riders and what they do. */
export type TowerCar = CarMotion & {
  /** Anonymous riders (0–8). */
  riders?: number;
  /** Riders turn to face the doors from this time (s): about to get out. */
  face?: number;
  /** Riders check their watches at these times (s). */
  watch?: number[];
  /** An ink braking-distance mark from the sill to the target floor while it brakes. */
  brakeMark?: boolean;
  /** Floors asked for inside (lit rings on the operating panel): levels, or [{level, at?, until?}]. */
  buttons?: (number | {level: number; at?: number; until?: number})[];
  /** The operating panel's FULL sign (warning yellow): true, or lit from this time (s). */
  full?: boolean | number;
};

/**
 * Rider spots in a car (car-local x, z from the car's centre, facing), the first n are used. Seen from
 * the 3/4 view the car shows through its doorway and past the right jamb, and deeper points slide
 * right on screen, so the front row stands left and the back row right: six heads read side by side.
 */
export const RIDER_SLOTS: [number, number, number][] = [
  [-0.28, 0.76, 0.15],
  [0.2, 0.1, -0.35],
  // (kept off the left wall's front, where the operating panel is)
  [-0.6, 0.42, 0.45],
  [-0.35, 0.08, 0.25],
  [-0.01, -0.45, -0.1],
  [-0.52, -0.47, 0.3],
  [0.42, 0.74, -0.45],
  [0.5, 0.42, -0.6],
];

/** Hands hanging at the sides, figure-local (standing). */
const HANDS_DOWN: [V3, V3] = [
  [-0.26, 0.82, 0.02],
  [0.26, 0.82, 0.02],
];
const HAND_RAISED: V3 = [-0.22, 1.74, 0.16];
const HAND_WATCH: V3 = [0.06, 1.1, 0.3];
const HAND_SUITCASE: V3 = [0.33, 0.84, -0.14];

/** World point → figure-local (origin on the floor under the pelvis, rotated by `rot` about y). */
const toLocal = (p: V3, pos: V3, rot: number): V3 => {
  const v = new THREE.Vector3(p[0] - pos[0], p[1] - pos[1], p[2] - pos[2]).applyAxisAngle(new THREE.Vector3(0, 1, 0), -rot);
  return [v.x, v.y, v.z];
};
const toWorld = (p: V3, pos: V3, rot: number): V3 => {
  const v = new THREE.Vector3(...p).applyAxisAngle(new THREE.Vector3(0, 1, 0), rot);
  return [v.x + pos[0], v.y + pos[1], v.z + pos[2]];
};
const lerp3 = (a: V3, b: V3, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];

/**
 * The call panel's buttons (world) on a level's hall: on the pier between the second and third
 * shafts (B | C by default), facing the hall and the camera.
 */
export const callButton = (L: TowerLayout, level: number, dir: 'up' | 'down'): V3 => [
  L.pierX(Math.min(1, L.shafts - 2)),
  L.levelY(level) + 1.25 + (dir === 'up' ? 0.08 : -0.08),
  TOWER_DIM.frontOut + 0.035,
];

/**
 * Where YOU stands in a hall: in front of the doors, back to the camera (3/4 from behind), the right
 * hand on the pier's down button, so the second shaft's car (B) is right above. Placed from the button
 * at figure-local (−0.36, ·, 0.36): in front and to the right of the right shoulder, so the forearm
 * comes in from the left and the pointing finger shows beside the hand (the button close-up).
 */
export const youSpot = (L: TowerLayout, level: number): {pos: V3; rot: number} => {
  const rot = Math.PI - 0.25;
  const b = callButton(L, level, 'down');
  const off = new THREE.Vector3(-0.36, 0, 0.36).applyAxisAngle(new THREE.Vector3(0, 1, 0), rot);
  return {pos: [b[0] - off.x, L.levelY(level), b[2] + 0.04 - off.z], rot};
};

/** The controller cabinet (its x) and the node dot on its front (world). */
export const CABINET_Z = -1.25;
export const controllerAt = (L: TowerLayout): {x: number; node: V3; front: number} => {
  const x = L.pierX(Math.min(1, L.shafts - 2));
  const n = CABINET.node;
  return {x, node: [x + n[0], L.machineFloor + n[1], CABINET_Z + n[2]], front: CABINET_Z};
};

/** A car's roof point (world) where a decision line ends: on the crosshead, toward the line's side. */
export const carRoof = (L: TowerLayout, shaft: number, level: number, dx = -0.45): V3 => [
  L.shaftX[shaft] + dx,
  levelYAt(L, level) + TOWER_DIM.car.h + 0.49,
  -1.45 + 0.08,
];

/** The x of the decision line inside a shaft. */
export const shaftLineX = (L: TowerLayout, shaft: number) => L.shaftX[shaft] + LINE_IN.dx;

/** The hotel's destination keypad: the pedestal's foot, the screen's centre (world), where its user stands. */
export const keypadAt = (L: TowerLayout) => {
  const x = L.pierX(Math.min(1, L.shafts - 2)) + 0.6;
  const z = 2.3;
  const h = KEYPAD.head;
  return {x, z, screen: [x + h[0], h[1], z + h[2]] as V3, node: [x, 1.0, z] as V3, user: {x, z: z - 0.62}};
};

/** A key on the hotel keypad's screen (world) and the screen's normal (toward its user). */
export const keypadKey = (L: TowerLayout, key: number): {at: V3; normal: V3} => {
  const k = keypadAt(L);
  const e = new THREE.Euler(KEYPAD.tilt, Math.PI, 0);
  const p = new THREE.Vector3(...keypadKeyLocal(key)).applyEuler(e);
  const n = new THREE.Vector3(0, 0, 1).applyEuler(e);
  const h = KEYPAD.head;
  return {at: [k.x + h[0] + p.x, h[1] + p.y, k.z + h[2] + p.z], normal: [n.x, n.y, n.z]};
};

/** A level's hall depth (its cut front). */
const frontOf = (L: TowerLayout, level: number) => (level === 0 ? L.lobby.front : TOWER_DIM.hallFront);

/** Named spots for people (see `PersonSpec`). */
export const towerSpot = (L: TowerLayout, letters: string[], name: string, level: number, seed: string): SpotPos | null => {
  const D = TOWER_DIM;
  const [kind, arg] = name.split(':');
  const shaft = arg ? letters.indexOf(arg) : -1;
  if (kind === 'panel') {
    const s = youSpot(L, level);
    return {x: s.pos[0], z: s.pos[2], face: s.rot};
  }
  // the corridor: in through the doorway, then left along the passage behind the wall (out of sight)
  const corridor: SpotPos = {
    x: L.x0 - 0.28,
    z: -0.75,
    face: Math.PI / 2,
    via: [
      {x: L.x0 + D.outer + 0.35, z: 0.33},
      {x: L.x0 - 0.25, z: 0.33},
    ],
  };
  if (kind === 'corridor') return corridor;
  // the hotel's street entrance: through the doorway into the vestibule behind the right wing's wall
  if (kind === 'entrance' || kind === 'exit')
    return L.hotel ? {x: L.xR + 1.3, z: -1.4, face: 0, via: [{x: L.xR + 1.3, z: 0.5}, {x: L.xR + 1.3, z: -0.6}]} : corridor;
  if (kind === 'door' && shaft >= 0) return {x: L.shaftX[shaft], z: level === 0 && L.hotel ? 0.75 : 0.62, face: Math.PI};
  if (kind === 'wall' && shaft >= 0) {
    const px = L.pierX(Math.min(shaft, L.shafts - 2));
    return {x: px - 0.05, z: 0.5, face: Math.PI};
  }
  if (kind === 'keypad') {
    const k = keypadAt(L);
    return {x: k.user.x, z: k.user.z, face: 0};
  }
  if (kind === 'desk') return {x: L.lobby.x0 + 1.75, z: 1.55, face: -Math.PI / 2};
  if (kind === 'wait' || kind === 'hall') {
    const n = Number(arg ?? 0);
    const deep = level === 0 && L.hotel;
    const xs = deep ? [1.2, -1.6, 3.6, -3.4, 0.0, 4.6] : [-2.6, 2.2, -0.6, 3.8, -4.0, 1.2];
    return {x: xs[n % xs.length], z: deep ? 1.6 + (n % 2) * 0.6 : 0.75 + (n % 2) * 0.25, face: Math.PI};
  }
  if (kind === 'car' && shaft >= 0) {
    // persons take slots from the back of the list, so they don't stand in an anonymous rider
    let h = 0;
    for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) % 997;
    const s = RIDER_SLOTS[RIDER_SLOTS.length - 1 - (h % 3)];
    return {x: s[0], z: s[1], car: arg, face: 0};
  }
  return null;
};

/** A people resolver for a tower layout and its cars. */
export const towerResolver = (L: TowerLayout, letters: string[], cars: Record<string, TowerCar>): Resolver => ({
  spot: (name, level, seed) => towerSpot(L, letters, name, level, seed),
  car: (letter, t) => {
    const i = letters.indexOf(letter);
    const c = cars[letter];
    if (i < 0 || !c) return null;
    const s = carStateAt(c, t);
    return {x: L.shaftX[i], y: levelYAt(L, s.level), level: s.level, doorZ: TOWER_DIM.car.front, centreZ: TOWER_DIM.car.front - TOWER_DIM.car.d / 2};
  },
  levelY: (k) => L.levelY(k),
  exits: ['corridor', 'entrance', 'exit'],
});

/** Head top of a person (world), for name tags. */
export const personHead = (s: PersonState): V3 => [s.pos[0], s.pos[1] + 1.82, s.pos[2]];

const letterTexture = (text: string) => {
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 128;
  return {c, t: new THREE.CanvasTexture(c), text, key: ''};
};

const useTowerMaterials = (mood: Mood) => {
  const env = useStudioEnv();
  const envScale = useEnvStrength();
  const m = MOODS[mood];
  const mats = useMemo(() => {
    const std = (c: string, roughness = 0.9, o: THREE.MeshStandardMaterialParameters = {}) =>
      new THREE.MeshStandardMaterial({color: raw(c), roughness, ...o});
    const phys = (c: string, o: THREE.MeshPhysicalMaterialParameters = {}) => new THREE.MeshPhysicalMaterial({color: raw(c), ...o});
    return {
      cut: cutMaterial(),
      concrete: std(TOWER.concrete, 0.95),
      shaft: std(TOWER.shaft, 0.95),
      stone: phys(TOWER.stone, {roughness: 0.35, clearcoat: 0.3}),
      lobbyStone: phys(TOWER.lobbyStone, {roughness: 0.25, clearcoat: 0.5}),
      // stone cladding: large slabs with fine joints (seen in the close-ups; plain stone from afar)
      pier: cladMaterial(TOWER.pier),
      paint: std(TOWER.paint, 0.9),
      corridor: std(TOWER.corridor, 1),
      earth: std(m.earth, 1),
      carFloor: std(TOWER.carFloor, 0.8),
      carWall: phys(TOWER.carWall, {roughness: 0.5, clearcoat: 0.4}),
      stainless: phys(TOWER.stainless, {metalness: 0.85, roughness: 0.32}),
      door: phys(TOWER.door, {metalness: 0.45, roughness: 0.45}),
      dark: phys(TOWER.button, {metalness: 0.4, roughness: 0.4}),
      rope: std(TOWER.rope, 0.5, {metalness: 0.6}),
      weight: std(TOWER.counterweight, 0.7, {metalness: 0.3}),
      machine: std(TOWER.machine, 0.5, {metalness: 0.3}),
      walnut: phys(TOWER.walnut, {roughness: 0.45, clearcoat: 0.5}),
      suitcase: phys(TOWER.suitcase, {roughness: 0.35, clearcoat: 0.6}),
      suitcaseAlt: phys(TOWER.suitcaseAlt, {roughness: 0.35, clearcoat: 0.6}),
      handle: phys(TOWER.handle, {metalness: 0.8, roughness: 0.35}),
      keypadBack: phys(TOWER.keypadBack, {roughness: 0.15, clearcoat: 1}),
      leaf: std(section.leaf, 0.8),
      leafDark: std(section.leafDark, 0.8),
      pot: std(section.pot, 0.9),
      light: new THREE.MeshBasicMaterial({color: raw(TOWER.lightPanel)}),
      ring: new THREE.MeshBasicMaterial({color: raw(section.warning)}),
      ringOff: std(section.ledOff, 0.4),
      pcb: std(REAL.pcb, 0.4),
      chip: std(REAL.chip, 0.5),
      terminal: std(REAL.shield, 0.4, {metalness: 0.5}),
      ink: new THREE.MeshBasicMaterial({color: raw(section.cutLine)}),
      orange: new THREE.MeshBasicMaterial({color: raw(section.orange)}),
      letter: new THREE.MeshBasicMaterial({transparent: true, depthWrite: false}),
    };
  }, [m.earth]);
  applyEnv(
    env,
    [
      [mats.stainless, 1],
      [mats.door, 1],
      [mats.stone, 0.3],
      [mats.lobbyStone, 0.4],
      [mats.carWall, 0.3],
      [mats.dark, 0.6],
      [mats.walnut, 0.4],
      [mats.suitcase, 0.6],
      [mats.suitcaseAlt, 0.6],
      [mats.handle, 1],
      [mats.keypadBack, 1],
    ],
    envScale,
  );
  // flat lights: shown as authored whatever the exposure (warning lights never bloom, § 1)
  mats.light.color.copy(raw(TOWER.lightPanel)).multiplyScalar(0.85 / m.exposure);
  mats.ring.color.copy(raw(section.warning)).multiplyScalar(0.9 / m.exposure);
  return mats;
};
type Mats = ReturnType<typeof useTowerMaterials>;

/** A lit call button: from `at` (default 0) until `until` (s). */
export type TowerCall = {level: number; dir: 'up' | 'down'; at?: number; until?: number};
/** A stop tick: an ink mark on the floor slab's cut face under a shaft (a promised stop). */
export type StopTick = {car: string; level: number; at?: number; until?: number; pulse?: number; dashed?: boolean};

export type TowerSliceProps = {
  mood: Mood;
  layout: TowerLayout;
  /** Shaft letters, left to right. */
  letters: string[];
  /** Each car by letter. */
  cars: Record<string, TowerCar>;
  /** People in the halls and cars (YOU included, see the scene). */
  people: PersonSpec[];
  /** Lit call buttons (warning yellow, flat). */
  calls: TowerCall[];
  /** Stop ticks. */
  stops?: StopTick[];
  /** Orange load bars on the cars' cut faces: shown from `at`, fill over 1.6 s, gone by `until`. */
  loadBars?: {at: number; until?: number; capacity?: number};
  /** Orange direction chevrons on moving cars: from `at` until `until`. */
  chevrons?: {at: number; until?: number};
  /**
   * Levels whose landing doors are drawn whole: full brushed leaves in a clad wall (the wall beside
   * and above each door), a real elevator lobby, instead of the cut stubs that show the cars.
   */
  fullDoors?: number[];
  /** Lit hall lanterns over a door: [{car, level, dir, at?, until?}] (warning yellow, flat). */
  lanterns?: TowerLantern[];
  /** The controller cabinet's door, 0 shut to 1 open (default 1). */
  cabinetOpen?: number;
  /** Seconds into the scene, for timed things. */
  t: number;
  clockOffset?: number;
};

/** A hall lantern lit over car `car`'s door on `level`, showing `dir`, from `at` until `until` (s). */
export type TowerLantern = {car: string; level: number; dir: 'up' | 'down'; at?: number; until?: number};

const ease3 = (x: number, a: number, b: number) => {
  const u = Math.max(0, Math.min(1, (x - a) / Math.max(1e-6, b - a)));
  return u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
};
/** The cap's travel (0–1) for a fingertip push (0–1): it moves only once the finger touches it. */
const capPush = (push: number) => Math.max(0, Math.min(1, (push - PUSH_CONTACT) / (1 - PUSH_CONTACT)));
/** Hover gap and travel of a fingertip at a button: it hovers `HOVER` off the cap, and pushes `HOVER + CAP` in. */
const HOVER = 0.012;
const CAP_TRAVEL = 0.0042;
/** The call buttons' cap face (z, at rest): the faceplate on the pier, the bezel, the cap. */
const CAP_FACE_Z = TOWER_DIM.frontOut + CALL_PANEL.depth + 0.0052 + 0.004 + 0.004;
const windowed = (t: number, at: number, until: number | undefined, fade = 0.4) =>
  ease3(t, at, at + fade) * (until === undefined ? 1 : 1 - ease3(t, until - fade, until));

/** The building, the halls with their call panels, the shafts and cars, the people, the machine room. */
export const TowerSlice: React.FC<TowerSliceProps> = ({
  mood,
  layout: L,
  letters,
  cars,
  people,
  calls,
  stops = [],
  loadBars,
  chevrons,
  fullDoors = [],
  lanterns = [],
  cabinetOpen = 1,
  t,
  clockOffset = 0,
}) => {
  const D = TOWER_DIM;
  const lab = useLabMaterials();
  const mats = useTowerMaterials(mood);
  const kit = useKitMaterials(mood);
  const ready = useFontsLoaded();
  const hotel = L.hotel;

  const letterTex = useMemo(() => letters.map((l) => letterTexture(l)), [letters]);
  const letterMats = useMemo(() => letterTex.map(() => mats.letter.clone()), [letterTex, mats.letter]);
  if (ready) {
    letterTex.forEach((lt, i) => {
      if (lt.key === lt.text) return;
      const cx = lt.c.getContext('2d')!;
      cx.clearRect(0, 0, 128, 128);
      cx.fillStyle = section.cutLine;
      cx.font = `800 108px Archivo, Inter, Arial`;
      cx.textAlign = 'center';
      cx.textBaseline = 'middle';
      cx.fillText(lt.text, 64, 70);
      lt.t.needsUpdate = true;
      lt.key = lt.text;
      letterMats[i].map = lt.t;
      letterMats[i].needsUpdate = true;
    });
  }

  const fullKey = [...fullDoors].sort().join(',');
  const boxes = useMemo(() => buildingBoxes(L, mats, fullKey ? fullKey.split(',').map(Number) : []), [L, mats, fullKey]);
  const carStates = useMemo(
    () => Object.fromEntries(letters.map((l) => [l, cars[l] ? carStateAt(cars[l], t) : null])),
    [letters, cars, t],
  );
  const resolver = useMemo(() => towerResolver(L, letters, cars), [L, letters, cars]);

  const lit = (k: number, dir: 'up' | 'down') =>
    calls.some((c) => c.level === k && c.dir === dir && t >= (c.at ?? -Infinity) && t < (c.until ?? Infinity));
  // how far each call button's cap is pushed in, by whoever stands at that panel
  const pressed = new Map<string, number>();
  people.forEach((p, i) => {
    const s = personAt(p, i, t, resolver);
    if (s.spot !== 'panel' || s.walking || !s.visible) return;
    const h = handAt(p, t);
    const key = `${Math.round(s.level)}:${p.button ?? 'down'}`;
    pressed.set(key, Math.max(pressed.get(key) ?? 0, capPush(h.push * h.up)));
  });
  const lanternOn = (letter: string, k: number, dir: 'up' | 'down') =>
    lanterns.some((l) => l.car === letter && l.level === k && l.dir === dir && t >= (l.at ?? -Infinity) && t < (l.until ?? Infinity));
  const levels = Array.from({length: L.floors + 1}, (_, k) => k);
  const shaftH = L.top + D.pit;
  const travel = L.top - D.car.h - 2.4;
  const loadK = loadBars ? windowed(t, loadBars.at, loadBars.until) : 0;
  const chevK = chevrons ? windowed(t, chevrons.at, chevrons.until, 0.25) : 0;

  return (
    <group>
      <Boxes boxes={boxes} cut={mats.cut} />

      {L.shaftX.map((cx, i) => {
        const letter = letters[i];
        const c = cars[letter];
        const st = carStates[letter];
        const carY = st ? levelYAt(L, st.level) : 0;
        // the counterweight moves opposite the car
        const cwY = L.top - 0.5 - 2.2 - (carY / Math.max(1, travel)) * (travel - 0.6);
        return (
          <group key={letter}>
            {/* inside the shaft: its darker back, guide rails, the counterweight and its ropes, the car's ropes */}
            <mesh position={[cx, L.top / 2 - D.pit / 2, D.shaftBack + 0.005]} material={mats.shaft} receiveShadow>
              <planeGeometry args={[D.shaftW, shaftH]} />
            </mesh>
            {[-1, 1].map((s) => (
              <mesh key={s} position={[cx + s * (D.car.w / 2 + 0.12), L.top / 2 - D.pit / 2, -1.45]} material={lab.steel} castShadow>
                <boxGeometry args={[0.06, shaftH, 0.09]} />
              </mesh>
            ))}
            <mesh position={[cx + 0.55, cwY + 1.1, -2.52]} material={mats.weight} castShadow>
              <boxGeometry args={[0.6, 2.2, 0.2]} />
            </mesh>
            <mesh position={[cx + 0.55, (cwY + 2.2 + L.top) / 2, -2.52]} material={mats.rope}>
              <boxGeometry args={[0.06, Math.max(0.01, L.top - cwY - 2.2), 0.03]} />
            </mesh>
            {st ? (
              <mesh position={[cx, (carY + D.car.h + 0.49 + L.top) / 2, -1.45]} material={mats.rope}>
                <boxGeometry args={[0.1, Math.max(0.01, L.top - carY - D.car.h - 0.49), 0.04]} />
              </mesh>
            ) : null}
            {/* the shaft front at every level: door frame, sill, transom beam, the dark hall lantern, the landing doors */}
            {levels.map((k) => {
              const y = L.levelY(k);
              const h = (k === L.floors ? L.top : L.levelY(k + 1)) - y;
              const here = st && Math.abs(st.level - k) < 0.02 ? st.open : 0;
              const full = (hotel && k === 0) || fullDoors.includes(k);
              return (
                <group key={k} position={[cx, y, -0.25]}>
                  {/* the frame on the wall's face (z −0.2), its returns into the opening, the sill */}
                  <group position={[0, 0, 0.05]}>
                    <DoorFrame mats={kit} w={D.door.w} h={D.door.h} />
                  </group>
                  {full ? null : (
                    <mesh position={[0, h - 0.06, 0.01]} material={mats.stainless}>
                      <boxGeometry args={[D.shaftW, 0.08, 0.04]} />
                    </mesh>
                  )}
                  {hotel && k === 0 ? null : (
                    <group position={[0, D.door.h + 0.075 + 0.085, 0.05]}>
                      <HallLantern mats={kit} up={lanternOn(letter, k, 'up')} down={lanternOn(letter, k, 'down')} />
                    </group>
                  )}
                  {/* whole leaves sit behind the wall (they slide into it); stubs stand at the face */}
                  <DoorLeaves mats={mats} kit={kit} open={here} z={full ? -0.072 : 0.035} full={full} />
                  {hotel && k === 0 ? (
                    // the lobby's lettered sign beside the door at eye height, on the wall right of it (ink on a
                    // stainless plate; above the door the podium's slab would hide it from the 3/4 view)
                    <group position={[0.84, 1.7, 0.08]}>
                      <mesh material={kit.steelH}>
                        <boxGeometry args={[0.4, 0.4, 0.03]} />
                      </mesh>
                      <mesh position={[0, 0, 0.017]} material={letterMats[i]} visible={ready} renderOrder={5}>
                        <planeGeometry args={[0.36, 0.36]} />
                      </mesh>
                    </group>
                  ) : null}
                </group>
              );
            })}
            {/* the letter set into the machine room slab's cut face, above the shaft head */}
            <mesh position={[cx, (L.top + L.machineFloor) / 2, D.hallFront + 0.012]} material={letterMats[i]} visible={ready} renderOrder={5}>
              <planeGeometry args={[0.52, 0.52]} />
            </mesh>
            {/* the hoist machine and its sheave */}
            <group position={[cx, L.machineFloor, -1.9]}>
              <mesh position={[-0.35, 0.32, -0.1]} material={mats.machine} castShadow receiveShadow>
                <boxGeometry args={[0.7, 0.64, 0.6]} />
              </mesh>
              <mesh position={[0.2, 0.55, 0.15]} rotation={[0, 0, Math.PI / 2]} material={lab.steel} castShadow>
                <cylinderGeometry args={[0.36, 0.36, 0.16, 28]} />
              </mesh>
              <mesh position={[0.2, 0.2, 0.15]} material={mats.machine} castShadow>
                <boxGeometry args={[0.3, 0.4, 0.3]} />
              </mesh>
            </group>
            {c && st ? (
              <Car
                mats={mats}
                kit={kit}
                ready={ready}
                labels={levels.map((k) => (k === 0 ? 'L' : `${k}`))}
                level={st.level}
                position={[cx, carY, D.car.front - D.car.d / 2]}
                car={c}
                open={st.open}
                load={loadK * Math.min(1, (c.riders ?? 0) / (loadBars?.capacity ?? 6))}
                loadShown={loadK}
                chevron={chevK * Math.min(1, Math.abs(st.v) / 0.15)}
                dir={st.v >= 0 ? 1 : -1}
                v={st.v}
                seed={`car-${letter}`}
                mood={mood}
                t={t}
                clockOffset={clockOffset}
              />
            ) : null}
            {c?.brakeMark && st ? <BrakeMark mats={mats} x={cx} carY={carY} targetY={L.levelY(Math.round(st.target))} on={st.phase === 'brake' ? 1 : 0} /> : null}
          </group>
        );
      })}

      {/* the call panel on the pier at every hall (none in the hotel) */}
      {hotel
        ? null
        : levels.map((k) => {
            const up = callButton(L, k, 'up');
            const dn = callButton(L, k, 'down');
            return (
              <group key={k} position={[up[0], (up[1] + dn[1]) / 2, D.frontOut]}>
                <HallCallPanel
                  mats={kit}
                  up={k < L.floors ? {lit: lit(k, 'up'), press: pressed.get(`${k}:up`)} : null}
                  down={k > 0 ? {lit: lit(k, 'down'), press: pressed.get(`${k}:down`)} : null}
                />
              </group>
            );
          })}

      {stops.map((s, i) => {
        const shaft = letters.indexOf(s.car);
        const k = windowed(t, s.at ?? -1, s.until, 0.3);
        if (shaft < 0 || k <= 0.001) return null;
        const pulse = s.pulse === undefined ? 0 : Math.sin(Math.PI * Math.max(0, Math.min(1, (t - s.pulse) / 0.6)));
        return <Tick key={i} mats={mats} x={L.shaftX[shaft]} y={L.levelY(s.level) - (s.level === 0 ? 0.12 : D.hallSlab / 2)} z={frontOf(L, s.level) + 0.006} k={k} pulse={pulse} dashed={!!s.dashed} />;
      })}

      <group position={[controllerAt(L).x, L.machineFloor, CABINET_Z]}>
        <ControllerCabinet mats={kit} open={cabinetOpen} t={t + clockOffset} />
      </group>

      {hotel ? <HotelDressing L={L} mats={mats} kit={kit} lab={lab} ready={ready} /> : null}

      {people.map((p, i) => (
        <Person key={i} spec={p} index={i} t={t} resolver={resolver} L={L} letters={letters} mats={mats} mood={mood} clockOffset={clockOffset} />
      ))}
    </group>
  );
};

/** The static building: ground, slabs, walls, piers, corridor doorways; the hotel's lobby and wings. */
const buildingBoxes = (L: TowerLayout, mats: Mats, fullDoors: number[] = []): CutBoxSpec[] => {
  const D = TOWER_DIM;
  const b: CutBoxSpec[] = [];
  // a whole lobby wall on the full-door levels: clad beside and above each door, up to the slab
  for (const k of fullDoors) {
    if (k < 0 || k > L.floors || (L.hotel && k === 0)) continue;
    const y0 = L.levelY(k);
    const y1 = k === L.floors ? L.top : L.levelY(k + 1) - D.hallSlab;
    const gap = D.door.w / 2 + 0.012;
    for (const cx of L.shaftX) {
      // no shadow casting: lit from the front, they'd only shade the shaft behind (and they speckled the
      // wall's own face with blocky self-shadow at the close framings)
      b.push({min: [cx - D.shaftW / 2, y0, D.frontIn], max: [cx - gap, y1, D.frontOut], mat: mats.pier, cast: false});
      b.push({min: [cx + gap, y0, D.frontIn], max: [cx + D.shaftW / 2, y1, D.frontOut], mat: mats.pier, cast: false});
      b.push({min: [cx - gap, y0 + D.door.h + 0.012, D.frontIn], max: [cx + gap, y1, D.frontOut], mat: mats.pier, cast: false});
    }
  }
  const g0 = -D.pit - D.ground;
  const lob = L.lobby;
  const floorMat = L.hotel ? mats.lobbyStone : mats.stone;
  // ground block and the lobby floor (the hotel's runs under its wings and deeper front)
  b.push({min: [lob.x0, g0, D.back], max: [lob.xR, -D.pit, lob.front], mat: mats.earth, cut: ['pz', 'px']});
  b.push({min: [lob.x0, -D.pit, D.frontIn], max: [lob.xR, -0.05, lob.front], mat: mats.earth, cut: ['pz', 'px']});
  b.push({min: [lob.x0, -0.05, D.frontOut], max: [lob.xR, 0, lob.front], mat: floorMat, cut: ['pz', 'px']});
  // back wall, the right outer wall of the last shaft
  b.push({min: [L.x0, -D.pit, D.back], max: [L.xR, L.roofTop, D.shaftBack], mat: mats.concrete, cut: ['px']});
  b.push({min: [L.xR - D.outer, -D.pit, D.shaftBack], max: [L.xR, L.top, D.frontOut], mat: mats.pier, cut: ['px']});
  // left outer wall: the shafts' part, then the halls' part with a corridor doorway on every office hall
  b.push({min: [L.x0, -D.pit, D.shaftBack], max: [L.x0 + D.outer, L.top, D.frontIn], mat: mats.shaft});
  b.push({min: [L.x0, L.top, D.shaftBack], max: [L.x0 + D.outer, L.roofBottom, D.frontIn], mat: mats.paint});
  const C = D.corridor;
  for (let k = 0; k <= L.floors; k++) {
    const y0 = k === 0 ? -D.pit : L.levelY(k) - D.hallSlab;
    const y1 = k === L.floors ? L.roofBottom : L.levelY(k + 1) - D.hallSlab;
    const yf = L.levelY(k);
    const front = frontOf(L, k);
    if (L.hotel && k === 0) continue;
    if (L.hotel) {
      b.push({min: [L.x0, y0, D.frontIn], max: [L.x0 + D.outer, y1, front], mat: mats.paint, cut: ['pz']});
      continue;
    }
    b.push({min: [L.x0, y0, D.frontIn], max: [L.x0 + D.outer, y1, C.z0], mat: mats.paint});
    b.push({min: [L.x0, y0, C.z1], max: [L.x0 + D.outer, y1, front], mat: mats.paint, cut: ['pz']});
    b.push({min: [L.x0, yf + C.h, C.z0], max: [L.x0 + D.outer, y1, C.z1], mat: mats.paint});
    if (k === 0) b.push({min: [L.x0, y0, C.z0], max: [L.x0 + D.outer, yf, C.z1], mat: mats.paint});
    // the passage beyond (shadowed), turning toward the back behind the wall: floor, far wall, end wall, ceiling
    const pz0 = C.z0 - 0.9;
    b.push({min: [L.x0 - 0.5, yf - 0.05, pz0], max: [L.x0, yf, C.z1], mat: mats.corridor, cast: false});
    b.push({min: [L.x0 - 0.55, yf - 0.05, pz0], max: [L.x0 - 0.5, yf + C.h + 0.1, C.z1], mat: mats.corridor, cast: false});
    b.push({min: [L.x0 - 0.55, yf - 0.05, pz0 - 0.05], max: [L.x0, yf + C.h + 0.1, pz0], mat: mats.corridor, cast: false});
    b.push({min: [L.x0 - 0.55, yf + C.h, pz0], max: [L.x0, yf + C.h + 0.1, C.z1], mat: mats.corridor, cast: false});
  }
  // dividers between shafts, and the stone piers in front of them (between the doors)
  for (let i = 0; i < L.shafts - 1; i++) {
    const x = L.pierX(i);
    b.push({min: [x - 0.1, -D.pit, D.shaftBack], max: [x + 0.1, L.top, D.frontIn], mat: mats.shaft});
    b.push({min: [x - D.pier / 2, -D.pit, D.frontIn], max: [x + D.pier / 2, L.top, D.frontOut], mat: mats.pier});
  }
  // thin hall slabs (floors 1..n), the machine room slab, the roof
  for (let k = 1; k <= L.floors; k++) {
    const y = L.levelY(k);
    if (L.hotel && k === 1) {
      // the podium roof over the lobby and its wings, the first floor's hall on it
      b.push({min: [lob.x0, y - 0.35, D.frontOut], max: [lob.xR, y, lob.front], mat: mats.concrete, cut: ['pz', 'px']});
      continue;
    }
    b.push({min: [L.x0 + D.outer, y - D.hallSlab, D.frontOut], max: [L.xR, y, D.hallFront], mat: mats.stone, cut: ['pz', 'px']});
  }
  b.push({min: [L.x0, L.top, D.back], max: [L.xR, L.machineFloor, D.hallFront], mat: mats.concrete, cut: ['pz', 'px']});
  b.push({min: [L.x0, L.roofBottom, D.back], max: [L.xR, L.roofTop, D.hallFront], mat: mats.concrete, cut: ['pz', 'px']});
  if (L.hotel) {
    const H = L.lobbyH - 0.35;
    // the wings' back walls (the right one with the street entrance), the left wing's end wall, the right wing's end wall
    b.push({min: [lob.x0, 0, D.frontIn], max: [L.x0, H, D.frontOut], mat: mats.paint});
    const ex0 = L.xR + 0.6;
    const ex1 = L.xR + 2.0;
    b.push({min: [L.xR, 0, D.frontIn], max: [ex0, H, D.frontOut], mat: mats.paint});
    b.push({min: [ex1, 0, D.frontIn], max: [lob.xR, H, D.frontOut], mat: mats.paint});
    b.push({min: [ex0, 2.5, D.frontIn], max: [ex1, H, D.frontOut], mat: mats.paint});
    b.push({min: [lob.x0, -D.pit, D.frontIn], max: [lob.x0 + D.outer, L.lobbyH, lob.front], mat: mats.paint, cut: ['pz']});
    b.push({min: [lob.xR - D.outer, -D.pit, D.frontIn], max: [lob.xR, L.lobbyH, lob.front], mat: mats.paint, cut: ['pz', 'px']});
    // the left outer wall of the shaft bank at lobby height (the wing meets it), and the vestibule behind the entrance
    b.push({min: [L.x0, -D.pit, D.frontIn], max: [L.x0 + D.outer, L.levelY(1) - 0.35, D.frontOut], mat: mats.paint});
    b.push({min: [ex0, 0, -1.9], max: [ex1, 0.01, D.frontIn], mat: mats.corridor, cast: false});
    b.push({min: [ex0, 0, -1.95], max: [ex1, 2.6, -1.9], mat: mats.corridor, cast: false});
    b.push({min: [ex0 - 0.05, 0, -1.95], max: [ex0, 2.6, D.frontIn], mat: mats.corridor, cast: false});
    b.push({min: [ex1, 0, -1.95], max: [ex1 + 0.05, 2.6, D.frontIn], mat: mats.corridor, cast: false});
    b.push({min: [ex0, 2.5, -1.95], max: [ex1, 2.6, D.frontIn], mat: mats.corridor, cast: false});
    // the wall above the lobby doors, up to the podium roof (the doors' frames sit on it), and beside them
    b.push({min: [L.x0, 2.5, D.frontIn], max: [L.xR, L.levelY(1) - 0.35, D.frontOut], mat: mats.pier});
    for (const cx of L.shaftX) {
      b.push({min: [cx - D.shaftW / 2, 0, D.frontIn], max: [cx - D.door.w / 2 - 0.05, 2.5, D.frontOut], mat: mats.pier});
      b.push({min: [cx + D.door.w / 2 + 0.05, 0, D.frontIn], max: [cx + D.shaftW / 2, 2.5, D.frontOut], mat: mats.pier});
    }
  }
  return b;
};

/**
 * A pair of centre-opening door leaves. Cut (default): low stubs with hatched tops; `full`: whole
 * brushed-steel leaves (the hotel lobby). `open` 0–1 slides them to the jambs.
 */
const DoorLeaves: React.FC<{mats: Mats; kit: KitMaterials; open: number; z: number; full?: boolean; w?: number}> = ({mats, kit, open, z, full = false, w = TOWER_DIM.door.w}) => {
  const h = full ? TOWER_DIM.door.h : TOWER_DIM.stub;
  const lw = w / 2;
  const boxes: CutBoxSpec[] = [-1, 1].map((s) => {
    const cx = s * (lw / 2 + open * lw * 0.94);
    return {min: [cx - lw / 2 + 0.003, 0.02, z - 0.015], max: [cx + lw / 2 - 0.003, h, z + 0.015], mat: kit.door, cut: full ? [] : ['py']};
  });
  return <Boxes boxes={boxes} cut={mats.cut} />;
};

/**
 * A realistic car, cut open at its front (the door wall removed, cut faces hatched): laminate walls
 * with a stainless handrail, a dark floor, a ceiling light, the car operating panel on the side wall,
 * the door operator and sill, the crosshead on the roof, the cut door stubs; the riders. The
 * controller's marks: an orange load bar on the left wall's cut face, a chevron above it when moving.
 */
const Car: React.FC<{
  mats: Mats;
  kit: KitMaterials;
  ready: boolean;
  /** Floor labels bottom to top, for the operating panel. */
  labels: string[];
  /** Where it is (fractional level) and its speed (floors/s), for the display. */
  level: number;
  v: number;
  position: V3;
  car: TowerCar;
  open: number;
  load: number;
  loadShown: number;
  chevron: number;
  dir: number;
  seed: string;
  mood: Mood;
  t: number;
  clockOffset: number;
}> = ({mats, kit, ready, labels, level, v, position, car, open, load, loadShown, chevron, dir, seed, mood, t, clockOffset}) => {
  const {w, d, h} = TOWER_DIM.car;
  const hw = w / 2;
  const hd = d / 2;
  const boxes: CutBoxSpec[] = [
    {min: [-hw, -0.16, -hd], max: [hw, 0, hd], mat: kit.granite, cut: ['pz']},
    {min: [-hw, 0, -hd], max: [-hw + 0.05, h, hd], mat: kit.laminate, cut: ['pz']},
    // the right wall is cut back too (a second cut, hatched): from the 3/4 view it would hide the riders
    {min: [hw - 0.05, 0, -hd], max: [hw, h, -0.25], mat: kit.laminate, cut: ['pz']},
    {min: [-hw, 0, -hd], max: [hw, h, -hd + 0.05], mat: kit.laminate},
    {min: [-hw, h, -hd], max: [hw, h + 0.1, hd], mat: mats.stainless, cut: ['pz']},
    // the door operator above the (cut-away) front
    {min: [-hw, h + 0.1, hd - 0.25], max: [hw, h + 0.3, hd], mat: mats.dark, cut: ['pz']},
  ];
  const n = Math.max(0, Math.min(RIDER_SLOTS.length, Math.round(car.riders ?? 0)));
  const faceK = car.face === undefined ? 0 : ease3(t, car.face, car.face + 0.8);
  const watchK = bump(car.watch, t, 1.6, 0.4);
  return (
    <group position={position}>
      <Boxes boxes={boxes} cut={mats.cut} />
      <mesh position={[0, 0.015, hd + 0.04]} material={mats.stainless}>
        <boxGeometry args={[1.12, 0.03, 0.1]} />
      </mesh>
      <DoorLeaves mats={mats} kit={kit} open={open} z={hd - 0.02} />
      {/* panel joints (stainless trims) and kick plates on the back and left walls */}
      {[-w / 6, w / 6].map((x) => (
        <mesh key={x} position={[x, h / 2, -hd + 0.052]} material={kit.steelV}>
          <boxGeometry args={[0.022, h, 0.004]} />
        </mesh>
      ))}
      <mesh position={[-hw + 0.052, h / 2, -0.2]} material={kit.steelV}>
        <boxGeometry args={[0.004, h, 0.022]} />
      </mesh>
      <mesh position={[0, 0.06, -hd + 0.053]} material={kit.steelH} receiveShadow>
        <boxGeometry args={[w - 0.1, 0.12, 0.004]} />
      </mesh>
      <mesh position={[-hw + 0.053, 0.06, 0.02]} material={kit.steelH} receiveShadow>
        <boxGeometry args={[0.004, 0.12, d - 0.1]} />
      </mesh>
      {/* the handrail on the back wall, on its brackets */}
      <mesh position={[0, 0.92, -hd + 0.11]} rotation={[0, 0, Math.PI / 2]} material={kit.polished} castShadow>
        <cylinderGeometry args={[0.019, 0.019, w - 0.3, 20]} />
      </mesh>
      {[-1, 1].map((s) => (
        <group key={s} position={[(s * (w - 0.42)) / 2, 0.92, -hd + 0.08]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} material={kit.polished}>
            <cylinderGeometry args={[0.011, 0.011, 0.06, 12]} />
          </mesh>
          <mesh position={[0, 0, -0.028]} rotation={[Math.PI / 2, 0, 0]} material={kit.polished}>
            <cylinderGeometry args={[0.03, 0.03, 0.006, 20]} />
          </mesh>
        </group>
      ))}
      {/* the operating panel on the left wall (it faces the camera's side) */}
      <group position={[-hw + 0.05, 1.12, hd - 0.2]} rotation={[0, Math.PI / 2, 0]}>
        <CarOperatingPanel
          mats={kit}
          ready={ready}
          light={0.85 / MOODS[mood].exposure}
          h={Math.max(0.95, 0.52 + Math.ceil(labels.length / 2) * 0.072)}
          state={{
            labels,
            lit: (car.buttons ?? []).flatMap((b) => {
              const o = typeof b === 'number' ? {level: b} : b;
              return t >= (o.at ?? -Infinity) && t < (o.until ?? Infinity) ? [o.level] : [];
            }),
            floor: labels[Math.max(0, Math.min(labels.length - 1, Math.round(level)))] ?? '',
            dir: Math.abs(v) > 0.02 ? Math.sign(v) : 0,
            full: car.full === true || (typeof car.full === 'number' && t >= car.full),
          }}
        />
      </group>
      {/* the ceiling light panel (neutral) and its light into the car (always mounted) */}
      <mesh position={[0, h - 0.005, 0]} rotation={[Math.PI / 2, 0, 0]} material={mats.light}>
        <planeGeometry args={[w - 0.4, d - 0.4]} />
      </mesh>
      <pointLight position={[0, h - 0.3, 0.2]} color={raw(TOWER.lightPanel)} intensity={1.0} distance={3} decay={1} />
      {/* the crosshead on the roof */}
      <mesh position={[0, h + 0.4, -0.1]} material={mats.machine} castShadow>
        <boxGeometry args={[w, 0.18, 0.14]} />
      </mesh>
      {/* load bar: its ink gauge frame and the orange fill, on the left wall's cut face */}
      {loadShown > 0.001 ? (
        <group position={[-hw + 0.03, 0.12, hd + 0.012]}>
          <CutOutline
            rects={[
              [
                [-0.05, 0, 0],
                [0.05, 2.0, 0],
              ],
            ]}
            thickness={0.016}
          />
          <mesh position={[0, Math.max(0.001, load * 2.0) / 2, 0.004]} material={mats.orange} userData={{glow: true}} scale={[1, 1, 1]}>
            <boxGeometry args={[0.085, Math.max(0.001, load * 2.0), 0.01]} />
          </mesh>
          {/* the gauge's quarter ticks (ink), so the fill reads as a reading */}
          {[0.5, 1.0, 1.5].map((y) => (
            <mesh key={y} position={[0.07, y, 0.004]} material={mats.ink}>
              <boxGeometry args={[0.05, 0.014, 0.006]} />
            </mesh>
          ))}
        </group>
      ) : null}
      {chevron > 0.001 ? (
        <group position={[0, h + 0.95, hd - 0.1]} scale={[chevron, dir * chevron, chevron]}>
          {[-1, 1].map((s) => (
            <mesh key={s} position={[s * 0.14, 0, 0]} rotation={[0, 0, s * 0.75]} material={mats.orange} userData={{glow: true}}>
              <boxGeometry args={[0.07, 0.4, 0.04]} />
            </mesh>
          ))}
        </group>
      ) : null}
      {RIDER_SLOTS.slice(0, n).map(([x, z, r], i) => {
        const rot = (r + (random(`${seed}-rot-${i}`) - 0.5) * 0.3) * (1 - faceK);
        const left: V3 = lerp3(HANDS_DOWN[1], HAND_WATCH, watchK);
        const gestures: Gesture[] = car.watch?.map((at) => ({pose: 'glance-down', at: at + 0.15, hold: 1.0, blend: 0.4})) ?? [];
        return (
          <Figure
            key={i}
            who="extra"
            mood={mood}
            seed={`${seed}-${i}`}
            position={[x, 0, z]}
            rotationY={rot}
            phone={false}
            hands={[HANDS_DOWN[0], left]}
            gestures={gestures}
            stance="stand"
            clockOffset={clockOffset}
          />
        );
      })}
    </group>
  );
};

/** An ink tick on a slab's cut face under a shaft: solid (a promised stop) or dashed (a maybe). */
const Tick: React.FC<{mats: Mats; x: number; y: number; z: number; k: number; pulse: number; dashed: boolean}> = ({mats, x, y, z, k, pulse, dashed}) => {
  const W = 0.9;
  const segs = dashed ? [-0.33, 0, 0.33].map((c) => [c, 0.2]) : [[0, W]];
  return (
    <group position={[x, y, z]} scale={[k * (1 + 0.35 * pulse), 1 + 1.2 * pulse, 1]}>
      {segs.map(([c, w], i) => (
        <mesh key={i} position={[c, 0, 0]} material={mats.ink}>
          <boxGeometry args={[w, 0.07, 0.01]} />
        </mesh>
      ))}
    </group>
  );
};

/** While a car brakes: an ink dimension line from its sill to the floor it stops at, ticks at both ends. */
const BrakeMark: React.FC<{mats: Mats; x: number; carY: number; targetY: number; on: number}> = ({mats, x, carY, targetY, on}) => {
  if (on <= 0 || Math.abs(carY - targetY) < 0.02) return null;
  const a = Math.min(carY, targetY);
  const b = Math.max(carY, targetY);
  const px = x - 0.66;
  const z = -0.36;
  return (
    <group>
      <mesh position={[px, (a + b) / 2, z]} material={mats.ink}>
        <boxGeometry args={[0.035, b - a, 0.01]} />
      </mesh>
      {[a, b].map((y, i) => (
        <mesh key={i} position={[px, y, z]} material={mats.ink}>
          <boxGeometry args={[0.24, 0.035, 0.01]} />
        </mesh>
      ))}
    </group>
  );
};

/** The hotel lobby's furniture: reception desk and its wall panel, the keypad pedestal, a plant. */
const HotelDressing: React.FC<{L: TowerLayout; mats: Mats; kit: KitMaterials; lab: ReturnType<typeof useLabMaterials>; ready: boolean}> = ({L, mats, kit, lab, ready}) => {
  const lob = L.lobby;
  const k = keypadAt(L);
  const dx = lob.x0 + D_DESK.x;
  const desk: CutBoxSpec[] = [
    {min: [dx - 0.35, 0, 0.6], max: [dx + 0.35, 1.08, 2.6], mat: mats.walnut},
    {min: [dx - 0.42, 1.08, 0.55], max: [dx + 0.42, 1.12, 2.65], mat: mats.stainless},
  ];
  return (
    <group>
      <Boxes boxes={desk} cut={mats.cut} />
      {/* the walnut panel on the wing's back wall behind the desk */}
      <mesh position={[(lob.x0 + L.x0) / 2, 1.7, -0.19]} material={mats.walnut} receiveShadow>
        <boxGeometry args={[L.x0 - lob.x0 - 0.5, 2.2, 0.02]} />
      </mesh>
      {/* the destination keypad, its screen tilted toward its user (−z) */}
      <group position={[k.x, 0, k.z]}>
        <DestinationKeypad mats={kit} ready={ready} />
      </group>
      {/* a plant in the right wing */}
      <group position={[lob.xR - 0.9, 0, lob.front - 1.2]}>
        <mesh position={[0, 0.25, 0]} material={mats.pot} castShadow receiveShadow>
          <cylinderGeometry args={[0.24, 0.2, 0.5, 20]} />
        </mesh>
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh
            key={i}
            position={[Math.sin(i * 1.3) * 0.14, 0.85 + (i % 2) * 0.25, Math.cos(i * 1.3) * 0.14]}
            rotation={[Math.sin(i) * 0.4, i, Math.cos(i) * 0.4]}
            material={i % 2 ? mats.leaf : mats.leafDark}
            castShadow
          >
            <sphereGeometry args={[0.24, 12, 8]} />
          </mesh>
        ))}
      </group>
      {/* the entrance's aluminium transom */}
      <mesh position={[L.xR + 1.3, 2.53, -0.19]} material={lab.alu}>
        <boxGeometry args={[1.5, 0.06, 0.03]} />
      </mesh>
    </group>
  );
};
const D_DESK = {x: 1.0};

/** A person: Figure plus hands (button, raised, watch, suitcase), a suitcase, gestures. */
const Person: React.FC<{
  spec: PersonSpec;
  index: number;
  t: number;
  resolver: Resolver;
  L: TowerLayout;
  letters: string[];
  mats: Mats;
  mood: Mood;
  clockOffset: number;
}> = ({spec, index, t, resolver, L, letters, mats, mood, clockOffset}) => {
  const s = personAt(spec, index, t, resolver);
  if (!s.visible) return null;
  const {pos, rot} = s;
  // the button at their spot (only once they're there: no reaching from across the hall)
  const spot = typeof s.spot === 'string' && !s.walking ? s.spot : '';
  const hand = handAt(spec, t);
  // the fingertip's target and the way it pushes (the surface's normal)
  let tip: V3 | null = null;
  let normal: V3 = [0, 0, 1];
  if (spot === 'panel') {
    const dir = spec.button ?? 'down';
    const b = callButton(L, Math.round(s.level), dir);
    // on the cap's face, a touch below its centre (the arrow and most of the ring show above the finger)
    tip = [b[0] - 0.004, b[1] - 0.01, CAP_FACE_Z];
  } else if (spot === 'keypad') {
    const keys = spec.keys?.length ? spec.keys : [9];
    const i = Math.max(0, pushIndex(spec.pushes, t));
    const kk = keypadKey(L, keys[Math.min(i, keys.length - 1)]);
    tip = kk.at;
    normal = kk.normal;
  } else if (spot.startsWith('wall:')) {
    const i = letters.indexOf(spot.split(':')[1]);
    if (i >= 0) tip = [L.pierX(Math.min(i, L.shafts - 2)), L.levelY(Math.round(s.level)) + 1.2, TOWER_DIM.frontOut + 0.005];
  }
  let right: V3 = HANDS_DOWN[0];
  let point = 0;
  if (tip && hand.up > 0) {
    // hover off the surface, then push in: the finger touches at PUSH_CONTACT and carries the cap in
    const off = spot === 'wall:' || spot.startsWith('wall:') ? 0.02 - 0.02 * hand.push : HOVER - (HOVER + CAP_TRAVEL) * hand.push;
    const tgt: V3 = [tip[0] + normal[0] * off, tip[1] + normal[1] * off, tip[2] + normal[2] * off];
    right = lerp3(HANDS_DOWN[0], toLocal(tgt, pos, rot), hand.up);
    point = spot.startsWith('wall:') ? 0 : hand.up;
  }
  const raiseK = bump(spec.raise, t, 1.2, 0.35);
  right = lerp3(right, HAND_RAISED, raiseK);
  const watchK = bump(spec.watch, t, 1.6, 0.4);
  const left: V3 = spec.suitcase ? HAND_SUITCASE : lerp3(HANDS_DOWN[1], HAND_WATCH, watchK);
  const gestures: Gesture[] = [
    ...(spec.gestures ?? []),
    ...(spec.watch ?? []).map((at) => ({pose: 'glance-down' as const, at: at + 0.15, hold: 1.0, blend: 0.4})),
    ...(spec.lookAround ?? []).flatMap((at) => {
      const p = personAt(spec, index, at, resolver);
      const side = (lx: number): V3 => toWorld([lx, 1.6, 0.8], p.pos, p.rot);
      return [
        {pose: 'turn-to' as const, at, target: side(1.6), hold: 0.4, blend: 0.4},
        {pose: 'turn-to' as const, at: at + 1.0, target: side(-1.6), hold: 0.4, blend: 0.4},
      ];
    }),
  ];
  return (
    <group>
      <Figure
        who={spec.who ?? 'extra'}
        mood={mood}
        seed={spec.seed ?? `person-${index}`}
        position={pos}
        rotationY={rot}
        phone={false}
        hands={[right, left]}
        point={[point, 0]}
        gestures={gestures}
        stance="stand"
        walk={s.walk}
        clockOffset={clockOffset}
      />
      {spec.suitcase ? <Suitcase mats={mats} pos={pos} rot={rot} alt={index % 2 === 1} /> : null}
    </group>
  );
};

/** A rolling suitcase pulled at the left hand (behind, on its wheels). */
const Suitcase: React.FC<{mats: Mats; pos: V3; rot: number; alt: boolean}> = ({mats, pos, rot, alt}) => (
  <group position={pos} rotation={[0, rot, 0]}>
    <group position={[0.36, 0, -0.34]} rotation={[0.18, 0, 0]}>
      <mesh position={[0, 0.36, 0]} material={alt ? mats.suitcaseAlt : mats.suitcase} castShadow receiveShadow>
        <boxGeometry args={[0.36, 0.6, 0.22]} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.07, 0.77, 0.06]} material={mats.handle}>
          <boxGeometry args={[0.015, 0.22, 0.015]} />
        </mesh>
      ))}
      <mesh position={[0, 0.88, 0.06]} material={mats.dark}>
        <boxGeometry args={[0.17, 0.03, 0.03]} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.13, 0.03, -0.08]} rotation={[0, 0, Math.PI / 2]} material={mats.dark}>
          <cylinderGeometry args={[0.03, 0.03, 0.03, 10]} />
        </mesh>
      ))}
    </group>
  </group>
);

