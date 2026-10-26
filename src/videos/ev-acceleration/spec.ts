import {
  RACE_CX,
  raceCarOptions,
  raceCarState,
  raceClockAt,
  raceFramings,
  raceTimeTo,
  type RaceSliceSceneProps,
} from '../../scenes/RaceSliceScene';
import {driveUnitFramings} from '../../scenes/DriveUnitScene';
import type {OverlaySpec, SceneSpec, VideoSpec} from '../../types';

/**
 * No. 007 · The Drag Strip, in The Section (style guide v0.12). From `av-script.md` revision 3 (owner decisions
 * 1–7 of 2026-10-25), timed to the recorded take (transcript.json, 78.45 s).
 *
 * Locations (one-way camera, § Camera path of the av-script):
 *  - R `race-slice`: the twin section, the electric coupe's lane on top, the V8 coupe's below. Three visits:
 *    R1 (lines 1–2: `line` → `twin`, the real-time run), a hard cut (owner decision 3), R2 (lines 3–11: the
 *    slow-motion replay; `pair` / `ev` at one distance as the hub, two matching dives from it (the EV's
 *    motor in line 7a, the gas car's gearbox in line 8b, owner preview 1), then one pull-out gearbox → `ev` →
 *    `twin` → `wide`), and R3 (line 13: `wide` → `line`, the restage, landing on frame 0).
 *  - U `drive-unit` (line 12): the generic two-speed unit, `unit` → `gears`.
 *
 * The race is the builder's launch model (ev 0–60 3.3 s, 0–100 8.0 s; gas 3.6 / 7.8 s, the testers' times):
 * every speed, push arrow, gear, rpm, dashboard and stopwatch here is read from `raceCarState` / `raceTimeTo`,
 * so the cards and the picture agree. "Hit 100 first" is a time, not a pass: the 0–100 stopwatch rows show it
 * (no fake pass; the gas car is still behind at 100, as in the real runs).
 *
 * R2's race clock is chained by hand (`raceFrom` = the scene before's clock at its end, the same value the
 * continue carry hands on), so the readouts can be computed here.
 *
 * Orange: the drive paths and push arrows on both cars from the green in line 3, the back-voltage's
 * battery arrow (the motor's own back-push is ink), the power meter and the tach band in the boxes, the chart,
 * and U's engaged stage. Nothing orange in R1 or R3 (frame 0 and the loop).
 *
 * Illustrative (🎭, disclosed): the two separate test runs side by side, race time compressed (R1) and slowed
 * (R2), arrow lengths, meters and chart as shapes, 30 mph as this car's knee, the 8-pair gearbox, the generic
 * line-12 unit, the story time.
 *
 * Sound: our own bed (`audio/music.mp3`, 82 s) from frame 0, ≈ 12 dB under the dry voice, no duck, no dips.
 * Physical SFX only (owner, No. 008): V8 idle / run / revs, the shift clunks, the tire roar. No whine, no whoosh.
 */

const FPS = 30;
/** The gas driver's side (owner may switch it to 'near'; change it here only). */
const GAS_SIDE = 'far' as const;

/** Cue and word times, video seconds (transcript.json). TIMED. */
const T = {
  hook: 0, // An electric car beat
  but: 6.32,
  so: 9.12,
  fade: 10.72,
  motor: 12.56, // An electric motor (after the cut)
  stop: 14.92,
  thirty: 17.44,
  gasEngine: 19.2, // A gas engine
  soIt: 22.0,
  shift: 23.56,
  testers: 25.08, // Testers timed the
  awd: 31.92, // All-wheel drive helped
  helped: 32.8,
  past: 34.68, // Past about 30
  fighting: 37.04,
  battery: 38.0,
  soThe: 38.6, // so the push
  butEach: 43.6, // but each gear
  above: 48.0, // Above about 30
  power: 49.68,
  aGas: 52.96, // A gas car needs
  high: 56.75, // At high speed
  andThe: 60.27, // and the electric car had
  n1400: 63.28,
  pounds: 64.6,
  porsche: 66.63, // Porsche gave its
  twoGears: 69.2,
  one: 70.24,
  highSpeed: 72.12,
  next: 73.36, // Next time an
  watch: 75.52, // watch how the
  end: 78.45,
};
const TAIL = 1.0;

