/* eslint-disable @remotion/non-pure-animation -- false positive: `transition` keys in scene props are data, not CSS transitions */
import type {OverlaySpec, SceneSpec, VideoSpec} from '../../types';
import type {HouseCameraKey, HouseFraming, HouseSliceSceneProps} from '../../scenes/HouseSliceScene';
import {HOUSE} from '../../three/real/HouseHeat';
import transcript from './transcript.json';

/**
 * No. 018 · How can the air outside hold any heat when it's 30 degrees? (`av-script.md` draft 2, cut on the recorded
 * take: voice 0.13 → 88.56 s, a 1.5 s tail for the loop).
 *
 * One location, H `house-slice` (the house cut open on a winter night). Every hand-over is `continue`: the camera
 * glides from where the last scene ended (`cameraKeys`, scene seconds). Orange = heat and the energy spent making or
 * moving it; widths carry the units (feed w; line set `level` × w). Scenes 3–7 build the mechanism step by step
 * (flows off, then drawn on). The loop: scene 16 lands on frame 0's framing and state at the last frame (2701).
 */

type Word = {text: string; start: number; end: number};
const WORDS = (transcript as {words: Word[]}).words;
const norm = (x: string) => x.toLowerCase().replace(/[^a-z0-9]/g, '');

/** The start (video s) of the first match of `phrase` whose first word starts at or after `after`. */
const T = (phrase: string, after = 0): number => {
  const ws = phrase.split(/\s+/).map(norm);
  for (let i = 0; i <= WORDS.length - ws.length; i++) {
    if (WORDS[i].start < after - 1e-6) continue;
    if (ws.every((w, k) => norm(WORDS[i + k].text) === w)) return WORDS[i].start;
  }
  throw new Error(`home-heat spec: "${phrase}" not found after ${after}`);
};

const FPS = 30;
const TAIL = 1.5;
const END = WORDS[WORDS.length - 1].end;
const N_FRAMES = Math.round((END + TAIL) * FPS);

// ------------------------------------------------------------------ scene cues and starts (video seconds)

const CUES = [
  'A heat pump puts',
  'That sounds impossible.',
  'Even 30-degree air holds',
  "That's why the heat",
  'To that liquid, 30-degree',
  'Then a compressor squeezes',
  'Now the gas is',
  'The electricity runs the',
  'A space heater brings',
  'At a mild 40',
  'At 6 below zero',
  'As it gets colder,',
  'On newer heat pumps,',
  'and backup heat, if',
  'Electric cars heat the',
  'And at home, does',
] as const;
const S: number[] = [];
CUES.forEach((c, i) => S.push(i === 0 ? 0 : T(c, S[i - 1] + 0.01)));

const r2 = (x: number) => Math.round(x * 100) / 100;
/** Video time → seconds into scene i (1-based), on the frame grid the Explainer uses. */
const rel = (i: number, t: number) => r2(t - Math.round(S[i - 1] * FPS) / FPS);
/** Word in scene i → seconds into that scene. */
const W = (i: number, phrase: string) => rel(i, T(phrase, S[i - 1]));
const v = (pairs: [number, number][]) => pairs.map(([at, value]) => ({at, value}));

// ------------------------------------------------------------------ camera helpers

const into = (len: number, framing: HouseFraming): HouseCameraKey => ({at: len, framing});
/** An in-scene glide: hold `from` until `at`, arrive at `to` after `len`. */
const glide = (at: number, len: number, from: HouseFraming, to: HouseFraming): HouseCameraKey[] => [
  {at, framing: from},
  {at: r2(at + len), framing: to},
];

// ------------------------------------------------------------------ shared state

