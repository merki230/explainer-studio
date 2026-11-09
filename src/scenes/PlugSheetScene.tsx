import React, {useMemo} from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import * as THREE from 'three';
import {CAR, MOODS, TWINS, WINTER, type Mood} from '../theme';
import {raw} from '../three/plaster';
import {HeatFlow} from '../three/real/HeatKit';
import {Snow} from '../three/section/Snowfall';
import type {ShellProfile} from '../three/real/CarShell';
import {ChargeCable, plugTail, type PlugPose} from '../three/real/ChargeCable';
import {ChargeDriverFigure, driverLook} from '../three/real/ChargeDriver';
import {
  autoDriver,
  driverGeo,
  driverPoseAt,
  driverTimeline,
  type ChargeDriver,
  type DriverGeo,
  type DriverKey,
  type DriverPose,
  type DriverSpot,
  type DriverTimeline,
} from '../three/real/chargeMotion';
import {CABINET, CHARGER_AT, ChargerCabinet, DriftingClouds, ISLAND_H, StationClock} from '../three/real/ChargeSite';
import {FuelNozzle, PUMP, PumpIsland, type NozzlePose} from '../three/real/FuelPump';
import {GhostCar, ghostRoof} from '../three/real/GhostCar';
import {GARAGE, HomeGarage} from '../three/real/HomeGarage';
import {
  CLOUD_SPEED,
  homeLegs,
  laneDriveAt,
  laneRevs,
  meterAt,
  sectionTime,
  slabAt,
  bayToStall,
  STALL_TURN,
  stallPoseAt,
  stallRevs,
  stallToBay,
  stallYaw,
  step,
  sunSwing,
  type FeeSlab,
  type HomeTrip,
  type MeterKeys,
  type PlugLoop,
  type StallArrive,
  type StallLeave,
} from '../three/real/plugMotion';
import {carLayout, chargePortAt} from '../three/real/RealCar';
import {layoutOf, SlicedCar, type SlicedCarOptions} from '../three/real/SlicedCar';
import {
  ChargeRow,
  dialCentre,
  dialTip,
  FeePieces,
  postFoot,
  ReverseLamps,
  ROW,
  RowFeed,
  StationSupply,
  supplyRoute,
} from '../three/real/StationSupply';
import {capRevs} from '../three/real/wheelMotion';
import {GlowNode, GlowPolyline, pointAlong} from '../three/section/GlowLines';
import {
  formatOf,
  projectToFrame,
  SectionCamera,
  sectionCameraAt,
  useFormatProps,
  widenFraming,
  type Framing,
} from '../three/section/SectionCamera';
import {SectionLights, SectionStage} from '../three/section/SectionStage';
import {skyTexture} from '../three/section/textures';
import {ease, framingAtKeys, keyedValue, type CameraKey, type Keyed} from './keyframes';

/*
 * P, the plug sheet (No. 016 `ev-cost`, N1–N4, N8). Three cut sections stacked on one sheet at the fixed angle, sky
 * between them, the three plugs of the story (top → bottom):
 *  - the home garage (`HomeGarage`): YOU's EV parked nose in at a generic wall charger, YOU's beats (walk, the house
 *    door in and out, plug and unplug, lean on the car, phone), trips out and back (it reverses out to the driveway and
 *    drives back in nose first), the charger's status LED, the house meter's dial turning;
 *  - the pump island (`PumpIsland`, `FuelNozzle`): the gas twin (same body, `TWINS.gasPaint`) with its filler door, an
 *    extra fuelling it with the charge kit's driver beats (take the nozzle, door open, nozzle in, hold, click-off,
 *    nozzle back, door shut); no price sign, a dark display;
 *  - the US fast-charger row (`ChargeRow`, `StationSupply`): four back-in stalls (the charge kit's US bay turned a
 *    quarter turn: noses toward the camera, the cut driver's side to the right, the post at the stall's far end
 *    behind the left rear corner; cable, kerb stone, extras as drivers), cars coming along the aisle in front from
 *    frame right and reversing in, leaving forward to frame left; the station clock; the supply at the row's right
 *    end (pole, transformer, meter cabinet) whose needle follows the row's load.
 * The system (orange, F4): only the demand fee: the meter's peak pointer, the route from the meter up the pole, the fee
 * slab and its pieces sliding along the cut-face feed to the posts. Charging current and charge levels are not drawn;
 * the port rings and the wall charger's LED are `signalGreen`.
 *
 * Time: every key is in scene seconds, or (`clock: 'video'`) in video seconds, so one set of section keys can serve
 * every plug-sheet scene of a video and the world runs on across glides and slides. The time-lapse (`timelapse`) turns
 * the clock into story minutes: the sun swings (periodic per story day), the clouds drift (a whole number of wraps per
 * day) and the station clock spins, so whole days land on the story time again. The loop (`loop`, N8): from each
 * section's switch time, that section plays the lead-in to frame 0 (its time becomes t − `loop.end`), so the last frame
 * is frame 0 (switch each section while it's off frame).
 *
 * World: y up, z toward the camera; the fast row's surface at y 0, the pump's at `sectionY.pump`, the garage's at
 * `sectionY.home`. Each lane section (home, pump) uses the charge kit's bay frame (the car parked at x 0 facing −x);
 * each stall of the row uses the bay frame turned a quarter turn about y (`STALL_TURN`, a pure yaw, never a reflection:
 * the car's nose toward the camera, its left, cut side toward +x), so the kit's drivers and cables work unchanged.
 */

type V3 = [number, number, number];
type P2 = [number, number];

export type PlugSheetFraming = 'sheet' | 'plugs' | 'home' | 'homeWide' | 'pump' | 'fast' | 'row' | 'rowLow' | 'supply' | 'garageWide' | 'garageFeed';

/** A beat for YOU at home: the charge kit's `DriverKey`, with home spots for `walkTo` / `lean`. */
export type HomeSpot = DriverSpot | 'houseDoor' | 'inside' | 'roof' | 'tail' | 'nose' | 'charger';
export type HomeKey =
  | Exclude<DriverKey, {do: 'walkTo'} | {do: 'lean'}>
  | {at: number; do: 'walkTo'; to: HomeSpot; speed?: number}
  | {at: number; do: 'lean'; to?: HomeSpot};

/** The home garage (top section). */
export type PlugHome = {
  /** YOU's EV (any `SlicedCar` option over `{variant: 'ev', shape: 'crossover', driver: 'you', nearWheels: 'whole'}`), or false. */
  car?: Partial<SlicedCarOptions> | false;
  /** Trips: the car reverses out at `out` and drives back in nose first, stopping at `back` (see `HomeTrip`). */
  trips?: HomeTrip[];
  /**
   * YOU's beats (the charge kit's driver keys; spots also 'houseDoor' (inside, at the door), 'inside' (through it, out
   * of sight), 'roof' (leaning on the car by the driver's door), 'tail', 'nose', 'charger'). `start`: where YOU is
   * before the first key (default 'inside'). `plugged`: the cable in the port at the start (default true). `rate`: × every
   * move's speed (a time-lapse).
   */
  you?: {keys: HomeKey[]; start?: 'car' | HomeSpot; plugged?: boolean; rate?: number} | false;
  /** The wall charger's LED: keys of 'off' | 'blink' | 'steady' (default: blinking 1.4 s after each latch, then steady while plugged). */
  led?: {at: number; state: 'off' | 'blink' | 'steady'}[];
  /** Extra single pulses of the LED (s). */
  ledPulses?: number[];
  /** The house meter's turn: revolutions per second while the car is plugged (default 0.09) and otherwise (default 0.015). */
  meter?: {charging?: number; idle?: number};
  /**
   * No. 017 (N11): a snowy morning: snow on the driveway past the garage door (a cover cut with the slab, its cut face a
   * band over the slab's, tire tracks, banks at the back edge and by the door's pier), falling snow over the driveway only
   * (`snow`: density default 1.5, `maxPx` the flakes' on-screen cap, default 6;
   * false: none). Frost on the car's glass is the car's own `frost` keys. Default none.
   */
  winter?: {snow?: {density?: number; maxPx?: number} | false} | null;
  /**
   * No. 017 (N11): preheating on the wall: an orange flow draws from the wall charger along the cable to the port
   * (the first 55 % of `drawFor`, default 1.2 s), then the car's HVAC feed from the port to the heater (set `car.hvac`;
   * never into the pack). `fadeAt` fades both (0.6 s); `period` the dots' pace (default 1.2 s). Null: none.
   */
  preheat?: {at: number; drawFor?: number; fadeAt?: number | null; period?: number; width?: number} | null;
};

