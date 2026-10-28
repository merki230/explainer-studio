import React, {useMemo} from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import * as THREE from 'three';
import {CHARGE, MOODS, type Mood} from '../theme';
import type {ShellProfile} from '../three/real/CarShell';
import {ChargeCable, HvRun, plugTail, type CableSlugs, type PlugPose} from '../three/real/ChargeCable';
import {ChargeDriverFigure, driverLook} from '../three/real/ChargeDriver';
import {
  autoDriver,
  carDriveAt,
  carWheelRevs,
  CLOCK_AT,
  driverGeo,
  driverPoseAt,
  driverTimeline,
  WHEEL_R,
  type ChargeArrive,
  type ChargeDriver,
  type ChargeLeave,
  type DriverPose,
  type DriverTimeline,
} from '../three/real/chargeMotion';
import {
  BAY,
  CABINET,
  Canopy,
  ChargeBay,
  ChargeHorizon,
  CHARGER_AT,
  ChargerCabinet,
  DriftingClouds,
  ISLAND_H,
  StationClock,
} from '../three/real/ChargeSite';
import {GhostCar, ghostRoof} from '../three/real/GhostCar';
import {chargePortAt} from '../three/real/RealCar';
import {layoutOf, SlicedCar, type SlicedCarOptions} from '../three/real/SlicedCar';
import {capRevs} from '../three/real/wheelMotion';
import {projectToFrame, SECTION_ANGLE, SectionCamera, sectionCameraAt, type Framing} from '../three/section/SectionCamera';
import {SectionLights, SectionStage} from '../three/section/SectionStage';
import {skyTexture} from '../three/section/textures';
import {ease, framingAtKeys, keyedValue, type CameraKey, type Keyed} from './keyframes';

/*
 * C / U, the charging station as a twin section (No. 010). Two charging bays drawn one above the other like two
 * sections on one sheet, sky between and around them. Each bay is cut lengthwise (`ChargeBay`): concrete (China)
 * or asphalt (the US), its lines, wheel stops, the charger on its island (`ChargerCabinet`), a curb past it, and a
 * canopy over it (China by default). A cut `SlicedCar` faces −x in each bay, its near rear quarter drawn whole with
 * the charging port. The charger's cable (`ChargeCable`) runs to the port with a cut-away run facing the camera;
 * the car's HV lead (`HvRun`) runs on from the port to the pack. The system (orange): the current (arrows, or bold
 * racing pulses; one ≈ 250 A, 🎭), the heat in the copper and the cells (∝ amps², breathing), the charge going into
 * the modules (levels, or one level sweeping the pack with a bright front).
 *
 * Draft 2 (the screen tells its own story): cars reverse in and drive out (`arrive`, `leave`), cycle through a bay
 * (`visits`, `cycle`), and a grey extra drives each, gets out, plugs in, leans, sits on the curb with the phone,
 * unplugs and gets back in (`driver`). The current flows only while the plug is latched. A time-lapse
 * (`timelapse`) swings the sun, drifts the clouds and spins the station clock.
 *
 * World: x along the bays (the cars' fronts toward −x, parked centres at x 0), y up, z toward the camera; the
 * bottom bay's surface at y 0, the top's at `laneGap`. Times are seconds into the scene (any key may lie outside
 * it); the charge clock (`clock`, minutes) turns scene time into charging time (🎭 compressed).
 */

type Which = 'top' | 'bottom';
const WHICH: Which[] = ['bottom', 'top'];
type V3 = [number, number, number];

export type ChargeFraming = 'twin' | 'cables' | 'teslaCharge' | 'byd' | 'wide' | 'emptyBay' | 'usCharger' | 'stack' | 'cableClose';

/** A state-of-charge curve: percent against charging minutes (piecewise linear). */
export type SocCurve = {at: number; value: number}[];
/**
 * The default curves (🎭 illustrative shapes, from published tests): 'byd' steep, 10 → 70% by 5 min, then
 * slowing; 'tesla' fast to ≈ 50% at 12 min, then slower, 80% at 30 min.
 */
export const SOC_CURVES: Record<'byd' | 'tesla', SocCurve> = {
  byd: [
    {at: 0, value: 10},
    {at: 1, value: 23},
    {at: 2, value: 35.5},
    {at: 3, value: 47},
    {at: 4, value: 58.5},
    {at: 5, value: 70},
    {at: 6, value: 76},
    {at: 8, value: 84},
    {at: 12, value: 92},
    {at: 20, value: 97},
  ],
  tesla: [
    {at: 0, value: 10},
    {at: 3, value: 21},
    {at: 6, value: 32},
    {at: 9, value: 42},
    {at: 12, value: 50},
    {at: 15, value: 57},
    {at: 20, value: 67},
    {at: 25, value: 74.5},
    {at: 30, value: 80},
    {at: 40, value: 88},
    {at: 60, value: 95},
  ],
};

/**
 * One car's stay in a bay (draft 2): it reverses in (`arrive`), is plugged and unplugged (by its `driver`, or at
 * `plug` / `unplug` with no one drawn), charges on its own session, and drives out (`leave`).
 */
export type ChargeVisit = {
  /** `SlicedCar` options over the bay's car (same defaults as `ChargeBaySpec.car`). */
  car?: Partial<SlicedCarOptions>;
  /** Reversing in to a stop at `at` (see `ChargeArrive`). Omit: parked from the start. */
  arrive?: ChargeArrive;
  /** Driving out forward from `at` (see `ChargeLeave`). Omit: stays. */
  leave?: ChargeLeave;
  /**
   * The driver (see `ChargeDriver`): their beats plug and unplug the car. 'auto': a quick driver (out, plug in by
   * `plug`, unplug at `unplug`, back in before `leave.at`, sped up to fit). false / omitted: no one gets out.
   */
  driver?: ChargeDriver | 'auto' | false;
  /** The latch (s) when there's no driver keying it (the plug simply in the port from then); null: never. */
  plug?: number | null;
  /** The unlatch (s), likewise. */
  unplug?: number | null;
  /** The auto driver's look ('a' or 'b'). Default 'a'. */
  look?: 'a' | 'b';
  /** The state of charge curve (default the bay's). */
  soc?: 'byd' | 'tesla' | SocCurve;
  /** Where its session stops (%; default the bay's). */
  socMax?: number;
  /**
   * How the charge follows time: 'clock' (default: the curve on the charge clock from when current first flows)
   * or 'span' (the curve stretched to reach `socMax` just before the unplug: a cycling car always fills).
   */
  fill?: 'clock' | 'span';
};

