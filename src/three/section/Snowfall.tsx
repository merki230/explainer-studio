import React, {useMemo} from 'react';
import {random} from 'remotion';
import * as THREE from 'three';
import {MOODS, WINTER, type Mood} from '../../theme';
import {raw} from '../plaster';

const mod = (x: number, m: number) => ((x % m) + m) % m;

/** Falling snow (winter): seeded flakes in a box round the lanes, falling, swaying, carried by gusts. */
export const Snow: React.FC<{
  t: number;
  density: number;
  gusts: number[];
  y0: number;
  y1: number;
  mood: Mood;
  maxPx?: number;
  cam?: THREE.Vector3;
  /** The box across x (width, centre) and z (from, depth). Defaults: 22 m about x −1, z −3 → 2.6 (the twin corner). */
  box?: {xW?: number; xC?: number; z0?: number; zD?: number};
  /**
   * No. 018: a loop length (s, on the same clock as `t`): each flake's fall and sway are rounded to whole cycles in it,
   * so with no net gust push the snow at t + loop is the snow at t (a video that ends on its first frame). Default none.
   */
  loop?: number;
  /**
   * No. 018: between `from` and `to` (the clock of `t`) each flake drifts steadily back by its whole push from all the
   * listed gusts (modulo the box width), so after `to` the gusts' net push is undone (a loop's last scene). Default none.
   */
  gustBack?: {from: number; to: number};
  /** No. 018: boxes (min, max corners) no flake is drawn in (a house, a cut-open unit or car the snow can't fall through). */
  holes?: [[number, number, number], [number, number, number]][];
}> = ({
  t,
  density,
  gusts,
  y0,
  y1,
  mood,
  maxPx,
  cam,
  box,
  loop,
  gustBack,
  holes,
}) => {
  // a flake's radius for `maxPx` across at its distance (fov 26°, 1920 px tall)
  const pxR = maxPx && cam ? ((maxPx / 2) * 2 * Math.tan((13 * Math.PI) / 180)) / 1920 : 0;
  const n = Math.round(420 * density);
  const geo = useMemo(() => new THREE.SphereGeometry(1, 6, 4), []);
  const mat = useMemo(() => new THREE.MeshBasicMaterial({color: '#ffffff', transparent: true, opacity: 0.9, depthWrite: false}), []);
  mat.color.copy(raw(WINTER.flake)).multiplyScalar(0.95 / MOODS[mood].exposure);
  const mesh = useMemo(() => new THREE.InstancedMesh(geo, mat, 600), [geo, mat]);
  const X = box?.xW ?? 22;
  const XC = box?.xC ?? -1;
  const Z0 = box?.z0 ?? -3;
  const ZD = box?.zD ?? 5.6;
  const H = y1 - y0;
  const gust = gusts.reduce((a, g) => a + 5 * Math.max(0, Math.min(1, (t - g) / 1.4)) ** 2 * (3 - 2 * Math.max(0, Math.min(1, (t - g) / 1.4))), 0);
  const L = loop && loop > 0 ? loop : 0;
  // every listed gust's full push (each flake's share is × its own gust factor), undone over `gustBack`
  const backK = gustBack ? Math.max(0, Math.min(1, (t - gustBack.from) / Math.max(1e-3, gustBack.to - gustBack.from))) : 0;
  const m4 = new THREE.Matrix4();
  for (let i = 0; i < 600; i++) {
    if (i >= n) {
      m4.makeScale(0, 0, 0);
      mesh.setMatrixAt(i, m4);
      continue;
    }
    const r = (k: string) => random(`snow-${i}-${k}`);
    const fall0 = 0.6 + 0.5 * r('v');
    const sway0 = 0.6 + r('w');
    // looped: whole fall cycles and sway cycles in the loop; the gusts' net push undone by a steady drift
    const fall = L ? (Math.max(1, Math.round((fall0 * L) / H)) * H) / L : fall0;
    const sway = L ? (Math.max(1, Math.round((sway0 * L) / (2 * Math.PI))) * 2 * Math.PI) / L : sway0;
    const gk = 0.7 + 0.6 * r('g');
    const back = backK > 0 ? mod(5 * gusts.length * gk, X) * backK : 0;
    const y = y1 - mod(r('y') * H + t * fall, H);
    const x = mod(r('x') * X + 0.25 * Math.sin(t * sway + 6 * r('p')) + gust * gk - back, X) - X / 2 + XC;
    const z = Z0 + ZD * r('z');
    if (holes && holes.some(([a, b]) => x > a[0] && x < b[0] && y > a[1] && y < b[1] && z > a[2] && z < b[2])) {
      m4.makeScale(0, 0, 0);
      mesh.setMatrixAt(i, m4);
      continue;
    }
    const s0 = 0.022 + 0.02 * r('s');
    const s = pxR && cam ? Math.min(s0, pxR * Math.hypot(x - cam.x, y - cam.y, z - cam.z)) : s0;
    m4.makeScale(s, s, s).setPosition(x, y, z);
    mesh.setMatrixAt(i, m4);
  }
  mesh.instanceMatrix.needsUpdate = true;
  mesh.frustumCulled = false;
  return <primitive object={mesh} />;
};

