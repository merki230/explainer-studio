import React, {useMemo} from 'react';
import * as THREE from 'three';
import {section} from '../../theme';
import {raw} from '../plaster';
import {ease} from '../../scenes/keyframes';

type V3 = [number, number, number];

/*
 * The "made by" glow (style guide v0.14 § 5, No. 011): when the hidden system is who made a part, a lit part shows
 * it with two things only, both in the bloom layer:
 *  1. its ink cut-edge line turns `orange`, at the vibration path's weight (core `VIB_R` 0.0225 × camD / 30, clamped
 *     0.25 → 3.5): `GlowEdge` (a tube along the cut edge, over the ink line). An uncut part (a part lying in the
 *     teardown grid) has no cut edge: its silhouette line is a thin back-face shell at the core's weight
 *     (`GlowShell` `core`).
 *  2. an orange halo shell round its silhouette, `orange` at 25 % (the path halo's ratio): `GlowShell` (back faces
 *     pushed out along the normals) or, along a cut edge, a wider tube at 25 %.
 * The part's surfaces keep their material; the cut face stays `cut`. Light up 0.3 s, surge 0.4 s (halo to 45 %, the
 * part swells 3 %), fade 0.5 s, all cubic in-out. Pure functions of time (no state).
 */

/** The path core radius (`VIB_R`, § 5). */
export const MADE_BY_R = 0.0225;
/** The core radius for a camera distance (§ 5: × camD / 30, clamped 0.25 → 3.5). */
export const madeByCoreR = (camD: number) => MADE_BY_R * Math.max(0.25, Math.min(3.5, camD / 30));

/** One part's (or group's) glow keys, seconds into the scene; any time may lie outside it. */
export type MadeByKeys = {
  /** Lights up from here (0.3 s). */
  at: number;
  /** Surges (halo to 45 %, the part swells 3 %, 0.4 s up and down, once each). */
  surge?: number[];
  /** Fades out from here (0.5 s). Default never (the trace holds). */
  fadeAt?: number;
};

/** The glow's state at t: `lit` 0 → 1 (light up, fade), `surge` 0 → 1 → 0. */
export const madeByState = (k: MadeByKeys | null | undefined, t: number) => {
  if (!k) return {lit: 0, surge: 0};
  const lit = ease(t, k.at, k.at + 0.3) * (k.fadeAt == null ? 1 : 1 - ease(t, k.fadeAt, k.fadeAt + 0.5));
  const surge = (k.surge ?? []).reduce((a, s) => {
    const u = t - s;
    return u <= 0 || u >= 0.4 ? a : Math.max(a, u < 0.2 ? ease(u, 0, 0.2) : 1 - ease(u, 0.2, 0.4));
  }, 0);
  return {lit, surge: surge * lit};
};

/** The halo's opacity for a state (25 % → 45 % on a surge), and the swell (× 1.03 at the surge's top). */
export const haloOpacity = (lit: number, surge: number) => lit * (0.25 + 0.2 * surge);
export const swellOf = (surge: number) => 1 + 0.03 * surge;

const orange = () => raw(section.orange);

const shellMat = () => new THREE.MeshBasicMaterial({color: orange(), transparent: true, depthWrite: false, side: THREE.BackSide});

/**
 * The halo shell (and, with `core`, the silhouette line) round a part's geometry: its back faces, grown by a fixed
 * margin on every side (scaled per axis about the geometry's bounding box, so it fits boxes, slabs and drums exactly
 * and other convex parts closely), read as a rim round the silhouette from any angle. Mount it with the part's own
 * transform (`position`, `rotation`, `scale` as the part's mesh).
 */
export const GlowShell: React.FC<{
  geometry: THREE.BufferGeometry;
  lit: number;
  surge?: number;
  /** The core radius (m, `madeByCoreR`): the halo's margin is 2.4 × it, the core line's 0.9 ×. */
  r: number;
  /** Also draw the core silhouette line (an uncut part). Default false. */
  core?: boolean;
  /** × the halo's opacity (a focus dims the others). Default 1. */
  dim?: number;
  position?: V3;
  rotation?: V3;
  /** The part mesh's own scale (the margins are added in world metres, after it). Default 1. */
  scale?: V3 | number;
}> = ({geometry, lit, surge = 0, r, core = false, dim = 1, position, rotation, scale = 1}) => {
  const mats = useMemo(() => ({halo: shellMat(), core: shellMat()}), []);
  const box = useMemo(() => {
    geometry.computeBoundingBox();
    const b = geometry.boundingBox!;
    const c = new THREE.Vector3();
    const sz = new THREE.Vector3();
    b.getCenter(c);
    b.getSize(sz);
    return {c: [c.x, c.y, c.z] as V3, s: [sz.x, sz.y, sz.z] as V3};
  }, [geometry]);
  if (lit <= 0.003) return null;
  const sc: V3 = typeof scale === 'number' ? [scale, scale, scale] : scale;
  const grow = (m: number): V3 => sc.map((k, i) => {
    const w = Math.max(1e-4, box.s[i] * Math.abs(k));
    return (k * (w + 2 * m)) / w;
  }) as V3;
  mats.halo.opacity = haloOpacity(lit, surge) * dim;
  mats.core.opacity = lit * (0.55 + 0.45 * dim);
  // scale about the bounding box's centre: move it to the origin, scale, move back
  const shell = (m: number, mat: THREE.Material, order: number) => {
    const g = grow(m);
    return (
      <group scale={g}>
        <mesh
          geometry={geometry}
          material={mat}
          position={[-box.c[0], -box.c[1], -box.c[2]]}
          userData={{glow: true}}
          renderOrder={order}
        />
      </group>
    );
  };
  return (
    <group position={position} rotation={rotation}>
      <group position={[box.c[0] * sc[0], box.c[1] * sc[1], box.c[2] * sc[2]]}>
        {shell(r * 2.4, mats.halo, 6)}
        {core ? shell(r * 0.9, mats.core, 7) : null}
      </group>
    </group>
  );
};

