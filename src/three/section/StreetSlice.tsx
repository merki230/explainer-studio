import React, {useMemo} from 'react';
import * as THREE from 'three';
import {MOODS, REAL, section, STREET, type Mood} from '../../theme';
import {fonts} from '../../fonts';
import {BlobShadow} from '../MuseumStage';
import {raw} from '../plaster';
import {ANTENNA, LidAntenna, METER, RADIO, RadioModule, WaterMeter} from '../real/WaterMeter';
import {applyAlbedo, applyEnv, useAlbedo, useEnvStrength, useStudioEnv} from '../real/useStudioEnv';
import {CutOutline, cutMaterial, InkLine, type Rect} from './cutLook';
import {Figure, type FigureProps} from './Figure';
import {useFontsLoaded} from './useFontsLoaded';

type V3 = [number, number, number];

/*
 * S, the street slice (No. 004): a residential street cut square to the road through YOUR meter box, in
 * metres. The cut face is the plane z = 0 (facing the camera, +z); the street runs back along −z. On the
 * cut face, left to right (x): YOUR kitchen edge (floor slab, front wall with the window, counter, sink,
 * YOU), the front yard, the sidewalk, the park strip with the meter box cut open (the lid cut, its
 * antenna cap just behind the cut, the radio module and the meter in the pit), the curb, two lanes of
 * road with the water main cut round under it, the far curb and sidewalk. The service pipe (black poly)
 * runs on the cut face from the main, under the curb, to the meter and on under the yard to the house.
 * Behind: neighbours' houses, a lid with a cap at each curb, the utility pole with the receiver on our
 * park strip, a pedestal water tank (seen in the wide shot only). The truck and the bursts belong to the scene.
 */

/** Strips across the cut face: [x0, x1, top y, surface]. */
const STRIPS = {
  houseX: [-7.4, -4.6] as const,
  yard: [-4.6, -1.7] as const,
  walk: [-1.7, -0.3] as const,
  strip: [-0.3, 1.15] as const,
  curb: [1.15, 1.3] as const,
  road: [1.3, 8.3] as const,
  farCurb: [8.3, 8.45] as const,
  farStrip: [8.45, 9.7] as const,
  farWalk: [9.7, 11.1] as const,
  farYard: [11.1, 20] as const,
};
const GRADE = 0.15;
const FLOOR = 0.55;
const BOTTOM = -4.0;
const BASE = -0.5;
const DEPTH = 190;
const HOUSE_Z = 9;
/** Pipes on the cut face sit mostly in it (a third of the bore proud), like a line on a section drawing. */
const FACE_Z = 0;

/** The meter box: outer x and z (front half: the cut runs through its middle), walls, floor and lid. */
const BOX = {x0: 0.21, x1: 0.69, z0: -0.32, wall: 0.035, lidT: 0.035};
const BX = (BOX.x0 + BOX.x1) / 2;

export const STREET_LAYOUT = {
  /** The lid's top centre of YOUR cap (the burst source) and its z just behind the cut. */
  cap: [BX, GRADE + ANTENNA.capH, -0.09] as V3,
  /** The radio module (top middle), the meter (body axis). */
  radio: [BX - 0.07, 0.05, -0.17] as V3,
  meter: [BX, -0.25, -0.13] as V3,
  /** Road edges (x) and where a truck drives (x): the near lane (against our curb, driving toward the camera), the far lane. */
  road: STRIPS.road,
  lanes: {near: 2.6, far: 6.55},
  /** The water main (cut round): centre x, y and radius. */
  main: {x: 4.0, y: -1.1, r: 0.1},
  /** Neighbours' lid caps up the street (top centres). */
  lids: [1, 2, 3, 4, 5, 6, 7].map((k) => [BX, GRADE + 0.012, -15 * k] as V3),
  /** The utility pole on our park strip (clear of the truck's lane and of the tank in the wide shot), its receiver box (street side); the tank's rim antennas. */
  pole: [0.95, GRADE, -12] as V3,
  poleReceiver: [1.22, 6.6, -12] as V3,
  /** A pedestal tank in a gap between our side's houses: the fixed 16° angle sees no skyline (§ 8). */
  tank: [-6.2, GRADE, -39] as V3,
  tankReceiver: [-6.2, 14.6, -39] as V3,
  /** YOU at the sink (figure origin, facing +x); the faucet's lever handle and spout tip; the sink. */
  you: [-5.66, FLOOR, -0.62] as V3,
  tapHandle: [-5.0, FLOOR + 1.02, -0.49] as V3,
  spout: [-5.15, FLOOR + 1.19, -0.62] as V3,
  sink: [-5.2, FLOOR + 0.9, -0.62] as V3,
  ground: {grade: GRADE, floor: FLOOR, depth: DEPTH},
};

const L = STREET_LAYOUT;

