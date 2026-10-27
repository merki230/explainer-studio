import type {MusicSpec, OverlaySpec, VideoSpec} from '../../types';

/**
 * No. 009 · The Interstate (mile markers), in The Section (style guide v0.12). From `av-script.md` (owner decisions
 * D1 = a, D2 = a, D3 = a, 2026-10-27), timed to the recorded take (transcript.json, last word ends 57.68 s).
 *
 * Four slices, joined by slides (no whoosh); inside a slice every framing change is a `continue` glide:
 *  - A `highway-slice` (Day; Night at the end): YOU's car past MILE 150, the EXIT 150 sign 8 m beyond
 *    (`HIGHWAY_EXIT`, the builder's frame-0 layout, accepted by the owner). Frame 0 and the last scene.
 *  - S `highway-slice` (Day): the cut plane is the state line; the count's zero on the face, markers 1–4 at a
 *    compressed spacing, then the drive north in fast-forward to the MILE 92 / EXIT 92 pair and the 58 miles to go.
 *  - B `highway-slice` (Night): the dark stretch, no traffic, no guardrail, MILE 136 / 137 / 138 only. The engine
 *    dies, the car stops on the shoulder by MILE 137 (`HIGHWAY_STOP`), hazards; later the service-patrol pickup.
 *  - K `car-slice` (Night): YOU's gas sedan cut open, stopped on the dark shoulder, the phone at the ear.
 *
 * Camera, one way: A holds, then pulls back once; S slides in wide (W `line`), dives once to the stream and
 * only pushes after; B dives once as the car stops; K holds close, then pulls out once; B resumes exactly where it
 * left (`stop`), pushes in to the sign (the end of B's dive) and pulls out once to `help`; A slides in at the pull-back
 * A ended on and glides in to frame 0's framing. Every `continue` scene starts on the previous end key (Explainer).
 *
 * Mood (D1 = a): Day for lines 1–4, Night from line 5; the one time-passes beat (Night → Day, 1.5 s) runs in
 * the last scene's hold, after the last word, so the last frame is frame 0's picture.
 *
 * Orange only for the hidden system: the mile ruler and its ticks / zero, the marker ↔ exit link, the 58-mile
 * stretch, the phone's rings, the dispatch map's rough circle and pin, the sign → car → dispatch link, the node on
 * MILE 137. Signs green, lamps flat red, the patrol light bar `warning` yellow, every card ink.
 *
 * Against the A/V script's 16 scenes: 9a + 9b ("That sign is") and 10a + 10b ("You read that") are merged (2.5 and
 * 1.8 s scenes on the real take), so 14 scenes. B's markers stand 22 m apart (not 15) so the patrol pickup stops by
 * MILE 137, not beside MILE 136. The road crawls (2 m/s) from the end of the fast-forward to "Exit 92", so the 92 pair
 * holds frame 0's place while the link draws, then cruises on.
 *
 * Owner, preview 1 ("the car is moving and the panel sign Exit 150 is fixed"): no roadside sign stands still while the
 * road streams. Every marker row is on the road (`move: 'road'`, exits attached) except after B's car has stopped (11–13).
 * A rolls at 1 m/s (no traffic) so MILE 150 / EXIT 150 stay readable; scene 14 eases off from cruise so the pair
 * arrives with the road and lands on frame 0's place at the last frame. S is one row from MILE 1 to 93 (crawl, 60 m/s
 * fast-forward, crawl, cruise). B's markers stream in and stop with the car.
 *
 * Timing: scene starts are cues copied from script.txt. Props are seconds into the scene, rebased from T (video
 * seconds of the recorded take) with `r()`. Re-check T and every // TIMED value if the voice is redone.
 *
 * Illustrative (🎭, disclosed in the post): marker spacing compressed and the drive fast-forwarded, the exit
 * sign's legend, the dispatch map, the service truck, the story time (7:50 PM).
 *
 * Sound: physical only (no whoosh, no riser). Levels from measured loudness: voice −22.4 LUFS (loudnorm,
 * 2026-10-27); volume = (voice − dB under) − file LUFS. Music: take a (see `music` below).
 */

type V3 = [number, number, number];
type Framing = {look: V3; distance: number};

/** Cue and word times, video seconds, from transcript.json (recorded take). TIMED. */
const T = {
  hook: 0, // On most interstates
  exit150: 1.52,
  miles150: 3.28, // "150 miles"
  stateLine: 4.8,
  count: 6.0, // The count starts
  countWord: 6.24,
  south: 7.52,
  goesUp: 9.12,
  there: 9.84,
  driving: 10.64, // If you're driving
  littleSign: 12.4,
  everyMile: 13.44,
  exitNums: 14.48, // and the exit numbers
  sameCount: 15.92,
  whenYou: 17.12, // When you get to
  exit92: 17.84,
  wayTo: 19.2, // "on your way to 150"
  roughly: 20.8, // you've got roughly
  fiftyEight: 21.76,
  forty: 24.59, // Forty minutes past
  engine: 26.96, // your engine dies
  dies: 27.6,
  dark: 28.24,
  call: 31.09, // You call 911
  callWord: 31.24,
  nineOneOne: 31.44,
  phone: 32.8, // "Your phone usually"
  rough: 34.08,
  cant: 35.28, // but you can't
  cantWord: 35.6,
  whereYou: 36.08,
  spot: 37.89, // Then you spot
  spotWord: 38.32,
  beside: 39.6,
  n137: 41.36,
  sign: 43.28, // That sign is
  crews: 46.0, // "so crews can find"
  read: 48.72, // You read that
  number: 49.32,
  dispatcher: 49.68,
  help: 50.72, // "and help pulls up"
  besideIt: 51.76,
  night: 53.4, // On a night drive
  lastMarker: 55.76,
  end: 57.68,
};

