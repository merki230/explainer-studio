import React, {useMemo} from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {ease, integrateSpeed, keyed, type SpeedKey} from './keyframes';
import * as THREE from 'three';
import {MOODS, section, type Mood} from '../theme';
import {raw} from '../three/plaster';
import {RealWheel, WHEEL, wheelPoint} from '../three/real/RealWheel';
import {sensorPartAt, TireSensor, type SensorPart} from '../three/real/TireSensor';
import {projectToFrame, SectionCamera, sectionCameraAt, type Framing} from '../three/section/SectionCamera';
import {SectionLights, SectionStage} from '../three/section/SectionStage';
import {skyTexture} from '../three/section/textures';
import {AirChuck, PULSE_LIFE, RadioPulse, WireWind} from '../three/TirePieces';

type V3 = [number, number, number];

export type WheelFraming = 'whole' | 'valve' | 'teardown';
export type SensorState = 'asleep' | 'awake' | 'quiet';

/** The wheel: centre, radius, turn (the cut face and the spoked half both toward the camera). */
const W = {position: [0, 0, 0] as V3, radius: 1, yaw: -1.8};
/** Where the valve sits when the wheel stops (radians past the top cut, into the kept half). */
const VALVE_HOME = 0.13;
/** The opened sensor's size multiplier. */
const TEARDOWN_SCALE = 4.2;
/** The sensor's size on the rim (× life size, so it reads at frame 0's framing). */
const SENSOR_SCALE = 1.25;

/** The direction toward the removed half (out of the cut face), in world space. */
const OUT = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), W.yaw);

/** The sensor's base at the valve's home angle (world). */
const sensorHome = (home: number): V3 => wheelPoint(W, WHEEL.sensor.a, WHEEL.sensor.r, home);
/** Where the opened sensor floats: out of the cut face, a little up and to the right. */
const teardownSpot = (home: number): V3 => {
  const s = new THREE.Vector3(...sensorHome(home)).addScaledVector(OUT, 1.25).add(new THREE.Vector3(0, 0.15, 0));
  return [s.x, s.y, s.z];
};

/** Framings at the fixed angle. */
export const wheelFramings = (home = VALVE_HOME): Record<WheelFraming, Framing> => {
  const valveMid = wheelPoint(W, 0.12, 0.6, home);
  const td = teardownSpot(home);
  return {
    // the wheel ≈ y 480–1040, below the title block, above the captions
    whole: {look: [-0.3, -0.62, 0.15], distance: 15.5},
    valve: {look: [valveMid[0], valveMid[1] - 0.55, valveMid[2]], distance: 6.4},
    teardown: {look: [td[0], td[1] + 0.3, td[2]], distance: 6.2},
  };
};

export type WheelSliceSceneProps = {
  durationInFrames: number;
  /** Day (default) or Night. */
  mood?: Mood;
  /** Realistic objects (accepted for consistency; the wheel is always realistic). */
  realism?: boolean;
  /** 'whole' (default; frame 0's picture), 'valve' (stem and sensor), 'teardown' (the sensor opened). */
  framing?: WheelFraming;
  /** A custom move instead of a preset (look-at + distance at the fixed angle). */
  camera?: {from: Framing; to?: Framing};
  /** Push toward the subject, units/s (default 0: the loop needs the same picture at both ends). */
  push?: number;
  /** Idle sideways drift, ± units (default 0, for the loop). */
  drift?: number;
  /**
   * Wheel speed keyframes, revolutions per second (0 stopped). At each `at` the speed eases to the new
   * value over `spinRamp` s. A scene whose last speed is 0 lands the valve on its home angle (frame
   * 0's), otherwise the valve starts there.
   */
  spin?: {at: number; speed: number}[];
  /** Seconds each speed change takes (default 0.8). */
  spinRamp?: number;
  /** Which end of the scene has the valve at home: default 'end' when the wheel ends stopped, else 'start'. */
  spinAnchor?: 'start' | 'end';
  /** Tire pressure keyframes (1 full, ≈ 0.75 a quarter low), eased between (cubic). */
  pressure?: {at: number; value: number}[];
  /** Sensor states: 'asleep', 'awake' (orange node dot on), 'quiet' (awake, dot dark between pulses). */
  sensor?: {at: number; state: SensorState}[];
  /** Seconds a radio pulse leaves the sensor (rings through the rubber, the dot flashes). */
  pulses?: number[];
  /** A dim orange dot on the sleeping sensor (owner decision for frame 0 and the last frame). */
  dimDot?: boolean;
  /** Teardown highlights: from `at`, that part lifts and lights (the radio's antenna turns orange). */
  teardown?: {at: number; highlight: SensorPart | null}[];
  /**
   * Force the sensor open (true) or closed (false). Default: it follows the camera, opening as it
   * glides to 'teardown' and folding back as it glides away.
   */
  open?: boolean;
  /** The wire gag: a grey cable winds round the hub from `at` (≈ 2 s), slackens and fades by `until` (default at + 2.8). */
  wire?: {at: number; until?: number};
  /** YOU's hand brings an air chuck onto the valve at `at` and takes it away at `until` (default at + 2). */
  chuck?: {at: number; until?: number};
  /** The valve's home angle, radians past the top cut (default 0.32: just inside it, upper right on screen). */
  valveAt?: number;
  /** Which location this is (default 'wheel'). */
  location?: string;
  transition?: 'auto' | 'continue' | 'glide' | 'cut' | 'dissolve' | 'slide' | 'follow';
  follow?: {direction?: 'down' | 'up' | 'left' | 'right'; at?: number};
  glide?: number;
  /** Set by Explainer. */
  startFrame?: number;
  cameraFrom?: Framing;
  cameraGlide?: number;
};

