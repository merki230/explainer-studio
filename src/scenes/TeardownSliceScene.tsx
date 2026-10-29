import React, {useMemo} from 'react';
import {AbsoluteFill, random, useCurrentFrame, useVideoConfig} from 'remotion';
import * as THREE from 'three';
import {CHARGE, HIGHWAY, RACE, REAL, type Mood} from '../theme';
import {raw} from '../three/plaster';
import {madeByCoreR, madeByState, swellOf, type MadeByKeys} from '../three/real/madeBy';
import {ChargeDriverFigure} from '../three/real/ChargeDriver';
import {
  carDriveAt,
  carWheelRevs,
  driverPoseAt,
  driverTimeline,
  WHEEL_R,
  type DriverGeo,
  type DriverKey,
  type DriverSpot,
} from '../three/real/chargeMotion';
import {CRATE, SupplierCrate} from '../three/real/ChargeSite';
import {chargeBoughtAt, type ChargeBought} from './ChargeSliceScene';
import type {ShellProfile} from '../three/real/CarShell';
import {carSilhouette} from '../three/real/RealCar';
import {bladeTipAt, layoutOf, SlicedCar, type SlicedCarOptions} from '../three/real/SlicedCar';
import {capRevs} from '../three/real/wheelMotion';
import {
  AxleStand,
  DOLLY,
  PartModel,
  partCentre,
  PartGlow,
  partHull,
  scanMaterial,
  ShopDolly,
  ShopStool,
  STOOL,
  TEARDOWN_CAR,
  TEARDOWN_GRID,
  TEARDOWN_PARTS,
  TEARDOWN_ROOM,
  TeardownRoom,
  useTeardownMaterials,
  type TeardownGroup,
  type TeardownPart,
} from '../three/real/Teardown';
import {projectToFrame, SectionCamera, sectionCameraAt, type Framing} from '../three/section/SectionCamera';
import {SectionLights, SectionStage} from '../three/section/SectionStage';
import {ease, framingAtKeys, type CameraKey} from './keyframes';

/*
 * T, The Lab · teardown (No. 011, N1; style guide v0.14 § 3 "The Lab: teardown dressing", § 5 "Made by" glow). The
 * Lab re-dressed for a car teardown by analysts: a cut floor slab with a floor-tape grid, the car on galvanized axle
 * stands at the back, a tool chest at the left wall, nothing readable. Two dressings (switch between them with a
 * `slide`, § 3): 'sedan' (the car comes apart, its parts flying to their cells in the grid, the stripped shell left
 * on the stands; then an ink scan line, the "made by" glow on 3 of every 4 parts, the bought quarter darker) and
 * 'hatch' (another car whole and cut on the stands, its part groups lit on the car itself, `SlicedCar` `madeBy`).
 * No place label (§ 6: the room reads by its look). Times are seconds into the scene; any key may lie outside it.
 * No. 011's opening: an optional `second` whole car beside the main one (on its own axle stands, a low shop dolly or
 * its own tires), in the back row next to the main car so it never crosses the grid; the room widens to hold it. It
 * can roll out (`roll.out`) before the sedan comes apart, or take its cells from crates (`bought`). A mechanic (the
 * grey extra, `worker`) can walk the room, lean on the car, sit on a shop stool; the chest's drawer opens (`chest`).
 */

type V3 = [number, number, number];

export type TeardownFraming = 'whole' | 'grid' | 'pack' | 'car' | 'nose' | 'tail' | 'pair' | 'mainPack' | 'secondPack';

/** The second car's roll-out (see `TeardownSecond.roll`). */
export type TeardownRollOut = {at: number; for?: number; to?: number; dir?: 'left' | 'right'};

/**
 * A second whole car in the room (No. 011's opening): cut open like the main car (`SlicedCar`, same section), facing
 * the same way (nose −x), in the back row to the right of the main car (right of the grid's back edge), so it never
 * crosses the grid; the room widens to hold it. Keep the same `second` in every `continue` scene of one take (after
 * the roll-out the car is simply gone; the room keeps its width).
 */
export type TeardownSecond = {
  /**
   * The car (`SlicedCar` options): `shape` ('model3', 'seal06', 'sedan', 'hatch', ...; default 'model3'), `paint`
   * (default the model's story paint: `CHARGE.teslaPaint` model3, `CHARGE.bydPaint` seal06, else `RACE.evPaint`),
   * `madeBy`, `packRewind`, `blade`, ... Variant 'ev', no driver, wheels shown.
   */
  car?: Partial<SlicedCarOptions>;
  /**
   * What it stands on: 'stands' (default: four galvanized axle stands like the main car), 'dolly' (a low grey shop
   * dolly, a plate on four swivel castors, top 0.15 m, the car on its tires) or 'floor' (its own tires on the floor).
   */
  mount?: 'stands' | 'dolly' | 'floor';
  /**
   * Rolls out from `out.at` (s): speeding up steadily over `for` s (default 3.0) for `to` m (default 12, out of any
   * framing), then on at that speed; `dir` default away from the main car (right). On the dolly the body stays still
   * on its plate and the castors swing round to trail and roll the way it moves; on the floor the wheels roll (forward
   * to the left, reversing to the right). Ignored on stands.
   */
  roll?: {out?: TeardownRollOut};
  /** Its centre on the floor (room metres, x across, z toward the camera). Default: right of the main car, 0.6 m between bodies, same z. */
  at?: [number, number];
  /**
   * Cells bought in (`ChargeBought`, as the charge slice's): crates slide in from the right to stand behind its rear,
   * open, and their grey modules go into its pack's slots (`route: 'low'` recommended). Feeds `car.packModules`.
   */
  bought?: ChargeBought | null;
  /** The pack shown full, then emptied (`SlicedCar` `packRewind`; same as `car.packRewind`). */
  packRewind?: SlicedCarOptions['packRewind'];
  /** The "made by" glow on the car itself (same as `car.madeBy`). */
  madeBy?: SlicedCarOptions['madeBy'];
  /** Scale (default 1). */
  scale?: number;
  /** Shorthands (the first brief's names): `car.shape`, `car.paint`, mount 'dolly' / 'stands' / 'floor', `roll.out`. */
  shape?: ShellProfile;
  paint?: string;
  dolly?: boolean;
  stands?: boolean;
  driving?: boolean;
  leave?: TeardownRollOut;
};

