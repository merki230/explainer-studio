import React, {useMemo} from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import * as THREE from 'three';
import {screenStateAt, type ScreenState, type ScreenStep} from '../components/screenKit';
import {MOODS, section, type Mood} from '../theme';
import {OrangePath} from '../three/OrangePath';
import {raw} from '../three/plaster';
import {TRUCK, truckToWorld, UtilityTruck, type TruckDirection} from '../three/real/UtilityTruck';
import {METER, RADIO} from '../three/real/WaterMeter';
import type {Gesture} from '../three/rig';
import {
  projectToFrame,
  SECTION_ANGLE,
  sectionCameraAt,
  SectionCamera,
  type Framing,
} from '../three/section/SectionCamera';
import {SectionLights, SectionStage} from '../three/section/SectionStage';
import {STREET_LAYOUT, StreetSlice, YOU_REST_HANDS} from '../three/section/StreetSlice';
import {skyTexture} from '../three/section/textures';
import {RadioPulse} from '../three/TirePieces';
import {ease, framingAtKeys, integrateSpeed, type CameraKey, type SpeedKey} from './keyframes';

type V3 = [number, number, number];
const L = STREET_LAYOUT;

export type StreetFraming =
  'box' | 'cap' | 'radio' | 'register' | 'boxAir' | 'reveal' | 'street' | 'wide' | 'kitchen' | 'kitchenClose' | 'pipe';

/**
 * Framings at the fixed angle (metres; the same values as the director's in the No. 004 spec).
 * C: 'box' (frame 0: the pit cut open, meter, radio, lid cap), 'cap', 'radio', 'register',
 * 'kitchenClose'. M: 'boxAir' (the box with air above the lid), 'kitchen' (YOU at the sink), 'pipe'
 * (the service pipe under the yard). MW: 'reveal' (the cap and the near lane up to ≈ 15 m: the truck as
 * line 1's burst reaches it),
 * 'street' (the cut face from the sidewalk to the far curb, the near street behind). W: 'wide' (the
 * street in depth to the pole and the pedestal tank; the tank is seen only here).
 */
export const STREET_FRAMINGS: Record<StreetFraming, Framing> = {
  box: {look: [0.45, -0.32, -0.1], distance: 3.2},
  cap: {look: [0.45, 0.12, -0.09], distance: 1.8},
  radio: {look: [0.38, 0.02, -0.17], distance: 1.8},
  register: {look: [0.45, -0.2, -0.13], distance: 1.6},
  boxAir: {look: [0.6, 0.45, -0.2], distance: 5},
  reveal: {look: [2.4, 0.5, -3.5], distance: 36},
  street: {look: [2.7, 0.5, -1.5], distance: 34},
  wide: {look: [-1.0, 0.0, -14], distance: 95},
  kitchen: {look: [-5.6, 1.55, -1.1], distance: 9},
  kitchenClose: {look: [-5.6, 1.85, -1.2], distance: 6},
  pipe: {look: [-2.2, -0.3, -0.05], distance: 4.5},
};

export type StreetTruck = {
  /** 'toward' (default: the near lane, coming down the street at the camera) or 'away' (the far lane, driving up the street). */
  direction?: TruckDirection;
  /** World x of its centre line (default: the lane for its direction, near 2.6, far 6.55). */
  x?: number;
  /**
   * Where the front bumper is at the scene's start, as metres past the section plane in its direction of
   * travel: 'away' +2 = 2 m up the street from the plane, −4.5 = still 4.5 m in front of it; 'toward' −62
   * = 62 m up the street. The truck is never cut: it is drawn only while wholly behind the plane.
   */
  through?: number;
  /** Speed keyframes in m/s (default 9 ≈ 20 mph, Decision 6), eased over 0.8 s. */
  speed?: SpeedKey[];
  /**
   * Once any of it is past the plane: 'hide' (default: drawn only while wholly behind the cut; it pops
   * in or out there, so keep that moment off screen) or 'show' (drawn whole wherever it is, driving on
   * in front of the cut face over the empty ground; never cut).
   */
  beyond?: 'hide' | 'show';
};

export type StreetBurst = {
  /** Seconds into the scene. */
  at: number;
  /** Which lid sends: 0 = YOUR cap (default), k = the k-th neighbour up the street (1–7). */
  lid?: number;
  /** Where its line goes: 'truck' (default, re-aimed at the moving roof receiver), 'pole', 'tank', or null (ring only). */
  to?: 'truck' | 'pole' | 'tank' | null;
  /** Ring reach (m, default 1.2). */
  reach?: number;
};

