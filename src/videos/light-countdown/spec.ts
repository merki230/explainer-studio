/* eslint-disable @remotion/non-pure-animation -- false positive: `transition` keys in scene props are data, not CSS transitions */
import type {OverlaySpec, SceneSpec, VideoSpec} from '../../types';
import type {CameraKey} from '../../scenes/keyframes';
import {cityFraming, type CityCar, type CityDressing} from '../../scenes/CitySliceScene';
import {tapeSkip, type CityTape, type CityTapeTimelapse} from '../../scenes/cityCountdown';
import {labFramings} from '../../scenes/SectionLabScene';
import {CITY} from '../../theme';
import transcript from './transcript.json';

/**
 * No. 019 · Why don't US traffic lights count down for drivers? (`av-script.md` draft 2.1, cut on the recorded take:
 * voice 0.08 → 79.36 s, a 1.5 s tail for the loop).
 *
 * One `city-slice` intersection in two dressings: C 'china' (the countdown box, the phone car, the time tape) and U 'us'
 * (no box, the ghost box, loops and the controller cabinet), plus B, The Lab's 'timing-check'. Each change of dressing
 * or location is a `slide`; inside one it is `continue` with glides (`cameraKeys`, scene seconds). Orange = the light's
 * timing as data. The loop: scene 16 lands on frame 0's framing and state at the last frame (2425), the countdown
 * reading 24 there and 23 at frame 0.
 */

type Word = {text: string; start: number; end: number};
const WORDS = (transcript as {words: Word[]}).words;
const norm = (x: string) => x.toLowerCase().replace(/[^a-z0-9]/g, '');

/** The start (video s) of the first match of `phrase` whose first word starts at or after `after`. */
const T = (phrase: string, after = 0): number => {
  const ws = phrase.split(/\s+/).map(norm);
  for (let i = 0; i <= WORDS.length - ws.length; i++) {
    if (WORDS[i].start < after - 1e-6) continue;
    if (ws.every((w, k) => norm(WORDS[i + k].text) === w)) return WORDS[i].start;
  }
  throw new Error(`light-countdown spec: "${phrase}" not found after ${after}`);
};

const FPS = 30;
const TAIL = 1.5;
const END = WORDS[WORDS.length - 1].end;
const N_FRAMES = Math.round((END + TAIL) * FPS);
/** The last rendered frame's time (video s). */
const LAST_T = (N_FRAMES - 1) / FPS;

// ------------------------------------------------------------------ scene cues and starts (video seconds)

const CUES = [
  'In China, many traffic',
  'but in the US,',
  'US rules keep countdowns',
  'The rulebook says research',
  'And many US lights',
  'Meanwhile, in China, a',
  'Instead, the app can',
  'When the light turns',
  'The app sees that',
  'Over many days, those',
  'Once it knows the',
  'One research team tested',
  'and more than three',
  'The countdown on the',
  "Many US lights don't,",
  'or run on a timer?',
] as const;
const S: number[] = [];
CUES.forEach((c, i) => S.push(i === 0 ? 0 : T(c, S[i - 1] + 0.01)));
const sceneEnd = (i: number) => (i < S.length ? S[i] : N_FRAMES / FPS);

const r2 = (x: number) => Math.round(x * 100) / 100;
/** Video time → seconds into scene i (1-based), on the frame grid the Explainer uses. */
const rel = (i: number, t: number) => r2(t - Math.round(S[i - 1] * FPS) / FPS);
/** Word in scene i → video seconds. */
const Wv = (i: number, phrase: string) => T(phrase, S[i - 1]);
/** The length of scene i in its own seconds. */
const len = (i: number) => rel(i, sceneEnd(i));

// ------------------------------------------------------------------ camera

type Framing = {look: [number, number, number]; distance: number};
type FName = Parameters<typeof cityFraming>[0];
const STOP = 35;
const F = (name: FName, d: CityDressing): Framing => cityFraming(name, STOP, false, d) as Framing;
const nudge = (f: Framing, dx = 0, dy = 0, dz = 0, dist?: number): Framing => ({
  look: [r2(f.look[0] + dx), r2(f.look[1] + dy), r2(f.look[2] + dz)],
  distance: dist ?? f.distance,
});

/** A glide to `f` starting at `at` (scene s) over `dur` (0 = a cut to it, the scene's opening framing). */
type Seg = {f: Framing; at: number; dur: number};
/** The slow push while a framing holds: this share of the distance per second. */
const PUSH = 0.004;
/** Keys for a scene of length `L`: each glide, then a slow push held until the next glide and to the scene's end. */
const cam = (L: number, segs: Seg[]): CameraKey[] => {
  const keys: CameraKey[] = [];
  segs.forEach((s, j) => {
    if (j > 0) {
      const p = segs[j - 1];
      const pa = p.at + p.dur;
      keys.push({at: r2(s.at), look: p.f.look, distance: r2(p.f.distance * (1 - PUSH * (s.at - pa))), ease: 'sine'});
    }
    keys.push({at: r2(s.at + s.dur), look: s.f.look, distance: s.f.distance, ease: 'inOut'});
  });
  const last = segs[segs.length - 1];
  const la = last.at + last.dur;
  keys.push({at: r2(L), look: last.f.look, distance: r2(last.f.distance * (1 - PUSH * (L - la))), ease: 'sine'});
  return keys;
};

