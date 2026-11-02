import React, {useEffect, useMemo} from 'react';
import {random} from 'remotion';
import * as THREE from 'three';
import {HIGHWAY, LAB, MOODS, REAL, section, STREET, theme, TOWER, type Mood} from '../../theme';
import {raw, roundedBox, softTexture} from '../plaster';
import {applyAlbedo, applyEnv, useAlbedo, useEnvStrength, useStudioEnv} from '../real/useStudioEnv';
import {CutOutline, cutMaterial, INK, InkLine} from './cutLook';
import {pointAlong as pointOn, polylineLength} from './GlowLines';
import {SECTION_ANGLE} from './SectionCamera';

type V3 = [number, number, number];

/*
 * Parts of the data-centre slice (No. 013), realistic and generic (no maker, no logo, nothing readable), metres, y up,
 * +z toward the camera. Neutral greys and steel throughout; orange is drawn only by the scene, for the heat and the warm
 * water (§ 5 and the video's palette note). Every moving part is a pure function of its props.
 *
 *  - `Pipe`: a run of straight pipe along a polyline with rounded elbows.
 *  - `CutPipeRun`: a pipe whose axis lies in the section plane, so the section cuts it lengthwise (the back half stands,
 *    the wall shows as hatched strips, the bore as water): scale crust growing inward from the wall (off-white), and
 *    corrosion (rust pits blooming, the wall thinning) along its own stretches; neutral flow marks slow as it narrows.
 *  - `FlowMarks`: neutral chevrons (or pale-orange dots) travelling along a polyline, for water in pipes and air.
 *  - `Transformer` (three sizes), `Switchgear` (with an electric meter whose disc turns), `PowerLine` poles and wires.
 *  - `Controller` (a conductivity controller: a dial with a 2–4 band, the set-point mark, the needle), `BlowdownValve`
 *    (a motorised ball valve with its actuator and the drain stream into a floor sink), `SampleJars` (two glass jars
 *    with probes, mineral dots, two small needle meters), `DosingSkid` (two drums, two stroking pumps, clear drops),
 *    `FillStation` (the loop's fill valve, a hose, a cap and lock tag, a sight-glass level gauge).
 *  - `CoilWall`: the hall's fan-coil wall (a finned coil face behind the hot aisle, fan sections in front of the cold
 *    aisles, the blue-grey supply below and the return above).
 *  - `HeatWisps`: orange shimmer rising off something hot (the racks' backs; the video's "heat" is the system).
 */

const smooth = (a: number, b: number, x: number) => {
  const u = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return u * u * (3 - 2 * u);
};
const UP = new THREE.Vector3(0, 1, 0);
const unitCyl = new THREE.CylinderGeometry(1, 1, 1, 16, 1);
const unitSphere = new THREE.SphereGeometry(1, 14, 10);

export const useDcMats = (mood: Mood) => {
  const env = useStudioEnv();
  const envScale = useEnvStrength();
  const albedo = useAlbedo();
  const mats = useMemo(() => {
    const m = MOODS[mood];
    const phys = (c: string, o: THREE.MeshPhysicalMaterialParameters = {}) =>
      new THREE.MeshPhysicalMaterial({color: raw(c), ...o});
    const std = (c: string, r = 0.85, metal = 0) =>
      new THREE.MeshStandardMaterial({color: raw(c), roughness: r, metalness: metal});
    return {
      cut: cutMaterial(),
      wall: std(m.wall, 0.95),
      floor: std(LAB[mood].floor, 0.85),
      tile: std(TOWER.laminateGrain, 0.7),
      plantFloor: std(TOWER.stone, 0.8),
      concrete: std(STREET.concrete, 0.9),
      gravel: std(STREET.gravel, 1),
      grass: std(STREET.grass, 0.95),
      earth: std(m.earth, 1),
      roof: std(TOWER.mountPlate, 0.85),
      steel: phys(REAL.steel, {metalness: 0.75, roughness: 0.4}),
      galv: phys(HIGHWAY.galvanized, {metalness: 0.8, roughness: 0.45}),
      pipeCold: phys(STREET.main, {metalness: 0.4, roughness: 0.45, clearcoat: 0.3}),
      pipeWarm: phys(REAL.steel, {metalness: 0.6, roughness: 0.4, clearcoat: 0.3}),
      pipeFresh: phys(REAL.stemAlu, {metalness: 0.7, roughness: 0.35}),
      pipeDrain: phys(STREET.poly, {roughness: 0.6}),
      pipeIn: phys(REAL.labDark, {roughness: 0.6, metalness: 0.3, side: THREE.DoubleSide}),
      water: new THREE.MeshStandardMaterial({
        color: raw(STREET.water),
        roughness: 0.2,
        transparent: true,
        opacity: 0.6,
        depthWrite: false,
      }),
      waterSolid: std(STREET.water, 0.25),
      stream: new THREE.MeshBasicMaterial({
        color: raw(STREET.stream),
        transparent: true,
        opacity: 0.8,
        depthWrite: false,
      }),
      crust: std(TOWER.paint, 0.95),
      rust: std(REAL.rust, 0.9),
      rustDark: std(REAL.rustDark, 0.95),
      cabinet: phys(TOWER.cabinetPaint, {roughness: 0.5, clearcoat: 0.3}),
      cabinetDark: phys(REAL.cabinet, {roughness: 0.5, metalness: 0.3}),
      dark: phys(REAL.labDark, {roughness: 0.5}),
      black: std(REAL.cable, 0.7),
      fins: phys(REAL.lamination, {metalness: 0.6, roughness: 0.5}),
      tank: phys(TOWER.cabinetPaint, {roughness: 0.4, clearcoat: 0.4}),
      drum: phys(STREET.tank, {roughness: 0.55}),
      glass: new THREE.MeshPhysicalMaterial({
        color: raw(TOWER.glass),
        roughness: 0.05,
        transparent: true,
        opacity: 0.28,
        clearcoat: 1,
        depthWrite: false,
      }),
      dial: std(STREET.dial, 0.6),
      ink: new THREE.MeshBasicMaterial({color: raw(section.cutLine)}),
      band: std(STREET.gravel, 0.8),
      hose: phys(REAL.hose, {roughness: 0.6, clearcoat: 0.2}),
      brass: phys(STREET.brassNut, {metalness: 0.95, roughness: 0.35}),
      tag: std(TOWER.paper, 0.8),
      led: new THREE.MeshBasicMaterial({color: raw(REAL.statusLed)}),
      ledOff: new THREE.MeshBasicMaterial({color: raw(section.ledOff)}),
      insulator: phys(REAL.tick, {roughness: 0.25, clearcoat: 0.6}),
      wire: std(REAL.cable, 0.6),
      glint: new THREE.MeshBasicMaterial({
        color: raw(theme.plasterGlass),
        transparent: true,
        opacity: 0,
        depthWrite: false,
      }),
      dotGrey: std(STREET.gravel, 0.8),
      dotWhite: std(section.cut, 0.8),
      drop: new THREE.MeshPhysicalMaterial({
        color: raw(TOWER.glass),
        roughness: 0.05,
        transparent: true,
        opacity: 0.7,
        clearcoat: 1,
      }),
      wood: std(STREET.pole, 0.85),
    };
  }, [mood]);
  useEffect(() => () => Object.values(mats).forEach((x) => x.dispose()), [mats]);
  applyEnv(
    env,
    [
      [mats.steel, 0.9],
      [mats.galv, 0.9],
      [mats.pipeCold, 0.7],
      [mats.pipeWarm, 0.8],
      [mats.pipeFresh, 0.9],
      [mats.cabinet, 0.6],
      [mats.cabinetDark, 0.6],
      [mats.fins, 0.8],
      [mats.tank, 0.6],
      [mats.glass, 1.4],
      [mats.brass, 1.1],
      [mats.insulator, 0.8],
    ],
    envScale,
  );
  applyAlbedo(
    [
      mats.steel,
      mats.galv,
      mats.pipeCold,
      mats.pipeWarm,
      mats.cabinet,
      mats.cabinetDark,
      mats.dark,
      mats.fins,
      mats.tank,
      mats.drum,
    ],
    albedo,
  );
  return mats;
};
export type DcMats = ReturnType<typeof useDcMats>;