/** YOU's EV, parked: the HVAC box present but off in every scene (frame 0 = last frame). */
const EV_IDLE = {hvac: {kind: 'electric' as const, on: 0, feed: null}};
const REGISTER_LOOK: [number, number, number] = [HOUSE.register[0], HOUSE.register[1] + 0.3, HOUSE.register[2]];
const YARD_LOOK: [number, number, number] = [6, 1.2, 0.4];
const HEATER_LOOK: [number, number, number] = [HOUSE.heater[0], HOUSE.heater[1] + 0.3, HOUSE.heater[2]];
const OFF = false as const;
/** Value tweaks on the scene-builder's framings (plain camera keys). */
const COMPRESSOR_HOT = {look: [3.76, 0.42, 0.14] as [number, number, number], distance: 4.0}; // the hot-line thermometer fully in frame
/** D4: the house 0.4 m lower in frame (≈ 40 px): the title clears the roof apex. Frame 0 and the last frame both use it. */
const HOUSE0 = {look: [0.62, 1.4, 0.0] as [number, number, number], distance: 40.5};
/** D4: `air` nudged so the thermometer's top clears the title (still up to 13.77). */
const AIR_LOW = {look: [4.83, 0.95, 0.28] as [number, number, number], distance: 8.8};
/** D1: `indoor` looking lower, so the hot-line and room thermometers clear the caption band. */
const INDOOR_HI = {look: [-0.8, -1.2, 1.16] as [number, number, number], distance: 21.7};
const LOOP_WIDE_LOW = {look: [2.0, 0.0, 1.38] as [number, number, number], distance: 29.5}; // the house lower: YOU clear of the counter
/** A flow already drawn, fading out from the scene's start. */
const fadeOut = (fadeFor = 0.6) => ({at: -1, fadeAt: 0, fadeFor});

type P = Omit<Partial<HouseSliceSceneProps>, 'durationInFrames'>;
const base = (p: P): Record<string, unknown> => ({
  mood: 'night',
  transition: 'continue',
  drift: 0,
  neighbours: false, // the far neighbour block poked in at frame 0's left edge
  ev: EV_IDLE,
  ...p,
});

// ------------------------------------------------------------------ overlays

const titleBlock = {
  type: 'title',
  at: 0,
  question: 'How can the air outside hold\nany heat when it\'s 30 degrees?',
  number: 'No. 018',
  title: 'The House',
  time: '9:40 PM',
  carry: true,
  until: r2(WORDS.find((w) => w.text === 'degrees?')!.end + 0.8 + 10 / FPS), // fades 0.8 s after "…30 degrees?" ends, over 10 frames
} as OverlaySpec;

const COUNTER_AT = {x: 0.111, y: 0.156};
const rowsCounter = (
  i: number,
  inAt: number,
  outAt: number,
  heat: {to: number; land: number},
  elec: {to: number; land: number},
  sub: string,
  decimals = 0,
): OverlaySpec =>
  ({
    type: 'counter',
    from: 0,
    rows: [
      {label: 'ELECTRICITY IN', to: elec.to, startAt: r2(elec.land - inAt - 0.8), stopAt: r2(elec.land - inAt)},
      {label: 'HEAT OUT', to: heat.to, startAt: r2(Math.max(0.1, heat.land - inAt - 1.2)), stopAt: r2(heat.land - inAt)},
    ],
    label: '',
    sub,
    decimals,
    ...COUNTER_AT,
    at: rel(i, inAt),
    until: rel(i, outAt),
  }) as OverlaySpec;

const callout = (i: number, title: string, sub: string, a: number, b: number, x: number, y: number, dx: number, dy: number, place: 'side' | 'above' = 'side', size = 1.2): OverlaySpec =>
  ({type: 'callout', x, y, title, sub, subInk: 'ink', size, place, dx, dy, at: rel(i, a), until: rel(i, b)}) as OverlaySpec;

// ------------------------------------------------------------------ scenes

const scenes: SceneSpec[] = [];
const add = (props: P, overlays: OverlaySpec[] = []) => {
  const i = scenes.length;
  scenes.push({scene: 'house-slice', cue: CUES[i], props: base(props), overlays});
};

// 1 · frame 0: the whole section, the heat pump already running; glide to the yard at "because"
add(
  {
    framing: 'house',
    cameraKeys: [{at: 0, ...HOUSE0}, {at: W(1, 'because'), ...HOUSE0, distance: 39.8, ease: 'sine'}, {at: r2(W(1, 'because') + 0.8), framing: 'yard'}],
    heatPump: {pulses: [W(1, 'electricity')], hotPulses: [W(1, 'heat into')], intakePulses: [W(1, 'extra heat')]},
    snow: {gusts: [W(1, 'already')]},
    you: {gestures: [{pose: 'scroll', at: -1}, {pose: 'turn-to', at: W(1, 'house'), target: REGISTER_LOOK, hold: 1.0}]},
  },
  [titleBlock],
);