/** The camera move from the props (a preset or custom, continuing or gliding from the last scene). */
const wheelCameraMove = (p: Partial<WheelSliceSceneProps>, durationInFrames: number, fps: number) => {
  const F = wheelFramings(p.valveAt ?? VALVE_HOME);
  const push = p.push ?? 0;
  const pre =
    p.cameraGlide && p.cameraFrom
      ? {from: p.cameraFrom, hold: 0, move: Math.max(1, Math.round(p.cameraGlide * fps)), ease: 'cubic' as const}
      : undefined;
  const secs = Math.max(0, durationInFrames - (pre ? pre.move : 0)) / fps;
  let from: Framing;
  let to: Framing;
  if (p.camera) {
    from = p.camera.from;
    to = p.camera.to ?? p.camera.from;
  } else {
    const preset = F[p.framing ?? 'whole'];
    const c = pre ? undefined : p.cameraFrom;
    const same = c && c.look.every((v, i) => Math.abs(v - preset.look[i]) < 1e-6);
    from = c && same ? c : preset;
    to = {look: preset.look, distance: preset.distance - push * secs};
  }
  return {from, to, pre};
};

export const wheelCameraStart = (p: Partial<WheelSliceSceneProps>, d: number, fps: number): Framing =>
  wheelCameraMove({...p, cameraFrom: undefined, cameraGlide: undefined}, d, fps).from;
export const wheelCameraEnd = (p: Partial<WheelSliceSceneProps>, d: number, fps: number): Framing =>
  wheelCameraMove(p, d, fps).to;

const integrate = (keys: SpeedKey[], t: number, ramp: number) => integrateSpeed(keys, t, ramp) * Math.PI * 2;

/** The wheel's spin angle at t (radians), anchored so the valve is at home at the scene's start or end. */
export const wheelSpinAt = (p: Partial<WheelSliceSceneProps>, t: number, durationSec: number) => {
  const keys = p.spin ?? [{at: 0, speed: 0}];
  const ramp = p.spinRamp ?? 0.8;
  const home = (p.valveAt ?? VALVE_HOME) - WHEEL.valveBase;
  const last = [...keys].sort((a, b) => a.at - b.at).at(-1);
  const anchor = p.spinAnchor ?? (last && last.speed === 0 ? 'end' : 'start');
  const raw = integrate(keys, t, ramp);
  if (anchor === 'start') return home + raw;
  return home + raw - integrate(keys, durationSec, ramp);
};

/**
 * How open the sensor is (0 on the rim → 1 floating, opened): 1 at the 'teardown' framing, eased over the
 * glide in; gliding away from the teardown framing, it folds back over the glide. Or the `open` prop.
 */
const openAt = (p: Partial<WheelSliceSceneProps>, frame: number, fps: number) => {
  if (p.open !== undefined) return p.open ? 1 : 0;
  const F = wheelFramings(p.valveAt ?? VALVE_HOME);
  const target = !p.camera && p.framing === 'teardown' ? 1 : 0;
  let start = target;
  if (p.cameraGlide && p.cameraFrom) {
    const T = F.teardown;
    const gap = new THREE.Vector3(...p.cameraFrom.look).distanceTo(new THREE.Vector3(...T.look)) + Math.abs(p.cameraFrom.distance - T.distance);
    start = gap < 0.3 ? 1 : 0;
    const k = ease(frame, 0, Math.max(1, Math.round(p.cameraGlide * fps)));
    return start + (target - start) * k;
  }
  return start;
};

const cameraAtFrame = (p: Partial<WheelSliceSceneProps>, frame: number, fps: number, durationInFrames: number) => {
  const {from, to, pre} = wheelCameraMove(p, durationInFrames, fps);
  return sectionCameraAt({
    from,
    to,
    pre,
    frame,
    fps,
    durationInFrames,
    drift: p.drift ?? 0,
    clockOffset: (p.startFrame ?? 0) / fps,
  });
};