/**
 * The orange cut-edge line (over the ink) and its halo tube (25 %, 3 × wider) along one or more polylines (a cut
 * face's outline). `closed` joins each polyline's last point to its first.
 */
export const GlowEdge: React.FC<{
  lines: V3[][];
  closed?: boolean;
  lit: number;
  surge?: number;
  /** The core radius (m, `madeByCoreR`). */
  r: number;
  /** × the halo's opacity. Default 1. */
  dim?: number;
}> = ({lines, closed = true, lit, surge = 0, r, dim = 1}) => {
  // quantized radius: the tubes rebuild only when it changes by ≥ 5 %
  const rq = Math.round(Math.log(Math.max(1e-4, r)) / Math.log(1.05));
  const key = JSON.stringify([lines, closed, rq]);
  const geos = useMemo(() => {
    const [ls, cl, q] = JSON.parse(key) as [V3[][], boolean, number];
    const rr = Math.pow(1.05, q);
    return ls
      .filter((l) => l.length > 1)
      .map((l) => {
        const path = new THREE.CurvePath<THREE.Vector3>();
        const vs = l.map((p) => new THREE.Vector3(...p));
        const n = cl ? vs.length : vs.length - 1;
        for (let i = 0; i < n; i++) path.add(new THREE.LineCurve3(vs[i], vs[(i + 1) % vs.length]));
        const segs = Math.max(8, n * 2);
        return {core: new THREE.TubeGeometry(path, segs, rr, 6, false), halo: new THREE.TubeGeometry(path, segs, rr * 3, 8, false)};
      });
  }, [key]);
  const mats = useMemo(
    () => ({
      core: new THREE.MeshBasicMaterial({color: orange(), transparent: true}),
      halo: new THREE.MeshBasicMaterial({color: orange(), transparent: true, depthWrite: false}),
    }),
    [],
  );
  if (lit <= 0.003) return null;
  mats.core.opacity = lit;
  mats.halo.opacity = haloOpacity(lit, surge) * dim;
  return (
    <group>
      {geos.map((g, i) => (
        <React.Fragment key={i}>
          <mesh geometry={g.core} material={mats.core} userData={{glow: true}} renderOrder={7} frustumCulled={false} />
          <mesh geometry={g.halo} material={mats.halo} userData={{glow: true}} renderOrder={6} frustumCulled={false} />
        </React.Fragment>
      ))}
    </group>
  );
};

/** A rectangle's outline in a plane of constant z (x0..x1, y0..y1), for `GlowEdge`. */
export const rectXY = (x0: number, x1: number, y0: number, y1: number, z: number): V3[] => [
  [x0, y0, z],
  [x1, y0, z],
  [x1, y1, z],
  [x0, y1, z],
];

/** A circle's outline in a plane of constant z, for `GlowEdge`. */
export const circleXY = (cx: number, cy: number, r: number, z: number, n = 48): V3[] =>
  [...Array(n).keys()].map((i) => {
    const a = (i / n) * Math.PI * 2;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a), z];
  });

/**
 * The parts of a closed polyline with x inside [x0, x1], as open polylines (the boundary crossings interpolated):
 * a car's cut-edge outline split into its panels, door by door.
 */
export const clipPolylineX = (pts: V3[], x0: number, x1: number, closed = true): V3[][] => {
  const out: V3[][] = [];
  let cur: V3[] = [];
  const inside = (p: V3) => p[0] >= x0 && p[0] <= x1;
  const lerp = (a: V3, b: V3, x: number): V3 => {
    const u = (x - a[0]) / (b[0] - a[0] || 1e-9);
    return [x, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u];
  };
  const n = closed ? pts.length : pts.length - 1;
  for (let i = 0; i < n; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % pts.length];
    const ia = inside(a);
    const ib = inside(b);
    if (ia && !cur.length) cur.push(a);
    if (ia && ib) cur.push(b);
    else if (ia && !ib) {
      cur.push(lerp(a, b, b[0] > x1 ? x1 : x0));
      out.push(cur);
      cur = [];
    } else if (!ia && ib) {
      cur = [lerp(a, b, a[0] > x1 ? x1 : x0), b];
    } else {
      // both outside: the segment may still cross the whole range
      const lo = Math.min(a[0], b[0]);
      const hi = Math.max(a[0], b[0]);
      if (lo < x0 && hi > x1) out.push(a[0] < b[0] ? [lerp(a, b, x0), lerp(a, b, x1)] : [lerp(a, b, x1), lerp(a, b, x0)]);
    }
  }
  if (cur.length > 1) {
    // a closed outline that started inside: join the last run onto the first
    if (closed && out.length && inside(pts[0])) out[0] = [...cur, ...out[0].slice(1)];
    else out.push(cur);
  }
  return out.filter((l) => l.length > 1);
};
