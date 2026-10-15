import React, {useEffect, useMemo} from 'react';
import * as THREE from 'three';
import {theme} from '../theme';
import {raw, stainMaterial, stainSoftMaterial, washTexture} from './plaster';

type V3 = [number, number, number];

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

const ORANGE_LIGHT = 0.45;

/**
 * Orange light that bleeds onto nearby plaster. `intensity` is 0–1 (scaled to
 * look right at the museum's light levels); `reach` is how far it spills.
 * Always mounted (at 0 when off): changing the number of lights recompiles every shader.
 */
export const OrangeLight: React.FC<{position: V3; intensity: number; reach?: number}> = ({
  position,
  intensity,
  reach = 2.2,
}) => {
  const color = useMemo(() => raw(theme.orange), []);
  return (
    <pointLight
      position={position}
      color={color}
      intensity={Math.max(0, intensity) * ORANGE_LIGHT}
      distance={reach}
      decay={2}
    />
  );
};

const toCurve = (legs: V3[][]) => {
  const path = new THREE.CurvePath<THREE.Vector3>();
  for (const leg of legs) {
    path.add(new THREE.CatmullRomCurve3(leg.map((p) => new THREE.Vector3(...p))));
  }
  return path;
};

const TUBULAR = 220;
const RADIAL = 10;

/** Tube along `curve`, revealed from the start by setting the draw range. */
const useTube = (curve: THREE.Curve<THREE.Vector3>, radius: number) => {
  const geometry = useMemo(() => new THREE.TubeGeometry(curve, TUBULAR, radius, RADIAL, false), [curve, radius]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return geometry;
};
const reveal = (g: THREE.BufferGeometry, p: number) => {
  const total = g.index ? g.index.count : 0;
  g.setDrawRange(0, Math.floor((total * clamp01(p)) / 6) * 6);
};

export type OrangePathProps = {
  /**
   * The route, as one or more legs. Each leg is a smooth curve through its points;
   * legs join with a corner (e.g. phone → router, then router → other phone).
   */
  legs: V3[][];
  /** 0–1: how much of the route has been drawn. */
  progress: number;
  /** 0–1: strength of the glowing core and halo. Fade it to 0 to leave only the stain. */
  glow?: number;
  /** Leave an orange stain line where the route has been drawn (it stays after the glow fades). */
  stain?: boolean;
  /**
   * Where the stain goes, if not on the route itself. Usually the route projected
   * onto the wall behind the scene, so the stain reads as a mark on the plaster
   * and never as a cable in front of the figures. Drawn with the same `progress`.
   */
  stainLegs?: V3[][];
  /** Stain line radius (world units). A soft edge 3× wider surrounds it. */
  stainRadius?: number;
  /** Core radius in world units (halo is 2.6×). */
  radius?: number;
  /** Light travelling with the head of the path while it draws. */
  runner?: boolean;
  /**
   * When set, `dots` bright packets flow along the whole route; the value is
   * their phase in route-lengths (e.g. seconds × 0.3).
   */
  flow?: number;
  dots?: number;
};

/**
 * The hidden system made visible: a glowing orange route (core + halo, both
 * bloom), a moving light at its head, flowing data dots, and a matte stain
 * that persists where it has been.
 */
export const OrangePath: React.FC<OrangePathProps> = ({
  legs,
  progress,
  glow = 1,
  stain = true,
  stainLegs,
  stainRadius = 0.01,
  radius = 0.02,
  runner = true,
  flow,
  dots = 5,
}) => {
  const key = JSON.stringify(legs);
  const stainKey = JSON.stringify(stainLegs ?? legs);
  // Keyed on the JSON so a fresh array literal each render doesn't rebuild the tubes.
  const curve = useMemo(() => toCurve(JSON.parse(key)), [key]);
  const stainCurve = useMemo(() => toCurve(JSON.parse(stainKey)), [stainKey]);

  const coreGeo = useTube(curve, radius);
  const haloGeo = useTube(curve, radius * 2.6);
  const stainGeo = useTube(stainCurve, stainRadius);
  const stainSoftGeo = useTube(stainCurve, stainRadius * 3);

  const mats = useMemo(
    () => ({
      core: new THREE.MeshBasicMaterial({color: raw(theme.orangeCore), transparent: true}),
      halo: new THREE.MeshBasicMaterial({color: raw(theme.orange), transparent: true, depthWrite: false}),
      dot: new THREE.MeshBasicMaterial({color: raw(theme.orangeDot), transparent: true}),
    }),
    [],
  );
  useEffect(() => () => Object.values(mats).forEach((m) => m.dispose()), [mats]);

  const p = clamp01(progress);
  const g = clamp01(glow);
  reveal(coreGeo, p);
  reveal(haloGeo, p);
  reveal(stainGeo, p);
  reveal(stainSoftGeo, p);
  mats.core.opacity = g;
  mats.halo.opacity = 0.2 * g;
  // Dots belong to the live system: they shrink and fade with the glow (no "stickers").
  mats.dot.opacity = g;

  const head = curve.getPointAt(Math.min(0.999, p));
  const drawing = p > 0 && p < 1;

  return (
    <group>
      {stain && p > 0 ? (
        <>
          <mesh geometry={stainSoftGeo} material={stainSoftMaterial()} frustumCulled={false} renderOrder={1} />
          <mesh geometry={stainGeo} material={stainMaterial()} frustumCulled={false} renderOrder={1} />
        </>
      ) : null}
      {g > 0.001 && p > 0 ? (
        <>
          <mesh geometry={coreGeo} material={mats.core} userData={{glow: true}} frustumCulled={false} renderOrder={2} />
          <mesh geometry={haloGeo} material={mats.halo} userData={{glow: true}} frustumCulled={false} renderOrder={3} />
        </>
      ) : null}
      {runner ? (
        <OrangeLight position={[head.x, head.y, head.z]} intensity={drawing ? 1.2 * Math.max(g, 0.3) : 0} reach={1.8} />
      ) : null}
      {flow !== undefined && p >= 1 && g > 0.001
        ? new Array(dots).fill(0).map((_, i) => {
            const u = (((flow + i / dots) % 1) + 1) % 1;
            const d = curve.getPointAt(u);
            return (
              <mesh key={i} position={d} scale={g} material={mats.dot} userData={{glow: true}}>
                <sphereGeometry args={[radius * 1.9, 12, 10]} />
              </mesh>
            );
          })
        : null}
    </group>
  );
};

/**
 * Orange wash on a wall: the stain the system leaves behind. `amount` 0–1 is
 * how far it has spread; keep it at its last value to let it persist.
 */
export const OrangeWash: React.FC<{position: V3; size?: [number, number]; amount: number; strength?: number}> = ({
  position,
  size = [1.9, 1.4],
  amount,
  strength = 0.55,
}) => {
  const material = useMemo(
    () => new THREE.MeshBasicMaterial({map: washTexture(), transparent: true, depthWrite: false, opacity: 0}),
    [],
  );
  useEffect(() => () => material.dispose(), [material]);
  const a = clamp01(amount);
  material.opacity = strength * a;
  const grow = 0.6 + 0.4 * a;
  return a > 0.001 ? (
    <mesh position={position} material={material} scale={[grow, grow, 1]} renderOrder={1}>
      <planeGeometry args={size} />
    </mesh>
  ) : null;
};
