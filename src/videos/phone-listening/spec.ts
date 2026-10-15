import type {VideoSpec} from '../../types';

/**
 * Scene layout for this video.
 * Scenes start on a `cue` (first words of a phrase in the voiceover) and run
 * until the next scene. Overlays start on a `cue` or `at` seconds into the scene.
 * Overlay x/y are fractions of the 1080x1920 frame: find them in the Studio.
 */
export const spec: VideoSpec = {
  watermark: 'ILLUSTRATIVE',
  scenes: [
    {
      scene: 'phone',
      cue: 'Your phone',
      chip: {text: 'Mic: probably not'},
      props: {micDot: true, micAt: 0.6},
      overlays: [
        {
          type: 'callout',
          cue: 'Probably not',
          // anchored on the mic light; the card sits above the phone, between label and phone top
          x: 0.561,
          y: 0.348,
          dx: 0,
          dy: -46,
          place: 'above',
          title: 'Mic in use',
          sub: 'This dot never lies',
        },
      ],
    },
    {
      scene: 'room',
      cue: 'So how did',
      chip: {title: 'No. 014 · The Living Room', text: 'Same couch · same evening'},
      // The tell: the friend's phone flickers orange on "Your friend did."
      props: {camera: 'wide', tellAt: 5.3, plate: {number: 'No. 014', title: 'The Living Room'}},
      // between the exhibit label and the router, so the router stays in view
      overlays: [{type: 'search', cue: 'coffee machine', text: 'coffee machine', tag: 'NEVER SEARCHED', y: 0.262}],
    },
    {
      scene: 'room',
      cue: 'Same Wi-Fi',
      chip: {title: 'No. 014 · The Living Room', text: 'One network'},
      // 'push' starts where 'wide' ends: the crossfade from the scene before is invisible.
      props: {
        camera: 'push',
        arcs: true,
        arcsAt: 0.25,
        pathDuration: 1.7,
        tellAt: -2,
        glowFor: 0.6,
        facing: true,
        plate: {number: 'No. 014', title: 'The Living Room'},
      },
      overlays: [
        {
          type: 'callout',
          at: 0.5,
          // anchored on the router; card centred above it, top ≈ 480, between the arch peaks
          x: 0.5,
          y: 0.357,
          dx: 0,
          dy: -110,
          place: 'above',
          title: 'Same Wi-Fi',
          sub: 'IP 84.112.7.20',
        },
      ],
    },
    {
      scene: 'profiles',
      cue: 'To an ad',
      chip: {text: 'What the ad company sees'},
      overlays: [{type: 'ad', cue: 'one household', title: 'Coffee machine', x: 0.5, y: 0.415}],
    },
    {
      scene: 'tiles',
      cue: 'Multiply that',
      chip: {text: 'Every home · every night'},
      overlays: [
        {type: 'counter', at: 0.4, to: 12000000, label: 'homes', sub: 'Matched by network', x: 0.111, y: 0.45},
      ],
    },
  ],
};
