import React, {useMemo} from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import * as THREE from 'three';
import {CAST_NEUTRAL, CITY, EXTRA_B, FPS, MOODS, type Mood} from '../theme';
import {GhostLines} from '../three/real/GhostCar';
import {CONE, PlateCameraPole, poleParts, irLevel, type PlateCameraKeys} from '../three/real/PlateCameraPole';
import {rackBounds} from '../three/real/RoofRack';
import {CAR_LAYOUT} from '../three/real/RealCar';
import {carToWorld, dashPhonePose, DrivingCar} from '../three/real/DrivingCar';
import {capSpeed, cappedTravel, wheelMode, wheelSmear, type WheelMode} from '../three/real/wheelMotion';
import type {RoadSignKind} from '../three/real/RoadSigns';
import {SIGN_SIZE} from '../three/real/RoadSigns';
import {CITY_LAYOUT, CITY_SIGN_SPOTS, CitySlice, cityIntersection, type SignalState} from '../three/section/CitySlice';
import {
  formatOf,
  projectToFrame,
  SECTION_ANGLE,
  sectionCameraAt,
  SectionCamera,
  type Framing,
} from '../three/section/SectionCamera';
import {SectionLights, SectionStage} from '../three/section/SectionStage';
import {skyTexture} from '../three/section/textures';
import {ease, framingAtKeys, type CameraKey} from './keyframes';
import {
  cabinetBox,
  cabinetLed,
  callRoute,
  ControllerCabinet,
  CountdownBox,
  countdownGhostLines,
  countdownSpot,
  COUNTDOWN_BOX,
  decisionRoute,
  ghostDigitLines,
  GlowCore,
  GlowHalo,
  InkBar,
  RoadShadow,
  LoopDetectors,
  loopRect,
  camRoute,
  camZone,
  DetectCam,
} from '../three/section/CityCountdown';
import {GlowNode, GlowPolyline, GlowSegment, pointAlong, polylineLength} from '../three/section/GlowLines';
import {EventPin} from '../three/real/CarPhoneKit';
import {countdownAt, tapeAt, type CityTape} from './cityCountdown';

type V3 = [number, number, number];
const C = CAR_LAYOUT;
const L = CITY_LAYOUT;

/** A whole car's length (bumper to bumper, `CarShell`) and its front bumper ahead of its middle. */
export const CITY_CAR_LENGTH = 4.8;
const HALF = CITY_CAR_LENGTH / 2;
/** How far behind the stop line's near edge the first car's front bumper stops (m). */
const LINE_GAP = 0.6;
/** A pedal stop from creep speed (s). */
const BRAKE_T = 0.9;

export type CityFraming =
  | 'lanes'
  | 'follow'
  | 'queue'
  | 'queueClose'
  | 'signal'
  | 'count'
  | 'car'
  | 'queueTape'
  | 'tape'
  | 'approach'
  | 'loopsWide'
  | 'loops';
/**
 * No. 015: framings round the plate-camera pole (`pole`), placed from the pole's spot, so they follow it and the stop
 * line. 'corner' (frame 0 and the loop: the pole on the right, YOU's car at the line in lane 3, between the title block
 * and the captions), 'poleClose' (the camera head top right, the car's tail and roof rack below it), 'plate' (the
 * plate and the camera head), 'poleSky' (the pole's head and the sky up and right of it: the ghost lookup), 'poleHead'
 * (the housing close: the cut-away).
 */
export type CityPoleFraming = 'corner' | 'poleClose' | 'plate' | 'poleSky' | 'poleHead';
const POLE_FRAMINGS: Record<CityPoleFraming, {d: V3; distance: number}> = {
  // offsets from the pole's foot (x across, y up, z along the street)
  corner: {d: [-2.2, 0.8, -3.8], distance: 28},
  poleClose: {d: [-2.4, 2.1, -2.8], distance: 12},
  plate: {d: [-2.6, 1.3, -2.6], distance: 8.5},
  poleSky: {d: [0.6, 3.6, -0.5], distance: 13},
  poleHead: {d: [-0.42, 2.75, 0], distance: 2.0},
};
const isPoleFraming = (n: string): n is CityPoleFraming => n in POLE_FRAMINGS;

/**
 * Framings at the fixed angle (metres), for the default stop line (35 m up the street); `cityFraming`
 * moves them with another. From this angle the street runs up and to the right of the frame, the cut
 * face at the bottom left. 'lanes' (W/MW: the stop line across lanes 2 and 3, a car on it ≈ 150 px wide,
 * the signal's heads at the top right, the next lane's approach below), 'follow' (MW: a car stopped at
 * the line in lane 2 and the one stopping a car-length behind it, ≈ 200 px wide), 'queue' (W: the street
 * in depth from the cut face, with the storm sewer and duct bank, to the stop line: a lane's five-car
 * queue whole, the last car near the lower left), 'queueClose' (MW: the five-car queue in lane 3
 * filling the frame's diagonal, the front car ≈ 75 px wide, the last ≈ 115 px, every lamp readable).
 */
export const CITY_FRAMINGS: Record<'lanes' | 'follow' | 'queue' | 'queueClose', Framing> = {
  lanes: {look: [7.15, 1.0, -30.95], distance: 56},
  follow: {look: [6.36, 1.0, -22.69], distance: 36},
  queue: {look: [9.13, 1.0, -15.74], distance: 72},
  queueClose: {look: [12.47, 1.0, -9.17], distance: 60},
};

/**
 * No. 019 (`light-countdown`): the framings of the two dressings ('china', 'us'), for the default stop line (35 m),
 * moved with another like 'lanes' (the tape framings, on the cut face, stay put). With a `dressing`, 'queue' and
 * 'queueClose' take these values (re-aimed for the tape); without one they keep No. 006's.
 *  - 'signal' (frame 0 and the loop): the stop line and the lane 2–3 queues, the heads and the countdown box upper right.
 *  - 'count': the heads and the box close (digits ≈ 80 px), the front cars' roofs below.
 *  - 'car': the phone car's tail and roof at the line (lane 3 front), the box top right, room on the left for a box.
 *  - 'queue': the queues and the air tape over their front (tape marks y ≈ 380–470; a detail box fits from y 504).
 *  - 'queueClose': the front of both queues and the heads, the green readable.
 *  - 'queueTape': a little wider than 'queue' (tape marks y ≈ 365–445).
 *  - 'tape': the air tape close (x ≈ 210–760, the cursor at y ≈ 610), the reporting roofs under it above y 1000.
 *  - 'approach' (US): lanes 2 and 3 approaching the line, the heads and the ghost box top right.
 *  - 'loopsWide' (US): the line and the loops, the approach behind, the heads, the cabinet small.
 *  - 'loops' (US): the loops, the lead-in, the cabinet cut open at the pole's foot, the heads at the top.
 */
export const COUNTDOWN_FRAMINGS: Record<Exclude<CityFraming, 'lanes' | 'follow'>, Framing> = {
  signal: {look: [5.6, 2.6, -40], distance: 48},
  count: {look: [4.2, 5.3, -49], distance: 25},
  car: {look: [5.4, 2.4, -38], distance: 40},
  queue: {look: [7.0, -1.7, -22], distance: 50},
  queueClose: {look: [8.0, 2.0, -30], distance: 38},
  queueTape: {look: [7.2, -2.2, -21], distance: 53},
  tape: {look: [5.6, 0.4, -28.4], distance: 46},
  approach: {look: [7.9, 2.6, -34.6], distance: 34},
  loopsWide: {look: [9.0, 1.2, -31], distance: 54},
  loops: {look: [8.3, 1.8, -36], distance: 38},
};
/** The framings that stay put whatever the stop line (the tape's, placed from its band). */
const ON_CUT_FACE = new Set<string>(['tape', 'queueTape', 'queue']);

/** A preset framing for a stop line `S` m up the street: 'lanes' and 'follow' move with the line, 'queue' widens. */
export const cityFraming = (
  name: CityFraming | CityPoleFraming,
  S = 35,
  pole?: CityPole | false,
  dressing?: CityDressing,
): Framing => {
  if (isPoleFraming(name)) {
    const [x, y, z] = poleSpot(pole, S);
    const f = POLE_FRAMINGS[name];
    return {look: [x + f.d[0], y + f.d[1], z + f.d[2]], distance: f.distance};
  }
  const lc = name !== 'lanes' && name !== 'follow' && (dressing || !(name in CITY_FRAMINGS));
  if (lc) {
    const f = COUNTDOWN_FRAMINGS[name as keyof typeof COUNTDOWN_FRAMINGS];
    if (ON_CUT_FACE.has(name)) return {look: f.look, distance: f.distance};
    return {look: [f.look[0], f.look[1], f.look[2] - (S - 35)], distance: f.distance};
  }
  const f = CITY_FRAMINGS[name as keyof typeof CITY_FRAMINGS] ?? CITY_FRAMINGS.lanes;
  const d = S - 35;
  if (name === 'queue' || name === 'queueClose')
    return {look: [f.look[0], f.look[1], f.look[2] - d * 0.6], distance: f.distance * (1 + d / 80)};
  return {look: [f.look[0], f.look[1], f.look[2] - d], distance: f.distance};
};

/**
 * One whole car on the street, driving away from the camera (never cut: drawn only once all of it is
 * behind the plane). Times are seconds into the scene.
 *
 * How it moves: with `liftAt` and `stopAt` it cruises at `speed`, lifts off at `liftAt` and slows
 * smoothly (sine-shaped deceleration, firmest midway) to rest at `stopAt`, at its stop point: the stop
 * line in its lane, or `gap` behind the car in front (the previous car in `cars` in the same lane). Its
 * place at the scene's start follows from that, so it always lands exactly. Without `liftAt` it just
 * cruises from `ahead`. Both times may be negative (already stopped at the scene's start).
 */
