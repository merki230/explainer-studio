/* eslint-disable @remotion/non-pure-animation -- false positive: `transition` keys in scene props are data, not CSS transitions */
import {CHARGE, RACE} from '../../theme';
import type {OverlaySpec, SceneSpec, VideoSpec} from '../../types';
import {teardownFramings, type TeardownSliceSceneProps} from '../../scenes/TeardownSliceScene';

/**
 * No. 011 · Why is a BYD so much cheaper than a Tesla? (`av-script.md` draft 4, on the recorded take, 92.64 s + 1.5 s tail).
 *
 * Locations (style guide v0.14): C `charge-slice` China with the chargers hidden (a parking lot: the BYD sedan in
 * `bydPaint` on top with its blade pack, the Model 3 sedan in `teslaPaint` below) · T `teardown-slice` (The Lab ·
 * teardown: the sedan's parts grid, and the hatch) · U `charge-slice` US (the empty bay and the BYD's ghost).
 * C → T → C → T → U → C, plus the re-dressing slides inside T. Orange = "made by BYD" (§ 5: an edge line + halo).
 *
 * Scenes start on cues. Inside a scene, beats are keyed to the transcript's word times (`W`, video seconds) and
 * shifted into scene time with `rel()`: they move with the words if the take is re-timed and `W` is updated.
 */

/** Word start times from `transcript.json` (video seconds). */
const W = {
  // 1 hook
  byd1: 1.28,
  tesla1: 2.76,
  half: 4.8,
  // 2 belief
  people: 6.4,
  assume: 7.16,
  labor: 8.72,
  // 3 rebuttal
  subsidies: 9.72,
  tesla3: 11.56,
  china3: 12.88,
  // 4 teardown
  so: 14.28,
  apart: 16.28,
  found: 17.12,
  about4: 18.32,
  quarters: 19.12,
  starting: 20.96,
  battery4: 21.76,
  // 5 battery
  battery5: 23.0,
  part5: 24.6,
  industry: 26.36,
  thirty: 27.76,
  forty: 28.4,
  cost5: 29.76,
  // 6 Tesla's cells
  teslas: 30.88,
  buys: 32.68,
  cells6: 33.28,
  from: 34.64,
  panasonic: 35.68,
  catl: 36.72,
  // 7 BYD's cells
  byd7: 38.2,
  makes7: 38.8,
  long: 40.6,
  blades: 42.16,
  and7: 43.04,
  builds: 43.2,
  pack7: 43.92,
  floor: 45.12,
  // 8–9 the hatch
  engineers: 46.24,
  took8: 46.88,
  found8: 48.64,
  motors: 50.04,
  and8: 51.23,
  electronics: 51.44,
  run: 52.24,
  even9: 53.28,
  body: 53.76,
  lights: 54.64,
  bydS: 55.04,
  // 10 the 15 %
  evenSo: 56.48,
  analysts10: 57.52,
  sedan10: 58.76,
  cost10: 59.84,
  only: 60.24,
  about10: 60.56,
  percent10: 61.56,
  less: 61.84,
  model10: 63.56,
  // 11 range
  part11: 65.07,
  remaining: 65.6,
  price11: 65.96,
  range: 67.08,
  because: 67.6,
  halfPrice: 67.96,
  charge11: 70.52,
  // 12 price war
  another: 72.32,
  priceWar: 73.6,
  byd12: 74.68,
  cutting: 75.64,
  there: 76.88,
  // 13 US
  you: 78.64,
  us: 80.08,
  byd13: 81.04,
  cars: 82.96,
  // 14 tariff + ban
  theres: 83.92,
  hundred: 84.32,
  evs: 86.56,
  starting14: 87.92,
  ban: 90.24,
  linked: 91.52,
  end: 92.64,
};
const TAIL = 1.5;
const END = W.end + TAIL;

const r2 = (x: number) => Math.round(x * 100) / 100;
/** A video time → seconds into the scene that starts at `s`. */
const rel = (t: number, s: number) => r2(t - s);

// ------------------------------------------------------------------ C: the parking lot (China)

/** The BYD's blade pack, grown long before frame 0 (it looks the same all video; scene 10 grows it on screen). */
const BLADE_FULL = {growAt: -20, glow: null};
/** N7 (`packRewind`): the packs seen full empty on screen just before their fill beats (video seconds). */
const TESLA_REWIND = 31.6; // as the glide to its pack lands (≈ 31.68); crate 1 slides in ≥ 0.3 s later and opens after the rewind ends
const BYD_REWIND = 38.9; // as the slide to the re-dressed Lab lands (≈ 38.8), so the tray is seen emptying
const BYD_GROW = 39.45; // "its own": the blades rise, front to back, done ≈ 41.85
/** The blades' glow (reviewer fix 4): lit as they rise, with surges rolling through the 2.4 s growth and on "blades". */
/** The blades' halo width (S1): the BYD's pack is only seen close (`topPack`, 8–9 m), where 1.0 reads (2.5 read as a band). */
const BLADE_GLOW_R = 1.3;
const bladeGlow = (s: number) => ({at: rel(BYD_GROW, s), surge: [BYD_GROW + 0.8, BYD_GROW + 1.6, BYD_GROW + 2.4, W.blades].map((t) => rel(t, s))});
/** The Model 3 below: a sedan in `teslaPaint` (the bay's default paint). */
const TESLA_CAR = {shape: 'model3'} as const; // the real-car shape (style guide v0.15 § 3)
/** The BYD: the Seal 06 shape, on the top bay, the ghost and the teardown sedan. */
const BYD_SHAPE = 'seal06' as const;