const F = (t: number) => Math.round(t * FPS);
/** A scene's length (s) from its cue to the next, in whole frames as Explainer cuts them. */
const len = (a: number, b: number) => (F(b) - F(a)) / FPS;
const r = (abs: number, start: number) => Math.round((abs - start) * 100) / 100;

// eslint-disable-next-line @remotion/non-pure-animation
const CONTINUE = {transition: 'continue'} as const;
// eslint-disable-next-line @remotion/non-pure-animation
const SLIDE = {transition: 'slide'} as const;
// eslint-disable-next-line @remotion/non-pure-animation
const CUT = {transition: 'cut'} as const;

type V3 = [number, number, number];
type Framing = {look: V3; distance: number};
const key = (at: number, f: Framing, o: {ease?: 'out' | 'inOut' | 'sine'; log?: boolean} = {}) => ({at, ...f, ...o});
const at = (f: Framing, distance: number): Framing => ({look: f.look, distance});

// ---------------------------------------------------------------- framings

const FR = raceFramings(3.4);
const LINE = FR.line;
const TWIN = FR.twin;
const WIDE = FR.wide;
const EV_MOTOR = FR.evMotor;
/** R2's medium distance (lines 3–6 hold it; `ev` is a crane at the same distance). */
/** Lifted (look 3.2 m lower) and 4 m further out than the preset, so the gas car clears the captions and a
 * card fits in the band between them (y ≈ 830–1050). */
const PAIR = (d: number): Framing => ({
  look: [FR.pair.look[0], FR.pair.look[1] - 3.2, FR.pair.look[2]],
  distance: d + 4,
});
const EVF = (d: number) => at(FR.ev, d + 4); // the same distance as `PAIR`
const DU = driveUnitFramings();
/** C, the gas car's gearbox (tracked on the gas car): the 8 pairs large, the active one and the orange path
 * readable; the twin of `evMotor` (the same distance), so the two dives read as a pair of "look inside" moments. */
const GEARBOX: Framing = {look: [RACE_CX - 0.75, 0.5, 0.32], distance: 5};
const GEARBOX_IN: Framing = {look: [RACE_CX - 0.75, 0.5, 0.32], distance: 4.8};
/** R2's pull-out framings, lifted like `PAIR` (no title block in R2). */
/** Line 10's twin, lifted further so both cars sit above the chart card. */
const TWIN_C = (d: number): Framing => ({
  look: [TWIN.look[0] + 1.8, TWIN.look[1] - 6.0, TWIN.look[2]], // 1.8 m along the strip: the pair centred
  distance: d,
});
const WIDE_L = (d: number): Framing => ({look: [WIDE.look[0], WIDE.look[1] - 3.0, WIDE.look[2]], distance: d});

// ---------------------------------------------------------------- the race

type RP = Partial<RaceSliceSceneProps> & Record<string, unknown>;
const EV_PUSH_MAX = 10.15; // the model's launch push (m/s²): arrow length 1
/** A scene's props with its length, for the race helpers (Explainer sets the real one). */
const calc = (p: RP, a: number, b: number) => ({...p, durationInFrames: F(b) - F(a)}) as Partial<RaceSliceSceneProps>;
/** Push-arrow length keys (0 → 1) for a car over a scene, from the model's push. */
const arrowKeys = (p: Partial<RaceSliceSceneProps>, w: 'ev' | 'gas', d: number) => {
  const out: {at: number; value: number}[] = [];
  for (let t = 0; t <= d + 0.001; t += 0.2)
    out.push({at: Math.round(t * 100) / 100, value: raceCarState(p, w, t, FPS).push / EV_PUSH_MAX});
  return out;
};
/** Readout keys (a field of `raceCarState`), seconds after `from` (a box entering), every `step`. */
const readKeys = (
  p: Partial<RaceSliceSceneProps>,
  w: 'ev' | 'gas',
  from: number,
  to: number,
  f: 'mph' | 'rpm',
  step = 0.2,
) => {
  const out: {at: number; value: number}[] = [];
  for (let t = from; t <= to + 0.001; t += step) {
    const s = raceCarState(p, w, t, FPS) as Record<string, number>;
    out.push({at: Math.round((t - from) * 100) / 100, value: Math.round(s[f])});
  }
  return out;
};
/** The gas car's gear steps over a window, seconds after `from` (for the tach box). */
const gearKeys = (p: Partial<RaceSliceSceneProps>, from: number, to: number) => {
  const out: {at: number; value: number}[] = [];
  let last = -1;
  for (let t = from; t <= to + 0.001; t += 1 / FPS) {
    const g = (raceCarState(p, 'gas', t, FPS) as {gear?: number}).gear ?? 1;
    if (g !== last) out.push({at: Math.round((t - from) * 100) / 100, value: g});
    last = g;
  }
  return out;
};
/** Scene seconds of each gas gear change in a window (for the clunks). */
const shiftTimes = (p: Partial<RaceSliceSceneProps>, d: number) =>
  gearKeys(p, 0, d)
    .slice(1)
    .map((k) => k.at);

