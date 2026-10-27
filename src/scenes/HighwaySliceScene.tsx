import React, {useMemo} from 'react';
import {AbsoluteFill, random, useCurrentFrame, useVideoConfig} from 'remotion';
import * as THREE from 'three';
import {CAR, HIGHWAY, MOODS, type Mood} from '../theme';
import {raw} from '../three/plaster';
import {CAR_LAYOUT} from '../three/real/RealCar';
import {carToWorld, DrivingCar} from '../three/real/DrivingCar';
import type {ShellProfile} from '../three/real/CarShell';
import type {RoadSignFont, RoadSignKind} from '../three/real/RoadSigns';
import {signBottom, signSize} from '../three/real/RoadSigns';
import {GlowNode, GlowPolyline, NODE_SCALE, pointAlong} from '../three/section/GlowLines';
import {blendMood, mixHex} from '../three/section/moods';
import {bandMaterial} from '../three/section/GrooveCut';
import {RadioPulse} from '../three/TirePieces';
import {groundAt, HIGHWAY_LAYOUT, HighwaySlice, SIGN_SPOTS} from '../three/section/HighwaySlice';
import {bendPoint, type RoadBend} from '../three/section/roadBend';
import {TireSpray, type SprayEmitter} from '../three/real/TireSpray';
import {
  projectToFrame,
  SECTION_ANGLE,
  sectionCameraAt,
  SectionCamera,
  type Framing,
} from '../three/section/SectionCamera';
import {SectionLights, SectionStage} from '../three/section/SectionStage';
import {hazardLevel} from '../three/real/hazard';
import {capSpeed, cappedTravel, wheelMode, wheelSmear, type WheelMode} from '../three/real/wheelMotion';
import {PATROL_HALF, patrolAt, PatrolTruck, type PatrolDrive} from '../three/real/PatrolTruck';
import {TIME_PASSES} from './SectionRoomScene';
import {skyTexture} from '../three/section/textures';
import {
  ease,
  framingAtKeys,
  integrateSpeed,
  keyed,
  speedAt,
  type CameraKey,
  type SpeedKey,
} from './keyframes';

type V3 = [number, number, number];
const H = HIGHWAY_LAYOUT;
const C = CAR_LAYOUT;
const G = H.groove;

/** The car's tire: its outer sidewall sits this far outboard of the wheel centre (RealWheel at radius 0.36). */
const TIRE_OUT = 0.125;
/** Tread width in contact with the road. */
const TREAD = 0.2;
/** Car-local x of the rear bumper (RealCar faces +x). */
const REAR = -2.4;

export type HighwayFraming =
  | 'tire'
  | 'groove'
  | 'shoulder'
  | 'mw'
  | 'edge'
  | 'signs'
  | 'wide'
  | 'curve'
  | 'exit'
  | 'line'
  | 'stop'
  | 'marker'
  | 'help';

/**
 * Framings at the fixed angle (metres). C: 'tire' (frame 0: YOU's right-rear tire just inside the white
 * line, the cut face with the paint layer and the cut groove in front of it), 'groove' (the groove cut on
 * the face, the next ones behind). M: 'shoulder' (the shoulder band from the white line to the gravel,
 * the speed limit sign's post). MW: 'mw' (YOU's car and the right carriageway, the 65 sign; 'edge' is the
 * same framing, the A/V script's name), 'signs' (MILE 112 and the guide sign up the verge, close enough to read). W: 'wide' (the cut-open interstate from the median to the ditch, the signs
 * receding up the right verge to the guide sign; at this size the signs read as shapes, the 65 as a number).
 * MW 'curve' (with `curve`: YOU's car ≈ 200 px wide in the subject band, at `car.rear` ≈ 6, the bend in the upper half).
 *
 * No. 009 (mile markers; set on test stills, see `HIGHWAY_STOP` for where B's car stops):
 *  - MW 'exit': frame 0 (`HIGHWAY_EXIT`): YOU's car left, the marker below it, the exit sign upper right,
 *    all in the subject band (marker digits ≈ 28 px, "EXIT nn" ≈ 40 px, the car ≈ 400 px wide).
 *  - W 'line': the cut face along the bottom left (the state line, the zero node), the road running up to
 *    the right; only ≈ 40 m of road fits across the frame, so a static row of 4 needs `spacing` ≈ 10.
 *  - M 'stop': YOU's car stopped on the shoulder (`HIGHWAY_STOP`), the marker by its front right, the
 *    cut plane below the frame edge.
 *  - C 'marker': the marker by the stopped car's front corner, filling the subject band.
 *  - MW 'help': the stopped car, its marker and ≈ 3 ruler ticks; the plane still below the frame edge.
 */
export const HIGHWAY_FRAMINGS: Record<HighwayFraming, Framing> = {
  tire: {look: [0.1, 0.35, -1.0], distance: 8.5},
  groove: {look: [0.48, -0.03, -0.14], distance: 2.3},
  shoulder: {look: [1.55, -0.6, -1.8], distance: 23},
  mw: {look: [0.6, -0.1, -5.3], distance: 55},
  edge: {look: [0.6, -0.1, -5.3], distance: 55},
  signs: {look: [6.93, 1.05, -30.0], distance: 35},
  wide: {look: [-4.44, 7.0, -19.3], distance: 138},
  curve: {look: [-5.0, -4.2, -21], distance: 64},
  exit: {look: [3.8, 0.2, -18], distance: 37},
  line: {look: [-3.5, 1.5, -22], distance: 95},
  stop: {look: [1.5, -0.5, -29], distance: 29},
  marker: {look: [3.75, 1.75, -31.6], distance: 10},
  help: {look: [0.7, -2.3, -27], distance: 51},
};

/**
 * The layout the 'exit' framing is set for (No. 009 frame 0): YOU's car `rear` 20 (just past the marker),
 * the marker at z −12 (`markers.z`), its exit sign `exitGap` 8 m beyond at `exitX` 5.6. At the fixed 28°
 * angle the road runs to the upper right, so the car, the marker and the exit sign only share a readable
 * frame when the car is level with or past the marker and the exit sign is close behind it.
 */
export const HIGHWAY_EXIT = {rear: 20, markerZ: -12, exitGap: 8, exitX: 5.6};

/**
 * Where B's car stops for the 'stop' / 'marker' / 'help' framings (No. 009): `car.rear` and the right
 * tires' `lateral` (on the shoulder), and the marker beside its front right corner (`markers.x`, its z).
 */
export const HIGHWAY_STOP = {rear: 26, lateral: 2.55, markerX: 3.95, markerZ: -31.6};

/** A keyed value (eased cubic between keys) or a constant. */
export type Keyed = number | {at: number; value: number}[];

export type HighwayCar = {
  /**
   * Where the right tires' outer sidewalls are across the road, metres from the white line's inner
   * edge (+ toward the shoulder), a constant or keys (eased). −0.1: just inside the line (frame 0);
   * 0.55: both right tires on the groove row (the row is 0.30 → 0.69); −0.9: the middle of the lane.
   * Default −0.1.
   */
  lateral?: Keyed;
  /** How far the rear bumper is behind the section plane (m, default 0.5). The car is never cut. */
  rear?: number;
  /** Speed keys in m/s (default 26.8 ≈ 60 mph), eased over 0.8 s: the road streams toward the camera. */
  speed?: SpeedKey[];
  /** Tail lamps lit: a boolean, or keys 0 → 1 (default: on at Night, off in Day; they fade with `moodFrom`). */
  tail?: boolean | Keyed;
  /** Headlights on, white cones on the road ahead: a boolean, or keys 0 → 1 (default: on at Night, off in Day; they fade with `moodFrom`). */
  headlights?: boolean | Keyed;
  /** No. 009: the brake lamps, keys or a constant 0 → 1 (flat red `brakeLit`, never bloomed). Default 0. */
  brake?: Keyed;
  /**
   * No. 009: the hazards, from `at` (scene s, default 0): the rear lamps blink flat red at brake brightness
   * and the front corner lamps `warning` yellow, on the **video** clock (`three/real/hazard.ts`
   * `hazardLevel`, `HAZARD_HZ` 1.4, shared with car-slice), so the phase carries across cuts and slides.
   * Default none.
   */
  hazard?: {at?: number} | null;
  /** YOU at the wheel (default true; seen only dimly through the rear window). */
  driver?: boolean;
  /** Body colour (default 'you'). */
  body?: 'you' | 'mom' | 'extra';
  /** Paint override, a theme token (default none: `body`'s colour, the same `CAR.*.bodies` token car-slice uses). */
  paint?: string;
  /**
   * The body's shape (`DrivingCar` `shape`): 'crossover' (default, No. 005–008), 'hatch' (No. 009: the car-slice
   * car's own silhouette, a raked hatch, so YOU's car keeps its shape across a slide to or from car-slice),
   * 'sedan' or 'coupe'.
   */
  shape?: ShellProfile;
  /**
   * The shutter for this car's wheels only (fraction of a frame, default 0.02 ≈ 1/1500 s): fast, so the
   * focus tire's tread and spokes read instead of smearing into a grey ring (at the scene's 0.5 a
   * 60 mph wheel turns ≈ 70° while the shutter is open). The road keeps the scene's `shutter`.
   */
  tireShutter?: number;
  /**
   * The car's angle off its direction of travel, degrees, a constant or keys (eased): + turns the nose
   * left and swings the rear out to the right (a skid in a left-hand bend), about the front axle, so the
   * rear is what steps out. Default 0.
   */
  yaw?: Keyed;
  /**
   * Wheelspin, 0 → 1, a constant or keys (eased): the driven wheels turn faster than the road (up to
   * 2.6× at 1) and, on a wet road, throw a dense rooster tail of spray. Key it back to 0 for stability
   * control cutting the power: the spray thins out over half a second. Default 0.
   */
  spin?: Keyed;
  /** Which axle is driven (spins and throws the heavy spray): default 'front' (a transverse-engine car). */
  drive?: 'front' | 'rear';
};

