import type {OverlaySpec, VideoSpec} from '../../types';

/**
 * Exhibit No. 004 · The Meter Box, in The Section (style guide v0.11.2). Rough cut, from `av-script.md`
 * (decisions of 2026-10-18) with the owner's changes after the street test:
 *  1. Frame 0 is the meter `box` close-up (meter, radio, lid cap). A burst leaves the cap on "…your water
 *     meter", and the camera pulls back to the truck as the burst reaches it. The last scene cranes back
 *     to that close-up for the loop.
 *  2. The truck is a whole, realistic white pickup, never cut by the plane and never over the front of
 *     the section: 1, it comes down the near lane and stops beside the box ≈ 1.5 m behind the plane;
 *     6, it comes down the near lane again and the scene ends with it ≈ 3.7 m behind the plane.
 *  3. The pedestal tank is seen in the wide framing only (9–10).
 * Plus the scene-builder's advice: the medium-wide street framing starts at the sidewalk (STREET_MW),
 * and YOU has a `kitchen` framing (KITCHEN).
 *
 * One location, S (`street-slice`), all Day, 10:15 AM; every hand-over is `continue` and every framing
 * change is a camera key. Sizes: C close, M medium, MW medium-wide, W wide (9–10 only).
 *
 * Loop (§ 8): frame 0 and the last frame are the BOX close-up, drift 0. The tap is off on both, so the
 * sweep hand is still and the leak triangle turns slowly on both (the leak is there from frame 0); YOU
 * turns the tap on in the kitchen (41.6) and off on "tap" (49.68).
 *
 * Timing: scene starts are cues copied from script.txt. Props inside a scene are seconds into it. Keys
 * shared across scenes (tap, flow, leak spin) are written once in **video seconds** and rebased with
 * `r(abs, start)`. T holds the cue times of the directed take (transcript.json, 60.8 s); re-check T and
 * every // TIMED value if the voiceover is redone.
 *
 * Sound (style guide § 9 v0.11.2; No. 003's pattern): one music bed, switched with MUSIC_TAKE, from frame
 * 0 with a 1.5 s fade-in, ≈ 9 dB under the dry voice, no duck, faded to silence on the last frame.
 * Action sounds 13–19 dB under the voice (SOUND, by scene): the truck arriving and braking (1) and its
 * pass (6), a soft blip on YOUR cap's bursts (one blip for a group; the weak bursts of 8 and the
 * neighbours' quieter), YOU's tap on (11) and off (13), the phone's alert (11). No slides, so no whoosh;
 * no hum. Levels from measured loudness (voice −21.4 LUFS; music A −15.0, B −16.2, C −16.3; truck
 * −10.5, blip −25.5, tap −8.6, notify −34.4): re-check if a file is replaced. Nothing sounds after
 * ≈ 60.3 s, so the loop is clean.
 *
 * Illustrative (🎭, disclosed in the post; Decision 4): the ID and reading digits, the addresses on the
 * truck computer, the "Possible leak" text, the hourly bars, the burst timing as drawn.
 *
 * From the scene-builder (README row, `StreetSliceScene.tsx`): anchors on S ('cap',
 * 'radio', 'register', 'pole', 'cab', 'laptop', YOU's head for the tag), the `kitchen` framing and the
 * `tap` prop, the radio cut-away (`radioCut`), and the detail-box contents 'laptop', 'usage' and
 * 'register': all built (scene-builder, README row). Callouts keep x/y fallbacks. No music or sfx in the rough cut.
 */

type V3 = [number, number, number];
type Framing = {look: V3; distance: number};

/** Scene cue times, video seconds, from transcript.json (directed take). TIMED. */
const T = {
  hook: 0, // A truck can read
  look: 7.04, // Look at the meter box
  cap: 11.71, // and that round cap
  every: 14.56, // Every few seconds
  reading: 18.99, // with your reading
  truck: 21.36, // The truck rolls by
  maker: 27.84, // One maker says
  burst: 31.28, // and each burst
  newer: 34.88, // Newer systems skip
  poles: 38.52, // to receivers on poles
  flag: 41.28, // That lets many
  website: 44.4, // Your utility's website
  tap: 48.8, // Turn off every tap
  triangle: 52.24, // a red triangle
  end: 56.2, // And if there's a round cap
};

/** Video seconds → seconds into the scene that starts at `start` (negative = before the scene). */
const r = (abs: number, start: number) => Math.round((abs - start) * 100) / 100;