// The electric and gas cars' options (over race-slice's defaults); R2 adds the orange.
const EV_CAR = {launch: true} as const;
const GAS_CAR = {launch: true, driverSide: GAS_SIDE} as const;
const ARROWS = {full: 1.5, radius: 0.07} as const;
const R_BASE = {mood: 'day', drift: 0} as const;

/**
 * 🎭 (owner, preview 2): the gas car closes the gap and edges ahead right at 100 mph. The real tests were
 * separate runs, so the side-by-side positions are illustrative anyway. From 60 mph (race 3.6 s) its speed is
 * the launch model's × a factor easing up to `BOOST` by race 6 s, eased back off after its 100 mph. Its gear and rpm stay the
 * model's (passed explicitly, since a car with its own `driving` keys loses the automatic ones). The push
 * arrows, the stopwatch and the line-4 tach read the unboosted model (all before 60 mph, so unchanged).
 */
const BOOST = 0.2;
/** After its 100, a slight give-back so the lead grows only slowly (both cars stay in the wide frames). */
const BOOST_LATE = 0.03;
const smooth = (x: number) => {
  const u = Math.max(0, Math.min(1, x));
  return u * u * (3 - 2 * u);
};
/** Up from race 3.6 s (60 mph) to race 6 s, held to its 100 mph (≈ 6.6 s), then eased off by 8.6 s so the
 * two cars run at the model's near-equal speeds and the gas car keeps a small lead (both stay in frame). */
const boostAt = (c: number) =>
  1 + BOOST * (smooth((c - 3.6) / 2.4) - smooth((c - 6.6) / 2.0)) - BOOST_LATE * smooth((c - 7.2) / 2.0);
const gasOverride = (p: Partial<RaceSliceSceneProps>) => {
  const o = raceCarOptions(p, 'gas', FPS);
  const driving = (o.driving ?? []).map((k) => ({at: k.at, speed: k.speed * boostAt(raceClockAt(p, k.at + 0.8) ?? 0)}));
  return {driving, gear: o.gear, rpm: o.rpm};
};

/** One R2 scene: its props, with the race clock chained from the scene before and the arrows from the model. */
type R2In = {
  cue: string;
  a: number;
  b: number;
  scale: number | {at: number; value: number}[];
  cam: ReturnType<typeof key>[];
  track: number | {at: number; value: number}[];
  ev?: Record<string, unknown>;
  gas?: Record<string, unknown>;
  brighten?: number;
};
let clock = 0;
const r2 = (s: R2In, first = false): {spec: SceneSpec; p: Partial<RaceSliceSceneProps>} => {
  const timing: RP = first ? {green: r(T.stop, s.a), timeScale: s.scale} : {raceFrom: clock, timeScale: s.scale};
  const base: RP = {...R_BASE, ...timing, track: s.track, ev: EV_CAR, gas: GAS_CAR};
  const p = calc(base, s.a, s.b);
  const d = len(s.a, s.b);
  const evOrange = first ? {drivePath: {at: r(T.stop, s.a), drawFor: 0.5}} : {drivePath: {at: -10, drawFor: 0.5}};
  const gasOrange = first ? {gasDrive: {at: r(T.stop, s.a) + 0.2, drawFor: 0.5}} : {gasDrive: {at: -10, drawFor: 0.5}};
  const props = {
    ...base,
    ...(first ? CUT : CONTINUE),
    cameraKeys: s.cam,
    ev: {
      ...EV_CAR,
      ...evOrange,
      pushArrows: {
        ...ARROWS,
        length: arrowKeys(p, 'ev', d),
        ...(s.brighten !== undefined ? {brighten: s.brighten} : {}),
      },
      ...s.ev,
    },
    gas: {
      ...GAS_CAR,
      ...gasOverride(p),
      ...gasOrange,
      pushArrows: {...ARROWS, length: arrowKeys(p, 'gas', d)},
      ...s.gas,
    },
  };
  clock = raceClockAt(p, d) ?? clock;
  return {spec: {scene: 'race-slice', cue: s.cue, props}, p};
};

