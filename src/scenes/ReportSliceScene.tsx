import React, {useMemo} from 'react';
import {AbsoluteFill, random, useCurrentFrame, useVideoConfig} from 'remotion';
import * as THREE from 'three';
import {CAR, CAST, EXTRA_B, LAB, MOODS, REAL, section, TOWER, type CastLook, type Mood} from '../theme';
import {raw, roundedBox} from '../three/plaster';
import {RealPhone} from '../three/real/RealPhone';
import {seatRise} from '../three/real/RealCar';
import {layoutOf, simRevs, SlicedCar, toWorld, wheelTurnRevs, type SlicedCarOptions} from '../three/real/SlicedCar';
import {wheelMode} from '../three/real/wheelMotion';
import {OrangeLight} from '../three/OrangePath';
import {RadioPulse, PULSE_LIFE} from '../three/TirePieces';
import {CutOutline, cutMaterial, INK, type Rect} from '../three/section/cutLook';
import {Figure} from '../three/section/Figure';
import type {Gesture} from '../three/rig';
import {GlowNode, GlowSegment, NODE_SCALE, pointAlong, polylineLength} from '../three/section/GlowLines';
import {projectToFrame, SectionCamera, sectionCameraAt, type Framing} from '../three/section/SectionCamera';
import {SectionLights, SectionStage} from '../three/section/SectionStage';
import {skyTexture} from '../three/section/textures';
import {ease, framingAtKeys, type CameraKey} from './keyframes';

/*
 * R, the data chain (No. 012 `insurance-app`, build R7): three cut-open sections stacked on one sheet at the fixed
 * angle, sky between them (No. 010's twin-bay grammar). Bottom: a city street cut across with a generic cut sedan
 * (`SlicedCar`, gas, sage paint, an `EXTRA_B` driver, a dark phone standing in the cupholder) and a small grey
 * telematics module under its dash. Middle: a report company's office (two desks with dark monitors, two server
 * racks with neutral status LEDs, a printer that pushes out sheets onto a stack). Top: an insurer's office (a desk
 * with a monitor turned to the extra sitting at it, a tray, a stamp; a filing cabinet and a plant).
 *
 * The hidden system (orange, § 5): the module's node dot, rings rising from it through the cut roof, and a path with
 * right-angle runs up the sheet, module → the rack (node dot) → the insurer's tray (node dot), with pulses running up
 * it. `path.fadeAt` fades it all from the car upward (0.9 s, opacity only); after that nothing on the set is orange.
 * Nothing readable anywhere: no names, logos, signs, screen text or stamp text (the sheets carry grey bars only).
 *
 * World: metres; x along the street (the car faces −x), y up, z toward the camera. The street's surface at y 0, the
 * report office's floor at `layout.reportY`, the insurer's at `layout.insurerY`. Times are seconds into the scene;
 * any key may lie outside it (a later scene of the same take passes earlier keys as negative numbers).
 */

type V3 = [number, number, number];

export type ReportFraming = 'car' | 'cabin' | 'report' | 'company' | 'printer' | 'insurer' | 'desk' | 'stack' | 'chain';

/** The orange data path (§ 5): leg 1 module → rack, leg 2 rack → insurer's tray. Seconds into the scene. */
export type ReportPath = {
  /** Leg 1 starts drawing out of the module. */
  at: number;
  /** Leg 1 reaches the rack (its node dot lights). Default `at` + 1.8. */
  companyAt?: number;
  /** Leg 2 starts up out of the rack. Default `companyAt` + 0.8. */
  leg2At?: number;
  /** Leg 2 reaches the insurer's tray (its node dot lights; a sheet lands in the tray unless `tray` says otherwise). Default `leg2At` + 1.6. */
  insurerAt?: number;
  /** The first pulse leaves the module. Default `companyAt`. Pulses run up the drawn path; on leg 2 once it is drawn. */
  pulsesAt?: number;
  /** Seconds between pulses (default 0.9). */
  pulseEvery?: number;
  /** No pulse leaves after this (default: `fadeAt`, else never). */
  until?: number | null;
  /**
   * Everything orange fades out from the car upward over 0.9 s (opacity only: the path, its dots, the pulses, the
   * rings, the module's and rack's and tray's node dots). Nothing orange after. Default never.
   */
  fadeAt?: number | null;
};

/** One office's size and place (metres). */
export type ReportRoom = {
  /** Width along x (default 4.2) and depth along z (default 2.6). */
  w?: number;
  d?: number;
  /** Its centre on x (default 0.4). */
  x?: number;
  /** Its front cut face on z (default 0.85: just in front of the car's cut, so the path climbs one plane). */
  front?: number;
};

export type ReportSliceSceneProps = {
  durationInFrames: number;
  /** Day (default) or Night. */
  mood?: Mood;
  /**
   * The car (`SlicedCar` options over the defaults: `{variant: 'gas', shape: 'sedan', paint: CAR[mood].bodies.mom,
   * driver: 'extra', driverLook: EXTRA_B, nearWheels: 'whole', road: 'city', driving: [{at: 0, speed: 3.5}]}`).
   * Corners and signals (`corners`), speed signs (`signs`), `brakeLights`, `foot`, `noseDip`, `glances` go here.
   */
  car?: Partial<SlicedCarOptions>;
  /**
   * The phone standing in the cupholder: 'dark' (default: a generic phone, screen dark, no node dot) or false (none;
   * use it when `car` draws its own cupholder phone).
   */
  phone?: 'dark' | false;
  /** The telematics module under the dash (a small grey box, no logo). Default true. */
  module?: boolean;
  /** The module's node dot lights. Default: the first ring, else `path.at`; null: never. */
  moduleAt?: number | null;
  /** Rings rise from the module through the cut roof at these times (No. 009's call-ring grammar, orange). */
  rings?: number[];
  /** The data path (see `ReportPath`). Default none. */
  path?: ReportPath | null;
  /** The printer pushes out a sheet at each time (0.9 s out, then it drops on the stack). Default none. */
  print?: number[];
  /** Same as `print` (the A/V script's name). */
  printAt?: number[];
  /** Sheets already on the printer's stack (default 5). */
  stack?: number;
  /** A sheet lands in the insurer's tray (0.3 s). Default `path.insurerAt`; null: never. */
  tray?: number | null;
  /** The extra picks the tray's sheet up and lays it in front of them. Default `tray` + 0.8. */
  pickAt?: number | null;
  /** The stamp hits the sheet (an ink frame appears, no text). Default `pickAt` + 0.9. */
  stampAt?: number | null;
  /** The insurer's look: 'a' (`CAST.extra`, default) or 'b' (`EXTRA_B`). */
  insurerLook?: 'a' | 'b';
  /** The report company's office (default 4.2 × 2.6 at x 0.4). */
  report?: ReportRoom;
  /** The insurer's office (default 4.2 × 2.6 at x 0.4). */
  insurer?: ReportRoom;
  /** Floor heights of the two offices (default report 5.6, insurer 10.1). */
  layout?: {reportY?: number; insurerY?: number};
  /** Framing preset (default 'car'); see `reportFramings`. */
  framing?: ReportFraming;
  /** A custom move instead of a preset (look-at + distance at the fixed angle). */
  camera?: {from: Framing; to?: Framing};
  /** Camera keyframes: override `camera`, `push` and the glide in. */
  cameraKeys?: CameraKey[];
  /** Push toward the subject, units/s (default 0.04). */
  push?: number;
  /** Idle sideways drift, ± units (default 0.08). */
  drift?: number;
  location?: string;
  transition?: 'auto' | 'continue' | 'glide' | 'cut' | 'dissolve' | 'slide' | 'follow';
  follow?: {direction?: 'down' | 'up' | 'left' | 'right'; at?: number};
  glide?: number;
  /** Set by Explainer. */
  startFrame?: number;
  cameraFrom?: Framing;
  cameraGlide?: number;
  /** Set by Explainer on a `continue`: the car's wheel turn so far (see `SlicedCar` `revsFrom`, `wheelFrom`). */
  revsFrom?: number;
  wheelFrom?: number;
};