/**
 * The mechanic (a grey extra, the charge slice's driver actions): `walkTo` ('cabinet' = the tool chest's front,
 * 'quarter' = the main car's rear quarter, 'door' = the main car's cut side, 'port' = the second car's tail, 'curb' =
 * the shop stool, or [x, z]), `glance` ('car' = the main car's cabin, 'cabinet' = the chest, 'port' = the second car,
 * or a point), `lean` (on the main car's rear quarter, or at `to`), `sit` (on the stool), `stand`, `phone`, `pocket`,
 * `shift`. No `exit` / `enter` / `plug` / `unplug` here.
 */
export type TeardownWorker = {
  keys: DriverKey[];
  /** Where they stand before the first key (default 'cabinet', at the chest). */
  start?: DriverSpot;
  /** 'a' (`CAST.extra`, default) or 'b' (`EXTRA_B`). */
  look?: 'a' | 'b';
  /** × every move's speed (default 1). */
  rate?: number;
  /** The shop stool's place [x, z] (default [-3.45, -1.25], between the chest and the main car's nose); drawn whenever there's a worker. */
  stool?: [number, number];
};

/** One wave of the "made by" glow over the grid. */
export type TeardownGlow = {
  /** The first part lights (0.3 s). */
  at: number;
  /** Which systems (default: every system that has made parts). With `share` (default) bought parts never light. */
  groups?: TeardownGroup[];
  /** Seconds over which the wave's parts start, one after another (default 0: all at once). */
  wave?: number;
  /** The wave's order: 'sweep' (default: across the grid from the left), 'size' (big first) or 'scatter' (seeded). */
  order?: 'sweep' | 'size' | 'scatter';
};

export type TeardownSliceSceneProps = {
  durationInFrames: number;
  /** Day (default, § 3: the Day rig, no practicals) or Night. */
  mood?: Mood;
  /** 'sedan' (default: the stripped car and its parts grid) or 'hatch' (another car whole on the stands, no grid). */
  dressing?: 'sedan' | 'hatch';
  /**
   * The car (`SlicedCar` options over the dressing's): sedan `{variant: 'ev', shape: 'sedan', paint: CHARGE.bydPaint}`,
   * hatch `{variant: 'ev', shape: 'hatch', paint: RACE.evPaint, nearWheels: 'whole'}` (the cut hatch is drawn with the
   * crossover's section; its near wheels whole, owner 2026-10-29; the real shapes default to whole too).
   * N2's glow goes here (`madeBy`: pack, driveUnit, inverter + pulses, panels, lamps); `driving` keys turn the wheels
   * and the rotor on the stands. The stripped shell's cut edge can glow too (`madeBy.panels`).
   */
  car?: Partial<SlicedCarOptions>;
  /** The car's scale (default 1; the hatch 0.9, a smaller car). */
  carScale?: number;
  /**
   * The sedan comes apart from `at`: every part lifts out of the car and flies to its cell (0.75 s each, cubic),
   * staggered big to small over `for` s (default 1.3); the stripped shell stays on the stands. Before it: the car
   * whole on the stands, the grid empty. Null / omitted: the parts already in the grid, the shell stripped.
   */
  apart?: {at: number; for?: number} | null;
  /** An ink scan line (`scanPx` wide, `cutLine`, never orange) sweeping the grid front to back, or the car nose to tail ('car'), over `for` s (default 1.0). */
  scan?: {at: number; for?: number; along?: 'grid' | 'car'}[];
  /**
   * The scan line's width on screen (px of the 1080 × 1920 frame), kept at any camera distance and corrected for the
   * floor's foreshortening (a line lying on the floor seen at a low angle). Default 3.
   */
  scanPx?: number;
  /** The "made by" glow on the grid's parts, in waves (see `TeardownGlow`). Default none. */
  glow?: TeardownGlow[];
  /** Only made parts ever light (the bought quarter stays unlit, 3 of every 4 lit). Default true. */
  share?: boolean;
  /** Surges (halo to 45 %, the part swells 3 %, 0.4 s) on lit parts of these systems (default 'all'). */
  surge?: {at: number; groups?: TeardownGroup[] | 'all'}[];
  /** From `at` until `until` the lit parts outside these systems glow a step dimmer (the subject stays bright). */
  focus?: {at: number; until?: number; groups: TeardownGroup[]}[];
  /** The bought parts darken a step (albedo × 0.8, § 3) from here (0.3 s). Default never. */
  dimAt?: number | null;
  /** A part (the pack by default) lifts `height` m (default 0.05) over 0.3 s, holds `hold` s (default 0.15) and settles (0.45 s). */
  lift?: {at: number; groups?: TeardownGroup[]; height?: number; hold?: number}[];
  /** A second whole car beside the main one (see `TeardownSecond`). Default none. */
  second?: TeardownSecond | null;
  /** A mechanic walking the room (see `TeardownWorker`). Default none. */
  worker?: TeardownWorker | null;
  /**
   * The tool chest: its drawer slides out 0.3 m over 0.4 s at `open` and back in over 0.4 s at `close` (seconds;
   * default shut); `at` [x, z] moves it (its foot centre, front toward the camera; default at the left wall, z −2.5).
   */
  chest?: {open?: number; close?: number; at?: [number, number]} | null;
  /** The room's left wall / right cut end (x, m). Default: 8.0 m (−4 → 4), widened to hold `second` with 0.6 m spare. */
  room?: {x0?: number; x1?: number};
  /** Framing preset (default 'whole' for the sedan, 'car' for the hatch; 'pair' frames both cars). See `teardownFramings`. */
  framing?: TeardownFraming;
  /** A custom move instead of a preset (look-at + distance at the fixed angle). */
  camera?: {from: Framing; to?: Framing};
  /** Camera keyframes: override `camera`, `push` and the glide in. */
  cameraKeys?: CameraKey[];
  /** Push toward the subject, units/s (default 0). */
  push?: number;
  /** Idle sideways drift, ± units (default 0). */
  drift?: number;
  /** Default `teardown-<dressing>`: a change of dressing is a `slide` (§ 3). */
  location?: string;
  transition?: 'auto' | 'continue' | 'glide' | 'cut' | 'dissolve' | 'slide' | 'follow';
  follow?: {direction?: 'down' | 'up' | 'left' | 'right'; at?: number};
  glide?: number;
  /** Set by Explainer. */
  startFrame?: number;
  cameraFrom?: Framing;
  cameraGlide?: number;
};

