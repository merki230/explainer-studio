import {
  cableCloseFraming,
  chargeBayState,
  chargeFramings,
  chargeLaneClear,
  type ChargeBaySpec,
  type ChargeGhost,
  type ChargeSliceSceneProps,
  type ChargeVisit,
  type SocCurve,
} from '../../scenes/ChargeSliceScene';
import type {ChargeDriver, ChargeLeave} from '../../three/real/chargeMotion';
import {CHARGE, RACE} from '../../theme';
import type {OverlaySpec, SceneSpec, VideoSpec} from '../../types';

/**
 * No. 010 · The Charging Station, draft 2 ("the screen tells its own story"), from `av-script.md` § Draft 2
 * (owner decisions D1–D4, brand-director D5), timed to the directed take (transcript.json, 74.24 s of speech).
 *
 * Locations (one-way camera):
 *  - C `charge-slice` China. Visit 1 (lines 1–3): the BYD-like sedan reverses into the top bay, its driver plugs in;
 *    the Tesla-like crossover charges below while its driver waits on the curb; a time-lapse (clock, sun, clouds)
 *    while the BYD finishes and leaves, and a second BYD reverses in and plugs in. A hard cut, then visit 2 (lines 4–10, the
 *    replay): `cables` → the dive (`teslaCharge` → `cableClose`) → [the room and back] → the pull-out (`byd` →
 *    `wide`). Visit 4 (line 14b): a new BYD arriving, landing exactly on frame 0's state.
 *  - R `section-room` (line 6b): the living room's extension-cord corner (D2 a).
 *  - U `charge-slice` US (lines 11–14a): a Tesla reverses in and plugs in; the top bay empty with the BYD's ghost;
 *    a time-lapse to 80 %.
 *
 * State: every bay (its cars, drivers, latches, current), every charge clock and time-lapse is written ONCE in
 * video seconds and shifted into each scene (charge-slice accepts keys outside the scene), so every cut carries
 * the cars, drivers, plugs, charge and clock exactly. The loop scene uses visit 1's state shifted so that its
 * last frame is the frame just before frame 0.
 *
 * Orange (the system only): the bold pulses in the cables and HV leads (one ≈ 250 A, 🎭), the breathing heat, the
 * cells' sweep, the cord's glow, the chart's curves. Nothing flows on frame 0 or the last frame.
 *
 * Illustrative (🎭, disclosed): the drivers and what they do, the BYDs cycling, the time-lapse, the replay, the
 * compressed clocks, the pulse scale, the 2,500 A what-if, the generic cars and chargers, the ghost, the room,
 * the chart shapes, the story time.
 */

const FPS = 30;

/** Cue and word times, video seconds (transcript.json). TIMED. */
const T = {
  hook: 0, // In China (0.21)
  charge: 2.96,
  bydSays: 6.24, // BYD says
  minutes: 7.6,
  tesla: 10.36, // A Tesla Model
  eighty: 14.88,
  gap: 16.08, // That gap comes (the hard cut, the replay)
  amps: 17.36,
  power: 19.04, // Power is volts times amps
  timesAmps: 20.12,
  runs: 21.16, // and a Model Y runs
  v400: 22.88,
  soFaster: 24.24, // so charging faster
  faster: 24.92,
  moreAmps: 26.28,
  heatLine: 27.08, // More amps means
  heat: 28.44,
  cable: 28.88,
  battery: 29.76,
  cord: 30.32, // like an extension (R)
  spaceHeater: 31.76,
  plugged: 32.28,
  protect: 33.36, // To protect the
  slows: 35.6,
  fills: 36.84,
  bydGets: 37.6, // The BYD gets
  thousand: 39.68,
  soIt: 40.8, // so it gets
  lessThan: 42.44,
  halfAmps: 43.28,
  evenSo: 44.32, // Even so
  pushUp: 47.0,
  ampsEnd: 48.64,
  china: 50.0, // That's China
  us: 51.48, // Here in the (U)
  usWord: 51.84,
  doesnt: 52.56, // BYD doesn't sell
  federal: 55.32, // And a federal
  connected: 57.24,
  fastest: 60.84, // Our fastest chargers
  kw400: 62.84,
  modelYCan: 65.04, // and a Model Y can
  kw250: 66.8,
  stops: 68.32, // If your charging
  halfHour: 70.64,
  would: 71.68, // would BYD's five (C, the loop)
  last: 74.24, // "much?" ends
};
const TAIL = 1.5;

const F = (t: number) => Math.round(t * FPS);
/** The video's end, exactly as the timeline cuts it (frame 0's twin is the frame after the last). */
const END = F(T.last + TAIL) / FPS;
/** A scene's length (s) from its cue to the next, in whole frames as Explainer cuts them. */
const len = (a: number, b: number) => (F(b) - F(a)) / FPS;
const r = (abs: number, start: number) => Math.round((abs - start) * 100) / 100;
const round = (x: number, n = 4) => Math.round(x * 10 ** n) / 10 ** n;

// eslint-disable-next-line @remotion/non-pure-animation
const CONTINUE = {transition: 'continue'} as const;
// eslint-disable-next-line @remotion/non-pure-animation
const SLIDE = {transition: 'slide'} as const;

// ---------------------------------------------------------------- framings

/** The lane gap and the canopy's clearance (as draft 1: both cars fit between the title block and the captions). */
const GAP = 3.7;
const CANOPY_H = 2.75;
/** The bottom bay's ground block, deep, so the lower third isn't empty (builder: ≈ 5 with the tall framings). */
const GROUND = 5;
const FR = chargeFramings(GAP);

type V3 = [number, number, number];
type Framing = {look: V3; distance: number};
const at = (f: Framing, distance: number): Framing => ({look: f.look, distance});
const shift = (f: Framing, d: V3, distance = f.distance): Framing => ({
  look: [f.look[0] + d[0], f.look[1] + d[1], f.look[2] + d[2]],
  distance,
});

