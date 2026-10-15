import type {VideoSpec} from '../../types';

/**
 * LAB: previews of the Section kit (v0.8, stages 1–2a), so the slice, the cast, gestures and the
 * overlays can be judged as stills without touching a real video. Not for publishing; the
 * attribution text is a sample.
 */
export const spec: VideoSpec = {
  watermark: null,
  scenes: [
    // Night, wide: the title block at 1.0 s; FRIEND leans in to her screen, YOU's phone is locked,
    // then YOU looks up at the router.
    {
      scene: 'section-room',
      props: {
        mood: 'night',
        camera: 'wide',
        gestures: [
          {figure: 'friend', pose: 'lean-in', at: 1.0},
          {figure: 'you', pose: 'look-up', at: 4.0, hold: 1.5},
        ],
        screens: {you: 0},
      },
      overlays: [{type: 'title', at: 1.0, number: 'No. 001', title: 'The Living Room', time: '9:47 PM'}],
    },
    // Day, same framing: the same room the next morning, with a statement card and its attribution.
    {
      scene: 'section-room',
      cue: 'The next morning',
      props: {mood: 'day', camera: 'wide', screens: {you: 0}},
      overlays: [
        {type: 'statement', cue: 'the same room', text: 'The same room.', attribution: 'FTC staff report, 2017'},
      ],
    },
    // Day, on the couch: name tags; YOU's phone lights, YOU lifts it to look; FRIEND turns to YOU.
    {
      scene: 'section-room',
      cue: 'Your phone lights',
      props: {
        mood: 'day',
        camera: 'couch',
        screens: {you: {at: 0.6}},
        gestures: [
          {figure: 'you', pose: 'lift-phone', at: 1.0},
          {figure: 'friend', pose: 'turn-to', at: 1.6},
        ],
      },
      overlays: [
        {type: 'tag', who: 'friend', at: 0.1},
        {type: 'tag', who: 'you', at: 0.1},
      ],
    },
  ],
};