// The scene prop `transition` is not a CSS transition; the Remotion rule can't tell them apart.
// eslint-disable-next-line @remotion/non-pure-animation
const CONTINUE = {transition: 'continue'} as const;

const DAY = {mood: 'day'} as const;

// ---------------------------------------------------------------- framings (fixed 3/4 angle, metres)

/** A camera key: arrive at framing `f` at `at` s into the scene (eased from the previous key). */
const key = (at: number, f: Framing, o: {ease?: 'out' | 'inOut' | 'sine'; log?: boolean} = {}) => ({at, ...f, ...o});

/** C, frame 0 and the last frame: the pit cut open, meter, radio and lid cap (the scene's 'box' preset). */
const BOX: Framing = {look: [0.45, -0.26, -0.1], distance: 4.0};
/** C: the radio module under the lid (the cap at the top of the frame). */
const RADIO: Framing = {look: [0.38, -0.08, -0.17], distance: 1.8};
/** C: the meter's register (the three-wire cable's end). */
const REGISTER: Framing = {look: [0.45, -0.2, -0.13], distance: 1.6};
/** C: the round cap on the lid, the coax dropping from its stem. */
const CAP: Framing = {look: [0.45, 0.12, -0.09], distance: 1.8};
/** M: the box with the air above the lid, for the bursts' rhythm. */
const BOX_AIR: Framing = {look: [0.6, 0.0, -0.2], distance: 5};
/** MW, the reveal of line 1: the cap and the far lane with the truck (the scene's 'cap' preset). */
const REVEAL: Framing = {look: [2.4, 0.9, -3.5], distance: 34};
/** The question: a slow push from the reveal toward the box. */
const Q_PUSH: Framing = {look: [1.9, 0.5, -2.5], distance: 30};
/** MW: the cut face from the sidewalk to the far curb, the near street behind (scene-builder's advice). */
const STREET_MW: Framing = {look: [2.7, 2.3, -1.5], distance: 34};
/** MW tracking line 6: the truck coming down the near lane, start (up the street) and end (near YOUR house). */
const TRACK_FAR: Framing = {look: [2.6, 1.0, -58], distance: 34};
const TRACK_NEAR: Framing = {look: [2.6, 0.8, -12], distance: 34};
/** W: the street in depth to the pole and the pedestal tank (the scene's 'wide' preset). */
const WIDE: Framing = {look: [-1.0, 6.0, -16], distance: 86};
/** M: YOU at the kitchen sink (YOU at x −5.72; the head ≈ y 2.4). C: YOU and the phone. */
const KITCHEN: Framing = {look: [-6.4, 1.55, -1.1], distance: 9};
const KITCHEN_CLOSE: Framing = {look: [-6.2, 1.85, -1.2], distance: 6};
/** M → C: down the service pipe under the yard on the way to the register. */
const PIPE: Framing = {look: [-2.2, -0.3, -0.05], distance: 4.5};

/** The cover: the box at the curb and the stopped truck beside it, a touch closer than REVEAL. */
const COVER_CAMERA: Framing = {look: [1.0, 0.7, -2.6], distance: 21};

// ---------------------------------------------------------------- the water (video seconds)

/** YOU's tap: on in the kitchen (41.6, as the glide lands), off on "tap" (49.68). TIMED */
const TAP = {on: 41.6, off: 49.68};
/** The sweep hand turns only while the tap runs (turns/s). */
const flow = (start: number) => [
  {at: r(0, start), speed: 0},
  {at: r(TAP.on, start), speed: 0.4},
  {at: r(TAP.off, start), speed: 0},
];
/** The leak triangle: slow all the time (the hidden leak), fast while the tap runs (turns/s). */
const leakSpin = (start: number) => [
  {at: r(0, start), speed: 0.3},
  {at: r(TAP.on, start), speed: 2},
  {at: r(TAP.off, start), speed: 0.3},
];
/** Everything about the water and YOU's tap, rebased to a scene start. */
const water = (start: number) => ({
  flow: flow(start),
  leakSpin: leakSpin(start),
  tap: {on: r(TAP.on, start), off: r(TAP.off, start)},
});

/** S with the shared state: Day, the water, YOU at the sink, no truck unless a scene sets one. */
const S = (start: number, extra: Record<string, unknown>) => ({...DAY, ...CONTINUE, truck: null, ...water(start), ...extra});

// ---------------------------------------------------------------- overlay placement

