import React, {useMemo} from 'react';
import {AbsoluteFill, random, useCurrentFrame, useVideoConfig} from 'remotion';
import * as THREE from 'three';
import {CAST, MOODS, section, WINTER, type Mood} from '../theme';
import {mixHex} from '../three/section/moods';
import {ease, framingAtKeys, keyedValue, type CameraKey, type Keyed} from './keyframes';
import type {Gesture} from '../three/rig';
import {HEAT_COLOR, HeatFlow, HeatWisps, InkBracket, InkGauge, runs, type WispState} from '../three/real/HeatKit';
import {
  AirHandler,
  CutSpaceHeater,
  FEED,
  flowOn,
  GroundSnow,
  HeaterCord,
  heaterFeed,
  HOUSE,
  HOUSE_SNOW,
  LINE_SET,
  LineSet,
  ride,
  lockedSpin,
  lockOmega,
  loopPeriod,
  loopWisps,
  MeterDisconnect,
  OutdoorUnit,
  Register,
  STRIP_FEED,
  SUCTION,
  SUPPLY,
  type FlowOn,
} from '../three/real/HouseHeat';
import {RealLivingRoom} from '../three/real/RealLivingRoom';
import {SlicedCar, type SlicedCarOptions, type SlicedCarProps} from '../three/real/SlicedCar';
import {InkLine} from '../three/section/cutLook';
import {Figure} from '../three/section/Figure';
import {HouseShell} from '../three/section/HouseShell';
import {formatOf, SECTION_ANGLE, SectionCamera, sectionCameraAt, type Framing} from '../three/section/SectionCamera';
import {SectionLights, SectionStage} from '../three/section/SectionStage';
import {Snow} from '../three/section/Snowfall';
import {skyTexture} from '../three/section/textures';
import {raw, roundedBox} from '../three/plaster';

type V3 = [number, number, number];

/*
 * H, the house (No. 018 `home-heat`, N1–N10; style guide § 3 The Section, § 5 One system per video and System heat
 * near the cast, § 3 In-set ink gauge, Winter and heat parts). One single-storey US house with a basement and a gable
 * roof, cut open front to back, on one winter night (Day available): the living room (YOU on the couch with a phone,
 * the floor lamp, a space heater by the couch, the floor register, a window in the left wall, a small ink
 * thermometer), the basement (the air handler with backup strips, the panel), the cut ground; beside it on the right
 * the outdoor unit on its pad (cut open), the line set into the basement, the meter and the disconnect on the wall,
 * the air thermometer on a post; past it the driveway with YOU's EV, cut along its length, parked. Snow on the ground,
 * the roof, the pad and the car, a light snowfall.
 *
 * Orange is the heat and the energy spent making or moving it (the A/V script's system line): meter → disconnect →
 * compressor (w), the wisps pulled from the night air into the coil, the suction line after the boil, the line set
 * after the compressor, the A-coil, the warm air up the trunk and from the register; the outlet → cord → space heater,
 * its element and warm air; the panel → strips, their glow; the window leak. Widths carry the units (N8): the feed is
 * w, the line set `level` × w, the suction (level − 1) × w. Times are seconds into the scene; keys are `Keyed`.
 *
 * Loop-safe (N9): every periodic motion (fan, scroll, blower, the heater's fan, flow dots, wisps, liquid streaks,
 * snow, the meter, the lamp's breathing) is rounded to whole cycles over the video, so the last frame equals frame 0
 * when the state keys agree; the snow's gusts carry across scenes (`snowCarry`, set by the Explainer) and the last
 * scene undoes their push; the last scene's YOU runs on frame 0's idle clock.
 */

export type HouseFraming =
  | 'house'
  | 'room'
  | 'window'
  | 'yard'
  | 'air'
  | 'coil'
  | 'gauges'
  | 'fins'
  | 'tubes'
  | 'compressor'
  | 'indoor'
  | 'feed'
  | 'heater'
  | 'loopWide'
  | 'thermo'
  | 'basement'
  | 'drive'
  | 'cabin'
  | 'nose';

/** The framings (look-at + distance at the fixed angle; set on test stills). */
export const HOUSE_FRAMINGS: Record<HouseFraming, Framing> = {
  house: {look: [0.62, 1.0, 0.0], distance: 40.5},
  room: {look: [-0.94, 0.82, 0.27], distance: 18.7},
  window: {look: [-2.93, 1.66, 1.21], distance: 9.2},
  yard: {look: [3.82, 0.58, 0.41], distance: 13.5},
  air: {look: [4.83, 0.83, 0.28], distance: 8.8},
  coil: {look: [4.11, 0.43, 0.12], distance: 6.0},
  gauges: {look: [4.79, 0.93, 0.27], distance: 8.4},
  fins: {look: [4.29, 0.45, -0.03], distance: 4.8},
  tubes: {look: [4.16, 0.52, 0.0], distance: 3.7},
  compressor: {look: [3.98, 0.37, 0.14], distance: 3.7},
  indoor: {look: [-0.8, -0.46, 1.16], distance: 21.7},
  feed: {look: [3.35, 0.75, 0.42], distance: 7.9},
  heater: {look: [-1.39, 0.74, -1.42], distance: 3.6},
  loopWide: {look: [1.6, -0.78, 1.38], distance: 28.7},
  thermo: {look: [4.79, 0.86, 0.24], distance: 8.2},
  basement: {look: [-1.82, -0.8, 1.76], distance: 16.8},
  drive: {look: [9.44, 0.39, 0.99], distance: 20.8},
  cabin: {look: [9.1, 0.49, 1.0], distance: 10.3},
  nose: {look: [8.24, 0.31, 0.93], distance: 15.7},
};

/** A camera key by framing name (its look and distance, `distance` overriding), or a plain `CameraKey`. */
export type HouseCameraKey = CameraKey | {at: number; framing: HouseFraming; distance?: number; ease?: CameraKey['ease']};

/** An ink thermometer (§ 3 In-set ink gauge, N10): its fill in °F on a true scale, no digits, never orange. */
export type HouseThermo = {
  /** The reading (°F), a constant or keys. */
  f?: Keyed;
  /** Shown (0 → 1, the ink draws on as opacity), a constant or keys. */
  show?: Keyed;
  /** The scale (°F at the foot, at the top). Defaults: outdoor −20 → 50 (air, coil), indoor −20 → 130 (hot, room). */
  range?: [number, number];
  /** Where its foot stands (world) and its height (m). Defaults per thermometer (`HOUSE`). */
  at?: V3;
  height?: number;
  /** Unlabelled marks at these readings (°F). Air default: 40, 30, 5, −6, −13. */
  marks?: number[];
  /** A range band beside the tube between two readings (°F), drawn on (`draw`) with its end ticks (`ends`). */
  band?: {from?: number; to?: number; draw?: Keyed; ends?: [Keyed, Keyed]};
  /** Short ticks drawn on at readings (°F), e.g. "settles at 30 with a small tick". */
  flags?: {f: number; k: Keyed}[];
};