const C = TEARDOWN_CAR;
const scaleOf = (p: Partial<TeardownSliceSceneProps>) => p.carScale ?? ((p.dressing ?? 'sedan') === 'hatch' ? 0.9 : 1);
/** The car's lift for its scale: its lowest point (the pack's underside, car y 0.12) on the 0.45 m stands. */
const liftOf = (s: number) => 0.45 - 0.12 * s;
/** A car-frame point → the room (the car faces −x, `SlicedCar` mirrors it). */
const carToRoom = (p: Partial<TeardownSliceSceneProps>, v: V3): V3 => {
  const s = scaleOf(p);
  return [C.x - s * v[0], liftOf(s) + s * v[1], C.z + s * v[2]];
};

/** A body's x span in its own frame (nose = max, tail = min), from its side silhouette. */
const bodySpan = (shape: ShellProfile): [number, number] => {
  const xs = carSilhouette(shape).body.map((q) => q[0]);
  return [Math.min(...xs), Math.max(...xs)];
};
const mainShape = (p: Partial<TeardownSliceSceneProps>): ShellProfile => carOptions(p).shape ?? 'crossover';
/** The main car's room x span (nose, tail). */
const mainSpanX = (p: Partial<TeardownSliceSceneProps>): [number, number] => {
  const [lo, hi] = bodySpan(mainShape(p));
  const s = scaleOf(p);
  return [C.x - s * hi, C.x - s * lo];
};
/** The gap between the two bodies (m) in the default placement. */
const SECOND_GAP = 0.6;
const secondScale = (sc: TeardownSecond) => sc.scale ?? 1;
const secondShape = (sc: TeardownSecond): ShellProfile => sc.car?.shape ?? sc.shape ?? 'model3';
const secondSupport = (sc: TeardownSecond): 'dolly' | 'floor' | 'stands' =>
  sc.mount ?? (sc.dolly ? 'dolly' : sc.driving || sc.stands === false ? 'floor' : 'stands');
const secondRollOut = (sc: TeardownSecond) => sc.roll?.out ?? sc.leave;
const secondLift = (sc: TeardownSecond) => {
  const sup = secondSupport(sc);
  return sup === 'dolly' ? DOLLY.top : sup === 'floor' ? 0 : liftOf(secondScale(sc));
};
/** The second car's parked centre (room x, z). */
export const teardownSecondHome = (p: Partial<TeardownSliceSceneProps>): [number, number] | null => {
  const sc = p.second;
  if (!sc) return null;
  if (sc.at) return sc.at;
  const [, hi] = bodySpan(secondShape(sc));
  return [mainSpanX(p)[1] + SECOND_GAP + secondScale(sc) * hi, C.z];
};
/** The second car's room x span when parked (nose, tail). */
const secondSpanX = (p: Partial<TeardownSliceSceneProps>): [number, number] | null => {
  const home = teardownSecondHome(p);
  if (!home || !p.second) return null;
  const [lo, hi] = bodySpan(secondShape(p.second));
  const s2 = secondScale(p.second);
  return [home[0] - s2 * hi, home[0] - s2 * lo];
};
/** The room's x extent: 8 m, widened to hold the second car (0.6 m spare), or as `room` says. */
const roomExtent = (p: Partial<TeardownSliceSceneProps>): [number, number] => {
  const R = TEARDOWN_ROOM;
  const sp = secondSpanX(p);
  const home = teardownSecondHome(p);
  // a crate delivery stands behind the second car's rear (`ChargeBought.at`, default 3.45 m)
  const b = p.second?.bought;
  const crateEnd = home && b ? home[0] + (b.at ?? [3.45, 1.0])[0] + 0.51 : -Infinity;
  const x0 = Math.min(R.x0, sp ? sp[0] - 0.6 : R.x0);
  const x1 = Math.max(R.x0 + R.w, sp ? sp[1] + 0.6 : R.x0 + R.w, crateEnd + 0.6);
  return [p.room?.x0 ?? x0, p.room?.x1 ?? x1];
};
/** The second car's leave at t: its x offset (m) and speed (m/s, + toward +x). */
const secondDrive = (p: Partial<TeardownSliceSceneProps>, t: number): {dx: number; v: number; sign: 1 | -1} => {
  const sc = p.second;
  const lv = sc ? secondRollOut(sc) : undefined;
  if (!sc || !lv || secondSupport(sc) === 'stands') return {dx: 0, v: 0, sign: 1};
  const home = teardownSecondHome(p)!;
  const dir = lv.dir ?? (home[0] >= C.x ? 'right' : 'left');
  // `carDriveAt` drives forward toward −x (the cars face −x): x ≤ 0, speed ≥ 0
  const d = carDriveAt(undefined, {at: lv.at, to: lv.to ?? 12, for: lv.for ?? 3.0}, t);
  const sign = dir === 'left' ? 1 : -1;
  return {dx: sign * d.x, v: -sign * d.speed, sign};
};
/** A point on the second car (its own frame, x forward) → the room at t. */
const secondToRoom = (p: Partial<TeardownSliceSceneProps>, v: V3, t: number): V3 => {
  const sc = p.second!;
  const home = teardownSecondHome(p)!;
  const s2 = secondScale(sc);
  const dx = secondDrive(p, t).dx;
  return [home[0] + dx - s2 * v[0], secondLift(sc) + s2 * v[1], home[1] + s2 * v[2]];
};

