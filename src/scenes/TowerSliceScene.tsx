import React, {useMemo} from 'react';
import {AbsoluteFill, random, useCurrentFrame, useVideoConfig} from 'remotion';
import * as THREE from 'three';
import {fonts} from '../fonts';
import {MOODS, section, type Mood} from '../theme';
import {OrangePath} from '../three/OrangePath';
import {raw} from '../three/plaster';
import {projectToFrame, SectionCamera, sectionCameraAt, type Framing} from '../three/section/SectionCamera';
import {SectionLights, SectionStage} from '../three/section/SectionStage';
import {skyTexture} from '../three/section/textures';
import {
  callButton,
  controllerAt,
  LINE_IN,
  levelYAt,
  personHead,
  shaftLineX,
  TOWER_DIM,
  towerLayout,
  towerResolver,
  TowerSlice,
  type StopTick,
  type TowerCall,
  type TowerCar,
  type TowerLayout,
} from '../three/section/TowerSlice';
import {carStateAt, doorsAt, personAt, type CarKey, type DoorKey, type PersonSpec} from '../three/section/towerMotion';
import {ease, framingAtKeys, type CameraKey} from './keyframes';

type V3 = [number, number, number];
export type TowerFraming = 'tower' | 'shafts' | 'top' | 'landing';
export type DecisionState = 'tentative' | 'steady' | 'locked';

/**
 * Framings for the default tower (4 shafts, 5 floors). `tower`: the whole building, machine room top
 * at ≈ y 470 under the title block, lobby floor at ≈ y 1500. `shafts`: floors 1 to 5 and the four
 * cars; `top`: the machine room and floors 4 to 5; `landing`: floor 4, YOU, the call panel and B's door.
 */
export const TOWER_FRAMINGS: Record<TowerFraming, Framing> = {
  tower: {look: [1.5, 12.1, 0], distance: 88.25},
  shafts: {look: [0.9, 9.6, -0.3], distance: 64},
  top: {look: [0.7, 15.6, -0.4], distance: 40},
  landing: {look: [-0.2, 13.2, 0.2], distance: 21},
};

/** The frame-0 positions of No. 003 (A/V script, 🎭 illustrative): A lobby empty, B 5 (1), C 1 (6), D 2 (2). */
export const DEFAULT_CARS: Record<string, TowerCar> = {
  A: {level: 0, riders: 0},
  B: {level: 5, riders: 1},
  C: {level: 1, riders: 6},
  D: {level: 2, riders: 2},
};

export type DecisionLine = {
  /** The car it assigns (a shaft letter). */
  to: string;
  /** End at this level's call button instead of the car's roof (the route runs down the car's shaft to it). */
  call?: number;
  /** The call's direction (default 'down', 'up' on the lobby). */
  callDir?: 'up' | 'down';
  /**
   * 'tentative' (thin, its dots at rest unless `dotsFrom`), 'steady' (dots flowing) or 'locked'
   * (thicker, dots stopped, the end node bright).
   */
  state?: DecisionState;
  /** State changes over time: [{at, state}] (e.g. tentative → locked when the car brakes). */
  states?: {at: number; state: DecisionState}[];
  /** Seconds into the scene when it starts drawing (default: already drawn). */
  at?: number;
  /** Draw time, s (default 1.3). */
  draw?: number;
  /** Seconds into the scene when its dots start travelling (default: at rest, or flowing when 'steady'). */
  dotsFrom?: number;
  /** From here the dots ease to their rest positions and stop (the loop's last frames). */
  dotsUntil?: number;
  /** Re-assignment: at `at` the line snaps to another car (a 4-frame flick). One or a list (hops). */
  switchTo?: {to: string; at: number} | {to: string; at: number}[];
  /** Glow keys [{at, value}]: 0 leaves only its node dots (the trace), 1 full (default 1). */
  glow?: {at: number; value: number}[];
  /** Gone (faded with its nodes) by this time. */
  until?: number;
  /** A single bright dot runs the line from each of these times (≈ 1 s). */
  pulses?: number[];
};

