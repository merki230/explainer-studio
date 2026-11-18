/* eslint-disable @remotion/non-pure-animation -- false positive: `transition` keys in scene props are data, not CSS transitions */
import type {OverlaySpec, SceneSpec, VideoSpec} from '../../types';
import type {CameraKey, SpeedKey} from '../../scenes/keyframes';
import {carCameraStart, MPH60_REVS} from '../../scenes/CarSliceScene';
import {FLOAT_BY} from '../../three/real/SlicedCar';
import transcript from './transcript.json';

/**
 * No. 020 · How does the phone tell a crash from a drop? (`av-script.md` draft 2.2, cut on the recorded take: voice
 * 0.14 → 76.40 s, a 1.5 s tail for the loop).
 *
 * One cut-open gas sedan (YOU's, facing left) in three states, each a `slide` apart: P parked (frame 0, the drop, the
 * loop), D the crash and after (airbag, hazards, the alert, the call), D′ the seconds before the crash, replayed inside
 * one held instant (§ 8) while the four sensor lanes land on the floated phone's board (§ 3 Object cut-aways). Plus
 * The Lab's 'crash-data' dressing and the `cameo-slices` sheet. Orange = the phone's crash signs, then the call: the
 * lanes and the agree node inside the phone, the 911 rings and the text dots rising into the air, the dispatch map's
 * mark, the Lab's crash tiles. Physical events are ink waves (§ 5). No person in frame from the alarm to the call
 * (§ 3 Crashes on screen): the phone floats up clear (`FLOAT_HIGH`, 2.0 m) from 47.76 to 59.68, as in the replay.
 *
 * Deviation from the A/V script: its scenes 11–13 (alert, countdown, calling) are one spec scene here, because a
 * detail box can't carry across cuts; its cues `Then it counts down` and `If nobody does, it` become in-scene keys.
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
  throw new Error(`crash-detect spec: "${phrase}" not found after ${after}`);
};

const FPS = 30;
const TAIL = 1.5;
const END = WORDS[WORDS.length - 1].end;
const N_FRAMES = Math.round((END + TAIL) * FPS);
/** The last rendered frame's time (video s). */
const LAST_T = (N_FRAMES - 1) / FPS;

// ------------------------------------------------------------------ scene cues and starts (video seconds)

const CUES = [
  'If you drop your',
  'If your car crashes',
  'Every iPhone 14 and',
  'It waits until several',
  'one is a motion',
  'Another is GPS, which',
  'A third feels the',
  'And the microphone listens',
  'A dropped phone gets',
  'Apple says it taught',
  'When the phone does',
  'with your location',
  'In the first months',
  'Has your phone ever',
] as const;
const S: number[] = [];
CUES.forEach((c, i) => S.push(i === 0 ? 0 : T(c, S[i - 1] + 0.01)));
const sceneEnd = (i: number) => (i < S.length ? S[i] : N_FRAMES / FPS);

const r2 = (x: number) => Math.round(x * 100) / 100;
/** Video time → seconds into scene i (1-based), on the frame grid the Explainer uses. */
const rel = (i: number, t: number) => r2(t - Math.round(S[i - 1] * FPS) / FPS);
/** The length of scene i in its own seconds. */
const len = (i: number) => rel(i, sceneEnd(i));
/** Shift keys given in video time into scene i. */
const shiftK = <K extends {at: number}>(i: number, ks: K[]): K[] => ks.map((k) => ({...k, at: rel(i, k.at)}));
const shiftN = (i: number, ts: number[]) => ts.map((t) => rel(i, t));

// ------------------------------------------------------------------ the car

type P = Record<string, unknown>;
type Framing = {look: [number, number, number]; distance: number};

/** 30 mph cruise (wheel revolutions a second). */
const CRUISE = MPH60_REVS / 2;

const BASE: P = {
  mood: 'day',
  variant: 'gas',
  shape: 'sedan',
  facing: 'left',
  road: 'city',
  storefronts: true,
  driver: 'you',
  clusterBlank: true,
  drift: 0,
};

/** The crash's speed keys (video s): cruise, brake lamps and slowing 0.5 s before contact, a hard stop at contact (§ 3). */
const crashDrive = (contact: number): {driving: SpeedKey[]; brakeAt: number} => ({
  driving: [
    {at: -100, speed: CRUISE},
    {at: contact - 0.5, speed: CRUISE * 0.6, ramp: 0.5}, // ≈ 60 % of cruise at contact
    {at: contact, speed: 0, ramp: 0.08},
  ],
  brakeAt: contact - 0.5,
});