export type HouseHeatPumpKeys = {
  /** Running, 0 → 1 (constant or keys): the fan, the scroll, the liquid's streaks, the flows' glow, wisps born. Default 1. */
  run?: Keyed;
  /** The indoor width in units of w (constant or keys): 2.5 at 30°F (default), 3 at 40°F, 1.5 at −6°F, 1.2 before the shut-off. The feed stays w; the wisps and the suction carry level − 1. */
  level?: Keyed;
  /** The shut-off at `at` (s): the fan winds down over 1.0 s, the wisps stop, the feed fades, the flow fades along the suction and the line set from the unit toward the house, the A-coil and the warm air after it; the scroll stops. Null: none. */
  cutoff?: {at: number} | null;
  /** Each flow on (true, default), off (false) or drawn on / faded by keys (`{at, drawFor?, fadeAt?, fadeFor?}`; `at` ≤ −0.5: already drawn). */
  flows?: {feed?: FlowOn; intake?: FlowOn; suction?: FlowOn; hot?: FlowOn; coil?: FlowOn; supply?: FlowOn};
  /** Feed pulses (s): a surge runs along the feed (it stays w). */
  pulses?: number[];
  /** Intake pulses (s): the wisps swell for 0.6 s. */
  intakePulses?: number[];
  /** Line-set surges (s). */
  hotPulses?: number[];
  /** Still heat held in the night air: faint wisps all through the open air beside the unit (≈ 10 %), 0 → 1. Default 0. */
  air?: Keyed;
  /** The air's wisps drift into the coil, 0 (still, zero drift) → 1 (drawn in: the intake). Default 1. */
  pull?: Keyed;
  /** Bubbles, then vapour streaks in the cut tubes, 0 → 1. Default 0. */
  boil?: Keyed;
  /** The liquid's streaks moving in the cut tubes, 0 → 1. Default: with the fan. */
  liquid?: Keyed;
  /** Snow settled on the stopped fan's grille, 0 → 1. Default 0. */
  grilleSnow?: Keyed;
};

export type HouseSliceSceneProps = {
  durationInFrames: number;
  /** Night (default) or Day. */
  mood?: Mood;
  framing?: HouseFraming;
  camera?: {from: Framing; to?: Framing};
  /** Glides inside the scene: by framing name (`{at, framing}`) or plain camera keys. */
  cameraKeys?: HouseCameraKey[];
  /** Push toward the subject, units/s (default 0.04). */
  push?: number;
  /** Idle sideways drift (default 0: it would break the loop). */
  drift?: number;
  /** Falling snow: density (constant or keys; default 1), gusts (s, a 1.4 s push each), flake size cap (px). False: none. */
  snow?: {density?: Keyed; gusts?: number[]; maxPx?: number} | false;
  /** Set by the Explainer: gusts in the scenes before this one (their push carries on). */
  snowCarry?: number;
  /** YOU on the couch: gestures (rig poses, scene seconds), the phone (default true, screen toward YOU), its screen. False: no one. */
  you?: {gestures?: Gesture[]; phone?: boolean; screenOn?: Keyed} | false;
  /** N4: the heat pump. */
  heatPump?: HouseHeatPumpKeys;
  /** N3: the air handler's blower (default: with the warm air), the backup strips (0 → 1, default 0) and their feed from the panel (default: drawn with the strips). */
  airHandler?: {blower?: Keyed; strips?: Keyed; stripFeed?: FlowOn};
  /** N2: the space heater: power (pilot lamp and fan), the element's glow, the feed outlet → cord → element, the warm air. All default 0 / off. */
  heater?: {power?: Keyed; glow?: Keyed; feed?: FlowOn; wisps?: Keyed};
  /** N5: the window leak, 0 → 1: room wisps drift to the left window and out through the glass, fading in the night. Default 0. */
  leak?: Keyed;
  /** N10: the ink thermometers and the bracket between the air and coil readings. */
  thermo?: {air?: HouseThermo; coil?: HouseThermo & {under?: Keyed}; hot?: HouseThermo; hotIndoor?: HouseThermo; room?: HouseThermo; bracket?: {draw?: Keyed; ends?: [Keyed, Keyed]}};
  /** N6: YOU's EV in the driveway, parked: any `SlicedCar` option (`hvac`, `heatPump`, …) over the parked crossover. False: none. */
  ev?: Partial<SlicedCarOptions> | false;
  /** N8: × the base line width w (brand-director's value). Default 1. */
  lineScale?: number;
  /** Neighbours' houses far behind (default true). */
  neighbours?: boolean;
  /** The floor lamp's level (Night), default 1. */
  lamp?: number;
  /** The last scene (closes the loop: the snow's gusts undone, YOU on frame 0's clock). Default: when the scene ends the video. */
  loopEnd?: boolean;
  /** Set by the Explainer: the video's length in frames (periodic motion is rounded to it so the last frame is frame 0). */
  videoFrames?: number;
  location?: string;
  transition?: 'auto' | 'continue' | 'glide' | 'cut' | 'dissolve' | 'slide' | 'follow';
  glide?: number;
  cameraFrom?: Framing;
  cameraGlide?: number;
  startFrame?: number;
};

const toKeys = (ks: HouseCameraKey[]): CameraKey[] =>
  ks.map((k) => {
    if ('framing' in k) {
      const f = HOUSE_FRAMINGS[k.framing];
      return {at: k.at, look: f.look, distance: k.distance ?? f.distance, ease: k.ease};
    }
    return k;
  });

const houseMove = (p: Partial<HouseSliceSceneProps>, d: number, fps: number, frame?: number) => {
  const preset = HOUSE_FRAMINGS[p.framing ?? 'house'];
  if (p.cameraKeys && p.cameraKeys.length) {
    const base = p.cameraFrom ?? p.camera?.from ?? preset;
    const f = framingAtKeys(toKeys(p.cameraKeys), base, frame === undefined ? Infinity : frame / fps);
    return {from: f, to: f, pre: undefined};
  }
  const pre =
    p.cameraGlide && p.cameraFrom ? {from: p.cameraFrom, hold: 0, move: Math.max(1, Math.round(p.cameraGlide * fps)), ease: 'cubic' as const} : undefined;
  if (p.camera) return {from: p.camera.from, to: p.camera.to ?? p.camera.from, pre};
  const secs = Math.max(0, d - (pre ? pre.move : 0)) / fps;
  const c = pre ? undefined : p.cameraFrom;
  const same = c && c.look.every((v, i) => Math.abs(v - preset.look[i]) < 1e-6);
  const from = c && same ? c : preset;
  return {from, to: {look: from.look, distance: from.distance - (p.push ?? 0.04) * secs}, pre};
};

export const houseCameraStart = (p: Partial<HouseSliceSceneProps>, d: number, fps: number): Framing =>
  houseMove({...p, cameraFrom: undefined, cameraGlide: undefined}, d, fps, 0).from;
export const houseCameraEnd = (p: Partial<HouseSliceSceneProps>, d: number, fps: number): Framing => houseMove(p, d, fps).to;
/** What a continuing scene carries: the snow's gusts so far. */
export const houseCarry = (p: Partial<HouseSliceSceneProps>): Record<string, unknown> => ({
  snowCarry: (p.snowCarry ?? 0) + (p.snow ? (p.snow.gusts?.length ?? 0) : 0),
});

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
/** The camera's yaw (rad): thermometers and brackets face the camera. */
const FACE_YAW = Math.atan2(SECTION_ANGLE[0], SECTION_ANGLE[2]);

