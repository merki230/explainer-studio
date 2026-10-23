import type {OverlaySpec, VideoSpec} from '../../types';

/**
 * No. 008 · The Gas Pedal, in The Section (style guide v0.12). Rough cut from `av-script.md` draft 2 (owner
 * decisions of 2026-10-23 applied), timed to the recorded take (transcript.json, 64.68 s).
 *
 * Three locations, Day after the rain, 3:50 PM, joined by slides:
 *  - K `car-slice` `variant: 'gas'`: YOU's gas car cut open, facing left, on the wet highway lane. Lines 1–4, 8–12.
 *  - E `car-slice` `variant: 'ev'`: FRIEND's electric car (graphite) on the same wet highway lane, its drive unit
 *    landing where K's throttle body was. Lines 5–6.
 *  - R `highway-slice` `wet` + `curve`: YOU's car whole in the bend, the skid and stability control's cut,
 *    seen from outside (no orange). Line 7.
 *
 * Camera, one way (owner rule from No. 006): K dives once (OPEN → signal → pedal → throttle, lines 1–4), E
 * pulls out once, R pushes once, and K resumes on the throttle exactly where it left and pulls out once
 * (throttle → bay → column → OPEN, lines 8–12). The distances only grow after the return.
 * Every scene's first camera key is the previous K scene's last.
 *
 * Orange only for the gas signal path (sensor → computer → throttle motor), the EV's power path (sensor → board →
 * phase cables → windings), the computer's yes / no (the
 * gate, the cut), the brake-switch lead and the steer-by-wire wire. Brake lamps flat red.
 *
 * Loop (§ 8): frame 0 and the last frame are K at OPEN, drift 0: cruising at 45 mph, the foot on the gas at
 * 0.4, no orange, the steering shaft in place. Scene 13 fades every orange and brings the shaft back in the hold.
 *
 * Timing: scene starts are cues copied from script.txt. Props are seconds into the scene, rebased from T
 * (video seconds of the recorded take) with `r()`. Re-check T and every // TIMED value if the voice is redone.
 *
 * Illustrative (🎭, disclosed in the post): the generic gas and electric layouts, the throttle ×1.5 and the
 * thick steering shaft, the speeds, the skid, one computer box per car, FRIEND's electric car, steer-by-wire
 * on a sedan, the story time.
 *
 * Sound: No. 006's music bed (`audio/music.mp3`, 71 s) from frame 0, ≈ 12 dB under the dry voice, no duck. SFX
 * self-made (S5), physical only: no whines, no whoosh (owner, preview 2). Levels from measured loudness: voice −21.3 LUFS;
 * volume = (voice − dB under) − file LUFS.
 */

type V3 = [number, number, number];
type Framing = {look: V3; distance: number};

/** Cue and word times, video seconds, from transcript.json (recorded take). TIMED. */
const T = {
  hook: 0, // In most new cars
  pressing: 1.48,
  computer1: 4.4,
  say: 5.28,
  saysNo: 8.24,
  says2: 10.24, // "Normally it says yes"
  because: 11.28, // because the pedal
  how: 14.24,
  pressed: 14.88,
  inA: 15.92, // In a gas car
  computer2: 17.36,
  open: 19.04,
  electric: 20.44, // An electric car
  noValve: 21.68,
  its: 22.96,
  power1: 24.4,
  either: 26.08, // Either way, in
  sayNo2: 28.8,
  andYour: 29.65, // and your power
  cut1: 30.56,
  ifYou: 33.76, // If you skid
  skid: 34.08,
  cut2: 36.8,
  itself: 37.72,
  yourPower: 38.88, // Your power can also
  brake: 40.52,
  catches: 41.84,
  thats: 43.84, // That's brake override
  ignore: 46.6,
  cutGas: 47.2,
  andIts: 48.21, // and it's not
  road: 49.92,
  steering1: 51.92, // Steering could be
  steers: 55.92, // steers by wire
  would: 60.48, // Would you trust
  steering2: 62.08,
  gas2: 64.16,
  end: 64.68,
};

