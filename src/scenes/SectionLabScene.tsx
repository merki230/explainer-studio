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
  /** Which slice this is (default 'lab'); from another location it slides in, or follows the line. */
  location?: string;
  transition?: 'auto' | 'cut' | 'dissolve' | 'slide' | 'follow';
  follow?: {direction?: 'down' | 'up' | 'left' | 'right'; at?: number};
  /** The scene's first frame in the video (set by Explainer). */
  startFrame?: number;
};

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
  startFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  let from: Framing;
  let to: Framing;
  if (typeof camera === 'string') {
    from = LAB_FRAMINGS[camera] ?? LAB_FRAMINGS.wide;
    to = {look: from.look, distance: from.distance - push * (durationInFrames / fps)};
  } else {
    from = camera.from;
    to = camera.to ?? camera.from;
  }
  return (
    <SectionStage mood={mood} post={{focusY: 0.5}}>
      <SectionCamera
        from={from}
        to={to}
        durationInFrames={durationInFrames}
        drift={drift}
        clockOffset={startFrame / fps}
      />
      <SectionLights mood={mood} target={[0, 0.9, -0.3]} lamp={0} />
      <LabSlice
        mood={mood}
        t={t}
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
