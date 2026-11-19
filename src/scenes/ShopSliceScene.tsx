import React, {useMemo} from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import * as THREE from 'three';
import {CHARGE, EXTRA_B, HIGHWAY, MOODS, PLUGS, REAL, TWINS, type Mood} from '../theme';
import {raw, roundedBox} from '../three/plaster';
import {GhostLines} from '../three/real/GhostCar';
import {OIL_SHADES, type OilShade} from '../three/real/OilKit';
import {SlicedCar, slicedCarPoint, type SlicedCarOptions, type SlicedCarProps, type V3} from '../three/real/SlicedCar';
import {InkArrowAlong, inkArrowState} from '../three/real/WearKit';
import {applyAlbedo, applyEnv, useAlbedo, useEnvStrength, useStudioEnv} from '../three/real/useStudioEnv';
import {cutMaterial, CutOutline, INK, type Rect} from '../three/section/cutLook';
import {Figure} from '../three/section/Figure';
import {formatOf, projectToFrame, SectionCamera, sectionCameraAt, SECTION_ANGLE, type Framing} from '../three/section/SectionCamera';
import {SectionLights, SectionStage} from '../three/section/SectionStage';
import {skyTexture} from '../three/section/textures';
import {ease, framingAtKeys, keyedValue, type CameraKey, type Keyed} from './keyframes';

/*
 * S, the shop (No. 021 `ev-oil`, N8; style guide v0.18.18 § 3 "The shop"). A service shop cut open as two bays stacked on
 * one sheet (the twin-section grammar), Day, no practicals, the fixed angle. Each bay is the teardown room's block at shop
 * size (8.0 wide × 6.0 deep, walls 3.6 high): a cut floor slab (`CHARGE.concrete`) on a hatched ground block, the back
 * and left walls standing (`PLUGS.garageWall`, cut on top and at the front), no floor grid; a two-post lift (the far
 * post standing, `HIGHWAY.galvanized`; the near post is in front of the section, so cut away), its arms
 * (`CHARGE.cabinetDark`) and rubber pads (`REAL.rubber`) under the body, never through a cut face; a tool chest at the left
 * wall. The cars are cut `SlicedCar`s (any option, the story slice's same cars), raised on the lift, engines off, lamps off,
 * wheels whole and still. Nothing readable anywhere.
 *
 * Jobs (props a later video re-dresses): the drain pan on its stand and the dark stream into it (`drain`), the plain jug
 * and the fresh stream into the filler (`pour`), the EV's brake-fluid reservoir cap (`cap`), the cabin filter sliding out
 * of the cut dash (`cabinFilter`), ink tire-rotation arrows (`rotateArrows`), the ghost of a drain pan for a job not done
 * (`ghostPan`, § 3 Ghost outline "an absent job"), a step stool. Mechanics: the grey extra ('a') and `EXTRA_B` ('b'),
 * walking and acting from keys (never tagged).
 *
 * World: x along the bays (the cars face −x, centred at x 0), y up (the bottom bay's floor at 0, the top bay's at
 * `bayGap`), z toward the camera; the floor slab's front face (z = `SHOP.z1`) is the section. Times are seconds into the
 * scene; any key may lie outside it.
 */

export type ShopWhich = 'top' | 'bottom';
const WHICH: ShopWhich[] = ['top', 'bottom'];

export const SHOP = {
  x0: -4.4,
  x1: 3.6,
  /** The section through the room (just past the near wheels; the lift's near post stands in front of it), the back wall. */
  z1: 1.15,
  z0: 1.15 - 6.0,
  wallH: 3.6,
  wallT: 0.16,
  ground: 0.6,
  /** The lift's far post (x, z) and its section. */
  post: [0.05, -1.28] as [number, number],
  postW: 0.26,
  /** The tool chest's centre (x, z) at the left wall. */
  chest: [-3.75, -3.4] as [number, number],
};

/** A bay's job and prop keys (seconds into the scene). */
export type ShopBay = {
  /**
   * The car: any `SlicedCar` option over the bay's defaults (top: the gas crossover, `TWINS.gasPaint`, its oil system on
   * and the engine off; bottom: the rear-drive EV crossover in YOU's colour), or false for an empty bay. No driver.
   */
  car?: Partial<SlicedCarOptions> | false;
  /** The car's raise above the floor (m; the lift's arms), a constant or keys (lowering 1.2 s). Default 1.6 (a mechanic stands under the floor; the roof stays under the wall top). */
  lift?: Keyed;
  /** The drain pan on its stand under the sump (`under`) or at [x, z]; false for none. Default: under the sump in a gas bay. */
  drainPan?: boolean | {at?: [number, number]};
  /** The plain oil jug (grey, a dark cap, no label): on the floor by the pan, carried during `pour`. Default: in a gas bay. */
  jug?: boolean;
  /** The step platform the pourer stands on (dark grey, 0.7 m). Default: with `pour`. */
  stool?: boolean | {at?: [number, number]};
  /** The tool chest at the left wall. Default true. */
  chest?: boolean;
  /**
   * The drain: from `at` the sump's plug is out and a dark stream (the oil's shade) falls into the pan over `for` s
   * (default 1.0); the sump's level falls to empty with it (unless the car gives `oilLevel`).
   */
  drain?: {at: number; for?: number};
  /**
   * The fill: from `at` a fresh stream (`REAL.oilFresh`) runs from the jug into the filler over `for` s (default 1.2); the
   * sump refills from the bottom in the fresh shade (unless the car gives `oilLevel` / `oilColor`).
   */
  pour?: {at: number; for?: number};
  /** The oil's shade before the fill (default 'old'). */
  oilBefore?: OilShade;
  /** The ghost drain pan (§ 3 an absent job): draws on from `at` (0.8 s), fades from `fadeAt` (0.7 s; default at + 1.3), under `under`. */
  ghostPan?: {at: number; fadeAt?: number; under?: 'gearbox' | 'sump'};
  /** The EV's brake-fluid reservoir (under the hood cut): its cap off from `at` for `for` s (default 0.8). */
  cap?: {at: number; for?: number};
  /** The cabin filter slides out of the cut dash at `at` (0.5 s) and back in from `back` (default at + 0.6). */
  cabinFilter?: {at: number; back?: number};
  /** Two ink arrows between the near tires (a rotation), one each way, drawing from `at` (0.6 s), fading from `fadeAt`. */
  rotateArrows?: {at: number; fadeAt?: number};
};

