import React, {useMemo} from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import * as THREE from 'three';
import {EXTRA_B, MOODS, section, type Mood} from '../theme';
import {Plume} from '../three/Atmosphere';
import {OrangeLight} from '../three/OrangePath';
import {CurveArrow, PushArrow} from '../three/PushArrow';
import {raw, roundedBox} from '../three/plaster';
import {WaterMeter} from '../three/real/WaterMeter';
import {
  CoolingTower,
  DryCooler,
  DRY_DC,
  DRY_INLET,
  TOWER_DC,
  TOWER_INLET,
  TOWER_MAKEUP_IN,
  TOWER_OUTLET,
} from '../three/section/CoolingTower';
import {CutOutline, INK, type Rect} from '../three/section/cutLook';
import {
  alongWithDir,
  BlowdownValve,
  catenary,
  CoilWall,
  Controller,
  CutPipeRun,
  DosingSkid,
  FillStation,
  FlowMarks,
  HeatWisps,
  Pipe,
  PowerPole,
  Rod,
  SampleJars,
  Switchgear,
  Transformer,
  useDcMats,
  type DcMats,
  type TransformerKind,
} from '../three/section/dcParts';
import {Figure} from '../three/section/Figure';
import {GlowNode, GlowPolyline, NODE_SCALE, pointAlong, polylineLength} from '../three/section/GlowLines';
import {
  formatOf,
  projectToFrame,
  SECTION_ANGLE,
  SectionCamera,
  sectionCameraAt,
  useFormatProps,
  type Framing,
} from '../three/section/SectionCamera';
import {RACK, ServerRack} from '../three/section/ServerRack';
import {SectionLights, SectionStage} from '../three/section/SectionStage';
import {skyTexture} from '../three/section/textures';
import type {Format} from '../theme';
import {ease, framingAtKeys, type CameraKey} from './keyframes';
import {revealTrackAt, type Reveal} from './openingReveal';
import {useThree} from '@react-three/fiber';
import {sectionFov} from '../three/section/SectionCamera';

/*
 * N1, the data centre (No. 013 `datacenter-water`, av-script § 4): one two-storey data centre cut open at the fixed
 * angle, ≈ 14 m wide on the sheet, with its utility yard on the left and the cut ground in front, horizontal (16:9) and
 * vertical (9:16) framings for every shot.
 *
 *  - Ground floor, left: the data hall on a raised floor. Two rack rows run back from the cut: row A's backs and row B's
 *    backs face the hot aisle between them; row A's front-end rack is the AI rack (dense, more fans, coolant hoses), its
 *    near side cut open. Behind the rows the fan-coil wall: the finned coil behind the hot aisle (blue-grey supply below,
 *    the return above), fan sections in front of the cold aisles. A technician in cold aisle B.
 *  - Ground floor, right: the mechanical room. The riser pipes in the back-left corner (warm, cold, makeup), the
 *    chemical dosing skid, the conductivity controller over a small sample bench (two jars with probes), the blowdown
 *    valve with its floor sink and a trench drain to the front, the loop pumps, the fill station with a level gauge,
 *    and the loop's header pipe lying in the section plane along the front, so the section cuts it lengthwise (scale on
 *    its left stretch, corrosion on its right).
 *  - Upper floor: the riser shaft going on up, UPS cabinets, an air handler (neutral).
 *  - Roof: two cooling towers on steel dunnage (tower A, over the plant room, can be cut open), or the two dry coolers
 *    that replace them (`roof`, `roofSwap`); the plume above (`Plume`).
 *  - Yard: a power line in from the left on two poles, transformers on pads (slide in and out by count and kind), the
 *    switchgear with its electric meter.
 *  - Cut ground: the service line from the left along the front cut face through the meter pit (`WaterMeter`), up into
 *    the plant room; the sewer lateral to the right, which the orange drain path runs down to.
 *
 * Orange (the video's palette note): the heat leaving the racks (shimmer, haze, hot-air arrows), the warm water (the route
 * coil → riser → tower, the warm rain at the nozzles, the dry coolers' tubes), what the water carries away (the vapour's
 * heat tokens, the drain path). Never orange: electricity, cold and fresh water, minerals, scale, corrosion, biofilm,
 * chemicals, people, cut faces.
 *
 * World: metres; x along the building (left → right), y up (ground 0), z toward the camera; the section plane is z =
 * `DC.zf`. Times are seconds into the scene; any key may lie outside it (a later scene of the same take passes earlier
 * keys as negative numbers). Every key track is `[{at, v}]` (eased cubic, held after the last key) or a constant.
 */

type V3 = [number, number, number];

// ---------------------------------------------------------------------------------------------------- props

/** A key track: a constant, or `[{at, v}]` eased cubic between keys (a key at ≤ 0 is the opening state). `value` = `v`. */
export type Track = number | {at: number; v?: number; value?: number}[];

export type DcFraming =
  | 'wide'
  | 'wideRight'
  | 'hall'
  | 'racks'
  | 'aiRack'
  | 'rackBack'
  | 'coil'
  | 'hallWall'
  | 'riser'
  | 'roof'
  | 'roofWide'
  | 'tower'
  | 'towerValve'
  | 'fill'
  | 'basin'
  | 'basinClose'
  | 'plant'
  | 'plantUp'
  | 'jars'
  | 'pipe'
  | 'pipeClean'
  | 'dosing'
  | 'valve'
  | 'loop'
  | 'lateral'
  | 'lateralRight'
  | 'meter'
  | 'serviceLine'
  | 'drycooler'
  | 'yard'
  | 'yardWide'
  | 'elecMeter'
  | 'yardRoof'
  /** The long-form thumbnail's framing (style guide § 11.9.1): AI rack lower left, the cut tower upper right, the plume above. */
  | 'THUMB';

/** A camera key: arrive at a named framing (or a look-at + distance) `at` s into the scene. */
export type DcCameraKey = {at: number; ease?: 'out' | 'inOut' | 'sine'; log?: boolean} & (
  {framing: DcFraming} | {look: V3; distance: number}
);

export type DatacenterSliceSceneProps = {
  durationInFrames: number;
  /** Day (default; the video's one hot afternoon) or Night. */
  mood?: Mood;
  /** The sun swung about the vertical (rad; `SectionLights.keyYaw`): long shadows to the left, or time passing. Default 0. */
  keyYaw?: Track;

  // --- camera
  /** Named start framing (default 'wide'); resolves per format (the 9:16 framing in a Short). */
  framing?: DcFraming;
  /** A custom move instead of a preset. */
  camera?: {from: Framing | DcFraming; to?: Framing | DcFraming};
  /** Camera keys: arrive at each framing at `at` (cubic in-out from the previous); the camera starts where the last scene ended (or `framing`). */
  cameraKeys?: DcCameraKey[];
  /** The slow push, a share of the distance per second (default 0.002 wide frame, 0.003 vertical: § 11.6 "≈ 0.2 %/s"). It never stops. */
  push?: number;
  /** Idle sideways drift (± m, default 0.08). */
  drift?: number;

  // --- the roof
  /** What stands on the roof at the start: 'towers' (default) or 'dry' (dry coolers). */
  roof?: 'towers' | 'dry';
  /** The swap from `at` (≈ 2 s): unit A's outgoing unit slides back off the roof and the new one lowers in, then unit B's. */
  roofSwap?: {at: number; to: 'towers' | 'dry'};
  /** Seconds when tower A's near face cuts away (top-down, 0.6 s); ≤ the scene's start = open throughout. Omit: closed. */
  towerCut?: number;
  /** Seconds when dry cooler A's near face cuts away. Omit: closed. */
  dryCut?: number;
  /** Fan speed level (towers: 1 ≈ 1.7 rev/s; dry coolers 1 ≈ 2 rev/s). Default 0.85 (towers), 1 (dry). */
  fans?: Track;
  /** Tower / cooler B's fans if different (default `fans`). */
  fansB?: Track;
  /** The plume's strength (0 none, 1 normal, ≤ 2). Default 1 with towers, 0 with dry coolers. */
  plume?: Track;
  /** The plume rises in pulses from `from`, one every `every` s. */
  plumePulse?: {from: number; every?: number};
  /** Orange heat tokens in the plume from this time (also on with `vapor.tokens`). */
  tokensAt?: number;
  /** Rain over tower A's fill (it starts at `from`, 0.5 s). Default on whenever the tower is open; false: none. */
  rain?: {from: number} | false;
  /** Before `at` the falling water is warm (orange) all the way down; from `at` (1.5 s) it fades top → basin. Omit: the fade is there. */
  rainFade?: {at: number};
  /** Vapour wisps peeling off the fill every `every` s (0.8) from `from`, each with an orange heat token (`tokens`, default true). */
  vapor?: {from: number; every?: number; tokens?: boolean};
  /** Neutral air arrows in through the louvers and up through the fan (from `from`). */
  airIn?: {from: number};
  /** The basin's level ripples (a swell of ripples) at `at`. */
  basinRipple?: {at: number};
  /** The basin's level, 0 → 1 (default 0.55, lifted by `makeup`). */
  level?: Track;
  /** Mineral dots in the basin, 0 → 1. */
  minerals?: Track;
  /** Mineral dots ride the falling water down (they stay behind when it evaporates) from `from`. */
  mineralFall?: {from: number};
  /** The muted-olive biofilm on the basin wall and the fill's bottom edge, 0 → 1 (spreads and recedes). */
  biofilm?: Track;
  /** The makeup valve's opening, 0 → 1: fresh water pours into the basin, the float rises, the makeup line flows. */
  makeup?: Track;
  /** Orange warm air rising off the dry coolers from `from`. */
  warmAir?: {from: number};

  // --- the hall
  /** Heat shimmer off the racks' backs, 0 → 1.5: `racks` the ordinary ones, `ai` the AI rack (its column grows taller). */
  heat?: {racks?: Track; ai?: Track};
  /** The hot aisle's orange haze, 0 → 1 (fills from the floor up, pools at the ceiling against the coil wall). */
  haze?: Track;
  /** The AI rack's fans (level; default 0.5). */
  aiFans?: Track;
  /** The technician in cold aisle B: walks in at `walkAt`, pulls a server half out at `pullAt` (out 0.8 s, hold 1.4, back 0.8). null: nobody. */
  technician?: {walkAt?: number; pullAt?: number} | null;
  /** Orange hot-air arrows streaming from the AI rack's back down the hot aisle to the coil, one every `every` s (0.6) from `from`; `coolThrough`: they leave the fan sections neutral. */
  hotAir?: {from: number; every?: number; coolThrough?: boolean; until?: number};
  /** Neutral flow in the coil's supply and the cold leg from `from`. */
  coilFlow?: {from: number};
  /** Neutral flow down the return riser (basin → coil) from `from`. */
  returnFlow?: {from: number};
  /** The sealed loop circulating (ch. 4): neutral on the cold legs, pale-orange dots on the warm, from `from`. */
  loopFlow?: {from: number};

  // --- the loop and the orange route
  /**
   * The orange route coil → riser → tower. `drawAt`: the coil's return glows and its node dot lights; then each leg draws
   * (1.8 s) up to `to` ('coil' | 'riserFoot' | 'towerInlet', default 'towerInlet'). `extendAt`: the last leg starts then
   * (and takes `extendFor` s, default 1.8); the legs before it are drawn from `drawAt`. Pale dots travel the finished route.
   */
  route?: {drawAt: number; to?: 'coil' | 'riserFoot' | 'towerInlet'; extendAt?: number; extendFor?: number};
  /** The X-ray of the hall's back wall round the route (§ 5: once per video): opens top-down at `at` (0.45 s), closes at `closeAt`. */
  xray?: {part?: 'hallWall'; at: number; closeAt?: number};
  /** The whole loop running fast: from `at`, `laps` laps of `every` s (3.0): marks on every leg. */
  lap?: {at: number; every?: number; laps?: number};
  /**
   * A marked parcel of water (a neutral ring) riding the loop from `at` at the base pace (a lap in 6 s); from `from`, `laps`
   * fast laps of `every` s (1.2); `ticks` lights one tick on the basin wall per fast lap.
   */
  ring?: {at: number; every?: number; laps?: number; ticks?: boolean; from?: number};

  // --- the plant room
  /** The cut header: scale growing inward on its left stretch, corrosion (pits, the wall thinning) on its right; 0 → 1 each. */
  pipeCut?: {scale?: Track; corrosion?: Track};
  /** The sample jars: from `at` the loop jar's dots multiply to `multiply` × (4) over 1.5 s; its probe's needle swings at `probeAt`. */
  jars?: {at: number; multiply?: number; probeAt?: number};
  /** The conductivity controller: the needle and the set point, in cycles (1 → 6). Defaults 2.5 and 4. */
  controller?: {needle?: Track; setPoint?: Track};
  /** The dosing pumps stroke (every 0.5 s) and clear drops fall from `from` (to `until`). */
  dosing?: {from: number; until?: number};
  /** The blowdown valve's opening and its stream, 0 → 1. */
  blowdown?: Track;
  /** The orange drain path from the floor sink to the sewer lateral: draws at `drawAt` (2.4 s); pulses run down it every `pulseEvery` s from `pulseFrom`. */
  drain?: {drawAt?: number; pulseEvery?: number; pulseFrom?: number};
  /** The water budget: 4 neutral arrows in at the meter (`inAt`), 3 orange ones up out of the towers (`vaporAt`), 1 orange one down the drain (`drainAt`). */
  split?: {inAt: number; vaporAt?: number; drainAt?: number};
  /** The fill station (ch. 4): the hose connects at `connectAt`, the gauge rises to full by `fullAt`, the hose comes off and the cap and lock tag go on at `capAt`. A worker does it. */
  fillHose?: {connectAt: number; fullAt?: number; capAt?: number};

  // --- outside
  /** Transformers in the yard: from each key's `at`, `n` units of `kind` ('small' old grey box | 'mid' | 'big'); new ones drop in (`every` s apart, default 0.35), extra ones lift out. Default 6 big. */
  transformers?: {at: number; n: number; kind?: TransformerKind; every?: number}[];
  /** The line becomes a double circuit (second crossarm and three more wires draw in, 1 s). */
  lineDoubleAt?: number;
  /** The electric meter's disc speed (level; 1 ≈ 1.2 rev/s). Default 0.5. The transformers' fans follow it. */
  elecMeter?: Track;
  /** The street water meter's dial speed (level; 1 ≈ 1.6 rev/s). Default 0.4 with towers, 0.05 with dry coolers. */
  waterMeter?: Track;
  /** Neutral flow along the service line from `from` (default: while the water meter turns). */
  serviceFlow?: {from: number};
  /** The insulators glint (neutral white) at these times. */
  lineGlintAt?: number | number[];
  /**
   * The "real to section" reveal (§ 11.6.1; set by the Explainer on a long video's first scene when its opening has one,
   * see `openingReveal.ts`): over the footage the camera rides the reveal's track (any angle and lens), from `release`
   * it glides and dolly-zooms (the building's size held) onto this scene's own camera at `land` (video frames), and
   * the orange tell's node dots (racks' backs, riser head, tower basin) pulse once from `tell`.
   */
  reveal?: Reveal;

  // --- stills
  /** The orange route's core, node dots and travelling dots scaled (default 1). Stills only: 2.5 on the thumbnail (§ 11.9.1). */
  routeScale?: number;
  /** The cut edges' ink lines scaled (default 1). Stills only: 1.5 on the thumbnail (§ 11.9.1). */
  inkScale?: number;

  // --- set by the Explainer
  location?: string;
  transition?: 'auto' | 'continue' | 'glide' | 'cut' | 'dissolve' | 'slide' | 'follow';
  follow?: {direction?: 'down' | 'up' | 'left' | 'right'; at?: number};
  glide?: number;
  startFrame?: number;
  cameraFrom?: Framing;
  cameraGlide?: number;
  format?: Format;
  /** Carried on a `continue` (see `dcCarry`): turns so far, so nothing jumps at the cut. */
  fanFrom?: number;
  fanBFrom?: number;
  aiFanFrom?: number;
  elecFrom?: number;
  waterFrom?: number;
};

