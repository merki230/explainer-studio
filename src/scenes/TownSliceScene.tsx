import React, {useMemo} from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import * as THREE from 'three';
import {EXTRA_B, MOODS, type Format, type Mood} from '../theme';
import {raw} from '../three/plaster';
import {TOWER_DC} from '../three/section/CoolingTower';
import {INK} from '../three/section/cutLook';
import {catenary, CutPipeRun, Pipe, PowerPole, useDcMats, type DcMats} from '../three/section/dcParts';
import {Figure} from '../three/section/Figure';
import {GlowNode, GlowPolyline, NODE_SCALE, pointAlong} from '../three/section/GlowLines';
import {
  formatOf,
  projectToFrame,
  SectionCamera,
  sectionCameraAt,
  useFormatProps,
  type Framing,
} from '../three/section/SectionCamera';
import {SectionLights, SectionStage} from '../three/section/SectionStage';
import {skyTexture} from '../three/section/textures';
import {
  AerationBasin,
  BrinePonds,
  Clarifier,
  cutBlock,
  Fence,
  HouseField,
  KITCHEN,
  KitchenHouse,
  LimeTank,
  PLANT,
  plantPath,
  PlantTease,
  PONDS,
  RIVER,
  RiverSection,
  TownHouse,
  useTownMats,
  WaterTower,
  type TownMats,
} from '../three/section/townParts';
import type {Rect} from '../three/section/cutLook';
import {CutOutline} from '../three/section/cutLook';
import {DC, dcCarry, dcDrain, dcFramings, DcSet, dcServiceLine, trackAt, type DatacenterSliceSceneProps, type Track} from './DatacenterSliceScene';
import {ease, framingAtKeys, type CameraKey} from './keyframes';

/*
 * N2, the town (No. 013 `datacenter-water`, av-script § 4): one long sheet cut along the street, the camera trucking
 * along it. The data centre is N1's own set (`DcSet`) at the sheet's origin, so every DC framing (roof, meter) is N1's to
 * the pixel; the town is laid out in the same metres around it. Left to right, main dressing:
 *
 *   power plant (tease, x ≈ −128) · fields · the town (water tower, three houses on the street, the kitchen house cut
 *   open, the 400-house field behind) · the fence with the neighbours · the DATA CENTRE (yard, building, cut ground) ·
 *   the manhole where its lateral joins the sewer main · the wastewater plant (aeration basin, clarifier) · the river,
 *   cut across, with the outfall gate.
 *
 * Under the street, on the ground's cut face: the water main (from the water tower to the DC's service line, neutral
 * flow) and the sewer main (sloping down to the plant; neutral house flows; the DC's orange drain pulses).
 *
 * `dressing: 'quincy'`: the same sheet re-dressed: no plant tease, the wastewater plant replaced by the lime-softening
 * tank (the DC's drain runs to it) and the lined brine ponds; the orange return pipe from the tank up to the DC's towers;
 * the river at the same edge.
 *
 * `stack: true` (9:16, the twin-section convention, § 8): the power plant's section is drawn above the DC (the line
 * crossing the gap vertically), the river's section below it (the outfall pipe crossing the gap), Quincy's ponds below
 * its tank; everything else stays in the row. Vertical framings assume it.
 *
 * Orange: the DC's drain path and pulses, the backed-up water in the outfall pipe, the river's warm plume, Quincy's
 * return pipe, the plant's water path, the drop tokens. Never orange: the water main, the sewer's own flow, the line,
 * houses, people, the plumes (white).
 */

type V3 = [number, number, number];

// ---------------------------------------------------------------------------------------------------- props

export type TownFraming =
  | 'frame0'
  | 'frame0Wide'
  | 'endHold'
  | 'meter'
  | 'houses'
  | 'kitchen'
  | 'main'
  | 'fields'
  | 'plantTease'
  | 'twoShot'
  | 'roof'
  | 'roofDry'
  | 'roofClose'
  | 'site'
  | 'sewer'
  | 'plant'
  | 'river'
  | 'outfall'
  | 'riverbed'
  | 'ponds';

export type TownCameraKey = {at: number; ease?: 'out' | 'inOut' | 'sine'; log?: boolean} & (
  {framing: TownFraming} | {look: V3; distance: number}
);