/** A named place in a bay (floor x, z) for mechanics: by the sump, the nose, the filler's stool, the gearbox, the wheels, the chest, the post, out. */
export type ShopSpot = 'sump' | 'nose' | 'stool' | 'gearbox' | 'frontWheel' | 'rearWheel' | 'reservoir' | 'dash' | 'chest' | 'post' | 'out' | 'tail';
export type ShopAct = 'drain' | 'pour' | 'wipe' | 'cap' | 'kneel' | 'button' | 'filter' | 'reach';
export type ShopMechanicKey =
  | {at: number; do: 'walkTo'; to: ShopSpot | [number, number]; speed?: number}
  | {at: number; do: 'act'; act: ShopAct; for?: number; target?: V3}
  | {at: number; do: 'glance'; to: ShopSpot | 'car' | V3; hold?: number};
export type ShopMechanic = {
  /** Which bay. */
  bay: ShopWhich;
  /** 'a' (the grey extra) or 'b' (`EXTRA_B`). */
  look?: 'a' | 'b';
  /** Where they stand before the first key (a spot or [x, z]). Default 'chest'. */
  start?: ShopSpot | [number, number];
  keys?: ShopMechanicKey[];
};

export type ShopFraming = 'shop' | 'gasLift' | 'evLift' | 'evService' | 'topBay' | 'bottomBay';

export type ShopSliceSceneProps = {
  durationInFrames: number;
  /** Day (default) or Night (no practicals either way). */
  mood?: Mood;
  /** The top bay (default: the gas car on its lift). */
  top?: ShopBay;
  /** The bottom bay (default: the EV on its lift); false for none. */
  bottom?: ShopBay | false;
  /** Height of the top bay's floor over the bottom's (m). Default 5.2 (a raised crossover's roof clears the top bay's slab). */
  bayGap?: number;
  mechanics?: ShopMechanic[];
  framing?: ShopFraming;
  camera?: {from: Framing; to?: Framing};
  cameraKeys?: CameraKey[];
  /** Push toward the subject, units/s (default 0.05). */
  push?: number;
  drift?: number;
  location?: string;
  transition?: 'auto' | 'continue' | 'glide' | 'cut' | 'dissolve' | 'slide' | 'follow';
  glide?: number;
  cameraFrom?: Framing;
  cameraGlide?: number;
  startFrame?: number;
};

const gapOf = (p: Partial<ShopSliceSceneProps>) => p.bayGap ?? 5.2;
const bayY = (p: Partial<ShopSliceSceneProps>, w: ShopWhich) => (w === 'top' ? gapOf(p) : 0);
const bayOf = (p: Partial<ShopSliceSceneProps>, w: ShopWhich): ShopBay | null => (w === 'bottom' && p.bottom === false ? null : ((w === 'top' ? p.top : (p.bottom as ShopBay | undefined)) ?? {}));

const BAY_CAR: Record<ShopWhich, Partial<SlicedCarOptions>> = {
  top: {variant: 'gas', shape: 'crossover', paint: TWINS.gasPaint, driver: 'extra', engineRun: [{at: -1, on: false}], oilSystem: {}},
  bottom: {variant: 'ev', shape: 'crossover', driver: 'you', evDrive: 'rear'},
};

/** A bay's car options (lift excluded), with the drain and fill driving the sump's level and shade. */
const carOf = (bay: ShopBay, w: ShopWhich): Partial<SlicedCarOptions> | null => {
  if (bay.car === false) return null;
  const own = bay.car ?? {};
  const base = {...BAY_CAR[w], ...own};
  const gas = base.variant === 'gas';
  const o: Partial<SlicedCarOptions> = {
    nearWheels: 'whole',
    clusterSpeed: 'auto',
    clusterBlank: true,
    tireText: false,
    driverShown: false,
    brakeLights: 0,
    driving: [{at: -100, speed: 0}],
    ...base,
    ground: false,
    road: 'street',
  } as Partial<SlicedCarOptions>;
  if (gas && own.oilLevel === undefined && (bay.drain || bay.pour)) {
    const keys: {at: number; value: number}[] = [{at: -100, value: 0.55}];
    if (bay.drain) keys.push({at: bay.drain.at + 0.1, value: 0.55}, {at: bay.drain.at + (bay.drain.for ?? 1.0), value: 0.04});
    if (bay.pour) keys.push({at: bay.pour.at + 0.15, value: 0.04}, {at: bay.pour.at + (bay.pour.for ?? 1.2), value: 0.55});
    o.oilLevel = keys;
  }
  if (gas && own.oilColor === undefined && bay.pour) o.oilColor = [{at: -100, shade: bay.oilBefore ?? 'old'}, {at: bay.pour.at, shade: 'fresh', for: 0.2}];
  return o;
};

/** The raise at t (m). */
const liftAt = (bay: ShopBay, t: number) => Math.max(0, keyedValue(bay.lift, t, 1.6));

/** A car point (world, in its bay, raised). */
const carPointW = (p: Partial<ShopSliceSceneProps>, w: ShopWhich, name: string, t: number): V3 | undefined => {
  const bay = bayOf(p, w);
  const car = bay ? carOf(bay, w) : null;
  if (!bay || !car) return undefined;
  const q = slicedCarPoint(car, name);
  return q ? [q[0], q[1] + liftAt(bay, t) + bayY(p, w), q[2]] : undefined;
};

/** EV parts the jobs use (car frame, the front bay and dash; mirrored to world by `toW`). */
/**
 * EV parts the jobs use (car frame; mirrored to world by `toW`): the brake-fluid reservoir standing in the open front bay
 * (in front of the firewall's cut, so it shows through the hood cut), and the cabin filter's slot in the HVAC box's
 * intake, at the dash's cut face (the filter slides out toward the camera, drawn only while it is out).
 */
const EV_PARTS = {reservoir: [1.32, 0.8, 0.36] as V3, filter: [0.9, 0.975, 0.66] as V3};
/** How far the cabin filter slides out of the dash's cut face (m). */
const FILTER_OUT = 0.22;
const toW = (q: V3): V3 => [-q[0], q[1], q[2]];