/**
 * The house's warm-air wisps, per-wisp opacity caps per group (brand v0.18.13: ≤ 25 % summed toward orange, bloom
 * included). Visible like ev-winter's intake halo (the review found 0.08 a dark smear on the night), kept under the sum
 * by spacing the wisps so few overlap: the air and intake wisps and the window leak sparse and bright, the register's
 * (which rise in one column and stack) lower.
 */
const WISP_CAP = {air: 0.17, leak: 0.18, register: 0.18, heater: 0.14};

/** The intake's node dot on the right coil's face (§ 5 node dots at every device the system touches). */
const CoilNode: React.FC<{k: number; r: number}> = ({k, r}) => {
  const mat = useMemo(() => new THREE.MeshBasicMaterial({color: raw(HEAT_COLOR), transparent: true}), []);
  React.useEffect(() => () => mat.dispose(), [mat]);
  mat.opacity = clamp01(k);
  return (
    <mesh position={[HOUSE.unit.x1 + 0.012, 0.69, 0.12]} material={mat} userData={{glow: true}} renderOrder={6}>
      <sphereGeometry args={[r, 14, 10]} />
    </mesh>
  );
};
/**
 * The wisps' orange divided by the mood's exposure (`raw` reads hex as linear, so the scale is exact): it then shows
 * as `HEAT_COLOR` itself, and a wisp's opacity is what the pixel moves toward orange before bloom (at Night the × 1.4
 * exposure otherwise lifted a 0.24 halo to ≈ 0.34). Derived from the token, not a new colour.
 */
const wispColor = (exposure: number) =>
  `#${[1, 3, 5].map((i) => Math.round(Math.min(255, parseInt(HEAT_COLOR.slice(i, i + 2), 16) / exposure)).toString(16).padStart(2, '0')).join('')}`;
/**
 * YOU's top in this house (review: the jumper read ≈ 28 % luminance at Night, under the § 2 subject floor): a tone of
 * `CAST.you.top` mixed 30 % toward `section.cut` (22 % read 33.9 % close but ≈ 28 % at 'house'), the same cobalt, lighter. Other videos keep the cast's own.
 */
const YOU_TOP = mixHex(CAST.you.top, section.cut, 0.3);

/** N8: the base line width w (core radius, m) at a camera distance: ≈ 3.5 px core from 8 to 48 m, up to ≈ 2.7× closer. */
export const houseLineWidth = (camD: number, scale = 1) => 0.0135 * Math.max(0.25, Math.min(1.5, camD / 32)) * scale;

/** N1: the house slice (see the file comment). */
export const HouseSliceScene: React.FC<HouseSliceSceneProps> = (props) => {
  const {durationInFrames, mood = 'night', startFrame = 0} = props;
  const frame = useCurrentFrame();
  // inside the Explainer's Sequence `useVideoConfig` gives the scene's length: the video's comes as `videoFrames`
  const {fps, durationInFrames: seqFrames} = useVideoConfig();
  const total = props.videoFrames ?? Math.max(seqFrames, (props.startFrame ?? 0) + durationInFrames);
  const t = frame / fps;
  const {from, to, pre} = houseMove(props, durationInFrames, fps, frame);
  const cam = sectionCameraAt({from, to, pre, frame, fps, durationInFrames, drift: props.drift ?? 0, clockOffset: startFrame / fps, format: formatOf(props)});
  const camD = cam.position.distanceTo(cam.look);
  const inkK = Math.max(0.15, Math.min(4, camD / 12.75));
  return (
    <AbsoluteFill>
      <SectionStage mood={mood} post={{focusY: 0.5, aoRadius: 0.3}} ao far={260}>
        <SectionCamera from={from} to={to} pre={pre} durationInFrames={durationInFrames} drift={props.drift ?? 0} clockOffset={startFrame / fps} fitClip farMin={200} />
        <SectionLights mood={mood} target={[2.5, 0.2, 0]} lampAt={HOUSE.lampLight} extent={9} lamp={props.lamp ?? 1} />
        <HouseWorld {...props} mood={mood} t={t} fps={fps} total={total} camD={camD} inkK={inkK} cam={cam.position} />
      </SectionStage>
    </AbsoluteFill>
  );
};

type WorldProps = HouseSliceSceneProps & {mood: Mood; t: number; fps: number; total: number; camD: number; inkK: number; cam: THREE.Vector3};

/** The heat pump's state at t (scene seconds): fan speed keys, flows' draw and glow, widths. */
const pumpState = (hp: HouseHeatPumpKeys, t: number) => {
  const run = (x: number) => clamp01(keyedValue(hp.run, x, 1));
  const C = hp.cutoff?.at;
  const after = (a: number, b: number) => (C === undefined ? 0 : ease(t, C + a, C + b));
  const level = Math.max(1, keyedValue(hp.level, t, 2.5));
  const fl = hp.flows ?? {};
  const feed = flowOn(fl.feed, t);
  const intake = flowOn(fl.intake, t);
  const suction = flowOn(fl.suction, t);
  const hot = flowOn(fl.hot, t);
  const coil = flowOn(fl.coil, t);
  const supply = flowOn(fl.supply, t);
  const r = run(t);
  // the fan's speed keys (the run keys, then the shut-off's wind-down)
  const runKeys = hp.run === undefined ? [{at: 0, value: 1}] : typeof hp.run === 'number' ? [{at: 0, value: hp.run}] : hp.run;
  const fanKeys: Keyed = C === undefined ? runKeys : [...runKeys.filter((k) => k.at < C), {at: C, value: run(C)}, {at: C + 1.0, value: 0}];
  const pulse = (ts: number[] | undefined) => (ts ?? []).reduce((a, p) => Math.max(a, t > p && t < p + 0.8 ? Math.sin(((t - p) / 0.8) * Math.PI) : 0), 0);
  return {
    run,
    r,
    C,
    level,
    fanKeys,
    feed: {p: feed.p, g: feed.g * r * (1 - after(0, 0.6)), surge: pulse(hp.pulses)},
    intake: {g: intake.g * intake.p, cutoffAt: C},
    suction: {p: suction.p, g: suction.g * r, from: after(0.1, 0.8)},
    hot: {p: hot.p, g: hot.g * r, from: after(0.3, 1.6), surge: pulse(hp.hotPulses)},
    coil: coil.g * coil.p * r * (1 - after(1.3, 1.9)),
    supply: supply.g * supply.p * r * (1 - after(1.5, 2.3)),
    supplyRunAt: (x: number) => run(x) * (C === undefined || x < C + 1.6 ? 1 : 0) * flowOn(fl.supply, x).g * flowOn(fl.supply, x).p,
    intakePulse: pulse(hp.intakePulses),
  };
};