// ---------------------------------------------------------------- layout

const WALL_T = 0.18;
const WALL_H = 2.7;
const SLAB = 0.5;

const roomOf = (r: ReportRoom | undefined) => {
  const d = r?.d ?? 2.6;
  const front = r?.front ?? 0.85;
  return {w: r?.w ?? 4.2, d, x: r?.x ?? 0.4, z: front - d / 2, front};
};
const ysOf = (p: Partial<ReportSliceSceneProps>) => ({
  report: p.layout?.reportY ?? 5.6,
  insurer: p.layout?.insurerY ?? 10.1,
});

/** The car's options with the scene's defaults. */
const carOptions = (p: Partial<ReportSliceSceneProps>): Partial<SlicedCarOptions> => {
  const mood = p.mood ?? 'day';
  return {
    variant: 'gas',
    shape: 'sedan',
    paint: CAR[mood].bodies.mom,
    driver: 'extra',
    driverLook: EXTRA_B,
    nearWheels: 'whole',
    road: 'city',
    driving: [{at: 0, speed: 3.5}],
    ...p.car,
    mood,
    ...(p.revsFrom !== undefined ? {revsFrom: p.revsFrom} : {}),
    ...(p.wheelFrom !== undefined ? {wheelFrom: p.wheelFrom} : {}),
  };
};

/** The module (world): under the dash on the near side, by the cut, so its node dot reads past the pedals. */
const modulePos = (p: Partial<ReportSliceSceneProps>): V3 => {
  const c = carOptions(p);
  const k = layoutOf(c).cluster;
  return toWorld(c, [k[0] + 0.04, k[1] - 0.42, layoutOf(c).cutZ - 0.13]);
};
/** The phone's height (m: the held phone's 0.22, 🎭, as `SlicedCar`'s cupholder phone) and how deep it sits in the cup. */
const PHONE_H = 0.22;
const PHONE_SINK = 0.07;
/**
 * The cupholder phone (world, the phone's centre): at the back of the console between the seat backs, beside the
 * driver's hip, the cup's rim at the cushion's height (R1's spot: the one place the knee and arms don't hide).
 */
const phonePos = (p: Partial<ReportSliceSceneProps>): V3 => {
  const c = carOptions(p);
  const d = layoutOf(c).driver;
  return toWorld(c, [d[0] - 0.3, d[1] + seatRise(c.shape) + 0.5 - PHONE_SINK + PHONE_H / 2, 0]);
};
/** The car draws its own cupholder phone (`car.cupPhone`, R1): then the scene's placeholder stands aside. */
const carHasPhone = (p: Partial<ReportSliceSceneProps>) => !!(p.car as Record<string, unknown> | undefined)?.cupPhone;

/** Report office furniture (room-local metres: x across from the room's centre, z toward the camera, floor y 0). */
const REPORT = {
  /** The racks: one at the front-right corner (the path enters it), one behind it at the back wall. */
  rackX: 1.62,
  rackZ: [0.68, -0.8] as number[],
  rack: {w: 0.6, d: 0.9, h: 2.0},
  desks: [-1.35, -0.2] as number[],
  desk: {w: 1.05, d: 0.62, h: 0.74, z: -0.95},
  printer: {x: 0.2, z: 0.62, cab: 0.62},
};
/** Insurer office furniture (room-local). The extra sits at `fig` facing +x across the desk. */
const INSURER = {
  fig: [-0.68, 0, -0.25] as V3,
  desk: {x: 0.0, z: -0.28, w: 0.7, d: 1.46, h: 0.74},
  tray: [-0.22, 0.755, 0.2] as V3,
  monitor: [0.2, 0.74, -0.3] as V3,
  /** The stamp's place on the desk: by the sheet, on the near (camera) side, where the near hand takes it. */
  stamp: [-0.1, 0.74, -0.04] as V3,
  /** Where the sheet lies to be stamped (in front of the extra). */
  sheet: [-0.26, 0.748, -0.2] as V3,
  cabinet: [-1.65, 0, -0.95] as V3,
  plant: [1.55, 0, -0.9] as V3,
};

const rackFrontZ = () => REPORT.rackZ[0] + REPORT.rack.d / 2;
const deskEndZ = () => INSURER.desk.z + INSURER.desk.d / 2;

/** The two legs of the path (world). Leg 2 starts at leg 1's end (the rack's node dot). */
export const reportPathPoints = (p: Partial<ReportSliceSceneProps>): {leg1: V3[]; leg2: V3[]} => {
  const ys = ysOf(p);
  const rr = roomOf(p.report);
  const ir = roomOf(p.insurer);
  const m = modulePos(p);
  // both legs climb in one plane, 3 cm proud of the offices' front cut faces (§ 5: runs on the cut faces)
  const zf = Math.max(rr.front, ir.front) + 0.03;
  const rackX = rr.x + REPORT.rackX;
  const rz = rr.z + rackFrontZ() + 0.02;
  const ry = ys.report - SLAB / 2;
  const iy = ys.insurer - SLAB / 2;
  const trayX = ir.x + INSURER.tray[0];
  const dz = ir.z + deskEndZ() + 0.02;
  const node: V3 = [rackX, ys.report + 1.05, rz];
  return {
    leg1: [m, [m[0], m[1], zf], [m[0], ry, zf], [rackX, ry, zf], [rackX, ys.report + 0.01, zf], [rackX, ys.report + 0.01, rz], node],
    leg2: [
      node,
      [rackX, ys.report + REPORT.rack.h + 0.01, rz],
      [rackX, ys.report + REPORT.rack.h + 0.01, zf],
      [rackX, iy, zf],
      [trayX, iy, zf],
      [trayX, ys.insurer + 0.01, zf],
      [trayX, ys.insurer + 0.01, dz],
      [trayX, ys.insurer + INSURER.desk.h + 0.01, dz],
      [trayX, ys.insurer + INSURER.desk.h + 0.03, ir.z + INSURER.tray[2]],
    ],
  };
};

/** The path's keys with defaults. */
const pathKeys = (path: ReportPath) => {
  const companyAt = path.companyAt ?? path.at + 1.8;
  const leg2At = path.leg2At ?? companyAt + 0.8;
  const insurerAt = path.insurerAt ?? leg2At + 1.6;
  const fadeAt = path.fadeAt ?? null;
  return {
    at: path.at,
    companyAt,
    leg2At,
    insurerAt,
    pulsesAt: path.pulsesAt ?? companyAt,
    pulseEvery: Math.max(0.25, path.pulseEvery ?? 0.9),
    until: path.until ?? fadeAt ?? Infinity,
    fadeAt,
  };
};

