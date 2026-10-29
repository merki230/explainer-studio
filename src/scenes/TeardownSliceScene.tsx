import React, {useMemo} from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import * as THREE from 'three';
import {CHARGE, HIGHWAY, RACE, type Mood} from '../theme';
import {raw} from '../three/plaster';
import {madeByCoreR, madeByState, swellOf, type MadeByKeys} from '../three/real/madeBy';
import {layoutOf, SlicedCar, type SlicedCarOptions} from '../three/real/SlicedCar';
import {
  AxleStand,
  PartModel,
  partCentre,
  PartGlow,
  partHull,
  scanMaterial,
  TEARDOWN_CAR,
  TEARDOWN_GRID,
  TEARDOWN_PARTS,
  TeardownRoom,
  useTeardownMaterials,
  type TeardownGroup,
  type TeardownPart,
} from '../three/real/Teardown';
import {projectToFrame, SectionCamera, sectionCameraAt, type Framing} from '../three/section/SectionCamera';
import {SectionLights, SectionStage} from '../three/section/SectionStage';
import {ease, framingAtKeys, type CameraKey} from './keyframes';

/*
 * T, The Lab · teardown (No. 011, N1; style guide v0.14 § 3 "The Lab: teardown dressing", § 5 "Made by" glow). The
 * Lab re-dressed for a car teardown by analysts: a cut floor slab with a floor-tape grid, the car on galvanized axle
 * stands at the back, a tool chest at the left wall, nothing readable. Two dressings (switch between them with a
 * `slide`, § 3): 'sedan' (the car comes apart, its parts flying to their cells in the grid, the stripped shell left
 * on the stands; then an ink scan line, the "made by" glow on 3 of every 4 parts, the bought quarter darker) and
 * 'hatch' (another car whole and cut on the stands, its part groups lit on the car itself, `SlicedCar` `madeBy`).
 * No place label (§ 6: the room reads by its look). Times are seconds into the scene; any key may lie outside it.
 */

type V3 = [number, number, number];

export type TeardownFraming = 'whole' | 'grid' | 'pack' | 'car' | 'nose' | 'tail';

/** One wave of the "made by" glow over the grid. */
export type TeardownGlow = {
  /** The first part lights (0.3 s). */
  at: number;
  /** Which systems (default: every system that has made parts). With `share` (default) bought parts never light. */
  groups?: TeardownGroup[];
  /** Seconds over which the wave's parts start, one after another (default 0: all at once). */
  wave?: number;
  /** The wave's order: 'sweep' (default: across the grid from the left), 'size' (big first) or 'scatter' (seeded). */
  order?: 'sweep' | 'size' | 'scatter';
};

export type TeardownSliceSceneProps = {
  durationInFrames: number;
  /** Day (default, § 3: the Day rig, no practicals) or Night. */
  mood?: Mood;
  /** 'sedan' (default: the stripped car and its parts grid) or 'hatch' (another car whole on the stands, no grid). */
  dressing?: 'sedan' | 'hatch';
  /**
   * The car (`SlicedCar` options over the dressing's): sedan `{variant: 'ev', shape: 'sedan', paint: CHARGE.bydPaint}`,
   * hatch `{variant: 'ev', shape: 'hatch', paint: RACE.evPaint}` (the cut hatch is drawn with the crossover's section).
   * N2's glow goes here (`madeBy`: pack, driveUnit, inverter + pulses, panels, lamps); `driving` keys turn the wheels
   * and the rotor on the stands. The stripped shell's cut edge can glow too (`madeBy.panels`).
   */
  car?: Partial<SlicedCarOptions>;
  /** The car's scale (default 1; the hatch 0.9, a smaller car). */
  carScale?: number;
  /**
   * The sedan comes apart from `at`: every part lifts out of the car and flies to its cell (0.75 s each, cubic),
   * staggered big to small over `for` s (default 1.3); the stripped shell stays on the stands. Before it: the car
   * whole on the stands, the grid empty. Null / omitted: the parts already in the grid, the shell stripped.
   */
  apart?: {at: number; for?: number} | null;
  /** An ink scan line (3 px, `cutLine`, never orange) sweeping the grid front to back, or the car nose to tail ('car'), over `for` s (default 1.0). */
  scan?: {at: number; for?: number; along?: 'grid' | 'car'}[];
  /** The "made by" glow on the grid's parts, in waves (see `TeardownGlow`). Default none. */
  glow?: TeardownGlow[];
  /** Only made parts ever light (the bought quarter stays unlit, 3 of every 4 lit). Default true. */
  share?: boolean;
  /** Surges (halo to 45 %, the part swells 3 %, 0.4 s) on lit parts of these systems (default 'all'). */
  surge?: {at: number; groups?: TeardownGroup[] | 'all'}[];
  /** From `at` until `until` the lit parts outside these systems glow a step dimmer (the subject stays bright). */
  focus?: {at: number; until?: number; groups: TeardownGroup[]}[];
  /** The bought parts darken a step (albedo × 0.8, § 3) from here (0.3 s). Default never. */
  dimAt?: number | null;
  /** A part (the pack by default) lifts `height` m (default 0.05) over 0.3 s, holds `hold` s (default 0.15) and settles (0.45 s). */
  lift?: {at: number; groups?: TeardownGroup[]; height?: number; hold?: number}[];
  /** Framing preset (default 'whole' for the sedan, 'car' for the hatch). See `teardownFramings`. */
  framing?: TeardownFraming;
  /** A custom move instead of a preset (look-at + distance at the fixed angle). */
  camera?: {from: Framing; to?: Framing};
  /** Camera keyframes: override `camera`, `push` and the glide in. */
  cameraKeys?: CameraKey[];
  /** Push toward the subject, units/s (default 0). */
  push?: number;
  /** Idle sideways drift, ± units (default 0). */
  drift?: number;
  /** Default `teardown-<dressing>`: a change of dressing is a `slide` (§ 3). */
  location?: string;
  transition?: 'auto' | 'continue' | 'glide' | 'cut' | 'dissolve' | 'slide' | 'follow';
  follow?: {direction?: 'down' | 'up' | 'left' | 'right'; at?: number};
  glide?: number;
  /** Set by Explainer. */
  startFrame?: number;
  cameraFrom?: Framing;
  cameraGlide?: number;
};

