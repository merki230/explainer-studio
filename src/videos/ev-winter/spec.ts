/* eslint-disable @remotion/non-pure-animation -- false positive: `transition` keys in scene props are data, not CSS transitions */
import type {OverlaySpec, SceneSpec, VideoSpec} from '../../types';
import {COLD_LAB_FRAMINGS} from '../../scenes/ColdLabScene';
import {speedAt, type SpeedKey} from '../../scenes/keyframes';
import {plugSheetFramings, type PlugSheetSceneProps} from '../../scenes/PlugSheetScene';
import {CAR_LAYOUT} from '../../three/real/RealCar';
import {CAR, TWINS} from '../../theme';
import transcript from './transcript.json';

/**
 * No. 017 · Why do EVs lose range in winter? (`av-script.md` draft 2, cut on the recorded take: 64.08 s of voice, a
 * 1.5 s tail, F14).
 *
 * Locations: W `city-twin` winter (YOU's EV crossover on top, its gas twin below) · L `cold-lab` · H `city-twin` highway
 * (the EV alone) · Wm `city-twin` mild (spring) · G `plug-sheet` (the home garage alone, a snowy morning). W → L → W → H
 * → W → Wm → W → G → W: eight slides; every other hand-over is `continue`, the camera on one path per visit (video
 * clock, sampled per frame, ev-cost's pattern). Orange = heat and the energy spent making it (gas waste heat, the EV's
 * heater feed, the heat pump, the seat and wheel, the wall's power while preheating). Range gauge, thermometer and regen
 * in ink. The loop: the last scene (W, `loop`) lands on frame 0 (both twins stopped at the red, the gas heat on frame 0's
 * phase, the EV's box dark, the camera on frame 0's framing and push).
 */