/** A framing preset of the car-slice for these props (the phone-relative ones follow `floatBy`). */
const F = (framing: string, p: P): Framing => carCameraStart({...BASE, ...p, framing} as never, 30, 30) as Framing;
const at = (f: Framing, distance: number): Framing => ({look: f.look, distance});
/** The fixed angle's screen axes (world): right and up, for moving a framing on screen by metres. */
const RIGHT: [number, number, number] = [0.887, 0, -0.461];
const UP: [number, number, number] = [-0.128, 0.96, -0.246];
/** Move what's framed by `r` m to screen-right and `u` m up (the look moves the other way), at `distance`. */
const shiftF = (f: Framing, r: number, u: number, distance = f.distance): Framing => ({
  look: f.look.map((v, k) => r2((v - r * RIGHT[k] - u * UP[k]) * 1000) / 1000) as [number, number, number],
  distance,
});

/** A glide to `f` starting at `at` (scene s) over `dur` (0 = the scene's opening framing). */
type Seg = {f: Framing; at: number; dur: number};
/** The slow push while a framing holds: this share of the distance per second (the camera never stops). */
const PUSH = 0.006;
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

// ---- P, parked (frame 0, the drop, the loop): engine off, lamps off, YOU holding the lit phone

const parked = (i: number, transition: 'slide' | 'continue', p: P): P => ({
  ...BASE,
  location: 'parked',
  transition,
  driving: [{at: 0, speed: 0}],
  brakeLights: 0,
  ...p,
});

// ---- D, the crash and after (video-time keys, shifted into each scene)

const D_CONTACT = T('crashes'); // 3.60
const D = crashDrive(D_CONTACT);
const D_HAZ = r2(D_CONTACT + 0.7);
/** The bag sags here; YOU sits back upright from the same moment (`posture`). */
const D_SAG = 7.3;
/** YOU's glances after the impact (§ 3: no figure still > 2 s; glances to the phone ≤ 1.0 s). */
const D_GLANCES: {at: number; to: 'window' | 'far' | 'down' | 'phone'; hold: number}[] = [
  {at: 4.4, to: 'window', hold: 0.8},
  {at: 6.2, to: 'far', hold: 0.7},
  {at: 7.4, to: 'far', hold: 0.6},
  {at: T('later'), to: 'window', hold: 1.0},
  {at: T('on.', 9.5), to: 'phone', hold: 0.5},
  {at: 11.3, to: 'far', hold: 0.8},
  {at: T('drop?', 12), to: 'phone', hold: 0.5},
  // after the call starts (scene 11 from 59.68, scene 12)
  {at: 60.3, to: 'window', hold: 0.9},
  {at: 61.9, to: 'far', hold: 0.9},
  {at: 63.4, to: 'window', hold: 0.8},
  {at: 65.0, to: 'far', hold: 0.8},
  {at: T('contacts.'), to: 'window', hold: 0.9},
];
/**
 * The rings lean 0.55 m back and 0.15 m away from YOU's side (default 0.25 back, 0.25 toward YOU's side): on screen the
 * column moves right, clear of YOU's head (review FIX 5; stills 60.6 and 61.5 s).
 */
const RING_OFFSET: [number, number, number] = [-0.55, 0, 0.15];
/** Where the detail boxes' leaders end once the phone is back in its cupholder behind YOU: the ring column's base. */
const RING_ANCHOR = 'roof';
const LEAD_GLANCES = [4.8, 6.6, T('crash', 11), 13.0].map((t) => ({at: t, hold: 1.0}));

const crash = (i: number, transition: 'slide' | 'continue', p: P & {cupPhone?: P}): P => {
  const {cupPhone, ...rest} = p;
  return {
    ...BASE,
    location: 'crash',
    transition,
    driving: shiftK(i, D.driving),
    brakeLights: shiftK(i, [
      {at: D.brakeAt - 0.02, value: 0},
      {at: D.brakeAt, value: 1},
    ]),
    hazardAt: rel(i, D_HAZ),
    lead: {
      contactAt: rel(i, D_CONTACT),
      hazardAt: rel(i, D_HAZ),
      glances: shiftK(i, LEAD_GLANCES),
      stepOutAt: rel(i, T('emergency')),
      standGlances: shiftK(i, [{at: 66.6, hold: 1.0}]),
    },
    airbag: {at: rel(i, D_CONTACT), bloomFor: 0.08, sagAt: rel(i, D_SAG), sagFor: 1.5},
    // § 3 owner sensitivity: YOU sits back upright, head level, hands on the thighs, as the bag sags
    posture: {sitBackAt: rel(i, D_SAG), hands: 'lap', moves: true},
    glances: shiftK(i, D_GLANCES),
    cupPhone: {cup: 'back', rest: 'lap', ringOffset: RING_OFFSET, ...cupPhone},
    ...rest,
  };
};

