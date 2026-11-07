/* eslint-disable @remotion/non-pure-animation -- false positive: `transition` keys in scene props are data, not CSS transitions */
import type {OverlaySpec, SceneSpec, VideoSpec} from '../../types';
import {cityTwinFramings} from '../../scenes/CityTwinScene';
import {speedAt, type SpeedKey} from '../../scenes/keyframes';
import {plugSheetFramings, type FastPost, type FastVisit, type PlugSheetSceneProps} from '../../scenes/PlugSheetScene';
import {driverGeo, driverTimeline} from '../../three/real/chargeMotion';
import {CAR_LAYOUT} from '../../three/real/RealCar';
import {CAR, TWINS} from '../../theme';
import transcript from './transcript.json';

/**
 * No. 016 · Does an EV cost less per mile than gas? (`av-script.md` draft 1, re-timed on the recorded take: 78.48 s of
 * voice; word times read from `transcript.json`).
 *
 * Locations: P `plug-sheet` (the home garage, the pump island and the fast-charger row stacked on one sheet; one world on
 * the video clock, `clock: 'video'`) · A `city-twin` (the EV crossover on top, its gas twin below). P → A → P → A → P:
 * four slides; every other hand-over is `continue`, the camera on one path per location visit (sampled per frame).
 * Orange = the demand fee only (meter peak pointer, the route up the pole, the fee slab). Regen and brakes in ink/grey (F4).
 * The loop: the last frame is frame 0 (P `sheet`, the world's `loop`, the camera landing on frame 0's framing).
 */