export type StreetSliceSceneProps = {
  durationInFrames: number;
  /** Day (default) or Night. */
  mood?: Mood;
  /** Framing preset (default 'box'). */
  framing?: StreetFraming;
  /** A custom move instead of a preset. */
  camera?: {from: Framing; to?: Framing};
  /** Camera keyframes (as the car and tower slices; `log: true` for a steady dolly); override `camera` and `push`. */
  cameraKeys?: CameraKey[];
  /** Push, units/s (default 0). */
  push?: number;
  /** Idle sideways drift, ± units (default 0.08; 0 on the loop's first and last scenes). */
  drift?: number;
  /** The truck, or null for none (default none). */
  truck?: StreetTruck | null;
  /**
   * Camera tracking for a truck at road speed: from `at` (s) the look-at point eases (over `blend` s,
   * default 0.6) from the keyed framing onto the truck's cab (+ `offset`, default [0, −0.6, 0]), and the
   * distance onto `distance` (default: the keyed one); from `until` it eases back to the keys.
   */
  track?: {at: number; until?: number; blend?: number; offset?: V3; distance?: number};
  /** Radio bursts: an orange ring from a lid's cap and a line to its receiver. */
  bursts?: StreetBurst[];
  /** The sweep hand's speed keys in turns/s (a running tap ≈ 0.4; default still). */
  flow?: SpeedKey[];
  /** The leak triangle's speed keys in turns/s (default still). */
  leakSpin?: SpeedKey[];
  /**
   * YOU's kitchen tap, seconds into the scene: it runs from `on` to `off` (either may be omitted or lie
   * outside the scene). Around each, YOU's right hand goes to the lever (from 0.55 s before, back by
   * 0.65 s after), the lever lifts or drops, and the stream tapers in or out over 6 frames.
   */
  tap?: {on?: number; off?: number};
  /**
   * YOU holds the phone (screen toward YOU, never the camera) from `at` (lifting it) to `until`; the
   * screen shows `screen` (the screen kit; default the usage page). The tap's reach takes the hand
   * back for its moment.
   */
  phone?: {at: number; until?: number; screen?: ScreenStep[]};
  /** More poses for YOU (rig `Gesture`s). */
  youGestures?: Gesture[];
  /** The radio's object cut-away: opens over 0.8 s from `at`, closes over 0.8 s from `until`. */
  radioCut?: {at: number; until?: number};
  /** YOU at the kitchen sink (default true). */
  you?: boolean;
  location?: string;
  transition?: 'auto' | 'continue' | 'glide' | 'cut' | 'dissolve' | 'slide' | 'follow';
  follow?: {direction?: 'down' | 'up' | 'left' | 'right'; at?: number};
  glide?: number;
  /** Set by Explainer. */
  startFrame?: number;
  cameraFrom?: Framing;
  cameraGlide?: number;
};

const streetCameraMove = (p: Partial<StreetSliceSceneProps>, durationInFrames: number, fps: number, frame?: number) => {
  const m = streetCameraKeyed(p, durationInFrames, fps, frame);
  const fo = p.track;
  if (!fo || !p.truck) return m;
  const t = (frame ?? durationInFrames) / fps;
  const bl = fo.blend ?? 0.6;
  const w = ease(t, fo.at, fo.at + bl) * (fo.until === undefined ? 1 : 1 - ease(t, fo.until, fo.until + bl));
  if (w <= 0) return m;
  const tr = truckAt(p.truck, t);
  const c = truckToWorld(TRUCK.cab, tr.at, tr.direction);
  const off = fo.offset ?? [0, -0.6, 0];
  const mix = (f: Framing): Framing => ({
    look: f.look.map((v, i) => v + (c[i] + off[i] - v) * w) as V3,
    distance: f.distance + ((fo.distance ?? f.distance) - f.distance) * w,
  });
  return {from: mix(m.from), to: mix(m.to), pre: m.pre};
};