/** The hold after the last word (s): the time-passes beat (1.5 s) and a short rest on frame 0's picture. */
const TAIL = 2.0;

/** Video seconds → seconds into the scene that starts at `start`. */
const r = (abs: number, start: number) => Math.round((abs - start) * 100) / 100;

// The scene prop `transition` is not a CSS transition; the Remotion rule can't tell them apart.
// eslint-disable-next-line @remotion/non-pure-animation
const CONTINUE = {transition: 'continue'} as const;
// eslint-disable-next-line @remotion/non-pure-animation
const SLIDE = {transition: 'slide'} as const;

/** A camera key: arrive at framing `f` at `at` s into the scene. */
const key = (at: number, f: Framing, o: {ease?: 'out' | 'inOut' | 'sine'; log?: boolean} = {}) => ({at, ...f, ...o});

/** Sign legends in Overpass, the highway face (owner, 2026-10-18). */
const F = 'overpass' as const;
/** Road speed (m/s): ≈ 67 mph, so Exit 92 → MILE 137 in 40 min agrees with sources.md S5. */
const CRUISE = 30;

type SpeedKey = {at: number; speed: number};
/** HighwaySliceScene's speed curve: each key eases in over 0.8 s (sine) from wherever the speed was (keyframes `speedAt`). */
const speedAt = (keys: SpeedKey[], t: number) => {
  let v = keys[0].at <= 0 ? keys[0].speed : 0;
  for (const k of keys) {
    if (t < k.at) break;
    const u = Math.min(1, (t - k.at) / 0.8);
    v = v + (k.speed - v) * (0.5 - 0.5 * Math.cos(Math.PI * u));
  }
  return v;
};
/** Road travelled from 0 to t (m), the scene's fixed-step sum (keyframes `integrateSpeed`), so signs placed with it land exactly. */
const travel = (keys: SpeedKey[], t: number) => {
  let a = 0;
  for (let x = 0; x < t; x += 1 / 120) a += speedAt(keys, x + 1 / 240) * Math.min(1 / 120, t - x);
  return a;
};
/** When the road has travelled `d` m (s, to 1 ms). */
const timeAt = (keys: SpeedKey[], d: number) => {
  let t = 0;
  while (travel(keys, t) < d && t < 30) t += 0.001;
  return Math.round(t * 1000) / 1000;
};
/** A scene's length in seconds, frame-exact (30 fps), from its start and end in video seconds. */
const span = (a: number, b: number) => (Math.round(b * 30) - Math.round(a * 30)) / 30;
const round2 = (v: number) => Math.round(v * 100) / 100;

// ---------------------------------------------------------------- A (highway-slice, the exit)

/** `HIGHWAY_EXIT` (HighwaySliceScene): car rear 20, the exit sign 8 m beyond the marker at x 5.6 (MILE 150's z: A_Z). */
const EXIT_LAYOUT = {rear: 20, markerZ: -12, exitGap: 8, exitX: 5.6};
/** MW, the `exit` preset: frame 0 and the last frame. */
const EXIT: Framing = {look: [3.8, 0.2, -18], distance: 37};
/** A's one pull-back (scene 1's end) and where the last scene slides in before gliding back to EXIT. */
const EXIT_WIDE: Framing = {look: [2.6, 0.2, -14.5], distance: 43};
/** Scene 14's slide-in: wide and up the road, where the pair is as the car eases off; it glides in to EXIT. */
const EXIT_IN: Framing = {look: [4.2, 0.2, -21.5], distance: 42};
/**
 * Owner, preview 1: a sign standing still while the road streams reads wrong. So in A the pair is fixed to the road
 * (`move: 'road'`) and YOU's car rolls slowly (A_SPEED): MILE 150 and EXIT 150 drift toward the camera at the car's
 * speed and stay readable through line 1. Frame 0: MILE 150 at A_Z. No traffic in A (at a crawl a far car would race off).
 */
const A_SPEED = 1.0;
const A_Z = -12.5;
/** MILE 150 + EXIT 150 (frame 0's gap), on the road. */
const PAIR_150 = {move: 'road', numbers: [150], exits: [150], exitGap: EXIT_LAYOUT.exitGap, exitX: EXIT_LAYOUT.exitX} as const;
/** A: the car, MILE 150 and EXIT 150, nothing orange. */
const A = {location: 'A', drift: 0, signs: [], signFont: F, traffic: []} as const;
/** Scene 14: the car arrives at cruise and eases off to A_SPEED; the pair comes in with the road and settles. */
const A14_SPEED: SpeedKey[] = [
  {at: 0, speed: CRUISE},
  {at: 1.0, speed: A_SPEED},
];
/** Scene 14's length: the pair stands at A_Z at its end, so the loop's cut to frame 0 is seamless. */
const DUR14 = span(T.night, T.end + TAIL);

