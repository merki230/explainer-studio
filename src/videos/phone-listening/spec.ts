import type {VideoSpec} from '../../types';

/**
 * Exhibit No. 001 · The Living Room (v0.5 script, 7-step recipe).
 *
 * Scenes start on a `cue` (first words of a phrase in the voiceover) and run
 * until the next scene. Overlays start on a `cue`. Overlay x/y are fractions of
 * the 1080x1920 frame; readable text stays inside x 120–888, y 288–1248 and off
 * the captions band (y ≈ 1045–1188).
 *
 * Timed to the `directed` take (45.8 s). Props marked `// TIMED` are seconds into their scene,
 * set from transcript.json: re-check them if the voiceover is redone.
 */

const EXHIBIT = 'No. 001 · The Living Room';
// Sub-lines change only where the scene type changes: two different sub-lines draw over
// each other mid-dissolve, so neighbouring scenes share one.
const COUCH = 'EXHIBIT · COUCH';
const PHONE = 'EXHIBIT · A PHONE';
const ROUTER = 'EXHIBIT · ROUTER';
const HOME = 'EXHIBIT · ONE HOME';
// No wall plate in this video (round 3): every room shot chains into a close one (router, table)
// where no plate spot stays inside x 120–888 and clear of the label, and a plate that appears or
// vanishes inside a continuous move reads as a glitch. It repeats the label, so nothing is lost.

// Camera keyframes: every room shot starts where the previous room shot ended.
const OPEN_START = {from: [-0.2, 2.0, 6.3], lookFrom: [0, 1.16, 0]} as const; // also the last frame (loop)
const OPEN_END = {to: [0.15, 1.95, 5.75], lookTo: [0, 1.26, -0.1]} as const;
const ROUTER_END = {to: [-0.02, 1.95, 3.6], lookTo: [0, 1.84, -0.8]} as const;
// 'devices', closer and looking higher (round 3): router clear of the label, less empty floor.
const DEVICES_END = {to: [0.1, 2.15, 6.4], lookTo: [0.06, 1.18, -0.1]} as const;
const REVEAL_END = {to: [0.12, 2.13, 6.15], lookTo: [0.06, 1.2, -0.1]} as const;
// 'table' with the look-at raised 0.36 (round 3): the router clears the label.
const TABLE = {
  from: [0.15, 1.8, 4.3],
  lookFrom: [0, 1.36, -0.1],
  to: [0.05, 1.7, 3.9],
  lookTo: [0, 1.34, -0.1],
} as const;

// The room after the reveal: route drawn long ago, glow gone; stains, LED, both phones and the laptop on.
const STAINED = {arcs: true, arcsAt: -3, glowFor: 0, devicesAt: [-1, -1, -1]};

