import type {VideoSpec} from '../../types';

/**
 * Exhibit No. 003 · The Elevator, in The Section (style guide v0.11.1). From `av-script.md` (Revision 2),
 * adapted to the owner-approved **dollhouse front cut** (out/review/tower-test/dollhouse-frame0-full.png):
 * floors as horizontal bands with thin slabs, the four shafts A–D behind, YOU on floor 4 in front of B's
 * doors at the call panel between B and C, B at 5 straight above YOU, A empty in the lobby, C at 1 (6
 * riders), D at 2 (2 riders), the machine room with the group controller on top.
 *
 * Two locations, all Day: T, the office tower (`tower-slice`); K, the hotel (`hotel-lobby`, framings
 * `lobby` and `mid`).
 *
 * Shot plan: Revision 2 in `av-script.md` (owner feedback on the rough cut: the start too wide, the rest
 * the same wide animation). Sizes alternate close / medium / wide; each scene glides into its framing with
 * `cameraKeys` and most push, crane or pull back on a key word. Framings are named below.
 *
 * Opening and loop (§ 8): frame 0 is the close-up on YOU's hand at the lit down button on 4 (title block
 * up); on "computer's already picking" the camera pulls back to the whole tower. The last scene pushes back
 * in to that close-up (every car at its frame-0 floor by the end of line 16, YOU's hand on the lit button,
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
 * Sound (style guide § 9; No. 002's pattern): one music bed, switched with MUSIC_TAKE below, entering at 3 s,
 * ≈ 9 dB under the dry voice, no duck; a whoosh on the two slides (17, 21); a short low hum only while the
 * orange decision lines are live (the dot past B on "skip", the lines fanning out of the controller, the
 * winner's dot, the 1,024 flicker, the line before it locks), never under the statement card (21) or the
 * end; a soft press on YOU's button pushes (frame 0, 23) and every keypad tap; a ding as B arrives at 4
 * (16) and as the keypad names C (17); the doors' slide as B opens at 5 (13) and at 4 (16). Levels from
 * measured loudness (voice −22.2 LUFS; music A −16.9, B −17.8, C −16.75; press −23.2, ding −26.5, doors
 * −21.7): re-check if a file is replaced. SFX times are // TIMED against the props (press = the
 * fingertip's contact, `pushContacts`). Nothing sounds over the last frames, so the loop is clean.
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

// ---------------------------------------------------------------- sound (§ 9)

// Levels in dB relative to the voice (gain 1); SFX volumes are file-level offsets.
// The music take: switch with this one constant.
const MUSIC_TAKE: 'a' | 'b' | 'c' = 'a';
// level = (voice LUFS − 9) − track LUFS, voice −22.2: a bed ≈ 9 dB under the dry voice, steady (no duck).
const MUSIC_LEVEL = {a: -14.3, b: -13.4, c: -14.4} as const;
// Whoosh on a slide (18 frames), as No. 001/002: starts 0.1 s in so its peak lands mid-slide.
const WHOOSH = {type: 'sfx', name: 'whoosh', at: 0.1, volume: -18} as const;
// The hum while orange lines are live, as No. 001/002 (≈ 20 dB under the voice); brief windows only.
const HUM = {type: 'sfx', name: 'hum', loop: true, fade: 0.3, volume: -32} as const;
// A button press (0.63 s, −23.2 LUFS): −15 puts it ≈ 16 dB under the voice. Start = fingertip contact.
const PRESS = {type: 'sfx', name: 'press', volume: -15} as const;
// The arrival ding (1.5 s, −26.5 LUFS): −10 puts it ≈ 14 dB under the voice.
const DING = {type: 'sfx', name: 'ding', volume: -10} as const;
// The doors sliding (2.0 s, −21.7 LUFS): −18.5 puts it ≈ 18 dB under the voice.
const DOORS_SFX = {type: 'sfx', name: 'doors', volume: -18.5} as const;

// ---------------------------------------------------------------- framings (fixed 3/4 angle)

/** A camera key: arrive at framing `f` at `at` s into the scene (eased from the previous key). */
const key = (at: number, f: Framing, ease?: 'out' | 'inOut' | 'sine') => ({at, ...f, ...(ease ? {ease} : {})});
/** A camera key by the scene's named framing ('button', 'landing', 'controller', 'arrival:B', 'keypad', …); `log` for a steady dolly. */
const fk = (at: number, framing: string, o: {log?: boolean; ease?: 'out' | 'inOut' | 'sine'} = {}) => ({at, framing, ...o});