// ---------------------------------------------------------------- S (highway-slice, the state line and the drive north)

/** W, the `line` preset re-aimed: the cut face (the state line) and the zero node inside the safe zone. */
const LINE: Framing = {look: [-3.5, -8, -22], distance: 85};
/** MW, the stream: YOU's car lower left, the verge where the markers pass (S's one dive). */
const STREAM: Framing = {look: [3.4, 0.5, -23], distance: 40};
/** MW, the 92 pair: frame 0's composition (the rhyme), then slow pushes. */
const PAIR: Framing = {look: [4.1, 0.3, -19], distance: 38};
const PAIR_IN: Framing = {look: [3.7, 0.3, -19.5], distance: 36};
const PAIR_IN2: Framing = {look: [2.9, 0.4, -20.5], distance: 34.5};
/** S: Day, the same interstate, YOU's car where A left it. */
const S = {location: 'S', mood: 'day', drift: 0, signs: [], signFont: F, traffic: []} as const;
/**
 * Scenes 2–6 are one continuous row of markers on the road, ROW m apart, so no sign stands still while the road streams
 * and none pops at a `continue` cut. Scene 2 crawls (S2_SPEED) past MILE 1–4; scene 3 is the fast-forward (S3_SPEED, a
 * jumping count); scene 4 slows to a crawl (SLOW) so the 92 pair holds frame 0's place while the link draws; scene 5
 * cruises on after "Exit 92". Every position below is derived from Z92_S5 (MILE 92 on "When you get to") backwards.
 */
const ROW = 20;
const S2_SPEED = 2;
const S3_SPEED = 60;
const SLOW = 2;
/** YOU's car's front bumper z at `rear` 20 (HighwaySliceScene: −rear + REAR −2.4 − FRONT 2.37). */
const CAR_FRONT = -EXIT_LAYOUT.rear - 2.4 - 2.37;
const DUR2 = span(T.count, T.driving);
const DUR3 = span(T.driving, T.exitNums);
const DUR4 = span(T.exitNums, T.whenYou);
const DUR5 = span(T.whenYou, T.roughly);
const S3_KEYS: SpeedKey[] = [
  {at: 0, speed: S2_SPEED},
  {at: 0.01, speed: S3_SPEED},
];
const S4_KEYS: SpeedKey[] = [
  {at: 0, speed: S3_SPEED},
  {at: 0.01, speed: SLOW},
];
/** Scene 5: the crawl until "Exit 92", then back up to CRUISE: the pair sweeps past. */
const RESUME = r(T.exit92, T.whenYou);
const S5_KEYS: SpeedKey[] = [
  {at: 0, speed: SLOW},
  {at: RESUME, speed: CRUISE}, // TIMED: on "Exit 92"
];
/** MILE 92's z at the starts of scenes 5, 4 and 6: on "Exit 92" at ≈ −12, where frame 0 has MILE 150; on "same count"
 * at ≈ −15.6 with EXIT 92 at ≈ −23.6, both in frame. TIMED. */
const Z92_S5 = -13.34;
const Z92_S4 = round2(Z92_S5 - travel(S4_KEYS, DUR4));
const Z92_S6 = round2(Z92_S5 + travel(S5_KEYS, DUR5));
/** Scene 3's row: marker k (k = 0 is MILE 1) at S3_Z0 − k·ROW at its start; MILE 92 is marker K92. */
const K92 = 12;
const S3_Z0 = round2(Z92_S4 - travel(S3_KEYS, DUR3) + K92 * ROW);
/** When marker k passes the car's front in scene 3 (s). */
const passAt = (k: number) => timeAt(S3_KEYS, CAR_FRONT - S3_Z0 + k * ROW);
/** The row from MILE 91 (the last marker of the fast-forward) to 93, with EXIT 92 (frame 0's gap); none after, so the
 * 58-mile frame is only the car and the bright stretch. */
const ROW_92 = {numbers: [91, 92, 93], ref: 92, spacing: ROW, exits: [92], exitGap: EXIT_LAYOUT.exitGap, exitX: EXIT_LAYOUT.exitX};

// ---------------------------------------------------------------- B (highway-slice, the dark stretch)

/** `HIGHWAY_STOP` (HighwaySliceScene): car rear 26, right tires 2.55 m onto the shoulder, MILE 137 at x 3.95, z −31.6. */
const STOP_LAYOUT = {rear: 26, lateral: 2.55, markerX: 3.95, markerZ: -31.6};
/** MW behind the driving car (B's slide-in) and its slow push. */
const B_IN: Framing = {look: [-0.8, -0.5, -28.5], distance: 36};
const B_IN2: Framing = {look: [-0.5, -0.5, -28.7], distance: 33};
/** M, the `stop` preset: the stopped car, MILE 137 by its front right, the plane below the frame. */
const STOP: Framing = {look: [1.5, -0.5, -29], distance: 29};
/** C, the `marker` preset lowered and eased toward the car: MILE 137 in the subject band, above the captions, the car's
 * front corner at the left edge. */
