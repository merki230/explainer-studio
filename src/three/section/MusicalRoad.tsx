import React, {useMemo} from 'react';
import {random} from 'remotion';
import * as THREE from 'three';
import {DESERT, HIGHWAY, MOODS, REAL, section, STREET, type Mood} from '../../theme';
import {raw} from '../plaster';
import {cutMaterial, INK} from './cutLook';
import {House, mottle} from './StreetSlice';

type V3 = [number, number, number];

/*
 * L, the musical road (No. 005): a generic two-lane desert road at night, in metres. The road runs
 * along x (traffic in the near lane drives +x, left to right on screen); the slice is cut along the near
 * lane's right wheel path, the plane z = `cutZ`, so the cut face is a long section through the road and,
 * where the road is grooved, through every groove: a row of notches. The grooves are milled across the
 * near lane in groups (one group per note), each group with its own spacing; they sit in one strip of
 * pavement that can lift out and slide away ("it got moved"), leaving plain asphalt. Behind the road:
 * the far lane, a gravel edge, a strip of packed sand with scrub and one house (the street slice's
 * massing) with a bedroom window that can light. The slice is shallow (it ends 18 m back) so the fixed
 * 16° angle keeps a band of sky over it for the note staff. No sign, no road name, no map. The car,
 * lights, sky and camera belong to the scene.
 */

export const MUSICAL_LAYOUT = {
  /** The cut face (the near lane's right wheel path: the near lane is z 0 → 3.6, its car's right tires at ≈ 2.6). */
  cutZ: 2.75,
  /** The near lane's centre (a car's centre line), the far lane's far edge, the gravel's far edge. */
  nearLane: 1.8,
  farEdge: -3.6,
  gravelEdge: -4.4,
  /** The grooved strip's back edge (just short of the double yellow centre line). */
  stripBack: 0.2,
  /** The strip's thickness (its slab, seen when it lifts out). */
  stripT: 0.07,
  /** The slice's ends (x), its bottom, how far back the sand runs, the sand's level. */
  x0: -60,
  x1: 60,
  bottom: -1.4,
  back: -18,
  sandY: -0.04,
};
const L = MUSICAL_LAYOUT;

/** One group of grooves (one note): `spacing` centre to centre (m), `count` grooves. */
export type GrooveGroup = {spacing: number; count?: number};

/**
 * The default groups (🎭 invented layout, exaggerated so the spacing reads on screen): wide and tight
 * groups in turn, ending on the tightest.
 */
export const DEFAULT_GROUPS: GrooveGroup[] = [
  {spacing: 0.26, count: 6},
  {spacing: 0.19, count: 8},
  {spacing: 0.14, count: 10},
  {spacing: 0.26, count: 6},
  {spacing: 0.11, count: 13},
  {spacing: 0.19, count: 8},
  {spacing: 0.14, count: 10},
  {spacing: 0.085, count: 16},
];

export type GrooveLayout = {
  grooves: {x: number; w: number; group: number}[];
  groups: {x0: number; x1: number; spacing: number}[];
  /** The strip's ends (x). */
  x0: number;
  x1: number;
};

/** Where every groove sits: groups laid end to end from `start` (x of the first groove), `gap` between groups. */
export const grooveLayout = (groups: GrooveGroup[], start: number, gap: number, width: number): GrooveLayout => {
  const grooves: GrooveLayout['grooves'] = [];
  const spans: GrooveLayout['groups'] = [];
  let x = start;
  groups.forEach((g, k) => {
    const n = Math.max(1, Math.round(g.count ?? 8));
    const w = Math.min(0.06, g.spacing * width);
    for (let i = 0; i < n; i++) grooves.push({x: x + i * g.spacing, w, group: k});
    spans.push({x0: x - w / 2, x1: x + (n - 1) * g.spacing + w / 2, spacing: g.spacing});
    x += (n - 1) * g.spacing + gap;
  });
  const first = spans[0]?.x0 ?? start;
  const last = spans[spans.length - 1]?.x1 ?? start;
  return {grooves, groups: spans, x0: first - 0.35, x1: last + 0.35};
};

/** Where the house stands by default (its centre on the sand; its front faces the road, +z). */
export const HOUSE_SPOT = {x: -17, z: -11.5, depth: 6.4, width: 8.6};

/** The bedroom window's middle (world), for a house at (hx, hz): the front window further from the door. */
export const houseWindowAt = (hx: number, hz: number): V3 => [hx + 1.7, L.sandY + 1.9, hz + HOUSE_SPOT.depth / 2 + 0.01];

