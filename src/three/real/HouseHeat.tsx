import React, {useEffect, useMemo} from 'react';
import {random} from 'remotion';
import * as THREE from 'three';
import {ease, keyedValue, type Keyed} from '../../scenes/keyframes';
import {CHARGE, HIGHWAY, PLUGS, REAL, section, STREET, WINTER} from '../../theme';
import {raw, roundedBox} from '../plaster';
import {cutMaterial, CutOutline, INK, InkLine, type Rect} from '../section/cutLook';
import type {MoodPalette} from '../section/moods';
import {HEAT_COLOR, type FlowKeys, type WispState} from './HeatKit';
import {meterDial} from './HomeGarage';
import {applyEnv, useEnvStrength, useStudioEnv} from './useStudioEnv';

type V3 = [number, number, number];

/*
 * No. 018 `home-heat`: a house's heating at house scale, in the house slice's world frame (metres; x left → right,
 * y up from grade, z toward the camera; the house's section plane is z = `HOUSE.zf`). Generic, no maker. Brand
 * v0.18.12: the heat and the energy spent making or moving it are the system (`HEAT_COLOR`, from its source); the parts
 * are real materials (galvanized and painted sheet metal, `REAL.copper` lines, black foam insulation `REAL.flex`,
 * `CHARGE.coolant` in cut tubes with `coolantFlow` streaks), never red-hot; a running element takes the § 5 "made by"
 * glow (orange edge and halo, the cut face stays `cut`).
 *
 *  - `HOUSE`: the layout every part and the scene share.
 *  - Loop helpers (N9): `loopPeriod`, `lockedSpin` (a fan's turn phase-locked to the video so it is the same on the first
 *    and last frame), `loopWisps` (warm-air wisps on a spawn grid that repeats exactly over the video).
 *  - `OutdoorUnit` (N4): the outdoor unit on its pad, cut through its middle: top fan, wraparound coil cut through its
 *    tubes (the back coil's tubes cut open lengthwise: liquid, streaks, boiling), compressor dome cut (scroll orbiting),
 *    expansion valve, service valves, snow on the grille.
 *  - `LineSet`, `MeterDisconnect` (N4): the line set to the basement, the meter and the disconnect with their conduit.
 *  - `AirHandler` (N3): the upflow air handler cut by the section plane: filter, A-coil, blower, backup strips, plenum,
 *    trunk to the register, a return, the panel on the basement wall with the strips' cable.
 *  - `CutSpaceHeater` (N2): the small fan heater cut through its side: element, fan, grille, pilot lamp, its cord.
 *  - `GlowFrame`: the § 5 "made by" glow on a flat cut face (edge + halo), for elements and coils.
 */

// ------------------------------------------------------------------------------------------------ layout

/**
 * N7: the snow's tone under the Night key, a step under `WINTER.snow` (No. 017's driveway used × 0.9 in Day). At Night
 * × 0.9 lifted the roof's snow to 245 and × 0.87 still left flat yard snow at 246 in places, so × 0.85 keeps lit snow
 * ≤ 244 (brand § 1 WINTER condition 1, v0.18.13 Night whites).
 */
export const HOUSE_SNOW = 0.85;

/** Brand v0.18.13 (Night whites): `cut` × this on the over-lit cut faces only (the ground block, the object cut-aways). */
export const CUT_LIT = 0.96;

/** The house slice's layout (world, metres). */
export const HOUSE = {
  /** Outer faces of the walls: left, right, back; the section plane (front). */
  x0: -3,
  x1: 3,
  zb: -2.2,
  zf: 2.0,
  wallT: 0.2,
  /** Foundation walls' thickness, their top (the deck sits on them; ≈ 0.35 above grade). */
  foundT: 0.25,
  deckY: 0.35,
  /** The living floor's top, the walls' top, the ceiling slab's top (the attic floor). */
  floor: 0.6,
  wallTop: 3.3,
  ceilTop: 3.5,
  /** The gable roof: ridge height, eave overhang at the sides, at the back; the roof slabs' thickness. */
  ridge: 5.4,
  eave: 0.4,
  roofBack: 0.35,
  roofT: 0.2,
  /** The basement floor's top, the slab's bottom, the cut ground's bottom. */
  bsmt: -2.05,
  slabBottom: -2.2,
  ground: -2.95,
  /** The cut ground block's extent (x) and its back (z). */
  gx0: -4.2,
  gx1: 12.6,
  gzb: -5.0,
  /** Snow on the ground (thickness). */
  snowT: 0.09,
  /** The window in the left wall (z span, y span). */
  window: {z0: 0.25, z1: 1.45, y0: 1.45, y1: 2.5},
  /**
   * The living room is laid out left of centre: at the fixed angle the right wall hides the room's back-right corner
   * (the back wall shows only left of x ≈ 0.7). The couch's centre (RealLivingRoom's frame origin goes at `living`),
   * YOU on its left seat, the floor lamp (RealLivingRoom frame) and its light (world).
   */
  living: [0.4, 0.6, -0.8] as V3,
  you: [-0.18, 0.6, -1.3] as V3,
  lamp: [-2.7, 0, -0.85] as V3,
  lampLight: [-2.3, 1.9, -1.55] as V3,
  /** The floor register (centre, on the floor; size x × z). */
  register: [-1.5, 0.6, 1.86] as V3,
  registerSize: [0.3, 0.2] as [number, number],
  /** The space heater on the floor left of the couch (front faces +x, toward YOU; its cut toward the camera). */
  heater: [-1.32, 0.6, -1.15] as V3,
  heaterScale: 1.6,
  /** The outlet on the back wall's inner face behind the heater, low (faces +z). */
  outlet: [-1.6, 0.88, -1.997] as V3,
  /** The room thermometer's foot (back wall's inner face). */
  roomThermo: [-1.72, 1.32, -1.985] as V3,
  /**
   * The basement's ceiling light (a bare bulb under the deck). A point light casts no shadow, so its reach (3.2 m, the
   * scene) keeps it inside the basement: at 5.5 m it lit the outdoor unit's top and the drifts through the wall.
   */
  bulb: [-0.6, 0.05, 1.2] as V3,
  /** The air handler: cabinet x span, back z (it is cut by the section plane at `zf`), its sections' tops (y). */
  ah: {x0: -1.82, x1: -1.18, zb: 1.25, base: -1.97, filter: -1.8, coil: -1.22, blower: -0.8, strips: -0.56, top: -0.36},
  /** The electrical panel on the left foundation wall's inner face (facing +x). */
  panel: [-2.74, -0.75, 1.1] as V3,
  /** The outdoor unit: x span, back z, its cut plane (its middle), base (pad top) and top; the pad. */
  unit: {x0: 3.55, x1: 4.5, zb: -0.2, zc: 0.2, y0: 0.12, y1: 1.02},
  pad: {x0: 3.43, x1: 4.62, z0: -0.32, z1: 0.62, h: 0.12},
  /** The compressor (centre on the unit's cut plane), radius, height. */
  comp: [3.83, 0.14, 0.2] as V3,
  compR: 0.13,
  compH: 0.5,
  /** The fan's centre (top of the unit), its radius. */
  fan: [4.025, 0.95, 0.0] as V3,
  fanR: 0.36,
  /** The meter and the disconnect on the right wall's outer face (x = x1). */
  meter: [3.0, 1.55, 1.15] as V3,
  disconnect: [3.0, 1.15, 0.45] as V3,
  /** The thermometers' feet (world; faced to the camera by the scene). */
  airThermo: [5.2, 0.42, 0.32] as V3,
  coilThermo: [4.72, 0.42, 0.32] as V3,
  hotThermo: [3.42, 0.32, 0.1] as V3,
  /** On the line set's drop beside the trunk, high in the basement (clear of a caption band; review S3). */
  hotIndoorThermo: [-0.8, -1.0, 1.9] as V3,
  /** The air thermometer's post. */
  post: [5.2, 0, 0.26] as V3,
  /** YOU's EV (car origin: its centre, facing −x toward the house; far enough right that frame 0 doesn't show it), the driveway's x span. */
  car: [9.4, 0.0, 0.42] as V3,
  drive: {x0: 5.75, x1: 12.6},
};