/** Callouts: anchors on S with x/y fallbacks; offsets to set on stills. */
const CALLOUT = {
  radio: {anchor: 'radio', x: 0.5, y: 0.42, place: 'side', dx: -150, dy: 10},
  antenna: {anchor: 'cap', x: 0.5, y: 0.5, place: 'above', dy: -260},
  burst: {anchor: 'cap', x: 0.3, y: 0.56, place: 'side', dx: 140, dy: -300},
  receiver: {anchor: 'pole', x: 0.72, y: 0.36, place: 'side', dx: -160, dy: -90},
} as const;

// ---------------------------------------------------------------- sound (§ 9)

// The music take: switch with this one constant.
const MUSIC_TAKE: 'a' | 'b' | 'c' = 'a';
// level = (voice LUFS − 9) − track LUFS, voice −21.4: a bed ≈ 9 dB under the dry voice, steady (no duck).
const MUSIC_LEVEL = {a: -15.4, b: -14.2, c: -14.1} as const;

// SFX volumes are file-level offsets; "≈ N under" = file LUFS + volume against the voice (−21.4).
// The truck (4 s, −10.5 LUFS): loud 0.5–1.4 s into the file, decaying to an idle tail by ≈ 2.4 s. −25 ≈ 14 under.
const TRUCK = {type: 'sfx', name: 'truck', volume: -25} as const;
// A soft blip on a burst (0.5 s, −25.5 LUFS): −13 ≈ 17 under; QUIET −16 ≈ 20 under (groups, weak bursts).
const BLIP = {type: 'sfx', name: 'blip', volume: -13} as const;
const BLIP_QUIET = {...BLIP, volume: -16} as const;
// The tap (3 s, −8.6 LUFS): a click and running water to ≈ 1.6 s, then the stop. −28 ≈ 16 under.
const TAP_SFX = {type: 'sfx', name: 'tap', volume: -28} as const;
// The phone's alert (1 s, −34.4 LUFS): 0 ≈ 13 under.
const NOTIFY = {type: 'sfx', name: 'notify', volume: 0} as const;

/** Sound per scene (index in `scenes`), seconds into the scene. TIMED against the props above. */
const SOUND: Record<number, OverlaySpec[]> = {
  // 1: blips on the bursts (1.20 "water", 5.40 "talk"); the truck's loud part lands as it slows (≈ 1.5–2.4 s),
  // braking and idle tail to ≈ 5 s
  0: [{...BLIP, at: 1.2}, {...BLIP, at: 5.4}, {...TRUCK, at: 1.0, fade: 0.3}],
  // 4: the two bursts of "every few seconds"
  3: [{...BLIP, at: r(14.88, T.every)}, {...BLIP, at: r(17.6, T.every)}],
  // 5: the burst on "reading"
  4: [{...BLIP, at: r(19.44, T.reading)}],
  // 6: the truck's pass as it nears (quieter, from 3 s), two of the four neighbour bursts
  5: [{...TRUCK, volume: -29, at: 3.0, fade: 0.5, until: 6.4}, {...BLIP_QUIET, at: 1.9}, {...BLIP_QUIET, at: 5.1}],
  // 8: the short and the weak burst, quiet
  7: [{...BLIP_QUIET, at: r(32.64, T.burst)}, {...BLIP_QUIET, at: r(33.52, T.burst)}],
  // 9: every lid at once on "many": one blip
  8: [{...BLIP, at: r(36.96, T.newer)}],
  // 10: the lines to the pole, then to the tank
  9: [{...BLIP_QUIET, at: r(39.3, T.poles)}, {...BLIP_QUIET, at: r(40.0, T.poles)}],
  // 11: the tap on (click and water, faded under the line), the alert as the phone lights on "flag"
  10: [{...TAP_SFX, at: r(TAP.on, T.flag), fade: 0.4, until: r(TAP.on + 1.5, T.flag)}, {...NOTIFY, at: r(42.7, T.flag)}],
  // 13: the tap off: the file from 1.2 s (water, then the stop at ≈ 1.6 s) so the stop lands on "tap" (49.68)
  12: [{...TAP_SFX, trim: 1.2, at: r(TAP.off - 0.42, T.tap)}],
  // 15: the last burst on "doing" (59.80); silent from ≈ 60.3 s to the end
  14: [{...BLIP, at: r(59.8, T.end)}],
};

