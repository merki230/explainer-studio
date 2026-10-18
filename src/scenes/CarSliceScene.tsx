import React, {useMemo} from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import * as THREE from 'three';
import {fonts} from '../fonts';
import {CAR, MOODS, section, type CastName, type Mood} from '../theme';
import {OrangePath} from '../three/OrangePath';
import {raw} from '../three/plaster';
import {CAR_LAYOUT, RealCar} from '../three/real/RealCar';
import {RealWheel, WHEEL} from '../three/real/RealWheel';
import {TireSensor} from '../three/real/TireSensor';
import type {Gesture} from '../three/rig';
import {CutOutline, cutMaterial} from '../three/section/cutLook';
import {Figure} from '../three/section/Figure';
import {projectToFrame, SECTION_ANGLE, SectionCamera, sectionCameraAt, type Framing} from '../three/section/SectionCamera';
import {SectionLights, SectionStage} from '../three/section/SectionStage';
import {skyTexture} from '../three/section/textures';
import {useFontsLoaded} from '../three/section/useFontsLoaded';
import {RadioPulse, WireWind} from '../three/TirePieces';
import {ease, framingAtKeys, integrateSpeed, type CameraKey, type SpeedKey} from './keyframes';

type V3 = [number, number, number];
export type WheelId = 'FL' | 'FR' | 'RL' | 'RR';
export type CarFraming = 'wide' | 'cabin' | 'frontWheel' | 'allWheels' | 'lowWheels';

const C = CAR_LAYOUT;
const R = C.wheelR;

/**
 * The four wheels. The car faces +x and the driver sits on its left, the far (−z) side, so the near
 * (cut) side is the right: FR and RR are the near wheels, cut through their mid-plane with the
 * sensor showing; FL and RL are behind the body.
 */
export const WHEELS: Record<WheelId, {x: number; z: number; near: boolean}> = {
  FL: {x: C.axleX.front, z: -C.track, near: false},
  FR: {x: C.axleX.front, z: C.track, near: true},
  RL: {x: C.axleX.rear, z: -C.track, near: false},
  RR: {x: C.axleX.rear, z: C.track, near: true},
};

/** Invented sensor IDs (🎭 illustrative, disclosed in the post); RL carries the brief's "4F2A". */
export const DEFAULT_IDS: Record<WheelId, string> = {RL: '4F2A', FL: '7C1E', FR: '19B3', RR: 'A06D'};

export const CAR_FRAMINGS: Record<CarFraming, Framing> = {
  wide: {look: [0.05, 0.3, 0.1], distance: 21},
  cabin: {look: [0.45, 1.25, -0.1], distance: 10.5},
  frontWheel: {look: [1.3, 0.62, 0.75], distance: 7.5},
  allWheels: {look: [0, 0.05, 0], distance: 19},
  lowWheels: {look: [0, 0.48, 0.8], distance: 12.5},
};

export type CarSliceSceneProps = {
  durationInFrames: number;
  /** Day (default) or Night. */
  mood?: Mood;
  /** Realistic objects (accepted for consistency; the car is always realistic). */
  realism?: boolean;
  /** 'sensors' (default: YOU's car, a sensor in each wheel, orange pulses) or 'indirect' (no sensors, no orange). */
  variant?: 'sensors' | 'indirect';
  /** Who drives: 'you' (default) or 'mom'; the body colour follows (theme `CAR`). */
  driver?: CastName;
  /** Framing preset (default 'wide'): 'wide', 'cabin', 'frontWheel', 'allWheels', 'lowWheels'. */
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
  /** Speed keyframes in wheel revolutions per second (1 ≈ a slow drive); eased over 0.8 s. The road scrolls with it. */
  driving?: SpeedKey[];
  /** Radio pulses: from `at`, an orange route from that wheel's sensor to the receiver (ignored when 'indirect'). */
  pulses?: {at: number; wheel: WheelId}[];
  /** A small ID tag rides each pulse. */
  ids?: boolean;
  /** The IDs on the tags (default `DEFAULT_IDS`, RL "4F2A"). */
  idLabels?: Partial<Record<WheelId, string>>;
  /** That tire sags (a quarter low), or null. */
  lowWheel?: WheelId | null;
  /** Seconds into the scene when it sags (default: already low). */
  lowAt?: number;
  /** Seconds into the scene when the cluster's tire light comes on (warning yellow, flat), or null. */
  warningAt?: number | null;
  /** The driver glances down at the cluster at this time (default: 0.2 s after `warningAt`); null for none. */
  glanceAt?: number | null;
  /** More poses for the driver (rig `Gesture`s; the 'drive' pose is always under them). */
  gestures?: Gesture[];
  /** 'indirect': toothed speed rings and a white sidewall tick on the near wheels; the low wheel turns faster. */
  speedRings?: boolean;
  /** How much faster the low wheel turns (default 1.1: exaggerated so its tick visibly gains). */
  fasterBy?: number;
  /** The wire gag: a grey cable from under the dash winds round the front near axle from `at`, fades by `until`. */
  wire?: {at: number; until?: number};
  location?: string;
  transition?: 'auto' | 'continue' | 'glide' | 'cut' | 'dissolve' | 'slide' | 'follow';
  follow?: {direction?: 'down' | 'up' | 'left' | 'right'; at?: number};
  glide?: number;
  /** Set by Explainer. */
  startFrame?: number;
  cameraFrom?: Framing;
  cameraGlide?: number;
};

