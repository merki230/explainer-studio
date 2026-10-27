import type {OverlaySpec, VideoSpec} from '../../types';

/**
 * No. 005 · The Shoulder, in The Section (style guide v0.11.3). Rough cut from `av-script.md` (owner
 * decisions of 2026-10-18, all seven approved as recommended), re-timed to the recorded take.
 *
 * Three locations, all Night, 11:40 PM, joined by slides:
 *  - H `highway-slice`: the interstate cut square to the road, traffic driving away, the signs facing the
 *    camera, YOU's car whole. Lines 1–3, 7, 11 (the loop).
 *  - C `car-slice` with `road: 'highway'`: the car cut along its near side on the shoulder, the cut face
 *    along the groove row (the dips). Lines 4–6: the drop in slow motion, the hum, the vibration path.
 *  - L `musical-road`: a generic two-lane desert road with groove groups (🎭 layout) and one house.
 *    Lines 8–10. No map, logo, sign or road name.
 *
 * Sizes: C close, M medium, MW medium-wide, W wide. Every framing change inside a location is a camera
 * key (a glide); a location change is a `slide`.
 *
 * Loop (§ 8): frame 0 and the last frame are H's `tire` close-up, drift 0, YOU's right-rear tire just
 * inside the white line (lateral −0.1), grooves dark, no flash. The car drifts onto the row at the start
 * and steers back off it at the end ("steer back").
 *
 * Timing: scene starts are cues copied from script.txt. Props inside a scene are seconds into it,
 * rebased from T (video seconds of the recorded take, transcript.json, 58.56 s) with `r()`. Re-check T and
 * every // TIMED value if the voiceover is redone.
 *
 * Illustrative (🎭, disclosed in the post): the mile number, the guide sign's legend, the five tire tracks
 * (7), the slow motion (4), the vibration path's route (6), the groove-group layout and the tune as drawn (L).
 *
 * Sound (style guide § 9; No. 004's pattern): one music bed from frame 0 (1.5 s fade-in), ≈ 9 dB under the dry
 * voice, no duck, faded to silence on the last frame. SFX by scene (SOUND): the self-made rumble while the
 * tires are on the row at real speed (1, 4–6, 11–12) at ≈ 10 dB under the voice, an owner-driven deviation
 * from the guide's 12–19 ("much higher and much more brutal"); slow tire thumps under the slow-motion drop
 * (3), the light switch at "neighbors" (10) and the off-key groove tune on the Lancaster drive (9), 17–23 dB
 * under. The 4 s rumble is chained across scene cuts: a non-looping instance with no `until` fades in and
 * plays its file out, the next one starts 0.4 s before it ends (fading in), and the last one fades out as
 * the tires leave the row. Levels from measured loudness (voice −21.9 LUFS; music −16.5; rumble −12.45,
 * thump −39.5, switch −45.2, tune −11.0): re-check if a file is replaced. Nothing sounds after ≈ 58.2 s, so
 * the loop is clean.
 *
 * Sign lettering is Inter 700 until the highway font is added.
 */

type V3 = [number, number, number];
type Framing = {look: V3; distance: number};

/** Cue times, video seconds, from transcript.json (recorded take). TIMED. */
const T = {
  hook: 0, // Drift toward the edge
  road: 2.48, // "road" (first drop)
  yelling: 3.84,
  how: 5.17, // How does a road
  look: 7.52, // Look at the shoulder
  where: 8.72,
  half: 10.36, // half an inch
  tires: 12.68, // Your tires drop
  drop: 13.28,
  squeezes: 15.04,
  air: 16.48,
  at60: 18.28, // At 60 miles
  sixty: 18.52,
  n88: 20.28,
  blurs: 22.16, // so fast it blurs
  feel: 25.64, // You feel it
  wheel: 26.96,
  seat: 27.44,
  which: 28.08,
  drowsy: 29.04,
  distracted: 29.6,
  rural: 31.44, // On rural freeways
  studies: 32.8,
  fifth: 34.48,
  pitch: 37.12, // The pitch depends
  speed: 38.32,
  means: 40.16, // which means the right gaps
  lancaster: 43.02, // In Lancaster, California
  but: 47.72, // but it kept neighbors
  neighbors: 48.52,
  moved: 49.56,
  city: 50.6, // And the city says
  notes: 51.68,
  next: 53.12, // Next time your car
  roars: 54.16,
  thats: 56.24, // that's the road telling
  steer: 57.6,
};