export type CityCar = {
  /** Lane 1 (left), 2 or 3 (right, nearest the camera). Default 2. */
  lane?: 1 | 2 | 3;
  /** Body: 'you' (YOU's car, YOU driving), 'mom' or 'extra' (grey traffic, an extra in `CAST_NEUTRAL` driving). Default 'extra'. */
  body?: 'you' | 'mom' | 'extra';
  /** Who drives (default: YOU in YOU's body, an extra otherwise); false for an empty car. */
  driver?: 'you' | 'extra' | false;
  /** Cruising speed before the lift, m/s (default 10 ≈ 22 mph; the street's limit is 25 mph = 11.2). */
  speed?: number;
  /** The front bumper's distance behind the plane at the scene's start, m (cruising cars only; default 12). */
  ahead?: number;
  /** When the driver lifts off the accelerator (s). With `stopAt`; omit both to cruise. */
  liftAt?: number;
  /** When the car is at rest at its stop point (s; default `liftAt` + 3.5). */
  stopAt?: number;
  /**
   * Its brake lamps without the pedal: 'auto' (lit while the car slows firmly, decelerating past
   * `lampThreshold`, and kept lit through the stop and the hold; they go dark again if it only slows
   * to a creep), or 'dark' (default: regen never lights them; only `brakeAt` does).
   */
  lamps?: 'auto' | 'dark';
  /** The driver presses the brake (s): the lamps light and stay lit (a creeping car also stops, over 0.9 s). */
  brakeAt?: number;
  /**
   * Instead of stopping at `stopAt`, it slows to a creep (true: 1.4 m/s ≈ 3 mph, or a speed in m/s) and
   * rolls on until `brakeAt` (default `stopAt` + 2), then stops at its stop point. Default false.
   */
  creep?: boolean | number;
  /** The gap to the car in front at rest, m (default the scene's `gap`). */
  gap?: number;
  /** The plate's invented characters (default one per car). */
  plate?: string;
  /**
   * Paint (a theme colour) and shape ('crossover' | 'sedan'). Default: YOU's car as built; an extra set to
   * `lamps: 'dark'` is charcoal (`CITY.charcoal`, so the dark-lamp car stands out); other extras take a
   * colour from `CITY.carBodies`; every third extra is a sedan (by its place in `cars`).
   */
  paint?: string;
  shape?: 'crossover' | 'sedan';
  /** No. 015: a roof rack on the roof (`RoofRack`, `CHARGE.cabinetDark`). Default false. */
  roofRack?: boolean;
  /**
   * No. 015: the plate's mark, a thin `orange` outline round the 3D plate, 2 cm proud of it (never on its face), on
   * keys: 'draw' (draws on clockwise over 0.4 s), 'pulse' (swells once, 0.5 s), 'off' (fades over 0.3 s). Default none.
   */
  plateMark?: {at: number; do: 'draw' | 'pulse' | 'off'}[];
  /**
   * No. 015: the driver's glances toward the signal (seconds), each held 1.0 s. No. 019: or `{at, to, hold}`, `to` 'signal'
   * (default) or 'phone' (the dash phone). Default none.
   */
  glances?: (number | {at: number; to?: 'signal' | 'phone'; hold?: number})[];
  /** No. 019 (N4): a phone on a dash clip mount, its screen to the driver, lit (true) or `{screen}` 0 → 1. Default none. */
  phone?: boolean | {screen?: number};
  /** No. 019: where the driver looks between glances: 'ahead' (default) or 'phone' (head down to the dash phone). */
  gaze?: 'ahead' | 'phone';
  /** No. 019: the extra's look: 'neutral' (default, `CAST_NEUTRAL`) or 'b' (`EXTRA_B`, a second named extra). */
  extraLook?: 'neutral' | 'b';
  /** No. 019 (N6): its driver uses the app: an orange node dot rides over its roof on the scene's `appDots` keys. */
  app?: boolean;
  /** No. 019 (N7): loop calls (s) for a car standing on a loop (a moving car calls by itself as its front wheels cross one). */
  calls?: number[];
  /**
   * No. 019 (F15): how it slows from `liftAt` to rest at `stopAt`: 'smooth' (default, as built: firmest midway) or
   * 'constant' (an even deceleration, v0 / (stopAt − liftAt), the speed falling in a straight line).
   */
  decel?: 'smooth' | 'constant';
  /**
   * No. 019 (F15): a cruising car that starts level with car `beside` (its index in `cars`): the same front-bumper distance
   * at the scene's start and, unless `speed` is given, the same speed. Overrides `ahead`.
   */
  beside?: number;
  /**
   * No. 015: the pull-away. Once at rest (after `stopAt`, or after a creep's pedal stop), the driver releases the brake
   * at `goAt` (the brake lamps go dark that frame) and the car pulls away up the street, speeding up smoothly to
   * `goSpeed` m/s (default 8 ≈ 18 mph) over `goRamp` s (default 3.5), wheels rolling forward, and drives on out of the
   * frame. Default none (it stays at rest). Key the signal's green (`signal` keys) just before it.
   */
  goAt?: number;
  goSpeed?: number;
  goRamp?: number;
};

/** No. 015 N1: the plate-camera pole on the right sidewalk (`PlateCameraPole`), its keys and its place. */
export type CityPole = PlateCameraKeys & {
  /** Across the street (default 12.6: the right sidewalk, 1.1 m in front of the buildings). */
  x?: number;
  /** How far before the stop line it stands, m (default 10). */
  before?: number;
  /** The car whose plate it watches and lights (index in `cars`; default YOU's car, else 0). */
  target?: number;
};

/** The pole's foot (world) for the scene's stop line. */
export const poleSpot = (pole: CityPole | false | undefined, S = 35): V3 => [
  pole ? (pole.x ?? 12.6) : 12.6,
  CITY_LAYOUT.grade,
  -S + (pole ? (pole.before ?? 10) : 10),
];

/** No. 015 N6: a lookup that doesn't happen, drawn as the § 3 ghost (dashed ink, never orange). */
export type CityGhost = {
  /** The dashed line starts drawing from the camera toward the cabinet (0.8 s). */
  at: number;
  /** The cabinet's dashed outline draws on (0.8 s). Default `at` + 0.8. */
  cabinetAt?: number;
  /** Both fade out (0.7 s, opacity only). Default never. */
  fadeAt?: number | null;
  /** The cabinet's foot relative to the camera head (m; default up and to the right in the sky). */
  offset?: V3;
  /** The cabinet's scale (1: 0.9 × 2.0 × 0.8 m, a symbol sized to read; default 0.8). */
  size?: number;
};

/** No. 019: the city slice's dressings (see `CitySliceSceneProps.dressing`). */
export type CityDressing = 'china' | 'us';

export type CitySign = {
  kind: RoadSignKind;
  /** The legend ('speed': [SPEED, LIMIT, nn]; 'oneway': [ONE, WAY]). */
  text: string[];
  /** Its centre line across (x) and its place along the street (z < 0); defaults per kind (`CITY_SIGN_SPOTS`). */
  x?: number;
  z?: number;
};

export type CitySliceSceneProps = {
  durationInFrames: number;
  /** Day (default) or Night. */
  mood?: Mood;
  /** Framing preset (default 'lanes'); the No. 015 pole framings follow `pole`. */
  framing?: CityFraming | CityPoleFraming;
  /** A custom move instead of a preset. */
  camera?: {from: Framing; to?: Framing};
  /** Camera keyframes (`log: true` for a steady dolly over a big range); override `camera` and `push`. */
  cameraKeys?: CameraKey[];
  /** Push, units/s (default 0). */
  push?: number;
  /** Idle sideways drift, ± units (default 0.08). */
  drift?: number;
  /** The cars on the street (default none). In a lane, list the front car first. */
  cars?: CityCar[];
  /** The stop line's near edge, metres up the street from the plane (default 35). The crosswalk, cross street and signal follow it. */
  stopLine?: number;
  /** The gap between cars at rest in a lane, m (default 4.8, one car length). */
  gap?: number;
  /** 'auto' lamps light past this deceleration, m/s² (default 1.3, UN R13-H's figure for regen), dark again under half of it. */
  lampThreshold?: number;
  /** The signal: one state ('red' default, 'green', 'yellow', 'off') or keys from `at` (s). */
  signal?: SignalState | {at: number; state: SignalState}[];
  /** The signs facing the camera (default: SPEED LIMIT 25 and ONE WAY on the left sidewalk, near the plane). [] for none. */
  signs?: CitySign[];
  /** Street trees on the left sidewalk (default true). */
  trees?: boolean;
  /** The shutter (fraction of a frame, default 0.5): the wheels' motion blur. */
  shutter?: number;
  /**
   * How the wheels turn (`three/real/wheelMotion.ts`): 'forward' (default: rolling forward, the visual turn capped
   * at 26° a frame above ≈ 4.9 m/s, the spokes smeared above it) or 'legacy' (posted videos only: No. 006 as
   * rendered, the wheels turning backward).
   */
  wheels?: WheelMode;
  /** No. 015 N1: the plate-camera pole (see `CityPole`). Default none. */
  pole?: CityPole | false;
  /** No. 015 N6: the ghost lookup (see `CityGhost`). Default none. */
  ghost?: CityGhost | null;
  /**
   * No. 019: the street's dressing. 'china' (N1): the countdown box beside the middle head, no signs (unless `signs`),
   * blank plates. 'us' (N2): the loops in lanes 2 and 3, their lead-ins and pull box, the controller cabinet cut open at
   * the mast pole's foot, blank plates, the default signs. Each also moves 'queue' / 'queueClose' to No. 019's values and
   * makes its own slide location (`city-china`, `city-us`). Default none (No. 006 / No. 015 as built).
   */
  dressing?: CityDressing;
  /** No. 019: 'blank' plates (neutral, no characters). Default: the dressing's ('blank'), else invented characters. */
  plates?: 'blank' | 'text';
  /** No. 019 (N3): the countdown box's offset from the signal keys (s; default 0, the same second as the app). */
  countdownOffset?: number;
  /**
   * No. 019 (N9): the countdown box that isn't there, as the § 3 ghost (dashed ink, 3 px, dash 16 / gap 10 px): it draws
   * on over 0.8 s from `at`, fades over 0.7 s from `fadeAt`. `digits` (§ 3 ghost digits): dashed seven-segment outlines
   * (dash 8 / gap 5 px), each whole over 3 frames at its `at`, out over 3 frames as the next comes in; the last goes out
   * over 6 frames at `digitsOutAt` (default its `at` + 0.32). Default none.
   */
  ghostBox?: {at: number; fadeAt?: number | null; digits?: {at: number; d: number}[]; digitsOutAt?: number} | null;
  /**
   * No. 019 (N7): the cabinet decides to end the green: its LED flashes and a pulse runs from the cabinet to the mast pole,
   * up it and along the arm to the heads (`decideFor` s, default 0.5; from the near corner the route crosses the street,
   * so 0.9 reads better). The yellow comes on its own `signal` key.
   */
  decideAt?: number | number[];
  decideFor?: number;
  /**
   * No. 019 (N7): which loop calls show: 'auto' (default: every car whose front wheels cross onto a loop, plus the `calls`
   * keys) or 'keys' (only the cars' `calls` keys, e.g. a scene about the yellow where the calls would distract).
   */
  loopCalls?: 'auto' | 'keys';
  /**
   * No. 019 (owner note): a video-detection camera on the mast arm ('us' dressing), aimed down the approach. `true`: it
   * watches lane 3; `{lanes}`: the lanes it watches. Those lanes call by the camera (a faint ink zone on the lane, and an
   * orange pulse from the camera along the arm, down the mast and on to the cabinet); their loop sawcuts are left out, and
   * the other lanes keep their loops. A car's `calls` keys use its lane's detector; `loopCalls: 'keys'` applies to both.
   * Default none.
   */
  detectCam?: boolean | {lanes?: number[]};
  /** No. 019 (N2): where the cabinet stands, 'near' (default: the near right corner, by the loops) or 'pole' (the mast pole's foot). */
  cabinetAt?: 'near' | 'pole';
  /**
   * No. 019 (N6): the app cars' dots: they light over 0.3 s at `at`, each pulses once at `reportAt`, and each fades over
   * 1.0 s once its car has left the frame. Default none.
   */
  appDots?: {at: number; reportAt?: number} | null;
  /** No. 019 (N6): the time tape on the front cut face (see `CityTape` in `cityCountdown.ts`). Default none. */
  tape?: CityTape | null;
  /**
   * The loop (No. 015 N5): every car's wheel turn and driver's idle are solved so that the frame after the last one
   * equals frame 0 of a scene with the same car keys starting at 0 (wheel angles modulo the 5-spoke pitch). Key the cars
   * so their position, speed and lamps match frame 0, and set `drift: 0`. Default false.
   */
  loop?: boolean;
  location?: string;
  transition?: 'auto' | 'continue' | 'glide' | 'cut' | 'dissolve' | 'slide' | 'follow';
  follow?: {direction?: 'down' | 'up' | 'left' | 'right'; at?: number};
  glide?: number;
  /** Set by Explainer. */
  startFrame?: number;
  cameraFrom?: Framing;
  cameraGlide?: number;
};