/** Frame 0 and the loop: both bays between the title block and the captions. */
/** Frame 0 and the loop (the builder's stack, pulled back so both bays sit between the title block and the captions). */
const TWIN = shift(FR.stack, [0, -1.1, 0], 42);
/** Both rear halves, pulled back so the statement fits in the sky band above the top car. */
const CABLES = shift(FR.cables, [0, -0.57, 0], 34.7);
const TESLA = shift(FR.teslaCharge, [0, -0.05, 0], 8.4);
/** The BYD's charging side with its driver leaning by the front door (in frame). */
const BYD = shift(FR.byd, [-0.7, -0.15, 0], 10.6);
const WIDE = shift(FR.wide, [0, -2.6, 0], 58);
/** The empty bay, the ghost above the caption band. */
const EMPTY = shift(FR.emptyBay, [0.4, -1.0, 0], 21); // +0.4 x: the US driver at the port clear of the right edge (reviewer, preview 5)
const USCH = shift(FR.usCharger, [0, -0.35, 0], 9.6);

type CP = Partial<ChargeSliceSceneProps>;
const BASE: CP = {
  mood: 'day',
  drift: 0,
  laneGap: GAP,
  canopyHeight: CANOPY_H,
  groundDepth: GROUND,
  pulse: 'bold',
  cells: 'sweep',
};
/** The Tesla cable's cut-away, its cross-section filling the frame (the dive's end, scene 6). */
const CLOSE = cableCloseFraming(BASE, 'bottom', 2.4);

// ---------------------------------------------------------------- a path on the video clock

type Ease = 'lin' | 'inOut' | 'in' | 'out';
const EASE: Record<Ease, (u: number) => number> = {
  lin: (u) => u,
  inOut: (u) => (u < 0.5 ? 4 * u * u * u : 1 - (-2 * u + 2) ** 3 / 2),
  in: (u) => 1 - Math.cos((u * Math.PI) / 2),
  out: (u) => Math.sin((u * Math.PI) / 2),
};
/** A camera path: framings at video times, eased into each key; `log` dollies the distance on a log scale. */
type PathKey = {t: number; f: Framing; ease?: Ease; log?: boolean};
const framingOnPath = (path: PathKey[], v: number): Framing => {
  if (v <= path[0].t) return path[0].f;
  for (let i = 1; i < path.length; i++) {
    const a = path[i - 1];
    const b = path[i];
    if (v < b.t) {
      const u = EASE[b.ease ?? 'lin']((v - a.t) / (b.t - a.t));
      const distance = b.log
        ? Math.exp(Math.log(a.f.distance) + (Math.log(b.f.distance) - Math.log(a.f.distance)) * u)
        : a.f.distance + (b.f.distance - a.f.distance) * u;
      const w = b.log && Math.abs(b.f.distance - a.f.distance) > 1e-6 ? (distance - a.f.distance) / (b.f.distance - a.f.distance) : u;
      return {look: a.f.look.map((x, k) => x + (b.f.look[k] - x) * w) as V3, distance};
    }
  }
  return path[path.length - 1].f;
};
/** A scene's camera keys sampled from a path every 2 frames (so moves run straight through the cuts). */
const camKeys = (path: PathKey[], a: number, b: number) => {
  const d = len(a, b);
  const out: {at: number; look: V3; distance: number}[] = [];
  for (let k = 0; k * 2 <= F(b) - F(a); k++) {
    const s = Math.min(d, (k * 2) / FPS);
    const f = framingOnPath(path, F(a) / FPS + s);
    out.push({at: round(s, 3), look: f.look.map((x) => round(x)) as V3, distance: round(f.distance)});
  }
  return out;
};

// ---------------------------------------------------------------- shifting video-time state into a scene

type VKeys = [number, number][];
const keysAt = (k: VKeys, d: number) => k.map(([v, x]) => ({at: round(v - d, 3), value: round(x, 3)}));
const linAt = (keys: VKeys, v: number) => {
  if (v <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++)
    if (v < keys[i][0]) return keys[i - 1][1] + ((keys[i][1] - keys[i - 1][1]) * (v - keys[i - 1][0])) / (keys[i][0] - keys[i - 1][0]);
  return keys[keys.length - 1][1];
};
const sh = (x: number | null | undefined, d: number) => (x == null ? x : round(x - d, 3));
const shDriver = (dr: ChargeDriver | 'auto' | false | undefined, d: number) =>
  dr && dr !== 'auto' ? {...dr, keys: dr.keys.map((k) => ({...k, at: round(k.at - d, 3)}))} : dr;
const shVisit = (v: ChargeVisit, d: number): ChargeVisit => ({
  ...v,
  ...(v.arrive ? {arrive: {...v.arrive, at: round(v.arrive.at - d, 3)}} : {}),
  ...(v.leave ? {leave: {...v.leave, at: round(v.leave.at - d, 3)}} : {}),
  ...(v.driver !== undefined ? {driver: shDriver(v.driver, d)} : {}),
  ...(v.plug !== undefined ? {plug: sh(v.plug, d)} : {}),
  ...(v.unplug !== undefined ? {unplug: sh(v.unplug, d)} : {}),
});

/** A bay in video time: keyed values as video-time pairs. */
type VBay = Omit<ChargeBaySpec, 'amps' | 'heat' | 'spread' | 'packHeat'> & {amps?: VKeys; heat?: VKeys; spread?: VKeys; packHeat?: VKeys};
const shBay = (b: VBay, d: number): ChargeBaySpec => ({
  ...(b as ChargeBaySpec),
  ...(b.amps ? {amps: keysAt(b.amps, d)} : {}),
  ...(b.heat ? {heat: keysAt(b.heat, d)} : {}),
  ...(b.spread ? {spread: keysAt(b.spread, d)} : {}),
  ...(b.packHeat ? {packHeat: keysAt(b.packHeat, d)} : {}),
  ...(b.arrive ? {arrive: {...b.arrive, at: round(b.arrive.at - d, 3)}} : {}),
  ...(b.leave ? {leave: {...b.leave, at: round(b.leave.at - d, 3)}} : {}),
  ...(b.driver !== undefined ? {driver: shDriver(b.driver, d)} : {}),
  ...(b.visits ? {visits: b.visits.map((v) => shVisit(v, d))} : {}),
  ...(b.surge ? {surge: b.surge.map((s) => round(s - d, 3))} : {}),
});

/** One location visit's state in video time. */
type Visit = {
  region?: 'china' | 'us';
  clock: VKeys;
  timelapse?: VKeys;
  top?: VBay | false;
  bottom?: VBay;
  ghost?: ChargeGhost;
};

/**
 * One charge-slice scene from a visit: its state shifted into the scene and its camera sampled from the path.
 * `base` maps the visit's clock onto the video (the loop scene replays visit 1 ending at frame 0).
 */
