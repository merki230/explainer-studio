import {random} from 'remotion';
import type {SignalState} from '../three/section/CitySlice';
import {ease} from './keyframes';

/*
 * No. 019 (`light-countdown`, N3, N6, N7): the pure timing model behind the `city-slice` countdown corner, shared by the
 * scene and the detail box so the pole, the phone and the tape always read the same second.
 *  - `countdownAt`: the pole box's number from the signal keys.
 *  - `tapeClock` / `tapeEvents`: the time tape's story clock (video time + earlier time-lapses + this scene's), its scale,
 *    the bunches of starts and the prediction.
 * Times are seconds into the scene unless named "story" (video seconds plus skipped time).
 */

export type SignalKeys = SignalState | {at: number; state: SignalState}[];

const sortedKeys = (s: SignalKeys | undefined) =>
  typeof s === 'string' || s === undefined ? [{at: -Infinity, state: (s ?? 'red') as SignalState}] : [...s].sort((a, b) => a.at - b.at);

/** The signal's state at t (as `citySignalAt`). */
export const signalStateAt = (s: SignalKeys | undefined, t: number): SignalState => {
  const ks = sortedKeys(s);
  let cur: SignalState = ks[0]?.state ?? 'red';
  for (const k of ks) if (t >= k.at) cur = k.state;
  return cur;
};

/**
 * N3: the countdown box's number at t: `ceil(next change − t)` while red or green (the next key whose state differs
 * from the current one; keys may sit past the scene's end), shifted by `offset` s; null while yellow or off, or when no
 * change is keyed. Capped at 99 (two digits).
 */
export const countdownAt = (s: SignalKeys | undefined, t: number, offset = 0): {state: SignalState; n: number | null} => {
  const state = signalStateAt(s, t);
  if (state !== 'red' && state !== 'green') return {state, n: null};
  const next = sortedKeys(s).find((k) => k.at > t + 1e-9 && k.state !== state);
  if (!next) return {state, n: null};
  const n = Math.ceil(next.at - t - offset - 1e-6);
  return {state, n: Math.max(0, Math.min(99, n))};
};

// ---------------------------------------------------------------- the time tape (N6)

export type CityTapeTimelapse = {
  /** The scroll speeds up from `at` and is back to real time by `until` (s), each ramp cubic over `ramp` s (default 0.8). */
  at: number;
  until: number;
  /** The story seconds per real second at the peak (default 100: a 64 s cycle passes in ≈ 0.6 s). */
  rate?: number;
  /** The tape's scale after the squeeze, m per story second (default: 5 cycles fit behind the cursor). */
  scale?: number;
  ramp?: number;
};

/**
 * The time tape (style guide § 5 "The time tape", v0.18.16): a free-floating orange line in the air over the street,
 * parallel to the lanes (nothing of it runs through the ground or the cut face), time running up the street past a fixed
 * ink cursor; the app cars' starts land as node dots, bunches repeat one cycle apart,
 * ink brackets measure the gap, an orange marker and gap bar show the predicted next green. Keys in scene seconds.
 */
export type CityTape = {
  /**
   * The band's ends as metres up the street from the plane (x, default [20, 32], over the queue's front), its height above
   * the pavement (y, default 4.5; the guide's range 4.0–5.0) and its line across the street (`across`, default 6.6, over
   * the lane 2–3 line). Time runs up the street (later = further up). The ends fade over 0.3 m, no caps.
   */
  x?: [number, number];
  y?: number;
  across?: number;
  /** The "now" cursor's place along the band, 0 (left) → 1 (default 0.65). */
  cursor?: number;
  /** The line draws on along its length over 0.6 s from `drawAt` (default: drawn from the scene's start). */
  drawAt?: number;
  /**
   * Metres per story second at the scene's start (default 0.3, so starts 0.3 s apart sit apart at `tape`), or 'squeezed'
   * (the time-lapse's default end scale: 5 cycles behind the cursor), for the scenes after a time-lapse.
   */
  scale?: number | 'squeezed';
  /** Story seconds an earlier scene's time-lapse skipped (`tapeSkip(timelapse)`); default 0. */
  skip?: number;
  /** This scene's time-lapse (see `CityTapeTimelapse`). */
  timelapse?: CityTapeTimelapse;
  /** Story seconds between bunch fronts: the light's cycle (default 64, 🎭). */
  cycle?: number;
  /**
   * Bunch 0's front in story seconds (video seconds). Default: the earliest `goAt` of the scene's `app` cars (in video
   * time), else 0. Bunches k = 1, 2, … follow one `cycle` apart and land at the cursor as story time passes them.
   */
  front?: number;
  /** Bunch 0's starts, seconds after its front (default: the `app` cars' `goAt` offsets, else seeded). */
  first?: number[];
  /** Bunch 0 lands now: each start drops onto the tape staggered (`stagger` s, default 0.25). Without it, it's already there. */
  report?: {at: number; stagger?: number};
  /** How many bunches (k ≥ 1) may follow bunch 0 (default 5). */
  bunches?: number;
  /** Ink brackets between neighbouring bunch fronts draw on one after another, `every` s apart (default 0.2); `pulseAt` thickens them once. */
  brackets?: {at: number; every?: number; pulseAt?: number[]};
  /** The last bracket's copy slides forward ahead of the cursor (0.4 s) and the orange marker lands at its far end. */
  predict?: {at: number};
  /** The orange gap bar from the cursor to the marker, shrinking as the tape scrolls (from `at`, until `until`). */
  gapBar?: {at: number; until?: number};
  /** Everything on the tape fades out over 0.6 s. */
  fadeAt?: number;
};

