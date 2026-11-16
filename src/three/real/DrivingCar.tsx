import React, {useMemo} from 'react';
import * as THREE from 'three';
import {CAST_NEUTRAL, MOODS, RACE, REAL, section, type CastLook, type Mood} from '../../theme';
import {raw} from '../plaster';
import {Figure} from '../section/Figure';
import {CAR_LAYOUT, RealCar, type CoupeStyle} from './RealCar';
import {shellSink, type ShellProfile} from './CarShell';
import {RealWheel} from './RealWheel';
import {RoofRack} from './RoofRack';
import {CupPhone, DashMount} from './CarPhoneKit';

type V3 = [number, number, number];
const C = CAR_LAYOUT;

/** Car-local (x forward, z right) → world, for a car at (x, z) heading −z, turned by `yaw` toward +x. */
export const carToWorld = (p: V3, at: {x: number; z: number; yaw: number}): V3 => {
  const th = Math.PI / 2 - at.yaw;
  // rotation about y by th: (x, z) → (x cos + z sin, −x sin + z cos)
  return [at.x + p[0] * Math.cos(th) + p[2] * Math.sin(th), p[1], at.z - p[0] * Math.sin(th) + p[2] * Math.cos(th)];
};

/** No. 019 (N4): the dash phone's height (m, the No. 012 held phone's). */
const DASH_PHONE_H = 0.22;

/**
 * No. 019 (N4): the dash-mounted phone in a whole car (car-local: x forward, y up, z right): the mount's foot on the dash
 * top at its rear edge, inboard of the driver; the phone held 5 cm above it, its screen (+z) aimed at the driver's eyes
 * (style guide § 3: the screen faces its owner), so the camera behind the car sees its back. The whole car's interior sits
 * `wholeSink` + `shellSink(shape)` under the cut car's, as the driver does.
 */
export const dashPhonePose = (shape: ShellProfile = 'crossover') => {
  const sink = C.wholeSink + shellSink(shape);
  const foot: V3 = [0.7, 1.07 - sink, C.driver[2] + 0.34];
  const pos = new THREE.Vector3(foot[0], foot[1] + 0.05 + DASH_PHONE_H / 2, foot[2]);
  const eyes = new THREE.Vector3(C.driver[0] + 0.09, C.driver[1] + 1.25 - sink, C.driver[2]);
  const n = eyes.clone().sub(pos).normalize();
  const up = new THREE.Vector3(0, 1, 0).sub(n.clone().multiplyScalar(n.y)).normalize();
  const q = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(up.clone().cross(n).normalize(), up, n));
  return {foot, pos, q, n, up, centre: pos.toArray() as V3};
};

/**
 * One whole car driving away from the camera (toward −z; highway slice No. 005, city slice No. 006):
 * the body (`RealCar whole`, never cut), four turning wheels, optionally a driver. `at` is the car's
 * origin (its middle, on the road) and its heading off straight ahead (rad, toward +x).
 */
