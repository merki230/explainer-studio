import React from 'react';
import {type Mood} from '../../theme';
import {ease, keyedValue, type Keyed} from '../../scenes/keyframes';
import {arcPts, InkRibbons, OrangeDots, OrangeRibbons, type Stroke} from './inkStrokes';

type V3 = [number, number, number];
type P2 = [number, number];

// ---------------------------------------------------------------------------------------------------------------
// N3: the sensor lanes (phone-local units, `RealPhone`'s: 0.93 × 1.9)

export type LaneName = 'motion' | 'gps' | 'baro' | 'mic';
export const LANE_NAMES: LaneName[] = ['motion', 'gps', 'baro', 'mic'];

/**
 * The lanes' layout on the open phone (phone-local units; the board's top at `z`): each lane's centre height, its node dot
 * (x0), the reading's span (r0 → r1) and half-height (`amp`), the agree node at the sensor hub, and each part's centre.
 */
export const LANES = {
  ys: [0.335, -0.02, -0.38, -0.7],
  x0: -0.045,
  r0: -0.005,
  r1: 0.25,
  amp: 0.1,
  node: [0.345, -0.19] as P2,
  parts: {motion: [-0.235, 0.335], gps: [-0.29, -0.02], baro: [-0.29, -0.38], mic: [-0.29, -0.865]} as Record<LaneName, P2>,
  /** Where each part's lead meets its node dot (the part's right edge, or the mic port's top). */
  leadFrom: {motion: [-0.085, 0.335], gps: [-0.225, -0.02], baro: [-0.23, -0.38], mic: [-0.29, -0.82]} as Record<LaneName, P2>,
};

/**
 * The lanes' keys (seconds, on the clock passed in: the scene's). Each lane is ink while quiet and turns orange at its
 * `signAt` (default: the moment its sign lands), its node dot lit. Negative times start a lane already in that state
 * (the trace carried from an earlier scene).
 */
export type SensorLanesKeys = {
  /** The lanes draw on, one after another 0.15 s apart (0.3 s each). Default: already drawn. */
  drawAt?: number;
  /** The readings' scroll, lane widths a second (a constant or keys; 0 holds them, e.g. in a held instant). Default 0.3. */
  scroll?: Keyed;
  /** Lane 1: a small live road wiggle (default true), a sharp jolt spike at `spikeAt`, an ink full-scale tick at `scaleTickAt`. */
  motion?: {wiggle?: boolean; spikeAt?: number | null; signAt?: number | null; scaleTickAt?: number | null};
  /**
   * Lane 2: the speed, a 'high' plateau (default) or flat at 'zero'. `redrawAt`: the line clears and re-draws its recorded
   * window from the left over `redrawFor` (default 2.3 s); `cliffAt`: it drops off a cliff to zero there. Default sign:
   * 0.48 s after the cliff.
   */
  gps?: {level?: 'high' | 'zero'; redrawAt?: number | null; redrawFor?: number; cliffAt?: number | null; signAt?: number | null};
  /** Lane 3: flat; a smooth bump at `bumpAt` (the pressure change). */
  baro?: {bumpAt?: number | null; signAt?: number | null};
  /** Lane 4: dashed (off) until `onAt` (a small tick, then solid: listening; null: dashed throughout); a block of spikes at `burstAt`. */
  mic?: {onAt?: number | null; burstAt?: number | null; signAt?: number | null};
  /** The agree node draws on (an empty ink ring). Default: 0.8 s after the lanes. */
  nodeAt?: number | null;
  /** The four lanes' ends run on to the node (orange, 0.3 s) and it lights orange with one pulse (0.3 s), and holds. */
  agreeAt?: number | null;
  /** One-shot ink pulses of the node's empty ring (0.4 s). */
  nodePulses?: number[];
  /** A short orange line from the node up to the phone's top edge (0.3 s). */
  sendAt?: number | null;
  /** One-shot ink swells of a lane (its line and node ring, 0.5 s). */
  swell?: {lane: LaneName; at: number}[];
  /** Everything fades out (0.3 s). */
  fadeAt?: number | null;
};

const shot = (times: number[] | undefined, t: number, dur: number) =>
  (times ?? []).reduce((m, a) => (t >= a && t <= a + dur ? Math.max(m, Math.sin((Math.PI * (t - a)) / dur)) : m), 0);

/** The scroll's phase (lane widths) at t: ∫ scroll dt from 0. */
const scrollPhase = (k: Keyed | undefined, t: number) => {
  if (k === undefined || typeof k === 'number') return (k ?? 0.3) * t;
  const h = 1 / 60;
  let a = 0;
  const sg = t < 0 ? -1 : 1;
  for (let x = 0; x < Math.abs(t); x += h) a += keyedValue(k, sg * (x + Math.min(h, Math.abs(t) - x) / 2), 0.3) * Math.min(h, Math.abs(t) - x);
  return sg * a;
};

