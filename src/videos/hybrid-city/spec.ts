/* eslint-disable @remotion/non-pure-animation -- false positive: `transition` keys in scene props are data, not CSS transitions */
import type {OverlaySpec, SceneSpec, VideoSpec} from '../../types';
import {cityTwinFramings, HYBRID_PAINT} from '../../scenes/CityTwinScene';
import {speedAt, type SpeedKey} from '../../scenes/keyframes';
import {CAR_LAYOUT} from '../../three/real/RealCar';
import {TWINS} from '../../theme';
import transcript from './transcript.json';

/**
 * No. 014 · Why does a hybrid do better in town? (`av-script.md` draft 1, re-timed on the recorded take; word times
 * read from `transcript.json`).
 *
 * Locations: A `city-twin` (the corner, mild morning: the hybrid on top, its gas twin below, a lead car ahead of each)
 * · H `city-twin` `road: 'highway'` (the twins cruising, two stacked lanes) · W `city-twin` `dressing: 'winter'` (the
 * same corner on a very cold day, the hybrid alone). A → H → W → A: three slides; every other hand-over is `continue`,
 * the camera on one path per run. Orange = the energy flow only: the drive path, the regen path, the heat at the discs.
 *
 * Every beat is keyed to a word time in `W` (video seconds) and shifted into scene time with `rel()` / `shift()`. After a
 * re-record, only `PHRASES` may need a new phrase; scenes start on cues and everything else follows.
 */

