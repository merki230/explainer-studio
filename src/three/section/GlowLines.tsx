import React, {useMemo} from 'react';
import * as THREE from 'three';
import {section} from '../../theme';
import {raw} from '../plaster';

type V3 = [number, number, number];

/*
 * The orange system drawn as straight glowing segments and node dots (style guide § 5): an `orange` core
 * and a 25% `orange` halo (≈ 3.07 × the core, the vibration path's ratio), both in the bloom layer, node
 * dots ≈ 1.95 × the core. Built for things that move every frame (the highway's mile ruler streams with
 * the road): every segment is one shared unit cylinder placed, turned and stretched per frame, so nothing
 * is rebuilt. Unlit, never casts shadows.
 */

/** The halo's radius and opacity relative to the core (§ 5: 0.069 / 0.0225, 25%). */
const HALO = {scale: 3.07, opacity: 0.25};
/** Node dots relative to the core radius (§ 5: 0.035 / 0.018). */
export const NODE_SCALE = 1.95;

const UP = new THREE.Vector3(0, 1, 0);
const unitCylinder = new THREE.CylinderGeometry(1, 1, 1, 10, 1, true);
const unitSphere = new THREE.SphereGeometry(1, 16, 12);

const useGlowMats = () =>
  useMemo(
    () => ({
      core: new THREE.MeshBasicMaterial({color: raw(section.orange), transparent: true, fog: false}),
      halo: new THREE.MeshBasicMaterial({color: raw(section.orange), transparent: true, depthWrite: false, fog: false}),
      dot: new THREE.MeshBasicMaterial({color: raw(section.orangeDot), transparent: true, fog: false}),
    }),
    [],
  );

/** One glowing straight segment a → b, `radius` the core's, `glow` 0 → 1 its strength (hidden at 0). */
export const GlowSegment: React.FC<{a: V3; b: V3; radius: number; glow?: number; halo?: number}> = ({
  a,
  b,
  radius,
  glow = 1,
  halo = 1,
}) => {
  const mats = useGlowMats();
  const g = Math.max(0, Math.min(1, glow));
  mats.core.opacity = g;
  mats.halo.opacity = Math.min(0.9, HALO.opacity * halo) * g;
  const va = new THREE.Vector3(...a);
  const vb = new THREE.Vector3(...b);
  const d = vb.clone().sub(va);
  const len = d.length();
  if (g < 0.003 || len < 1e-4) return null;
  const q = new THREE.Quaternion().setFromUnitVectors(UP, d.clone().normalize());
  const mid = va.add(vb).multiplyScalar(0.5).toArray() as V3;
  return (
    <group position={mid} quaternion={q}>
      <mesh geometry={unitCylinder} material={mats.core} scale={[radius, len, radius]} userData={{glow: true}} renderOrder={4} />
      <mesh
        geometry={unitCylinder}
        material={mats.halo}
        scale={[radius * HALO.scale, len, radius * HALO.scale]}
        userData={{glow: true}}
        renderOrder={5}
      />
    </group>
  );
};

/** A node dot (core + halo); `swell` > 1 grows it (a pulse arriving); `dot` uses the pale travelling-dot core. */
export const GlowNode: React.FC<{at: V3; radius: number; glow?: number; swell?: number; dot?: boolean}> = ({
  at,
  radius,
  glow = 1,
  swell = 1,
  dot = false,
}) => {
  const mats = useGlowMats();
  const g = Math.max(0, Math.min(1, glow));
  mats.core.opacity = g;
  mats.dot.opacity = g;
  mats.halo.opacity = HALO.opacity * g;
  if (g < 0.003) return null;
  const r = radius * swell;
  return (
    <group position={at}>
      <mesh geometry={unitSphere} material={dot ? mats.dot : mats.core} scale={r} userData={{glow: true}} renderOrder={4} />
      <mesh geometry={unitSphere} material={mats.halo} scale={r * 2.2} userData={{glow: true}} renderOrder={5} />
    </group>
  );
};

/** Length along a polyline. */
export const polylineLength = (pts: V3[]) =>
  pts.slice(1).reduce((a, p, i) => a + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1], p[2] - pts[i][2]), 0);

/** The point a share `u` (0 → 1) of the way along a polyline, by length. */
export const pointAlong = (pts: V3[], u: number): V3 => {
  if (pts.length < 2) return pts[0] ?? [0, 0, 0];
  const total = polylineLength(pts);
  let left = Math.max(0, Math.min(1, u)) * total;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1];
    const b = pts[i];
    const l = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
    if (left <= l || i === pts.length - 1) {
      const k = l > 0 ? Math.min(1, left / l) : 0;
      return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
    }
    left -= l;
  }
  return pts[pts.length - 1];
};

/** The part of a polyline drawn so far (share `u` of its length from the start). */
export const drawnPart = (pts: V3[], u: number): V3[] => {
  if (pts.length < 2 || u <= 0) return [];
  const total = polylineLength(pts);
  let left = Math.min(1, u) * total;
  const out: V3[] = [pts[0]];
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1];
    const b = pts[i];
    const l = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
    if (left >= l) {
      out.push(b);
      left -= l;
    } else {
      const k = l > 0 ? left / l : 0;
      out.push([a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k]);
      break;
    }
  }
  return out;
};

/**
 * A glowing polyline drawn from its start to a share `draw` of its length (straight segments, corners at the
 * points); `halo` × the halo's opacity (a brighter stretch).
 */
export const GlowPolyline: React.FC<{points: V3[]; draw?: number; radius: number; glow?: number; halo?: number}> = ({
  points,
  draw = 1,
  radius,
  glow = 1,
  halo = 1,
}) => {
  const part = drawnPart(points, draw);
  return (
    <>
      {part.slice(1).map((p, i) => (
        <GlowSegment key={i} a={part[i]} b={p} radius={radius} glow={glow} halo={halo} />
      ))}
      {/* round the inner corners so the bends don't show gaps */}
      {part.slice(1, -1).map((p, i) => (
        <GlowNode key={`c${i}`} at={p} radius={radius * 1.02} glow={glow} />
      ))}
    </>
  );
};
