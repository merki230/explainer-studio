import React, {useMemo} from 'react';
import {random} from 'remotion';
import * as THREE from 'three';
import {MOODS, REAL, section, type Mood} from '../../theme';
import {raw} from '../plaster';
import {cutMaterial, InkLine} from '../section/cutLook';
import {CurveArrow} from '../PushArrow';

type V3 = [number, number, number];
type P2 = [number, number];

/*
 * No. 016 (`ev-cost`, N5–N7): what wears on a car, drawn neutral (style guide § 1: orange is the hidden system only;
 * main-session decision F4: the brakes and the regen are ink and grey in this video). Parts used by `SlicedCar` and
 * `RealWheel`; nothing here is orange or bloomed.
 *
 *  - `TreadBlocks` (in a wheel's own turning frame, radius-1 units, the axle along x): a ring of tread blocks on the
 *    tire's crown, five ribs between the four circumferential grooves, standing `h` proud of the crown. Real geometry:
 *    the blocks get lower as the tread wears (`treadHeight`). While the wheel turns fast (its shutter angle) the gaps
 *    between blocks close into a band, so a turning tread never strobes.
 *  - `TreadGauge` (the wheel's frame, not turning): a small ink depth meter just outboard of the tire's top: a stem
 *    from worn (foot) to new (top), and the tread now as a heavier tick sliding down it as the tread wears.
 *  - `CaliperPads`: two pads under the block caliper (`RealWheel`'s default brake) closing on the rotor with `squeeze`.
 *  - `BrakeDust`: grey puffs off a disc (`REAL.friction`, the pads' own colour), drifting back with the road.
 *  - `OilPan`: the four-cylinder's oil pan (car frame, `GasDrive`'s engine section plane), the pressed-steel shell cut
 *    and hatched, the oil inside it level and dark.
 *  - `InkArrowAlong`: an ink `CurveArrow` that draws on along its route and fades (the regen and weight arrows).
 */

/** The tread's full (new) height above the crown, radius-1 units: 0.06 ≈ 22 mm on the car (🎭 ≈ 2.7× a new tire's 8 mm, so it reads). */
export const TREAD_FULL = 0.06;
/** Its worn height (the blocks never sink flush into the crown: no coplanar faces): ≈ 3 mm. */
export const TREAD_WORN = 0.008;
/** The tread's height above the crown at a depth 0 (worn) → 1 (new). */
export const treadHeight = (depth: number) => TREAD_WORN + (TREAD_FULL - TREAD_WORN) * Math.max(0, Math.min(1, depth));

/** The blocks round the tire and the ribs across it (a ∈ [a0, a1], between the profile's grooves; `RealWheel` § tireProfile). */
const TREAD_N = 72;
const RIBS: P2[] = [
  [-0.232, -0.203],
  [-0.162, -0.098],
  [-0.057, 0.057],
  [0.098, 0.162],
  [0.203, 0.232],
];
/** The blocks' base, just inside the crown (r 1), so no face lies on the crown's surface. */
const TREAD_BASE = 0.996;

/**
 * The tread blocks (see the file comment), in the wheel's turning group (radius-1 units). `h`: their height above the
 * crown; `smear` 0 → 1: the gaps close as the wheel turns fast (from its shutter angle).
 */
export const TreadBlocks: React.FC<{h: number; smear: number; ghost?: number}> = ({h, smear, ghost = 1}) => {
  const mat = useMemo(() => new THREE.MeshPhysicalMaterial({color: raw(REAL.tire), roughness: 0.84, sheen: 0.25, sheenColor: raw('#9a9ea6')}), []);
  // the wheel's ghost (`RealWheel` `ghost`) fades the blocks with it
  const see = Math.max(0, Math.min(1, ghost));
  if ((see < 0.999) !== mat.transparent) {
    mat.transparent = see < 0.999;
    mat.depthWrite = !mat.transparent;
    mat.needsUpdate = true;
  }
  mat.opacity = see;
  const geo = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const count = TREAD_N * RIBS.length;
  const mesh = useMemo(() => {
    const m = new THREE.InstancedMesh(geo, mat, count);
    m.castShadow = true;
    m.receiveShadow = true;
    m.frustumCulled = false;
    return m;
  }, [geo, mat, count]);
  const pitch = (Math.PI * 2) / TREAD_N;
  // the gaps close (but never to zero: the ends of neighbours would be coplanar)
  const k = Math.max(0, Math.min(1, smear));
  const len = pitch * (0.68 + 0.29 * k);
  const top = 1 + Math.max(0.002, h);
  const m4 = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const ax = new THREE.Vector3(1, 0, 0);
  const p = new THREE.Vector3();
  const s = new THREE.Vector3();
  let i = 0;
  RIBS.forEach(([a0, a1], rib) => {
    // alternate ribs offset by half a block, like a real tread
    const off = rib % 2 ? pitch / 2 : 0;
    for (let n = 0; n < TREAD_N; n++, i++) {
      const phi = n * pitch + off;
      const rMid = (TREAD_BASE + top) / 2;
      p.set((a0 + a1) / 2, rMid * Math.cos(phi), rMid * Math.sin(phi));
      q.setFromAxisAngle(ax, phi);
      s.set(a1 - a0, top - TREAD_BASE, len * rMid);
      m4.compose(p, q, s);
      mesh.setMatrixAt(i, m4);
    }
  });
  mesh.instanceMatrix.needsUpdate = true;
  return <primitive object={mesh} />;
};

