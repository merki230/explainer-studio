import React, {useMemo} from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import * as THREE from 'three';
import {ScreenBookend} from '../components/ScreenBookend';
import {screenStateAt, type ScreenState, type ScreenStep} from '../components/screenKit';
import {OrangePath} from '../three/OrangePath';
import {raw} from '../three/plaster';
import {Figure} from '../three/section/Figure';
import {blendMood} from '../three/section/moods';
import {LivingRoomSlice, SLICE} from '../three/section/LivingRoomSlice';
import {projectToFrame, SectionCamera, sectionCameraAt, type Framing} from '../three/section/SectionCamera';
import {SectionLights, SectionStage} from '../three/section/SectionStage';
import {PHONE_PITCH_TO_FACE, phoneLocalAt, poseAt, type Gesture} from '../three/rig';
import {section, type CastName, type Mood} from '../theme';

type V3 = [number, number, number];

/**
 * Framings at the fixed angle. 'wide': the slice as an object (stage 2a, owner): a strip of sky over
 * the cut wall tops (back corner ≈ y 430), the room in the middle, the cut ground in the bottom
 * ≈ 20% (floor's front edge ≈ y 1540 on average). Camera ≈ (5.45, 4.90, 10.87).
 * 'couch': the two people on the couch; at 8.0 a seated figure fills ≈ 40% of the frame height,
 * the closest a push may come (§ 8).
 */
export const SECTION_FRAMINGS: Record<'wide' | 'couch', Framing> = {
  wide: {look: [-0.2, 1.36, 0], distance: 12.75},
  couch: {look: [0.0, 0.92, -0.45], distance: 8.0},
};

/** A camera move at the fixed angle: from one framing to another (truck/crane via `look`, push via `distance`). */
export type SectionMove = {from: Framing; to?: Framing};

export type SectionGesture = Gesture & {figure: CastName};

export type SectionRoute = {
  /** Seconds into the scene when the route leaves the sender's phone (the screen tell starts 1.5 s earlier). */
  outAt: number;
  /** Seconds the way out takes: phone → router → down the back wall → along the cut ground → out of frame. */
  outDuration?: number;
  /** Seconds into the scene when the way back starts (from out of frame). */
  backAt: number;
  /** Seconds the way back takes: cut ground → up the back wall → router → the receiver's phone. */
  backDuration?: number;
  /** Who sends and who receives (default FRIEND → YOU). */
  from?: CastName;
  to?: CastName;
  /** Seconds the glow holds after the way back arrives; then it fades (0.8 s) to the trace. */
  glowFor?: number;
  /** The back wall turns see-through while the route runs inside it (default true; at most once per video). */
  xray?: boolean;
  /** The sender's screen light flickers orange for 1.5 s before the route draws (default true). */
  tell?: boolean;
};