// the framings (the scene-builder's, a few tuned on stills)
/** Frame 0 and the loop: the builder's 'signal' 1.0 m higher (≈ 85 px lower on screen), the heads ≥ 40 px under the title (review FIX 4). */
const C_SIGNAL = nudge(F('signal', 'china'), 0, 1.0);
const C_COUNT = F('count', 'china');
const C_CAR = F('car', 'china');
const C_QCLOSE = F('queueClose', 'china');
/**
 * The tape framings (review FIX 5, the air tape of v0.18.16): the band 12–24 m up the street, 4.0 m up, straight over lane 3
 * (`across` 8.25, the phone car's lane), so on screen the line runs right above the queue's roofs (≈ 200 px over the car
 * under its middle at `C_QTAPE`). Over lane 2/3's line (the default 6.6) it projected onto the far sidewalk and read as
 * paint on the ground.
 * Review round 2 (D5): closer and lower, the queue filling the frame below the line instead of bare pavement.
 * `C_QTAPE`: the line at x ≈ 255–875, y ≈ 545–800; the queue under it to y ≈ 1320; the heads above the frame.
 * `C_TAPE`: the line close at x ≈ 125–880, y ≈ 530–840. Below it the street and the right sidewalk (the fixed angle puts
 *   the near sidewalk in the lower right of every framing on this band).
 */
const C_QTAPE: Framing = {look: [8.4, 1.6, -16.4], distance: 36};
const C_TAPE: Framing = {look: [8.65, 2.0, -17], distance: 31};
const U_SIGNAL = F('signal', 'us');
/** Scene 3: the builder's 'count' a little closer, so the ghost box reads as a display that isn't there (review FIX 3). */
const U_COUNT = {...F('count', 'us'), distance: 21};
/** Scene 4's opening: the heads a little wider, the ghost digits ≥ 40 px tall (§ 3), before the glide down to the cars. */
/** Round 2 D2: the box at x ≈ 670–920, y ≈ 400–645, the ghost digits ≈ 140 px tall. */
const U_COUNT_W: Framing = {look: [2.35, 4.4, -52.7], distance: 14};
/**
 * Scene 4 (review FIX 1, round 2 D1): aimed down the two lanes so A and B are whole and mid-screen from the yellow
 * (≈ 12 m before the line: x ≈ 180–460, y ≈ 800–880, above the caption band) to B's stop at the line (≈ 790, 675); the
 * left head and the ghost box at the top right (≈ 890, 210).
 */
const U_APPROACH: Framing = {look: [6.0, -3.4, -27], distance: 70};
const U_LOOPSW = F('loopsWide', 'us');
const U_LOOPS = F('loops', 'us');
/** Scene 2's in-scene glide: closer on YOU's car and the heads. */
const U_CLOSER = nudge(U_SIGNAL, 0.6, 0.6, -2, 40);
/** Scene 15's in-scene glide: closer on the lane 3 loop and the heads. */
/** Scene 15: 'loops' 0.95 m higher, YOU's car ≈ 100 px lower, clear of the caption (review FIX 8). */
const U_LOOPS_15 = nudge(U_LOOPS, 0, 0.95);
const U_LOOPS_CLOSE = nudge(U_LOOPS_15, 0.3, 0.3, 0, 32);
/** The loop scene opens a little wider than frame 0 and lands on it. */
const C_SIGNAL_WIDE = {...C_SIGNAL, distance: r2(C_SIGNAL.distance + 1.6)};

// ------------------------------------------------------------------ signals (video seconds, shifted per scene)

type Sig = {at: number; state: 'red' | 'yellow' | 'green'};
const sig = (i: number, ks: Sig[]) => ks.map((k) => ({at: k.at < -50 ? -99 : rel(i, k.at), state: k.state}));
/** Frame 0 shows 23 (the green 23.0 s ahead); the last frame shows 24 (the green 23.033 s past it), so it counts on. */
const C_FRAME0: Sig[] = [
  {at: -99, state: 'red'},
  {at: 23.0, state: 'green'},
];
const C_LOOP: Sig[] = [
  {at: -99, state: 'red'},
  {at: r2(LAST_T + 23.0 + 1 / FPS), state: 'green'},
];
/** Scenes 6–10: the red the app counts (green at 41.0, on "turns green"). */
const GREEN_A = 41.0;
const C_A: Sig[] = [
  {at: -99, state: 'red'},
  {at: GREEN_A, state: 'green'},
  {at: GREEN_A + 30, state: 'yellow'},
];
/**
 * Scene 11: another day's red, 40 s to go as the app box enters (the gap bar then reads as most of one gap; at 9 s it was
 * a 7 cm stub at the squeezed scale). The green, off-frame after the scene, is the tape's marker.
 */
