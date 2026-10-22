import type {OverlaySpec, VideoSpec} from '../../types';

/**
 * No. 006 · The Stoplight, in The Section (style guide v0.12). Rough cut from `av-script.md` (revision 2,
 * owner decisions of 2026-10-21 all approved), re-timed to the recorded take.
 *
 * Two locations, both Day, 5:40 PM, joined by slides:
 *  - K `car-slice` `variant: 'ev'`: YOU's electric car cut open, facing left (the driver's side is the
 *    cut), front drive unit and battery pack as object cut-aways, on a US city lane with corners (a stop
 *    line and a post-mounted signal riding the road scroll). Lines 1–6 and 10–13.
 *  - T `city-slice`: a one-way downtown street cut square to the road, whole cars driving away. Lines 7–9.
 *    Lane 2: YOU stopped at the line, then the follower behind. Lane 3: the creeping car (7), which stays
 *    at the line as the front of the five-car queue (9).
 *
 * Orange only for the regen path (wheel → motor → battery), the brake-light signal path (6) and the
 * dashboard's CHARGE zone (12). Brake lamps are flat red (`brakeLit`), the signal lenses flat.
 *
 * Loop (§ 8): frame 0 and the last frame are K's `pedals` framing, drift 0: the car rolling at
 * 0.27 rev/s with the stop line 0.8 m ahead (in frame), the foot pressing the accelerator (it lifts
 * at 0.4 s and the car stops on the line at ≈ 2.1 s), no
 * orange (scene 13's regen fades out in the hold), the lamps out of frame. The whine is cut across the
 * seam: scene 13 plays its first 0.9 s, scene 1 opens 0.9 s into the same file.
 *
 * Timing: scene starts are cues copied from script.txt. Props inside a scene are seconds into it,
 * rebased from T (video seconds of the recorded take, transcript.json, 69.28 s) with `r()`. Re-check T and
 * every // TIMED value if the voiceover is redone.
 *
 * Illustrative (🎭, disclosed in the post): the front-drive layout, the rotor's speed (×3), the speeds
 * shown, the creeping car (7), the follower (8), the queue (9), the pad thickness, the
 * rust time-lapse, the story time.
 *
 * Sound: our own music bed from frame 0 (1.5 s fade-in), ≈ 9 dB under the dry voice, no duck, no dips (no
 * shake in this video). SFX: the self-made EV
 * whine (`yarn sfx:whine`, 3 s, a glide down from 900 to 200 Hz) under the regen slow-downs: the hook
 * stop, the lift in line 3, the stop at the line (6) and the lift at the end. Levels from measured loudness
 * (voice −21.5 LUFS, music −14.9, whine −18.4): music level −15.6 ≈ 9 dB under the voice; whine −15 ≈ 12 under.
 */

type V3 = [number, number, number];
type Framing = {look: V3; distance: number};

/** Cue times, video seconds, from transcript.json (recorded take). TIMED. */
const T = {
  hook: 0, // Some electric cars stop
  lights: 1.84,
  without: 2.36,
  touching: 3.12,
  so: 4.56, // So what's doing
  say: 6.88, // Say you're driving
  lift1: 8.48, // "lift" (line 3)
  red: 9.52, // "red light comes up"
  wheels: 10.96, // The wheels keep
  spinning: 11.76,
  motor1: 14.24,
  that: 15.12, // That turns the
  generator: 16.56,
  electricity: 18.4,
  slows: 19.32,
  flows: 20.72, // The electricity flows
  flows2: 21.52,
  battery: 22.8,
  andCar: 23.24, // and the car keeps slowing
  slowing: 24.16,
  line: 25.68,
  cant: 26.72, // Some electric cars can't
  press: 31.0,
  either: 32.24, // Either way, the
  foot: 35.04,
  watching: 35.92,
  lights2: 36.72,
  testers: 37.68, // Testers found most
  most: 38.56,
  firmly: 42.92,
  andWith: 43.88, // And with the
  motor2: 44.32,
  regular: 46.48, // your regular brakes
  one: 49.28, // One modeling study
  wear: 50.88,
  n64: 52.16,
  n95: 53.28,
  catch: 56.24, // There's a catch
  rustFrom: 57.4,
  rust: 60.72,
  still: 62.72, // Still, next time
  lift2: 64.0,
  pull: 66.24,
  thats: 67.2, // that's the motor
  charging: 68.08,
  end: 69.28,
};