/** Another car ahead, driving away (whole, never cut: hidden once any of it would reach the plane). */
export type HighwayTraffic = {
  lane: 'left' | 'right';
  /** Its rear bumper's distance behind the plane at the scene's start (m). */
  ahead: number;
  /** Its speed (m/s, default 28): faster than YOU's car pulls away, slower comes back. */
  speed?: number;
  body?: 'you' | 'mom' | 'extra';
};

export type HighwaySign = {
  kind: RoadSignKind;
  /** The legend ('speed': [SPEED, LIMIT, nn]; 'mile': [digits]; 'guide': [line 1, line 2]; 'exit': [nn, legend line(s)]). */
  text: string[];
  /** Its centre line across (x) and its place along the road (z < 0); defaults per kind (`SIGN_SPOTS`). */
  x?: number;
  z?: number;
};


/** One end of a ruler line or pulse: a marker's number, 'plane' (the cut face), 'far' (into the haze) or 'car' (abreast YOU's car's front). */
export type RulerEnd = number | 'plane' | 'far' | 'car';

/**
 * A point an orange link runs through: 'marker:N' (marker N's foot), 'post:N' (its post, halfway up),
 * 'sign:N' (its panel's middle), 'exit:N' (exit N's near post foot), 'plaque:N' (its EXIT plaque), 'tick:N'
 * (where marker N's tick meets the ruler), 'zero' (the ruler's zero on the cut face), 'car' (YOU's roof),
 * 'window' (YOU's head through the glass), 'up' (60 m straight up from the previous point: out of frame),
 * or a world point.
 */
export type RulerPoint = string | [number, number, number];

/**
 * No. 009: the mile markers, a row of real D10-3 signs (`RoadSign` 'mile', sized by digit count) on the
 * right verge, optionally paired with exit signs. Numbers: `numbers` (near → far), else `countKeys`, else
 * `from` + `step`. Markers enter far up the verge and are dropped before they reach the plane (no cut sign).
 */
export type HighwayMarkers = {
  /**
   * 'road' (default): fixed to the road, streaming toward the camera as YOU's car drives (with its
   * `speed` keys; fast-forward = a high speed and a jumping count). 'fixed': standing still while the
   * road scrolls, as the default signs do (a static row: frame 0, the state line, the stopped car).
   */
  move?: 'road' | 'fixed';
  /** Metres between markers (default 40; a real mile is 1,609 m: compressed, 🎭). */
  spacing?: number;
  /** The numbers, near → far (one marker each). */
  numbers?: number[];
  /**
   * The count over time: the marker passing YOU's car's front at t reads round(value) (strictly rising:
   * each marker at least one more than the last), so a Counter keyed the same agrees. `count` markers.
   */
  countKeys?: {at: number; value: number}[];
  /** A regular row: the first number (default 1), the step (default 1), how many (default 8; also `countKeys`'). */
  from?: number;
  step?: number;
  count?: number;
  /**
   * Placement: marker `ref` (a number in the row; default the first, and always the first with
   * `countKeys`) stands at z = `z` (default −28) at `zAt` scene seconds (default 0).
   */
  ref?: number;
  z?: number;
  zAt?: number;
  /** Across: the post's centre line (default 4.7, behind the guardrail; ≈ 3.95 without one). */
  x?: number;
  /** Exit signs: for each number listed, an 'exit' sign `exitGap` m (default 8) past that marker, at `exitX` (default 5.6). */
  exits?: number[];
  exitGap?: number;
  exitX?: number;
  /** The exit signs' legend, one or two lines (default ['Town Center']: generic, no real place, no shield). */
  exitLegend?: string[];
};

/** One ruler line (the mile count): from one end to the other along the shoulder's outer edge. */
export type RulerLine = {
  from: RulerEnd;
  to: RulerEnd;
  /** How much is drawn, from `from` toward `to`, 0 → 1 (keys or constant, default 1). */
  draw?: Keyed;
  /** At a 'plane' end, carry on down the cut face to the slice's bottom (the way back to zero, out of frame). Default false. */
  down?: boolean;
  /** Brighter and thicker, 0 → 1 (the stretch still to go). Default 0. */
  bright?: Keyed;
  /** Strength 0 → 1 (fade it out). Default 1. */
  glow?: Keyed;
};

/**
 * No. 009: the orange mile ruler (the hidden system: the count), on the ground along the right
 * shoulder's outer edge, moving with the markers, with a tick from it to each marker's foot.
 */
export type HighwayRuler = {
  /** Across (default 3.3: on the gravel just past the shoulder's edge; 4.1, just outside the posts, with a guardrail). */
  x?: number;
  lines?: RulerLine[];
  /** The count's zero: a node on the cut face where the ruler meets it, 0 → 1. Default 0 (anchor 'rulerZero'). */
  zero?: Keyed;
  /** Which ticks light: 'drawn' (default: where a line has reached), 'car' (also each marker YOU's car has passed), 'all', 'none'. */
  ticks?: 'drawn' | 'car' | 'all' | 'none';
  /** A marker's own mark: its tick ('tick', with the foot's node) or a node on its post ('node'), with glow keys and swell pulses (scene s). */
  marks?: {n: number; kind?: 'tick' | 'node'; glow: Keyed; pulse?: number[]}[];
  /** A bright dot running along the ruler from `from` to `to` (from `at`, over `dur` s, default 1.2), flashing where it stops. */
  pulses?: {from: RulerEnd; to: RulerEnd; at: number; dur?: number}[];
  /** Links drawn through named points (`RulerPoint`), each with a node, drawn by `draw` (default 1), faded by `glow` (default 1). */
  links?: {points: RulerPoint[]; draw?: Keyed; glow?: Keyed}[];
};