/**
 * Where a named thing of the wheel slice is on screen (px) at a frame: the sensor on the rim, the valve
 * cap, or a teardown part. For placing callouts (they're overlays, set in the spec).
 */
export const wheelAnchorOnScreen = (
  p: Partial<WheelSliceSceneProps>,
  what: 'sensor' | 'valve' | SensorPart,
  o: {frame: number; fps: number; durationInFrames: number},
): [number, number] => {
  const cam = cameraAtFrame(p, o.frame, o.fps, o.durationInFrames);
  const spin = wheelSpinAt(p, o.frame / o.fps, o.durationInFrames / o.fps);
  const phi = WHEEL.valveBase + spin;
  if (what === 'valve') return projectToFrame(cam, wheelPoint(W, WHEEL.cap[0], WHEEL.cap[1], phi));
  if (what === 'sensor') return projectToFrame(cam, wheelPoint(W, WHEEL.sensor.a, WHEEL.sensor.r + 0.03, phi));
  const home = p.valveAt ?? VALVE_HOME;
  const local = sensorPartAt(what, 1);
  const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), TEARDOWN_YAW);
  const v = new THREE.Vector3(...local).multiplyScalar(TEARDOWN_SCALE).applyQuaternion(q).add(new THREE.Vector3(...teardownSpot(home)));
  return projectToFrame(cam, [v.x, v.y, v.z]);
};

/** The opened sensor's turn: its outboard side toward the camera. */
const TEARDOWN_YAW = -0.75;

/**
 * W, the wheel slice (No. 002): a realistic wheel cut through the axle plane, its front half removed,
 * floating on the sky at the fixed 3/4 angle. The tire's cut profiles (off-white, hatched, inked) read
 * like the dashboard tire symbol; inside the air cavity the sensor sits on the rim behind the valve.
 * Spin, pressure (a visible sag), the sensor's sleep and wake (its orange node dot), radio pulses
 * (orange rings through the rubber), a teardown with parts lighting one at a time, the wire gag and
 * the air chuck, all on keyframes. Orange is only the sensor's radio.
 */
