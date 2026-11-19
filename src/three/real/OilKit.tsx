import React, {useEffect, useMemo} from 'react';
import {random} from 'remotion';
import * as THREE from 'three';
import {HIGHWAY, MOODS, RACE, REAL, section, type Mood} from '../../theme';
import {raw} from '../plaster';
import {cutMaterial, InkLine} from '../section/cutLook';
import {GAS, I4, i4Cyl, i4Pose} from './GasDrive';
import {oilSurfaceY} from './WearKit';
import {ease, keyedValue, type Keyed} from '../../scenes/keyframes';

type V3 = [number, number, number];
type P2 = [number, number];

/*
 * No. 021 (`ev-oil`, N1–N3; style guide v0.18.18 § 5 "A fluid's work as the system", "System strength", "Combustion on
 * screen", § 3 Liquids). The four-cylinder's oil at work, drawn on `GasDrive`'s engine section plane (car frame, the cut
 * at z = `GAS.engineZ`), mounted by `SlicedCar` (`oilSystem`) beside `EngineBay` and `OilPan`.
 *
 *  - Parts (neutral metal, never orange): the oil pump hanging in the crankcase (a cut gear pump, its gears turning with
 *    the crank), its pickup and screen down into the sump's pool, the full-flow filter on the block's front face (cut:
 *    shell, pleated element, centre tube), the drilled passages on the block's cut face (pump → filter → the main gallery
 *    → the main bearing; the riser to the head; the drain-back on the rear wall), the main bearing in its bulkhead
 *    (journal, shells), the rod's big end (journal, shells), the wrist pin in its boss, three piston rings on the piston
 *    face with their end gaps (the top one 🎭 magnified to 6 mm), the oil jet under the bore, the spark plug's tip.
 *  - The system (orange): the circulation (a core line and its halo riding the passages, runner dots; through the head
 *    it runs behind the cut face and shows again in the cam pockets), the film on every sliding interface (a core line
 *    centred in each 🎭 magnified gap with its halo: main and rod bearings 5 mm, the wrist pin 2.5 mm, the piston's two
 *    sides against the bore, the cam lobes, the valve stems), drops flung off the crank (and off the piston's underside
 *    when the jet squirts) that end at the pool's surface, the jet's stream. `strength` dims and narrows all of it.
 *  - Combustion (never orange): on each power stroke the plug's spark (1 frame, `screenLight`), then a flat
 *    `screenLight` flash filling the chamber's cut outline (opacity 0.75 → 0.4 → 0.15 over 3 frames), never bloomed;
 *    at most one a second. Blow-by: per firing (from `blowBy.at`) a `RACE.haze` wisp (≤ 0.45) squeezes through the ring
 *    gaps, runs down the skirt and the crankcase's front wall and spreads on the pool, carrying soot (`REAL.flex`),
 *    water (`HIGHWAY.spray`) and fuel (`REAL.fuel`) specks (≥ 6 px at the close framing) that sink into the pool.
 *
 * Widths are kept constant on screen (px, from the camera distance), so a line reads the same from `crankcase` to the
 * highway; the core never falls under 2 px. Everything is a pure function of the scene time and the crank angle.
 */

const Z = GAS.engineZ;
const R = GAS.boreR;
const cy = i4Cyl;
/** Metres per pixel at a camera distance (vertical frame: fov 26°, 1920 px tall). */
export const oilMpp = (camD: number) => (2 * camD * Math.tan((13 * Math.PI) / 180)) / 1920;

/** Bearing geometry (m): journal radius, the 🎭 magnified gap, the shell's thickness. */
export const OIL = {
  main: {r: 0.026, gap: 0.005, shell: 0.004, cap: 0.05},
  rod: {r: 0.018, gap: 0.005, shell: 0.003, eye: 0.033},
  wrist: {r: 0.0105, gap: 0.0025, boss: 0.017},
  /** The rings: their distance under the crown (m), height, end gap (m) and where the gap sits (across). */
  rings: [
    {below: 0.005, h: 0.0024, gap: 0.006, at: 0.012},
    {below: 0.0105, h: 0.0022, gap: 0.004, at: 0.012},
    {below: 0.016, h: 0.0026, gap: 0.004, at: 0.012},
  ],
  pump: {c: [-0.1, 0.075] as P2, ha: 0.016, hx: 0.026},
  filter: {c: [-0.035, 0.2] as P2, ha: 0.06, hx: 0.032},
  gallery: [0.0, 0.135] as P2,
  jet: {from: [0.096, -0.104] as P2, tip: [0.104, -0.088] as P2},
};

/** Passages and routes in the cylinder frame (along, across); `z`: 0 on the cut face, < 0 behind it. */
type CP = [number, number, number];
const ON = 0.0035;
const IN = -0.0105;
const HID = -0.03;
const POCKET = -0.0025;
export const OIL_ROUTES: Record<'feed' | 'riser' | 'intake' | 'drain', CP[]> = {
  // the pickup in the pool → the pump → into the block → the filter → out to the main gallery → the main bearing
  feed: [
    [-0.236, 0.0, ON],
    [-0.2, 0.0, ON],
    [-0.14, 0.06, ON],
    [-0.116, 0.06, ON],
    [-0.1, 0.075, ON],
    [-0.1, 0.14, ON],
    [-0.035, 0.14, ON],
    [-0.035, 0.2, ON],
    [0.0, 0.2, ON],
    [0.0, 0.168, ON],
    [0.0, OIL.gallery[1], ON],
    [0.0, 0.108, ON],
    [0.0, 0.1, IN],
    [0.0, OIL.main.r + OIL.main.gap / 2, IN],
  ],
  // the gallery → the riser up the front wall → behind the cut through the head → out in the exhaust cam's pocket
  riser: [
    [0.0, OIL.gallery[1], ON],
    [0.05, 0.13, ON],
    [0.2, 0.075, ON],
    [0.27, 0.075, ON],
    [0.285, 0.078, HID],
    [0.345, 0.082, HID],
    [0.362, 0.07, POCKET],
  ],
  // a branch across the head to the intake cam
  intake: [
    [0.27, 0.075, ON],
    [0.29, 0.06, HID],
    [0.31, -0.07, HID],
    [0.35, -0.085, HID],
    [0.362, -0.07, POCKET],
  ],
  // the intake cam → behind the cut → the drain-back down the rear wall → into the sump, to the pool
  drain: [
    [0.362, -0.07, POCKET],
    [0.34, -0.088, HID],
    [0.29, -0.078, HID],
    [0.272, -0.075, ON],
    [0.2, -0.075, ON],
    [0.05, -0.13, ON],
    [-0.115, -0.13, ON],
    [-0.13, -0.13, -0.006],
    [-0.19, -0.13, -0.006],
  ],
};
/** The drilled passages drawn on the cut face (cylinder frame polylines; the routes' `ON` legs). */
const PASSAGES: P2[][] = [
  [
    [-0.1, 0.1],
    [-0.1, 0.14],
    [-0.035, 0.14],
    [-0.035, 0.168],
  ],
  [
    [0.0, 0.168],
    [0.0, 0.105],
  ],
  [
    [0.0, OIL.gallery[1]],
    [0.05, 0.13],
    [0.2, 0.075],
    [0.275, 0.075],
  ],
  [
    [0.275, -0.075],
    [0.2, -0.075],
    [0.05, -0.13],
    [-0.12, -0.13],
  ],
];

const toCar = ([a, c, z]: CP, dz = 0): V3 => {
  const [x, y] = cy(a, c);
  return [x, y, Z + z + dz];
};

/** System strength (style guide § 5): 1 (full) → 0.45 (weakest, the floor). */
export const strengthLook = (s: number) => {
  const u = Math.max(0, Math.min(1, (Math.max(0.45, Math.min(1, s)) - 0.45) / 0.55));
  return {halo: 0.12 + 0.13 * u, dots: 0.4 + 0.6 * u, speed: 0.5 + 0.5 * u, core: 0.6 + 0.4 * u};
};