/** The tail after the last word (s): the loop's hold. */
const TAIL = 1.0;

/** Video seconds → seconds into the scene that starts at `start`. */
const r = (abs: number, start: number) => Math.round((abs - start) * 100) / 100;

// The scene prop `transition` is not a CSS transition; the Remotion rule can't tell them apart.
// eslint-disable-next-line @remotion/non-pure-animation
const CONTINUE = {transition: 'continue'} as const;
// eslint-disable-next-line @remotion/non-pure-animation
const SLIDE = {transition: 'slide'} as const;

/** A camera key: arrive at framing `f` at `at` s into the scene. */
const key = (at: number, f: Framing, o: {ease?: 'out' | 'inOut' | 'sine'; log?: boolean} = {}) => ({at, ...f, ...o});

// ---------------------------------------------------------------- K framings (car-slice gas, metres)

/** M, frame 0 and the loop (review note 1: closer than the `car` preset's 19 m): the bay, the pedals and
 * the foot readable, the front wheel on the wet lane, enough car above for context. */
const OPEN: Framing = {look: [-0.95, 0.25, 0.45], distance: 8.3};
/** C, the `signal` preset: the pedal at the bottom, the wire up the firewall, the computer at the top. */
const SIGNAL: Framing = {look: [-0.966, 0.518, 0.345], distance: 3.4};
/** C, the `pedal` preset and its slow push. */
const PEDAL: Framing = {look: [-0.802, 0.501, 0.293], distance: 3};
const PEDAL_IN: Framing = {look: [-0.802, 0.42, 0.293], distance: 2.8}; // look lowered: the toe clears the captions
/** C, the `throttle` preset (the EV `motor` framing's offset, so the slide to E lands on the same spot), and its push. */
const THROTTLE: Framing = {look: [-1.38, 0.822, 0.41], distance: 2.2};
const THROTTLE_IN: Framing = {look: [-1.38, 0.822, 0.41], distance: 2.05};
/** C+, the bay for the override (visual review: look x −1.15 → −1.0 so the brake pedal, the lit brake lead and
 * the computer's gate sit mid-frame; pushed in so the NO reads), and the slow pull through scenes 8–10. The
 * pull-out's distances only grow: 2.05 → 3.6 → 3.8 → 4.0 → 5.5 (column) → 5.7 → 8.3 (OPEN). */
const BAY: Framing = {look: [-1.0, 0.36, 0.42], distance: 3.6};
const BAY_2: Framing = {look: [-1.0, 0.36, 0.42], distance: 3.8};
const BAY_3: Framing = {look: [-1.0, 0.37, 0.42], distance: 4.0};
/** C+, the steering column (visual review: closer and lower, so the shaft's stubs and the gap sit mid-frame, below
 * the dash). */
const COLUMN: Framing = {look: [-0.88, 0.47, 0.42], distance: 5.5};
const COLUMN_2: Framing = {look: [-0.88, 0.47, 0.42], distance: 5.7};

/** Every K scene: Day, the wet lane, drift 0 (the idle drift runs on the video clock; a scene with drift next
 * to one without snaps sideways at the cut). */
const GAS = {variant: 'gas', mood: 'day', wet: true, drift: 0, wheelsWhole: true} as const; // near wheels whole (owner)
/** The signal path already lit when a later K scene starts. */
const PATH_LIT = {pedalAt: -10, motorAt: -9} as const;
/** 45 mph in wheel revolutions per second (`MPH45_REVS`, wheel radius 0.36 m). */
const M45 = (45 * 0.44704) / (2 * Math.PI * 0.36);

// ---------------------------------------------------------------- E framings (car-slice ev, metres; EV_FRAMINGS)

/** C, the `motor` preset at the distance K's throttle shot ends on (2.05 m): the `throttle` framing is derived
 * from `motor` (same subject offset), so the slide K → E lands the drive unit where the throttle body was. */
