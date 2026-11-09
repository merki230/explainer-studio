import React, {useEffect, useMemo} from 'react';
import {useThree} from '@react-three/fiber';
import {random} from 'remotion';
import * as THREE from 'three';
import {ease, keyedValue, type Keyed} from '../../scenes/keyframes';
import {CHARGE, HIGHWAY, MOODS, REAL, section, WINTER, type Mood} from '../../theme';
import {raw, roundedBox} from '../plaster';
import {cutMaterial, INK, InkLine} from '../section/cutLook';
import {applyEnv, useEnvStrength, useStudioEnv} from './useStudioEnv';

type V3 = [number, number, number];

/*
 * No. 017 `ev-winter`: heat in a car, as parts and a flow drawing, in the car's own frame (`RealCar`: x forward, y up,
 * the near cut at z = 0.8; metres). Generic, no maker. Brand v0.18.11 (§ 3 Winter and heat parts, § 5 One system per
 * video / System heat near the cast): the heat and the energy spent making it are the system (`HEAT_COLOR`); the parts
 * themselves are real materials (aluminium cores, `CHARGE.cabinetDark` housings and fans, `CHARGE.coolant` in cut hoses),
 * never red-hot; a running heater core / element takes the § 5 "made by" glow (orange edge and halo).
 *
 *  - `HeatFlow`: a flow along a route (core + halo tubes, flowing dots, end nodes), its width, draw-on, fade and surge.
 *  - `HeatWisps` + `wispStates`: warm-air wisps, halo only (no core, no dots, no light), ≤ 25 %, living in the air (they
 *    drift back with the road when the car moves), fading out by age and by `reach` (how far from the vent they may go).
 *  - `HvacBox` (N1): the box behind the dash, cut with the dash: housing, blower wheel, a heater core ('core', gas) or an
 *    electric element ('electric', EV), the defrost and face vents; the EV's feed from the pack.
 *  - `GasHeat` (N2): radiator (cut, finned, coolant), fan, coolant hoses (cut, coolant inside), the exhaust pipe and
 *    muffler under the car, and the heat flows: fat to the radiator and along the exhaust, a thin branch to the core.
 *  - `HeatPump` (N9): an outside heat exchanger behind the grille, a compressor, refrigerant lines, the wisps pulled in.
 *  - `InkGauge` (N3, N4): the § 3 in-set ink gauge as a thermometer (tube + fill line) or a range scale (ticks + fill).
 */

/** The heat flows' colour: one token, so a ruling sets it in one place (brand v0.18.11: `section.orange`). */
export const HEAT_COLOR = section.orange;

/** Layout (car frame, the crossover cut). */
export const HEAT = {
  /** The dash (RealCar's crossover dash: x 0.72–1.12, y 0.94–1.22); the HVAC box sits in it, cut at the near cut. */
  box: {x0: 0.72, x1: 1.12, y0: 0.94, y1: 1.22, z0: 0.5, z1: 0.8},
  /** The housing's wall thickness (its cut ring). */
  wall: 0.024,
  /** The blower wheel's centre and radius (the intake end, toward the cowl). */
  blower: [1.025, 1.08] as [number, number],
  blowerR: 0.058,
  /** The heater core / element: its centre x, height span, width (x) and its depth into the box. */
  core: {x: 0.88, y0: 0.985, y1: 1.175, w: 0.05},
  /** Vents (outlet points, car frame): the defrost slot on the dash top under the glass, the face vent on the dash's rear face. */
  defrost: [1.0, 1.225, 0.66] as V3,
  face: [0.715, 1.15, 0.66] as V3,
  /** The plane the flows ride on (just proud of the cuts they pass). */
  flowZ: 0.815,
};

/** The EV heater's feed from the pack (N1): along the pack's top, up the firewall, into the box to the element. */
export const EV_HEATER_FEED: V3[] = [
  [0.62, 0.345, 0.66],
  [0.93, 0.345, 0.66],
  [0.93, 1.0, 0.66],
  [0.93, 1.0, 0.79],
  [0.905, 1.0, 0.79],
];

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

/** A part's turn (rad) at t from speed keys (0 → 1 of `revs` rev/s), a fixed-step sum (deterministic), plus `from`. */
export const heatSpin = (k: Keyed | undefined, t: number, revs: number, fps = 30, from = 0) => {
  if (k === undefined) return from;
  const STEP = 1 / fps;
  let a = 0;
  for (let x = 0; x < t; x += STEP) a += clamp01(keyedValue(k, x + STEP / 2, 1)) * Math.min(STEP, t - x);
  return from + a * revs * 2 * Math.PI;
};
/** The blower's and the radiator fan's speeds at 1 (rev/s; under the blades' alias limits at 30 fps). */
export const HEAT_SPIN = {blower: 0.8, fan: 1.1};

// ---------------------------------------------------------------------------------------------- the flow primitive

/** A polyline as straight legs (right-angle runs, § 5): each pair of points one leg. */
export const runs = (pts: V3[]): V3[][] => pts.slice(1).map((q, i) => [pts[i], q]);

const curveOf = (legs: V3[][]) => {
  const path = new THREE.CurvePath<THREE.Vector3>();
  for (const leg of legs) path.add(new THREE.CatmullRomCurve3(leg.map((p) => new THREE.Vector3(...p)), false, 'catmullrom', 0.2));
  return path;
};

export type HeatFlowProps = {
  /** The route: one or more legs (each a smooth curve through its points; legs meet at a corner). */
  legs: V3[][];
  /** 0 → 1: how much of the route is drawn (from its start). Default 1. */
  progress?: number;
  /** 0 → 1: the flow's strength (core, halo and dots fade with it). Default 1. */
  glow?: number;
  /** Core radius (m). The halo is `haloScale` × this. Default 0.012. */
  radius?: number;
  haloScale?: number;
  /** The halo's opacity at glow 1 (default 0.25); a surge lifts it toward 0.45 (§ 5 surge). */
  halo?: number;
  /** 0 → 1: a surge (halo up to 0.45, core 15 % wider). Default 0. */
  surge?: number;
  /** Dots flowing along the whole route once drawn: their phase in route-lengths (e.g. t / period). Omit: no dots. */
  flow?: number;
  dots?: number;
  /** Node dots at the start (once drawing) and the end (once arrived). Default true. */
  nodes?: boolean;
  /** Core and halo colour. Default `HEAT_COLOR`. */
  color?: string;
};

/** The heat flow drawing: a glowing route (core + halo, bloomed), flowing dots, node dots at both ends. */
export const HeatFlow: React.FC<HeatFlowProps> = ({
  legs,
  progress = 1,
  glow = 1,
  radius = 0.012,
  haloScale = 2.8,
  halo = 0.25,
  surge = 0,
  flow,
  dots = 4,
  nodes = true,
  color = HEAT_COLOR,
}) => {
  const key = JSON.stringify(legs);
  const curve = useMemo(() => curveOf(JSON.parse(key)), [key]);
  const segs = useMemo(() => Math.max(24, Math.round(curve.getLength() * 90)), [curve]);
  const mats = useMemo(
    () => ({
      core: new THREE.MeshBasicMaterial({color: raw(color), transparent: true}),
      halo: new THREE.MeshBasicMaterial({color: raw(color), transparent: true, depthWrite: false}),
      dot: new THREE.MeshBasicMaterial({color: raw(section.orangeDot), transparent: true}),
      node: new THREE.MeshBasicMaterial({color: raw(color), transparent: true}),
    }),
    [color],
  );
  useEffect(() => () => Object.values(mats).forEach((m) => m.dispose()), [mats]);
  const p = clamp01(progress);
  const g = clamp01(glow);
  const s = clamp01(surge);
  if (p <= 0 || g <= 0.003) return null;
  mats.core.opacity = g;
  mats.halo.opacity = Math.min(0.6, (halo + (0.45 - halo) * s) * g);
  mats.dot.opacity = g;
  mats.node.opacity = g;
  const r = radius * (1 + 0.15 * s);
  const a = curve.getPointAt(0);
  const b = curve.getPointAt(1);
  return (
    <group>
      <FlowTube curve={curve} segs={segs} radius={r} progress={p} material={mats.core} order={3} />
      <FlowTube curve={curve} segs={segs} radius={r * haloScale} progress={p} material={mats.halo} order={4} />
      {nodes ? (
        <>
          <mesh position={a} material={mats.node} userData={{glow: true}} renderOrder={5}>
            <sphereGeometry args={[r * 2.1, 14, 10]} />
          </mesh>
          {p >= 0.999 ? (
            <mesh position={b} material={mats.node} userData={{glow: true}} renderOrder={5}>
              <sphereGeometry args={[r * 2.1, 14, 10]} />
            </mesh>
          ) : null}
        </>
      ) : null}
      {flow !== undefined && p >= 0.999
        ? [...Array(dots).keys()].map((i) => {
            const u = (((flow + i / dots) % 1) + 1) % 1;
            // dots fade in and out at the route's ends (no pop at the loop of the phase)
            const k = Math.min(1, u / 0.06, (1 - u) / 0.06);
            return (
              <mesh key={i} position={curve.getPointAt(u)} scale={Math.max(0.001, k)} material={mats.dot} userData={{glow: true}} renderOrder={6}>
                <sphereGeometry args={[r * 1.5, 10, 8]} />
              </mesh>
            );
          })
        : null}
    </group>
  );
};