/** A straight cylinder from a to b (shared unit geometry, stretched). */
export const Rod: React.FC<{a: V3; b: V3; r: number; mat: THREE.Material; shadow?: boolean}> = ({
  a,
  b,
  r,
  mat,
  shadow = false,
}) => {
  const va = new THREE.Vector3(...a);
  const d = new THREE.Vector3(...b).sub(va);
  const len = d.length();
  if (len < 1e-4) return null;
  const q = new THREE.Quaternion().setFromUnitVectors(UP, d.normalize());
  const mid = va.add(new THREE.Vector3(...b)).multiplyScalar(0.5);
  return (
    <mesh
      geometry={unitCyl}
      material={mat}
      position={mid}
      quaternion={q}
      scale={[r, len, r]}
      castShadow={shadow}
      receiveShadow
    />
  );
};

/** A pipe along a polyline: straight runs and a sphere at every bend. */
export const Pipe: React.FC<{points: V3[]; r: number; mat: THREE.Material; shadow?: boolean}> = ({
  points,
  r,
  mat,
  shadow = false,
}) => (
  <group>
    {points.slice(1).map((p, i) => (
      <Rod key={i} a={points[i]} b={p} r={r} mat={mat} shadow={shadow} />
    ))}
    {points.slice(1, -1).map((p, i) => (
      <mesh key={`e${i}`} geometry={unitSphere} material={mat} position={p} scale={r * 1.02} />
    ))}
  </group>
);

/** A point and the direction a share `u` along a polyline (by length). */
export const alongWithDir = (pts: V3[], u: number): {at: V3; dir: V3} => {
  const total = polylineLength(pts);
  let left = Math.max(0, Math.min(1, u)) * total;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1];
    const b = pts[i];
    const l = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
    if (left <= l || i === pts.length - 1) {
      const k = l > 0 ? Math.min(1, left / l) : 0;
      const dir: V3 = l > 0 ? [(b[0] - a[0]) / l, (b[1] - a[1]) / l, (b[2] - a[2]) / l] : [1, 0, 0];
      return {at: [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k], dir};
    }
    left -= l;
  }
  return {at: pts[pts.length - 1], dir: [1, 0, 0]};
};

const CHEVRON = (() => {
  const s = new THREE.Shape();
  s.moveTo(-0.5, -0.6);
  s.lineTo(0.5, 0);
  s.lineTo(-0.5, 0.6);
  s.lineTo(-0.2, 0);
  s.closePath();
  return new THREE.ShapeGeometry(s);
})();

/**
 * Marks travelling along a polyline: `neutral` ink chevrons on a paper rim (water, air; never bloomed) or `warm`
 * pale-orange dots (§ 5: dots travel the finished path). `offset` is the distance travelled so far (m: the scene
 * integrates the speed, so a speed change never jumps a mark); one mark every `spacing` m. Faced to the fixed angle.
 */
export const FlowMarks: React.FC<{
  points: V3[];
  offset: number;
  spacing?: number;
  size?: number;
  kind?: 'neutral' | 'warm';
  opacity?: number;
  mood?: Mood;
  /** Lift the marks this far toward the camera (so they sit on a pipe's near face). */
  lift?: number;
}> = ({points, offset, spacing = 0.9, size = 0.12, kind = 'neutral', opacity = 1, mood = 'day', lift = 0}) => {
  const mats = useMemo(
    () => ({
      ink: new THREE.MeshBasicMaterial({color: raw(section.cutLine), transparent: true, side: THREE.DoubleSide}),
      rim: new THREE.MeshBasicMaterial({
        color: raw(section.cut).multiplyScalar(0.95 / MOODS[mood].exposure),
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
      dot: new THREE.MeshBasicMaterial({color: raw(section.orangeDot), transparent: true}),
      halo: new THREE.MeshBasicMaterial({color: raw(section.orange), transparent: true, depthWrite: false}),
    }),
    [mood],
  );
  useEffect(() => () => Object.values(mats).forEach((m) => m.dispose()), [mats]);
  const o = Math.max(0, Math.min(1, opacity));
  if (o < 0.01 || points.length < 2) return null;
  mats.ink.opacity = o;
  mats.rim.opacity = 0.9 * o;
  mats.dot.opacity = o;
  mats.halo.opacity = 0.25 * o;
  const total = polylineLength(points);
  const n = Math.floor(total / spacing);
  const view = new THREE.Vector3(...SECTION_ANGLE);
  const out: React.ReactNode[] = [];
  for (let i = 0; i <= n; i++) {
    const s = ((((offset + i * spacing) % total) + total) % total) / total;
    const {at, dir} = alongWithDir(points, s);
    // fade at the ends of the run
    const edge = smooth(0, 0.03, s) * (1 - smooth(0.97, 1, s));
    if (edge < 0.02) continue;
    const p: V3 = [at[0] + view.x * lift, at[1] + view.y * lift, at[2] + view.z * lift];
    if (kind === 'warm') {
      out.push(
        <group key={i} position={p}>
          <mesh
            geometry={unitSphere}
            material={mats.dot}
            scale={size * 0.45 * edge}
            userData={{glow: true}}
            renderOrder={6}
          />
          <mesh
            geometry={unitSphere}
            material={mats.halo}
            scale={size * 0.95 * edge}
            userData={{glow: true}}
            renderOrder={7}
          />
        </group>,
      );
    } else {
      // the chevron in the plane facing the camera, pointing along the flow
      const x = new THREE.Vector3(...dir);
      const z = view.clone().sub(x.clone().multiplyScalar(view.dot(x)));
      if (z.lengthSq() < 1e-6) continue;
      z.normalize();
      const y = new THREE.Vector3().crossVectors(z, x);
      const q = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, y, z));
      out.push(
        <group key={i} position={p} quaternion={q} scale={size * edge}>
          <mesh geometry={CHEVRON} material={mats.rim} scale={1.45} position={[-0.05, 0, -0.002]} renderOrder={5} />
          <mesh geometry={CHEVRON} material={mats.ink} renderOrder={6} />
        </group>,
      );
    }
  }
  return <group>{out}</group>;
};