export type HighwaySliceSceneProps = {
  durationInFrames: number;
  /** Day (default) or Night. */
  mood?: Mood;
  /** Framing preset (default 'tire'). */
  framing?: HighwayFraming;
  /** A custom move instead of a preset. */
  camera?: {from: Framing; to?: Framing};
  /** Camera keyframes (`log: true` for a steady dolly over a big range); override `camera` and `push`. */
  cameraKeys?: CameraKey[];
  /** Push, units/s (default 0). */
  push?: number;
  /** Idle sideways drift, ± units (default 0.08; 0 on the loop's first and last scenes). */
  drift?: number;
  /** YOU's car (default: one, as frame 0), or null for none. */
  car?: HighwayCar | null;
  /**
   * The shutter (fraction of a frame, default 0.5): the road's paint and grooves smear over the distance
   * the road moves while it is open. At road speed the grooves blur into a dark ribbon; 0 keeps them
   * sharp (they then crawl, like spokes on film). Slow the car (`car.speed`) to show single grooves.
   */
  shutter?: number;
  /** Other cars ahead, driving away (default: one in the left lane at 40 m, one in the right lane at 95 m). */
  traffic?: HighwayTraffic[];
  /**
   * The grooves' orange wash (the system): 'auto' (default: lit under YOU's right tires while they are
   * on the row, from the plane to just past the front tire), or a constant / keys 0 → 1 over the same span.
   */
  grooveLit?: 'auto' | Keyed;
  /**
   * The signs on the right verge, facing the camera (default: SPEED LIMIT 65 near the plane, MILE 112,
   * NEXT EXIT / 2 MILES far up the road). No shield, no route number, no rumble-strip sign. [] for none.
   */
  signs?: HighwaySign[];
  /** The W-beam guardrail (default true). */
  guardrail?: boolean;
  /**
   * After the rain (No. 008): wet asphalt, darker, with puddles and the sky's soft sheen, damp verges,
   * and fine spray off YOU's tires while it moves (`spray`). Day or Night; no falling rain. Default false.
   */
  wet?: boolean;
  /** The fine spray off YOU's rolling tires on a wet road, × (default 1; 0 for none). Wheelspin's spray comes on top. */
  spray?: number;
  /**
   * The road bends in depth: `true` for the default (straight for 30 m from the plane, then a left-hand
   * bend of 170 m radius), or `{start, radius, side}`. YOU's car, traffic, signs and the guardrail
   * follow it; the paint, grooves and scroll stay in road space. Default false (straight, No. 005).
   */
  curve?: boolean | Partial<RoadBend>;
  /**
   * Impact flashes (the system): from `at` (s), an orange ring at each right tire's contact patch while
   * its tread is on the row, `rate` a second (default 6: slowed so the eye can count; the real rate is
   * ≈ 88), the rear and front tires out of step. `blur` (constant or keys, 0 → 1) fades the rings into
   * one continuous orange band under each right tire (the real thing: too fast to count). Default none.
   */
  impacts?: {at?: number; rate?: number; blur?: Keyed} | null;
  /**
   * "Feel it": a fast seeded tremble (0 → 1, constant or keys) of the camera and YOU's car body, only
   * while its right tires are on the grooves. Default 0 (off).
   */
  shake?: Keyed;
  /**
   * Short hard kicks on the shake (≈ 3×, gone in 0.35 s): scene seconds, or 'auto' (each time the right
   * tires reach the row). Default none.
   */
  shakeKick?: number[] | 'auto';
  /**
   * Line 7's drawing (🎭): five grey ink tire tracks on the road, each drawing from its `at` (s) over
   * `draw` s (default 1.4), drifting right across the right lane toward the shoulder, one after the
   * other up the road; where one crosses the groove row it flashes orange. Track `back` (index, default
   * 4, the fifth; null for none) bends back into the lane at the row; the others run on to x = `end`
   * (default 3.4, just short of the guardrail). Default none.
   */
  tracks?: {
    at: number[];
    draw?: number;
    back?: number | null;
    end?: number;
    /** The first track's start up the road (z, default −4), the step to the next (m, default 8), each one's length (m, default 22). */
    start?: number;
    spacing?: number;
    length?: number;
  } | null;
  /**
   * No. 009: the service-patrol truck (`three/real/PatrolTruck`, warning-yellow light bar) driving up the
   * shoulder and stopping behind YOU's car: `PatrolDrive` keys (`enterAt`, `stopAt`, `distance`, `brakeAt`),
   * `x` (default YOU's car's line), `stopZ` (default YOU's tail + `gap` (default 3 m) + half the truck),
   * `flashing` (light bar 0 → 1, default 1). Its lamps follow the mood. Hidden until wholly behind the plane.
   */
  helper?: (Partial<PatrolDrive> & {gap?: number; flashing?: number}) | null;
  /**
   * No. 009 (§ 2 Night floor): a narrow cool spot on YOU's car (the mood's `figureLight`, from above the camera
   * side), × this (0 → ≈ 2). For a dark stretch at Night with nothing lit but the headlights. Default 0 (off).
   */
  carLight?: number;
  /**
   * How the cars' wheels turn (`three/real/wheelMotion.ts`): 'forward' (default: always reads as rolling forward:
   * the right direction, the visual turn capped at 26° a frame above ≈ 4.9 m/s, the spokes smeared at speed) or
   * 'legacy' (posted videos only: No. 005–008 as rendered; the wheels turn the wrong way for a car driving away,
   * hidden at cruise by aliasing). Wheelspin (`car.spin`) keeps the real rate.
   */
  wheels?: WheelMode;
  /** No. 009: the mile markers (and their exit signs), on top of `signs`. Default none. */
  markers?: HighwayMarkers | null;
  /** No. 009: the orange mile ruler, its ticks, zero, pulses and links. Default none. */
  ruler?: HighwayRuler | null;
  /** The sign legends' face: 'inter' (default, No. 005–008) or 'overpass' (the highway face, No. 009 on). */
  signFont?: RoadSignFont;
  /**
   * The time-passes beat (§ 4, No. 009): the scene opens in `moodFrom` and blends to `mood` (sky, palette,
   * lights; headlights, tail lamps and the signs' night glow fade with it) over 1.5 s from `moodAt` s
   * (default 0.3), rendered once. Once per video.
   */
  moodFrom?: Mood;
  moodAt?: number;
  location?: string;
  transition?: 'auto' | 'continue' | 'glide' | 'cut' | 'dissolve' | 'slide' | 'follow';
  follow?: {direction?: 'down' | 'up' | 'left' | 'right'; at?: number};
  glide?: number;
  /** Set by Explainer. */
  startFrame?: number;
  cameraFrom?: Framing;
  cameraGlide?: number;
};

export const DEFAULT_SIGNS: HighwaySign[] = [
  {kind: 'speed', text: ['SPEED', 'LIMIT', '65']},
  {kind: 'mile', text: ['112']},
  {kind: 'guide', text: ['NEXT EXIT', '2 MILES']},
];
const DEFAULT_TRAFFIC: HighwayTraffic[] = [
  {lane: 'left', ahead: 40, speed: 28.5},
  {lane: 'right', ahead: 95, speed: 27.5},
];
const DEFAULT_SPEED: SpeedKey[] = [{at: 0, speed: 26.8}];

const valueAt = (k: Keyed | undefined, t: number, dflt: number) =>
  k === undefined ? dflt : typeof k === 'number' ? k : keyed(k, t, dflt);

const DEFAULT_BEND: RoadBend = {start: 30, radius: 170, side: 'left'};
/** The scene's road bend, or null for a straight road. */
export const highwayBend = (p: Partial<HighwaySliceSceneProps>): RoadBend | null =>
  !p.curve ? null : p.curve === true ? DEFAULT_BEND : {...DEFAULT_BEND, ...p.curve};

/** How much faster than the road the driven tread turns at full wheelspin (× road speed, on top of it). */
const SPIN_GAIN = 1.6;
/** ∫ speed · SPIN_GAIN · spin dt from 0 to t: the driven wheels' extra tread (fixed step, deterministic). */
const spinTravel = (car: HighwayCar, t: number) => {
  if (car.spin === undefined) return 0;
  const speed = car.speed ?? DEFAULT_SPEED;
  const STEP = 1 / 120;
  let a = 0;
  for (let x = 0; x < t; x += STEP) {
    const m = x + Math.min(STEP, t - x) / 2;
    a += speedAt(speed, m, 0.8) * SPIN_GAIN * Math.max(0, valueAt(car.spin, m, 0)) * Math.min(STEP, t - x);
  }
  return a;
};

const highwayCameraMove = (
  p: Partial<HighwaySliceSceneProps>,
  durationInFrames: number,
  fps: number,
  frame?: number,
) => {
  const base = p.camera?.from ?? HIGHWAY_FRAMINGS[p.framing ?? 'tire'] ?? HIGHWAY_FRAMINGS.tire;
  if (p.cameraKeys && p.cameraKeys.length) {
    const f = framingAtKeys(
      p.cameraKeys,
      p.camera?.from ?? p.cameraFrom ?? base,
      frame === undefined ? Infinity : frame / fps,
    );
    return {from: f, to: f, pre: undefined};
  }
  const pre =
    p.cameraGlide && p.cameraFrom
      ? {from: p.cameraFrom, hold: 0, move: Math.max(1, Math.round(p.cameraGlide * fps)), ease: 'cubic' as const}
      : undefined;
  const secs = Math.max(0, durationInFrames - (pre ? pre.move : 0)) / fps;
  if (p.camera) return {from: p.camera.from, to: p.camera.to ?? p.camera.from, pre};
  const c = pre ? undefined : p.cameraFrom;
  const same = c && c.look.every((v, i) => Math.abs(v - base.look[i]) < 1e-6);
  const from = c && same ? c : base;
  return {from, to: {look: from.look, distance: from.distance - (p.push ?? 0) * secs}, pre};
};

export const highwayCameraStart = (p: Partial<HighwaySliceSceneProps>, d: number, fps: number): Framing =>
  highwayCameraMove({...p, cameraFrom: undefined, cameraGlide: undefined}, d, fps, 0).from;
export const highwayCameraEnd = (p: Partial<HighwaySliceSceneProps>, d: number, fps: number): Framing =>
  highwayCameraMove(p, d, fps).to;

