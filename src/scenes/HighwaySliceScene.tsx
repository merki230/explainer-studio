import React, {useMemo} from 'react';
import {AbsoluteFill, random, useCurrentFrame, useVideoConfig} from 'remotion';
import * as THREE from 'three';
import {HIGHWAY, MOODS, type Mood} from '../theme';
import {raw} from '../three/plaster';
import {CAR_LAYOUT} from '../three/real/RealCar';
import {carToWorld, DrivingCar} from '../three/real/DrivingCar';
import type {RoadSignKind} from '../three/real/RoadSigns';
import {SIGN_SIZE} from '../three/real/RoadSigns';
import {bandMaterial} from '../three/section/GrooveCut';
import {RadioPulse} from '../three/TirePieces';
import {groundAt, HIGHWAY_LAYOUT, HighwaySlice, SIGN_SPOTS} from '../three/section/HighwaySlice';
import {
  projectToFrame,
  SECTION_ANGLE,
  sectionCameraAt,
  SectionCamera,
  type Framing,
} from '../three/section/SectionCamera';
import {SectionLights, SectionStage} from '../three/section/SectionStage';
import {skyTexture} from '../three/section/textures';
import {ease, framingAtKeys, integrateSpeed, keyed, speedAt, type CameraKey, type SpeedKey} from './keyframes';

type V3 = [number, number, number];
const H = HIGHWAY_LAYOUT;
const C = CAR_LAYOUT;
const G = H.groove;

/** The car's tire: its outer sidewall sits this far outboard of the wheel centre (RealWheel at radius 0.36). */
const TIRE_OUT = 0.125;
/** Tread width in contact with the road. */
const TREAD = 0.2;
/** Car-local x of the rear bumper (RealCar faces +x). */
const REAR = -2.4;

export type HighwayFraming = 'tire' | 'groove' | 'shoulder' | 'mw' | 'edge' | 'signs' | 'wide';

/**
 * Framings at the fixed angle (metres). C: 'tire' (frame 0: YOU's right-rear tire just inside the white
 * line, the cut face with the paint layer and the cut groove in front of it), 'groove' (the groove cut on
 * the face, the next ones behind). M: 'shoulder' (the shoulder band from the white line to the gravel,
 * the speed limit sign's post). MW: 'mw' (YOU's car and the right carriageway, the 65 sign; 'edge' is the
 * same framing, the A/V script's name), 'signs' (MILE 112 and the guide sign up the verge, close enough to read). W: 'wide' (the cut-open interstate from the median to the ditch, the signs
 * receding up the right verge to the guide sign; at this size the signs read as shapes, the 65 as a number).
 */
export const HIGHWAY_FRAMINGS: Record<HighwayFraming, Framing> = {
  tire: {look: [0.1, 0.35, -1.0], distance: 8.5},
  groove: {look: [0.48, -0.03, -0.14], distance: 2.3},
  shoulder: {look: [1.55, -0.6, -1.8], distance: 23},
  mw: {look: [0.6, -0.1, -5.3], distance: 55},
  edge: {look: [0.6, -0.1, -5.3], distance: 55},
  signs: {look: [6.93, 1.05, -30.0], distance: 35},
  wide: {look: [-4.44, 7.0, -19.3], distance: 138},
};

/** A keyed value (eased cubic between keys) or a constant. */
export type Keyed = number | {at: number; value: number}[];