const E_MOTOR: Framing = {look: [-1.28, 0.62, 0.35], distance: 2.05};
const E_MOTOR_IN: Framing = {look: [-1.28, 0.62, 0.35], distance: 1.95};
/** M, the `evBay` preset pushed in (9.5 → 7) and lowered: at 9.5 m the drive unit sat on the captions and its
 * yes / no read too small; at 7 m the windings, the foot and FRIEND's head share the frame above the captions. */
const E_BAY: Framing = {look: [-0.92, 0.4, 0.28], distance: 7};
const E_BAY_2: Framing = {look: [-0.92, 0.4, 0.28], distance: 7.3};
/** FRIEND's electric car (S6): the wet highway lane, graphite body, FRIEND at the wheel, drift 0. */
const EV = {
  variant: 'ev',
  road: 'highway',
  wet: true,
  mood: 'day',
  drift: 0,
  wedge: null,
  driver: 'friend',
  wheelsWhole: true,
} as const;
/** The EV's power path already drawn when a later E scene starts. */
const DRIVE_LIT = {pedalAt: -10, motorAt: -9} as const;

// ---------------------------------------------------------------- R framing (highway-slice)

/** MW, the `curve` preset tightened (review note 3: empty sky inside the bend) and lowered onto the car. */
const R_CURVE: Framing = {look: [-6.4, -3.4, -17.5], distance: 40};
const R_CURVE_IN: Framing = {look: [-6.5, -3.4, -17.8], distance: 38};

// level = (voice LUFS − 12) − track LUFS = (−21.3 − 12) − (−14.89)
const MUSIC_LEVEL = -18.4;