export type SectionRoomSceneProps = {
  durationInFrames: number;
  /** Night (lit room, lamp on) or Day (default, § 4). */
  mood?: Mood;
  /**
   * 'wide' or 'couch' (a slow push from there, see `push`), or a custom move between two framings.
   * The angle never changes (§ 8).
   */
  camera?: keyof typeof SECTION_FRAMINGS | SectionMove;
  /** Push speed for a preset framing, units/s toward the subject (≤ 0.06; 0 = hold). */
  push?: number;
  /** Idle truck drift, ± units (≤ 0.15; 0 = none). */
  drift?: number;
  /** Who sits where: [left seat, right seat]; null leaves a seat empty. Default FRIEND left, YOU right. */
  cast?: [CastName | null, CastName | null];
  /**
   * Cue-driven poses: `{figure, pose, at, target?, hold?, blend?}` with `figure` the cast name
   * ('friend', 'you', ...). Poses: 'idle', 'scroll', 'lean-in', 'lift-phone', 'look-up', 'turn-to',
   * 'glance-down'. `at` seconds into the scene (negative: already in it); `hold` seconds before easing
   * back (omit to hold); `blend` seconds (default 0.6). Targets default to the router (`look-up`) and
   * the other person's head (`turn-to`).
   */
  gestures?: SectionGesture[];
  /**
   * Each person's phone screen: a number (0 locked, 1 on), or `{at}`: locked until `at` seconds into
   * the scene, then on (0.3 s). Default: on.
   */
  screens?: Partial<Record<CastName, number | {at: number}>>;
  /**
   * What each phone shows (phone-screen kit): a script of `{at, app, query?, typeFor?, adAt?, markAt?,
   * from?, text?}` steps, apps 'lock', 'notification', 'search', 'results', 'feed'. Drives the phone's
   * screen texture and the `detail` overlay from the same state.
   */
  ui?: Partial<Record<CastName, ScreenStep[]>>;
  /** The phones' clock (default Night "9:47", Day "7:58"; never "9:41"). */
  clock?: string;
  /** The lock screen's date (default Night "Tuesday, October 14", Day "Wednesday, October 15"). */
  date?: string;
  /** The orange route through the section (§ 5), with node dots, the moving light, the X-ray and the bleed. */
  route?: SectionRoute;
  /** Open with the trace of an earlier route in this slice: node dots lit and the router LED on (§ 5). */
  trace?: boolean;
  /** Router LED in orange, 0–1, on top of what the route does. */
  led?: number;
  /** Laptop on the coffee table (lid toward the couch). */
  laptop?: boolean;
  /**
   * Realism pass: the living room's objects realistic (router, couch, table, cup, rug, plant, lamp,
   * with studio reflections scaled per mood), and the cast hold the realistic phone. Default false.
   */
  realism?: boolean;
  /** The cast hold the realistic phone (Figure `phoneModel: 'real'`). Default: follows `realism`. */
  realPhones?: boolean;
  /** Screen-space ambient occlusion (N8AO) at the mood's strength. Default: follows `realism`. */
  ao?: boolean;
  /** Breathing, blinks, weight shifts, head drift, thumbs, the lamp's ±3% (default on). */
  life?: boolean;
  /** Focus line of the post pass, fraction of the frame from the top (default 0.5: the look-at). */
  focusY?: number;
  /** The scene's first frame in the video (set by Explainer): keeps idle motion continuous across cuts. */
  startFrame?: number;
  /**
   * Which slice this is (default 'living-room'). Consecutive scenes in the same location and mood
   * continue one camera move; a new location slides in (§ 8).
   */
  location?: string;
  /**
   * How this scene comes in (§ 8). 'auto' (default): same location and mood → 'continue' (the camera
   * keeps moving, no dissolve); same location, other mood → 'dissolve' (the time-passes beat); new
   * location → 'follow' if `follow` is set, else 'slide'. Or force one: 'continue', 'cut', 'dissolve'
   * (12 frames), 'slide' (from below, 18 frames), 'follow' (along the route, 24 frames).
   */
  transition?: 'auto' | 'continue' | 'glide' | 'cut' | 'dissolve' | 'slide' | 'follow';
  /**
   * Seconds the camera glides from the previous scene's end framing to this scene's framing when
   * the transition is 'glide' (cubic in-out; default 0.8; keep it 0.5–1.0). The only time the camera
   * may move faster than the slow push.
   */
  glide?: number;
  /** Set by Explainer when this scene glides in: the glide's length in seconds. */
  cameraGlide?: number;
  /**
   * Follow the line into this scene: the camera moves `direction` (default 'down', where the route
   * leaves the room) to this slice, with the orange route crossing the seam at `at` (fraction of
   * the frame across the seam, default 0.3).
   */
  follow?: {direction?: 'down' | 'up' | 'left' | 'right'; at?: number};
  /**
   * Set by Explainer when this scene continues the previous one: the framing the previous scene's
   * camera ended on. The camera starts there; a preset `camera` with the same look-at keeps pushing,
   * another preset becomes where the move ends.
   */
  cameraFrom?: Framing;
  /**
   * The loop (§ 8): in the last 6 frames the phones lock (screens and their light to 0 in 2 frames)
   * and the slice's orange goes out with them (route glow, node dots, LED), then a 4-frame hold; the
   * camera has stopped. Use on the video's last scene.
   */
  loopLock?: boolean;
  /**
   * The time-passes beat (§ 4): the scene opens in `moodFrom` and blends to `mood` (sky, palette,
   * lights) over 1.5 s from `moodAt`, cubic in-out. Same slice, so the camera continues; once per video.
   */
  moodFrom?: Mood;
  /** Seconds into the scene when the time-passes blend starts (default 0.3). */
  moodAt?: number;
  /**
   * Opening bookend (owner decision, the loop): the video opens full-frame on `who`'s phone screen,
   * black for `darkFor` seconds (default 0.2), then the screen wakes (8 frames) and shows their `ui`
   * script (lock screen, then the first app action); at `pullAt` the camera pulls back out of the
   * screen into the slice over `pullDuration` seconds (default 1.4), landing on this scene's framing.
   * Mood-agnostic. Frame 0 is black.
   */
  wake?: {who: CastName; darkFor?: number; pullAt: number; pullDuration?: number};
  /**
   * Closing bookend: at `pushAt` the camera pushes into `who`'s phone over `pushDuration` seconds
   * (default 1.2) until its screen fills the frame; at `lockAt` (default: 6 frames before the end)
   * the phone locks: the screen goes black in 2 frames and holds black. The last frame is black,
   * like frame 0 of a video opening with `wake`, so the loop is seamless.
   */
  sleep?: {who: CastName; pushAt: number; pushDuration?: number; lockAt?: number};
};