export type HighwayCar = {
  /**
   * Where the right tires' outer sidewalls are across the road, metres from the white line's inner
   * edge (+ toward the shoulder), a constant or keys (eased). −0.1: just inside the line (frame 0);
   * 0.55: both right tires on the groove row (the row is 0.30 → 0.69); −0.9: the middle of the lane.
   * Default −0.1.
   */
  lateral?: Keyed;
  /** How far the rear bumper is behind the section plane (m, default 0.5). The car is never cut. */
  rear?: number;
  /** Speed keys in m/s (default 26.8 ≈ 60 mph), eased over 0.8 s: the road streams toward the camera. */
  speed?: SpeedKey[];
  /** Tail lamps lit (default: on at Night, off in Day). */
  tail?: boolean;
  /** Headlights on, white cones on the road ahead (default: on at Night, off in Day). */
  headlights?: boolean;
  /** YOU at the wheel (default true; seen only dimly through the rear window). */
  driver?: boolean;
  /** Body colour (default 'you'). */
  body?: 'you' | 'mom' | 'extra';
  /**
   * The shutter for this car's wheels only (fraction of a frame, default 0.02 ≈ 1/1500 s): fast, so the
   * focus tire's tread and spokes read instead of smearing into a grey ring (at the scene's 0.5 a
   * 60 mph wheel turns ≈ 70° while the shutter is open). The road keeps the scene's `shutter`.
   */
  tireShutter?: number;
};

/** Another car ahead, driving away (whole, never cut: hidden once any of it would reach the plane). */
export type HighwayTraffic = {
  lane: 'left' | 'right';
  /** Its rear bumper's distance behind the plane at the scene's start (m). */
  ahead: number;
  /** Its speed (m/s, default 28): faster than YOU's car pulls away, slower comes back. */
  speed?: number;
  body?: 'you' | 'mom' | 'extra';
};

export type HighwaySign = {
  kind: RoadSignKind;
  /** The legend ('speed': [SPEED, LIMIT, nn]; 'mile': [digits]; 'guide': [line 1, line 2]). */
  text: string[];
  /** Its centre line across (x) and its place along the road (z < 0); defaults per kind (`SIGN_SPOTS`). */
  x?: number;
  z?: number;
};

export type HighwaySliceSceneProps = {
  durationInFrames: number;
  /** Day (default) or Night. */
  mood?: Mood;
  /** Framing preset (default 'tire'). */
  framing?: HighwayFraming;
  /** A custom move instead of a preset. */
  camera?: {from: Framing; to?: Framing};
  /** Camera keyframes (`log: true` for a steady dolly over a big range); override `camera` and `push`. */
  cameraKeys?: CameraKey[];
  /** Push, units/s (default 0). */
  push?: number;
  /** Idle sideways drift, ± units (default 0.08; 0 on the loop's first and last scenes). */
  drift?: number;
  /** YOU's car (default: one, as frame 0), or null for none. */
  car?: HighwayCar | null;
  /**
   * The shutter (fraction of a frame, default 0.5): the road's paint and grooves smear over the distance
   * the road moves while it is open. At road speed the grooves blur into a dark ribbon; 0 keeps them
   * sharp (they then crawl, like spokes on film). Slow the car (`car.speed`) to show single grooves.
   */
  shutter?: number;
  /** Other cars ahead, driving away (default: one in the left lane at 40 m, one in the right lane at 95 m). */
  traffic?: HighwayTraffic[];
  /**
   * The grooves' orange wash (the system): 'auto' (default: lit under YOU's right tires while they are
   * on the row, from the plane to just past the front tire), or a constant / keys 0 → 1 over the same span.
   */
  grooveLit?: 'auto' | Keyed;
  /**
   * The signs on the right verge, facing the camera (default: SPEED LIMIT 65 near the plane, MILE 112,
   * NEXT EXIT / 2 MILES far up the road). No shield, no route number, no rumble-strip sign. [] for none.
   */
  signs?: HighwaySign[];
  /** The W-beam guardrail (default true). */
  guardrail?: boolean;
  /**
   * Impact flashes (the system): from `at` (s), an orange ring at each right tire's contact patch while
   * its tread is on the row, `rate` a second (default 6: slowed so the eye can count; the real rate is
   * ≈ 88), the rear and front tires out of step. `blur` (constant or keys, 0 → 1) fades the rings into
   * one continuous orange band under each right tire (the real thing: too fast to count). Default none.
   */
  impacts?: {at?: number; rate?: number; blur?: Keyed} | null;
  /**
   * "Feel it": a fast seeded tremble (0 → 1, constant or keys) of the camera and YOU's car body, only
   * while its right tires are on the grooves. Default 0 (off).
   */
  shake?: Keyed;
  /**
   * Short hard kicks on the shake (≈ 3×, gone in 0.35 s): scene seconds, or 'auto' (each time the right
   * tires reach the row). Default none.
   */
  shakeKick?: number[] | 'auto';
  /**
   * Line 7's drawing (🎭): five grey ink tire tracks on the road, each drawing from its `at` (s) over
   * `draw` s (default 1.4), drifting right across the right lane toward the shoulder, one after the
   * other up the road; where one crosses the groove row it flashes orange. Track `back` (index, default
   * 4, the fifth; null for none) bends back into the lane at the row; the others run on to x = `end`
   * (default 3.4, just short of the guardrail). Default none.
   */
  tracks?: {
    at: number[];
    draw?: number;
    back?: number | null;
    end?: number;
    /** The first track's start up the road (z, default −4), the step to the next (m, default 8), each one's length (m, default 22). */
    start?: number;
    spacing?: number;
    length?: number;
  } | null;
  location?: string;
  transition?: 'auto' | 'continue' | 'glide' | 'cut' | 'dissolve' | 'slide' | 'follow';
  follow?: {direction?: 'down' | 'up' | 'left' | 'right'; at?: number};
  glide?: number;
  /** Set by Explainer. */
  startFrame?: number;
  cameraFrom?: Framing;
  cameraGlide?: number;
};