// ---------------------------------------------------------------- R1: the run in real time (lines 1–2)

// a slow-motion dip around 100 mph (owner, preview 2), so the gas car's sign clearly lands first and the
// electric car's follows a beat later
const R1_SCALE = [
  {at: 0, value: 0.86},
  {at: 6.9, value: 0.86},
  {at: 7.3, value: 0.6},
  {at: 8.6, value: 0.6},
  {at: 9.2, value: 1.0},
];
// after the gas car's 100 the camera eases onto the electric car, so its sign lands in frame while the gas
// car runs on ahead (the lead is the point)
const R1_TRACK = [
  {at: 0, value: 0.5},
  {at: 8.4, value: 0.5},
  {at: 9.8, value: 1},
];
const R1_MODEL: RP = {
  ...R_BASE,
  green: 0.3,
  timeScale: R1_SCALE,
  track: R1_TRACK,
  ev: EV_CAR,
  gas: GAS_CAR,
  framing: 'line',
};
const R1: RP = {...R1_MODEL, gas: {...GAS_CAR, ...gasOverride(calc(R1_MODEL, T.hook, T.motor))}};
const R1p = calc(R1, T.hook, T.motor);
// the 0–100 stopwatch: enters on "but the gas car", its clock already in race time; GAS stops first
/** Scene seconds each car reaches 100 mph in R1 (the gas car first). */
const gasHit = raceTimeTo(R1p, 'gas', 100, FPS) ?? 7.4; // the boosted gas car
const evHit = raceTimeTo(R1p, 'ev', 100, FPS) ?? 7.9;

const s1: SceneSpec = {
  scene: 'race-slice',
  cue: 'An electric car beat',
  props: {
    ...R1,
    cameraKeys: [key(0, LINE), key(1.0, LINE), key(2.6, TWIN, {log: true})],
  },
  overlays: [
    {
      type: 'title',
      at: 0,
      question: 'Why did its head start fade?',
      number: 'No. 007',
      title: 'The Drag Strip',
      time: '2:40 PM',
      until: r(T.fade, T.hook) + 1.1, // ≈ 0.8 s after "fade?" ends
    },
    // owner, preview 1: a "100 MPH" marker pops on each lane the frame its car reaches 100: the gas car's
    // first, while it is still behind (the 0–100 stopwatch is dropped: both together crowded the frame)
    {
      type: 'callout',
      title: '100 mph · 7.8 s', // the testers' time to 100, in the label's dark ink (no grey sub-line)
      size: 1.5,
      anchor: 'top:gas', // just over its roof, on the top lane's clean cut face (under it, the label met the captions)
      place: 'above',
      dy: -40,
      at: gasHit,
      until: 9.2, // before the gas car runs out of frame ahead (its label would clamp at the edge)
    },
    {
      type: 'callout',
      title: '100 mph · 8.0 s',
      size: 1.5,
      anchor: 'lane:ev', // on the lane's clean cut face under the car (the crowd behind made the roof spot busy)
      place: 'side',
      dx: 24,
      dy: 104, // ≈ 0.03 below the lane edge, on the face between the lanes
      at: evHit,
      until: len(T.hook, T.motor) - 0.2,
    },
  ],
};

// ---------------------------------------------------------------- R2: the replay in slow motion (lines 3–11)