/** A mechanic's floor spot (x, z) in a bay. */
const spotXZ = (p: Partial<ShopSliceSceneProps>, w: ShopWhich, s: ShopSpot | [number, number]): [number, number] => {
  if (Array.isArray(s)) return s;
  const sump = carPointW(p, w, 'drainPlug', 0);
  const gbx = carPointW(p, w, 'gearDrain', 0);
  switch (s) {
    case 'sump':
      return [(sump?.[0] ?? -1.66) - 0.5, 0.0];
    case 'nose':
      return [-2.95, 0.55];
    case 'stool':
      return [-2.3, 0.8];
    case 'gearbox':
      return [(gbx?.[0] ?? 1.36) + 0.5, 0.55];
    case 'frontWheel':
      return [-1.35, 1.05];
    case 'rearWheel':
      return [1.35, 1.05];
    case 'reservoir':
      return [-2.0, 1.0];
    case 'dash':
      return [-0.6, 1.0];
    case 'chest':
      return [SHOP.chest[0] + 0.55, SHOP.chest[1] + 0.8];
    case 'post':
      return [SHOP.post[0] + 0.6, SHOP.post[1] + 0.55];
    case 'tail':
      return [2.9, 0.5];
    case 'out':
      return [SHOP.x1 + 1.5, 0.4];
  }
};

/**
 * The framings (world; set on test stills). 'shop': both bays and both cars, sky above for the bars card; 'gasLift': the
 * gas car on its lift, its sump and plug over the drain pan, the filler, both mechanics; 'evLift': the EV's rear drive
 * unit and the floor under it (the ghost pan's place); 'evService': the EV whole on its lift (the reservoir under the
 * hood cut, the dash, both near wheels); 'topBay' / 'bottomBay': one bay whole.
 */
export const shopFramings = (p: Partial<ShopSliceSceneProps>): Record<ShopFraming, Framing> => {
  const g = gapOf(p);
  return {
    shop: {look: [-0.35, g / 2 + 2.6, 0.0], distance: 25},
    gasLift: {look: [-1.7, g + 1.6, 0.3], distance: 9.0},
    evLift: {look: [1.2, 1.35, 0.35], distance: 5.6},
    evService: {look: [0.2, 1.95, 0.4], distance: 17},
    topBay: {look: [-0.3, g + 1.6, 0.0], distance: 12.5},
    bottomBay: {look: [-0.3, 1.6, 0.0], distance: 12.5},
  };
};

const shopMove = (p: Partial<ShopSliceSceneProps>, d: number, fps: number, frame?: number) => {
  const preset = shopFramings(p)[p.framing ?? 'shop'];
  if (p.cameraKeys && p.cameraKeys.length) {
    const base = p.camera?.from ?? preset;
    const f = framingAtKeys(p.cameraKeys, base, frame === undefined ? Infinity : frame / fps);
    return {from: f, to: f, pre: undefined};
  }
  const pre = p.cameraGlide && p.cameraFrom ? {from: p.cameraFrom, hold: 0, move: Math.max(1, Math.round(p.cameraGlide * fps)), ease: 'cubic' as const} : undefined;
  if (p.camera) return {from: p.camera.from, to: p.camera.to ?? p.camera.from, pre};
  const secs = Math.max(0, d - (pre ? pre.move : 0)) / fps;
  const c = pre ? undefined : p.cameraFrom;
  const same = c && c.look.every((v, i) => Math.abs(v - preset.look[i]) < 1e-6);
  const from = c && same ? c : preset;
  return {from, to: {look: from.look, distance: from.distance - (p.push ?? 0.05) * secs}, pre};
};

export const shopCameraStart = (p: Partial<ShopSliceSceneProps>, d: number, fps: number): Framing => shopMove({...p, cameraFrom: undefined, cameraGlide: undefined}, d, fps, 0).from;
export const shopCameraEnd = (p: Partial<ShopSliceSceneProps>, d: number, fps: number): Framing => shopMove(p, d, fps).to;

const cameraAt = (p: Partial<ShopSliceSceneProps>, o: {frame: number; fps: number; durationInFrames: number}) => {
  const {from, to, pre} = shopMove(p, o.durationInFrames, o.fps, o.frame);
  return sectionCameraAt({from, to, pre, frame: o.frame, fps: o.fps, durationInFrames: o.durationInFrames, drift: p.drift ?? 0, clockOffset: (p.startFrame ?? 0) / o.fps, format: formatOf(p)});
};

/**
 * A named point on screen (px): '<part>:top|bottom' for a bay's car point ('sump' = 'oilPan', 'drainPlug', 'filler',
 * 'gearbox', 'gearPool', 'gearDrain', 'roof', 'nose', 'frontWheel', 'rearWheel', 'ringGap', 'filter', ...), raised with its
 * lift; 'reservoir:*' (the EV's brake-fluid cap), 'cabinFilter:*', 'pan:*' (the drain pan), 'ghost:*' (the ghost pan),
 * 'mechanic:k' (the k-th mechanic's head).
 */
export const shopAnchorOnScreen = (p: Partial<ShopSliceSceneProps>, anchor: string, o: {frame: number; fps: number; durationInFrames: number}): [number, number] | undefined => {
  const [name, which = 'top'] = anchor.split(':');
  const cam = cameraAt(p, o);
  const t = o.frame / o.fps;
  if (name === 'mechanic') {
    const m = (p.mechanics ?? [])[Number(which)];
    if (!m) return undefined;
    const st = mechanicAt(p, m, t);
    return projectToFrame(cam, [st.pos[0], st.y0 + 1.75, st.pos[1]]);
  }
  const w: ShopWhich = which === 'bottom' ? 'bottom' : 'top';
  const bay = bayOf(p, w);
  if (!bay) return undefined;
  const lift = liftAt(bay, t) + bayY(p, w);
  // anchors on the parts' visible faces: the reservoir's cap, the filter's front edge where it stands out of the dash
  if (name === 'reservoir') return projectToFrame(cam, ((q) => [q[0], q[1] + lift + 0.08, q[2] + 0.02] as V3)(toW(EV_PARTS.reservoir)));
  if (name === 'cabinFilter') return projectToFrame(cam, ((q) => [q[0], q[1] + lift, q[2] + FILTER_OUT + 0.08] as V3)(toW(EV_PARTS.filter)));
  if (name === 'pan' || name === 'ghost') {
    const xz = panXZ(p, w, name === 'ghost' ? (bay.ghostPan?.under ?? 'gearbox') : 'sump', bay);
    return projectToFrame(cam, [xz[0], bayY(p, w) + panH(p, w, name === 'ghost' ? (bay.ghostPan?.under ?? 'gearbox') : 'sump'), xz[1]]);
  }
  const q = carPointW(p, w, name === 'sump' ? 'oilPan' : name, t);
  return q ? projectToFrame(cam, q) : undefined;
};

/** The drain pan's size: rim radius, its depth; the step platform's height. */
const PAN = {r: 0.32, depth: 0.12};
const STEP_H = 0.7;