/** The routes (world). Hot gas: compressor → line set → A-coil. Every flow rides on its pipe, cable or duct. */
const U = HOUSE.unit;
const A = HOUSE.ah;
const AHX = (A.x0 + A.x1) / 2;
/** The line set's path (the insulated vapour line's centre), compressor → A-coil. */
export const LINE_SET: V3[] = [
  [3.83, 0.66, 0.12],
  [3.83, 0.74, 0.12],
  [3.64, 0.74, 0.12],
  [3.64, 0.27, 0.12],
  [3.64, 0.27, 0.02],
  [3.22, 0.27, 0.02],
  [3.22, 0.27, 1.66],
  [2.62, 0.27, 1.66],
  [2.62, 0.14, 1.66],
  [-0.98, 0.14, 1.66],
  [-0.98, -1.5, 1.66],
  [A.x1 + 0.01, -1.5, 1.66],
];
/** The liquid line beside it (bare copper, thinner), A-coil → expansion valve (offset under and in front). */
export const LIQUID_LINE: V3[] = [
  [A.x1 + 0.01, -1.62, 1.75],
  [-0.9, -1.62, 1.75],
  [-0.9, 0.06, 1.75],
  [2.55, 0.06, 1.75],
  [2.55, 0.19, 1.75],
  [3.3, 0.19, 1.75],
  [3.3, 0.19, 0.07],
  [3.66, 0.19, 0.07],
  [3.66, 0.19, 0.12],
];
/** The feed: meter → disconnect → down the wall → the whip into the unit → the compressor's terminal box. */
export const FEED: V3[] = [
  [3.07, 1.36, 1.15],
  [3.07, 1.02, 1.15],
  [3.07, 1.02, 0.45],
  [3.07, 0.56, 0.45],
  [3.57, 0.56, 0.1],
  [3.7, 0.56, 0.1],
  [3.7, 0.6, 0.21],
];
/** The suction (vapour) line in the unit: the coil's outlet header → the compressor's side. */
export const SUCTION: V3[] = [
  [4.32, 0.86, 0.14],
  [4.08, 0.86, 0.14],
  [4.08, 0.4, 0.14],
  [3.97, 0.4, 0.2],
];
/** Warm air up the trunk: the plenum → the register. */
export const SUPPLY: V3[] = [
  [AHX, A.strips - 0.05, 1.86],
  [AHX, HOUSE.floor - 0.02, 1.86],
];
/** The strips' feed: the panel → along the wall and the ceiling → the strips (on the cable). */
export const STRIP_FEED: V3[] = [
  [-2.66, -0.82, 1.1],
  [-2.66, -0.68, 1.1],
  [-2.66, -0.68, 1.86],
  [A.x0 - 0.01, -0.68, 1.86],
];
/** The space heater's feed: the outlet → down the wall → along the floor → into the heater's back → its element. */
export const heaterFeed = (): V3[] => {
  const [hx, , hz] = HOUSE.heater;
  const o = HOUSE.outlet;
  const f = HOUSE.floor;
  return [
    [o[0], o[1] - 0.02, o[2] + 0.02],
    [o[0], f + 0.02, o[2] + 0.035],
    [o[0], f + 0.02, hz - 0.02],
    [hx - 0.2, f + 0.02, hz - 0.02],
    [hx - 0.1, f + 0.05, hz - 0.02],
    [hx + 0.04, f + 0.05, hz - 0.02],
    [hx + 0.04, f + 0.19, hz - 0.02],
    [hx + 0.07, f + 0.19, hz - 0.02],
  ];
};

/** A route moved toward the camera by `d` (m): a flow riding on the camera's side of its pipe, cable or duct. */
export const ride = (pts: V3[], d: number, dir: V3): V3[] => pts.map((q) => [q[0] + dir[0] * d, q[1] + dir[1] * d, q[2] + dir[2] * d]);

// ------------------------------------------------------------------------------------------------ loop helpers (N9)

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const mod = (x: number, m: number) => ((x % m) + m) % m;

/** A period rounded so a whole number of them fits the loop (`loop` s; 0: unchanged). */
export const loopPeriod = (p: number, loop: number) => (loop > 0 ? loop / Math.max(1, Math.round(loop / p)) : p);

/** Keys as a sorted list ({at, value}); a constant as one key at 0. */
const keyList = (k: Keyed | undefined, dflt: number): {at: number; value: number}[] =>
  k === undefined ? [{at: 0, value: dflt}] : typeof k === 'number' ? [{at: 0, value: k}] : [...k].sort((a, b) => a.at - b.at);

/**
 * N9: a part's turn (rad), phase-locked to the video. `k` its speed (0 → 1, keys in scene seconds), `start` the scene's
 * start in the video (s), `omega` rad/s at full speed (round it with `lockOmega` for a loop), `sym` the part's
 * symmetry (blades). While it runs at full speed its turn is ω·(video s) modulo 2π/sym; while stopped it rests at a
 * multiple of 2π/sym; a change between the two eases the difference (< one blade) into the change. So scenes agree
 * at every cut and the last frame matches the first, with no state carried between scenes.
 */
export const lockedSpin = (o: {k: Keyed | undefined; t: number; start: number; omega: number; sym: number; dflt?: number}) => {
  const step = (2 * Math.PI) / Math.max(1, o.sym);
  const ks = keyList(o.k, o.dflt ?? 1).map((q) => ({at: q.at, value: clamp01(q.value)}));
  const R = (x: number) => o.omega * (o.start + x);
  const s0 = ks[0].value;
  // the angle at the scene's start: locked to the video when running, at rest when stopped
  let a = s0 > 0.99 ? R(0) : s0 < 0.01 ? 0 : o.omega * s0 * o.start;
  let at = 0;
  let v = s0;
  const integ = (x0: number, x1: number) => {
    let s = 0;
    const STEP = 1 / 120;
    for (let x = x0; x < x1; x += STEP) s += clamp01(keyedValue(o.k, x + STEP / 2, o.dflt ?? 1)) * Math.min(STEP, x1 - x);
    return s;
  };
  for (let i = 0; i < ks.length; i++) {
    const k = ks[i];
    if (k.at <= at + 1e-9) {
      v = k.value;
      continue;
    }
    const t1 = k.at;
    if (Math.abs(k.value - v) < 1e-6) {
      // steady: hold the speed
      if (o.t <= t1) return a + o.omega * v * (o.t - at);
      a += o.omega * v * (t1 - at);
    } else {
      // a change: integrate, and ease in the step to the locked angle at its end
      const rawEnd = a + o.omega * integ(at, t1);
      const target = k.value > 0.99 ? rawEnd + mod(R(t1) - rawEnd, step) : k.value < 0.01 ? rawEnd + mod(-rawEnd, step) : rawEnd;
      if (o.t <= t1) return a + o.omega * integ(at, o.t) + (target - rawEnd) * ease(o.t, at, t1);
      a = target;
    }
    at = t1;
    v = k.value;
  }
  return a + o.omega * v * (o.t - at);
};

/** ω (rad/s) rounded so that over the loop the part turns a whole number of blade steps (`sym` blades). */
export const lockOmega = (revs: number, sym: number, loop: number) => {
  const step = (2 * Math.PI) / Math.max(1, sym);
  const w = revs * 2 * Math.PI;
  return loop > 0 ? (Math.max(1, Math.round((w * loop) / step)) * step) / loop : w;
};

export type LoopWispSource = {
  /** Where wisps start, a box (min, max) they are born in (seeded). */
  from: [V3, V3];
  /** Their velocity (m/s) as they leave; or `to`: a point (or box) they converge on over `travel` s. */
  velocity?: V3;
  to?: [V3, V3];
  travel?: number;
  /** Then on past it (m/s) for the rest of its life (a leak through glass). */
  after?: V3;
  every?: number;
  life?: number;
  size?: [number, number];
  /** Max distance from its birth point (m) before it has faded (own motion). */
  reach?: number;
  /** Fully faded past this x (`side` +1: fading as x grows past it, −1: as x falls below it). */
  stopX?: {x: number; side: 1 | -1; soft?: number};
  seed: string;
};

/**
 * Warm-air wisps (§ 5 System heat near the cast: halo only, ≤ 25 %) on a spawn grid that repeats exactly over the loop:
 * `every` is rounded to divide `loop`, and each wisp's seed is its slot in the loop. `level(t0)` (0 → 1) at birth sets
 * whether it is born (a seeded share) and its strength; `vt` is the video clock (s). Drawn out along the flow (`dir`)
 * when converging, round lobes otherwise.
 */