/** When each lane's sign lands (its turning orange), or null. */
export const laneSignAt = (k: SensorLanesKeys, lane: LaneName): number | null => {
  if (lane === 'motion') return k.motion?.signAt ?? k.motion?.spikeAt ?? null;
  if (lane === 'gps') return k.gps?.signAt ?? (k.gps?.cliffAt != null ? k.gps.cliffAt + 0.48 : null);
  if (lane === 'baro') return k.baro?.signAt ?? k.baro?.bumpAt ?? null;
  return k.mic?.signAt ?? k.mic?.burstAt ?? null;
};

/** A part's centre (phone-local units, on the board), for a callout's leader: 'motion', 'gps', 'baro', 'mic', 'agree'. */
export const lanePartPoint = (name: LaneName | 'agree', z: number): V3 =>
  name === 'agree' ? [LANES.node[0], LANES.node[1], z] : [LANES.parts[name][0], LANES.parts[name][1], z];

/**
 * The jolt's shape (x in spike widths): a sharp rise and fall, then a shallow dip back to the line. Mostly above the line,
 * so a spike on a flat reading never reads as a cross or plus (F14).
 */
const spikeShape = (x: number) =>
  x < -1 ? 0 : x < 0 ? 1 + x : x < 0.55 ? 1 - 2.1 * x : x < 1.2 ? -0.155 * (1 - (x - 0.55) / 0.65) : 0;

/**
 * N3: the four lanes on an open phone (mount inside the phone's local frame, e.g. as `PhoneTeardown`'s child). `t` is the
 * keys' clock, `unitPerPx` the phone units one screen pixel spans (so the strokes keep their on-screen weight), `z` the
 * drawing's height over the board, `opacity` the reveal (the front lifting off).
 */
