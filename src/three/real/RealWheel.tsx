import {useThree} from '@react-three/fiber';
import React, {useLayoutEffect, useMemo, useRef} from 'react';
import * as THREE from 'three';
import {MOODS, REAL, section, type Mood} from '../../theme';
import {raw} from '../plaster';
import {cutMaterial, InkLine} from '../section/cutLook';
import {applyAlbedo, applyEnv, useAlbedo, useEnvStrength, useStudioEnv} from './useStudioEnv';

type V3 = [number, number, number];

/*
 * A realistic generic car wheel (No. 002), built at radius 1 and scaled: a tire with a grooved tread,
 * plain sidewalls (no lettering) and an inner liner on an alloy rim (well, bead seats, flanges), five
 * spokes, hub, lug nuts, a brake rotor, the axle stub, and a valve stem with its cap. Three cuts:
 *  - 'axle': cut through the axle plane, the half toward the camera removed (local z < 0). The tire's
 *    two cut profiles (top and bottom) read like the dashboard tire symbol.
 *  - 'mid': cut through the tire's mid-plane, the outboard half removed (local x > 0): the cavity
 *    shows all round, with the sensor on the rim well (the car slice's near wheels).
 *  - 'none': whole.
 * Local frame: the axle is x (outboard +x), y up; a point at angle φ on the wheel is
 * (a, r cos φ, r sin φ), so φ = 0 is the top and the 'axle' cut keeps φ in [0, π].
 * The tire and rim are surfaces of revolution, so they never move: only the tread pattern (a texture
 * offset), the spokes, hub, valve, sensor and marks turn with `spin`. Cut faces carry the section look.
 */

export type WheelCut = 'axle' | 'mid' | 'none';

/** Tags for each profile segment: what material it gets. */
const RUBBER = 0;
const TREAD = 1;
const LINER = 2;
const METAL = 3;
const CUT = 4;

type Pt = [number, number]; // [a, r]

const mirror = (half: Pt[]): Pt[] => [...half, ...half.map(([a, r]) => [-a, r] as Pt).reverse()];

/** The tire's cross-section (a, r) with a tag per segment (from point i to i + 1). */
const tireProfile = (): {pts: Pt[]; tags: number[]} => {
  // the outside, inboard bead → over the tread → outboard bead (the inboard half, mirrored)
  const side: Pt[] = [
    [-0.265, 0.66],
    [-0.3, 0.66],
    [-0.316, 0.7],
    [-0.335, 0.78],
    [-0.338, 0.85],
    [-0.326, 0.92],
    [-0.302, 0.962],
    [-0.265, 0.99],
    [-0.235, 1.0],
  ];
  // four circumferential grooves (they show as notches on the cut profile, like the symbol's tread)
  const grooves: Pt[] = [
    [-0.2, 1.0],
    [-0.2, 0.968],
    [-0.165, 0.968],
    [-0.165, 1.0],
    [-0.095, 1.0],
    [-0.095, 0.968],
    [-0.06, 0.968],
    [-0.06, 1.0],
  ];
  const outsideHalf = [...side, ...grooves];
  const outside = mirror(outsideHalf);
  const linerHalf: Pt[] = [
    [-0.24, 0.922],
    [-0.28, 0.9],
    [-0.298, 0.86],
    [-0.3, 0.8],
    [-0.285, 0.72],
  ];
  // the liner runs outboard (bottom → top) → across → inboard (top → bottom)
  const liner: Pt[] = [...[...linerHalf].reverse().map(([a, r]) => [-a, r] as Pt), ...linerHalf];
  const pts = [...outside, ...liner];
  const tags = pts.map((p, i) => {
    if (i >= outside.length - 1) return i === pts.length - 1 ? RUBBER : i === outside.length - 1 ? RUBBER : LINER;
    const q = pts[i + 1];
    return p[1] >= 0.96 && q[1] >= 0.96 && Math.abs(p[0]) < 0.24 && Math.abs(q[0]) < 0.24 ? TREAD : RUBBER;
  });
  return {pts, tags};
};