const charge = (o: {a: number; b: number; visit: Visit; path: PathKey[]; base?: number; extra?: Record<string, unknown>}) => {
  const d = F(o.a) / FPS - (o.base ?? 0);
  const v = o.visit;
  return {
    ...BASE,
    ...(v.region ? {region: v.region} : {}),
    clock: keysAt(v.clock, d),
    ...(v.timelapse ? {timelapse: {minutes: keysAt(v.timelapse, d)}} : {}),
    ...(v.top === false ? {top: {car: false}} : v.top ? {top: shBay(v.top, d)} : {}),
    ...(v.bottom ? {bottom: shBay(v.bottom, d)} : {}),
    ...(v.ghost
      ? {ghost: {...v.ghost, at: round(v.ghost.at - d, 3), ...(v.ghost.fadeAt !== undefined ? {fadeAt: round(v.ghost.fadeAt - d, 3)} : {})}}
      : {}),
    cameraKeys: camKeys(o.path, o.a, o.b),
    ...o.extra,
  } as CP & Record<string, unknown>;
};

// ---------------------------------------------------------------- C, visit 1 (lines 1–3; the loop replays it)

/** The BYD's driver latches at 6.2 s (he gets out at 1.3; the walk round to the charger takes ≈ 4 s at 1.5×). */
const BYD1_LATCH = 6.2;
const BYD1_UNPLUG = 8.1;
/** The counter and the time-lapse start as the BYD's current starts. */
const C1_IN = 6.5;
const BYD_DONE = 7.9; // the BYD's row stops at 5 min, just after "five minutes"
const TESLA_DONE = 15.3; // just after "eighty percent" (the Tesla's row stops at 30 min)
const CLOCK_1: VKeys = [
  [0, 0],
  [C1_IN, 0],
  [BYD_DONE, 5],
  [TESLA_DONE, 30],
];
/** The Tesla's taper (the chart's points: kW at ≈ 400 V → A), on the visit's clock. */
const TESLA_KW: VKeys = [
  [0, 250],
  [3, 250],
  [8, 190],
  [14, 135],
  [20, 95],
  [26, 62],
  [31, 42],
];
const BYD_KW: VKeys = [
  [0, 1002],
  [1, 767],
  [1.8, 633],
  [3, 633],
  [4.9, 463],
];
/** Video time at a visit-1 clock minute. */
const v1At = (min: number) => (min <= 5 ? C1_IN + ((BYD_DONE - C1_IN) * min) / 5 : BYD_DONE + ((TESLA_DONE - BYD_DONE) * (min - 5)) / 25);

/** Where BYD 1's driver leans (feet, bay frame): back by the rear corner, so his head clears the counter card (right of it). */
const LEAN_BYD1: [number, number] = [2.15, 1.32];
/** BYD 1's departure: back in and out of the lane (one lane: BYD 2 waits for it to clear). */
const byd1Leave: ChargeLeave = {at: 11.65, for: 1.2}; // as early as its walk back from the holster allows (in the car by 11.6)
/**
 * BYD 1: reverses in, its driver plugs in, leans with the phone, unplugs at 5 minutes and drives off. One driver
 * has one `rate`: 2× keeps the departure inside the time-lapse (the arrival reads as a brisk walk).
 */
const BYD1: ChargeVisit = {
  // another car from the replay's (owner, preview 3): No. 007's petrol teal over the bay's slate sedan
  car: {paint: RACE.evPaint},
  arrive: {at: 1.2, from: 6, for: 2.5}, // 1.4 m short and rolling on frame 0
  leave: byd1Leave,
  driver: {
    look: 'b',
    rate: 2,
    keys: [
      {at: 1.3, do: 'exit'},
      {at: BYD1_LATCH, do: 'plug'},
      {at: 6.6, do: 'lean', to: LEAN_BYD1},
      {at: 6.9, do: 'phone'},
      {at: BYD1_UNPLUG, do: 'unplug'},
      {at: 10.95, do: 'enter'},
    ],
  },
  socMax: 70,
};
/**
 * BYD 2 reverses in from the left as soon as BYD 1 has driven out that way: its reverse-in starts 0.2 s before the lane
 * is clear, which is about when it reaches the frame edge (at +0.3 the two overlap there on frames 373–377). It is still
 * charging at the cut (the replay picks it up).
 */
const B2_STOP = round(chargeLaneClear(byd1Leave) + 0.7, 2);
/**
 * Its driver gets out right after the stop and walks door → cabinet → port, latching 0.38 s before the cut so the
 * current is visibly flowing by it (owner, preview 5: the old quick driver, ≈ 20×, read as a jump; one lane leaves
 * no room for 1×). He stays at the port: no unplug and no leave in visit 1. The unplug key sits off screen (1 s past
 * the cut, after the visit's last scene) only so 'span' has a session end: the cells climb at about BYD 1's
 * time-lapse pace, 10 → ≈ 28 % at the cut, so the replay's rewind drains them as before.
 */
const B2_LATCH = round(T.gap - 0.38, 2);
const B2_PLUG = round(B2_LATCH - B2_STOP, 2);
const B2_UNPLUG_OFF = round(T.gap + 1 - B2_STOP, 2);
/**
 * One rate that fits exit (1.3 s) + the walk to the cabinet + lift (0.65) + the walk to the port + insert (0.4), ≈ 6.97 s
 * at 1× on this bay (`autoDriver`'s `nIn`), between the exit key and the latch: ≈ 3.3× (BYD 1 runs at 2×).
 */