/** A quad strip lying flat at height y: x0 → x1 across, z0 → z1; uv in metres. */
const flatGeo = (x0: number, x1: number, z0: number, z1: number, y: number) => {
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute([x0, y, z0, x1, y, z0, x1, y, z1, x0, y, z1], 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute([x0, z0, x1, z0, x1, z1, x0, z1], 2));
  g.setAttribute('normal', new THREE.Float32BufferAttribute([0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0], 3));
  g.setIndex([0, 2, 1, 0, 3, 2]);
  return g;
};

type Six = [THREE.Material, THREE.Material, THREE.Material, THREE.Material, THREE.Material, THREE.Material];
/** A box between two corners, a material per face ([+x, −x, +y, −y, +z, −z]). */
const Block: React.FC<{min: V3; max: V3; mats: Six; visible?: boolean}> = ({min, max, mats, visible = true}) => (
  <mesh
    position={[(min[0] + max[0]) / 2, (min[1] + max[1]) / 2, (min[2] + max[2]) / 2]}
    material={mats}
    receiveShadow
    visible={visible}
  >
    <boxGeometry args={[max[0] - min[0], max[1] - min[1], max[2] - min[2]]} />
  </mesh>
);

/**
 * Ink along a polyline lying in a plane (z = const: 'xy', or x = const: 'zy'), as flat quads whose
 * width is a uniform, so the scene can keep it ≈ 3 px through a pull-back without rebuilding geometry.
 * Unlit `cutLine`. (The same idea as the highway slice's face ink, with the side plane added.)
 */
export const PlaneInk: React.FC<{points: V3[]; closed?: boolean; width: number; plane?: 'xy' | 'zy'; opacity?: number}> = ({
  points,
  closed = false,
  width,
  plane = 'xy',
  opacity = 1,
}) => {
  const key = JSON.stringify([points, closed, plane]);
  const geometry = useMemo(() => {
    const [pts, cl, pl] = JSON.parse(key) as [V3[], boolean, 'xy' | 'zy'];
    const uv = (p: V3): [number, number] => (pl === 'xy' ? [p[0], p[1]] : [p[2], p[1]]);
    const pos: number[] = [];
    const dir: number[] = [];
    const idx: number[] = [];
    const n = cl ? pts.length : pts.length - 1;
    for (let i = 0; i < n; i++) {
      const a = pts[i];
      const b = pts[(i + 1) % pts.length];
      const [au, av] = uv(a);
      const [bu, bv] = uv(b);
      const len = Math.hypot(bu - au, bv - av) || 1;
      const d = [(bu - au) / len, (bv - av) / len];
      const nn = [-d[1], d[0]];
      const k = pos.length / 3;
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
    const m = new THREE.MeshBasicMaterial({color: raw(section.cutLine), side: THREE.DoubleSide, transparent: true});
    const uniforms = {uInk: {value: INK}};
    m.userData.uniforms = uniforms;
    m.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, uniforms);
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', '#include <common>\nattribute vec2 inkDir;\nuniform float uInk;')
        .replace(
          '#include <begin_vertex>',
          plane === 'xy'
            ? '#include <begin_vertex>\ntransformed.xy += inkDir * 0.5 * uInk;'
            : '#include <begin_vertex>\ntransformed.zy += inkDir * 0.5 * uInk;',
        );
    };
    m.customProgramCacheKey = () => `plane-ink-${plane}`;
    return m;
  }, [plane]);
  (material.userData.uniforms as {uInk: {value: number}}).uInk.value = width;
  material.opacity = opacity;
  return <mesh geometry={geometry} material={material} frustumCulled={false} visible={opacity > 0.01} />;
};

export type MusicalRoadProps = {
  mood: Mood;
  /** The groove layout (`grooveLayout`). */
  layout: GrooveLayout;
  /** How lit each groove is, 0 (dark) → 1 (orange, the system), in `layout.grooves` order. */
  lit?: number[];
  /** Groove depth on the cut (m). */
  depth?: number;
  /**
   * The strip with the grooves: `lift` (m up), `slide` (m along +x), `opacity` (1 → 0 for a fade).
   * Anything but rest shows plain asphalt where it was.
   */
  strip?: {lift: number; slide: number; opacity: number};
  /** The house (null: none) and how lit its bedroom window is (0 → 1, the lamp practical). */
  house?: {x: number; z: number} | null;
  window?: number;
  /** Ink width scale (× the § 3 ink); the scene keeps it ≈ 3 px from the close-up to the wide shot. */
  ink?: number;
  /** Scrub clumps on the sand (default 70). */
  scrub?: number;
};

