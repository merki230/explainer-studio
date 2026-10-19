import {useThree} from '@react-three/fiber';
import React, {useMemo} from 'react';
import * as THREE from 'three';
import {HIGHWAY, section} from '../../theme';
import {raw} from '../plaster';
import {cutMaterial, INK} from './cutLook';
import {HIGHWAY_LAYOUT} from './HighwaySlice';

type P2 = [number, number];
type V3 = [number, number, number];

/*
 * The groove row cut lengthwise (No. 005, the car slice's highway road): the road block's front cut face
 * runs along the row's centreline, so its top edge is a longitudinal section of the milled scoops, a
 * line of shallow curved dips (½ in deep, 7 in long, 12 in centre to centre, the arc of the milling
 * drum). The road runs along x and streams toward −x as the car drives (+x); `scroll` is the distance
 * travelled. Behind each dip its scoop runs back from the cut to the row's inner edge, so a dip reads
 * as a hollow, not a notch in a wall. The pure functions here (the profile, the tire's drop) are shared
 * by the scene, which draws the tire, the flashes and the trapped air.
 */

const G = HIGHWAY_LAYOUT.groove;
export const GROOVE = {
  period: G.period,
  length: G.length,
  depth: G.depth,
  /** The drum radius from the chord (the groove length) and depth. */
  drum: (G.length * G.length) / 4 / (2 * G.depth) + G.depth / 2,
  /** The row's half-width across the road (the cut runs down its middle). */
  half: (G.x1 - G.x0) / 2,
};

/** Signed distance (along x) from x to the nearest groove centre, for a road scrolled by `s`. */
export const grooveOffset = (x: number, s: number) => {
  const u = -x - s;
  return u - Math.round(u / GROOVE.period) * GROOVE.period;
};

/** The road's top on the cut at x (≤ 0 inside a dip), the dips' depth scaled by `amp` (0 flat → 1). */
export const profileY = (x: number, s: number, amp = 1) => {
  const dx = grooveOffset(x, s);
  if (Math.abs(dx) >= GROOVE.length / 2 || amp <= 0) return 0;
  const R = GROOVE.drum;
  return amp * (-GROOVE.depth + R - Math.sqrt(R * R - dx * dx));
};

/**
 * How far a tire of radius `r` centred over x = `xw` sinks into the dips (≥ 0): the rigid circle
 * resting on the profile (it bridges a dip and settles on its edges, ≈ 11 mm of the 12.7).
 */
export const tireDrop = (xw: number, s: number, r: number, amp = 1) => {
  if (amp <= 0) return 0;
  let c = -Infinity;
  const span = GROOVE.length * 0.75;
  for (let i = 0; i <= 48; i++) {
    const x = xw - span + (2 * span * i) / 48;
    const dx = x - xw;
    c = Math.max(c, profileY(x, s, amp) + Math.sqrt(Math.max(0, r * r - dx * dx)));
  }
  return Math.max(0, r - c);
};

/** One period of the profile's top edge (x from 0 to P, the groove centred at 0 and P), `n` points per dip. */
const dipPoints = (amp: number, n = 14): P2[] => {
  const P = GROOVE.period;
  const h = GROOVE.length / 2;
  const R = GROOVE.drum;
  const y = (dx: number) => amp * (-GROOVE.depth + R - Math.sqrt(R * R - dx * dx));
  const pts: P2[] = [];
  // the second half of the dip at 0, the flat, the first half of the dip at P
  for (let i = 0; i <= n / 2; i++) {
    const dx = (h * i) / (n / 2);
    pts.push([dx, y(dx)]);
  }
  for (let i = 0; i <= n / 2; i++) {
    const dx = -h + (h * i) / (n / 2);
    pts.push([P + dx, y(dx)]);
  }
  return pts;
};

/** The top edge from x0 to x1 for phase 0 (groove centres at x = k·P). */
const edgePoints = (x0: number, x1: number, amp: number): P2[] => {
  const P = GROOVE.period;
  const k0 = Math.floor(x0 / P);
  const k1 = Math.ceil(x1 / P);
  const one = dipPoints(amp);
  const out: P2[] = [];
  for (let k = k0; k < k1; k++) for (const [x, y] of one) out.push([x + k * P, y]);
  return out;
};

/** A tube along a polyline in the plane z (ink), with its own material (so it can be clipped). */
const inkTube = (pts: P2[], z: number, th: number) => {
  const path = new THREE.CurvePath<THREE.Vector3>();
  for (let i = 0; i < pts.length - 1; i++)
    path.add(
      new THREE.LineCurve3(
        new THREE.Vector3(pts[i][0], pts[i][1], z),
        new THREE.Vector3(pts[i + 1][0], pts[i + 1][1], z),
      ),
    );
  return new THREE.TubeGeometry(path, Math.max(8, pts.length * 2), th / 2, 4, false);
};