export const loopWisps = (s: LoopWispSource, vt: number, loop: number, level: (vt0: number) => number, keepAll = false): WispState[] => {
  const n = loop > 0 ? Math.max(1, Math.round(loop / (s.every ?? 0.3))) : 0;
  const every = loop > 0 ? loop / n : (s.every ?? 0.3);
  const life = s.life ?? 1.6;
  const out: WispState[] = [];
  const [s0, s1] = s.size ?? [0.04, 0.1];
  for (let k = Math.floor((vt - life) / every); k <= Math.floor(vt / every); k++) {
    const t0 = k * every;
    const age = vt - t0;
    if (age < 0 || age > life) continue;
    const lv = clamp01(level(t0));
    if (lv < 0.01) continue;
    const slot = n ? mod(k, n) : k;
    const r = (q: string) => random(`${s.seed}-${slot}-${q}`);
    if (!keepAll && r('keep') > 0.25 + 0.75 * lv) continue;
    const P0: V3 = [0, 1, 2].map((i) => s.from[0][i] + (s.from[1][i] - s.from[0][i]) * r(`p${i}`)) as V3;
    let p: V3;
    let dir: V3 | undefined;
    let fade = 1;
    if (s.to) {
      const T: V3 = [0, 1, 2].map((i) => s.to![0][i] + (s.to![1][i] - s.to![0][i]) * r(`t${i}`)) as V3;
      const travel = s.travel ?? 1.4;
      const u = Math.min(1, age / travel);
      const e = u * u * (3 - 2 * u) * 0.6 + u * u * 0.4;
      p = [P0[0] + (T[0] - P0[0]) * e, P0[1] + (T[1] - P0[1]) * e, P0[2] + (T[2] - P0[2]) * e];
      const d: V3 = [T[0] - P0[0], T[1] - P0[1], T[2] - P0[2]];
      if (s.after && age > travel) {
        const q = age - travel;
        p = [T[0] + s.after[0] * q, T[1] + s.after[1] * q, T[2] + s.after[2] * q];
        const al = Math.hypot(...s.after) || 1;
        dir = [s.after[0] / al, s.after[1] / al, s.after[2] / al];
      } else {
        const dl = Math.hypot(...d) || 1;
        dir = [d[0] / dl, d[1] / dl, d[2] / dl];
        if (!s.after) fade = 1 - ease(u, 0.82, 1);
      }
    } else {
      const v = s.velocity ?? [0, 0.3, 0];
      const vk = 0.75 + 0.5 * r('v');
      const sway = 0.015 * Math.sin(age * 4 + 6 * r('ph'));
      p = [P0[0] + v[0] * age * vk, P0[1] + v[1] * age * vk + sway, P0[2] + v[2] * age * vk];
    }
    const ul = age / life;
    let op = lv * ease(age, 0, 0.25) * (1 - ease(ul, 0.5, 1)) * fade;
    if (s.reach !== undefined) {
      const d = Math.hypot(p[0] - P0[0], p[1] - P0[1], p[2] - P0[2]);
      op *= 1 - ease(d, s.reach * 0.55, s.reach);
    }
    if (s.stopX) {
      const soft = s.stopX.soft ?? 0.1;
      op *= 1 - ease((p[0] - s.stopX.x) * s.stopX.side, -soft, 0);
    }
    if (op < 0.01) continue;
    out.push({key: k, p, r: s.to ? 0.06 - 0.02 * Math.min(1, age / (s.travel ?? 1.4)) : s0 + (s1 - s0) * Math.sqrt(ul), op, dir});
  }
  return out;
};

/** A flow's draw state from `true` (on), `false` (off) or draw keys (`flowState`). */
export type FlowOn = boolean | FlowKeys;
export const flowOn = (k: FlowOn | undefined, t: number, dflt = true) => {
  const v = k === undefined ? dflt : k;
  if (v === true) return {p: 1, g: 1};
  if (v === false) return {p: 0, g: 0};
  const p = v.at <= -0.5 && t >= v.at ? 1 : ease(t, v.at, v.at + (v.drawFor ?? 1.0));
  const g = t < v.at ? 0 : v.fadeAt == null ? 1 : 1 - ease(t, v.fadeAt, v.fadeAt + (v.fadeFor ?? 0.6));
  return {p, g};
};

// ------------------------------------------------------------------------------------------------ shared materials

const useHouseMats = () => {
  const env = useStudioEnv();
  const envScale = useEnvStrength();
  const mats = useMemo(() => {
    const std = (c: string, r = 0.8, o: THREE.MeshStandardMaterialParameters = {}) => new THREE.MeshStandardMaterial({color: raw(c), roughness: r, ...o});
    const phys = (c: string, r: number, m: number) => new THREE.MeshPhysicalMaterial({color: raw(c), roughness: r, metalness: m});
    return {
      // brand v0.18.13 (Night whites): the objects' cut faces sit near the practicals and the key, and read 245–247
      // at close framings; × 0.96 on these faces only keeps them ≤ 244 (the exposure and the key untouched)
      cut: (() => {
        const c = cutMaterial();
        c.color.multiplyScalar(CUT_LIT);
        return c;
      })(),
      panel: phys(CHARGE.cabinet, 0.5, 0.2),
      dark: phys(CHARGE.cabinetDark, 0.55, 0.25),
      inside: std(REAL.labDark, 0.85),
      // rougher than HeatKit's: the return duct's broad sheen read 255 under the basement bulb (a glint must stay small)
      galv: phys(HIGHWAY.galvanized, 0.6, 0.55),
      fin: phys(REAL.frame, 0.5, 0.5),
      copper: phys(REAL.copper, 0.62, 0.3),
      foam: std(REAL.flex, 0.9),
      cable: std(REAL.cable, 0.6),
      conduit: phys(PLUGS.feed, 0.5, 0.4),
      coolant: std(CHARGE.coolant, 0.3),
      coolantFill: new THREE.MeshBasicMaterial({color: raw(CHARGE.coolant)}),
      streak: new THREE.MeshBasicMaterial({color: raw(CHARGE.coolantFlow), transparent: true}),
      vapour: new THREE.MeshBasicMaterial({color: raw(CHARGE.coolantFlow), transparent: true}),
      bubble: new THREE.MeshBasicMaterial({color: raw(CHARGE.coolantFlow), transparent: true}),
      brass: phys(REAL.brass, 0.4, 0.6),
      concrete: std(CHARGE.concrete, 0.92),
      filter: std(WINTER.packed, 0.95),
      // the strips' ceramic frame, a step under the token: its top faces the basement bulb (read 249)
      ceramic: std(STREET.concrete, 0.85, {color: raw(STREET.concrete).multiplyScalar(0.85)}),
      meterBox: std(STREET.box, 0.6),
      dial: new THREE.MeshStandardMaterial({color: raw('#ffffff'), roughness: 0.5, map: meterDial()}),
      glass: new THREE.MeshPhysicalMaterial({color: raw(WINTER.frost), roughness: 0.05, transparent: true, opacity: 0.25, depthWrite: false}),
      ink: new THREE.MeshBasicMaterial({color: raw(section.cutLine)}),
      snow: std(WINTER.snow, 0.95, {color: raw(WINTER.snow).multiplyScalar(HOUSE_SNOW)}),
      snowShade: std(WINTER.snowShade, 0.95),
      // the outlet's plate: matte, a step under the cabinet token (the pale panel read 255 under the lamp)
      plate: std(CHARGE.cabinet, 0.85, {color: raw(CHARGE.cabinet).multiplyScalar(0.62)}),
      // small rounded snow (the guard's lumps, the rim, the drifts) has faces turned straight to the Night key, which
      // clipped to 255 even in `snowShade`; flat ground snow gets ≈ 0.6 of the key, so these take × 0.6 (≤ 244)
      snowTop: std(WINTER.snow, 0.95, {color: raw(WINTER.snow).multiplyScalar(0.6)}),
      lampOff: new THREE.MeshBasicMaterial({color: raw(section.ledOff)}),
      lampOn: new THREE.MeshBasicMaterial({color: raw(section.warning), transparent: true}),
    };
  }, []);
  useEffect(() => () => Object.values(mats).forEach((m) => m.dispose()), [mats]);
  applyEnv(
    env,
    [
      [mats.panel, 0.5],
      [mats.dark, 0.5],
      [mats.galv, 0.9],
      [mats.fin, 0.8],
      [mats.copper, 0.4],
      [mats.conduit, 0.6],
      [mats.brass, 0.7],
    ],
    envScale,
  );
  return mats;
};

/** A box with the faces listed in `cut` (`+x`, `-x`, `+y`, `-y`, `+z`, `-z`) hatched, their rectangles pushed to `rects`. */
const cutBox = (key: string, min: V3, max: V3, cut: string, mat: THREE.Material, cutMat: THREE.Material, rects: Rect[], shadow = true) => {
  const has = (f: string) => cut.includes(f);
  const m = ['+x', '-x', '+y', '-y', '+z', '-z'].map((f) => (has(f) ? cutMat : mat));
  if (has('+x')) rects.push([[max[0], min[1], min[2]], [max[0], max[1], max[2]]]);
  if (has('-x')) rects.push([[min[0], min[1], min[2]], [min[0], max[1], max[2]]]);
  if (has('+y')) rects.push([[min[0], max[1], min[2]], [max[0], max[1], max[2]]]);
  if (has('+z')) rects.push([[min[0], min[1], max[2]], [max[0], max[1], max[2]]]);
  return (
    <mesh key={key} material={m} position={[(min[0] + max[0]) / 2, (min[1] + max[1]) / 2, (min[2] + max[2]) / 2]} castShadow={shadow} receiveShadow>
      <boxGeometry args={[max[0] - min[0], max[1] - min[1], max[2] - min[2]]} />
    </mesh>
  );
};

/** A tube along a polyline (right-angle runs, slightly rounded corners). */
const Pipe: React.FC<{points: V3[]; r: number; mat: THREE.Material; shadow?: boolean}> = ({points, r, mat, shadow = false}) => {
  const k = JSON.stringify([points, r]);
  const geo = useMemo(() => {
    const [pts, rr] = JSON.parse(k) as [V3[], number];
    const path = new THREE.CurvePath<THREE.Vector3>();
    for (let i = 0; i < pts.length - 1; i++) path.add(new THREE.LineCurve3(new THREE.Vector3(...pts[i]), new THREE.Vector3(...pts[i + 1])));
    return new THREE.TubeGeometry(path, Math.max(8, pts.length * 6), rr, 12, false);
  }, [k]);
  useEffect(() => () => geo.dispose(), [geo]);
  return <mesh geometry={geo} material={mat} castShadow={shadow} />;
};

