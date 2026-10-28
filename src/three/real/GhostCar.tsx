import React, {useEffect, useMemo} from 'react';
import * as THREE from 'three';
import {CHARGE, MOODS, section, type Mood} from '../../theme';
import {raw} from '../plaster';
import type {ShellProfile} from './CarShell';
import {carSilhouette} from './RealCar';

type V3 = [number, number, number];
type P2 = [number, number];

/*
 * No. 010 (N7): a car that isn't there, drawn as a dashed ink outline (the drawing convention for "not here";
 * brand-director, style guide v0.13: `CHARGE.ghost` in Day, `section.cut` at Night, 3 px on screen, 16 px dashes,
 * 10 px gaps, no fill; the scene sizes them from the camera distance): the side silhouette of a cut car's shape (`carSilhouette`: the body with its
 * glasshouse, the windows, both wheels) in one plane, standing where the car would park. It draws on (every
 * line from its start, together) and fades. Ink, unlit, never bloomed, never orange. Mount it in the car's
 * frame (x forward; mirror the group for a car facing −x); its plane is at `z`.
 */

/** Points of a closed polyline / circle, resampled to `step` metres. */
const resample = (pts: P2[], closed: boolean, step: number): P2[] => {
  const ring = closed ? [...pts, pts[0]] : pts;
  const out: P2[] = [];
  for (let i = 0; i < ring.length - 1; i++) {
    const [ax, ay] = ring[i];
    const [bx, by] = ring[i + 1];
    const n = Math.max(1, Math.ceil(Math.hypot(bx - ax, by - ay) / step));
    for (let k = 0; k < n; k++) out.push([ax + ((bx - ax) * k) / n, ay + ((by - ay) * k) / n]);
  }
  out.push(ring[ring.length - 1]);
  return out;
};
const circle = (c: P2, r: number, n = 48): P2[] =>
  [...Array(n).keys()].map((i) => [c[0] + r * Math.cos((i / n) * Math.PI * 2), c[1] + r * Math.sin((i / n) * Math.PI * 2)]);

/** Dashes along a polyline up to `upTo` of its length: flat quads in the plane, `w` wide. */
const dashes = (pts: P2[], upTo: number, dash: number, gap: number, w: number, z: number, out: {pos: number[]; idx: number[]}) => {
  const seg: number[] = [0];
  for (let i = 1; i < pts.length; i++) seg.push(seg[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const total = seg[seg.length - 1];
  const end = total * Math.max(0, Math.min(1, upTo));
  const at = (s: number): {p: P2; t: P2} => {
    let i = 1;
    while (i < seg.length - 1 && seg[i] < s) i++;
    const k = (s - seg[i - 1]) / Math.max(1e-9, seg[i] - seg[i - 1]);
    const [ax, ay] = pts[i - 1];
    const [bx, by] = pts[i];
    const l = Math.hypot(bx - ax, by - ay) || 1;
    return {p: [ax + (bx - ax) * k, ay + (by - ay) * k], t: [(bx - ax) / l, (by - ay) / l]};
  };
  for (let s0 = 0; s0 < end; s0 += dash + gap) {
    const s1 = Math.min(end, s0 + dash);
    const n = Math.max(1, Math.ceil((s1 - s0) / 0.03));
    const base = out.pos.length / 3;
    for (let k = 0; k <= n; k++) {
      const {p, t} = at(s0 + ((s1 - s0) * k) / n);
      const nx = -t[1] * (w / 2);
      const ny = t[0] * (w / 2);
      out.pos.push(p[0] + nx, p[1] + ny, z, p[0] - nx, p[1] - ny, z);
      if (k > 0) {
        const a = base + (k - 1) * 2;
        out.idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
      }
    }
  }
};

export type GhostCarProps = {
  mood?: Mood;
  /** The car's shape (its cut silhouette). Default 'sedan'. */
  shape?: ShellProfile;
  /** How much of every line is drawn, 0 → 1. */
  draw: number;
  /** 0 → 1: its strength (fade out). Default 1. */
  opacity?: number;
  /** The plane's z (car frame). Default 0 (the car's middle). */
  z?: number;
  /** The line's width (m); the scene keeps it ≈ 3–4 px. Default 0.035. */
  width?: number;
  /** Dash and gap lengths (m); the scene sets them to 16 and 10 px on screen. Default 0.2 and 0.12. */
  dash?: [number, number];
};

/** The dashed outline of a car that isn't there (see the file comment). */
export const GhostCar: React.FC<GhostCarProps> = ({mood = 'day', shape = 'sedan', draw, opacity = 1, z = 0, width = 0.035, dash = [0.2, 0.12]}) => {
  const lines = useMemo(() => {
    const s = carSilhouette(shape);
    return [
      resample(s.body, true, 0.02),
      ...s.windows.map((w) => resample(w, true, 0.02)),
      ...s.wheels.map((wh) => resample(circle(wh.c, wh.r), true, 0.02)),
    ];
  }, [shape]);
  const dq = Math.round(Math.max(0, Math.min(1, draw)) * 60) / 60;
  const dk = [Math.round(dash[0] * 200) / 200, Math.round(dash[1] * 200) / 200];
  const wq = Math.round(width * 2000) / 2000;
  const geo = useMemo(() => {
    const out = {pos: [] as number[], idx: [] as number[]};
    for (const l of lines) dashes(l, dq, dk[0], dk[1], wq, z, out);
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(out.pos, 3));
    g.setIndex(out.idx);
    return g;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lines, dq, wq, z, dk[0], dk[1]]);
  useEffect(() => () => geo.dispose(), [geo]);
  const ink = mood === 'night' ? section.cut : CHARGE.ghost;
  const mat = useMemo(
    () => new THREE.MeshBasicMaterial({color: raw(ink), transparent: true, side: THREE.DoubleSide, depthWrite: false}),
    [ink],
  );
  useEffect(() => () => mat.dispose(), [mat]);
  mat.color.copy(raw(ink)).multiplyScalar(1 / MOODS[mood].exposure);
  const o = Math.max(0, Math.min(1, opacity));
  mat.opacity = o;
  if (o < 0.01 || dq <= 0) return null;
  return <mesh geometry={geo} material={mat} renderOrder={7} />;
};

/** The ghost's roof point (car frame), for a callout's anchor. */
export const ghostRoof = (shape: ShellProfile = 'sedan', z = 0): V3 => {
  const r = carSilhouette(shape).roof;
  return [r[0], r[1], z];
};