/** The camera state at a frame (for anchors on H). */
export const highwayCameraAt = (
  p: Partial<HighwaySliceSceneProps>,
  o: {frame: number; fps: number; durationInFrames: number},
) => {
  const {from, to, pre} = highwayCameraMove(p, o.durationInFrames, o.fps, o.frame);
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

/**
 * YOU's car at t: in the world, its origin x, z and heading `yaw` (rad about y, `carToWorld`'s), with the
 * bend and the skid; in road space, `roadX`, `roadZ`; `heading`, the road's direction there (no skid);
 * the road travelled, its speed.
 */
export const highwayCarAt = (car: HighwayCar, t: number, bend: RoadBend | null = null) => {
  const speed = car.speed ?? DEFAULT_SPEED;
  const lateral = valueAt(car.lateral, t, -0.1);
  const dt = 1 / 60;
  const vLat = (valueAt(car.lateral, t + dt, -0.1) - valueAt(car.lateral, t - dt, -0.1)) / (2 * dt);
  const v = speedAt(speed, t, 0.8);
  const x = lateral - C.track - TIRE_OUT;
  const z = -(car.rear ?? 0.5) + REAR;
  // heading off straight ahead (−z) toward +x while drifting right (small at road speed)
  const drift = Math.atan2(vLat, Math.max(1, v));
  let at = {x, z, yaw: drift};
  if (bend) {
    const w = bendPoint(x, z, bend);
    at = {x: w.x, z: w.z, yaw: w.yaw + drift};
  }
  const heading = at.yaw;
  const skid = (valueAt(car.yaw, t, 0) * Math.PI) / 180;
  if (skid !== 0) {
    // turned about the front axle: the rear steps out
    const F = carToWorld([C.axleX.front, 0, 0], at);
    const f = carToWorld([C.axleX.front, 0, 0], {x: 0, z: 0, yaw: at.yaw - skid});
    at = {x: F[0] - f[0], z: F[2] - f[2], yaw: at.yaw - skid};
  }
  return {
    lateral,
    x: at.x,
    z: at.z,
    yaw: at.yaw,
    roadX: x,
    roadZ: z,
    heading,
    travelled: integrateSpeed(speed, t, 0.8),
    speed: v,
  };
};

/** How lit the grooves are at t, and over which z span. */
export const grooveLitAt = (p: Partial<HighwaySliceSceneProps>, t: number) => {
  const car = p.car === undefined ? {} : p.car;
  const c = car ? highwayCarAt(car, t, highwayBend(p)) : null;
  const far = c ? c.roadZ - C.axleX.front - 0.45 : -6;
  const span: [number, number] = [0, far];
  const mode = p.grooveLit ?? 'auto';
  if (mode !== 'auto') return {lit: Math.max(0, Math.min(1, valueAt(mode, t, 0))), span};
  if (!c) return {lit: 0, span};
  // the tread's overlap with the row; fully lit once 0.1 m of it rides the grooves
  const overlap = Math.min(c.lateral, G.x1) - Math.max(c.lateral - TREAD, G.x0);
  return {lit: Math.max(0, Math.min(1, overlap / 0.1)), span};
};

/** Where another car is at t (its origin, heading on a bend), and whether it is drawn (wholly behind the plane). */
const trafficAt = (tr: HighwayTraffic, youTravelled: number, t: number, bend: RoadBend | null) => {
  const z = -tr.ahead + REAR - ((tr.speed ?? 28) * t - youTravelled);
  const x = tr.lane === 'left' ? H.lanes.left : H.lanes.right;
  const w = bend ? bendPoint(x, z, bend) : {x, z, yaw: 0};
  return {x: w.x, z: w.z, yaw: w.yaw, drawn: z - REAR < -0.3};
};

// ------------------------------------------------------------------------------------------- No. 009

/** The orange path's core radius (style guide § 5, the vibration / energy path). */
const VIB_R = 0.0225;
/**
 * Where the ruler lies across by default: on the gravel just past the shoulder's outer edge (3.3), or with a
 * guardrail just outside its posts (4.1), where the rail doesn't hide it from the fixed angle.
 */
const rulerX = (p: Partial<HighwaySliceSceneProps>) => p.ruler?.x ?? ((p.guardrail ?? true) ? 4.1 : 3.3);
/** How far up the road markers and the ruler run (m), short of the slice's far end. */
const FAR = H.depth - 20;
/** The plane's z for things drawn on the cut face (a hair proud of it). */
const ON_FACE = 0.004;
/** The front bumper's distance ahead of the car's origin (m). */
const FRONT = 2.37;

/** The scene's road travelled at t (YOU's car's, 0 without a car). */
const scrollAt = (p: Partial<HighwaySliceSceneProps>, t: number) => {
  const car = p.car === undefined ? {} : p.car;
  return car ? integrateSpeed(car.speed ?? DEFAULT_SPEED, t, 0.8) : 0;
};
/** YOU's car's front bumper z (in road space; the car never moves along z). */
const carFrontZ = (p: Partial<HighwaySliceSceneProps>) => {
  const car = p.car === undefined ? {} : p.car;
  return car ? -(car.rear ?? 0.5) + REAR - FRONT : -3;
};

const countCache = new Map<string, number[]>();
/** The numbers on the markers, near → far (see `HighwayMarkers`). */
export const markerNumbers = (p: Partial<HighwaySliceSceneProps>): number[] => {
  const mk = p.markers;
  if (!mk) return [];
  if (mk.numbers && mk.numbers.length) return mk.numbers;
  const count = Math.max(1, Math.min(60, mk.count ?? 8));
  const from = mk.from ?? 1;
  const step = mk.step ?? 1;
  if (!mk.countKeys || !mk.countKeys.length || (mk.move ?? 'road') !== 'road')
    return [...Array(count).keys()].map((k) => from + k * step);
  const car = p.car === undefined ? {} : p.car;
  const speed = car ? (car.speed ?? DEFAULT_SPEED) : [];
  const sp = mk.spacing ?? 40;
  const z0 = mk.z ?? -28;
  const zAt = mk.zAt ?? 0;
  const cf = carFrontZ(p);
  const key = JSON.stringify([mk.countKeys, sp, z0, zAt, count, speed, cf]);
  const hit = countCache.get(key);
  if (hit) return hit;
  // marker k passes the car's front when the road has moved cf − z0 + k·sp past where it was at zAt
  const DT = 1 / 60;
  const TMAX = 180;
  const s0 = integrateSpeed(speed, zAt, 0.8);
  const out: number[] = [];
  let tt = 0;
  let sc = 0;
  for (let k = 0; k < count; k++) {
    const target = s0 + cf - z0 + k * sp;
    while (sc < target && tt < TMAX) {
      sc += speedAt(speed, tt + DT / 2, 0.8) * DT;
      tt += DT;
    }
    const v = Math.round(keyed(mk.countKeys, tt, mk.countKeys[0].value));
    out.push(k === 0 ? v : Math.max(v, out[k - 1] + 1));
  }
  countCache.set(key, out);
  return out;
};

/** Where marker index `u` (0 = the first; fractions between) stands along the road at t (z). */
const markerZ = (p: Partial<HighwaySliceSceneProps>, u: number, t: number, nums: number[]) => {
  const mk = p.markers!;
  const sp = mk.spacing ?? 40;
  const refIdx = mk.countKeys && (mk.move ?? 'road') === 'road' ? 0 : Math.max(0, nums.indexOf(mk.ref ?? nums[0]));
  const moved = (mk.move ?? 'road') === 'road' ? scrollAt(p, t) - scrollAt(p, mk.zAt ?? 0) : 0;
  return (mk.z ?? -28) - (u - refIdx) * sp + moved;
};

type MarkerNow = {n: number; i: number; x: number; z: number; exitZ: number | null; shown: boolean; exitShown: boolean};
/** Every marker of the row at t: its number, place, its exit sign's place, and whether each is drawn (wholly behind the plane, in the slice). */
export const markersAt = (p: Partial<HighwaySliceSceneProps>, t: number): MarkerNow[] => {
  const mk = p.markers;
  if (!mk) return [];
  const nums = markerNumbers(p);
  const exits = new Set(mk.exits ?? []);
  const gap = mk.exitGap ?? 8;
  const inSlice = (z: number) => z < -0.6 && z > -FAR;
  return nums.map((n, i) => {
    const z = markerZ(p, i, t, nums);
    const exitZ = exits.has(n) ? z - gap : null;
    return {
      n,
      i,
      x: mk.x ?? SIGN_SPOTS.mile.x,
      z,
      exitZ,
      shown: inSlice(z),
      exitShown: exitZ !== null && inSlice(exitZ - 0.2),
    };
  });
};

/** The ruler's height (on the ground at its x, a hair above). */
const rulerY = (x: number) => groundAt(x) + 0.03;

/** A ruler end's z at t (undefined: a marker not in the row). */
const rulerEndZ = (p: Partial<HighwaySliceSceneProps>, end: RulerEnd, t: number, row: MarkerNow[]) => {
  if (end === 'plane') return ON_FACE;
  if (end === 'far') return -FAR;
  if (end === 'car') return carFrontZ(p);
  const m = row.find((q) => q.n === end);
  return m ? Math.max(-FAR, Math.min(ON_FACE, m.z)) : undefined;
};

/** A ruler line's points (along the shoulder; down the cut face at a 'plane' end with `down`). */
const rulerLinePoints = (p: Partial<HighwaySliceSceneProps>, l: RulerLine, t: number, row: MarkerNow[]): V3[] => {
  const x = rulerX(p);
  const y = rulerY(x);
  const za = rulerEndZ(p, l.from, t, row);
  const zb = rulerEndZ(p, l.to, t, row);
  if (za === undefined || zb === undefined) return [];
  const pts: V3[] = [
    [x, y, za],
    [x, y, zb],
  ];
  const bottom: V3 = [x, H.bottom, ON_FACE];
  if (l.down && l.from === 'plane') pts.unshift(bottom);
  if (l.down && l.to === 'plane') pts.push(bottom);
  return pts;
};

/** A link point in the world at t (see `RulerPoint`), or undefined. */
const rulerPoint = (
  p: Partial<HighwaySliceSceneProps>,
  q: RulerPoint,
  prev: V3 | undefined,
  t: number,
  row: MarkerNow[],
): V3 | undefined => {
  if (Array.isArray(q)) return q;
  const [name, arg] = q.split(':');
  const n = Number(arg);
  const m = row.find((r) => r.n === n);
  const x = rulerX(p);
  const car = p.car === undefined ? {} : p.car;
  const c = car ? highwayCarAt(car, t, highwayBend(p)) : null;
  const mileH = (k: number) => signSize('mile', [String(k)]).h;
  switch (name) {
    case 'marker':
      return m ? [m.x, rulerY(m.x), m.z] : undefined;
    case 'post':
      return m ? [m.x, (groundAt(m.x) + signBottom('mile')) / 2, m.z + 0.04] : undefined;
    case 'sign':
      return m ? [m.x, signBottom('mile') + mileH(n) / 2, m.z + 0.02] : undefined;
    case 'tick':
      return m ? [x, rulerY(x), m.z] : undefined;
    case 'exit': {
      // the post under the plaque (the right one)
      if (!m || m.exitZ === null) return undefined;
      const ex = (p.markers?.exitX ?? SIGN_SPOTS.exit.x) + 1.25;
      return [ex, rulerY(ex), m.exitZ];
    }
    case 'plaque': {
      if (!m || m.exitZ === null) return undefined;
      const sz = signSize('exit', [arg, ...(p.markers?.exitLegend ?? [])]);
      const ex = (p.markers?.exitX ?? SIGN_SPOTS.exit.x) + sz.w / 2 - 0.55;
      return [ex, signBottom('exit') + sz.h - 0.4, m.exitZ + 0.02];
    }
    case 'zero':
      return [x, rulerY(x), ON_FACE];
    case 'car':
      return c ? carToWorld([-0.4, 1.78, 0], c) : undefined;
    case 'window':
      return c ? carToWorld([0.15, 1.12, C.driver[2]], c) : undefined;
    case 'up':
      return prev ? [prev[0], prev[1] + 60, prev[2]] : undefined;
    default:
      return undefined;
  }
};

/**
 * Everything the ruler draws at t (pure: the scene renders it, anchors read it): its lines, ticks, marks,
 * pulses and links, with their strengths; `r` the core radius for the camera distance `camD`.
 */
export const rulerAt = (p: Partial<HighwaySliceSceneProps>, t: number, camD: number) => {
  const ru = p.ruler;
  const row = markersAt(p, t);
  // ≈ the same width on screen from the close-up to the wide (§ 5 at ≈ 30 m), thinner close
  const r = VIB_R * Math.max(0.25, Math.min(3.5, camD / 30));
  const zeroAt: V3 = [rulerX(p), rulerY(rulerX(p)), ON_FACE];
  if (!ru) return {r, row, lines: [], ticks: [], nodes: [], pulses: [], links: [], zero: 0, zeroAt};
  const x = rulerX(p);
  const y = rulerY(x);
  const lines = (ru.lines ?? []).map((l) => {
    const pts = rulerLinePoints(p, l, t, row);
    const draw = Math.max(0, Math.min(1, valueAt(l.draw, t, 1)));
    const bright = Math.max(0, Math.min(1, valueAt(l.bright, t, 0)));
    const glow = Math.max(0, Math.min(1, valueAt(l.glow, t, 1)));
    // the stretch along the shoulder drawn so far: from its start to the head
    const along = pts.filter((q) => Math.abs(q[1] - y) < 1e-6);
    const z0 = along.length ? along[0][2] : 0;
    const z1 = along.length ? along[along.length - 1][2] : 0;
    const head = pointAlong(pts, draw);
    const zHead = Math.abs(head[1] - y) < 1e-6 ? head[2] : draw > 0.5 ? z1 : z0;
    return {pts, draw, bright, glow, z0, zHead};
  });
  const mode = ru.ticks ?? 'drawn';
  const cf = carFrontZ(p);
  const ticks = row
    .filter((m) => m.shown)
    .map((m) => {
      let lit = mode === 'all' ? 1 : 0;
      if (mode === 'drawn' || mode === 'car')
        for (const l of lines) {
          if (l.draw <= 0 || l.glow <= 0) continue;
          const lo = Math.min(l.z0, l.zHead);
          const hi = Math.max(l.z0, l.zHead);
          if (m.z < lo - 0.5 || m.z > hi + 0.5) continue;
          lit = Math.max(lit, Math.min(1, (Math.abs(l.zHead - m.z) + 0.5) / 6) * l.glow);
        }
      if (mode === 'car' && (p.markers?.move ?? 'road') === 'road') lit = Math.max(lit, Math.min(1, Math.max(0, (m.z - cf) / 6)));
      const mark = (ru.marks ?? []).find((k) => k.n === m.n && (k.kind ?? 'tick') === 'tick');
      if (mark) lit = Math.max(lit, Math.max(0, Math.min(1, valueAt(mark.glow, t, 0))));
      const swell = mark ? pulseSwell(mark.pulse, t) : 1;
      const foot: V3 = [m.x, rulerY(m.x), m.z];
      return {n: m.n, a: [x, y, m.z] as V3, b: foot, lit, swell};
    })
    .filter((k) => k.lit > 0.003);
  const nodes = (ru.marks ?? [])
    .filter((k) => k.kind === 'node')
    .map((k) => {
      const at = rulerPoint(p, `post:${k.n}`, undefined, t, row);
      const m = row.find((q) => q.n === k.n);
      return at && m?.shown
        ? {at, glow: Math.max(0, Math.min(1, valueAt(k.glow, t, 0))), swell: pulseSwell(k.pulse, t)}
        : null;
    })
    .filter((k): k is {at: V3; glow: number; swell: number} => k !== null && k.glow > 0.003);
  const pulses = (ru.pulses ?? [])
    .map((q) => {
      const dur = q.dur ?? 1.2;
      const age = t - q.at;
      if (age < 0 || age > dur + 0.6) return null;
      const pts = rulerLinePoints(p, {from: q.from, to: q.to}, t, row);
      if (pts.length < 2) return null;
      const u = ease(t, q.at, q.at + dur);
      const flash = age > dur ? (age - dur) / 0.6 : -1;
      return {at: pointAlong(pts, u), end: pts[pts.length - 1], flash};
    })
    .filter((q): q is {at: V3; end: V3; flash: number} => q !== null);
  const links = (ru.links ?? []).map((lk) => {
    const pts: V3[] = [];
    const named: V3[] = [];
    for (const q of lk.points) {
      const w = rulerPoint(p, q, pts[pts.length - 1], t, row);
      if (!w) continue;
      pts.push(w);
      if (q !== 'up') named.push(w);
    }
    return {
      pts,
      named,
      draw: Math.max(0, Math.min(1, valueAt(lk.draw, t, 1))),
      glow: Math.max(0, Math.min(1, valueAt(lk.glow, t, 1))),
    };
  });
  return {r, row, lines, ticks, nodes, pulses, links, zero: Math.max(0, Math.min(1, valueAt(ru.zero, t, 0))), zeroAt};
};

/** A node's swell for pulses at the given times (a 0.7 s bump to 1.8×). */
const pulseSwell = (at: number[] | undefined, t: number) =>
  (at ?? []).reduce((a, k) => {
    const age = t - k;
    return age < 0 || age > 0.7 ? a : Math.max(a, 1 + 0.8 * Math.sin((Math.PI * age) / 0.7));
  }, 1);

/**
 * A named point of H in the world at t: 'youSpot' (YOU's car roof, for the name tag), 'tire' (YOU's right-rear tire's contact patch), 'tail' (its right
 * tail lamp), 'grooveDepth' (the bottom of the groove cut on the face), 'grooveNext' (the next groove's
 * middle, 12 in up the road), 'whiteLine' (the white line on the cut), 'sign:speed' | 'sign:mile' |
 * 'sign:guide' (the panel's middle). No. 009: 'marker:N' (marker N's panel middle), 'markerFoot:N', 'exit:N'
 * (exit N's panel middle), 'plaque:N' (its EXIT plaque), 'rulerZero' (the ruler's zero node on the cut face,
 * for the STATE LINE callout), 'phoneWindow' (YOU's head through the glass, for a detail box's leader).
 */
export const highwayAnchorPoint = (p: Partial<HighwaySliceSceneProps>, anchor: string, t: number): V3 | undefined => {
  const [name, arg] = anchor.split(':');
  const car = p.car === undefined ? {} : p.car;
  const c = car ? highwayCarAt(car, t, highwayBend(p)) : null;
  switch (name) {
    case 'youSpot':
      // the roof of YOU's car, for YOU's name tag
      return c ? carToWorld([-0.4, 1.78, 0], c) : undefined;
    case 'tire':
      return c ? carToWorld([C.axleX.rear, 0.02, C.track + TIRE_OUT - TREAD / 2], c) : undefined;
    case 'tail':
      return c ? carToWorld([REAR, 1.04, 0.7], c) : undefined;
    case 'grooveDepth':
      return [(G.x0 + G.x1) / 2, -G.depth, 0.002];
    case 'grooveNext':
      return [(G.x0 + G.x1) / 2, 0, -G.period];
    case 'whiteLine':
      return [(H.white[0] + H.white[1]) / 2, 0, 0.002];
    case 'sign': {
      const s = (p.signs ?? DEFAULT_SIGNS).find((q) => q.kind === arg);
      if (!s) return undefined;
      const spot = SIGN_SPOTS[s.kind];
      const size = signSize(s.kind, s.text);
      const w = bendPoint(s.x ?? spot.x, s.z ?? spot.z, highwayBend(p));
      return [w.x, signBottom(s.kind) + size.h / 2, w.z];
    }
    case 'marker':
    case 'markerFoot':
    case 'exit':
    case 'plaque': {
      const row = markersAt(p, t);
      const m = row.find((q) => q.n === Number(arg));
      if (!m) return undefined;
      if (name === 'marker') return rulerPoint(p, `sign:${arg}`, undefined, t, row);
      if (name === 'markerFoot') return rulerPoint(p, `marker:${arg}`, undefined, t, row);
      if (name === 'plaque') return rulerPoint(p, `plaque:${arg}`, undefined, t, row);
      if (m.exitZ === null) return undefined;
      const sz = signSize('exit', [arg, ...(p.markers?.exitLegend ?? [])]);
      return [p.markers?.exitX ?? SIGN_SPOTS.exit.x, signBottom('exit') + sz.h / 2, m.exitZ];
    }
    case 'rulerZero':
      return rulerPoint(p, 'zero', undefined, t, []);
    case 'phoneWindow':
      return rulerPoint(p, 'window', undefined, t, []);
    default:
      return undefined;
  }
};

/** A named point of H on screen (px) at this frame (see `highwayAnchorPoint`). */
export const highwayAnchorOnScreen = (
  p: Partial<HighwaySliceSceneProps>,
  anchor: string,
  o: {frame: number; fps: number; durationInFrames: number},
): [number, number] | undefined => {
  const w = highwayAnchorPoint(p, anchor, o.frame / o.fps);
  return w ? projectToFrame(highwayCameraAt(p, o), w) : undefined;
};

/** How far behind the look-at point the sky card stands (m): past the road's far end. */
const BACKDROP = 700;

/**
 * H, the highway slice (No. 005): a divided rural interstate at night cut square to the road (median,
 * inside shoulder, yellow left edge line, two 12 ft lanes, white right edge line, the 10 ft shoulder with
 * its groove row, gravel, guardrail, ditch), the road running into depth. YOU's car, whole, drives away
 * just behind the plane (the road streams toward the camera under it), its right tires' place across the
 * road keyed (`car.lateral`) so it can drift onto the grooves and back; the grooves wash orange under
 * the tires ('auto') or as keyed. Traffic ahead, headlight cones, retroreflective signs facing the camera
 * (SPEED LIMIT 65, MILE 112, NEXT EXIT / 2 MILES). Day or Night. No. 008 adds the road after the rain
 * (`wet`: puddles, the sky's sheen, tire spray), a bend in depth (`curve`), and YOU's skid and its recovery
 * from outside (`car.yaw`, `car.spin`: the driven wheels' spray stops, the car eases straight; no orange).
 */
export const HighwaySliceScene: React.FC<HighwaySliceSceneProps> = (props) => {
  const {durationInFrames, mood: moodTo = 'day', startFrame = 0, guardrail = true} = props;
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  // the time-passes beat (§ 4): one render, the palette and lights blended; parts that take a mood switch at the midpoint
  const moodFrom = props.moodFrom;
  const blending = moodFrom !== undefined && moodFrom !== moodTo;
  const kMood = blending ? ease(t, props.moodAt ?? 0.3, (props.moodAt ?? 0.3) + TIME_PASSES) : 1;
  const palette = blending ? blendMood(moodFrom, moodTo, kMood) : undefined;
  const mood: Mood = blending && kMood < 0.5 ? moodFrom : moodTo;
  const m = palette ?? MOODS[mood];
  /** How much of Night there is: 1 at Night, 0 in Day, between them during the blend. */
  const nightness = blending ? (moodTo === 'night' ? kMood : 1 - kMood) : moodTo === 'night' ? 1 : 0;
  const night = mood === 'night';
  const {from, to, pre} = highwayCameraMove(props, durationInFrames, fps, frame);
  const cam = highwayCameraAt(props, {frame, fps, durationInFrames});
  const camD = cam.position.distanceTo(cam.look);
  const backdrop = {
    position: cam.look
      .clone()
      .addScaledVector(new THREE.Vector3(...SECTION_ANGLE), -BACKDROP)
      .toArray() as V3,
    size: 2 * (camD + BACKDROP) * Math.tan((13 * Math.PI) / 180) * 1.25,
  };
  const backQ = useMemo(
    () => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), new THREE.Vector3(...SECTION_ANGLE)),
    [],
  );
  const mats = useMemo(
    () => ({
      sky: new THREE.MeshBasicMaterial({map: skyTexture(mood), fog: false}),
      track: new THREE.MeshBasicMaterial({
        color: raw(MOODS[mood].ink),
        transparent: true,
        // grey ink: the Night ink at 55% on the asphalt
        opacity: 0.55,
        depthWrite: false,
      }),
    }),
    [mood],
  );
  // the time-passes beat's sky: the destination's picture behind, the opening one over it, fading out
  const skyMats = useMemo(
    () =>
      blending
        ? {
            to: new THREE.MeshBasicMaterial({map: skyTexture(moodTo), fog: false}),
            from: new THREE.MeshBasicMaterial({map: skyTexture(moodFrom), fog: false, transparent: true, depthWrite: false}),
          }
        : null,
    [blending, moodTo, moodFrom],
  );
  const bandMats = useMemo(() => [bandMaterial('z', -1), bandMaterial('z', -1)], []);
  mats.sky.color.setScalar(1 / m.exposure);
  if (skyMats) {
    skyMats.to.color.setScalar(1 / m.exposure);
    skyMats.from.color.setScalar(1 / m.exposure);
    skyMats.from.opacity = 1 - kMood;
  }

  const bend = highwayBend(props);
  const wet = props.wet ?? false;
  const carSpec = props.car === undefined ? {} : props.car;
  const car = carSpec ? highwayCarAt(carSpec, t, bend) : null;
  const speed = carSpec ? (carSpec.speed ?? DEFAULT_SPEED) : DEFAULT_SPEED;
  const travelled = car ? car.travelled : 0;
  // half-frame shutter: the road moves this far while it is open; the wheels turn this much
  const shutter = (props.shutter ?? 0.5) / fps;
  const roadBlur = (car ? car.speed : 0) * shutter;
  const tireShutter = (carSpec?.tireShutter ?? 0.02) / fps;
  const wheelBlur = carSpec
    ? (integrateSpeed(speed, t + tireShutter / 2, 0.8) - integrateSpeed(speed, t - tireShutter / 2, 0.8)) / C.wheelR
    : 0;
  const {lit, span} = grooveLitAt(props, t);
  // wheels that read as rolling forward (`wheels`, default 'forward'; 'legacy' for posted videos)
  const fwd = wheelMode(props.wheels) === 'forward';
  const wheelCap = capSpeed(C.wheelR, fps);
  /** A lamp's level: a boolean, keys 0 → 1, or (undefined) on at Night, following the time-passes blend. */
  const lampLevel = (v: boolean | Keyed | undefined) =>
    v === undefined ? nightness : typeof v === 'boolean' ? (v ? 1 : 0) : Math.max(0, Math.min(1, valueAt(v, t, 0)));
  const headLevel = carSpec ? lampLevel(carSpec.headlights) : 0;
  const headlights = headLevel > 0.001;
  // brakes and hazards (No. 009): the hazards blink on the video clock, rear red at brake brightness, front corners yellow
  const brake = carSpec ? Math.max(0, Math.min(1, valueAt(carSpec.brake, t, 0))) : 0;
  const hz = carSpec?.hazard ?? null;
  const hazardOn = hz ? hazardLevel((startFrame + frame) / fps, (startFrame / fps) + (hz.at ?? 0)) : 0;
  // the service-patrol truck (No. 009, M6): up the shoulder behind YOU's car, drawn once wholly behind the plane
  const helper = props.helper ?? null;
  const helperDrive: PatrolDrive | null = helper
    ? {
        ...helper,
        x: helper.x ?? (car ? car.roadX : 1.5),
        stopZ: helper.stopZ ?? -(carSpec?.rear ?? 0.5) + (helper.gap ?? 3) + PATROL_HALF,
      }
    : null;
  // keep it a whole truck: hidden until its rear is behind the plane
  const helperShown = helperDrive ? patrolAt(helperDrive, t).z + PATROL_HALF < -0.3 : false;

  // the signs, and how much the headlights brighten their retroreflective faces (nearer: brighter)
  const front = car ? car.roadZ - 2.37 : 0;
  const font = props.signFont;
  const retroAt = (z: number) => {
    const ahead = front - z;
    const retro = headlights && ahead > 0 ? (headLevel * 0.55) / (1 + (ahead / 40) ** 2) : 0;
    return 0.08 * nightness + retro;
  };
  const baseSigns = (props.signs ?? DEFAULT_SIGNS).map((s, i) => {
    const spot = SIGN_SPOTS[s.kind];
    const z = s.z ?? spot.z;
    return {kind: s.kind, text: s.text, x: s.x ?? spot.x, z, retro: retroAt(z), font, id: `s${i}`};
  });
  // the mile markers and their exit signs (No. 009), keyed by number so a streaming row never redraws a face
  const ruler = rulerAt(props, t, camD);
  const exitLegend = props.markers?.exitLegend ?? [];
  const markerSigns = ruler.row.flatMap((q) => [
    ...(q.shown ? [{kind: 'mile' as const, text: [String(q.n)], x: q.x, z: q.z, retro: retroAt(q.z), font, id: `m${q.n}`}] : []),
    ...(q.exitShown && q.exitZ !== null
      ? [
          {
            kind: 'exit' as const,
            text: [String(q.n), ...exitLegend],
            x: props.markers?.exitX ?? SIGN_SPOTS.exit.x,
            z: q.exitZ,
            retro: retroAt(q.exitZ),
            font,
            id: `e${q.n}`,
          },
        ]
      : []),
  ]);
  const signs = [...baseSigns, ...markerSigns];

  // the cut face's ink keeps ≈ 3 px from the groove close-up to the wide shot: the § 3 width (0.011) at the
  // living room's wide distance (12.75), scaled with the distance (thinner close: the groove is ½ in deep)
  const ink = Math.max(0.25, Math.min(16, camD / 12.75));

  // headlights: two spots from the lamps, aimed at the road ≈ 28 m ahead (always mounted: 0 when off)
  const lamps = useMemo(() => [0, 1].map(() => new THREE.SpotLight(raw(HIGHWAY.headlight), 0, 75, 0.36, 0.55, 1)), []);
  if (car) {
    [-0.55, 0.55].forEach((s, i) => {
      const l = lamps[i];
      l.intensity = 26 * headLevel;
      l.position.set(...carToWorld([2.3, 0.8, s], car));
      l.target.position.set(...carToWorld([30, 0, s * 2.5], car));
      l.target.updateMatrixWorld();
    });
  } else lamps.forEach((l) => (l.intensity = 0));
  // the Night floor's spot on YOU's car (always mounted: changing the light count recompiles every shader)
  const carSpot = useMemo(() => new THREE.SpotLight(0x000000, 0, 0, 0.16, 0.6, 0), []);
  const fl = m.figureLight;
  carSpot.color.copy(raw(fl?.color ?? '#000000'));
  carSpot.intensity = car && fl ? fl.intensity * Math.PI * Math.max(0, props.carLight ?? 0) : 0;
  if (car) {
    const c0 = carToWorld([0, 0.8, 0], car);
    carSpot.position.set(c0[0] + 4, c0[1] + 9, c0[2] + 12);
    carSpot.target.position.set(...c0);
    carSpot.target.updateMatrixWorld();
  }

  const traffic = (props.traffic ?? DEFAULT_TRAFFIC).map((tr) => ({tr, ...trafficAt(tr, travelled, t, bend)}));

  // wheelspin: the driven axle's extra tread and blur
  const driveFront = (carSpec?.drive ?? 'front') === 'front';
  const spinNow = carSpec ? Math.max(0, valueAt(carSpec.spin, t, 0)) : 0;
  const axles =
    car && carSpec && carSpec.spin !== undefined
      ? {
          [driveFront ? 'front' : 'rear']: {
            travelled: travelled + spinTravel(carSpec, t),
            blur: wheelBlur * (1 + SPIN_GAIN * spinNow),
          },
        }
      : undefined;
  // the spray off YOU's tires (wet only): fine mist from all four while rolling, the rooster tail from
  // the driven pair while they spin; it streams back along the road (the air), not the skidding body
  const sprayAmt = props.spray ?? 1;
  const emitters: SprayEmitter[] =
    wet && car && carSpec
      ? [C.axleX.front, C.axleX.rear].flatMap((ax, ai) =>
          [-1, 1].map((sd) => {
            const driven = ai === 0 ? driveFront : !driveFront;
            const h = car.heading;
            return {
              at: carToWorld([ax - 0.25, 0, sd * (C.track + TIRE_OUT - TREAD / 2)], car),
              back: [-Math.sin(h), Math.cos(h)] as [number, number],
              out: [sd * Math.cos(h), sd * Math.sin(h)] as [number, number],
              speed: car.speed,
              strength: (tb: number) => ({
                mist: sprayAmt * Math.min(1, speedAt(speed, Math.max(0, tb), 0.8) / 20),
                spin: driven ? Math.max(0, Math.min(1, valueAt(carSpec.spin, tb, 0))) : 0,
              }),
            };
          }),
        )
      : [];

  // impact flashes and the band under YOU's right tires (rings sized by the camera: ≈ the same on screen)
  const ringK = Math.max(0.6, Math.min(8, camD / 8.5));
  const imp = props.impacts ?? null;
  const impBlur = imp ? Math.max(0, Math.min(1, valueAt(imp.blur, t, 0))) : 0;
  const tiresOnRow =
    car && carSpec
      ? Math.max(0, Math.min(1, (Math.min(car.lateral, G.x1) - Math.max(car.lateral - TREAD, G.x0)) / 0.1))
      : 0;
  // the "feel it" tremble, gated to the grooves, with kicks (given, or each time the tires reach the row)
  const onRowAt = (tt: number) => {
    if (!carSpec) return 0;
    const lat = valueAt(carSpec.lateral, tt, -0.1);
    return Math.max(0, Math.min(1, (Math.min(lat, G.x1) - Math.max(lat - TREAD, G.x0)) / 0.1));
  };
  const kickTimes =
    props.shakeKick === 'auto'
      ? [...Array(11).keys()]
          .map((i) => t - i / fps)
          .filter((tt) => tt > 0 && onRowAt(tt) >= 0.3 && onRowAt(tt - 1 / fps) < 0.3)
      : (props.shakeKick ?? []);
  const kick = kickTimes.reduce((a, k) => {
    const age = t - k;
    return age < 0 || age > 0.35 ? a : a + 2 * (1 - age / 0.35) ** 2;
  }, 0);
  const shakeAmt = Math.max(0, valueAt(props.shake, t, 0)) * tiresOnRow + kick;
  const sj = (k: string, a: number) =>
    shakeAmt > 0 ? (random(`hwy-shake-${k}-${frame}`) - 0.5) * 2 * a * shakeAmt : 0;
  const bodyJ: V3 = [sj('x', 0.004), sj('y', 0.005), sj('z', 0.004)];
  const contacts =
    car && imp
      ? [C.axleX.rear, C.axleX.front].map((ax, i) => {
          const period = 1 / Math.max(0.1, imp.rate ?? 6);
          const since = t - (imp.at ?? 0) - (i * period) / 2;
          const ages = since < 0 ? [] : [0, 1, 2].map((j) => (since % period) + j * period).filter((a) => a <= since);
          return {at: carToWorld([ax, 0.01, C.track + TIRE_OUT - TREAD / 2], car), ages};
        })
      : [];
  bandMats.forEach((b, i) => {
    b.uniforms.uAmt.value = impBlur * tiresOnRow;
    b.uniforms.uHead.value = contacts[i]?.at[2] ?? 0;
  });

  // line 7's tire tracks: their paths (fixed), how much of each is drawn, and the flash where each crosses the row
  const trk = props.tracks ?? null;
  // keyed on the layout only, so the paths (and the ribbons' geometry) are built once, not every frame
  const trackKey = trk
    ? [
        trk.at.length,
        trk.back === undefined ? 4 : trk.back,
        trk.end ?? 3.4,
        trk.start ?? -4,
        trk.spacing ?? 8,
        trk.length ?? 22,
      ].join('|')
    : '';
  const trackPaths = useMemo(() => {
    if (!trackKey) return [];
    const [n, back, end, start, spacing, length] = trackKey.split('|');
    return trackPolylines(Number(n), back === 'null' ? null : Number(back), {
      end: Number(end),
      start: Number(start),
      spacing: Number(spacing),
      length: Number(length),
    });
  }, [trackKey]);
  const trackState = trk
    ? trackPaths.map((path, k) => {
        const draw = trk.draw ?? 1.4;
        const t0 = trk.at[k] ?? 0;
        const progress = ease(t, t0, t0 + draw);
        const cross = path.cross;
        const crossAt = cross ? t0 + draw * cross.u : null;
        return {path, progress, cross, crossAge: crossAt === null ? -1 : t - crossAt};
      })
    : [];

  return (
    <AbsoluteFill>
      <SectionStage mood={mood} palette={palette} post={{focusY: 0.5}} ao far={1500}>
        <SectionCamera
          from={from}
          to={to}
          pre={pre}
          durationInFrames={durationInFrames}
          drift={props.drift ?? 0.08}
          clockOffset={startFrame / fps}
          fitClip
          farMin={camD + BACKDROP + 50}
          shake={shakeAmt}
          shakeSeed="highway-shake"
        />
        <SectionLights mood={mood} palette={palette} target={[0, 0, -6]} lamp={0} extent={16} figureSpot={false} />
        <primitive object={carSpot} />
        <primitive object={carSpot.target} />
        {lamps.map((l, i) => (
          <React.Fragment key={i}>
            <primitive object={l} />
            <primitive object={l.target} />
          </React.Fragment>
        ))}
        <mesh
          position={backdrop.position}
          quaternion={backQ}
          material={skyMats ? skyMats.to : mats.sky}
          scale={[backdrop.size * 0.5625, backdrop.size, 1]}
        >
          <planeGeometry args={[1, 1]} />
        </mesh>
        {skyMats ? (
          <mesh
            position={new THREE.Vector3(...backdrop.position).addScaledVector(new THREE.Vector3(...SECTION_ANGLE), 1).toArray()}
            quaternion={backQ}
            material={skyMats.from}
            scale={[backdrop.size * 0.5625, backdrop.size, 1]}
            visible={kMood < 0.999}
          >
            <planeGeometry args={[1, 1]} />
          </mesh>
        ) : null}
        <HighwaySlice
          mood={mood}
          scroll={travelled}
          blur={roadBlur}
          lit={lit}
          litSpan={span}
          ink={ink}
          signs={signs}
          guardrail={guardrail}
          wet={wet}
          bend={bend}
        />
        {car && carSpec ? (
          <DrivingCar
            mood={mood}
            at={car}
            travelled={fwd && !axles ? cappedTravel((x) => speedAt(speed, x, 0.8), t, wheelCap) : travelled}
            blur={fwd && !axles ? wheelSmear(wheelBlur, car.speed, wheelCap) : wheelBlur}
            spinSign={fwd ? -1 : 1}
            body={carSpec.body ?? 'you'}
            shape={carSpec.shape}
            paint={
              carSpec.paint ??
              (blending ? mixHex(CAR[moodFrom].bodies[carSpec.body ?? 'you'], CAR[moodTo].bodies[carSpec.body ?? 'you'], kMood) : undefined)
            }
            tail={lampLevel(carSpec.tail)}
            brake={Math.max(brake, hazardOn)}
            frontLamps={hz ? hazardOn : undefined}
            driver={carSpec.driver ?? true}
            plate="8KTR 214"
            clockOffset={startFrame / fps}
            // the focus wheels sit in the car's own key shadow at Night: more studio reflection keeps
            // the spokes, lip and tread readable (no light added)
            envBoost={night ? 2.6 : 1}
            jitter={bodyJ}
            axles={axles}
          />
        ) : null}
        {emitters.length ? <TireSpray emitters={emitters} t={t} seed="highway-spray" exposure={m.exposure} /> : null}
        {traffic
          .filter((q) => q.drawn)
          .map((q, i) => (
            <DrivingCar
              key={i}
              mood={mood}
              at={{x: q.x, z: q.z, yaw: q.yaw}}
              travelled={fwd ? Math.min(q.tr.speed ?? 28, wheelCap) * t : (q.tr.speed ?? 28) * t}
              blur={
                fwd
                  ? wheelSmear(((q.tr.speed ?? 28) * shutter) / C.wheelR, q.tr.speed ?? 28, wheelCap)
                  : ((q.tr.speed ?? 28) * shutter) / C.wheelR
              }
              spinSign={fwd ? -1 : 1}
              body={q.tr.body ?? 'extra'}
              tail={nightness}
              driver={false}
              plate={i % 2 ? '5MWD 830' : '3HLA 571'}
              clockOffset={startFrame / fps}
            />
          ))}
        {/* impact flashes at the right tires' contact patches, and the band they blur into */}
        {contacts.map((c, i) => (
          <React.Fragment key={i}>
            {impBlur < 0.6 && tiresOnRow > 0.3
              ? c.ages.map((age, j) => (
                  <group key={j} position={c.at} scale={ringK}>
                    <RadioPulse position={[0, 0, 0]} age={age} reach={0.22} weight={1} arc={Math.PI} />
                  </group>
                ))
              : null}
            <mesh
              position={[(G.x0 + G.x1) / 2, 0.006, c.at[2] + 0.4]}
              rotation={[-Math.PI / 2, 0, 0]}
              material={bandMats[i]}
              visible={impBlur * tiresOnRow > 0.003}
              userData={{glow: true}}
              renderOrder={5}
            >
              <planeGeometry args={[G.x1 - G.x0, 1.0]} />
            </mesh>
          </React.Fragment>
        ))}
        {helperDrive && helperShown ? (
          <PatrolTruck
            mood={mood}
            drive={helperDrive}
            t={t}
            clockOffset={startFrame / fps}
            flashing={helper?.flashing ?? 1}
            headlights={nightness}
          />
        ) : null}
        {/* No. 009: the mile ruler (the count), its ticks, marks, pulses and links */}
        {props.ruler ? <RulerView state={ruler} /> : null}
        {/* line 7: the tire tracks (ink on the road) and their flash on the row */}
        {trackState.map((s, k) => (
          <React.Fragment key={k}>
            <TrackRibbon path={s.path} progress={s.progress} material={mats.track} />
            {s.cross && s.crossAge >= 0 && s.crossAge < 1 ? (
              <group position={[s.cross.x, groundAt(s.cross.x) + 0.02, s.cross.z]} scale={ringK}>
                <RadioPulse position={[0, 0, 0]} age={s.crossAge} reach={0.3} weight={1} arc={Math.PI} />
              </group>
            ) : null}
          </React.Fragment>
        ))}
      </SectionStage>
    </AbsoluteFill>
  );
};

