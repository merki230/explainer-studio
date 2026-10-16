import type {VideoSpec} from '../../types';

/**
 * Exhibit No. 001 · The Living Room, in The Section (style guide v0.8.1). Rough cut (stage 3).
 *
 * One slice, the living room, seen from outside at the fixed angle. The video opens black on
 * FRIEND's phone, which wakes on her search, and the camera pulls back into the Night slice (the
 * `wake` bookend); it ends by pushing into YOUR phone, which locks to black (the `sleep` bookend),
 * so the last frame loops into the first. One "time passes" beat (Night → Day) at "The next
 * morning"; Day to the end. The orange route runs once, out and back with the one X-ray, on the FTC
 * sentence.
 *
 * Transitions (§ 8): same slice and mood → the camera continues; a framing change too far for a
 * push glides (eased move, ≈ 0.8 s); a new location slides in (the phone cut-away, the Lab, and back
 * to the living room). No hard cut except the closing lock.
 *
 * Scenes start on a `cue` copied from script.txt; overlays start on cues where possible. Timed to
 * the live `directed` take (≈ 54.4 s). Props marked `// TIMED` (scene boundaries for the camera
 * runs, `route`, `ui` steps, `gestures`, bookends) are seconds set from transcript.json: re-check
 * them if the voiceover is redone.
 *
 * Sound (style guide § 9, README "Sound"): the music bed; a whoosh on each of the three slides; a low
 * hum while the orange route moves (out and back, ending as it arrives on "one household" so the
 * statement lands in clean air); the lock click on the closing lock. Levels were set from measured
 * loudness (voice ≈ −22 LUFS, music take A ≈ −16, hum ≈ −9.5, whoosh ≈ −16.6): re-check them if a
 * file is replaced.
 */

type V3 = [number, number, number];
type Framing = {look: V3; distance: number};

// Scene boundaries, seconds (first word of each scene's cue in transcript.json). // TIMED
const T = {
  open: 0, // "Your friend spends"
  morning: 4.76, // "The next morning"
  question: 7.76, // "So is your phone"
  listen: 10.16, // "It does listen"
  apps: 18.72, // "As for other apps"
  tests: 24.56, // "and in their tests"
  shelf: 28.24, // "A simpler answer"
  ftc: 32.08, // "FTC staff said"
  guess: 38.48, // "and ad platforms"
  lastNight: 43.08, // "So last night"
  oneWay: 46.8, // "and that's one way"
  next: 50.0, // "Next time"
  end: 55.6, // last word 54.40 + the 1.2 s tail
};

const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const between = (a: Framing, b: Framing, k: number): Framing => ({
  look: [lerp(a.look[0], b.look[0], k), lerp(a.look[1], b.look[1], k), lerp(a.look[2], b.look[2], k)],
  distance: lerp(a.distance, b.distance, k),
});
/**
 * One slow, continuous camera run across several scenes: each scene gets the piece of the move
 * between its start and its end, so the camera never jumps where one scene continues the next.
 */
const run = (a: Framing, b: Framing, t0: number, t1: number) => (start: number, end: number) => ({
  from: between(a, b, (start - t0) / (t1 - t0)),
  to: between(a, b, (end - t0) / (t1 - t0)),
});

// The couch push on "So is your phone?" (the only couch scene before the cut-away). COUCH_END is
// where the living room picks up again at "A simpler answer".
const COUCH_END: Framing = {look: [0.3, 0.95, -0.45], distance: 8.0};
const couchRun = run({look: [0.05, 0.95, -0.45], distance: 8.8}, {look: [0.15, 0.95, -0.45], distance: 8.7}, T.question, T.listen);
// "Look at the router": from the couch run's last framing, a crane up the back wall to the router
// (same distance), the router high in frame over the two heads.
const ROUTER_VIEW: Framing = {look: [0.05, 1.25, -0.7], distance: 8.0};
// The wide run (Day, "FTC staff said" → "and that's one way"): a very slow push.
const WIDE: Framing = {look: [-0.2, 1.36, 0], distance: 12.75};
const wideRun = run({...WIDE, distance: 13.3}, {...WIDE, distance: 12.85}, T.ftc, T.oneWay);
// The last couch run ("and that's one way" → the end), before the push into YOUR phone.
const endRun = run({look: [0.15, 0.95, -0.45], distance: 8.4}, {look: [0.15, 0.95, -0.45], distance: 8.15}, T.oneWay, T.end);