// line 3: green on "stop"; the EV holds its push to ≈ 30 mph by "hour"
const S2 = r2(
  {
    cue: 'An electric motor',
    a: T.motor,
    b: T.gasEngine,
    scale: 0.44,
    track: 0.5,
    cam: [key(0, PAIR(38)), key(len(T.motor, T.gasEngine), PAIR(37.6), {ease: 'sine'})],
  },
  true,
);
// line 4: the V8 revs and shifts (two changes); very slow after "shift gears" so the EV reaches 60 on "3.3"
const S3 = r2({
  cue: 'A gas engine',
  a: T.gasEngine,
  b: T.testers,
  scale: [
    {at: 0, value: 0.27},
    {at: r(T.shift, T.gasEngine) + 0.2, value: 0.27},
    {at: r(T.shift, T.gasEngine) + 0.7, value: 0.06},
  ],
  track: 0.5,
  cam: [key(0, PAIR(37.6)), key(len(T.gasEngine, T.testers), PAIR(37.2), {ease: 'sine'})],
});
// line 5: the stopwatch; ELECTRIC stops as the EV reaches 60, GAS as the gas car does
const S4 = r2({
  cue: 'Testers timed the',
  a: T.testers,
  b: T.awd,
  scale: 0.09,
  track: 0.5,
  cam: [key(0, PAIR(37.2)), key(len(T.testers, T.awd), PAIR(36.8), {ease: 'sine'})],
});
// line 6: a crane up to the EV at the same distance; both arrows brighten on "helped"
const S5 = r2({
  cue: 'All-wheel drive helped',
  a: T.awd,
  b: T.past,
  scale: 0.08,
  track: [
    {at: 0, value: 0.5},
    {at: 0.8, value: 1},
  ],
  cam: [key(0, PAIR(36.8)), key(0.8, EVF(36.8)), key(len(T.awd, T.past), EVF(36.8))],
  brighten: r(T.helped, T.awd),
});
// line 7a: the one dive, into the EV's rear unit: the back-voltage grows from "fighting"
const S6 = r2({
  cue: 'Past about 30',
  a: T.past,
  b: T.soThe,
  scale: 0.08,
  track: 1,
  cam: [
    key(0, EVF(36.8)),
    key(1.0, EV_MOTOR, {log: true}),
    key(len(T.past, T.soThe), at(EV_MOTOR, 4.8), {ease: 'sine'}),
  ],
  ev: {
    backVoltage: {
      at: r(T.fighting, T.past) - 0.3,
      back: [
        {at: r(T.fighting, T.past), value: 0.15},
        {at: r(T.battery, T.past) + 0.3, value: 0.85},
      ],
    },
  },
});
// lines 7b–8a: the pull-out begins, back to both drivetrains; both arrows shrink
const S7 = r2({
  cue: 'so the push',
  a: T.soThe,
  b: T.butEach,
  scale: 0.06,
  track: [
    {at: 0, value: 1},
    {at: 1.1, value: 0.5},
  ],
  cam: [
    key(0, at(EV_MOTOR, 4.8)),
    key(1.1, PAIR(38.4), {log: true}),
    key(len(T.soThe, T.butEach), PAIR(38.8), {ease: 'sine'}),
  ],
  ev: {backVoltage: {at: -5, back: 0.85, fadeAt: 0.9}},
});
// line 8b (owner, preview 1): the second dive, into the gas car's gearbox, the twin of line 7a's: a gear
// change on "gear change", then the race speeds up so a second one lands near "strongest"
const S8 = r2({
  cue: 'but each gear',
  a: T.butEach,
  b: T.above,
  scale: [
    {at: 0, value: 0.15},
    {at: 0.8, value: 0.15},
    {at: 1.1, value: 0.7},
  ],
  track: [
    {at: 0, value: 0.5},
    {at: 1.0, value: 0},
  ],
  cam: [key(0, PAIR(38.8)), key(1.0, GEARBOX, {log: true}), key(len(T.butEach, T.above), GEARBOX_IN, {ease: 'sine'})],
});
// line 9: a crane up to the EV at the same distance: the power meter full and still
const S9 = r2({
  cue: 'Above about 30',
  a: T.above,
  b: T.aGas,
  scale: 0.12,
  track: [
    {at: 0, value: 0},
    {at: 1.1, value: 1},
  ],
  // the final pull-out starts here: gearbox (4.8 m) → the EV at the hub distance → twin → wide
  cam: [key(0, GEARBOX_IN), key(1.1, EVF(39.6), {log: true}), key(len(T.above, T.aGas), EVF(40), {ease: 'sine'})],
});
// line 10: out to both whole cars behind the chart
const S10 = r2({
  cue: 'A gas car needs',
  a: T.aGas,
  b: T.high,
  scale: 0.15,
  // wide enough (66–69 m) that both cars sit wholly in frame over the chart, centred between them
  track: [
    {at: 0, value: 1},
    {at: 1.0, value: 0.5},
  ],
  cam: [key(0, EVF(40)), key(1.0, TWIN_C(66), {log: true}), key(len(T.aGas, T.high), TWIN_C(69), {ease: 'sine'})],
});
// lines 11a–b: wide, both past 100; the 1,400 lb card
const S11 = r2({
  cue: 'At high speed',
  a: T.high,
  b: T.andThe,
  scale: 0.25,
  track: 0.5,
  cam: [key(0, TWIN_C(69)), key(1.0, WIDE_L(96), {log: true}), key(len(T.high, T.andThe), WIDE_L(98), {ease: 'sine'})],
});
const S12 = r2({
  cue: 'and the electric car had',
  a: T.andThe,
  b: T.porsche,
  scale: 0.4,
  track: 0.5,
  cam: [key(0, WIDE_L(98)), key(len(T.andThe, T.porsche), WIDE_L(104), {ease: 'sine'})],
});