/** The tail after the last word (s): the loop's hold. */
const TAIL = 1.0;

/** Scene 1: the car at rest on the stop line (s; from the speed keys). TIMED. */
const STOP_AT = 4.3;

/** Video seconds → seconds into the scene that starts at `start`. */
const r = (abs: number, start: number) => Math.round((abs - start) * 100) / 100;

// The scene prop `transition` is not a CSS transition; the Remotion rule can't tell them apart.
// eslint-disable-next-line @remotion/non-pure-animation
const CONTINUE = {transition: 'continue'} as const;
// eslint-disable-next-line @remotion/non-pure-animation
const SLIDE = {transition: 'slide'} as const;

/** A camera key: arrive at framing `f` at `at` s into the scene. */
const key = (at: number, f: Framing, o: {ease?: 'out' | 'inOut' | 'sine'; log?: boolean} = {}) => ({at, ...f, ...o});

// ---------------------------------------------------------------- K framings (car-slice EV, metres; EV_FRAMINGS)

const K_CABIN: Framing = {look: [-0.6, 0.52, 0.4], distance: 10.5};
/** M, frame 0 and the loop (owner, preview 3: open wider): the front tire rolling to the stop line, the two pedals and the
 * foot, and enough of the car to read as a car. */
/** MW, frame 0 and the loop's last frame (owner, preview 4: show the red light at the start): high and ahead, the
 * red signal head at the next corner and the front of the car rolling toward it. One move down and in reaches K_OPEN. */
const K_HIGH: Framing = {look: [-2.6, -0.5, 0], distance: 30};
const K_OPEN: Framing = {look: [-1.0, 0.15, 0.5], distance: 9};
/** C+, lines 2–3: the front of the car close, between `pedals` and `wheel` on the dive: the near front wheel,
 * the drive unit and YOU's foot on the pedals in one frame. */
const K_FRONT: Framing = {look: [-1.0, 0.42, 0.45], distance: 5.0};
/** The dive's scene-end poses: each scene starts from the one before's (cameraKeys start from the preset otherwise). */
const DIVE_2: Framing = {look: [-1.15, 0.44, 0.52], distance: 4.3}; // scene 2's end, on toward the wheel
const DIVE_3: Framing = {look: [-1.29, 0.52, 0.5], distance: 3.0}; // scene 3's end: wheel hub, half-shaft, motor
const DIVE_4: Framing = {look: [-1.2, 0.58, 0.38], distance: 2.0}; // scene 4's end: the motor close
const K_BATTERY: Framing = {look: [-0.42, 0.14, 0.62], distance: 3.2};
/** MW, the EV preset pulled back and lowered so the car clears the captions and the signal head stays under the title block. */
const K_WIDE: Framing = {look: [0.0, 0.9, 0.0], distance: 30};
const K_BRAKE: Framing = {look: [-1.33, 0.3, 0.75], distance: 2.0};
/** C, the preset (0.5 m) opened to 1.1 m so the caliper, the two pads and the disc read as a brake. */
const K_PADS: Framing = {look: [-1.232, 0.291, 0.746], distance: 1.1};
const K_DISC: Framing = {look: [-1.43, 0.33, 0.768], distance: 1.0};

/** MW for scene 9: the wide raised (look y 0.9 → 1.4) so the caption clears YOU's head. */
const K_WIDE_HIGH: Framing = {look: [0.0, 1.4, 0.0], distance: 30};

/** The brake corner's cut-away wedge: open only for the brake act (scenes 9–12; it opens behind the slide into
 * 9, and `wedgeOpen` eases it closed in scene 12), closed (null) for the opening dive and the loop (owner: no
 * wedge at frame 0). */
const WEDGE: [number, number] = [-2.1, -0.45];
/** Every car scene: drift 0 (the idle drift runs on the video clock, so a scene with drift next to one
 * without snapped sideways at the cut), the wedge closed unless a scene opens it. */
const EV = {variant: 'ev', road: 'city', mood: 'day', drift: 0, wedge: null} as const;
const EV_WEDGE = {...EV, wedge: WEDGE} as const;

/** Frame 0's speed (rev/s) and the stop line's distance ahead of the front tire then (m, from the speed keys). TIMED. */
const LOOP_SPEED = 0.66;
const LOOP_AHEAD = 4.48;
/** Scene 1: the foot lifts (s, on "…red lights"). TIMED. */
const LIFT_AT = 1.6;
/** The opening corner's signal post, metres past its stop line (low, so the red head sits in the opening frame). */
const OPEN_POST = 1.2;

