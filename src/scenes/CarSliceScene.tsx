import React, {useMemo} from 'react';
import {AbsoluteFill, random, useCurrentFrame, useVideoConfig} from 'remotion';
import * as THREE from 'three';
import {fonts} from '../fonts';
import {CAR, HIGHWAY, MOODS, section, type CastName, type Mood} from '../theme';
import {OrangePath} from '../three/OrangePath';
import {raw} from '../three/plaster';
import {CAR_LAYOUT, LAYOUT_NEAR, RealCar} from '../three/real/RealCar';
import {BatteryPack, DriveUnit, EV, EV_BOARD, footPose, moduleSpan, MODULE_Y, PedalBox} from '../three/real/EvDrive';
import {EngineBay, GAS, GAS_ROUTES, gasFootPose, GasLoom, GasPedals, Steering} from '../three/real/GasDrive';
import type {RoadSignKind} from '../three/real/RoadSigns';
import {CarCityRoad} from '../three/section/CarCityRoad';
import {RealWheel, WHEEL} from '../three/real/RealWheel';
import {TireSensor} from '../three/real/TireSensor';
import {TireSpray, type SprayEmitter} from '../three/real/TireSpray';
import type {Gesture} from '../three/rig';
import {CutOutline, cutMaterial, INK} from '../three/section/cutLook';
import {
  bandMaterial,
  CurveStrip,
  GROOVE,
  GrooveCut,
  MAX_AMP,
  profileY,
  STRIP_N,
  tireDrop,
} from '../three/section/GrooveCut';
import {asphaltMaterial, HIGHWAY_LAYOUT} from '../three/section/HighwaySlice';
import {Figure} from '../three/section/Figure';
import {
  projectToFrame,
  SECTION_ANGLE,
  SectionCamera,
  sectionCameraAt,
  type Framing,
} from '../three/section/SectionCamera';
import {SectionLights, SectionStage} from '../three/section/SectionStage';
import {skyTexture} from '../three/section/textures';
import {useFontsLoaded} from '../three/section/useFontsLoaded';
import {RadioPulse, WireWind} from '../three/TirePieces';
import {
  ease,
  framingAtKeys,
  integrateSpeed,
  keyedValue,
  speedAt,
  type CameraKey,
  type Keyed,
  type SpeedKey,
} from './keyframes';

type V3 = [number, number, number];
export type WheelId = 'FL' | 'FR' | 'RL' | 'RR';
export type CarFraming =
  | 'wide'
  | 'cabin'
  | 'frontWheel'
  | 'allWheels'
  | 'lowWheels'
  | 'frontTire'
  | 'contact'
  | 'drive'
  | 'pedals'
  | 'motor'
  | 'battery'
  | 'brake'
  | 'pads'
  | 'disc'
  | 'cabinSignal'
  | 'car'
  | 'bay'
  | 'pedal'
  | 'signal'
  | 'throttle'
  | 'evBay';

const C = CAR_LAYOUT;
const R = C.wheelR;

/**
 * The four wheels. The car faces +x and the driver sits on its left, the far (−z) side, so the near
 * (cut) side is the right: FR and RR are the near wheels, cut through their mid-plane with the
 * sensor showing; FL and RL are behind the body.
 */
export const WHEELS: Record<WheelId, {x: number; z: number; near: boolean}> = {
  FL: {x: C.axleX.front, z: -C.track, near: false},
  FR: {x: C.axleX.front, z: C.track, near: true},
  RL: {x: C.axleX.rear, z: -C.track, near: false},
  RR: {x: C.axleX.rear, z: C.track, near: true},
};

/** Invented sensor IDs (🎭 illustrative, disclosed in the post); RL carries the brief's "4F2A". */
export const DEFAULT_IDS: Record<WheelId, string> = {RL: '4F2A', FL: '7C1E', FR: '19B3', RR: 'A06D'};

export const CAR_FRAMINGS: Record<
  Exclude<
    CarFraming,
    | 'drive'
    | 'pedals'
    | 'motor'
    | 'battery'
    | 'brake'
    | 'pads'
    | 'disc'
    | 'cabinSignal'
    | 'car'
    | 'bay'
    | 'pedal'
    | 'signal'
    | 'throttle'
    | 'evBay'
  >,
  Framing
> = {
  wide: {look: [0.05, 0.3, 0.1], distance: 21},
  cabin: {look: [0.45, 1.25, -0.1], distance: 10.5},
  frontWheel: {look: [1.3, 0.62, 0.75], distance: 7.5},
  allWheels: {look: [0, 0.05, 0], distance: 19},
  lowWheels: {look: [0, 0.48, 0.8], distance: 12.5},
  /**
   * The near front tire whole on the cut, a few dips either side (highway: ½ in ≈ 11 px); the contact
   * patch at y ≈ 880, above the captions.
   */
  frontTire: {look: [1.35, -0.09, 0.8], distance: 4.6},
  /** Close on the near front tire's contact patch: the tread, the dip under it, the trapped air (½ in ≈ 26 px), at y ≈ 850. */
  contact: {look: [1.35, -0.055, 0.8], distance: 2.0},
};

/**
 * The electric car's framings (No. 006, `variant: 'ev'`, the car facing −x, world metres). Set on the
 * test stills: `drive` is frame 0 and the loop (front wheel, drive unit, foot, front of the pack, the
 * stop line); `cabin` leaves room for a corner signal at frame top-left.
 */
export const EV_FRAMINGS: Partial<Record<CarFraming, Framing>> = {
  drive: {look: [-0.95, 0.17, 0.5], distance: 10},
  pedals: {look: [-0.8, 0.4, 0.32], distance: 3.4},
  cabin: {look: [-0.6, 0.52, 0.4], distance: 10.5},
  cabinSignal: {look: [-0.7, 1.75, 0.2], distance: 13.5},
  motor: {look: [-1.28, 0.62, 0.35], distance: 2.2},
  battery: {look: [-0.42, 0.14, 0.62], distance: 3.2},
  wide: {look: [0.0, 1.3, 0.0], distance: 26},
  brake: {look: [-1.33, 0.3, 0.75], distance: 2.0},
  pads: {look: [-1.232, 0.291, 0.746], distance: 0.5},
  disc: {look: [-1.43, 0.33, 0.768], distance: 1.0},
  /** No. 008: M, the drive unit, the inverter and its board, the pedals and foot, the driver's head. */
  evBay: {look: [-0.8, 0.676, 0.246], distance: 9.5},
};

/**
 * The gas car's framings (No. 008, `variant: 'gas'`, facing −x, world metres; set on test stills). `car`
 * is frame 0 and the loop: the whole car on the road, the sneaker on the pedal, the engine bay at frame
 * left, the rear lamps at frame right, the car below the title block. `throttle` puts the throttle body
 * where the EV's `motor` framing puts the drive unit (the same offset from the subject, the same
 * distance), so a slide between the two cars lands on the same spot.
 */
export const GAS_FRAMINGS: Partial<Record<CarFraming, Framing>> = {
  car: {look: [-0.055, 0.177, 0.331], distance: 19},
  bay: {look: [-1.185, 0.255, 0.49], distance: 6.5},
  signal: {look: [-0.966, 0.518, 0.345], distance: 3.4},
  pedal: {look: [-0.802, 0.501, 0.293], distance: 3},
  throttle: {
    look: [
      -GAS.tb[0] + (EV_FRAMINGS.motor!.look[0] + EV.motor[0]),
      GAS.tb[1] + (EV_FRAMINGS.motor!.look[1] - EV.motor[1]),
      GAS.tbZ + (EV_FRAMINGS.motor!.look[2] - EV.motorZ),
    ],
    distance: EV_FRAMINGS.motor!.distance,
  },
};

/** A corner on the city road (`road: 'city'`): a stop line and a post-mounted signal just past it. */
export type CarCorner = {
  /** Metres the stop line is ahead of the near front tire's contact patch at `when` (s into the scene). */
  ahead: number;
  /** Default 0 (the scene's start). */
  when?: number;
  /** The white stop line (default true). */
  line?: boolean;
  /** The post-mounted signal on the far sidewalk (default true). */
  signal?: boolean;
  /** How far past the stop line its post stands (m, default 3: across the crosswalk, at the corner). */
  post?: number;
  /** The signal's lit lens from each `at` (s): 'red' (default before the first key), 'green' or 'off'. The yellow is never lit. */
  lights?: {at: number; state: 'red' | 'green' | 'off'}[];
};

/**
 * The regen path (No. 006, orange: energy flowing backwards). Seconds into the scene; each default
 * chains from the one before. From `at` it draws from the near front wheel's hub along the
 * half-shaft into the gears and reaches the rotor at `rotorAt`; from `windingsAt` the stator's
 * windings light slot by slot as the magnets sweep past, and pulses leave through the phase cables
 * to the inverter (`inverterAt`); then down the HV cable into the pack (`batteryAt`), whose modules
 * fill front to back to `fill` (a level in each, by `fullAt`). `brightAt`: the pulses brighten and
 * dots flow. `fadeAt`: everything orange fades out over `fadeFor` (the loop's cheat). A negative
 * `at` opens with it all lit (a later scene).
 */
export type RegenKeys = {
  at: number;
  rotorAt?: number;
  windingsAt?: number;
  inverterAt?: number;
  batteryAt?: number;
  fullAt?: number;
  fill?: number;
  brightAt?: number;
  fadeAt?: number;
  fadeFor?: number;
};

/**
 * The gas car's signal path (No. 008, orange: the computer between the pedal and the throttle). Seconds
 * into the scene. From `pedalAt` it draws from the pedal's sensor up the firewall to the computer over
 * `drawFor` (default 1.0 s; the computer's node lights on arrival); from `motorAt` (default: never) it
 * draws from the computer along the intake to the throttle's motor (its node lights on arrival). Once
 * the first leg is drawn, pulses leave the sensor (`pulses`, default true), faster the further the
 * pedal is pressed; each runs to the computer and, if the `gate` lets it, on to the motor (even before
 * that leg is drawn: a dot on the black wire); else it dies at the computer. `fadeAt`: everything orange
 * fades out over `fadeFor` (default 0.7 s; the loop). A negative `pedalAt` / `motorAt` opens lit.
 */
export type GasPathKeys = {
  pedalAt: number;
  motorAt?: number | null;
  drawFor?: number;
  pulses?: boolean;
  fadeAt?: number;
  fadeFor?: number;
};

/** The pedal foot's keys (`foot`): 'floor' and 'accel' on both cars; 'brake' and 'both' on 'gas' only. */
export type FootKey = {
  at: number;
  pose: 'floor' | 'accel' | 'brake' | 'both';
  /** How far the pedal under the ball is pressed (accel: the accelerator, default 0.5; brake / both: the brake, default 0.8). */
  press?: number;
  /** 'both' (gas): how far the shoe's edge presses the accelerator (default 0.45). */
  edge?: number;
  /** 'gas': the move's length (s; default 0.75 for a lift, 0.4 onto the brake, 0.5 for a press). */
  dur?: number;
};