export type TownSliceSceneProps = {
  durationInFrames: number;
  /** Day (default) or Night. */
  mood?: Mood;
  /** 'main' (default) or 'quincy' (lime tank, ponds, return pipe; no plant tease, no wastewater plant). */
  dressing?: 'main' | 'quincy';
  /** 9:16 staging: the plant's section above the DC, the river's (and Quincy's ponds') below. Default false. */
  stack?: boolean;
  /**
   * The sheet's east end (everything right of the manhole: the wastewater plant or Quincy's tank and ponds, the river,
   * the outfall). Default true; `false` ends the sheet just past the manhole, so the end-screen hold's right half is
   * clear sky (the far framings never see it go: it's off frame in `frame0Wide`).
   */
  eastEnd?: boolean;

  // --- camera (as the DC's: a named start framing, keys, a push that never stops, a drift)
  /** Start framing (default 'frame0'); names resolve per format and dressing. */
  framing?: TownFraming;
  /** Arrive at each framing at `at` s (cubic in-out from the previous; `log` for a big dolly). */
  cameraKeys?: TownCameraKey[];
  /** The slow push, a share of the distance per second (default 0.002 wide, 0.003 vertical), measured from the last key's time, so the frame on that key is exact (loop points). */
  push?: number;
  /** Idle sideways drift (± m at ≥ 10 m distance, default 0.08). */
  drift?: number;

  // --- the data centre (N1's set)
  /** The DC instance: roof 'towers' (default) | 'dry', plume strength track (default 1 with towers, 0 dry), fan level track, orange plume tokens from `tokensAt`. */
  dc?: {roof?: 'towers' | 'dry'; plume?: Track; fans?: Track; tokensAt?: number};
  /** The DC's street meter dial (level track, as N1's `waterMeter`). */
  waterMeter?: Track;

  // --- the town
  /** The houses' windows light one after another from `at`, every `every` s (0.3). */
  windows?: {at: number; every?: number};
  /** The 400-house field behind the town, 0 → 1 (rows fill front to back). */
  houseField?: Track;
  /** The kitchen faucet opens at `tapAt` (YOU's hand on the lever, the stream runs). Puts YOU at the sink. */
  kitchen?: {tapAt?: number};
  /**
   * YOU: at the kitchen sink (with `kitchen`), else by the fence: walks in from the street at `walkAt` (≈ 3 s), looks
   * up at the plume at `lookAt`, turns to look along the power line at `turnAt`. `null`: nobody. Appears at `at`.
   */
  you?: {at?: number; walkAt?: number; lookAt?: number; turnAt?: number; place?: 'kitchen' | 'fence'} | null;
  /** The neighbours at the fence look up at the plume from `lookAt` (they stand there in the main dressing). */
  fence?: {lookAt?: number};
  /** Neutral flow along the water main from `from` (default: always). */
  mainFlow?: {from: number};

  // --- the drain, the sewer, the river
  /**
   * The DC's orange drain path to the sewer and the plant (main) or to the lime tank (Quincy). Drawn whenever the
   * drain's story is on (`drain`, `sewer`, `gate`, `fork` or `riverPlume` set; `false` hides it). Single pulses at
   * `pulseAt` (s, or a list), a pulse every `pulseEvery` s.
   */
  drain?: {pulseAt?: number | number[]; pulseEvery?: number} | false;
  /** Neutral flows from the houses join the sewer main, one per house every `every` s (1.5), from `from`. */
  sewer?: {from: number; every?: number};
  /** The outfall gate: `open` track 0 → 1 (it lifts); `backupAt`: the orange fills the outfall pipe to the shut gate and backs up. */
  gate?: {open?: Track; backupAt?: number};
  /** The sampler bottle at the gate fills from `fillAt` (1.5 s). */
  sampler?: {fillAt: number};
  /** The three gauges' needles swing down under their limit marks, one at each time. */
  gauges?: {settleAt: number[]};
  /** The warm (orange) plume spreading downstream from the outfall, 0 → 1. */
  riverPlume?: Track;
  /** Sand grains drift downstream along the bed from `from`. */
  sandDrift?: {from: number};
  /** At `at` the junction's node pulses and orange runs both ways (sewer and river); from `stubAt` a third pipe stub grows up (reuse). */
  fork?: {at: number; stubAt?: number};

  // --- Quincy
  quincy?: {
    /** The DC's blowdown runs to the lime tank (the drain path draws, 2 s). */
    blowdownAt?: number;
    /** Lime drifts down in the tank. */
    limeAt?: number;
    /** Sludge settles into the cone (3 s). */
    sludgeAt?: number;
    /** The orange return pipe draws from the tank up to the DC's towers (2.4 s); dots travel it after. */
    returnDrawAt?: number;
    /** Brine into the ponds: the level falls and the salt crust spreads (≈ 6 s). */
    pondFrom?: number;
    /** A pulse up the return pipe every `pulseEvery` s. */
    pulseEvery?: number;
    /** The tank's rake turns from `rakeFrom` (default: always). */
    rakeFrom?: number;
    /** Dots travel the return pipe from `pumpFrom` (default: once drawn). */
    pumpFrom?: number;
    /** The return pipe's orange fades out from `returnOutAt` (0.6 s): e.g. Short 3's last second, so its end frame's orange matches the main dressing's hook. */
    returnOutAt?: number;
  };

  // --- the power plant (tease) and the drops
  /** The plant's plume (strength track, default 1) and its water path lighting orange at `pathAt` (2 s). */
  plant?: {plume?: Track; pathAt?: number};
  /** Drop tokens: one at the DC's roof at `dcAt`; `n` at the plant's tower from `plantAt`, one every `every` s (0.3); `rise`: they float up into the plume. */
  drops?: {dcAt?: number; plantAt?: number; n?: number; every?: number; rise?: boolean};
  /** The line's insulators glint at these times. */
  lineGlintAt?: number | number[];

  // --- set by the Explainer
  location?: string;
  transition?: 'auto' | 'continue' | 'glide' | 'cut' | 'dissolve' | 'slide' | 'follow';
  follow?: {direction?: 'down' | 'up' | 'left' | 'right'; at?: number};
  glide?: number;
  startFrame?: number;
  cameraFrom?: Framing;
  cameraGlide?: number;
  format?: Format;
  /** Carried on a `continue`: the DC's fans' and meter's turns so far. */
  fanFrom?: number;
  fanBFrom?: number;
  waterFrom?: number;
};

// ---------------------------------------------------------------------------------------------------- layout

const ZF = DC.zf;
/** The town's ground goes deeper than the DC's (the sewer main runs under it), so a filler block sits under the DC. */
const GROUND_Y = -4.6;

/** The sheet's positions for a dressing and staging (world metres; the DC at the origin). */
export const townLayout = (dressing: 'main' | 'quincy' = 'main', stack = false, east = true) => {
  const quincy = dressing === 'quincy';
  return {
    quincy,
    stack,
    east,
    /** The plant's tower centre on its ground (row: far left; stack: above the DC's yard). */
    plant: (stack ? [-20, 34, ZF] : [-128, 0, ZF]) as V3,
    /** The river segment's origin (its left bank's edge, ground top). */
    river: (stack ? [12.5, -9.5, ZF] : [84, 0, ZF]) as V3,
    /** Quincy: the ponds segment's origin and the lime tank's centre x. */
    ponds: (stack ? [31, -9.5, ZF] : [38, 0, ZF]) as V3,
    limeX: stack ? 44 : 26,
    houses: [-69.5, -55.5, -41.5],
    kitchenAt: [-55.5, 0, -6] as V3,
    waterTower: [-84, 0, -9] as V3,
    fenceX: -18.6,
    poles: [-35.6, -48.5, -62.5, -77, -88],
    polesZ: DC.polesZ,
    junctionX: 14.3,
    aeration: [26, 40] as [number, number],
    clarifierX: 52,
    rightEnd: 76,
    /** The plant's dead-end pole (x): right of the hall in the row; left of the tower in the stack, over the town's first pole. */
    plantPoleX: stack ? -20 - 16 : -128 + PLANT.hall.x1 + 3,
  };
};
type Layout = ReturnType<typeof townLayout>;

const sewerY = (x: number) => -2.9 - ((x + 80) / 106) * 1.0;

/** The DC's drain continued in the town: the DC's own path, the lateral to the junction, then the sewer (main) or the lime tank (Quincy). */
export const townDrain = (L: Layout): V3[] => {
  const z = ZF + 0.12;
  const dc = dcDrain().map((p) => [p[0], p[1], p[2] >= ZF ? z : p[2]] as V3);
  const j = L.junctionX;
  if (!L.east) return [...dc, [j, -2.1, z], [j, sewerY(j), z], [j + 3.9, sewerY(j + 3.9), z]];
  if (L.quincy) {
    // the city takes the blowdown down the same manhole and sewer, then up into its lime tank (in the river framing it
    // reads exactly as the main dressing's drain, so Short 3's loop matches)
    const tx = L.limeX - 4.85;
    return [...dc, [j, -2.1, z], [j, sewerY(j), z], [tx, sewerY(tx), z], [tx, 3.4, z], [tx + 0.6, 3.4, z]];
  }
  const a = L.aeration[0];
  return [...dc, [j, -2.1, z], [j, sewerY(j), z], [a, sewerY(a), z], [a + 0.6, 0.6, z]];
};

/** The outfall pipe (the second pipe): from the junction to the river gate's mouth. */
export const outfallPipe = (L: Layout): V3[] => {
  const z = ZF + 0.12;
  const m: V3 = [L.river[0] + RIVER.mouth[0] - 0.3, L.river[1] + RIVER.mouth[1], z];
  const j = L.junctionX;
  if (L.stack) {
    // along under the DC's lateral, down the gap just left of the river's section, in through its bank at the mouth
    const gx = L.river[0] + RIVER.left - 0.6;
    return [[j, -2.1, z], [j - 0.7, -2.1, z], [j - 0.7, -3.0, z], [gx, -3.0, z], [gx, m[1], z], m];
  }
  return [[j, -2.1, z], [m[0] - 3, -2.1, z], [m[0] - 2, m[1], z], m];
};