// 2 · the room; YOU looks at the register, then toward the outside; glide to the yard at "hold any heat"
{
  const i = 2;
  add({
    framing: 'room',
    cameraKeys: [into(0.7, 'room'), ...glide(W(i, 'hold any heat'), 0.8, 'room', 'yard')],
    snow: {density: v([[W(i, 'air outside'), 1], [r2(W(i, 'air outside') + 0.5), 1.6], [r2(W(i, '30 degrees')), 1.6], [rel(i, S[2]) - 0.2, 1]]), gusts: [W(i, 'heat when')]},
    you: {
      gestures: [
        {pose: 'scroll', at: -1},
        {pose: 'turn-to', at: r2(W(i, 'impossible') + 0.6), target: REGISTER_LOOK},
        {pose: 'turn-to', at: W(i, 'how can'), target: YARD_LOOK},
      ],
    },
    thermo: {
      air: {
        f: v([[0, 30], [r2(W(i, '30 degrees') - 0.5), 32], [r2(W(i, '30 degrees') + 0.3), 30]]),
        flags: [{f: 30, k: v([[W(i, '30 degrees'), 0], [r2(W(i, '30 degrees') + 0.3), 1], [r2(W(i, '30 degrees') + 1.0), 1], [r2(W(i, '30 degrees') + 1.25), 0]])}],
      },
    },
  });
}

// 3 · the air holds heat (still wisps); across to the window: heat leaves through the glass
{
  const i = 3;
  add({
    framing: 'window',
    cameraKeys: [{at: 0.6, ...AIR_LOW}, {at: W(i, 'and heat always'), ...AIR_LOW}, {at: r2(W(i, 'and heat always') + 0.8), framing: 'window'}],
    heatPump: {
      air: v([[r2(W(i, 'holds heat') - 0.1), 0], [r2(W(i, 'holds heat') + 0.5), 1.0]]), // D2
      pull: 0,
      liquid: v([[0, 1], [0.6, 0]]),
      flows: {intake: fadeOut(), suction: fadeOut(), hot: fadeOut(0.8), coil: fadeOut(), supply: fadeOut(0.8)},
    },
    leak: v([[r2(W(i, 'flows') - 0.2), 0], [r2(W(i, 'flows') + 0.4), 1], [r2(W(i, 'colder') + 0.4), 1], [rel(i, S[3]), 0.3]]),
  });
}

// 4 · the coil kept colder than the air: two thermometers and the 10–20° bracket
{
  const i = 4;
  const colder = W(i, 'colder than the');
  add({
    framing: 'gauges',
    cameraKeys: [into(0.9, 'coil'), ...glide(colder, 0.6, 'coil', 'gauges')],
    heatPump: {air: 1.0, pull: 0, liquid: v([[W(i, 'liquid'), 0], [r2(W(i, 'liquid') + 0.4), 1]]), flows: {intake: OFF, suction: OFF, hot: OFF, coil: OFF, supply: OFF}},
    leak: v([[0, 0.3], [0.5, 0]]),
    thermo: {
      coil: {show: v([[W(i, 'outdoor coil'), 0], [r2(W(i, 'outdoor coil') + 0.4), 1]]), under: v([[r2(colder + 0.1), 0], [W(i, 'air,'), 15]])},
      bracket: {
        draw: v([[W(i, 'usually'), 0], [r2(W(i, 'usually') + 0.4), 1]]),
        ends: [v([[W(i, '10 to'), 0], [r2(W(i, '10 to') + 0.2), 1]]), v([[W(i, '20 degrees'), 0], [r2(W(i, '20 degrees') + 0.2), 1]])],
      },
    },
  }, [callout(i, 'HEAT PUMP', 'Outdoor coil', T('pump', S[3]), T('colder', S[3]) - 0.12, 0.55, 0.42, 0, -380, 'above')]);
}

