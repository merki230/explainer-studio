import React, {useMemo} from 'react';
import * as THREE from 'three';
import {CITY, HIGHWAY, MOODS, REAL, section, STREET, type Mood} from '../../theme';
import {raw, roundedBox} from '../plaster';
import {RoadSign, type RoadSignKind} from '../real/RoadSigns';
import {applyEnv, useEnvStrength, useStudioEnv} from '../real/useStudioEnv';
import {cutMaterial, INK} from './cutLook';
import {FlatInk} from './HighwaySlice';

type V3 = [number, number, number];
type P2 = [number, number];

/*
 * T, the city slice (No. 006): a one-way US downtown street cut square to the road, in metres. The cut
 * face is the plane z = 0 (facing the camera, +z); the street runs back along −z and all three lanes
 * drive away from the camera. On the cut face, left to right (x): the storefront building's section
 * (slabs, facade wall, back wall, the shop's glazing), the sidewalk, the curb, three 11 ft lanes, the far
 * curb and sidewalk, a low planter wall and a narrow plaza strip (from the fixed angle anything taller there
 * hides the lanes; shops start past the cross street). Under the road, on the hatched cut: the asphalt and base
 * layers, the storm sewer cut round and a duct bank with its conduits (a curb inlet's grate above), in
 * neutral greys. Up the street (`stopLine` m): the stop line, a ladder crosswalk, the cross street, the
 * far crosswalk and a mast-arm signal on the far right corner, its heads over the lanes facing the
 * camera. Generic facades (windows, blank awnings, no names), street trees, ONE WAY and SPEED LIMIT 25
 * near the plane. Cars, lights and camera belong to the scene.
 */

const FT = 0.3048;

export const CITY_LAYOUT = {
  /** The roadway's edges (x) and the lane centres, left to right (lane 1, 2, 3); the lane lines. */
  road: [0, 9.9] as P2,
  lanes: [1.65, 4.95, 8.25],
  laneLines: [3.3, 6.6],
  curbL: [-0.15, 0] as P2,
  walkL: [-3.8, -0.15] as P2,
  bldL: [-12, -3.8] as P2,
  curbR: [9.9, 10.05] as P2,
  walkR: [10.05, 13.7] as P2,
  bldR: [13.7, 16.5] as P2,
  /** Sidewalk top (a 6 in curb), the ground block's base under the surface strips and its bottom. */
  grade: 0.15,
  base: -0.5,
  bottom: -4,
  /** How far the street runs back from the plane. */
  depth: 260,
  /** Storey heights: the shop floor and the floors above. */
  ground: 4.5,
  storey: 3.6,
  /** Broken lane line: 10 ft dash every 40 ft. */
  dash: {length: 10 * FT, period: 40 * FT},
};
const L = CITY_LAYOUT;

/**
 * The intersection's places along the street (z) for a stop line `S` m up the road: the stop line (24 in,
 * its near edge at −S), the near ladder crosswalk (10 ft, 4 ft past the stop line), the cross street
 * (11 m), the far crosswalk, where the near block's buildings end and the far block's start, the signal
 * pole (far right corner) and its heads' height.
 */
export const cityIntersection = (S: number) => {
  const stopFar = -S - 2 * FT;
  const cwNear: P2 = [stopFar - 4 * FT, stopFar - 4 * FT - 10 * FT];
  const crossFar = cwNear[1] - 11;
  const cwFar: P2 = [crossFar, crossFar - 10 * FT];
  return {
    stopNear: -S,
    stopFar,
    cwNear,
    crossNear: cwNear[1],
    crossFar,
    cwFar,
    blockNearEnd: cwNear[0],
    blockFarStart: cwFar[1],
    signal: {x: 11.0, z: cwFar[1] + 1.2, headY: 6.0},
  };
};

/** The signs' default places (x of the centre line, z): near the plane, facing the camera. */
export const CITY_SIGN_SPOTS: Partial<Record<RoadSignKind, {x: number; z: number}>> = {
  speed: {x: -0.8, z: -4.5},
  oneway: {x: -0.8, z: -12},
};

/** A signal state: which lens is lit (the yellow, if ever, in `warning`). */
export type SignalState = 'red' | 'yellow' | 'green' | 'off';

/** Six-face material list for a box: [+x, −x, +y, −y, +z (the cut face), −z]. */
type Six = [THREE.Material, THREE.Material, THREE.Material, THREE.Material, THREE.Material, THREE.Material];

const Block: React.FC<{min: V3; max: V3; mats: Six | THREE.Material; shadow?: boolean}> = ({
  min,
  max,
  mats,
  shadow = true,
}) => (
  <mesh
    position={[(min[0] + max[0]) / 2, (min[1] + max[1]) / 2, (min[2] + max[2]) / 2]}
    material={mats as THREE.Material | THREE.Material[]}
    castShadow={shadow}
    receiveShadow
  >
    <boxGeometry args={[max[0] - min[0], max[1] - min[1], max[2] - min[2]]} />
  </mesh>
);

const vec = (h: string) => {
  const k = raw(h);
  return new THREE.Vector3(k.r, k.g, k.b);
};
const f5 = (v: number) => v.toFixed(5);