/** The pan's rim height on its stand (it telescopes): 0.3 m under the plug it serves, 0.8 → 1.6 m. */
const panH = (p: Partial<ShopSliceSceneProps>, w: ShopWhich, under: 'sump' | 'gearbox', t = 0) => {
  const q = carPointW(p, w, under === 'sump' ? 'drainPlug' : 'gearDrain', t);
  return Math.max(0.8, Math.min(1.6, (q ? q[1] - bayY(p, w) : 1.5) - 0.3));
};

const panXZ = (p: Partial<ShopSliceSceneProps>, w: ShopWhich, under: 'sump' | 'gearbox', bay: ShopBay): [number, number] => {
  const dp = bay.drainPan;
  if (under === 'sump' && typeof dp === 'object' && dp.at) return dp.at;
  const q = carPointW(p, w, under === 'sump' ? 'drainPlug' : 'gearDrain', 0);
  return [q?.[0] ?? (under === 'sump' ? -1.66 : 1.36), 0.25];
};

// ---------------------------------------------------------------------------------------------- mechanics

const STRIDE = 1.3;
type MechState = {pos: [number, number]; yaw: number; walk: number; walked: number; y0: number; hands?: [V3, V3]; w: number; kneel: number; glance?: {at: number; target: V3; hold?: number}[]};

/** A mechanic's state at t: floor position, facing, walk amount and distance, the hands' world targets and their weight. */
const mechanicAt = (p: Partial<ShopSliceSceneProps>, m: ShopMechanic, t: number): MechState => {
  const y0 = bayY(p, m.bay);
  const keys = [...(m.keys ?? [])].sort((a, b) => a.at - b.at);
  let pos = spotXZ(p, m.bay, m.start ?? 'chest');
  let yaw = Math.PI;
  let walked = 0;
  let walk = 0;
  for (const k of keys) {
    if (k.do !== 'walkTo' || t < k.at) continue;
    const to = spotXZ(p, m.bay, k.to);
    const d = Math.hypot(to[0] - pos[0], to[1] - pos[1]);
    const dur = Math.max(0.3, d / (k.speed ?? 1.25));
    const u = Math.min(1, (t - k.at) / dur);
    // eased start and stop (0.25 s), linear between
    const e = u <= 0 ? 0 : u >= 1 ? 1 : (u * u * (3 - 2 * u) + u) / 2;
    if (d > 1e-3) yaw = Math.atan2(to[0] - pos[0], to[1] - pos[1]);
    if (u < 1) {
      walk = Math.min(1, Math.sin(Math.PI * u) * 3);
      walked += d * e;
      pos = [pos[0] + (to[0] - pos[0]) * e, pos[1] + (to[1] - pos[1]) * e];
      break;
    }
    walked += d;
    pos = to;
  }
  // the act in force: its hands' targets and weight (in 0.3 s, out 0.3 s)
  const bay = bayOf(p, m.bay);
  let hands: [V3, V3] | undefined;
  let wgt = 0;
  let kneel = 0;
  for (const k of keys) {
    if (k.do !== 'act') continue;
    const len = k.for ?? 1.0;
    const wk = Math.min(ease(t, k.at, k.at + 0.3), 1 - ease(t, k.at + len, k.at + len + 0.3));
    if (wk <= 0.001) continue;
    const tgt = actHands(p, m, k, t, pos);
    if (!tgt) continue;
    hands = tgt.hands;
    wgt = wk;
    if (tgt.face) yaw = Math.atan2(tgt.face[0] - pos[0], tgt.face[2] - pos[1]);
    if (k.act === 'kneel') kneel = wk;
  }
  // on the step stool: stand on its top
  const stool = bay ? (bay.stool ?? !!bay.pour) : false;
  const sxz: [number, number] = bay && typeof bay.stool === 'object' && bay.stool.at ? bay.stool.at : spotXZ(p, m.bay, 'stool');
  const onStool = stool && Math.hypot(pos[0] - sxz[0], pos[1] - sxz[1]) < 0.2;
  const glance = keys
    .filter((k): k is Extract<ShopMechanicKey, {do: 'glance'}> => k.do === 'glance')
    .map((k) => ({at: k.at, hold: k.hold, target: lookTarget(p, m.bay, k.to, t)}));
  return {pos, yaw, walk, walked, y0: y0 + (onStool ? STEP_H : 0), hands, w: wgt, kneel, glance};
};

const lookTarget = (p: Partial<ShopSliceSceneProps>, w: ShopWhich, to: ShopSpot | 'car' | V3, t: number): V3 => {
  if (Array.isArray(to)) return to as V3;
  if (to === 'car') return carPointW(p, w, 'roof', t) ?? [0, bayY(p, w) + 2, 0];
  if (to === 'gearbox') return carPointW(p, w, 'gearbox', t) ?? [1.3, bayY(p, w) + 1.8, 0.2];
  if (to === 'sump') return carPointW(p, w, 'oilPan', t) ?? [-1.66, bayY(p, w) + 1.6, 0.3];
  const xz = spotXZ(p, w, to);
  return [xz[0], bayY(p, w) + 1.2, xz[1]];
};

/** The hands' world targets for an act (and where the body faces). */
const actHands = (p: Partial<ShopSliceSceneProps>, m: ShopMechanic, k: Extract<ShopMechanicKey, {do: 'act'}>, t: number, pos: [number, number]): {hands: [V3, V3]; face?: V3} | null => {
  const w = m.bay;
  const y0 = bayY(p, w);
  const bay = bayOf(p, w);
  if (!bay) return null;
  const lift = liftAt(bay, t) + y0;
  const off = (q: V3, d: V3): V3 => [q[0] + d[0], q[1] + d[1], q[2] + d[2]];
  switch (k.act) {
    case 'drain': {
      const q = carPointW(p, w, 'drainPlug', t);
      if (!q) return null;
      return {hands: [off(q, [-0.02, -0.03, 0.03]), off(q, [-0.12, -0.06, 0.08])], face: q};
    }
    case 'pour': {
      const f = carPointW(p, w, 'filler', t);
      if (!f) return null;
      const jug = jugAt(f);
      return {hands: [off(jug, [0.0, 0.08, 0.04]), off(jug, [0.07, -0.08, 0.06])], face: f};
    }
    case 'wipe': {
      const c = Math.cos((t - k.at) * 2 * Math.PI * 2.5) * 0.04;
      const [x, z] = pos;
      return {hands: [[x - 0.05 + c, y0 + 1.0, z + 0.3], [x + 0.05 + c, y0 + 0.98, z + 0.3]]};
    }
    case 'cap': {
      const r = toW(EV_PARTS.reservoir);
      const q: V3 = [r[0], r[1] + lift + 0.07, r[2]];
      const tw = Math.sin((t - k.at) * 2 * Math.PI * 1.5) * 0.02;
      return {hands: [off(q, [tw, 0.02, 0.0]), off(q, [0.25, -0.05, 0.1])], face: q};
    }
    case 'filter': {
      const fq = toW(EV_PARTS.filter);
      const q: V3 = [fq[0], fq[1] + lift, fq[2] + FILTER_OUT + 0.12];
      return {hands: [off(q, [-0.08, 0, 0]), off(q, [0.08, 0, 0])], face: q};
    }
    case 'kneel': {
      const q = carPointW(p, w, 'frontWheel', t);
      if (!q) return null;
      return {hands: [off(q, [0.12, -0.05, 0.05]), off(q, [-0.12, -0.08, 0.05])], face: q};
    }
    case 'button': {
      const q: V3 = [SHOP.post[0] + 0.2, y0 + 1.25, SHOP.post[1] + 0.16];
      return {hands: [q, [pos[0] + 0.1, y0 + 0.95, pos[1] + 0.15]], face: q};
    }
    case 'reach': {
      const q = k.target ?? [pos[0], y0 + 1.5, pos[1] - 0.4];
      return {hands: [q, off(q, [0.1, -0.05, 0])], face: q};
    }
  }
};