export const DEFAULT_SIGNS: HighwaySign[] = [
  {kind: 'speed', text: ['SPEED', 'LIMIT', '65']},
  {kind: 'mile', text: ['112']},
  {kind: 'guide', text: ['NEXT EXIT', '2 MILES']},
];
const DEFAULT_TRAFFIC: HighwayTraffic[] = [
  {lane: 'left', ahead: 40, speed: 28.5},
  {lane: 'right', ahead: 95, speed: 27.5},
];
const DEFAULT_SPEED: SpeedKey[] = [{at: 0, speed: 26.8}];

const valueAt = (k: Keyed | undefined, t: number, dflt: number) =>
  k === undefined ? dflt : typeof k === 'number' ? k : keyed(k, t, dflt);

const highwayCameraMove = (
  p: Partial<HighwaySliceSceneProps>,
  durationInFrames: number,
  fps: number,
  frame?: number,
) => {
  const base = p.camera?.from ?? HIGHWAY_FRAMINGS[p.framing ?? 'tire'] ?? HIGHWAY_FRAMINGS.tire;
  if (p.cameraKeys && p.cameraKeys.length) {
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

export const highwayCameraStart = (p: Partial<HighwaySliceSceneProps>, d: number, fps: number): Framing =>
  highwayCameraMove({...p, cameraFrom: undefined, cameraGlide: undefined}, d, fps, 0).from;
export const highwayCameraEnd = (p: Partial<HighwaySliceSceneProps>, d: number, fps: number): Framing =>
  highwayCameraMove(p, d, fps).to;

/** The camera state at a frame (for anchors on H). */
export const highwayCameraAt = (
  p: Partial<HighwaySliceSceneProps>,
  o: {frame: number; fps: number; durationInFrames: number},
) => {
  const {from, to, pre} = highwayCameraMove(p, o.durationInFrames, o.fps, o.frame);
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

/** YOU's car at t: centre x, origin z, heading (rad about y), the road travelled, its speed. */
export const highwayCarAt = (car: HighwayCar, t: number) => {
  const speed = car.speed ?? DEFAULT_SPEED;
  const lateral = valueAt(car.lateral, t, -0.1);
  const dt = 1 / 60;
  const vLat = (valueAt(car.lateral, t + dt, -0.1) - valueAt(car.lateral, t - dt, -0.1)) / (2 * dt);
  const v = speedAt(speed, t, 0.8);
  const x = lateral - C.track - TIRE_OUT;
  const z = -(car.rear ?? 0.5) + REAR;
  return {
    lateral,
    x,
    z,
    // heading off straight ahead (−z) toward +x while drifting right (small at road speed)
    yaw: Math.atan2(vLat, Math.max(1, v)),
    travelled: integrateSpeed(speed, t, 0.8),
    speed: v,
  };
};

/** How lit the grooves are at t, and over which z span. */
export const grooveLitAt = (p: Partial<HighwaySliceSceneProps>, t: number) => {
  const car = p.car === undefined ? {} : p.car;
  const c = car ? highwayCarAt(car, t) : null;
  const far = c ? c.z - C.axleX.front - 0.45 : -6;
  const span: [number, number] = [0, far];
  const mode = p.grooveLit ?? 'auto';
  if (mode !== 'auto') return {lit: Math.max(0, Math.min(1, valueAt(mode, t, 0))), span};
  if (!c) return {lit: 0, span};
  // the tread's overlap with the row; fully lit once 0.1 m of it rides the grooves
  const overlap = Math.min(c.lateral, G.x1) - Math.max(c.lateral - TREAD, G.x0);
  return {lit: Math.max(0, Math.min(1, overlap / 0.1)), span};
};

/** Where another car is at t (its origin z), and whether it is drawn (wholly behind the plane). */
const trafficAt = (tr: HighwayTraffic, youTravelled: number, t: number) => {
  const z = -tr.ahead + REAR - ((tr.speed ?? 28) * t - youTravelled);
  return {x: tr.lane === 'left' ? H.lanes.left : H.lanes.right, z, drawn: z - REAR < -0.3};
};

/**
 * A named point of H in the world at t: 'tire' (YOU's right-rear tire's contact patch), 'tail' (its right
 * tail lamp), 'grooveDepth' (the bottom of the groove cut on the face), 'grooveNext' (the next groove's
 * middle, 12 in up the road), 'whiteLine' (the white line on the cut), 'sign:speed' | 'sign:mile' |
 * 'sign:guide' (the panel's middle).
 */
export const highwayAnchorPoint = (p: Partial<HighwaySliceSceneProps>, anchor: string, t: number): V3 | undefined => {
  const [name, arg] = anchor.split(':');
  const car = p.car === undefined ? {} : p.car;
  const c = car ? highwayCarAt(car, t) : null;
  switch (name) {
    case 'tire':
      return c ? carToWorld([C.axleX.rear, 0.02, C.track + TIRE_OUT - TREAD / 2], c) : undefined;
    case 'tail':
      return c ? carToWorld([REAR, 1.04, 0.7], c) : undefined;
    case 'grooveDepth':
      return [(G.x0 + G.x1) / 2, -G.depth, 0.002];
    case 'grooveNext':
      return [(G.x0 + G.x1) / 2, 0, -G.period];
    case 'whiteLine':
      return [(H.white[0] + H.white[1]) / 2, 0, 0.002];
    case 'sign': {
      const s = (p.signs ?? DEFAULT_SIGNS).find((q) => q.kind === arg);
      if (!s) return undefined;
      const spot = SIGN_SPOTS[s.kind];
      const size = SIGN_SIZE[s.kind];
      const bottom = s.kind === 'mile' ? 48 * 0.0254 : 84 * 0.0254;
      return [s.x ?? spot.x, bottom + size.h / 2, s.z ?? spot.z];
    }
    default:
      return undefined;
  }
};

/** A named point of H on screen (px) at this frame (see `highwayAnchorPoint`). */
export const highwayAnchorOnScreen = (
  p: Partial<HighwaySliceSceneProps>,
  anchor: string,
  o: {frame: number; fps: number; durationInFrames: number},
): [number, number] | undefined => {
  const w = highwayAnchorPoint(p, anchor, o.frame / o.fps);
  return w ? projectToFrame(highwayCameraAt(p, o), w) : undefined;
};

/** How far behind the look-at point the sky card stands (m): past the road's far end. */
const BACKDROP = 700;

/**
 * H, the highway slice (No. 005): a divided rural interstate at night cut square to the road (median,
 * inside shoulder, yellow left edge line, two 12 ft lanes, white right edge line, the 10 ft shoulder with
 * its groove row, gravel, guardrail, ditch), the road running into depth. YOU's car, whole, drives away
 * just behind the plane (the road streams toward the camera under it), its right tires' place across the
 * road keyed (`car.lateral`) so it can drift onto the grooves and back; the grooves wash orange under
 * the tires ('auto') or as keyed. Traffic ahead, headlight cones, retroreflective signs facing the camera
 * (SPEED LIMIT 65, MILE 112, NEXT EXIT / 2 MILES). Day or Night.
 */
export const HighwaySliceScene: React.FC<HighwaySliceSceneProps> = (props) => {
  const {durationInFrames, mood = 'day', startFrame = 0, guardrail = true} = props;
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const m = MOODS[mood];
  const night = mood === 'night';
  const {from, to, pre} = highwayCameraMove(props, durationInFrames, fps, frame);
  const cam = highwayCameraAt(props, {frame, fps, durationInFrames});
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
  const mats = useMemo(
    () => ({
      sky: new THREE.MeshBasicMaterial({map: skyTexture(mood), fog: false}),
      track: new THREE.MeshBasicMaterial({
        color: raw(MOODS[mood].ink),
        transparent: true,
        // grey ink: the Night ink at 55% on the asphalt
        opacity: 0.55,
        depthWrite: false,
      }),
    }),
    [mood],
  );
  const bandMats = useMemo(() => [bandMaterial('z', -1), bandMaterial('z', -1)], []);
  mats.sky.color.setScalar(1 / m.exposure);

  const carSpec = props.car === undefined ? {} : props.car;
  const car = carSpec ? highwayCarAt(carSpec, t) : null;
  const speed = carSpec ? (carSpec.speed ?? DEFAULT_SPEED) : DEFAULT_SPEED;
  const travelled = car ? car.travelled : 0;
  // half-frame shutter: the road moves this far while it is open; the wheels turn this much
  const shutter = (props.shutter ?? 0.5) / fps;
  const roadBlur = (car ? car.speed : 0) * shutter;
  const tireShutter = (carSpec?.tireShutter ?? 0.02) / fps;
  const wheelBlur = carSpec
    ? (integrateSpeed(speed, t + tireShutter / 2, 0.8) - integrateSpeed(speed, t - tireShutter / 2, 0.8)) / C.wheelR
    : 0;
  const {lit, span} = grooveLitAt(props, t);
  const headlights = carSpec ? (carSpec.headlights ?? night) : false;

  // the signs, and how much the headlights brighten their retroreflective faces (nearer: brighter)
  const front = car ? car.z - 2.37 : 0;
  const signs = (props.signs ?? DEFAULT_SIGNS).map((s) => {
    const spot = SIGN_SPOTS[s.kind];
    const z = s.z ?? spot.z;
    const ahead = front - z;
    const retro = headlights && ahead > 0 ? 0.55 / (1 + (ahead / 40) ** 2) : 0;
    return {kind: s.kind, text: s.text, x: s.x ?? spot.x, z, retro: night ? 0.08 + retro : retro};
  });

  // the cut face's ink keeps ≈ 3 px from the groove close-up to the wide shot: the § 3 width (0.011) at the
  // living room's wide distance (12.75), scaled with the distance (thinner close: the groove is ½ in deep)
  const ink = Math.max(0.25, Math.min(16, camD / 12.75));

  // headlights: two spots from the lamps, aimed at the road ≈ 28 m ahead (always mounted: 0 when off)
  const lamps = useMemo(() => [0, 1].map(() => new THREE.SpotLight(raw(HIGHWAY.headlight), 0, 75, 0.36, 0.55, 1)), []);
  if (car) {
    [-0.55, 0.55].forEach((s, i) => {
      const l = lamps[i];
      l.intensity = headlights ? 26 : 0;
      l.position.set(...carToWorld([2.3, 0.8, s], car));
      l.target.position.set(...carToWorld([30, 0, s * 2.5], car));
      l.target.updateMatrixWorld();
    });
  } else lamps.forEach((l) => (l.intensity = 0));

  const traffic = (props.traffic ?? DEFAULT_TRAFFIC).map((tr) => ({tr, ...trafficAt(tr, travelled, t)}));

  // impact flashes and the band under YOU's right tires (rings sized by the camera: ≈ the same on screen)
  const ringK = Math.max(0.6, Math.min(8, camD / 8.5));
  const imp = props.impacts ?? null;
  const impBlur = imp ? Math.max(0, Math.min(1, valueAt(imp.blur, t, 0))) : 0;
  const tiresOnRow =
    car && carSpec
      ? Math.max(0, Math.min(1, (Math.min(car.lateral, G.x1) - Math.max(car.lateral - TREAD, G.x0)) / 0.1))
      : 0;
  // the "feel it" tremble, gated to the grooves, with kicks (given, or each time the tires reach the row)
  const onRowAt = (tt: number) => {
    if (!carSpec) return 0;
    const lat = valueAt(carSpec.lateral, tt, -0.1);
    return Math.max(0, Math.min(1, (Math.min(lat, G.x1) - Math.max(lat - TREAD, G.x0)) / 0.1));
  };
  const kickTimes =
    props.shakeKick === 'auto'
      ? [...Array(11).keys()]
          .map((i) => t - i / fps)
          .filter((tt) => tt > 0 && onRowAt(tt) >= 0.3 && onRowAt(tt - 1 / fps) < 0.3)
      : (props.shakeKick ?? []);
  const kick = kickTimes.reduce((a, k) => {
    const age = t - k;
    return age < 0 || age > 0.35 ? a : a + 2 * (1 - age / 0.35) ** 2;
  }, 0);
  const shakeAmt = Math.max(0, valueAt(props.shake, t, 0)) * tiresOnRow + kick;
  const sj = (k: string, a: number) =>
    shakeAmt > 0 ? (random(`hwy-shake-${k}-${frame}`) - 0.5) * 2 * a * shakeAmt : 0;
  const bodyJ: V3 = [sj('x', 0.004), sj('y', 0.005), sj('z', 0.004)];
  const contacts =
    car && imp
      ? [C.axleX.rear, C.axleX.front].map((ax, i) => {
          const period = 1 / Math.max(0.1, imp.rate ?? 6);
          const since = t - (imp.at ?? 0) - (i * period) / 2;
          const ages = since < 0 ? [] : [0, 1, 2].map((j) => (since % period) + j * period).filter((a) => a <= since);
          return {at: carToWorld([ax, 0.01, C.track + TIRE_OUT - TREAD / 2], car), ages};
        })
      : [];
  bandMats.forEach((b, i) => {
    b.uniforms.uAmt.value = impBlur * tiresOnRow;
    b.uniforms.uHead.value = contacts[i]?.at[2] ?? 0;
  });

  // line 7's tire tracks: their paths (fixed), how much of each is drawn, and the flash where each crosses the row
  const trk = props.tracks ?? null;
  // keyed on the layout only, so the paths (and the ribbons' geometry) are built once, not every frame
  const trackKey = trk
    ? [
        trk.at.length,
        trk.back === undefined ? 4 : trk.back,
        trk.end ?? 3.4,
        trk.start ?? -4,
        trk.spacing ?? 8,
        trk.length ?? 22,
      ].join('|')
    : '';
  const trackPaths = useMemo(() => {
    if (!trackKey) return [];
    const [n, back, end, start, spacing, length] = trackKey.split('|');
    return trackPolylines(Number(n), back === 'null' ? null : Number(back), {
      end: Number(end),
      start: Number(start),
      spacing: Number(spacing),
      length: Number(length),
    });
  }, [trackKey]);
  const trackState = trk
    ? trackPaths.map((path, k) => {
        const draw = trk.draw ?? 1.4;
        const t0 = trk.at[k] ?? 0;
        const progress = ease(t, t0, t0 + draw);
        const cross = path.cross;
        const crossAt = cross ? t0 + draw * cross.u : null;
        return {path, progress, cross, crossAge: crossAt === null ? -1 : t - crossAt};
      })
    : [];

  return (
    <AbsoluteFill>
      <SectionStage mood={mood} post={{focusY: 0.5}} ao far={1500}>
        <SectionCamera
          from={from}
          to={to}
          pre={pre}
          durationInFrames={durationInFrames}
          drift={props.drift ?? 0.08}
          clockOffset={startFrame / fps}
          fitClip
          farMin={camD + BACKDROP + 50}
          shake={shakeAmt}
          shakeSeed="highway-shake"
        />
        <SectionLights mood={mood} target={[0, 0, -6]} lamp={0} extent={16} figureSpot={false} />
        {lamps.map((l, i) => (
          <React.Fragment key={i}>
            <primitive object={l} />
            <primitive object={l.target} />
          </React.Fragment>
        ))}
        <mesh
          position={backdrop.position}
          quaternion={backQ}
          material={mats.sky}
          scale={[backdrop.size * 0.5625, backdrop.size, 1]}
        >
          <planeGeometry args={[1, 1]} />
        </mesh>
        <HighwaySlice
          mood={mood}
          scroll={travelled}
          blur={roadBlur}
          lit={lit}
          litSpan={span}
          ink={ink}
          signs={signs}
          guardrail={guardrail}
        />
        {car && carSpec ? (
          <DrivingCar
            mood={mood}
            at={car}
            travelled={travelled}
            blur={wheelBlur}
            body={carSpec.body ?? 'you'}
            tail={(carSpec.tail ?? night) ? 1 : 0}
            driver={carSpec.driver ?? true}
            plate="8KTR 214"
            clockOffset={startFrame / fps}
            // the focus wheels sit in the car's own key shadow at Night: more studio reflection keeps
            // the spokes, lip and tread readable (no light added)
            envBoost={night ? 2.6 : 1}
            jitter={bodyJ}
          />
        ) : null}
        {traffic
          .filter((q) => q.drawn)
          .map((q, i) => (
            <DrivingCar
              key={i}
              mood={mood}
              at={{x: q.x, z: q.z, yaw: 0}}
              travelled={(q.tr.speed ?? 28) * t}
              blur={((q.tr.speed ?? 28) * shutter) / C.wheelR}
              body={q.tr.body ?? 'extra'}
              tail={night ? 1 : 0}
              driver={false}
              plate={i % 2 ? '5MWD 830' : '3HLA 571'}
              clockOffset={startFrame / fps}
            />
          ))}
        {/* impact flashes at the right tires' contact patches, and the band they blur into */}
        {contacts.map((c, i) => (
          <React.Fragment key={i}>
            {impBlur < 0.6 && tiresOnRow > 0.3
              ? c.ages.map((age, j) => (
                  <group key={j} position={c.at} scale={ringK}>
                    <RadioPulse position={[0, 0, 0]} age={age} reach={0.22} weight={1} arc={Math.PI} />
                  </group>
                ))
              : null}
            <mesh
              position={[(G.x0 + G.x1) / 2, 0.006, c.at[2] + 0.4]}
              rotation={[-Math.PI / 2, 0, 0]}
              material={bandMats[i]}
              visible={impBlur * tiresOnRow > 0.003}
              userData={{glow: true}}
              renderOrder={5}
            >
              <planeGeometry args={[G.x1 - G.x0, 1.0]} />
            </mesh>
          </React.Fragment>
        ))}
        {/* line 7: the tire tracks (ink on the road) and their flash on the row */}
        {trackState.map((s, k) => (
          <React.Fragment key={k}>
            <TrackRibbon path={s.path} progress={s.progress} material={mats.track} />
            {s.cross && s.crossAge >= 0 && s.crossAge < 1 ? (
              <group position={[s.cross.x, groundAt(s.cross.x) + 0.02, s.cross.z]} scale={ringK}>
                <RadioPulse position={[0, 0, 0]} age={s.crossAge} reach={0.3} weight={1} arc={Math.PI} />
              </group>
            ) : null}
          </React.Fragment>
        ))}
      </SectionStage>
    </AbsoluteFill>
  );
};

/** A tire track's polyline on the road (x, z), its total length, and where it first crosses onto the row. */
type TrackPath = {pts: [number, number][]; cross: {x: number; z: number; u: number} | null};

/**
 * The five tracks (line 7, 🎭): each starts in the right lane up the road from the last (z0 = start −
 * spacing · k) and runs `length` m away from the camera, drifting right with growing speed to x = `end`; the `back` one
 * reaches the row and bends back into the lane.
 */
const trackPolylines = (
  n: number,
  back: number | null,
  o: {end: number; start: number; spacing: number; length: number},
): TrackPath[] =>
  [...Array(n).keys()].map((k) => {
    const {end} = o;
    const z0 = o.start - o.spacing * k;
    const len = o.length;
    const xs = H.lanes.right + 0.5;
    const rowMid = (G.x0 + G.x1) / 2;
    const pts: [number, number][] = [];
    const N = 60;
    for (let i = 0; i <= N; i++) {
      const u = i / N;
      const sm = (a: number) => a * a * (3 - 2 * a);
      const x =
        k === back
          ? u < 0.6
            ? xs + (rowMid - xs) * sm(u / 0.6)
            : rowMid + (H.lanes.right - 0.2 - rowMid) * sm((u - 0.6) / 0.4)
          : xs + (end - xs) * Math.pow(u, 1.7);
      pts.push([x, z0 - len * u]);
    }
    const i = pts.findIndex(([x]) => x >= G.x0);
    return {pts, cross: i > 0 ? {x: pts[i][0], z: pts[i][1], u: i / N} : null};
  });

/** A track drawn as a flat ink ribbon on the road (following the ground), revealed by `progress`. */
const TrackRibbon: React.FC<{path: TrackPath; progress: number; material: THREE.Material}> = ({
  path,
  progress,
  material,
}) => {
  const geometry = useMemo(() => {
    const W = 0.32;
    const pos: number[] = [];
    const idx: number[] = [];
    path.pts.forEach(([x, z], i) => {
      const [ax, az] = path.pts[Math.max(0, i - 1)];
      const [bx, bz] = path.pts[Math.min(path.pts.length - 1, i + 1)];
      const l = Math.hypot(bx - ax, bz - az) || 1;
      const nx = -(bz - az) / l;
      const nz = (bx - ax) / l;
      for (const sgn of [-1, 1]) {
        const px = x + (sgn * W * nx) / 2;
        const pz = z + (sgn * W * nz) / 2;
        pos.push(px, groundAt(px) + 0.012, pz);
      }
      if (i > 0) {
        const a = 2 * (i - 1);
        idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
      }
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setIndex(idx);
    return g;
  }, [path]);
  const total = (path.pts.length - 1) * 6;
  geometry.setDrawRange(0, Math.floor((total * Math.max(0, Math.min(1, progress))) / 6) * 6);
  return progress > 0 ? <mesh geometry={geometry} material={material} renderOrder={3} /> : null;
};

/** The ground's height across the cut (for placing things on the verge). */
export const highwayGroundAt = groundAt;