/**
 * The § 5 "made by" glow on a flat face (an element's or a coil's cut face): an orange frame `e` thick round a w × h
 * rectangle centred at `c` (in the plane z, facing +z), and a soft halo plane behind it; both bloomed. `k` 0 → 1.
 */
export const GlowFrame: React.FC<{c: V3; w: number; h: number; k: number; e?: number; halo?: number}> = ({c, w, h, k, e = 0.008, halo = 0.25}) => {
  const mats = useMemo(
    () => ({
      edge: new THREE.MeshBasicMaterial({color: raw(HEAT_COLOR), transparent: true}),
      halo: new THREE.MeshBasicMaterial({color: raw(HEAT_COLOR), transparent: true, depthWrite: false}),
    }),
    [],
  );
  useEffect(() => () => Object.values(mats).forEach((m) => m.dispose()), [mats]);
  if (k < 0.01) return null;
  mats.edge.opacity = clamp01(k);
  mats.halo.opacity = halo * clamp01(k);
  return (
    <group position={c}>
      {(
        [
          [0, h / 2, w + e, e],
          [0, -h / 2, w + e, e],
          [w / 2, 0, e, h],
          [-w / 2, 0, e, h],
        ] as [number, number, number, number][]
      ).map(([x, y, a, b], i) => (
        <mesh key={i} position={[x, y, 0.003]} material={mats.edge} userData={{glow: true}} renderOrder={5}>
          <planeGeometry args={[a, b]} />
        </mesh>
      ))}
      {/* the halo: a band just outside the edge, never a fill (an orange tile would read as the part painted) */}
      {(
        [
          [0, h / 2 + 1.5 * e, w + 5 * e, 2 * e],
          [0, -h / 2 - 1.5 * e, w + 5 * e, 2 * e],
          [w / 2 + 1.5 * e, 0, 2 * e, h + e],
          [-w / 2 - 1.5 * e, 0, 2 * e, h + e],
        ] as [number, number, number, number][]
      ).map(([x, y, a, b], i) => (
        <mesh key={`h${i}`} position={[x, y, 0.002]} material={mats.halo} userData={{glow: true}} renderOrder={4}>
          <planeGeometry args={[a, b]} />
        </mesh>
      ))}
    </group>
  );
};

// ------------------------------------------------------------------------------------------------ N4 · the outdoor unit

export type OutdoorUnitProps = {
  /** The fan's turn (rad, `lockedSpin`) and the scroll's orbit (rad). */
  fanAngle: number;
  scrollAngle: number;
  /** The liquid's streaks in the cut tubes: their phase (s, the video clock) and strength 0 → 1 (0: the loop stopped). */
  flowClock: number;
  liquid: number;
  /** Boiling in the back coil's tubes, 0 → 1: bubbles rise, then the fill turns to vapour streaks. */
  boil: number;
  /** Snow settled on the stopped fan's grille, 0 → 1. */
  grilleSnow: number;
  /** × the ink weight (camera distance). */
  ink: number;
  /** The loop length (s) for the streaks' period (0: none). */
  loop: number;
  /** The mood's exposure: the liquid's flat colours are divided by it so they show as their tokens (default 1). */
  exposure?: number;
};

/** The back coil's tube rows (y), cut open lengthwise; the side coils' tubes (cut across) share them. */
const TUBE_ROWS = [0.26, 0.37, 0.48, 0.59, 0.7, 0.81, 0.92];