const picture: VideoSpec = {
  watermark: null,
  tail: TAIL,
  music: {level: MUSIC_LEVEL, duckDb: 0, startAt: 0, fadeIn: 1.5},
  scenes: [
    // 1 · Lines 1–3a, K. Frame 0 at OPEN: the car on the wet lane, the sneaker on the gas. The foot presses on
    // "pressing" (the speed stays: "won't always speed you up"); one log move in to the signal run, the orange
    // drawing sensor → computer on "computer"; pulses pass ("yes"), then die at the computer on "says no",
    // pass again on "Normally it says yes"; the camera cranes down to the pedal, arriving at the cut.
    {
      scene: 'car-slice',
      cue: 'In most new cars',
      props: {
        ...GAS,
        cameraKeys: [
          key(0, OPEN),
          key(1.4, OPEN), // the hook holds: car, pedal, foot
          key(r(T.computer1, T.hook), SIGNAL, {log: true}), // TIMED: lands on "computer"
          key(r(T.because, T.hook) - 0.9, SIGNAL),
          key(r(T.because, T.hook), PEDAL, {ease: 'sine'}),
        ],
        driving: [{at: 0, speed: M45}],
        foot: [
          {at: 0, pose: 'accel', press: 0.4},
          {at: r(T.pressing, T.hook) - 0.1, pose: 'accel', press: 0.6, dur: 0.5}, // TIMED: "pressing"
          // visual review: the foot presses harder through the "no", so more pulses arrive and die at the computer
          {at: r(T.saysNo, T.hook) + 0.05, pose: 'accel', press: 0.9, dur: 0.4}, // TIMED: "says no"
          {at: r(T.says2, T.hook), pose: 'accel', press: 0.6, dur: 0.5}, // TIMED: "Normally it says yes"
        ],
        gasPath: {pedalAt: r(T.computer1, T.hook) - 0.2, drawFor: 0.9}, // TIMED: on the computer by ≈ 5.1
        gate: [
          {at: r(T.saysNo, T.hook) + 0.1, pass: false}, // TIMED: "says no"
          {at: r(T.says2, T.hook), pass: true}, // TIMED: "Normally it says yes"
        ],
      },
      overlays: [
        {
          type: 'title',
          at: 0,
          question: 'What happens when it says no?',
          number: 'No. 008',
          title: 'The Gas Pedal',
          time: '3:50 PM',
          until: r(T.saysNo, T.hook) + 1.4, // 0.8 s after "no?" ends
        },
      ],
    },
    // 2 · Line 3b, K. The pedal module: the sensor lights on "sensor"; the foot presses in two steps on "how far
    // you pressed" and the pulses up the wire come faster.
    {
      scene: 'car-slice',
      cue: 'because the pedal',
      props: {
        ...GAS,
        ...CONTINUE,
        cameraKeys: [key(0, PEDAL), key(r(T.inA, T.because), PEDAL_IN, {ease: 'sine'})],
        driving: [{at: 0, speed: M45}],
        foot: [
          {at: 0, pose: 'accel', press: 0.6},
          {at: r(T.how, T.because), pose: 'accel', press: 0.75, dur: 0.3}, // TIMED
          {at: r(T.pressed, T.because), pose: 'accel', press: 0.9, dur: 0.3}, // TIMED
        ],
        gasPath: {pedalAt: -10},
      },
    },
    // 3 · Line 4, K. One glide up and left to the throttle body: the orange draws computer → motor on
    // "computer", the plate turns open on "open the throttle". Holds open into the slide (the foot stays down).
    {
      scene: 'car-slice',
      cue: 'In a gas car',
      props: {
        ...GAS,
        ...CONTINUE,
        cameraKeys: [key(0, PEDAL_IN), key(0.9, THROTTLE), key(r(T.electric, T.inA), THROTTLE_IN, {ease: 'sine'})],
        driving: [{at: 0, speed: M45}],
        foot: [
          {at: 0, pose: 'accel', press: 0.9},
          {at: 1.6, pose: 'accel', press: 0.75},
        ],
        gasPath: {pedalAt: -10, motorAt: r(T.computer2, T.inA) - 0.1, drawFor: 0.9}, // TIMED
        throttle: [
          {at: 0, value: 0.12},
          {at: r(T.open, T.inA), value: 0.12}, // TIMED: "open the throttle"
          {at: r(T.open, T.inA) + 0.5, value: 0.8},
        ],
      },
    },
    // 4 · Line 5, E (slide). FRIEND's electric car close on the drive unit, where the throttle was: the empty
    // space on "no throttle valve"; the orange arrives at the inverter's board on "its computer" and runs down the
    // phase cables to the windings on "how much power", the car picking up a little.
    {
      scene: 'car-slice',
      cue: 'An electric car',
      props: {
        ...EV,
        ...SLIDE,
        camera: {from: E_MOTOR},
        cameraKeys: [key(0, E_MOTOR), key(r(T.either, T.electric), E_MOTOR_IN, {ease: 'sine'})],
        driving: [
          {at: 0, speed: M45},
          {at: r(T.power1, T.electric), speed: M45},
          {at: r(T.either, T.electric), speed: 1.08 * M45},
        ],
        foot: [{at: 0, pose: 'accel', press: 0.7}],
        drive: {pedalAt: r(T.its, T.electric) - 0.5, drawFor: 0.8, motorAt: r(T.power1, T.electric) - 0.2}, // TIMED
      },
    },
    // 5 · Line 6a, E. E's one pull-out, to evBay: FRIEND in profile, the foot down; on "say no" the pulses die at the
    // board and the windings dim.
    {
      scene: 'car-slice',
      cue: 'Either way, in',
      props: {
        ...EV,
        ...CONTINUE,
        cameraKeys: [key(0, E_MOTOR_IN), key(1.3, E_BAY, {log: true})],
        driving: [{at: 0, speed: 1.08 * M45}],
        foot: [{at: 0, pose: 'accel', press: 0.7}],
        drive: DRIVE_LIT,
        gate: [{at: r(T.sayNo2, T.either), pass: false}], // TIMED: "say no"
      },
      // No FRIEND tag: at any framing that keeps the drive unit readable FRIEND's head sits above the tag's
      // y 470 floor, so the leader pointed at the dashboard. The green sweater and graphite car carry it.
    },
    // 6 · Line 6b, E. On "power gets cut" the phase leg and windings go dark and the car slows, the sneaker still
    // pressed through "foot's still down".
    {
      scene: 'car-slice',
      cue: 'and your power',
      props: {
        ...EV,
        ...CONTINUE,
        cameraKeys: [key(0, E_BAY), key(r(T.ifYou, T.andYour), E_BAY_2, {ease: 'sine'})],
        driving: [
          {at: 0, speed: 1.08 * M45},
          {at: r(T.cut1, T.andYour), speed: 1.08 * M45},
          {at: r(T.cut1, T.andYour) + 1.5, speed: 0.8 * M45},
        ],
        foot: [{at: 0, pose: 'accel', press: 0.7}],
        drive: DRIVE_LIT,
        gate: [{at: 0, pass: false}],
        cut: [
          {at: r(T.cut1, T.andYour) - 0.1, value: 0},
          {at: r(T.cut1, T.andYour) + 0.25, value: 1}, // TIMED: "cut"
        ],
      },
    },
    // 7 · Line 7, R (slide). YOU's car whole in the wet bend: on "skid" the rear steps out (35°) and the front
    // wheels throw spray (power on); on "cut your power" the spray stops and the car eases straight by "itself".
    {
      scene: 'highway-slice',
      cue: 'If you skid',
      props: {
        ...SLIDE,
        mood: 'day',
        wet: true,
        curve: {start: 4, radius: 120},
        framing: 'curve',
        camera: {from: R_CURVE},
        cameraKeys: [key(0, R_CURVE), key(r(T.yourPower, T.ifYou), R_CURVE_IN, {ease: 'sine'})],
        drift: 0,
        traffic: [],
        spray: 1.8, // visual review: more spray off the tires
        signs: [], // the tighter frame cropped the sign at the right edge
        car: {
          rear: 6,
          speed: [{at: 0, speed: 20.1}],
          drive: 'front',
          yaw: [
            {at: 0, value: 3},
            {at: r(T.skid, T.ifYou), value: 3}, // TIMED: "skid"
            {at: r(T.skid, T.ifYou) + 0.8, value: 35},
            {at: r(T.cut2, T.ifYou), value: 35}, // TIMED: "cut your power"
            {at: r(T.itself, T.ifYou) + 0.4, value: 0},
          ],
          spin: [
            {at: 0, value: 0.3},
            {at: r(T.skid, T.ifYou), value: 0.3},
            {at: r(T.skid, T.ifYou) + 0.4, value: 1},
            {at: r(T.cut2, T.ifYou), value: 1},
            {at: r(T.cut2, T.ifYou) + 0.4, value: 0},
          ],
        },
      },
      // YOU re-entering in a new slice (frame 0 can't carry a tag)
      overlays: [{type: 'tag', who: 'you', at: 0.7, until: 2.4}],
    },
    // 8 · Line 8, K (slide). Back exactly where K left: close on the throttle, the plate open; the start of K's
    // one pull-out, to the bay. The foot stamps on the brake on "brake hard" (the brake lead lights, the nose
    // dips, the lamps light off-frame); the sneaker's edge catches the gas on "catches": pulses again.
    {
      scene: 'car-slice',
      cue: 'Your power can also',
      props: {
        ...GAS,
        ...SLIDE,
        camera: {from: THROTTLE_IN},
        cameraKeys: [
          key(0, THROTTLE_IN),
          key(1.3, BAY, {log: true}),
          key(r(T.thats, T.yourPower), BAY_2, {ease: 'sine'}),
        ],
        driving: [
          {at: 0, speed: M45},
          {at: r(T.brake, T.yourPower) + 0.3, speed: M45},
          {at: r(T.brake, T.yourPower) + 1.1, speed: 0.75 * M45},
          {at: 4.5, speed: 0.6 * M45},
        ],
        foot: [
          {at: 0, pose: 'accel', press: 0.75},
          {at: r(T.brake, T.yourPower) - 0.1, pose: 'brake', press: 0.95}, // TIMED: down by "hard"
          {at: r(T.catches, T.yourPower) - 0.1, pose: 'both', press: 0.95, edge: 0.6}, // TIMED: "catches"
        ],
        gasPath: PATH_LIT,
        throttle: 'auto',
        brakeLead: {at: r(T.brake, T.yourPower) + 0.2},
        noseDip: [
          {at: r(T.brake, T.yourPower) + 0.2, value: 0},
          {at: r(T.brake, T.yourPower) + 0.7, value: 1},
        ],
        brakeLights: [
          {at: r(T.brake, T.yourPower) + 0.2, value: 0},
          {at: r(T.brake, T.yourPower) + 0.3, value: 1},
        ],
      },
    },
    // 9 · Line 9a, K. Both pedals down: on "ignore" the gas pulses die at the computer; on "cut the gas" the
    // outgoing leg goes dark and the plate snaps shut.
    {
      scene: 'car-slice',
      cue: "That's brake override",
      props: {
        ...GAS,
        ...CONTINUE,
        cameraKeys: [key(0, BAY_2), key(r(T.andIts, T.thats), BAY_3, {ease: 'sine'})],
        driving: [
          {at: 0, speed: 0.6 * M45},
          {at: 4, speed: 0.45 * M45},
        ],
        foot: [{at: 0, pose: 'both', press: 0.95, edge: 0.6}],
        gasPath: PATH_LIT,
        gate: [{at: r(T.ignore, T.thats), pass: false}], // TIMED: "ignore"
        cut: [
          {at: r(T.cutGas, T.thats) - 0.1, value: 0},
          {at: r(T.cutGas, T.thats) + 0.25, value: 1}, // TIMED: "cut the gas"
        ],
        brakeLead: {at: -5},
        noseDip: 1,
        brakeLights: 1,
      },
    },
    // 10 · Line 9b, K. The car slows on, lamps lit; in the pause the foot goes back to the gas alone, the lamps go
    // dark, the nose rises, the path passes again: normal driving.
    {
      scene: 'car-slice',
      cue: "and it's not",
      props: {
        ...GAS,
        ...CONTINUE,
        cameraKeys: [key(0, BAY_3)],
        driving: [
          {at: 0, speed: 0.45 * M45},
          {at: 1.6, speed: 0.4 * M45},
          {at: 3.2, speed: 0.7 * M45},
        ],
        foot: [
          {at: 0, pose: 'both', press: 0.95, edge: 0.6},
          {at: r(T.road, T.andIts) + 0.3, pose: 'accel', press: 0.5}, // after "road"
        ],
        gasPath: PATH_LIT,
        gate: [
          {at: 0, pass: false},
          {at: r(T.road, T.andIts) + 0.6, pass: true},
        ],
        cut: [
          {at: 0, value: 1},
          {at: r(T.road, T.andIts) + 0.5, value: 1},
          {at: r(T.road, T.andIts) + 1.0, value: 0},
        ],
        brakeLead: {at: -5, fadeAt: r(T.road, T.andIts) + 0.3},
        noseDip: [
          {at: r(T.road, T.andIts) + 0.3, value: 1},
          {at: r(T.road, T.andIts) + 0.9, value: 0},
        ],
        brakeLights: [
          {at: r(T.road, T.andIts) + 0.3, value: 1},
          {at: r(T.road, T.andIts) + 0.4, value: 0},
        ],
      },
    },
    // 11 · Lines 10–11a, K. A glide up to the steering column: on "Steering" the steel shaft fades to two hatched
    // stubs (the what-if); the orange wire draws column sensor → rack motor.
    {
      scene: 'car-slice',
      cue: 'Steering could be',
      props: {
        ...GAS,
        ...CONTINUE,
        cameraKeys: [key(0, BAY_3), key(1.2, COLUMN, {ease: 'sine'}), key(r(T.steers, T.steering1), COLUMN)],
        driving: [
          {at: 0, speed: 0.7 * M45},
          {at: 2.5, speed: M45},
        ],
        foot: [{at: 0, pose: 'accel', press: 0.5}],
        // the pedal path fades so the steering wire is the only orange (it draws again for "the gas" in 13)
        gasPath: {...PATH_LIT, fadeAt: 0.1, fadeFor: 0.8},
        steerByWire: {at: 0.3, wireAt: 1.6},
      },
    },
    // 12 · Line 11b, K. YOU turns the wheel a little on "steers by wire": pulses down the wire, the near front
    // wheel steers; on "no mechanical link" the hatched gap holds the frame.
    {
      scene: 'car-slice',
      cue: 'steers by wire',
      props: {
        ...GAS,
        ...CONTINUE,
        cameraKeys: [key(0, COLUMN), key(r(T.would, T.steers), COLUMN_2, {ease: 'sine'})],
        driving: [{at: 0, speed: M45}],
        foot: [{at: 0, pose: 'accel', press: 0.5}],
        steerByWire: {at: -5, wireAt: -4},
        // owner, preview 2: the turn must read. The wheel turns ≈ 40° left on "steers by wire", holds, and comes
        // back; 🎭 ratio 3 so the near front wheel's turn shows from the side
        steerRatio: 3,
        steer: [
          {at: 0, value: 0},
          {at: 0.7, value: 0.7},
          {at: 2.0, value: 0.7},
          {at: 3.0, value: 0},
        ],
        steerPulses: [0.2, 0.5, 0.8, 1.1, 1.4, 2.2, 2.5],
      },
    },
    // 13 · Line 12, K. The pull-out lands on OPEN, frame 0's picture: a pulse down the steering wire on
    // "steering", one up the pedal path on "gas"; in the hold every orange fades and the shaft comes back, the
    // foot settles at frame 0's press.
    {
      scene: 'car-slice',
      cue: 'Would you trust',
      props: {
        ...GAS,
        ...CONTINUE,
        cameraKeys: [key(0, COLUMN_2), key(0.3, COLUMN_2), key(r(T.gas2, T.would) - 0.1, OPEN, {log: true})],
        driving: [{at: 0, speed: M45}],
        foot: [
          {at: 0, pose: 'accel', press: 0.5},
          {at: r(T.gas2, T.would) - 0.2, pose: 'accel', press: 0.6, dur: 0.3}, // TIMED: "gas"
          {at: r(T.end, T.would) + 0.2, pose: 'accel', press: 0.4, dur: 0.6}, // frame 0's press
        ],
        // the pedal path draws again for "like you probably do with the gas", then fades in the hold
        gasPath: {
          pedalAt: r(T.gas2, T.would) - 1.3,
          drawFor: 0.6,
          motorAt: r(T.gas2, T.would) - 0.7,
          fadeAt: r(T.end, T.would) + 0.1,
          fadeFor: 0.7,
        },
        steerByWire: {at: -10, wireAt: -9, backAt: r(T.end, T.would) + 0.1},
        steerPulses: [r(T.steering2, T.would) - 0.2, r(T.steering2, T.would) + 0.2], // TIMED
        // a second turn on "your steering", back to straight well before the loop's last frame
        steerRatio: 3,
        steer: [
          {at: r(T.steering2, T.would) - 0.5, value: 0},
          {at: r(T.steering2, T.would) + 0.2, value: -0.6}, // TIMED: "steering"
          {at: r(T.steering2, T.would) + 1.0, value: -0.6},
          {at: r(T.steering2, T.would) + 1.8, value: 0},
        ],
      },
    },
  ],
};

