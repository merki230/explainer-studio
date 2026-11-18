import React, {useEffect, useMemo} from 'react';
import * as THREE from 'three';
import {section, type Mood} from '../../theme';
import {raw} from '../plaster';

type V3 = [number, number, number];

/*
 * No. 020: strokes of constant on-screen width, rebuilt each frame (pure functions of the props): `InkRibbons` (§ 5
 * Physical events in ink: a 3 px `cutLine` stroke on a 2 px `cut` halo, unlit, never bloomed), `OrangeRibbons` (a system
 * line: core and 25 % halo, bloomed) and `OrangeDots` (node dots facing a direction).
 */

/** Metres per screen pixel at a camera distance (the vertical frame: fov 26°, 1920 px tall). */
export const metresPerPx = (d: number) => (2 * Math.tan((13 * Math.PI) / 180) * d) / 1920;

/** A polyline to draw, with its own opacity (0 → 1) and width factor. */
export type Stroke = {pts: V3[]; alpha?: number; width?: number};

/** Flat ribbons along polylines, `width` across, in the plane whose normal is `normal` (a view vector faces the camera). */
export const ribbonGeometry = (strokes: Stroke[], width: number, normal: V3): THREE.BufferGeometry => {
  const pos: number[] = [];
  const col: number[] = [];
  const idx: number[] = [];
  const n = new THREE.Vector3(...normal).normalize();
  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const tg = new THREE.Vector3();
  const sd = new THREE.Vector3();
  for (const s of strokes) {
    const P = s.pts;
    if (P.length < 2 || (s.alpha ?? 1) <= 0.003) continue;
    const w = (width * (s.width ?? 1)) / 2;
    const base = pos.length / 3;
    for (let i = 0; i < P.length; i++) {
      a.set(...P[Math.max(0, i - 1)]);
      b.set(...P[Math.min(P.length - 1, i + 1)]);
      tg.subVectors(b, a);
      if (tg.lengthSq() < 1e-14) tg.set(1, 0, 0);
      sd.crossVectors(tg.normalize(), n);
      if (sd.lengthSq() < 1e-12) sd.set(0, 1, 0);
      sd.normalize().multiplyScalar(w);
      const [x, y, z] = P[i];
      pos.push(x + sd.x, y + sd.y, z + sd.z, x - sd.x, y - sd.y, z - sd.z);
      const al = s.alpha ?? 1;
      col.push(1, 1, 1, al, 1, 1, 1, al);
      if (i > 0) {
        const k = base + 2 * i;
        idx.push(k - 2, k - 1, k, k - 1, k + 1, k);
      }
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 4));
  g.setIndex(idx);
  return g;
};

/** A circle's polyline (in the plane spanned by `u`, `v` round `c`), from angle a0 over `span` rad. */
export const arcPts = (c: V3, r: number, u: V3, v: V3, a0 = 0, span = Math.PI * 2, n = 48): V3[] =>
  [...Array(n + 1).keys()].map((i) => {
    const a = a0 + (span * i) / n;
    const ca = Math.cos(a) * r;
    const sa = Math.sin(a) * r;
    return [c[0] + u[0] * ca + v[0] * sa, c[1] + u[1] * ca + v[1] * sa, c[2] + u[2] * ca + v[2] * sa];
  });

const useRibbon = (strokes: Stroke[], width: number, normal: V3) => {
  const geo = ribbonGeometry(strokes, width, normal);
  useEffect(() => () => geo.dispose(), [geo]);
  return geo;
};

/**
 * § 5 Physical events in ink: polylines drawn as a `cutLine` stroke `px` wide on screen on a `halo` px `cut` halo each
 * side (Night: swapped), solid, unlit, out of the bloom layer. `unitPerPx`: the local units one screen pixel spans.
 */