/**
 * Quincy's return pipe: the reclaimed water back to the DC as tower makeup: out of the tank's left wall, down into the
 * ground, along the cut face to the DC's service riser, then up the DC's own makeup line to tower A's basin.
 */
export const quincyReturn = (L: Layout): V3[] => {
  const z = ZF + 0.12;
  const x = L.limeX - 5.3;
  const svc = dcServiceLine();
  return [
    [L.limeX - 4.5, 1.2, z],
    [x, 1.2, z],
    [x, -1.35, z],
    [DC.serviceRiserX + 0.2, -1.35, z],
    [DC.serviceRiserX + 0.2, -0.02, z],
    ...svc.slice(3),
  ];
};

/** The plant's water path in world metres. */
const plantPathWorld = (L: Layout): V3[] => plantPath().map((p) => [p[0] + L.plant[0], p[1] + L.plant[1], p[2] + L.plant[2]] as V3);

/** The town poles and the wires between them, continuing the DC's line (its far end at x −35.6, y 10.94). */
const lineWires = (L: Layout): V3[][] => {
  const yA = 10.94;
  const wires: V3[][] = [];
  for (const i of [-1, 0, 1]) {
    const z = L.polesZ + i * 1.05;
    const pts: V3[] = L.poles.map((x) => [x, yA, z] as V3);
    if (L.stack) {
      // up the gap to the plant's dead-end pole above the yard
      const top: V3 = [L.plantPoleX, L.plant[1] + 12.3, z];
      wires.push([pts[0], top]);
      continue;
    }
    const end: V3 = [L.plantPoleX, 12.3, z];
    const all = [...pts, end];
    const run: V3[] = [];
    for (let k = 0; k < all.length - 1; k++) run.push(...catenary(all[k], all[k + 1], 0.9).slice(k ? 1 : 0));
    wires.push(run);
  }
  return wires;
};

// ---------------------------------------------------------------------------------------------------- framings

const DCH = dcFramings('horizontal');
const DCV = dcFramings('vertical');

const H: Record<TownFraming, Framing> = {
  frame0: {look: [-30, 6, -6], distance: 170},
  frame0Wide: {look: [-58, 22, -6], distance: 360},
  endHold: {look: [-6, 16, -6], distance: 560},
  meter: DCH.meter,
  houses: {look: [-56, 3, -14], distance: 78},
  kitchen: {look: [-57, 1.4, -8.2], distance: 22},
  main: {look: [-15.5, -0.7, 2.3], distance: 20},
  fields: {look: [-86, 7, -4], distance: 75},
  plantTease: {look: [-112, 30, -2], distance: 210},
  twoShot: {look: [-62, 16, -6], distance: 370},
  roof: DCH.roof,
  roofDry: DCH.roof,
  roofClose: {look: [2.7, 12.2, -0.9], distance: 21},
  site: {look: [4, 7, 0], distance: 100},
  sewer: {look: [13.6, -2.0, 2.4], distance: 15},
  plant: {look: [44, 2.5, -2], distance: 85},
  river: {look: [87, -0.8, -1], distance: 46},
  outfall: {look: [84.0, -0.6, 1.5], distance: 16},
  riverbed: {look: [89, -2.9, 1.0], distance: 14},
  ponds: {look: [53.5, -0.3, -2], distance: 58},
};

/** 9:16, with `stack` (the frame is 0.26 × the distance wide, 0.46 × high). */
const VS: Record<TownFraming, Framing> = {
  frame0: {look: [-26, 6, -6], distance: 170},
  frame0Wide: {look: [-30, 20, -6], distance: 260},
  endHold: {look: [-10, 36, -6], distance: 240},
  meter: DCV.meter,
  houses: {look: [-55.5, 0.5, -10], distance: 62},
  kitchen: {look: [-56.9, 0.9, -8.0], distance: 21},
  main: {look: [-22, -0.6, 2.3], distance: 19},
  fields: {look: [-28, 26, -3.8], distance: 95},
  plantTease: {look: [-13, 56, -3], distance: 180},
  twoShot: {look: [-8, 36, -4], distance: 215},
  roof: DCV.roof,
  roofDry: DCV.roof,
  roofClose: {look: [2.7, 12.2, -0.9], distance: 24},
  site: {look: [3, 6, 0], distance: 95},
  sewer: {look: [13.6, -2.0, 2.4], distance: 19},
  plant: {look: [43, 1.5, -1], distance: 120},
  river: {look: [11, 4, 0], distance: 112},
  outfall: {look: [13.1, -10.2, 1.5], distance: 16},
  riverbed: {look: [18, -12.4, 1.0], distance: 17},
  ponds: {look: [46, -9, -2], distance: 75},
};

/** Quincy's own framings (row and stack) where the sheet differs. */
const QH: Partial<Record<TownFraming, Framing>> = {
  site: {look: [10, 6, 0], distance: 105},
  plant: {look: [26, 4.5, 0], distance: 40},
};
const QV: Partial<Record<TownFraming, Framing>> = {
  site: {look: [14, 4, 0], distance: 110},
  plant: {look: [44, -2.5, 0], distance: 70},
};

/** The framings for a format, dressing and staging. A 9:16 frame without `stack` widens the row's framings. */
export const townFramings = (format: Format | undefined, dressing: 'main' | 'quincy' = 'main', stack = false): Record<TownFraming, Framing> => {
  const q = dressing === 'quincy';
  if (format === 'horizontal') return {...H, ...(q ? QH : {})};
  if (stack) return {...VS, ...(q ? QV : {})};
  const w = {...H, ...(q ? QH : {})};
  return Object.fromEntries(Object.entries(w).map(([k, f]) => [k, {look: f.look, distance: f.distance * 1.8}])) as Record<TownFraming, Framing>;
};

const resolveFraming = (p: Partial<TownSliceSceneProps>, f: TownFraming | Framing): Framing => {
  const set = townFramings(formatOf(p), p.dressing, p.stack);
  return typeof f === 'string' ? (set[f] ?? set.frame0) : f;
};

const pushRate = (p: Partial<TownSliceSceneProps>) => p.push ?? (formatOf(p) === 'horizontal' ? 0.002 : 0.003);

/** The camera's framing at second `s` (keys, glide in, push from the last key's time). */
const townFramingAt = (p: Partial<TownSliceSceneProps>, s: number): Framing => {
  const start = resolveFraming(p, p.framing ?? 'frame0');
  const keys: CameraKey[] = (p.cameraKeys ?? []).map((c) => {
    const f = 'framing' in c ? resolveFraming(p, c.framing) : {look: c.look, distance: c.distance};
    return {at: c.at, look: f.look, distance: f.distance, ease: c.ease, log: c.log};
  });
  const base = p.cameraFrom && !p.cameraGlide ? p.cameraFrom : start;
  const T = keys.length ? Math.max(0, ...keys.map((k) => k.at)) : 0;
  const k = pushRate(p);
  const f0 = keys.length ? framingAtKeys(keys, base, s) : base;
  let f: Framing = {look: f0.look, distance: f0.distance * (1 - k * (s - T))};
  const g = p.cameraGlide && p.cameraFrom ? p.cameraGlide : 0;
  if (g && s < g) {
    const u = ease(s, 0, g);
    const from = p.cameraFrom!;
    f = {look: from.look.map((v, i) => v + (f.look[i] - v) * u) as V3, distance: from.distance + (f.distance - from.distance) * u};
  }
  return f;
};