/** The jug's place while pouring: over the filler, tipped (world). */
const jugAt = (filler: V3): V3 => [filler[0] - 0.3, filler[1] + 0.2, 0.5];

const restHands = (x: number, y0: number, z: number): [V3, V3] => [
  [x - 0.24, y0 + 0.86, z + 0.04],
  [x + 0.24, y0 + 0.86, z + 0.04],
];

/** A mechanic drawn (the grey extra or `EXTRA_B`): walking, acting, glancing. */
const Mechanic: React.FC<{p: Partial<ShopSliceSceneProps>; m: ShopMechanic; t: number; mood: Mood; clock: number; i: number}> = ({p, m, t, mood, clock, i}) => {
  const st = mechanicAt(p, m, t);
  const [px, pz] = st.pos;
  const c = Math.cos(st.yaw);
  const s = Math.sin(st.yaw);
  const local = (q: V3): V3 => {
    const dx = q[0] - px;
    const dz = q[2] - pz;
    return [dx * c - dz * s, q[1] - st.y0 + (st.kneel > 0.5 ? 0.42 : 0), dx * s + dz * c];
  };
  const rest = restHands(px, st.y0, pz).map((q) => {
    // the rest hands in the figure's own frame: beside the hips
    return q;
  }) as [V3, V3];
  const restL: [V3, V3] = [
    [-0.24, 0.86, 0.04],
    [0.24, 0.86, 0.04],
  ];
  void rest;
  const tgt = st.hands ? (st.hands.map(local) as [V3, V3]) : restL;
  const wk = st.hands ? st.w : 0;
  const hands = [0, 1].map((h) => restL[h].map((v, j) => v + (tgt[h][j] - v) * wk) as V3) as [V3, V3];
  const kneelOn = st.kneel > 0.5;
  return (
    <group position={[px, st.y0 - (kneelOn ? 0.42 : 0), pz]} rotation={[0, st.yaw, 0]}>
      <Figure
        who="extra"
        look={m.look === 'b' ? EXTRA_B : undefined}
        mood={mood}
        seed={`shop-mech-${i}`}
        stance={kneelOn ? 'sit' : 'stand'}
        walk={kneelOn ? undefined : {phase: st.walked / STRIDE, amount: st.walk}}
        legs={
          kneelOn
            ? [
                {ankle: [-0.13, 0.5, -0.3], pitch: 0.6},
                {ankle: [0.13, 0.46, 0.25]},
              ]
            : undefined
        }
        phone={false}
        hands={hands}
        gestures={[
          {pose: 'idle', at: -1},
          ...(st.glance ?? []).map((g) => ({pose: 'turn-to' as const, at: g.at, hold: g.hold ?? 0.8, blend: 0.4, target: local(g.target)})),
        ]}
        clockOffset={clock}
      />
    </group>
  );
};

// ---------------------------------------------------------------------------------------------- the scene

/** N8: the shop (see the file comment). */
export const ShopSliceScene: React.FC<ShopSliceSceneProps> = (props) => {
  const {durationInFrames, mood = 'day', startFrame = 0} = props;
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const {from, to, pre} = shopMove(props, durationInFrames, fps, frame);
  const cam = cameraAt(props, {frame, fps, durationInFrames});
  const camD = cam.position.distanceTo(cam.look);
  return (
    <AbsoluteFill>
      <SectionStage mood={mood} post={{focusY: 0.5, aoRadius: 0.3 * Math.max(0.1, Math.min(1, camD / 10))}} ao far={220}>
        <SectionCamera from={from} to={to} pre={pre} durationInFrames={durationInFrames} drift={props.drift ?? 0} clockOffset={startFrame / fps} fitClip farMin={150} />
        <SectionLights mood={mood} target={[0, gapOf(props) / 2 + 1.0, 0]} lamp={0} />
        <ShopWorld {...props} mood={mood} t={t} fps={fps} camD={camD} />
      </SectionStage>
    </AbsoluteFill>
  );
};