const shiftKeys = <T extends {at: number}>(keys: readonly T[], s: number): T[] => keys.map((k) => ({...k, at: rel(k.at, s)}));


// ------------------------------------------------------------------ T: The Lab · teardown

/** The sedan's teardown, in video seconds (shifted into each T scene). */
const SEDAN_T = {
  apart: W.apart - 0.1,
  scan: W.found + 0.9,
  packLit: W.about4,
  wave: W.quarters - 0.4,
  dim: 20.4,
};
const sedanTeardown = (s: number, extra: Partial<TeardownSliceSceneProps> = {}): Partial<TeardownSliceSceneProps> => ({
  dressing: 'sedan',
  scanPx: 5, // S3: 3 px vanished at `whole`
  apart: {at: rel(SEDAN_T.apart, s), for: 1.3},
  scan: [{at: rel(SEDAN_T.scan, s)}],
  glow: [
    {at: rel(SEDAN_T.packLit, s), groups: ['pack']},
    {at: rel(SEDAN_T.wave, s), wave: 1.6},
  ],
  dimAt: rel(SEDAN_T.dim, s),
  ...extra,
  car: {shape: BYD_SHAPE, ...(extra.car ?? {})},
});

/** T framings (set on stills): the presets left the room in the frame's upper half, so these aim a little higher. */
const TF = teardownFramings();
const up = (f: {look: [number, number, number]; distance: number}, dy: number, distance: number) => ({
  look: [f.look[0], f.look[1] + dy, f.look[2]] as [number, number, number],
  distance,
});
const T_GRID = up(TF.grid, 0.5, 21.5);
const T_CAR = up(TF.car, 0.45, 19);
const T_CAR_NEAR = {...up(TF.car, 0.25, 17.6), look: [TF.car.look[0] - 0.6, TF.car.look[1] + 0.25, TF.car.look[2]] as [number, number, number]}; // scene 14: closer, aimed lower so the wheels clear the captions


/** The hatch: its glow groups in video seconds (shifted into each hatch scene). */
const hatchCar = (s: number) => ({
  driving: [
    {at: rel(W.found8 - 0.2, s), speed: 0.3},
    {at: rel(W.run, s), speed: 1.0},
  ],
  madeBy: {
    driveUnit: {at: rel(W.motors, s)},
    inverter: {at: rel(W.electronics, s), pulses: {at: rel(W.electronics + 0.3, s), every: 0.3}},
    panels: {at: rel(W.body, s), stagger: 0.25},
    lamps: {at: rel(W.lights, s)},
    surge: [rel(W.bydS + 0.1, s)],
  },
});

// ------------------------------------------------------------------ U: the US

const U_BASE = {region: 'us', chargers: false} as const;
const GHOST = {at: W.byd13, fadeAt: W.ban + 0.7};
const US_DRIVER = [
  {at: -1, do: 'sit'},
  {at: 82.4, do: 'stand'},
  {at: 82.8, do: 'walkTo', to: 'door'},
  {at: 85.6, do: 'enter'},
] as const;
const usBays = (s: number) => ({
  ...U_BASE,
  bottom: {car: TESLA_CAR, driver: {start: 'curb', keys: shiftKeys(US_DRIVER, s)}},
  ghost: {at: rel(GHOST.at, s), shape: BYD_SHAPE, fadeAt: rel(GHOST.fadeAt, s)},
});

// ------------------------------------------------------------------ overlays

const titleBlock: OverlaySpec = {
  type: 'title',
  at: 0,
  question: 'Why is a BYD so much cheaper than a Tesla?', // D1
  number: 'No. 011',
  title: 'The Lab',
  time: '1:20 PM',
  until: 6.2,
} as OverlaySpec;


/**
 * The car price tags (N9 `pricetag`, style guide v0.14.2 § 6; owner, opening rework; fact-checker PASS wording). Line 1
 * lands on the spoken car name (≥ 1.0 s: no overlay text in the first second), the price and the list-price line join on
 * "half" (the Tesla's 0.6 s earlier), both fade together just before scene 2. Scene 1 only, so the loop scene (no tags)
 * still matches frame 0.
 */