const streetCameraKeyed = (
  p: Partial<StreetSliceSceneProps>,
  durationInFrames: number,
  fps: number,
  frame?: number,
) => {
  const base = p.camera?.from ?? STREET_FRAMINGS[p.framing ?? 'box'] ?? STREET_FRAMINGS.box;
  if (p.cameraKeys && p.cameraKeys.length) {
    // keys continue from where the last scene ended (a `continue` hand-over), else from the preset
    const f = framingAtKeys(
      p.cameraKeys,
      p.camera?.from ?? p.cameraFrom ?? base,
      frame === undefined ? Infinity : frame / fps,
    );
    return {from: f, to: f, pre: undefined};
  }
  const pre =
    p.cameraGlide && p.cameraFrom
      ? {from: p.cameraFrom, hold: 0, move: Math.max(1, Math.round(p.cameraGlide * fps)), ease: 'cubic' as const}
      : undefined;
  const secs = Math.max(0, durationInFrames - (pre ? pre.move : 0)) / fps;
  if (p.camera) return {from: p.camera.from, to: p.camera.to ?? p.camera.from, pre};
  const c = pre ? undefined : p.cameraFrom;
  const same = c && c.look.every((v, i) => Math.abs(v - base.look[i]) < 1e-6);
  const from = c && same ? c : base;
  return {from, to: {look: from.look, distance: from.distance - (p.push ?? 0) * secs}, pre};
};

export const streetCameraStart = (p: Partial<StreetSliceSceneProps>, d: number, fps: number): Framing =>
  streetCameraMove({...p, cameraFrom: undefined, cameraGlide: undefined}, d, fps, 0).from;
export const streetCameraEnd = (p: Partial<StreetSliceSceneProps>, d: number, fps: number): Framing =>
  streetCameraMove(p, d, fps).to;

/** The camera state at a frame (for anchors on S). */
export const streetCameraAt = (
  p: Partial<StreetSliceSceneProps>,
  o: {frame: number; fps: number; durationInFrames: number},
) => {
  const {from, to, pre} = streetCameraMove(p, o.durationInFrames, o.fps, o.frame);
  return sectionCameraAt({
    from,
    to,
    pre,
    frame: o.frame,
    fps: o.fps,
    durationInFrames: o.durationInFrames,
    drift: p.drift ?? 0.08,
    clockOffset: (p.startFrame ?? 0) / o.fps,
  });
};

/** The truck's lane, its origin in the world, how far it has driven, and whether it is wholly behind the plane. */
export const truckAt = (tr: StreetTruck, t: number) => {
  const direction = tr.direction ?? 'toward';
  const x = tr.x ?? (direction === 'away' ? L.lanes.far : L.lanes.near);
  const travelled = integrateSpeed(tr.speed ?? [{at: 0, speed: 9}], t, 0.8);
  const through = (tr.through ?? (direction === 'away' ? 2 : -40)) + travelled;
  // 'away': the front bumper (lz −3.12) is at z = −through; 'toward' (turned π): at z = +through
  const z = direction === 'away' ? -through - TRUCK.front : through + TRUCK.front;
  const ends = [
    truckToWorld([0, 0, TRUCK.front], [x, z], direction)[2],
    truckToWorld([0, 0, TRUCK.rear], [x, z], direction)[2],
  ];
  const behind = Math.max(...ends) < -0.05;
  return {direction, at: [x, z] as [number, number], travelled, behind, drawn: behind || tr.beyond === 'show'};
};

const BURST = {draw: 0.45, hold: 0.35, fade: 0.4, lead: 0.12};
/** When a burst's line has reached its receiver (s after its `at`). */
export const BURST_ARRIVES = BURST.lead + BURST.draw;

/** The lever's opening (0 shut → 1 open) at t, from the tap's on/off times. */
const tapOpen = (tap: StreetSliceSceneProps['tap'], t: number) => {
  if (!tap) return 0;
  const on = tap.on === undefined ? -1e9 : tap.on;
  const off = tap.off === undefined ? 1e9 : tap.off;
  if (tap.on === undefined && tap.off === undefined) return 0;
  return ease(t, on - 0.1, on + 0.15) * (1 - ease(t, off - 0.1, off + 0.15));
};
const tapStream = (tap: StreetSliceSceneProps['tap'], t: number) => {
  if (!tap || (tap.on === undefined && tap.off === undefined)) return 0;
  const on = tap.on === undefined ? -1e9 : tap.on;
  const off = tap.off === undefined ? 1e9 : tap.off;
  // a 6-frame taper in and out, just after the lever moves
  return ease(t, on + 0.05, on + 0.25) * (1 - ease(t, off + 0.05, off + 0.25));
};
/** How far YOU's right hand is out at the lever (0–1). */
const tapReach = (tap: StreetSliceSceneProps['tap'], t: number) =>
  Math.max(
    0,
    ...[tap?.on, tap?.off]
      .filter((e): e is number => e !== undefined)
      .map((e) => ease(t, e - 0.55, e - 0.12) * (1 - ease(t, e + 0.25, e + 0.65))),
  );