const GREEN_B = r2(T('count down', T('Once it', 50)) + 40);
const C_B: Sig[] = [
  {at: -99, state: 'red'},
  {at: GREEN_B, state: 'green'},
];
/** Scene 14: a red reading 33 at the slide, 31 as the app box enters. */
const GREEN_C = 99.3;
const C_C: Sig[] = [
  {at: -99, state: 'red'},
  {at: GREEN_C, state: 'green'},
];
/** The US corner, scenes 2–5: green on "watch", yellow on "yellow", red on "disagree", the next green on "struggle". */
const U_GREEN1 = T('watch.', S[2]);
const U_YELLOW1 = T('yellow', S[3]);
const U_RED1 = T('disagree.', S[3]);
const U_GREEN2 = T('struggle', S[4]);
const U_YELLOW2 = T('changes.', S[4]);
const U_A: Sig[] = [
  {at: -99, state: 'red'},
  {at: U_GREEN1, state: 'green'},
  {at: U_YELLOW1, state: 'yellow'},
  {at: U_RED1, state: 'red'},
  {at: U_GREEN2, state: 'green'},
  {at: U_YELLOW2, state: 'yellow'},
  {at: r2(U_YELLOW2 + 3.5), state: 'red'},
];
/** Scene 15: YOU's call turns it green on "for your car" (the second one). */
const U_GREEN3 = T('for your car,', T('Do the', S[14]));
const U_C: Sig[] = [
  {at: -99, state: 'red'},
  {at: U_GREEN3, state: 'green'},
];

// ------------------------------------------------------------------ cars

/** Gap between cars at rest (m): four cars a lane fit between the stop line and the cut face. */
const GAP = 2.5;
const PHONE_PAINT = CITY.carBodies[2];
/** A car already at rest at the scene's start, brake lamps lit. */
const parked = (lane: 2 | 3, extra: Partial<CityCar> = {}): CityCar => ({lane, liftAt: -8, stopAt: -4, brakeAt: -1, lamps: 'auto', ...extra});
/** The countdown corner's queue at a red (frame 0's): lane 3 the phone car and three behind, lane 2 four. */
const queueC = (phone: Partial<CityCar> = {}, l3: Partial<CityCar>[] = [{}, {}, {}], l2: Partial<CityCar>[] = [{}, {}, {}, {}]): CityCar[] => [
  parked(3, {paint: PHONE_PAINT, shape: 'crossover', phone: true, gaze: 'phone', ...phone}),
  ...l3.map((x) => parked(3, x)),
  ...l2.map((x) => parked(2, x)),
];

// scenes 8–10: the pull-away at the green (video s); the app cars: lane 3's 1st, 2nd and 4th, lane 2's 3rd
const GO3 = [41.92, 42.6, 43.4, 44.2];
const GO2 = [42.2, 43.0, 43.8, 44.6];
// review FIX 6: the app cars are the phone car and the queue's near end (both lanes' 3rd and 4th), the cars `queueTape`
// shows in scene 9; the 2nd cars, also in view, have none
const APP3 = [true, false, true, true];
const APP2 = [false, false, true, true];
const startsC = (i: number): CityCar[] =>
  queueC(
    {goAt: rel(i, GO3[0]), app: APP3[0]},
    GO3.slice(1).map((g, k) => ({goAt: rel(i, g), app: APP3[k + 1]})),
    GO2.map((g, k) => ({goAt: rel(i, g), app: APP2[k]})),
  );

// ------------------------------------------------------------------ the time tape (N6)

/** Bunch 0: the four app cars' starts (video s) and their offsets. */
const APP_STARTS = [...GO3.filter((_, k) => APP3[k]), ...GO2.filter((_, k) => APP2[k])].sort((a, b) => a - b);
const FRONT = APP_STARTS[0];
const FIRST = APP_STARTS.map((s) => r2(s - FRONT));
/** The air tape (v0.18.16): 12–24 m up the street (over the queue's near half), 4.0 m above the pavement, over lane 3. */
const TAPE_BAND: Pick<CityTape, 'x' | 'y' | 'across'> = {x: [12, 24], y: 4.0, across: 8.25};
/** Scene 10's time-lapse (scene s). */
const TL10: CityTapeTimelapse = {at: rel(10, T('many days,', S[9])), until: rel(10, r2(T('that gap', S[9]) + 0.6))};
const SKIP10 = tapeSkip(TL10);
/** The cycle (🎭): chosen so bunch 5 lands in the time-lapse and the marker (one gap after it) is scene 11's green. */
const CYCLE = r2((GREEN_B + SKIP10 - FRONT) / 6);
/** Scene 14: the story skips on so bunch 6 has landed and the marker (one gap on) is scene 14's green. */
const SKIP14 = FRONT + 7 * CYCLE - GREEN_C;
const TAPE_BASE: CityTape = {...TAPE_BAND, cycle: CYCLE, front: FRONT, first: FIRST};
/** Before scene 9 nothing lands (the phones report later): bunch 0's report is keyed past the scene. */
const NOT_YET = {report: {at: 999}};