const TAG_CEILING = 474; // ≥ 24 px under the title block's bottom edge
const priceTags: OverlaySpec[] = [
  {
    type: 'pricetag',
    anchor: 'second:top',
    side: 'right',
    rise: 66, // 12 px higher (reviewer): its sub-line clears both roofs; the BYD's block rises with it (72) to keep the 16 px stack
    lines: ['TESLA MODEL 3 RWD', 'FROM ABOUT $35,000', '¥235,500 · CHINA LIST PRICE'],
    color: CHARGE.teslaPaint,
    ceiling: TAG_CEILING,
    at: W.tesla1,
    linesAt: r2(W.half - 0.6),
    until: r2(W.assume - 0.05),
  },
  {
    type: 'pricetag',
    anchor: 'top',
    rise: 72,
    lines: ['BYD SEAL 06 EV', 'FROM ABOUT $16,300', '¥109,900 · CHINA LIST PRICE'],
    color: CHARGE.bydPaint,
    ceiling: TAG_CEILING,
    at: W.byd1,
    linesAt: W.half,
    until: r2(W.assume - 0.05),
  },
] as OverlaySpec[];

/** Bars card (v0.14 § 6 bars mode; fact-checker CONDITIONAL PASS: labels, footnote, values, brackets as required). */
const FOOTNOTE = ['Different BYD models. Cost: 2023 estimate.', 'Price: China list, cheapest trim.'];
const CARD_IN = W.sedan10 - 0.1; // video seconds
const cardT = (t: number) => r2(t - CARD_IN);
const barsCard = (s: number): OverlaySpec =>
  ({
    type: 'chart',
    at: rel(CARD_IN, s),
    until: rel(W.there + 0.4, s),
    carry: true,
    tab: 'COST',
    footnote: FOOTNOTE,
    bars: [
      {
        label: 'TO BUILD · 2023 SEAL',
        refAt: 0,
        value: 0.85,
        valueAt: cardT(W.about10),
        bracket: {label: 'ABOUT 15% LESS', at: cardT(W.percent10), labelAt: cardT(W.less)},
      },
      {
        label: 'TO BUY · 2026 SEAL 06',
        refAt: cardT(W.remaining - 0.3),
        value: 0.47,
        valueAt: cardT(W.price11),
        barLabel: 'ABOUT HALF',
        barLabelAt: cardT(W.halfPrice),
        bracket: {label: 'PART OF THE REST', at: cardT(W.price11 + 0.7), labelAt: cardT(W.range), measured: false},
      },
    ],
  }) as OverlaySpec;


// ------------------------------------------------------------------ the camera on the video clock (ev-charging's pattern)

type V3 = [number, number, number];
type Framing = {look: V3; distance: number};
/**
 * 'lin': a steady push or pull. 'glide': a framing change inside a location (0.6–0.8 s), a cubic Hermite that leaves
 * and lands at the neighbouring segments' speeds, so the camera never stops (style guide § 8 glide; owner: "the camera
 * never fully stops").
 */
type Ease = 'lin' | 'glide';
type PathKey = {t: number; f: Framing; ease?: Ease};
const F = (v: number) => Math.round(v * 30);
const lerpF = (a: Framing, b: Framing, u: number): Framing => ({
  look: a.look.map((x, k) => x + (b.look[k] - x) * u) as V3,
  distance: a.distance + (b.distance - a.distance) * u,
});
/** The velocity (per second) of a linear segment i−1 → i, or zero outside the path / on a glide. */
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
    // Hermite: start at the previous segment's speed, land at the next one's
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
/** A scene's camera keys sampled from a path every 2 frames, so the move runs straight through the cuts. */
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
const at = (f: Framing, distance: number): Framing => ({look: f.look, distance});

/**
 * The runs (push speeds as % of the distance per second, for the stills review): Lab 1 (frame 0 → the teardown) whole
 * 0.22 u/s (≈ 0.7 %), grid 0.25 (≈ 1.2 %), pack 0.11 (≈ 1.3 %); China Tesla pack 0.19 (≈ 0.9 %), BYD pack 0.14 (≈ 1.5 %);
 * Lab hatch 0.28 (≈ 1.5 %), nose 0.24 (≈ 2.4 %), back 0.25 (≈ 1.5 %); Lab card 0.22 (≈ 1.0 %); US twin 0.32 (≈ 0.9 %),
 * ghost 0.21 (≈ 1.0 %); the loop 0.22 (frame 0's speed).
 */