const RAMP = 0.8;
const STEP = 1 / 240;

/** The time-lapse's rate (story s per real s) at t. */
const rateAt = (tl: CityTapeTimelapse | undefined, t: number) => {
  if (!tl) return 1;
  const R = tl.rate ?? 100;
  const r = tl.ramp ?? RAMP;
  const up = ease(t, tl.at, tl.at + r);
  const down = ease(t, tl.until - r, tl.until);
  return 1 + (R - 1) * up * (1 - down);
};

/** ∫ (rate − 1) dt from 0 to t: the story seconds the time-lapse has added (fixed step, deterministic). */
const gainAt = (tl: CityTapeTimelapse | undefined, t: number) => {
  if (!tl || t <= tl.at) return 0;
  const end = Math.min(t, tl.until);
  let a = 0;
  for (let x = tl.at; x < end; x += STEP) a += (rateAt(tl, x + STEP / 2) - 1) * Math.min(STEP, end - x);
  return a;
};

/** The story seconds a whole time-lapse adds (pass it as a later scene's `skip`). */
export const tapeSkip = (tl: CityTapeTimelapse) => gainAt(tl, tl.until + 1);

export type TapeCar = {app?: boolean; goAt?: number};

/** The tape's defaults resolved for a scene. */
export const tapeSetup = (tape: CityTape, cars: TapeCar[], sceneStart: number) => {
  const air = true;
  const x = tape.x ?? [20, 32];
  const len = x[1] - x[0];
  const cursorK = tape.cursor ?? 0.65;
  const cycle = tape.cycle ?? 64;
  const starts = cars.filter((c) => c.app && c.goAt !== undefined).map((c) => sceneStart + (c.goAt as number));
  const front = tape.front ?? (starts.length ? Math.min(...starts) : 0);
  const first =
    tape.first ?? (starts.length ? starts.map((s) => s - Math.min(...starts)).sort((a, b) => a - b) : [0, 0.5, 1.0, 1.6]);
  const behind = len * cursorK;
  const squeezed = tape.timelapse?.scale ?? behind / 5.5 / cycle;
  const scale0 = tape.scale === 'squeezed' ? behind / 5.5 / cycle : (tape.scale ?? 0.3);
  return {air, across: tape.across ?? 6.6, x, y: tape.y ?? 4.5, len, cursorX: x[0] + len * cursorK, cycle, front, first, scale0, squeezed};
};

/**
 * The story clock and scale at t: story = video time + skip + this scene's time-lapse gain. During a time-lapse the tape's
 * visible history (the story seconds behind the cursor, `behind / scale`) grows with the gain, from `behind / scale0` to
 * `behind / squeezed`, a little faster than the starts age, so nothing already on the tape runs off its left end.
 */
export const tapeClock = (tape: CityTape, sceneStart: number, t: number, scale0 = 0.3) => {
  const tl = tape.timelapse;
  const gain = gainAt(tl, t);
  const story = sceneStart + t + (tape.skip ?? 0) + gain;
  const G = tl ? tapeSkip(tl) : 0;
  return {
    story,
    rate: rateAt(tl, t),
    scaleOf: (squeezed: number, behind: number) => {
      if (!tl || G <= 0) return scale0;
      const w0 = behind / scale0;
      const w1 = behind / squeezed;
      return behind / (w0 + (w1 - w0) * Math.min(1, gain / G));
    },
  };
};

/** Seeded offsets (s after the front) for synthetic bunch k: 3 to 6 starts over ≈ 2.5 s, the first at 0. */
const bunchOffsets = (k: number) => {
  const n = 3 + Math.floor(random(`tape-n-${k}`) * 4);
  const out = [0];
  let at = 0;
  for (let i = 1; i < n; i++) {
    at += 0.3 + random(`tape-d-${k}-${i}`) * 0.5;
    out.push(at);
  }
  return out;
};

/** How long a reported start's dot takes to rise from its car to the tape (s; cubic in-out, no overshoot). */
export const TAPE_RISE = 0.6;

export type TapeDot = {x: number; drop: number; bunch: number; glow: number; pulse?: number};