export type CarSliceSceneProps = {
  durationInFrames: number;
  /** Day (default) or Night. */
  mood?: Mood;
  /** Realistic objects (accepted for consistency; the car is always realistic). */
  realism?: boolean;
  /**
   * 'sensors' (default: YOU's car, a sensor in each wheel, orange pulses), 'indirect' (no sensors, no
   * orange) or 'ev' (No. 006: an electric car, front drive unit and battery pack cut open, the driver by
   * the cut with the pedal box in view; facing −x and on the city road by default; orange only on the
   * `regen` and `signal` paths), or 'gas' (No. 008: a gas car, the EV's layout with a transverse engine
   * and its throttle body cut open in the bay, a hanging accelerator with its sensor, the computer on the
   * firewall, the steering column; facing −x on the highway lane by default; orange only on `gasPath`,
   * `brakeLead` and `steerByWire`).
   */
  variant?: 'sensors' | 'indirect' | 'ev' | 'gas';
  /** Which way the car faces: 'right' (+x, default) or 'left' (−x, default for 'ev'; its rear toward the camera). */
  facing?: 'right' | 'left';
  /** Who drives: 'you' (default) or 'mom'; the body colour follows (theme `CAR`). */
  driver?: CastName;
  /**
   * Framing preset (default 'wide'): 'wide', 'cabin', 'frontWheel', 'allWheels', 'lowWheels', 'frontTire',
   * 'contact'; for 'ev' also 'drive', 'pedals', 'motor', 'battery', 'brake', 'pads', 'disc' (`EV_FRAMINGS`;
   * 'wide' and 'cabin' have their own EV versions). Facing left, a preset without an EV version is mirrored.
   */
  framing?: CarFraming;
  /** A custom move instead of a preset (look-at + distance at the fixed angle). */
  camera?: {from: Framing; to?: Framing};
  /**
   * Camera keyframes: from the scene's starting framing (`camera.from` or the preset) the camera eases
   * to each key's framing, arriving at its `at` (s), and holds after the last. Overrides `camera`,
   * `push` and the glide in (`cameraFrom`, `cameraGlide`).
   */
  cameraKeys?: CameraKey[];
  /** Push toward the subject, units/s (default 0.04). */
  push?: number;
  /** Idle sideways drift, ± units (default 0.08). */
  drift?: number;
  /**
   * Speed keyframes in wheel revolutions per second (1 ≈ a slow drive; `MPH60_REVS` ≈ 11.9 is 60 mph);
   * eased over 0.8 s. The road scrolls with it. Default 1, or 60 mph on the highway.
   */
  driving?: SpeedKey[];
  /** Radio pulses: from `at`, an orange route from that wheel's sensor to the receiver (ignored when 'indirect'). */
  pulses?: {at: number; wheel: WheelId}[];
  /** A small ID tag rides each pulse. */
  ids?: boolean;
  /** The IDs on the tags (default `DEFAULT_IDS`, RL "4F2A"). */
  idLabels?: Partial<Record<WheelId, string>>;
  /** That tire sags (a quarter low), or null. */
  lowWheel?: WheelId | null;
  /** Seconds into the scene when it sags (default: already low). */
  lowAt?: number;
  /** Seconds into the scene when the cluster's tire light comes on (warning yellow, flat), or null. */
  warningAt?: number | null;
  /** The driver glances down at the cluster at this time (default: 0.2 s after `warningAt`); null for none. */
  glanceAt?: number | null;
  /** More poses for the driver (rig `Gesture`s; the 'drive' pose is always under them). */
  gestures?: Gesture[];
  /** 'indirect': toothed speed rings and a white sidewall tick on the near wheels; the low wheel turns faster. */
  speedRings?: boolean;
  /** How much faster the low wheel turns (default 1.1: exaggerated so its tick visibly gains). */
  fasterBy?: number;
  /** The wire gag: a grey cable from under the dash winds round the front near axle from `at`, fades by `until`. */
  wire?: {at: number; until?: number};
  /**
   * The road: 'street' (default, No. 002: a lane with a broken line) or 'highway' (No. 005: the
   * interstate shoulder; the near wheels ride the groove row and the front cut face runs down its
   * centreline, so it shows the dips; the white edge line just behind the cut; default speed 60 mph).
   */
  road?: 'street' | 'highway' | 'city';
  /**
   * Playback rate, a constant or keys (1 = real time, 0.05 = 20× slow motion): scales how fast the road,
   * the wheels and the drops go (not the driver, not the camera). Default 1.
   */
  timeScale?: Keyed;
  /** Highway: an orange impact flash at the contact patch on each drop, from this time (s); null for none. Default 0. */
  impactsAt?: number | null;
  /** Highway: the tread squeezes into each dip it crosses, from this time (s); null for none. Default 0. */
  squeezeAt?: number | null;
  /** Highway: the air trapped under the tread in each dip fills orange and puffs out at the dip's edges, from this time (s). Default null. */
  airAt?: number | null;
  /**
   * Highway: the drops blur into one continuous orange band behind each near tire: 'auto' (default:
   * from the drop rate on screen, full above ≈ 18 a second) or a constant / keys 0 → 1.
   */
  band?: 'auto' | Keyed;
  /**
   * Highway: the tires leave the grooves at this time (s): the car eases left (the road slides across
   * under the cut, the white line toward it, the dips flatten out), the drops, the band and the
   * vibration path go dark. Default null (they stay on the grooves).
   */
  leaveAt?: number | null;
  /**
   * Highway: the vibration path (orange, the system): from `at` it draws from the near front tire's
   * contact patch → the hub → an unlabelled run up through the body → the steering wheel, arriving at
   * `wheelAt` (default at + 1.7); a branch → the seat rails → the seat arrives at `seatAt` (default
   * wheelAt + 1.4). Node dots at the hub, the wheel and the seat; once the path reaches the wheel the
   * driver's hands buzz on the rim. The suspension is not labelled. Null for none (default).
   */
  vibration?: {at: number; wheelAt?: number; seatAt?: number} | null;
  /** The speed on the cluster's face in the car (mph, default 38). The dashboard detail box has its own `speed`. */
  clusterSpeed?: number;
  /**
   * Highway: the dips' depth and the tire's drop drawn this many times real (default 2.5, 🎭 an
   * illustrative scale, disclosed in the post: at 1 the ½ in dip read as a wavy line at phone size).
   * A dotted ink line at flat-road level runs across the dips in close-ups, so the tire is seen going below it.
   */
  dipScale?: number;
  /**
   * "Feel it": a fast seeded tremble (0 → 1, constant or keys) of the camera, the car's body, the
   * steering wheel and the driver's hands, like the buzz through the car. On the highway it only runs
   * while the near tires are on the grooves (not after `leaveAt`). Default 0 (off).
   */
  shake?: Keyed;
  /** Scene seconds of a short hard kick on the shake (≈ 3×, gone in 0.35 s): the first hit on the grooves. */
  shakeKick?: number[];
  /** The tire-pressure symbol on the in-car cluster (default true; false: not drawn). The detail box has its own `tireLight`. */
  tireLight?: boolean;
  /**
   * 'city' road (No. 006): corners that arrive with the road scroll, each a white stop line and a
   * post-mounted signal (see `CarCorner`). E.g. `{ahead: 0, when: 2.05}` puts the line under the front
   * tire at 2.05 s (stop the car there with `driving`). Default none.
   */
  corners?: CarCorner[];
  /** 'city': road signs on the far sidewalk, placed like corners (`ahead`/`when`): 'speed' (default text SPEED / LIMIT / 25). */
  signs?: {ahead: number; when?: number; kind?: RoadSignKind; text?: string[]}[];
  /** 'city': low storefronts at the back of the sidewalk (default false: plain sky behind the title block, owner review). */
  storefronts?: boolean;
  /**
   * 'city': metres the road block runs ahead of the car's centre (default 14 for 'ev', else 5): corners and
   * their signals slide in through that end, so a longer run shows a red light while it is still well ahead.
   */
  roadAhead?: number;
  /** 'ev': the driver's pedal foot from each `at` (s): 'floor' (flat, clear of both pedals; default) or 'accel' (heel on the floor, sole on the accelerator's pad, pressed `press`, default 0.5). Between the two, a 0.75 s lift: the foot rises ≈ 12 cm clear of the pad (🎭) while the pedal springs back, then settles.
   * 'gas' (No. 008): default 'accel' at 0.5; also 'brake' (the ball on the brake, heel lifted, a heel pivot across) and 'both'
   * (across both pedals: the brake by `press`, the accelerator by the shoe's edge, `edge`); brake ↔ both slide, any other
   * change of pedal is a lift (0.4 s onto the brake, else 0.75 s; `dur` overrides). */
  foot?: FootKey[];
  /** 'ev': the regen path (see `RegenKeys`); null for none (default). */
  regen?: RegenKeys | null;
  /**
   * 'ev': the brake-light signal path (orange, the car lighting its lamps by itself): from `at` it draws
   * from the inverter down to the sill, along the sill's cut face and up to the rear lamp, arriving at
   * `lampsAt` (default at + 1.2), when the lamps light (unless `brakeLights` is given). `fadeAt`: it
   * fades out (0.6 s). Null for none (default).
   */
  signal?: {at: number; lampsAt?: number; fadeAt?: number} | null;
  /** 'ev': the brake lamps, 0 (dark) → 1 (lit), constant or keys; flat red, never bloomed. Default: from `signal`, else 0. */
  brakeLights?: Keyed;
  /** 'ev': the in-car cluster's power meter, −1 (charge) → 1, constant or keys. Default: −0.6 while the regen path is lit, else 0. */
  power?: Keyed;
  /** 'ev': how much faster the rotor turns than the wheel on screen (default 3, 🎭: the real ≈ 9 would strobe). */
  rotorRatio?: number;
  /** 'ev': rust on the near front disc's swept face, 0 → 1, constant or keys (default 0). */
  rust?: Keyed;
  /** 'ev': the pads' friction material thickness (wheel units, default 0.03 ≈ 11 mm, 🎭 thick). */
  padThickness?: number;
  /**
   * 'ev': the near front wheel's cut-away wedge [w0, w1] (radians, see `RealWheel` `brake`); default
   * [−2.1, −0.45] (the rear quarter: the half-shaft shows, and the caliper on w0 is lit and turned toward
   * the camera) when `framing` is 'brake', 'pads' or 'disc'; otherwise none (owner review: frame 0 must read
   * clean), the wheel whole inside with its disc and caliper. null: never.
   */
  wedge?: [number, number] | null;
  /**
   * 'ev': how open the wedge is, 0 (closed: the wheel whole inside) → 1 (the full `wedge` range), constant
   * or keys (eased). It closes from w1 toward w0, the caliper's side. Default 1.
   */
  wedgeOpen?: Keyed;
  /**
   * 'highway' (No. 008): where the car rides. 'shoulder' (default; No. 005: the near wheels on the groove
   * row) or 'lane' (default for 'gas': the right lane's centre, no grooves under the car, the dashed lane
   * line behind it; the edge line is past the cut). 'lane' is also the default for 'ev'.
   */
  highwayLane?: 'shoulder' | 'lane';
  /** 'highway': the road after the rain (S2's wet asphalt: darker, puddles, the sky's sheen) and a fine spray off every tire (S2's `TireSpray`, clipped at the cut). Default false. */
  wet?: boolean;
  /**
   * 'ev' (No. 008): power to the motor, the gas path's twin (see `GasPathKeys`): from `pedalAt` it draws
   * from a sensor at the accelerator's hinge up to the inverter's control board (the computer); from
   * `motorAt` down the phase cables into the stator, whose windings then light with the power the
   * computer sends (brighter with the press; at low speed a band that leads the magnets: the field
   * pulling the rotor). Pulses run pedal → board → motor, faster with the press. `gate` and `cut` work as
   * on the gas car: no = pulses die at the board, the windings dim; cut = the phase leg and the windings
   * go dark. Setting `drive` also draws the sensor and the board. Null for none (default).
   */
  drive?: GasPathKeys | null;
  /**
   * The near wheels drawn whole (No. 008, owner: the story explains nothing about the wheel): tire, rim and
   * brake corner un-cut and un-hatched, while the body, bay and cabin stay sectioned. Default false.
   */
  wheelsWhole?: boolean;
  /** 'gas': the gas signal path (see `GasPathKeys`); null for none (default). */
  gasPath?: GasPathKeys | null;
  /**
   * 'gas' (and 'ev' with `drive`): the computer's yes/no from each `at` (s): `pass: true` (default before the first key) lets the
   * pulses through to the throttle; `false`: each pulse dies at the computer and the outgoing leg dims.
   */
  gate?: {at: number; pass: boolean}[];
  /** 'gas' (and 'ev' with `drive`): the power cut, 0 → 1, constant or keys: the outgoing leg goes dark and the throttle plate snaps shut (the windings go dark). Default 0. */
  cut?: Keyed;
  /**
   * 'gas': the throttle plate, 0 (closed, idle) → 1 (wide open), constant or keys. Default 'auto': it
   * follows the accelerator's press (0.15 s behind, the computer's response) while the gate passes,
   * idle while it blocks or the power is cut.
   */
  throttle?: 'auto' | Keyed;
  /**
   * 'gas': the brake switch's lead to the computer (orange: the override's input): from `at` it draws
   * over `drawFor` (default 0.4 s); `fadeAt`: it fades (0.5 s). Null for none (default).
   */
  brakeLead?: {at: number; drawFor?: number; fadeAt?: number} | null;
  /** 'gas': the nose dips under hard braking, 0 → 1 (≈ 1.3°, 🎭 a little more than real), constant or keys. Default 0. */
  noseDip?: Keyed;
  /** 'gas': the steering wheel's turn (rad, + counter-clockwise as the driver sees it), constant or keys; the hands, the column and the front wheels follow. Default 0. */
  steer?: Keyed;
  /** 'gas': how many times the front wheels turn less than the steering wheel (default 5, 🎭: the real ≈ 15 would not read). */
  steerRatio?: number;
  /**
   * 'gas': the steer-by-wire what-if (🎭). From `at` the steel shaft fades out over 0.8 s, leaving its two
   * stubs with hatched cut faces; from `wireAt` (default at + 1.0) an orange wire draws from the column's
   * angle sensor to the rack's motor over 1.2 s (node dots at both). `backAt`: the wire fades and the shaft
   * fades back in (the loop). Null for none (default).
   */
  steerByWire?: {at: number; wireAt?: number; backAt?: number} | null;
  /** 'gas': seconds a pulse runs down the steering wire (0.5 s each), once it is drawn. */
  steerPulses?: number[];
  location?: string;
  transition?: 'auto' | 'continue' | 'glide' | 'cut' | 'dissolve' | 'slide' | 'follow';
  follow?: {direction?: 'down' | 'up' | 'left' | 'right'; at?: number};
  glide?: number;
  /** Set by Explainer. */
  startFrame?: number;
  /**
   * Set by Explainer ('ev' only): the wheel revolutions already turned when this scene starts, carried
   * from the previous car-slice scene on a `continue` or glide, so the wheels, the disc (and its rust),
   * the rotor and the road scroll run on across the cut instead of restarting at 0.
   */
  revsFrom?: number;
  cameraFrom?: Framing;
  cameraGlide?: number;
};

