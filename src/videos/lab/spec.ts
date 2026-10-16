import type {VideoSpec} from '../../types';

/**
 * LAB: the standing sandbox. Try new scenes, overlays and sound here before touching a real video.
 * Four short scenes: a section-room, the phone cut-away, the Lab slice, and a slide back to the room.
 * Estimated timings, no voice (`yarn timings lab`). `sandbox: true`: `yarn render` refuses it without
 * `--force`. Keep it small and fast; swap scenes in and out as needed.
 */
export const spec: VideoSpec = {
  sandbox: true,
  watermark: null,
  scenes: [
    // 1 · The living room, Day, wide: FRIEND scrolls and leans in.
    {
      scene: 'section-room',
      props: {
        mood: 'day',
        camera: 'wide',
        screens: {you: 0},
        ui: {friend: [{at: 0, app: 'feed', adAt: 99}], you: [{at: 0, app: 'lock'}]},
        gestures: [{figure: 'friend', pose: 'lean-in', at: 0.5}],
      },
    },
    // 2 · The phone cut-away: the camera glides into a phone, its front comes off; waves from the room
    // fade into the listening chip; a "Hey…" wave lights it; the hatch to the network stays shut.
    {
      scene: 'phone-cutaway',
      cue: 'It does listen',
      // the scene prop `transition` is not a CSS transition (the Remotion rule can't tell them apart)
      // eslint-disable-next-line @remotion/non-pure-animation
      props: {mood: 'day', transition: 'cut', glideIn: 1.0, cutAt: 0.9, wavesAt: 1.6, waveEvery: 0.9, wakeAt: 8.0},
    },
    // 3 · The Lab: follow the line down from the living room. Phones tapped by robot arms, icons on
    // the conveyor, the counter to 17,000 on "studied … 17,000", the "0" stamp on "not one".
    {
      scene: 'section-lab',
      cue: 'As for other apps',
      props: {
        mood: 'day',
        camera: 'wide',
        follow: {direction: 'down', at: 0.12},
        countAt: 2.0,
        countFor: 1.4,
        zeroAt: 6.1,
      },
    },
    // 4 · Back to the living room (slides in).
    {
      scene: 'section-room',
      cue: 'A simpler answer',
      props: {mood: 'day', camera: 'wide', screens: {you: 0}, ui: {friend: [{at: -1, app: 'feed', adAt: 99}]}},
    },
  ],
};