export const townCameraStart = (p: Partial<TownSliceSceneProps>): Framing =>
  townFramingAt({...p, cameraFrom: undefined, cameraGlide: undefined}, 0);
export const townCameraEnd = (p: Partial<TownSliceSceneProps>, d: number, fps: number): Framing => townFramingAt(p, d / fps);

const townCameraAt = (p: Partial<TownSliceSceneProps>, o: {frame: number; fps: number; durationInFrames: number}) => {
  const f = townFramingAt(p, o.frame / o.fps);
  return sectionCameraAt({
    from: f,
    to: f,
    frame: o.frame,
    fps: o.fps,
    durationInFrames: o.durationInFrames,
    drift: p.drift ?? 0.08,
    clockOffset: (p.startFrame ?? 0) / o.fps,
    format: formatOf(p),
  });
};

// ---------------------------------------------------------------------------------------------------- the DC instance

/** The props N1's set gets inside the town. */
const dcPropsOf = (p: Partial<TownSliceSceneProps>): DatacenterSliceSceneProps => {
  const roof = p.dc?.roof ?? 'towers';
  return {
    durationInFrames: p.durationInFrames ?? 1,
    mood: p.mood ?? 'day',
    startFrame: p.startFrame ?? 0,
    roof,
    // the town's DC plume reads a little stronger (it's seen from further back): × 1.6, capped at 2
    plume:
      p.dc?.plume === undefined
        ? roof === 'towers' ? 1.6 : 0
        : typeof p.dc.plume === 'number'
          ? Math.min(2, p.dc.plume * 1.6)
          : p.dc.plume.map((k) => ({at: k.at, v: Math.min(2, (k.v ?? k.value ?? 0) * 1.6)})),
    fans: p.dc?.fans,
    tokensAt: p.dc?.tokensAt,
    warmAir: roof === 'dry' ? {from: -60} : undefined,
    waterMeter: p.waterMeter,
    technician: null,
    lineGlintAt: p.lineGlintAt,
    fanFrom: p.fanFrom,
    fanBFrom: p.fanBFrom,
    waterFrom: p.waterFrom,
  };
};

/** What a town scene hands the next on a `continue`: the DC's fans' and meter's turns. */
export const townCarry = (p: Partial<TownSliceSceneProps>, durationInFrames: number, fps: number): Record<string, unknown> => {
  const c = dcCarry(dcPropsOf(p), durationInFrames, fps);
  return {fanFrom: c.fanFrom, fanBFrom: c.fanBFrom, waterFrom: c.waterFrom};
};

// ---------------------------------------------------------------------------------------------------- YOU

const lookTarget = (): V3 => [DC.towerA[0], DC.towerA[1] + TOWER_DC.h + 7, DC.towerA[2]];

/** YOU's place, heading and walk at t. */
const youState = (p: Partial<TownSliceSceneProps>, L: Layout, t: number) => {
  const y = p.you;
  if (y === null) return null;
  const place = y?.place ?? (p.kitchen ? 'kitchen' : 'fence');
  if (place === 'kitchen') {
    const k = L.kitchenAt;
    return {pos: [k[0] + KITCHEN.you[0], KITCHEN.you[1], k[2] + KITCHEN.you[2]] as V3, rot: -Math.PI / 2, walk: {phase: 0, amount: 0}, place};
  }
  if (!y) return null;
  const end: V3 = [L.fenceX - 1.4, 0.04, 1.5];
  const start: V3 = [L.fenceX - 9, 0.04, 1.9];
  let pos = end;
  let rot = Math.PI / 2;
  let walk = {phase: 0, amount: 0};
  if (y.walkAt !== undefined) {
    const dist = Math.hypot(end[0] - start[0], end[2] - start[2]);
    const dur = dist / 1.25;
    const u = ease(t, y.walkAt, y.walkAt + dur);
    pos = [start[0] + (end[0] - start[0]) * u, 0.04, start[2] + (end[2] - start[2]) * u];
    const moving = t > y.walkAt && t < y.walkAt + dur;
    walk = {phase: (u * dist) / 1.3, amount: moving ? Math.min(1, Math.sin(Math.PI * Math.min(1, Math.max(0, (t - y.walkAt) / dur))) * 2) : 0};
    rot = Math.PI / 2;
  }
  return {pos, rot, walk, place};
};

// ---------------------------------------------------------------------------------------------------- anchors

/**
 * A named point on screen (px): 'youSpot' (YOU's head), 'gate' (the outfall gate), 'riverPlume' (the warm plume's
 * middle), 'sampler', 'gauges', 'junction', 'plant' (the wastewater plant / Quincy's tank), 'ponds', 'house' (the
 * kitchen house), 'field', 'fence', 'dcRoof', 'plantTower', 'meter' (the DC's meter).
 */
export const townAnchorOnScreen = (
  p: Partial<TownSliceSceneProps>,
  anchor: string,
  o: {frame: number; fps: number; durationInFrames: number},
): [number, number] | undefined => {
  const cam = townCameraAt(p, o);
  const L = townLayout(p.dressing, p.stack, p.eastEnd !== false);
  const t = o.frame / o.fps;
  const r = L.river;
  const pl = trackAt(p.riverPlume, t, 0);
  const you = youState(p, L, t);
  const pts: Record<string, V3 | undefined> = {
    youSpot: you ? [you.pos[0], you.pos[1] + 1.75, you.pos[2]] : undefined,
    gate: [r[0] + RIVER.mouth[0], r[1] + RIVER.mouth[1] + 0.6, r[2]],
    riverPlume: [r[0] + RIVER.mouth[0] + 0.8 + 1.6 * pl, r[1] + RIVER.level, r[2] - 0.2 - 6 * pl],
    sampler: [r[0] + RIVER.sampler[0], r[1] + 1.1, r[2] + RIVER.sampler[2]],
    gauges: [r[0] + RIVER.gauges[0], r[1] + 1.5, r[2] + RIVER.gauges[2]],
    junction: [L.junctionX, -2.1, ZF],
    plant: L.quincy ? [L.limeX, 9.5, ZF - 1] : [(L.aeration[0] + L.clarifierX) / 2, 4.5, ZF - 2],
    ponds: [L.ponds[0] + PONDS.width / 2, L.ponds[1] - 0.5, L.ponds[2] - 3],
    house: [L.kitchenAt[0], 4.5, L.kitchenAt[2] - 2],
    field: [-64, 2, -40],
    fence: [L.fenceX, 2.2, 0.5],
    dcRoof: [DC.towerA[0], DC.towerA[1] + TOWER_DC.h + 1.2, DC.towerA[2]],
    plantTower: [L.plant[0], L.plant[1] + PLANT.top + 2, L.plant[2] - 2],
    meter: [DC.meter[0], DC.meter[1] + 0.35, DC.meter[2]],
  };
  const v = pts[anchor];
  return v ? projectToFrame(cam, v) : undefined;
};