/** The take-A Lab (frame 0 → line 6): the Seal 06 on its stands, the Model 3 beside it on the shop dolly. */
const SECOND_BASE = {car: {shape: 'model3' as const}, mount: 'dolly' as const};
const TFA = teardownFramings({dressing: 'sedan', second: SECOND_BASE});
/** Frame 0 (owner, concept A): both cars whole, the grid empty, aimed higher than `pair` so the roofs sit low enough for the price tags. */
const T_D0 = 39;
const T_FRAME0: Framing = {look: [TFA.pair.look[0] - 0.6, TFA.pair.look[1] + 0.9, TFA.pair.look[2]], distance: T_D0}; // 0.6 m left and a little wider: the Seal's nose ≥ 20 px inside
const T_OPEN: Framing = T_FRAME0;
const T_SPEED = 0.25; // ≈ 0.7 %/s, slow so the roofs stay under the tags
const T_PACK: Framing = {look: TF.pack.look, distance: 9};
/** The Model 3's pack with its tail and the crates behind it in frame (the preset sat on the pack alone). */
const T_SECOND_PACK: Framing = {look: [TFA.secondPack.look[0] + 1.4, TFA.secondPack.look[1], TFA.secondPack.look[2]], distance: TFA.secondPack.distance + 3.5};
const PATH_T1: PathKey[] = [
  {t: -1, f: at(T_FRAME0, T_D0 + T_SPEED)},
  {t: 16.0, f: at(T_FRAME0, T_D0 - T_SPEED * 16.0)},
  // the glide to the grid starts on "apart" (16.28), so the parts are seen landing in it
  {t: 16.8, f: at(T_GRID, 22.4), ease: 'glide'},
  {t: 22.72, f: at(T_GRID, 22.4 - 0.25 * 5.92)},
  {t: 23.52, f: T_PACK, ease: 'glide'},
  {t: 30.88, f: at(T_PACK, 9 - 0.11 * 7.36)},
  // line 6: across to the Model 3's pack, still beside the grid
  {t: 31.68, f: T_SECOND_PACK, ease: 'glide'},
  {t: 39.5, f: at(T_SECOND_PACK, T_SECOND_PACK.distance - 0.12 * 7.82)},
];
/** Line 7, the Lab re-dressed (a slide): both cars whole again, the camera on the Seal's pack and the cabin above it. */
const SECOND_PAIR = {car: {shape: 'model3' as const}, mount: 'dolly' as const};
const TFP = teardownFramings({dressing: 'sedan', second: SECOND_PAIR});
const T_MAIN_PACK: Framing = TFP.mainPack;
const PATH_P: PathKey[] = [
  {t: 37.5, f: at(T_MAIN_PACK, T_MAIN_PACK.distance + 0.12 * 0.7)},
  {t: 47.5, f: at(T_MAIN_PACK, T_MAIN_PACK.distance - 0.12 * 9.3)},
];
const T_NOSE: Framing = TF.nose;
const PATH_T2: PathKey[] = [
  {t: 45.5, f: at(T_CAR, 19 + 0.28 * 0.74)},
  {t: 51.23, f: at(T_CAR, 19 - 0.28 * 4.99)},
  {t: 51.83, f: T_NOSE, ease: 'glide'},
  {t: 53.28, f: at(T_NOSE, TF.nose.distance - 0.24 * 1.45)},
  {t: 53.98, f: T_CAR_NEAR, ease: 'glide'},
  {t: 57.5, f: at(T_CAR_NEAR, 17.6 - 0.25 * 3.52)},
];
const T3_SPEED = 0.22; // ≈ 1.0 %/s at 21–24 (reviewer fix 3: 0.11 read as locked off)
/** The card run: the grid aimed high in the frame so its parts sit low, under the bars card; a push and a slow drift right. */
const PATH_T3: PathKey[] = [
  {t: 55.5, f: {look: [-0.55, 1.0, 1.5], distance: 24.5 + T3_SPEED * 0.98}},
  {t: 80, f: {look: [-0.15, 0.85, 1.5], distance: 24.5 - T3_SPEED * 23.52}},
];
const U_TWIN: Framing = {look: [0.55, 3.0, 0.4], distance: 38};
const U_GHOST: Framing = {look: [0.35, 5.3, 0.3], distance: 21};
const PATH_U: PathKey[] = [
  {t: 77.5, f: at(U_TWIN, 38 + 0.32 * 1.14)},
  {t: 87.92, f: at(U_TWIN, 38 - 0.32 * 9.28)},
  {t: 88.72, f: U_GHOST, ease: 'glide'},
  {t: 93, f: at(U_GHOST, 21 - 0.21 * 4.28)},
];
/** The loop: frame 0's framing and push speed, reached on the last frame. */
const PATH_LOOP: PathKey[] = [
  {t: 90.5, f: at(T_OPEN, T_D0 + T_SPEED * (END - 90.5))},
  {t: END, f: T_OPEN},
  {t: END + 1, f: at(T_OPEN, T_D0 - T_SPEED)},
];

// ------------------------------------------------------------------ scenes

