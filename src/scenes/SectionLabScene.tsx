import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {LabSlice} from '../three/section/LabSlice';
import {SectionCamera, type Framing} from '../three/section/SectionCamera';
import {SectionLights, SectionStage} from '../three/section/SectionStage';
import type {Mood} from '../theme';

/** Framings at the fixed angle: 'wide' (the whole lab, like the living room's) and 'bench' (the bench and the wall displays). */
export const LAB_FRAMINGS: Record<'wide' | 'bench', Framing> = {
  wide: {look: [-0.2, 1.36, 0], distance: 12.75},
  bench: {look: [0.05, 1.45, -0.55], distance: 8.6},
};

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
    const preset = LAB_FRAMINGS[camera] ?? LAB_FRAMINGS.wide;
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

/** The framing the scene's own camera move starts on (ignoring any continuation or glide into it). */
export const labCameraStart = (p: Partial<SectionLabSceneProps>, durationInFrames: number, fps: number): Framing =>
  labCameraMove({...p, cameraFrom: undefined, cameraGlide: undefined}, durationInFrames, fps).from;

/** The framing the scene's camera ends on (for the next scene to continue or glide from). */
export const labCameraEnd = (p: Partial<SectionLabSceneProps>, durationInFrames: number, fps: number): Framing =>
  labCameraMove(p, durationInFrames, fps).to;

/**
 * The Lab (a second location): a test room cut open at the fixed angle, phones on a bench tapped by
 * robot arms, app icons on a conveyor, a wall counter rising to 17,000, an audio meter that stays
 * flat, and a "0" stamp on cue. For "researchers studied more than 17,000 apps … not one was caught".
 */
export const SectionLabScene: React.FC<SectionLabSceneProps> = ({
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
  startFrame = 0,
  cameraFrom,
  cameraGlide,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const {from, to, pre} = labCameraMove({camera, push, cameraFrom, cameraGlide}, durationInFrames, fps);
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
      />
    </SectionStage>
  );
};