// ------------------------------------------------------------------ scene props

type P = Record<string, unknown>;
const city = (dressing: CityDressing, transition: 'slide' | 'continue', p: P): P => ({
  mood: 'day',
  dressing,
  // owner note: many US corners detect by a pole camera, others by loops; lane 3 is watched by the camera, lane 2 has
  // its loop, in every US scene (the same corner across cuts)
  ...(dressing === 'us' ? {detectCam: true} : {}),
  plates: 'blank',
  stopLine: STOP,
  gap: GAP,
  trees: false, // the far street trees sat behind the heads and the countdown box
  drift: 0,
  transition,
  ...p,
});

// ------------------------------------------------------------------ overlays

const titleBlock = {
  type: 'title',
  at: 0,
  question: "Why don't US traffic lights\ncount down for drivers?",
  number: 'No. 019',
  title: 'The Intersection',
  time: '8:12 AM',
  carry: true,
  until: r2(WORDS.find((w) => w.text === 'here?')!.end + 0.8 + 10 / FPS), // fades 0.8 s after "…why not here?" ends, over 10 frames
} as OverlaySpec;

/** The app box (the dash phone's map app): left side, above the tape. */
const appBox = (i: number, a: number, b: number, top: number): OverlaySpec =>
  ({type: 'detail', content: 'light-app', anchor: 'phone', side: 'left', top, at: rel(i, a), until: rel(i, b)}) as OverlaySpec;

// ------------------------------------------------------------------ scenes

const scenes: SceneSpec[] = [];
const add = (scene: 'city-slice' | 'section-lab', props: P, overlays: OverlaySpec[] = []) => {
  const i = scenes.length;
  scenes.push({scene, cue: CUES[i], props, overlays});
};

// 1 · frame 0: the countdown corner at the red, the box at 23
{
  const i = 1;
  add(
    'city-slice',
    city('china', 'slide', {
      framing: 'signal',
      cameraKeys: cam(len(i), [{f: C_SIGNAL, at: 0, dur: 0}]),
      signal: sig(i, C_FRAME0),
      cars: queueC({glances: [{at: rel(i, Wv(i, 'traffic')), to: 'signal', hold: 1.2}]}),
    }),
    [titleBlock],
  );
}

// 2 · the US corner, the same framing: no box; YOU waits at the red
const youAtLine = (i: number, extra: Partial<CityCar> = {}): CityCar => parked(3, {body: 'you', shape: 'crossover', ...extra});
const greyBehind = (i: number, extra: Partial<CityCar> = {}): CityCar => ({
  lane: 3,
  speed: 9,
  liftAt: rel(i, r2(Wv(2, 'not allowed') - 2.6)),
  stopAt: rel(i, r2(Wv(2, 'not allowed') + 0.4)),
  lamps: 'auto',
  ...extra,
});
{
  const i = 2;
  add(
    'city-slice',
    city('us', 'slide', {
      framing: 'signal',
      cameraKeys: cam(len(i), [
        {f: U_SIGNAL, at: 0, dur: 0},
        {f: U_CLOSER, at: rel(i, Wv(i, 'so why')), dur: 0.8},
      ]),
      signal: sig(i, U_A),
      loopCalls: 'keys',
      cars: [youAtLine(i, {glances: [{at: rel(i, Wv(i, 'countdown')), hold: 1.2}]}), greyBehind(i)],
    }),
  );
}

// 3 · the heads close; the ghost box draws on; green on "watch"
const GHOST_AT = T('countdowns', S[2]);
{
  const i = 3;
  add(
    'city-slice',
    city('us', 'continue', {
      framing: 'count',
      cameraKeys: cam(len(i), [{f: U_COUNT, at: 0, dur: 0.8}]),
      signal: sig(i, U_A),
      loopCalls: 'keys',
      ghostBox: {at: rel(i, GHOST_AT), fadeAt: null},
      cars: [youAtLine(i, {goAt: rel(i, r2(U_GREEN1 + 0.3))}), greyBehind(i, {goAt: rel(i, r2(U_GREEN1 + 0.9))})],
    }),
  );
}

// 4 · the ghost digits 3 2 1 into the yellow; A goes through, B stops (F15)
/**
 * Review FIX 1: B brakes 0.2 s after the yellow and is at rest by 18.4 (6.25 m/s², firm), so at the yellow both cars are
 * ≈ 12 m before the line and in frame at `approach`; A, at the same speed, is past the line by ≈ 17.9, inside the yellow.
 */