/** One bay of the station. */
export type ChargeBaySpec = {
  /**
   * The car (any `SlicedCar` option overrides the bay's default), or false: the bay empty, the cable in its
   * holster. Defaults: top `{variant: 'ev', shape: 'sedan', paint: CHARGE.bydPaint, driver: 'extra',
   * wheelsWhole: true}` (China; empty in the US), bottom the same with `shape: 'crossover'`,
   * `paint: CHARGE.teslaPaint`. Wheels forward; the foot on the floor, the cluster at 0.
   */
  car?: Partial<SlicedCarOptions> | false;
  /** State of charge (%) against the charge clock (minutes): a curve's name or keys. Default top 'byd', bottom 'tesla'. */
  soc?: 'byd' | 'tesla' | SocCurve;
  /** Where the session stops (%): the charge holds there and, with `autoStop`, the current is cut. Default top 70, bottom 80. */
  socMax?: number;
  /**
   * The current (A) against scene time, a constant or keys (eased cubic). Default 0 (the contactor open). With a
   * driver or `plug`, it flows only while the plug is latched (ramping in 0.1–0.4 s after the latch, out before
   * the unplug): key a constant and the charger starts on the latch, or key it to start later.
   */
  amps?: Keyed;
  /** Cut the current over 0.4 s once the charge reaches `socMax` (the contactor opens). Default true. */
  autoStop?: boolean;
  /** Amps per arrow or pulse (🎭). Default 250. */
  ampsPerArrow?: number;
  /** The conductors' glow 0 → 1 (keys). Default: ∝ amps² (`heatRef` = 1), lagging ≈ 0.6 s. */
  heat?: Keyed;
  /** The amps at which the heat glow is full. Default 2,500. */
  heatRef?: number;
  /** How far the cable's soft heat glow runs out from the cut-away, 0 → 1. Default 1. */
  spread?: Keyed;
  /** The cells' glow 0 → 1 (keys). Default: from the cable's glow past a third of it, 0.4 s later. */
  packHeat?: Keyed;
  /** The coolant's speed (m/s, keys). Default: 0.06 + 0.22 × amps / 1,500 while current flows, else 0. */
  coolant?: Keyed;
  /** The connector: 'gbt' (China's default) or 'nacs' (the US's). */
  plug?: 'gbt' | 'nacs';
  /** The cable's cut-away run along it (0 → 1 from the charger to the connector), or null. Default [0.14, 0.8]. */
  cut?: [number, number] | null;
  // ---- draft 2
  /** The bay's car reverses in to a stop (see `ChargeArrive`). Shorthand for one visit. */
  arrive?: ChargeArrive;
  /** The bay's car drives out (see `ChargeLeave`). */
  leave?: ChargeLeave;
  /** The bay's car's driver (see `ChargeDriver`). */
  driver?: ChargeDriver | 'auto' | false;
  /** The latch / unlatch with no driver drawn (s; null: never). */
  latch?: number | null;
  unlatch?: number | null;
  /** Several cars in turn (see `ChargeVisit`); overrides `arrive` / `leave` / `driver`. */
  visits?: ChargeVisit[];
  /**
   * Cars cycling on a beat: `count` cars, the first stopping at `start`, one every `every` s; each plugged 0.25 s
   * after it stops (an auto driver, sped up), unplugged `dwell` s later, out 0.5 s after. The default dwell and
   * drive times keep one car out of view before the next comes in (one lane: they can't pass). Their cells fill
   * to `socMax` over the stay (`fill: 'span'`). Overrides `arrive` / `leave` / `driver`.
   */
  cycle?: {start: number; every: number; count: number; dwell?: number; from?: number; for?: number; look?: ('a' | 'b')[]};
  /** Seconds when the bay's pulses surge (brighten and swell once, 0.4 s). */
  surge?: number[];
};

/** The ghost of a car that isn't there (`GhostCar`), drawn into a bay. */
export type ChargeGhost = {
  /** Scene seconds when it starts to draw. */
  at: number;
  /** Seconds to draw (default 0.8). */
  drawFor?: number;
  /** When it fades (default never) and over how long (default 0.7 s). */
  fadeAt?: number;
  fadeFor?: number;
  /** Which bay (default 'top'). */
  bay?: Which;
  /** The car's shape (default 'sedan'). */
  shape?: ShellProfile;
};

/** The time-lapse (draft 2): story minutes past `time` against scene seconds. */
export type ChargeTimelapse = {
  /** Minutes past the story time, a constant or keys (piecewise linear). 0: exactly the story time. */
  minutes: number | {at: number; value: number}[];
  /** The sun's swing (degrees) per 30 story minutes (🎭 ≈ 2× real), capped at ±20°. Default 12. */
  sun?: number;
};

export type ChargeSliceSceneProps = {
  durationInFrames: number;
  /** Day (default) or Night. */
  mood?: Mood;
  /** 'china' (default: concrete bays, tall cabinets, GB/T-like connectors, a canopy) or 'us' (asphalt, short posts, NACS-like connectors, no canopy, the top bay empty). */
  region?: 'china' | 'us';
  /** The top bay (see `ChargeBaySpec`). */
  top?: ChargeBaySpec;
  /** The bottom bay. */
  bottom?: ChargeBaySpec;
  /** The charge clock: charging minutes against scene seconds, a constant or keys (piecewise linear, 🎭 compressed). Default 0. */
  clock?: number | {at: number; value: number}[];
  /** Height between the two bays' surfaces (m). Default 4.5. */
  laneGap?: number;
  /** The canopy over each bay. Default: true in China, false in the US. */
  canopy?: boolean;
  /** The canopy's clearance (m). Default 3.4. */
  canopyHeight?: number;
  /** China: the bays painted green (`CHARGE.bayGreen`, v0.13). Default true in China (never in the US). */
  bayPaint?: boolean;
  /** The field and tree line far behind the top bay. Default true. */
  horizon?: boolean;
  /** A dashed ink ghost of a car drawn into an (empty) bay. Default none. */
  ghost?: ChargeGhost | null;
  /** Framing preset (default 'twin'). See `chargeFramings`. */
  framing?: ChargeFraming;
  /** A custom move instead of a preset (look-at + distance at the fixed angle). */
  camera?: {from: Framing; to?: Framing};
  /** Camera keyframes: override `camera`, `push` and the glide in. */
  cameraKeys?: CameraKey[];
  /** Push toward the subject, units/s (default 0). */
  push?: number;
  /** Idle sideways drift, ± units (default 0: frame 0 and the loop frame match). */
  drift?: number;
  // ---- draft 2
  /** The current drawn as 'arrows' (default) or 'bold' racing pulses (count = amps ÷ 250, faster with more amps). */
  pulse?: 'arrows' | 'bold';
  /** The heat glow breathes (conductors and cells): its depth at full heat (± fraction, period 1.2 s). Default 0.25 with `pulse: 'bold'`, else 0. */
  breathe?: number;
  /** The charge in the modules: 'levels' (default: each module's level) or 'sweep' (one level filling the pack from the rear with a bright front). */
  cells?: 'levels' | 'sweep';
  /** The time-lapse (see `ChargeTimelapse`). Default none (the story time, still). */
  timelapse?: ChargeTimelapse | null;
  /** The story time, minutes past midnight (the station clock). Default 800 (1:20 PM). */
  time?: number;
  /** The station clock on its post: which bay it stands in (default 'bottom'), or false. */
  stationClock?: Which | false;
  /** Clouds in the sky around the sections, drifting with the time-lapse. Default true. */
  clouds?: boolean;
  /** A curb past each charger (where a driver sits). Default true. */
  curb?: boolean;
  /** The bottom bay's cut ground block depth (m): deeper fills a tall framing. Default 0.6. */
  groundDepth?: number;
  /** Where the bays' blocks begin when cars drive in (m along x). Default −40 (a drive-in lane off the frame). */
  approach?: number;
  location?: string;
  transition?: 'auto' | 'continue' | 'glide' | 'cut' | 'dissolve' | 'slide' | 'follow';
  follow?: {direction?: 'down' | 'up' | 'left' | 'right'; at?: number};
  glide?: number;
  /** Set by Explainer. */
  startFrame?: number;
  cameraFrom?: Framing;
  cameraGlide?: number;
};