// ---------------------------------------------------------------------------------------------------- layout

/** The set's dimensions (m). Exported for the town sheet's lower-detail instance (N2). */
export const DC = {
  zf: 2.5,
  zb: -3.5,
  wallT: 0.2,
  x0: -7,
  x1: 7,
  hallX1: 0.6,
  plantX0: 0.8,
  floorH: 4.6,
  slab: 0.4,
  upperY: 5.0,
  roofSlabY: 8.4,
  roofY: 8.8,
  /** The upper storey and the roof are cut further back (a stepped section), so the hall's and the plant room's back walls show under them. */
  zu: 0.7,
  /** The orange route's run inside the hall's back wall (the X-ray band 2.8–3.3 round it). */
  wallRouteY: 3.05,
  parapet: 0.6,
  dunnage: 0.4,
  raised: 0.45,
  groundY: -2.8,
  groundX0: -17.6,
  groundX1: 12.5,
  groundZ0: -4.4,
  yardX0: -17.2,
  yardX1: -7.4,
  /** Rack rows: row A (x −5.25..−4.15) backs +x, row B (x −2.95..−1.85) backs −x; 6 racks each from z −1.6 to 2.0. */
  rowA: -4.7,
  rowB: -2.4,
  hotX: [-4.15, -2.95] as [number, number],
  rackZ0: -1.6,
  racks: 6,
  coilZ: -2.3,
  coilH: 2.3,
  riserWarm: 1.25,
  riserCold: 1.65,
  riserMakeup: 2.05,
  riserZ: -3.12,
  towerA: [2.7, 9.2, -1.2] as V3,
  towerB: [-2.3, 9.2, -1.2] as V3,
  meter: [-7.9, -0.95, 2.22] as V3,
  pit: [-8.8, -7.0] as [number, number],
  pitDepth: 1.5,
  serviceY: -1.0,
  lateralY: [-2.1, -2.1] as [number, number],
  header: {x0: 1.65, x1: 6.2, y: 0.55, r: 0.22},
  scaleSpan: [1.95, 3.95] as [number, number],
  corrosionSpan: [4.15, 6.0] as [number, number],
  controller: [4.7, 2.2, -3.27] as V3,
  bench: {x: 4.7, top: 0.9, z: -2.98},
  valve: [5.6, 1.35, -2.95] as V3,
  sinkX: 5.77,
  dosing: [3.2, 0, -2.72] as V3,
  fill: [5.0, 1.02, 2.3] as V3,
  pumpsX: 6.2,
  serviceRiserX: 6.75,
  switchgear: [-9.5, 0, -0.6] as V3,
  switchgearW: 1.8,
  poles: [-17.2, -12.3] as number[],
  polesZ: -3.8,
  poleH: 9.5,
};

const rackZ = (i: number) => DC.rackZ0 + RACK.w / 2 + i * RACK.w;
/** The AI rack: row A's front-end rack (its back toward the hot aisle, its near side cut open). */
const AI_RACK = {x: DC.rowA, z: rackZ(DC.racks - 1)};
/** The rack row B's technician pulls from (index from the back) and the unit (from the bottom). */
const PULL = {rack: 3, unit: 7};

const towerWorld = (base: V3, local: V3): V3 => [base[0] + local[0], base[1] + local[1], base[2] + local[2]];

/** The orange route's stops and legs (world). */
export const dcRoute = () => {
  const coilOut: V3 = [-3.55, DC.raised + DC.coilH + 0.15, DC.coilZ - 0.3];
  const riserFoot: V3 = [DC.riserWarm, DC.wallRouteY, DC.riserZ];
  const inlet = towerWorld(DC.towerA, TOWER_INLET);
  const wallZ = DC.zb + DC.wallT / 2;
  const header: number = DC.roofY + 1.0;
  return {
    coilOut,
    /** The coil's return header (glows from `drawAt`). */
    coilReturn: [
      [DC.hotX[0] + 0.1, coilOut[1], coilOut[2]],
      [DC.hotX[1] - 0.1, coilOut[1], coilOut[2]],
    ] as V3[],
    leg1: [
      coilOut,
      [coilOut[0], DC.wallRouteY, coilOut[2]],
      [coilOut[0], DC.wallRouteY, wallZ],
      [DC.riserWarm, DC.wallRouteY, wallZ],
      riserFoot,
    ] as V3[],
    riserFoot,
    leg2: [
      riserFoot,
      [DC.riserWarm, header, DC.riserZ],
      [inlet[0], header, DC.riserZ],
      [inlet[0], inlet[1], DC.riserZ],
      inlet,
    ] as V3[],
    /** The branch to tower B (draws with leg 2). */
    branch: (() => {
      const inB = towerWorld(DC.towerB, TOWER_INLET);
      return [
        [DC.riserWarm, header, DC.riserZ],
        [inB[0] - 0.4, header, DC.riserZ],
        [inB[0] - 0.4, inB[1], DC.riserZ],
        [inB[0], inB[1], DC.riserZ],
        inB,
      ] as V3[];
    })(),
    inlet,
    wallZ,
    header,
  };
};

/**
 * The route as drawn (§ 5): the same legs lifted onto the near face of the pipes that carry it (toward the camera,
 * so the glow sits on the pipe instead of inside it), and inside the hall's back wall at z −3.38 (hidden in the wall
 * until the X-ray opens it; no pipe is drawn there).
 */
export const dcRouteGlow = () => {
  const r = dcRoute();
  const lift = (p: V3, k: number): V3 => [p[0] + SECTION_ANGLE[0] * k, p[1] + SECTION_ANGLE[1] * k, p[2] + SECTION_ANGLE[2] * k];
  const inWall = DC.zb + 0.12;
  const l = r.leg1;
  const leg1: V3[] = [lift(l[0], 0.13), lift(l[1], 0.13), [l[2][0], l[2][1], inWall], [l[3][0], l[3][1], inWall], lift(l[4], 0.15)];
  return {
    coilOut: lift(r.coilOut, 0.13),
    coilReturn: r.coilReturn.map((p) => lift(p, 0.13)),
    leg1,
    riserFoot: leg1[4],
    leg2: r.leg2.map((p) => lift(p, 0.15)),
    branch: r.branch.map((p) => lift(p, 0.13)),
    inlet: lift(r.inlet, 0.15),
  };
};

/** The route's roof leg rerouted to dry cooler A's inlet (lifted toward the camera like the glow): riser foot → header → over → down → in. */
const dcDryLeg = (leg2: V3[]): V3[] => {
  const lift = (p: V3, k: number): V3 => [p[0] + SECTION_ANGLE[0] * k, p[1] + SECTION_ANGLE[1] * k, p[2] + SECTION_ANGLE[2] * k];
  const inl = towerWorld(DC.towerA, DRY_INLET);
  const top = leg2[1];
  return [leg2[0], top, lift([inl[0] - 0.15, top[1] - SECTION_ANGLE[1] * 0.15, DC.riserZ], 0.15), lift([inl[0] - 0.15, inl[1], DC.riserZ], 0.15), lift(inl, 0.15)];
};

/** The cold leg (world): tower A's basin outlet → down the cold riser → along the cut header → the pumps → back to the coil's supply. */
export const dcColdLeg = (): V3[] => {
  const out = towerWorld(DC.towerA, TOWER_OUTLET);
  const h = DC.header;
  return [
    out,
    [out[0], out[1], DC.riserZ],
    [DC.riserCold, out[1], DC.riserZ],
    [DC.riserCold, h.y, DC.riserZ],
    [DC.riserCold, h.y, DC.zf],
    [h.x1, h.y, DC.zf],
    [h.x1, h.y, -2.3],
    [h.x1, 0.7, DC.riserZ],
    [-3.55, 0.7, DC.riserZ],
    [-3.55, 0.7, DC.coilZ + 0.12],
    [-3.55, DC.raised + 0.25, DC.coilZ + 0.12],
  ];
};

/** The whole loop for laps and the ring: warm legs, the rain inside tower A, the cold leg, up through the coil. */
const dcLoop = (): V3[] => {
  const r = dcRoute();
  const c = dcColdLeg();
  const t = DC.towerA;
  const rainTop: V3 = [t[0], t[1] + TOWER_DC.sprayY, t[2]];
  const rainBot: V3 = [t[0], t[1] + 0.3, t[2]];
  return [...r.leg1, ...r.leg2.slice(1), rainTop, rainBot, ...c, r.coilOut];
};

/** The service line (world): from the left edge along the front cut face through the meter pit, up into the plant room, to the roof's makeup inlet. */
export const dcServiceLine = (): V3[] => {
  const z = DC.zf + 0.03;
  const y = DC.serviceY;
  const mk = towerWorld(DC.towerA, TOWER_MAKEUP_IN);
  return [
    [DC.groundX0, y, z],
    [DC.serviceRiserX, y, z],
    [DC.serviceRiserX, -0.02, z],
    [DC.serviceRiserX, 0.25, DC.zf - 0.25],
    [DC.serviceRiserX, 0.25, -2.75],
    [DC.serviceRiserX, 2.95, -2.75],
    [DC.serviceRiserX, 2.95, DC.riserZ - 0.1],
    [DC.riserMakeup, 2.95, DC.riserZ - 0.1],
    [DC.riserMakeup, mk[1], DC.riserZ - 0.1],
    [mk[0], mk[1], DC.riserZ - 0.1],
    mk,
  ];
};

/** The drain path (world): the floor sink → the trench → down the slab's and the ground's cut face → the lateral → the right edge. */
export const dcDrain = (): V3[] => {
  const z = DC.zf + 0.03;
  return [
    [DC.sinkX, 0.02, DC.valve[2]],
    [DC.sinkX, -0.04, DC.valve[2] + 0.1],
    [DC.sinkX, -0.04, DC.zf - 0.05],
    [DC.sinkX, -0.06, z],
    [DC.sinkX, DC.lateralY[0], z],
    [DC.groundX1, DC.lateralY[1], z],
  ];
};

/** Transformer slots in the yard (front row first, right to left). */
const T_SLOTS: [number, number][] = [
  [-10.4, 0.6],
  [-13.0, 0.6],
  [-15.6, 0.6],
  [-11.0, -2.3],
  [-13.6, -2.3],
  [-16.2, -2.3],
];

// ---------------------------------------------------------------------------------------------------- key tracks

/** A key track at t (cubic between keys, held outside them); `dflt` when undefined. */
export const trackAt = (k: Track | undefined, t: number, dflt: number): number => {
  if (k === undefined) return dflt;
  if (typeof k === 'number') return k;
  if (!k.length) return dflt;
  const ks = [...k].sort((a, b) => a.at - b.at).map((x) => ({at: x.at, v: x.v ?? x.value ?? dflt}));
  if (t <= ks[0].at) return ks[0].v;
  for (let i = 0; i < ks.length - 1; i++)
    if (t < ks[i + 1].at) return ks[i].v + (ks[i + 1].v - ks[i].v) * ease(t, ks[i].at, ks[i + 1].at);
  return ks[ks.length - 1].v;
};

/** ∫ track · scale dt from 0 to t (fixed step; deterministic). */
const integrate = (k: Track | undefined, t: number, dflt: number, scale = 1) => {
  if (k === undefined || typeof k === 'number') return (k ?? dflt) * scale * t;
  const step = 1 / 30;
  let a = 0;
  for (let x = 0; x < t; x += step) a += trackAt(k, x + Math.min(step, t - x) / 2, dflt) * Math.min(step, t - x);
  return a * scale;
};

/** 0 → 1 from `from` over `ramp` s (0 before; 1 when `from` is in the past). */
const onFrom = (o: {from: number} | undefined, t: number, ramp = 0.5) => (o ? ease(t, o.from, o.from + ramp) : 0);

const FAN_RATE = {tower: 1.7, dry: 2.0, ai: 2.4, coil: 0.9};

/**
 * What the roof shows at t: each tower's and cooler's offset back off the roof (−z, 0 = in place) and drop (m above its
 * place), and the towers' share. On a swap (≈ 2 s) unit A's outgoing unit slides straight back off the roof and, once its
 * spot is clear, the incoming one lowers in and seats; then the same for unit B. Nothing crosses, and the roof always
 * holds one seated unit and the next arriving.
 */