// ---- D′, the replay inside the held instant (video-time keys)

const R_CONTACT = T('jolts'); // 19.60
const R = crashDrive(R_CONTACT);
const HELD_AT = 19.95; // ≥ 0.35 s after the kick (§ 8)
/**
 * The floated phone's rise and reach: FLOAT_BY.clear's reach with the rise raised to 2.0 m (main session, Stopped-on 3):
 * at FLOAT_BY.board or 1.3 m YOU filled the board shots' background (frozen in the held instant, § 3); at 2.0 nobody is
 * behind the phone. Also the countdown's (scene 11).
 */
const FLOAT_HIGH: [number, number] = [2.0, FLOAT_BY.clear[1]];
/** The crash's sound source for the mic line (car frame): low and ahead of the car's nose. */
const SOUND_FROM: [number, number, number] = [2.4, -2.0, 0.5];
const R_FLOAT = [
  {at: 13.42, value: 0},
  {at: 13.92, value: 1},
  {at: 30.6, value: 1},
  {at: 31.1, value: 0}, // settles back for the crashCabin shot
  {at: 32.36, value: 0},
  {at: 32.86, value: 1}, // floats out again; stays out across the slide
];
const R_LANES = (i: number) => ({
  drawAt: rel(i, T('sensors')),
  scroll: shiftK(i, [
    {at: HELD_AT, value: 0.3},
    {at: HELD_AT + 0.3, value: 0},
  ]),
  motion: {wiggle: true, spikeAt: rel(i, R_CONTACT), scaleTickAt: rel(i, T('times'))},
  gps: {level: 'high', redrawAt: rel(i, T('shows')), redrawFor: 2.3, cliffAt: rel(i, T('suddenly')), signAt: rel(i, T('stopping.'))},
  baro: {bumpAt: rel(i, 32.3)},
  mic: {onAt: rel(i, 15.2), burstAt: rel(i, T('crash', 35))},
  nodeAt: rel(i, T('agree.')),
  agreeAt: rel(i, T('driving.')),
  swell: [
    {lane: 'baro', at: rel(i, T('feels'))},
    {lane: 'mic', at: rel(i, T('knows'))},
  ],
});

const replay = (i: number, transition: 'slide' | 'continue', p: P): P => ({
  ...BASE,
  location: 'replay',
  transition,
  driving: shiftK(i, R.driving),
  brakeLights: shiftK(i, [
    {at: R.brakeAt - 0.02, value: 0},
    {at: R.brakeAt, value: 1},
  ]),
  lead: {contactAt: rel(i, R_CONTACT), glances: []},
  shakeKick: shiftN(i, [R_CONTACT]),
  held: {at: rel(i, HELD_AT)},
  airbag: {at: rel(i, T('airbags')), bloomFor: 0.5, sagAt: null},
  posture: {sitBackAt: rel(i, T('airbags')), hands: 'lap', moves: true}, // upright behind the bag, head level
  inkWaves: {
    pressure: [{at: rel(i, T('fire,')), from: 'airbag'}],
    // from far below and ahead of the floated phone, so the arcs enter low at the frame's lower left (review FIX 3)
    sound: [{at: rel(i, T('sound')), from: SOUND_FROM}],
  },
  cupPhone: {
    cup: 'back',
    rest: 'lap',
    screen: 0,
    float: shiftK(i, R_FLOAT),
    floatBy: FLOAT_HIGH,
    cutAt: rel(i, 13.92),
    massSwing: shiftK(i, [
      {at: R_CONTACT - 0.05, value: 0},
      {at: R_CONTACT + 0.05, value: 1},
    ]),
    lanes: R_LANES(i),
  },
  ...p,
});

/** D′'s framings (the floated phone with `FLOAT_HIGH`). */
const RP = {cupPhone: {floatBy: FLOAT_HIGH}};
const R_BOARD = shiftF(F('board', RP), 0.04, 0); // the phone ≈ 200 px right of centre: cards fit on the left
/** Scene 8's opening: wider, and ≈ 200 px higher so lane 4 and its node sit above the caption band (review FIX 2). */
const R_BOARD_WIDE = shiftF(at(R_BOARD, 1.25), 0, 0.06);
const R_CUP = F('cupClear', RP);
/** The wheel, the bag and YOU's head above the caption band (stills: the builder's preset sat low, the bag at the frame's edge). */
const CRASH_CABIN: Framing = {look: [-0.4, 1.04, 0.19], distance: 5.2};

