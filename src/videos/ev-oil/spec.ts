/* eslint-disable @remotion/non-pure-animation -- false positive: `transition` keys in scene props are data, not CSS transitions */
import type {OverlaySpec, SceneSpec, VideoSpec} from '../../types';
import {cityTwinFramings, type CityTwinSceneProps} from '../../scenes/CityTwinScene';
import {shopFramings, type ShopMechanicKey} from '../../scenes/ShopSliceScene';
import {TWINS} from '../../theme';
import transcript from './transcript.json';

/**
 * No. 021 · Why does only the gas car need engine oil changes? (`av-script.md` draft 2.1, cut on the recorded take:
 * 85.36 s of voice, a 1.5 s tail; style guide v0.18.18).
 *
 * Locations: T `city-twin` on the highway (the gas crossover on top, its oil system running; YOU's rear-drive EV below)
 * and S `shop-slice` (the same two cars on lifts, two mechanics). T → S → T → S → T: four slides; inside a location the
 * camera rides one path on the video clock (ev-winter's pattern: one key per frame), so glides land at speed and the
 * camera never stops.
 *
 * Orange = what the gas engine's oil does (§ 5 A fluid's work as the system): the circulation on the cut face, the film on
 * sliding interfaces, drops ending at the pool. System strength dims on "protective additives" (1.5 s) and narrows on
 * "thinner" (1.0 s), back to full only with the fresh-oil fill in the shop. Combustion flashes `screenLight`, blow-by
 * `RACE.haze`, the oil at rest in its own colour. Nothing orange on the EV.
 *
 * The loop: the last scene (T, `loop`) lands on frame 0's framing and push, the gearbox closed, the oil fresh and full.
 */