const C = TEARDOWN_CAR;
const scaleOf = (p: Partial<TeardownSliceSceneProps>) => p.carScale ?? ((p.dressing ?? 'sedan') === 'hatch' ? 0.9 : 1);
/** The car's lift for its scale: its lowest point (the pack's underside, car y 0.12) on the 0.45 m stands. */
const liftOf = (s: number) => 0.45 - 0.12 * s;
/** A car-frame point → the room (the car faces −x, `SlicedCar` mirrors it). */
const carToRoom = (p: Partial<TeardownSliceSceneProps>, v: V3): V3 => {
  const s = scaleOf(p);
  return [C.x - s * v[0], liftOf(s) + s * v[1], C.z + s * v[2]];
};

/** The framings at the fixed angle (world metres, set on test stills). */
export const teardownFramings = (): Record<TeardownFraming, Framing> => {
  const pc = partCentre(TEARDOWN_PARTS.find((q) => q.id === 'pack')!);
  return {
    whole: {look: [0.13, -0.9, 1.2], distance: 31},
    grid: {look: [-0.45, -0.75, 1.5], distance: 22},
    pack: {look: [pc[0] + 0.1, -0.45, pc[1]], distance: 9},
    car: {look: [C.x + 0.55, 0.15, C.z + 0.15], distance: 21},
    nose: {look: [C.x - 0.95, 0.3, C.z + 0.2], distance: 10},
    tail: {look: [C.x + 1.95, 0.35, C.z + 0.2], distance: 10},
  };
};

const teardownCameraMove = (p: Partial<TeardownSliceSceneProps>, durationInFrames: number, fps: number, frame?: number) => {
  const name = p.framing ?? ((p.dressing ?? 'sedan') === 'hatch' ? 'car' : 'whole');
  const preset = teardownFramings()[name];
  if (p.cameraKeys && p.cameraKeys.length) {
    const base = p.camera?.from ?? preset;
    const f = framingAtKeys(p.cameraKeys, base, frame === undefined ? Infinity : frame / fps);
    return {from: f, to: f, pre: undefined};
  }
  const push = p.push ?? 0;
  const pre =
    p.cameraGlide && p.cameraFrom
      ? {from: p.cameraFrom, hold: 0, move: Math.max(1, Math.round(p.cameraGlide * fps)), ease: 'cubic' as const}
      : undefined;
  const secs = Math.max(0, durationInFrames - (pre ? pre.move : 0)) / fps;
  if (p.camera) return {from: p.camera.from, to: p.camera.to ?? p.camera.from, pre};
  const c = pre ? undefined : p.cameraFrom;
  const same = c && c.look.every((v, i) => Math.abs(v - preset.look[i]) < 1e-6);
  const from = c && same ? c : preset;
  return {from, to: {look: from.look, distance: from.distance - push * secs}, pre};
};