/** The musical road slice (see the file comment). */
export const MusicalRoad: React.FC<MusicalRoadProps> = ({
  mood,
  layout,
  lit = [],
  depth = 0.03,
  strip = {lift: 0, slide: 0, opacity: 1},
  house = {x: HOUSE_SPOT.x, z: HOUSE_SPOT.z},
  window: windowLit = 0,
  ink = 1,
  scrub = 70,
}) => {
  const m = MOODS[mood];
  const resting = strip.lift < 1e-4 && Math.abs(strip.slide) < 1e-4 && strip.opacity > 0.999;
  const fading = strip.opacity < 0.999;

  const mats = useMemo(() => {
    const tex = (c: string, amount: number, rep: number) => {
      const mm = new THREE.MeshStandardMaterial({color: raw('#ffffff'), roughness: 1, map: mottle(c, amount)});
      mm.map!.repeat.set(rep, rep);
      return mm;
    };
    const asphalt = tex(HIGHWAY.asphalt, 7, 0.3);
    asphalt.roughness = 0.9;
    const earth = new THREE.MeshStandardMaterial({color: raw(m.earth), roughness: 1});
    const cut = cutMaterial();
    return {
      asphalt,
      sand: tex(DESERT.sand, 9, 0.11),
      verge: tex(DESERT.sandDark, 10, 0.2),
      gravel: tex(HIGHWAY.gravel, 50, 2.5),
      earth,
      cut,
      white: new THREE.MeshStandardMaterial({color: raw(HIGHWAY.lineWhite), roughness: 0.6}),
      yellow: new THREE.MeshStandardMaterial({color: raw(HIGHWAY.lineYellow), roughness: 0.6}),
      // the strip's own materials (transparent so it can fade out)
      stripTop: (() => {
        const s = tex(HIGHWAY.asphalt, 7, 0.3);
        s.roughness = 0.9;
        s.transparent = true;
        return s;
      })(),
      stripCut: (() => {
        const c = cutMaterial();
        c.transparent = true;
        return c;
      })(),
      milled: new THREE.MeshStandardMaterial({color: raw(HIGHWAY.milled), roughness: 1, transparent: true}),
      glow: new THREE.MeshBasicMaterial({
        color: raw('#ffffff'),
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
        toneMapped: false,
      }),
      scrub: new THREE.MeshStandardMaterial({color: raw(DESERT.scrub), roughness: 1}),
      scrubDark: new THREE.MeshStandardMaterial({color: raw(DESERT.scrubDark), roughness: 1}),
      siding: new THREE.MeshStandardMaterial({color: raw(STREET.sidings[2]), roughness: 0.85}),
      roof: new THREE.MeshStandardMaterial({color: raw(STREET.roof), roughness: 0.9}),
      trim: new THREE.MeshStandardMaterial({color: raw(m.trim), roughness: 0.6}),
      win: new THREE.MeshPhysicalMaterial({color: raw(REAL.carGlass), roughness: 0.08, metalness: 0.2, clearcoat: 1}),
      // the bedroom window: dark glass, then the lamp practical behind it (flat, unlit colour; no bloom)
      bedroom: new THREE.MeshBasicMaterial({color: raw(REAL.carGlass)}),
    };
  }, [m.earth, m.trim]);
  {
    // dark glass → the lamp practical (#ffd29a after the exposure: warm, lightness above the reserved band)
    const lampGlow = raw(MOODS.night.lamp!.light).multiplyScalar(1.12 / m.exposure);
    mats.bedroom.color.copy(raw(REAL.carGlass)).multiplyScalar(0.5).lerp(lampGlow, windowLit);
  }
  for (const k of ['stripTop', 'stripCut', 'milled'] as const) mats[k].opacity = strip.opacity;

  const {cutZ, bottom: B, x0: X0, x1: X1} = L;
  const sx0 = layout.x0;
  const sx1 = layout.x1;
  const T = L.stripT;

  // the strip: a slab with the notches on top, extruded from the cut face back to the strip's edge
  const stripKey = JSON.stringify([layout, depth]);
  const stripGeo = useMemo(() => {
    const [lay, d] = JSON.parse(stripKey) as [GrooveLayout, number];
    const pts: [number, number][] = [
      [lay.x0, -L.stripT],
      [lay.x0, 0],
    ];
    for (const g of lay.grooves) pts.push([g.x - g.w / 2, 0], [g.x - g.w / 2, -d], [g.x + g.w / 2, -d], [g.x + g.w / 2, 0]);
    pts.push([lay.x1, 0], [lay.x1, -L.stripT]);
    const shape = new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(x, y)));
    const len = L.cutZ - L.stripBack;
    const g = new THREE.ExtrudeGeometry(shape, {depth: len, bevelEnabled: false, curveSegments: 1});
    g.translate(0, 0, L.stripBack);
    // the profile for the ink (on the cut face)
    return {g, profile: pts.map(([x, y]) => [x, y, L.cutZ + 0.002] as V3)};
  }, [stripKey]);

  // the groove bottoms (dark milled faces) and their orange overlay, one instance per groove
  const n = layout.grooves.length;
  const inst = useMemo(() => {
    const len = L.cutZ - L.stripBack;
    const plane = new THREE.PlaneGeometry(1, len);
    plane.rotateX(-Math.PI / 2);
    const dark = new THREE.InstancedMesh(plane, mats.milled, Math.max(1, n));
    const glow = new THREE.InstancedMesh(plane, mats.glow, Math.max(1, n));
    // the glow also lines the notch on the cut face (a thin vertical sliver at the face)
    const face = new THREE.PlaneGeometry(1, 1);
    const glowFace = new THREE.InstancedMesh(face, mats.glow, Math.max(1, n));
    dark.receiveShadow = true;
    glow.frustumCulled = glowFace.frustumCulled = dark.frustumCulled = false;
    glow.renderOrder = glowFace.renderOrder = 3;
    return {dark, glow, glowFace, len};
  }, [n, mats.milled, mats.glow]);
  {
    const mtx = new THREE.Matrix4();
    const c = new THREE.Color();
    const orange = raw(section.orange);
    layout.grooves.forEach((g, i) => {
      const zc = (L.cutZ + L.stripBack) / 2;
      inst.dark.setMatrixAt(i, mtx.compose(new THREE.Vector3(g.x, -depth + 0.0015, zc), new THREE.Quaternion(), new THREE.Vector3(g.w, 1, 1)));
      const k = Math.max(0, Math.min(1, lit[i] ?? 0));
      const on = k > 0.004;
      inst.glow.setMatrixAt(
        i,
        mtx.compose(new THREE.Vector3(g.x, -depth + 0.003, zc), new THREE.Quaternion(), new THREE.Vector3(on ? g.w : 0, 1, on ? 1 : 0)),
      );
      inst.glowFace.setMatrixAt(
        i,
        mtx.compose(new THREE.Vector3(g.x, -depth / 2, L.cutZ + 0.003), new THREE.Quaternion(), new THREE.Vector3(on ? g.w : 0, on ? depth : 0, 1)),
      );
      c.copy(orange).multiplyScalar(k * strip.opacity);
      inst.glow.setColorAt(i, c);
      inst.glowFace.setColorAt(i, c);
    });
    for (const q of [inst.dark, inst.glow, inst.glowFace]) {
      q.count = n;
      q.instanceMatrix.needsUpdate = true;
      if (q.instanceColor) q.instanceColor.needsUpdate = true;
    }
  }
  const anyLit = lit.some((k) => k > 0.01) && strip.opacity > 0.05;

  // scrub: fixed clumps on the sand (seeded), clear of the road, the house and its drive
  const scrubMeshes = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(1, 2);
    const a = new THREE.InstancedMesh(geo, mats.scrub, scrub * 5);
    const b = new THREE.InstancedMesh(geo, mats.scrubDark, scrub * 5);
    const mtx = new THREE.Matrix4();
    let na = 0;
    let nb = 0;
    const hx = house?.x ?? 1e9;
    const hz = house?.z ?? 1e9;
    // each clump: 3 to 5 small blobs around a centre (a low, ragged bush), one of two greens
    for (let i = 0, made = 0; i < scrub * 4 && made < scrub; i++) {
      const x = X0 + 2 + random(`scrub-x-${i}`) * (X1 - X0 - 4);
      const z = L.back + 0.9 + random(`scrub-z-${i}`) * (L.gravelEdge - 1.0 - L.back - 0.9);
      if (Math.abs(x - hx) < HOUSE_SPOT.width / 2 + 1.2 && Math.abs(z - hz) < HOUSE_SPOT.depth / 2 + 1.5) continue;
      if (Math.abs(x - (hx - 1.5)) < 2.2 && z > hz) continue;
      made++;
      const size = 0.4 + random(`scrub-s-${i}`) * 0.45;
      const dark = random(`scrub-c-${i}`) < 0.5;
      const blobs = 5 + Math.floor(random(`scrub-n-${i}`) * 4);
      for (let j = 0; j < blobs && na < scrub * 5 && nb < scrub * 5; j++) {
        const ang = random(`scrub-a-${i}-${j}`) * Math.PI * 2;
        const rr = j === 0 ? 0 : size * (0.3 + 0.45 * random(`scrub-d-${i}-${j}`));
        const s = size * (j === 0 ? 0.42 : 0.2 + 0.16 * random(`scrub-b-${i}-${j}`));
        const sy = s * (0.8 + 0.4 * random(`scrub-h-${i}-${j}`));
        mtx.compose(
          new THREE.Vector3(x + Math.cos(ang) * rr, L.sandY + sy * 0.75, z + Math.sin(ang) * rr),
          new THREE.Quaternion().setFromEuler(new THREE.Euler(0, ang, 0)),
          new THREE.Vector3(s, sy, s),
        );
        if (dark) b.setMatrixAt(nb++, mtx);
        else a.setMatrixAt(na++, mtx);
      }
    }
    a.count = na;
    b.count = nb;
    a.castShadow = b.castShadow = true;
    a.receiveShadow = b.receiveShadow = true;
    a.instanceMatrix.needsUpdate = b.instanceMatrix.needsUpdate = true;
    return {a, b};
  }, [scrub, mats.scrub, mats.scrubDark, house?.x, house?.z, X0, X1]);

  const geos = useMemo(
    () => ({
      // asphalt: the far lane and the near lane behind the strip; the near lane either side of the strip; the filler
      a1: flatGeo(X0, X1, L.farEdge, L.stripBack, 0),
      a2: flatGeo(X0, sx0, L.stripBack, cutZ, 0),
      a3: flatGeo(sx1, X1, L.stripBack, cutZ, 0),
      a4: flatGeo(sx0, sx1, L.stripBack, cutZ, 0),
      gravel: flatGeo(X0, X1, L.gravelEdge, L.farEdge, -0.006),
      sand: flatGeo(X0, X1, L.back, L.gravelEdge, L.sandY),
    }),
    [X0, X1, sx0, sx1, cutZ],
  );
  const hx = house?.x ?? 0;
  const hz = house?.z ?? 0;
  const drive = useMemo(() => flatGeo(hx - 1.5 - 1.4, hx - 1.5 + 1.4, hz + HOUSE_SPOT.depth / 2, L.gravelEdge, L.sandY + 0.004), [hx, hz]);

  const C = mats.cut;
  const E = mats.earth;
  const A = mats.asphalt;
  const roadMats: Six = [C, E, A, E, C, E];
  const sandMats: Six = [C, E, mats.sand, E, C, E];
  const top = -0.004;

  // ink: the cut face's top edge (around the strip), its bottom, the pavement layers; the right end
  const inkW = INK * ink;
  const front: V3[][] = [
    [
      [X0, 0, cutZ + 0.002],
      [resting ? sx0 : X1, 0, cutZ + 0.002],
    ],
    ...(resting
      ? [
          [
            [sx1, 0, cutZ + 0.002],
            [X1, 0, cutZ + 0.002],
          ] as V3[],
        ]
      : []),
    [
      [X0, B, cutZ + 0.002],
      [X1, B, cutZ + 0.002],
      [X1, 0, cutZ + 0.002],
    ],
    // asphalt (0.12) over aggregate base (to 0.4)
    [
      [X0, -0.12, cutZ + 0.002],
      [X1, -0.12, cutZ + 0.002],
    ],
    [
      [X0, -0.4, cutZ + 0.002],
      [X1, -0.4, cutZ + 0.002],
    ],
  ];
  const side: V3[][] = [
    [
      [X1 + 0.002, 0, cutZ],
      [X1 + 0.002, 0, L.farEdge],
      [X1 + 0.002, -0.006, L.gravelEdge],
      [X1 + 0.002, L.sandY, L.gravelEdge - 0.3],
      [X1 + 0.002, L.sandY, L.back],
    ],
    [
      [X1 + 0.002, -0.12, cutZ],
      [X1 + 0.002, -0.12, L.farEdge - 0.1],
    ],
    [
      [X1 + 0.002, -0.4, cutZ],
      [X1 + 0.002, -0.4, L.gravelEdge - 0.3],
    ],
    [
      [X1 + 0.002, B, cutZ],
      [X1 + 0.002, B, L.back],
    ],
  ];

  const lamp = MOODS.night.lamp!;
  const win = houseWindowAt(hx, hz);

  return (
    <group>
      {/* the ground: road blocks either side of the strip and behind it, the recess (or the plain fill), the sand */}
      <Block min={[X0, B, L.gravelEdge]} max={[sx0, top, cutZ]} mats={roadMats} />
      <Block min={[sx1, B, L.gravelEdge]} max={[X1, top, cutZ]} mats={roadMats} />
      <Block min={[sx0, B, L.gravelEdge]} max={[sx1, top, L.stripBack]} mats={roadMats} />
      <Block min={[sx0, B, L.stripBack]} max={[sx1, -T, cutZ]} mats={roadMats} visible={resting} />
      <Block min={[sx0, B, L.stripBack]} max={[sx1, top, cutZ]} mats={roadMats} visible={!resting} />
      <Block min={[X0, B, L.back]} max={[X1, L.sandY - 0.004, L.gravelEdge]} mats={sandMats} />

      <mesh geometry={geos.a1} material={A} receiveShadow />
      <mesh geometry={geos.a2} material={A} receiveShadow />
      <mesh geometry={geos.a3} material={A} receiveShadow />
      <mesh geometry={geos.a4} material={A} receiveShadow visible={!resting} />
      <mesh geometry={geos.gravel} material={mats.gravel} receiveShadow />
      <mesh geometry={geos.sand} material={mats.sand} receiveShadow />

      {/* paint: the double yellow centre line, the far white edge line */}
      {[-0.13, 0.13].map((z) => (
        <mesh key={z} material={mats.yellow} position={[(X0 + X1) / 2, 0.002, z]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[X1 - X0, 0.1]} />
        </mesh>
      ))}
      <mesh material={mats.white} position={[(X0 + X1) / 2, 0.002, L.farEdge + 0.2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[X1 - X0, 0.15]} />
      </mesh>

      {/* the grooved strip (lifts and slides out when "moved", or fades) */}
      <group position={[strip.slide, strip.lift + (fading ? 0.003 : 0), 0]} visible={strip.opacity > 0.003}>
        <mesh geometry={stripGeo.g} material={[mats.stripCut, mats.stripTop]} receiveShadow castShadow={!resting} />
        <primitive object={inst.dark} />
        <primitive object={inst.glow} userData={{glow: anyLit}} visible={anyLit} />
        <primitive object={inst.glowFace} userData={{glow: anyLit}} visible={anyLit} />
        <PlaneInk points={resting ? stripGeo.profile.slice(1, -1) : stripGeo.profile} closed={!resting} width={inkW} opacity={strip.opacity} />
        {!resting ? (
          <PlaneInk
            plane="zy"
            points={[
              [sx1 + 0.002, -T, cutZ],
              [sx1 + 0.002, 0, cutZ],
              [sx1 + 0.002, 0, L.stripBack],
              [sx1 + 0.002, -T, L.stripBack],
            ]}
            closed
            width={inkW}
            opacity={strip.opacity}
          />
        ) : null}
      </group>

      {front.map((p, i) => (
        <PlaneInk key={`f${i}`} points={p} width={inkW} />
      ))}
      {side.map((p, i) => (
        <PlaneInk key={`s${i}`} points={p} width={inkW} plane="zy" />
      ))}

      <primitive object={scrubMeshes.a} />
      <primitive object={scrubMeshes.b} />

      {house ? (
        <>
          <mesh geometry={drive} material={mats.verge} receiveShadow />
          {/* the street slice's house, turned to face the road (+z), on the sand */}
          <group position={[hx, 0, hz]} rotation={[0, -Math.PI / 2, 0]}>
            <House
              x0={-HOUSE_SPOT.depth / 2}
              x1={HOUSE_SPOT.depth / 2}
              z0={HOUSE_SPOT.width / 2}
              z1={-HOUSE_SPOT.width / 2}
              siding={mats.siding}
              roof={mats.roof}
              trim={mats.trim}
              win={mats.win}
              windows={[mats.win, mats.bedroom]}
              faceX={1}
              ground={L.sandY}
            />
          </group>
          {/* the lamp's spill through the window onto the sand (always mounted: 0 when dark) */}
          <pointLight
            position={[win[0], 0.5, win[2] + 2.4]}
            color={raw(lamp.light)}
            intensity={0.7 * windowLit}
            distance={4.5}
            decay={1}
          />
        </>
      ) : null}

    </group>
  );
};
