import React, {useMemo} from 'react';
import {AbsoluteFill, random, useCurrentFrame, useVideoConfig} from 'remotion';
import * as THREE from 'three';
import {CAR, CITY, HIGHWAY, MOODS, TWINS, WINTER, type Mood} from '../theme';
import {raw} from '../three/plaster';
import {DrivingCar} from '../three/real/DrivingCar';
import type {ShellProfile} from '../three/real/CarShell';
import {CAR_LAYOUT} from '../three/real/RealCar';
import {
  drivingOf,
  engineCrank,
  engineTurns,
  layoutOf,
  simRevs,
  SlicedCar,
  slicedCarPoint,
  toWorld,
  wheelTurnRevs,
  type CarCorner,
  type FootKey,
  type SignalLens,
  type SlicedCarOptions,
  type V3,
} from '../three/real/SlicedCar';
import {capRevs, cappedTravel, wheelMode, wheelSmear, type WheelMode} from '../three/real/wheelMotion';
import {CITY_ROAD} from '../three/section/CarCityRoad';
import {formatOf, projectToFrame, SectionCamera, sectionCameraAt, type Framing} from '../three/section/SectionCamera';
import {SectionLights, SectionStage} from '../three/section/SectionStage';
import {skyTexture} from '../three/section/textures';
import {framingAtKeys, keyedValue, speedAt, type CameraKey, type Keyed, type SpeedKey} from './keyframes';

/*
 * A, the corner as a twin section (No. 014 `hybrid-city`, N4). Two city lanes drawn one above the other like two
 * sections on one sheet (the `charge-slice` / `race-slice` grammar), sky between and around them. Each lane is a cut
 * `SlicedCar` on its own city road (`road: 'city'`: lane, curb, sidewalk, stop lines, post signals), facing −x: the
 * hybrid on top (YOU, YOU's car colour), its gas twin below (an extra, `CHARGE.teslaPaint`), the same body. A generic
 * lead car (whole, uncut: `DrivingCar`) ahead of each does the same stop-and-go a moment earlier, its brake lamps
 * lighting by themselves. The lanes' signals are keyed together (`lights`), the twins share their speed keys
 * (`driving`), and by default their brake lamps and pedal feet follow those keys (`autoPedals`). `dressing: 'winter'`
 * re-dresses the corner for a very cold day (N6: snowbanks, packed snow, bare trees, frost, a paler sky, light snow).
 *
 * World: x along the street (the cars drive toward −x, each standing at x 0 while its road scrolls), y up, z toward the
 * camera; the bottom lane's road at y 0, the top lane's at `laneGap`. Times are seconds into the scene.
 *
 * The loop (`loop`): the scene solves each car's carried turn so that at its last frame every wheel's drawn angle is
 * frame 0's (modulo the rim's spoke pitch), the street's scroll is frame 0's (modulo the storefronts' 12 m period) and
 * the four-cylinder's crank is frame 0's (modulo a cam turn): with the cars stopped on frame 0's marks, the last frame
 * is frame 0.
 */

type Which = 'top' | 'bottom';
const WHICH: Which[] = ['top', 'bottom'];
const R = CAR_LAYOUT.wheelR;
const WHEEL_C = 2 * Math.PI * R;
/** The cut sedan's nose and tail (car frame x) and the whole sedan's half length: for the lead's gap. */
const NOSE_X = 2.42;
const LEAD_HALF = 2.42;
/** The storefronts' and slabs' repeat (m): the loop brings the street's scroll back to it. */
const STREET_PERIOD = 12;

/** The lead car ahead of a twin. */
export type TwinLead = {
  /** Metres between the twin's nose and the lead's tail while both stand. Default 1.0. */
  gap?: number;
  /** The lead does the twin's stop-and-go this many seconds earlier (it pulls away first and brakes first). Default 0.6. */
  lag?: number;
  /** Its own speed keys (rev/s) instead; `gap` then holds at the scene's start. */
  driving?: SpeedKey[];
  /** Body paint (a theme token). Default `CITY.carBodies[4]` (top, dark sage) / `[3]` (bottom, warm taupe). */
  paint?: string;
  /** Shape. Default 'crossover' (a different car from the twins). */
  shape?: ShellProfile;
  /** Its brake lamps, 0 → 1 (a constant or keys). Default: lit while it slows or stands. */
  brake?: Keyed;
  /** The plate's invented characters. Default per lane. */
  plate?: string;
};