/** GLSL helpers shared by the road and the concrete: box filters, a running pulse train, value noise. */
const GLSL_HELPERS = `
  float boxF(float x, float a, float b, float w) {
    return clamp((min(x + 0.5 * w, b) - max(x - 0.5 * w, a)) / w, 0.0, 1.0);
  }
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
  }`;

/** A standard material whose colour is drawn in the shader from world position (`body` sets `col`). */
const worldMaterial = (key: string, uniforms: Record<string, {value: unknown}>, body: string, roughness: number) => {
  const m = new THREE.MeshStandardMaterial({color: raw('#ffffff'), roughness});
  m.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vCityPos;')
      .replace(
        '#include <project_vertex>',
        '#include <project_vertex>\nvCityPos = (modelMatrix * vec4(transformed, 1.0)).xyz;',
      );
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
        varying vec3 vCityPos;
        ${Object.keys(uniforms)
          .map((u) => `uniform vec3 ${u};`)
          .join('\n')}
        ${GLSL_HELPERS}`,
      )
      .replace(
        '#include <color_fragment>',
        `#include <color_fragment>
        {
          float x = vCityPos.x;
          float z = vCityPos.z;
          float wx = fwidth(x) + 1e-4;
          float wz = fwidth(z) + 1e-4;
          vec3 col;
          ${body}
          diffuseColor.rgb = col;
        }`,
      );
  };
  m.customProgramCacheKey = () => key;
  return m;
};

/**
 * The street's asphalt and its paint, drawn from world position and box-filtered over the pixel (no
 * texture, no moiré far off): concrete gutter pans along both curbs, broken white lane lines, the stop
 * line, two ladder crosswalks, the cross street's double yellow centre line (outside our roadway).
 */
const roadMaterial = (S: number) => {
  const I = cityIntersection(S);
  const ladder = (cw: P2) => {
    const [a, b] = [cw[1], cw[0]];
    return `
          {
            float zone = boxF(z, ${f5(a)}, ${f5(b)}, wz) * boxF(x, ${f5(L.road[0])}, ${f5(L.road[1])}, wx);
            float edges = boxF(z, ${f5(b - 0.3)}, ${f5(b)}, wz) + boxF(z, ${f5(a)}, ${f5(a + 0.3)}, wz);
            float bars = pulseF(x - 0.45, 1.5, 0.6, wx);
            paint = max(paint, zone * clamp(edges + bars, 0.0, 1.0));
          }`;
  };
  const cl = (I.crossNear + I.crossFar) / 2;
  return worldMaterial(
    `city-road-${S}`,
    {
      cAsphalt: {value: vec(CITY.asphalt)},
      cGutter: {value: vec(CITY.gutter)},
      cWhite: {value: vec(HIGHWAY.lineWhite)},
      cYellow: {value: vec(HIGHWAY.lineYellow)},
    },
    `
          float n = vnoise(vCityPos.xz * vec2(0.6, 0.15)) * 0.6 + vnoise(vCityPos.xz * vec2(2.2, 0.5)) * 0.4;
          col = cAsphalt * (0.93 + 0.14 * n);
          float inCross = boxF(z, ${f5(I.crossFar)}, ${f5(I.crossNear)}, wz);
          float gut = (boxF(x, ${f5(L.road[0])}, ${f5(L.road[0] + 0.45)}, wx) + boxF(x, ${f5(L.road[1] - 0.45)}, ${f5(L.road[1])}, wx)) * (1.0 - inCross);
          col = mix(col, cGutter * (0.95 + 0.1 * n), clamp(gut, 0.0, 1.0) * 0.9);
          float paint = 0.0;
          float dash = pulseF(-z + ${f5(L.dash.length / 2)}, ${f5(L.dash.period)}, ${f5(L.dash.length)}, wz);
          float lanesZ = boxF(z, ${f5(I.stopNear)}, 1.0, wz) + boxF(z, -2000.0, ${f5(I.cwFar[1])}, wz);
          float lines = ${L.laneLines.map((lx) => `boxF(x, ${f5(lx - 0.05)}, ${f5(lx + 0.05)}, wx)`).join(' + ')};
          paint = max(paint, lines * dash * lanesZ);
          paint = max(paint, boxF(z, ${f5(I.stopFar)}, ${f5(I.stopNear)}, wz) * boxF(x, ${f5(L.road[0] + 0.3)}, ${f5(L.road[1] - 0.3)}, wx));
          ${ladder(I.cwNear)}
          ${ladder(I.cwFar)}
          col = mix(col, cWhite * (0.96 + 0.06 * n), clamp(paint, 0.0, 1.0) * 0.95);
          float yl = (boxF(z, ${f5(cl - 0.2)}, ${f5(cl - 0.1)}, wz) + boxF(z, ${f5(cl + 0.1)}, ${f5(cl + 0.2)}, wz))
            * (1.0 - boxF(x, ${f5(L.walkL[1])}, ${f5(L.walkR[0])}, wx));
          col = mix(col, cYellow, clamp(yl, 0.0, 1.0) * 0.9);`,
    0.88,
  );
};

/** Sidewalk and curb concrete: a fixed mottle and the scored joints every 5 ft both ways. */
const concreteMaterial = () =>
  worldMaterial(
    'city-concrete',
    {cConcrete: {value: vec(STREET.concrete)}},
    `
          float n = vnoise(vCityPos.xz * vec2(0.9, 0.9)) * 0.6 + vnoise(vCityPos.xz * 3.1) * 0.4;
          col = cConcrete * (0.94 + 0.1 * n);
          float j = max(pulseF(x + 0.006, 1.524, 0.012, wx), pulseF(z + 0.006, 1.524, 0.012, wz));
          col *= 1.0 - 0.28 * j;`,
    0.9,
  );

/** A facade tile: one bay (3 m) × one storey: the wall colour and a window (the glass a little lighter at the top). */
const facadeTexture = (wall: string) => {
  const W = 48;
  const H = 64;
  const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [w, g] = [hex(wall), hex(CITY.window)];
  const data = new Uint8Array(W * H * 4);
  for (let j = 0; j < H; j++)
    for (let i = 0; i < W; i++) {
      const u = (i + 0.5) / W;
      const v = (j + 0.5) / H;
      const win = u > 0.16 && u < 0.84 && v > 0.3 && v < 0.86;
      const sill = u > 0.13 && u < 0.87 && v > 0.27 && v <= 0.3;
      const mull = win && Math.abs(u - 0.5) < 0.012;
      const c =
        win && !mull
          ? g.map((q) => q + 22 * (v - 0.3))
          : sill
            ? w.map((q) => q * 0.82)
            : mull
              ? w.map((q) => q * 0.7)
              : w;
      const o = (j * W + i) * 4;
      data[o] = Math.max(0, Math.min(255, c[0]));
      data[o + 1] = Math.max(0, Math.min(255, c[1]));
      data[o + 2] = Math.max(0, Math.min(255, c[2]));
      data[o + 3] = 255;
    }
  const t = new THREE.DataTexture(data, W, H, THREE.RGBAFormat);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.magFilter = THREE.LinearFilter;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.generateMipmaps = true;
  t.needsUpdate = true;
  return t;
};

type CityMats = ReturnType<typeof useCityMats>;

const useCityMats = (mood: Mood, S: number) => {
  const m = MOODS[mood];
  return useMemo(() => {
    const std = (c: string, o: THREE.MeshStandardMaterialParameters = {}) =>
      new THREE.MeshStandardMaterial({color: raw(c), roughness: 0.9, ...o});
    const phys = (c: string, o: THREE.MeshPhysicalMaterialParameters = {}) =>
      new THREE.MeshPhysicalMaterial({color: raw(c), ...o});
    return {
      cut: cutMaterial(),
      earth: std(m.earth, {roughness: 1}),
      road: roadMaterial(S),
      concrete: concreteMaterial(),
      facades: CITY.facades.map((c) => std(c, {roughness: 0.85})),
      facadeTex: CITY.facades.map((c) => facadeTexture(c)),
      roof: std(CITY.roof),
      wall: std(m.wall),
      floor: std(m.floor, {roughness: 0.7}),
      glass: phys(REAL.carGlass, {roughness: 0.06, metalness: 0.2, clearcoat: 1}),
      mullion: std(CITY.signalHousing, {roughness: 0.5, metalness: 0.3}),
      awnings: CITY.awnings.map((c) => std(c, {roughness: 0.95, side: THREE.DoubleSide})),
      duct: new THREE.MeshBasicMaterial({color: raw(CITY.ductBank)}),
      conduit: new THREE.MeshBasicMaterial({color: raw(CITY.conduit)}),
      pipe: new THREE.MeshBasicMaterial({color: raw(CITY.stormPipe)}),
      bore: new THREE.MeshBasicMaterial({color: raw(CITY.boreCut)}),
      grate: std(CITY.bore, {roughness: 0.6, metalness: 0.4}),
      housing: phys(CITY.signalHousing, {roughness: 0.45, clearcoat: 0.3}),
      mast: phys(CITY.mast, {roughness: 0.5, metalness: 0.4}),
      trunk: std(REAL.soil, {roughness: 1}),
      leaf: std(section.leaf, {roughness: 0.95, flatShading: true}),
      leafDark: std(section.leafDark, {roughness: 0.95, flatShading: true}),
    };
  }, [m.earth, m.wall, m.floor, S]);
};

/**
 * A building's section where the plane cuts it (pure: the slice inks the same rects the building draws):
 * the facade line and outer wall (x), the slabs' tops, the facade wall, back wall and the room's inside
 * (x ranges), the roof, the shop glazing's height, and the cut faces as rects ([x0, y0], [x1, y1]).
 */
const buildingSection = (side: 1 | -1, storeys: number) => {
  const xf = side > 0 ? L.bldL[1] : L.bldR[0];
  const xo = side > 0 ? L.bldL[0] : L.bldR[1];
  const g0 = L.grade;
  const g1 = g0 + L.ground;
  const top = g1 + storeys * L.storey;
  const slabs = [...Array(storeys + 1).keys()].map((k) => g1 + k * L.storey);
  const wallX: P2 = side > 0 ? [xf - 0.3, xf] : [xf, xf + 0.3];
  const backX: P2 = side > 0 ? [xo, xo + 0.3] : [xo - 0.3, xo];
  const inner: P2 = side > 0 ? [backX[1], wallX[0]] : [wallX[1], backX[0]];
  const shop = {y0: g0 + 0.5, y1: g0 + 3.7};
  const rects: [P2, P2][] = [
    ...slabs.map((y) => [[Math.min(xf, xo), y - 0.3] as P2, [Math.max(xf, xo), y] as P2] as [P2, P2]),
    ...[...Array(storeys).keys()].map(
      (k) => [[wallX[0], slabs[k]] as P2, [wallX[1], slabs[k + 1] - 0.3] as P2] as [P2, P2],
    ),
    [
      [backX[0], g0],
      [backX[1], top + 0.8],
    ],
    [
      [wallX[0], top],
      [wallX[1], top + 0.8],
    ],
    [
      [wallX[0], g0],
      [wallX[1], shop.y0],
    ],
    [
      [wallX[0], shop.y1],
      [wallX[1], g1 - 0.3],
    ],
    [
      [wallX[0], shop.y0],
      [wallX[1], shop.y1],
    ],
  ];
  return {xf, xo, g0, g1, top, slabs, wallX, backX, inner, shop, rects};
};

/** A building on one side of the street: massing with a windowed facade, a shop front, a blank awning. */
const Building: React.FC<{
  mats: CityMats;
  side: 1 | -1;
  z0: number;
  z1: number;
  storeys: number;
  colour: number;
  awning: number;
  /** Cut by the plane (z0 = 0): drawn as a section (slabs, walls, rooms), the cut faces hatched. */
  cut?: boolean;
}> = ({mats, side, z0, z1, storeys, colour, awning, cut = false}) => {
  const B = buildingSection(side, storeys);
  const {xf, xo, g0, g1, top, shop} = B;
  const [xmin, xmax] = [Math.min(xf, xo), Math.max(xf, xo)];
  const len = z0 - z1;
  const plain = mats.facades[colour % mats.facades.length];
  const C = mats.cut;
  // the windowed facade on the street face (one tile per bay and storey)
  const face = useMemo(() => {
    const t = mats.facadeTex[colour % mats.facadeTex.length].clone();
    t.needsUpdate = true;
    t.repeat.set(Math.max(1, Math.round(len / 3)), cut ? 1 : storeys);
    return new THREE.MeshStandardMaterial({color: raw('#ffffff'), roughness: 0.8, map: t});
  }, [mats.facadeTex, colour, len, storeys, cut]);
  // the end toward the camera (above a lower neighbour) has windows too
  const end = useMemo(() => {
    const t = mats.facadeTex[colour % mats.facadeTex.length].clone();
    t.needsUpdate = true;
    t.repeat.set(Math.max(1, Math.round((L.bldL[1] - L.bldL[0]) / 3)), Math.max(1, storeys));
    return new THREE.MeshStandardMaterial({color: raw('#ffffff'), roughness: 0.8, map: t});
  }, [mats.facadeTex, colour, storeys]);
  // face order [+x, −x, +y, −y, +z, −z]; the street face is +x on the left side, −x on the right
  const sides = (
    street: THREE.Material,
    rest: THREE.Material,
    topM: THREE.Material,
    bottom: THREE.Material,
    front: THREE.Material,
  ): Six => (side > 0 ? [street, rest, topM, bottom, front, rest] : [rest, street, topM, bottom, front, rest]);
  const fx = xf + side * 0.012;
  const rotY = side > 0 ? Math.PI / 2 : -Math.PI / 2;
  const shopZ: P2 = [z0 - (cut ? 0.3 : 0.6), z1 + 0.6];
  const nMull = Math.max(1, Math.floor((shopZ[0] - shopZ[1]) / 2.4));
  const mullions = [...Array(nMull + 1).keys()].map((k) => shopZ[0] - (k * (shopZ[0] - shopZ[1])) / nMull);
  const awn = {z0: Math.min(z0 - 1.2, shopZ[0] - 0.4), len: Math.min(7, len - 2.6), out: 1.4};

  const shopFront = (
    <>
      <mesh
        material={mats.glass}
        position={[fx, (shop.y0 + shop.y1) / 2, (shopZ[0] + shopZ[1]) / 2]}
        rotation={[0, rotY, 0]}
      >
        <planeGeometry args={[shopZ[0] - shopZ[1], shop.y1 - shop.y0]} />
      </mesh>
      {mullions.map((z) => (
        <mesh key={z} material={mats.mullion} position={[fx + side * 0.01, (shop.y0 + shop.y1) / 2, z]}>
          <boxGeometry args={[0.04, shop.y1 - shop.y0, 0.06]} />
        </mesh>
      ))}
      <mesh material={mats.mullion} position={[fx + side * 0.01, shop.y1, (shopZ[0] + shopZ[1]) / 2]}>
        <boxGeometry args={[0.04, 0.06, shopZ[0] - shopZ[1]]} />
      </mesh>
      {awn.len > 2 ? (
        <mesh
          material={mats.awnings[awning % mats.awnings.length]}
          position={[xf + (side * awn.out) / 2, g0 + 3.2, awn.z0 - awn.len / 2]}
          rotation={[0, 0, side * -0.32]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[awn.out / Math.cos(0.32), 0.04, awn.len]} />
        </mesh>
      ) : null}
    </>
  );

  if (!cut) {
    return (
      <group>
        <Block min={[xmin, g0, z1]} max={[xmax, g1, z0]} mats={sides(plain, plain, plain, plain, plain)} />
        <Block min={[xmin, g1, z1]} max={[xmax, top, z0]} mats={sides(face, plain, mats.roof, plain, end)} />
        <Block min={[side > 0 ? xf - 0.3 : xf, top, z1]} max={[side > 0 ? xf : xf + 0.3, top + 0.8, z0]} mats={plain} />
        {shopFront}
      </group>
    );
  }

  // the section: slabs, the facade wall (windows outside), the back wall, a cross wall closing each room
  const {slabs, wallX, backX, inner} = B;
  const room = z0 - 7;
  const parts: {min: V3; max: V3; mats: Six | THREE.Material}[] = [];
  slabs.forEach((y, k) =>
    parts.push({
      min: [xmin, y - 0.3, z1],
      max: [xmax, y, z0],
      mats: sides(plain, plain, k === storeys ? mats.roof : mats.floor, mats.wall, C),
    }),
  );
  for (let k = 0; k < storeys; k++) {
    const y0 = slabs[k];
    const y1 = slabs[k + 1] - 0.3;
    parts.push({min: [wallX[0], y0, z1], max: [wallX[1], y1, z0], mats: sides(face, plain, plain, plain, C)});
    parts.push({min: [inner[0], y0, room - 0.2], max: [inner[1], y1, room], mats: mats.wall});
  }
  // the back wall full height, the parapets, the shop's bulkhead and the band over its glazing
  parts.push({min: [backX[0], g0, z1], max: [backX[1], top + 0.8, z0], mats: sides(plain, plain, plain, mats.wall, C)});
  parts.push({min: [wallX[0], top, z1], max: [wallX[1], top + 0.8, z0], mats: sides(plain, plain, plain, plain, C)});
  parts.push({min: [wallX[0], g0, z1], max: [wallX[1], shop.y0, z0], mats: sides(plain, plain, plain, plain, C)});
  parts.push({
    min: [wallX[0], shop.y1, z1],
    max: [wallX[1], g1 - 0.3, z0],
    mats: sides(plain, plain, plain, mats.wall, C),
  });
  parts.push({min: [inner[0], g0, room - 0.2], max: [inner[1], g1 - 0.3, room], mats: mats.wall});

  return (
    <group>
      {parts.map((p, i) => (
        <Block key={i} min={p.min} max={p.max} mats={p.mats} />
      ))}
      {/* the shop floor (over the sidewalk-level ground) and its glazing, cut at the plane */}
      <mesh
        material={mats.floor}
        position={[(inner[0] + inner[1]) / 2, g0 + 0.003, (z0 + room) / 2]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[inner[1] - inner[0], z0 - room]} />
      </mesh>
      {shopFront}
    </group>
  );
};

/** The plaza strip's planters (z of their middles). */
const PLAZA_PLANTERS = [-7, -19];

/** A street tree: a trunk, two limbs and a canopy of leaf clumps (fixed offsets, no randomness). */
const Tree: React.FC<{mats: CityMats; at: V3; turn: number}> = ({mats, at, turn}) => {
  const clumps: [number, number, number, number][] = [
    [0, 4.4, 0, 1.4],
    [0.95, 4.0, 0.3, 1.05],
    [-0.9, 4.1, -0.2, 1.1],
    [0.2, 3.9, 0.95, 1.0],
    [-0.3, 3.95, -0.95, 1.0],
    [0.35, 5.1, -0.25, 1.0],
  ];
  return (
    <group position={at} rotation={[0, turn, 0]}>
      <mesh material={mats.trunk} position={[0, 1.6, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.16, 3.2, 10]} />
      </mesh>
      {clumps.map(([cx, cy, cz, r], k) => (
        <mesh
          key={k}
          material={k % 3 === 1 ? mats.leafDark : mats.leaf}
          position={[cx, cy, cz]}
          scale={[1, 0.85, 1]}
          castShadow
        >
          <icosahedronGeometry args={[r, 1]} />
        </mesh>
      ))}
    </group>
  );
};

/** One 12 in, three-section signal head facing +z, with its backplate and tunnel visors; lenses flat. */
export const SignalHead: React.FC<{
  position: V3;
  state: SignalState;
  housing: THREE.Material;
  lenses: {red: THREE.Material; yellow: THREE.Material; green: THREE.Material};
  unlit: {red: THREE.Material; yellow: THREE.Material; green: THREE.Material};
}> = ({position, state, housing, lenses, unlit}) => {
  const visor = useMemo(() => {
    // a tunnel visor: an open cylinder missing its bottom quarter, along z
    const g = new THREE.CylinderGeometry(0.165, 0.165, 0.24, 20, 1, true, Math.PI * 0.75, Math.PI * 1.5);
    g.rotateX(Math.PI / 2);
    return g;
  }, []);
  return (
    <group position={position}>
      <mesh geometry={roundedBox(0.66, 1.34, 0.02, 0.01, 2)} material={housing} position={[0, 0, -0.14]} castShadow />
      <mesh geometry={roundedBox(0.38, 1.08, 0.26, 0.03, 3)} material={housing} castShadow />
      {(['red', 'yellow', 'green'] as const).map((c, i) => {
        const y = 0.34 - i * 0.34;
        return (
          <group key={c} position={[0, y, 0.131]}>
            <mesh material={state === c ? lenses[c] : unlit[c]}>
              <circleGeometry args={[0.15, 28]} />
            </mesh>
            <mesh geometry={visor} material={housing} position={[0, 0, 0.12]} castShadow />
          </group>
        );
      })}
      {/* the hanger up to the arm */}
      <mesh material={housing} position={[0, 0.64, -0.02]}>
        <cylinderGeometry args={[0.03, 0.03, 0.22, 10]} />
      </mesh>
    </group>
  );
};

export type CitySliceProps = {
  mood: Mood;
  /** The stop line's near edge, metres up the street from the plane. */
  stopLine?: number;
  /** The signal's state (all heads). */
  signal?: SignalState;
  /** Ink width scale for the cut face (× the § 3 ink): the scene keeps it ≈ 3 px from close to wide. */
  ink?: number;
  /** The signs (facing the camera): kind, legend, place. */
  signs?: {kind: RoadSignKind; text: string[]; x: number; z: number}[];
  /** Street trees on the left sidewalk (default true). */
  trees?: boolean;
};

/** The city slice (see the file comment). */
export const CitySlice: React.FC<CitySliceProps> = ({
  mood,
  stopLine = 35,
  signal = 'red',
  ink = 1,
  signs = [],
  trees = true,
}) => {
  const S = stopLine;
  const I = cityIntersection(S);
  const mats = useCityMats(mood, S);
  const m = MOODS[mood];
  const env = useStudioEnv();
  const envScale = useEnvStrength();
  applyEnv(
    env,
    [
      [mats.glass, 1.0],
      [mats.housing, 0.4],
      [mats.mast, 0.6],
    ],
    envScale,
  );
  // the signal's lenses: lit = flat emissive in the signal colour (never bloomed), unlit = the dark lens
  const lens = useMemo(() => {
    const lit = (c: string, base: string) =>
      new THREE.MeshStandardMaterial({color: raw(base), roughness: 0.3, emissive: raw(c), emissiveIntensity: 1});
    const dark = (base: string) => new THREE.MeshStandardMaterial({color: raw(base), roughness: 0.25, metalness: 0.1});
    return {
      lit: {
        red: lit(section.signalRed, CITY.lensRed),
        yellow: lit(section.warning, CITY.lensYellow),
        green: lit(section.signalGreen, CITY.lensGreen),
      },
      unlit: {red: dark(CITY.lensRed), yellow: dark(CITY.lensYellow), green: dark(CITY.lensGreen)},
    };
  }, []);
  Object.values(lens.lit).forEach((q) => (q.emissiveIntensity = 1.1 / m.exposure));

  const C = mats.cut;
  const E = mats.earth;
  const G = L.grade;
  const D = L.depth;
  const X0 = L.bldL[0];
  const X1 = L.bldR[1];

  // the buildings: [z0, z1, storeys, colour, awning]; the first on each side is cut by the plane
  const blocks = useMemo(() => {
    const left: [number, number, number, number, number][] = [];
    const right: [number, number, number, number, number][] = [];
    const fill = (out: typeof left, from: number, to: number, widths: number[], storeys: number[], k0: number) => {
      let z = from;
      let k = 0;
      while (z - 4 > to) {
        const w = Math.min(widths[k % widths.length], z - to);
        out.push([
          z,
          z - w,
          storeys[k % storeys.length],
          (k + k0) % CITY.facades.length,
          (k + k0) % CITY.awnings.length,
        ]);
        z -= w;
        k++;
      }
    };
    fill(left, 0, I.blockNearEnd, [14, 11, 13, 12], [3, 5, 4, 6], 0);
    fill(left, I.blockFarStart, -D, [13, 15, 11, 14, 12], [5, 7, 4, 6, 8], 2);
    // the right side's near block is an open plaza (from the fixed angle any building there hides
    // the lanes at the stop line); low shops start past the cross street
    fill(right, I.blockFarStart, -D, [14, 12, 16, 13], [0, 1, 0, 2], 1);
    return {left, right};
  }, [I.blockNearEnd, I.blockFarStart, D]);

  const inkPolys: V3[][] = [];
  // the ground's cut face: the profile across the street, and its layers (asphalt, base, sidewalk slab, curbs)
  inkPolys.push([
    [X0, L.bottom, 0.003],
    [X0, G, 0.003],
    [L.curbL[1], G, 0.003],
    [L.road[0], 0, 0.003],
    [L.road[1], 0, 0.003],
    [L.curbR[0], G, 0.003],
    [X1, G, 0.003],
    [X1, L.bottom, 0.003],
    [X0, L.bottom, 0.003],
  ]);
  inkPolys.push([
    [L.curbL[0], -0.15, 0.003],
    [L.curbR[1], -0.15, 0.003],
  ]);
  inkPolys.push([
    [L.curbL[0] - 0.3, -0.45, 0.003],
    [L.curbR[1] + 0.3, -0.45, 0.003],
  ]);
  for (const [a, b] of [L.walkL, L.walkR]) {
    inkPolys.push([
      [a, G - 0.1, 0.003],
      [b, G - 0.1, 0.003],
    ]);
  }
  for (const [a, b] of [L.curbL, L.curbR]) {
    inkPolys.push([
      [a, -0.45, 0.003],
      [a, G, 0.003],
    ]);
    inkPolys.push([
      [b, -0.45, 0.003],
      [b, G, 0.003],
    ]);
  }
  // under the right curb, sidewalk and plaza (the part of the cut the 'queue' framing shows): the curb
  // storm sewer cut round and the duct bank with its conduits (the inlet's grate in the gutter above)
  const storm = {x: 12.3, y: -2.2, r: 0.46, wall: 0.08};
  const duct = {x: [14.5, 15.85] as P2, y: [-1.3, -0.62] as P2};
  const conduits = [0, 1, 2].flatMap((i) =>
    [0, 1].map((j) => [duct.x[0] + 0.25 + i * 0.425, duct.y[0] + 0.18 + j * 0.32] as P2),
  );
  const circle = (cx: number, cy: number, r: number): V3[] =>
    [...Array(41).keys()].map(
      (i) => [cx + r * Math.cos((i / 40) * Math.PI * 2), cy + r * Math.sin((i / 40) * Math.PI * 2), 0.004] as V3,
    );
  const box2 = (x: P2, y: P2, z = 0.004): V3[] => [
    [x[0], y[0], z],
    [x[1], y[0], z],
    [x[1], y[1], z],
    [x[0], y[1], z],
    [x[0], y[0], z],
  ];
  inkPolys.push(circle(storm.x, storm.y, storm.r));
  inkPolys.push(circle(storm.x, storm.y, storm.r - storm.wall));
  inkPolys.push(box2(duct.x, duct.y));
  conduits.forEach(([cx, cy]) => inkPolys.push(circle(cx, cy, 0.1)));

  const geo = useMemo(
    () => ({
      ring: (r0: number, r1: number) => new THREE.RingGeometry(r0, r1, 48),
      disc: (r: number) => new THREE.CircleGeometry(r, 48),
    }),
    [],
  );
  const stormRing = useMemo(() => geo.ring(storm.r - storm.wall, storm.r), [geo, storm.r, storm.wall]);
  const stormBore = useMemo(() => geo.disc(storm.r - storm.wall), [geo, storm.r, storm.wall]);
  const conduitRing = useMemo(() => geo.ring(0.075, 0.1), [geo]);
  const conduitBore = useMemo(() => geo.disc(0.075), [geo]);

  // the cut buildings' outlines join the ink
  const cutInk: V3[][] = [...buildingSection(1, blocks.left[0]?.[2] ?? 0).rects].map(([a, b]) => [
    [a[0], a[1], 0.003],
    [b[0], a[1], 0.003],
    [b[0], b[1], 0.003],
    [a[0], b[1], 0.003],
    [a[0], a[1], 0.003],
  ]);
  cutInk.push(
    [
      [L.walkR[1], L.base, 0.003],
      [L.walkR[1], G, 0.003],
    ],
    [
      [L.walkR[1], G, 0.003],
      [L.walkR[1], G + 0.35, 0.003],
      [L.walkR[1] + 0.3, G + 0.35, 0.003],
      [L.walkR[1] + 0.3, G, 0.003],
    ],
    [
      [L.walkR[1], -0.15, 0.003],
      [X1, -0.15, 0.003],
    ],
  );
  const planterBox = useMemo(() => roundedBox(0.8, 0.4, 1.8, 0.03, 2), []);
  const planterShrub = useMemo(() => roundedBox(0.65, 0.22, 1.65, 0.1, 3), []);
  const hedge = useMemo(() => roundedBox(0.4, 0.3, -I.blockNearEnd - 1.5, 0.12, 3), [I.blockNearEnd]);
  const inkT = INK * ink;
  const armTip = 0.9;
  const sig = I.signal;

  return (
    <group>
      {/* the ground: one deep block, the street's surfaces on it (cut on the plane) */}
      <Block min={[X0, L.bottom, -D]} max={[X1, L.base, 0]} mats={[C, E, E, E, C, E]} shadow={false} />
      <Block min={[L.road[0], L.base, -D]} max={[L.road[1], 0, 0]} mats={[E, E, mats.road, E, C, E]} shadow={false} />
      {/* the cross street's roadway outside ours */}
      <Block
        min={[X0, L.base, I.crossFar]}
        max={[L.road[0], 0, I.crossNear]}
        mats={[E, E, mats.road, E, E, E]}
        shadow={false}
      />
      <Block
        min={[L.road[1], L.base, I.crossFar]}
        max={[X1, 0, I.crossNear]}
        mats={[E, E, mats.road, E, E, E]}
        shadow={false}
      />
      {/* sidewalks and curbs: the near block (to the corner) and the far block */}
      {(
        [
          [0, I.crossNear],
          [I.crossFar, -D],
        ] as P2[]
      ).map(([za, zb], i) => (
        <React.Fragment key={i}>
          <Block
            min={[X0, L.base, zb]}
            max={[L.curbL[1], G, za]}
            mats={[mats.concrete, E, mats.concrete, E, i === 0 ? C : mats.concrete, mats.concrete]}
            shadow={false}
          />
          <Block
            min={[L.curbR[0], L.base, zb]}
            max={[i === 0 ? L.walkR[1] : X1, G, za]}
            mats={[E, mats.concrete, mats.concrete, E, i === 0 ? C : mats.concrete, mats.concrete]}
            shadow={false}
          />
        </React.Fragment>
      ))}
      {/* the near block's right side: a narrow plaza strip behind a low planter wall and hedge */}
      <Block
        min={[L.walkR[1], L.base, I.crossNear]}
        max={[X1, G, 0]}
        mats={[C, E, mats.concrete, E, C, mats.concrete]}
        shadow={false}
      />
      <Block
        min={[L.walkR[1], G, I.blockNearEnd + 1.5]}
        max={[L.walkR[1] + 0.3, G + 0.35, 0]}
        mats={[mats.concrete, mats.concrete, mats.concrete, E, C, mats.concrete]}
      />
      <mesh
        geometry={hedge}
        material={mats.leafDark}
        position={[L.walkR[1] + 0.15, G + 0.5, (I.blockNearEnd + 1.5) / 2]}
        castShadow
        receiveShadow
      />
      {/* the plaza strip's low planters (under 1 m: from the fixed angle nothing taller may stand here) */}
      {PLAZA_PLANTERS.map((z) => (
        <group key={z} position={[15.4, G, z]}>
          <mesh geometry={planterBox} material={mats.concrete} position={[0, 0.2, 0]} castShadow receiveShadow />
          <mesh geometry={planterShrub} material={mats.leafDark} position={[0, 0.48, 0]} castShadow />
        </group>
      ))}
      {/* the slice's ends, cut */}
      <mesh material={C} position={[X1, (L.bottom + G) / 2, -D / 2]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[D, G - L.bottom]} />
      </mesh>

      {/* under the street, on the cut face: the storm sewer and the duct bank (light bores: drawn, not holes) */}
      <mesh geometry={stormRing} material={mats.pipe} position={[storm.x, storm.y, 0.003]} />
      <mesh geometry={stormBore} material={mats.bore} position={[storm.x, storm.y, 0.003]} />
      <mesh material={mats.duct} position={[(duct.x[0] + duct.x[1]) / 2, (duct.y[0] + duct.y[1]) / 2, 0.002]}>
        <planeGeometry args={[duct.x[1] - duct.x[0], duct.y[1] - duct.y[0]]} />
      </mesh>
      {conduits.map(([cx, cy], i) => (
        <group key={i} position={[cx, cy, 0.003]}>
          <mesh geometry={conduitRing} material={mats.conduit} />
          <mesh geometry={conduitBore} material={mats.bore} />
        </group>
      ))}
      {/* the curb inlet's grate in the gutter, crossing the plane */}
      {[0, 1, 2, 3, 4].map((k) => (
        <mesh key={k} material={mats.grate} position={[9.38 + k * 0.11, 0.004, -0.45]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.06, 0.9]} />
        </mesh>
      ))}

      {/* buildings: the first on each side cut by the plane */}
      {blocks.left.map(([z0, z1, n, c, a], i) => (
        <Building
          key={`l${i}`}
          mats={mats}
          side={1}
          z0={z0}
          z1={z1}
          storeys={n}
          colour={c}
          awning={a}
          cut={i === 0 && z0 === 0}
        />
      ))}
      {blocks.right.map(([z0, z1, n, c, a], i) => (
        <Building
          key={`r${i}`}
          mats={mats}
          side={-1}
          z0={z0}
          z1={z1}
          storeys={n}
          colour={c}
          awning={a}
          cut={i === 0 && z0 === 0}
        />
      ))}
      {trees
        ? [-5.5, -16, -26.5, I.blockFarStart - 6, I.blockFarStart - 17, I.blockFarStart - 28].map((z, i) => (
            <Tree key={z} mats={mats} at={[-1.1, G, z]} turn={i * 1.3} />
          ))
        : null}

      {/* the mast-arm signal on the far right corner, a head over each lane facing the camera */}
      <group>
        <mesh material={mats.mast} position={[sig.x, G + 3.7, sig.z]} castShadow>
          <cylinderGeometry args={[0.13, 0.17, 7.4, 16]} />
        </mesh>
        <mesh material={mats.mast} position={[sig.x, G + 0.15, sig.z]}>
          <cylinderGeometry args={[0.28, 0.3, 0.3, 16]} />
        </mesh>
        <mesh
          material={mats.mast}
          position={[(sig.x + armTip) / 2, sig.headY + 0.95, sig.z]}
          rotation={[0, 0, Math.PI / 2 - 0.025]}
          castShadow
        >
          <cylinderGeometry args={[0.06, 0.12, sig.x - armTip, 12]} />
        </mesh>
        {L.lanes.map((x) => (
          <SignalHead
            key={x}
            position={[x, sig.headY, sig.z]}
            state={signal}
            housing={mats.housing}
            lenses={lens.lit}
            unlit={lens.unlit}
          />
        ))}
      </group>
      {signs.map((s, i) => (
        <RoadSign key={i} mood={mood} kind={s.kind} text={s.text} position={[s.x, G, s.z]} />
      ))}

      {[...inkPolys, ...cutInk].map((p, i) => (
        <FlatInk key={i} points={p} width={inkT} />
      ))}
    </group>
  );
};
