/* eslint-disable @remotion/non-pure-animation -- false positive: `transition` keys in scene props are data, not CSS transitions */
import type {SceneName} from '../../scenes';
import {FPS} from '../../theme';
import {CARD_FRAMES, findCue} from '../../timeline';
import type {OverlaySpec, SceneSpec, ShortSpec, Transcript, VideoSpec} from '../../types';
import {OPENING_MASKS} from './openingMasks';
import transcript from './transcript.json';

/**
 * No. 013 · Part 1 · The data center (long-form, horizontal 1920 × 1080, four chapters, four vertical Shorts).
 * From `av-script.md` draft 3 (draft 2 re-timed to the live take "a-slow", 2026-11-02; 6:54.6 of voice with the three
 * 3.9 s chapter breaks built in, plus the 12 s end-screen hold = 7:06.6).
 *
 * Sets (av-script § 4): DC = `datacenter-slice` (N1) · TOWN = `town-slice` (N2, with the `quincy` dressing) · LAB =
 * `section-lab` with the `heat-bench` dressing in the wide frame (N3). One hot afternoon, Day mood, no logos.
 * Orange = the heat and the warm water that carries it away (av-script's table); electricity, cold water, fresh water
 * and minerals are never orange.
 *
 * Shot numbers in the comments are av-script § 1's. Draft 3 merged the shots the real pace made shorter than ≈ 3 s
 * into their neighbour (the merged one becomes a camera key inside the scene): 3+4, 8+9, 10+11, 14+15, 18+19, 24+25,
 * 28+29, 34+35, 41+42, 45+46, 50+51, 52+53, 55+56, 62+63, 66+67, 71+72, 79+80, 83+84, 90+91, 92+93, 94+95, 96+97.
 * Shot 82 now starts on "liters of water a year" (its old cue sits 2.5 s after 81's).
 *
 * Timing: scenes start on cues. Every event inside a scene is keyed to a word (`k.w('...')`, seconds into the scene
 * of that word's start; `k.e` its end) or to a plain offset into the scene. After a re-record nothing here needs a
 * new number unless a cue's wording changes.
 *
 * DC state carry: the scene keeps no state across cuts (beyond fan and meter turns), so `shot()` carries every DC
 * scene's end state into the next DC scene (`dcCarry` / `dcEndState`, below): tracks continue at their last value,
 * events shift into the past, a finished `roofSwap` becomes `roof`. A scene's own keys always win, so a deliberate
 * reset (shot 10's rewind, shot 90's towers again) is written in that scene. Camera, transition and one-off keys
 * (technician, split, basinRipple, lineGlintAt) never carry.
 *
 * Prop vocabulary these entries assume (from the § 4 briefs; the scene-builder may rename, and the spec follows):
 *  Shared  mood · transition · follow {direction} · glide (s) · framing (named start framing) · cameraKeys [{at,
 *          framing, ease?}] (arrive at a named framing `at` s into the scene) · push · drift. Every `[{at, v}]` list
 *          is a key track (eased between keys, held after the last; a key at ≤ 0 is the state the scene opens in).
 *          Framing names resolve per format: in a Short the same name gives the 9:16 framing.
 *  DC      roof 'towers'|'dry' · roofSwap {at, to} · towerCut (s the tower's near face cuts away; ≤ 0 = open) ·
 *          fans · plume · heat {racks, ai} (shimmer 0..1) · haze · technician {walkAt?, pullAt?} · hotAir {from} ·
 *          route {drawAt} (the orange coil → riser → tower route) · xray {part, at} · lap {at, every, laps} ·
 *          minerals · mineralFall · biofilm · pipeCut {scale, corrosion} · jars {at} · controller {needle,
 *          setPoint} (cycles) · dosing {from} · blowdown (stream 0..1) · makeup · drain {drawAt?, pulseEvery?} ·
 *          split {inAt, vaporAt, drainAt} · transformers [{at, n, kind}] · lineDoubleAt · elecMeter · waterMeter ·
 *          fillHose {connectAt, fullAt, capAt}. Anchors: fins, stream, valve, fill, basin, hose, pipe, minerals.
 *  TOWN    dressing 'main'|'quincy' · stack (vertical: stacked sections) · dc {roof, plume, fans} · carAt · fence
 *          {lookAt} · mainFlow {from} · waterMeter · windows {at, every} · houseField · kitchen {tapAt} · you {at,
 *          walkAt?, lookAt?, turnAt?} · sewer {from, every} · drain {pulseAt?, pulseEvery?} · gate {open, backupAt} ·
 *          sampler {fillAt} · gauges {settleAt} · riverPlume · fork {at, stubAt} · quincy {blowdownAt, limeAt,
 *          sludgeAt, returnDrawAt, pondFrom, pulseEvery} · plant {plume, pathAt} · drops {dcAt, plantAt, n, every} ·
 *          lineGlintAt. Anchors: gate, youSpot.
 *  LAB     dressing 'heat-bench' · jug1 {boilAt} · heater {onAt} · clock {sweepAt, minutes, secs} · jug2 {warmAt,
 *          degrees} · bars {jug1, heater, jug2}. Anchors: clock, bar:jug2.
 *
 * Chapter cards (§ 11.5.1, full frame, silent): `chapters` below sets the hold and the one manual break. The timeline
 * starts each chapter's first scene (shots 37, 59, 77) at Q + 30, under the card, 2.9 s before its cue word; `S()`
 * returns that start, so their word keys (`k.w`/`k.e`) and the previous scene's `len` are measured from it.
 *
 * Real opening (§ 11.6.1, owner "keep it" 2026-11-02): `opening` plays the graded drone clip (git-ignored
 * `footage/opening.mp4`, brand marks blurred by `OPENING_MASKS`) from F0 to F96. Shot 1 is the 3D data center from
 * the start, and its camera lands at F138 (4.6 s) on `OPENING_LAND`, the house angle with the building at the clip's
 * F96 screen box, which is where the reveal (scene-builder, to come: section line F54–66, wipe and fall-away F66–96,
 * dolly-zoom and angle glide F96–138) must arrive. Until the reveal exists, F96 is a hard switch from clip to 3D.
 * Known issue (scene-builder): the opening layer sits above the scenes, so it hides the title block until F96.
 *
 * Illustrative (🎭, for the publisher's line): av-script § 7.
 */


// ---------------------------------------------------------------- word times

const WORDS = (transcript as Transcript).words;
const r2 = (x: number) => Math.round(x * 100) / 100;

/** Each scene's cue (av-script shot number → first words as spoken). Resolved in order, so a repeated phrase lands right. */
const CUES: [number, string][] = [
  // ch. 1
  [1, 'Towns across the US'],
  [3, 'A big data center can use up'],
  [5, 'Most of it leaves through the roof'],
  [6, "To see why, we'll follow the heat"],
  [7, 'on a hot afternoon'],
  [8, 'That heat starts with power'],
  [10, 'A data center used to need a few megawatts'],
  [12, 'Inside, the average server rack'],
  [13, "But some racks of today's AI chips"],
  [14, 'Nearly all that electricity turns into heat'],
  [16, 'At many data centers, including this one'],
  [17, 'Look at the back of this rack'],
  [18, 'The hot air passes over coils of cold water'],
  [20, 'Pipes take the warmed water up'],
  [21, 'Inside the tower, the water rains down'],
  [22, 'On each trip down, a small part'],
  [23, 'and as it does, it takes heat away'],
  [24, 'Each gallon that evaporates'],
  [26, 'Warm that gallon by 10 degrees instead'],
  [27, "That's why towers let the water evaporate"],
  [28, 'Data centers use the most water in hot weather'],
  [30, 'Over a whole year, a typical site'],
  [31, 'pulled in about 44 million gallons'],
  [32, "That's about what 400 American families"],
  [33, 'And most of the water those sites'],
  [34, 'Back in the tower, only part'],
  [36, "So why can't the tower keep sending"],
  // ch. 2
  [37, "The cooling tower on this data center's roof"],
  [38, 'sending the same water around the loop'],
  [39, 'Every time some of that water evaporates'],
  [40, 'and the calcium, magnesium and silica'],
  [41, 'The loop water holds more and more minerals'],
  [43, 'Many towers run at two to four cycles'],
  [44, 'which means up to four times the minerals'],
  [45, 'If the cycles go too high'],
  [47, 'The minerals also speed up corrosion'],
  [48, 'And the warm, wet tower is an easy place'],
  [49, 'so pumps add chemicals to the loop'],
  [50, 'To keep the minerals in check, a valve drains off'],
  [52, "Fresh water replaces what's drained"],
  [54, 'In all, at four cycles'],
  [55, 'Going from three cycles to six'],
  [57, 'That drained water carries the minerals'],
  [58, 'so why not let it run into the nearest river?'],
  // ch. 3
  [59, 'At a data center like this one'],
  [60, "What's left is the drained water"],
  [61, "to the city's wastewater plant"],
  [62, 'Piping that water straight into a river'],
  [64, 'When Ohio proposed a permit'],
  [65, 'The Clean Water Act behind those permits'],
  [66, 'next to things like sand and rock'],
  [68, 'one town in Washington State'],
  [69, 'In Quincy, the city cleans the drained water'],
  [70, 'and pipes it back for the towers'],
  [71, 'The minerals the city removes'],
  [73, 'Microsoft agreed to cover'],
  [74, "The EPA's case study puts the water saving"],
  [75, 'Even in Quincy, the towers still send water'],
  [76, 'Could a data center be cooled'],
  // ch. 4
  [77, 'This data center could skip evaporation'],
  [78, "They work like a car's radiator"],
  [79, "Microsoft's newest design works this way"],
  [81, 'The company says each data center'],
  [82, 'liters of water a year'],
  [83, 'But while air-cooled machines use no cooling water'],
  [85, 'For its new design, Microsoft says'],
  [86, 'Either way, that extra electricity'],
  [87, 'and making electricity uses water too'],
  [88, 'Across the US in 2023, Berkeley Lab found'],
  [89, 'took about 12 times the water'],
  [90, 'Back on the roof this afternoon'],
  [92, 'This data center can keep that water out of the air'],
  [94, 'And part of the water this data center saves'],
  [96, 'The next time your town argues'],
  [98, 'Part 2 follows that electricity'],
];

const CUE: Record<number, string> = {};
const IDX: Record<number, number> = {};
{
  let cursor = 0;
  for (const [n, cue] of CUES) {
    cursor = findCue(WORDS, cue, cursor);
    CUE[n] = cue;
    IDX[n] = cursor;
  }
}
const ORDER = CUES.map(([n]) => n);
/** Word index of each chapter's first word, from 2 on (those scenes start under the chapter card). */
const CHAPTER_FIRST = new Set(((transcript as Transcript).chapters ?? []).slice(1).map((c) => c.word));
/**
 * Video seconds where shot `n` starts: its cue word, or, for a chapter's first scene, Q + 30 frames under the card
 * (Q = the frame the previous word ends), exactly as `resolveTimeline` / `chapterCardFrames` place it.
 */