const MARKER: Framing = {look: [3.4, 1.35, -31.3], distance: 10.5};
/** MW, the `help` preset: the car, MILE 136 / 137 and the ruler; the plane still below the frame. */
const HELP: Framing = {look: [0.7, -2.3, -27], distance: 51};
const HELP_OUT: Framing = {look: [0.7, -2.3, -27], distance: 52.5};
/** Every B scene: Night, nothing around, the cool spot on the car (§ 2 Night floor), MILE 136–138 at 22 m (at 15 m the
 * patrol pickup stopped beside MILE 136, not beside the sign that was read). */
const B = {
  location: 'B',
  mood: 'night',
  drift: 0,
  carLight: 1.8,
  guardrail: false,
  traffic: [],
  signs: [],
  signFont: F,
  markers: {move: 'fixed', numbers: [136, 137, 138], ref: 137, z: STOP_LAYOUT.markerZ, x: STOP_LAYOUT.markerX, spacing: 22},
} as const;
/** Scene 8: the coast to a stop (TIMED: "dies"); stopped by B_STOPPED s. */
const B8_SPEED: SpeedKey[] = [
  {at: 0, speed: CRUISE},
  {at: r(T.dies, T.engine), speed: 16},
  {at: 1.4, speed: 6},
  {at: 2.1, speed: 0},
];
const B_STOPPED = 2.95;
/** Scenes 7–8: the markers are on the road, streaming in until the car stops with MILE 137 at its HIGHWAY_STOP place.
 * Scene 7 hands scene 8 the row where scene 8 starts it. After the stop (scenes 11–13) they stand still with the car. */
const B_ROAD = {...B.markers, move: 'road'} as const;
const Z137_S8 = round2(STOP_LAYOUT.markerZ - travel(B8_SPEED, B_STOPPED));
/** The car stopped on the shoulder, hazards on (video clock: the phase carries across every cut). */
const STOPPED = {shape: 'hatch', rear: STOP_LAYOUT.rear, lateral: STOP_LAYOUT.lateral, speed: [{at: 0, speed: 0}], hazard: {at: -10}};

/** Hazards on at video 30.0 s: a cycle start (42 / 1.4 Hz), so lamps and the relay loop share a phase. TIMED. */
const HAZARD_ON = 30.0;

// ---------------------------------------------------------------- K (car-slice, the call)

/** M, the gas car's `call` preset: head and phone at x ≈ 430, y ≈ 780, room on the right for the box. */
const CALL: Framing = {look: [-0.1, 1.15, -0.05], distance: 9.5};
/** MW, the gas car's `car` preset: the whole cut car on the dark shoulder (K's one pull-out). */
const CAR: Framing = {look: [0.0, 0.75, 0.2], distance: 18};
/** Every K scene: the gas sedan stopped on the dark highway shoulder, hazards blinking. */
const K = {
  location: 'K',
  variant: 'gas',
  mood: 'night',
  road: 'highway',
  driving: [{at: 0, speed: 0}],
  clusterSpeed: 0,
  wheelsWhole: true,
  drift: 0,
  hazardAt: -10,
} as const;

// ---------------------------------------------------------------- music

// Our own bed (audio/music.mp3, take a, 60 s, −15.9 LUFS), from frame 0, 12 dB under the voice, no duck.
// level = (voice −22.4 − 12) − (−15.9) = −18.5
const MUSIC: MusicSpec = {level: -18.5, duckDb: 0, startAt: 0, fadeIn: 1.5};