/** The gauge's span above the crown (radius-1 units, ≈ 14 cm on the car): worn at its foot, new at its top. */
const GAUGE_SPAN = 0.4;

/**
 * The tread gauge (see the file comment), in the wheel's own frame (not turning; radius-1 units): a small depth meter
 * standing just outboard of the tire's top, toward the camera (local −z): an ink stem with a tick at its foot (worn
 * out) and its top (new), and a heavier tick for the tread now that slides down the stem as it wears (🎭 the meter
 * magnifies the depth ≈ 7×, so a few millimetres read at phone size). Ink on a paper outline (the `CurveArrow` 'ink'
 * look), so it reads on rubber and on the cut face; never bloomed, no number. `k` × the line weight.
 */
export const TreadGauge: React.FC<{h: number; k?: number; mood: Mood; opacity?: number}> = ({h, k = 1, mood, opacity = 1}) => {
  const mats = useMemo(
    () => ({
      core: new THREE.MeshBasicMaterial({color: raw(section.cutLine), transparent: true}),
      halo: new THREE.MeshBasicMaterial({color: raw(section.cut), transparent: true, depthWrite: false}),
    }),
    [],
  );
  mats.halo.color.copy(raw(section.cut)).multiplyScalar(0.95 / MOODS[mood].exposure);
  const o = Math.max(0, Math.min(1, opacity));
  mats.core.opacity = o;
  mats.halo.opacity = 0.9 * o;
  if (o < 0.02) return null;
  const x = 0.38;
  const z = -0.24;
  const w = 0.03 * k;
  const y0 = 1.03;
  const y1 = y0 + GAUGE_SPAN;
  const frac = Math.max(0, Math.min(1, (h - TREAD_WORN) / (TREAD_FULL - TREAD_WORN)));
  const yNow = y0 + GAUGE_SPAN * frac;
  // a bar (its ink core and the paper outline round it)
  const bar = (key: string, c: V3, size: V3) => (
    <group key={key} position={c}>
      <mesh material={mats.core} renderOrder={6}>
        <boxGeometry args={size} />
      </mesh>
      <mesh material={mats.halo} renderOrder={5}>
        <boxGeometry args={[size[0] + w * 1.4, size[1] + w * 1.4, size[2] + w * 1.4]} />
      </mesh>
    </group>
  );
  return (
    <group>
      {bar('stem', [x, (y0 + y1) / 2, z], [w * 0.6, GAUGE_SPAN, w * 0.6])}
      {bar('foot', [x, y0, z], [w * 0.8, w * 0.8, 0.16])}
      {bar('top', [x, y1, z], [w * 0.8, w * 0.8, 0.16])}
      {/* the tread now: heavier, longer toward the tire (its ends never on the other ticks' ends) */}
      {bar('now', [x, yNow, z - 0.02], [w * 1.5, w * 1.5, 0.28])}
    </group>
  );
};

/**
 * Two brake pads under the block caliper (in `RealWheel`'s caliper group: x the axle, y radial, z round the wheel),
 * either side of the rotor's friction ring (a −0.11 → −0.03), closing on it with `squeeze` 0 (open: a 🎭 gap ≈ 5 mm)
 * → 1 (on the disc, 0.36 mm clear: no touching faces).
 */
export const CaliperPads: React.FC<{squeeze: number; material: THREE.Material}> = ({squeeze, material}) => {
  // the pads stay inside the caliper's faces (a 0 and −0.15) at every squeeze: no face ever meets one of the box's
  const g = 0.001 + 0.012 * (1 - Math.max(0, Math.min(1, squeeze)));
  const T = 0.016;
  return (
    <>
      <mesh position={[-0.03 + g + T / 2, 0.375, 0]} material={material} castShadow>
        <boxGeometry args={[T, 0.15, 0.25]} />
      </mesh>
      <mesh position={[-0.11 - g - T / 2, 0.375, 0]} material={material} castShadow>
        <boxGeometry args={[T, 0.15, 0.25]} />
      </mesh>
    </>
  );
};

