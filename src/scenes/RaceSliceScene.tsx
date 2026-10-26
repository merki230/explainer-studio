import React, {useMemo} from 'react';
import {AbsoluteFill, random, useCurrentFrame, useVideoConfig} from 'remotion';
import * as THREE from 'three';
import {HIGHWAY, MOODS, RACE, type Mood} from '../theme';
import {raw} from '../three/plaster';
import {gearShiftAt, type GearKey} from '../three/real/GasDrive';
import {CAR_LAYOUT} from '../three/real/RealCar';
import {
  layoutOf,
  simRevs,
  SlicedCar,
  slicedCarCrank,
  toWorld,
  type FootKey,
  type SlicedCarOptions,
  type V3,
} from '../three/real/SlicedCar';
import {
  ChainFence,
  Crowd,
  DistanceBoard,
  DRAG_BOARDS,
  DragTree,
  LightPole,
  StartLine,
  TimingPost,
  TreeLine,
  fieldTexture,
  vnoise,
  wallTexture,
  type Spectator,
  type TreeKey,
} from '../three/real/StripProps';
import {cutMaterial, CutOutline, INK, type Rect} from '../three/section/cutLook';
import {projectToFrame, SectionCamera, sectionCameraAt, type Framing} from '../three/section/SectionCamera';
import {SectionLights, SectionStage} from '../three/section/SectionStage';
import {skyTexture} from '../three/section/textures';
import {framingAtKeys, keyedValue, speedAt, type CameraKey, type Keyed, type SpeedKey} from './keyframes';

/*
 * R, the drag strip as a twin section (No. 007, N1). Two lanes drawn one above the other like two
 * sections on one sheet, the electric car's lane on top (owner decision), sky between and around them.
 * Each lane is cut lengthwise like `car-slice`: a cut ground block (hatched front face, ink cut edges),
 * a concrete launch pad then asphalt, rubber in the wheel paths, a guard wall of barrier segments behind,
 * distance boards, the start line and that lane's light column (`StripProps`). A low grandstand floats on
 * its own cut block far behind the top lane. Each car is a `SlicedCar` (`ground={false}`) facing −x.
 *
 * World: x along the strip (forward = −x), y up, z toward the camera; the gas lane's road at y = 0, the
 * electric lane's at y = `laneGap`. The camera tracks a point between the two cars (`track`), so the
 * strip scrolls under both and the cars' offset on screen IS the gap between them. Strip position s (m)
 * is measured from the start line, forward positive; a car is staged when its front axle is on the line.
 */

type Which = 'ev' | 'gas';
const WHICH: Which[] = ['ev', 'gas'];

/** Metres per wheel revolution (the cars' speed keys are in rev/s). */
const WHEEL_C = 2 * Math.PI * CAR_LAYOUT.wheelR;
const MPH = 0.44704;
/** A car's centre in strip metres when staged (its front axle on the start line). */
const STAGED = -CAR_LAYOUT.axleX.front;
/** Where the tracked point sits in the scene (x): the staged car's centre, so the start line starts at x = 0. */
export const RACE_CX = -STAGED;
/** The lane blocks (metres): front cut face, back, depth, half-length; the guard wall; the grandstand's block. */
const LANE = {front: 1.75, back: -2.6, depth: 0.7, half: 46, wallZ: -2.22, wallH: 0.81, wallT: 0.3, seg: 3.05};
const STAND = {front: -5.4, back: -9.6, depth: 0.5, rows: 5, rise: 0.4, post: 6, from: -30, to: 420};
/** The textures' repeat along the strip (m): the concrete slabs' joint spacing. */
const TILE = 4.6;
/** Slow-motion integration step (s), as `simRevs`. */
const STEP = 1 / 120;

export type RaceFraming = 'line' | 'pair' | 'ev' | 'evMotor' | 'twin' | 'wide';

/**
 * A launch model (🎭 shapes, not measured data), in race time after the green. Push (m/s²) is flat at
 * `push` until `power / v` falls below it, then constant power: the electric car's knee is at
 * `power / push` (the defaults: 13.4 m/s, 30 mph). `shifts`: speeds (mph) where a gear change cuts the push for
 * `shiftTime`. Defaults (the No. 007 cars): electric push 10.15, power 136 (0–60 in 3.30 s, 0–100 in
 * 8.01 s); gas push 8.6, power 164, shifts every 18 mph from 36 (8 gears; 0–60 in 3.61 s, 0–100 in 7.84 s).
 */
export type LaunchModel = {
  /** m/s² from a stop (the traction-limited push). */
  push?: number;
  /** Power per mass (W/kg = m²/s³): above the knee the push is power / speed. */
  power?: number;
  /** Seconds (race time) after the green before the car moves. Default 0.1. */
  react?: number;
  /** Gas: the speeds (mph) of each gear change. Default (gas) [36, 54, 72, 90, 108, 126, 144]; electric none. */
  shifts?: number[];
  /** Race seconds a gear change cuts the push. Default 0.15. */
  shiftTime?: number;
  /** Air and rolling drag: a −= drag × v² (1/m). Default 0. */
  drag?: number;
  /** Gas: engine idle and the shift point (rpm), for the automatic `rpm` keys. Defaults 800 and 6,500. */
  idle?: number;
  redline?: number;
};

const LAUNCH_DEFAULTS: Record<Which, Required<LaunchModel>> = {
  ev: {push: 10.15, power: 136, react: 0.1, shifts: [], shiftTime: 0.15, drag: 0, idle: 800, redline: 6500},
  gas: {
    push: 8.6,
    power: 164,
    react: 0.1,
    shifts: [36, 54, 72, 90, 108, 126, 144],
    shiftTime: 0.15,
    drag: 0,
    idle: 800,
    redline: 6500,
  },
};

/** One car of the race: any `SlicedCar` option (overrides the defaults) plus how it moves. */
export type RaceCar = Partial<SlicedCarOptions> & {
  /**
   * Move by the launch model from the green (`true`: the defaults for this car; or override any value).
   * Ignored when `driving` keys are given (explicit speed keys, rev/s, win). Default none: the car stands.
   */
  launch?: LaunchModel | boolean;
  /**
   * Creep up to the line and stop (staging): from `at` (s) the car rolls `from` metres (default 3) over
   * `dur` s (default 1.6) and stops with its front axle on the start line (it starts that far back).
   * Must finish (≈ at + dur + 0.8) before a launch's first key (0.8 s before it moves).
   */
  restage?: {at: number; from?: number; dur?: number};
  /** This lane's light column (`TreeKey`s; default the scene's `lights`, or a pro tree from `green`). */
  lights?: TreeKey[];
  /** The car's centre at the scene's start, metres ahead of its staged spot (default 0, or −`restage.from`). */
  from?: number;
};

/** Race state handed on by Explainer on a `continue` / glide (set by Explainer, not by specs). */
export type RaceCarry = {
  raceFrom?: number;
  ev?: {from: number; revsFrom: number};
  gas?: {from: number; revsFrom: number; crankFrom: number};
};

