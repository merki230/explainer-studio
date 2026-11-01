/* eslint-disable @remotion/non-pure-animation -- false positive: `transition` keys in scene props are data, not CSS transitions */
import type {OverlaySpec, SceneSpec, VideoSpec} from '../../types';
import {carCameraStart} from '../../scenes/CarSliceScene';
import {reportFramings} from '../../scenes/ReportSliceScene';
import {speedAt, type SpeedKey} from '../../scenes/keyframes';
import {CAR_LAYOUT} from '../../three/real/RealCar';
import transcript from './transcript.json';

/**
 * No. 012 · How does the phone on your dash know? (`av-script.md` draft 2; word times read from `transcript.json`).
 *
 * Locations: A `car-slice` (the drive home: YOU's cut-open gas sedan facing left on the city road, the phone on a dash
 * mount, Day, 5:40 PM) · R `report-slice` (the data chain: the second car, the report company, the insurer).
 * A → R → A (two slides); everything else is `continue`, the camera on one path per run (byd-price's pattern).
 * Orange = what the phone senses and logs (its dot, the feel arrow, the pins, the app's pins and bars), then the data
 * leaving the second car (faded on "GM settled").
 *
 * Every beat is keyed to a word time in `W` (video seconds) and shifted into scene time with `rel()`. After a re-record,
 * update `W` (and `END`) only: scenes start on cues, and the drive, the signals, the camera and the overlays follow.
 */

/**
 * Word times (video seconds), read from `transcript.json`: each entry names a phrase, found in order (a cursor moves
 * on, so a repeated word resolves to the right line). Keys ending in `End` take the phrase's last word's end. After a
 * re-record or a script edit only this list may need a new phrase; nothing else holds a time.
 */