/** One brake-dust puff at a moment: its index, age (s), size, how far it has drifted back (m), life 0 → 1, opacity. */
export type DustPuff = {i: number; age: number; size: number; back: number; u: number; op: number};
/** A dust puff's life (s). */
export const DUST_LIFE = 1.1;

/**
 * Brake dust (see the file comment) in the car's world frame: each puff a few small grey blobs leaving the disc's rear
 * edge at `origin` (just outboard of the wheel's face), drifting back (`dir` the car's facing: +1 right, −1 left) and
 * down a little as they thin out.
 */
export const BrakeDust: React.FC<{puffs: DustPuff[]; origin: V3; dir: number; mood: Mood}> = ({puffs, origin, dir, mood}) => {
  const POOL = 6;
  const BLOBS = 13;
  const mats = useMemo(
    () => [...Array(POOL).keys()].map(() => new THREE.MeshStandardMaterial({color: raw(REAL.friction), roughness: 1, transparent: true, depthWrite: false})),
    [],
  );
  void mood;
  const [ox, oy, oz] = origin;
  return (
    <>
      {puffs.map((p) => {
        const m = mats[p.i % POOL];
        m.opacity = Math.max(0, Math.min(1, p.op));
        const r = p.size * (0.05 + 0.08 * Math.sqrt(p.u));
        return (
          <group key={p.i} position={[ox - dir * (0.05 + p.back), oy - 0.06 * p.u, oz + 0.05 * p.u]}>
            {[...Array(BLOBS).keys()].map((j) => {
              const sd = `dust-${p.i}-${j}`;
              const spread = 0.05 + 0.18 * Math.sqrt(p.u) * p.size;
              const o: V3 = [
                -dir * random(`${sd}-x`) * spread * 1.4,
                (random(`${sd}-y`) - 0.5) * spread,
                (random(`${sd}-z`) - 0.3) * spread * 0.6,
              ];
              const k = 0.5 + 0.5 * random(`${sd}-r`);
              return (
                <mesh key={j} material={m} position={o} scale={r * k} renderOrder={4}>
                  <sphereGeometry args={[1, 10, 8]} />
                </mesh>
              );
            })}
          </group>
        );
      })}
    </>
  );
};

/** The four-cylinder's section plane, crank centre and lean (`GasDrive` `GAS`, repeated here so this file stays standalone). */
const PAN = {z: 0.3, crank: [1.68, 0.34] as P2, lean: 0.15, back: -0.25};
/** A point in the cylinder's frame (along its axis, across it) → the car frame (x, y), as `GasDrive`'s `cyl`. */
const cyl = (along: number, across = 0): P2 => {
  const s = Math.sin(PAN.lean);
  const c = Math.cos(PAN.lean);
  return [PAN.crank[0] - s * along + c * across, PAN.crank[1] + c * along + s * across];
};

/** Clip a polygon to y ≤ level (Sutherland–Hodgman on one edge). */
const clipBelow = (pts: P2[], level: number): P2[] => {
  const out: P2[] = [];
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % pts.length];
    const ina = a[1] <= level;
    const inb = b[1] <= level;
    if (ina) out.push(a);
    if (ina !== inb) {
      const u = (level - a[1]) / (b[1] - a[1]);
      out.push([a[0] + u * (b[0] - a[0]), level]);
    }
  }
  return out;
};

/** The oil pan's outline under the crankcase (cylinder frame), outer and inner (the shell ≈ 8 mm, 🎭 a little thick; the sump ≈ 15 cm deep). */
const PAN_OUTER: P2[] = [
  [-0.123, -0.172],
  [-0.123, 0.172],
  [-0.15, 0.17],
  [-0.162, 0.13],
  [-0.162, 0.07],
  [-0.262, 0.05],
  [-0.27, 0.0],
  [-0.27, -0.11],
  [-0.215, -0.15],
  [-0.15, -0.17],
];
const PAN_INNER: P2[] = [
  [-0.131, -0.162],
  [-0.131, 0.162],
  [-0.145, 0.16],
  [-0.154, 0.125],
  [-0.154, 0.062],
  [-0.254, 0.043],
  [-0.261, 0.0],
  [-0.261, -0.106],
  [-0.21, -0.142],
  [-0.148, -0.16],
];