/** A one-shot surge 0 → 1 → 0 over `len` s (0.2 up, the rest down). */
const bump = (x: number, len = 0.4) => (x < 0 || x > len ? 0 : x < len / 2 ? ease(x, 0, len / 2) : 1 - ease(x, len / 2, len));

/** The oil's colour keys (`SlicedCar` `oilColor`): 'fresh' → 'used' (`coffee`) → 'old', each step eased over 0.6 s. */
export type OilShade = 'fresh' | 'used' | 'old';
export const OIL_SHADES: Record<OilShade, string> = {fresh: REAL.oilFresh, used: REAL.coffee, old: REAL.oilOld};
/** The oil's colour at t from `{at, shade}` keys (a hex; the first key's shade before it; default 'used', as No. 016). */
export const oilColorAt = (keys: {at: number; shade: OilShade; for?: number}[] | undefined, t: number) => {
  if (!keys || !keys.length) return REAL.coffee;
  const ks = [...keys].sort((a, b) => a.at - b.at);
  const c = new THREE.Color().setStyle(OIL_SHADES[ks[0].shade], THREE.SRGBColorSpace);
  for (const k of ks) {
    const u = ease(t, k.at, k.at + (k.for ?? 0.6));
    if (u <= 0) break;
    c.lerp(new THREE.Color().setStyle(OIL_SHADES[k.shade], THREE.SRGBColorSpace), u);
  }
  return `#${c.getHexString(THREE.SRGBColorSpace)}`;
};

/** The oil system's keys (`SlicedCar` `oilSystem`), seconds into the scene. */
export type OilSystemKeys = {
  /** System strength 1 (full) → 0.45 (weakest), constant or keys: halo 25 → 12 %, dots × 0.4, speed × 0.5. Default 1. */
  strength?: Keyed;
  /** The core's width strength (1 → 0.45: × 0.6), when it narrows on its own word ("thinner"). Default `strength`. */
  core?: Keyed;
  /** The film surges part by part from this time (main bearing, rod, piston, wrist pin, cams, valves; 0.08 s apart). */
  waveAt?: number | null;
  /** A single surge of everything (halo to 45 %, 0.4 s) at each time. */
  surgeAt?: number[];
  /** One bright dot runs the circuit (pickup → pump → filter → gallery → riser → cams → drain-back) from each time, over 2.4 s. */
  passAt?: number[];
  /** The jet squirts onto the piston's underside at each time (0.9 s), drops running off it. */
  jetAt?: number[];
  /** Drops flung off the crank, per second (constant or keys; default 2.5; 0: none). */
  dripRate?: Keyed;
  /** The neutral parts (pump, pickup, filter, passages, bearings, rings, jet, plug tip). Default true. */
  parts?: boolean;
  /** The firings' spark and flash (§ 5 Combustion on screen): true (default), false, or a window in scene seconds. */
  combustion?: boolean | {at?: number; until?: number | null};
  /** Blow-by: a haze wisp per firing from `at` (to `until`), `size` × its width (default 1). Null: none. */
  blowBy?: {at: number; until?: number | null; size?: number} | null;
  /** Specks riding the blow-by from each time (s): soot, water, unburned fuel. Default none. */
  specks?: {soot?: number; water?: number; fuel?: number} | null;
};

export type OilSystemProps = {
  keys: OilSystemKeys;
  mood: Mood;
  /** Seconds into the scene. */
  t: number;
  fps: number;
  /** The oil clock at the scene's start (dots, drops; a loop sets it). */
  clock: number;
  /** The crank angle at a scene time (`engineCrank`); the engine running (0 → 1) at a scene time. */
  crankAt: (t: number) => number;
  onAt: (t: number) => number;
  camD: number;
  inkScale: number;
  /** The sump's oil level (0 → 1, as `OilPan`): where drops and blow-by end. */
  level: number;
  tremor?: V3;
};

const FIRE = -0.12;
const FOUR_PI = Math.PI * 4;

/**
 * The frames (counted back from `frame`, 0 = this one) on which the cut cylinder fired, over `back` frames: a firing is
 * the crank angle crossing just before top dead centre on its power stroke (once per two turns).
 */
export const oilFirings = (crankAt: (t: number) => number, onAt: (t: number) => number, frame: number, fps: number, back: number) => {
  const out: number[] = [];
  let prev = Math.floor((i4Pose(crankAt(frame / fps)).th - FIRE) / FOUR_PI);
  for (let j = 0; j < back; j++) {
    const tj = (frame - j - 1) / fps;
    const n = Math.floor((i4Pose(crankAt(tj)).th - FIRE) / FOUR_PI);
    if (n < prev && onAt(tj) > 0.5) out.push(j);
    prev = n;
  }
  return out;
};

/** A polyline's strip outline (miter joins), for a drilled passage `w` wide. */
const strip = (pts: P2[], w: number): P2[] => {
  const n = pts.length;
  const off = (i: number, s: number): P2 => {
    const a = pts[Math.max(0, i - 1)];
    const b = pts[i];
    const c = pts[Math.min(n - 1, i + 1)];
    const d1 = norm([b[0] - a[0], b[1] - a[1]]);
    const d2 = norm([c[0] - b[0], c[1] - b[1]]);
    const t = norm([d1[0] + d2[0], d1[1] + d2[1]]);
    const nx = -t[1];
    const ny = t[0];
    const m = 1 / Math.max(0.35, nx * -d1[1] + ny * d1[0] || nx * -d2[1] + ny * d2[0] || 1);
    return [b[0] + s * nx * (w / 2) * m, b[1] + s * ny * (w / 2) * m];
  };
  return [...pts.map((_, i) => off(i, 1)), ...pts.map((_, i) => off(n - 1 - i, -1))];
};
const norm = ([x, y]: P2): P2 => {
  const l = Math.hypot(x, y) || 1;
  return [x / l, y / l];
};
const ring = (c: P2, r: number, n = 40, a0 = 0, a1 = Math.PI * 2): P2[] =>
  [...Array(n + 1).keys()].map((i) => {
    const a = a0 + ((a1 - a0) * i) / n;
    return [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)];
  });
/** A cylinder-frame polygon → car-frame shape points. */
const carPts = (pts: P2[]) => pts.map(([a, c]) => cy(a, c));
const shapeOf = (pts: P2[], holes: P2[][] = []) => {
  const s = new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(x, y)));
  for (const h of holes) s.holes.push(new THREE.Path(h.map(([x, y]) => new THREE.Vector2(x, y))));
  return s;
};
const flat = (pts: P2[], z: number, holes: P2[][] = []) => {
  const g = new THREE.ShapeGeometry(shapeOf(pts, holes), 24);
  g.translate(0, 0, z);
  return g;
};
const slab = (pts: P2[], z0: number, z1: number, holes: P2[][] = []) => {
  const g = new THREE.ExtrudeGeometry(shapeOf(pts, holes), {depth: z1 - z0, bevelEnabled: false, curveSegments: 24});
  g.translate(0, 0, z0);
  return g;
};

/** A glowing core line with its halo along car-frame points (the system), rebuilt only when its width changes. */
const GlowRun: React.FC<{curve: THREE.Curve<THREE.Vector3>; core: number; halo: number; haloScale: number; mats: {core: THREE.Material; halo: THREE.MeshBasicMaterial}; segs?: number}> = ({
  curve,
  core,
  halo,
  haloScale,
  mats,
  segs = 64,
}) => {
  const rc = Math.max(0.0002, Math.round(core * 40000) / 40000);
  const coreG = useMemo(() => new THREE.TubeGeometry(curve, segs, rc, 8, false), [curve, segs, rc]);
  const haloG = useMemo(() => new THREE.TubeGeometry(curve, segs, rc * haloScale, 8, false), [curve, segs, rc, haloScale]);
  useEffect(
    () => () => {
      coreG.dispose();
      haloG.dispose();
    },
    [coreG, haloG],
  );
  const hm = useMemo(() => mats.halo.clone(), [mats.halo]);
  hm.opacity = halo;
  return (
    <>
      <mesh geometry={coreG} material={mats.core} userData={{glow: true}} renderOrder={6} frustumCulled={false} />
      <mesh geometry={haloG} material={hm} userData={{glow: true}} renderOrder={5} frustumCulled={false} />
    </>
  );
};

