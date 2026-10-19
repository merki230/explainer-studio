import React, {useMemo} from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import * as THREE from 'three';
import {CAST_NEUTRAL, HIGHWAY, MOODS, type Mood} from '../theme';
import {raw} from '../three/plaster';
import {CAR_LAYOUT, RealCar} from '../three/real/RealCar';
import {RealWheel} from '../three/real/RealWheel';
import {Figure} from '../three/section/Figure';
import {
  DEFAULT_GROUPS,
  grooveLayout,
  HOUSE_SPOT,
  houseWindowAt,
  MUSICAL_LAYOUT,
  MusicalRoad,
  type GrooveGroup,
} from '../three/section/MusicalRoad';
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
const L = MUSICAL_LAYOUT;
const C = CAR_LAYOUT;

export type MusicalFraming = 'road' | 'notes' | 'wide' | 'groove' | 'house';

/**
 * Framings at the fixed angle (metres; the default groove strip runs x ≈ −2.4 → 18). 'road' (MW: the
 * road across the frame with the first groove groups on the cut face, the house behind), 'notes' (C:
 * the near wheel's path over the groove groups, an empty sky band above for the note staff), 'wide'
 * (W: the whole road, the house, the scrub and the ridge), 'groove' (a close-up of a few notches on the
 * cut face), 'house' (the house and its bedroom window over the road).
 */
export const MUSICAL_FRAMINGS: Record<MusicalFraming, Framing> = {
  road: {look: [-1.5, 0.8, -1], distance: 24},
  notes: {look: [0.5, 1.4, 0], distance: 20},
  wide: {look: [-6, 2.2, -5], distance: 50},
  groove: {look: [0.95, 0.02, 2.7], distance: 4.5},
  house: {look: [-13.5, 1.8, -6], distance: 24},
};

/** A keyed value (eased cubic between keys) or a constant. */
export type Keyed = number | {at: number; value: number}[];

export type MusicalCar = {
  /** Where the car's centre is along the road at the scene's start (x, m; default −9: entering from the left). */
  from?: number;
  /** Speed keys in m/s (default 7), eased over 0.8 s. */
  speed?: SpeedKey[];
  /** Headlights (white cones ahead) and tail lamps (default: on at Night, off in Day). */
  headlights?: boolean;
  tail?: boolean;
  /** A driver at the wheel (an extra, default true). */
  driver?: boolean;
  /** Body colour (default 'extra', the neutral grey). */
  body?: 'you' | 'mom' | 'extra';
};

export type MusicalRoadSceneProps = {
  durationInFrames: number;
  /** Day (default) or Night. */
  mood?: Mood;
  /** Framing preset (default 'road'). */
  framing?: MusicalFraming;
  /** A custom move instead of a preset. */
  camera?: {from: Framing; to?: Framing};
  /** Camera keyframes; override `camera` and `push`. */
  cameraKeys?: CameraKey[];
  /** Push, units/s (default 0). */
  push?: number;
  /** Idle sideways drift, ± units (default 0.08). */
  drift?: number;
  /**
   * How much the camera trucks with the car, 0 (default: still) → 1 (the look-at point moves with
   * the car): `track: 0.6` is a slow track right as the car drives.
   */
  track?: number;
  /** The car in the near lane, whole (never cut), its right tires on the cut edge; null for none. */
  car?: MusicalCar | null;
  /** The groove groups, one per note: `spacing` (m, centre to centre) and `count` (default `DEFAULT_GROUPS`, 🎭). */
  groups?: GrooveGroup[];
  /** x of the first groove (default −2), the gap between groups (default 1.0 m). */
  grooveStart?: number;
  grooveGap?: number;
  /** Groove width as a fraction of its group's spacing (default 0.45, at most 6 cm), depth on the cut (default 0.03 m). */
  grooveWidth?: number;
  grooveDepth?: number;
  /**
   * The grooves' orange (the system): 'auto' (default: each groove lights as a right tire rolls onto
   * it and fades over `afterglow`), or a constant / keys 0 → 1 for every groove (max with 'auto' off).
   */
  grooveLit?: 'auto' | Keyed;
  /** Seconds a groove stays lit after the tire has passed (default 0.7: a lit trail behind the car, whose body hides the grooves under it). */
  afterglow?: number;
  /** The bedroom window lights at this time (s; 2-frame switch; negative = already lit; null = dark, the default). */
  windowOn?: number | null;
  /** …and goes dark at this time (s), or null (default). */
  windowOff?: number | null;
  /** The house (default at x 5.5, z −14, facing the road); null for none. */
  house?: {x: number; z: number} | null;
  /**
   * "It got moved": from `at` (s) the grooved strip lifts out of the road and slides away right
   * ('slide', default) or fades ('fade') over `duration` (default 1.8 s), leaving plain asphalt.
   * Negative `at` (past the duration): already gone. null (default): it stays.
   */
  moved?: {at: number; style?: 'slide' | 'fade'; duration?: number} | null;
  location?: string;
  transition?: 'auto' | 'continue' | 'glide' | 'cut' | 'dissolve' | 'slide' | 'follow';
  follow?: {direction?: 'down' | 'up' | 'left' | 'right'; at?: number};
  glide?: number;
  /** Set by Explainer. */
  startFrame?: number;
  cameraFrom?: Framing;
  cameraGlide?: number;
};

