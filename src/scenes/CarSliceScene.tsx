import React, {useMemo} from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import * as THREE from 'three';
import {MOODS, type CastName} from '../theme';
import {EV} from '../three/real/EvDrive';
import {GAS} from '../three/real/GasDrive';
import {
  isBay,
  isGas,
  isLeft,
  layoutOf,
  simRevs,
  SlicedCar,
  slicedCarCrank,
  slicedCarShake,
  toWorld,
  type SlicedCarOptions,
  type V3,
} from '../three/real/SlicedCar';
import {projectToFrame, SectionCamera, sectionCameraAt, type Framing} from '../three/section/SectionCamera';
import {SectionLights, SectionStage} from '../three/section/SectionStage';
import {skyTexture} from '../three/section/textures';
import {framingAtKeys, type CameraKey} from './keyframes';

// the car rig lives in `three/real/SlicedCar` (N0, No. 007); its types and speeds stay importable from here
export {
  DEFAULT_IDS,
  MPH45_REVS,
  MPH60_REVS,
  WHEELS,
  type CarCorner,
  type FootKey,
  type GasPathKeys,
  type RegenKeys,
  type WheelId,
} from '../three/real/SlicedCar';

export type CarFraming =
  | 'wide'
  | 'cabin'
  | 'frontWheel'
  | 'allWheels'
  | 'lowWheels'
  | 'frontTire'
  | 'contact'
  | 'drive'
  | 'pedals'
  | 'motor'
  | 'battery'
  | 'brake'
  | 'pads'
  | 'disc'
  | 'cabinSignal'
  | 'car'
  | 'bay'
  | 'pedal'
  | 'signal'
  | 'throttle'
  | 'evBay';

export const CAR_FRAMINGS: Record<
  Exclude<
    CarFraming,
    | 'drive'
    | 'pedals'
    | 'motor'
    | 'battery'
    | 'brake'
    | 'pads'
    | 'disc'
    | 'cabinSignal'
    | 'car'
    | 'bay'
    | 'pedal'
    | 'signal'
    | 'throttle'
    | 'evBay'
  >,
  Framing
> = {
  wide: {look: [0.05, 0.3, 0.1], distance: 21},
  cabin: {look: [0.45, 1.25, -0.1], distance: 10.5},
  frontWheel: {look: [1.3, 0.62, 0.75], distance: 7.5},
  allWheels: {look: [0, 0.05, 0], distance: 19},
  lowWheels: {look: [0, 0.48, 0.8], distance: 12.5},
  /**
   * The near front tire whole on the cut, a few dips either side (highway: ½ in ≈ 11 px); the contact
   * patch at y ≈ 880, above the captions.
   */
  frontTire: {look: [1.35, -0.09, 0.8], distance: 4.6},
  /** Close on the near front tire's contact patch: the tread, the dip under it, the trapped air (½ in ≈ 26 px), at y ≈ 850. */
  contact: {look: [1.35, -0.055, 0.8], distance: 2.0},
};

/**
 * The electric car's framings (No. 006, `variant: 'ev'`, the car facing −x, world metres). Set on the
 * test stills: `drive` is frame 0 and the loop (front wheel, drive unit, foot, front of the pack, the
 * stop line); `cabin` leaves room for a corner signal at frame top-left.
 */
export const EV_FRAMINGS: Partial<Record<CarFraming, Framing>> = {
  drive: {look: [-0.95, 0.17, 0.5], distance: 10},
  pedals: {look: [-0.8, 0.4, 0.32], distance: 3.4},
  cabin: {look: [-0.6, 0.52, 0.4], distance: 10.5},
  cabinSignal: {look: [-0.7, 1.75, 0.2], distance: 13.5},
  motor: {look: [-1.28, 0.62, 0.35], distance: 2.2},
  battery: {look: [-0.42, 0.14, 0.62], distance: 3.2},
  wide: {look: [0.0, 1.3, 0.0], distance: 26},
  brake: {look: [-1.33, 0.3, 0.75], distance: 2.0},
  pads: {look: [-1.232, 0.291, 0.746], distance: 0.5},
  disc: {look: [-1.43, 0.33, 0.768], distance: 1.0},
  /** No. 008: M, the drive unit, the inverter and its board, the pedals and foot, the driver's head. */
  evBay: {look: [-0.8, 0.676, 0.246], distance: 9.5},
};

/**
 * The gas car's framings (No. 008, `variant: 'gas'`, facing −x, world metres; set on test stills). `car`
 * is frame 0 and the loop: the whole car on the road, the sneaker on the pedal, the engine bay at frame
 * left, the rear lamps at frame right, the car below the title block. `throttle` puts the throttle body
 * where the EV's `motor` framing puts the drive unit (the same offset from the subject, the same
 * distance), so a slide between the two cars lands on the same spot.
 */