/** A dashed ink outline of a car (drafting's hidden line): a preview of a trip, not the car. */
export type PreviewSpec = {
  car: string;
  /** Trip orders as for a car (the first key at or before `from` places it; default: the car's own level at `from`). */
  keys: CarKey[];
  /** Its doors drawn dashed, opening and closing (a stop). */
  doors?: DoorKey[];
  /** Shown from (fades in 0.25 s) and until (gone by). */
  from?: number;
  until?: number;
  /** Cruise speed floors/s and ramp s (default 4 and 0.3: a preview races). */
  speed?: number;
  ramp?: number;
};

export type YouSpec = {
  level: number;
  /** The right hand on the down button: true (held, default), false, or keys [{at, on}]. */
  press?: boolean | {at: number; on: boolean}[];
  /** Finger pushes (s): the finger pushes in and eases back (rising first if the hand is down). */
  pushes?: number[];
  gestures?: PersonSpec['gestures'];
  watch?: number[];
};

export type TowerSliceSceneProps = {
  durationInFrames: number;
  /** Day (default) or Night. */
  mood?: Mood;
  /** Floors above the lobby (default 5). */
  floors?: number;
  /** Shaft letters, left to right (default A–D). */
  letters?: string[];
  /**
   * Cars by letter: `level` (where it stands), `keys` [{at, level}] (trip orders: from `at` it travels
   * there with a real lift's acceleration and braking), `speed`, `ramp`, `doors` [{at, open}],
   * `riders` (0–8), `face` (riders turn to the doors at s), `watch` [s] (riders check watches),
   * `brakeMark` (an ink braking-distance mark while it brakes). Default: No. 003's frame 0.
   */
  cars?: Record<string, TowerCar>;
  /** YOU in a hall at the call panel (see YouSpec). null for nobody. Default {level: 4, press: true}. */
  you?: YouSpec | null;
  /** More people: in the halls and the cars, walking, pressing, boarding (see PersonSpec). */
  people?: PersonSpec[];
  /** Lit call buttons [{level, dir, at?, until?}], warning yellow, flat (default: YOU's down button). */
  calls?: TowerCall[];
  /** Orange decision lines from the controller (default: one tentative line to A). */
  lines?: DecisionLine[];
  /**
   * Plan flicker: from `at` to `until` every line jumps between cars `rate` times a second (default 8),
   * and (unless `links: false`) every lit call gets its own flickering link (controller → a car's shaft
   * → the call), so a plan of call → car links visibly recombines. The links go at `until`.
   */
  flicker?: {at: number; until: number; rate?: number; seed?: string; links?: boolean};
  /** Promised stops: ink ticks on the slab's cut face under a shaft [{car, level, at?, until?, pulse?, dashed?}]. */
  stops?: StopTick[];
  /** Orange load bars on the cars' cut faces (riders / capacity, default 6). */
  loadBars?: {at: number; until?: number; capacity?: number};
  /** Orange direction chevrons on moving cars. */
  chevrons?: {at: number; until?: number};
  /** Score readouts beside the cars: keys [{at, values: {A: 16, …}, count?}] (each counts up over `count` s, default 1.2). */
  scores?: {at: number; values: Record<string, number>; count?: number}[];
  /** Readouts gone by this time. */
  scoresUntil?: number;
  /** From this time the lowest readout gets the controller's orange mark. */
  winnerAt?: number;
  /** Unit after the digits (default 's'). */
  scoreUnit?: string;
  /** Dashed preview outlines. */
  previews?: PreviewSpec[];
  /** Framing preset (default 'tower'). */
  framing?: TowerFraming;
  /** A custom move instead of a preset (look-at + distance at the fixed angle). */
  camera?: {from: Framing; to?: Framing};
  /** Camera keyframes (as the car and wheel slices); overrides `camera` and `push`. */
  cameraKeys?: CameraKey[];
  /** Push toward the subject, units/s (default 0). */
  push?: number;
  /** Idle sideways drift, ± units (default 0: frame 0 and the loop must match). */
  drift?: number;
  location?: string;
  transition?: 'auto' | 'continue' | 'glide' | 'cut' | 'dissolve' | 'slide' | 'follow';
  follow?: {direction?: 'down' | 'up' | 'left' | 'right'; at?: number};
  glide?: number;
  /** Set by Explainer. */
  startFrame?: number;
  cameraFrom?: Framing;
  cameraGlide?: number;
};