const S = {
  s1: 0,
  s2: W.assume, // scene 1 runs to "assume" so the price tags hold ≥ 2.3 s
  s3: W.subsidies,
  s4: W.so,
  s5: W.about4,
  s6: 22.72,
  s7: 26.08,
  s8: W.teslas,
  s9: W.from,
  s10: W.byd7,
  s11: W.and7,
  s12: W.engineers,
  s13: W.and8,
  s14: W.even9,
  s15: W.evenSo,
  s16: W.only,
  s17: W.part11,
  s18: W.because,
  s19: W.another,
  s20: W.you,
  s21: W.theres,
  s22: W.starting14,
  s23: W.linked,
};

const STARTS = Object.values(S);
/** A scene's end (the next scene's start, or the video's end). */
const endOf = (start: number) => STARTS.find((x) => x > start + 1e-6) ?? END;
const keys = (path: PathKey[], start: number) => ({cameraKeys: camKeys(path, start, endOf(start))});

/** The Model 3 on the dolly in take A (video seconds): it stays beside the grid (it never crosses it) until line 6, when its pack empties and crates refill it. */
const secondA = (s: number) => ({
  ...SECOND_BASE,
  packRewind: {at: rel(TESLA_REWIND, s), for: 0.6},
  bought: {
    route: 'low' as const,
    crates: [
      {in: rel(31.9, s), drops: [rel(W.buys + 0.3, s), rel(W.cells6 + 0.4, s), rel(W.cells6 + 1.0, s)], out: rel(W.panasonic - 0.5, s), slots: [5, 4, 3]},
      {in: rel(W.panasonic - 0.4, s), drops: [rel(W.panasonic + 0.6, s), rel(W.catl, s), rel(W.catl + 0.6, s)], slots: [2, 1, 0]},
    ],
  },
});
/** The mechanic (lines 2–3, the events every 2–3 s): walks to the Model 3's tail, glances at the Seal, goes to the chest, then leans on the Seal. */
const WORKER_KEYS = [
  {at: W.people + 0.2, do: 'walkTo', to: 'port'},
  {at: W.labor - 0.3, do: 'glance', to: 'car', hold: 1.2},
  {at: W.subsidies + 0.1, do: 'walkTo', to: 'cabinet'},
  {at: W.tesla3 + 0.3, do: 'walkTo', to: 'quarter'},
  {at: W.china3 + 0.6, do: 'lean'},
  {at: W.so + 0.8, do: 'walkTo', to: 'curb'},
  {at: W.found + 0.6, do: 'sit'},
] as const;
/** The chest and the stool moved to the room's right (scene-builder's values), so the drawer reads in the `pair` framing. */
const CHEST_AT: [number, number] = [3.7, -0.4];
const STOOL_AT: [number, number] = [4.6, 0.1];
const workerA = (s: number) => ({keys: shiftKeys(WORKER_KEYS, s), stool: STOOL_AT});
/** The drawer opens as he reaches the chest (≈ 11.3 s) and shuts behind him. */
const chestA = (s: number) => ({at: CHEST_AT, open: rel(11.3, s), close: rel(12.6, s)});
/** One take-A scene: the sedan's teardown keys, the Seal's blade pack (as on its later close-up), the Model 3, the mechanic, the chest. */
const takeA = (s: number, extra: Partial<TeardownSliceSceneProps> = {}): Record<string, unknown> => ({
  ...sedanTeardown(s, {...extra, car: {blade: BLADE_FULL, ...(extra.car ?? {})}}),
  second: secondA(s),
  worker: workerA(s),
  chest: chestA(s),
  ...keys(PATH_T1, s),
});
/** Frame 0's Lab state (and the loop's): both cars whole, the grid empty, the mechanic at the chest. */
/**
 * The loop scene's length; take A's keys shifted by it put the loop's last frame on take A's frame 0 (same second car,
 * crates not yet in, the mechanic at the chest, the room the same width).
 */
const LOOP_LEN = r2(END - W.linked);
const LAB_FRAME0: Partial<TeardownSliceSceneProps> = {
  dressing: 'sedan',
  apart: {at: 999},
  scanPx: 5,
  car: {shape: BYD_SHAPE, blade: BLADE_FULL},
  second: secondA(-LOOP_LEN),
  worker: workerA(-LOOP_LEN),
  chest: chestA(-LOOP_LEN),
};

/** Line 7 in the re-dressed Lab (`location: 'teardown-pair'`): both cars whole, the Seal's pack rewinds and its blades grow, then the lid becomes the floor. */
const pairBlades = (s: number, transition: 'slide' | 'continue'): Record<string, unknown> => ({
  dressing: 'sedan',
  location: 'teardown-pair',
  transition,
  apart: {at: 999},
  scanPx: 5,
  second: SECOND_PAIR,
  car: {
    shape: BYD_SHAPE,
    packRewind: {at: rel(BYD_REWIND, s), for: 0.4},
    blade: {
      glow: bladeGlow(s),
      glowR: BLADE_GLOW_R,
      growAt: rel(BYD_GROW, s),
      growFor: 2.4,
      showAt: rel(W.long + 0.3, s),
      backAt: rel(W.blades + 0.2, s),
      floorAt: rel(W.builds, s),
      lidAt: rel(W.pack7, s),
      settleAt: rel(W.floor, s),
    },
  },
  ...keys(PATH_P, s),
});

