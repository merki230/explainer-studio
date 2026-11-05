import React, {useMemo} from 'react';
import {AbsoluteFill, random, useCurrentFrame, useVideoConfig} from 'remotion';
import * as THREE from 'three';
import {CAST, EXTRA_B, LAB, MOODS, REAL, section, TOWER, type CastLook, type Mood} from '../theme';
import {raw, roundedBox} from '../three/plaster';
import {OrangeLight} from '../three/OrangePath';
import {Figure} from '../three/section/Figure';
import type {Gesture} from '../three/rig';
import {GlowNode, GlowSegment, NODE_SCALE, pointAlong, polylineLength} from '../three/section/GlowLines';
import {INK} from '../three/section/cutLook';
import {
  formatOf,
  projectToFrame,
  SectionCamera,
  sectionCameraAt,
  useFormatProps,
  widenFraming,
  type Framing,
} from '../three/section/SectionCamera';
import {SectionLights, SectionStage} from '../three/section/SectionStage';
import {skyTexture} from '../three/section/textures';
import {ease, framingAtKeys, type CameraKey} from './keyframes';
import {Chair, Desk, Monitor, OfficeBlock, Plant, useOfficeMats, type OfficeMats} from './ReportSliceScene';

/*
 * B, the records sheet (No. 015 N4): two cut-open sections stacked on one sheet at the fixed angle, sky between them
 * (the No. 012 data-chain grammar). Bottom: a server room ("the cloud"): two generic racks of **record slabs** (each slab
 * a dark tray carrying two separate pieces, a plate piece and a label piece, each with its own depth, never a decal on a
 * face), neutral status LEDs, a floor cooling unit; the floor slab's front cut face carries the **retention ruler**.
 * Top: a plain office: a desk, a monitor turned to the extra sitting at it (read only in the detail box), keyboard,
 * mouse, a plant. No wall text, flag, badge, uniform or logo anywhere.
 *
 * The hidden system (orange, § 5): the path in from the bottom edge (the `follow` from the street) → the rack (node dot)
 * → the monitor (node dot), pulses up it, a query pulse down and back; lit record pieces (matches, the slab just saved);
 * the ruler (an orange line 25 mm proud of the cut face, a tick per day, its lit end sliding to the current `days`,
 * batches of small slabs riding along it a tick per step and fading past the end). Everything else neutral.
 *
 * World: metres; x across, y up, z toward the camera. The server room's floor at y 0, the office's at `officeY`.
 * Times are seconds into the scene (keys may lie outside it).
 */

type V3 = [number, number, number];

export type RecordsFraming = 'chain' | 'racks' | 'ruler' | 'desk' | 'deskRuler';

/** The path: leg 1 in from the bottom edge → the rack, leg 2 the rack → the monitor. Seconds into the scene. */
export type RecordsPath = {
  /** Leg 1 starts drawing up from below the frame (default −10: already drawn). */
  at?: number;
  /** Leg 1 reaches the rack (its node dot lights). Default `at` + 0.8. */
  rackAt?: number;
  /** Leg 2 starts up out of the rack. Default `rackAt` + 0.3. */
  leg2At?: number;
  /** Leg 2 reaches the monitor (its node dot lights). Default `leg2At` + 1.2. */
  deskAt?: number;
  /** Pulses run up from the bottom edge from this time (default none), every `pulseEvery` s (default 1.1), until `until`. */
  pulsesAt?: number | null;
  pulseEvery?: number;
  until?: number | null;
};

/** The retention ruler on the server room's floor slab (§ 5 ruler: 30 day ticks, the lit end at `days`). */
export type RecordsRuler = {
  /** The line draws along the cut face from tick 0 (1.0 s), ticks lighting in turn. Default −10 (drawn). */
  at?: number;
  /** The lit end, in days: keys (the end slides over 0.8 s, eased). Default 30. */
  days?: {at: number; days: number}[];
  /** Ticks on the ruler (default 30). */
  ticks?: number;
  /** Batches of small slabs ride along it, a tick per step, from this time (default null: no batches). */
  batchesAt?: number | null;
  /** Seconds a step (default 0.6: a time-lapse, 🎭). */
  step?: number;
};

