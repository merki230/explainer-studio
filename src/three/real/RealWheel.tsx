import {useThree} from '@react-three/fiber';
import React, {useLayoutEffect, useMemo, useRef} from 'react';
import * as THREE from 'three';
import {fonts} from '../../fonts';
import {MOODS, REAL, section, type Mood} from '../../theme';
import {raw} from '../plaster';
import {cutMaterial, HATCH, InkLine} from '../section/cutLook';
import {useFontsLoaded} from '../section/useFontsLoaded';
import {ROTOR, rotorTexture, SIDE_BASE, SIDE_R0, sidewallTexture, TREAD_A, treadTexture} from './tireTextures';
import {applyAlbedo, applyEnv, useAlbedo, useEnvStrength, useStudioEnv} from './useStudioEnv';
import {BrakeCorner, capOutline, capProfile} from './BrakeCorner';

type V3 = [number, number, number];

/*
 * A realistic generic car wheel (No. 002; the hero of the video, so the most realistic thing in it),
 * built at radius 1 (≈ 317 mm, a 225/45 R17) and scaled:
 *  - the tire: a radial profile with a rim-protector rib and a slight sidewall bulge, four
 *    circumferential grooves (they notch the cut profile like the dashboard symbol), a procedural
 *    directional tread with sipes, moulded sidewall markings (size code, load, pressure, a date code;
 *    no brand), rubber with a satin sheen, an inner liner;
 *  - a two-tone alloy rim: five twin spokes with machined faces and gunmetal sides, machined lip,
 *    painted barrel, a centre cap, five chrome lug nuts (hex, with their seats);
 *  - a clamp-in metal valve stem (aluminium, hex nut, grommet, black cap) with the sensor on its
 *    inner end; on the car (`axle`) a cross-drilled brake rotor, its caliper and the axle stub.
 * Three cuts:
 *  - 'axle': cut through the axle plane, the half toward the camera removed (local z < 0). The tire's
 *    two cut profiles (top and bottom) read like the dashboard tire symbol.
 *  - 'mid': cut through the tire's mid-plane, the outboard half removed (local x > 0): the cavity
 *    shows all round, with the sensor on the rim well and the rotor turning behind (the car's near wheels).
 *  - 'none': whole.
 * Local frame: the axle is x (outboard +x), y up; a point at angle φ on the wheel is
 * (a, r cos φ, r sin φ), so φ = 0 is the top and the 'axle' cut keeps φ in [0, π].
 * The tire and rim are surfaces of revolution, so they never move: their patterns (tread, markings,
 * rotor face) are polar textures turned by an offset; the spokes, hub, valve, sensor and marks turn
 * with `spin`. Cut faces carry the section look.
 *
 * Motion: `motionBlur` (the angle turned while the shutter is open) swaps in tread, sidewall and rotor
 * textures box-blurred along the turn, and draws faint copies of the spokes and nuts across the arc,
 * so a turning wheel smears like footage instead of strobing.
 */

export type WheelCut = 'axle' | 'mid' | 'none';

/** Tags for each profile segment: what material it gets (the index into the tire's material array). */
const SIDE_OUT = 0;
const SIDE_IN = 1;
const TREAD = 2;
const LINER = 3;
const BARREL = 4;
const LIP = 5;
const CUT = 6;

type Pt = [number, number]; // [a, r]
type Profile = {pts: Pt[]; tags: number[]};

const mirror = (half: Pt[]): Pt[] => [...half, ...half.map(([a, r]) => [-a, r] as Pt).reverse()];

/** The tire's cross-section (a, r) with a tag per segment (from point i to i + 1). */
const tireProfile = (): Profile => {
  // the outside, inboard bead → over the tread → outboard bead (the inboard half, mirrored):
  // bead, up the rim flange, the rim-protector rib, the sidewall (widest ≈ r 0.85), the shoulder
  const side: Pt[] = [
    [-0.265, 0.66],
    [-0.3, 0.66],
    [-0.316, 0.7],
    [-0.336, 0.712],
    [-0.347, 0.728],
    [-0.344, 0.748],
    [-0.341, 0.775],
    [-0.344, 0.815],
    [-0.345, 0.85],
    [-0.341, 0.885],
    [-0.331, 0.915],
    [-0.314, 0.943],
    [-0.293, 0.966],
    [-0.268, 0.986],
    [-0.245, 0.997],
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
  const outside = mirror([...side, ...grooves]);
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
    if (i >= outside.length - 1) return i === pts.length - 1 || i === outside.length - 1 ? SIDE_IN : LINER;
    const q = pts[i + 1];
    if (p[1] >= 0.96 && q[1] >= 0.96 && Math.abs(p[0]) <= 0.25 && Math.abs(q[0]) <= 0.25) return TREAD;
    return p[0] + q[0] > 0 ? SIDE_OUT : SIDE_IN;
  });
  return {pts, tags};
};

