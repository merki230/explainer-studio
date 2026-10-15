import React from 'react';
import {Composition} from 'remotion';
import {Explainer, timelineFor} from './Explainer';
import {FPS, HEIGHT, WIDTH} from './theme';
import {VIDEOS} from './videos';

// One composition per video, named by its slug.
export const Root: React.FC = () => (
  <>
    {Object.keys(VIDEOS).map((id) => (
      <Composition
        key={id}
        id={id}
        component={Explainer}
        defaultProps={{videoId: id}}
        durationInFrames={timelineFor(id).durationInFrames}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    ))}
  </>
);