export type RecordsSliceSceneProps = {
  durationInFrames: number;
  /** Day (default) or Night. */
  mood?: Mood;
  /** Framing preset (default 'chain'); see `recordsFramings`. */
  framing?: RecordsFraming;
  camera?: {from: Framing; to?: Framing};
  cameraKeys?: CameraKey[];
  /** Push toward the subject, units/s (default 0.04). */
  push?: number;
  /** Idle sideways drift, ± units (default 0.08). */
  drift?: number;
  /** The office floor's height (default 4.6: 1.4 m of sky between the sections). */
  officeY?: number;
  /** Record slabs a rack (default 12; ≤ 13). Slab n = rack ⌊n / rows⌋, row n mod rows (row 0 at the bottom). */
  rows?: number;
  /** The path (see `RecordsPath`). Default none. */
  path?: RecordsPath | null;
  /** A slab slides into its slot (0.5 s) at `at`; its pieces light (saved). Default none. */
  slotIn?: {at: number; slab?: number} | null;
  /** Slabs light up (both pieces, 0.2 s) from `at`, until `until` (default: stay lit). */
  matches?: {at: number; slabs: number[]; until?: number}[];
  /** These slabs' plate pieces go dark from `at` (0.3 s); their label pieces stay as they are. */
  plateDark?: {at: number; slabs: number[]}[];
  /** One-shot swells of every lit label piece (0.5 s). */
  labelPulses?: number[];
  /** A query pulse runs from the monitor down to the rack (1.0 s) and back up (1.0 s, leaving 0.3 s after it arrives). */
  query?: number[];
  /** The retention ruler (see `RecordsRuler`). Default none. */
  ruler?: RecordsRuler | null;
  /** The extra types (hands on the keyboard) in these windows (s). */
  typing?: {from: number; to: number}[];
  /** The extra leans in toward the screen (held 1.5 s). */
  leanAt?: number[];
  /** The extra's near hand goes to the mouse and clicks (held 1.2 s). */
  mouseAt?: number[];
  /** The extra's look: 'a' (`CAST.extra`, default) or 'b' (`EXTRA_B`). Plain clothes, no uniform or badge. */
  look?: 'a' | 'b';
  location?: string;
  transition?: 'auto' | 'continue' | 'glide' | 'cut' | 'dissolve' | 'slide' | 'follow';
  follow?: {direction?: 'down' | 'up' | 'left' | 'right'; at?: number};
  glide?: number;
  /** Set by Explainer. */
  startFrame?: number;
  cameraFrom?: Framing;
  cameraGlide?: number;
};

// ---------------------------------------------------------------- layout

const ROOM = {w: 4.2, d: 2.6};
const FRONT = ROOM.d / 2;
const RACK = {w: 0.6, d: 0.9, h: 2.0, x: [0.25, 0.95] as number[], z: -0.35};
const ROW0 = 0.16;
const PITCH = 0.135;
/** A slab's tray and its two pieces (front faces, m). */
const TRAY = {w: 0.5, h: 0.1, proud: 0.015};
const PLATE_P = {w: 0.13, h: 0.05, d: 0.012, x: -0.155};
const LABEL_P = {w: 0.23, h: 0.05, d: 0.008, x: 0.05};
/** Office furniture (room-local; the extra sits at `fig` facing +x). */
const OFFICE = {
  fig: [-0.68, 0, -0.25] as V3,
  desk: {x: 0.0, z: -0.28, w: 0.7, d: 1.46, h: 0.74},
  monitor: [0.2, 0.74, -0.3] as V3,
  keyboard: [-0.18, 0.755, -0.27] as V3,
  mouse: [-0.16, 0.755, 0.08] as V3,
  plant: [1.55, 0, -0.9] as V3,
};
const RULER = {x0: -1.95, x1: 1.95, y: -0.07, proud: 0.025, tick: 0.07};

const officeYOf = (p: Partial<RecordsSliceSceneProps>) => p.officeY ?? 4.6;
const rowsOf = (p: Partial<RecordsSliceSceneProps>) => Math.max(4, Math.min(13, p.rows ?? 12));
const rackFront = () => RACK.z + RACK.d / 2;

/** A slab's front centre (world). */
export const slabPos = (p: Partial<RecordsSliceSceneProps>, n: number): V3 => {
  const rows = rowsOf(p);
  const r = Math.max(0, Math.min(1, Math.floor(n / rows)));
  const i = n % rows;
  return [RACK.x[r], ROW0 + i * PITCH + TRAY.h / 2, rackFront() + TRAY.proud];
};