const carCameraMove = (
  p: Partial<CarSliceSceneProps>,
  durationInFrames: number,
  fps: number,
  frame?: number,
): {from: Framing; to: Framing; pre?: {from: Framing; hold: number; move: number; ease: 'cubic'}} => {
  if (p.cameraKeys && p.cameraKeys.length) {
    const base = p.camera?.from ?? CAR_FRAMINGS[p.framing ?? 'wide'] ?? CAR_FRAMINGS.wide;
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
  const preset = CAR_FRAMINGS[p.framing ?? 'wide'] ?? CAR_FRAMINGS.wide;
  const c = pre ? undefined : p.cameraFrom;
  const same = c && c.look.every((v, i) => Math.abs(v - preset.look[i]) < 1e-6);
  const from = c && same ? c : preset;
  return {from, to: {look: from.look, distance: from.distance - push * secs}, pre};
};

export const carCameraStart = (p: Partial<CarSliceSceneProps>, d: number, fps: number): Framing =>
  carCameraMove({...p, cameraFrom: undefined, cameraGlide: undefined}, d, fps, 0).from;
export const carCameraEnd = (p: Partial<CarSliceSceneProps>, d: number, fps: number): Framing => carCameraMove(p, d, fps).to;

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
  const [x, y, z] = C.driver;
  return projectToFrame(cameraAtFrame(p, o), [x - 0.05, y + 1.49, z]);
};