// ------------------------------------------------------------------ overlays

const titleBlock = {
  type: 'title',
  at: 0,
  question: 'How does the phone tell\na crash from a drop?',
  number: 'No. 020',
  title: 'The Cup Holder',
  time: '5:40 PM',
  carry: true,
  until: r2(WORDS.find((w) => w.text === 'drop?')!.end + 0.8 + 10 / FPS), // fades 0.8 s after the question, over 10 frames
} as OverlaySpec;

const laneCallout = (i: number, lane: string, title: string, a: number, b: number, dx: number, dy: number): OverlaySpec =>
  ({type: 'callout', anchor: `lane:${lane}`, title, dx, dy, size: 1.2, at: rel(i, a), until: rel(i, b)}) as OverlaySpec;

// ------------------------------------------------------------------ scenes

const scenes: SceneSpec[] = [];
const add = (scene: 'car-slice' | 'section-lab' | 'cameo-slices', props: P, overlays: OverlaySpec[] = []) => {
  const i = scenes.length;
  scenes.push({scene, cue: CUES[i], props, overlays});
};

const PARKED = F('parked', {});
const CAR_WIDE = shiftF(F('carWide', {}), 0.5, 1.6, 25); // both cars whole, ≈ 300 px higher, clear of the captions
const CABIN_SKY = F('cabinSky', {});

// 1 · frame 0: parked, YOU holding the lit phone; it drops, nothing happens
{
  const i = 1;
  add(
    'car-slice',
    parked(i, 'continue', {
      framing: 'parked',
      cameraKeys: cam(len(i), [{f: PARKED, at: 0, dur: 0}]),
      cupPhone: {cup: 'back', pickAt: -5, dropAt: rel(i, T('drop'))},
      glances: [{at: rel(i, T('nothing')), to: 'phone', hold: 0.5}],
    }),
    [titleBlock],
  );
}

// 2 · the crash in real time; the phone lights and the call's rings rise
{
  const i = 2;
  add(
    'car-slice',
    crash(i, 'slide', {
      framing: 'carWide',
      cameraKeys: cam(len(i), [{f: CAR_WIDE, at: 0, dur: 0}]),
      shakeKick: [rel(i, D_CONTACT)],
      cupPhone: {
        screen: shiftK(i, [
          {at: T('can'), value: 0},
          {at: T('can') + 0.3, value: 1},
        ]),
        ringsAt: rel(i, T('911.')),
        ringEvery: 0.8,
      },
    }),
  );
}

// 3 · the aftermath: the bag sags, YOU looks around; the question
{
  const i = 3;
  add(
    'car-slice',
    crash(i, 'continue', {
      framing: 'crashCabin',
      cameraKeys: cam(len(i), [
        {f: at(CAR_WIDE, 22), at: 0, dur: 0},
        {f: CRASH_CABIN, at: 0, dur: 0.8},
        {f: CAR_WIDE, at: rel(i, T('How does the phone')), dur: 0.8},
      ]),
      cupPhone: {screen: 1, ringsAt: rel(i, T('911.')), ringEvery: 0.8},
    }),
  );
}

// 4 · D′: seconds before the crash; the phone floats out and opens, the lanes draw on
{
  const i = 4;
  add(
    'car-slice',
    replay(i, 'slide', {
      framing: 'cupClear',
      cameraKeys: cam(len(i), [
        {f: R_CUP, at: 0, dur: 0},
        {f: R_BOARD, at: rel(i, T('several')), dur: 0.8},
      ]),
    }),
  );
}

// 5 · the jolt; the held instant begins; 256 lands whole
{
  const i = 5;
  add(
    'car-slice',
    replay(i, 'continue', {framing: 'board', cameraKeys: cam(len(i), [{f: R_BOARD, at: 0, dur: 0}])}),
    [
      // out at the impact: the car's pitch swings the floated phone under the label
      laneCallout(i, 'motion', 'Motion sensor', T('motion'), R_CONTACT, -420, 0),
      {
        type: 'counter',
        from: 256,
        to: 256,
        duration: 0.1,
        label: '× gravity',
        sub: 'UP TO',
        subPlace: 'above',
        sub2: 'SENSOR RANGE',
        x: 0.111,
        y: 0.155,
        at: rel(i, T('256')),
        until: rel(i, 23.3),
      } as OverlaySpec,
    ],
  );
}