// ------------------------------------------------------------------------------------------------ the cut header

export type CutPipeRunProps = {
  /** Run along +x from x0 to x1 at height y, its axis in the section plane z = zCut. */
  x0: number;
  x1: number;
  y: number;
  zCut: number;
  /** Outer radius and wall (m). */
  r?: number;
  wall?: number;
  /** The stretch [from, to] (x) where scale grows, and its amount 0 → 1 (1 = the bore narrowed by ≈ 55%). */
  scaleSpan?: [number, number];
  scale?: number;
  /** The stretch where corrosion works, and its amount 0 → 1 (pits bloom, the wall thins to ≈ 40%). */
  corrosionSpan?: [number, number];
  corrosion?: number;
  /** Flow travelled so far (m, the scene integrates it); marks slow where the bore narrows. */
  flow?: number;
  /** The flow marks' opacity (0: none). */
  flowOn?: number;
  mats: DcMats;
  ink?: number;
  mood?: Mood;
  seed?: string;
};

/** The bore radius at x for the scale stretch (narrowed), else the clean bore. */
export const cutPipeBore = (p: CutPipeRunProps, x: number) => {
  const r = p.r ?? 0.22;
  const wall = p.wall ?? 0.03;
  const inner = r - wall;
  const sc = p.scaleSpan && x >= p.scaleSpan[0] && x <= p.scaleSpan[1] ? Math.max(0, Math.min(1, p.scale ?? 0)) : 0;
  return inner * (1 - 0.55 * sc);
};

/** A pipe cut lengthwise by the section plane (see the file comment). */
export const CutPipeRun: React.FC<CutPipeRunProps> = (p) => {
  const {x0, x1, y, zCut, mats, ink = INK, mood = 'day', seed = 'cutpipe'} = p;
  const r = p.r ?? 0.22;
  const wall = p.wall ?? 0.03;
  const inner = r - wall;
  const L = x1 - x0;
  const geo = useMemo(
    () => ({
      // the back half (z < zCut): outer shell and the inner face
      outer: new THREE.CylinderGeometry(r, r, 1, 28, 1, true, Math.PI / 2, Math.PI).rotateZ(Math.PI / 2),
      innerFace: new THREE.CylinderGeometry(inner, inner, 1, 28, 1, true, Math.PI / 2, Math.PI).rotateZ(Math.PI / 2),
      halfDisc: new THREE.CircleGeometry(1, 20, Math.PI / 2, Math.PI),
    }),
    [r, inner],
  );
  useEffect(() => () => Object.values(geo).forEach((g) => g.dispose()), [geo]);
  const sc = Math.max(0, Math.min(1, p.scale ?? 0));
  const co = Math.max(0, Math.min(1, p.corrosion ?? 0));
  // the cut face's parts sit just in front of the plane (an underground run shares it with the ground's cut face)
  const zf = zCut + 0.003;
  const strips: React.ReactNode[] = [];
  // the wall's cut faces, top and bottom: hatched strips in the plane (thinner where corrosion has worked)
  const segs: {a: number; b: number; wallK: number; crust: number}[] = [];
  const cuts = [x0, x1, ...(p.scaleSpan ?? []), ...(p.corrosionSpan ?? [])]
    .filter((x) => x >= x0 && x <= x1)
    .sort((a, b) => a - b);
  for (let i = 0; i < cuts.length - 1; i++) {
    const a = cuts[i];
    const b = cuts[i + 1];
    if (b - a < 1e-3) continue;
    const mid = (a + b) / 2;
    const inScale = p.scaleSpan && mid >= p.scaleSpan[0] && mid <= p.scaleSpan[1];
    const inCor = p.corrosionSpan && mid >= p.corrosionSpan[0] && mid <= p.corrosionSpan[1];
    segs.push({a, b, wallK: inCor ? 1 - 0.6 * co : 1, crust: inScale ? sc : 0});
  }
  segs.forEach((s, i) => {
    const w = wall * s.wallK;
    const crustT = inner * 0.55 * s.crust;
    const len = s.b - s.a;
    const cx = (s.a + s.b) / 2;
    for (const side of [1, -1]) {
      strips.push(
        <mesh key={`w${i}${side}`} material={mats.cut} position={[cx, y + side * (r - w / 2), zf]}>
          <boxGeometry args={[len, w, 0.004]} />
        </mesh>,
      );
      if (crustT > 0.002)
        strips.push(
          <mesh key={`c${i}${side}`} material={mats.crust} position={[cx, y + side * (inner - crustT / 2), zf]}>
            <boxGeometry args={[len, crustT, 0.006]} />
          </mesh>,
        );
      // the thinned wall leaves a rust line where the steel was eaten away
      if (s.wallK < 0.999)
        strips.push(
          <mesh key={`r${i}${side}`} material={mats.rustDark} position={[cx, y + side * (r - w - (wall - w) / 2), zf]}>
            <boxGeometry args={[len, wall - w, 0.005]} />
          </mesh>,
        );
    }
  });
  // crust lumps (uneven inner edge) on the scale stretch
  const lumps: React.ReactNode[] = [];
  if (p.scaleSpan && sc > 0.02) {
    const [a, b] = p.scaleSpan;
    const n = Math.floor((b - a) / 0.11);
    for (let i = 0; i < n; i++) {
      for (const side of [1, -1]) {
        const k = random(`${seed}-lump-${i}-${side}`);
        if (k < 0.3) continue;
        const x = a + 0.05 + i * 0.11 + (random(`${seed}-lx-${i}-${side}`) - 0.5) * 0.06;
        const rr = inner * 0.55 * sc * (0.2 + 0.45 * k);
        lumps.push(
          <mesh
            key={`l${i}${side}`}
            geometry={geo.halfDisc}
            material={mats.crust}
            position={[x, y + side * (inner - inner * 0.55 * sc), zf + 0.001]}
            rotation={[0, 0, side > 0 ? Math.PI / 2 : -Math.PI / 2]}
            scale={rr}
          />,
        );
      }
    }
  }
  // corrosion pits: rust spots blooming on the back half's inner face and the wall's cut edge
  const pits: React.ReactNode[] = [];
  if (p.corrosionSpan && co > 0.02) {
    const [a, b] = p.corrosionSpan;
    for (let i = 0; i < 26; i++) {
      const rnd = (s: string) => random(`${seed}-pit-${s}-${i}`);
      const th = rnd('t') * 0.8;
      const k = smooth(th, th + 0.2, co);
      if (k <= 0) continue;
      const x = a + rnd('x') * (b - a);
      // round the back half's inner face, top (0) to bottom (π)
      const ang = 0.15 + rnd('a') * (Math.PI - 0.3);
      const yy = y + Math.cos(ang) * inner * 0.97;
      const zz = zCut - Math.sin(ang) * inner * 0.97;
      pits.push(
        <mesh
          key={`p${i}`}
          geometry={unitSphere}
          material={i % 3 ? mats.rust : mats.rustDark}
          position={[x, yy, zz]}
          scale={[0.03 * k, 0.03 * k, 0.03 * k]}
        />,
      );
    }
    for (let i = 0; i < 14; i++) {
      const rnd = (s: string) => random(`${seed}-epit-${s}-${i}`);
      const k = smooth(rnd('t') * 0.7, rnd('t') * 0.7 + 0.25, co);
      if (k <= 0) continue;
      const x = a + rnd('x') * (b - a);
      const side = i % 2 ? 1 : -1;
      pits.push(
        <mesh
          key={`e${i}`}
          geometry={geo.halfDisc}
          material={mats.rustDark}
          position={[x, y + side * (inner + wall * 0.15), zf + 0.001]}
          rotation={[0, 0, side > 0 ? -Math.PI / 2 : Math.PI / 2]}
          scale={wall * 0.7 * k}
        />,
      );
    }
  }
  const fo = Math.max(0, Math.min(1, p.flowOn ?? 0));
  return (
    <group>
      <mesh
        geometry={geo.outer}
        material={mats.pipeCold}
        position={[(x0 + x1) / 2, y, zCut]}
        scale={[L, 1, 1]}
        castShadow
        receiveShadow
      />
      <mesh geometry={geo.innerFace} material={mats.pipeIn} position={[(x0 + x1) / 2, y, zCut]} scale={[L, 1, 1]} />
      {pits}
      {/* the water's cut face (translucent: the inside wall and its pits show through) */}
      <mesh material={mats.water} position={[(x0 + x1) / 2, y, zf - 0.0015]} renderOrder={4}>
        <planeGeometry args={[L, inner * 2]} />
      </mesh>
      {strips}
      {lumps}
      {fo > 0.01 ? (
        <FlowMarks
          points={[
            [x0, y, zCut + 0.008],
            [x1, y, zCut + 0.008],
          ]}
          offset={(p.flow ?? 0) * (0.55 + 0.45 * Math.pow(cutPipeBore(p, (p.scaleSpan?.[0] ?? x0) + 0.01) / inner, 2))}
          spacing={0.45}
          size={0.07}
          opacity={fo}
          mood={mood}
        />
      ) : null}
      <CutOutline
        edges={[
          [
            [x0, y + r, zf],
            [x1, y + r, zf],
          ],
          [
            [x0, y - r, zf],
            [x1, y - r, zf],
          ],
          [
            [x0, y + inner, zf],
            [x1, y + inner, zf],
          ],
          [
            [x0, y - inner, zf],
            [x1, y - inner, zf],
          ],
        ]}
        thickness={ink}
      />
    </group>
  );
};

