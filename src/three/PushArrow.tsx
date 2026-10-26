import React, {useEffect, useMemo} from 'react';
import * as THREE from 'three';
import {ease, keyedValue, type Keyed} from '../scenes/keyframes';
import {MOODS, section, type Mood} from '../theme';
import {raw} from './plaster';
import {SECTION_ANGLE} from './section/SectionCamera';

type V3 = [number, number, number];

/*
 * Arrows for the push (No. 007, N4). Orange is the system (§ 5): the core and its halo bloom, like a path.
 *
 *  - `PushArrow`: the push at a driven wheel's contact patch, a straight tube with a flat head lying in a
 *    plane (by default the road's cut face, normal +z), pointing forward; its length comes from keys (🎭 an
 *    illustrative scale, not newtons), a node dot at its tail (all that shows at zero), and a one-shot
 *    `brighten` (paler core, stronger halo, a touch thicker, then back).
 *  - `CurveArrow`: an arrow along part of a route (a cable), the head facing the camera; 'orange' (the
 *    battery's push, bloomed) or 'ink' (a second element that is not the system: unlit ink on a paper
 *    outline, never bloomed), e.g. the motor's back-voltage.
 */

/** The § 5 halo: 0.055 / 0.018 × the core radius, 25%. */
const HALO = {scale: 0.055 / 0.018, opacity: 0.25};
/** The § 5 node dot's radius as a share of the vibration path's core (0.035 / 0.0225). */
const NODE_K = 0.035 / 0.0225;

/** A flat arrowhead: a triangle with its tip at +x 1, its base at x 0, half width 1, extruded `depth` (unit), centred in z. */
const headGeometry = (depth: number) => {
  const s = new THREE.Shape();
  s.moveTo(0, -1);
  s.lineTo(1, 0);
  s.lineTo(0, 1);
  s.closePath();
  const g = new THREE.ExtrudeGeometry(s, {depth, bevelEnabled: false});
  g.translate(0, 0, -depth / 2);
  return g;
};

/** A rotation taking +x to `dir` and +z to `normal` (made orthogonal to `dir`). */
const basis = (dir: V3, normal: V3) => {
  const x = new THREE.Vector3(...dir).normalize();
  const n = new THREE.Vector3(...normal);
  const z = n.sub(x.clone().multiplyScalar(n.dot(x)));
  if (z.lengthSq() < 1e-8) z.set(0, 1, 0).sub(x.clone().multiplyScalar(x.y));
  z.normalize();
  const y = new THREE.Vector3().crossVectors(z, x);
  return new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, y, z));
};

const useOrangeMats = () => {
  const mats = useMemo(
    () => ({
      core: new THREE.MeshBasicMaterial({color: raw(section.orange), transparent: true}),
      halo: new THREE.MeshBasicMaterial({color: raw(section.orange), transparent: true, depthWrite: false}),
      node: new THREE.MeshBasicMaterial({color: raw(section.orange), transparent: true}),
    }),
    [],
  );
  useEffect(() => () => Object.values(mats).forEach((m) => m.dispose()), [mats]);
  return mats;
};

/** The push arrow's keys as a `SlicedCar` / `DriveUnitScene` prop. */
export type PushArrowKeys = {
  /** Length 0 → 1 (× `full`), a constant or keys (eased cubic between keys). 0: only the node dot. */
  length: Keyed;
  /** Seconds of a one-shot brighten (in 0.15 s, out by 0.75 s). One number or several. Default none. */
  brighten?: number | number[];
  /** The full length in metres (🎭 illustrative scale). Default per mount (1.1 on a car, 0.4 on the drive unit). */
  full?: number;
};

/** The arrow's length (m) and brighten (0 → 1) at t from its keys. */
export const pushArrowState = (k: PushArrowKeys, t: number, full: number) => {
  const shots = k.brighten === undefined ? [] : Array.isArray(k.brighten) ? k.brighten : [k.brighten];
  const brighten = shots.reduce((m, a) => Math.max(m, ease(t, a, a + 0.15) * (1 - ease(t, a + 0.3, a + 0.75))), 0);
  return {length: Math.max(0, keyedValue(k.length, t, 0)) * (k.full ?? full), brighten};
};

