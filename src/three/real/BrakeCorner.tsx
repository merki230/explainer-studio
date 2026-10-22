import React, {useMemo} from 'react';
import {random} from 'remotion';
import * as THREE from 'three';
import {REAL} from '../../theme';
import {raw} from '../plaster';
import {cutMaterial, InkLine} from '../section/cutLook';
import {applyAlbedo, applyEnv, useAlbedo, useEnvStrength, useStudioEnv} from './useStudioEnv';

type V3 = [number, number, number];
type P2 = [number, number]; // [a, r]

/*
 * A brake corner in a wheel's own frame (No. 006; `RealWheel` with `brake`): radius-1 units, the axle
 * along x (outboard +x), a point at angle φ is (a, r cos φ, r sin φ). Inboard of the wheel's mid-plane
 * (a ≤ 0), so the 'mid' cut leaves it whole except where the wheel's cut-away wedge (φ in [w0, w1])
 * opens it: there everything is sectioned on two radial planes (cut faces hatched and inked), so the
 * vented disc shows its two friction plates and the vent between them, and the caliper (centred on
 * the wedge's first face, w0) shows its piston, both pads (steel backing plate and friction material,
 * `padThickness` thick) and the hairline gaps either side of the disc. Nothing touches: no clamping,
 * no heat glow. `rust` (0 → 1) spreads a light brown bloom over the disc's outboard swept face from
 * its edges in (theme `REAL.rust`, outside the reserved band).
 */

/** The corner's dimensions (radius-1 units; × 0.36 m on the car). */
export const BRAKE = {
  /** Disc: friction ring radii; outboard plate, vent, inboard plate (a). */
  r0: 0.27,
  r1: 0.47,
  outer: [-0.115, -0.09] as [number, number],
  inner: [-0.17, -0.145] as [number, number],
  vanes: 30,
  /** The pads' radial extent, the hairline gap to the disc, the backing plate's thickness. */
  pad: [0.3, 0.46] as [number, number],
  gap: 0.008,
  backing: 0.015,
  /** The caliper's half-span round the wheel (radians) and the pads'. */
  caliperSpan: 0.36,
  padSpan: 0.3,
};

/** Lathe a closed (a, r) profile about the wheel's axle between φ0 and φ1 (the wheel's convention). */
const PERM = new THREE.Matrix4().set(0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1);
export const revolveProfile = (pts: P2[], phi0: number, phi1: number, segs = 48) => {
  // counter-clockwise in the lathe's (r, a) plane, so the faces point outward
  const area = pts.reduce((s, [a, r], i) => {
    const [a2, r2] = pts[(i + 1) % pts.length];
    return s + r * a2 - r2 * a;
  }, 0);
  const ccw = area > 0 ? pts : [...pts].reverse();
  const closed = [...ccw, ccw[0]].map(([a, r]) => new THREE.Vector2(r, a));
  const g = new THREE.LatheGeometry(closed, Math.max(2, Math.round(segs)), phi0, phi1 - phi0);
  g.applyMatrix4(PERM);
  g.computeVertexNormals();
  return g;
};

/** A flat cap of an (a, r) profile in the radial plane at φ, nudged `off` along the turn (toward the opening). */
export const capProfile = (pts: P2[], phi: number, off: number) => {
  const shape = new THREE.Shape(pts.map(([a, r]) => new THREE.Vector2(a, r)));
  const g = new THREE.ShapeGeometry(shape);
  const p = g.getAttribute('position');
  const n = g.getAttribute('normal');
  const t = [0, -Math.sin(phi), Math.cos(phi)];
  const s = Math.sign(off) || 1;
  for (let i = 0; i < p.count; i++) {
    const a = p.getX(i);
    const r = p.getY(i);
    p.setXYZ(i, a, r * Math.cos(phi) + t[1] * off, r * Math.sin(phi) + t[2] * off);
    n.setXYZ(i, 0, t[1] * s, t[2] * s);
  }
  return g;
};

/** The ink outline of a cap (a little further out than the cap). */
export const capOutline = (pts: P2[], phi: number, off: number): V3[] => {
  const t = [0, -Math.sin(phi), Math.cos(phi)];
  return pts.map(([a, r]) => [a, r * Math.cos(phi) + t[1] * off, r * Math.sin(phi) + t[2] * off] as V3);
};

const rect = (a0: number, a1: number, r0: number, r1: number): P2[] => [
  [a0, r0],
  [a1, r0],
  [a1, r1],
  [a0, r1],
];