// ------------------------------------------------------------------------------------------------ yard

export type TransformerKind = 'small' | 'mid' | 'big';
export const TRANSFORMER_SIZE: Record<TransformerKind, V3> = {
  small: [1.2, 1.3, 1.0],
  mid: [1.6, 1.8, 1.3],
  big: [2.0, 2.3, 1.7],
};

/** A pad-mounted transformer: tank, radiator fins both sides, bushings on top, and (mid/big) a fan on the radiator. */
export const Transformer: React.FC<{kind: TransformerKind; mats: DcMats; fanTurns?: number}> = ({
  kind,
  mats,
  fanTurns = 0,
}) => {
  const [w, h, d] = TRANSFORMER_SIZE[kind];
  const old = kind === 'small';
  const fins = Math.round(d / 0.12);
  return (
    <group>
      <mesh material={mats.concrete} position={[0, 0.08, 0]} receiveShadow>
        <boxGeometry args={[w + 0.5, 0.16, d + 0.5]} />
      </mesh>
      <mesh
        geometry={roundedBox(w * 0.7, h, d, 0.04)}
        material={old ? mats.cabinetDark : mats.cabinet}
        position={[0, 0.16 + h / 2, 0]}
        castShadow
        receiveShadow
      />
      {[-1, 1].map((s) => (
        <group key={s} position={[s * (w * 0.35 + 0.12), 0.16 + h * 0.45, 0]}>
          {[...Array(fins).keys()].map((i) => (
            <mesh
              key={i}
              material={mats.fins}
              position={[0, 0, -d / 2 + 0.06 + i * ((d - 0.12) / Math.max(1, fins - 1))]}
              castShadow
            >
              <boxGeometry args={[0.22, h * 0.7, 0.025]} />
            </mesh>
          ))}
        </group>
      ))}
      {[-1, 0, 1].map((i) => (
        <group key={i} position={[i * w * 0.18, 0.16 + h, -d * 0.15]}>
          {[0, 1, 2].map((k) => (
            <mesh key={k} material={mats.insulator} position={[0, 0.06 + k * 0.07, 0]}>
              <cylinderGeometry args={[0.07, 0.07, 0.035, 14]} />
            </mesh>
          ))}
          <mesh material={mats.dark} position={[0, 0.27, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.1, 6]} />
          </mesh>
        </group>
      ))}
      {!old ? (
        <group position={[w * 0.35 + 0.12, 0.16 + h * 0.2, d / 2 + 0.06]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh material={mats.dark}>
            <torusGeometry args={[0.24, 0.025, 6, 24]} />
          </mesh>
          <group rotation={[0, fanTurns * Math.PI * 2, 0]}>
            {[0, 1, 2, 3, 4].map((b) => (
              <mesh key={b} material={mats.dark} rotation={[0, (b / 5) * Math.PI * 2, 0]} position={[0, 0, 0]}>
                <boxGeometry args={[0.04, 0.012, 0.42]} />
              </mesh>
            ))}
          </group>
        </group>
      ) : null}
    </group>
  );
};

/** The yard's switchgear: a cabinet run with a glass-domed electric meter whose disc turns (`discTurns`). */
export const Switchgear: React.FC<{mats: DcMats; discTurns: number; w?: number}> = ({mats, discTurns, w = 2.6}) => (
  <group>
    <mesh material={mats.concrete} position={[0, 0.08, 0]} receiveShadow>
      <boxGeometry args={[w + 0.4, 0.16, 1.3]} />
    </mesh>
    <mesh
      geometry={roundedBox(w, 2.1, 0.9, 0.03)}
      material={mats.cabinet}
      position={[0, 0.16 + 1.05, 0]}
      castShadow
      receiveShadow
    />
    {[...Array(4).keys()].map((i) => (
      <mesh key={i} material={mats.cabinetDark} position={[-w / 2 + w / 8 + (i * w) / 4, 0.16 + 1.05, 0.452]}>
        <boxGeometry args={[w / 4 - 0.06, 1.95, 0.01]} />
      </mesh>
    ))}
    {/* the meter: a socket base, a glass dome, the horizontal disc with its dark mark */}
    <group position={[w / 2 - 0.35, 1.45, 0.5]}>
      <mesh material={mats.dark} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.05, 24]} />
      </mesh>
      <mesh material={mats.dial} position={[0, 0, 0.03]}>
        <circleGeometry args={[0.11, 24]} />
      </mesh>
      <group position={[0, -0.03, 0.08]} rotation={[0, discTurns * Math.PI * 2, 0]}>
        <mesh material={mats.steel}>
          <cylinderGeometry args={[0.08, 0.08, 0.006, 24]} />
        </mesh>
        <mesh material={mats.ink} position={[0.06, 0.004, 0]}>
          <boxGeometry args={[0.035, 0.002, 0.012]} />
        </mesh>
      </group>
      <mesh material={mats.glass} position={[0, 0, 0.06]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.12, 24]} />
      </mesh>
    </group>
  </group>
);