/** Regen opened fully lit (a later scene): every leg drawn before the scene starts. */
const REGEN_LIT = {at: -10, rotorAt: -9, windingsAt: -8.8, inverterAt: -8, batteryAt: -7, fullAt: -6} as const;

// ---------------------------------------------------------------- T framings (city-slice, metres; CITY_FRAMINGS)

/** MW, the preset pushed in (56 → 42) and lowered (look y 1.0 → −2.0) so YOU's car clears the caption band. The
 * street framings run lanes → follow → queueClose: the look travels down the street toward the plane and
 * the distance grows each time (42 → 46 → 56), one direction. */
const T_LANES: Framing = {look: [7.15, -2.0, -30.95], distance: 42};
/** MW, the preset's look lowered (y 1.0 → −1.2: a lower look-at lifts the picture) so the follower sits above the caption. */
const T_FOLLOW: Framing = {look: [6.36, -1.6, -22.69], distance: 46};
/** MW, the preset lowered and pulled back so the whole lane-3 queue sits above the captions. */
const T_QUEUE_CLOSE: Framing = {look: [11.6, -1.2, -9.6], distance: 56};

/** YOU and cars already at rest when a T scene starts (lamps lit). */
const YOU_AT_LINE = {lane: 2, body: 'you', liftAt: -12, stopAt: -6, lamps: 'auto'} as const;
const CREEPER_AT_LINE = {lane: 3, liftAt: -12, stopAt: -6, brakeAt: -6} as const;
/** The follower (lane 2): one trajectory across scenes 6 and 7 (same speed, lift and stop in video time). */
const FOLLOWER = {lane: 2, speed: 4.5, lamps: 'auto'} as const;
const FOLLOWER_LIFT = T.cant + 1.5;
const FOLLOWER_STOP = T.lights2;
/** It brakes for the last of its stop, so its lamps are lit and held at rest (a gentle lift alone may not light them). */
const FOLLOWER_BRAKE = T.lights2 - 0.8;

// level = (voice LUFS − 12) − track LUFS = (−21.5 − 12) − (−14.9): a bed ≈ 12 dB under the dry voice, steady (owner,
// preview 5: 9 under was "a bit too loud").
const MUSIC_LEVEL = -18.6;