// ---------------------------------------------------------------------------------------------------- the scene

/** N2, the town: the sheet around N1's data centre (see the file comment). */
export const TownSliceScene: React.FC<TownSliceSceneProps> = (propsIn) => {
  const props = useFormatProps(propsIn);
  const {durationInFrames, mood = 'day'} = props;
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const m = MOODS[mood];
  const cam = townCameraAt(props, {frame, fps, durationInFrames});
  const camD = cam.position.distanceTo(cam.look);
  const f = townFramingAt(props, frame / fps);
  // the sky: N1's plane (so a DC framing matches N1's), grown for the far framings and kept behind the look-at
  const sky = useMemo(() => new THREE.MeshBasicMaterial({map: skyTexture(mood), fog: false}), [mood]);
  sky.color.setScalar(1 / m.exposure);
  const skyBack = useMemo(() => new THREE.MeshBasicMaterial({color: raw(m.sky[2]).multiplyScalar(1 / m.exposure), fog: false}), [m]);
  const s = Math.max(1, camD / 60);
  // shadows: the key's box follows the look-at, sized to the framing (stepped, so the map isn't rebuilt every frame)
  const extent = 17 * Math.pow(1.4, Math.max(0, Math.round(Math.log(Math.max(1, camD / 48)) / Math.log(1.4))));
  const lookQ: V3 = [Math.round(cam.look.x / 4) * 4, Math.round(cam.look.y / 4) * 4, Math.round(cam.look.z / 4) * 4];
  return (
    <AbsoluteFill>
      <SectionStage mood={mood} post={{focusY: 0.5}} ao far={Math.max(400, camD * 3)}>
        <SectionCamera from={f} to={f} durationInFrames={durationInFrames} drift={props.drift ?? 0.08} clockOffset={(props.startFrame ?? 0) / fps} fitClip farMin={Math.max(300, camD * 3)} />
        <SectionLights mood={mood} target={camD < 60 ? [cam.look.x, cam.look.y, cam.look.z] : lookQ} lamp={0} extent={extent} figureSpot={false} />
        <mesh position={[f.look[0], -38 + (52 * s) / 2, -60]} material={sky}>
          <planeGeometry args={[400 * s, 52 * s]} />
        </mesh>
        <mesh position={[f.look[0], 0, -62]} material={skyBack}>
          <planeGeometry args={[800 * s, 600 * s]} />
        </mesh>
        <DcSet p={dcPropsOf(props)} camD={camD} />
        <TownSet p={props} camD={camD} />
      </SectionStage>
    </AbsoluteFill>
  );
};

const asList = (v: number | number[] | undefined) => (v === undefined ? [] : Array.isArray(v) ? v : [v]);