/** The ruler as drawn (see `rulerAt`). */
const RulerView: React.FC<{state: ReturnType<typeof rulerAt>}> = ({state}) => {
  const {r} = state;
  const nodeR = r * NODE_SCALE;
  return (
    <>
      {state.zero > 0.003 ? (
        <GlowNode at={state.zeroAt} radius={nodeR * 1.5} glow={state.zero} />
      ) : null}
      {state.lines.map((l, i) => (
        <GlowPolyline
          key={i}
          points={l.pts}
          draw={l.draw}
          radius={r * (1 + 0.8 * l.bright)}
          glow={l.glow}
          halo={1 + 1.4 * l.bright}
        />
      ))}
      {state.ticks.map((k) => {
        // the tick grows out from the ruler to the marker's foot, its node lighting at the foot
        const b: V3 = [k.a[0] + (k.b[0] - k.a[0]) * k.lit, k.a[1] + (k.b[1] - k.a[1]) * k.lit, k.a[2]];
        return (
          <React.Fragment key={k.n}>
            <GlowPolyline points={[k.a, b]} radius={r} glow={Math.min(1, k.lit * 1.5)} />
            <GlowNode at={k.a} radius={nodeR * 0.8} glow={k.lit} />
            <GlowNode at={k.b} radius={nodeR} glow={Math.max(0, (k.lit - 0.6) / 0.4)} swell={k.swell} />
          </React.Fragment>
        );
      })}
      {state.nodes.map((n, i) => (
        <GlowNode key={i} at={n.at} radius={nodeR} glow={n.glow} swell={n.swell} />
      ))}
      {state.links.map((l, i) => {
        const total = Math.max(1, l.pts.length - 1);
        return (
          <React.Fragment key={i}>
            <GlowPolyline points={l.pts} draw={l.draw} radius={r} glow={l.glow} />
            {/* a node at each named point the drawing has reached */}
            {l.named.map((q, j) => {
              const idx = l.pts.indexOf(q);
              const reached = l.draw >= (idx / total) * 0.999;
              return reached ? <GlowNode key={j} at={q} radius={nodeR} glow={l.glow} /> : null;
            })}
          </React.Fragment>
        );
      })}
      {state.pulses.map((q, i) =>
        q.flash < 0 ? (
          <GlowNode key={i} at={q.at} radius={nodeR * 1.4} dot />
        ) : (
          <GlowNode key={i} at={q.end} radius={nodeR} glow={1 - q.flash} swell={1 + 2.2 * q.flash} />
        ),
      )}
    </>
  );
};