/** A tube of a radius along `curve`, revealed from its start to `progress` (rebuilt only when the radius changes). */
const FlowTube: React.FC<{curve: THREE.Curve<THREE.Vector3>; segs: number; radius: number; progress: number; material: THREE.Material; order: number}> = ({
  curve,
  segs,
  radius,
  progress,
  material,
  order,
}) => {
  const rk = Math.round(radius * 2000) / 2000;
  const geo = useMemo(() => new THREE.TubeGeometry(curve, segs, Math.max(0.0005, rk), 8, false), [curve, segs, rk]);
  useEffect(() => () => geo.dispose(), [geo]);
  const total = geo.index ? geo.index.count : 0;
  geo.setDrawRange(0, Math.floor((total * clamp01(progress)) / 6) * 6);
  return <mesh geometry={geo} material={material} userData={{glow: true}} frustumCulled={false} renderOrder={order} />;
};

// ---------------------------------------------------------------------------------------------- wisps

export type WispSource = {
  /** Where wisps start (car frame). */
  origin: V3;
  /** Their own velocity (m/s, car frame) as they leave. */
  velocity: V3;
  /** Seconds between wisps (default 0.35). The pattern repeats with this period while the strength holds. */
  every?: number;
  /** A wisp's life (s, default 1.4). */
  life?: number;
  /** Jitter of the start point (m, default 0.03). */
  spread?: number;
  /** Size at birth and at death (m, defaults 0.03 → 0.09). */
  size?: [number, number];
  /** Max distance (m) a wisp may travel from its origin (own motion plus drift) before it has faded out. Default none. */
  reach?: number;
  /** Fully faded by this car-frame x (a wall it must not pass: a figure's front, the windshield). Default none. */
  stopX?: {x: number; side: 1 | -1; soft?: number};
  /** Never lower than this (car-frame y, m): wisps keep off the road. Default none. */
  minY?: number;
  /** Seed text. */
  seed: string;
};

/** A wisp at t; `dir` (unit, optional): it is drawn out along its flow (air being drawn in), not as round lobes. */
export type WispState = {key: number; p: V3; r: number; op: number; dir?: V3};

/**
 * The wisps alive at t (pure). `level(t)` is the strength (0 → 1) when each wisp is born; `drift(t)` the metres the car
 * has travelled (the air stays put, so a wisp drifts back, −x in the car frame, by the distance since its birth).
 */
export const wispStates = (
  s: WispSource,
  t: number,
  level: (t: number) => number,
  drift: (t: number) => number,
  /** Seconds added to t for the spawn grid (the scene's clock: continuity across scenes, a loop's seam). */
  phase = 0,
): WispState[] => {
  const every = Math.max(0.05, s.every ?? 0.35);
  const life = s.life ?? 1.4;
  const out: WispState[] = [];
  const u = t + phase;
  const k0 = Math.floor((u - life) / every);
  const k1 = Math.floor(u / every);
  const [s0, s1] = s.size ?? [0.03, 0.09];
  for (let k = k0; k <= k1; k++) {
    const t0 = k * every - phase;
    const age = t - t0;
    if (age < 0 || age > life) continue;
    const lv = clamp01(level(t0));
    if (lv < 0.01) continue;
    const rnd = (n: string) => random(`${s.seed}-${k}-${n}`);
    const sp = s.spread ?? 0.03;
    const back = drift(t) - drift(t0);
    const sway = 0.015 * Math.sin(age * 4 + 6 * rnd('ph'));
    const vk = 0.75 + 0.5 * rnd('v');
    const p: V3 = [
      s.origin[0] + (rnd('x') - 0.5) * sp + s.velocity[0] * age * vk - back,
      s.origin[1] + (rnd('y') - 0.5) * sp + s.velocity[1] * age * vk + sway,
      s.origin[2] + (rnd('z') - 0.5) * sp + s.velocity[2] * age * vk,
    ];
    if (s.minY !== undefined) p[1] = Math.max(s.minY, p[1]);
    const ul = age / life;
    let op = lv * ease(age, 0, 0.18) * (1 - ease(ul, 0.45, 1));
    if (s.reach !== undefined) {
      const d = Math.hypot(p[0] - s.origin[0], p[1] - s.origin[1], p[2] - s.origin[2]);
      op *= 1 - ease(d, s.reach * 0.55, s.reach);
    }
    if (s.stopX) {
      const soft = s.stopX.soft ?? 0.08;
      const past = (p[0] - s.stopX.x) * s.stopX.side;
      op *= 1 - ease(past, -soft, 0);
    }
    if (op < 0.01) continue;
    out.push({key: k, p, r: s0 + (s1 - s0) * Math.sqrt(ul), op});
  }
  return out;
};

/** Warm-air wisps (§ 5 System heat near the cast): halo only, `HEAT_COLOR` at ≤ `max` (default 0.25) opacity, bloomed. */
export const HeatWisps: React.FC<{wisps: WispState[]; max?: number; color?: string}> = ({wisps, max = 0.25, color = HEAT_COLOR}) => {
  const POOL = 24;
  const mats = useMemo(
    () => [...Array(POOL).keys()].map(() => new THREE.MeshBasicMaterial({color: raw(color), transparent: true, depthWrite: false})),
    [color],
  );
  useEffect(() => () => mats.forEach((m) => m.dispose()), [mats]);
  return (
    <>
      {wisps.map((w) => {
        const m = mats[((w.key % POOL) + POOL) % POOL];
        if (w.dir) {
          // drawn out along the flow: a long soft streak and a short tail behind it (they overlap little: each ≤ the cap)
          m.opacity = Math.min(0.25, max) * clamp01(w.op);
          const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(1, 0, 0), new THREE.Vector3(...w.dir).normalize());
          return (
            <group key={w.key} position={w.p} quaternion={q}>
              <mesh material={m} scale={[w.r * 2.6, w.r * 0.42, w.r * 0.42]} userData={{glow: true}} renderOrder={7}>
                <sphereGeometry args={[1, 16, 8]} />
              </mesh>
              <mesh material={m} position={[-w.r * 2.9, 0, 0]} scale={[w.r * 1.3, w.r * 0.22, w.r * 0.22]} userData={{glow: true}} renderOrder={7}>
                <sphereGeometry args={[1, 12, 6]} />
              </mesh>
            </group>
          );
        }
        // three lobes overlap: each at half, so a wisp's densest spot stays ≤ the cap
        m.opacity = 0.5 * Math.min(0.25, max) * clamp01(w.op);
        return (
          <group key={w.key} position={w.p}>
            {/* three soft lobes: a wisp, not a ball */}
            {[0, 1, 2].map((j) => (
              <mesh key={j} material={m} position={[(j - 1) * w.r * 0.7, (j === 1 ? 0.3 : -0.1) * w.r, 0]} scale={w.r * (j === 1 ? 1 : 0.75)} userData={{glow: true}} renderOrder={7}>
                <sphereGeometry args={[1, 12, 8]} />
              </mesh>
            ))}
          </group>
        );
      })}
    </>
  );
};

// ---------------------------------------------------------------------------------------------- shared materials

const usePartMats = () => {
  const env = useStudioEnv();
  const envScale = useEnvStrength();
  const mats = useMemo(
    () => ({
      cut: cutMaterial(),
      housing: new THREE.MeshPhysicalMaterial({color: raw(CHARGE.cabinetDark), roughness: 0.6, transparent: true}),
      inside: new THREE.MeshStandardMaterial({color: raw(REAL.labDark), roughness: 0.8, transparent: true}),
      alu: new THREE.MeshPhysicalMaterial({color: raw(HIGHWAY.galvanized), roughness: 0.42, metalness: 0.6, transparent: true}),
      fin: new THREE.MeshPhysicalMaterial({color: raw(REAL.frame), roughness: 0.5, metalness: 0.5, transparent: true}),
      rubber: new THREE.MeshPhysicalMaterial({color: raw(REAL.rubber), roughness: 0.75, side: THREE.DoubleSide, transparent: true}),
      coolant: new THREE.MeshStandardMaterial({color: raw(CHARGE.coolant), roughness: 0.3, transparent: true}),
      streak: new THREE.MeshBasicMaterial({color: raw(CHARGE.coolantFlow), transparent: true}),
      pipe: new THREE.MeshPhysicalMaterial({color: raw(REAL.rimPaint), roughness: 0.5, metalness: 0.7, transparent: true}),
      copper: new THREE.MeshPhysicalMaterial({color: raw(HIGHWAY.galvanized), roughness: 0.35, metalness: 0.75, transparent: true}),
      ink: new THREE.MeshBasicMaterial({color: raw(section.cutLine), transparent: true}),
      edge: new THREE.MeshBasicMaterial({color: raw(HEAT_COLOR), transparent: true}),
      edgeHalo: new THREE.MeshBasicMaterial({color: raw(HEAT_COLOR), transparent: true, depthWrite: false}),
    }),
    [],
  );
  applyEnv(
    env,
    [
      [mats.housing, 0.5],
      [mats.alu, 0.9],
      [mats.fin, 0.8],
      [mats.pipe, 0.6],
      [mats.copper, 0.9],
    ],
    envScale,
  );
  return mats;
};