/** One twin: any `SlicedCar` option over the lane's defaults, plus its lead car (false: none). */
export type TwinCar = Partial<SlicedCarOptions> & {lead?: TwinLead | false};

/** What a continuing scene carries per car (set by Explainer). */
type TwinCarry = {revsFrom: number; wheelFrom?: number; crankFrom?: number};

export type CityTwinFraming =
  | 'stack'
  | 'stackLow'
  | 'bays'
  | 'twinBrakes'
  | 'wide'
  | 'hybrid'
  | 'hybridFront'
  | 'bay'
  | 'battery'
  | 'bottomCar';

export type CityTwinSceneProps = {
  durationInFrames: number;
  /** Day (default) or Night. */
  mood?: Mood;
  /** 'mild' (default) or 'winter' (N6): the same corner on a very cold day. */
  dressing?: 'mild' | 'winter';
  /**
   * The top twin. Defaults: `{variant: 'hybrid', shape: 'sedan', nearWheels: 'whole', driver: 'you', storefronts: true,
   * roadAhead: 14}` (YOU's car colour), a lead car.
   */
  top?: TwinCar;
  /**
   * The bottom twin; false for none (the top lane alone, e.g. the winter beat). Defaults: `{variant: 'gas', shape:
   * 'sedan', nearWheels: 'whole', driver: 'extra', paint: TWINS.gasPaint, roadAhead: 14, engineRun: running}`, a lead.
   */
  bottom?: TwinCar | false;
  /** Both twins' speed keys (rev/s; a car's own `driving` wins). Default: standing. Key on one clock across a run. */
  driving?: SpeedKey[];
  /** Both lanes' corners (a car's own `corners` wins); each corner without its own `lights` takes `lights`. */
  corners?: CarCorner[];
  /** The signals' keys, shared by every corner in both lanes (synced): `{at, state}`, 'red' before the first. */
  lights?: {at: number; state: SignalLens}[];
  /** Height between the two lanes' roads (m). Default 3.0 (with 'stack' both cars fit between the title block and the captions). */
  laneGap?: number;
  /** 'city' (default) or 'highway' (F8: the twins cruising in two stacked highway lanes; corners and leads ignored). */
  road?: 'city' | 'highway';
  /**
   * The twins' brake lamps and pedal feet from their speed keys (lamps lit while slowing or standing, the foot on the
   * brake then, on the accelerator while speeding up or cruising), unless the car gives its own `brakeLights` / `foot`.
   * Default true.
   */
  autoPedals?: boolean;
  /** Land every turning thing on frame 0's state at the last frame (see the file comment). Default false. */
  loop?: boolean;
  /**
   * Which lanes show their corners' post signals: 'top' (default: the bottom lane's signal head would stand behind the
   * top lane's block at any gap that fits 'stack'; both lanes' signals are keyed together anyway) or 'both'.
   */
  signals?: 'top' | 'both';
  /** Falling snow (winter: default on): `density` (default 1), `gusts` (s: a gust carries the flakes across). */
  snow?: {density?: number; gusts?: number[]} | boolean;
  /** How both cars' wheels turn (a car's own `wheels` wins). Default 'forward'. */
  wheels?: WheelMode;
  /** Framing preset (default 'stack'). */
  framing?: CityTwinFraming;
  camera?: {from: Framing; to?: Framing};
  /** Camera keyframes from the starting framing (as `car-slice`). */
  cameraKeys?: CameraKey[];
  /** Push toward the subject, units/s (default 0.05). */
  push?: number;
  /** Idle sideways drift, ± units (default 0.08). */
  drift?: number;
  location?: string;
  transition?: 'auto' | 'continue' | 'glide' | 'cut' | 'dissolve' | 'slide' | 'follow';
  glide?: number;
  cameraFrom?: Framing;
  cameraGlide?: number;
  startFrame?: number;
  /** Set by Explainer on a continue / glide: each car's turn so far. */
  carryTop?: TwinCarry;
  carryBottom?: TwinCarry;
};

const gapOf = (p: Partial<CityTwinSceneProps>) => p.laneGap ?? 3.0;
const laneY = (p: Partial<CityTwinSceneProps>, w: Which) => (w === 'top' ? gapOf(p) : 0);