// close: one subject fills the frame · medium: two or three shafts, one or two floors · wide: the tower

/** The whole tower (the reveal, the five calls and the 1,024 flicker). */
const TOWER: Framing = {look: [1.5, 12.1, 0], distance: 88.25};
/** The question: a slow push from the whole tower toward floors 3–5 (YOU, B, the line skipping it). */
const PUSH: Framing = {look: [0.9, 12.3, 0], distance: 80};
/** Line 3a, medium: B at 5 straight above YOU at 4, its promised stop. */
const B_MED: Framing = {look: [-0.7, 12.4, -0.3], distance: 31};
/** Line 3b, medium-close: A parked in the lobby, then a crane up its shaft with the preview to floor 4. */
const A_LOBBY: Framing = {look: [-3.0, 0.4, -0.3], distance: 22};
const A_UP: Framing = {look: [-2.0, 11.6, -0.3], distance: 24};
/** Line 4, medium: A's shaft from the lobby and B at 5, for the race of the two previews. */
const RACE: Framing = {look: [-2.0, 7.2, -0.4], distance: 62};
/** Line 5a's end, medium-wide: the lines down to every car, C and D starting to move. */
const KNOW: Framing = {look: [0.6, 6.6, -0.5], distance: 60};
/** Line 5b, close: inside full car C (six riders) rising, tracked to its stop at 2. */
const C_CLOSE: Framing = {look: [1.4, 4.6, -1.0], distance: 17};
const C_ARRIVED: Framing = {look: [1.4, 6.5, -1.0], distance: 17};
/** Lines 6a and 8, medium: the four readouts, clamped into the safe zone (`scorePlace: 'clamp'`). */
const SCORES: Framing = {look: [0.2, 10.6, -0.4], distance: 46};
/** Line 6b, medium-close: B's promised stop at 5 and its readout, YOU below. */
const B_STOP: Framing = {look: [-0.7, 14.2, -0.4], distance: 32};
/** Line 7, medium: YOU at 4 and the riders in C and D checking their watches, their readouts. */
const DELAY: Framing = {look: [2.0, 6.85, -0.5], distance: 22};
/** Line 8's end, medium-close: A, the winner, starting up from the lobby. */
const A_WIN: Framing = {look: [-3.2, 1.7, -0.4], distance: 24};
/** Line 10, medium-close: floor 5, the new caller at the panel and B's doors. */
const F5: Framing = {look: [-0.5, 15.25, -0.2], distance: 20};
/** Line 11, medium: floors 3–5, A climbing in its shaft on the left, B at 5, YOU at 4. */
const MIND: Framing = {look: [-1.6, 12.3, -0.4], distance: 34};
/** Line 12a's push: B and YOU. */
const LOCK_PUSH: Framing = {look: [-0.6, 12.5, -0.2], distance: 27};
/**
 * Line 12b: the scene's 'arrival:B' (B's shaft from floor 4 up one, distance 15) aimed 0.55 lower, so YOU's
 * head on 4 clears the caption band while B brakes in from above.
 */
const ARRIVAL_B: Framing = {look: [-1.0, 13.95, -0.2], distance: 15};
/** Line 16a: a touch wider than frame 0. */
const TOWER_WIDE: Framing = {look: [1.5, 11.6, 0], distance: 94};