const WORDS = (transcript as {words: {text: string; start: number; end: number}[]}).words;
const norm = (x: string) => x.toLowerCase().replace(/[^a-z0-9']/g, '');
const PHRASES: [string, string][] = [
  // 1 hook
  ['most', 'most gas cars'],
  ['but1', 'but many hybrids'],
  ['many', 'many hybrids'],
  ['there', 'right there'],
  // 2–3 the sticker
  ['look', 'look at the window'],
  ['sticker', 'sticker'],
  ['on3', 'on a gas car'],
  ['car3', 'car'],
  ['bigger1', 'bigger'],
  ['but3', 'but on the hybrid'],
  ['hybrid3', 'hybrid version'],
  ['city3', 'city number'],
  ['bigger2', 'bigger'],
  // 4 the question
  ['so4', 'so why does'],
  ['hybrid4', 'hybrid do better'],
  ['town4', 'town'],
  // 5 wastes less
  ['it5', 'it wastes'],
  ['every5', 'every time'],
  ['stops', 'stops'],
  // 6 red light
  ['at6', 'at a red'],
  ['engine6', 'engine switches'],
  ['switches', 'switches off'],
  // 7 green
  ['when7', 'when the light'],
  ['turns', 'turns green'],
  ['green', 'green'],
  ['hybrid7', 'hybrid can'],
  ['electric', 'electric motor'],
  // 8 gentle
  ['when8', 'when you brake gently'],
  ['gently', 'gently'],
  ['motor8', 'motor turns'],
  ['electricity', 'electricity'],
  // 9 hard
  ['when9', 'when you brake hard'],
  ['hard', 'hard'],
  ['regular', 'regular brakes'],
  ['take', 'take over'],
  ['and9', 'and turn that'],
  ['heat', 'heat'],
  ['gas9', 'gas car'],
  // 10 highway
  ['out', 'out on the highway'],
  ['idling', 'idling'],
  ['so10', 'so the hybrid has'],
  ['little', 'little to save'],
  ['save', 'save'],
  // 11 air
  ['whats', "what's left"],
  ['air', 'air resistance'],
  ['and11', 'and it grows'],
  ['square', 'square'],
  ['speed', 'speed'],
  // 12 harder
  ['so12', 'so the faster'],
  ['faster', 'faster'],
  ['harder', 'harder'],
  // 13 the highway margin
  ['even', 'even so'],
  ['still', 'still beats'],
  ['beats', 'beats'],
  ['version', 'version'],
  ['smaller', 'smaller margin'],
  // 14 cold
  ['back', 'back in town'],
  ['very', 'very cold'],
  ['can', 'can cut'],
  ['third', 'third'],
  // 15 the question
  ['if', 'if you drive'],
  ['is', 'is your mileage'],
  ['winter', 'winter'],
];
const W = (() => {
  const out: Record<string, number> = {};
  let i = 0;
  for (const [key, phrase] of PHRASES) {
    const ws = phrase.split(' ').map(norm);
    let j = i;
    while (j < WORDS.length && !ws.every((x, k) => norm(WORDS[j + k]?.text ?? '') === x)) j++;
    if (j >= WORDS.length) throw new Error(`hybrid-city spec: phrase not found in transcript: "${phrase}" (${key})`);
    out[key] = WORDS[j].start;
    i = j;
  }
  out.end = WORDS[WORDS.length - 1].end;
  return out as Record<(typeof PHRASES)[number][0] | 'end', number>;
})();
const TAIL = 1.5;
const END = W.end + TAIL;

const r2 = (x: number) => Math.round(x * 100) / 100;
/** A video time → seconds into the scene that starts at `s`. */
const rel = (t: number, s: number) => r2(t - s);
const shift = <T extends {at: number}>(ks: readonly T[], s: number): T[] => ks.map((k) => ({...k, at: rel(k.at, s)}));
const val = (pairs: [number, number][]) => pairs.map(([at, value]) => ({at, value}));

// ------------------------------------------------------------------ scene starts (merged under ≈ 3 s on the real take)

const S = {
  s1: 0,
  s2: W.but1,
  s3: W.look,
  s4: W.but3,
  s5: W.so4, // 2.8 s: the question, the glide back and the pull-away
  s6: W.it5, // lines 5–6: the stop, then the engine off at the red
  s7: W.when7,
  s8: W.when8,
  s9: W.when9, // line 9 whole: the hard stop, then out to both cars' discs
  s10: W.out, // line 10 whole: the highway, then the battery
  s11: W.whats,
  s12: W.so12,
  s13: W.even,
  s14: W.back,
  s15: W.can,
  s16: W.is, // the loop
};
const STARTS = Object.values(S);
const endOf = (start: number) => STARTS.find((x) => x > start + 1e-6) ?? END;
const LOOP_LEN = r2(END - S.s16);

// ------------------------------------------------------------------ odometers (m) over speed keys (rev/s)

const WHEEL_C = 2 * Math.PI * CAR_LAYOUT.wheelR;
const ODO_STEP = 1 / 120;
const makeOdo = (ks: SpeedKey[], t0 = -20, t1 = END + 2) => {
  const table = [0];
  for (let i = 1; i <= (t1 - t0) / ODO_STEP; i++) table.push(table[i - 1] + speedAt(ks, t0 + (i - 0.5) * ODO_STEP, 0.8) * WHEEL_C * ODO_STEP);
  return (t: number) => table[Math.max(0, Math.min(table.length - 1, Math.round((t - t0) / ODO_STEP)))];
};
/** 1 mph in rev/s (`MPH60_REVS` ≈ 11.9 is 60 mph). */
const MPH = 11.9 / 60;
/** The stop line ahead of a standing twin's front tire: past its lead car (1.0 m gap, a 4.84 m crossover) and a step. */
const LINE_AHEAD = 7.6;

type Lens = 'red' | 'yellow' | 'green' | 'off';
type Corner = {at: number; lights: {at: number; state: Lens}[]; post?: number};
const cornersIn = (cs: Corner[], odo: (t: number) => number, s: number) =>
  cs.map((c) => ({ahead: r2(c.at - odo(s)), when: 0, ...(c.post !== undefined ? {post: c.post} : {}), lights: shift(c.lights, s)}));

// ------------------------------------------------------------------ A: the drive across town (video seconds, one clock)

const REST1 = W.stops + 1.0; // the red light of lines 5–6
const DRIVE: SpeedKey[] = [
  {at: -20, speed: 0},
  // line 1: green, the queue creeps (stop-and-go) and stops again
  {at: 2.6, speed: 1.6},
  {at: W.many + 0.6, speed: 0.8},
  {at: W.many + 1.2, speed: 0},
  // line 3: one more creep under the card
  {at: W.on3 + 0.9, speed: 1.3},
  {at: W.bigger1 + 0.1, speed: 0},
  // line 4: away, the hybrid's engine starting as it speeds up
  {at: W.so4 + 0.3, speed: 2.5},
  {at: W.hybrid4 + 0.2, speed: 4.2},
  {at: W.town4 - 0.4, speed: 25 * MPH},
  // line 5: a gentle stop at the red (≈ 3 s, the lamps on, the gas twin's discs warm)
  ...[4.0, 3.0, 2.0, 1.0, 0].map((speed, k) => ({at: r2(W.every5 - 0.5 + 0.5 * k), speed})),
  // line 7: green, the hybrid away on its motor
  {at: W.hybrid7 - 0.15, speed: 2.0},
  {at: W.hybrid7 + 0.6, speed: 3.6},
  {at: W.electric - 0.2, speed: 4.4},
  // line 8: brake gently behind the slowing traffic (no stop)
  {at: W.gently - 0.2, speed: 3.7},
  {at: W.gently + 0.5, speed: 3.0},
  {at: W.motor8 + 0.4, speed: 2.5},
  {at: W.electricity - 0.4, speed: 2.3},
  // traffic moves on, then line 9's hard stop at a light turning late
  {at: W.electricity + 0.4, speed: 3.6},
  {at: W.hard - 0.4, speed: 1.6},
  {at: W.hard + 0.1, speed: 0},
];
const odo = makeOdo(DRIVE);
const REST2 = W.hard + 0.9;
const CORNERS: Corner[] = [
  // frame 0's red light, green for the stop-and-go (the loop re-places it on its own clock)
  {at: LINE_AHEAD, lights: [{at: -20, state: 'red'}, {at: 2.0, state: 'green'}]},
  // lines 5–7: yellow, red ahead of the stop, green on "turns green"
  {
    at: odo(REST1) + LINE_AHEAD,
    lights: [
      {at: -20, state: 'green'},
      {at: W.it5 + 0.1, state: 'yellow'},
      {at: W.it5 + 0.9, state: 'red'},
      {at: W.turns + 0.2, state: 'green'},
    ],
  },
  // line 9: a late yellow, red as the twins stop
  {
    at: odo(REST2) + LINE_AHEAD,
    lights: [
      {at: -20, state: 'green'},
      {at: W.when9 - 0.3, state: 'yellow'},
      {at: W.hard, state: 'red'},
    ],
  },
];

/** Heat in a disc: rises over the stop, holds a moment, fades over ≈ 1.5 s (keys, video seconds). */
const heat = (a: number, peakAt: number, peak: number, holdTo: number): {at: number; value: number}[] =>
  val([
    [-20, 0],
    [a, 0],
    [peakAt, peak],
    [holdTo, peak * 0.85],
    [holdTo + 1.6, 0],
  ]);
const NOSE = val([
  [-20, 0],
  [W.hard - 0.4, 0],
  [W.hard + 0.2, 1],
  [REST2 + 0.1, 0.5],
  [REST2 + 0.6, 0],
]);

/** The hybrid in A at scene start `s` (its regen / drive path events passed per scene: one of each per scene). */
const hybridA = (s: number, extra: Record<string, unknown> = {}): Record<string, unknown> => ({
  engineRun: shift(
    [
      {at: -20, on: false},
      {at: W.hybrid4, on: true},
      {at: W.switches, on: false},
    ],
    s,
  ),
  rpm: 1500,
  exhaust: shift([{at: W.hybrid4 + 0.4, size: 0.8}, {at: W.it5 + 0.3, size: 0.7}], s),
  packLevel: shift(val([[-20, 0.35], [W.electricity, 0.35], [W.electricity + 0.6, 0.5]]), s),
  brakeHeat: {front: shift(heat(W.regular - 0.1, W.take, 0.9, W.gas9), s)},
  noseDip: shift(NOSE, s),
  ...extra,
});
/** The gas twin in A (its engine idles from frame 0; puffs while it stands, a bigger one as it pulls away). */
const GAS_PUFFS = [1.2, 2.7, 7.0, 8.4, 10.1, 12.6, 14.0, 15.4, 16.3, 22.8, 24.2, 25.9, 36.6, 38.0];
const GAS_REVS = new Set([2.7, 10.1, 16.3, 25.9]);
const gasA = (s: number): Record<string, unknown> => ({
  rpm: shift(
    val([
      [-20, 800],
      [2.5, 800],
      [2.8, 1600],
      [W.many + 0.6, 800],
      [W.so4 + 0.2, 800],
      [W.so4 + 0.6, 2600],
      [W.town4, 1800],
      [W.every5 - 0.5, 800],
      [W.hybrid7 - 0.2, 800],
      [W.hybrid7 + 0.2, 2600],
      [W.electric, 1800],
      [W.gently, 1000],
      [W.electricity + 0.3, 2200],
      [W.hard - 0.4, 800],
    ]),
    s,
  ),
  exhaust: GAS_PUFFS.filter((t) => t > s - 2 && t < endOf(s) + 0.1).map((t) => ({at: rel(t, s), size: GAS_REVS.has(t) ? 1.6 : 1})),
  brakeHeat: {
    front: shift(
      [
        ...heat(W.every5, W.stops, 0.55, W.stops + 0.6).slice(0, 4),
        {at: r2(W.stops + 2.2), value: 0},
        {at: W.gently, value: 0},
        {at: W.motor8, value: 0.3},
        {at: W.electricity + 0.2, value: 0.25},
        {at: W.electricity + 1.6, value: 0},
        ...heat(W.regular - 0.1, W.take, 0.9, W.gas9).slice(1),
      ],
      s,
    ),
  },
  noseDip: shift(NOSE, s),
});
const A = (s: number, top: Record<string, unknown> = {}): Record<string, unknown> => ({
  driving: shift(DRIVE, s),
  corners: cornersIn(CORNERS, odo, s),
  top: hybridA(s, top),
  bottom: gasA(s),
  drift: 0,
  transition: 'continue',
  ...keys(PATH_A, s),
});

// ------------------------------------------------------------------ H: the highway (its own clock)

const HDRIVE: SpeedKey[] = [
  {at: -20, speed: 35 * MPH},
  // line 11: twice the speed (35 → 70 mph, 🎭 illustrative)
  ...[45, 54, 63, 70].map((mph, k) => ({at: r2(W.and11 - 0.1 + 0.55 * k), speed: mph * MPH})),
];
const H = (s: number, transition: 'slide' | 'continue', top: Record<string, unknown> = {}): Record<string, unknown> => ({
  location: 'city-twin-highway',
  road: 'highway',
  driving: shift(HDRIVE, s),
  top: {
    highwayLane: 'lane',
    engineRun: [{at: -20, on: true}],
    rpm: shift(val([[-20, 2000], [W.and11, 2000], [W.speed, 2900], [W.faster, 2900], [W.harder, 3700]]), s),
    packLevel: 0.5,
    packNode: 1,
    hvBlips: [W.so10 + 0.3, W.little - 0.1].map((t) => rel(t, s)),
    dragArrow: {at: rel(W.air, s)},
    ...top,
  },
  bottom: {highwayLane: 'lane', rpm: shift(val([[-20, 2000], [W.and11, 2000], [W.speed, 2900]]), s)},
  drift: 0,
  transition,
  ...keys(PATH_H, s),
});

// ------------------------------------------------------------------ W: the cold day (its own clock)

const WDRIVE: SpeedKey[] = [
  {at: -20, speed: 20 * MPH},
  ...[3.2, 2.4, 1.6, 0.8, 0].map((speed, k) => ({at: r2(W.back + 0.9 + 0.45 * k), speed})),
  {at: W.if + 0.4, speed: 2.0},
  {at: W.if + 1.1, speed: 3.4},
];
const odoW = makeOdo(WDRIVE);
const W_CORNER: Corner[] = [
  {
    at: odoW(W.back + 3.6) + LINE_AHEAD,
    lights: [
      {at: -20, state: 'green'},
      {at: W.back + 0.2, state: 'yellow'},
      {at: W.back + 0.8, state: 'red'},
      {at: W.if + 0.1, state: 'green'},
    ],
  },
];
const WIN = (s: number, transition: 'slide' | 'continue'): Record<string, unknown> => ({
  dressing: 'winter',
  snow: {density: 1, gusts: [W.can + 1.0]},
  driving: shift(WDRIVE, s),
  corners: cornersIn(W_CORNER, odoW, s),
  bottom: false,
  top: {
    packLevel: shift(val([[-20, 0.35], [W.very, 0.35], [W.very + 0.8, 0.4]]), s),
    // the cold (F5): the same gentle stop, a weaker regen and a smaller fill; the engine stays off
    regen: {
      at: rel(W.back + 0.9, s),
      rotorAt: rel(W.back + 1.3, s),
      windingsAt: rel(W.back + 1.5, s),
      inverterAt: rel(W.back + 1.9, s),
      batteryAt: rel(W.very - 0.1, s),
      fullAt: rel(W.very + 0.8, s),
      fill: 0.4,
      strength: 0.4,
      fadeAt: rel(W.can + 0.8, s),
    },
    drivePath: {at: rel(W.if, s), drawFor: 0.6, strength: 0.4},
  },
  drift: 0,
  transition,
  ...keys(PATH_W, s),
});

// ------------------------------------------------------------------ the loop (scene time: its last frame is frame 0)

const LDRIVE: SpeedKey[] = [
  {at: -20, speed: 3.0},
  ...[2.2, 1.4, 0.7, 0].map((speed, k) => ({at: r2(0.6 + 0.45 * k), speed})),
];
const LOOP = (): Record<string, unknown> => ({
  loop: true,
  driving: LDRIVE,
  // frame 0's corner, red, on frame 0's mark at the last frame
  corners: [{ahead: LINE_AHEAD, when: LOOP_LEN, lights: [{at: -20, state: 'red'}]}],
  top: {packLevel: 0.35},
  bottom: {
    rpm: 800,
    // puffs while it stands; none in the air at the last frame (frame 0 has none)
    exhaust: [{at: 2.4}].filter((p) => p.at < LOOP_LEN - 1.9),
    brakeHeat: {front: val([[-20, 0], [0.8, 0], [2.0, 0.3], [2.4, 0.3], [3.6, 0]])},
  },
  drift: 0,
  transition: 'slide',
  ...keys(PATH_LOOP, S.s16),
});

// ------------------------------------------------------------------ the camera on the video clock (insurance-app's pattern)

type V3 = [number, number, number];
type Framing = {look: V3; distance: number};
type PathKey = {t: number; f: Framing; ease?: 'lin' | 'glide'};
const F = (v: number) => Math.round(v * 30);
const lerpF = (a: Framing, b: Framing, u: number): Framing => ({
  look: a.look.map((x, k) => x + (b.look[k] - x) * u) as V3,
  distance: a.distance + (b.distance - a.distance) * u,
});
const segVel = (path: PathKey[], i: number): Framing => {
  if (i < 1 || i >= path.length || (path[i].ease ?? 'lin') !== 'lin') return {look: [0, 0, 0], distance: 0};
  const a = path[i - 1];
  const b = path[i];
  const dt = b.t - a.t;
  return {look: a.f.look.map((x, k) => (b.f.look[k] - x) / dt) as V3, distance: (b.f.distance - a.f.distance) / dt};
};
const framingOnPath = (path: PathKey[], v: number): Framing => {
  if (v <= path[0].t) return path[0].f;
  for (let i = 1; i < path.length; i++) {
    const a = path[i - 1];
    const b = path[i];
    if (v >= b.t) continue;
    const u = (v - a.t) / (b.t - a.t);
    if ((b.ease ?? 'lin') === 'lin') return lerpF(a.f, b.f, u);
    const T = b.t - a.t;
    const v0 = segVel(path, i - 1);
    const v1 = segVel(path, i + 1);
    const h00 = 2 * u ** 3 - 3 * u ** 2 + 1;
    const h10 = u ** 3 - 2 * u ** 2 + u;
    const h01 = -2 * u ** 3 + 3 * u ** 2;
    const h11 = u ** 3 - u ** 2;
    const mix = (p0: number, m0: number, p1: number, m1: number) => h00 * p0 + h10 * T * m0 + h01 * p1 + h11 * T * m1;
    return {
      look: a.f.look.map((x, k) => mix(x, v0.look[k], b.f.look[k], v1.look[k])) as V3,
      distance: mix(a.f.distance, v0.distance, b.f.distance, v1.distance),
    };
  }
  return path[path.length - 1].f;
};
const camKeys = (path: PathKey[], a: number, b: number) => {
  const out: {at: number; look: V3; distance: number}[] = [];
  const n = F(b) - F(a);
  for (let k = 0; k * 2 <= n + 1; k++) {
    const sec = Math.min(n, k * 2) / 30;
    const f = framingOnPath(path, F(a) / 30 + sec);
    out.push({at: Math.round(sec * 1000) / 1000, look: f.look.map((x) => Math.round(x * 1000) / 1000) as V3, distance: Math.round(f.distance * 1000) / 1000});
  }
  return out;
};
function keys(path: PathKey[], start: number) {
  return {cameraKeys: camKeys(path, start, endOf(start))};
}
const at = (f: Framing, distance: number): Framing => ({look: f.look, distance});
const nudge = (f: Framing, dx: number, dy: number, distance = f.distance): Framing => ({look: [f.look[0] + dx, f.look[1] + dy, f.look[2]], distance});
/** A slow push: framing `f` pushed in at `v` units/s from time a to time b. */
const push = (f: Framing, a: number, b: number, v: number): PathKey[] => [
  {t: a, f},
  {t: b, f: at(f, f.distance - v * (b - a))},
];
const G = 0.8; // glide length (s)

const TF = cityTwinFramings({});
const A_STACK = TF.stack; // frame 0 and the loop
const A_CARD: Framing = {look: [-3.3, 0.75, 0.3], distance: 100}; // both cars under the sticker card (bottom y 770), right of the captions
const A_BAYS = TF.bays;
const A_HYB = nudge(TF.hybrid, 0, -0.9); // the pack and its callout clear of the captions
const A_BRAKES = TF.twinBrakes;
const A_SPEED = 0.12;

const PATH_A: PathKey[] = [
  // frame 0 = A_STACK exactly (the loop lands there)
  {t: -4, f: at(A_STACK, A_STACK.distance + A_SPEED * 4)},
  {t: W.look, f: at(A_STACK, A_STACK.distance - A_SPEED * W.look)},
  // the sticker: both cars low, under the card
  {t: W.look + G, f: A_CARD, ease: 'glide'},
  {t: W.so4, f: at(A_CARD, A_CARD.distance - 0.1 * (W.so4 - W.look - G))},
  // the question, the pull-away, the stop: both cars whole
  {t: W.so4 + G, f: A_STACK, ease: 'glide'},
  {t: W.at6, f: at(A_STACK, A_STACK.distance - A_SPEED * (W.at6 - W.so4 - G))},
  // the red light: both engine bays
  {t: W.at6 + G, f: A_BAYS, ease: 'glide'},
  {t: W.when7, f: at(A_BAYS, A_BAYS.distance - 0.05 * (W.when7 - W.at6 - G))},
  // green: the hybrid whole (its pack, motor and wheel)
  {t: W.when7 + G, f: A_HYB, ease: 'glide'},
  {t: W.when9, f: at(A_HYB, A_HYB.distance - 0.08 * (W.when9 - W.when7 - G))},
  // hard: closer on the hybrid's front wheel and bay
  {t: W.when9 + G, f: TF.hybridFront, ease: 'glide'},
  {t: W.and9, f: at(TF.hybridFront, TF.hybridFront.distance - 0.04 * (W.and9 - W.when9 - G))},
  // "as in a gas car": both cars' front wheels
  {t: W.and9 + G, f: A_BRAKES, ease: 'glide'},
  {t: W.out + 1, f: at(A_BRAKES, A_BRAKES.distance - 0.08 * (W.out + 1 - W.and9 - G))},
];

const H_HYB = nudge(TF.hybrid, -0.6, -0.8, 18); // the hybrid above the captions, the bottom lane's car in view
const H_AIR = nudge(TF.hybrid, -1.4, -0.3, 21); // room ahead of the nose for the drag arrow, under the counter
const H_CARD: Framing = {look: [1.1, 2.3, 0.3], distance: 80}; // the pair centred under the card (reviewer)
const PATH_H: PathKey[] = [
  ...push(H_HYB, W.out - 1, W.so10, 0.1),
  {t: W.so10 + G, f: TF.battery, ease: 'glide'},
  {t: W.whats, f: at(TF.battery, TF.battery.distance - 0.03 * (W.whats - W.so10 - G))},
  {t: W.whats + G, f: H_AIR, ease: 'glide'},
  {t: W.so12, f: at(H_AIR, H_AIR.distance - 0.1 * (W.so12 - W.whats - G))},
  {t: W.so12 + G, f: TF.bay, ease: 'glide'},
  {t: W.even, f: at(TF.bay, TF.bay.distance - 0.03 * (W.even - W.so12 - G))},
  {t: W.even + G, f: H_CARD, ease: 'glide'},
  {t: W.back + 1, f: at(H_CARD, H_CARD.distance - 0.1 * (W.back + 1 - W.even - G))},
];

const W_HYB = nudge(TF.hybrid, 0, -0.7, 19); // the car a little lower in frame (reviewer)
const PATH_W: PathKey[] = [
  ...push(W_HYB, W.back - 1, W.can, 0.1),
  {t: W.can + G, f: nudge(TF.hybrid, 0.3, -0.7, 15.5), ease: 'glide'},
  {t: W.is + 1, f: nudge(TF.hybrid, 0.3, -0.7, 15.5 - 0.08 * (W.is + 1 - W.can - G))},
];

/** The loop: frame 0's framing and push, reached on the last frame. */
const PATH_LOOP: PathKey[] = [
  {t: S.s16 - 1, f: at(A_STACK, A_STACK.distance + A_SPEED * (END - S.s16 + 1))},
  {t: END, f: A_STACK},
  {t: END + 1, f: at(A_STACK, A_STACK.distance - A_SPEED)},
];

// ------------------------------------------------------------------ overlays

const titleBlock: OverlaySpec = {
  type: 'title',
  at: 0,
  question: 'Why does a hybrid do better in town?', // line 4 as recorded (F1: fades before the card)
  number: 'No. 014',
  title: 'Across Town',
  time: '8:10 AM',
  carry: true,
  until: 9.4,
} as OverlaySpec;

const tags = (a: number, b: number, s: number): OverlaySpec[] => [
  {type: 'tag', who: 'you', anchor: 'top:top', label: 'HYBRID', color: HYBRID_PAINT, outline: 'ink', side: 'left', at: rel(a, s), until: rel(b, s)} as OverlaySpec,
  {type: 'tag', who: 'extra', anchor: 'top:bottom', label: 'GAS', color: TWINS.gasPaint, outline: 'ink', side: 'left', below: 'lane:top', at: rel(a, s), until: rel(b, s)} as OverlaySpec,
];

const CARD_IN = 9.45; // after the title block has gone (F1)
const stickerA: OverlaySpec = {
  type: 'sticker',
  at: rel(CARD_IN, S.s3),
  carry: true,
  until: rel(W.so4 - 0.1, S.s3),
  columns: [
    {label: 'GAS', paint: TWINS.gasPaint, values: [29, 37], at: r2(W.car3 - CARD_IN)},
    {label: 'HYBRID', paint: HYBRID_PAINT, values: [51, 44], at: r2(W.hybrid3 - CARD_IN)},
  ],
  boxes: [
    {at: r2(W.bigger1 - CARD_IN - 0.3), cell: [0, 1]},
    {at: r2(W.city3 - CARD_IN), cell: [1, 0]},
  ],
} as OverlaySpec;
const CARD_B = W.even + 0.3;
const stickerB: OverlaySpec = {
  type: 'sticker',
  at: rel(CARD_B, S.s13),
  until: rel(W.back - 0.15, S.s13),
  landed: true,
  columns: [
    {label: 'GAS', paint: TWINS.gasPaint, values: [29, 37]},
    {label: 'HYBRID', paint: HYBRID_PAINT, values: [51, 44]},
  ],
  boxes: [
    {at: -1, cell: [0, 1]},
    {at: -1, cell: [1, 0], moves: [{at: r2(W.beats - CARD_B), cell: [1, 1]}]},
  ],
  dim: {at: r2(W.still - CARD_B), row: 0},
  bracket: {at: r2(W.smaller - CARD_B), row: 1},
} as OverlaySpec;

const callout = (anchor: string, title: string, sub: string | undefined, a: number, b: number, s: number, dy = -200): OverlaySpec =>
  ({type: 'callout', anchor, title, ...(sub ? {sub, subInk: 'ink'} : {}), size: 1.2, place: 'above', dy, at: rel(a, s), until: rel(b, s)}) as OverlaySpec;

// ------------------------------------------------------------------ scenes

const regen8 = (s: number) => ({
  regen: {
    at: rel(W.gently - 0.1, s),
    rotorAt: rel(W.motor8 - 0.3, s),
    windingsAt: rel(W.motor8, s),
    inverterAt: rel(W.motor8 + 0.6, s),
    batteryAt: rel(W.electricity - 0.7, s),
    fullAt: rel(W.electricity, s),
    fill: 0.5,
    fadeAt: rel(W.when9 - 0.2, s),
  },
});
const drive7 = (s: number) => ({
  drivePath: {at: rel(W.green - 0.1, s), inverterAt: rel(W.green + 0.5, s), windingsAt: rel(W.hybrid7 + 0.1, s), rotorAt: rel(W.hybrid7 + 0.2, s), wheelAt: rel(W.hybrid7 + 0.8, s), fadeAt: rel(W.gently - 0.3, s)},
});
const regen9 = (s: number) => ({
  // hard: the regen flickers thin, the friction brakes take over
  regen: {at: rel(W.hard - 0.3, s), rotorAt: rel(W.hard, s), windingsAt: rel(W.hard + 0.1, s), inverterAt: rel(W.hard + 0.4, s), strength: 0.35, fadeAt: rel(W.regular + 0.2, s), fadeFor: 0.4},
});

const scenes: SceneSpec[] = [
  // ---- 1–2 A: frame 0, the stop-and-go
  {scene: 'city-twin', cue: 'Most gas cars', props: A(S.s1), overlays: [titleBlock, ...tags(0.3, 3.3, S.s1)]},
  {scene: 'city-twin', cue: 'but many hybrids', props: A(S.s2)},
  // ---- 3–4 A: the sticker card
  {scene: 'city-twin', cue: 'Look at the window', props: A(S.s3), overlays: [stickerA]},
  {scene: 'city-twin', cue: 'but on the hybrid version', props: A(S.s4)},
  // ---- 5–6 A: the question, away, the stop, the engine off
  {scene: 'city-twin', cue: 'So why does a hybrid', props: A(S.s5)},
  {
    scene: 'city-twin',
    cue: 'It wastes less energy',
    props: A(S.s6),
    overlays: [callout('engine:top', 'Engine', 'Off at the light', W.engine6 - 0.2, W.when7 - 0.1, S.s6, -150)],
  },
  // ---- 7 A: green, away on the motor
  {
    scene: 'city-twin',
    cue: 'When the light turns green',
    props: A(S.s7, drive7(S.s7)),
    overlays: [callout('motor:top', 'Electric motor', undefined, W.electric - 0.2, W.when8 - 0.1, S.s7)],
  },
  // ---- 8 A: gentle braking, the regen path into the pack
  {
    scene: 'city-twin',
    cue: 'When you brake gently',
    props: A(S.s8, {...drive7(S.s8), ...regen8(S.s8)}),
    overlays: [callout('battery:top', 'Battery', undefined, W.electricity - 0.4, W.when9 - 0.1, S.s8)],
  },
  // ---- 9 A: the hard stop, then both cars' discs
  {
    scene: 'city-twin',
    cue: 'When you brake hard',
    // no car tags here: at `twinBrakes` both roofs are off frame (the tags' leaders start there)
    props: A(S.s9, {...regen8(S.s9), ...regen9(S.s9)}),
  },
  // ---- 10–13 H: the highway
  {scene: 'city-twin', cue: 'Out on the highway', props: H(S.s10, 'slide')},
  {
    scene: 'city-twin',
    cue: "What's left is air",
    props: H(S.s11, 'continue'),
    overlays: [
      {type: 'counter', from: 1, to: 4, label: '× the push', sub: 'At twice the speed', x: 0.111, y: 0.156, at: rel(W.and11, S.s11), duration: r2(W.speed - W.and11), until: rel(W.so12 - 0.1, S.s11)} as OverlaySpec,
    ],
  },
  {scene: 'city-twin', cue: 'So the faster you go', props: H(S.s12, 'continue')},
  {scene: 'city-twin', cue: 'Even so', props: H(S.s13, 'continue'), overlays: [stickerB]},
  // ---- 14–15 W: the cold day
  {scene: 'city-twin', cue: 'Back in town', props: WIN(S.s14, 'slide')},
  {scene: 'city-twin', cue: "can cut a hybrid's", props: WIN(S.s15, 'continue')},
  // ---- 16 A: the loop, frame 0's stop replayed so the last frame is frame 0
  {scene: 'city-twin', cue: 'is your mileage really', props: LOOP()},
];

// ------------------------------------------------------------------ sound (datacenter-water's `BEDS` pattern)

/**
 * Measured with the bundled ffmpeg `loudnorm` (integrated LUFS): voice −21.99, music −16.17, idle −20.44, engine-work
 * −20.44, highway −24.43, city −32.45. volume = (voice − dB under) − file. Beds sit 25 dB under (the owner found the
 * datacenter beds too loud at 19–22); the engines 21 under, since the idle-versus-silence contrast is the point. At
 * most two beds at once. Physical sounds only.
 */
const VOICE_LUFS = -21.99;
const vol = (under: number, lufs: number) => r2(VOICE_LUFS - under - lufs);
const BEDS = {
  idle: {name: 'idle', volume: vol(21, -20.44)}, // −22.55: the gas twin's four-cylinder at 800 rpm, at the stops
  work: {name: 'engine-work', volume: vol(21, -20.44)}, // −22.55: 2900 → 3700 rpm, "the harder the engine works"
  highway: {name: 'highway', volume: vol(25, -24.43)}, // −22.56: tire roar, scenes 10–13
  city: {name: 'city', volume: vol(25, -32.45)}, // −14.54: the outdoor bed, the city and winter scenes
} as const;
type Bed = keyof typeof BEDS;
/** Music (owner-approved, 71 s): 12 dB under the voice from frame 0, no duck, fading to silence on the last frame. */
const MUSIC = {level: vol(9, -16.17), duckDb: 0, startAt: 0, fadeIn: 1.5, fadeOut: 1.5} as const; // −14.82 (owner: music up a bit, 2026-11-02; was 12 dB under)

/** One bed's span in a scene, in video seconds: [from, to] (to = null: until the scene's cut). */
type Span = {bed: Bed; from?: number; to?: number | null; fade?: number};
/** Beds per scene (1-based). The idle plays while the gas twin stands idling at a stop; silent while it drives. */
const SOUND: Record<number, Span[]> = {
  // frame 0: both beds fade in from silence (the loop scene fades them out to silence: the seam matches)
  1: [{bed: 'city'}, {bed: 'idle'}],
  2: [{bed: 'city'}, {bed: 'idle'}],
  3: [{bed: 'city'}, {bed: 'idle'}],
  4: [{bed: 'city'}, {bed: 'idle'}],
  5: [{bed: 'city'}, {bed: 'idle', to: W.so4 + 0.8, fade: 0.5}], // out as they pull away
  6: [{bed: 'city'}, {bed: 'idle', from: REST1 - 1.0}], // at the red, the hybrid silent
  7: [{bed: 'city'}, {bed: 'idle', to: W.hybrid7 + 0.6, fade: 0.5}], // until the gas twin pulls away on green
  8: [{bed: 'city'}],
  9: [{bed: 'city'}, {bed: 'idle', from: REST2 - 0.3}], // after the hard stop
  10: [{bed: 'highway'}],
  11: [{bed: 'highway'}],
  12: [{bed: 'highway'}, {bed: 'work', fade: 0.5}],
  13: [{bed: 'highway'}],
  14: [{bed: 'city'}],
  15: [{bed: 'city'}],
  16: [{bed: 'city'}, {bed: 'idle', from: S.s16 + 2.0}], // idling at frame 0's red; both out by the last frame
};
const sfxFor = (n: number): OverlaySpec[] => {
  const s = STARTS[n - 1];
  const len = r2(endOf(s) - s);
  const nextBeds = new Set((SOUND[n + 1] ?? []).filter((x) => x.from === undefined).map((x) => x.bed));
  return (SOUND[n] ?? []).map((sp) => {
    const loopEnd = n === 16; // the seam: faded out exactly on the last frame
    const carries = sp.to === undefined && nextBeds.has(sp.bed) && !loopEnd;
    const until = sp.to != null ? rel(sp.to, s) : carries ? r2(len + 0.5) : len; // a continued bed's fades cross at the join
    return {type: 'sfx', ...BEDS[sp.bed], loop: true, fade: sp.fade ?? 1.0, at: sp.from !== undefined ? rel(sp.from, s) : 0, until} as OverlaySpec;
  });
};
scenes.forEach((sc, i) => {
  const extra = sfxFor(i + 1);
  if (extra.length) sc.overlays = [...(sc.overlays ?? []), ...extra];
});

/** Frame 0's props without its camera path (the cover holds one framing). */
const COVER_PROPS = (() => {
  const {cameraKeys: _k, transition: _t, ...rest} = A(0) as Record<string, unknown>;
  void _k;
  void _t;
  return {...rest, drift: 0};
})();

export const spec: VideoSpec = {
  // Cover still (`yarn cover hybrid-city`, publisher's text): frame 0, both twins at the red light (the gas twin
  // idling, the hybrid silent), aimed a little higher so the cars sit under the two lines.
  cover: {
    text: 'Hybrid vs gas\nWhy the city wins',
    size: 130,
    scene: 'city-twin',
    camera: nudge(A_STACK, 0, 1.6),
    at: 0,
    props: COVER_PROPS,
  },
  tail: TAIL,
  music: MUSIC,
  scenes,
};