export const towerCameraMove = (
  p: {framing?: string; camera?: {from: Framing; to?: Framing}; cameraKeys?: CameraKey[]; push?: number; cameraFrom?: Framing; cameraGlide?: number},
  durationInFrames: number,
  fps: number,
  frame?: number,
  presets: Record<string, Framing> = TOWER_FRAMINGS,
  dflt = 'tower',
) => {
  const base = p.camera?.from ?? presets[p.framing ?? dflt] ?? presets[dflt];
  if (p.cameraKeys && p.cameraKeys.length) {
    // a glide in from the last scene's end is the first segment
    const from = p.cameraFrom && p.cameraGlide ? p.cameraFrom : base;
    const f = framingAtKeys(p.cameraKeys, from, frame === undefined ? Infinity : frame / fps);
    return {from: f, to: f, pre: undefined};
  }
  const pre =
    p.cameraGlide && p.cameraFrom
      ? {from: p.cameraFrom, hold: 0, move: Math.max(1, Math.round(p.cameraGlide * fps)), ease: 'cubic' as const}
      : undefined;
  if (p.camera) return {from: p.camera.from, to: p.camera.to ?? p.camera.from, pre};
  const secs = Math.max(0, durationInFrames - (pre ? pre.move : 0)) / fps;
  return {from: base, to: {look: base.look, distance: base.distance - (p.push ?? 0) * secs}, pre};
};

export const towerCameraStart = (p: Partial<TowerSliceSceneProps>, d: number, fps: number): Framing =>
  towerCameraMove({...p, cameraFrom: undefined, cameraGlide: undefined}, d, fps, 0).from;
export const towerCameraEnd = (p: Partial<TowerSliceSceneProps>, d: number, fps: number): Framing => towerCameraMove(p, d, fps).to;

/** The camera state at a frame (pure, for overlays). */
export const towerCameraAt = (
  p: Parameters<typeof towerCameraMove>[0] & {drift?: number; startFrame?: number},
  o: {frame: number; fps: number; durationInFrames: number},
  presets: Record<string, Framing> = TOWER_FRAMINGS,
  dflt = 'tower',
) => {
  const {from, to, pre} = towerCameraMove(p, o.durationInFrames, o.fps, o.frame, presets, dflt);
  return sectionCameraAt({from, to, pre, frame: o.frame, fps: o.fps, durationInFrames: o.durationInFrames, drift: p.drift ?? 0, clockOffset: (p.startFrame ?? 0) / o.fps});
};

/** YOU as a person (at the call panel), then everyone else. */
export const towerPeople = (p: Partial<TowerSliceSceneProps>): PersonSpec[] => {
  const you = p.you === undefined ? {level: 4, press: true} : p.you;
  const list: PersonSpec[] = [];
  if (you)
    list.push({
      who: 'you',
      seed: 'you',
      level: you.level,
      start: 'panel',
      press: you.press ?? true,
      pushes: you.pushes,
      gestures: you.gestures,
      watch: you.watch,
    });
  return [...list, ...(p.people ?? [])];
};

/** Line widths per state (§ 5's 0.018 / 0.055 scaled ≈ 2.2× for the far `tower` framing; values 🧪). */
const LINE = {tentative: 0.04, steady: 0.05, locked: 0.075};
const NODE_R = 0.1;
/** Frames a re-assignment flick takes. */
const SNAP = 4;

const stateAt = (ln: DecisionLine, t: number): DecisionState => {
  let s = ln.state ?? 'tentative';
  for (const k of [...(ln.states ?? [])].sort((a, b) => a.at - b.at)) if (t >= k.at) s = k.state;
  return s;
};
const switchesOf = (ln: DecisionLine) => (ln.switchTo ? (Array.isArray(ln.switchTo) ? ln.switchTo : [ln.switchTo]) : []).slice().sort((a, b) => a.at - b.at);
const glowAt = (ln: DecisionLine, t: number) => {
  let g = 1;
  let from = 1;
  let at = -Infinity;
  for (const k of [...(ln.glow ?? [])].sort((a, b) => a.at - b.at)) {
    if (t < k.at) break;
    from = g;
    g = k.value;
    at = k.at;
  }
  // each glow change eases over 0.5 s
  return at === -Infinity ? g : from + (g - from) * ease(t, at, at + 0.5);
};