const S = (n: number) =>
  CHAPTER_FIRST.has(IDX[n])
    ? (Math.round(WORDS[IDX[n] - 1].end * FPS) + CARD_FRAMES.sceneAt) / FPS
    : WORDS[IDX[n]].start;
/** Speech end + the 12 s end-screen hold (the video's last frame). */
const VIDEO_END = WORDS[WORDS.length - 1].end + 12;
/** Index of a phrase's last word, searched from shot `n`'s cue. */
const lastOf = (cue: string, n: number) => findCue(WORDS, cue, IDX[n]) + cue.split(/\s+/).filter(Boolean).length - 1;

/** Word keys for one scene: seconds into the scene. */
type Keys = {
  /** Start of the phrase's first word (searched from the scene's cue). */
  w: (cue: string) => number;
  /** End of the phrase's last word. */
  e: (cue: string) => number;
  /** The scene's length in seconds (to the next scene's cue, or the video's end). */
  len: number;
};
const keysFor = (n: number): Keys => {
  const i = ORDER.indexOf(n);
  const next = ORDER[i + 1];
  return {
    w: (cue) => r2(WORDS[findCue(WORDS, cue, IDX[n])].start - S(n)),
    e: (cue) => r2(WORDS[lastOf(cue, n)].end - S(n)),
    len: r2((next === undefined ? VIDEO_END : S(next)) - S(n)),
  };
};

// ---------------------------------------------------------------- staging helpers

const DAY = {mood: 'day'} as const;
const CONTINUE = {transition: 'continue'} as const;
const glide = (s = 1.0) => ({transition: 'glide', glide: s}) as const;
const SLIDE = {transition: 'slide'} as const;
const follow = (direction: 'down' | 'up' | 'left' | 'right') => ({transition: 'follow', follow: {direction}}) as const;

/** A camera key: arrive at the named framing `at` s into the scene (cubic in-out from the previous key). */
const fk = (at: number, framing: string, ease?: 'out' | 'inOut' | 'sine') => ({at: r2(at), framing, ...(ease ? {ease} : {})});
/**
 * Where the real-to-section reveal lands (F138, 4.6 s): the house angle (§ 8), the DC block at the clip's F96 screen box
 * (main box ≈ x 456–1250, y 310–690 of 1920 × 1080: ≈ 42 % of the width, centred ≈ x 850, y 500). Distance from the
 * block's projected width (≈ 15.2 m at 28° yaw) over 26° across; look shifted so the block sits left of centre and a
 * touch high. Tune on the F138 still against the clip's last real frame.
 */
const OPENING_LAND = {look: [2.0, 9.6, 0] as [number, number, number], distance: 88};
const OPENING_LAND_AT = 138 / 30;
/**
 * The whole building with its ground block and plume, framed right of centre so the captions (bottom left) fall on the
 * yard (stills 2026-11-02: the `wide` preset cut off the meter, the drain and the plume). Horizontal only: scenes using
 * it carry a `vertical` camera with a named framing.
 */
const WIDE_ALL = {look: [-1.5, 7.5, 0] as [number, number, number], distance: 96};
/** Arrive at WIDE_ALL `at` s into the scene (log distance, cubic in-out). */
const wideAll = (at: number) => ({at: r2(at), ...WIDE_ALL, log: true});
const V_WIDE = {cameraKeys: [fk(1.0, 'wide')]};
/**
 * Short 2's frame 0 and its loop (9:16): the tower cut open **below** the title block (the `towerValve` preset put the
 * block over the tower's inside, still 2026-11-02) and the blowdown valve low in the frame, under the captions.
 */
const TOWER_VALVE_V = {look: [3.9, 8.0, -1.4] as [number, number, number], distance: 43};
/** Shot 50 in 9:16: the valve and its stream lifted above the caption band. */
const VALVE_V = {look: [5.2, 0.9, -2.6] as [number, number, number], distance: 9.5};
/**
 * Short 2's standing state (9:16 only): the hook shows the tower already draining a trickle ("why does it still drain
 * some away?"), so every Short 2 scene keeps it (blowdown 0.4, the drain path drawn) until shot 50 opens the valve; the
 * hook and the loop match.
 */
const SHORT2_V = {blowdown: [{at: 0, v: 0.4}], drain: {drawAt: -60}};
/** The av-script shots that play in Short 2 before the valve opens (they take SHORT2_V in 9:16). */
const SHORT2_SHOTS = new Set([39, 40, 41, 43, 44, 45, 47, 48, 49]);
/**
 * Framings set in the spec after the full stills pass (2026-11-02). Horizontal ones (`_H`) are used in scenes outside the
 * Shorts or carry a `vertical` camera with the named preset; `_V` ones are 9:16 only.
 */
/** Shot 60: the sewer main with the house laterals joining (the preset at 15 was an abstract close-up of cut lines). */
const SEWER_H = {look: [13.6, -1.2, 2.4] as [number, number, number], distance: 30};
/** Shots 62–64: the outfall gate with the sampler and its three gauges in frame (the preset cut the gauges at the top). */
const OUTFALL_H = {look: [84.0, 0.5, 1.5] as [number, number, number], distance: 22};
/** Shots 65–66: the river cut with the warm plume in frame (the preset showed only the bed, the plume off the top). */
const RIVERBED_H = {look: [88.6, -1.6, 0.6] as [number, number, number], distance: 22};
/** Shots 75–76: Quincy's towers with the plume above them ("still send water into the air"). */
const QUINCY_ROOF_H = {look: [1.4, 15.5, -1.0] as [number, number, number], distance: 40};
const QUINCY_PLUME_H = {look: [2.4, 16.5, -0.9] as [number, number, number], distance: 28};
/** Shot 77 after the swap: the low dry coolers in frame (the towers' `roof` framing left them under the captions). */
const ROOF_DRY_H = {look: [1.4, 10.2, -1.0] as [number, number, number], distance: 34};
/** Short 4's frame 0 and loop (9:16): the dry coolers mid-frame, above the captions. */
const ROOF_DRY_V = {look: [1.2, 11.2, -1.0] as [number, number, number], distance: 30};
/** Shots 8–11: the yard's transformers above the captions (the `yard`/`yardWide` presets sat them under the caption band). */
const YARD_H = {look: [-12.5, 1.4, -0.6] as [number, number, number], distance: 34};
const YARD_WIDE_H = {look: [-9.5, 3.0, -0.6] as [number, number, number], distance: 62};
/** Shot 64: a slow push across the "Three limits" hold (the camera sat still for ≈ 3.7 s). */
const OUTFALL_PUSH_H = {look: [83.5, 0.4, 1.5] as [number, number, number], distance: 20};
/** Shot 98, the end hold: plant, line and DC inside the left ≈ 55 % (x ≤ 1056), the right half free for the end screen. */
const END_HOLD_H = {look: [6.5, 16, -6] as [number, number, number], distance: 650};
/** Short 3's frame 0 and loop (9:16): the river framing nudged down so no prop of the section above shows at the top edge. */
const RIVER_V = {look: [11, 2.0, 0] as [number, number, number], distance: 104};
/** Shot 87: the power plant above the captions, room for its plume. */
const PLANT_TEASE_H = {look: [-112, 20, -2] as [number, number, number], distance: 205};
/** A custom camera key: arrive at `f` `at` s into the scene (log distance for long pulls). */
const ck = (at: number, f: {look: [number, number, number]; distance: number}, log = false) => ({at: r2(at), ...f, ...(log ? {log: true} : {})});

/** A key track value. */
const kv = (at: number, v: number) => ({at: r2(at), v});

/**
 * The 9:16 version of an overlay list (§ 11.8, vertical safe x 120–888, y 288–1248): counters move to the title
 * block's spot (x 120, top y 300), callouts keep their anchor with a shorter reach, place labels take the vertical
 * default (x 120, top y 300). Statements, tags and sfx carry over.
 */
const toVertical = (overlays: OverlaySpec[]): OverlaySpec[] =>
  overlays.map((o) => {
    if (o.type === 'counter') return {...o, x: 0.111, y: 0.156};
    if (o.type === 'callout') return {...o, dx: o.dx === undefined ? undefined : Math.round(o.dx * 0.6), dy: o.dy};
    if (o.type === 'place') return {...o, left: undefined, top: undefined};
    return o;
  });

type Staging = {
  props?: Record<string, unknown>;
  overlays?: OverlaySpec[];
  /** The 9:16 staging (§ 11.8). `props` merge over `props`; `overlays` replace the auto-converted list. */
  vertical?: {props?: Record<string, unknown>; overlays?: OverlaySpec[]};
};

// ---------------------------------------------------------------- DC state carry

type Props = Record<string, unknown>;
/** Never carried: camera, transition and per-scene events. */
const NO_CARRY = new Set([
  'cameraKeys', 'framing', 'camera', 'transition', 'follow', 'glide', 'push', 'drift', 'mood', 'location', 'startFrame',
  'cameraFrom', 'cameraGlide', 'format', 'technician', 'split', 'basinRipple', 'lineGlintAt', 'roofSwap',
]);
/** Plain-number props that are times (seconds into the scene). */
const TIME_NUMBERS = new Set(['towerCut', 'dryCut', 'tokensAt', 'lineDoubleAt']);
/** Fields of an event object that are times. */
const TIME_FIELDS = new Set(['at', 'from', 'drawAt', 'extendAt', 'closeAt', 'connectAt', 'fullAt', 'capAt', 'probeAt', 'pulseFrom', 'until']);
const isTrack = (v: unknown): v is {at: number; v: number}[] =>
  Array.isArray(v) && v.length > 0 && v.every((x) => typeof x === 'object' && x !== null && 'v' in x);