const roofState = (p: Partial<DatacenterSliceSceneProps>, t: number) => {
  const start = p.roof ?? 'towers';
  const sw = p.roofSwap;
  // unit A's swap, then unit B's: each outgoing unit slides back; once its spot is well clear (0.5 s) the incoming one lowers in
  // (0.55 s) and is seated before the next outgoing unit moves
  const out = (i: number) => (sw ? ease(t, sw.at + i * 1.0, sw.at + i * 1.0 + 1.0) : 0);
  const inn = (i: number) => (sw ? ease(t, sw.at + 0.5 + i * 1.0, sw.at + 1.05 + i * 1.0) : 0);
  const SLIDE = 26;
  const DROP = 3.5;
  const towersFirst = start === 'towers';
  const swapped = !!sw && sw.to !== start;
  const leaving = (i: number) => (swapped ? out(i) : 0) * SLIDE;
  const arriving = (i: number) => (swapped && inn(i) > 0 ? 0 : SLIDE);
  const towerOff = [0, 1].map((i) => (towersFirst ? leaving(i) : arriving(i)));
  const dryOff = [0, 1].map((i) => (towersFirst ? arriving(i) : leaving(i)));
  const towerDrop = [0, 1].map((i) => (towersFirst || !swapped ? 0 : (1 - inn(i)) * DROP));
  const dryDrop = [0, 1].map((i) => (!towersFirst || !swapped ? 0 : (1 - inn(i)) * DROP));
  const present = (off: number, drop: number) => (1 - off / SLIDE) * (1 - drop / DROP);
  const towersK = (present(towerOff[0], towerDrop[0]) + present(towerOff[1], towerDrop[1])) / 2;
  return {
    towerOff,
    dryOff,
    towerDrop,
    dryDrop,
    towersK,
    /** Tower A / dry cooler A sitting in place (the route ends at its inlet). */
    towerAIn: towerOff[0] < 0.01 && towerDrop[0] < 0.01,
    dryAIn: dryOff[0] < 0.01 && dryDrop[0] < 0.01,
    towersShown: towerOff.some((o) => o < SLIDE - 0.01),
    dryShown: dryOff.some((o) => o < SLIDE - 0.01),
  };
};

/** The yard's transformers at t: each slot's kind and its drop (0 in place → 1 lifted away). */
const yardState = (p: Partial<DatacenterSliceSceneProps>, t: number) => {
  const keys = [...(p.transformers ?? [{at: -999, n: 6, kind: 'big' as TransformerKind}])].sort((a, b) => a.at - b.at);
  let cur: {n: number; kind: TransformerKind; at: number; every: number} = {n: 0, kind: 'big', at: -9999, every: 0.35};
  let prev = {n: 0, kind: 'big' as TransformerKind};
  for (const k of keys) {
    if (k.at <= t) {
      prev = {n: cur.n, kind: cur.kind};
      cur = {n: k.n, kind: k.kind ?? 'mid', at: k.at, every: k.every ?? 0.35};
    }
  }
  const slots: {kind: TransformerKind; lift: number}[] = [];
  for (let i = 0; i < T_SLOTS.length; i++) {
    const wasIn = i < prev.n;
    const isIn = i < cur.n;
    const kindChange = prev.kind !== cur.kind;
    if (isIn && (!wasIn || kindChange)) {
      // drops in: new units in order, after the old ones have left (kind change)
      const order = kindChange ? i : i - prev.n;
      const t0 = cur.at + (kindChange ? 0.5 : 0) + order * cur.every;
      slots.push({kind: cur.kind, lift: 1 - ease(t, t0, t0 + 0.6)});
    } else if (isIn) slots.push({kind: cur.kind, lift: 0});
    else if (wasIn) slots.push({kind: prev.kind, lift: ease(t, cur.at, cur.at + 0.5)});
    else slots.push({kind: cur.kind, lift: 1});
  }
  // an old unit leaving on a kind change, drawn as its own entry
  const leaving: {i: number; kind: TransformerKind; lift: number}[] = [];
  if (prev.kind !== cur.kind)
    for (let i = 0; i < prev.n; i++) leaving.push({i, kind: prev.kind, lift: ease(t, cur.at, cur.at + 0.5)});
  // a small settle as a unit lands
  const settle = (i: number) => {
    const n =
      cur.at +
      (prev.kind !== cur.kind ? 0.5 : 0) +
      Math.max(0, i - (prev.kind !== cur.kind ? 0 : prev.n)) * cur.every +
      0.6;
    const u = (t - n) / 0.25;
    return u > 0 && u < 1 ? 0.025 * Math.sin(u * Math.PI) : 0;
  };
  return {slots, leaving, settle};
};

/** The route's state at t: how much of each leg is drawn. */
const routeState = (p: Partial<DatacenterSliceSceneProps>, t: number) => {
  const r = p.route;
  if (!r) return {coil: 0, leg1: 0, leg2: 0};
  const to = r.to ?? 'towerInlet';
  const legs = to === 'coil' ? 0 : to === 'riserFoot' ? 1 : 2;
  const coil = ease(t, r.drawAt, r.drawAt + 0.4);
  const draw = (i: number) => {
    if (i >= legs) return 0;
    const last = i === legs - 1;
    if (last && r.extendAt !== undefined) return ease(t, r.extendAt, r.extendAt + (r.extendFor ?? 1.8));
    const s = r.drawAt + 0.4 + i * 1.8;
    return ease(t, s, s + 1.8);
  };
  return {coil, leg1: draw(0), leg2: draw(1)};
};

/** The hot-air arrows' path (world): out of the AI rack's back, rising as it runs down the hot aisle into the coil. */
const hotAirPath = (): V3[] => {
  const xMid = (DC.hotX[0] + DC.hotX[1]) / 2;
  return [
    [DC.hotX[0] + 0.05, 1.5, AI_RACK.z],
    [xMid, 2.1, AI_RACK.z - 0.4],
    [xMid, 2.75, 0.0],
    [xMid, 2.85, DC.coilZ + 0.6],
    [xMid, 2.6, DC.coilZ + 0.02],
  ];
};
/** The cooled air leaving the fan section in front of cold aisle B (world). */
const coolAirPath = (): V3[] => [
  [-0.9, 2.1, DC.coilZ + 0.05],
  [-0.9, 1.9, DC.coilZ + 1.0],
  [-0.8, 1.5, DC.coilZ + 2.0],
];

// ---------------------------------------------------------------------------------------------------- camera

const H: Record<DcFraming, Framing> = {
  wide: {look: [1.0, 8.6, 0], distance: 80},
  wideRight: {look: [-6.0, 8.6, 0], distance: 80},
  hall: {look: [-3.1, 2.1, 0.2], distance: 23},
  racks: {look: [-1.7, 1.45, 0.5], distance: 12},
  aiRack: {look: [-4.0, 1.5, 1.4], distance: 10},
  rackBack: {look: [-3.9, 1.6, 1.5], distance: 7.2},
  coil: {look: [-3.2, 1.9, -1.6], distance: 12},
  hallWall: {look: [-1.4, 2.6, -2.6], distance: 15},
  riser: {look: [1.5, 6.8, -2.5], distance: 25},
  roof: {look: [0.3, 12.6, -1.2], distance: 32},
  roofWide: {look: [0.3, 14.2, -0.9], distance: 44},
  tower: {look: [2.7, 11.8, -0.9], distance: 22},
  towerValve: {look: [3.6, 7.0, -1.4], distance: 48},
  fill: {look: [2.7, 11.7, -0.4], distance: 11.5},
  basin: {look: [2.6, 9.8, -0.2], distance: 10},
  basinClose: {look: [2.4, 9.7, 0.0], distance: 7},
  plant: {look: [4.0, 1.8, -0.6], distance: 21},
  plantUp: {look: [3.2, 6.8, -1.0], distance: 46},
  jars: {look: [4.7, 1.25, -2.85], distance: 4.6},
  pipe: {look: [2.95, 0.6, 2.35], distance: 6},
  pipeClean: {look: [5.05, 0.6, 2.35], distance: 6},
  dosing: {look: [3.3, 0.85, -2.5], distance: 6.5},
  valve: {look: [5.2, 1.55, -2.6], distance: 7},
  loop: {look: [5.2, 0.95, 1.9], distance: 6.5},
  lateral: {look: [6.6, -1.3, 2.4], distance: 13},
  lateralRight: {look: [10.2, -1.6, 2.4], distance: 13},
  meter: {look: [-7.9, -0.7, 2.1], distance: 7.5},
  serviceLine: {look: [-12.8, -0.9, 2.4], distance: 10},
  drycooler: {look: [2.7, 10.5, -0.9], distance: 12.5},
  yard: {look: [-12.8, 3.0, -0.6], distance: 28},
  yardWide: {look: [-11.8, 4.4, -0.6], distance: 38},
  elecMeter: {look: [-8.95, 1.4, -0.15], distance: 3.6},
  yardRoof: {look: [-5.4, 6.8, -0.5], distance: 56},
  THUMB: {look: [-2.6, 8.2, 0], distance: 66},
};

/** The 9:16 framings (fov 26° vertical: the frame is 0.26 × the distance wide, 0.46 × high). Tower over riser over hall. */
const V: Record<DcFraming, Framing> = {
  wide: {look: [-1.7, 7.6, -0.5], distance: 54},
  wideRight: {look: [-1.7, 7.6, -0.5], distance: 54},
  hall: {look: [-3.1, 2.0, 0.3], distance: 30},
  racks: {look: [-2.0, 2.2, 0.3], distance: 15},
  aiRack: {look: [-4.0, 1.6, 1.4], distance: 12},
  rackBack: {look: [-3.9, 1.6, 1.5], distance: 9},
  coil: {look: [-3.2, 1.9, -1.6], distance: 15},
  hallWall: {look: [-1.4, 2.6, -2.6], distance: 22},
  riser: {look: [1.5, 7.2, -2.5], distance: 30},
  roof: {look: [1.2, 13.0, -1.2], distance: 36},
  roofWide: {look: [0.6, 14.4, -0.9], distance: 50},
  tower: {look: [2.7, 12.0, -0.9], distance: 19},
  towerValve: {look: [3.9, 7.2, -1.4], distance: 38},
  fill: {look: [2.7, 11.7, -0.4], distance: 10.5},
  basin: {look: [2.6, 9.8, -0.2], distance: 9},
  basinClose: {look: [2.4, 9.7, 0.0], distance: 6.5},
  plant: {look: [4.0, 1.8, -0.6], distance: 26},
  plantUp: {look: [3.6, 6.8, -1.0], distance: 42},
  jars: {look: [4.7, 1.3, -2.85], distance: 4.8},
  pipe: {look: [2.95, 0.6, 2.35], distance: 8.5},
  pipeClean: {look: [5.05, 0.6, 2.35], distance: 8.5},
  dosing: {look: [3.3, 0.85, -2.5], distance: 7.5},
  valve: {look: [5.2, 1.55, -2.6], distance: 8.5},
  loop: {look: [5.2, 0.95, 1.9], distance: 7.5},
  lateral: {look: [6.4, -1.3, 2.4], distance: 15},
  lateralRight: {look: [9.8, -1.6, 2.4], distance: 15},
  meter: {look: [-7.9, -0.6, 2.1], distance: 7.5},
  serviceLine: {look: [-12.8, -0.9, 2.4], distance: 12},
  drycooler: {look: [2.7, 10.5, -0.9], distance: 18},
  yard: {look: [-12.6, 3.4, -0.6], distance: 34},
  yardWide: {look: [-12.0, 4.6, -0.6], distance: 46},
  elecMeter: {look: [-8.95, 1.4, -0.15], distance: 4.2},
  yardRoof: {look: [-4.6, 6.8, -0.5], distance: 62},
  THUMB: {look: [-0.8, 7.2, -0.5], distance: 50},
};

/** The framings for a frame format (named; horizontal = the wide frame's, vertical = the Shorts'). */
export const dcFramings = (format: Format | undefined): Record<DcFraming, Framing> => (format === 'horizontal' ? H : V);

const resolveFraming = (f: Framing | DcFraming, format: Format | undefined): Framing =>
  typeof f === 'string' ? (dcFramings(format)[f] ?? dcFramings(format).wide) : f;

const pushRate = (p: Partial<DatacenterSliceSceneProps>) => p.push ?? (formatOf(p) === 'horizontal' ? 0.002 : 0.003);

const dcCameraMove = (p: Partial<DatacenterSliceSceneProps>, durationInFrames: number, fps: number, frame?: number) => {
  const fmt = formatOf(p);
  const preset = resolveFraming(p.framing ?? 'wide', fmt);
  const k = pushRate(p);
  const secs = durationInFrames / fps;
  const pushed = (f: Framing, s: number): Framing => ({look: f.look, distance: f.distance * (1 - k * s)});
  if (p.cameraKeys && p.cameraKeys.length) {
    // keys glide from where the last scene ended (a continue) or the start framing; the push runs on top
    const base = p.cameraFrom ?? (p.camera ? resolveFraming(p.camera.from, fmt) : preset);
    const keys: CameraKey[] = p.cameraKeys.map((c) => {
      const f = 'framing' in c ? resolveFraming(c.framing, fmt) : {look: c.look, distance: c.distance};
      return {at: c.at, look: f.look, distance: f.distance, ease: c.ease, log: c.log};
    });
    const keyed = (s: number) => pushed(framingAtKeys(keys, base, s), s);
    // a key at ≤ 0 that differs from where the last scene ended: the Explainer asks for a glide; ease into the keys
    const g = p.cameraGlide && p.cameraFrom ? p.cameraGlide : 0;
    const from0 = p.cameraFrom;
    const at = (s: number): Framing => {
      const f = keyed(s);
      if (!g || !from0 || s >= g) return f;
      const k = ease(s, 0, g);
      return {look: from0.look.map((v, i) => v + (f.look[i] - v) * k) as V3, distance: from0.distance + (f.distance - from0.distance) * k};
    };
    const f = at(frame === undefined ? secs : frame / fps);
    return {from: f, to: f, pre: undefined, start: keyed(0)};
  }
  const pre =
    p.cameraGlide && p.cameraFrom
      ? {from: p.cameraFrom, hold: 0, move: Math.max(1, Math.round(p.cameraGlide * fps)), ease: 'cubic' as const}
      : undefined;
  const moveSecs = Math.max(0, durationInFrames - (pre ? pre.move : 0)) / fps;
  if (p.camera) {
    const from = resolveFraming(p.camera.from, fmt);
    const to = p.camera.to ? resolveFraming(p.camera.to, fmt) : pushed(from, moveSecs);
    return {from, to, pre, start: pre ? pre.from : from};
  }
  const c = pre ? undefined : p.cameraFrom;
  const same =
    c &&
    c.look.every((v, i) => Math.abs(v - preset.look[i]) < 0.5) &&
    Math.abs(c.distance - preset.distance) < preset.distance * 0.08;
  const from = c && same ? c : preset;
  return {from, to: pushed(from, moveSecs), pre, start: pre ? pre.from : from};
};

