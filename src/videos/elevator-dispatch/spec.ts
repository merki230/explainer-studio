import type {VideoSpec} from '../../types';

/**
 * Exhibit No. 003 · The Elevator, in The Section (style guide v0.11.1). Rough cut, from `av-script.md`,
 * adapted to the owner-approved **dollhouse front cut** (out/review/tower-test/dollhouse-frame0-full.png):
 * floors as horizontal bands with thin slabs, the four shafts A–D behind, YOU on floor 4 in front of B's
 * doors at the call panel between B and C, B at 5 straight above YOU, A empty in the lobby, C at 1 (6
 * riders), D at 2 (2 riders), the machine room with the group controller on top.
 *
 * Two locations, all Day: T, the office tower (`tower-slice`); K, the hotel (`hotel-lobby`, framings
 * `lobby` and `mid`).
 *
 * Opening and loop (§ 8): frame 0 is T at `tower` with the title block up; the last scene glides back to
 * that picture (every car at its frame-0 floor by the end of line 16, YOU's hand on the lit down button,
 * one tentative line to A whose dots ease back to rest). Drift is 0 on the first and last scenes.
 *
 * Timing: scene starts are cues copied from script.txt. Props inside a scene are seconds into it. To
 * keep cars, people, lines and readouts continuous across cuts, their keys are written once in **video
 * seconds** and rebased per scene with `r(abs, T.x)` (negative = already happened). T holds the scene
 * cue times of the live directed take (91.7 s, transcript.json): re-check T and every // TIMED value if
 * the voiceover is redone.
 *
 * Car keys are **trip orders** (`towerMotion.ts`): from `at` the car travels to `level` with a real
 * lift's acceleration (defaults 0.6 floors/s, 2 s ramp: 1 floor ≈ 3.7 s, 2 ≈ 5.3 s, 3 ≈ 7.0 s, 4 ≈ 8.7 s).
 * Departures below are set from those trip times (checked against carStateAt).
 *
 * Illustrative (🎭, disclosed in the post): the car positions and riders, the score values, the keypad's
 * "9" and "C", the hotel's door groups and stop floors.
 *
 * No music or sfx in this cut.
 */

type V3 = [number, number, number];
type Framing = {look: V3; distance: number};

/** Scene cue times, video seconds, from transcript.json (directed take). TIMED. */
const T = {
  hook: 0, // When you press
  shafts: 9.12, // Look at the shafts
  farther: 13.0, // and a farther one
  race: 15.56, // Many systems pick
  knows: 21.52, // It knows where
  weigh: 24.56, // and it can weigh
  seconds: 27.28, // For each car
  stops: 31.24, // counting the stops
  delay: 33.48, // Some systems also
  score: 37.6, // In those systems
  calls: 42.93, // With four elevators
  ways: 45.76, // there are already
  redecide: 49.52, // And most systems
  mind: 52.96, // It can even change
  maker: 55.44, // In one maker's design
  brake: 58.24, // once that car
  keypad: 61.88, // Since around 1990
  group: 68.48, // That lets the system
  fewer: 71.52, // so each car makes
  confusing: 73.76, // It can be confusing
  everyone: 79.48, // Button or keypad
  wait: 83.24, // which can mean
  next: 85.44, // Next time you press
  lowest: 88.68, // it was probably
};

/** Video seconds → seconds into the scene that starts at `start` (negative = before the scene). */
const r = (abs: number, start: number) => Math.round((abs - start) * 100) / 100;
const rs = (start: number, ts: number[]) => ts.map((t) => r(t, start));

// The scene prop `transition` is not a CSS transition; the Remotion rule can't tell them apart.
// eslint-disable-next-line @remotion/non-pure-animation
const GLIDE = {transition: 'glide'} as const;
// eslint-disable-next-line @remotion/non-pure-animation
const CONTINUE = {transition: 'continue'} as const;
// eslint-disable-next-line @remotion/non-pure-animation
const SLIDE = {transition: 'slide'} as const;

const DAY = {mood: 'day'} as const;

// ---------------------------------------------------------------- framings (fixed 3/4 angle)

/** Frame 0's framing (= TOWER_FRAMINGS.tower), the loop's picture. */
const TOWER: Framing = {look: [1.5, 12.1, 0], distance: 88.25};
/** Scene 1's push during the question: toward floors 3–5 (YOU, B, the line). */
const PUSH: Framing = {look: [0.6, 12.4, 0], distance: 76};
/**
 * The shafts beats (lines 3–8): a gentle push from frame 0 so the riders read, the whole building still
 * in frame (B at 5, YOU at 4, A in the lobby in one picture), the sky band kept for B's callout, and
 * aimed low enough that A's lobby readout sits between the caption band and the safe zone's bottom.
 * Replaces the `shafts` preset (a first guess that filled the frame edge to edge).
 */
