import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import type {Mood} from '../../theme';
import {ease} from '../../scenes/keyframes';
import {TRUCK, UtilityTruck} from './UtilityTruck';
import {capSpeed, cappedTravel, wheelSmear} from './wheelMotion';

/*
 * No. 009 (M6): the highway service-patrol truck (owner decision D3): the white `UtilityTruck` with a
 * `warning`-yellow roof light bar, no receiver, no lettering, no siren, no red or blue. It drives up the
 * shoulder (toward −z, away from the camera, like every car in a highway-slice), slows, and stops at
 * `stopZ`. Pure function of the frame and the keys. Mount it in a scene's world space; the scene decides
 * where the shoulder is (`x`) and keeps the truck out of the frame until it is wholly behind its cut plane.
 */

/** The patrol truck's drive (seconds are the mounting scene's). */
export type PatrolDrive = {
  /** World x of the truck's centre line (the shoulder's middle). */
  x: number;
  /** World z of the truck's origin (the middle of its length) once stopped, e.g. YOU's tail + a gap + half its length. */
  stopZ: number;
  /** Metres it covers from where it is at `enterAt` to the stop (it starts `distance` behind `stopZ`, at +z). Default 30. */
  distance?: number;
  /** Seconds into the scene it starts moving (before it: parked at the start, out of frame). Default 0. */
  enterAt?: number;
  /** Seconds into the scene it stops. Default `enterAt` + 2.6. The speed falls steadily to 0 (entering at 2 × distance / time). */
  stopAt?: number;
  /** When the brake lamps light (s; default 35% of the way from `enterAt` to `stopAt`); they stay lit once stopped. */
  brakeAt?: number;
};

/** Length of the truck's half (m), so a scene can set `stopZ` from a gap behind a car's tail. */
export const PATROL_HALF = TRUCK.rear;

/**
 * Where the patrol truck is at t (s into the scene): its origin's z, its speed (m/s, toward −z), the metres
 * driven, and the brake lamps (0 / 1). The wheels' drawn turn comes from `cappedTravel` (see `PatrolTruck`). A steady deceleration from `enterAt` to the stop.
 */
export const patrolAt = (d: PatrolDrive, t: number) => {
  const dist = d.distance ?? 30;
  const t0 = d.enterAt ?? 0;
  const t1 = Math.max(t0 + 0.1, d.stopAt ?? t0 + 2.6);
  const u = Math.max(0, Math.min(1, (t - t0) / (t1 - t0)));
  const left = dist * (1 - u) ** 2;
  const speed = u <= 0 || u >= 1 ? 0 : (2 * dist * (1 - u)) / (t1 - t0);
  const brakeAt = d.brakeAt ?? t0 + 0.35 * (t1 - t0);
  return {z: d.stopZ + left, speed, travelled: dist - left, brake: t >= brakeAt ? ease(t, brakeAt, brakeAt + 0.08) : 0};
};

export type PatrolTruckProps = {
  mood: Mood;
  drive: PatrolDrive;
  /** Seconds into the scene (default: the current frame / fps). */
  t?: number;
  /** The scene's start in the video (s): the light bar flashes and the driver lives on the video clock. */
  clockOffset?: number;
  /** The light bar flashing, 0 → 1. Default 1. */
  flashing?: number;
  /** Headlights, 0 → 1. Default: 1 at Night, 0 in Day. */
  headlights?: number;
  /** Running tail lamps, 0 → 1. Default: as `headlights`. */
  tail?: number;
};

/**
 * The service-patrol truck driving up the shoulder and stopping (see `PatrolDrive`): whole (never cut), its
 * wheels turning with the distance and blurred with the speed, brake lamps lit as it slows and once stopped,
 * the light bar flashing on the video clock, headlights and tail lamps on at Night.
 */
export const PatrolTruck: React.FC<PatrolTruckProps> = ({
  mood,
  drive,
  t: tProp,
  clockOffset = 0,
  flashing = 1,
  headlights,
  tail,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = tProp ?? frame / fps;
  const s = patrolAt(drive, t);
  const head = headlights ?? (mood === 'night' ? 1 : 0);
  // driving toward −z with the right wheel at yaw 0, the wheel's top turns toward −z: a negative spin
  // (`wheelMotion`), at a visual rate capped under the 5-spoke alias limit, the rest carried by the smear
  const R = TRUCK.wheelR;
  const cap = capSpeed(R, fps);
  const rolled = cappedTravel((x) => patrolAt(drive, x).speed, t, cap);
  const smear = wheelSmear((s.speed * (0.5 / fps)) / R, s.speed, cap);
  return (
    <UtilityTruck
      mood={mood}
      at={[drive.x, s.z]}
      direction="away"
      spin={-rolled / R}
      blur={-smear}
      clockOffset={clockOffset}
      receiver={false}
      lightBar
      flashing={flashing}
      headlights={head}
      tail={tail ?? head}
      brake={s.brake}
    />
  );
};
