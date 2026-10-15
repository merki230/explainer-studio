import {theme} from './theme';
import type {VideoSpec} from './types';

/**
 * THE FILE YOU EDIT FOR EACH VIDEO.
 * Scenes start on a `cue` (first words of a phrase in the voiceover) and run
 * until the next scene. Overlays start on a `cue` or `at` seconds into the scene.
 * Overlay x/y are fractions of the 1080x1920 frame: find them in the Studio.
 */
export const video: VideoSpec = {
  watermark: 'ILLUSTRATIVE',
  scenes: [
    {
      scene: 'phone',
      cue: 'Your phone',
      chip: {text: 'Mic: probably not'},
      props: {micDot: true},
      overlays: [
        {type: 'callout', cue: 'Probably not', x: 0.54, y: 0.21, dx: 130, dy: -60, title: 'Mic in use', sub: 'This dot never lies'},
      ],
    },
    {
      scene: 'room',
      cue: 'So how did',
      chip: {text: 'Same couch · same evening'},
      props: {camera: 'wide'},
      overlays: [{type: 'search', cue: 'coffee machine', text: 'coffee machine', tag: 'NEVER SEARCHED', y: 0.6}],
    },
    {
      scene: 'room',
      cue: 'Same Wi-Fi',
      chip: {text: 'One network', color: theme.glow},
      props: {camera: 'push', arcs: true, facing: true},
      overlays: [{type: 'callout', at: 0.5, x: 0.43, y: 0.385, dx: 110, dy: -150, title: 'Same Wi-Fi', sub: 'IP 84.112.7.20'}],
    },
    {
      scene: 'profiles',
      cue: 'To an ad',
      chip: {text: 'What the ad company sees'},
      overlays: [{type: 'ad', cue: 'one household', title: 'Coffee machine', x: 0.64, y: 0.3}],
    },
    {
      scene: 'tiles',
      cue: 'Multiply that',
      chip: {text: 'Every home · every night'},
      overlays: [{type: 'counter', at: 0.4, to: 12000000, label: 'homes', sub: 'Matched by network', x: 0.07, y: 0.5}],
    },
  ],
};