/** The town around the DC (inside the canvas). */
const TownSet: React.FC<{p: TownSliceSceneProps; camD: number}> = ({p, camD}) => {
  const {mood = 'day', startFrame = 0} = p;
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const clock = startFrame / fps + t;
  const dc = useDcMats(mood);
  const mats = useTownMats(mood);
  const L = townLayout(p.dressing, p.stack, p.eastEnd !== false);
  const ink = INK * Math.max(0.2, Math.min(40, camD / 12.75));
  const coreR = 0.0225 * Math.max(0.6, Math.min(30, camD / 18));
  const nodeR = coreR * NODE_SCALE;
  const rects: Rect[] = [];
  const C = dc.cut;

  // ---- ground
  const ground: React.ReactNode[] = [];
  const G = GROUND_Y;
  if (!L.quincy) ground.push(cutBlock('gPlant', [L.plant[0] - 22, L.plant[1] + G, -24], [L.plant[0] + 36, L.plant[1], ZF], '+z-x' + (L.stack ? '+x' : ''), dc.earth, C, rects, mats.grass));
  if (L.quincy || L.stack) ground.push(cutBlock('gField', [-110, G, -24], [-92, 0, ZF], '+z-x', dc.earth, C, rects, mats.field));
  // the house field's ground runs deep only when the field is used (shallow, it stays out of the DC's roof framings)
  ground.push(cutBlock('gTown', [-92, G, p.houseField !== undefined ? -64 : -30], [-36, 0, ZF], '+z', dc.earth, C, rects, mats.grass));
  ground.push(cutBlock('gStrip', [-36, G, DC.groundZ0], [DC.groundX0, 0, ZF], '+z', dc.earth, C, rects, mats.grass));
  ground.push(cutBlock('gFill', [DC.groundX0, G, DC.groundZ0], [DC.groundX1, DC.groundY, ZF], '+z', dc.earth, C, rects));
  // right of the DC: up to the river (row) or the sheet's end (stack); Quincy's ponds split it in the row
  const rightEnd = !L.east ? L.junctionX + 4 : L.stack ? L.rightEnd : L.river[0] + RIVER.left;
  const gaps: [number, number][] = L.east && L.quincy && !L.stack ? [[L.ponds[0], L.ponds[0] + PONDS.width]] : [];
  let x0 = DC.groundX1;
  for (const [a, b] of [...gaps, [rightEnd, rightEnd] as [number, number]]) {
    if (a - x0 > 0.01) ground.push(cutBlock(`gR${x0}`, [x0, G, -14], [a, 0, ZF], '+z' + (a === rightEnd && (L.stack || !L.east) ? '+x' : ''), dc.earth, C, rects, mats.grass));
    x0 = b;
  }
  // the street along the town (asphalt on top, at the cut)
  ground.push(cutBlock('street', [-92, 0, -3.5], [DC.groundX0, 0.04, ZF], '+z', mats.asphalt, C, rects));

  // ---- under the street: the water main, the sewer main and the house laterals, the manhole
  const mainOn = p.mainFlow ? ease(t, p.mainFlow.from, p.mainFlow.from + 0.5) : 1;
  const mainDist = clock * 1.1;
  const sewerX0 = -80;
  const sewerX1 = !L.east ? rightEnd - 0.05 : L.quincy ? L.limeX - 4.85 : L.aeration[0];
  const sewerAng = Math.atan2(sewerY(sewerX1) - sewerY(sewerX0), sewerX1 - sewerX0);
  const sewerLen = Math.hypot(sewerX1 - sewerX0, sewerY(sewerX1) - sewerY(sewerX0));
  const sewerOn = p.sewer ? ease(t, p.sewer.from, p.sewer.from + 0.5) : 0.6;
  const laterals = L.houses.map((hx) => hx + 2.2);
  const lateralFlows: React.ReactNode[] = [];
  if (p.sewer) {
    const every = p.sewer.every ?? 1.5;
    laterals.forEach((lx, i) => {
      const path: V3[] = [
        [lx, -0.3, ZF + 0.12],
        [lx, sewerY(lx), ZF + 0.12],
        [sewerX1, sewerY(sewerX1), ZF + 0.12],
      ];
      const travel = 9;
      const from = p.sewer!.from + i * 0.45;
      const n0 = Math.floor((t - from) / every);
      for (let n = Math.max(0, n0 - 7); n <= n0; n++) {
        const age = t - (from + n * every);
        if (age < 0 || age > travel) continue;
        lateralFlows.push(
          <mesh key={`lf${i}-${n}`} material={dc.dotWhite} position={pointAlong(path, age / travel)} scale={0.2 * Math.min(1, camD / 30)}>
            <sphereGeometry args={[1, 10, 8]} />
          </mesh>,
        );
      }
    });
  }

  // ---- the drain (orange)
  const drainOn =
    p.drain !== false &&
    (p.drain !== undefined || p.sewer !== undefined || p.gate !== undefined || p.fork !== undefined || p.riverPlume !== undefined || (L.quincy && p.quincy?.blowdownAt !== undefined)) &&
    (p.dc?.roof ?? 'towers') === 'towers';
  const drainPts = townDrain(L);
  const qb = p.quincy?.blowdownAt;
  const drainDraw = L.quincy ? (qb === undefined ? 1 : ease(t, qb, qb + 2)) : 1;
  const pulses: V3[] = [];
  const pulseTravel = L.quincy ? 4 : 6;
  if (drainOn && p.drain) {
    for (const a of asList(p.drain.pulseAt)) {
      const age = t - a;
      if (age >= 0 && age < pulseTravel) pulses.push(pointAlong(drainPts, age / pulseTravel));
    }
    const every = p.drain.pulseEvery;
    if (every) {
      const n0 = Math.floor(t / every);
      for (let n = n0 - Math.ceil(pulseTravel / every); n <= n0; n++) {
        const age = t - n * every;
        if (age >= 0 && age < pulseTravel) pulses.push(pointAlong(drainPts, age / pulseTravel));
      }
    }
  }
  if (L.quincy && qb !== undefined && drainOn && p.quincy?.pulseEvery) {
    const every = p.quincy.pulseEvery;
    const n0 = Math.floor((t - qb - 2) / every);
    for (let n = Math.max(0, n0 - 4); n <= n0; n++) {
      const age = t - (qb + 2 + n * every);
      if (age >= 0 && age < pulseTravel) pulses.push(pointAlong(drainPts, age / pulseTravel));
    }
  }
  // the fork: both ways at once
  const outfall = outfallPipe(L);
  const forkPulse: V3[] = [];
  let forkNode = 0;
  if (p.fork) {
    const age = t - p.fork.at;
    forkNode = age > 0 ? Math.max(0, 1 - Math.abs(age - 0.3) / 0.6) : 0;
    const jIdx = dcDrain().length;
    const sewerLeg = drainPts.slice(jIdx);
    for (const leg of [sewerLeg, outfall]) {
      for (let r = 0; r < 3; r++) {
        const a = age - r * 1.1;
        if (a >= 0 && a < 2.4) forkPulse.push(pointAlong(leg, a / 2.4));
      }
    }
  }
  const stub = p.fork?.stubAt !== undefined ? ease(t, p.fork.stubAt, p.fork.stubAt + 1.0) : 0;
  const stubPts: V3[] = [
    [L.junctionX, -2.1, ZF + 0.12],
    [L.junctionX + 1.2, -2.1, ZF + 0.12],
    [L.junctionX + 1.2, 1.6, ZF + 0.12],
  ];

  // ---- the river
  const gateOpen = Math.max(0, Math.min(1, trackAt(p.gate?.open, t, 0)));
  const backupAt = p.gate?.backupAt;
  const backupDraw = backupAt === undefined ? 0 : ease(t, backupAt, backupAt + 1.6);
  const backup = backupAt === undefined ? 0 : ease(t, backupAt + 1.4, backupAt + 2.2) * (1 - gateOpen);
  const sample = p.sampler ? ease(t, p.sampler.fillAt, p.sampler.fillAt + 1.5) : 0;
  const needles = [0, 1, 2].map((i) => {
    const at = p.gauges?.settleAt[i];
    const wob = 0.03 * Math.sin(clock * 3.1 + i * 2);
    return (at === undefined ? 0.82 : 0.82 + (0.42 - 0.82) * ease(t, at, at + 0.7)) + wob;
  });
  const riverPlume = Math.max(0, trackAt(p.riverPlume, t, 0));
  const sand = p.sandDrift ? ease(t, p.sandDrift.from, p.sandDrift.from + 0.6) : 0.4;

  // ---- Quincy
  const q = p.quincy ?? {};
  const lime = q.limeAt === undefined ? 0.15 : ease(t, q.limeAt, q.limeAt + 0.8);
  const sludge = q.sludgeAt === undefined ? 0.3 : 0.3 + 0.7 * ease(t, q.sludgeAt, q.sludgeAt + 3);
  const rakeTurns = (q.rakeFrom === undefined ? clock : Math.max(0, t - q.rakeFrom)) * 0.06;
  const retPts = quincyReturn(L);
  const retOut = q.returnOutAt === undefined ? 1 : 1 - ease(t, q.returnOutAt, q.returnOutAt + 0.6);
  const retDraw = q.returnDrawAt === undefined ? 0 : ease(t, q.returnDrawAt, q.returnDrawAt + 2.4);
  const retDots: V3[] = [];
  if (retDraw >= 1 && q.returnDrawAt !== undefined) {
    const from = Math.max(q.returnDrawAt + 2.4, q.pumpFrom ?? -999);
    const every = q.pulseEvery ?? 1.4;
    const travel = 3.0;
    const n0 = Math.floor((t - from) / every);
    for (let n = Math.max(0, n0 - 3); n <= n0; n++) {
      const age = t - (from + n * every);
      if (age >= 0 && age < travel) retDots.push(pointAlong(retPts, age / travel));
    }
  }
  const pond = q.pondFrom === undefined ? {level: 0.75, crust: 0.15} : {level: 0.85 - 0.5 * ease(t, q.pondFrom, q.pondFrom + 6), crust: 0.15 + 0.85 * ease(t, q.pondFrom + 0.8, q.pondFrom + 6)};

  // ---- the plant and the drops
  const plantPlume = Math.max(0, trackAt(p.plant?.plume, t, 1));
  const pathAt = p.plant?.pathAt;
  const pathDraw = pathAt === undefined ? 0 : ease(t, pathAt, pathAt + 2);
  const pPath = plantPathWorld(L);
  const drops: React.ReactNode[] = [];
  const dp = p.drops;
  if (dp) {
    const dropR = coreR * 2.4;
    if (dp.dcAt !== undefined) {
      const k = ease(t, dp.dcAt, dp.dcAt + 0.4);
      if (k > 0.01) drops.push(<GlowNode key="dcd" at={[DC.towerA[0] - 2.5, DC.towerA[1] + TOWER_DC.h + 3.5, DC.towerA[2]]} radius={dropR} glow={k} />);
    }
    if (dp.plantAt !== undefined) {
      const n = dp.n ?? 12;
      const every = dp.every ?? 0.3;
      for (let i = 0; i < n; i++) {
        const a = dp.plantAt + i * every;
        const k = ease(t, a, a + 0.3);
        if (k < 0.01) continue;
        const col = i % 4;
        const row = Math.floor(i / 4);
        const rise = dp.rise ? ease(t, a + 0.5, a + 2.4) * 14 : 0;
        const at: V3 = [L.plant[0] - 7.5 + col * 5, L.plant[1] + PLANT.top + 5 + row * 4.5 + rise, L.plant[2] - 2];
        drops.push(<GlowNode key={`pd${i}`} at={at} radius={dropR} glow={k * (dp.rise ? 1 - ease(t, a + 2.0, a + 2.6) : 1)} />);
      }
    }
  }
  const glints = asList(p.lineGlintAt);
  const glint = glints.reduce((g, a) => Math.max(g, ease(t, a, a + 0.15) * (1 - ease(t, a + 0.3, a + 0.9))), 0);

  // ---- houses, windows, the field
  const winEvery = p.windows?.every ?? 0.3;
  const lit = (i: number) => (p.windows ? t >= p.windows.at + i * winEvery : false);
  const field = Math.max(0, Math.min(1, trackAt(p.houseField, t, 0)));
  const stream = p.kitchen?.tapAt !== undefined ? ease(t, p.kitchen.tapAt, p.kitchen.tapAt + 0.4) : 0;

  // ---- people
  const you = youState(p, L, t);
  const youShown = you && (p.you?.at === undefined || t >= p.you.at);
  const target = lookTarget();
  const lineTarget: V3 = [L.plant[0], L.plant[1] + 20, L.polesZ];
  const youGestures = [] as {pose: 'look-up' | 'turn-to' | 'glance-down'; at: number; target?: V3}[];
  if (you?.place === 'fence') {
    if (p.you?.lookAt !== undefined) youGestures.push({pose: 'look-up', at: p.you.lookAt, target});
    if (p.you?.turnAt !== undefined) youGestures.push({pose: 'turn-to', at: p.you.turnAt, target: lineTarget});
  } else if (you) youGestures.push({pose: 'glance-down', at: -1});
  const neighbours: {pos: V3; rot: number; look?: typeof EXTRA_B; delay: number}[] = [
    {pos: [L.fenceX - 0.9, 0.04, 0.4], rot: Math.PI / 2 - 0.2, delay: 0},
    {pos: [L.fenceX - 1.1, 0.04, -1.3], rot: Math.PI / 2 + 0.15, look: EXTRA_B, delay: 0.35},
    {pos: [L.fenceX - 2.3, 0.04, -0.4], rot: Math.PI / 2, delay: 0.7},
  ];

  const wires = lineWires(L);
  const poleTop = 11.0;

  return (
    <group>
      {ground}
      <CutOutline rects={rects} thickness={ink} />

      {/* the water main (neutral, flowing toward the DC) with the water tower's riser */}
      <CutPipeRun x0={-84} x1={DC.groundX0} y={DC.serviceY} zCut={ZF} r={0.11} wall={0.016} flow={mainDist} flowOn={mainOn} mats={dc} ink={ink * 0.8} mood={mood} seed="main" />
      <PipeV x={-84} y0={DC.serviceY} y1={0} r={0.11} mats={dc} ink={ink} />
      {/* the sewer main, sloping down to the plant */}
      <group position={[sewerX0, sewerY(sewerX0), 0]} rotation={[0, 0, sewerAng]}>
        <CutPipeRun x0={0} x1={sewerLen} y={0} zCut={ZF} r={0.24} wall={0.025} flow={clock * 0.8} flowOn={sewerOn} mats={dc} ink={ink * 0.8} mood={mood} seed="sewer" />
      </group>
      {laterals.map((lx) => (
        <PipeV key={lx} x={lx} y0={sewerY(lx) + 0.2} y1={-0.2} r={0.08} mats={dc} ink={ink} />
      ))}
      {lateralFlows}
      {/* the DC's lateral on to the junction, the manhole down to the sewer */}
      <CutPipeRun x0={DC.groundX1 - 0.02} x1={L.junctionX + 0.4} y={-2.1} zCut={ZF} r={0.12} wall={0.016} mats={dc} ink={ink * 0.8} mood={mood} seed="lat2" />
      <PipeV x={L.junctionX} y0={sewerY(L.junctionX) + 0.22} y1={0.05} r={0.45} mats={dc} ink={ink} dark />
      {/* the outfall (second) pipe to the river gate */}
      {L.east && (!L.quincy || L.stack) ? <OutfallRun pts={outfall} mats={dc} ink={ink} /> : null}

      {drainOn ? <GlowPolyline points={drainPts} draw={drainDraw} radius={coreR} /> : null}
      {drainOn ? <GlowNode at={drainPts[drainPts.length - 1]} radius={nodeR} glow={drainDraw >= 1 ? 1 : 0} /> : null}
      {pulses.map((q2, i) => (
        <GlowNode key={`dp${i}`} at={q2} radius={coreR * 1.9} dot />
      ))}
      {forkPulse.map((q2, i) => (
        <GlowNode key={`fp${i}`} at={q2} radius={coreR * 1.9} dot />
      ))}
      {forkNode > 0 ? <GlowNode at={[L.junctionX, -2.1, ZF + 0.12]} radius={nodeR} swell={1 + forkNode} /> : null}
      {backupDraw > 0 ? <GlowPolyline points={outfall} draw={backupDraw} radius={coreR} /> : null}
      {stub > 0 ? <GlowPolyline points={stubPts} draw={stub} radius={coreR} /> : null}
      {stub >= 1 ? <GlowNode at={stubPts[2]} radius={nodeR} /> : null}

      {/* the town */}
      <WaterTower at={L.waterTower} mats={mats} dc={dc} />
      <TownHouse at={[L.houses[0], 0, -10]} siding={mats.sidings[1]} mats={mats} windows={[lit(3) ? mats.winLit : mats.win, lit(4) ? mats.winLit : mats.win]} />
      <KitchenHouse at={L.kitchenAt} mats={mats} dc={dc} siding={mats.sidings[0]} stream={stream} lit={lit(2)} ink={ink} />
      <TownHouse at={[L.houses[2], 0, -10]} siding={mats.sidings[2]} mats={mats} windows={[lit(0) ? mats.winLit : mats.win, lit(1) ? mats.winLit : mats.win]} />
      <HouseField x0={-90} x1={-38} z0={-62} z1={-22} fill={field} mats={mats} />
      {/* trees along the street (simple, neutral greens) */}
      {[-88, -78, -63, -47.5, -30, -25].map((x, i) => (
        <Tree key={x} at={[x, 0, -4.6 - (i % 2) * 0.8]} mats={mats} dc={dc} />
      ))}
      {!L.quincy ? <Fence x={L.fenceX} z0={DC.groundZ0 + 0.2} z1={ZF - 0.2} mats={mats} dc={dc} /> : null}
      {!L.quincy
        ? neighbours.map((n, i) => (
            <Figure
              key={i}
              who="extra"
              mood={mood}
              position={n.pos}
              rotationY={n.rot}
              seed={`town-n${i}`}
              phone={false}
              stance="stand"
              look={n.look}
              hands={[
                [-0.24, 0.84, 0.04],
                [0.24, 0.84, 0.04],
              ]}
              gestures={p.fence?.lookAt !== undefined ? [{pose: 'look-up', at: p.fence.lookAt + n.delay, target}] : []}
              clockOffset={startFrame / fps}
            />
          ))
        : null}
      {youShown && you ? (
        <Figure
          who="you"
          mood={mood}
          position={you.pos}
          rotationY={you.rot}
          seed="town-you"
          phone={false}
          stance="stand"
          walk={you.walk}
          hands={
            you.place === 'kitchen'
              ? [
                  [-0.2, 0.92, 0.36],
                  [0.2 + 0.0 * stream, 0.92 + 0.12 * stream, 0.46],
                ]
              : [
                  [-0.24, 0.84, 0.04],
                  [0.24, 0.84, 0.04],
                ]
          }
          gestures={youGestures}
          clockOffset={startFrame / fps}
        />
      ) : null}

      {/* the line: town poles continuing the DC's, the wires on to the plant */}
      {L.poles.map((x) => (
        <group key={x} position={[x, 0, L.polesZ]}>
          <PowerPole mats={dc} h={poleTop} arms={1} glint={glint} />
        </group>
      ))}
      {!L.quincy || L.stack ? wires.map((w, i) => <Pipe key={`w${i}`} points={w} r={Math.max(0.025, camD * 0.00012)} mat={dc.wire} />) : null}

      {/* the power plant (tease) */}
      {!L.quincy ? (
        <>
          <PlantTease at={L.plant} mats={mats} dc={dc} plume={plantPlume} clock={clock} ink={ink} mood={mood} clockOffset={clock} />
          <group position={[L.plantPoleX, L.plant[1], L.polesZ]}>
            <PowerPole mats={dc} h={12.4} arms={1} glint={glint} />
          </group>
          {pathDraw > 0 ? <GlowPolyline points={pPath} draw={pathDraw} radius={coreR} /> : null}
          {pathDraw > 0 ? <GlowNode at={pPath[0]} radius={nodeR} /> : null}
        </>
      ) : null}
      {drops}

      {/* the wastewater plant (main) */}
      {L.east && !L.quincy ? (
        <>
          <group position={[0, 4, 0]}>
            <AerationBasin x0={L.aeration[0]} x1={L.aeration[1]} z0={-9} zCut={ZF} depth={4} mats={mats} dc={dc} clock={clock} ink={ink} />
          </group>
          <group position={[0, 3.35, 0]}>
            <Clarifier cx={L.clarifierX} zCut={ZF} depth={3} turns={clock * 0.03} mats={mats} dc={dc} ink={ink} />
          </group>
          {/* the plant's effluent pipe on to the river */}
          {!L.stack ? <Pipe points={[[L.clarifierX, 0.25, ZF - 7.2], [L.clarifierX, 0.25, -12], [L.river[0] + 0.8, 0.25, -12]]} r={0.2} mat={dc.pipeCold} /> : null}
        </>
      ) : null}

      {/* Quincy: the lime tank, the ponds, the return pipe */}
      {L.east && L.quincy ? (
        <>
          <LimeTank cx={L.limeX} zCut={ZF} mats={mats} dc={dc} clock={clock} lime={lime} sludge={sludge} turns={rakeTurns} ink={ink} />
          <BrinePonds at={L.ponds} mats={mats} dc={dc} level={pond.level} crust={pond.crust} ink={ink} />
          <Pipe points={[[L.limeX + 4.6, 1.0, ZF - 1], [L.ponds[0] + 2, L.ponds[1] + 1.0, ZF - 1], [L.ponds[0] + 2, L.ponds[1] + 0.1, ZF - 1]]} r={0.15} mat={dc.pipeDrain} />
          <Pipe points={retPts} r={0.14} mat={dc.pipeWarm} />
          {retDraw > 0 && retOut > 0.003 ? <GlowPolyline points={retPts.map((v) => [v[0], v[1], v[2] + 0.16] as V3)} draw={retDraw} radius={coreR} glow={retOut} /> : null}
          {retDraw >= 1 && retOut > 0.003 ? <GlowNode at={[retPts[retPts.length - 1][0], retPts[retPts.length - 1][1], retPts[retPts.length - 1][2] + 0.16]} radius={nodeR} glow={retOut} /> : null}
          {retDots.map((v, i) => (
            <GlowNode key={`rd${i}`} at={[v[0], v[1], v[2] + 0.16]} radius={coreR * 1.9} glow={retOut} dot />
          ))}
        </>
      ) : null}

      {/* the river (same in both dressings) */}
      {L.east ? <RiverSection at={L.river} mats={mats} dc={dc} clock={clock} ink={ink} gate={gateOpen} sample={sample} needles={needles} plume={riverPlume} sand={sand} backup={backup} /> : null}
    </group>
  );
};