// ---------------------------------------------------------------- layout

const gapOf = (p: Partial<ChargeSliceSceneProps>) => p.laneGap ?? 4.5;
const bayY = (p: Partial<ChargeSliceSceneProps>, w: Which) => (w === 'top' ? gapOf(p) : 0);
const regionOf = (p: Partial<ChargeSliceSceneProps>) => p.region ?? 'china';

/**
 * The framings at the fixed angle (world metres, set on test stills), for a lane gap. 'twin' (MW): both
 * whole cars, chargers and cables. 'stack' (MW, draft 2): both bays larger, filling the frame top to bottom
 * (the bottom bay's curb and clock in, the title block over the top bay's sky). 'cables' (M): both rear halves
 * stacked. 'teslaCharge' (C): the bottom bay's cable cut-away, port and the pack's rear. 'byd' (M): the top
 * bay's charging side. 'wide' (W): both bays and the station. 'emptyBay' (M): the top bay. 'usCharger' (M):
 * the bottom bay's charger and cable. 'cableClose' (C, `cableCloseFraming`): the bottom cable's cut-away.
 */
export const chargeFramings = (gap = 4.5): Record<Exclude<ChargeFraming, 'cableClose'>, Framing> => ({
  twin: {look: [0.55, gap / 2 + 0.75, 0.4], distance: 38},
  stack: {look: [0.9, gap / 2 + 0.2, 0.6], distance: 31},
  cables: {look: [1.8, gap / 2 - 0.15, 0.9], distance: 23},
  teslaCharge: {look: [1.95, 0.45, 0.9], distance: 8},
  byd: {look: [1.95, gap + 0.5, 0.9], distance: 9.5},
  wide: {look: [0.6, gap / 2 + 1.3, -0.3], distance: 56},
  emptyBay: {look: [0.35, gap + 0.8, 0.3], distance: 21},
  usCharger: {look: [2.3, 0.6, 0.9], distance: 9.5},
});

/**
 * The cable's cut-away, close (B9): the look point on the middle of a bay's cut-away run (with the car parked
 * and plugged), at `distance` (default 2.4 m: the run fills the frame's width; the cut faces, strands, hoses
 * and ink hold to ≈ 1.6 m).
 */
export const cableCloseFraming = (p: Partial<ChargeSliceSceneProps>, w: Which = 'bottom', distance = 2.4): Framing => {
  const {points} = routeFor(p, w, 'port', shapeOf(p, w));
  const cut = specOf(p, w).cut ?? [0.14, 0.8];
  const curve = new THREE.CatmullRomCurve3(points.map((q) => new THREE.Vector3(...q)), false, 'centripetal');
  const v = curve.getPointAt((cut[0] + cut[1]) / 2);
  return {look: [v.x, v.y, v.z], distance};
};

// ---------------------------------------------------------------- state

const lin = (keys: {at: number; value: number}[] | number | undefined, x: number, dflt: number) => {
  if (keys === undefined) return dflt;
  if (typeof keys === 'number') return keys;
  if (!keys.length) return dflt;
  const ks = [...keys].sort((a, b) => a.at - b.at);
  if (x <= ks[0].at) return ks[0].value;
  for (let i = 0; i < ks.length - 1; i++)
    if (x < ks[i + 1].at) return ks[i].value + ((ks[i + 1].value - ks[i].value) * (x - ks[i].at)) / (ks[i + 1].at - ks[i].at);
  return ks[ks.length - 1].value;
};

/** The charge clock (minutes) at scene time t. */
export const chargeClockAt = (p: Partial<ChargeSliceSceneProps>, t: number) => lin(p.clock, t, 0);
/** The time-lapse's story minutes past `time` at t (0 without one). */
export const chargeMinutesAt = (p: Partial<ChargeSliceSceneProps>, t: number) => (p.timelapse ? lin(p.timelapse.minutes, t, 0) : 0);

const specOf = (p: Partial<ChargeSliceSceneProps>, w: Which): ChargeBaySpec => p[w] ?? {};

/** The bay's default car options (or null: empty), the defaults filled in. */
const carOf = (p: Partial<ChargeSliceSceneProps>, w: Which): Partial<SlicedCarOptions> | null => {
  const s = specOf(p, w);
  if (s.car === false) return null;
  const hasVisits = !!(s.visits?.length || s.cycle);
  if (s.car === undefined && w === 'top' && regionOf(p) === 'us' && !hasVisits) return null;
  const base: Partial<SlicedCarOptions> =
    w === 'top'
      ? {variant: 'ev', shape: 'sedan', paint: CHARGE.bydPaint, driver: 'extra', wheelsWhole: true}
      : {variant: 'ev', shape: 'crossover', paint: CHARGE.teslaPaint, driver: 'extra', wheelsWhole: true};
  return {...base, ...(s.car ?? {})};
};
const shapeOf = (p: Partial<ChargeSliceSceneProps>, w: Which): ShellProfile => carOf(p, w)?.shape ?? (w === 'top' ? 'sedan' : 'crossover');

const curveOf = (s: ChargeBaySpec | ChargeVisit, w: Which): SocCurve =>
  s.soc === undefined ? SOC_CURVES[w === 'top' ? 'byd' : 'tesla'] : typeof s.soc === 'string' ? SOC_CURVES[s.soc] : s.soc;

/** One car's stay, resolved: its timeline, latches and charge session. */
type Visit = {
  car: Partial<SlicedCarOptions>;
  arrive?: ChargeArrive;
  leave?: ChargeLeave;
  driver: DriverTimeline | null;
  latched: [number, number][];
  /** Parked and plugged throughout (the draft 1 behaviour: the charge on the clock from 0). */
  compat: boolean;
  curve: SocCurve;
  socMax: number;
  fill: 'clock' | 'span';
  /** When current first flows (s), −Infinity (compat) or NaN (never). */
  s0: number;
  /** The latch's end for that session. */
  s1: number;
  /** When the charge reaches `socMax` (s), −1 (already), Infinity (never). */
  stop: number;
  look: 'a' | 'b';
  key: string;
};

type BayModel = {visits: Visit[]; drives: boolean};

const MODEL_CACHE = new Map<string, BayModel>();

