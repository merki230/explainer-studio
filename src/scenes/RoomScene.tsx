import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {theme} from '../theme';
import {Arc, Ripple} from '../three/Arc';
import {LivingRoom, ROOM} from '../three/LivingRoom';
import {Mannequin} from '../three/Mannequin';
import {CameraRig, Stage} from '../three/Stage';

type V3 = [number, number, number];

const CAMERAS: Record<string, {from: V3; to: V3; lookFrom: V3; lookTo: V3}> = {
  wide: {from: [0, 2.35, 6.9], to: [0, 2.2, 6.2], lookFrom: [0, 1.05, 0.3], lookTo: [0, 1.0, 0.3]},
  push: {from: [0.1, 2.45, 7.0], to: [0.3, 2.3, 6.2], lookFrom: [0.15, 1.15, 0.1], lookTo: [0.25, 1.2, 0]},
  table: {from: [0.4, 1.7, 3.6], to: [0.2, 1.55, 3.1], lookFrom: [0, 0.55, 1.2], lookTo: [0, 0.5, 1.25]},
};

export type RoomSceneProps = {
  durationInFrames: number;
  camera?: keyof typeof CAMERAS;
  /** Draw Wi-Fi arcs from both phones to the router. */
  arcs?: boolean;
  /** Seconds into the scene when the arcs start drawing. */
  arcsAt?: number;
  /** Heads turn toward each other. */
  facing?: boolean;
};

/** Two mannequins on a couch at night, phones on the table, router on the wall. */
export const RoomScene: React.FC<RoomSceneProps> = ({
  durationInFrames,
  camera = 'wide',
  arcs = false,
  arcsAt = 0.3,
  facing = false,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const cam = CAMERAS[camera] ?? CAMERAS.wide;

  const a = interpolate(t, [arcsAt, arcsAt + 1.1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const b = interpolate(t, [arcsAt + 0.3, arcsAt + 1.4], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <Stage background={theme.bg}>
      <CameraRig {...cam} durationInFrames={durationInFrames} />
      <LivingRoom screenGlow={arcs ? 1 : 0.5} />
      <Mannequin position={[-0.58, 0, 0.02]} color={theme.red} phase={0} look={facing ? 0.5 : 0} />
      <Mannequin position={[0.58, 0, 0.02]} color={theme.blue} phase={2.1} look={facing ? -0.5 : 0} />
      {arcs ? (
        <>
          <Arc
            from={ROOM.phoneA}
            to={ROOM.router}
            lift={1.0}
            progress={a}
            packet={a >= 1 ? (t * 0.7) % 1 : undefined}
          />
          <Arc
            from={ROOM.phoneB}
            to={ROOM.router}
            lift={0.8}
            progress={b}
            packet={b >= 1 ? (t * 0.7 + 0.5) % 1 : undefined}
          />
          {a > 0.9 ? (
            <Ripple position={[ROOM.router[0], ROOM.router[1] - 0.02, ROOM.router[2] + 0.12]} t={t} size={0.45} />
          ) : null}
        </>
      ) : null}
    </Stage>
  );
};