const HouseWorld: React.FC<WorldProps> = (props) => {
  const {mood, t, fps, total, camD, inkK, startFrame = 0} = props;
  const m = MOODS[mood];
  const start = startFrame / fps;
  const vt = start + t;
  // the loop: the video's last frame equals its first (N9)
  const LOOP = Math.max(1, total - 1) / fps;
  const isLast = props.loopEnd ?? startFrame + props.durationInFrames >= total - 1;
  const hp = props.heatPump ?? {};
  const ps = pumpState(hp, t);
  const w = houseLineWidth(camD, props.lineScale ?? 1);
  const per = (p: number) => loopPeriod(p, LOOP);

  // ---- spins, phase-locked to the video
  const fanAngle = lockedSpin({k: ps.fanKeys, t, start, omega: lockOmega(0.9, 3, LOOP), sym: 3});
  const scrollAngle = lockedSpin({k: ps.fanKeys, t, start, omega: lockOmega(1.6, 1, LOOP), sym: 1});
  const fanNow = clamp01(keyedValue(ps.fanKeys, t, 1));
  const ah = props.airHandler ?? {};
  const strips = clamp01(keyedValue(ah.strips, t, 0));
  const stripFeed = flowOn(ah.stripFeed, t, true);
  const supplyW = ps.level * ps.supply + strips;
  // the blower runs while warm air goes up the trunk (from the heat pump or the strips), unless keyed
  const blowerKeys: Keyed = ah.blower ?? Math.min(1, ps.supply + strips);
  const blowerAngle = lockedSpin({k: blowerKeys, t, start, omega: lockOmega(0.8, 18, LOOP), sym: 18});
  const htr = props.heater ?? {};
  const power = clamp01(keyedValue(htr.power, t, 0));
  const heaterFan = lockedSpin({k: htr.power ?? 0, t, start, omega: lockOmega(1.9, 5, LOOP), sym: 5, dflt: 0});
  const heaterGlow = clamp01(keyedValue(htr.glow, t, 0));
  const heaterFeedOn = flowOn(htr.feed, t, false);

  // ---- warm air
  const loopW = (s: Parameters<typeof loopWisps>[0], lvl: (x: number) => number, keepAll = false) => loopWisps(s, vt, LOOP, (x) => lvl(x - start), keepAll);
  // the register's warm air: single soft halos (one layer each), from the supply flow's arrival at the register
  const registerHalos = registerAir(hp, ps, ah, start, vt, LOOP);
  const heaterWisps = loopW(
    {
      from: [
        [HOUSE.heater[0] + 0.12, HOUSE.floor + 0.22, HOUSE.heater[2] - 0.14],
        [HOUSE.heater[0] + 0.16, HOUSE.floor + 0.38, HOUSE.heater[2] - 0.02],
      ],
      velocity: [0.3, 0.2, 0.05],
      every: 0.25,
      life: 1.6,
      size: [0.03, 0.08],
      reach: 0.5,
      // they dissolve ≥ 0.15 m before YOU's right side (§ 5 System heat near the cast)
      stopX: {x: HOUSE.you[0] - 0.44, side: 1, soft: 0.12},
      seed: 'hh-heater',
    },
    (x) => clamp01(keyedValue(htr.wisps, x, 0)),
    true,
  );
  const leakLanes = leakAir(props.leak, start, vt, LOOP);
  const airWisps = useAirWisps(hp, ps, t, start, vt, LOOP);
  const intake = intakeLanes(hp, ps, start, vt, LOOP);
  // the coil's node dot: lit from the first wisp's arrival, while the intake runs
  const nodeK = (Number.isFinite(intake.firstArrival) ? ease(vt, intake.firstArrival, intake.firstArrival + 0.15) : 0) * clamp01(flowOn(hp.flows?.intake, t).g * ps.r) * (ps.C === undefined ? 1 : 1 - ease(t, ps.C, ps.C + 0.6));
  // the streaks grow a little with the camera distance (1 at 'fins', at most 1.6): farther out they shrink on screen
  const laneScale = Math.max(1, Math.min(1.6, camD / 4.8));

  // ---- thermometers (N10)
  const th = props.thermo ?? {};
  const frac = (f: number, r: [number, number]) => clamp01((f - r[0]) / (r[1] - r[0]));
  const OUT: [number, number] = [-20, 50];
  const IN: [number, number] = [-20, 130];
  const airF = keyedValue(th.air?.f, t, 30);
  const coilF = th.coil?.f !== undefined ? keyedValue(th.coil.f, t, 15) : airF - keyedValue(th.coil?.under, t, 15);
  const gauge = (key: string, o: HouseThermo | undefined, dflt: {f: number; show: number; at: V3; height: number; range: [number, number]; marks?: number[]; band?: [number, number]}) => {
    const show = clamp01(keyedValue(o?.show, t, dflt.show));
    if (show < 0.02) return null;
    const range = o?.range ?? dflt.range;
    const f = dflt.f;
    const at = o?.at ?? dflt.at;
    const H = o?.height ?? dflt.height;
    const b = o?.band;
    const bandFrom = b?.from ?? dflt.band?.[0] ?? 5;
    const bandTo = b?.to ?? dflt.band?.[1] ?? -13;
    const k = Math.max(1, Math.min(3.5, camD / 6)) * (H / 1.5) ** 0.3;
    return (
      <group key={key} position={at} rotation={[0, FACE_YAW, 0]}>
        <InkGauge
          kind="thermo"
          level={frac(f, range)}
          at={[0, 0, 0]}
          height={H}
          mood={mood}
          k={k}
          opacity={show}
          marks={(o?.marks ?? dflt.marks ?? []).map((v) => frac(v, range))}
          band={b ? {from: frac(bandFrom, range), to: frac(bandTo, range), draw: clamp01(keyedValue(b.draw, t, 1)), ends: [clamp01(keyedValue(b.ends?.[0], t, 1)), clamp01(keyedValue(b.ends?.[1], t, 1))]} : undefined}
          flags={(o?.flags ?? []).map((fl) => ({at: frac(fl.f, range), k: clamp01(keyedValue(fl.k, t, 1))}))}
        />
      </group>
    );
  };
  const airH = th.air?.height ?? 1.5;
  const coilH = th.coil?.height ?? 1.5;

  // ---- the EV
  const ev = props.ev === false ? null : props.ev ?? {};
  const car: Partial<SlicedCarProps> | null = ev
    ? {
        variant: 'ev',
        shape: 'crossover',
        driving: [{at: 0, speed: 0}],
        driverShown: false,
        chargePort: null,
        packCharge: null,
        clusterBlank: true,
        dressing: 'winter',
        nearWheels: 'whole',
        ...ev,
        ground: false,
        road: 'street',
      }
    : null;

  // ---- materials owned by the scene
  const mats = useMemo(
    () => ({
      sky: new THREE.MeshBasicMaterial({map: skyTexture(mood), fog: false}),
      shade: new THREE.MeshStandardMaterial({emissive: raw(MOODS.night.lamp!.glow), emissiveIntensity: 0, roughness: 0.9, side: THREE.DoubleSide}),
    }),
    [mood],
  );
  mats.sky.color.setScalar(1 / m.exposure);
  mats.shade.color.copy(raw(m.shade));
  const breathe = 1 + 0.03 * Math.sin((vt / per(4.5)) * Math.PI * 2);
  mats.shade.emissiveIntensity = m.lamp ? m.lamp.glowIntensity * 0.12 * (props.lamp ?? 1) * breathe : 0;

  // ---- YOU
  const you = props.you === false ? null : props.you ?? {};
  const figClock = isLast ? start - LOOP : start;
  const meterTurns = (Math.round(0.06 * LOOP) / LOOP) * vt;

  // ---- snow
  const snow = props.snow === false ? null : props.snow ?? {};
  const gustsV = snow ? [...Array(props.snowCarry ?? 0).fill(-1000), ...(snow.gusts ?? []).map((g) => start + g)] : [];
  const carAt = HOUSE.car;
  const holes: [V3, V3][] = [
    [
      [HOUSE.x0 - 0.45, -1, HOUSE.zb - 0.4],
      [HOUSE.x1 + 0.45, HOUSE.ridge + 0.25, HOUSE.zf + 0.05],
    ],
    [
      [HOUSE.unit.x0 - 0.05, 0, HOUSE.unit.zb - 0.05],
      [HOUSE.unit.x1 + 0.05, HOUSE.unit.y1 + 0.05, HOUSE.unit.zc + 0.4],
    ],
    ...(car
      ? ([
          [
            [carAt[0] - 2.5, 0, carAt[2] - 1.0],
            [carAt[0] + 2.5, 2.05, carAt[2] + 0.85],
          ],
        ] as [V3, V3][])
      : []),
  ];
  const lvl = ps.level;
  const hotFlowR = w * lvl;
  const dots = per(1.5);
  return (
    <>
      <mesh position={[3, 10, -70]} material={mats.sky}>
        <planeGeometry args={[260, 140]} />
      </mesh>
      <HouseShell mood={mood} ink={inkK} boot={[HOUSE.ah.x0 + 0.13, HOUSE.ah.x1 - 0.13]} neighbours={props.neighbours ?? true} />
      <GroundSnow tracks />
      {/* the living room: couch, table, cup, rug, plant, floor lamp (realistic), the register, YOU */}
      <group position={HOUSE.living}>
        {/* no plant and no mug in this house: their glazed clearcoat glints read 255 under the Night key and the lamp
            (brand v0.18.13; a glint is allowed on glass and metal only): `RealLivingRoom` draws the plant under the floor and
            the mug inside the couch's back (it sets the mug's height from the table) */}
        <RealLivingRoom palette={m} couchZ={-0.65} table={[0, 0.44, 0.6]} cup={[0, 0, -1.0]} plant={[0, -20, 0]} lamp={HOUSE.lamp} shade={mats.shade} />
      </group>
      <Register />
      {you ? (
        <Figure
          who="you"
          mood={mood}
          position={HOUSE.you}
          phone={you.phone ?? true}
          screenOn={clamp01(keyedValue(you.screenOn, t, 1))}
          gestures={you.gestures ?? [{pose: 'scroll', at: -1}]}
          phoneModel="real"
          look={{top: YOU_TOP}}
          clockOffset={figClock}
        />
      ) : null}
      {/* the space heater left of the couch (faces YOU; mirrored so its cut faces the camera: it has no handedness), its cord */}
      <group position={HOUSE.heater} rotation={[0, Math.PI / 2, 0]} scale={HOUSE.heaterScale}>
        <group scale={[-1, 1, 1]}>
          <CutSpaceHeater palette={m} power={power} fanAngle={heaterFan} glow={heaterGlow} ink={inkK} />
        </group>
      </group>
      <HeaterCord />
      {/* the basement and the yard: the air handler, the line set, the unit, the meter */}
      <AirHandler blowerAngle={blowerAngle} coil={ps.coil} strips={strips} ink={inkK} />
      <LineSet />
      <OutdoorUnit
        fanAngle={fanAngle}
        scrollAngle={scrollAngle}
        flowClock={vt}
        liquid={clamp01(keyedValue(hp.liquid, t, fanNow))}
        boil={clamp01(keyedValue(hp.boil, t, 0))}
        grilleSnow={clamp01(keyedValue(hp.grilleSnow, t, 0))}
        ink={inkK}
        loop={LOOP}
        exposure={m.exposure}
      />
      <MeterDisconnect meterTurns={meterTurns} />
      {/* the air thermometer's post */}
      <mesh position={[HOUSE.post[0], 0.25, HOUSE.post[2]]}>
        <cylinderGeometry args={[0.02, 0.02, 0.5, 10]} />
        <meshStandardMaterial color={raw(section.cutLine)} roughness={0.6} />
      </mesh>
      {/* the basement's bulb (Night) */}
      <pointLight position={HOUSE.bulb} color={raw(m.lamp?.light ?? '#000000')} intensity={m.lamp ? m.lamp.intensity * 0.9 * 0.75 : 0} distance={3.2} decay={1} />
      {/* ---- the system (orange): the heat pump's flows */}
      {ps.feed.p > 0 && ps.feed.g > 0.01 ? <HeatFlow legs={runs(ride(FEED, 0.016 + w, SECTION_ANGLE))} progress={ps.feed.p} glow={ps.feed.g} radius={w} surge={ps.feed.surge} flow={vt / dots} dots={3} /> : null}
      {ps.suction.p > 0 && ps.suction.g > 0.01 && lvl > 1.02 ? (
        <HeatFlow legs={runs(ride(SUCTION, 0.018 + w * (lvl - 1), SECTION_ANGLE))} progress={ps.suction.p} from={ps.suction.from} glow={ps.suction.g} radius={w * (lvl - 1)} flow={vt / dots} dots={2} nodes={false} />
      ) : null}
      {ps.hot.p > 0 && ps.hot.g > 0.01 ? (
        <HeatFlow
          legs={runs(ride(LINE_SET, 0.032 + hotFlowR, SECTION_ANGLE))}
          progress={ps.hot.p}
          from={ps.hot.from}
          glow={ps.hot.g}
          radius={hotFlowR}
          surge={ps.hot.surge}
          flow={vt / per(3.0)}
          dots={8}
        />
      ) : null}
      {supplyW > 0.02 ? <HeatFlow legs={runs(SUPPLY)} glow={Math.min(1, supplyW)} radius={w * supplyW} flow={vt / dots} dots={2} /> : null}
      {strips > 0.01 || (typeof ah.stripFeed === 'object' && stripFeed.p > 0) ? (
        <HeatFlow legs={runs(ride(STRIP_FEED, 0.013 + w, SECTION_ANGLE))} progress={typeof ah.stripFeed === 'object' ? stripFeed.p : 1} glow={(typeof ah.stripFeed === 'object' ? stripFeed.g : strips) * (ah.stripFeed === false ? 0 : 1)} radius={w} flow={vt / dots} dots={3} />
      ) : null}
      {heaterFeedOn.p > 0 && heaterFeedOn.g > 0.01 ? <HeatFlow legs={runs(ride(heaterFeed(), 0.008 + w, SECTION_ANGLE))} progress={heaterFeedOn.p} glow={heaterFeedOn.g} radius={w} flow={vt / per(1.0)} dots={3} /> : null}
      {/* brand v0.18.13: each wisp capped at 0.12 so overlapping wisps (and their bloom) stay ≤ 25 % toward orange */}
      {/* the still air's round halos, and the streaks drawn in (they converge on the coil, so a lower cap) */}
      <HeatWisps wisps={airWisps.filter((q) => !q.dir)} max={WISP_CAP.air} color={wispColor(m.exposure)} />
      <IntakeStreaks lanes={intake.lanes} color={wispColor(m.exposure)} scale={laneScale} />
      {nodeK > 0.01 ? <CoilNode k={nodeK} r={w * 2.1} /> : null}
      <RoundHalos halos={registerHalos} max={WISP_CAP.register} color={wispColor(m.exposure)} />
      <HeatWisps wisps={heaterWisps} max={WISP_CAP.heater} color={wispColor(m.exposure)} />
      <IntakeStreaks lanes={leakLanes} color={wispColor(m.exposure)} scale={Math.max(1, Math.min(2, camD / 4.8))} />
      {/* ---- thermometers (N10) and the bracket */}
      {gauge('air', th.air, {f: airF, show: 1, at: HOUSE.airThermo, height: airH, range: OUT, marks: [40, 30, 5, -6, -13]})}
      {gauge('coil', th.coil, {f: coilF, show: 0, at: HOUSE.coilThermo, height: coilH, range: OUT, marks: [40, 30, 5, -6, -13]})}
      {gauge('hot', th.hot, {f: keyedValue(th.hot?.f, t, 110), show: 0, at: HOUSE.hotThermo, height: 0.7, range: IN, marks: [30, 68]})}
      {gauge('hotIndoor', th.hotIndoor, {f: keyedValue(th.hotIndoor?.f, t, 105), show: 0, at: HOUSE.hotIndoorThermo, height: 1.0, range: IN, marks: [30, 68]})}
      {gauge('room', th.room, {f: keyedValue(th.room?.f, t, 68), show: 1, at: HOUSE.roomThermo, height: 0.55, range: IN, marks: [30, 68]})}
      {/* the coil thermometer's clip: an ink line from a cut tube on the right coil to the tube */}
      {clamp01(keyedValue(th.coil?.show, t, 0)) > 0.02 && !th.coil?.at ? (
        <InkLine
          points={[
            [HOUSE.unit.x1 - 0.055, 0.59, HOUSE.unit.zc + 0.01],
            [HOUSE.coilThermo[0] - 0.03, 0.59, HOUSE.coilThermo[2]],
          ]}
          closed={false}
          thickness={0.006 * Math.max(1, Math.min(3.5, camD / 6))}
        />
      ) : null}
      {th.bracket && clamp01(keyedValue(th.bracket.draw, t, 0)) > 0.01
        ? (() => {
            const aAt = th.air?.at ?? HOUSE.airThermo;
            const cAt = th.coil?.at ?? HOUSE.coilThermo;
            const foot = 0.035 * Math.max(0.6, Math.max(1, Math.min(3.5, camD / 6)));
            const yA = aAt[1] + foot + (airH - foot) * frac(airF, th.air?.range ?? OUT);
            const yC = cAt[1] + foot + (coilH - foot) * frac(coilF, th.coil?.range ?? OUT);
            const mid: V3 = [(aAt[0] + cAt[0]) / 2, 0, (aAt[2] + cAt[2]) / 2];
            return (
              <group position={[mid[0], 0, mid[2]]} rotation={[0, FACE_YAW, 0]}>
                <InkBracket
                  x={0.02}
                  y0={yC}
                  y1={yA}
                  z={0.01}
                  mood={mood}
                  k={Math.max(1, Math.min(3.5, camD / 6))}
                  draw={clamp01(keyedValue(th.bracket.draw, t, 0))}
                  ends={[clamp01(keyedValue(th.bracket.ends?.[0], t, 0)), clamp01(keyedValue(th.bracket.ends?.[1], t, 0))]}
                />
              </group>
            );
          })()
        : null}
      {/* ---- N6: YOU's EV, parked in the driveway (nose toward the house), snow on its roof and hood */}
      {car ? (
        <group position={[carAt[0], carAt[1] + HOUSE.snowT - 0.03, carAt[2]]}>
          <SlicedCar {...(car as SlicedCarProps)} mood={mood} startFrame={startFrame} cameraDistance={camD} />
          <CarSnow />
        </group>
      ) : null}
      {snow ? (
        <Snow
          t={vt}
          density={Math.max(0, keyedValue(snow.density, t, 1))}
          gusts={gustsV}
          y0={HOUSE.snowT}
          y1={9.5}
          mood={mood}
          maxPx={snow.maxPx ?? 6}
          cam={props.cam}
          box={{xW: 20, xC: 3.4, z0: HOUSE.gzb + 0.5, zD: HOUSE.zf - HOUSE.gzb - 0.5}}
          loop={LOOP}
          gustBack={isLast ? {from: start, to: start + Math.max(1, props.durationInFrames - 1) / fps} : undefined}
          holes={holes}
        />
      ) : null}
    </>
  );
};