/** The lever tip (world) at an opening. */
const leverTip = (open: number): V3 => {
  const a = 0.6 * open;
  return [L.tapHandle[0], L.tapHandle[1] + 0.1 * Math.sin(a), L.tapHandle[2] + 0.1 * Math.cos(a) - 0.0];
};
/** World → YOU's figure frame (YOU faces +x; +x of the figure is YOU's left, world −z). */
const toYou = (w: V3): V3 => [-(w[2] - L.you[2]), w[1] - L.you[1], w[0] - L.you[0]];

/** The phone screen YOU sees (also what the 'usage' detail box draws), at t. */
export const streetScreenFor = (p: Partial<StreetSliceSceneProps>, t: number): ScreenState | undefined => {
  if (!p.phone) return undefined;
  const steps: ScreenStep[] = p.phone.screen ?? [{at: p.phone.at, app: 'usage', barsAt: 0}];
  return screenStateAt(steps, t, {mood: p.mood ?? 'day', clock: '10:15', date: 'Tuesday, May 14'});
};

/** The meter's sweep hand and leak triangle (turns) at t. */
export const streetDialAt = (p: Partial<StreetSliceSceneProps>, t: number) => ({
  sweep: integrateSpeed(p.flow ?? [{at: 0, speed: 0}], t, 0.6),
  leak: integrateSpeed(p.leakSpin ?? [{at: 0, speed: 0}], t, 0.6),
});

/** Bursts that reached the truck by t (the truck computer's rows), in order. */
export const truckReads = (p: Partial<StreetSliceSceneProps>, t: number) =>
  (p.bursts ?? [])
    .filter((b) => (b.to === undefined || b.to === 'truck') && t - b.at >= BURST_ARRIVES)
    .map((b) => ({lid: b.lid ?? 0, at: b.at + BURST_ARRIVES}));

/**
 * A named point of S in the world at t: 'cap', 'radio', 'register', 'meter', 'pole', 'tank', 'cab',
 * 'laptop', 'truckRoof' (the truck's only while it is drawn), 'youSpot' / 'youHead' (the top of YOU's
 * head), 'phone', 'tap', 'lid:k'.
 */
export const streetAnchorPoint = (p: Partial<StreetSliceSceneProps>, anchor: string, t: number): V3 | undefined => {
  const [name, arg] = anchor.split(':');
  switch (name) {
    case 'cap':
      return [L.cap[0], L.cap[1] + 0.005, L.cap[2]];
    case 'radio':
      return [L.radio[0], L.radio[1] - RADIO.h / 2, L.radio[2] + RADIO.d / 2];
    case 'register':
      return [L.meter[0], L.meter[1] + METER.dialY, L.meter[2]];
    case 'meter':
      return L.meter;
    case 'pole':
      return [L.poleReceiver[0] + 0.12, L.poleReceiver[1] - 0.2, L.poleReceiver[2]];
    case 'tank':
      return L.tankReceiver;
    case 'youSpot':
    case 'youHead':
      return p.you === false ? undefined : [L.you[0] + 0.03, L.you[1] + 1.97, L.you[2]];
    case 'phone':
      return p.you === false ? undefined : [L.you[0] + 0.32, L.you[1] + 1.38, L.you[2]];
    case 'tap':
      return L.tapHandle;
    case 'lid': {
      const k = Number(arg ?? 1);
      return k === 0 ? L.cap : L.lids[Math.max(1, Math.min(L.lids.length, k)) - 1];
    }
    case 'cab':
    case 'laptop':
    case 'truckRoof': {
      if (!p.truck) return undefined;
      const tr = truckAt(p.truck, t);
      if (!tr.drawn) return undefined;
      const local =
        name === 'cab'
          ? TRUCK.cab
          : name === 'laptop'
            ? ([TRUCK.laptop[0], TRUCK.laptop[1] + 0.06, TRUCK.laptop[2]] as V3)
            : TRUCK.receiver;
      return truckToWorld(local, tr.at, tr.direction);
    }
    default:
      return undefined;
  }
};