// 6 · GPS: fast, then a sudden stop
{
  const i = 6;
  add('car-slice', replay(i, 'continue', {framing: 'board', cameraKeys: cam(len(i), [{f: R_BOARD, at: 0, dur: 0}])}), [
    laneCallout(i, 'gps', 'GPS', T('GPS,'), 28.2, -420, 0),
  ]);
}

// 7 · the airbag fires (its own clock); pressure rings in the closed cabin; lane 3's bump
{
  const i = 7;
  add(
    'car-slice',
    replay(i, 'continue', {
      framing: 'board',
      cameraKeys: cam(len(i), [
        {f: R_BOARD, at: 0, dur: 0},
        {f: CRASH_CABIN, at: rel(i, 30.6), dur: 0.5},
        {f: R_BOARD_WIDE, at: rel(i, T('if the windows')), dur: 0.7},
      ]),
    }),
    // no `BAROMETER` callout: 30.08 → 30.5 read as a flash on stills (the A/V script's optional); the bump carries it
  );
}

// 8 · the crash's sound reaches the mic; all four agree
{
  const i = 8;
  add(
    'car-slice',
    replay(i, 'continue', {
      framing: 'board',
      cameraKeys: cam(len(i), [
        {f: R_BOARD_WIDE, at: 0, dur: 0},
        {f: R_BOARD, at: rel(i, T('once the phone')), dur: 0.6},
      ]),
    }),
    [laneCallout(i, 'mic', 'Microphone', T('microphone'), 36.0, -290, -40)] // ≈ y 1030, clear of the caption; a short elbow down to the port,
  );
}

// 9 · P again: the drop, the phone opened on the floor mat: only the jolt
{
  const i = 9;
  const drop = T('phone', 38.5);
  add(
    'car-slice',
    parked(i, 'slide', {
      framing: 'parked',
      cameraKeys: cam(len(i), [
        {f: PARKED, at: 0, dur: 0},
        {f: F('floor', {cupPhone: {cup: 'back', pickAt: -5, dropAt: rel(i, drop)}}), at: rel(i, T('gets')), dur: 0.7},
      ]),
      cupPhone: {
        cup: 'back',
        pickAt: -5,
        dropAt: rel(i, drop),
        cutAt: rel(i, 39.2),
        lanes: {
          drawAt: rel(i, 39.25),
          motion: {wiggle: false, spikeAt: rel(i, T('jolt'))},
          gps: {level: 'zero'},
          baro: {},
          mic: {onAt: null},
          nodeAt: rel(i, 39.5),
          swell: [
            {lane: 'gps', at: rel(i, 40.3)},
            {lane: 'baro', at: rel(i, 40.6)},
            {lane: 'mic', at: rel(i, 40.9)},
          ],
          nodePulses: [rel(i, T('signs.'))],
        },
      },
    }),
  );
}

// 10 · The Lab, crash data: the crash tiles light; a million hours
{
  const i = 10;
  add(
    'section-lab',
    {
      mood: 'day',
      dressing: 'crash-data',
      framing: 'wide',
      location: 'lab',
      transition: 'slide',
      crashData: {waveAt: rel(i, T('signs', 43)), benchAt: rel(i, T('crash', 46)), typing: true, leanAt: rel(i, 47.24)},
    },
    [
      {
        type: 'counter',
        from: 0,
        to: 1000000,
        duration: r2(T('hours') - T('more')),
        label: 'hours',
        sub: 'MORE THAN',
        subPlace: 'above',
        sub2: 'OF DRIVING AND CRASH DATA',
        x: 0.111,
        y: 0.155,
        at: rel(i, T('more')),
        until: rel(i, 47.5),
      } as OverlaySpec,
    ],
  );
}