const scenes: SceneSpec[] = [
  // ---- 1–7 T, take A: frame 0 (both cars), the belief, the rebuttal, the teardown, the battery (one continuous take)
  {scene: 'teardown-slice', cue: 'In China', props: takeA(S.s1), overlays: [titleBlock, ...priceTags]},
  {scene: 'teardown-slice', cue: 'assume it\'s subsidies', props: {...takeA(S.s2), transition: 'continue'}},
  {scene: 'teardown-slice', cue: 'Subsidies do help', props: {...takeA(S.s3), transition: 'continue'}},
  {scene: 'teardown-slice', cue: 'So analysts took', props: {...takeA(S.s4), transition: 'continue'}},
  {
    scene: 'teardown-slice',
    cue: 'about three quarters',
    props: {...takeA(S.s5, {surge: [{at: rel(W.starting, S.s5), groups: ['pack']}], lift: [{at: rel(W.battery4, S.s5)}]}), transition: 'continue'},
  },
  {
    scene: 'teardown-slice',
    cue: 'The battery is',
    props: {...takeA(S.s6, {focus: [{at: rel(W.battery5, S.s6), groups: ['pack']}], lift: [{at: rel(W.part5, S.s6)}]}), transition: 'continue'},
  },
  {
    scene: 'teardown-slice',
    cue: 'and industry estimates',
    props: {
      ...takeA(S.s7, {
        focus: [{at: rel(W.battery5, S.s7), groups: ['pack']}],
        surge: [
          {at: rel(W.thirty, S.s7), groups: ['pack']},
          {at: rel(W.cost5, S.s7), groups: ['pack']},
        ],
      }),
      transition: 'continue',
    },
    overlays: [
      {
        type: 'counter',
        from: 0,
        to: 30,
        rangeTo: 40,
        label: '%',
        sub: "Of an EV's cost",
        x: 0.111,
        y: 0.156,
        at: rel(W.industry - 0.1, S.s7),
        duration: r2(W.thirty - W.industry + 0.1),
        rangeAt: r2(W.forty - W.industry + 0.1),
        until: rel(W.teslas - 0.3, S.s7),
      } as OverlaySpec,
    ],
  },

  // ---- 8–9 T, take A: the Model 3's pack empties and crates refill it (still beside the grid)
  {
    scene: 'teardown-slice',
    cue: "Tesla's annual report",
    props: {...takeA(S.s8), transition: 'continue'},
    overlays: [
      {type: 'callout', anchor: 'crate', title: 'CELLS', sub: 'Bought in', subInk: 'ink', size: 1.4, place: 'above', dy: -340, at: rel(W.cells6, S.s8), until: rel(W.from - 0.05, S.s8)} as OverlaySpec,
    ],
  },
  {scene: 'teardown-slice', cue: 'from suppliers like', props: {...takeA(S.s9), transition: 'continue'}},

  // ---- 10–11 T, the Lab re-dressed (a slide): both cars whole; the Seal's blades grow, the pack becomes the floor
  {
    scene: 'teardown-slice',
    cue: 'BYD makes its own cells',
    props: pairBlades(S.s10, 'slide'),
    overlays: [
      {type: 'callout', anchor: 'blade', title: 'BLADE CELLS', sub: 'Made by BYD', subInk: 'ink', size: 1.3, dx: 220, dy: 15, at: rel(W.long + 0.5, S.s10), until: rel(W.and7 - 0.05, S.s10)} as OverlaySpec,
    ],
  },
  {scene: 'teardown-slice', cue: 'and builds the battery', props: pairBlades(S.s11, 'continue')},

  // ---- 12–14 T: the smaller BYD (hatch): motors, electronics, panels, lights
  {
    scene: 'teardown-slice',
    cue: 'Engineers who took',
    props: {transition: 'slide', dressing: 'hatch', scanPx: 5, ...keys(PATH_T2, S.s12), scan: [{at: rel(W.took8, S.s12), along: 'car'}], car: hatchCar(S.s12)},
    overlays: [
      {type: 'tag', who: 'you', anchor: 'roof', label: 'BYD', color: RACE.evPaint, outline: 'ink', side: 'left', at: 0.5, until: rel(W.found8, S.s12)} as OverlaySpec,
    ],
  },
  {
    scene: 'teardown-slice',
    cue: 'and the electronics',
    props: {dressing: 'hatch', transition: 'continue', ...keys(PATH_T2, S.s13), car: hatchCar(S.s13)},
  },
  {
    scene: 'teardown-slice',
    cue: 'Even the body',
    props: {dressing: 'hatch', transition: 'continue', ...keys(PATH_T2, S.s14), car: hatchCar(S.s14)},
  },

  // ---- 15–19 T: back to the sedan's grid (its trace); the bars card over lines 10–12
  {
    scene: 'teardown-slice',
    cue: 'Even so',
    props: {
      ...sedanTeardown(S.s15, {
        surge: [{at: rel(W.analysts10, S.s15)}],
        car: {madeBy: {panels: {at: rel(W.sedan10, S.s15), stagger: 0}}},
      }),
      transition: 'slide',
      ...keys(PATH_T3, S.s15),
    },
    overlays: [barsCard(S.s15)],
  },
  {
    scene: 'teardown-slice',
    cue: 'only about 15',
    props: {
      ...sedanTeardown(S.s16, {
        surge: [{at: rel(W.model10, S.s16)}],
        car: {madeBy: {panels: {at: rel(W.sedan10, S.s16), stagger: 0}}},
      }),
      transition: 'continue',
      ...keys(PATH_T3, S.s16),
    },
  },
  {
    scene: 'teardown-slice',
    cue: 'Part of the remaining',
    props: {
      ...sedanTeardown(S.s17, {
        surge: [{at: rel(W.range, S.s17), groups: ['body', 'lamps']}],
        car: {madeBy: {panels: {at: rel(W.sedan10, S.s17), stagger: 0}}},
      }),
      transition: 'continue',
      ...keys(PATH_T3, S.s17),
    },
  },
  {
    scene: 'teardown-slice',
    cue: 'because the half-price',
    props: {
      ...sedanTeardown(S.s18, {
        lift: [{at: rel(W.halfPrice + 0.3, S.s18)}],
        surge: [{at: rel(W.charge11, S.s18), groups: ['pack']}],
        car: {madeBy: {panels: {at: rel(W.sedan10, S.s18), stagger: 0}}},
      }),
      transition: 'continue',
      ...keys(PATH_T3, S.s18),
    },
  },
  {
    scene: 'teardown-slice',
    cue: 'Another part is',
    props: {
      ...sedanTeardown(S.s19, {
        lift: [{at: rel(W.another - 0.1, S.s19)}],
        surge: [
          {at: rel(W.another, S.s19), groups: ['pack']},
          {at: rel(W.priceWar, S.s19)},
          {at: rel(W.cutting, S.s19), groups: ['drive', 'electronics']},
        ],
        car: {madeBy: {panels: {at: rel(W.sedan10, S.s19), stagger: 0}, surge: [rel(W.byd12, S.s19)]}},
      }),
      transition: 'continue',
      ...keys(PATH_T3, S.s19),
    },
  },

  // ---- 20–22 U: you won't see those prices; the tariff; the software ban
  {
    scene: 'charge-slice',
    cue: "You won't see",
    props: {...usBays(S.s20), transition: 'slide', ...keys(PATH_U, S.s20)},
    overlays: [
      {type: 'place', text: 'The US', left: 120, top: 300, size: 30, rule: true, at: rel(W.us - 0.15, S.s20), until: rel(W.byd13 + 0.3, S.s20)} as OverlaySpec,
    ],
  },
  {
    scene: 'charge-slice',
    cue: "There's a 100",
    props: {...usBays(S.s21), transition: 'continue', ...keys(PATH_U, S.s21)},
    overlays: [
      {
        type: 'counter',
        from: 0,
        to: 100,
        label: '%',
        sub: 'Tariff',
        x: 0.111,
        y: 0.156,
        at: 0.1,
        duration: r2(W.hundred - W.theres + 0.2),
        until: rel(W.starting14 - 0.3, S.s21),
      } as OverlaySpec,
    ],
  },
  {
    scene: 'charge-slice',
    cue: 'starting with 2027',
    props: {...usBays(S.s22), transition: 'continue', ...keys(PATH_U, S.s22)},
    overlays: [
      {
        type: 'callout',
        title: 'Software ban',
        sub: 'From 2027 models',
        size: 1.2,
        anchor: 'ghost',
        place: 'above',
        dy: -150,
        at: 0.6,
        until: rel(W.ban + 0.6, S.s22),
      } as OverlaySpec,
    ],
  },

  // ---- 23 T: the loop, back to frame 0's Lab (the Seal whole on the stands, the grid empty, pushing in)
  {
    scene: 'teardown-slice',
    cue: 'linked to China',
    props: {...LAB_FRAME0, transition: 'slide', ...keys(PATH_LOOP, S.s23)},
  },
];

