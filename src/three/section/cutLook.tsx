import React, {useMemo} from 'react';
import * as THREE from 'three';
import {section} from '../../theme';
import {raw} from '../plaster';

type V3 = [number, number, number];

/**
 * The architect's-section look (owner decision, 2026-10-15): every cut face is filled with a fine
 * diagonal hatch in the cut colour, its lines a little darker, and every cut edge carries a thin
 * dark ink line. Nothing else is outlined.
 */

/** Hatch spacing (world units between lines), line half-width (fraction of the spacing), darkening. */
export const HATCH = {spacing: 0.045, halfWidth: 0.16, darken: 0.13};
/** Ink line thickness (world units): ≈ 3 px at the wide framing, ≈ 1.5 px at half scale. */
export const INK = 0.011;

/**
 * Matte cut-face material with the hatch drawn in the shader from world position (no texture,
 * no randomness): lines at 45° in the face's own plane, antialiased with fwidth.
 */
export const cutMaterial = (): THREE.MeshStandardMaterial => {
  const m = new THREE.MeshStandardMaterial({color: raw(section.cut), roughness: 0.95});
  m.onBeforeCompile = (shader) => {
    shader.uniforms.hatch = {value: new THREE.Vector3(HATCH.spacing, HATCH.halfWidth, HATCH.darken)};
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vHatchPos;\nvarying vec3 vHatchN;')
      .replace(
        '#include <project_vertex>',
        '#include <project_vertex>\nvHatchPos = (modelMatrix * vec4(transformed, 1.0)).xyz;\nvHatchN = normalize(mat3(modelMatrix) * objectNormal);',
      );
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        '#include <common>\nvarying vec3 vHatchPos;\nvarying vec3 vHatchN;\nuniform vec3 hatch;',
      )
      .replace(
        '#include <color_fragment>',
        `#include <color_fragment>
        {
          vec3 an = abs(vHatchN);
          vec2 uv = an.x > 0.5 ? vHatchPos.zy : (an.z > 0.5 ? vHatchPos.xy : vHatchPos.xz);
          float d = (uv.x + uv.y) / hatch.x;
          float f = abs(fract(d) - 0.5);
          float w = fwidth(d);
          float line = 1.0 - smoothstep(hatch.y - w, hatch.y + w, f);
          // fade the hatch out where lines would be finer than ~2 px (no moire at small scale)
          line *= 1.0 - smoothstep(0.25, 0.5, w);
          diffuseColor.rgb *= 1.0 - hatch.z * line;
        }`,
      );
  };
  m.customProgramCacheKey = () => 'section-cut-hatch';
  return m;
};

/** An axis-aligned rectangle given by two opposite corners, lying in a plane (one coordinate equal). */
export type Rect = [V3, V3];

const key = (a: V3, b: V3) => {
  const s = (p: V3) => p.map((x) => x.toFixed(4)).join(',');
  return [s(a), s(b)].sort().join('|');
};

/** The four edges of a planar axis-aligned rectangle. */
const rectEdges = ([a, b]: Rect): [V3, V3][] => {
  const flat = [0, 1, 2].find((i) => Math.abs(a[i] - b[i]) < 1e-6) ?? 2;
  const [i, j] = [0, 1, 2].filter((k) => k !== flat);
  const corner = (u: number, v: number): V3 => {
    const p: V3 = [...a];
    p[i] = u;
    p[j] = v;
    return p;
  };
  const c = [corner(a[i], a[j]), corner(b[i], a[j]), corner(b[i], b[j]), corner(a[i], b[j])];
  return [0, 1, 2, 3].map((k) => [c[k], c[(k + 1) % 4]]);
};

/**
 * Thin dark ink lines along the edges of the given cut-face rectangles (shared edges drawn once).
 * Unlit, so they stay the same ink in both moods.
 */
export const CutOutline: React.FC<{
  rects?: Rect[];
  /** Extra single edges (e.g. an L-shaped wall top), as [from, to]. */
  edges?: [V3, V3][];
  color?: string;
  thickness?: number;
}> = ({rects = [], edges = [], color = section.cutLine, thickness = INK}) => {
  const rectsKey = JSON.stringify([rects, edges]);
  const segs = useMemo(() => {
    const seen = new Map<string, [V3, V3]>();
    const [rs, es] = JSON.parse(rectsKey) as [Rect[], [V3, V3][]];
    for (const r of rs) for (const e of rectEdges(r)) seen.set(key(e[0], e[1]), e);
    for (const e of es) seen.set(key(e[0], e[1]), e);
    return [...seen.values()].map(([a, b]) => {
      const size: V3 = [
        Math.abs(b[0] - a[0]) + thickness,
        Math.abs(b[1] - a[1]) + thickness,
        Math.abs(b[2] - a[2]) + thickness,
      ];
      const pos: V3 = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];
      return {size, pos};
    });
  }, [rectsKey, thickness]);
  const material = useMemo(() => new THREE.MeshBasicMaterial({color: raw(color)}), [color]);
  return (
    <group>
      {segs.map((s, i) => (
        <mesh key={i} position={s.pos} material={material}>
          <boxGeometry args={s.size} />
        </mesh>
      ))}
    </group>
  );
};