export const spec: VideoSpec = {
  watermark: 'ILLUSTRATIVE',
  scenes: [
    // 1 · Open on something concrete. The friend's phone flickers on "scrolling"; her search appears.
    // Starts on the last frame's camera (scene 11), so the loop has no hop.
    {
      scene: 'room',
      cue: 'Your friend spends',
      chip: {title: EXHIBIT, text: COUCH, delay: 1.0},
      props: {
        camera: {...OPEN_START, ...OPEN_END, focusY: 0.45},
        tellAt: 2.4, // TIMED: "scrolling" (2.40 s)
      },
      // Her search, pointed at her phone. A callout, not the search bar: a bar on her side has no room
      // between the label, the shelf and her head, and its leader would run through her head.
      overlays: [
        {
          type: 'callout',
          cue: 'coffee machines',
          until: 'The next morning',
          x: 0.261,
          y: 0.579,
          // card between the two heads, above both (round 4): off her torso and his head
          dx: 240,
          dy: -325,
          place: 'side',
          title: 'Coffee machine',
          sub: 'Her search',
        },
      ],
    },
    // 2 · The surprising fact. Next morning: your phone lights, with the ad.
    {
      scene: 'room',
      cue: 'The next morning',
      chip: {title: EXHIBIT, text: COUCH},
      props: {
        camera: {
          from: OPEN_END.to,
          lookFrom: OPEN_END.lookTo,
          to: [0.3, 1.93, 5.2],
          lookTo: [0.12, 1.36, -0.1], // raised 0.12: the router drops below the ad card
          focusY: 0.45,
        },
        // TIMED: your phone flickers on "shows" (6.60 s), full on "one"; the laptop and her phone stay off
        devicesAt: [1.65, null, null],
      },
      overlays: [
        {type: 'ad', cue: 'shows you one', until: 'So is your phone', title: 'Coffee machine', x: 0.5, y: 0.265},
      ],
    },
    // 3 · The question. The phone on its pedestal; the mic light comes on with "listening?".
    {
      scene: 'phone',
      cue: 'So is your phone',
      chip: {title: EXHIBIT, text: PHONE},
      props: {camera: 'front', micDot: true, micAt: 1.3}, // TIMED micAt: "listening?" (9.52 s)
      overlays: [
        {
          type: 'callout',
          cue: 'listening',
          // anchored on the mic light; the card sits above the phone
          x: 0.561,
          y: 0.355,
          dx: 0,
          dy: -46,
          place: 'above',
          title: 'Mic in use',
          sub: 'Shows when an app uses the mic',
        },
      ],
    },
    // 4 · The study. 'close' starts where 'front' ends; the mic light is still on (already lit).
    {
      scene: 'phone',
      cue: 'researchers in 2018',
      chip: {title: EXHIBIT, text: PHONE},
      props: {camera: 'close', micDot: true, micAt: -2},
    },
    // 5 · Its answer: the mic goes dark on "not one was caught". 'screen' starts where 'close' ends.
    {
      scene: 'phone',
      cue: 'and in their tests',
      chip: {title: EXHIBIT, text: PHONE},
      props: {camera: 'screen', micDot: false},
    },
    // 6 · "A simpler answer sits on the shelf. Look at the router." The camera rises to the router.
    {
      scene: 'room',
      cue: 'A simpler answer',
      chip: {title: EXHIBIT, text: ROUTER},
      props: {
        camera: {
          from: [0.1, 1.95, 4.5],
          lookFrom: [0, 1.4, -0.5],
          ...ROUTER_END, // round 3: x −0.07 and look-at +0.12 push the laptop edge out of frame
          focusY: 0.42,
        },
      },
    },
    // 7 · Mechanism, in physical order: the camera pulls back from the router to the whole room as each
    // device on the network lights, then one shared address.
    {
      scene: 'room',
      cue: 'FTC staff said',
      chip: {title: EXHIBIT, text: ROUTER},
      props: {
        camera: {from: ROUTER_END.to, lookFrom: ROUTER_END.lookTo, ...DEVICES_END, focusY: 0.45},
        devicesAt: [2.85, 3.5, 4.15], // TIMED: "devices" 26.04, "home" 26.88, "network" 27.36
      },
      overlays: [
        {
          type: 'callout',
          cue: 'public address',
          // anchored on the router body's right end; card to its right, clear of the shelf (round 3)
          x: 0.55,
          y: 0.36,
          dx: 100,
          dy: -25,
          place: 'side',
          title: 'Same Wi-Fi',
          sub: 'IP 203.0.113.42',
        },
      ],
    },
    // 8 · The reveal: the route draws friend → router → you as the platform "guesses", then stains.
    {
      scene: 'room',
      cue: 'and ad platforms',
      chip: {title: EXHIBIT, text: ROUTER},
      props: {
        camera: {from: DEVICES_END.to, lookFrom: DEVICES_END.lookTo, ...REVEAL_END, focusY: 0.45},
        arcs: true,
        // TIMED: draws from "use that" (30.88 s) to "household" (33.04 s), stain by the cut (34.20 s)
        arcsAt: 0.95,
        pathDuration: 2.2,
        glowFor: 0.4,
        devicesAt: [-1, -1, -1],
        facing: true,
      },
    },
    // 9 · One idea to keep: to the platform, two people are one household.
    {
      scene: 'profiles',
      cue: 'So last night',
      chip: {title: EXHIBIT, text: HOME},
      props: {points: 0, glowFor: 1.2, stained: true}, // stains persist after the reveal
    },
    // 10 · Her search ends up on your phone: the ad, between the two of them.
    {
      scene: 'room',
      cue: "and that's one way",
      chip: {title: EXHIBIT, text: HOME},
      props: {camera: {...TABLE, focusY: 0.5}, ...STAINED, facing: true, facingAt: -1},
      // between the two heads, pointing down at your phone (right figure): the leader runs clear of the head
      overlays: [
        {
          type: 'ad',
          cue: 'your phone',
          until: 'Next time',
          title: 'Coffee machine',
          // right edge at 756 px, above-left of your head: the leader drops steeply past the head to the
          // phone's top edge and crosses the caption line right of the words
          x: 0.7,
          align: 'right',
          y: 0.41,
          pointTo: [0.83, 0.632],
        },
      ],
    },
    // 11 · Turn it back on the viewer, and the last frame: the stained room. Dollies back from the
    // table shot to scene 1's first camera, so the loop is one continuous room.
    // Click-off on the last 6 frames (style guide § 8): orange to zero, stains stay, 4-frame hold.
    // The label stays on through the click-off: the label layer has no exit at the video's end (see report).
    {
      scene: 'room',
      cue: 'Next time',
      chip: {title: EXHIBIT, text: HOME},
      props: {
        camera: {
          from: TABLE.to,
          lookFrom: TABLE.lookTo,
          to: OPEN_START.from,
          lookTo: OPEN_START.lookFrom,
          focusY: 0.45,
        },
        ...STAINED,
        clickOff: true,
      },
    },
  ],
};
