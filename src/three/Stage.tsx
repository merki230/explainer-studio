import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import React from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {theme} from '../theme';

type V3 = [number, number, number];

/** Full-frame three.js canvas. Everything inside animates from useCurrentFrame(). */
export const Stage: React.FC<{children: React.ReactNode; background?: string; fov?: number}> = ({
  children,
  background = theme.bg,
  fov = 38,
}) => {
  const {width, height} = useVideoConfig();
  return (
    <ThreeCanvas
      width={width}
      height={height}
      shadows
      camera={{fov, near: 0.1, far: 100, position: [0, 2, 6]}}
      style={{backgroundColor: background}}
    >
      {children}
    </ThreeCanvas>
  );
};

const lerp3 = (a: V3, b: V3, p: number): V3 => [a[0] + (b[0] - a[0]) * p, a[1] + (b[1] - a[1]) * p, a[2] + (b[2] - a[2]) * p];

/** Slow dolly from one camera position to another across `durationInFrames`. */
export const CameraRig: React.FC<{
  from: V3;
  to: V3;
  lookFrom: V3;
  lookTo?: V3;
  durationInFrames: number;
}> = ({from, to, lookFrom, lookTo = lookFrom, durationInFrames}) => {
  const frame = useCurrentFrame();
  const camera = useThree((s) => s.camera);
  const p = interpolate(frame, [0, Math.max(1, durationInFrames)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.sin),
  });
  const pos = lerp3(from, to, p);
  const look = lerp3(lookFrom, lookTo, p);
  camera.position.set(pos[0], pos[1], pos[2]);
  camera.lookAt(look[0], look[1], look[2]);
  camera.updateProjectionMatrix();
  return null;
};