/** The latch gate (0 → 1): the contactor closes 0.1–0.4 s after the latch, opens 0.35–0.05 s before the unlatch. */
const gateOf = (v: Visit, t: number) => {
  if (v.compat) return 1;
  let g = 0;
  for (const [a, b] of v.latched) g = Math.max(g, ease(t, a + 0.1, a + 0.4) * (Number.isFinite(b) ? 1 - ease(t, b - 0.35, b - 0.05) : 1));
  return g;
};

const rawAmps = (p: Partial<ChargeSliceSceneProps>, w: Which, v: Visit, t: number) => Math.max(0, keyedValue(specOf(p, w).amps, t, 0)) * gateOf(v, t);

/** A visit's state of charge (%) at t, capped at its `socMax`. */
const visitSoc = (p: Partial<ChargeSliceSceneProps>, v: Visit, t: number) => {
  if (v.compat) return Math.min(v.socMax, lin(v.curve, chargeClockAt(p, t), 10));
  const from = v.curve[0]?.value ?? 10;
  if (!Number.isFinite(v.s0) || t < v.s0) return Math.min(v.socMax, from);
  const tt = Math.min(t, v.s1);
  let minutes = chargeClockAt(p, tt) - chargeClockAt(p, v.s0);
  if (v.fill === 'span' && Number.isFinite(v.s1)) {
    // the curve's minute where it reaches socMax, stretched over the stay
    let mMax = v.curve[v.curve.length - 1].at;
    for (let i = 1; i < v.curve.length; i++)
      if (v.curve[i].value >= v.socMax) {
        const a = v.curve[i - 1];
        const b = v.curve[i];
        mMax = a.at + ((v.socMax - a.value) / Math.max(1e-6, b.value - a.value)) * (b.at - a.at);
        break;
      }
    minutes = (mMax * (tt - v.s0)) / Math.max(0.1, v.s1 - 0.4 - v.s0);
  }
  return Math.min(v.socMax, lin(v.curve, minutes, from));
};

const visitAmps = (p: Partial<ChargeSliceSceneProps>, w: Which, v: Visit, t: number) => {
  const a = rawAmps(p, w, v, t);
  if (specOf(p, w).autoStop === false || !Number.isFinite(v.stop)) return a;
  return a * (1 - (v.stop < 0 ? 1 : ease(t, v.stop, v.stop + 0.4)));
};

/** A bay's cars, resolved (cached on the props that shape them). */
const bayModel = (p: Partial<ChargeSliceSceneProps>, w: Which, fps = 30): BayModel => {
  const s = specOf(p, w);
  const key = JSON.stringify([w, s, p.clock, p.region, p.durationInFrames, fps]);
  const hit = MODEL_CACHE.get(key);
  if (hit) return hit;
  const car = carOf(p, w);
  const region = regionOf(p);
  const socMax = s.socMax ?? (w === 'top' ? 70 : 80);
  type Raw = ChargeVisit & {compat?: boolean};
  let raws: Raw[] = [];
  if (car) {
    if (s.visits?.length) raws = s.visits;
    else if (s.cycle) {
      const c = s.cycle;
      // one lane: the next car may only come into view once the last has driven out of it (`chargeLaneClear`)
      const A = c.for ?? Math.min(1.2, c.every * 0.22);
      const L = Math.min(1.4, c.every * 0.22);
      const dwell = c.dwell ?? Math.max(0.4, c.every - 0.5 - 0.86 * L - A - 0.1);
      raws = [...Array(Math.max(0, c.count)).keys()].map((i) => {
        const stop = c.start + i * c.every;
        return {
          arrive: {at: stop, from: c.from ?? 9, for: A},
          leave: {at: stop + dwell + 0.5, for: L},
          plug: stop + 0.25,
          unplug: stop + dwell,
          driver: 'auto',
          look: c.look?.[i % c.look.length] ?? (i % 2 ? 'b' : 'a'),
          fill: 'span',
        } as Raw;
      });
    } else {
      const compat = !s.arrive && !s.leave && !s.driver && s.latch === undefined;
      raws = [{arrive: s.arrive, leave: s.leave, driver: s.driver, plug: s.latch, unplug: s.unlatch, compat}];
    }
  }
  const end = (p.durationInFrames ?? 900) / fps + 2;
  const visits: Visit[] = raws.map((r, i) => {
    const vcar = {...car, ...(r.car ?? {})};
    const shape = (vcar.shape ?? 'crossover') as ShellProfile;
    const geo = driverGeo(region, shape);
    let driver: DriverTimeline | null = null;
    if (r.driver === 'auto' && r.arrive && r.plug != null && r.unplug != null)
      driver = driverTimeline(
        autoDriver(geo, {stop: r.arrive.at, plug: r.plug, unplug: r.unplug, out: r.leave?.at ?? r.unplug + 4}, r.look ?? 'a'),
        geo,
        r.arrive.at + 0.05,
      );
    else if (r.driver && r.driver !== 'auto') driver = driverTimeline(r.driver, geo, r.arrive ? r.arrive.at + 0.1 : -Infinity);
    const latched: [number, number][] = driver
      ? driver.latched
      : r.plug != null
        ? [[r.plug, r.unplug ?? Infinity]]
        : r.compat
          ? [[-Infinity, Infinity]]
          : [];
    const v: Visit = {
      car: vcar,
      arrive: r.arrive,
      leave: r.leave,
      driver,
      latched,
      compat: !!r.compat,
      curve: curveOf(r.soc !== undefined ? r : s, w),
      socMax: r.socMax ?? socMax,
      fill: r.fill ?? 'clock',
      s0: NaN,
      s1: Infinity,
      stop: Infinity,
      // the two extras: the top bay's drivers 'b', the bottom's 'a', unless a driver or visit says
      look: (r.driver && r.driver !== 'auto' ? r.driver.look : undefined) ?? r.look ?? (w === 'top' ? 'b' : 'a'),
      key: `${w}-${i}`,
    };
    if (v.compat) {
      v.s0 = -Infinity;
      // the draft 1 stop: the first scene time the charge reaches socMax
      if (visitSoc(p, v, 0) >= v.socMax - 0.01) v.stop = -1;
      else for (let t = 0; t <= end; t += 1 / fps) if (visitSoc(p, v, t) >= v.socMax - 0.01) {
        v.stop = t;
        break;
      }
    } else {
      for (const [a, b] of latched) {
        const t1 = Math.min(b, a + 400);
        for (let t = a; t <= t1; t += 1 / fps)
          if (rawAmps(p, w, v, t) > 1) {
            v.s0 = t;
            v.s1 = b;
            break;
          }
        if (Number.isFinite(v.s0)) break;
      }
      if (Number.isFinite(v.s0)) {
        const t1 = Math.min(v.s1, v.s0 + 400);
        for (let t = v.s0; t <= t1; t += 1 / fps)
          if (visitSoc(p, v, t) >= v.socMax - 0.01) {
            v.stop = t;
            break;
          }
      }
    }
    return v;
  });
  const model = {visits, drives: visits.some((v) => v.arrive || v.leave)};
  if (MODEL_CACHE.size > 64) MODEL_CACHE.clear();
  MODEL_CACHE.set(key, model);
  return model;
};