const B_LIFT = r2(T('yellow', S[3]) + 0.2);
const B_STOP = 18.4;
const V_AB = 11.25;
const carB = (i: number, extra: Partial<CityCar> = {}): CityCar => ({
  lane: 3,
  shape: 'sedan',
  paint: CITY.charcoal,
  extraLook: 'b',
  speed: V_AB,
  liftAt: rel(i, B_LIFT),
  stopAt: rel(i, B_STOP),
  decel: 'constant',
  lamps: 'auto',
  ...extra,
});
{
  const i = 4;
  const ghost = {
    at: rel(i, GHOST_AT),
    fadeAt: rel(i, r2(U_RED1 + 0.36)),
    digits: [
      {at: rel(i, 15.36), d: 3},
      {at: rel(i, 15.72), d: 2},
      {at: rel(i, 16.08), d: 1},
    ],
    digitsOutAt: rel(i, U_YELLOW1),
  };
  add(
    'city-slice',
    city('us', 'continue', {
      framing: 'approach',
      cameraKeys: cam(len(i), [
        {f: U_COUNT_W, at: 0, dur: 0.8},
        {f: U_APPROACH, at: rel(i, r2(U_YELLOW1 - 0.3)), dur: 0.8},
      ]),
      signal: sig(i, U_A),
      loopCalls: 'keys',
      ghostBox: ghost,
      // B first (A is placed beside it); A keeps its speed through the yellow, B slows evenly to rest on the loop
      cars: [carB(i), {lane: 2, shape: 'crossover', paint: CITY.carBodies[1], beside: 0, speed: V_AB}],
    }),
  );
}

// 5 · loops and the cabinet: B's call, the green; C and D call; the decision; yellow on "changes"
/** A cruising car whose front wheels cross onto the lane's loop at video time `at` (front axle 1.05 m behind the bumper). */
const LOOP_EDGE_FRONT = STOP - 0.9 - 6 * 0.3048 + 1.05; // the front bumper's distance up the street at the crossing
const crossing = (i: number, at: number, speed: number, extra: Partial<CityCar> = {}): CityCar => ({
  lane: 3,
  speed,
  ahead: r2(LOOP_EDGE_FRONT - speed * rel(i, at)),
  ...extra,
});
{
  const i = 5;
  add(
    'city-slice',
    city('us', 'continue', {
      framing: 'loopsWide',
      cameraKeys: cam(len(i), [
        {f: U_LOOPSW, at: 0, dur: 0.8},
        {f: U_LOOPS, at: rel(i, Wv(i, 'because road')), dur: 0.7},
      ]),
      signal: sig(i, U_A),
      decideAt: rel(i, Wv(i, 'just seconds')),
      decideFor: 1.4, // from "just" to "changes" (review FIX 7)
      cars: [
        carB(i, {calls: [rel(i, Wv(i, 'lights would'))], goAt: rel(i, r2(U_GREEN2 + 0.15)), goSpeed: 10, goRamp: 2.5}),
        // lane 2 calls by its loop (≈ 23.6), lane 3 by the camera: both kinds of sensor before the decision
        crossing(i, 23.6, 9, {lane: 2, paint: CITY.carBodies[1]}),
        crossing(i, 24.5, 9, {paint: CITY.carBodies[3]}),
        crossing(i, 25.5, 9, {paint: CITY.carBodies[4], shape: 'sedan'}),
      ],
    }),
  );
}

// 6 · the countdown corner again: the app counts the red with the pole
{
  const i = 6;
  const boxIn = Wv(i, 'count down');
  add(
    'city-slice',
    city('china', 'slide', {
      framing: 'signal',
      cameraKeys: cam(len(i), [
        {f: C_SIGNAL, at: 0, dur: 0},
        {f: C_CAR, at: rel(i, Wv(i, 'app can')), dur: 0.7},
      ]),
      signal: sig(i, C_A),
      cars: queueC({glances: [{at: rel(i, r2(Wv(i, 'without') + 0.1)), to: 'signal', hold: 1.6}]}),
    }),
    [
      {type: 'place', text: 'China', left: 120, top: 300, size: 30, rule: true, at: rel(i, r2(Wv(i, 'China,') - 0.24)), until: rel(i, r2(Wv(i, 'China,') + 1.06))} as OverlaySpec,
      appBox(i, boxIn, r2(S[6] - 0.15), 560),
    ],
  );
}

// 7 · the queue whole; the time tape draws on (nothing lands yet)
{
  const i = 7;
  add(
    'city-slice',
    city('china', 'continue', {
      framing: 'queueTape',
      cameraKeys: cam(len(i), [{f: C_QTAPE, at: 0, dur: 0.8}]),
      signal: sig(i, C_A),
      cars: startsC(i),
      tape: {...TAPE_BASE, ...NOT_YET, drawAt: rel(i, Wv(i, 'timing'))},
    }),
  );
}

// 8 · the green; the cars start one after another
{
  const i = 8;
  add(
    'city-slice',
    city('china', 'continue', {
      framing: 'queueClose',
      cameraKeys: cam(len(i), [{f: C_QCLOSE, at: 0, dur: 0.7}]),
      signal: sig(i, C_A),
      cars: startsC(i),
      tape: {...TAPE_BASE, ...NOT_YET},
    }),
  );
}