/** A tire track's polyline on the road (x, z), its total length, and where it first crosses onto the row. */
type TrackPath = {pts: [number, number][]; cross: {x: number; z: number; u: number} | null};

/**
 * The five tracks (line 7, 🎭): each starts in the right lane up the road from the last (z0 = start −
 * spacing · k) and runs `length` m away from the camera, drifting right with growing speed to x = `end`; the `back` one
 * reaches the row and bends back into the lane.
 */
const trackPolylines = (
  n: number,
  back: number | null,
  o: {end: number; start: number; spacing: number; length: number},
): TrackPath[] =>
  [...Array(n).keys()].map((k) => {
    const {end} = o;
    const z0 = o.start - o.spacing * k;
    const len = o.length;
    const xs = H.lanes.right + 0.5;
    const rowMid = (G.x0 + G.x1) / 2;
    const pts: [number, number][] = [];
    const N = 60;
    for (let i = 0; i <= N; i++) {
      const u = i / N;
      const sm = (a: number) => a * a * (3 - 2 * a);
      const x =
        k === back
          ? u < 0.6
            ? xs + (rowMid - xs) * sm(u / 0.6)
            : rowMid + (H.lanes.right - 0.2 - rowMid) * sm((u - 0.6) / 0.4)
          : xs + (end - xs) * Math.pow(u, 1.7);
      pts.push([x, z0 - len * u]);
    }
    const i = pts.findIndex(([x]) => x >= G.x0);
    return {pts, cross: i > 0 ? {x: pts[i][0], z: pts[i][1], u: i / N} : null};
  });