/** The two legs of the path (world). */
export const recordsPathPoints = (p: Partial<RecordsSliceSceneProps>): {leg1: V3[]; leg2: V3[]} => {
  const oy = officeYOf(p);
  const zf = FRONT + 0.03;
  const xr = RACK.x[0] - RACK.w / 2 - 0.035;
  const rz = rackFront() + 0.02;
  const node: V3 = [xr, 1.05, rz];
  const deskZ = OFFICE.desk.z + OFFICE.desk.d / 2 + 0.02;
  const mx = OFFICE.monitor[0] - 0.2;
  return {
    leg1: [
      [xr, -14, zf],
      [xr, 0.012, zf],
      [xr, 0.012, rz],
      node,
    ],
    leg2: [
      node,
      [xr, RACK.h + 0.02, rz],
      [xr, RACK.h + 0.02, zf],
      [xr, oy + 0.012, zf],
      [mx, oy + 0.012, zf],
      [mx, oy + 0.012, deskZ],
      [mx, oy + OFFICE.desk.h + 0.012, deskZ],
      [mx, oy + OFFICE.desk.h + 0.02, OFFICE.monitor[2] + 0.12],
    ],
  };
};

const pathKeys = (path: RecordsPath) => {
  const at = path.at ?? -10;
  const rackAt = path.rackAt ?? at + 0.8;
  const leg2At = path.leg2At ?? rackAt + 0.3;
  const deskAt = path.deskAt ?? leg2At + 1.2;
  return {
    at,
    rackAt,
    leg2At,
    deskAt,
    pulsesAt: path.pulsesAt ?? null,
    pulseEvery: Math.max(0.3, path.pulseEvery ?? 1.1),
    until: path.until ?? Infinity,
  };
};

/** The ruler's lit end in days at t (keys slide over 0.8 s). */
export const rulerDays = (r: RecordsRuler | null | undefined, t: number) => {
  let v = r?.days?.length ? [...r.days].sort((a, b) => a.at - b.at)[0].days : 30;
  for (const k of [...(r?.days ?? [])].sort((a, b) => a.at - b.at)) {
    if (t < k.at) break;
    v = v + (k.days - v) * ease(t, k.at, k.at + 0.8);
  }
  return v;
};
const rulerX = (r: RecordsRuler | null | undefined, day: number) => {
  const n = r?.ticks ?? 30;
  return RULER.x0 + ((RULER.x1 - RULER.x0) * day) / n;
};

// ---------------------------------------------------------------- camera

/** The framings at the fixed angle (set on test stills). */
export const recordsFramings = (p: Partial<RecordsSliceSceneProps> = {}): Record<RecordsFraming, Framing> => {
  const oy = officeYOf(p);
  return {
    chain: {look: [0.3, (oy + 2.7) / 2 - 0.3, 0.1], distance: 25},
    racks: {look: [0.6, 1.05, 0.1], distance: 8.5},
    ruler: {look: [-0.1, -0.3, 0.9], distance: 16},
    desk: {look: [0.1, oy + 2.0, -0.05], distance: 10.5},
    deskRuler: {look: [0.1, oy / 2 + 0.2, 0.3], distance: 18},
  };
};
const RECORDS_WIDE: Record<RecordsFraming, number> = {chain: 1.5, racks: 1.3, ruler: 1.3, desk: 1.3, deskRuler: 1.4};