/** The cover's props: frame 0's Lab state, the camera held on `cover.camera`. */
const COVER_PROPS = {...LAB_FRAME0};


// ------------------------------------------------------------------ sound effects (av-script "Sound effects plan"; No. 010's pattern)

/**
 * volume = (voice −22.1 − dB under) − the file's measured LUFS. Two exceptions, set by ear: `lid-clack` and
 * `seat-settle` are 0.34 s, too short for an integrated reading (peaks −3.8 / −14.7 dBTP). `drawer` measures −48.2
 * integrated because most of it is the pause, so it takes +9.1 dB (Remotion amplifies through a gain node; peak
 * −30.5 dBTP + 9.1 stays far under clipping).
 */
const SFX = {
  steps: {file: 'steps', volume: -18.6, len: 3.0}, // −22.5, 19 under
  drawer: {file: 'drawer', volume: 9.1, len: 1.8}, // −48.2 (mostly silence), 17 under
  partsLand: {file: 'parts-land', volume: -13.6, len: 2.0}, // −23.5, 15 under
  crateSlide: {file: 'crate-slide', volume: -21.8, len: 0.9}, // −17.3, 17 under
  lidClack: {file: 'lid-clack', volume: -20, len: 0.34}, // by ear (peak −3.8 dBTP)
  moduleSeat: {file: 'module-seat', volume: -8.6, len: 0.4}, // −31.5, 18 under
  bladeSlide: {file: 'blade-slide', volume: -18.3, len: 0.8}, // −20.8, 17 under
  lidSeat: {file: 'lid-seat', volume: -8.5, len: 0.7}, // −29.6, 16 under
  seatSettle: {file: 'seat-settle', volume: -10, len: 0.34}, // by ear (peak −14.7 dBTP)
} as const;
type SfxKey = keyof typeof SFX;
/** [video time, sound, end (video time; default the file's length)]. Nothing during the bars card (58.66 → 77.28) or in the US part. */
const SFX_EVENTS: [number, SfxKey, number?][] = [
  [6.6, 'steps', 8.2],
  [9.8, 'steps', 11.2],
  [11.3, 'drawer'],
  [11.9, 'steps', 13.4],
  [15.1, 'steps', 16.0],
  [16.85, 'partsLand'],
  [31.9, 'crateSlide'],
  [32.7, 'lidClack'],
  [34.1, 'moduleSeat'],
  [34.8, 'moduleSeat'],
  [35.2, 'crateSlide'],
  [35.4, 'moduleSeat'],
  [36.08, 'lidClack'],
  [37.4, 'moduleSeat'],
  [37.8, 'moduleSeat'],
  // the last module seats ≈ 38.4, after the slide to the re-dressed Lab (38.2): no sound for it
  [40.9, 'bladeSlide'],
  [42.36, 'bladeSlide'],
  [44.45, 'lidSeat'],
  [45.15, 'seatSettle'],
];
/**
 * The sound overlays inside one scene [a, b): a sound that crosses a cut is split, the later piece starting at the cut
 * with `trim` = the time already played, so it runs on seamlessly (an sfx's `until` can't pass its scene's cut).
 */
