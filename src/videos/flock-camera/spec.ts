/* eslint-disable @remotion/non-pure-animation -- false positive: `transition` keys in scene props are data, not CSS transitions */
import type {OverlaySpec, SceneSpec, VideoSpec} from '../../types';
import {cityFraming} from '../../scenes/CitySliceScene';
import {recordsFramings} from '../../scenes/RecordsSliceScene';
import transcript from './transcript.json';

/**
 * No. 015 · How does a plate camera know your car? (`av-script.md` draft 1, re-timed on the recorded take, 70.7 s;
 * every word time is read from `transcript.json`).
 *
 * Locations: A `city-slice` (the corner, 2:14 PM: YOU's car with a roof rack stops at the red light past the
 * plate-camera pole) · B `records-slice` (the server room under the office, reached by following the path up).
 * A → (follow) → B → (slide) → A. Orange = the data path only: the IR pulses and stills, the plate mark, the marks on
 * the photo, the record, the path, the matching slabs, the retention ruler.
 *
 * Each location has one camera path in video seconds (`PATH_A`, `PATH_B`), sampled into each scene's `cameraKeys`, so
 * the camera never stops across `continue` cuts. The car's and pole's keys are one set in video seconds, shifted per
 * scene. Owner decisions (2026-11-03): F1 title block faded ≈ 9 s, F2 blank badge chip, F7 `7 DAYS` / "New police
 * customers", F12 orange IR cone, F13 a plain office extra, F3 camera-view box (style guide v0.18.7).
 */