/** The § 5 "made by" glow on a part: an orange edge (a thin frame) and a soft halo plane behind it, both bloomed. */
const MadeByEdge: React.FC<{c: [number, number]; w: number; h: number; z: number; k: number; mats: ReturnType<typeof usePartMats>}> = ({c, w, h, z, k, mats}) => {
  if (k < 0.01) return null;
  mats.edge.opacity = k;
  mats.edgeHalo.opacity = 0.3 * k;
  const e = 0.006;
  return (
    <group position={[c[0], c[1], z]}>
      {(
        [
          [0, h / 2, w + e, e],
          [0, -h / 2, w + e, e],
          [w / 2, 0, e, h],
          [-w / 2, 0, e, h],
        ] as [number, number, number, number][]
      ).map(([x, y, a, b], i) => (
        <mesh key={i} position={[x, y, 0.002]} material={mats.edge} userData={{glow: true}} renderOrder={5}>
          <planeGeometry args={[a, b]} />
        </mesh>
      ))}
      <mesh material={mats.edgeHalo} position={[0, 0, 0.001]} userData={{glow: true}} renderOrder={4}>
        <planeGeometry args={[w * 1.35, h * 1.2]} />
      </mesh>
    </group>
  );
};

// ---------------------------------------------------------------------------------------------- N1 · the HVAC box

/** The flow in a `{at, drawFor, fadeAt}` style: drawn 0 → 1 and its glow. */
export type FlowKeys = {at: number; drawFor?: number; fadeAt?: number | null; fadeFor?: number};
export const flowState = (k: FlowKeys | null | undefined, t: number) => {
  if (!k) return {p: 0, g: 0};
  const p = k.at <= -0.5 && t >= k.at ? 1 : ease(t, k.at, k.at + (k.drawFor ?? 1.3));
  const g = t < k.at ? 0 : k.fadeAt == null ? 1 : 1 - ease(t, k.fadeAt, k.fadeAt + (k.fadeFor ?? 0.6));
  return {p, g};
};

export type HvacWisps = {
  /** Strength 0 → 1 (constant or keys; default 1 while the box is on). */
  level?: Keyed;
  /** Defrost wisps up the windshield from the dash top (default true). */
  defrost?: boolean;
  /** Face-vent wisps toward the cabin: how far they may go (m, default 0: none; F5: stop ≥ 0.15 m short of the figure). */
  face?: number;
  /** Seconds between wisps (default 0.3); keep `every` dividing a loop's length. */
  every?: number;
};

export type HvacKeys = {
  /** 'core' (gas: a finned heater core on the coolant loop) or 'electric' (EV: a finned PTC element). Default by variant. */
  kind?: 'core' | 'electric';
  /** The box running, 0 (off: blower still, wisps stop, the box dims) → 1, constant or keys. Default 1. */
  on?: Keyed;
  /** The blower's speed 0 → 1 (constant or keys; default = `on`). */
  blower?: Keyed;
  /** The heater core / element running as the system ("made by" glow), 0 → 1 (constant or keys; default = `on`). */
  heat?: Keyed;
  /** Warm-air wisps from the vents (§ 5 System heat near the cast). False: none (the fallback: orange stops at the vents). */
  wisps?: HvacWisps | false;
  /** 'electric': the feed from the pack to the element (orange, the energy spent on heat), draw keys + `width` (m, keys). */
  feed?: (FlowKeys & {width?: Keyed; surge?: Keyed; period?: number; from?: 'pack' | 'port'}) | null;
};

export type HvacProps = HvacKeys & {
  t: number;
  /** The car's travelled distance (m) at a time (the wisps drift back with the air). */
  drift: (t: number) => number;
  mood: Mood;
  inkScale?: number;
  /** The blower's carried turn (rad) at t (the scene integrates the speed). */
  blowerAngle: number;
  /** Seconds offset for periodic phases (dots), e.g. the scene's start in the video. */
  clock?: number;
  /** × the feed's width (camera distance). Default 1. */
  lineScale?: number;
  /** The charge port (car frame), for a feed `from: 'port'` (N11: the wall's power, preheating). */
  port?: V3;
};

/**
 * N11: the feed from the charge port to the element while preheating on the wall: in from the port, down to the floor,
 * forward **over** the pack (never into it) at the floor's height, up the firewall into the box.
 */
export const portFeed = (port: V3): V3[] => [
  [port[0] + 0.04, port[1], Math.min(port[2], 0.74)],
  [port[0] + 0.25, port[1], 0.7],
  [port[0] + 0.25, 0.4, 0.7],
  [0.93, 0.4, 0.7],
  [0.93, 1.0, 0.7],
  [0.93, 1.0, 0.79],
  [0.905, 1.0, 0.79],
];