export const WheelSliceScene: React.FC<WheelSliceSceneProps> = (props) => {
  const {durationInFrames, mood = 'day', dimDot = false, pulses = [], teardown = [], wire, chuck, startFrame = 0} = props;
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const m = MOODS[mood];
  const home = props.valveAt ?? VALVE_HOME;
  const {from, to, pre} = wheelCameraMove(props, durationInFrames, fps);

  const sky = useMemo(() => new THREE.MeshBasicMaterial({map: skyTexture(mood), fog: false}), [mood]);
  sky.color.setScalar(1 / m.exposure);

  const spin = wheelSpinAt(props, t, durationInFrames / fps);
  const pressure = keyed(props.pressure, t, 1);

  // the sensor: state, wake flash, pulses
  const states = [...(props.sensor ?? [{at: 0, state: 'asleep' as SensorState}])].sort((a, b) => a.at - b.at);
  let state: SensorState = states[0]?.state ?? 'asleep';
  let since = -99;
  let prev: SensorState = state;
  for (const s of states) {
    if (s.at <= t) {
      prev = state;
      state = s.state;
      since = s.at;
    }
  }
  const woke = state !== 'asleep' && prev === 'asleep' && since > 0;
  const wake = woke ? Math.max(0, 1 - Math.abs(t - since - 0.25) / 0.25) : 0;
  const rest = state === 'awake' ? (woke ? ease(t, since + 0.3, since + 0.6) : 1) : state === 'asleep' && dimDot ? 0.35 : 0;
  const ages = pulses.map((p) => t - p).filter((a) => a >= 0 && a < PULSE_LIFE + 0.2);
  const flash = ages.reduce((mx, a) => Math.max(mx, a < 0.35 ? 1 - a / 0.35 : 0), 0);
  const dot = Math.max(rest, flash);

  // teardown: open amount follows the camera; highlights by time
  const open = openAt(props, frame, fps);
  const explode = Math.max(0, Math.min(1, (open - 0.4) / 0.6));
  const hl = [...teardown].sort((a, b) => a.at - b.at).filter((h) => h.at <= t).at(-1);
  const highlightK = hl ? ease(t, hl.at, hl.at + 0.25) : 0;

  // the opened sensor's place: from its home on the rim to the teardown spot
  const lifted = open > 0.001;
  const H = new THREE.Vector3(...sensorHome(home));
  const T = new THREE.Vector3(...teardownSpot(home));
  const k = ease(open, 0, 1);
  const pos = H.clone().lerp(T, k);
  const qIn = new THREE.Quaternion()
    .setFromAxisAngle(new THREE.Vector3(0, 1, 0), W.yaw)
    .multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), home));
  const qTd = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), TEARDOWN_YAW);
  const qNow = qIn.clone().slerp(qTd, k);
  const scale = W.radius * (SENSOR_SCALE + (TEARDOWN_SCALE - SENSOR_SCALE) * k);

  // where pulses start: the sensor's node (on the rim, turning; or the floating one)
  const phi = WHEEL.valveBase + spin;
  const node: V3 = lifted
    ? (() => {
        const v = new THREE.Vector3(...sensorPartAt('node', explode)).multiplyScalar(scale).applyQuaternion(qNow).add(pos);
        return [v.x, v.y, v.z] as V3;
      })()
    : wheelPoint(W, WHEEL.sensor.a, WHEEL.sensor.r + 0.075, phi);

  const sensorEl = (
    <TireSensor dot={dot} explode={explode} highlight={hl?.highlight ?? null} highlightK={highlightK} wake={wake} />
  );

  // the chuck: on the valve cap, coming in along the stem
  const chuckK = chuck ? ease(t, chuck.at, chuck.at + 0.6) * (1 - ease(t, chuck.until ?? chuck.at + 2, (chuck.until ?? chuck.at + 2) + 0.6)) : 0;
  const capTip = wheelPoint(W, WHEEL.cap[0] + 0.02, WHEEL.cap[1] - 0.005, phi);
  const stemDir = (() => {
    const a = new THREE.Vector3(...wheelPoint(W, WHEEL.stem.from[0], WHEEL.stem.from[1], phi));
    const b = new THREE.Vector3(...wheelPoint(W, WHEEL.cap[0], WHEEL.cap[1], phi));
    const d = b.sub(a).normalize();
    return [d.x, d.y, d.z] as V3;
  })();
  const outboard = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), W.yaw);

  // the wire: winds ≈ 2 s, then slackens and fades
  const wireT = wire ? t - wire.at : -1;
  const wireEnd = wire ? (wire.until ?? wire.at + 2.8) : 0;
  const wireOpacity = wire ? ease(t, wire.at, wire.at + 0.3) * (1 - ease(t, wireEnd - 0.6, wireEnd)) : 0;
  const hub = wheelPoint(W, 0.12, 0, 0);

  // a soft neutral light into the cavity at the sensor, so it reads in the dark rubber
  const fill = H.clone().addScaledVector(OUT, 0.6).add(new THREE.Vector3(0.1, 0.25, 0));

  return (
    <AbsoluteFill>
      <SectionStage mood={mood} post={{focusY: 0.42}} ao>
        <SectionCamera from={from} to={to} pre={pre} durationInFrames={durationInFrames} drift={props.drift ?? 0} clockOffset={startFrame / fps} />
        <SectionLights mood={mood} target={[0, 0, 0]} lamp={0} />
        <mesh position={[0, 6, -9]} material={sky}>
          <planeGeometry args={[60, 40]} />
        </mesh>
        <RealWheel
          mood={mood}
          position={W.position}
          yaw={W.yaw}
          radius={W.radius}
          cut="axle"
          spin={spin}
          pressure={pressure}
          sensor={lifted ? null : sensorEl}
          sensorScale={SENSOR_SCALE}
        />
        {lifted ? (
          <group position={pos} quaternion={qNow} scale={scale}>
            {sensorEl}
          </group>
        ) : null}
        {ages.map((a, i) => (
          <RadioPulse key={i} position={node} age={a} reach={lifted ? 1.1 : 0.85} />
        ))}
        <pointLight position={node} color={raw(section.orange)} intensity={0.5 * flash} distance={1.6} decay={2} />
        <pointLight position={[fill.x, fill.y, fill.z]} color={raw('#ffffff')} intensity={0.9} distance={2.2} decay={2} />
        {chuck ? (
          <AirChuck
            tip={capTip}
            dir={stemDir}
            armFrom={[-0.75, -0.6, 0.45]}
            arm={1.35}
            k={chuckK}
          />
        ) : null}
        {wire && wireT > 0 ? (
          <WireWind
            from={[-3.2, -2.4, 1.2]}
            hub={hub}
            axis={[outboard.x, 0, outboard.z]}
            coil={0.19}
            width={0.12}
            turns={Math.min(4, Math.max(0, wireT) * 2)}
            taut={ease(wireT, 0, 1.8) * (1 - ease(wireT, 2.0, 2.6))}
            opacity={wireOpacity}
            radius={0.016}
          />
        ) : null}
      </SectionStage>
    </AbsoluteFill>
  );
};