const SHAFTS: Framing = {look: [1.5, 10.5, 0], distance: 78};
/** Lines 11–12a: the controller, floors 4–5 and A climbing below (replaces the `top` preset). */
const TOP: Framing = {look: [0.5, 13.8, 0], distance: 56};
/** Line 12b: the `landing` preset aimed 0.6 lower, so YOU's feet clear the caption band. */
const LANDING: Framing = {look: [-0.6, 12.7, 0], distance: 22};
/** Line 16: a touch wider than frame 0. */
const TOWER_WIDE: Framing = {look: [1.5, 11.6, 0], distance: 94};

// ---------------------------------------------------------------- T: cars (video seconds)

/** Trip orders per car: the first key places it (frame 0); each later key sends it to `level`. 🎭 */
const CAR_TRIPS: Record<string, {at: number; level: number}[]> = {
  A: [
    {at: 0, level: 0},
    {at: 40.7, level: 2}, // "lowest" (40.64): A starts up; arrives ≈ 46.0
    {at: 52.0, level: 3}, // still climbing below when YOU's line snaps to B (53.6); arrives ≈ 55.7
    {at: 78.0, level: 0}, // unseen start (K on screen); loop: in the lobby by ≈ 85.0
  ],
  B: [
    {at: 0, level: 5},
    {at: 57.57, level: 4}, // brakes from ≈ 59.4 ("start braking"), levels at 4 ≈ 61.2
    {at: 70.0, level: 3}, // unseen (K on screen)
    {at: 82.67, level: 5}, // with B_FAST: passes 4 on "wait" (84.00) without stopping; at 5 by ≈ 85.3
  ],
  C: [
    {at: 0, level: 1},
    {at: 23.36, level: 2}, // "which way" (23.36): C up; arrives ≈ 26.7
    {at: 49.6, level: 3}, // re-deciding (line 10); arrives ≈ 53.3
    {at: 79.5, level: 1}, // loop: at 1 by ≈ 84.8
  ],
  D: [
    {at: 0, level: 2},
    {at: 23.36, level: 3}, // "which way": D up too (at 1 its readout would sit in the caption band); ≈ 27.0
    {at: 80.5, level: 2}, // loop: at 2 by ≈ 84.2
  ],
};
/** B's doors (1.4 s per move): its promised stop at 5 (a caller boards), then open for YOU at 4. TIMED */
const DOORS: Record<string, {at: number; open: boolean}[]> = {
  B: [
    {at: 51.95, open: true},
    {at: 53.5, open: false}, // closing as YOU's line snaps to B ("change its mind", 53.44)
    {at: 61.3, open: true}, // levelled at 4
    {at: 66.0, open: false}, // unseen; shut again for line 16 and the loop
  ],
};
const RIDERS: Record<string, number> = {A: 0, B: 1, C: 6, D: 2};
/** From line 16 on: B fast enough to slide past 4 on "wait" and still be home at 5 before line 17. */
const B_FAST = {speed: 1.2, ramp: 1.0};

/** The cars, rebased to a scene start (the full history, so moves stay continuous across cuts). */
const carsAt = (start: number, extra: Partial<Record<string, Record<string, unknown>>> = {}) =>
  Object.fromEntries(
    Object.keys(CAR_TRIPS).map((L) => [
      L,
      {
        keys: CAR_TRIPS[L].map((k) => ({at: r(k.at, start), level: k.level})),
        riders: RIDERS[L],
        ...(DOORS[L] ? {doors: DOORS[L].map((d) => ({at: r(d.at, start), open: d.open}))} : {}),
        // B's rider turns to the doors on "not" (4.44): B has a stop to make (A/V 1). Not after K, so
        // the last frame matches frame 0 (rider not yet turned). TIMED
        ...(L === 'B' && start < T.keypad ? {face: r(4.44, start)} : {}),
        // riders check their watches on "delay" (36.00, line 7). TIMED
        ...(L === 'C' || L === 'D' || L === 'B' ? {watch: [r(36.0, start)]} : {}),
        ...(extra[L] ?? {}),
      },
    ]),
  );