/** Asphalt with a dashed muted-yellow centre line and white edge lines; u across x (the road), v along z (9 m). */
const roadTexture = () => {
  const W = 256;
  const H = 64;
  const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [a, c, e] = [hex(STREET.asphalt), hex(STREET.centreLine), hex(STREET.edgeLine)];
  const data = new Uint8Array(W * H * 4);
  const width = STRIPS.road[1] - STRIPS.road[0];
  for (let j = 0; j < H; j++) {
    for (let i = 0; i < W; i++) {
      const x = ((i + 0.5) / W) * width;
      const v = (j + 0.5) / H;
      const centre = Math.abs(x - width / 2) < 0.06 && v < 0.33;
      const edge = Math.abs(x - 0.3) < 0.05 || Math.abs(x - (width - 0.3)) < 0.05;
      const g = ((i * 73 + j * 151) % 17) - 8;
      const col = centre ? c : edge ? e : a.map((q) => q + g * 0.9);
      const o = (j * W + i) * 4;
      data[o] = col[0];
      data[o + 1] = col[1];
      data[o + 2] = col[2];
      data[o + 3] = 255;
    }
  }
  const t = new THREE.DataTexture(data, W, H, THREE.RGBAFormat);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = THREE.ClampToEdgeWrapping;
  t.wrapT = THREE.RepeatWrapping;
  t.magFilter = THREE.LinearFilter;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.generateMipmaps = true;
  t.needsUpdate = true;
  return t;
};

/** A fixed (index-hashed, no randomness) mottled texture for lawn and concrete. */
export const mottle = (base: string, amount: number) => {
  const W = 128;
  const data = new Uint8Array(W * W * 4);
  const b = [1, 3, 5].map((i) => parseInt(base.slice(i, i + 2), 16));
  for (let j = 0; j < W; j++)
    for (let i = 0; i < W; i++) {
      const h = (Math.sin(i * 12.9898 + j * 78.233) * 43758.5453) % 1;
      const n = (Math.abs(h) - 0.5) * amount + Math.sin(i * 0.31) * Math.cos(j * 0.27) * amount * 0.4;
      const o = (j * W + i) * 4;
      data[o] = Math.max(0, Math.min(255, b[0] + n));
      data[o + 1] = Math.max(0, Math.min(255, b[1] + n));
      data[o + 2] = Math.max(0, Math.min(255, b[2] + n));
      data[o + 3] = 255;
    }
  const t = new THREE.DataTexture(data, W, W, THREE.RGBAFormat);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.magFilter = THREE.LinearFilter;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.generateMipmaps = true;
  t.needsUpdate = true;
  return t;
};

/** Six-face material list for a box: [+x, −x, +y, −y, +z (the cut face), −z]. */
type Six = [THREE.Material, THREE.Material, THREE.Material, THREE.Material, THREE.Material, THREE.Material];

/** A box between two corners, with a material per face. */
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

/**
 * A neighbour's house: a box with a gable roof (ridge along x, the house's front facing +x). Also used
 * by the musical road (No. 005), which stands it on its own ground (`ground`) and lights one window
 * (`windows`: a material per window, the one nearer the door first; default `win` for both).
 */
export const House: React.FC<{
  x0: number;
  x1: number;
  z0: number;
  z1: number;
  siding: THREE.Material;
  roof: THREE.Material;
  trim: THREE.Material;
  win: THREE.Material;
  faceX: 1 | -1;
  ground?: number;
  windows?: THREE.Material[];
}> = ({x0, x1, z0, z1, siding, roof, trim, win, faceX, ground, windows}) => {
  const g0 = ground ?? GRADE;
  const h = 2.9;
  const w = z0 - z1;
  const roofGeo = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-w / 2 - 0.35, 0);
    s.lineTo(0, 2.0);
    s.lineTo(w / 2 + 0.35, 0);
    s.closePath();
    const g = new THREE.ExtrudeGeometry(s, {depth: x1 - x0 + 0.5, bevelEnabled: false});
    g.translate(0, 0, -(x1 - x0 + 0.5) / 2);
    g.rotateY(Math.PI / 2);
    return g;
  }, [w, x0, x1]);
  const fx = faceX > 0 ? x1 + 0.005 : x0 - 0.005;
  return (
    <group>
      <Block min={[x0, g0, z1]} max={[x1, g0 + 0.3 + h, z0]} mats={siding} />
      <mesh
        geometry={roofGeo}
        material={roof}
        position={[(x0 + x1) / 2, g0 + 0.3 + h, (z0 + z1) / 2]}
        castShadow
        receiveShadow
      />
      {/* front door and two windows on the street face */}
      <mesh
        material={trim}
        position={[fx, g0 + 1.35, (z0 + z1) / 2 + 1.5]}
        rotation={[0, faceX > 0 ? Math.PI / 2 : -Math.PI / 2, 0]}
      >
        <planeGeometry args={[1.0, 2.1]} />
      </mesh>
      {[-1.2, -3.2].map((dz, i) => (
        <mesh
          key={dz}
          material={windows?.[i] ?? win}
          position={[fx, g0 + 1.9, (z0 + z1) / 2 + dz + 1.5]}
          rotation={[0, faceX > 0 ? Math.PI / 2 : -Math.PI / 2, 0]}
        >
          <planeGeometry args={[1.3, 1.2]} />
        </mesh>
      ))}
    </group>
  );
};