export const InkRibbons: React.FC<{
  strokes: Stroke[];
  unitPerPx: number;
  normal: V3;
  mood: Mood;
  px?: number;
  halo?: number;
  opacity?: number;
  onTop?: boolean;
  renderOrder?: number;
}> = ({strokes, unitPerPx, normal, mood, px = 3, halo = 2, opacity = 1, onTop = false, renderOrder = 22}) => {
  const mats = useMemo(
    () =>
      [0, 1].map(
        () =>
          new THREE.MeshBasicMaterial({
            vertexColors: true,
            transparent: true,
            depthWrite: false,
            side: THREE.DoubleSide,
            fog: false,
            toneMapped: false,
          }),
      ),
    [],
  );
  useEffect(() => () => mats.forEach((m) => m.dispose()), [mats]);
  const night = mood === 'night';
  mats[0].color.copy(raw(night ? section.cutLine : section.cut));
  mats[1].color.copy(raw(night ? section.cut : section.cutLine));
  mats.forEach((m) => {
    m.opacity = Math.max(0, Math.min(1, opacity));
    m.depthTest = !onTop;
  });
  const haloGeo = useRibbon(strokes, (px + 2 * halo) * unitPerPx, normal);
  const coreGeo = useRibbon(strokes, px * unitPerPx, normal);
  if (opacity <= 0.003) return null;
  return (
    <>
      <mesh geometry={haloGeo} material={mats[0]} renderOrder={renderOrder} frustumCulled={false} />
      <mesh geometry={coreGeo} material={mats[1]} renderOrder={renderOrder + 1} frustumCulled={false} />
    </>
  );
};

/** A system line (§ 5): an `orange` core `px` wide on screen and a 25 % halo 3× as wide, both bloomed. */
export const OrangeRibbons: React.FC<{
  strokes: Stroke[];
  unitPerPx: number;
  normal: V3;
  px?: number;
  opacity?: number;
  onTop?: boolean;
  renderOrder?: number;
}> = ({strokes, unitPerPx, normal, px = 5, opacity = 1, onTop = false, renderOrder = 26}) => {
  const mats = useMemo(
    () =>
      [0.25, 1].map(
        (o) =>
          new THREE.MeshBasicMaterial({
            color: raw(section.orange),
            vertexColors: true,
            transparent: true,
            depthWrite: false,
            side: THREE.DoubleSide,
            fog: false,
            opacity: o,
          }),
      ),
    [],
  );
  useEffect(() => () => mats.forEach((m) => m.dispose()), [mats]);
  const o = Math.max(0, Math.min(1, opacity));
  mats[0].opacity = 0.25 * o;
  mats[1].opacity = o;
  mats.forEach((m) => (m.depthTest = !onTop));
  const haloGeo = useRibbon(strokes, 3 * px * unitPerPx, normal);
  const coreGeo = useRibbon(strokes, px * unitPerPx, normal);
  if (o <= 0.003) return null;
  return (
    <>
      <mesh geometry={haloGeo} material={mats[0]} renderOrder={renderOrder} userData={{glow: true}} frustumCulled={false} />
      <mesh geometry={coreGeo} material={mats[1]} renderOrder={renderOrder + 1} userData={{glow: true}} frustumCulled={false} />
    </>
  );
};

/** Filled discs (node dots) facing `normal`: orange core + 25 % halo (bloomed). */
export const OrangeDots: React.FC<{dots: {c: V3; r: number; alpha?: number}[]; normal: V3; onTop?: boolean}> = ({dots, normal, onTop}) => {
  const mats = useMemo(
    () => ({
      core: new THREE.MeshBasicMaterial({color: raw(section.orange), transparent: true, depthWrite: false, fog: false}),
      halo: new THREE.MeshBasicMaterial({color: raw(section.orange), transparent: true, depthWrite: false, fog: false, opacity: 0.25}),
      disc: new THREE.CircleGeometry(1, 32),
    }),
    [],
  );
  useEffect(() => () => [mats.core, mats.halo, mats.disc].forEach((m) => m.dispose()), [mats]);
  mats.core.depthTest = !onTop;
  mats.halo.depthTest = !onTop;
  const q = useMemo(
    () => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), new THREE.Vector3(...normal).normalize()),
    [normal],
  );
  return (
    <>
      {dots.map((d, i) =>
        (d.alpha ?? 1) > 0.01 ? (
          <group key={i} position={d.c} quaternion={q}>
            <mesh geometry={mats.disc} material={mats.halo} scale={d.r * 2} renderOrder={28} userData={{glow: true}} />
            <mesh geometry={mats.disc} material={mats.core} scale={d.r} renderOrder={29} userData={{glow: true}} />
          </group>
        ) : null,
      )}
    </>
  );
};