/** Catenary between two points (`sag` m at the middle), as a polyline. */
export const catenary = (a: V3, b: V3, sag: number, n = 14): V3[] =>
  [...Array(n + 1).keys()].map((i) => {
    const u = i / n;
    return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u - sag * 4 * u * (1 - u), a[2] + (b[2] - a[2]) * u];
  });

/** A steel pole with one or two crossarms and their insulators; `glint` 0 → 1 flashes the insulators (neutral white). */
export const PowerPole: React.FC<{mats: DcMats; h: number; arms: number; glint?: number; armW?: number}> = ({
  mats,
  h,
  arms,
  glint = 0,
  armW = 2.4,
}) => {
  mats.glint.opacity = 0.85 * Math.max(0, Math.min(1, glint));
  return (
    <group>
      <mesh material={mats.galv} position={[0, h / 2, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.2, h, 12]} />
      </mesh>
      {[...Array(arms).keys()].map((k) => (
        <group key={k} position={[0, h - 0.4 - k * 1.3, 0]}>
          <mesh material={mats.galv} castShadow>
            <boxGeometry args={[0.12, 0.12, armW]} />
          </mesh>
          {[-1, 0, 1].map((i) => (
            <group key={i} position={[0, 0.06, i * (armW / 2 - 0.15)]}>
              <mesh material={mats.insulator} position={[0, 0.14, 0]}>
                <cylinderGeometry args={[0.07, 0.07, 0.28, 12]} />
              </mesh>
              {glint > 0.01 ? (
                <mesh
                  geometry={unitSphere}
                  material={mats.glint}
                  position={[0.08, 0.2, 0]}
                  scale={0.12 + 0.1 * glint}
                  renderOrder={6}
                />
              ) : null}
            </group>
          ))}
        </group>
      ))}
    </group>
  );
};

// ------------------------------------------------------------------------------------------------ plant room

/** Dial angle for a value in cycles (1 → 6 over 240°, 1 at lower left). */
export const controllerAngle = (cycles: number) => {
  const u = (Math.max(0.6, Math.min(6.6, cycles)) - 1) / 5;
  return (Math.PI * 7) / 6 - u * ((Math.PI * 4) / 3);
};

/**
 * The conductivity controller: a wall box with a round dial (ticks, no numerals), a grey band from 2 to 4 cycles, the
 * set-point mark (ink triangle) and the needle; a small neutral lamp lights while the needle is past the set point.
 * Faces +z; origin at the dial's centre.
 */
export const Controller: React.FC<{mats: DcMats; needle: number; setPoint: number; ink?: number}> = ({
  mats,
  needle,
  setPoint,
  ink = INK,
}) => {
  const R = 0.2;
  const band = useMemo(
    () =>
      new THREE.RingGeometry(R * 0.72, R * 0.86, 40, 1, controllerAngle(4), controllerAngle(2) - controllerAngle(4)),
    [],
  );
  useEffect(() => () => band.dispose(), [band]);
  const a = controllerAngle(needle);
  const sp = controllerAngle(setPoint);
  const over = needle > setPoint;
  return (
    <group>
      <mesh
        geometry={roundedBox(0.62, 0.72, 0.16, 0.02)}
        material={mats.cabinet}
        position={[0, -0.06, -0.08]}
        castShadow
      />
      <mesh material={mats.dial} position={[0, 0, 0.002]}>
        <circleGeometry args={[R, 40]} />
      </mesh>
      <mesh geometry={band} material={mats.band} position={[0, 0, 0.004]} />
      {[...Array(11).keys()].map((i) => {
        const ang = controllerAngle(1 + i * 0.5);
        const long = i % 2 === 0;
        return (
          <mesh
            key={i}
            material={mats.ink}
            position={[Math.cos(ang) * R * (long ? 0.86 : 0.9), Math.sin(ang) * R * (long ? 0.86 : 0.9), 0.006]}
            rotation={[0, 0, ang]}
          >
            <planeGeometry args={[long ? 0.05 : 0.03, long ? 0.008 : 0.005]} />
          </mesh>
        );
      })}
      {/* set point: a triangle on the rim */}
      <mesh
        material={mats.ink}
        position={[Math.cos(sp) * R * 1.02, Math.sin(sp) * R * 1.02, 0.007]}
        rotation={[0, 0, sp - Math.PI / 2]}
      >
        <circleGeometry args={[0.03, 3]} />
      </mesh>
      <group rotation={[0, 0, a]} position={[0, 0, 0.01]}>
        <mesh material={mats.ink} position={[R * 0.4, 0, 0]}>
          <boxGeometry args={[R * 0.85, 0.011, 0.004]} />
        </mesh>
      </group>
      <mesh material={mats.dark} position={[0, 0, 0.014]}>
        <circleGeometry args={[0.018, 14]} />
      </mesh>
      <InkLine
        points={[...Array(41).keys()].map(
          (i) => [Math.cos((i / 40) * Math.PI * 2) * R, Math.sin((i / 40) * Math.PI * 2) * R, 0.005] as V3,
        )}
        thickness={ink * 0.6}
      />
      <mesh material={over ? mats.led : mats.ledOff} position={[0.2, -0.32, 0.005]}>
        <circleGeometry args={[0.02, 12]} />
      </mesh>
      {[0, 1].map((i) => (
        <mesh key={i} material={mats.dark} position={[-0.18 + i * 0.1, -0.32, 0.005]}>
          <planeGeometry args={[0.06, 0.03]} />
        </mesh>
      ))}
    </group>
  );
};