const B2_RATE = round(6.97 / (B2_PLUG - 0.1), 2);
const BYD2: ChargeVisit = {
  // the bay's default slate (`CHARGE.bydPaint`): the car the replay, the chart, the stack and the close-ups show
  arrive: {at: B2_STOP, from: 9, for: 0.9},
  plug: B2_STOP + B2_PLUG,
  unplug: B2_STOP + B2_UNPLUG_OFF,
  driver: {
    look: 'a',
    rate: B2_RATE,
    keys: [
      {at: B2_STOP + 0.1, do: 'exit'},
      {at: B2_LATCH, do: 'plug'},
      {at: B2_STOP + B2_UNPLUG_OFF, do: 'unplug'},
    ],
  },
  look: 'a',
  fill: 'span',
  socMax: 70,
};
const VISIT1: Visit = {
  clock: CLOCK_1,
  timelapse: [
    [C1_IN, 0],
    [TESLA_DONE, 30],
  ],
  top: {
    visits: [BYD1, BYD2],
    amps: [
      [0, 1000],
      ...[0.4, 1, 1.8, 3, 4.9].map((m): [number, number] => [round(v1At(m), 2), round(linAt(BYD_KW, m))]),
      [B2_STOP, 1000],
    ],
  },
  bottom: {
    // the Tesla's driver: carrying the plug to the port on frame 0, latched at 0.6, then to the curb with the phone
    driver: {
      look: 'a',
      start: 'door',
      keys: [
        {at: 0.6, do: 'plug'},
        {at: 5.6, do: 'sit'},
        {at: 6.0, do: 'phone'},
        {at: 11.0, do: 'glance', to: 'clock', hold: 1.2},
        {at: 13.3, do: 'glance', to: 'car', hold: 1.0},
        {at: 15.5, do: 'stand'},
      ],
    },
    // the charger starts on "charge" (the handshake), then tapers on the clock
    amps: [
      [T.charge, 0],
      [T.charge + 0.3, 625],
      ...[0.5, 3, 8, 14, 20, 26, 30].map((m): [number, number] => [round(v1At(m), 2), round(linAt(TESLA_KW, m) * 2.5)]),
    ],
  },
};

// ---------------------------------------------------------------- C, visit 2 (the replay, lines 4–10)

/**
 * The replay is one continuous shot (owner, preview 4): the plugs stay latched across the cut (both latches are
 * visit 1's, so the current never drops and no contactor sounds), and over the first `RW` s the station's time runs
 * back: the clock hands and the time-lapse 30 → 0 min, the sun and clouds with them, both packs draining to 10 %,
 * the Tesla's current climbing back up its taper to 625 A. Then charging starts again.
 */
const RW = 0.6;
/** The BYD's driver latches exactly when BYD 2's did in visit 1 (standing at the port at the cut, as there). */
const LATCH_2 = B2_LATCH;
/**
 * The charge clock (minutes from where each session's current first flows, which is before the cut): 0 → `C_OFF + RW`
 * over the rewind (the curves' drain), then `C_OFF` + seconds since the cut (so the curves keep their video timing).
 */
const C_OFF = 1;
const rwEase = (u: number) => (u < 0.5 ? 4 * u * u * u : 1 - (-2 * u + 2) ** 3 / 2);
const RW_STEPS = [0, 0.2, 0.4, 0.6, 0.8, 1];
const C2: VKeys = [
  ...RW_STEPS.map((u): [number, number] => [round(T.gap + RW * u, 3), round((C_OFF + RW) * rwEase(u), 4)]),
  [T.us, C_OFF + (T.us - T.gap)],
];
/** The time-lapse runs back with it: 30 story minutes → 0 (the clock hands, the sun, the clouds). */
const TL_2: VKeys = RW_STEPS.map((u): [number, number] => [round(T.gap + RW * u, 3), round(30 * (1 - rwEase(u)), 3)]);
/** A replay curve: the drain from `pre` % to 10 % over the rewind, then the curve (seconds since the cut), shifted onto the clock. */
const replayCurve = (pre: number, curve: SocCurve): SocCurve => [
  {at: 0, value: pre},
  {at: C_OFF + RW, value: 10},
  ...curve.filter((k) => k.at > RW).map((k) => ({at: k.at + C_OFF, value: k.value})),
];
const SOC_2_TESLA_RAW: SocCurve = [
  {at: 0, value: 10},
  {at: 5, value: 13},
  {at: 11, value: 18},
  {at: 14.2, value: 21},
  {at: 17.3, value: 24}, // line 7 starts: the cells fill (compressed again)…
  {at: 18.5, value: 40},
  {at: 19.5, value: 52}, // … and slow from "slows down"
  {at: 20.5, value: 60},
  {at: 21.5, value: 65},
  {at: 28, value: 72},
  {at: 36, value: 77},
];
const SOC_2_BYD_RAW: SocCurve = [
  {at: 0, value: 10},
  {at: 21.5, value: 30},
  {at: 24.7, value: 38},
  {at: 28, value: 46},
  {at: 31, value: 58},
  {at: 33.3, value: 70}, // full on ≈ 49.4 s (at 1,500 A), the contactor opens
];
/** BYD 2's charge at the cut in visit 1 (read from P3's own state below); the Tesla's is 80 % (79.9: under socMax, so no auto-stop). */
const SOC_2_TESLA = replayCurve(79.9, SOC_2_TESLA_RAW);
const BYD_AT_GAP = round(
  chargeBayState(
    {...charge({a: T.tesla, b: T.gap, visit: VISIT1, path: [{t: 0, f: TWIN}]}), durationInFrames: F(T.gap) - F(T.tesla)},
    'top',
    len(T.tesla, T.gap),
    FPS,
  ).soc * 100,
  1,
);
const SOC_2_BYD = replayCurve(BYD_AT_GAP, SOC_2_BYD_RAW);
/** Visit 1's Tesla driver, continued: mid-way up from the curb at the cut, as in visit 1. */
const TESLA_DRIVER_1 = (VISIT1.bottom?.driver as ChargeDriver).keys;
/** Where the BYD's driver leans in the `byd` shot: by the front door, clear of the pack's rear and the cable. */
const LEAN_BYD: [number, number] = [0.15, 1.25];
const VISIT2: Visit = {
  clock: C2,
  timelapse: TL_2,
  top: {
    soc: SOC_2_BYD,
    socMax: 70,
    // BYD 2's driver (look 'a'), at the port at the cut
    driver: {
      look: 'a',
      start: 'port',
      keys: [
        {at: LATCH_2, do: 'plug'},
        {at: T.gap, do: 'walkTo', to: 'port'}, // a no-op that holds him at the port until the cut (as in visit 1)
        {at: 17.2, do: 'lean', to: LEAN_BYD},
        {at: 18.2, do: 'phone'},
        {at: 40.2, do: 'glance', to: 'cabinet', hold: 1.0},
        // the phone away, off the car, a look at the cabinet: real moves for the pull-out's close pass (owner,
        // preview 5: the hip sway it replaced read as sliding)
        {at: 43.6, do: 'pocket'},
        {at: 44.0, do: 'stand'},
        {at: 44.3, do: 'glance', to: 'cabinet', hold: 1.0},
        {at: 49.7, do: 'unplug'},
      ],
    },
    amps: [
      [0, 1000],
      [T.pushUp, 1000],
      [T.pushUp + 0.8, 1500], // "up to fifteen hundred amps" (🟡, reportedly)
    ],
    surge: [T.amps, T.timesAmps],
  },
  bottom: {
    soc: SOC_2_TESLA,
    driver: {
      look: 'a',
      start: 'door',
      keys: [...TESLA_DRIVER_1, {at: 19.8, do: 'sit'}, {at: 20.3, do: 'phone'}],
    },
    amps: [
      // before the cut, as visit 1 ends: latched (from 0.6 s), the contactor open since 80 % (≈ 15.7 s)
      [0, 105],
      [TESLA_DONE, 105],
      [TESLA_DONE + 0.4, 0],
      [T.gap, 0],
      [T.gap + RW, 625], // the rewind: back up the taper
      [T.faster, 625],
      [T.moreAmps, 2500], // 🎭 the what-if: the BYD's 1,000 kW at 400 V
      [T.protect, 2500],
      [T.protect + 0.5, 625], // back from the room: the real draw
      [T.slows, 625],
      [T.slows + 1.2, 250], // the taper: 3 pulses → 1
    ],
    surge: [T.amps, T.timesAmps],
  },
};
/** The Tesla's heat in lines 5b–6a, by hand, so the glow lands on "heat", "cable" and "battery". */
const HEAT_LOW = 0.175;
const HEAT_2: VKeys = [
  [T.runs, HEAT_LOW],
  [T.moreAmps + 0.1, 0.3],
  [T.heat, 0.3],
  [T.heat + 0.7, 1],
];
const SPREAD_2: VKeys = [
  [T.gap, 0.3],
  [T.cable - 0.1, 0.3],
  [T.cable + 0.6, 1],
];
const PACK_2: VKeys = [
  [T.runs, 0],
  [T.battery - 0.1, 0],
  [T.battery + 0.5, 0.85],
];
const withTesla = (b: Partial<VBay>): Visit => ({...VISIT2, bottom: {...VISIT2.bottom, ...b}});