// 5 · to the liquid the air is warm: wisps drift in, the liquid boils, the suction line carries the heat
{
  const i = 5;
  add({
    framing: 'tubes',
    cameraKeys: [into(0.6, 'fins'), ...glide(W(i, 'and the liquid'), 0.5, 'fins', 'tubes')],
    heatPump: {
      air: 1.0, // D2
      pull: v([[r2(W(i, 'warm') - 1.0), 0], [r2(W(i, 'warm') - 0.6), 0.6], [r2(W(i, 'heat flows') + 0.2), 1]]), // v0.18.14: visible by ≈ f830
      boil: v([[W(i, 'boils'), 0], [r2(W(i, 'boils') + 0.5), 1]]),
      flows: {
        intake: {at: r2(W(i, 'warm') - 1.1), drawFor: 0.4},
        suction: {at: W(i, 'gas.'), drawFor: 0.9},
        hot: OFF,
        coil: OFF,
        supply: OFF,
      },
    },
    thermo: {coil: {show: 1, under: 15}, bracket: {draw: v([[0, 1], [0.5, 0]]), ends: [1, 1]}},
  });
}

// 6 · the compressor squeezes the gas: suction + feed merge into the 2.5 w hot line; the hot thermometer climbs
{
  const i = 6;
  add({
    framing: 'compressor',
    cameraKeys: [{at: 0.5, ...COMPRESSOR_HOT}],
    heatPump: {
      air: v([[0, 1], [1, 0]]),
      boil: 1,
      pulses: [W(i, 'compressor')],
      flows: {hot: {at: W(i, 'squeezes'), drawFor: 1.4}, coil: OFF, supply: OFF},
    },
    thermo: {
      coil: {show: v([[0, 1], [0.5, 0]]), under: 15},
      hot: {show: v([[W(i, 'gas,'), 0], [r2(W(i, 'gas,') + 0.4), 1]]), f: v([[0, 40], [W(i, 'heats'), 40], [r2(W(i, 'heats') + 0.7), 110]])},
    },
  });
}

// 7 · hotter than the room: the A-coil glows, warm air rises to the register
{
  const i = 7;
  add({
    framing: 'indoor',
    cameraKeys: [{at: 0.7, ...INDOOR_HI}],
    heatPump: {
      boil: 1,
      flows: {coil: {at: r2(W(i, 'so it') - 0.3), drawFor: 0.4}, supply: {at: W(i, 'so it'), drawFor: 0.6}}, // D3: the room warms 0.6 s earlier
      hotPulses: [W(i, 'heat the'), W(i, 'house.')],
    },
    thermo: {
      hot: {show: v([[0, 1], [0.4, 0]])},
      hotIndoor: {show: v([[0.3, 0], [0.7, 1]])},
      room: {flags: [{f: 68, k: v([[W(i, 'living'), 0], [r2(W(i, 'living') + 0.25), 1], [r2(W(i, 'living') + 1.4), 1], [r2(W(i, 'living') + 1.7), 0]])}]},
    },
  });
}

// 8 · the electricity runs the compressor; out to the yard: the rest comes in from outside
{
  const i = 8;
  add({
    framing: 'yard',
    cameraKeys: [into(0.7, 'feed'), ...glide(W(i, 'and the rest'), 0.8, 'feed', 'yard')],
    heatPump: {
      boil: 1,
      pulses: [W(i, 'electricity')],
      intakePulses: [W(i, 'heat comes')],
      hotPulses: [W(i, 'comes in'), r2(W(i, 'outside.') - 0.5)],
    },
    thermo: {hotIndoor: {show: v([[0, 1], [0.5, 0]])}},
    snow: {gusts: [W(i, 'outside.')]},
  });
}

// 9 · the space heater: the heat pump goes quiet; outlet → cord → element; 1 in, 1 out
{
  const i = 9;
  const makes = W(i, 'makes');
  add(
    {
      framing: 'heater',
      cameraKeys: [into(0.7, 'room'), ...glide(W(i, 'so it makes'), 0.7, 'room', 'heater')],
      heatPump: {run: v([[0, 1], [0.8, 0]]), boil: v([[0, 1], [0.8, 0]])},
      heater: {
        power: v([[W(i, 'heater'), 0], [r2(W(i, 'heater') + 0.3), 1]]),
        glow: v([[makes, 0], [r2(makes + 0.45), 1]]),
        feed: {at: makes, drawFor: 0.6},
        wisps: v([[r2(W(i, 'heat,') - 0.2), 0], [r2(W(i, 'heat,') + 0.3), 1]]),
      },
      you: {gestures: [{pose: 'scroll', at: -1}, {pose: 'lean-in', at: r2(W(i, 'heater') - 0.2), hold: 0.9}]},
    },
    [rowsCounter(i, 47.0, 50.2, {to: 1, land: T('unit', S[8])}, {to: 1, land: T('electricity.', S[8])}, 'UNITS')],
  );
}