export const teardownCameraStart = (p: Partial<TeardownSliceSceneProps>, d: number, fps: number): Framing =>
  teardownCameraMove({...p, cameraFrom: undefined, cameraGlide: undefined}, d, fps, 0).from;
export const teardownCameraEnd = (p: Partial<TeardownSliceSceneProps>, d: number, fps: number): Framing => teardownCameraMove(p, d, fps).to;

const teardownCameraAt = (p: Partial<TeardownSliceSceneProps>, o: {frame: number; fps: number; durationInFrames: number}) => {
  const {from, to, pre} = teardownCameraMove(p, o.durationInFrames, o.fps, o.frame);
  return sectionCameraAt({from, to, pre, frame: o.frame, fps: o.fps, durationInFrames: o.durationInFrames, drift: p.drift ?? 0, clockOffset: (p.startFrame ?? 0) / o.fps});
};

const ALL_MADE: TeardownGroup[] = ['body', 'lamps', 'trim', 'pack', 'drive', 'electronics', 'harness'];

/** Each part's glow keys from the scene's waves and surges (null: never lit). */
const partKeys = (p: Partial<TeardownSliceSceneProps>): Map<string, MadeByKeys | null> => {
  const share = p.share ?? true;
  const out = new Map<string, MadeByKeys | null>();
  const parts = TEARDOWN_PARTS;
  for (const g of p.glow ?? []) {
    const groups = g.groups ?? ALL_MADE;
    const these = parts.filter((q) => groups.includes(q.group) && !(share && q.bought) && !out.get(q.id));
    const order = g.order ?? 'sweep';
    const rankKey = (q: TeardownPart) => {
      const [x, z] = partCentre(q);
      if (order === 'size') return -(q.cell[2] * q.cell[3]) + x * 0.001;
      if (order === 'scatter') return hash(q.id);
      return x + z * 0.15;
    };
    const sorted = [...these].sort((a, b) => rankKey(a) - rankKey(b));
    sorted.forEach((q, i) => {
      const at = g.at + (sorted.length > 1 ? ((g.wave ?? 0) * i) / (sorted.length - 1) : 0);
      out.set(q.id, {at});
    });
  }
  for (const s of p.surge ?? []) {
    for (const q of parts) {
      const k = out.get(q.id);
      if (!k) continue;
      if (s.groups === undefined || s.groups === 'all' || s.groups.includes(q.group)) k.surge = [...(k.surge ?? []), s.at];
    }
  }
  return out;
};
/** A stable 0 → 1 hash of a part id (the 'scatter' order). */
const hash = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return ((h >>> 0) % 10000) / 10000;
};

/** Where a part is at t: on its cell, or flying out of the car (`apart`), or still in it (null). */
const partPose = (p: Partial<TeardownSliceSceneProps>, q: TeardownPart, t: number): {pos: V3; rot: V3} | null => {
  const [x, z] = partCentre(q);
  const dst: V3 = [x, 0, z];
  const a = p.apart;
  if (!a) return {pos: dst, rot: [0, 0, 0]};
  if (t < a.at) return null;
  const ranks = apartRanks();
  const span = Math.max(0, (a.for ?? 1.3) - 0.75);
  const t0 = a.at + span * (ranks.get(q.id) ?? 0);
  const u = ease(t, t0, t0 + 0.75);
  const src = carToRoom(p, q.from);
  const lerp = (i: number) => src[i] + (dst[i] - src[i]) * u;
  const arc = Math.sin(Math.PI * Math.min(1, Math.max(0, (t - t0) / 0.75))) * 0.55;
  const r0 = q.fromRot ?? [0, 0, 0];
  return {pos: [lerp(0), lerp(1) + arc, lerp(2)], rot: [r0[0] * (1 - u), r0[1] * (1 - u), r0[2] * (1 - u)]};
};
let RANKS: Map<string, number> | null = null;
/** The order the parts leave the car: big first (by cells, then the heavy systems), 0 → 1. */
const apartRanks = () => {
  if (RANKS) return RANKS;
  const weight = (q: TeardownPart) => q.cell[2] * q.cell[3] + (['pack', 'seats', 'drive', 'wheels'].includes(q.group) ? 2 : 0);
  const sorted = [...TEARDOWN_PARTS].sort((a, b) => weight(b) - weight(a) || a.id.localeCompare(b.id));
  RANKS = new Map(sorted.map((q, i) => [q.id, i / (sorted.length - 1)]));
  return RANKS;
};