/** The visit that holds the bay at t: the latched one, else the parked one, else the nearest present car. */
const activeVisit = (m: BayModel, t: number) => {
  const latched = m.visits.find((v) => v.latched.some(([a, b]) => t >= a && t < b));
  if (latched) return latched;
  let best: Visit | null = null;
  let bd = Infinity;
  for (const v of m.visits) {
    const d = Math.abs(carDriveAt(v.arrive, v.leave, t).x);
    if (d < bd) {
      bd = d;
      best = v;
    }
  }
  return bd < 45 ? best : null;
};

/**
 * When a car driving out (`leave`) has gone out of view to the left (its rear past x −9.5: off the frame at the
 * twin and wide framings). One lane: the next car's `arrive` window (`at − for`) should start after this, or the
 * two are seen passing through each other.
 */
export const chargeLaneClear = (leave: ChargeLeave) => {
  const L = Math.max(0.01, leave.to ?? 14);
  const T = Math.max(0.05, leave.for ?? 3.2);
  const x = 12;
  return x <= L ? leave.at + T * Math.sqrt(x / L) : leave.at + T + ((x - L) * T) / (2 * L);
};

/** The bay's current (A) at t: every visit's (only a latched one flows). */
const bayAmps = (p: Partial<ChargeSliceSceneProps>, w: Which, m: BayModel, t: number) =>
  m.visits.reduce((a, v) => a + visitAmps(p, w, v, t), 0);

/** The pulses' racing speed (m/s) for a current: faster with more amps. */
const pulseSpeed = (amps: number) => (amps > 1 ? 0.55 + 1.6 * Math.min(1, amps / 2500) : 0.55);

/** A surge (0 → 1 → 0 over 0.4 s) at t. */
const surgeAt = (s: number[] | undefined, t: number) =>
  (s ?? []).reduce((k, a) => (t > a && t < a + 0.4 ? Math.max(k, Math.sin((Math.PI * (t - a)) / 0.4)) : k), 0);

/**
 * One bay's state at scene time t: the car holding the bay (null when empty), its state of charge (0 → 1), the
 * current (A), the arrows (amps ÷ 250), the heat in the copper and in the cells (0 → 1, before breathing), the
 * coolant's travel (m), the port light (0 → 1), the pulses' travel (m) and surge. For overlays and checks.
 */
export const chargeBayState = (p: Partial<ChargeSliceSceneProps>, w: Which, t: number, fps = 30) => {
  const s = specOf(p, w);
  const m = bayModel(p, w, fps);
  const act = activeVisit(m, t);
  const amps = bayAmps(p, w, m, t);
  const ref = s.heatRef ?? 2500;
  // heat ∝ amps², lagging (the mean over the last 0.6 s); a small floor so a cool cable still shows a warmth
  const raw = (x: number) => {
    let a = 0;
    for (let k = 0; k <= 6; k++) a += (Math.min(ref, bayAmps(p, w, m, x - k * 0.1)) / ref) ** 2;
    return a / 7;
  };
  const show = (h: number) => (h <= 0 ? 0 : Math.min(1, 0.12 * Math.min(1, h / 0.02) + 0.88 * h));
  const heat = s.heat !== undefined ? Math.max(0, Math.min(1, keyedValue(s.heat, t, 0))) : show(raw(t));
  const cells = (h: number) => 0.85 * Math.max(0, (h - 0.33) / 0.67);
  const packHeat =
    s.packHeat !== undefined
      ? Math.max(0, Math.min(1, keyedValue(s.packHeat, t, 0)))
      : cells(s.heat !== undefined ? heat : show(raw(t - 0.4)));
  const coolSpeed = (x: number) => {
    if (s.coolant !== undefined) return Math.max(0, keyedValue(s.coolant, x, 0));
    const a = bayAmps(p, w, m, x);
    return a > 1 ? 0.06 + 0.22 * Math.min(1, a / 1500) : 0;
  };
  let coolant = coolSpeed(0) * ((p.startFrame ?? 0) / fps);
  let flow = pulseSpeed(bayAmps(p, w, m, 0)) * ((p.startFrame ?? 0) / fps);
  for (let x = 0; x < t; x += 1 / fps) {
    const h = Math.min(1 / fps, t - x);
    coolant += coolSpeed(x + h / 2) * h;
    flow += pulseSpeed(bayAmps(p, w, m, x + h / 2)) * h;
  }
  return {
    car: act ? act.car : null,
    soc: act ? visitSoc(p, act, t) / 100 : 0,
    amps,
    arrows: amps / (s.ampsPerArrow ?? 250),
    heat,
    packHeat,
    spread: Math.max(0, Math.min(1, keyedValue(s.spread, t, 1))),
    coolant,
    portLight: Math.max(0, Math.min(1, amps / 40)),
    flow,
    surge: surgeAt(s.surge, t),
  };
};

/** The arrows' slide (m): a steady 0.3 m/s on the video clock, so they run on across cuts. */
const arrowFlow = (p: Partial<ChargeSliceSceneProps>, t: number, fps: number) => ((p.startFrame ?? 0) / fps + t) * 0.3;

/** A point of a bay's car (its own frame, x forward; the car faces −x) → the scene, the car `dx` along. */
const carToWorld = (p: Partial<ChargeSliceSceneProps>, w: Which, v: V3, dx = 0): V3 => [-v[0] + dx, bayY(p, w) + v[1], v[2]];

/** The charger's foot (the island's top) in a bay. */
const cabinetFoot = (p: Partial<ChargeSliceSceneProps>, w: Which): V3 => [CHARGER_AT[0], bayY(p, w) + ISLAND_H, CHARGER_AT[2]];

const plugKind = (p: Partial<ChargeSliceSceneProps>, w: Which) => specOf(p, w).plug ?? (regionOf(p) === 'us' ? 'nacs' : 'gbt');

/** The cable's route for the plug in the port (of a car of `shape`) or in the holster (draft 1's routes). */
const routeFor = (
  p: Partial<ChargeSliceSceneProps>,
  w: Which,
  where: 'port' | 'holster',
  shape: ShellProfile,
): {points: V3[]; plug: PlugPose} => {
  const kind = regionOf(p) === 'us' ? 'us' : 'china';
  const foot = cabinetFoot(p, w);
  const c = CABINET[kind];
  const at = (v: V3): V3 => [foot[0] + v[0], foot[1] + v[1], foot[2] + v[2]];
  const exit = at(c.exit);
  const d = new THREE.Vector3(...c.exitDir).normalize();
  const out1: V3 = [exit[0] + d.x * 0.12, exit[1] + d.y * 0.12, exit[2] + d.z * 0.12];
  const y = bayY(p, w);
  if (where === 'port') {
    const port = carToWorld(p, w, chargePortAt(shape));
    const plug: PlugPose = {at: port, dir: [0, 0, -1], kind: plugKind(p, w)};
    const tail = plugTail(plug);
    const e = tail.at;
    const o = tail.out;
    return {
      points: [
        exit,
        out1,
        [exit[0] - 0.24, y + 1.0, exit[2] + 0.1],
        [exit[0] - 0.5, y + 0.56, exit[2] + 0.13],
        [e[0] + 0.15, y + 0.47, e[2] + 0.11],
        [e[0] + o[0] * 0.12, e[1] + o[1] * 0.12, e[2] + o[2] * 0.12],
        e,
      ],
      plug,
    };
  }
  // the connector in the holster, the cable hanging in a loop below it
  const h = at(c.holster);
  const plug: PlugPose = {at: [h[0], h[1], h[2] + 0.06], dir: [0, 0, -1], kind: plugKind(p, w)};
  const tail = plugTail(plug);
  const e = tail.at;
  return {
    points: [
      exit,
      out1,
      [exit[0] - 0.2, y + 0.7, exit[2] + 0.12],
      [exit[0] - 0.05, y + 0.32, exit[2] + 0.3],
      [e[0] - 0.05, y + 0.3, e[2] + 0.2],
      [e[0], e[1] - 0.12, e[2] + 0.06],
      e,
    ],
    plug,
  };
};