/** The framings (world; set on test stills). The top car's own framings sit on its lane. */
export const cityTwinFramings = (p: Partial<CityTwinSceneProps>): Record<CityTwinFraming, Framing> => {
  const g = gapOf(p);
  return {
    stack: {look: [-3.3, g / 2 - 1.15, 0.3], distance: 58},
    stackLow: {look: [-3.3, g / 2 + 0.9, 0.3], distance: 60},
    bays: {look: [-1.5, g / 2 + 0.75, 0.45], distance: 12.5},
    twinBrakes: {look: [-1.35, g / 2 + 0.4, 0.8], distance: 11.5},
    wide: {look: [-3.5, g / 2 + 0.2, 0.0], distance: 70},
    hybrid: {look: [0.25, g + 0.55, 0.3], distance: 16.5},
    hybridFront: {look: [-1.35, g + 0.55, 0.55], distance: 5.2},
    bay: {look: [-1.4, g + 0.55, 0.4], distance: 4.4},
    battery: {look: [0.62, g + 0.3, 0.6], distance: 3.4},
    bottomCar: {look: [0.25, 0.55, 0.3], distance: 16.5},
  };
};

/** The lamps lit (0 → 1) from speed keys at t: while slowing or standing. */
const autoLamps = (drv: SpeedKey[], t: number) => {
  const v = speedAt(drv, t, 0.8);
  const dv = (speedAt(drv, t + 1 / 60, 0.8) - speedAt(drv, t - 1 / 60, 0.8)) * 30;
  const standing = 1 - Math.max(0, Math.min(1, (v - 0.04) / 0.1));
  const braking = Math.max(0, Math.min(1, (-dv - 0.05) / 0.2));
  return Math.max(standing, braking);
};

/** The pedal foot from speed keys: on the brake while slowing or standing, on the accelerator while speeding up or cruising. */
const autoFoot = (drv: SpeedKey[]): FootKey[] => {
  const ks = [...drv].sort((a, b) => a.at - b.at);
  const first = ks.length && ks[0].at <= 0 ? ks[0].speed : 0;
  const out: FootKey[] = [first < 0.05 ? {at: -1, pose: 'brake', press: 0.7} : {at: -1, pose: 'accel', press: 0.3}];
  let prev = first;
  for (const k of ks) {
    if (k.at <= 0 && k === ks[0]) continue;
    if (k.speed < prev - 0.02) out.push({at: k.at - 0.25, pose: 'brake', press: k.speed < 0.05 ? 0.7 : 0.45});
    else if (k.speed > prev + 0.02) {
      out.push({at: k.at - 0.3, pose: 'accel', press: 0.6});
      out.push({at: k.at + 0.9, pose: 'accel', press: 0.3});
    }
    prev = k.speed;
  }
  return out;
};

const DEFAULTS: Record<Which, Partial<SlicedCarOptions>> = {
  top: {variant: 'hybrid', shape: 'sedan', nearWheels: 'whole', driver: 'you', storefronts: true, roadAhead: 14, clusterSpeed: 'auto', roadHalf: 14},
  bottom: {
    variant: 'gas',
    shape: 'sedan',
    nearWheels: 'whole',
    driver: 'extra',
    paint: TWINS.gasPaint,
    roadAhead: 14,
    storefronts: false,
    clusterSpeed: 'auto',
    roadHalf: 14,
    engineRun: [{at: -1, on: true}],
  },
};

const twinOf = (p: Partial<CityTwinSceneProps>, w: Which): TwinCar | null => {
  if (w === 'bottom' && p.bottom === false) return null;
  return (w === 'top' ? p.top : (p.bottom as TwinCar | undefined)) ?? {};
};

const mod = (x: number, m: number) => ((x % m) + m) % m;