/** Distance of the camera when the phone fills the frame (the bookends' close end). */
const CLOSE = 2.6;

/** Seconds the time-passes blend takes (§ 4). */
export const TIME_PASSES = 1.5;

/** Frames before the end where `loopLock` starts. */
export const LOOP_LOCK_FRAMES = 6;

/** The scene's camera move (framings and drift) from its props. */
const cameraMove = (p: Partial<SectionRoomSceneProps>, durationInFrames: number, fps: number) => {
  const camera = p.camera ?? 'wide';
  const push = p.push ?? 0.04;
  // the bookends: a pull out of a phone before the main move, a push into one after it
  const wake = p.wake;
  const sleep = p.sleep;
  const pre = wake
    ? {
        from: {look: phoneAt(p, wake.who, wake.pullAt) ?? ([0, 1, -0.4] as V3), distance: CLOSE},
        hold: Math.round(wake.pullAt * fps),
        move: Math.round((wake.pullDuration ?? 1.4) * fps),
      }
    : undefined;
  const post = sleep
    ? {
        to: {
          look: phoneAt(p, sleep.who, sleep.pushAt + (sleep.pushDuration ?? 1.2)) ?? ([0, 1, -0.4] as V3),
          distance: CLOSE,
        },
        at: Math.round(sleep.pushAt * fps),
        move: Math.round((sleep.pushDuration ?? 1.2) * fps),
      }
    : undefined;
  // a glide: the scene opens with an eased move from where the last scene ended to its own framing
  const glide =
    !pre && p.cameraGlide && p.cameraFrom
      ? {from: p.cameraFrom, hold: 0, move: Math.max(1, Math.round(p.cameraGlide * fps)), ease: 'cubic' as const}
      : undefined;
  const pre2 = pre ?? glide;
  const start = pre2 ? pre2.hold + pre2.move : 0;
  const end = post ? post.at : p.loopLock ? Math.max(1, durationInFrames - LOOP_LOCK_FRAMES) : durationInFrames;
  const secs = Math.max(0, end - start) / fps;
  let from: Framing;
  let to: Framing;
  if (typeof camera === 'string') {
    const preset = SECTION_FRAMINGS[camera] ?? SECTION_FRAMINGS.wide;
    const c = glide ? undefined : p.cameraFrom;
    if (c) {
      const same = c.look.every((v, i) => Math.abs(v - preset.look[i]) < 1e-6);
      // continuing: keep pushing from where the previous scene ended, or move to the new preset
      from = c;
      to = same ? {look: c.look, distance: c.distance - push * secs} : preset;
    } else {
      from = preset;
      to = {look: preset.look, distance: preset.distance - push * secs};
    }
  } else {
    from = camera.from;
    to = camera.to ?? camera.from;
  }
  return {from, to, pre: pre2, post, end};
};

