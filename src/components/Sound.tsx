import React, {useMemo} from 'react';
import {Audio, getRemotionEnvironment, Sequence} from 'remotion';
import {audioUrl} from '../audioAssets';
import type {MusicSpec, SfxOverlay, Word} from '../types';
import {auditionWarning, duckEnvelope, MUSIC_DEFAULTS, musicBeds, musicGain, sfxGain, sfxSrc} from './soundMix';

const warned = new Set<string>();

/**
 * The music bed (style guide § 9): fades in after the hook, ducks under speech, ends silent.
 * In audition mode (`music.audition`) one bed per take, each its own named timeline track with the
 * same curve; `takes` (the Studio props panel's `musicAudition` checkboxes) mutes takes (they stay on the timeline). A
 * render or still plays only the first take, whatever `takes` says.
 */
export const MusicBed: React.FC<{
  slug: string;
  music: MusicSpec;
  words: Word[];
  durationInFrames: number;
  fps: number;
  /** Audition only: take name → on/off. A take missing from the map plays. */
  takes?: Record<string, boolean>;
}> = ({slug, music, words, durationInFrames, fps, takes}) => {
  const duck = useMemo(() => duckEnvelope(words, durationInFrames, fps), [words, durationInFrames, fps]);
  const rendering = getRemotionEnvironment().isRendering;
  const warning = auditionWarning(music);
  if (rendering && warning && !warned.has(warning)) {
    warned.add(warning);
    console.warn(`[sound] ${warning}`);
  }
  const from = Math.max(0, Math.floor((music.startAt ?? MUSIC_DEFAULTS.startAt) * fps));
  return (
    <>
      {musicBeds(music, rendering).map((b) => {
        const url = audioUrl(slug, b.src);
        return !url ? null : (
          <Sequence
            key={b.key}
            from={from}
            durationInFrames={durationInFrames - from}
            name={b.name}
            layout="none"
          >
            <Audio
              src={url}
              loop
              loopVolumeCurveBehavior="extend"
              // an unticked take stays on the timeline, muted (its waveform greys out)
              muted={!rendering && takes?.[b.key] === false}
              trimBefore={Math.round((music.trim ?? 0) * fps) || undefined}
              // `f` counts from the sequence start; the gain is a pure function of the absolute frame
              volume={(f) => musicGain(f + from, durationInFrames, fps, music, duck)}
            />
          </Sequence>
        );
      })}
    </>
  );
};

/**
 * One sound effect, from absolute frame `from`, for `length` frames (or to the end of the file / the
 * video when undefined).
 */
export const Sfx: React.FC<{slug: string; o: SfxOverlay; from: number; length?: number; fps: number}> = ({
  slug,
  o,
  from,
  length,
  fps,
}) => {
  const url = audioUrl(slug, sfxSrc(o.name));
  if (!url) return null;
  return (
    <Sequence from={from} durationInFrames={length} name={`sfx ${o.name}`} layout="none">
      <Audio
        src={url}
        loop={o.loop}
        loopVolumeCurveBehavior="extend"
        trimBefore={Math.round((o.trim ?? 0) * fps) || undefined}
        volume={(f) => sfxGain(f, fps, o, length)}
      />
    </Sequence>
  );
};