const DEFAULT_SPEED: SpeedKey[] = [{at: 0, speed: 7}];
/** The car's centre line (z): its right tires' outer sidewalls ≈ 2.5 cm inside the cut. */
const CAR_Z = L.cutZ - C.track - 0.15;

const valueAt = (k: Keyed | undefined, t: number, dflt: number) =>
  k === undefined ? dflt : typeof k === 'number' ? k : keyed(k, t, dflt);

const layoutOf = (p: Partial<MusicalRoadSceneProps>) =>
  grooveLayout(p.groups ?? DEFAULT_GROUPS, p.grooveStart ?? -2, p.grooveGap ?? 1.0, p.grooveWidth ?? 0.45);

/** The car at t: centre x, distance travelled, speed. */
export const musicalCarAt = (car: MusicalCar, t: number) => {
  const speed = car.speed ?? DEFAULT_SPEED;
  const travelled = integrateSpeed(speed, t, 0.8);
  return {x: (car.from ?? -9) + travelled, z: CAR_Z, travelled, speed: speedAt(speed, t, 0.8)};
};

/** The strip's state at t: lift (m), slide (m), opacity, and how far "moved" has run (0 → 1). */
export const stripAt = (p: Partial<MusicalRoadSceneProps>, t: number) => {
  const mv = p.moved;
  if (!mv) return {lift: 0, slide: 0, opacity: 1, k: 0};
  const d = mv.duration ?? 1.8;
  const k = mv.at < 0 && -mv.at >= d ? 1 : Math.max(0, Math.min(1, (t - mv.at) / d));
  if (k <= 0) return {lift: 0, slide: 0, opacity: 1, k: 0};
  if (mv.style === 'fade') return {lift: 0, slide: 0, opacity: 1 - ease(k, 0, 1), k};
  // lift 0.35 m in the first 30%, then slide 40 m right (out of any framing), easing in
  const lift = 0.35 * ease(k, 0, 0.3);
  const u = Math.max(0, (k - 0.22) / 0.78);
  return {lift, slide: 40 * u * u, opacity: 1, k};
};