/** N1: the HVAC box in the dash (see the file comment). */
export const HvacBox: React.FC<HvacProps> = (p) => {
  const mats = usePartMats();
  const {t} = p;
  const B = HEAT.box;
  const W = HEAT.wall;
  const kind = p.kind ?? 'electric';
  const on = clamp01(keyedValue(p.on, t, 1));
  // the element glows only while its feed runs (EV, unless keyed); the gas core while the box is on
  const feedNow = kind === 'electric' && p.feed ? flowState(p.feed, t) : null;
  const heatK = clamp01(keyedValue(p.heat, t, feedNow ? on * feedNow.p * feedNow.g : kind === 'electric' && p.heat === undefined ? 0 : on));
  const ink = INK * (p.inkScale ?? 1);
  const zc = B.z1 + 0.002;
  // the box dims when off (its inside a step darker)
  mats.inside.color.copy(raw(REAL.labDark)).multiplyScalar(0.75 + 0.25 * on);
  const cx = (B.x0 + B.x1) / 2;
  const cy = (B.y0 + B.y1) / 2;
  const [bx, by] = HEAT.blower;
  const C = HEAT.core;
  const wispsOn = p.wisps !== false;
  const wo: HvacWisps = p.wisps === false || p.wisps === undefined ? {} : p.wisps;
  const lvl = (tt: number) => clamp01(keyedValue(p.on, tt, 1)) * clamp01(keyedValue(wo.level, tt, 1));
  const wisps = wispsOn
    ? [
        ...(wo.defrost !== false
          ? wispStates(
              // up the glass: the windshield rakes back ≈ 30°, so up and toward the cabin
              {origin: HEAT.defrost, velocity: [-0.13, 0.2, 0], every: wo.every ?? 0.3, life: 1.3, size: [0.025, 0.07], reach: 0.3, seed: 'hvac-defrost'},
              t,
              lvl,
              () => 0,
              p.clock ?? 0,
            )
          : []),
        ...((wo.face ?? 0) > 0
          ? wispStates(
              {origin: HEAT.face, velocity: [-0.18, 0.02, 0], every: wo.every ?? 0.3, life: 1.0, size: [0.02, 0.05], reach: wo.face, seed: 'hvac-face'},
              t,
              lvl,
              () => 0,
              p.clock ?? 0,
            )
          : []),
      ]
    : [];
  const fs = kind === 'electric' && p.feed ? flowState(p.feed, t) : {p: 0, g: 0};
  const feedW = p.feed ? keyedValue(p.feed.width, t, 0.011) : 0.011;
  const blades = 14;
  return (
    <group>
      {/* the housing: a cut ring (hatched, inked) round the box's open inside, the dark inside behind */}
      {(
        [
          [B.x0, B.x1, B.y1 - W, B.y1],
          [B.x0, B.x1, B.y0, B.y0 + W],
          [B.x0, B.x0 + W, B.y0, B.y1],
          [B.x1 - W, B.x1, B.y0, B.y1],
        ] as [number, number, number, number][]
      ).map(([a, b, c, d], i) => (
        <mesh key={i} position={[(a + b) / 2, (c + d) / 2, (B.z0 + B.z1) / 2 + 0.002]} material={[mats.housing, mats.housing, mats.housing, mats.housing, mats.cut, mats.housing]}>
          <boxGeometry args={[b - a, d - c, B.z1 - B.z0]} />
        </mesh>
      ))}
      <mesh position={[cx, cy, B.z0 + 0.01]} material={mats.inside}>
        <planeGeometry args={[B.x1 - B.x0 - 2 * W, B.y1 - B.y0 - 2 * W]} />
      </mesh>
      <InkLine points={[[B.x0, B.y0, zc], [B.x1, B.y0, zc], [B.x1, B.y1, zc], [B.x0, B.y1, zc]]} thickness={ink} />
      <InkLine points={[[B.x0 + W, B.y0 + W, zc], [B.x1 - W, B.y0 + W, zc], [B.x1 - W, B.y1 - W, zc], [B.x0 + W, B.y1 - W, zc]]} thickness={ink} />
      {/* the blower: a squirrel-cage wheel (housing scroll, blades) turning */}
      <group position={[bx, by, B.z0 + 0.12]}>
        <mesh material={mats.housing} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[HEAT.blowerR + 0.012, HEAT.blowerR + 0.012, 0.16, 28, 1, true]} />
        </mesh>
        <group rotation={[0, 0, p.blowerAngle]}>
          {[...Array(blades).keys()].map((i) => {
            const a = (i / blades) * Math.PI * 2;
            return (
              <mesh key={i} position={[Math.cos(a) * HEAT.blowerR * 0.82, Math.sin(a) * HEAT.blowerR * 0.82, 0.04]} rotation={[0, 0, a + 0.5]} material={mats.alu}>
                <boxGeometry args={[0.004, HEAT.blowerR * 0.36, 0.14]} />
              </mesh>
            );
          })}
          <mesh material={mats.housing} position={[0, 0, 0.04]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[HEAT.blowerR * 0.42, HEAT.blowerR * 0.42, 0.15, 20]} />
          </mesh>
          {/* the hub's mark, so the turn reads */}
          <mesh material={mats.alu} position={[HEAT.blowerR * 0.2, 0, 0.118]}>
            <boxGeometry args={[HEAT.blowerR * 0.42, 0.008, 0.004]} />
          </mesh>
        </group>
      </group>
      {/* the heater core (gas: tanks and fins, two hose stubs) or the electric element (EV: a finned block, its lead) */}
      <group>
        <mesh position={[C.x, (C.y0 + C.y1) / 2, B.z0 + 0.12]} material={mats.fin}>
          <boxGeometry args={[C.w, C.y1 - C.y0, 0.2]} />
        </mesh>
        {[...Array(9).keys()].map((i) => (
          <mesh key={i} position={[C.x, C.y0 + ((i + 0.5) / 9) * (C.y1 - C.y0), B.z0 + 0.222]} material={mats.ink}>
            <boxGeometry args={[C.w * 0.92, 0.0025, 0.002]} />
          </mesh>
        ))}
        {kind === 'core'
          ? [C.y0, C.y1].map((y, i) => (
              <mesh key={i} position={[C.x, y + (i ? 0.008 : -0.008), B.z0 + 0.12]} material={mats.alu}>
                <boxGeometry args={[C.w + 0.016, 0.018, 0.21]} />
              </mesh>
            ))
          : [C.y0 + 0.04, C.y1 - 0.04].map((y, i) => (
              // the element's two terminal blocks (dark), no glowing coil
              <mesh key={i} position={[C.x + C.w / 2 + 0.008, y, B.z0 + 0.2]} material={mats.housing}>
                <boxGeometry args={[0.014, 0.022, 0.03]} />
              </mesh>
            ))}
        <MadeByEdge c={[C.x, (C.y0 + C.y1) / 2]} w={C.w} h={C.y1 - C.y0} z={B.z0 + 0.224} k={heatK} mats={mats} />
      </group>
      {/* the outlet duct up to the defrost slot and back to the face vent (dark, inside the box) */}
      <mesh position={[(B.x0 + C.x) / 2 - 0.01, B.y1 - 0.045, B.z0 + 0.08]} material={mats.housing}>
        <boxGeometry args={[C.x - B.x0 - 0.02, 0.012, 0.16]} />
      </mesh>
      {/* the vents: a slot on the dash top under the glass, a louvred face vent on the dash's rear face */}
      <mesh position={[HEAT.defrost[0], B.y1 + 0.016, HEAT.defrost[2]]} material={mats.housing}>
        <boxGeometry args={[0.1, 0.006, 0.24]} />
      </mesh>
      <group position={[B.x0 - 0.024, HEAT.face[1], HEAT.face[2]]}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[0, (i - 1) * 0.016, 0]} material={mats.housing}>
            <boxGeometry args={[0.006, 0.006, 0.14]} />
          </mesh>
        ))}
      </group>
      {/* the EV's feed: pack → element (orange: the energy spent on heat) */}
      {fs.p > 0 && fs.g > 0.01 ? (
        <HeatFlow
          legs={runs(p.feed?.from === 'port' && p.port ? portFeed(p.port) : EV_HEATER_FEED)}
          progress={fs.p}
          glow={fs.g}
          radius={feedW * (p.lineScale ?? 1)}
          surge={p.feed ? keyedValue(p.feed.surge, t, 0) : 0}
          flow={(t + (p.clock ?? 0)) / (p.feed?.period ?? 1.2)}
          dots={4}
        />
      ) : null}
      {wisps.length ? <HeatWisps wisps={wisps} /> : null}
    </group>
  );
};

// ---------------------------------------------------------------------------------------------- N2 · gas engine heat

/** The gas car's heat parts (car frame; the four-cylinder of `GasDrive`, its head at ≈ x 1.62, y 0.8). */
export const GAS_HEAT = {
  /** The radiator: core x span, y span, the plane it's cut on and its back (z). */
  rad: {x0: 2.035, x1: 2.085, y0: 0.32, y1: 0.86, z0: -0.55, z1: 0.38},
  /** The fan behind it (engine side): centre, radius. */
  fan: [1.975, 0.6] as [number, number],
  fanR: 0.2,
  hoseR: 0.022,
  /** Coolant hoses: upper (head → radiator top tank), lower (radiator bottom → pump), heater pair (head → box core). */
  upper: [
    [1.74, 0.79, 0.3],
    [1.86, 0.84, 0.33],
    [1.99, 0.82, 0.35],
    [2.04, 0.8, 0.35],
  ] as V3[],
  lower: [
    [2.04, 0.38, 0.34],
    [1.95, 0.4, 0.33],
    [1.85, 0.46, 0.31],
    [1.79, 0.5, 0.3],
  ] as V3[],
  heater: [
    [1.53, 0.8, 0.3],
    [1.3, 0.97, 0.36],
    [1.06, 0.99, 0.48],
    [0.99, 1.0, 0.62],
    [0.91, 1.03, 0.72],
  ] as V3[],
  /** The exhaust: the engine's own pipe ends at (1.9, 0.26, 0.18); from there under the floor to the tailpipe. */
  exhaust: [
    [1.9, 0.26, 0.2],
    [1.6, 0.17, 0.42],
    [0.6, 0.15, 0.45],
    [-1.25, 0.15, 0.45],
    [-1.75, 0.18, 0.46],
    [-2.3, 0.25, 0.48],
  ] as V3[],
  /** The muffler box under the rear (x0, x1). */
  muffler: [-2.05, -1.55] as [number, number],
};

/** The heat flows' routes (car frame, riding just proud of the parts so they show). */
export const GAS_HEAT_ROUTES = {
  /**
   * Fat, one out-and-back loop in the upper bay (brand review): the head → forward along the upper hose → down the
   * radiator's cut face → back along the lower hose to the pump. Straight runs, right-angle turns.
   */
  radiator: runs([
    [1.7, 0.8, 0.41],
    [2.06, 0.8, 0.41],
    [2.06, 0.42, 0.41],
    [1.8, 0.42, 0.41],
    [1.8, 0.56, 0.41],
  ]),
  /** Fat (half the radiator's width by default): low along the underside, the front pipe's foot → the tailpipe. */
  exhaust: runs([
    [1.9, 0.2, 0.52],
    [1.9, 0.14, 0.52],
    [-2.3, 0.14, 0.52],
    [-2.3, 0.25, 0.52],
  ]),
  /** Thin: the head's back → up → back over the bay to the firewall → into the box's core. */
  cabin: runs([
    [1.53, 0.8, 0.36],
    [1.53, 0.99, 0.36],
    [1.0, 0.99, 0.5],
    [0.905, 0.99, 0.76],
  ]),
};