/** A flat annular sector in the plane x = a facing +x, polar UVs (u = φ / 2π, v 0 → 1 inside → out). */
const sector = (a: number, r0: number, r1: number, phi0: number, phi1: number, segs: number) => {
  const pos: number[] = [];
  const uv: number[] = [];
  const nrm: number[] = [];
  const index: number[] = [];
  for (let j = 0; j <= segs; j++) {
    const phi = phi0 + ((phi1 - phi0) * j) / segs;
    for (const [k, r] of [r0, r1].entries()) {
      pos.push(a, r * Math.cos(phi), r * Math.sin(phi));
      uv.push(-phi / (Math.PI * 2), k);
      nrm.push(1, 0, 0);
    }
  }
  for (let j = 0; j < segs; j++) {
    const i0 = j * 2;
    index.push(i0, i0 + 1, i0 + 2, i0 + 1, i0 + 3, i0 + 2);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nrm, 3));
  g.setIndex(index);
  return g;
};

/** A hex colour as sRGB bytes (0–1), for writing straight into an sRGB texture. */
const srgb = (hex: string) => {
  const v = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  return {r: v[0], g: v[1], b: v[2]};
};

/** The swept face: fine concentric machining marks on bare cast iron (no drilling). */
let faceTex: THREE.DataTexture | null = null;
const sweptTexture = () => {
  if (faceTex) return faceTex;
  const w = 8;
  const h = 256;
  const data = new Uint8Array(w * h * 4);
  const base = srgb(REAL.rotor);
  for (let j = 0; j < h; j++) {
    const v = j / h;
    const k = 0.92 + 0.05 * Math.sin(v * 420) + 0.03 * Math.sin(v * 97);
    for (let i = 0; i < w; i++) {
      const o = (j * w + i) * 4;
      data[o] = Math.round(255 * Math.min(1, k * base.r));
      data[o + 1] = Math.round(255 * Math.min(1, k * base.g));
      data[o + 2] = Math.round(255 * Math.min(1, k * base.b));
      data[o + 3] = 255;
    }
  }
  faceTex = new THREE.DataTexture(data, w, h, THREE.RGBAFormat);
  faceTex.colorSpace = THREE.SRGBColorSpace;
  faceTex.wrapS = THREE.RepeatWrapping;
  faceTex.magFilter = THREE.LinearFilter;
  faceTex.minFilter = THREE.LinearFilter;
  faceTex.needsUpdate = true;
  return faceTex;
};

/**
 * The rust bloom (colour + alpha): alpha = 1 − how far in from the nearer edge, broken up by seeded
 * blotches and specks, so an alpha test at 1 − rust grows it from the edges inward.
 */
let rustTex: THREE.DataTexture | null = null;
const rustTexture = () => {
  if (rustTex) return rustTex;
  const w = 512;
  const h = 64;
  const data = new Uint8Array(w * h * 4);
  const a = new THREE.Color().setRGB(...(Object.values(srgb(REAL.rust)) as [number, number, number]));
  const b = new THREE.Color().setRGB(...(Object.values(srgb(REAL.rustDark)) as [number, number, number]));
  // a coarse seeded value grid, smoothly interpolated (wraps round the disc)
  const G = [32, 6];
  const grid = [...Array(G[0] * G[1]).keys()].map((i) => random(`brake-rust-${i}`));
  const at = (u: number, v: number) => {
    const x = u * G[0];
    const y = v * (G[1] - 1);
    const x0 = Math.floor(x);
    const y0 = Math.min(G[1] - 2, Math.floor(y));
    const fx = x - x0;
    const fy = y - y0;
    const s = (q: number) => q * q * (3 - 2 * q);
    const g = (i: number, j: number) => grid[(j * G[0] + (((i % G[0]) + G[0]) % G[0])) % grid.length];
    const top = g(x0, y0) + (g(x0 + 1, y0) - g(x0, y0)) * s(fx);
    const bot = g(x0, y0 + 1) + (g(x0 + 1, y0 + 1) - g(x0, y0 + 1)) * s(fx);
    return top + (bot - top) * s(fy);
  };
  for (let j = 0; j < h; j++) {
    const v = (j + 0.5) / h;
    const edge = Math.min(v, 1 - v) * 2; // 0 at the edges, 1 in the middle of the band
    for (let i = 0; i < w; i++) {
      const u = (i + 0.5) / w;
      const n = at(u, v);
      const speck = random(`brake-speck-${i}-${j}`);
      const f = Math.max(0, Math.min(1, 0.72 * edge + 0.38 * (n - 0.5) + 0.14 * (speck - 0.5) + 0.12));
      const c = a.clone().lerp(b, Math.max(0, Math.min(1, 0.25 + 0.9 * (n - 0.5) + 0.3 * (speck - 0.5))));
      // darker pitting: a scatter of deep specks
      if (speck > 0.9) c.copy(b).multiplyScalar(0.7);
      const o = (j * w + i) * 4;
      data[o] = Math.round(255 * c.r);
      data[o + 1] = Math.round(255 * c.g);
      data[o + 2] = Math.round(255 * c.b);
      data[o + 3] = Math.round(255 * (1 - f));
    }
  }
  rustTex = new THREE.DataTexture(data, w, h, THREE.RGBAFormat);
  rustTex.colorSpace = THREE.SRGBColorSpace;
  rustTex.wrapS = THREE.RepeatWrapping;
  rustTex.magFilter = THREE.LinearFilter;
  rustTex.minFilter = THREE.LinearFilter;
  rustTex.needsUpdate = true;
  return rustTex;
};