export const DrivingCar: React.FC<{
  mood: Mood;
  at: {x: number; z: number; yaw: number};
  /** Metres driven (the wheels turn by it). */
  travelled: number;
  /** Wheel motion blur (rad turned while the shutter is open). */
  blur: number;
  body: 'you' | 'mom' | 'extra';
  /** Tail (running) lamps lit, 0 → 1 (flat emissive, never bloomed). */
  tail: number;
  /** Brake lamps lit, 0 → 1 (brighter than the running lights; flat, never bloomed). Default 0. */
  brake?: number;
  /** Paint override (a theme token) and shape ('crossover' default, 'sedan', 'coupe', 'hatch': the cut car's silhouette). */
  paint?: string;
  shape?: ShellProfile;
  /**
   * The coupe's style (No. 007 realism pass; `RealCar` `coupeStyle`): 'muscle' or 'electric' body cues;
   * with it the wheels are performance wheels (`RealWheel` `sport`, as on the race's cut cars). Default none.
   */
  coupeStyle?: CoupeStyle;
  /** Who drives: true or 'you' = YOU; 'extra' = an unnamed extra in `CAST_NEUTRAL` grey (tinted glass); false = empty. */
  driver: boolean | 'you' | 'extra';
  plate: string;
  clockOffset: number;
  /** × reflections on the near (right) wheels (RealWheel `envBoost`). */
  envBoost?: number;
  /** Offset of the body (not the wheels), m: the shake's tremble. */
  jitter?: V3;
  /**
   * Per-axle overrides (metres of tread turned, and blur in rad) for a driven axle spinning faster than
   * the road (wheelspin on a wet road). Default: both axles turn with `travelled` and `blur`.
   */
  axles?: {front?: {travelled: number; blur: number}; rear?: {travelled: number; blur: number}};
  /**
   * The front corner lamps (No. 009, the hazards' front half), lit 0 → 1 in `warning` yellow (style guide § 1:
   * amber would read as the system), flat emissive, never bloomed; a clear lens when 0. Default undefined:
   * no corner lamps drawn (No. 005–008 unchanged).
   */
  frontLamps?: number;
  /**
   * The wheels' turning direction: −1 (default: rolling forward) or 1 (`wheels: 'legacy'` only: No. 005–008 as
   * rendered, backward for a car driving forward, see `wheelMotion.ts`). `travelled`, `blur` and `axles` are used
   * as given: cap them with `cappedTravel` / `wheelSmear` for a car above `capSpeed`.
   */
  spinSign?: 1 | -1;
  /** No. 015: a roof rack (`RoofRack`) on the roof. Default false. */
  roofRack?: boolean;
  /** No. 015: the plate brightens neutrally, 0 → 1 (`RealCar` `plateBright`: an IR flash reflected). Default 0. */
  plateBright?: number;
  /**
   * No. 015: the driver's glances (seconds into the scene, on the figure's clock): the head turns toward `target`
   * (car-local metres: x forward, y up, z right; default ahead and to the right, a signal on the far corner) for
   * `hold` s (default 1.0). Default none.
   */
  glances?: {at: number; hold?: number; target?: V3}[];
  /**
   * No. 019 (N4): a phone on a clip mount on the dash (`dashPhonePose`), its screen to the driver, lit `screen` 0 → 1 (the
   * § 3 screen light on the face). Default none.
   */
  phone?: {screen: number};
  /**
   * No. 019: the driver's resting gaze, a car-local point held from the start under the glances (e.g. the dash phone).
   * Default none (ahead).
   */
  gaze?: V3;
  /** No. 019: the extra's colours (default `CAST_NEUTRAL`; e.g. `EXTRA_B` for a second named extra). */
  look?: Partial<CastLook>;
}> = ({
  mood,
  at,
  travelled,
  blur: blurAll,
  body,
  tail,
  brake = 0,
  paint,
  shape = 'crossover',
  coupeStyle,
  driver,
  plate,
  clockOffset,
  envBoost = 1,
  jitter = [0, 0, 0],
  axles,
  frontLamps,
  spinSign = -1,
  roofRack = false,
  plateBright = 0,
  glances = [],
  phone,
  gaze,
  look,
}) => {
  const lampMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: raw(REAL.chrome),
        roughness: 0.15,
        clearcoat: 1,
        emissive: raw(section.warning),
        emissiveIntensity: 0,
      }),
    [],
  );
  lampMat.emissiveIntensity = (1.3 * Math.max(0, Math.min(1, frontLamps ?? 0))) / MOODS[mood].exposure;
  const R = C.wheelR;
  const spinAll = travelled / R;
  // the styled coupe's performance wheels (as on the race's cut cars, `SlicedCar`)
  const cs = shape === 'coupe' ? coupeStyle : undefined;
  const sport = cs
    ? cs === 'muscle'
      ? {spokes: 'split' as const, caliper: RACE.caliperGas, face: RACE.wheelGasFace, side: RACE.wheelGasSide}
      : {spokes: 'turbine' as const, caliper: RACE.caliperEv, face: RACE.wheelEvFace, side: RACE.wheelEvSide}
    : undefined;
  const who = driver === 'extra' ? 'extra' : driver ? 'you' : null;
  return (
    <group>
      <group position={[at.x + jitter[0], jitter[1], at.z + jitter[2]]} rotation={[0, Math.PI / 2 - at.yaw, 0]}>
        <RealCar
          mood={mood}
          body={body}
          whole
          tail={tail}
          brake={brake}
          plate={plate}
          plateBright={plateBright}
          paint={paint}
          shape={shape}
          coupeStyle={shape === 'coupe' ? coupeStyle : undefined}
        />
        {roofRack ? <RoofRack shape={shape} /> : null}
        {phone ? <DashPhone mood={mood} shape={shape} screen={phone.screen} /> : null}
        {frontLamps !== undefined
          ? [-1, 1].map((sd) => (
              <group key={sd}>
                {/* the side repeater on the front fender and the corner of the lamp cluster */}
                <mesh material={lampMat} position={[2.1, 0.75, sd * 0.928]}>
                  <boxGeometry args={[0.2, 0.055, 0.02]} />
                </mesh>
                <mesh material={lampMat} position={[2.3, 0.7, sd * 0.84]}>
                  <boxGeometry args={[0.06, 0.05, 0.16]} />
                </mesh>
              </group>
            ))
          : null}
        {who ? (
          <Figure
            who={who}
            // the extra's cool grey read as YOU's blue through the tinted glass (No. 005): warm grey
            look={who === 'extra' ? (look ?? CAST_NEUTRAL) : undefined}
            mood={mood}
            // the whole car's interior sits lower, under its roof (RealCar `whole`)
            position={[C.driver[0], C.driver[1] - C.wholeSink - shellSink(shape), C.driver[2]]}
            rotationY={Math.PI / 2}
            gestures={[
              {pose: 'drive', at: -1},
              ...(gaze ? [{pose: 'turn-to' as const, at: -1, target: gaze, blend: 0.4}] : []),
              ...glances.flatMap((g) => [
                {pose: 'turn-to' as const, at: g.at, target: g.target ?? ([14, 3.5, 3] as V3), hold: g.hold ?? 1.0, blend: 0.4},
              ]),
            ]}
            phone={false}
            hands={[
              [-0.16, 1.02, 0.4],
              [0.16, 1.04, 0.41],
            ]}
            clockOffset={clockOffset}
          />
        ) : null}
      </group>
      {[C.axleX.front, C.axleX.rear].map((ax, ai) => {
        const o = ai === 0 ? axles?.front : axles?.rear;
        const spin = spinSign * (o ? o.travelled / R : spinAll);
        const blur = spinSign * (o ? o.blur : blurAll);
        return [-1, 1].map((s) => (
          <RealWheel
            key={`${ax}${s}`}
            mood={mood}
            position={carToWorld([ax, R, s * C.track], at)}
            yaw={(s > 0 ? 0 : Math.PI) - at.yaw}
            radius={R}
            cut="none"
            spin={s > 0 ? spin : -spin}
            motionBlur={s > 0 ? blur : -blur}
            low={s < 0}
            ink={false}
            valve={false}
            axle
            envBoost={s > 0 ? envBoost : 1}
            // loaded: the tire squats a little where it meets the road
            pressure={0.95}
            sport={sport}
          />
        ));
      })}
    </group>
  );
};

/** No. 019 (N4): the dash mount and its phone (car-local; see `dashPhonePose`). */
const DashPhone: React.FC<{mood: Mood; shape: ShellProfile; screen: number}> = ({mood, shape, screen}) => {
  const p = useMemo(() => dashPhonePose(shape), [shape]);
  return (
    <>
      <DashMount foot={p.foot} pose={{pos: p.pos, q: p.q, n: p.n, up: p.up}} />
      <CupPhone mood={mood} position={p.centre} quaternion={p.q} height={DASH_PHONE_H} screen={screen} open={0} />
    </>
  );
};