export type PushArrowProps = {
  /** The tail: the contact patch (world). */
  position: V3;
  /** The push's direction (world; default −x, forward for a car facing left). */
  direction?: V3;
  /** The head's plane normal (default +z: lying in the road's cut face). */
  normal?: V3;
  /** Current length (m), tail to tip. 0: only the node dot. */
  length: number;
  /** Core radius (m, default 0.03: a little over the path's 0.0225, so the push reads as the result). */
  radius?: number;
  /** 0 → 1: the one-shot brighten (see `pushArrowState`). */
  brighten?: number;
  /** 0 → 1: the arrow's strength (fade it out). Default 1. */
  glow?: number;
  /** Draw the node dot at the tail (default true). */
  node?: boolean;
};

/** The push at a contact patch (see the file comment). */
export const PushArrow: React.FC<PushArrowProps> = ({
  position,
  direction = [-1, 0, 0],
  normal = [0, 0, 1],
  length,
  radius = 0.03,
  brighten = 0,
  glow = 1,
  node = true,
}) => {
  const mats = useOrangeMats();
  const geo = useMemo(
    () => ({
      shaft: new THREE.CylinderGeometry(1, 1, 1, 16).rotateZ(-Math.PI / 2).translate(0.5, 0, 0),
      head: headGeometry(1),
      dot: new THREE.SphereGeometry(1, 16, 12),
    }),
    [],
  );
  useEffect(() => () => Object.values(geo).forEach((g) => g.dispose()), [geo]);
  const q = useMemo(() => basis(direction, normal), [direction[0], direction[1], direction[2], normal[0], normal[1], normal[2]]); // eslint-disable-line react-hooks/exhaustive-deps

  const g = Math.max(0, Math.min(1, glow));
  const b = Math.max(0, Math.min(1, brighten));
  const r = radius * (1 + 0.3 * b);
  // the head: 2.6 radii wide each side, 5.5 radii long, shrinking with a short arrow
  const L = Math.max(0, length);
  const headL = Math.min(r * 5.5, L);
  const headW = r * 2.6 * (headL / (r * 5.5));
  const shaftL = Math.max(0, L - headL * 0.9);
  mats.core.color.copy(raw(section.orange)).lerp(raw(section.orangeDot), 0.55 * b);
  mats.core.opacity = g;
  mats.halo.opacity = (HALO.opacity + 0.15 * b) * g;
  mats.node.opacity = g;
  const show = g > 0.01;
  const hs = HALO.scale;

  return (
    <group position={position} quaternion={q} visible={show}>
      {node ? (
        <mesh geometry={geo.dot} material={mats.node} scale={radius * NODE_K * (1 + 0.2 * b)} userData={{glow: true}} />
      ) : null}
      {L > 0.002 ? (
        <>
          {shaftL > 0.001 ? (
            <>
              <mesh geometry={geo.shaft} material={mats.core} scale={[shaftL, r, r]} userData={{glow: true}} renderOrder={2} />
              <mesh
                geometry={geo.shaft}
                material={mats.halo}
                scale={[shaftL, r * hs, r * hs]}
                userData={{glow: true}}
                renderOrder={3}
              />
            </>
          ) : null}
          <group position={[L - headL, 0, 0]}>
            <mesh geometry={geo.head} material={mats.core} scale={[headL, headW, r * 1.6]} userData={{glow: true}} renderOrder={2} />
            <mesh
              geometry={geo.head}
              material={mats.halo}
              position={[-r * (hs - 1) * 0.6, 0, 0]}
              scale={[headL + r * (hs - 1) * 1.6, headW + r * (hs - 1), r * hs]}
              userData={{glow: true}}
              renderOrder={3}
            />
          </group>
        </>
      ) : null}
    </group>
  );
};

/** The parameter steps a `CurveArrow`'s ends snap to (the tube rebuilds only when they change). */
const U_STEPS = 240;

export type CurveArrowProps = {
  /** The route (world or the parent's frame), a smooth curve through its points. */
  points: V3[];
  /** Where the tail and the tip are along it (0 → 1, by length). The head points from `from` toward `to`. */
  from: number;
  to: number;
  /** 'orange' (the system: core + halo, bloomed) or 'ink' (unlit ink on a paper outline, never bloomed). */
  kind?: 'orange' | 'ink';
  /** Core radius (m, default 0.012). */
  radius?: number;
  /** 0 → 1: strength (fade). Default 1. */
  opacity?: number;
  /** The mood (the ink's paper outline follows its exposure). Default 'day'. */
  mood?: Mood;
  /** The direction toward the camera in this frame, for the flat head's plane (default `SECTION_ANGLE`). */
  view?: V3;
};