const ShopWorld: React.FC<ShopSliceSceneProps & {mood: Mood; t: number; fps: number; camD: number}> = (props) => {
  const {mood, t, fps, camD, startFrame = 0} = props;
  const m = MOODS[mood];
  const env = useStudioEnv();
  const envScale = useEnvStrength();
  const albedo = useAlbedo();
  const mats = useMemo(() => {
    const std = (c: string, r = 0.9) => new THREE.MeshStandardMaterial({color: raw(c), roughness: r});
    return {
      cut: cutMaterial(),
      earth: std(m.earth, 1),
      floor: std(CHARGE.concrete, 0.95),
      wall: std(PLUGS.garageWall, 0.95),
      post: new THREE.MeshPhysicalMaterial({color: raw(HIGHWAY.galvanized), roughness: 0.4, metalness: 0.6}),
      dark: new THREE.MeshPhysicalMaterial({color: raw(CHARGE.cabinetDark), roughness: 0.5, metalness: 0.25}),
      rubber: std(REAL.rubber, 0.8),
      jug: new THREE.MeshPhysicalMaterial({color: raw(CHARGE.cabinet), roughness: 0.45}),
      reservoir: new THREE.MeshPhysicalMaterial({color: raw(CHARGE.cabinet), roughness: 0.3, transparent: true, opacity: 0.85}),
      filter: std(REAL.friction, 0.9),
      fluid: new THREE.MeshBasicMaterial({color: raw(REAL.fuel), transparent: true, opacity: 0.55}),
      sky: new THREE.MeshBasicMaterial({map: skyTexture(mood), fog: false}),
    };
  }, [m, mood]);
  mats.sky.color.setScalar(1 / m.exposure);
  applyEnv(env, [[mats.post, 1], [mats.dark, 0.6], [mats.jug, 0.6]], envScale);
  applyAlbedo([mats.floor, mats.wall], albedo);
  const inkK = Math.max(0.15, Math.min(4, camD / 12.75));
  const clock = startFrame / fps;
  return (
    <>
      <mesh position={[0, 12, -40]} material={mats.sky}>
        <planeGeometry args={[200, 110]} />
      </mesh>
      {WHICH.map((w) => {
        const bay = bayOf(props, w);
        if (!bay) return null;
        return <Bay key={w} p={props} w={w} bay={bay} t={t} mood={mood} camD={camD} inkK={inkK} mats={mats} fps={fps} startFrame={startFrame} />;
      })}
      {(props.mechanics ?? []).map((mc, i) => (
        <Mechanic key={i} p={props} m={mc} t={t} mood={mood} clock={clock} i={i} />
      ))}
    </>
  );
};

type ShopMats = {
  cut: THREE.Material;
  earth: THREE.Material;
  floor: THREE.Material;
  wall: THREE.Material;
  post: THREE.Material;
  dark: THREE.Material;
  rubber: THREE.Material;
  jug: THREE.Material;
  reservoir: THREE.Material;
  filter: THREE.Material;
  fluid: THREE.Material;
};