/** N4: the outdoor unit on its pad, cut through its middle (see the file comment). */
export const OutdoorUnit: React.FC<OutdoorUnitProps> = (p) => {
  const mats = useHouseMats();
  const rects: Rect[] = [];
  const zc = U.zc;
  const zb = U.zb;
  const parts: React.ReactNode[] = [];
  // the base pan and the top panel (a ring round the fan), cut at the unit's middle plane
  parts.push(cutBox('base', [U.x0, U.y0, zb], [U.x1, U.y0 + 0.06, zc], '+z', mats.panel, mats.cut, rects));
  parts.push(cutBox('topL', [U.x0, U.y1 - 0.05, zb], [U.x0 + 0.06, U.y1, zc], '+z', mats.panel, mats.cut, rects));
  parts.push(cutBox('topR', [U.x1 - 0.06, U.y1 - 0.05, zb], [U.x1, U.y1, zc], '+z', mats.panel, mats.cut, rects));
  parts.push(cutBox('topB', [U.x0 + 0.06, U.y1 - 0.05, zb], [U.x1 - 0.06, U.y1, zb + 0.05], '', mats.panel, mats.cut, rects));
  // the back corner posts
  parts.push(cutBox('pL', [U.x0, U.y0 + 0.06, zb], [U.x0 + 0.05, U.y1 - 0.05, zb + 0.05], '', mats.panel, mats.cut, rects));
  parts.push(cutBox('pR', [U.x1 - 0.05, U.y0 + 0.06, zb], [U.x1, U.y1 - 0.05, zb + 0.05], '', mats.panel, mats.cut, rects));
  // the side coils (finned slabs) cut across: their cut faces hatched, the tubes in section on them
  const cy0 = U.y0 + 0.08;
  const cy1 = U.y1 - 0.07;
  parts.push(cutBox('cL', [U.x0 + 0.02, cy0, zb + 0.05], [U.x0 + 0.02 + 0.07, cy1, zc], '+z', mats.fin, mats.cut, rects));
  parts.push(cutBox('cR', [U.x1 - 0.02 - 0.07, cy0, zb + 0.05], [U.x1 - 0.02, cy1, zc], '+z', mats.fin, mats.cut, rects));
  // the back coil slab
  parts.push(<mesh key="cB" position={[(U.x0 + U.x1) / 2, (cy0 + cy1) / 2, zb + 0.035]} material={mats.fin}>
    <boxGeometry args={[U.x1 - U.x0 - 0.2, cy1 - cy0, 0.05]} />
  </mesh>);
  // the dark inside behind the back coil's tubes
  parts.push(<mesh key="in" position={[(U.x0 + U.x1) / 2, (cy0 + cy1) / 2, zb + 0.062]} material={mats.inside}>
    <planeGeometry args={[U.x1 - U.x0 - 0.2, cy1 - cy0]} />
  </mesh>);
  const zcut = zc + 0.002;
  // tubes in section on the side coils' cut faces: a copper ring, the liquid's cut face, an ink edge
  const tubeR = 0.017;
  // the back coil's tubes, cut open lengthwise, are drawn ≈ 1.5× (🎭) so the liquid inside reads at 'fins' and 'tubes'
  const tubeRB = 0.026;
  const boilK = clamp01(p.boil);
  const sideTubes = [U.x0 + 0.055, U.x1 - 0.055].flatMap((x) =>
    TUBE_ROWS.map((y, i) => (
      <group key={`${x}-${i}`} position={[x, y, zcut]}>
        <mesh material={mats.copper}>
          <circleGeometry args={[tubeR, 16]} />
        </mesh>
        <mesh material={mats.coolant} position={[0, 0, 0.001]}>
          <circleGeometry args={[tubeR * 0.7, 16]} />
        </mesh>
        {/* boiling: the cut face shows a bubble in the liquid */}
        {boilK > 0.05 ? (
          <mesh material={mats.bubble} position={[tubeR * 0.15, tubeR * 0.2, 0.002]} scale={0.25 + 0.3 * boilK}>
            <circleGeometry args={[tubeR * 0.7, 12]} />
          </mesh>
        ) : null}
      </group>
    )),
  );
  // the back coil's tubes, cut open lengthwise (half tubes toward the camera): the liquid, its streaks, the boiling
  const bx0 = U.x0 + 0.1;
  const bx1 = U.x1 - 0.1;
  const bz = zb + 0.075;
  const len = bx1 - bx0;
  const per = loopPeriod(1.2, p.loop);
  // the liquid's flat colours show as their tokens under the post's exposure
  const ex = 0.95 / (p.exposure ?? 1);
  mats.coolantFill.color.copy(raw(CHARGE.coolant)).multiplyScalar(ex);
  mats.streak.color.copy(raw(CHARGE.coolantFlow)).multiplyScalar(ex);
  mats.vapour.color.copy(raw(CHARGE.coolantFlow)).multiplyScalar(ex);
  mats.bubble.color.copy(raw(CHARGE.coolantFlow)).multiplyScalar(ex);
  mats.streak.opacity = 0.95 * clamp01(p.liquid) * (1 - 0.6 * boilK);
  mats.vapour.opacity = 0.8 * clamp01(p.liquid) * boilK;
  mats.bubble.opacity = 0.9 * Math.min(1, boilK * 2);
  const backTubes = TUBE_ROWS.map((y, i) => {
    const dirn = i % 2 ? -1 : 1;
    const ph = mod(p.flowClock / per + i * 0.37, 1);
    return (
      <group key={i} position={[0, y, bz]}>
        <mesh material={mats.copper} position={[(bx0 + bx1) / 2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          {/* the back half of the tube (θ from π/2: the half away from the camera), the liquid in front of it */}
          <cylinderGeometry args={[tubeRB, tubeRB, len, 14, 1, true, Math.PI / 2, Math.PI]} />
        </mesh>
        {/* the liquid's cut face: flat `CHARGE.coolant` (unlit, so it reads as liquid, not lit metal) */}
        <mesh material={mats.coolantFill} position={[(bx0 + bx1) / 2, 0, 0.001]}>
          <planeGeometry args={[len, tubeRB * 1.8]} />
        </mesh>
        {/* liquid streaks: rounded `coolantFlow` pills moving along the tube (the serpentine's direction alternates) */}
        {[0, 1, 2].map((j) => {
          const u = mod(ph + j / 3, 1);
          const x = dirn > 0 ? bx0 + u * len : bx1 - u * len;
          const edge = Math.max(0.01, Math.min(1, u / 0.08, (1 - u) / 0.08));
          const h = tubeRB * 0.95;
          return (
            <group key={j} position={[x, 0, 0.003]} scale={[edge, edge, 1]}>
              <mesh material={mats.streak}>
                <planeGeometry args={[0.1, h]} />
              </mesh>
              {[-1, 1].map((sd) => (
                <mesh key={sd} material={mats.streak} position={[sd * 0.05, 0, 0]}>
                  <circleGeometry args={[h / 2, 12]} />
                </mesh>
              ))}
            </group>
          );
        })}
        {/* boiling: bubbles riding the tube, then long vapour streaks moving faster */}
        {boilK > 0.02
          ? [0, 1, 2, 3, 4, 5, 6].map((j) => {
              const u = mod(ph * 1.6 + j / 7 + 0.1 * i, 1);
              const x = dirn > 0 ? bx0 + u * len : bx1 - u * len;
              // bubbles as rings (a gas pocket in the liquid), growing along the tube; magnified so they read at 'tubes'
              const sz = tubeRB * (0.4 + 0.45 * u) * Math.min(1, boilK * 2);
              return (
                <mesh key={`b${j}`} material={mats.bubble} position={[x, (random(`hh-bub-${i}-${j}`) - 0.5) * tubeRB * 0.3, 0.004]}>
                  <ringGeometry args={[Math.max(0.0005, sz * 0.62), Math.max(0.001, sz), 16]} />
                </mesh>
              );
            })
          : null}
        {boilK > 0.4
          ? [0, 1].map((j) => {
              const u = mod(ph * 2.4 + j / 2, 1);
              const x = dirn > 0 ? bx0 + u * len : bx1 - u * len;
              return (
                <mesh key={`v${j}`} material={mats.vapour} position={[x, 0, 0.0035]}>
                  <planeGeometry args={[0.2, tubeRB * 1.1]} />
                </mesh>
              );
            })
          : null}
      </group>
    );
  });
  // the return bends at the ends of the back tubes (copper U-bends)
  const bends = TUBE_ROWS.slice(0, -1).map((y, i) => (
    <mesh key={i} material={mats.copper} position={[i % 2 ? bx0 - 0.005 : bx1 + 0.005, y + 0.055, bz]} rotation={[0, 0, i % 2 ? Math.PI / 2 : -Math.PI / 2]}>
      <torusGeometry args={[0.055, tubeRB * 0.8, 8, 12, Math.PI]} />
    </mesh>
  ));
  // the compressor: a dome cut in half on the unit's cut plane, its scroll (two spirals, one orbiting)
  const [cx, cyb, czz] = HOUSE.comp;
  const R = HOUSE.compR;
  const H = HOUSE.compH;
  const domeY = cyb + H;
  const scrollPts = (phase: number, off: [number, number]) =>
    [...Array(40).keys()].map((i) => {
      const a = (i / 39) * Math.PI * 3.2;
      const rr = 0.012 + (a / (Math.PI * 3.2)) * R * 0.72;
      return [cx + off[0] + rr * Math.cos(a + phase), cyb + H * 0.72 + off[1] + rr * Math.sin(a + phase), czz + 0.004] as V3;
    });
  const orb: [number, number] = [0.012 * Math.cos(p.scrollAngle), 0.012 * Math.sin(p.scrollAngle)];
  // the fan: three blades, a motor under the hub; the wire guard on top
  const blades = [0, 1, 2].map((i) => (
    <mesh key={i} material={mats.dark} position={[Math.cos((i / 3) * Math.PI * 2) * HOUSE.fanR * 0.5, 0, Math.sin((i / 3) * Math.PI * 2) * HOUSE.fanR * 0.5]} rotation={[0, -(i / 3) * Math.PI * 2, 0.35]}>
      <boxGeometry args={[HOUSE.fanR * 0.82, 0.006, 0.13]} />
    </mesh>
  ));
  const gs = clamp01(p.grilleSnow);
  return (
    <group>
      {/* the pad */}
      <mesh position={[(HOUSE.pad.x0 + HOUSE.pad.x1) / 2, HOUSE.pad.h / 2, (HOUSE.pad.z0 + HOUSE.pad.z1) / 2]} material={mats.concrete} castShadow receiveShadow>
        <boxGeometry args={[HOUSE.pad.x1 - HOUSE.pad.x0, HOUSE.pad.h, HOUSE.pad.z1 - HOUSE.pad.z0]} />
      </mesh>
      {parts}
      {sideTubes}
      {backTubes}
      {bends}
      {/* the wire guard over the side coils (a few dark bars) */}
      {[U.x0 - 0.004, U.x1 + 0.004].flatMap((x) =>
        [0.3, 0.5, 0.7, 0.9].map((y) => (
          <mesh key={`${x}${y}`} material={mats.dark} position={[x, y, (zb + zc) / 2]}>
            <boxGeometry args={[0.006, 0.006, zc - zb]} />
          </mesh>
        )),
      )}
      {/* the compressor: the far half of the dome and shell, the cut face with its scroll */}
      <mesh material={mats.dark} position={[cx, cyb + H / 2, czz]}>
        <cylinderGeometry args={[R, R, H, 28, 1, true, Math.PI / 2, Math.PI]} />
      </mesh>
      <mesh material={mats.dark} position={[cx, domeY, czz]} scale={[1, 0.55, 1]}>
        <sphereGeometry args={[R, 24, 12, Math.PI / 2, Math.PI, 0, Math.PI / 2]} />
      </mesh>
      <mesh material={mats.cut} position={[cx, cyb + H / 2, czz + 0.001]}>
        <planeGeometry args={[2 * R, H]} />
      </mesh>
      <mesh material={mats.cut} position={[cx, domeY, czz + 0.001]} scale={[1, 0.55, 1]}>
        <circleGeometry args={[R, 24, 0, Math.PI]} />
      </mesh>
      {/* inside the shell: the scroll chamber (dark), the fixed spiral (ink) and the orbiting one (galvanized) */}
      <mesh material={mats.inside} position={[cx, cyb + H * 0.72, czz + 0.002]}>
        <circleGeometry args={[R * 0.8, 24]} />
      </mesh>
      <InkLine points={scrollPts(0, [0, 0])} closed={false} thickness={0.007} />
      <InkLine points={scrollPts(Math.PI, orb)} closed={false} thickness={0.007} color={HIGHWAY.galvanized} />
      {/* the motor below the scroll (copper windings, unlit) */}
      <mesh material={mats.copper} position={[cx, cyb + H * 0.3, czz + 0.002]}>
        <planeGeometry args={[R * 1.3, H * 0.32]} />
      </mesh>
      <InkLine
        points={[
          [cx - R, cyb, czz + 0.003],
          [cx + R, cyb, czz + 0.003],
          [cx + R, cyb + H, czz + 0.003],
          ...[...Array(13).keys()].map((i) => {
            const a = (i / 12) * Math.PI;
            return [cx + R * Math.cos(a), domeY + R * 0.55 * Math.sin(a), czz + 0.003] as V3;
          }),
          [cx - R, cyb + H, czz + 0.003],
        ]}
        thickness={INK * p.ink}
      />
      {/* the terminal box on the shell (where the feed lands) */}
      <mesh geometry={roundedBox(0.07, 0.05, 0.04, 0.008)} material={mats.dark} position={[3.7, 0.6, 0.18]} />
      {/* the expansion valve on the liquid line by the coil's inlet, its distributor to the coil */}
      <mesh material={mats.brass} position={[3.66, 0.19, 0.15]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.022, 0.022, 0.06, 14]} />
      </mesh>
      <mesh geometry={roundedBox(0.04, 0.04, 0.04, 0.008)} material={mats.brass} position={[3.66, 0.225, 0.15]} />
      <Pipe
        points={[
          [3.66, 0.19, 0.15],
          [3.66, 0.19, -0.05],
          [bx0 + 0.02, 0.19, -0.05],
          [bx0 + 0.02, TUBE_ROWS[0], bz - 0.02],
        ]}
        r={0.007}
        mat={mats.copper}
      />
      {/* the service valves on the left side (where the line set leaves) */}
      {[0.27, 0.19].map((y, i) => (
        <mesh key={i} geometry={roundedBox(0.05, 0.05, 0.05, 0.01)} material={mats.brass} position={[U.x0 - 0.02, y, i ? 0.07 : 0.02]} />
      ))}
      {/* the fan on top: blades turning about the vertical, its motor, the wire guard */}
      <group position={[HOUSE.fan[0], U.y1 - 0.1, HOUSE.fan[2]]}>
        <group rotation={[0, -p.fanAngle, 0]}>
          {blades}
          <mesh material={mats.dark}>
            <cylinderGeometry args={[0.045, 0.045, 0.05, 16]} />
          </mesh>
        </group>
        <mesh material={mats.dark} position={[0, -0.09, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.14, 18]} />
        </mesh>
      </group>
      <group position={[HOUSE.fan[0], U.y1 + 0.005, HOUSE.fan[2]]}>
        {[0.13, 0.24, 0.35].map((r) => (
          <mesh key={r} material={mats.dark} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[r, 0.004, 6, 40]} />
          </mesh>
        ))}
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} material={mats.dark} rotation={[0, (i / 4) * Math.PI, 0]}>
            <boxGeometry args={[0.72, 0.006, 0.006]} />
          </mesh>
        ))}
        {/* snow settling on the still guard (a soft cap, then a thicker one) */}
        {gs > 0.01
          ? [...Array(24).keys()].map((i) => {
              // soft lumps settling on the guard's wires, one by one (seeded places, growing)
              const k = clamp01(gs * 24 - i * 0.75);
              if (k < 0.02) return null;
              const a = random(`hh-gs-a-${i}`) * Math.PI * 2;
              const r = 0.06 + 0.29 * random(`hh-gs-r-${i}`);
              return (
                <mesh key={i} material={mats.snowTop} position={[Math.cos(a) * r, 0.006, Math.sin(a) * r]} scale={[0.05 * k, 0.012 * k, 0.035 * k]}>
                  <sphereGeometry args={[1, 10, 6]} />
                </mesh>
              );
            })
          : null}
      </group>
      {/* snow on the top panel's rim and the pad's edges */}
      <mesh material={mats.snowTop} position={[(U.x0 + U.x1) / 2, U.y1 + 0.012, zb + 0.03]}>
        <boxGeometry args={[U.x1 - U.x0, 0.024, 0.06]} />
      </mesh>
      <CutOutline rects={rects} thickness={INK * p.ink} />
    </group>
  );
};