// 10 · 40°F: the pump restarts, 3 w in the house for w of electricity
{
  const i = 10;
  const deg = W(i, 'degrees,');
  add(
    {
      framing: 'house',
      cameraKeys: [into(0.8, 'yard'), {at: W(i, 'Canadian'), framing: 'yard'}, {at: r2(W(i, 'Canadian') + 0.9), ...HOUSE0}],
      heatPump: {run: v([[0, 0], [r2(deg + 0.6), 0], [r2(deg + 1.1), 1]]), level: 3, hotPulses: [W(i, 'three')]},
      heater: {power: v([[0, 1], [0.3, 0]]), glow: v([[0, 1], [0.5, 0]]), feed: fadeOut(0.5), wisps: v([[0, 1], [0.5, 0]])},
      thermo: {air: {f: v([[W(i, '40'), 30], [r2(W(i, '40') + 0.6), 40]])}},
      snow: {density: v([[W(i, 'mild'), 1], [r2(W(i, 'mild') + 0.8), 0.6]])},
      you: {gestures: [{pose: 'scroll', at: -1}, {pose: 'idle', at: W(i, 'heat for')}]},
    },
    [rowsCounter(i, 53.9, 57.6, {to: 3, land: T('three', S[9])}, {to: 1, land: T('electricity.', S[9])}, 'ABOUT · 40°F')],
  );
}

// 11 · −6°F: the wisps thin, the line set narrows to 1.5 w; still beats a space heater
{
  const i = 11;
  const zero = W(i, 'below zero');
  add(
    {
      framing: 'room',
      cameraKeys: [{at: 0.8, ...LOOP_WIDE_LOW}, {at: W(i, 'which still beats'), ...LOOP_WIDE_LOW}, {at: r2(W(i, 'which still beats') + 0.7), framing: 'room'}],
      heatPump: {level: v([[r2(zero + 0.45), 3], [r2(zero + 1.25), 1.5]])},
      thermo: {air: {f: v([[zero, 40], [r2(zero + 0.75), -6]])}},
      snow: {density: v([[0, 0.6], [0.8, 1.3]]), gusts: [0.1]},
      you: {gestures: [{pose: 'idle', at: -1}, {pose: 'turn-to', at: W(i, 'space heater'), target: HEATER_LOOK}]},
    },
    [rowsCounter(i, 59.4, 62.9, {to: 1.5, land: T('half,', S[10])}, {to: 1, land: r2(T('half,', S[10]) + 0.24)}, '−6°F', 1)],
  );
}

// 12 · colder: 1.5 w → 1.2 w (brand ruling: lineScale 2, 0.6 s cubic step landing on "pull"); the shut-off
{
  const i = 12;
  const pull = W(i, 'pull');
  add({
    framing: 'yard',
    lineScale: 2.0,
    cameraKeys: [{at: 0.8, ...LOOP_WIDE_LOW}, {at: W(i, 'until'), ...LOOP_WIDE_LOW}, {at: r2(W(i, 'until') + 0.7), framing: 'yard'}],
    heatPump: {level: v([[r2(pull - 0.6), 1.5], [pull, 1.2]]), cutoff: {at: W(i, 'most')}},
    thermo: {air: {f: v([[W(i, 'colder,'), -6], [r2(W(i, 'colder,') + 0.7), -9]])}},
    snow: {density: 1.3},
    you: {gestures: [{pose: 'turn-to', at: -1, target: HEATER_LOOK}, {pose: 'hunch', at: W(i, 'less heat')}]},
  });
}