/** The pump island (middle section). */
export type PlugPump = {
  /** The gas twin (over `{variant: 'gas', shape: 'crossover', paint: TWINS.gasPaint, driver: 'extra', nearWheels: 'whole'}`), or false. */
  car?: Partial<SlicedCarOptions> | false;
  /**
   * The extra's beats (the charge kit's driver keys: 'plug' puts the nozzle in the filler, latched at `at`; 'unplug'
   * takes it out at `at` and hangs it back). Default start 'car'.
   */
  extra?: {keys: DriverKey[]; start?: 'car' | DriverSpot; look?: 'a' | 'b'; rate?: number} | false;
  /** Windows [from, to] when the extra's hand stays on the nozzle in the filler (holding it). */
  holds?: [number, number][];
  /** The nozzle's click-off (s): it rocks once. */
  clickOff?: number[];
  /** The filler door 0 → 1 (keys) instead of the default (open just before the nozzle goes in, shut just after it comes out). */
  filler?: Keyed;
};

/** One car's stay at a post. */
export type FastVisit = {
  car?: Partial<SlicedCarOptions>;
  /** Backing in along the aisle (see `StallArrive`). Omit: parked from the start. */
  arrive?: StallArrive;
  /** Leaving forward (see `StallLeave`). Omit: stays. */
  leave?: StallLeave;
  /** The driver (the charge kit's `ChargeDriver`), 'auto' (out, plug by `plug`, unplug at `unplug`, back in), or false. */
  driver?: ChargeDriver | 'auto' | false;
  /** The latch / unlatch (s) with no driver keying it, or for 'auto'. */
  plug?: number | null;
  unplug?: number | null;
  look?: 'a' | 'b';
};
/** A post of the row: its visits, or cars cycling on a beat (`cycle`). */
export type FastPost = {
  visits?: FastVisit[];
  /**
   * `count` cars, the first stopping at `start`, one every `every` s; each plugged just after it stops and out before
   * the next arrives, all moves sped up to fit (`rate`, default from `every`). `drivers`: auto drivers (default true).
   */
  cycle?: {start: number; every: number; count: number; rate?: number; drivers?: boolean; look?: ('a' | 'b')[]};
};
/** The ghost of the cars that aren't there (dashed ink), drawn into empty stalls. */
export type FastGhosts = {at: number; drawFor?: number; fadeAt?: number; fadeFor?: number; posts?: number[]};
/** The fast-charger row and its supply (bottom section). */
export type PlugFast = {
  /** Up to four posts, left → right. Default: post 1 busy (a parked car, extra B on the kerb with the phone). */
  posts?: FastPost[];
  /** The meter's needle and peak pointer (see `MeterKeys`). */
  meter?: MeterKeys;
  /** The orange route from the meter up the pole and out along the line: draws from `at` over `drawFor` (default 1.8 s), fades at `fadeAt` (0.5 s). */
  route?: {at: number; drawFor?: number; fadeAt?: number | null} | null;
  /** Dots run up the drawn route (s between dots; 0: none). Default 1.1. */
  pulseEvery?: number;
  /** The fee slab and its share-out (see `FeeSlab`). */
  fee?: FeeSlab | null;
  /** Ghost cars into empty stalls. */
  ghosts?: FastGhosts | null;
  /** The station clock at the row's left end. Default true. */
  stationClock?: boolean;
};

export type PlugSheetSceneProps = {
  durationInFrames: number;
  mood?: Mood;
  /** The keys' clock: 'scene' (default: seconds into this scene) or 'video' (seconds into the video, shared by every plug-sheet scene). */
  clock?: 'scene' | 'video';
  /** The story time, minutes past midnight (the station clock, the title block's 5:40 PM = 1060). Default 1060. */
  time?: number;
  /** The time-lapse: story minutes past `time` against the keys' clock (piecewise linear); the sun's swing (± degrees, default 14). */
  timelapse?: {minutes: number | {at: number; value: number}[]; sun?: number} | null;
  /** Clouds in the sky around the sections, drifting with the story clock. Default true. */
  clouds?: boolean;
  home?: PlugHome | false;
  pump?: PlugPump | false;
  fast?: PlugFast | false;
  /** The sections' surfaces (m): the pump's and the garage's (the row's at 0). Default 6.0 / 9.7. */
  sectionY?: {pump?: number; home?: number};
  /** The loop (N8, see `PlugLoop`). Default none. */
  loop?: PlugLoop | null;
  /** Framing preset (default 'sheet'). */
  framing?: PlugSheetFraming;
  camera?: {from: Framing; to?: Framing};
  cameraKeys?: CameraKey[];
  push?: number;
  drift?: number;
  location?: string;
  transition?: 'auto' | 'continue' | 'glide' | 'cut' | 'dissolve' | 'slide' | 'follow';
  follow?: {direction?: 'down' | 'up' | 'left' | 'right'; at?: number};
  glide?: number;
  /** Set by Explainer. */
  startFrame?: number;
  cameraFrom?: Framing;
  cameraGlide?: number;
};

// ---------------------------------------------------------------- No. 017: the snowy driveway

/** N11: packed snow over the driveway's slab past the garage door, the car's two tire tracks in it (bay frame). */
const DrivewaySnow: React.FC = () => {
  const mats = useMemo(
    () => ({
      // a step under the token: lit in the open, the snow stays ≤ 244 (brand § 2 whites)
      snow: new THREE.MeshStandardMaterial({color: raw(WINTER.snow).multiplyScalar(0.9), roughness: 0.95}),
      shade: new THREE.MeshStandardMaterial({color: raw(WINTER.snowShade), roughness: 0.95}),
      track: new THREE.MeshStandardMaterial({color: raw(WINTER.packed), roughness: 0.9, polygonOffset: true, polygonOffsetFactor: -2}),
    }),
    [],
  );
  const x0 = GARAGE.x1 + GARAGE.wall;
  const L = 30;
  const T = 0.09;
  return (
    <group>
      {/* the snow cover, cut with the slab: its cut face (front, toward the camera) in the shade tone, a band over the slab's */}
      <mesh
        material={[mats.shade, mats.snow, mats.snow, mats.snow, mats.shade, mats.snow]}
        position={[x0 + L / 2, T / 2, (GARAGE.back + GARAGE.front) / 2]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[L, T, GARAGE.front - GARAGE.back]} />
      </mesh>
      {[-0.8, 0.8].map((z) => (
        <mesh key={z} material={mats.track} position={[x0 + L / 2, T + 0.001, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[L, 0.24]} />
        </mesh>
      ))}
      {/* banks: along the driveway's back edge and heaped by the garage door's pier (shovelled off the tracks) */}
      {[...Array(14).keys()].map((i) => {
        const r = (k: string) => {
          const v = Math.sin((i + 1) * 91.17 + k.length * 13.7) * 43758.5453;
          return v - Math.floor(v);
        };
        const x = x0 + 0.3 + i * 0.75 + 0.2 * r('x');
        return (
          <mesh key={i} material={r('s') > 0.5 ? mats.snow : mats.shade} position={[x, T, GARAGE.back + 0.35 + 0.1 * r('z')]} scale={[0.6 + 0.3 * r('l'), 0.22 + 0.14 * r('h'), 0.4]} castShadow receiveShadow>
            <sphereGeometry args={[1, 14, 9]} />
          </mesh>
        );
      })}
      <mesh material={mats.snow} position={[x0 + 0.35, T, GARAGE.opening[0] - 0.15]} scale={[0.4, 0.3, 0.35]} castShadow>
        <sphereGeometry args={[1, 14, 9]} />
      </mesh>
    </group>
  );
};

// ---------------------------------------------------------------- layout

/** Where each section's frame sits in the world (the row's x offset centres the sheet). */
const secY = (p: Partial<PlugSheetSceneProps>) => ({pump: p.sectionY?.pump ?? 6.0, home: p.sectionY?.home ?? 9.7});
const HOME_X = -0.4;
const PUMP_X = -0.6;
const ROW_X = 0.9;
const homeAt = (p: Partial<PlugSheetSceneProps>): V3 => [HOME_X, secY(p).home, 0];
const pumpAt = (p: Partial<PlugSheetSceneProps>): V3 => [PUMP_X, secY(p).pump, 0];
const ROW_AT: V3 = [ROW_X, 0, 0];
/** The station clock (row frame): at the row's left end, inside stall 1's turn so the cars leaving clear it. */
const CLOCK_AT: V3 = [-10.9, 2.65, 1.5];
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];