const picture: VideoSpec = {
  watermark: null,
  tail: TAIL,
  music: MUSIC,
  scenes: [
    // 1 · Line 1, A (Day). Frame 0: YOU's car, MILE 150, EXIT 150. Holds 1 s, then A's one pull-back. On "150 miles"
    // the ruler draws from MILE 150's foot back toward the plane and down the cut face on "state line".
    {
      scene: 'highway-slice',
      cue: 'On most interstates',
      props: {
        ...A,
        mood: 'day',
        framing: 'exit',
        camera: {from: EXIT},
        cameraKeys: [key(0, EXIT), key(1.0, EXIT), key(r(T.count, T.hook), EXIT_WIDE, {ease: 'sine'})],
        car: {shape: 'hatch', rear: EXIT_LAYOUT.rear, speed: [{at: 0, speed: A_SPEED}]},
        markers: {...PAIR_150, z: A_Z},
        ruler: {
          lines: [
            {
              from: 150,
              to: 'plane',
              down: true,
              draw: [
                {at: r(T.miles150, T.hook) - 0.1, value: 0}, // TIMED: "150 miles"
                {at: r(T.stateLine, T.hook), value: 0.8},
                {at: r(T.stateLine, T.hook) + 0.5, value: 1}, // TIMED: off the cut face on "state line"
              ],
            },
          ],
        },
      },
      overlays: [
        {
          type: 'title',
          at: 0,
          question: 'What do exit numbers count?',
          number: 'No. 009',
          title: 'The Interstate',
          time: '7:50 PM',
          until: r(T.count, T.hook) - 0.3,
        },
      ],
    },
    // 2 · Line 2, S (slide). The state line: the zero node lights on "count starts", the STATE LINE callout, and on
    // "goes up from there" the ruler draws up the road, the ticks at markers 1–4 lighting one after another.
    {
      scene: 'highway-slice',
      cue: 'The count starts',
      props: {
        ...S,
        ...SLIDE,
        framing: 'line',
        camera: {from: LINE},
        cameraKeys: [key(0, LINE)],
        car: {shape: 'hatch', rear: EXIT_LAYOUT.rear, speed: [{at: 0, speed: S2_SPEED}]},
        // the start of scene 3's row: MILE 1 lands at S3_Z0 on the cut
        markers: {numbers: [1, 2, 3, 4], spacing: ROW, z: S3_Z0, zAt: DUR2},
        ruler: {
          zero: [
            {at: r(T.countWord, T.count), value: 0},
            {at: r(T.countWord, T.count) + 0.3, value: 1}, // TIMED: "count starts"
          ],
          lines: [
            {
              from: 'plane',
              to: 'far',
              draw: [
                {at: r(T.goesUp, T.count), value: 0},
                {at: r(T.there, T.count) + 0.6, value: 1}, // TIMED: "goes up from there"
              ],
            },
          ],
        },
      },
      overlays: [
        {
          type: 'callout',
          anchor: 'rulerZero',
          title: 'State line',
          sub: 'Mile 0',
          size: 1.4,
          dx: 60,
          dy: -140,
          at: r(T.countWord, T.count) + 0.4,
          until: r(T.goesUp, T.count) + 0.3,
        },
      ],
    },
    // 3 · Line 3a, S. S's one dive to the stream: markers pass YOU's car in fast-forward, their numbers jumping
    // 4 → 91, each tick lighting as the car passes; the ink Counter rolls with them.
    {
      scene: 'highway-slice',
      cue: "If you're driving",
      props: {
        ...S,
        ...CONTINUE,
        cameraKeys: [key(0.9, STREAM, {log: true})],
        car: {shape: 'hatch', rear: EXIT_LAYOUT.rear, speed: S3_KEYS},
        markers: {
          spacing: ROW,
          // MILE 1 (already passed), 2, 3, 4 as scene 2 left them, then the fast-forward to 91, and 92 next
          countKeys: [
            {at: 0, value: 1},
            {at: passAt(1), value: 2},
            {at: passAt(2), value: 3},
            {at: passAt(3), value: 4},
            {at: passAt(K92 - 1) - 0.01, value: 91},
            {at: passAt(K92), value: 92},
          ],
          count: K92 + 3,
          z: S3_Z0,
          exits: [92],
          exitGap: EXIT_LAYOUT.exitGap,
          exitX: EXIT_LAYOUT.exitX,
        },
        ruler: {ticks: 'car', lines: [{from: 'plane', to: 'far'}]},
      },
      overlays: [
        {
          type: 'counter',
          from: 4,
          to: 91,
          label: '',
          sub: 'Mile marker',
          subPlace: 'above',
          x: 0.111,
          y: 0.165,
          at: passAt(3), // MILE 4 passing
          duration: round2(passAt(K92 - 1) - passAt(3)), // lands on 91 as MILE 91 passes the car
          until: r(T.exitNums, T.driving),
        },
      ],
    },
    // 4 · Line 3b, S. The fast-forward ends, the drive slows: MILE 92 and, 8 m beyond, EXIT 92 arrive; on "same count"
    // an orange link draws from the marker's foot to the exit's post.
    {
      scene: 'highway-slice',
      cue: 'and the exit numbers',
      props: {
        ...S,
        ...CONTINUE,
        cameraKeys: [key(1.2, PAIR, {ease: 'sine'})],
        car: {
          shape: 'hatch',
          rear: EXIT_LAYOUT.rear,
          speed: S4_KEYS,
        },
        markers: {...ROW_92, z: Z92_S4},
        ruler: {
          ticks: 'car',
          lines: [{from: 'plane', to: 'far'}],
          links: [
            {
              points: ['marker:92', 'exit:92'],
              draw: [
                {at: r(T.sameCount, T.exitNums), value: 0},
                {at: r(T.sameCount, T.exitNums) + 0.75, value: 1}, // TIMED: "same count"
              ],
            },
          ],
        },
      },
    },
    // 5 · Line 4a, S. YOU's car passes EXIT 92 on "Exit 92" (frame 0's composition again); on "on your way to 150"
    // the ruler brightens from the 92 tick up the road into the haze: the miles still to go.
    {
      scene: 'highway-slice',
      cue: 'When you get to',
      props: {
        ...S,
        ...CONTINUE,
        cameraKeys: [key(0, PAIR), key(r(T.roughly, T.whenYou), PAIR_IN, {ease: 'sine'})],
        car: {
          shape: 'hatch',
          rear: EXIT_LAYOUT.rear,
          speed: S5_KEYS,
        },
        markers: {...ROW_92, z: Z92_S5},
        ruler: {
          ticks: 'car',
          lines: [
            {from: 'plane', to: 'far'},
            {
              from: 92,
              to: 'far',
              bright: [
                {at: r(T.wayTo, T.whenYou) - 0.1, value: 0},
                {at: r(T.wayTo, T.whenYou) + 0.7, value: 1}, // TIMED: "on your way to 150"
              ],
            },
          ],
          links: [{points: ['marker:92', 'exit:92'], glow: [{at: r(T.exit92, T.whenYou) + 0.5, value: 1}, {at: r(T.exit92, T.whenYou) + 1.1, value: 0}]}],
        },
      },
    },
    // 6 · Line 4b, S. The bright stretch ahead; the ink Counter rolls to 58 on "58", a pulse runs up the stretch.
    {
      scene: 'highway-slice',
      cue: "you've got roughly",
      props: {
        ...S,
        ...CONTINUE,
        cameraKeys: [key(r(T.forty, T.roughly), PAIR_IN2, {ease: 'sine'})],
        car: {shape: 'hatch', rear: EXIT_LAYOUT.rear, speed: [{at: 0, speed: CRUISE}]},
        markers: {...ROW_92, z: Z92_S6},
        ruler: {
          ticks: 'car',
          lines: [{from: 92, to: 'far', bright: 1}],
          pulses: [{from: 92, to: 'far', at: r(T.fiftyEight, T.roughly), dur: 1.4}], // TIMED: "58"
        },
      },
      overlays: [
        {
          type: 'counter',
          from: 0,
          to: 58,
          label: 'mi',
          sub: '150 − 92',
          subPlace: 'above',
          x: 0.111,
          y: 0.165,
          at: r(T.fiftyEight, T.roughly) - 0.7,
          duration: 0.8,
          until: r(T.forty, T.roughly) - 0.2,
        },
      ],
    },
    // 7 · Line 5a, B (slide; Night). The dark stretch, nothing around: YOU's car driving, headlights on the road ahead.
    {
      scene: 'highway-slice',
      cue: 'Forty minutes past',
      props: {
        ...B,
        ...SLIDE,
        camera: {from: B_IN},
        cameraKeys: [key(0, B_IN), key(r(T.engine, T.forty), B_IN2, {ease: 'sine'})],
        car: {shape: 'hatch', rear: STOP_LAYOUT.rear, lateral: -0.9, speed: [{at: 0, speed: CRUISE}]},
        markers: {...B_ROAD, z: Z137_S8, zAt: span(T.forty, T.engine)},
      },
    },
    // 8 · Line 5b, B. On "dies" the engine cuts; the car coasts, drifts onto the shoulder and stops with MILE 137 by
    // its front right; brake lamps as it stops, then the hazards (B's one dive, to `stop`).
    {
      scene: 'highway-slice',
      cue: 'your engine dies',
      props: {
        ...B,
        ...CONTINUE,
        cameraKeys: [key(r(HAZARD_ON, T.engine), STOP, {ease: 'inOut'})],
        markers: {...B_ROAD, zAt: B_STOPPED},
        car: {
          shape: 'hatch',
          rear: STOP_LAYOUT.rear,
          speed: B8_SPEED,
          lateral: [
            {at: 0, value: -0.9},
            {at: 0.9, value: -0.9},
            {at: 2.8, value: STOP_LAYOUT.lateral},
          ],
          brake: [
            {at: 2.2, value: 0},
            {at: 2.3, value: 1},
            {at: r(HAZARD_ON, T.engine) - 0.1, value: 1},
            {at: r(HAZARD_ON, T.engine) + 0.1, value: 0},
          ],
          hazard: {at: r(HAZARD_ON, T.engine)},
        },
      },
    },
    // 9 · Lines 6–7a, K (slide). YOU in the stopped cut car: the phone comes up on "call", orange rings leave it on
    // "911"; on "Your phone usually" the detail box: the dispatcher's map with the rough circle.
    {
      scene: 'car-slice',
      cue: 'You call 911',
      props: {
        ...K,
        ...SLIDE,
        framing: 'call',
        camera: {from: CALL},
        cameraKeys: [key(0, CALL)],
        call: {at: r(T.callWord, T.call) - 0.1, ringsAt: r(T.nineOneOne, T.call)}, // TIMED: "call", "911"
      },
      overlays: [
        {type: 'tag', who: 'you', side: 'right', at: 0.1, until: r(T.phone, T.call) - 0.1},
        {type: 'detail', content: 'dispatch-map', anchor: 'phone', side: 'right', at: r(T.phone, T.call) + 0.1},
      ],
    },
    // 10 · Line 7b, K. K's one pull-out to the whole car on the dark shoulder; YOU looks to the window, then across:
    // nothing out there but the blinking rear lamps.
    {
      scene: 'car-slice',
      cue: "but you can't",
      props: {
        ...K,
        ...CONTINUE,
        cameraKeys: [key(0, CALL), key(1.7, CAR, {log: true})],
        call: {at: -10, ringsAt: -10},
        glances: [
          {at: r(T.cantWord, T.cant), to: 'window', hold: 0.7}, // TIMED: "can't say"
          {at: 1.5, to: 'far', hold: 0.6},
        ],
      },
    },
    // 11 · Line 8, B (slide). Back exactly where B left: the stopped car, hazards in phase; on "spot" the push to the
    // sign (the end of B's dive); on "137" the orange node lights on its post.
    {
      scene: 'highway-slice',
      cue: 'Then you spot',
      props: {
        ...B,
        ...SLIDE,
        camera: {from: STOP},
        cameraKeys: [key(r(T.spotWord, T.spot), STOP), key(r(T.beside, T.spot) + 0.4, MARKER, {log: true})], // TIMED
        car: STOPPED,
        ruler: {marks: [{n: 137, kind: 'node', glow: [{at: r(T.n137, T.spot), value: 0}, {at: r(T.n137, T.spot) + 0.4, value: 1}]}]},
      },
    },
    // 12 · Line 9, B. B's one pull-out from the sign to `help`: the ruler lights from the 137 tick both ways, 136
    // behind and 138 ahead; on "crews can find" a pulse runs in from up the road and stops at 137.
    {
      scene: 'highway-slice',
      cue: 'That sign is',
      props: {
        ...B,
        ...CONTINUE,
        cameraKeys: [key(0, MARKER), key(2.6, HELP, {log: true})],
        car: STOPPED,
        ruler: {
          lines: [
            {from: 137, to: 'plane', draw: [{at: 0.4, value: 0}, {at: 2.0, value: 1}]},
            {from: 137, to: 'far', draw: [{at: 0.4, value: 0}, {at: 2.0, value: 1}]},
          ],
          marks: [{n: 137, kind: 'node', glow: 1, pulse: [r(T.crews, T.sign) + 1.3]}],
          pulses: [{from: 'far', to: 137, at: r(T.crews, T.sign) - 0.1, dur: 1.3}], // TIMED: "crews can find"
        },
      },
    },
    // 13 · Line 10, B. On "read that number" the link draws sign → car → up out of frame; on "dispatcher" the map
    // again, the circle collapsing to the MILE 137 pin; on "help" the patrol pickup comes up the shoulder, light bar
    // flashing, brake lamps as it slows, and stops right behind YOU's car.
    {
      scene: 'highway-slice',
      cue: 'You read that',
      props: {
        ...B,
        ...CONTINUE,
        cameraKeys: [key(0, HELP), key(r(T.night, T.read), HELP_OUT, {ease: 'sine'})],
        car: STOPPED,
        ruler: {
          lines: [
            {from: 137, to: 'plane'},
            {from: 137, to: 'far'},
          ],
          marks: [{n: 137, kind: 'node', glow: 1}],
          links: [
            {
              points: ['post:137', 'car', 'up'],
              draw: [
                {at: r(T.number, T.read) - 0.3, value: 0},
                {at: r(T.dispatcher, T.read) + 0.3, value: 1}, // TIMED: "read that number"
              ],
            },
          ],
        },
        helper: {enterAt: r(T.help, T.read) - 0.3, stopAt: r(T.besideIt, T.read) + 0.3, distance: 34, gap: 2}, // TIMED
      },
      overlays: [
        {
          type: 'detail',
          content: 'dispatch-map',
          anchor: 'phoneWindow',
          at: r(T.dispatcher, T.read) - 0.3,
          collapseAt: 0.4,
          pinLabel: 'MILE 137',
          until: r(T.help, T.read) - 0.1,
        },
      ],
    },
    // 14 · Line 11, A (slide; Night → Day). YOU's car at night, slid in at A's pull-back, gliding in to frame 0's
    // framing; a brief orange tick at MILE 150's foot on "last mile marker". In the hold the night passes: Day,
    // headlights off, frame 0's picture.
    {
      scene: 'highway-slice',
      cue: 'On a night drive',
      props: {
        ...A,
        ...SLIDE,
        mood: 'day',
        moodFrom: 'night',
        moodAt: r(T.end, T.night) + 0.15,
        framing: 'exit',
        camera: {from: EXIT_IN},
        cameraKeys: [key(0, EXIT_IN), key(round2(DUR14 - 0.15), EXIT, {ease: 'sine'})],
        // arrives at cruise, eases off to A_SPEED; MILE 150 settles onto frame 0's place at the last frame
        car: {shape: 'hatch', rear: EXIT_LAYOUT.rear, speed: A14_SPEED},
        markers: {...PAIR_150, z: A_Z, zAt: DUR14},
        ruler: {
          marks: [
            {
              n: 150,
              glow: [
                {at: r(T.lastMarker, T.night) - 0.1, value: 0},
                {at: r(T.lastMarker, T.night) + 0.3, value: 1}, // TIMED: "last mile marker"
                {at: r(T.end, T.night) - 0.4, value: 1},
                {at: r(T.end, T.night) + 0.1, value: 0},
              ],
            },
          ],
        },
      },
    },
  ],
};