// ---------------------------------------------------------------- U, the US (lines 11–14a)

const US_STOP = 52.8;
const US_LATCH = 58.0;
const VISIT3: Visit = {
  region: 'us',
  clock: [
    [US_LATCH + 0.2, 0],
    [T.stops + 0.3, 4],
    [T.halfHour, 30], // the time-lapse: 80 % on "half an hour"
  ],
  timelapse: [
    [T.stops + 0.3, 0],
    [T.halfHour, 30],
  ],
  top: false,
  bottom: {
    arrive: {at: US_STOP, from: 8, for: 2.4}, // 2.4 m out and reversing as the slide lands
    driver: {
      look: 'a',
      rate: 1.4,
      keys: [
        {at: US_STOP + 0.15, do: 'exit'},
        {at: US_LATCH, do: 'plug'},
        {at: 60.6, do: 'sit'},
        {at: 61.2, do: 'phone'},
        {at: 64.2, do: 'glance', to: 'car', hold: 1.0},
        {at: 69.4, do: 'glance', to: 'clock', hold: 1.0},
        {at: 71.2, do: 'stand'},
      ],
    },
    amps: [
      [0, 625],
      [T.stops + 0.3, 625],
      [T.halfHour - 0.2, 300],
    ],
  },
  ghost: {at: T.doesnt, drawFor: 0.8, fadeAt: 59.9, fadeFor: 0.7},
};

// ---------------------------------------------------------------- camera paths (video time)

/** The visible push on the twin (units/s): from frame 0, and again into the last frame at the same speed. */
const PUSH_1 = 0.1;
const PATH_1: PathKey[] = [
  {t: 0, f: TWIN},
  {t: T.gap, f: at(TWIN, TWIN.distance - PUSH_1 * T.gap)},
];
const PATH_2: PathKey[] = [
  {t: T.gap, f: PATH_1[PATH_1.length - 1].f}, // the twin's push, continued through the cut…
  {t: T.gap + 0.9, f: CABLES, ease: 'inOut', log: true}, // … gliding in to both rear halves over the rewind
  {t: T.runs, f: at(CABLES, 33.9)},
  {t: T.runs + 0.84, f: TESLA, ease: 'inOut', log: true}, // the dive, step 1: the port and the pack
  {t: T.soFaster, f: at(TESLA, 8.0)},
  {t: T.soFaster + 0.76, f: CLOSE, ease: 'inOut', log: true}, // step 2: into the cable's cut-away
  {t: T.cable, f: at(CLOSE, 2.2)},
  {t: T.cable + 0.72, f: at(TESLA, 7.9), ease: 'inOut', log: true}, // back out for "battery"
  {t: T.cord, f: at(TESLA, 7.6)},
  // (the room)
  {t: T.protect, f: at(TESLA, 7.6)},
  {t: T.bydGets, f: at(TESLA, 7.3)},
  {t: T.bydGets + 1.0, f: BYD, ease: 'inOut', log: true}, // the pull-out begins: out and up to the top bay
  {t: T.china, f: at(BYD, 11.4)},
  {t: T.china + 0.8, f: WIDE, ease: 'inOut', log: true},
  {t: T.us, f: at(WIDE, 59)},
];
const PATH_3: PathKey[] = [
  {t: T.us, f: TWIN},
  {t: T.federal, f: at(TWIN, 49)},
  {t: T.federal + 0.8, f: EMPTY, ease: 'inOut', log: true}, // the dive: the empty bay
  {t: T.fastest, f: at(EMPTY, 20.4)},
  {t: T.fastest + 0.8, f: USCH, ease: 'inOut', log: true}, // crane down to the crossover's charger
  {t: T.modelYCan, f: at(USCH, 9.3)},
  {t: T.modelYCan + 0.8, f: TESLA, ease: 'inOut', log: true}, // the end of the dive
  {t: T.stops, f: at(TESLA, 8.1)},
  {t: T.stops + 1.2, f: WIDE, ease: 'inOut', log: true}, // the pull-out
  {t: T.would, f: at(WIDE, 59)},
];
/** The loop: the twin pushing at frame 0's speed, landing on frame 0's framing one frame after the last. */
const PATH_4: PathKey[] = [
  {t: T.would, f: at(TWIN, TWIN.distance + PUSH_1 * (END - T.would))},
  {t: END, f: TWIN},
];