/** The rim's cross-section (alloy, ≈ 0.03 thick): flanges, bead seats, the well. */
const rimProfile = (): {pts: Pt[]; tags: number[]} => {
  const pts: Pt[] = [
    [-0.338, 0.705],
    [-0.322, 0.664],
    [-0.22, 0.655],
    [-0.17, 0.6],
    [0.02, 0.6],
    [0.08, 0.622],
    [0.22, 0.655],
    [0.322, 0.664],
    [0.338, 0.705],
    [0.308, 0.69],
    [0.3, 0.636],
    [0.22, 0.626],
    [0.07, 0.592],
    [0.02, 0.57],
    [-0.17, 0.57],
    [-0.22, 0.626],
    [-0.3, 0.636],
    [-0.308, 0.69],
  ];
  return {pts, tags: pts.map(() => METAL)};
};

const signedArea = (pts: Pt[]) => {
  let s = 0;
  for (let i = 0; i < pts.length; i++) {
    const [a1, r1] = pts[i];
    const [a2, r2] = pts[(i + 1) % pts.length];
    s += a1 * r2 - a2 * r1;
  }
  return s / 2;
};

/** Counter-clockwise in (a, r), tags kept on their segments. */
const ccw = (p: {pts: Pt[]; tags: number[]}) => {
  if (signedArea(p.pts) > 0) return p;
  const n = p.pts.length;
  const pts = [...p.pts].reverse();
  // segment i (pts[i] → pts[i+1]) of the reversed list is the old segment n − 2 − i
  const tags = pts.map((_, i) => p.tags[(n - 2 - i + n) % n]);
  return {pts, tags};
};

/** Clip a profile to a ≤ 0 (the 'mid' cut); the new edges on a = 0 are tagged CUT. */
const clipInboard = (p: {pts: Pt[]; tags: number[]}) => {
  const out: Pt[] = [];
  const tags: number[] = [];
  const n = p.pts.length;
  for (let i = 0; i < n; i++) {
    const A = p.pts[i];
    const B = p.pts[(i + 1) % n];
    const inA = A[0] <= 1e-9;
    const inB = B[0] <= 1e-9;
    const cross = (): Pt => {
      const k = A[0] / (A[0] - B[0]);
      return [0, A[1] + (B[1] - A[1]) * k];
    };
    if (inA && inB) {
      out.push(A);
      tags.push(p.tags[i]);
    } else if (inA && !inB) {
      out.push(A);
      tags.push(p.tags[i]);
      out.push(cross());
      tags.push(CUT);
    } else if (!inA && inB) {
      out.push(cross());
      tags.push(p.tags[i]);
    }
  }
  return {pts: out, tags};
};

type Deform = (a: number, r: number, phi: number) => Pt;

/**
 * The tire's sag at the bottom (φ = π) for a pressure (1 full, 0.75 a quarter low): the section's
 * height shrinks and the sidewalls bulge, fading out round the wheel. Rim points (r ≤ 0.66) stay.
 */
export const sagDeform =
  (pressure: number): Deform =>
  (a, r, phi) => {
    const s = Math.max(0, Math.min(2, (1 - pressure) / 0.25));
    if (s <= 0 || r <= 0.6605) return [a, r];
    const f = Math.pow(Math.max(0, -Math.cos(phi)), 4) * s;
    const h = Math.min(1, Math.max(0, (r - 0.66) / 0.34));
    return [a * (1 + 0.34 * f * Math.sin(Math.PI * h)), 0.66 + (r - 0.66) * (1 - 0.5 * f)];
  };

const geoCache = new Map<string, unknown>();
const memo = <T,>(key: string, make: () => T): T => {
  if (!geoCache.has(key)) geoCache.set(key, make());
  return geoCache.get(key) as T;
};