/** Video seconds → seconds into the scene that starts at `start`. */
const r = (abs: number, start: number) => Math.round((abs - start) * 100) / 100;

// The scene prop `transition` is not a CSS transition; the Remotion rule can't tell them apart.
// eslint-disable-next-line @remotion/non-pure-animation
const CONTINUE = {transition: 'continue'} as const;
// eslint-disable-next-line @remotion/non-pure-animation
const SLIDE = {transition: 'slide'} as const;

const NIGHT = {mood: 'night'} as const;

/** A camera key: arrive at framing `f` at `at` s into the scene. */
const key = (at: number, f: Framing, o: {ease?: 'out' | 'inOut' | 'sine'; log?: boolean} = {}) => ({at, ...f, ...o});

// ---------------------------------------------------------------- H framings (metres)

/** C, frame 0 and the last frame: the right-rear tire just inside the white line (the look-at lowered 0.57 m so the tire, the cut groove and the lit band clear the captions). */
const H_TIRE: Framing = {look: [0.1, -0.22, -1.0], distance: 8.5};
/** MW: YOU's car and the right carriageway, the 65 sign (the preset lowered so the car clears the captions). */
const H_MW: Framing = {look: [0.6, -3.2, -5.3], distance: 55};
/** W, tighter than the preset (review note 1), no car (line 7): the lanes and the row up to the guide sign, the tracks in the middle. */
const H_WIDE: Framing = {look: [3.6, -2.0, -22], distance: 70};
/** W for the question (line 2): YOU's car on the edge kept in frame above the captions; MILE 112 drops out at the right. */
const H_WIDE_Q: Framing = {look: [0.4, -2.0, -12], distance: 72};
/** M: the shoulder band, white line to gravel. */
const H_SHOULDER: Framing = {look: [1.55, -0.6, -1.8], distance: 23};
/** C: the groove cut on the face, the next ones behind. */
const H_GROOVE: Framing = {look: [0.48, -0.03, -0.14], distance: 2.3};

/** YOU's car's lateral position: −0.1 just inside the white line, 0.55 both right tires on the row, −0.9 lane centre. */
const INSIDE = -0.1;
const ON_ROW = 0.55;

// ---------------------------------------------------------------- C framings (car-slice, metres)

/** Slow motion: 60 mph slowed ≈ 66× so ≈ 1.3 drops a second (review note 2: slower than the test's 2). */
const SLOW = 0.015;
const C_FRONT_TIRE: Framing = {look: [1.35, -0.09, 0.8], distance: 4.6};
const C_CONTACT: Framing = {look: [1.35, -0.055, 0.8], distance: 2.0};
const C_LOW_WHEELS: Framing = {look: [0, 0.15, 0.8], distance: 12.5};
const C_WIDE: Framing = {look: [0.05, -0.45, 0.1], distance: 21};
/** The cabin, pulled back and lowered so the whole path (front tire → wheel, seat) sits above the captions. */
const C_CABIN: Framing = {look: [0.6, -0.15, -0.1], distance: 15};
const C_CABIN_CLOSE: Framing = {look: [0.5, -0.1, -0.3], distance: 13.5};
const C_HWY = {...NIGHT, road: 'highway', drift: 0.04, clusterSpeed: 60, tireLight: false} as const;

// ---------------------------------------------------------------- L framings (musical-road, metres)

const L_ROAD: Framing = {look: [-1.5, -1.3, -1], distance: 24};
const L_NOTES: Framing = {look: [0.5, -0.5, 0], distance: 23};
const L_WIDE: Framing = {look: [-6, 2.2, -5], distance: 50};
/** W-ish: the house and the start of the strip, for "kept neighbors up … got moved". */
const L_HOUSE_ROAD: Framing = {look: [-7, 1.6, -5], distance: 48};

/** The tune's notes per groove group (step on the staff: wider spacing → lower, tighter → higher). */
const STEP = [1, 3, 5, 1, 6, 3, 5, 8];
/** The staff's top line (fraction of the frame): a little above the default so it clears the car roof and the house. */
const STAFF_Y = 0.16;