/** One bay: the room block, the lift, the car on it, the props and the jobs. */
const Bay: React.FC<{p: Partial<ShopSliceSceneProps>; w: ShopWhich; bay: ShopBay; t: number; mood: Mood; camD: number; inkK: number; mats: ShopMats; fps: number; startFrame: number}> = ({
  p,
  w,
  bay,
  t,
  mood,
  camD,
  inkK,
  mats,
  startFrame,
}) => {
  const y0 = bayY(p, w);
  const S = SHOP;
  const W = S.wallT;
  const ink = INK * inkK;
  const car = carOf(bay, w);
  const gas = car?.variant === 'gas';
  const ev = car?.variant === 'ev';
  const lift = liftAt(bay, t);
  const rects: Rect[] = [
    [
      [S.x0 - W, -S.ground, S.z1],
      [S.x1, 0, S.z1],
    ],
    [
      [S.x0 - W, 0, S.z1],
      [S.x0, S.wallH, S.z1],
    ],
  ];
  const top: V3[] = [
    [S.x0 - W, S.wallH, S.z1],
    [S.x0 - W, S.wallH, S.z0 - W],
    [S.x1, S.wallH, S.z0 - W],
    [S.x1, S.wallH, S.z0],
    [S.x0, S.wallH, S.z0],
    [S.x0, S.wallH, S.z1],
  ];
  const edges = top.slice(0, -1).map((q, i) => [q, top[i + 1]] as [V3, V3]);
  // the lift: the far post, its carriage at the raise, two arms to the pads under the body (front and rear lift points)
  const [px, pz] = S.post;
  const carY = lift;
  const pads: [number, number][] = [
    [-0.95, -0.2],
    [0.95, -0.2],
  ];
  // the jobs
  const drainK = bay.drain ? Math.min(ease(t, bay.drain.at, bay.drain.at + 0.15), 1 - ease(t, bay.drain.at + (bay.drain.for ?? 1.0) - 0.15, bay.drain.at + (bay.drain.for ?? 1.0))) : 0;
  const pourK = bay.pour ? Math.min(ease(t, bay.pour.at + 0.15, bay.pour.at + 0.3), 1 - ease(t, bay.pour.at + (bay.pour.for ?? 1.2) - 0.15, bay.pour.at + (bay.pour.for ?? 1.2))) : 0;
  const plug = gas ? carPointW(p, w, 'drainPlug', t) : undefined;
  const filler = gas ? carPointW(p, w, 'filler', t) : undefined;
  const showPan = bay.drainPan ?? gas;
  const pan = showPan ? panXZ(p, w, 'sump', bay) : null;
  const ph = panH(p, w, 'sump');
  const showJug = bay.jug ?? gas;
  const pouring = bay.pour ? t >= bay.pour.at - 0.4 && t <= bay.pour.at + (bay.pour.for ?? 1.2) + 0.4 : false;
  const stool = bay.stool ?? !!bay.pour;
  const stoolXZ: [number, number] = typeof stool === 'object' && stool.at ? stool.at : spotXZ(p, w, 'stool');
  const shade = gas ? (car?.oilColor ? undefined : OIL_SHADES[bay.oilBefore ?? 'old']) : undefined;
  // the ghost pan
  const gp = bay.ghostPan;
  const gpDraw = gp ? ease(t, gp.at, gp.at + 0.8) : 0;
  const gpFade = gp ? 1 - ease(t, gp.fadeAt ?? gp.at + 1.3, (gp.fadeAt ?? gp.at + 1.3) + 0.7) : 0;
  const gxz = gp ? panXZ(p, w, gp.under ?? 'gearbox', bay) : null;
  // dashes 16 / 10 px and a 3 px line on screen (metres per px at this distance)
  const mpp = (2 * camD * Math.tan((13 * Math.PI) / 180)) / 1920;
  // the EV's jobs
  const capOff = bay.cap ? Math.min(ease(t, bay.cap.at, bay.cap.at + 0.25), 1 - ease(t, bay.cap.at + (bay.cap.for ?? 0.8), bay.cap.at + (bay.cap.for ?? 0.8) + 0.25)) : 0;
  const filt = bay.cabinFilter ? Math.min(ease(t, bay.cabinFilter.at, bay.cabinFilter.at + 0.5), 1 - ease(t, bay.cabinFilter.back ?? bay.cabinFilter.at + 0.6, (bay.cabinFilter.back ?? bay.cabinFilter.at + 0.6) + 0.5)) : 0;
  const rot = bay.rotateArrows ? inkArrowState({at: bay.rotateArrows.at, drawFor: 0.6, fadeAt: bay.rotateArrows.fadeAt}, t) : null;
  const wheelTop = (x: number): V3 => [x, y0 + lift + 0.36 + 0.42, 1.0];
  const arc = (a: number, b: number, h: number): V3[] =>
    [...Array(17).keys()].map((i) => {
      const u = i / 16;
      const x = a + (b - a) * u;
      return [x, wheelTop(x)[1] + h * Math.sin(Math.PI * u), 1.0] as V3;
    });
  return (
    <group>
      <group position={[0, y0, 0]}>
        {/* the ground block (hatched front), the floor slab, the back and left walls (cut on top and at the front) */}
        <mesh position={[(S.x0 - W + S.x1) / 2, -S.ground / 2 - 0.001, (S.z0 - W + S.z1) / 2]} material={[mats.earth, mats.earth, mats.earth, mats.earth, mats.cut, mats.earth]} receiveShadow>
          <boxGeometry args={[S.x1 - S.x0 + W, S.ground - 0.002, S.z1 - S.z0 + W]} />
        </mesh>
        <mesh position={[(S.x0 + S.x1) / 2, -0.005, (S.z0 + S.z1) / 2]} material={mats.floor} receiveShadow>
          <boxGeometry args={[S.x1 - S.x0, 0.01, S.z1 - S.z0]} />
        </mesh>
        <mesh position={[(S.x0 - W + S.x1) / 2, S.wallH / 2, S.z0 - W / 2]} material={[mats.cut, mats.cut, mats.cut, mats.cut, mats.wall, mats.wall]} castShadow receiveShadow>
          <boxGeometry args={[S.x1 - S.x0 + W, S.wallH, W]} />
        </mesh>
        <mesh position={[S.x0 - W / 2, S.wallH / 2, (S.z0 + S.z1) / 2]} material={[mats.wall, mats.wall, mats.cut, mats.cut, mats.cut, mats.cut]} castShadow receiveShadow>
          <boxGeometry args={[W, S.wallH, S.z1 - S.z0]} />
        </mesh>
        <CutOutline rects={rects} edges={edges} thickness={ink} />
        {/* the lift's far post, its carriage and the arms under the body (pads on the lift points) */}
        <mesh position={[px, 1.6, pz]} material={mats.post} castShadow receiveShadow>
          <boxGeometry args={[S.postW, 3.2, S.postW]} />
        </mesh>
        <mesh position={[px, 0.01, pz]} material={mats.post}>
          <boxGeometry args={[0.5, 0.02, 0.5]} />
        </mesh>
        <mesh position={[px + 0.2, 1.25, pz + 0.16]} material={mats.dark}>
          <boxGeometry args={[0.12, 0.18, 0.06]} />
        </mesh>
        <mesh position={[px, carY + 0.18, pz + 0.17]} material={mats.dark} castShadow>
          <boxGeometry args={[0.34, 0.3, 0.1]} />
        </mesh>
        {pads.map(([x, z], i) => {
          const a = new THREE.Vector3(px, carY + 0.12, pz + 0.17);
          const b = new THREE.Vector3(x, carY + 0.12, z);
          const len = a.distanceTo(b);
          const yaw = Math.atan2(b.x - a.x, b.z - a.z);
          return (
            <group key={i}>
              <mesh position={a.clone().add(b).multiplyScalar(0.5)} rotation={[0, yaw, 0]} material={mats.dark} castShadow>
                <boxGeometry args={[0.1, 0.07, len]} />
              </mesh>
              <mesh position={[x, carY + 0.19, z]} material={mats.rubber}>
                <cylinderGeometry args={[0.07, 0.07, 0.07, 16]} />
              </mesh>
            </group>
          );
        })}
        {/* the tool chest at the left wall (drawers as shallow steps, no text) */}
        {bay.chest === false ? null : (
          <group position={[S.chest[0], 0, S.chest[1]]}>
            <mesh geometry={roundedBox(1.1, 1.05, 0.55, 0.02)} position={[0, 0.6, 0]} material={mats.dark} castShadow receiveShadow />
            {[0, 1, 2, 3, 4].map((k) => (
              <mesh key={k} position={[0, 0.25 + k * 0.17, 0.279]} material={mats.post}>
                <boxGeometry args={[0.7, 0.012, 0.01]} />
              </mesh>
            ))}
            {[-0.42, 0.42].map((x) => (
              <mesh key={x} position={[x, 0.04, 0]} material={mats.rubber}>
                <cylinderGeometry args={[0.04, 0.04, 0.05, 12]} />
              </mesh>
            ))}
          </group>
        )}
        {/* the drain pan on its stand */}
        {pan ? (
          <group position={[pan[0], 0, pan[1]]}>
            <mesh position={[0, ph - PAN.depth / 2, 0]} material={mats.dark} castShadow>
              <cylinderGeometry args={[PAN.r, PAN.r * 0.8, PAN.depth, 32, 1, true]} />
            </mesh>
            <mesh position={[0, ph - PAN.depth, 0]} rotation={[-Math.PI / 2, 0, 0]} material={mats.dark}>
              <circleGeometry args={[PAN.r * 0.8, 32]} />
            </mesh>
            <mesh position={[0, (ph - PAN.depth) / 2, 0]} material={mats.dark} castShadow>
              <cylinderGeometry args={[0.025, 0.025, ph - PAN.depth, 12]} />
            </mesh>
            {[0, 1, 2, 3].map((k) => (
              <mesh key={k} position={[Math.cos((k * Math.PI) / 2 + 0.4) * 0.22, 0.02, Math.sin((k * Math.PI) / 2 + 0.4) * 0.22]} rotation={[0, -(k * Math.PI) / 2 - 0.4, 0]} material={mats.dark}>
                <boxGeometry args={[0.44, 0.03, 0.04]} />
              </mesh>
            ))}
          </group>
        ) : null}
        {/* the step stool */}
        {stool ? (
          <group position={[stoolXZ[0], 0, stoolXZ[1]]}>
            <mesh geometry={roundedBox(0.55, STEP_H, 0.45, 0.02)} position={[0, STEP_H / 2, 0]} material={mats.dark} castShadow receiveShadow />
          </group>
        ) : null}
        {/* the jug on the floor by the pan (lifted to the filler while pouring) */}
        {showJug && !pouring ? (
          <group position={[(pan?.[0] ?? -2.0) - 0.55, 0, (pan?.[1] ?? 0.4) + 0.35]}>
            <Jug mats={mats} />
          </group>
        ) : null}
      </group>
      {/* the car on the lift */}
      {car ? (
        <group position={[0, y0 + lift, 0]}>
          <SlicedCar {...(car as SlicedCarProps)} mood={mood} startFrame={startFrame} cameraDistance={camD} />
        </group>
      ) : null}
      {/* the drain stream (the oil's own shade, never orange) */}
      {plug && pan && drainK > 0.01 ? <Stream a={[plug[0], plug[1] - 0.01, plug[2]]} b={[pan[0] + 0.03, y0 + ph - 0.05, Math.min(pan[1], plug[2])]} color={shade ?? REAL.oilOld} k={drainK} mood={mood} /> : null}
      {/* the jug over the filler while pouring, and the fresh stream */}
      {filler && pouring ? (
        <>
          <group position={jugAt(filler)} rotation={[0, 0, -0.9 * Math.max(pourK, Math.min(1, (t - (bay.pour?.at ?? 0) + 0.4) / 0.4))]}>
            <group position={[0, -0.13, 0]}>
              <Jug mats={mats} />
            </group>
          </group>
          {pourK > 0.01 ? <Stream a={[jugAt(filler)[0] + 0.12, jugAt(filler)[1] - 0.04, jugAt(filler)[2]]} b={[filler[0], filler[1] + 0.01, filler[2]]} color={REAL.oilFresh} k={pourK} mood={mood} /> : null}
        </>
      ) : null}
      {/* the ghost drain pan (§ 3 an absent job): rim and stand, dashed ink, drawn left to right */}
      {gxz && gpDraw > 0 && gpFade > 0.01 ? (
        <group position={[0, y0, 0]}>
          <GhostLines mood={mood} lines={ghostPanLines(gxz, panH(p, w, gp?.under ?? 'gearbox'))} draw={gpDraw} opacity={gpFade} width={3 * mpp} dash={[16 * mpp, 10 * mpp]} view={SECTION_ANGLE} />
        </group>
      ) : null}
      {/* the EV's brake-fluid reservoir under the hood cut, its cap */}
      {ev ? (
        <group position={[0, y0 + lift, 0]}>
          {(() => {
            const r = toW(EV_PARTS.reservoir);
            return (
              <group position={r}>
                <mesh geometry={roundedBox(0.16, 0.12, 0.11, 0.018)} material={mats.reservoir} castShadow />
                {/* its fluid inside, a level line (neutral pale straw, no label) */}
                <mesh position={[0, -0.015, 0.0555]} material={mats.fluid}>
                  <planeGeometry args={[0.13, 0.06]} />
                </mesh>
                <mesh position={[0, 0.07 + 0.06 * capOff, 0]} rotation={[0, capOff * 2.5, 0]} material={mats.dark}>
                  <cylinderGeometry args={[0.032, 0.032, 0.03, 16]} />
                </mesh>
              </group>
            );
          })()}
          {bay.cabinFilter && filt > 0.01 ? (
            // the filter out of the dash's cut face: a pleated grey element in a dark frame, toward the camera
            <group position={((q) => [q[0], q[1], q[2] + FILTER_OUT * filt] as V3)(toW(EV_PARTS.filter))}>
              <mesh material={mats.dark} castShadow>
                <boxGeometry args={[0.24, 0.03, 0.26]} />
              </mesh>
              <mesh position={[0, 0.016, 0]} material={mats.filter}>
                <boxGeometry args={[0.21, 0.004, 0.23]} />
              </mesh>
              {[...Array(7).keys()].map((i) => (
                <mesh key={i} position={[-0.09 + i * 0.03, 0.019, 0]} material={mats.dark}>
                  <boxGeometry args={[0.004, 0.003, 0.22]} />
                </mesh>
              ))}
            </group>
          ) : null}
        </group>
      ) : null}
      {/* tire-rotation arrows (ink): front → rear over the tires, rear → front a little higher */}
      {rot ? (
        <>
          <InkArrowAlong points={arc(-1.35, 1.35, 0.35)} drawn={rot.drawn} opacity={rot.opacity} radius={0.022 * Math.max(0.5, Math.min(1.8, camD / 8))} mood={mood} />
          <InkArrowAlong points={arc(1.35, -1.35, 0.6)} drawn={rot.drawn} opacity={rot.opacity} radius={0.022 * Math.max(0.5, Math.min(1.8, camD / 8))} mood={mood} />
        </>
      ) : null}
    </group>
  );
};