/** A surface of revolution of a tagged profile between φ0 and φ1, one geometry group per tag. */
const revolve = (p: {pts: Pt[]; tags: number[]}, phi0: number, phi1: number, segs: number, deform?: Deform) => {
  const pos: number[] = [];
  const uv: number[] = [];
  const index: number[] = [];
  const groups: {start: number; count: number; tag: number}[] = [];
  const n = p.pts.length;
  // arc length along the profile for v
  const len: number[] = [0];
  for (let i = 0; i < n; i++) {
    const [a1, r1] = p.pts[i];
    const [a2, r2] = p.pts[(i + 1) % n];
    len.push(len[i] + Math.hypot(a2 - a1, r2 - r1));
  }
  const total = len[n];
  const order = [...Array(n).keys()].sort((x, y) => p.tags[x] - p.tags[y]);
  for (const i of order) {
    const A = p.pts[i];
    const B = p.pts[(i + 1) % n];
    if (Math.hypot(A[0] - B[0], A[1] - B[1]) < 1e-7) continue;
    const base = pos.length / 3;
    for (let j = 0; j <= segs; j++) {
      const phi = phi0 + ((phi1 - phi0) * j) / segs;
      for (const [k, E] of [A, B].entries()) {
        const [a, r] = deform ? deform(E[0], E[1], phi) : E;
        pos.push(a, r * Math.cos(phi), r * Math.sin(phi));
        uv.push(phi / (Math.PI * 2), (k === 0 ? len[i] : len[i + 1]) / total);
      }
    }
    // outward normal of the segment (CCW profile in (a, r)): (n_a, n_r) = (dr, −da), at φ0
    const na = B[1] - A[1];
    const nr = -(B[0] - A[0]);
    const want = new THREE.Vector3(na, nr * Math.cos(phi0 + 1e-3), nr * Math.sin(phi0 + 1e-3));
    const v = (q: number) => new THREE.Vector3(pos[q * 3], pos[q * 3 + 1], pos[q * 3 + 2]);
    const face = v(base + 2)
      .sub(v(base))
      .cross(v(base + 1).sub(v(base)));
    const flip = face.dot(want) < 0;
    const start = index.length;
    for (let j = 0; j < segs; j++) {
      const a0 = base + j * 2;
      const b0 = a0 + 1;
      const a1 = a0 + 2;
      const b1 = a0 + 3;
      if (flip) index.push(a0, b0, a1, b0, b1, a1);
      else index.push(a0, a1, b0, b0, a1, b1);
    }
    const last = groups[groups.length - 1];
    if (last && last.tag === p.tags[i] && last.start + last.count === start) last.count += index.length - start;
    else groups.push({start, count: index.length - start, tag: p.tags[i]});
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(index);
  for (const gr of groups) g.addGroup(gr.start, gr.count, gr.tag);
  g.computeVertexNormals();
  return g;
};

/** A flat cap of the profile in the plane at angle φ (the 'axle' cut faces). */
const cap = (pts: Pt[], phi: number, deform?: Deform) => {
  const shape = new THREE.Shape(pts.map(([a, r]) => new THREE.Vector2(a, r)));
  const g = new THREE.ShapeGeometry(shape);
  const p = g.getAttribute('position');
  const nrm = g.getAttribute('normal');
  for (let i = 0; i < p.count; i++) {
    const [a, r] = deform ? deform(p.getX(i), p.getY(i), phi) : [p.getX(i), p.getY(i)];
    p.setXYZ(i, a, r * Math.cos(phi), r * Math.sin(phi) - 0.0005);
    nrm.setXYZ(i, 0, 0, -1);
  }
  return g;
};

/** The ink outline of a cap (slightly proud of it). */
const capInk = (pts: Pt[], phi: number, deform?: Deform): V3[] =>
  pts.map(([a0, r0]) => {
    const [a, r] = deform ? deform(a0, r0, phi) : [a0, r0];
    return [a, r * Math.cos(phi), r * Math.sin(phi) - 0.003] as V3;
  });

const circle = (a: number, r: number, n = 96): V3[] =>
  [...Array(n).keys()].map((i) => {
    const t = (i / n) * Math.PI * 2;
    return [a, r * Math.cos(t), r * Math.sin(t)] as V3;
  });

/** Tread blocks round the tire: lateral grooves as a texture (u = φ / 2π), so they turn with an offset. */
const treadTexture = () =>
  memo('tread-tex', () => {
    const W = 1024;
    const H = 4;
    const data = new Uint8Array(W * H * 4);
    for (let i = 0; i < W; i++) {
      const u = (i / W) * 84;
      const f = u - Math.floor(u);
      const v = f < 0.16 ? 70 : 255;
      for (let j = 0; j < H; j++) {
        const o = (j * W + i) * 4;
        data[o] = v;
        data[o + 1] = v;
        data[o + 2] = v;
        data[o + 3] = 255;
      }
    }
    const t = new THREE.DataTexture(data, W, H, THREE.RGBAFormat);
    t.wrapS = THREE.RepeatWrapping;
    t.wrapT = THREE.RepeatWrapping;
    t.magFilter = THREE.LinearFilter;
    t.minFilter = THREE.LinearFilter;
    t.needsUpdate = true;
    return t;
  });

/** Wheel-local constants other parts need (radius-1 units). */
export const WHEEL = {
  /** The valve's angle in the turning group: between two spokes (spokes at k·72°). */
  valveBase: Math.PI / 5,
  /** The sensor's base on the rim well, and where the stem leaves it. */
  sensor: {a: -0.05, r: 0.6},
  /** The valve stem: from inside the cavity through the rim, out to the cap (a, r). */
  stem: {from: [0.0, 0.62] as Pt, to: [0.29, 0.53] as Pt},
  cap: [0.33, 0.515] as Pt,
  hub: 0.17,
  /** The axle stub's inboard end (a). */
  axleEnd: -0.32,
};

/** A wheel-local point (a, r at angle φ) in the wheel's parent frame, for a wheel at `position`, turned `yaw`, scaled `radius`. */
export const wheelPoint = (
  o: {position: V3; yaw: number; radius: number},
  a: number,
  r: number,
  phi: number,
): V3 => {
  const v = new THREE.Vector3(a, r * Math.cos(phi), r * Math.sin(phi))
    .multiplyScalar(o.radius)
    .applyAxisAngle(new THREE.Vector3(0, 1, 0), o.yaw);
  return [v.x + o.position[0], v.y + o.position[1], v.z + o.position[2]];
};

export type RealWheelProps = {
  mood: Mood;
  /** Wheel centre (the parent must have no transform of its own: the cut's clip plane is worked out in world space). */
  position?: V3;
  /** Turn about the vertical axis (radians): 0 has the axle along x, outboard +x. */
  yaw?: number;
  /** Tire radius in world units (default 1). */
  radius?: number;
  cut?: WheelCut;
  /** Rotation angle of the turning parts about the axle (radians). */
  spin?: number;
  /** Tire pressure, 1 full, ≈ 0.75 a quarter low: the bottom sags. */
  pressure?: number;
  /** Fewer segments, no rotor (the car's far wheels, the Lab's rows). */
  low?: boolean;
  /** The valve stem and cap (default true). */
  valve?: boolean;
  /** A white tick on the outboard sidewall (the indirect system's spin cue). */
  tick?: boolean;
  /** A toothed speed ring on the hub with its pickup (the indirect system). */
  toneRing?: boolean;
  /** Rendered in the valve's frame (+y radial into the cavity, +x outboard, +z round the wheel), at the sensor's base. */
  sensor?: React.ReactNode;
  /** Ink lines on the cut edges (default true). */
  ink?: boolean;
  /** The axle stub inboard (default false: a floating wheel has none; the car's wheels do). */
  axle?: boolean;
  /** The wheel stands on the ground: a soft tire's rim drops by the sag (the tire stays on the ground). */
  grounded?: boolean;
  /** Scale of the sensor on the rim (default 1; the floating wheel uses ≈ 1.25 so it reads at frame 0). */
  sensorScale?: number;
};

const UNIT_CYL = new THREE.CylinderGeometry(1, 1, 1, 40);
const UNIT_CYL_LOW = new THREE.CylinderGeometry(1, 1, 1, 16);
/** A cylinder along the local x axis from a0 to a1. */
const Axial: React.FC<{a0: number; a1: number; r: number; mats: THREE.Material[]; low?: boolean; y?: number; z?: number}> = ({
  a0,
  a1,
  r,
  mats,
  low,
  y = 0,
  z = 0,
}) => (
  <>
    {mats.map((m, i) => (
      <mesh
        key={i}
        geometry={low ? UNIT_CYL_LOW : UNIT_CYL}
        material={m}
        position={[(a0 + a1) / 2, y, z]}
        rotation={[0, 0, Math.PI / 2]}
        scale={[r, Math.abs(a1 - a0), r]}
        castShadow={i === 0}
        receiveShadow={i === 0}
      />
    ))}
  </>
);

/** A spoke as a tapered box between two radii, in the plane of angle 0 (+y). */
const SPOKE = (() => {
  const g = new THREE.BoxGeometry(1, 1, 1, 1, 1, 1);
  const p = g.getAttribute('position');
  for (let i = 0; i < p.count; i++) {
    // y from −0.5 (hub) to 0.5 (rim): narrower and thinner toward the rim; set back (−x) at the rim
    const y = p.getY(i);
    const k = 1 - 0.35 * (y + 0.5);
    p.setZ(i, p.getZ(i) * k);
    p.setX(i, p.getX(i) * (1 - 0.2 * (y + 0.5)) - 0.25 * (y + 0.5));
  }
  g.computeVertexNormals();
  return g;
})();

/**
 * The wheel (see the file comment). Turning parts are clipped by the cut plane; their sections show
 * flat in the cut colour (their back faces through the opening).
 */
export const RealWheel: React.FC<RealWheelProps> = ({
  mood,
  position = [0, 0, 0],
  yaw = 0,
  radius = 1,
  cut = 'none',
  spin = 0,
  pressure = 1,
  low = false,
  valve = true,
  tick = false,
  toneRing = false,
  sensor,
  ink = true,
  axle = false,
  grounded = false,
  sensorScale = 1,
}) => {
  const gl = useThree((s) => s.gl);
  gl.localClippingEnabled = true;
  const env = useStudioEnv();
  const envScale = useEnvStrength();
  const albedo = useAlbedo();
  const m = MOODS[mood];
  const segs = low ? 48 : 120;
  const pq = Math.round(pressure * 200) / 200;

  const plane = useMemo(() => new THREE.Plane(), []);
  const mats = useMemo(() => {
    const phys = (c: string, o: THREE.MeshPhysicalMaterialParameters = {}) =>
      new THREE.MeshPhysicalMaterial({color: raw(c), ...o});
    const tread = treadTexture();
    const clipped = <T extends THREE.Material>(mat: T): T => {
      mat.clippingPlanes = [plane];
      return mat;
    };
    const cutFill = new THREE.MeshBasicMaterial({color: raw(section.cut), side: THREE.BackSide});
    const cutFace = cutMaterial();
    cutFace.side = THREE.DoubleSide;
    return {
      rubber: phys(REAL.tire, {roughness: 0.82, clearcoat: 0.08}),
      tread: phys(REAL.tire, {roughness: 0.9, map: tread, bumpMap: tread, bumpScale: 3}),
      liner: phys(REAL.liner, {roughness: 0.95, side: THREE.DoubleSide}),
      rim: phys(REAL.rim, {metalness: 0.75, roughness: 0.36}),
      cut: cutFace,
      spoke: clipped(phys(REAL.rim, {metalness: 0.75, roughness: 0.36})),
      dark: clipped(phys(REAL.labDark, {metalness: 0.4, roughness: 0.45})),
      rotor: clipped(phys(REAL.rotor, {metalness: 1, roughness: 0.5})),
      valve: clipped(phys(REAL.valve, {roughness: 0.6})),
      brass: clipped(phys(REAL.brass, {metalness: 1, roughness: 0.35})),
      stem: clipped(phys(REAL.steel, {metalness: 1, roughness: 0.3})),
      tick: clipped(new THREE.MeshStandardMaterial({color: raw(REAL.tick), roughness: 0.7})),
      tone: clipped(phys(REAL.toneRing, {metalness: 0.8, roughness: 0.45})),
      fill: clipped(cutFill),
    };
  }, [plane]);
  mats.fill.color.copy(raw(section.cut)).multiplyScalar(0.8 / m.exposure);
  mats.tread.map!.offset.x = -spin / (Math.PI * 2);
  applyEnv(
    env,
    [
      [mats.rim, 1],
      [mats.spoke, 1],
      [mats.rotor, 0.6],
      [mats.brass, 0.8],
      [mats.stem, 1],
      [mats.dark, 0.4],
      [mats.rubber, 0.15],
      [mats.tone, 0.5],
    ],
    envScale,
  );
  applyAlbedo([mats.rubber, mats.tread, mats.liner, mats.rim, mats.spoke, mats.dark, mats.rotor, mats.valve, mats.brass, mats.stem], albedo);

  // the clip plane in world space (keeps the remaining half)
  const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
  if (cut === 'axle') plane.setFromNormalAndCoplanarPoint(new THREE.Vector3(0, 0, 1).applyQuaternion(q), new THREE.Vector3(...position));
  else if (cut === 'mid')
    plane.setFromNormalAndCoplanarPoint(new THREE.Vector3(-1, 0, 0).applyQuaternion(q), new THREE.Vector3(...position).add(new THREE.Vector3(0.0005 * radius, 0, 0).applyQuaternion(q)));
  else plane.set(new THREE.Vector3(0, 1, 0), 1e6);

  const tire = useMemo(() => ccw(tireProfile()), []);
  const rim = useMemo(() => ccw(rimProfile()), []);
  const geo = useMemo(() => {
    const deform = sagDeform(pq);
    const key = `${cut}:${pq}:${segs}`;
    return memo(key, () => {
      if (cut === 'axle') {
        return {
          tire: revolve(tire, 0, Math.PI, segs, deform),
          rim: revolve(rim, 0, Math.PI, segs),
          caps: [cap(tire.pts, 0, deform), cap(tire.pts, Math.PI, deform), cap(rim.pts, 0), cap(rim.pts, Math.PI)],
          ink: [capInk(tire.pts, 0, deform), capInk(tire.pts, Math.PI, deform), capInk(rim.pts, 0), capInk(rim.pts, Math.PI)],
        };
      }
      if (cut === 'mid') {
        const t = clipInboard(tire);
        const r = clipInboard(rim);
        const rings = [...t.pts, ...r.pts].filter(([a]) => Math.abs(a) < 1e-9).map(([, rr]) => rr);
        return {
          tire: revolve(t, 0, Math.PI * 2, segs, deform),
          rim: revolve(r, 0, Math.PI * 2, segs),
          caps: [] as THREE.BufferGeometry[],
          ink: rings.map((rr) => circle(0.003, rr)),
        };
      }
      return {
        tire: revolve(tire, 0, Math.PI * 2, segs, deform),
        rim: revolve(rim, 0, Math.PI * 2, segs),
        caps: [] as THREE.BufferGeometry[],
        ink: [] as V3[][],
      };
    });
  }, [cut, pq, segs, tire, rim]);

  // group materials by tag: RUBBER, TREAD, LINER, METAL, CUT
  const tireMats = [mats.rubber, mats.tread, mats.liner, mats.rim, mats.cut];
  const solid = (mat: THREE.Material) => [mat, mats.fill];
  const spokeMats = solid(mats.spoke);
  const vb = WHEEL.valveBase;

  // standing on the ground, the rim drops by the section's lost height at the bottom
  const drop = grounded ? 0.34 * 0.5 * Math.max(0, Math.min(2, (1 - pq) / 0.25)) * radius : 0;
  return (
    <group position={[position[0], position[1] - drop, position[2]]} rotation={[0, yaw, 0]} scale={radius}>
      <mesh geometry={geo.tire} material={tireMats} castShadow receiveShadow />
      <mesh geometry={geo.rim} material={tireMats} castShadow receiveShadow />
      {geo.caps.map((g, i) => (
        <mesh key={i} geometry={g} material={mats.cut} receiveShadow />
      ))}
      {ink
        ? geo.ink.map((pts, i) => <InkLine key={i} points={pts} thickness={(low ? 0.02 : 0.011) / radius} />)
        : null}

      {/* the turning parts */}
      <group rotation={[spin, 0, 0]}>
        {/* hub, centre cap, axle, rotor */}
        <Axial a0={0.0} a1={0.235} r={WHEEL.hub} mats={spokeMats} low={low} />
        <Axial a0={0.235} a1={0.255} r={0.075} mats={solid(mats.dark)} low={low} />
        {axle ? <Axial a0={WHEEL.axleEnd} a1={0.0} r={0.055} mats={solid(mats.stem)} low={low} /> : null}
        {[0, 1, 2, 3, 4].map((k) => {
          const t = (k / 5) * Math.PI * 2;
          return (
            <group key={k} rotation={[t, 0, 0]}>
              {/* the spoke, from the hub (r 0.15) to the rim (r 0.59), on the wheel's face */}
              {spokeMats.map((mm, i) => (
                <mesh
                  key={i}
                  geometry={SPOKE}
                  material={mm}
                  position={[0.215, 0.37, 0]}
                  scale={[0.075, 0.44, 0.12]}
                  castShadow={i === 0}
                />
              ))}
              {/* lug nut */}
              <group rotation={[Math.PI / 5, 0, 0]}>
                <Axial a0={0.235} a1={0.265} r={0.022} mats={solid(mats.stem)} low y={0.105} />
              </group>
            </group>
          );
        })}
        {valve ? (
          <group rotation={[vb, 0, 0]}>
            <ValveStem mats={{valve: mats.valve, brass: mats.brass, stem: mats.stem, fill: mats.fill}} />
            <ClipGroup plane={plane} fill={mats.fill}>
              <group position={[WHEEL.sensor.a, WHEEL.sensor.r, 0]} scale={sensorScale}>
                {sensor}
              </group>
            </ClipGroup>
          </group>
        ) : null}
        {tick ? (
          <mesh position={[0.338, 0.84, 0]} material={mats.tick}>
            <boxGeometry args={[0.01, 0.12, 0.035]} />
          </mesh>
        ) : null}
        {toneRing ? (
          <group>
            {[...Array(36).keys()].map((k) => (
              <group key={k} rotation={[(k / 36) * Math.PI * 2, 0, 0]}>
                <mesh position={[0.25, 0.265, 0]} material={mats.tone}>
                  <boxGeometry args={[0.02, 0.04, 0.022]} />
                </mesh>
              </group>
            ))}
            <Axial a0={0.235} a1={0.26} r={0.245} mats={[mats.tone]} low />
          </group>
        ) : null}
      </group>
      {toneRing ? (
        // the pickup, fixed, just above the ring
        <mesh position={[0.27, 0.33, 0]} material={mats.dark}>
          <boxGeometry args={[0.06, 0.05, 0.05]} />
        </mesh>
      ) : null}
    </group>
  );
};

/** The valve stem in its own frame (angle 0 = +y): through the rim, a brass nut, the cap. */
const ValveStem: React.FC<{mats: {valve: THREE.Material; brass: THREE.Material; stem: THREE.Material; fill: THREE.Material}}> = ({
  mats,
}) => {
  const [a0, r0] = WHEEL.stem.from;
  const [a1, r1] = WHEEL.stem.to;
  const A = new THREE.Vector3(a0, r0, 0);
  const B = new THREE.Vector3(a1, r1, 0);
  const d = B.clone().sub(A);
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize());
  const mid = A.clone().addScaledVector(d, 0.5);
  const capQ = q;
  const C = new THREE.Vector3(WHEEL.cap[0], WHEEL.cap[1], 0);
  const nut = A.clone().addScaledVector(d, 0.3);
  return (
    <group>
      {[mats.stem, mats.fill].map((m, i) => (
        <mesh key={i} geometry={UNIT_CYL} material={m} position={mid} quaternion={q} scale={[0.017, d.length(), 0.017]} castShadow={i === 0} />
      ))}
      {[mats.brass, mats.fill].map((m, i) => (
        <mesh key={i} geometry={UNIT_CYL} material={m} position={nut} quaternion={q} scale={[0.03, 0.025, 0.03]} />
      ))}
      {[mats.valve, mats.fill].map((m, i) => (
        <mesh key={i} geometry={UNIT_CYL} material={m} position={C} quaternion={capQ} scale={[0.024, 0.06, 0.024]} castShadow={i === 0} />
      ))}
    </group>
  );
};

/**
 * Clips everything inside by the wheel's cut plane (the sensor, which brings its own materials), and
 * gives each clipped mesh a back-face twin in the cut colour, so its section shows as a cut face.
 */
const ClipGroup: React.FC<{plane: THREE.Plane; fill: THREE.Material; children: React.ReactNode}> = ({plane, fill, children}) => {
  const ref = useRef<THREE.Group>(null);
  useLayoutEffect(() => {
    ref.current?.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh || mesh.userData.clipFill) return;
      const ms = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      for (const mm of ms) if (!mm.clippingPlanes?.includes(plane)) mm.clippingPlanes = [plane];
      if (!mesh.userData.hasFill && !mesh.userData.glow) {
        const twin = new THREE.Mesh(mesh.geometry, fill);
        twin.userData.clipFill = true;
        mesh.add(twin);
        mesh.userData.hasFill = true;
      }
    });
  });
  return <group ref={ref}>{children}</group>;
};
