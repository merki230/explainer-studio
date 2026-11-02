import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {LabSlice} from '../three/section/LabSlice';
import {HEAT_BENCH} from '../three/section/HeatBench';
import {formatOf, projectToFrame, SectionCamera, sectionCameraAt, useFormatProps, type Framing} from '../three/section/SectionCamera';
import {SectionLights, SectionStage} from '../three/section/SectionStage';
import type {Format, Mood} from '../theme';
import {DEFAULT_ROWS, type TireBayProps} from '../three/section/TireBay';
import {trackAt, type Track} from './DatacenterSliceScene';
import {ease, framingAtKeys, type CameraKey} from './keyframes';

/** Framings at the fixed angle: 'wide' (the whole lab, like the living room's) and 'bench' (the bench and the wall displays). */
export const LAB_FRAMINGS: Record<'wide' | 'bench', Framing> = {
  wide: {look: [-0.2, 1.36, 0], distance: 12.75},
  bench: {look: [0.05, 1.45, -0.55], distance: 8.6},
};

/** The tire bay's framings: 'wide' as the Lab's; 'bench' on the rack's two rows. */
export const TIRE_BAY_FRAMINGS: Record<'wide' | 'bench', Framing> = {
  wide: LAB_FRAMINGS.wide,
  bench: {look: [-0.2, 1.36, -0.7], distance: 9.6},
};

/** The heat bench's framings (No. 013), named as the spec's: the room, the bench, and each item close. */
export type LabFraming = 'wide' | 'bench' | 'jug1' | 'jug2' | 'heater';
const HEAT_H: Record<LabFraming, Framing> = {
  wide: {look: [-0.1, 1.3, 0], distance: 8.4},
  bench: {look: [0.15, 1.45, -0.6], distance: 6.2},
  jug1: {look: [-0.75, 1.45, -0.6], distance: 5.0},
  jug2: {look: [-0.2, 1.45, -0.6], distance: 5.0},
  heater: {look: [0.95, 1.5, -0.6], distance: 5.0},
};
/** 9:16: the bench framed tight; the camera glides between the items rather than holding all three. */
const HEAT_V: Record<LabFraming, Framing> = {
  wide: LAB_FRAMINGS.wide,
  bench: {look: [0.15, 1.4, -0.6], distance: 9.6},
  jug1: {look: [-0.95, 1.4, -0.65], distance: 4.4},
  jug2: {look: [-0.2, 1.4, -0.65], distance: 4.4},
  heater: {look: [0.98, 1.5, -0.65], distance: 5.0},
};
/** The Lab's named framings for a format (the heat bench's set; other dressings keep `LAB_FRAMINGS` in 9:16). */
export const labFramings = (format: Format | undefined): Record<LabFraming, Framing> => (format === 'horizontal' ? HEAT_H : HEAT_V);

export type LabCameraKey = {at: number; ease?: 'out' | 'inOut' | 'sine'; log?: boolean} & ({framing: LabFraming} | {look: [number, number, number]; distance: number});