/** A cut hose: the coolant inside (a slow streak riding it) and the rubber's far half (the near half is cut away). */
const CutHose: React.FC<{points: V3[]; r: number; mats: ReturnType<typeof usePartMats>; flow: number}> = ({points, r, mats, flow}) => {
  const gl = useThree((st) => st.gl);
  gl.localClippingEnabled = true;
  const key = JSON.stringify(points);
  const geo = useMemo(() => {
    const pts = (JSON.parse(key) as V3[]).map((q) => new THREE.Vector3(...q));
    const curve = new THREE.CatmullRomCurve3(pts);
    return {
      curve,
      outer: new THREE.TubeGeometry(curve, 32, r, 12, false),
      liquid: new THREE.TubeGeometry(curve, 32, r * 0.72, 10, false),
    };
  }, [key, r]);
  useEffect(() => () => [geo.outer, geo.liquid].forEach((g) => g.dispose()), [geo]);
  // the near half cut away (a plane through each point's z, facing the camera): clip in world z at the hose's mean depth
  const zMid = (JSON.parse(key) as V3[]).reduce((a, q) => a + q[2], 0) / points.length;
  const clip = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, -1), zMid), [zMid]);
  const rubber = useMemo(() => {
    const m = mats.rubber.clone();
    m.clippingPlanes = [clip];
    return m;
  }, [mats.rubber, clip]);
  const u = ((flow % 1) + 1) % 1;
  return (
    <group>
      <mesh geometry={geo.outer} material={rubber} castShadow />
      <mesh geometry={geo.liquid} material={mats.coolant} />
      {[0, 0.5].map((o, i) => (
        <mesh key={i} position={geo.curve.getPointAt((u + o) % 1)} material={mats.streak}>
          <sphereGeometry args={[r * 0.45, 8, 6]} />
        </mesh>
      ))}
    </group>
  );
};

export type GasHeatKeys = {
  /** When the flows draw on (s); default −1: already running (frame 0, the loop). */
  at?: number;
  drawFor?: number;
  /** The waste flows' strength (radiator, exhaust), 0 → 1, constant or keys. Default 1. */
  waste?: Keyed;
  /** The thin cabin branch's strength, 0 → 1, constant or keys. Default 1. */
  cabin?: Keyed;
  /** Surge times (s): the radiator and exhaust flows pulse (§ 5 surge, ≈ 0.8 s). */
  pulse?: number[];
  /**
   * The radiator flow's core radius (m, default 0.0112: ≈ 7.8 px wide on screen with the scene's × camD/12 scaling, the
   * § 5 car-scale maximum of 8 px; ≈ 2.4× the cabin branch, F13 within the 3–8 px rule).
   */
  wasteWidth?: number;
  /** The exhaust flow's core radius (m, default half of `wasteWidth`). */
  exhaustWidth?: number;
  /** The cabin branch's core radius (m, default 0.0046: ≈ 3.2 px). */
  cabinWidth?: number;
  /** Seconds a dot takes along a route (default 1.5); keep a loop's length a multiple of it. */
  period?: number;
  /**
   * Wisps of thrown-away heat from the radiator: the fan pushes the warm air back out under the bay (not out of the
   * grille: the air goes through the radiator front to back), low by the nose's cut, and it goes back under the car with
   * the air (streaming toward the tail when the car moves). Strength (0 → 1, keys) or false. Default 1.
   */
  radiatorWisps?: Keyed | false;
  /** Wisps of hot air at the tailpipe, trailing behind (the vapour puffs stay grey). Strength or false. Default 1. */
  exhaustWisps?: Keyed | false;
  /** The radiator fan's speed 0 → 1 (keys). Default 1. */
  fan?: Keyed;
};

export type GasHeatProps = GasHeatKeys & {
  t: number;
  drift: (t: number) => number;
  mood: Mood;
  inkScale?: number;
  /** The fan's turn (rad) at t. */
  fanAngle: number;
  clock?: number;
  /** × every flow's width (the scene scales it with the camera distance so lines hold at far framings). Default 1. */
  lineScale?: number;
};

/** N2: the gas engine's heat parts and flows (see the file comment). */
export const GasHeat: React.FC<GasHeatProps> = (p) => {
  const mats = usePartMats();
  const {t} = p;
  const G = GAS_HEAT;
  const ink = INK * (p.inkScale ?? 1);
  const at = p.at ?? -1;
  const drawn = at <= -0.5 ? 1 : ease(t, at, at + (p.drawFor ?? 1.2));
  const waste = clamp01(keyedValue(p.waste, t, 1));
  const cabin = clamp01(keyedValue(p.cabin, t, 1));
  const surge = (p.pulse ?? []).reduce((a, s) => Math.max(a, t < s ? 0 : t > s + 0.8 ? 0 : Math.sin(((t - s) / 0.8) * Math.PI)), 0);
  const clock = t + (p.clock ?? 0);
  const period = p.period ?? 1.5;
  const ls = p.lineScale ?? 1;
  const R = G.rad;
  const zc = R.z1 + 0.002;
  const fins = 22;
  const wLevel = (k: Keyed | false | undefined) => (tt: number) => (k === false ? 0 : clamp01(keyedValue(k, tt, 1))) * clamp01(keyedValue(p.waste, tt, 1));
  const radW =
    p.radiatorWisps === false
      ? []
      : wispStates(
          {origin: [1.98, 0.3, 0.62], velocity: [-0.08, 0.08, 0.08], every: 0.35, life: 1.4, size: [0.04, 0.1], spread: 0.08, minY: 0.1, seed: 'gas-rad'},
          t,
          wLevel(p.radiatorWisps),
          p.drift,
          p.clock ?? 0,
        );
  const exW =
    p.exhaustWisps === false
      ? []
      : wispStates(
          {origin: [-2.42, 0.27, 0.48], velocity: [-0.25, 0.05, 0.02], every: 0.3, life: 1.3, size: [0.03, 0.1], spread: 0.04, seed: 'gas-ex'},
          t,
          wLevel(p.exhaustWisps),
          p.drift,
          p.clock ?? 0,
        );
  return (
    <group>
      {/* the radiator: tanks top and bottom, the finned core cut on its plane (coolant channels in the section) */}
      <mesh position={[(R.x0 + R.x1) / 2, (R.y0 + R.y1) / 2, (R.z0 + R.z1) / 2]} material={[mats.fin, mats.fin, mats.fin, mats.fin, mats.cut, mats.fin]} castShadow>
        <boxGeometry args={[R.x1 - R.x0, R.y1 - R.y0, R.z1 - R.z0]} />
      </mesh>
      {[...Array(fins).keys()].map((i) => (
        // the tubes in section: coolant between the fins
        <mesh key={i} position={[(R.x0 + R.x1) / 2, R.y0 + 0.04 + ((i + 0.5) / fins) * (R.y1 - R.y0 - 0.08), zc]} material={mats.coolant}>
          <planeGeometry args={[(R.x1 - R.x0) * 0.6, 0.007]} />
        </mesh>
      ))}
      {[R.y0, R.y1].map((y, i) => (
        <mesh key={i} position={[(R.x0 + R.x1) / 2 + 0.005, y + (i ? -0.02 : 0.02), (R.z0 + R.z1) / 2]} material={[mats.alu, mats.alu, mats.alu, mats.alu, mats.cut, mats.alu]}>
          <boxGeometry args={[R.x1 - R.x0 + 0.03, 0.045, R.z1 - R.z0 + 0.004]} />
        </mesh>
      ))}
      <InkLine points={[[R.x0 - 0.01, R.y0, zc + 0.002], [R.x1 + 0.02, R.y0, zc + 0.002], [R.x1 + 0.02, R.y1, zc + 0.002], [R.x0 - 0.01, R.y1, zc + 0.002]]} thickness={ink} />
      {/* the fan in its shroud, behind the radiator (engine side) */}
      <group position={[G.fan[0], G.fan[1], 0.0]} rotation={[0, Math.PI / 2, 0]}>
        <mesh material={mats.housing}>
          <torusGeometry args={[G.fanR + 0.015, 0.012, 8, 32]} />
        </mesh>
        <group rotation={[0, 0, p.fanAngle]}>
          {[...Array(7).keys()].map((i) => {
            const a = (i / 7) * Math.PI * 2;
            return (
              <mesh key={i} position={[Math.cos(a) * G.fanR * 0.55, Math.sin(a) * G.fanR * 0.55, 0]} rotation={[0.35, 0, a]} material={mats.housing}>
                <boxGeometry args={[G.fanR * 0.8, 0.05, 0.006]} />
              </mesh>
            );
          })}
          <mesh material={mats.housing} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.05, 16]} />
          </mesh>
        </group>
      </group>
      {/* the coolant hoses, cut (coolant inside, streaks riding at the loop's pace) */}
      <CutHose points={G.upper} r={G.hoseR} mats={mats} flow={clock / 2.4} />
      <CutHose points={G.lower} r={G.hoseR} mats={mats} flow={clock / 2.4} />
      <CutHose points={G.heater} r={G.hoseR * 0.7} mats={mats} flow={clock / 3} />
      {/* the exhaust pipe under the floor and its muffler */}
      <ExhaustPipe mats={mats} />
      {/* the heat flows: fat to the radiator and the tailpipe, thin to the heater core */}
      {waste > 0.01 ? (
        <>
          <HeatFlow legs={GAS_HEAT_ROUTES.radiator} progress={drawn} glow={waste} radius={(p.wasteWidth ?? 0.0112) * ls} surge={surge} flow={clock / period} dots={3} />
          <HeatFlow legs={GAS_HEAT_ROUTES.exhaust} progress={drawn} glow={waste} radius={(p.exhaustWidth ?? (p.wasteWidth ?? 0.0112) / 2) * ls} surge={surge} flow={clock / (period * 2.5)} dots={6} />
        </>
      ) : null}
      {cabin > 0.01 ? (
        <HeatFlow legs={GAS_HEAT_ROUTES.cabin} progress={drawn} glow={cabin} radius={(p.cabinWidth ?? 0.0046) * ls} flow={clock / period} dots={3} />
      ) : null}
      <MadeByEdge c={[(R.x0 + R.x1) / 2, (R.y0 + R.y1) / 2]} w={R.x1 - R.x0 + 0.03} h={R.y1 - R.y0} z={zc + 0.004} k={drawn * waste * 0.8} mats={mats} />
      {radW.length || exW.length ? <HeatWisps wisps={[...radW, ...exW.map((w) => ({...w, key: w.key + 100000}))]} /> : null}
    </group>
  );
};