// 9 · the app sees the moment: dots over the app cars, their starts land on the tape
{
  const i = 9;
  const report = rel(i, Wv(i, 'moment'));
  add(
    'city-slice',
    city('china', 'continue', {
      framing: 'queueTape',
      cameraKeys: cam(len(i), [{f: C_QTAPE, at: 0, dur: 0.7}]),
      signal: sig(i, C_A),
      cars: startsC(i),
      appDots: {at: rel(i, Wv(i, 'sees')), reportAt: report},
      tape: {...TAPE_BASE, report: {at: report}},
    }),
  );
}

// 10 · over many days: the time-lapse, bunches one cycle apart, the brackets, the gap is the cycle
{
  const i = 10;
  add(
    'city-slice',
    city('china', 'continue', {
      framing: 'tape',
      cameraKeys: cam(len(i), [{f: C_TAPE, at: 0, dur: 0.8}]),
      signal: sig(i, C_A),
      cars: startsC(i),
      appDots: {at: -10, reportAt: -5},
      tape: {
        ...TAPE_BASE,
        bunches: 5,
        timelapse: TL10,
        brackets: {at: rel(i, Wv(i, 'same')), every: 0.15, pulseAt: [rel(i, Wv(i, 'cycle.'))]},
      },
    }),
  );
}

// 11 · the marker one gap ahead; another day's red; the app counts down with the gap bar
{
  const i = 11;
  const boxIn = Wv(i, 'count down');
  add(
    'city-slice',
    city('china', 'continue', {
      framing: 'tape',
      cameraKeys: cam(len(i), [
        {f: C_TAPE, at: 0, dur: 0},
        {f: C_QTAPE, at: rel(i, Wv(i, 'the app can')), dur: 0.7},
      ]),
      signal: sig(i, C_B),
      // another day: the phone car is 4th in lane 3, so it and the tape share `C_QTAPE`
      cars: [parked(3), parked(3), parked(3), parked(3, {paint: PHONE_PAINT, shape: 'crossover', phone: true, gaze: 'phone'}), ...[0, 1, 2, 3].map(() => parked(2))],
      tape: {
        ...TAPE_BASE,
        scale: 'squeezed',
        skip: SKIP10,
        bunches: 5,
        brackets: {at: -2},
        predict: {at: rel(i, Wv(i, 'knows'))},
        gapBar: {at: rel(i, boxIn), until: rel(i, r2(S[11] - 0.1))},
      },
    }),
    // round 2 D4: top left, over the buildings, clear of the queue and above the tape's near end (y ≈ 690); leader down to the phone car
    [{...appBox(i, boxIn, r2(S[11] - 0.12), 288), side: 'left', size: 300} as OverlaySpec],
  );
}

// 12 · The Lab: the wave of estimates across the 10,000 cells
const LAB = labFramings('vertical');
{
  const i = 12;
  add('section-lab', {
    mood: 'day',
    dressing: 'timing-check',
    transition: 'slide',
    drift: 0,
    framing: 'wide',
    cameraKeys: [
      {at: 0, look: LAB.wide.look, distance: LAB.wide.distance},
      {at: len(i), look: LAB.wide.look, distance: r2(LAB.wide.distance * (1 - PUSH * len(i))), ease: 'sine'},
    ],
    timingCheck: {
      waveAt: rel(i, Wv(i, 'tested')),
      waveFor: r2(Wv(i, '10,000') - Wv(i, 'tested')),
      typing: true,
      leanAt: [rel(i, r2(Wv(i, 'in China,') + 0.05)), null],
    },
  });
}

// 13 · the grid close: three in four within five seconds
{
  const i = 13;
  add(
    'section-lab',
    {
      mood: 'day',
      dressing: 'timing-check',
      transition: 'continue',
      drift: 0,
      framing: 'grid',
      cameraKeys: [
        {at: 0, look: LAB.wide.look, distance: r2(LAB.wide.distance * (1 - PUSH * len(12)))},
        {at: 0.7, look: LAB.grid.look, distance: LAB.grid.distance, ease: 'inOut'},
        {at: len(i), look: LAB.grid.look, distance: r2(LAB.grid.distance * (1 - PUSH * (len(i) - 0.7))), ease: 'sine'},
      ],
      timingCheck: {lit: true, resolveAt: rel(i, Wv(i, 'three in four')), blinkAt: rel(i, Wv(i, 'five seconds'))},
    },
    [
      {
        type: 'counter',
        from: 0,
        to: 75,
        label: '%',
        sub: 'MORE THAN',
        subPlace: 'above',
        sub2: 'WITHIN 5 SECONDS',
        duration: 0.9,
        x: 0.111,
        y: 0.156,
        at: rel(i, r2(Wv(i, 'three in four') + 0.24)),
        until: rel(i, r2(S[13] - 0.2)),
      } as OverlaySpec,
    ],
  );
}