/** The framing a scene's own camera move starts on (ignoring any continuation or glide into it). */
export const sectionCameraStart = (p: Partial<SectionRoomSceneProps>, durationInFrames: number, fps: number): Framing =>
  cameraMove({...p, cameraFrom: undefined, cameraGlide: undefined}, durationInFrames, fps).from;

/**
 * The framing a scene's camera ends on (for the next scene to continue from). `durationInFrames`
 * is the scene's length without any overlap.
 */
export const sectionCameraEnd = (p: Partial<SectionRoomSceneProps>, durationInFrames: number, fps: number): Framing =>
  cameraMove(p, durationInFrames, fps).to;

/** Where a cast member sits (their seat), or undefined if they are not in this scene. */
export const seatOf = (p: Partial<SectionRoomSceneProps>, who: CastName): V3 | undefined => {
  const cast = p.cast ?? ['friend', 'you'];
  const i = cast.indexOf(who);
  return i < 0 ? undefined : SLICE.seats[i];
};

const headOf = (seat: V3): V3 => [seat[0], seat[1] + 1.3, seat[2] + 0.02];
const ROUTER_LOOK: V3 = [SLICE.router[0], SLICE.router[1] + 0.02, SLICE.router[2] + 0.1];

/** A person's gestures with the room's default targets (router for `look-up`, the other person for `turn-to`). */
const gesturesFor = (p: Partial<SectionRoomSceneProps>, who: CastName): Gesture[] => {
  const cast = p.cast ?? ['friend', 'you'];
  const i = cast.indexOf(who);
  const other = SLICE.seats[1 - Math.max(0, i)];
  return (p.gestures ?? [])
    .filter((g) => g.figure === who)
    .map((g) => ({
      pose: g.pose,
      at: g.at,
      hold: g.hold,
      blend: g.blend,
      target: g.target ?? (g.pose === 'look-up' ? ROUTER_LOOK : g.pose === 'turn-to' ? headOf(other) : undefined),
    }));
};

/** World position of a person's phone at `t` seconds into the scene (their pose applied). */
export const phoneAt = (p: Partial<SectionRoomSceneProps>, who: CastName, t: number): V3 | undefined => {
  const seat = seatOf(p, who);
  if (!seat) return undefined;
  const toLocal = (q: V3) => new THREE.Vector3(q[0] - seat[0], q[1] - seat[1], q[2] - seat[2]);
  const local = phoneLocalAt(poseAt(t, gesturesFor(p, who), toLocal), PHONE_PITCH_TO_FACE);
  return [seat[0] + local.x, seat[1] + local.y, seat[2] + local.z];
};

const cameraAtFrame = (
  p: Partial<SectionRoomSceneProps>,
  o: {frame: number; fps: number; durationInFrames: number},
) => {
  const {from, to, pre, post, end} = cameraMove(p, o.durationInFrames, o.fps);
  return sectionCameraAt({
    from,
    to,
    pre,
    post,
    frame: o.frame,
    fps: o.fps,
    durationInFrames: end,
    drift: p.drift ?? 0.08,
    clockOffset: (p.startFrame ?? 0) / o.fps,
  });
};

/**
 * Frame position (px) of the top of a seated person's head at a frame of the scene, for labels
 * that point at people (name tags). Uses the scene's own camera maths; the rest pose's head.
 */
export const headTopOnScreen = (
  p: Partial<SectionRoomSceneProps>,
  who: CastName,
  o: {frame: number; fps: number; durationInFrames: number},
): [number, number] | undefined => {
  const seat = seatOf(p, who);
  if (!seat) return undefined;
  return projectToFrame(cameraAtFrame(p, o), [seat[0], seat[1] + 1.49, seat[2] - 0.05]);
};

/**
 * Frame box (px) of a seated person's head, hair included, at a frame of the scene: [xMin, xMax,
 * yTop, yBottom]. The rest pose's head, like `headTopOnScreen`. For leaders that must clear it.
 */