/** The framings at the fixed angle (world metres, set on test stills). 'pair' frames the main car and `p.second` (default placement: a Model 3 beside the sedan). */
export const teardownFramings = (p: Partial<TeardownSliceSceneProps> = {}): Record<TeardownFraming, Framing> => {
  const pc = partCentre(TEARDOWN_PARTS.find((q) => q.id === 'pack')!);
  const pp: Partial<TeardownSliceSceneProps> = {...p, second: p.second ?? {}};
  const m = mainSpanX(pp);
  const s2 = secondSpanX(pp)!;
  const lo = Math.min(m[0], s2[0]);
  const hi = Math.max(m[1], s2[1]);
  const h2 = teardownSecondHome(pp)!;
  const lift2 = secondLift(pp.second!);
  return {
    mainPack: {look: [C.x + PACK_LOOK[0], liftOf(scaleOf(p)) + PACK_LOOK[1], C.z + PACK_LOOK[2]], distance: PACK_DIST},
    secondPack: {look: [h2[0] + PACK_LOOK[0], lift2 + PACK_LOOK[1], h2[1] + PACK_LOOK[2]], distance: PACK_DIST},
    pair: {look: [(lo + hi) / 2 + PAIR_LOOK[0], PAIR_LOOK[1], C.z + PAIR_LOOK[2]], distance: PAIR_DIST(hi - lo)},
    whole: {look: [0.13, -0.9, 1.2], distance: 31},
    grid: {look: [-0.45, -0.75, 1.5], distance: 22},
    pack: {look: [pc[0] + 0.1, -0.45, pc[1]], distance: 9},
    car: {look: [C.x + 0.55, 0.15, C.z + 0.15], distance: 21},
    nose: {look: [C.x - 0.95, 0.3, C.z + 0.2], distance: 10},
    tail: {look: [C.x + 1.95, 0.35, C.z + 0.2], distance: 10},
  };
};

/** The 'pair' framing: aim offset from the two cars' middle, and the distance for their span (set on stills). */
const PAIR_LOOK: V3 = [1.0, 0.6, 0.6];
const PAIR_DIST = (span: number) => Math.max(21, span * 3.9);
/** 'mainPack' / 'secondPack': a car's pack close up with its cabin above (aim offset from the car's centre on the floor + lift; set on stills). */
const PACK_LOOK: V3 = [0.3, 0.2, 0.5];
const PACK_DIST = 10.5;