/**
 * The blowdown valve on a stub of pipe: a ball valve body, its square actuator with a turning indicator (0 shut → 90°
 * open), the outlet elbow pointing down and the stream falling into a floor sink (`fall` m below the outlet); the
 * stream's width follows `open`. Origin at the valve body's centre; the pipe comes in along −x.
 */
export const BlowdownValve: React.FC<{mats: DcMats; open: number; fall: number; clock: number}> = ({
  mats,
  open,
  fall,
  clock,
}) => {
  const o = Math.max(0, Math.min(1, open));
  const outY = -0.16;
  return (
    <group>
      <mesh material={mats.brass} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.07, 0.07, 0.18, 16]} />
      </mesh>
      <mesh material={mats.brass}>
        <sphereGeometry args={[0.085, 16, 12]} />
      </mesh>
      {/* actuator */}
      <mesh geometry={roundedBox(0.2, 0.16, 0.16, 0.015)} material={mats.dark} position={[0, 0.2, 0]} castShadow />
      <group position={[0, 0.29, 0]} rotation={[0, (-o * Math.PI) / 2, 0]}>
        <mesh material={mats.cabinet}>
          <boxGeometry args={[0.16, 0.02, 0.035]} />
        </mesh>
      </group>
      <Rod a={[0.09, 0, 0]} b={[0.16, 0, 0]} r={0.05} mat={mats.steel} />
      <Rod a={[0.17, 0, 0]} b={[0.17, outY, 0]} r={0.05} mat={mats.steel} />
      {o > 0.01 ? (
        <group>
          <mesh
            material={mats.stream}
            position={[0.17, outY - fall / 2, 0]}
            scale={[0.25 + 0.75 * o, 1, 0.25 + 0.75 * o]}
            renderOrder={6}
          >
            <cylinderGeometry args={[0.035, 0.045, fall, 10, 1, true]} />
          </mesh>
          {[0, 1, 2].map((i) => {
            const u = (((clock / 0.7 + i / 3) % 1) + 1) % 1;
            return (
              <mesh
                key={i}
                material={mats.stream}
                position={[0.17, outY - fall + 0.01, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={(0.05 + 0.18 * u) * (0.5 + 0.5 * o)}
                renderOrder={6}
              >
                <ringGeometry args={[0.75, 1, 20]} />
              </mesh>
            );
          })}
        </group>
      ) : null}
    </group>
  );
};

/**
 * Two glass jars on the bench, fresh water (left) and loop water (right), each with a probe and a small needle meter;
 * the loop jar holds `mult` × the fresh jar's mineral dots (8), and its meter's needle reads `needle` (1 → 6 ×).
 * Origin at the bench top between the jars.
 */
export const SampleJars: React.FC<{mats: DcMats; mult: number; needle: number; clock: number; seed?: string}> = ({
  mats,
  mult,
  needle,
  clock,
  seed = 'jars',
}) => {
  const jar = (x: number, n: number, read: number, key: string) => {
    const dots: React.ReactNode[] = [];
    for (let i = 0; i < n; i++) {
      const r = (s: string) => random(`${seed}-${key}-${s}-${i}`);
      const ang = r('a') * Math.PI * 2;
      const rad = 0.055 * Math.sqrt(r('r'));
      const y = 0.03 + r('y') * 0.17 + 0.006 * Math.sin(clock * 1.3 + i);
      dots.push(
        <mesh
          key={i}
          geometry={unitSphere}
          material={i % 3 ? mats.dotGrey : mats.dotWhite}
          position={[Math.cos(ang) * rad, y, Math.sin(ang) * rad]}
          scale={0.011}
        />,
      );
    }
    const na = Math.PI * 0.8 - ((Math.max(1, Math.min(6, read)) - 1) / 5) * Math.PI * 0.6;
    return (
      <group position={[x, 0, 0]}>
        <mesh material={mats.water} position={[0, 0.11, 0]} renderOrder={4}>
          <cylinderGeometry args={[0.068, 0.068, 0.2, 20]} />
        </mesh>
        {dots}
        <mesh material={mats.glass} position={[0, 0.13, 0]} renderOrder={5}>
          <cylinderGeometry args={[0.075, 0.075, 0.26, 20, 1, true]} />
        </mesh>
        {/* probe */}
        <Rod a={[0.03, 0.06, 0]} b={[0.03, 0.34, 0]} r={0.008} mat={mats.dark} />
        <Pipe
          points={[
            [0.03, 0.34, 0],
            [0.03, 0.4, -0.05],
            [0.1, 0.4, -0.12],
          ]}
          r={0.005}
          mat={mats.black}
        />
        {/* the probe's meter, behind the jar */}
        <group position={[0.02, 0.36, -0.16]}>
          <mesh geometry={roundedBox(0.16, 0.12, 0.05, 0.008)} material={mats.cabinet} castShadow />
          <mesh material={mats.dial} position={[0, 0.005, 0.026]}>
            <planeGeometry args={[0.12, 0.07]} />
          </mesh>
          <group position={[0, -0.025, 0.028]} rotation={[0, 0, na]}>
            <mesh material={mats.ink} position={[0.03, 0, 0]}>
              <planeGeometry args={[0.06, 0.004]} />
            </mesh>
          </group>
        </group>
      </group>
    );
  };
  return (
    <group>
      {jar(-0.15, 8, 1, 'fresh')}
      {jar(0.15, Math.round(8 * Math.max(1, mult)), needle, 'loop')}
    </group>
  );
};

/**
 * The chemical dosing skid: two plain drums, two small diaphragm pumps on a shelf whose heads stroke (`stroke` 0 → 1,
 * a phase the scene drives every 0.5 s), clear tubing to an injection quill, clear drops falling into the line
 * (`drops` 0 → 1). Origin on the floor at the skid's centre; the quill points to `quill` (local).
 */
