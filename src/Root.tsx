import React from 'react';
import {Composition} from 'remotion';
import {Cover} from './Cover';
import {ERROR_CARD_FRAMES, Explainer, type ExplainerProps, safeTimelineFor} from './Explainer';
import {FPS, HEIGHT, WIDTH} from './theme';
import {VIDEOS} from './videos';

// One composition per video, named by its slug, plus a `<slug>-cover` still for videos with a
// `cover` (rendered with `yarn cover <slug>` to `out/<slug>/cover.png`; `yarn render`
// and `yarn stills` select compositions by slug, so they never pick it up).
export const Root: React.FC = () => (
  <>
    {Object.keys(VIDEOS)
      .filter((id) => VIDEOS[id].spec.cover)
      .map((id) => (
        // one frame at the video's fps (a <Still> runs at 1 fps, which would change the scene's timing maths)
        <Composition
          key={`${id}-cover`}
          id={`${id}-cover`}
          component={Cover}
          defaultProps={{videoId: id}}
          durationInFrames={1}
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
        />
      ))}
    {Object.keys(VIDEOS).map((id) => {
      // A broken video still registers (as an error card) so it can't break the others.
      const {timeline} = safeTimelineFor(id);
      // Music audition: one on/off checkbox per take in the Studio props panel (Explainer mutes the
      // unticked ones; renders ignore it and play the first take).
      const audition = VIDEOS[id].spec.music?.audition;
      const defaultProps: ExplainerProps = audition?.length
        ? {videoId: id, musicAudition: Object.fromEntries(audition.map((t) => [t, true]))}
        : {videoId: id};
      return (
        <Composition
          key={id}
          id={id}
          component={Explainer}
          defaultProps={defaultProps}
          durationInFrames={timeline?.durationInFrames ?? ERROR_CARD_FRAMES}
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
        />
      );
    })}
  </>
);