// ---------------------------------------------------------------- scene props

const P1 = charge({a: T.hook, b: T.bydSays, visit: VISIT1, path: PATH_1});
const P2 = charge({a: T.bydSays, b: T.tesla, visit: VISIT1, path: PATH_1, extra: CONTINUE});
const P3 = charge({a: T.tesla, b: T.gap, visit: VISIT1, path: PATH_1, extra: CONTINUE});

const P4 = charge({a: T.gap, b: T.runs, visit: withTesla({spread: SPREAD_2}), path: PATH_2, extra: CONTINUE});
const P5 = charge({a: T.runs, b: T.soFaster, visit: withTesla({heat: HEAT_2, spread: SPREAD_2, packHeat: [[0, 0]]}), path: PATH_2, extra: CONTINUE});
const P6 = charge({a: T.soFaster, b: T.heatLine, visit: withTesla({heat: HEAT_2, spread: SPREAD_2, packHeat: [[0, 0]]}), path: PATH_2, extra: CONTINUE});
const P7 = charge({a: T.heatLine, b: T.cord, visit: withTesla({heat: HEAT_2, spread: SPREAD_2, packHeat: PACK_2}), path: PATH_2, extra: CONTINUE});
const P9 = charge({a: T.protect, b: T.bydGets, visit: VISIT2, path: PATH_2, extra: SLIDE});
const P10 = charge({a: T.bydGets, b: T.soIt, visit: VISIT2, path: PATH_2, extra: CONTINUE});
const P11 = charge({a: T.soIt, b: T.evenSo, visit: VISIT2, path: PATH_2, extra: CONTINUE});
const P12 = charge({a: T.evenSo, b: T.china, visit: VISIT2, path: PATH_2, extra: CONTINUE});
const P13 = charge({a: T.china, b: T.us, visit: VISIT2, path: PATH_2, extra: CONTINUE});

const P14 = charge({a: T.us, b: T.federal, visit: VISIT3, path: PATH_3, extra: SLIDE});
const P15 = charge({a: T.federal, b: T.fastest, visit: VISIT3, path: PATH_3, extra: CONTINUE});
const P16 = charge({a: T.fastest, b: T.modelYCan, visit: VISIT3, path: PATH_3, extra: CONTINUE});
const P17 = charge({a: T.modelYCan, b: T.stops, visit: VISIT3, path: PATH_3, extra: CONTINUE});
const P18 = charge({a: T.stops, b: T.would, visit: VISIT3, path: PATH_3, extra: CONTINUE});

/** The loop: visit 1's state replayed so the last frame is the frame before frame 0. */
const P19 = charge({a: T.would, b: END, visit: VISIT1, path: PATH_4, base: END, extra: SLIDE});

// ---------------------------------------------------------------- R, the extension-cord corner (line 6b)

const R8 = {
  ...SLIDE,
  mood: 'day',
  cast: [null, null],
  camera: 'cord',
  push: 0.05,
  drift: 0,
  corner: {
    heaterAt: r(T.spaceHeater, T.cord) + 0.15,
    glow: [
      {at: 0, value: 0},
      {at: r(T.plugged, T.cord), value: 0},
      {at: r(T.plugged, T.cord) + 0.7, value: 1},
    ],
  },
};

// ---------------------------------------------------------------- sound

// volume = (voice −21.9 − dB under) − file LUFS (measured 2026-10-27). Volumes ≤ 0.
const CLOSE_SFX = {type: 'sfx', name: 'contactor-close', volume: -7.9} as const; // −29, 15 under
const OPEN_SFX = {type: 'sfx', name: 'contactor-open', volume: -5.9} as const; // −31, 15 under
const LATCH_IN = {type: 'sfx', name: 'latch-in', volume: -11.9} as const; // −26 (tooling default), 16 under
const LATCH_OUT = {type: 'sfx', name: 'latch-out', volume: -11.9} as const;
const FAN = {type: 'sfx', name: 'cabfan', volume: -13.5, loop: true} as const; // −30.4, 22 under
const PUMP = {type: 'sfx', name: 'pump', volume: -9.5, loop: true} as const; // −34.4, 22 under
const HEATER_CLICK = {type: 'sfx', name: 'heater-click', volume: -10.9} as const; // −28, 17 under
const HEATER_FAN = {type: 'sfx', name: 'heaterfan', volume: -13.4, loop: true} as const; // −32.5, 24 under
const BED = {type: 'sfx', name: 'station-bed', volume: -15.4, loop: true} as const; // −32.5, 26 under
// Music (take a, `music.txt`): our own bed from frame 0, 12 dB under the dry voice, no duck.
// level = (voice −21.9 − 12) − the file's −13.2 LUFS = −20.7.
const MUSIC = {level: -20.7, duckDb: 0, startAt: 0, fadeIn: 1.5} as const;

/** Contactor clunks where a bay's current starts or stops in a scene (scanned from the scene's own state). */
const contactors = (p: CP, a: number, b: number): OverlaySpec[] => {
  const q = {...p, durationInFrames: F(b) - F(a)} as CP;
  const out: OverlaySpec[] = [];
  for (const w of ['top', 'bottom'] as const) {
    let on = chargeBayState(q, w, 0, FPS).amps > 40;
    for (let f = 1; f < F(b) - F(a); f++) {
      const now = chargeBayState(q, w, f / FPS, FPS).amps > 40;
      if (now !== on) out.push({...(now ? CLOSE_SFX : OPEN_SFX), at: round(Math.max(0, f / FPS - 0.1), 2)} as OverlaySpec);
      on = now;
    }
  }
  return out;
};
/** Plug latches (video seconds) and where they fall: each scene takes its own. */
const LATCHES: [number, 'in' | 'out'][] = [
  [0.6, 'in'],
  [BYD1_LATCH, 'in'],
  [BYD1_UNPLUG, 'out'],
  [B2_LATCH, 'in'],
  [49.7, 'out'],
  [US_LATCH, 'in'],
];
const latchesIn = (a: number, b: number, base = 0): OverlaySpec[] =>
  LATCHES.map(([v, k]) => [v + base, k] as const)
    .filter(([v]) => v >= F(a) / FPS && v < F(b) / FPS)
    .map(([v, k]) => ({...(k === 'in' ? LATCH_IN : LATCH_OUT), at: round(v - F(a) / FPS, 2)}) as OverlaySpec);