export const GAS_FRAMINGS: Partial<Record<CarFraming, Framing>> = {
  car: {look: [-0.055, 0.177, 0.331], distance: 19},
  bay: {look: [-1.185, 0.255, 0.49], distance: 6.5},
  signal: {look: [-0.966, 0.518, 0.345], distance: 3.4},
  pedal: {look: [-0.802, 0.501, 0.293], distance: 3},
  throttle: {
    look: [
      -GAS.tb[0] + (EV_FRAMINGS.motor!.look[0] + EV.motor[0]),
      GAS.tb[1] + (EV_FRAMINGS.motor!.look[1] - EV.motor[1]),
      GAS.tbZ + (EV_FRAMINGS.motor!.look[2] - EV.motorZ),
    ],
    distance: EV_FRAMINGS.motor!.distance,
  },
};

export type CarSliceSceneProps = SlicedCarOptions & {
  durationInFrames: number;
  /** Realistic objects (accepted for consistency; the car is always realistic). */
  realism?: boolean;
  /**
   * Framing preset (default 'wide'): 'wide', 'cabin', 'frontWheel', 'allWheels', 'lowWheels', 'frontTire',
   * 'contact'; for 'ev' also 'drive', 'pedals', 'motor', 'battery', 'brake', 'pads', 'disc' (`EV_FRAMINGS`;
   * 'wide' and 'cabin' have their own EV versions). Facing left, a preset without an EV version is mirrored.
   */
  framing?: CarFraming;
  /** A custom move instead of a preset (look-at + distance at the fixed angle). */
  camera?: {from: Framing; to?: Framing};
  /**
   * Camera keyframes: from the scene's starting framing (`camera.from` or the preset) the camera eases
   * to each key's framing, arriving at its `at` (s), and holds after the last. Overrides `camera`,
   * `push` and the glide in (`cameraFrom`, `cameraGlide`).
   */
  cameraKeys?: CameraKey[];
  /** Push toward the subject, units/s (default 0.04). */
  push?: number;
  /** Idle sideways drift, ± units (default 0.08). */
  drift?: number;
  location?: string;
  transition?: 'auto' | 'continue' | 'glide' | 'cut' | 'dissolve' | 'slide' | 'follow';
  follow?: {direction?: 'down' | 'up' | 'left' | 'right'; at?: number};
  glide?: number;
  cameraFrom?: Framing;
  cameraGlide?: number;
};

/** A framing preset for these props (EV and mirrored versions when the car faces left). */
const framingFor = (p: Partial<CarSliceSceneProps>): Framing => {
  const name = p.framing ?? 'wide';
  if (!isLeft(p)) return CAR_FRAMINGS[name as keyof typeof CAR_FRAMINGS] ?? CAR_FRAMINGS.wide;
  const gas = isGas(p) ? GAS_FRAMINGS[name] : undefined;
  if (gas) return gas;
  const ev = EV_FRAMINGS[name];
  if (ev) return ev;
  const f = CAR_FRAMINGS[name as keyof typeof CAR_FRAMINGS] ?? CAR_FRAMINGS.wide;
  return {look: [-f.look[0], f.look[1], f.look[2]], distance: f.distance};
};

const carCameraMove = (
  p: Partial<CarSliceSceneProps>,
  durationInFrames: number,
  fps: number,
  frame?: number,
): {from: Framing; to: Framing; pre?: {from: Framing; hold: number; move: number; ease: 'cubic'}} => {
  if (p.cameraKeys && p.cameraKeys.length) {
    const base = p.camera?.from ?? framingFor(p);
    const f = framingAtKeys(p.cameraKeys, base, frame === undefined ? Infinity : frame / fps);
    return {from: f, to: f};
  }
  const push = p.push ?? 0.04;
  const pre =
    p.cameraGlide && p.cameraFrom
      ? {from: p.cameraFrom, hold: 0, move: Math.max(1, Math.round(p.cameraGlide * fps)), ease: 'cubic' as const}
      : undefined;
  const secs = Math.max(0, durationInFrames - (pre ? pre.move : 0)) / fps;
  if (p.camera) return {from: p.camera.from, to: p.camera.to ?? p.camera.from, pre};
  const preset = framingFor(p);
  const c = pre ? undefined : p.cameraFrom;
  const same = c && c.look.every((v, i) => Math.abs(v - preset.look[i]) < 1e-6);
  const from = c && same ? c : preset;
  return {from, to: {look: from.look, distance: from.distance - push * secs}, pre};
};

/**
 * What a car-slice scene hands on to the next one when it continues (Explainer): for 'ev', the wheel
 * revolutions turned by the end of this scene (its own `revsFrom` plus its speed keys over its length).
 */
export const carCarry = (
  p: Partial<CarSliceSceneProps>,
  durationInFrames: number,
  fps: number,
): Record<string, unknown> =>
  p.variant === 'ev' || p.variant === 'gas'
    ? {
        revsFrom: simRevs(p, durationInFrames / fps, fps),
        // the V8's crank runs on across the cut too (No. 007)
        ...(p.variant === 'gas' && p.engine === 'v8' ? {crankFrom: slicedCarCrank(p, durationInFrames / fps)} : {}),
      }
    : {};

export const carCameraStart = (p: Partial<CarSliceSceneProps>, d: number, fps: number): Framing =>
  carCameraMove({...p, cameraFrom: undefined, cameraGlide: undefined}, d, fps, 0).from;