export type RaceSliceSceneProps = {
  durationInFrames: number;
  /** Day (default) or Night. */
  mood?: Mood;
  /**
   * The electric car (top lane). Defaults: `{variant: 'ev', shape: 'coupe', coupeStyle: 'electric', awd: true,
   * wheelsWhole: true, driver: 'extra', paint: RACE.evPaint, helmet: {shell: RACE.helmetEv, visor: RACE.visor}}`,
   * the foot on the accelerator (pressed fully at its launch). `coupeStyle: undefined` / `helmet: undefined`
   * bring back the plain coupe and the bare head.
   */
  ev?: RaceCar;
  /**
   * The gas car (bottom lane). Defaults: `{variant: 'gas', shape: 'coupe', coupeStyle: 'muscle', engine: 'v8',
   * driverSide: 'far', wheelsWhole: true, driver: 'extra', paint: RACE.gasPaint, helmet: {shell: RACE.helmetGas,
   * visor: RACE.visor}}`; with a launch model and no `gear` / `rpm` of
   * its own, its gear and rpm keys follow the model's shifts.
   */
  gas?: RaceCar;
  /** Playback rate for both cars (1 = real time, 0.2 = 5× slow motion), a constant or keys. Default 1. */
  timeScale?: Keyed;
  /** Scene seconds when the green lights in both columns; the launch models start from it. Default none. */
  green?: number;
  /** Race seconds since the green at this scene's start (a race already underway). Overrides `green`. */
  raceFrom?: number;
  /** Both light columns' keys (a lane's own `lights` wins). Default: a pro tree at `green` (ambers lit before), else dark. */
  lights?: TreeKey[];
  /**
   * What the camera tracks along the strip: 0 = the gas car, 1 = the electric car, 0.5 = halfway (a
   * constant or keys). Default 1 on the 'ev' and 'evMotor' framings, else 0.5.
   */
  track?: Keyed;
  /** Height between the two lanes' road surfaces (m). Default 3.4 (a band of sky between them; the bottom lane's wall top clears the top lane's block). */
  laneGap?: number;
  /** Length of the concrete launch pad past the start line (m), then asphalt. Default 100 (≈ 330 ft, 🎭). */
  padLength?: number;
  /** How far past the start line each light column stands (m). Default 3.6 (🎭 closer than a real tree). */
  treeAhead?: number;
  /** The light columns' turn about y (rad). Default 0.9 (🎭: turned toward the camera; π/2 faces the drivers). */
  treeYaw?: number;
  /** The light columns' size. Default 1 (real proportions, on the short pole). */
  treeScale?: number;
  /**
   * Which side of the lane the light columns stand: 'far' (default: by the guard wall, the cars pass in front
   * of them) or 'near' (by the cut, in front of the cars as they pass).
   */
  treeSide?: 'far' | 'near';
  /** The columns' pole under the housing (m, before `treeScale`). Default 0.2 (🎭 short, so the bottom lane's column clears the top lane's block). */
  treePole?: number;
  /**
   * Distance boards (legend, metres from the start line); false: none. Default `DRAG_BOARDS`. Drawn low (1.3 × 0.52 m,
   * from 0.92 m) in front of the guard wall, so the bottom lane's boards clear the top lane's block.
   */
  boards?: {text: string; at: number}[] | false;
  /** The grandstand far behind the top lane. Default true. */
  grandstand?: boolean;
  /**
   * The realism pass ("the road too", owner). How full the grandstand is, 0 (empty) → 1 (every seat): stylized
   * seated spectators (rounded, no faces, muted clothes `RACE.crowd`). Default 0.2.
   */
  crowd?: number;
  /** The painted lane lines (the centre line by the cut, the edge line by the wall). Default true. */
  markings?: boolean;
  /** The stage-beam timing posts by the start line, both sides of each lane. Default true. */
  timingPosts?: boolean;
  /** A chain-link fence on each guard wall. Default true. */
  fence?: boolean;
  /** Light poles behind the top lane's wall (every 38 m, from 19 m past the line). Default true. */
  lightPoles?: boolean;
  /** The world beyond: a field on its own cut block far behind the grandstand, with a tree line in two depths. Default true. */
  horizon?: boolean;
  /**
   * A little tire haze at the launch (neutral grey `RACE.haze`, never orange): soft puffs left behind at the
   * rear tires' contact patches over the first ≈ 0.5 s of race time, each swelling, rising and fading over ≈ 1.6 s
   * (race time, so slow motion slows it). The electric car's lighter. Default true (only with a launch model).
   */
  launchHaze?: boolean;
  /**
   * In a close look at the electric car's drive units (the 'evMotor' framing or any camera within ≈ 7 m whose
   * look point is within ≈ 1.6 m of a near wheel's hub), that near wheel fades to this opacity, so the rear
   * unit, its inverter, phase cables, windings and arrows read through the big sport wheel; it fades back as
   * the camera pulls out. A number (default 0.3) or false (never).
   */
  wheelGhost?: number | false;
  /** Framing preset (default 'line'). See `raceFramings`. */
  framing?: RaceFraming;
  /** A custom move instead of a preset (look-at + distance at the fixed angle). */
  camera?: {from: Framing; to?: Framing};
  /** Camera keyframes (as on `car-slice`): override `camera`, `push` and the glide in. */
  cameraKeys?: CameraKey[];
  /** Push toward the subject, units/s (default 0). */
  push?: number;
  /** Idle sideways drift, ± units (default 0: frame 0 and the loop frame match). */
  drift?: number;
  location?: string;
  transition?: 'auto' | 'continue' | 'glide' | 'cut' | 'dissolve' | 'slide' | 'follow';
  follow?: {direction?: 'down' | 'up' | 'left' | 'right'; at?: number};
  glide?: number;
  /** Set by Explainer. */
  startFrame?: number;
  cameraFrom?: Framing;
  cameraGlide?: number;
  /** Set by Explainer on a continue: the race state at the end of the scene before. */
  carry?: RaceCarry;
};

// ---------------------------------------------------------------- framings

/**
 * The framings at the fixed angle (world metres, set on test stills), for a lane gap. The tracked car's
 * centre sits at x = `RACE_CX`. 'line': frame 0 and the loop, both front ends at the start line, the light
 * columns at frame left, the top lane below the title block. 'pair' (M): both drivetrains. 'ev' (M): the
 * top lane's whole car at the same distance (a crane from 'pair'). 'evMotor' (C): the electric car's rear
 * drive unit. 'twin' (MW): both whole cars. 'wide' (W): both lanes long.
 */
export const raceFramings = (gap = 3.4): Record<RaceFraming, Framing> => ({
  line: {look: [-0.2, gap / 2 - 0.85, 0.4], distance: 41},
  pair: {look: [RACE_CX, gap / 2 - 0.2, 0.3], distance: 38},
  ev: {look: [RACE_CX, gap / 2 + 0.9, 0.3], distance: 38},
  evMotor: {look: [RACE_CX + 1.15, gap + 0.63, 0.32], distance: 5},
  twin: {look: [RACE_CX - 1, gap / 2 - 1, 0.3], distance: 50},
  wide: {look: [RACE_CX - 1.5, gap / 2 + 2.6, 0], distance: 82},
})

const gapOf = (p: Partial<RaceSliceSceneProps>) => p.laneGap ?? 3.4;
const laneY = (p: Partial<RaceSliceSceneProps>, w: Which) => (w === 'ev' ? gapOf(p) : 0);

// ---------------------------------------------------------------- the race clock and the launch model

/** ∫ rate dt from 0 to t (scene s; before 0 at the first rate), on a fixed grid, cached per `timeScale`. */
const rateTables = new Map<string, Float64Array>();
const rateIntegral = (p: Partial<RaceSliceSceneProps>, t: number) => {
  const rate = (x: number) => Math.max(0, keyedValue(p.timeScale, x, 1));
  if (t <= 0) return rate(0) * t;
  if (p.timeScale === undefined || typeof p.timeScale === 'number') return rate(0) * t;
  const key = JSON.stringify(p.timeScale);
  let tab = rateTables.get(key);
  const need = Math.ceil(t / STEP) + 2;
  if (!tab || tab.length < need) {
    const n = Math.max(need, Math.ceil(90 / STEP));
    tab = new Float64Array(n + 1);
    for (let i = 0; i < n; i++) tab[i + 1] = tab[i] + rate((i + 0.5) * STEP) * STEP;
    rateTables.set(key, tab);
  }
  const i = Math.floor(t / STEP);
  return tab[i] + (tab[i + 1] - tab[i]) * (t / STEP - i);
};

/** Race seconds since the green at scene time t, or undefined when no race is set. */
export const raceClockAt = (p: Partial<RaceSliceSceneProps>, t: number): number | undefined => {
  const from = p.raceFrom ?? p.carry?.raceFrom;
  if (from !== undefined) return from + rateIntegral(p, t);
  if (p.green !== undefined) return rateIntegral(p, t) - rateIntegral(p, p.green);
  return undefined;
};