/** The deepest the dips are drawn (× the real ½ in): the illustrative scale's ceiling. */
export const MAX_AMP = 3;

export type GrooveCutProps = {
  /** Distance the road has travelled (m): the dips stream toward −x. */
  scroll: number;
  /** The dips' depth, 0 (the cut is off the row: flat) → 1 (on its centreline); above 1 an illustrative deepening (up to `MAX_AMP`). */
  amp?: number;
  /** The road block's ends (x), its depth below the road, and the cut plane (z). */
  x0: number;
  x1: number;
  depth: number;
  z: number;
  /** × the ink thickness (default 1; the scene thins it in a close-up so a ½ in dip isn't drowned by a 3 px line). */
  ink?: number;
};

/**
 * The road block's front cut face along the groove row (see the file comment): hatched, its top edge
 * the dip profile with an ink line, the scoops behind each dip; clipped to the block's ends.
 */
export const GrooveCut: React.FC<GrooveCutProps> = ({scroll, amp = 1, x0, x1, depth, z, ink = 1}) => {
  const gl = useThree((s) => s.gl);
  gl.localClippingEnabled = true;
  const P = GROOVE.period;
  const ampQ = Math.round(Math.max(0, Math.min(MAX_AMP, amp)) * 20) / 20;
  // quantized, so a push-in rebuilds the ink tube a handful of times, not every frame
  const inkT = INK * Math.max(0.2, Math.round(ink * 20) / 20);
  const planes = useMemo(
    () => [new THREE.Plane(new THREE.Vector3(1, 0, 0), -x0), new THREE.Plane(new THREE.Vector3(-1, 0, 0), x1)],
    [x0, x1],
  );
  const mats = useMemo(() => {
    const cut = cutMaterial();
    cut.clippingPlanes = planes;
    const milled = new THREE.MeshStandardMaterial({
      color: raw(HIGHWAY.milled),
      roughness: 1,
      side: THREE.DoubleSide,
      clippingPlanes: planes,
    });
    const ink = new THREE.MeshBasicMaterial({color: raw(section.cutLine), clippingPlanes: planes});
    const inkFixed = new THREE.MeshBasicMaterial({color: raw(section.cutLine)});
    return {cut, milled, ink, inkFixed, plain: cutMaterial()};
  }, [planes]);

  // the moving strip: one extra period each side, shifted by the scroll (mod P) and clipped at the ends
  const geo = useMemo(() => {
    const a = x0 - P;
    const b = x1 + P;
    const top = edgePoints(a, b, ampQ);
    const bottom = -GROOVE.depth * MAX_AMP - 0.002;
    const strip = new THREE.ShapeGeometry(
      new THREE.Shape([[a, bottom] as P2, ...top, [b, bottom] as P2].map(([x, y]) => new THREE.Vector2(x, y))),
    );
    // the scoops: the drum arc under each dip, run back from the cut to the row's inner edge, and its end wall
    const back = GROOVE.half;
    const pos: number[] = [];
    const idx: number[] = [];
    const wall: number[] = [];
    const wIdx: number[] = [];
    const k0 = Math.floor(a / P);
    const k1 = Math.ceil(b / P);
    const n = 14;
    const R = GROOVE.drum;
    const h = GROOVE.length / 2;
    for (let k = k0; k <= k1; k++) {
      const base = pos.length / 3;
      const wb = wall.length / 3;
      for (let i = 0; i <= n; i++) {
        const dx = -h + (2 * h * i) / n;
        const y = ampQ * (-GROOVE.depth + R - Math.sqrt(R * R - dx * dx));
        pos.push(k * P + dx, y, 0, k * P + dx, y, -back);
        wall.push(k * P + dx, y, -back, k * P + dx, 0, -back);
      }
      for (let i = 0; i < n; i++) {
        const q = base + 2 * i;
        idx.push(q, q + 2, q + 1, q + 1, q + 2, q + 3);
        const w = wb + 2 * i;
        wIdx.push(w, w + 2, w + 1, w + 1, w + 2, w + 3);
      }
    }
    const scoop = new THREE.BufferGeometry();
    scoop.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    scoop.setIndex(idx);
    scoop.computeVertexNormals();
    const end = new THREE.BufferGeometry();
    end.setAttribute('position', new THREE.Float32BufferAttribute(wall, 3));
    end.setIndex(wIdx);
    end.computeVertexNormals();
    return {strip, scoop, end, ink: inkTube(top, 0.003, inkT)};
  }, [x0, x1, P, ampQ, inkT]);

  const phase = -(((scroll % P) + P) % P);
  const lowTop = -GROOVE.depth * MAX_AMP - 0.002;
  return (
    <group>
      {/* the face below the dips (fixed) and its outline: the bottom and both ends */}
      <mesh position={[(x0 + x1) / 2, (lowTop - depth) / 2, z]} material={mats.plain} receiveShadow>
        <planeGeometry args={[x1 - x0, lowTop + depth]} />
      </mesh>
      {(
        [
          [
            [x0, -depth],
            [x1, -depth],
          ],
          [
            [x0, -depth],
            [x0, 0],
          ],
          [
            [x1, -depth],
            [x1, 0],
          ],
        ] as [P2, P2][]
      ).map(([p, q], i) => (
        <mesh key={i} material={mats.inkFixed} position={[(p[0] + q[0]) / 2, (p[1] + q[1]) / 2, z + 0.003]}>
          <boxGeometry args={[Math.abs(q[0] - p[0]) + inkT, Math.abs(q[1] - p[1]) + inkT, inkT]} />
        </mesh>
      ))}
      {/* the moving top strip with the dips, the scoops behind them, the ink along the profile */}
      <group position={[phase, 0, z]}>
        <mesh geometry={geo.strip} material={mats.cut} receiveShadow />
        {/* (flat, off the row, the scoops would lie on the road's top and flicker against it) */}
        <mesh geometry={geo.scoop} material={mats.milled} receiveShadow visible={ampQ > 0.04} />
        <mesh geometry={geo.end} material={mats.milled} receiveShadow visible={ampQ > 0.04} />
        <mesh geometry={geo.ink} material={mats.ink} />
      </group>
    </group>
  );
};