const WORDS = (transcript as {words: {text: string; start: number; end: number}[]}).words;
const norm = (x: string) => x.toLowerCase().replace(/[^a-z0-9']/g, '');
const PHRASES: [string, string][] = [
  ['an1', 'an ev can cost'],
  ['gascar', 'gas car'],
  ['it2', 'it comes down to'],
  ['plug2', 'plug'],
  ['some', 'some people swear'],
  ['others', 'others say'],
  ['both', 'both'],
  ['look', 'look at a compact'],
  ['suv', 'suv'],
  ['gas4', 'gas and'],
  ['electric4', 'electric versions'],
  ['at5', "at today's prices"],
  ['gas5', 'gas one'],
  ['fifteen', 'fifteen cents'],
  ['cents5', 'cents a mile'],
  ['the6', 'the electric version costs'],
  ['six6', 'six cents'],
  ['cents6', 'cents'],
  ['home6', 'home at'],
  ['rate', 'rate'],
  ['at7', 'at a public fast'],
  ['seventeen7', 'seventeen cents'],
  ['cents7', 'cents'],
  ['why', 'why do fast'],
  ['many', 'many fast chargers pay'],
  ['busiest', 'busiest'],
  ['month', 'month'],
  ['and10', 'and the average fast'],
  ['idle', 'idle'],
  ['fewer', 'fewer drivers'],
  ['wherever', 'wherever you charge'],
  ['needs', 'needs'],
  ['oil', 'oil changes'],
  ['and11', 'and its brakes'],
  ['last', 'last longer'],
  ['because', 'because'],
  ['slowing', 'slowing'],
  ['evs12', 'evs tend to be'],
  ['heavier', 'heavier'],
  ['tires', 'tires'],
  ['sooner', 'sooner'],
  ['and13', 'and the electric version'],
  ['about13', 'about six thousand'],
  ['dollars', 'dollars'],
  ['if14', 'if you charge mostly'],
  ['savings14', 'savings cover'],
  ['three', 'three years'],
  ['if15', 'if you only use'],
  ['fast15', 'fast chargers'],
  ['seventeen15', 'seventeen years'],
  ['years15', 'years'],
  ['but16', 'but evs also tend'],
  ['lose', 'lose value'],
  ['faster16', 'faster'],
  ['cut', 'cut into'],
  ['which', 'which plug would you'],
];
const W = (() => {
  const out: Record<string, number> = {};
  let i = 0;
  for (const [key, phrase] of PHRASES) {
    const ws = phrase.split(' ').map(norm);
    let j = i;
    while (j < WORDS.length && !ws.every((x, k) => norm(WORDS[j + k]?.text ?? '') === x)) j++;
    if (j >= WORDS.length) throw new Error(`ev-cost spec: phrase not found in transcript: "${phrase}" (${key})`);
    out[key] = WORDS[j].start;
    i = j;
  }
  out.end = WORDS[WORDS.length - 1].end;
  return out as Record<(typeof PHRASES)[number][0] | 'end', number>;
})();

const FPS = 30;
const TAIL = 1.2;
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
  s1: 0,
  s2: W.it2,
  s3: W.some,
  s4: W.others,
  s5: W.look, // slide → A
  s6: W.at5,
  s7: W.the6, // slide → P
  s8: W.at7,
  s9: W.why,
  s10: W.many,
  s11: W.and10,
  s12: W.wherever, // slide → A
  s13: W.and11,
  s14: W.evs12,
  s15: W.and13,
  s16: W.if14, // slide → P
  s17: W.if15,
  s18: W.but16,
  s19: W.which, // the loop
};
const STARTS = Object.values(S);
const endOf = (start: number) => STARTS.find((x) => x > start + 1e-6) ?? N_FRAMES / FPS;

// ------------------------------------------------------------------ the camera on the video clock (hybrid-city's pattern)

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
/** One camera key per frame of the scene (and 24 frames past its cut, for a slide-out): the path exactly, no easing between keys. */
const camKeys = (path: PathKey[], start: number) => {
  const f0 = Math.round(start * FPS);
  const n = Math.round(endOf(start) * FPS) - f0 + 24;
  const out: {at: number; look: V3; distance: number}[] = [];
  for (let k = 0; k <= n; k++) {
    const f = framingOnPath(path, (f0 + k) / FPS);
    out.push({at: Math.round((k / FPS) * 10000) / 10000, look: f.look.map((x) => Math.round(x * 10000) / 10000) as V3, distance: Math.round(f.distance * 10000) / 10000});
  }
  return out;
};
const at = (f: Framing, distance: number): Framing => ({look: f.look, distance});
const nudge = (f: Framing, dx: number, dy: number, distance = f.distance): Framing => ({look: [f.look[0] + dx, f.look[1] + dy, f.look[2]], distance});
/** Hold framing `f` while pushing in at `v` units/s from a to b (a linear segment). */
const pushKeys = (f: Framing, a: number, b: number, v: number): PathKey[] => [
  {t: a, f},
  {t: b, f: at(f, f.distance - v * (b - a))},
];
const G = 0.8; // glide length (s)

// ------------------------------------------------------------------ P: the plug sheet (one world on the video clock)

const PF = plugSheetFramings({});
const SHEET = nudge(PF.sheet, 0, -0.3, 102); // frame 0 and the last frame: a touch wider and higher, so the meter cabinet clears the caption band and YOU clears the title block
/** Frame 0's push per second, matched by the loop's last segment. */
const V_SHEET = {dy: 0, dd: -1.2};
const sheetAt = (t: number): Framing => nudge(SHEET, 0, V_SHEET.dy * t, SHEET.distance + V_SHEET.dd * t);
const vOf = (f: Framing) => r2(f.distance * 0.0035);
const PLUGS = PF.plugs;
const HOME = PF.home;
const HOME_WIDE = PF.homeWide;
const FAST = nudge(PF.fast, 0, -0.6); // the posts and cars above the captions
const ROW = nudge(PF.row, 0, -1.2); // the meter's dial above the caption band
const ROW_LOW = nudge(PF.rowLow, 0, -1.2, 72); // the row between the bars card and the captions
const SUPPLY = PF.supply;

const PATH_P: PathKey[] = [
  // visit 1: frame 0 = SHEET exactly; push in, glide closer for each beat
  {t: -1, f: sheetAt(-1)},
  {t: 0, f: SHEET},
  {t: S.s2, f: sheetAt(S.s2)},
  {t: S.s2 + G, f: PLUGS, ease: 'glide'},
  {t: S.s3, f: at(PLUGS, PLUGS.distance - vOf(PLUGS) * (S.s3 - S.s2 - G))},
  {t: S.s3 + G, f: HOME, ease: 'glide'},
  {t: S.s4, f: at(HOME, HOME.distance - vOf(HOME) * (S.s4 - S.s3 - G))},
  {t: S.s4 + G, f: FAST, ease: 'glide'},
  {t: W.both - 0.3, f: at(FAST, FAST.distance - vOf(FAST) * (W.both - 0.3 - S.s4 - G))},
  // "they can both be right": crane out until home and the row share the frame
  {t: W.both + 0.7, f: PLUGS, ease: 'glide'},
  {t: S.s5 + 1, f: at(PLUGS, PLUGS.distance - vOf(PLUGS) * (S.s5 + 1 - W.both - 0.7))},
  // visit 2 (after the slide at "The electric version costs")
  ...pushKeys(HOME, S.s7 - 1, W.home6 - 0.1, vOf(HOME)),
  {t: W.home6 + G - 0.1, f: HOME_WIDE, ease: 'glide'},
  {t: S.s8, f: at(HOME_WIDE, HOME_WIDE.distance - vOf(HOME_WIDE) * (S.s8 - W.home6 - G + 0.1))},
  {t: S.s8 + G, f: FAST, ease: 'glide'},
  {t: S.s9, f: at(FAST, FAST.distance - vOf(FAST) * (S.s9 - S.s8 - G))},
  {t: S.s9 + G, f: ROW, ease: 'glide'},
  {t: S.s10, f: at(ROW, ROW.distance - vOf(ROW) * (S.s10 - S.s9 - G))},
  {t: S.s10 + G, f: SUPPLY, ease: 'glide'},
  {t: S.s11, f: at(SUPPLY, SUPPLY.distance - vOf(SUPPLY) * (S.s11 - S.s10 - G))},
  {t: S.s11 + G, f: ROW, ease: 'glide'},
  {t: S.s12 + 1, f: at(ROW, ROW.distance - vOf(ROW) * (S.s12 + 1 - S.s11 - G))},
  // visit 3 (after the slide at "If you charge mostly"), ending on frame 0
  ...pushKeys(HOME, S.s16 - 1, S.s17, vOf(HOME)),
  {t: S.s17 + G, f: ROW, ease: 'glide'},
  {t: S.s18, f: at(ROW, ROW.distance - vOf(ROW) * (S.s18 - S.s17 - G))},
  {t: S.s18 + G, f: ROW_LOW, ease: 'glide'},
  {t: S.s19, f: at(ROW_LOW, ROW_LOW.distance - vOf(ROW_LOW) * (S.s19 - S.s18 - G))},
  {t: LAST - 1, f: sheetAt(-1), ease: 'glide'},
  {t: LAST, f: SHEET},
  {t: LAST + 1, f: sheetAt(1)},
];

/**
 * The aisle runs in front of the stalls: a car comes along it from frame right, stops past its stall and backs in; a
 * leaving car drives out and away to frame left. So the aisle is used one move at a time, except that two cars two
 * stalls apart (posts 1 + 3, or 2 + 4) can arrive together, the left one leading (their stops are 6.8 m apart), and
 * departures go left car first. Checked with a car-footprint overlap test over every frame.
 */
/** A time-lapse visit: quick moves (approach 0.45 s from 4 m, back in over 0.45 s), parked at `stop`, plugged, out at `out`. */
const quick = (stop: number, out: number | null, look: 'a' | 'b' = 'a'): FastVisit => ({
  arrive: {at: stop, from: 4, approach: 0.45, wait: 0.05, for: 0.45},
  plug: r2(stop + 0.25),
  unplug: out === null ? 52 : r2(out - 0.4),
  leave: out === null ? {at: 52.5} : {at: out, for: 1.4},
  driver: 'auto',
  look,
});
/** A real-time visit in the "only fast chargers" stretch (approach 1.2 s from 8 m, back in over 1.4 s). */
const brisk = (stop: number, out: number, look: 'a' | 'b' = 'a'): FastVisit => ({
  arrive: {at: stop, from: 8, approach: 1.2, wait: 0.2, for: 1.4},
  plug: r2(stop + 0.3),
  unplug: r2(out - 0.4),
  leave: {at: out, for: 1.4},
  driver: 'auto',
  look,
});

// the busiest stretch (scene 10): posts 1 + 3 arrive, then 2 + 4, all four busy through "fifteen minutes"; 2 and 4
// leave on "month"; 1 and 3 stay for the fee's share-out (they are the "fewer drivers")
const PEAK_A = 37.5; // 37.1 before check copy 3: the later departures (posts 2 + 3) need the aisle clear first
/** The second car of a pair (two stalls to the right) follows this far behind (quick moves; `brisk` ones 1.9 s). */
const PAIR = 0.7;
const PEAK_B = r2(PEAK_A + PAIR + 1.35);
// "If you only use fast chargers" (scenes 17–18): frame 0's post-1 car arrives early with post 3, then 2 + 4, then
// 2, 3 and 4 leave (left car first); post 1's driver plugs in and sits down with the phone (frame 0's pose)
const ONLY_A = 68.9;
const ONLY_B = r2(ONLY_A + 1.9 + 1.35);

/** The world (video seconds): built on the scene-builder's test keys for the real take (batch A). */
const POSTS: FastPost[] = [
  {
    visits: [
      // frame 0: parked, extra B on the kerb with the phone
      // (unplugs on "more", walks back at a normal pace and drives off at 17.45, under the A visit, after the slide)
      {driver: {start: 'curb', plugged: true, keys: [{at: -5, do: 'sit'}, {at: -4, do: 'phone'}, {at: 10.5, do: 'unplug'}, {at: 15.95, do: 'enter'}], look: 'b'}, leave: {at: 17.45}, look: 'b'},
      quick(PEAK_A, null),
      // the loop's lead-in: frame 0's car and driver again (the time-lapse lands at 75.8)
      {arrive: {at: ONLY_A, from: 8, approach: 1.2, wait: 0.2, for: 1.4}, driver: {keys: [{at: 74.4, do: 'plug'}, {at: 75.6, do: 'sit'}, {at: 76.3, do: 'phone'}], look: 'b'}, look: 'b'},
    ],
  },
  {
    visits: [
      // "At a public fast charger": reverses in, plugs on "seventeen"; leaves first on "Why do fast chargers" (owner,
      // check copy 3: the car drove off without its driver; every keyed visit now leaves >= 0.2 s after its driver's
      // 'car' seg: `driverTimeline` lays out lift, holster, the walk to the door and the 1.3 s enter after the unplug key).
      // A brisk driver (`rate` 1.4); the walk to the door squeezed into the time-lapse's first second (33.25)
      {arrive: {at: 28.9}, driver: {rate: 1.4, keys: [{at: 31.0, do: 'plug'}, {at: 31.45, do: 'unplug'}, {at: 33.3, do: 'enter'}]}, leave: {at: 34.8, for: 1.2}},
      quick(PEAK_B, 40.8, 'b'),
      quick(ONLY_B, 73.2, 'b'),
    ],
  },
  {
    visits: [
      {arrive: {at: 4.0, from: 9, approach: 2.2, wait: 0.3, for: 2.0}, driver: {rate: 1.4, keys: [{at: 6.3, do: 'plug'}, {at: 9.8, do: 'lean'}, {at: 10.1, do: 'phone'}, {at: 31.2, do: 'unplug'}, {at: 33.8, do: 'enter'}]}, leave: {at: 35.0, for: 1.4}},
      quick(r2(PEAK_A + PAIR), null, 'b'),
      brisk(r2(ONLY_A + 1.9), 73.9),
    ],
  },
  {
    visits: [quick(r2(PEAK_B + PAIR), 41.2), quick(r2(ONLY_B + PAIR), 74.6)],
  },
];

/** YOU's plug-in at home after the trip (the key; the latch follows at `HOME_LATCH`). */
const HOME_PLUG = 63.3;

const WORLD: Partial<PlugSheetSceneProps> = {
  clock: 'video',
  time: 1060, // 5:40 PM
  timelapse: {
    minutes: [
      {at: 0, value: 0},
      {at: 33.25, value: 0}, // 34.4 before check copy 3: starts on "cost so much", under post 2's hurried walk to its door
      {at: 46.2, value: 1440},
      {at: 62.6, value: 1440},
      {at: 75.8, value: 5760},
    ],
  },
  loop: {end: LAST, home: 72, pump: 72, fast: 77.6},
  home: {
    // one trip out and back during the A scenes (the scene-builder's Option C: YOU's beats run back to back, so a
    // second quick trip slipped the chain ≈ 6 s past the loop switch)
    trips: [{out: 50, back: 61.9}],
    you: {
      start: 'nose',
      keys: [
        {at: -1.4, do: 'walkTo', to: 'inside'},
        {at: 6.3, do: 'walkTo', to: [-2.1, 1.3], speed: 1.9},
        {at: 7.0, do: 'phone'},
        {at: 10.2, do: 'lean', to: 'roof'},
        {at: 22.4, do: 'walkTo', to: 'tail'},
        {at: 24.7, do: 'glance', to: 'port'},
        {at: 26.3, do: 'walkTo', to: 'inside'},
        {at: 46.5, do: 'walkTo', to: 'roof'},
        {at: 48.6, do: 'unplug'},
        {at: 49.6, do: 'enter'},
        {at: 62.0, do: 'exit'},
        {at: HOME_PLUG, do: 'plug'}, // latches at ≈ 65.0 (`HOME_LATCH`)
        {at: 65.4, do: 'walkTo', to: [-2.95, 0.6]},
        // frame 0's spot and pose (at the nose, plugged, rot 0) before the home section's loop switch (72)
        {at: 70.0, do: 'walkTo', to: 'nose'},
      ],
    },
  },
  pump: {
    extra: {
      start: 'car',
      keys: [
        {at: -6, do: 'exit'},
        {at: -1.5, do: 'plug'},
        {at: 4.3, do: 'unplug'},
        {at: 7.6, do: 'enter'},
      ],
    },
    holds: [[-1.3, 2.7]],
    clickOff: [2.64],
  },
  fast: {
    posts: POSTS,
    meter: {appearAt: 37.5, resetAt: 34.9, fadeAt: 46.1},
    route: {at: 38.96, fadeAt: 46.1},
    ghosts: {at: 42.4, fadeAt: 43.7},
    fee: {liftAt: 43.8, splitAt: 44.1, landAt: 45.4, fadeAt: 46.1},
  },
};

const P = (s: number, transition: 'slide' | 'continue'): Record<string, unknown> => ({
  ...WORLD,
  drift: 0,
  transition,
  cameraKeys: camKeys(PATH_P, s),
});

// ------------------------------------------------------------------ A: the twin corner (one drive clock in video seconds)

const WHEEL_C = 2 * Math.PI * CAR_LAYOUT.wheelR;
const ODO_STEP = 1 / 120;
const makeOdo = (ks: SpeedKey[], t0 = -20, t1 = N_FRAMES / FPS + 2) => {
  const table = [0];
  for (let i = 1; i <= (t1 - t0) / ODO_STEP; i++) table.push(table[i - 1] + speedAt(ks, t0 + (i - 0.5) * ODO_STEP, 0.8) * WHEEL_C * ODO_STEP);
  return (t: number) => table[Math.max(0, Math.min(table.length - 1, Math.round((t - t0) / ODO_STEP)))];
};
/** 1 mph in rev/s. */
const MPH = 11.9 / 60;
const CRUISE = 25 * MPH;
/** The stop line ahead of a standing twin's front tire (past its lead car). */
const LINE_AHEAD = 7.6;
const stopRamp = (from: number, to: number, v0: number) =>
  [0.75, 0.5, 0.25, 0].map((k, i) => ({at: r2(from + ((to - from) * (i + 1)) / 4), speed: r2(v0 * k)}));

const REST1 = W.gas5 - 0.2; // visit 1: stopped at the red for "the gas one costs"
const GREEN1 = W.gas5 + 0.75; // green: the gas twin pulls away before "fifteen"
const REST2 = W.needs + 0.05; // visit 2: the stop of "needs no oil changes"
const GREEN2 = W.and11 + 0.05;
const REST3 = W.slowing - 0.3; // "the motor does much of the slowing"
const GREEN3 = W.heavier + 0.45;
const REST4 = W.about13 - 0.6; // the stop under the $6,000 counter
const GREEN4 = W.if14 - 0.75;

const DRIVE: SpeedKey[] = [
  {at: -20, speed: CRUISE},
  // visit 1: rolling, a yellow, the stop, green
  {at: r2(W.electric4 - 0.7), speed: CRUISE},
  ...stopRamp(W.electric4 - 0.7, REST1, CRUISE),
  {at: r2(GREEN1 + 0.1), speed: 0},
  {at: r2(GREEN1 + 0.5), speed: 1.6},
  {at: r2(GREEN1 + 1.2), speed: 3.4},
  {at: r2(GREEN1 + 2.0), speed: CRUISE},
  // visit 2: rolling in, the stop of "needs"
  {at: r2(S.s12 + 0.2), speed: CRUISE},
  ...stopRamp(S.s12 + 0.2, REST2, CRUISE),
  // green on "and its brakes", away, the next light, brake on "longer"
  {at: r2(GREEN2 + 0.1), speed: 0},
  {at: r2(GREEN2 + 0.5), speed: 1.6},
  {at: r2(W.last - 0.1), speed: 3.0},
  ...stopRamp(W.last + 0.2, REST3, 3.0),
  // green on "heavier", away while the treads wear
  {at: r2(GREEN3 + 0.1), speed: 0},
  {at: r2(GREEN3 + 0.5), speed: 1.6},
  {at: r2(GREEN3 + 1.2), speed: 3.4},
  {at: r2(GREEN3 + 2.0), speed: CRUISE},
  // the lead cars brake, the twins stop for the counter, green before the slide
  {at: r2(S.s15 + 0.2), speed: CRUISE},
  ...stopRamp(S.s15 + 0.2, REST4, CRUISE),
  {at: r2(GREEN4 + 0.1), speed: 0},
  {at: r2(GREEN4 + 0.5), speed: 1.6},
  {at: r2(GREEN4 + 1.2), speed: 3.4},
];
const odo = makeOdo(DRIVE);

/*
 * The lead cars (owner, check copy 3: "the car in front at 00:16 is going backwards"). The scene's default lag model
 * (the lead copies the twin's keys 0.6 s earlier) closes the gap from ≈ 7.7 m to 1 m at every stop approached from
 * speed, and with the camera locked to the twin the lead slid back toward it. Now each lead has its own keys: the
 * twin's braking exactly (same ramps, same times: the gap holds while both slow, its lamps lit with the twin's) and its
 * greens `LEAD_EARLY` s sooner (it leaves first, the gap only grows; see `GREENS`). The gap is `LEAD_GAP` at the start of each run of
 * scenes (`LEAD_RUNS`) and carried across the `continue` cuts inside a run; visit 2's second run starts at scene 15,
 * where the camera is on the EV's rear wheel and both leads are out of frame, so the gap the greens built resets
 * unseen before the stop under the counter.
 */
const LEAD_GAP = 1.0;
const LEAD_EARLY = 0.35;
// not GREEN2: that short pull runs straight into the REST3 ramp (the 3.0 key's ease overlaps the braking), so moved
// keys would brake on a different curve and close in; at GREEN2 the leads leave with the twins and hold 1 m into REST3
const GREENS = [GREEN1, GREEN3, GREEN4];
const LEAD_DRIVE: SpeedKey[] = DRIVE.map((k) => (GREENS.some((g) => k.at > g + 0.05 && k.at < g + 2.05) ? {...k, at: r2(k.at - LEAD_EARLY)} : k));
const leadOdo = makeOdo(LEAD_DRIVE);
const LEAD_RUNS = [S.s5, S.s12, S.s15];
const leadGapAt = (t: number) => {
  const run = [...LEAD_RUNS].reverse().find((x) => x <= t + 1e-6) ?? LEAD_RUNS[0];
  return r2(LEAD_GAP + leadOdo(t) - leadOdo(run) - (odo(t) - odo(run)));
};

type Lens = 'red' | 'yellow' | 'green' | 'off';
type Corner = {at: number; lights: {at: number; state: Lens}[]};
const corner = (rest: number, yellow: number, green: number): Corner => ({
  at: odo(rest) + LINE_AHEAD,
  lights: [
    {at: -20, state: 'green'},
    {at: r2(yellow), state: 'yellow'},
    {at: r2(yellow + 0.8), state: 'red'},
    {at: r2(green), state: 'green'},
  ],
});
const CORNERS: Corner[] = [
  corner(REST1, W.electric4 - 1.0, GREEN1),
  corner(REST2, S.s12 + 0.1, GREEN2),
  corner(REST3, W.last - 0.3, GREEN3),
  corner(REST4, S.s15 + 0.0, GREEN4),
];
const cornersIn = (s: number) =>
  CORNERS.filter((c) => Math.abs(c.at - odo(s)) < 80).map((c) => ({ahead: r2(c.at - odo(s)), when: 0, lights: shift(c.lights, s)}));

/** Grey puffs from the gas twin (a bigger one as it pulls away). */
const PUFFS: [number, number][] = [
  [W.gas4, 1],
  [REST1 + 0.5, 1],
  [GREEN1 + 0.3, 1.6],
  [REST2 + 0.4, 1],
  [GREEN2 + 0.3, 1.6],
  [REST3 + 0.5, 1],
  [GREEN3 + 0.3, 1.6],
  [REST4 + 0.5, 1],
  [W.dollars + 0.5, 1],
  [GREEN4 + 0.3, 1.6],
];
const RPM: [number, number][] = [
  [-20, 1800],
  [W.electric4 - 0.7, 1200],
  [REST1, 800],
  [GREEN1, 800],
  [GREEN1 + 0.4, 2600],
  [GREEN1 + 2.0, 1800],
  [S.s12 + 0.2, 1200],
  [REST2, 800],
  [GREEN2, 800],
  [GREEN2 + 0.4, 2400],
  [W.last + 0.2, 1000],
  [REST3, 800],
  [GREEN3, 800],
  [GREEN3 + 0.4, 2600],
  [GREEN3 + 2.0, 1800],
  [S.s15 + 0.2, 1200],
  [REST4, 800],
  [GREEN4, 800],
  [GREEN4 + 0.4, 2600],
];

// visit 2's beats (video seconds)
const OIL_GHOST = val([
  [-20, 1],
  [W.needs - 0.1, 1],
  [W.needs + 0.5, 0.15],
  [W.and11 - 0.5, 0.15],
  [W.and11 - 0.05, 1],
]);
const CAL_GAS = val([
  [-20, 0],
  [W.last + 0.15, 0],
  [W.last + 0.4, 1],
  [GREEN3 - 0.2, 1],
  [GREEN3 + 0.2, 0],
]);
const CAL_EV = val([
  [-20, 0],
  [W.last + 0.15, 0],
  [W.last + 0.45, 0.2],
  [GREEN3 - 0.2, 0.2],
  [GREEN3 + 0.2, 0],
]);
const TREAD_EV = val([
  [-20, 1],
  [W.tires - 0.1, 1],
  [W.sooner + 0.2, 0.3],
]);
const TREAD_GAS = val([
  [-20, 1],
  [W.tires - 0.1, 1],
  [W.sooner + 0.2, 0.6],
]);

/** The A visit (1: lines 4–5, 2: lines 11–13): visit 1 keeps the top lane's storefronts off (the counter's sky in `bottomCar`). */
const A = (s: number, visit: 1 | 2, transition: 'slide' | 'continue'): Record<string, unknown> => {
  const T = (keys: {at: number; value: number}[]) => shift(keys, s);
  const two = visit === 2;
  const lead = {driving: shift(LEAD_DRIVE, s), gap: leadGapAt(s)};
  return {
    driving: shift(DRIVE, s),
    corners: cornersIn(s),
    top: {
      variant: 'ev',
      shape: 'crossover',
      storefronts: two,
      lead,
      ...(two
        ? {
            caliper: {front: T(CAL_EV)},
            regenArrow: {at: rel(W.because - 0.1, s), fadeAt: rel(W.evs12 - 0.3, s)},
            treadDepth: {rear: T(TREAD_EV)},
            treadTicks: true,
            weightArrow: {at: rel(W.heavier - 0.3, s), fadeAt: rel(W.sooner + 0.6, s), wheel: 'rear'},
          }
        : {}),
    },
    bottom: {
      variant: 'gas',
      shape: 'crossover',
      oilPan: true,
      lead,
      rpm: T(val(RPM)),
      exhaust: PUFFS.filter(([t]) => t > s - 2 && t < endOf(s) + 0.6).map(([t, size]) => ({at: rel(t, s), size})),
      ...(two
        ? {
            wheelGhost: {FR: T(OIL_GHOST)},
            caliper: {front: T(CAL_GAS)},
            brakeDust: [
              {at: rel(W.last + 0.45, s), size: 1},
              {at: rel(W.because + 0.3, s), size: 0.8},
            ],
            treadDepth: {rear: T(TREAD_GAS)},
            treadTicks: true,
          }
        : {}),
    },
    drift: 0,
    pavement: true, // road wear streams with the road (owner: cars looked parked at 0:15)
    wheelStep: 0.25, // 14°/frame: spokes read as rolling, not shimmer
    wheelSmearMax: 0.15,
    transition,
    cameraKeys: camKeys(visit === 1 ? PATH_A1 : PATH_A2, s),
  };
};

const TF = cityTwinFramings({top: {shape: 'crossover'}});
/** Visit 1's two-shot, closer than the preset (the twins larger, the lead cars at the left edge); visit 2's lifted off the captions. */
const A_STACK1 = nudge(TF.stack, 1.3, -0.6, 44);
const A_STACK = nudge(TF.stack, 0, -0.5);
/*
 * The close two-shots, re-set for the vertical frame: the scene's crossover presets (distance 11–19) put the gas twin's
 * wheels and bay under the captions; standing back to ≈ 21–24 keeps both cars' wheels above y 1045 (the bottom lane's
 * road at ≈ y 1040), the top car's roof running off the frame top.
 */
const A_BOTTOM: Framing = {look: [-0.6, 0.75, 0.3], distance: 34}; // the gas twin whole, the top lane above, sky for the counter
const A_BAYS: Framing = {look: [-1.45, 0.45, 0.45], distance: 23};
const A_BRAKES: Framing = {look: [-1.3, 0.4, 0.8], distance: 21};
const A_WHEELS: Framing = {look: [1.3, 0.4, 0.8], distance: 21};
/** The EV's rear wheel close (the worn tread at phone size), its contact patch above the captions. */
const A_EV_REAR: Framing = {look: [1.35, 3.12, 0.8], distance: 8};

const PATH_A1: PathKey[] = [
  ...pushKeys(A_STACK1, S.s5 - 1, S.s6, 0.15),
  {t: S.s6 + G, f: A_BOTTOM, ease: 'glide'},
  {t: S.s7 + 1, f: at(A_BOTTOM, A_BOTTOM.distance - 0.07 * (S.s7 + 1 - S.s6 - G))},
];
const PATH_A2: PathKey[] = [
  ...pushKeys(A_BAYS, S.s12 - 1, S.s13, 0.05),
  {t: S.s13 + G, f: A_BRAKES, ease: 'glide'},
  {t: S.s14, f: at(A_BRAKES, A_BRAKES.distance - 0.05 * (S.s14 - S.s13 - G))},
  {t: S.s14 + G, f: A_WHEELS, ease: 'glide'},
  {t: W.tires - 0.3, f: at(A_WHEELS, A_WHEELS.distance - 0.05 * (W.tires - 0.3 - S.s14 - G))},
  {t: W.tires + 0.6, f: A_EV_REAR, ease: 'glide'},
  {t: S.s15, f: at(A_EV_REAR, A_EV_REAR.distance - 0.04 * (S.s15 - W.tires - 0.6))},
  {t: S.s15 + G, f: A_STACK, ease: 'glide'},
  {t: S.s16 + 1, f: at(A_STACK, A_STACK.distance - 0.15 * (S.s16 + 1 - S.s15 - G))},
];

// ------------------------------------------------------------------ overlays

const titleBlock: OverlaySpec = {
  type: 'title',
  at: 0,
  question: 'Does an EV cost less\nper mile than gas?', // F1: the early title question (main session)
  number: 'No. 016',
  title: 'The Plugs',
  time: '5:40 PM',
  carry: true,
  until: 8.0,
} as OverlaySpec;

const EV_PAINT = CAR.day.bodies.you;
const tags = (a: number, b: number, s: number): OverlaySpec[] => [
  {type: 'tag', who: 'you', anchor: 'top:top', label: 'ELECTRIC', color: EV_PAINT, outline: 'ink', side: 'left', at: rel(a, s), until: rel(b, s)} as OverlaySpec,
  {type: 'tag', who: 'extra', anchor: 'top:bottom', label: 'GAS', color: TWINS.gasPaint, outline: 'ink', side: 'left', below: 'lane:top', at: rel(a, s), until: rel(b, s)} as OverlaySpec,
];

const COUNTER_AT = {x: 0.111, y: 0.156};
/** A single counter: in at `a`, landing at `land`, out by `b` (video seconds). */
const counter = (s: number, to: number, label: string, sub: string, a: number, land: number, b: number): OverlaySpec =>
  ({type: 'counter', from: 0, to, label, sub, ...COUNTER_AT, at: rel(a, s), duration: r2(land - a - 0.3), until: rel(b, s)}) as OverlaySpec;

const callout = (anchor: string, title: string, sub: string | undefined, a: number, b: number, s: number, dx: number, dy: number, place: 'side' | 'above' = 'side'): OverlaySpec =>
  ({type: 'callout', anchor, title, ...(sub ? {sub, subInk: 'ink'} : {}), size: 1.2, place, dx, dy, at: rel(a, s), until: rel(b, s)}) as OverlaySpec;

/** The value bars (F11): no numbers, a modest gap, the lengths illustrative (🎭). */
const BARS_IN = S.s18 + 0.4;
const barsCard: OverlaySpec = {
  type: 'chart',
  at: rel(BARS_IN, S.s18),
  until: rel(S.s19 - 0.15, S.s18),
  tab: 'VALUE',
  top: 288,
  height: 290, // one row + bracket (ChartCard honours height in bars mode)
  barNames: ['EV', 'GAS'],
  bars: [
    {
      label: 'VALUE LOST',
      refAt: 0, // the card enters with its row label and the EV bar already growing (never a blank card)
      value: 0.78,
      valueAt: r2(W.faster16 - BARS_IN),
      bracket: {label: 'CUTS THE SAVINGS', at: r2(W.cut - BARS_IN), labelAt: r2(W.cut + 0.3 - BARS_IN)},
    },
  ],
} as OverlaySpec;

const yearsRows: OverlaySpec = {
  type: 'counter',
  from: 3,
  rows: [
    {label: 'HOME', to: 3, stopAt: 0},
    {label: 'FAST', to: 17, stopAt: r2(W.seventeen15 + 0.05 - (S.s17 + 0.3))}, // lands on "seventeen"
  ],
  label: 'YEARS',
  sub: 'To catch up',
  subPlace: 'above',
  ...COUNTER_AT,
  at: 0.3,
  start: 0.6,
  until: rel(S.s18 - 0.15, S.s17),
} as OverlaySpec;

// ------------------------------------------------------------------ scenes

const scenes: SceneSpec[] = [
  // ---- 1–4 P: frame 0, the three plugs
  {scene: 'plug-sheet', cue: 'An EV can cost', props: P(S.s1, 'continue'), overlays: [titleBlock]},
  {scene: 'plug-sheet', cue: 'It comes down to', props: P(S.s2, 'continue')},
  {scene: 'plug-sheet', cue: 'Some people swear', props: P(S.s3, 'continue')},
  {scene: 'plug-sheet', cue: 'others say it costs', props: P(S.s4, 'continue')},
  // ---- 5–6 A: the twins, the gas mile
  {scene: 'city-twin', cue: 'Look at a compact', props: A(S.s5, 1, 'slide'), overlays: tags(W.suv + 0.4, S.s6 - 0.1, S.s5)},
  {
    scene: 'city-twin',
    cue: "At today's prices",
    props: A(S.s6, 1, 'continue'),
    overlays: [counter(S.s6, 15, 'CENTS A MILE', 'GAS', W.gas5 - 0.1, W.cents5, S.s7 - 0.15)],
  },
  // ---- 7–11 P: the home mile, the fast mile, the demand fee
  {
    scene: 'plug-sheet',
    cue: 'The electric version costs',
    props: P(S.s7, 'slide'),
    overlays: [counter(S.s7, 6, 'CENTS A MILE', 'AT HOME · AVERAGE RATE', S.s7 + 0.7, W.cents6, S.s8 - 0.15)],
  },
  {
    scene: 'plug-sheet',
    cue: 'At a public fast',
    props: P(S.s8, 'continue'),
    overlays: [counter(S.s8, 17, 'CENTS A MILE', 'FAST CHARGER', W.seventeen7 - 1.2, W.cents7, S.s9 - 0.15)],
  },
  {scene: 'plug-sheet', cue: 'Why do fast chargers', props: P(S.s9, 'continue')},
  {
    scene: 'plug-sheet',
    cue: 'Many fast chargers pay',
    props: P(S.s10, 'continue'),
    overlays: [callout('peak', 'Busiest 15 min', 'Sets the fee', W.busiest - 0.2, S.s11 - 0.15, S.s10, 0, -560, 'above')],
  },
  {scene: 'plug-sheet', cue: 'And the average fast', props: P(S.s11, 'continue')},
  // ---- 12–15 A: upkeep, the price gap
  {
    scene: 'city-twin',
    cue: 'Wherever you charge',
    props: A(S.s12, 2, 'slide'),
    overlays: [callout('oilPan:bottom', 'Engine oil', 'Gas version only', W.oil - 0.3, S.s13 - 0.1, S.s12, 0, -390, 'above')],
  },
  {scene: 'city-twin', cue: 'and its brakes last', props: A(S.s13, 2, 'continue')},
  {scene: 'city-twin', cue: 'EVs tend to be', props: A(S.s14, 2, 'continue')},
  {
    scene: 'city-twin',
    cue: 'And the electric version',
    props: A(S.s15, 2, 'continue'),
    overlays: [counter(S.s15, 6000, 'DOLLARS MORE', 'TO BUY', W.about13 - 0.3, W.dollars, S.s16 - 0.15)],
  },
  // ---- 16–19 P: the catch-up, the value, the question, the loop
  {
    scene: 'plug-sheet',
    cue: 'If you charge mostly',
    props: P(S.s16, 'slide'),
    overlays: [counter(S.s16, 3, 'YEARS', 'TO CATCH UP · AT HOME', W.savings14 - 0.3, W.three, S.s17 - 0.15)],
  },
  {scene: 'plug-sheet', cue: 'If you only use', props: P(S.s17, 'continue'), overlays: [yearsRows]},
  {scene: 'plug-sheet', cue: 'But EVs also tend', props: P(S.s18, 'continue'), overlays: [barsCard]},
  {scene: 'plug-sheet', cue: 'Which plug would you', props: P(S.s19, 'continue')},
];

// ------------------------------------------------------------------ sound (flock-camera's `BEDS` pattern)

/**
 * Measured with the bundled ffmpeg `loudnorm` (integrated LUFS): voice −22.04, music −13.00, outdoor −32.45
 * (`sfx:station`; the same file as hybrid-city's and flock-camera's `city`), cabfan −30.44 (`sfx:cabfan`), garage-hum
 * −34.44 (`sfx:pump --name garage-hum`: the fixed 72 Hz hum, the garage's low electrical hum), idle −20.44
 * (hybrid-city's), pull-away −20.09 (`sfx:engine --from 800 --to 1800 --peak 2600 --seconds 2.6`, the RPM keys' green
 * swell), ev-roll −24.42 (`sfx:hiss --dry --from 0.2 --to 0.6 --seconds 3`: the EV's tires rolling off, no motor
 * sound), brake-soft −19.17 (`sfx:thump`), latch-in −27.65 (`sfx:latch`), pump-click −27.65 (`sfx:latch --part out`,
 * the nozzle's metal clack; both 0.3 s, measured padded to 2 s with silence), contactor-close −29.45 (`sfx:contactor`).
 * volume = (voice − dB under) − file. Beds 25 dB under, the gas engine 21, one-shots 20 (the EV's roll and the soft
 * brake 22). At most two beds at once: the outdoor bed everywhere, plus the garage hum (home framings), the cabinet fans
 * (the row) or the idle (the twins at a stop). The sheet and the value-bars scene keep the outdoor bed alone. Physical
 * sounds only: the fee, the cards, the tags and the slides make none.
 */
const VOICE_LUFS = -22.04;
const vol = (under: number, lufs: number) => r2(VOICE_LUFS - under - lufs);
const BEDS = {
  outdoor: {name: 'outdoor', volume: vol(25, -32.45)}, // −14.59: wind and far traffic, every location (`OUTDOOR`)
  garage: {name: 'garage-hum', volume: vol(25, -34.44)}, // −12.6: the home garage, close
  fans: {name: 'cabfan', volume: vol(25, -30.44)}, // −16.6: the fast-charger cabinets' fans, the row close
  idle: {name: 'idle', volume: vol(21, -20.44)}, // −22.6: the gas twin at a stop
} as const;
type Bed = keyof typeof BEDS;
/** Music (owner-approved, 80 s): 9 dB under the voice from frame 0, no duck, fading to silence on the last frame. */
const MUSIC = {level: vol(9, -13.0), duckDb: 0, startAt: 0, fadeIn: 1.5, fadeOut: 1.5} as const; // −18.04

/** One-shots, keyed to the world's own motion (video seconds). */
const SHOT = {
  pumpClick: {name: 'pump-click', volume: vol(20, -27.65)}, // −14.39
  latch: {name: 'latch-in', volume: vol(20, -27.65)}, // −14.39
  contactor: {name: 'contactor-close', volume: vol(20, -29.45)}, // −12.59
  pullAway: {name: 'pull-away', volume: vol(21, -20.09)}, // −22.95
  evRoll: {name: 'ev-roll', volume: vol(22, -24.42)}, // −19.62
  brake: {name: 'brake-soft', volume: vol(22, -19.17)}, // −24.87
} as const;
/** A row post's latch (post 1–4, its visit), from its driver's timeline exactly as the scene builds it. */
const ROW_GEO = driverGeo('us', 'crossover', {island: true});
const rowLatch = (post: number, visit: number) => {
  const v = POSTS[post - 1].visits?.[visit];
  if (!v || !v.driver || v.driver === 'auto') throw new Error(`ev-cost spec: post ${post} visit ${visit} has no keyed driver`);
  const tl = driverTimeline({...v.driver, look: v.driver.look ?? v.look}, ROW_GEO, v.arrive ? v.arrive.at + 0.1 : -Infinity);
  const at = tl.latched.find(([a]) => Number.isFinite(a));
  if (!at) throw new Error(`ev-cost spec: post ${post} visit ${visit} never latches`);
  return at[0];
};
/** YOU's latch at home: the plug key plus the walk to the holster and the port (`driverTimeline` on the home geometry: 65.04). */
const HOME_LATCH = r2(HOME_PLUG + 1.74);
/** The current flows 0.1–0.4 s after a latch (the scene's latch gate): the contactor closes there. */
const CONTACTOR_LAG = 0.3;
/** The car settles at the end of its stop ramp. */
const SETTLE = 0.15;
const PUMP_CLICK = (WORLD.pump as {clickOff: number[]}).clickOff[0];

/** One-shots per scene (1-based): [shot, video time, until (video time) or none]. */
type Shot = {shot: keyof typeof SHOT; t: number; until?: number; fade?: number};
const pullAway = (t: number, until?: number): Shot[] => [
  {shot: 'pullAway', t, until, fade: until !== undefined ? 0.3 : undefined},
  {shot: 'evRoll', t, until, fade: until !== undefined ? 0.3 : undefined},
];
const SHOTS: Record<number, Shot[]> = {
  1: [{shot: 'pumpClick', t: PUMP_CLICK}], // the nozzle clicks off and rocks once
  2: [{shot: 'latch', t: rowLatch(3, 0)}], // post 3's plug latches ("plug")
  6: [{shot: 'brake', t: REST1 - SETTLE}, ...pullAway(GREEN1)],
  8: [
    {shot: 'latch', t: rowLatch(2, 0)}, // post 2's plug, on "seventeen"
    {shot: 'contactor', t: rowLatch(2, 0) + CONTACTOR_LAG},
  ],
  12: [{shot: 'brake', t: REST2 - SETTLE}],
  13: [...pullAway(GREEN2, W.last + 0.5), {shot: 'brake', t: REST3 - SETTLE}], // a short pull (RPM 2400 → 1000 by "last" + 0.2), then the stop
  14: pullAway(GREEN3),
  15: [{shot: 'brake', t: REST4 - SETTLE}, ...pullAway(GREEN4, S.s16)], // faded out by the slide to P
  16: [{shot: 'latch', t: HOME_LATCH}], // YOU plugs the EV in at home
};

/** One bed's span in a scene, in video seconds: [from, to] (to = null: until the scene's cut). */
type Span = {bed: Bed; from?: number; to?: number | null; fade?: number};
/**
 * The outdoor bed runs under the whole video as one looped overlay on scene 1 with no `until`: it fades in from silence
 * at frame 0 and out to silence on the last frame (the loop's seam). Per-scene spans of it would dip to silence at every
 * cut, since a sound's `until` is clamped to its scene's cut (`overlayEnd`), so the pattern's `len + 0.5` crossover
 * can't happen.
 */
const OUTDOOR: OverlaySpec = {type: 'sfx', ...BEDS.outdoor, loop: true, fade: 1.0, at: 0} as OverlaySpec;
/** The second bed per scene (1-based), over the outdoor bed. */
const SOUND: Record<number, Span[]> = {
  1: [], // the sheet: all three sections
  2: [],
  3: [{bed: 'garage'}], // home
  4: [{bed: 'fans', to: W.both + 0.7, fade: 0.8}], // the posts close, then the crane out on "both"
  5: [], // A: the twins rolling
  6: [{bed: 'idle', from: REST1 - 1.0, to: GREEN1 + 0.5, fade: 0.5}], // the red; out as the gas twin pulls away
  7: [{bed: 'garage'}], // home, then the house meter
  8: [{bed: 'fans'}], // the posts
  9: [{bed: 'fans'}], // the row
  10: [{bed: 'fans'}], // the supply (two posts in frame)
  11: [{bed: 'fans'}], // the row
  12: [{bed: 'idle', from: REST2 - 1.0, fade: 0.5}], // the stop of "needs"; green at the cut
  13: [{bed: 'idle', from: W.last + 0.2, fade: 0.5}], // coasting into the stop of "slowing"
  14: [{bed: 'idle', to: GREEN3 + 0.5, fade: 0.5}], // until the green on "heavier"
  15: [{bed: 'idle', from: REST4 - 1.0, to: GREEN4 + 0.5, fade: 0.5}], // the stop under the counter
  16: [{bed: 'garage'}], // home
  17: [{bed: 'fans'}], // the row
  18: [], // the value bars: the outdoor bed alone
  19: [], // the loop: out by the last frame
};
const LAST_SCENE = STARTS.length;
const sfxFor = (n: number): OverlaySpec[] => {
  const s = STARTS[n - 1];
  const len = r2(endOf(s) - s);
  const nextBeds = new Set((SOUND[n + 1] ?? []).filter((x) => x.from === undefined).map((x) => x.bed));
  const beds = (SOUND[n] ?? []).map((sp) => {
    const loopEnd = n === LAST_SCENE; // the seam: faded out exactly on the last frame
    const carries = sp.to === undefined && nextBeds.has(sp.bed) && !loopEnd;
    const until = sp.to != null ? rel(sp.to, s) : carries ? r2(len + 0.5) : len; // flock-camera's crossover (clamped to the cut today: see `OUTDOOR`)
    return {type: 'sfx', ...BEDS[sp.bed], loop: true, fade: sp.fade ?? 1.0, at: sp.from !== undefined ? rel(sp.from, s) : 0, until} as OverlaySpec;
  });
  const shots = (SHOTS[n] ?? []).map(
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

/** The cover: the three plugs in one frame (the voice on "plug"), the hook line in the sky. */
const COVER_AT = W.plug2 + 0.3;

export const spec: VideoSpec = {
  tail: TAIL,
  music: MUSIC,
  scenes,
  cover: {
    text: 'An EV can cost\nless than gas, or more.',
    size: 130,
    scene: 'plug-sheet',
    camera: at(nudge(PLUGS, 0, 1.6), PLUGS.distance - vOf(PLUGS) * (COVER_AT - S.s2 - G)),
    at: COVER_AT,
    props: {...WORLD, drift: 0},
  },
};