/** How lit each groove is at t (see `grooveLit`). */
export const grooveLitAt = (p: Partial<MusicalRoadSceneProps>, t: number): number[] => {
  const lay = layoutOf(p);
  const strip = stripAt(p, t);
  const mode = p.grooveLit ?? 'auto';
  if (strip.k > 0 && mode === 'auto') return lay.grooves.map(() => 0);
  if (mode !== 'auto') {
    const v = Math.max(0, Math.min(1, valueAt(mode, t, 0)));
    return lay.grooves.map(() => v);
  }
  const carSpec = p.car === undefined ? {} : p.car;
  if (!carSpec) return lay.grooves.map(() => 0);
  const c = musicalCarAt(carSpec, t);
  const fade = Math.max(0.15, c.speed * (p.afterglow ?? 0.7));
  const patch = 0.09;
  const tires = [c.x + C.axleX.front, c.x + C.axleX.rear];
  return lay.grooves.map((g) => {
    let v = 0;
    for (const x of tires) {
      const d = x - g.x;
      if (d < -patch) continue;
      v = Math.max(v, d <= patch ? 1 : Math.exp(-(d - patch) / fade));
    }
    return v < 0.01 ? 0 : v;
  });
};

/** How lit the bedroom window is at t (a 2-frame switch). */
const windowAt = (p: Partial<MusicalRoadSceneProps>, t: number) => {
  const on = p.windowOn ?? null;
  const off = p.windowOff ?? null;
  const sw = 2 / 30;
  const up = on === null ? 0 : Math.max(0, Math.min(1, (t - on) / sw));
  const down = off === null ? 1 : 1 - Math.max(0, Math.min(1, (t - off) / sw));
  return up * down;
};