// 11 · D: the agree node, the alarm, the alert, the countdown, the call (the A/V script's scenes 11–13). The phone floats
// up clear (FLOAT_HIGH): no person in frame from here until the call starts (59.68), then it settles back.
{
  const i = 11;
  const BOX_AT = T('alert');
  const box = (t: number) => r2(t - BOX_AT);
  // FLOAT_BY.clear raised to 2.0 m: at the distance where the § 5 alarm arcs fit in frame (3.0), YOU's head still showed
  // under the phone at 1.3 (stills 51.0–59.4 s); at 2.0 no person is in frame (§ 3 Crashes on screen)
  const FLOAT_CLEAR = FLOAT_HIGH;
  const CLEAR = {cupPhone: {floatBy: FLOAT_CLEAR}};
  const CALL = T('calls');
  add(
    'car-slice',
    crash(i, 'slide', {
      framing: 'board',
      cameraKeys: cam(len(i), [
        {f: F('board', CLEAR), at: 0, dur: 0},
        {f: shiftF(F('cupClear', CLEAR), -0.021, 0.173, 3.0), at: rel(i, 49.52), dur: 0.8}, // the phone at x ≈ 430, y ≈ 760: its left alarm arcs in frame, clear of the box and captions
        {f: CABIN_SKY, at: rel(i, CALL), dur: 0.8},
      ]),
      inkWaves: {alarm: [{at: rel(i, T('sounds')), until: rel(i, 58.7), whoopAt: rel(i, T('loud')), sides: 'left'}]},
      cupPhone: {
        floatBy: FLOAT_CLEAR,
        float: shiftK(i, [
          {at: CALL, value: 1},
          {at: CALL + 0.6, value: 0},
        ]),
        cutAt: -5,
        closeAt: rel(i, 49.0),
        screen: shiftK(i, [
          {at: T('sounds') - 0.1, value: 0},
          {at: T('sounds') + 0.2, value: 1},
        ]),
        lanes: {
          motion: {wiggle: false, spikeAt: -20},
          gps: {level: 'zero', cliffAt: -20},
          baro: {bumpAt: -20},
          mic: {onAt: -30, burstAt: -20},
          nodeAt: -30,
          agreeAt: rel(i, T('sense')),
          sendAt: rel(i, T('sense') + 0.22),
          fadeAt: rel(i, 49.2), // every orange mark on the phone gone by 49.5, before its ink arcs (§ 5)
        },
        ringsAt: rel(i, CALL + 0.62), // once it has settled back; the last ink arc gone by 59.30
        ringEvery: 0.8,
      },
    }),
    [
      // two copies of one box, cross-faded at the call: the leader goes to the floated phone, then none once it is
      // back behind YOU, so it never crosses the figure (review FIX 4)
      {
        type: 'detail',
        content: 'crash-alert',
        anchor: 'phone',
        side: 'right',
        top: 440,
        at: rel(i, BOX_AT),
        until: rel(i, CALL + 0.24),
        alert: {
          ringFor: 10,
          countdownAt: box(T('counts')),
          countStartAt: box(T('30')),
          countFrom: 30,
          timelapse: {from: 26, to: 0, at: box(T('nobody')), for: 1.0},
          cancelBoxAt: box(T('still')),
          callingAt: box(CALL),
          messageAt: box(T('message')),
        },
      } as OverlaySpec,
      {
        type: 'detail',
        content: 'crash-alert',
        leader: false, // main session: no leader once the phone is back behind YOU (the rings rise beside the box)
        side: 'right',
        top: 440,
        at: rel(i, CALL - 0.03),
        until: rel(i, 62.5),
        alert: {countdownAt: -1, countFrom: 0, callingAt: r2(0.03), messageAt: r2(T('message') - CALL + 0.03)},
      } as OverlaySpec,
    ],
  );
}

// 12 · the location to the dispatcher; the texts rise
{
  const i = 12;
  const CALL = T('calls');
  add(
    'car-slice',
    crash(i, 'continue', {
      framing: 'cabinSky',
      cameraKeys: cam(len(i), [
        {f: CABIN_SKY, at: 0, dur: 0},
        {f: CAR_WIDE, at: rel(i, T('It also texts')), dur: 0.8},
      ]),
      cupPhone: {
        screen: 1,
        ringsAt: rel(i, CALL + 0.62),
        ringEvery: 0.8,
        sends: shiftN(i, [T('texts'), T('texts') + 0.2, T('texts') + 0.4]),
      },
    }),
    [
      {
        type: 'detail',
        content: 'dispatch-map',
        mapKind: 'street',
        pinLabel: '',
        anchor: RING_ANCHOR, // the location goes out with the call: the leader to the ring column, clear of YOU (review FIX 4)
        side: 'left',
        top: 600,
        collapseAt: r2(T('location.') - S[i - 1]),
        at: 0,
        until: rel(i, 64.9),
      } as OverlaySpec,
    ],
  );
}

// 13 · the cameo: a coaster's brake run, a skier's hard stop; their rings rise
{
  const i = 13;
  add('cameo-slices', {
    mood: 'day',
    framing: 'sheet',
    camera: {from: {look: [-0.03, 0.11, -0.65], distance: 46}, to: {look: [-0.03, 0.11, -0.65], distance: 45}}, // between the builder's sheet (52, riders tiny) and 36 (rings above y 288, the ski block into the captions)
    location: 'cameo',
    transition: 'slide',
    coaster: {trainAt: rel(i, 68.2), stopAt: rel(i, T('roller')), ringsAt: rel(i, T('automatic')), ringEvery: 0.8},
    skier: {
      skiAt: rel(i, 67.6),
      stopAt: rel(i, T('ski')),
      sitAt: rel(i, T('ski') + 0.25),
      upAt: rel(i, 70.6),
      ringsAt: rel(i, T('automatic') + 0.2),
      ringEvery: 0.8,
    },
  });
}