export const DosingSkid: React.FC<{mats: DcMats; strokes: number; on: number; quill: V3}> = ({
  mats,
  strokes,
  on,
  quill,
}) => {
  // each pump's head: a diaphragm that pushes out and swells on every stroke (the two pumps half a stroke apart)
  const stroke = (k: number) => {
    const ph = (((strokes + k * 0.5) % 1) + 1) % 1;
    return on * Math.pow(Math.max(0, Math.sin(ph * Math.PI)), 0.6);
  };
  // the dosing lines: from each head round the shelf's back edge to the quill on top of the loop pipe
  const line = (k: number, z: number): V3[] => {
    const dz = k === 0 ? -0.025 : 0.025;
    return [
      [0.55 + 0.17, 0.71, z],
      [0.8, 0.71, z],
      [0.8, quill[1] + 0.16, z],
      [0.8, quill[1] + 0.16, quill[2] + dz],
      [quill[0], quill[1] + 0.16, quill[2] + dz],
      [quill[0], quill[1] + 0.06, quill[2] + dz],
    ];
  };
  const pulses: React.ReactNode[] = [];
  if (on > 0.01)
    [-0.13, 0.13].forEach((z, k) => {
      const pts = line(k, z);
      // slugs of chemical (neutral dots) run each line into the quill, one leaving the head per stroke (continuous across strokes)
      for (let j = 0; j < 4; j++) {
        const age = (((strokes + k * 0.5) % 1) + 1) % 1 / 2 + j * 0.5;
        const u = age / 1.8;
        if (u > 1) continue;
        pulses.push(
          <mesh key={`${k}-${j}`} geometry={unitSphere} material={mats.dotWhite} position={pointOn(pts, u)} scale={0.02 * on} renderOrder={5} />,
        );
      }
    });
  return (
    <group>
      <mesh material={mats.concrete} position={[0, 0.04, 0]} receiveShadow>
        <boxGeometry args={[1.5, 0.08, 0.8]} />
      </mesh>
      {[-0.4, 0.15].map((x, i) => (
        <group key={i} position={[x, 0.08, -0.05]}>
          <mesh material={mats.drum} position={[0, 0.42, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.24, 0.24, 0.84, 24]} />
          </mesh>
          <mesh material={mats.dark} position={[0, 0.86, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.04, 12]} />
          </mesh>
        </group>
      ))}
      {/* the shelf and the two pumps, each head pushing out and swelling on its stroke */}
      <mesh material={mats.steel} position={[0.55, 0.62, 0]} castShadow>
        <boxGeometry args={[0.36, 0.03, 0.6]} />
      </mesh>
      {[-0.13, 0.13].map((z, k) => {
        const st = stroke(k);
        return (
          <group key={k} position={[0.55, 0.64, z]}>
            <mesh geometry={roundedBox(0.2, 0.14, 0.16, 0.015)} material={mats.cabinet} position={[0, 0.07, 0]} castShadow />
            <mesh
              material={mats.dark}
              position={[0.11 + 0.025 * st, 0.07, 0]}
              rotation={[0, 0, Math.PI / 2]}
              scale={[1 + 0.35 * st, 1, 1 + 0.35 * st]}
            >
              <cylinderGeometry args={[0.05, 0.055, 0.05, 16]} />
            </mesh>
            {/* the pump's status LED blinks on each stroke (the plant's pale status colour, flat) */}
            <mesh material={st > 0.6 ? mats.led : mats.ledOff} position={[0.0, 0.11, 0.081]}>
              <circleGeometry args={[0.009, 12]} />
            </mesh>
          </group>
        );
      })}
      {[-0.13, 0.13].map((z, k) => (
        <Pipe key={`l${k}`} points={line(k, z)} r={0.008} mat={mats.hose} />
      ))}
      <Rod a={[quill[0], quill[1] + 0.08, quill[2]]} b={[quill[0], quill[1] - 0.02, quill[2]]} r={0.022} mat={mats.steel} />
      {pulses}
    </group>
  );
};

/**
 * The loop's fill station: a fill valve on a stub (handle turns), a hose that connects and comes off (`hose` 0 → 1 = on,
 * sliding in from the front), a cap with a lock tag that goes on (`cap` 0 → 1), and beside it a sight-glass level gauge
 * that fills (`level` 0 → 1). Origin at the valve's centre; the stub comes up from −y.
 */
export const FillStation: React.FC<{mats: DcMats; hose: number; cap: number; level: number; gaugeAt?: V3}> = ({
  mats,
  hose,
  cap,
  level,
  gaugeAt = [0.55, 0.2, -0.1],
}) => {
  const h = Math.max(0, Math.min(1, hose));
  const c = Math.max(0, Math.min(1, cap));
  const lv = Math.max(0, Math.min(1, level));
  const off = (1 - h) * 0.6;
  return (
    <group>
      <mesh material={mats.brass}>
        <sphereGeometry args={[0.07, 14, 10]} />
      </mesh>
      <mesh material={mats.dark} position={[0, 0.1, 0]} rotation={[0, h > 0.5 ? 0 : Math.PI / 2, 0]}>
        <boxGeometry args={[0.2, 0.025, 0.03]} />
      </mesh>
      <Rod a={[0, 0, 0]} b={[0, 0, 0.16]} r={0.045} mat={mats.brass} />
      {h > 0.01 ? (
        <group position={[0, 0, 0.16 + off]}>
          <mesh material={mats.steel} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.04]}>
            <cylinderGeometry args={[0.055, 0.055, 0.08, 14]} />
          </mesh>
          <Pipe
            points={[
              [0, 0, 0.08],
              [0, -0.1, 0.35],
              [0.2, -0.45, 0.6],
              [0.5, -0.5, 1.0],
            ]}
            r={0.035}
            mat={mats.hose}
          />
        </group>
      ) : null}
      {c > 0.01 ? (
        <group position={[0, 0, 0.17 + (1 - c) * 0.25]}>
          <mesh material={mats.dark} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.055, 0.055, 0.05, 14]} />
          </mesh>
          <Rod a={[0.03, -0.02, 0.03]} b={[0.04, -0.12, 0.05]} r={0.004} mat={mats.steel} />
          <mesh material={mats.dark} position={[0.04, -0.15, 0.05]}>
            <boxGeometry args={[0.04, 0.05, 0.015]} />
          </mesh>
          <mesh material={mats.tag} position={[0.05, -0.24, 0.05]} rotation={[0, 0, 0.12 * Math.sin(c * 6)]}>
            <boxGeometry args={[0.07, 0.12, 0.004]} />
          </mesh>
        </group>
      ) : null}
      {/* level gauge: a sight glass in a frame, the water column rising */}
      <group position={gaugeAt}>
        <mesh material={mats.steel} position={[0, 0.3, 0]}>
          <boxGeometry args={[0.1, 0.72, 0.05]} />
        </mesh>
        <mesh material={mats.waterSolid} position={[0, 0.0 + 0.3 * lv, 0.03]}>
          <boxGeometry args={[0.04, 0.6 * lv + 0.001, 0.01]} />
        </mesh>
        <mesh material={mats.glass} position={[0, 0.3, 0.04]}>
          <boxGeometry args={[0.05, 0.62, 0.01]} />
        </mesh>
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} material={mats.ink} position={[0.04, 0.0 + i * 0.2, 0.03]}>
            <boxGeometry args={[0.025, 0.006, 0.004]} />
          </mesh>
        ))}
      </group>
    </group>
  );
};