// 13 · newer heat pumps shut off between 5 above and 13 below: the band on the thermometer
{
  const i = 13;
  add(
    {
      framing: 'thermo',
      cameraKeys: [into(0.7, 'thermo')],
      heatPump: {run: 0, level: 1.2, grilleSnow: v([[W(i, 'heat pumps,'), 0], [r2(W(i, 'heat pumps,') + 2.6), 1]])},
      thermo: {
        air: {
          f: v([[W(i, 'happen'), -9], [r2(W(i, 'happen') + 0.3), -10]]),
          band: {
            from: 5,
            to: -13,
            draw: v([[W(i, 'between'), 0], [r2(W(i, 'between') + 0.5), 1]]),
            ends: [v([[W(i, '5 above'), 0], [r2(W(i, '5 above') + 0.2), 1]]), v([[W(i, '13 below'), 0], [r2(W(i, '13 below') + 0.2), 1]])],
          },
        },
      },
      snow: {density: 1.3},
      you: {gestures: [{pose: 'hunch', at: -1}]},
    },
    [callout(i, 'SHUT-OFF', 'Newer: 5°F to −13°F', T('between', S[12]) - 0.2, S[13] - 0.2, 0.612, 0.534, -30, -350, 'side', 1.4)],
  );
}

// 14 · backup heat takes over: panel → strips, the blower, warm air back up
{
  const i = 14;
  add({
    framing: 'basement',
    cameraKeys: [into(0.6, 'basement')],
    heatPump: {run: 0, level: 1.2, grilleSnow: 1},
    airHandler: {
      stripFeed: {at: W(i, 'heat,'), drawFor: 0.3},
      strips: v([[W(i, 'there'), 0], [r2(W(i, 'there') + 0.35), 1]]),
      blower: v([[W(i, 'any,'), 0], [r2(W(i, 'any,') + 0.35), 1]]),
    },
    // off-frame reset (F3, N9), after "takes over": the air thermometer back to 30°F, the band gone
    thermo: {air: {f: v([[r2(W(i, 'over.') + 0.3), -10], [r2(W(i, 'over.') + 1.0), 30]]), band: {from: 5, to: -13, draw: v([[r2(W(i, 'over.') + 0.3), 1], [r2(W(i, 'over.') + 0.8), 0]]), ends: [1, 1]}}},
    snow: {density: 1.3},
    you: {gestures: [{pose: 'hunch', at: -1}]},
  });
}

// 15 · the EV: a plain heater that makes heat, a heat pump that moves it. Off-frame the house resets to frame 0's state
{
  const i = 15;
  const heater = W(i, 'heater that');
  const orA = W(i, 'or a heat');
  add({
    framing: 'nose',
    cameraKeys: [into(1.0, 'drive'), ...glide(W(i, 'with a plain'), 0.6, 'drive', 'cabin'), ...glide(orA, 0.7, 'cabin', 'nose')],
    // off-frame reset (F3, N9): the strips off while we're at `drive`, the pump back on while we're at `cabin`
    heatPump: {run: v([[0, 0], [r2(W(i, 'heater that') + 0.1), 0], [r2(W(i, 'heater that') + 1.0), 1]]), level: 2.5, grilleSnow: v([[W(i, 'heater that'), 1], [r2(W(i, 'heater that') + 0.6), 0]])},
    airHandler: {strips: v([[1.2, 1], [2.2, 0]]), stripFeed: {at: -1, fadeAt: 1.2, fadeFor: 1.0}},
    snow: {density: v([[0, 1.3], [2.0, 1]])},
    you: {gestures: [{pose: 'hunch', at: -1}, {pose: 'scroll', at: 3.0}]},
    ev: {
      hvac: {
        kind: 'electric',
        on: v([[W(i, 'two ways'), 0], [r2(W(i, 'two ways') + 0.4), 1]]),
        heat: v([[heater, 0], [r2(heater + 0.4), 1], [orA, 1], [r2(orA + 0.6), 0]]),
        feed: {at: heater, drawFor: 0.6, fadeAt: orA},
      },
      heatPump: {at: W(i, 'heat pump'), drawFor: 0.6, flowAt: W(i, 'moves it')},
    },
  });
}