// K, the hotel
/** Line 13a, close: the keypad on its pedestal and YOU's hand typing. */
const KEYPAD: Framing = {look: [0.5, 0.87, 1.9], distance: 11};
/** Line 13b, medium: the lobby doors, the line to C, YOU walking to it. */
const LOBBY_DOORS: Framing = {look: [0.2, -0.1, 0.8], distance: 34};
/** Line 14a, wide lobby: the guests typing and walking to their doors. */
const LOBBY_WIDE: Framing = {look: [-0.2, 1.4, 1.6], distance: 56};
/** Line 14b: the hotel's upper floors (the `mid` preset). */
const MID: Framing = {look: [0.6, 22.6, -0.5], distance: 64};
/** Line 15a, close: the guest at the bare wall by B. */
const WALL_B: Framing = {look: [-0.2, 0.5, 0.5], distance: 13};
/** Line 15b, medium: the lobby, two more guests arriving. */
const LOBBY_MED: Framing = {look: [1.6, 0.2, 1.4], distance: 44};

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
    {at: 83.3, level: 5}, // with B_FAST: passes 4 just after "wait longer" (≈ 84.6, once 16b's glide has landed); at 5 by ≈ 86.0
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
  chevrons: {at: r(23.36, start), until: r(26.7, start)}, // gone as C arrives at 2
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
 * The lobby cast, rebased to a lobby scene start: YOU, already at the keypad, types 9 and is sent to C (line 13); four guests
 * type in turn and wait at C (two, with YOU) and A (two) (line 14); a guest with a suitcase pats the bare
 * wall by B where a button would be, raises a hand and heads back to the keypad; two more guests with
 * luggage arrive on "in hotels", one looking round (line 15). Spots: 'entrance', 'keypad', 'desk',
 * 'door:X', 'wall:X'. 🎭
 */
