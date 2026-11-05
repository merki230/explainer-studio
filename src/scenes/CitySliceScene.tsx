import React, {useMemo} from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import * as THREE from 'three';
import {CITY, MOODS, type Mood} from '../theme';
import {GhostLines} from '../three/real/GhostCar';
import {CONE, PlateCameraPole, poleParts, irLevel, type PlateCameraKeys} from '../three/real/PlateCameraPole';
import {rackBounds} from '../three/real/RoofRack';
import {GlowNode, GlowSegment} from '../three/section/GlowLines';
import {CAR_LAYOUT} from '../three/real/RealCar';
import {carToWorld, DrivingCar} from '../three/real/DrivingCar';
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

export type CityFraming = 'lanes' | 'follow' | 'queue' | 'queueClose';
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
export const CITY_FRAMINGS: Record<CityFraming, Framing> = {
  lanes: {look: [7.15, 1.0, -30.95], distance: 56},
  follow: {look: [6.36, 1.0, -22.69], distance: 36},
  queue: {look: [9.13, 1.0, -15.74], distance: 72},
  queueClose: {look: [12.47, 1.0, -9.17], distance: 60},
};

/** A preset framing for a stop line `S` m up the street: 'lanes' and 'follow' move with the line, 'queue' widens. */
export const cityFraming = (name: CityFraming | CityPoleFraming, S = 35, pole?: CityPole | false): Framing => {
  if (isPoleFraming(name)) {
    const [x, y, z] = poleSpot(pole, S);
    const f = POLE_FRAMINGS[name];
    return {look: [x + f.d[0], y + f.d[1], z + f.d[2]], distance: f.distance};
  }
  const f = CITY_FRAMINGS[name] ?? CITY_FRAMINGS.lanes;
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
  /** No. 015: the driver's glances toward the signal (seconds), each held 1.0 s. Default none. */
  glances?: number[];
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
  const base = p.camera?.from ?? cityFraming(p.framing ?? 'lanes', p.stopLine ?? 35, p.pole);
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
};

/** Each car's plan: its lane's x and its rest point (the line, or `gap` behind the car in front). */
export const cityPlans = (p: Partial<CitySliceSceneProps>): Plan[] => {
  const S = p.stopLine ?? 35;
  const lastRest: Record<number, number> = {};
  return (p.cars ?? []).map((c) => {
    const lane = c.lane ?? 2;
    const x = L.lanes[lane - 1] ?? L.lanes[1];
    const gap = c.gap ?? p.gap ?? CITY_CAR_LENGTH;
    const front = lastRest[lane];
    const rest = front === undefined ? -S + LINE_GAP : front + CITY_CAR_LENGTH + gap;
    const cruise = c.liftAt === undefined && c.stopAt === undefined;
    if (!cruise) lastRest[lane] = rest;
    const tS = c.stopAt ?? (c.liftAt ?? 0) + 3.5;
    const tL = Math.min(c.liftAt ?? tS - 3.5, tS - 0.1);
    const creep = c.creep !== undefined && c.creep !== false;
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
    };
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
    case 'signal':
      return [L.lanes[1], I.signal.headY, I.signal.z];
    case 'stopLine':
      return [(L.road[0] + L.road[1]) / 2, 0, (I.stopNear + I.stopFar) / 2];
    case 'sign': {
      const s = (p.signs ?? DEFAULT_CITY_SIGNS).find((q) => q.kind === arg);
      if (!s) return undefined;
      const spot = CITY_SIGN_SPOTS[s.kind] ?? {x: 11.3, z: -9};
      return [s.x ?? spot.x, 84 * 0.0254 + SIGN_SIZE[s.kind].h / 2, s.z ?? spot.z];
    }
    default:
      return undefined;
  }
};

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
  const signs = (props.signs ?? DEFAULT_CITY_SIGNS).map((s) => {
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
        <CitySlice mood={mood} stopLine={S} signal={citySignalAt(props, t)} ink={ink} signs={signs} trees={trees} />
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
              plate={c.plate ?? PLATES[i % PLATES.length]}
              paint={
                c.paint ??
                ((c.body ?? 'extra') !== 'extra'
                  ? undefined
                  : c.lamps === 'dark'
                    ? CITY.charcoal
                    : CITY.carBodies[(i * 2) % CITY.carBodies.length])
              }
              shape={c.shape ?? ((c.body ?? 'extra') === 'extra' && i % 3 === 1 ? 'sedan' : 'crossover')}
              clockOffset={figureClock}
              roofRack={c.roofRack}
              plateBright={i === target ? irK : 0}
              glances={(c.glances ?? []).map((a) => ({at: a}))}
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