// 14 · both countdowns, the same second; the tape's even gaps
{
  const i = 14;
  const boxIn = Wv(i, 'app both');
  add(
    'city-slice',
    city('china', 'slide', {
      framing: 'count',
      cameraKeys: cam(len(i), [
        {f: C_COUNT, at: 0, dur: 0},
        {f: C_CAR, at: rel(i, Wv(i, 'and the one')), dur: 0.7},
        {f: C_QTAPE, at: rel(i, Wv(i, 'keep a steady')), dur: 0.7},
      ]),
      signal: sig(i, C_C),
      cars: queueC(),
      tape: {
        ...TAPE_BASE,
        scale: 'squeezed',
        skip: SKIP14,
        bunches: 6,
        brackets: {at: -2, pulseAt: [rel(i, Wv(i, 'schedule.'))]},
        predict: {at: -2},
      },
    }),
    [appBox(i, r2(boxIn - 0.4), r2(Wv(i, 'that keep') - 0.3), 560)],
  );
}

// 15 · the US corner: YOU's car calls the green ("wait for your car")
{
  const i = 15;
  const stop = Wv(i, 'wait for');
  add(
    'city-slice',
    city('us', 'slide', {
      framing: 'loops',
      cameraKeys: cam(len(i), [
        {f: U_LOOPS_15, at: 0, dur: 0},
        {f: U_LOOPS_CLOSE, at: rel(i, Wv(i, 'Do the')), dur: 0.7},
      ]),
      signal: sig(i, U_C),
      loopCalls: 'keys',
      cars: [
        {
          lane: 3,
          body: 'you',
          shape: 'crossover',
          speed: 8,
          liftAt: rel(i, r2(stop - 3.0)),
          stopAt: rel(i, stop),
          lamps: 'auto',
          calls: [rel(i, Wv(i, 'for your car.'))],
          glances: [{at: rel(i, T('you', T('Do the', S[14]))), hold: 1.0}],
          goAt: rel(i, r2(U_GREEN3 + 0.33)),
        },
      ],
    }),
  );
}

// 16 · "or run on a timer?": the countdown corner, landing on frame 0 at the last frame
{
  const i = 16;
  const lastT = rel(i, LAST_T);
  add(
    'city-slice',
    city('china', 'slide', {
      framing: 'signal',
      cameraKeys: [
        {at: 0, look: C_SIGNAL_WIDE.look, distance: C_SIGNAL_WIDE.distance},
        {at: lastT, look: C_SIGNAL.look, distance: C_SIGNAL.distance, ease: 'sine'},
      ],
      signal: sig(i, C_LOOP),
      cars: queueC(),
      loop: true,
    }),
  );
}

// ------------------------------------------------------------------ sound (home-heat's `BEDS` pattern)

/**
 * Measured with ffmpeg `loudnorm` (integrated LUFS; beds measured looped): voice −22.33, music −14.47 (owner-approved,
 * 81 s, plucked synth and a ticking pulse), city −32.45 (`sfx:station`, flock-camera's corner bed), idle −20.44 and
 * engine-work −20.44 (flock-camera's), pull-away −20.09 and brake-soft −19.17 (ev-cost's), relay −29.45 (home-heat's
 * `sfx:contactor --pitch 1.3`), room −30.43 (home-heat's room tone), cabinet-hum −34.44 (`sfx:pump --name cabinet-hum
 * --seconds 8`: the controller cabinet's 72 Hz hum), keys −30.95 (31 seeded `sfx:latch --part out` ticks, high-passed:
 * soft keyboard taps). volume = (voice − dB under) − file. City 25 under, room 32, idles and engines 22, the cabinet hum
 * 28, keys 26, one-shots 20–23. Physical sounds only: nothing for the orange marks, the tape, the digits or the phone.
 * The seam: the city bed and the idle run at frame 0 and on the last frame alike (0.15 s edges); the music fades at both
 * ends.
 */
const VOICE_LUFS = -22.33;
const vol = (under: number, lufs: number) => r2(VOICE_LUFS - under - lufs);
const BEDS = {
  city: {name: 'city', volume: vol(25, -32.45)}, // −14.88: both corners
  room: {name: 'room', volume: vol(32, -30.43)}, // −23.9: The Lab
  idle: {name: 'idle', volume: vol(22, -20.44)}, // −23.89: engines idling at a red
  work: {name: 'engine-work', volume: vol(22, -20.44)}, // −23.89: cars moving through
  hum: {name: 'cabinet-hum', volume: vol(28, -34.44)}, // −15.89: the cabinet, open on screen
  keys: {name: 'keys', volume: vol(26, -30.95)}, // −17.38: the researchers typing
} as const;
type Bed = keyof typeof BEDS;
/** Music: 9 dB under the voice from frame 0, no duck, fading to silence on the last frame (the seam). */
const MUSIC = {level: vol(9, -14.47), duckDb: 0, startAt: 0, fadeIn: 1.5, fadeOut: 1.5} as const; // −16.86
const SHOT = {
  pull: {name: 'pull-away', volume: vol(21, -20.09)}, // −23.24
  pullSoft: {name: 'pull-away', volume: vol(24, -20.09)}, // −26.24: a car further off
  brake: {name: 'brake-soft', volume: vol(23, -19.17)}, // −26.16
  relay: {name: 'relay', volume: vol(20, -29.45)}, // −12.88: the controller's relay on the decision
} as const;

