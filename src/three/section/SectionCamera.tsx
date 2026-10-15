import {useThree} from '@react-three/fiber';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import * as THREE from 'three';

type V3 = [number, number, number];

/** What the camera frames: the point it looks at and how far back it stands along the fixed angle. */
export type Framing = {look: V3; distance: number};

/**
 * The one fixed 3/4 angle (style guide v0.8 § 8): from the front-right, ≈ 28° yaw off the cut face
 * and ≈ 16° down, as the unit vector from the look-at point toward the camera.
 */
export const SECTION_ANGLE: V3 = (() => {
  const v = new THREE.Vector3(4.6, 3.6, 8.6).sub(new THREE.Vector3(0.05, 0.75, -0.15)).normalize();
  return [v.x, v.y, v.z];
})();

export const cameraAt = (f: Framing): V3 => [
  f.look[0] + SECTION_ANGLE[0] * f.distance,
  f.look[1] + SECTION_ANGLE[1] * f.distance,
  f.look[2] + SECTION_ANGLE[2] * f.distance,
];

/**
 * Where a Section camera is at a frame (pure; the overlays use it to place labels on people):
 * it trucks/cranes (look-at) and pushes (distance) from `from` to `to`, sine in-out, plus a
 * sideways drift of ±`drift` on a 25 s sine of the video clock.
 */
export const sectionCameraAt = (o: {
  from: Framing;
  to: Framing;
  frame: number;
  fps: number;
  durationInFrames: number;
  drift?: number;
  clockOffset?: number;
}): {position: THREE.Vector3; look: THREE.Vector3} => {
  const p = interpolate(o.frame, [0, Math.max(1, o.durationInFrames)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.sin),
  });
  const look = o.from.look.map((x, i) => x + (o.to.look[i] - x) * p) as V3;
  const distance = o.from.distance + (o.to.distance - o.from.distance) * p;
  const side = new THREE.Vector3(SECTION_ANGLE[2], 0, -SECTION_ANGLE[0]).normalize();
  const sway = (o.drift ?? 0) * Math.sin(((o.frame / o.fps + (o.clockOffset ?? 0)) / 25) * Math.PI * 2);
  const lookV = new THREE.Vector3(...look).addScaledVector(side, sway);
  return {position: new THREE.Vector3(...cameraAt({look: [lookV.x, lookV.y, lookV.z], distance})), look: lookV};
};

/** Project a world point to frame pixels for a Section camera state (fov 26°, 1080 × 1920). */
export const projectToFrame = (
  cam: {position: THREE.Vector3; look: THREE.Vector3},
  point: V3,
  size: [number, number] = [1080, 1920],
  fov = 26,
): [number, number] => {
  const c = new THREE.PerspectiveCamera(fov, size[0] / size[1], 0.1, 80);
  c.position.copy(cam.position);
  c.lookAt(cam.look);
  c.updateMatrixWorld();
  const v = new THREE.Vector3(...point).project(c);
  return [((v.x + 1) / 2) * size[0], ((1 - v.y) / 2) * size[1]];
};

/** The camera of a Section scene (see `sectionCameraAt`). It never rotates off the fixed angle. */
export const SectionCamera: React.FC<{
  from: Framing;
  to: Framing;
  durationInFrames: number;
  drift?: number;
  clockOffset?: number;
}> = ({from, to, durationInFrames, drift = 0, clockOffset = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const camera = useThree((s) => s.camera);
  const {position, look} = sectionCameraAt({from, to, frame, fps, durationInFrames, drift, clockOffset});
  camera.position.copy(position);
  camera.lookAt(look);
  camera.updateProjectionMatrix();
  return null;
};