const isEv = (p: Partial<CarSliceSceneProps>) => p.variant === 'ev';
const isGas = (p: Partial<CarSliceSceneProps>) => p.variant === 'gas';
/** The cars with the driver by the cut and the bay open (No. 006 'ev', No. 008 'gas'). */
const isBay = (p: Partial<CarSliceSceneProps>) => isEv(p) || isGas(p);
const isLeft = (p: Partial<CarSliceSceneProps>) => (p.facing ?? (isBay(p) ? 'left' : 'right')) === 'left';
/** The car's own frame (x forward) → the world (mirrored in x when it faces left). */
const toWorld = (p: Partial<CarSliceSceneProps>, v: V3): V3 => (isLeft(p) ? [-v[0], v[1], v[2]] : v);
const layoutOf = (p: Partial<CarSliceSceneProps>) => (isBay(p) ? LAYOUT_NEAR : CAR_LAYOUT);
/** A framing preset for these props (EV and mirrored versions when the car faces left). */
const framingFor = (p: Partial<CarSliceSceneProps>): Framing => {
  const name = p.framing ?? 'wide';
  if (!isLeft(p)) return CAR_FRAMINGS[name as keyof typeof CAR_FRAMINGS] ?? CAR_FRAMINGS.wide;
  const gas = isGas(p) ? GAS_FRAMINGS[name] : undefined;
  if (gas) return gas;
  const ev = EV_FRAMINGS[name];
  if (ev) return ev;
  const f = CAR_FRAMINGS[name as keyof typeof CAR_FRAMINGS] ?? CAR_FRAMINGS.wide;
  return {look: [-f.look[0], f.look[1], f.look[2]], distance: f.distance};
};

const carCameraMove = (
  p: Partial<CarSliceSceneProps>,
  durationInFrames: number,
  fps: number,
  frame?: number,
): {from: Framing; to: Framing; pre?: {from: Framing; hold: number; move: number; ease: 'cubic'}} => {
  if (p.cameraKeys && p.cameraKeys.length) {
    const base = p.camera?.from ?? framingFor(p);
    const f = framingAtKeys(p.cameraKeys, base, frame === undefined ? Infinity : frame / fps);
    return {from: f, to: f};
  }
  const push = p.push ?? 0.04;
  const pre =
    p.cameraGlide && p.cameraFrom
      ? {from: p.cameraFrom, hold: 0, move: Math.max(1, Math.round(p.cameraGlide * fps)), ease: 'cubic' as const}
      : undefined;
  const secs = Math.max(0, durationInFrames - (pre ? pre.move : 0)) / fps;
  if (p.camera) return {from: p.camera.from, to: p.camera.to ?? p.camera.from, pre};
  const preset = framingFor(p);
  const c = pre ? undefined : p.cameraFrom;
  const same = c && c.look.every((v, i) => Math.abs(v - preset.look[i]) < 1e-6);
  const from = c && same ? c : preset;
  return {from, to: {look: from.look, distance: from.distance - push * secs}, pre};
};

/**
 * What a car-slice scene hands on to the next one when it continues (Explainer): for 'ev', the wheel
 * revolutions turned by the end of this scene (its own `revsFrom` plus its speed keys over its length).
 */
export const carCarry = (
  p: Partial<CarSliceSceneProps>,
  durationInFrames: number,
  fps: number,
): Record<string, unknown> =>
  p.variant === 'ev' || p.variant === 'gas' ? {revsFrom: simRevs(p, durationInFrames / fps, fps)} : {};

export const carCameraStart = (p: Partial<CarSliceSceneProps>, d: number, fps: number): Framing =>
  carCameraMove({...p, cameraFrom: undefined, cameraGlide: undefined}, d, fps, 0).from;
export const carCameraEnd = (p: Partial<CarSliceSceneProps>, d: number, fps: number): Framing =>
  carCameraMove(p, d, fps).to;

const cameraAtFrame = (p: Partial<CarSliceSceneProps>, o: {frame: number; fps: number; durationInFrames: number}) => {
  const {from, to, pre} = carCameraMove(p, o.durationInFrames, o.fps, o.frame);
  return sectionCameraAt({
    from,
    to,
    pre,
    frame: o.frame,
    fps: o.fps,
    durationInFrames: o.durationInFrames,
    drift: p.drift ?? 0.08,
    clockOffset: (p.startFrame ?? 0) / o.fps,
  });
};

/** Top of the driver's head on screen (px), for name tags; undefined for anyone else. */
export const carHeadTopOnScreen = (
  p: Partial<CarSliceSceneProps>,
  who: CastName,
  o: {frame: number; fps: number; durationInFrames: number},
): [number, number] | undefined => {
  if ((p.driver ?? 'you') !== who) return undefined;
  const [x, y, z] = layoutOf(p).driver;
  return projectToFrame(cameraAtFrame(p, o), toWorld(p, [x - 0.05, y + 1.49, z]));
};

/** The driver's head box on screen [xMin, xMax, yTop, yBottom] (px). */
export const carHeadBoxOnScreen = (
  p: Partial<CarSliceSceneProps>,
  who: CastName,
  o: {frame: number; fps: number; durationInFrames: number},
): [number, number, number, number] | undefined => {
  if ((p.driver ?? 'you') !== who) return undefined;
  const cam = cameraAtFrame(p, o);
  const [x, y, z] = layoutOf(p).driver;
  const c: V3 = toWorld(p, [x - 0.05, y + 1.325, z]);
  const pts = [
    projectToFrame(cam, [c[0], c[1], c[2] - 0.2]),
    projectToFrame(cam, [c[0], c[1], c[2] + 0.2]),
    projectToFrame(cam, [c[0], c[1] + 0.2, c[2]]),
    projectToFrame(cam, [c[0], c[1] - 0.2, c[2]]),
  ];
  const xs = pts.map((q) => q[0]);
  const ys = pts.map((q) => q[1]);
  return [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
};

/** The instrument cluster on screen (px), for the dashboard detail box's leader. */
export const clusterOnScreen = (
  p: Partial<CarSliceSceneProps>,
  o: {frame: number; fps: number; durationInFrames: number},
) => {
  const k = layoutOf(p).cluster;
  return projectToFrame(cameraAtFrame(p, o), toWorld(p, [k[0] + 0.07, k[1] + 0.06, k[2]]));
};

/** A wheel's turn (rev) at t: the driving speed, faster for the low wheel with the indirect rings. */
/** 60 mph in wheel revolutions per second (the highway's default speed). */
export const MPH60_REVS = 26.82 / (2 * Math.PI * R);

/** The speed keys in rev/s (default: 1, a slow drive; 60 mph on the highway). */
/** 45 mph in wheel revolutions per second (the gas car's default cruise). */
export const MPH45_REVS = (45 * 0.44704) / (2 * Math.PI * R);

const drivingOf = (p: Partial<CarSliceSceneProps>): SpeedKey[] =>
  p.driving ?? [
    {
      at: 0,
      speed:
        p.variant === 'gas' || (p.variant === 'ev' && p.road === 'highway')
          ? MPH45_REVS
          : p.road === 'highway'
            ? MPH60_REVS
            : 1,
    },
  ];

/** The rate everything on the road plays at, t s into the scene (`timeScale`). */
const rateAt = (p: Partial<CarSliceSceneProps>, t: number) => Math.max(0, keyedValue(p.timeScale, t, 1));

/** The wheels' turn (rev) at t: ∫ speed × playback rate (a fixed-step sum, deterministic). */
const simRevs = (p: Partial<CarSliceSceneProps>, t: number, fps = 30) => {
  const drv = drivingOf(p);
  // highway: the road before the scene began ran at its first speed and rate, so consecutive scenes
  // at a steady speed join without the dips jumping (the street keeps No. 002's reset per scene)
  // the gas and electric cars carry their turn from the scene before (`revsFrom`), on any road
  const before =
    p.variant === 'gas' || p.variant === 'ev'
      ? (p.revsFrom ?? 0)
      : p.road === 'highway'
        ? speedAt(drv, 0, 0.8) * rateAt(p, 0) * ((p.startFrame ?? 0) / fps)
        : 0;
  if (p.timeScale === undefined || p.timeScale === 1) return before + integrateSpeed(drv, t, 0.8);
  const STEP = 1 / 120;
  let a = 0;
  for (let x = 0; x < t; x += STEP) {
    const m = x + Math.min(STEP, t - x) / 2;
    a += speedAt(drv, m, 0.8) * rateAt(p, m) * Math.min(STEP, t - x);
  }
  return before + a;
};

const wheelRevs = (p: Partial<CarSliceSceneProps>, id: WheelId, t: number) => {
  const revs = simRevs(p, t);
  const faster = p.variant === 'indirect' && p.speedRings && p.lowWheel === id ? (p.fasterBy ?? 1.1) : 1;
  return revs * faster;
};

/** Where a wheel's sensor node is (world) at t (the valve's angle as it turns). */
const sensorNode = (p: Partial<CarSliceSceneProps>, id: WheelId, t: number): V3 => {
  const w = WHEELS[id];
  const spin = wheelRevs(p, id, t) * Math.PI * 2;
  // local frame: x outboard (near +z, far −z), φ measured in (y, z_local); forward rolling turns −φ (near)
  const phi = WHEEL.valveBase + (w.near ? -spin : spin);
  const a = WHEEL.sensor.a;
  const r = WHEEL.sensor.r + 0.1;
  const side = w.near ? 1 : -1;
  // local (a, r cosφ, r sinφ) → world: x_local → side·z, z_local → −side·x (rotation about y by ∓π/2)
  return [w.x - side * r * Math.sin(phi) * R, 0.36 + r * Math.cos(phi) * R, w.z + side * a * R];
};

const routeFor = (id: WheelId, from: V3): V3[][] => {
  const w = WHEELS[id];
  const [rx, ry, rz] = C.receiver;
  // a low arc through the body and along the cabin floor, under the seat cushions, so the route's glow
  // stays on the system and off the seats (§ 5): out of the wheel arch, along the floor, up to the receiver
  if (w.x > 0)
    return [
      [from, [1.02, 0.62, w.z * 0.8], [(1.02 + rx) / 2 + 0.05, 0.56, (w.z * 0.8 + rz) / 2], [rx, ry + 0.035, rz]],
    ];
  return [[from, [-0.8, 0.55, w.z * 0.8], [0.0, 0.48, (w.z * 0.8 + rz) / 2], [rx, ry + 0.035, rz]]];
};

/** A pulse's state at t: route progress, glow, and whether it's live. */
const PULSE = {draw: 0.55, hold: 0.35, fade: 0.4};
const pulseState = (age: number) => ({
  progress: ease(age, 0, PULSE.draw),
  glow: age < 0 ? 0 : 1 - ease(age, PULSE.draw + PULSE.hold, PULSE.draw + PULSE.hold + PULSE.fade),
  live: age >= 0 && age < PULSE.draw + PULSE.hold + PULSE.fade,
});

/** An ID tag (Inter on a paper chip with an ink border), facing the camera. */
const IdTag: React.FC<{text: string; position: V3; opacity: number; mood: Mood}> = ({
  text,
  position,
  opacity,
  mood,
}) => {
  const ready = useFontsLoaded();
  const tex = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 320;
    c.height = 96;
    const t = new THREE.CanvasTexture(c);
    return {c, t, key: ''};
  }, []);
  const mat = useMemo(() => new THREE.MeshBasicMaterial({transparent: true, depthTest: false, toneMapped: false}), []);
  const m = MOODS[mood];
  const key = `${text}|${mood}`;
  if (ready && tex.key !== key) {
    const cx = tex.c.getContext('2d')!;
    cx.clearRect(0, 0, 320, 96);
    cx.fillStyle = m.paper;
    cx.fillRect(4, 4, 312, 88);
    cx.strokeStyle = m.ink;
    cx.lineWidth = 5;
    cx.strokeRect(4, 4, 312, 88);
    cx.fillStyle = m.ink;
    cx.font = `700 52px ${fonts.sans}, Arial`;
    cx.textAlign = 'center';
    cx.textBaseline = 'middle';
    cx.fillText(`ID ${text}`, 160, 52);
    tex.t.needsUpdate = true;
    tex.key = key;
    mat.map = tex.t;
    mat.needsUpdate = true;
  }
  mat.opacity = opacity;
  mat.color.setScalar(1 / m.exposure);
  const q = useMemo(
    () =>
      new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        new THREE.Vector3(...SECTION_ANGLE).normalize(),
      ),
    [],
  );
  return (
    <mesh position={position} quaternion={q} material={mat} visible={ready && opacity > 0.01} renderOrder={10}>
      <planeGeometry args={[0.5, 0.15]} />
    </mesh>
  );
};

/** The highway's ground block (metres): its ends, the front cut down the groove row (the near wheels' mid-plane), the back, depth. */
const HWY = {x: 3.8, front: C.cutZ, back: -4.2, depth: 0.7};

/**
 * The vibration path (🎭 illustrative route, ✅ ends), drawn like a run through a section (style guide
 * § 5): from the near front tire's contact patch up across the tire's cut to the hub, on up the body's
 * cut face (25 mm proud) over the wheel arch, across the dashboard's cut end and along its top to the
 * steering column and the wheel's centre (unlabelled: no part of the car is named). The branch leaves
 * above the arch, runs down the door opening's front edge, across the cabin floor between the seats
 * and up to the near side of the driver's backrest.
 */
