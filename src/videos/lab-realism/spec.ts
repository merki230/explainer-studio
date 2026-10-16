import type {VideoSpec} from '../../types';

/**
 * LAB: the realism test and pass (objects realistic, people stylized). Scenes 1–5: the phone test
 * (before/after pairs). Scenes 6–11: the realism pass, everything switched on with `realism: true, ao`.
 * Not for publishing.
 */
const cutaway = {mood: 'day', drift: 0, glideIn: 1.0, cutAt: 2.0, wavesAt: 3.0, waveEvery: 0.9, wakeAt: 8.0} as const;
const couch = {
  mood: 'day',
  camera: 'couch',
  push: 0,
  drift: 0,
  cast: ['friend', null],
  ui: {friend: [{at: 0, app: 'feed', adAt: 99}]},
} as const;
const room = {
  push: 0,
  drift: 0,
  ui: {friend: [{at: 0, app: 'feed', adAt: 99}], you: [{at: 0, app: 'lock'}]},
  screens: {you: 0},
} as const;

/** Ambient occlusion on the realism scenes (flip to compare without). */
const ao = true;

export const spec: VideoSpec = {
  watermark: null,
  captions: false,
  scenes: [
    // 1 · BEFORE: the phone cut-away as it is (closed hero, the front comes off, waves, the chip lights).
    {scene: 'phone-cutaway', props: cutaway},
    // 2 · AFTER: the same shot, realistic phone and teardown.
    {scene: 'phone-cutaway', cue: 'After the realism', props: {...cutaway, realism: true, ao}},
    // 3 · BEFORE: FRIEND on the couch with the simple phone.
    {scene: 'section-room', cue: 'Then the friend', props: couch},
    // 4 · AFTER: the same, with the realistic phone in her hands.
    {scene: 'section-room', cue: 'Now the friend', props: {...couch, realPhones: true}},
    // 5 · The realistic phone turned to show its back (camera island, frosted glass), closed.
    {
      scene: 'phone-cutaway',
      cue: 'Last, the back',
      props: {...cutaway, realism: true, ao, yaw: 2.5, cutAt: 99, wavesAt: 99, wakeAt: undefined},
    },
    // 6 · The router up close (realism), its LED going orange at 3 s (the system).
    {
      scene: 'section-room',
      cue: 'Next, the router',
      props: {
        ...room,
        mood: 'day',
        realism: true,
        ao,
        led: 0,
        camera: {from: {look: [0.62, 1.82, -0.9], distance: 3.4}},
      },
    },
    // 7 · The living room, Day, wide (realism).
    {
      scene: 'section-room',
      cue: 'Then the whole',
      props: {...room, mood: 'day', camera: 'wide', realism: true, ao, led: 1},
    },
    // 8 · The living room, Night, wide (realism; softer reflections).
    {scene: 'section-room', cue: 'At night the', props: {...room, mood: 'night', camera: 'wide', realism: true, ao}},
    // 9 · The cut-away at Night (realism).
    {
      scene: 'phone-cutaway',
      cue: 'Night inside the',
      props: {...cutaway, mood: 'night', realism: true, ao, glideIn: 0, cutAt: 0.8, wavesAt: 1.5, wakeAt: 3.0},
    },
    // 10 · The Lab (realism).
    {
      scene: 'section-lab',
      cue: 'Finally the lab',
      props: {mood: 'day', camera: 'wide', realism: true, ao, countAt: 0.5, countFor: 1.0},
    },
    // 10b · The Lab, close on the arms and phones (realism).
    {
      scene: 'section-lab',
      cue: 'tap rows of',
      props: {
        mood: 'day',
        realism: true,
        ao,
        countAt: 0,
        countFor: 0.1,
        push: 0,
        drift: 0,
        camera: {from: {look: [0.0, 1.15, -0.6], distance: 4.2}},
      },
    },
    // 11 · The couch, Day (realism: fabric, piping, sag, table grain, mug, cast with realistic phones).
    {scene: 'section-room', cue: 'Close on the', props: {...room, mood: 'day', camera: 'couch', realism: true, ao}},
  ],
};