// The route (§ 5): FRIEND's phone → router → down inside the back wall (the X-ray cut-away) → the
// cut ground → out of frame, and back the same way to YOU's phone. It spans two scenes, so its times
// are kept in absolute seconds and shifted into each. // TIMED
const ROUTE = {
  out: 35.58, // leaves her phone on "home" (35.60): router by "network", out of frame on "public address"
  outDuration: 2.1,
  back: 39.6, // comes back on "use that" (39.60), arrives at YOU's phone on "one household" (41.60)
  backDuration: 2.0,
  glowFor: 0.6,
};
const routeIn = (sceneStart: number) => ({
  outAt: ROUTE.out - sceneStart,
  outDuration: ROUTE.outDuration,
  backAt: ROUTE.back - sceneStart,
  backDuration: ROUTE.backDuration,
  glowFor: ROUTE.glowFor,
});
// Both look up at the router from "Look at the router" through the route; the phones' positions
// (the route's ends) depend on these, so the two route scenes share them. // TIMED
const LOOK_UP = 30.24; // lands on "Look at" (30.72)
const routeGestures = (sceneStart: number) => [
  {figure: 'friend' as const, pose: 'look-up' as const, at: LOOK_UP - sceneStart},
  {figure: 'you' as const, pose: 'look-up' as const, at: LOOK_UP - sceneStart},
];

/** A glide into a scene (§ 8): an eased camera move to a new framing in the same slice (owner, polish 1). */
// The scene prop `transition` is not a CSS transition; the Remotion rule can't tell them apart.
// eslint-disable-next-line @remotion/non-pure-animation
const GLIDE = {transition: 'glide'} as const;

// Day screens: her phone locked; YOU's feed with the ad already in.
const LOCKED = {at: -60, app: 'lock' as const};
const AD_IN = {at: -60, app: 'feed' as const, adAt: 0};

// Sound (§ 9). Levels in dB relative to the voice (gain 1).
// Whoosh on a slide (18 frames): starts 0.1 s in, so the file's peak (0.15–0.2 s) lands mid-slide
// (0.3 s); −18, the quiet end of the 12–18 dB window, as each slide lands on a first word.
const WHOOSH = {type: 'sfx', name: 'whoosh', at: 0.1, volume: -18} as const;
// The hum: only while the route moves, in two phrases that follow it: out (leaves her phone → gone
// past the frame, ending at the cut) and back (comes back → arrives at YOU's phone, faded out by "one
// household"). A sound can't run past its scene's cut, and the cut (38.48) falls while the route is
// out of frame (37.68–39.6), so the hum rests there. The file is ≈ 12 LU louder than the voice, so
// −32 (not −20) puts it ≈ 20 dB under (§ 9). // TIMED
const HUM = {type: 'sfx', name: 'hum', loop: true, fade: 0.3, volume: -32} as const;

