import type {VideoSpec} from '../../types';

/**
 * Exhibit No. 002 · The Tire, in The Section (style guide v0.11.1). Rough cut, from `av-script.md`.
 *
 * Three locations and the Lab, all Day: W, the wheel cut open through the axle plane (`wheel-slice`,
 * framings `whole`, `valve`, `teardown`); C, the car cut open with YOU driving (`car-slice`, variant
 * `sensors`); C2, the other car with MOM and no radio (`car-slice`, variant `indirect`); L, the Lab
 * dressed as a tire bay (`section-lab`, `tire-bay`).
 *
 * Opening and loop (§ 8): frame 0 is the cut wheel with the sleeping sensor (dim orange node dot,
 * owner decision 1), the title block already up with the question (§ 6). The last scene glides back to
 * that picture: same framing (HOOK), wheel stopped with the valve at home, sensor asleep with the same
 * dim dot, tire full, no chuck. Camera drift is 0 on the first and last scenes so the loop matches.
 *
 * Transitions (§ 8): framing changes inside a location are glides; a new location slides in; the two
 * moves led by a radio pulse (wheel → car) are `follow`. Every scene sets `transition` explicitly.
 *
 * The car faces +x with the driver on the far side: the near (visible) wheels are FR and RR.
 *
 * Scenes start on a `cue` copied from script.txt; overlays start on cues where possible. Timed to
 * the live `directed` take (79.8 s). Props marked `// TIMED` are seconds into the scene, set from
 * transcript.json: re-check them if the voiceover is redone. Callout anchors were read off stills.
 *
 * Illustrative (🎭, disclosed in the post): the sensor IDs on the pulse tags ("4F2A" on the near rear
 * wheel, scene 9) and the Lab's 2-of-8 vs 1-of-8 wheel rows (scene 17). No music or sfx in the rough cut.
 */

type V3 = [number, number, number];

/**
 * The wheel's whole-wheel framing, closer than the `whole` preset (coordinator, frame-0 review): the
 * cut wheel at about 60% of the safe width (§ 6 subject cap), centred under the title block, so the
 * sensor and its dim dot read at phone size. Used on every whole-wheel scene so W keeps one picture,
 * and on frame 0 and the last frame, which must match.
 */
const HOOK = {look: [-0.22, -0.18, 0.11] as V3, distance: 10.3};
const WHOLE = {camera: {from: HOOK}} as const;
/**
 * Scene 1's push-in target (owner feedback: frame 0 held still for 3 s): the tire's top cut profile and
 * the sensor, about 1.9× closer, the sensor at ≈ (560, 800) px, the profile's top clear of the title
 * block (≈ y 450). Derived from the sensor's position on the HOOK still; check on stills.
 */
const SENSOR_CLOSE = {look: [-0.167, 0.436, -0.118] as V3, distance: 5.5};
/**
 * Scene 1's camera (`cameraKeys`): HOOK at frame 0 (the loop's picture) → an ease-out push to
 * SENSOR_CLOSE that moves from frame 1 and lands on "tire" (2.8 s) → hold through "wakes up" and
 * "drive away" → a sine pull back to HOOK from "So why" (6.19) to just before the cut (9.28), so the
 * spinning wheel and its first pulse (7.56) read.
 */
const OPENING_KEYS = [
  {at: 0, ...HOOK},
  {at: 2.8, ...SENSOR_CLOSE, ease: 'out'},
  {at: 6.19, ...SENSOR_CLOSE},
  {at: 9.1, ...HOOK, ease: 'sine'},
];
/**
 * Scene 5's close valve framing (the `valve` preset was too wide to read the stem): the stem from its
 * cap outside the rim to the sensor inside, ≈ 1.7× closer than the preset. Reached by a 0.8 s glide
 * from HOOK, where scene 4 ends (cameraKeys replace the auto glide).
 */
const VALVE_CLOSE = {look: [-0.184, 0.339, 0.044] as V3, distance: 3.8};