/**
 * A decision line's route (right angles): out of the cabinet, down to the machine room floor, forward
 * to the shafts' line plane, across to the car's shaft (its left side, behind the shaft front), down
 * the shaft beside the car, and in to the car's crosshead, or forward to a call button.
 */
export const decisionRoute = (L: TowerLayout, shaft: number, endY: number, end: 'car' | V3): V3[][] => {
  const {node} = controllerAt(L);
  const z = LINE_IN.z;
  const x = shaftLineX(L, shaft);
  const y = L.machineFloor + 0.12;
  const pts: V3[] = [node, [node[0], y, node[2]], [node[0], y, z], [x, y, z], [x, endY, z]];
  // to a car the vertical leg ends on the car's top, in the shaft (no hook across the doorway)
  if (end !== 'car') pts.push([x, endY, TOWER_DIM.frontOut + 0.06], [end[0], endY, TOWER_DIM.frontOut + 0.06], end);
  return pts.slice(0, -1).map((p, i) => [p, pts[i + 1]]);
};

const polyPoint = (legs: V3[][], u: number): V3 => {
  const segs = legs.map(([a, b]) => ({a, b, l: Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2])}));
  const total = segs.reduce((s, x) => s + x.l, 0);
  let d = Math.max(0, Math.min(1, u)) * total;
  for (const s of segs) {
    if (d <= s.l) {
      const f = s.l > 0 ? d / s.l : 0;
      return [s.a[0] + (s.b[0] - s.a[0]) * f, s.a[1] + (s.b[1] - s.a[1]) * f, s.a[2] + (s.b[2] - s.a[2]) * f];
    }
    d -= s.l;
  }
  return segs[segs.length - 1].b;
};

/** The route of a line to a shaft at t (car roof or call button). */
const routeTo = (L: TowerLayout, letters: string[], cars: Record<string, TowerCar>, ln: DecisionLine, shaft: number, t: number) => {
  if (ln.call !== undefined) {
    const b = callButton(L, ln.call, ln.callDir ?? (ln.call === 0 ? 'up' : 'down'));
    const tip: V3 = [b[0] - 0.12, b[1], b[2] + 0.02];
    return {legs: decisionRoute(L, shaft, b[1], tip), end: tip};
  }
  const st = carStateAt(cars[letters[shaft]], t);
  const y = levelYAt(L, st.level) + TOWER_DIM.car.h + 0.12;
  return {legs: decisionRoute(L, shaft, y, 'car'), end: [shaftLineX(L, shaft), y, LINE_IN.z] as V3};
};

/** Dot phase at t: flowing at 0.35 route-lengths/s from `dotsFrom`, easing to a rest position after `dotsUntil`. */
const DOT_REST = 0.12;
const DOTS = 4;
const dotPhase = (ln: DecisionLine, state: DecisionState, t: number): number | undefined => {
  if (state === 'locked') return undefined;
  const from = ln.dotsFrom ?? (state === 'steady' ? 0 : undefined);
  if (from === undefined || t < from) return DOT_REST;
  const run = (x: number) => DOT_REST + (x - from) * 0.35;
  if (ln.dotsUntil === undefined || t < ln.dotsUntil) return run(t);
  const f0 = run(ln.dotsUntil);
  const target = DOT_REST + Math.ceil((f0 - DOT_REST) * DOTS + 0.5) / DOTS;
  const dur = Math.max(0.8, ((target - f0) / 0.35) * 1.6);
  // ease-out from the running speed to rest
  const u = Math.min(1, (t - ln.dotsUntil) / dur);
  return f0 + (target - f0) * (1 - Math.pow(1 - u, 2));
};