// ---------------------------------------------------------------- sound

// volume = (voice −22.4 − dB under) − file LUFS (measured by the tooling agent). Volumes ≤ 0.
const DIE = {type: 'sfx', name: 'engine-die', volume: -16.2} as const; // −20.2, 14 under
const GRAVEL = {type: 'sfx', name: 'gravel-stop', volume: -13.6} as const; // −24.8, 16 under
const HZ_CABIN = {type: 'sfx', name: 'hazard-cabin', volume: -7.9, loop: true} as const; // −32.5, 18 under
const HZ_OUT = {type: 'sfx', name: 'hazard-outside', volume: -9.0, loop: true} as const; // −35.4, 22 under
const DIAL = {type: 'sfx', name: 'phone-dial', volume: -15.4} as const; // −25.0, 18 under
const RING = {type: 'sfx', name: 'phone-ring', volume: -16.0} as const; // −24.4, 18 under
const CONNECT = {type: 'sfx', name: 'phone-connect', volume: -15.4} as const; // ≈ −25, 18 under
const NIGHT = {type: 'sfx', name: 'night-bed', volume: -18.0, loop: true} as const; // −28.4, 24 under
const DIESEL = {type: 'sfx', name: 'diesel-stop', volume: -15.0} as const; // −22.4, 15 under
// cruise-day: 25.4 s, plays straight from 0 (no loop; its last 1 s fades out under the night cruise), scenes 1–6.
const CRUISE_DAY = {type: 'sfx', name: 'cruise-day', volume: -27.0} as const; // −24.4, 29 under (owner: was too loud at 20 under)
// cruise-night: 3.6 s, starts with scene 7; the engine swells to match engine-die's level, then fades into it (0.3 s).
const CRUISE_NIGHT = {type: 'sfx', name: 'cruise-night', volume: -17.0, fade: 1.0} as const; // lead-in −26.4, 21 under