export const carCameraEnd = (p: Partial<CarSliceSceneProps>, d: number, fps: number): Framing =>
  carCameraMove(p, d, fps).to;

const cameraAtFrame = (p: Partial<CarSliceSceneProps>, o: {frame: number; fps: number; durationInFrames: number}) => {
  const {from, to, pre} = carCameraMove(p, o.durationInFrames, o.fps, o.frame);
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

/** Top of the driver's head on screen (px), for name tags; undefined for anyone else. */
export const carHeadTopOnScreen = (
  p: Partial<CarSliceSceneProps>,
  who: CastName,
  o: {frame: number; fps: number; durationInFrames: number},
): [number, number] | undefined => {
  if ((p.driver ?? 'you') !== who) return undefined;
  const [x, y, z] = layoutOf(p).driver;
  return projectToFrame(cameraAtFrame(p, o), toWorld(p, [x - 0.05, y + 1.49, z]));
};

/** The driver's head box on screen [xMin, xMax, yTop, yBottom] (px). */
export const carHeadBoxOnScreen = (
  p: Partial<CarSliceSceneProps>,
  who: CastName,
  o: {frame: number; fps: number; durationInFrames: number},
): [number, number, number, number] | undefined => {
  if ((p.driver ?? 'you') !== who) return undefined;
  const cam = cameraAtFrame(p, o);
  const [x, y, z] = layoutOf(p).driver;
  const c: V3 = toWorld(p, [x - 0.05, y + 1.325, z]);
  const pts = [
    projectToFrame(cam, [c[0], c[1], c[2] - 0.2]),
    projectToFrame(cam, [c[0], c[1], c[2] + 0.2]),
    projectToFrame(cam, [c[0], c[1] + 0.2, c[2]]),
    projectToFrame(cam, [c[0], c[1] - 0.2, c[2]]),
  ];
  const xs = pts.map((q) => q[0]);
  const ys = pts.map((q) => q[1]);
  return [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
};

/** The instrument cluster on screen (px), for the dashboard detail box's leader. */
export const clusterOnScreen = (
  p: Partial<CarSliceSceneProps>,
  o: {frame: number; fps: number; durationInFrames: number},
) => {
  const k = layoutOf(p).cluster;
  return projectToFrame(cameraAtFrame(p, o), toWorld(p, [k[0] + 0.07, k[1] + 0.06, k[2]]));
};

/**
 * C, the car slice (No. 002): a generic car cut open (near side along the near wheels' mid-plane, the
 * roof above the windows), the driver at the wheel, four turning wheels on a scrolling road on a cut
 * ground block. 'sensors': each wheel has a sensor (orange node dot); pulses run as orange routes from a
 * wheel to the receiver under the dash (node dots at both ends), with optional ID tags; the
 * cluster's tire light comes on in warning yellow. 'indirect': no sensors and no orange; toothed
 * speed rings and sidewall ticks, the low wheel turning faster. The low tire sags in both. The car is a
 * `SlicedCar` (three/real); this scene adds the camera, the sky and the light.
 */
export const CarSliceScene: React.FC<CarSliceSceneProps> = (props) => {
  const {durationInFrames, mood = 'day', startFrame = 0} = props;
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const m = MOODS[mood];
  const bay = isBay(props);
  const {from, to, pre} = carCameraMove(props, durationInFrames, fps, frame);
  const sky = useMemo(() => new THREE.MeshBasicMaterial({map: skyTexture(mood), fog: false}), [mood]);
  sky.color.setScalar(1 / m.exposure);
  const camNow = cameraAtFrame(props, {frame, fps, durationInFrames});
  const camD = camNow.position.distanceTo(camNow.look);
  const shakeAmt = slicedCarShake(props, t);
  // the brake-corner framings open the near front wheel's wedge by default
  const wedge =
    props.wedge === undefined
      ? ['brake', 'pads', 'disc'].includes(props.framing ?? '')
        ? ([-2.1, -0.45] as [number, number])
        : undefined
      : props.wedge;

  return (
    <AbsoluteFill>
      {/* close framings of the electric car shrink the AO radius with the camera (at 0.35 m it filled a 1 m frame) */}
      <SectionStage
        mood={mood}
        post={bay ? {focusY: 0.5, aoRadius: 0.35 * Math.max(0.06, Math.min(1, camD / 10))} : {focusY: 0.5}}
        ao
      >
        <SectionCamera
          from={from}
          to={to}
          pre={pre}
          durationInFrames={durationInFrames}
          drift={props.drift ?? 0.08}
          clockOffset={startFrame / fps}
          shake={shakeAmt}
          shakeSeed="car-slice-shake"
        />
        <SectionLights mood={mood} target={[0, 0.8, 0]} lamp={0} />
        <mesh position={[0, 8, -14]} material={sky}>
          <planeGeometry args={[80, 50]} />
        </mesh>
        <SlicedCar {...props} wedge={wedge} cameraDistance={camD} />
      </SectionStage>
    </AbsoluteFill>
  );
};