const shiftEvent = (o: Props, dt: number): Props | null => {
  const out: Props = {};
  for (const [key, val] of Object.entries(o)) {
    if (typeof val === 'number' && TIME_FIELDS.has(key)) out[key] = r2(val - dt);
    else if (isTrack(val)) out[key] = [kv(0, val[val.length - 1].v)];
    else out[key] = val;
  }
  // a stream that has stopped (`until` passed) stays stopped: drop it
  return typeof out.until === 'number' && out.until <= 0 ? null : out;
};
/** A DC scene's end state, as props for a scene starting `dt` seconds after this one did. */
const dcEndState = (p: Props, dt: number): Props => {
  const out: Props = {};
  for (const [key, val] of Object.entries(p)) {
    if (NO_CARRY.has(key) || val === undefined) continue;
    if (typeof val === 'number') out[key] = TIME_NUMBERS.has(key) ? r2(val - dt) : val;
    else if (isTrack(val)) out[key] = [kv(0, val[val.length - 1].v)];
    else if (Array.isArray(val)) out[key] = val.map((x) => (typeof x === 'object' && x !== null ? shiftEvent(x as Props, dt) : x)).filter((x) => x !== null);
    else if (typeof val === 'object' && val !== null) {
      const ev = shiftEvent(val as Props, dt);
      if (ev) out[key] = ev;
    } else out[key] = val;
  }
  const swap = p.roofSwap as {at: number; to: 'towers' | 'dry'} | undefined;
  if (swap) {
    if (swap.at - dt <= 0) out.roof = swap.to;
    else out.roofSwap = {...swap, at: r2(swap.at - dt)};
  }
  return out;
};
/** The last DC scene's props and start (video s), for the next DC scene's defaults. Filled in order by `shot()`. */
let dcCarry: {props: Props; start: number} | null = null;
/** Each DC shot's full props (carried state included), for a Short's hook scene that must open in that shot's state. */
const DC_STATE: Record<number, Props> = {};
/** Shot `n`'s opening state without its camera, transition or one-off keys (`NO_CARRY`). */
const dcStateAt = (n: number): Props => Object.fromEntries(Object.entries(DC_STATE[n] ?? {}).filter(([key]) => !NO_CARRY.has(key)));

// ---------------------------------------------------------------- sound (owner approved sfx, 2026-11-02)

/**
 * Loudness measured 2026-11-02 (ffmpeg loudnorm, integrated): voice −23.0 LUFS; tower-rain −12.0, river −33.2, cabfan
 * −30.4, pump −34.4, outdoor −32.5; music −13.7. volume = (voice − dB under) − file LUFS. Physical sounds only, at most two
 * beds at once, nothing new under a chapter card (beds before a card are gone by Q + 6; the chapter's beds start on its
 * first word).
 */
const BEDS = {
  // owner, after the final render (2026-11-02): "some sound effects are too loud": every bed −5 dB, the water beds −7 dB
  // (broadband water noise reads louder than its LUFS)
  tower: {name: 'tower-rain', volume: -37}, // −49, 26 under
  river: {name: 'river', volume: -16}, // −49.2, 26 under
  fan: {name: 'cabfan', volume: -17.5}, // −47.9, 25 under
  pump: {name: 'pump', volume: -14.5}, // −48.9, 26 under
  out: {name: 'outdoor', volume: -15}, // −47.5, 24.5 under
} as const;
type Bed = keyof typeof BEDS;
/** Music (take a): our own bed from frame 0, 12 dB under the voice, no duck: (−23.0 − 12) − (−13.7) = −21.2. */
const MUSIC = {level: -21.2, duckDb: 0, startAt: 0, fadeIn: 1.5} as const;

/**
 * One looping bed in one scene: from `from` (a cue, or seconds into the scene; default 0) until `until` (a cue or
 * seconds; default 0.5 s past the cut, so consecutive scenes' fades cross at the join). 1.0 s fades.
 */
const bed = (b: Bed, k: Keys, from: string | number = 0, until?: string | number): OverlaySpec =>
  ({
    type: 'sfx',
    ...BEDS[b],
    loop: true,
    fade: 1.0,
    ...(typeof from === 'string' ? {cue: from} : {at: from}),
    until: until ?? r2(k.len + 0.5),
  }) as OverlaySpec;
/** Before a chapter card: gone by Q + 6 (the next scene starts at Q + 30, so 0.8 s before this scene's end). */
const beforeCard = (k: Keys) => r2(k.len - 0.8);

/** Beds per av-script shot (tower water, river, fan hum, pump hum, outdoor bed). */
const SFX: Record<number, (k: Keys) => OverlaySpec[]> = {
  // ch. 1 (the outdoor bed under the real footage from frame 0)
  1: (k) => [bed('out', k)],
  3: (k) => [bed('out', k)],
  5: (k) => [bed('tower', k), bed('fan', k)],
  6: (k) => [bed('out', k)],
  7: (k) => [bed('fan', k)],
  8: (k) => [bed('out', k)],
  10: (k) => [bed('out', k)],
  12: (k) => [bed('fan', k)],
  13: (k) => [bed('fan', k)],
  14: (k) => [bed('fan', k)],
  16: (k) => [bed('fan', k)],
  17: (k) => [bed('fan', k)],
  18: (k) => [bed('fan', k)],
  20: (k) => [bed('pump', k, 0, 'cooling tower'), bed('tower', k, 'cooling tower')],
  21: (k) => [bed('tower', k), bed('fan', k)],
  22: (k) => [bed('tower', k), bed('fan', k)],
  23: (k) => [bed('tower', k), bed('fan', k)],
  27: (k) => [bed('tower', k), bed('fan', k)],
  28: (k) => [bed('tower', k), bed('out', k)],
  30: (k) => [bed('out', k)],
  31: (k) => [bed('out', k)],
  32: (k) => [bed('out', k)],
  33: (k) => [bed('out', k)],
  34: (k) => [bed('tower', k), bed('fan', k)],
  36: (k) => [bed('tower', k, 0, beforeCard(k))],
  // ch. 2
  37: (k) => [bed('tower', k, CUE[37])],
  38: (k) => [bed('out', k)],
  39: (k) => [bed('tower', k)],
  40: (k) => [bed('tower', k)],
  41: (k) => [bed('tower', k, 0, 'and engineers'), bed('pump', k, 'and engineers')],
  43: (k) => [bed('pump', k)],
  44: (k) => [bed('pump', k)],
  45: (k) => [bed('pump', k)],
  47: (k) => [bed('pump', k)],
  48: (k) => [bed('tower', k)],
  49: (k) => [bed('pump', k)],
  50: (k) => [bed('pump', k)],
  52: (k) => [bed('tower', k)],
  54: (k) => [bed('out', k)],
  55: (k) => [bed('pump', k)],
  57: (k) => [bed('pump', k)],
  58: (k) => [bed('pump', k, 0, beforeCard(k))],
  // ch. 3
  59: (k) => [bed('out', k, CUE[59])],
  60: (k) => [bed('out', k)],
  61: (k) => [bed('out', k), bed('pump', k)],
  62: (k) => [bed('river', k), bed('out', k)],
  64: (k) => [bed('river', k)],
  65: (k) => [bed('river', k)],
  66: (k) => [bed('river', k)],
  68: (k) => [bed('out', k)],
  69: (k) => [bed('out', k), bed('pump', k)],
  70: (k) => [bed('out', k)],
  71: (k) => [bed('out', k), bed('river', k, 'instead of')],
  73: (k) => [bed('out', k)],
  74: (k) => [bed('out', k)],
  75: (k) => [bed('tower', k), bed('out', k)],
  76: (k) => [bed('tower', k, 0, beforeCard(k))],
  // ch. 4 (tower water stops with the swap; the dry coolers' fans take over)
  77: (k) => [bed('tower', k, CUE[77], r2(k.w('by swapping') + 1.5)), bed('fan', k, r2(k.w('by swapping') + 0.8))],
  78: (k) => [bed('fan', k)],
  79: (k) => [bed('pump', k)],
  81: (k) => [bed('fan', k), bed('out', k)],
  82: (k) => [bed('out', k)],
  83: (k) => [bed('out', k), bed('fan', k)],
  85: (k) => [bed('out', k)],
  86: (k) => [bed('out', k)],
  87: (k) => [bed('out', k)],
  88: (k) => [bed('out', k)],
  89: (k) => [bed('out', k)],
  90: (k) => [bed('tower', k), bed('out', k)],
  92: (k) => [bed('tower', k, 0, r2(k.w('keep that') + 1.5)), bed('fan', k, r2(k.w('keep that') + 0.8))],
  94: (k) => [bed('out', k)],
  96: (k) => [bed('out', k)],
  // the end hold: the outdoor bed fades to silence on the last frame
  98: (k) => [{...bed('out', k, 0, r2(k.len - 0.05)), fade: 2.5} as OverlaySpec],
};

/** A Short's hook scene bed, stopping with the hook (its last word + the 0.35 s gap). */
const hookBed = (n: number, b: Bed): OverlaySpec => {
  const hook = (transcript as Transcript).hooks?.[String(n)]?.words ?? [];
  const end = hook.length ? hook[hook.length - 1].end : 7;
  return {type: 'sfx', ...BEDS[b], loop: true, fade: 1.0, at: 0, until: r2(end + 0.35 + 0.5)} as OverlaySpec;
};

/** One scene: shot `n`'s cue, its set, and its staging made from the scene's word keys. Every scene gets a `vertical`. */
const shot = (n: number, scene: SceneName, make: (k: Keys) => Staging): SceneSpec => {
  const k = keysFor(n);
  const st = make(k);
  // a bed that the next scene doesn't continue ends at the cut (no third bed during a join); one it continues
  // overlaps the cut by 0.5 s so the two fades cross
  const next = ORDER[ORDER.indexOf(n) + 1];
  const nextNames = new Set((next !== undefined ? (SFX[next]?.(keysFor(next)) ?? []) : []).map((o) => (o as {name?: string}).name));
  const sfx = (SFX[n]?.(k) ?? []).map((o) =>
    o.until === r2(k.len + 0.5) && !nextNames.has((o as {name?: string}).name) ? {...o, until: k.len} : o,
  );
  const overlays = [...(st.overlays ?? []), ...sfx];
  let props: Props = {...DAY, ...st.props};
  if (scene === 'datacenter-slice') {
    const carried = dcCarry ? dcEndState(dcCarry.props, S(n) - dcCarry.start) : {};
    props = {...DAY, ...carried, ...st.props};
    dcCarry = {props, start: S(n)};
    DC_STATE[n] = props;
  }
  return {
    scene,
    cue: CUE[n],
    props,
    ...(overlays.length ? {overlays} : {}),
    vertical: {
      props: {...(SHORT2_SHOTS.has(n) ? SHORT2_V : {}), ...(st.vertical?.props ?? {})},
      ...(st.vertical?.overlays ? {overlays: [...st.vertical.overlays, ...sfx]} : overlays.length ? {overlays: toVertical(overlays)} : {}),
    },
  };
};

/** TOWN in 9:16: the sheet's sections stack (houses over the main and sewer cut; the plant over the DC). */
const TOWN_V = {stack: true} as const;

// ---------------------------------------------------------------- overlays

const counter = (cue: string, o: Omit<Extract<OverlaySpec, {type: 'counter'}>, 'type' | 'cue'>): OverlaySpec => ({
  type: 'counter',
  cue,
  ...o,
});
const callout = (cue: string, title: string, anchor: string, o: {sub?: string; dx?: number; dy?: number; until?: string | number} = {}): OverlaySpec => ({
  type: 'callout',
  cue,
  title,
  anchor,
  dx: o.dx ?? 150,
  dy: o.dy ?? -110,
  ...(o.sub ? {sub: o.sub} : {}),
  ...(o.until !== undefined ? {until: o.until} : {}),
});