// level = (voice LUFS − 9) − track LUFS = (−21.9 − 9) − (−16.5): a bed ≈ 9 dB under the dry voice, steady.
const MUSIC_LEVEL = -14.5;

const picture: VideoSpec = {
  // posted video: wheels exactly as published (`three/real/wheelMotion.ts`); new videos leave this out
  wheels: 'legacy',
  watermark: null,
  // Cover still (`yarn cover rumble-strips`): the highway at night, YOU's right tires on the row, the groove
  // ribbon lit orange under the rear tire (impacts blurred into one band). Text in the sky band, two lines.
  cover: {
    text: 'Why the road\nyells at you',
    size: 130,
    scene: 'highway-slice',
    camera: {look: [0.4, 0.4, -1.5], distance: 16},
    at: 2,
    props: {
      ...NIGHT,
      drift: 0,
      car: {lateral: [{at: 0, value: ON_ROW}]},
      impacts: {at: 0, rate: 6, blur: 1},
    },
  },
  // from frame 0 (startAt: 0), 1.5 s fade-in, out to silence at the end
  // dips (video s): the bed drops ≈ 11 dB while the tires are on the row at real speed, so the rumble takes
  // over ("I want the viewer to feel it"); a gentle 4 dB under the Lancaster tune. TIMED with SOUND.
  music: {
    level: MUSIC_LEVEL,
    duckDb: 0,
    startAt: 0,
    fadeIn: 1.5,
    dips: [
      {from: 2.0, to: T.look - 0.15, db: 11}, // scene 1: from the row lighting to the cut
      {from: T.at60 + 1.1, to: T.feel + 4.9, db: 11}, // scenes 4–6: speed ramp → the band dark after leaveAt
      {from: T.roars - 0.2, to: T.steer + 0.5, db: 11}, // scenes 11–12: "roars" → off the row
      {from: T.lancaster + 0.5, to: T.but - 0.3, db: 4}, // scene 9: the tune
    ],
  },
  scenes: [
    // 1 · Lines 1–2, H. C → MW → W. Frame 0: the right-rear tire just inside the white line; it drifts onto
    // the row at "edge", drops from "road" (orange flashes, slowed to 6 a second), the camera pulls back to the
    // car and the 65 sign on "yelling", then on to the tighter wide on the question. The flashes blur into
    // the band as the wide lands.
    {
      scene: 'highway-slice',
      cue: 'Drift toward the edge',
      props: {
        ...NIGHT,
        framing: 'tire',
        drift: 0,
        cameraKeys: [
          key(0, H_TIRE),
          key(3.3, H_TIRE), // TIMED: holds through the first drops ("road" 2.48)
          key(5.0, H_MW, {log: true}), // TIMED: out on "yelling" (3.84)
          key(6.4, H_WIDE_Q, {log: true}), // TIMED: the question (5.17 → 6.9)
        ],
        car: {
          lateral: [
            {at: 0, value: INSIDE},
            {at: 0.7, value: INSIDE},
            {at: 2.3, value: ON_ROW}, // TIMED: crosses the line on "edge" (0.80 → 1.4)
          ],
        },
        impacts: {
          at: 2.4,
          rate: 6,
          blur: [
            {at: 5.6, value: 0},
            {at: 6.6, value: 1},
          ],
        },
        // "feel it": the tremble (only while the right tires are on the row, so frame 0 is still), a kick on the first hit
        shake: [
          {at: 1.9, value: 0},
          {at: 2.5, value: 1},
        ],
        shakeKick: [2.45], // TIMED: the first drop ("road" 2.48)
      },
      overlays: [
        {
          type: 'title',
          at: 0,
          question: 'How does a road\nmake that noise?',
          number: 'No. 005',
          title: 'The Shoulder',
          time: '11:40 PM',
          until: 'Look at the shoulder', // faded by the cut (7.52); the question ends ≈ 6.9
        },
      ],
    },
    // 2 · Line 3, H. M → C. Glide down to the shoulder on "Look" as the car steers back into its lane (the
    // row goes dark), then in to the groove cut on the face on "where". The car slows out of frame so the
    // grooves read one by one. One callout: the depth, with the spacing as its sub-line.
    {
      scene: 'highway-slice',
      cue: 'Look at the shoulder',
      props: {
        ...NIGHT,
        ...CONTINUE,
        drift: 0,
        cameraKeys: [
          key(0.8, H_SHOULDER),
          key(r(T.where, T.look), H_SHOULDER),
          key(r(T.where, T.look) + 1.0, H_GROOVE),
        ],
        car: {
          lateral: [
            {at: 0, value: ON_ROW},
            {at: 0, value: ON_ROW},
            {at: 1.0, value: -0.9}, // off the row ≈ 0.25 s in, just after the scene-1 roar has faded
          ],
          speed: [
            {at: 0, speed: 26.8},
            {at: 1.4, speed: 0}, // out of frame once the groove close-up lands
          ],
        },
        impacts: {at: 0, rate: 6, blur: 1},
        shake: 1, // until the tires leave the row (≈ 0.25 s in)
      },
      overlays: [
        {
          type: 'callout',
          size: 1.2,
          anchor: 'grooveDepth',
          x: 0.5,
          y: 0.55,
          place: 'side',
          dx: 150,
          dy: -260,
          title: '½ inch deep',
          sub: '1 foot apart',
          cue: 'half an inch', // TIMED: 10.36
        },
      ],
    },
    // 3 · Line 4, C (slide). The near front tire cut at its mid-plane on the dips, in slow motion (≈ 1.3
    // drops a second); in to the contact patch on "drop", the tread squeezes into each dip on "squeezes",
    // the trapped air fills orange and puffs out on "air".
    {
      scene: 'car-slice',
      cue: 'Your tires drop',
      props: {
        ...C_HWY,
        ...SLIDE,
        framing: 'frontTire',
        cameraKeys: [key(0, C_FRONT_TIRE), key(0.4, C_FRONT_TIRE), key(r(T.drop, T.tires) + 0.8, C_CONTACT)],
        timeScale: SLOW,
        impactsAt: 0,
        squeezeAt: r(T.squeezes, T.tires), // TIMED
        airAt: r(T.air, T.tires), // TIMED
      },
    },
    // 4 · Line 5a, C. Back out to both near wheels as the slow motion ramps to real speed. The dashboard
    // read in the detail box (60 mph; the sign said 65), then the counter: 88 a second.
    {
      scene: 'car-slice',
      cue: 'At 60 miles',
      props: {
        ...C_HWY,
        ...CONTINUE,
        cameraKeys: [key(0, C_CONTACT), key(0.9, C_LOW_WHEELS)],
        timeScale: [
          {at: 0, value: SLOW},
          {at: 1.6, value: 1},
        ],
        impactsAt: 0,
        squeezeAt: 0,
        airAt: 0,
        // the tremble ramps up with the speed (none in the slow motion)
        shake: [
          {at: 0.2, value: 0},
          {at: 1.6, value: 1},
        ],
      },
      overlays: [
        // right margin, below YOU's head (size 280, top 560): the head stays clear while the camera glides out
        {
          type: 'detail',
          who: 'you',
          content: 'dashboard',
          speed: 60,
          tireLight: false,
          side: 'right',
          size: 280,
          top: 560,
          cue: '60 miles',
          until: '88 times',
        },
        {
          type: 'counter',
          from: 0,
          to: 88,
          label: 'a second',
          x: 0.111,
          y: 0.16,
          duration: 1.0,
          cue: '88 times', // TIMED: 20.28
        },
      ],
    },
    // 5 · Line 5b, C. Pull back to the whole car: the drops blur into one orange band under each near tire.
    {
      scene: 'car-slice',
      cue: 'so fast it blurs',
      props: {
        ...C_HWY,
        ...CONTINUE,
        cameraKeys: [key(0, C_LOW_WHEELS), key(1.2, C_WIDE)],
        impactsAt: 0,
        squeezeAt: 0,
        airAt: 0,
        shake: 1,
      },
    },
    // 6 · Line 6, C. Glide to the cabin: the vibration path draws to the steering wheel on "wheel" and the
    // seat on "seat" (nothing labelled; no suspension label). YOU's tag on the first clear view. Then a slow
    // push on YOU: nodded off on "drowsy", jolts upright as the buzz lands, the car leaves the grooves.
    {
      scene: 'car-slice',
      cue: 'You feel it',
      props: {
        ...C_HWY,
        ...CONTINUE,
        cameraKeys: [key(0, C_WIDE), key(0.8, C_CABIN), key(2.5, C_CABIN), key(5.4, C_CABIN_CLOSE, {ease: 'sine'})],
        impactsAt: 0,
        squeezeAt: 0,
        airAt: 0,
        vibration: {at: 0.2, wheelAt: r(T.wheel, T.feel), seatAt: r(T.seat, T.feel) + 0.3}, // TIMED
        shake: 1, // stops with leaveAt (the scene gates it on the row)
        gestures: [
          {pose: 'nod-off', at: r(T.which, T.feel), hold: 0.9, blend: 0.6}, // TIMED: nodded by "drowsy"
          {pose: 'jolt', at: r(T.distracted, T.feel), hold: 1.4, blend: 0.3}, // TIMED
        ],
        leaveAt: r(T.distracted, T.feel) + 0.6,
      },
      overlays: [{type: 'tag', who: 'you', at: 0.9, until: 2.5}],
    },
    // 7 · Line 7, H (slide). The tighter wide, no YOU: five grey ink tire tracks drift toward the shoulder,
    // flashing where they cross the row; the fifth bends back into the lane on "a fifth". Counter: up to 20%.
    {
      scene: 'highway-slice',
      cue: 'On rural freeways',
      props: {
        ...NIGHT,
        ...SLIDE,
        drift: 0,
        camera: {from: H_WIDE},
        car: null,
        traffic: [],
        tracks: {at: [0.7, 1.15, 1.6, 2.05, 2.5], back: 4}, // TIMED: from "studies" (1.36), the fifth bends ≈ "a fifth" (3.04)
      },
      overlays: [
        {
          type: 'counter',
          from: 0,
          to: 20,
          label: '% fewer',
          sub: 'up to',
          subPlace: 'above',
          x: 0.111,
          y: 0.16,
          duration: 1.0,
          cue: 'a fifth', // TIMED: 34.48
          until: r(T.pitch, T.rural) - 0.2, // gone ≈ 0.2 s before the slide
        },
      ],
    },
    // 8 · Line 8, L (slide). The desert road with groove groups at different spacings; a grey car crosses,
    // each groove lighting as the tire hits it; it speeds up on "speed". On "which means" the camera rises to
    // the sky band and the staff starts: a note rises from each group the tire crosses.
    {
      scene: 'musical-road',
      cue: 'The pitch depends',
      props: {
        ...NIGHT,
        ...SLIDE,
        framing: 'road',
        track: 0.6,
        cameraKeys: [key(0, L_ROAD), key(r(T.means, T.pitch), L_ROAD), key(r(T.means, T.pitch) + 0.9, L_NOTES)],
        car: {
          from: -6,
          speed: [
            {at: 0, speed: 3.0},
            {at: r(T.speed, T.pitch), speed: 4.5}, // TIMED: "speed"
          ],
        },
      },
      overlays: [
        {
          type: 'staff',
          y: STAFF_Y,
          cue: 'which means the right gaps', // 40.16 = 3.04 into the scene
          // groups 4–7 are hit at ≈ 3.37, 3.9, 4.47, 5.0 s into the scene (car from −6, 3.0 → 4.5 m/s)
          notes: [
            {at: 0.33, step: STEP[4], from: 'group:4'},
            {at: 0.86, step: STEP[5], from: 'group:5'},
            {at: 1.43, step: STEP[6], from: 'group:6'},
            {at: 1.96, step: STEP[7], from: 'group:7'},
          ],
        },
      ],
    },
    // 9 · Line 9a, L. Pull back to the wide as the car drives on out of frame; the staff runs the gallop
    // rhythm (simplified, a few notes). The same car as scene 8 (a second car would make the first pop out
    // at the cut).
    {
      scene: 'musical-road',
      cue: 'In Lancaster, California',
      props: {
        ...NIGHT,
        ...CONTINUE,
        cameraKeys: [key(1.8, L_WIDE)],
        car: {from: 18.15, speed: [{at: 0, speed: 4.5}]}, // scene 8's end (−6 + 24.15 m)
        // the whole strip glows while the tune plays (the car has passed), dark again by the cut
        grooveLit: [
          {at: 0, value: 0},
          {at: 0.8, value: 0.6},
          {at: 3.8, value: 0.6},
          {at: 4.6, value: 0},
        ],
      },
      overlays: [
        {
          type: 'staff',
          y: STAFF_Y,
          at: 0.3,
          until: 'but it kept neighbors',
          // the gallop "da-da-dum" twice, then "da-da" and the run up
          notes: [
            {at: 0.0, step: 4, kind: 'eighth', gap: 0.5},
            {at: 0.15, step: 4, kind: 'eighth', gap: 0.5},
            {at: 0.3, step: 4},
            {at: 0.7, step: 4, kind: 'eighth', gap: 0.5},
            {at: 0.85, step: 4, kind: 'eighth', gap: 0.5},
            {at: 1.0, step: 4},
            {at: 1.4, step: 4, kind: 'eighth', gap: 0.5, bar: true},
            {at: 1.55, step: 4, kind: 'eighth', gap: 0.5},
            {at: 1.7, step: 7},
            {at: 2.2, step: 8},
            {at: 2.7, step: 9, kind: 'half'},
          ],
        },
      ],
    },
    // 10 · Lines 9b–10, L. To the house and the start of the strip: the bedroom window lights on "neighbors",
    // the grooved strip lifts out and slides away on "got moved". On "And the city says" the staff comes back
    // and two notes slide off their lines on "the notes are off".
    {
      scene: 'musical-road',
      cue: 'but it kept neighbors',
      props: {
        ...NIGHT,
        ...CONTINUE,
        cameraKeys: [key(0.9, L_HOUSE_ROAD)],
        car: null, // long gone (x ≈ 39 by scene 9's end)
        windowOn: r(T.neighbors, T.but), // TIMED
        moved: {at: r(T.moved, T.but), style: 'slide'}, // TIMED
      },
      overlays: [
        {
          type: 'staff',
          y: STAFF_Y,
          cue: 'And the city says',
          notes: [
            {at: 0.0, step: 4},
            {at: 0.12, step: 4},
            {at: 0.24, step: 6},
            {at: 0.36, step: 7, detune: {at: 1.08}}, // TIMED: "notes" (51.68 = 1.08 after the staff)
            {at: 0.48, step: 5, detune: {at: 1.3, by: 0.5, tilt: -12}},
          ],
        },
      ],
    },
    // 11 · Line 11a, H (slide). Back on the interstate: YOU's car on the row, flashes, then the band on "roars";
    // the camera starts down toward the tire.
    {
      scene: 'highway-slice',
      cue: 'Next time your car',
      props: {
        ...NIGHT,
        ...SLIDE,
        drift: 0,
        cameraKeys: [key(0, H_MW), key(1.6, H_MW), key(3.12, {look: [0.3, 0.2, -2.4], distance: 22}, {log: true})],
        car: {lateral: ON_ROW},
        impacts: {
          at: 0,
          rate: 6,
          blur: [
            {at: r(T.roars, T.next) - 0.3, value: 0},
            {at: r(T.roars, T.next) + 0.5, value: 1},
          ],
        },
        shake: [
          {at: r(T.roars, T.next) - 0.5, value: 0},
          {at: r(T.roars, T.next), value: 1},
        ],
        shakeKick: [r(T.roars, T.next)], // TIMED: "roars"
      },
    },
    // 12 · Line 11b, H. Lands on frame 0's framing; on "steer back" the car steers left, the tire climbs off the
    // row and crosses back inside the white line: the last frame is frame 0's picture (drift 0).
    {
      scene: 'highway-slice',
      cue: "that's the road telling",
      props: {
        ...NIGHT,
        ...CONTINUE,
        drift: 0,
        cameraKeys: [key(1.1, H_TIRE, {log: true})],
        car: {
          lateral: [
            {at: 0, value: ON_ROW},
            {at: r(T.steer, T.thats), value: ON_ROW}, // TIMED: "steer" (57.60)
            {at: r(T.steer, T.thats) + 1.2, value: INSIDE},
          ],
        },
        impacts: {
          at: 0,
          rate: 6,
          blur: [
            {at: 0, value: 1},
            {at: 0.9, value: 0},
          ],
        },
        shake: 1, // stops as the tire leaves the row after "steer back"; the last frame is still
      },
    },
  ],
};