/**
 * The framings at the fixed angle (world metres, set on test stills). 'sheet' (W, frame 0 and the loop): all three
 * sections between the title block and the captions. 'plugs' (W): a little closer, the three connectors (home port,
 * pump filler, post 3) in a near-vertical line. 'home' (M): the garage close (the car, cable, charger, house door).
 * 'homeWide' (M): out a little, the outside wall and its meter in. 'pump' (M): the pump island. 'fast' (M): the four
 * posts close. 'row' (W): all four posts and the supply. 'rowLow' (W): the row low in the frame, under a top card
 * (above y 1040). 'supply' (M): the pole, transformer and meter cabinet, two posts.
 */
export const plugSheetFramings = (p: Partial<PlugSheetSceneProps> = {}): Record<PlugSheetFraming, Framing> => {
  const {pump, home} = secY(p);
  return {
    sheet: {look: [0.6, pump - 5.0, 0.2], distance: 92},
    plugs: {look: [1.4, pump - 3.6, 1.3], distance: 74},
    home: {look: [HOME_X + 0.2, home + 1.1, 0.0], distance: 33},
    homeWide: {look: [HOME_X - 0.8, home + 1.2, -0.2], distance: 40},
    pump: {look: [PUMP_X + 1.0, pump + 0.9, 0.6], distance: 30},
    fast: {look: [ROW_X - 2.0, 0.9, -3.4], distance: 53},
    row: {look: [ROW_X - 0.3, -0.4, -3.2], distance: 62},
    rowLow: {look: [ROW_X - 0.3, 0.8, -3.2], distance: 66},
    supply: {look: [ROW_X + 4.9, 0.6, 3.4], distance: 32},
    // No. 017 (N11): the garage alone, lower and closer than 'home' (the car nose in, charger, driveway, house door) …
    garageWide: {look: [HOME_X + 1.4, home + 0.9, 0.3], distance: 30},
    // … and the preheat's path in one frame: charger, cable, port, the HVAC box and the pack's gauge (the door at the edge)
    garageFeed: {look: [HOME_X + 1.6, home + 0.95, 0.4], distance: 19.5},
  };
};

/** The wide frame (§ 11.6): each preset stands back by this factor. */
export const PLUG_WIDE: Record<PlugSheetFraming, number> = {
  sheet: 1.7,
  plugs: 1.6,
  home: 1.35,
  homeWide: 1.35,
  pump: 1.35,
  fast: 1.35,
  row: 1.4,
  rowLow: 1.4,
  supply: 1.35,
  garageWide: 1.35,
  garageFeed: 1.35,
};

// ---------------------------------------------------------------- time

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

/** The keys' clock at a scene frame (scene or video seconds). */
const keyClock = (p: Partial<PlugSheetSceneProps>, frame: number, fps: number) =>
  (p.clock === 'video' ? (p.startFrame ?? 0) / fps : 0) + frame / fps;

/** Story minutes past `time` at the keys' clock t. */
export const plugMinutesAt = (p: Partial<PlugSheetSceneProps>, t: number) => (p.timelapse ? lin(p.timelapse.minutes, t, 0) : 0);

// ---------------------------------------------------------------- the home

const homeCarOf = (h: PlugHome): Partial<SlicedCarOptions> | null =>
  h.car === false ? null : {variant: 'ev', shape: 'crossover', driver: 'you', nearWheels: 'whole', ...(h.car ?? {})};

/** YOU's fixed points in the garage (bay frame). */
const homeGeo = (shape: ShellProfile): DriverGeo => {
  const lay = carLayout(shape, 'near');
  const p = chargePortAt(shape);
  const portNose: V3 = [-p[0], p[1], p[2]];
  const holster: V3 = [GARAGE.holster[0], GARAGE.holster[1], GARAGE.holster[2] + 0.06];
  const spotFor = (n: V3): P2 => [n[0] - 0.2, n[2] + 0.5];
  return {
    seat: [-lay.driver[0], lay.driver[1], lay.driver[2]],
    door: [-lay.driver[0] + 0.1, 1.38],
    cabinet: spotFor(holster),
    holster,
    port: spotFor(portNose),
    portNose,
    quarter: [1.48, 1.24],
    curb: {at: [2.9, 1.7], top: 0.45, rot: 0.48},
    plugKind: 'nacs',
    avoid: [[-2.6, 2.55, 1.08]],
    clock: [GARAGE.charger[0], GARAGE.charger[1], GARAGE.charger[2]],
  };
};

/** The home spots (bay frame) for `walkTo` / `lean`. */
export const HOME_SPOTS: Record<'houseDoor' | 'inside' | 'roof' | 'tail' | 'nose' | 'charger', P2> = {
  houseDoor: [-2.79, -1.62],
  inside: [-2.79, -4.3],
  roof: [-0.05, 1.27],
  tail: [2.78, 1.4],
  nose: [-2.95, 0.9],
  charger: [2.82, -1.5],
};
const homeSpot = (s: HomeSpot): DriverSpot => (typeof s === 'string' && s in HOME_SPOTS ? HOME_SPOTS[s as keyof typeof HOME_SPOTS] : (s as DriverSpot));

type HomeModel = {you: DriverTimeline | null; latched: [number, number][]; car: Partial<SlicedCarOptions> | null};
const CACHE = new Map<string, unknown>();
const cached = <T,>(key: string, make: () => T): T => {
  if (CACHE.has(key)) return CACHE.get(key) as T;
  const v = make();
  if (CACHE.size > 96) CACHE.clear();
  CACHE.set(key, v);
  return v;
};

const homeModel = (h: PlugHome): HomeModel =>
  cached(`home:${JSON.stringify(h)}`, () => {
    const car = homeCarOf(h);
    const shape = (car?.shape ?? 'crossover') as ShellProfile;
    const geo = homeGeo(shape);
    if (h.you === false) return {you: null, latched: [[-Infinity, Infinity]], car};
    const y = h.you ?? {keys: []};
    const keys: DriverKey[] = y.keys.map((k) =>
      k.do === 'walkTo' ? {...k, to: homeSpot(k.to)} : k.do === 'lean' ? {...k, to: k.to === undefined ? undefined : (homeSpot(k.to) as P2)} : k,
    ) as DriverKey[];
    const start = y.start ?? 'inside';
    const tl = driverTimeline({keys, start: start === 'car' ? 'car' : homeSpot(start), look: 'a', rate: y.rate, plugged: y.plugged ?? true}, geo);
    const latched = tl.latched;
    return {you: tl, latched, car};
  });

// ---------------------------------------------------------------- the pump

const pumpCarOf = (q: PlugPump): Partial<SlicedCarOptions> | null =>
  q.car === false ? null : {variant: 'gas', shape: 'crossover', paint: TWINS.gasPaint, driver: 'extra', nearWheels: 'whole', ...(q.car ?? {})};

