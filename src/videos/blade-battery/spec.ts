import type {VideoSpec} from '../../types';

/**
 * Scene layout for this video. See src/videos/phone-listening/spec.ts for a
 * full example. Scenes start on a `cue` (first words of a phrase in
 * script.txt) and run until the next scene.
 */
export const spec: VideoSpec = {
  scenes: [
    {
      scene: 'phone',
      chip: {text: 'Replace me'},
    },
  ],
};