// ---------------------------------------------------------------- the scenes

const scenes: SceneSpec[] = [
  // ════════════════════════════════════ Chapter 1: Where does a data center's water go? (0:00 → Q 2:29.6)

  // 1+2 · F0–F96 the real drone shot (the `opening` layer above the scenes); under it, and from F96 on screen, the 3D
  // data center at the reveal's landing framing (OPENING_LAND at F138), then a log glide down the cut face to the
  // street meter on "complaints is water". The town of line 1 is the real city behind the building in the clip.
  shot(1, 'datacenter-slice', (k) => ({
    props: {
      cameraKeys: [
        {at: 0, ...OPENING_LAND, distance: OPENING_LAND.distance * 1.03},
        {at: r2(OPENING_LAND_AT), ...OPENING_LAND, ease: 'sine' as const},
        {at: r2(Math.max(OPENING_LAND_AT + 0.6, k.w('complaints'))), ...OPENING_LAND, distance: OPENING_LAND.distance * 0.98},
        {...fk(k.len - 0.3, 'meter', 'inOut'), log: true},
      ],
      roof: 'towers',
      fans: [kv(0, 0.7)],
      plume: [kv(0, 0.8)],
      heat: {ai: [kv(0, 0.1)]},
      waterMeter: [kv(0, 1)],
      serviceFlow: {from: -3},
    },
    overlays: [
      {
        type: 'title',
        at: 0,
        question: 'Where does all that water go?',
        number: 'No. 013',
        title: 'Part 1 · The Data Center',
        time: '3:12 PM',
        // up until 0.8 s after "So where does all that water go?", carried across shots 3+4
        hold: r2(WORDS[lastOf('So where does all that water go', 1)].end + 0.8),
        carry: true,
      },
    ],
  })),

  // 3+4 · the street meter spinning fast, then the crane up the cut face to the towers on "So where does…"
  shot(3, 'datacenter-slice', (k) => ({
    props: {
      ...CONTINUE,
      cameraKeys: [fk(0.9, 'meter'), fk(k.w('So where') + 0.2, 'meter'), {...fk(k.w('So where') + 2.4, 'roof'), log: true}],
      roof: 'towers',
      waterMeter: [kv(0, 1)],
      serviceFlow: {from: -10},
      plume: [kv(0, 0.8)],
      fans: [kv(0, 0.7)],
    },
  })),

  // 5 · close on the towers: the first orange (heat tokens in the plume)
  shot(5, 'datacenter-slice', () => ({
    props: {...CONTINUE, framing: 'roof', roof: 'towers', plume: [kv(0, 0.8), kv(2.0, 1)], fans: [kv(0, 0.7)], tokensAt: 0.4},
    overlays: [{type: 'statement', cue: 'through the roof', text: 'Through the roof,\nas vapor.', place: 'low'}],
  })),

  // 6 · glide down and back out of the plume to the data center, wide
  shot(6, 'datacenter-slice', (k) => ({
    props: {...CONTINUE, cameraKeys: [{...fk(1.2, 'wide', 'inOut'), log: true}], roof: 'towers', fans: [kv(0, 0.7)], plume: [kv(0, 1)], tokensAt: -4, heat: {ai: [kv(0, 0), kv(1.4, 0.3)]}, technician: {walkAt: k.w('heat')}},
  })),

  // 7 · crane from that rack up the riser to the roof (the payoff picture, previewed)
  shot(7, 'datacenter-slice', (k) => ({
    props: {...CONTINUE, cameraKeys: [fk(1.0, 'racks'), fk(k.len, 'roof', 'sine')], fans: [kv(0, 0.7), kv(k.w('roof'), 0.85)], heat: {ai: [kv(0, 0.3)]}},
  })),

  // 8+9 · the utility yard: one transformer, then two more slide in on "a lot more power"
  shot(8, 'datacenter-slice', (k) => ({
    props: {
      ...glide(1.0),
      framing: 'yardWide',
      cameraKeys: [ck(1.0, YARD_H, true)],
      transformers: [{at: -1, n: 1, kind: 'mid'}, {at: k.w('lot more power'), n: 2, kind: 'mid'}, {at: k.w('few years ago'), n: 3, kind: 'mid'}],
      elecMeter: [kv(0, 0.4), kv(k.w('lot more power'), 0.6), kv(k.w('few years ago'), 0.8)],
    },
  })),

  // 10+11 · rewind to one small grey transformer, then a row of big ones slides in; the line doubles
  shot(10, 'datacenter-slice', (k) => ({
    props: {
      ...CONTINUE,
      cameraKeys: [ck(1.0, YARD_H), ck(k.w("and Virginia's"), YARD_H), {...ck(k.len, YARD_WIDE_H, true), ease: 'sine'}],
      transformers: [
        {at: 0.2, n: 1, kind: 'small'},
        {at: k.w('a typical one'), n: 6, kind: 'big', every: 0.5},
      ],
      lineDoubleAt: k.w('needs more'),
      elecMeter: [kv(0, 0.2), kv(k.w('a typical one'), 0.2), kv(k.w('a hundred'), 1)],
    },
    overlays: [counter('more than a hundred', {to: 100, label: 'MW', sub2: 'MORE THAN', sub2Place: 'above', sub: 'A TYPICAL DATA CENTER NOW', duration: 1.0})],
  })),

  // 12 · into the hall: a row of ordinary racks, the technician pulls a server half out
  shot(12, 'datacenter-slice', (k) => ({
    props: {...glide(1.0), framing: 'racks', heat: {racks: [kv(0, 0), kv(k.w('8 kilowatts'), 0.3)], ai: [kv(0, 0.3)]}, technician: {pullAt: k.w('an industry')}},
    overlays: [counter('under 8 kilowatts', {to: 8, label: 'KW', sub2: 'UNDER', sub2Place: 'above', sub: 'AVERAGE RACK', duration: 0.6})],
  })),

  // 13 · glide right to the AI rack: a tall orange column, fans rev
  shot(13, 'datacenter-slice', (k) => ({
    props: {...CONTINUE, cameraKeys: [fk(1.0, 'aiRack')], heat: {racks: [kv(0, 0.3)], ai: [kv(0, 0.3), kv(k.w('120'), 1)]}, aiFans: [kv(0, 0.5), kv(k.w('120'), 1)]},
    overlays: [counter('around 120', {from: 8, to: 120, label: 'KW', sub2: 'AROUND', sub2Place: 'above', sub: 'SOME AI RACKS', duration: 0.8})],
  })),

  // 14+15 · the whole hall: power in, heat out into the hot aisle; on "more power" the AI column brightens again
  shot(14, 'datacenter-slice', (k) => ({
    props: {
      ...CONTINUE,
      cameraKeys: [fk(1.0, 'hall')],
      heat: {racks: [kv(0, 0.4)], ai: [kv(0, 1), kv(k.w('more power'), 1.2)]},
      haze: [kv(0, 0), kv(k.w('heat so'), 0.6), kv(k.w('get rid'), 1)],
    },
  })),

  // 16 · the coil wall: cold water in below (neutral), the orange route is born where the return leaves the coil
  shot(16, 'datacenter-slice', (k) => ({
    props: {...CONTINUE, cameraKeys: [fk(1.0, 'coil')], haze: [kv(0, 1)], coilFlow: {from: 0.4}, route: {drawAt: k.w('water carries'), to: 'coil'}},
  })),

  // 17 · the AI rack's back, close: orange hot-air arrows stream toward the coil; the camera trucks with them
  shot(17, 'datacenter-slice', (k) => ({
    props: {...CONTINUE, cameraKeys: [fk(0.9, 'rackBack'), fk(k.w('hot air'), 'rackBack'), fk(k.len, 'coil', 'sine')], hotAir: {from: 0, every: 0.6}, route: {drawAt: -6, to: 'coil'}},
  })),

  // 18+19 · the arrows pass the fins and leave neutral; then the X-ray of the hall wall shows the route to the riser
  shot(18, 'datacenter-slice', (k) => ({
    props: {
      ...CONTINUE,
      framing: 'coil',
      cameraKeys: [fk(k.w('and the water'), 'coil'), fk(k.w('and the water') + 1.0, 'hallWall')],
      hotAir: {from: -5, every: 0.6, coolThrough: true},
      route: {drawAt: -6, to: 'riserFoot', extendAt: k.w('carries the heat')},
      xray: {part: 'hallWall', at: k.w('carries the heat')},
    },
    overlays: [callout('coils of cold water', 'Coils', 'fins', {sub: 'COLD WATER INSIDE', until: 'and the water'})],
  })),

  // 20 · glide: crane up along the orange riser through the slab to the roof
  shot(20, 'datacenter-slice', (k) => ({
    props: {...glide(1.0), cameraKeys: [fk(0, 'riser'), fk(k.w('cooling tower'), 'roof', 'sine')], route: {drawAt: -9, to: 'towerInlet', extendAt: 0.2, extendFor: k.w('cooling tower')}},
  })),

  // 21 · the cooling tower cut open: water rains over the fill; fans pull air in through the louvers
  shot(21, 'datacenter-slice', (k) => ({
    props: {
      ...CONTINUE,
      cameraKeys: [fk(1.0, 'tower')],
      towerCut: 0.1,
      rain: {from: k.w('rains down')},
      fans: [kv(0, 0.85), kv(k.w('big fans'), 1)],
      airIn: {from: k.w('pull outside')},
      route: {drawAt: -14, to: 'towerInlet'},
    },
  })),

  // 22 · close on the fill: droplets peel off as vapor, each with a small orange heat token
  shot(22, 'datacenter-slice', (k) => ({
    props: {...CONTINUE, towerCut: -6, cameraKeys: [fk(1.0, 'fill')], vapor: {from: k.w('evaporates'), every: 0.8, tokens: true}},
  })),

  // 23 · pulled back: the falling water's orange fades top to bottom; cold water leaves the basin (neutral)
  shot(23, 'datacenter-slice', (k) => ({
    props: {...CONTINUE, towerCut: -10, cameraKeys: [fk(1.0, 'tower')], vapor: {from: -4, every: 0.8, tokens: true}, rainFade: {at: k.w('takes heat')}, returnFlow: {from: k.w("water that's")}},
  })),

  // 24+25 · LAB heat bench: jug 1 boils off and fills its heat bar; truck right to the heater and the clock's sweep
  shot(24, 'section-lab', (k) => ({
    props: {
      ...SLIDE,
      dressing: 'heat-bench',
      framing: 'jug1',
      cameraKeys: [fk(k.w('as a space'), 'jug1'), fk(k.w('as a space') + 1.2, 'heater')],
      jug1: {boilAt: 0.2},
      heater: {onAt: k.w('space heater')},
      clock: {sweepAt: k.w('in an hour'), minutes: 100, secs: 2.5},
      bars: {jug1: [kv(0.2, 0), kv(2.2, 1)], heater: [kv(k.w('in an hour'), 0), kv(k.w('in an hour') + 2.5, 1)]},
    },
    overlays: [callout('an hour and 40 minutes', '1 h 40 min', 'clock', {dx: -170, dy: -90})],
    // 9:16: the bench framed tight; the camera glides jug → heater (the same keys, the vertical framings). The label sits
    // clear of the clock face (stills: the auto-shortened reach put it on the rim)
    vertical: {props: {}, overlays: [callout('an hour and 40 minutes', '1 h 40 min', 'clock', {dx: -200, dy: -90})]},
  })),

  // 26 · back across to jug 2: its thermometer creeps 10 degrees, its bar fills a thin sliver beside jug 1's
  shot(26, 'section-lab', (k) => ({
    props: {
      ...CONTINUE,
      dressing: 'heat-bench',
      cameraKeys: [fk(1.0, 'jug2'), fk(k.w('only about') + 0.2, 'jug2'), fk(k.len, 'bench', 'sine')],
      jug2: {warmAt: 0.6, degrees: 10},
      bars: {jug1: [kv(0, 1)], heater: [kv(0, 1)], jug2: [kv(k.w('carries off'), 0), kv(k.w('a hundredth'), 0.01)]},
    },
    overlays: [callout('only about a hundredth', '≈ 1/100', 'bar:jug2', {sub: 'AS MUCH HEAT', dx: 150, dy: -120})],
    // 9:16: label left of the meter (the shortened reach put it on the meter's dark face)
    vertical: {overlays: [callout('only about a hundredth', '≈ 1/100', 'bar:jug2', {sub: 'AS MUCH HEAT', dx: -120, dy: -160})]},
  })),

  // 27 · back on DC: the tower cut open, vapor rising (Short 1 ends here and glides out to its frame 0 framing)
  shot(27, 'datacenter-slice', (k) => ({
    props: {...SLIDE, framing: 'tower', towerCut: -60, rain: {from: -60}, vapor: {from: -60, every: 0.8, tokens: true}, fans: [kv(0, 1)]},
    vertical: {
      // Short 1's last 1.0 s: glide to the hook's framing (DC 'wide'), so the Short loops (its end = last word + 1.2 s tail)
      props: {cameraKeys: [fk(0, 'tower'), fk(k.e('evaporate') + 0.2, 'tower'), fk(k.e('evaporate') + 1.2, 'wide')]},
    },
  })),

  // 28+29 · both towers on the roof: heat haze, tower 2 kicks to full, the plume thickens and pulses
  shot(28, 'datacenter-slice', (k) => ({
    props: {
      ...CONTINUE,
      cameraKeys: [fk(1.0, 'roof'), fk(k.w('so this afternoon'), 'roof'), fk(k.len, 'roofWide', 'sine')],
      towerCut: -60,
      fans: [kv(0, 0.85), kv(k.w('hot weather'), 1)],
      plume: [kv(0, 0.8), kv(k.w('Pacific'), 1), kv(k.w('working'), 1.15)],
      plumePulse: {from: k.w('so this afternoon'), every: 1.4},
    },
  })),

  // 30 · crane down the cut face to the street meter pit
  shot(30, 'datacenter-slice', (k) => ({
    props: {...CONTINUE, cameraKeys: [{...fk(k.len - 0.5, 'meter', 'sine'), log: true}], waterMeter: [kv(0, 1)], fans: [kv(0, 1)]},
  })),

  // 31 · trucking left along the service line toward the street main; the 44 million counter
  shot(31, 'datacenter-slice', (k) => ({
    props: {...CONTINUE, cameraKeys: [fk(k.len, 'serviceLine', 'sine')], waterMeter: [kv(0, 1)], serviceFlow: {from: -5}},
    overlays: [counter('44 million gallons', {to: 44, label: 'MILLION GAL / YEAR', sub: 'A TYPICAL SITE', duration: 1.0})],
  })),

  // 32 · follow left along the main into TOWN: kitchen windows light, then rows of houses fill the field behind
  shot(32, 'town-slice', (k) => ({
    props: {...follow('left'), dressing: 'main', framing: 'houses', windows: {at: 0.3, every: 0.3}, houseField: [kv(k.w('400'), 0), kv(k.w('use at home'), 1)]},
    overlays: [counter('400 American families', {to: 400, label: 'FAMILIES', sub2: 'ABOUT', sub2Place: 'above', sub: 'WATER USE AT HOME', duration: 1.0})],
    vertical: {props: {...TOWN_V}},
  })),

  // 33 · one house cut open: YOU at the kitchen sink filling a glass; a slow push holds on the kitchen (the truck along
  // the main showed only the road surface mid-move, stills 2026-11-02)
  shot(33, 'town-slice', () => ({
    props: {...CONTINUE, dressing: 'main', cameraKeys: [fk(1.0, 'kitchen')], push: 0.003, kitchen: {tapAt: 0.2}, you: {at: 0}, houseField: [kv(0, 1)]},
    overlays: [{type: 'tag', at: 0.3, who: 'you', anchor: 'youSpot'}],
    vertical: {props: {...TOWN_V}},
  })),

  // 34+35 · back in the tower: most of the rain lands in the basin; pull back, the whole loop runs (two laps)
  shot(34, 'datacenter-slice', (k) => ({
    props: {
      ...follow('up'),
      framing: 'tower',
      cameraKeys: [fk(k.w('and the rest'), 'tower'), fk(k.w('and the rest') + 1.2, 'wide')],
      towerCut: -60,
      rain: {from: -60},
      vapor: {from: -60, every: 0.8, tokens: true},
      basinRipple: {at: k.w('evaporates')},
      lap: {at: k.w('another trip'), every: 3.0, laps: 2},
    },
  })),

  // 36 · close on the basin: the loop keeps running, faint grey mineral dots appear (still moving under card 2)
  shot(36, 'datacenter-slice', (k) => ({
    props: {...CONTINUE, cameraKeys: [fk(1.0, 'basin'), fk(k.len, 'basinClose', 'sine')], towerCut: -60, rain: {from: -60}, lap: {at: -4, every: 3.0, laps: 99}, minerals: [kv(0, 0), kv(k.w('around forever'), 0.15)]},
  })),

  // ════════════════════════════════════ Chapter 2: Why don't they just reuse the water? (card Q 2:29.6, voice 2:33.5)

  // 37 · entered under card 2: follow up from the basin along the riser to the roof; a marked ring rides the loop
  shot(37, 'datacenter-slice', (k) => ({
    props: {...follow('up'), framing: 'roof', towerCut: -60, rain: {from: -60}, lap: {at: -6, every: 3.0, laps: 99}, ring: {at: k.w('already reuses')}, minerals: [kv(0, 0.15)]},
  })),

  // 38 · DC wide: the ring completes laps 1, 2, 3 (fast-forward); a tick lights on the basin wall each lap
  shot(38, 'datacenter-slice', (k) => ({
    vertical: {props: V_WIDE},
    props: {...CONTINUE, cameraKeys: [wideAll(1.0)], towerCut: -60, rain: {from: -60}, ring: {at: -4, every: 1.2, laps: 3, ticks: true, from: k.w('around the loop') - 1.2}, minerals: [kv(0, 0.15)]},
  })),

  // 39 · the fill: vapor rises clean, the grey mineral dots stay behind and fall into the basin
  shot(39, 'datacenter-slice', (k) => ({
    props: {...CONTINUE, cameraKeys: [fk(1.0, 'fill')], towerCut: -60, rain: {from: -60}, vapor: {from: -60, every: 0.8, tokens: true}, mineralFall: {from: k.w('only the water')}, minerals: [kv(0, 0.2)]},
  })),

  // 40 · the basin: the dots settle and gather, the water greys a little
  shot(40, 'datacenter-slice', (k) => ({
    props: {...CONTINUE, cameraKeys: [fk(1.0, 'basin')], towerCut: -60, rain: {from: -60}, mineralFall: {from: -4}, minerals: [kv(0, 0.25), kv(k.len, 0.45)]},
    overlays: [callout('calcium', 'Minerals', 'minerals', {sub: 'CALCIUM · MAGNESIUM · SILICA', dx: 160, dy: -120})],
  })),

  // 41+42 · each lap adds a batch of dots; then the plant room: the conductivity controller's needle climbs a band a lap
  shot(41, 'datacenter-slice', (k) => ({
    props: {
      ...CONTINUE,
      cameraKeys: [fk(k.w('and engineers'), 'basin'), fk(k.w('and engineers') + 1.2, 'plant')],
      towerCut: -60,
      lap: {at: -20, every: 1.2, laps: 99},
      minerals: [kv(0, 0.45), kv(k.w('and engineers'), 0.6)],
      controller: {needle: [kv(k.w('and engineers'), 1), kv(k.w('cycles of'), 4)]},
    },
    overlays: [counter('and engineers measure', {from: 1, to: 4, label: 'CYCLES', sub: 'OF CONCENTRATION', duration: r2(k.w('cycles of') - k.w('and engineers measure'))})],
  })),

  // 43 · the controller's needle swings between the 2 and 4 bands
  shot(43, 'datacenter-slice', (k) => ({
    props: {...CONTINUE, framing: 'plant', controller: {needle: [kv(0, 4), kv(1.0, 2), kv(2.2, 4), kv(3.4, 2.5), kv(k.len, 3.5)]}},
    overlays: [counter('two to four cycles', {to: 2, rangeTo: 4, label: 'CYCLES', sub: 'MANY TOWERS', duration: 0.4})],
  })),

  // 44 · glide down to the sample bench: the loop jar's dots multiply to four times the fresh jar's
  shot(44, 'datacenter-slice', (k) => ({
    props: {...CONTINUE, cameraKeys: [fk(1.0, 'jars')], jars: {at: k.w('four times'), multiply: 4, probeAt: k.w('of the fresh')}},
    overlays: [counter('four times the minerals', {to: 4, label: 'TIMES', sub2: 'UP TO', sub2Place: 'above', sub: 'THE MINERALS', duration: 0.6})],
  })),

  // 45+46 · a plant-room pipe cut across: scale grows inward, the flow slows; two more steps on "kettle"
  shot(45, 'datacenter-slice', (k) => ({
    props: {
      ...CONTINUE,
      cameraKeys: [fk(1.0, 'pipe')],
      pipeCut: {scale: [kv(0, 0), kv(k.w('form scale'), 0.35), kv(k.w('crust'), 0.6), kv(k.w('kettle'), 0.8)]},
    },
    overlays: [callout('scale', 'Scale', 'pipe', {dx: 170, dy: -100})],
  })),

  // 47 · along the same pipe to a cleaner section: pits bloom, the wall thins in two steps
  shot(47, 'datacenter-slice', (k) => ({
    props: {...CONTINUE, cameraKeys: [fk(1.0, 'pipeClean')], pipeCut: {scale: [kv(0, 0.8)], corrosion: [kv(0, 0), kv(k.w('corrosion'), 0.5), kv(k.w('pipes'), 1)]}},
  })),

  // 48 · the basin: a muted-olive biofilm creeps up the wall and across the fill's bottom edge
  shot(48, 'datacenter-slice', (k) => ({
    props: {...CONTINUE, cameraKeys: [fk(1.0, 'basin')], towerCut: -60, rain: {from: -60}, minerals: [kv(0, 0.6)], biofilm: [kv(0, 0), kv(k.w('bacteria'), 0.4), kv(k.len, 1)]},
  })),

  // 49 · the dosing skid: pump heads tick, clear drops fall; pull back to show the basin where the film recedes
  shot(49, 'datacenter-slice', (k) => ({
    props: {...CONTINUE, cameraKeys: [fk(1.0, 'dosing'), fk(k.w('the loop') + 0.2, 'dosing'), {...fk(k.len, 'plantUp', 'sine'), log: true}], dosing: {from: k.w('pumps')}, biofilm: [kv(0, 1), kv(k.w('the loop'), 0.2)]},
  })),

  // 50+51 · the blowdown valve: the needle crosses the set line, the actuator opens it, the orange drain path starts down
  shot(50, 'datacenter-slice', (k) => ({
    props: {
      ...CONTINUE,
      cameraKeys: [fk(1.0, 'valve')],
      controller: {needle: [kv(0, 3.5), kv(k.w('in check'), 4.2)], setPoint: [kv(0, 4)]},
      blowdown: [kv(0, 0), kv(k.w('valve drains'), 0), kv(k.w('drains off') + 0.3, 1)],
      drain: {drawAt: k.w('some of')},
    },
    // label left of the stream: on the right it reached into the watermark corner (x ≥ 1560, y ≥ 780)
    overlays: [callout('blowdown', 'Blowdown', 'stream', {dx: -170, dy: -200})],
    vertical: {
      // Short 2 ends here: the last 1.0 s glides up to the hook's framing (DC 'tower'); the callout leaves first
      props: {
        cameraKeys: [{at: 1.0, ...VALVE_V}, {at: r2(k.e('blowdown') + 0.2), ...VALVE_V}, {at: r2(k.e('blowdown') + 1.2), ...TOWER_VALVE_V, log: true}],
        // from the hook's trickle to fully open on "drains off", then back to the trickle as the camera returns to frame 0;
        // the blowdown has thinned the minerals back to the hook's level (the loop matches)
        blowdown: [kv(0, 0.4), kv(k.w('valve drains'), 0.4), kv(k.w('drains off') + 0.3, 1), kv(k.e('blowdown') + 0.2, 1), kv(k.e('blowdown') + 1.2, 0.4)],
        minerals: [kv(0, 0.6), kv(k.e('blowdown') + 0.2, 0.6), kv(k.e('blowdown') + 1.2, 0.2)],
        drain: {drawAt: -60},
      },
      overlays: toVertical([callout('blowdown', 'Blowdown', 'stream', {dx: 170, dy: -90, until: k.e('blowdown') + 0.2})]),
    },
  })),

  // 52+53 · makeup water pours in (neutral), the float rises, the dots thin; then wide: vapor up, drain down, makeup in
  shot(52, 'datacenter-slice', (k) => ({
    props: {
      ...CONTINUE,
      cameraKeys: [fk(1.0, 'basin'), fk(k.w('so the tower'), 'basin'), fk(k.w('so the tower') + 1.2, 'wide')],
      towerCut: -60,
      makeup: [kv(0, 0), kv(0.4, 1)],
      minerals: [kv(0, 0.6), kv(2.5, 0.35)],
      blowdown: [kv(0, 1)],
      drain: {drawAt: -6},
      waterMeter: [kv(0, 1)],
    },
  })),

  // 54 · DC wide, framed right: 4 arrows in at the meter → 3 rise as vapor, 1 goes down the drain
  shot(54, 'datacenter-slice', (k) => ({
    vertical: {props: V_WIDE},
    props: {...CONTINUE, cameraKeys: [wideAll(1.0)], towerCut: -60, blowdown: [kv(0, 1)], split: {inAt: 0.6, vaporAt: k.w('three quarters'), drainAt: k.w('other quarter')}},
    overlays: [
      counter('three quarters', {to: 75, label: '%', sub: 'LEAVES AS VAPOR', duration: 0.8, until: 'and the other quarter'}),
      counter('the other quarter', {to: 25, label: '%', sub: 'DRAINED', duration: 0.6}),
    ],
  })),

  // 55+56 · the controller's set point turns 3 → 6, the drain stream halves, then thins to a trickle that never stops
  shot(55, 'datacenter-slice', (k) => ({
    props: {...CONTINUE, cameraKeys: [fk(1.0, 'valve')], controller: {setPoint: [kv(0, 3), kv(k.w('to six'), 6)]}, blowdown: [kv(0, 1), kv(k.w('by about half'), 0.5), kv(k.w('but some'), 0.3)], drain: {drawAt: -10}},
    overlays: [counter('from three cycles to six', {from: 3, to: 6, label: 'CYCLES', sub: 'HALF THE DRAINED WATER', duration: 1.0})],
  })),

  // 57 · follow down along the orange drain through the slab into the cut ground, to the lateral
  shot(57, 'datacenter-slice', (k) => ({
    props: {...glide(1.0), cameraKeys: [fk(0, 'valve'), fk(k.len, 'lateral', 'sine')], blowdown: [kv(0, 0.3)], drain: {drawAt: -12, pulseEvery: 1.0}},
  })),

  // 58 · trucking right along the cut face with the drain toward the river (not yet seen); moving under card 3
  shot(58, 'datacenter-slice', (k) => ({
    props: {...CONTINUE, cameraKeys: [fk(k.len, 'lateralRight', 'sine')], drain: {drawAt: -15, pulseEvery: 1.0}},
  })),

  // ════════════════════════════════════ Chapter 3: Why not release it into a river? (card Q 4:00.4, voice 4:04.3)

  // 59 · entered under card 3: follow right along the drain into TOWN, the DC (plume up, drain down) and the river
  shot(59, 'town-slice', (k) => ({
    props: {...follow('right'), dressing: 'main', framing: 'site', dc: {roof: 'towers', plume: [kv(0, 1), kv(k.w('has already'), 1.25), kv(k.w('as vapor'), 1)]}, drain: {pulseAt: [k.w('as vapor')]}},
    vertical: {props: {...TOWN_V}},
  })),

  // 60 · the lateral joins the sewer main; neutral house flows join every 1.5 s
  shot(60, 'town-slice', () => ({
    vertical: {props: {...TOWN_V, cameraKeys: [fk(1.0, 'sewer')]}},
    props: {...CONTINUE, dressing: 'main', cameraKeys: [ck(1.0, SEWER_H)], sewer: {from: 0, every: 1.5}, drain: {pulseEvery: 1.0}},
    overlays: [{type: 'place', cue: 'down the sewer', text: 'The sewer', sub: '3:31 PM'}],
  })),

  // 61 · trucking right along the main into the wastewater plant: the clarifier's rake turns, bubbles rise
  shot(61, 'town-slice', (k) => ({
    props: {...CONTINUE, dressing: 'main', cameraKeys: [fk(k.len - 0.3, 'plant', 'sine')], sewer: {from: -4, every: 1.5}},
    vertical: {props: {...TOWN_V}},
  })),

  // 62+63 · a second pipe from the DC lot to a closed outfall gate; water backs up; close on the gate, the sampler fills
  shot(62, 'town-slice', (k) => ({
    props: {
      ...CONTINUE,
      dressing: 'main',
      cameraKeys: [fk(1.0, 'river'), fk(k.w('with limits'), 'river'), ck(k.w('with limits') + 1.0, OUTFALL_H)],
      gate: {open: [kv(0, 0)], backupAt: k.w('takes a')},
      sampler: {fillAt: k.w('limits on')},
    },
    overlays: [callout('federal permit', 'Federal permit', 'gate', {dx: -180, dy: -110})],
    vertical: {props: {...TOWN_V, drain: false, cameraKeys: [ck(1.0, RIVER_V), ck(k.w('with limits'), RIVER_V), fk(k.w('with limits') + 1.0, 'outfall')]}},
  })),

  // 64 · the outfall: OHIO, then the three gauges settle under their limit marks on the spoken words
  shot(64, 'town-slice', (k) => ({
    props: {...CONTINUE, dressing: 'main', cameraKeys: [ck(0, OUTFALL_H), {...ck(k.len, OUTFALL_PUSH_H), ease: 'sine'}], gate: {open: [kv(0, 0)]}, gauges: {settleAt: [k.w('dissolved'), k.w('chlorine'), k.w('acidity')]}},
    overlays: [
      {type: 'place', cue: 'Ohio', text: 'Ohio', until: 'the draft set'},
      callout('dissolved minerals', 'Three limits', 'gate', {sub: 'MINERALS · CHLORINE · ACIDITY', dx: -180, dy: -110}),
    ],
    vertical: {props: {...TOWN_V, drain: false, framing: 'outfall', cameraKeys: [fk(k.len, 'outfall')]}},
  })),

  // 65 · the river cut across: the gate opens a crack, a warm orange plume spreads downstream
  shot(65, 'town-slice', (k) => ({
    props: {...CONTINUE, dressing: 'main', cameraKeys: [ck(1.0, RIVERBED_H)], gate: {open: [kv(0, 0), kv(0.8, 0.15)]}, riverPlume: [kv(0.8, 0), kv(k.w('heat'), 0.7), kv(k.len, 1)]},
    // on the bank above the plume (on the plume itself the ink read at ≈ 2.5:1)
    overlays: [callout('heat as a pollutant', 'Heat', 'riverPlume', {sub: 'A POLLUTANT', dx: 60, dy: -230})],
    vertical: {props: {...TOWN_V, drain: false, cameraKeys: [fk(1.0, 'riverbed')]}},
  })),

  // 66+67 · sand ripples, grains drift; pull back to the site: the fork (sewer and river pulse), a third pipe stub grows
  shot(66, 'town-slice', (k) => ({
    props: {
      ...CONTINUE,
      dressing: 'main',
      framing: 'riverbed',
      cameraKeys: [ck(k.w('Instead of'), RIVERBED_H), {...fk(k.w('Instead of') + 1.2, 'site'), log: true}],
      sandDrift: {from: 0.4},
      riverPlume: [kv(0, 1), kv(k.w('Instead of'), 0.5)],
      fork: {at: k.w('a sewer or'), stubAt: k.w('one town') - 0.3},
    },
    vertical: {props: {...TOWN_V, framing: 'riverbed', cameraKeys: [fk(k.w('Instead of'), 'riverbed'), {...fk(k.w('Instead of') + 1.2, 'site'), log: true}]}},
  })),

  // 68 · slide to the Quincy dressing: another DC, a reuse plant beside it, lined ponds beyond
  shot(68, 'town-slice', () => ({
    props: {...SLIDE, dressing: 'quincy', framing: 'site', quincy: {rakeFrom: 0, pumpFrom: 0}, dc: {roof: 'towers', plume: [kv(0, 0.9)]}},
    vertical: {props: {...TOWN_V}},
  })),

  // 69 · Quincy's lime-softening tank: blowdown arrives, lime drifts in, sludge settles
  shot(69, 'town-slice', (k) => ({
    props: {...CONTINUE, dressing: 'quincy', cameraKeys: [fk(1.0, 'plant')], quincy: {blowdownAt: 0.3, limeAt: k.w('cleans'), sludgeAt: k.w('from a')}},
    // the place label lands on the spoken name ("In Quincy"), not on the slide (av-script had it on shot 68)
    overlays: [{type: 'place', cue: 'Quincy', text: 'Quincy', sub: 'WASHINGTON'}],
    vertical: {props: {...TOWN_V}},
  })),

  // 70 · the orange return route runs from the plant back up to the DC's towers; its node dot lights
  shot(70, 'town-slice', (k) => ({
    props: {...CONTINUE, dressing: 'quincy', cameraKeys: [fk(1.0, 'site')], quincy: {blowdownAt: -5, returnDrawAt: k.w('pipes it back')}},
    vertical: {props: {...TOWN_V}},
  })),

  // 71+72 · the lined ponds: brine in, the level drops, a white salt crust spreads; truck right to the clean river
  shot(71, 'town-slice', (k) => ({
    props: {
      ...CONTINUE,
      dressing: 'quincy',
      cameraKeys: [fk(1.0, 'ponds'), fk(k.w('instead of'), 'ponds'), fk(k.w('instead of') + 1.2, 'river')],
      quincy: {returnDrawAt: -10, pondFrom: 0.3},
    },
    vertical: {
      // Short 3 ends here: in 9:16 the last 1.0 s cranes to the hook's composition (the river edge matches the main sheet's)
      props: {
        ...TOWN_V,
        cameraKeys: [fk(1.0, 'ponds'), fk(k.e('in a river') + 0.2, 'ponds'), ck(k.e('in a river') + 1.2, RIVER_V, true)],
        dc: {roof: 'towers'},
        drain: false,
        // the return pipe's orange fades out with the crane, so the end frame's orange matches the hook's (main dressing)
        quincy: {returnDrawAt: -10, pondFrom: 0.3, returnOutAt: r2(k.e('in a river') + 0.2)},
      },
    },
  })),

  // 73 · Quincy wide: the rake turns, the return pipe pulses, the towers steam
  shot(73, 'town-slice', () => ({
    props: {...CONTINUE, dressing: 'quincy', cameraKeys: [fk(1.0, 'site')], quincy: {returnDrawAt: -12, pulseEvery: 1.0}},
    overlays: [counter('$31 million', {to: 31, label: 'MILLION DOLLARS', sub: "THE SYSTEM'S COST", duration: 0.8})],
    vertical: {props: {...TOWN_V}},
  })),

  // 74 · Quincy's street meter: the dial slows, the return pipe keeps pulsing
  shot(74, 'town-slice', (k) => ({
    props: {...CONTINUE, dressing: 'quincy', cameraKeys: [fk(1.0, 'meter')], waterMeter: [kv(0, 1), kv(k.w('saving'), 0.45)], quincy: {returnDrawAt: -18, pulseEvery: 1.0}},
    overlays: [counter('138 million gallons', {to: 138, label: 'MILLION GAL / YEAR', sub: 'ESTIMATED SAVING', duration: 1.0})],
    vertical: {props: {...TOWN_V}},
  })),

  // 75 · crane up to the roof: the plume still rising, with its orange tokens
  shot(75, 'town-slice', (k) => ({
    props: {...CONTINUE, dressing: 'quincy', cameraKeys: [{...ck(k.len - 0.4, QUINCY_ROOF_H, true), ease: 'sine'}], dc: {roof: 'towers', plume: [kv(0, 0.9)], tokensAt: 0}, quincy: {returnDrawAt: -22, pulseEvery: 1.0}},
    vertical: {props: {...TOWN_V}},
  })),

  // 76 · close on one tower: fan turning, push in on the plume (still moving under card 4)
  shot(76, 'town-slice', (k) => ({
    props: {...CONTINUE, dressing: 'quincy', cameraKeys: [{...ck(k.len, QUINCY_PLUME_H), ease: 'sine'}], dc: {roof: 'towers', plume: [kv(0, 0.9)], tokensAt: -4}, quincy: {returnDrawAt: -26}},
    vertical: {props: {...TOWN_V}},
  })),

  // ════════════════════════════════════ Chapter 4: Why not cool it without water? (card Q 5:25.4, voice 5:29.3)

  // 77 · entered under card 4 (slide): our DC's roof, towers on; after the card clears, the towers lift away and dry coolers slide in
  shot(77, 'datacenter-slice', (k) => ({
    props: {...SLIDE, framing: 'roof', cameraKeys: [fk(k.w('by swapping'), 'roof'), ck(k.w('by swapping') + 1.6, ROOF_DRY_H)], roof: 'towers', roofSwap: {at: k.w('by swapping'), to: 'dry'}, plume: [kv(0, 1), kv(k.w('air-cooled'), 0)], fans: [kv(0, 0.9)],
      // no blowdown with dry coolers: the valve closes on the swap, so the drain's pulses stop (the drawn path stays as the trace)
      blowdown: [kv(0, 0.3), kv(k.w('by swapping') + 0.8, 0)], drain: {drawAt: -60}},
  })),

  // 78 · one dry cooler cut open: orange warm water through the finned tubes, fans pull air, warm air rises; no vapor
  shot(78, 'datacenter-slice', (k) => ({
    props: {...CONTINUE, roof: 'dry', cameraKeys: [fk(1.0, 'drycooler')], dryCut: 0.2, fans: [kv(0, 0.9), kv(k.w('with fans'), 1)], warmAir: {from: 0.6}},
  })),

  // 79+80 · the loop's fill valve: a worker connects a hose, the gauge rises to full, the hose comes off, cap and lock tag go on
  shot(79, 'datacenter-slice', (k) => ({
    props: {
      ...CONTINUE,
      roof: 'dry',
      cameraKeys: [fk(1.0, 'loop')],
      fillHose: {connectAt: 0.6, fullAt: k.w('during construction'), capAt: k.w('and circulating')},
      loopFlow: {from: k.w('circulating')},
    },
    overlays: [callout('cooling loop once', 'Filled once', 'hose', {dx: 170, dy: -110})],
  })),

  // 81 · DC wide, dry coolers: no plume, no drain; the street meter's dial slows almost to a stop
  shot(81, 'datacenter-slice', (k) => ({
    vertical: {props: V_WIDE},
    props: {...CONTINUE, roof: 'dry', cameraKeys: [wideAll(1.0)], waterMeter: [kv(0, 0.6), kv(k.w('will avoid'), 0.05)], loopFlow: {from: -6}},
  })),

  // 82 · the meter: the dial creeps; 125 million liters lands as the sub, the digits on "33 million gallons"
  shot(82, 'datacenter-slice', (k) => ({
    props: {...CONTINUE, roof: 'dry', cameraKeys: [fk(1.0, 'meter')], waterMeter: [kv(0, 0.05)]},
    overlays: [counter('liters of water a year', {to: 33, label: 'MILLION GAL / YEAR', sub: '125 MILLION LITERS', duration: r2(k.w('33 million') + 0.4)})],
  })),

  // 83+84 · the yard: the electric meter speeds up, transformer fans too; then the roof: dry-cooler fans visibly faster
  shot(83, 'datacenter-slice', (k) => ({
    props: {
      ...CONTINUE,
      roof: 'dry',
      cameraKeys: [fk(1.0, 'yard'), fk(k.w('they use'), 'yard'), fk(k.w('they use') + 1.0, 'roof')],
      transformers: [{at: -60, n: 6, kind: 'big'}],
      elecMeter: [kv(0, 0.7), kv(k.w('cooling water'), 1)],
      fans: [kv(0, 1), kv(k.w('more energy'), 1.4)],
      warmAir: {from: -60},
    },
  })),

  // 85 · the electric meter close: its speed nudges up only a little; the power line hums (insulator glints)
  shot(85, 'datacenter-slice', (k) => ({
    props: {...CONTINUE, roof: 'dry', cameraKeys: [fk(1.0, 'elecMeter')], elecMeter: [kv(0, 1), kv(k.w('nominal'), 1.05)], lineGlintAt: k.w('meaning')},
  })),

  // 86 · follow left along the power line, out of the yard, across the fields
  shot(86, 'town-slice', () => ({
    props: {...follow('left'), dressing: 'main', framing: 'fields', dc: {roof: 'dry'}, lineGlintAt: 0.6},
    vertical: {props: {...TOWN_V}},
  })),

  // 87 · the power plant at the far edge, its cooling tower steaming hard; its water path lights orange (the tease)
  shot(87, 'town-slice', (k) => ({
    props: {...CONTINUE, dressing: 'main', cameraKeys: [ck(1.0, PLANT_TEASE_H)], dc: {roof: 'dry'}, plant: {plume: [kv(0, 1)], pathAt: k.w('uses water')}},
    vertical: {props: {...TOWN_V, cameraKeys: [fk(1.0, 'plantTease')]}},
  })),

  // 88 · the two-shot: plant left, DC right, the line between; the DC's one drop token lights at its roof
  shot(88, 'town-slice', (k) => ({
    props: {...CONTINUE, dressing: 'main', cameraKeys: [fk(1.0, 'twoShot')], dc: {roof: 'dry'}, plant: {plume: [kv(0, 1)], pathAt: -3}, drops: {dcAt: k.w('Berkeley Lab')}},
    vertical: {props: {...TOWN_V}},
  })),

  // 89 · twelve drop tokens light at the plant's tower against the DC's one
  shot(89, 'town-slice', () => ({
    props: {...CONTINUE, dressing: 'main', framing: 'twoShot', dc: {roof: 'dry'}, plant: {plume: [kv(0, 1)], pathAt: -8}, drops: {dcAt: -5, plantAt: 0.4, n: 12, every: 0.3}},
    overlays: [counter('12 times the water', {to: 12, label: 'TIMES THE WATER', sub2: 'ABOUT', sub2Place: 'above', sub: 'TO MAKE THEIR POWER', duration: 0.8})],
    vertical: {props: {...TOWN_V}},
  })),

  // 90+91 · slide back to our DC as it is today: towers, plume, orange tokens up; the drain pulses down to the lateral
  shot(90, 'datacenter-slice', (k) => ({
    vertical: {props: {framing: 'wide', cameraKeys: []}},
    props: {...SLIDE, framing: 'wide', cameraKeys: [{...wideAll(0), log: undefined}], roof: 'towers', towerCut: -60, plume: [kv(0, 1)], vapor: {from: -60, every: 0.8, tokens: true}, blowdown: [kv(0, 0.3)], drain: {drawAt: -60, pulseEvery: 1.0, pulseFrom: k.w('and the rest')}},
  })),

  // 92+93 · the swap again: towers out, dry coolers in, the plume stops; then yard + roof, the meter spins up
  shot(92, 'datacenter-slice', (k) => ({
    props: {
      ...CONTINUE,
      cameraKeys: [fk(1.0, 'roof'), fk(k.w('but only'), 'roof'), fk(k.w('but only') + 1.0, 'yardRoof')],
      roof: 'towers',
      roofSwap: {at: k.w('keep that'), to: 'dry'},
      blowdown: [kv(0, 0.3), kv(k.w('keep that') + 0.8, 0)],
      drain: {drawAt: -60},
      plume: [kv(0, 1), kv(k.w('of the air'), 0)],
      elecMeter: [kv(0, 0.7), kv(k.w('more electricity'), 1.1)],
    },
    overlays: [{type: 'statement', cue: 'only by using', text: 'Only by using\nmore electricity.', place: 'low'}],
  })),

  // 94+95 · follow left along the line to the two-shot: the orange the DC no longer sends up reappears at the plant
  shot(94, 'town-slice', (k) => ({
    props: {
      ...follow('left'),
      dressing: 'main',
      framing: 'twoShot',
      cameraKeys: [fk(k.w('at a power'), 'twoShot'), fk(k.w('at a power') + 1.0, 'plantTease')],
      dc: {roof: 'dry'},
      plant: {plume: [kv(0, 1), kv(k.w('saves'), 1.2), kv(k.w('power plant'), 1.35)], pathAt: -20},
      drops: {plantAt: k.w('used up'), n: 4, every: 0.3, rise: true},
    },
    vertical: {props: {...TOWN_V}},
  })),

  // 96+97 · frame 0's composition pulled back (plant on the far left): YOU walks to the fence, looks up, then along the line
  shot(96, 'town-slice', (k) => ({
    props: {
      ...CONTINUE,
      dressing: 'main',
      cameraKeys: [fk(1.0, 'frame0Wide')],
      eastEnd: false, // same sheet as the end hold that follows (its edge is out of frame here)
      dc: {roof: 'towers', plume: [kv(0, 1)]},
      plant: {plume: [kv(0, 1.2)], pathAt: -30},
      you: {at: 0, walkAt: 0, lookAt: k.w('argues'), turnAt: k.w('its electricity')},
      fence: {lookAt: 0.8},
      lineGlintAt: k.w('electricity too'),
    },
    overlays: [{type: 'tag', at: 0.3, who: 'you', anchor: 'youSpot'}],
    vertical: {
      // Short 4 ends here, restaged: the DC's roof with dry coolers (the town's DC instance, matching DC's 'roof' framing),
      // YOU's line said over it, gliding to the hook's framing in the last 1.0 s. No YOU, so no tag.
      props: {...TOWN_V, framing: 'roof', cameraKeys: [fk(k.e('electricity too') + 0.2, 'roof'), ck(k.e('electricity too') + 1.2, ROOF_DRY_V)], dc: {roof: 'dry', plume: [kv(0, 0)]}, you: null},
      overlays: [],
    },
  })),

  // 98 · the end hold: slow truck left along the line, the plant, line and DC in the left ≈ 55 %; right half free (12 s)
  shot(98, 'town-slice', (k) => ({
    props: {
      ...CONTINUE,
      dressing: 'main',
      cameraKeys: [{...ck(k.e('where it\'s made') + 0.5, END_HOLD_H), ease: 'sine'}],
      // the sheet ends past the DC, so the right half stays free for the end screen (§ 11.6)
      eastEnd: false,
      dc: {roof: 'towers', plume: [kv(0, 1)]},
      plant: {plume: [kv(0, 1.2)], pathAt: -40},
      drift: 0.08,
    },
    vertical: {props: {...TOWN_V}},
  })),
];