const pumpGeo = (shape: ShellProfile): DriverGeo => {
  const lay = carLayout(shape, 'near');
  const p = chargePortAt(shape);
  const portNose: V3 = [-p[0], p[1], p[2] + 0.012];
  const holster = PUMP.boot;
  const spotFor = (n: V3): P2 => [n[0] - 0.2, n[2] + 0.5];
  const I = PUMP.island;
  return {
    seat: [-lay.driver[0], lay.driver[1], lay.driver[2]],
    door: [-lay.driver[0] + 0.1, 1.38],
    cabinet: spotFor(holster),
    holster,
    port: spotFor(portNose),
    portNose,
    quarter: [1.48, 1.24],
    curb: {at: [5.2, 1.9], top: 0.45, rot: 0.48},
    plugKind: 'gbt',
    avoid: [
      [I.x0 - 0.1, I.x1 + 0.1, I.z1 + 0.2],
      [-2.6, 2.55, 1.08],
    ],
    clock: [PUMP.boot[0], PUMP.boot[1] + 0.4, PUMP.boot[2]],
  };
};

type PumpModel = {extra: DriverTimeline | null; car: Partial<SlicedCarOptions> | null};
const pumpModel = (q: PlugPump): PumpModel =>
  cached(`pump:${JSON.stringify(q)}`, () => {
    const car = pumpCarOf(q);
    const shape = (car?.shape ?? 'crossover') as ShellProfile;
    if (!q.extra) return {extra: null, car};
    const tl = driverTimeline({keys: q.extra.keys, start: q.extra.start ?? 'car', look: q.extra.look ?? 'a', rate: q.extra.rate}, pumpGeo(shape));
    return {extra: tl, car};
  });

// ---------------------------------------------------------------- the row

type StallVisit = {
  car: Partial<SlicedCarOptions>;
  arrive?: StallArrive;
  leave?: StallLeave;
  driver: DriverTimeline | null;
  latched: [number, number][];
  look: 'a' | 'b';
  key: string;
};

/** The row's default: post 1 busy (a parked car, extra B on the kerb with the phone), the others empty. */
export const FAST_DEFAULT_POSTS: FastPost[] = [
  {visits: [{driver: {start: 'curb', plugged: true, keys: [{at: -5, do: 'sit'}, {at: -4, do: 'phone'}], look: 'b'}, look: 'b'}]},
  {},
  {},
  {},
];

const stallCar = (mood: Mood, c?: Partial<SlicedCarOptions>): Partial<SlicedCarOptions> => ({
  variant: 'ev',
  shape: 'crossover',
  paint: CAR[mood].bodies.you,
  driver: 'extra',
  nearWheels: 'whole',
  ...(c ?? {}),
});

const rowModel = (f: PlugFast, mood: Mood): StallVisit[][] =>
  cached(`row:${mood}:${JSON.stringify(f.posts ?? null)}`, () => {
    const posts = f.posts ?? FAST_DEFAULT_POSTS;
    return [0, 1, 2, 3].map((k) => {
      const post = posts[k] ?? {};
      let raws: FastVisit[] = post.visits ?? [];
      if (post.cycle) {
        const c = post.cycle;
        // the next car may only reach the turn once the last has driven off the aisle's end of this stall
        const r = c.rate ?? Math.max(1, 8.6 / Math.max(0.5, c.every));
        const dwell = Math.max(0.3, c.every - 7.0 / r);
        raws = [...Array(Math.max(0, c.count)).keys()].map((i) => {
          const stop = c.start + i * c.every;
          return {
            arrive: {at: stop, approach: 2.2 / r, wait: 0.35 / r, for: 2.6 / r, from: 10},
            leave: {at: stop + dwell + 0.5 / r, for: 3 / r},
            plug: stop + 0.2,
            unplug: stop + dwell,
            driver: c.drivers === false ? false : 'auto',
            look: c.look?.[i % c.look.length] ?? (i % 2 ? 'b' : 'a'),
          } as FastVisit;
        });
      }
      return raws.map((v, i) => {
        const car = stallCar(mood, v.car);
        const shape = (car.shape ?? 'crossover') as ShellProfile;
        const geo = driverGeo('us', shape, {island: true});
        let driver: DriverTimeline | null = null;
        const stop = v.arrive ? v.arrive.at : -Infinity;
        if (v.driver === 'auto' && v.arrive && v.plug != null && v.unplug != null)
          driver = driverTimeline(autoDriver(geo, {stop: v.arrive.at, plug: v.plug, unplug: v.unplug, out: v.leave?.at ?? v.unplug + 4}, v.look ?? 'a'), geo, v.arrive.at + 0.05);
        else if (v.driver && v.driver !== 'auto') driver = driverTimeline({...v.driver, look: v.driver.look ?? v.look}, geo, Number.isFinite(stop) ? stop + 0.1 : -Infinity);
        // the latch: from the driver's beats, else at `plug` / `unplug` with no one drawn
        const latched: [number, number][] = driver ? driver.latched : v.plug != null ? [[v.plug, v.unplug ?? Infinity]] : [];
        return {car, arrive: v.arrive, leave: v.leave, driver, latched, look: v.look ?? (driver?.look ?? 'a'), key: `p${k}v${i}`};
      });
    });
  });

/** The latch gate (0 → 1) of a visit at t: on 0.1–0.4 s after the latch, off 0.35–0.05 s before the unlatch. */
const gateOf = (latched: [number, number][], t: number) => {
  let g = 0;
  for (const [a, b] of latched) g = Math.max(g, (Number.isFinite(a) ? step(t, a + 0.1, a + 0.4) : 1) * (Number.isFinite(b) ? 1 - step(t, b - 0.35, b - 0.05) : 1));
  return g;
};
const isLatched = (latched: [number, number][], t: number) => latched.some(([a, b]) => t >= a && t < b);

/** The row's load at t: busy posts (fractional while a plug latches). */
const rowLoad = (model: StallVisit[][], t: number) => model.reduce((s, post) => s + Math.min(1, post.reduce((a, v) => a + gateOf(v.latched, t), 0)), 0);

/** The visit holding a post at t: the latched one, else the nearest present car. */
const activeVisit = (post: StallVisit[], t: number) => {
  const l = post.find((v) => isLatched(v.latched, t) && stallPoseAt(v.arrive, v.leave, t).parked);
  if (l) return l;
  let best: StallVisit | null = null;
  let bd = Infinity;
  for (const v of post) {
    const q = stallPoseAt(v.arrive, v.leave, t);
    const d = Math.hypot(q.p[0], q.p[1]);
    if (d < bd) {
      bd = d;
      best = v;
    }
  }
  return bd < 40 ? best : null;
};

// ---------------------------------------------------------------- cables (bay frame, the charge kit's routes)

const usRoute = (where: 'port' | 'holster', portNose: V3): {points: V3[]; plug: PlugPose} => {
  const c = CABINET.us;
  const foot: V3 = [CHARGER_AT[0], ISLAND_H, CHARGER_AT[2]];
  const at = (v: V3): V3 => [foot[0] + v[0], foot[1] + v[1], foot[2] + v[2]];
  const exit = at(c.exit);
  const d = new THREE.Vector3(...c.exitDir).normalize();
  const out1: V3 = [exit[0] + d.x * 0.12, exit[1] + d.y * 0.12, exit[2] + d.z * 0.12];
  if (where === 'port') {
    const plug: PlugPose = {at: portNose, dir: [0, 0, -1], kind: 'nacs'};
    const {at: e, out: o} = plugTail(plug);
    return {
      points: [exit, out1, [exit[0] - 0.24, 1.0, exit[2] + 0.1], [exit[0] - 0.5, 0.56, exit[2] + 0.13], [e[0] + 0.15, 0.47, e[2] + 0.11], [e[0] + o[0] * 0.12, e[1] + o[1] * 0.12, e[2] + o[2] * 0.12], e],
      plug,
    };
  }
  const h = at(c.holster);
  const plug: PlugPose = {at: [h[0], h[1], h[2] + 0.06], dir: [0, 0, -1], kind: 'nacs'};
  const {at: e} = plugTail(plug);
  return {
    points: [exit, out1, [exit[0] - 0.2, 0.7, exit[2] + 0.12], [exit[0] - 0.05, 0.32, exit[2] + 0.3], [e[0] - 0.05, 0.3, e[2] + 0.2], [e[0], e[1] - 0.12, e[2] + 0.06], e],
    plug,
  };
};