const liftAt = (p: Partial<TeardownSliceSceneProps>, q: TeardownPart, t: number) =>
  (p.lift ?? []).reduce((h, l) => {
    if (!(l.groups ?? ['pack']).includes(q.group)) return h;
    const hold = l.hold ?? 0.15;
    return h + (l.height ?? 0.05) * (ease(t, l.at, l.at + 0.3) - ease(t, l.at + 0.3 + hold, l.at + 0.75 + hold));
  }, 0);

/**
 * A named point on screen (px) at a frame, for overlays: 'pack' (just above the pack's tile, as it lifts), 'roof'
 * (above the car's roof), 'grid' (the grid's front edge, centre), 'part:<id>' (above any part, e.g. 'part:driveUnit').
 */
export const teardownAnchorOnScreen = (
  p: Partial<TeardownSliceSceneProps>,
  anchor: string,
  o: {frame: number; fps: number; durationInFrames: number},
): [number, number] | undefined => {
  const cam = teardownCameraAt(p, o);
  const t = o.frame / o.fps;
  if (anchor === 'roof') {
    const car = carOptions(p);
    return projectToFrame(cam, carToRoom(p, [0, layoutOf(car).roofCut + 0.15, 0]));
  }
  if (anchor === 'grid') {
    const G = TEARDOWN_GRID;
    return projectToFrame(cam, [G.x0 + (G.cols * G.cell) / 2, 0, G.z0 + G.rows * G.cell]);
  }
  const id = anchor === 'pack' ? 'pack' : anchor.startsWith('part:') ? anchor.slice(5) : null;
  const q = id ? TEARDOWN_PARTS.find((x) => x.id === id) : undefined;
  if (!q) return undefined;
  const pose = partPose(p, q, t);
  if (!pose) return undefined;
  const h = partHull(q);
  return projectToFrame(cam, [pose.pos[0], pose.pos[1] + h.at[1] * 2 + 0.05 + liftAt(p, q, t), pose.pos[2]]);
};

const carOptions = (p: Partial<TeardownSliceSceneProps>): Partial<SlicedCarOptions> => {
  const hatch = (p.dressing ?? 'sedan') === 'hatch';
  return {
    variant: 'ev',
    shape: hatch ? 'hatch' : 'sedan',
    paint: hatch ? RACE.evPaint : CHARGE.bydPaint,
    ...(p.car ?? {}),
  };
};


/** The parts in the grid (inside the canvas: their materials use the studio environment). */
const TeardownParts: React.FC<{p: TeardownSliceSceneProps; t: number; r: number; paint: string}> = ({p: props, t, r, paint}) => {
  const mood = props.mood ?? 'day';
  const dim = props.dimAt == null ? 0 : ease(t, props.dimAt, props.dimAt + 0.3);
  const {mats, boughtMats} = useTeardownMaterials(mood, paint, dim);
  const keys = useMemo(() => partKeys(props), [props]);
  const focusK = (props.focus ?? []).map((f) => ({
    groups: f.groups,
    k: ease(t, f.at, f.at + 0.3) * (f.until == null ? 1 : 1 - ease(t, f.until, f.until + 0.3)),
  }));
  return (
    <>
      {TEARDOWN_PARTS.map((q) => {
              const pose = partPose(props, q, t);
              if (!pose) return null;
              const k = keys.get(q.id);
              const st = madeByState(k, t);
              const h = partHull(q);
              const sw = swellOf(st.surge);
              const fd = focusK.reduce((d, f) => (f.groups.includes(q.group) ? d : d * (1 - 0.6 * f.k)), 1);
              const y = pose.pos[1] + liftAt(props, q, t);
              return (
                <group key={q.id} position={[pose.pos[0], y, pose.pos[2]]} rotation={pose.rot}>
                  <group position={[0, h.at[1], 0]} scale={sw}>
                    <group position={[0, -h.at[1], 0]}>
                      <PartGlow.Provider value={st.lit > 0.003 ? {lit: st.lit, surge: st.surge, r, dim: fd} : null}>
                        <PartModel part={q} mats={q.bought ? boughtMats : mats} />
                      </PartGlow.Provider>
                    </group>
                  </group>
                </group>
              );
            })}
    </>
  );
};