/**
 * The still air's wisps (N4, scenes 1 and 3): born on a loop-safe grid in the open air beside the unit, round halos with
 * zero drift (the heat the air holds), a sparse scatter so they rarely overlap. As `pull` rises they fade and the intake
 * lanes (`intakeLanes`) take over.
 */
const useAirWisps = (hp: HouseHeatPumpKeys, _ps: ReturnType<typeof pumpState>, t: number, start: number, vt: number, LOOP: number): WispState[] => {
  const n = Math.max(1, Math.round(LOOP / 0.15));
  const every = LOOP / n;
  const life = 2.2;
  const out: WispState[] = [];
  const U = HOUSE.unit;
  const airK = clamp01(keyedValue(hp.air, t, 0)) * (1 - clamp01(keyedValue(hp.pull, t, 1)));
  if (airK < 0.01) return out;
  for (let k = Math.floor((vt - life) / every); k <= Math.floor(vt / every); k++) {
    const t0v = k * every;
    const age = vt - t0v;
    if (age < 0 || age > life) continue;
    const slot = ((k % n) + n) % n;
    const r = (q: string) => random(`hh-air-${slot}-${q}`);
    if (r('keepStill') > 0.5) continue;
    const right = r('side') < 0.75;
    const P0: V3 = right ? [U.x1 + 0.15 + 1.6 * r('x'), 0.15 + 2.0 * r('y'), -1.1 + 2.6 * r('z')] : [3.1 + 0.36 * r('x'), 0.2 + 1.7 * r('y'), -0.9 + 2.3 * r('z')];
    const sway = 0.02 * Math.sin(age * 2.2 + 6 * r('ph'));
    const op = ease(age, 0, 0.45) * (1 - ease(age / life, 0.6, 1)) * airK * 0.85;
    if (op < 0.01) continue;
    out.push({key: k, p: [P0[0], P0[1] + sway, P0[2]], r: 0.06 + 0.03 * r('s'), op});
  }
  return out;
};