// ---------------------------------------------------------------- sound

// SFX volumes are file-level offsets; "≈ N under" = voice (−21.9) − (file LUFS + volume). Volumes stay ≤ 0
// (the renderer's volume runs 0 → 1).
// The rumble (4 s, mono, −12.45 LUFS, peak −7.3 dBTP; self-made, `yarn sfx:rumble rumble-strips --lufs -12 --drive 4
// --attack 6 --pitch 2.1 --reso 220 --cutoff 1200`): −19.5 ≈ 10 under, the owner's call ("much higher and much
// more brutal"), louder than the guide's 12–19. `roar.mp3` (ElevenLabs, rejected) was deleted; its record stays in audio-log.md.
const ROAR = {type: 'sfx', name: 'rumble', volume: -19.5} as const;
const ROAR_LEN = 4;
// Slow tire thumps (2 s, −39.5 LUFS, about 4 hits): 0 ≈ 18 under.
const THUMP = {type: 'sfx', name: 'thump', volume: 0} as const;
// The light switch (1 s, −45.2 LUFS): 0 ≈ 23 under, the loudest this file can go (see the report).
const SWITCH = {type: 'sfx', name: 'switch', volume: 0} as const;
// The off-key groove tune (5 s, −11.0 LUFS): −28 ≈ 17 under, so it doesn't mask the line.
const TUNE = {type: 'sfx', name: 'tune', volume: -28} as const;

