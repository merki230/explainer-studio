import * as THREE from 'three';

/**
 * A road that runs straight back from the section plane (z = 0) toward −z, then bends: it stays
 * straight to `start` metres from the plane and curves on a circle of `radius` (measured at x = 0),
 * to the left (−x) or the right (+x). Everything on the road is laid out in straight "road space"
 * (x across, z along, as on a straight road) and mapped to the world by `bendPoint` (JS, for cars and
 * signs) or `BEND_GLSL` (shaders, for the surfaces), so paint, grooves and scroll keep their road-space
 * maths and only the picture bends. Pure: no state, no randomness.
 */
export type RoadBend = {start: number; radius: number; side: 'left' | 'right'};

/** Road space (x, z) → world (x, z), and the heading off −z there (rad, + toward +x: `carToWorld`'s yaw). */
export const bendPoint = (x: number, z: number, b: RoadBend | null): {x: number; z: number; yaw: number} => {
  const s = -z;
  if (!b || s <= b.start) return {x, z, yaw: 0};
  const th = (s - b.start) / b.radius;
  if (b.side === 'left') {
    const r = b.radius + x;
    return {x: -b.radius + r * Math.cos(th), z: -b.start - r * Math.sin(th), yaw: -th};
  }
  const r = b.radius - x;
  return {x: b.radius - r * Math.cos(th), z: -b.start - r * Math.sin(th), yaw: th};
};

/** The uniforms every bent material shares (one object: set once a frame, read by all). */
export const bendUniforms = (b: RoadBend) => ({
  uBendStart: {value: b.start},
  uBendR: {value: b.radius},
  uBendSide: {value: b.side === 'left' ? 1 : -1},
});
export type BendUniforms = ReturnType<typeof bendUniforms>;

/** GLSL: the same map as `bendPoint`, on a world position; `th` is the heading turned (rad, + = left). */
export const BEND_GLSL = `
uniform float uBendStart, uBendR, uBendSide;
vec3 bendWorld(vec3 p, out float th) {
  float s = -p.z;
  th = 0.0;
  if (s <= uBendStart) return p;
  th = (s - uBendStart) / uBendR;
  float r = uBendR + uBendSide * p.x;
  return vec3(uBendSide * (r * cos(th) - uBendR), p.y, -uBendStart - r * sin(th));
}
// a view-space direction turned about the world's y axis by the bend (left = + about y)
vec3 bendViewDir(vec3 n, float th) {
  vec3 w = (vec4(n, 0.0) * viewMatrix).xyz;
  float a = uBendSide * th;
  float c = cos(a), sn = sin(a);
  w = vec3(c * w.x + sn * w.z, w.y, -sn * w.x + c * w.z);
  return (viewMatrix * vec4(w, 0.0)).xyz;
}
`;

/**
 * Bend a built-in (lit or depth) material's vertices by the road bend, in world space after its model
 * (and instance) matrix: positions, normals, and the world position the shadows read. Chains any
 * `onBeforeCompile` already set. Its own program key, so straight materials keep theirs.
 */
export const bendMaterial = <M extends THREE.Material>(m: M, u: BendUniforms, key: string): M => {
  const prev = m.onBeforeCompile.bind(m);
  const prevKey = m.customProgramCacheKey.bind(m);
  // lit materials carry a view-space normal (vNormal) that turns with the bend; depth materials don't
  const lit = 'isMeshStandardMaterial' in m;
  m.onBeforeCompile = (shader, renderer) => {
    prev(shader, renderer);
    Object.assign(shader.uniforms, u);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>\n${BEND_GLSL}`)
      .replace(
        '#include <project_vertex>',
        `vec4 mvPosition = vec4(transformed, 1.0);
        #ifdef USE_INSTANCING
          mvPosition = instanceMatrix * mvPosition;
        #endif
        vec4 bendW = modelMatrix * mvPosition;
        float bendTh;
        bendW.xyz = bendWorld(bendW.xyz, bendTh);
        mvPosition = viewMatrix * bendW;
        gl_Position = projectionMatrix * mvPosition;
        ${lit ? '#ifndef FLAT_SHADED\n vNormal = normalize(bendViewDir(vNormal, bendTh));\n#endif' : ''}`,
      )
      .replace(
        '#include <worldpos_vertex>',
        `#include <worldpos_vertex>
        #if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
          { float bt; worldPosition.xyz = bendWorld(worldPosition.xyz, bt); }
        #endif`,
      );
  };
  m.customProgramCacheKey = () => `${prevKey()}|bend|${key}`;
  return m;
};

/** A depth material for shadow casting that bends like `bendMaterial` (set as `customDepthMaterial`). */
export const bendDepthMaterial = (u: BendUniforms, key: string) =>
  bendMaterial(new THREE.MeshDepthMaterial({depthPacking: THREE.RGBADepthPacking}), u, `depth-${key}`);