export type StreetSliceProps = {
  mood: Mood;
  /** The meter's sweep hand and leak triangle (turns). */
  sweep?: number;
  leak?: number;
  /** The radio module's node dot (0 idle → 1 sending, orange). */
  radioDot?: number;
  /** Show YOU at the sink (default true). */
  you?: boolean;
  /** YOU's figure state from the scene (hands, phone, gestures, screen); default hands on the counter edge. */
  youFigure?: Partial<FigureProps>;
  /** The faucet: the lever's lift (0 shut → 1 open) and the stream (0 → 1, it tapers in and out). */
  faucet?: {handle: number; stream: number};
  /** The radio's object cut-away, 0 (closed) → 1 (open). */
  radioOpen?: number;
  clockOffset?: number;
};

/** YOU's hands resting on the counter's front edge (figure-local: +z forward, +x YOU's left). */
export const YOU_REST_HANDS: [V3, V3] = [
  [-0.17, 0.93, 0.24],
  [0.17, 0.93, 0.24],
];

/** The street slice (see the file comment). */
export const StreetSlice: React.FC<StreetSliceProps> = ({
  mood,
  sweep = 0,
  leak = 0,
  radioDot = 0,
  you = true,
  youFigure = {},
  faucet = {handle: 0, stream: 0},
  radioOpen = 0,
  clockOffset = 0,
}) => {
  const m = MOODS[mood];
  const env = useStudioEnv();
  const envScale = useEnvStrength();
  const albedo = useAlbedo();
  const ready = useFontsLoaded();
  const mats = useMemo(() => {
    const std = (c: string, o: THREE.MeshStandardMaterialParameters = {}) =>
      new THREE.MeshStandardMaterial({color: raw(c), roughness: 0.92, ...o});
    const phys = (c: string, o: THREE.MeshPhysicalMaterialParameters = {}) =>
      new THREE.MeshPhysicalMaterial({color: raw(c), ...o});
    const road = new THREE.MeshStandardMaterial({color: raw('#ffffff'), roughness: 0.9, map: roadTexture()});
    road.map!.repeat.set(1, DEPTH / 9);
    const grass = new THREE.MeshStandardMaterial({color: raw('#ffffff'), roughness: 1, map: mottle(STREET.grass, 26)});
    grass.map!.repeat.set(4, DEPTH / 2);
    const concrete = new THREE.MeshStandardMaterial({
      color: raw('#ffffff'),
      roughness: 0.88,
      map: mottle(STREET.concrete, 10),
    });
    concrete.map!.repeat.set(2, DEPTH / 1.5);
    return {
      cut: cutMaterial(),
      earth: std(m.earth, {roughness: 1}),
      road,
      grass,
      concrete,
      floor: std(m.floor, {roughness: 0.7}),
      wall: std(m.wall),
      siding: STREET.sidings.map((c) => std(c, {roughness: 0.85})),
      roof: std(STREET.roof, {roughness: 0.9}),
      trim: std(m.trim, {roughness: 0.6}),
      win: phys(REAL.carGlass, {roughness: 0.08, metalness: 0.2, clearcoat: 1}),
      glass: phys(REAL.carGlass, {roughness: 0.04, clearcoat: 1, transparent: true, opacity: 0.25, depthWrite: false}),
      counter: phys(STREET.counter, {roughness: 0.35, clearcoat: 0.4}),
      cabinet: std(STREET.cabinet, {roughness: 0.7}),
      steel: phys(REAL.steel, {metalness: 1, roughness: 0.3}),
      sinkBowl: phys(REAL.steel, {metalness: 0.9, roughness: 0.45, color: raw(REAL.inductor)}),
      stream: phys(STREET.stream, {
        roughness: 0.05,
        transmission: 0,
        transparent: true,
        opacity: 0.55,
        depthWrite: false,
      }),
      boxMat: phys(STREET.box, {roughness: 0.8}),
      lid: phys(STREET.lid, {roughness: 0.75}),
      lidTop: new THREE.MeshPhysicalMaterial({color: raw('#ffffff'), roughness: 0.78}),
      cap: phys(STREET.cap, {roughness: 0.5, clearcoat: 0.3}),
      gravel: new THREE.MeshStandardMaterial({color: raw('#ffffff'), roughness: 1, map: mottle(STREET.gravel, 70)}),
      poly: phys(STREET.poly, {roughness: 0.45}),
      cable: phys(STREET.cable, {roughness: 0.5}),
      main: phys(STREET.main, {roughness: 0.7, metalness: 0.3}),
      water: std(STREET.water, {roughness: 0.3}),
      pole: std(STREET.pole, {roughness: 0.95}),
      grey: phys(STREET.receiverBox, {roughness: 0.5}),
      tank: phys(STREET.tank, {roughness: 0.7, metalness: 0.1}),
      trunk: std(REAL.soil, {roughness: 1}),
      leaf: std(section.leaf, {roughness: 0.95, flatShading: true}),
      leafDark: std(section.leafDark, {roughness: 0.95, flatShading: true}),
    };
  }, [m.earth, m.floor, m.wall, m.trim]);
  (mats.gravel.map as THREE.Texture).repeat.set(3, 3);
  applyEnv(
    env,
    [
      [mats.steel, 1],
      [mats.win, 1.2],
      [mats.tank, 0.4],
      [mats.counter, 0.6],
    ],
    envScale,
  );
  applyAlbedo([mats.lid, mats.boxMat, mats.poly, mats.cable, mats.main, mats.counter], albedo);

  // the lid's top: composite with an embossed "WATER METER" and two pick holes (canvas)
  const lidTex = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 340;
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return {c, t, drawn: false};
  }, []);
  if (ready && !lidTex.drawn) {
    const cx = lidTex.c.getContext('2d')!;
    cx.fillStyle = STREET.lid;
    cx.fillRect(0, 0, 512, 340);
    // a moulded grip pattern (fixed diamonds)
    cx.fillStyle = STREET.lidEmboss;
    for (let j = 0; j < 12; j++)
      for (let i = 0; i < 18; i++) {
        if ((i + j) % 2) continue;
        cx.fillRect(14 + i * 27, 12 + j * 27, 7, 7);
      }
    cx.fillStyle = STREET.lid;
    cx.fillRect(70, 50, 372, 70);
    cx.fillStyle = STREET.lidEmboss;
    cx.font = `800 54px ${fonts.sans}, Arial`;
    cx.textAlign = 'center';
    cx.textBaseline = 'middle';
    cx.fillText('WATER METER', 256, 86);
    cx.fillStyle = STREET.cap;
    cx.fillRect(28, 150, 16, 46);
    cx.fillRect(468, 150, 16, 46);
    lidTex.t.needsUpdate = true;
    lidTex.drawn = true;
    mats.lidTop.map = lidTex.t;
    mats.lidTop.needsUpdate = true;
  }

  const C = mats.cut;
  const E = mats.earth;
  /** A ground strip: surface material on top, the cut face in front, earth elsewhere. */
  const strip = (x0: number, x1: number, top: number, surf: THREE.Material, z0 = 0, z1 = -DEPTH, key?: string) => (
    <Block
      key={key ?? `${x0}${z0}`}
      min={[x0, BASE, z1]}
      max={[x1, top, z0]}
      mats={[x1 >= 20 ? C : E, E, surf, E, z0 === 0 ? C : E, E]}
      shadow={false}
    />
  );

  const pipe = useMemo(() => {
    const tube = (pts: V3[], r: number) => {
      const path = new THREE.CurvePath<THREE.Vector3>();
      for (let i = 0; i < pts.length - 1; i++)
        path.add(new THREE.LineCurve3(new THREE.Vector3(...pts[i]), new THREE.Vector3(...pts[i + 1])));
      return new THREE.TubeGeometry(path, pts.length * 8, r, 12, false);
    };
    const smooth = (pts: V3[], r: number) =>
      new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p))), 40, r, 10, false);
    const my = L.meter[1];
    const mz = L.meter[2];
    const r = 0.016;
    return {
      // on the cut face (z = 0, half proud): main → under the curb → the box's right wall; the box's left wall → under the yard → the house
      faceRight: tube(
        [
          [L.main.x, L.main.y + L.main.r, FACE_Z],
          [L.main.x, -0.75, FACE_Z],
          [0.92, -0.75, FACE_Z],
          [BOX.x1, my, FACE_Z],
        ],
        r,
      ),
      faceLeft: tube(
        [
          [BOX.x0, my, FACE_Z],
          [-0.05, -0.75, FACE_Z],
          [-4.7, -0.75, FACE_Z],
          [-4.7, FLOOR, FACE_Z],
        ],
        r,
      ),
      // in the pit (behind the cut): through the walls to the meter's tailpieces
      pitRight: tube(
        [
          [BOX.x1 + 0.01, my, mz],
          [BX + METER.length / 2, my, mz],
        ],
        r,
      ),
      pitLeft: tube(
        [
          [BX - METER.length / 2, my, mz],
          [BOX.x0 - 0.01, my, mz],
        ],
        r,
      ),
      // coax: the antenna stem's foot → the radio's top gland; three-wire: the radio's bottom gland → the register
      coax: smooth(
        [
          [L.cap[0], GRADE - ANTENNA.stemL + 0.004, L.cap[2]],
          [L.cap[0] - 0.01, GRADE - ANTENNA.stemL - 0.03, L.cap[2] - 0.03],
          [L.radio[0] + RADIO.coaxIn[0] + 0.02, L.radio[1] + 0.035, L.radio[2]],
          [L.radio[0] + RADIO.coaxIn[0], L.radio[1] + 0.012, L.radio[2]],
        ],
        0.0045,
      ),
      wire: smooth(
        [
          [L.radio[0] + RADIO.wireOut[0], L.radio[1] - RADIO.h - 0.012, L.radio[2]],
          [L.radio[0] + RADIO.wireOut[0] - 0.02, L.radio[1] - RADIO.h - 0.09, L.radio[2] + 0.02],
          [L.meter[0] + METER.wireIn[0] - 0.03, L.meter[1] + METER.wireIn[1] + 0.03, L.meter[2] + METER.wireIn[2]],
          [L.meter[0] + METER.wireIn[0], L.meter[1] + METER.wireIn[1], L.meter[2] + METER.wireIn[2]],
        ],
        0.0035,
      ),
      main: (() => {
        const g = new THREE.CylinderGeometry(L.main.r, L.main.r, DEPTH, 32, 1, true);
        g.rotateX(Math.PI / 2);
        g.translate(L.main.x, L.main.y, -DEPTH / 2);
        return g;
      })(),
      mainWall: new THREE.RingGeometry(L.main.r - 0.014, L.main.r, 40),
      mainWater: new THREE.CircleGeometry(L.main.r - 0.014, 40),
      cutDisc: new THREE.CircleGeometry(r, 16),
    };
  }, []);

  const circle = (cx: number, cy: number, r: number, z = 0.004): V3[] =>
    [...Array(33).keys()].map(
      (i) => [cx + r * Math.cos((i / 32) * Math.PI * 2), cy + r * Math.sin((i / 32) * Math.PI * 2), z] as V3,
    );

  // the ground's front rects (ink outline)
  const S = STRIPS;
  const faceRects: Rect[] = [
    [
      [S.houseX[0], BOTTOM, 0],
      [S.farYard[1], BASE, 0],
    ],
    ...(
      [
        [S.houseX[0], S.houseX[1], FLOOR],
        [S.yard[0], S.yard[1], GRADE],
        [S.walk[0], S.walk[1], GRADE + 0.01],
        [S.strip[0], BOX.x0, GRADE],
        [BOX.x1, S.strip[1], GRADE],
        [S.curb[0], S.curb[1], GRADE],
        [S.road[0], S.road[1], 0],
        [S.farCurb[0], S.farCurb[1], GRADE],
        [S.farStrip[0], S.farStrip[1], GRADE],
        [S.farWalk[0], S.farWalk[1], GRADE + 0.01],
        [S.farYard[0], S.farYard[1], GRADE],
      ] as [number, number, number][]
    ).map(([a, b, top]) => [[a, BASE, 0] as V3, [b, top, 0] as V3] as Rect),
  ];

  const houseSiding = mats.siding[0];
  const wallMats = (front: boolean): Six => [houseSiding, mats.wall, C, mats.wall, front ? C : mats.wall, mats.wall];
  const W0 = -4.8;
  const W1 = -4.6;
  const WIN = {z0: -0.15, z1: -1.25, y0: 1.5, y1: 2.4};
  const ROOF_Y = 3.1;

  return (
    <group>
      {/* the ground: one deep block under everything, the surface strips on it */}
      <Block
        min={[S.houseX[0], BOTTOM, -DEPTH]}
        max={[S.farYard[1], BASE, 0]}
        mats={[C, E, E, E, C, E]}
        shadow={false}
      />
      {strip(S.houseX[0], S.houseX[1], FLOOR, mats.floor, 0, -HOUSE_Z)}
      {strip(S.houseX[0], S.houseX[1], GRADE, mats.grass, -HOUSE_Z, -DEPTH)}
      {strip(S.yard[0], S.yard[1], GRADE, mats.grass)}
      {strip(S.walk[0], S.walk[1], GRADE + 0.01, mats.concrete)}
      {strip(S.strip[0], BOX.x0, GRADE, mats.grass)}
      {strip(BOX.x1, S.strip[1], GRADE, mats.grass)}
      {strip(BOX.x0, BOX.x1, GRADE, mats.grass, BOX.z0, -DEPTH)}
      <Block
        min={[S.curb[0], BASE, -DEPTH]}
        max={[S.curb[1], GRADE, 0]}
        mats={[mats.concrete, E, mats.concrete, E, C, E]}
        shadow={false}
      />
      {strip(S.road[0], S.road[1], 0, mats.road)}
      <Block
        min={[S.farCurb[0], BASE, -DEPTH]}
        max={[S.farCurb[1], GRADE, 0]}
        mats={[E, mats.concrete, mats.concrete, E, C, E]}
        shadow={false}
      />
      {strip(S.farStrip[0], S.farStrip[1], GRADE, mats.grass)}
      {strip(S.farWalk[0], S.farWalk[1], GRADE + 0.01, mats.concrete)}
      {strip(S.farYard[0], S.farYard[1], GRADE, mats.grass)}
      <CutOutline rects={faceRects} />
      {/* section layers on the cut face: the road's asphalt and base, the sidewalk slab, the curb */}
      <InkLine
        closed={false}
        points={[
          [S.road[0], -0.1, 0.002],
          [S.road[1], -0.1, 0.002],
        ]}
      />
      <InkLine
        closed={false}
        points={[
          [S.road[0], -0.32, 0.002],
          [S.road[1], -0.32, 0.002],
        ]}
      />
      <InkLine
        closed={false}
        points={[
          [S.walk[0], GRADE - 0.09, 0.002],
          [S.walk[1], GRADE - 0.09, 0.002],
        ]}
      />
      <InkLine
        closed={false}
        points={[
          [S.curb[0] - 0.12, -0.32, 0.002],
          [S.curb[1], -0.32, 0.002],
        ]}
      />

      {/* the water main, cut round */}
      <mesh geometry={pipe.main} material={mats.main} />
      <mesh geometry={pipe.mainWall} material={C} position={[L.main.x, L.main.y, 0.003]} />
      <mesh geometry={pipe.mainWater} material={mats.water} position={[L.main.x, L.main.y, 0.003]} />
      <InkLine points={circle(L.main.x, L.main.y, L.main.r)} />
      <InkLine points={circle(L.main.x, L.main.y, L.main.r - 0.014)} />
      {/* the service pipe on the cut face and in the pit */}
      {/* on the cut face the pipe is drawn as its section: a flat dark band (the bore) on the face */}
      <group position={[0, 0, 0.003]} scale={[1, 1, 0.12]}>
        <mesh geometry={pipe.faceRight} material={mats.poly} />
        <mesh geometry={pipe.faceLeft} material={mats.poly} />
      </group>
      <mesh geometry={pipe.pitRight} material={mats.poly} castShadow />
      <mesh geometry={pipe.pitLeft} material={mats.poly} castShadow />

      {/* the meter box, cut through its middle: side and back walls, gravel bed, lid (cut), the antenna */}
      <Block
        min={[BOX.x0, BASE, BOX.z0]}
        max={[BOX.x0 + BOX.wall, GRADE - BOX.lidT, 0]}
        mats={[mats.boxMat, mats.boxMat, C, mats.boxMat, C, mats.boxMat]}
      />
      <Block
        min={[BOX.x1 - BOX.wall, BASE, BOX.z0]}
        max={[BOX.x1, GRADE - BOX.lidT, 0]}
        mats={[mats.boxMat, mats.boxMat, C, mats.boxMat, C, mats.boxMat]}
      />
      <Block min={[BOX.x0, BASE, BOX.z0]} max={[BOX.x1, GRADE - BOX.lidT, BOX.z0 + BOX.wall]} mats={mats.boxMat} />
      <Block
        min={[BOX.x0 + BOX.wall, BASE, BOX.z0 + BOX.wall]}
        max={[BOX.x1 - BOX.wall, BASE + 0.07, 0]}
        mats={[mats.gravel, mats.gravel, mats.gravel, mats.gravel, C, mats.gravel]}
        shadow={false}
      />
      <Block
        min={[BOX.x0 + 0.004, GRADE - BOX.lidT, BOX.z0 + 0.004]}
        max={[BOX.x1 - 0.004, GRADE, 0]}
        mats={[mats.lid, mats.lid, mats.lidTop, mats.lid, C, mats.lid]}
      />
      <CutOutline
        rects={[
          [
            [BOX.x0, BASE, 0.001],
            [BOX.x0 + BOX.wall, GRADE - BOX.lidT, 0.001],
          ],
          [
            [BOX.x1 - BOX.wall, BASE, 0.001],
            [BOX.x1, GRADE - BOX.lidT, 0.001],
          ],
          [
            [BOX.x0 + 0.004, GRADE - BOX.lidT, 0.001],
            [BOX.x1 - 0.004, GRADE, 0.001],
          ],
          [
            [BOX.x0 + BOX.wall, BASE, 0.001],
            [BOX.x1 - BOX.wall, BASE + 0.07, 0.001],
          ],
        ]}
      />
      <LidAntenna position={[L.cap[0], GRADE, L.cap[2]]} />
      <mesh geometry={pipe.coax} material={mats.cable} />
      <mesh geometry={pipe.wire} material={mats.cable} />
      <RadioModule position={L.radio} dot={radioDot} open={radioOpen} />
      <WaterMeter position={L.meter} sweep={sweep} leak={leak} />

      {/* neighbours' lids at their curbs, each with a cap */}
      {L.lids.map((p, i) => (
        <group key={i}>
          <mesh material={mats.lid} position={[p[0], GRADE + 0.004, p[2]]} receiveShadow>
            <boxGeometry args={[0.47, 0.01, 0.62]} />
          </mesh>
          <mesh material={mats.cap} position={[p[0], GRADE + 0.012, p[2]]} castShadow>
            <cylinderGeometry args={[ANTENNA.capR, ANTENNA.capR, ANTENNA.capH, 32]} />
          </mesh>
        </group>
      ))}

      {/* YOUR house: the kitchen edge, cut open (floor slab, front wall with the window, ceiling, gable) */}
      <Block min={[W0, FLOOR, -HOUSE_Z]} max={[W1, WIN.y0, 0]} mats={wallMats(true)} />
      <Block min={[W0, WIN.y1, -HOUSE_Z]} max={[W1, ROOF_Y, 0]} mats={wallMats(true)} />
      <Block min={[W0, WIN.y0, WIN.z0]} max={[W1, WIN.y1, 0]} mats={wallMats(true)} />
      <Block min={[W0, WIN.y0, -HOUSE_Z]} max={[W1, WIN.y1, WIN.z1]} mats={wallMats(false)} />
      <mesh
        material={mats.glass}
        position={[(W0 + W1) / 2, (WIN.y0 + WIN.y1) / 2, (WIN.z0 + WIN.z1) / 2]}
        rotation={[0, Math.PI / 2, 0]}
      >
        <planeGeometry args={[WIN.z0 - WIN.z1, WIN.y1 - WIN.y0]} />
      </mesh>
      <Block
        min={[S.houseX[0], ROOF_Y, -HOUSE_Z]}
        max={[W1 + 0.35, ROOF_Y + 0.2, 0]}
        mats={[mats.trim, mats.wall, mats.roof, mats.wall, C, mats.wall]}
      />
      <Block min={[S.houseX[0], FLOOR, -5.2]} max={[W0, ROOF_Y, -5.0]} mats={mats.wall} />
      <CutOutline
        rects={[
          [
            [W0, FLOOR, 0.001],
            [W1, ROOF_Y, 0.001],
          ],
          [
            [S.houseX[0], ROOF_Y, 0.001],
            [W1 + 0.35, ROOF_Y + 0.2, 0.001],
          ],
        ]}
      />
      {/* counter, sink, faucet (a lever handle on the right of the spout), the stream */}
      <Block
        min={[-5.42, FLOOR, -3.4]}
        max={[W0, FLOOR + 0.86, 0]}
        mats={[mats.cabinet, mats.cabinet, mats.cabinet, mats.cabinet, C, mats.cabinet]}
      />
      <Block
        min={[-5.46, FLOOR + 0.86, -3.4]}
        max={[W0, FLOOR + 0.9, 0]}
        mats={[mats.counter, mats.counter, mats.counter, mats.counter, C, mats.counter]}
      />
      <CutOutline
        rects={[
          [
            [-5.42, FLOOR, 0.001],
            [W0, FLOOR + 0.86, 0.001],
          ],
          [
            [-5.46, FLOOR + 0.86, 0.001],
            [W0, FLOOR + 0.9, 0.001],
          ],
        ]}
      />
      <mesh material={mats.sinkBowl} position={[L.sink[0], FLOOR + 0.902, L.sink[2]]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.4, 0.52]} />
      </mesh>
      <InkLine
        points={[
          [L.sink[0] - 0.2, FLOOR + 0.904, L.sink[2] - 0.26],
          [L.sink[0] + 0.2, FLOOR + 0.904, L.sink[2] - 0.26],
          [L.sink[0] + 0.2, FLOOR + 0.904, L.sink[2] + 0.26],
          [L.sink[0] - 0.2, FLOOR + 0.904, L.sink[2] + 0.26],
        ]}
        color={REAL.screw}
        thickness={0.012}
      />
      <mesh material={mats.steel} position={[-5.0, FLOOR + 1.04, L.sink[2]]} castShadow>
        <cylinderGeometry args={[0.016, 0.022, 0.28, 16]} />
      </mesh>
      <mesh material={mats.steel} position={[-5.075, FLOOR + 1.18, L.sink[2]]} castShadow>
        <torusGeometry args={[0.075, 0.013, 10, 24, Math.PI]} />
      </mesh>
      <mesh material={mats.steel} position={[L.spout[0], L.spout[1] - 0.01, L.spout[2]]}>
        <cylinderGeometry args={[0.015, 0.013, 0.04, 12]} />
      </mesh>
      <group position={L.tapHandle} rotation={[-0.6 * faucet.handle, 0, 0]}>
        <mesh material={mats.steel} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.04, 12]} />
        </mesh>
        <mesh material={mats.steel} position={[0, 0, 0.06]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.008, 0.01, 0.1, 10]} />
        </mesh>
      </group>
      {faucet.stream > 0.01 ? (
        <mesh
          material={mats.stream}
          position={[L.spout[0], (L.spout[1] - 0.03 + FLOOR + 0.9) / 2, L.spout[2]]}
          scale={[faucet.stream, 1, faucet.stream]}
        >
          <cylinderGeometry args={[0.008, 0.011, L.spout[1] - 0.03 - FLOOR - 0.9, 12, 1, true]} />
        </mesh>
      ) : null}
      {you ? (
        <>
          <Figure
            who="you"
            mood={mood}
            position={L.you}
            rotationY={Math.PI / 2}
            stance="stand"
            phone={false}
            hands={YOU_REST_HANDS}
            phoneModel="real"
            clockOffset={clockOffset}
            {...youFigure}
          />
          <BlobShadow position={[L.you[0], FLOOR + 0.003, L.you[2]]} size={[0.8, 0.8]} opacity={0.4} />
        </>
      ) : null}

      {/* neighbours' houses up both sides of the street, a few trees */}
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((k) => (
        <House
          key={`l${k}`}
          x0={-7.4}
          x1={-4.6}
          z0={-HOUSE_Z - 3 - (k - 1) * 15}
          z1={-HOUSE_Z - 12 - (k - 1) * 15}
          siding={mats.siding[k % 4]}
          roof={mats.roof}
          trim={mats.trim}
          win={mats.win}
          faceX={1}
        />
      ))}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((k) => (
        <House
          key={`r${k}`}
          x0={12.6}
          x1={19.6}
          z0={-2 - k * 15}
          z1={-11 - k * 15}
          siding={mats.siding[(k + 2) % 4]}
          roof={mats.roof}
          trim={mats.trim}
          win={mats.win}
          faceX={-1}
        />
      ))}
      {[-6, -21, -38, -52, -67, -83].map((z, i) => {
        const x = i % 2 ? 10.4 : -3.2;
        // a canopy of overlapping leaf clumps (fixed offsets per tree, no randomness), two greens
        const clumps: [number, number, number, number][] = [
          [0, 4.1, 0, 1.35],
          [0.9, 3.7, 0.3, 1.0],
          [-0.85, 3.8, -0.2, 1.05],
          [0.2, 3.6, 0.95, 0.95],
          [-0.3, 3.65, -0.95, 0.95],
          [0.35, 4.8, -0.25, 0.95],
          [-0.5, 4.7, 0.45, 0.85],
        ];
        return (
          <group key={z} position={[x, GRADE, z]} rotation={[0, i * 1.3, 0]}>
            <mesh material={mats.trunk} position={[0, 1.5, 0]} castShadow>
              <cylinderGeometry args={[0.1, 0.17, 3.0, 10]} />
            </mesh>
            {[-1, 1].map((s2) => (
              <mesh
                key={s2}
                material={mats.trunk}
                position={[s2 * 0.35, 3.0, 0.1]}
                rotation={[0, 0, -s2 * 0.55]}
                castShadow
              >
                <cylinderGeometry args={[0.05, 0.08, 1.0, 8]} />
              </mesh>
            ))}
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
      })}

      {/* the utility pole: the receiver (grey box, street side) and its whip antenna */}
      <group position={L.pole}>
        <mesh material={mats.pole} position={[0, 5.25, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.16, 10.5, 14]} />
        </mesh>
        <mesh material={mats.pole} position={[0, 9.9, 0]} castShadow>
          <boxGeometry args={[2.4, 0.12, 0.12]} />
        </mesh>
        <mesh
          material={mats.grey}
          position={[L.poleReceiver[0] - L.pole[0], L.poleReceiver[1] - L.pole[1] - 0.25, 0]}
          castShadow
        >
          <boxGeometry args={[0.2, 0.42, 0.32]} />
        </mesh>
        <mesh material={mats.grey} position={[-0.12, 11.7, 0]}>
          <cylinderGeometry args={[0.012, 0.02, 2.4, 8]} />
        </mesh>
      </group>
      {/* the water tank (pedestal, bowl, rim antennas) */}
      <group position={L.tank}>
        <mesh material={mats.tank} position={[0, 4.5, 0]} castShadow>
          <cylinderGeometry args={[0.8, 1.6, 9, 24]} />
        </mesh>
        <mesh material={mats.tank} position={[0, 10.2, 0]} scale={[1, 0.72, 1]} castShadow>
          <sphereGeometry args={[3.6, 32, 20]} />
        </mesh>
        <mesh material={mats.tank} position={[0, 12.9, 0]}>
          <cylinderGeometry args={[1.2, 2.0, 0.6, 24]} />
        </mesh>
        {[-0.8, 0, 0.8].map((x) => (
          <mesh key={x} material={mats.grey} position={[x, 14.0, 0.5]}>
            <cylinderGeometry args={[0.035, 0.035, 1.6, 8]} />
          </mesh>
        ))}
      </group>
    </group>
  );
};