type LiveLine = {key: string; legs: V3[][]; end: V3; radius: number; glow: number; progress: number; flow?: number; locked: boolean; pulses: number[]};

/** Every line's drawable state at t (flicker and snaps included). */
const liveLines = (p: TowerSliceSceneProps, L: TowerLayout, letters: string[], cars: Record<string, TowerCar>, t: number, fps: number): LiveLine[] => {
  const out: LiveLine[] = [];
  const valid = letters.filter((l) => cars[l]);
  const fl0 = p.flicker;
  const links: DecisionLine[] =
    fl0 && fl0.links !== false && t >= fl0.at && t < fl0.until
      ? (p.calls ?? [{level: 4, dir: 'down' as const}])
          .filter((c) => t >= (c.at ?? -Infinity) && t < (c.until ?? Infinity))
          .map((c) => ({to: valid[0], call: c.level, callDir: c.dir, state: 'steady' as const, until: fl0.until}))
      : [];
  [...(p.lines ?? [{to: 'A', state: 'tentative'}]), ...links].forEach((ln, i) => {
    const state = stateAt(ln, t);
    const sw = switchesOf(ln);
    let to = ln.to;
    let prev: string | undefined;
    let since = Infinity;
    for (const s of sw)
      if (t >= s.at) {
        prev = to;
        to = s.to;
        since = t - s.at;
      }
    const fl = p.flicker;
    const flickering = !!fl && t >= fl.at && t < fl.until;
    if (fl && flickering) {
      // each step re-picks a car (never the same twice running) and lands with the snap's bright flick
      const rate = fl.rate ?? 8;
      const step = Math.floor((t - fl.at) * rate);
      const pick = (k: number) => Math.floor(random(`${fl.seed ?? 'plan'}-${i}-${k}`) * valid.length) % valid.length;
      let a = pick(step);
      if (step > 0 && a === pick(step - 1)) a = (a + 1) % valid.length;
      to = valid[a];
      prev = undefined;
      since = (t - fl.at) - step / rate;
    }
    const shaft = letters.indexOf(to);
    if (shaft < 0 || !cars[to]) return;
    const out0 = ln.until === undefined ? 1 : 1 - ease(t, ln.until - 0.4, ln.until);
    const glow = glowAt(ln, t) * out0;
    const progress = flickering ? 1 : ln.at === undefined ? 1 : ease(t, ln.at, ln.at + (ln.draw ?? 1.3));
    if (progress <= 0 || out0 <= 0.001) return;
    const {legs, end} = routeTo(L, letters, cars, ln, shaft, t);
    const snapK = since * fps < SNAP ? 1 - (since * fps) / SNAP : 0;
    // a flickering plan draws at least at the steady width, so it reads in motion
    const radius = (flickering ? LINE.locked : LINE[state]) * (1 + 0.8 * snapK);
    out.push({key: `${i}`, legs, end, radius, glow, progress, flow: dotPhase(ln, state, t), locked: state === 'locked', pulses: ln.pulses ?? []});
    // the flick: the old route fades out over the snap
    if (prev && snapK > 0 && letters.indexOf(prev) >= 0 && cars[prev]) {
      const r = routeTo(L, letters, cars, ln, letters.indexOf(prev), t);
      out.push({key: `${i}-old`, legs: r.legs, end: r.end, radius: LINE[state], glow: glow * snapK, progress: 1, flow: undefined, locked: false, pulses: []});
    }
  });
  return out;
};