const picture: VideoSpec = {
  watermark: null,
  tail: TAIL,
  // our own bed (`audio/music.mp3`, 71 s, No. 005's prompt) from frame 0 with a 1.5 s fade-in, no duck, no dips
  // (no "feel it" beat in this video); it fades to silence on the last frame
  music: {level: MUSIC_LEVEL, duckDb: 0, startAt: 0, fadeIn: 1.5},
  scenes: [
    // 1 · Lines 1–2, K. MW → M → C, one way (down and in; no wide again until line 6). Frame 0 frames high: the red
    // signal ahead and the front of the car rolling toward it, the foot on the accelerator. One move down and in
    // reaches the foot framing by 1.4 s; the foot lifts on "…red lights" (1.6 s), never to the brake, and the car
    // slows gradually to rest on the line at ≈ 4.26 s, near "brake". It stays at rest through the question while
    // the camera travels on toward the wheel.
    {
      scene: 'car-slice',
      cue: 'Some electric cars stop',
      props: {
        ...EV,
        framing: 'drive',
        cameraKeys: [
          key(0, K_HIGH),
          key(1.4, K_OPEN, {log: true}), // TIMED: one move down and in, on the foot before the lift (1.6)
          key(STOP_AT + 0.1, K_OPEN), // holds through "touching the brake" until the car is at rest on the line
          key(r(T.say, T.hook), K_FRONT, {ease: 'sine'}), // one move on toward the wheel, arriving at the cut
        ],
        driving: [
          // a gradual one-pedal stop: cruising until the lift (1.6 s), then slowing through line 1 to rest on the
          // line at ≈ 4.26 s, near "brake" (4.48 m from frame 0: nearer the corner, so its red head stays in the
          // wider frame 0 with the whole car)
          {at: 0, speed: LOOP_SPEED},
          {at: LIFT_AT + 0.1, speed: 0.75 * LOOP_SPEED},
          {at: 2.3, speed: 0.5 * LOOP_SPEED},
          {at: 2.9, speed: 0.25 * LOOP_SPEED},
          {at: 3.5, speed: 0},
        ],
        corners: [{ahead: 0, when: STOP_AT, post: OPEN_POST, lights: [{at: 0, state: 'red'}]}],
        // frame 0: on the accelerator (as the loop's last frame); lifted on "…red lights" and never to the brake:
        // "without the driver touching the brake"
        foot: [
          {at: 0, pose: 'accel'},
          {at: LIFT_AT, pose: 'floor'}, // TIMED
        ],
        brakeLights: [
          {at: LIFT_AT + 0.5, value: 0},
          {at: LIFT_AT + 0.9, value: 1},
        ],
      },
      overlays: [
        {
          type: 'title',
          at: 0,
          question: "What's doing the braking?",
          number: 'No. 006',
          title: 'The Stoplight',
          time: '5:40 PM',
          top: 440, // below the red signal head at frame 0 (default 300 covered it), still over sky
          until: "Say you're driving", // the question ends ≈ 6.1; out by the cut (6.88)
        },
      ],
    },
    // 2 · Line 3, K. Still close on the front (wheel, drive unit, foot): the light (off frame) turns green, the
    // lamps go dark, the foot goes back on the accelerator and the car pulls away; the foot lifts on "lift"
    // as the camera drifts on toward the wheel. The red light is seen once, in scene 5's reveal.
    {
      scene: 'car-slice',
      cue: "Say you're driving",
      props: {
        ...EV,
        ...CONTINUE,
        cameraKeys: [
          key(0, K_FRONT),
          key(r(T.lift1, T.say) + 0.6, K_FRONT), // TIMED: holds through the lift (1.6)
          key(r(T.wheels, T.say), DIVE_2, {ease: 'sine'}), // drifting on toward the wheel, arriving at the cut
        ],
        driving: [
          {at: 0, speed: 0},
          {at: 0.3, speed: 2.4},
          {at: 1.7, speed: 1.8}, // TIMED: lifted on "lift" (1.6)
          {at: 3.0, speed: 1.5},
        ],
        corners: [{ahead: 0, when: 0, post: OPEN_POST, lights: [{at: 0.15, state: 'green'}]}], // scene 1's corner
        foot: [
          {at: 0, pose: 'floor'},
          {at: 0.3, pose: 'accel'},
          {at: r(T.lift1, T.say), pose: 'floor'}, // TIMED: "lift"
        ],
        brakeLights: [
          {at: 0, value: 1},
          {at: 0.4, value: 0},
        ],
      },
    },
    // 3 · Line 4, K. Along the dive, pedals → the front wheel's hub with the half-shaft and the drive unit:
    // the orange starts at the hub on "spinning" and reaches the rotor on "motor" (the wheel turning the motor).
    {
      scene: 'car-slice',
      cue: 'The wheels keep',
      props: {
        ...EV,
        ...CONTINUE,
        cameraKeys: [key(0, DIVE_2), key(r(T.that, T.wheels), DIVE_3, {ease: 'sine'})], // one move: past the wheel to hub + motor
        driving: [
          {at: 0, speed: 1.5},
          {at: 2, speed: 1.3},
          {at: 3.2, speed: 1.1}, // reached by the cut (ramp 0.8): scene 4 starts at 1.1
        ],
        regen: {at: r(T.spinning, T.wheels), rotorAt: r(T.motor1, T.wheels), windingsAt: 99}, // TIMED
      },
    },
    // 4 · Line 5, K. Close on the drive unit: the windings light coil by coil on "generator", pulses leave
    // to the inverter and brighten on "electricity"; the rotor slows with the car on "slows".
    {
      scene: 'car-slice',
      cue: 'That turns the',
      props: {
        ...EV,
        ...CONTINUE,
        cameraKeys: [key(0, DIVE_3), key(r(T.flows, T.that), DIVE_4, {ease: 'sine'})], // one move: into the motor
        driving: [
          {at: 0, speed: 1.1},
          {at: r(T.slows, T.that) - 0.2, speed: 1.0}, // TIMED: "slows"
          {at: r(T.slows, T.that) + 0.6, speed: 0.6},
        ],
        regen: {
          at: -4,
          rotorAt: -3,
          windingsAt: r(T.generator, T.that), // TIMED
          inverterAt: r(T.generator, T.that) + 1.2,
          brightAt: r(T.electricity, T.that), // TIMED
          batteryAt: 99,
        },
      },
    },
    // 5 · Line 6, K. The end of the dive: along to the battery, the orange runs down the HV cable on "flows"
    // and the modules fill by "battery"; then the video's first and only pull-out, the reveal: the whole car
    // on "and the car keeps slowing", the red light ahead, the signal path drawing to the rear lamps, which
    // light, and the car stopping on the line on "line". YOU's tag. The wide holds into the slide to the street.
    {
      scene: 'car-slice',
      cue: 'The electricity flows',
      props: {
        ...EV,
        ...CONTINUE,
        cameraKeys: [
          key(0, DIVE_4),
          key(2.0, K_BATTERY, {ease: 'sine'}), // along to the battery as it fills
          key(r(T.andCar, T.flows), K_BATTERY),
          key(r(T.andCar, T.flows) + 1.3, K_WIDE, {log: true}), // the one pull-out: the reveal
        ],
        driving: [
          {at: 0, speed: 0.6},
          {at: 2.5, speed: 0.45},
          {at: 3.4, speed: 0.25},
          {at: 4.1, speed: 0}, // at rest ≈ 4.9 s
        ],
        corners: [{ahead: 0, when: r(T.line, T.flows), post: 1, lights: [{at: 0, state: 'red'}]}], // TIMED: "line"
        regen: {
          at: -10,
          rotorAt: -9,
          windingsAt: -8.8,
          inverterAt: -8,
          brightAt: -5, // as scene 4 ended (bright from "electricity")
          batteryAt: r(T.flows2, T.flows), // TIMED
          fullAt: r(T.battery, T.flows),
        },
        signal: {at: r(T.slowing, T.flows) - 0.3, lampsAt: r(T.slowing, T.flows) + 0.9}, // TIMED: "keeps slowing"
      },
      // YOU's tag on the reveal, the first view of YOU's whole car
      overlays: [{type: 'tag', who: 'you', at: r(T.andCar, T.flows) + 1.2, until: r(T.cant, T.flows) - 0.3}],
    },
    // 6 · Line 7, T (slide). Two lanes at the stop line: YOU stopped in lane 2, lamps lit; in lane 3 a grey
    // car slows and only creeps, until its driver brakes on "press" and it stops at the line.
    {
      scene: 'city-slice',
      cue: "Some electric cars can't",
      props: {
        ...SLIDE,
        framing: 'lanes',
        camera: {from: T_LANES},
        push: 0.04,
        cars: [
          YOU_AT_LINE,
          {...FOLLOWER, liftAt: r(FOLLOWER_LIFT, T.cant), stopAt: r(FOLLOWER_STOP, T.cant), brakeAt: r(FOLLOWER_BRAKE, T.cant)},
          {lane: 3, speed: 8, liftAt: 0.3, stopAt: 2.6, creep: true, lamps: 'auto', brakeAt: r(T.press, T.cant)}, // TIMED
        ],
      },
      // YOU's car re-entering on a new slice. Needs a 'youSpot' anchor in city-slice (YOU's car roof);
      // until then the tag draws nothing (NameTag skips an undefined anchor).
      overlays: [{type: 'tag', who: 'you', at: 0.7, until: 2.5, rise: 50}], // nearer the roof (owner, preview 5)
    },
    // 7 · Line 8, T. Behind YOU's car: the follower rolls up and stops a car-length back as it reaches
    // YOU's lit lamps ("watching your brake lights").
    {
      scene: 'city-slice',
      cue: 'Either way, the',
      props: {
        ...CONTINUE,
        cameraKeys: [key(0, T_LANES), key(1.2, T_FOLLOW, {ease: 'sine'})],
        push: 0.04,
        cars: [
          YOU_AT_LINE,
          {...FOLLOWER, liftAt: r(FOLLOWER_LIFT, T.either), stopAt: r(FOLLOWER_STOP, T.either), brakeAt: r(FOLLOWER_BRAKE, T.either)}, // TIMED
          CREEPER_AT_LINE,
        ],
      },
    },
    // 8 · Line 9, T. Out to the lane-3 queue: behind the car at the line, four more electric cars lift off in
    // turn from "most"; each lights its lamps as it slows and holds them at rest (owner: a stopped car with
    // dark lamps reads as a mistake). All at rest by "firmly".
    {
      scene: 'city-slice',
      cue: 'Testers found most',
      props: {
        ...CONTINUE,
        cameraKeys: [key(0, T_FOLLOW), key(1.4, T_QUEUE_CLOSE, {ease: 'sine'})],
        cars: [
          YOU_AT_LINE,
          {...FOLLOWER, liftAt: -8, stopAt: -2, brakeAt: -2.5},
          CREEPER_AT_LINE,
          {lane: 3, speed: 7, liftAt: r(T.most, T.testers), stopAt: 3.8, lamps: 'auto'}, // TIMED: from "most"
          {lane: 3, speed: 7, liftAt: r(T.most, T.testers) + 0.6, stopAt: 4.4, lamps: 'auto'},
          {lane: 3, speed: 7, liftAt: r(T.most, T.testers) + 1.2, stopAt: 5.0, lamps: 'auto'},
          {lane: 3, speed: 7, liftAt: r(T.most, T.testers) + 1.8, stopAt: 5.2, lamps: 'auto'},
        ],
      },
    },
    // 9 · Line 10, K (slide). YOU's car driving again and lifting off: the orange runs wheel → motor →
    // battery on "motor"; glide to the brake corner on "your regular brakes": the disc spins, the pads stay off.
    {
      scene: 'car-slice',
      cue: 'And with the',
      props: {
        ...EV_WEDGE,
        ...SLIDE,
        camera: {from: K_WIDE_HIGH},
        cameraKeys: [key(0, K_WIDE_HIGH), key(r(T.regular, T.andWith), K_WIDE_HIGH), key(r(T.regular, T.andWith) + 1.3, K_BRAKE, {log: true})],
        driving: [
          {at: 0, speed: 2.4},
          {at: 0.6, speed: 2.0},
          {at: 2, speed: 1.5},
          {at: 4, speed: 1.0},
        ],
        regen: {
          at: r(T.motor2, T.andWith), // TIMED
          rotorAt: r(T.motor2, T.andWith) + 1.0,
          windingsAt: r(T.motor2, T.andWith) + 1.2,
          inverterAt: r(T.motor2, T.andWith) + 1.8,
          batteryAt: r(T.motor2, T.andWith) + 2.4,
          fullAt: r(T.motor2, T.andWith) + 3.4,
        },
      },
    },
    // 10 · Line 11, K. Close on the pads and the disc's swept face (the pads thick, never touching). The
    // Counter: 0 → 64 by "64", "–95 %" on "95".
    {
      scene: 'car-slice',
      cue: 'One modeling study',
      props: {
        ...EV_WEDGE,
        ...CONTINUE,
        framing: 'pads',
        cameraKeys: [key(0, K_BRAKE), key(1.2, K_PADS, {log: true})],
        push: 0.02,
        driving: [
          {at: 0, speed: 1.0},
          {at: 3, speed: 0.7},
          {at: 5.5, speed: 0.4},
        ],
        regen: REGEN_LIT,
      },
      overlays: [
        {
          type: 'counter',
          from: 0,
          to: 64,
          rangeTo: 95,
          rangeAt: r(T.n95, T.wear), // TIMED: "95" after the box enters on "brake wear"
          label: '%',
          sub: 'less brake wear',
          subPlace: 'above',
          x: 0.111,
          y: 0.16,
          duration: r(T.n64, T.wear), // TIMED: lands on "64"
          cue: 'brake wear',
          until: r(T.n95, T.one) + 1.9,
        },
      ],
    },
    // 11 · Line 12, K. Closer on the disc's swept face; the wheel comes to rest (the car parked), then a
    // light brown rust bloom spreads from the edges in, fully there on "rust".
    {
      scene: 'car-slice',
      cue: "There's a catch",
      props: {
        ...EV_WEDGE,
        ...CONTINUE,
        framing: 'disc',
        cameraKeys: [key(0, K_PADS), key(1.2, K_DISC)],
        push: 0.03,
        driving: [
          {at: 0, speed: 0.4},
          {at: 0.3, speed: 0},
        ],
        regen: {...REGEN_LIT, fadeAt: 0.1, fadeFor: 0.9}, // lit as scene 10 ended; fades as the car parks
        rust: [
          {at: r(T.rustFrom, T.catch), value: 0},
          {at: r(T.rust, T.catch), value: 1}, // TIMED: "rust"
        ],
      },
    },
    // 12 · Line 13a, K. The cabin: the foot on the accelerator lifts on "lift"; the orange returns and the
    // cluster swings into CHARGE (read in the detail box: speed falling, CHARGE orange); YOU sways
    // forward on "pull back".
    {
      scene: 'car-slice',
      cue: 'Still, next time',
      props: {
        ...EV_WEDGE,
        ...CONTINUE,
        cameraKeys: [key(0, K_DISC), key(1.4, K_CABIN, {log: true})],
        push: 0.03,
        driving: [
          {at: 0, speed: 0}, // parked at the cut (scene 11), pulling away as the camera glides up
          {at: 0.1, speed: 2.6},
          {at: r(T.lift2, T.still) + 0.1, speed: 2.3}, // TIMED: "lift"
          {at: r(T.lift2, T.still) + 1.2, speed: 2.0},
          {at: r(T.lift2, T.still) + 2.3, speed: 1.8},
        ],
        foot: [
          {at: 0, pose: 'accel'},
          {at: r(T.lift2, T.still), pose: 'floor'}, // TIMED
        ],
        // as scene 11 ended, then fading out once the camera has landed on the cabin (the disc small and half hidden
        // there): the wider frame 0 shows the disc, so the loop's last frame must be rust-free like frame 0
        rust: [
          {at: 1.6, value: 1},
          {at: 3.2, value: 0},
        ],
        // the wedge eases closed in the same window, after the camera lands on the cabin, so scene 13 (and the
        // loop's last frame, like frame 0) has none and the 12 → 13 cut doesn't pop
        wedgeOpen: [
          {at: 1.6, value: 1},
          {at: 3.0, value: 0},
        ],
        regen: {
          at: r(T.lift2, T.still) + 0.1,
          rotorAt: r(T.lift2, T.still) + 0.9,
          windingsAt: r(T.lift2, T.still) + 1.1,
          inverterAt: r(T.lift2, T.still) + 1.7,
          batteryAt: r(T.lift2, T.still) + 2.3,
          fullAt: r(T.lift2, T.still) + 3.1,
        },
        power: [
          {at: 0, value: 0.4},
          {at: r(T.lift2, T.still), value: 0.4},
          {at: r(T.lift2, T.still) + 0.6, value: -0.7},
        ],
        gestures: [{pose: 'lean', at: r(T.pull, T.still) - 0.2, hold: 0.9, blend: 0.5}], // TIMED: "pull back"
      },
      overlays: [
        {
          type: 'detail',
          who: 'you',
          content: 'ev-dashboard',
          side: 'left',
          size: 300,
          top: 560,
          speed: [
            {at: 0, value: 28},
            {at: 0.4, value: 28},
            {at: 2.8, value: 19},
          ],
          power: [
            {at: 0, value: 0.4},
            {at: 0.3, value: 0.4},
            {at: 0.9, value: -0.7},
          ],
          cue: 'lift your foot', // TIMED: 64.0
          until: r(T.thats, T.still) - 0.3,
        },
      ],
    },
    // 13 · Line 13b, K. One glide down from the cabin to the pedals, frame 0's picture: the orange brightens on "charging", fades in the
    // hold; the car rolls on at frame 0's speed with the stop line where it was on frame 0. Drift 0.
    {
      scene: 'car-slice',
      cue: "that's the motor",
      props: {
        ...EV,
        ...CONTINUE,
        cameraKeys: [key(0, K_CABIN), key(1.4, K_HIGH, {log: true})], // up and ahead to frame 0's picture
        driving: [
          {at: 0, speed: 1.8},
          {at: 1.0, speed: LOOP_SPEED},
        ],
        // the last frame is 91 frames into the scene (2016 → 2107): the line LOOP_AHEAD ahead, as on frame 0
        corners: [{ahead: LOOP_AHEAD, when: 91 / 30, post: OPEN_POST, lights: [{at: 0, state: 'red'}]}],
        // lifted while the motor charges; back on the accelerator in the hold as the orange fades (the
        // light ahead is green), so the last frame matches frame 0
        foot: [
          {at: 0, pose: 'floor'},
          {at: r(T.end, T.thats) + 0.1, pose: 'accel'}, // in by ≈ 2.7 s of the 3.03
        ],
        // scene 12's lean carried over: YOU starts leaned and eases upright over 0.24 → 0.74 s, as scene 12's
        // gesture would have. It starts at −0.99 s, not its true −1.16: gestures blend in time order and the scene's
        // own 'drive' pose sits at −1, so an earlier lean would be blended over by it (fully in by −0.49 s either way)
        gestures: [{pose: 'lean', at: -0.99, hold: 0.73, blend: 0.5}],
        regen: {...REGEN_LIT, brightAt: r(T.charging, T.thats), fadeAt: r(T.end, T.thats) + 0.1, fadeFor: 0.7}, // TIMED
      },
    },
  ],
};