const sfxIn = (a: number, b: number): OverlaySpec[] =>
  SFX_EVENTS.flatMap(([t0, k, t1]) => {
    const sd = SFX[k];
    const end = t1 ?? t0 + sd.len;
    if (end <= a || t0 >= b) return [];
    const start = Math.max(t0, a);
    const split = t0 < a || end > b;
    return [
      {
        type: 'sfx',
        name: sd.file,
        volume: sd.volume,
        at: rel(start, a),
        ...(t0 < a ? {trim: r2(a - t0)} : {}),
        ...(t1 !== undefined && end <= b ? {until: rel(end, a)} : {}),
        ...(k === 'steps' && !split ? {fade: 0.15} : {}),
      } as OverlaySpec,
    ];
  });

/** Music bed (take a, 95 s, −16.3 LUFS; voice −22.1): from frame 0, ≈ 12 dB under the voice, no duck. The file runs past the 94.14 s timeline, so a 1 s fade-out ends it silent on the last frame. */
const MUSIC = {level: -17.8, duckDb: 0, startAt: 0, fadeIn: 1.5, fadeOut: 1} as const;

// every scene takes the sounds that fall inside it (scenes are listed in the order of S)
scenes.forEach((sc, i) => {
  const extra = sfxIn(STARTS[i], endOf(STARTS[i]));
  if (extra.length) sc.overlays = [...(sc.overlays ?? []), ...extra];
});

export const spec: VideoSpec = {
  // Cover still (`yarn cover byd-price`): frame 0's Lab, the Seal 06 on its stands and the Model 3 on the dolly, the
  // camera aimed higher so the room sits low, clear of the text.
  // Alternate text (publisher): 'Half the price?\nIn China'.
  cover: {
    text: 'BYD vs Tesla\nWhy so cheap?',
    size: 140,
    scene: 'teardown-slice',
    camera: up(TFA.pair, 2.4, 40),
    at: 0,
    props: COVER_PROPS,
  },
  tail: TAIL,
  music: MUSIC,
  scenes,
};