/** The fade at a share `u` (0 the module → 1 the tray) of the whole path: 1 lit → 0 gone, sweeping upward over 0.9 s. */
const fadeK = (fadeAt: number | null, t: number, u: number) =>
  fadeAt === null ? 1 : 1 - ease(t, fadeAt + 0.6 * u, fadeAt + 0.6 * u + 0.3);

const trayAtOf = (p: Partial<ReportSliceSceneProps>) =>
  p.tray === undefined ? (p.path ? pathKeys(p.path).insurerAt : null) : p.tray;
const pickAtOf = (p: Partial<ReportSliceSceneProps>) => {
  const tr = trayAtOf(p);
  return p.pickAt === undefined ? (tr === null ? null : tr + 0.8) : p.pickAt;
};
const stampAtOf = (p: Partial<ReportSliceSceneProps>) => {
  const pk = pickAtOf(p);
  return p.stampAt === undefined ? (pk === null ? null : pk + 0.9) : p.stampAt;
};
const moduleAtOf = (p: Partial<ReportSliceSceneProps>) =>
  p.moduleAt === undefined ? (p.rings?.length ? Math.min(...p.rings) : (p.path?.at ?? null)) : p.moduleAt;

// ---------------------------------------------------------------- camera

/** The framings at the fixed angle (world metres, set on test stills). */
export const reportFramings = (p: Partial<ReportSliceSceneProps> = {}): Record<ReportFraming, Framing> => {
  const ys = ysOf(p);
  const rr = roomOf(p.report);
  const ir = roomOf(p.insurer);
  const report: Framing = {look: [rr.x + 0.35, ys.report + 0.95, rr.z + 0.55], distance: 15};
  const insurer: Framing = {look: [ir.x - 0.1, ys.insurer + 0.9, ir.z + 0.55], distance: 13};
  const stack: Framing = {look: [0.3, (ys.insurer + WALL_H) / 2 + 0.2, 0.2], distance: 40};
  return {
    car: {look: [-0.1, 0.55, 0.35], distance: 19},
    cabin: {look: [-0.35, 0.95, 0.2], distance: 9},
    report,
    company: report,
    printer: {look: [rr.x + REPORT.printer.x + 0.2, ys.report + 0.8, rr.z + REPORT.printer.z], distance: 6.5},
    insurer,
    desk: {look: [ir.x + INSURER.sheet[0] + 0.1, ys.insurer + 0.85, ir.z + INSURER.sheet[2] + 0.2], distance: 6},
    stack,
    chain: stack,
  };
};

const reportCameraMove = (p: Partial<ReportSliceSceneProps>, durationInFrames: number, fps: number, frame?: number) => {
  const preset = reportFramings(p)[p.framing ?? 'car'];
  if (p.cameraKeys && p.cameraKeys.length) {
    const base = p.camera?.from ?? preset;
    const f = framingAtKeys(p.cameraKeys, base, frame === undefined ? Infinity : frame / fps);
    return {from: f, to: f, pre: undefined};
  }
  const push = p.push ?? 0.04;
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

export const reportCameraStart = (p: Partial<ReportSliceSceneProps>, d: number, fps: number): Framing =>
  reportCameraMove({...p, cameraFrom: undefined, cameraGlide: undefined}, d, fps, 0).from;
export const reportCameraEnd = (p: Partial<ReportSliceSceneProps>, d: number, fps: number): Framing =>
  reportCameraMove(p, d, fps).to;

const reportCameraAt = (p: Partial<ReportSliceSceneProps>, o: {frame: number; fps: number; durationInFrames: number}) => {
  const {from, to, pre} = reportCameraMove(p, o.durationInFrames, o.fps, o.frame);
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

/** What a report-slice scene hands to the next one on a `continue`: the car's wheel turn (the road runs on). */
export const reportCarry = (p: Partial<ReportSliceSceneProps>, durationInFrames: number, fps: number): Record<string, unknown> => {
  const c = carOptions(p);
  const secs = durationInFrames / fps;
  return {
    revsFrom: simRevs(c, secs, fps),
    ...(wheelMode(c.wheels) === 'forward' ? {wheelFrom: wheelTurnRevs(c, secs, fps)} : {}),
  };
};

// ---------------------------------------------------------------- the insurer's hands

/** Eased piecewise path through keyed points (cubic in-out per span); holds before the first and after the last. */
const along = (keys: {at: number; v: V3}[], t: number): V3 => {
  if (t <= keys[0].at) return keys[0].v;
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i];
    const b = keys[i + 1];
    if (t < b.at) {
      const k = ease(t, a.at, b.at);
      return [a.v[0] + (b.v[0] - a.v[0]) * k, a.v[1] + (b.v[1] - a.v[1]) * k, a.v[2] + (b.v[2] - a.v[2]) * k];
    }
  }
  return keys[keys.length - 1].v;
};

/** The extra's gaze: to the tray as the sheet lands, down at the sheet for the stamp (room-local targets). */
const insurerGestures = (p: Partial<ReportSliceSceneProps>): Gesture[] => {
  const tray = trayAtOf(p);
  const pick = pickAtOf(p);
  const stamp = stampAtOf(p);
  const out: Gesture[] = [];
  if (tray !== null) out.push({pose: 'turn-to', at: tray - 0.2, target: INSURER.tray, hold: Math.max(0.3, (pick ?? tray + 0.8) - tray + 0.2), blend: 0.4});
  if (stamp !== null) out.push({pose: 'turn-to', at: stamp - 0.8, target: INSURER.sheet, hold: 1.0, blend: 0.4});
  return out;
};

/** Room-local → the seated figure's local frame (it faces +x: local +z = room +x, local +x = room −z). */
const toFig = (v: V3): V3 => {
  const f = INSURER.fig;
  return [f[2] - v[2], v[1] - f[1], v[0] - f[0]];
};
const fromFig = (v: V3): V3 => {
  const f = INSURER.fig;
  return [f[0] + v[2], f[1] + v[1], f[2] - v[0]];
};

const REST_R: V3 = [-0.16, 0.79, 0.4];
const REST_L: V3 = [0.17, 0.79, 0.4];
/** The reading pose: the sheet held up at the chest, tilted to the eyes. */
const READ: V3 = [-0.08, 1.0, 0.34];

/**
 * The insurer's hands, the sheet and the stamp at t (room-local). The near (right) hand does it all, so it reads from the
 * fixed camera: it fetches the tray's sheet (reading it when there is time), lays it in front, takes the stamp beside
 * it, stamps the sheet at `stampAt` and puts the stamp back. With little time between `pickAt` and `stampAt` the
 * moves compress (≥ 1.6 s: natural pace).
 */
