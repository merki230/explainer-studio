import React from 'react';
import {Composition} from 'remotion';
import {Cover} from './Cover';
import {ERROR_CARD_FRAMES, Explainer, type ExplainerProps, safeTimelineFor} from './Explainer';
import {FPS, FRAMES} from './theme';
import {VIDEOS} from './videos';

// One composition per video, named by its slug, plus a `<slug>-cover` still for videos with a
// `cover` (rendered with `yarn cover <slug>` to `src/videos/<slug>/release/cover.png`; `yarn render`
// and `yarn stills` select compositions by slug, so they never pick it up). A video's `format` sets
// its size (vertical 1080 x 1920 by default, horizontal 1920 x 1080). Each entry of `spec.shorts` adds a
// vertical `<slug>-short-<chapter>` composition (and `<slug>-short-<chapter>-cover` with a cover).
// Frame size and safe zones: theme.ts (FRAMES, *_H); scenes read them with useFormat() (format.ts).
const frameOf = (format?: 'vertical' | 'horizontal') => FRAMES[format ?? 'vertical'];

export const Root: React.FC = () => (
  <>
    {Object.keys(VIDEOS).flatMap((id) => {
      const {spec} = VIDEOS[id];
      const covers: {key: string; short?: number; width: number; height: number}[] = [];
      if (spec.cover) covers.push({key: `${id}-cover`, ...frameOf(spec.format)});
      (spec.shorts ?? []).forEach((s) => {
        if (s.cover) covers.push({key: `${id}-short-${s.chapter}-cover`, short: s.chapter, ...FRAMES.vertical});
      });
      return covers.map((c) => (
        // one frame at the video's fps (a <Still> runs at 1 fps, which would change the scene's timing maths)
        <Composition
          key={c.key}
          id={c.key}
          component={Cover}
          defaultProps={{videoId: id, short: c.short}}
          durationInFrames={1}
          fps={FPS}
          width={c.width}
          height={c.height}
        />
      ));
    })}
    {Object.keys(VIDEOS).flatMap((id) => {
      const {spec} = VIDEOS[id];
      // A broken video still registers (as an error card) so it can't break the others.
      const {timeline} = safeTimelineFor(id);
      // Music audition: one on/off checkbox per take in the Studio props panel (Explainer mutes the
      // unticked ones; renders ignore it and play the first take).
      const audition = spec.music?.audition;
      const defaultProps: ExplainerProps = audition?.length
        ? {videoId: id, musicAudition: Object.fromEntries(audition.map((t) => [t, true]))}
        : {videoId: id};
      const frame = frameOf(spec.format);
      const main = (
        <Composition
          key={id}
          id={id}
          component={Explainer}
          defaultProps={defaultProps}
          durationInFrames={timeline?.durationInFrames ?? ERROR_CARD_FRAMES}
          fps={FPS}
          width={frame.width}
          height={frame.height}
        />
      );
      const shorts = (spec.shorts ?? []).map((s) => (
        <Composition
          key={`${id}-short-${s.chapter}`}
          id={`${id}-short-${s.chapter}`}
          component={Explainer}
          defaultProps={{videoId: id, short: s.chapter} satisfies ExplainerProps}
          durationInFrames={safeTimelineFor(id, s.chapter).timeline?.durationInFrames ?? ERROR_CARD_FRAMES}
          fps={FPS}
          width={FRAMES.vertical.width}
          height={FRAMES.vertical.height}
        />
      ));
      return [main, ...shorts];
    })}
  </>
);