/**
 * The cable with the plug in a hand: the holster's and the port's routes, each moved toward the plug's tail
 * (more toward the connector end), blended by how far the plug is between them, so it joins both exactly.
 */
const routeInHand = (p: Partial<ChargeSliceSceneProps>, w: Which, nose: V3, dir: V3, shape: ShellProfile) => {
  const H = routeFor(p, w, 'holster', shape);
  const P = routeFor(p, w, 'port', shape);
  const plug: PlugPose = {at: nose, dir, kind: plugKind(p, w)};
  const tail = plugTail(plug);
  const th = plugTail(H.plug).at;
  const tp = plugTail(P.plug).at;
  const dh = Math.hypot(tail.at[0] - th[0], tail.at[1] - th[1], tail.at[2] - th[2]);
  const dp = Math.hypot(tail.at[0] - tp[0], tail.at[1] - tp[1], tail.at[2] - tp[2]);
  const u = dh + dp < 1e-6 ? 0 : dh / (dh + dp);
  const W = [0, 0, 0.25, 0.55, 0.85, 1, 1];
  const y0 = bayY(p, w) + 0.05;
  const points = H.points.map((q, i) => {
    const a = [0, 1, 2].map((k) => q[k] + W[i] * (tail.at[k] - th[k]));
    const b = [0, 1, 2].map((k) => P.points[i][k] + W[i] * (tail.at[k] - tp[k]));
    const v = [0, 1, 2].map((k) => a[k] + (b[k] - a[k]) * u) as V3;
    v[1] = Math.max(y0, v[1]);
    return v;
  });
  const o = tail.out;
  points[5] = [tail.at[0] + o[0] * 0.12, tail.at[1] + o[1] * 0.12, tail.at[2] + o[2] * 0.12];
  points[6] = tail.at;
  return {points, plug};
};

/** Where the plug is at t in a bay, from its drivers and latches (null pose: holster / port). */
const plugStateAt = (p: Partial<ChargeSliceSceneProps>, w: Which, m: BayModel, t: number, poses: (DriverPose | null)[]) => {
  for (let i = 0; i < m.visits.length; i++) {
    const pl = poses[i]?.plug;
    // the driver's pose is in the bay's frame; the cable's route in the scene's
    if (pl) return {where: 'hand' as const, nose: [pl.nose[0], pl.nose[1] + bayY(p, w), pl.nose[2]] as V3, dir: pl.dir, visit: m.visits[i]};
  }
  const lv = m.visits.find((v) => v.latched.some(([a, b]) => t >= a && t < b));
  if (lv && carDriveAt(lv.arrive, lv.leave, t).parked) return {where: 'port' as const, visit: lv};
  return {where: 'holster' as const, visit: null};
};

/**
 * A bay's cable: the route from the charger's exit to the connector's grip, and the connector's pose (in the
 * port, in a hand, or in the holster). Without `t`: the draft 1 picture (a car → in its port; empty → holstered).
 */
export const chargeCableOf = (p: Partial<ChargeSliceSceneProps>, w: Which, t?: number): {points: V3[]; plug: PlugPose} => {
  const shape = shapeOf(p, w);
  if (t === undefined) return routeFor(p, w, carOf(p, w) ? 'port' : 'holster', shape);
  const m = bayModel(p, w);
  const poses = m.visits.map((v) => (v.driver ? driverPoseAt(v.driver, t) : null));
  const st = plugStateAt(p, w, m, t, poses);
  if (st.where === 'hand') return routeInHand(p, w, st.nose, st.dir, (st.visit.car.shape ?? shape) as ShellProfile);
  if (st.where === 'port') return routeFor(p, w, 'port', (st.visit.car.shape ?? shape) as ShellProfile);
  return routeFor(p, w, 'holster', shape);
};

/** The car's HV lead from the port to the pack (car frame): along the rear section's cut face, down into the pack's rear. */
const hvRoute = (shape: ShellProfile = 'crossover'): V3[] => {
  const [px, py] = chargePortAt(shape);
  return [
    [px, py, 0.875],
    [px + 0.08, py - 0.08, 0.835],
    [-1.8, 0.81, 0.83],
    [-1.12, 0.81, 0.83],
    [-0.95, 0.7, 0.83],
    [-0.93, 0.42, 0.8],
    [-0.87, 0.3, 0.7],
    [-0.78, 0.25, 0.5],
  ];
};

// ---------------------------------------------------------------- camera

