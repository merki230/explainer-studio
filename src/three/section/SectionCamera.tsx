import {useThree} from '@react-three/fiber';
import {Easing, interpolate, random, useCurrentFrame, useVideoConfig} from 'remotion';
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
  /** The frame where the main move ends (it holds after, or the `post` move takes over). */
  durationInFrames: number;
  drift?: number;
  clockOffset?: number;
  /** Before the main move: hold on `pre.from` for `hold` frames, then move to `from` over `move` frames. */
  pre?: {from: Framing; hold: number; move: number; ease?: 'sine' | 'cubic'};
  /** After the main move: from frame `at`, move to `post.to` over `move` frames, then hold. */
  post?: {to: Framing; at: number; move: number};
}): {position: THREE.Vector3; look: THREE.Vector3} => {
  const sine = Easing.inOut(Easing.sin);
  const q = (x: number) =>
    interpolate(x, [0, 1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: sine});
  // pre/post moves go in and out of a phone: distance on a log scale reads as a steady dolly
  const mix = (a: Framing, b: Framing, k: number, logDistance: boolean) => ({
    look: a.look.map((x, i) => x + (b.look[i] - x) * k) as V3,
    distance: logDistance
      ? Math.exp(Math.log(a.distance) + (Math.log(b.distance) - Math.log(a.distance)) * k)
      : a.distance + (b.distance - a.distance) * k,
  });
  const start = o.pre ? o.pre.hold + o.pre.move : 0;
  const end = o.post ? o.post.at : Math.max(start + 1, o.durationInFrames);
  let f: Framing;
  if (o.pre && o.frame < start) {
    const u = (o.frame - o.pre.hold) / Math.max(1, o.pre.move);
    // a glide (cubic, linear distance) or a pull out of a phone (sine, log distance)
    f =
      o.pre.ease === 'cubic'
        ? mix(
            o.pre.from,
            o.from,
            interpolate(u, [0, 1], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: Easing.inOut(Easing.cubic),
            }),
            false,
          )
        : mix(o.pre.from, o.from, q(u), true);
  } else if (o.post && o.frame >= end) {
    f = mix(o.to, o.post.to, q((o.frame - o.post.at) / Math.max(1, o.post.move)), true);
  } else {
    f = mix(o.from, o.to, q((o.frame - start) / Math.max(1, end - start)), false);
  }
  const side = new THREE.Vector3(SECTION_ANGLE[2], 0, -SECTION_ANGLE[0]).normalize();
  // the idle drift shrinks with the distance (close to a phone it would swing the frame)
  const sway =
    (o.drift ?? 0) *
    Math.min(1, f.distance / 10) *
    Math.sin(((o.frame / o.fps + (o.clockOffset ?? 0)) / 25) * Math.PI * 2);
  const lookV = new THREE.Vector3(...f.look).addScaledVector(side, sway);
  return {
    position: new THREE.Vector3(...cameraAt({look: [lookV.x, lookV.y, lookV.z], distance: f.distance})),
    look: lookV,
  };
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
  pre?: {from: Framing; hold: number; move: number; ease?: 'sine' | 'cubic'};
  post?: {to: Framing; at: number; move: number};
  /**
   * Fit the clip planes to the framing each frame: near = 15% of the distance to the look-at point,
   * far = 2 × distance + 200. A fixed near 0.1 with a far of 500 (a whole building) leaves ≈ 5 mm of
   * depth resolution at the tower framing, so stacked parts (frames, rings, decals) z-fight and
   * flicker while the camera moves. Default off (the room-sized slices keep the stage's planes).
   */
  fitClip?: boolean;
  /** With `fitClip`: the far plane at least this far (a backdrop or a long street behind the subject). */
  farMin?: number;
  /**
   * A buzz felt through the car (No. 005): every frame a new seeded jitter of the camera's position
   * (≈ 0.12% of the distance at 1, a few px) and a small roll / pitch / yaw (≈ 0.1°), so it reads as
   * a fast tremble, not a wobble. 0 or omitted: none (the camera is exactly as before).
   */
  shake?: number;
  /** Seed for the shake (default 'section-shake'). */
  shakeSeed?: string;
}> = ({
  from,
  to,
  durationInFrames,
  drift = 0,
  clockOffset = 0,
  pre,
  post,
  fitClip = false,
  farMin = 0,
  shake = 0,
  shakeSeed = 'section-shake',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const {position, look} = sectionCameraAt({from, to, frame, fps, durationInFrames, drift, clockOffset, pre, post});
  camera.position.copy(position);
  camera.lookAt(look);
  if (shake > 0) {
    const j = (k: string) => (random(`${shakeSeed}-${k}-${frame}`) - 0.5) * 2;
    const d = position.distanceTo(look);
    const a = 0.0012 * d * shake;
    camera.position.add(new THREE.Vector3(j('x') * a, j('y') * a, j('z') * a));
    camera.rotateZ(j('roll') * 0.002 * shake);
    camera.rotateX(j('pitch') * 0.0012 * shake);
    camera.rotateY(j('yaw') * 0.0012 * shake);
  }
  if (fitClip) {
    const d = position.distanceTo(look);
    camera.near = Math.max(0.1, d * 0.15);
    camera.far = Math.max(d * 2 + 200, farMin);
  }
  camera.updateProjectionMatrix();
  return null;
};