/** The ghost pan's lines (bay frame): the rim (a circle), the pan's bottom, the stand's pole and its feet. */
const ghostPanLines = ([x, z]: [number, number], h: number): V3[][] => {
  const circle = (r: number, y: number): V3[] => [...Array(33).keys()].map((i) => [x - r * Math.cos((i / 32) * Math.PI * 2), y, z + r * Math.sin((i / 32) * Math.PI * 2)] as V3);
  return [
    circle(PAN.r, h),
    circle(PAN.r * 0.8, h - PAN.depth),
    [
      [x, h - PAN.depth, z],
      [x, 0.02, z],
    ],
    [
      [x - 0.25, 0.02, z],
      [x + 0.25, 0.02, z],
    ],
  ];
};

/** The plain jug (grey body, dark cap, a handle; no label). Origin at its foot. */
const Jug: React.FC<{mats: ShopMats}> = ({mats}) => (
  <group>
    <mesh geometry={roundedBox(0.16, 0.26, 0.1, 0.02)} position={[0, 0.13, 0]} material={mats.jug} castShadow />
    <mesh position={[0.06, 0.28, 0]} material={mats.dark}>
      <cylinderGeometry args={[0.02, 0.02, 0.03, 12]} />
    </mesh>
    <mesh position={[-0.05, 0.27, 0]} rotation={[Math.PI / 2, 0, 0]} material={mats.jug}>
      <torusGeometry args={[0.035, 0.01, 6, 14, Math.PI]} />
    </mesh>
  </group>
);

/** A liquid stream (its material colour, never orange) from a to b, `k` 0 → 1 its strength (it thins at the ends). */
const Stream: React.FC<{a: V3; b: V3; color: string; k: number; mood: Mood}> = ({a, b, color, k, mood}) => {
  const mat = useMemo(() => new THREE.MeshPhysicalMaterial({color: raw(color), roughness: 0.15, clearcoat: 1}), [color]);
  void mood;
  const va = new THREE.Vector3(...a);
  const vb = new THREE.Vector3(...b);
  const len = va.distanceTo(vb);
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), vb.clone().sub(va).normalize());
  const r = 0.008 * Math.max(0.2, k);
  return (
    <mesh position={va.clone().add(vb).multiplyScalar(0.5)} quaternion={q} material={mat} castShadow>
      <cylinderGeometry args={[r * 0.8, r, len, 10]} />
    </mesh>
  );
};
