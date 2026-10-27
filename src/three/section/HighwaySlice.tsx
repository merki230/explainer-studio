import React, {useMemo} from 'react';
import * as THREE from 'three';
import {HIGHWAY, MOODS, section, type Mood} from '../../theme';
import {raw} from '../plaster';
import {RoadSign, type RoadSignFont, type RoadSignKind} from '../real/RoadSigns';
import {cutMaterial, INK} from './cutLook';
import {bendDepthMaterial, bendMaterial, bendPoint, bendUniforms, BEND_GLSL, type BendUniforms, type RoadBend} from './roadBend';
import {mottle} from './StreetSlice';

type V3 = [number, number, number];
type P2 = [number, number];

/*
 * H, the highway slice (No. 005): a divided rural interstate cut square to the road, in metres. The cut
 * face is the plane z = 0 (facing the camera, +z); the road runs back along −z and traffic drives away
 * from the camera (toward −z), so the right-hand verge is +x and its signs face the camera. On the cut
 * face, left to right: the depressed grass median (drawn short), the 4 ft inside shoulder, the yellow
 * left edge line, two 12 ft lanes with a broken white lane line (10 ft dashes, 30 ft gaps), the 6 in
 * white right edge line, the 10 ft outside shoulder with the groove row 6 in outside the white line,
 * gravel, the W-beam guardrail, the foreslope down to a grass ditch and the backslope. Asphalt, base and
 * subgrade are inked on the hatched cut. The cut passes through the middle of one groove: a notch ½ in
 * deep on the face, its milled scoop (7 in long, the arc of the milling drum) rising behind it. The
 * grooves are dark milled stripes 12 in centre to centre on the shoulder; they stream toward the camera
 * with the road (`scroll`), filtered over the shutter so nothing strobes, and wash `orange` where the
 * scene lights them (`lit`, the system). The cars, lights and camera belong to the scene.
 */

const FT = 0.3048;
const IN = 0.0254;

export const HIGHWAY_LAYOUT = {
  /** The left lane's left edge, the lane line (centre), the right lane's right edge (x = 0). */
  laneLeft: -24 * FT,
  laneLine: -12 * FT,
  laneRight: 0,
  /** Lane centres (x). */
  lanes: {left: -18 * FT, right: -6 * FT},
  /** The inside (median) shoulder's edge, the outside shoulder's edge. */
  insideEdge: -28 * FT,
  outsideEdge: 10 * FT,
  /** Paint (x ranges): yellow left edge line (6 in, inside the lane edge), white right edge line (6 in, on the shoulder), the 4 in lane line. */
  yellow: [-24 * FT, -24 * FT + 6 * IN] as P2,
  white: [0, 6 * IN] as P2,
  laneLineW: 4 * IN,
  /** Broken lane line: 10 ft dash every 40 ft. */
  dash: {length: 10 * FT, period: 40 * FT},
  /**
   * The groove row (milled shoulder rumble strip): from 6 in outside the white line, 15 in wide across
   * the shoulder; each groove 7 in long along the road, ½ in deep, 12 in centre to centre.
   */
  groove: {x0: 12 * IN, x1: 27 * IN, length: 7 * IN, depth: 0.5 * IN, period: 12 * IN},
  /** The guardrail's post line and the rail's centre height above the road. */
  rail: {x: 3.62, height: 0.6},
  /** The slice's ends (x), its bottom, and how far the road runs back. */
  x0: -13,
  x1: 12.5,
  bottom: -5.0,
  depth: 500,
};
const L = HIGHWAY_LAYOUT;
const G = L.groove;
/** The scoop's drum radius from its chord (the groove length) and depth. */
const DRUM = (G.length * G.length) / 4 / (2 * G.depth) + G.depth / 2;

/** The ground's top profile across the cut (x, y), left to right, without the groove notch. */
const PROFILE: P2[] = [
  [L.x0, -0.1],
  [-11.6, -0.62],
  [-10.9, -0.64],
  [-9.5, -0.16],
  [L.insideEdge - 0.3, -0.05],
  [L.insideEdge - 0.06, -0.035],
  [L.insideEdge, 0],
  [L.outsideEdge, 0],
  [L.outsideEdge + 0.07, -0.035],
  [3.75, -0.06],
  [7.6, -1.03],
  [8.5, -1.06],
  [11.7, -0.03],
  [L.x1, 0.0],
];

/** The ground's height at x (the top profile; the road is y = 0). */
export const groundAt = (x: number) => {
  for (let i = 0; i < PROFILE.length - 1; i++) {
    const [a, ya] = PROFILE[i];
    const [b, yb] = PROFILE[i + 1];
    if (x >= a && x <= b) return ya + ((yb - ya) * (x - a)) / Math.max(1e-6, b - a);
  }
  return x < L.x0 ? PROFILE[0][1] : PROFILE[PROFILE.length - 1][1];
};