/**
 * T, The Lab · teardown (No. 011): a car on axle stands in a re-dressed Lab; the sedan comes apart into a floor-tape
 * grid of its parts, a scan line checks them, 3 of every 4 light with the "made by" glow and the bought quarter
 * darkens; or a second car (the hatch) whole on the stands, its part groups lit in turn. The camera frames it at the
 * fixed angle.
 */
export const TeardownSliceScene: React.FC<TeardownSliceSceneProps> = (props) => {
  const {durationInFrames, mood = 'day', startFrame = 0} = props;
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const hatch = (props.dressing ?? 'sedan') === 'hatch';
  const {from, to, pre} = teardownCameraMove(props, durationInFrames, fps, frame);
  const cam = teardownCameraAt(props, {frame, fps, durationInFrames});
  const camD = cam.position.distanceTo(cam.look);
  const inkK = Math.max(0.15, Math.min(4, camD / 12.75));
  const r = madeByCoreR(camD);
  const s = scaleOf(props);
  const lift = liftOf(s);
  const car = carOptions(props);
  const standMat = useMemo(() => new THREE.MeshPhysicalMaterial({color: raw(HIGHWAY.galvanized), roughness: 0.4, metalness: 0.6}), []);
  const scanMat = useMemo(() => scanMaterial(), []);
  // the sedan is whole until it comes apart; the hatch always
  const apartAt = props.apart?.at;
  const whole = hatch || (apartAt !== undefined && t < apartAt);
  // the scan line: 3 px on screen at this distance (px per metre ≈ 1920 / (0.4618 × camD))
  const scanW = (3 * camD) / 4158;
  const G = TEARDOWN_GRID;
  const gw = G.cols * G.cell;
  const gd = G.rows * G.cell;
  const scans = (props.scan ?? [])
    .map((sc) => {
      const dur = sc.for ?? 1.0;
      const u = (t - sc.at) / dur;
      if (u < 0 || u > 1) return null;
      const k = ease(t, sc.at, sc.at + dur);
      if ((sc.along ?? (hatch ? 'car' : 'grid')) === 'car') {
        const x0 = C.x - 2.5 * s;
        const x1 = C.x + 2.5 * s;
        const za = C.z - 1.05 * s;
        const zb = C.z + 1.0 * s;
        return {pos: [x0 + (x1 - x0) * k, 0.003, (za + zb) / 2] as V3, size: [scanW, 0.002, zb - za] as V3};
      }
      return {pos: [G.x0 + gw / 2, 0.003, G.z0 + gd - gd * k] as V3, size: [gw + 0.2, 0.002, scanW] as V3};
    })
    .filter((x): x is {pos: V3; size: V3} => x !== null);
  const stands: V3[] = [
    [-1.0, 0, 0.5],
    [1.0, 0, 0.5],
    [-1.0, 0, -0.7],
    [1.0, 0, -0.7],
  ].map((v) => {
    const w = carToRoom(props, v as V3);
    return [w[0], 0, w[2]];
  });
  const opts: SlicedCarOptions = {
    ...car,
    mood,
    road: 'street',
    driverShown: false,
    brakeLights: car.brakeLights ?? 0,
    foot: car.foot ?? [{at: -1, pose: 'floor'}],
    clusterSpeed: car.clusterSpeed ?? 0,
    power: car.power ?? 0,
    strip: car.strip ?? !whole,
    wheelsShown: car.wheelsShown ?? whole,
    startFrame,
  };

  return (
    <AbsoluteFill>
      <SectionStage mood={mood} post={{focusY: 0.5}} ao far={200}>
        <SectionCamera from={from} to={to} pre={pre} durationInFrames={durationInFrames} drift={props.drift ?? 0} clockOffset={startFrame / fps} fitClip farMin={120} />
        <SectionLights mood={mood} target={[0, 0.5, -0.2]} lamp={0} extent={5} figureSpot={false} />
        <TeardownRoom mood={mood} inkScale={inkK} grid={!hatch} />
        {stands.map((p, i) => (
          <AxleStand key={i} position={p} mat={standMat} />
        ))}
        <group position={[C.x, lift, C.z]} scale={s}>
          <SlicedCar {...opts} ground={false} cameraDistance={camD / s} />
        </group>
        {hatch ? null : <TeardownParts p={props} t={t} r={r} paint={car.paint ?? CHARGE.bydPaint} />}
        {scans.map((sc, i) => (
          <mesh key={i} position={sc.pos} material={scanMat} renderOrder={8}>
            <boxGeometry args={sc.size} />
          </mesh>
        ))}
      </SectionStage>
    </AbsoluteFill>
  );
};