export const dcCameraStart = (p: Partial<DatacenterSliceSceneProps>, d: number, fps: number): Framing =>
  dcCameraMove({...p, cameraFrom: p.cameraKeys?.length ? p.cameraFrom : undefined, cameraGlide: undefined}, d, fps, 0)
    .start;
export const dcCameraEnd = (p: Partial<DatacenterSliceSceneProps>, d: number, fps: number): Framing =>
  dcCameraMove(p, d, fps).to;

const dcCameraAt = (
  p: Partial<DatacenterSliceSceneProps>,
  o: {frame: number; fps: number; durationInFrames: number},
) => {
  const {from, to, pre} = dcCameraMove(p, o.durationInFrames, o.fps, o.frame);
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

/** What a scene hands the next one on a `continue`: every turning thing's turns so far. */
export const dcCarry = (
  p: Partial<DatacenterSliceSceneProps>,
  durationInFrames: number,
  fps: number,
): Record<string, unknown> => {
  const s = durationInFrames / fps;
  const dry = (p.roof ?? 'towers') === 'dry';
  const fanD = dry ? 1 : 0.85;
  return {
    fanFrom: (p.fanFrom ?? 0) + integrate(p.fans, s, fanD, dry ? FAN_RATE.dry : FAN_RATE.tower),
    fanBFrom: (p.fanBFrom ?? 0) + integrate(p.fansB ?? p.fans, s, fanD, dry ? FAN_RATE.dry : FAN_RATE.tower),
    aiFanFrom: (p.aiFanFrom ?? 0) + integrate(p.aiFans, s, 0.5, FAN_RATE.ai),
    elecFrom: (p.elecFrom ?? 0) + integrate(p.elecMeter, s, 0.5, 1.2),
    waterFrom: (p.waterFrom ?? 0) + integrate(p.waterMeter, s, dry ? 0.05 : 0.4, 1.6),
  };
};

// ---------------------------------------------------------------------------------------------------- anchors

/**
 * A named point on screen (px) at a frame, for callouts: 'fins' (the coil face), 'stream' (the blowdown stream), 'valve'
 * (the blowdown valve), 'fill' (tower A's fill), 'basin' (its basin), 'hose' (the fill hose's coupling), 'pipe' (the cut
 * header's scale stretch), 'pipeClean' / 'corrosion' (its corroded stretch), 'minerals' (the basin's dots), 'controller',
 * 'jars', 'aiRack', 'racks', 'riser', 'tower', 'plume', 'drycooler', 'meter', 'elecMeter', 'yard', 'drain' (the lateral).
 */
export const dcAnchorOnScreen = (
  p: Partial<DatacenterSliceSceneProps>,
  anchor: string,
  o: {frame: number; fps: number; durationInFrames: number},
): [number, number] | undefined => {
  const cam = dcCameraAt(p, o);
  const at = (v: V3) => projectToFrame(cam, v);
  const tA = DC.towerA;
  const pts: Record<string, V3> = {
    fins: [(DC.hotX[0] + DC.hotX[1]) / 2, 2.2, DC.coilZ],
    stream: [DC.valve[0] + 0.17, 0.75, DC.valve[2]],
    valve: [DC.valve[0], DC.valve[1] + 0.2, DC.valve[2]],
    fill: [tA[0], tA[1] + (TOWER_DC.fillBot + TOWER_DC.fillTop) / 2, tA[2] + 0.6],
    basin: [tA[0], tA[1] + 0.4, tA[2] + 1.0],
    minerals: [tA[0] + 0.3, tA[1] + 0.25, tA[2] + 0.9],
    hose: [DC.fill[0], DC.fill[1], DC.fill[2] + 0.3],
    pipe: [(DC.scaleSpan[0] + DC.scaleSpan[1]) / 2, DC.header.y + DC.header.r, DC.zf],
    pipeClean: [(DC.corrosionSpan[0] + DC.corrosionSpan[1]) / 2, DC.header.y + DC.header.r, DC.zf],
    corrosion: [(DC.corrosionSpan[0] + DC.corrosionSpan[1]) / 2, DC.header.y + DC.header.r, DC.zf],
    controller: [DC.controller[0], DC.controller[1] + 0.3, DC.controller[2]],
    jars: [DC.bench.x, DC.bench.top + 0.3, DC.bench.z],
    aiRack: [AI_RACK.x, DC.raised + RACK.h, AI_RACK.z],
    racks: [DC.rowB, DC.raised + RACK.h, 0],
    riser: [DC.riserWarm, 6.2, DC.riserZ],
    tower: [tA[0], tA[1] + TOWER_DC.h + TOWER_DC.stackH, tA[2]],
    plume: [tA[0], tA[1] + TOWER_DC.h + 4, tA[2]],
    drycooler: [tA[0], tA[1] + DRY_DC.h + 0.4, tA[2]],
    meter: [DC.meter[0], DC.meter[1] + 0.35, DC.meter[2]],
    elecMeter: [DC.switchgear[0] + DC.switchgearW / 2 - 0.35, 1.45, DC.switchgear[2] + 0.55],
    yard: [-11.4, 2.6, 0.6],
    drain: [9.0, DC.lateralY[0], DC.zf],
  };
  return pts[anchor] ? at(pts[anchor]) : undefined;
};

// ---------------------------------------------------------------------------------------------------- set pieces

/** A box whose listed faces are cut faces (hatched), the rest `mat`; its cut faces' rectangles go to `rects` for the ink. */
const cutBox = (
  key: string,
  min: V3,
  max: V3,
  faces: string,
  mat: THREE.Material,
  mats: DcMats,
  rects: Rect[],
  o: {shadow?: boolean; top?: THREE.Material} = {},
) => {
  const has = (f: string) => faces.includes(f);
  const c = mats.cut;
  // three's box face order: +x, −x, +y, −y, +z, −z
  const m = [
    has('+x') ? c : mat,
    has('-x') ? c : mat,
    has('+y') ? c : (o.top ?? mat),
    has('-y') ? c : mat,
    has('+z') ? c : mat,
    has('-z') ? c : mat,
  ];
  if (has('+x'))
    rects.push([
      [max[0], min[1], min[2]],
      [max[0], max[1], max[2]],
    ]);
  if (has('+y'))
    rects.push([
      [min[0], max[1], min[2]],
      [max[0], max[1], max[2]],
    ]);
  if (has('+z'))
    rects.push([
      [min[0], min[1], max[2]],
      [max[0], max[1], max[2]],
    ]);
  return (
    <mesh
      key={key}
      material={m}
      position={[(min[0] + max[0]) / 2, (min[1] + max[1]) / 2, (min[2] + max[2]) / 2]}
      castShadow={o.shadow}
      receiveShadow
    >
      <boxGeometry args={[max[0] - min[0], max[1] - min[1], max[2] - min[2]]} />
    </mesh>
  );
};

/** The building's shell, slabs, walls, the ground and its pit (static). */
const Shell: React.FC<{mats: DcMats & {cavity: THREE.Material}; ink: number; xray: number}> = ({mats, ink, xray}) => {
  const rects: Rect[] = [];
  const {zf, zb, wallT: T, x0, x1} = DC;
  const parts: React.ReactNode[] = [];
  // ground: left of the pit, under and behind the pit, right of the pit (front and right faces cut)
  const gy = DC.groundY;
  const [p0, p1] = DC.pit;
  const pitZ = zf - 1.3;
  parts.push(
    cutBox('g1', [DC.groundX0, gy, DC.groundZ0], [p0, 0, zf], '+z', mats.earth, mats, rects, {top: mats.gravel}),
  );
  parts.push(cutBox('g2', [p0, gy, DC.groundZ0], [p1, -DC.pitDepth, zf], '+z', mats.earth, mats, rects));
  parts.push(
    cutBox('g2b', [p0, -DC.pitDepth, DC.groundZ0], [p1, 0, pitZ], '', mats.earth, mats, rects, {top: mats.gravel}),
  );
  parts.push(
    cutBox('g3', [p1, gy, DC.groundZ0], [DC.groundX1, 0, zf], '+z+x', mats.earth, mats, rects, {top: mats.grass}),
  );
  // the pit's concrete lining (inner faces) and its lid, cut in half by the section
  parts.push(
    <group key="pit">
      <mesh material={mats.concrete} position={[p0 + 0.06, -DC.pitDepth / 2, pitZ + 0.65]}>
        <boxGeometry args={[0.12, DC.pitDepth, 1.3]} />
      </mesh>
      <mesh material={mats.concrete} position={[p1 - 0.06, -DC.pitDepth / 2, pitZ + 0.65]}>
        <boxGeometry args={[0.12, DC.pitDepth, 1.3]} />
      </mesh>
      <mesh material={mats.concrete} position={[(p0 + p1) / 2, -DC.pitDepth + 0.06, pitZ + 0.65]}>
        <boxGeometry args={[p1 - p0, 0.12, 1.3]} />
      </mesh>
      <mesh material={mats.concrete} position={[(p0 + p1) / 2, -DC.pitDepth / 2, pitZ + 0.06]}>
        <boxGeometry args={[p1 - p0, DC.pitDepth, 0.12]} />
      </mesh>
    </group>,
  );
  // the lid stops where the building apron begins: the two overlapped by 0.5 m with flush top and front faces, and the
  // apron's quad diagonal z-fought through the dark lid at the meter framing (No. 013 flicker)
  const apronX0 = x0 - 0.6;
  parts.push(cutBox('lid', [p0 + 0.1, 0, pitZ + 0.3], [Math.min(p1 - 0.1, apronX0), 0.06, zf], '+z', mats.dark, mats, rects));
  rects.push([
    [p0, -DC.pitDepth, zf],
    [p1, 0, zf],
  ]);
  // building apron and floors
  parts.push(cutBox('apron', [apronX0, 0, zb - 0.2], [x1 + 0.6, 0.06, zf], '+z+x', mats.concrete, mats, rects));
  // hall raised floor (tiles on pedestals; its front cut shows the void)
  parts.push(
    cutBox('raised', [x0 + T, DC.raised - 0.05, zb + T], [DC.hallX1, DC.raised, zf], '+z', mats.tile, mats, rects),
  );
  for (let i = 0; i < 12; i++) {
    const x = x0 + 0.5 + i * 0.6;
    if (x > DC.hallX1 - 0.1) break;
    parts.push(
      <Rod key={`ped${i}`} a={[x, 0.06, zf - 0.2]} b={[x, DC.raised - 0.05, zf - 0.2]} r={0.025} mat={mats.galv} />,
    );
  }
  parts.push(cutBox('plantfloor', [DC.plantX0, 0.06, zb + T], [x1, 0.09, zf], '+z+x', mats.plantFloor, mats, rects));
  // the slab between the floors and the roof slab, cut further back (DC.zu: the stepped section)
  const zu = DC.zu;
  parts.push(cutBox('slab1', [x0, DC.floorH, zb], [x1, DC.upperY, zu], '+z+x', mats.concrete, mats, rects, {top: mats.floor}));
  parts.push(cutBox('slab2', [x0, DC.roofSlabY, zb], [x1, DC.roofY, zu], '+z+x', mats.concrete, mats, rects, {top: mats.roof}));
  // walls: back (its right end cut) and left (its front end cut; on the ground floor, its top too where no slab is over it)
  const xr0 = -3.85;
  const xr1 = 1.15;
  const yTop = 3.3;
  const yBot = 2.8;
  if (xray > 0.001) {
    // the hall's back wall with the X-ray's opening (§ 5): left, right, under, over; the face opens top-down
    const open = yTop - (yTop - yBot) * xray;
    parts.push(cutBox('bwL', [x0, 0.06, zb], [xr0, DC.floorH, zb + T], '', mats.wall, mats, rects, {shadow: true}));
    parts.push(cutBox('bwR', [xr1, 0.06, zb], [x1, DC.floorH, zb + T], '+x', mats.wall, mats, rects, {shadow: true}));
    parts.push(cutBox('bwU', [xr0, 0.06, zb], [xr1, yBot, zb + T], '', mats.wall, mats, rects, {shadow: true}));
    parts.push(cutBox('bwO', [xr0, yTop, zb], [xr1, DC.floorH, zb + T], '', mats.wall, mats, rects));
    if (open > yBot + 0.001) parts.push(cutBox('bwF', [xr0, yBot, zb + T - 0.05], [xr1, open, zb + T], '', mats.wall, mats, rects));
    parts.push(
      <mesh key="cavity" material={mats.cavity} position={[(xr0 + xr1) / 2, (yBot + yTop) / 2, zb + 0.03]}>
        <boxGeometry args={[xr1 - xr0, yTop - yBot, 0.06]} />
      </mesh>,
    );
    // the reveal's hatched band (cut faces round the opening) with ink on both its edges
    const b = 0.055;
    const fz = zb + T + 0.002;
    const band = (bk: string, a: V3, c: V3) => (
      <mesh key={bk} material={mats.cut} position={[(a[0] + c[0]) / 2, (a[1] + c[1]) / 2, fz]}>
        <boxGeometry args={[Math.abs(c[0] - a[0]), Math.abs(c[1] - a[1]), 0.004]} />
      </mesh>
    );
    parts.push(band('xb1', [xr0 - b, yBot - b, 0], [xr1 + b, yBot, 0]));
    parts.push(band('xb2', [xr0 - b, open, 0], [xr1 + b, Math.min(yTop + b, open + b), 0]));
    parts.push(band('xb3', [xr0 - b, yBot, 0], [xr0, open, 0]));
    parts.push(band('xb4', [xr1, yBot, 0], [xr1 + b, open, 0]));
    rects.push([[xr0 - b, yBot - b, fz], [xr1 + b, open + b, fz]]);
    rects.push([[xr0, yBot, fz], [xr1, open, fz]]);
  } else parts.push(cutBox('bw', [x0, 0.06, zb], [x1, DC.floorH, zb + T], '+x', mats.wall, mats, rects, {shadow: true}));
  parts.push(cutBox('bwb', [x0, DC.upperY, zb], [x1, DC.roofSlabY, zb + T], '+x', mats.wall, mats, rects, {shadow: true}));
  parts.push(cutBox('lwa', [x0, 0.06, zb + T], [x0 + T, DC.floorH, zu], '', mats.wall, mats, rects, {shadow: true}));
  parts.push(cutBox('lwa2', [x0, 0.06, zu], [x0 + T, DC.floorH, zf], '+y+z', mats.wall, mats, rects, {shadow: true}));
  parts.push(cutBox('lwb', [x0, DC.upperY, zb + T], [x0 + T, DC.roofSlabY, zu], '+z', mats.wall, mats, rects, {shadow: true}));
  // the partition between the hall and the plant room
  parts.push(cutBox('part', [DC.hallX1, 0.06, zb + T], [DC.plantX0, DC.floorH, zu - 0.2], '', mats.wall, mats, rects, {shadow: true}));
  // its front part is cut low (2.4 m), so the camera sees over it into the hall's back wall from the plant-room side
  parts.push(cutBox('part2', [DC.hallX1, 0.06, zu], [DC.plantX0, 2.4, zf], '+y+z', mats.wall, mats, rects, {shadow: true}));
  parts.push(cutBox('part3', [DC.hallX1, 2.4, zu - 0.2], [DC.plantX0, DC.floorH, zu], '+y+z', mats.wall, mats, rects));
  // the roof's parapet (back and left)
  parts.push(cutBox('parB', [x0, DC.roofY, zb], [x1, DC.roofY + DC.parapet, zb + 0.25], '+y+z+x', mats.concrete, mats, rects));
  parts.push(cutBox('parL', [x0, DC.roofY, zb + 0.25], [x0 + 0.25, DC.roofY + DC.parapet, zu], '+y+z', mats.concrete, mats, rects));
  return (
    <group>
      {parts}
      <CutOutline rects={rects} thickness={ink} />
    </group>
  );
};

/** Hall furniture: the two rack rows, the coil wall, the hot aisle's end frame. */
const Hall: React.FC<{
  mats: DcMats;
  clock: number;
  aiFanTurns: number;
  pull: number;
  ink: number;
}> = ({mats, clock, aiFanTurns, pull, ink}) => {
  const y = DC.raised;
  return (
    <group>
      {[...Array(DC.racks).keys()].map((i) => {
        const z = rackZ(i);
        const ai = i === DC.racks - 1;
        return (
          <group key={i}>
            {/* row A: front −x, back (fans) +x into the hot aisle */}
            <group position={[DC.rowA, y, z]} rotation={[0, -Math.PI / 2, 0]}>
              <ServerRack
                variant={ai ? 'ai' : 'standard'}
                seed={`dc-a-${i}`}
                clock={clock}
                fanTurns={ai ? aiFanTurns : clock * 1.4}
                cut={ai ? 'right' : undefined}
                ink={ink}
              />
            </group>
            {/* row B: front +x toward cold aisle B, back −x into the hot aisle */}
            <group position={[DC.rowB, y, z]} rotation={[0, Math.PI / 2, 0]}>
              <ServerRack
                seed={`dc-b-${i}`}
                clock={clock}
                fanTurns={clock * 1.4}
                pull={i === PULL.rack ? {unit: PULL.unit, amount: pull} : undefined}
                ink={ink}
              />
            </group>
          </group>
        );
      })}
      {/* the hot aisle's containment: end door frames at the front, a header over it */}
      {[DC.hotX[0] + 0.03, DC.hotX[1] - 0.03].map((x, i) => (
        <mesh key={i} material={mats.dark} position={[x, y + 1.2, rackZ(DC.racks - 1) + RACK.w / 2 - 0.02]}>
          <boxGeometry args={[0.04, 2.4, 0.04]} />
        </mesh>
      ))}
      <mesh
        material={mats.dark}
        position={[(DC.hotX[0] + DC.hotX[1]) / 2, y + 2.4, rackZ(DC.racks - 1) + RACK.w / 2 - 0.02]}
      >
        <boxGeometry args={[DC.hotX[1] - DC.hotX[0], 0.05, 0.04]} />
      </mesh>
      {/* cable trays over the rows */}
      {[DC.rowA, DC.rowB].map((x, i) => (
        <mesh key={`tray${i}`} material={mats.galv} position={[x, y + RACK.h + 0.45, (DC.rackZ0 + 2.0) / 2]}>
          <boxGeometry args={[0.5, 0.08, 3.8]} />
        </mesh>
      ))}
      {/* the coil wall */}
      <group position={[0, y, DC.coilZ]}>
        <CoilWall
          mats={mats}
          x0={DC.x0 + DC.wallT + 0.05}
          x1={DC.hallX1 - 0.05}
          h={DC.coilH}
          hotX0={DC.hotX[0]}
          hotX1={DC.hotX[1]}
          fanTurns={clock * FAN_RATE.coil}
        />
      </group>
    </group>
  );
};

/** The upper floor's dressing (neutral): UPS cabinets, battery racks, an air handler, a cable tray. */
const Upper: React.FC<{mats: DcMats}> = ({mats}) => {
  const y = DC.upperY;
  return (
    <group>
      {[...Array(6).keys()].map((i) => (
        <mesh
          key={i}
          geometry={roundedBox(0.85, 2.0, 0.8, 0.02)}
          material={i % 3 === 2 ? mats.cabinetDark : mats.cabinet}
          position={[-6.3 + i * 0.9, y + 1.0, -2.85]}
          castShadow
          receiveShadow
        />
      ))}
      {[...Array(3).keys()].map((i) => (
        <group key={`b${i}`} position={[-5.8 + i * 1.6, y, -0.6]}>
          {[0, 1, 2, 3].map((k) => (
            <mesh key={k} material={mats.dark} position={[0, 0.2 + k * 0.42, 0]} castShadow>
              <boxGeometry args={[1.2, 0.3, 0.6]} />
            </mesh>
          ))}
          {[-1, 1].map((s) => (
            <Rod key={s} a={[s * 0.62, 0, 0]} b={[s * 0.62, 1.7, 0]} r={0.025} mat={mats.galv} />
          ))}
        </group>
      ))}
      <mesh
        geometry={roundedBox(2.6, 1.7, 1.5, 0.04)}
        material={mats.cabinet}
        position={[4.6, y + 0.85, -2.4]}
        castShadow
        receiveShadow
      />
      <mesh material={mats.galv} position={[4.6, y + 2.3, -2.9]}>
        <boxGeometry args={[1.2, 0.6, 0.6]} />
      </mesh>
      <mesh material={mats.galv} position={[-2.5, y + 2.9, -1.0]}>
        <boxGeometry args={[8.0, 0.08, 0.5]} />
      </mesh>
    </group>
  );
};

// ---------------------------------------------------------------------------------------------------- the scene

/**
 * N1, the data centre cut open: hall, plant room, riser, roof with cooling towers or dry coolers, yard, cut ground (see
 * the file comment). Every beat is a key in seconds into the scene.
 */
export const DatacenterSliceScene: React.FC<DatacenterSliceSceneProps> = (propsIn) => {
  const props = useFormatProps(propsIn);
  const {durationInFrames, mood = 'day', startFrame = 0} = props;
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const m = MOODS[mood];
  const sky = useMemo(() => new THREE.MeshBasicMaterial({map: skyTexture(mood), fog: false}), [mood]);
  sky.color.setScalar(1 / m.exposure);
  const skyBack = useMemo(() => new THREE.MeshBasicMaterial({color: raw(m.sky[2]).multiplyScalar(1 / m.exposure), fog: false}), [m]);
  const {from, to, pre} = dcCameraMove(props, durationInFrames, fps, frame);
  const cam = dcCameraAt(props, {frame, fps, durationInFrames});
  const camD = cam.position.distanceTo(cam.look);
  return (
    <AbsoluteFill>
      <SectionStage mood={mood} post={{focusY: 0.5}} ao far={400}>
        {props.reveal ? (
          <RevealCamera p={props} rv={props.reveal} />
        ) : (
          <SectionCamera
            from={from}
            to={to}
            pre={pre}
            durationInFrames={durationInFrames}
            drift={props.drift ?? 0.08}
            clockOffset={startFrame / fps}
            fitClip
            farMin={300}
          />
        )}
        <SectionLights
          mood={mood}
          target={[-1.5, 5, 0]}
          lamp={0}
          extent={17}
          figureSpot={false}
          keyYaw={trackAt(props.keyYaw, t, 0)}
        />
        {/* the sky behind the sheet, sized so the frame spans most of the gradient (the plume reads white on blue), on a
            backing in the gradient's horizon colour so no framing ever sees past it */}
        <mesh position={[-2, -12, -60]} material={sky}>
          <planeGeometry args={[320, 52]} />
        </mesh>
        <mesh position={[0, 0, -62]} material={skyBack}>
          <planeGeometry args={[600, 400]} />
        </mesh>
        <DcSet p={props} camD={camD} />
      </SectionStage>
    </AbsoluteFill>
  );
};

type CamState = {position: THREE.Vector3; look: THREE.Vector3; fov: number};

const fromAngles = (look: V3, distance: number, yaw: number, pitch: number) =>
  new THREE.Vector3(
    look[0] + Math.sin(yaw) * Math.cos(pitch) * distance,
    look[1] + Math.sin(pitch) * distance,
    look[2] + Math.cos(yaw) * Math.cos(pitch) * distance,
  );

/**
 * The reveal's camera at a scene frame (§ 11.6.1): the track over the footage; from `release` a cubic Hermite glide that
 * leaves the track with its own velocity and lands (zero velocity) on the scene's own camera at `land`, the lens
 * dolly-zooming to the house lens while `distance × tan(fov / 2)` (the building's screen size) eases between the two.
 */
export const revealCameraAt = (p: Partial<DatacenterSliceSceneProps>, rv: Reveal, frame: number, fps: number, durationInFrames: number): CamState => {
  const vf = (p.startFrame ?? 0) + frame;
  const houseFov = sectionFov(formatOf(p));
  if (vf >= rv.land) {
    const c = dcCameraAt(p, {frame, fps, durationInFrames});
    return {position: c.position, look: c.look, fov: houseFov};
  }
  const {key, vel} = revealTrackAt(rv, Math.min(vf, rv.release));
  if (vf <= rv.release) return {position: fromAngles(key.look, key.distance, key.yaw, key.pitch), look: new THREE.Vector3(...key.look), fov: key.fov};
  const L = dcCameraAt(p, {frame: rv.land - (p.startFrame ?? 0), fps, durationInFrames});
  const d1 = L.position.distanceTo(L.look);
  const dir = L.position.clone().sub(L.look).normalize();
  const yaw1 = Math.atan2(dir.x, dir.z);
  const pitch1 = Math.asin(dir.y);
  const T = rv.land - rv.release;
  const u = (vf - rv.release) / T;
  const herm = (p0: number, m0: number, p1: number) => {
    const u2 = u * u;
    const u3 = u2 * u;
    return (2 * u3 - 3 * u2 + 1) * p0 + (u3 - 2 * u2 + u) * m0 * T + (-2 * u3 + 3 * u2) * p1;
  };
  const tan = (f: number) => Math.tan(((f / 2) * Math.PI) / 180);
  const W0 = key.distance * tan(key.fov);
  const W1 = d1 * tan(houseFov);
  const look: V3 = [0, 1, 2].map((i) => herm(key.look[i], vel.look[i], [L.look.x, L.look.y, L.look.z][i])) as V3;
  const yaw = herm(key.yaw, vel.yaw, yaw1);
  const pitch = herm(key.pitch, vel.pitch, pitch1);
  const fov = herm(key.fov, vel.fov, houseFov);
  const W = herm(W0, vel.distance * tan(key.fov), W1);
  const distance = W / tan(fov);
  return {position: fromAngles(look, distance, yaw, pitch), look: new THREE.Vector3(...look), fov};
};

/** The canvas camera for a scene with a reveal (it sets the lens too; at and after `land`, the house lens). */
const RevealCamera: React.FC<{p: DatacenterSliceSceneProps; rv: Reveal}> = ({p, rv}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const camera = useThree((st) => st.camera) as THREE.PerspectiveCamera;
  const c = revealCameraAt(p, rv, frame, fps, p.durationInFrames);
  camera.position.copy(c.position);
  camera.lookAt(c.look);
  camera.fov = c.fov;
  const d = c.position.distanceTo(c.look);
  camera.near = Math.max(0.1, d * 0.15);
  camera.far = Math.max(d * 2 + 200, 300);
  camera.updateProjectionMatrix();
  return null;
};

/** Everything inside the canvas (the realistic materials need the canvas's studio light). */
export const DcSet: React.FC<{p: DatacenterSliceSceneProps; camD: number}> = ({p: props, camD}) => {
  const {mood = 'day', startFrame = 0} = props;
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const clock = startFrame / fps + t;
  const m = MOODS[mood];
  const mats = useDcMats(mood);
  const cavity = useMemo(() => new THREE.MeshStandardMaterial({color: raw(m.cavity), roughness: 1}), [m.cavity]);
  const shellMats = useMemo(() => ({...mats, cavity}), [mats, cavity]);
  const ink = INK * Math.max(0.2, Math.min(5, camD / 12.75)) * (props.inkScale ?? 1);
  const coreR = 0.0225 * Math.max(0.6, Math.min(4, camD / 18)) * (props.routeScale ?? 1);
  const nodeR = coreR * NODE_SCALE;

  // ---- the roof
  const dry0 = (props.roof ?? 'towers') === 'dry';
  const roof = roofState(props, t);
  const fanDefault = dry0 ? 1 : 0.85;
  const fanLevel = trackAt(props.fans, t, fanDefault);
  const fanLevelB = trackAt(props.fansB ?? props.fans, t, fanDefault);
  const fanTurns = (props.fanFrom ?? 0) + integrate(props.fans, t, fanDefault, dry0 ? FAN_RATE.dry : FAN_RATE.tower);
  const fanTurnsB =
    (props.fanBFrom ?? 0) +
    integrate(props.fansB ?? props.fans, t, fanDefault, dry0 ? FAN_RATE.dry : FAN_RATE.tower) +
    0.37;
  const cutK = (at: number | undefined) => (at === undefined ? 0 : ease(t, at, at + 0.6));
  const towerCut = cutK(props.towerCut);
  const dryCut = cutK(props.dryCut);
  const rainK = props.rain === false ? 0 : props.rain ? ease(t, props.rain.from, props.rain.from + 0.5) : 1;
  // before the fade the water is orange all the way down (the tower's `uniform`); after it, warm at the nozzles only
  const rainUniform = props.rainFade ? 1 - ease(t, props.rainFade.at, props.rainFade.at + 1.5) : 0;
  const vaporK = props.vapor ? ease(t, props.vapor.from, props.vapor.from + 0.6) : 0;
  const makeup = Math.max(0, trackAt(props.makeup, t, 0));
  const level = trackAt(props.level, t, 0.55 + 0.15 * makeup);
  const ripple = props.basinRipple ? Math.max(0, 1 - Math.abs(t - props.basinRipple.at - 0.6) / 0.8) : 0;
  const minerals = Math.max(0, trackAt(props.minerals, t, 0));
  const mineralFall = props.mineralFall ? ease(t, props.mineralFall.from, props.mineralFall.from + 0.6) : 0;
  const biofilm = Math.max(0, trackAt(props.biofilm, t, 0));
  const plumeTrack = props.plume;
  const plumeBase = trackAt(plumeTrack, t, dry0 ? 0 : 1) * roof.towersK;
  const pulse = props.plumePulse ? ease(t, props.plumePulse.from, props.plumePulse.from + 0.6) : 0;
  const tokens = Math.max(
    props.tokensAt !== undefined ? ease(t, props.tokensAt, props.tokensAt + 0.6) : 0,
    props.vapor && props.vapor.tokens !== false ? vaporK : 0,
  );
  const warmAir = onFrom(props.warmAir, t, 0.6);

  // ---- the hall
  const heatRacks = Math.max(0, trackAt(props.heat?.racks, t, 0));
  const heatAi = Math.max(0, trackAt(props.heat?.ai, t, 0));
  const haze = Math.max(0, Math.min(1.2, trackAt(props.haze, t, 0)));
  const aiFanTurns = (props.aiFanFrom ?? 0) + integrate(props.aiFans, t, 0.5, FAN_RATE.ai);
  const tech = props.technician === null ? null : (props.technician ?? {});
  const pullAt = tech?.pullAt;
  const pull = pullAt === undefined ? 0 : ease(t, pullAt, pullAt + 0.8) * (1 - ease(t, pullAt + 2.2, pullAt + 3.0));

  // ---- the route and the loop
  const R = dcRoute();
  const G = dcRouteGlow();
  const rs = routeState(props, t);
  const cold = dcColdLeg();
  const service = dcServiceLine();
  const loop = dcLoop();
  const loopLen = polylineLength(loop);
  const coldOn = Math.max(
    onFrom(props.coilFlow, t),
    onFrom(props.returnFlow, t),
    onFrom(props.loopFlow, t),
    props.lap && t >= props.lap.at ? 1 : 0,
    props.ring && t >= props.ring.at ? 1 : 0,
  );
  const BASE = 1.6; // m/s of mark travel at the base pace
  const lap = props.lap;
  const lapEvery = lap?.every ?? 3.0;
  const lapEnd = lap ? lap.at + (lap.laps ?? 1) * lapEvery : 0;
  const lapActive = lap ? t >= lap.at && t < lapEnd : false;
  const fastSpeed = loopLen / lapEvery;
  // seconds of this scene spent in the fast laps (the marks' travel is integrated, so nothing jumps when they start)
  const overlap = lap ? Math.max(0, Math.min(t, lapEnd) - Math.max(0, lap.at)) : 0;
  const flowDist = (startFrame / fps) * BASE + BASE * (t - Math.max(0, overlap)) + fastSpeed * Math.max(0, overlap);
  // the ring
  const ring = props.ring;
  let ringU: number | null = null;
  let ringTicks = 0;
  if (ring && t >= ring.at) {
    const every = ring.every ?? 1.2;
    const laps = ring.laps ?? 3;
    const base = 6.0;
    const f0 = ring.from ?? Infinity;
    const f1 = f0 + laps * every;
    const slow = Math.max(0, Math.min(t, f0) - ring.at) + Math.max(0, t - f1);
    const fast = Math.max(0, Math.min(t, f1) - Math.max(f0, ring.at));
    ringU = (slow / base + fast / every) % 1;
    if (ring.ticks && ring.from !== undefined)
      ringTicks = Math.min(laps, Math.max(0, Math.floor((t - f0) / every + 1e-6)));
  }
  const xr = props.xray;
  const xray = xr
    ? ease(t, xr.at, xr.at + 0.45) * (xr.closeAt === undefined ? 1 : 1 - ease(t, xr.closeAt, xr.closeAt + 0.45))
    : 0;

  // ---- the plant room
  const scale = Math.max(0, trackAt(props.pipeCut?.scale, t, 0));
  const corrosion = Math.max(0, trackAt(props.pipeCut?.corrosion, t, 0));
  const jarMult = props.jars ? 1 + ((props.jars.multiply ?? 4) - 1) * ease(t, props.jars.at, props.jars.at + 1.5) : 1;
  const jarNeedle = props.jars
    ? 1 +
      ((props.jars.multiply ?? 4) - 1) *
        ease(t, props.jars.probeAt ?? props.jars.at + 0.8, (props.jars.probeAt ?? props.jars.at + 0.8) + 0.7)
    : 1;
  const needle = trackAt(props.controller?.needle, t, 2.5) + 0.04 * Math.sin(clock * 2.1);
  const setPoint = trackAt(props.controller?.setPoint, t, 4);
  const dosingOn = props.dosing
    ? ease(t, props.dosing.from, props.dosing.from + 0.3) *
      (props.dosing.until === undefined ? 1 : 1 - ease(t, props.dosing.until, props.dosing.until + 0.3))
    : 0;
  const strokes = clock / 0.5;
  const blowdown = Math.max(0, Math.min(1, trackAt(props.blowdown, t, 0)));
  const drawAt = props.drain?.drawAt;
  const drainDraw = drawAt === undefined ? 0 : ease(t, drawAt, drawAt + 2.4);
  const drainPts = dcDrain();
  const fh = props.fillHose;
  const hoseK = fh
    ? ease(t, fh.connectAt, fh.connectAt + 0.6) *
      (fh.capAt === undefined ? 1 : 1 - ease(t, fh.capAt - 1.0, fh.capAt - 0.5))
    : 0;
  const capK = fh?.capAt !== undefined ? ease(t, fh.capAt, fh.capAt + 0.4) : 0;
  const gauge = fh ? 0.15 + 0.85 * ease(t, fh.connectAt + 0.5, fh.fullAt ?? fh.connectAt + 2.5) : 1;

  // ---- outside
  const yard = yardState(props, t);
  const elecTurns = (props.elecFrom ?? 0) + integrate(props.elecMeter, t, 0.5, 1.2);
  const tFanTurns = clock * 0.5 + elecTurns * 1.25;
  const waterDefault = dry0 ? 0.05 : 0.4;
  const waterTurns = (props.waterFrom ?? 0) + integrate(props.waterMeter, t, waterDefault, 1.6);
  const waterLevel = trackAt(props.waterMeter, t, waterDefault);
  const serviceOn = props.serviceFlow ? onFrom(props.serviceFlow, t) : Math.min(1, waterLevel * 4);
  const serviceDist = (startFrame / fps) * 0.9 + waterTurns * 1.4;
  const double = props.lineDoubleAt === undefined ? 0 : ease(t, props.lineDoubleAt, props.lineDoubleAt + 1.0);
  const glints =
    props.lineGlintAt === undefined ? [] : Array.isArray(props.lineGlintAt) ? props.lineGlintAt : [props.lineGlintAt];
  const glint = glints.reduce((g, a) => Math.max(g, ease(t, a, a + 0.15) * (1 - ease(t, a + 0.3, a + 0.9))), 0);

  // ---- hot air
  const hotPts = hotAirPath();
  const coolPts = coolAirPath();
  const hotArrows: React.ReactNode[] = [];
  if (props.hotAir) {
    const every = Math.max(0.2, props.hotAir.every ?? 0.6);
    const TRAVEL = 2.6;
    const COOL = 1.4;
    const n0 = Math.floor((t - props.hotAir.from) / every);
    for (let n = Math.max(0, n0 - 7); n <= n0; n++) {
      const born = props.hotAir.from + n * every;
      if (props.hotAir.until !== undefined && born > props.hotAir.until) continue;
      const age = t - born;
      if (age < 0) continue;
      if (age < TRAVEL) {
        const u = age / TRAVEL;
        const fade = Math.min(1, u / 0.08) * (1 - Math.max(0, (u - 0.92) / 0.08));
        hotArrows.push(
          <CurveArrow
            key={`h${n}`}
            points={hotPts}
            from={Math.max(0, u - 0.16)}
            to={u}
            radius={0.035}
            opacity={fade}
          />,
        );
      } else if (props.hotAir.coolThrough && age < TRAVEL + COOL) {
        const u = (age - TRAVEL) / COOL;
        const fade = Math.min(1, u / 0.15) * (1 - Math.max(0, (u - 0.85) / 0.15));
        hotArrows.push(
          <CurveArrow
            key={`c${n}`}
            points={coolPts}
            from={Math.max(0, u - 0.4)}
            to={u}
            kind="ink"
            radius={0.03}
            opacity={fade}
            mood={mood}
          />,
        );
      }
    }
  }

  // ---- the drain's pulses
  const drainPulses: V3[] = [];
  if (drainDraw >= 1 && drawAt !== undefined) {
    const every = props.drain?.pulseEvery ?? (blowdown > 0.02 ? 1.4 : 0);
    if (every > 0) {
      const from = props.drain?.pulseFrom ?? drawAt + 2.4;
      const TRAVEL = 2.2;
      const n0 = Math.floor((t - from) / every);
      for (let n = Math.max(0, n0 - 3); n <= n0; n++) {
        const age = t - (from + n * every);
        if (age >= 0 && age < TRAVEL) drainPulses.push(pointAlong(drainPts, age / TRAVEL));
      }
    }
  }

  // ---- the split (the water budget)
  const split = props.split;
  const splitArrows: React.ReactNode[] = [];
  if (split) {
    for (let i = 0; i < 4; i++) {
      const a = ease(t, split.inAt + i * 0.15, split.inAt + i * 0.15 + 0.5);
      splitArrows.push(
        <PushArrow
          key={`si${i}`}
          kind="neutral"
          mood={mood}
          position={[DC.meter[0] + 0.9, -0.25 - i * 0.42, DC.zf + 0.08]}
          direction={[1, 0, 0]}
          normal={[0, 0, 1]}
          length={1.4 * a}
          radius={0.07}
          node={false}
          glow={a}
        />,
      );
    }
    if (split.vaporAt !== undefined)
      [DC.towerB[0], (DC.towerA[0] + DC.towerB[0]) / 2, DC.towerA[0]].forEach((x, i) => {
        const a = ease(t, split.vaporAt! + i * 0.25, split.vaporAt! + i * 0.25 + 0.6);
        splitArrows.push(
          <PushArrow
            key={`sv${i}`}
            position={[x, DC.towerA[1] + TOWER_DC.h + TOWER_DC.stackH + 1.2 + (i === 1 ? 0.8 : 0), DC.towerA[2] + 1.5]}
            direction={[0, 1, 0]}
            normal={SECTION_ANGLE}
            length={2.2 * a}
            radius={0.11}
            node={false}
            glow={a}
          />,
        );
      });
    if (split.drainAt !== undefined) {
      const a = ease(t, split.drainAt, split.drainAt + 0.6);
      splitArrows.push(
        <PushArrow
          key="sd"
          position={[8.4, DC.lateralY[0] + 0.45, DC.zf + 0.1]}
          direction={[1, 0, 0]}
          normal={[0, 0, 1]}
          length={1.6 * a}
          radius={0.09}
          node={false}
          glow={a}
        />,
      );
    }
  }

  // ---- technician
  const techPos: V3 = [-0.75, DC.raised, rackZ(PULL.rack)];
  let techAt: V3 = techPos;
  let techRot = -Math.PI / 2;
  let walk = {phase: 0, amount: 0};
  if (tech?.walkAt !== undefined) {
    const start: V3 = [-0.6, DC.raised, DC.zf - 0.4];
    const dist = Math.hypot(techPos[0] - start[0], techPos[2] - start[2]);
    const dur = dist / 1.0;
    const u = ease(t, tech.walkAt, tech.walkAt + dur);
    techAt = [start[0] + (techPos[0] - start[0]) * u, DC.raised, start[2] + (techPos[2] - start[2]) * u];
    const moving = t > tech.walkAt && t < tech.walkAt + dur;
    const turn = ease(t, tech.walkAt + dur - 0.4, tech.walkAt + dur + 0.3);
    techRot = Math.PI + (-Math.PI / 2 - Math.PI) * turn;
    walk = {
      phase: (u * dist) / 1.3,
      amount: moving ? Math.min(1, Math.sin(Math.PI * Math.min(1, Math.max(0, (t - tech.walkAt) / dur))) * 2) : 0,
    };
  }
  const handleY = DC.raised + 0.1 + PULL.unit * 0.19 + 0.088 - techAt[1];
  const reach = pullAt === undefined ? 0 : ease(t, pullAt - 0.4, pullAt) * (1 - ease(t, pullAt + 3.0, pullAt + 3.4));
  const handleX = DC.rowB + RACK.d / 2 + pull * 0.55 + 0.02;
  // world → the technician's frame (facing −x: local +z = world −x, local +x (the figure's left) = world +z)
  const toLocal = (wx: number, wz: number, yy: number): V3 => [wz - techAt[2], yy, -(wx - techAt[0])];
  const hd: [V3, V3] = [
    [-0.26, 0.82, 0.02],
    [0.26, 0.82, 0.02],
  ];
  const lerp3 = (a: V3, b: V3, k: number): V3 => [
    a[0] + (b[0] - a[0]) * k,
    a[1] + (b[1] - a[1]) * k,
    a[2] + (b[2] - a[2]) * k,
  ];
  const techHands: [V3, V3] = [
    lerp3(hd[0], toLocal(handleX, techPos[2] - 0.24, handleY), reach),
    lerp3(hd[1], toLocal(handleX, techPos[2] + 0.24, handleY), reach),
  ];

  // ---- the fill worker
  const worker: V3 = [4.45, 0.09, 1.95];
  const wReach = fh
    ? Math.max(
        ease(t, fh.connectAt - 0.4, fh.connectAt) * (1 - ease(t, fh.connectAt + 0.8, fh.connectAt + 1.2)),
        fh.capAt !== undefined
          ? ease(t, fh.capAt - 1.2, fh.capAt - 0.8) * (1 - ease(t, fh.capAt + 0.5, fh.capAt + 0.9))
          : 0,
      )
    : 0;
  const wTarget: V3 = [-(DC.fill[2] + 0.2 - worker[2]), DC.fill[1] - worker[1], DC.fill[0] - worker[0]];
  const workerHands: [V3, V3] = [
    lerp3(hd[0], [wTarget[0] - 0.05, wTarget[1], wTarget[2] - 0.05], wReach),
    lerp3(hd[1], [wTarget[0] + 0.08, wTarget[1] - 0.05, wTarget[2] - 0.1], wReach),
  ];

  // ---- the route's geometry for this frame
  const coilGlow = rs.coil;
  const routeDone1 = rs.leg1 >= 1;
  const routeDone2 = rs.leg2 >= 1;
  const head =
    rs.leg2 > 0 && rs.leg2 < 1
      ? pointAlong(G.leg2, rs.leg2)
      : rs.leg1 > 0 && rs.leg1 < 1
        ? pointAlong(G.leg1, rs.leg1)
        : null;
  // the roof leg ends at tower A's inlet, or dry cooler A's when the coolers are in place, or at the riser head mid-swap
  const dryLeg = dcDryLeg(G.leg2);
  const roofLeg: V3[] = roof.towerAIn ? G.leg2 : roof.dryAIn ? dryLeg : G.leg2.slice(0, 2);
  const warmPath: V3[] = routeDone2 ? [...G.leg1, ...roofLeg.slice(1)] : routeDone1 ? G.leg1 : [];
  const warmDots = warmPath.length ? Math.max(onFrom(props.loopFlow, t), lapActive ? 1 : 0, 1) : 0;

  const yardPoleTop = DC.poleH - 0.4;
  const wireSets = (arm: number, k: number): V3[][] =>
    [-1, 0, 1].map((i) => {
      const z = DC.polesZ + i * 1.05;
      const yA = yardPoleTop - arm * 1.3 + 0.34;
      const a: V3 = [DC.groundX0 - 18, yA + 1.5, z];
      const b: V3 = [DC.poles[0], yA, z];
      const c: V3 = [DC.poles[1], yA, z];
      const pts = [...catenary(a, b, 1.6), ...catenary(b, c, 0.25).slice(1)];
      return pts.slice(0, Math.max(2, Math.round(pts.length * k)));
    });

  return (
    <group>
      <Shell mats={shellMats} ink={ink} xray={xray} />
      <Hall mats={mats} clock={clock} aiFanTurns={aiFanTurns} pull={pull} ink={ink} />
      <Upper mats={mats} />

      {/* ---- the hall's heat: shimmer off every rack's back, the AI rack's column, the hot aisle's haze */}
      {[...Array(DC.racks).keys()].map((i) => {
        const ai = i === DC.racks - 1;
        const z = rackZ(i);
        return (
          <group key={`heat${i}`}>
            <HeatWisps
              at={[DC.hotX[0] + 0.15, 0, z]}
              y0={DC.raised + 0.5}
              y1={DC.raised + 1.9}
              rise={ai ? 1.6 + 1.2 * heatAi : 1.0}
              strength={ai ? heatAi : heatRacks}
              clock={clock}
              count={ai ? 16 : 6}
              size={ai ? 0.55 : 0.4}
              seed={`ha-${i}`}
            />
            {!ai ? (
              <HeatWisps
                at={[DC.hotX[1] - 0.15, 0, z]}
                y0={DC.raised + 0.5}
                y1={DC.raised + 1.9}
                rise={1.0}
                strength={heatRacks}
                clock={clock + 0.7}
                count={6}
                size={0.4}
                seed={`hb-${i}`}
              />
            ) : null}
          </group>
        );
      })}
      {haze > 0.01 ? (
        <group>
          <mesh
            position={[
              (DC.hotX[0] + DC.hotX[1]) / 2,
              DC.raised + (Math.min(1, haze) * (DC.floorH - DC.raised)) / 2,
              (DC.rackZ0 + 2.0) / 2 - 0.35,
            ]}
            renderOrder={3}
          >
            <boxGeometry
              args={[
                DC.hotX[1] - DC.hotX[0] - 0.05,
                Math.min(1, haze) * (DC.floorH - DC.raised),
                2.0 - DC.rackZ0 + 0.7,
              ]}
            />
            <meshBasicMaterial
              color={raw(section.orange)}
              transparent
              opacity={0.1 + 0.06 * Math.sin(clock * 1.7)}
              depthWrite={false}
            />
          </mesh>
          {haze > 0.75 ? (
            <mesh position={[(DC.x0 + DC.hallX1) / 2 - 0.5, DC.floorH - 0.35, DC.coilZ + 1.0]} renderOrder={3}>
              <boxGeometry args={[6.5, 0.6 * Math.min(1, (haze - 0.75) * 4), 2.2]} />
              <meshBasicMaterial color={raw(section.orange)} transparent opacity={0.08} depthWrite={false} />
            </mesh>
          ) : null}
        </group>
      ) : null}
      {hotArrows}

      {/* ---- people */}
      {tech ? (
        <Figure
          who="extra"
          mood={mood}
          position={techAt}
          rotationY={techRot}
          seed="dc-tech"
          phone={false}
          stance="stand"
          walk={walk}
          hands={techHands}
          look={EXTRA_B}
          gestures={
            pullAt !== undefined
              ? [
                  {
                    pose: 'turn-to',
                    at: pullAt - 0.6,
                    target: [handleX, DC.raised + 1.4, techPos[2]],
                    hold: 3.4,
                    blend: 0.4,
                  },
                ]
              : []
          }
          clockOffset={startFrame / fps}
        />
      ) : null}
      {fh ? (
        <Figure
          who="extra"
          mood={mood}
          position={worker}
          rotationY={Math.PI / 2}
          seed="dc-worker"
          phone={false}
          stance="stand"
          hands={workerHands}
          clockOffset={startFrame / fps}
        />
      ) : null}

      {/* ---- the plant room */}
      <group>
        {/* riser pipes: warm from the wall up to the roof header, cold down from the roof to the floor, makeup */}
        <Pipe points={[R.riserFoot, [DC.riserWarm, R.header, DC.riserZ]]} r={0.12} mat={mats.pipeWarm} shadow />
        <Pipe points={[R.leg1[1], [R.leg1[1][0], R.leg1[1][1], DC.zb + DC.wallT + 0.02]]} r={0.1} mat={mats.pipeWarm} />
      <Pipe points={[[DC.riserWarm, DC.wallRouteY, DC.zb + DC.wallT], R.riserFoot]} r={0.1} mat={mats.pipeWarm} />
        <Pipe points={[R.coilReturn[0], R.coilReturn[1]]} r={0.1} mat={mats.pipeWarm} />
        <Pipe points={[R.coilOut, R.leg1[1]]} r={0.1} mat={mats.pipeWarm} />
        <Pipe points={[cold[2], cold[3], [cold[4][0], cold[4][1], DC.zf - 0.2]]} r={0.12} mat={mats.pipeCold} shadow />
        <Pipe points={[[cold[5][0], cold[5][1], DC.zf - 0.2], ...cold.slice(6)]} r={0.12} mat={mats.pipeCold} />
        <Pipe points={service.slice(2, -2)} r={0.06} mat={mats.pipeFresh} />
        {/* the roof plant's own pipes ride with their unit when the roof swaps */}
        {roof.towerOff[0] < 25.9 ? (
          <group position={[0, roof.towerDrop[0], -roof.towerOff[0]]}>
            <Pipe points={[[DC.riserWarm, R.header, DC.riserZ], R.leg2[2], R.leg2[3], R.inlet]} r={0.12} mat={mats.pipeWarm} />
            <Pipe points={cold.slice(0, 3)} r={0.12} mat={mats.pipeCold} />
            <Pipe points={service.slice(-3)} r={0.06} mat={mats.pipeFresh} />
          </group>
        ) : null}
        {roof.dryOff[0] < 25.9 ? (
          // dry cooler A's warm feed off the riser header (it rides with its unit on the swap)
          <group position={[0, roof.dryDrop[0], -roof.dryOff[0]]}>
            {(() => {
              const inl = towerWorld(DC.towerA, DRY_INLET);
              return (
                <Pipe
                  points={[[DC.riserWarm, R.header, DC.riserZ], [inl[0] - 0.15, R.header, DC.riserZ], [inl[0] - 0.15, inl[1], DC.riserZ], inl]}
                  r={0.12}
                  mat={mats.pipeWarm}
                />
              );
            })()}
          </group>
        ) : null}
        {roof.towerOff[1] < 25.9 ? (
          <group position={[0, roof.towerDrop[1], -roof.towerOff[1]]}>
            <Pipe points={R.branch} r={0.1} mat={mats.pipeWarm} />
            <Pipe
              points={(() => {
                const o = towerWorld(DC.towerB, TOWER_OUTLET);
                return [o, [o[0], o[1], DC.riserZ - 0.25], [DC.riserCold, o[1], DC.riserZ - 0.25], [DC.riserCold, o[1], DC.riserZ]] as V3[];
              })()}
              r={0.1}
              mat={mats.pipeCold}
            />
          </group>
        ) : null}
        <Pipe
          points={[
            [DC.hotX[0] + 0.1, DC.raised + 0.25, DC.coilZ + 0.12],
            [DC.hotX[1] - 0.1, DC.raised + 0.25, DC.coilZ + 0.12],
          ]}
          r={0.1}
          mat={mats.pipeCold}
        />
        <Pipe points={service.slice(2)} r={0.06} mat={mats.pipeFresh} />
        {/* the cut header (the section plane cuts it lengthwise) */}
        <CutPipeRun
          x0={DC.header.x0 - 0.22}
          x1={DC.header.x1 + 0.22}
          y={DC.header.y}
          zCut={DC.zf}
          r={DC.header.r}
          scaleSpan={DC.scaleSpan}
          scale={scale}
          corrosionSpan={DC.corrosionSpan}
          corrosion={corrosion}
          flow={flowDist}
          flowOn={Math.max(coldOn, 0.0)}
          mats={mats}
          ink={ink}
          mood={mood}
          seed="dc-header"
        />
        {/* loop pumps on the return */}
        {[0.6, 1.5].map((z, i) => (
          <group key={i} position={[DC.pumpsX, 0.09, z]}>
            <mesh material={mats.concrete} position={[0, 0.06, 0]} receiveShadow>
              <boxGeometry args={[0.7, 0.12, 1.0]} />
            </mesh>
            <mesh material={mats.pipeCold} position={[0, DC.header.y - 0.09, 0]} castShadow>
              <cylinderGeometry args={[0.24, 0.24, 0.3, 20]} />
            </mesh>
            <mesh material={mats.cabinetDark} position={[0, 0.85, 0]} castShadow>
              <cylinderGeometry args={[0.17, 0.17, 0.5, 18]} />
            </mesh>
          </group>
        ))}
        {/* controller, bench, jars */}
        <group position={DC.controller}>
          <Controller mats={mats} needle={needle} setPoint={setPoint} ink={ink} />
        </group>
        <group position={[DC.bench.x, 0.09, DC.bench.z]}>
          <mesh
            geometry={roundedBox(1.1, 0.05, 0.56, 0.01)}
            material={mats.cabinet}
            position={[0, DC.bench.top - 0.09, 0]}
            castShadow
            receiveShadow
          />
          {[-1, 1].flatMap((a) =>
            [-1, 1].map((b) => (
              <Rod
                key={`${a}${b}`}
                a={[a * 0.5, 0, b * 0.22]}
                b={[a * 0.5, DC.bench.top - 0.11, b * 0.22]}
                r={0.02}
                mat={mats.galv}
              />
            )),
          )}
          <group position={[0, DC.bench.top - 0.065, 0.06]}>
            <SampleJars mats={mats} mult={jarMult} needle={jarNeedle} clock={clock} />
          </group>
        </group>
        {/* the blowdown valve on its stub, the stream, the floor sink and the trench */}
        <Pipe
          points={[
            [DC.valve[0], 0.7, DC.riserZ],
            [DC.valve[0], DC.valve[1], DC.riserZ],
            [DC.valve[0] - 0.09, DC.valve[1], DC.valve[2]],
          ]}
          r={0.05}
          mat={mats.pipeCold}
        />
        <group position={DC.valve}>
          <BlowdownValve mats={mats} open={blowdown} fall={DC.valve[1] - 0.16 - 0.06} clock={clock} />
        </group>
        <mesh material={mats.dark} position={[DC.sinkX, 0.095, DC.valve[2]]}>
          <boxGeometry args={[0.36, 0.01, 0.36]} />
        </mesh>
        <mesh material={mats.black} position={[DC.sinkX, 0.096, (DC.valve[2] + DC.zf) / 2]}>
          <boxGeometry args={[0.24, 0.006, DC.zf - DC.valve[2]]} />
        </mesh>
        {[...Array(Math.floor((DC.zf - DC.valve[2]) / 0.16)).keys()].map((i) => (
          <mesh key={`gr${i}`} material={mats.galv} position={[DC.sinkX, 0.1, DC.valve[2] + 0.1 + i * 0.16]}>
            <boxGeometry args={[0.26, 0.008, 0.035]} />
          </mesh>
        ))}
        {/* dosing skid */}
        <group position={DC.dosing}>
          <DosingSkid mats={mats} strokes={strokes} on={dosingOn} quill={[0.4, 0.82, DC.riserZ - DC.dosing[2]]} />
        </group>
        {/* fill station on the header, its gauge beside */}
        <Pipe
          points={[
            [DC.fill[0], DC.header.y + 0.1, DC.zf - 0.15],
            [DC.fill[0], DC.fill[1], DC.zf - 0.15],
            [DC.fill[0], DC.fill[1], DC.fill[2] - 0.05],
          ]}
          r={0.04}
          mat={mats.pipeCold}
        />
        <group position={DC.fill}>
          <FillStation mats={mats} hose={hoseK} cap={capK} level={gauge} gaugeAt={[0.7, -0.45, -0.2]} />
        </group>
      </group>

      {/* ---- the cut ground: the service line through the meter pit, the lateral */}
      <CutPipeRun
        x0={DC.groundX0}
        x1={DC.pit[0] + 0.05}
        y={DC.serviceY}
        zCut={DC.zf}
        r={0.09}
        wall={0.014}
        flow={serviceDist}
        flowOn={serviceOn}
        mats={mats}
        ink={ink * 0.8}
        mood={mood}
        seed="svc1"
      />
      <CutPipeRun
        x0={DC.pit[1] - 0.05}
        x1={DC.serviceRiserX}
        y={DC.serviceY}
        zCut={DC.zf}
        r={0.09}
        wall={0.014}
        flow={serviceDist}
        flowOn={serviceOn}
        mats={mats}
        ink={ink * 0.8}
        mood={mood}
        seed="svc2"
      />
      <Pipe
        points={[
          [DC.pit[0] + 0.05, DC.serviceY, DC.zf],
          [DC.meter[0] - 0.62, DC.serviceY, DC.meter[2]],
          [DC.meter[0] - 0.36, DC.meter[1], DC.meter[2]],
        ]}
        r={0.07}
        mat={mats.pipeFresh}
      />
      <Pipe
        points={[
          [DC.meter[0] + 0.36, DC.meter[1], DC.meter[2]],
          [DC.meter[0] + 0.62, DC.serviceY, DC.meter[2]],
          [DC.pit[1] - 0.05, DC.serviceY, DC.zf],
        ]}
        r={0.07}
        mat={mats.pipeFresh}
      />
      <group position={DC.meter} scale={2.2}>
        <WaterMeter sweep={waterTurns} leak={waterTurns * 4} lidOpen={1} />
      </group>
      <Rod
        a={[DC.serviceRiserX, DC.serviceY, DC.zf]}
        b={[DC.serviceRiserX, 0.06, DC.zf]}
        r={0.07}
        mat={mats.pipeFresh}
      />
      <CutPipeRun
        x0={DC.sinkX}
        x1={DC.groundX1}
        y={(DC.lateralY[0] + DC.lateralY[1]) / 2}
        zCut={DC.zf}
        r={0.12}
        wall={0.016}
        mats={mats}
        ink={ink * 0.8}
        mood={mood}
        seed="lateral"
      />
      <Rod a={[DC.sinkX, -0.04, DC.zf]} b={[DC.sinkX, DC.lateralY[0], DC.zf]} r={0.08} mat={mats.pipeDrain} />

      {/* ---- the yard */}
      <group>
        {DC.poles.map((x, i) => (
          <group key={i} position={[x, 0, DC.polesZ]}>
            <PowerPole mats={mats} h={DC.poleH} arms={1 + (double > 0.01 ? 1 : 0)} glint={glint} />
          </group>
        ))}
        {[0, 1].map((arm) => {
          const k = arm === 0 ? 1 : double;
          if (k < 0.01) return null;
          return wireSets(arm, k).map((pts, i) => (
            <React.Fragment key={`w${arm}${i}`}>
              <Pipe points={pts} r={0.025} mat={mats.wire} />
            </React.Fragment>
          ));
        })}
        {/* drops from the last pole to the switchgear and the bus to the transformers */}
        {[-1, 0, 1].map((i) => (
          <Pipe
            key={`dr${i}`}
            points={[
              [DC.poles[1], yardPoleTop + 0.34, DC.polesZ + i * 1.05],
              [DC.poles[1] + 1.4, 4.2, DC.polesZ + 1.2 + i * 0.4],
              [DC.switchgear[0] + i * 0.3, 2.3, DC.switchgear[2] - 0.2],
            ]}
            r={0.022}
            mat={mats.wire}
          />
        ))}
        <mesh material={mats.galv} position={[(DC.switchgear[0] + DC.x0) / 2, 2.6, DC.switchgear[2] - 0.2]}>
          <boxGeometry args={[DC.x0 - DC.switchgear[0], 0.3, 0.3]} />
        </mesh>
        <group position={DC.switchgear}>
          <Switchgear mats={mats} discTurns={elecTurns} w={DC.switchgearW} />
        </group>
        {yard.slots.map((s, i) => {
          if (s.lift >= 0.999) return null;
          const [x, z] = T_SLOTS[i];
          const sy = 1 - yard.settle(i);
          return (
            <group key={`t${i}`} position={[x, 0.06 + s.lift * 9, z]} scale={[1, sy, 1]}>
              <Transformer kind={s.kind} mats={mats} fanTurns={tFanTurns + i * 0.17} />
            </group>
          );
        })}
        {yard.leaving.map((s) => {
          if (s.lift >= 0.999) return null;
          const [x, z] = T_SLOTS[s.i];
          return (
            <group key={`tl${s.i}`} position={[x, 0.06 + s.lift * 9, z]}>
              <Transformer kind={s.kind} mats={mats} fanTurns={tFanTurns} />
            </group>
          );
        })}
      </group>

      {/* ---- the roof: towers or dry coolers (sliding on the swap), their pipe stubs, the plume */}
      {roof.towersShown
        ? [DC.towerA, DC.towerB].map((b, i) => {
            const off = roof.towerOff[i];
            if (off >= 25.99) return null;
            const base: V3 = [b[0], b[1] + roof.towerDrop[i], b[2] - off];
            return (
              <group key={`tw${i}`}>
                <group position={base}>
                  {/* dunnage */}
                  {[-1, 1].map((s) => (
                    <mesh key={s} material={mats.galv} position={[0, -DC.dunnage / 2, s * 1.3]} castShadow>
                      <boxGeometry args={[TOWER_DC.w + 0.4, DC.dunnage, 0.25]} />
                    </mesh>
                  ))}
                  <CoolingTower
                    mood={mood}
                    cut={i === 0 ? towerCut : 0}
                    fanTurns={i === 0 ? fanTurns : fanTurnsB}
                    fanRate={(i === 0 ? fanLevel : fanLevelB) * FAN_RATE.tower}
                    clock={clock + i * 0.31}
                    rain={rainK}
                    warm={1}
                    uniform={rainUniform}
                    vapor={vaporK}
                    tokens={props.vapor?.tokens !== false}
                    vaporEvery={props.vapor?.every ?? 0.8}
                    airIn={onFrom(props.airIn, t)}
                    level={level + 0.02 * ripple * Math.sin(clock * 9)}
                    minerals={minerals}
                    mineralFall={mineralFall}
                    laps={ringTicks}
                    biofilm={biofilm}
                    makeup={makeup}
                    inside={i === 0 && towerCut > 0}
                    ink={ink}
                    seed={`dc-tower-${i}`}
                  />
                </group>
              </group>
            );
          })
        : null}
      {roof.dryShown
        ? [DC.towerA, DC.towerB].map((b, i) => {
            const off = roof.dryOff[i];
            if (off >= 25.99) return null;
            const base: V3 = [b[0], b[1] + roof.dryDrop[i], b[2] - off];
            return (
              <group key={`dc${i}`} position={base}>
                {[-1, 1].map((s) => (
                  <mesh key={s} material={mats.galv} position={[0, -DC.dunnage / 2, s * 0.8]} castShadow>
                    <boxGeometry args={[DRY_DC.l + 0.4, DC.dunnage, 0.25]} />
                  </mesh>
                ))}
                <DryCooler
                  mood={mood}
                  cut={i === 0 ? dryCut : 0}
                  fanTurns={i === 0 ? fanTurns : fanTurnsB}
                  fanRate={(i === 0 ? fanLevel : fanLevelB) * FAN_RATE.dry}
                  clock={clock + i * 0.4}
                  warm={1}
                  warmAir={warmAir}
                  ink={ink}
                  seed={`dc-dry-${i}`}
                />
                {/* stubs down into the roof */}
                <Pipe
                  points={[
                    [-DRY_DC.l / 2 + 0.2, 1.25, -0.7],
                    [-DRY_DC.l / 2 - 0.15, 1.25, -0.7],
                    [-DRY_DC.l / 2 - 0.15, -DC.dunnage, -0.7],
                  ]}
                  r={0.08}
                  mat={mats.pipeWarm}
                />
                <Pipe
                  points={[
                    [DRY_DC.l / 2 - 0.2, 1.05, -0.7],
                    [DRY_DC.l / 2 + 0.15, 1.05, -0.7],
                    [DRY_DC.l / 2 + 0.15, -DC.dunnage, -0.7],
                  ]}
                  r={0.08}
                  mat={mats.pipeCold}
                />
              </group>
            );
          })
        : null}
      {plumeBase > 0.01
        ? [DC.towerA, DC.towerB].map((b, i) => {
            const off = roof.towerOff[i];
            if (off > 3 || roof.towerDrop[i] > 0.5) return null;
            const fl = i === 0 ? fanLevel : fanLevelB;
            const pulseK =
              1 + 0.2 * pulse * Math.max(0, Math.sin((clock / (props.plumePulse?.every ?? 1.4)) * Math.PI * 2));
            return (
              <Plume
                key={`pl${i}`}
                position={[b[0], b[1] + TOWER_DC.h + TOWER_DC.stackH + 0.15, b[2] - off]}
                strength={plumeBase * (0.7 + 0.3 * Math.min(1.4, fl)) * pulseK * (1 - off / 3)}
                radius={1.3}
                rise={6.5}
                life={7}
                count={48}
                wind={2.2}
                tone={0.95 / m.exposure}
                shade={0.9}
                opacity={1}
                tokens={0.35 * tokens}
                tokenSize={0.11}
                pulse={0.15 + 0.25 * pulse}
                pulseEvery={props.plumePulse?.every ?? 2.4}
                facing={SECTION_ANGLE}
                seed={`dc-plume-${i}`}
                clockOffset={startFrame / fps + i * 1.7}
              />
            );
          })
        : null}

      {/* ---- the orange: the route, its node dots, dots travelling it, the drain, the split */}
      {coilGlow > 0.003 ? <GlowPolyline points={G.coilReturn} radius={coreR} glow={coilGlow} /> : null}
      {coilGlow > 0.003 ? <GlowNode at={G.coilOut} radius={nodeR} glow={coilGlow} /> : null}
      {rs.leg1 > 0 ? <GlowPolyline points={G.leg1} draw={rs.leg1} radius={coreR} /> : null}
      {routeDone1 ? <GlowNode at={G.riserFoot} radius={nodeR} /> : null}
      {rs.leg2 > 0 ? <GlowPolyline points={roofLeg} draw={rs.leg2} radius={coreR} /> : null}
      {rs.leg2 > 0 && roof.towerOff[1] < 0.01 && roof.towerDrop[1] < 0.01 ? <GlowPolyline points={G.branch} draw={rs.leg2} radius={coreR} /> : null}
      {routeDone2 && (roof.towerAIn || roof.dryAIn) ? <GlowNode at={roofLeg[roofLeg.length - 1]} radius={nodeR} /> : null}
      {warmPath.length ? (
        <FlowMarks
          points={warmPath}
          offset={flowDist}
          spacing={1.4}
          // with `routeScale` the travelling dots grow only by its square root (2.5 → ×1.6): at ×2.5 they read as blobs
          size={(coreR / (props.routeScale ?? 1)) * 5 * Math.sqrt(props.routeScale ?? 1)}
          kind="warm"
          opacity={warmDots}
          mood={mood}
        />
      ) : null}
      <OrangeLight position={head ?? G.coilOut} intensity={head ? 0.6 : 0} reach={1.4} />
      {/* the cold leg's neutral flow (and the coil's supply), the makeup line when it flows */}
      {coldOn > 0.01 ? (
        <>
          {/* the cut header carries its own marks; these run the rest of the cold leg */}
          <FlowMarks points={cold.slice(0, 5)} offset={flowDist} spacing={1.2} size={0.16} opacity={coldOn} mood={mood} lift={0.14} />
          <FlowMarks points={cold.slice(5)} offset={flowDist} spacing={1.2} size={0.16} opacity={coldOn} mood={mood} lift={0.14} />
        </>
      ) : null}
      {makeup > 0.02 ? (
        <FlowMarks
          points={service.slice(2)}
          offset={serviceDist}
          spacing={0.9}
          size={0.11}
          opacity={Math.min(1, makeup * 2)}
          mood={mood}
          lift={0.08}
        />
      ) : null}
      {/* the ring riding the loop */}
      {ringU !== null
        ? (() => {
            const {at, dir} = alongWithDir(loop, ringU);
            const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(...dir));
            return (
              <group position={at} quaternion={q}>
                <mesh material={mats.ink} rotation={[Math.PI / 2, 0, 0]}>
                  <torusGeometry args={[0.2, 0.025, 8, 28]} />
                </mesh>
                <mesh material={mats.dotWhite} rotation={[Math.PI / 2, 0, 0]}>
                  <torusGeometry args={[0.2, 0.045, 8, 28]} />
                </mesh>
              </group>
            );
          })()
        : null}
      {drainDraw > 0 ? <GlowPolyline points={drainPts} draw={drainDraw} radius={coreR} /> : null}
      {drainDraw > 0 ? <GlowNode at={drainPts[0]} radius={nodeR} /> : null}
      {drainPulses.map((q, i) => (
        <GlowNode key={`dp${i}`} at={q} radius={coreR * 1.9} dot />
      ))}
      {splitArrows}
      {/* the reveal's orange tell (§ 11.6.1): node dots at the racks' backs, the riser head and the tower basin pulse once */}
      {props.reveal
        ? (() => {
            const vf = startFrame + frame;
            const a0 = props.reveal.tell;
            const g = ease(vf, a0, a0 + 9) * (1 - 0.4 * ease(vf, a0 + 9, a0 + 18)) * (1 - ease(vf, a0 + 30, a0 + 54));
            if (g < 0.003) return null;
            const tA = DC.towerA;
            const pts: V3[] = [
              [DC.hotX[0] + 0.05, 1.6, AI_RACK.z],
              [DC.hotX[0] + 0.05, 1.6, rackZ(2)],
              [DC.riserWarm, R.header, DC.riserZ + 0.2],
              [tA[0], tA[1] + 0.45, tA[2] + 0.4],
            ];
            return pts.map((q, i) => <GlowNode key={`tell${i}`} at={q} radius={nodeR * 1.4} glow={g} />);
          })()
        : null}
    </group>
  );
};