// 16 · back to the house, landing on frame 0 at the last frame (the loop)
{
  const i = 16;
  const lastT = r2((N_FRAMES - 1 - Math.round(S[15] * FPS)) / FPS);
  add({
    framing: 'house',
    cameraKeys: [{at: 1.0, ...HOUSE0, distance: 42.0}, {at: lastT, ...HOUSE0, ease: 'sine'}],
    heatPump: {intakePulses: [W(i, 'move')]},
    ev: {
      hvac: {kind: 'electric', on: v([[0, 1], [1.0, 0]]), heat: 0, feed: null},
      // the EV's heat pump draws out while we glide away (it shows at the edge of `house`)
      heatPump: {at: -1, drawFor: 0.6, outAt: 0.3},
    },
    loopEnd: true,
  });
}

// ------------------------------------------------------------------ sound (ev-winter's `BEDS` pattern)

/**
 * Measured with the bundled ffmpeg `loudnorm` (integrated LUFS; beds measured looped): voice −22.47, music −14.64
 * (owner-approved, 91 s, soft piano and pad), night −28.44 (`sfx:night --crickets 0 --seconds 20`: winter wind, no
 * crickets), unit-fan −30.44 (`sfx:cabfan --seconds 8`: the outdoor unit's fan), compressor −34.36 (`sfx:pump`: the
 * fixed 72 Hz hum), blower −32.41 (`sfx:heaterfan --seconds 7`: the air handler's blower and the air up the trunk),
 * heater-fan −32.40 (`sfx:heaterfan`), room −30.43 (`sfx:cabfan --seconds 11`: room tone, played very low),
 * heater-click −28.65 (`sfx:heater`), relay −29.47 (`sfx:contactor --pitch 1.3`: the strips' relay), ev-blower −32.40
 * and ev-hum −34.36 (copied from ev-winter: the EV's HVAC blower and its heat pump's compressor).
 * volume = (voice − dB under) − file. Night 25 under, the unit's fan 28 and compressor 27, blowers 26–27, room tone 32,
 * one-shots 20. Physical sounds only; the orange, the cards and the thermometers make none. The seam: the night bed,
 * the fan and the compressor run at frame 0 and on the last frame alike (0.15 s edges), the music fades at both ends.
 */
const VOICE_LUFS = -22.47;
const vol = (under: number, lufs: number) => r2(VOICE_LUFS - under - lufs);
const BEDS = {
  night: {name: 'night', volume: vol(25, -28.44)}, // −19.03: under the whole video
  fan: {name: 'unit-fan', volume: vol(28, -30.44)}, // −20.03: the outdoor unit while it runs
  compressor: {name: 'compressor', volume: vol(27, -34.36)}, // −15.11
  blower: {name: 'blower', volume: vol(27, -32.41)}, // −17.06: the air handler (scenes 7, 14)
  heaterFan: {name: 'heater-fan', volume: vol(26, -32.4)}, // −16.07: the space heater
  room: {name: 'room', volume: vol(32, -30.43)}, // −24.04: room tone, inside framings only
  evBlower: {name: 'ev-blower', volume: vol(27, -32.4)}, // −17.07
  evHum: {name: 'ev-hum', volume: vol(27, -34.36)}, // −15.11
} as const;
type Bed = keyof typeof BEDS;
/** Music: 9 dB under the voice from frame 0, no duck, fading to silence on the last frame (the seam). */
const MUSIC = {level: vol(9, -14.64), duckDb: 0, startAt: 0, fadeIn: 1.5, fadeOut: 1.5} as const; // −16.83
const SHOT = {
  click: {name: 'heater-click', volume: vol(20, -28.65)}, // −13.82
  relay: {name: 'relay', volume: vol(20, -29.47)}, // −13.0
} as const;