/** A named point of S on screen (px) at this frame (see `streetAnchorPoint`). */
export const streetAnchorOnScreen = (
  p: Partial<StreetSliceSceneProps>,
  anchor: string,
  o: {frame: number; fps: number; durationInFrames: number},
): [number, number] | undefined => {
  const w = streetAnchorPoint(p, anchor, o.frame / o.fps);
  return w ? projectToFrame(streetCameraAt(p, o), w) : undefined;
};

/** How far behind the look-at point the sky card stands (m): past the street's far end. */
const BACKDROP = 320;

/**
 * S, the street slice (No. 004): a residential street cut square to the road through YOUR meter box
 * (YOUR kitchen with YOU and the tap, yard, sidewalk, the box cut open with the meter, the radio (with
 * its object cut-away) and the lid antenna, curb, road, the water main cut round); the street runs back
 * with neighbours' lids, a receiver on a pole and a pedestal water tank. A whole white utility pickup
 * drives the street (never cut: drawn only while wholly behind the plane). Radio bursts: an orange ring
 * from a lid's cap and a line to the truck's roof receiver, the pole or the tank. Day.
 */
export const StreetSliceScene: React.FC<StreetSliceSceneProps> = (props) => {
  const {durationInFrames, mood = 'day', bursts = [], you = true, startFrame = 0, tap, phone} = props;
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const m = MOODS[mood];
  const {from, to, pre} = streetCameraMove(props, durationInFrames, fps, frame);
  const cam = streetCameraAt(props, {frame, fps, durationInFrames});
  const camD = cam.position.distanceTo(cam.look);
  const backdrop = {
    position: cam.look
      .clone()
      .addScaledVector(new THREE.Vector3(...SECTION_ANGLE), -BACKDROP)
      .toArray() as V3,
    size: 2 * (camD + BACKDROP) * Math.tan((13 * Math.PI) / 180) * 1.25,
  };
  const backQ = useMemo(
    () => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), new THREE.Vector3(...SECTION_ANGLE)),
    [],
  );
  const truck = props.truck ? truckAt(props.truck, t) : null;
  const {sweep, leak} = streetDialAt(props, t);
  const radioOpen = props.radioCut
    ? ease(t, props.radioCut.at, props.radioCut.at + 0.8) *
      (props.radioCut.until === undefined ? 1 : 1 - ease(t, props.radioCut.until, props.radioCut.until + 0.8))
    : 0;

  const mats = useMemo(
    () => ({
      sky: new THREE.MeshBasicMaterial({map: skyTexture(mood), fog: false}),
      node: new THREE.MeshBasicMaterial({color: raw(section.orange)}),
    }),
    [mood],
  );
  mats.sky.color.setScalar(1 / m.exposure);

  const target = (b: StreetBurst): V3 | null => {
    const to = b.to === undefined ? 'truck' : b.to;
    if (to === 'pole') return [L.poleReceiver[0] + 0.1, L.poleReceiver[1], L.poleReceiver[2]];
    if (to === 'tank') return L.tankReceiver;
    if (to === 'truck' && truck && truck.drawn)
      return truckToWorld([TRUCK.receiver[0], TRUCK.receiver[1] + 0.02, TRUCK.receiver[2]], truck.at, truck.direction);
    return null;
  };
  const live = bursts.map((b) => {
    const age = t - b.at;
    const lid = b.lid ?? 0;
    const src: V3 = lid === 0 ? L.cap : L.lids[Math.max(1, Math.min(L.lids.length, lid)) - 1];
    const dst = target(b);
    const a = age - BURST.lead;
    return {
      ...b,
      age,
      src,
      dst,
      progress: ease(a, 0, BURST.draw),
      glow: a < 0 ? 0 : 1 - ease(a, BURST.draw + BURST.hold, BURST.draw + BURST.hold + BURST.fade),
      on: a >= 0 && a < BURST.draw + BURST.hold + BURST.fade,
    };
  });
  // YOUR radio's node dot: lit just before and while YOUR cap sends
  const radioDot = Math.max(
    0,
    ...live.filter((b) => (b.lid ?? 0) === 0).map((b) => (b.age > -0.2 && b.age < 0.7 ? 1 : 0)),
  );
  // the truck's receiver dot: lit once a line has reached it, and it stays (trace)
  const truckDot = truckReads(props, t).length > 0 ? 1 : 0;

  // YOU: hands on the counter, the right hand out to the tap's lever around each on/off; the phone
  const open = tapOpen(tap, t);
  const reach = tapReach(tap, t);
  const holding = !!phone && t >= phone.at && (phone.until === undefined || t < phone.until) && reach < 0.02;
  const tip = toYou(leverTip(open));
  const rest = YOU_REST_HANDS[0];
  const right: V3 = [
    rest[0] + (tip[0] - rest[0]) * reach,
    rest[1] + (tip[1] - rest[1]) * reach,
    rest[2] + (tip[2] - rest[2]) * reach,
  ];
  const youGestures: Gesture[] = [
    ...(phone ? [{pose: 'lift-phone' as const, at: phone.at}] : []),
    ...(props.youGestures ?? []),
  ];
  const screen = streetScreenFor(props, t);

  const arc = (a: V3, b: V3): V3[][] => {
    const d = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
    const lift = Math.min(3, 0.18 * d);
    const p = (k: number): V3 => [
      a[0] + (b[0] - a[0]) * k,
      a[1] + (b[1] - a[1]) * k + Math.sin(Math.PI * k) * lift,
      a[2] + (b[2] - a[2]) * k,
    ];
    return [[[a[0], a[1] + 0.02, a[2]], p(0.25), p(0.5), p(0.75), b]];
  };
  // the line and ring keep a readable width from the box close-up to the wide shot
  const k = Math.max(0.35, Math.min(3, camD / 20));

  return (
    <AbsoluteFill>
      <SectionStage mood={mood} post={{focusY: 0.5}} ao far={700}>
        <SectionCamera
          from={from}
          to={to}
          pre={pre}
          durationInFrames={durationInFrames}
          drift={props.drift ?? 0.08}
          clockOffset={startFrame / fps}
          fitClip
          farMin={camD + BACKDROP + 50}
        />
        <SectionLights mood={mood} target={[1.5, 0.5, -3]} lamp={0} extent={14} />
        {/* the sky behind the whole slice: a gradient card square to the view, far behind the subject */}
        <mesh
          position={backdrop.position}
          quaternion={backQ}
          material={mats.sky}
          scale={[backdrop.size * 0.5625, backdrop.size, 1]}
        >
          <planeGeometry args={[1, 1]} />
        </mesh>
        <StreetSlice
          mood={mood}
          sweep={sweep}
          leak={leak}
          radioDot={radioDot}
          radioOpen={radioOpen}
          you={you}
          faucet={{handle: open, stream: tapStream(tap, t)}}
          youFigure={{
            phone: holding,
            hands: holding ? undefined : [right, YOU_REST_HANDS[1]],
            screen,
            screenOn: holding ? 1 : 0,
            gestures: youGestures,
          }}
          clockOffset={startFrame / fps}
        />
        {truck && truck.drawn ? (
          <UtilityTruck
            mood={mood}
            at={truck.at}
            direction={truck.direction}
            spin={truck.travelled / TRUCK.wheelR}
            blur={
              ((integrateSpeed(props.truck?.speed ?? [{at: 0, speed: 9}], t + 0.5 / fps, 0.8) -
                integrateSpeed(props.truck?.speed ?? [{at: 0, speed: 9}], t - 0.5 / fps, 0.8)) /
                TRUCK.wheelR) *
              0.5
            }
            dot={truckDot}
            clockOffset={startFrame / fps}
          />
        ) : null}
        {live.map((b, i) => (
          <group key={i}>
            <RadioPulse
              position={[b.src[0], b.src[1] + 0.03, b.src[2]]}
              age={b.age}
              reach={(b.reach ?? 1.2) * Math.min(1, camD / 6)}
              weight={1.4 * k}
              arc={Math.PI}
            />
            {b.dst && b.on ? (
              <OrangePath
                legs={arc(b.src, b.dst)}
                progress={b.progress}
                glow={b.glow}
                stain={false}
                runner={false}
                radius={0.025 * k}
                coreColor={section.orange}
                halo={{scale: 0.07 / 0.025, opacity: 0.25}}
              />
            ) : null}
            {b.dst && b.on && b.progress > 0.98 && b.to !== undefined && b.to !== 'truck' ? (
              <mesh position={b.dst} material={mats.node} userData={{glow: true}}>
                <sphereGeometry args={[0.08, 16, 12]} />
              </mesh>
            ) : null}
          </group>
        ))}
      </SectionStage>
    </AbsoluteFill>
  );
};