const lobbyCast = (start: number) => ({
  // YOU stands at the keypad from the slide in (the walk in from the street took ≈ 5 s and arrived after
  // the typing), raises a hand and taps 9 as the detail box opens, then walks to C
  you: {
    start: 'keypad',
    path: legs(start, [
      {at: 67.3, to: 'door:C'}, // after "which elevator" (67.12): to its door
    ]),
    pushes: rs(start, [64.1]), // TIMED: the hand rises 0.5 s, the finger taps on "enter" (64.56)
    keys: [9],
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
    // they set off from the vestibule ≈ 1 s before "in hotels" (77.00) so they are in the lobby by it
    {seed: 's2', start: 'entrance', appear: r(75.9, start), suitcase: true, path: legs(start, [{at: 75.9, to: 'door:D'}])}, // TIMED
    {seed: 's3', start: 'entrance', appear: r(76.2, start), suitcase: true, path: legs(start, [{at: 76.2, to: 'door:B'}]), lookAround: rs(start, [78.2])},
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
  // beside B's car: above its roof would leave the safe zone at the medium framing
  closest: {anchor: 'car:B', place: 'side', dx: 200, dy: -60},
  // A in the lobby sits below the safe zone: the label goes up to just under the caption band
  farther: {anchor: 'car:A', place: 'above', dy: -260},
  // at the 'controller' close-up the anchor sits near the top: the label goes left, over the open door
  controller: {anchor: 'controllerAt', place: 'side', dx: -170, dy: 120},
  // on YOU's call button, straight up the pier: B's roof rides above the frame while it brakes
  locked: {anchor: 'callButton:4', place: 'above', dy: -330},
  noUp: {anchor: 'wall:B', place: 'above', dy: -260},
} as const;

/** A's line as a trace (node dots only) while the readouts do the talking (lines 6–8). */
const traceA = (start: number, extra: Record<string, unknown> = {}) => ({to: 'A', state: 'steady', glow: [{at: r(27.4, start), value: 0}], ...extra});

export const spec: VideoSpec = {
  watermark: null,
  // enters at 3 s (default startAt, after the hook's first line), fades in over 2 s, out to silence at the end
  music: {src: `audio/music-${MUSIC_TAKE}.mp3`, level: MUSIC_LEVEL[MUSIC_TAKE], duckDb: 0, startAt: 0, fadeIn: 1.5}, // owner, 2026-10-18: music from the first second (was the 3 s default)
  tail: 1.2, // the end hold on frame 0's close-up
  scenes: [
    // 1 · Frame 0 is the close-up (lines 1 + 2): YOU's hand pushes the lit down button on 4, B's and C's
    // doors round it. On "computer's already picking" the camera pulls back to the whole cut-open tower
    // (dots start down the line to A, past B); B's rider turns to its doors on "not"; during the question
    // a slow push, and a bright dot runs past B down to A on "skip".
    {
      scene: 'tower-slice',
      cue: 'When you press',
      props: {
        ...DAY,
        drift: 0, // loop: frame 0 must match the last frame
        framing: 'button',
        cameraKeys: [
          fk(0, 'button'),
          fk(1.5, 'button'), // TIMED: "computer's" (1.60)
          fk(2.9, 'landing', {log: true}), // "already picking" (2.24–3.04): out through the lobby…
          fk(4.6, 'tower', {log: true}), // …to the whole tower
          key(6.48, TOWER), // TIMED: "So" (6.48)
          key(9.1, PUSH, 'sine'),
        ],
        cars: carsAt(T.hook),
        you: {...YOU_HOLD, pushes: [0.44]}, // TIMED: "press" (0.44)
        calls: [{level: 4, dir: 'down'}],
        lines: [{to: 'A', state: 'tentative', dotsFrom: dotsA(T.hook), pulses: [7.44]}], // TIMED: "skip" (7.44)
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
        {...PRESS, at: 0.52}, // TIMED: the fingertip lands (push at 0.44)
        {...HUM, at: 7.3, until: 8.6}, // TIMED: the dot past B on "skip" (7.44, 1 s)
      ],
    },
    // 2 · The closest car has a stop first (line 3a), medium: glide down to B at 5 straight above YOU;
    // the line fades to its node dots so the physical case reads; YOU's tag, then B with its stop tick.
    {
      scene: 'tower-slice',
      cue: 'Look at the shafts',
      props: {
        ...DAY,
        ...GLIDE,
        cameraKeys: [key(0.8, B_MED), key(3.88, {...B_MED, distance: 29}, 'sine')],
        cars: carsAt(T.shafts),
        you: YOU_HOLD,
        lines: [{to: 'A', state: 'tentative', dotsFrom: dotsA(T.shafts), glow: [{at: 0.2, value: 0}]}],
        stops: bStop(T.shafts), // the tick appears on "stop" (11.84)
      },
      overlays: [
        {type: 'tag', who: 'you', at: 0.9, until: 'car has a stop'},
        {type: 'callout', cue: 'car has a stop', ...CALLOUT.closest, title: 'Closest car', sub: 'a stop first'},
      ],
    },
    // 3 · A farther car could come straight to you (line 3b), medium-close: glide down to A parked in
    // the lobby; on "straight" its dashed preview races up the shaft and the camera cranes up with it to
    // YOU's floor.
    {
      scene: 'tower-slice',
      cue: 'and a farther one',
      props: {
        ...DAY,
        ...GLIDE,
        cameraKeys: [key(0.8, A_LOBBY), key(r(14.3, T.farther), A_LOBBY), key(r(15.5, T.farther), A_UP, 'inOut')],
        cars: carsAt(T.farther),
        you: YOU_HOLD,
        lines: [{to: 'A', state: 'tentative', dotsFrom: dotsA(T.farther), glow: [{at: -1, value: 0}]}],
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
          },
        ],
      },
      overlays: [{type: 'callout', cue: 'farther one', until: 'straight', ...CALLOUT.farther, title: 'Farther car'}],
    },
    // 4 · Time, not distance (line 4), medium: pull back to A's shaft and B at 5; a race of two previews
    // (A's reaches 4 first while B's waits out its stop at 5); on "farther car" A's line comes back.
    {
      scene: 'tower-slice',
      cue: 'Many systems pick',
      props: {
        ...DAY,
        ...GLIDE,
        cameraKeys: [key(0.8, RACE), key(5.96, {...RACE, distance: 59}, 'sine')],
        cars: carsAt(T.race),
        you: YOU_HOLD,
        lines: [
          {
            to: 'A',
            state: 'tentative',
            dotsFrom: dotsA(T.race),
            states: [{at: r(19.68, T.race), state: 'steady'}], // TIMED: "farther" (19.68)
            glow: [
              {at: -1, value: 0},
              {at: r(19.68, T.race), value: 1},
            ],
            pulses: [r(19.9, T.race)],
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
    // 5 · It knows where every car is and which way it's moving (line 5a), close: glide up to the
    // controller cabinet; lines fan out to all four shafts on "every car"; on "which way" the camera
    // follows them down to the cars (medium-wide) as C and D start up, with chevrons.
    {
      scene: 'tower-slice',
      cue: 'It knows where',
      props: {
        ...DAY,
        ...GLIDE,
        cameraKeys: [fk(0.8, 'controller'), fk(r(23.1, T.knows), 'controller'), {...key(r(24.5, T.knows), KNOW), log: true}],
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
        {type: 'callout', at: 0.8, until: 'which way', ...CALLOUT.controller, title: 'Group controller', sub: "the building's computer"},
        {...HUM, at: r(22.1, T.knows), until: r(24.3, T.knows)}, // TIMED: the lines fanning out ("every", 22.16)
      ],
    },
    // 6 · It weighs each car (line 5b), close: inside full car C, rising, its six riders; its load bar
    // fills to the top on "full".
    {
      scene: 'tower-slice',
      cue: 'and it can weigh',
      // close on C, tracking it up (at 'ride:C', distance 6.8, the load reading sits outside the safe zone);
      // its load reading counts up beside the bar and the car's FULL sign lights on "full"
      props: {
        ...DAY,
        ...GLIDE,
        cameraKeys: [key(0.8, C_CLOSE), key(2.2, C_ARRIVED, 'sine')],
        cars: carsAt(T.weigh, {C: {full: r(26.32, T.weigh)}}), // TIMED: "full" (26.32)
        you: YOU_HOLD,
        lines: KNOW_LINES,
        stops: bStop(T.weigh),
        ...knows(T.weigh),
        loadBars: {at: r(25.08, T.weigh), until: r(27.6, T.weigh), readout: ['C']},
      },
    },
    // 7 · Seconds to reach you (line 6a), medium-wide: the four readouts count up (one in-set group =
    // the one card); the decision lines fade (A's to its node dots) so only the numbers talk.
    {
      scene: 'tower-slice',
      cue: 'For each car',
      props: {
        ...DAY,
        ...GLIDE,
        cameraKeys: [key(0.8, SCORES)], // held: the counting readouts are the motion
        cars: carsAt(T.seconds),
        you: YOU_HOLD,
        lines: [traceA(T.seconds), ...(['B', 'C', 'D'] as const).map((to) => ({to, state: 'tentative', until: 0.5}))],
        stops: bStop(T.seconds),
        ...knows(T.seconds),
        ...readouts(T.seconds),
        scorePlace: 'clamp',
      },
    },
    // 8 · Counting the stops it's promised (line 6b), medium-close: B at 5 with its stop tick (it pulses)
    // and its readout climbing 9 → 19; YOU below.
    {
      scene: 'tower-slice',
      cue: 'counting the stops',
      props: {
        ...DAY,
        ...GLIDE,
        cameraKeys: [key(0.7, B_STOP), key(2.24, {...B_STOP, distance: 30}, 'sine')],
        cars: carsAt(T.stops),
        you: YOU_HOLD,
        lines: [traceA(T.stops)],
        stops: bStop(T.stops, r(31.6, T.stops)), // TIMED: "stops" (31.60)
        ...readouts(T.stops),
      },
    },
    // 9 · The delay to everyone else (line 7), medium: YOU at 4 and the riders in C and D; they check
    // their watches on "delay" and C's and D's readouts climb.
    {
      scene: 'tower-slice',
      cue: 'Some systems also',
      props: {
        ...DAY,
        ...GLIDE,
        cameraKeys: [key(0.8, DELAY), key(4.12, {...DELAY, distance: 21}, 'sine')],
        cars: carsAt(T.delay),
        you: YOU_HOLD,
        lines: [traceA(T.delay)],
        stops: bStop(T.delay),
        ...readouts(T.delay),
      },
    },
    // 10 · Every car gets a score, the lowest gets you (line 8): back to the four readouts; on "lowest"
    // A's readout is marked, its line comes back with a bright dot, and the camera pushes in on A as it
    // starts up.
    {
      scene: 'tower-slice',
      cue: 'In those systems',
      props: {
        ...DAY,
        ...GLIDE,
        cameraKeys: [key(0.8, SCORES), key(r(40.7, T.score), SCORES), key(r(42.3, T.score), A_WIN, 'inOut')],
        cars: carsAt(T.score),
        you: YOU_HOLD,
        lines: [traceA(T.score, {glow: [{at: -1, value: 0}, {at: r(40.64, T.score), value: 1}], pulses: [r(40.7, T.score)]})], // TIMED: "lowest"
        stops: bStop(T.score),
        ...readouts(T.score),
        scorePlace: 'clamp',
        scoresUntil: r(42.93, T.score), // A's marked readout holds through the push in
      },
      overlays: [{...HUM, at: r(40.6, T.score), until: r(41.9, T.score)}], // TIMED: the winner's dot ("lowest", 40.70)
    },
    // 11 · Four elevators, five floors calling (line 9a), wide: pull out to the whole tower; a caller on
    // L, 1, 2, 3 pushes and each button lights.
    {
      scene: 'tower-slice',
      cue: 'With four elevators',
      props: {
        ...DAY,
        ...GLIDE,
        cameraKeys: [key(0.9, TOWER)],
        cars: carsAt(T.calls),
        you: YOU_HOLD,
        people: callers(T.calls),
        calls: fiveCalls(T.calls),
        lines: [STEADY_A],
        stops: bStop(T.calls),
      },
    },
    // 12 · 1,024 ways (line 9b), wide: the plan flicker; the counter; a slow push.
    {
      scene: 'tower-slice',
      cue: 'there are already',
      props: {
        ...DAY,
        ...CONTINUE,
        cameraKeys: [key(0, TOWER), key(3.76, {...TOWER, distance: 84}, 'sine')],
        cars: carsAt(T.ways),
        you: YOU_HOLD,
        people: callers(T.ways),
        calls: fiveCalls(T.ways),
        lines: [STEADY_A],
        stops: bStop(T.ways),
        flicker: {at: 0.2, until: r(49.4, T.ways)}, // settles just before the cut
      },
      overlays: [
        {...HUM, at: 0.2, until: r(49.4, T.ways)}, // TIMED: the plan flicker
        {type: 'counter', cue: '1,024 ways', from: 0, to: 1024, label: 'ways', sub: '4 × 4 × 4 × 4 × 4', duration: 1.6, x: 0.111, y: 0.156},
      ],
    },
    // 13 · Re-deciding as new calls come in (line 10), medium-close on floor 5: a caller pushes; D's
    // link snaps to B, B opens and the caller boards.
    {
      scene: 'tower-slice',
      cue: 'And most systems',
      props: {
        ...DAY,
        ...GLIDE,
        cameraKeys: [key(0.8, F5), key(3.44, {...F5, distance: 19}, 'sine')],
        cars: carsAt(T.redecide),
        you: YOU_HOLD,
        people: callers(T.redecide),
        calls: [...fiveCalls(T.redecide), {level: 5, dir: 'down', at: r(51.84, T.redecide), until: r(52.2, T.redecide) + 1.4}], // TIMED: "calls" (51.84)
        lines: [STEADY_A, {to: 'C', state: 'tentative'}, {to: 'D', state: 'tentative', switchTo: {to: 'B', at: r(52.0, T.redecide)}}],
        stops: bStop(T.redecide),
      },
      overlays: [{...DOORS_SFX, at: r(51.95, T.redecide)}], // TIMED: B opens at 5 for the new caller
    },
    // 14 · It changes its mind (line 11), medium: floors 3–5, A climbing on the left; YOU's line snaps
    // from A to B, its stop done and doors closing.
    {
      scene: 'tower-slice',
      cue: 'It can even change',
      props: {
        ...DAY,
        ...GLIDE,
        cameraKeys: [key(0.8, MIND)],
        cars: carsAt(T.mind),
        you: YOU_HOLD,
        people: callers(T.mind),
        calls: fiveCalls(T.mind),
        lines: [
          {to: 'A', state: 'steady', switchTo: {to: 'B', at: r(53.6, T.mind)}}, // TIMED: "change its mind" (53.44)
          {to: 'C', state: 'tentative'},
        ],
      },
    },
    // 15 · Only locks in a car… (line 12a): a push in on B and YOU; B starts down; YOU's line stays
    // open, dots running, and hops B → A → B.
    {
      scene: 'tower-slice',
      cue: "In one maker's design",
      props: {
        ...DAY,
        ...CONTINUE,
        cameraKeys: [key(0, MIND), key(2.8, LOCK_PUSH, 'sine')],
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
    // 16 · …once it has to brake for your floor (line 12b), close: B brakes down to 4 (its braking mark),
    // the line locks on "braking", B levels and opens in front of YOU, who looks up.
    {
      scene: 'tower-slice',
      cue: 'once that car',
      props: {
        ...DAY,
        ...GLIDE,
        cameraKeys: [key(0.8, ARRIVAL_B)],
        cars: carsAt(T.brake, {B: {brakeMark: true}}),
        you: {...YOU_HOLD, gestures: [{pose: 'look-up', at: r(61.2, T.brake)}]}, // B levels ≈ 61.2
        people: callers(T.brake),
        calls: [...fiveCalls(T.brake).slice(0, 4), {level: 4, dir: 'down', until: r(61.2, T.brake)}],
        lines: [
          {to: 'B', state: 'tentative', dotsFrom: r(55.44, T.brake), states: [{at: r(59.6, T.brake), state: 'locked'}]}, // TIMED: "braking" (59.60)
          {to: 'C', state: 'tentative'},
        ],
      },
      overlays: [
        {...HUM, at: 0.2, until: r(59.7, T.brake)}, // TIMED: the open line, silent as it locks ("braking", 59.60)
        {type: 'callout', cue: 'start braking', ...CALLOUT.locked, title: 'Locked in', sub: 'once it brakes'},
        {...DING, at: r(61.1, T.brake)}, // TIMED: B levels at 4 (≈ 61.1–61.2)
        {...DOORS_SFX, at: r(61.3, T.brake)}, // TIMED: its doors open
      ],
    },
    // 17 · The destination keypad (line 13): slide to the hotel, close on the keypad with YOU standing
    // at it; YOU types 9 on "enter" (detail box); on "tell you" the screen answers C, an orange line runs
    // to door C and the camera pulls back to the doors as YOU walks to it.
    {
      scene: 'hotel-lobby',
      cue: 'Since around 1990',
      props: {
        ...DAY,
        ...SLIDE,
        cameraKeys: [key(0, KEYPAD), key(r(63.6, T.keypad), KEYPAD), fk(r(64.5, T.keypad), 'keypad', {log: true}), fk(r(66.5, T.keypad), 'keypad'), {...key(r(68.0, T.keypad), LOBBY_DOORS), log: true}],
        ...lobbyCast(T.keypad),
      },
      overlays: [
        WHOOSH,
        {type: 'tag', who: 'you', at: 0.5, until: 'enter your floor'},
        {...PRESS, at: r(64.675, T.keypad)}, // TIMED: YOU taps 9
        {...DING, at: r(66.6, T.keypad), volume: -12}, // TIMED: the screen names C ("tell", 66.56)
        // the answer on "tell" (66.56), 2.0 s after the box enters on "enter" (64.56). TIMED
        {type: 'detail', who: 'you', content: 'keypad', side: 'left', top: 330, floor: '9', car: 'C', answerAt: 2.0, cue: 'enter your floor', until: 'That lets the system'},
      ],
    },
    // 18 · Grouping people going to the same floors (line 14a), wide lobby: four guests type in turn;
    // lines from the keypad to C and A; two join YOU at C, two wait at A.
    {
      scene: 'hotel-lobby',
      cue: 'That lets the system',
      props: {...DAY, ...GLIDE, cameraKeys: [key(0.8, LOBBY_WIDE), key(3.04, {...LOBBY_WIDE, distance: 53}, 'sine')], ...lobbyCast(T.group)},
      overlays: [69.525, 70.225, 70.925, 71.625].map((t) => ({...PRESS, at: r(t, T.group), volume: -18})), // TIMED: the four guests' taps
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
        cameraKeys: [key(0.8, MID)],
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
    // 20 · It can be confusing (line 15), close: a guest with a suitcase at the bare wall by B pats it
    // where a button would be and raises a hand; on "in hotels" the camera pulls back to the lobby as
    // two more guests arrive, one looking round for the keypad.
    {
      scene: 'hotel-lobby',
      cue: 'It can be confusing',
      props: {
        ...DAY,
        ...GLIDE,
        cameraKeys: [key(0.8, WALL_B), key(r(76.6, T.confusing), {...WALL_B, distance: 12}, 'sine'), key(r(78.0, T.confusing), LOBBY_MED, 'inOut')],
        you: null, // gone up in C with g1 and g3; g2 and g4 in A
        guests: lobbyCast(T.confusing).guests.filter((g) => g.seed.startsWith('s')),
        cars: {A: {level: 6}, B: {level: 8}, C: {level: 9}, D: {level: 12}},
      },
      overlays: [{type: 'callout', cue: 'confusing', until: 'and in hotels', ...CALLOUT.noUp, title: 'No up button'}],
    },
    // 21 · Picking for everyone at once (line 16a), wide: slide back to the tower, a touch wider; lines
    // to all four cars, dots flowing; the cars head home. Statement card, low.
    {
      scene: 'tower-slice',
      cue: 'Button or keypad',
      props: {
        ...DAY,
        ...SLIDE,
        cameraKeys: [key(0, TOWER_WIDE), key(3.76, {...TOWER_WIDE, distance: 91}, 'sine')],
        cars: carsAt(T.everyone, {B: B_FAST}),
        you: {level: 4, press: false},
        calls: [
          {level: 0, dir: 'up'},
          {level: 2, dir: 'up'},
          {level: 3, dir: 'down'},
        ],
        lines: (['A', 'B', 'C', 'D'] as const).map((to) => ({to, state: 'steady', at: r(80.92, T.everyone), draw: 0.8})), // TIMED: "computer's"
      },
      overlays: [WHOOSH, {type: 'statement', cue: 'everyone at once', text: 'Everyone\nat once.', place: 'low'}],
    },
    // 22 · Which can mean you wait longer (line 16b), medium-close: glide in to YOU at 4; B slides past
    // without stopping; YOU looks up after it.
    {
      scene: 'tower-slice',
      cue: 'which can mean',
      props: {
        ...DAY,
        ...GLIDE,
        cameraKeys: [fk(0.8, 'landing')],
        cars: carsAt(T.wait, {B: B_FAST}),
        you: {level: 4, press: false, gestures: [{pose: 'look-up', at: r(84.4, T.wait)}]}, // TIMED: B passes 4 ≈ 84.6
        calls: [
          {level: 0, dir: 'up'},
          {level: 2, dir: 'up'},
          {level: 3, dir: 'down'},
        ],
        lines: [STEADY_A, ...(['B', 'C', 'D'] as const).map((to) => ({to, state: 'steady', switchTo: {to: 'A', at: r(84.9, T.wait)}}))],
      },
    },
    // 23 · Next time you press that button… (line 17a): YOU's hand rises to the button and presses (the
    // ring lights); on "farther car shows up" the camera pulls back to the whole tower as the line to A
    // draws.
    {
      scene: 'tower-slice',
      cue: 'Next time you press',
      props: {
        ...DAY,
        ...CONTINUE,
        cameraKeys: [fk(0, 'landing'), fk(r(86.9, T.next), 'landing'), fk(r(88.6, T.next), 'tower', {log: true})],
        cars: carsAt(T.next, {B: B_FAST}), // B_FAST kept so B's trip home stays continuous
        you: {level: 4, press: [{at: r(85.8, T.next), on: true}], pushes: [r(86.0, T.next)]}, // TIMED: "press" (86.00)
        calls: [
          {level: 0, dir: 'up', until: 0.6},
          {level: 2, dir: 'up', until: 1.0},
          {level: 3, dir: 'down', until: 1.4},
        ], // YOU's push lights the down button itself
        lines: [{to: 'A', state: 'tentative', at: r(87.2, T.next), dotsFrom: r(87.2, T.next)}], // TIMED: "farther" (87.20)
      },
      overlays: [{...PRESS, at: r(86.104, T.next)}], // TIMED: the fingertip lands (push at 86.00)
    },
    // 24 · …the one the computer scored lowest (line 17b): a bright dot runs down to A, then the camera
    // pushes back in to frame 0's close-up (the loop) and holds; the dots ease back to rest.
    {
      scene: 'tower-slice',
      cue: 'it was probably',
      props: {
        ...DAY,
        ...CONTINUE,
        drift: 0, // loop
        framing: 'button',
        cameraKeys: [key(0, TOWER), key(0.4, TOWER), fk(2.7, 'button', {log: true})], // in frame 0's close-up by ≈ 91.4
        cars: carsAt(T.lowest, {B: B_FAST}),
        you: YOU_HOLD,
        calls: [{level: 4, dir: 'down'}],
        lines: [{to: 'A', state: 'tentative', dotsFrom: r(87.2, T.lowest), dotsUntil: r(91.2, T.lowest), pulses: [r(89.0, T.lowest)]}], // TIMED: "lowest" ends ≈ 91.3
      },
    },
  ],
};