const PROUD = C.cutZ + 0.025;
const VIB_MAIN: V3[] = [
  [WHEELS.FR.x, 0.012, PROUD],
  [WHEELS.FR.x, R, PROUD],
  [WHEELS.FR.x - 0.02, 0.84, PROUD],
  [1.13, 0.99, PROUD],
  [1.04, 1.235, C.cutZ - 0.02],
  [0.95, 1.245, 0.2],
  [0.88, 1.27, -0.26],
  // the node on the wheel's hub, on its camera side (the driver's side is hidden by the hub)
  [C.steering[0] + 0.06, C.steering[1] - 0.02, C.steering[2] + 0.02],
];
const VIB_SEAT: V3[] = [
  [WHEELS.FR.x - 0.02, 0.84, PROUD],
  [1.0, 0.8, PROUD],
  [0.93, 0.44, PROUD],
  [0.8, 0.37, 0.5],
  [0.42, 0.37, 0.02],
  [0.16, 0.5, -0.04],
  [0.06, 0.95, -0.1],
  // the node on the near side of the driver's backrest (its cushion is hidden by the passenger seat)
  [-0.03, 1.24, -0.12],
];
/** The path's core radius: § 5's 0.018 × 1.25 (visual review: thicker so it reads at phone size); the halo keeps § 5's ratio. */
const VIB_R = 0.0225;
/** How far along the main path the branch leaves it (above the arch). */
const VIB_BRANCH = 0.3;

// ---------------------------------------------------------------- No. 006: the electric car's system paths
// (the car's own frame, x forward: the scene mirrors them with the car when it faces left)

/** Regen, leg A: the near front hub → along the half-shaft → the final and intermediate gears → the rotor. */
const REGEN_A: V3[] = [
  [C.axleX.front, R, C.cutZ - 0.005],
  // along the top of the half-shaft (on its axis the shaft would hide it in close-ups)
  [C.axleX.front, R + 0.032, 0.66],
  [C.axleX.front, R + 0.032, EV.gearZ + 0.1],
  [EV.final.c[0], EV.final.c[1] + 0.02, EV.gearZ + 0.035],
  [EV.inter.c[0], EV.inter.c[1], EV.gearZ + 0.035],
  [EV.motor[0], EV.motor[1], EV.motorZ + 0.03],
];
/** Leg B: from the windings out through the phase cables to the inverter. */
const REGEN_B: V3[] = [
  [EV.motor[0] + 0.05, EV.motor[1] + 0.12, EV.motorZ + 0.03],
  [1.265, 0.84, EV.motorZ + 0.01],
  [1.2, (EV.inverter[2] + EV.inverter[3]) / 2, EV.inverter[5] + 0.025],
];
/** Leg C: the inverter → down the HV cable → into the pack's front module. */
const REGEN_C: V3[] = [
  [1.16, (EV.inverter[2] + EV.inverter[3]) / 2, EV.inverter[5] + 0.025],
  ...EV.hv.map(([x, y, z]) => [x, y, z + 0.035] as V3),
  [moduleSpan(0)[1] - 0.04, MODULE_Y[1] + 0.012, EV.packZ + 0.025],
];
/** The brake-light signal: the inverter → down the firewall → along the sill's cut face → up to the rear lamp. */
const SIGNAL_LEG: V3[] = [
  [1.06, 0.88, EV.inverter[5]],
  [1.0, 0.42, 0.6],
  [0.9, 0.352, C.cutZ + 0.03],
  [-0.84, 0.352, C.cutZ + 0.03],
  [-0.92, 0.88, C.cutZ + 0.03],
  [-2.2, 0.92, C.cutZ + 0.03],
  [-2.36, 1.0, 0.7],
];

/**
 * No. 008, power to the motor (car frame): the accelerator's sensor → up the toe board and the
 * firewall's cut face → the inverter's control board; then the board → down the phase cables → the
 * stator. The reverse of the regen's leg B, so the same wiring carries it the other way.
 */
const EV_ROUTES: Record<'pedal' | 'phase', V3[]> = {
  pedal: [
    [EV.accelHinge[0] - 0.01, EV.accelHinge[1] + 0.03, EV.pedalZ + 0.07],
    [0.86, 0.44, 0.43],
    [0.96, 0.78, 0.43],
    [1.06, 0.95, 0.42],
    [EV_BOARD[0] + 0.03, (EV_BOARD[2] + EV_BOARD[3]) / 2, EV.inverter[5] + 0.03],
  ],
  phase: [
    [EV_BOARD[0] + 0.08, EV_BOARD[2] + 0.01, EV.inverter[5] + 0.03],
    [1.265, 0.84, EV.motorZ + 0.03],
    [EV.motor[0] + 0.05, EV.motor[1] + 0.12, EV.motorZ + 0.03],
  ],
};

/** The regen path's state at t (see `RegenKeys`). */
const regenState = (k: RegenKeys | null | undefined, t: number) => {
  if (!k) return null;
  const rotorAt = k.rotorAt ?? k.at + 1.8;
  const windingsAt = k.windingsAt ?? rotorAt + 0.2;
  const inverterAt = k.inverterAt ?? windingsAt + 1.0;
  const batteryAt = k.batteryAt ?? inverterAt + 1.2;
  const fullAt = k.fullAt ?? batteryAt + 1.4;
  const fill = k.fill ?? 0.45;
  const glow = k.fadeAt == null ? 1 : 1 - ease(t, k.fadeAt, k.fadeAt + (k.fadeFor ?? 0.7));
  const span = Math.max(0.3, fullAt - batteryAt);
  return {
    a: ease(t, k.at, rotorAt),
    b: ease(t, windingsAt + 0.25, inverterAt),
    c: ease(t, inverterAt, batteryAt),
    windingsAt,
    coils: (i: number) => ease(t, windingsAt + (0.8 * i) / 24, windingsAt + (0.8 * i) / 24 + 0.15),
    modules: [...Array(EV.modules).keys()].map(
      (m) =>
        fill *
        ease(t, batteryAt + (span * 0.75 * m) / EV.modules, batteryAt + (span * 0.75 * m) / EV.modules + span * 0.4),
    ),
    bright: k.brightAt == null ? 0 : ease(t, k.brightAt, k.brightAt + 0.4),
    glow,
    started: t >= k.at,
  };
};

/** 🎭 YOU's right (pedal) foot in the EV variant, a little larger so on → off reads at phone size. */
const EV_FOOT = 1.3;

/** The pedal foot at t from its keys: ankle (car frame x, y), pitch, and how far the accelerator is pressed. */
const footAt = (keys: CarSliceSceneProps['foot'], t: number) => {
  const ks = [...(keys && keys.length ? keys : [{at: -1, pose: 'floor' as const}])].sort((a, b) => a.at - b.at);
  const state = (k: (typeof ks)[number]) => {
    const press = k.pose === 'accel' ? (k.press ?? 0.5) : 0;
    return {
      ...footPose(k.pose === 'accel' ? 'accel' : 'floor', press, C.floor, EV_FOOT),
      w: k.pose === 'accel' ? 1 : 0,
      press,
    };
  };
  let cur = state(ks[0]);
  for (const k of ks.slice(1)) {
    if (t <= k.at) break;
    const tgt = state(k);
    const D = 0.75;
    const u = Math.max(0, Math.min(1, (t - k.at) / D));
    const mix = (a: number, b: number, w: number) => a + (b - a) * w;
    if (cur.w !== tgt.w) {
      // a lift (🎭 a little exaggerated, so it reads at phone size): the foot rises clear of the pad as
      // the pedal springs back, swings across, and settles; the other way it lifts, swings onto the
      // pad, and only then presses it
      const off = tgt.w < cur.w;
      const up = 0.12 * (ease(u, 0, 0.3) - ease(u, 0.62, 1));
      const move = ease(u, 0.22, 0.85);
      cur = {
        x: mix(cur.x, tgt.x, move),
        y: mix(cur.y, tgt.y, move) + up,
        pitch: mix(cur.pitch, tgt.pitch, move),
        w: mix(cur.w, tgt.w, off ? ease(u, 0, 0.25) : ease(u, 0.8, 1)),
        press: off ? cur.press * (1 - ease(u, 0, 0.25)) : tgt.press * ease(u, 0.8, 1),
      };
    } else {
      const w = ease(t, k.at, k.at + 0.5);
      cur = {
        x: mix(cur.x, tgt.x, w),
        y: mix(cur.y, tgt.y, w),
        pitch: mix(cur.pitch, tgt.pitch, w),
        w: mix(cur.w, tgt.w, w),
        press: mix(cur.press, tgt.press, w),
      };
    }
  }
  return cur;
};

/** The gas car's pedal foot at t: ankle (car frame x, y), pitch, side offset, and both pedals' presses. */
const gasFootAt = (keys: CarSliceSceneProps['foot'], t: number) => {
  const ks = [...(keys && keys.length ? keys : [{at: -1, pose: 'accel' as const}])].sort((a, b) => a.at - b.at);
  const state = (k: FootKey) => ({
    ...gasFootPose(k.pose, k.press ?? (k.pose === 'accel' ? 0.5 : 0.8), k.edge ?? 0.45, C.floor, EV_FOOT),
    pose: k.pose,
  });
  let cur = state(ks[0]);
  for (const k of ks.slice(1)) {
    if (t <= k.at) break;
    const tgt = state(k);
    const mix = (a: number, b: number, w: number) => a + (b - a) * w;
    // brake ↔ both slide (the brake stays pressed); any other change of pedal is a lift (the EV's)
    const slide =
      cur.pose === tgt.pose || (cur.brake > 0 && tgt.brake > 0 && cur.pose !== 'floor' && tgt.pose !== 'floor');
    if (!slide) {
      const D = k.dur ?? (tgt.pose === 'brake' || tgt.pose === 'both' ? 0.4 : 0.75);
      const u = Math.max(0, Math.min(1, (t - k.at) / D));
      const up = 0.1 * (ease(u, 0, 0.3) - ease(u, 0.62, 1));
      const move = ease(u, 0.22, 0.85);
      cur = {
        x: mix(cur.x, tgt.x, move),
        y: mix(cur.y, tgt.y, move) + up,
        pitch: mix(cur.pitch, tgt.pitch, move),
        side: mix(cur.side, tgt.side, move),
        accel: cur.accel * (1 - ease(u, 0, 0.25)) + tgt.accel * ease(u, 0.8, 1),
        brake: cur.brake * (1 - ease(u, 0, 0.25)) + tgt.brake * ease(u, 0.75, 1),
        pose: tgt.pose,
      };
    } else {
      const w = ease(t, k.at, k.at + (k.dur ?? 0.5));
      cur = {
        x: mix(cur.x, tgt.x, w),
        y: mix(cur.y, tgt.y, w),
        pitch: mix(cur.pitch, tgt.pitch, w),
        side: mix(cur.side, tgt.side, w),
        accel: mix(cur.accel, tgt.accel, w),
        brake: mix(cur.brake, tgt.brake, w),
        pose: tgt.pose,
      };
    }
  }
  return cur;
};

/** A pulse's travel time on each leg of the gas path (s), and how long one takes to die at the computer. */
const GAS_PULSE = {leg: 0.45, die: 0.3};
/** Pulses a second leaving the pedal's sensor at a press (0 → 1): faster the further it is pressed. */
const pulseRate = (press: number) => 0.7 + 2.3 * Math.max(0, Math.min(1, press));

/** The gate (the computer's yes) at t, 0 (no) → 1 (yes), eased over 0.12 s. */
const gateAt = (keys: CarSliceSceneProps['gate'], t: number) => {
  const ks = [...(keys ?? [])].sort((a, b) => a.at - b.at);
  let v = ks.length && ks[0].at <= 0 ? (ks[0].pass ? 1 : 0) : 1;
  for (const k of ks) {
    if (t < k.at) break;
    const tgt = k.pass ? 1 : 0;
    v = v + (tgt - v) * ease(t, k.at, k.at + 0.12);
  }
  return v;
};

/**
 * The pulses on the gas path at t: when each left the sensor (the press integrated, so they come faster
 * as the pedal goes down), as [emitted at, age]. `before`: the scene's start in the video (pulses keep
 * their rhythm across a cut at the same press). Only those emitted after `from` (the first leg drawn).
 */
const gasPulses = (
  keys: CarSliceSceneProps['foot'],
  t: number,
  from: number,
  before: number,
  pressAt: (keys: CarSliceSceneProps['foot'], t: number) => number = (k, x) => gasFootAt(k, x).accel,
) => {
  const H = 1 / 60;
  const window = GAS_PULSE.leg * 2 + GAS_PULSE.die + 0.1;
  const t0 = Math.max(from, t - window, 0);
  // Φ(t0): the pulses already sent (from the scene's start at its first press, plus the time before it)
  let phi = pulseRate(pressAt(keys, 0)) * before;
  for (let x = 0; x < t0; x += H) phi += pulseRate(pressAt(keys, x + Math.min(H, t0 - x) / 2)) * Math.min(H, t0 - x);
  const out: number[] = [];
  if (t < t0) return out;
  // a pulse leaves each time Φ crosses a whole number
  for (let x = t0; x < t; x += H) {
    const h = Math.min(H, t - x);
    const r = pulseRate(pressAt(keys, x + h / 2));
    const next = phi + r * h;
    for (let n = Math.floor(phi) + 1; n <= next; n++) out.push(x + ((n - phi) / (next - phi)) * h);
    phi = next;
  }
  return out;
};

/** A traffic signal's lit lens at t from its keys (default red). */
const lightAt = (keys: CarCorner['lights'], t: number): 'red' | 'green' | 'off' => {
  const ks = [...(keys ?? [])].sort((a, b) => a.at - b.at);
  let st: 'red' | 'green' | 'off' = ks.length && ks[0].at <= 0 ? ks[0].state : 'red';
  for (const k of ks) if (t >= k.at) st = k.state;
  return st;
};