export type SectionLabSceneProps = {
  durationInFrames: number;
  /** Day (default) or Night. */
  mood?: Mood;
  /** 'wide' (default), 'bench', or a custom move between two framings. */
  camera?: keyof typeof LAB_FRAMINGS | {from: Framing; to?: Framing};
  /** Push speed for a preset, units/s (default 0.04). */
  push?: number;
  /** Idle truck drift, ± units (default 0.08). */
  drift?: number;
  /** The number the wall counter reaches (default 17,000). */
  count?: number;
  /** Seconds into the scene when the counter starts (default 0.4), and how long it runs (default 3.2). */
  countAt?: number;
  countFor?: number;
  /** Seconds into the scene when the "0" stamp lands on the audio meter (e.g. on "not one was caught"). */
  zeroAt?: number;
  /** The arms tap and the conveyor runs (default on). */
  running?: boolean;
  /** Realism pass: real lab equipment, realistic test phones, studio reflections (default false). */
  realism?: boolean;
  /**
   * What the Lab is dressed as: 'apps' (default: No. 001's phone bench, arms, counter, meter) or
   * 'tire-bay' (No. 002: a rack of two rows of eight wheels with set-panel labels, two extras gauging).
   */
  dressing?: 'apps' | 'tire-bay' | 'heat-bench';
  /**
   * The tire bay: `rows` ({label, low: wheel indices 0–7, lowAt: s}, top shelf first), `lowPressure`
   * (default 0.55), `workers` (default true: two workers standing at the rack's ends gauge the end
   * tires, write on clipboards and turn to each low tire as its readout lights). The first Lab scene
   * is the 'check' beat (nothing low); a 'bench' framing or a tire-bay scene continuing from the
   * previous one is the 'result' beat (each row's low tires sag and light their readouts at its
   * `lowAt`). Default rows: "WITHOUT THE WARNING" with wheels 2 and 5 low, "WITH THE WARNING" with
   * wheel 4 low (🎭 2 of 8 vs 1 of 8), at 0.6 s and 2.9 s in the result beat.
   */
  tireBay?: Partial<TireBayProps>;
  /**
   * Named start framing ('wide' | 'bench' | 'jug1' | 'jug2' | 'heater', resolved per format). With `framing` or
   * `cameraKeys` (or the heat bench) the camera is keyed like the Section sets: keys glide (cubic in-out), a push of
   * `push` share of the distance per second runs from the last key's time (default 0.002 wide, 0.003 vertical).
   */
  framing?: LabFraming;
  cameraKeys?: LabCameraKey[];
  /** Heat bench: jug 1 boils from `boilAt`. */
  jug1?: {boilAt: number};
  /** Heat bench: the heater runs from `onAt`. */
  heater?: {onAt: number};
  /** Heat bench: the clock's hands sweep `minutes` (default 100) over `secs` (2.5) from `sweepAt`. */
  clock?: {sweepAt: number; minutes?: number; secs?: number};
  /** Heat bench: jug 2's thermometer climbs `degrees` (10) over 2 s from `warmAt`. */
  jug2?: {warmAt: number; degrees?: number};
  /** Heat bench: the wall heat meters, 0 → 1 each (key tracks). */
  bars?: {jug1?: Track; jug2?: Track; heater?: Track};
  /** The frame format (set by the Explainer on horizontal videos). */
  format?: Format;
  /** Screen-space ambient occlusion (N8AO) at the mood's strength. Default: follows `realism`. */
  ao?: boolean;
  /** Which slice this is (default 'lab'); from another location it slides in, or follows the line. */
  location?: string;
  transition?: 'auto' | 'continue' | 'glide' | 'cut' | 'dissolve' | 'slide' | 'follow';
  follow?: {direction?: 'down' | 'up' | 'left' | 'right'; at?: number};
  /** The scene's first frame in the video (set by Explainer). */
  startFrame?: number;
  /** Seconds a 'glide' takes from the previous scene's end framing (cubic in-out; default 0.8). */
  glide?: number;
  /** Set by Explainer when this scene continues or glides from the previous one: where its camera ended. */
  cameraFrom?: Framing;
  /** Set by Explainer when this scene glides in: the glide's length in seconds. */
  cameraGlide?: number;
};

/**
 * The scene's camera move from its props, like the living room's: a preset (with a slow push) or a
 * custom move; continuing from `cameraFrom` (a preset with the same look keeps pushing, another
 * becomes where the move ends), or gliding from it first (`cameraGlide`, cubic in-out).
 */
const labCameraMove = (p: Partial<SectionLabSceneProps>, durationInFrames: number, fps: number) => {
  const camera = p.camera ?? 'wide';
  const push = p.push ?? 0.04;
  const pre =
    p.cameraGlide && p.cameraFrom
      ? {from: p.cameraFrom, hold: 0, move: Math.max(1, Math.round(p.cameraGlide * fps)), ease: 'cubic' as const}
      : undefined;
  const start = pre ? pre.move : 0;
  const secs = Math.max(0, durationInFrames - start) / fps;
  let from: Framing;
  let to: Framing;
  if (typeof camera === 'string') {
    const presets = p.dressing === 'tire-bay' ? TIRE_BAY_FRAMINGS : LAB_FRAMINGS;
    const preset = presets[camera] ?? presets.wide;
    const c = pre ? undefined : p.cameraFrom;
    if (c) {
      const same = c.look.every((v, i) => Math.abs(v - preset.look[i]) < 1e-6);
      from = c;
      to = same ? {look: c.look, distance: c.distance - push * secs} : preset;
    } else {
      from = preset;
      to = {look: preset.look, distance: preset.distance - push * secs};
    }
  } else {
    from = camera.from;
    to = camera.to ?? camera.from;
  }
  return {from, to, pre};
};

/** The keyed camera (heat bench, or any Lab scene with `framing` / `cameraKeys`). */
const keyedCamera = (p: Partial<SectionLabSceneProps>) => p.dressing === 'heat-bench' || p.framing !== undefined || (p.cameraKeys?.length ?? 0) > 0;