/** A twin's `SlicedCar` options (merged, the loop's carried turns solved), without the per-frame auto lamps. */
const carBase = (p: Partial<CityTwinSceneProps>, w: Which, fps: number): Partial<SlicedCarOptions> | null => {
  const own = twinOf(p, w);
  if (!own) return null;
  const {lead: _lead, ...car} = own;
  void _lead;
  const road = p.road ?? 'city';
  const corners = (car.corners ?? p.corners ?? []).map((c) => ({
    ...c,
    lights: c.lights ?? p.lights,
    signal: c.signal ?? (w === 'bottom' && (p.signals ?? 'top') === 'top' ? false : undefined),
  }));
  const o: Partial<SlicedCarOptions> = {
    ...DEFAULTS[w],
    mood: p.mood ?? 'day',
    dressing: p.dressing,
    road,
    driving: p.driving ?? [{at: 0, speed: 0}],
    wheels: p.wheels,
    ...car,
    corners: road === 'city' ? corners : undefined,
    startFrame: p.startFrame,
    ...(w === 'top' ? p.carryTop : p.carryBottom),
  };
  if ((p.autoPedals ?? true) && !o.foot) o.foot = autoFoot(drivingOf(o));
  if (p.loop) {
    const T = (p as {durationInFrames?: number}).durationInFrames ?? 0;
    const secs = T / fps;
    const z = {...o, revsFrom: 0, wheelFrom: 0, crankFrom: 0};
    const dist = simRevs(z, secs, fps) * WHEEL_C;
    o.revsFrom = -mod(dist, STREET_PERIOD) / WHEEL_C;
    o.wheelFrom = -mod(wheelTurnRevs(z, secs, fps), 0.2);
    if (engineTurns(o)) o.crankFrom = -mod(engineCrank(z, secs), 4 * Math.PI);
    // the drivers' idle (breathing, blinks) lands on frame 0's clock too
    o.figureClock = -secs;
  }
  return o;
};

/** A twin's options at t (adds the auto brake lamps). */
const carAt = (p: Partial<CityTwinSceneProps>, w: Which, t: number, fps: number) => {
  const o = carBase(p, w, fps);
  if (!o) return null;
  if ((p.autoPedals ?? true) && o.brakeLights === undefined) return {...o, brakeLights: autoLamps(drivingOf(o), t)};
  return o;
};

/** The lead car's state at t: its centre x (world), drawn wheel travel (m) and blur, lamps. */
const leadAt = (p: Partial<CityTwinSceneProps>, w: Which, t: number, fps: number) => {
  const own = twinOf(p, w);
  const car = carBase(p, w, fps);
  if (!own || !car || own.lead === false || (p.road ?? 'city') !== 'city') return null;
  const L = own.lead ?? {};
  const gap = L.gap ?? 1.0;
  const lag = L.lag ?? 0.6;
  const drv = drivingOf(car);
  // metres the twin has gone since the scene's start (V), the lead's speed keys
  const V = (s: number) => (simRevs(car, s, fps) - (car.revsFrom ?? 0)) * WHEEL_C;
  const leadDrv: SpeedKey[] = L.driving ?? drv.map((k) => ({at: k.at - lag, speed: k.speed}));
  // the gap ahead of the twin's nose: the lag model keeps `gap` whenever both stand
  const ahead = L.driving
    ? gap + simRevs({...car, driving: L.driving, revsFrom: 0}, t, fps) * WHEEL_C - V(t)
    : gap + V(t + lag) - V(t);
  const cap = capRevs(fps);
  // its wheels: the twin's drawn turn `lag` s later (so the loop's solved angle holds), or its own capped turn
  const drawnRevs = L.driving ? cappedTravel((x) => speedAt(L.driving!, x, 0.8), t, cap) : wheelTurnRevs(car, t + lag, fps);
  const v = speedAt(leadDrv, t, 0.8);
  const realBlur = v * 2 * Math.PI * (0.5 / fps);
  const blur = wheelMode(car.wheels) === 'legacy' ? realBlur : wheelSmear(realBlur, v, cap);
  const lamps = L.brake !== undefined ? keyedValue(L.brake, t, 0) : autoLamps(leadDrv, t);
  return {
    x: -(NOSE_X + ahead + LEAD_HALF),
    travelled: drawnRevs * WHEEL_C,
    blur,
    lamps,
    paint: L.paint ?? CITY.carBodies[w === 'top' ? 4 : 3],
    shape: L.shape ?? ('crossover' as ShellProfile),
    plate: L.plate ?? (w === 'top' ? '6RTD 418' : '7KVA 052'),
  };
};