/** The road on a cut ground block: lane paint that scrolls (DataTexture, u along x). */
const ROAD = {x: 3.8, z: 1.75, depth: 0.7, tile: 7.6};
const roadTexture = (mood: Mood) => {
  const W = 512;
  const H = 128;
  const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [a, l] = [hex(CAR[mood].asphalt), hex(CAR[mood].lane)];
  const data = new Uint8Array(W * H * 4);
  for (let j = 0; j < H; j++) {
    // v 0 at the back (−z) → 1 at the front (+z)
    const z = -ROAD.z + ((j + 0.5) / H) * 2 * ROAD.z;
    for (let i = 0; i < W; i++) {
      const u = i / W;
      const dash = Math.abs(z + 1.35) < 0.05 && u * 8 - Math.floor(u * 8) < 0.5;
      const edge = Math.abs(z - 1.42) < 0.05;
      // a fine seeded-free grain: a fixed pattern from the indices
      const g = ((i * 73 + j * 151) % 17) - 8;
      const c = dash || edge ? l : a.map((v) => v + g * 0.8);
      const o = (j * W + i) * 4;
      data[o] = c[0];
      data[o + 1] = c[1];
      data[o + 2] = c[2];
      data[o + 3] = 255;
    }
  }
  const t = new THREE.DataTexture(data, W, H, THREE.RGBAFormat);
  t.wrapS = THREE.RepeatWrapping;
  t.magFilter = THREE.LinearFilter;
  t.minFilter = THREE.LinearFilter;
  t.needsUpdate = true;
  return t;
};

/** The gas car's nose dip: the body pitched about a pivot (the rear axle); a plain pass-through when off. */
const Dip: React.FC<{on: boolean; angle: number; pivot: V3; children: React.ReactNode}> = ({
  on,
  angle,
  pivot,
  children,
}) =>
  on ? (
    <group position={pivot} rotation={[0, 0, angle]}>
      <group position={[-pivot[0], -pivot[1], -pivot[2]]}>{children}</group>
    </group>
  ) : (
    <>{children}</>
  );

/**
 * C, the car slice (No. 002): a generic car cut open (near side along the near wheels' mid-plane, the
 * roof above the windows), the driver at the wheel, four turning wheels on a scrolling road on a cut
 * ground block. 'sensors': each wheel has a sensor (orange node dot); pulses run as orange routes from a
 * wheel to the receiver under the dash (node dots at both ends), with optional ID tags; the
 * cluster's tire light comes on in warning yellow. 'indirect': no sensors and no orange; toothed
 * speed rings and sidewall ticks, the low wheel turning faster. The low tire sags in both.
 */
