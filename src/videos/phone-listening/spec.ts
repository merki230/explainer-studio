import type {VideoSpec} from '../../types';

/**
 * Exhibit No. 001 · The Living Room ("Your phone is not listening to you").
 *
 * Scenes start on a `cue` (first words of a phrase in the voiceover) and run
 * until the next scene. Overlays start on a `cue` or `at` seconds into the scene.
 * Overlay x/y are fractions of the 1080x1920 frame. Readable text stays inside
 * x 120–888, y 288–1248, and clear of the captions band (y ≈ 1045–1188).
 *
 * Scene 1's label waits 1 s: no label text in the first second (brand.md § Structure).
 */

const EXHIBIT = 'No. 001 · The Living Room';
// Sub-lines change only where the scene type changes (phone / evening / one home / scale): two
// different sub-lines draw over each other mid-dissolve, so neighbours share one where they can.
const PLATE = {number: 'No. 001', title: 'The Living Room'};

// Living-room camera ends, copied from ROOM_CAMERAS in src/scenes/RoomScene.tsx,
// so custom moves can start where the previous shot ended.
const TABLE_END = {to: [0.05, 1.7, 3.9], lookTo: [0, 0.98, -0.1]} as const;
const PUSH_END = {to: [0.3, 1.95, 4.9], lookTo: [0.05, 1.45, -0.2]} as const;

// The room after the reveal: route drawn long ago, glow gone, stains, LED and both screens on.
const STAINED = {arcs: true, arcsAt: -3, glowFor: 0, tellAt: -5};