export const DEFAULT_CITY_SIGNS: CitySign[] = [
  {kind: 'oneway', text: ['ONE', 'WAY']},
  {kind: 'speed', text: ['SPEED', 'LIMIT', '25']},
];
const PLATES = ['7HNC 418', '5LRT 902', '6DWE 335', '8JPA 160', '4KMS 571', '9TBG 247', '3VXF 683'];

const cityCameraMove = (p: Partial<CitySliceSceneProps>, durationInFrames: number, fps: number, frame?: number) => {
  const base = p.camera?.from ?? cityFraming(p.framing ?? 'lanes', p.stopLine ?? 35, p.pole, p.dressing);
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

export const cityCameraStart = (p: Partial<CitySliceSceneProps>, d: number, fps: number): Framing =>
  cityCameraMove({...p, cameraFrom: undefined, cameraGlide: undefined}, d, fps, 0).from;
export const cityCameraEnd = (p: Partial<CitySliceSceneProps>, d: number, fps: number): Framing =>
  cityCameraMove(p, d, fps).to;

/** The camera state at a frame (for anchors on T). */
export const cityCameraAt = (
  p: Partial<CitySliceSceneProps>,
  o: {frame: number; fps: number; durationInFrames: number},
) => {
  const {from, to, pre} = cityCameraMove(p, o.durationInFrames, o.fps, o.frame);
  return sectionCameraAt({
    from,
    to,
    pre,
    frame: o.frame,
    fps: o.fps,
    durationInFrames: o.durationInFrames,
    drift: p.drift ?? 0.08,
    clockOffset: (p.startFrame ?? 0) / o.fps,
    format: formatOf(p),
  });
};

/** Smoothstep, and the distance still to go (in units of v·T) from u to the end of a smoothstep slow-down. */
const s3 = (u: number) => u * u * (3 - 2 * u);
const left = (u: number) => 0.5 - u + u ** 3 - u ** 4 / 2;
const clamp01 = (u: number) => Math.max(0, Math.min(1, u));

/** One car's motion plan: times, speeds and its rest point (front bumper z). */
type Plan = {
  x: number;
  rest: number;
  cruise: boolean;
  ahead: number;
  v0: number;
  vc: number;
  tL: number;
  tS: number;
  tB: number | null;
  creep: boolean;
  /** The pull-away: when, to what speed, over how long (null: none). */
  go: {at: number; v: number; ramp: number} | null;
  /** No. 019: an even deceleration from tL to tS (no creep). */
  constant: boolean;
};

/** Each car's plan: its lane's x and its rest point (the line, or `gap` behind the car in front). */
export const cityPlans = (p: Partial<CitySliceSceneProps>): Plan[] => {
  const S = p.stopLine ?? 35;
  const lastRest: Record<number, number> = {};
  const cars = p.cars ?? [];
  const plans = cars.map((c): Plan => {
    const lane = c.lane ?? 2;
    const x = L.lanes[lane - 1] ?? L.lanes[1];
    const gap = c.gap ?? p.gap ?? CITY_CAR_LENGTH;
    const front = lastRest[lane];
    const rest = front === undefined ? -S + LINE_GAP : front + CITY_CAR_LENGTH + gap;
    const cruise = c.liftAt === undefined && c.stopAt === undefined;
    if (!cruise) lastRest[lane] = rest;
    const tS0 = c.stopAt ?? (c.liftAt ?? 0) + 3.5;
    // a pull-away keyed before the stop means the car was already at rest by then (No. 019 review: such a car used to
    // ignore its `goAt` and stay parked while the cars behind drove through it)
    const early = c.goAt !== undefined && !(c.creep !== undefined && c.creep !== false) && c.goAt < tS0;
    const tS = early ? (c.goAt as number) - 0.05 : tS0;
    const tL = Math.min(c.liftAt ?? tS - 3.5, tS - 0.1);
    const creep = c.creep !== undefined && c.creep !== false;
    const constant = c.decel === 'constant' && !creep;
    const vc = creep ? (typeof c.creep === 'number' ? c.creep : 1.4) : 0;
    const tB = c.brakeAt ?? null;
    return {
      x,
      rest,
      cruise,
      ahead: c.ahead ?? 12,
      v0: c.speed ?? 10,
      vc,
      tL,
      tS,
      tB: creep ? Math.max(tS, tB ?? tS + 2) : tB,
      creep,
      go:
        c.goAt === undefined || cruise
          ? null
          : {at: c.goAt, v: Math.max(0.5, c.goSpeed ?? 8), ramp: Math.max(0.5, c.goRamp ?? 3.5)},
      constant,
    };
  });
  // No. 019: a cruising car `beside` another starts level with it (its front at the scene's start) at its speed
  return plans.map((k, i) => {
    const b = cars[i]?.beside;
    const o = b === undefined ? undefined : plans[b];
    if (!k.cruise || !o || b === i) return k;
    const front = o.cruise ? -o.ahead : o.rest + restMotion(o, 0).togo;
    return {...k, ahead: -front, v0: cars[i].speed ?? o.v0};
  });
};

/** Distance still to go to rest (m), speed (m/s) and deceleration (m/s², slowing +) at t. */
const restMotion = (k: Plan, t: number) => {
  if (k.cruise) return {togo: Infinity, v: k.v0, a: 0};
  const T = k.tS - k.tL;
  const vTop = k.v0 - k.vc;
  // after the slow-down: the creep and the pedal stop (creeping cars), else at rest
  const tB = k.creep && k.tB !== null ? k.tB : k.tS;
  const brakeLeft = k.creep ? k.vc * BRAKE_T * 0.5 : 0;
  const creepLeft = k.creep ? k.vc * (tB - k.tS) : 0;
  if (k.creep && t >= tB) {
    const w = clamp01((t - tB) / BRAKE_T);
    return {togo: k.vc * BRAKE_T * left(w), v: k.vc * (1 - s3(w)), a: w < 1 ? (k.vc / BRAKE_T) * 6 * w * (1 - w) : 0};
  }
  if (t >= k.tS) {
    if (!k.creep) return {togo: 0, v: 0, a: 0};
    return {togo: brakeLeft + k.vc * (tB - t), v: k.vc, a: 0};
  }
  const after = brakeLeft + creepLeft;
  if (k.constant) {
    // No. 019 (F15): an even deceleration v0 / T from tL to rest at tS
    if (t >= k.tL) {
      const r = k.tS - t;
      return {togo: (k.v0 * r * r) / (2 * T), v: (k.v0 * r) / T, a: k.v0 / T};
    }
    return {togo: (k.v0 * T) / 2 + k.v0 * (k.tL - t), v: k.v0, a: 0};
  }
  if (t >= k.tL) {
    const u = (t - k.tL) / T;
    return {
      togo: after + k.vc * T * (1 - u) + vTop * T * left(u),
      v: k.vc + vTop * (1 - s3(u)),
      a: (vTop / T) * 6 * u * (1 - u),
    };
  }
  return {togo: after + k.vc * T + vTop * T * 0.5 + k.v0 * (k.tL - t), v: k.v0, a: 0};
};

/**
 * As `restMotion`, plus the pull-away (`goAt`): from rest, a smoothstep rise to `goSpeed` over `goRamp`, then a steady
 * cruise; the distance goes negative (past the rest point, up the street). Applies only once the car is at rest.
 */
const motion = (k: Plan, t: number) => {
  const m = restMotion(k, t);
  const g = k.go;
  if (!g || t < g.at) return m;
  const atGo = restMotion(k, g.at);
  if (atGo.togo > 1e-6 || atGo.v > 1e-6) return m;
  const u = (t - g.at) / g.ramp;
  const dist = u < 1 ? g.v * g.ramp * (u ** 3 - u ** 4 / 2) : g.v * g.ramp * 0.5 + g.v * (t - g.at - g.ramp);
  const v = u < 1 ? g.v * s3(u) : g.v;
  const a = u < 1 ? -((g.v / g.ramp) * 6 * u * (1 - u)) : 0;
  return {togo: -dist, v, a};
};

/** When the 'auto' lamps light (the deceleration first passes `th`) and go dark again (it falls under th/2), or null. */
const regenWindow = (k: Plan, th: number) => {
  if (k.cruise) return null;
  const T = k.tS - k.tL;
  if (k.constant) return (k.v0 / T) > th ? {on: k.tL, off: Infinity} : null;
  const A = (k.v0 - k.vc) / T;
  // deceleration 6A·u(1 − u): first above th at u1, back under th/2 at u2
  const cross = (a: number, late: boolean) => {
    const d = 1 - (4 * a) / (6 * A);
    if (d < 0) return null;
    return (late ? 1 + Math.sqrt(d) : 1 - Math.sqrt(d)) / 2;
  };
  const u1 = cross(th, false);
  if (u1 === null) return null;
  const u2 = cross(th / 2, true) ?? 1;
  return {on: k.tL + u1 * T, off: k.creep ? k.tL + u2 * T : Infinity};
};

/** One car at t: its middle (x, z), front bumper z, speed, metres driven since the start, lamps 0 → 1, drawn or not. */
export const cityCarAt = (p: Partial<CitySliceSceneProps>, i: number, t: number, fps = 30) => {
  const plans = cityPlans(p);
  const k = plans[i];
  const c = (p.cars ?? [])[i];
  if (!k || !c) return null;
  const th = p.lampThreshold ?? 1.3;
  const mo = motion(k, t);
  const front = k.cruise ? -(k.ahead + k.v0 * t) : k.rest + mo.togo;
  const travelled = k.cruise ? k.v0 * t : motion(k, 0).togo - mo.togo;
  const win = (c.lamps ?? 'dark') === 'auto' ? regenWindow(k, th) : null;
  // lit at an instant: by the pedal from brakeAt, or by regen in its window; LEDs, so a 2-frame rise
  // the pull-away releases the brake: dark from `goAt` on
  const restAtGo = k.go ? restMotion(k, k.go.at) : null;
  const goAt = k.go && restAtGo && restAtGo.togo <= 1e-6 && restAtGo.v <= 1e-6 ? k.go.at : Infinity;
  const litAt = (tt: number) =>
    tt < goAt && ((c.brakeAt !== undefined && tt >= c.brakeAt) || (win !== null && tt >= win.on && tt < win.off)) ? 1 : 0;
  const lamp = [0, 1, 2].reduce((a, j) => a + litAt(t - (j * 1) / fps), 0) / 3;
  const z = front + HALF;
  return {
    x: k.x,
    z,
    front,
    rear: front + CITY_CAR_LENGTH,
    speed: mo.v,
    decel: mo.a,
    travelled,
    lamp,
    drawn: front + CITY_CAR_LENGTH < -0.05,
  };
};

/** The plate's centre on a whole car (car-local: behind the rear bumper's face, `CarShell`), and its outline's size. */
const PLATE_LOCAL: V3 = [-2.405, 0.735, 0];
const PLATE_MARK = {x: -2.43, w: 0.38, h: 0.22};

/** The car the pole watches (index in `cars`), or -1. */
const poleTarget = (p: Partial<CitySliceSceneProps>) => {
  if (!p.pole) return -1;
  if (p.pole.target !== undefined) return p.pole.target;
  const k = (p.cars ?? []).findIndex((c) => c.body === 'you');
  return k >= 0 ? k : (p.cars ?? []).length ? 0 : -1;
};

/** Where the pole's camera points: its target car's plate at rest (or a spot in lane 3 at the stop line). */
const poleAim = (p: Partial<CitySliceSceneProps>): V3 => {
  const S = p.stopLine ?? 35;
  const k = poleTarget(p);
  const plan = k >= 0 ? cityPlans(p)[k] : undefined;
  const x = plan ? plan.x : L.lanes[2];
  const front = plan && !plan.cruise ? plan.rest : -S + LINE_GAP;
  return carToWorld(PLATE_LOCAL, {x, z: front + HALF, yaw: 0});
};

/** The pole's parts (world) for a scene, or null without a pole. */
export const cityPoleParts = (p: Partial<CitySliceSceneProps>) =>
  p.pole ? poleParts(poleSpot(p.pole, p.stopLine ?? 35), poleAim(p)) : null;

/** The ghost cabinet's corners (world): foot (min) and top (max), or null. */
const ghostBox = (p: Partial<CitySliceSceneProps>): {a: V3; b: V3; from: V3} | null => {
  const g = p.ghost;
  const parts = cityPoleParts(p);
  if (!g || !parts) return null;
  const k = g.size ?? 0.8;
  const o = g.offset ?? [1.4, 1.6, 0.6];
  const h = parts.housing;
  const a: V3 = [h[0] + o[0], h[1] + o[1], h[2] + o[2]];
  return {a, b: [a[0] + 0.9 * k, a[1] + 2.0 * k, a[2] - 0.8 * k], from: parts.housing};
};

/**
 * A named point of T in the world at t: 'car:k' (car k's roof, 0-based in `cars`), 'lamps:k' (the middle
 * of its rear, at the lamps' height), 'youSpot' (YOU's car roof, for the name tag), 'signal' (the middle lane's head), 'stopLine' (its middle),
 * 'sign:oneway' | 'sign:speed' (the panel's middle). No. 015: 'plate[:k]', 'rack[:k]', 'tail[:k]' (YOU's car by default),
 * the pole's 'lens', 'ledRing', 'antenna', 'modem', 'battery', 'housing', 'pole' (= 'panel'), and 'ghost' (the ghost
 * cabinet's front face). Cars only while drawn.
 */
export const cityAnchorPoint = (p: Partial<CitySliceSceneProps>, anchor: string, t: number): V3 | undefined => {
  const [name, arg] = anchor.split(':');
  const S = p.stopLine ?? 35;
  const I = cityIntersection(S);
  switch (name) {
    case 'car':
    case 'lamps': {
      const c = cityCarAt(p, Number(arg ?? 0), t);
      if (!c || !c.drawn) return undefined;
      return carToWorld(name === 'car' ? [-0.4, 1.78, 0] : [-2.4, 0.93, 0], {x: c.x, z: c.z, yaw: 0});
    }
    case 'youSpot': {
      // the roof of YOU's car (the first car with body 'you'), for YOU's name tag
      const k = (p.cars ?? []).findIndex((q) => q.body === 'you');
      const c = k < 0 ? null : cityCarAt(p, k, t);
      return c && c.drawn ? carToWorld([-0.4, 1.78, 0], {x: c.x, z: c.z, yaw: 0}) : undefined;
    }
    case 'plate':
    case 'rack':
    case 'tail': {
      // a car's plate, roof rack (its rear crossbar's middle) or tail (YOU's car by default)
      const k = arg !== undefined ? Number(arg) : (p.cars ?? []).findIndex((q) => q.body === 'you');
      const c = k < 0 ? null : cityCarAt(p, k, t);
      if (!c || !c.drawn) return undefined;
      const local: V3 =
        name === 'plate' ? PLATE_LOCAL : name === 'rack' ? [-1.42, rackBounds()[1][1], 0] : [-2.3, 1.2, 0];
      return carToWorld(local, {x: c.x, z: c.z, yaw: 0});
    }
    case 'lens':
    case 'ledRing':
    case 'antenna':
    case 'modem':
    case 'battery':
    case 'housing':
    case 'pole':
    case 'panel': {
      const q = cityPoleParts(p);
      if (!q) return undefined;
      return name === 'lens'
        ? q.lens
        : name === 'ledRing'
          ? q.ring
          : name === 'antenna'
            ? q.antenna
            : name === 'modem'
              ? q.modem
              : name === 'battery'
                ? q.battery
                : name === 'housing'
                  ? q.housing
                  : q.panel;
    }
    case 'ghost': {
      const g = ghostBox(p);
      // the middle of the cabinet's front face (a callout's leader starts there)
      return g ? [(g.a[0] + g.b[0]) / 2, (g.a[1] + g.b[1]) / 2, g.a[2]] : undefined;
    }
    case 'phone':
      return phoneAt(p, arg, t);
    case 'countdown':
    case 'ghostBox': {
      // the box's front face (its middle), or its top edge (`countdown:top`) for a label above it
      const [x, y, z] = countdownSpot(S);
      return [x, arg === 'top' ? y + COUNTDOWN_BOX.h / 2 : y, z + COUNTDOWN_BOX.d / 2];
    }
    case 'cabinet': {
      const b = cabinetBox(S, p.cabinetAt);
      return [(b.min[0] + b.max[0]) / 2, b.max[1], b.max[2]];
    }
    case 'led':
      return cabinetLed(S, p.cabinetAt);
    case 'loop': {
      const r = loopRect(S, Number(arg ?? 3));
      return [(r.x[0] + r.x[1]) / 2, 0, (r.z[0] + r.z[1]) / 2];
    }
    case 'cursor':
    case 'marker':
    case 'tape': {
      if (!p.tape) return undefined;
      const st = tapeAt(p.tape, p.cars ?? [], (p.startFrame ?? 0) / FPS, t);
      const x = name === 'cursor' ? st.cursorX : name === 'marker' ? st.predict?.x : (st.x[0] + st.x[1]) / 2;
      return x === undefined ? undefined : tapeWorld(st, x, 0, 0.005);
    }
    case 'signal':
      return [L.lanes[1], I.signal.headY, I.signal.z];
    case 'stopLine':
      return [(L.road[0] + L.road[1]) / 2, 0, (I.stopNear + I.stopFar) / 2];
    case 'sign': {
      const s = (p.signs ?? (p.dressing === 'china' ? [] : DEFAULT_CITY_SIGNS)).find((q) => q.kind === arg);
      if (!s) return undefined;
      const spot = CITY_SIGN_SPOTS[s.kind] ?? {x: 11.3, z: -9};
      return [s.x ?? spot.x, 84 * 0.0254 + SIGN_SIZE[s.kind].h / 2, s.z ?? spot.z];
    }
    default:
      return undefined;
  }
};

/** No. 019: the dressing's parts on (defaults per `dressing`, see the props). */
const camLanesOf = (p: Partial<CitySliceSceneProps>) =>
  p.dressing === 'us' && p.detectCam ? (typeof p.detectCam === 'object' ? (p.detectCam.lanes ?? [3]) : [3]) : [];

export const cityDress = (p: Partial<CitySliceSceneProps>) => ({
  countdown: p.dressing === 'china',
  /** The lanes the camera watches (no loop there). */
  camLanes: camLanesOf(p),
  loops: p.dressing === 'us' ? [2, 3].filter((l) => !camLanesOf(p).includes(l)) : [],
  cabinet: p.dressing === 'us',
  blank: (p.plates ?? (p.dressing ? 'blank' : 'text')) === 'blank',
});

/** No. 019 (N3): the countdown box's state at t (the same timeline the 'light-app' detail box reads). */
export const cityCountdownAt = (p: Partial<CitySliceSceneProps>, t: number, offset = p.countdownOffset ?? 0) =>
  countdownAt(p.signal, t, offset);

/** No. 019 (N4): the dash phone's centre (world) on car k (default: the first car with a phone) at t, while drawn. */
const phoneAt = (p: Partial<CitySliceSceneProps>, arg: string | undefined, t: number): V3 | undefined => {
  const cars = p.cars ?? [];
  const k = arg !== undefined ? Number(arg) : cars.findIndex((q) => !!q.phone);
  const c = k < 0 ? null : cityCarAt(p, k, t);
  if (!c || !c.drawn || !cars[k]?.phone) return undefined;
  return carToWorld(dashPhonePose(carShape(cars[k], k)).centre, {x: c.x, z: c.z, yaw: 0});
};

/** A car's shape as drawn (its own, else every third extra a sedan). */
const carShape = (c: CityCar, i: number) => c.shape ?? ((c.body ?? 'extra') === 'extra' && i % 3 === 1 ? 'sedan' : 'crossover');

/**
 * No. 019 (N7): every loop call in the scene, in time order: a moving car calls when its front wheels cross onto a loop
 * in its lane (sampled each frame over the scene), a standing one on its `calls` keys.
 */
export const cityCalls = (p: Partial<CitySliceSceneProps>, durationInFrames: number, fps: number) => {
  const dress = cityDress(p);
  const lanes = [...dress.loops, ...dress.camLanes];
  if (!lanes.length) return [];
  const S = p.stopLine ?? 35;
  const out: {lane: number; at: number; by: 'loop' | 'cam'}[] = [];
  (p.cars ?? []).forEach((c, i) => {
    const lane = c.lane ?? 2;
    if (!lanes.includes(lane)) return;
    const by = dress.camLanes.includes(lane) ? ('cam' as const) : ('loop' as const);
    (c.calls ?? []).forEach((at) => out.push({lane, at, by}));
    if (p.loopCalls === 'keys') return;
    const edge = by === 'cam' ? camZone(S, lane).z[1] : loopRect(S, lane).z[1];
    let prev: number | null = null;
    for (let f = 0; f <= durationInFrames; f++) {
      const at = cityCarAt(p, i, f / fps, fps);
      if (!at) break;
      const axle = at.z - CAR_LAYOUT.axleX.front;
      if (prev !== null && prev > edge && axle <= edge) {
        out.push({lane, at: f / fps, by});
        break;
      }
      prev = axle;
    }
  });
  return out.sort((a, b) => a.at - b.at);
};

/** No. 019 (N6): when each car's roof first leaves the frame (s), or Infinity (sampled each frame over the scene). */
const leaveTimes = (p: Partial<CitySliceSceneProps>, durationInFrames: number, fps: number) =>
  (p.cars ?? []).map((c, i) => {
    if (!c.app) return Infinity;
    let wasIn = false;
    for (let f = 0; f <= durationInFrames; f++) {
      const t = f / fps;
      const a = cityCarAt(p, i, t, fps);
      if (!a) return Infinity;
      const w = carToWorld([-0.4, 2.2, 0], {x: a.x, z: a.z, yaw: 0});
      const q = projectToFrame(cityCameraAt(p, {frame: f, fps, durationInFrames}), w);
      const inFrame = a.drawn && q[0] >= 0 && q[0] <= 1080 && q[1] >= 0 && q[1] <= 1920;
      if (inFrame) wasIn = true;
      else if (wasIn) return t;
    }
    return Infinity;
  });

/** A named point of T on screen (px) at this frame (see `cityAnchorPoint`). */
export const cityAnchorOnScreen = (
  p: Partial<CitySliceSceneProps>,
  anchor: string,
  o: {frame: number; fps: number; durationInFrames: number},
): [number, number] | undefined => {
  const w = cityAnchorPoint(p, anchor, o.frame / o.fps);
  return w ? projectToFrame(cityCameraAt(p, o), w) : undefined;
};

/** The signal's state at t. */
export const citySignalAt = (p: Partial<CitySliceSceneProps>, t: number): SignalState => {
  const s = p.signal ?? 'red';
  if (typeof s === 'string') return s;
  const ks = [...s].sort((a, b) => a.at - b.at);
  let cur: SignalState = ks[0]?.state ?? 'red';
  for (const k of ks) if (t >= k.at) cur = k.state;
  return cur;
};

/** A plate mark's state at t: drawn share (0 → 1), its swell (0 → 1 → 0 on a pulse) and strength. */
const plateMarkAt = (keys: CityCar['plateMark'], t: number) => {
  let draw = 0;
  let glow = 0;
  let swell = 0;
  for (const k of [...(keys ?? [])].sort((a, b) => a.at - b.at)) {
    if (t < k.at) break;
    if (k.do === 'draw') {
      draw = ease(t, k.at, k.at + 0.4);
      glow = 1;
    } else if (k.do === 'pulse') {
      if (draw === 0) draw = 1;
      glow = 1;
      swell = t < k.at + 0.5 ? Math.sin((Math.PI * (t - k.at)) / 0.5) : 0;
    } else {
      glow = glow * (1 - ease(t, k.at, k.at + 0.3));
      swell = 0;
    }
  }
  return {draw, glow, swell};
};

/** The plate's outline (car-local), clockwise from the top-left as seen from behind, closed. */
const plateRect = (k: number): V3[] => {
  const w = (PLATE_MARK.w / 2) * k;
  const h = (PLATE_MARK.h / 2) * k;
  const y = PLATE_LOCAL[1];
  return [
    [PLATE_MARK.x, y + h, -w],
    [PLATE_MARK.x, y + h, w],
    [PLATE_MARK.x, y - h, w],
    [PLATE_MARK.x, y - h, -w],
    [PLATE_MARK.x, y + h, -w],
  ];
};

/** The ghost cabinet's dashed lines (world): front face, two drawer seams, the top and the right side's edges. */
const ghostCabinet = (a: V3, b: V3): V3[][] => {
  const [x0, y0, z1] = a;
  const [x1, y1, z0] = b;
  const d1 = y0 + (y1 - y0) / 3;
  const d2 = y0 + (2 * (y1 - y0)) / 3;
  return [
    [
      [x0, y0, z1],
      [x0, y1, z1],
      [x1, y1, z1],
      [x1, y0, z1],
      [x0, y0, z1],
    ],
    [
      [x0, d1, z1],
      [x1, d1, z1],
    ],
    [
      [x0, d2, z1],
      [x1, d2, z1],
    ],
    [
      [x0, y1, z1],
      [x0, y1, z0],
      [x1, y1, z0],
      [x1, y1, z1],
    ],
    [
      [x1, y1, z0],
      [x1, y0, z0],
      [x1, y0, z1],
    ],
  ];
};

/** Convex hull of screen points (monotone chain), counter-clockwise. */
const hull2 = (pts: [number, number][]): [number, number][] => {
  const p = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o: [number, number], a: [number, number], b: [number, number]) =>
    (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower: [number, number][] = [];
  for (const q of p) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], q) <= 0) lower.pop();
    lower.push(q);
  }
  const upper: [number, number][] = [];
  for (const q of [...p].reverse()) {
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], q) <= 0) upper.pop();
    upper.push(q);
  }
  return [...lower.slice(0, -1), ...upper.slice(0, -1)];
};
/** Inside a convex polygon (either winding). */
const inConvex = (poly: [number, number][], q: [number, number]) => {
  let sign = 0;
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i];
    const b = poly[(i + 1) % poly.length];
    const c = (b[0] - a[0]) * (q[1] - a[1]) - (b[1] - a[1]) * (q[0] - a[0]);
    if (Math.abs(c) < 1e-9) continue;
    if (sign === 0) sign = Math.sign(c);
    else if (Math.sign(c) !== sign) return false;
  }
  return poly.length >= 3;
};