// overlays on R2
// 3b: the EV's speed climbing to ≈ 30 while its push holds (a counter, so no leader crosses the gas lane)
const ev30At = raceTimeTo(S2.p, 'ev', 30, FPS) ?? 5;
const evBox30: OverlaySpec = {
  type: 'counter',
  from: 0,
  to: 30,
  label: 'mph',
  sub: 'Electric car',
  subPlace: 'above',
  x: 0.111,
  y: 0.43,
  at: r(T.stop, T.motor) + 0.15,
  duration: ev30At - (r(T.stop, T.motor) + 0.15), // the model's flat push: speed rises linearly to the knee
  until: len(T.motor, T.gasEngine) - 0.3,
} as OverlaySpec;
const GB4_IN = r(T.soIt, T.gasEngine) - 1.0;
const GB4_OUT = len(T.gasEngine, T.testers) - 0.6;
const gasBox4: OverlaySpec = {
  type: 'detail',
  content: 'gas-dashboard',
  anchor: 'cluster:gas',
  side: 'right',
  size: 220,
  top: 870,
  rpm: readKeys(S3.p, 'gas', GB4_IN, GB4_OUT, 'rpm', 0.1),
  gear: gearKeys(S3.p, GB4_IN, GB4_OUT),
  speed: readKeys(S3.p, 'gas', GB4_IN, GB4_OUT, 'mph'),
  at: GB4_IN,
  until: GB4_OUT,
} as OverlaySpec;
const SW_IN = 0.3;
const stopwatch: OverlaySpec = {
  type: 'counter',
  from: Math.floor((raceClockAt(S4.p, SW_IN) ?? 3) * 10) / 10,
  rows: [
    {label: 'Electric', to: 3.3, stopAt: (raceTimeTo(S4.p, 'ev', 60, FPS) ?? 1.9) - SW_IN},
    {label: 'Gas', to: 3.6, stopAt: (raceTimeTo(S4.p, 'gas', 60, FPS) ?? 5.3) - SW_IN},
  ],
  decimals: 1,
  label: 's',
  sub: '0–60 mph',
  subPlace: 'above',
  x: 0.111,
  y: 0.43,
  at: SW_IN,
  until: len(T.testers, T.awd) - 0.2,
} as OverlaySpec;
const EB9_IN = 0.8;
const EB9_OUT = len(T.above, T.aGas) - 0.3;
const evBox9: OverlaySpec = {
  type: 'detail',
  content: 'ev-dashboard',
  anchor: 'cluster:ev',
  side: 'left',
  size: 300,
  meter: true,
  powerColor: 'orange',
  power: 0.92, // above the knee the model's power is constant: the meter sits full and still
  speed: readKeys(S9.p, 'ev', EB9_IN, EB9_OUT, 'mph'),
  at: EB9_IN,
  until: EB9_OUT,
} as OverlaySpec;
const chart: OverlaySpec = {
  type: 'chart',
  // below the lifted cars, above the captions (one card)
  left: 120,
  top: 640,
  width: 600,
  height: 400,
  line: [
    {at: 0.2, value: 0},
    {at: 0.9, value: 1},
  ],
  humps: [
    {at: 1.0, value: 0},
    {at: r(T.high - 1.3, T.aGas), value: 1}, // TIMED: all ten by "close to that"
  ],
  at: 0.1,
  until: len(T.aGas, T.high) - 0.15,
} as OverlaySpec;
const lb1400: OverlaySpec = {
  type: 'counter',
  from: 0,
  to: 1400,
  label: 'lb',
  sub: 'Heavier by about',
  subPlace: 'above',
  x: 0.111,
  y: 0.16,
  duration: r(T.pounds, T.n1400 - 0.3),
  at: r(T.n1400 - 0.3, T.andThe),
  until: len(T.andThe, T.porsche) - 0.2,
} as OverlaySpec;