export const spec: VideoSpec = {
  watermark: 'ILLUSTRATIVE',
  scenes: [
    // 1 · Hook. The mic light comes on; the callout says what that light means.
    {
      scene: 'phone',
      cue: 'Your phone',
      // the label waits a second: the first frame is the exhibit, not text (brand.md § Structure)
      chip: {title: EXHIBIT, text: 'EXHIBIT · A PHONE', delay: 1.0},
      props: {micDot: true, micAt: 0.6},
      overlays: [
        {
          type: 'callout',
          cue: 'Probably not',
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
    // 2 · The study. Same phone, mic dark: nothing is listening.
    {
      scene: 'phone',
      cue: 'Researchers went looking',
      chip: {title: EXHIBIT, text: 'EXHIBIT · A PHONE'},
      // 'close' starts where 'front' ends: 1 → 2 → 3 is one continuous push
      props: {micDot: false, camera: 'close'},
    },
    // 3 · The screen is recorded: the edge traces from "analytics", the scan sweeps, the route leaves the top.
    // 'screen' starts where 'close' ends (scene 2 should be camera 'close' for one continuous push).
    {
      scene: 'phone',
      cue: 'They did find',
      chip: {title: EXHIBIT, text: 'EXHIBIT · A PHONE'},
      props: {micDot: false, camera: 'screen', screenRec: true, screenRecAt: 1.0},
    },
    // 4a · The question. The ad you got, over the whole exhibit.
    {
      scene: 'room',
      cue: 'So how did',
      chip: {title: EXHIBIT, text: 'EXHIBIT · EVENING'},
      // 'wide' with the look-at raised 0.16: the router drops below the ad card (round-2 fix 1)
      props: {
        camera: {
          from: [-0.2, 2.0, 6.3],
          lookFrom: [0, 1.16, 0],
          to: [0.15, 1.95, 5.75],
          lookTo: [0, 1.26, -0.1],
          focusY: 0.45,
        },
        plate: PLATE,
      },
      overlays: [{type: 'ad', cue: 'coffee machine', title: 'Coffee machine', x: 0.5, y: 0.272}],
    },
    // 4b · You never searched it. The tell: the friend's phone flickers on "Your friend did".
    {
      scene: 'room',
      cue: 'You never searched',
      chip: {title: EXHIBIT, text: 'EXHIBIT · EVENING'},
      // tellAt ≈ "Your friend did" (seconds into the scene; re-check after the voiceover)
      // no wall plate on 'table' shots: it lands half off-frame, on the ILLUSTRATIVE watermark
      props: {camera: 'table', tellAt: 1.8},
      overlays: [{type: 'search', at: 0, text: 'coffee machine', tag: 'NEVER SEARCHED', y: 0.3}],
    },
    // 5a · The reveal on "Same Wi-Fi": the route draws friend → router → you, then stains.
    // 'push': cuts back out from the table shot (there the router hides behind the label) and pushes in.
    {
      scene: 'room',
      cue: 'Same Wi-Fi',
      chip: {title: EXHIBIT, text: 'EXHIBIT · EVENING'},
      props: {
        camera: 'push',
        arcs: true,
        arcsAt: 0.1,
        pathDuration: 1.8,
        tellAt: -2,
        glowFor: 0.6,
        facing: true,
        // no wall plate: at the push start it sits half behind the exhibit label
      },
    },
    // 5b · One public address. The callout lands once the glow is gone (stain only).
    {
      scene: 'room',
      cue: 'Every device',
      chip: {title: EXHIBIT, text: 'EXHIBIT · EVENING'},
      props: {
        camera: {
          from: PUSH_END.to,
          lookFrom: PUSH_END.lookTo,
          to: [0.2, 1.93, 4.7],
          lookTo: [0.03, 1.45, -0.2],
          focusY: 0.5,
        },
        ...STAINED,
        facing: true,
        facingAt: -1,
        // no plate here either: 5a → 5b is one continuous move, so it would pop in mid-shot
      },
      overlays: [
        {
          type: 'callout',
          cue: 'same public',
          // anchored on the router; card centred above it
          x: 0.5,
          y: 0.375,
          dx: 0,
          dy: -140,
          place: 'above',
          title: 'Same Wi-Fi',
          sub: 'IP 203.0.113.42',
        },
      ],
    },
    // 6a · One household: the link between the two people.
    {
      scene: 'profiles',
      cue: 'To an ad',
      chip: {title: EXHIBIT, text: 'EXHIBIT · ONE HOME'},
      props: {points: 0, glowFor: 1.2},
    },
    // 6b · The devices light one by one (your phone, your laptop, your friend's phone), then the router
    // and the wash brighten on "One home". devicesAt / householdAt are seconds into the scene (re-check after the voiceover).
    {
      scene: 'room',
      cue: 'Your phone. Your laptop',
      chip: {title: EXHIBIT, text: 'EXHIBIT · ONE HOME'},
      props: {camera: 'devices', ...STAINED, devicesAt: [0.35, 1.45, 2.6], householdAt: 3.8},
    },
    // 6c · The friend's search becomes your ad, shown above your phone.
    {
      scene: 'room',
      cue: "Your friend's search",
      chip: {title: EXHIBIT, text: 'EXHIBIT · ONE HOME'},
      props: {
        // a cut-in from 'devices' (its framing has no clean spot for the ad: the card would cover
        // the heads or the router), then a slow drift toward your side
        camera: {
          from: TABLE_END.to,
          lookFrom: TABLE_END.lookTo,
          to: [0.2, 1.7, 3.75],
          lookTo: [0.12, 0.98, -0.1],
          focusY: 0.5,
        },
        ...STAINED,
      },
      // over the couch backs between the two heads: clear of the router, the stain and the captions
      overlays: [{type: 'ad', cue: 'your ad', title: 'Coffee machine', x: 0.47, y: 0.37}],
    },
    // 7 · Logins plus guesses: data points gather on the link.
    {
      scene: 'profiles',
      cue: 'Companies mix',
      chip: {title: EXHIBIT, text: 'EXHIBIT · ONE HOME'},
      props: {linkAt: 0.2, points: 20},
    },
    // 8 · Scale. The one number in the video.
    {
      scene: 'tiles',
      cue: 'Now zoom out',
      chip: {title: EXHIBIT, text: 'EXHIBIT · SCALE'},
      props: {matched: 0.4, matchAt: 0.4, matchDuration: 2.4},
      overlays: [
        {
          type: 'counter',
          cue: 'says it has',
          to: 126000000,
          label: 'households',
          sub: "In one data company's graph · US",
          x: 0.111,
          y: 0.45,
        },
      ],
    },
    // 9a · Payoff. Back to the phone: the mic stays dark.
    {
      scene: 'phone',
      cue: 'It feels like',
      chip: {title: EXHIBIT, text: 'EXHIBIT · A PHONE'},
      // the screen keeps the stain from scene 3: stains never fade within a video
      props: {micDot: false, screenStain: true},
    },
    // 9b · Last line, last frame: the room with its stain. Loops into "Your phone…".
    {
      scene: 'room',
      cue: 'Sharing a Wi-Fi',
      chip: {title: EXHIBIT, text: 'EXHIBIT · EVENING'},
      props: {camera: 'wide', ...STAINED, plate: PLATE},
    },
  ],
};
