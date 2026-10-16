import React from 'react';
import {Composition} from 'remotion';
import {ERROR_CARD_FRAMES, Explainer, type ExplainerProps, safeTimelineFor} from './Explainer';
import {FPS, HEIGHT, WIDTH} from './theme';
import {VIDEOS} from './videos';

// One composition per video, named by its slug.
export const Root: React.FC = () => (
  <>
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
