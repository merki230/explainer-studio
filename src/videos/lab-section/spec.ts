import type {VideoSpec} from '../../types';

/**
 * LAB: previews of the Section kit (stages 1–3, polish 2): the phone cut-away (the wake-word beat)
 * and the Lab slice (the 17,000-apps study), with the transitions between them and the living room.
 * Not for publishing.
 */
export const spec: VideoSpec = {
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
    // 3 · Back in the living room (a new location: it slides in).
    {
      scene: 'section-room',
      cue: 'Her phone keeps',
      props: {
        mood: 'day',
        camera: 'wide',
        screens: {you: 0},
        ui: {friend: [{at: -1, app: 'feed', adAt: 99}], you: [{at: 0, app: 'lock'}]},
        gestures: [{figure: 'friend', pose: 'lean-in', at: -1}],
      },
    },
    // 4 · The Lab: follow the line down from the living room. Phones tapped by robot arms, icons on
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
    // 5 · Back to the living room (slides in).
    {
      scene: 'section-room',
      cue: 'A simpler answer',
      props: {mood: 'day', camera: 'wide', screens: {you: 0}, ui: {friend: [{at: -1, app: 'feed', adAt: 99}]}},
    },
  ],
};