const ExhaustPipe: React.FC<{mats: ReturnType<typeof usePartMats>}> = ({mats}) => {
  const geo = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(GAS_HEAT.exhaust.map((q) => new THREE.Vector3(...q)));
    return new THREE.TubeGeometry(curve, 60, 0.026, 10, false);
  }, []);
  useEffect(() => () => geo.dispose(), [geo]);
  const [m0, m1] = GAS_HEAT.muffler;
  return (
    <group>
      <mesh geometry={geo} material={mats.pipe} castShadow />
      <mesh geometry={roundedBox(m1 - m0, 0.1, 0.26, 0.04)} position={[(m0 + m1) / 2, 0.18, 0.36]} material={mats.pipe} castShadow />
    </group>
  );
};

// ---------------------------------------------------------------------------------------------- N9 · the heat pump

export const HEAT_PUMP = {
  /** The outside heat exchanger behind the grille (EV nose): x span, y span, cut plane z and back. */
  hx: {x0: 2.07, x1: 2.12, y0: 0.36, y1: 0.8, z0: -0.5, z1: 0.38},
  /** The compressor (a can on its side), centre and radius, length along z. */
  comp: [1.74, 0.68, 0.26] as V3,
  compR: 0.075,
  /** The refrigerant lines' plane. */
  lineZ: 0.395,
};

/** The heat pump's routes (car frame). */
export const HEAT_PUMP_ROUTES = {
  /** Heat in: the exchanger → the compressor (front) → up from its top → back under the hood → the box's core. */
  toCabin: [
    ...runs([
      [2.07, 0.68, 0.42],
      [1.815, 0.68, 0.42],
    ]),
    ...runs([
      [1.74, 0.755, 0.42],
      [1.74, 0.985, 0.42],
      [1.0, 0.985, 0.5],
      [0.905, 0.985, 0.76],
    ]),
  ] as V3[][],
  /** The compressor's power from the pack (thin): along the pack top, up the firewall, forward over the drive unit, down into it. */
  feed: runs([
    [0.62, 0.345, 0.66],
    [0.95, 0.345, 0.66],
    [0.95, 0.88, 0.5],
    [1.74, 0.88, 0.42],
    [1.74, 0.77, 0.42],
  ]),
};

export type HeatPumpKeys = {
  /** Its parts draw in from `at` (ink outlines, then the materials; `drawFor`, default 0.6 s). */
  at: number;
  drawFor?: number;
  /** They draw out from `outAt` (materials, then the outlines). Default: never. */
  outAt?: number | null;
  /** The heat it pulls in from outside, 1 (mild) → 0 (deep cold: the wisps thin to a trickle), constant or keys. Default 1. */
  level?: Keyed;
  /** The orange flows (wisps in, the line to the box) start at `flowAt` (default at + drawFor) over `drawFor` 1.0 s. */
  flowAt?: number;
  /** The pack → compressor line's core radius (m, keys; default 0.006). */
  feedWidth?: Keyed;
  /** Seconds a dot takes along a route (default 1.5). */
  period?: number;
};

export type HeatPumpProps = HeatPumpKeys & {t: number; drift: (t: number) => number; mood: Mood; inkScale?: number; clock?: number; lineScale?: number};

/**
 * N9: the intake wisps (car frame): every 0.25 s one is born in the open air 0.6–1.0 m ahead of the nose, in front of
 * the body's section (z 0.55, so the bumper's cut face never hides it), and drifts in, converging on a point of the
 * exchanger's cut face over its 1.4 s life (eased in: slow in the open air, quicker as it's drawn in), fading in and,
 * at the face, out. `level` (deep cold) drops a seeded share of them. Periodic in `every`, phase by `clock`.
 */
export const intakeWisps = (t: number, clock: number, strength: (t: number) => number, level: number): WispState[] => {
  const every = 0.25;
  const life = 1.4;
  const H = HEAT_PUMP.hx;
  const out: WispState[] = [];
  const u0 = t + clock;
  for (let k = Math.floor((u0 - life) / every); k <= Math.floor(u0 / every); k++) {
    const t0 = k * every - clock;
    const age = t - t0;
    if (age < 0 || age > life) continue;
    const s = strength(t0);
    if (s < 0.01 || random(`hp-keep-${k}`) > 0.25 + 0.75 * level) continue;
    const r = (n: string) => random(`hp-in-${k}-${n}`);
    const from: V3 = [2.42 + 0.6 + 0.4 * r('x'), 0.3 + 0.6 * r('y'), 0.5 + 0.12 * r('z')];
    const to: V3 = [H.x1 + 0.01, H.y0 + 0.06 + (H.y1 - H.y0 - 0.12) * r('ty'), H.z1 + 0.04];
    const u = age / life;
    const e = u * u * (3 - 2 * u) * 0.6 + u * u * 0.4;
    const p: V3 = [from[0] + (to[0] - from[0]) * e, from[1] + (to[1] - from[1]) * e, from[2] + (to[2] - from[2]) * e];
    const op = s * ease(age, 0, 0.25) * (1 - ease(u, 0.82, 1));
    if (op < 0.01) continue;
    const d: V3 = [to[0] - from[0], to[1] - from[1], to[2] - from[2]];
    const dl = Math.hypot(...d) || 1;
    out.push({key: k, p, r: 0.075 - 0.025 * u, op, dir: [d[0] / dl, d[1] / dl, d[2] / dl]});
  }
  return out;
};