const WORDS = (transcript as {words: {text: string; start: number; end: number}[]}).words;
const norm = (x: string) => x.toLowerCase().replace(/[^a-z0-9']/g, '');
const PHRASES: [string, string][] = [
  ['heats', 'heats'],
  ['it1', 'it was going'],
  ['throw', 'throw away'],
  ['an2', 'an ev has to'],
  ['make', 'make'],
  ['from2', 'from the same'],
  ['battery2', 'battery'],
  ['drives', 'drives'],
  ['youve', "you've probably heard"],
  ['heard', 'heard'],
  ['cold3', 'cold'],
  ['drains', 'drains'],
  ['but4', 'but in one lab'],
  ['one4', 'one lab'],
  ['lab', 'lab'],
  ['twenty', '20 degrees'],
  ['range5', 'range fell'],
  ['percent5a', 'percent'],
  ['heater5', 'heater off'],
  ['about5', 'about 40'],
  ['percent5b', 'percent'],
  ['most', 'most of that'],
  ['that5', 'that was'],
  ['heater5b', 'heater'],
  ['the6', 'the cold slows'],
  ['battery6', 'battery too'],
  ['braking', 'braking'],
  ['recovers', 'recovers'],
  ['energy', 'energy'],
  ['and7', 'and the heater draws'],
  ['heater7', 'heater draws'],
  ['every', 'every minute'],
  ['short7', 'short trips hurt'],
  ['hurt', 'hurt'],
  ['test8', 'test drivers lost'],
  ['quarter', 'quarter'],
  ['range8', 'range on'],
  ['and9', 'and earlier tests'],
  ['found', 'found'],
  ['half', 'half'],
  ['short9', 'short trips'],
  ['that10', 'that lost range'],
  ['range10', 'range returns'],
  ['returns', 'returns'],
  ['spring', 'spring'],
  ['without', 'without lasting'],
  ['harm', 'harm'],
  ['k30', '30000'],
  ['until', 'until then'],
  ['pump', 'pump'],
  ['moving', 'moving'],
  ['outside', 'outside'],
  ['instead11', 'instead'],
  ['but11', 'but less in deep'],
  ['less11', 'less'],
  ['deep', 'deep cold'],
  ['seat', 'seat and'],
  ['steering', 'steeringwheel'],
  ['help12', 'help too'],
  ['but12', 'but test drivers using'],
  ['drivers12', 'drivers using'],
  ['only', 'only those'],
  ['uncomf', 'uncomfortably'],
  ['the13', 'the usual advice'],
  ['preheat', 'preheat'],
  ['while', 'while'],
  ['plugged', 'plugged'],
  ['so14', 'so the heater runs'],
  ['heater14', 'heater runs'],
  ['wall', 'on wall power'],
  ['instead14', 'instead of the battery'],
  ['battery14', 'battery'],
  ['do', 'do you warm'],
  ['warm', 'warm'],
  ['before', 'before'],
  ['unplugging', 'unplugging'],
];
const W = (() => {
  const out: Record<string, number> = {};
  let i = 0;
  for (const [key, phrase] of PHRASES) {
    const ws = phrase.split(' ').map(norm);
    let j = i;
    while (j < WORDS.length && !ws.every((x, k) => norm(WORDS[j + k]?.text ?? '') === x)) j++;
    if (j >= WORDS.length) throw new Error(`ev-winter spec: phrase not found in transcript: "${phrase}" (${key})`);
    out[key] = WORDS[j].start;
    i = j;
  }
  out.end = WORDS[WORDS.length - 1].end;
  return out as Record<(typeof PHRASES)[number][0] | 'end', number>;
})();

const FPS = 30;
const TAIL = 1.5; // F14: the loop's glide settles with the captions gone
/** The video's frame count and its last frame's time: the loop lands frame 0's state exactly there. */
const N_FRAMES = Math.round((W.end + TAIL) * FPS);
const LAST = (N_FRAMES - 1) / FPS;

const r2 = (x: number) => Math.round(x * 100) / 100;
/** A video time → seconds into the scene that starts at `s`. */
const rel = (t: number, s: number) => r2(t - s);
const shift = <T extends {at: number}>(ks: readonly T[], s: number): T[] => ks.map((k) => ({...k, at: rel(k.at, s)}));
const val = (pairs: [number, number][]) => pairs.map(([at, value]) => ({at, value}));

// ------------------------------------------------------------------ scene starts (video seconds)

const S = {
  s1: 0, // W, frame 0
  s2: W.an2,
  s3: W.youve,
  s4: W.but4, // slide → L
  s5: W.range5,
  s6: W.the6, // slide → W
  s7: W.and7,
  s8: W.test8, // slide → H
  s9: W.and9, // slide → W
  s10: W.that10, // slide → Wm (spring)
  s11: W.until, // slide → W
  s12: W.seat,
  s13: W.the13, // slide → G
  s14: W.so14,
  s15: W.do, // slide → W, the loop
};
const STARTS = Object.values(S);
const endOf = (start: number) => STARTS.find((x) => x > start + 1e-6) ?? N_FRAMES / FPS;
const LOOP_LEN = r2(N_FRAMES / FPS - S.s15);

// ------------------------------------------------------------------ the camera on the video clock (ev-cost's pattern)

type V3 = [number, number, number];
type Framing = {look: V3; distance: number};
type PathKey = {t: number; f: Framing; ease?: 'lin' | 'glide'};
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
/** One camera key per frame of the scene (and 24 frames past its cut, for a slide-out). */
const camKeys = (path: PathKey[], start: number) => {
  const f0 = Math.round(start * FPS);
  const n = Math.round(endOf(start) * FPS) - f0 + 24;
  const out: {at: number; look: V3; distance: number}[] = [];
  for (let k = 0; k <= n; k++) {
    const f = framingOnPath(path, (f0 + k) / FPS);
    out.push({
      at: Math.round((k / FPS) * 10000) / 10000,
      look: f.look.map((x) => Math.round(x * 10000) / 10000) as V3,
      distance: Math.round(f.distance * 10000) / 10000,
    });
  }
  return out;
};
const at = (f: Framing, distance: number): Framing => ({look: f.look, distance});
const nudge = (f: Framing, dx: number, dy: number, distance = f.distance): Framing => ({
  look: [f.look[0] + dx, f.look[1] + dy, f.look[2]],
  distance,
});
/** Hold framing `f` from a to b, pushing in at `v` units/s. */
const pushKeys = (f: Framing, a: number, b: number, v: number): PathKey[] => [
  {t: a, f},
  {t: b, f: at(f, f.distance - v * (b - a))},
];
/** Glide onto `f` at `t0` (G s), then push at `v` until `t1`. */
const glideThenPush = (f: Framing, t0: number, t1: number, v: number): PathKey[] => [
  {t: t0 + G, f, ease: 'glide'},
  {t: t1, f: at(f, f.distance - v * (t1 - t0 - G))},
];
const G = 0.8; // glide length (s)

// ------------------------------------------------------------------ the W framings

const g = 3.0; // the lanes' gap (the scene's default)
/*
 * The framings, set on stills for the vertical frame (the scene's N12 presets frame much tighter than their notes: at
 * `evHeat` 8.6 only the cabin shows). Every subject sits between the title block / counter band and the caption band.
 */
/** Frame 0 and the loop's landing: both front halves stacked, between the title block and the captions. */
const TWIN_HEAT: Framing = {look: [-1.3, 0.75, 0.35], distance: 40};
/** Frame 0's push (units/s), matched by the loop's last second. */
const V0 = 0.25;
const heatAt = (t: number): Framing => at(TWIN_HEAT, TWIN_HEAT.distance - V0 * t);
/** The EV whole: pack, drive unit, HVAC box, YOU. */
const EV_HEAT: Framing = {look: [-0.3, g + 0.45, 0.35], distance: 24};
/** The cut pack close, the near front wheel, the gauges. */
const EV_PACK: Framing = {look: [-0.3, g + 0.05, 0.65], distance: 10};
/** The pack's front, the drive unit, the near front wheel and caliper. */
const EV_FRONT: Framing = {look: [-1.2, g + 0.25, 0.65], distance: 10};
/** The EV whole with the corner's post clock above it. */
const EV_CAR: Framing = {look: [-0.4, g - 0.2, 0.1], distance: 28}; // wheels clear of a two-line caption page
/**
 * The heat pump from the side, pulled back (brand v0.18.12): the exchanger behind the grille, the compressor and the HVAC
 * box in one frame, ≈ 0.8 m of air ahead of the grille for the wisps (world x: the car faces −x).
 */
const EV_NOSE: Framing = {look: [-2.05, g + 0.3, 0.45], distance: 10.5};
/** The EV low under the snowy sky (deep cold). */
const EV_SKY: Framing = {look: [-0.4, g + 0.35, 0.1], distance: 36};
/** YOU, the seat, the wheel and the dash. */
const EV_CABIN: Framing = {look: [-0.5, g + 0.55, 0.3], distance: 7.5};
/** Wm: both twins whole, stacked, wider than frame 0. */
const TWIN_SPRING: Framing = {look: [-0.9, 0.85, 0.2], distance: 46};
/** H: the EV low in the frame, sky above it for the counter. */
const H_CRUISE: Framing = {look: [-0.3, g + 0.2, 0.2], distance: 24};

const PATH_W1: PathKey[] = [
  {t: -1, f: heatAt(-1)},
  {t: 0, f: TWIN_HEAT},
  {t: S.s2, f: heatAt(S.s2)},
  ...glideThenPush(EV_HEAT, S.s2, S.s3, 0.06),
  ...glideThenPush(EV_PACK, S.s3, S.s4 + 1, 0.04),
];
const PATH_W2: PathKey[] = [
  ...pushKeys(EV_FRONT, S.s6 - 1, S.s7, 0.03),
  ...glideThenPush(EV_CAR, S.s7, S.s8 + 1, 0.06),
];
const PATH_H: PathKey[] = pushKeys(H_CRUISE, S.s8 - 1, S.s9 + 1, 0.12);
const PATH_W3: PathKey[] = pushKeys(EV_CAR, S.s9 - 1, S.s10 + 1, 0.08);
const PATH_WM: PathKey[] = [
  ...pushKeys(TWIN_SPRING, S.s10 - 1, W.without, 0.15),
  ...glideThenPush(EV_PACK, W.without, S.s11 + 1, 0.04),
];
const PATH_W4: PathKey[] = [
  ...pushKeys(EV_NOSE, S.s11 - 1, W.but11, 0.04),
  ...glideThenPush(EV_SKY, W.but11, S.s12, 0.1),
  ...glideThenPush(EV_CABIN, S.s12, W.but12, 0.02),
  ...glideThenPush(EV_CAR, W.but12, S.s13 + 1, 0.06),
];
/** The loop: slides in wider on frame 0's look point, glides onto frame 0's framing and push by the last frame. */
const PATH_LOOP: PathKey[] = [
  ...pushKeys(at(TWIN_HEAT, TWIN_HEAT.distance + 7), S.s15 - 1, S.s15 + 0.4, 0.3),
  {t: LAST - 1, f: heatAt(-1), ease: 'glide'},
  {t: LAST, f: TWIN_HEAT},
  {t: LAST + 1, f: heatAt(1)},
];

// ------------------------------------------------------------------ W: one drive clock (video seconds)

const WHEEL_C = 2 * Math.PI * CAR_LAYOUT.wheelR;
const ODO_STEP = 1 / 120;
const makeOdo = (ks: SpeedKey[], t0 = -20, t1 = N_FRAMES / FPS + 2) => {
  const table = [0];
  for (let i = 1; i <= (t1 - t0) / ODO_STEP; i++)
    table.push(table[i - 1] + speedAt(ks, t0 + (i - 0.5) * ODO_STEP, 0.8) * WHEEL_C * ODO_STEP);
  return (t: number) => table[Math.max(0, Math.min(table.length - 1, Math.round((t - t0) / ODO_STEP)))];
};
/** 1 mph in rev/s. */
const MPH = 11.9 / 60;
/** The stop line ahead of a standing twin's front tire (past its lead car). */
const LINE_AHEAD = 7.6;
/** Visit 4 (scenes 11–12) has no lead cars (clear air ahead of the nose, brand v0.18.12): the twins stop close to the line. */
const V4_LINE = 2.2;
/** The scene-builder's batch-3 dressing for every car here: blank clusters (no invented speed digits), frost tone for the whites check. */
const CAR_LOOK = {clusterBlank: true, frostTone: 0.8};
/** The winter trees shifted along the street, so bark stays clear of the EV's outline at frame 0 and the far framings (brand § 1 F10). */
const TREE_SHIFT = 2.8; // the builder's 4.5 put bark on the gas twin at this frame 0; 2.8 clears both twins by more than a wheel
const stopRamp = (from: number, to: number, v0: number) =>
  [0.75, 0.5, 0.25, 0].map((k, i) => ({at: r2(from + ((to - from) * (i + 1)) / 4), speed: r2(v0 * k)}));
const away = (green: number, top: number): SpeedKey[] => [
  {at: r2(green + 0.35), speed: 0},
  {at: r2(green + 0.75), speed: r2(Math.min(top, 1.6))},
  {at: r2(green + 1.4), speed: r2(Math.min(top, 3.0))},
  {at: r2(green + 2.2), speed: top},
];

// visit 1 (scenes 1–3): frame 0's red, green on "it", away, the next red
const GREEN1 = W.it1;
const C1 = 20 * MPH;
const REST1 = 9.9;
// visit 2 (scenes 6–7): rolling in, the red on "braking", green on "short trips", a short hop in traffic
const C2 = 15 * MPH;
const REST2 = W.energy;
const GREEN2 = W.short7 - 0.1;
const REST2B = W.hurt + 0.9;
// visit 3 (scene 9): from a traffic stop, the red on "found"
const REST3 = W.half + 0.35;
// visit 4 (scenes 11–12): from the red, green before "moving", the red at "deep cold", green, the red at the end
const GREEN4 = W.moving - 0.6;
const C4 = 15 * MPH;
const REST4 = W.deep + 0.8;
const GREEN4B = W.help12 - 0.2;
const REST4B = 55.0;

const DRIVE: SpeedKey[] = [
  {at: -20, speed: 0},
  ...away(GREEN1, C1),
  {at: 7.0, speed: C1},
  ...stopRamp(7.0, REST1, C1),
  // visit 2
  {at: 19.0, speed: 0},
  {at: 20.0, speed: C2},
  {at: r2(REST2 - 1.95), speed: C2},
  ...stopRamp(REST2 - 1.95, REST2, C2),
  ...away(GREEN2, 2.2).slice(0, 2),
  {at: r2(W.hurt), speed: 2.0},
  ...stopRamp(W.hurt, REST2B, 2.0),
  // visit 3
  {at: r2(W.and9 + 0.2), speed: 0},
  {at: r2(W.and9 + 0.7), speed: 1.6},
  {at: r2(W.found), speed: 2.2},
  ...stopRamp(W.found, REST3, 2.2),
  // visit 4
  {at: r2(S.s11), speed: 0},
  ...away(GREEN4, C4),
  {at: r2(REST4 - 1.6), speed: C4},
  ...stopRamp(REST4 - 1.6, REST4, C4),
  ...away(GREEN4B, C4),
  {at: r2(REST4B - 1.5), speed: C4},
  ...stopRamp(REST4B - 1.5, REST4B, C4),
];
const odo = makeOdo(DRIVE);

/** The lead cars: the twins' braking exactly, their greens `LEAD_EARLY` s sooner (ev-cost's model). */
const LEAD_EARLY = 0.3;
const GREENS = [GREEN1, GREEN2, W.and9 - 0.2, GREEN4, GREEN4B];
const LEAD_DRIVE: SpeedKey[] = DRIVE.map((k) =>
  GREENS.some((gr) => k.at > gr + 0.05 && k.at < gr + 2.25) ? {...k, at: r2(k.at - LEAD_EARLY)} : k,
);
const leadOdo = makeOdo(LEAD_DRIVE);
/** Each run's lead gap at its start (visit 4: further ahead, so the nose framing has clear air, brand v0.18.12). */
const LEAD_RUNS: [number, number][] = [
  [S.s1, 1.0],
  [S.s6, 1.0],
  [S.s9, 1.0],
  [S.s11, 2.8],
];
const leadGapAt = (t: number) => {
  const [run, gap] = [...LEAD_RUNS].reverse().find(([x]) => x <= t + 1e-6) ?? LEAD_RUNS[0];
  return r2(gap + leadOdo(t) - leadOdo(run) - (odo(t) - odo(run)));
};

type Lens = 'red' | 'yellow' | 'green' | 'off';
type Corner = {at: number; lights: {at: number; state: Lens}[]; run?: number; post?: number};
const corner = (rest: number, lights: [number, Lens][], ahead = LINE_AHEAD, post?: number): Corner => ({
  run: rest,
  ...(post !== undefined ? {post} : {}),
  at: odo(rest) + ahead,
  lights: [
    {at: -20, state: lights.length && lights[0][1] === 'red' ? 'red' : 'green'},
    ...lights.map(([a, state]) => ({at: r2(a), state})),
  ],
});
const CORNERS: Corner[] = [
  // frame 0's corner: red until the green on "it"
  {
    at: LINE_AHEAD,
    lights: [
      {at: -20, state: 'red'},
      {at: r2(GREEN1), state: 'green'},
    ],
    run: S.s1,
  },
  corner(REST1, [
    [6.2, 'yellow'],
    [7.0, 'red'],
  ]),
  corner(REST2, [
    [REST2 - 2.8, 'yellow'],
    [REST2 - 2.0, 'red'],
    [GREEN2, 'green'],
  ]),
  corner(REST3, [
    [W.and9 + 0.5, 'yellow'],
    [W.found - 0.1, 'red'],
  ]),
  corner(
    S.s11,
    [
      [-20, 'red'],
      [GREEN4, 'green'],
    ],
    5.0, // further: its head stays out of the heat pump's air ahead of the grille
    0,
  ),
  corner(
    REST4,
    [
      [REST4 - 2.6, 'yellow'],
      [REST4 - 1.8, 'red'],
      [GREEN4B, 'green'],
    ],
    V4_LINE,
    0, // the head at the stop line, right ahead: red over each stop, and a passed head is out of frame before the next one
  ),
  corner(
    REST4B,
    [
      [REST4B - 2.0, 'yellow'],
      [REST4B - 1.3, 'red'],
    ],
    V4_LINE,
    0,
  ),
];
/** The run (the first scene of a W visit) a time belongs to: each visit has its own corners (one odometer, many streets). */
const RUNS = [S.s1, S.s6, S.s9, S.s11];
const runOf = (t: number) => [...RUNS].reverse().find((x) => x <= t + 1e-6) ?? RUNS[0];
const cornersIn = (s: number) =>
  CORNERS.filter((c) => runOf(c.run ?? 0) === runOf(s)).map((c) => ({
    ahead: r2(c.at - odo(s)),
    when: 0,
    ...(c.post !== undefined ? {post: c.post} : {}),
    lights: shift(c.lights, s),
  }));

/** The corner's post clock (N6): one per run, standing 3 m ahead of the car at a rest (8:10, minute jumps 🎭). */
const clockAt = (s: number, rest: number, time: number, ticks: number[] = []) => ({
  ahead: 3.0,
  when: rel(rest, s),
  time,
  ticks: ticks.map((x) => rel(x, s)),
});

// ------------------------------------------------------------------ W: the cars' keys (video seconds)

/** The gas twin's puffs (grey vapour): frame 0's puff is the loop's last one, at the same age (the seam). */
const PUFF_LOOP = 64.4;
const PUFFS: [number, number][] = [
  [-(LAST - PUFF_LOOP), 1],
  [1.4, 1],
  [GREEN1 + 0.3, 1.6],
  [REST1 + 0.5, 1],
  [REST2 + 0.4, 1],
  [GREEN2 + 0.3, 1.4],
  [REST3 + 0.4, 1],
  [S.s11 + 0.6, 1],
  [GREEN4 + 0.3, 1.6],
  [REST4 + 0.5, 1],
  [GREEN4B + 0.3, 1.4],
];
const RPM: [number, number][] = [
  [-20, 800],
  [GREEN1, 800],
  [GREEN1 + 0.4, 2600],
  [GREEN1 + 2.2, 1800],
  [7.0, 1200],
  [REST1, 800],
  [19.0, 1600],
  [REST2 - 1.9, 1200],
  [REST2, 800],
  [GREEN2, 800],
  [GREEN2 + 0.4, 2000],
  [REST2B, 800],
  [W.and9 + 0.2, 800],
  [W.and9 + 0.6, 2000],
  [REST3, 800],
  [GREEN4, 800],
  [GREEN4 + 0.4, 2600],
  [GREEN4 + 2.2, 1600],
  [REST4, 800],
  [GREEN4B, 800],
  [GREEN4B + 0.4, 2200],
  [REST4B, 800],
];

/** The EV's heater: on at "make" (scene 2), the feed from the pack fading when the heat pump takes over, off at "drivers". */
const EV_ON = val([
  [-20, 0],
  [W.make, 0],
  [W.make + 0.2, 1],
  [W.drivers12, 1],
  [W.drivers12 + 0.4, 0],
]);
const EV_FEED = {at: W.make, drawFor: 1.2, fadeAt: W.pump};
/** The element's "made by" glow: off once the heat pump has drawn in (it moves the heat instead of making it; F7). */
const EV_ELEMENT = val([
  [-20, 1],
  [W.pump + 0.6, 1],
  [W.pump + 1.2, 0],
]);
/** The heater line's surges (§ 5): "that" (the Lab line's echo is the Lab's own), "heater" in scene 7. */
const EV_SURGE = val([
  [-20, 0],
  [W.heater7 - 0.1, 0],
  [W.heater7 + 0.15, 1],
  [W.heater7 + 0.9, 0],
]);
/** The ink range gauge: down a tick at "battery", at each clock jump, at "half"; refilled in spring; slower ticks after. */
const STEP = 0.08;
const tickDown = (t: number, from: number): [number, number][] => [
  [t, from],
  [t + 0.15, r2(from - STEP)],
];
const RANGE = val([
  [-20, 1],
  ...tickDown(W.battery2, 1),
  ...tickDown(W.every, 0.92),
  ...tickDown(W.hurt, 0.84),
  ...tickDown(W.half, 0.76),
  [W.range10, 0.68],
  [W.range10 + 0.8, 1],
  [W.instead11, 1],
  [W.instead11 + 0.15, 0.96],
  [W.help12, 0.96],
  [W.help12 + 0.15, 0.93],
]);
/** The ink thermometer: falls on "cold", rises in spring ("spring"), low again after. */
const THERMO = val([
  [-20, 0.6],
  [W.cold3, 0.6],
  [W.cold3 + 1.0, 0.22],
  [W.spring - 0.1, 0.22],
  [W.spring + 0.8, 0.8],
  [S.s11 - 0.1, 0.8],
  [S.s11, 0.22],
]);
/** The cold cue on the cells (N3): tinting on "cold", plain in spring. */
const PACK_COLD = val([
  [-20, 0],
  [W.cold3, 0],
  [W.cold3 + 1.0, 0.5],
]);
/** Frost on the EV's glass: thicker on "drains", creeping back inside in scene 12. */
const EV_FROST = val([
  [-20, 0.55],
  [W.drains, 0.55],
  [W.drains + 1.2, 0.75],
  [W.only + 0.5, 0.75],
  [W.only + 1.5, 0.9],
]);

const gaugeOn = (s: number, from: number | null, to: number | null) =>
  shift(
    val([
      [-20, from === null ? 1 : 0],
      ...(from === null
        ? []
        : ([
            [from, 0],
            [from + 0.4, 1],
          ] as [number, number][])),
      ...(to === null
        ? []
        : ([
            [to - 0.4, 1],
            [to, 0],
          ] as [number, number][])),
    ]),
    s,
  );

type WOpts = {
  transition: 'slide' | 'continue';
  path: PathKey[];
  clock?: Record<string, unknown> | false;
  thermo?: boolean;
  range?: number | null; // when the gauge draws in (null: already in)
  top?: Record<string, unknown>;
};
const WIN = (s: number, o: WOpts): Record<string, unknown> => {
  const T = (keys: {at: number; value: number}[]) => shift(keys, s);
  const lead = runOf(s) === S.s11 ? false : {driving: shift(LEAD_DRIVE, s), gap: leadGapAt(s), plate: ''};
  return {
    dressing: 'winter',
    treeShift: TREE_SHIFT,
    snow: {density: 1, maxPx: 6, gusts: [W.heard, W.less11].filter((x) => x > s && x < endOf(s)).map((x) => rel(x, s))},
    driving: shift(DRIVE, s),
    corners: cornersIn(s),
    ...(o.clock ? {postClock: o.clock} : {}),
    top: {
      variant: 'ev',
      ...CAR_LOOK,
      shape: 'crossover',
      storefronts: false,
      lead,
      frost: T(EV_FROST),
      packCold: T(PACK_COLD),
      hvac: {
        kind: 'electric',
        on: T(EV_ON),
        heat: T(EV_ELEMENT),
        wisps: {face: 0},
        feed: {...shift([EV_FEED], s)[0], fadeAt: rel(EV_FEED.fadeAt, s), surge: T(EV_SURGE)},
      },
      rangeGauge: {level: T(RANGE), opacity: o.range === undefined ? 0 : gaugeOn(s, o.range, null)},
      thermometer: {level: T(THERMO), opacity: o.thermo ? 1 : 0},
      ...(o.top ?? {}),
    },
    bottom: {
      variant: 'gas',
      ...CAR_LOOK,
      shape: 'crossover',
      lead,
      rpm: T(val(RPM)),
      exhaust: PUFFS.filter(([t]) => t > s - 2 && t < endOf(s) + 0.6).map(([t, size]) => ({at: rel(t, s), size})),
      gasHeat: {},
      hvac: {kind: 'core', wisps: {face: 0}},
    },
    drift: 0,
    pavement: true,
    wheelStep: 0.25,
    wheelSmearMax: 0.15,
    transition: o.transition,
    cameraKeys: camKeys(o.path, s),
  };
};

// scene 1: the gas twin's heat already running, its blower up on "heats", a pulse and a wave on "throw away"
const scene1Props = (): Record<string, unknown> => {
  const p = WIN(S.s1, {transition: 'continue', path: PATH_W1, clock: clockAt(S.s1, 0, 490)});
  const bottom = p.bottom as Record<string, unknown>;
  return {
    ...p,
    top: {...(p.top as Record<string, unknown>), rangeGauge: null, thermometer: null},
    bottom: {
      ...bottom,
      gasHeat: {
        pulse: [2.5, W.throw],
        radiatorWisps: val([
          [-20, 0.8],
          [W.throw, 0.8],
          [W.throw + 0.3, 1],
          [W.an2, 1],
        ]),
      },
      hvac: {
        kind: 'core',
        blower: val([
          [-20, 0.6],
          [W.heats, 0.6],
          [W.heats + 0.4, 1],
        ]),
        wisps: {
          face: 0,
          level: val([
            [-20, 0.7],
            [W.heats, 0.7],
            [W.heats + 0.5, 1],
          ]),
        },
      },
    },
  };
};

// ------------------------------------------------------------------ the loop (scene time: its last frame is frame 0)

const LDRIVE: SpeedKey[] = [
  {at: -20, speed: 2.0},
  {at: 0.3, speed: 2.0},
  ...stopRamp(0.3, rel(W.unplugging, S.s15) + 0.05, 2.0),
];
const LOOP = (): Record<string, unknown> => ({
  loop: true,
  dressing: 'winter',
  treeShift: TREE_SHIFT,
  snow: {density: 1, maxPx: 6},
  driving: LDRIVE,
  // frame 0's corner, red, on frame 0's mark at the last frame
  corners: [{ahead: LINE_AHEAD, when: LOOP_LEN, lights: [{at: -20, state: 'red'}]}],
  // frame 0's post clock (8:10), on its place at the last frame (`when` defaults to the scene's end with `loop`)
  postClock: {ahead: 3.0, time: 490},
  top: {
    variant: 'ev',
    ...CAR_LOOK,
    shape: 'crossover',
    storefronts: false,
    lead: {lag: 0, plate: ''},
    hvac: {kind: 'electric', on: 0, wisps: {face: 0}},
  },
  bottom: {
    variant: 'gas',
    ...CAR_LOOK,
    shape: 'crossover',
    lead: {lag: 0, plate: ''},
    rpm: val([
      [-20, 1400],
      [0.3, 1200],
      [1.4, 800],
    ]),
    exhaust: [{at: rel(PUFF_LOOP, S.s15), size: 1}],
    gasHeat: {radiatorWisps: 0.8},
    hvac: {kind: 'core', blower: 0.6, wisps: {face: 0, level: 0.7}},
  },
  drift: 0,
  pavement: true,
  wheelStep: 0.25,
  wheelSmearMax: 0.15,
  transition: 'slide',
  cameraKeys: camKeys(PATH_LOOP, S.s15),
});

// ------------------------------------------------------------------ H: the winter highway (scene 8)

const H = (): Record<string, unknown> => {
  const s = S.s8;
  return {
    location: 'city-twin-highway',
    road: 'highway',
    dressing: 'winter',
    snow: {density: 1, maxPx: 6},
    bottom: false,
    driving: [{at: -20, speed: 70 * MPH}],
    top: {
      variant: 'ev',
      ...CAR_LOOK,
      shape: 'crossover',
      highwayLane: 'lane',
      frost: 0.75,
      packCold: 0.5,
      hvac: {kind: 'electric', on: 1, wisps: {face: 0}, feed: {at: -1}},
      rangeGauge: {level: shift(val([[-20, 0.84], ...tickDown(W.range8, 0.84)]), s), opacity: 1},
    },
    drift: 0,
    wheelStep: 0.25,
    wheelSmearMax: 0.15,
    transition: 'slide',
    cameraKeys: camKeys(PATH_H, s),
  };
};

// ------------------------------------------------------------------ Wm: the spring corner (scene 10)

const SPRING_GREEN = W.returns;
const SPRING_REST = 41.4;
/** Scene 10's budding trees shifted: no trunk behind the EV's glass at f1100 or in the pack close-up (f1270; 3.0 left one there). Scene 10 only, the seam untouched. */
const SPRING_TREE_SHIFT = 3.8;
const SDRIVE: SpeedKey[] = [
  {at: -20, speed: 0},
  ...away(SPRING_GREEN, 20 * MPH),
  {at: r2(SPRING_REST - 1.6), speed: 20 * MPH},
  ...stopRamp(SPRING_REST - 1.6, SPRING_REST, 20 * MPH),
];
const sodo = makeOdo(SDRIVE);
const SPRING = (): Record<string, unknown> => {
  const s = S.s10;
  const T = (keys: {at: number; value: number}[]) => shift(keys, s);
  return {
    location: 'city-twin-spring',
    dressing: 'spring',
    treeShift: SPRING_TREE_SHIFT,
    driving: shift(SDRIVE, s),
    corners: [
      {
        ahead: LINE_AHEAD,
        when: 0,
        lights: shift(
          [
            {at: -20, state: 'red' as Lens},
            {at: SPRING_GREEN - 0.35, state: 'green' as Lens},
          ],
          s,
        ),
      },
      {
        ahead: r2(sodo(SPRING_REST) + LINE_AHEAD),
        when: 0,
        lights: shift(
          [
            {at: -20, state: 'green' as Lens},
            {at: r2(SPRING_REST - 2.4), state: 'yellow' as Lens},
            {at: r2(SPRING_REST - 1.6), state: 'red' as Lens},
          ],
          s,
        ),
      },
    ],
    top: {
      variant: 'ev',
      ...CAR_LOOK,
      shape: 'crossover',
      storefronts: false,
      lead: {plate: ''},
      frost: 0,
      packCold: 0,
      rangeGauge: {level: T(RANGE), opacity: 1},
      thermometer: {level: T(THERMO), opacity: 1},
    },
    bottom: {
      variant: 'gas',
      shape: 'crossover',
      ...CAR_LOOK,
      lead: {plate: ''},
      rpm: T(
        val([
          [-20, 800],
          [SPRING_GREEN + 0.3, 800],
          [SPRING_GREEN + 0.7, 2400],
          [SPRING_REST - 1.6, 1200],
          [SPRING_REST, 800],
        ]),
      ),
    },
    drift: 0,
    pavement: true,
    wheelStep: 0.25,
    wheelSmearMax: 0.15,
    transition: 'slide',
    cameraKeys: camKeys(PATH_WM, s),
  };
};

// ------------------------------------------------------------------ L: the cold chamber (scenes 4–5)

const LF = COLD_LAB_FRAMINGS;
const CHAMBER: Framing = nudge(LF.chamber, 0.8, -1.6, 26); // the cell above the captions
const DYNO_LOW: Framing = {look: [-0.2, 0.35, 0.0], distance: 22}; // the car whole between the counter and the captions
const DYNO_CABIN: Framing = {look: [-0.9, 0.95, 0.55], distance: 9}; // the HVAC box, the pack and the test driver
const PATH_L: PathKey[] = [
  ...pushKeys(CHAMBER, S.s4 - 1, S.s5, 0.3),
  ...glideThenPush(DYNO_LOW, S.s5, W.most, 0.1),
  ...glideThenPush(DYNO_CABIN, W.most, S.s6 + 1, 0.03),
];
/** The Lab's heater goes on with "and about 40 percent with it on" (reviewer: not while "the heater off" is spoken). */
const LAB_ON = r2(W.about5 - 0.15);
const LAB_DRIVE: SpeedKey[] = [
  {at: -20, speed: 0},
  {at: W.lab, speed: 0},
  {at: W.lab + 1.2, speed: 4.0},
];
const LAB = (s: number, transition: 'slide' | 'continue'): Record<string, unknown> => {
  const T = (keys: {at: number; value: number}[]) => shift(keys, s);
  return {
    driving: shift(LAB_DRIVE, s),
    fans: T(
      val([
        [-20, 0],
        [W.one4, 0],
        [W.one4 + 0.6, 1],
      ]),
    ),
    frost: T(
      val([
        [-20, 0.45],
        [W.twenty, 0.45],
        [W.twenty + 1.5, 0.85],
      ]),
    ),
    thermometer: T(
      val([
        [-20, 0.6],
        [W.twenty, 0.6],
        [W.twenty + 1.0, 0.25],
      ]),
    ),
    technician: {taps: [W.one4, LAB_ON].map((x) => rel(x, s))},
    car: {
      packCold: 0.5,
      hvac: {
        kind: 'electric',
        on: T(
          val([
            [-20, 0],
            [LAB_ON, 0],
            [LAB_ON + 0.2, 1],
          ]),
        ),
        wisps: {face: 0},
        feed: {
          at: rel(LAB_ON, s),
          drawFor: 1.2,
          surge: T(
            val([
              [-20, 0],
              [W.that5 - 0.1, 0],
              [W.that5 + 0.15, 1],
              [W.that5 + 1.0, 0],
            ]),
          ),
        },
      },
      rangeGauge: {
        level: T(
          val([
            [-20, 1],
            [W.percent5a - 0.2, 1],
            [W.percent5a + 0.2, 0.9],
            [W.about5, 0.9],
            [W.percent5b + 0.3, 0.6],
            [W.heater5b, 0.6],
            [W.heater5b + 0.15, 0.53],
          ]),
        ),
        opacity: 1,
      },
      // heater off: the test driver hunched (F8: YOU stands in only on the road; here the Lab's extra)
      gestures: [{pose: 'hunch', at: rel(W.range5 + 0.3, s), hold: r2(LAB_ON + 0.6 - W.range5 - 0.3)}],
    },
    drift: 0,
    transition,
    cameraKeys: camKeys(PATH_L, s),
  };
};

// ------------------------------------------------------------------ G: the garage, a snowy morning (scenes 13–14)

const PF = plugSheetFramings({});
const GARAGE_WIDE = PF.garageWide; // batch 3: lower and wider (door, car, charger, the snowy driveway) // the car above the captions
const GARAGE_FEED = nudge(PF.garageFeed, -0.2, -0.9, 23.5); // the house door whole at the left (YOU comes out of it)
const PATH_G: PathKey[] = [
  ...pushKeys(GARAGE_WIDE, S.s13 - 1, S.s14, 0.15),
  ...glideThenPush(GARAGE_FEED, S.s14, S.s15 + 1, 0.1),
];
const GARAGE = (
  s: number,
  transition: 'slide' | 'continue',
): Partial<PlugSheetSceneProps> & Record<string, unknown> => {
  const T = (keys: {at: number; value: number}[]) => shift(keys, s);
  return {
    clock: 'video',
    time: 460, // 7:40 AM
    pump: false,
    fast: false,
    home: {
      car: {
        frost: T(
          val([
            [-20, 0.7],
            [W.plugged, 0.7],
            [W.plugged + 2.5, 0],
          ]),
        ),
        frostTone: 0.8,
        clusterBlank: true,
        packCold: 0.5,
        hvac: {
          kind: 'electric',
          on: T(
            val([
              [-20, 0],
              [W.preheat, 0],
              [W.preheat + 0.2, 1],
            ]),
          ),
          wisps: {
            face: 0,
            level: T(
              val([
                [-20, 0.7],
                [W.heater14, 0.7],
                [W.heater14 + 0.5, 1],
              ]),
            ),
          },
        },
        rangeGauge: {level: 1, opacity: 1},
      },
      winter: {snow: {density: 0.5, maxPx: 6}},
      preheat: {at: W.preheat, drawFor: 1.2},
      you: {
        start: 'inside',
        keys: [
          {at: 59.6, do: 'walkTo', to: 'houseDoor'},
          {at: W.battery14 + 0.1, do: 'walkTo', to: 'tail'},
        ],
      },
    },
    drift: 0,
    transition,
    cameraKeys: camKeys(PATH_G, s),
  };
};

// ------------------------------------------------------------------ overlays

const titleBlock: OverlaySpec = {
  type: 'title',
  at: 0,
  question: 'Why do EVs lose\nrange in winter?', // F3
  number: 'No. 017',
  title: 'The Cold Corner',
  time: '8:10 AM',
  carry: true,
  until: 8.24,
} as OverlaySpec;

const EV_PAINT = CAR.day.bodies.you;
const gasTag = (a: number, b: number, s: number): OverlaySpec =>
  ({
    type: 'tag',
    who: 'extra',
    anchor: 'top:bottom',
    label: 'GAS',
    color: TWINS.gasPaint,
    outline: 'ink',
    side: 'left',
    below: 'lane:top',
    at: rel(a, s),
    until: rel(b, s),
  }) as OverlaySpec;
const evTag = (a: number, b: number, s: number): OverlaySpec =>
  ({
    type: 'tag',
    who: 'you',
    anchor: 'top:top',
    label: 'ELECTRIC',
    color: EV_PAINT,
    outline: 'ink',
    side: 'left',
    at: rel(a, s),
    until: rel(b, s),
  }) as OverlaySpec;

const COUNTER_AT = {x: 0.111, y: 0.156};
/** A single counter: in at `a`, landing at `land`, out by `b` (video seconds). */
const counter = (s: number, to: number, sub: string, a: number, land: number, b: number): OverlaySpec =>
  ({
    type: 'counter',
    from: 0,
    to,
    label: '%',
    sub2: 'ABOUT',
    sub2Place: 'above',
    sub,
    ...COUNTER_AT,
    at: rel(a, s),
    duration: r2(land - a - 0.3),
    until: rel(b, s),
  }) as OverlaySpec;

/** The rows counter: in just after "range", while the heater is off. */
const LAB_IN = r2(W.range5 + 0.44);

const labRows: OverlaySpec = {
  type: 'counter',
  from: 0,
  rows: [
    {label: 'HEATER OFF', to: 12, stopAt: r2(W.percent5a - LAB_IN)},
    {label: 'HEATER ON', to: 40, startAt: r2(LAB_ON - LAB_IN), stopAt: r2(W.percent5b - LAB_IN)}, // its own clock from the heater going on
  ],
  label: '%',
  sub: 'LESS RANGE · 20°F',
  ...COUNTER_AT,
  at: rel(LAB_IN, S.s5),
  start: 0.2,
  until: rel(W.most - 0.1, S.s5),
} as OverlaySpec;

const callout = (
  title: string,
  sub: string,
  a: number,
  b: number,
  s: number,
  place: {anchor?: string; x?: number; y?: number; dx: number; dy: number; side?: 'side' | 'above'},
): OverlaySpec =>
  ({
    type: 'callout',
    ...(place.anchor ? {anchor: place.anchor} : {x: place.x, y: place.y}),
    title,
    sub,
    subInk: 'ink',
    size: 1.2,
    place: place.side ?? 'side',
    dx: place.dx,
    dy: place.dy,
    at: rel(a, s),
    until: rel(b, s),
  }) as OverlaySpec;

// ------------------------------------------------------------------ scenes

const scenes: SceneSpec[] = [
  // ---- 1–3 W: frame 0, the gas twin's free heat, the EV's paid heat, the cold pack
  {scene: 'city-twin', cue: 'A gas car heats', props: scene1Props(), overlays: [titleBlock, gasTag(0.6, 3.4, S.s1)]},
  {
    scene: 'city-twin',
    cue: 'An EV has to',
    props: WIN(S.s2, {transition: 'continue', path: PATH_W1, clock: clockAt(S.s2, 0, 490), range: W.battery2 - 0.5}),
    overlays: [evTag(4.0, 7.1, S.s2)],
  },
  {
    scene: 'city-twin',
    cue: "You've probably heard",
    props: WIN(S.s3, {transition: 'continue', path: PATH_W1, clock: clockAt(S.s3, 0, 490), range: null, thermo: true}),
  },
  // ---- 4–5 L: the cold chamber, the two numbers, the heater
  {scene: 'cold-lab', cue: 'But in one lab', props: LAB(S.s4, 'slide')},
  {
    scene: 'cold-lab',
    cue: 'range fell 12',
    props: LAB(S.s5, 'continue'),
    overlays: [
      labRows,
      callout('Heater', 'Most of the loss', W.that5 + 0.25, endOf(S.s5) - 0.12, S.s5, {
        x: 0.445,
        y: 0.48,
        dx: 0,
        dy: -330,
        side: 'above',
      }),
    ],
  },
  // ---- 6–7 W: the weak regen, the heater every minute
  {
    scene: 'city-twin',
    cue: 'The cold slows the',
    props: WIN(S.s6, {
      transition: 'slide',
      path: PATH_W2,
      range: null,
      thermo: true,
      clock: clockAt(S.s6, REST2, 490),
      top: {
        regenArrow: {at: rel(W.braking, S.s6), reach: 0.4},
        brakeDust: [{at: rel(W.recovers + 0.15, S.s6), size: 0.35, from: 'caliper'}],
        caliper: {
          front: shift(
            val([
              [-20, 0],
              [W.recovers - 0.1, 0],
              [W.recovers + 0.2, 1],
            ]),
            S.s6,
          ),
        },
      },
    }),
  },
  {
    scene: 'city-twin',
    cue: 'And the heater draws',
    props: WIN(S.s7, {
      transition: 'continue',
      path: PATH_W2,
      range: null,
      clock: clockAt(S.s7, REST2, 490, [W.every, W.hurt]),
      top: {
        caliper: {
          front: shift(
            val([
              [-20, 1],
              [GREEN2 + 0.2, 1],
              [GREEN2 + 0.4, 0],
              [W.hurt, 0],
              [W.hurt + 0.3, 1],
            ]),
            S.s7,
          ),
        },
      },
    }),
  },
  // ---- 8 H: the highway, a quarter
  {
    scene: 'city-twin',
    cue: 'Test drivers lost',
    props: H(),
    overlays: [counter(S.s8, 25, 'LESS RANGE · HIGHWAY', S.s8 + 0.35, W.quarter, endOf(S.s8) - 0.15)],
  },
  // ---- 9 W: short trips, half
  {
    scene: 'city-twin',
    cue: 'and earlier tests found',
    props: WIN(S.s9, {
      transition: 'slide',
      path: PATH_W3,
      range: null,
      clock: {...clockAt(S.s9, REST3, 492, [W.half]), ahead: 0.3, height: 2.2} /* clear of the counter card */,
    }),
    overlays: [counter(S.s9, 50, 'LESS RANGE · SHORT TRIPS', S.s9 + 0.35, W.half, endOf(S.s9) - 0.15)],
  },
  // ---- 10 Wm: spring, the range back, the cells plain
  {scene: 'city-twin', cue: 'That lost range returns', props: SPRING()},
  // ---- 11–12 W: the heat pump, deep cold; seat and wheel, then cold
  {
    scene: 'city-twin',
    cue: 'Until then, a heat',
    props: WIN(S.s11, {
      transition: 'slide',
      path: PATH_W4,
      range: null,
      top: {
        heatPump: {
          at: rel(W.pump, S.s11),
          drawFor: 0.6,
          flowAt: rel(W.moving, S.s11),
          level: shift(
            val([
              [-20, 1],
              [W.deep, 1],
              [W.deep + 0.6, 0.2],
            ]),
            S.s11,
          ),
          feedWidth: shift(
            val([
              [-20, 0.006],
              [W.deep, 0.006],
              [W.deep + 0.6, 0.011],
            ]),
            S.s11,
          ),
          outAt: rel(W.drivers12, S.s11),
        },
      },
    }),
    overlays: [
      callout('Heat pump', 'Moves heat in', W.pump + 0.25, W.pump + 3.3, S.s11, {
        x: 0.496,
        y: 0.417,
        dx: 0,
        dy: -330,
        side: 'above',
      }),
    ],
  },
  {
    scene: 'city-twin',
    cue: 'Seat and steering-wheel',
    props: WIN(S.s12, {
      transition: 'continue',
      path: PATH_W4,
      range: null,
      top: {
        heatPump: {
          at: rel(W.pump, S.s12),
          flowAt: rel(W.moving, S.s12),
          level: 0.2,
          feedWidth: 0.011,
          outAt: rel(W.drivers12, S.s12),
        },
        seatHeat: shift(
          val([
            [-20, 0],
            [W.seat, 0],
            [W.seat + 0.4, 1],
          ]),
          S.s12,
        ),
        wheelHeat: shift(
          val([
            [-20, 0],
            [W.steering, 0],
            [W.steering + 0.4, 1],
          ]),
          S.s12,
        ),
        seatFeed: {at: rel(W.seat - 0.2, S.s12), drawFor: 0.6},
        gestures: [{pose: 'hunch', at: rel(W.only, S.s12)}],
        shiver: [W.only + 0.2, W.uncomf].map((x) => rel(x, S.s12)),
        breath: [53.9, 54.9].map((x) => rel(x, S.s12)),
      },
    }),
  },
  // ---- 13–14 G: preheating on the wall
  {scene: 'plug-sheet', cue: 'The usual advice is', props: GARAGE(S.s13, 'slide')},
  {scene: 'plug-sheet', cue: 'so the heater runs', props: GARAGE(S.s14, 'continue')},
  // ---- 15 W: the question, the loop
  {scene: 'city-twin', cue: 'Do you warm your', props: LOOP()},
];

// ------------------------------------------------------------------ sound (ev-cost's `BEDS` pattern)

/**
 * Measured with the bundled ffmpeg `loudnorm` (integrated LUFS; clips measured looped, so the level while they play):
 * voice −21.61, music −16.31 (owner-approved, 66 s), outdoor −32.29 (`sfx:station --name outdoor`: wind, slow gusts, far
 * traffic), chamber-fans −30.44 (`sfx:cabfan`: the cold chamber's fans), dyno −24.45 (`sfx:hiss --dry --pitch 0.9`: the
 * test car's tires on the rollers), slush −24.43 (`sfx:hiss --pitch 0.6`: wet winter road at town speed, loop),
 * slush-away −24.47 (`sfx:hiss --from 0.2 --to 0.6 --seconds 3`: rolling off a stop onto slush, ends where `slush` starts),
 * hwy-slush −24.46 (`sfx:hiss --pitch 1.5`: the EV at highway speed, no motor), blower −32.40 (`sfx:heaterfan`: the HVAC
 * blower), hum −34.36 (`sfx:pump`: the fixed 72 Hz hum; the garage's electrical hum and the heat pump's compressor),
 * idle −20.52, pull-away −20.48 (800 → 2600 → 1800 rpm, the RPM keys' green swell), brake-soft −18.42, ev-roll −24.48
 * (dry, spring) (those four copied from ev-cost), heater-click −28.65 (`sfx:heater`: the heater relay), relay −29.47
 * (`sfx:contactor --pitch 1.3`: the wall charger's relay, lighter than a fast charger's).
 * volume = (voice − dB under) − file. Beds 25 dB under (chamber fans 23: the Lab's main sound; highway roar 22; blower
 * and compressor 27), the gas engine 21, one-shots 20–22. Physical sounds only, and only for what is in frame: the gas
 * twin's idle and pull-away play where it is (the stacked and `evCar` / `evSky` framings), not in the EV close-ups. The
 * EV makes no motor sound. The orange, the cards, the tags and the clock make none.
 */
const VOICE_LUFS = -21.61;
const vol = (under: number, lufs: number) => r2(VOICE_LUFS - under - lufs);
const BEDS = {
  outdoor: {name: 'outdoor', volume: vol(25, -32.29)}, // −14.32: every location (`OUTDOOR`)
  fans: {name: 'chamber-fans', volume: vol(23, -30.44)}, // −14.17: the Lab's chamber fans
  dyno: {name: 'dyno', volume: vol(25, -24.45)}, // −22.16: the rollers
  slush: {name: 'slush', volume: vol(25, -24.43)}, // −22.18: the twins rolling in town
  hwy: {name: 'hwy-slush', volume: vol(22, -24.46)}, // −19.15: the highway
  blower: {name: 'blower', volume: vol(27, -32.4)}, // −16.21: the EV's HVAC blower, close framings only
  garage: {name: 'hum', volume: vol(25, -34.36)}, // −12.25: the garage
  compressor: {name: 'hum', volume: vol(27, -34.36)}, // −14.25: the heat pump's compressor
  idle: {name: 'idle', volume: vol(21, -20.52)}, // −22.09: the gas twin at a stop
} as const;
type Bed = keyof typeof BEDS;
/** Music (owner-approved, 66 s): 9 dB under the voice from frame 0, no duck, fading to silence on the last frame (the seam). */
const MUSIC = {level: vol(9, -16.31), duckDb: 0, startAt: 0, fadeIn: 1.5, fadeOut: 1.5} as const; // −14.3

const SHOT = {
  pullAway: {name: 'pull-away', volume: vol(21, -20.48)}, // −22.13
  slushAway: {name: 'slush-away', volume: vol(22, -24.47)}, // −19.14
  evRoll: {name: 'ev-roll', volume: vol(22, -24.48)}, // −19.13: dry, spring
  brake: {name: 'brake-soft', volume: vol(22, -18.42)}, // −25.19
  click: {name: 'heater-click', volume: vol(20, -28.65)}, // −12.96
  relay: {name: 'relay', volume: vol(20, -29.47)}, // −12.14
} as const;

/** The car settles at the end of its stop ramp: the brake lands just before. */
const SETTLE = 0.15;
/** The loop's stop (scene 15), as `LDRIVE` builds it. */
const LOOP_REST = r2(W.unplugging + 0.05);
/** `slush-away` runs 3 s; the `slush` loop takes over 2.6 s after a green, as the speed levels off. */
const ROLL_IN = 2.6;

/** One-shots in video seconds: [shot, time, until (video time) or none]. A one-shot without `until` plays out past the cut. */
type Shot = {shot: keyof typeof SHOT; t: number; until?: number; fade?: number};
const SHOTS: Shot[] = [
  // visit 1: the green on "it" (both twins), the stop before the Lab
  {shot: 'pullAway', t: GREEN1},
  {shot: 'slushAway', t: GREEN1},
  {shot: 'click', t: W.make}, // the EV's heater on (EV_ON)
  {shot: 'brake', t: REST1 - SETTLE},
  // the Lab: its heater on, with "about 40"
  {shot: 'click', t: LAB_ON},
  // visit 2: the friction brake takes over on "recovers" (the caliper squeeze and dust), the short hop
  {shot: 'brake', t: W.recovers + 0.1},
  {shot: 'pullAway', t: GREEN2, until: REST2B, fade: 0.3},
  {shot: 'slushAway', t: GREEN2, until: REST2B, fade: 0.3},
  {shot: 'brake', t: REST2B - SETTLE},
  // visit 3: off a traffic stop, the red on "found"
  {shot: 'pullAway', t: W.and9 + 0.2, until: REST3, fade: 0.3},
  {shot: 'slushAway', t: W.and9 + 0.2, until: REST3, fade: 0.3},
  {shot: 'brake', t: REST3 - SETTLE},
  // spring: dry tires (the RPM rises 0.3 s after the green)
  {shot: 'pullAway', t: SPRING_GREEN + 0.3},
  {shot: 'evRoll', t: SPRING_GREEN + 0.3},
  {shot: 'brake', t: SPRING_REST - SETTLE},
  // visit 4: EV close-ups, so only its tires
  {shot: 'slushAway', t: GREEN4},
  {shot: 'brake', t: REST4 - SETTLE},
  {shot: 'slushAway', t: GREEN4B},
  {shot: 'brake', t: REST4B - SETTLE},
  // the garage: the wall charger's relay closes as the preheat starts (nothing is plugged or unplugged on screen)
  {shot: 'relay', t: W.preheat},
  // the loop's stop on frame 0's marks
  {shot: 'brake', t: LOOP_REST - SETTLE},
];

/**
 * Bed spans in video seconds. A span is split into one looped overlay per scene it covers, since an overlay's `until` is
 * clamped to its scene's cut. The `fade` is symmetric per overlay, so a copy that meets a `continue` cut (the span goes
 * on) fades by `CUT_FADE` only: a short dip at that cut instead of a 2 s one.
 */
type Span = {bed: Bed; from: number; to: number; fade: number};
const CUT_FADE = 0.15;
const END = N_FRAMES / FPS;
const SPANS: Span[] = [
  // 1–3 W: frame 0's idle (the seam: in from silence like the music), the rolling, the EV's blower once its heater is on
  {bed: 'idle', from: 0, to: GREEN1 + 0.5, fade: 1.0},
  {bed: 'slush', from: GREEN1 + ROLL_IN, to: REST1 + 0.1, fade: 0.4},
  {bed: 'blower', from: W.make + 0.1, to: S.s4, fade: 0.4},
  // 4–5 L: the fans on "one", the rollers once the car drives
  {bed: 'fans', from: W.one4, to: S.s6, fade: 0.6},
  {bed: 'dyno', from: W.lab + 0.2, to: S.s6, fade: 0.6},
  // 6–7 W: rolling in close on the wheel; the twins idle at the red (`evCar`), then the hop's stop
  {bed: 'slush', from: S.s6, to: REST2 + 0.1, fade: 0.4},
  {bed: 'idle', from: S.s7, to: GREEN2 + 0.5, fade: 0.5},
  {bed: 'idle', from: REST2B - 0.5, to: S.s8, fade: 0.5},
  // 8 H
  {bed: 'hwy', from: S.s8, to: S.s9, fade: 0.3},
  // 9 W: the stop of "found"
  {bed: 'idle', from: REST3 - 0.5, to: S.s10, fade: 0.5},
  // 10 Wm: the red, then the next red
  {bed: 'idle', from: S.s10, to: SPRING_GREEN + 0.5, fade: 0.5},
  {bed: 'idle', from: SPRING_REST - 0.5, to: S.s11, fade: 0.5},
  // 11–12 W: the compressor once the heat pump draws in (until the glide into the cabin), rolling, the stop at "deep cold"
  // (`evSky`); the cabin's blower until the HVAC goes off on "drivers"; rolling, the last stop
  {bed: 'compressor', from: W.pump, to: S.s12, fade: 0.8},
  {bed: 'slush', from: GREEN4 + ROLL_IN, to: REST4 + 0.1, fade: 0.4},
  {bed: 'idle', from: REST4 - 0.5, to: S.s12, fade: 0.3},
  {bed: 'blower', from: S.s12, to: W.drivers12 + 0.4, fade: 0.8},
  {bed: 'slush', from: GREEN4B + ROLL_IN, to: REST4B + 0.1, fade: 0.4},
  {bed: 'idle', from: REST4B - 0.5, to: S.s13, fade: 0.5},
  // 13–14 G: the garage hum, the blower from the preheat
  {bed: 'garage', from: S.s13, to: S.s15, fade: 0.5},
  {bed: 'blower', from: W.preheat + 0.1, to: S.s15, fade: 0.4},
  // 15 W: rolling to the red, then frame 0's idle, out to silence on the last frame (the seam)
  {bed: 'slush', from: S.s15, to: LOOP_REST + 0.1, fade: 0.4},
  {bed: 'idle', from: LOOP_REST - 0.5, to: END, fade: 1.0},
];

/** The outdoor bed under the whole video: one looped overlay on scene 1, in from silence at frame 0, out on the last frame. */
const OUTDOOR: OverlaySpec = {type: 'sfx', ...BEDS.outdoor, loop: true, fade: 1.0, at: 0} as OverlaySpec;

const sceneOf = (t: number) => STARTS.reduce((k, x, i) => (x <= t + 1e-6 ? i : k), 0);
const sfxFor = (n: number): OverlaySpec[] => {
  const s = STARTS[n - 1];
  const e = endOf(s);
  const beds = SPANS.filter((sp) => sp.from < e - 1e-6 && sp.to > s + 1e-6).map((sp) => {
    const a = Math.max(sp.from, s);
    const b = Math.min(sp.to, e);
    const carried = sp.from < s - 1e-6 || sp.to > e + 1e-6;
    return {
      type: 'sfx',
      ...BEDS[sp.bed],
      loop: true,
      fade: carried ? Math.min(sp.fade, CUT_FADE) : sp.fade,
      at: rel(a, s),
      until: rel(b, s),
    } as OverlaySpec;
  });
  const shots = SHOTS.filter((x) => sceneOf(x.t) === n - 1).map(
    (x) =>
      ({
        type: 'sfx',
        ...SHOT[x.shot],
        at: rel(x.t, s),
        ...(x.until !== undefined ? {until: rel(x.until, s)} : {}),
        ...(x.fade !== undefined ? {fade: x.fade} : {}),
      }) as OverlaySpec,
  );
  return [...beds, ...shots];
};
scenes.forEach((sc, i) => {
  const extra = [...(i === 0 ? [OUTDOOR] : []), ...sfxFor(i + 1)];
  if (extra.length) sc.overlays = [...(sc.overlays ?? []), ...extra];
});

/** Frame 0's props without its camera path (the cover holds one framing). */
const COVER_PROPS = (() => {
  const {cameraKeys: _k, transition: _t, ...rest} = scene1Props();
  void _k;
  void _t;
  return {...rest, drift: 0};
})();

export const spec: VideoSpec = {
  // Cover still (`yarn cover ev-winter`, publisher's text): the winter corner as frame 0 shows it, both twins at the
  // light, the gas twin's free heat running, the hook as the question (it gives no answer), aimed higher so the cars
  // sit under the two lines.
  cover: {
    text: 'Why do EVs lose\nrange in winter?',
    size: 130,
    scene: 'city-twin',
    camera: nudge(TWIN_HEAT, 0, 1.6),
    at: 3,
    props: COVER_PROPS,
  },
  tail: TAIL,
  music: MUSIC,
  scenes,
};