// ---------------------------------------------------------------- the Shorts (§ 11.8; hook lines voiced on their own files)

/** A Short's title block (vertical § 6: x 120, top y 300), held 0.8 s past the hook's question. */
const shortTitle = (n: number, question: string, place: string, time: string): OverlaySpec => {
  const hook = (transcript as Transcript).hooks?.[String(n)]?.words ?? [];
  const end = hook.length ? hook[hook.length - 1].end : 7;
  return {type: 'title', at: 0, question, number: 'No. 013', title: `Ch. ${n} · ${place}`, time, hold: r2(end + 0.8)};
};

const shorts: ShortSpec[] = [
  {
    chapter: 1,
    from: 'Look at the back of this rack',
    until: 'Data centers use the most',
    // frame 0: DC 9:16 'wide', the tower cut open with the plume into the sky band, the orange riser, the AI rack low,
    // the meter's dial spinning in the cut ground. The Short ends on shot 27 gliding back to this framing.
    hookScene: {
      scene: 'datacenter-slice',
      props: {...DAY, framing: 'wide', roof: 'towers', towerCut: -60, rain: {from: -60}, vapor: {from: -60, every: 0.8, tokens: true}, plume: [kv(0, 1)], heat: {ai: [kv(0, 1)]}, route: {drawAt: -60, to: 'towerInlet'}, waterMeter: [kv(0, 1)]},
      overlays: [shortTitle(1, 'Where does it all go?', 'The Data Center', '3:12 PM'), hookBed(1, 'tower'), hookBed(1, 'out')],
    },
  },
  {
    chapter: 2,
    from: 'Every time some of that water',
    until: 'Fresh water replaces',
    // frame 0: DC 9:16 'towerValve' (the tower and the valve below it), rain over the fill, the basin, and the blowdown valve below already trickling.
    hookScene: {
      scene: 'datacenter-slice',
      // the chapter's opening state (shot 39: route, hot air, riser, plume...) so the hook → chapter join doesn't pop
      props: {...DAY, ...dcStateAt(39), framing: 'towerValve', camera: {from: TOWER_VALVE_V}, minerals: [kv(0, 0.2)], ...SHORT2_V},
      overlays: [shortTitle(2, "Why don't they just\nreuse the water?", 'The Roof', '3:20 PM'), hookBed(2, 'tower'), hookBed(2, 'pump')],
    },
  },
  {
    chapter: 3,
    from: 'Piping that water straight',
    until: 'Microsoft agreed to cover',
    // frame 0: TOWN 9:16 'river', the DC lot on top (plume up), its drain pipe down the cut ground, the river with the closed gate.
    hookScene: {
      scene: 'town-slice',
      // frame 0 = the loop's last frame: drain path unlit (Short 3 keeps it off; the outfall pipe's own orange tells the story)
      props: {...DAY, ...TOWN_V, dressing: 'main', framing: 'river', cameraKeys: [ck(0, RIVER_V)], dc: {roof: 'towers'}, drain: false, gate: {open: [kv(0, 0)]}},
      overlays: [shortTitle(3, 'Why not release it\ninto a river?', 'The Drain', '3:31 PM'), hookBed(3, 'river'), hookBed(3, 'out')],
    },
  },
  {
    chapter: 4,
    from: 'But while air-cooled machines',
    until: 'Part 2 follows',
    // frame 0: DC 9:16 'roof' with dry coolers (no plume, fans spinning, orange warm air rising), the yard's meter below.
    hookScene: {
      scene: 'datacenter-slice',
      props: {...DAY, framing: 'roof', camera: {from: ROOF_DRY_V}, roof: 'dry', fans: [kv(0, 1.2)], warmAir: {from: -60}, plume: [kv(0, 0)], elecMeter: [kv(0, 1)]},
      overlays: [shortTitle(4, 'Why not cool it\nwithout water?', 'The Roof', '3:45 PM'), hookBed(4, 'fan'), hookBed(4, 'out')],
    },
  },
];