// 14 · P, the loop: YOU picks the phone up; the push lands on frame 0's framing at the last frame
{
  const i = 14;
  const lastLocal = rel(i, LAST_T);
  add(
    'car-slice',
    parked(i, 'slide', {
      framing: 'parked',
      cameraKeys: [
        {at: 0, look: PARKED.look, distance: r2(PARKED.distance + 0.8)},
        {at: lastLocal, look: PARKED.look, distance: PARKED.distance, ease: 'sine'},
      ],
      cupPhone: {cup: 'back', pickAt: rel(i, T('phone', 73.5))},
      glances: [{at: rel(i, T('alarm', 74)), to: 'phone', hold: 0.6}],
      figureClock: -lastLocal, // the idle on the last frame = frame 0's
    }),
  );
}

// ------------------------------------------------------------------ sound

/**
 * Measured with ffmpeg `loudnorm` (integrated LUFS; short clips measured looped): voice −21.7. Self-made, free,
 * deterministic: engine −20.5 (`sfx:engine --seconds 6`, 1800 rpm cruise), road −24.5 (`sfx:hiss --dry`), bump −18.3
 * (`sfx:thump --pitch 0.8`: one low muffled body, no glass, no metal), pop −24.4 (`sfx:thump --pitch 1.6 --lufs -24`: the
 * airbag and the phone landing), hazard −32.5 (`sfx:hazard`, the 1.4 Hz relay), ring −24.4 (`sfx:phone --part ring`),
 * coaster −24.5 (`sfx:hiss --dry --from 1.3 --to 0.2 --seconds 2.4`: wheels running into the brake run), ski −24.5
 * (`sfx:hiss --from 1.1 --to 0.3 --seconds 2`: skis scraping to a stop), wind −28.4 (`sfx:night --crickets 0`), and the
 * phone's alarm −20.4 and siren −20.4: ffmpeg `aevalsrc` synths through a 350–3300 Hz phone-speaker band (alarm: an
 * 880/1100 Hz beep pair every 0.6 s, in step with the § 5 alarm arcs; siren: a 600→1500 Hz whoop every 0.5 s, in step
 * with the whoop arcs; generic, not any maker's sound). Copied: city −32.4, brake-soft −19.17, room −30.43, keys −30.95
 * (light-countdown's), whoosh −16.6 (elevator-dispatch's). volume = (voice − dB under) − file. Physical sounds only:
 * nothing for the orange marks, the lanes, the rings or the cards. The held instant (19.95 → 38.24) holds the world, so
 * its beds drop away and only the events the voice names sound (the airbag, the crash's sound at the mic).
 */
const VOICE_LUFS = -21.7;
const vol = (under: number, lufs: number) => r2(VOICE_LUFS - under - lufs);
const BEDS = {
  city: {name: 'city', volume: vol(25, -32.4)},
  cityHeld: {name: 'city', volume: vol(33, -32.4)}, // the held instant: the street faint, the world stopped
  wind: {name: 'wind', volume: vol(27, -28.4)}, // the cameo's outdoors
  room: {name: 'room', volume: vol(32, -30.43)}, // The Lab
  keys: {name: 'keys', volume: vol(26, -30.95)}, // the researcher typing
  engine: {name: 'engine', volume: vol(22, -20.5)}, // YOU's car driving
  road: {name: 'road', volume: vol(24, -24.5)},
  hazard: {name: 'hazard', volume: vol(24, -32.5)}, // the relay ticking after the crash
  alarm: {name: 'alarm', volume: vol(14, -20.4)}, // the voice names it
  siren: {name: 'siren', volume: vol(14, -20.4)},
} as const;
type Bed = keyof typeof BEDS;
const SHOT = {
  whoosh: {name: 'whoosh', volume: vol(14, -16.6)},
  brake: {name: 'brake-soft', volume: vol(23, -19.17)},
  bump: {name: 'bump', volume: vol(18, -18.3)},
  bumpFar: {name: 'bump', volume: vol(23, -18.3)}, // the crash's sound reaching the mic, inside the held instant
  pop: {name: 'pop', volume: vol(24, -24.4)},
  drop: {name: 'pop', volume: vol(26, -24.4)}, // the phone landing on the floor mat
  ring: {name: 'ring', volume: vol(20, -24.4)},
  coaster: {name: 'coaster', volume: vol(20, -24.5)},
  ski: {name: 'ski', volume: vol(22, -24.5)},
} as const;