// ------------------------------------------------------------------------------------------------ N4 · line set, meter

/** N4: the line set (insulated vapour line, bare liquid line) and the suction line inside the unit. */
export const LineSet: React.FC = () => {
  const mats = useHouseMats();
  return (
    <group>
      <Pipe points={LINE_SET} r={0.03} mat={mats.foam} shadow />
      <Pipe points={LIQUID_LINE} r={0.009} mat={mats.copper} shadow />
      <Pipe points={SUCTION} r={0.016} mat={mats.copper} />
      {/* the coil's outlet header (vertical, at the right coil's back corner) */}
      <Pipe
        points={[
          [4.32, TUBE_ROWS[0], 0.14],
          [4.32, 0.86, 0.14],
        ]}
        r={0.015}
        mat={mats.copper}
      />
      {/* where the line set goes through the foundation wall: a sleeve */}
      <mesh material={mats.dark} position={[3.04, 0.27, 1.66]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 0.1, 16]} />
      </mesh>
    </group>
  );
};

/** N4: the electric meter (its dial turning slowly) and the disconnect on the right wall, the conduit and the whip. */
export const MeterDisconnect: React.FC<{meterTurns: number}> = ({meterTurns}) => {
  const mats = useHouseMats();
  const [mx, my, mz] = HOUSE.meter;
  const [dx, dy, dz] = HOUSE.disconnect;
  return (
    <group>
      {/* the meter: base, glass ring, dial, pointer (facing +x) */}
      <group position={[mx, my, mz]} rotation={[0, Math.PI / 2, 0]}>
        <mesh geometry={roundedBox(0.3, 0.42, 0.06, 0.02, 3)} material={mats.meterBox} position={[0, -0.04, 0.03]} castShadow />
        <mesh material={mats.galv} position={[0, 0, 0.085]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.05, 40]} />
        </mesh>
        <mesh material={mats.dial} position={[0, 0, 0.112]}>
          <circleGeometry args={[0.1, 40]} />
        </mesh>
        <group position={[0, 0, 0.116]} rotation={[0, 0, -meterTurns * Math.PI * 2]}>
          <mesh material={mats.ink} position={[0, 0.035, 0]}>
            <planeGeometry args={[0.012, 0.075]} />
          </mesh>
        </group>
        <mesh material={mats.glass} position={[0, 0, 0.122]}>
          <circleGeometry args={[0.112, 40]} />
        </mesh>
      </group>
      {/* the disconnect: a grey box with a pull-out lid */}
      <group position={[dx, dy, dz]} rotation={[0, Math.PI / 2, 0]}>
        <mesh geometry={roundedBox(0.26, 0.32, 0.1, 0.012, 3)} material={mats.conduit} position={[0, 0, 0.05]} castShadow />
        <mesh geometry={roundedBox(0.2, 0.08, 0.02, 0.006, 3)} material={mats.dark} position={[0, 0.06, 0.105]} />
      </group>
      {/* conduit: meter → disconnect → down the wall; the whip to the unit */}
      <Pipe points={FEED.slice(0, 4)} r={0.014} mat={mats.conduit} shadow />
      <Pipe points={FEED.slice(3)} r={0.012} mat={mats.cable} shadow />
    </group>
  );
};

// ------------------------------------------------------------------------------------------------ N3 · the air handler

export type AirHandlerProps = {
  blowerAngle: number;
  /** The A-coil running as the system ("made by" glow), 0 → 1. */
  coil: number;
  /** The backup strips running ("made by" glow), 0 → 1. */
  strips: number;
  ink: number;
};