/** N9: the heat pump (see the file comment). */
export const HeatPump: React.FC<HeatPumpProps> = (p) => {
  const mats = usePartMats();
  const {t} = p;
  const d = p.drawFor ?? 0.6;
  const inK = ease(t, p.at, p.at + d);
  const outK = p.outAt == null ? 0 : ease(t, p.outAt, p.outAt + d);
  // outlines first (first half), materials second; out in reverse
  const lineK = Math.min(clamp01(inK * 2), 1 - clamp01((outK - 0.5) * 2));
  const matK = Math.min(clamp01(inK * 2 - 1), 1 - clamp01(outK * 2));
  const flowAt = p.flowAt ?? p.at + d;
  const flowP = ease(t, flowAt, flowAt + 1.0);
  const flowG = 1 - clamp01(outK * 2);
  const level = clamp01(keyedValue(p.level, t, 1));
  if (lineK < 0.01 && matK < 0.01) return null;
  for (const m of [mats.fin, mats.alu, mats.housing, mats.copper, mats.cut]) {
    m.transparent = true;
    m.opacity = matK;
    m.depthWrite = matK > 0.98;
  }
  mats.ink.opacity = lineK;
  const H = HEAT_PUMP.hx;
  const zc = H.z1 + 0.003;
  const ink = INK * (p.inkScale ?? 1);
  const [cx, cy, cz] = HEAT_PUMP.comp;
  const cr = HEAT_PUMP.compR;
  const clock = t + (p.clock ?? 0);
  const period = p.period ?? 1.5;
  // the wisps pulled in from the cold air ahead of the grille (brand review: 4–6 at a time, born in open air 0.6–1 m
  // ahead, converging on the exchanger's face); their count thins with `level` (deep cold)
  const wisps = flowP > 0.05 && flowG > 0.01 ? intakeWisps(t, p.clock ?? 0, (tt) => clamp01(keyedValue(p.level, tt, 1)) * ease(tt, flowAt, flowAt + 1.0), level) : [];
  // the wisps live in the air: their drift is the air's (with the car rolling, they stream toward the car)
  return (
    <group>
      {/* the outside exchanger: finned, cut on its plane (refrigerant tubes in section, aluminium) */}
      <mesh position={[(H.x0 + H.x1) / 2, (H.y0 + H.y1) / 2, (H.z0 + H.z1) / 2]} material={[mats.fin, mats.fin, mats.fin, mats.fin, mats.cut, mats.fin]} visible={matK > 0.01}>
        <boxGeometry args={[H.x1 - H.x0, H.y1 - H.y0, H.z1 - H.z0]} />
      </mesh>
      {matK > 0.01
        ? [...Array(16).keys()].map((i) => (
            <mesh key={i} position={[(H.x0 + H.x1) / 2, H.y0 + 0.03 + ((i + 0.5) / 16) * (H.y1 - H.y0 - 0.06), zc]} material={mats.copper}>
              <circleGeometry args={[0.008, 10]} />
            </mesh>
          ))
        : null}
      {/* the compressor: a can on its side, its motor end and a mounting foot */}
      <group position={[cx, cy, cz]} visible={matK > 0.01}>
        <mesh material={mats.alu} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[cr, cr, 0.26, 24]} />
        </mesh>
        <mesh material={mats.housing} position={[0, 0, 0.14]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[cr * 0.8, cr * 0.8, 0.03, 20]} />
        </mesh>
        <mesh material={mats.housing} position={[0, -cr - 0.015, 0]}>
          <boxGeometry args={[0.12, 0.03, 0.16]} />
        </mesh>
      </group>
      {/* the refrigerant lines (metal), exchanger → compressor → the box */}
      {matK > 0.01 ? (
        <RefrigerantLines mats={mats} />
      ) : null}
      {/* ink outlines first (the parts drawing in as a diagram) */}
      {lineK > 0.01 ? (
        <>
          <InkLine points={[[H.x0, H.y0, zc + 0.002], [H.x1, H.y0, zc + 0.002], [H.x1, H.y1, zc + 0.002], [H.x0, H.y1, zc + 0.002]]} thickness={ink} color={section.cutLine} />
          <InkLine
            points={[...Array(24).keys()].map((i) => {
              const a = (i / 24) * Math.PI * 2;
              return [cx + cr * Math.cos(a), cy + cr * Math.sin(a), cz + 0.135] as V3;
            })}
            thickness={ink}
          />
          <InkLine points={HEAT_PUMP_ROUTES.toCabin.flat().map((q) => [q[0], q[1], q[2] - 0.004] as V3)} closed={false} thickness={ink * 0.6} />
        </>
      ) : null}
      {flowP > 0 && flowG > 0.01 ? (
        <>
          <HeatFlow legs={HEAT_PUMP_ROUTES.toCabin} progress={flowP} glow={flowG * (0.35 + 0.65 * level)} radius={0.01 * (p.lineScale ?? 1)} flow={clock / period} dots={3} />
          <HeatFlow legs={HEAT_PUMP_ROUTES.feed} progress={flowP} glow={flowG} radius={keyedValue(p.feedWidth, t, 0.006) * (p.lineScale ?? 1)} flow={clock / period} dots={3} />
        </>
      ) : null}
      {wisps.length ? <HeatWisps wisps={wisps.map((w) => ({...w, op: w.op * flowG}))} /> : null}
    </group>
  );
};

const RefrigerantLines: React.FC<{mats: ReturnType<typeof usePartMats>}> = ({mats}) => {
  const geos = useMemo(
    () =>
      HEAT_PUMP_ROUTES.toCabin.map((leg) => {
        const c = new THREE.CatmullRomCurve3(leg.map((q) => new THREE.Vector3(q[0], q[1], q[2] - 0.02)), false, 'catmullrom', 0.2);
        return new THREE.TubeGeometry(c, 40, 0.009, 8, false);
      }),
    [],
  );
  useEffect(() => () => geos.forEach((g) => g.dispose()), [geos]);
  return (
    <>
      {geos.map((g, i) => (
        <mesh key={i} geometry={g} material={mats.copper} />
      ))}
    </>
  );
};

// ---------------------------------------------------------------------------------------------- N3 / N4 · ink gauges

/** A gauge's level from steps: `start` minus `step` per tick time passed (each step eased over 0.25 s), plus keys. */
export const steppedLevel = (o: {start?: number; step?: number; ticks?: number[]; level?: Keyed}, t: number) => {
  if (o.level !== undefined) return clamp01(keyedValue(o.level, t, 1));
  const start = o.start ?? 1;
  const step = o.step ?? 0.08;
  const n = (o.ticks ?? []).reduce((a, k) => a + ease(t, k, k + 0.25), 0);
  return clamp01(start - step * n);
};

export type InkGaugeProps = {
  kind: 'thermo' | 'range';
  /** Fill 0 → 1. */
  level: number;
  /** The gauge's foot (car frame or world), its height (m). */
  at: V3;
  height?: number;
  mood: Mood;
  /** × the line weight (scale with the camera distance). Default 1. */
  k?: number;
  opacity?: number;
  /** 'range': tick count on the scale (default 5). */
  ticks?: number;
};

/**
 * N3 / N4 (§ 3 In-set ink gauge): `cutLine` ink on a thin `cut` halo, no digits, no units, never red or orange.
 * 'thermo': a tube (two walls, a rounded foot) with an ink fill line; 'range': a short scale (a stem, ticks) with a
 * heavier ink fill line beside it, stepping down. 🎭, disclosed.
 */
export const InkGauge: React.FC<InkGaugeProps> = ({kind, level, at, height = 0.32, mood, k = 1, opacity = 1, ticks = 5}) => {
  const mats = useMemo(
    () => ({
      core: new THREE.MeshBasicMaterial({color: raw(section.cutLine), transparent: true}),
      halo: new THREE.MeshBasicMaterial({color: raw(section.cut), transparent: true, depthWrite: false}),
    }),
    [],
  );
  mats.halo.color.copy(raw(section.cut)).multiplyScalar(0.95 / MOODS[mood].exposure);
  const o = clamp01(opacity);
  mats.core.opacity = o;
  mats.halo.opacity = 0.9 * o;
  if (o < 0.02) return null;
  const w = 0.012 * k;
  const lv = clamp01(level);
  const bar = (key: string, c: V3, size: [number, number]) => (
    <group key={key} position={c}>
      <mesh material={mats.core} renderOrder={9}>
        <planeGeometry args={size} />
      </mesh>
      <mesh material={mats.halo} position={[0, 0, -0.001]} renderOrder={8}>
        <planeGeometry args={[size[0] + w * 1.6, size[1] + w * 1.6]} />
      </mesh>
    </group>
  );
  const [x, y, z] = at;
  const H = height;
  if (kind === 'thermo') {
    const tw = 0.05 * Math.max(0.6, k);
    const foot = 0.035 * Math.max(0.6, k);
    const fill = foot + (H - foot) * lv;
    return (
      <group position={[x, y, z]}>
        {/* the paper behind the tube, so it reads on any ground */}
        <mesh material={mats.halo} position={[0, H / 2, -0.002]} renderOrder={7}>
          <planeGeometry args={[tw + w * 2, H + w * 2]} />
        </mesh>
        {bar('l', [-tw / 2, H / 2, 0], [w * 0.6, H])}
        {bar('r', [tw / 2, H / 2, 0], [w * 0.6, H])}
        {bar('top', [0, H, 0], [tw, w * 0.6])}
        {bar('foot', [0, 0, 0], [tw, w * 0.6])}
        {/* the fill line: a heavy ink stroke up the tube's middle */}
        {bar('fill', [0, fill / 2, 0.001], [w * 1.4, Math.max(0.002, fill)])}
        {/* scale ticks (no digits) */}
        {[0.25, 0.5, 0.75].map((f) => bar(`t${f}`, [tw / 2 + w * 1.4, foot + (H - foot) * f, 0], [w * 1.6, w * 0.5]))}
      </group>
    );
  }
  const n = Math.max(2, ticks);
  return (
    <group position={[x, y, z]}>
      <mesh material={mats.halo} position={[0.012 * k, H / 2, -0.002]} renderOrder={7}>
        <planeGeometry args={[0.06 * Math.max(0.6, k) + w * 2, H + w * 2]} />
      </mesh>
      {bar('stem', [0, H / 2, 0], [w * 0.6, H])}
      {[...Array(n).keys()].map((i) => bar(`t${i}`, [0.012 * k, (i / (n - 1)) * H, 0], [0.024 * k, w * 0.6]))}
      {/* the range left: a heavy fill line beside the stem */}
      {bar('fill', [0.03 * k, (H * lv) / 2, 0.001], [w * 1.6, Math.max(0.002, H * lv)])}
    </group>
  );
};

