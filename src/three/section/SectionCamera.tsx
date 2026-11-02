import {useThree} from '@react-three/fiber';
import {Easing, interpolate, random, useCurrentFrame, useVideoConfig} from 'remotion';
import * as THREE from 'three';
import {useFormat} from '../../format';
import {FOV_H, FRAMES, type Format} from '../../theme';

type V3 = [number, number, number];

/**
 * The Section lens per frame format (style guide § 8, § 11.6): 26° vertical in the 9:16 frame; in 16:9 the long side
 * keeps 26°, so the (vertical) fov is `FOV_H` ≈ 14.8°.
 */
export const sectionFov = (format: Format = 'vertical') => (format === 'horizontal' ? FOV_H : 26);

/** A scene's frame format from its props (`format`, set by the Explainer on horizontal videos; absent = vertical). */
export const formatOf = (p: object): Format | undefined => (p as {format?: Format}).format;

/**
 * A scene's props with the frame format it renders in: the Explainer hands horizontal scenes `format`; a cover still
 * (or any other caller) gets it from the composition's size here. Vertical props come back unchanged.
 */
export const useFormatProps = <T extends object>(props: T): T => {
  const {format} = useFormat();
  return format === 'horizontal' && formatOf(props) === undefined ? {...props, format} : props;
};

/**
 * A framing for the wide frame (§ 11.6): the same look-at, `k` × the distance (the 16:9 frame shows 0.56 × the 9:16
 * frame's height at the same distance, so a framing made for 9:16 needs ≈ 1.3–1.8 × the distance to keep its subject
 * in the frame's height). Vertical: unchanged.
 */
export const widenFraming = (f: Framing, format: Format | undefined, k: number): Framing =>
  format === 'horizontal' ? {look: f.look, distance: f.distance * k} : f;

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
  /** The frame format, carried on the result so `projectToFrame` uses that frame's size and lens (default vertical). */
  format?: Format;
}): {position: THREE.Vector3; look: THREE.Vector3; format?: Format} => {
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
    ...(o.format === 'horizontal' ? {format: o.format} : {}),
  };
};

/**
 * Project a world point to frame pixels for a Section camera state: fov 26°, 1080 × 1920, or, for a camera state made
 * with `format: 'horizontal'`, `FOV_H` and 1920 × 1080.
 */
export const projectToFrame = (
  cam: {position: THREE.Vector3; look: THREE.Vector3; format?: Format},
  point: V3,
  size: [number, number] = [FRAMES[cam.format ?? 'vertical'].width, FRAMES[cam.format ?? 'vertical'].height],
  fov = sectionFov(cam.format),
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