/** N3: the air handler in the basement, cut by the house's section plane (see the file comment). */
export const AirHandler: React.FC<AirHandlerProps> = ({blowerAngle, coil, strips, ink}) => {
  const mats = useHouseMats();
  const rects: Rect[] = [];
  const z1 = HOUSE.zf;
  const zb = A.zb;
  const T = 0.025;
  const parts: React.ReactNode[] = [];
  // the cabinet: back, sides, base and top, cut on the section plane (the hatched ring)
  parts.push(cutBox('ahL', [A.x0, A.base, zb], [A.x0 + T, A.top, z1], '+z', mats.panel, mats.cut, rects));
  parts.push(cutBox('ahR', [A.x1 - T, A.base, zb], [A.x1, A.top, z1], '+z', mats.panel, mats.cut, rects));
  parts.push(cutBox('ahB', [A.x0, A.base, zb], [A.x1, A.base + T, z1], '+z', mats.panel, mats.cut, rects));
  parts.push(cutBox('ahK', [A.x0, A.base, zb], [A.x1, A.top, zb + T], '', mats.panel, mats.cut, rects));
  // the plenum on top and the trunk up to the floor (galvanized, cut on the section plane)
  const tx0 = AHX - 0.17;
  const tx1 = AHX + 0.17;
  const tzb = 1.72;
  parts.push(cutBox('plL', [A.x0, A.top, zb], [A.x0 + T, A.top + 0.1, z1], '+z', mats.galv, mats.cut, rects));
  parts.push(cutBox('plR', [A.x1 - T, A.top, zb], [A.x1, A.top + 0.1, z1], '+z', mats.galv, mats.cut, rects));
  parts.push(cutBox('plT0', [A.x0, A.top + 0.1, zb], [tx0, A.top + 0.1 + T, z1], '+z', mats.galv, mats.cut, rects));
  parts.push(cutBox('plT1', [tx1, A.top + 0.1, zb], [A.x1, A.top + 0.1 + T, z1], '+z', mats.galv, mats.cut, rects));
  parts.push(cutBox('trL', [tx0 - T, A.top + 0.1, tzb], [tx0, HOUSE.deckY, z1], '+z', mats.galv, mats.cut, rects));
  parts.push(cutBox('trR', [tx1, A.top + 0.1, tzb], [tx1 + T, HOUSE.deckY, z1], '+z', mats.galv, mats.cut, rects));
  parts.push(cutBox('trK', [tx0, A.top + 0.1, tzb - T], [tx1, HOUSE.deckY, tzb], '', mats.galv, mats.cut, rects));
  // the return: a duct from the cabinet's filter rack to the left, up to a floor return in the far corner
  const ry0 = A.base + 0.02;
  const ry1 = A.filter;
  // inside: dark, the filter, the A-coil, the blower, the strips
  const cy = (A.filter + A.coil) / 2;
  const coilH = A.coil - A.filter - 0.04;
  const slabW = 0.05;
  const zIn = zb + T + 0.002;
  const zf = z1 + 0.003;
  const coilFace = (side: -1 | 1) => {
    // one slab of the "A", leaning in toward the top
    const a = side * 0.32;
    return (
      <group key={side} position={[AHX + side * 0.13, cy, (zb + z1) / 2]} rotation={[0, 0, a]}>
        <mesh material={[mats.fin, mats.fin, mats.fin, mats.fin, mats.cut, mats.fin]}>
          <boxGeometry args={[slabW, coilH / Math.cos(a), z1 - zb - 2 * T]} />
        </mesh>
        {[...Array(6).keys()].map((i) => (
          <group key={i} position={[0, -coilH / 2 + ((i + 0.5) / 6) * coilH, (z1 - zb - 2 * T) / 2 + 0.002]}>
            <mesh material={mats.copper}>
              <circleGeometry args={[0.012, 12]} />
            </mesh>
            <mesh material={mats.coolant} position={[0, 0, 0.001]}>
              <circleGeometry args={[0.008, 12]} />
            </mesh>
          </group>
        ))}
      </group>
    );
  };
  const by = (A.coil + A.blower) / 2;
  const br = Math.min(0.17, (A.blower - A.coil) / 2 - 0.03);
  const sy = (A.blower + A.strips) / 2;
  const stripsH = A.strips - A.blower - 0.06;
  return (
    <group>
      {parts}
      <mesh position={[AHX, (A.base + A.top) / 2, zIn]} material={mats.inside}>
        <planeGeometry args={[A.x1 - A.x0 - 2 * T, A.top - A.base]} />
      </mesh>
      {/* the trunk's inside (dark) */}
      <mesh position={[AHX, (A.top + HOUSE.deckY) / 2 + 0.05, tzb + 0.002]} material={mats.inside}>
        <planeGeometry args={[tx1 - tx0, HOUSE.deckY - A.top - 0.1]} />
      </mesh>
      {/* the filter (a pleated pad on its rack) */}
      <mesh material={mats.filter} position={[AHX, (ry0 + ry1) / 2 + 0.03, (zb + z1) / 2]}>
        <boxGeometry args={[A.x1 - A.x0 - 2 * T - 0.01, 0.04, z1 - zb - 2 * T]} />
      </mesh>
      {[...Array(9).keys()].map((i) => (
        <mesh key={i} material={mats.ink} position={[A.x0 + T + ((i + 0.5) / 9) * (A.x1 - A.x0 - 2 * T), (ry0 + ry1) / 2 + 0.03, zf - 0.001]}>
          <planeGeometry args={[0.004, 0.035]} />
        </mesh>
      ))}
      {/* the A-coil: two finned slabs leaning together, tubes in section on their cut faces; its drain pan */}
      {coilFace(-1)}
      {coilFace(1)}
      <mesh material={mats.dark} position={[AHX, A.filter + 0.02, (zb + z1) / 2]}>
        <boxGeometry args={[A.x1 - A.x0 - 2 * T, 0.025, z1 - zb - 2 * T]} />
      </mesh>
      {[-1, 1].map((sd) => (
        <group key={sd} position={[AHX + sd * 0.13, cy, zf + 0.002]} rotation={[0, 0, sd * 0.32]}>
          <GlowFrame c={[0, 0, 0]} w={slabW} h={coilH / Math.cos(0.32)} k={coil} e={0.007 * Math.min(2, ink)} />
        </group>
      ))}
      {/* the blower: a squirrel-cage wheel seen end-on, turning; its scroll housing */}
      <group position={[AHX, by, (zb + z1) / 2]}>
        <mesh material={mats.dark} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[br + 0.025, br + 0.025, z1 - zb - 0.12, 30, 1, true]} />
        </mesh>
        <group rotation={[0, 0, blowerAngle]}>
          {[...Array(18).keys()].map((i) => {
            const a = (i / 18) * Math.PI * 2;
            return (
              <mesh key={i} material={mats.galv} position={[Math.cos(a) * br * 0.82, Math.sin(a) * br * 0.82, 0]} rotation={[0, 0, a + 0.5]}>
                <boxGeometry args={[0.005, br * 0.36, z1 - zb - 0.16]} />
              </mesh>
            );
          })}
          <mesh material={mats.dark} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[br * 0.4, br * 0.4, z1 - zb - 0.15, 20]} />
          </mesh>
          <mesh material={mats.galv} position={[br * 0.2, 0, (z1 - zb) / 2 - 0.06]}>
            <boxGeometry args={[br * 0.42, 0.01, 0.004]} />
          </mesh>
        </group>
      </group>
      {/* the backup strips: open wire coils on a ceramic frame, across the plenum */}
      <group position={[AHX, sy, (zb + z1) / 2]}>
        <mesh material={mats.ceramic} position={[0, 0, 0]}>
          <boxGeometry args={[A.x1 - A.x0 - 2 * T, 0.02, z1 - zb - 2 * T]} />
        </mesh>
        {[-1, 0, 1].map((r) => (
          <group key={r} position={[0, r * stripsH * 0.32, (z1 - zb) / 2 - 0.02]}>
            {[...Array(14).keys()].map((i) => (
              <mesh key={i} material={mats.galv} position={[-0.25 + (i / 13) * 0.5, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
                <torusGeometry args={[0.014, 0.0028, 6, 12]} />
              </mesh>
            ))}
          </group>
        ))}
      </group>
      <GlowFrame c={[AHX, sy, zf + 0.002]} w={0.52} h={stripsH} k={strips} e={0.007 * Math.min(2, ink)} />
      {/* the return duct: from the filter rack out to the left and up into the floor */}
      <Pipe
        points={[
          [A.x0 - 0.01, (ry0 + ry1) / 2, 1.62],
          [-2.45, (ry0 + ry1) / 2, 1.62],
          [-2.45, HOUSE.deckY, 1.62],
        ]}
        r={0.09}
        mat={mats.galv}
        shadow
      />
      {/* the panel on the wall and the strips' cable */}
      <group position={HOUSE.panel} rotation={[0, Math.PI / 2, 0]}>
        <mesh geometry={roundedBox(0.36, 0.56, 0.1, 0.01, 3)} material={mats.conduit} position={[0, 0, 0.05]} castShadow />
        <mesh material={mats.dark} position={[0, 0.0, 0.102]}>
          <planeGeometry args={[0.26, 0.4]} />
        </mesh>
      </group>
      <Pipe points={STRIP_FEED} r={0.011} mat={mats.cable} />
      <CutOutline rects={rects} thickness={INK * ink} />
    </group>
  );
};

/** The floor register (a grille in the floor over the trunk, its slats). */
export const Register: React.FC = () => {
  const mats = useHouseMats();
  const [x, y, z] = HOUSE.register;
  const [w, d] = HOUSE.registerSize;
  return (
    <group position={[x, y + 0.003, z]}>
      <mesh geometry={roundedBox(w + 0.04, 0.008, d + 0.04, 0.003)} material={mats.galv} />
      {[...Array(8).keys()].map((i) => (
        <mesh key={i} material={mats.dark} position={[-w / 2 + ((i + 0.5) / 8) * w, 0.005, 0]}>
          <boxGeometry args={[0.012, 0.004, d]} />
        </mesh>
      ))}
    </group>
  );
};

// ------------------------------------------------------------------------------------------------ N2 · the space heater

/** The small fan heater's size (CordCorner's `SpaceHeater`), before `HOUSE.heaterScale`. */
const HW = 0.2;
const HH = 0.27;
const HD = 0.15;

export type CutSpaceHeaterProps = {
  palette: MoodPalette;
  /** Power: the pilot lamp (flat `warning`) and the fan, 0 → 1. */
  power: number;
  /** The fan's turn (rad). */
  fanAngle: number;
  /** The element running as the system ("made by" glow), 0 → 1. */
  glow: number;
  ink: number;
};

/**
 * N2: the small ceramic fan heater (CordCorner's proportions), cut through its right side (local +x, toward the camera
 * when the scene turns it to face YOU): the plastic shell in section, the grille's slats at the front (+z), the ceramic
 * element (galvanized fins on a dark frame) behind them, the axial fan at the back, the pilot lamp and the knob. Origin
 * on the floor under its centre, local; the scene scales and turns it. The cord leaves at the back.
 */