/**
 * Music (owner-approved, 78 s, soft electric piano and pad; −15.9 LUFS): 9 dB under the voice from frame 0, no duck,
 * fading in and out (silence on the last frame, the seam), and 4 dB lower under the phone's alarm and siren so it
 * doesn't fight them.
 */
const MUSIC = {
  level: vol(9, -15.9),
  duckDb: 0,
  startAt: 0,
  fadeIn: 1.5,
  fadeOut: 1.5,
  dips: [{from: 49.68, to: 59.3, db: 4, fade: 0.4}],
};

const SEC_END = N_FRAMES / FPS;
const CUT_FADE = 0.15;
const SIREN_END = 58.7; // the last whoop leaves here; with its fade, gone by 59.30 (§ 5: no ink or sound after it)
type Span = {beds: Bed[]; from: number; to: number; fade: number};
const SPANS: Span[] = [
  {beds: ['city'], from: 0, to: HELD_AT, fade: CUT_FADE},
  {beds: ['cityHeld'], from: HELD_AT, to: S[8], fade: 0.3},
  {beds: ['city'], from: S[8], to: S[9], fade: CUT_FADE},
  {beds: ['room'], from: S[9], to: S[10], fade: CUT_FADE},
  {beds: ['keys'], from: r2(S[9] + 0.3), to: r2(S[10] - 0.3), fade: 0.3},
  {beds: ['city'], from: S[10], to: S[12], fade: CUT_FADE},
  {beds: ['wind'], from: S[12], to: S[13], fade: CUT_FADE},
  {beds: ['city'], from: S[13], to: SEC_END, fade: CUT_FADE},
  // driving: the hook's last half second, and the replay until the contact
  {beds: ['engine', 'road'], from: S[1], to: D_CONTACT, fade: CUT_FADE},
  {beds: ['engine', 'road'], from: S[3], to: R_CONTACT, fade: CUT_FADE},
  // the hazards after the crash
  {beds: ['hazard'], from: D_HAZ, to: S[3], fade: CUT_FADE},
  {beds: ['hazard'], from: S[10], to: S[12], fade: CUT_FADE},
  // the phone: the alarm, then the siren
  {beds: ['alarm'], from: T('sounds'), to: T('loud'), fade: 0.05},
  {beds: ['siren'], from: T('loud'), to: r2(SIREN_END + 0.3), fade: 0.3},
];
type Shot = {shot: keyof typeof SHOT; t: number};
const SHOTS: Shot[] = [
  ...[S[1], S[3], S[8], S[9], S[10], S[12], S[13]].map((t) => ({shot: 'whoosh' as const, t: r2(t + 0.05)})),
  {shot: 'drop', t: r2(T('drop') + 0.35)},
  {shot: 'brake', t: D.brakeAt},
  {shot: 'bump', t: D_CONTACT},
  {shot: 'pop', t: r2(D_CONTACT + 0.02)},
  {shot: 'brake', t: R.brakeAt},
  {shot: 'bump', t: R_CONTACT},
  {shot: 'pop', t: T('airbags')},
  {shot: 'bumpFar', t: T('sound')},
  {shot: 'drop', t: r2(T('phone', 38.5) + 0.35)},
  {shot: 'ring', t: r2(T('calls') + 0.62)},
  {shot: 'coaster', t: r2(T('roller') - 1.0)},
  {shot: 'ski', t: r2(T('ski') - 0.5)},
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

/** The cover's framing: scene 8's board shot, wider and lower so the phone sits under the cover text. */
const COVER_BOARD = shiftF(at(R_BOARD, R_BOARD.distance * 1.6), -0.05, 0);

export const spec: VideoSpec = {
  // Cover still (`yarn cover crash-detect`, publisher's text): scene 8's board shot just after the agree node lights
  // (37.5 s): the floated cut-open phone, four lanes lit; no person holding a phone. A question that gives no answer.
  cover: {
    text: "How does a phone\nknow it's a crash?",
    size: 120,
    scene: 'car-slice',
    camera: {look: COVER_BOARD.look, distance: COVER_BOARD.distance},
    at: rel(8, 37.5),
    props: replay(8, 'continue', {framing: 'board'}),
  },
  tail: TAIL,
  music: MUSIC,
  scenes,
};