/** A track drawn as a flat ink ribbon on the road (following the ground), revealed by `progress`. */
const TrackRibbon: React.FC<{path: TrackPath; progress: number; material: THREE.Material}> = ({
  path,
  progress,
  material,
}) => {
  const geometry = useMemo(() => {
    const W = 0.32;
    const pos: number[] = [];
    const idx: number[] = [];
    path.pts.forEach(([x, z], i) => {
      const [ax, az] = path.pts[Math.max(0, i - 1)];
      const [bx, bz] = path.pts[Math.min(path.pts.length - 1, i + 1)];
      const l = Math.hypot(bx - ax, bz - az) || 1;
      const nx = -(bz - az) / l;
      const nz = (bx - ax) / l;
      for (const sgn of [-1, 1]) {
        const px = x + (sgn * W * nx) / 2;
        const pz = z + (sgn * W * nz) / 2;
        pos.push(px, groundAt(px) + 0.012, pz);
      }
      if (i > 0) {
        const a = 2 * (i - 1);
        idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
      }
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setIndex(idx);
    return g;
  }, [path]);
  const total = (path.pts.length - 1) * 6;
  geometry.setDrawRange(0, Math.floor((total * Math.max(0, Math.min(1, progress))) / 6) * 6);
  return progress > 0 ? <mesh geometry={geometry} material={material} renderOrder={3} /> : null;
};

/** The ground's height across the cut (for placing things on the verge). */
export const highwayGroundAt = groundAt;