const WORDS = (transcript as {words: {text: string; start: number; end: number}[]}).words;
const norm = (x: string) => x.toLowerCase().replace(/[^a-z0-9']/g, '');
const PHRASES: [string, string][] = [
  ['transmission', 'transmission'],
  ['hundreds', 'hundreds'],
  ['an2', 'an ev motor has about'],
  ['motor2', 'motor'],
  ['one2', 'one'],
  ['why', 'why does only'],
  ['gas3', 'gas car'],
  ['oil3', 'oil changes'],
  ['changesEnd', 'changes'],
  ['big', 'a big part'],
  ['combustion', 'combustion'],
  ['burning', 'burning'],
  ['wears', 'wears out'],
  ['inside', 'inside the engine alone'],
  ['dozens', 'dozens'],
  ['slide', 'slide'],
  ['spin', 'spin'],
  ['oil7', 'oil keeps'],
  ['metal7', 'metal from'],
  ['rubbing', 'rubbing'],
  ['carries7', 'carries the heat'],
  ['heat', 'heat'],
  ['each', 'each time'],
  ['burns8', 'burns'],
  ['hotgas', 'hot gas'],
  ['leaks', 'leaks'],
  ['down', 'down into'],
  ['oil8', 'oil'],
  ['that9', 'that gas is dirty'],
  ['dirty', 'dirty'],
  ['soot', 'soot'],
  ['water', 'water'],
  ['acid10', 'acid'],
  ['unburned', 'unburned'],
  ['over', 'over time'],
  ['time11', 'time'],
  ['acid11', 'acid'],
  ['protective', 'protective'],
  ['fuel11', 'fuel makes'],
  ['thinner', 'thinner'],
  ['thats', "that's why"],
  ['need12', 'need fresh'],
  ['fresh', 'fresh'],
  ['every', 'every'],
  ['five', 'five to ten'],
  ['an13', 'an ev motor has no'],
  ['combustion13', 'combustion'],
  ['its', 'its rotor'],
  ['spins', 'spins'],
  ['ring', 'ring of'],
  ['and14', "and there's no"],
  ['engine14', 'engine oil'],
  ['change14', 'change'],
  ['even', 'even so'],
  ['does', 'does have'],
  ['oil15', 'oil'],
  ['gearbox16', 'gearbox'],
  ['two', 'two liters'],
  ['that17', 'that oil coats'],
  ['coats', 'coats'],
  ['gears', 'gears'],
  ['nothing', 'nothing burns'],
  ['anywhere', 'anywhere'],
  ['teslas', "tesla's maintenance"],
  ['doesnt', "doesn't list"],
  ['in19', 'in fairness'],
  ['brake', 'brake fluid'],
  ['cabin', 'cabin filters'],
  ['tire', 'tire rotations'],
  ['counting', 'counting those'],
  ['one20', 'one consumer'],
  ['study', 'study'],
  ['evs', 'evs cost'],
  ['half', 'half'],
  ['gascars', 'gas cars'],
  ['how', 'how many miles'],
  ['go', 'go between'],
  ['oil21', 'oil changes'],
];
const W = (() => {
  const out: Record<string, number> = {};
  let i = 0;
  for (const [key, phrase] of PHRASES) {
    const ws = phrase.split(' ').map(norm);
    let j = i;
    while (j < WORDS.length && !ws.every((x, k) => norm(WORDS[j + k]?.text ?? '') === x)) j++;
    if (j >= WORDS.length) throw new Error(`ev-oil spec: phrase not found in transcript: "${phrase}" (${key})`);
    out[key] = WORDS[j].start;
    if (key === 'changesEnd') out[key] = WORDS[j].end;
    i = j;
  }
  out.end = WORDS[WORDS.length - 1].end;
  return out as Record<(typeof PHRASES)[number][0] | 'end', number>;
})();

const FPS = 30;
const TAIL = 1.5;
const N_FRAMES = Math.round((W.end + TAIL) * FPS);
const LAST = (N_FRAMES - 1) / FPS;

const r2 = (x: number) => Math.round(x * 100) / 100;
/** A video time → seconds into the scene that starts at `s`. */
const rel = (t: number, s: number) => r2(t - s);
type KV = {at: number; value: number};
const shift = <T extends {at: number}>(ks: readonly T[], s: number): T[] => ks.map((k) => ({...k, at: rel(k.at, s)}));
const val = (pairs: [number, number][]): KV[] => pairs.map(([at, value]) => ({at, value}));
/** Plateaus: hold each value until the next change, then ease to it over `ramp` s (keyed values ease between keys). */
const steps = (changes: [number, number][], ramp: number): KV[] => {
  const out: KV[] = [{at: -100, value: changes[0][1]}];
  for (let i = 1; i < changes.length; i++) {
    const [t, v] = changes[i];
    out.push({at: t, value: out[out.length - 1].value}, {at: r2(t + ramp), value: v});
  }
  return out;
};
const within = (ts: number[], s: number, pad = 0.5) => ts.filter((t) => t > s - pad && t < endOf(s) + pad).map((t) => rel(t, s));

// ------------------------------------------------------------------ scene starts (video seconds)

const S = {
  s1: 0, // T, frame 0
  s2: W.an2,
  s3: W.big,
  s4: W.inside,
  s5: W.oil7,
  s6: W.each,
  s7: W.that9,
  s8: W.over,
  s9: W.thats, // slide → S
  s10: W.its, // slide → T
  s11: W.even,
  s12: W.that17,
  s13: W.teslas, // slide → S
  s14: W.in19,
  s15: W.counting,
  s16: W.how, // slide → T, the loop
};
const STARTS = Object.values(S);
/** The oil change (scene 9): one mechanic drains (1.0 s), steps onto the stool and pours (1.2 s; no second figure beside him). */
const DRAIN = r2(W.thats + 0.5);
const POUR = r2(DRAIN + 1.0 + 0.75);
const endOf = (start: number) => STARTS.find((x) => x > start + 1e-6) ?? N_FRAMES / FPS;

// ------------------------------------------------------------------ the camera on the video clock (ev-winter's pattern)

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
const G = 0.8; // glide length (s)
/** Glide onto `f` at `t0` (G s), then push at `v` (units/s) until `t1`. */
const glideThenPush = (f: Framing, t0: number, t1: number, v: number): PathKey[] => [
  {t: t0 + G, f, ease: 'glide'},
  {t: t1, f: at(f, f.distance - v * (t1 - t0 - G))},
];

// ------------------------------------------------------------------ T: the highway twin

const MPH = 11.9 / 60; // 1 mph in rev/s
const CRUISE = 60 * MPH;
const TBASE: Partial<CityTwinSceneProps> = {road: 'highway', top: {variant: 'gas'}, bottom: {variant: 'ev'}};
const TF0 = cityTwinFramings(TBASE);
const lower = (f: Framing, dy: number, distance = f.distance): Framing => ({look: [f.look[0], f.look[1] - dy, f.look[2]], distance});
/**
 * The builder's presets, nudged on stills so each subject sits above a two-line caption page (≈ y 1045): the look point
 * lowered (the subject rises), the engine pulled back so head to sump fits between the top of the safe zone and the
 * captions.
 */
const TF = {
  ...TF0,
  engine: lower(TF0.engine, 0.25, 3.4),
  cylinder: lower(TF0.cylinder, 0.08),
  crankcase: lower(TF0.crankcase, 0.13, 1.6),
  blowby: lower(TF0.blowby, 0.07, 1.0),
  motor: lower(TF0.motor, 0.08),
  gearbox: lower(TF0.gearbox, 0.15),
  evUnit: lower(TF0.evUnit, -0.12), // the motor below the title block (scene 2), above the captions
};
/** Frame 0 and the loop's landing. */
const TWIN_BAYS: Framing = {look: [TF.twinBays.look[0], TF.twinBays.look[1] + 0.85, TF.twinBays.look[2]], distance: 19};
const V0 = 0.12;
const baysAt = (t: number): Framing => at(TWIN_BAYS, TWIN_BAYS.distance - V0 * t);

/** Scenes 3–4: the engine closer than scene 8's `engine` (which keeps room for the gauge). */
const ENGINE_NEAR: Framing = {look: [TF.engine.look[0], TF.engine.look[1] - 0.035, TF.engine.look[2]], distance: 3.0};
const PATH_T1: PathKey[] = [
  {t: -1, f: baysAt(-1)},
  {t: 0, f: TWIN_BAYS},
  // review note a: from frame 0 (left at the loop's push speed) a quicker push toward the gas engine bay
  {
    t: S.s2,
    f: {look: TWIN_BAYS.look.map((x, k) => x + 0.45 * (TF0.engine.look[k] - x)) as V3, distance: 13.5},
    ease: 'glide',
  },
  ...glideThenPush(TF.evUnit, S.s2, W.why, 0.03),
  ...glideThenPush(baysAt(S.s2 + 1), W.why, S.s3, V0),
  ...glideThenPush(ENGINE_NEAR, S.s3, S.s5, 0.02),
  ...glideThenPush(TF.crankcase, S.s5, S.s6, 0.015),
  ...glideThenPush(TF.cylinder, S.s6, W.down, 0.012),
  ...glideThenPush(TF.crankcase, W.down, S.s7, 0.015),
  ...glideThenPush(TF.blowby, S.s7, S.s8, 0.008),
  ...glideThenPush(TF.engine, S.s8, S.s9 + 1, 0.02),
];
const PATH_T2: PathKey[] = [
  {t: S.s10 - 1, f: at(TF.motor, TF.motor.distance + 0.03)},
  {t: W.and14, f: at(TF.motor, TF.motor.distance - 0.03 * (W.and14 - S.s10))},
  ...glideThenPush(baysAt(4), W.and14, S.s11, V0),
  ...glideThenPush(TF.gearbox, S.s11, W.nothing, 0.015),
  ...glideThenPush(TF.evUnit, W.nothing, S.s13 + 1, 0.03),
];
/** The loop: slides in a little wider on frame 0's look point, glides onto frame 0's framing and push by the last frame. */
const PATH_LOOP: PathKey[] = [
  {t: S.s16 - 1, f: at(TWIN_BAYS, TWIN_BAYS.distance + 3.2)},
  {t: S.s16 + 0.4, f: at(TWIN_BAYS, TWIN_BAYS.distance + 3.2 - 0.3 * 1.4)},
  {t: LAST - 1, f: baysAt(-1), ease: 'glide'},
  {t: LAST, f: TWIN_BAYS},
  {t: LAST + 1, f: baysAt(1)},
];

// the gas twin's oil system, on the video clock (shifted per scene)
const STRENGTH: KV[] = val([
  [-100, 1],
  [W.protective, 1],
  [W.protective + 1.5, 0.45],
  [POUR, 0.45],
  [POUR + 1.2, 1],
]);
const CORE: KV[] = val([
  [-100, 1],
  [W.thinner, 1],
  [W.thinner + 1.0, 0.45],
  [POUR, 0.45],
  [POUR + 1.2, 1],
]);
const DRIP = steps(
  [
    [0, 2.5],
    [W.fuel11, 4.2],
    [POUR, 2.5],
  ],
  0.8,
);
const OIL_COLOR = [
  {at: -100, shade: 'fresh' as const},
  {at: r2(W.unburned + 0.7), shade: 'used' as const, for: r2(W.acid11 - W.unburned - 0.7)},
  {at: W.fuel11, shade: 'old' as const, for: 0.8},
  {at: POUR, shade: 'fresh' as const, for: 0.2},
];
// the ink oil-life gauge: draws on at "time", a tick every 0.8 s to its low tick at "thinner", refilled with the pour
const GAUGE_TICKS = [0, 1, 2, 3, 4, 5].map((i) => r2(W.time11 + 0.25 + i * 0.8));
const GAUGE_LOW = 1 - 0.12 * GAUGE_TICKS.length;
const GAUGE: KV[] = [
  {at: -100, value: 1},
  ...GAUGE_TICKS.flatMap((t, i) => [
    {at: t, value: r2(1 - 0.12 * i)},
    {at: r2(t + 0.25), value: r2(1 - 0.12 * (i + 1))},
  ]),
  {at: r2(POUR + 0.1), value: r2(GAUGE_LOW)},
  {at: r2(POUR + 1.1), value: 1},
];
/** The gauge beside the sump, left of the half-shaft (review note b), 1.3× the default height. */
const GAUGE_PLACE = {at: [1.43, 0.14, 0.36] as V3, height: 0.26};
const GAUGE_ON: KV[] = val([
  [-100, 0],
  [W.time11, 0],
  [W.time11 + 0.3, 1],
  [W.five + 1.1, 1],
  [W.five + 1.6, 0],
]);
const OIL_SYSTEM = (s: number, o: {blowBy?: boolean; specks?: boolean} = {}) => ({
  strength: shift(STRENGTH, s),
  core: shift(CORE, s),
  waveAt: rel(W.dozens, s),
  surgeAt: within([W.gas3, W.spin, W.engine14], s),
  passAt: within([W.hundreds, W.oil3, W.go], s),
  jetAt: within([W.carries7], s),
  dripRate: shift(DRIP, s),
  combustion: {at: rel(W.combustion, s)},
  // wisps from firings before the cut carry into the next scene (the start reaches back to the first leak)
  blowBy: o.blowBy ? {at: Math.min(rel(W.hotgas, s), -3), until: rel(S.s9, s)} : null,
  specks: o.specks ? {soot: r2(rel(W.soot, s) - 0.2), water: rel(W.water, s), fuel: rel(W.unburned, s)} : null,
});
// the EV's gear case: closed until "does have", open through the shop, closed again as the loop lands
const GEAR_OPEN = val([
  [-100, 0],
  [W.does, 0],
  [W.does + 0.5, 1],
  [S.s16 + 0.5, 1],
  [S.s16 + 1.0, 0],
]);
// § 3 wheels (main session, 2026-11-19): the near wheel that hides the subject is hidden (0) on the close framings (the gas
// engine's four, `evUnit`, `motor`, `gearbox`) and at 0.35 on frame 0's `twinBays`; every other near wheel whole.
const RR_T = steps(
  [
    [0, 0.35],
    [S.s2, 0],
    [W.why, 0.35],
    [S.s10 - 0.6, 0],
    [W.and14, 0.35],
    [S.s11, 0],
    [S.s16 - 0.6, 0.35],
  ],
  0.5,
);
const FR_T = steps(
  [
    [0, 1],
    [S.s3, 0],
    [S.s9, 1],
  ],
  0.5,
);
const PUFFS = [3.4, 8.6, 52.4, 84.0];

const TWIN = (s: number, o: {path: PathKey[]; transition: string; blowBy?: boolean; specks?: boolean; gauge?: boolean; loop?: boolean}) => ({
  location: 'city-twin-highway',
  road: 'highway',
  driving: [{at: -100, speed: CRUISE}],
  top: {
    variant: 'gas',
    shape: 'crossover',
    paint: TWINS.gasPaint,
    driver: 'extra',
    nearWheels: 'whole',
    tireText: false,
    clusterBlank: true,
    rpm: 2500,
    engineRun: [{at: -100, on: true}],
    exhaust: within(PUFFS, s, 2).map((t) => ({at: t, size: 1})),
    oilSystem: OIL_SYSTEM(s, o),
    oilColor: shift(OIL_COLOR, s),
    oilGauge: o.gauge ? {level: shift(GAUGE, s), opacity: shift(GAUGE_ON, s), ...GAUGE_PLACE} : null,
    wheelGhost: {FR: shift(FR_T, s)},
  },
  bottom: {
    variant: 'ev',
    shape: 'crossover',
    driver: 'you',
    nearWheels: 'whole',
    tireText: false,
    clusterBlank: true,
    evDrive: 'rear',
    gearbox: {
      open: shift(GEAR_OPEN, s),
      splashAt: within([W.does + 1.8, W.gears], s),
      // FIX-C: the amber coat sweeps the teeth on "coats" (scene 12; before it, the coat comes with the opening)
      ...(s >= S.s12 - 1e-6 ? {coatAt: rel(W.coats, s)} : {}),
    },
    wheelGhost: {RR: shift(RR_T, s)},
  },
  ...(o.loop ? {loop: true} : {}),
  drift: 0,
  transition: o.transition,
  cameraKeys: camKeys(o.path, s),
});

// ------------------------------------------------------------------ S: the shop

const SF0 = shopFramings({});
const SF = {
  ...SF0,
  // wider than the presets: the car's front half, the sump, the filler, the pan and the mechanic, the counter's band clear
  gasLift: {look: [-2.0, SF0.gasLift.look[1] - 0.15, 0.4], distance: 11.5} as Framing,
  // the rear unit, the ghost pan under it (≥ 120 px) and the floor to the tail spot
  evLift: {look: [1.9, 1.35, 0.45], distance: 9.0} as Framing,
  // the EV whole, lifted clear of a two-line caption page (its wheels were under the captions at the preset)
  evService: {look: [SF0.evService.look[0] - 0.45, SF0.evService.look[1] - 1.2, SF0.evService.look[2]], distance: r2(SF0.evService.distance * 1.08)} as Framing,
};
/** FIX-A: close on the oil change. The drain: the sump, the stream, the pan and the mechanic; then up to the filler for the pour (below the counter's band). */
const G_TOP = SF0.gasLift.look[1] - 1.6; // the top bay's floor
const DRAIN_F: Framing = {look: [-1.83, G_TOP + 1.39, 0.31], distance: 7.5};
const POUR_F: Framing = {look: [-2.08, G_TOP + 1.99, 0.44], distance: 7.5};
const PATH_S1: PathKey[] = [
  {t: S.s9 - 1, f: at(DRAIN_F, DRAIN_F.distance + 0.04)},
  {t: r2(DRAIN + 1.05), f: at(DRAIN_F, DRAIN_F.distance - 0.04 * (DRAIN + 1.05 - S.s9))},
  ...glideThenPush(POUR_F, r2(DRAIN + 1.05), W.an13, 0.04),
  ...glideThenPush(SF.evLift, W.an13, S.s10 + 1, 0.04),
];
const PATH_S2: PathKey[] = [
  {t: S.s13 - 1, f: at(SF.evLift, SF.evLift.distance + 0.04)},
  {t: S.s14, f: at(SF.evLift, SF.evLift.distance - 0.04 * (S.s14 - S.s13))},
  ...glideThenPush(SF.evService, S.s14, S.s15, 0.06),
  ...glideThenPush(SF.shop, S.s15, S.s16 + 1, 0.08),
];


const LIFT_LOW = 1.0;
const LIFT_EV = steps(
  [
    [0, 1.6],
    [S.s14, LIFT_LOW],
  ],
  1.2,
);
const LIFT_GAS = steps(
  [
    [0, 1.6],
    [W.half + 0.6, 0.9],
  ],
  1.2,
);
// the gas car's near front wheel hidden on the oil change (FIX-A: it hid the sump and the stream), whole elsewhere
const FR_S = steps(
  [
    [0, 0],
    [W.an13, 1],
  ],
  0.5,
);
// the EV's near rear wheel at 0.35 on `evLift` only (it hides the rear unit), whole elsewhere
const RR_S = steps(
  [
    [0, 1],
    [W.an13, 0.35],
    [S.s14, 1],
  ],
  0.5,
);
/** Two mechanics per visit, video-time keys (shifted per scene). Starts and spots keep them clear of the cars and apart. */
/** Beside the EV's tail, in front of the section, outside the body's footprint and ≥ 1 m from the ghost pan. */
const BY_TAIL: [number, number] = [2.75, 1.15];
type Mech = {bay: 'top' | 'bottom'; look: 'a' | 'b'; start: string | [number, number]; keys: ShopMechanicKey[]};
const MECH_1: Mech[] = [
  // A drains from beside the nose (outside the car's footprint, so nothing passes through the body), steps onto the stool,
  // pours, wipes his hands; B stays out of this bay (note 2)
  {
    bay: 'top',
    look: 'a',
    start: 'sump',
    keys: [
      {at: r2(DRAIN - 0.3), do: 'act', act: 'drain', for: 1.2},
      {at: r2(DRAIN + 1.05), do: 'walkTo', to: 'stool'},
      {at: r2(POUR - 0.1), do: 'act', act: 'pour', for: 1.4},
      {at: r2(POUR + 1.6), do: 'act', act: 'wipe', for: 1.0},
    ],
  },
  // the EV's bay: B walks in from the tail side (never under the car), glances at the motor on "combustion"
  {
    bay: 'bottom',
    look: 'b',
    start: 'out',
    keys: [
      {at: r2(W.an13 + 0.2), do: 'walkTo', to: BY_TAIL},
      {at: r2(W.combustion13), do: 'glance', to: 'gearbox', hold: 1.0},
    ],
  },
];
const MECH_2: Mech[] = [
  // A: into the EV's bay from the tail side, wipes his hands, glances at the gearbox (≥ 0.3 m from the ghost), walks on;
  // then the reservoir and the dash; then the gas car's lift
  {
    bay: 'bottom',
    look: 'a',
    start: 'out',
    keys: [
      {at: r2(S.s13 + 0.2), do: 'walkTo', to: BY_TAIL},
      {at: r2(S.s13 + 1.6), do: 'act', act: 'wipe', for: 0.8},
      {at: r2(W.doesnt + 0.6), do: 'glance', to: 'gearbox', hold: 0.9},
      {at: r2(S.s14 - 0.3), do: 'walkTo', to: 'reservoir'},
      {at: r2(W.brake - 0.2), do: 'act', act: 'cap', for: 1.1},
      {at: r2(W.cabin - 0.5), do: 'walkTo', to: 'dash'},
      {at: r2(W.cabin + 0.1), do: 'act', act: 'filter', for: 0.8},
      {at: r2(W.study), do: 'walkTo', to: 'nose'},
    ],
  },
  // B: kneels at the rear wheel for the rotation (apart from A at the front), stands, wipes the wheel
  {
    bay: 'bottom',
    look: 'b',
    start: 'out',
    keys: [
      {at: r2(S.s14 + 0.2), do: 'walkTo', to: [1.8, 1.1]}, // behind the rear tire, clear of the rotation arrowhead
      {at: r2(W.tire - 0.2), do: 'act', act: 'kneel', for: 1.6},
      {at: r2(W.half + 1.4), do: 'act', act: 'wipe', for: 1.0},
    ],
  },
  // the gas car's bay: a mechanic at the tail lowers its lift during the card
  {
    bay: 'top',
    look: 'a',
    start: [2.5, 0.5], // 0.4 m in from the tail spot, inside the frame
    keys: [{at: r2(W.half + 0.4), do: 'act', act: 'button', for: 1.2}],
  },
];
const mechs = (ms: Mech[], s: number) => ms.map((m) => ({...m, keys: shift(m.keys, s)}));

const SHOP = (s: number, o: {path: PathKey[]; transition: string; visit: 1 | 2}) => {
  const T = (k: KV[]) => shift(k, s);
  const gasOil = {
    strength: T(STRENGTH),
    core: T(CORE),
    combustion: false,
    dripRate: 0,
  };
  return {
    top: {
      car: {
        oilSystem: gasOil,
        wheelGhost: {FR: T(o.visit === 1 ? FR_S : val([[-100, 1]]))},
        ...(o.visit === 1
          ? {oilGauge: {level: T(GAUGE), opacity: T(GAUGE_ON), ...GAUGE_PLACE}}
          : {oilColor: [{at: -100, shade: 'fresh'}], oilLevel: 0.55}),
      },
      lift: o.visit === 1 ? 1.6 : T(LIFT_GAS),
      ...(o.visit === 1 ? {drain: {at: rel(DRAIN, s), for: 1.0}, pour: {at: rel(POUR, s), for: 1.2}, oilBefore: 'old'} : {}),
    },
    bottom: {
      car: {gearbox: {open: T(GEAR_OPEN)}, wheelGhost: {RR: T(RR_S)}},
      lift: T(LIFT_EV),
      ...(o.visit === 2
        ? {
            ghostPan: {at: rel(W.doesnt, s), fadeAt: rel(W.doesnt + 1.3, s), under: 'gearbox'},
            cap: {at: rel(W.brake, s), for: 0.9},
            cabinFilter: {at: rel(W.cabin, s), back: rel(W.cabin + 0.6, s)},
            rotateArrows: {at: rel(W.tire, s), fadeAt: rel(S.s15 + 0.3, s)},
          }
        : {}),
    },
    mechanics: mechs(o.visit === 1 ? MECH_1 : MECH_2, s),
    drift: 0,
    transition: o.transition,
    cameraKeys: camKeys(o.path, s),
  };
};

// ------------------------------------------------------------------ overlays

const titleBlock = {
  type: 'title',
  at: 0,
  question: 'Why does only the gas car\nneed engine oil changes?',
  number: 'No. 021',
  title: 'The Oil Pan',
  time: '2:10 PM',
  carry: true,
  until: r2(W.changesEnd + 0.8 + 10 / FPS),
} as OverlaySpec;

const callout = (
  title: string,
  a: number,
  b: number,
  s: number,
  place: {anchor?: string; x?: number; y?: number; dx: number; dy: number; side?: 'side' | 'above'},
): OverlaySpec =>
  ({
    type: 'callout',
    ...(place.anchor ? {anchor: place.anchor} : {x: place.x, y: place.y}),
    title,
    size: 1.5,
    place: place.side ?? 'side',
    dx: place.dx,
    dy: place.dy,
    at: rel(a, s),
    until: rel(b, s),
  }) as OverlaySpec;

const milesCounter: OverlaySpec = {
  type: 'counter',
  from: 5000,
  to: 5000,
  duration: 0.1,
  rangeTo: 10000,
  rangeAt: 0,
  label: 'miles',
  sub: 'ABOUT EVERY',
  subPlace: 'above',
  x: 0.111,
  y: 0.155,
  at: rel(W.five, S.s9),
  until: rel(W.an13 - 0.05, S.s9),
} as OverlaySpec;

const CARD_IN = r2(W.one20);
const cardT = (t: number) => r2(t - CARD_IN);
const costCard: OverlaySpec = {
  type: 'chart',
  at: rel(CARD_IN, S.s15),
  until: rel(S.s16 - 0.4, S.s15),
  tab: 'COST',
  top: 330,
  height: 290,
  barNames: ['GAS', 'EV'],
  bars: [
    {
      label: 'MAINTENANCE + REPAIR',
      refAt: cardT(W.study),
      value: 0.5,
      valueAt: cardT(W.evs),
      barLabel: 'ABOUT HALF',
      barLabelAt: cardT(W.half),
    },
  ],
} as OverlaySpec;

// ------------------------------------------------------------------ scenes

const T1 = (s: number, transition: string, o: {blowBy?: boolean; specks?: boolean; gauge?: boolean} = {}) => TWIN(s, {path: PATH_T1, transition, ...o});
const T2 = (s: number, transition: string) => TWIN(s, {path: PATH_T2, transition});

const scenes: SceneSpec[] = [
  // ---- 1–8 T: frame 0, the question, inside the gas engine
  {scene: 'city-twin', cue: "A gas car's engine", props: T1(S.s1, 'continue'), overlays: [titleBlock]},
  {scene: 'city-twin', cue: 'An EV motor has about', props: T1(S.s2, 'continue')},
  {scene: 'city-twin', cue: 'A big part of', props: T1(S.s3, 'continue')},
  {scene: 'city-twin', cue: 'Inside the engine alone', props: T1(S.s4, 'continue')},
  {scene: 'city-twin', cue: 'Oil keeps that metal', props: T1(S.s5, 'continue')},
  {scene: 'city-twin', cue: 'Each time the fuel', props: T1(S.s6, 'continue', {blowBy: true})},
  {scene: 'city-twin', cue: 'That gas is dirty.', props: T1(S.s7, 'continue', {blowBy: true, specks: true})},
  {scene: 'city-twin', cue: 'Over time, the acid', props: T1(S.s8, 'continue', {blowBy: true, specks: true, gauge: true})},
  // ---- 9 S: the oil change, then the EV's still motor
  {scene: 'shop-slice', cue: "That's why many gas", props: SHOP(S.s9, {path: PATH_S1, transition: 'slide', visit: 1}), overlays: [milesCounter]},
  // ---- 10–12 T: the rotor, the gearbox's oil
  {
    scene: 'city-twin',
    cue: 'Its rotor spins inside',
    props: T2(S.s10, 'slide'),
    overlays: [callout('Rotor', r2(S.s10 + 0.6), r2(W.and14 - 0.17), S.s10, {x: 0.47, y: 0.41, dx: -200, dy: -260, side: 'above'})],
  },
  {
    scene: 'city-twin',
    cue: 'Even so, an EV',
    props: T2(S.s11, 'continue'),
    overlays: [callout('About 2 liters', W.two, r2(S.s12 - 0.15), S.s11, {anchor: 'gearPool:bottom', dx: 0, dy: -60, side: 'above'})],
  },
  {scene: 'city-twin', cue: 'That oil coats spinning', props: T2(S.s12, 'continue')},
  // ---- 13–15 S: no change listed, the fairness items, the cost card
  {scene: 'shop-slice', cue: "Tesla's maintenance schedule doesn't", props: SHOP(S.s13, {path: PATH_S2, transition: 'slide', visit: 2})},
  {
    scene: 'shop-slice',
    cue: 'In fairness, that same',
    props: SHOP(S.s14, {path: PATH_S2, transition: 'continue', visit: 2}),
    overlays: [
      callout('Brake fluid', W.brake, r2(W.cabin - 0.33), S.s14, {anchor: 'reservoir:bottom', dx: -60, dy: -230, side: 'above'}),
      callout('Cabin filter', W.cabin, r2(W.tire - 0.2), S.s14, {anchor: 'cabinFilter:bottom', dx: 40, dy: -260, side: 'above'}),
    ],
  },
  {scene: 'shop-slice', cue: 'Counting those, one consumer', props: SHOP(S.s15, {path: PATH_S2, transition: 'continue', visit: 2}), overlays: [costCard]},
  // ---- 16 T: the loop
  {scene: 'city-twin', cue: 'How many miles do', props: TWIN(S.s16, {path: PATH_LOOP, transition: 'slide', loop: true})},
];

/** The cover's framing: the gas engine whole, the oil lit, under the cover text (`TF.engine`, nudged down). */
const COVER_ENGINE: Framing = lower(TF0.engine, -0.12, 3.6);

// ------------------------------------------------------------------ sound (home-heat's `BEDS` pattern)

/**
 * Measured with ffmpeg `loudnorm` (integrated LUFS; beds and one-shots measured looped): voice −21.97, music −14.05
 * (owner-approved, 87 s: muted electric piano, plucked guitar, pad, light ticking), cruise −24.39 (`sfx:cruise day
 * --seconds 12`: dry tire roar plus a distant four-cylinder), engine −20.50 (`sfx:engine --from 2500 --to 2500 --seconds
 * 6`: the close four-cylinder at the scenes' 2500 rpm, no bangs), whine −18.10 (`sfx:whine --from 760 --to 740 --curve 1
 * --noise 0.15`: the EV motor's steady whine), room −30.43 (copied from home-heat: room tone), lift −34.45 (`sfx:pump
 * --seconds 1.6`: the lift's hydraulic hum), drain −24.43 and pour −24.42 (`sfx:hiss --pitch 0.45 / 0.7`: a soft
 * trickle and a softer glug), clink −29.47 (`sfx:contactor --part open --pitch 1.6`: the drain plug and a tool),
 * case-latch −26.41 (`sfx:latch --part out`: the gear case's front lifting off and seating). All free and self-made.
 * volume = (voice − dB under) − file. Cruise 25 under, the close engine 23, the far engine (wide twin framings) 31, the
 * whine 26, room tone 32, the lift 22, one-shots 19–21. Physical sounds only: the orange, the flashes, the cards and the
 * gauge make none. The seam: frame 0 and the last frame both run the cruise and the far engine (0.15 s edges); the music
 * fades at both ends.
 */
const VOICE_LUFS = -21.97;
const vol = (under: number, lufs: number) => r2(VOICE_LUFS - under - lufs);
const BEDS = {
  cruise: {name: 'cruise', volume: vol(25, -24.39)}, // −22.58: both twins on the highway
  engineFar: {name: 'engine', volume: vol(31, -20.5)}, // −32.47: the gas twin on the wide twin framings
  engine: {name: 'engine', volume: vol(23, -20.5)}, // −24.47: under the engine close-ups
  whine: {name: 'whine', volume: vol(26, -18.1)}, // −29.87: the EV motor close-ups
  room: {name: 'room', volume: vol(32, -30.43)}, // −23.54: the shop
} as const;
type Bed = keyof typeof BEDS;
/** Music: 9 dB under the voice from frame 0, no duck, fading to silence on the last frame (the seam). */
const MUSIC = {level: vol(9, -14.05), duckDb: 0, startAt: 0, fadeIn: 1.5, fadeOut: 1.5} as const; // −16.92
const SHOT = {
  drain: {name: 'drain', volume: vol(20, -24.43)}, // −17.54
  pour: {name: 'pour', volume: vol(21, -24.42)}, // −18.55
  clink: {name: 'clink', volume: vol(19, -29.47)}, // −11.5
  lift: {name: 'lift', volume: vol(22, -34.45)}, // −9.52
  latch: {name: 'case-latch', volume: vol(20, -26.41)}, // −15.56
} as const;

const SEC_END = N_FRAMES / FPS;
const CUT_FADE = 0.15;
/** Bed spans (video seconds), split into one looped overlay per scene; a copy meeting a cut fades by `CUT_FADE` only. */
type Span = {beds: Bed[]; from: number; to: number; fade: number};
const SPANS: Span[] = [
  // the highway, every T visit (the slides cut it)
  {beds: ['cruise'], from: 0, to: S.s9, fade: CUT_FADE},
  {beds: ['cruise'], from: S.s10, to: S.s13, fade: CUT_FADE},
  {beds: ['cruise'], from: S.s16, to: SEC_END, fade: CUT_FADE},
  // the gas twin's engine: far on the wide framings, close under the close-ups (scenes 3–8)
  {beds: ['engineFar'], from: 0, to: S.s3, fade: CUT_FADE},
  {beds: ['engine'], from: r2(S.s3 + 0.2), to: S.s9, fade: 0.6},
  {beds: ['engineFar'], from: r2(W.and14 + 0.2), to: S.s11, fade: 0.5},
  {beds: ['engineFar'], from: S.s16, to: SEC_END, fade: CUT_FADE},
  // the EV motor's whine on its close framings (scenes 10–12, not on the twin glide)
  {beds: ['whine'], from: S.s10, to: r2(W.and14 + 0.4), fade: 0.4},
  {beds: ['whine'], from: r2(S.s11 + 0.4), to: S.s13, fade: 0.5},
  // the shop
  {beds: ['room'], from: S.s9, to: S.s10, fade: CUT_FADE},
  {beds: ['room'], from: S.s13, to: S.s16, fade: CUT_FADE},
];
type Shot = {shot: keyof typeof SHOT; t: number};
const SHOTS: Shot[] = [
  {shot: 'clink', t: r2(DRAIN - 0.1)}, // scene 9: the drain plug comes out
  {shot: 'drain', t: DRAIN},
  {shot: 'clink', t: r2(DRAIN + 1.0)}, // the plug goes back in
  {shot: 'pour', t: POUR},
  {shot: 'latch', t: W.does}, // scene 11: the gear case's front lifts off
  {shot: 'lift', t: S.s14}, // scene 14: the EV comes down to working height
  {shot: 'clink', t: r2(W.brake + 0.1)}, // the reservoir cap
  {shot: 'lift', t: r2(W.half + 0.6)}, // scene 15: the gas car's lift lowers
  {shot: 'latch', t: r2(S.s16 + 0.95)}, // scene 16: the gear case seats again
];

const sfxFor = (n: number): OverlaySpec[] => {
  const st = STARTS[n - 1];
  const e = n < STARTS.length ? STARTS[n] : SEC_END;
  const beds = SPANS.filter((sp) => sp.from < e - 1e-6 && sp.to > st + 1e-6).flatMap((sp) => {
    const a = Math.max(sp.from, st);
    const b = Math.min(sp.to, e);
    const carried = sp.from < st - 1e-6 || sp.to > e + 1e-6;
    return sp.beds.map(
      (bed) =>
        ({
          type: 'sfx',
          ...BEDS[bed],
          loop: true,
          fade: carried ? Math.min(sp.fade, CUT_FADE) : sp.fade,
          at: rel(a, st),
          until: rel(b, st),
        }) as OverlaySpec,
    );
  });
  const shots = SHOTS.filter((x) => x.t >= st - 1e-6 && x.t < e - 1e-6).map((x) => ({type: 'sfx', ...SHOT[x.shot], at: rel(x.t, st)}) as OverlaySpec);
  return [...beds, ...shots];
};
scenes.forEach((sc, i) => {
  const extra = sfxFor(i + 1);
  if (extra.length) sc.overlays = [...(sc.overlays ?? []), ...extra];
});

export const spec: VideoSpec = {
  // Cover still (`yarn cover ev-oil`, publisher's text): scene 1's framing on the highway twin, the gas engine's orange oil
  // whole and close, under the cover text. A question that gives no answer.
  cover: {
    text: 'Why does only gas\nneed oil changes?',
    size: 130,
    scene: 'city-twin',
    camera: COVER_ENGINE,
    at: 2.6,
    props: {
      ...T1(S.s1, 'continue'),
      cameraKeys: undefined,
      top: {...T1(S.s1, 'continue').top, wheelGhost: {FR: val([[-100, 0]])}},
    },
  },
  tail: TAIL,
  music: MUSIC,
  scenes,
};
