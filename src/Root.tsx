import React from 'react';
import {Composition} from 'remotion';
import {ERROR_CARD_FRAMES, Explainer, safeTimelineFor} from './Explainer';
import {FPS, HEIGHT, WIDTH} from './theme';
import {VIDEOS} from './videos';

// One composition per video, named by its slug.
export const Root: React.FC = () => (
  <>
    {Object.keys(VIDEOS).map((id) => {
      // A broken video still registers (as an error card) so it can't break the others.
      const {timeline} = safeTimelineFor(id);
      return (
        <Composition
          key={id}
          id={id}
          component={Explainer}
          defaultProps={{videoId: id}}
          durationInFrames={timeline?.durationInFrames ?? ERROR_CARD_FRAMES}
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
        />
      );
    })}
  </>
);