/** Scene start times (video s) for the roar chains. TIMED. */
const S1 = T.hook;
const S4 = T.at60;
const S5 = T.blurs;
const S6 = T.feel;
const S11 = T.next;
const S12 = T.thats;

/** Sound per scene (index in `scenes`), seconds into the scene. TIMED against the props above. */
const SOUND: Record<number, OverlaySpec[]> = {
  // 1: the roar from the row lighting (≈ 1.9 s) to the cut; the car steers off at the start of scene 2
  0: [
    {...ROAR, at: 1.9, fade: 0.4},
    {...ROAR, at: 1.9 + ROAR_LEN - 0.4 - S1, fade: 0.4, loop: true, until: r(T.look, S1)},
  ],
  // 3: slow thumps under the slow-motion drop (≈ 1.3 drops a second; looped, approximate phase)
  2: [{...THUMP, at: 0.2, loop: true, fade: 0.3, until: r(T.at60, T.tires)}],
  // 4–6: the roar from the ramp to real speed (≈ 1.1 s into 4) through the band (5) until the car leaves the
  // grooves in 6 (leaveAt ≈ 4.56 s in, the band dark ≈ 0.6 s later)
  3: [{...ROAR, at: 1.1, fade: 0.6}],
  4: [{...ROAR, at: r(S4 + 1.1 + ROAR_LEN, S5)}],
  5: [{...ROAR, at: r(S4 + 1.1 + 2 * ROAR_LEN - 0.4, S6), fade: 0.4, until: r(T.distracted, S6) + 1.3}],
  // 9: the tune on the Lancaster drive, faded out by "but it kept neighbors"
  8: [{...TUNE, at: 0.3, fade: 0.6, until: 'but it kept neighbors'}],
  // 10: the bedroom light on "neighbors"
  9: [{...SWITCH, at: r(T.neighbors, T.but)}],
  // 11–12: the roar from just before "roars" until the tire leaves the row after "steer back" (≈ 58.1)
  10: [{...ROAR, at: r(T.roars - 0.5, S11), fade: 0.4}],
  11: [{...ROAR, at: r(T.roars - 0.5 + ROAR_LEN - 0.4, S12), fade: 0.4, until: r(T.steer, S12) + 0.6}],
};

export const spec: VideoSpec = {
  ...picture,
  scenes: picture.scenes.map((sc, i) => ({...sc, overlays: [...(sc.overlays ?? []), ...(SOUND[i] ?? [])]})),
};
