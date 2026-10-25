import React from 'react';
import {CAST_NEUTRAL, type Mood} from '../../theme';
import {Figure} from '../section/Figure';
import {CAR_LAYOUT, RealCar} from './RealCar';
import {shellSink} from './CarShell';
import {RealWheel} from './RealWheel';

type V3 = [number, number, number];
const C = CAR_LAYOUT;

/** Car-local (x forward, z right) → world, for a car at (x, z) heading −z, turned by `yaw` toward +x. */
export const carToWorld = (p: V3, at: {x: number; z: number; yaw: number}): V3 => {
  const th = Math.PI / 2 - at.yaw;
  // rotation about y by th: (x, z) → (x cos + z sin, −x sin + z cos)
  return [at.x + p[0] * Math.cos(th) + p[2] * Math.sin(th), p[1], at.z - p[0] * Math.sin(th) + p[2] * Math.cos(th)];
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
  /** Paint override (a theme token) and shape ('crossover' default, 'sedan'). */
  paint?: string;
  shape?: 'crossover' | 'sedan';
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
  driver,
  plate,
  clockOffset,
  envBoost = 1,
  jitter = [0, 0, 0],
  axles,
}) => {
  const R = C.wheelR;
  const spinAll = travelled / R;
  const who = driver === 'extra' ? 'extra' : driver ? 'you' : null;
  return (
    <group>
      <group position={[at.x + jitter[0], jitter[1], at.z + jitter[2]]} rotation={[0, Math.PI / 2 - at.yaw, 0]}>
        <RealCar mood={mood} body={body} whole tail={tail} brake={brake} plate={plate} paint={paint} shape={shape} />
        {who ? (
          <Figure
            who={who}
            // the extra's cool grey read as YOU's blue through the tinted glass (No. 005): warm grey
            look={who === 'extra' ? CAST_NEUTRAL : undefined}
            mood={mood}
            // the whole car's interior sits lower, under its roof (RealCar `whole`)
            position={[C.driver[0], C.driver[1] - C.wholeSink - shellSink(shape), C.driver[2]]}
            rotationY={Math.PI / 2}
            gestures={[{pose: 'drive', at: -1}]}
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
        const spin = o ? o.travelled / R : spinAll;
        const blur = o ? o.blur : blurAll;
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
          />
        ));
      })}
    </group>
  );
};