const teardownCameraMove = (p: Partial<TeardownSliceSceneProps>, durationInFrames: number, fps: number, frame?: number) => {
  const name = p.framing ?? ((p.dressing ?? 'sedan') === 'hatch' ? 'car' : 'whole');
  const preset = teardownFramings(p)[name];
  if (p.cameraKeys && p.cameraKeys.length) {
    const base = p.camera?.from ?? preset;
    const f = framingAtKeys(p.cameraKeys, base, frame === undefined ? Infinity : frame / fps);
    return {from: f, to: f, pre: undefined};
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

export const teardownCameraStart = (p: Partial<TeardownSliceSceneProps>, d: number, fps: number): Framing =>
  teardownCameraMove({...p, cameraFrom: undefined, cameraGlide: undefined}, d, fps, 0).from;
export const teardownCameraEnd = (p: Partial<TeardownSliceSceneProps>, d: number, fps: number): Framing => teardownCameraMove(p, d, fps).to;

const teardownCameraAt = (p: Partial<TeardownSliceSceneProps>, o: {frame: number; fps: number; durationInFrames: number}) => {
  const {from, to, pre} = teardownCameraMove(p, o.durationInFrames, o.fps, o.frame);
  return sectionCameraAt({from, to, pre, frame: o.frame, fps: o.fps, durationInFrames: o.durationInFrames, drift: p.drift ?? 0, clockOffset: (p.startFrame ?? 0) / o.fps});
};

const ALL_MADE: TeardownGroup[] = ['body', 'lamps', 'trim', 'pack', 'drive', 'electronics', 'harness'];

/** Each part's glow keys from the scene's waves and surges (null: never lit). */
const partKeys = (p: Partial<TeardownSliceSceneProps>): Map<string, MadeByKeys | null> => {
  const share = p.share ?? true;
  const out = new Map<string, MadeByKeys | null>();
  const parts = TEARDOWN_PARTS;
  for (const g of p.glow ?? []) {
    const groups = g.groups ?? ALL_MADE;
    const these = parts.filter((q) => groups.includes(q.group) && !(share && q.bought) && !out.get(q.id));
    const order = g.order ?? 'sweep';
    const rankKey = (q: TeardownPart) => {
      const [x, z] = partCentre(q);
      if (order === 'size') return -(q.cell[2] * q.cell[3]) + x * 0.001;
      if (order === 'scatter') return hash(q.id);
      return x + z * 0.15;
    };
    const sorted = [...these].sort((a, b) => rankKey(a) - rankKey(b));
    sorted.forEach((q, i) => {
      const at = g.at + (sorted.length > 1 ? ((g.wave ?? 0) * i) / (sorted.length - 1) : 0);
      out.set(q.id, {at});
    });
  }
  for (const s of p.surge ?? []) {
    for (const q of parts) {
      const k = out.get(q.id);
      if (!k) continue;
      if (s.groups === undefined || s.groups === 'all' || s.groups.includes(q.group)) k.surge = [...(k.surge ?? []), s.at];
    }
  }
  return out;
};
/** A stable 0 → 1 hash of a part id (the 'scatter' order). */
const hash = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return ((h >>> 0) % 10000) / 10000;
};

/** Where a part is at t: on its cell, or flying out of the car (`apart`), or still in it (null). */
const partPose = (p: Partial<TeardownSliceSceneProps>, q: TeardownPart, t: number): {pos: V3; rot: V3} | null => {
  const [x, z] = partCentre(q);
  const dst: V3 = [x, 0, z];
  const a = p.apart;
  if (!a) return {pos: dst, rot: [0, 0, 0]};
  if (t < a.at) return null;
  const ranks = apartRanks();
  const span = Math.max(0, (a.for ?? 1.3) - 0.75);
  const t0 = a.at + span * (ranks.get(q.id) ?? 0);
  const u = ease(t, t0, t0 + 0.75);
  const src = carToRoom(p, q.from);
  const lerp = (i: number) => src[i] + (dst[i] - src[i]) * u;
  const arc = Math.sin(Math.PI * Math.min(1, Math.max(0, (t - t0) / 0.75))) * 0.55;
  const r0 = q.fromRot ?? [0, 0, 0];
  return {pos: [lerp(0), lerp(1) + arc, lerp(2)], rot: [r0[0] * (1 - u), r0[1] * (1 - u), r0[2] * (1 - u)]};
};
let RANKS: Map<string, number> | null = null;
/** The order the parts leave the car: big first (by cells, then the heavy systems), 0 → 1. */
const apartRanks = () => {
  if (RANKS) return RANKS;
  const weight = (q: TeardownPart) => q.cell[2] * q.cell[3] + (['pack', 'seats', 'drive', 'wheels'].includes(q.group) ? 2 : 0);
  const sorted = [...TEARDOWN_PARTS].sort((a, b) => weight(b) - weight(a) || a.id.localeCompare(b.id));
  RANKS = new Map(sorted.map((q, i) => [q.id, i / (sorted.length - 1)]));
  return RANKS;
};

const liftAt = (p: Partial<TeardownSliceSceneProps>, q: TeardownPart, t: number) =>
  (p.lift ?? []).reduce((h, l) => {
    if (!(l.groups ?? ['pack']).includes(q.group)) return h;
    const hold = l.hold ?? 0.15;
    return h + (l.height ?? 0.05) * (ease(t, l.at, l.at + 0.3) - ease(t, l.at + 0.3 + hold, l.at + 0.75 + hold));
  }, 0);

/**
 * A named point on screen (px) at a frame, for overlays: 'pack' (just above the pack's tile, as it lifts), 'roof'
 * (above the car's roof), 'top' (the main car's roof at its highest point on the centre line: a tag's leader start),
 * 'grid' (the grid's front edge, centre), 'part:<id>' (above any part, e.g. 'part:driveUnit'). The second car (they
 * follow it as it leaves): 'second:top' (its roof's highest point on the centre line), 'second:roof' (0.15 m above
 * it), 'second:nose', 'second:tail' (on the body near each end), 'second:pack' (its pack), 'second:centre' (mid
 * body), 'second:wheel' (above the front wheel), 'second:base' (the floor under it, front edge), 'second:blade' (its
 * slid-out blade's tip, with `car.blade`). 'blade': the main car's slid-out blade's tip (`car.blade`, following
 * `showAt` / `backAt`); 'crate': above the second car's crate (`second.bought`, the one in view).
 */
export const teardownAnchorOnScreen = (
  p: Partial<TeardownSliceSceneProps>,
  anchor: string,
  o: {frame: number; fps: number; durationInFrames: number},
): [number, number] | undefined => {
  const cam = teardownCameraAt(p, o);
  const t = o.frame / o.fps;
  if (anchor === 'top') {
    const r = carSilhouette(mainShape(p)).roof;
    return projectToFrame(cam, carToRoom(p, [r[0], r[1], 0]));
  }
  if (anchor === 'blade') {
    const b = carOptions(p).blade;
    return b ? projectToFrame(cam, carToRoom(p, bladeTipAt(b, t))) : undefined;
  }
  if (anchor === 'crate') {
    const sc = p.second;
    if (!sc?.bought) return undefined;
    const lift = secondLift(sc);
    const s2 = secondScale(sc);
    const st = chargeBoughtAt(sc.bought, t, 0, -lift / s2);
    const c = st.crates.find((q) => q.shown) ?? st.crates[0];
    if (!c) return undefined;
    const home = teardownSecondHome(p)!;
    return projectToFrame(cam, [home[0] + secondDrive(p, t).dx + c.x * s2, CRATE.pallet + CRATE.h + 0.1, home[1] + c.z * s2]);
  }
  if (anchor === 'second:blade') {
    const b = p.second ? (p.second.car?.blade ?? null) : null;
    return b ? projectToFrame(cam, secondToRoom(p, bladeTipAt(b, t), t)) : undefined;
  }
  if (anchor.startsWith('second:')) {
    const sc = p.second;
    if (!sc) return undefined;
    const sil = carSilhouette(secondShape(sc));
    const [lo, hi] = bodySpan(secondShape(sc));
    const r = sil.roof;
    const pts: Record<string, V3> = {
      top: [r[0], r[1], 0],
      roof: [r[0], r[1] + 0.15, 0],
      nose: [hi - 0.25, 0.85, 0],
      tail: [lo + 0.25, 1.0, 0],
      pack: [0, 0.3, 0.45],
      centre: [0, 0.75, 0],
      wheel: [1.35, 0.8, 0.8],
      base: [0, -secondLift(sc) / secondScale(sc), 0.9],
    };
    const v = pts[anchor.slice(7)];
    return v ? projectToFrame(cam, secondToRoom(p, v, t)) : undefined;
  }
  if (anchor === 'roof') {
    const car = carOptions(p);
    return projectToFrame(cam, carToRoom(p, [0, layoutOf(car).roofCut + 0.15, 0]));
  }
  if (anchor === 'grid') {
    const G = TEARDOWN_GRID;
    return projectToFrame(cam, [G.x0 + (G.cols * G.cell) / 2, 0, G.z0 + G.rows * G.cell]);
  }
  const id = anchor === 'pack' ? 'pack' : anchor.startsWith('part:') ? anchor.slice(5) : null;
  const q = id ? TEARDOWN_PARTS.find((x) => x.id === id) : undefined;
  if (!q) return undefined;
  const pose = partPose(p, q, t);
  if (!pose) return undefined;
  const h = partHull(q);
  return projectToFrame(cam, [pose.pos[0], pose.pos[1] + h.at[1] * 2 + 0.05 + liftAt(p, q, t), pose.pos[2]]);
};

const carOptions = (p: Partial<TeardownSliceSceneProps>): Partial<SlicedCarOptions> => {
  const hatch = (p.dressing ?? 'sedan') === 'hatch';
  return {
    variant: 'ev',
    shape: hatch ? 'hatch' : 'sedan',
    paint: hatch ? RACE.evPaint : CHARGE.bydPaint,
    // owner (2026-10-29): the hatch's near wheels whole, like the real shapes'
    ...(hatch ? {nearWheels: 'whole' as const} : {}),
    ...(p.car ?? {}),
  };
};


/** The parts in the grid (inside the canvas: their materials use the studio environment). */
const TeardownParts: React.FC<{p: TeardownSliceSceneProps; t: number; r: number; paint: string}> = ({p: props, t, r, paint}) => {
  const mood = props.mood ?? 'day';
  const dim = props.dimAt == null ? 0 : ease(t, props.dimAt, props.dimAt + 0.3);
  const {mats, boughtMats} = useTeardownMaterials(mood, paint, dim);
  const keys = useMemo(() => partKeys(props), [props]);
  const focusK = (props.focus ?? []).map((f) => ({
    groups: f.groups,
    k: ease(t, f.at, f.at + 0.3) * (f.until == null ? 1 : 1 - ease(t, f.until, f.until + 0.3)),
  }));
  return (
    <>
      {TEARDOWN_PARTS.map((q) => {
              const pose = partPose(props, q, t);
              if (!pose) return null;
              const k = keys.get(q.id);
              const st = madeByState(k, t);
              const h = partHull(q);
              const sw = swellOf(st.surge);
              const fd = focusK.reduce((d, f) => (f.groups.includes(q.group) ? d : d * (1 - 0.6 * f.k)), 1);
              const y = pose.pos[1] + liftAt(props, q, t);
              return (
                <group key={q.id} position={[pose.pos[0], y, pose.pos[2]]} rotation={pose.rot}>
                  <group position={[0, h.at[1], 0]} scale={sw}>
                    <group position={[0, -h.at[1], 0]}>
                      <PartGlow.Provider value={st.lit > 0.003 ? {lit: st.lit, surge: st.surge, r, dim: fd} : null}>
                        <PartModel part={q} mats={q.bought ? boughtMats : mats} />
                      </PartGlow.Provider>
                    </group>
                  </group>
                </group>
              );
            })}
    </>
  );
};

/** The second car's story paint. */
const secondPaint = (sc: TeardownSecond) =>
  sc.car?.paint ?? sc.paint ?? (secondShape(sc) === 'model3' ? CHARGE.teslaPaint : secondShape(sc) === 'seal06' ? CHARGE.bydPaint : RACE.evPaint);

const DEFAULT_STOOL: [number, number] = [-3.45, -1.25];
/** The tool chest's foot (x, z): `chest.at`, else at the left wall (forward along it when the room widens left). */
const chestFoot = (p: Partial<TeardownSliceSceneProps>): [number, number] => {
  if (p.chest?.at) return p.chest.at;
  const [rx0] = roomExtent(p);
  return rx0 < TEARDOWN_ROOM.x0 - 1e-6 ? [rx0 + 0.42, -0.3] : [TEARDOWN_ROOM.x0 + 0.42, TEARDOWN_ROOM.z0 + 1.0];
};
/** The room's fixed points for the mechanic (`DriverGeo`, room metres), from the cars and the chest. */
const workerGeo = (p: Partial<TeardownSliceSceneProps>): DriverGeo => {
  const chestAt = chestFoot(p);
  const [mx0, mx1] = mainSpanX(p);
  const stool = p.worker?.stool ?? DEFAULT_STOOL;
  const home = teardownSecondHome(p);
  const sp = secondSpanX(p);
  // the cars' near side (the stands' feet, the near tires) and where a walk round them passes
  const front = C.z + 0.95 * scaleOf(p);
  const roof = carToRoom(p, [0, 1.1, 0.2]);
  const tail2: [number, number] = sp && home ? [sp[1] - 0.3, home[1] + 1.35] : [mx1 + 0.6, front + 0.3];
  return {
    seat: [roof[0], 0.5, roof[2]],
    door: [C.x - 0.3, front + 0.4],
    cabinet: [chestAt[0], chestAt[1] + 0.72],
    holster: [chestAt[0], 0.6, chestAt[1] + 0.23],
    port: tail2,
    portNose: sp && home ? [sp[1] - 0.2, 0.8, home[1]] : null,
    quarter: [mx1 - 0.45, front + 0.27],
    // the stool's seat: sitting faces into the room (toward +x, a little toward the camera)
    curb: {at: stool, top: STOOL.top, rot: 1.1},
    plugKind: 'gbt',
    avoid: [
      [mx0 - 0.2, mx1 + 0.2, front + 0.05],
      ...(sp ? [[sp[0] - 0.2, sp[1] + 0.2, front + 0.05] as [number, number, number]] : []),
    ],
    clock: [roof[0], roof[1], roof[2]],
  };
};

/** The mechanic and the stool. */
const Worker: React.FC<{p: TeardownSliceSceneProps; t: number; fps: number}> = ({p, t, fps}) => {
  const w = p.worker!;
  const geo = useMemo(() => workerGeo(p), [p]);
  const tl = useMemo(() => {
    // a glance at 'car' is the main car's cabin here (the charge slice's is its bay's car)
    const cabin = carToRoom(p, [0.2, 1.1, 0]);
    const keys = w.keys.map((k) => (k.do === 'glance' && k.to === 'car' ? {...k, to: cabin} : k));
    return driverTimeline({keys, start: w.start ?? 'cabinet', look: w.look ?? 'a', rate: w.rate}, geo);
  }, [w, geo, p]);
  const pose = driverPoseAt(tl, t);
  const mats = useMemo(
    () => ({
      seat: new THREE.MeshStandardMaterial({color: raw(REAL.labDark), roughness: 0.7}),
      steel: new THREE.MeshPhysicalMaterial({color: raw(REAL.steel), roughness: 0.35, metalness: 0.85}),
      wheel: new THREE.MeshStandardMaterial({color: raw(REAL.rubber), roughness: 0.8}),
    }),
    [],
  );
  const stool = w.stool ?? DEFAULT_STOOL;
  return (
    <>
      <ShopStool position={[stool[0], 0, stool[1]]} mats={mats} />
      <ChargeDriverFigure pose={pose} mood={p.mood ?? 'day'} look={w.look ?? 'a'} seed="teardown-worker" clockOffset={(p.startFrame ?? 0) / fps} />
    </>
  );
};

/** The second car on its stands, dolly or tires, rolling out on `roll.out`. */
const SecondCar: React.FC<{p: TeardownSliceSceneProps; t: number; fps: number; camD: number; standMat: THREE.Material}> = ({p, t, fps, camD, standMat}) => {
  const sc = p.second!;
  const mood = p.mood ?? 'day';
  const home = teardownSecondHome(p)!;
  const s2 = secondScale(sc);
  const sup = secondSupport(sc);
  const {dx, v, sign} = secondDrive(p, t);
  const dollyMats = useMemo(
    () => ({
      plate: new THREE.MeshPhysicalMaterial({color: raw(REAL.cabinet), roughness: 0.55, metalness: 0.5}),
      steel: new THREE.MeshPhysicalMaterial({color: raw(REAL.steel), roughness: 0.35, metalness: 0.85}),
      wheel: new THREE.MeshStandardMaterial({color: raw(REAL.rubber), roughness: 0.8}),
    }),
    [],
  );
  const lift = secondLift(sc);
  // cells bought in: crates behind its rear, their modules into its slots (the crate's floor is the room's, under the lifted car)
  const boughtSt = sc.bought ? chargeBoughtAt(sc.bought, t, 0, -lift / s2) : null;
  if (Math.abs(dx) > 40) return null;
  // on the floor the tires roll the way it moves (+ forward toward −x); on stands or the dolly they don't turn,
  // unless the brief's `car.driving` keys turn them in the air
  let wheelKeys: Partial<SlicedCarOptions> = {driving: [{at: -100, speed: 0}], wheelFrom: 0};
  const ro = secondRollOut(sc);
  if (sup === 'floor' && ro) {
    const lv = {at: ro.at, to: ro.to ?? 12, for: ro.for ?? 3.0};
    const revs = sign * carWheelRevs(undefined, lv, t, fps);
    const sRevs = -v / (2 * Math.PI * WHEEL_R);
    const cap = capRevs(fps);
    wheelKeys = {driving: [{at: -100, speed: sRevs}], wheelFrom: revs - Math.sign(sRevs) * Math.min(Math.abs(sRevs), cap) * t};
  } else if (sc.car?.driving) wheelKeys = {};
  const opts: SlicedCarOptions = {
    variant: 'ev',
    madeBy: sc.madeBy ?? null,
    ...(sc.packRewind ? {packRewind: sc.packRewind} : {}),
    ...wheelKeys,
    ...(sc.car ?? {}),
    shape: secondShape(sc),
    paint: secondPaint(sc),
    ...(boughtSt ? {packModules: boughtSt.slots} : {}),
    mood,
    road: 'street',
    driverShown: sc.car?.driverShown ?? false,
    brakeLights: sc.car?.brakeLights ?? 0,
    foot: sc.car?.foot ?? [{at: -1, pose: 'floor'}],
    clusterSpeed: sc.car?.clusterSpeed ?? 0,
    power: sc.car?.power ?? 0,
    strip: false,
    wheelsShown: true,
    startFrame: p.startFrame ?? 0,
  };
  const x = home[0] + dx;
  const stands: V3[] = [
    [-1.0, 0, 0.5],
    [1.0, 0, 0.5],
    [-1.0, 0, -0.7],
    [1.0, 0, -0.7],
  ].map((q) => [x - s2 * q[0], 0, home[1] + s2 * q[2]] as V3);
  // the castors: each starts at its own seeded angle and swings round to trail (wheel behind its axis) over the first
  // 0.35 m; moving +x the wheel trails toward −x (yaw 0), moving −x yaw π
  const k = Math.min(1, Math.abs(dx) / 0.35);
  const kk = k * k * (3 - 2 * k);
  const target = sign === -1 ? 0 : Math.PI;
  const yaw = [0, 1, 2, 3].map((i) => {
    const y0 = (random(`teardown-dolly-castor-${i}`) - 0.5) * 2 * Math.PI;
    const d = Math.atan2(Math.sin(target - y0), Math.cos(target - y0));
    return y0 + d * kk;
  });
  return (
    <>
      {sup === 'stands' ? stands.map((q, i) => <AxleStand key={i} position={q} mat={standMat} />) : null}
      {sup === 'dolly' ? (
        <group position={[x, 0, home[1] - 0.075 * s2]}>
          <ShopDolly yaw={yaw} spin={-Math.abs(dx) / DOLLY.castorR} mats={dollyMats} />
        </group>
      ) : null}
      <group position={[x, lift, home[1]]} scale={s2}>
        <SlicedCar {...opts} ground={false} cameraDistance={camD / s2} />
      </group>
      {boughtSt
        ? boughtSt.crates.map((c, i) => (c.shown ? <SupplierCrate key={`crate${i}`} position={[x + c.x * s2, 0, home[1] + c.z * s2]} open={c.open} /> : null))
        : null}
    </>
  );
};

/**
 * T, The Lab · teardown (No. 011): a car on axle stands in a re-dressed Lab; the sedan comes apart into a floor-tape
 * grid of its parts, a scan line checks them, 3 of every 4 light with the "made by" glow and the bought quarter
 * darkens; or a second car (the hatch) whole on the stands, its part groups lit in turn. The camera frames it at the
 * fixed angle.
 */
export const TeardownSliceScene: React.FC<TeardownSliceSceneProps> = (props) => {
  const {durationInFrames, mood = 'day', startFrame = 0} = props;
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const hatch = (props.dressing ?? 'sedan') === 'hatch';
  const {from, to, pre} = teardownCameraMove(props, durationInFrames, fps, frame);
  const cam = teardownCameraAt(props, {frame, fps, durationInFrames});
  const camD = cam.position.distanceTo(cam.look);
  const inkK = Math.max(0.15, Math.min(4, camD / 12.75));
  const r = madeByCoreR(camD);
  const s = scaleOf(props);
  const lift = liftOf(s);
  const car = carOptions(props);
  const standMat = useMemo(() => new THREE.MeshPhysicalMaterial({color: raw(HIGHWAY.galvanized), roughness: 0.4, metalness: 0.6}), []);
  const scanMat = useMemo(() => scanMaterial(), []);
  // the sedan is whole until it comes apart; the hatch always
  const apartAt = props.apart?.at;
  const whole = hatch || (apartAt !== undefined && t < apartAt);
  // the scan line: `scanPx` on screen at this distance (px per metre ≈ 1920 / (0.4618 × camD)), widened by the
  // floor's foreshortening along its width (a width along axis a shows × √(1 − (view·a)²); floored at 0.2)
  const view = cam.look.clone().sub(cam.position).normalize();
  const scanW0 = ((props.scanPx ?? 3) * camD) / 4158;
  const scanW = (along: 'x' | 'z') => scanW0 / Math.max(0.2, Math.sqrt(Math.max(0, 1 - (along === 'x' ? view.x : view.z) ** 2)));
  const G = TEARDOWN_GRID;
  const gw = G.cols * G.cell;
  const gd = G.rows * G.cell;
  const [rx0, rx1] = roomExtent(props);
  const wide = rx0 < TEARDOWN_ROOM.x0 - 1e-6 || rx1 > TEARDOWN_ROOM.x0 + TEARDOWN_ROOM.w + 1e-6;
  // a room widened to the left takes the tool chest forward along the left wall, clear of a car in the back row
  const chest: [number, number] | undefined = props.chest?.at || rx0 < TEARDOWN_ROOM.x0 - 1e-6 ? chestFoot(props) : undefined;
  const ch = props.chest;
  const drawer = ch ? (ch.open == null ? 0 : ease(t, ch.open, ch.open + 0.4)) * (ch.close == null ? 1 : 1 - ease(t, ch.close, ch.close + 0.4)) : 0;
  const scans = (props.scan ?? [])
    .map((sc) => {
      const dur = sc.for ?? 1.0;
      const u = (t - sc.at) / dur;
      if (u < 0 || u > 1) return null;
      const k = ease(t, sc.at, sc.at + dur);
      if ((sc.along ?? (hatch ? 'car' : 'grid')) === 'car') {
        const x0 = C.x - 2.5 * s;
        const x1 = C.x + 2.5 * s;
        const za = C.z - 1.05 * s;
        const zb = C.z + 1.0 * s;
        return {pos: [x0 + (x1 - x0) * k, 0.003, (za + zb) / 2] as V3, size: [scanW('x'), 0.002, zb - za] as V3};
      }
      return {pos: [G.x0 + gw / 2, 0.003, G.z0 + gd - gd * k] as V3, size: [gw + 0.2, 0.002, scanW('z')] as V3};
    })
    .filter((x): x is {pos: V3; size: V3} => x !== null);
  const stands: V3[] = [
    [-1.0, 0, 0.5],
    [1.0, 0, 0.5],
    [-1.0, 0, -0.7],
    [1.0, 0, -0.7],
  ].map((v) => {
    const w = carToRoom(props, v as V3);
    return [w[0], 0, w[2]];
  });
  const opts: SlicedCarOptions = {
    ...car,
    mood,
    road: 'street',
    driverShown: false,
    brakeLights: car.brakeLights ?? 0,
    foot: car.foot ?? [{at: -1, pose: 'floor'}],
    clusterSpeed: car.clusterSpeed ?? 0,
    power: car.power ?? 0,
    strip: car.strip ?? !whole,
    wheelsShown: car.wheelsShown ?? whole,
    startFrame,
  };

  return (
    <AbsoluteFill>
      <SectionStage mood={mood} post={{focusY: 0.5}} ao far={200}>
        <SectionCamera from={from} to={to} pre={pre} durationInFrames={durationInFrames} drift={props.drift ?? 0} clockOffset={startFrame / fps} fitClip farMin={120} />
        <SectionLights
          mood={mood}
          target={wide ? [(rx0 + rx1) / 2, 0.5, -0.2] : [0, 0.5, -0.2]}
          lamp={0}
          extent={wide ? Math.max(5, (rx1 - rx0) / 2 + 1) : 5}
          figureSpot={false}
        />
        <TeardownRoom mood={mood} inkScale={inkK} grid={!hatch} x0={rx0} x1={rx1} chest={chest} drawer={drawer} />
        {props.second ? <SecondCar p={props} t={t} fps={fps} camD={camD} standMat={standMat} /> : null}
        {props.worker ? <Worker p={props} t={t} fps={fps} /> : null}
        {stands.map((p, i) => (
          <AxleStand key={i} position={p} mat={standMat} />
        ))}
        <group position={[C.x, lift, C.z]} scale={s}>
          <SlicedCar {...opts} ground={false} cameraDistance={camD / s} />
        </group>
        {hatch ? null : <TeardownParts p={props} t={t} r={r} paint={car.paint ?? CHARGE.bydPaint} />}
        {scans.map((sc, i) => (
          <mesh key={i} position={sc.pos} material={scanMat} renderOrder={8}>
            <boxGeometry args={sc.size} />
          </mesh>
        ))}
      </SectionStage>
    </AbsoluteFill>
  );
};