/** B's promised stop at 5: an `ink` tick from "stop" (11.84) until its doors open there (51.95). */
const bStop = (start: number, pulse?: number) => [
  {car: 'B', level: 5, at: r(11.84, start), until: r(51.95, start), ...(pulse !== undefined ? {pulse} : {})},
];

/**
 * What the controller knows (line 5): direction chevrons from "which way" (23.36), load bars from
 * "weigh" (25.08; riders / 6, so C's is full); both gone early in line 6.
 */
const knows = (start: number) => ({
  chevrons: {at: r(23.36, start), until: r(27.6, start)},
  loadBars: {at: r(25.08, start), until: r(27.6, start)},
});

/**
 * The controller's seconds estimates (🎭), lines 6–8: count up on "For each car", B +10 for its promised
 * stop on "stops", everyone's delay added on "delay", the lowest (A) marked on "lowest", gone before the
 * glide out. Each key counts from the last over `count` s.
 */
const readouts = (start: number) => ({
  scores: [
    {at: r(27.38, start), values: {A: 16, B: 9, C: 14, D: 22}, count: 2.6}, // TIMED: "For each car"
    {at: r(31.6, start), values: {A: 16, B: 19, C: 14, D: 22}}, // TIMED: "stops" (31.60)
    {at: r(36.2, start), values: {A: 16, B: 25, C: 32, D: 24}}, // TIMED: "delay everyone" (36.00)
  ],
  winnerAt: r(40.64, start), // TIMED: "lowest" (40.64)
  scoresUntil: r(42.6, start),
});

/** The five calls of line 9: L, 1, 2, 3 light one after another from "four" (43.04); YOU's on 4 is lit. */
const fiveCalls = (start: number) => [
  {level: 0, dir: 'up', at: r(43.04, start)},
  {level: 1, dir: 'up', at: r(43.36, start)},
  {level: 2, dir: 'up', at: r(43.66, start)},
  {level: 3, dir: 'down', at: r(43.96, start)},
  {level: 4, dir: 'down'},
];
/**
 * The callers of lines 9–12: one at the panel on L, 1, 2 and 3, each pushing as its button lights; on
 * "new calls" (51.84) one on 5, who boards B while its doors are open there.
 */
const callers = (start: number) => [
  ...[43.04, 43.36, 43.66, 43.96].map((t, level) => ({seed: `w${level}`, level, start: 'panel', appear: r(42.93, start), pushes: [r(t, start)]})),
  {seed: 'w5', level: 5, start: 'panel', appear: r(51.2, start), pushes: [r(51.84, start)], path: [{at: r(52.6, start), to: 'car:B'}]},
];

/** YOU at the panel on 4, hand on the down button (frame 0). */
const YOU_HOLD = {level: 4, press: true};
/** The first line to A: its dots start travelling on "already" (2.24) and keep their phase across cuts. */
const dotsA = (start: number) => r(2.24, start);

const STEADY_A = {to: 'A', state: 'steady'} as const;
const KNOW_LINES = [STEADY_A, {to: 'B', state: 'tentative'}, {to: 'C', state: 'tentative'}, {to: 'D', state: 'tentative'}];

// ---------------------------------------------------------------- K: the hotel (video seconds)

type Leg = {at: number; to: string};
const legs = (start: number, path: Leg[]) => path.map((l) => ({at: r(l.at, start), to: l.to}));

/**
 * The lobby cast, rebased to a lobby scene start: YOU types 9 and is sent to C (line 13); four guests
 * type in turn and wait at C (two, with YOU) and A (two) (line 14); a guest with a suitcase pats the bare
 * wall by B where a button would be, raises a hand and heads back to the keypad; two more guests with
 * luggage arrive on "in hotels", one looking round (line 15). Spots: 'entrance', 'keypad', 'desk',
 * 'door:X', 'wall:X'. 🎭
 */