/**
 * The intake (N4; brand v0.18.14): halo-only streaks on six lanes spread up the right coil's outer face, one wisp per
 * lane per cycle, a new one every 0.2 s (six in flight). Each slides in from above and outside at a slant, so on screen
 * its path lies over the dark coil face and the siding behind it, never mainly over snow or a cut face; it starts
 * ≈ 0.33 m out (≥ 250 px at 'fins') and ends on the fin face, travelling 1.2 s and easing in (speeding up into the
 * fins). Fade in over the first 15 % of the path, out over the last 6 frames. Lane ends stay above 0.42 m (clear of a
 * caption band at 'fins'); none crosses the coil thermometer. Born while the intake runs (run, the intake flow, the
 * pull, before a shut-off); the level's share thins the lanes (all six at 2.5 w and up).
 */
export const INTAKE_LANES = {
  travel: 1.2,
  every: 0.2,
  /** Lane ends (y, z) on the right coil's face, its x; the start offset (out, up). */
  // three columns near the cut plane (z 0.18 / 0.11 / 0.04 ≈ 28 px apart at 'fins'), so on screen they run down the dark
  // band of the coil's side face between its hatched cut and the coil thermometer (which covers z < 0); two lanes per
  // column with separate height ranges, births alternating columns, so no two streaks overlap
  ends: [
    [0.47, 0.18],
    [0.44, 0.11],
    [0.55, 0.04],
    [0.92, 0.18],
    [0.86, 0.11],
    [0.95, 0.04],
  ] as [number, number][],
  out: 0.025,
  up: 0.34,
  /** Streak width and length (m): ≈ 17 × 165 px at 'fins'. */
  width: 0.026,
  length: 0.19,
  /** Peak opacity (brand: 0.20; lanes apart, so the sum stays ≤ 0.25 before bloom). */
  peak: 0.2,
};