const twinCameraMove = (
  p: Partial<CityTwinSceneProps>,
  durationInFrames: number,
  fps: number,
  frame?: number,
): {from: Framing; to: Framing; pre?: {from: Framing; hold: number; move: number; ease: 'cubic'}} => {
  const preset = cityTwinFramings(p)[p.framing ?? 'stack'];
  if (p.cameraKeys && p.cameraKeys.length) {
    const base = p.camera?.from ?? preset;
    const f = framingAtKeys(p.cameraKeys, base, frame === undefined ? Infinity : frame / fps);
    return {from: f, to: f};
  }
  const push = p.push ?? 0.05;
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

export const cityTwinCameraStart = (p: Partial<CityTwinSceneProps>, d: number, fps: number): Framing =>
  twinCameraMove({...p, cameraFrom: undefined, cameraGlide: undefined}, d, fps, 0).from;
export const cityTwinCameraEnd = (p: Partial<CityTwinSceneProps>, d: number, fps: number): Framing =>
  twinCameraMove(p, d, fps).to;

/** What a continuing scene carries: each twin's road and wheel turn and its crank. */
export const cityTwinCarry = (p: Partial<CityTwinSceneProps>, durationInFrames: number, fps: number): Record<string, unknown> => {
  const T = durationInFrames / fps;
  const out: Record<string, unknown> = {};
  for (const w of WHICH) {
    const o = carBase({...p, durationInFrames} as Partial<CityTwinSceneProps>, w, fps);
    if (!o) continue;
    out[w === 'top' ? 'carryTop' : 'carryBottom'] = {
      revsFrom: simRevs(o, T, fps),
      ...(wheelMode(o.wheels) === 'forward' ? {wheelFrom: wheelTurnRevs(o, T, fps)} : {}),
      ...(engineTurns(o) ? {crankFrom: engineCrank(o, T)} : {}),
    };
  }
  return out;
};

const cameraAtFrame = (p: Partial<CityTwinSceneProps>, o: {frame: number; fps: number; durationInFrames: number}) => {
  const {from, to, pre} = twinCameraMove(p, o.durationInFrames, o.fps, o.frame);
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

/**
 * A named point on screen (px): '<part>:top|bottom' for a twin's 'engine', 'motor', 'battery', 'inverter' (the hybrid's),
 * 'nose', 'tail', 'roof' (= 'top', just above the roof: car tags), 'frontWheel', 'rearWheel', 'cluster', 'head'; 'lead:top|bottom'
 * (the lead car's roof); 'signal:top|bottom' (the corner's signal head, the first corner); 'lane:top|bottom' (the lane's cut face).
 */
export const cityTwinAnchorOnScreen = (
  p: Partial<CityTwinSceneProps>,
  anchor: string,
  o: {frame: number; fps: number; durationInFrames: number},
): [number, number] | undefined => {
  const [name, which = 'top'] = anchor.split(':') as [string, Which | undefined];
  const w: Which = which === 'bottom' ? 'bottom' : 'top';
  const pp = {...p, durationInFrames: o.durationInFrames} as Partial<CityTwinSceneProps>;
  const car = carBase(pp, w, o.fps);
  if (!car) return undefined;
  const y0 = laneY(p, w);
  const cam = cameraAtFrame(p, o);
  const lift = (q: V3): V3 => [q[0], q[1] + y0, q[2]];
  if (name === 'top' || name === 'roof') return projectToFrame(cam, lift(toWorld(car, [-0.2, 1.75, 0.2])));
  if (name === 'head') {
    const d = layoutOf(car).driver;
    return projectToFrame(cam, lift(toWorld(car, [d[0] - 0.05, d[1] + 1.4, d[2]])));
  }
  if (name === 'lead') {
    const l = leadAt(pp, w, o.frame / o.fps, o.fps);
    return l ? projectToFrame(cam, [l.x, y0 + 1.6, 0]) : undefined;
  }
  if (name === 'lane') return projectToFrame(cam, [0, y0 - 0.35, CITY_ROAD.z]);
  if (name === 'signal') {
    const c = (car.corners ?? [])[0];
    if (!c) return undefined;
    const dist = (tt: number) => simRevs(car, tt, o.fps) * WHEEL_C;
    const t = o.frame / o.fps;
    const x = -(CAR_LAYOUT.axleX.front + c.ahead) + (dist(t) - dist(c.when ?? 0)) - (c.post ?? CITY_ROAD.postPast);
    return projectToFrame(cam, [x, y0 + CITY_ROAD.curb + 3.0, CITY_ROAD.postZ]);
  }
  const pt = slicedCarPoint(car, name);
  return pt ? projectToFrame(cam, lift(pt)) : undefined;
};

/** Falling snow (winter): seeded flakes in a box round the lanes, falling, swaying, carried by gusts. */
const Snow: React.FC<{t: number; density: number; gusts: number[]; y0: number; y1: number; mood: Mood}> = ({t, density, gusts, y0, y1, mood}) => {
  const n = Math.round(420 * density);
  const geo = useMemo(() => new THREE.SphereGeometry(1, 6, 4), []);
  const mat = useMemo(() => new THREE.MeshBasicMaterial({color: '#ffffff', transparent: true, opacity: 0.9, depthWrite: false}), []);
  mat.color.copy(raw(WINTER.flake)).multiplyScalar(0.95 / MOODS[mood].exposure);
  const mesh = useMemo(() => new THREE.InstancedMesh(geo, mat, 600), [geo, mat]);
  const X = 22;
  const H = y1 - y0;
  const gust = gusts.reduce((a, g) => a + 5 * Math.max(0, Math.min(1, (t - g) / 1.4)) ** 2 * (3 - 2 * Math.max(0, Math.min(1, (t - g) / 1.4))), 0);
  const m4 = new THREE.Matrix4();
  for (let i = 0; i < 600; i++) {
    if (i >= n) {
      m4.makeScale(0, 0, 0);
      mesh.setMatrixAt(i, m4);
      continue;
    }
    const r = (k: string) => random(`snow-${i}-${k}`);
    const fall = 0.6 + 0.5 * r('v');
    const y = y1 - mod(r('y') * H + t * fall, H);
    const x = mod(r('x') * X + 0.25 * Math.sin(t * (0.6 + r('w')) + 6 * r('p')) + gust * (0.7 + 0.6 * r('g')), X) - X / 2 - 1;
    const z = -3 + 5.6 * r('z');
    const s = 0.022 + 0.02 * r('s');
    m4.makeScale(s, s, s).setPosition(x, y, z);
    mesh.setMatrixAt(i, m4);
  }
  mesh.instanceMatrix.needsUpdate = true;
  mesh.frustumCulled = false;
  return <primitive object={mesh} />;
};

/**
 * The highway's far edge (`road: 'highway'`): delineator posts every 10 m on the far shoulder, riding the road with the
 * drive (galvanized posts, a white reflector plate; never orange), clipped to the block's length.
 */
const VergePosts: React.FC<{scroll: number; half: number}> = ({scroll, half}) => {
  const planes = useMemo(() => [new THREE.Plane(new THREE.Vector3(1, 0, 0), half), new THREE.Plane(new THREE.Vector3(-1, 0, 0), half)], [half]);
  const mats = useMemo(
    () => ({
      post: new THREE.MeshStandardMaterial({color: raw(HIGHWAY.galvanized), roughness: 0.5, metalness: 0.4, clippingPlanes: planes}),
      plate: new THREE.MeshStandardMaterial({color: raw(HIGHWAY.signWhite), roughness: 0.35, clippingPlanes: planes}),
    }),
    [planes],
  );
  const P = 10;
  const n0 = Math.floor((-half - 1 - scroll) / P);
  const n1 = Math.ceil((half + 1 - scroll) / P);
  return (
    <>
      {[...Array(Math.max(0, n1 - n0 + 1)).keys()].map((k) => {
        const x = scroll + (n0 + k) * P;
        return (
          <group key={n0 + k} position={[x, 0, -3.9]}>
            <mesh material={mats.post} position={[0, 0.55, 0]} castShadow>
              <boxGeometry args={[0.07, 1.1, 0.07]} />
            </mesh>
            <mesh material={mats.plate} position={[0.045, 0.92, 0]}>
              <boxGeometry args={[0.01, 0.18, 0.08]} />
            </mesh>
          </group>
        );
      })}
    </>
  );
};

/**
 * A, the corner as a twin section (No. 014, see the file comment): two stacked city lanes, the hybrid over its gas twin,
 * lead cars, synced signals, auto brake lamps and feet, the winter dressing, the loop.
 */
export const CityTwinScene: React.FC<CityTwinSceneProps> = (props) => {
  const {durationInFrames, mood = 'day', startFrame = 0} = props;
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const m = MOODS[mood];
  const winter = props.dressing === 'winter';
  const {from, to, pre} = twinCameraMove(props, durationInFrames, fps, frame);
  const sky = useMemo(() => new THREE.MeshBasicMaterial({map: skyTexture(mood), fog: false}), [mood]);
  sky.color.setScalar(1 / m.exposure);
  const skyFoot = useMemo(() => new THREE.MeshBasicMaterial({fog: false}), []);
  skyFoot.color.copy(raw(m.sky[2])).multiplyScalar(1 / m.exposure);
  const pale = useMemo(() => new THREE.MeshBasicMaterial({transparent: true, depthWrite: false, fog: false}), []);
  pale.color.copy(raw(WINTER.skyTint)).multiplyScalar(1 / m.exposure);
  pale.opacity = winter ? 0.4 : 0;
  const camNow = cameraAtFrame(props, {frame, fps, durationInFrames});
  const camD = camNow.position.distanceTo(camNow.look);
  const g = gapOf(props);
  const snowOn = winter && props.snow !== false;
  const snowOpt = typeof props.snow === 'object' ? props.snow : {};
  const lanes = WHICH.map((w) => ({w, car: carAt(props, w, t, fps), lead: leadAt(props, w, t, fps)})).filter((l) => l.car);

  return (
    <AbsoluteFill>
      <SectionStage mood={mood} post={{focusY: 0.5, aoRadius: 0.35 * Math.max(0.06, Math.min(1, camD / 10))}} ao far={220}>
        <SectionCamera
          from={from}
          to={to}
          pre={pre}
          durationInFrames={durationInFrames}
          drift={props.drift ?? 0.08}
          clockOffset={startFrame / fps}
          // the far two-lane framings: clip planes fitted to the framing (a fixed near 0.1 z-fought the shop windows and
          // the lead cars' glass at distance 58)
          fitClip
          farMin={150}
        />
        <SectionLights mood={mood} target={[0, g / 2 + 0.8, 0]} lamp={0} />
        {/* the sky: big enough for the wide two-lane framings (a far plane, square to the camera's yaw) */}
        <mesh position={[-6, 25 + g / 2, -40]} material={sky}>
          <planeGeometry args={[320, 100]} />
        </mesh>
        {/* under it, the horizon's colour on down (the far framings look below the gradient's foot) */}
        <mesh position={[-6, -75 + g / 2, -40]} material={skyFoot}>
          <planeGeometry args={[320, 100]} />
        </mesh>
        <mesh position={[-6, -25 + g / 2, -39.9]} material={pale} visible={winter}>
          <planeGeometry args={[320, 200]} />
        </mesh>
        {lanes.map(({w, car, lead}) => (
          <group key={w} position={[0, laneY(props, w), 0]}>
            <SlicedCar {...(car as SlicedCarOptions)} cameraDistance={camD} />
            {(props.road ?? 'city') === 'highway' ? (
              <VergePosts scroll={simRevs(car as SlicedCarOptions, t, fps) * WHEEL_C} half={(car as SlicedCarOptions).roadHalf ?? 14} />
            ) : null}
            {lead ? (
              <DrivingCar
                mood={mood}
                at={{x: lead.x, z: 0, yaw: -Math.PI / 2}}
                travelled={lead.travelled}
                blur={lead.blur}
                body="extra"
                paint={lead.paint}
                shape={lead.shape}
                tail={0}
                brake={lead.lamps}
                driver="extra"
                plate={lead.plate}
                clockOffset={props.loop ? -durationInFrames / fps : startFrame / fps}
              />
            ) : null}
          </group>
        ))}
        {snowOn ? (
          <Snow
            t={t + startFrame / fps}
            density={snowOpt.density ?? 1}
            gusts={(snowOpt.gusts ?? []).map((x) => x + startFrame / fps)}
            y0={-0.5}
            y1={g + 6}
            mood={mood}
          />
        ) : null}
      </SectionStage>
    </AbsoluteFill>
  );
};

/** YOU's car colour, the hybrid's paint (sticker card squares use it too). */
export const HYBRID_PAINT = CAR.day.bodies.you;
/** The gas twin's paint. */
export const GAS_TWIN_PAINT = TWINS.gasPaint;