/** The scene time when the race clock reaches c (bisection; the clock never runs backwards). */
const sceneTimeAtClock = (p: Partial<RaceSliceSceneProps>, c: number): number | undefined => {
  const at = (t: number) => raceClockAt(p, t);
  if (at(0) === undefined) return undefined;
  let lo = -60;
  let hi = 600;
  if ((at(hi) as number) < c) return Infinity;
  for (let k = 0; k < 60; k++) {
    const m = (lo + hi) / 2;
    if ((at(m) as number) < c) lo = m;
    else hi = m;
  }
  return (lo + hi) / 2;
};

type ModelTable = {h: number; v: Float64Array; a: Float64Array; d: Float64Array; shiftU: number[]};
const modelTables = new Map<string, ModelTable>();
/** The model's speed (m/s) and push (m/s²) from launch, tabulated in race time (cached). */
const modelTable = (m: Required<LaunchModel>): ModelTable => {
  const key = JSON.stringify(m);
  const hit = modelTables.get(key);
  if (hit) return hit;
  const h = 1 / 240;
  const n = Math.ceil(60 / h);
  const v = new Float64Array(n + 1);
  const a = new Float64Array(n + 1);
  const d = new Float64Array(n + 1);
  const shiftU: number[] = [];
  let k = 0;
  let dip = -1;
  for (let i = 0; i < n; i++) {
    const u = i * h;
    if (k < m.shifts.length && v[i] >= m.shifts[k] * MPH && dip < 0) {
      dip = u;
      shiftU.push(u);
      k++;
    }
    let acc = Math.min(m.push, m.power / Math.max(v[i], 0.01));
    if (dip >= 0) {
      if (u - dip < m.shiftTime) acc = 0;
      else dip = -1;
    }
    acc -= m.drag * v[i] * v[i];
    a[i] = acc;
    v[i + 1] = Math.max(0, v[i] + acc * h);
    d[i + 1] = d[i] + ((v[i] + v[i + 1]) / 2) * h;
  }
  a[n] = a[n - 1];
  const tab = {h, v, a, d, shiftU};
  modelTables.set(key, tab);
  return tab;
};
const tableAt = (arr: Float64Array, h: number, u: number) => {
  if (u <= 0) return 0;
  const x = Math.min(arr.length - 1.001, u / h);
  const i = Math.floor(x);
  return arr[i] + (arr[i + 1] - arr[i]) * (x - i);
};

/** A car's spec with the defaults filled in (the car's own options win; the carry fills `from` / `revsFrom`). */
const specOf = (p: Partial<RaceSliceSceneProps>, w: Which): RaceCar => {
  const own = p[w] ?? {};
  const carry = p.carry?.[w];
  const base: RaceCar =
    w === 'ev'
      ? {
          variant: 'ev',
          shape: 'coupe',
          coupeStyle: 'electric',
          awd: true,
          wheelsWhole: true,
          driver: 'extra',
          paint: RACE.evPaint,
          helmet: {shell: RACE.helmetEv, visor: RACE.visor},
        }
      : {
          variant: 'gas',
          shape: 'coupe',
          coupeStyle: 'muscle',
          engine: 'v8',
          driverSide: 'far',
          wheelsWhole: true,
          driver: 'extra',
          paint: RACE.gasPaint,
          helmet: {shell: RACE.helmetGas, visor: RACE.visor},
        };
  return {
    ...base,
    ...(carry
      ? {from: carry.from, revsFrom: carry.revsFrom, ...('crankFrom' in carry ? {crankFrom: carry.crankFrom} : {})}
      : {}),
    ...own,
  };
};

const launchOf = (c: RaceCar, w: Which): Required<LaunchModel> | undefined =>
  c.launch === undefined || c.launch === false
    ? undefined
    : {...LAUNCH_DEFAULTS[w], ...(c.launch === true ? {} : c.launch)};

/** The scene's length in seconds when known (keys are only made inside it), else a long default. */
const spanOf = (p: Partial<RaceSliceSceneProps>, fps = 30) =>
  p.durationInFrames ? p.durationInFrames / fps + 1.6 : 90;

/** The restage creep keys and the distance they cover (m, with the playback rate). */
const restageKeys = (p: Partial<RaceSliceSceneProps>, c: RaceCar): {keys: SpeedKey[]; dist: number} => {
  if (!c.restage) return {keys: [], dist: 0};
  const {at, from = 3, dur = 1.6} = c.restage;
  // the rate averaged over the creep, so the car covers `from` in slow motion too
  const avg = Math.max(1e-3, (rateIntegral(p, at + dur + 0.4) - rateIntegral(p, at + 0.4)) / dur);
  const speed = from / (dur * avg) / WHEEL_C;
  const keys = [
    {at, speed},
    {at: at + dur, speed: 0},
  ];
  let dist = 0;
  for (let x = 0; x < at + dur + 1; x += STEP) {
    const m = x + STEP / 2;
    dist += speedAt(keys, m, 0.8) * Math.max(0, keyedValue(p.timeScale, m, 1)) * STEP * WHEEL_C;
  }
  return {keys, dist};
};

/**
 * A car's speed keys (rev/s, scene time): its own `driving`, else the restage creep plus the launch model
 * sampled every 0.8 s (the speed ramp `simRevs` uses), each key carrying the model's speed 0.8 s later, so
 * the eased keys pass through the model's speeds exactly.
 */
const keysOf = (p: Partial<RaceSliceSceneProps>, w: Which, fps = 30): SpeedKey[] => {
  const c = specOf(p, w);
  if (c.driving) return c.driving;
  const keys: SpeedKey[] = [{at: -100, speed: 0}, ...restageKeys(p, c).keys];
  const m = launchOf(c, w);
  const go = m ? sceneTimeAtClock(p, m.react) : undefined;
  if (m && go !== undefined && Number.isFinite(go)) {
    const tab = modelTable(m);
    const end = spanOf(p, fps);
    let k0 = Math.floor((-0.8 - (go - 0.8)) / 0.8);
    k0 = Math.max(0, k0);
    for (let k = k0; ; k++) {
      const at = go - 0.8 + 0.8 * k;
      if (at > end) break;
      const clock = raceClockAt(p, at + 0.8) as number;
      keys.push({at, speed: tableAt(tab.v, tab.h, clock - m.react) / WHEEL_C});
    }
  }
  return keys;
};

/** The gas car's automatic gear and rpm keys from its launch model (when it has no `gear` / `rpm` of its own). */
const gasAuto = (p: Partial<RaceSliceSceneProps>, c: RaceCar, fps = 30): {gear?: GearKey[]; rpm?: Keyed} => {
  const m = launchOf(c, 'gas');
  if (!m || c.driving || raceClockAt(p, 0) === undefined) return {};
  const tab = modelTable(m);
  const shiftAt = tab.shiftU.map((u) => sceneTimeAtClock(p, u + m.react) as number);
  const gear: GearKey[] = [{at: -100, gear: 1}, ...shiftAt.map((at, i) => ({at, gear: i + 2}))];
  const tops = [...m.shifts, (m.shifts[m.shifts.length - 1] ?? 60) * 1.15];
  const rpmAt = (t: number) => {
    const u = (raceClockAt(p, t) as number) - m.react;
    if (u <= 0) return m.idle;
    const g = tab.shiftU.filter((s) => s <= u).length;
    const mph = tableAt(tab.v, tab.h, u) / MPH;
    return Math.max(m.idle, (m.redline * mph) / tops[Math.min(g, tops.length - 1)]);
  };
  const end = spanOf(p, fps);
  const ts = new Set<number>();
  for (let t = -0.5; t <= end; t += 0.25) ts.add(+t.toFixed(3));
  for (const s of shiftAt) if (s > -0.5 && s < end) [s - 0.01, s + 0.2].forEach((x) => ts.add(x));
  const rpm = [...ts].sort((a, b) => a - b).map((at) => ({at, value: rpmAt(at)}));
  return {gear: c.gear === undefined ? gear : undefined, rpm: c.rpm === undefined ? rpm : undefined};
};