// ---------------------------------------------------------------- U: the two-speed unit (line 12)

const s13: SceneSpec = {
  scene: 'drive-unit',
  cue: 'Porsche gave its',
  props: {
    ...SLIDE,
    mood: 'day',
    drift: 0,
    camera: {from: DU.unit},
    cameraKeys: [
      key(0, DU.unit),
      key(r(T.one, T.porsche) - 0.6, DU.unit),
      key(r(T.one, T.porsche) + 0.3, DU.gears, {ease: 'inOut'}),
    ],
    spin: [{at: 0, speed: 0.1}],
    gear: [
      {at: 0, gear: 1},
      {at: r(T.highSpeed, T.porsche), gear: 2}, // TIMED: "high speed"
    ],
    outlineAt: [r(T.twoGears, T.porsche)],
    litAt: r(T.twoGears, T.porsche) + 0.5,
    path: {at: r(T.twoGears, T.porsche) + 0.4},
    pushArrow: {
      length: [
        {at: 0, value: 0},
        {at: r(T.twoGears, T.porsche) + 0.6, value: 0},
        {at: r(T.twoGears, T.porsche) + 1.2, value: 1},
        {at: r(T.highSpeed, T.porsche), value: 1},
        {at: r(T.highSpeed, T.porsche) + 0.4, value: 0.55},
      ],
    },
  },
  overlays: [
    {
      type: 'callout',
      title: 'First gear',
      size: 1.3, // 800 weight and a 2.5 px leader: reads on a phone over the sky
      anchor: 'stage:1',
      dx: -160,
      dy: -120,
      at: r(T.twoGears, T.porsche) + 0.9,
      until: r(T.highSpeed, T.porsche) - 0.4,
    },
    {
      type: 'callout',
      title: 'Second gear',
      size: 1.3,
      anchor: 'stage:2',
      dx: -300,
      dy: -440,
      at: r(T.highSpeed, T.porsche) + 0.2,
      until: len(T.porsche, T.next) - 0.1,
    },
  ] as OverlaySpec[],
};

// ---------------------------------------------------------------- R3: the restage, back to frame 0 (line 13)

const STAGED = [{at: -10, prestage: true, stage: true}];
const s14: SceneSpec = {
  scene: 'race-slice',
  cue: 'Next time an',
  props: {
    ...R_BASE,
    ...SLIDE,
    camera: {from: WIDE},
    cameraKeys: [key(0, WIDE), key(len(T.next, T.watch), at(WIDE, 79), {ease: 'sine'})],
    ev: {restage: {at: 0.2, from: 3, dur: 1.6}},
    gas: {restage: {at: 0.2, from: 3, dur: 1.6}, driverSide: GAS_SIDE},
    lights: [{at: -10}, {at: 1.3, prestage: true}, {at: 1.8, prestage: true, stage: true}],
  },
};
const s15: SceneSpec = {
  scene: 'race-slice',
  cue: 'watch how the',
  props: {
    ...R_BASE,
    ...CONTINUE,
    cameraKeys: [key(0, at(WIDE, 79)), key(r(T.end, T.watch) - 0.9, LINE, {log: true})],
    gas: {driverSide: GAS_SIDE},
    // the ambers light in the hold, as on frame 0 (its pro tree before the green)
    lights: [...STAGED, {at: r(T.end, T.watch) + 0.2, prestage: true, stage: true, amber: true}],
  },
};

// ---------------------------------------------------------------- sound