const homeRoute = (where: 'port' | 'holster', portNose: V3): {points: V3[]; plug: PlugPose} => {
  const exit = GARAGE.cableExit;
  const ex: V3 = [exit[0], exit[1] - 0.06, exit[2]];
  if (where === 'port') {
    const plug: PlugPose = {at: portNose, dir: [0, 0, -1], kind: 'nacs'};
    const {at: e, out: o} = plugTail(plug);
    return {
      points: [ex, [ex[0] + 0.02, 0.45, ex[2] + 0.06], [ex[0] - 0.12, 0.05, -1.25], [2.66, 0.05, 0.25], [e[0] + 0.22, 0.2, e[2] + 0.14], [e[0] + o[0] * 0.12, e[1] + o[1] * 0.12, e[2] + o[2] * 0.12], e],
      plug,
    };
  }
  const h = GARAGE.holster;
  const plug: PlugPose = {at: [h[0], h[1], h[2] + 0.06], dir: [0, 0, -1], kind: 'nacs'};
  const {at: e} = plugTail(plug);
  return {
    points: [ex, [ex[0] + 0.01, 0.62, ex[2] + 0.05], [ex[0] + 0.08, 0.36, ex[2] + 0.13], [(ex[0] + e[0]) / 2 + 0.06, 0.34, e[2] + 0.16], [e[0] + 0.02, 0.6, e[2] + 0.12], [e[0], e[1] - 0.12, e[2] + 0.06], e],
    plug,
  };
};

/** The cable with the plug in a hand: both routes moved toward the plug's tail and blended (the charge kit's `routeInHand`). */
const inHand = (route: typeof usRoute, portNose: V3, nose: V3, dir: V3): {points: V3[]; plug: PlugPose} => {
  const Hh = route('holster', portNose);
  const Pp = route('port', portNose);
  const plug: PlugPose = {at: nose, dir, kind: 'nacs'};
  const tail = plugTail(plug);
  const th = plugTail(Hh.plug).at;
  const tp = plugTail(Pp.plug).at;
  const dh = Math.hypot(tail.at[0] - th[0], tail.at[1] - th[1], tail.at[2] - th[2]);
  const dp = Math.hypot(tail.at[0] - tp[0], tail.at[1] - tp[1], tail.at[2] - tp[2]);
  const u = dh + dp < 1e-6 ? 0 : dh / (dh + dp);
  const W = [0, 0, 0.25, 0.55, 0.85, 1, 1];
  const points = Hh.points.map((q, i) => {
    const a = [0, 1, 2].map((k) => q[k] + W[i] * (tail.at[k] - th[k]));
    const b = [0, 1, 2].map((k) => Pp.points[i][k] + W[i] * (tail.at[k] - tp[k]));
    const v = [0, 1, 2].map((k) => a[k] + (b[k] - a[k]) * u) as V3;
    v[1] = Math.max(0.05, v[1]);
    return v;
  });
  const o = tail.out;
  points[5] = [tail.at[0] + o[0] * 0.12, tail.at[1] + o[1] * 0.12, tail.at[2] + o[2] * 0.12];
  points[6] = tail.at;
  return {points, plug};
};

/** A cable's route from where its plug is: in a hand (the pose's plug), latched in the port, or holstered. */
const cableFor = (route: typeof usRoute, portNose: V3, pose: DriverPose | null, latched: boolean) =>
  pose?.plug ? inHand(route, portNose, pose.plug.nose, pose.plug.dir) : route(latched ? 'port' : 'holster', portNose);

// ---------------------------------------------------------------- camera

const plugCameraMove = (
  p: Partial<PlugSheetSceneProps>,
  durationInFrames: number,
  fps: number,
  frame?: number,
): {from: Framing; to: Framing; pre?: {from: Framing; hold: number; move: number; ease: 'cubic'}} => {
  const name = p.framing ?? 'sheet';
  const preset = widenFraming(plugSheetFramings(p)[name], formatOf(p), PLUG_WIDE[name]);
  if (p.cameraKeys && p.cameraKeys.length) {
    const base = p.camera?.from ?? preset;
    const f = framingAtKeys(p.cameraKeys, base, frame === undefined ? Infinity : frame / fps);
    return {from: f, to: f};
  }
  const push = p.push ?? 0;
  const pre =
    p.cameraGlide && p.cameraFrom ? {from: p.cameraFrom, hold: 0, move: Math.max(1, Math.round(p.cameraGlide * fps)), ease: 'cubic' as const} : undefined;
  const secs = Math.max(0, durationInFrames - (pre ? pre.move : 0)) / fps;
  if (p.camera) return {from: p.camera.from, to: p.camera.to ?? p.camera.from, pre};
  const c = pre ? undefined : p.cameraFrom;
  const same = c && c.look.every((v, i) => Math.abs(v - preset.look[i]) < 1e-6);
  const from = c && same ? c : preset;
  return {from, to: {look: from.look, distance: from.distance - push * secs}, pre};
};

export const plugSheetCameraStart = (p: Partial<PlugSheetSceneProps>, d: number, fps: number): Framing =>
  plugCameraMove({...p, cameraFrom: undefined, cameraGlide: undefined}, d, fps, 0).from;
export const plugSheetCameraEnd = (p: Partial<PlugSheetSceneProps>, d: number, fps: number): Framing => plugCameraMove(p, d, fps).to;

const plugCameraAt = (p: Partial<PlugSheetSceneProps>, o: {frame: number; fps: number; durationInFrames: number}) => {
  const {from, to, pre} = plugCameraMove(p, o.durationInFrames, o.fps, o.frame);
  return sectionCameraAt({
    from,
    to,
    pre,
    frame: o.frame,
    fps: o.fps,
    durationInFrames: o.durationInFrames,
    drift: p.drift ?? 0,
    clockOffset: (p.startFrame ?? 0) / o.fps,
    format: formatOf(p),
  });
};

// ---------------------------------------------------------------- shared state (scene and anchors)

/** A stall-frame point of post k to the world. */
const stallWorld = (k: number, v: V3): V3 => add(ROW_AT, [ROW.stalls[k] + v[0], v[1], ROW.stallZ + v[2]]);
/** A bay-frame point of post k (the kit's frame) to the world. */
const stallBayWorld = (k: number, b: V3): V3 => stallWorld(k, bayToStall(b));

/** The home section's state at the keys' clock t. */
const homeState = (p: Partial<PlugSheetSceneProps>, t: number) => {
  const h = p.home === false ? null : (p.home ?? {});
  if (!h) return null;
  const th = sectionTime(p.loop, 'home', t);
  const model = homeModel(h);
  const legs = homeLegs(h.trips, th);
  const drive = laneDriveAt(legs.arrive, legs.leave, th);
  const pose = model.you ? driverPoseAt(model.you, th) : null;
  const latched = isLatched(model.latched, th) && drive.parked;
  return {h, th, model, legs, drive, pose, latched};
};

const pumpState = (p: Partial<PlugSheetSceneProps>, t: number) => {
  const q = p.pump === false ? null : (p.pump ?? {});
  if (!q) return null;
  const tp = sectionTime(p.loop, 'pump', t);
  const model = pumpModel(q);
  const pose = model.extra ? driverPoseAt(model.extra, tp) : null;
  const latched = model.extra ? isLatched(model.extra.latched, tp) : false;
  return {q, tp, model, pose, latched};
};

// ---------------------------------------------------------------- anchors

/**
 * A named point on screen (px) at a frame, for overlays: 'peak' (the peak pointer's tip), 'meter' (the dial's centre),
 * 'pole' (the pole's top), 'post:1'…'post:4' (a post's top), 'car:1'…'car:4' (above that stall's car roof, following
 * it), 'port:1'…'port:4', 'feed:1'…'feed:4' (the node dot under a post), 'clock' (the station clock), 'top:home' (above
 * YOU's car roof), 'you' (above YOU's head), 'charger' (the wall charger), 'houseMeter', 'top:pump' (above the gas twin's
 * roof), 'pump' (the pump's top), 'nozzle', 'extra' (above the pump extra's head), 'ghost:1'…'ghost:4'.
 */