// ---------------------------------------------------------------- sound

// volume = (voice −21.3 − dB under) − file LUFS (measured 2026-10-23). Volumes ≤ 0.
const ENGINE = {type: 'sfx', name: 'engine', volume: -18.9, loop: true} as const; // −20.45 LUFS, 18 under
const FLARE = {type: 'sfx', name: 'engine-flare', volume: -15.3} as const; // −20.0, 14 under
const DROP = {type: 'sfx', name: 'engine-drop', volume: -15.3} as const; // −20.05, 14 under
const IDLE = {type: 'sfx', name: 'engine-idle', volume: -15.9} as const; // −20.4, 15 under
const HISS = {type: 'sfx', name: 'hiss', volume: -16.9, loop: true} as const; // −24.4, 20 under
const THROTTLE_S = {type: 'sfx', name: 'throttle', volume: -8} as const; // 0.29 s, peak −13.4 dBTP: ≈ 16 under by ear
const SHUT = {type: 'sfx', name: 'throttle-shut', volume: -8} as const;
const SKID = {type: 'sfx', name: 'skid', volume: -15.4} as const; // −19.9, 14 under
const THUMP = {type: 'sfx', name: 'thump', volume: -17.1} as const; // −19.2, 15 under
const STEER = {type: 'sfx', name: 'steer', volume: -16.7} as const; // −21.65, 17 under
// Owner, preview 2 ("also the spaceship sound"): no EV whines and no slide whoosh. E carries only the wet
// tire hiss (the frame-0 loop runs through it) under the music; there is no plain motor-hum file.