const recordsCameraMove = (p: Partial<RecordsSliceSceneProps>, durationInFrames: number, fps: number, frame?: number) => {
  const name = p.framing ?? 'chain';
  const preset = widenFraming(recordsFramings(p)[name], formatOf(p), RECORDS_WIDE[name]);
  if (p.cameraKeys && p.cameraKeys.length) {
    const f = framingAtKeys(p.cameraKeys, p.camera?.from ?? p.cameraFrom ?? preset, frame === undefined ? Infinity : frame / fps);
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

export const recordsCameraStart = (p: Partial<RecordsSliceSceneProps>, d: number, fps: number): Framing =>
  recordsCameraMove({...p, cameraFrom: undefined, cameraGlide: undefined}, d, fps, 0).from;
export const recordsCameraEnd = (p: Partial<RecordsSliceSceneProps>, d: number, fps: number): Framing =>
  recordsCameraMove(p, d, fps).to;

const recordsCameraAt = (p: Partial<RecordsSliceSceneProps>, o: {frame: number; fps: number; durationInFrames: number}) => {
  const {from, to, pre} = recordsCameraMove(p, o.durationInFrames, o.fps, o.frame);
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

// ---------------------------------------------------------------- the extra

const toFig = (v: V3): V3 => {
  const f = OFFICE.fig;
  return [f[2] - v[2], v[1] - f[1], v[0] - f[0]];
};
const REST_R: V3 = [-0.16, 0.79, 0.4];
const REST_L: V3 = [0.17, 0.79, 0.4];

/** The extra's hands at t (figure-local): typing on the keyboard, the near (right) hand to the mouse. */
const extraHands = (p: Partial<RecordsSliceSceneProps>, t: number): [V3, V3] => {
  const kb = OFFICE.keyboard;
  const keyR = toFig([kb[0], kb[1] + 0.03, kb[2] + 0.1]);
  const keyL = toFig([kb[0], kb[1] + 0.03, kb[2] - 0.1]);
  const mouse = toFig([OFFICE.mouse[0], OFFICE.mouse[1] + 0.035, OFFICE.mouse[2]]);
  const lerp = (a: V3, b: V3, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
  // typing: blend 0.3 s in and out of each window, fingers tapping (deterministic, on the scene clock)
  const type = (p.typing ?? []).reduce((m, w) => Math.max(m, ease(t, w.from - 0.3, w.from) * (1 - ease(t, w.to, w.to + 0.3))), 0);
  const tap = (s: number) => 0.012 * Math.max(0, Math.sin(t * 2 * Math.PI * 4.2 + s));
  let r = lerp(REST_R, [keyR[0], keyR[1] + tap(0), keyR[2]], type);
  const l = lerp(REST_L, [keyL[0], keyL[1] + tap(1.9), keyL[2]], type);
  const reach = (p.mouseAt ?? []).reduce((m, a) => Math.max(m, ease(t, a, a + 0.4) * (1 - ease(t, a + 1.2, a + 1.6))), 0);
  const click = (p.mouseAt ?? []).some((a) => t >= a + 0.55 && t < a + 0.7) ? -0.008 : 0;
  r = lerp(r, [mouse[0], mouse[1] + click, mouse[2]], reach);
  return [r, l];
};

const extraGestures = (p: Partial<RecordsSliceSceneProps>): Gesture[] => [
  {pose: 'turn-to', at: -1, target: [OFFICE.monitor[0], OFFICE.monitor[1] + 0.35, OFFICE.monitor[2]], blend: 0.4},
  ...(p.leanAt ?? []).map((a) => ({pose: 'lean-in' as const, at: a, hold: 1.5, blend: 0.5})),
];

// ---------------------------------------------------------------- anchors

/**
 * A named point on screen (px): 'rack' (the path's rack node), 'monitor' (the office monitor: the search screen's
 * leader), 'desk', 'head' (the extra's head), 'slab:n', 'tick:n' (the ruler's tick n), 'rulerEnd' (its lit end now),
 * 'ruler' (its middle).
 */
export const recordsAnchorOnScreen = (
  p: Partial<RecordsSliceSceneProps>,
  anchor: string,
  o: {frame: number; fps: number; durationInFrames: number},
): [number, number] | undefined => {
  const cam = recordsCameraAt(p, o);
  const t = o.frame / o.fps;
  const oy = officeYOf(p);
  const at = (v: V3) => projectToFrame(cam, v);
  const [name, arg] = anchor.split(':');
  const ry = RULER.y;
  const rz = FRONT + RULER.proud;
  switch (name) {
    case 'rack':
      return at(recordsPathPoints(p).leg1[3]);
    case 'monitor':
      return at([OFFICE.monitor[0], oy + OFFICE.monitor[1] + 0.4, OFFICE.monitor[2]]);
    case 'desk':
      return at([OFFICE.desk.x, oy + OFFICE.desk.h + 0.05, OFFICE.desk.z]);
    case 'head':
      return at([OFFICE.fig[0], oy + 1.25, OFFICE.fig[2]]);
    case 'slab':
      return at(slabPos(p, Number(arg ?? 0)));
    case 'tick':
      return at([rulerX(p.ruler, Number(arg ?? 0)), ry, rz]);
    case 'rulerEnd':
      return at([rulerX(p.ruler, rulerDays(p.ruler, t)), ry, rz]);
    case 'ruler':
      return at([(RULER.x0 + RULER.x1) / 2, ry, rz]);
    default:
      return undefined;
  }
};

// ---------------------------------------------------------------- set pieces

const useRecordMats = () =>
  useMemo(() => {
    const std = (c: string, r = 0.6, metal = 0) => new THREE.MeshStandardMaterial({color: raw(c), roughness: r, metalness: metal});
    return {
      tray: std(REAL.labDark, 0.45, 0.3),
      piece: std(REAL.cabinet, 0.5, 0.2),
      pieceDark: std(section.ledOff, 0.5, 0.1),
      lit: new THREE.MeshBasicMaterial({color: raw(section.orange)}),
      body: std(REAL.alu, 0.45, 0.4),
      cooler: std(TOWER.cabinetPaint, 0.6),
      grille: std(REAL.cable, 0.7),
      keyboard: std(REAL.labDark, 0.55),
      keys: std(REAL.cabinet, 0.6),
      ink: new THREE.MeshBasicMaterial({color: raw(section.cutLine)}),
    };
  }, []);
type RecordMats = ReturnType<typeof useRecordMats>;

/** One rack: frame, slabs (tray + plate piece + label piece), a status LED per slab blinking on the video clock. */
const Rack: React.FC<{
  mats: OfficeMats;
  rm: RecordMats;
  r: number;
  rows: number;
  clock: number;
  state: (n: number) => {lit: number; plateDark: boolean; out: number; swell: number};
}> = ({mats, rm, r, rows, clock, state}) => {
  const {w, d, h} = RACK;
  return (
    <group>
      <mesh geometry={roundedBox(w, h, d, 0.012)} material={mats.rack} position={[0, h / 2, 0]} castShadow receiveShadow />
      {[...Array(rows).keys()].map((i) => {
        const n = r * rows + i;
        const s = state(n);
        const y = ROW0 + i * PITCH + TRAY.h / 2;
        const z = d / 2 + s.out;
        const on = random(`rec-${n}-${Math.floor(clock * (1.4 + 2.6 * random(`rec-rt-${n}`)) + random(`rec-ph-${n}`) * 7)}`) > 0.35;
        const sw = 1 + 0.18 * s.swell;
        return (
          <group key={i} position={[0, y, z]}>
            {/* the tray: from 0.4 m inside the rack to 15 mm proud of its front */}
            <mesh material={rm.tray} position={[0, 0, (TRAY.proud - 0.4) / 2]} castShadow>
              <boxGeometry args={[TRAY.w, TRAY.h, TRAY.proud + 0.4]} />
            </mesh>
            {/* the plate piece and the label piece: separate blocks on the tray's face, 3 cm apart, different depths */}
            <mesh
              material={s.lit > 0.5 && !s.plateDark ? rm.lit : s.plateDark ? rm.pieceDark : rm.piece}
              position={[PLATE_P.x, 0, TRAY.proud + PLATE_P.d / 2]}
            >
              <boxGeometry args={[PLATE_P.w, PLATE_P.h, PLATE_P.d]} />
            </mesh>
            <mesh material={s.lit > 0.5 ? rm.lit : rm.piece} position={[LABEL_P.x, 0, TRAY.proud + (LABEL_P.d * sw) / 2]} scale={[1, sw, sw]}>
              <boxGeometry args={[LABEL_P.w, LABEL_P.h, LABEL_P.d]} />
            </mesh>
            <mesh material={on ? mats.ledA : mats.ledOff} position={[0.215, 0, TRAY.proud + 0.003]}>
              <boxGeometry args={[0.014, 0.014, 0.006]} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

/** A floor cooling unit (grey cabinet, a dark grille). */
const Cooler: React.FC<{rm: RecordMats}> = ({rm}) => (
  <group>
    <mesh geometry={roundedBox(0.8, 1.9, 0.7, 0.015)} material={rm.cooler} position={[0, 0.95, 0]} castShadow receiveShadow />
    <mesh material={rm.grille} position={[0, 1.45, 0.355]}>
      <boxGeometry args={[0.6, 0.5, 0.012]} />
    </mesh>
  </group>
);

/** The ruler's batches: small slabs (pale body, a separate orange strip piece) on the floor behind the cut edge. */
const BATCH = {w: 0.085, h: 0.026, d: 0.05};

// ---------------------------------------------------------------- the scene

/**
 * B, the records sheet: a server room of record-slab racks with the retention ruler on its floor's cut face, and an
 * office above where an extra searches; an orange path joins them (see the file comment).
 */
export const RecordsSliceScene: React.FC<RecordsSliceSceneProps> = (propsIn) => {
  const props = useFormatProps(propsIn);
  const {durationInFrames, mood = 'day', startFrame = 0} = props;
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const clock = startFrame / fps + t;
  const m = MOODS[mood];
  const oy = officeYOf(props);
  const rows = rowsOf(props);
  const {from, to, pre} = recordsCameraMove(props, durationInFrames, fps, frame);
  const cam = recordsCameraAt(props, {frame, fps, durationInFrames});
  const camD = cam.position.distanceTo(cam.look);
  const ink = INK * Math.max(0.15, Math.min(4, camD / 12.75));
  const coreR = 0.0225 * Math.max(0.25, Math.min(3.5, camD / 30));
  const nodeR = coreR * NODE_SCALE;
  const sky = useMemo(() => new THREE.MeshBasicMaterial({map: skyTexture(mood), fog: false}), [mood]);
  sky.color.setScalar(1 / m.exposure);
  const mats = useOfficeMats(mood);
  const rm = useRecordMats();
  const floorServer = useMemo(() => new THREE.MeshStandardMaterial({color: raw(LAB[mood].floor), roughness: 0.85}), [mood]);
  const batchMats = useMemo(
    () =>
      [...Array(48).keys()].map(() => ({
        body: new THREE.MeshStandardMaterial({color: raw(REAL.alu), roughness: 0.45, metalness: 0.4, transparent: true}),
        strip: new THREE.MeshBasicMaterial({color: raw(section.orange), transparent: true}),
      })),
    [],
  );

  // ---- the path
  const pts = recordsPathPoints(props);
  const k = props.path ? pathKeys(props.path) : null;
  const d1 = k ? ease(t, k.at, k.rackAt) : 0;
  const d2 = k ? ease(t, k.leg2At, k.deskAt) : 0;
  const drawn = (leg: V3[], u: number) => {
    if (u <= 0) return [] as [V3, V3][];
    const L = polylineLength(leg);
    let left = u * L;
    const out: [V3, V3][] = [];
    for (let i = 1; i < leg.length && left > 0; i++) {
      const a = leg[i - 1];
      const b = leg[i];
      const l = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
      const q = Math.min(1, left / l);
      out.push([a, [a[0] + (b[0] - a[0]) * q, a[1] + (b[1] - a[1]) * q, a[2] + (b[2] - a[2]) * q]]);
      left -= l;
    }
    return out;
  };
  const segs = [...drawn(pts.leg1, d1), ...drawn(pts.leg2, d2)];
  const corners = segs.slice(1).map((s) => s[0]);
  // pulses up the path (leg 1 in 1.0 s, leg 2 in 1.2 s once drawn); queries down leg 2 and back
  const pulses: V3[] = [];
  let rackSwell = 0;
  let deskSwell = 0;
  if (k && k.pulsesAt !== null) {
    const n1 = Math.floor((t - k.pulsesAt) / k.pulseEvery);
    for (let n = Math.max(0, n1 - 4); n <= n1; n++) {
      const e = k.pulsesAt + n * k.pulseEvery;
      if (e > k.until || e > t) continue;
      const age = t - e;
      if (age < 1.0) {
        if (age / 1.0 <= d1) pulses.push(pointAlong(pts.leg1, age / 1.0));
      } else if (age < 2.2 && d2 >= 1) {
        rackSwell = Math.max(rackSwell, 1 - Math.min(1, (age - 1.0) / 0.35));
        pulses.push(pointAlong(pts.leg2, (age - 1.0) / 1.2));
      } else if (age < 2.55 && d2 >= 1) deskSwell = Math.max(deskSwell, 1 - (age - 2.2) / 0.35);
    }
  }
  for (const q of props.query ?? []) {
    const a = t - q;
    if (a >= 0 && a < 1.0) pulses.push(pointAlong(pts.leg2, 1 - a / 1.0));
    else if (a >= 1.0 && a < 1.3) rackSwell = Math.max(rackSwell, 1 - (a - 1.0) / 0.3);
    else if (a >= 1.3 && a < 2.3) pulses.push(pointAlong(pts.leg2, (a - 1.3) / 1.0));
    else if (a >= 2.3 && a < 2.65) deskSwell = Math.max(deskSwell, 1 - (a - 2.3) / 0.35);
  }
  const head = d2 > 0 && d2 < 1 ? pointAlong(pts.leg2, d2) : d1 > 0 && d1 < 1 ? pointAlong(pts.leg1, d1) : null;
  const rackGlow = k && t >= k.rackAt ? 1 : 0;
  const deskGlow = k && t >= k.deskAt ? 1 : 0;

  // ---- slabs
  const slot = props.slotIn ?? null;
  const slotSlab = slot ? (slot.slab ?? 5) : -1;
  const labelSwell = (props.labelPulses ?? []).reduce((mx, a) => (t >= a && t < a + 0.5 ? Math.max(mx, Math.sin((Math.PI * (t - a)) / 0.5)) : mx), 0);
  const slabState = (n: number) => {
    let lit = 0;
    for (const mk of props.matches ?? []) if (mk.slabs.includes(n) && t >= mk.at && (mk.until === undefined || t < mk.until)) lit = 1;
    let out = 0;
    if (n === slotSlab && slot) {
      out = 0.6 * (1 - ease(t, slot.at, slot.at + 0.5));
      if (t >= slot.at + 0.5) lit = 1;
    }
    const plateDark = (props.plateDark ?? []).some((q) => q.slabs.includes(n) && t >= q.at + 0.15);
    return {lit, plateDark, out, swell: lit ? labelSwell : 0};
  };
  // before the slot-in, the slab waits out of the rack (hidden until it starts moving)
  const slabHidden = slot ? t < slot.at : false;

  // ---- the ruler
  const R = props.ruler ?? null;
  const nT = R?.ticks ?? 30;
  const days = rulerDays(R, t);
  const rAt = R?.at ?? -10;
  const drawK = R ? ease(t, rAt, rAt + 1.0) : 0;
  const litEnd = Math.min(days, nT * drawK);
  const rz = FRONT + RULER.proud;
  const ry = RULER.y;
  const step = Math.max(0.2, R?.step ?? 0.6);
  const batches: {x: number; o: number; key: number}[] = [];
  if (R && R.batchesAt !== undefined && R.batchesAt !== null) {
    const nNow = Math.floor((t - R.batchesAt) / step);
    for (let i = nNow - nT - 1; i <= nNow; i++) {
      const enter = R.batchesAt + i * step;
      const age = (t - enter) / step;
      if (age < 0) continue;
      const whole = Math.floor(age);
      const pos = whole + ease(age - whole, 0, 0.4);
      if (pos > nT + 0.5) continue;
      // past the lit end the batch fades (opacity only), so a shrinking end sweeps them away softly
      const o = Math.max(0, Math.min(1, 1 - (pos - days) / 0.8)) * Math.min(1, age * 3);
      if (o < 0.01) continue;
      batches.push({x: rulerX(R, pos), o, key: i});
    }
  }

  const fig = OFFICE.fig;
  const lookExtra: Partial<CastLook> = props.look === 'b' ? EXTRA_B : {top: CAST.extra.top};

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
        <SectionLights mood={mood} target={[0.3, oy / 2, 0]} lamp={0} extent={8} figureSpot={false} />
        <mesh position={[0, oy / 2, -40]} material={sky}>
          <planeGeometry args={[260, 160]} />
        </mesh>

        {/* bottom: the server room */}
        <OfficeBlock w={ROOM.w} d={ROOM.d} floor={floorServer} mats={mats} ink={ink} />
        {RACK.x.map((x, r) => (
          <group key={r} position={[x, 0, RACK.z]}>
            <Rack
              mats={mats}
              rm={rm}
              r={r}
              rows={rows}
              clock={clock}
              state={(n) => (n === slotSlab && slabHidden ? {lit: 0, plateDark: false, out: 3, swell: 0} : slabState(n))}
            />
          </group>
        ))}
        <group position={[-1.35, 0, -0.75]}>
          <Cooler rm={rm} />
        </group>

        {/* top: the office */}
        <group position={[0, oy, 0]}>
          <OfficeBlock w={ROOM.w} d={ROOM.d} floor={mats.floorInsurer} mats={mats} ink={ink} />
          <group position={[OFFICE.desk.x, 0, OFFICE.desk.z]}>
            <Desk size={[OFFICE.desk.w, OFFICE.desk.h, OFFICE.desk.d]} mats={mats} top={mats.wood} />
          </group>
          {/* the monitor turned to the extra (its back to the camera side), lit; its light on the face */}
          <group position={OFFICE.monitor} rotation={[0, -Math.PI / 2, 0]}>
            <Monitor mats={mats} lit />
          </group>
          <pointLight
            position={[OFFICE.monitor[0] - 0.3, OFFICE.monitor[1] + 0.4, OFFICE.monitor[2]]}
            color={raw(section.screenLight)}
            intensity={0.6 * Math.PI}
            distance={0.9}
            decay={1}
          />
          {/* keyboard (keys a separate slab 4 mm above its base) and mouse */}
          <group position={OFFICE.keyboard}>
            <mesh geometry={roundedBox(0.16, 0.014, 0.42, 0.004)} material={rm.keyboard} position={[0, 0.007, 0]} castShadow />
            <mesh material={rm.keys} position={[0.005, 0.0175, 0]}>
              <boxGeometry args={[0.12, 0.007, 0.38]} />
            </mesh>
          </group>
          <mesh geometry={roundedBox(0.1, 0.03, 0.06, 0.012)} material={rm.keyboard} position={[OFFICE.mouse[0], OFFICE.mouse[1] + 0.015, OFFICE.mouse[2]]} castShadow />
          <group position={[fig[0] - 0.02, 0, fig[2]]}>
            <Chair mats={mats} yaw={Math.PI / 2} />
          </group>
          <Figure
            who="extra"
            mood={mood}
            position={fig}
            rotationY={Math.PI / 2}
            seed="records-extra"
            phone={false}
            hands={extraHands(props, t)}
            gestures={extraGestures(props)}
            look={lookExtra}
            clockOffset={startFrame / fps}
          />
          <group position={OFFICE.plant}>
            <Plant mats={mats} />
          </group>
        </group>

        {/* the ruler: line, ticks (orange to the lit end, ink past it), zero node, the batches */}
        {R && drawK > 0 ? (
          <>
            {litEnd > 0.01 ? <GlowSegment a={[RULER.x0, ry, rz]} b={[rulerX(R, litEnd), ry, rz]} radius={coreR} /> : null}
            <GlowNode at={[RULER.x0, ry, rz]} radius={nodeR} />
            {[...Array(nT + 1).keys()].map((i) => {
              if (i > nT * drawK + 1e-6) return null;
              const x = rulerX(R, i);
              return i <= litEnd + 1e-6 ? (
                <GlowSegment key={i} a={[x, ry, rz]} b={[x, ry - RULER.tick, rz]} radius={coreR * 0.7} />
              ) : (
                <mesh key={i} material={rm.ink} position={[x, ry - RULER.tick / 2, rz]}>
                  <boxGeometry args={[Math.max(0.006, coreR * 1.2), RULER.tick, 0.008]} />
                </mesh>
              );
            })}
          </>
        ) : null}
        {batches.map((b) => {
          const bm = batchMats[((b.key % 48) + 48) % 48];
          bm.body.opacity = b.o;
          bm.strip.opacity = b.o;
          return (
            <group key={b.key} position={[b.x, 0, FRONT - 0.08]}>
              {[0, 1].map((j) => (
                <group key={j} position={[0, BATCH.h / 2 + j * (BATCH.h + 0.006), 0]}>
                  <mesh material={bm.body} castShadow>
                    <boxGeometry args={[BATCH.w, BATCH.h, BATCH.d]} />
                  </mesh>
                  <mesh material={bm.strip} position={[0, 0, BATCH.d / 2 + 0.004]}>
                    <boxGeometry args={[BATCH.w * 0.7, BATCH.h * 0.4, 0.008]} />
                  </mesh>
                </group>
              ))}
            </group>
          );
        })}

        {/* the path */}
        {segs.map(([a, b], i) => (
          <GlowSegment key={i} a={a} b={b} radius={coreR} />
        ))}
        {corners.map((c, i) => (
          <GlowNode key={`c${i}`} at={c} radius={coreR * 1.02} />
        ))}
        {pulses.map((q, i) => (
          <GlowNode key={`p${i}`} at={q} radius={coreR * 1.9} dot />
        ))}
        <GlowNode at={pts.leg1[3]} radius={nodeR} glow={rackGlow} swell={1 + 0.35 * rackSwell} />
        <GlowNode at={pts.leg2[pts.leg2.length - 1]} radius={nodeR} glow={deskGlow} swell={1 + 0.35 * deskSwell} />
        <OrangeLight position={head ?? pts.leg1[3]} intensity={head ? 0.6 : 0} reach={1.2} />
      </SectionStage>
    </AbsoluteFill>
  );
};

/** Lengths for callers that time pulses (m). */
export const recordsPathLengths = (p: Partial<RecordsSliceSceneProps>) => {
  const q = recordsPathPoints(p);
  return {leg1: polylineLength(q.leg1), leg2: polylineLength(q.leg2)};
};