/** A sharp-cornered polyline curve (car frame). */
const polyCurve = (pts: V3[]) => {
  const path = new THREE.CurvePath<THREE.Vector3>();
  for (let i = 0; i < pts.length - 1; i++) path.add(new THREE.LineCurve3(new THREE.Vector3(...pts[i]), new THREE.Vector3(...pts[i + 1])));
  return path;
};

/** A glowing straight segment between two points (core + halo cylinders; cheap to move every frame). */
const GlowSeg: React.FC<{a: V3; b: V3; core: number; halo: number; haloScale: number; mats: {core: THREE.Material; halo: THREE.MeshBasicMaterial}}> = ({a, b, core, halo, haloScale, mats}) => {
  const va = new THREE.Vector3(...a);
  const vb = new THREE.Vector3(...b);
  const len = va.distanceTo(vb);
  if (len < 1e-5) return null;
  const mid = va.clone().add(vb).multiplyScalar(0.5);
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), vb.clone().sub(va).normalize());
  const hm = haloMat(mats.halo, halo);
  return (
    <group position={mid} quaternion={q}>
      <mesh material={mats.core} userData={{glow: true}} renderOrder={6} scale={[core, len, core]}>
        <cylinderGeometry args={[1, 1, 1, 10, 1, true]} />
      </mesh>
      <mesh material={hm} userData={{glow: true}} renderOrder={5} scale={[core * haloScale, len, core * haloScale]}>
        <cylinderGeometry args={[1, 1, 1, 10, 1, true]} />
      </mesh>
    </group>
  );
};

/** A glowing ring (core torus + halo torus) of radius `r` at `c` (car frame), in the cut plane. */
const GlowRing: React.FC<{c: V3; r: number; core: number; halo: number; haloW: number; mats: {core: THREE.Material; halo: THREE.MeshBasicMaterial}; arc?: [number, number]}> = ({
  c,
  r,
  core,
  halo,
  haloW,
  mats,
  arc,
}) => {
  const hm = useMemo(() => mats.halo.clone(), [mats.halo]);
  hm.opacity = halo;
  const span = arc ? arc[1] - arc[0] : Math.PI * 2;
  const rot = arc ? arc[0] : 0;
  const rc = Math.round(core * 40000) / 40000;
  const rh = Math.round(haloW * 40000) / 40000;
  const k = Math.round(r * 10000) / 10000;
  const coreG = useMemo(() => new THREE.TorusGeometry(k, Math.max(0.0002, rc), 6, 48, span), [k, rc, span]);
  const haloG = useMemo(() => new THREE.RingGeometry(Math.max(0.0001, k - rh), k + rh, 48, 1, 0, span), [k, rh, span]);
  return (
    <group position={c} rotation={[0, 0, rot]}>
      <mesh geometry={coreG} material={mats.core} userData={{glow: true}} renderOrder={6} />
      <mesh geometry={haloG} material={hm} userData={{glow: true}} renderOrder={5} position={[0, 0, -0.0004]} />
    </group>
  );
};