/** The rim's cross-section (alloy, ≈ 0.03 thick): flanges, bead seats, the well. */
const rimProfile = (): Profile => {
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
  // the outboard flange (the lip the eye sees) is machined; the rest is the painted barrel
  return {pts, tags: pts.map((p, i) => (p[0] > 0.29 && pts[(i + 1) % pts.length][0] > 0.29 ? LIP : BARREL))};
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
const ccw = (p: Profile): Profile => {
  if (signedArea(p.pts) > 0) return p;
  const n = p.pts.length;
  const pts = [...p.pts].reverse();
  // segment i (pts[i] → pts[i+1]) of the reversed list is the old segment n − 2 − i
  const tags = pts.map((_, i) => p.tags[(n - 2 - i + n) % n]);
  return {pts, tags};
};

/** Clip a profile to a ≤ 0 (the 'mid' cut); the new edges on a = 0 are tagged CUT. */
const clipInboard = (p: Profile): Profile => {
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

/** Texture coordinates per tag: polar (u round the wheel) with v across the band the texture covers. */
const uvOf = (tag: number, a: number, r: number, phi: number, arc: number): [number, number] => {
  const u = phi / (Math.PI * 2);
  if (tag === TREAD) return [u, (a + TREAD_A) / (2 * TREAD_A)];
  // markings read clockwise from outside on both sidewalls: the outboard one runs the other way round
  if (tag === SIDE_OUT) return [-u, (r - SIDE_R0) / (1 - SIDE_R0)];
  if (tag === SIDE_IN) return [u, (r - SIDE_R0) / (1 - SIDE_R0)];
  return [u, arc];
};

/** A surface of revolution of a tagged profile between φ0 and φ1, one geometry group per tag. */
const revolve = (p: Profile, phi0: number, phi1: number, segs: number, deform?: Deform) => {
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
        uv.push(...uvOf(p.tags[i], E[0], E[1], phi, (k === 0 ? len[i] : len[i + 1]) / total));
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

/** A flat annulus in the plane x = a facing ±x, with polar texture coordinates (u round, v outward). */
const polarRing = (a: number, r0: number, r1: number, segs: number, facing: 1 | -1) =>
  memo(`ring:${a}:${r0}:${r1}:${segs}:${facing}`, () => {
    const pos: number[] = [];
    const uv: number[] = [];
    const nrm: number[] = [];
    const index: number[] = [];
    for (let j = 0; j <= segs; j++) {
      const phi = (j / segs) * Math.PI * 2;
      for (const [k, r] of [r0, r1].entries()) {
        pos.push(a, r * Math.cos(phi), r * Math.sin(phi));
        uv.push((facing > 0 ? -phi : phi) / (Math.PI * 2), k);
        nrm.push(facing, 0, 0);
      }
    }
    for (let j = 0; j < segs; j++) {
      const i0 = j * 2;
      if (facing > 0) index.push(i0, i0 + 1, i0 + 2, i0 + 1, i0 + 3, i0 + 2);
      else index.push(i0, i0 + 2, i0 + 1, i0 + 1, i0 + 2, i0 + 3);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(nrm, 3));
    g.setIndex(index);
    return g;
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
  /**
   * The angle (radians, signed like `spin`) the wheel turns while the shutter is open: the scene's
   * angular speed × shutter time (e.g. 0.5 frame). Above ≈ 1° the tread, markings and rotor smear
   * along the turn and faint copies of the spokes trail across the arc. Default 0 (sharp).
   */
  motionBlur?: number;
  /** Tire pressure, 1 full, ≈ 0.75 a quarter low: the bottom sags. */
  pressure?: number;
  /** Fewer segments (the car's far wheels, the Lab's rows). */
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
  /** The axle stub, brake rotor and caliper inboard (default false: a floating wheel has none; the car's wheels do). */
  axle?: boolean;
  /** The wheel stands on the ground: a soft tire's rim drops by the sag (the tire stays on the ground). */
  grounded?: boolean;
  /** Scale of the sensor on the rim (default 1; the floating wheel uses ≈ 1.25 so it reads at frame 0). */
  sensorScale?: number;
  /**
   * × the studio reflections on the rim, tire and rotor (default 1). A focus wheel in a dark place (a
   * car's near wheel in its own shadow at Night) keeps its spokes, lip and tread readable; it adds no light.
   */
  envBoost?: number;
  /** × the cut edges' ink thickness (default 1): a close-up keeps the ink ≈ 3 px (e.g. 0.25 at a contact patch). */
  inkScale?: number;
  /**
   * The brake corner in section (No. 006, `BrakeCorner`; with `axle`): a vented disc, the caliper with
   * its piston, two pads and their hairline gaps, instead of the cross-drilled rotor and block caliper.
   * With the 'mid' cut, `wedge` [w0, w1] (radians, the wheel's φ: 0 at the top, increasing toward local
   * +z) also opens the wheel's inner half there (tire, rim, disc sectioned on both faces; the caliper on
   * w0), showing the axle and what is behind it. `rust` 0 → 1 on the disc's swept face; `padThickness`
   * (radius-1 units, default 0.03). Default undefined (as before).
   */
  brake?: {wedge?: [number, number]; rust?: number; padThickness?: number; caliperAt?: number};
  /**
   * A performance wheel (No. 007 realism pass): the same outer radius on a rim ≈ 15% larger in a
   * low-profile tire (the sidewall's shoulder showing), everything inside the rim (spokes, hub, brake,
   * caliper) scaled up with it, the caliper painted `caliper`, and the face: 'split' (the five twin
   * spokes) or 'turbine' (ten thin curved blades, the brake showing between them). `face` / `side`: the
   * spokes' machined face and painted sides (theme tokens; default the alloy's). Cuts 'none' and 'mid'
   * (no wedge) only; otherwise ignored. Default none (as before).
   */
  sport?: {spokes: 'split' | 'turbine'; caliper: string; face?: string; side?: string};
  /**
   * The wheel ghosted (No. 007 `race-slice`): every material's opacity × this (0 → 1), so what stands behind
   * it (a drive unit) reads through in a close framing. Default none (as before); 1 restores it.
   */
  ghost?: number;
};

/** Ghost a material set (`ghost`): × opacity, transparent, no depth writes; restores each once back at 1. */
const ghostMaterials = (list: THREE.Material[], k: number) => {
  for (const m of list) {
    const u = m.userData as {ghostBase?: {opacity: number; transparent: boolean; depthWrite: boolean}};
    if (k < 0.999) {
      u.ghostBase ??= {opacity: m.opacity, transparent: m.transparent, depthWrite: m.depthWrite};
      if (!m.transparent) {
        m.transparent = true;
        m.needsUpdate = true;
      }
      m.opacity = u.ghostBase.opacity * k;
      m.depthWrite = false;
    } else if (u.ghostBase) {
      m.opacity = u.ghostBase.opacity;
      m.depthWrite = u.ghostBase.depthWrite;
      if (m.transparent !== u.ghostBase.transparent) {
        m.transparent = u.ghostBase.transparent;
        m.needsUpdate = true;
      }
      delete u.ghostBase;
    }
  }
};

/** The performance wheel's rim scale (`sport`): the bead seat from r 0.66 to 0.76. */
const SPORT_K = 0.76 / 0.66;
/** The low-profile tire (`sport`): the sidewall squeezed between the bigger bead (0.76) and the tread. */
const lowProfile: Deform = (a, r) => (r >= 0.655 ? [a, 0.76 + (r - 0.66) * (0.24 / 0.34)] : [a, r]);

const UNIT_CYL = new THREE.CylinderGeometry(1, 1, 1, 40);
const UNIT_CYL_LOW = new THREE.CylinderGeometry(1, 1, 1, 16);
const HEX = new THREE.CylinderGeometry(1, 1, 1, 6);
const CONE = new THREE.CylinderGeometry(0.55, 1, 1, 16);
const KNURL = new THREE.CylinderGeometry(1, 1, 1, 14);
/** A cylinder along the local x axis from a0 to a1. */
const Axial: React.FC<{
  a0: number;
  a1: number;
  r: number;
  mats: THREE.Material[];
  low?: boolean;
  y?: number;
  z?: number;
  geometry?: THREE.BufferGeometry;
}> = ({a0, a1, r, mats, low, y = 0, z = 0, geometry}) => (
  <>
    {mats.map((m, i) => (
      <mesh
        key={i}
        geometry={geometry ?? (low ? UNIT_CYL_LOW : UNIT_CYL)}
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

/**
 * One spoke arm as a tapered box: unit length along +y (−0.5 at the hub, 0.5 at the rim), narrower and
 * thinner toward the rim, set back (−x) at the rim so the face dishes in. Box groups: +x is the face.
 */
const ARM = (() => {
  const g = new THREE.BoxGeometry(1, 1, 1, 1, 4, 1);
  const p = g.getAttribute('position');
  for (let i = 0; i < p.count; i++) {
    const y = p.getY(i) + 0.5;
    p.setZ(i, p.getZ(i) * (1 - 0.3 * y));
    // the face slopes back toward the rim (a dished wheel)
    p.setX(i, p.getX(i) * (1 - 0.25 * y) - 0.6 * y);
  }
  g.computeVertexNormals();
  return g;
})();

/** The twin arms of the five spokes: [angle at the hub, angle at the rim] per arm, in the plane of angle 0. */
const ARMS: [number, number][] = [
  [-0.09, -0.16],
  [0.09, 0.16],
];
const ARM_R: [number, number] = [0.215, 0.628];

/** The five twin spokes and the lug nuts, in the turning frame (one set: the sharp one or a blur copy). */
const SpokeSet: React.FC<{
  face: THREE.Material;
  side: THREE.Material;
  nut: THREE.Material;
  fill?: THREE.Material;
  shadows?: boolean;
  /** Draw the lug nuts (the blur copies skip them: near the axis they barely move). */
  nuts?: boolean;
}> = ({face, side, nut, fill, shadows = false, nuts = true}) => {
  const armMats = [face, side, side, side, side, side];
  return (
    <>
      {[0, 1, 2, 3, 4].map((k) => {
        const t = (k / 5) * Math.PI * 2;
        return (
          <group key={k} rotation={[t, 0, 0]}>
            {ARMS.map(([h, rimAng], j) => {
              const S = new THREE.Vector2(ARM_R[0] * Math.cos(h), ARM_R[0] * Math.sin(h));
              const E = new THREE.Vector2(ARM_R[1] * Math.cos(rimAng), ARM_R[1] * Math.sin(rimAng));
              const mid = S.clone().add(E).multiplyScalar(0.5);
              const d = E.clone().sub(S);
              const ang = Math.atan2(d.y, d.x); // from +y toward +z
              return (
                <group key={j} position={[0.205, mid.x, mid.y]} rotation={[ang, 0, 0]}>
                  <mesh geometry={ARM} material={armMats} scale={[0.07, d.length(), 0.085]} castShadow={shadows} receiveShadow={shadows} />
                  {fill ? <mesh geometry={ARM} material={fill} scale={[0.07, d.length(), 0.085]} /> : null}
                </group>
              );
            })}
            {/* lug nut between two spokes: its conical seat, the hex, a domed end */}
            <group rotation={[Math.PI / 5, 0, 0]} visible={nuts}>
              <Axial a0={0.235} a1={0.25} r={0.036} mats={fill ? [nut, fill] : [nut]} low geometry={CONE} y={0.15} />
              <Axial a0={0.25} a1={0.282} r={0.031} mats={fill ? [nut, fill] : [nut]} geometry={HEX} y={0.15} />
              <Axial a0={0.282} a1={0.292} r={0.022} mats={fill ? [nut, fill] : [nut]} low y={0.15} />
            </group>
          </group>
        );
      })}
    </>
  );
};

/**
 * One turbine blade (`sport.spokes: 'turbine'`), in the turning frame at angle 0: a lofted strip from the hub
 * (r 0.21) out to the rim (r 0.64), sweeping 0.62 rad round as it goes, its face dishing back toward the rim,
 * narrower and thinner outward. Groups: 0 the face (+x), 1 the sides.
 */
const BLADE_GEO = (() => {
  const n = 14;
  const pos: number[] = [];
  const idx: number[] = [];
  const groups: [number, number, number][] = [];
  const ring = (i: number) => {
    const t = i / n;
    const r = 0.21 + 0.43 * t;
    const a = 0.62 * t ** 1.3;
    const w = 0.05 - 0.022 * t;
    const face = 0.235 - 0.075 * t;
    const d = 0.06 - 0.02 * t;
    // tangent direction round the wheel at angle a (in the y–z plane), its width across it
    const ty = -Math.sin(a);
    const tz = Math.cos(a);
    const cy = r * Math.cos(a);
    const cz = r * Math.sin(a);
    return [
      [face, cy - ty * w, cz - tz * w],
      [face, cy + ty * w, cz + tz * w],
      [face - d, cy + ty * w, cz + tz * w],
      [face - d, cy - ty * w, cz - tz * w],
    ];
  };
  const rings = [...Array(n + 1).keys()].map(ring);
  // each quad of the loft as its own 4 vertices (flat normals per side)
  const quad = (a: number[], b: number[], c: number[], d: number[]) => {
    const o = pos.length / 3;
    pos.push(...a, ...b, ...c, ...d);
    idx.push(o, o + 1, o + 2, o, o + 2, o + 3);
  };
  const start0 = idx.length;
  for (let i = 0; i < n; i++) quad(rings[i][0], rings[i + 1][0], rings[i + 1][1], rings[i][1]);
  groups.push([start0, idx.length - start0, 0]);
  const start1 = idx.length;
  for (let i = 0; i < n; i++) {
    quad(rings[i][1], rings[i + 1][1], rings[i + 1][2], rings[i][2]);
    quad(rings[i][3], rings[i + 1][3], rings[i + 1][0], rings[i][0]);
    quad(rings[i][2], rings[i + 1][2], rings[i + 1][3], rings[i][3]);
  }
  quad(rings[n][0], rings[n][3], rings[n][2], rings[n][1]);
  groups.push([start1, idx.length - start1, 1]);
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  for (const [st, c, m] of groups) g.addGroup(st, c, m);
  g.computeVertexNormals();
  return g;
})();
const BLADE_RING = new THREE.TorusGeometry(0.632, 0.022, 8, 96);

/** Ten curved blades from the hub to an outer ring (a turbine face) and the lug nuts, in the turning frame. */
const TurbineSet: React.FC<{
  face: THREE.Material;
  side: THREE.Material;
  nut: THREE.Material;
  fill?: THREE.Material;
  shadows?: boolean;
  nuts?: boolean;
}> = ({face, side, nut, fill, shadows = false, nuts = true}) => (
  <>
    {[...Array(10).keys()].map((k) => (
      <group key={k} rotation={[(k / 10) * Math.PI * 2, 0, 0]}>
        <mesh geometry={BLADE_GEO} material={[face, side]} castShadow={shadows} receiveShadow={shadows} />
        {fill ? <mesh geometry={BLADE_GEO} material={fill} /> : null}
      </group>
    ))}
    {/* the outer ring the blade tips meet, just inside the rim's lip */}
    <mesh geometry={BLADE_RING} material={side} position={[0.16, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
    {[0, 1, 2, 3, 4].map((k) => (
      <group key={k} rotation={[(k / 5) * Math.PI * 2 + Math.PI / 5, 0, 0]} visible={nuts}>
        <Axial a0={0.235} a1={0.25} r={0.036} mats={fill ? [nut, fill] : [nut]} low geometry={CONE} y={0.15} />
        <Axial a0={0.25} a1={0.282} r={0.031} mats={fill ? [nut, fill] : [nut]} geometry={HEX} y={0.15} />
        <Axial a0={0.282} a1={0.292} r={0.022} mats={fill ? [nut, fill] : [nut]} low y={0.15} />
      </group>
    ))}
  </>
);

/** Blur copies of the spokes: offsets across the shutter arc (fractions of `motionBlur`) and their opacity. */
const GHOSTS = [-0.5, -0.25, 0.25, 0.5].map((f) => ({f, k: 1 - Math.abs(f)}));

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
  motionBlur = 0,
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
  envBoost = 1,
  inkScale = 1,
  brake,
  sport: sportIn,
  ghost,
}) => {
  const gl = useThree((s) => s.gl);
  gl.localClippingEnabled = true;
  const env = useStudioEnv();
  const envScale = useEnvStrength();
  const albedo = useAlbedo();
  const ready = useFontsLoaded();
  const m = MOODS[mood];
  const segs = low ? 64 : 160;
  const pq = Math.round(pressure * 200) / 200;
  const blur = Math.abs(motionBlur) > 0.004 ? motionBlur : 0;

  const plane = useMemo(() => new THREE.Plane(), []);
  const mats = useMemo(() => {
    const phys = (c: string, o: THREE.MeshPhysicalMaterialParameters = {}) =>
      new THREE.MeshPhysicalMaterial({color: raw(c), ...o});
    const clipped = <T extends THREE.Material>(mat: T): T => {
      mat.clippingPlanes = [plane];
      return mat;
    };
    const cutFill = hatchedFill(plane);
    const cutFace = cutMaterial();
    cutFace.side = THREE.DoubleSide;
    // rubber: satin, a faint grazing sheen (moulded rubber), the markings lighter as they catch light
    const rubber = (o: THREE.MeshPhysicalMaterialParameters) =>
      phys(REAL.tire, {roughness: 0.66, sheen: 0.5, sheenRoughness: 0.42, sheenColor: raw('#9a9ea6'), ...o});
    const ghost = (c: string, o: THREE.MeshPhysicalMaterialParameters) =>
      clipped(phys(c, {transparent: true, depthWrite: false, opacity: 0, ...o}));
    return {
      sideOut: rubber({bumpScale: 2.2}),
      sideIn: rubber({bumpScale: 2.2}),
      tread: rubber({roughness: 0.84, sheen: 0.25, bumpScale: 4}),
      liner: phys(REAL.liner, {roughness: 0.95, side: THREE.DoubleSide}),
      barrel: phys(REAL.rim, {metalness: 0.45, roughness: 0.42}),
      lip: phys(REAL.rimMachined, {metalness: 0.6, roughness: 0.28, clearcoat: 0.4}),
      cut: cutFace,
      face: clipped(phys(REAL.rimMachined, {metalness: 0.6, roughness: 0.28, clearcoat: 0.4})),
      paint: clipped(phys(REAL.rimPaint, {metalness: 0.35, roughness: 0.38, clearcoat: 0.7, clearcoatRoughness: 0.25})),
      capMat: clipped(phys(REAL.labDark, {metalness: 0.3, roughness: 0.35, clearcoat: 0.8})),
      nut: clipped(phys(REAL.chrome, {metalness: 0.85, roughness: 0.2})),
      ghostFace: GHOSTS.map(() => ghost(REAL.rimMachined, {metalness: 0.6, roughness: 0.32})),
      ghostPaint: GHOSTS.map(() => ghost(REAL.rimPaint, {metalness: 0.35, roughness: 0.42})),
      ghostNut: GHOSTS.map(() => ghost(REAL.chrome, {metalness: 0.85, roughness: 0.25})),
      rotor: clipped(phys(REAL.rotor, {metalness: 0.6, roughness: 0.45})),
      rotorEdge: clipped(phys(REAL.rotor, {metalness: 0.6, roughness: 0.6})),
      hat: clipped(phys(REAL.rotor, {metalness: 0.5, roughness: 0.55})),
      caliper: clipped(phys(REAL.caliper, {metalness: 0.2, roughness: 0.45, clearcoat: 0.5})),
      dark: clipped(phys(REAL.labDark, {metalness: 0.4, roughness: 0.45})),
      valve: clipped(phys(REAL.valve, {roughness: 0.55})),
      stemAlu: clipped(phys(REAL.stemAlu, {metalness: 1, roughness: 0.32})),
      grommet: clipped(phys(REAL.grommet, {roughness: 0.8})),
      stem: clipped(phys(REAL.steel, {metalness: 1, roughness: 0.3})),
      tick: clipped(new THREE.MeshStandardMaterial({color: raw(REAL.tick), roughness: 0.7})),
      tone: clipped(phys(REAL.toneRing, {metalness: 0.8, roughness: 0.45})),
      fill: clipped(cutFill),
      brakeDisc: clipped(phys(REAL.rotor, {metalness: 0.6, roughness: 0.5, side: THREE.DoubleSide})),
      // the brake corner's caliper: bare cast iron, lighter than the painted block caliper, so its edge reads
      brakeCaliper: clipped(phys(REAL.steel, {metalness: 0.35, roughness: 0.55, side: THREE.DoubleSide})),
    };
  }, [plane]);
  mats.fill.color.copy(raw(section.cut)).multiplyScalar(0.8 / m.exposure);
  // the rubber's colour is the plain sidewall's; the texture's base grey is lifted back to 1
  for (const r of [mats.sideOut, mats.sideIn]) {
    if (!r.userData.lifted) {
      r.color.multiplyScalar(1 / SIDE_BASE);
      r.userData.lifted = true;
    }
  }
  // the polar textures (shared per blur bucket; each material turns its own copy by an offset)
  setMap(mats.tread, treadTexture(blur), -spin / (Math.PI * 2));
  const side = sidewallTexture(fonts.sans, ready, blur);
  setMap(mats.sideOut, side, spin / (Math.PI * 2));
  setMap(mats.sideIn, side, -spin / (Math.PI * 2));
  if (axle) setMap(mats.rotor, rotorTexture(blur), spin / (Math.PI * 2));
  const ghostK = Math.min(1, Math.abs(blur) / 0.05);
  GHOSTS.forEach((g, i) => {
    mats.ghostFace[i].opacity = 0.42 * g.k * ghostK;
    mats.ghostPaint[i].opacity = 0.42 * g.k * ghostK;
    mats.ghostNut[i].opacity = 0.42 * g.k * ghostK;
  });
  applyEnv(
    env,
    [
      [mats.lip, 1],
      [mats.face, 1],
      [mats.barrel, 0.7],
      [mats.paint, 0.7],
      [mats.capMat, 0.6],
      [mats.nut, 1.1],
      ...mats.ghostFace.map((g) => [g, 1] as [THREE.MeshStandardMaterial, number]),
      ...mats.ghostPaint.map((g) => [g, 0.7] as [THREE.MeshStandardMaterial, number]),
      ...mats.ghostNut.map((g) => [g, 1] as [THREE.MeshStandardMaterial, number]),
      [mats.rotor, 0.6],
      [mats.rotorEdge, 0.5],
      [mats.hat, 0.5],
      [mats.caliper, 0.5],
      [mats.brakeDisc, 0.5],
      [mats.brakeCaliper, 0.5],
      [mats.stemAlu, 1],
      [mats.stem, 1],
      [mats.dark, 0.4],
      [mats.sideOut, 0.22],
      [mats.sideIn, 0.22],
      [mats.tread, 0.12],
      [mats.tone, 0.5],
    ],
    envScale * envBoost,
  );
  applyAlbedo(
    [
      mats.sideOut,
      mats.sideIn,
      mats.tread,
      mats.liner,
      mats.barrel,
      mats.lip,
      mats.face,
      mats.paint,
      mats.capMat,
      mats.nut,
      ...mats.ghostFace,
      ...mats.ghostPaint,
      ...mats.ghostNut,
      mats.rotor,
      mats.rotorEdge,
      mats.hat,
      mats.caliper,
      mats.brakeDisc,
      mats.brakeCaliper,
      mats.dark,
      mats.valve,
      mats.stemAlu,
      mats.grommet,
      mats.stem,
    ],
    albedo,
  );

  // the clip plane in world space (keeps the remaining half)
  const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
  if (cut === 'axle') plane.setFromNormalAndCoplanarPoint(new THREE.Vector3(0, 0, 1).applyQuaternion(q), new THREE.Vector3(...position));
  else if (cut === 'mid')
    plane.setFromNormalAndCoplanarPoint(new THREE.Vector3(-1, 0, 0).applyQuaternion(q), new THREE.Vector3(...position).add(new THREE.Vector3(0.0005 * radius, 0, 0).applyQuaternion(q)));
  else plane.set(new THREE.Vector3(0, 1, 0), 1e6);

  const tire = useMemo(() => ccw(tireProfile()), []);
  const rim = useMemo(() => ccw(rimProfile()), []);
  const wedge = brake && axle && cut === 'mid' ? brake.wedge : undefined;
  const wedgeKey = wedge ? `${wedge[0].toFixed(4)},${wedge[1].toFixed(4)}` : '';
  // the performance wheel (cuts 'none' and 'mid' without a wedge)
  const sport = sportIn && (cut === 'none' || cut === 'mid') && !wedgeKey ? sportIn : undefined;
  const sk = sport ? SPORT_K : 1;
  const sportOn = !!sport;
  const sportKey = sport ? `${sport.caliper}|${sport.face ?? ''}|${sport.side ?? ''}` : '';
  const sportMats = useMemo(() => {
    if (!sport) return null;
    const phys = (c: string, o: THREE.MeshPhysicalMaterialParameters = {}) =>
      new THREE.MeshPhysicalMaterial({color: raw(c), ...o});
    const clipped = <T extends THREE.Material>(mat: T): T => {
      mat.clippingPlanes = [plane];
      return mat;
    };
    return {
      caliper: clipped(phys(sport.caliper, {metalness: 0.15, roughness: 0.35, clearcoat: 0.8, clearcoatRoughness: 0.2})),
      // two-sided: the turbine's lofted blades are open strips
      face: clipped(phys(sport.face ?? REAL.rimMachined, {metalness: 0.6, roughness: 0.3, clearcoat: 0.5, side: THREE.DoubleSide})),
      side: clipped(
        phys(sport.side ?? REAL.rimPaint, {metalness: 0.4, roughness: 0.38, clearcoat: 0.7, clearcoatRoughness: 0.25, side: THREE.DoubleSide}),
      ),
      ghostFace: GHOSTS.map(() =>
        clipped(phys(sport.face ?? REAL.rimMachined, {metalness: 0.6, roughness: 0.32, transparent: true, depthWrite: false, opacity: 0})),
      ),
      ghostSide: GHOSTS.map(() =>
        clipped(phys(sport.side ?? REAL.rimPaint, {metalness: 0.4, roughness: 0.42, transparent: true, depthWrite: false, opacity: 0})),
      ),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plane, sportKey]);
  if (sportMats) {
    applyEnv(
      env,
      [
        [sportMats.caliper, 0.6],
        [sportMats.face, 1],
        [sportMats.side, 0.7],
        ...sportMats.ghostFace.map((g) => [g, 1] as [THREE.MeshStandardMaterial, number]),
        ...sportMats.ghostSide.map((g) => [g, 0.7] as [THREE.MeshStandardMaterial, number]),
      ],
      envScale * envBoost,
    );
    applyAlbedo([sportMats.caliper, sportMats.face, sportMats.side, ...sportMats.ghostFace, ...sportMats.ghostSide], albedo);
    GHOSTS.forEach((g, i) => {
      sportMats.ghostFace[i].opacity = 0.42 * g.k * ghostK;
      sportMats.ghostSide[i].opacity = 0.42 * g.k * ghostK;
    });
  }
  if (ghost !== undefined) {
    const gk = Math.max(0, Math.min(1, ghost));
    // the spokes' blur copies are already transparent and re-set every frame: scale them in place
    const blurCopies = new Set<THREE.Material>([
      ...mats.ghostFace,
      ...mats.ghostPaint,
      ...mats.ghostNut,
      ...(sportMats ? [...sportMats.ghostFace, ...sportMats.ghostSide] : []),
    ]);
    const all: THREE.Material[] = [];
    for (const v of [...Object.values(mats), ...(sportMats ? Object.values(sportMats) : [])])
      for (const m of Array.isArray(v) ? v : [v]) if (!blurCopies.has(m)) all.push(m);
    ghostMaterials(all, gk);
    for (const m of blurCopies) m.opacity *= gk;
  }
  const geo = useMemo(() => {
    const sag = sagDeform(pq);
    const deform: Deform = sport
      ? (a, r, phi) => {
          const [a1, r1] = sag(a, r, phi);
          return lowProfile(a1, r1, phi);
        }
      : sag;
    const rimDeform: Deform | undefined = sport ? (a, r) => [a, r * SPORT_K] : undefined;
    const key = `${cut}:${pq}:${segs}:${wedgeKey}${sport ? ':sport' : ''}`;
    return memo(key, () => {
      if (cut === 'mid' && wedgeKey) {
        // the inner half, opened over the wedge: both wedge faces are cut faces, inked
        const [w0, w1] = wedgeKey.split(',').map(Number);
        const t = clipInboard(tire);
        const r = clipInboard(rim);
        const rings = [...t.pts, ...r.pts].filter(([a]) => Math.abs(a) < 1e-9).map(([, rr]) => rr);
        const arcs = rings.map((rr) => {
          const n = 96;
          return [...Array(n + 1).keys()].map((i) => {
            const phi = w1 + ((w0 + Math.PI * 2 - w1) * i) / n;
            return [0.003, rr * Math.cos(phi), rr * Math.sin(phi)] as V3;
          });
        });
        return {
          tire: revolve(t, w1, w0 + Math.PI * 2, segs, deform),
          rim: revolve(r, w1, w0 + Math.PI * 2, segs),
          caps: [capProfile(t.pts, w0, 0.0008), capProfile(t.pts, w1, -0.0008), capProfile(r.pts, w0, 0.0008), capProfile(r.pts, w1, -0.0008)],
          ink: [
            capOutline(t.pts, w0, 0.002),
            capOutline(t.pts, w1, -0.002),
            capOutline(r.pts, w0, 0.002),
            capOutline(r.pts, w1, -0.002),
          ],
          arcs,
        };
      }
      if (cut === 'axle') {
        return {
          tire: revolve(tire, 0, Math.PI, segs, deform),
          rim: revolve(rim, 0, Math.PI, segs),
          caps: [cap(tire.pts, 0, deform), cap(tire.pts, Math.PI, deform), cap(rim.pts, 0), cap(rim.pts, Math.PI)],
          ink: [capInk(tire.pts, 0, deform), capInk(tire.pts, Math.PI, deform), capInk(rim.pts, 0), capInk(rim.pts, Math.PI)],
          arcs: [] as V3[][],
        };
      }
      if (cut === 'mid') {
        const t = clipInboard(tire);
        const r = clipInboard(rim);
        const rings = sport
          ? [
              ...t.pts.filter(([a]) => Math.abs(a) < 1e-9).map(([, rr]) => lowProfile(0, rr, 0)[1]),
              ...r.pts.filter(([a]) => Math.abs(a) < 1e-9).map(([, rr]) => rr * SPORT_K),
            ]
          : [...t.pts, ...r.pts].filter(([a]) => Math.abs(a) < 1e-9).map(([, rr]) => rr);
        return {
          tire: revolve(t, 0, Math.PI * 2, segs, deform),
          rim: revolve(r, 0, Math.PI * 2, segs, rimDeform),
          caps: [] as THREE.BufferGeometry[],
          ink: rings.map((rr) => circle(0.003, rr)),
          arcs: [] as V3[][],
        };
      }
      return {
        tire: revolve(tire, 0, Math.PI * 2, segs, deform),
        rim: revolve(rim, 0, Math.PI * 2, segs, rimDeform),
        caps: [] as THREE.BufferGeometry[],
        ink: [] as V3[][],
        arcs: [] as V3[][],
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cut, pq, segs, tire, rim, wedgeKey, sportOn]);

  // group materials by tag: SIDE_OUT, SIDE_IN, TREAD, LINER, BARREL, LIP, CUT
  const tireMats = [mats.sideOut, mats.sideIn, mats.tread, mats.liner, mats.barrel, mats.lip, mats.cut];
  const solid = (mat: THREE.Material) => [mat, mats.fill];
  const vb = WHEEL.valveBase;
  // only on whole wheels: on a cut wheel the copies of clipped spokes read as broken glass at the cut
  const showGhosts = ghostK > 0.02 && cut === 'none';

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
        ? geo.ink.map((pts, i) => <InkLine key={i} points={pts} thickness={((low ? 0.02 : 0.011) * inkScale) / radius} />)
        : null}
      {ink
        ? geo.arcs.map((pts, i) => (
            <InkLine key={`a${i}`} points={pts} closed={false} thickness={((low ? 0.02 : 0.011) * inkScale) / radius} />
          ))
        : null}
      <group scale={sport ? [1, sk, sk] : undefined}>
      {axle && brake ? (
        <BrakeCorner
          wedge={wedge ?? [brake.caliperAt ?? -2.1, -0.45]}
          open={!!wedge}
          spin={spin}
          rust={brake.rust}
          padThickness={brake.padThickness}
          ink={((low ? 0.02 : 0.011) * inkScale) / radius}
          mats={{disc: mats.brakeDisc, caliper: sportMats ? sportMats.caliper : mats.brakeCaliper, dark: mats.dark}}
          low={low}
        />
      ) : null}

      {axle && !brake ? (
        // the caliper: fixed, straddling the rotor at the back of the wheel (local +z), upper half
        <group rotation={[0.95, 0, 0]}>
          <mesh position={[-0.075, 0.42, 0]} material={sportMats ? sportMats.caliper : mats.caliper} castShadow>
            <boxGeometry args={[0.15, 0.13, 0.3]} />
          </mesh>
          <mesh position={[-0.075, 0.42, 0]} material={mats.fill}>
            <boxGeometry args={[0.15, 0.13, 0.3]} />
          </mesh>
        </group>
      ) : null}

      {/* the turning parts */}
      <group rotation={[spin, 0, 0]}>
        {/* hub barrel, the centre disc the spokes meet, the centre cap */}
        <Axial a0={0.12} a1={0.2} r={WHEEL.hub} mats={solid(mats.paint)} low={low} />
        <Axial a0={0.2} a1={0.236} r={0.23} mats={solid(mats.paint)} low={low} />
        <Axial a0={0.236} a1={0.25} r={0.085} mats={solid(mats.capMat)} low={low} />
        <Axial a0={0.25} a1={0.256} r={0.062} mats={solid(mats.face)} low={low} />
        {axle ? (
          <>
            {/* the axle stub ends just inside the cut plane (no coplanar faces to flicker) */}
            <Axial a0={WHEEL.axleEnd} a1={-0.004} r={0.055} mats={solid(mats.stem)} low={low} />
          </>
        ) : null}
        {axle && !brake ? (
          <>
            <Axial a0={0.0} a1={0.12} r={0.1} mats={solid(mats.hat)} low={low} />
            {/* the rotor: its hat on the hub, the cross-drilled friction ring, its vented edge */}
            <Axial a0={-0.03} a1={-0.004} r={0.25} mats={solid(mats.hat)} low={low} />
            <mesh geometry={polarRing(-0.03, ROTOR.r0, ROTOR.r1, low ? 64 : 128, 1)} material={mats.rotor} receiveShadow />
            <mesh geometry={polarRing(-0.11, ROTOR.r0, ROTOR.r1, low ? 64 : 128, -1)} material={mats.rotorEdge} />
            <Axial a0={-0.11} a1={-0.03} r={ROTOR.r1} mats={[mats.rotorEdge]} low={low} />
          </>
        ) : null}
        {sportMats && sport?.spokes === 'turbine' ? (
          <TurbineSet face={sportMats.face} side={sportMats.side} nut={mats.nut} fill={mats.fill} shadows />
        ) : sportMats ? (
          <SpokeSet face={sportMats.face} side={sportMats.side} nut={mats.nut} fill={mats.fill} shadows />
        ) : (
          <SpokeSet face={mats.face} side={mats.paint} nut={mats.nut} fill={mats.fill} shadows />
        )}
        {valve ? (
          <group rotation={[vb, 0, 0]}>
            <ValveStem mats={{valve: mats.valve, alu: mats.stemAlu, grommet: mats.grommet, fill: mats.fill}} />
            <ClipGroup plane={plane} fill={mats.fill}>
              <group position={[WHEEL.sensor.a, WHEEL.sensor.r, 0]} scale={sensorScale}>
                {sensor}
              </group>
            </ClipGroup>
          </group>
        ) : null}
        {tick ? (
          <mesh position={[0.346, 0.84, 0]} material={mats.tick}>
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
      {/* the spokes' motion blur: faint copies across the arc turned while the shutter is open */}
      {showGhosts
        ? GHOSTS.map((g, i) => (
            <group key={i} rotation={[spin + g.f * blur, 0, 0]}>
              {sportMats && sport?.spokes === 'turbine' ? (
                <TurbineSet face={sportMats.ghostFace[i]} side={sportMats.ghostSide[i]} nut={mats.ghostNut[i]} nuts={false} />
              ) : sportMats ? (
                <SpokeSet face={sportMats.ghostFace[i]} side={sportMats.ghostSide[i]} nut={mats.ghostNut[i]} nuts={false} />
              ) : (
                <SpokeSet face={mats.ghostFace[i]} side={mats.ghostPaint[i]} nut={mats.ghostNut[i]} nuts={false} />
              )}
            </group>
          ))
        : null}
      {toneRing ? (
        // the pickup, fixed, just above the ring
        <mesh position={[0.27, 0.33, 0]} material={mats.dark}>
          <boxGeometry args={[0.06, 0.05, 0.05]} />
        </mesh>
      ) : null}
      </group>
    </group>
  );
};

/**
 * The section of a turning part, seen through the cut: its back faces drawn flat in the cut colour
 * with the section hatch laid in the cut plane (so a cut hub or spoke reads like the tire's cut
 * faces, not as a lit curved surface).
 */
const hatchedFill = (plane: THREE.Plane) => {
  const m = new THREE.MeshBasicMaterial({color: raw(section.cut), side: THREE.BackSide});
  const nrm = {value: plane.normal};
  m.onBeforeCompile = (shader) => {
    shader.uniforms.hatch = {value: new THREE.Vector3(HATCH.spacing, HATCH.halfWidth, HATCH.darken)};
    shader.uniforms.cutN = nrm;
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vHatchPos;')
      .replace('#include <project_vertex>', '#include <project_vertex>\nvHatchPos = (modelMatrix * vec4(transformed, 1.0)).xyz;');
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vHatchPos;\nuniform vec3 hatch;\nuniform vec3 cutN;')
      .replace(
        '#include <color_fragment>',
        `#include <color_fragment>
        {
          vec3 n = normalize(cutN);
          vec3 t1 = normalize(cross(n, abs(n.y) < 0.9 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0)));
          vec3 t2 = cross(n, t1);
          float d = (dot(vHatchPos, t1) + dot(vHatchPos, t2)) / hatch.x;
          float f = abs(fract(d) - 0.5);
          float w = fwidth(d);
          float line = 1.0 - smoothstep(hatch.y - w, hatch.y + w, f);
          line *= 1.0 - smoothstep(0.25, 0.5, w);
          diffuseColor.rgb *= 1.0 - hatch.z * line;
        }`,
      );
  };
  m.customProgramCacheKey = () => 'wheel-cut-fill-hatch';
  return m;
};

/** Give a material its own copy of a shared texture (re-copied when the shared one changes), turned by `offset`. */
const setMap = (mat: THREE.MeshPhysicalMaterial, shared: THREE.Texture, offset: number) => {
  if (mat.userData.mapSource !== shared) {
    const own = shared.clone();
    own.needsUpdate = true;
    const had = !!mat.map;
    mat.map = own;
    mat.bumpMap = own;
    mat.userData.mapSource = shared;
    if (!had) mat.needsUpdate = true;
  }
  mat.map!.offset.x = offset;
};

/**
 * The clamp-in valve stem in its own frame (angle 0 = +y): an aluminium stem through the rim with a
 * rubber grommet against the well, the hex nut outside, a knurled black cap; inside, the stem's
 * root meets the sensor's boss.
 */
const ValveStem: React.FC<{mats: {valve: THREE.Material; alu: THREE.Material; grommet: THREE.Material; fill: THREE.Material}}> = ({
  mats,
}) => {
  const [a0, r0] = WHEEL.stem.from;
  const [a1, r1] = WHEEL.stem.to;
  const A = new THREE.Vector3(a0, r0, 0);
  const B = new THREE.Vector3(a1, r1, 0);
  const d = B.clone().sub(A);
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize());
  const at = (k: number) => A.clone().addScaledVector(d, k);
  const C = new THREE.Vector3(WHEEL.cap[0], WHEEL.cap[1], 0);
  const part = (geometry: THREE.BufferGeometry, mat: THREE.Material, p: THREE.Vector3, s: V3, shadow = false) =>
    [mat, mats.fill].map((mm, i) => (
      <mesh key={i} geometry={geometry} material={mm} position={p} quaternion={q} scale={s} castShadow={shadow && i === 0} />
    ));
  return (
    <group>
      {part(UNIT_CYL, mats.alu, at(0.5), [0.016, d.length(), 0.016], true)}
      {/* the grommet where the stem passes the rim, the hex nut outside it, a washer */}
      {part(UNIT_CYL, mats.grommet, at(0.2), [0.026, 0.02, 0.026])}
      {part(HEX, mats.alu, at(0.3), [0.031, 0.026, 0.031], true)}
      {part(UNIT_CYL, mats.alu, at(0.255), [0.029, 0.006, 0.029])}
      {/* the cap: knurled black plastic */}
      {part(KNURL, mats.valve, C, [0.021, 0.058, 0.021], true)}
      {part(UNIT_CYL, mats.valve, C.clone().addScaledVector(d.clone().normalize(), 0.031), [0.017, 0.006, 0.017])}
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
      if (!mesh.userData.hasFill && !mesh.userData.glow && !mesh.userData.noFill) {
        const twin = new THREE.Mesh(mesh.geometry, fill);
        twin.userData.clipFill = true;
        mesh.add(twin);
        mesh.userData.hasFill = true;
      }
    });
  });
  return <group ref={ref}>{children}</group>;
};