const insurerState = (p: Partial<ReportSliceSceneProps>, t: number) => {
  const trayAt = trayAtOf(p);
  const pick = pickAtOf(p);
  const stamp = stampAtOf(p);
  const tray: V3 = [INSURER.tray[0], INSURER.tray[1] + 0.012, INSURER.tray[2]];
  const sRest: V3 = [INSURER.stamp[0], INSURER.stamp[1], INSURER.stamp[2]];
  const lay: V3 = [INSURER.sheet[0], INSURER.sheet[1], INSURER.sheet[2]];
  const grip = 0.15; // the hand above the stamp's foot
  let right: V3 = REST_R;
  let sheet: {pos: V3; tilt: number} | null = null;
  let stampPos: V3 = sRest;
  let mark = 0;
  if (trayAt !== null && t >= trayAt) {
    const drop = 1 - ease(t, trayAt, trayAt + 0.3);
    sheet = {pos: [tray[0], tray[1] + 0.18 * drop, tray[2]], tilt: 0};
  }
  const keys: {at: number; v: V3}[] = [];
  let holdSheet: [number, number] | null = null;
  let readSpan: [number, number] | null = null;
  let holdStamp: [number, number] | null = null;
  if (pick !== null && sheet) {
    const gap = stamp === null ? 99 : stamp - pick;
    const k = Math.min(1, gap / 1.6);
    const reads = gap >= 2.8;
    const grabAt = pick + 0.4 * k;
    const layAt = reads ? (stamp as number) - 0.8 : pick + 0.8 * k;
    keys.push({at: pick, v: REST_R}, {at: grabAt, v: toFig([tray[0], tray[1] + 0.02, tray[2]])});
    if (reads) keys.push({at: grabAt + 0.5, v: READ}, {at: layAt - 0.4, v: READ});
    keys.push({at: layAt, v: toFig([lay[0], lay[1] + 0.035, lay[2]])});
    holdSheet = [grabAt, layAt];
    if (reads) readSpan = [grabAt, layAt];
    if (stamp === null) keys.push({at: layAt + 0.4, v: REST_R});
  }
  if (stamp !== null) {
    const pre = keys.length ? keys[keys.length - 1].at : stamp - 1.0;
    const take = Math.max(pre + 0.08, stamp - 0.5);
    const lifted = Math.max(take + 0.06, stamp - 0.3);
    keys.push(
      ...(keys.length ? [] : [{at: stamp - 1.0, v: REST_R}]),
      {at: take, v: toFig([sRest[0], sRest[1] + grip, sRest[2]])},
      {at: lifted, v: toFig([sRest[0], sRest[1] + grip + 0.15, sRest[2]])},
      {at: stamp - 0.12, v: toFig([lay[0], lay[1] + grip + 0.17, lay[2]])},
      {at: stamp, v: toFig([lay[0], lay[1] + grip + 0.005, lay[2]])},
      {at: stamp + 0.2, v: toFig([lay[0], lay[1] + grip + 0.17, lay[2]])},
      {at: stamp + 0.5, v: toFig([sRest[0], sRest[1] + grip + 0.05, sRest[2]])},
      {at: stamp + 0.6, v: toFig([sRest[0], sRest[1] + grip, sRest[2]])},
      {at: stamp + 1.0, v: REST_R},
    );
    holdStamp = [take, stamp + 0.6];
    mark = t >= stamp ? 1 : 0;
  }
  if (keys.length) right = along(keys, t);
  const hand = fromFig(right);
  if (holdSheet && sheet) {
    if (t >= holdSheet[0] && t < holdSheet[1]) {
      const up = readSpan ? ease(t, readSpan[0], readSpan[0] + 0.5) * (1 - ease(t, readSpan[1] - 0.4, readSpan[1])) : 0;
      sheet = {pos: [hand[0], hand[1] - 0.03, hand[2]], tilt: up * 1.0};
    } else if (t >= holdSheet[1]) sheet = {pos: lay, tilt: 0};
  }
  if (holdStamp && t >= holdStamp[0] && t < holdStamp[1]) stampPos = [hand[0], hand[1] - grip, hand[2]];
  return {right, left: REST_L, sheet, stampPos, mark};
};

// ---------------------------------------------------------------- set pieces

const useOfficeMats = (mood: Mood) =>
  useMemo(() => {
    const m = MOODS[mood];
    const std = (c: string, r = 0.85, metal = 0) => new THREE.MeshStandardMaterial({color: raw(c), roughness: r, metalness: metal});
    return {
      cut: cutMaterial(),
      wall: std(m.wall, 0.95),
      floorReport: std(LAB[mood].floor, 0.9),
      floorInsurer: std(TOWER.stone, 0.85),
      desk: std(LAB[mood].bench, 0.6),
      wood: std(m.wood, 0.6),
      steel: std(REAL.steel, 0.4, 0.6),
      dark: std(REAL.labDark, 0.5),
      rack: std(REAL.labDark, 0.45, 0.2),
      unit: std(REAL.cabinet, 0.5, 0.3),
      vent: std(REAL.cable, 0.7),
      seat: std(REAL.seat, 0.85),
      monitorBack: std(REAL.labDark, 0.4),
      screenOff: std(REAL.panelOff, 0.15),
      screenOn: new THREE.MeshBasicMaterial({color: raw(m.ui)}),
      printer: std(m.appliance, 0.5),
      printerTop: std(REAL.labDark, 0.4),
      cabinet: std(TOWER.cabinetPaint, 0.6),
      tray: std(REAL.alu, 0.35, 0.6),
      stampBody: std(REAL.labDark, 0.4),
      stampKnob: std(REAL.cabinet, 0.4),
      ledA: new THREE.MeshBasicMaterial({color: raw(REAL.statusLed)}),
      ledG: new THREE.MeshBasicMaterial({color: raw(section.signalGreen)}),
      ledOff: new THREE.MeshBasicMaterial({color: raw(section.ledOff)}),
      leaf: std(section.leaf, 0.8),
      leafDark: std(section.leafDark, 0.8),
      pot: std(section.pot, 0.7),
      console: std(REAL.dash, 0.7),
      module: std(REAL.receiver, 0.5, 0.2),
    };
  }, [mood]);
type OfficeMats = ReturnType<typeof useOfficeMats>;

/** A cut office block (§ 3): floor slab, back and left walls, cut on top and at the front, hatched and inked. */
const OfficeBlock: React.FC<{w: number; d: number; floor: THREE.Material; mats: OfficeMats; ink: number}> = ({w, d, floor, mats, ink}) => {
  const x0 = -w / 2;
  const x1 = w / 2;
  const z0 = -d / 2;
  const z1 = d / 2;
  const T = WALL_T;
  const H = WALL_H;
  const c = mats.cut;
  const wl = mats.wall;
  const rects: Rect[] = [
    [
      [x0 - T, -SLAB, z1],
      [x1, 0, z1],
    ],
    [
      [x1, -SLAB, z0 - T],
      [x1, 0, z1],
    ],
    [
      [x1, 0, z0 - T],
      [x1, H, z0],
    ],
    [
      [x0 - T, 0, z1],
      [x0, H, z1],
    ],
  ];
  const top: V3[] = [
    [x0 - T, H, z0 - T],
    [x1, H, z0 - T],
    [x1, H, z0],
    [x0, H, z0],
    [x0, H, z1],
    [x0 - T, H, z1],
  ];
  const edges = top.map((q, i) => [q, top[(i + 1) % top.length]] as [V3, V3]);
  return (
    <group>
      {/* materials per face: +x, −x, +y, −y, +z, −z */}
      <mesh position={[(x0 - T + x1) / 2, -SLAB / 2, (z0 - T + z1) / 2]} material={[c, c, floor, c, c, c]} receiveShadow>
        <boxGeometry args={[w + T, SLAB, d + T]} />
      </mesh>
      <mesh position={[(x0 - T + x1) / 2, H / 2, z0 - T / 2]} material={[c, wl, c, wl, wl, wl]} castShadow receiveShadow>
        <boxGeometry args={[w + T, H, T]} />
      </mesh>
      <mesh position={[x0 - T / 2, H / 2, (z0 + z1) / 2]} material={[wl, wl, c, wl, c, wl]} castShadow receiveShadow>
        <boxGeometry args={[T, H, d]} />
      </mesh>
      <CutOutline rects={rects} edges={edges} thickness={ink} />
    </group>
  );
};