/** N1–N2: the oil system and the firings (see the file comment). Mount in the car frame. */
export const OilSystem: React.FC<OilSystemProps> = ({keys, mood, t, fps, clock, crankAt, onAt, camD, inkScale, level, tremor}) => {
  const exposure = MOODS[mood].exposure;
  const mats = useMemo(
    () => ({
      cut: cutMaterial(),
      iron: new THREE.MeshPhysicalMaterial({color: raw(REAL.lamination), metalness: 0.45, roughness: 0.5}),
      // dark cast iron, so the light haze reads over it
      bulkhead: new THREE.MeshPhysicalMaterial({color: raw(REAL.labDark), metalness: 0.3, roughness: 0.6}),
      steel: new THREE.MeshPhysicalMaterial({color: raw(REAL.steel), metalness: 0.9, roughness: 0.3}),
      shell: new THREE.MeshPhysicalMaterial({color: raw(REAL.backing), metalness: 0.7, roughness: 0.32}),
      journal: new THREE.MeshStandardMaterial({color: raw(REAL.steel), metalness: 0.25, roughness: 0.45}),
      ringSteel: new THREE.MeshStandardMaterial({color: raw(REAL.steel), metalness: 0.3, roughness: 0.4}),
      alu: new THREE.MeshPhysicalMaterial({color: raw(REAL.alu), metalness: 0.75, roughness: 0.35}),
      dark: new THREE.MeshBasicMaterial({color: raw(REAL.labDark)}),
      channel: new THREE.MeshBasicMaterial({color: raw(REAL.labDark), polygonOffset: true, polygonOffsetFactor: -2}),
      ring: new THREE.MeshBasicMaterial({color: raw(REAL.labDark)}),
      element: new THREE.MeshStandardMaterial({color: raw(REAL.friction), roughness: 0.9}),
      orangeCore: new THREE.MeshBasicMaterial({color: raw(section.orange)}),
      orangeHalo: new THREE.MeshBasicMaterial({color: raw(section.orange), transparent: true, depthWrite: false}),
      passCore: new THREE.MeshBasicMaterial({color: raw(section.orangeDot)}),
      flash: new THREE.MeshBasicMaterial({color: raw(section.screenLight), transparent: true, depthWrite: false, toneMapped: false}),
      spark: new THREE.MeshBasicMaterial({color: raw(section.screenLight), toneMapped: false}),
      // it writes depth, so a film halo behind it is masked where it crosses (§ 5: no orange-grey mix; the core shows)
      haze: new THREE.MeshBasicMaterial({color: raw(RACE.haze), transparent: true, depthWrite: true, side: THREE.DoubleSide}),
      carbon: new THREE.MeshStandardMaterial({color: raw(REAL.labDark), roughness: 0.8}),
      soot: new THREE.MeshBasicMaterial({color: raw(REAL.flex)}),
      water: new THREE.MeshBasicMaterial({color: raw(HIGHWAY.spray)}),
      fuel: new THREE.MeshBasicMaterial({color: raw(REAL.fuel)}),
    }),
    [],
  );
  for (const [m, c] of [
    [mats.flash, section.screenLight],
    [mats.spark, section.screenLight],
    [mats.haze, RACE.haze],
    [mats.soot, REAL.flex],
    [mats.water, HIGHWAY.spray],
    [mats.fuel, REAL.fuel],
    [mats.dark, REAL.labDark],
    [mats.channel, REAL.labDark],
    [mats.ring, REAL.labDark],
  ] as [THREE.MeshBasicMaterial, string][])
    m.color.copy(raw(c)).multiplyScalar(1 / exposure);
  const parts = keys.parts ?? true;
  const ink = 0.004 * inkScale;
  const mpp = oilMpp(camD);
  const crank = crankAt(t);
  const pose = i4Pose(crank);
  const running = onAt(t) > 0.5;

  // ---- strength, surges, widths (screen-constant: the core ≈ 4 px wide at full strength, never under 2 px)
  const sk = strengthLook(keyedValue(keys.strength, t, 1));
  const ck = keys.core !== undefined ? strengthLook(keyedValue(keys.core, t, 1)).core : sk.core;
  const surgeAll = (keys.surgeAt ?? []).reduce((a, s) => Math.max(a, bump(t - s)), 0);
  const filmCore = Math.max(1.0 * mpp, 2.0 * mpp * ck);
  const pathCore = Math.max(1.0 * mpp, 2.4 * mpp * ck);
  const haloOf = (surge: number) => sk.halo + (0.45 - sk.halo) * Math.max(surge, surgeAll);
  const coreOf = (base: number, surge: number) => base * (1 + 0.15 * Math.max(surge, surgeAll));
  const waveOf = (i: number) => (keys.waveAt == null ? 0 : bump(t - keys.waveAt - i * 0.08));
  const om = {core: mats.orangeCore, halo: mats.orangeHalo};

  // ---- geometry (static)
  const geo = useMemo(() => {
    const P = OIL.pump;
    const F = OIL.filter;
    const pumpBox: P2[] = [
      [P.c[0] - P.ha, P.c[1] - P.hx],
      [P.c[0] - P.ha, P.c[1] + P.hx],
      [P.c[0] + P.ha, P.c[1] + P.hx],
      [P.c[0] + P.ha, P.c[1] - P.hx],
    ];
    const pumpIn: P2[] = [
      [P.c[0] - P.ha + 0.004, P.c[1] - P.hx + 0.004],
      [P.c[0] - P.ha + 0.004, P.c[1] + P.hx - 0.004],
      [P.c[0] + P.ha - 0.004, P.c[1] + P.hx - 0.004],
      [P.c[0] + P.ha - 0.004, P.c[1] - P.hx + 0.004],
    ];
    const filt: P2[] = [
      [F.c[0] - F.ha, F.c[1] - F.hx],
      [F.c[0] - F.ha, F.c[1] + F.hx],
      [F.c[0] + F.ha, F.c[1] + F.hx],
      [F.c[0] + F.ha, F.c[1] - F.hx],
    ];
    const filtIn: P2[] = [
      [F.c[0] - F.ha + 0.004, F.c[1] - F.hx + 0.004],
      [F.c[0] - F.ha + 0.004, F.c[1] + F.hx - 0.004],
      [F.c[0] + F.ha - 0.008, F.c[1] + F.hx - 0.004],
      [F.c[0] + F.ha - 0.008, F.c[1] - F.hx + 0.004],
    ];
    // the pleated element: an outer band of pleats round a centre tube, all cut
    const pleat: P2[] = [];
    const ea0 = F.c[0] - F.ha + 0.012;
    const ea1 = F.c[0] + F.ha - 0.014;
    for (const side of [-1, 1]) {
      const c0 = F.c[1] + side * 0.009;
      const c1 = F.c[1] + side * (F.hx - 0.006);
      const rowPts: P2[] = [];
      const n = 14;
      for (let i = 0; i <= n; i++) rowPts.push([ea0 + ((ea1 - ea0) * i) / n, i % 2 ? c0 : c1]);
      pleat.push(...(side < 0 ? rowPts : rowPts.reverse()));
    }
    const pickup: P2[] = [
      [-0.236, 0.0],
      [-0.2, 0.0],
      [-0.14, 0.06],
      [-0.116, 0.06],
    ];
    const pickupStrip = strip(pickup, 0.011);
    const pickupBore = strip(pickup, 0.005);
    const bell: P2[] = [
      [-0.24, -0.016],
      [-0.24, 0.016],
      [-0.228, 0.008],
      [-0.228, -0.008],
    ];
    const strut: P2[] = [
      [-0.011, OIL.main.cap - 0.004],
      [-0.011, 0.108],
      [0.011, 0.108],
      [0.011, OIL.main.cap - 0.004],
    ];
    const S = (pts: P2[]) => carPts(pts);
    return {
      pump: slab(S(pumpBox), Z - 0.06, Z, [S(pumpIn).reverse()]),
      pumpInk: [S(pumpBox), S(pumpIn)].map((p) => p.map(([x, y]) => [x, y, Z + 0.002] as V3)),
      pumpBack: flat(S(pumpIn), Z - 0.03),
      filter: slab(S(filt), Z - 0.08, Z, [S(filtIn).reverse()]),
      filterInk: [S(filt), S(filtIn)].map((p) => p.map(([x, y]) => [x, y, Z + 0.002] as V3)),
      filterBack: flat(S(filtIn), Z - 0.05),
      element: flat(S(pleat), Z - 0.002),
      elementInk: S(pleat).map(([x, y]) => [x, y, Z - 0.0015] as V3),
      pickup: flat(S(pickupStrip), Z + 0.0005),
      pickupBore: flat(S(pickupBore), Z + 0.0009),
      pickupInk: S(pickupStrip).map(([x, y]) => [x, y, Z + 0.0012] as V3),
      bell: flat(S(bell), Z + 0.0005),
      bellInk: S(bell).map(([x, y]) => [x, y, Z + 0.0012] as V3),
      passages: PASSAGES.map((p) => flat(S(strip(p, 0.0065)), Z + 0.0006)),
      passageInk: PASSAGES.map((p) => S(strip(p, 0.0065)).map(([x, y]) => [x, y, Z + 0.0011] as V3)),
      galleryHole: flat(S(ring(OIL.gallery, 0.0075, 24)), Z + 0.0008),
      galleryInk: S(ring(OIL.gallery, 0.0075, 24)).map(([x, y]) => [x, y, Z + 0.0013] as V3),
      // the main bearing's bulkhead (behind the cut: seen through the open crankcase) and the strut to the front wall
      cap: slab(S(ring([0, 0], OIL.main.cap, 48)), Z - 0.03, Z - 0.012, [S(ring([0, 0], OIL.main.r + OIL.main.gap + OIL.main.shell, 48)).reverse()]),
      strut: slab(S(strut), Z - 0.03, Z - 0.012),
      // the crankcase's dark inside (behind the crank), so the haze and the drops read on it
      backing: flat(S([[-0.122, -0.106], [-0.122, 0.106], [0.106, 0.106], [0.106, -0.106]]), Z - 0.09),
      strutChannel: flat(S(strip([[0, 0.105], [0, OIL.main.cap - 0.002]], 0.0055)), Z - 0.0118),
      routes: Object.fromEntries(
        (Object.keys(OIL_ROUTES) as (keyof typeof OIL_ROUTES)[]).map((k) => [k, polyCurve(OIL_ROUTES[k].map((p) => toCar(p)))]),
      ) as Record<keyof typeof OIL_ROUTES, THREE.CurvePath<THREE.Vector3>>,
    };
  }, []);
  const [cx, cyy] = GAS.crank;
  const pin = pose.pin;
  const wristC = cy(pose.pistonAlong);
  const pistonFace = Z - 0.0015;
  const crankTh = pose.th;

  // ---- the oil clock: dots' distance travelled (m, ∫ speed), the pass, drops
  const oilT = t + clock;
  const V0 = 0.12;
  let dist = V0 * clock;
  for (let x = 0; x < t; x += 1 / fps) {
    const h = Math.min(1 / fps, t - x);
    const m = x + h / 2;
    dist += V0 * strengthLook(keyedValue(keys.strength, m, 1)).speed * (onAt(m) > 0.5 ? 1 : 0) * h;
  }
  const routeList: (keyof typeof OIL_ROUTES)[] = ['feed', 'riser', 'intake', 'drain'];
  const dots = running
    ? routeList.flatMap((k) => {
        const curve = geo.routes[k];
        const L = curve.getLength();
        const n = Math.max(2, Math.round(L / 0.07));
        return [...Array(n).keys()].flatMap((i) => {
          const vis = Math.max(0, Math.min(1, (sk.dots - i / n) * n));
          if (vis < 0.02) return [];
          const u = ((((dist / L + i / n) % 1) + 1) % 1);
          const fade = Math.min(1, u / 0.05, (1 - u) / 0.05);
          const p = curve.getPointAt(u);
          return [{p: [p.x, p.y, p.z + 0.0005] as V3, s: vis * fade}];
        });
      })
    : [];
  // the pass: one bright dot through feed → riser → (the drain from the cams)
  const passOrder: (keyof typeof OIL_ROUTES)[] = ['feed', 'riser', 'drain'];
  const passLens = passOrder.map((k) => geo.routes[k].getLength());
  const passTotal = passLens.reduce((a, b) => a + b, 0);
  const passes = (keys.passAt ?? []).flatMap((p0) => {
    const u = (t - p0) / 2.4;
    if (u < 0 || u > 1) return [];
    let d = u * passTotal;
    for (let i = 0; i < passOrder.length; i++) {
      if (d <= passLens[i] || i === passOrder.length - 1) {
        const q = geo.routes[passOrder[i]].getPointAt(Math.min(1, d / passLens[i]));
        return [{p: [q.x, q.y, q.z + 0.001] as V3, k: Math.min(1, u / 0.04, (1 - u) / 0.04)}];
      }
      d -= passLens[i];
    }
    return [];
  });

  // ---- drops: flung off the crank (seeded slots every 0.2 s on the oil clock), off the piston when the jet squirts
  const surfY = oilSurfaceY(level);
  const G = 1.0;
  const rate = Math.max(0, keyedValue(keys.dripRate, t, 2.5));
  const drops: {p: V3; k: number}[] = [];
  if (rate > 0) {
    const SLOT = 0.2;
    const n1 = Math.floor(oilT / SLOT);
    for (let n = n1 - 6; n <= n1; n++) {
      const tb = n * SLOT;
      const age = oilT - tb;
      const tbScene = tb - clock;
      if (age < 0 || random(`oil-drop-${n}`) > rate * SLOT || onAt(tbScene) < 0.5) continue;
      const a = Math.PI * (1.15 + 0.7 * random(`oil-drop-a-${n}`));
      const r0 = 0.06 + 0.02 * random(`oil-drop-r-${n}`);
      const [x0, y0] = cy(r0 * Math.sin(a), r0 * Math.cos(a));
      const vx = 0.12 * Math.cos(a) * (random(`oil-drop-v-${n}`) > 0.5 ? 1 : -1);
      // they land in the sump's deep well (across −0.12 → 0.045 at the pool)
      const x = Math.max(cy(-0.2, -0.12)[0], Math.min(cy(-0.2, 0.045)[0], x0 + vx * age));
      const y = y0 - 0.5 * G * age * age;
      const tHit = Math.sqrt(Math.max(0, (2 * (y0 - surfY)) / G));
      if (age > tHit) continue;
      drops.push({p: [x, y, Z - 0.006], k: Math.min(1, age / 0.06, (tHit - age) / (3 / fps))});
    }
  }
  const jets = (keys.jetAt ?? []).map((j) => ({j, u: t - j})).filter((q) => q.u >= 0 && q.u < 1.6 && running);
  for (const {j} of jets) {
    for (let i = 0; i < 4; i++) {
      const tr = j + 0.2 + i * 0.18;
      const age = t - tr;
      if (age < 0) continue;
      const pr = i4Pose(crankAt(tr));
      const [x0, y0] = cy(pr.skirt - 0.001, (i % 2 ? 1 : -1) * (0.02 + 0.008 * random(`oil-jet-${j}-${i}`)));
      const y = y0 - 0.5 * G * age * age;
      const tHit = Math.sqrt(Math.max(0, (2 * (y0 - surfY)) / G));
      if (age > tHit) continue;
      drops.push({p: [x0, y, Z - 0.006], k: Math.min(1, age / 0.06, (tHit - age) / (3 / fps))});
    }
  }
  const jetK = jets.reduce((a, q) => Math.max(a, Math.min(1, q.u / 0.15, (0.9 - q.u) / 0.15)), 0);

  // ---- firings: spark (frame 0), flash (frames 1–3), ≤ 1 a second; the blow-by wisps
  const frame = Math.round(t * fps);
  const back = Math.ceil(2.8 * fps);
  const fires = useFirings(crankAt, onAt, frame, fps, back);
  const comb = keys.combustion ?? true;
  const combOn = (tf: number) => (comb === false ? false : comb === true ? true : tf >= (comb.at ?? -Infinity) && tf <= (comb.until ?? Infinity));
  const shown = fires.filter((j, i) => !fires.slice(i + 1).some((j2) => j2 - j < fps));
  const flashJ = shown.find((j) => j <= 3);
  const flashOp = flashJ === undefined || !combOn((frame - flashJ) / fps) ? 0 : [0, 0.75, 0.4, 0.15][flashJ];
  const sparkOn = flashJ === 0 && combOn(t);
  const bb = keys.blowBy;
  const wisps = bb
    ? fires
        .map((j) => ({tf: (frame - j) / fps, age: j / fps}))
        .filter((w) => w.tf >= bb.at && (bb.until == null || w.tf <= bb.until) && w.age < 2.7)
    : [];

  // the chamber's outline (cylinder frame) above the crown
  const cr = pose.crown;
  const h0 = I4.deck;
  const rr = R - 0.0006;
  const chamber: P2[] = [
    [cr, -rr],
    [h0 + 0.014, -rr],
    [h0 + 0.03, -0.035],
    [h0 + 0.035, 0],
    [h0 + 0.03, 0.035],
    [h0 + 0.014, rr],
    [cr, rr],
  ];

  // film parts, in wave order: main, rod, piston sides, wrist pin, cams, valve stems
  // the wave: each part's film swells (core × 1.6, halo 45 %) and a bright dot runs along it once
  const fm = (i: number) => ({core: filmCore * (1 + 0.6 * waveOf(i)) * (1 + 0.15 * surgeAll), halo: haloOf(waveOf(i))});
  const waveU = (i: number) => (keys.waveAt == null ? -1 : (t - keys.waveAt - i * 0.08) / 0.45);
  const haloW = (gap: number) => Math.min(gap / 2, filmCore * 3);
  const pistonSide = (s: number): [V3, V3] => {
    const a = cy(pose.skirt + 0.002, s * (R - 0.0008));
    const b = cy(cr - 0.003, s * (R - 0.0008));
    return [
      [a[0], a[1], Z + 0.003],
      [b[0], b[1], Z + 0.003],
    ];
  };
  const camC = (s: number) => cy(I4.deck + 0.1, s * 0.045);
  const valveFilm = (s: number): [V3, V3] => {
    const d: P2 = [Math.cos(0.2), s * Math.sin(0.2)];
    const pp: P2 = [-d[1], d[0]];
    const c: P2 = [0.345 + 0.0, s * 0.022];
    const off = -s * 0.0048;
    const a = cy(c[0] - 0.004 * d[0] + off * pp[0], c[1] - 0.004 * d[1] + off * pp[1]);
    const b = cy(c[0] + 0.026 * d[0] + off * pp[0], c[1] + 0.026 * d[1] + off * pp[1]);
    return [
      [a[0], a[1], Z + 0.003],
      [b[0], b[1], Z + 0.003],
    ];
  };
  const camArc = (s: number): [number, number] => {
    // the arc round the cam's base circle facing its valve (the contact)
    const c = camC(s);
    const v = cy(0.38, s * 0.03);
    const a = Math.atan2(v[1] - c[1], v[0] - c[0]);
    return [a - 0.7, a + 0.7];
  };

  return (
    <group position={tremor}>
      {parts ? (
        <>
          {/* the pump (cut, its two gears turning with the crank) */}
          <mesh geometry={geo.pump} material={[mats.cut, mats.alu]} castShadow receiveShadow />
          <mesh geometry={geo.pumpBack} material={mats.dark} />
          {geo.pumpInk.map((p, i) => (
            <InkLine key={i} points={p} thickness={ink} />
          ))}
          {[-1, 1].map((s) => {
            const c = cy(OIL.pump.c[0], OIL.pump.c[1] + s * 0.0105);
            return (
              <group key={s} position={[c[0], c[1], Z - 0.006]} rotation={[0, 0, s * crank * 2]}>
                {[...Array(8).keys()].map((k) => (
                  <mesh key={k} material={mats.steel} rotation={[0, 0, (k / 8) * Math.PI * 2]} position={[0, 0, 0]}>
                    <boxGeometry args={[0.021, 0.0045, 0.008]} />
                  </mesh>
                ))}
              </group>
            );
          })}
          {/* its pickup and screen down into the pool (cut lengthwise on the plane) */}
          <mesh geometry={geo.pickup} material={mats.cut} />
          <mesh geometry={geo.pickupBore} material={mats.channel} />
          <InkLine points={geo.pickupInk} thickness={ink * 0.7} />
          <mesh geometry={geo.bell} material={mats.cut} />
          <InkLine points={geo.bellInk} thickness={ink * 0.7} />
          {/* the filter on the block's front face (cut: shell, pleated element) */}
          <mesh geometry={geo.filter} material={[mats.cut, mats.iron]} castShadow receiveShadow />
          <mesh geometry={geo.filterBack} material={mats.dark} />
          <mesh geometry={geo.element} material={mats.element} />
          <InkLine points={geo.elementInk} thickness={ink * 0.5} />
          {geo.filterInk.map((p, i) => (
            <InkLine key={i} points={p} thickness={ink} />
          ))}
          {/* the drilled passages on the block's cut face, the main gallery's hole */}
          {geo.passages.map((g, i) => (
            <mesh key={i} geometry={g} material={mats.channel} />
          ))}
          {geo.passageInk.map((p, i) => (
            <InkLine key={i} points={p} thickness={ink * 0.6} />
          ))}
          <mesh geometry={geo.galleryHole} material={mats.channel} />
          <InkLine points={geo.galleryInk} thickness={ink * 0.6} />
          {/* the main bearing: bulkhead and strut (behind the cut), shells, the gap, the journal; the crank's drilling */}
          <mesh geometry={geo.backing} material={mats.dark} />
          <mesh geometry={geo.cap} material={mats.bulkhead} castShadow receiveShadow />
          <mesh geometry={geo.strut} material={mats.bulkhead} castShadow receiveShadow />
          <mesh geometry={geo.strutChannel} material={mats.channel} />
          <mesh position={[cx, cyy, Z - 0.0122]} material={mats.shell}>
            <ringGeometry args={[OIL.main.r + OIL.main.gap, OIL.main.r + OIL.main.gap + OIL.main.shell, 48]} />
          </mesh>
          <mesh position={[cx, cyy, Z - 0.0124]} material={mats.dark}>
            <ringGeometry args={[OIL.main.r, OIL.main.r + OIL.main.gap, 48]} />
          </mesh>
          <mesh position={[cx, cyy, Z - 0.0126]} material={mats.journal} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[OIL.main.r, OIL.main.r, 0.006, 32]} />
          </mesh>
          {/* index marks on the journals, turning with the crank (so the spin reads) */}
          {parts ? (
            <>
              <mesh position={[cx, cyy, Z - 0.0093]} rotation={[0, 0, crankTh + Math.PI / 2 + GAS.lean]} material={mats.dark}>
                <planeGeometry args={[OIL.main.r * 1.7, 0.0035]} />
              </mesh>
              <mesh position={[pin[0], pin[1], Z - 0.0109]} rotation={[0, 0, crankTh + Math.PI / 2 + GAS.lean]} material={mats.dark}>
                <planeGeometry args={[OIL.rod.r * 1.6, 0.003]} />
              </mesh>
            </>
          ) : null}
          {/* the rod's big end round the crank pin: the eye, shells, gap, journal */}
          <group position={[pin[0], pin[1], 0]}>
            <mesh position={[0, 0, Z - 0.0108]} material={mats.steel}>
              <ringGeometry args={[OIL.rod.r + OIL.rod.gap + OIL.rod.shell, OIL.rod.eye, 48]} />
            </mesh>
            <mesh position={[0, 0, Z - 0.0106]} material={mats.shell}>
              <ringGeometry args={[OIL.rod.r + OIL.rod.gap, OIL.rod.r + OIL.rod.gap + OIL.rod.shell, 48]} />
            </mesh>
            <mesh position={[0, 0, Z - 0.011]} material={mats.dark}>
              <ringGeometry args={[OIL.rod.r, OIL.rod.r + OIL.rod.gap, 48]} />
            </mesh>
            <mesh position={[0, 0, Z - 0.0112]} material={mats.journal}>
              <circleGeometry args={[OIL.rod.r, 32]} />
            </mesh>
          </group>
          {/* the wrist pin in its boss (on the piston's face) */}
          <group position={[wristC[0], wristC[1], 0]}>
            <mesh position={[0, 0, pistonFace + 0.0003]} material={mats.alu}>
              <ringGeometry args={[OIL.wrist.r + OIL.wrist.gap, OIL.wrist.boss, 40]} />
            </mesh>
            <mesh position={[0, 0, pistonFace + 0.0004]} material={mats.dark}>
              <ringGeometry args={[OIL.wrist.r, OIL.wrist.r + OIL.wrist.gap, 40]} />
            </mesh>
            <mesh position={[0, 0, pistonFace + 0.0005]} material={mats.journal}>
              <circleGeometry args={[OIL.wrist.r, 32]} />
            </mesh>
          </group>
          {/* the crown's carbon (dark), so the pale flash reads above it */}
          {(() => {
            const c = cy(cr + 0.0007);
            return (
              <mesh position={[c[0], c[1], Z - R]} rotation={[0, 0, GAS.lean]} material={mats.carbon}>
                <boxGeometry args={[2 * R - 0.0035, 0.0014, 2 * R - 0.0035]} />
              </mesh>
            );
          })()}
          {/* the three rings on the piston's face, each with its end gap (the top one 🎭 magnified) */}
          {OIL.rings.map((rg, i) => {
            const al = cr - rg.below;
            const left = [-R + 0.0015, rg.at - rg.gap / 2] as P2;
            const right = [rg.at + rg.gap / 2, R - 0.0015] as P2;
            const g = cy(al, 0);
            return (
              <group key={i}>
                {/* the groove (dark, the whole width), then the ring in it, broken at its end gap */}
                <mesh position={[g[0], g[1], pistonFace + 0.0003]} rotation={[0, 0, GAS.lean]} material={mats.ring}>
                  <planeGeometry args={[2 * R - 0.003, rg.h + 0.0012]} />
                </mesh>
                {[left, right].map(([c0, c1], k) => {
                  const m = cy(al, (c0 + c1) / 2);
                  return (
                    <mesh key={k} position={[m[0], m[1], pistonFace + 0.0005]} rotation={[0, 0, GAS.lean]} material={mats.ringSteel}>
                      <planeGeometry args={[c1 - c0, rg.h]} />
                    </mesh>
                  );
                })}
              </group>
            );
          })}
          {/* the oil jet: a small steel nozzle on the block under the bore */}
          {(() => {
            const a = cy(...OIL.jet.from);
            const b = cy(...OIL.jet.tip);
            const va = new THREE.Vector3(a[0], a[1], Z - 0.006);
            const vb = new THREE.Vector3(b[0], b[1], Z - 0.006);
            const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), vb.clone().sub(va).normalize());
            return (
              <mesh position={va.clone().add(vb).multiplyScalar(0.5)} quaternion={q} material={mats.steel}>
                <cylinderGeometry args={[0.0028, 0.0035, va.distanceTo(vb), 12]} />
              </mesh>
            );
          })()}
          {/* the spark plug's tip in the chamber's roof (electrode and its ground strap) */}
          {(() => {
            const tip = cy(h0 + 0.031, 0);
            return (
              <group position={[tip[0], tip[1], Z - 0.004]} rotation={[0, 0, GAS.lean]}>
                <mesh material={mats.steel} position={[0, 0.002, 0]}>
                  <boxGeometry args={[0.0022, 0.006, 0.002]} />
                </mesh>
                <mesh material={mats.steel} position={[0.0018, -0.0012, 0]}>
                  <boxGeometry args={[0.0036, 0.0012, 0.002]} />
                </mesh>
              </group>
            );
          })()}
        </>
      ) : null}

      {/* ---- the system: the circulation (core, halo; through the head behind the cut face) */}
      {routeList.map((k) => (
        <GlowRun key={k} curve={geo.routes[k]} core={coreOf(pathCore, 0)} halo={haloOf(0)} haloScale={2.6} mats={om} segs={k === 'feed' ? 96 : 64} />
      ))}
      {/* the crank's drilling (main journal → crank pin), turning with the crank */}
      <GlowSeg a={[cx, cyy, Z - 0.0095]} b={[pin[0], pin[1], Z - 0.0095]} core={coreOf(pathCore, 0) * 0.8} halo={haloOf(0)} haloScale={2.2} mats={om} />
      {dots.map((d, i) => (
        <mesh key={`d${i}`} position={d.p} scale={Math.max(0.0001, d.s) * pathCore * 2.4} material={mats.orangeCore} userData={{glow: true}} renderOrder={7}>
          <sphereGeometry args={[1, 10, 8]} />
        </mesh>
      ))}
      {passes.map((d, i) => (
        <group key={`p${i}`} position={d.p} scale={Math.max(0.0001, d.k) * pathCore}>
          <mesh material={mats.passCore} userData={{glow: true}} renderOrder={8}>
            <sphereGeometry args={[3.0, 12, 10]} />
          </mesh>
          <mesh material={mats.orangeCore} userData={{glow: true}} renderOrder={7}>
            <sphereGeometry args={[4.2, 12, 10]} />
          </mesh>
        </group>
      ))}
      {/* the film: main bearing, rod bearing (centred in their gaps), piston sides, wrist pin, cam lobes, valve stems */}
      <GlowRing c={[cx, cyy, Z - 0.0118]} r={OIL.main.r + OIL.main.gap / 2} core={fm(0).core} halo={fm(0).halo} haloW={haloW(OIL.main.gap)} mats={om} />
      <GlowRing c={[pin[0], pin[1], Z - 0.0104]} r={OIL.rod.r + OIL.rod.gap / 2} core={fm(1).core} halo={fm(1).halo} haloW={haloW(OIL.rod.gap)} mats={om} />
      {[-1, 1].map((s) => {
        const [a, b] = pistonSide(s);
        return <GlowSeg key={s} a={a} b={b} core={fm(2).core} halo={fm(2).halo * 0.85} haloScale={2.2} mats={om} />;
      })}
      <GlowRing c={[wristC[0], wristC[1], pistonFace + 0.0007]} r={OIL.wrist.r + OIL.wrist.gap / 2} core={fm(3).core * 0.8} halo={fm(3).halo} haloW={haloW(OIL.wrist.gap)} mats={om} />
      {[-1, 1].map((s) => {
        const c = camC(s);
        return <GlowRing key={`cam${s}`} c={[c[0], c[1], Z - 0.002]} r={0.019} core={fm(4).core} halo={fm(4).halo} haloW={filmCore * 2.2} mats={om} arc={camArc(s)} />;
      })}
      {[-1, 1].map((s) => {
        const [a, b] = valveFilm(s);
        return <GlowSeg key={`v${s}`} a={a} b={b} core={fm(5).core * 0.85} halo={fm(5).halo * 0.8} haloScale={2.0} mats={om} />;
      })}
      {/* the wave's running dots: round each bearing, along the piston's sides and the valve stems */}
      {(() => {
        const out: {p: V3; k: number}[] = [];
        const ringDot = (i: number, c: V3, r: number) => {
          const u = waveU(i);
          if (u < 0 || u > 1) return;
          const a = Math.PI / 2 - u * Math.PI * 2;
          out.push({p: [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a), c[2] + 0.0006], k: Math.min(1, u / 0.1, (1 - u) / 0.1)});
        };
        const segDot = (i: number, [a, b]: [V3, V3]) => {
          const u = waveU(i);
          if (u < 0 || u > 1) return;
          out.push({p: [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + 0.0006], k: Math.min(1, u / 0.1, (1 - u) / 0.1)});
        };
        ringDot(0, [cx, cyy, Z - 0.0118], OIL.main.r + OIL.main.gap / 2);
        ringDot(1, [pin[0], pin[1], Z - 0.0104], OIL.rod.r + OIL.rod.gap / 2);
        segDot(2, pistonSide(-1));
        segDot(2, pistonSide(1));
        ringDot(3, [wristC[0], wristC[1], pistonFace + 0.0007], OIL.wrist.r + OIL.wrist.gap / 2);
        [-1, 1].forEach((s) => {
          const c = camC(s);
          ringDot(4, [c[0], c[1], Z - 0.002], 0.019);
          segDot(5, valveFilm(s));
        });
        return out.map((d, i) => (
          <mesh key={`w${i}`} position={d.p} scale={Math.max(0.0001, d.k) * filmCore * 2.4} material={mats.passCore} userData={{glow: true}} renderOrder={8}>
            <sphereGeometry args={[1, 10, 8]} />
          </mesh>
        ));
      })()}
      {/* the jet's stream onto the piston's underside while it squirts */}
      {jetK > 0.02
        ? (() => {
            const a = cy(...OIL.jet.tip);
            const b = cy(pose.skirt, -0.012);
            return <GlowSeg a={[a[0], a[1], Z - 0.004]} b={[b[0], b[1], Z - 0.004]} core={coreOf(filmCore, 0) * jetK} halo={haloOf(0) * jetK} haloScale={2.0} mats={om} />;
          })()
        : null}
      {/* drops: a core with its halo (≤ 2× the core), gone at the pool's surface */}
      {drops.map((d, i) => (
        <group key={`o${i}`} position={d.p} scale={Math.max(0.0001, d.k) * filmCore * 2.4}>
          <mesh material={mats.orangeCore} userData={{glow: true}} renderOrder={7}>
            <sphereGeometry args={[1, 10, 8]} />
          </mesh>
          <mesh material={haloMat(mats.orangeHalo, haloOf(0))} userData={{glow: true}} renderOrder={6}>
            <sphereGeometry args={[2, 10, 8]} />
          </mesh>
        </group>
      ))}

      {/* ---- combustion: the spark (1 frame), the flat flash clipped to the chamber (3 frames); never bloomed */}
      {sparkOn ? (
        <mesh position={(() => {
          const s = cy(h0 + 0.026, 0.0015);
          return [s[0], s[1], Z - 0.0006] as V3;
        })()} material={mats.spark}>
          <circleGeometry args={[Math.max(0.0012, 2.6 * mpp), 16]} />
        </mesh>
      ) : null}
      {flashOp > 0 ? <Flash pts={carPts(chamber)} z={Z - 0.0008} opacity={flashOp} material={mats.flash} /> : null}

      {/* ---- blow-by: haze wisps (≤ 0.45, never bloomed) and their specks */}
      {wisps.map((w) => (
        <Wisp
          key={w.tf}
          tf={w.tf}
          now={t}
          age={w.age}
          crankAt={crankAt}
          pose={pose}
          surfAlong={surfaceAlong(surfY)}
          size={bb?.size ?? 1}
          haze={mats.haze}
          specks={keys.specks ?? null}
          speckMats={{soot: mats.soot, water: mats.water, fuel: mats.fuel}}
          mpp={mpp}
        />
      ))}
    </group>
  );
};