export const plugSheetAnchorOnScreen = (
  p: Partial<PlugSheetSceneProps>,
  anchor: string,
  o: {frame: number; fps: number; durationInFrames: number},
): [number, number] | undefined => {
  const cam = plugCameraAt(p, o);
  const t = keyClock(p, o.frame, o.fps);
  const proj = (v: V3) => projectToFrame(cam, v);
  const [name, idx] = anchor.split(':');
  const k = idx ? Math.max(0, Math.min(3, Number(idx) - 1)) : 0;
  const f = p.fast === false ? null : (p.fast ?? {});
  const tf = sectionTime(p.loop, 'fast', t);
  if (name === 'meter') return proj(add(ROW_AT, dialCentre()));
  if (name === 'peak') {
    const model = f ? rowModel(f, p.mood ?? 'day') : [];
    const st = meterAt(f?.meter, (x) => rowLoad(model, x), tf);
    return proj(add(ROW_AT, dialTip(st.peak, ROW.dial.r * 1.02)));
  }
  if (name === 'pole') return proj(add(ROW_AT, [ROW.pole[0], ROW.poleH - 0.4, ROW.pole[2]]));
  if (name === 'post') return proj(add(ROW_AT, add(postFoot(k), [0, CABINET.us.top + 0.05, 0])));
  if (name === 'feed') return proj(add(ROW_AT, [postFoot(k)[0], ROW.feedY, ROW.faceZ]));
  if (name === 'clock') return proj(add(ROW_AT, CLOCK_AT));
  if (name === 'car' || name === 'port' || name === 'ghost') {
    if (name === 'ghost') return proj(stallBayWorld(k, [-ghostRoof('crossover')[0], ghostRoof('crossover')[1] + 0.15, -ghostRoof('crossover')[2]]));
    const model = f ? rowModel(f, p.mood ?? 'day') : [];
    const v = model[k] ? activeVisit(model[k], tf) : null;
    const q = v ? stallPoseAt(v.arrive, v.leave, tf) : stallPoseAt(undefined, undefined, 0);
    const lay = layoutOf(v?.car ?? {});
    const pt: V3 = name === 'car' ? [0, lay.roofCut + 0.15, 0] : (() => {
      const c = chargePortAt('crossover');
      return [-c[0], c[1], c[2]] as V3;
    })();
    // the car's frame → the bay frame (yaw, then its place) → the world
    const yaw = stallYaw(q.h);
    const c = Math.cos(yaw);
    const s = Math.sin(yaw);
    const o = stallToBay([q.p[0], 0, q.p[1]]);
    const b: V3 = [o[0] + pt[0] * c + pt[2] * s, pt[1], o[2] - pt[0] * s + pt[2] * c];
    return proj(stallBayWorld(k, b));
  }
  if (name === 'top' && idx === 'home') {
    const st = homeState(p, t);
    const lay = layoutOf(st?.model.car ?? {});
    return proj(add(homeAt(p), [st ? st.drive.x : 0, lay.roofCut + 0.15, 0]));
  }
  if (name === 'top' && idx === 'pump') {
    const lay = layoutOf(pumpCarOf(p.pump || {}) ?? {});
    return proj(add(pumpAt(p), [0, lay.roofCut + 0.15, 0]));
  }
  if (name === 'you') {
    const st = homeState(p, t);
    const ps = st?.pose;
    if (ps && !ps.inCar) return proj(add(homeAt(p), [ps.pos[0], (ps.stance === 'sit' ? ps.pos[1] + 1.55 : 1.95), ps.pos[2]]));
    const lay = layoutOf(st?.model.car ?? {});
    return proj(add(homeAt(p), [(st?.drive.x ?? 0) - lay.driver[0], lay.driver[1] + 1.4, lay.driver[2]]));
  }
  if (name === 'extra') {
    const st = pumpState(p, t);
    const ps = st?.pose;
    if (ps && !ps.inCar) return proj(add(pumpAt(p), [ps.pos[0], 1.95, ps.pos[2]]));
    return proj(add(pumpAt(p), [-0.25, 2.0, -0.38]));
  }
  if (name === 'charger') return proj(add(homeAt(p), GARAGE.charger));
  if (name === 'houseMeter') return proj(add(homeAt(p), GARAGE.meter));
  if (name === 'pump') return proj(add(pumpAt(p), [PUMP.foot[0], PUMP.foot[1] + PUMP.size[1] + 0.05, PUMP.foot[2]]));
  if (name === 'nozzle') return proj(add(pumpAt(p), PUMP.boot));
  return undefined;
};

// ---------------------------------------------------------------- the scene

/**
 * P, the plug sheet (No. 016): three cut sections stacked (a home garage with YOU's EV at a wall charger, a gas pump
 * island with the gas twin, a four-post US fast-charger row with its supply), their people and cars acting on keys,
 * a time-lapse, and the demand fee as the only orange (the meter's peak pointer, the route up the pole, the fee slab).
 */