type Lane = {key: number; head: V3; dir: V3; op: number};

const intakeLanes = (hp: HouseHeatPumpKeys, ps: ReturnType<typeof pumpState>, start: number, vt: number, LOOP: number) => {
  const L = INTAKE_LANES;
  const n = Math.max(L.ends.length, Math.round(LOOP / L.every / L.ends.length) * L.ends.length);
  const every = LOOP / n;
  const x1 = HOUSE.unit.x1 + 0.005;
  const born = (t0: number) => {
    const lvl0 = Math.max(1, keyedValue(hp.level, t0, 2.5));
    const share = clamp01((lvl0 - 1) / 2);
    const fl = flowOn(hp.flows?.intake, t0);
    const k = ps.run(t0) * fl.g * fl.p * clamp01(keyedValue(hp.pull, t0, 1)) * (ps.C !== undefined && t0 >= ps.C ? 0 : 1);
    return {k, keep: Math.min(1, 0.25 + share)};
  };
  const out: Lane[] = [];
  let firstArrival = Infinity;
  // the earliest arrival so far (the coil's node lights from it): scan the births back over the scene
  for (let k = Math.floor((start - 2) / every); k <= Math.floor((vt - L.travel) / every); k++) {
    const b = born(k * every - start);
    if (b.k > 0.2 && random(`hh-lane-keep-${((k % n) + n) % n}`) < b.keep) {
      firstArrival = k * every + L.travel;
      break;
    }
  }
  for (let k = Math.floor((vt - L.travel) / every); k <= Math.floor(vt / every); k++) {
    const t0v = k * every;
    const age = vt - t0v;
    if (age < 0 || age > L.travel) continue;
    const slot = ((k % n) + n) % n;
    const b = born(t0v - start);
    if (b.k < 0.2 || random(`hh-lane-keep-${slot}`) > b.keep) continue;
    const [y, z] = L.ends[slot % L.ends.length];
    const T: V3 = [x1, y, z];
    const P0: V3 = [x1 + L.out, y + L.up, z];
    const u = age / L.travel;
    // easing in: slow out in the air, speeding up into the fins
    const e = u * u;
    const head: V3 = [P0[0] + (T[0] - P0[0]) * e, P0[1] + (T[1] - P0[1]) * e, P0[2] + (T[2] - P0[2]) * e];
    const d: V3 = [T[0] - P0[0], T[1] - P0[1], T[2] - P0[2]];
    const dl = Math.hypot(...d) || 1;
    const op = L.peak * ease(e, 0, 0.15) * (1 - ease(age, L.travel - 0.2, L.travel)) * (1 + 0.25 * ps.intakePulse);
    if (op < 0.004) continue;
    out.push({key: k, head, dir: [d[0] / dl, d[1] / dl, d[2] / dl], op: Math.min(0.25, op)});
  }
  return {lanes: out, firstArrival};
};

/**
 * The intake's streaks: one convex teardrop per wisp (round head at the front, a tail tapering to a point), so a wisp
 * never overlaps itself; halo only (no core, no dots, no light), bloomed, in the wisps' exposure-corrected orange.
 */
const IntakeStreaks: React.FC<{lanes: Lane[]; color: string; scale: number}> = ({lanes, color, scale}) => {
  const geo = useMemo(() => {
    // the profile along y (tail tip at −1, head's front at 0), radius ≤ 0.5: a lathe round the y axis
    const pts: THREE.Vector2[] = [];
    const head = 0.06;
    for (let i = 0; i <= 24; i++) {
      const y = -1 + (i / 24) * (1 - head);
      pts.push(new THREE.Vector2(0.5 * Math.pow((y + 1) / (1 - head), 0.85), y));
    }
    for (let i = 1; i <= 8; i++) {
      const a = (i / 8) * (Math.PI / 2);
      pts.push(new THREE.Vector2(0.5 * Math.cos(a), -head + head * Math.sin(a)));
    }
    return new THREE.LatheGeometry(pts, 16);
  }, []);
  const mats = useMemo(
    () => [...Array(8).keys()].map(() => new THREE.MeshBasicMaterial({color: raw(color), transparent: true, depthWrite: false})),
    [color],
  );
  React.useEffect(() => () => {
    geo.dispose();
    mats.forEach((m) => m.dispose());
  }, [geo, mats]);
  const L = INTAKE_LANES;
  return (
    <>
      {lanes.map((w) => {
        const m = mats[((w.key % 8) + 8) % 8];
        m.opacity = w.op;
        const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(...w.dir));
        return (
          <mesh key={w.key} geometry={geo} material={m} position={w.head} quaternion={q} scale={[L.width * scale, L.length * scale, L.width * scale]} userData={{glow: true}} renderOrder={7} />
        );
      })}
    </>
  );
};

/**
 * The register's warm air (N5; brand v0.18.14): single soft halos (one sphere each, so a wisp never stacks on itself),
 * rising from the grille, consecutive ones alternately left and right of it so neighbours don't overlap; strength by
 * the indoor width (the heat pump's warm air plus the strips). The first one is born the moment the supply flow reaches
 * the register (its draw done), then on a loop-safe grid every 0.4 s.
 */