const picture: VideoSpec = {
  watermark: null,
  // starts at frame 0 (startAt: 0), fades in over 1.5 s, out to silence at the end (owner, 2026-10-18)
  music: {src: `audio/music-${MUSIC_TAKE}.mp3`, level: MUSIC_LEVEL[MUSIC_TAKE], duckDb: 0, startAt: 0, fadeIn: 1.5},
  tail: 1.0, // the end hold on frame 0's close-up
  // Cover still (`yarn cover water-meter`): the A/V cover idea. The cut-open meter box (meter, radio, lid
  // cap) at the curb, the white pickup stopped beside it in the near lane, whole, its front bumper 1.5 m
  // behind the cut, and one orange burst arcing from the cap to its roof receiver (frozen 0.65 s after it
  // leaves: line drawn, ring up). Text in the sky band, two lines.
  cover: {
    text: "Who's reading\nyour meter?",
    size: 120,
    scene: 'street-slice',
    camera: COVER_CAMERA,
    at: 2,
    props: {
      ...DAY,
      truck: {direction: 'toward', through: -1.5, speed: [{at: 0, speed: 0}]},
      bursts: [{at: 1.35, lid: 0, to: 'truck'}],
      leakSpin: [{at: 0, speed: 0.3}],
    },
  },
  scenes: [
    // 1 · Lines 1–2. Frame 0, C: the box close-up. A burst leaves the cap on "water" (1.20) and runs to
    // the truck coming down the near lane toward us, whole and behind the plane, as the camera
    // pulls back (1.3 → 3.3 s, log dolly) to the reveal as the truck slows to a stop beside the box. Question:
    // a slow push toward the box, and a second burst on "talk" (5.40) reaches the waiting truck.
    {
      scene: 'street-slice',
      cue: 'A truck can read',
      props: S(T.hook, {
        drift: 0, // loop: frame 0 must match the last frame
        framing: 'box',
        cameraKeys: [key(0, BOX), key(1.3, BOX), key(3.3, REVEAL, {log: true}), key(7.0, Q_PUSH, {ease: 'sine'})],
        // down the near lane toward us at road speed (9 m/s ≈ 20 mph, Decision 6), whole: ≈ 13 m up the
        // street as the first burst lands (≈ 1.77 s), then a smooth stop (≈ 3 m/s², from 1.4 s) beside the
        // box, front bumper ≈ 1.5 m behind the plane by ≈ 4.2 s; it idles there (owner: never over the
        // front of the section). Integrated: 27.06 m travelled. TIMED
        truck: {
          direction: 'toward',
          through: -28.6,
          speed: [
            {at: 0, speed: 9},
            {at: 1.4, speed: 7.5},
            {at: 2.0, speed: 5.5},
            {at: 2.6, speed: 3.5},
            {at: 3.2, speed: 1.6},
            {at: 3.8, speed: 0},
          ],
          beyond: 'hide',
        },
        bursts: [
          {at: 1.2, lid: 0, to: 'truck'}, // TIMED: "water" (1.20)
          {at: 5.4, lid: 0, to: 'truck'}, // TIMED: "talk" (5.40)
        ],
      }),
      overlays: [
        {
          type: 'title',
          at: 0,
          question: 'How does a meter talk\nto a moving truck?',
          number: 'No. 004',
          title: 'The Meter Box',
          time: '10:15 AM',
          until: 'Look at the meter box', // faded by the cut (7.04); the question ends ≈ 6.6
        },
      ],
    },
    // 2 · Lines 3–4a, C: glide back down to the box on "Look", push in on the radio on "radio" (9.44),
    // crane down the three-wire cable to the register on "wired to the meter" (10.32).
    {
      scene: 'street-slice',
      cue: 'Look at the meter box',
      props: S(T.look, {
        cameraKeys: [key(0.85, BOX), key(r(9.9, T.look), RADIO), key(r(10.3, T.look), RADIO), key(r(11.3, T.look), REGISTER)],
      }),
      overlays: [{type: 'callout', ...CALLOUT.radio, title: 'Radio', sub: 'battery-powered', cue: 'radio in there', until: r(10.96, T.look)}],
    },
    // 3 · Line 4b, C: crane up the coax from the register to the round cap; ANTENNA on "round cap".
    {
      scene: 'street-slice',
      cue: 'and that round cap',
      props: S(T.cap, {cameraKeys: [key(0, REGISTER), key(0.9, CAP), key(2.8, {...CAP, distance: 2.1}, {ease: 'sine'})]}),
      overlays: [{type: 'callout', ...CALLOUT.antenna, title: 'Antenna', cue: 'round cap'}],
    },
    // 4 · Line 5a, M: pull back to the box with air over the lid; a burst every ≈ 2.5 s (🎭 timing).
    {
      scene: 'street-slice',
      cue: 'Every few seconds',
      props: S(T.every, {
        cameraKeys: [key(0.8, BOX_AIR)],
        bursts: [
          {at: r(14.88, T.every), lid: 0, to: null}, // TIMED: "few" (14.88)
          {at: r(17.6, T.every), lid: 0, to: null}, // TIMED: "short" (17.60)
        ],
      }),
    },
    // 5 · Line 5b, M → MW: a burst on "reading" (19.44) rises over the street as the camera pulls back
    // to the street from the sidewalk; its label names what it carries.
    {
      scene: 'street-slice',
      cue: 'with your reading',
      props: S(T.reading, {
        cameraKeys: [key(2.2, STREET_MW, {ease: 'sine'})],
        bursts: [{at: r(19.44, T.reading), lid: 0, to: null, reach: 1.8}], // TIMED: "reading" (19.44)
      }),
      overlays: [
        {type: 'callout', ...CALLOUT.burst, title: 'Reading + ID', sub: 'ID 30514827 · 01462', cue: 'reading and', until: 'The truck rolls by'},
      ],
    },
    // 6 · Line 6, MW tracking: the truck comes down the near lane at road speed, whole, past the
    // neighbours' lids (each bursts to its roof receiver as it nears) toward YOUR house; it stops the
    // scene 4 m short of the plane. The laptop faces the driver; it is read in the detail box.
    {
      scene: 'street-slice',
      cue: 'The truck rolls by',
      props: S(T.truck, {
        cameraKeys: [key(0, TRACK_FAR), key(5.8, TRACK_NEAR, {ease: 'sine'})],
        track: {at: 0, blend: 0.01, distance: 34, offset: [-1.5, -0.4, 0]}, // the look follows the cab
        // front bumper at z −62 (behind the plane); 9 m/s → z ≈ −4 by the cut (6.48 s). TIMED
        truck: {direction: 'toward', through: -62, speed: [{at: 0, speed: 9}]},
        bursts: [
          {at: 0.5, lid: 4, to: 'truck'},
          {at: 1.9, lid: 3, to: 'truck'}, // ≈ "normal speed"
          {at: 3.5, lid: 2, to: 'truck'}, // ≈ "board"
          {at: 5.1, lid: 1, to: 'truck'}, // ≈ "an address"
        ],
      }),
      overlays: [
        // 'laptop': rows ID → address filling with each burst (🎭)
        {type: 'detail', who: 'you', content: 'laptop', side: 'left', top: 300, cue: 'computer on board', until: 'One maker says'},
      ],
    },
    // 7 · Line 7a, C: back on the radio; it opens as an object cut-away (cells, board) on "battery's";
    // the counter on "twenty".
    {
      scene: 'street-slice',
      cue: 'One maker says',
      props: S(T.maker, {
        cameraKeys: [key(0.8, RADIO)],
        radioCut: {at: r(28.88, T.maker)}, // opens over 0.8 s from "battery's" (28.88). TIMED
      }),
      overlays: [
        {type: 'counter', from: 0, to: 20, label: 'years', sub: 'designed to last', subPlace: 'above', x: 0.111, y: 0.16, duration: 1.0, cue: 'twenty years'},
      ],
    },
    // 8 · Line 7b, C: the module still open; a tiny burst on "short" (32.64), a weaker one on "weak" (33.52).
    {
      scene: 'street-slice',
      cue: 'and each burst',
      props: S(T.burst, {
        cameraKeys: [key(3.4, {...RADIO, distance: 2.1}, {ease: 'sine'})],
        radioCut: {at: -5}, // already open
        bursts: [
          {at: r(32.64, T.burst), lid: 0, to: null, reach: 0.35}, // TIMED: "short"
          {at: r(33.52, T.burst), lid: 0, to: null, reach: 0.25}, // TIMED: "weak"
        ],
      }),
    },
    // 9 · Line 8a, W: the module closes as the camera pulls all the way out to the street in depth (the
    // only wide shot: the pole, the pedestal tank); no truck. Every lid bursts on "many send hourly".
    {
      scene: 'street-slice',
      cue: 'Newer systems skip',
      props: S(T.newer, {
        cameraKeys: [key(0, RADIO), key(1.6, WIDE, {log: true}), key(3.6, {...WIDE, distance: 83}, {ease: 'sine'})],
        radioCut: {at: -5, until: 0.4}, // closes as the pull-back starts
        bursts: [0, 1, 2, 3, 4, 5, 6, 7].map((lid) => ({at: r(36.96 + lid * 0.12, T.newer), lid, to: null})), // TIMED: "many"
      }),
    },
    // 10 · Line 8b, W: lines run to the pole's receiver on "poles" (39.44) and to the tank's on "water
    // tanks" (40.08).
    {
      scene: 'street-slice',
      cue: 'to receivers on poles',
      props: S(T.poles, {
        cameraKeys: [key(2.7, {...WIDE, distance: 80}, {ease: 'sine'})],
        bursts: [
          ...[0, 1, 2].map((lid) => ({at: r(39.3 + lid * 0.15, T.poles), lid, to: 'pole'})), // TIMED: "poles"
          ...[4, 5, 6, 7].map((lid) => ({at: r(40.0 + (lid - 4) * 0.15, T.poles), lid, to: 'tank'})), // TIMED: "water tanks"
        ],
      }),
      overlays: [{type: 'callout', ...CALLOUT.receiver, title: 'Receiver', sub: 'hourly readings', cue: 'receivers on poles'}],
    },
    // 11 · Line 9, M: glide to the kitchen; YOU turns the tap on and rinses; the phone page with the
    // "Possible leak" flag in the detail box from "possible" (43.04). YOU's tag first.
    {
      scene: 'street-slice',
      cue: 'That lets many',
      props: S(T.flag, {framing: 'kitchen', cameraKeys: [key(0.9, KITCHEN)], phone: {at: r(42.64, T.flag)}}), // TIMED: the phone up on "flag" (42.64)
      overlays: [
        {type: 'tag', who: 'you', at: 0.1, until: 'flag a possible'},
        // 'usage': the hourly page, "Possible leak" banner first (🎭)
        {type: 'detail', who: 'you', content: 'usage', side: 'left', cue: 'possible leak'},
      ],
    },
    // 12 · Line 10, C: push in on YOU and the phone; the box carries on, the hourly bars on "hour by hour".
    {
      scene: 'street-slice',
      cue: "Your utility's website",
      props: S(T.website, {framing: 'kitchen', phone: {at: -5}, cameraKeys: [key(0, KITCHEN), key(1.4, KITCHEN_CLOSE), key(4.4, {...KITCHEN_CLOSE, distance: 5.6}, {ease: 'sine'})]}),
      overlays: [{type: 'detail', who: 'you', content: 'usage', side: 'left', at: 0, pageAt: 0, barsAt: r(47.36, T.website), until: 'Turn off every tap'}], // TIMED: bars on "hour by hour" (47.36)
    },
    // 13 · Lines 11a–b, M → C: YOU turns the tap off on "tap" (49.68); the camera follows the service
    // pipe down under the yard to the register.
    {
      scene: 'street-slice',
      cue: 'Turn off every tap',
      props: S(T.tap, {
        framing: 'kitchen',
        phone: {at: -5, until: 0.4}, // put down before the hand goes to the lever
        cameraKeys: [key(0.4, KITCHEN), key(r(50.1, T.tap), KITCHEN), key(r(51.2, T.tap), PIPE), key(r(52.2, T.tap), REGISTER)],
      }),
    },
    // 14 · Line 11c, C: the register, the tap off: the sweep hand still, the red triangle still turning;
    // read from above in the detail box from "red triangle".
    {
      scene: 'street-slice',
      cue: 'a red triangle',
      props: S(T.triangle, {cameraKeys: [key(3.9, {...REGISTER, distance: 1.45}, {ease: 'sine'})]}),
      overlays: [
        // 'register': the dial from above, the red triangle turning
        {type: 'detail', who: 'you', content: 'register', side: 'left', cue: 'red triangle', until: "And if there's"},
      ],
    },
    // 15 · Line 12, C → C: crane up from the register to frame 0's BOX close-up by "cap" (57.12); one
    // burst on "doing" (59.80), gone before the end. Last frame = frame 0 minus the title block.
    {
      scene: 'street-slice',
      cue: "And if there's a round cap",
      props: S(T.end, {
        drift: 0, // loop
        cameraKeys: [key(0, REGISTER), key(r(57.1, T.end), BOX)],
        bursts: [{at: r(59.8, T.end), lid: 0, to: null}], // TIMED: "doing" (59.80); ring gone by ≈ 60.6
      }),
    },
  ],
};

export const spec: VideoSpec = {
  ...picture,
  scenes: picture.scenes.map((sc, i) => ({...sc, overlays: [...(sc.overlays ?? []), ...(SOUND[i] ?? [])]})),
};