/** Sound per scene (index in `scenes`), seconds into the scene. TIMED against the props above. */
const SOUND: Record<number, OverlaySpec[]> = {
  // 1: the road and the engine from frame 0 (both loop to the slide into E); the press on "pressing"
  0: [
    {...HISS, at: 0},
    {...ENGINE, at: 0, fade: 0.4, until: 'An electric car'},
    {...FLARE, at: r(T.pressing, T.hook) - 0.1},
  ],
  // 2: the second step of the press
  1: [{...FLARE, at: r(T.pressed, T.because) - 0.1}],
  // 3: the plate turning open
  2: [{...THROTTLE_S, at: r(T.open, T.inA)}],
  // 4–6 (E): the wet tire hiss only (the frame-0 loop), no engine, no whine
  // 7 (R): the hiss up, YOU's engine until the cut, the skid
  6: [
    {...HISS, volume: -14, at: 0, fade: 0.4, until: 'Your power can also'},
    {...ENGINE, at: 0, fade: 0.3, until: r(T.cut2, T.ifYou)},
    {...SKID, at: r(T.skid, T.ifYou)},
    {...DROP, at: r(T.cut2, T.ifYou) - 0.05},
  ],
  // 8: back in K; the engine until the cut; the brake stamp; the flare as the shoe catches the gas
  7: [
    {...ENGINE, at: 0, fade: 0.3, until: r(T.cutGas, T.yourPower) + 0.1},
    {...THUMP, at: r(T.brake, T.yourPower) + 0.2},
    {...FLARE, at: r(T.catches, T.yourPower)},
  ],
  // 9: the plate snaps shut, the engine falls to idle
  8: [
    {...SHUT, at: r(T.cutGas, T.thats)},
    {...IDLE, at: r(T.cutGas, T.thats) + 0.05, fade: 0.3},
  ],
  // 10: back on the gas alone after "road": the engine returns and runs to the last frame
  9: [{...ENGINE, at: r(T.road, T.andIts) + 0.5, fade: 0.6}],
  // 12: the wheel turn
  11: [{...STEER, at: 0.5}],
};

export const spec: VideoSpec = {
  ...picture,
  // Cover still (`yarn cover drive-by-wire`): YOU's sneaker on the gas pedal, the orange signal running up the
  // firewall to the computer. Text in the sky band, two lines.
  cover: {
    text: 'Who decides\nhow fast you go?',
    size: 120,
    scene: 'car-slice',
    camera: {look: [-0.9, 0.62, 0.4], distance: 4.6}, // pedal, foot, wire and computer in view, sky above
    at: 2.2,
    props: {
      ...GAS,
      driving: [{at: 0, speed: M45}],
      foot: [{at: 0, pose: 'accel', press: 0.75}],
      gasPath: {pedalAt: 0.2, drawFor: 0.9},
      gate: [{at: 1, pass: true}],
    },
  },
  scenes: picture.scenes.map((sc, i) => ({...sc, overlays: [...(sc.overlays ?? []), ...(SOUND[i] ?? [])]})),
};