const WORDS = (transcript as {words: {text: string; start: number; end: number}[]}).words;
const norm = (x: string) => x.toLowerCase().replace(/[^a-z0-9']/g, '');
const PHRASES: [string, string][] = [
  ['read1', 'read your plate'],
  ['plate1', 'plate'],
  ['they2', 'they also pick'],
  ['make2', 'make'],
  ['color2', 'color and even'],
  ['rack2', 'roof rack'],
  ['guess', "you'd guess"],
  ['guessW', 'guess'],
  ['plate3', 'plate up'],
  ['registration3', 'registration records'],
  ['but4', 'but in its own'],
  ['letter', 'letter'],
  ['those', 'those details'],
  ['analyzing', 'analyzing'],
  ['photo', 'photo'],
  ['data4', 'data'],
  ['reading', 'reading the plate'],
  ['plate5', 'plate is'],
  ['light6', 'light it'],
  ['infrared', 'infrared'],
  ['see6', 'see'],
  ['and6', 'and software reads'],
  ['reads', 'reads'],
  ['shape', 'shape'],
  ['telling', 'telling the make'],
  ['make7', 'make and color'],
  ['color7', 'color is'],
  ['newer', 'newer'],
  ['after', 'after training'],
  ['sets', 'sets'],
  ['learn', 'learn'],
  ['it8', 'it'],
  ['each', 'each sighting'],
  ['saved9', 'saved'],
  ['plate9', 'plate text'],
  ['labels9', 'labels and'],
  ['when9', 'when and where'],
  ['where9', 'where'],
  ['passed', 'passed'],
  ['search10', 'a search can'],
  ['color10', 'color and make'],
  ['make10', 'make at'],
  ['place10', 'place and time'],
  ['time10', 'time'],
  ['get', 'get back'],
  ['sightings10', 'sightings whose'],
  ['match10', 'match'],
  ['company11', 'the company says a paper'],
  ['paper', 'paper'],
  ['covered', 'covered'],
  ['missing', 'missing'],
  ['doesnt', "doesn't stop"],
  ['finding', 'finding'],
  ['labels12', 'the labels can match'],
  ['labelsW', 'labels can'],
  ['without', 'without'],
  ['flocks', "flock's default"],
  ['keeping', 'keeping'],
  ['saved13', 'saved sightings'],
  ['thirty', 'thirty'],
  ['since', 'and since august'],
  ['seven', 'seven'],
  ['police', 'police customers'],
  ['company14', 'the company says whoever'],
  ['runs', 'runs'],
  ['pick', 'pick another'],
  ['within', 'within the law'],
  ['if', "if there's one"],
  ['which', 'which number'],
];
const W = (() => {
  const out: Record<string, number> = {};
  let i = 0;
  for (const [key, phrase] of PHRASES) {
    const ws = phrase.split(' ').map(norm);
    let j = i;
    while (j < WORDS.length && !ws.every((x, k) => norm(WORDS[j + k]?.text ?? '') === x)) j++;
    if (j >= WORDS.length) throw new Error(`flock-camera spec: phrase not found in transcript: "${phrase}" (${key})`);
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
const shiftT = (ts: readonly number[], s: number) => ts.map((t) => rel(t, s));

// ------------------------------------------------------------------ scene starts (merged under ≈ 3 s on the real take)

const S = {
  s1: 0,
  s2: W.they2,
  s3: W.guess,
  s4: W.but4, // line 4 whole: the ghost fades, the photo analysed
  s5: W.reading, // line 5 + "light it with infrared": the cut-away, the IR
  s6: W.and6, // "and software reads" + line 7: the IR still, then the colour still
  s7: W.after,
  s8: W.each,
  s9: W.search10, // B
  s10: W.company11, // line 11 + 12: the odd plates, then the slabs
  s11: W.flocks,
  s12: W.since,
  s13: W.company14,
  s14: W.if, // the loop
};
const STARTS = Object.values(S);
const endOf = (start: number) => STARTS.find((x) => x > start + 1e-6) ?? END;
/**
 * The last rendered frame (the timeline rounds the duration and each scene's start to whole frames): the video is
 * round(END × 30) frames long, so its last frame is one frame less. The loop's keys land frame 0's state exactly on it,
 * in the loop scene's own clock (which starts on its rounded first frame).
 */
const LAST_T = (Math.round(END * 30) - 1) / 30;
const LOOP_LAST = LAST_T - Math.round(S.s14 * 30) / 30;

// ------------------------------------------------------------------ A: the corner (one key set, video seconds)

const STOP_LINE = 35;
const POLE_SPOT = {x: 12.6, before: 10};

/** YOU's car: braking past the pole at frame 0, at rest at the line by 1.2 s, waiting at the red through A. */
const YOU_LIFT = -2.3;
const YOU_STOP = 1.2;
/** Green just before "saved" (line 9): the record is saved as the car pulls away past the pole. */
const GO = W.saved9;
const GREEN = r2(GO - 0.4);
const YOU_MARK = [
  {at: W.read1, do: 'draw' as const},
  {at: W.plate1, do: 'pulse' as const},
  {at: W.plate3, do: 'pulse' as const},
  {at: W.plate5, do: 'pulse' as const},
];
const youCar = (s: number) => ({
  lane: 3,
  body: 'you',
  shape: 'crossover',
  roofRack: true,
  plate: '8KTR 214',
  speed: 10,
  liftAt: rel(YOU_LIFT, s),
  stopAt: rel(YOU_STOP, s),
  lamps: 'auto',
  plateMark: shift(YOU_MARK, s),
  glances: shiftT([W.letter, W.newer], s),
  goAt: rel(GO, s),
});
/** A grey car in lane 2 rolls up beside YOU's during the long red (lines 6–7, in view at 'plate'/'poleClose'; absent at frame 0 and in the loop). */
const greyCar = (s: number) => ({
  lane: 2,
  body: 'extra',
  speed: 9,
  liftAt: rel(W.and6 - 0.5, s),
  stopAt: rel(W.telling + 0.4, s),
  lamps: 'auto',
  goAt: rel(GO + 0.5, s), // a beat after YOU's car
});

const POLE_KEYS = {
  status: true,
  statusPulses: [W.make2, W.color2, W.rack2, W.letter, W.photo + 0.5, W.make7, W.color7],
  ir: [0.3, {from: W.light6, to: W.see6 + 0.1, every: 0.9}],
  shots: [0.3],
  cut: [
    {at: W.reading + 1.0, on: true},
    {at: W.and6 + 0.05, on: false},
  ],
  rings: [W.passed - 0.4, W.passed + 0.1],
  uplink: {at: W.passed - 0.2, draw: 1.0},
};
const pole = (s: number) => ({
  ...POLE_SPOT,
  status: POLE_KEYS.status,
  statusPulses: shiftT(POLE_KEYS.statusPulses, s),
  ir: POLE_KEYS.ir.map((k) => (typeof k === 'number' ? rel(k, s) : {...k, from: rel(k.from, s), to: rel(k.to, s)})),
  shots: shiftT(POLE_KEYS.shots, s),
  cut: shift(POLE_KEYS.cut, s),
  rings: shiftT(POLE_KEYS.rings, s),
  uplink: {...POLE_KEYS.uplink, at: rel(POLE_KEYS.uplink.at, s)},
});
const GHOST = {at: W.guessW, cabinetAt: W.guessW + 0.8, fadeAt: W.but4};

const A = (s: number): Record<string, unknown> => ({
  stopLine: STOP_LINE,
  signal: [
    {at: -99, state: 'red'},
    {at: rel(GREEN, s), state: 'green'},
  ],
  cars: [youCar(s), greyCar(s)],
  pole: pole(s),
  ghost: {...GHOST, at: rel(GHOST.at, s), cabinetAt: rel(GHOST.cabinetAt, s), fadeAt: rel(GHOST.fadeAt, s)},
  drift: 0,
  transition: 'continue',
  ...keys(PATH_A, s),
});

/** The loop: frame 0's keys mirrored by the scene's length, so its last frame is frame 0 (README N5). */
const LOOP = (): Record<string, unknown> => ({
  stopLine: STOP_LINE,
  signal: 'red',
  cars: [
    {
      lane: 3,
      body: 'you',
      shape: 'crossover',
      roofRack: true,
      plate: '8KTR 214',
      speed: 10,
      liftAt: LOOP_LAST + YOU_LIFT,
      stopAt: LOOP_LAST + YOU_STOP,
      lamps: 'auto',
    },
  ],
  pole: {...POLE_SPOT, status: true, ir: [r2(LOOP_LAST + 0.3)], shots: [r2(LOOP_LAST + 0.3)]},
  loop: true,
  drift: 0,
  transition: 'slide',
  ...keys(PATH_LOOP, S.s14),
});

// ------------------------------------------------------------------ B: the records sheet (one key set, video seconds)

const B_PATH = {at: S.s9 + 0.1, rackAt: S.s9 + 0.9, leg2At: S.s9 + 1.1, deskAt: S.s9 + 2.1, pulsesAt: S.s9 + 2.3, pulseEvery: 1.4};
const B_MATCH = [
  {at: W.sightings10 + 0.1, slabs: [3, 9, 15]},
  {at: W.finding, slabs: [6, 18, 21]},
];
const B_PLATEDARK = [{at: W.without, slabs: [6, 18, 21]}];
const B_RULER = {
  at: W.keeping - 0.3,
  days: [
    {at: -20, days: 30},
    {at: W.seven, days: 7},
    {at: W.pick + 0.15, days: 14},
  ],
  batchesAt: W.saved13,
  step: 0.6,
};
const B = (s: number, transition: 'follow' | 'continue'): Record<string, unknown> => ({
  path: {
    at: rel(B_PATH.at, s),
    rackAt: rel(B_PATH.rackAt, s),
    leg2At: rel(B_PATH.leg2At, s),
    deskAt: rel(B_PATH.deskAt, s),
    pulsesAt: rel(B_PATH.pulsesAt, s),
    pulseEvery: B_PATH.pulseEvery,
  },
  slotIn: {at: rel(S.s9 + 0.9, s), slab: 5},
  matches: shift(B_MATCH, s),
  plateDark: shift(B_PLATEDARK, s),
  labelPulses: shiftT([W.labelsW], s),
  query: shiftT([W.get - 0.1, W.doesnt], s),
  ruler: {...B_RULER, at: rel(B_RULER.at, s), days: shift(B_RULER.days, s), batchesAt: rel(B_RULER.batchesAt, s)},
  typing: [{from: rel(W.color10 - 0.3, s), to: rel(W.time10 + 0.4, s)}],
  leanAt: shiftT([W.doesnt], s),
  mouseAt: shiftT([W.pick - 0.3], s),
  drift: 0,
  transition,
  ...(transition === 'follow' ? {follow: {direction: 'up'}} : {}),
  ...keys(PATH_B, s),
});

// ------------------------------------------------------------------ camera paths (video seconds, sampled per scene)

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
    // a glide: Hermite between the neighbouring segments' velocities (no stop at either end)
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
const nudge = (f: Framing, dx: number, dy: number, dz = 0, distance = f.distance): Framing => ({
  look: [f.look[0] + dx, f.look[1] + dy, f.look[2] + dz],
  distance,
});
/** Hold framing `f` from a to b while pushing in at `v` units/s (the camera never stops). */
const hold = (f: Framing, a: number, b: number, v: number): PathKey[] => [
  {t: a, f},
  {t: b, f: at(f, f.distance - v * (b - a))},
];
const G = 0.8; // glide length (s)

const PF = (name: 'corner' | 'poleClose' | 'plate' | 'poleSky' | 'poleHead') => cityFraming(name, STOP_LINE, POLE_SPOT);
const A_CORNER = nudge(PF('corner'), 0, 0.4); // the stills over the camera clear the title block
const A_CLOSE = nudge(PF('poleClose'), 0.3, 1.75, 0, 14); // the car under the captions, the box above them
const A_SKY = PF('poleSky');
const A_HEAD = PF('poleHead');
const A_PLATE = nudge(PF('plate'), 0, 1.25); // the plate under the captions
const A_REC = nudge(PF('corner'), -1.0, 0.6, 0, 24); // the record: the pole right of the box, the path up it in the clear
const A_SPEED = 0.12;

/** PATH_A in segments: [start of the framing's glide, framing, push speed]. */
const SEGS_A: [number, Framing, number][] = [
  [S.s2, A_CLOSE, 0.08],
  [S.s3, A_SKY, 0.08],
  [S.s4, A_CLOSE, 0.08],
  [S.s5, A_HEAD, 0.02],
  [S.s6, A_PLATE, 0.06],
  [W.telling, A_CLOSE, 0.08],
  [S.s8, A_REC, 0.1],
];
const buildPath = (first: Framing, firstSpeed: number, t0: number, segs: [number, Framing, number][], tEnd: number): PathKey[] => {
  const out: PathKey[] = [];
  let cur = first;
  let curT = t0;
  let curV = firstSpeed;
  out.push({t: t0 - 4, f: at(first, first.distance + firstSpeed * 4)});
  for (const [t, f, v] of segs) {
    const pushed = at(cur, cur.distance - curV * (t - curT));
    out.push({t, f: pushed});
    out.push({t: t + G, f, ease: 'glide'});
    cur = f;
    curT = t + G;
    curV = v;
  }
  out.push(...hold(cur, curT, tEnd + 2, curV).slice(1));
  return out;
};
const PATH_A = buildPath(A_CORNER, A_SPEED, 0, SEGS_A, S.s9);

const RF = recordsFramings({});
const B_CHAIN = RF.chain;
const B_DESK = nudge(RF.desk, 0, 0.5); // the extra under the captions' band, the box above
const B_RACKS = RF.racks;
const B_RULER_F = nudge(RF.ruler, 0, -0.2); // the ruler above the captions, its labels under it
const B_DESKRULER = nudge(RF.deskRuler, -0.8, 0, 0, RF.deskRuler.distance - 2); // closer: the ruler's step to 14 reads
const PATH_B = buildPath(
  B_CHAIN,
  0.1,
  S.s9,
  [
    [S.s9 + 1.4, B_DESK, 0.06],
    [W.labels12, B_RACKS, 0.06],
    [S.s11, B_RULER_F, 0.08],
    [S.s13, B_DESKRULER, 0.08],
  ],
  S.s14,
);

/** The loop: a slow push that lands exactly on frame 0's framing (D0) on the last frame. */
const PATH_LOOP: PathKey[] = [
  {t: S.s14 - 1, f: at(A_CORNER, A_CORNER.distance + A_SPEED * (LOOP_LAST + 1))},
  {t: LAST_T, f: A_CORNER},
  {t: LAST_T + 1, f: at(A_CORNER, A_CORNER.distance - A_SPEED)},
];

// ------------------------------------------------------------------ overlays

const titleBlock: OverlaySpec = {
  type: 'title',
  at: 0,
  question: 'How does a plate camera\nknow your car?',
  number: 'No. 015',
  title: 'The Corner',
  time: '2:14 PM',
  top: 288,
  carry: true,
  until: 9.0,
} as OverlaySpec;

const BOX_TOP = 560;
/** A camera-view box from video time a to b in the scene at s; its own times are seconds after it enters. */
const camBox = (a: number, b: number, s: number, extra: Record<string, unknown>): OverlaySpec =>
  ({type: 'detail', content: 'camera-view', anchor: 'housing', side: 'left', top: BOX_TOP, at: rel(a, s), until: rel(b, s), ...extra}) as OverlaySpec;
const inBox = (t: number, a: number) => r2(t - a);

const callout = (anchor: string, title: string, sub: string | undefined, a: number, b: number, s: number, extra: Record<string, unknown> = {}): OverlaySpec =>
  ({type: 'callout', anchor, title, ...(sub ? {sub} : {}), place: 'above', dy: -160, at: rel(a, s), until: rel(b, s), ...extra}) as OverlaySpec;

// scene 2: the labels land on line 2
const BOX2_IN = S.s2 + 0.35;
const box2 = camBox(BOX2_IN, S.s3 - 0.05, S.s2, {
  view: 'color',
  marks: [
    {at: inBox(W.make2, BOX2_IN), mark: 'badge'},
    {at: inBox(W.color2, BOX2_IN), mark: 'color'},
    {at: inBox(W.color2 + 0.55, BOX2_IN), mark: 'body'},
    {at: inBox(W.rack2, BOX2_IN), mark: 'rack'},
  ],
});
// scene 4: the photo analysed
const BOX4_IN = W.analyzing - 0.4; // in just before the scan: no empty box
const box4 = camBox(BOX4_IN, S.s5 - 0.05, S.s4, {
  view: 'color',
  scanAt: inBox(W.analyzing, BOX4_IN),
  marks: (['rack', 'color', 'badge', 'body'] as const).map((mark, k) => ({at: inBox(W.photo - 0.4 + 0.25 * k, BOX4_IN), mark})),
});
// scene 6: the IR still, letters read; then the colour still, make and color
const BOX6A_IN = W.and6 + 0.1;
const box6a = camBox(BOX6A_IN, W.telling - 0.15, S.s6, {view: 'ir', charsAt: inBox(W.reads, BOX6A_IN)});
const BOX6B_IN = W.telling + 0.05;
const box6b = camBox(BOX6B_IN, S.s7 - 0.05, S.s6, {
  view: 'color',
  marks: [
    {at: 0.1, mark: 'plate'},
    {at: inBox(W.make7, BOX6B_IN), mark: 'badge'},
    {at: inBox(W.color7, BOX6B_IN), mark: 'color'},
  ],
});
// scene 7: training
const BOX7_IN = S.s7 + 0.1;
const box7 = camBox(BOX7_IN, S.s8 - 0.05, S.s7, {
  view: 'training',
  streamAt: 0.3,
  fastAt: inBox(W.sets, BOX7_IN),
  gridCollapseAt: inBox(W.learn, BOX7_IN),
});
// scene 8: the record
const BOX8_IN = W.plate9 - 0.6; // in just before the first field
const box8 = camBox(BOX8_IN, S.s9 - 0.05, S.s8, {
  top: 360, // above the grey car's lamps and plate
  view: 'record',
  fields: [
    {at: 0.3, text: '8KTR 214'},
    {at: inBox(W.labels9, BOX8_IN), text: 'LIGHT BLUE'},
    {at: inBox(W.labels9 + 0.15, BOX8_IN), text: 'SUV'},
    {at: inBox(W.labels9 + 0.3, BOX8_IN), text: 'ROOF RACK'},
    {at: inBox(W.labels9 + 0.45, BOX8_IN), text: 'MAKE', badge: true},
    {at: inBox(W.when9, BOX8_IN), text: 'TUE · 2:14 PM'},
    {at: inBox(W.where9, BOX8_IN), text: 'ELM ST · CAMERA 12'},
  ],
  savedAt: inBox(W.passed - 0.5, BOX8_IN),
});

// B: the search and settings boxes on the monitor
const ROWS = (a: number) => [
  {at: inBox(W.get + 0.1, a), plate: '8KTR 214', label: 'LIGHT BLUE', time: '2:14 PM', match: inBox(W.match10, a)},
  {at: inBox(W.get + 0.3, a), plate: '5LRT 902', label: 'LIGHT BLUE', time: '2:31 PM', match: inBox(W.match10, a)},
  {at: inBox(W.get + 0.5, a), plate: '3VXF 683', label: 'LIGHT BLUE', time: '2:47 PM', match: inBox(W.match10, a)},
];
const QUERY = (a: number) => [
  {at: Math.max(0.1, inBox(W.color10, a)), text: 'LIGHT BLUE'},
  {at: Math.max(0.25, inBox(W.make10, a)), text: 'MAKE', badge: true},
  {at: Math.max(0.4, inBox(W.place10, a)), text: 'ELM ST'},
  {at: inBox(W.time10, a), text: '2–3 PM'},
];
const BOX9_IN = W.time10 - 0.5; // in late in the query, so the results area isn't empty for long
const box9: OverlaySpec = {type: 'detail', content: 'search', anchor: 'monitor', at: rel(BOX9_IN, S.s9), until: rel(S.s10 - 0.05, S.s9), query: QUERY(BOX9_IN), results: ROWS(BOX9_IN)} as OverlaySpec;
const BOX10_IN = S.s10 + 0.05;
const box10: OverlaySpec = {
  type: 'detail',
  content: 'search',
  anchor: 'monitor',
  at: 0.05,
  until: rel(W.labels12 - 0.1, S.s10),
  query: QUERY(BOX10_IN).map((q) => ({...q, at: 0})),
  results: [
    ...ROWS(BOX10_IN).map((r) => ({...r, at: 0, match: 0})),
    {at: inBox(W.paper - 0.3, BOX10_IN), plate: 'PAPER TAG', odd: true, label: 'LIGHT BLUE', time: '2:20 PM', match: inBox(W.finding, BOX10_IN)},
    {at: inBox(W.covered - 0.3, BOX10_IN), plate: 'COVERED', odd: true, label: 'LIGHT BLUE', time: '2:38 PM', match: inBox(W.finding, BOX10_IN)},
    {at: inBox(W.missing - 0.3, BOX10_IN), plate: 'NO PLATE', odd: true, label: 'LIGHT BLUE', time: '2:52 PM', match: inBox(W.finding, BOX10_IN)},
  ],
} as OverlaySpec;
const BOX13_IN = S.s13 + 0.9;
const box13: OverlaySpec = {
  type: 'detail',
  content: 'settings',
  anchor: 'monitor',
  at: rel(BOX13_IN, S.s13),
  until: rel(S.s14 - 0.05, S.s13),
  days: [
    {at: 0, value: 7},
    {at: inBox(W.pick + 0.15, BOX13_IN), value: 14},
  ],
  rangeAt: inBox(W.within, BOX13_IN),
} as OverlaySpec;

// ------------------------------------------------------------------ scenes

const scenes: SceneSpec[] = [
  // ---- A: the corner
  {scene: 'city-slice', cue: "Flock cameras don't just", props: A(S.s1), overlays: [titleBlock]},
  {scene: 'city-slice', cue: 'they also pick out', props: A(S.s2), overlays: [box2]},
  {
    scene: 'city-slice',
    cue: "You'd guess the camera",
    props: A(S.s3),
    overlays: [callout('ghost', 'Registration records', 'The guess', W.registration3 - 0.1, S.s4 - 0.1, S.s3)],
  },
  {scene: 'city-slice', cue: 'But in its own letter', props: A(S.s4), overlays: [box4]},
  {
    scene: 'city-slice',
    cue: 'Reading the plate is',
    props: A(S.s5),
    overlays: [callout('ledRing', 'Infrared light', 'Invisible to the eye', W.light6 + 0.2, S.s6 - 0.1, S.s5, {dy: -280})],
  },
  {scene: 'city-slice', cue: 'and software reads the letters', props: A(S.s6), overlays: [box6a, box6b]},
  {scene: 'city-slice', cue: 'After training on large sets', props: A(S.s7), overlays: [box7]},
  {scene: 'city-slice', cue: 'Each sighting is then saved', props: A(S.s8), overlays: [box8]},
  // ---- B: the records sheet
  {scene: 'records-slice', cue: 'A search can ask', props: B(S.s9, 'follow'), overlays: [box9]},
  {scene: 'records-slice', cue: 'The company says a paper', props: B(S.s10, 'continue'), overlays: [box10]},
  {
    scene: 'records-slice',
    cue: "Flock's default for keeping",
    props: B(S.s11, 'continue'),
    overlays: [callout('tick:30', '30 days', 'Old default', W.thirty - 0.2, S.s12 - 0.1, S.s11, {dy: -70})],
  },
  {
    scene: 'records-slice',
    cue: 'and since August 2026',
    props: B(S.s12, 'continue'),
    overlays: [callout('tick:7', '7 days', 'New police customers', W.seven, S.s13 - 0.1, S.s12, {dy: -150})],
  },
  {scene: 'records-slice', cue: 'The company says whoever', props: B(S.s13, 'continue'), overlays: [box13]},
  // ---- A again: the loop (frame 0's picture on the last frame)
  {scene: 'city-slice', cue: "If there's one near", props: LOOP()},
];

// ------------------------------------------------------------------ sound (hybrid-city's `BEDS` pattern)

/**
 * Measured with the bundled ffmpeg `loudnorm` (integrated LUFS): voice −22.00, music −15.90, city −32.45, idle −20.44,
 * engine-work −20.44, hum −30.44 (`sfx:cabfan`), shutter −26.55 (`sfx:click --name shutter`, 0.39 s: measured padded
 * to 2 s with silence, since it's shorter than one 400 ms gating block). volume = (voice − dB under) − file. Beds sit
 * 25 dB under, the engines 21, the shutter 20. At most two beds at once (the idle → pull-away hand-off crosses over
 * 0.5 s). Physical sounds only. The city, idle and engine files are hybrid-city's own self-made ones.
 */
const VOICE_LUFS = -22.0;
const vol = (under: number, lufs: number) => r2(VOICE_LUFS - under - lufs);
const BEDS = {
  idle: {name: 'idle', volume: vol(21, -20.44)}, // −22.56: YOU's car at the red
  work: {name: 'engine-work', volume: vol(21, -20.44)}, // −22.56: the pull-away on green
  city: {name: 'city', volume: vol(25, -32.45)}, // −14.55: the corner's outdoor bed
  hum: {name: 'hum', volume: vol(25, -30.44)}, // −16.56: the server room's cooling fans
} as const;
type Bed = keyof typeof BEDS;
/** Music (owner-approved, 73 s): 9 dB under the voice from frame 0, no duck, fading to silence on the last frame. */
const MUSIC = {level: vol(9, -15.9), duckDb: 0, startAt: 0, fadeIn: 1.5, fadeOut: 1.5} as const; // −15.1 (hybrid's "music up a bit")
/** The pole's capture flash (`shots`, 0.3 s at frame 0): a one-shot shutter click. */
const SHUTTER: OverlaySpec = {type: 'sfx', name: 'shutter', volume: vol(20, -26.55), at: POLE_KEYS.shots[0]} as OverlaySpec; // −15.45

/** YOU's car is out of frame ≈ 39.0 s (still at 38.0). */
const AWAY = r2(GO + 3.4);
/** One bed's span in a scene, in video seconds: [from, to] (to = null: until the scene's cut). */
type Span = {bed: Bed; from?: number; to?: number | null; fade?: number};
/** Beds per scene (1-based). */
const SOUND: Record<number, Span[]> = {
  // frame 0: both beds fade in from silence (the loop scene fades them out to silence: the seam matches)
  1: [{bed: 'city'}, {bed: 'idle'}],
  2: [{bed: 'city'}, {bed: 'idle'}],
  3: [{bed: 'city'}, {bed: 'idle'}],
  4: [{bed: 'city'}, {bed: 'idle'}],
  5: [{bed: 'city'}, {bed: 'idle'}],
  6: [{bed: 'city'}, {bed: 'idle'}], // the grey car rolls in and stops beside YOU's
  7: [{bed: 'city'}, {bed: 'idle'}],
  8: [{bed: 'city'}, {bed: 'idle', to: GO + 0.5, fade: 0.5}, {bed: 'work', from: GO, to: AWAY, fade: 0.6}], // green: the pull-away
  9: [{bed: 'hum'}],
  10: [{bed: 'hum'}],
  11: [{bed: 'hum'}],
  12: [{bed: 'hum'}],
  13: [{bed: 'hum'}],
  14: [{bed: 'city'}, {bed: 'idle', from: r2(S.s14 + LOOP_LAST + YOU_LIFT)}], // from the car's braking; both out by the last frame
};
const sfxFor = (n: number): OverlaySpec[] => {
  const s = STARTS[n - 1];
  const len = r2(endOf(s) - s);
  const nextBeds = new Set((SOUND[n + 1] ?? []).filter((x) => x.from === undefined).map((x) => x.bed));
  return (SOUND[n] ?? []).map((sp) => {
    const loopEnd = n === 14; // the seam: faded out exactly on the last frame
    const carries = sp.to === undefined && nextBeds.has(sp.bed) && !loopEnd;
    const until = sp.to != null ? rel(sp.to, s) : carries ? r2(len + 0.5) : len; // a continued bed's fades cross at the join
    return {type: 'sfx', ...BEDS[sp.bed], loop: true, fade: sp.fade ?? 1.0, at: sp.from !== undefined ? rel(sp.from, s) : 0, until} as OverlaySpec;
  });
};
scenes.forEach((sc, i) => {
  const extra = [...(i === 0 ? [SHUTTER] : []), ...sfxFor(i + 1)];
  if (extra.length) sc.overlays = [...(sc.overlays ?? []), ...extra];
});

// ------------------------------------------------------------------ cover

/**
 * Cover still (`yarn cover flock-camera`, owner's text, option A): frame 222 (7.4 s, "roof rack"), YOU's car with its
 * rack and the orange plate mark at the red, under the plate-camera pole. The cover draws a detail box only on
 * `section-room` (`Cover.tsx`), so the video's camera-view box isn't on it; the scene alone carries the frame.
 */
const COVER_F = 222;
const COVER_S2 = Math.round(S.s2 * 30); // scene 2's first rendered frame
const COVER_PROPS = (() => {
  const {cameraKeys: _k, transition: _t, ...rest} = A(S.s2);
  void _k;
  void _t;
  return {...rest, drift: 0};
})();

export const spec: VideoSpec = {
  cover: {
    text: 'A plate camera\nreads more than the plate',
    size: 130,
    scene: 'city-slice',
    camera: nudge(framingOnPath(PATH_A, COVER_F / 30), 0, -1.3, 0, 15),
    at: (COVER_F - COVER_S2) / 30,
    props: COVER_PROPS,
  },
  tail: TAIL,
  music: MUSIC,
  scenes,
};