/**
 * The IR cone's stretches to draw (shares of its length, lens → plate), from the camera: only where the cone (its axis
 * and its rim) stays clear of every drawn car's silhouette on screen, plus the cap where it lands on the target plate
 * (inside the plate's outline). So the cone never tints a body, glass or driver (§ 5 no spill, ruling v0.18.7).
 */
const coneSpansFor = (
  cam: Parameters<typeof projectToFrame>[0],
  lens: V3,
  plate: V3,
  cars: {x: number; z: number}[],
  target: {x: number; z: number} | null,
): [number, number][] => {
  const box: V3[] = [];
  for (const x of [-2.42, 2.42]) for (const y of [0.15, 1.9]) for (const z of [-0.98, 0.98]) box.push([x, y, z]);
  const hulls = cars.map((c) => hull2(box.map((q) => projectToFrame(cam, carToWorld(q, {x: c.x, z: c.z, yaw: 0})))));
  const plateQuad = target
    ? hull2(
        [
          [PLATE_LOCAL[0], PLATE_LOCAL[1] + 0.076, -0.152],
          [PLATE_LOCAL[0], PLATE_LOCAL[1] + 0.076, 0.152],
          [PLATE_LOCAL[0], PLATE_LOCAL[1] - 0.076, 0.152],
          [PLATE_LOCAL[0], PLATE_LOCAL[1] - 0.076, -0.152],
        ].map((q) => projectToFrame(cam, carToWorld(q as V3, {x: target.x, z: target.z, yaw: 0}))),
      )
    : null;
  const N = 96;
  const ok: boolean[] = [];
  for (let i = 0; i <= N; i++) {
    const u = i / N;
    const c: V3 = [lens[0] + (plate[0] - lens[0]) * u, lens[1] + (plate[1] - lens[1]) * u, lens[2] + (plate[2] - lens[2]) * u];
    const r = CONE.r0 + (CONE.r1 - CONE.r0) * u;
    const ring: V3[] = [c, [c[0] + r, c[1], c[2]], [c[0] - r, c[1], c[2]], [c[0], c[1] + r, c[2]], [c[0], c[1] - r, c[2]]];
    const scr = ring.map((q) => projectToFrame(cam, q));
    const onPlate = !!plateQuad && scr.every((q) => inConvex(plateQuad, q));
    const blocked = scr.some((q) => hulls.some((h) => inConvex(h, q)));
    ok.push(onPlate || !blocked);
  }
  const spans: [number, number][] = [];
  let start = -1;
  for (let i = 0; i <= N; i++) {
    if (ok[i] && start < 0) start = i;
    if ((!ok[i] || i === N) && start >= 0) {
      const end = ok[i] ? i : i - 1;
      if (end > start) spans.push([start / N, end / N]);
      start = -1;
    }
  }
  // the cap: the last 8 cm always lands on the plate (its foot is inside the plate's outline), so a pulse reads there
  if (target) {
    const L = Math.hypot(plate[0] - lens[0], plate[1] - lens[1], plate[2] - lens[2]);
    const capFrom = Math.max(0, 1 - 0.08 / Math.max(0.08, L));
    const last = spans[spans.length - 1];
    if (last && last[1] >= 1 - 1e-6) last[0] = Math.min(last[0], capFrom);
    else spans.push([capFrom, 1]);
  }
  return spans;
};