export const PlugSheetScene: React.FC<PlugSheetSceneProps> = (propsIn) => {
  const props = useFormatProps(propsIn);
  const {durationInFrames, mood = 'day', startFrame = 0} = props;
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const tl = frame / fps;
  const t = keyClock(props, frame, fps);
  const m = MOODS[mood];
  const Y = secY(props);
  const {from, to, pre} = plugCameraMove(props, durationInFrames, fps, frame);
  const cam = plugCameraAt(props, {frame, fps, durationInFrames});
  const camD = cam.position.distanceTo(cam.look);
  const inkK = Math.max(0.15, Math.min(4, camD / 12.75));
  const glowR = 0.0225 * Math.max(0.25, Math.min(3.5, camD / 30));
  const pxM = camD / 4158;
  // the ghosts stand across the camera's view at a slant: 4.5 px lines (v0.13's 3 px read too faint here)
  const ghostW = Math.round(4.5 * pxM * 4000) / 4000;
  const ghostDash: [number, number] = [16 * pxM, 10 * pxM];
  const sky = useMemo(() => new THREE.MeshBasicMaterial({map: skyTexture(mood), fog: false}), [mood]);
  sky.color.setScalar(1 / m.exposure);
  const minutes = plugMinutesAt(props, t);
  const sunDeg = props.timelapse ? sunSwing(minutes, props.timelapse.sun ?? 14) : 0;
  const cap = capRevs(fps);

  // a cut car's wheels: the drawn turn `revs` at a speed (m/s) → SlicedCar's driving keys and carried turn
  const wheelOpts = (revs: number, speed: number) => {
    const s = speed / (2 * Math.PI * 0.36);
    return {driving: [{at: -100, speed: s}], wheelFrom: revs - Math.sign(s) * Math.min(Math.abs(s), cap) * tl};
  };

  // ---- home
  const hs = homeState(props, t);
  // ---- pump
  const ps = pumpState(props, t);
  // ---- row
  const f = props.fast === false ? null : (props.fast ?? {});
  const tf = sectionTime(props.loop, 'fast', t);
  const row = f ? rowModel(f, mood) : [];
  const meter = f ? meterAt(f.meter, (x) => rowLoad(row, x), tf) : null;
  const route = f?.route ?? null;
  const routePts = supplyRoute().map((v) => add(ROW_AT, v));
  const routeDraw = route ? ease(tf, route.at, route.at + (route.drawFor ?? 1.8)) : 0;
  const routeGlow = route ? (route.fadeAt == null ? 1 : 1 - ease(tf, route.fadeAt, route.fadeAt + 0.5)) * step(tf, route.at - 0.1, route.at) : 0;
  const pulseEvery = f?.pulseEvery ?? 1.1;
  const fee = f?.fee ?? null;
  const feeTo = fee
    ? (fee.to ?? row.map((post, k) => (post.some((v) => gateOf(v.latched, fee.splitAt ?? fee.liftAt + 0.6) > 0.5) ? k : -1)).filter((k) => k >= 0))
    : [];
  const postsX = ROW.stalls.map((_, k) => postFoot(k)[0]);
  const feeSt = fee
    ? slabAt(fee, feeTo.length, tf, {
        top: [ROW.meter[0], ROW.cabinet[1] + 0.2, ROW.meter[2]],
        entry: [ROW.meter[0], ROW.feedY, ROW.faceZ + 0.04],
        posts: feeTo.map((k) => [postsX[k], ROW.feedY, ROW.faceZ + 0.04] as V3),
      })
    : null;
  const litPosts = ROW.stalls.map((_, k) => (feeSt ? feeSt.lit[feeTo.indexOf(k)] ?? false : false));
  const ghosts = f?.ghosts ?? null;

  return (
    <AbsoluteFill>
      <SectionStage mood={mood} post={{focusY: 0.5}} ao far={300}>
        {/* farMin: the sky plane stays inside the far plane at every framing (at 220 a close low shot clipped its lower corner) */}
        <SectionCamera from={from} to={to} pre={pre} durationInFrames={durationInFrames} drift={props.drift ?? 0} clockOffset={startFrame / fps} fitClip farMin={340} />
        <SectionLights mood={mood} target={[0.5, Y.pump, 0]} lamp={0} extent={12} figureSpot={false} keyYaw={(sunDeg * Math.PI) / 180} />
        <mesh position={[0, Y.pump + 20, -170]} material={sky}>
          <planeGeometry args={[900, 480]} />
        </mesh>
        {props.clouds === false ? null : (
          <DriftingClouds mood={mood} minutes={minutes} speed={CLOUD_SPEED} y={[-6, Y.home + 5]} count={13} z={-20} />
        )}

        {/* ---- the home garage */}
        {hs ? (
          <group position={homeAt(props)}>
            <HomeGarage
              mood={mood}
              inkScale={inkK}
              door={hs.pose && !hs.pose.inCar ? 1 - step(Math.hypot(hs.pose.pos[0] - (GARAGE.door[0] + GARAGE.door[1]) / 2, hs.pose.pos[2] - (GARAGE.back - 0.09)), 0.7, 1.6) : 0}
              led={(() => {
                const keys = hs.h.led;
                let state: 'off' | 'blink' | 'steady' = hs.latched ? 'steady' : 'off';
                if (keys?.length) {
                  for (const k of [...keys].sort((a, b) => a.at - b.at)) if (k.at <= hs.th) state = k.state;
                } else if (hs.latched) {
                  const last = [...hs.model.latched].filter(([a]) => a <= hs.th).sort((a, b) => b[0] - a[0])[0];
                  if (last && Number.isFinite(last[0]) && hs.th - last[0] < 1.4) state = 'blink';
                }
                const pulse = (hs.h.ledPulses ?? []).reduce((s, a) => Math.max(s, hs.th > a && hs.th < a + 0.5 ? Math.sin((Math.PI * (hs.th - a)) / 0.5) : 0), 0);
                const base = state === 'steady' ? 0.85 : state === 'blink' ? (Math.sin(2 * Math.PI * 1.6 * hs.th) > 0 ? 1 : 0.08) : 0;
                return Math.min(1, base * (1 - 0.6 * pulse) + 0.15 * pulse + (state === 'steady' ? 0.15 * pulse : 0));
              })()}
              meterTurns={(() => {
                const mc = hs.h.meter?.charging ?? 0.09;
                const mi = hs.h.meter?.idle ?? 0.015;
                // ∫ rate: idle always, plus the charging share while latched (closed form per latched window)
                let turns = mi * hs.th;
                for (const [a, b] of hs.model.latched) {
                  const a0 = Number.isFinite(a) ? a : -1e4;
                  const b0 = Math.min(hs.th, Number.isFinite(b) ? b : hs.th);
                  if (b0 > a0) turns += (mc - mi) * (b0 - a0);
                }
                return turns;
              })()}
            />
            {hs.model.car ? (
              <group position={[hs.drive.x, 0, 0]}>
                <SlicedCar
                  {...hs.model.car}
                  {...(hs.model.car.hvac && hs.h.preheat
                    ? {
                        hvac: {
                          ...hs.model.car.hvac,
                          feed: {
                            from: 'port' as const,
                            // the car keeps the scene's clock: the home's keys may run on the video's
                            at: hs.h.preheat.at + 0.55 * (hs.h.preheat.drawFor ?? 1.2) - (hs.th - tl),
                            drawFor: 0.45 * (hs.h.preheat.drawFor ?? 1.2),
                            fadeAt: hs.h.preheat.fadeAt == null ? null : hs.h.preheat.fadeAt - (hs.th - tl),
                            period: hs.h.preheat.period,
                            width: hs.h.preheat.width,
                          },
                        },
                      }
                    : {})}
                  mood={mood}
                  road="street"
                  {...wheelOpts(laneRevs(hs.legs.arrive, hs.legs.leave, hs.th, fps), hs.drive.speed)}
                  foot={hs.model.car.foot ?? [{at: -1, pose: 'floor'}]}
                  clusterSpeed={hs.model.car.clusterSpeed ?? 0}
                  power={hs.model.car.power ?? 0}
                  brakeLights={hs.model.car.brakeLights ?? hs.drive.brake}
                  chargePort={hs.model.car.chargePort === null ? null : {light: hs.latched ? 1 : 0}}
                  packCharge={null}
                  driverShown={hs.pose ? hs.pose.inCar : hs.h.you === false}
                  figureClock={hs.th - tl}
                  startFrame={startFrame}
                  ground={false}
                  cameraDistance={camD}
                />
                <ReverseLamps on={hs.drive.reverse} mood={mood} />
              </group>
            ) : null}
            {hs.pose && !hs.pose.inCar && hs.pose.pos[2] > GARAGE.back - 1.7 ? (
              <ChargeDriverFigure pose={hs.pose} mood={mood} look="a" who="you" seed="plug-you" clockOffset={hs.th - tl} />
            ) : null}
            {(() => {
              const c = chargePortAt((hs.model.car?.shape ?? 'crossover') as ShellProfile);
              const portNose: V3 = [-c[0] + hs.drive.x, c[1], c[2]];
              const cab = cableFor(homeRoute, portNose, hs.pose, hs.latched);
              const pre = hs.h.preheat;
              const preK = pre && hs.latched ? ease(hs.th, pre.at, pre.at + 0.55 * (pre.drawFor ?? 1.2)) : 0;
              const preG = pre ? (pre.fadeAt == null ? 1 : 1 - ease(hs.th, pre.fadeAt, pre.fadeAt + 0.6)) : 0;
              return (
                <>
                  <ChargeCable points={cab.points} plug={cab.plug} cut={null} arrows={0} heat={0} mood={mood} inkScale={inkK} />
                  {/* No. 017 (N11): the wall's power along the cable to the port, spent on heat (orange) */}
                  {preK > 0 && preG > 0.01 ? (
                    <HeatFlow
                      // riding on the cable's top as its own line (brand v0.18.12: the cable stays black under it)
                      legs={[cab.points.map((q) => [q[0], q[1] + 0.04, q[2] + 0.02] as V3)]}
                      progress={preK}
                      glow={preG}
                      radius={(pre?.width ?? 0.008) * Math.max(0.5, Math.min(3.5, camD / 12))}
                      flow={hs.th / (pre?.period ?? 1.2)}
                      dots={4}
                    />
                  ) : null}
                </>
              );
            })()}
            {/* No. 017 (N11): the snowy morning (packed snow on the driveway, its tire tracks, flakes over it) */}
            {hs.h.winter ? <DrivewaySnow /> : null}
            {hs.h.winter && hs.h.winter.snow !== false ? (
              <Snow
                t={tl + startFrame / fps}
                density={hs.h.winter.snow?.density ?? 1.5}
                gusts={[]}
                y0={0}
                y1={4.2}
                mood={mood}
                maxPx={hs.h.winter.snow?.maxPx ?? 6}
                cam={cam.position.clone().sub(new THREE.Vector3(...homeAt(props)))}
                box={{xW: 9, xC: GARAGE.x1 + 0.3 + 4.5, z0: GARAGE.back, zD: GARAGE.front - GARAGE.back}}
              />
            ) : null}
          </group>
        ) : null}

        {/* ---- the pump island */}
        {ps ? (
          <group position={pumpAt(props)}>
            <PumpIsland mood={mood} inkScale={inkK} />
            {ps.model.car ? (
              <SlicedCar
                {...ps.model.car}
                mood={mood}
                road="street"
                driving={[{at: -100, speed: 0}]}
                foot={ps.model.car.foot ?? [{at: -1, pose: 'floor'}]}
                clusterSpeed={ps.model.car.clusterSpeed ?? 0}
                brakeLights={ps.model.car.brakeLights ?? 0}
                fillerDoor={{
                  open:
                    ps.q.filler !== undefined
                      ? keyedValue(ps.q.filler, ps.tp, 0)
                      : (ps.model.extra?.latched ?? []).reduce(
                          (s, [a, b]) => Math.max(s, step(ps.tp, a - 0.75, a - 0.4) * (Number.isFinite(b) ? 1 - step(ps.tp, b + 0.45, b + 0.8) : 1)),
                          0,
                        ),
                }}
                driverShown={ps.pose ? ps.pose.inCar : true}
                driverLook={driverLook(ps.q.extra ? (ps.q.extra.look ?? 'a') : 'a')}
                figureClock={ps.tp - tl}
                startFrame={startFrame}
                ground={false}
                cameraDistance={camD}
              />
            ) : null}
            {ps.pose && !ps.pose.inCar ? (
              <ChargeDriverFigure
                pose={(() => {
                  // holding the nozzle in the filler: the right hand stays on its grip
                  const hold = (ps.q.holds ?? []).some(([a, b]) => ps.tp >= a && ps.tp < b) && ps.latched && !ps.pose.plug && ps.pose.walk?.amount === 0;
                  if (!hold) return ps.pose;
                  const n = pumpGeo('crossover').portNose!;
                  const grip: V3 = [n[0], n[1] - 0.1, n[2] + 0.16];
                  return {...ps.pose, phone: 0, hands: [grip, ps.pose.hands?.[1] ?? [ps.pose.pos[0] + 0.26, 0.82, ps.pose.pos[2]]] as [V3, V3]};
                })()}
                mood={mood}
                look={ps.q.extra ? (ps.q.extra.look ?? 'a') : 'a'}
                seed="plug-pump"
                clockOffset={ps.tp - tl}
              />
            ) : null}
            {(() => {
              const geo = pumpGeo((ps.model.car?.shape ?? 'crossover') as ShellProfile);
              const pose: NozzlePose = ps.pose?.plug
                ? {nose: ps.pose.plug.nose, dir: ps.pose.plug.dir}
                : ps.latched
                  ? {nose: geo.portNose!, dir: [0, 0, -1]}
                  : {nose: geo.holster, dir: [0, 0, -1]};
              const rock = (ps.q.clickOff ?? []).reduce((s, a) => (ps.tp >= a && ps.tp < a + 0.45 ? (ps.tp - a) / 0.45 : s), 0);
              return <FuelNozzle pose={pose} rock={ps.latched ? rock : 0} />;
            })()}
          </group>
        ) : null}

        {/* ---- the fast-charger row */}
        {f ? (
          <group position={ROW_AT}>
            <ChargeRow mood={mood} inkScale={inkK} />
            <StationSupply mood={mood} needle={meter?.needle ?? 0} peak={meter?.peak ?? 0} peakGlow={meter?.glow ?? 0} glowR={glowR * 0.75} />
            <RowFeed posts={postsX} lit={litPosts} litGlow={feeSt?.glow ?? 0} glowR={glowR} />
            {feeSt ? <FeePieces pieces={feeSt.pieces} glow={feeSt.glow} /> : null}
            {f.stationClock === false ? null : <StationClock position={CLOCK_AT} minutes={(props.time ?? 1060) + minutes} />}
            {ROW.stalls.map((sx, k) => {
              const post = row[k] ?? [];
              const poses = post.map((v) => (v.driver ? driverPoseAt(v.driver, tf) : null));
              const latchedV = post.find((v) => isLatched(v.latched, tf) && stallPoseAt(v.arrive, v.leave, tf).parked) ?? null;
              const handPose = poses.find((q) => q?.plug) ?? null;
              const portC = chargePortAt('crossover');
              const portNose: V3 = [-portC[0], portC[1], portC[2]];
              const cab = cableFor(usRoute, portNose, handPose, !!latchedV);
              const gh = ghosts && (ghosts.posts ? ghosts.posts.includes(k) : !post.some((v) => Math.hypot(...stallPoseAt(v.arrive, v.leave, ghosts.at).p) < 6));
              return (
                // the stall's bay frame: the charge kit's bay turned a quarter turn (nose to the camera, cut left side to +x)
                <group key={k} position={[sx, 0, ROW.stallZ]} rotation={[0, STALL_TURN, 0]}>
                  <ChargerCabinet kind="us" position={[CHARGER_AT[0], ISLAND_H, CHARGER_AT[2]]} />
                  {post.map((v, i) => {
                    const q = stallPoseAt(v.arrive, v.leave, tf);
                    if (Math.hypot(q.p[0], q.p[1]) > 40) return null;
                    const pose = poses[i];
                    const b = stallToBay([q.p[0], 0, q.p[1]]);
                    const on = latchedV === v;
                    return (
                      <group key={v.key} position={b} rotation={[0, stallYaw(q.h), 0]}>
                        <SlicedCar
                          {...v.car}
                          mood={mood}
                          road="street"
                          {...wheelOpts(stallRevs(v.arrive, v.leave, tf, fps), q.speed)}
                          foot={v.car.foot ?? [{at: -1, pose: 'floor'}]}
                          clusterSpeed={v.car.clusterSpeed ?? 0}
                          power={v.car.power ?? 0}
                          brakeLights={v.car.brakeLights ?? q.brake}
                          chargePort={{light: on ? gateOf(v.latched, tf) : 0}}
                          packCharge={null}
                          driverShown={pose ? pose.inCar : true}
                          driverLook={driverLook(v.look)}
                          startFrame={startFrame}
                          ground={false}
                          cameraDistance={camD}
                        />
                        <ReverseLamps on={q.reverse} mood={mood} />
                      </group>
                    );
                  })}
                  {post.map((v, i) => {
                    const pose = poses[i];
                    if (!pose || pose.inCar) return null;
                    return <ChargeDriverFigure key={`d${v.key}`} pose={pose} mood={mood} look={v.look} seed={`plug-${v.key}`} clockOffset={startFrame / fps} />;
                  })}
                  <ChargeCable points={cab.points} plug={cab.plug} cut={null} arrows={0} heat={0} mood={mood} inkScale={inkK} />
                  {gh && ghosts ? (
                    // GhostCar draws a car facing +x; turned half round it faces −x like the bay's cars (its plane at z 0)
                    <group rotation={[0, Math.PI, 0]}>
                      <GhostCar
                        mood={mood}
                        shape="crossover"
                        draw={ease(tf, ghosts.at, ghosts.at + (ghosts.drawFor ?? 0.8))}
                        opacity={ghosts.fadeAt === undefined ? 1 : 1 - ease(tf, ghosts.fadeAt, ghosts.fadeAt + (ghosts.fadeFor ?? 0.7))}
                        width={ghostW}
                        dash={ghostDash}
                      />
                    </group>
                  ) : null}
                </group>
              );
            })}
          </group>
        ) : null}

        {/* ---- the system: the route from the meter up the pole (§ 5), node dots at both ends, dots running up it */}
        {f && route && routeGlow > 0.003 ? (
          <>
            <GlowPolyline points={routePts} draw={routeDraw} radius={glowR} glow={routeGlow} />
            <GlowNode at={routePts[0]} radius={glowR * 1.95} glow={routeGlow} />
            {routeDraw >= 1 ? <GlowNode at={routePts[routePts.length - 3]} radius={glowR * 1.95} glow={routeGlow} /> : null}
            {routeDraw >= 1 && pulseEvery > 0
              ? [0, 1, 2].map((i) => {
                  const u = ((tf - route.at - (route.drawFor ?? 1.8)) / (pulseEvery * 3) + i / 3) % 1;
                  return u >= 0 ? <GlowNode key={i} at={pointAlong(routePts.slice(0, -1), u)} radius={glowR * 1.6} glow={routeGlow} dot /> : null;
                })
              : null}
          </>
        ) : null}
      </SectionStage>
    </AbsoluteFill>
  );
};