/** The signs' default places on the right verge (x of the centre line, z), receding from the plane. */
export const SIGN_SPOTS: Record<RoadSignKind, {x: number; z: number}> = {
  speed: {x: 5.2, z: -8},
  mile: {x: 4.7, z: -28},
  guide: {x: 6.6, z: -34},
  // No. 009: the exit direction sign with its EXIT plaque (its left edge just outside the guardrail)
  exit: {x: 5.6, z: -36},
  // not used on the highway (the city slice's sign)
  oneway: {x: 5.2, z: -14},
};

/**
 * A quad strip along the road: from (x0, y0) to (x1, y1) across, z0 → z1 along; uv in metres (x, z).
 * `segs` > 1 splits it along the road (a bent road needs vertices to bend: `roadBend`).
 */
const stripGeo = (x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, segs = 1) => {
  const g = new THREE.BufferGeometry();
  if (segs <= 1) {
    const p = [x0, y0, z0, x1, y1, z0, x1, y1, z1, x0, y0, z1];
    g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute([x0, z0, x1, z0, x1, z1, x0, z1], 2));
    g.setIndex([0, 1, 2, 0, 2, 3]);
    g.computeVertexNormals();
    return g;
  }
  const p: number[] = [];
  const uv: number[] = [];
  const idx: number[] = [];
  for (let i = 0; i <= segs; i++) {
    const z = z0 + ((z1 - z0) * i) / segs;
    p.push(x0, y0, z, x1, y1, z);
    uv.push(x0, z, x1, z);
    if (i > 0) idx.push(2 * i - 2, 2 * i - 1, 2 * i + 1, 2 * i - 2, 2 * i + 1, 2 * i);
  }
  g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
};

/** Segments along a bent road's strips: one every 2 m (none on a straight road). */
const bendSegs = (bend: RoadBend | null | undefined, length: number) => (bend ? Math.ceil(length / 2) : 1);

/**
 * The road surface: asphalt with its paint and the grooves, drawn in the shader from world position
 * (no texture, no randomness), so the markings and grooves stream with `uScroll` and are box-filtered
 * over the pixel and the shutter (`uBlur`, metres travelled while it is open): no moiré far off, no
 * strobing at speed. `axes` is GLSL for the across coordinate (metres from the white line's inner
 * edge, + toward the shoulder) and the along one (+ where the road comes from): H's x and z by
 * default; the car slice runs the road along x and shifts it across with the `uAcross` uniform.
 */