/** The driver's head box on screen [xMin, xMax, yTop, yBottom] (px). */
export const carHeadBoxOnScreen = (
  p: Partial<CarSliceSceneProps>,
  who: CastName,
  o: {frame: number; fps: number; durationInFrames: number},
): [number, number, number, number] | undefined => {
  if ((p.driver ?? 'you') !== who) return undefined;
  const cam = cameraAtFrame(p, o);
  const [x, y, z] = C.driver;
  const c: V3 = [x - 0.05, y + 1.325, z];
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
export const clusterOnScreen = (p: Partial<CarSliceSceneProps>, o: {frame: number; fps: number; durationInFrames: number}) =>
  projectToFrame(cameraAtFrame(p, o), [C.cluster[0] + 0.07, C.cluster[1] + 0.06, C.cluster[2]]);

/** A wheel's turn (rev) at t: the driving speed, faster for the low wheel with the indirect rings. */
const wheelRevs = (p: Partial<CarSliceSceneProps>, id: WheelId, t: number) => {
  const revs = integrateSpeed(p.driving ?? [{at: 0, speed: 1}], t, 0.8);
  const faster = p.variant === 'indirect' && p.speedRings && p.lowWheel === id ? (p.fasterBy ?? 1.1) : 1;
  return revs * faster;
};

/** Where a wheel's sensor node is (world) at t (the valve's angle as it turns). */
const sensorNode = (p: Partial<CarSliceSceneProps>, id: WheelId, t: number): V3 => {
  const w = WHEELS[id];
  const spin = wheelRevs(p, id, t) * Math.PI * 2;
  // local frame: x outboard (near +z, far −z), φ measured in (y, z_local); forward rolling turns −φ (near)
  const phi = WHEEL.valveBase + (w.near ? -spin : spin);
  const a = WHEEL.sensor.a;
  const r = WHEEL.sensor.r + 0.1;
  const side = w.near ? 1 : -1;
  // local (a, r cosφ, r sinφ) → world: x_local → side·z, z_local → −side·x (rotation about y by ∓π/2)
  return [w.x - side * r * Math.sin(phi) * R, 0.36 + r * Math.cos(phi) * R, w.z + side * a * R];
};

const routeFor = (id: WheelId, from: V3): V3[][] => {
  const w = WHEELS[id];
  const [rx, ry, rz] = C.receiver;
  // a low arc through the body and along the cabin floor, under the seat cushions, so the route's glow
  // stays on the system and off the seats (§ 5): out of the wheel arch, along the floor, up to the receiver
  if (w.x > 0) return [[from, [1.02, 0.62, w.z * 0.8], [(1.02 + rx) / 2 + 0.05, 0.56, (w.z * 0.8 + rz) / 2], [rx, ry + 0.035, rz]]];
  return [[from, [-0.8, 0.55, w.z * 0.8], [0.0, 0.48, (w.z * 0.8 + rz) / 2], [rx, ry + 0.035, rz]]];
};

/** A pulse's state at t: route progress, glow, and whether it's live. */
const PULSE = {draw: 0.55, hold: 0.35, fade: 0.4};
const pulseState = (age: number) => ({
  progress: ease(age, 0, PULSE.draw),
  glow: age < 0 ? 0 : 1 - ease(age, PULSE.draw + PULSE.hold, PULSE.draw + PULSE.hold + PULSE.fade),
  live: age >= 0 && age < PULSE.draw + PULSE.hold + PULSE.fade,
});

/** An ID tag (Inter on a paper chip with an ink border), facing the camera. */
const IdTag: React.FC<{text: string; position: V3; opacity: number; mood: Mood}> = ({text, position, opacity, mood}) => {
  const ready = useFontsLoaded();
  const tex = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 320;
    c.height = 96;
    const t = new THREE.CanvasTexture(c);
    return {c, t, key: ''};
  }, []);
  const mat = useMemo(() => new THREE.MeshBasicMaterial({transparent: true, depthTest: false, toneMapped: false}), []);
  const m = MOODS[mood];
  const key = `${text}|${mood}`;
  if (ready && tex.key !== key) {
    const cx = tex.c.getContext('2d')!;
    cx.clearRect(0, 0, 320, 96);
    cx.fillStyle = m.paper;
    cx.fillRect(4, 4, 312, 88);
    cx.strokeStyle = m.ink;
    cx.lineWidth = 5;
    cx.strokeRect(4, 4, 312, 88);
    cx.fillStyle = m.ink;
    cx.font = `700 52px ${fonts.sans}, Arial`;
    cx.textAlign = 'center';
    cx.textBaseline = 'middle';
    cx.fillText(`ID ${text}`, 160, 52);
    tex.t.needsUpdate = true;
    tex.key = key;
    mat.map = tex.t;
    mat.needsUpdate = true;
  }
  mat.opacity = opacity;
  mat.color.setScalar(1 / m.exposure);
  const q = useMemo(
    () => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), new THREE.Vector3(...SECTION_ANGLE).normalize()),
    [],
  );
  return (
    <mesh position={position} quaternion={q} material={mat} visible={ready && opacity > 0.01} renderOrder={10}>
      <planeGeometry args={[0.5, 0.15]} />
    </mesh>
  );
};

/** The road on a cut ground block: lane paint that scrolls (DataTexture, u along x). */
const ROAD = {x: 3.8, z: 1.75, depth: 0.7, tile: 7.6};
const roadTexture = (mood: Mood) => {
  const W = 512;
  const H = 128;
  const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [a, l] = [hex(CAR[mood].asphalt), hex(CAR[mood].lane)];
  const data = new Uint8Array(W * H * 4);
  for (let j = 0; j < H; j++) {
    // v 0 at the back (−z) → 1 at the front (+z)
    const z = -ROAD.z + ((j + 0.5) / H) * 2 * ROAD.z;
    for (let i = 0; i < W; i++) {
      const u = i / W;
      const dash = Math.abs(z + 1.35) < 0.05 && u * 8 - Math.floor(u * 8) < 0.5;
      const edge = Math.abs(z - 1.42) < 0.05;
      // a fine seeded-free grain: a fixed pattern from the indices
      const g = ((i * 73 + j * 151) % 17) - 8;
      const c = dash || edge ? l : a.map((v) => v + g * 0.8);
      const o = (j * W + i) * 4;
      data[o] = c[0];
      data[o + 1] = c[1];
      data[o + 2] = c[2];
      data[o + 3] = 255;
    }
  }
  const t = new THREE.DataTexture(data, W, H, THREE.RGBAFormat);
  t.wrapS = THREE.RepeatWrapping;
  t.magFilter = THREE.LinearFilter;
  t.minFilter = THREE.LinearFilter;
  t.needsUpdate = true;
  return t;
};