export const spec: VideoSpec = {
  format: 'horizontal',
  watermark: null,
  // Real opening (§ 11.6.1): no real pixel after F96; long video only (Shorts stay 3D).
  opening: {footage: 'footage/opening.mp4', until: 3.2, masks: OPENING_MASKS},
  // Chapter cards, § 11.5.1 shape (new): every chapter from 2 gets a card from its `##` heading; these entries set the
  // 2.5 s hold explicitly and the one manual line break. Ch. 3 (32 characters) and ch. 4 (30) should fit one line at
  // 80 px: check on stills once the card is built, and break ch. 3 as 'Why not release it\ninto a river?' if it wraps.
  chapters: [
    {chapter: 2, question: "Why don't they just\nreuse the water?", hold: 2.5},
    {chapter: 3, hold: 2.5},
    {chapter: 4, hold: 2.5},
  ],
  music: MUSIC,
  shorts,
  scenes,
  // YouTube thumbnail (publish.md § Thumbnail, style guide § 11.9.1; owner picked text A, 2026-11-02): shot 15 at frame
  // 2711 (the `evaporates` beat) held still at the `THUMB` framing, the route drawn long before, the rain falling, the
  // plume at full billow, the route ×2.5 and the cut ink ×1.5 for the still. `yarn cover` → release/thumbnail.png.
  cover: {
    text: 'Mostly,\nit goes\nup.',
    scene: 'datacenter-slice',
    // frame 2711 = shot 15 (starting at video frame 2634) + 2.57 s; `startFrame` puts the scene clock there too, so the
    // plume, the fans and the LEDs are as they were in the video, not 2.6 s old
    at: 2.57,
    props: {
      startFrame: 2634,
      mood: 'day',
      framing: 'THUMB',
      push: 0,
      roof: 'towers',
      towerCut: -6,
      fans: [kv(0, 1)],
      plume: [kv(0, 1.6)],
      heat: {racks: [kv(0, 0.4)], ai: [kv(0, 1.2)]},
      aiFans: [kv(0, 1)],
      technician: null,
      coilFlow: {from: -26},
      route: {drawAt: -20, to: 'towerInlet'},
      xray: {part: 'hallWall', at: -13},
      hotAir: {from: -22, every: 0.6, coolThrough: true},
      rain: {from: -4},
      airIn: {from: -2},
      routeScale: 2.5,
      inkScale: 1.5,
    },
  },
};
