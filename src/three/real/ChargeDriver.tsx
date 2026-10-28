import React from 'react';
import {EXTRA_B, type Mood} from '../../theme';
import type {Gesture} from '../rig';
import {Figure} from '../section/Figure';
import type {DriverPose} from './chargeMotion';

type V3 = [number, number, number];

/** The look of each grey extra: 'a' as `CAST.extra`, 'b' with `EXTRA_B`'s skin and hair. */
export const driverLook = (look: 'a' | 'b') => (look === 'b' ? EXTRA_B : undefined);

export type ChargeDriverFigureProps = {
  pose: DriverPose;
  mood: Mood;
  look: 'a' | 'b';
  /** Seeds the idle life and blinks (each driver its own). */
  seed: string;
  /** The scene's start in the video (s). */
  clockOffset?: number;
};

/**
 * No. 010 draft 2: a driver out of the car (`driverPoseAt`): the grey extra standing, walking, leaning on the
 * car (tipped back about the feet), sitting on the curb, carrying the plug in the right hand or holding the phone
 * (its screen to the face, never the camera). Mount it in the bay's frame. Nothing when they're in the car.
 */
export const ChargeDriverFigure: React.FC<ChargeDriverFigureProps> = ({pose, mood, look, seed, clockOffset = 0}) => {
  if (pose.inCar) return null;
  const [px, py, pz] = pose.pos;
  const c = Math.cos(pose.rot);
  const s = Math.sin(pose.rot);
  // world (the bay's frame) → figure-local (its origin, facing +z)
  const local = (w: V3): V3 => {
    const dx = w[0] - px;
    const dz = w[2] - pz;
    return [dx * c - dz * s, w[1] - py, dx * s + dz * c];
  };
  const gestures: Gesture[] = [
    {pose: pose.base === 'drive' ? 'drive' : 'idle', at: -1},
    ...(pose.phone > 0 && pose.phoneAt !== null ? [{pose: pose.scroll ? ('scroll' as const) : ('lift-phone' as const), at: pose.phoneAt, blend: 0.5}] : []),
    ...pose.glances.map((g) => ({pose: 'turn-to' as const, at: g.at, target: local(g.target), hold: g.hold, blend: 0.45})),
  ];
  const hands = pose.hands ? ([local(pose.hands[0]), local(pose.hands[1])] as [V3, V3]) : undefined;
  return (
    <group position={[px, py, pz]} rotation={[0, pose.rot, 0]}>
      <group rotation={[-pose.tilt, 0, 0]}>
        <Figure
          who="extra"
          look={look === 'b' ? EXTRA_B : undefined}
          mood={mood}
          seed={seed}
          stance={pose.stance}
          walk={pose.walk}
          legs={
            pose.ankles
              ? [
                  {ankle: [-0.13, pose.ankles[0], pose.ankles[1]]},
                  {ankle: [0.13, pose.ankles[0], pose.ankles[1]]},
                ]
              : undefined
          }
          gestures={gestures}
          phone={pose.phone > 0}
          screenOn={pose.phone}
          phoneModel="real"
          hands={hands}
          clockOffset={clockOffset}
        />
      </group>
    </group>
  );
};