/** A named point on the tower (world) at t: 'youSpot' (YOU's head), 'callButton:4[:up]', 'carRoof:B', 'car:B', 'controllerAt', 'person:2'. */
export const towerAnchorPoint = (p: Partial<TowerSliceSceneProps>, anchor: string, t: number): V3 | undefined => {
  const letters = p.letters ?? ['A', 'B', 'C', 'D'];
  const L = towerLayout(letters.length, p.floors ?? 5);
  const cars = p.cars ?? DEFAULT_CARS;
  const [kind, a, b] = anchor.split(':');
  const people = towerPeople(p);
  const R = towerResolver(L, letters, cars);
  if (kind === 'youSpot' || kind === 'you') {
    const i = people.findIndex((q) => q.who === 'you');
    return i < 0 ? undefined : personHead(personAt(people[i], i, t, R));
  }
  if (kind === 'person') {
    const i = Number(a) + (people[0]?.who === 'you' && p.you !== null ? 1 : 0);
    return people[i] ? personHead(personAt(people[i], i, t, R)) : undefined;
  }
  if (kind === 'callButton') return callButton(L, Number(a ?? 4), (b as 'up' | 'down') ?? 'down');
  if (kind === 'controllerAt' || kind === 'controller') {
    const {x} = controllerAt(L);
    return [x, L.machineFloor + 2.0, -1.3];
  }
  const shaft = letters.indexOf(a ?? '');
  if (shaft < 0 || !cars[a]) return undefined;
  const st = carStateAt(cars[a], t);
  if (kind === 'carRoof') return [L.shaftX[shaft], levelYAt(L, st.level) + TOWER_DIM.car.h + 0.5, TOWER_DIM.car.front];
  if (kind === 'car') return [L.shaftX[shaft], levelYAt(L, st.level) + 1.2, TOWER_DIM.car.front];
  return undefined;
};

/** A named point on screen (px) at a scene frame, for tags and callouts (see `towerAnchorPoint`). */
export const towerAnchorOnScreen = (
  p: Partial<TowerSliceSceneProps>,
  anchor: string,
  o: {frame: number; fps: number; durationInFrames: number},
): [number, number] | undefined => {
  const w = towerAnchorPoint(p, anchor, o.frame / o.fps);
  return w ? projectToFrame(towerCameraAt(p, o), w) : undefined;
};

/**
 * T, the tower slice (No. 003): an office building cut open like a dollhouse (lobby + floors as
 * horizontal bands, thin hall slabs, a machine room with the group controller on top), the bank of
 * four shafts behind the halls with realistic cars that travel with a lift's acceleration and braking,
 * cut door stubs that slide, riders and hall people, YOU at the call panel (the ring warning yellow,
 * flat), and the controller's orange decision lines down the shafts (tentative, steady, locked;
 * re-assigning, flickering through plans). In-set readouts and dashed preview outlines on top.
 */
export const TowerSliceScene: React.FC<TowerSliceSceneProps> = (props) => {
  const {durationInFrames, mood = 'day', floors = 5, letters = ['A', 'B', 'C', 'D'], cars = DEFAULT_CARS, calls = [{level: 4, dir: 'down'}], startFrame = 0} = props;
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const L = useMemo(() => towerLayout(letters.length, floors), [letters.length, floors]);
  const cam = towerCameraAt(props, {frame, fps, durationInFrames});
  const {from, to, pre} = towerCameraMove(props, durationInFrames, fps, frame);
  const people = useMemo(() => towerPeople(props), [props]);
  // line widths are set for the far `tower` framing: closer in, they thin with the camera distance
  const k = Math.max(0.35, Math.min(1, cam.position.distanceTo(cam.look) / TOWER_FRAMINGS.tower.distance));
  const lines = liveLines(props, L, letters, cars, t, fps).map((ln) => ({...ln, radius: ln.radius * k}));
  return (
    <AbsoluteFill>
      <TowerStage mood={mood} L={L} from={from} to={to} pre={pre} durationInFrames={durationInFrames} drift={props.drift ?? 0} startFrame={startFrame} fps={fps} lines={lines} t={t}>
        <TowerSlice
          mood={mood}
          layout={L}
          letters={letters}
          cars={cars}
          people={people}
          calls={calls}
          stops={props.stops}
          loadBars={props.loadBars}
          chevrons={props.chevrons}
          t={t}
          clockOffset={startFrame / fps}
        />
      </TowerStage>
      <TowerOverlay p={props} L={L} letters={letters} cars={cars} t={t} cam={cam} mood={mood} />
    </AbsoluteFill>
  );
};