export const CutSpaceHeater: React.FC<CutSpaceHeaterProps> = ({palette, power, fanAngle, glow, ink}) => {
  const mats = useHouseMats();
  const local = useMemo(
    () => ({
      plastic: new THREE.MeshStandardMaterial({roughness: 0.45}),
      dark: new THREE.MeshStandardMaterial({roughness: 0.5}),
      // the heater stands by the floor lamp: its cut faces read 251 at × 0.96, so × 0.9 on them (v0.18.13 Night whites)
      cut: (() => {
        const c = cutMaterial();
        c.color.multiplyScalar(0.9);
        return c;
      })(),
    }),
    [],
  );
  useEffect(() => () => Object.values(local).forEach((m) => m.dispose()), [local]);
  // a step under the palette's appliance tone: the grille's slats face the floor lamp and read 245–250 (v0.18.13)
  local.plastic.color.copy(raw(palette.appliance)).multiplyScalar(0.85);
  local.dark.color.copy(raw(palette.device));
  mats.lampOn.opacity = clamp01(power);
  const rects: Rect[] = [];
  const t = 0.008;
  const y0 = 0.02;
  const y1 = 0.02 + HH;
  const parts: React.ReactNode[] = [];
  // the shell's far half (x ≤ 0) with its cut face on x = 0: top, bottom, front frame, back, far side
  parts.push(cutBox('top', [-HW / 2, y1 - t, -HD / 2], [0, y1, HD / 2], '+x', local.plastic, local.cut, rects));
  parts.push(cutBox('bot', [-HW / 2, y0, -HD / 2], [0, y0 + t, HD / 2], '+x', local.plastic, local.cut, rects));
  parts.push(cutBox('back', [-HW / 2, y0, -HD / 2], [0, y1, -HD / 2 + t], '+x', local.plastic, local.cut, rects));
  parts.push(cutBox('frT', [-HW / 2, y1 - HH * 0.12, HD / 2 - t], [0, y1, HD / 2], '+x', local.plastic, local.cut, rects));
  parts.push(cutBox('frB', [-HW / 2, y0, HD / 2 - t], [0, y0 + HH * 0.25, HD / 2], '+x', local.plastic, local.cut, rects));
  parts.push(cutBox('far', [-HW / 2, y0, -HD / 2], [-HW / 2 + t, y1, HD / 2], '', local.plastic, local.cut, rects));
  const gy = y0 + HH * 0.58;
  const gh = HH * 0.6;
  return (
    <group>
      <mesh geometry={roundedBox(HW + 0.02, 0.02, HD + 0.02, 0.006, 4)} material={local.dark} position={[0, 0.01, 0]} castShadow receiveShadow />
      {parts}
      {/* the dark inside (its far wall) */}
      <mesh material={mats.inside} position={[-HW / 2 + t + 0.001, (y0 + y1) / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[HD - 2 * t, HH - 2 * t]} />
      </mesh>
      {/* the grille's slats at the front, cut (their ends on the cut plane) */}
      {[...Array(9).keys()].map((k) => (
        <mesh key={k} material={local.plastic} position={[-HW / 4, gy - gh / 2 + (k + 0.5) * (gh / 9), HD / 2 - 0.004]}>
          <boxGeometry args={[HW / 2, 0.0045, 0.008]} />
        </mesh>
      ))}
      {/* the ceramic element behind the grille: a dark frame, galvanized fins */}
      <mesh material={local.dark} position={[-HW / 4, gy, HD / 2 - 0.03]}>
        <boxGeometry args={[HW / 2, gh * 0.92, 0.03]} />
      </mesh>
      {[...Array(10).keys()].map((k) => (
        <mesh key={k} material={mats.galv} position={[-HW / 4 + 0.001, gy - gh * 0.42 + (k / 9) * gh * 0.84, HD / 2 - 0.03]}>
          <boxGeometry args={[HW / 2, 0.003, 0.026]} />
        </mesh>
      ))}
      <mesh material={local.cut} position={[0.001, gy, HD / 2 - 0.03]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.03, gh * 0.92]} />
      </mesh>
      {/* the element's glow, on its cut face (the side toward the camera) */}
      <group position={[0.004, gy, HD / 2 - 0.03]} rotation={[0, Math.PI / 2, 0]}>
        <GlowFrame c={[0, 0, 0]} w={0.03} h={gh * 0.92} k={glow} e={0.0035 * Math.min(2, ink)} halo={0.3} />
      </group>
      {/* the fan at the back (an axial fan seen edge-on: its hub, blades sweeping) and the motor */}
      <group position={[-HW / 4, gy, -HD / 2 + 0.045]}>
        <mesh material={local.dark} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.018, 0.018, 0.03, 14]} />
        </mesh>
        <group rotation={[0, 0, fanAngle]}>
          {[0, 1, 2, 3, 4].map((k) => (
            <mesh key={k} material={local.dark} rotation={[0, 0, (k / 5) * Math.PI * 2]} position={[0, 0, 0.005]}>
              <boxGeometry args={[0.012, gh * 0.42, 0.004]} />
            </mesh>
          ))}
        </group>
        <mesh material={local.dark} position={[0, 0, -0.025]}>
          <boxGeometry args={[0.035, 0.035, 0.025]} />
        </mesh>
      </group>
      {/* the pilot lamp on the front, under the grille: dark, then flat `warning` (never glows) */}
      <mesh position={[-HW * 0.3, y0 + HH * 0.13, HD / 2 + 0.0008]} material={mats.lampOff}>
        <circleGeometry args={[0.0055, 16]} />
      </mesh>
      <mesh position={[-HW * 0.3, y0 + HH * 0.13, HD / 2 + 0.0012]} material={mats.lampOn} visible={power > 0.01}>
        <circleGeometry args={[0.0055, 16]} />
      </mesh>
      {/* the knob on top */}
      <mesh position={[-HW * 0.22, y1 + 0.008, HD * 0.18]} material={local.dark} castShadow>
        <cylinderGeometry args={[0.016, 0.017, 0.016, 20]} />
      </mesh>
      <CutOutline rects={rects} thickness={(INK * ink) / HOUSE.heaterScale} />
    </group>
  );
};

/** The heater's cord: from its back along the floor to the outlet on the right wall, and the outlet plate. */
export const HeaterCord: React.FC = () => {
  const mats = useHouseMats();
  const pts = heaterFeed().slice(0, 5);
  const o = HOUSE.outlet;
  return (
    <group>
      <Pipe points={pts.map((q) => [q[0], q[1] - 0.018, q[2]] as V3)} r={0.006} mat={mats.cable} />
      <group position={o}>
        <mesh geometry={roundedBox(0.07, 0.11, 0.008, 0.003)} material={mats.plate} />
        <mesh geometry={roundedBox(0.03, 0.04, 0.03, 0.005)} material={mats.cable} position={[0, -0.02, 0.015]} />
      </group>
    </group>
  );
};

// ------------------------------------------------------------------------------------------------ snow on things

/** Snow on the ground's top around the house (left yard, right yard, behind), cut at the front; the driveway packed. */
export const GroundSnow: React.FC<{tracks?: boolean}> = ({tracks = true}) => {
  const mats = useHouseMats();
  const local = useMemo(
    () => ({
      packed: new THREE.MeshStandardMaterial({color: raw(WINTER.packed), roughness: 0.9}),
      track: new THREE.MeshStandardMaterial({color: raw(WINTER.slush), roughness: 0.5, transparent: true, opacity: 0.45, polygonOffset: true, polygonOffsetFactor: -2}),
    }),
    [],
  );
  useEffect(() => () => Object.values(local).forEach((m) => m.dispose()), [local]);
  const T = HOUSE.snowT;
  const H = HOUSE;
  const slab = (key: string, x0: number, x1: number, z0: number, z1: number, top: THREE.Material = mats.snow) => (
    <mesh key={key} material={[mats.snowShade, mats.snowShade, top, top, mats.snowShade, mats.snowShade]} position={[(x0 + x1) / 2, T / 2, (z0 + z1) / 2]} receiveShadow castShadow>
      <boxGeometry args={[x1 - x0, T, z1 - z0]} />
    </mesh>
  );
  return (
    <group>
      {slab('l', H.gx0, H.x0, H.gzb, H.zf)}
      {slab('b', H.x0, H.x1, H.gzb, H.zb)}
      {slab('r0', H.x1, H.pad.x0, H.gzb, H.zf)}
      {slab('r1', H.pad.x0, H.pad.x1, H.gzb, H.pad.z0)}
      {slab('r2', H.pad.x0, H.pad.x1, H.pad.z1, H.zf)}
      {slab('r3', H.pad.x1, H.drive.x0, H.gzb, H.zf)}
      {slab('d', H.drive.x0, H.drive.x1, H.gzb, H.zf, local.packed)}
      {tracks
        ? [-0.38, 1.22].map((z) => (
            <mesh key={z} material={local.track} position={[(H.drive.x0 + H.drive.x1) / 2, T + 0.001, z]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[H.drive.x1 - H.drive.x0, 0.24]} />
            </mesh>
          ))
        : null}
      {/* a few soft drifts against the house's right wall and the post */}
      {[...Array(7).keys()].map((i) => (
        <mesh key={i} material={mats.snowTop} position={[H.x1 + 0.12, T, -1.95 + i * 0.22]} scale={[0.22, 0.12 + 0.05 * (i % 3), 0.32]} castShadow>
          <sphereGeometry args={[1, 12, 8]} />
        </mesh>
      ))}
    </group>
  );
};