export const asphaltMaterial = (
  axes: {across: string; along: string; key: string} = {across: 'vRoadPos.x', along: 'vRoadPos.z', key: 'highway-asphalt'},
  /**
   * After the rain (No. 008, off by default): `wet` darkens the asphalt (`HIGHWAY.asphaltWet`, the wheel
   * paths drying lighter), adds standing water in seeded-noise puddles (shoulder and lane edges most)
   * that stream with the road, lowers the roughness, and lays the mood's sky over it as a soft sheen,
   * strongest at grazing angles and in the puddles. `bend` bends the surface (`roadBend`).
   */
  opts: {wet?: boolean; mood?: Mood; bend?: BendUniforms} = {},
) => {
  const wet = opts.wet ?? false;
  const m = new THREE.MeshStandardMaterial({color: raw('#ffffff'), roughness: 0.88});
  const c = (h: string) => {
    const k = raw(h);
    return new THREE.Vector3(k.r, k.g, k.b);
  };
  const uniforms = {
    uScroll: {value: 0},
    uBlur: {value: 0},
    uAcross: {value: 0},
    cAsphalt: {value: c(wet ? HIGHWAY.asphaltWet : HIGHWAY.asphalt)},
    cPath: {value: c(wet ? HIGHWAY.wheelPathWet : HIGHWAY.wheelPath)},
    cMilled: {value: c(HIGHWAY.milled)},
    cWhite: {value: c(HIGHWAY.lineWhite)},
    cYellow: {value: c(HIGHWAY.lineYellow)},
    ...(wet
      ? {
          cPuddle: {value: c(HIGHWAY.puddle)},
          // the sheen: the sky's lower band (a reflection, so it is the sky, not a new colour)
          cSheen: {value: c(MOODS[opts.mood ?? 'day'].sky[1])},
        }
      : {}),
  };
  m.userData.uniforms = uniforms;
  const f = (v: number) => v.toFixed(5);
  m.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vRoadPos;')
      .replace('#include <project_vertex>', '#include <project_vertex>\nvRoadPos = (modelMatrix * vec4(transformed, 1.0)).xyz;');
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
        varying vec3 vRoadPos;
        uniform float uScroll;
        uniform float uBlur;
        uniform float uAcross;
        uniform vec3 cAsphalt, cPath, cMilled, cWhite, cYellow;${wet ? '\n        uniform vec3 cPuddle, cSheen;\n        float wetPuddle = 0.0;' : ''}
        // coverage of [a, b] by a box filter of width w centred at x
        float boxF(float x, float a, float b, float w) {
          return clamp((min(x + 0.5 * w, b) - max(x - 0.5 * w, a)) / w, 0.0, 1.0);
        }
        // running integral of a pulse train (pulses [kP, kP + L)), and its box-filtered value
        float pulseI(float x, float P, float L) { return floor(x / P) * L + min(mod(x, P), L); }
        float pulseF(float x, float P, float L, float w) {
          return (pulseI(x + 0.5 * w, P, L) - pulseI(x - 0.5 * w, P, L)) / w;
        }
        float hash2(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
        float vnoise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(mix(hash2(i), hash2(i + vec2(1, 0)), u.x), mix(hash2(i + vec2(0, 1)), hash2(i + vec2(1, 1)), u.x), u.y);
        }`,
      )
      .replace(
        '#include <color_fragment>',
        `#include <color_fragment>
        {
          float x = ${axes.across};
          float ua = ${axes.along};
          float u = ua - uScroll;
          float wx = fwidth(x) + 1e-4;
          float wz = max(fwidth(ua), uBlur) + 1e-4;
          // a broad, fixed mottle (low frequency: it neither shimmers nor strobes) and darker wheel paths
          float n = vnoise(vRoadPos.xz * vec2(0.6, 0.15)) * 0.6 + vnoise(vRoadPos.xz * vec2(2.2, 0.5)) * 0.4;
          vec3 col = cAsphalt * (0.93 + 0.14 * n);
          float path = 0.0;
          ${[L.lanes.left, L.lanes.right]
            .flatMap((cx) => [cx - 0.9, cx + 0.9])
            .map((cx) => `path += boxF(x, ${f(cx - 0.32)}, ${f(cx + 0.32)}, wx + 0.25);`)
            .join('\n          ')}
          col = mix(col, cPath * (0.95 + 0.1 * n), clamp(path, 0.0, 1.0) * 0.7);
          // paint
          col = mix(col, cYellow, boxF(x, ${f(L.yellow[0])}, ${f(L.yellow[1])}, wx));
          col = mix(col, cWhite, boxF(x, ${f(L.white[0])}, ${f(L.white[1])}, wx));
          float dash = pulseF(u + ${f(L.dash.length / 2)}, ${f(L.dash.period)}, ${f(L.dash.length)}, wz);
          col = mix(col, cWhite, boxF(x, ${f(L.laneLine - L.laneLineW / 2)}, ${f(L.laneLine + L.laneLineW / 2)}, wx) * dash);
          // the groove row: milled stripes, each centred on u = k · period
          float band = boxF(x, ${f(G.x0)}, ${f(G.x1)}, wx);
          float g = pulseF(u + ${f(G.length / 2)}, ${f(G.period)}, ${f(G.length)}, wz);
          // inside a groove (when it resolves): the far wall rising toward the camera catches the light,
          // the near slope falls away darker, so the scoop reads as a dip, not paint
          float ph = clamp(mod(u + ${f(G.length / 2)}, ${f(G.period)}) / ${f(G.length)}, 0.0, 1.0);
          float detail = 1.0 - smoothstep(${f(0.25 * G.length)}, ${f(0.8 * G.length)}, wz);
          float shade = mix(1.0, mix(1.35, 0.7, ph), detail);
          col = mix(col, cMilled * (0.9 + 0.2 * n) * shade, band * g * 0.9);${wet ? WET_COLOR : ''}
          diffuseColor.rgb = col;
        }`,
      );
    if (wet)
      shader.fragmentShader = shader.fragmentShader
        .replace(
          '#include <roughnessmap_fragment>',
          `#include <roughnessmap_fragment>
          // wet: satin, the puddles near a mirror (soft: the key's highlight stays broad, never a burn)
          roughnessFactor = mix(0.5, 0.22, wetPuddle);`,
        )
        .replace(
          '#include <emissivemap_fragment>',
          `#include <emissivemap_fragment>
          {
            // the sky's sheen: faint face-on, stronger toward grazing, most in the standing water
            float cosI = clamp(dot(normalize(vViewPosition), normal), 0.0, 1.0);
            float fr = pow(1.0 - cosI, 4.0);
            totalEmissiveRadiance += cSheen * (0.03 + 0.8 * fr) * (0.5 + 0.9 * wetPuddle);
          }`,
        );
  };
  m.customProgramCacheKey = () => (wet ? `${axes.key}-wet` : axes.key);
  return opts.bend ? bendMaterial(m, opts.bend, axes.key) : m;
};

/**
 * The wet variant's colour pass (inside the asphalt's colour block, after the grooves): the paint a
 * little darker (wet), and the puddles: seeded value noise in road space (streaming with the road),
 * thresholded into soft-edged patches, more of them on the shoulder and along the lane edges, fewer in
 * the wheel paths (traffic pushes the water out). Low frequency, so it neither shimmers nor strobes.
 */
const WET_COLOR = `
          {
            float pn = vnoise(vec2(x, u) * vec2(0.6, 0.09)) * 0.65 + vnoise(vec2(x, u) * vec2(1.9, 0.3)) * 0.35;
            float edge = max(boxF(x, -0.6, ${(L.outsideEdge - 0.2).toFixed(5)}, 1.2), boxF(x, ${(L.laneLeft - 0.5).toFixed(5)}, ${(L.laneLeft + 0.7).toFixed(5)}, 1.2));
            float thr = mix(0.7, 0.56, edge) + 0.08 * clamp(path, 0.0, 1.0);
            wetPuddle = smoothstep(thr, thr + 0.07, pn);
            col *= 0.9;
            col = mix(col, cPuddle, wetPuddle * 0.85);
          }`;

/**
 * Ink along a polyline lying in a plane z = const (the cut face's outline and its layers), as flat quads
 * whose width is a uniform: the scene sets it every frame from the camera distance, so the line keeps
 * ≈ 3 px through a pull-back without rebuilding geometry (a stepped width popped). Unlit cutLine ink.
 */
export const FlatInk: React.FC<{points: V3[]; closed?: boolean; width: number}> = ({points, closed = false, width}) => {
  const key = JSON.stringify([points, closed]);
  const geometry = useMemo(() => {
    const [pts, cl] = JSON.parse(key) as [V3[], boolean];
    const pos: number[] = [];
    const dir: number[] = [];
    const idx: number[] = [];
    const n = cl ? pts.length : pts.length - 1;
    for (let i = 0; i < n; i++) {
      const a = pts[i];
      const b = pts[(i + 1) % pts.length];
      const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
      const d = [(b[0] - a[0]) / len, (b[1] - a[1]) / len];
      const nn = [-d[1], d[0]];
      const k = pos.length / 3;
      // each corner: its point, and its offset (half-widths) across (±n) and past the end (∓d / ±d)
      for (const [p, sd] of [
        [a, -1],
        [b, 1],
      ] as [V3, number][])
        for (const sn of [-1, 1]) {
          pos.push(p[0], p[1], p[2]);
          dir.push(sn * nn[0] + sd * d[0], sn * nn[1] + sd * d[1]);
        }
      idx.push(k, k + 2, k + 3, k, k + 3, k + 1);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('inkDir', new THREE.Float32BufferAttribute(dir, 2));
    g.setIndex(idx);
    return g;
  }, [key]);
  const material = useMemo(() => {
    const m = new THREE.MeshBasicMaterial({color: raw(section.cutLine)});
    const uniforms = {uInk: {value: INK}};
    m.userData.uniforms = uniforms;
    m.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, uniforms);
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', '#include <common>\nattribute vec2 inkDir;\nuniform float uInk;')
        .replace('#include <begin_vertex>', '#include <begin_vertex>\ntransformed.xy += inkDir * 0.5 * uInk;');
    };
    m.customProgramCacheKey = () => 'flat-ink';
    return m;
  }, []);
  (material.userData.uniforms as {uInk: {value: number}}).uInk.value = width;
  return <mesh geometry={geometry} material={material} frustumCulled={false} />;
};

/** The lit grooves' orange wash (the system): unlit, bloomed, only on the milled stripes, between two z. */
const washMaterial = (bend?: BendUniforms) =>
  new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -2,
    polygonOffsetUnits: -2,
    uniforms: {
      uScroll: {value: 0},
      uBlur: {value: 0},
      uLit: {value: 0},
      uNear: {value: 0},
      uFar: {value: -10},
      cOrange: {value: raw(section.orange)},
      ...(bend ?? {}),
    },
    vertexShader: bend
      ? `
      varying vec3 vP;
      ${BEND_GLSL}
      void main() {
        vec4 w = modelMatrix * vec4(position, 1.0);
        vP = w.xyz;
        float th;
        w.xyz = bendWorld(w.xyz, th);
        gl_Position = projectionMatrix * viewMatrix * w;
      }`
      : `
      varying vec3 vP;
      void main() {
        vec4 w = modelMatrix * vec4(position, 1.0);
        vP = w.xyz;
        gl_Position = projectionMatrix * viewMatrix * w;
      }`,
    fragmentShader: `
      varying vec3 vP;
      uniform float uScroll, uBlur, uLit, uNear, uFar;
      uniform vec3 cOrange;
      float pulseI(float x, float P, float L) { return floor(x / P) * L + min(mod(x, P), L); }
      float pulseF(float x, float P, float L, float w) {
        return (pulseI(x + 0.5 * w, P, L) - pulseI(x - 0.5 * w, P, L)) / w;
      }
      void main() {
        float u = vP.z - uScroll;
        float wz = max(fwidth(vP.z), uBlur) + 1e-4;
        float g = pulseF(u + ${(G.length / 2).toFixed(5)}, ${G.period.toFixed(5)}, ${G.length.toFixed(5)}, wz);
        // lit between uFar (ahead) and uNear (toward the plane), soft ends
        float span = smoothstep(uFar - 0.6, uFar + 0.4, vP.z) * (1.0 - smoothstep(uNear - 0.05, uNear + 0.05, vP.z));
        float a = uLit * span * (0.08 + 0.72 * g);
        if (a < 0.003) discard;
        gl_FragColor = vec4(cOrange, a);
      }`,
  });

export type HighwaySliceProps = {
  mood: Mood;
  /** How far the road has moved toward the camera (m): the paint and grooves stream with it. */
  scroll?: number;
  /** Metres the road moves while the shutter is open (motion blur of the stripes). */
  blur?: number;
  /** The grooves' orange wash, 0 (dark) → 1 (lit), and the z range it covers (near ≤ 0, far < near). */
  lit?: number;
  litSpan?: [number, number];
  /** Ink width scale for the cut face's outline (× the § 3 ink, 0.011): the scene keeps it ≈ 3 px from the groove close-up to the wide shot. */
  ink?: number;
  /** The signs (null for none): which, their legends, where (x, z), retroreflective brightening. */
  signs?: {kind: RoadSignKind; text: string[]; x: number; z: number; retro?: number; font?: RoadSignFont; id?: string}[];
  /** The W-beam guardrail on the right verge (default true). */
  guardrail?: boolean;
  /** After the rain: wet asphalt, puddles and the sky's sheen (`asphaltMaterial` `wet`), damp verges. Default false. */
  wet?: boolean;
  /** The road bends from `start` m up (`roadBend`); signs are placed and turned on it. Default none (straight). */
  bend?: RoadBend | null;
};

/** The highway slice (see the file comment). */
export const HighwaySlice: React.FC<HighwaySliceProps> = ({
  mood,
  scroll = 0,
  blur = 0,
  lit = 0,
  litSpan = [0, -6],
  ink = 1,
  signs = [],
  guardrail = true,
  wet = false,
  bend: bendProp = null,
}) => {
  // keyed on the values, so a new props object each frame doesn't rebuild the geometry
  const bendKey = bendProp ? `${bendProp.start}|${bendProp.radius}|${bendProp.side}` : '';
  const bend = useMemo((): RoadBend | null => {
    if (!bendKey) return null;
    const [start, radius, side] = bendKey.split('|');
    return {start: Number(start), radius: Number(radius), side: side as RoadBend['side']};
  }, [bendKey]);
  const bu = useMemo(() => (bend ? bendUniforms(bend) : null), [bend]);
  const mats = useMemo(() => {
    const grass = new THREE.MeshStandardMaterial({color: raw('#ffffff'), roughness: 1, map: mottle(HIGHWAY.grass, 16)});
    grass.map!.repeat.set(0.22, 0.22);
    const gravel = new THREE.MeshStandardMaterial({color: raw('#ffffff'), roughness: 1, map: mottle(HIGHWAY.gravel, 60)});
    gravel.map!.repeat.set(3, 3);
    if (wet) {
      // damp verges: the same textures, darker (water darkens soil and grass)
      grass.color.multiplyScalar(0.8);
      gravel.color.multiplyScalar(0.72);
    }
    const b = <M extends THREE.Material>(m: M, k: string) => (bu ? bendMaterial(m, bu, `highway-${k}`) : m);
    return {
      cut: cutMaterial(),
      asphalt: asphaltMaterial(undefined, {wet, mood, bend: bu ?? undefined}),
      wash: washMaterial(bu ?? undefined),
      grass: b(grass, 'grass'),
      gravel: b(gravel, 'gravel'),
      milled: new THREE.MeshStandardMaterial({
        color: raw(HIGHWAY.milled),
        roughness: 1,
        emissive: raw(section.orange),
        emissiveIntensity: 0,
        side: THREE.DoubleSide,
      }),
      white: new THREE.MeshStandardMaterial({color: raw(HIGHWAY.lineWhite), roughness: 0.6}),
      yellow: new THREE.MeshStandardMaterial({color: raw(HIGHWAY.lineYellow), roughness: 0.6}),
      steel: b(new THREE.MeshStandardMaterial({color: raw(HIGHWAY.galvanized), roughness: 0.4, metalness: 0.7}), 'steel'),
      railCut: [
        b(cutMaterial(), 'railcut'),
        b(new THREE.MeshStandardMaterial({color: raw(HIGHWAY.galvanized), roughness: 0.35, metalness: 0.75}), 'rail'),
      ],
      endCut: b(cutMaterial(), 'endcut'),
      depth: bu ? bendDepthMaterial(bu, 'highway') : undefined,
    };
  }, [wet, mood, bu]);
  const u = mats.asphalt.userData.uniforms as Record<string, {value: number}>;
  u.uScroll.value = scroll;
  u.uBlur.value = blur;
  const w = mats.wash.uniforms;
  w.uScroll.value = scroll;
  w.uBlur.value = blur;
  w.uLit.value = lit;
  w.uNear.value = litSpan[0];
  w.uFar.value = litSpan[1];
  // the scoop cut on the face is under the wash's near end: it lights with it
  const scoopLit = lit * (litSpan[0] >= -0.05 ? 1 : 0);
  mats.milled.emissiveIntensity = 0.55 * scoopLit;

  const D = L.depth;
  const geo = useMemo(() => {
    // the top surface, strip by strip (asphalt, gravel, grass), the groove band starting behind the scoop
    const strips: {g: THREE.BufferGeometry; m: 'asphalt' | 'gravel' | 'grass'}[] = [];
    for (let i = 0; i < PROFILE.length - 1; i++) {
      const [a, ya] = PROFILE[i];
      const [b, yb] = PROFILE[i + 1];
      const kind =
        a >= L.insideEdge && b <= L.outsideEdge
          ? 'asphalt'
          : (a >= L.insideEdge - 0.31 && b <= L.insideEdge) || (a >= L.outsideEdge && b <= 3.76)
            ? 'gravel'
            : 'grass';
      const n = bendSegs(bend, D);
      if (kind === 'asphalt') {
        strips.push({g: stripGeo(a, ya, G.x0, ya, 0, -D, n), m: kind});
        strips.push({g: stripGeo(G.x0, 0, G.x1, 0, -G.length / 2, -D, n), m: kind});
        strips.push({g: stripGeo(G.x1, 0, b, yb, 0, -D, n), m: kind});
      } else strips.push({g: stripGeo(a, ya, b, yb, 0, -D, n), m: kind});
    }
    // a bent road: the verge inside the bend widens from nothing at the bend's start to most of the way to
    // its centre, so the ground fills the inside of the curve (no background showing through it)
    if (bend) {
      const inner = bend.side === 'left' ? 0 : PROFILE.length - 2;
      const [ea, ey] = PROFILE[inner === 0 ? 0 : PROFILE.length - 1];
      const W = bend.radius * 0.85;
      const TAPER = 30;
      const N = Math.ceil((D - bend.start) / 2);
      const pos: number[] = [];
      const uv: number[] = [];
      const idx: number[] = [];
      for (let i = 0; i <= N; i++) {
        const sAlong = bend.start + ((D - bend.start) * i) / N;
        const u = Math.min(1, (sAlong - bend.start) / TAPER);
        const wide = W * u * u * (3 - 2 * u);
        const xOut = bend.side === 'left' ? ea - wide : ea + wide;
        pos.push(xOut, ey, -sAlong, ea, ey, -sAlong);
        uv.push(xOut, -sAlong, ea, -sAlong);
        if (i > 0) {
          const k = 2 * (i - 1);
          if (bend.side === 'left') idx.push(k, k + 1, k + 3, k, k + 3, k + 2);
          else idx.push(k, k + 2, k + 3, k, k + 3, k + 1);
        }
      }
      const fill = new THREE.BufferGeometry();
      fill.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      fill.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
      fill.setIndex(idx);
      fill.computeVertexNormals();
      strips.push({g: fill, m: 'grass'});
    }
    // the cut face: the profile with the groove notch, down to the bottom
    const face: P2[] = [[L.x0, L.bottom]];
    for (const [x, y] of PROFILE) {
      if (x === L.outsideEdge) {
        face.push([G.x0, 0], [G.x0, -G.depth], [G.x1, -G.depth], [G.x1, 0]);
      }
      face.push([x, y]);
    }
    face.push([L.x1, L.bottom]);
    const shape = new THREE.Shape(face.map(([x, y]) => new THREE.Vector2(x, y)));
    // the scoop behind the notch: the drum's arc from −depth at the face to the surface at −length/2
    const N = 16;
    const arc = [...Array(N + 1).keys()].map((i) => {
      const z = (-G.length / 2) * (i / N);
      return [z, -G.depth + DRUM - Math.sqrt(DRUM * DRUM - z * z)] as P2;
    });
    const scoop = new THREE.BufferGeometry();
    const sp: number[] = [];
    const idx: number[] = [];
    arc.forEach(([z, y]) => sp.push(G.x0, y, z, G.x1, y, z));
    for (let i = 0; i < N; i++) idx.push(2 * i, 2 * i + 1, 2 * i + 3, 2 * i, 2 * i + 3, 2 * i + 2);
    scoop.setAttribute('position', new THREE.Float32BufferAttribute(sp, 3));
    scoop.setIndex(idx);
    scoop.computeVertexNormals();
    // its two side walls (x = x0 and x1): between the arc and the surface
    const wall = (x: number) => {
      const g = new THREE.BufferGeometry();
      const p: number[] = [];
      const ix: number[] = [];
      arc.forEach(([z, y]) => p.push(x, y, z, x, 0, z));
      for (let i = 0; i < N; i++) ix.push(2 * i, 2 * i + 1, 2 * i + 3, 2 * i, 2 * i + 3, 2 * i + 2);
      g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3));
      g.setIndex(ix);
      g.computeVertexNormals();
      return g;
    };
    // the W-beam rail's profile (x toward the posts, y), 3 mm steel, extruded back from the plane
    const wb: P2[] = [
      [0.06, -0.155],
      [0.0, -0.1],
      [0.0, -0.06],
      [0.055, 0.0],
      [0.0, 0.06],
      [0.0, 0.1],
      [0.06, 0.155],
    ];
    const t = 0.004;
    const railShape = new THREE.Shape([...wb, ...[...wb].reverse().map(([x, y]) => [x + t, y] as P2)].map(([x, y]) => new THREE.Vector2(x, y)));
    const RAIL_LEN = 260;
    const rail = new THREE.ExtrudeGeometry(railShape, {depth: RAIL_LEN, bevelEnabled: false, ...(bend ? {steps: RAIL_LEN / 2} : {})});
    rail.translate(0, 0, -RAIL_LEN);
    return {strips, face: new THREE.ShapeGeometry(shape), faceInk: face, scoop, walls: [wall(G.x0), wall(G.x1)], rail, RAIL_LEN};
  }, [D, bend]);

  // the guardrail posts and blockouts (instanced), every 6 ft 3 in
  const POST_GAP = 75 * IN;
  const posts = useMemo(() => {
    const n = Math.floor(geo.RAIL_LEN / POST_GAP);
    const gy = groundAt(L.rail.x + 0.2);
    const h = L.rail.height + 0.16 - gy;
    const post = new THREE.InstancedMesh(new THREE.BoxGeometry(0.1, h, 0.15), mats.steel, n);
    const block = new THREE.InstancedMesh(new THREE.BoxGeometry(0.2, 0.36, 0.15), mats.steel, n);
    const mtx = new THREE.Matrix4();
    for (let i = 0; i < n; i++) {
      const z = -0.9 - i * POST_GAP;
      post.setMatrixAt(i, mtx.makeTranslation(L.rail.x + 0.3, gy + h / 2, z));
      block.setMatrixAt(i, mtx.makeTranslation(L.rail.x + 0.15, L.rail.height, z));
    }
    post.castShadow = block.castShadow = true;
    if (mats.depth) post.customDepthMaterial = block.customDepthMaterial = mats.depth;
    post.instanceMatrix.needsUpdate = block.instanceMatrix.needsUpdate = true;
    return {post, block};
  }, [geo.RAIL_LEN, POST_GAP, mats.steel, mats.depth]);

  const inkMat = useMemo(() => new THREE.MeshBasicMaterial({color: raw(section.cutLine)}), []);
  const inkBent = useMemo(
    () => (bu ? bendMaterial(new THREE.MeshBasicMaterial({color: raw(section.cutLine)}), bu, 'highway-ink') : inkMat),
    [bu, inkMat],
  );
  const washGeo = useMemo(() => stripGeo(G.x0, 0, G.x1, 0, 0, -80, bend ? 40 : 1), [bend]);
  const inkT = INK * ink;
  const faceInk = useMemo(() => geo.faceInk.map(([x, y]) => [x, y, 0.003] as V3), [geo.faceInk]);
  // pavement layers on the cut: asphalt (10 in) over aggregate base (12 in), tapering at the edges
  const layers: V3[][] = [
    [
      [L.insideEdge - 0.06, -0.035, 0.003],
      [L.insideEdge - 0.14, -0.25, 0.003],
      [L.outsideEdge + 0.15, -0.25, 0.003],
      [L.outsideEdge + 0.07, -0.035, 0.003],
    ],
    [
      [L.insideEdge - 0.14, -0.25, 0.003],
      [L.insideEdge - 0.6, -0.56, 0.003],
      [L.outsideEdge + 0.65, -0.56, 0.003],
      [L.outsideEdge + 0.15, -0.25, 0.003],
    ],
  ];
  const topR = PROFILE[PROFILE.length - 1][1];

  return (
    <group>
      {geo.strips.map((s, i) => (
        <mesh key={i} geometry={s.g} material={mats[s.m]} receiveShadow />
      ))}
      {/* the lit grooves' wash (the system), just above the band, from the plane up the road */}
      <mesh position={[0, 0.002, 0]} material={mats.wash} userData={{glow: lit > 0.01}} visible={lit > 0.003} renderOrder={2}>
        <primitive object={washGeo} attach="geometry" />
      </mesh>
      {/* the scoop cut through on the face */}
      <mesh geometry={geo.scoop} material={mats.milled} receiveShadow userData={{glow: scoopLit > 0.01}} />
      {geo.walls.map((g, i) => (
        <mesh key={i} geometry={g} material={mats.milled} receiveShadow />
      ))}
      {/* the cut face, hatched, with its outline and the pavement layers inked */}
      <mesh geometry={geo.face} material={mats.cut} receiveShadow />
      <FlatInk points={faceInk} closed width={inkT} />
      {layers.map((p, i) => (
        <FlatInk key={i} points={p} width={inkT} />
      ))}
      {/* the paint layers seen on the cut */}
      <mesh material={mats.white} position={[(L.white[0] + L.white[1]) / 2, -0.002, 0.0015]}>
        <planeGeometry args={[L.white[1] - L.white[0], 0.004]} />
      </mesh>
      <mesh material={mats.yellow} position={[(L.yellow[0] + L.yellow[1]) / 2, -0.002, 0.0015]}>
        <planeGeometry args={[L.yellow[1] - L.yellow[0], 0.004]} />
      </mesh>
      {/* the slice's right end, cut */}
      {bend ? (
        <>
          <mesh material={mats.endCut} position={[L.x1, (L.bottom + topR) / 2, -D / 2]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[D, topR - L.bottom, bendSegs(bend, D), 1]} />
          </mesh>
          <mesh material={inkBent} position={[L.x1, topR, -D / 2]} scale={[inkT, inkT, 1]}>
            <boxGeometry args={[1, 1, D, 1, 1, bendSegs(bend, D)]} />
          </mesh>
        </>
      ) : (
        <>
          <mesh material={mats.cut} position={[L.x1, (L.bottom + topR) / 2, -D / 2]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[D, topR - L.bottom]} />
          </mesh>
          <mesh material={inkMat} position={[L.x1, topR, -D / 2]} scale={[inkT, inkT, 1]}>
            <boxGeometry args={[1, 1, D]} />
          </mesh>
        </>
      )}
      {guardrail ? (
        <>
          <mesh
            geometry={geo.rail}
            material={mats.railCut}
            position={[L.rail.x, L.rail.height, 0]}
            castShadow
            receiveShadow
            customDepthMaterial={mats.depth}
          />
          <primitive object={posts.post} />
          <primitive object={posts.block} />
        </>
      ) : null}
      {signs.map((s, i) => {
        if (!bend)
          return (
            <RoadSign
              key={s.id ?? i}
              mood={mood}
              kind={s.kind}
              text={s.text}
              position={[s.x, groundAt(s.x), s.z]}
              retro={s.retro ?? 0}
              font={s.font}
            />
          );
        // on a bent road: placed on the bend and turned with it, still facing oncoming traffic
        const w = bendPoint(s.x, s.z, bend);
        return (
          <group key={s.id ?? i} position={[w.x, 0, w.z]} rotation={[0, -w.yaw, 0]}>
            <RoadSign mood={mood} kind={s.kind} text={s.text} position={[0, groundAt(s.x), 0]} retro={s.retro ?? 0} font={s.font} />
          </group>
        );
      })}
    </group>
  );
};