/** An arrow along part of a route (see the file comment). */
export const CurveArrow: React.FC<CurveArrowProps> = ({
  points,
  from,
  to,
  kind = 'orange',
  radius = 0.012,
  opacity = 1,
  mood = 'day',
  view = SECTION_ANGLE,
}) => {
  const key = JSON.stringify(points);
  const curve = useMemo(
    () => new THREE.CatmullRomCurve3((JSON.parse(key) as V3[]).map((p) => new THREE.Vector3(...p))),
    [key],
  );
  const len = curve.getLength();
  const ink = kind === 'ink';
  const r = radius;
  const headL = r * 5.5;
  // the shaft stops under the head; ends snapped so the tube rebuilds only on a visible change
  const snap = (u: number) => Math.round(Math.max(0, Math.min(1, u)) * U_STEPS) / U_STEPS;
  const dirSign = to >= from ? 1 : -1;
  const span = Math.abs(to - from) * len;
  const hl = Math.min(headL, span);
  const u0 = snap(from);
  const u1 = snap(to - dirSign * (hl * 0.9) / Math.max(len, 1e-6));
  const uTip = snap(to);
  const shaftKey = `${u0}|${u1}`;
  const shaft = useMemo(() => {
    if (Math.abs(u1 - u0) < 1 / U_STEPS) return null;
    const n = 12;
    const pts = [...Array(n + 1).keys()].map((i) => curve.getPointAt(u0 + ((u1 - u0) * i) / n));
    const sub = new THREE.CatmullRomCurve3(pts);
    return {
      core: new THREE.TubeGeometry(sub, 24, r, 10, false),
      halo: new THREE.TubeGeometry(sub, 24, r * (ink ? 2.1 : HALO.scale), 10, false),
    };
  }, [shaftKey, curve, r, ink]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => {
    shaft?.core.dispose();
    shaft?.halo.dispose();
  }, [shaft]);
  const headGeo = useMemo(() => headGeometry(1), []);
  useEffect(() => () => headGeo.dispose(), [headGeo]);

  const mats = useMemo(() => {
    const m = MOODS[mood];
    return ink
      ? {
          core: new THREE.MeshBasicMaterial({color: raw(section.cutLine), transparent: true}),
          // a paper outline, so the ink reads on dark steel and copper
          halo: new THREE.MeshBasicMaterial({
            color: raw(section.cut).multiplyScalar(0.95 / m.exposure),
            transparent: true,
            depthWrite: false,
          }),
        }
      : {
          core: new THREE.MeshBasicMaterial({color: raw(section.orange), transparent: true}),
          halo: new THREE.MeshBasicMaterial({color: raw(section.orange), transparent: true, depthWrite: false}),
        };
  }, [ink, mood]);
  useEffect(() => () => Object.values(mats).forEach((m) => m.dispose()), [mats]);
  const o = Math.max(0, Math.min(1, opacity));
  mats.core.opacity = o;
  mats.halo.opacity = (ink ? 0.9 : HALO.opacity) * o;

  if (o < 0.01 || span < 0.002) return null;
  // the head at the tip, along the curve's tangent there, its face toward the camera
  const tip = curve.getPointAt(uTip);
  const tan = curve.getTangentAt(uTip).multiplyScalar(dirSign);
  const q = basis([tan.x, tan.y, tan.z], view);
  const headW = r * 2.6 * (hl / headL);
  const glow = ink ? undefined : {glow: true};
  const hs = ink ? 2.1 : HALO.scale;
  return (
    <group>
      {shaft ? (
        <>
          <mesh geometry={shaft.core} material={mats.core} userData={glow} renderOrder={ink ? 6 : 2} />
          <mesh geometry={shaft.halo} material={mats.halo} userData={glow} renderOrder={ink ? 5 : 3} />
        </>
      ) : null}
      <group position={[tip.x, tip.y, tip.z]} quaternion={q}>
        <group position={[-hl, 0, 0]}>
          <mesh geometry={headGeo} material={mats.core} scale={[hl, headW, r * 1.6]} userData={glow} renderOrder={ink ? 6 : 2} />
          <mesh
            geometry={headGeo}
            material={mats.halo}
            position={[-r * (hs - 1) * 0.6, 0, -r * 0.5]}
            scale={[hl + r * (hs - 1) * 1.6, headW + r * (hs - 1), r * hs]}
            userData={glow}
            renderOrder={ink ? 5 : 3}
          />
        </group>
      </group>
    </group>
  );
};