const musicalCameraMove = (
  p: Partial<MusicalRoadSceneProps>,
  durationInFrames: number,
  fps: number,
  frame?: number,
) => {
  const base = p.camera?.from ?? MUSICAL_FRAMINGS[p.framing ?? 'road'] ?? MUSICAL_FRAMINGS.road;
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

/** The framing at a frame without the idle drift: the move, plus the truck with the car. */
const framingAtFrame = (
  p: Partial<MusicalRoadSceneProps>,
  frame: number,
  fps: number,
  durationInFrames: number,
): Framing => {
  const {from, to, pre} = musicalCameraMove(p, durationInFrames, fps, frame);
  const s = sectionCameraAt({from, to, pre, frame, fps, durationInFrames, drift: 0});
  const carSpec = p.car === undefined ? {} : p.car;
  const k = p.track ?? 0;
  const dx = carSpec && k ? k * (musicalCarAt(carSpec, frame / fps).x - musicalCarAt(carSpec, 0).x) : 0;
  return {look: [s.look.x + dx, s.look.y, s.look.z], distance: s.position.distanceTo(s.look)};
};

export const musicalCameraStart = (p: Partial<MusicalRoadSceneProps>, d: number, fps: number): Framing =>
  framingAtFrame({...p, cameraFrom: undefined, cameraGlide: undefined}, 0, fps, d);
export const musicalCameraEnd = (p: Partial<MusicalRoadSceneProps>, d: number, fps: number): Framing =>
  framingAtFrame(p, d, fps, d);

/** The camera state at a frame (for anchors on L). */
export const musicalCameraAt = (
  p: Partial<MusicalRoadSceneProps>,
  o: {frame: number; fps: number; durationInFrames: number},
) => {
  const f = framingAtFrame(p, o.frame, o.fps, o.durationInFrames);
  return sectionCameraAt({
    from: f,
    to: f,
    frame: o.frame,
    fps: o.fps,
    durationInFrames: o.durationInFrames,
    drift: p.drift ?? 0.08,
    clockOffset: (p.startFrame ?? 0) / o.fps,
  });
};

/**
 * A named point of L in the world at t: 'group:k' (the top of groove group k on the cut edge, k from 0;
 * it rides the strip when moved), 'tire' / 'rearTire' (the car's right tires' contact patches), 'car'
 * (its roof), 'window' (the bedroom window), 'house' (the roof ridge).
 */
export const musicalAnchorPoint = (p: Partial<MusicalRoadSceneProps>, anchor: string, t: number): V3 | undefined => {
  const [name, arg] = anchor.split(':');
  const carSpec = p.car === undefined ? {} : p.car;
  const c = carSpec ? musicalCarAt(carSpec, t) : null;
  const house = p.house === undefined ? {x: HOUSE_SPOT.x, z: HOUSE_SPOT.z} : p.house;
  switch (name) {
    case 'group': {
      const g = layoutOf(p).groups[Number(arg ?? 0)];
      if (!g) return undefined;
      const s = stripAt(p, t);
      return [(g.x0 + g.x1) / 2 + s.slide, s.lift, L.cutZ];
    }
    case 'tire':
      return c ? [c.x + C.axleX.front, 0.02, c.z + C.track + 0.06] : undefined;
    case 'rearTire':
      return c ? [c.x + C.axleX.rear, 0.02, c.z + C.track + 0.06] : undefined;
    case 'car':
      return c ? [c.x - 0.2, 1.5, c.z] : undefined;
    case 'window':
      return house ? houseWindowAt(house.x, house.z) : undefined;
    case 'house':
      return house ? [house.x, L.sandY + 5.2, house.z] : undefined;
    default:
      return undefined;
  }
};

/** A named point of L on screen (px) at this frame (see `musicalAnchorPoint`). */
export const musicalAnchorOnScreen = (
  p: Partial<MusicalRoadSceneProps>,
  anchor: string,
  o: {frame: number; fps: number; durationInFrames: number},
): [number, number] | undefined => {
  const w = musicalAnchorPoint(p, anchor, o.frame / o.fps);
  return w ? projectToFrame(musicalCameraAt(p, o), w) : undefined;
};

/** How far behind the look-at point the sky card stands (m): past the ridge. */
const BACKDROP = 420;

/**
 * L, the musical road (No. 005): a generic two-lane desert road cut along the near lane's right wheel
 * path, so the cut face shows the groove groups (one per note, each its own spacing) as rows of
 * notches. A grey extra's car (whole) drives left to right in the near lane, its right tires on the
 * cut edge; each groove lights orange (the system) as a tire rolls onto it and fades behind. Behind:
 * the far lane, sand and scrub, one house whose bedroom window can light (the lamp practical), a far
 * ridge. The grooved strip can lift out and slide away, or fade ("it got moved"). No sign, road name,
 * map or logo. Day or Night.
 */
export const MusicalRoadScene: React.FC<MusicalRoadSceneProps> = (props) => {
  const {durationInFrames, mood = 'day', startFrame = 0} = props;
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const m = MOODS[mood];
  const night = mood === 'night';

  const framing = framingAtFrame(props, frame, fps, durationInFrames);
  const cam = musicalCameraAt(props, {frame, fps, durationInFrames});
  const camD = cam.position.distanceTo(cam.look);
  const backQ = useMemo(
    () => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), new THREE.Vector3(...SECTION_ANGLE)),
    [],
  );
  const backdrop = {
    position: cam.look
      .clone()
      .addScaledVector(new THREE.Vector3(...SECTION_ANGLE), -BACKDROP)
      .toArray() as V3,
    size: 2 * (camD + BACKDROP) * Math.tan((13 * Math.PI) / 180) * 1.25,
  };
  const mats = useMemo(() => ({sky: new THREE.MeshBasicMaterial({map: skyTexture(mood), fog: false})}), [mood]);
  mats.sky.color.setScalar(1 / m.exposure);

  const layoutKey = JSON.stringify([props.groups, props.grooveStart, props.grooveGap, props.grooveWidth]);
  const layout = useMemo(() => {
    const [groups, grooveStart, grooveGap, grooveWidth] = JSON.parse(layoutKey) as [
      GrooveGroup[]?,
      number?,
      number?,
      number?,
    ];
    return layoutOf({
      groups: groups ?? undefined,
      grooveStart: grooveStart ?? undefined,
      grooveGap: grooveGap ?? undefined,
      grooveWidth: grooveWidth ?? undefined,
    });
  }, [layoutKey]);
  const lit = grooveLitAt(props, t);
  const strip = stripAt(props, t);
  const windowLit = windowAt(props, t);
  const house = props.house === undefined ? {x: HOUSE_SPOT.x, z: HOUSE_SPOT.z} : props.house;

  const carSpec = props.car === undefined ? {} : props.car;
  const car = carSpec ? musicalCarAt(carSpec, t) : null;
  const shutter = 0.5 / fps;
  const R = C.wheelR;
  const wheelBlur =
    carSpec && car
      ? (integrateSpeed(carSpec.speed ?? DEFAULT_SPEED, t + shutter / 2, 0.8) -
          integrateSpeed(carSpec.speed ?? DEFAULT_SPEED, t - shutter / 2, 0.8)) /
        R
      : 0;
  const headlights = carSpec ? (carSpec.headlights ?? night) : false;
  const tail = carSpec ? (carSpec.tail ?? night) : false;

  // headlights: two spots aimed down the road ahead (always mounted: 0 when off)
  const lamps = useMemo(() => [0, 1].map(() => new THREE.SpotLight(raw(HIGHWAY.headlight), 0, 40, 0.4, 0.55, 1)), []);
  lamps.forEach((l, i) => {
    const s = i ? 0.55 : -0.55;
    l.intensity = car && headlights ? 18 : 0;
    const x = car ? car.x : 0;
    l.position.set(x + 2.3, 0.8, CAR_Z + s);
    l.target.position.set(x + 22, 0, CAR_Z + s * 2);
    l.target.updateMatrixWorld();
  });

  // the cut face's ink keeps ≈ 3 px from the groove close-up to the wide shot
  const ink = Math.max(0.25, Math.min(8, camD / 12.75));

  return (
    <AbsoluteFill>
      <SectionStage mood={mood} post={{focusY: 0.55}} ao far={1200}>
        <SectionCamera
          from={framing}
          to={framing}
          durationInFrames={durationInFrames}
          drift={props.drift ?? 0.08}
          clockOffset={startFrame / fps}
          fitClip
          farMin={camD + BACKDROP + 50}
        />
        <SectionLights mood={mood} target={[2, 0, -3]} lamp={0} extent={14} figureSpot={false} />
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
        <MusicalRoad
          mood={mood}
          layout={layout}
          lit={lit}
          depth={props.grooveDepth ?? 0.03}
          strip={strip}
          house={house}
          window={windowLit}
          ink={ink}
        />
        {car && carSpec ? (
          <group>
            <group position={[car.x, 0, car.z]}>
              <RealCar mood={mood} body={carSpec.body ?? 'extra'} whole tail={tail ? 1 : 0} plate="4RND 207" />
              {(carSpec.driver ?? true) ? (
                <Figure
                  who="extra"
                  // warm grey: the cool extra grey read as YOU's blue through the tinted glass at Night
                  look={CAST_NEUTRAL}
                  mood={mood}
                  // the whole car's interior sits lower, under its roof (RealCar `whole`)
                  position={[C.driver[0], C.driver[1] - C.wholeSink, C.driver[2]]}
                  rotationY={Math.PI / 2}
                  gestures={[{pose: 'drive', at: -1}]}
                  phone={false}
                  hands={[
                    [-0.16, 1.02, 0.4],
                    [0.16, 1.04, 0.41],
                  ]}
                  clockOffset={startFrame / fps}
                />
              ) : null}
            </group>
            {[C.axleX.front, C.axleX.rear].map((ax) =>
              [-1, 1].map((s) => {
                const near = s > 0;
                const spin = car.travelled / R;
                return (
                  <RealWheel
                    key={`${ax}${s}`}
                    mood={mood}
                    position={[car.x + ax, R, car.z + s * C.track]}
                    yaw={near ? -Math.PI / 2 : Math.PI / 2}
                    radius={R}
                    cut="none"
                    spin={near ? -spin : spin}
                    motionBlur={near ? -wheelBlur : wheelBlur}
                    low={!near}
                    ink={false}
                    valve={false}
                    axle
                  />
                );
              }),
            )}
          </group>
        ) : null}
      </SectionStage>
    </AbsoluteFill>
  );
};