const chargeCameraMove = (
  p: Partial<ChargeSliceSceneProps>,
  durationInFrames: number,
  fps: number,
  frame?: number,
): {from: Framing; to: Framing; pre?: {from: Framing; hold: number; move: number; ease: 'cubic'}} => {
  const name = p.framing ?? 'twin';
  const F = chargeFramings(gapOf(p));
  const preset = name === 'cableClose' ? cableCloseFraming(p) : F[name];
  if (p.cameraKeys && p.cameraKeys.length) {
    const base = p.camera?.from ?? preset;
    const f = framingAtKeys(p.cameraKeys, base, frame === undefined ? Infinity : frame / fps);
    return {from: f, to: f};
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

export const chargeCameraStart = (p: Partial<ChargeSliceSceneProps>, d: number, fps: number): Framing =>
  chargeCameraMove({...p, cameraFrom: undefined, cameraGlide: undefined}, d, fps, 0).from;
export const chargeCameraEnd = (p: Partial<ChargeSliceSceneProps>, d: number, fps: number): Framing =>
  chargeCameraMove(p, d, fps).to;

const chargeCameraAt = (p: Partial<ChargeSliceSceneProps>, o: {frame: number; fps: number; durationInFrames: number}) => {
  const {from, to, pre} = chargeCameraMove(p, o.durationInFrames, o.fps, o.frame);
  return sectionCameraAt({
    from,
    to,
    pre,
    frame: o.frame,
    fps: o.fps,
    durationInFrames: o.durationInFrames,
    drift: p.drift ?? 0,
    clockOffset: (p.startFrame ?? 0) / o.fps,
  });
};

/**
 * A named point on screen (px) at a frame, for overlays: 'top:top' | 'top:bottom' (just above that bay's car
 * roof, following the car as it drives; or its ghost's), 'pack:top' | 'pack:bottom' (the pack's rear, where the
 * HV lead comes in), 'port:*' (the charging port), 'cable:*' (the middle of the cable's cut-away), 'cabinet:*'
 * (the charger's screen), 'lane:*' (the bay block's front edge under the car), 'under:*' (the bay block's front
 * underside), 'driver:*' (above that bay's driver's head, in or out of the car), 'clock' (the station clock),
 * 'ghost' (the ghost's roof, in its bay).
 */
export const chargeAnchorOnScreen = (
  p: Partial<ChargeSliceSceneProps>,
  anchor: string,
  o: {frame: number; fps: number; durationInFrames: number},
): [number, number] | undefined => {
  const cam = chargeCameraAt(p, o);
  const t = o.frame / o.fps;
  if (anchor === 'ghost') {
    const g = p.ghost;
    const w = g?.bay ?? 'top';
    return projectToFrame(cam, carToWorld(p, w, ghostRoof(g?.shape ?? 'sedan')));
  }
  if (anchor === 'clock') {
    const w = p.stationClock === false ? 'bottom' : (p.stationClock ?? 'bottom');
    return projectToFrame(cam, [CLOCK_AT[0], bayY(p, w) + CLOCK_AT[1], CLOCK_AT[2]]);
  }
  const [name, which] = anchor.split(':');
  if (which !== 'top' && which !== 'bottom') return undefined;
  const w = which as Which;
  const m = bayModel(p, w, o.fps);
  const act = activeVisit(m, t);
  const car = act?.car ?? carOf(p, w);
  const dx = act ? carDriveAt(act.arrive, act.leave, t).x : 0;
  const shape = (car?.shape ?? 'sedan') as ShellProfile;
  if (name === 'top') {
    const roof = car ? layoutOf(car).roofCut : ghostRoof(shape)[1];
    return projectToFrame(cam, carToWorld(p, w, [0, roof + 0.15, 0], dx));
  }
  if (name === 'driver') {
    const pose = act?.driver ? driverPoseAt(act.driver, t) : null;
    if (pose && !pose.inCar) return projectToFrame(cam, [pose.pos[0], bayY(p, w) + (pose.stance === 'sit' ? pose.pos[1] + 1.55 : 1.95), pose.pos[2]]);
    const lay = layoutOf(car ?? {});
    return projectToFrame(cam, carToWorld(p, w, [lay.driver[0], lay.driver[1] + 1.4, lay.driver[2]], dx));
  }
  if (name === 'pack') return projectToFrame(cam, carToWorld(p, w, [-0.8, 0.33, 0.62], dx));
  if (name === 'port') return projectToFrame(cam, carToWorld(p, w, chargePortAt(car?.shape ?? 'crossover'), dx));
  if (name === 'cabinet') {
    const f = cabinetFoot(p, w);
    const s = CABINET[regionOf(p) === 'us' ? 'us' : 'china'].screen;
    return projectToFrame(cam, [f[0] + s[0], f[1] + s[1], f[2] + s[2]]);
  }
  if (name === 'lane') return projectToFrame(cam, [0, bayY(p, w), BAY.front]);
  if (name === 'under') return projectToFrame(cam, [0, bayY(p, w) - (w === 'bottom' ? (p.groundDepth ?? BAY.depth) : BAY.depth), BAY.front]);
  if (name === 'cable') {
    const {points} = chargeCableOf(p, w, t);
    const cut = specOf(p, w).cut ?? [0.14, 0.8];
    const curve = new THREE.CatmullRomCurve3(points.map((q) => new THREE.Vector3(...q)), false, 'centripetal');
    const v = curve.getPointAt((cut[0] + cut[1]) / 2);
    return projectToFrame(cam, [v.x, v.y, v.z]);
  }
  return undefined;
};

// ---------------------------------------------------------------- the scene

/**
 * C / U, the charging station (No. 010): two charging bays stacked as a twin section; cut EVs reversing in,
 * charging and driving out, their drivers acting out the wait (plug, lean, curb, phone); each charger's cable cut
 * open with the current (arrows or bold pulses), the breathing heat and the coolant; the charge filling the packs;
 * a time-lapse swinging the sun, drifting the clouds and spinning the station clock. The camera frames it at the
 * fixed angle.
 */
export const ChargeSliceScene: React.FC<ChargeSliceSceneProps> = (props) => {
  const {durationInFrames, mood = 'day', startFrame = 0} = props;
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const vclock = startFrame / fps + t;
  const m = MOODS[mood];
  const gap = gapOf(props);
  const region = regionOf(props);
  const {from, to, pre} = chargeCameraMove(props, durationInFrames, fps, frame);
  const cam = chargeCameraAt(props, {frame, fps, durationInFrames});
  const camD = cam.position.distanceTo(cam.look);
  const inkK = Math.max(0.15, Math.min(4, camD / 12.75));
  // the arrows keep ≈ their size on screen from the wide shots in (quantized: their tubes rebuild on change)
  const arrowR = Math.round(0.03 * Math.max(0.62, Math.min(1.3, camD / 16)) * 2000) / 2000;
  // the bold pulses: ≈ 10 px thick from the wide shots in; over the jacket only from the medium shots out
  const bold = props.pulse === 'bold';
  const slugR = Math.max(0.012, Math.min(0.085, camD * 0.0013));
  const slugOuter = ease(camD, 11, 19);
  const breathe = props.breathe ?? (bold ? 0.25 : 0);
  const breath = Math.sin((2 * Math.PI * vclock) / 1.2);
  const breatheK = (h: number) => (breathe > 0 ? h * (1 + breathe * Math.min(1, h / 0.35) * breath) : h);
  // the ghost's dashes in screen px (v0.13: 3 px line, 16 px dash, 10 px gap): px per metre ≈ 1920 / (0.4618 × distance)
  const pxM = camD / 4158;
  const ghostW = Math.round(3 * pxM * 4000) / 4000;
  const ghostDash: [number, number] = [16 * pxM, 10 * pxM];
  const sky = useMemo(() => new THREE.MeshBasicMaterial({map: skyTexture(mood), fog: false}), [mood]);
  sky.color.setScalar(1 / m.exposure);
  const canopy = props.canopy ?? region === 'china';
  const g = props.ghost ?? null;
  // the time-lapse: story minutes, the sun's swing (± 20° at most), the clock
  const minutes = chargeMinutesAt(props, t);
  const sunDeg = props.timelapse ? Math.max(-20, Math.min(20, ((props.timelapse.sun ?? 12) * minutes) / 30)) : 0;
  const clockBay = props.stationClock === false ? null : (props.stationClock ?? 'bottom');
  const sweepFront = Math.max(0.035, Math.min(0.12, camD * 0.0026));
  // both blocks run on to the left (a drive-in lane) when either bay has a car driving
  const anyDrives = WHICH.some((w) => bayModel(props, w, fps).drives);

  return (
    <AbsoluteFill>
      <SectionStage mood={mood} post={{focusY: 0.5}} ao far={260}>
        <SectionCamera
          from={from}
          to={to}
          pre={pre}
          durationInFrames={durationInFrames}
          drift={props.drift ?? 0}
          clockOffset={startFrame / fps}
          fitClip
          farMin={200}
        />
        <SectionLights mood={mood} target={[1, gap / 2, 0]} lamp={0} extent={8} figureSpot={false} keyYaw={(sunDeg * Math.PI) / 180} />
        <mesh position={[0, gap / 2 + 20, -165]} material={sky}>
          <planeGeometry args={[900, 480]} />
        </mesh>
        {props.clouds === false ? null : <DriftingClouds mood={mood} minutes={minutes} y={[-7, gap + 3]} count={12} z={-18} />}
        {WHICH.map((w) => {
          const y = bayY(props, w);
          const model = bayModel(props, w, fps);
          const st = chargeBayState(props, w, t, fps);
          const s = specOf(props, w);
          const flow = arrowFlow(props, t, fps);
          const poses = model.visits.map((v) => (v.driver ? driverPoseAt(v.driver, t) : null));
          const plugSt = plugStateAt(props, w, model, t, poses);
          const shape0 = shapeOf(props, w);
          const cable =
            plugSt.where === 'hand'
              ? routeInHand(props, w, plugSt.nose, plugSt.dir, (plugSt.visit.car.shape ?? shape0) as ShellProfile)
              : plugSt.where === 'port'
                ? routeFor(props, w, 'port', (plugSt.visit.car.shape ?? shape0) as ShellProfile)
                : model.visits.length && model.visits.every((v) => v.compat)
                  ? routeFor(props, w, 'port', shape0)
                  : routeFor(props, w, 'holster', shape0);
          const hasCar = model.visits.length > 0;
          const heatNow = breatheK(st.heat);
          const packHeatNow = breatheK(st.packHeat);
          const slugs = (count: number): CableSlugs | null =>
            bold ? {count, flow: st.flow, radius: slugR, surge: st.surge, outer: slugOuter} : null;
          const latchedVisit = plugSt.where === 'port' ? plugSt.visit : model.visits.find((v) => v.compat) ?? null;
          return (
            <React.Fragment key={w}>
              <ChargeBay
                mood={mood}
                region={region}
                paint={props.bayPaint ?? true}
                y={y}
                inkScale={inkK}
                x0={anyDrives ? (props.approach ?? -40) : BAY.x0}
                curb={props.curb ?? true}
                depth={w === 'bottom' ? props.groundDepth : undefined}
              />
              <ChargerCabinet kind={region === 'us' ? 'us' : 'china'} position={cabinetFoot(props, w)} />
              {canopy ? <Canopy mood={mood} y={y} height={props.canopyHeight} inkScale={inkK} /> : null}
              {clockBay === w ? (
                <group position={[0, y, 0]}>
                  <StationClock position={CLOCK_AT} minutes={(props.time ?? 800) + minutes} />
                </group>
              ) : null}
              {model.visits.map((v, i) => {
                const drive = carDriveAt(v.arrive, v.leave, t);
                if (Math.abs(drive.x) > 45) return null;
                const pose = poses[i];
                const revs = carWheelRevs(v.arrive, v.leave, t, fps);
                const sRevs = drive.speed / (2 * Math.PI * WHEEL_R);
                const cap = capRevs(fps);
                const isLatched = latchedVisit === v;
                const vAmps = visitAmps(props, w, v, t);
                const soc = visitSoc(props, v, t) / 100;
                const car = v.car;
                const opts: SlicedCarOptions = {
                  ...car,
                  mood,
                  road: 'street',
                  driving: [{at: -100, speed: sRevs}],
                  wheelFrom: revs - Math.sign(sRevs) * Math.min(Math.abs(sRevs), cap) * t,
                  foot: car.foot ?? [{at: -1, pose: 'floor'}],
                  clusterSpeed: car.clusterSpeed ?? 0,
                  power: car.power ?? 0,
                  brakeLights: car.brakeLights ?? (v.compat ? undefined : drive.brake),
                  chargePort: car.chargePort === null ? null : {light: isLatched ? Math.max(0, Math.min(1, vAmps / 40)) : 0, ...(car.chargePort ?? {})},
                  packCharge: {
                    soc,
                    heat: isLatched ? packHeatNow : 0,
                    sweep: props.cells === 'sweep',
                    frontWidth: sweepFront,
                  },
                  driverShown: pose ? pose.inCar : true,
                  driverLook: v.driver || !v.compat ? driverLook(v.look) : undefined,
                  startFrame,
                };
                const hvArrows = isLatched ? vAmps / (s.ampsPerArrow ?? 250) : 0;
                return (
                  <React.Fragment key={v.key}>
                    <group position={[drive.x, y, 0]}>
                      <SlicedCar {...opts} ground={false} cameraDistance={camD} />
                    </group>
                    <HvRun
                      points={hvRoute(car.shape ?? 'crossover').map((q) => carToWorld(props, w, q, drive.x))}
                      arrows={bold ? 0 : hvArrows}
                      flow={flow}
                      arrowRadius={arrowR}
                      mood={mood}
                      view={SECTION_ANGLE}
                      slugs={bold && hvArrows > 0.02 ? {count: hvArrows, flow: st.flow, radius: slugR * 0.8, surge: st.surge} : null}
                    />
                  </React.Fragment>
                );
              })}
              {model.visits.map((v, i) => {
                const pose = poses[i];
                if (!pose || pose.inCar) return null;
                return (
                  <group key={`d${v.key}`} position={[0, y, 0]}>
                    <ChargeDriverFigure pose={pose} mood={mood} look={v.look} seed={`charge-${v.key}`} clockOffset={startFrame / fps} />
                  </group>
                );
              })}
              <ChargeCable
                points={cable.points}
                plug={cable.plug}
                cut={hasCar ? (s.cut === undefined ? [0.14, 0.8] : s.cut) : null}
                arrows={bold ? 0 : st.arrows}
                flow={flow}
                arrowRadius={arrowR}
                heat={heatNow}
                spread={st.spread}
                coolant={st.coolant}
                mood={mood}
                inkScale={inkK}
                slugs={slugs(st.arrows)}
              />
              {g && (g.bay ?? 'top') === w ? (
                <group position={[0, y, 0]} scale={[-1, 1, 1]}>
                  <GhostCar
                    mood={mood}
                    shape={g.shape ?? 'sedan'}
                    draw={ease(t, g.at, g.at + (g.drawFor ?? 0.8))}
                    opacity={g.fadeAt === undefined ? 1 : 1 - ease(t, g.fadeAt, g.fadeAt + (g.fadeFor ?? 0.7))}
                    width={ghostW}
                    dash={ghostDash}
                  />
                </group>
              ) : null}
            </React.Fragment>
          );
        })}
        {props.horizon === false ? null : <ChargeHorizon mood={mood} y={gap} inkScale={inkK} />}
      </SectionStage>
    </AbsoluteFill>
  );
};