export const headBoxOnScreen = (
  p: Partial<SectionRoomSceneProps>,
  who: CastName,
  o: {frame: number; fps: number; durationInFrames: number},
): [number, number, number, number] | undefined => {
  const seat = seatOf(p, who);
  if (!seat) return undefined;
  const cam = cameraAtFrame(p, o);
  // Head sphere r 0.165 (Figure.tsx) plus hair: ≈ 0.2 m half-width; centre 1.325 m above the seat.
  const r = 0.2;
  const c: [number, number, number] = [seat[0], seat[1] + 1.325, seat[2] - 0.05];
  const pts = [
    projectToFrame(cam, [c[0] - r, c[1], c[2]]),
    projectToFrame(cam, [c[0] + r, c[1], c[2]]),
    projectToFrame(cam, [c[0], c[1] + r, c[2]]),
    projectToFrame(cam, [c[0], c[1] - r, c[2]]),
  ];
  const xs = pts.map((q) => q[0]);
  const ys = pts.map((q) => q[1]);
  return [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
};

/** Frame position (px) of a person's phone at a frame of the scene (pose and camera applied). */
export const phoneOnScreen = (
  p: Partial<SectionRoomSceneProps>,
  who: CastName,
  o: {frame: number; fps: number; durationInFrames: number},
): [number, number] | undefined => {
  const ph = phoneAt(p, who, o.frame / o.fps);
  return ph ? projectToFrame(cameraAtFrame(p, o), ph) : undefined;
};

/** The defaults for the phones' clock and date per mood. */
const clockFor = (p: Partial<SectionRoomSceneProps>) => {
  const night = p.mood === 'night';
  return {
    clock: p.clock ?? (night ? '9:47' : '7:58'),
    date: p.date ?? (night ? 'Tuesday, October 14' : 'Wednesday, October 15'),
  };
};

/** What a person's phone shows at `t` seconds into the scene, or undefined without a `ui` script. */
export const screenFor = (p: Partial<SectionRoomSceneProps>, who: CastName, t: number): ScreenState | undefined => {
  const script = p.ui?.[who];
  if (!script || script.length === 0) return undefined;
  return screenStateAt(script, t, {mood: p.mood ?? 'day', ...clockFor(p)});
};

const ramp = (t: number, a: number, b: number) =>
  interpolate(t, [a, b], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

// The route's geometry through the section (§ 5).
const P = 0.025; // proud of the cut faces
const WZ = SLICE.z0 - SLICE.wallThickness / 2; // inside the back wall
const XR = SLICE.width / 2 + P; // on the right cut face
const ZF = SLICE.z1 + P; // on the front cut face
const X_OUT = -2.6; // past the frame's left edge
const Y_OUT = -0.35;
const Y_BACK = -0.55; // the way back runs 0.2 lower

/**
 * Where the route touches the router, and its node dot: on the top's front edge, a little right of
 * centre, clear of the front's status icons and print (the dot read as a sticker over them there).
 * The route arcs down onto it from above and goes on inside the router into the wall.
 */
export const ROUTER_NODE: V3 = [SLICE.router[0] + 0.05, SLICE.router[1] + 0.07, SLICE.router[2] + 0.085];
/** Node dot radius: 0.6 of the guide's 0.035, so it reads as a lit LED, not a disc (§ 5 value). */
const NODE_R = 0.021;

const routeLegs = (a: V3, b: V3) => {
  const [rx, ry] = SLICE.router;
  const r: V3 = ROUTER_NODE;
  const out: V3[][] = [
    // starts inside the holder, behind the phone (hidden by their body; the node dot marks the phone),
    // comes out behind the shoulder on the router's side and arcs low (just above the router) to it: from the
    // camera it never crosses a body, and its light stays off them
    [[a[0], a[1] + 0.12, a[2] - 0.32], [a[0] + 0.22, 1.5, -0.88], [(a[0] + rx) / 2 + 0.1, ry + 0.2, -0.9], r],
    [r, [rx + 0.06, ry, WZ]],
    [
      [rx + 0.06, ry, WZ],
      [rx + 0.06, Y_OUT, WZ],
    ],
    [
      [rx + 0.06, Y_OUT, WZ],
      [XR, Y_OUT, WZ],
    ],
    [
      [XR, Y_OUT, WZ],
      [XR, Y_OUT, ZF],
    ],
    [
      [XR, Y_OUT, ZF],
      [X_OUT, Y_OUT, ZF],
    ],
  ];
  const back: V3[][] = [
    [
      [X_OUT, Y_BACK, ZF],
      [XR, Y_BACK, ZF],
    ],
    [
      [XR, Y_BACK, ZF],
      [XR, Y_BACK, WZ],
    ],
    [
      [XR, Y_BACK, WZ],
      [rx - 0.06, Y_BACK, WZ],
    ],
    [
      [rx - 0.06, Y_BACK, WZ],
      [rx - 0.06, ry, WZ],
    ],
    [[rx - 0.06, ry, WZ], r],
    // from the router down behind the receiver's shoulder, into them (their node dot marks the phone)
    [r, [rx + 0.1, ry - 0.06, -0.92], [b[0] + 0.22, 1.5, -0.88], [b[0], b[1] + 0.12, b[2] - 0.32]],
  ];
  return {out, back, r};
};

/** Fractions of a route's length where each leg ends. */
const legEnds = (legs: V3[][]) => {
  const lens = legs.map((leg) => new THREE.CatmullRomCurve3(leg.map((q) => new THREE.Vector3(...q))).getLength());
  const total = lens.reduce((x, y) => x + y, 0);
  let acc = 0;
  return lens.map((l) => (acc += l) / total);
};

/** Seconds the X-ray cut-away takes to open (and to close), top-down. */
const XRAY_OPEN = 0.45;

/** When an eased route (cubic in-out from `at` over `dur` seconds) reaches progress `p` (0–1). */
const timeAtProgress = (p: number, at: number, dur: number) => {
  let lo = at;
  let hi = at + dur;
  for (let i = 0; i < 30; i++) {
    const mid = (lo + hi) / 2;
    if (ramp(mid, at, at + dur) < p) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
};

/** The screen tell: ≈ 2.5 Hz flicker between 20 and 80% for 1 s, then a 0.5 s ramp to full (§ 5). */
const tellLevel = (t: number, at: number) => {
  if (t < at) return 0;
  if (t < at + 1) return 0.2 + 0.6 * (0.5 + 0.5 * Math.sin((t - at) * Math.PI * 2 * 2.5));
  return 0.8 + 0.2 * ramp(t, at + 1, at + 1.5);
};

/** A living room cut open and seen from outside at the fixed 3/4 angle, with two of the cast on the couch. */
export const SectionRoomScene: React.FC<SectionRoomSceneProps> = (props) => {
  const {
    durationInFrames,
    mood = 'day',
    drift = 0.08,
    cast = ['friend', 'you'],
    screens = {},
    route,
    trace = false,
    led = 0,
    laptop = false,
    life = true,
    focusY = 0.5,
    startFrame = 0,
    loopLock = false,
    moodFrom,
    moodAt = 0.3,
  } = props;
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const clockOffset = startFrame / fps;
  const clock = t + clockOffset;
  const p = {...props, mood, cast};

  const plan = cameraMove(p, durationInFrames, fps);
  const {from, to} = plan;
  // the loop: phones lock over 2 frames, then hold (the camera stopped at the same frame)
  const lockAt = durationInFrames - LOOP_LOCK_FRAMES;
  const unlocked = loopLock
    ? interpolate(frame, [lockAt, lockAt + 2], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})
    : 1;
  const lamp = life ? 1 + 0.03 * Math.sin((clock / 4.5) * Math.PI * 2) : 1;

  // The route: endpoints at the phones where they are when it leaves and when it arrives.
  const sender = route?.from ?? 'friend';
  const receiver = route?.to ?? 'you';
  const outDur = route?.outDuration ?? 1.8;
  const backDur = route?.backDuration ?? 1.8;
  const a = route ? phoneAt(p, sender, route.outAt) : undefined;
  const b = route ? phoneAt(p, receiver, route.backAt + backDur) : undefined;
  const geoKey = JSON.stringify([a, b]);
  const geo = useMemo(() => {
    const [pa, pb] = JSON.parse(geoKey) as [V3 | undefined, V3 | undefined];
    if (!pa || !pb) return null;
    const legs = routeLegs(pa, pb);
    return {...legs, outEnds: legEnds(legs.out), backEnds: legEnds(legs.back), a: pa, b: pb};
  }, [geoKey]);

  let outP = 0;
  let backP = 0;
  let glow = 0;
  let nodes = trace ? 1 : 0;
  let ledLevel = trace ? 1 : 0;
  let xray = 0;
  const system: Partial<Record<CastName, number>> = {};
  if (route && geo) {
    const backEnd = route.backAt + backDur;
    const glowFor = route.glowFor ?? 1.0;
    outP = ramp(t, route.outAt, route.outAt + outDur);
    backP = ramp(t, route.backAt, backEnd);
    glow = 1 - ramp(t, backEnd + glowFor, backEnd + glowFor + 0.8);
    nodes = Math.max(nodes, ramp(t, route.outAt, route.outAt + 0.3));
    const atRouter = geo.outEnds[0];
    ledLevel = Math.max(ledLevel, ramp(outP, atRouter, atRouter + 0.03));
    if (route.xray !== false) {
      // open from just before the way out enters the wall until the way back has left it: top-down
      // over XRAY_OPEN seconds ending as the route enters the wall, and closing the same way after
      // it leaves (as a share of the route's length, ≈ 10%, it opened in 2 frames: a pop)
      const tIn = timeAtProgress(geo.outEnds[1], route.outAt, outDur);
      const tOut = timeAtProgress(geo.backEnds[4], route.backAt, backDur);
      xray = t < route.backAt ? ramp(t, tIn - XRAY_OPEN, tIn) : 1 - ramp(t, tOut, tOut + XRAY_OPEN);
    }
    const tell = route.tell === false ? (t >= route.outAt ? 1 : 0) : tellLevel(t, route.outAt - 1.5);
    system[sender] = tell * glow;
    system[receiver] = ramp(backP, 0.97, 1) * glow;
  }
  const flow = (done: number) => (glow > 0.001 && t > done ? (t - done) * 0.35 : undefined);
  // `orange` in both moods: the route runs along the light cut faces, where the pale Night core
  // (`orangeCore`) bloomed to near-white
  const core = section.orange;
  // lit, not flat: an emissive dome with a soft lit side and a glint, so it reads as an LED
  const nodeMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: raw(core),
        emissive: raw(core),
        emissiveIntensity: 0.75,
        roughness: 0.3,
        metalness: 0,
        transparent: true,
      }),
    [core],
  );
  nodeMat.opacity = nodes * unlocked;
  // node dots: on the router, and on the two phones wherever they are now (they move with gestures)
  const nodePoints: V3[] = [];
  if (geo || trace) {
    for (const who of [sender, receiver]) {
      const q = phoneAt(p, who, t);
      if (q) nodePoints.push(q);
    }
    nodePoints.push(ROUTER_NODE);
  }

  const people = cast
    .map((who, i) => (who ? {who, seat: SLICE.seats[i]} : null))
    .filter((q): q is {who: CastName; seat: V3} => q !== null);

  // The time-passes beat renders the scene once: lights, sky, palette and exposure blend from
  // `moodFrom` to `mood`; figures, gestures and screens are computed once (nothing doubles).
  const blending = moodFrom !== undefined && moodFrom !== mood;
  const k = blending ? ramp(t, moodAt, moodAt + TIME_PASSES) : 1;
  const palette = blending ? blendMood(moodFrom, mood, k) : undefined;
  const skyFrom = blending ? {mood: moodFrom, amount: 1 - k} : undefined;
  const world = (mm: Mood) => (
    <SectionStage mood={mm} palette={palette} post={{focusY}} ao={p.ao ?? p.realism ?? false}>
      <SectionCamera
        from={from}
        to={to}
        durationInFrames={plan.end}
        pre={plan.pre}
        post={plan.post}
        drift={drift}
        clockOffset={clockOffset}
      />
      <SectionLights mood={mm} palette={palette} lamp={lamp} lampAt={SLICE.lampLight} />
      <LivingRoomSlice
        mood={mm}
        palette={palette}
        skyFrom={skyFrom}
        led={Math.max(led, ledLevel) * unlocked}
        realism={p.realism ?? false}
        lamp={lamp}
        laptop={laptop}
        xray={xray}
        clock={clock}
        leaves={life}
      />
      {people.map(({who, seat}) => {
        const s = screens[who];
        const screenOn = (s === undefined ? 1 : typeof s === 'number' ? s : ramp(t, s.at, s.at + 0.3)) * unlocked;
        return (
          <Figure
            key={who}
            who={who}
            mood={mm}
            position={seat}
            gestures={gesturesFor(p, who)}
            screenOn={screenOn}
            screen={screenFor(p, who, t)}
            system={(system[who] ?? 0) * unlocked}
            life={life}
            clockOffset={clockOffset}
            phoneModel={(p.realPhones ?? p.realism) ? 'real' : 'simple'}
          />
        );
      })}
      {geo ? (
        <>
          <OrangePath
            legs={geo.out}
            progress={outP}
            glow={glow * unlocked}
            stain={false}
            radius={0.018}
            coreColor={core}
            halo={{scale: 0.055 / 0.018, opacity: 0.25}}
            runnerLight={{intensity: 0.6, reach: 1.2}}
            flow={flow((route?.outAt ?? 0) + outDur)}
            dots={4}
          />
          <OrangePath
            legs={geo.back}
            progress={backP}
            glow={glow * unlocked}
            stain={false}
            radius={0.018}
            coreColor={core}
            halo={{scale: 0.055 / 0.018, opacity: 0.25}}
            runnerLight={{intensity: 0.6, reach: 1.2}}
            flow={flow((route?.backAt ?? 0) + backDur)}
            dots={4}
          />
        </>
      ) : null}
      {nodePoints.map((q, i) => (
        <mesh key={i} position={q} material={nodeMat} userData={{glow: true}} visible={nodes > 0.001}>
          <sphereGeometry args={[NODE_R, 20, 14]} />
        </mesh>
      ))}
    </SectionStage>
  );
  // The bookends: the full-frame phone screen the video opens on (wake) or ends on (sleep).
  const sine = Easing.inOut(Easing.sin);
  let book: {who: CastName; e: number; bright: number} | null = null;
  if (props.wake && plan.pre) {
    const dark = props.wake.darkFor ?? 0.2;
    const e = interpolate(frame, [plan.pre.hold, plan.pre.hold + plan.pre.move], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: sine,
    });
    const bright = ramp(frame, Math.round(dark * fps), Math.round(dark * fps) + 8);
    if (e < 1) book = {who: props.wake.who, e, bright};
  }
  if (props.sleep && plan.post && frame >= plan.post.at) {
    const q = interpolate(frame, [plan.post.at, plan.post.at + plan.post.move], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: sine,
    });
    const lockF =
      props.sleep.lockAt !== undefined ? Math.round(props.sleep.lockAt * fps) : durationInFrames - LOOP_LOCK_FRAMES;
    const bright =
      1 - interpolate(frame, [lockF, lockF + 2], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
    book = {who: props.sleep.who, e: 1 - q, bright};
  }
  let bookLayer: React.ReactNode = null;
  if (book) {
    const o = {frame, fps, durationInFrames};
    const ph = phoneAt(p, book.who, t);
    const cam = cameraAtFrame(p, o);
    const at = ph ? projectToFrame(cam, ph) : ([540, 960] as [number, number]);
    const top = ph ? projectToFrame(cam, [ph[0], ph[1] + 0.09, ph[2]]) : at;
    const bottom = ph ? projectToFrame(cam, [ph[0], ph[1] - 0.09, ph[2]]) : at;
    bookLayer = (
      <ScreenBookend
        state={screenFor(p, book.who, t)}
        e={book.e}
        bright={book.bright}
        phone={at}
        phoneH={Math.abs(bottom[1] - top[1])}
      />
    );
  }

  return (
    <AbsoluteFill>
      {world(mood)}
      {bookLayer}
    </AbsoluteFill>
  );
};