/**
 * Everything on the tape at t, in metres along the band (x on the cut face): the dots (with their landing drop 0 → 1),
 * the bunch fronts on the tape, the brackets (drawn share), the prediction (copy slide, marker landing) and the gap bar.
 */
export const tapeAt = (tape: CityTape, cars: TapeCar[], sceneStart: number, t: number) => {
  const s = tapeSetup(tape, cars, sceneStart);
  const clk = tapeClock(tape, sceneStart, t, s.scale0);
  const scale = clk.scaleOf(s.squeezed, s.cursorX - s.x[0]);
  const xOf = (storyT: number) => s.cursorX - (clk.story - storyT) * scale;
  const fade = tape.fadeAt === undefined ? 1 : 1 - ease(t, tape.fadeAt, tape.fadeAt + 0.6);
  const draw = tape.drawAt === undefined ? 1 : ease(t, tape.drawAt, tape.drawAt + 0.6);
  const dots: TapeDot[] = [];
  // the reported starts on their way up from their cars (i: the start's rank in bunch 0, u: 0 → 1 of the rise, trail:
  // the trail's strength, fading over 0.4 s after the landing)
  const rising: {i: number; x: number; u: number; trail: number}[] = [];
  const fronts: {k: number; x: number}[] = [];
  const nB = tape.bunches ?? 5;
  // the drop of a synthetic start: over 0.15 story-independent seconds of real time after it reaches the cursor
  for (let k = 0; k <= nB; k++) {
    const f = s.front + k * s.cycle;
    const offs = k === 0 ? s.first : bunchOffsets(k);
    let any = false;
    offs.forEach((o, i) => {
      const at = f + o;
      let drop: number;
      let landPulse = 0;
      if (k === 0 && tape.report && s.air) {
        const st0 = tape.report.at + i * (tape.report.stagger ?? 0.25);
        if (t >= st0 && t < st0 + TAPE_RISE + 0.4)
          rising.push({
            i,
            x: xOf(at),
            u: Math.min(1, (t - st0) / TAPE_RISE),
            trail: t < st0 + TAPE_RISE ? 1 : 1 - (t - st0 - TAPE_RISE) / 0.4,
          });
      }
      if (k === 0 && tape.report) {
        // a reported start: in the air, its dot first rises from its car (`TAPE_RISE` s) and lands at its own time
        const st = tape.report.at + i * (tape.report.stagger ?? 0.25) + (s.air ? TAPE_RISE : 0);
        drop = t >= st ? 1 : 0;
        // one landing pulse: r × 1.3 over 0.3 s
        landPulse = t >= st && t <= st + 0.3 ? Math.sin((Math.PI * (t - st)) / 0.3) : 0;
      } else {
        if (clk.story < at) return;
        drop = Math.min(1, (clk.story - at) / (0.15 * Math.max(1, clk.rate)));
      }
      if (drop <= 0) return;
      const x = xOf(at);
      if (x < s.x[0] - 0.05 || x > s.cursorX + 1e-6) return;
      any = true;
      dots.push({x, drop, bunch: k, glow: fade, pulse: landPulse});
    });
    if (any || (k === 0 && clk.story >= f && xOf(f) >= s.x[0])) {
      const visibleFront = k > 0 ? clk.story >= f : dots.some((d) => d.bunch === 0);
      if (visibleFront && xOf(f) >= s.x[0]) fronts.push({k, x: xOf(f)});
    }
  }
  // brackets between neighbouring fronts, oldest first
  const br = tape.brackets;
  const brackets = br
    ? fronts.slice(1).map((q, i) => ({
        a: fronts[i].x,
        b: q.x,
        draw: ease(t, br.at + i * (br.every ?? 0.2), br.at + i * (br.every ?? 0.2) + 0.25),
        pulse: (br.pulseAt ?? []).reduce((m, p) => (t >= p && t <= p + 0.5 ? Math.max(m, Math.sin((Math.PI * (t - p)) / 0.5)) : m), 0),
      }))
    : [];
  // the prediction: one gap after the last front
  const last = fronts[fronts.length - 1];
  const pr = tape.predict;
  let predict: {from: number; to: number; slide: number; marker: number; x: number} | null = null;
  if (pr && last) {
    const storyNext = s.front + last.k * s.cycle + s.cycle;
    const slide = ease(t, pr.at, pr.at + 0.4);
    predict = {from: last.x, to: xOf(storyNext), slide, marker: ease(t, pr.at + 0.3, pr.at + 0.6), x: xOf(storyNext)};
  }
  const gb = tape.gapBar;
  const gap =
    gb && predict && t >= gb.at && (gb.until === undefined || t < gb.until) && predict.x > s.cursorX
      ? {a: s.cursorX, b: predict.x, glow: ease(t, gb.at, gb.at + 0.3) * (gb.until === undefined ? 1 : 1 - ease(t, gb.until - 0.3, gb.until))}
      : null;
  return {...s, scale, story: clk.story, fade, draw, dots, rising, fronts, brackets, predict, gap};
};