const WORDS = (transcript as {words: {text: string; start: number; end: number}[]}).words;
const norm = (x: string) => x.toLowerCase().replace(/[^a-z0-9']/g, '');
const PHRASES: [string, string][] = [
  // 1–2 hook, question
  ['app1', 'insurance app'],
  ['and1', "and it doesn't"],
  ['need', 'need your car'],
  ['car1', 'car to do'],
  ['how', 'how does the'],
  ['dash', 'dash know'],
  ['knowEnd', 'know'],
  // 3 sensors and GPS
  ['it3', 'it has its'],
  ['motion', 'motion sensors'],
  ['gps', 'gps'],
  ['so3', 'so it feels'],
  ['every', 'every stop'],
  ['mile', 'every mile'],
  // 4 the trip starts on its own
  ['youre', 'you start driving'],
  ['start', 'start driving'],
  ['notices4', 'the app notices'],
  ['trip4', 'trip has started'],
  ['tapping', 'tapping anything'],
  // 5 time of day
  ['some', 'some programs'],
  ['timeOfDay', 'time of day'],
  ['five40', '5:40'],
  // 6–8 the red light, the threshold, a normal stop
  ['atRed', 'at a red'],
  ['red', 'red light'],
  ['you5', 'you slow'],
  ['slow', 'slow down'],
  ['always', 'always do'],
  ['many', 'many programs'],
  ['hard6', 'hard braking'],
  ['loses', 'loses'],
  ['six', '6'],
  ['eight', '8'],
  ['second', 'second'],
  ['so', 'so a normal'],
  ['normal', 'normal stop'],
  ['yours', 'yours'],
  ['count', 'count'],
  ['consumer', 'consumer reports'],
  ['y2021', '2021'],
  // 9–10 green, the pickup, distraction
  ['when8', 'when the light'],
  ['green', 'green'],
  ['notices', 'notices if'],
  ['pick', 'pick it up'],
  ['moving8', 'moving'],
  ['one9', "one insurer's"],
  ['distraction', 'distraction'],
  ['when9', 'when the phone'],
  ['moving9', 'moving'],
  ['screen', 'screen is on'],
  ['onEnd', 'on'],
  // 11 speeding
  ['same', "the same insurer's"],
  ['flags', 'flags'],
  ['over', 'over the speed'],
  ['eight11', '8'],
  ['more', 'or more'],
  // 12–13 recorded, scores, price
  ['each', 'each trip'],
  ['recorded', 'recorded'],
  ['turns10', 'turns it'],
  ['scores10', 'scores'],
  ['those', 'those scores'],
  ['price', 'price'],
  ['either', 'either way'],
  ['way', 'way'],
  // 14 the numbers
  ['one12', 'one insurer says'],
  ['save', 'save up'],
  ['thirty', '30'],
  ['but', 'but another'],
  ['about', 'about 2'],
  ['two', '2'],
  ['rate', 'rate go up'],
  ['upEnd', 'up'],
  // 15–18 the data chain
  ['and13', 'and some drivers'],
  ['never', 'never installed'],
  ['app13', 'app at all'],
  ['the14', 'the ftc'],
  ['alleged', 'alleged'],
  ['collected', 'collected'],
  ['braking14', 'braking and speeding'],
  ['speeding', 'speeding'],
  ['straight', 'straight from'],
  ['connected', 'connected cars'],
  ['agency', 'the agency'],
  ['sold', 'sold'],
  ['companies15', 'companies that make'],
  ['reports15', 'reports for'],
  ['insurers15', 'insurers'],
  ['who', 'who then used'],
  ['used', 'used'],
  ['set', 'set rates'],
  ['gm16', 'gm settled'],
  ['settled', 'settled'],
  ['still', 'still advertises'],
  ['advertises', 'advertises'],
  ['carmakers', 'carmakers'],
  ['to16', 'to insurers'],
  ['insurersEnd', 'insurers'],
];
const W = (() => {
  const out: Record<string, number> = {};
  let i = 0;
  for (const [key, phrase] of PHRASES) {
    const ws = phrase.split(' ').map(norm);
    let j = i;
    while (j < WORDS.length && !ws.every((x, k) => norm(WORDS[j + k]?.text ?? '') === x)) j++;
    if (j >= WORDS.length) throw new Error(`insurance-app spec: phrase not found in transcript: "${phrase}" (${key})`);
    out[key] = key.endsWith('End') ? WORDS[j + ws.length - 1].end : WORDS[j].start;
    i = key.endsWith('End') ? j + ws.length : j;
  }
  // an optional closing line after the data chain (owner, 2026-10-30): the loop scene starts on it when it exists
  const after = WORDS.slice(i).filter((x) => norm(x.text) !== '');
  out.closing = after.length ? after[0].start : NaN;
  out.end = WORDS[WORDS.length - 1].end;
  return out as Record<(typeof PHRASES)[number][0] | 'closing' | 'end', number>;
})();
const TAIL = 1.5;
const END = W.end + TAIL;

const r2 = (x: number) => Math.round(x * 100) / 100;
/** A video time → seconds into the scene that starts at `s`. */
const rel = (t: number, s: number) => r2(t - s);
const shift = <T extends {at: number}>(keys: readonly T[], s: number): T[] => keys.map((k) => ({...k, at: rel(k.at, s)}));

// ------------------------------------------------------------------ scene starts

const S = {
  s1: 0,
  s2: W.and1,
  s3: W.how,
  s4: W.it3,
  s5: W.so3,
  s6: W.youre,
  s7: W.some,
  s8: W.atRed,
  s9: W.many,
  s10: W.so,
  s11: W.when8,
  s12: W.one9,
  s13: W.same,
  s14: W.each, // lines 12–13 are one scene: one detail box turns trip → scores → price (an anchored box can't carry)
  s15: W.one12,
  s16: W.but,
  s17: W.and13,
  s18: W.the14,
  s19: W.braking14,
  s20: W.agency,
  s21: W.who,
  s22: W.gm16,
  s23: W.still,
  // the loop: the closing line if there is one, else the data chain's last words
  s24: Number.isNaN(W.closing) ? W.to16 : W.closing,
};
const STARTS = Object.values(S);
const endOf = (start: number) => STARTS.find((x) => x > start + 1e-6) ?? END;
/** The loop scene's length: the drive's keys shifted by it put its last frame on frame 0. */
const LOOP_LEN = r2(END - S.s24);

// ------------------------------------------------------------------ A: the drive (video seconds)

/** The phone's stop at a red light: frame 0's hard stop (rests ≈ 1.1), the story's gentle stop (rests ≈ 25.6). */
/** The gentle stop's key spacing: eleven steps from "slow down" so the last ramp (0.8 s) ends on "yours". */
const STOP_STEP = (W.yours - 0.8 - (W.slow + 0.3)) / 11;
const DRIVE: SpeedKey[] = [
  {at: -20, speed: 3.2},
  // frame 0: braking hard for the first red light; it waits there through lines 1–3
  {at: -0.5, speed: 1.4},
  {at: 0.3, speed: 0},
  // "You start driving home": green, away (the app notices the trip on its own)
  {at: W.start + 0.3, speed: 1.8},
  {at: W.start + 1.1, speed: 3.4},
  {at: W.start + 1.9, speed: 3.6},
  // "At a red light, you slow down the way you always do": a long gentle stop, firmest at the end, resting on "yours"
  ...[3.4, 3.1, 2.8, 2.5, 2.2, 1.9, 1.6, 1.35, 1.1, 0.8, 0.4].map((speed, k) => ({at: r2(W.slow + 0.3 + STOP_STEP * k), speed})),
  {at: r2(W.yours - 0.8), speed: 0},
  // green: away, slower while YOU holds the phone and the signs pass (each ≈ 0.6 s in the `call` band)
  {at: W.green + 0.15, speed: 1.8},
  {at: W.green + 0.95, speed: 2.6},
  {at: W.one12, speed: 3.6},
  // line 14's "rate go up": a short slow-down, the lamps on
  {at: W.about + 0.9, speed: 2.5},
  {at: W.rate + 0.3, speed: 3.6},
];
const WHEEL_R = CAR_LAYOUT.wheelR;
/** An odometer (m) over a drive's speed keys, at video time t: ∫ speed from −20 s (a fixed-step table, built once). */
const ODO_STEP = 1 / 120;
const ODO_T0 = -20;
const makeOdo = (keys: SpeedKey[]) => {
  const table = [0];
  for (let i = 1; i <= (END + 2 - ODO_T0) / ODO_STEP; i++) {
    const x = ODO_T0 + (i - 0.5) * ODO_STEP;
    table.push(table[i - 1] + speedAt(keys, x, 0.8) * 2 * Math.PI * WHEEL_R * ODO_STEP);
  }
  return (t: number) => table[Math.max(0, Math.min(table.length - 1, Math.round((t - ODO_T0) / ODO_STEP)))];
};
const odo = makeOdo(DRIVE);
const revsBetween = (a: number, b: number) => (odo(b) - odo(a)) / (2 * Math.PI * WHEEL_R);

/** Where the car rests (front tire to stop line, m) and when. */
const LINE_AHEAD = 1.4;
const REST1 = 1.1;
const REST2 = W.yours; // the gentle stop rests on "yours"
type Lens = 'red' | 'yellow' | 'green' | 'off';
/** The corners (a stop line and its signal), placed on the odometer so they stay put across cuts. */
const CORNERS: {at: number; post?: number; lights: {at: number; state: Lens}[]}[] = [
  // frame 0's red light; green on "start driving"
  // its line just ahead of the front tire and the pole close past it, so the red lens is in frame 0 (reviewer)
  {at: odo(REST1) + 0.3, post: 0.5, lights: [{at: -20, state: 'red'}, {at: W.start + 0.1, state: 'green'}]},
  // the story's light: yellow, red on "red", green on "green"
  {
    at: odo(REST2) + LINE_AHEAD,
    lights: [
      {at: -20, state: 'green'},
      {at: W.atRed - 0.9, state: 'yellow'},
      {at: W.red, state: 'red'},
      {at: W.green, state: 'green'},
    ],
  },
  // line 14: a green corner passing
  {at: odo(W.one12 + 1.4), lights: [{at: -20, state: 'green'}]},
];
/** A speed-limit sign on the far sidewalk passing on "car is moving". */
/** Signs on the far sidewalk, one ≈ every 1.5 s through the pickup and the box (reviewer: something streams past). */
const SIGN_TIMES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((k) => W.notices + 1.5 * k); // through the pickup, distraction and the speed line
const SIGNS = SIGN_TIMES.map((t, i) => ({at: odo(t) - 1.5, kind: i % 3 === 1 ? 'oneway' : 'speed', text: i % 3 === 1 ? ['ONE', 'WAY'] : ['SPEED', 'LIMIT', '25']}));

/** The feel arrow's length (× full; the ink tick at 0.8): past it at frame 0's hard stop and on "normal stop". */
const FEEL = [
  {at: -1.0, value: 0.6},
  {at: -0.4, value: 0.95},
  {at: 0.2, value: 1.0},
  {at: 0.8, value: 0.85},
  {at: 1.25, value: 0},
  {at: W.slow + 0.3, value: 0},
  {at: W.slow + 0.8, value: 0.25},
  {at: W.hard6, value: 0.6},
  {at: W.loses + 0.3, value: 0.7},
  {at: W.second, value: 0.78},
  {at: W.normal + 0.2, value: 0.92},
  {at: W.yours - 0.3, value: 0.6},
  {at: REST2 + 0.1, value: 0},
  {at: W.about + 0.9, value: 0},
  {at: W.about + 1.4, value: 0.35},
  {at: W.rate + 0.1, value: 0.3},
  {at: W.rate + 0.4, value: 0},
];
const LAMPS = [
  {at: -20, value: 1},
  {at: W.start + 0.2, value: 1},
  {at: W.start + 0.4, value: 0},
  {at: W.slow + 0.2, value: 0},
  {at: W.slow + 0.4, value: 1},
  {at: W.green + 0.05, value: 1},
  {at: W.green + 0.25, value: 0},
  {at: W.about + 0.8, value: 0},
  {at: W.about + 1.0, value: 1},
  {at: W.rate + 0.2, value: 0},
];
const FOOT = [
  {at: -20, pose: 'brake' as const},
  {at: W.start + 0.1, pose: 'accel' as const},
  {at: W.slow, pose: 'brake' as const, press: 0.5},
  {at: W.green, pose: 'accel' as const},
  {at: W.about + 0.7, pose: 'brake' as const, press: 0.4},
  {at: W.rate + 0.1, pose: 'accel' as const},
];
const NOSE = [
  {at: -1.0, value: 0.8},
  {at: 0.2, value: 1},
  {at: REST1 + 0.2, value: 0.4},
  {at: REST1 + 0.7, value: 0},
  {at: W.normal - 0.2, value: 0},
  {at: W.normal + 0.3, value: 0.4},
  {at: REST2 + 0.3, value: 0},
];

/** The event pins (video seconds): frame 0's hard stop (a real pin), the normal stop (could count: a ghost pin, fact-checker), the pickup. */
const EVENTS: {at: number; ghost?: boolean; pulses?: number[]}[] = [{at: W.app1 - 0.25, pulses: [W.every]}, {at: W.normal + 0.15, ghost: true, pulses: [W.consumer + 0.6, W.y2021]}, {at: W.distraction}];
/** A pin in the scene starting at `s` (a pin from an earlier scene keeps riding the road across the cut: `SlicedCar`, R-a). */
const pinIn = (e: {at: number; ghost?: boolean; pulses?: number[]}, s: number) => ({at: rel(e.at, s), ahead: 0.55, ...(e.ghost ? {ghost: true} : {}), ...(e.pulses ? {pulses: e.pulses.map((t) => rel(t, s))} : {})}); // 0.2 m forward of the default: clear of the caption

/** YOU's sedan, the dash-mount phone and its system, at scene start `s`. */
const drive = (s: number): Record<string, unknown> => ({
  variant: 'gas',
  shape: 'sedan',
  nearWheels: 'whole',
  road: 'city',
  roadAhead: 14,
  driving: shift(DRIVE, s),
  corners: CORNERS.map((c) => ({ahead: r2(c.at - odo(s)), when: 0, ...(c.post !== undefined ? {post: c.post} : {}), lights: shift(c.lights, s)})),
  signs: SIGNS.map((g) => ({ahead: r2(g.at - odo(s)), when: 0, kind: g.kind, text: g.text})),
  brakeLights: shift(LAMPS, s),
  foot: shift(FOOT, s),
  noseDip: shift(NOSE, s),
  glances: shift(
    [
      {at: W.car1 + 0.3, to: 'phone' as const},
      {at: W.consumer, to: 'phone' as const},
      {at: W.y2021 + 0.9, to: 'window' as const}, // waiting at the red: something every ≈ 2 s (reviewer)
      {at: W.five40 - 0.6, to: 'far' as const},
      {at: W.save, to: 'far' as const},
    ],
    s,
  ),
  cupPhone: {
    mount: 'dash',
    dotAt: -20,
    pulses: [W.dash, W.mile, W.trip4, W.y2021, W.recorded].map((t) => rel(t, s)),
    // the screen wakes by itself as the trip starts (line 4), sleeps again, and lights in the hand (lines 9–10)
    screen: shift(
      [
        {at: -20, value: 0},
        {at: W.notices4, value: 0},
        {at: W.notices4 + 0.3, value: 0.7},
        {at: W.some - 0.3, value: 0.7},
        {at: W.some + 0.2, value: 0},
        {at: W.pick, value: 0},
        {at: W.pick + 0.6, value: 1},
        {at: W.onEnd - 0.3, value: 1},
        {at: W.onEnd + 0.3, value: 0},
      ],
      s,
    ),
    pickAt: rel(W.pick - 0.3, s),
    downAt: rel(W.onEnd - 0.3, s),
    scrolls: [W.moving8 - 0.6, W.one9 + 0.9].map((t) => rel(t, s)),
    tilts: [rel(W.when9 + 0.2, s)],
    cutAt: rel(W.it3 + 0.2, s),
    chipAt: rel(W.it3 + 0.8, s),
    closeAt: rel(W.so3 + 0.2, s),
  },
  feel: {length: shift(FEEL, s), tick: 0.8, end: 'tail', tickPulse: [W.six, W.second, W.count + 0.3, W.y2021].map((t) => rel(t, s))},
  // a pin the car drove well past before this scene is off the road block (SlicedCar re-places pins from
  // long-past scenes at their landing spot, which put frame 0's pin on top of the ghost pin in scene 11)
  // (indices kept for the `pin:<i>` anchors: such a pin is parked 60 m ahead, outside the road block, so it isn't drawn)
  events: EVENTS.map((e) => (e.at + 0.4 < s && odo(s) - odo(e.at + 0.4) >= 6 ? {...pinIn(e, s), ahead: 60} : pinIn(e, s))),
  plugBox: {at: rel(W.need - 0.1, s), fadeAt: rel(W.how - 0.4, s)},
});

// ------------------------------------------------------------------ the camera on the video clock (byd-price's pattern)

type V3 = [number, number, number];
type Framing = {look: V3; distance: number};
type Ease = 'lin' | 'glide';
type PathKey = {t: number; f: Framing; ease?: Ease};
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
const keys = (path: PathKey[], start: number) => ({cameraKeys: camKeys(path, start, endOf(start))});
/** A framing pushed in (−) or pulled back (+) by `d` along the fixed angle. */
const at = (f: Framing, distance: number): Framing => ({look: f.look, distance});
const nudge = (f: Framing, dx: number, dy: number, distance = f.distance): Framing => ({look: [f.look[0] + dx, f.look[1] + dy, f.look[2]], distance});

/** A's framings, from the car-slice presets for this car (set on stills). */
const carFraming = (framing: string): Framing => carCameraStart({...drive(0), framing} as never, 30, 30);
const A_CAR = carFraming('car');
const A_FRAME0: Framing = nudge(A_CAR, 0.0, -0.3, 19.5); // the rear lamps inside the frame (reviewer fix 3) // the whole car between the title block and the captions, the arrow in the sky ahead
const A_PEDAL = nudge(carFraming('pedal'), 0, 0.12); // the ghost plug-in box mid-frame, under the title block
const A_MOUNT = carFraming('mount'); // the phone mid-frame, below the title block once the glide lands (+0.15 pushed it into the captions)
const A_CHIP = at(carFraming('chip'), 0.2); // close enough for the proof mass to read
const A_CABIN = nudge(A_CAR, 0.05, -0.38, 19); // the whole car: the arrow, the pin by the wheel and the lit tail lamps (reviewer fix 3)
const A_CALL = nudge(carFraming('call'), 0, 0.02, 12.5); // a little wider and higher: the far sidewalk's signs stream past behind YOU (reviewer fix 2)
const A_BOX = nudge(carFraming('call'), -0.6, -0.05, 10); // the driver and the phone left, room for the box at right, the head below it
const A_SPEED = 0.2; // u/s at d ≈ 17 (≈ 1.2 %/s)

const PATH_A: PathKey[] = [
  {t: -4, f: at(A_FRAME0, A_FRAME0.distance + A_SPEED * 4)},
  {t: W.and1, f: at(A_FRAME0, A_FRAME0.distance - A_SPEED * W.and1)},
  // "doesn't need your car": down to the port under the dash (the ghost plug-in box)
  {t: W.and1 + 0.7, f: A_PEDAL, ease: 'glide'},
  {t: W.how, f: at(A_PEDAL, A_PEDAL.distance - 0.04 * (W.how - W.and1 - 0.7))},
  // "the phone on your dash": the mount
  {t: W.how + 0.8, f: A_MOUNT, ease: 'glide'},
  {t: W.it3 + 0.1, f: at(A_MOUNT, A_MOUNT.distance - 0.05 * (W.it3 + 0.1 - W.how - 0.8))},
  // the cut-away: in to the motion sensor
  {t: W.it3 + 0.8, f: A_CHIP, ease: 'glide'},
  {t: W.so3, f: at(A_CHIP, A_CHIP.distance - 0.004 * (W.so3 - W.it3 - 0.8))},
  // "feels every stop and tracks every mile": back out, past the mount, to the whole car (frame 0's pin swells)
  {t: W.so3 + 0.6, f: A_MOUNT, ease: 'glide'},
  {t: W.so3 + 1.4, f: A_FRAME0, ease: 'glide'},
  {t: W.youre + 0.3, f: at(A_FRAME0, A_FRAME0.distance - A_SPEED * (W.youre - W.so3 - 1.1))},
  // "the app notices the trip": the driver and the phone, its screen waking as the car pulls away
  {t: W.youre + 1.1, f: A_CALL, ease: 'glide'},
  {t: W.some, f: at(A_CALL, A_CALL.distance - 0.06 * (W.some - W.youre - 1.1))},
  // "time of day … 5:40": the whole car in the low sun
  {t: W.some + 0.8, f: A_FRAME0, ease: 'glide'},
  {t: W.many, f: at(A_FRAME0, A_FRAME0.distance - A_SPEED * (W.many - W.some - 0.8))},
  // the threshold and the stop: the whole car, the arrow, the pin by the wheels, the lit tail lamps
  {t: W.many + 0.8, f: A_CABIN, ease: 'glide'},
  {t: W.when8, f: at(A_CABIN, A_CABIN.distance - 0.1 * (W.when8 - W.many - 0.8))},
  // the pickup, distraction, the speed line (the signs stream past behind YOU)
  {t: W.when8 + 0.9, f: A_CALL, ease: 'glide'},
  {t: W.each, f: at(A_CALL, A_CALL.distance - 0.04 * (W.each - W.when8 - 0.9))},
  // the detail box at right
  {t: W.each + 0.6, f: A_BOX, ease: 'glide'},
  {t: W.one12, f: at(A_BOX, A_BOX.distance - 0.05 * (W.one12 - W.each - 0.6))},
  // the numbers: the whole car
  {t: W.one12 + 0.8, f: A_FRAME0, ease: 'glide'},
  {t: W.and13 + 1, f: at(A_FRAME0, A_FRAME0.distance - A_SPEED * (W.and13 + 1 - W.one12 - 0.8))},
];
/** The loop: frame 0's framing and push speed, reached on the last frame. */
const PATH_LOOP: PathKey[] = [
  {t: S.s24 - 1, f: at(A_FRAME0, A_FRAME0.distance + A_SPEED * (END - S.s24 + 1))},
  {t: END, f: A_FRAME0},
  {t: END + 1, f: at(A_FRAME0, A_FRAME0.distance - A_SPEED)},
];

// ------------------------------------------------------------------ R: the data chain (video seconds)

const RF0 = reportFramings();
/** The report office aimed lower so the room sits high, its printer clear of a two-line caption. */
const RF = {...RF0, report: nudge(RF0.report, 0, -0.7), car: nudge(RF0.car, 0.3, 0)}; // car: the signal pole (post 1.5 m past the line) at the left, the tail lamps at the right
const R_UP: Framing = {look: [0.2, 3.2, 0.3], distance: 24};
const PATH_R: PathKey[] = [
  {t: W.and13 - 1, f: at(RF.car, RF.car.distance + 0.2)},
  {t: W.never, f: at(RF.car, RF.car.distance - 0.2 * (W.never - W.and13))},
  {t: W.never + 0.8, f: RF.cabin, ease: 'glide'},
  {t: W.alleged, f: at(RF.cabin, RF.cabin.distance - 0.06 * (W.alleged - W.never - 0.8))},
  {t: W.alleged + 0.8, f: RF.car, ease: 'glide'},
  {t: W.straight, f: at(RF.car, RF.car.distance - 0.2 * (W.straight - W.alleged - 0.8))},
  // the path leaves the car: crane up with its head
  {t: W.agency, f: R_UP},
  {t: W.agency + 0.8, f: RF.report, ease: 'glide'},
  {t: W.who, f: at(RF.report, RF.report.distance - 0.12 * (W.who - W.agency - 0.8))},
  {t: W.who + 0.8, f: RF.insurer, ease: 'glide'},
  {t: W.gm16, f: at(RF.insurer, RF.insurer.distance - 0.1 * (W.gm16 - W.who - 0.8))},
  {t: W.gm16 + 0.8, f: RF.chain, ease: 'glide'},
  {t: W.still, f: at(RF.chain, RF.chain.distance - 0.3 * (W.still - W.gm16 - 0.8))},
  {t: W.still + 0.8, f: RF.report, ease: 'glide'},
  {t: END, f: at(RF.report, RF.report.distance - 0.12 * (END - W.still - 0.8))},
];

const R_DRIVE: SpeedKey[] = [
  {at: -20, speed: 3.5},
  {at: W.alleged - 0.4, speed: 1.6},
  {at: W.alleged + 0.2, speed: 0}, // rests ≈ alleged + 1.0
  {at: W.braking14 + 0.6, speed: 2.0},
  {at: W.speeding + 0.4, speed: 4.2},
];
const odoR = makeOdo(R_DRIVE);
/** The second car's stop line (at its front tire at rest, reviewer fix 1) and a speed sign past the light. */
const R_LINE = odoR(W.alleged + 1.0) + 0.3;
const R_SIGN = odoR(W.speeding + 0.6) + 9;
/** The second car's red light: it rests ≈ 62.4, green on "speeding" (the start of "speeding" data). */
const reportChain = (s: number): Record<string, unknown> => ({
  location: 'report-chain',
  car: {
    driving: shift(R_DRIVE, s),
    corners: [
      {
        ahead: r2(R_LINE - odoR(s)),
        when: 0,
        post: 1.5,
        lights: shift(
          [
            {at: -20, state: 'green' as const},
            {at: W.the14, state: 'yellow' as const},
            {at: W.alleged + 0.6, state: 'red' as const},
            {at: W.braking14 + 0.5, state: 'green' as const},
          ],
          s,
        ),
      },
    ],
    roadAhead: 14,
    signs: [{ahead: r2(R_SIGN - odoR(s)), when: 0, kind: 'speed'}],
    brakeLights: shift(
      [
        {at: -20, value: 0},
        {at: W.alleged - 0.5, value: 0},
        {at: W.alleged - 0.3, value: 1},
        {at: W.braking14 + 0.5, value: 1},
        {at: W.braking14 + 0.7, value: 0},
      ],
      s,
    ),
    foot: shift(
      [
        {at: -20, pose: 'accel' as const},
        {at: W.alleged - 0.6, pose: 'brake' as const, press: 0.6},
        {at: W.braking14 + 0.5, pose: 'accel' as const},
      ],
      s,
    ),
    glances: shift([{at: W.app13 - 0.1, to: 'phone' as const}], s),
    cupPhone: {mount: 'dash'}, // dark, no dot: this driver never installed an app
  },
  phone: false,
  moduleAt: rel(W.collected, s),
  rings: [W.collected + 0.1, W.braking14, W.speeding].map((t) => rel(t, s)),
  path: {
    at: rel(W.straight, s),
    companyAt: rel(W.sold, s),
    leg2At: rel(W.insurers15, s),
    insurerAt: rel(W.used, s),
    pulsesAt: rel(W.connected, s),
    fadeAt: rel(W.settled, s),
  },
  print: [W.reports15, W.carmakers - 0.5].map((t) => rel(t, s)),
  tray: rel(W.used + 0.1, s),
  pickAt: rel(W.used + 0.8, s),
  stampAt: rel(W.set, s),
});

// ------------------------------------------------------------------ overlays

const titleBlock: OverlaySpec = {
  type: 'title',
  at: 0,
  question: 'How does the phone on your dash know?', // D1, line 2 as recorded
  number: 'No. 012',
  title: 'The Drive Home',
  time: '5:40 PM',
  carry: true,
  until: r2(W.knowEnd + 0.8),
} as OverlaySpec;

const COUNTER_AT = {x: 0.111, y: 0.156};

// ------------------------------------------------------------------ scenes

/** A: no idle drift (drift runs on the video clock, so it would break the loop seam: frame 0 = the last frame). */
const A = (s: number, extra: Record<string, unknown> = {}) => ({...drive(s), drift: 0, transition: 'continue', ...keys(PATH_A, s), ...extra});
const R = (s: number, transition: 'slide' | 'continue') => ({...reportChain(s), transition, ...keys(PATH_R, s)});

const scenes: SceneSpec[] = [
  // ---- 1–3 A: frame 0 (the hard stop at a red light), the ghost plug-in box, the phone on the dash
  {scene: 'car-slice', cue: 'An insurance app', props: A(S.s1), overlays: [titleBlock]},
  {scene: 'car-slice', cue: "and it doesn't need", props: A(S.s2)},
  {scene: 'car-slice', cue: 'How does the phone', props: A(S.s3)},
  // ---- 4–5 A: the cut-away (the motion sensor), then out: every stop, every mile
  {
    scene: 'car-slice',
    cue: 'It has its own',
    props: A(S.s4),
    overlays: [
      {type: 'callout', anchor: 'chip', title: 'Motion sensor', size: 1.2, place: 'above', dy: -300, at: rel(W.motion, S.s4), until: rel(W.so3 - 0.1, S.s4)} as OverlaySpec,
    ],
  },
  {scene: 'car-slice', cue: 'so it feels every', props: A(S.s5)},
  // ---- 6–7 A: the trip starts on its own (the screen wakes); time of day
  {scene: 'car-slice', cue: 'You start driving', props: A(S.s6), overlays: [
      {type: 'tag', who: 'you', at: rel(W.youre + 0.3, S.s6), until: rel(W.notices4 - 0.15, S.s6)} as OverlaySpec,
      // the screen wakes by itself (it faces YOU, so the label says what it shows)
      {type: 'callout', anchor: 'phone', title: 'Trip started', sub: 'No tap', subInk: 'ink', size: 1.2, place: 'above', dy: -220, at: rel(W.notices4 + 0.25, S.s6), until: rel(W.some - 0.2, S.s6)} as OverlaySpec,
    ],
  },
  {
    scene: 'car-slice',
    cue: 'Some programs look',
    props: A(S.s7),
    overlays: [
      // an invented example time, never a penalty (fact-checker): a statement in the sky, no orange
      {type: 'statement', text: '5:40 PM.', place: 'sky', at: rel(W.five40 - 0.1, S.s7), until: rel(W.atRed - 0.1, S.s7)} as OverlaySpec,
    ],
  },
  // ---- 8 A: at a red light, the gentle stop begins
  {scene: 'car-slice', cue: 'At a red light', props: A(S.s8)},
  // ---- 9 A: the threshold
  {
    scene: 'car-slice',
    cue: 'Many programs',
    props: A(S.s9),
    overlays: [
      {
        type: 'counter',
        from: 0,
        to: 6,
        rangeTo: 8,
        label: 'MPH',
        sub: 'Lost in one second',
        sub2: 'Many programs', // fact-checker: CR's range is "many programs" (named insurers ran 6–10)
        ...COUNTER_AT,
        at: rel(W.loses - 0.1, S.s9),
        duration: r2(W.six - W.loses + 0.2),
        rangeAt: r2(W.eight - W.loses + 0.1),
        until: rel(W.so - 0.3, S.s9),
      } as OverlaySpec,
    ],
  },
  // ---- 10 A: a normal stop could count (the ghost pin)
  {
    scene: 'car-slice',
    cue: 'So a normal stop',
    props: A(S.s10),
    overlays: [
      {type: 'callout', anchor: 'pin:1', title: 'Could count as', sub: 'HARD BRAKING', subInk: 'ink', size: 1.2, place: 'above', dy: -480, at: rel(W.count, S.s10), until: rel(W.when8 - 0.3, S.s10)} as OverlaySpec,
    ],
  },
  // ---- 11–12 A: green, the pickup, distraction
  {scene: 'car-slice', cue: 'When the light turns green', props: A(S.s11)},
  {
    scene: 'car-slice',
    cue: "One insurer's app",
    props: A(S.s12),
    overlays: [
      {type: 'callout', anchor: 'phone', title: 'Phone moving', size: 1.2, place: 'above', dy: -220, at: rel(W.when9 - 0.2, S.s12), until: rel(W.moving9 + 0.1, S.s12)} as OverlaySpec,
      {type: 'callout', anchor: 'phone', title: 'Screen on', size: 1.2, place: 'above', dy: -160, at: rel(W.screen - 0.05, S.s12), until: rel(W.onEnd - 0.1, S.s12)} as OverlaySpec,
    ],
  },
  // ---- 13 A: the speed rule (signs streaming past; an ink counter, nothing orange: no one is shown speeding)
  {
    scene: 'car-slice',
    cue: "The same insurer's",
    props: A(S.s13),
    overlays: [
      {type: 'counter', from: 0, to: 8, label: 'MPH', sub: 'Or more over the limit', ...COUNTER_AT, at: rel(W.over - 0.2, S.s13), duration: r2(W.eight11 - W.over + 0.2), until: rel(W.each - 0.2, S.s13)} as OverlaySpec,
    ],
  },
  // ---- 14 A: recorded → scores → price, one detail box
  {
    scene: 'car-slice',
    cue: 'Each trip is',
    props: A(S.s14),
    overlays: [
      {
        type: 'detail',
        content: 'trip-app',
        appName: 'Corlo',
        anchor: 'phone',
        side: 'right',
        top: 400, // clear of YOU's head (reviewer fix 5)
        at: 0.15,
        until: rel(W.one12 - 0.15, S.s14),
        routeFor: 2.0,
        tripPins: [
          // each lands as the route passes it (route 2.0 s: k 0.3 at 0.6 s, k 0.72 at 1.44 s)
          {at: 0.6, label: 'HARD BRAKE', k: 0.3},
          {at: 1.45, label: 'PHONE', k: 0.72},
        ],
        appPulses: [2.2],
        scoresAt: rel(W.turns10, S.s14 + 0.15),
        scores: [
          {label: 'BRAKING', value: 0.7},
          {label: 'PHONE USE', value: 0.45},
        ],
        priceAt: rel(W.those + 0.4, S.s14 + 0.15),
        price: [
          {at: rel(W.price, S.s14 + 0.15), value: 0},
          {at: rel(W.price + 0.9, S.s14 + 0.15), value: -0.6},
          {at: rel(W.either, S.s14 + 0.15), value: -0.6},
          {at: rel(W.way + 0.2, S.s14 + 0.15), value: 0.6},
          {at: rel(W.one12 - 0.4, S.s14 + 0.15), value: 0.15},
        ],
      } as OverlaySpec,
    ],
  },
  // ---- 15–16 A: the numbers
  {
    scene: 'car-slice',
    cue: 'One insurer says',
    props: A(S.s15),
    overlays: [
      {type: 'counter', from: 0, to: 30, label: '% SAVED', sub: 'Up to', subPlace: 'above', ...COUNTER_AT, at: rel(W.save - 0.3, S.s15), duration: r2(W.thirty - W.save + 0.3), until: rel(W.but - 0.15, S.s15)} as OverlaySpec,
    ],
  },
  {
    scene: 'car-slice',
    cue: 'but another says',
    props: A(S.s16),
    overlays: [
      {type: 'counter', from: 0, to: 2, label: 'IN 10 · RATE UP', sub: 'About', subPlace: 'above', ...COUNTER_AT, at: rel(W.about - 0.1, S.s16), duration: r2(W.two - W.about + 0.1), until: rel(W.and13 - 0.2, S.s16)} as OverlaySpec,
    ],
  },
  // ---- 17–23 R: the second car, its module, the report company, the insurer, the fade
  {scene: 'report-slice', cue: 'And some drivers', props: R(S.s17, 'slide')},
  {scene: 'report-slice', cue: 'The FTC alleged', props: R(S.s18, 'continue')},
  {scene: 'report-slice', cue: 'braking and speeding', props: R(S.s19, 'continue')},
  {
    scene: 'report-slice',
    cue: 'The agency said',
    props: R(S.s20, 'continue'),
    overlays: [
      {type: 'callout', anchor: 'company', title: 'Report company', size: 1.2, place: 'above', dy: -150, at: rel(W.companies15, S.s20), until: rel(W.who - 0.2, S.s20)} as OverlaySpec,
    ],
  },
  {
    scene: 'report-slice',
    cue: 'who then used',
    props: R(S.s21, 'continue'),
    overlays: [
      {type: 'callout', anchor: 'insurer', title: 'Insurer', size: 1.2, place: 'above', dy: -240, at: rel(W.used, S.s21), until: rel(W.gm16 - 0.2, S.s21)} as OverlaySpec,
    ],
  },
  {scene: 'report-slice', cue: 'GM settled', props: R(S.s22, 'continue')},
  {
    scene: 'report-slice',
    cue: 'still advertises',
    props: R(S.s23, 'continue'),
    overlays: [
      {type: 'callout', anchor: 'company', title: 'Still advertised', sub: "Carmakers' driving data", subInk: 'ink', size: 1.2, place: 'above', dy: -150, at: rel(W.advertises, S.s23), until: rel(W.to16 - 0.1, S.s23)} as OverlaySpec,
    ],
  },
  // ---- 24 A: the loop, frame 0's stop replayed so the last frame is frame 0
  {
    scene: 'car-slice',
    start: S.s24, // the closing line's first word, or "to insurers"
    props: {
      ...drive(-LOOP_LEN),
      drift: 0,
      transition: 'slide',
      ...keys(PATH_LOOP, S.s24),
      // the wheels land on frame 0's turn (0) on the last frame
      revsFrom: r2(-revsBetween(-LOOP_LEN, 0)),
      wheelFrom: r2(-revsBetween(-LOOP_LEN, 0)),
    },
  },
];

// ------------------------------------------------------------------ sound (av-script "Sound effects plan"; No. 011's pattern)

/**
 * volume = (voice −22.0 − dB under) − the file's measured LUFS. By ear: `mount-click` and `stamp` are too short for an
 * integrated reading (true peaks −3.8 / −7.8 dBTP). `paper-tray` measures −38.9 (a quiet file, peak −22.9 dBTP), so it
 * takes a small positive gain by the formula.
 */
const VOICE_LUFS = -22.0;
const vol = (under: number, lufs: number) => r2(VOICE_LUFS - under - lufs);
const SFX = {
  carStop: {file: 'car-stop', volume: vol(16, -20.9), len: 1.4}, // YOU's car
  carStopB: {file: 'car-stop', volume: vol(17, -20.9), len: 1.4}, // the second car, a step further back
  pullAway: {file: 'pull-away', volume: vol(18, -24.4), len: 2.0},
  mountClick: {file: 'mount-click', volume: -20, len: 0.3}, // by ear
  printer: {file: 'printer', volume: vol(17, -25.1), len: 1.0},
  paperTray: {file: 'paper-tray', volume: vol(18, -38.9), len: 0.5},
  stamp: {file: 'stamp', volume: -14, len: 0.3}, // by ear
} as const;
type SfxKey = keyof typeof SFX;
/** [video time, sound]: each at the moment the thing makes its sound. None under the statement, overlays or slides. */
const SFX_EVENTS: [number, SfxKey][] = [
  [0, 'carStop'], // frame 0's stop (rests ≈ 1.1)
  [W.start + 0.3, 'pullAway'],
  [W.yours - 0.9, 'carStop'], // the gentle stop's last second
  [W.green + 0.15, 'pullAway'],
  [W.pick, 'mountClick'], // unclipped
  [W.onEnd + 0.3, 'mountClick'], // clipped back
  [W.alleged - 0.1, 'carStopB'], // the second car rests ≈ alleged + 1.0
  [W.reports15, 'printer'],
  [W.used + 0.1, 'paperTray'], // lands in the tray
  [W.used + 0.8, 'paperTray'], // picked up
  [W.set, 'stamp'],
  [W.carmakers - 0.5, 'printer'],
];
/** The sounds inside one scene [a, b); a sound crossing a cut is split, the later piece trimmed so it runs on. */
const sfxIn = (a: number, b: number): OverlaySpec[] =>
  SFX_EVENTS.flatMap(([t0, k]) => {
    const sd = SFX[k];
    const end = t0 + sd.len;
    if (end <= a || t0 >= b) return [];
    const start = Math.max(t0, a);
    return [{type: 'sfx', name: sd.file, volume: sd.volume, at: rel(start, a), ...(t0 < a ? {trim: r2(a - t0)} : {})} as OverlaySpec];
  });
scenes.forEach((sc, i) => {
  const extra = sfxIn(STARTS[i], endOf(STARTS[i]));
  if (extra.length) sc.overlays = [...(sc.overlays ?? []), ...extra];
});

/** Music bed (take a, 99 s, −14.5 LUFS; voice −22.0): from frame 0, no duck, a 1 s fade-out ends it silent on the last frame. */
const MUSIC = {level: -19.5, duckDb: 0, startAt: 0, fadeIn: 1.5, fadeOut: 1} as const;

export const spec: VideoSpec = {
  // Cover still (`yarn cover insurance-app`, publisher's proposal): frame 0's hard stop at the red light (arrow past
  // the tick, lamps lit, the phone on the dash mount, the red lens), aimed a little higher so the car sits under the text.
  cover: {
    text: 'Insurance app\nHow does it know?',
    size: 130,
    scene: 'car-slice',
    camera: nudge(A_FRAME0, 0.25, 0.8, 19.5), // the signal head left of the text, the tail lamps inside the frame
    at: 0,
    props: {...drive(0), drift: 0},
  },
  tail: TAIL,
  music: MUSIC,
  scenes,
};