/** The keyed camera's framing at second `s`: keys from where the last scene ended, a glide in, the push from the last key. */
const labKeyedAt = (p: Partial<SectionLabSceneProps>, s: number): Framing => {
  const set = labFramings(formatOf(p));
  const start = set[p.framing ?? (typeof p.camera === 'string' && p.camera in set ? (p.camera as LabFraming) : 'wide')];
  const keys: CameraKey[] = (p.cameraKeys ?? []).map((c) => {
    const f = 'framing' in c ? set[c.framing] : {look: c.look, distance: c.distance};
    return {at: c.at, look: f.look, distance: f.distance, ease: c.ease, log: c.log};
  });
  const base = p.cameraFrom && !p.cameraGlide ? p.cameraFrom : start;
  const T = keys.length ? Math.max(0, ...keys.map((k) => k.at)) : 0;
  const k = p.push ?? (formatOf(p) === 'horizontal' ? 0.002 : 0.003);
  const f0 = keys.length ? framingAtKeys(keys, base, s) : base;
  let f: Framing = {look: f0.look, distance: f0.distance * (1 - k * (s - T))};
  const g = p.cameraGlide && p.cameraFrom ? p.cameraGlide : 0;
  if (g && s < g) {
    const u = ease(s, 0, g);
    const from = p.cameraFrom!;
    f = {look: from.look.map((v, i) => v + (f.look[i] - v) * u) as Framing['look'], distance: from.distance + (f.distance - from.distance) * u};
  }
  return f;
};

/** The framing the scene's own camera move starts on (ignoring any continuation or glide into it). */
export const labCameraStart = (p: Partial<SectionLabSceneProps>, durationInFrames: number, fps: number): Framing =>
  keyedCamera(p)
    ? labKeyedAt({...p, cameraFrom: undefined, cameraGlide: undefined}, 0)
    : labCameraMove({...p, cameraFrom: undefined, cameraGlide: undefined}, durationInFrames, fps).from;

/** The framing the scene's camera ends on (for the next scene to continue or glide from). */
export const labCameraEnd = (p: Partial<SectionLabSceneProps>, durationInFrames: number, fps: number): Framing =>
  keyedCamera(p) ? labKeyedAt(p, durationInFrames / fps) : labCameraMove(p, durationInFrames, fps).to;

const labCameraAt = (p: Partial<SectionLabSceneProps>, o: {frame: number; fps: number; durationInFrames: number}) => {
  if (keyedCamera(p)) {
    const f = labKeyedAt(p, o.frame / o.fps);
    return sectionCameraAt({from: f, to: f, frame: o.frame, fps: o.fps, durationInFrames: o.durationInFrames, drift: p.drift ?? 0.08, clockOffset: (p.startFrame ?? 0) / o.fps, format: formatOf(p)});
  }
  const {from, to, pre} = labCameraMove(p, o.durationInFrames, o.fps);
  return sectionCameraAt({from, to, pre, frame: o.frame, fps: o.fps, durationInFrames: o.durationInFrames, drift: p.drift ?? 0.08, clockOffset: (p.startFrame ?? 0) / o.fps, format: formatOf(p)});
};

/** The heat bench's state at t. */
const heatState = (p: Partial<SectionLabSceneProps>, t: number) => ({
  boil: p.jug1 ? Math.min(1, Math.max(0, (t - p.jug1.boilAt) / 6)) : 0,
  heaterOn: p.heater ? ease(t, p.heater.onAt, p.heater.onAt + 0.5) : 0,
  warm: p.jug2 ? ease(t, p.jug2.warmAt, p.jug2.warmAt + 2) : 0,
  degrees: p.jug2?.degrees ?? 10,
  minutes: p.clock ? (p.clock.minutes ?? 100) * ease(t, p.clock.sweepAt, p.clock.sweepAt + (p.clock.secs ?? 2.5)) : 0,
  bars: {jug1: trackAt(p.bars?.jug1, t, 0), jug2: trackAt(p.bars?.jug2, t, 0), heater: trackAt(p.bars?.heater, t, 0)},
});

/**
 * A named point on screen (px), heat bench: 'clock', 'bar:jug1' | 'bar:jug2' | 'bar:heater' (the top of the bar's
 * fill), 'jug1', 'jug2', 'heater'.
 */