type Halo = {key: number; p: V3; r: number; op: number};
const registerAir = (hp: HouseHeatPumpKeys, ps: ReturnType<typeof pumpState>, ah: NonNullable<HouseSliceSceneProps['airHandler']>, start: number, vt: number, LOOP: number): Halo[] => {
  const n = Math.max(2, Math.round(LOOP / 0.4 / 2) * 2);
  const every = LOOP / n;
  const life = 2.0;
  const [rx, ry, rz] = HOUSE.register;
  const supplyK = (x: number) => {
    const f = flowOn(hp.flows?.supply, x);
    // only once the flow has reached the register (its draw done)
    const arrived = f.p >= 0.98 ? 1 : 0;
    const hpK = ps.run(x) * (ps.C === undefined || x < ps.C + 1.6 ? 1 : 0) * f.g * arrived * Math.max(1, keyedValue(hp.level, x, 2.5));
    return clamp01((hpK + clamp01(keyedValue(ah.strips, x, 0))) / 2.5);
  };
  // the arrival (scene s): when the supply's draw completes, if it does in this scene
  const sup = hp.flows?.supply;
  const arrival = typeof sup === 'object' && sup.at > -0.5 ? sup.at + (sup.drawFor ?? 1.0) : null;
  const births: {key: number; t0v: number; side: number}[] = [];
  for (let k = Math.floor((vt - life) / every); k <= Math.floor(vt / every); k++) births.push({key: k, t0v: k * every, side: ((k % 2) + 2) % 2 ? 1 : -1});
  if (arrival !== null) births.push({key: -1e6, t0v: start + arrival, side: 1});
  const out: Halo[] = [];
  for (const b of births) {
    const age = vt - b.t0v;
    if (age < 0 || age > life) continue;
    const lv = b.key === -1e6 ? supplyK(arrival! + 0.01) : supplyK(b.t0v - start);
    if (lv < 0.01) continue;
    // a grid wisp born in the arrival's first 0.25 s would sit on the arrival puff: skip it
    if (arrival !== null && b.key !== -1e6 && Math.abs(b.t0v - (start + arrival)) < 0.25) continue;
    const slot = ((b.key % n) + n) % n;
    const r = (q: string) => random(`hh-reg-${b.key === -1e6 ? 'arr' : slot}-${q}`);
    const u = age / life;
    const p: V3 = [rx + b.side * (0.09 + 0.14 * u) + (r('x') - 0.5) * 0.03, ry + 0.06 + 0.42 * age * (0.9 + 0.2 * r('v')), rz - 0.1 * age];
    const op = lv * ease(age, 0, 0.25) * (1 - ease(u, 0.5, 1));
    if (op < 0.01) continue;
    out.push({key: b.key, p, r: 0.08 + 0.1 * Math.sqrt(u), op});
  }
  return out;
};

/** Soft round halos, one sphere each (halo only, bloomed), opacity = `max` × the halo's strength. */
const RoundHalos: React.FC<{halos: Halo[]; max: number; color: string}> = ({halos, max, color}) => {
  const mats = useMemo(() => [...Array(8).keys()].map(() => new THREE.MeshBasicMaterial({color: raw(color), transparent: true, depthWrite: false})), [color]);
  React.useEffect(() => () => mats.forEach((m) => m.dispose()), [mats]);
  return (
    <>
      {halos.map((h, i) => {
        const m = mats[i % 8];
        m.opacity = Math.min(0.25, max) * clamp01(h.op);
        return (
          <mesh key={h.key} position={h.p} scale={h.r} material={m} userData={{glow: true}} renderOrder={7}>
            <sphereGeometry args={[1, 16, 12]} />
          </mesh>
        );
      })}
    </>
  );
};

/**
 * The window leak (N5, scene 3; brand v0.18.14): halo-only teardrop streaks on four lanes spread across the left window,
 * one wisp per lane per cycle (one born every 0.55 s), from the room to the glass and on out into the night, fading
 * in over the first 15 % of the way and out over the last 0.4 s outside. Lanes apart, so the sum stays ≤ 0.25.
 */
const LEAK_LANES: [number, number][] = [
  [2.22, 0.5],
  [1.78, 0.78],
  [2.08, 1.06],
  [1.66, 1.3],
];
const leakAir = (leak: Keyed | undefined, start: number, vt: number, LOOP: number): Lane[] => {
  const life = 2.2;
  const inside = 1.4;
  const n = Math.max(LEAK_LANES.length, Math.round(LOOP / (life / LEAK_LANES.length) / LEAK_LANES.length) * LEAK_LANES.length);
  const every = LOOP / n;
  const out: Lane[] = [];
  for (let k = Math.floor((vt - life) / every); k <= Math.floor(vt / every); k++) {
    const t0v = k * every;
    const age = vt - t0v;
    if (age < 0 || age > life) continue;
    const lv = clamp01(keyedValue(leak, t0v - start, 0));
    if (lv < 0.01) continue;
    const slot = ((k % n) + n) % n;
    const [y, z] = LEAK_LANES[slot % LEAK_LANES.length];
    const P0: V3 = [-1.95, y - 0.18, z + 0.3];
    const G: V3 = [-2.9, y, z];
    const P1: V3 = [-3.55, y + 0.1, z + 0.3];
    let head: V3;
    let d: V3;
    if (age < inside) {
      const u = age / inside;
      head = [P0[0] + (G[0] - P0[0]) * u, P0[1] + (G[1] - P0[1]) * u, P0[2] + (G[2] - P0[2]) * u];
      d = [G[0] - P0[0], G[1] - P0[1], G[2] - P0[2]];
    } else {
      const u = (age - inside) / (life - inside);
      head = [G[0] + (P1[0] - G[0]) * u, G[1] + (P1[1] - G[1]) * u, G[2] + (P1[2] - G[2]) * u];
      d = [P1[0] - G[0], P1[1] - G[1], P1[2] - G[2]];
    }
    const dl = Math.hypot(...d) || 1;
    const op = WISP_CAP.leak * lv * ease(age / inside, 0, 0.15) * (1 - ease(age, life - 0.4, life));
    if (op < 0.004) continue;
    out.push({key: k, head, dir: [d[0] / dl, d[1] / dl, d[2] / dl], op});
  }
  return out;
};

/** Snow on the parked EV's roof and hood (car frame, facing −x: world x = −local x), cut at the near cut. */
const CarSnow: React.FC = () => {
  const mats = useMemo(
    () => ({
      // a step under the token: lit in the open, the snow stays ≤ 244 (brand § 2 whites)
      top: new THREE.MeshStandardMaterial({color: raw(WINTER.snow).multiplyScalar(HOUSE_SNOW), roughness: 0.95}),
    }),
    [],
  );
  return (
    <group>
      {/* the roof (the cut car's roof line at 1.92 m from x 0.45 back to −1.45, mirrored: the car faces −x) */}
      <mesh geometry={roundedBox(1.7, 0.04, 1.45, 0.018, 3)} material={mats.top} position={[0.5, 1.94, -0.1]} castShadow />
      {/* the hood (from 1.2 m at x 1.12 down to 1.02 at 2.22) */}
      <group position={[-1.65, 1.135, -0.08]} rotation={[0, 0, 0.163]}>
        <mesh geometry={roundedBox(0.95, 0.04, 1.62, 0.018, 3)} material={mats.top} castShadow />
      </group>
    </group>
  );
};