// volume = (voice −21.9 − dB under) − file LUFS (measured 2026-10-25). Volumes ≤ 0.
const MUSIC_LEVEL = -18.1; // (−21.88 − 12) − (−15.75)
const V8_IDLE = {type: 'sfx', name: 'v8-idle', volume: -19.4, loop: true} as const; // −20.4 LUFS, 18 under
const V8_RUN = {type: 'sfx', name: 'v8-run', volume: -19.4, loop: true} as const; // −20.4, 18 under
const V8_REVS = {type: 'sfx', name: 'v8-revs', volume: -15.9} as const; // −20.0, 14 under
const ROAR = {type: 'sfx', name: 'roar', volume: -17.4, loop: true} as const; // −24.45, 20 under
const ROAR_RISE = {type: 'sfx', name: 'roar-rise', volume: -14.4} as const; // −22.4, 15 under
const CLUNK = {type: 'sfx', name: 'shift-clunk', volume: -6} as const; // 0.34 s, peak −12.2 dBTP
const CLUNK_EV = {type: 'sfx', name: 'shift-clunk-ev', volume: -2} as const; // 0.34 s, peak −18.7 dBTP

const clunks = (p: Partial<RaceSliceSceneProps>, d: number): OverlaySpec[] =>
  shiftTimes(p, d).map((t) => ({...CLUNK, at: t}));
const g2 = r(T.stop, T.motor);

const scenes: SceneSpec[] = [
  {
    ...s1,
    overlays: [
      ...(s1.overlays ?? []),
      {...V8_IDLE, at: 0, until: 0.45, fade: 0.1},
      {...V8_REVS, at: 0.35},
      {...ROAR_RISE, at: 0.4},
      {...V8_RUN, at: 2.0, fade: 0.4, until: 'An electric motor'},
    ],
  },
  {
    ...S2.spec,
    overlays: [
      evBox30,
      {...V8_IDLE, at: 0, until: g2 + 0.15, fade: 0.1},
      {...V8_REVS, at: g2},
      {...ROAR_RISE, at: g2 + 0.1},
      {...V8_RUN, at: g2 + 1.5, fade: 0.5, until: 'Porsche gave its'},
      {...ROAR, at: g2 + 6, fade: 1.0, until: 'Porsche gave its'},
      ...clunks(S2.p, len(T.motor, T.gasEngine)),
    ],
  },
  {...S3.spec, overlays: [gasBox4, ...clunks(S3.p, len(T.gasEngine, T.testers))]},
  {...S4.spec, overlays: [stopwatch, ...clunks(S4.p, len(T.testers, T.awd))]},
  {...S5.spec, overlays: clunks(S5.p, len(T.awd, T.past))},
  S6.spec, // the EV's rear unit: no clunks in this frame
  {...S7.spec, overlays: clunks(S7.p, len(T.soThe, T.butEach))},
  // no tach box here: in the gearbox close-up it covered the top pairs; the lit pair and the path carry the change
  {...S8.spec, overlays: clunks(S8.p, len(T.butEach, T.above))},
  {...S9.spec, overlays: [evBox9]},
  {...S10.spec, overlays: [chart]},
  {...S11.spec, overlays: clunks(S11.p, len(T.high, T.andThe))},
  {...S12.spec, overlays: [lb1400]},
  {...s13, overlays: [...(s13.overlays ?? []), {...CLUNK_EV, at: r(T.highSpeed, T.porsche) + 0.1}]},
  {...s14, overlays: [{...V8_IDLE, at: 0, fade: 0.6}]}, // idles to the last frame, as on frame 0
  s15,
];

export const spec: VideoSpec = {
  watermark: null,
  tail: TAIL,
  // Cover still (`yarn cover ev-acceleration`): both coupes mid-run near 100 mph, text in the sky band.
  cover: {
    text: 'Who wins\nto 100?',
    size: 140,
    scene: 'race-slice',
    camera: {look: [TWIN.look[0], TWIN.look[1] + 2.2, TWIN.look[2]], distance: TWIN.distance * 0.9}, // cars lower, mid-frame
    at: gasHit + 0.2,
    props: R1,
  },
  music: {level: MUSIC_LEVEL, duckDb: 0, startAt: 0, fadeIn: 1.5},
  scenes,
};