/** A vertical pipe cut lengthwise on the cut face (a riser, a lateral, the manhole's shaft when `dark`). */
const PipeV: React.FC<{x: number; y0: number; y1: number; r: number; mats: DcMats; ink: number; dark?: boolean}> = ({x, y0, y1, r, mats, ink, dark}) => (
  <group position={[x, y0, 0]} rotation={[0, 0, Math.PI / 2]}>
    <CutPipeRun x0={0} x1={y1 - y0} y={0} zCut={ZF} r={r} wall={dark ? 0.12 : r * 0.15} mats={mats} ink={ink * 0.8} seed={`pv${x}`} />
  </group>
);

/** The outfall pipe (straight runs along x or y, cut lengthwise on the cut face). */
const OutfallRun: React.FC<{pts: V3[]; mats: DcMats; ink: number}> = ({pts, mats, ink}) => (
  <group>
    {pts.slice(0, -1).map((a, i) => {
      const b = pts[i + 1];
      if (Math.abs(a[1] - b[1]) < 1e-3) {
        const [x0, x1] = a[0] < b[0] ? [a[0], b[0]] : [b[0], a[0]];
        return <CutPipeRun key={i} x0={x0 - 0.1} x1={x1 + 0.1} y={a[1]} zCut={ZF} r={0.12} wall={0.016} mats={mats} ink={ink * 0.8} seed={`of${i}`} />;
      }
      if (Math.abs(a[0] - b[0]) < 1e-3) {
        const [y0, y1] = a[1] < b[1] ? [a[1], b[1]] : [b[1], a[1]];
        return <PipeV key={i} x={a[0]} y0={y0 - 0.1} y1={y1 + 0.1} r={0.12} mats={mats} ink={ink} />;
      }
      return <Pipe key={i} points={[[a[0], a[1], ZF - 0.1], [b[0], b[1], ZF - 0.1]]} r={0.12} mat={mats.pipeDrain} />;
    })}
  </group>
);

/** A simple street tree: a trunk and two stacked crowns (neutral greens). */
const Tree: React.FC<{at: V3; mats: TownMats; dc: DcMats}> = ({at, mats, dc}) => (
  <group position={at}>
    <mesh material={dc.wood} position={[0, 1.4, 0]} castShadow>
      <cylinderGeometry args={[0.14, 0.2, 2.8, 8]} />
    </mesh>
    <mesh material={mats.grassDark} position={[0, 3.6, 0]} castShadow>
      <icosahedronGeometry args={[1.7, 0]} />
    </mesh>
    <mesh material={mats.grass} position={[0.4, 4.6, 0.2]} castShadow>
      <icosahedronGeometry args={[1.1, 0]} />
    </mesh>
  </group>
);