// ------------------------------------------------------------------------------------------------ hall

/**
 * The fan-coil wall at the back of the hall: from x0 to x1, depth 0.6 (front face at z = 0 local), height h. The span
 * [hotX0, hotX1] behind the hot aisle is the finned coil face; the rest are fan sections (round fans turning
 * `fanTurns`) blowing cooled air back into the cold aisles. The supply pipe runs along the bottom, the return along
 * the top (the scene draws the return's orange). Origin at (0, floor, front face).
 */
export const CoilWall: React.FC<{
  mats: DcMats;
  x0: number;
  x1: number;
  h: number;
  hotX0: number;
  hotX1: number;
  fanTurns: number;
}> = ({mats, x0, x1, h, hotX0, hotX1, fanTurns}) => {
  const finTex = useMemo(() => {
    const w = 64;
    const data = new Uint8Array(w * 4 * 4);
    for (let j = 0; j < 4; j++)
      for (let i = 0; i < w; i++) {
        const o = (j * w + i) * 4;
        const v = i % 4 === 0 ? 120 : 225;
        data[o] = v;
        data[o + 1] = v;
        data[o + 2] = v;
        data[o + 3] = 255;
      }
    const t = new THREE.DataTexture(data, w, 4, THREE.RGBAFormat);
    t.wrapS = THREE.RepeatWrapping;
    t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(12, 1);
    t.needsUpdate = true;
    return t;
  }, []);
  const finMat = useMemo(
    () => new THREE.MeshStandardMaterial({color: raw(REAL.alu), roughness: 0.4, metalness: 0.6, map: finTex}),
    [finTex],
  );
  useEffect(
    () => () => {
      finTex.dispose();
      finMat.dispose();
    },
    [finTex, finMat],
  );
  const fanSpans: [number, number][] = [
    [x0, hotX0],
    [hotX1, x1],
  ].filter(([a, b]) => b - a > 0.6) as [number, number][];
  return (
    <group>
      <mesh material={mats.cabinet} position={[(x0 + x1) / 2, h / 2, -0.3]} castShadow receiveShadow>
        <boxGeometry args={[x1 - x0, h, 0.6]} />
      </mesh>
      {/* the coil face behind the hot aisle */}
      <mesh material={finMat} position={[(hotX0 + hotX1) / 2, h * 0.47, 0.006]}>
        <planeGeometry args={[hotX1 - hotX0 - 0.1, h * 0.78]} />
      </mesh>
      <mesh material={mats.steel} position={[(hotX0 + hotX1) / 2, h * 0.47, 0.01]}>
        <boxGeometry args={[hotX1 - hotX0 - 0.06, 0.04, 0.02]} />
      </mesh>
      {/* fan sections: rows of round fans */}
      {fanSpans.map(([a, b], si) => {
        const n = Math.max(1, Math.floor((b - a) / 0.75));
        return [...Array(n).keys()].flatMap((i) =>
          [0, 1].map((row) => {
            const x = a + (b - a) * ((i + 0.5) / n);
            const y = h * (0.32 + row * 0.36);
            return (
              <group key={`${si}-${i}-${row}`} position={[x, y, 0.01]}>
                <mesh material={mats.dark}>
                  <circleGeometry args={[0.3, 28]} />
                </mesh>
                <group rotation={[0, 0, fanTurns * Math.PI * 2 + i]} position={[0, 0, 0.01]}>
                  {[0, 1, 2, 3, 4].map((k) => (
                    <mesh key={k} material={mats.steel} rotation={[0, 0, (k / 5) * Math.PI * 2]} position={[0, 0, 0]}>
                      <planeGeometry args={[0.04, 0.52]} />
                    </mesh>
                  ))}
                </group>
                <mesh material={mats.steel} position={[0, 0, 0.02]}>
                  <ringGeometry args={[0.28, 0.31, 28]} />
                </mesh>
              </group>
            );
          }),
        );
      })}
    </group>
  );
};

/**
 * Orange shimmer off something hot: soft orange wisps born along a vertical strip (`from`..`to`, y), rising `rise` m and
 * fading; `strength` 0 → 1.5 sets how many show and how strong. Faced to the fixed angle; on the video clock.
 */
export const HeatWisps: React.FC<{
  at: V3;
  /** The strip the wisps leave from: half-extents along x and z, and the y range. */
  spread?: [number, number];
  y0: number;
  y1: number;
  rise?: number;
  strength: number;
  clock: number;
  count?: number;
  size?: number;
  seed?: string;
}> = ({at, spread = [0.05, 0.3], y0, y1, rise = 1.2, strength, clock, count = 10, size = 0.5, seed = 'heat'}) => {
  const mats = useMemo(
    () =>
      [...Array(count).keys()].map(
        () =>
          new THREE.MeshBasicMaterial({
            map: softTexture(),
            color: raw(section.orange),
            transparent: true,
            depthWrite: false,
            opacity: 0,
          }),
      ),
    [count],
  );
  useEffect(() => () => mats.forEach((m) => m.dispose()), [mats]);
  const q = useMemo(
    () => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), new THREE.Vector3(...SECTION_ANGLE)),
    [],
  );
  const s = Math.max(0, Math.min(1.5, strength));
  const share = Math.min(1, s);
  return (
    <group position={at}>
      {mats.map((m, i) => {
        const rank = (i * 0.618034) % 1;
        const vis = 1 - smooth(share - 0.05, share + 0.05, rank);
        const life = 2.2 + random(`${seed}-l-${i}`) * 1.0;
        const ph = clock / life + i / count;
        const u = ((ph % 1) + 1) % 1;
        const n = Math.floor(ph);
        const r = (k: string) => random(`${seed}-${k}-${i}-${n}`);
        const y = y0 + r('y') * (y1 - y0) + u * rise * (0.8 + 0.4 * s);
        const x = (r('x') - 0.5) * 2 * spread[0] + 0.08 * Math.sin(u * 5 + i);
        const z = (r('z') - 0.5) * 2 * spread[1];
        const sz = size * (0.6 + 0.8 * u) * (0.8 + 0.3 * s);
        m.opacity = vis * Math.min(0.42, 0.22 * s + 0.1) * smooth(0, 0.2, u) * (1 - smooth(0.55, 1, u));
        if (m.opacity < 0.005) return null;
        return (
          <mesh key={i} material={m} position={[x, y, z]} quaternion={q} scale={[sz * 0.7, sz, 1]} renderOrder={7}>
            <planeGeometry args={[1, 1]} />
          </mesh>
        );
      })}
    </group>
  );
};