/** A glide into a scene (§ 8): an eased camera move to a new framing in the same location. */
// The scene prop `transition` is not a CSS transition; the Remotion rule can't tell them apart.
// eslint-disable-next-line @remotion/non-pure-animation
const GLIDE = {transition: 'glide'} as const;
// eslint-disable-next-line @remotion/non-pure-animation
const SLIDE = {transition: 'slide'} as const;
// The pulse leads the camera out of the wheel up to the car (2D follow stand-in until linked).
// eslint-disable-next-line @remotion/non-pure-animation
const FOLLOW_UP = {transition: 'follow', follow: {direction: 'up'}} as const;

const DAY = {mood: 'day', realism: true} as const;
const DRIVING = [{at: 0, speed: 1}];
const FULL = [{at: 0, value: 1}];

// Callout anchors (fractions of the frame), from stills.
const AT = {
  sensorWhole: {x: 0.58, y: 0.325},
  valveCap: {x: 0.394, y: 0.443},
  tdAntenna: {x: 0.47, y: 0.31},
  tdPressure: {x: 0.4, y: 0.4},
  tdMotion: {x: 0.5, y: 0.4},
  tdComputer: {x: 0.59, y: 0.4},
};

export const spec: VideoSpec = {
  watermark: null,
  tail: 1.2, // the end hold on frame 0's picture
  scenes: [
    // 1 · Frame 0 and the question (A/V 1 + 2, one scene so the title block can hold past the question).
    // The sensor wakes on "wakes", the wheel starts turning on "drive away", the first orange pulse
    // leaves through the rubber during the question.
    {
      scene: 'wheel-slice',
      cue: 'In many cars',
      props: {
        ...DAY,
        cameraKeys: OPENING_KEYS, // TIMED: frame 0 is still HOOK (the loop's picture)
        drift: 0, // loop: frame 0 must match the last frame
        spin: [
          {at: 0, speed: 0},
          {at: 4.16, speed: 1}, // TIMED: "drive" (4.16)
        ],
        pressure: FULL,
        sensor: [
          {at: 0, state: 'asleep'},
          {at: 3.36, state: 'awake'}, // TIMED: "wakes" (3.36)
        ],
        dimDot: true, // owner decision 1: the sleeping sensor's dim orange node dot
        // TIMED: a whole number of turns after the spin-up (0.4 + 2.6 rev), so the valve is back at home;
        // lands on "its own" (7.68)
        pulses: [7.56],
      },
      overlays: [
        {
          type: 'title',
          at: 0,
          question: 'Why would a tire\nneed its own radio?',
          number: 'No. 002',
          title: 'The Tire',
          time: '7:58 AM',
          until: 'Your car needs', // faded by the cut (9.28); the question ends 8.64
        },
      ],
    },
    // 2 · The car needs the pressure (A/V 3a): the cut car, YOU driving.
    {
      scene: 'car-slice',
      cue: 'Your car needs',
      props: {...DAY, ...SLIDE, variant: 'sensors', driver: 'you', framing: 'wide', driving: DRIVING},
      overlays: [{type: 'tag', who: 'you', at: 0.3}],
    },
    // 3 · A wire to a spinning wheel winds up (A/V 3b): glide to the front wheel, the grey cable.
    {
      scene: 'car-slice',
      cue: "but it's hard",
      props: {
        ...DAY,
        ...GLIDE,
        variant: 'sensors',
        driver: 'you',
        framing: 'frontWheel',
        driving: DRIVING,
        wire: {at: 1.0, until: 3.1}, // TIMED: winds from "wire" (12.96), gone by the cut (15.12)
      },
    },
    // 4 · The sensor with its own battery (A/V 4a). The wheel slows to a stop for the close framings.
    {
      scene: 'wheel-slice',
      cue: 'Instead, each tire',
      props: {
        ...DAY,
        ...SLIDE,
        ...WHOLE,
        spin: [{at: 0, speed: 0}], // stopped: the sensor stays at home under its callout
        pressure: FULL,
        sensor: [{at: 0, state: 'awake'}],
      },
      overlays: [
        {
          type: 'callout',
          cue: 'small sensor',
          ...AT.sensorWhole,
          // above, in clear sky over the tire (to the right, the sub-line clamps onto the tire's edge)
          place: 'above',
          dy: -190,
          title: 'Sensor',
          sub: 'own battery',
        },
      ],
    },
    // 5 · Behind the valve (A/V 4b): glide to the stem, cap outside, sensor inside.
    {
      scene: 'wheel-slice',
      cue: 'often behind the valve',
      props: {
        ...DAY,
        ...GLIDE,
        framing: 'valve',
        cameraKeys: [
          {at: 0, ...HOOK},
          {at: 0.8, ...VALVE_CLOSE, ease: 'inOut'},
        ],
        spin: [{at: 0, speed: 0}],
        pressure: FULL,
        sensor: [{at: 0, state: 'awake'}],
      },
      overlays: [{type: 'callout', cue: 'valve where', ...AT.valveCap, dx: -80, dy: 130, title: 'Valve'}],
    },
    // 6 · What's inside (A/V 5): the teardown, each part lifting as it's named; one callout at a time.
    {
      scene: 'wheel-slice',
      cue: 'Look inside',
      props: {
        ...DAY,
        ...GLIDE,
        framing: 'teardown',
        spin: [{at: 0, speed: 0}],
        pressure: FULL,
        sensor: [{at: 0, state: 'awake'}],
        teardown: [
          {at: 1.68, highlight: 'pressure'}, // TIMED: "pressure" (24.00)
          {at: 2.8, highlight: 'motion'}, // TIMED: "motion" (25.12)
          {at: 4.32, highlight: 'computer'}, // TIMED: "tiny" (26.64)
          {at: 5.84, highlight: 'radio'}, // TIMED: "radio" (28.16); the antenna turns orange
        ],
      },
      overlays: [
        {
          type: 'callout',
          cue: 'pressure sensor',
          until: 'a motion',
          ...AT.tdPressure,
          dx: -60,
          dy: 150,
          title: 'Pressure sensor',
        },
        {
          type: 'callout',
          cue: 'motion sensor',
          until: 'a tiny',
          ...AT.tdMotion,
          dx: 60,
          dy: 150,
          title: 'Motion sensor',
        },
        {
          type: 'callout',
          cue: 'tiny computer',
          until: 'and the radio',
          ...AT.tdComputer,
          dx: -60,
          dy: 150,
          title: 'Tiny computer',
        },
        {type: 'callout', cue: 'radio itself', ...AT.tdAntenna, dx: 160, dy: -60, title: 'Radio'},
      ],
    },
    // 7 · Asleep when parked; the motion sensor wakes it once the wheel turns (A/V 6).
    {
      scene: 'wheel-slice',
      cue: "When you're parked",
      props: {
        ...DAY,
        ...GLIDE,
        ...WHOLE,
        spin: [
          {at: 0, speed: 0},
          {at: 2.12, speed: 1}, // TIMED: "motion sensor" (31.76)
        ],
        pressure: FULL,
        sensor: [
          {at: 0, state: 'asleep'},
          {at: 2.96, state: 'awake'}, // TIMED: "wakes" (32.60)
        ],
        dimDot: false, // everything on the sensor dark while parked
        pulses: [4.6], // the first pulse, leading the follow to the car
      },
    },
    // 8 · Every minute or so, a radio message to the car's receiver (A/V 7). Time is compressed.
    {
      scene: 'car-slice',
      cue: 'Then, every minute',
      props: {
        ...DAY,
        ...FOLLOW_UP,
        variant: 'sensors',
        driver: 'you',
        framing: 'wide',
        driving: DRIVING,
        pulses: [
          {at: 1.88, wheel: 'FR'}, // TIMED: "sends" (36.80); arrives by "message" (38.52)
          {at: 3.9, wheel: 'FR'}, // TIMED: the second, compressed, before "pressure" ends
        ],
      },
      overlays: [
        {
          type: 'callout',
          cue: 'every minute',
          x: 0.66,
          y: 0.5,
          place: 'above',
          dy: -400,
          title: 'Once a minute',
          sub: 'or so (sped up here)',
        },
      ],
    },
    // 9 · Which wheel is talking: each pulse carries its sensor's own ID (A/V 8a + 8b, one framing).
    // The ID tags ride the pulses (no extra callout); they finish before the statement takes the frame.
    {
      scene: 'car-slice',
      cue: 'The car can tell',
      props: {
        ...DAY,
        ...GLIDE,
        variant: 'sensors',
        driver: 'you',
        framing: 'allWheels',
        driving: DRIVING,
        ids: true,
        idLabels: {RR: '4F2A', RL: 'A06D'}, // 🎭 the A/V's "4F2A" on the near rear wheel
        pulses: [
          {at: 0.3, wheel: 'RR'}, // TIMED: all gone (1.3 s each) before "sensor's own ID" (3.88)
          {at: 0.9, wheel: 'FR'},
          {at: 1.5, wheel: 'RL'},
          {at: 2.1, wheel: 'FL'},
          {at: 2.5, wheel: 'RR'},
        ],
      },
      overlays: [{type: 'statement', cue: "sensor's own ID", text: 'Its own ID.', until: 'It stays quiet'}],
    },
    // 10 · Quiet most of the time: long dark gaps, brief orange blinks (A/V 9a).
    {
      scene: 'wheel-slice',
      cue: 'It stays quiet',
      props: {
        ...DAY,
        ...SLIDE,
        ...WHOLE,
        spin: [{at: 0, speed: 1}],
        pressure: FULL,
        sensor: [{at: 0, state: 'quiet'}],
        pulses: [1.0, 2.0], // whole turns from the start, so the sensor is at home on each blink
      },
    },
    // 11 · So the battery lasts up to about ten years (A/V 9b): the teardown, the coin cell forward.
    {
      scene: 'wheel-slice',
      cue: "and that's how",
      props: {
        ...DAY,
        ...GLIDE,
        framing: 'teardown',
        spin: [{at: 0, speed: 1}],
        pressure: FULL,
        sensor: [{at: 0, state: 'quiet'}],
        teardown: [{at: 0.68, highlight: 'battery'}], // TIMED: "battery" (49.04)
      },
      overlays: [
        // counts on "battery" (49.04), lands on "ten" (50.52)
        {
          type: 'counter',
          cue: 'battery lasts',
          from: 0,
          to: 10,
          label: 'years',
          sub: 'up to about',
          subPlace: 'above',
          duration: 1.45,
          x: 0.111,
          y: 0.29,
        },
      ],
    },
    // 12 · A quarter low (A/V 10a): glide out, the tire squashes.
    {
      scene: 'wheel-slice',
      cue: "Once a tire's",
      props: {
        ...DAY,
        ...GLIDE,
        ...WHOLE,
        spin: [{at: 0, speed: 1}],
        pressure: [
          {at: 0.8, value: 1}, // after the glide
          {at: 2.1, value: 0.75}, // TIMED: squashed by "low" (53.04 → 53.84)
        ],
        sensor: [{at: 0, state: 'awake'}],
        pulses: [2.0], // two whole turns: the sensor at home; the soft tire's pulse leads the follow
      },
    },
    // 13 · The warning light within 20 minutes (A/V 10b): the cluster read in the detail box; YOU glances.
    {
      scene: 'car-slice',
      cue: 'US rules say',
      props: {
        ...DAY,
        ...FOLLOW_UP,
        variant: 'sensors',
        driver: 'you',
        framing: 'wide',
        driving: DRIVING,
        lowWheel: 'FR',
        pulses: [{at: 0.4, wheel: 'FR'}],
        warningAt: 1.08, // TIMED: "warning" (54.96); YOU glances 0.2 s later (default)
      },
      overlays: [{type: 'detail', who: 'you', content: 'dashboard', cue: "warning light's", until: 'Some cars'}],
    },
    // 14 · Some cars have no sensors (A/V 11a): the other car, MOM driving, no orange anywhere.
    {
      scene: 'car-slice',
      cue: "Some cars don't",
      props: {
        ...DAY,
        ...SLIDE,
        variant: 'indirect',
        driver: 'mom',
        framing: 'wide',
        driving: DRIVING,
        lowWheel: 'FR',
        speedRings: true,
      },
      overlays: [{type: 'tag', who: 'mom', at: 0.3}],
    },
    // 15 · They spot a soft tire by its spin (A/V 11b): glide low on the near wheels, the tick gains.
    {
      scene: 'car-slice',
      cue: 'and they spot',
      props: {
        ...DAY,
        ...GLIDE,
        variant: 'indirect',
        driver: 'mom',
        camera: {from: {look: [0.05, -0.3, 0.4], distance: 15.5}}, // both near wheels, above the captions
        driving: DRIVING,
        lowWheel: 'FR',
        speedRings: true,
      },
      overlays: [{type: 'callout', cue: 'spins slightly', x: 0.773, y: 0.443, dx: -40, dy: 170, title: 'Spins faster'}],
    },
    // 16 · The officials' check (A/V 12a): the Lab as a tire bay, extras gauging.
    {
      scene: 'section-lab',
      cue: 'When US safety',
      // the tire-bay 'wide' framing raised ≈ 150 px, so the row panels clear the captions
      props: {
        ...DAY,
        ...SLIDE,
        dressing: 'tire-bay',
        camera: {from: {look: [-0.2, 0.9, 0], distance: 12.75}, to: {look: [-0.2, 0.9, 0], distance: 12.6}},
      },
    },
    // 17 · About half as likely (A/V 12b): glide to the rows; 2 of 8 sag without, 1 of 8 with (🎭).
    // The row labels are set panels in the Lab: the frame's one card.
    {
      scene: 'section-lab',
      cue: 'the ones with',
      // the tire-bay 'bench' framing pulled back and raised, so "WITH THE WARNING" clears the captions
      props: {
        ...DAY,
        ...GLIDE,
        dressing: 'tire-bay',
        camera: {from: {look: [-0.25, 0.8, -0.7], distance: 10.6}, to: {look: [-0.25, 0.8, -0.7], distance: 10.45}},
        // 🎭 illustrative: 2 of 8 sag without the warning, 1 of 8 with. TIMED: on "with the warning"
        // (69.36) and "half" (70.44)
        tireBay: {
          rows: [
            {label: 'WITHOUT THE WARNING', low: [2, 5], lowAt: 0.6},
            {label: 'WITH THE WARNING', low: [4], lowAt: 2.9},
          ],
        },
      },
    },
    // 18 · Next time you fill a tire (A/V 13a + the start of 13b): the chuck on the valve, the tire
    // firms back up; the wheel is stopped, the sensor asleep.
    {
      scene: 'wheel-slice',
      cue: 'Next time you',
      props: {
        ...DAY,
        ...SLIDE,
        framing: 'valve',
        spin: [{at: 0, speed: 0}],
        pressure: [
          {at: 0, value: 0.75},
          {at: 1.2, value: 0.75},
          {at: 3.0, value: 1}, // TIMED: full by "little radio" (76.04 → 76.64)
        ],
        sensor: [{at: 0, state: 'asleep'}],
        dimDot: true,
        chuck: {at: 0.7, until: 4.0}, // TIMED: on before "fill" (74.08), off before the cut (78.24)
      },
    },
    // 19 · The loop: glide back to frame 0's picture and hold (A/V 13b's end). Nothing to read.
    {
      scene: 'wheel-slice',
      cue: 'waiting for the',
      props: {
        ...DAY,
        ...GLIDE,
        ...WHOLE,
        drift: 0, // loop: lands exactly on frame 0
        spin: [{at: 0, speed: 0}],
        pressure: FULL,
        sensor: [{at: 0, state: 'asleep'}],
        dimDot: true,
      },
    },
  ],
};