export type BrakeCornerProps = {
  /** The opened wedge [w0, w1] (radians, w0 < w1): sectioned on both faces; the caliper sits on w0. */
  wedge: [number, number];
  /** False: no wedge, nothing sectioned; the disc whole, the caliper whole, centred on w0. Default true. */
  open?: boolean;
  /** The disc's turn (radians): its vanes and rust turn with it. */
  spin: number;
  /** Friction material thickness (radius-1 units; default 0.03 ≈ 11 mm on the car, 🎭 a thick, new pad). */
  padThickness?: number;
  /** Rust on the swept face, 0 (clean) → 1 (a light bloom across it). */
  rust?: number;
  /** The ink's thickness (radius-1 units). */
  ink: number;
  /** The wheel's lit metal materials (shared reflections and albedo). */
  mats: {disc: THREE.MeshPhysicalMaterial; caliper: THREE.Material; dark: THREE.Material};
  low?: boolean;
};

/** The brake corner (see the file comment). */
export const BrakeCorner: React.FC<BrakeCornerProps> = ({wedge, spin, padThickness = 0.03, rust = 0, ink, mats, low, open = true}) => {
  const [w0, w1] = wedge;
  const T = padThickness;
  const own = useMemo(
    () => ({
      cut: (() => {
        const m = cutMaterial();
        m.side = THREE.DoubleSide;
        return m;
      })(),
      face: new THREE.MeshPhysicalMaterial({color: raw('#ffffff'), metalness: 0.35, roughness: 0.5, map: sweptTexture()}),
      friction: new THREE.MeshPhysicalMaterial({color: raw(REAL.friction), roughness: 0.9, side: THREE.DoubleSide}),
      backing: new THREE.MeshPhysicalMaterial({color: raw(REAL.backing), metalness: 0.6, roughness: 0.45, side: THREE.DoubleSide}),
      rust: new THREE.MeshStandardMaterial({color: raw('#ffffff'), roughness: 0.95, map: rustTexture(), alphaTest: 1}),
    }),
    [],
  );
  const env = useStudioEnv();
  const envScale = useEnvStrength();
  const albedo = useAlbedo();
  applyEnv(
    env,
    [
      [own.face, 0.7],
      [own.backing, 0.6],
    ],
    envScale,
  );
  applyAlbedo([own.face, own.friction, own.backing, own.rust], albedo);
  const segs = low ? 48 : 128;
  const geo = useMemo(() => {
    const {r0, r1, outer, inner, pad, gap, backing} = BRAKE;
    const rest: [number, number] = open ? [w1, w0 + Math.PI * 2] : [0, Math.PI * 2];
    const disc = {outer: rect(outer[0], outer[1], r0, r1), inner: rect(inner[0], inner[1], r0, r1)};
    // the hat: a flange on the hub face, a short wall out to the outboard plate's inner edge
    const hat: P2[] = [
      [-0.004, 0.06],
      [-0.004, 0.255],
      [outer[1], 0.255],
      [outer[1], r0 + 0.012],
      [outer[0], r0 + 0.012],
      [outer[0], 0.232],
      [-0.03, 0.232],
      [-0.03, 0.06],
    ];
    const oF = outer[1] + gap;
    const pads = {
      outF: rect(oF, oF + T, pad[0], pad[1]),
      outB: rect(oF + T, oF + T + backing, pad[0], pad[1]),
      inF: rect(inner[0] - gap - T, inner[0] - gap, pad[0], pad[1]),
      inB: rect(inner[0] - gap - T - backing, inner[0] - gap - T, pad[0], pad[1]),
    };
    const pistonFace = inner[0] - gap - T - backing;
    const finger = oF + T + backing;
    const back = pistonFace - 0.125;
    const piston = rect(back + 0.035, pistonFace, 0.31, 0.45);
    const body: P2[] = [
      [back, 0.27],
      [back, 0.555],
      [finger + 0.035, 0.555],
      [finger + 0.035, 0.29],
      [finger, 0.29],
      [finger, 0.495],
      [pistonFace, 0.495],
      [pistonFace, 0.45],
      [back + 0.035, 0.45],
      [back + 0.035, 0.31],
      [pistonFace, 0.31],
      [pistonFace, 0.27],
    ];
    // the vent between the plates (a dark channel in the section)
    const vent = rect(outer[0] - 0.0005, inner[1] + 0.0005, r0 + 0.004, r1 - 0.004);
    // closed: the caliper and pads centred on w0, whole
    const c0 = w0 - BRAKE.caliperSpan;
    const c1 = open ? w0 : w0 + BRAKE.caliperSpan;
    // the pads sit just short of the cut, whole: their ends show friction material and backing plate as they are
    const p0 = w0 - BRAKE.padSpan;
    const p1 = open ? w0 - 0.014 : w0 + BRAKE.padSpan;
    const eps = 0.0012;
    // a narrow wedge (closing, `wedgeOpen`) cuts only part of the caliper's far half: that part stays,
    // sectioned at w1, so the caliper and pads grow back smoothly as the wedge closes
    const back2 = open && w1 < w0 + BRAKE.caliperSpan;
    const c2 = w0 + BRAKE.caliperSpan;
    const p2a = Math.max(w1 + 0.014, w0 + 0.014);
    const pads2 = open && p2a < w0 + BRAKE.padSpan;
    const solids: {g: THREE.BufferGeometry; m: 'disc' | 'caliper' | 'friction' | 'backing'}[] = [
      {g: revolveProfile(disc.outer, rest[0], rest[1], segs), m: 'disc'},
      {g: revolveProfile(disc.inner, rest[0], rest[1], segs), m: 'disc'},
      {g: revolveProfile(hat, rest[0], rest[1], segs), m: 'disc'},
      {g: revolveProfile(body, c0, c1, 24), m: 'caliper'},
      ...(open ? [{g: revolveProfile(piston, c0 + 0.1, w0, 16), m: 'backing' as const}] : []),
      ...(['outF', 'inF'] as const).map((k) => ({g: revolveProfile(pads[k], p0, p1, 16), m: 'friction' as const})),
      ...(['outB', 'inB'] as const).map((k) => ({g: revolveProfile(pads[k], p0, p1, 16), m: 'backing' as const})),
      ...(back2
        ? [
            {g: revolveProfile(body, w1, c2, 24), m: 'caliper' as const},
            ...(w1 < c2 - 0.1 ? [{g: revolveProfile(piston, w1, c2 - 0.1, 16), m: 'backing' as const}] : []),
          ]
        : []),
      ...(pads2
        ? [
            ...(['outF', 'inF'] as const).map((k) => ({g: revolveProfile(pads[k], p2a, w0 + BRAKE.padSpan, 16), m: 'friction' as const})),
            ...(['outB', 'inB'] as const).map((k) => ({g: revolveProfile(pads[k], p2a, w0 + BRAKE.padSpan, 16), m: 'backing' as const})),
          ]
        : []),
    ];
    // the caliper's and pads' far ends (not cut: their own material)
    const ends: {g: THREE.BufferGeometry; m: 'caliper' | 'friction' | 'backing'}[] = [
      {g: capProfile(body, c0, -eps), m: 'caliper'},
      ...(open ? [] : [{g: capProfile(body, c1, eps), m: 'caliper' as const}]),
      ...(['outF', 'inF'] as const).flatMap((k) => [
        {g: capProfile(pads[k], p0, -eps), m: 'friction' as const},
        {g: capProfile(pads[k], p1, eps), m: 'friction' as const},
      ]),
      ...(['outB', 'inB'] as const).flatMap((k) => [
        {g: capProfile(pads[k], p0, -eps), m: 'backing' as const},
        {g: capProfile(pads[k], p1, eps), m: 'backing' as const},
      ]),
      ...(back2 ? [{g: capProfile(body, c2, eps), m: 'caliper' as const}] : []),
      ...(pads2
        ? (['outF', 'inF', 'outB', 'inB'] as const).flatMap((k) => [
            {g: capProfile(pads[k], p2a, -eps), m: (k === 'outF' || k === 'inF' ? 'friction' : 'backing') as 'friction' | 'backing'},
            {g: capProfile(pads[k], w0 + BRAKE.padSpan, eps), m: (k === 'outF' || k === 'inF' ? 'friction' : 'backing') as 'friction' | 'backing'},
          ])
        : []),
    ];
    // the cut faces: on w0 the disc, hat, caliper and piston; on w1 the disc and hat
    const cutW0 = [disc.outer, disc.inner, hat, body, piston];
    const cutW1 = [disc.outer, disc.inner, hat, ...(back2 ? [body, ...(w1 < c2 - 0.1 ? [piston] : [])] : [])];
    const caps = open ? [...cutW0.map((p) => capProfile(p, w0, eps)), ...cutW1.map((p) => capProfile(p, w1, -eps))] : [];
    const inks = open ? [...cutW0.map((p) => capOutline(p, w0, 2 * eps)), ...cutW1.map((p) => capOutline(p, w1, -2 * eps))] : [];
    const vents = open ? [capProfile(vent, w0, eps * 0.5), capProfile(vent, w1, -eps * 0.5)] : [];
    return {
      solids,
      ends,
      caps,
      inks,
      vents,
      swept: sector(outer[1] + 0.0004, r0, r1, rest[0], rest[1], segs),
      rust: sector(outer[1] + 0.0009, r0 + 0.003, r1 - 0.003, rest[0], rest[1], segs),
      vane: new THREE.BoxGeometry(inner[1] - outer[0] - 0.002, r1 - r0 - 0.01, 0.012),
    };
  }, [w0, w1, T, segs, open]);

  const r = Math.max(0, Math.min(1, rust));
  // a light bloom: at 1 it covers the face but for a scatter of bare metal in the middle of the band
  own.rust.alphaTest = Math.min(0.999, 1.0005 - 0.9 * r);
  // the rust turns with the disc (u = −φ / 2π)
  own.rust.map!.offset.x = spin / (Math.PI * 2);
  const matOf = {disc: mats.disc, caliper: mats.caliper, friction: own.friction, backing: own.backing};
  const inWedge = (phi: number, m: number) => {
    const x = (((phi - w0) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    return x < w1 - w0 + m || x > Math.PI * 2 - m;
  };
  const mid = (BRAKE.r0 + BRAKE.r1) / 2;
  return (
    <group>
      {geo.solids.map((s, i) => (
        <mesh key={i} geometry={s.g} material={matOf[s.m]} castShadow receiveShadow />
      ))}
      {geo.ends.map((s, i) => (
        <mesh key={`e${i}`} geometry={s.g} material={matOf[s.m]} />
      ))}
      {geo.caps.map((g, i) => (
        <mesh key={`c${i}`} geometry={g} material={own.cut} receiveShadow />
      ))}
      {geo.vents.map((g, i) => (
        <mesh key={`v${i}`} geometry={g} material={mats.dark} />
      ))}
      {geo.inks.map((pts, i) => (
        <InkLine key={`i${i}`} points={pts} thickness={ink} />
      ))}
      {/* the swept face (machined cast iron) and the rust on it */}
      <mesh geometry={geo.swept} material={own.face} receiveShadow />
      <mesh geometry={geo.rust} material={own.rust} visible={r > 0.003} />
      {/* the vanes between the plates, turning (only where the disc is whole) */}
      {[...Array(BRAKE.vanes).keys()].map((k) => {
        const phi = spin + (k / BRAKE.vanes) * Math.PI * 2;
        if (open && inWedge(phi, 0.06)) return null;
        return (
          <mesh
            key={k}
            geometry={geo.vane}
            material={mats.disc}
            position={[(BRAKE.outer[0] + BRAKE.inner[1]) / 2, mid * Math.cos(phi), mid * Math.sin(phi)]}
            rotation={[phi, 0, 0]}
          />
        );
      })}
    </group>
  );
};