/**
 * C, the car slice (No. 002): a generic car cut open (near side along the near wheels' mid-plane, the
 * roof above the windows), the driver at the wheel, four turning wheels on a scrolling road on a cut
 * ground block. 'sensors': each wheel has a sensor (orange node dot); pulses run as orange routes from a
 * wheel to the receiver under the dash (node dots at both ends), with optional ID tags; the
 * cluster's tire light comes on in warning yellow. 'indirect': no sensors and no orange; toothed
 * speed rings and sidewall ticks, the low wheel turning faster. The low tire sags in both.
 */
export const CarSliceScene: React.FC<CarSliceSceneProps> = (props) => {
  const {
    durationInFrames,
    mood = 'day',
    variant = 'sensors',
    driver = 'you',
    pulses = [],
    ids = false,
    lowWheel = null,
    warningAt = null,
    speedRings = false,
    wire,
    startFrame = 0,
  } = props;
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const m = MOODS[mood];
  const sensors = variant === 'sensors';
  const {from, to, pre} = carCameraMove(props, durationInFrames, fps, frame);

  const mats = useMemo(() => {
    const road = new THREE.MeshStandardMaterial({color: raw('#ffffff'), roughness: 0.92, map: roadTexture(mood)});
    road.map!.repeat.set((2 * ROAD.x) / ROAD.tile, 1);
    return {
      sky: new THREE.MeshBasicMaterial({map: skyTexture(mood), fog: false}),
      road,
      earth: new THREE.MeshStandardMaterial({color: raw(m.earth), roughness: 1}),
      cut: cutMaterial(),
      node: new THREE.MeshBasicMaterial({color: raw(section.orange)}),
      nodeOff: new THREE.MeshStandardMaterial({color: raw(section.ledOff), roughness: 0.4}),
    };
  }, [mood, m.earth]);
  mats.sky.color.setScalar(1 / m.exposure);
  const revs = integrateSpeed(props.driving ?? [{at: 0, speed: 1}], t, 0.8);
  const distance = revs * Math.PI * 2 * R;
  mats.road.map!.offset.x = -distance / ROAD.tile;

  const warn = warningAt !== null && t >= warningAt;

  // the driver: hands on the wheel, eyes on the road; a glance down at the cluster
  const glanceAt = props.glanceAt === undefined ? (warningAt === null ? null : warningAt + 0.2) : props.glanceAt;
  const gestures: Gesture[] = [
    {pose: 'drive', at: -1},
    ...(glanceAt === null ? [] : [{pose: 'glance-down' as const, at: glanceAt, hold: 1.4}]),
    ...(props.gestures ?? []),
  ];
  const hands: [V3, V3] = [
    [-0.16, 1.02, 0.4],
    [0.16, 1.04, 0.41],
  ];

  // pulses: live ones draw their routes; the receiver's dot lights once one has arrived (trace)
  const live = sensors ? pulses.map((p) => ({...p, ...pulseState(t - p.at), age: t - p.at})) : [];
  const arrived = live.some((p) => p.age >= PULSE.draw);
  const lowK = lowWheel ? (props.lowAt === undefined ? 1 : ease(t, props.lowAt, props.lowAt + 1.2)) : 0;
  const head = (legs: V3[][], k: number): V3 => {
    const c = new THREE.CatmullRomCurve3(legs[0].map((p) => new THREE.Vector3(...p)));
    const v = c.getPointAt(Math.min(0.999, Math.max(0, k)));
    return [v.x, v.y, v.z];
  };
  const idLabels = {...DEFAULT_IDS, ...(props.idLabels ?? {})};

  return (
    <AbsoluteFill>
      <SectionStage mood={mood} post={{focusY: 0.5}} ao>
        <SectionCamera from={from} to={to} pre={pre} durationInFrames={durationInFrames} drift={props.drift ?? 0.08} clockOffset={startFrame / fps} />
        <SectionLights mood={mood} target={[0, 0.8, 0]} lamp={0} />
        <mesh position={[0, 8, -14]} material={mats.sky}>
          <planeGeometry args={[80, 50]} />
        </mesh>

        {/* the ground block: the road on top, cut on the front and right faces */}
        <mesh
          position={[0, -ROAD.depth / 2, 0]}
          material={[mats.cut, mats.earth, mats.road, mats.earth, mats.cut, mats.earth]}
          receiveShadow
        >
          <boxGeometry args={[2 * ROAD.x, ROAD.depth, 2 * ROAD.z]} />
        </mesh>
        <CutOutline
          rects={[
            [
              [-ROAD.x, -ROAD.depth, ROAD.z],
              [ROAD.x, 0, ROAD.z],
            ],
            [
              [ROAD.x, -ROAD.depth, -ROAD.z],
              [ROAD.x, 0, ROAD.z],
            ],
          ]}
          edges={[
            [
              [-ROAD.x, 0, ROAD.z],
              [ROAD.x, 0, ROAD.z],
            ],
          ]}
        />

        <RealCar mood={mood} body={driver === 'mom' ? 'mom' : 'you'} warning={warn} />
        <Figure
          who={driver}
          mood={mood}
          position={C.driver}
          rotationY={Math.PI / 2}
          gestures={gestures}
          phone={false}
          hands={hands}
          clockOffset={startFrame / fps}
        />

        {(Object.keys(WHEELS) as WheelId[]).map((id) => {
          const w = WHEELS[id];
          const spin = wheelRevs(props, id, t) * Math.PI * 2;
          // the turn while the shutter is open (half a frame): the wheel's motion blur
          const blur = (wheelRevs(props, id, t + 0.25 / fps) - wheelRevs(props, id, t - 0.25 / fps)) * Math.PI * 2;
          const cutNear = w.near && sensors;
          return (
            <RealWheel
              key={id}
              mood={mood}
              position={[w.x, R, w.z]}
              yaw={w.near ? -Math.PI / 2 : Math.PI / 2}
              radius={R}
              cut={cutNear ? 'mid' : 'none'}
              spin={w.near ? -spin : spin}
              motionBlur={w.near ? -blur : blur}
              pressure={lowWheel === id ? 1 - 0.25 * lowK : 1}
              low={!w.near}
              axle
              tick={!sensors && speedRings && w.near}
              toneRing={!sensors && speedRings && w.near}
              sensor={sensors ? <TireSensor dot={1} /> : null}
              sensorScale={1.7}
            />
          );
        })}

        {/* the receiver's node dot: lit once a pulse has arrived, and it stays (trace) */}
        {sensors ? (
          <mesh position={[C.receiver[0], C.receiver[1] + 0.035, C.receiver[2]]} material={arrived ? mats.node : mats.nodeOff} userData={{glow: arrived}}>
            <sphereGeometry args={[0.025, 16, 12]} />
          </mesh>
        ) : null}
        {live.map((p, i) => {
          const fromPt = sensorNode(props, p.wheel, p.at);
          const legs = routeFor(p.wheel, fromPt);
          return (
            <group key={i}>
              {p.live ? (
                <OrangePath
                  legs={legs}
                  progress={p.progress}
                  glow={p.glow}
                  stain={false}
                  runner={false}
                  radius={0.018}
                  coreColor={section.orange}
                  halo={{scale: 0.055 / 0.018, opacity: 0.25}}
                />
              ) : null}
              <RadioPulse position={fromPt} age={p.age} reach={0.45} />
              {ids && p.live ? (
                <IdTag
                  text={idLabels[p.wheel]}
                  mood={mood}
                  position={(() => {
                    const h = head(legs, p.progress);
                    return [h[0], h[1] + 0.16, h[2]] as V3;
                  })()}
                  opacity={p.glow}
                />
              ) : null}
            </group>
          );
        })}
        {wire && t >= wire.at ? (
          <WireWind
            from={[C.receiver[0] + 0.12, C.receiver[1] + 0.1, C.cutZ + 0.18]}
            hub={[C.axleX.front, R, C.track - 0.05]}
            axis={[0, 0, 1]}
            coil={0.045}
            width={0.08}
            turns={Math.min(5, (t - wire.at) * 2.5)}
            taut={ease(t - wire.at, 0, 1.8) * (1 - ease(t - wire.at, 2.0, 2.6))}
            opacity={ease(t, wire.at, wire.at + 0.3) * (1 - ease(t, (wire.until ?? wire.at + 2.8) - 0.6, wire.until ?? wire.at + 2.8))}
            radius={0.012}
          />
        ) : null}
      </SectionStage>
    </AbsoluteFill>
  );
};