const SEC_END = N_FRAMES / FPS;
const CUT_FADE = 0.15;
type Span = {beds: Bed[]; from: number; to: number; fade: number};
const DECIDE = T('just seconds', S[4]);
const SPANS: Span[] = [
  // outdoors at both corners; the Lab's room tone between
  {beds: ['city'], from: 0, to: S[11], fade: CUT_FADE},
  {beds: ['room'], from: S[11], to: S[13], fade: CUT_FADE},
  {beds: ['city'], from: S[13], to: SEC_END, fade: CUT_FADE},
  // idling at the reds (frame 0's queue and the loop's)
  {beds: ['idle'], from: 0, to: r2(U_GREEN1 + 0.5), fade: CUT_FADE},
  {beds: ['idle'], from: S[4], to: r2(U_GREEN2 + 0.4), fade: 0.4},
  {beds: ['idle'], from: S[5], to: r2(GREEN_A + 1.2), fade: 0.5},
  {beds: ['idle'], from: S[10], to: S[11], fade: 0.4},
  {beds: ['idle'], from: S[13], to: S[14], fade: 0.4},
  {beds: ['idle'], from: r2(T('wait for', S[14]) - 0.3), to: r2(U_GREEN3 + 0.5), fade: 0.4},
  {beds: ['idle'], from: S[15], to: SEC_END, fade: CUT_FADE},
  // cars moving through: A and B approaching (scene 4), C and D over the loops (scene 5), the queue leaving (scenes 8–9)
  {beds: ['work'], from: r2(S[3] + 0.3), to: 19.4, fade: 0.6},
  {beds: ['work'], from: 23.0, to: 26.6, fade: 0.6},
  {beds: ['work'], from: r2(GO3[1] + 0.3), to: 46.8, fade: 0.8},
  // the controller cabinet, open on screen
  {beds: ['hum'], from: S[4], to: S[5], fade: 0.4},
  {beds: ['hum'], from: S[14], to: S[15], fade: 0.4},
  // the researchers typing
  {beds: ['keys'], from: r2(S[11] + 0.4), to: r2(S[13] - 0.3), fade: 0.3},
];
type Shot = {shot: keyof typeof SHOT; t: number};
const SHOTS: Shot[] = [
  {shot: 'pull', t: r2(U_GREEN1 + 0.3)}, // scene 3: YOU pulls away on the green
  {shot: 'brake', t: B_LIFT}, // scene 4: B's soft brake at the yellow
  {shot: 'pull', t: r2(U_GREEN2 + 0.15)}, // scene 5: B pulls away
  {shot: 'relay', t: DECIDE}, // scene 5: the cabinet decides
  {shot: 'pull', t: GO3[0]}, // scene 8: the phone car launches
  {shot: 'pullSoft', t: GO3[1]}, // scene 8: the next car
  {shot: 'pull', t: r2(U_GREEN3 + 0.33)}, // scene 15: YOU pulls away
];

const sfxFor = (n: number): OverlaySpec[] => {
  const s0 = S[n - 1];
  const e = sceneEnd(n);
  const beds = SPANS.filter((sp) => sp.from < e - 1e-6 && sp.to > s0 + 1e-6).flatMap((sp) => {
    const a = Math.max(sp.from, s0);
    const b = Math.min(sp.to, e);
    const carried = sp.from < s0 - 1e-6 || sp.to > e + 1e-6;
    return sp.beds.map(
      (bed) =>
        ({
          type: 'sfx',
          ...BEDS[bed],
          loop: true,
          fade: carried ? Math.min(sp.fade, CUT_FADE) : sp.fade,
          at: rel(n, a),
          until: rel(n, b),
        }) as OverlaySpec,
    );
  });
  const shots = SHOTS.filter((x) => x.t >= s0 - 1e-6 && x.t < e - 1e-6).map((x) => ({type: 'sfx', ...SHOT[x.shot], at: rel(n, x.t)}) as OverlaySpec);
  return [...beds, ...shots];
};
scenes.forEach((sc, i) => {
  const extra = sfxFor(i + 1);
  if (extra.length) sc.overlays = [...(sc.overlays ?? []), ...extra];
});

export const spec: VideoSpec = {
  // Cover still (`yarn cover light-countdown`, publisher's text): the countdown corner at the red as frame 0 shows it, the
  // box counting, the phone car in the queue; a question that gives no answer.
  cover: {
    text: "Why don't US lights\ncount down?",
    size: 130,
    scene: 'city-slice',
    camera: {look: C_SIGNAL.look, distance: C_SIGNAL.distance},
    at: 3,
    props: city('china', 'continue', {framing: 'signal', signal: sig(1, C_FRAME0), cars: queueC()}),
  },
  tail: TAIL,
  music: MUSIC,
  scenes,
};