/** No. 019 (N7): a pulse riding a route: a short bright stretch (0.9 m) with a node-dot head, at share `u` (0 → 1). */
const Pulse: React.FC<{route: V3[]; u: number; r: number}> = ({route, u, r}) => {
  if (u <= 0 || u > 1.25) return null;
  const len = polylineLength(route);
  const head = Math.min(1, u);
  const tail = Math.max(0, head - 0.9 / len);
  const glow = u <= 1 ? 1 : 1 - (u - 1) / 0.25;
  const pts = [...Array(9).keys()].map((k) => pointAlong(route, tail + ((head - tail) * k) / 8));
  return (
    <group>
      <GlowPolyline points={pts} radius={r} glow={glow} />
      <GlowNode at={pointAlong(route, head)} radius={r * 1.95} glow={glow} dot />
    </group>
  );
};

/** The first yellow key after t0 (s), or null. */
const nextYellow = (p: Partial<CitySliceSceneProps>, t0: number) => {
  const s = p.signal;
  if (!s || typeof s === 'string') return null;
  const k = [...s].sort((a, b) => a.at - b.at).find((q) => q.at > t0 && q.state === 'yellow');
  return k ? k.at : null;
};

/**
 * No. 019 (N7, review): the decision drawn as a trace that runs from the cabinet to the pole, up it and along the arm to
 * every head over `dur` s and stays lit, so its two ends read in one framing; a node dot on the arm over each head lights
 * as the trace reaches it and swells once more when the heads turn yellow (`yellowAt`; the lenses stay `warning`, never
 * orange). The trace fades 0.5 s after the yellow (or 1.5 s after it arrives without one).
 */