const SEC_END = N_FRAMES / FPS;
const CUT_FADE = 0.15;
/** Bed spans (video seconds), split into one looped overlay per scene; a copy meeting a cut fades by `CUT_FADE` only. */
type Span = {beds: Bed[]; from: number; to: number; fade: number};
const RESTART = r2(T('degrees,', S[9]) + 0.6); // scene 10: the fan restarts
const CUTOFF = T('most', S[11]); // scene 12: the fan winds down over 1.0 s
const RESTART2 = r2(T('heater that', S[14]) + 0.3); // scene 15: back on, off-frame
const SPANS: Span[] = [
  // the heat pump: frame 0 → the space heater; again from 40°F to the shut-off; again off-frame for the loop
  {beds: ['fan', 'compressor'], from: 0, to: S[8], fade: CUT_FADE},
  {beds: ['fan', 'compressor'], from: RESTART, to: S[11], fade: 0.5},
  {beds: ['fan', 'compressor'], from: S[11], to: r2(CUTOFF + 1.0), fade: 0.6},
  {beds: ['fan', 'compressor'], from: RESTART2, to: SEC_END, fade: 0.8},
  // inside: room tone where the camera is in the house
  {beds: ['room'], from: S[1], to: r2(T('hold any', S[1]) + 0.4), fade: 0.6},
  {beds: ['room'], from: r2(T('and heat always', S[2]) + 0.4), to: S[3], fade: 0.6},
  {beds: ['room'], from: S[6], to: S[7], fade: 0.6},
  {beds: ['room'], from: S[8], to: S[9], fade: 0.6},
  {beds: ['room'], from: r2(T('which still', S[10]) + 0.3), to: S[11], fade: 0.6},
  {beds: ['room'], from: S[13], to: S[14], fade: 0.6},
  // the air handler's blower and the air up the trunk
  {beds: ['blower'], from: r2(T('so it', S[6]) - 0.1), to: S[7], fade: 0.6},
  {beds: ['blower'], from: T('any,', S[13]), to: S[14], fade: 0.5},
  // the space heater's fan, from the switch to its power-off at 40°F
  {beds: ['heaterFan'], from: r2(T('heater', S[8]) + 0.05), to: r2(S[9] + 0.3), fade: 0.3},
  // the EV: its blower from "two ways", its heat pump's compressor from "moves it" until it draws out
  {beds: ['evBlower'], from: T('two ways', S[14]), to: r2(S[15] + 0.6), fade: 0.4},
  {beds: ['evHum'], from: T('moves it', S[14]), to: r2(S[15] + 0.9), fade: 0.4},
];
type Shot = {shot: keyof typeof SHOT; t: number};
const SHOTS: Shot[] = [
  {shot: 'click', t: T('heater', S[8])}, // scene 9: YOU switches the space heater on
  {shot: 'relay', t: T('heat,', S[13])}, // scene 14: the strips' relay closes as the feed arrives
];

/** The night bed: one looped overlay on scene 1, to the video's end. */
const NIGHT: OverlaySpec = {type: 'sfx', ...BEDS.night, loop: true, fade: CUT_FADE, at: 0} as OverlaySpec;

const sceneEnd = (n: number) => (n < S.length ? S[n] : SEC_END);
const sfxFor = (n: number): OverlaySpec[] => {
  const s = S[n - 1];
  const e = sceneEnd(n);
  const beds = SPANS.filter((sp) => sp.from < e - 1e-6 && sp.to > s + 1e-6).flatMap((sp) => {
    const a = Math.max(sp.from, s);
    const b = Math.min(sp.to, e);
    const carried = sp.from < s - 1e-6 || sp.to > e + 1e-6;
    return sp.beds.map(
      (bed) =>
        ({
          type: 'sfx',
          ...BEDS[bed],
          loop: true,
          fade: carried ? Math.min(sp.fade, CUT_FADE) : sp.fade,
          at: rel(n, a),
          until: rel(n, b),
        }) as OverlaySpec,
    );
  });
  const shots = SHOTS.filter((x) => x.t >= s - 1e-6 && x.t < e - 1e-6).map((x) => ({type: 'sfx', ...SHOT[x.shot], at: rel(n, x.t)}) as OverlaySpec);
  return [...beds, ...shots];
};
scenes.forEach((sc, i) => {
  const extra = [...(i === 0 ? [NIGHT] : []), ...sfxFor(i + 1)];
  if (extra.length) sc.overlays = [...(sc.overlays ?? []), ...extra];
});

export const spec: VideoSpec = {
  // Cover still (`yarn cover home-heat`, publisher's text): the house cut open on the winter night as frame 0 shows it,
  // the heat pump running, a question that gives no answer.
  cover: {
    text: 'Can 30° air\nheat your house?',
    size: 130,
    scene: 'house-slice',
    camera: HOUSE0,
    at: 3,
    props: base({framing: 'house'}),
  },
  tail: TAIL,
  music: MUSIC,
  scenes,
};