export const spec: VideoSpec = {
  // Take C (owner choice, 2026-10-16; ≈ -16.7 LUFS vs voice -22). Owner heard the voice as detached from the
  // music on headphones (voice too loud against the bed), so the bed sits ≈ 9 dB under the voice with no duck
  // (style-guide § 9 says 16–20; owner-led trial).
  music: {level: -14, duckDb: 0},
  // Voice: the original dry voiceover (owner preferred it to the yarn voice:room versions, 2026-10-16).
  watermark: null, // no watermark: the invented coffee machine is disclosed in the post ("Illustrative: …")
  // Cover still (`yarn cover phone-listening`): the couch,
  // close, Day; YOU's ad (with the system's edge) read in the detail box; the route from the router to
  // YOU's phone at 2× weight so it survives the thumbnail shrink.
  cover: {
    text: 'Is your phone listening?',
    camera: {look: [0.2, 1.17, -0.45], distance: 8.2},
    props: {
      realism: true, // objects realistic, people stylized (owner)
      mood: 'day',
      trace: true, // router LED lit
      // her search on her screen (faces her, unread), the ad with the system's edge on YOU's
      ui: {
        friend: [{at: -60, app: 'results', query: 'coffee machine'}],
        you: [{at: -60, app: 'feed', adAt: 0, markAt: -59}],
      },
      gestures: [
        {figure: 'you', pose: 'lift-phone', at: -20},
        {figure: 'friend', pose: 'scroll', at: -20},
      ],
      // the way back only (router → YOU's phone), fully drawn and glowing, at 2× the video's weight
      // ends at the phone's node dot (owner fix: into the head it read as "reading your mind")
      route: {outAt: -16, backAt: -12, glowFor: 100, xray: false, tell: false, weight: 2, show: 'back', end: 'phone'},
    },
    // over YOU's phone, so the leader is one short drop
    detail: {who: 'you', size: 252, left: 414, top: 552},
  },
  scenes: [
    // 1 · Open on something concrete. Frame 0 black; FRIEND's phone wakes full-frame and her search
    // starts on it (the opening line is spoken over the screen), then the camera pulls back into the
    // Night slice, wide. Title block and name tags once the slice is there. Her search was read on the
    // full screen, so no detail box here.
    {
      scene: 'section-room',
      cue: 'Your friend spends',
      props: {
        realism: true, // objects realistic, people stylized (owner)
        mood: 'night',
        camera: 'wide',
        wake: {who: 'friend', pullAt: 1.4, pullDuration: 1.4}, // TIMED: pulls out after "evening"; lands on "scrolling"
        screens: {you: 0},
        ui: {
          friend: [
            {at: 0, app: 'lock'},
            {at: 0.5, app: 'search', query: 'coffee machine', typeFor: 0.9}, // TIMED: typed by ≈ 1.6 s
            {at: 2.85, app: 'results', query: 'coffee machine'}, // TIMED: results on "coffee machines"
          ],
          you: [{at: 0, app: 'lock'}],
        },
        gestures: [{figure: 'friend', pose: 'lean-in', at: 1.4}], // TIMED: into the phone as the pull starts
      },
      overlays: [
        {type: 'title', at: 2.8, number: 'No. 001', title: 'The Living Room', time: '9:47 PM'},
        {type: 'tag', who: 'friend', cue: 'coffee machines'},
        // 48 px above the head, not 120: at 120 the tag sits on the router (§ 6 value)
        {type: 'tag', who: 'you', cue: 'coffee machines', rise: 48},
      ],
    },
    // 2 · The surprising fact. Time passes (Night → Day over 1.5 s, the camera still pushing on the
    // wide framing); YOU's phone lights with the ad, read in the detail box.
    {
      scene: 'section-room',
      cue: 'The next morning',
      props: {
        realism: true, // objects realistic, people stylized (owner)
        mood: 'day',
        moodFrom: 'night',
        moodAt: 0.1, // TIMED: blends over "The next morning,"
        camera: 'wide',
        screens: {friend: 0, you: {at: 0.9}}, // TIMED: lights just before "your phone" (5.76)
        ui: {
          friend: [LOCKED],
          you: [
            {at: 0, app: 'lock'},
            {at: 0.9, app: 'feed', adAt: 0.1}, // TIMED: the ad slides in as the box opens on "your phone" (5.76)
          ],
        },
        gestures: [{figure: 'you', pose: 'lift-phone', at: 0.9}], // TIMED
      },
      overlays: [{type: 'detail', who: 'you', cue: 'your phone', until: 'So is your phone', top: 340}],
    },
    // 3 · The question. Glide to the couch (a new sentence); YOU leans into the phone on "listening?".
    {
      scene: 'section-room',
      cue: 'So is your phone',
      props: {
        realism: true, // objects realistic, people stylized (owner)
        mood: 'day',
        ...GLIDE,
        camera: couchRun(T.question, T.listen),
        screens: {friend: 0},
        ui: {friend: [LOCKED], you: [AD_IN]},
        gestures: [
          {figure: 'you', pose: 'lift-phone', at: -1},
          {figure: 'you', pose: 'lean-in', at: 1.0}, // TIMED: on "listening?" (9.12)
        ],
      },
    },
    // 4 · The wake word, and that the check runs on the phone: the phone cut open (a new location, it
    // slides in). Sound waves drift in from the room and are discarded by the listening chip; a "Hey…"
    // wave lights the chip on "thinks it hears the phrase"; the hatch to the network stays shut.
    // Replaces the full-frame assistant screen (one idea per frame); no full-frame screen is used now.
    {
      scene: 'phone-cutaway',
      cue: 'It does listen',
      props: {
        realism: true, // objects realistic, people stylized (owner)
        mood: 'day',
        glideIn: 1.0,
        cutAt: 0.9,
        wavesAt: 1.3, // TIMED: first wave on "wake word" (11.28)
        waveEvery: 0.9,
        wakeAt: 5.95, // TIMED: "Hey…" sets off on "until it" (16.11); the chip lights ≈ 17.3, "hears the phrase"
        doorShut: true,
      },
      overlays: [WHOOSH], // slides in
    },
    // 5 · The study (The Lab, a second location; slides in): the wall counter runs to 17,000 as it is
    // spoken; the arms tap and the conveyor runs.
    {
      scene: 'section-lab',
      cue: 'As for other apps',
      props: {
        realism: true, // objects realistic, people stylized (owner)
        mood: 'day',
        camera: 'wide',
        count: 17000,
        countAt: 1.3, // TIMED: starts on "researchers" (20.04)
        countFor: 2.6, // TIMED: lands on "17,000" (22.32–22.72)
      },
      overlays: [WHOOSH], // slides in
    },
    // 6 · Its result: the camera moves in on the bench (same slice); the audio meter stays flat and the
    // "0" stamp lands on "not one was caught".
    {
      scene: 'section-lab',
      cue: 'and in their tests',
      props: {
        realism: true, // objects realistic, people stylized (owner)
        mood: 'day',
        // the bench framing, centred between the counter (x −0.92) and the meter/stamp (x 0.02)
        camera: {from: {look: [-0.1, 1.45, -0.55], distance: 9.15}, to: {look: [-0.1, 1.45, -0.55], distance: 9.0}},
        count: 17000,
        countAt: -10, // already counted
        zeroAt: 1.05, // TIMED: "not one was caught" (25.60)
      },
    },
    // 7 · The turn: "A simpler answer sits on the shelf. Look at the router." Back in the living room (it
    // slides in), the camera cranes from the couch up to the router; both look up at it as it is named.
    {
      scene: 'section-room',
      cue: 'A simpler answer',
      props: {
        realism: true, // objects realistic, people stylized (owner)
        mood: 'day',
        camera: {from: COUCH_END, to: ROUTER_VIEW},
        screens: {friend: 0},
        ui: {friend: [LOCKED], you: [AD_IN]},
        gestures: routeGestures(T.shelf),
      },
      overlays: [WHOOSH], // slides back to the living room
    },
    // 8 · The mechanism (FTC): glide to wide (a new sentence; router → wide is too far for a push), so
    // the whole path shows. The route leaves FRIEND's phone, through the router, down inside the back
    // wall (the X-ray cut-away, the video's only one), along the cut ground and out of frame.
    {
      scene: 'section-room',
      cue: 'FTC staff said',
      props: {
        realism: true, // objects realistic, people stylized (owner)
        mood: 'day',
        ...GLIDE,
        camera: wideRun(T.ftc, T.guess),
        screens: {friend: 0},
        ui: {friend: [LOCKED], you: [AD_IN]},
        gestures: routeGestures(T.ftc),
        route: routeIn(T.ftc),
      },
      overlays: [{...HUM, at: ROUTE.out - T.ftc, until: 'and ad platforms'}], // the route out
    },
    // 9 · The guess: the way back arrives at YOU's phone; the idea to keep in the sky band.
    {
      scene: 'section-room',
      cue: 'and ad platforms',
      props: {
        realism: true, // objects realistic, people stylized (owner)
        mood: 'day',
        camera: wideRun(T.guess, T.lastNight),
        screens: {friend: 0},
        ui: {friend: [LOCKED], you: [AD_IN]},
        gestures: routeGestures(T.guess),
        route: routeIn(T.guess),
      },
      overlays: [
        {...HUM, at: ROUTE.back - T.guess, until: 'one household'}, // the route back
        {
          type: 'statement',
          cue: 'one household',
          text: 'One household.',
          // no attribution line (owner decision): sources go in the post description only
        },
      ],
    },
    // 10 · One home: the trace (node dots on both phones and the router, LED on); they turn to each
    // other on "you and your friend". No card.
    {
      scene: 'section-room',
      cue: 'So last night',
      props: {
        realism: true, // objects realistic, people stylized (owner)
        mood: 'day',
        camera: wideRun(T.lastNight, T.oneWay),
        trace: true,
        screens: {friend: 0},
        ui: {friend: [LOCKED], you: [AD_IN]},
        gestures: [
          ...routeGestures(T.lastNight),
          {figure: 'friend', pose: 'turn-to', at: 0.8}, // TIMED: "you and your friend" (44.00)
          {figure: 'you', pose: 'turn-to', at: 0.8},
        ],
      },
    },
    // 11 · Her search ends up on your phone: glide to the couch (at the wide framing the detail box's
    // leader drops through a head); YOU's ad, now with the system's orange edge.
    {
      scene: 'section-room',
      cue: "and that's one way",
      props: {
        realism: true, // objects realistic, people stylized (owner)
        mood: 'day',
        ...GLIDE,
        camera: endRun(T.oneWay, T.next),
        trace: true,
        screens: {friend: 0},
        ui: {friend: [LOCKED], you: [{at: -60, app: 'feed', adAt: 0, markAt: 1.55}]}, // TIMED: edge on "end up" (48.32)
        gestures: [
          {figure: 'friend', pose: 'turn-to', at: -1},
          {figure: 'you', pose: 'turn-to', at: -1},
          {figure: 'you', pose: 'scroll', at: 0.2}, // TIMED: back to the phone before "her search" (47.64)
        ],
      },
      overlays: [{type: 'detail', who: 'you', cue: 'her search', until: 'Next time'}],
    },
    // 12 · Turn it back on the viewer. FRIEND glances up at the router on "read your mind"; YOU turns
    // to FRIEND on "who was on your Wi-Fi", back to the phone, and the camera pushes into YOUR phone
    // (the marked ad), which locks to black: the last frame is black like frame 0 (the loop).
    {
      scene: 'section-room',
      cue: 'Next time',
      props: {
        realism: true, // objects realistic, people stylized (owner)
        mood: 'day',
        camera: endRun(T.next, T.end),
        trace: true,
        screens: {friend: 0},
        ui: {friend: [LOCKED], you: [{at: -60, app: 'feed', adAt: 0, markAt: -59}]},
        gestures: [
          {figure: 'friend', pose: 'turn-to', at: -1},
          {figure: 'you', pose: 'scroll', at: -1},
          // FRIEND glances up at the router on "read your mind" (≈ 51.2), back to YOU as YOU turns to her
          {figure: 'friend', pose: 'look-up', at: 1.2, hold: 0.6}, // TIMED: up by 51.8, back by 53.0
          {figure: 'you', pose: 'turn-to', at: 2.7, hold: 0.8}, // TIMED: lands on "who was" (52.96), then back
        ],
        sleep: {who: 'you', pushAt: 4.2, pushDuration: 1.0}, // TIMED: after "Wi-Fi." (54.40); locks 6 frames before the end
      },
      // the lock click on the lock frame (6 frames, 0.2 s, before the end; the click's transient is at the
      // file's start)
      overlays: [{type: 'sfx', name: 'click', at: -0.2, volume: -6}],
    },
  ],
};