const DecisionTrace: React.FC<{
  S: number;
  at?: 'near' | 'pole';
  t: number;
  from: number;
  dur: number;
  yellowAt: number | null;
  r: number;
}> = ({S, at, t, from, dur, yellowAt, r}) => {
  if (t < from) return null;
  const route = decisionRoute(S, at);
  const len = polylineLength(route);
  const draw = Math.min(1, (t - from) / dur);
  const end = (yellowAt ?? from + dur + 1.0) + 0.5;
  const glow = 1 - ease(t, end, end + 0.5);
  if (glow < 0.003) return null;
  // the heads' hangers on the arm (the route's last leg runs along the arm toward the left head)
  const I = cityIntersection(S);
  const armY = I.signal.headY + 0.95 - 0.12;
  // the share of the route where its last leg (along the arm) passes x
  const before = polylineLength(route.slice(0, -1));
  const share = (x: number) => (before + Math.abs(route[route.length - 2][0] - x)) / len;
  const swell = (a: number) => (t >= a && t <= a + 0.4 ? Math.sin((Math.PI * (t - a)) / 0.4) : 0);
  return (
    <group>
      <GlowPolyline points={route} draw={draw} radius={r} glow={glow} />
      {L.lanes.map((x) => {
        const u = share(x);
        if (draw < u) return null;
        const reach = from + dur * u;
        const sw = Math.max(swell(reach), yellowAt === null ? 0 : swell(yellowAt));
        return <GlowNode key={x} at={[x, armY, I.signal.z + 0.14]} radius={r * 1.95} glow={glow} swell={1 + 0.5 * sw} />;
      })}
    </group>
  );
};

/** No. 019 (N6): the time tape drawn from its state (`tapeAt`) on the front cut face, 25 mm proud. */
/**
 * No. 019: the system's car-scale weights (§ 5, × camD/12 clamped 0.5–3.5): the line's core radius (≈ 6 px wide on screen,
 * inside the guide's 3–8 px) and a node dot's radius (1.95 × the core, ≈ 12 px wide; ≥ 8 px).
 */
const PATH_CORE = 0.009;
/**
 * Where an app car's dot rides (car-local, m): ≈ 0.4 m above the roof (the guide's value, 0.45 here), over the roof's REAR
 * (x −1.5). Over the middle, the dot of a car seen just behind another sat on the front car's tail lamps on screen (review
 * round 2); over its own rear roof it reads as that car's.
 */
const DOT_LIFT = 0.45;
const DOT_BACK = -1.5;
const TAPE_DOT = PATH_CORE * 1.95;

/** The tape's place in the world: a point `u` m up the street along the band, lifted `dy` (and `dz` toward the camera). */
export const tapeWorld = (st: {across: number; y: number}, u: number, dy = 0, dz = 0): V3 => [st.across, st.y + dy, -u + dz];

const TapeView: React.FC<{
  st: ReturnType<typeof tapeAt>;
  mood: Mood;
  kS: number;
  pathR: number;
  mPerPx: number;
  /** Whether a drop line (world points down it) stays clear of every car on screen and above the caption band. */
  clear?: (pts: V3[]) => boolean;
}> = ({st, mood, kS, pathR, mPerPx, clear}) => {
  const rd = TAPE_DOT * kS;
  const f = st.fade;
  const px = (n: number) => n * mPerPx;
  const W = (u: number, dy = 0, dz = 0) => tapeWorld(st, u, dy, dz);
  // brackets above the line, legs down, 10 px clear of the tallest bunch (a dot at its landing pulse, r × 1.3)
  const by = rd * 1.3 + px(10) + px(8);
  // each start stays a dot of its own (review: no blob): within a bunch, centres at least 2.4 r apart, laid out from the
  // bunch's front; a bunch never spreads past 80 % of a cycle on the tape (then its dots touch, under one halo)
  const cycleW = st.cycle * st.scale;
  const laid = (() => {
    const out: {x: number; drop: number; bunch: number; glow: number; pulse?: number}[] = [];
    const byB = new Map<number, typeof st.dots>();
    st.dots.forEach((d) => byB.set(d.bunch, [...(byB.get(d.bunch) ?? []), d]));
    byB.forEach((ds) => {
      const sorted = [...ds].sort((a, b) => a.x - b.x);
      const gap = Math.min(2.4 * rd, sorted.length > 1 ? (0.8 * cycleW) / (sorted.length - 1) : 0);
      let prev = -Infinity;
      sorted.forEach((d) => {
        const x = Math.max(d.x, prev + gap);
        prev = x;
        out.push({...d, x: Math.min(x, st.cursorX)});
      });
    });
    return out;
  })();
  const bracket = (a: number, b: number, draw: number, w: number, o: number, key: string) => {
    if (draw <= 0 || o < 0.01) return null;
    const e = a + (b - a) * draw;
    return (
      <group key={key}>
        <InkBar a={W(a, by, 0.01)} b={W(e, by, 0.01)} w={w} mood={mood} opacity={o} />
        <InkBar a={W(a, by, 0.01)} b={W(a, by - px(8), 0.01)} w={w} mood={mood} opacity={o} />
        {draw >= 0.999 ? <InkBar a={W(b, by, 0.01)} b={W(b, by - px(8), 0.01)} w={w} mood={mood} opacity={o} /> : null}
      </group>
    );
  };
  const bunches = new Map<number, number[]>();
  laid.forEach((d) => bunches.set(d.bunch, [...(bunches.get(d.bunch) ?? []), d.x]));
  const n = st.fronts.length;
  return (
    <group>
      {/* the height cue (review): ink drop lines from the line's two ends to the pavement, dimension-line style, each with
          a foot tick, and a faint neutral shadow on the road under the line. Drawing marks, never orange, no hangers */}
      {st.draw > 0
        ? (() => {
            const e = st.x[0] + st.len * st.draw;
            const g = 0.01 - st.y;
            // light dimension marks: ≈ 2 px at 40 % ink, each from under the tape's end to the pavement right below it,
            // drawn only where it passes no car and ends above the caption band (else the near one, or both, are left out)
            const o = 0.4 * f * Math.min(1, st.draw * 4);
            const ok = (u: number) =>
              !clear || clear([0, 0.25, 0.5, 0.75, 1].map((k) => W(u, -px(4) + (g + px(4)) * k)));
            const drop = (u: number, k: string) =>
              ok(u) ? (
                <group key={k}>
                  <InkBar a={W(u, -px(4))} b={W(u, g)} w={px(2)} mood={mood} opacity={o} depth />
                  <InkBar a={[st.across - px(8), 0.012, -u]} b={[st.across + px(8), 0.012, -u]} w={px(2)} mood={mood} opacity={o} depth />
                </group>
              ) : null;
            return (
              <>
                {drop(st.x[0], 'd0')}
                {st.draw >= 1 ? drop(st.x[1], 'd1') : null}
                <RoadShadow a={[st.across, 0.008, -st.x[0]]} b={[st.across, 0.008, -e]} w={Math.max(0.08, px(7))} opacity={0.18 * o} />
              </>
            );
          })()
        : null}
      {/* the line, its ends fading over 0.3 m (no caps) */}
      {st.draw > 0
        ? (() => {
            const e = st.x[0] + st.len * st.draw;
            const F = 0.3;
            const steps = 6;
            const segs: React.ReactNode[] = [];
            const a0 = st.x[0] + F;
            const b0 = Math.max(a0, e - (st.draw >= 1 ? F : 0));
            if (b0 > a0) segs.push(<GlowSegment key="mid" a={W(a0)} b={W(b0)} radius={pathR} glow={f} />);
            for (let k = 0; k < steps; k++) {
              const g = f * ((k + 0.5) / steps);
              const u0 = st.x[0] + (F * k) / steps;
              if (u0 < e) segs.push(<GlowSegment key={`l${k}`} a={W(u0)} b={W(Math.min(e, u0 + F / steps))} radius={pathR} glow={g} />);
              if (st.draw >= 1) {
                const v0 = st.x[1] - (F * (k + 1)) / steps;
                segs.push(<GlowSegment key={`r${k}`} a={W(v0)} b={W(v0 + F / steps)} radius={pathR} glow={g} />);
              }
            }
            return segs;
          })()
        : null}
      {st.draw > 0.5 ? (
        <InkBar a={W(st.cursorX, -px(20), 0.012)} b={W(st.cursorX, px(20), 0.012)} w={px(3)} mood={mood} opacity={f} />
      ) : null}
      {laid.map((d, i) => (
        // a synthetic start rises 0.3 m into the line at the cursor (no trail); a reported one has already risen
        <GlowCore
          key={i}
          at={W(d.x, -0.3 * (1 - d.drop), 0.005)}
          radius={rd * (d.pulse ? 1 + 0.3 * d.pulse : 1)}
          glow={f * Math.min(1, d.drop * 2)}
        />
      ))}
      {[...bunches.entries()].map(([k, xs]) => (
        <GlowHalo key={`h${k}`} a={W(Math.min(...xs))} b={W(Math.max(...xs))} radius={rd * 2.2} glow={f} />
      ))}
      {st.brackets.map((b, i) => bracket(b.a, b.b, b.draw, px(3) * (1 + 0.7 * b.pulse), f, `b${i}`))}
      {st.predict && n >= 2
        ? bracket(
            st.fronts[n - 2].x + (st.predict.from - st.fronts[n - 2].x) * st.predict.slide,
            st.predict.from + (st.predict.to - st.predict.from) * st.predict.slide,
            st.predict.slide > 0 ? 1 : 0,
            px(3),
            f,
            'copy',
          )
        : null}
      {st.predict && st.predict.marker > 0 ? (
        <EventPin
          head={W(st.predict.x, 0.25 + rd, 0.01)}
          foot={W(st.predict.x, 0, 0.01)}
          stem={st.predict.marker}
          // the stem at the line's core weight, the head a node dot (EventPin's stem is 0.0225 × k)
          k={(kS * PATH_CORE) / 0.0225}
          headR={(TAPE_DOT * 0.0225) / PATH_CORE}
          opacity={f * Math.min(1, st.predict.marker * 3)}
        />
      ) : null}
      {st.gap ? <GlowSegment a={W(st.gap.a, 0, 0.008)} b={W(st.gap.b, 0, 0.008)} radius={pathR * 1.5} glow={f * st.gap.glow} /> : null}
    </group>
  );
};