// ---------------------------------------------------------------- sound

// SFX volumes are file-level offsets; "≈ N under" = voice (−21.5) − (file LUFS + volume). Volumes stay ≤ 0.
// The whine (3.03 s, mono, −18.4 LUFS, peak −8.7 dBTP; self-made, `yarn sfx:whine one-pedal`): −15 ≈ 12 under the
// voice, level with the bed (12 under), so the short glide reads over it.
const WHINE = {type: 'sfx', name: 'whine', volume: -15} as const;
// The lamp click (0.39 s, ≈ −26 LUFS over the click, peak −5.3 dBTP): −10.5 ≈ 15 under. When YOU's brake lamps light by
// themselves (scene 1's stop, scene 5's reveal).
const CLICK = {type: 'sfx', name: 'lamp-click', volume: -10.5} as const;
// The brake squeak (1.5 s, −17.3 LUFS, peak −4.8 dBTP): −19 ≈ 15 under. The creeping car's brake at "press".
const SQUEAK = {type: 'sfx', name: 'squeak', volume: -19} as const;
// The street ambience (10 s loop, −33.8 LUFS, peak −16.7 dBTP): −5.5 ≈ 18 under the voice, 6 under the bed.
const CITY = {type: 'sfx', name: 'city', volume: -5.5} as const;
// The charge tone (2.5 s, rising 300 → 700 Hz, −20.4 LUFS, peak −14.1 dBTP): −16 ≈ 15 under. The battery filling.
const CHARGE = {type: 'sfx', name: 'charge', volume: -16} as const;