const haloCache = new WeakMap<THREE.MeshBasicMaterial, Map<number, THREE.MeshBasicMaterial>>();
/** A halo material at an opacity (cached per rounded opacity, so drops don't make a material each a frame). */
const haloMat = (base: THREE.MeshBasicMaterial, op: number) => {
  const k = Math.round(op * 100);
  let m = haloCache.get(base);
  if (!m) haloCache.set(base, (m = new Map()));
  let x = m.get(k);
  if (!x) {
    x = base.clone();
    x.opacity = k / 100;
    m.set(k, x);
  }
  return x;
};

/** The firings over the last frames (memo per frame). */
const useFirings = (crankAt: (t: number) => number, onAt: (t: number) => number, frame: number, fps: number, back: number) =>
  oilFirings(crankAt, onAt, frame, fps, back);

/** The cylinder frame's `along` of a car-frame height on the sump's front wall side (for the wisps' end). */
const surfaceAlong = (y: number) => {
  // along such that cy(along, across≈0.03)[1] = y: y = crankY + cos(lean)·along + sin(lean)·across
  return (y - GAS.crank[1] - Math.sin(GAS.lean) * 0.03) / Math.cos(GAS.lean);
};

/** The flat flash: the chamber's cut outline filled, `screenLight`, at an opacity. */
const Flash: React.FC<{pts: P2[]; z: number; opacity: number; material: THREE.MeshBasicMaterial}> = ({pts, z, opacity, material}) => {
  const key = pts.map(([x, y]) => `${x.toFixed(5)},${y.toFixed(5)}`).join(';');
  const g = useMemo(() => {
    const geo = new THREE.ShapeGeometry(shapeOf(pts), 4);
    geo.translate(0, 0, z);
    return geo;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, z]);
  useEffect(() => () => g.dispose(), [g]);
  material.opacity = opacity;
  return <mesh geometry={g} material={material} renderOrder={9} />;
};