/** How far behind the look-at point the sky card stands (m): past the street's far end. */
const BACKDROP = 600;

/**
 * T, the city slice (No. 006): a one-way US downtown street cut square to the road (the storefront
 * building's section, sidewalks, three lanes, the storm sewer and a duct bank under the hatched road),
 * the street running into depth to a stop line, a ladder crosswalk and a mast-arm signal (red or green,
 * flat lenses). Whole cars drive away from the camera (never cut) and stop at the line or behind the car
 * in front, each lifting, slowing, creeping and braking on its own keys; brake lamps are flat red,
 * lit by a firm regen slow-down ('auto'), never ('dark'), or by the pedal (`brakeAt`). Generic facades,
 * ONE WAY and SPEED LIMIT 25. Day or Night. No orange: nothing here is the system.
 */
export const CitySliceScene: React.FC<CitySliceSceneProps> = (props) => {
  const {durationInFrames, mood = 'day', startFrame = 0, trees = true} = props;
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const m = MOODS[mood];
  const night = mood === 'night';
  const {from, to, pre} = cityCameraMove(props, durationInFrames, fps, frame);
  const cam = cityCameraAt(props, {frame, fps, durationInFrames});
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
  const mats = useMemo(() => ({sky: new THREE.MeshBasicMaterial({map: skyTexture(mood), fog: false})}), [mood]);
  mats.sky.color.setScalar(1 / m.exposure);

  const S = props.stopLine ?? 35;
  const signs = (props.signs ?? (props.dressing === 'china' ? [] : DEFAULT_CITY_SIGNS)).map((s) => {
    const spot = CITY_SIGN_SPOTS[s.kind] ?? {x: 11.3, z: -9};
    return {kind: s.kind, text: s.text, x: s.x ?? spot.x, z: s.z ?? spot.z};
  });
  // the cut face's ink keeps ≈ 3 px from the medium shot to the wide one
  const ink = Math.max(0.25, Math.min(16, camD / 12.75));
  const shutter = (props.shutter ?? 0.5) / fps;
  // wheels that read as rolling forward (`wheels`, default 'forward'; 'legacy' for posted videos)
  const fwd = wheelMode(props.wheels) === 'forward';
  const wheelCap = capSpeed(C.wheelR, fps);
  const cars = (props.cars ?? []).map((c, i) => ({c, i, at: cityCarAt(props, i, t, fps)}));
  // the loop (N5): each car's drawn wheel turn lands on frame 0's (mod the 5-spoke pitch) the frame after the last
  const loopEnd = durationInFrames / fps;
  const pitch = (2 * Math.PI * C.wheelR) / 5;
  const loopShift = (i: number) => {
    if (!props.loop || !fwd) return 0;
    const end = cappedTravel((x) => cityCarAt(props, i, x, fps)?.speed ?? 0, loopEnd, wheelCap);
    return -(((end % pitch) + pitch) % pitch);
  };
  const figureClock = props.loop ? -loopEnd : startFrame / fps;
  // the pole (N1): its parts, the IR on its target's plate (neutral brightening, no light source)
  const pole = props.pole ? props.pole : null;
  const parts = cityPoleParts(props);
  const target = poleTarget(props);
  const irK = pole ? irLevel(pole.ir, t) : 0;
  const targetAt = target >= 0 ? cars[target]?.at : null;
  const irTarget = targetAt && targetAt.drawn ? carToWorld(PLATE_LOCAL, {x: targetAt.x, z: targetAt.z, yaw: 0}) : undefined;
  // the system's line weight (§ 5 path core, held on screen), capped so a plate's outline stays thin
  const coreR = Math.min(0.014, 0.0225 * Math.max(0.12, camD / 30));
  // the ghost (N6): ≈ 3 px dashed ink, 16 / 10 px dashes, at this camera distance
  const g = props.ghost ?? null;
  const gBox = ghostBox(props);
  const mPerPx = (camD * 2 * Math.tan((13 * Math.PI) / 180)) / 1920;
  const gFade = g && g.fadeAt !== undefined && g.fadeAt !== null ? 1 - ease(t, g.fadeAt, g.fadeAt + 0.7) : 1;
  // No. 019: the dressing, the countdown, the system's car-scale weight (§ 5: 0.018 × camD/12, clamped 0.5–3.5)
  const dress = cityDress(props);
  const cd = cityCountdownAt(props, t);
  const kS = Math.max(0.5, Math.min(3.5, camD / 12));
  const pathR = PATH_CORE * kS;
  const calls = useMemo(() => cityCalls(props, durationInFrames, fps), [props, durationInFrames, fps]);
  const leaves = useMemo(
    () => (props.appDots ? leaveTimes(props, durationInFrames, fps) : []),
    [props, durationInFrames, fps],
  );
  const gb = props.ghostBox ?? null;
  // the ghost's px at the box's own depth (it stands past the look point), so its lines hold ≥ 3 px on screen
  const boxPx = Math.max(
    mPerPx,
    (cam.position.distanceTo(new THREE.Vector3(...countdownSpot(S))) * 2 * Math.tan((13 * Math.PI) / 180)) / 1920,
  );
  const decides = props.decideAt === undefined ? [] : Array.isArray(props.decideAt) ? props.decideAt : [props.decideAt];
  const firstCall = calls.length ? calls[0].at + (calls[0].by === 'cam' ? 1.1 : 0.75) : Infinity;
  const ledOn = dress.cabinet && Number.isFinite(firstCall) ? ease(t, firstCall, firstCall + 0.1) : 0;
  const ledFlash = decides.reduce((m, d) => (t >= d && t <= d + 0.4 ? Math.max(m, Math.sin((Math.PI * (t - d)) / 0.4)) : m), 0);
  const tape = props.tape ? tapeAt(props.tape, props.cars ?? [], startFrame / fps, t) : null;
  // a tape drop line's test: every point above the caption band (y ≤ 1000) and outside every drawn car's screen silhouette
  const dropClear = (pts: V3[]) => {
    const scr = pts.map((q) => projectToFrame(cam, q));
    if (scr.some((q) => q[1] > 1000)) return false;
    const box: V3[] = [];
    for (const bx of [-2.42, 2.42]) for (const by of [0.15, 1.9]) for (const bz of [-0.98, 0.98]) box.push([bx, by, bz]);
    return !cars.some(({at}) => {
      if (!at || !at.drawn) return false;
      const h = hull2(box.map((q) => projectToFrame(cam, carToWorld(q, {x: at.x, z: at.z, yaw: 0}))));
      return scr.some((q) => inConvex(h, q));
    });
  };
  // the app cars in the order of their starts (bunch 0's ranks on the tape)
  const appRank = (props.cars ?? [])
    .map((c, i) => ({c, i}))
    .filter(({c}) => c.app && c.goAt !== undefined)
    .sort((p, q) => (p.c.goAt as number) - (q.c.goAt as number))
    .map(({i}) => i);

  return (
    <AbsoluteFill>
      <SectionStage mood={mood} post={{focusY: 0.5}} ao far={1500}>
        <SectionCamera
          from={from}
          to={to}
          pre={pre}
          durationInFrames={durationInFrames}
          drift={props.drift ?? 0.08}
          clockOffset={startFrame / fps}
          fitClip
          farMin={camD + BACKDROP + 50}
        />
        <SectionLights mood={mood} target={[5, 0, -S / 2 - 4]} lamp={0} extent={30} figureSpot={false} />
        <mesh
          position={backdrop.position}
          quaternion={backQ}
          material={mats.sky}
          scale={[backdrop.size * 0.5625, backdrop.size, 1]}
        >
          <planeGeometry args={[1, 1]} />
        </mesh>
        <CitySlice
          mood={mood}
          stopLine={S}
          signal={citySignalAt(props, t)}
          ink={ink}
          signs={signs}
          trees={trees}
          // No. 019: a deeper ground block under the dressings, so the low tape framings read as cut ground
          bottom={props.dressing ? -8 : undefined}
        />
        {cars.map(({c, i, at}) =>
          at && at.drawn ? (
            <DrivingCar
              key={i}
              mood={mood}
              at={{x: at.x, z: at.z, yaw: 0}}
              travelled={
                fwd ? cappedTravel((x) => cityCarAt(props, i, x, fps)?.speed ?? 0, t, wheelCap) + loopShift(i) : at.travelled
              }
              blur={fwd ? wheelSmear((at.speed * shutter) / C.wheelR, at.speed, wheelCap) : (at.speed * shutter) / C.wheelR}
              spinSign={fwd ? -1 : 1}
              body={c.body ?? 'extra'}
              // running lights at Night; the brake lamps brighter on top (both flat, never bloomed)
              tail={night ? 1 : 0}
              brake={at.lamp}
              driver={c.driver === undefined ? ((c.body ?? 'extra') === 'you' ? 'you' : 'extra') : c.driver}
              plate={dress.blank ? ' ' : (c.plate ?? PLATES[i % PLATES.length])}
              paint={
                c.paint ??
                ((c.body ?? 'extra') !== 'extra'
                  ? undefined
                  : c.lamps === 'dark'
                    ? CITY.charcoal
                    : CITY.carBodies[(i * 2) % CITY.carBodies.length])
              }
              shape={carShape(c, i)}
              clockOffset={figureClock}
              roofRack={c.roofRack}
              plateBright={i === target ? irK : 0}
              glances={(c.glances ?? []).map((a) =>
                typeof a === 'number'
                  ? {at: a}
                  : {at: a.at, hold: a.hold, target: a.to === 'phone' ? dashPhonePose(carShape(c, i)).centre : undefined},
              )}
              phone={c.phone ? {screen: typeof c.phone === 'object' ? (c.phone.screen ?? 1) : 1} : undefined}
              gaze={c.gaze === 'phone' && c.phone ? dashPhonePose(carShape(c, i)).centre : undefined}
              look={c.extraLook === 'b' ? {...CAST_NEUTRAL, ...EXTRA_B} : undefined}
            />
          ) : null,
        )}
        {/* the plates' orange marks (N2): 2 cm proud of the plate, never on its face */}
        {cars.map(({c, i, at}) => {
          if (!at || !at.drawn || !c.plateMark) return null;
          const m = plateMarkAt(c.plateMark, t);
          if (m.glow < 0.003 || m.draw <= 0) return null;
          const pts = plateRect(1 + 0.12 * m.swell).map((q) => carToWorld(q, {x: at.x, z: at.z, yaw: 0}));
          const segs = [0, 1, 2, 3];
          return (
            <group key={`mark-${i}`}>
              {segs.map((k) => {
                const u = Math.max(0, Math.min(1, m.draw * 4 - k));
                if (u <= 0) return null;
                const a = pts[k];
                const b = pts[k + 1];
                const e: V3 = [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u];
                return <GlowSegment key={k} a={a} b={e} radius={coreR} glow={m.glow} halo={1 + 1.2 * m.swell} />;
              })}
              {segs.map((k) =>
                m.draw * 4 > k + 1 || (k === 0 && m.draw >= 1) ? (
                  <GlowNode key={`c${k}`} at={pts[k + 1]} radius={coreR * 1.02} glow={m.glow} />
                ) : null,
              )}
            </group>
          );
        })}
        {pole ? (
          <PlateCameraPole
            mood={mood}
            position={poleSpot(pole, S)}
            aim={poleAim(props)}
            irTarget={irTarget}
            coneSpans={
              irK > 0.003 && parts
                ? coneSpansFor(
                    cam,
                    parts.lens,
                    irTarget ?? poleAim(props),
                    cars.flatMap(({at}) => (at && at.drawn ? [{x: at.x, z: at.z}] : [])),
                    targetAt && targetAt.drawn ? {x: targetAt.x, z: targetAt.z} : null,
                  )
                : undefined
            }
            t={t}
            camD={camD}
            status={pole.status}
            statusPulses={pole.statusPulses}
            ir={pole.ir}
            shots={pole.shots}
            cut={pole.cut}
            rings={pole.rings}
            uplink={pole.uplink}
          />
        ) : null}
        {/* No. 019: the dressings' hardware, the countdown box or its ghost, the calls and the decision */}
        {dress.countdown ? (
          <CountdownBox mood={mood} position={countdownSpot(S)} n={cd.n} color={cd.state === 'green' ? 'green' : 'red'} />
        ) : null}
        {dress.loops.length ? <LoopDetectors S={S} lanes={dress.loops} /> : null}
        {dress.cabinet ? (
          <ControllerCabinet S={S} at={props.cabinetAt} mood={mood} led={ledOn} flash={ledFlash} ink={ink} />
        ) : null}
        {gb ? (
          <>
            <GhostLines
              mood={mood}
              lines={countdownGhostLines(S)}
              draw={ease(t, gb.at, gb.at + 0.8)}
              opacity={gb.fadeAt !== undefined && gb.fadeAt !== null ? 1 - ease(t, gb.fadeAt, gb.fadeAt + 0.7) : 1}
              width={3 * boxPx}
              dash={[16 * boxPx, 10 * boxPx]}
              view={SECTION_ANGLE}
            />
            {(gb.digits ?? []).map((d, i, all) => {
              const f = 1 / fps;
              const next = all[i + 1];
              const inK = Math.min(1, Math.max(0, (t - d.at + f) / (3 * f)));
              // a clean swap: the old digit goes out over 2 frames and is gone a frame before the next starts to appear
              const outK = next
                ? Math.min(1, Math.max(0, (t - (next.at - 3 * f)) / (2 * f)))
                : Math.min(1, Math.max(0, (t - (gb.digitsOutAt ?? d.at + 0.32) + f) / (6 * f)));
              const o = inK * (1 - outK);
              return o > 0.01 ? (
                <GhostLines
                  key={i}
                  mood={mood}
                  lines={ghostDigitLines(S, String(d.d))}
                  draw={1}
                  opacity={o}
                  width={3 * boxPx}
                  dash={[8 * boxPx, 5 * boxPx]}
                  view={SECTION_ANGLE}
                />
              ) : null;
            })}
          </>
        ) : null}
        {dress.camLanes.length ? <DetectCam S={S} /> : null}
        {/* the camera's zones: faint ink outlines on its lanes (ink only, never orange) */}
        {dress.camLanes.map((lane) => {
          const r = camZone(S, lane);
          const c: V3[] = [
            [r.x[0], 0.015, r.z[0]],
            [r.x[1], 0.015, r.z[0]],
            [r.x[1], 0.015, r.z[1]],
            [r.x[0], 0.015, r.z[1]],
          ];
          return (
            <group key={`zone${lane}`}>
              {c.map((a, k) => (
                <InkBar key={k} a={a} b={c[(k + 1) % 4]} w={2 * mPerPx} mood={mood} opacity={0.35} depth />
              ))}
            </group>
          );
        })}
        {calls.map((c, i) => {
          if (c.by === 'cam') {
            // a camera call: a trace leaves the camera, runs along the arm, down the mast and on to the cabinet (1.1 s),
            // holds 0.4 s and fades over 0.4 s, so its camera end reads in a framing that shows only the arm; a node dot
            // swells on the camera as the call starts
            if (t < c.at || t > c.at + 1.9) return null;
            const glow = 1 - ease(t, c.at + 1.5, c.at + 1.9);
            const route = camRoute(S, props.cabinetAt);
            const sw = t <= c.at + 0.4 ? Math.sin((Math.PI * (t - c.at)) / 0.4) : 0;
            return (
              <group key={`call${i}`}>
                <GlowPolyline points={route} draw={Math.min(1, (t - c.at) / 1.1)} radius={pathR} glow={glow} />
                <GlowNode at={route[0]} radius={pathR * 1.95} glow={glow} swell={1 + 0.5 * sw} />
              </group>
            );
          }
          if (t < c.at || t > c.at + 1.2) return null;
          const r = loopRect(S, c.lane);
          const sq: V3[] = [
            [r.x[0], 0.02, r.z[0]],
            [r.x[1], 0.02, r.z[0]],
            [r.x[1], 0.02, r.z[1]],
            [r.x[0], 0.02, r.z[1]],
            [r.x[0], 0.02, r.z[0]],
          ];
          const edge = t < c.at + 0.3 ? ease(t, c.at, c.at + 0.06) : 1 - ease(t, c.at + 0.3, c.at + 0.45);
          return (
            <group key={`call${i}`}>
              {edge > 0.003 ? <GlowPolyline points={sq} radius={pathR} glow={edge} /> : null}
              <Pulse route={callRoute(S, c.lane, props.cabinetAt)} u={(t - c.at - 0.15) / 0.6} r={pathR} />
            </group>
          );
        })}
        {decides.map((d, i) => (
          <DecisionTrace
            key={`dec${i}`}
            S={S}
            at={props.cabinetAt}
            t={t}
            from={d}
            dur={props.decideFor ?? 0.5}
            yellowAt={nextYellow(props, d)}
            r={pathR}
          />
        ))}
        {/* No. 019 (N6): the app cars' dots, ≈ 0.4 m over the roof; an air tape's report lifts each one up to the tape */}
        {props.appDots
          ? cars.map(({c, i, at}) => {
              if (!c.app || !at || !at.drawn) return null;
              const a = props.appDots!;
              const rank = appRank.indexOf(i);
              // with a tape, a dot leaves its car when its start is reported (it rises to the tape); a tape without a
              // report key means the starts were reported in an earlier scene, so the roofs carry no dot
              if (tape && rank >= 0) {
                const rep = props.tape?.report;
                if (!rep || t >= rep.at + rank * (rep.stagger ?? 0.25)) return null;
              }
              const leave = leaves[i] ?? Infinity;
              const glow = ease(t, a.at, a.at + 0.3) * (Number.isFinite(leave) ? 1 - ease(t, leave, leave + 1.0) : 1);
              const sw =
                a.reportAt !== undefined && t >= a.reportAt && t <= a.reportAt + 0.5
                  ? 1 + 0.45 * Math.sin((Math.PI * (t - a.reportAt)) / 0.5)
                  : 1;
              const rd = TAPE_DOT * kS;
              return (
                <GlowNode
                  key={`app${i}`}
                  at={carToWorld([DOT_BACK, 1.78 + DOT_LIFT + rd, 0], {x: at.x, z: at.z, yaw: 0})}
                  radius={rd}
                  glow={glow}
                  swell={sw}
                />
              );
            })
          : null}
        {tape ? <TapeView st={tape} mood={mood} kS={kS} pathR={pathR} mPerPx={mPerPx} clear={dropClear} /> : null}
        {/* No. 019 (§ 5 v0.18.16): each reported start rises from its car's dot to its own spot on the tape (0.6 s) */}
        {tape && props.tape?.report
          ? tape.rising.map((r) => {
              const k = appRank[r.i];
              const st0 = props.tape!.report!.at + r.i * (props.tape!.report!.stagger ?? 0.25);
              const car = k === undefined ? null : cityCarAt(props, k, st0, fps);
              if (!car || !car.drawn) return null;
              const rd = TAPE_DOT * kS;
              const from = carToWorld([DOT_BACK, 1.78 + DOT_LIFT + rd, 0], {x: car.x, z: car.z, yaw: 0});
              // a car out of the frame sends nothing
              const q = projectToFrame(cam, from);
              if (q[0] < 0 || q[0] > 1080 || q[1] < 0 || q[1] > 1920) return null;
              const to = tapeWorld(tape, r.x, 0, 0.005);
              const u = ease(r.u, 0, 1);
              const head: V3 = [from[0] + (to[0] - from[0]) * u, from[1] + (to[1] - from[1]) * u, from[2] + (to[2] - from[2]) * u];
              return (
                <group key={`rise${r.i}`}>
                  <GlowSegment a={from} b={head} radius={pathR * 0.5} glow={r.trail} />
                  {r.u < 1 ? <GlowNode at={head} radius={rd} glow={1} /> : null}
                </group>
              );
            })
          : null}
        {g && gBox && parts ? (
          <>
            <GhostLines
              mood={mood}
              lines={[[parts.housing, [gBox.a[0], gBox.a[1], gBox.a[2]]]]}
              draw={ease(t, g.at, g.at + 0.8)}
              opacity={gFade}
              width={3 * mPerPx}
              dash={[16 * mPerPx, 10 * mPerPx]}
              view={SECTION_ANGLE}
            />
            <GhostLines
              mood={mood}
              lines={ghostCabinet(gBox.a, gBox.b)}
              draw={ease(t, g.cabinetAt ?? g.at + 0.8, (g.cabinetAt ?? g.at + 0.8) + 0.8)}
              opacity={gFade}
              width={3 * mPerPx}
              dash={[16 * mPerPx, 10 * mPerPx]}
              view={SECTION_ANGLE}
            />
          </>
        ) : null}
      </SectionStage>
    </AbsoluteFill>
  );
};