/** The default foot: on the accelerator, pressed fully when the car launches. */
const footOf = (p: Partial<RaceSliceSceneProps>, c: RaceCar, w: Which): FootKey[] | undefined => {
  if (c.foot) return c.foot;
  const m = launchOf(c, w);
  const go = m ? sceneTimeAtClock(p, m.react) : undefined;
  const idle: FootKey = {at: -1, pose: 'accel', press: w === 'ev' ? 0.08 : 0.15};
  if (go === undefined || !Number.isFinite(go)) return [idle];
  // the press lands with the launch (it takes 0.5 s of scene time)
  return go - 0.45 <= 0 ? [{at: -1, pose: 'accel', press: 1}] : [idle, {at: go - 0.45, pose: 'accel', press: 1}];
};

/** The `SlicedCar` options for one car (what the scene mounts), at this scene's props. */
export const raceCarOptions = (p: Partial<RaceSliceSceneProps>, w: Which, fps = 30): SlicedCarOptions => {
  const c = specOf(p, w);
  // the race-only fields stay here; everything else goes to `SlicedCar`
  const car: Partial<SlicedCarOptions> & Record<string, unknown> = {...c};
  for (const k of ['launch', 'restage', 'lights', 'from']) delete car[k];
  const auto = w === 'gas' ? gasAuto(p, c, fps) : {};
  return {
    ...car,
    mood: p.mood ?? 'day',
    road: 'street',
    timeScale: p.timeScale,
    driving: keysOf(p, w, fps),
    foot: footOf(p, c, w),
    ...(auto.gear ? {gear: auto.gear} : {}),
    ...(auto.rpm ? {rpm: auto.rpm} : {}),
    startFrame: p.startFrame,
  };
};

/**
 * Where a car starts when the spec doesn't say (`from`): back by its restage creep, or, in a race already
 * underway (`raceFrom` with no carry), as far down the strip as its launch model has run by then.
 */
const defaultFrom = (p: Partial<RaceSliceSceneProps>, c: RaceCar, w: Which) => {
  const m = launchOf(c, w);
  const clock = raceClockAt(p, 0);
  if (m && !c.driving && clock !== undefined && clock > m.react) {
    const tab = modelTable(m);
    return tableAt(tab.d, tab.h, clock - m.react);
  }
  return -restageKeys(p, c).dist;
};

/** A car's centre in strip metres at scene time t (its staged spot is `STAGED`). */
const stripPos = (p: Partial<RaceSliceSceneProps>, w: Which, t: number, fps = 30) => {
  const c = specOf(p, w);
  const o = raceCarOptions(p, w, fps);
  const from = c.from ?? defaultFrom(p, c, w);
  return STAGED + from + (simRevs(o, t, fps) - (c.revsFrom ?? 0)) * WHEEL_C;
};

/**
 * One car's state at scene time t: strip position (m from the line, its centre), speed (m/s and mph, as
 * driven), the model's push (m/s², 0 without a launch model, the shift dips included) and, for the gas
 * car, its gear and rpm. For overlays (a stopwatch row stopping at 60), N4's push arrows and checks.
 */
export const raceCarState = (p: Partial<RaceSliceSceneProps>, w: Which, t: number, fps = 30) => {
  const c = specOf(p, w);
  const o = raceCarOptions(p, w, fps);
  const v = speedAt(o.driving ?? [], t, 0.8) * WHEEL_C;
  const m = launchOf(c, w);
  const clock = raceClockAt(p, t);
  const u = m && clock !== undefined ? clock - m.react : 0;
  const tab = m ? modelTable(m) : undefined;
  return {
    s: stripPos(p, w, t, fps),
    v,
    mph: v / MPH,
    push: tab && !c.driving && u > 0 ? tableAt(tab.a, tab.h, u) : 0,
    gear: w === 'gas' ? gearShiftAt(o.gear, t).gear : undefined,
    rpm: w === 'gas' ? keyedValue(o.rpm, t, 800) : undefined,
  };
};

/** The first scene time (s) a car reaches a speed (mph), or undefined within the scene. */
export const raceTimeTo = (p: Partial<RaceSliceSceneProps>, w: Which, mph: number, fps = 30) => {
  const keys = raceCarOptions(p, w, fps).driving ?? [];
  const end = spanOf(p, fps);
  for (let t = 0; t <= end; t += 1 / fps) if (speedAt(keys, t, 0.8) * WHEEL_C >= mph * MPH) return t;
  return undefined;
};

/** The tracked strip position: between the two cars by `track`. */
const trackedAt = (p: Partial<RaceSliceSceneProps>, t: number, fps = 30) => {
  const k = Math.max(0, Math.min(1, keyedValue(p.track, t, p.framing === 'ev' || p.framing === 'evMotor' ? 1 : 0.5)));
  const g = stripPos(p, 'gas', t, fps);
  const e = stripPos(p, 'ev', t, fps);
  return g + (e - g) * k;
};

/** Strip metres → scene x, at a tracked position. */
const xOf = (s: number, sRef: number) => RACE_CX + sRef - s;

/**
 * What a race-slice scene hands on when the next one continues it (Explainer): each car's place on the
 * strip and its wheels' turn, the V8's crank, and the race clock.
 */
export const raceCarry = (
  p: Partial<RaceSliceSceneProps>,
  durationInFrames: number,
  fps: number,
): {carry: RaceCarry} => {
  const t = durationInFrames / fps;
  const ev = raceCarOptions(p, 'ev', fps);
  const gas = raceCarOptions(p, 'gas', fps);
  const clock = raceClockAt(p, t);
  return {
    carry: {
      ...(clock !== undefined ? {raceFrom: clock} : {}),
      ev: {from: stripPos(p, 'ev', t, fps) - STAGED, revsFrom: simRevs(ev, t, fps)},
      gas: {
        from: stripPos(p, 'gas', t, fps) - STAGED,
        revsFrom: simRevs(gas, t, fps),
        crankFrom: slicedCarCrank(gas, t),
      },
    },
  };
};

// ---------------------------------------------------------------- camera