/** The stage, camera, lights, sky and the orange lines; the slice goes in as children. */
export const TowerStage: React.FC<{
  mood: Mood;
  L: TowerLayout;
  from: Framing;
  to: Framing;
  pre?: {from: Framing; hold: number; move: number; ease?: 'sine' | 'cubic'};
  durationInFrames: number;
  drift: number;
  startFrame: number;
  fps: number;
  lines: LiveLine[];
  t: number;
  /** Where the controller's node sits (default the tower's cabinet); null hides it. */
  node?: V3 | null;
  children: React.ReactNode;
}> = ({mood, L, from, to, pre, durationInFrames, drift, startFrame, fps, lines, t, node, children}) => {
  const m = MOODS[mood];
  const mats = useMemo(
    () => ({
      sky: new THREE.MeshBasicMaterial({map: skyTexture(mood), fog: false}),
      node: new THREE.MeshBasicMaterial({color: raw(section.orange)}),
      pulse: new THREE.MeshBasicMaterial({color: raw(section.orangeDot)}),
    }),
    [mood],
  );
  mats.sky.color.setScalar(1 / m.exposure);
  const ctrl = node === undefined ? controllerAt(L).node : node;
  return (
    <SectionStage mood={mood} post={{softFocus: 0}} far={500}>
      <SectionCamera from={from} to={to} pre={pre} durationInFrames={durationInFrames} drift={drift} clockOffset={startFrame / fps} />
      <SectionLights mood={mood} target={[0, 10, 0]} lamp={0} extent={16} />
      <mesh position={[0, 10, -90]} material={mats.sky}>
        <planeGeometry args={[700, 480]} />
      </mesh>
      {children}
      {lines.length && ctrl ? (
        <mesh position={ctrl} material={mats.node} userData={{glow: true}}>
          <sphereGeometry args={[NODE_R, 16, 12]} />
        </mesh>
      ) : null}
      {lines.map((ln) => (
        <group key={ln.key}>
          <OrangePath
            legs={ln.legs}
            progress={ln.progress}
            glow={ln.glow}
            stain={false}
            runner={false}
            radius={ln.radius}
            coreColor={section.orange}
            halo={{scale: 3, opacity: 0.25}}
            flow={ln.flow}
            dots={DOTS}
          />
          {ln.progress >= 1 && !ln.key.endsWith('-old') ? (
            <mesh position={ln.end} material={mats.node} userData={{glow: true}} scale={ln.locked ? 1.4 : 1}>
              <sphereGeometry args={[NODE_R, 16, 12]} />
            </mesh>
          ) : null}
          {ln.pulses.map((at, j) => {
            const u = (t - at) / 1.0;
            if (u < 0 || u > 1 || ln.progress < 1) return null;
            return (
              <mesh key={j} position={polyPoint(ln.legs, u)} material={mats.pulse} userData={{glow: true}}>
                <sphereGeometry args={[ln.radius * 2.6, 12, 10]} />
              </mesh>
            );
          })}
        </group>
      ))}
    </SectionStage>
  );
};

export {liveLines, type LiveLine};