const lobbyCast = (start: number) => ({
  you: {
    start: 'entrance',
    path: legs(start, [
      {at: 62.2, to: 'keypad'},
      {at: 67.3, to: 'door:C'}, // after "which elevator" (67.12): to its door
    ]),
    pushes: rs(start, [64.56]), // TIMED: "enter" (64.56)
  },
  guests: [
    {seed: 'g1', start: 'desk', path: legs(start, [{at: 68.3, to: 'keypad'}, {at: 69.4, to: 'door:C'}]), pushes: rs(start, [68.95])},
    {seed: 'g2', start: 'desk', path: legs(start, [{at: 68.9, to: 'keypad'}, {at: 70.1, to: 'door:A'}]), pushes: rs(start, [69.65])},
    {seed: 'g3', start: 'entrance', path: legs(start, [{at: 68.6, to: 'keypad'}, {at: 70.8, to: 'door:C'}]), pushes: rs(start, [70.35])},
    {seed: 'g4', start: 'entrance', path: legs(start, [{at: 69.2, to: 'keypad'}, {at: 71.5, to: 'door:A'}]), pushes: rs(start, [71.05])},
    {
      seed: 's1',
      start: 'wall:B',
      appear: r(73.76, start),
      suitcase: true,
      press: [
        {at: r(74.3, start), on: true}, // TIMED: "confusing" (74.24): the pat
        {at: r(75.2, start), on: false},
      ],
      raise: rs(start, [75.4]),
      path: legs(start, [{at: 77.9, to: 'keypad'}]),
    },
    {seed: 's2', start: 'entrance', appear: r(76.8, start), suitcase: true, path: legs(start, [{at: 76.8, to: 'door:D'}])}, // TIMED: "in hotels"
    {seed: 's3', start: 'entrance', appear: r(77.0, start), suitcase: true, path: legs(start, [{at: 77.0, to: 'door:B'}]), lookAround: rs(start, [78.0])},
  ],
  // orange keypad → door lines, one per entry (YOU's to C on "tell", 66.56); they fade to traces
  entries: [
    {car: 'C', at: r(66.7, start), fade: r(70.8, start)},
    {car: 'C', at: r(69.1, start), fade: r(72.4, start)},
    {car: 'A', at: r(69.8, start), fade: r(72.4, start)},
    {car: 'C', at: r(70.5, start), fade: r(72.4, start)},
    {car: 'A', at: r(71.2, start), fade: r(72.4, start)},
  ],
});

// ---------------------------------------------------------------- overlay anchors

/** Callout offsets, px, read off stills (the anchors are the scenes' named points, followed live). */
const CALLOUT = {
  closest: {anchor: 'carRoof:B', place: 'above', dy: -170},
  // A in the lobby sits below the safe zone: the label goes up to just under the caption band
  farther: {anchor: 'car:A', place: 'above', dy: -120},
  controller: {anchor: 'controllerAt', place: 'above', dy: -110},
  // beside B's car (its roof rides above y 288 at the landing framing)
  locked: {anchor: 'car:B', place: 'side', dx: 170, dy: -120},
  noUp: {anchor: 'wall:B', place: 'above', dy: -160},
} as const;