/** `quiet`: no contactor clunks before this many seconds into the scene (the replay's rewind: nothing switches, time runs back). */
const sounds = (p: CP, a: number, b: number, quiet = 0) => [
  ...contactors(p, a, b).filter((o) => ((o as {at?: number}).at ?? 0) >= quiet),
  ...latchesIn(a, b),
];

// ---------------------------------------------------------------- overlays

const title: OverlaySpec = {
  type: 'title',
  at: 0,
  question: 'Why does EV charging take so long?', // D1
  number: 'No. 010',
  title: 'The Charging Station',
  time: '1:20 PM',
  until: len(T.hook, T.bydSays),
};

/** D5 (style guide v0.13 § 6): the two car tags; the roof anchors follow the BYD as it rolls in. */
const tags: OverlaySpec[] = [
  {type: 'tag', who: 'you', anchor: 'top:top', label: 'BYD', color: RACE.evPaint, outline: 'ink', side: 'left', ceiling: 485, at: 0.3, until: 3.8},
  {type: 'tag', who: 'you', anchor: 'top:bottom', label: 'TESLA', color: CHARGE.teslaPaint, outline: 'ink', side: 'left', below: 'under:top', ceiling: 485, at: 0.3, until: 3.8},
] as OverlaySpec[];

/** Lines 2–3: one clock, carried across the continue cut; the BYD's row stops at 5, the Tesla's at 30. */
const RACE_OUT = 12.7; // gone (8-frame fade) before BYD 2's roof reaches the card's left corner (frame 382)
const RACE_BACK = 14.75; // back once he has walked clear of it, toward the cabinet
const race: OverlaySpec = {
  type: 'counter',
  from: 0,
  rows: [
    {label: 'BYD · 70 %', to: 5, stopAt: r(BYD_DONE, C1_IN)},
    {label: 'TESLA · 80 %', to: 30, stopAt: r(TESLA_DONE, C1_IN)},
  ],
  label: 'min',
  sub: 'From 10 %',
  subPlace: 'above',
  x: 0.111,
  y: 0.156,
  at: r(C1_IN, T.bydSays),
  carry: true,
  // it sits over the top bay's door: out while BYD 2's driver gets out (preview 5), back once he's past it
  until: r(RACE_OUT, T.bydSays),
} as OverlaySpec;
/** The same card back (scene 3), its clock on the same video timing: the Tesla's row still counting up to 30. */
const raceBack: OverlaySpec = {
  ...race,
  start: r(C1_IN, RACE_BACK),
  rows: [
    {label: 'BYD · 70 %', to: 5, stopAt: r(BYD_DONE, RACE_BACK)},
    {label: 'TESLA · 80 %', to: 30, stopAt: r(TESLA_DONE, RACE_BACK)},
  ],
  at: r(RACE_BACK, T.tesla),
  until: r(T.gap + 0.6, T.tesla), // into the replay on "That gap", gone before it hides the BYD's driver
} as OverlaySpec;

const volts: OverlaySpec = {
  type: 'statement',
  text: 'Volts × amps.',
  cue: 'Power',
  place: 'sky', // over the canopy, clear of both cars
  until: 'and a Model Y runs',
} as OverlaySpec;

const v400: OverlaySpec = {
  type: 'callout',
  title: '400 volts',
  sub: 'Model Y',
  size: 1.2,
  anchor: 'pack:bottom',
  place: 'above',
  dy: -330,
  at: r(22.6, T.runs),
  until: r(T.soFaster - 0.05, T.runs),
} as OverlaySpec;

const taper: OverlaySpec = {
  type: 'chart',
  tab: 'CHARGING',
  xLabel: 'TIME',
  yLabel: 'POWER',
  left: 120,
  top: 290,
  width: 520,
  height: 315,
  xMax: 33,
  yMax: 1100,
  ticks: [
    {at: 5, label: '5 MIN'},
    {at: 30, label: '30 MIN'},
  ],
  curves: [
    {
      points: TESLA_KW.map(([x, y]): [number, number] => [x, y]),
      label: 'TESLA',
      labelPlace: 'above',
      draw: [
        {at: 0.1, value: 0},
        {at: r(T.slows + 0.4, T.protect) - 0.25, value: 1},
      ],
    },
    {
      points: BYD_KW.map(([x, y]): [number, number] => [x, y]),
      label: 'BYD',
      weight: 5,
      draw: [
        {at: r(T.slows + 0.55, T.protect) - 0.25, value: 0},
        {at: r(T.fills, T.protect) - 0.25, value: 1},
      ],
    },
  ],
  at: 0.25,
  until: len(T.protect, T.bydGets) - 0.05,
} as OverlaySpec;

const v1000: OverlaySpec = {
  type: 'callout',
  title: '1,000 volts',
  sub: 'BYD',
  size: 1.2,
  anchor: 'pack:top',
  place: 'above',
  dy: -330,
  at: r(T.thousand - 0.3, T.bydGets),
  until: len(T.bydGets, T.soIt) - 0.05,
} as OverlaySpec;

const C11_IN = 0.3;
const sameAmps: OverlaySpec = {
  type: 'counter',
  from: 0,
  rows: [
    {label: 'AT 1,000 V', to: 1000, stopAt: r(T.lessThan, T.soIt) - C11_IN},
    {label: 'AT 400 V', to: 2500, stopAt: r(T.halfAmps + 0.1, T.soIt) - C11_IN},
  ],
  label: 'A',
  sub: 'Same power',
  subPlace: 'above',
  x: 0.19, // right of the BYD driver's head at the `byd` framing (at 0.111 it covered it; preview 5)
  y: 0.156,
  at: C11_IN,
  until: len(T.soIt, T.evenSo) - 0.05,
} as OverlaySpec;

const a1500: OverlaySpec = {
  type: 'counter',
  from: 1000,
  to: 1500,
  label: 'A',
  sub: 'Up to',
  subPlace: 'above',
  x: 0.535, // top right, over the canopy and roof line: clear of the BYD driver's walk (right edge ≈ 884, inside 888)
  y: 0.156,
  at: r(T.pushUp - 0.1, T.evenSo),
  duration: r(T.ampsEnd, T.pushUp),
  until: r(48.95, T.evenSo), // 1,500 sits 0.3 s, then out before the BYD driver walks under it (preview 5)
} as OverlaySpec;