/** The hazard relay loop (1.4 Hz, 10 cycles a file) in phase with the lamps: trim so its tick lands on a lamp edge. */
const HZ_LOOP = 10 / 1.4;
const hazardTrim = (videoT: number) => Math.round((((videoT - HAZARD_ON) % HZ_LOOP) + HZ_LOOP) % HZ_LOOP * 1000) / 1000;
/** The night bed (16.04 s loop) from B's slide-in, carried across cuts by trimming each scene's copy. */
const NIGHT_FROM = T.forty;
const nightTrim = (videoT: number) => Math.round(((videoT - NIGHT_FROM) % 16.04) * 1000) / 1000;
/** A loop that runs from the scene's start to its cut (until is clamped to the cut). */
const ALL = 99;

/** Sound per scene (index in `scenes`), seconds into the scene. TIMED against the props above. */
const SOUND: Record<number, OverlaySpec[]> = {
  // 1–6 (A, day): the highway cruise from the first frame; one copy runs across the scene cuts (it ends at 25.4 s)
  0: [{...CRUISE_DAY, at: 0, fade: 0.4}],
  // 7 (B): the night bed starts with the slide to the dark stretch
  6: [{...NIGHT, at: 0, until: ALL}, {...CRUISE_NIGHT, at: 0}],
  // 8: the engine dies (0.3 s before "dies"), gravel as the tires leave the lane, the hazard relay from the lamps
  7: [
    {...NIGHT, at: 0, trim: nightTrim(T.engine), until: ALL},
    {...DIE, at: r(T.dies, T.engine) - 0.3},
    {...GRAVEL, at: 1.1},
    {...HZ_OUT, at: r(HAZARD_ON, T.engine), until: ALL},
  ],
  // 9 (K): inside the car the relay is louder; the dial on "call", the ringback after it
  8: [
    {...NIGHT, at: 0, trim: nightTrim(T.call), until: ALL},
    {...HZ_CABIN, at: 0, trim: hazardTrim(T.call), until: ALL},
    {...DIAL, at: r(T.callWord, T.call) - 0.05},
    {...RING, at: r(T.callWord, T.call) + 0.6, until: ALL},
  ],
  // 10: the call connects (a soft click) on "where you are"
  9: [
    {...NIGHT, at: 0, trim: nightTrim(T.cant), until: ALL},
    {...HZ_CABIN, at: 0, trim: hazardTrim(T.cant), until: ALL},
    {...CONNECT, at: r(T.whereYou, T.cant)},
  ],
  // 11–12 (B): outside again
  10: [
    {...NIGHT, at: 0, trim: nightTrim(T.spot), until: ALL},
    {...HZ_OUT, at: 0, trim: hazardTrim(T.spot), until: ALL},
  ],
  11: [
    {...NIGHT, at: 0, trim: nightTrim(T.sign), until: ALL},
    {...HZ_OUT, at: 0, trim: hazardTrim(T.sign), until: ALL},
  ],
  // 13: the patrol pickup's diesel, peaking as it stops
  12: [
    {...NIGHT, at: 0, trim: nightTrim(T.read), until: ALL},
    {...HZ_OUT, at: 0, trim: hazardTrim(T.read), until: ALL},
    {...DIESEL, at: r(T.besideIt, T.read) + 0.3 - 2.6},
  ],
  // 14 (A): YOU's car cruising again at night, then the day: the day cruise (1 dB lower), fades out with the video
  13: [{...CRUISE_DAY, volume: -28.0, at: 0, until: ALL, fade: 0.6}],
};

export const spec: VideoSpec = {
  ...picture,
  // Cover still (`yarn cover mile-markers`): frame 0's look, MILE 150 and EXIT 150 in daylight, text in the sky band.
  cover: {
    text: 'What Exit\n150 means',
    size: 124,
    scene: 'highway-slice',
    camera: {look: [EXIT.look[0], EXIT.look[1] + 2, EXIT.look[2]], distance: EXIT.distance}, // lower, clear of the text
    at: 0.1,
    props: {
      ...A,
      mood: 'day',
      framing: 'exit',
      car: {shape: 'hatch', rear: EXIT_LAYOUT.rear, speed: [{at: 0, speed: A_SPEED}]},
      markers: {...PAIR_150, z: A_Z},
    },
  },
  scenes: picture.scenes.map((sc, i) => ({...sc, overlays: [...(sc.overlays ?? []), ...(SOUND[i] ?? [])]})),
};