export const labAnchorOnScreen = (
  p: Partial<SectionLabSceneProps>,
  anchor: string,
  o: {frame: number; fps: number; durationInFrames: number},
): [number, number] | undefined => {
  const cam = labCameraAt(p, o);
  const HB = HEAT_BENCH;
  const st = heatState(p, o.frame / o.fps);
  const barTop = (x: number, v: number): [number, number, number] => [x, HB.bar.y - HB.bar.h / 2 + 0.02 + Math.max(0.012, v) * (HB.bar.h - 0.04), HB.bar.z];
  const pts: Record<string, [number, number, number]> = {
    clock: HB.clock,
    'bar:jug1': barTop(HB.jug1[0], st.bars.jug1),
    'bar:jug2': barTop(HB.jug2[0], st.bars.jug2),
    'bar:heater': barTop(HB.heater[0], st.bars.heater),
    jug1: [HB.jug1[0], HB.jug1[1] + 0.4, HB.jug1[2]],
    jug2: [HB.jug2[0], HB.jug2[1] + 0.4, HB.jug2[2]],
    heater: [HB.heater[0], HB.heater[1] + 0.45, HB.heater[2]],
  };
  return pts[anchor] ? projectToFrame(cam, pts[anchor]) : undefined;
};

/**
 * The Lab (a second location): a test room cut open at the fixed angle, phones on a bench tapped by
 * robot arms, app icons on a conveyor, a wall counter rising to 17,000, an audio meter that stays
 * flat, and a "0" stamp on cue. For "researchers studied more than 17,000 apps … not one was caught".
 */
export const SectionLabScene: React.FC<SectionLabSceneProps> = (propsIn) => {
  const props = useFormatProps(propsIn);
  return keyedCamera(props) ? <KeyedLab {...props} /> : <PresetLab {...props} />;
};

/** The keyed-camera Lab (the heat bench, or `framing` / `cameraKeys`). */
const KeyedLab: React.FC<SectionLabSceneProps> = (p) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const {mood = 'day', startFrame = 0, durationInFrames} = p;
  const f = labKeyedAt(p, t);
  const st = heatState(p, t);
  return (
    <SectionStage mood={mood} post={{focusY: 0.5}} ao={p.ao ?? p.realism ?? false}>
      <SectionCamera from={f} to={f} durationInFrames={durationInFrames} drift={p.drift ?? 0.08} clockOffset={startFrame / fps} />
      <SectionLights mood={mood} target={[0, 0.9, -0.3]} lamp={0} />
      <LabSlice
        mood={mood}
        t={t}
        clock={t + startFrame / fps}
        count={p.count}
        countAt={p.countAt}
        countFor={p.countFor}
        zeroAt={p.zeroAt}
        running={p.running ?? true}
        realism={p.realism ?? false}
        dressing={p.dressing ?? 'apps'}
        tireBay={p.tireBay}
        heatBench={p.dressing === 'heat-bench' ? st : undefined}
      />
    </SectionStage>
  );
};

/** The preset-camera Lab (No. 001 / 002 as built). */
const PresetLab: React.FC<SectionLabSceneProps> = ({
  durationInFrames,
  mood = 'day',
  camera = 'wide',
  push = 0.04,
  drift = 0.08,
  count,
  countAt,
  countFor,
  zeroAt,
  running = true,
  realism = false,
  ao,
  dressing = 'apps',
  tireBay,
  startFrame = 0,
  cameraFrom,
  cameraGlide,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const {from, to, pre} = labCameraMove({camera, push, cameraFrom, cameraGlide, dressing}, durationInFrames, fps);
  return (
    <SectionStage mood={mood} post={{focusY: 0.5}} ao={ao ?? realism}>
      <SectionCamera
        from={from}
        to={to}
        durationInFrames={durationInFrames}
        pre={pre}
        drift={drift}
        clockOffset={startFrame / fps}
      />
      <SectionLights mood={mood} target={[0, 0.9, -0.3]} lamp={0} />
      <LabSlice
        mood={mood}
        t={t}
        clock={t + startFrame / fps}
        count={count}
        countAt={countAt}
        countFor={countFor}
        zeroAt={zeroAt}
        running={running}
        realism={realism}
        dressing={dressing}
        tireBay={{
          // the result beat: the 'bench' framing, or any tire-bay scene that continues from the one
          // before it (a custom move gliding in from the first Lab scene)
          rows:
            camera === 'bench' || cameraFrom !== undefined
              ? [
                  {...DEFAULT_ROWS[0], lowAt: 0.6},
                  {...DEFAULT_ROWS[1], lowAt: 2.9},
                ]
              : DEFAULT_ROWS,
          beat: camera === 'bench' || cameraFrom !== undefined ? 'result' : 'check',
          ...tireBay,
        }}
      />
    </SectionStage>
  );
};