/** A per-frame ribbon mesh (positions, indices), its geometry disposed when it changes. */
const Ribbon: React.FC<{verts: number[]; idx: number[]; material: THREE.Material; order: number}> = ({verts, idx, material, order}) => {
  const key = verts.map((v) => v.toFixed(5)).join(',');
  const g = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
    geo.setIndex(idx);
    return geo;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  useEffect(() => () => g.dispose(), [g]);
  return <mesh geometry={g} material={material} renderOrder={order} />;
};

/**
 * One blow-by wisp (a firing at scene time `tf`, `age` s ago): a haze ribbon whose head squeezes through the ring gaps
 * (0 → 0.35 s, riding the piston), runs down the skirt and the crankcase's front wall to the pool (→ 1.3 s), then spreads
 * on the pool's surface and fades (→ 2.3 s). One mesh, so its opacity never stacks.
 */
const Wisp: React.FC<{
  tf: number;
  age: number;
  crankAt: (t: number) => number;
  pose: ReturnType<typeof i4Pose>;
  surfAlong: number;
  size: number;
  haze: THREE.MeshBasicMaterial;
  specks: OilSystemKeys['specks'];
  now: number;
  speckMats: Record<'soot' | 'water' | 'fuel', THREE.MeshBasicMaterial>;
  mpp: number;
}> = ({tf, age, crankAt, pose, surfAlong, size, haze, specks, speckMats, mpp, now}) => {
  const gx = OIL.rings[0].at;
  const exit = i4Pose(crankAt(tf + 0.35));
  // the path in the cylinder frame with a depth per point: on the piston face, then inside the crankcase
  const onFace = Z - 0.0008;
  const inside = Z - 0.005;
  const path: CP[] = [
    [pose.crown - 0.001, gx, onFace],
    [pose.skirt + 0.002, gx, onFace],
  ];
  // across the open crankcase in front of the crank's front side (clear of the block's slanted wall, the pump and the
  // pickup), down into the sump's deep well to the pool
  const top = Math.min(exit.skirt - 0.015, 0.07);
  const free: CP[] = [
    [exit.skirt - 0.003, gx, inside],
    [top, 0.03, inside],
    ...(
      [
        [0.03, 0.05],
        [-0.05, 0.056],
        [-0.105, 0.034],
      ] as P2[]
    )
      .filter(([a]) => a < top - 0.01)
      .map(([a, c]): CP => [a, c, inside]),
    [surfAlong + 0.004, 0.018, inside],
  ];
  const all = age < 0.35 ? path : [...path.slice(0, 1).map((p): CP => [exit.crown - 0.001, p[1], p[2]]), [exit.skirt + 0.002, gx, onFace] as CP, ...free];
  const pts = all.map(([a, c, z]) => {
    const q = cy(a, c);
    return new THREE.Vector3(q[0], q[1], z);
  });
  const lens = pts.slice(1).map((p, i) => p.distanceTo(pts[i]));
  const L = lens.reduce((a, b) => a + b, 0);
  const at = (s: number) => {
    let d = Math.max(0, Math.min(L, s));
    for (let i = 0; i < lens.length; i++) {
      if (d <= lens[i] || i === lens.length - 1) return pts[i].clone().lerp(pts[i + 1], lens[i] ? Math.min(1, d / lens[i]) : 0);
      d -= lens[i];
    }
    return pts[pts.length - 1].clone();
  };
  const faceLen = lens[0];
  // the head's distance along the path: through the rings (0.35 s), then on down to the pool (→ 1.3 s)
  const head = age < 0.35 ? (age / 0.35) * faceLen : faceLen + lens[1] + ((Math.min(1.6, age) - 0.35) / 1.25) * Math.max(0, L - faceLen - lens[1]);
  const tailLen = 0.14;
  const spread = Math.max(0, Math.min(1, (age - 1.6) / 1.0));
  const w = 0.03 * size;
  const op = Math.min(0.44, 0.44 * Math.min(1, age / 0.12) * (1 - spread));
  if (op < 0.01) return null;
  // the ribbon: samples from the tail to the head, widened on the pool as it spreads
  const N = 16;
  const s0 = Math.max(0, head - tailLen * (1 - 0.6 * spread));
  const verts: number[] = [];
  const idx: number[] = [];
  for (let i = 0; i <= N; i++) {
    const s = s0 + ((head - s0) * i) / N;
    const p = at(s);
    const q = at(Math.min(L, s + 0.002));
    const d = new THREE.Vector2(q.x - p.x, q.y - p.y).normalize();
    const ends = Math.sin((Math.PI * i) / N) ** 0.6;
    const ww = (w * (0.55 + 0.45 * ends)) / 2;
    verts.push(p.x - d.y * ww, p.y + d.x * ww, p.z, p.x + d.y * ww, p.y - d.x * ww, p.z);
    if (i < N) idx.push(2 * i, 2 * i + 1, 2 * i + 2, 2 * i + 1, 2 * i + 3, 2 * i + 2);
  }
  const hm = haloMat(haze, op);
  // on the pool: a thin flat sheet spreading along the surface
  const pool = spread > 0 ? cy(surfAlong + 0.003, -0.02) : null;
  // specks riding the wisp, then sinking into the pool (they pass behind its cut face and are gone)
  // a kind rides every wisp on screen from its cue (scene time), fading in over 0.2 s
  const kinds = (['soot', 'water', 'fuel'] as const).filter((k) => specks && specks[k] !== undefined && now >= (specks[k] as number));
  const kIn = (k: 'soot' | 'water' | 'fuel') => Math.min(1, (now - (specks?.[k] as number)) / 0.2);
  // ≈ 14 px across on screen (12–16 px at the close framing)
  const r = Math.max(0.0012, 7 * mpp);
  return (
    <group>
      <Ribbon verts={verts} idx={idx} material={hm} order={4} />
      {pool ? (
        <mesh position={[pool[0], pool[1], Z - 0.005]} rotation={[0, 0, GAS.lean]} scale={[0.04 + 0.12 * spread, 0.004 * (1 - 0.5 * spread), 1]} material={hm} renderOrder={4}>
          <planeGeometry args={[1, 1]} />
        </mesh>
      ) : null}
      {kinds.flatMap((k, ki) =>
        [0, 1, 2, 3].map((n) => {
          const seed = `oil-speck-${tf.toFixed(3)}-${k}-${n}`;
          const lag = 0.008 + 0.075 * random(seed);
          const p = at(Math.max(0, head - lag));
          const sink = Math.max(0, age - 1.55 - 0.1 * ki);
          const lat = (random(`${seed}-x`) - 0.5) * w * 0.7;
          const y = p.y + lat - 0.03 * sink * sink - 0.004 * sink;
          return (
            <mesh key={`${k}${n}`} position={[p.x + lat * 0.3, y, p.z + 0.0008]} material={speckMats[k]} renderOrder={5}>
              <circleGeometry args={[r * (k === 'soot' ? 1.0 : 0.95) * Math.max(0.05, kIn(k)), 12]} />
            </mesh>
          );
        }),
      )}
    </group>
  );
};