/** N3: the cold cue's tint colour on the cells' uncut surfaces (brand v0.18.11: toward `WINTER.snowShade`, ≤ 50 %). */
export const COLD_TINT = WINTER.snowShade;

// ---------------------------------------------------------------------------------------------- N10 · seat and wheel heat

/**
 * N10 (§ 5 System heat near the cast): the driver's seat heater as the § 5 "made by" glow on the seat's **near side
 * faces** (cushion and back): an orange frame inset 3 cm from their edges and a soft halo inside it, so the figure
 * sitting on the seat occludes it (depth-tested) and the bloom never reaches the figure's silhouette. `at` the seat's
 * figure origin (the layout's `driver`, car frame), `k` 0 → 1.
 */
export const SeatHeat: React.FC<{at: V3; k: number; lineScale?: number}> = ({at, k, lineScale = 1}) => {
  const mats = useMemo(
    () => ({
      edge: new THREE.MeshBasicMaterial({color: raw(HEAT_COLOR), transparent: true}),
      halo: new THREE.MeshBasicMaterial({color: raw(HEAT_COLOR), transparent: true, depthWrite: false}),
      // the fabric's tint, ≤ 10 % (brand v0.18.12: the face keeps its fabric; not bloomed)
      tint: new THREE.MeshBasicMaterial({color: raw(HEAT_COLOR), transparent: true, depthWrite: false}),
    }),
    [],
  );
  useEffect(() => () => Object.values(mats).forEach((m) => m.dispose()), [mats]);
  if (k < 0.01) return null;
  mats.edge.opacity = clamp01(k);
  mats.halo.opacity = 0.25 * clamp01(k);
  mats.tint.opacity = 0.08 * clamp01(k);
  const [x, y, z] = at;
  const e = 0.007 * Math.min(1.6, lineScale);
  const inset = 0.03;
  // the halo band (inside the 3 cm inset, so it stays on the seat's face)
  const hb = 0.018;
  // the seat's (RealCar `Seat`) cushion: centre (−0.05, 0.51) 0.52 × 0.12, half width 0.25, its near face at z + 0.25;
  // its back: centre (−0.34, 0.92), 0.12 thick × 0.72 tall × 0.48 wide, rolled 0.18 rad, its front face 0.06 toward +x
  // `front`: on the face toward the driver (normal +x), offset `dy` along it, instead of the near side face
  const face = (cx: number, cy: number, w: number, h: number, roll: number, key: string, front?: {dx: number; dy: number}) => {
    const iw = w - 2 * inset;
    const ih = h - 2 * inset;
    const inner = (children: React.ReactNode) =>
      front ? (
        <group key={key} position={[x + cx, y + cy, z]} rotation={[0, 0, roll]}>
          <group position={[front.dx, front.dy, 0]} rotation={[0, Math.PI / 2, 0]}>
            {children}
          </group>
        </group>
      ) : (
        <group key={key} position={[x + cx, y + cy, z + 0.252]} rotation={[0, 0, roll]}>
          {children}
        </group>
      );
    return inner(
      <>
        {(
          [
            [0, ih / 2, iw + e, e],
            [0, -ih / 2, iw + e, e],
            [iw / 2, 0, e, ih],
            [-iw / 2, 0, e, ih],
          ] as [number, number, number, number][]
        ).map(([a, b, c, d], i) => (
          <mesh key={i} position={[a, b, 0.002]} material={mats.edge} userData={{glow: true}} renderOrder={5}>
            <planeGeometry args={[c, d]} />
          </mesh>
        ))}
        {/* the halo: a band just outside the orange outline (inside the face's own edge), never a fill */}
        {(
          [
            [0, ih / 2 + hb / 2, iw + 2 * hb, hb],
            [0, -ih / 2 - hb / 2, iw + 2 * hb, hb],
            [iw / 2 + hb / 2, 0, hb, ih],
            [-iw / 2 - hb / 2, 0, hb, ih],
          ] as [number, number, number, number][]
        ).map(([a, b, c, d], i) => (
          <mesh key={`h${i}`} position={[a, b, 0.001]} material={mats.halo} userData={{glow: true}} renderOrder={4}>
            <planeGeometry args={[c, d]} />
          </mesh>
        ))}
        <mesh position={[0, 0, 0.0005]} material={mats.tint} renderOrder={3}>
          <planeGeometry args={[iw, ih]} />
        </mesh>
      </>,
    );
  };
  return (
    <group>
      {face(-0.05, 0.51, 0.52, 0.12, 0, 'cushion')}
      {/* the back: on its front face (toward YOU, depth-tested, so YOU's torso hides its middle and it peeks out round the
          torso), from the cushion up to the shoulders (review: on the near side face it floated over the hoodie) */}
      {face(-0.34, 0.92, 0.48, 0.5, 0.18, 'back', {dx: 0.063, dy: -0.07})}
    </group>
  );
};

/**
 * N10: the steering wheel's rim heater (§ 5 "made by" glow), only **between the hands**: two arcs of the rim (top and
 * bottom, ± `span` rad each), a thin core and a soft halo torus. `at` the wheel's centre (layout `steering`), the
 * wheel's tilt (RealCar: −0.42 about z, ring in its y–z plane, radius 0.17).
 */
export const WheelHeat: React.FC<{at: V3; k: number; span?: number; steer?: number}> = ({at, k, span = 0.75, steer = 0}) => {
  const mats = useMemo(
    () => ({
      core: new THREE.MeshBasicMaterial({color: raw(HEAT_COLOR), transparent: true}),
      halo: new THREE.MeshBasicMaterial({color: raw(HEAT_COLOR), transparent: true, depthWrite: false}),
    }),
    [],
  );
  useEffect(() => () => Object.values(mats).forEach((m) => m.dispose()), [mats]);
  if (k < 0.01) return null;
  mats.core.opacity = clamp01(k);
  mats.halo.opacity = 0.22 * clamp01(k);
  return (
    <group position={at} rotation={[0, 0, -0.42]}>
      <group rotation={[steer, 0, 0]}>
        {/* the torus lies in its x–y plane; turned so its axis is the wheel's (x): arcs centred on the rim's top and bottom */}
        {[Math.PI / 2, -Math.PI / 2].map((c) => (
          <group key={c} rotation={[0, Math.PI / 2, 0]}>
            <group rotation={[0, 0, c - span]}>
              <mesh material={mats.core} userData={{glow: true}} renderOrder={5}>
                <torusGeometry args={[0.17, 0.02, 8, 24, 2 * span]} />
              </mesh>
              <mesh material={mats.halo} userData={{glow: true}} renderOrder={4}>
                <torusGeometry args={[0.17, 0.034, 8, 24, 2 * span]} />
              </mesh>
            </group>
          </group>
        ))}
      </group>
    </group>
  );
};

/**
 * N10: breath puffs by the driver's mouth (the exhaust vapour's token, `RACE.haze`; opacity ≤ 0.6), drifting forward
 * and a little up but capped under the eyes. `mouth` (car frame), `times` (s), each ≈ 1.2 s.
 */
export const BreathPuffs: React.FC<{mouth: V3; times: number[]; t: number; color: string}> = ({mouth, times, t, color}) => {
  const POOL = 4;
  const mats = useMemo(
    // lit but matte and a step down (lit vapour stays ≤ 244, brand § 2)
    () => [...Array(POOL).keys()].map(() => new THREE.MeshStandardMaterial({color: raw(color).multiplyScalar(0.85), roughness: 1, transparent: true, depthWrite: false})),
    [color],
  );
  useEffect(() => () => mats.forEach((m) => m.dispose()), [mats]);
  const LIFE = 1.2;
  return (
    <>
      {times.map((at, i) => {
        const age = t - at;
        if (age < 0 || age > LIFE) return null;
        const u = age / LIFE;
        const m = mats[i % POOL];
        // many faint blobs (soft edges; overlapping they stay ≤ 0.6)
        m.opacity = 0.16 * ease(age, 0, 0.15) * (1 - ease(u, 0.3, 1));
        const r = 0.014 + 0.04 * Math.sqrt(u);
        return (
          <group key={i} position={[mouth[0] + 0.1 + 0.28 * u, mouth[1] + Math.min(0.03, 0.05 * u), mouth[2]]}>
            {[0, 1, 2, 3, 4, 5, 6, 7].map((j) => {
              const sd = `breath-${i}-${j}`;
              return (
                <mesh
                  key={j}
                  material={m}
                  position={[(random(`${sd}-x`) - 0.3) * r * 2.2, (random(`${sd}-y`) - 0.5) * r * 1.2, (random(`${sd}-z`) - 0.5) * r * 1.6]}
                  scale={r * (0.5 + 0.6 * random(`${sd}-r`))}
                  renderOrder={4}
                >
                  <sphereGeometry args={[1, 10, 8]} />
                </mesh>
              );
            })}
          </group>
        );
      })}
    </>
  );
};
