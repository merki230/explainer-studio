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
const PLATE = {number: 'No. 001', title: 'The Living Room'};

// Camera ends, so a custom move can start where the previous shot ended.
const OPEN_END = {to: [0.15, 1.95, 5.75], lookTo: [0, 1.26, -0.1]} as const;
const DEVICES_END = {to: [0.1, 1.15, 7.4], lookTo: [0.08, 0.68, 0]} as const;

// The room after the reveal: route drawn long ago, glow gone; stains, LED, both phones and the laptop on.
const STAINED = {arcs: true, arcsAt: -3, glowFor: 0, devicesAt: [-1, -1, -1]};
// Nothing lit in this scene (a device time past any scene's end).
const OFF = 99;

export const spec: VideoSpec = {
  watermark: 'ILLUSTRATIVE',
  scenes: [
    // 1 · Open on something concrete. The friend's phone flickers on "scrolling"; her search appears.
    {
      scene: 'room',
      cue: 'Your friend spends',
      chip: {title: EXHIBIT, text: COUCH, delay: 1.0},
      props: {
        // 'wide' with the look-at raised 0.16, so the router sits below the search bar
        camera: {from: [-0.2, 2.0, 6.3], lookFrom: [0, 1.16, 0], ...OPEN_END, focusY: 0.45},
        tellAt: 2.4, // TIMED: "scrolling" (2.40 s)
        plate: PLATE,
      },
      overlays: [{type: 'search', cue: 'coffee machines', text: 'coffee machine', tag: '', strikeAt: -1, y: 0.272}],
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
          lookTo: [0.12, 1.24, -0.1],
          focusY: 0.45,
        },
        devicesAt: [1.65, OFF, OFF], // TIMED: your phone flickers on "shows" (6.60 s), full on "one"
        plate: PLATE,
      },
      overlays: [{type: 'ad', cue: 'shows you one', title: 'Coffee machine', x: 0.5, y: 0.272}],
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
      cue: 'researchers studied',
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
    // 5 · "A simpler answer sits on the shelf. Look at the router." The camera rises to the router.
    {
      scene: 'room',
      cue: 'A simpler answer',
      chip: {title: EXHIBIT, text: ROUTER},
      props: {
        camera: {
          from: [0.1, 1.95, 4.5],
          lookFrom: [0, 1.4, -0.5],
          to: [0.05, 1.95, 3.6],
          lookTo: [0, 1.72, -0.8],
          focusY: 0.42,
        },
      },
    },
    // 6 · Mechanism, in physical order: each device on the network lights, then one shared address.
    {
      scene: 'room',
      cue: 'FTC staff said',
      chip: {title: EXHIBIT, text: ROUTER},
      props: {camera: 'devices', devicesAt: [2.85, 3.5, 4.15], plate: PLATE}, // TIMED: "devices" 26.04, "home" 26.88, "network" 27.36
      overlays: [
        {
          type: 'callout',
          cue: 'public address',
          // anchored on the router; the router sits right under the label here, so the card goes to its right
          x: 0.48,
          y: 0.297,
          dx: 90,
          dy: 30,
          place: 'side',
          title: 'Same Wi-Fi',
          sub: 'IP 203.0.113.42',
        },
      ],
    },
    // 7 · The reveal: the route draws friend → router → you as the platform "guesses", then stains.
    {
      scene: 'room',
      cue: 'and ad platforms',
      chip: {title: EXHIBIT, text: ROUTER},
      props: {
        camera: {
          from: DEVICES_END.to,
          lookFrom: DEVICES_END.lookTo,
          to: [0.15, 1.2, 7.0],
          lookTo: [0.08, 0.75, -0.05],
          focusY: 0.45,
        },
        arcs: true,
        // TIMED: draws from "use that" (30.88 s) to "household" (33.04 s), stain by the cut (34.20 s)
        arcsAt: 0.95,
        pathDuration: 2.2,
        glowFor: 0.4,
        devicesAt: [-1, -1, -1],
        facing: true,
        plate: PLATE,
      },
    },
    // 8 · One idea to keep: to the platform, two people are one household.
    {
      scene: 'profiles',
      cue: 'So last night',
      chip: {title: EXHIBIT, text: HOME},
      props: {points: 0, glowFor: 1.2},
    },
    // 9 · Her search ends up on your phone: the ad, between the two of them.
    {
      scene: 'room',
      cue: "and that's one way",
      chip: {title: EXHIBIT, text: HOME},
      // no wall plate on 'table' shots: it lands half off-frame, on the ILLUSTRATIVE watermark
      props: {camera: 'table', ...STAINED, facing: true, facingAt: -1},
      overlays: [{type: 'ad', cue: 'your phone', title: 'Coffee machine', x: 0.47, y: 0.37}],
    },
    // 11 · Turn it back on the viewer, and the last frame: the stained room, wide. One scene: split on
    // "think about", the phone shot before it ran 2.4 s. Loops into the clean room of scene 1.
    {
      scene: 'room',
      cue: 'Next time',
      chip: {title: EXHIBIT, text: HOME},
      props: {camera: 'wide', ...STAINED, plate: PLATE},
    },
  ],
};