export const spec: VideoSpec = {
  watermark: null,
  tail: 1.2, // the end hold on frame 0's picture
  scenes: [
    // 1 · Frame 0, the hook and the question (lines 1 + 2, one scene so the title block holds past the
    // question). YOU pushes the button, dots start down the line to A, B's rider turns to its doors; a
    // slow push toward floors 3–5 during the question.
    {
      scene: 'tower-slice',
      cue: 'When you press',
      props: {
        ...DAY,
        drift: 0, // loop: frame 0 must match the last frame
        cameraKeys: [
          {at: 0, ...TOWER},
          {at: 6.48, ...TOWER}, // TIMED: "So" (6.48)
          {at: 9.1, ...PUSH, ease: 'sine'},
        ],
        cars: carsAt(T.hook),
        you: {...YOU_HOLD, pushes: [0.44]}, // TIMED: "press" (0.44)
        calls: [{level: 4, dir: 'down'}],
        lines: [{to: 'A', state: 'tentative', dotsFrom: dotsA(T.hook)}],
      },
      overlays: [
        {
          type: 'title',
          at: 0,
          question: 'Why would it skip\nthe closest elevator?',
          number: 'No. 003',
          title: 'The Elevator',
          time: '8:52 AM',
          until: 'Look at the shafts', // faded by the cut (9.12); the question ends ≈ 8.6
        },
      ],
    },
    // 2 · The closest car has a stop first (line 3a): glide to the shafts; the line fades to its node dots
    // so the physical case reads; YOU's tag, then B with its stop tick.
    {
      scene: 'tower-slice',
      cue: 'Look at the shafts',
      props: {
        ...DAY,
        ...GLIDE,
        camera: {from: SHAFTS},
        cars: carsAt(T.shafts),
        you: YOU_HOLD,
        lines: [
          {
            to: 'A',
            state: 'tentative',
            dotsFrom: dotsA(T.shafts),
            glow: [
              {at: 0.2, value: 1},
              {at: 1.0, value: 0},
            ],
          },
        ],
        stops: bStop(T.shafts), // the tick appears on "stop" (11.84)
      },
      overlays: [
        {type: 'tag', who: 'you', at: 0.15, until: 'car has a stop'},
        {type: 'callout', cue: 'car has a stop', ...CALLOUT.closest, title: 'Closest car', sub: 'a stop first'},
      ],
    },
    // 3 · A farther car could come straight to you (line 3b): a dashed preview of A races up to 4.
    {
      scene: 'tower-slice',
      cue: 'and a farther one',
      props: {
        ...DAY,
        ...CONTINUE,
        camera: {from: SHAFTS},
        cars: carsAt(T.farther),
        you: YOU_HOLD,
        lines: [{to: 'A', state: 'tentative', dotsFrom: dotsA(T.farther), glow: [{at: 0, value: 0}]}],
        stops: bStop(T.farther),
        // TIMED: shown from "could" (13.92), leaves on "straight" (14.32), at 4 ≈ 15.6 ("to you")
        previews: [
          {
            car: 'A',
            keys: [
              {at: 0, level: 0},
              {at: r(14.3, T.farther), level: 4},
            ],
            from: r(13.9, T.farther),
            until: 2.5,
          },
        ],
      },
      // the sub ("straight to you") would sit in the caption band; the voice says it
      overlays: [{type: 'callout', cue: 'farther one', ...CALLOUT.farther, title: 'Farther car'}],
    },
    // 4 · Time, not distance (line 4): a race of two previews (A's reaches 4 first while B's waits out
    // its stop at 5); on "farther car" A's line comes back to full glow and goes steady.
    {
      scene: 'tower-slice',
      cue: 'Many systems pick',
      props: {
        ...DAY,
        ...CONTINUE,
        camera: {from: SHAFTS},
        cars: carsAt(T.race),
        you: YOU_HOLD,
        lines: [
          {
            to: 'A',
            state: 'tentative',
            dotsFrom: dotsA(T.race),
            states: [{at: r(19.68, T.race), state: 'steady'}], // TIMED: "farther" (19.68)
            glow: [
              {at: 0, value: 0},
              {at: r(19.68, T.race), value: 0},
              {at: r(20.4, T.race), value: 1},
            ],
          },
        ],
        stops: bStop(T.race),
        // TIMED: both from "pick" (16.24); A leaves on "time" (16.72), at 4 ≈ 18.0 (before "so", 18.60);
        // B's dashed doors cycle at 5 first, then it reaches 4 ≈ 19.2
        previews: [
          {
            car: 'B',
            keys: [
              {at: 0, level: 5},
              {at: r(18.6, T.race), level: 4},
            ],
            doors: [
              {at: r(16.4, T.race), open: true},
              {at: r(17.9, T.race), open: false},
            ],
            from: r(16.24, T.race),
            until: r(21.2, T.race),
          },
          {
            car: 'A',
            keys: [
              {at: 0, level: 0},
              {at: r(16.72, T.race), level: 4},
            ],
            from: r(16.24, T.race),
            until: r(21.2, T.race),
          },
        ],
      },
    },
    // 5 · It knows where every car is and which way it's moving (line 5a): glide out to the tower;
    // lines to all four cars on "every car"; C and D start up, with chevrons.
    {
      scene: 'tower-slice',
      cue: 'It knows where',
      props: {
        ...DAY,
        ...GLIDE,
        framing: 'tower',
        cars: carsAt(T.knows),
        you: YOU_HOLD,
        lines: [
          STEADY_A,
          ...(['B', 'C', 'D'] as const).map((to) => ({to, state: 'tentative', at: r(22.16, T.knows), draw: 0.8})), // TIMED: "every" (22.16)
        ],
        stops: bStop(T.knows),
        ...knows(T.knows),
      },
      overlays: [
        {type: 'callout', at: 0.3, until: 'and it can weigh', ...CALLOUT.controller, title: 'Group controller', sub: "the building's computer"},
      ],
    },
    // 6 · It weighs each car (line 5b): glide to the shafts; load bars fill, C's to the top.
    {
      scene: 'tower-slice',
      cue: 'and it can weigh',
      props: {...DAY, ...GLIDE, camera: {from: SHAFTS}, cars: carsAt(T.weigh), you: YOU_HOLD, lines: KNOW_LINES, stops: bStop(T.weigh), ...knows(T.weigh)},
    },
    // 7 · Seconds to reach you (line 6a): the four readouts count up (one in-set group = the one card).
    {
      scene: 'tower-slice',
      cue: 'For each car',
      props: {
        ...DAY,
        ...CONTINUE,
        camera: {from: SHAFTS},
        cars: carsAt(T.seconds),
        you: YOU_HOLD,
        lines: KNOW_LINES,
        stops: bStop(T.seconds),
        ...knows(T.seconds),
        ...readouts(T.seconds),
      },
    },
    // 8 · Counting the stops it's promised (line 6b): B's tick pulses, B's readout climbs 9 → 19.
    {
      scene: 'tower-slice',
      cue: 'counting the stops',
      props: {
        ...DAY,
        ...CONTINUE,
        camera: {from: SHAFTS},
        cars: carsAt(T.stops),
        you: YOU_HOLD,
        lines: KNOW_LINES,
        stops: bStop(T.stops, r(31.6, T.stops)), // TIMED: "stops" (31.60)
        ...readouts(T.stops),
      },
    },
    // 9 · The delay to everyone else (line 7): riders check their watches (cars' `watch`), readouts climb.
    {
      scene: 'tower-slice',
      cue: 'Some systems also',
      props: {...DAY, ...CONTINUE, camera: {from: SHAFTS}, cars: carsAt(T.delay), you: YOU_HOLD, lines: KNOW_LINES, stops: bStop(T.delay), ...readouts(T.delay)},
    },
    // 10 · Every car gets a score, the lowest gets you (line 8): A's readout marked; the other lines
    // snap onto A; A starts up its shaft.
    {
      scene: 'tower-slice',
      cue: 'In those systems',
      props: {
        ...DAY,
        ...CONTINUE,
        camera: {from: SHAFTS},
        cars: carsAt(T.score),
        you: YOU_HOLD,
        lines: [
          STEADY_A,
          ...(['B', 'C', 'D'] as const).map((to) => ({to, state: 'tentative', switchTo: {to: 'A', at: r(40.64, T.score)}})), // TIMED: "lowest"
        ],
        stops: bStop(T.score),
        ...readouts(T.score),
      },
    },
    // 11 · Four elevators, five floors calling (line 9a): glide out; a caller on L, 1, 2, 3 pushes and
    // each button lights.
    {
      scene: 'tower-slice',
      cue: 'With four elevators',
      props: {
        ...DAY,
        ...GLIDE,
        framing: 'tower',
        cars: carsAt(T.calls),
        you: YOU_HOLD,
        people: callers(T.calls),
        calls: fiveCalls(T.calls),
        lines: [STEADY_A],
        stops: bStop(T.calls),
      },
    },
    // 12 · 1,024 ways (line 9b): the plan flicker; the counter.
    {
      scene: 'tower-slice',
      cue: 'there are already',
      props: {
        ...DAY,
        ...CONTINUE,
        framing: 'tower',
        cars: carsAt(T.ways),
        you: YOU_HOLD,
        people: callers(T.ways),
        calls: fiveCalls(T.ways),
        lines: [STEADY_A],
        stops: bStop(T.ways),
        flicker: {at: 0.2, until: r(49.4, T.ways)}, // settles just before the cut
      },
      overlays: [
        {type: 'counter', cue: '1,024 ways', from: 0, to: 1024, label: 'ways', sub: '4 × 4 × 4 × 4 × 4', duration: 1.6, x: 0.111, y: 0.156},
      ],
    },
    // 13 · Re-deciding as new calls come in (line 10): a caller on 5 pushes; D's link snaps to B, B opens
    // and the caller boards.
    {
      scene: 'tower-slice',
      cue: 'And most systems',
      props: {
        ...DAY,
        ...CONTINUE,
        framing: 'tower',
        cars: carsAt(T.redecide),
        you: YOU_HOLD,
        people: callers(T.redecide),
        calls: [...fiveCalls(T.redecide), {level: 5, dir: 'down', at: r(51.84, T.redecide), until: r(52.2, T.redecide) + 1.4}], // TIMED: "calls" (51.84)
        lines: [STEADY_A, {to: 'C', state: 'tentative'}, {to: 'D', state: 'tentative', switchTo: {to: 'B', at: r(52.0, T.redecide)}}],
        stops: bStop(T.redecide),
      },
    },
    // 14 · It changes its mind (line 11): glide to the top; YOU's line snaps from A (climbing below) to B,
    // its stop done and doors closing.
    {
      scene: 'tower-slice',
      cue: 'It can even change',
      props: {
        ...DAY,
        ...GLIDE,
        camera: {from: TOP},
        cars: carsAt(T.mind),
        you: YOU_HOLD,
        people: callers(T.mind),
        calls: fiveCalls(T.mind),
        lines: [
          {to: 'A', state: 'steady', switchTo: {to: 'B', at: r(53.6, T.mind)}}, // TIMED: "change its mind" (53.44)
          {to: 'B', state: 'tentative'},
          {to: 'C', state: 'tentative'},
        ],
      },
    },
    // 15 · Only locks in a car… (line 12a): B starts down; YOU's line stays open, dots running, and hops
    // B → A → B.
    {
      scene: 'tower-slice',
      cue: "In one maker's design",
      props: {
        ...DAY,
        ...CONTINUE,
        camera: {from: TOP},
        cars: carsAt(T.maker),
        you: YOU_HOLD,
        people: callers(T.maker),
        calls: fiveCalls(T.maker),
        lines: [
          {
            to: 'B',
            state: 'tentative',
            dotsFrom: 0,
            switchTo: [
              {to: 'A', at: r(56.3, T.maker)},
              {to: 'B', at: r(57.1, T.maker)},
            ],
          },
          {to: 'C', state: 'tentative'},
        ],
      },
    },
    // 16 · …once it has to brake for your floor (line 12b): glide to the landing; B brakes (its braking
    // mark), the line locks on "braking", B levels at 4 and opens; YOU looks up.
    {
      scene: 'tower-slice',
      cue: 'once that car',
      props: {
        ...DAY,
        ...GLIDE,
        camera: {from: LANDING},
        cars: carsAt(T.brake, {B: {brakeMark: true}}),
        you: {...YOU_HOLD, gestures: [{pose: 'look-up', at: r(61.2, T.brake)}]}, // B levels ≈ 61.2
        people: callers(T.brake),
        calls: [...fiveCalls(T.brake).slice(0, 4), {level: 4, dir: 'down', until: r(61.2, T.brake)}],
        lines: [
          {to: 'B', state: 'tentative', dotsFrom: r(55.44, T.brake), states: [{at: r(59.6, T.brake), state: 'locked'}]}, // TIMED: "braking" (59.60)
          {to: 'C', state: 'tentative'},
        ],
      },
      overlays: [{type: 'callout', cue: 'start braking', ...CALLOUT.locked, title: 'Locked in', sub: 'once it brakes'}],
    },
    // 17 · The destination keypad (line 13): slide to the hotel lobby; YOU walks in to the keypad and
    // types 9 (detail box), the screen answers C, an orange line runs to door C, YOU walks to it.
    {
      scene: 'hotel-lobby',
      cue: 'Since around 1990',
      props: {...DAY, ...SLIDE, framing: 'lobby', ...lobbyCast(T.keypad)},
      overlays: [
        {type: 'tag', who: 'you', at: 0.5, until: 'enter your floor'},
        // the answer on "tell" (66.56), 2.0 s after the box enters on "enter" (64.56). TIMED
        {type: 'detail', who: 'you', content: 'keypad', floor: '9', car: 'C', answerAt: 2.0, cue: 'enter your floor', until: 'That lets the system'},
      ],
    },
    // 18 · Grouping people going to the same floors (line 14a): four guests type in turn; lines from the
    // keypad to C and A; two join YOU at C, two wait at A.
    {
      scene: 'hotel-lobby',
      cue: 'That lets the system',
      props: {...DAY, ...CONTINUE, framing: 'lobby', ...lobbyCast(T.group)},
    },
    // 19 · So each car makes fewer stops (line 14b): glide up to the hotel's upper floors; C rises with
    // its group (YOU among them) and A with its pair, one solid stop tick each (9 and 6); the dashed
    // ticks of a mixed load fade on "fewer stops".
    {
      scene: 'hotel-lobby',
      cue: 'so each car makes',
      props: {
        ...DAY,
        ...GLIDE,
        framing: 'mid',
        cars: {
          A: {keys: [{at: -1, level: 5.0}, {at: 0, level: 6}], riders: 0},
          B: {level: 8, riders: 0},
          C: {keys: [{at: -1, level: 7.4}, {at: 0, level: 9}], riders: 0},
          D: {level: 12, riders: 0},
        },
        you: {start: 'car:C'},
        guests: [
          {seed: 'g1', start: 'car:C'},
          {seed: 'g3', start: 'car:C'},
          {seed: 'g2', start: 'car:A'},
          {seed: 'g4', start: 'car:A'},
        ],
        stops: [
          {car: 'C', level: 9},
          {car: 'A', level: 6},
          ...[7, 8, 10].map((level) => ({car: 'C', level, dashed: true, until: r(72.9, T.fewer)})), // TIMED: "fewer stops" (72.56)
          ...[7, 9, 10].map((level) => ({car: 'A', level, dashed: true, until: r(72.9, T.fewer)})),
        ],
      },
    },
    // 20 · It can be confusing (line 15): glide back to the lobby; a guest with a suitcase pats the bare
    // wall by B, raises a hand; two more guests arrive on "hotels", one looking round for the keypad.
    {
      scene: 'hotel-lobby',
      cue: 'It can be confusing',
      props: {
        ...DAY,
        ...GLIDE,
        framing: 'lobby',
        you: null, // gone up in C with g1 and g3; g2 and g4 in A
        guests: lobbyCast(T.confusing).guests.filter((g) => g.seed.startsWith('s')),
        cars: {A: {level: 6}, B: {level: 8}, C: {level: 9}, D: {level: 12}},
      },
      overlays: [{type: 'callout', cue: 'confusing', until: 'and in hotels', ...CALLOUT.noUp, title: 'No up button'}],
    },
    // 21 · Picking for everyone at once (line 16a): slide back to the tower, a touch wider; lines to all
    // four cars, dots flowing; the cars head home. Statement card, low.
    {
      scene: 'tower-slice',
      cue: 'Button or keypad',
      props: {
        ...DAY,
        ...SLIDE,
        camera: {from: TOWER_WIDE},
        cars: carsAt(T.everyone, {B: B_FAST}),
        you: {level: 4, press: false},
        calls: [
          {level: 0, dir: 'up'},
          {level: 2, dir: 'up'},
          {level: 3, dir: 'down'},
        ],
        lines: (['A', 'B', 'C', 'D'] as const).map((to) => ({to, state: 'steady', at: r(80.92, T.everyone), draw: 0.8})), // TIMED: "computer's"
      },
      overlays: [{type: 'statement', cue: 'everyone at once', text: 'Everyone\nat once.', place: 'low'}],
    },
    // 22 · Which can mean you wait longer (line 16b): B slides past floor 4 on "wait"; YOU looks up after
    // it. Every car is at its frame-0 floor by ≈ 85.3 (CAR_TRIPS).
    {
      scene: 'tower-slice',
      cue: 'which can mean',
      props: {
        ...DAY,
        ...CONTINUE,
        camera: {from: TOWER_WIDE},
        cars: carsAt(T.wait, {B: B_FAST}),
        you: {level: 4, press: false, gestures: [{pose: 'look-up', at: r(83.9, T.wait)}]}, // TIMED: "wait" (84.00)
        calls: [
          {level: 0, dir: 'up'},
          {level: 2, dir: 'up'},
          {level: 3, dir: 'down'},
        ],
        lines: [STEADY_A, ...(['B', 'C', 'D'] as const).map((to) => ({to, state: 'steady', switchTo: {to: 'A', at: r(84.9, T.wait)}}))],
      },
    },
    // 23 · Next time you press that button (line 17a): glide to frame 0's framing; the other calls go
    // out; YOU raises a hand to the button and presses; dots run down the line to A on "farther car".
    {
      scene: 'tower-slice',
      cue: 'Next time you press',
      props: {
        ...DAY,
        ...GLIDE,
        framing: 'tower',
        cars: carsAt(T.next, {B: B_FAST}), // B_FAST kept so B's trip home stays continuous
        you: {level: 4, press: [{at: r(85.8, T.next), on: true}], pushes: [r(86.0, T.next)]}, // TIMED: "press" (86.00)
        calls: [
          {level: 0, dir: 'up', until: 0.6},
          {level: 2, dir: 'up', until: 1.0},
          {level: 3, dir: 'down', until: 1.4},
          {level: 4, dir: 'down', at: r(86.1, T.next)},
        ],
        lines: [{to: 'A', state: 'tentative', dotsFrom: r(87.2, T.next)}], // TIMED: "farther" (87.20)
      },
    },
    // 24 · …the one the computer scored lowest (line 17b): the end hold on frame 0's picture (the loop);
    // the dots ease back to rest by the end of "lowest".
    {
      scene: 'tower-slice',
      cue: 'it was probably',
      props: {
        ...DAY,
        ...CONTINUE,
        framing: 'tower',
        drift: 0, // loop
        cars: carsAt(T.lowest, {B: B_FAST}),
        you: YOU_HOLD,
        calls: [{level: 4, dir: 'down'}],
        lines: [{to: 'A', state: 'tentative', dotsFrom: r(87.2, T.lowest), dotsUntil: r(91.2, T.lowest)}], // TIMED: "lowest" ends ≈ 91.3
      },
    },
  ],
};