const raceCameraMove = (
  p: Partial<RaceSliceSceneProps>,
  durationInFrames: number,
  fps: number,
  frame?: number,
): {from: Framing; to: Framing; pre?: {from: Framing; hold: number; move: number; ease: 'cubic'}} => {
  const F = raceFramings(gapOf(p));
  if (p.cameraKeys && p.cameraKeys.length) {
    const base = p.camera?.from ?? F[p.framing ?? 'line'];
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
  const preset = F[p.framing ?? 'line'];
  const c = pre ? undefined : p.cameraFrom;
  const same = c && c.look.every((v, i) => Math.abs(v - preset.look[i]) < 1e-6);
  const from = c && same ? c : preset;
  return {from, to: {look: from.look, distance: from.distance - push * secs}, pre};
};

export const raceCameraStart = (p: Partial<RaceSliceSceneProps>, d: number, fps: number): Framing =>
  raceCameraMove({...p, cameraFrom: undefined, cameraGlide: undefined}, d, fps, 0).from;
export const raceCameraEnd = (p: Partial<RaceSliceSceneProps>, d: number, fps: number): Framing =>
  raceCameraMove(p, d, fps).to;

const raceCameraAt = (p: Partial<RaceSliceSceneProps>, o: {frame: number; fps: number; durationInFrames: number}) => {
  const {from, to, pre} = raceCameraMove(p, o.durationInFrames, o.fps, o.frame);
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

/** A point of one car (its own frame, x forward) → the scene at time t. */
const carPoint = (p: Partial<RaceSliceSceneProps>, w: Which, v: V3, t: number, fps: number): V3 => {
  const o = raceCarOptions(p, w, fps);
  const q = toWorld(o, v);
  const x = xOf(stripPos(p, w, t, fps), trackedAt(p, t, fps));
  return [x + q[0], laneY(p, w) + q[1], q[2]];
};

/**
 * A named point on screen (px) at a frame, for overlays: 'cluster:ev' | 'cluster:gas' (the instrument
 * cluster, for the dashboard boxes' `anchor`), 'top:ev' | 'top:gas' (just above the car's roof: where a
 * card over that lane sits clear of it), 'nose:ev' | 'nose:gas', 'tree:ev' | 'tree:gas' (the ambers),
 * 'lane:ev' | 'lane:gas' (the lane block's front top edge under the car's centre).
 */
export const raceAnchorOnScreen = (
  p: Partial<RaceSliceSceneProps>,
  anchor: string,
  o: {frame: number; fps: number; durationInFrames: number},
): [number, number] | undefined => {
  const [name, which] = anchor.split(':');
  if (which !== 'ev' && which !== 'gas') return undefined;
  const w = which as Which;
  const t = o.frame / o.fps;
  const cam = raceCameraAt(p, o);
  const opts = raceCarOptions(p, w, o.fps);
  const lay = layoutOf(opts);
  const sRef = trackedAt(p, t, o.fps);
  if (name === 'cluster') {
    const k = lay.cluster;
    return projectToFrame(cam, carPoint(p, w, [k[0] + 0.07, k[1] + 0.06, k[2]], t, o.fps));
  }
  if (name === 'top') return projectToFrame(cam, carPoint(p, w, [0, lay.roofCut + 0.15, 0], t, o.fps));
  if (name === 'nose') return projectToFrame(cam, carPoint(p, w, [2.3, 0.6, 0.6], t, o.fps));
  if (name === 'lane') {
    const x = xOf(stripPos(p, w, t, o.fps), sRef);
    return projectToFrame(cam, [x, laneY(p, w), LANE.front]);
  }
  if (name === 'tree') {
    const x = xOf(p.treeAhead ?? 3.6, sRef);
    return projectToFrame(cam, [x, laneY(p, w) + treeAmberY(p), treeZOf(p)]);
  }
  return undefined;
};

// ---------------------------------------------------------------- the set

/**
 * The light column's z: 'far' (default) just in front of the guard wall, so the cars pass in front of it;
 * 'near' between the car's cut and the block's front face (in front of the cars as they pass). 'far' sits just
 * behind the cars' far side (z −1.25).
 */
const treeZOf = (p: Partial<RaceSliceSceneProps>) => ((p.treeSide ?? 'far') === 'far' ? -1.25 : 1.28);
/** The ambers' middle above the road (m). */
const treeAmberY = (p: Partial<RaceSliceSceneProps>) => ((p.treePole ?? 0.2) + 0.9) * (p.treeScale ?? 1);

/**
 * A strip surface (bytes display-referred like `textures.ts`), u along the strip (one `TILE`, tiling), v across
 * the lane, and its roughness map (G). The realism pass ("the road too", owner): concrete with fine grain,
 * mottling and aggregate specks, saw-cut joints across every slab and along the lane (its middle and near its
 * cut edge); asphalt with a fine grain and light specks; and in both the two rubbered wheel tracks, streaked
 * along the strip, heavier on the pad, smoother (a slight sheen, never a mirror) than the bare surface.
 */
const surfaceTexture = (kind: 'concrete' | 'asphalt') => {
  const W = 512;
  const H = 256;
  const conc = kind === 'concrete';
  const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const base = hex(conc ? RACE.concrete : RACE.asphalt);
  const rubber = hex(RACE.rubber);
  const data = new Uint8Array(W * H * 4);
  const rough = new Uint8Array(W * H * 4);
  for (let j = 0; j < H; j++) {
    // v 0 at the front cut (+z) → 1 at the back
    const z = LANE.front - ((j + 0.5) / H) * (LANE.front - LANE.back);
    // the two wheel tracks: a flat-topped band a tire wide in each wheel path
    const path = Math.max(...[-CAR_LAYOUT.track, CAR_LAYOUT.track].map((zw) => Math.exp(-(((z - zw) / 0.24) ** 4))));
    for (let i = 0; i < W; i++) {
      // streaks along the strip: fast across (j), slow along (i; wraps with the tile)
      const streak = vnoise(i / 64, j * 0.45, W / 64);
      const rub = path * (conc ? 0.62 : 0.45) * (0.55 + 0.45 * streak);
      const grain = (vnoise(i * 0.7, j * 0.7, Math.round(W * 0.7)) - 0.5) * (conc ? 14 : 20);
      const mottle = (vnoise(i / 40, j / 26, W / 40) - 0.5) * (conc ? 18 : 10);
      const speck = vnoise(i, j + (conc ? 7919 : 15401));
      const spot = speck > 0.992 ? 22 : speck < 0.006 ? -18 : 0;
      // saw-cut joints: across at each slab's end, and along the lane (its middle, near the cut edge)
      const joint = conc && (i < 2 || Math.abs(z + 0.42) < 0.014 || Math.abs(z - 1.3) < 0.012);
      const o = (j * W + i) * 4;
      for (let c = 0; c < 3; c++) {
        const g = base[c] + grain + mottle + spot * (1 - rub);
        data[o + c] = Math.max(0, Math.min(255, (g + (rubber[c] - g) * rub) * (joint ? 0.7 : 1)));
      }
      data[o + 3] = 255;
      const r = (conc ? 0.9 : 0.93) - 0.34 * rub + (joint ? 0.05 : 0);
      rough[o] = rough[o + 1] = rough[o + 2] = Math.round(255 * Math.max(0, Math.min(1, r)));
      rough[o + 3] = 255;
    }
  }
  const mk = (d: Uint8Array<ArrayBuffer>) => {
    const t = new THREE.DataTexture(d, W, H, THREE.RGBAFormat);
    t.wrapS = THREE.RepeatWrapping;
    t.magFilter = THREE.LinearFilter;
    t.minFilter = THREE.LinearMipmapLinearFilter;
    t.generateMipmaps = true;
    t.anisotropy = 8;
    t.needsUpdate = true;
    return t;
  };
  return {map: mk(data), rough: mk(rough)};
};

/**
 * The rubbered launch area (the burnout box and the first metres past the line): the tire rubber laid down
 * in both wheel paths, dark behind the line and fading out ahead, so the white start line reads on it.
 * Alpha in the texture; u runs from `RUBBER.ahead` (u = 0) back to `RUBBER.behind` (u = 1). Streaked along
 * the strip (the realism pass), its material smoother than the bare surface (a slight sheen).
 */
const RUBBER = {behind: -9, ahead: 32};
const rubberTexture = () => {
  const W = 512;
  const H = 128;
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(RACE.rubber.slice(i, i + 2), 16));
  const data = new Uint8Array(W * H * 4);
  for (let j = 0; j < H; j++) {
    const z = LANE.front - ((j + 0.5) / H) * (LANE.front - LANE.back);
    const path = Math.max(
      ...[-CAR_LAYOUT.track, CAR_LAYOUT.track].map((zw) => Math.max(0, 1 - ((z - zw) / 0.5) ** 2)),
    );
    const core = Math.max(...[-CAR_LAYOUT.track, CAR_LAYOUT.track].map((zw) => Math.exp(-(((z - zw) / 0.2) ** 4))));
    const across = Math.min(1, 0.2 + 0.6 * path + 0.35 * core);
    for (let i = 0; i < W; i++) {
      const sm = RUBBER.ahead - ((i + 0.5) / W) * (RUBBER.ahead - RUBBER.behind);
      const along = sm < RUBBER.behind + 2 ? (sm - RUBBER.behind) / 2 : sm < 3 ? 1 : Math.max(0, 1 - (sm - 3) / (RUBBER.ahead - 3)) ** 1.6;
      const streak = 0.7 + 0.3 * vnoise(i / 40, j * 0.6);
      const grain = 0.92 + 0.08 * (vnoise(i * 0.8, j * 0.8) * 2 - 1);
      const a = Math.max(0, Math.min(1, 0.86 * along * across * streak * grain));
      const o = (j * W + i) * 4;
      data[o] = r;
      data[o + 1] = g;
      data[o + 2] = b;
      data[o + 3] = Math.round(a * 255);
    }
  }
  const t = new THREE.DataTexture(data, W, H, THREE.RGBAFormat);
  t.magFilter = THREE.LinearFilter;
  t.minFilter = THREE.LinearFilter;
  t.needsUpdate = true;
  return t;
};

type SetMats = {
  rubber: THREE.MeshStandardMaterial;
  concrete: THREE.MeshStandardMaterial;
  asphalt: THREE.MeshStandardMaterial;
  cut: THREE.Material;
  earth: THREE.MeshStandardMaterial;
  hidden: THREE.Material;
  wall: THREE.MeshStandardMaterial;
  stand: THREE.MeshStandardMaterial;
  steel: THREE.MeshStandardMaterial;
  /** The realism pass: three scuffed wall faces (cycled along the wall), the painted lines, the benches, the field. */
  walls: THREE.MeshStandardMaterial[];
  line: THREE.MeshStandardMaterial;
  seat: THREE.MeshStandardMaterial;
  field: THREE.MeshStandardMaterial;
};

/** The strip's scenery switches (all on by default; see `RaceSliceSceneProps`). */
type Scenery = {markings: boolean; posts: boolean; fence: boolean; poles: boolean};
/** Light poles behind the top lane's wall: every this many metres along the strip, at this z. */
const POLES = {every: 38, phase: 19, z: -2.44, height: 9};

/** One lane's cut block, its two surfaces, the guard wall's segments (all scrolling with `sRef`). */
const LaneBlock: React.FC<{
  y: number;
  sRef: number;
  pad: number;
  mats: SetMats;
  ink: number;
  scenery: Scenery;
  /** The top lane: light poles behind its wall (the bottom lane's would run up through the top lane's block). */
  top: boolean;
}> = ({y, sRef, pad, mats, ink, scenery, top}) => {
  const L = LANE.half;
  const w = LANE.front - LANE.back;
  const zc = (LANE.front + LANE.back) / 2;
  // concrete where s < pad, i.e. x > xp
  const xp = xOf(pad, sRef);
  const conc: [number, number] | null = xp < L ? [Math.max(-L, xp), L] : null;
  const asph: [number, number] | null = xp > -L ? [-L, Math.min(L, xp)] : null;
  // the rubbered launch area, drawn whole (its texture fixed to it) while it is on the block
  const r0 = xOf(RUBBER.ahead, sRef);
  const r1 = xOf(RUBBER.behind, sRef);
  const rubber: [number, number] | null = r1 > -L && r0 < L ? [Math.max(-L, r0), Math.min(L, r1)] : null;
  if (rubber) {
    // crop the texture to the part on the block (shared by both lanes, which scroll together)
    const map = mats.rubber.map!;
    map.repeat.set((rubber[1] - rubber[0]) / (r1 - r0), 1);
    map.offset.x = (rubber[0] - r0) / (r1 - r0);
  }
  const wallSegs: [number, number, number][] = [];
  const joints: number[] = [];
  const k0 = Math.floor((sRef + RACE_CX - L) / LANE.seg);
  const k1 = Math.ceil((sRef + RACE_CX + L) / LANE.seg);
  for (let k = k0; k <= k1; k++) {
    const a = Math.max(-L, xOf((k + 1) * LANE.seg, sRef) + 0.035);
    const b = Math.min(L, xOf(k * LANE.seg, sRef) - 0.035);
    if (b - a > 0.05) wallSegs.push([a, b, k]);
    const j = xOf(k * LANE.seg, sRef);
    if (Math.abs(j) < L - 0.05) joints.push(j);
  }
  const poles: number[] = [];
  if (top && scenery.poles) {
    const p0 = Math.ceil((sRef + RACE_CX - L + 1 - POLES.phase) / POLES.every);
    const p1 = Math.floor((sRef + RACE_CX + L - 1 - POLES.phase) / POLES.every);
    for (let k = p0; k <= p1; k++) poles.push(xOf(k * POLES.every + POLES.phase, sRef));
  }
  const startX = xOf(0, sRef);
  const line = (z: number, width: number) => (
    <mesh material={mats.line} position={[0, 0.0016, z]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[2 * L, width]} />
    </mesh>
  );
  const rects: Rect[] = [
    [
      [-L, -LANE.depth, LANE.front],
      [L, 0, LANE.front],
    ],
    [
      [-L, -LANE.depth, LANE.back],
      [-L, 0, LANE.front],
    ],
    [
      [L, -LANE.depth, LANE.back],
      [L, 0, LANE.front],
    ],
  ];
  const surface = (r: [number, number] | null, m: THREE.MeshStandardMaterial) => {
    if (!r) return null;
    return (
      <mesh
        material={m}
        position={[(r[0] + r[1]) / 2, 0.0005, zc]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[r[1] - r[0], w, 1]}
        receiveShadow
      >
        <planeGeometry args={[1, 1]} />
      </mesh>
    );
  };
  return (
    <group position={[0, y, 0]}>
      <mesh
        position={[0, -LANE.depth / 2, zc]}
        material={[mats.cut, mats.cut, mats.hidden, mats.earth, mats.cut, mats.earth]}
        receiveShadow
      >
        <boxGeometry args={[2 * L, LANE.depth, w]} />
      </mesh>
      {surface(conc, mats.concrete)}
      {surface(asph, mats.asphalt)}
      {rubber ? (
        <mesh
          material={mats.rubber}
          position={[(rubber[0] + rubber[1]) / 2, 0.001, zc]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={[rubber[1] - rubber[0], w, 1]}
          receiveShadow
        >
          <planeGeometry args={[1, 1]} />
        </mesh>
      ) : null}
      {wallSegs.map(([a, b, k], i) => (
        <mesh
          key={i}
          material={mats.walls[((k % 3) + 3) % 3]}
          position={[(a + b) / 2, LANE.wallH / 2, LANE.wallZ]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[b - a, LANE.wallH, LANE.wallT]} />
        </mesh>
      ))}
      {scenery.markings ? (
        <>
          {/* the lane's lines: the centre line by the cut (the other lane's side), the edge line by the wall */}
          {line(1.45, 0.1)}
          {line(-1.9, 0.1)}
        </>
      ) : null}
      {scenery.posts && Math.abs(startX) < L - 1 ? (
        <>
          {/* the stage-beam posts by the line, both sides of the lane, the beams across it */}
          <TimingPost position={[startX + 0.12, 0, -1.4]} />
          <TimingPost position={[startX + 0.12, 0, 1.38]} rotationY={Math.PI} />
        </>
      ) : null}
      {scenery.fence ? (
        <ChainFence
          x0={-L}
          x1={L}
          z={LANE.wallZ - LANE.wallT / 2 - 0.06}
          y0={LANE.wallH - 0.02}
          y1={LANE.wallH + 1.25}
          posts={joints}
          offset={RACE_CX + sRef}
        />
      ) : null}
      {poles.map((x, i) => (
        <LightPole key={i} position={[x, 0, POLES.z]} height={POLES.height} />
      ))}
      <CutOutline rects={rects} thickness={ink} />
    </group>
  );
};

/** The empty grandstand on its own cut block (tiers and posts scroll with the strip). */
const Grandstand: React.FC<{y: number; sRef: number; mats: SetMats; ink: number; crowd: number}> = ({
  y,
  sRef,
  mats,
  ink,
  crowd,
}) => {
  const L = LANE.half;
  const a = Math.max(-L, xOf(STAND.to, sRef));
  const b = Math.min(L, xOf(STAND.from, sRef));
  if (b - a < 0.5) return null;
  const deep = STAND.front - STAND.back;
  const row = deep / STAND.rows;
  const posts: number[] = [];
  const k0 = Math.ceil((sRef + RACE_CX - b) / STAND.post);
  const k1 = Math.floor((sRef + RACE_CX - a) / STAND.post);
  for (let k = k0; k <= k1; k++) posts.push(xOf(k * STAND.post, sRef));
  const topY = STAND.rows * STAND.rise;
  // the realism pass: a bench on each tier, a front railing, spectators on some seats (seeded per seat)
  const bench = (r: number) => ({z: STAND.front - r * row - row * 0.42, y: (r + 1) * STAND.rise + 0.4});
  const rails: number[] = [];
  const f0 = Math.ceil((sRef + RACE_CX - b) / 2.5);
  const f1 = Math.floor((sRef + RACE_CX - a) / 2.5);
  for (let k = f0; k <= f1; k++) rails.push(xOf(k * 2.5, sRef));
  const people: Spectator[] = [];
  const SEAT = 0.72;
  if (crowd > 0) {
    for (let r = 0; r < STAND.rows; r++) {
      const c0 = Math.ceil((sRef + RACE_CX - b + 0.4) / SEAT);
      const c1 = Math.floor((sRef + RACE_CX - a - 0.4) / SEAT);
      for (let c = c0; c <= c1; c++) {
        // clusters: friends sit together (a slow noise raises the odds in places)
        const odds = crowd * (0.5 + vnoise(c / 9, r * 3.1 + 11));
        if (random(`crowd-${r}-${c}`) >= odds) continue;
        const bz = bench(r);
        people.push({
          p: [xOf(c * SEAT, sRef) + (random(`crowd-dx-${r}-${c}`) - 0.5) * 0.12, bz.y + 0.025, bz.z],
          top: Math.floor(random(`crowd-top-${r}-${c}`) * 8),
          skin: Math.floor(random(`crowd-skin-${r}-${c}`) * 4),
          lean: (random(`crowd-lean-${r}-${c}`) - 0.35) * 0.3,
        });
      }
    }
  }
  const rects: Rect[] = [
    [
      [a, -STAND.depth, STAND.front],
      [b, 0, STAND.front],
    ],
  ];
  return (
    <group position={[0, y, 0]}>
      <mesh
        position={[(a + b) / 2, -STAND.depth / 2, (STAND.front + STAND.back) / 2]}
        material={[mats.cut, mats.cut, mats.earth, mats.earth, mats.cut, mats.earth]}
        receiveShadow
      >
        <boxGeometry args={[b - a, STAND.depth, deep]} />
      </mesh>
      {[...Array(STAND.rows).keys()].map((r) => {
        const z0 = STAND.front - r * row;
        const h = (r + 1) * STAND.rise;
        return (
          <mesh
            key={r}
            material={mats.stand}
            position={[(a + b) / 2, h / 2, (z0 + STAND.back) / 2]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[b - a, h, z0 - STAND.back]} />
          </mesh>
        );
      })}
      {posts.map((x, i) => (
        <mesh key={i} material={mats.steel} position={[x, topY + 0.5, STAND.back + 0.08]} castShadow>
          <boxGeometry args={[0.06, 1.0, 0.06]} />
        </mesh>
      ))}
      <mesh material={mats.steel} position={[(a + b) / 2, topY + 0.98, STAND.back + 0.08]}>
        <boxGeometry args={[b - a, 0.05, 0.05]} />
      </mesh>
      {[...Array(STAND.rows).keys()].map((r) => (
        <mesh key={`b${r}`} material={mats.seat} position={[(a + b) / 2, bench(r).y, bench(r).z]} castShadow receiveShadow>
          <boxGeometry args={[b - a, 0.05, 0.3]} />
        </mesh>
      ))}
      {/* the front railing on the lowest tier: posts, a top and a middle rail */}
      {rails.map((x, i) => (
        <mesh key={`r${i}`} material={mats.steel} position={[x, STAND.rise + 0.5, STAND.front - 0.08]}>
          <boxGeometry args={[0.05, 1.0, 0.05]} />
        </mesh>
      ))}
      {[0.98, 0.55].map((h) => (
        <mesh key={h} material={mats.steel} position={[(a + b) / 2, STAND.rise + h, STAND.front - 0.08]}>
          <boxGeometry args={[b - a, 0.045, 0.045]} />
        </mesh>
      ))}
      {people.length ? <Crowd people={people} /> : null}
      <CutOutline rects={rects} thickness={ink} />
    </group>
  );
};

/** A soft round puff (alpha falls off from the middle), for the launch haze. */
let puffTex: THREE.DataTexture | null = null;
const puffTexture = () => {
  if (puffTex) return puffTex;
  const N = 64;
  const data = new Uint8Array(N * N * 4);
  for (let j = 0; j < N; j++)
    for (let i = 0; i < N; i++) {
      const d = Math.hypot((i + 0.5) / N - 0.5, (j + 0.5) / N - 0.5) * 2;
      const wob = 0.85 + 0.15 * vnoise(i / 6, j / 6);
      const o = (j * N + i) * 4;
      data[o] = data[o + 1] = data[o + 2] = 255;
      data[o + 3] = Math.round(255 * Math.max(0, 1 - d / wob) ** 1.8);
    }
  puffTex = new THREE.DataTexture(data, N, N, THREE.RGBAFormat);
  puffTex.magFilter = THREE.LinearFilter;
  puffTex.minFilter = THREE.LinearFilter;
  puffTex.needsUpdate = true;
  return puffTex;
};
const HAZE = {puffs: 8, every: 0.06, life: 1.6};

/** One car's launch haze (see `RaceSliceSceneProps.launchHaze`), in the scene's frame. */
const LaunchHaze: React.FC<{p: Partial<RaceSliceSceneProps>; w: Which; t: number; fps: number; sRef: number; exposure: number}> = ({
  p,
  w,
  t,
  fps,
  sRef,
  exposure,
}) => {
  const mats = useMemo(
    () =>
      [...Array(HAZE.puffs * 2).keys()].map(
        () =>
          new THREE.SpriteMaterial({map: puffTexture(), color: raw(RACE.haze), transparent: true, depthWrite: false, opacity: 0}),
      ),
    [],
  );
  const c = specOf(p, w);
  const m = launchOf(c, w);
  const clock = raceClockAt(p, t);
  if (!m || c.driving || clock === undefined) return null;
  const u = clock - m.react;
  if (u < 0 || u > HAZE.puffs * HAZE.every + HAZE.life) return null;
  const k = w === 'ev' ? 0.45 : 1;
  const y = laneY(p, w);
  const out: React.ReactNode[] = [];
  for (let i = 0; i < HAZE.puffs; i++) {
    const born = i * HAZE.every;
    const age = u - born;
    if (age < 0 || age > HAZE.life) continue;
    const tb = sceneTimeAtClock(p, born + m.react);
    if (tb === undefined || !Number.isFinite(tb)) continue;
    // where the rear tires were when the puff left them (the car faces −x: its rear axle is at +1.35)
    const x0 = xOf(stripPos(p, w, tb, fps), sRef) - CAR_LAYOUT.axleX.rear;
    const f = age / HAZE.life;
    const size = (0.5 + 1.6 * f ** 0.6) * (0.8 + 0.4 * random(`haze-${w}-s${i}`));
    for (const [j, z] of [CAR_LAYOUT.track, -CAR_LAYOUT.track].entries()) {
      const mat = mats[i * 2 + j];
      mat.opacity = Math.min(1, 0.5 * k * (1 - f) ** 1.4 * Math.min(1, age / 0.08));
      mat.color.copy(raw(RACE.haze)).multiplyScalar(1 / exposure);
      out.push(
        <sprite
          key={`${i}-${j}`}
          material={mat}
          position={[x0 + 0.6 * f + (random(`haze-${w}-x${i}-${j}`) - 0.5) * 0.3, y + 0.15 + 0.55 * f, z + 0.25 * f * (j ? -1 : 1)]}
          scale={[size, size * 0.8, 1]}
        />,
      );
    }
  }
  return <>{out}</>;
};

/** The world beyond (the realism pass): a field on its own cut block far behind the grandstand, a tree line on it. */
const HORIZON = {front: -30, back: -150, depth: 0.9, half: 110, trees: [-92, -118] as [number, number]};
const Horizon: React.FC<{mood: Mood; y: number; sRef: number; mats: SetMats; ink: number}> = ({mood, y, sRef, mats, ink}) => {
  const H = HORIZON;
  const deep = H.front - H.back;
  // the field's texture runs with the strip (one tile 24 m)
  const fmap = mats.field.map!;
  fmap.repeat.set((2 * H.half) / 24, deep / 24);
  fmap.offset.x = -(RACE_CX + sRef) / 24;
  return (
    <group position={[0, y, 0]}>
      <mesh position={[0, -H.depth / 2, (H.front + H.back) / 2]} material={[mats.hidden, mats.hidden, mats.field, mats.hidden, mats.cut, mats.hidden]}>
        <boxGeometry args={[2 * H.half, H.depth, deep]} />
      </mesh>
      <TreeLine mood={mood} x0={-H.half} x1={H.half} z={H.trees} y={0} offset={-(RACE_CX + sRef)} />
      <CutOutline
        rects={[
          [
            [-H.half, -H.depth, H.front],
            [H.half, 0, H.front],
          ],
        ]}
        thickness={ink * 2.2}
      />
    </group>
  );
};

/**
 * R, the drag strip (No. 007): two lanes stacked as a twin section, the electric car on top, each a cut
 * `SlicedCar` on its own cut lane block with its light column, start line, distance boards and guard
 * wall; a grandstand far behind. The camera tracks the pair at the fixed angle; launch models, restage
 * creeps and slow motion move the cars, and the gap between them is what moves on screen.
 */
export const RaceSliceScene: React.FC<RaceSliceSceneProps> = (props) => {
  const {durationInFrames, mood = 'day', startFrame = 0} = props;
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const m = MOODS[mood];
  const gap = gapOf(props);
  const {from, to, pre} = raceCameraMove(props, durationInFrames, fps, frame);
  const cam = raceCameraAt(props, {frame, fps, durationInFrames});
  const camD = cam.position.distanceTo(cam.look);
  const ink = INK * Math.max(0.3, Math.min(5, camD / 12.75));

  const sky = useMemo(() => new THREE.MeshBasicMaterial({map: skyTexture(mood), fog: false}), [mood]);
  sky.color.setScalar(1 / m.exposure);
  const mats = useMemo<SetMats>(() => {
    const surf = (kind: 'concrete' | 'asphalt') =>
      (() => {
        const t = surfaceTexture(kind);
        return new THREE.MeshStandardMaterial({color: raw('#ffffff'), roughness: 1, map: t.map, roughnessMap: t.rough});
      })();
    return {
      rubber: new THREE.MeshStandardMaterial({
        color: raw('#ffffff'),
        roughness: 0.6,
        map: rubberTexture(),
        transparent: true,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -1,
      }),
      concrete: surf('concrete'),
      asphalt: surf('asphalt'),
      cut: cutMaterial(),
      earth: new THREE.MeshStandardMaterial({color: raw(m.earth), roughness: 1}),
      hidden: new THREE.MeshBasicMaterial({visible: false}),
      wall: new THREE.MeshStandardMaterial({color: raw(RACE.concrete), roughness: 0.85}),
      stand: new THREE.MeshStandardMaterial({color: raw(RACE.concrete), roughness: 0.8}),
      steel: new THREE.MeshStandardMaterial({color: raw(HIGHWAY.galvanized), roughness: 0.45, metalness: 0.6}),
      walls: [0, 1, 2].map((k) => new THREE.MeshStandardMaterial({color: raw('#ffffff'), roughness: 0.85, map: wallTexture(k)})),
      line: new THREE.MeshStandardMaterial({
        color: raw(HIGHWAY.lineWhite),
        roughness: 0.75,
        polygonOffset: true,
        polygonOffsetFactor: -2,
      }),
      seat: new THREE.MeshStandardMaterial({color: raw(RACE.standSeat), roughness: 0.5, metalness: 0.4}),
      field: new THREE.MeshStandardMaterial({color: raw('#ffffff'), roughness: 1, map: fieldTexture()}),
    };
  }, [m.earth]);

  const sRef = trackedAt(props, t, fps);
  const pad = props.padLength ?? 100;
  // the surfaces' textures run in strip metres: u = (x − RACE_CX − sRef) / TILE across each plane's span
  const L = LANE.half;
  const xp = xOf(pad, sRef);
  const spans: Record<'concrete' | 'asphalt', [number, number]> = {
    concrete: [Math.max(-L, xp), L],
    asphalt: [-L, Math.min(L, xp)],
  };
  (['concrete', 'asphalt'] as const).forEach((k) => {
    const [x0, x1] = spans[k];
    for (const map of [mats[k].map!, mats[k].roughnessMap!]) {
      map.repeat.set(Math.max(1e-3, x1 - x0) / TILE, 1);
      map.offset.x = (x0 - RACE_CX - sRef) / TILE;
    }
  });

  const lightsFor = (w: Which): TreeKey[] | undefined => {
    const own = props[w]?.lights ?? props.lights;
    if (own) return own;
    if (props.green !== undefined) return [
      {at: -10, prestage: true, stage: true, amber: true},
      {at: props.green, prestage: true, stage: true, green: true},
    ];
    return undefined;
  };
  const boards = props.boards === false ? [] : (props.boards ?? DRAG_BOARDS);
  const scenery: Scenery = {
    markings: props.markings ?? true,
    posts: props.timingPosts ?? true,
    fence: props.fence ?? true,
    poles: props.lightPoles ?? true,
  };
  const treeX = xOf(props.treeAhead ?? 3.6, sRef);
  const startX = xOf(0, sRef);

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
        <SectionLights mood={mood} target={[RACE_CX, gap / 2, 0]} lamp={0} extent={9} figureSpot={false} />
        {/* the sky, far behind the horizon's tree line (the realism pass moved it back from z −60) */}
        <mesh position={[0, gap / 2 + 20, -165]} material={sky}>
          <planeGeometry args={[900, 480]} />
        </mesh>
        {WHICH.map((w) => {
          const y = laneY(props, w);
          const base = raceCarOptions(props, w, fps);
          // the in-car cluster shows the speed as driven (mph)
          const mph = (speedAt(base.driving ?? [], t, 0.8) * WHEEL_C) / MPH;
          // the electric car's near wheels ghosted in a close look at a drive unit (`wheelGhost`)
          const ghostTo = props.wheelGhost === false ? 1 : (props.wheelGhost ?? 0.3);
          const ghostOf = (ax: number): number => {
            if (w !== 'ev' || ghostTo >= 1) return 1;
            const hub = new THREE.Vector3(...carPoint(props, w, [ax, CAR_LAYOUT.wheelR, CAR_LAYOUT.cutZ + 0.12], t, fps));
            const near = Math.max(0, Math.min(1, (7.5 - camD) / 1.5));
            const at = Math.max(0, Math.min(1, (2.0 - cam.look.distanceTo(hub)) / 0.7));
            const k = near * at * near * at * (3 - 2 * near * at);
            return 1 - (1 - ghostTo) * Math.min(1, k * 1.0);
          };
          const wheelGhost = {FR: ghostOf(CAR_LAYOUT.axleX.front), RR: ghostOf(CAR_LAYOUT.axleX.rear)};
          const opts = {...base, clusterSpeed: props[w]?.clusterSpeed ?? Math.round(mph), wheelGhost};
          const x = xOf(stripPos(props, w, t, fps), sRef);
          return (
            <React.Fragment key={w}>
              <LaneBlock y={y} sRef={sRef} pad={pad} mats={mats} ink={ink} scenery={scenery} top={w === 'ev'} />
              {Math.abs(startX) < L ? (
                <StartLine x={startX} z0={LANE.back + 0.6} z1={LANE.front} y={y + 0.001} width={0.3} />
              ) : null}
              {Math.abs(treeX) < L - 0.5 ? (
                <DragTree
                  mood={mood}
                  position={[treeX, y, treeZOf(props)]}
                  pole={props.treePole ?? 0.2}
                  rotationY={props.treeYaw ?? 0.9}
                  lights={lightsFor(w)}
                  t={t}
                  scale={props.treeScale ?? 1}
                />
              ) : null}
              {boards.map((b) => {
                const bx = xOf(b.at, sRef);
                return Math.abs(bx) < L - 1 ? (
                  <DistanceBoard
                    key={b.text}
                    text={b.text}
                    position={[bx, y, LANE.wallZ + 0.3]}
                    size={[1.3, 0.52]}
                    bottom={0.92}
                  />
                ) : null;
              })}
              <group position={[x, y, 0]}>
                <SlicedCar {...opts} ground={false} cameraDistance={camD} />
              </group>
              {props.launchHaze === false ? null : (
                <LaunchHaze p={props} w={w} t={t} fps={fps} sRef={sRef} exposure={m.exposure} />
              )}
            </React.Fragment>
          );
        })}
        {props.grandstand === false ? null : (
          <Grandstand y={gap} sRef={sRef} mats={mats} ink={ink} crowd={props.crowd ?? 0.2} />
        )}
        {props.horizon === false ? null : <Horizon mood={mood} y={gap} sRef={sRef} mats={mats} ink={ink} />}
      </SectionStage>
    </AbsoluteFill>
  );
};