/** Where the oil pan's callout points (car frame): the oil's cut face, just in front of the section plane. */
export const OIL_PAN_POINT: V3 = [...cyl(-0.23, -0.04), PAN.z + 0.01] as V3;

/**
 * The oil pan (see the file comment), in the car frame (`SlicedCar`'s body group, beside `EngineBay`): its cut face on
 * the engine's section plane (hatched `cut`, inked), the steel shell running back across the car, the oil inside it
 * level at `level` of the sump's depth (default 0.55), its cut face flat `REAL.coffee` dark brown. `tremor`: the
 * running engine's offset (it is bolted to the block).
 */
export const OilPan: React.FC<{mood: Mood; inkScale?: number; level?: number; tremor?: V3}> = ({mood, inkScale = 1, level = 0.55, tremor}) => {
  const mats = useMemo(
    () => ({
      cut: cutMaterial(),
      steel: new THREE.MeshPhysicalMaterial({color: raw(REAL.labDark), metalness: 0.45, roughness: 0.5}),
      oil: new THREE.MeshBasicMaterial({color: raw(REAL.coffee)}),
      oilSide: new THREE.MeshPhysicalMaterial({color: raw(REAL.coffee), roughness: 0.2, clearcoat: 1}),
    }),
    [],
  );
  mats.oil.color.copy(raw(REAL.coffee)).multiplyScalar(1 / MOODS[mood].exposure);
  const geo = useMemo(() => {
    const outer = PAN_OUTER.map(([a, b]) => cyl(a, b));
    const inner = PAN_INNER.map(([a, b]) => cyl(a, b));
    const ys = inner.map((p) => p[1]);
    const lo = Math.min(...ys);
    const hi = Math.max(...ys);
    const oil = clipBelow(inner, lo + (hi - lo) * Math.max(0.05, Math.min(0.95, level)));
    const shape = (pts: P2[], holes: P2[][] = []) => {
      const s = new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(x, y)));
      for (const h of holes) s.holes.push(new THREE.Path(h.map(([x, y]) => new THREE.Vector2(x, y))));
      return s;
    };
    const extrude = (s: THREE.Shape, z0: number, z1: number) => {
      const g = new THREE.ExtrudeGeometry(s, {depth: z1 - z0, bevelEnabled: false, curveSegments: 4});
      g.translate(0, 0, z0);
      return g;
    };
    return {
      shell: extrude(shape(outer, [[...inner].reverse()]), PAN.back, PAN.z),
      // the oil's cut face 1 mm behind the shell's (its edges meet the shell's inner edge: no overlap, no coplanar fill)
      oil: extrude(shape(oil), PAN.back + 0.01, PAN.z - 0.001),
      ink: [outer, inner].map((p) => p.map(([x, y]) => [x, y, PAN.z + 0.002] as V3)),
      oilInk: oil.map(([x, y]) => [x, y, PAN.z + 0.0015] as V3),
    };
  }, [level]);
  const ink = 0.004 * inkScale;
  return (
    <group position={tremor}>
      <mesh geometry={geo.shell} material={[mats.cut, mats.steel]} castShadow receiveShadow />
      <mesh geometry={geo.oil} material={[mats.oil, mats.oilSide]} />
      {geo.ink.map((pts, i) => (
        <InkLine key={i} points={pts} thickness={ink} />
      ))}
      <InkLine points={geo.oilInk} thickness={ink * 0.6} color={section.cutLine} />
    </group>
  );
};

/** An arrow's state from `{at, drawFor, fadeAt}` keys: how far it has drawn (0 → 1) and its opacity. */
export const inkArrowState = (k: {at: number; drawFor?: number; fadeAt?: number}, t: number) => {
  const d = Math.max(0.05, k.drawFor ?? 0.6);
  const u = Math.max(0, Math.min(1, (t - k.at) / d));
  const drawn = u * u * (3 - 2 * u);
  const f = k.fadeAt == null ? 0 : Math.max(0, Math.min(1, (t - k.fadeAt) / 0.5));
  return {drawn, opacity: t < k.at ? 0 : 1 - f * f * (3 - 2 * f)};
};

/** An ink arrow (CurveArrow 'ink': a paper outline, never bloomed) drawing on along `points` to `drawn` (0 → 1). */
export const InkArrowAlong: React.FC<{points: V3[]; drawn: number; opacity: number; radius: number; mood: Mood}> = ({
  points,
  drawn,
  opacity,
  radius,
  mood,
}) => (drawn > 0.02 && opacity > 0.02 ? <CurveArrow points={points} from={0} to={drawn} kind="ink" radius={radius} opacity={opacity} mood={mood} /> : null);