export const CarSliceScene: React.FC<CarSliceSceneProps> = (props) => {
  const {
    durationInFrames,
    mood = 'day',
    variant = 'sensors',
    driver = 'you',
    pulses = [],
    ids = false,
    lowWheel = null,
    warningAt = null,
    speedRings = false,
    wire,
    startFrame = 0,
  } = props;
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const m = MOODS[mood];
  // No. 008: the gas car, on the highway by default
  const gas = variant === 'gas';
  const roadKind = props.road ?? (variant === 'ev' ? 'city' : gas ? 'highway' : 'street');
  const hw = roadKind === 'highway';
  // the highway: on the shoulder's groove row (No. 005) or in the lane (no grooves under the car)
  const lane = hw && (props.highwayLane ?? (gas || variant === 'ev' ? 'lane' : 'shoulder')) === 'lane';
  const wet = hw && (props.wet ?? false);
  // the highway's car has no tire sensors (no orange but the grooves, the drops and the path)
  const sensors = variant === 'sensors' && !hw;
  // No. 006: the electric car, facing left by default, on the city road
  const ev = variant === 'ev';
  const left = isLeft(props);
  const dir = left ? -1 : 1;
  const city = roadKind === 'city';
  const bay = ev || gas;
  const lay = layoutOf(props);
  const {from, to, pre} = carCameraMove(props, durationInFrames, fps, frame);

  const mats = useMemo(() => {
    const road = new THREE.MeshStandardMaterial({color: raw('#ffffff'), roughness: 0.92, map: roadTexture(mood)});
    road.map!.repeat.set((2 * ROAD.x) / ROAD.tile, 1);
    return {
      sky: new THREE.MeshBasicMaterial({map: skyTexture(mood), fog: false}),
      road,
      earth: new THREE.MeshStandardMaterial({color: raw(m.earth), roughness: 1}),
      cut: cutMaterial(),
      node: new THREE.MeshBasicMaterial({color: raw(section.orange)}),
      nodeOff: new THREE.MeshStandardMaterial({color: raw(section.ledOff), roughness: 0.4}),
      // the highway: interstate asphalt with the white edge line and the milled row, along x
      asphalt: wet
        ? asphaltMaterial(
            {across: '(vRoadPos.z - uAcross)', along: '(-vRoadPos.x)', key: 'car-slice-asphalt'},
            {wet, mood},
          )
        : asphaltMaterial({across: '(vRoadPos.z - uAcross)', along: '(-vRoadPos.x)', key: 'car-slice-asphalt'}),
      hidden: new THREE.MeshBasicMaterial({visible: false}),
      air: new THREE.MeshBasicMaterial({color: raw(section.orange), transparent: true, depthWrite: false, opacity: 0}),
      pulseHalo: new THREE.MeshBasicMaterial({
        color: raw(section.orange),
        transparent: true,
        depthWrite: false,
        opacity: 0.5,
      }),
      pulseCore: new THREE.MeshBasicMaterial({color: raw(section.orangeDot)}),
      rubberCut: new THREE.MeshBasicMaterial({color: raw(section.cut)}),
      ink: new THREE.MeshBasicMaterial({color: raw(section.cutLine)}),
      band: [bandMaterial(), bandMaterial()],
      // the dotted flat-road reference line (ink, unlit): dots `uPeriod` apart along x
      refLine: new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: {uPeriod: {value: 0.01}, uAlpha: {value: 0}, cInk: {value: raw(section.cutLine)}},
        vertexShader: `varying float vX; void main() { vec4 w = modelMatrix * vec4(position, 1.0); vX = w.x; gl_Position = projectionMatrix * viewMatrix * w; }`,
        fragmentShader: `varying float vX; uniform float uPeriod, uAlpha; uniform vec3 cInk;
          void main() { if (fract(vX / uPeriod) > 0.45 || uAlpha < 0.003) discard; gl_FragColor = vec4(cInk, uAlpha); }`,
      }),
    };
  }, [mood, m.earth, wet]);
  const headlamps = useMemo(
    () => [-0.55, 0.55].map(() => new THREE.SpotLight(raw(HIGHWAY.headlight), 0, 30, 0.42, 0.6, 1)),
    [],
  );
  [-0.55, 0.55].forEach((zz, i) => {
    const l = headlamps[i];
    l.intensity = hw && mood === 'night' ? 14 : 0;
    l.position.set(2.3, 0.8, zz);
    l.target.position.set(12, 0, zz * 2);
    l.target.updateMatrixWorld();
  });
  mats.sky.color.setScalar(1 / m.exposure);
  mats.rubberCut.color.copy(raw(section.cut)).multiplyScalar(0.8 / m.exposure);
  const revs = simRevs(props, t, fps);
  const distance = revs * Math.PI * 2 * R;
  mats.road.map!.offset.x = (-dir * distance) / ROAD.tile;

  // ---- the highway (No. 005): the groove row under the near wheels, the drops, the system
  const night = mood === 'night';
  // close-ups thin the ink (≈ 3 px held from the wide framing in) and shrink the rings
  const camNow = cameraAtFrame(props, {frame, fps, durationInFrames});
  const camD = camNow.position.distanceTo(camNow.look);
  // close-ups thin the ink (≈ 3 px held); the electric car's close-ups go far closer than the highway's
  const inkK = bay ? Math.max(0.03, Math.min(1, camD / 12.75)) : hw ? Math.max(0.2, Math.min(1, camD / 12.75)) : 1;
  const ringK = hw ? Math.max(0.35, Math.min(1, camD / 7.5)) : 1;
  const vRoad = speedAt(drivingOf(props), t, 0.8) * rateAt(props, t) * 2 * Math.PI * R; // m/s on screen
  const blurM = vRoad * (0.5 / fps); // metres the road moves while the shutter is open
  // the dips smear out once the road moves more than about a dip while the shutter is open
  const smear = hw ? Math.max(0, Math.min(1, (blurM - 0.3 * GROOVE.length) / GROOVE.period)) : 0;
  const leaveK = hw && props.leaveAt != null ? ease(t, props.leaveAt, props.leaveAt + 0.8) : 0;
  const lateral = 0.45 * leaveK;
  // where the cut is across the row (its centre at 0), and how much of a dip it cuts
  const rowAt = -lateral;
  const onRow = hw && !lane ? Math.max(0, Math.min(1, (GROOVE.half - Math.abs(rowAt)) / 0.03)) : 0;
  const dipScale = Math.max(0, Math.min(MAX_AMP, props.dipScale ?? 2.5));
  const ampShow = onRow * (1 - smear) * dipScale;
  const asphaltU = mats.asphalt.userData.uniforms as Record<string, {value: number}>;
  asphaltU.uScroll.value = distance;
  asphaltU.uBlur.value = blurM;
  asphaltU.uAcross.value = lane
    ? -HIGHWAY_LAYOUT.lanes.right
    : C.cutZ - (HIGHWAY_LAYOUT.groove.x0 + HIGHWAY_LAYOUT.groove.x1) / 2 + lateral;
  const nearWheels = (['FR', 'RR'] as WheelId[]).map((id) => {
    const xw = WHEELS[id].x;
    // the rigid tire resting on the dips; at speed (smeared) a fine deterministic hum instead
    const hum = (random(`car-hum-${id}-${frame}`) - 0.5) * 2;
    const drop = hw
      ? tireDrop(xw, distance, R, onRow * (1 - smear)) * dipScale + smear * onRow * (1 - leaveK) * 0.0016 * (1 + hum)
      : 0;
    // the dips this tire has crossed: seconds since each of the last three centres passed under it
    const u = -xw - distance;
    const since = Math.ceil(u / GROOVE.period) * GROOVE.period - u;
    const ages = [0, 1, 2].map((j) => (since + j * GROOVE.period) / Math.max(vRoad, 1e-4));
    return {id, xw, drop, ages};
  });
  const dropOf = (id: WheelId) => nearWheels.find((n) => n.id === id)?.drop ?? 0;
  // a drop counts while the tires were on the row and before they left it
  const onAt = (tt: number) => (props.leaveAt == null || tt < props.leaveAt) && onRow > 0.5;
  const impactsAt = props.impactsAt === undefined ? 0 : props.impactsAt;
  const bandAmt = !hw
    ? 0
    : props.band === undefined || props.band === 'auto'
      ? Math.max(0, Math.min(1, (vRoad / GROOVE.period - 6) / 12)) *
        onRow *
        (1 - leaveK) *
        (impactsAt === null || t < impactsAt ? 0 : 1)
      : Math.max(0, Math.min(1, keyedValue(props.band, t, 0))) * (1 - leaveK);
  const squeezeK =
    hw && !lane && props.squeezeAt !== null ? ease(t, props.squeezeAt ?? 0, (props.squeezeAt ?? 0) + 0.4) : 0;
  const airK = hw && props.airAt != null ? ease(t, props.airAt, props.airAt + 0.3) : 0;
  mats.air.opacity = 0.85 * airK;
  // the band ≈ 25 px tall at any framing (visual review: +30%)
  const bandH = Math.max(0.039, 0.00585 * camD);
  // the reference line: ≈ 7 px dots at the contact framing, ≈ 2.6 dot-widths apart, only in close-ups
  const refH = INK * Math.max(inkK, 0.3) * 1.1;
  mats.refLine.uniforms.uPeriod.value = refH * 2.6;
  mats.refLine.uniforms.uAlpha.value = hw ? 0.95 * (1 - ease(camD, 5, 8)) * onRow : 0;
  // the band behind each near tire (FR, RR): how much, and where its bright head is (just ahead of the contact)
  mats.band.forEach((b, i) => {
    b.uniforms.uAmt.value = bandAmt;
    b.uniforms.uHead.value = WHEELS[i === 0 ? 'FR' : 'RR'].x + 0.03;
  });
  // the body shivers with the drops (a third of the tires' sink), hums at speed
  const bodyY = hw ? (-0.3 * (dropOf('FR') + dropOf('RR'))) / 2 : 0;
  // the trapped air and the tread's bulge under each near tire (strips in the cut plane)
  const contact = nearWheels.map((n) => {
    const xs = [...Array(STRIP_N).keys()].map((i) => n.xw - 0.1 + (0.2 * i) / (STRIP_N - 1));
    const yc = R - n.drop;
    const yt = xs.map((x) => yc - Math.sqrt(Math.max(0, R * R - (x - n.xw) ** 2)));
    const floor = xs.map((x) => profileY(x, distance, ampShow));
    const tread = yt.map((y, i) => {
      const inDip = floor[i] < -1e-5;
      const win = Math.max(0, 1 - ((xs[i] - n.xw) / 0.1) ** 2);
      return y - (inDip ? squeezeK * 0.45 * Math.max(0, y - floor[i]) * win : 0);
    });
    const pocketTop = tread.map((y, i) =>
      floor[i] < -1e-5 && Math.abs(xs[i] - n.xw) < 0.09 ? Math.max(floor[i], Math.min(0, y)) : floor[i],
    );
    const bulging = tread.map((y, i) => yt[i] - y > 2e-4);
    return {...n, xs, yt, floor, tread, pocketTop, bulging};
  });

  const warn = warningAt !== null && t >= warningAt;

  // the driver: hands on the wheel, eyes on the road; a glance down at the cluster
  const glanceAt = props.glanceAt === undefined ? (warningAt === null ? null : warningAt + 0.2) : props.glanceAt;
  const gestures: Gesture[] = [
    {pose: 'drive', at: -1},
    ...(glanceAt === null ? [] : [{pose: 'glance-down' as const, at: glanceAt, hold: 1.4}]),
    ...(props.gestures ?? []),
  ];
  // the vibration path (highway): draw progress, glow, and the hands' buzz once it reaches the wheel
  const vib = hw && props.vibration ? props.vibration : null;
  const vibWheelAt = vib ? (vib.wheelAt ?? vib.at + 1.7) : 0;
  const vibSeatAt = vib ? (vib.seatAt ?? vibWheelAt + 1.4) : 0;
  const vibMain = vib ? ease(t, vib.at, vibWheelAt) : 0;
  const vibBranch = vib ? ease(t, vib.at + VIB_BRANCH * (vibWheelAt - vib.at), vibSeatAt) : 0;
  const vibGlow = vib ? 1 - (props.leaveAt == null ? 0 : ease(t, props.leaveAt, props.leaveAt + 0.6)) : 0;
  const buzz = vib ? ease(t, vibWheelAt - 0.1, vibWheelAt + 0.2) * vibGlow * onRow : 0;
  // the "feel it" tremble: keyed, gated to the grooves on the highway, plus short kicks
  const kick = (props.shakeKick ?? []).reduce((a, k) => {
    const age = t - k;
    return age < 0 || age > 0.35 ? a : a + 2 * (1 - age / 0.35) ** 2;
  }, 0);
  const shakeAmt = Math.max(0, keyedValue(props.shake, t, 0)) * (hw ? onRow * (1 - leaveK) : 1) + kick;
  const sj = (k: string, a: number) =>
    shakeAmt > 0 ? (random(`car-shake-${k}-${frame}`) - 0.5) * 2 * a * shakeAmt : 0;
  const bodyJ: V3 = [sj('bx', 0.0025), sj('by', 0.003), sj('bz', 0.0025)];
  const jig = (k: string) =>
    (random(`car-buzz-${k}-${frame}`) - 0.5) * 2 * 0.006 * Math.max(buzz, Math.min(1.5, shakeAmt));
  const hands0: [V3, V3] = [
    [-0.16 + jig('rx'), 1.02 + jig('ry'), 0.4 + jig('rz')],
    [0.16 + jig('lx'), 1.04 + jig('ly'), 0.41 + jig('lz')],
  ];

  // pulses: live ones draw their routes; the receiver's dot lights once one has arrived (trace)
  const live = sensors ? pulses.map((p) => ({...p, ...pulseState(t - p.at), age: t - p.at})) : [];
  const arrived = live.some((p) => p.age >= PULSE.draw);
  const lowK = lowWheel ? (props.lowAt === undefined ? 1 : ease(t, props.lowAt, props.lowAt + 1.2)) : 0;
  const head = (legs: V3[][], k: number): V3 => {
    const c = new THREE.CatmullRomCurve3(legs[0].map((p) => new THREE.Vector3(...p)));
    const v = c.getPointAt(Math.min(0.999, Math.max(0, k)));
    return [v.x, v.y, v.z];
  };
  const idLabels = {...DEFAULT_IDS, ...(props.idLabels ?? {})};

  // ---- No. 006: the electric car's state
  const regen = ev ? regenState(props.regen, t) : null;
  const rg = regen ? regen.glow : 0;
  const wheelSpin = wheelRevs(props, 'FR', t) * Math.PI * 2;
  const wheelBlur = (wheelRevs(props, 'FR', t + 0.25 / fps) - wheelRevs(props, 'FR', t - 0.25 / fps)) * Math.PI * 2;
  const ratio = props.rotorRatio ?? 3;
  // in the car's own frame the near front wheel (and the final gear) turn by −dir × its world turn
  const gearSpin = -wheelSpin;
  const rotorSpin = gearSpin * ratio;
  const rotorBlur = -wheelBlur * ratio;
  // No. 008, power to the motor: how bright the windings are (the press, through the gate and the cut, once the
  // phase leg has arrived), and a lit band leading the magnets by a quarter pole (the field pulling the rotor)
  const dv = ev && props.drive ? props.drive : null;
  const dvFor = dv?.drawFor ?? 1.0;
  const dvAmp = dv
    ? (dv.motorAt == null ? 0 : ease(t, dv.motorAt + dvFor - 0.15, dv.motorAt + dvFor + 0.35)) *
      (0.35 + 0.65 * footAt(props.foot, t - 0.1).press) *
      (0.15 + 0.85 * gateAt(props.gate, t)) *
      (1 - Math.max(0, Math.min(1, keyedValue(props.cut, t, 0)))) *
      (dv.fadeAt == null ? 1 : 1 - ease(t, dv.fadeAt, dv.fadeAt + (dv.fadeFor ?? 0.7)))
    : 0;
  const driveSlots =
    dv && dvAmp > 0.003
      ? [...Array(24).keys()].map((i) => {
          const a = ((i + 0.5) / 24) * Math.PI * 2;
          const lead = Math.sign(rotorBlur || 1) * (Math.PI / 16);
          let b = 0;
          for (let k = 0; k < 8; k++) {
            const x = a - rotorSpin - lead - (k / 8) * Math.PI * 2;
            b = Math.max(b, Math.max(0, 1 - Math.abs(Math.atan2(Math.sin(x), Math.cos(x))) / 0.32) ** 1.4);
          }
          const fast = Math.max(0, Math.min(1, (Math.abs(rotorBlur) - 0.3) / 0.4));
          return dvAmp * (b * (1 - fast) + 0.6 * fast);
        })
      : undefined;
  const regenSlots = regen
    ? [...Array(24).keys()].map((i) => {
        const a = ((i + 0.5) / 24) * Math.PI * 2;
        let b = 0;
        for (let k = 0; k < 8; k++) {
          const d = Math.atan2(
            Math.sin(a - rotorSpin - (k / 8) * Math.PI * 2),
            Math.cos(a - rotorSpin - (k / 8) * Math.PI * 2),
          );
          b = Math.max(b, Math.max(0, 1 - Math.abs(d) / 0.32) ** 1.4);
        }
        // fast: the shutter averages the sweep into a steady glow
        const fast = Math.max(0, Math.min(1, (Math.abs(rotorBlur) - 0.3) / 0.4));
        const amp = (0.6 + 0.4 * regen.bright) * rg * regen.coils(i);
        return amp * (b * (1 - fast) + 0.5 * fast);
      })
    : undefined;
  const slots =
    regenSlots && driveSlots ? regenSlots.map((v, i) => Math.max(v, driveSlots[i])) : (regenSlots ?? driveSlots);
  const foot = ev ? footAt(props.foot, t) : null;
  const toFig = (x: number, y: number): V3 => [0, y - lay.driver[1], x - lay.driver[0]];
  const legs: [{ankle: V3; pitch?: number; side?: number}, {ankle: V3; pitch?: number; side?: number}] | undefined = gas
    ? ([
        {ankle: toFig(0.35, C.floor + 0.18), pitch: -0.5},
        // the pedal foot (figure-local +x is the car's −z: across toward the cut is −side)
        ...(() => {
          const f = gasFootAt(props.foot, t);
          return [{ankle: toFig(f.x, f.y), pitch: f.pitch, side: -f.side}];
        })(),
      ] as [{ankle: V3; pitch?: number}, {ankle: V3; pitch?: number; side?: number}])
    : foot
      ? [
          // the near foot (the driver's left, mirrored) tucked back under the knee, resting on its toes, so the
          // near shin stays clear of the right foot and both pedals from the fixed camera (owner review)
          {ankle: toFig(0.35, C.floor + 0.18), pitch: -0.5},
          {ankle: toFig(foot.x, foot.y), pitch: foot.pitch},
        ]
      : undefined;
  const sig = ev && props.signal ? props.signal : null;
  const sigLampsAt = sig ? (sig.lampsAt ?? sig.at + 1.2) : 0;
  const sigK = sig ? ease(t, sig.at, sigLampsAt) : 0;
  const sigGlow = sig ? (sig.fadeAt == null ? 1 : 1 - ease(t, sig.fadeAt, sig.fadeAt + 0.6)) : 0;
  const brakeK = bay
    ? props.brakeLights !== undefined
      ? Math.max(0, Math.min(1, keyedValue(props.brakeLights, t, 0)))
      : sig
        ? ease(t, sigLampsAt - 0.1, sigLampsAt + 0.1)
        : 0
    : undefined;
  const power = ev
    ? props.power !== undefined
      ? keyedValue(props.power, t, 0)
      : regen && regen.started
        ? -0.6 * rg
        : 0
    : 0;
  // the city: where the corners and signs are now (they ride the road)
  const distAt = (tt: number) => simRevs(props, tt, fps) * Math.PI * 2 * R;
  const frontX = C.axleX.front;
  const along = (ahead: number, when = 0) => dir * (frontX + ahead) - dir * (distance - distAt(when));
  const corners = city
    ? (props.corners ?? []).map((c) => ({
        x: along(c.ahead, c.when),
        line: c.line,
        post: c.post,
        signal: c.signal === false ? null : lightAt(c.lights, t),
      }))
    : [];
  const signs = city
    ? (props.signs ?? []).map((g) => ({
        x: along(g.ahead, g.when),
        kind: g.kind ?? ('speed' as RoadSignKind),
        text: g.text ?? ['SPEED', 'LIMIT', '25'],
      }))
    : [];
  const rust = keyedValue(props.rust, t, 0);
  // the wheel's cut-away: the full range, narrowed by `wedgeOpen` (quantized: the geometry rebuilds on change)
  const wedgeFull: [number, number] | undefined =
    props.wedge === null
      ? undefined
      : (props.wedge ?? (['brake', 'pads', 'disc'].includes(props.framing ?? '') ? [-2.1, -0.45] : undefined));
  const wedgeK = Math.round(Math.max(0, Math.min(1, keyedValue(props.wedgeOpen, t, 1))) * 60) / 60;
  const wedgeNow: [number, number] | undefined =
    wedgeFull && wedgeK > 0 ? [wedgeFull[0], wedgeFull[0] + wedgeK * (wedgeFull[1] - wedgeFull[0])] : undefined;
  // the paths keep ≈ their wide-shot thickness on screen in close-ups (quantized: the tube rebuilds on change)
  const pathR = bay ? VIB_R * Math.max(0.3, Math.min(1, Math.round((camD / 9) * 20) / 20)) : VIB_R;
  // ---- No. 008: the gas car's state
  const gasFoot = gas ? gasFootAt(props.foot, t) : null;
  // the signal path: the gas car's `gasPath`, or the electric car's `drive` (No. 008), on the same machinery
  const evDrive = ev && props.drive ? props.drive : null;
  const gp = gas && props.gasPath ? props.gasPath : evDrive;
  const sigPath = gas || evDrive !== null;
  const pathRoutes = gas
    ? {pedal: GAS_ROUTES.pedal, motor: GAS_ROUTES.motor}
    : {pedal: EV_ROUTES.pedal, motor: EV_ROUTES.phase};
  const gpFor = gp?.drawFor ?? 1.0;
  const gpGlow = gp ? (gp.fadeAt == null ? 1 : 1 - ease(t, gp.fadeAt, gp.fadeAt + (gp.fadeFor ?? 0.7))) : 0;
  const leg1 = gp ? ease(t, gp.pedalAt, gp.pedalAt + gpFor) : 0;
  const leg2 = gp && gp.motorAt != null ? ease(t, gp.motorAt, gp.motorAt + gpFor) : 0;
  const passK = sigPath ? gateAt(props.gate, t) : 1;
  const cutK = sigPath ? Math.max(0, Math.min(1, keyedValue(props.cut, t, 0))) : 0;
  // the outgoing leg dims while the computer says no, and goes dark when the power is cut
  const leg2Glow = gpGlow * (1 - 0.6 * (1 - passK)) * (1 - cutK);
  const plate = gas
    ? props.throttle === undefined || props.throttle === 'auto'
      ? 0.0 + 0.9 * gasFootAt(props.foot, t - 0.15).accel * gateAt(props.gate, t - 0.05) * (1 - cutK)
      : Math.max(0, Math.min(1, keyedValue(props.throttle, t, 0)))
    : 0;
  const pulseList =
    gp && (gp.pulses ?? true) && gpGlow > 0.01
      ? gasPulses(props.foot, t, gp.pedalAt + gpFor, startFrame / fps, gas ? undefined : (k, x) => footAt(k, x).press)
      : [];
  const curves = useMemo(
    () =>
      Object.fromEntries(
        (Object.keys(GAS_ROUTES) as (keyof typeof GAS_ROUTES)[]).map((k) => [
          k,
          new THREE.CatmullRomCurve3(GAS_ROUTES[k].map((q) => new THREE.Vector3(...q))),
        ]),
      ) as Record<keyof typeof GAS_ROUTES, THREE.CatmullRomCurve3>,
    [],
  );
  const evCurves = useMemo(
    () => ({
      pedal: new THREE.CatmullRomCurve3(EV_ROUTES.pedal.map((q) => new THREE.Vector3(...q))),
      motor: new THREE.CatmullRomCurve3(EV_ROUTES.phase.map((q) => new THREE.Vector3(...q))),
    }),
    [],
  );
  const pathCurves = gas ? {pedal: curves.pedal, motor: curves.motor} : evCurves;
  // each pulse: where it is (leg 1, then leg 2 if the gate passed it on arrival, else dying at the computer)
  const pulseDots = pulseList.flatMap((t0) => {
    const age = t - t0;
    if (age < 0) return [];
    if (age < GAS_PULSE.leg) {
      const v = pathCurves.pedal.getPointAt(Math.min(0.999, age / GAS_PULSE.leg));
      return [{p: [v.x, v.y, v.z] as V3, k: 1}];
    }
    const arrive = t0 + GAS_PULSE.leg;
    const after = age - GAS_PULSE.leg;
    if (gateAt(props.gate, arrive) >= 0.5 && keyedValue(props.cut, arrive, 0) < 0.5) {
      if (after >= GAS_PULSE.leg) return [];
      const v = pathCurves.motor.getPointAt(Math.min(0.999, after / GAS_PULSE.leg));
      // it fades into the motor over the last fifth
      return [{p: [v.x, v.y, v.z] as V3, k: 1 - ease(after / GAS_PULSE.leg, 0.8, 1)}];
    }
    if (after >= GAS_PULSE.die) return [];
    // it dies at the computer: it swells a touch and fades
    const e = pathRoutes.pedal[pathRoutes.pedal.length - 1];
    return [{p: e, k: (1 - after / GAS_PULSE.die) * (1 + 0.4 * (after / GAS_PULSE.die))}];
  });
  const bl = gas && props.brakeLead ? props.brakeLead : null;
  const blK = bl ? ease(t, bl.at, bl.at + (bl.drawFor ?? 0.4)) : 0;
  const blGlow = bl ? (bl.fadeAt == null ? 1 : 1 - ease(t, bl.fadeAt, bl.fadeAt + 0.5)) : 0;
  const dip = gas ? Math.max(0, keyedValue(props.noseDip, t, 0)) : 0;
  const steerNow = gas ? keyedValue(props.steer, t, 0) : 0;
  const steerRatio = props.steerRatio ?? 5;
  const sbw = gas && props.steerByWire ? props.steerByWire : null;
  const sbwWireAt = sbw ? (sbw.wireAt ?? sbw.at + 1.0) : 0;
  const shaftK = sbw
    ? 1 - ease(t, sbw.at, sbw.at + 0.8) + (sbw.backAt == null ? 0 : ease(t, sbw.backAt, sbw.backAt + 0.8))
    : 1;
  const sbwK = sbw ? ease(t, sbwWireAt, sbwWireAt + 1.2) : 0;
  const sbwGlow = sbw ? (sbw.backAt == null ? 1 : 1 - ease(t, sbw.backAt, sbw.backAt + 0.6)) : 0;
  const steerDots = sbw
    ? (props.steerPulses ?? []).flatMap((p0) => {
        const age = t - p0;
        if (age < 0 || age > 0.5 || p0 < sbwWireAt + 1.2) return [];
        const v = curves.steer.getPointAt(Math.min(0.999, age / 0.5));
        return [{p: [v.x, v.y, v.z] as V3, k: 1 - ease(age / 0.5, 0.8, 1)}];
      })
    : [];
  // the hands turn with the wheel (about its axis through the hub, figure-local)
  const steerHands = (h: V3): V3 => {
    if (!gas || steerNow === 0) return h;
    const c = new THREE.Vector3(0, lay.steering[1] - lay.driver[1], lay.steering[0] - lay.driver[0]);
    const axis = new THREE.Vector3(0, Math.sin(-0.42), Math.cos(-0.42)).normalize();
    const v = new THREE.Vector3(...h).sub(c).applyAxisAngle(axis, steerNow).add(c);
    return [v.x, v.y, v.z];
  };

  const hands: [V3, V3] = gas ? [steerHands(hands0[0]), steerHands(hands0[1])] : hands0;
  // the spray: one emitter per tire (world), the water streaming back from the car's travel
  const spray: SprayEmitter[] = wet
    ? (Object.keys(WHEELS) as WheelId[]).map((id) => {
        const w = WHEELS[id];
        return {
          at: [dir * w.x, 0, w.near ? C.cutZ - 0.03 : w.z] as V3,
          back: [-dir, 0] as [number, number],
          out: [0, w.near ? 1 : -1] as [number, number],
          speed: vRoad,
          strength: () => ({mist: Math.max(0, Math.min(1, vRoad / 8)), spin: 0}),
        };
      })
    : [];

  const regenNodes: [V3, boolean][] = regen
    ? [
        [REGEN_A[0], regen.started],
        [REGEN_A[REGEN_A.length - 1], regen.a >= 0.999],
        [REGEN_B[REGEN_B.length - 1], regen.b >= 0.999],
        [REGEN_C[REGEN_C.length - 1], regen.c >= 0.999],
      ]
    : [];

  return (
    <AbsoluteFill>
      {/* close framings of the electric car shrink the AO radius with the camera (at 0.35 m it filled a 1 m frame) */}
      <SectionStage
        mood={mood}
        post={bay ? {focusY: 0.5, aoRadius: 0.35 * Math.max(0.06, Math.min(1, camD / 10))} : {focusY: 0.5}}
        ao
      >
        <SectionCamera
          from={from}
          to={to}
          pre={pre}
          durationInFrames={durationInFrames}
          drift={props.drift ?? 0.08}
          clockOffset={startFrame / fps}
          shake={shakeAmt}
          shakeSeed="car-slice-shake"
        />
        <SectionLights mood={mood} target={[0, 0.8, 0]} lamp={0} />
        <mesh position={[0, 8, -14]} material={mats.sky}>
          <planeGeometry args={[80, 50]} />
        </mesh>

        {hw ? (
          // the highway's ground block: asphalt on top, its front cut face down the groove row's centreline
          <>
            <mesh
              position={[0, -HWY.depth / 2, (HWY.front + HWY.back) / 2]}
              material={[mats.cut, mats.earth, mats.asphalt, mats.earth, mats.hidden, mats.earth]}
              receiveShadow
            >
              <boxGeometry args={[2 * HWY.x, HWY.depth, HWY.front - HWY.back]} />
            </mesh>
            <GrooveCut
              scroll={distance}
              amp={ampShow}
              x0={-HWY.x}
              x1={HWY.x}
              depth={HWY.depth}
              z={HWY.front}
              ink={inkK}
            />
            <CutOutline
              rects={[
                [
                  [HWY.x, -HWY.depth, HWY.back],
                  [HWY.x, 0, HWY.front],
                ],
              ]}
            />
          </>
        ) : city ? (
          // the city street (No. 006): lane, curb, sidewalk, storefronts, stop lines and corner signals
          <CarCityRoad
            mood={mood}
            scroll={-dir * distance}
            dir={dir}
            corners={corners}
            signs={signs}
            storefronts={props.storefronts ?? false}
            from={dir < 0 ? -(props.roadAhead ?? (ev ? 14 : 5)) : -5}
            to={dir < 0 ? 5 : (props.roadAhead ?? (ev ? 14 : 5))}
            inkScale={inkK}
          />
        ) : (
          <>
            {/* the ground block: the road on top, cut on the front and right faces */}
            <mesh
              position={[0, -ROAD.depth / 2, 0]}
              material={[mats.cut, mats.earth, mats.road, mats.earth, mats.cut, mats.earth]}
              receiveShadow
            >
              <boxGeometry args={[2 * ROAD.x, ROAD.depth, 2 * ROAD.z]} />
            </mesh>
            <CutOutline
              rects={[
                [
                  [-ROAD.x, -ROAD.depth, ROAD.z],
                  [ROAD.x, 0, ROAD.z],
                ],
                [
                  [ROAD.x, -ROAD.depth, -ROAD.z],
                  [ROAD.x, 0, ROAD.z],
                ],
              ]}
              edges={[
                [
                  [-ROAD.x, 0, ROAD.z],
                  [ROAD.x, 0, ROAD.z],
                ],
              ]}
            />
          </>
        )}
        {/* headlights on the road ahead (highway at Night; always mounted, 0 otherwise) */}
        {/* the wet road (No. 008): a fine spray off every tire, streaming back, clipped at the cut */}
        {spray.length ? (
          <TireSpray emitters={spray} t={t} seed="car-slice-spray" clipZ={C.cutZ} exposure={m.exposure} />
        ) : null}
        {headlamps.map((l, i) => (
          <React.Fragment key={i}>
            <primitive object={l} />
            <primitive object={l.target} />
          </React.Fragment>
        ))}

        {/* the car and its driver, in the car's own frame (mirrored in x when it faces left) */}
        <group scale={left ? [-1, 1, 1] : undefined}>
          <Dip on={gas} angle={-0.022 * dip} pivot={[C.axleX.rear, R, 0]}>
            <group position={[bodyJ[0], bodyY + bodyJ[1], bodyJ[2]]}>
              <RealCar
                steeringJitter={shakeAmt > 0 ? [sj('sx', 0.004), sj('sy', 0.005), sj('sz', 0.004)] : undefined}
                mood={mood}
                body={driver === 'mom' ? 'mom' : driver === 'friend' ? 'friend' : 'you'}
                warning={warn}
                tail={hw && night ? 1 : 0}
                speed={props.clusterSpeed ?? (gas ? 45 : 38)}
                tireLight={bay ? false : (props.tireLight ?? true)}
                {...(ev
                  ? {ev: true, driverSide: 'near' as const, brake: brakeK, inkScale: inkK, evCluster: {power}}
                  : {})}
                {...(ev && props.drive !== undefined ? {splitDash: true} : {})}
                {...(gas
                  ? {gas: true, driverSide: 'near' as const, brake: brakeK, inkScale: inkK, steer: steerNow}
                  : {})}
                mirrored={left ? true : undefined}
              />
            </group>
            <Figure
              who={driver}
              mood={mood}
              position={[lay.driver[0] + bodyJ[0], lay.driver[1] + bodyY + bodyJ[1], lay.driver[2] + bodyJ[2]]}
              rotationY={Math.PI / 2}
              gestures={gestures}
              phone={false}
              hands={hands}
              clockOffset={startFrame / fps}
              legs={legs}
              footScale={bay ? [1, EV_FOOT] : undefined}
              shoe={bay ? section.sneaker : undefined}
            />
            {gas ? (
              <>
                <EngineBay mood={mood} open={plate} inkScale={inkK} />
                <GasPedals mood={mood} accel={gasFoot ? gasFoot.accel : 0} brake={gasFoot ? gasFoot.brake : 0} />
                <Steering mood={mood} steer={steerNow} shaft={shaftK} rack={0.012 * steerNow} inkScale={inkK} />
                <GasLoom
                  mood={mood}
                  routes={sbw ? [GAS_ROUTES.pedal, GAS_ROUTES.motor, GAS_ROUTES.brake, GAS_ROUTES.steer] : undefined}
                />
                {(
                  [
                    [GAS_ROUTES.pedal, leg1, gpGlow, true],
                    [GAS_ROUTES.motor, leg2, leg2Glow, true],
                    [GAS_ROUTES.brake, blK, blGlow, false],
                    [GAS_ROUTES.steer, sbwK, sbwGlow, true],
                  ] as [V3[], number, number, boolean][]
                ).map(([leg, k, g, runner], i) =>
                  k > 0 && g > 0.01 ? (
                    <OrangePath
                      key={i}
                      legs={[leg]}
                      progress={k}
                      glow={g}
                      stain={false}
                      runner={runner}
                      radius={pathR}
                      coreColor={section.orange}
                      halo={{scale: 0.055 / 0.018, opacity: 0.25}}
                    />
                  ) : null,
                )}
                {/* node dots: the sensor and the computer (leg 1), the throttle's motor (leg 2), the brake switch, the steering's ends */}
                {(
                  [
                    [GAS_ROUTES.pedal[0], leg1 > 0, gpGlow],
                    [GAS_ROUTES.pedal[GAS_ROUTES.pedal.length - 1], leg1 >= 0.999, gpGlow],
                    [GAS_ROUTES.motor[GAS_ROUTES.motor.length - 1], leg2 >= 0.999, leg2Glow],
                    [GAS_ROUTES.brake[0], blK > 0, blGlow],
                    [GAS_ROUTES.steer[0], sbwK > 0, sbwGlow],
                    [GAS_ROUTES.steer[GAS_ROUTES.steer.length - 1], sbwK >= 0.999, sbwGlow],
                  ] as [V3, boolean, number][]
                ).map(([pt, on, g], i) =>
                  on && g > 0.01 ? (
                    <mesh key={i} position={pt} material={mats.node} userData={{glow: true}} scale={Math.max(0.35, g)}>
                      <sphereGeometry args={[0.03 * (pathR / VIB_R), 16, 12]} />
                    </mesh>
                  ) : null,
                )}
                {/* the pulses: an orange dot with a pale core, riding the wire */}
                {[...pulseDots.map((d) => ({...d, g: gpGlow})), ...steerDots.map((d) => ({...d, g: sbwGlow}))].map(
                  (d, i) =>
                    d.k * d.g > 0.01 ? (
                      <group key={i} position={d.p} scale={Math.max(0.001, Math.min(1.4, d.k)) * (pathR / VIB_R)}>
                        <mesh material={mats.pulseHalo} userData={{glow: true}}>
                          <sphereGeometry args={[0.085, 16, 12]} />
                        </mesh>
                        <mesh material={mats.pulseCore} userData={{glow: true}}>
                          <sphereGeometry args={[0.045, 16, 12]} />
                        </mesh>
                      </group>
                    ) : null,
                )}
              </>
            ) : null}
            {ev ? (
              <>
                <DriveUnit
                  mood={mood}
                  wheelSpin={gearSpin}
                  rotorSpin={rotorSpin}
                  rotorBlur={rotorBlur}
                  slots={slots}
                  inkScale={inkK}
                  board={props.drive !== undefined}
                />
                <BatteryPack mood={mood} fill={regen?.modules} glow={rg} inkScale={inkK} />
                <PedalBox mood={mood} accel={foot ? foot.press : 0} sensor={props.drive !== undefined} />
                {evDrive ? (
                  <>
                    {/* power to the motor (No. 008): pedal sensor → the inverter's board → the phase cables */}
                    {(
                      [
                        [EV_ROUTES.pedal, leg1, gpGlow],
                        [EV_ROUTES.phase, leg2, leg2Glow],
                      ] as [V3[], number, number][]
                    ).map(([leg, k, g], i) =>
                      k > 0 && g > 0.01 ? (
                        <OrangePath
                          key={i}
                          legs={[leg]}
                          progress={k}
                          glow={g}
                          stain={false}
                          runner={false}
                          radius={pathR}
                          coreColor={section.orange}
                          halo={{scale: 0.055 / 0.018, opacity: 0.25}}
                        />
                      ) : null,
                    )}
                    {(
                      [
                        [EV_ROUTES.pedal[0], leg1 > 0, gpGlow],
                        [EV_ROUTES.pedal[EV_ROUTES.pedal.length - 1], leg1 >= 0.999, gpGlow],
                      ] as [V3, boolean, number][]
                    ).map(([pt, on, g], i) =>
                      on && g > 0.01 ? (
                        <mesh
                          key={i}
                          position={pt}
                          material={mats.node}
                          userData={{glow: true}}
                          scale={Math.max(0.35, g)}
                        >
                          <sphereGeometry args={[0.03 * (pathR / VIB_R), 16, 12]} />
                        </mesh>
                      ) : null,
                    )}
                    {pulseDots.map((d, i) =>
                      d.k * gpGlow > 0.01 ? (
                        <group key={i} position={d.p} scale={Math.max(0.001, Math.min(1.4, d.k)) * (pathR / VIB_R)}>
                          <mesh material={mats.pulseHalo} userData={{glow: true}}>
                            <sphereGeometry args={[0.085, 16, 12]} />
                          </mesh>
                          <mesh material={mats.pulseCore} userData={{glow: true}}>
                            <sphereGeometry args={[0.045, 16, 12]} />
                          </mesh>
                        </group>
                      ) : null,
                    )}
                  </>
                ) : null}
                {regen && regen.started ? (
                  <>
                    {(
                      [
                        [REGEN_A, regen.a, true],
                        [REGEN_B, regen.b, false],
                        [REGEN_C, regen.c, false],
                      ] as [V3[], number, boolean][]
                    ).map(([leg, k, runner], i) =>
                      k > 0 ? (
                        <OrangePath
                          key={i}
                          legs={[leg]}
                          progress={k}
                          glow={rg}
                          stain={false}
                          runner={runner}
                          radius={pathR}
                          coreColor={section.orange}
                          halo={{scale: 0.055 / 0.018, opacity: 0.25}}
                          flow={regen.bright > 0.5 ? t * 0.6 : undefined}
                          dots={3}
                        />
                      ) : null,
                    )}
                    {regenNodes.map(([pt, on], i) =>
                      on && rg > 0.01 ? (
                        <mesh key={i} position={pt} material={mats.node} userData={{glow: true}} scale={rg}>
                          <sphereGeometry args={[0.03 * (pathR / VIB_R), 16, 12]} />
                        </mesh>
                      ) : null,
                    )}
                  </>
                ) : null}
                {sig && sigK > 0 && sigGlow > 0.01 ? (
                  <>
                    <OrangePath
                      legs={[SIGNAL_LEG]}
                      progress={sigK}
                      glow={sigGlow}
                      stain={false}
                      radius={pathR}
                      coreColor={section.orange}
                      halo={{scale: 0.055 / 0.018, opacity: 0.25}}
                    />
                    {sigK >= 0.999 ? (
                      <mesh
                        position={SIGNAL_LEG[SIGNAL_LEG.length - 1]}
                        material={mats.node}
                        userData={{glow: true}}
                        scale={sigGlow}
                      >
                        <sphereGeometry args={[0.03 * (pathR / VIB_R), 16, 12]} />
                      </mesh>
                    ) : null}
                  </>
                ) : null}
              </>
            ) : null}
          </Dip>
        </group>

        {(Object.keys(WHEELS) as WheelId[]).map((id) => {
          const w = WHEELS[id];
          const spin = wheelRevs(props, id, t) * Math.PI * 2;
          // the turn while the shutter is open (half a frame): the wheel's motion blur
          const blur = (wheelRevs(props, id, t + 0.25 / fps) - wheelRevs(props, id, t - 0.25 / fps)) * Math.PI * 2;
          const cutNear = w.near && !props.wheelsWhole && (sensors || hw || bay);
          // facing left the wheels sit mirrored and turn the other way
          const turn = w.near ? -dir : dir;
          // the gas car's front wheels steer (🎭 `steerRatio`)
          const steerYaw = gas && w.x > 0 ? (dir * steerNow) / steerRatio : 0;
          return (
            <RealWheel
              key={id}
              mood={mood}
              position={[dir * w.x, R - (w.near ? dropOf(id) : 0), w.z]}
              yaw={(w.near ? -Math.PI / 2 : Math.PI / 2) + steerYaw}
              radius={R}
              cut={cutNear ? 'mid' : 'none'}
              spin={turn * spin}
              motionBlur={turn * blur}
              brake={
                ev && id === 'FR'
                  ? {
                      wedge: wedgeNow,
                      rust,
                      padThickness: props.padThickness,
                    }
                  : undefined
              }
              pressure={lowWheel === id ? 1 - 0.25 * lowK : 1}
              low={!w.near}
              axle
              tick={!sensors && speedRings && w.near}
              toneRing={!sensors && speedRings && w.near}
              sensor={sensors ? <TireSensor dot={1} /> : null}
              sensorScale={1.7}
              inkScale={w.near ? Math.round(inkK * 20) / 20 : 1}
            />
          );
        })}

        {hw && !lane
          ? contact.map((c) => (
              <group key={c.id}>
                {/* the trapped air under the tread in the dip (orange once `airAt` is reached) */}
                <CurveStrip
                  xs={c.xs}
                  top={c.pocketTop}
                  bottom={c.floor}
                  z={HWY.front + 0.004}
                  material={mats.air}
                  visible={airK > 0.01}
                  glow
                  renderOrder={4}
                />
                {/* the tread squeezed into the dip: the tire's cut grows into it, inked */}
                <CurveStrip
                  xs={c.xs}
                  top={c.yt}
                  bottom={c.tread}
                  z={HWY.front + 0.002}
                  material={mats.rubberCut}
                  visible={squeezeK > 0.01}
                />
                <CurveStrip
                  xs={c.xs}
                  top={c.tread.map((y, i) => (c.bulging[i] ? y + INK * 0.5 * inkK : y))}
                  bottom={c.tread.map((y, i) => (c.bulging[i] ? y - INK * 0.5 * inkK : y))}
                  z={HWY.front + 0.003}
                  material={mats.ink}
                  visible={squeezeK > 0.01}
                />
                {/* an impact flash at the contact patch on each drop (slow enough to count) */}
                {impactsAt !== null && bandAmt < 0.6
                  ? c.ages.map((age, j) =>
                      t - age >= impactsAt && onAt(t - age) ? (
                        <group key={j} position={[c.xw, 0.004, HWY.front + 0.02]} scale={ringK}>
                          <RadioPulse position={[0, 0, 0]} age={age} reach={0.09} weight={0.6} arc={Math.PI} />
                        </group>
                      ) : null,
                    )
                  : null}
                {/* the air puffs out at the dip's edges (it travels back with the road) */}
                {airK > 0.01 && bandAmt < 0.6
                  ? c.ages.slice(0, 1).map((age, j) =>
                      t - age >= (props.airAt ?? 0) && onAt(t - age)
                        ? [-1, 1].map((e) => (
                            <group
                              key={`${j}${e}`}
                              position={[c.xw - vRoad * age + e * (GROOVE.length / 2), 0.002, HWY.front + 0.02]}
                              scale={ringK}
                            >
                              <RadioPulse position={[0, 0, 0]} age={age} reach={0.045} weight={0.4} arc={Math.PI} />
                            </group>
                          ))
                        : null,
                    )
                  : null}
                {/* at real speed: one continuous band behind the tire (≈ 19 px tall at any framing) */}
                <mesh
                  position={[c.xw - 0.35, 0.1 * bandH, HWY.front + 0.005]}
                  scale={[1, bandH, 1]}
                  material={mats.band[c.id === 'FR' ? 0 : 1]}
                  visible={bandAmt > 0.003}
                  userData={{glow: true}}
                  renderOrder={5}
                >
                  <planeGeometry args={[0.85, 1]} />
                </mesh>
              </group>
            ))
          : null}
        {hw && !lane ? (
          <mesh
            position={[0, 0, HWY.front + 0.006]}
            scale={[2 * HWY.x, refH, 1]}
            material={mats.refLine}
            renderOrder={6}
          >
            <planeGeometry args={[1, 1]} />
          </mesh>
        ) : null}
        {vib ? (
          <>
            <OrangePath
              legs={[VIB_MAIN]}
              progress={vibMain}
              glow={vibGlow}
              stain={false}
              radius={VIB_R}
              coreColor={section.orange}
              halo={{scale: 0.055 / 0.018, opacity: 0.25}}
            />
            <OrangePath
              legs={[VIB_SEAT]}
              progress={vibBranch}
              glow={vibGlow}
              stain={false}
              runner={false}
              radius={VIB_R}
              coreColor={section.orange}
              halo={{scale: 0.055 / 0.018, opacity: 0.25}}
            />
            {/* node dots: the hub, the steering wheel, the seat (they stay lit: the trace) */}
            {(
              [
                [VIB_MAIN[1], vibMain > 0.12],
                [VIB_MAIN[VIB_MAIN.length - 1], vibMain >= 0.999],
                [VIB_SEAT[VIB_SEAT.length - 1], vibBranch >= 0.999],
              ] as [V3, boolean][]
            ).map(([p, on], i) =>
              on ? (
                <mesh key={i} position={p} material={mats.node} userData={{glow: true}}>
                  <sphereGeometry args={[0.035, 16, 12]} />
                </mesh>
              ) : null,
            )}
          </>
        ) : null}

        {/* the receiver's node dot: lit once a pulse has arrived, and it stays (trace) */}
        {sensors ? (
          <mesh
            position={[C.receiver[0], C.receiver[1] + 0.035, C.receiver[2]]}
            material={arrived ? mats.node : mats.nodeOff}
            userData={{glow: arrived}}
          >
            <sphereGeometry args={[0.025, 16, 12]} />
          </mesh>
        ) : null}
        {live.map((p, i) => {
          const fromPt = sensorNode(props, p.wheel, p.at);
          const legs = routeFor(p.wheel, fromPt);
          return (
            <group key={i}>
              {p.live ? (
                <OrangePath
                  legs={legs}
                  progress={p.progress}
                  glow={p.glow}
                  stain={false}
                  runner={false}
                  radius={0.018}
                  coreColor={section.orange}
                  halo={{scale: 0.055 / 0.018, opacity: 0.25}}
                />
              ) : null}
              <RadioPulse position={fromPt} age={p.age} reach={0.45} />
              {ids && p.live ? (
                <IdTag
                  text={idLabels[p.wheel]}
                  mood={mood}
                  position={(() => {
                    const h = head(legs, p.progress);
                    return [h[0], h[1] + 0.16, h[2]] as V3;
                  })()}
                  opacity={p.glow}
                />
              ) : null}
            </group>
          );
        })}
        {wire && t >= wire.at ? (
          <WireWind
            from={[C.receiver[0] + 0.12, C.receiver[1] + 0.1, C.cutZ + 0.18]}
            hub={[C.axleX.front, R, C.track - 0.05]}
            axis={[0, 0, 1]}
            coil={0.045}
            width={0.08}
            turns={Math.min(5, (t - wire.at) * 2.5)}
            taut={ease(t - wire.at, 0, 1.8) * (1 - ease(t - wire.at, 2.0, 2.6))}
            opacity={
              ease(t, wire.at, wire.at + 0.3) *
              (1 - ease(t, (wire.until ?? wire.at + 2.8) - 0.6, wire.until ?? wire.at + 2.8))
            }
            radius={0.012}
          />
        ) : null}
      </SectionStage>
    </AbsoluteFill>
  );
};