/** The 2D layer: score readouts beside the cars and the dashed preview outlines. */
const TowerOverlay: React.FC<{
  p: TowerSliceSceneProps;
  L: TowerLayout;
  letters: string[];
  cars: Record<string, TowerCar>;
  t: number;
  cam: ReturnType<typeof towerCameraAt>;
  mood: Mood;
}> = ({p, L, letters, cars, t, cam, mood}) => {
  const {ink, paper} = MOODS[mood];
  const proj = (w: V3) => projectToFrame(cam, w);
  const D = TOWER_DIM;
  const previews = (p.previews ?? []).map((pv, i) => {
    const shaft = letters.indexOf(pv.car);
    if (shaft < 0) return null;
    const from = pv.from ?? pv.keys[0]?.at ?? 0;
    const k = ease(t, from, from + 0.25) * (pv.until === undefined ? 1 : 1 - ease(t, pv.until - 0.25, pv.until));
    if (k <= 0.001) return null;
    const startLevel = pv.keys[0] && pv.keys[0].at <= from ? undefined : cars[pv.car] ? carStateAt(cars[pv.car], from).level : 0;
    const st = carStateAt({level: startLevel, keys: pv.keys, speed: pv.speed ?? 4, ramp: pv.ramp ?? 0.3}, t);
    const open = doorsAt(pv.doors, t);
    const y = levelYAt(L, st.level);
    const x = L.shaftX[shaft];
    const hw = D.car.w / 2;
    const zf = D.car.front;
    const zb = zf - D.car.d;
    const P = (dx: number, dy: number, z: number) => proj([x + dx, y + dy, z]);
    const f = [P(-hw, 0, zf), P(hw, 0, zf), P(hw, D.car.h, zf), P(-hw, D.car.h, zf)];
    const bk = [P(-hw, D.car.h, zb), P(hw, D.car.h, zb)];
    const dw = 0.55;
    const doorL = [P(-dw * open, 0, zf), P(-dw * open, D.door.h, zf)];
    const doorR = [P(dw * open, 0, zf), P(dw * open, D.door.h, zf)];
    const pts = (a: [number, number][]) => a.map((q) => q.join(',')).join(' ');
    return (
      <g key={i} opacity={k}>
        <polygon points={pts(f)} />
        <polyline points={pts([f[3], bk[0], bk[1], f[2]])} />
        <polyline points={pts(doorL)} />
        {open > 0.02 ? <polyline points={pts(doorR)} /> : null}
      </g>
    );
  });

  // score readouts
  const keys = [...(p.scores ?? [])].sort((a, b) => a.at - b.at);
  let readouts: React.ReactNode = null;
  if (keys.length && t >= keys[0].at - 0.01) {
    const out = p.scoresUntil === undefined ? 1 : 1 - ease(t, p.scoresUntil - 0.3, p.scoresUntil);
    const valueAt = (l: string) => {
      let v = 0;
      for (const k of keys) {
        if (t < k.at) break;
        const target = k.values[l];
        if (target === undefined) continue;
        v = v + (target - v) * ease(t, k.at, k.at + (k.count ?? 1.2));
      }
      return v;
    };
    const finals = letters.filter((l) => cars[l]).map((l) => ({l, v: valueAt(l)}));
    const winner = p.winnerAt !== undefined && t >= p.winnerAt ? finals.reduce((a, b) => (b.v < a.v ? b : a), finals[0])?.l : undefined;
    const winK = p.winnerAt !== undefined ? ease(t, p.winnerAt, p.winnerAt + 0.3) : 0;
    readouts = finals.map(({l, v}, i) => {
      const shaft = letters.indexOf(l);
      const st = carStateAt(cars[l], t);
      const [sx, sy] = proj([L.shaftX[shaft], levelYAt(L, st.level) + D.car.h + 1.15, D.car.front]);
      const inK = ease(t, keys[0].at + i * 0.2, keys[0].at + i * 0.2 + 0.35) * out;
      if (inK <= 0.001) return null;
      const win = winner === l;
      return (
        <div
          key={l}
          style={{
            position: 'absolute',
            left: sx,
            top: sy,
            transform: `translate(-50%, -100%) translateY(${(1 - inK) * 6}px)`,
            opacity: inK,
            background: paper,
            border: `3px solid ${ink}`,
            padding: '2px 10px 4px 8px',
            display: 'flex',
            alignItems: 'baseline',
            gap: 8,
            boxShadow: win ? `0 ${Math.round(7 * winK)}px 0 ${section.orange}` : undefined,
          }}
        >
          <span style={{fontFamily: fonts.mono, fontWeight: 700, fontSize: 18, color: ink, letterSpacing: '0.1em'}}>{l}</span>
          <span style={{fontFamily: fonts.sans, fontWeight: 700, fontSize: 36, color: ink, lineHeight: 1.05, fontVariantNumeric: 'tabular-nums'}}>
            {Math.round(v)}
          </span>
          <span style={{fontFamily: fonts.sans, fontWeight: 600, fontSize: 22, color: ink}}>{p.scoreUnit ?? 's'}</span>
        </div>
      );
    });
  }

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <g fill="none" stroke={ink} strokeWidth={3} strokeDasharray="12 8" strokeLinejoin="miter">
          {previews}
        </g>
      </svg>
      {readouts}
    </AbsoluteFill>
  );
};