/** World points of the profile between x0 and x1 (for shapes the scene fills: the trapped air). */
export const profilePoints = (x0: number, x1: number, s: number, amp: number, n = 20): V3[] =>
  [...Array(n + 1).keys()].map((i) => {
    const x = x0 + ((x1 - x0) * i) / n;
    return [x, profileY(x, s, amp), 0];
  });

/** Samples in a `CurveStrip` (fixed, so its geometry is built once and refilled each frame). */
export const STRIP_N = 28;

/**
 * A flat strip in the plane z between two curves sampled at the same x (`top[i]`, `bottom[i]` at
 * `xs[i]`, `STRIP_N` each): the trapped air, the tread's bulge, an ink line along a moving curve.
 * One geometry, refilled every frame (no new buffers per frame).
 */
export const CurveStrip: React.FC<{
  xs: number[];
  top: number[];
  bottom: number[];
  z: number;
  material: THREE.Material;
  visible?: boolean;
  glow?: boolean;
  renderOrder?: number;
}> = ({xs, top, bottom, z, material, visible = true, glow = false, renderOrder = 0}) => {
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(STRIP_N * 2 * 3), 3));
    const idx: number[] = [];
    for (let i = 0; i < STRIP_N - 1; i++) {
      const a = 2 * i;
      idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
    g.setIndex(idx);
    return g;
  }, []);
  const p = geometry.getAttribute('position') as THREE.BufferAttribute;
  for (let i = 0; i < STRIP_N; i++) {
    p.setXYZ(2 * i, xs[i] ?? 0, top[i] ?? 0, z);
    p.setXYZ(2 * i + 1, xs[i] ?? 0, bottom[i] ?? 0, z);
  }
  p.needsUpdate = true;
  geometry.computeBoundingSphere();
  return (
    <mesh
      geometry={geometry}
      material={material}
      visible={visible}
      userData={{glow}}
      frustumCulled={false}
      renderOrder={renderOrder}
    />
  );
};

/**
 * The continuous band (the system at real speed: the drops too fast to count): an orange glow along the
 * cut's top behind a tire, brightest at the tire and trailing back over the dips it has just hit.
 */
export const bandMaterial = (
  /** The road's axis (world 'x' in the car slice, 'z' on H) and the way the tire drives along it (+1 / −1). */
  axis: 'x' | 'z' = 'x',
  dir: 1 | -1 = 1,
) =>
  new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {uAmt: {value: 0}, uHead: {value: 0}, cOrange: {value: raw(section.orange)}},
    vertexShader: `
      varying vec3 vP;
      void main() {
        vec4 w = modelMatrix * vec4(position, 1.0);
        vP = w.xyz;
        gl_Position = projectionMatrix * viewMatrix * w;
      }`,
    fragmentShader: `
      varying vec3 vP;
      uniform float uAmt, uHead;
      uniform vec3 cOrange;
      void main() {
        float back = ${dir.toFixed(1)} * (uHead - vP.${axis});
        float a = uAmt * (0.35 + 0.65 * exp(-max(back, 0.0) / 0.22)) * smoothstep(-0.06, 0.0, back) * (1.0 - smoothstep(0.55, 0.75, back));
        if (a < 0.003) discard;
        gl_FragColor = vec4(cOrange, a);
      }`,
  });