/** A grey sheet texture: paper with grey bars (a report's look, nothing readable); `stamped` adds an ink frame. */
const sheetTexture = (stamped: boolean) => {
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 166;
  const x = c.getContext('2d')!;
  x.fillStyle = TOWER.paper;
  x.fillRect(0, 0, 128, 166);
  x.fillStyle = REAL.chipInk;
  x.fillRect(14, 14, 58, 9);
  const bars = [92, 80, 96, 70, 88, 60, 94, 76];
  bars.forEach((b, i) => x.fillRect(14, 36 + i * 11, b, 4));
  x.fillRect(14, 132, 40, 16);
  x.fillRect(60, 124, 14, 24);
  x.fillRect(80, 116, 14, 32);
  if (stamped) {
    x.strokeStyle = TOWER.engrave;
    x.lineWidth = 6;
    x.save();
    x.translate(64, 83);
    x.rotate(-0.18);
    x.strokeRect(-26, -16, 52, 32);
    x.fillStyle = TOWER.engrave;
    x.fillRect(-16, -4, 32, 8);
    x.restore();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
};
const SHEET = {w: 0.216, l: 0.279};

const useSheetMats = () =>
  useMemo(
    () => ({
      plain: new THREE.MeshStandardMaterial({map: sheetTexture(false), roughness: 0.9}),
      stamped: new THREE.MeshStandardMaterial({map: sheetTexture(true), roughness: 0.9}),
      edge: new THREE.MeshStandardMaterial({color: raw(TOWER.paper), roughness: 0.9}),
    }),
    [],
  );

/** A sheet lying flat (its long side along z), or tilted up about its near edge by `tilt` rad. */
const Sheet: React.FC<{pos: V3; tilt?: number; yaw?: number; stamped?: boolean; mats: ReturnType<typeof useSheetMats>}> = ({
  pos,
  tilt = 0,
  yaw = 0,
  stamped = false,
  mats,
}) => (
  <group position={pos} rotation={[0, yaw, 0]}>
    <group rotation={[0, 0, tilt]}>
      <mesh rotation={[-Math.PI / 2, 0, Math.PI / 2]} material={stamped ? mats.stamped : mats.plain} castShadow receiveShadow>
        <planeGeometry args={[SHEET.l, SHEET.w]} />
      </mesh>
    </group>
  </group>
);

const Desk: React.FC<{size: [number, number, number]; mats: OfficeMats; top?: THREE.Material}> = ({size: [w, h, d], mats, top}) => (
  <group>
    <mesh geometry={roundedBox(w, 0.035, d, 0.008)} material={top ?? mats.desk} position={[0, h - 0.0175, 0]} castShadow receiveShadow />
    {[-1, 1].map((sx) =>
      [-1, 1].map((sz) => (
        <mesh key={`${sx}${sz}`} material={mats.steel} position={[sx * (w / 2 - 0.05), (h - 0.035) / 2, sz * (d / 2 - 0.05)]} castShadow>
          <boxGeometry args={[0.04, h - 0.035, 0.04]} />
        </mesh>
      )),
    )}
  </group>
);

/** An office chair: five-star base, column, seat and back; its back toward `yaw` + π. */
const Chair: React.FC<{mats: OfficeMats; yaw?: number}> = ({mats, yaw = 0}) => (
  <group rotation={[0, yaw, 0]}>
    {[0, 1, 2, 3, 4].map((i) => (
      <mesh key={i} material={mats.dark} position={[Math.sin((i * 2 * Math.PI) / 5) * 0.14, 0.05, Math.cos((i * 2 * Math.PI) / 5) * 0.14]} rotation={[0, (i * 2 * Math.PI) / 5, 0]}>
        <boxGeometry args={[0.03, 0.03, 0.28]} />
      </mesh>
    ))}
    <mesh material={mats.steel} position={[0, 0.27, 0]}>
      <cylinderGeometry args={[0.025, 0.025, 0.42, 12]} />
    </mesh>
    <mesh geometry={roundedBox(0.46, 0.08, 0.44, 0.03)} material={mats.seat} position={[0, 0.5, 0]} castShadow />
    <mesh geometry={roundedBox(0.44, 0.52, 0.06, 0.03)} material={mats.seat} position={[0, 0.85, -0.24]} rotation={[-0.1, 0, 0]} castShadow />
  </group>
);

/** A monitor on a foot; its screen faces +z (dark, or `lit` blank). */
const Monitor: React.FC<{mats: OfficeMats; lit?: boolean}> = ({mats, lit = false}) => (
  <group>
    <mesh material={mats.dark} position={[0, 0.008, 0]}>
      <boxGeometry args={[0.2, 0.016, 0.16]} />
    </mesh>
    <mesh material={mats.dark} position={[0, 0.13, -0.03]}>
      <boxGeometry args={[0.04, 0.24, 0.025]} />
    </mesh>
    <mesh geometry={roundedBox(0.58, 0.35, 0.03, 0.008)} material={mats.monitorBack} position={[0, 0.36, 0]} castShadow />
    <mesh material={lit ? mats.screenOn : mats.screenOff} position={[0, 0.365, 0.0155]}>
      <planeGeometry args={[0.55, 0.31]} />
    </mesh>
  </group>
);

/** A server rack (front toward +z): dark frame, grey units with neutral status LEDs blinking on the video clock. */
const Rack: React.FC<{mats: OfficeMats; seed: string; clock: number}> = ({mats, seed, clock}) => {
  const {w, d, h} = REPORT.rack;
  const units = 9;
  return (
    <group>
      <mesh geometry={roundedBox(w, h, d, 0.012)} material={mats.rack} position={[0, h / 2, 0]} castShadow receiveShadow />
      {[...Array(units).keys()].map((i) => {
        const y = 0.2 + i * 0.19;
        return (
          <group key={i} position={[0, y, d / 2 + 0.006]}>
            <mesh material={mats.unit}>
              <boxGeometry args={[w - 0.08, 0.15, 0.012]} />
            </mesh>
            <mesh material={mats.vent} position={[-0.06, 0, 0.007]}>
              <planeGeometry args={[0.3, 0.06]} />
            </mesh>
            {[0, 1, 2].map((k) => {
              const phase = random(`${seed}-ph-${i}-${k}`);
              const rate = 1.5 + 3 * random(`${seed}-rt-${i}-${k}`);
              const on = random(`${seed}-${i}-${k}-${Math.floor(clock * rate + phase * 7)}`) > 0.35;
              return (
                <mesh key={k} material={on ? (k === 2 ? mats.ledG : mats.ledA) : mats.ledOff} position={[0.15 + k * 0.035, 0.03, 0.008]}>
                  <planeGeometry args={[0.016, 0.016]} />
                </mesh>
              );
            })}
          </group>
        );
      })}
    </group>
  );
};

const PRINT_OUT = 0.9;
const PRINT_DROP = 0.25;

/** A laser printer on a low cabinet (output toward +z): sheets push out of the slot and drop onto the stack. */
const Printer: React.FC<{mats: OfficeMats; sheets: ReturnType<typeof useSheetMats>; t: number; prints: number[]; stack: number}> = ({
  mats,
  sheets,
  t,
  prints,
  stack,
}) => {
  const cab = REPORT.printer.cab;
  const done = prints.filter((s) => t >= s + PRINT_OUT + PRINT_DROP).length;
  const moving = prints.filter((s) => t >= s && t < s + PRINT_OUT + PRINT_DROP);
  const n = Math.min(40, stack + done);
  const trayY = cab + 0.075;
  const slotY = cab + 0.2;
  return (
    <group>
      <mesh geometry={roundedBox(0.66, cab, 0.5, 0.01)} material={mats.cabinet} position={[0, cab / 2, 0]} castShadow receiveShadow />
      <mesh geometry={roundedBox(0.5, 0.3, 0.44, 0.02)} material={mats.printer} position={[0, cab + 0.15, -0.04]} castShadow receiveShadow />
      <mesh geometry={roundedBox(0.46, 0.02, 0.34, 0.006)} material={mats.printerTop} position={[0, cab + 0.305, -0.08]} />
      {/* the output slot and tray */}
      <mesh material={mats.vent} position={[0, slotY, 0.181]}>
        <planeGeometry args={[0.32, 0.018]} />
      </mesh>
      <mesh material={mats.printerTop} position={[0, trayY - 0.008, 0.25]}>
        <boxGeometry args={[0.3, 0.012, 0.2]} />
      </mesh>
      {/* the stack */}
      {n > 0 ? (
        <>
          <mesh material={sheets.edge} position={[0, trayY + (n * 0.004) / 2, 0.24]} castShadow>
            <boxGeometry args={[SHEET.w, n * 0.004, SHEET.l * 0.8]} />
          </mesh>
          <Sheet pos={[0, trayY + n * 0.004 + 0.001, 0.24]} mats={sheets} yaw={Math.PI / 2} />
        </>
      ) : null}
      {moving.map((s) => {
        const out = ease(t, s, s + PRINT_OUT);
        const drop = ease(t, s + PRINT_OUT, s + PRINT_OUT + PRINT_DROP);
        const z = 0.04 + 0.2 * out;
        const y = slotY + (trayY + n * 0.004 + 0.005 - slotY) * drop;
        return <Sheet key={s} pos={[0, y, z]} mats={sheets} yaw={Math.PI / 2} tilt={0} />;
      })}
    </group>
  );
};

const FilingCabinet: React.FC<{mats: OfficeMats}> = ({mats}) => (
  <group>
    <mesh geometry={roundedBox(0.46, 1.3, 0.6, 0.01)} material={mats.cabinet} position={[0, 0.65, 0]} castShadow receiveShadow />
    {[0, 1, 2, 3].map((i) => (
      <mesh key={i} material={mats.steel} position={[0, 0.25 + i * 0.3, 0.305]}>
        <boxGeometry args={[0.14, 0.02, 0.02]} />
      </mesh>
    ))}
  </group>
);

const Plant: React.FC<{mats: OfficeMats}> = ({mats}) => (
  <group>
    <mesh material={mats.pot} position={[0, 0.2, 0]} castShadow>
      <cylinderGeometry args={[0.17, 0.13, 0.4, 20]} />
    </mesh>
    {[
      [0, 0.62, 0, 0.22, false],
      [-0.12, 0.82, 0.04, 0.16, true],
      [0.11, 0.86, -0.03, 0.17, false],
      [0.02, 1.02, 0.02, 0.13, true],
    ].map(([x, y, z, r, dk], i) => (
      <mesh key={i} material={dk ? mats.leafDark : mats.leaf} position={[x as number, y as number, z as number]} castShadow>
        <sphereGeometry args={[r as number, 14, 10]} />
      </mesh>
    ))}
  </group>
);

// ---------------------------------------------------------------- anchors

/**
 * A named point on screen (px) at a frame, for callouts and the detail box's leader: 'module' (the telematics module
 * under the dash), 'phone' (the dark cupholder phone), 'top' (the car's roof at its highest point), 'company' (the
 * report office, above its desks), 'rack' (the path's rack node), 'printer' (the printer's output), 'insurer' (the
 * insurer's desk), 'insurer:screen' (the insurer's monitor), 'tray' (the desk tray), 'head' (the path's head while a
 * leg draws, else its end). Undefined for an unknown name.
 */
export const reportAnchorOnScreen = (
  p: Partial<ReportSliceSceneProps>,
  anchor: string,
  o: {frame: number; fps: number; durationInFrames: number},
): [number, number] | undefined => {
  const cam = reportCameraAt(p, o);
  const t = o.frame / o.fps;
  const ys = ysOf(p);
  const rr = roomOf(p.report);
  const ir = roomOf(p.insurer);
  const at = (v: V3) => projectToFrame(cam, v);
  if (anchor === 'module') return at(modulePos(p));
  if (anchor === 'phone') return at(phonePos(p));
  if (anchor === 'top') {
    const c = carOptions(p);
    return at(toWorld(c, [-0.265, 1.7, 0]));
  }
  if (anchor === 'company' || anchor === 'report') return at([rr.x - 0.7, ys.report + 1.6, rr.z - 0.6]);
  if (anchor === 'rack') return at(reportPathPoints(p).leg1[6]);
  if (anchor === 'printer') return at([rr.x + REPORT.printer.x, ys.report + REPORT.printer.cab + 0.32, rr.z + REPORT.printer.z + 0.1]);
  if (anchor === 'insurer') return at([ir.x + INSURER.desk.x, ys.insurer + INSURER.desk.h + 0.05, ir.z + INSURER.desk.z]);
  if (anchor === 'insurer:screen') return at([ir.x + INSURER.monitor[0], ys.insurer + INSURER.monitor[1] + 0.55, ir.z + INSURER.monitor[2]]);
  if (anchor === 'tray') return at([ir.x + INSURER.tray[0], ys.insurer + INSURER.tray[1] + 0.03, ir.z + INSURER.tray[2]]);
  if (anchor === 'head') {
    const {leg1, leg2} = reportPathPoints(p);
    if (!p.path) return undefined;
    const k = pathKeys(p.path);
    const d1 = ease(t, k.at, k.companyAt);
    const d2 = ease(t, k.leg2At, k.insurerAt);
    return at(d2 > 0 ? pointAlong(leg2, d2) : pointAlong(leg1, d1));
  }
  return undefined;
};

// ---------------------------------------------------------------- the scene

/**
 * R, the data chain: a generic connected sedan on its street (bottom), a report company's office (middle) and an
 * insurer's office (top), stacked on one sheet; an orange path carries the car's data up the chain and fades.
 */
export const ReportSliceScene: React.FC<ReportSliceSceneProps> = (props) => {
  const {durationInFrames, mood = 'day', startFrame = 0} = props;
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const clock = startFrame / fps + t;
  const m = MOODS[mood];
  const ys = ysOf(props);
  const rr = roomOf(props.report);
  const ir = roomOf(props.insurer);
  const car = carOptions(props);
  const {from, to, pre} = reportCameraMove(props, durationInFrames, fps, frame);
  const cam = reportCameraAt(props, {frame, fps, durationInFrames});
  const camD = cam.position.distanceTo(cam.look);
  const inkK = Math.max(0.15, Math.min(4, camD / 12.75));
  const ink = INK * inkK;
  // § 5 path weight (the vibration path's core), held on screen from close-ups to the stack (as the ruler)
  const coreR = 0.0225 * Math.max(0.25, Math.min(3.5, camD / 30));
  const nodeR = coreR * NODE_SCALE;
  const sky = useMemo(() => new THREE.MeshBasicMaterial({map: skyTexture(mood), fog: false}), [mood]);
  sky.color.setScalar(1 / m.exposure);
  const mats = useOfficeMats(mood);
  const sheets = useSheetMats();

  // the path
  const pts = reportPathPoints(props);
  const len1 = polylineLength(pts.leg1);
  const len2 = polylineLength(pts.leg2);
  const total = len1 + len2;
  const k = props.path ? pathKeys(props.path) : null;
  const fadeAt = k?.fadeAt ?? null;
  const d1 = k ? ease(t, k.at, k.companyAt) : 0;
  const d2 = k ? ease(t, k.leg2At, k.insurerAt) : 0;
  // segments split into ≤ 0.5 m pieces so the fade sweeps up smoothly; each piece's share along the whole path
  const pieces: {a: V3; b: V3; u: number}[] = [];
  const addLeg = (leg: V3[], drawn: number, offset: number) => {
    if (drawn <= 0) return;
    const L = polylineLength(leg);
    const stop = drawn * L;
    let run = 0;
    for (let i = 1; i < leg.length; i++) {
      const a = leg[i - 1];
      const b = leg[i];
      const l = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
      const n = Math.max(1, Math.ceil(l / 0.5));
      for (let j = 0; j < n; j++) {
        const s0 = run + (l * j) / n;
        const s1 = run + (l * (j + 1)) / n;
        if (s0 >= stop) break;
        const e = Math.min(s1, stop);
        const lerp = (s: number): V3 => {
          const q = l > 0 ? (s - run) / l : 0;
          return [a[0] + (b[0] - a[0]) * q, a[1] + (b[1] - a[1]) * q, a[2] + (b[2] - a[2]) * q];
        };
        pieces.push({a: lerp(s0), b: lerp(e), u: (offset + (s0 + e) / 2) / total});
      }
      run += l;
    }
  };
  addLeg(pts.leg1, d1, 0);
  addLeg(pts.leg2, d2, len1);
  const corners: {at: V3; u: number}[] = [];
  {
    let s = 0;
    pts.leg1.slice(1, -1).forEach((q, i) => {
      s += Math.hypot(...([0, 1, 2].map((c) => q[c] - pts.leg1[i][c]) as V3));
      if (s / len1 <= d1) corners.push({at: q, u: s / total});
    });
    s = 0;
    pts.leg2.slice(1, -1).forEach((q, i) => {
      s += Math.hypot(...([0, 1, 2].map((c) => q[c] - pts.leg2[i][c]) as V3));
      if (s / len2 <= d2) corners.push({at: q, u: (len1 + s) / total});
    });
  }
  // the pulses: leave the module every `pulseEvery`, 1.2 s up leg 1; on up leg 2 if it is drawn when they arrive
  const TRAVEL1 = 1.2;
  const TRAVEL2 = 1.2;
  const pulses: {at: V3; u: number}[] = [];
  let rackSwell = 0;
  let traySwell = 0;
  if (k) {
    const n1 = Math.floor((t - k.pulsesAt) / k.pulseEvery);
    for (let n = Math.max(0, n1 - 4); n <= n1; n++) {
      const e = k.pulsesAt + n * k.pulseEvery;
      if (e > k.until || e > t) continue;
      const age = t - e;
      if (age < TRAVEL1) {
        const u1 = age / TRAVEL1;
        if (u1 <= d1) pulses.push({at: pointAlong(pts.leg1, u1), u: (u1 * len1) / total});
      } else {
        const arrive = e + TRAVEL1;
        const a2 = age - TRAVEL1;
        rackSwell = Math.max(rackSwell, 1 - Math.min(1, (t - arrive) / 0.35));
        if (arrive >= k.insurerAt && a2 < TRAVEL2) {
          const u2 = a2 / TRAVEL2;
          pulses.push({at: pointAlong(pts.leg2, u2), u: (len1 + u2 * len2) / total});
        } else if (arrive >= k.insurerAt && a2 < TRAVEL2 + 0.35) traySwell = Math.max(traySwell, 1 - (a2 - TRAVEL2) / 0.35);
      }
    }
  }
  const head = d2 > 0 && d2 < 1 ? pointAlong(pts.leg2, d2) : d1 > 0 && d1 < 1 ? pointAlong(pts.leg1, d1) : null;
  const headU = d2 > 0 && d2 < 1 ? (len1 + d2 * len2) / total : (d1 * len1) / total;
  // node dots
  const mAt = moduleAtOf(props);
  const moduleGlow = mAt !== null && t >= mAt ? ease(t, mAt, mAt + 0.2) * fadeK(fadeAt, t, 0) : 0;
  const rackGlow = k && t >= k.companyAt ? fadeK(fadeAt, t, len1 / total) : 0;
  const trayGlow = k && t >= k.insurerAt ? fadeK(fadeAt, t, 1) : 0;
  // rings: rising from the module through the cut roof; none after the fade
  const mod = modulePos(props);
  const ringScale = Math.max(1, camD / 19);
  const rings = (props.rings ?? []).filter((r) => t >= r && t - r < PULSE_LIFE && (fadeAt === null || r < fadeAt));
  // the printer, the insurer
  const prints = [...(props.print ?? []), ...(props.printAt ?? [])].sort((a, b) => a - b);
  const ins = insurerState(props, t);
  const insLook: Partial<CastLook> | undefined = props.insurerLook === 'b' ? EXTRA_B : undefined;
  const ph = phonePos(props);
  const consoleFloor = toWorld(car, layoutOf(car).driver)[1];
  const consoleTop = ph[1] - PHONE_H / 2 + PHONE_SINK;
  // the screen turned to the driver's eyes (§ 3: phones face their owners), never to the camera
  const eyes = toWorld(car, [layoutOf(car).driver[0] - 0.05, 0, layoutOf(car).driver[2]]);
  const phoneYaw = Math.atan2(eyes[0] - ph[0], eyes[2] - ph[2]);

  return (
    <AbsoluteFill>
      <SectionStage mood={mood} post={{focusY: 0.5}} ao far={260}>
        <SectionCamera
          from={from}
          to={to}
          pre={pre}
          durationInFrames={durationInFrames}
          drift={props.drift ?? 0.08}
          clockOffset={startFrame / fps}
          fitClip
          farMin={200}
        />
        <SectionLights mood={mood} target={[0.3, ys.insurer / 2, 0]} lamp={0} extent={8} figureSpot={false} />
        {/* the sky backdrop near behind the sheet (at −165 m, as the charge slice's, the AO pass darkened a corner) */}
        <mesh position={[0, ys.insurer / 2, -40]} material={sky}>
          <planeGeometry args={[260, 160]} />
        </mesh>

        {/* bottom: the car on its street */}
        <SlicedCar {...car} cameraDistance={camD} />
        {props.module === false ? null : (
          <group position={mod}>
            <mesh geometry={roundedBox(0.17, 0.05, 0.12, 0.008)} material={mats.module} castShadow />
            <mesh material={mats.dark} position={[0, 0.03, 0]}>
              <boxGeometry args={[0.04, 0.012, 0.04]} />
            </mesh>
          </group>
        )}
        {props.phone === false || carHasPhone(props) ? null : (
          <group position={ph}>
            {/* the centre console from the floor, its cupholder holding the phone 5 cm deep */}
            <mesh
              geometry={roundedBox(0.55, consoleTop - consoleFloor, 0.2, 0.02)}
              material={mats.console}
              position={[toWorld(car, [0.22, 0, 0])[0], (consoleTop + consoleFloor) / 2 - ph[1], 0]}
              castShadow
              receiveShadow
            />
            {/* screen toward the driver's eyes, tilted back; dark (asleep), no node dot */}
            <group rotation={[0, phoneYaw, 0]}>
              <group rotation={[-0.3, 0, 0]}>
                <RealPhone scale={PHONE_H / 1.9} shadows={false} />
              </group>
            </group>
          </group>
        )}

        {/* middle: the report company */}
        <group position={[rr.x, ys.report, rr.z]}>
          <OfficeBlock w={rr.w} d={rr.d} floor={mats.floorReport} mats={mats} ink={ink} />
          {REPORT.desks.map((x, i) => (
            <group key={i} position={[x, 0, REPORT.desk.z]}>
              <Desk size={[REPORT.desk.w, REPORT.desk.h, REPORT.desk.d]} mats={mats} />
              <group position={[0, REPORT.desk.h, -0.12]}>
                <Monitor mats={mats} />
              </group>
              <group position={[0.05, 0, 0.62]}>
                <Chair mats={mats} yaw={Math.PI + (i ? 0.3 : -0.2)} />
              </group>
            </group>
          ))}
          {REPORT.rackZ.map((z, i) => (
            <group key={i} position={[REPORT.rackX, 0, z]}>
              <Rack mats={mats} seed={`report-rack-${i}`} clock={clock} />
            </group>
          ))}
          <group position={[REPORT.printer.x, 0, REPORT.printer.z]}>
            <Printer mats={mats} sheets={sheets} t={t} prints={prints} stack={props.stack ?? 5} />
          </group>
        </group>

        {/* top: the insurer */}
        <group position={[ir.x, ys.insurer, ir.z]}>
          <OfficeBlock w={ir.w} d={ir.d} floor={mats.floorInsurer} mats={mats} ink={ink} />
          <group position={[INSURER.desk.x, 0, INSURER.desk.z]}>
            <Desk size={[INSURER.desk.w, INSURER.desk.h, INSURER.desk.d]} mats={mats} top={mats.wood} />
          </group>
          {/* the monitor turned to the extra (its back to the camera side), lit; its light on the face */}
          <group position={INSURER.monitor} rotation={[0, -Math.PI / 2, 0]}>
            <Monitor mats={mats} lit />
          </group>
          <pointLight
            position={[INSURER.monitor[0] - 0.3, INSURER.monitor[1] + 0.4, INSURER.monitor[2]]}
            color={raw(section.screenLight)}
            intensity={0.6 * Math.PI}
            distance={0.9}
            decay={1}
          />
          <group position={[INSURER.fig[0] - 0.02, 0, INSURER.fig[2]]}>
            <Chair mats={mats} yaw={Math.PI / 2} />
          </group>
          <Figure
            who="extra"
            mood={mood}
            position={INSURER.fig}
            rotationY={Math.PI / 2}
            seed="report-insurer"
            phone={false}
            hands={[ins.right, ins.left]}
            gestures={insurerGestures(props)}
            look={insLook ?? {top: CAST.extra.top}}
            clockOffset={startFrame / fps}
          />
          {/* the tray */}
          <group position={INSURER.tray}>
            <mesh material={mats.tray} position={[0, 0.004, 0]} receiveShadow>
              <boxGeometry args={[0.27, 0.008, 0.34]} />
            </mesh>
            {[-1, 1].map((s) => (
              <mesh key={s} material={mats.tray} position={[s * 0.131, 0.02, 0]}>
                <boxGeometry args={[0.008, 0.04, 0.34]} />
              </mesh>
            ))}
            <mesh material={mats.tray} position={[0, 0.02, -0.166]}>
              <boxGeometry args={[0.27, 0.04, 0.008]} />
            </mesh>
          </group>
          {ins.sheet ? <Sheet pos={ins.sheet.pos} tilt={ins.sheet.tilt} mats={sheets} stamped={ins.mark > 0} /> : null}
          {/* the stamp: a dark block with a grey knob */}
          <group position={ins.stampPos}>
            <mesh geometry={roundedBox(0.11, 0.04, 0.075, 0.008)} material={mats.stampBody} position={[0, 0.02, 0]} castShadow />
            <mesh material={mats.stampBody} position={[0, 0.075, 0]}>
              <cylinderGeometry args={[0.016, 0.02, 0.075, 12]} />
            </mesh>
            <mesh material={mats.stampKnob} position={[0, 0.125, 0]}>
              <sphereGeometry args={[0.035, 14, 10]} />
            </mesh>
          </group>
          <group position={INSURER.cabinet}>
            <FilingCabinet mats={mats} />
          </group>
          <group position={INSURER.plant}>
            <Plant mats={mats} />
          </group>
        </group>

        {/* the system: rings, the path, pulses, node dots (all faded from the car upward at `path.fadeAt`) */}
        {rings.map((r) => (
          <RadioPulse
            key={r.toFixed(3)}
            position={[mod[0], mod[1] + 0.25 + 0.9 * (t - r), mod[2]]}
            age={t - r}
            reach={0.42 * ringScale}
            weight={1.25 * ringScale}
            arc={Math.PI * 0.75}
          />
        ))}
        {pieces.map((s, i) => (
          <GlowSegment key={i} a={s.a} b={s.b} radius={coreR} glow={fadeK(fadeAt, t, s.u)} />
        ))}
        {corners.map((c, i) => (
          <GlowNode key={`c${i}`} at={c.at} radius={coreR * 1.02} glow={fadeK(fadeAt, t, c.u)} />
        ))}
        {pulses.map((q, i) => (
          <GlowNode key={`p${i}`} at={q.at} radius={coreR * 1.9} dot glow={fadeK(fadeAt, t, q.u)} />
        ))}
        <GlowNode at={[mod[0], mod[1], mod[2] + 0.065]} radius={nodeR} glow={moduleGlow} />
        <GlowNode at={pts.leg1[6]} radius={nodeR} glow={rackGlow} swell={1 + 0.35 * rackSwell} />
        <GlowNode at={pts.leg2[pts.leg2.length - 1]} radius={nodeR} glow={trayGlow} swell={1 + 0.35 * traySwell} />
        <OrangeLight position={head ?? mod} intensity={head ? 0.6 * fadeK(fadeAt, t, headU) : 0} reach={1.2} />
      </SectionStage>
    </AbsoluteFill>
  );
};