const placeChina: OverlaySpec = {type: 'place', text: 'China', left: 120, top: 300, size: 30, rule: true, at: 0.1} as OverlaySpec;

const placeUs: OverlaySpec = {
  type: 'place',
  text: 'The US',
  left: 120,
  top: 300,
  size: 30,
  rule: true,
  at: r(T.usWord, T.us) - 0.1,
  until: r(T.doesnt + 1.6, T.us),
} as OverlaySpec;

const software: OverlaySpec = {
  type: 'callout',
  title: 'Connected-car software',
  sub: 'Banned from 2027 models',
  size: 1.2,
  anchor: 'ghost',
  place: 'above',
  dy: -150,
  at: r(T.connected - 0.2, T.federal),
  until: r(59.9, T.federal) + 0.1,
} as OverlaySpec;

const kw400: OverlaySpec = {
  type: 'counter',
  from: 0,
  to: 400,
  label: 'kW',
  sub: 'Up to about',
  subPlace: 'above',
  x: 0.111,
  y: 0.156,
  at: r(T.kw400 - 1.1, T.fastest),
  duration: 1.1,
  until: len(T.fastest, T.modelYCan) - 0.05,
} as OverlaySpec;

const kw250: OverlaySpec = {
  type: 'counter',
  from: 0,
  to: 250,
  label: 'kW',
  sub: 'Model Y max',
  subPlace: 'above',
  x: 0.111,
  y: 0.156,
  at: 0.3,
  duration: r(T.kw250, T.modelYCan) - 0.3,
  until: len(T.modelYCan, T.stops) - 0.05,
} as OverlaySpec;

// ---------------------------------------------------------------- scenes

const cs = (cue: string, props: CP, a: number, b: number, overlays: OverlaySpec[] = [], quiet = 0): SceneSpec => ({
  scene: 'charge-slice',
  cue,
  props,
  overlays: [...overlays, ...sounds(props, a, b, quiet)],
});

const scenes: SceneSpec[] = [
  cs('In China', P1, T.hook, T.bydSays, [
    title,
    ...tags,
    {...BED, at: 0, fade: 1.0, until: 'like an extension'} as OverlaySpec,
    {...FAN, at: r(T.charge, T.hook), fade: 1.5, until: 'That gap comes'} as OverlaySpec,
  ]),
  cs('BYD says', P2, T.bydSays, T.tesla, [race]),
  cs('A Tesla Model', P3, T.tesla, T.gap, [raceBack]),
  cs('That gap comes', P4, T.gap, T.runs, [
    volts,
    {...FAN, at: 0, fade: 0.3, until: 'like an extension'} as OverlaySpec,
    {...PUMP, at: 0.1, fade: 0.8, until: 'like an extension'} as OverlaySpec,
  ], RW + 0.2),
  cs('and a Model Y runs', P5, T.runs, T.soFaster, [v400]),
  cs('so charging faster', P6, T.soFaster, T.heatLine),
  cs('More amps means', P7, T.heatLine, T.cord, [
    // the pump works harder: a second layer from "heat"
    {...PUMP, volume: PUMP.volume - 3, trim: 3.1, at: r(T.heat, T.heatLine), fade: 0.6, until: 'like an extension'} as OverlaySpec,
  ]),
  {
    scene: 'section-room',
    cue: 'like an extension',
    props: R8,
    overlays: [
      {...HEATER_CLICK, at: R8.corner.heaterAt} as OverlaySpec,
      {...HEATER_FAN, at: R8.corner.heaterAt + 0.05, fade: 0.8, until: 'To protect the'} as OverlaySpec,
    ],
  },
  cs('To protect the', P9, T.protect, T.bydGets, [
    taper,
    {...BED, at: 0, fade: 0.4, until: 'Here in the'} as OverlaySpec,
    {...FAN, at: 0, fade: 0.4, until: 'Here in the'} as OverlaySpec,
    {...PUMP, at: 0, fade: 0.4, until: 'Here in the'} as OverlaySpec,
  ]),
  cs('The BYD gets', P10, T.bydGets, T.soIt, [v1000]),
  cs('so it gets', P11, T.soIt, T.evenSo, [sameAmps]),
  cs('Even so', P12, T.evenSo, T.china, [
    a1500,
    {...PUMP, volume: PUMP.volume - 3, trim: 2.3, at: r(T.pushUp, T.evenSo), fade: 0.6, until: 'Here in the'} as OverlaySpec,
  ]),
  cs("That's China", P13, T.china, T.us, [placeChina]),
  cs('Here in the', P14, T.us, T.federal, [
    placeUs,
    {...BED, at: 0, fade: 0.4, until: "would BYD's five"} as OverlaySpec,
    {...FAN, volume: FAN.volume - 3, at: 0, fade: 0.4, until: "would BYD's five"} as OverlaySpec,
    {...PUMP, volume: PUMP.volume - 4, at: 0, fade: 0.4, until: "would BYD's five"} as OverlaySpec,
  ]),
  cs('And a federal', P15, T.federal, T.fastest, [software]),
  cs('Our fastest chargers', P16, T.fastest, T.modelYCan, [kw400]),
  cs('and a Model Y can', P17, T.modelYCan, T.stops, [kw250]),
  cs('If your charging', P18, T.stops, T.would),
  {
    scene: 'charge-slice',
    cue: "would BYD's five",
    props: P19,
    overlays: [{...BED, at: 0, fade: 0.5} as OverlaySpec, ...contactors(P19, T.would, END), ...latchesIn(T.would, END, END)],
  },
];

/** The cover's props: frame 0's state (P1 at 0 s), the camera held on `cover.camera` instead of the path. */
const COVER_PROPS: CP = {...P1, cameraKeys: undefined};

export const spec: VideoSpec = {
  watermark: null,
  // Cover still (`yarn cover ev-charging`): frame 0's twin framing, BYD above, Tesla below, text in the sky band.
  cover: {
    text: 'Why 30 min\nvs 5 min?',
    size: 140,
    scene: 'charge-slice',
    camera: shift(TWIN, [0, 1.5, 0], 44), // cars lower and a touch smaller, clear of the text
    at: 0,
    props: COVER_PROPS,
  },
  tail: TAIL,
  music: MUSIC,
  scenes,
};