/** Sound per scene (index in `scenes`), seconds into the scene. TIMED against the props above. */
const SOUND: Record<number, OverlaySpec[]> = {
  // 1: the hook stop, from the lift on "…red lights"; the click as the lamps light by themselves
  0: [{...WHINE, at: LIFT_AT, fade: 0.1}, {...CLICK, at: LIFT_AT + 0.7}],
  // 2: the lift on "lift", faded out at the cut
  1: [{...WHINE, at: r(T.lift1, T.say), fade: 0.1, until: r(T.wheels, T.say) - 0.05}],
  // 5: slowing to the line ("and the car keeps slowing … line")
  4: [
    {...CHARGE, at: r(T.flows2, T.flows) - 0.2, fade: 0.15}, // the modules filling ("flows" → "battery")
    {...WHINE, at: r(T.andCar, T.flows), fade: 0.1},
    {...CLICK, at: r(T.slowing, T.flows) + 0.9}, // the lamps light at the signal path's end
  ],
  // 6–8: the street, one looped bed from the slide in to the slide out (fades over both); the squeak at "press"
  5: [
    {...CITY, at: 0, loop: true, fade: 0.6, until: 'And with the'},
    {...SQUEAK, at: r(T.press, T.cant)},
  ],
  // 12: the lift at the end
  11: [{...WHINE, at: r(T.lift2, T.still), fade: 0.1}],
  // 13: the charge on "charging", faded out with the orange in the hold, silent before the loop's last frame
  12: [{...CHARGE, at: r(T.charging, T.thats) - 0.1, fade: 0.3, until: r(T.end, T.thats) + 0.8}],
};

export const spec: VideoSpec = {
  ...picture,
  // Cover still (`yarn cover one-pedal`): YOU's car at rest on the stop line under the red signal, the foot off
  // the pedal (never on the brake), lamps lit. Text in the sky band, two lines.
  cover: {
    text: 'Who is doing\nthe braking?',
    size: 130,
    scene: 'car-slice',
    camera: {look: [0.2, 2.58, 0.4], distance: 21}, // the whole car; the signal head ≥ 40 px under the text (owner, preview 5)
    at: STOP_AT + 0.4,
    props: {
      ...EV,
      framing: 'drive',
      driving: [{at: 0, speed: 0}],
      corners: [{ahead: 0, when: 0, post: OPEN_POST, lights: [{at: 0, state: 'red'}]}],
      foot: [{at: 0, pose: 'floor'}],
      brakeLights: [{at: 0, value: 1}],
    },
  },
  scenes: picture.scenes.map((sc, i) => ({...sc, overlays: [...(sc.overlays ?? []), ...(SOUND[i] ?? [])]})),
};