export const SensorLanes: React.FC<{keys: SensorLanesKeys; t: number; unitPerPx: number; mood: Mood; z: number; opacity?: number; onTop?: boolean}> = ({
  keys: k,
  t,
  unitPerPx,
  mood,
  z,
  opacity = 1,
  onTop = true,
}) => {
  const L = LANES;
  const N: V3 = [0, 0, 1];
  const fade = (k.fadeAt == null ? 1 : 1 - ease(t, k.fadeAt, k.fadeAt + 0.3)) * opacity;
  const drawAt = k.drawAt ?? -10;
  const ph = scrollPhase(k.scroll, t);
  const since = (a: number) => ph - scrollPhase(k.scroll, a);
  const X = (u: number) => L.r0 + u * (L.r1 - L.r0);
  const P = (i: number, u: number, v: number): V3 => [X(u), L.ys[i] + v * L.amp, z];
  const NOW = 0.8;
  const ink: Stroke[] = [];
  const orange: Stroke[] = [];
  const inkRings: Stroke[] = [];
  const dots: {c: V3; r: number; alpha?: number}[] = [];
  const nodeAt = k.nodeAt === undefined ? drawAt + 0.8 : k.nodeAt;
  const nodeK = nodeAt === null ? 0 : ease(t, nodeAt, nodeAt + 0.3);
  const agreeAt = k.agreeAt ?? null;
  const agree = agreeAt === null ? 0 : ease(t, agreeAt, agreeAt + 0.3);
  const lit = agreeAt !== null && t >= agreeAt;

  LANE_NAMES.forEach((name, i) => {
    const d0 = drawAt + 0.15 * i;
    const draw = ease(t, d0, d0 + 0.3);
    if (draw <= 0.001) return;
    const sign = laneSignAt(k, name);
    const on = sign === null ? 0 : ease(t, sign, sign + 0.15);
    const sw = 1 + 0.8 * shot((k.swell ?? []).filter((s) => s.lane === name).map((s) => s.at), t, 0.5);
    const y = L.ys[i];
    // the part's lead to its node dot, the dot (ink ring → orange disc), the baseline
    const [lx, ly] = L.leadFrom[name];
    const lead: V3[] = name === 'mic' ? [[lx, ly, z], [lx, y, z], [L.x0 - 0.024, y, z]] : [[lx, ly, z], [L.x0 - 0.024, y, z]];
    ink.push({pts: lead, alpha: draw});
    const nr = 0.024 * (1 + 0.5 * (sw - 1));
    if (on < 0.999) inkRings.push({pts: arcPts([L.x0, y, z], nr, [1, 0, 0], [0, 1, 0]), alpha: draw * (1 - on), width: sw});
    if (on > 0.001) dots.push({c: [L.x0, y, z + 0.002], r: 0.026 * (1 + 0.5 * shot(sign === null ? [] : [sign], t, 0.3)), alpha: on});
    if (name !== 'mic') {
      // the motion lane's baseline breaks round its spike, so the two never cross (F14: no plus or X)
      const sp = name === 'motion' ? (k.motion?.spikeAt ?? null) : null;
      const us = sp !== null && t >= sp ? NOW - since(sp) : null;
      const gap = 0.06;
      if (us !== null && us > -gap && us < draw + gap) {
        if (X(us - gap) > L.x0 + 0.024) ink.push({pts: [[L.x0 + 0.024, y, z], [Math.min(X(draw), X(us - gap)), y, z]], alpha: 1});
        if (us + gap < draw) ink.push({pts: [[X(us + gap), y, z], [X(draw), y, z]], alpha: 1});
      } else ink.push({pts: [[L.x0 + 0.024, y, z], [X(draw), y, z]], alpha: 1});
    }
    // the reading
    const n = 72;
    const head = draw;
    const lineCol = (pts: V3[], a = 1, w = sw) => {
      if (on < 0.999) ink.push({pts, alpha: a * (1 - on), width: w});
      if (on > 0.001) orange.push({pts, alpha: a * on});
    };
    if (name === 'motion') {
      const wig = k.motion?.wiggle ?? true;
      const sp = k.motion?.spikeAt ?? null;
      const us = sp === null ? -9 : NOW - since(sp);
      const grow = sp === null ? 0 : ease(t, sp, sp + 0.06);
      const pts: V3[] = [];
      for (let j = 0; j <= n; j++) {
        const u = (head * j) / n;
        const q = u + ph;
        let v = wig ? 0.16 * Math.sin(2 * Math.PI * 2.3 * q) + 0.09 * Math.sin(2 * Math.PI * 5.7 * q + 1) + 0.05 * Math.sin(2 * Math.PI * 11.3 * q + 2) : 0;
        v *= 1 - 0.85 * grow * Math.exp(-(((u - us) / 0.12) ** 2));
        pts.push(P(i, u, v));
      }
      // the spike drawn with its own vertices so it stays sharp
      if (grow > 0 && us > -0.05 && us < head + 0.05) {
        const W = 0.03;
        const sp2: V3[] = [];
        for (let j = -12; j <= 20; j++) {
          const x = j / 10;
          const u = us + x * W;
          if (u < 0 || u > head) continue;
          sp2.push(P(i, u, 1.0 * grow * spikeShape(x)));
        }
        // merge: cut the sampled line round the spike
        const left = pts.filter((p) => p[0] < X(us - 1.05 * W));
        const right = pts.filter((p) => p[0] > X(us + 1.65 * W));
        lineCol([...left, ...sp2, ...right]);
      } else lineCol(pts);
      const st = k.motion?.scaleTickAt ?? null;
      if (st !== null && t >= st) {
        const a = ease(t, st, st + 0.2);
        ink.push({pts: [P(i, 0.7, 1.08), P(i, 0.7 + 0.18 * a, 1.08)], alpha: 1});
      }
    } else if (name === 'gps') {
      const g = k.gps ?? {};
      const level = (g.level ?? 'high') === 'high' ? 0.55 : 0;
      const ra = g.redrawAt ?? null;
      const rf = g.redrawFor ?? 2.3;
      const redrawing = ra !== null && t >= ra;
      const hd = redrawing ? Math.min(head, Math.max(0, (t - ra!) / rf)) : head;
      const cl = g.cliffAt ?? null;
      const uc = cl === null || t < cl ? 9 : ra !== null ? Math.max(0, (cl - ra) / rf) : NOW - since(cl);
      const pts: V3[] = [];
      for (let j = 0; j <= n; j++) {
        const u = (hd * j) / n;
        const q = u + (redrawing ? 0 : ph);
        const ripple = level > 0 ? 0.025 * Math.sin(2 * Math.PI * 4.1 * q) + 0.015 * Math.sin(2 * Math.PI * 9.7 * q + 0.5) : 0.012 * Math.sin(2 * Math.PI * 7.3 * q);
        const v = u < uc ? level + ripple : u < uc + 0.02 ? (level + ripple) * (1 - (u - uc) / 0.02) : 0.012 * Math.sin(2 * Math.PI * 7.3 * q);
        pts.push(P(i, u, v));
      }
      if (hd > 0.001) lineCol(pts);
    } else if (name === 'baro') {
      const b = k.baro?.bumpAt ?? null;
      const ub = b === null ? -9 : NOW - since(b);
      const grow = b === null ? 0 : ease(t, b, b + 0.25);
      const pts: V3[] = [];
      for (let j = 0; j <= n; j++) {
        const u = (head * j) / n;
        const q = u + ph;
        const v = 0.025 * Math.sin(2 * Math.PI * 3.3 * q) + 0.7 * grow * Math.exp(-(((u - ub) / 0.07) ** 2));
        pts.push(P(i, u, v));
      }
      lineCol(pts);
    } else {
      const mk = k.mic ?? {};
      const onAt = mk.onAt ?? null;
      const ut = onAt === null || t < onAt ? 9 : NOW - since(onAt);
      // dashed while off (≈ 16 px dashes, 10 px gaps on screen), solid from the tick
      const dashU = (16 * unitPerPx) / (L.r1 - L.r0);
      const gapU = (10 * unitPerPx) / (L.r1 - L.r0);
      const dEnd = Math.min(head, ut);
      for (let u = 0; u < dEnd; u += dashU + gapU) lineCol([P(i, u, 0), P(i, Math.min(dEnd, u + dashU), 0)]);
      if (ut < head) {
        const burst = mk.burstAt ?? null;
        const ub = burst === null ? -9 : NOW - since(burst);
        const bk = burst === null ? 0 : ease(t, burst, burst + 0.08);
        const pts: V3[] = [];
        const u0 = Math.max(0, ut);
        const steps = 60;
        for (let j = 0; j <= steps; j++) {
          const u = u0 + ((head - u0) * j) / steps;
          if (bk > 0 && Math.abs(u - ub) < 0.07) continue;
          pts.push(P(i, u, 0.04 * Math.sin(2 * Math.PI * 13 * (u + ph))));
        }
        if (bk > 0 && ub > -0.07 && ub < head + 0.07) {
          // a short block of spikes (no speech-like waveform): alternating, seeded heights
          const blk: V3[] = [];
          for (let j = 0; j <= 12; j++) {
            const u = ub - 0.066 + j * 0.011;
            if (u < u0 || u > head) continue;
            const a = j === 0 || j === 12 ? 0 : (0.55 + 0.4 * Math.abs(Math.sin(j * 2.7))) * (j % 2 ? 1 : -1);
            blk.push(P(i, u, a * bk));
          }
          const left = pts.filter((p) => p[0] < X(ub - 0.066));
          const right = pts.filter((p) => p[0] > X(ub + 0.066));
          lineCol(left);
          lineCol(blk);
          lineCol(right);
        } else lineCol(pts);
        // the small tick where listening began (ink)
        if (ut >= 0 && ut <= head) ink.push({pts: [P(i, ut, -0.3), P(i, ut, 0.3)], alpha: 1, width: sw});
      }
    }
    // the leg on to the agree node: ink once the node is drawn, orange from `agreeAt`
    if (nodeK > 0.001) {
      const a: V3 = [L.r1, y, z];
      const b: V3 = [L.node[0], L.node[1], z];
      const mid = (f: number): V3 => [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, z];
      ink.push({pts: [a, mid(nodeK)], alpha: 1 - agree});
      if (agree > 0.001) orange.push({pts: [a, mid(agree)], alpha: 1});
    }
  });
  // the agree node: an empty ink ring drawn on, ink pulses; orange once they all agree
  if (nodeK > 0.001) {
    const pulse = 1 + 0.35 * shot(k.nodePulses, t, 0.4);
    const c: V3 = [L.node[0], L.node[1], z];
    if (!lit || agree < 1) inkRings.push({pts: arcPts(c, 0.042 * pulse, [0, 1, 0], [-1, 0, 0], 0, Math.PI * 2 * nodeK, 56), alpha: 1 - (lit ? agree : 0), width: pulse > 1.01 ? 1.4 : 1});
    if (lit) dots.push({c: [c[0], c[1], z + 0.002], r: 0.045 * (1 + 0.6 * shot([agreeAt!], t, 0.3)), alpha: agree});
  }
  const send = k.sendAt == null ? 0 : ease(t, k.sendAt, k.sendAt + 0.3);
  if (send > 0.001) orange.push({pts: [[L.node[0], L.node[1] + 0.05, z], [L.node[0], L.node[1] + 0.05 + (0.92 - L.node[1] - 0.05) * send, z]]});
  if (fade <= 0.003) return null;
  return (
    <group>
      <InkRibbons strokes={[...ink, ...inkRings]} unitPerPx={unitPerPx} normal={N} mood={mood} opacity={fade} onTop={onTop} renderOrder={30} />
      <OrangeRibbons strokes={orange} unitPerPx={unitPerPx} normal={N} opacity={fade} onTop={onTop} renderOrder={34} />
      <OrangeDots dots={dots.map((d) => ({...d, alpha: (d.alpha ?? 1) * fade}))} normal={N} onTop={onTop} />
    </group>
  );
};

