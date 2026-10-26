import React, {useMemo} from 'react';
import * as THREE from 'three';
import {fonts} from '../../fonts';
import {random} from 'remotion';
import {CAST, CAST_NEUTRAL, CITY, HIGHWAY, MOODS, RACE, section, type Mood} from '../../theme';
import {raw, roundedBox} from '../plaster';
import {useFontsLoaded} from '../section/useFontsLoaded';

type V3 = [number, number, number];

/*
 * Drag-strip set pieces (No. 007, N5), generic: no logos, no sponsor boards, no track names. Metres; each
 * part's origin is its foot on the road surface (y = 0). Nothing here is the system: none of it is ever
 * orange, and nothing blooms (no `userData.glow`).
 *
 *  - `DragTree`: one lane's half of a drag "tree" on its pole: two small stage bulbs (pre-stage, stage),
 *    three ambers, one green, one red, top to bottom. Lit lenses are flat emissive: the stage bulbs a lamp
 *    white (`HIGHWAY.headlight`), the ambers `section.warning` (a lamp the driver is meant to see, § 1),
 *    the green `section.signalGreen`. The red is never lit (the foul light: no fouls in our stories).
 *    Lens states come from `lights` keys (hard switches, like a real tree).
 *  - `DistanceBoard`: a black board (`RACE.boardBlack`) with white set lettering (`RACE.boardWhite`, Inter 700) on two posts, e.g. `60 FT`,
 *    `330 FT`, `1/8`, `1000 FT` (`DRAG_BOARDS` has the four with their distances).
 *  - `StartLine`: the white line across the lane, flat on the road.
 *  - `TimingPost`: a stage-beam post by the line (No. 007 realism pass): a short steel post on a base plate
 *    with two small beam boxes (pre-stage, stage), a dark lens on each facing across the lane.
 * The realism pass also details the tree: a back plate behind the housing, side rails, a top cap and bolts,
 * a deeper lens (a dark rim inside each bezel), a junction box on the pole, a base plate with bolts on a
 * small concrete footing.
 */

/** A drag tree's lens state at one moment: which groups are lit. The red is never lit. */
export type TreeLights = {
  /** The top stage bulb (pre-staged). */
  prestage?: boolean;
  /** The second stage bulb (staged). */
  stage?: boolean;
  /** The ambers: true (all three, a pro tree), false, or how many are lit from the top (a sportsman tree's count-down). */
  amber?: boolean | 0 | 1 | 2 | 3;
  /** The green. */
  green?: boolean;
};

/** A key: from `at` (s) the tree shows this state (each key is a whole state; unset groups are dark). */
export type TreeKey = {at: number} & TreeLights;

/** The tree's state at t from its keys (dark before the first key; keys switch hard, no fade). */
export const treeLightsAt = (keys: TreeKey[] | undefined, t: number): TreeLights => {
  const ks = [...(keys ?? [])].sort((a, b) => a.at - b.at);
  let st: TreeLights = {};
  for (const k of ks) if (t >= k.at) st = k;
  return st;
};

/** The usual start (seconds): both stage bulbs, the three ambers, then at `greenAt` the ambers go out and the green lights. */
export const proTreeKeys = (greenAt: number, ambersAt = -1): TreeKey[] => [
  {at: -10, prestage: true, stage: true},
  {at: ambersAt, prestage: true, stage: true, amber: true},
  {at: greenAt, prestage: true, stage: true, green: true},
];

export type DragTreeProps = {
  mood: Mood;
  /** The pole's foot on the road (y is the ground there). */
  position: V3;
  /** Turn about y (rad). Default π/2: the lenses face +x, toward cars that face −x (the drivers see them). */
  rotationY?: number;
  /** Lens-state keys (see `TreeKey`); default none (all dark). */
  lights?: TreeKey[];
  /** Seconds into the scene, for the keys. Default 0. */
  t?: number;
  /** A fixed state instead of keys. */
  state?: TreeLights;
  /** Overall size (default 1: real proportions, the housing ≈ 1.6 m tall on a 1.1 m pole). 🎭 larger reads better wide. */
  scale?: number;
  /** The pole's height under the housing (m, before `scale`). Default 1.1. */
  pole?: number;
};

/** The lenses top to bottom: kind, radius (m), centre height in the housing (m from its bottom). */
const LENSES: {kind: 'stage' | 'amber' | 'green' | 'red'; r: number; y: number}[] = [
  {kind: 'stage', r: 0.055, y: 1.5},
  {kind: 'stage', r: 0.055, y: 1.36},
  {kind: 'amber', r: 0.09, y: 1.14},
  {kind: 'amber', r: 0.09, y: 0.9},
  {kind: 'amber', r: 0.09, y: 0.66},
  {kind: 'green', r: 0.09, y: 0.42},
  {kind: 'red', r: 0.09, y: 0.18},
];
const TREE = {pole: 1.1, housingH: 1.62, housingW: 0.28, housingD: 0.2};

/** One lane's light column (see the file comment). */
export const DragTree: React.FC<DragTreeProps> = ({
  mood,
  position,
  rotationY = Math.PI / 2,
  lights,
  t = 0,
  state,
  scale = 1,
  pole: poleH = TREE.pole,
}) => {
  const mats = useMemo(() => {
    const lens = (off: string, on: string) =>
      new THREE.MeshStandardMaterial({color: raw(off), roughness: 0.25, emissive: raw(on), emissiveIntensity: 0});
    return {
      housing: new THREE.MeshStandardMaterial({color: raw(CITY.signalHousing), roughness: 0.55}),
      pole: new THREE.MeshStandardMaterial({color: raw(CITY.mast), roughness: 0.5, metalness: 0.3}),
      footing: new THREE.MeshStandardMaterial({color: raw(RACE.concrete), roughness: 0.9}),
      steel: new THREE.MeshStandardMaterial({color: raw(HIGHWAY.galvanized), roughness: 0.45, metalness: 0.6}),
      lensRim: new THREE.MeshStandardMaterial({color: raw(RACE.boardBlack), roughness: 0.6}),
      lenses: LENSES.map((l) =>
        l.kind === 'stage'
          ? lens(CITY.lensYellow, HIGHWAY.headlight)
          : l.kind === 'amber'
            ? lens(CITY.lensYellow, section.warning)
            : l.kind === 'green'
              ? lens(CITY.lensGreen, section.signalGreen)
              : lens(CITY.lensRed, CITY.lensRed),
      ),
    };
  }, []);
  const st = state ?? treeLightsAt(lights, t);
  const amberN = st.amber === true ? 3 : st.amber === false || st.amber === undefined ? 0 : st.amber;
  const e = MOODS[mood].exposure;
  let a = 0;
  LENSES.forEach((l, i) => {
    const on =
      l.kind === 'stage'
        ? i === 0
          ? !!st.prestage
          : !!st.stage
        : l.kind === 'amber'
          ? a++ < amberN
          : l.kind === 'green'
            ? !!st.green
            : false;
    mats.lenses[i].emissiveIntensity = on ? 1.1 / e : 0;
  });
  const {housingH: H, housingW: W, housingD: D} = TREE;
  const pole = Math.max(0.05, poleH);
  return (
    <group position={position} rotation={[0, rotationY, 0]} scale={scale}>
      {/* a small concrete footing, the base plate and its four bolts, the pole, a junction box on it */}
      <mesh
        geometry={roundedBox(0.42, 0.06, 0.42, 0.015, 2)}
        material={mats.footing}
        position={[0, 0.03, 0]}
        receiveShadow
        castShadow
      />
      <mesh material={mats.pole} position={[0, 0.07, 0]}>
        <boxGeometry args={[0.24, 0.02, 0.24]} />
      </mesh>
      {[-1, 1].flatMap((a) =>
        [-1, 1].map((b) => (
          <mesh key={`${a}${b}`} material={mats.steel} position={[a * 0.09, 0.09, b * 0.09]}>
            <cylinderGeometry args={[0.012, 0.012, 0.03, 8]} />
          </mesh>
        )),
      )}
      <mesh material={mats.pole} position={[0, (pole + 0.08) / 2, 0]} castShadow>
        <cylinderGeometry args={[0.045, 0.055, Math.max(0.02, pole - 0.08), 16]} />
      </mesh>
      {pole > 0.3 ? (
        <mesh
          geometry={roundedBox(0.12, 0.16, 0.08, 0.01, 2)}
          material={mats.housing}
          position={[0, Math.min(pole - 0.12, 0.55), -0.06]}
          castShadow
        />
      ) : null}
      <group position={[0, pole, 0]}>
        {/* the back plate (wider than the housing), the housing, its side rails and top cap */}
        <mesh
          geometry={roundedBox(W + 0.08, H + 0.06, 0.02, 0.01, 2)}
          material={mats.pole}
          position={[0, H / 2, -D / 2 - 0.01]}
          castShadow
        />
        <mesh geometry={roundedBox(W, H, D, 0.02)} material={mats.housing} position={[0, H / 2, 0]} castShadow />
        {[-1, 1].map((sx) => (
          <mesh key={sx} material={mats.pole} position={[sx * (W / 2 + 0.008), H / 2, 0]}>
            <boxGeometry args={[0.016, H - 0.04, D * 0.8]} />
          </mesh>
        ))}
        <mesh
          geometry={roundedBox(W + 0.04, 0.035, D + 0.04, 0.012, 2)}
          material={mats.pole}
          position={[0, H + 0.017, 0]}
          castShadow
        />
        {[0.06, H - 0.06].flatMap((y) =>
          [-1, 1].map((sx) => (
            <mesh
              key={`${y}${sx}`}
              material={mats.steel}
              position={[sx * (W / 2 - 0.03), y, D / 2 + 0.003]}
              rotation={[Math.PI / 2, 0, 0]}
            >
              <cylinderGeometry args={[0.008, 0.008, 0.006, 8]} />
            </mesh>
          )),
        )}
        {LENSES.map((l, i) => (
          <group key={i} position={[0, l.y, D / 2 + 0.001]}>
            {/* a dark rim inside the bezel: the lens sits in a shallow cup */}
            <mesh material={mats.lensRim} position={[0, 0, -0.0004]}>
              <ringGeometry args={[l.r * 0.9, l.r, 32]} />
            </mesh>
            <mesh material={mats.lenses[i]} position={[0, 0, 0.0004]}>
              <circleGeometry args={[l.r * 0.9, 32]} />
            </mesh>
            {/* a flat grey bezel (no visor: from the slice's side a visor hid half the lens) */}
            <mesh material={mats.pole}>
              <ringGeometry args={[l.r, l.r + 0.016, 32]} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
};

/** The four distance boards of a quarter-mile strip, with their distance from the start line (m). */
export const DRAG_BOARDS: {text: string; at: number}[] = [
  {text: '60 FT', at: 60 * 0.3048},
  {text: '330 FT', at: 330 * 0.3048},
  {text: '1/8', at: 660 * 0.3048},
  {text: '1000 FT', at: 1000 * 0.3048},
];

export type DistanceBoardProps = {
  /** The legend, one line (e.g. '60 FT', '1/8'). */
  text: string;
  /** The board's foot (its centre line on the ground). */
  position: V3;
  /** Turn about y (rad). Default 0: the face toward +z (the near side, the camera's side of a slice). */
  rotationY?: number;
  /** Panel width and height (m). Default 1.5 × 0.6. */
  size?: [number, number];
  /** The panel's bottom edge above y = 0 (m). Default 1.2. */
  bottom?: number;
};

const BOARD_PPM = 240;

/** A black distance board with white lettering on two posts (see the file comment). */
export const DistanceBoard: React.FC<DistanceBoardProps> = ({
  text,
  position,
  rotationY = 0,
  size = [1.5, 0.6],
  bottom = 1.2,
}) => {
  const ready = useFontsLoaded();
  const [w, h] = size;
  const face = useMemo(() => {
    const c = document.createElement('canvas');
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    const mat = new THREE.MeshStandardMaterial({color: raw('#ffffff'), roughness: 0.6});
    return {c, t, mat, key: ''};
  }, []);
  const key = `${text}|${w}|${h}`;
  if (ready && face.key !== key) {
    const W = Math.round(w * BOARD_PPM);
    const H = Math.round(h * BOARD_PPM);
    face.c.width = W;
    face.c.height = H;
    const cx = face.c.getContext('2d')!;
    cx.fillStyle = RACE.boardBlack;
    cx.fillRect(0, 0, W, H);
    // a thin white border, inset
    const b = Math.round(0.025 * BOARD_PPM);
    cx.strokeStyle = RACE.boardWhite;
    cx.lineWidth = Math.max(2, Math.round(0.012 * BOARD_PPM));
    cx.strokeRect(b, b, W - 2 * b, H - 2 * b);
    // the legend: caps ≈ 58% of the panel's height, squeezed to fit its width
    const CAP = 0.727;
    const px = (0.58 * H) / CAP;
    cx.font = `700 ${px}px ${fonts.sans}, Arial`;
    cx.fillStyle = RACE.boardWhite;
    cx.textAlign = 'center';
    cx.textBaseline = 'alphabetic';
    const tw = cx.measureText(text).width;
    const sq = Math.min(1, (W - 6 * b) / Math.max(1, tw));
    cx.save();
    cx.translate(W / 2, H / 2 + (0.58 * H) / 2);
    cx.scale(sq, 1);
    cx.fillText(text, 0, 0);
    cx.restore();
    face.t.needsUpdate = true;
    face.mat.map = face.t;
    face.mat.needsUpdate = true;
    face.key = key;
  }
  const mats = useMemo(
    () => ({
      steel: new THREE.MeshStandardMaterial({color: raw(HIGHWAY.galvanized), roughness: 0.45, metalness: 0.6}),
      back: new THREE.MeshStandardMaterial({color: raw(RACE.boardBlack), roughness: 0.7}),
    }),
    [],
  );
  const [x, gy, z] = position;
  const top = bottom + h - 0.05;
  return (
    <group position={[x, 0, z]} rotation={[0, rotationY, 0]}>
      {[-w * 0.32, w * 0.32].map((dx, i) => (
        <mesh key={i} material={mats.steel} position={[dx, (gy + top) / 2, -0.045]} castShadow>
          <boxGeometry args={[0.06, top - gy, 0.06]} />
        </mesh>
      ))}
      <mesh material={mats.back} position={[0, bottom + h / 2, -0.008]} castShadow>
        <boxGeometry args={[w, h, 0.014]} />
      </mesh>
      {ready ? (
        <mesh material={face.mat} position={[0, bottom + h / 2, 0.0005]}>
          <planeGeometry args={[w, h]} />
        </mesh>
      ) : null}
    </group>
  );
};

export type StartLineProps = {
  /** Where the line crosses the lane (x, m) and the lane's edges across it (z, m). */
  x: number;
  z0: number;
  z1: number;
  /** The line's width along the lane (m). Default 0.2 (8 in). */
  width?: number;
  /** The road surface's height (m). Default 0. */
  y?: number;
};

/** The white start line across the lane, flat on the road (pavement white, `HIGHWAY.lineWhite`). */
export const StartLine: React.FC<StartLineProps> = ({x, z0, z1, width = 0.2, y = 0}) => {
  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: raw(HIGHWAY.lineWhite),
        roughness: 0.8,
        polygonOffset: true,
        polygonOffsetFactor: -2,
      }),
    [],
  );
  return (
    <mesh material={mat} position={[x, y + 0.002, (z0 + z1) / 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[width, Math.abs(z1 - z0)]} />
    </mesh>
  );
};

export type TimingPostProps = {
  /** The post's foot on the road (y is the ground there). */
  position: V3;
  /** Turn about y (rad). Default 0: the beam boxes' lenses face +z (across the lane toward the cut). */
  rotationY?: number;
};

/**
 * A stage-beam timing post (No. 007 realism pass; generic, no logo): a short steel post on a base plate, two
 * small dark beam boxes on it (pre-stage above, stage below), each with a dark lens facing across the lane.
 * ≈ 0.42 m tall. Never lit (the beams are invisible light).
 */
export const TimingPost: React.FC<TimingPostProps> = ({position, rotationY = 0}) => {
  const mats = useMemo(
    () => ({
      steel: new THREE.MeshStandardMaterial({color: raw(HIGHWAY.galvanized), roughness: 0.45, metalness: 0.6}),
      box: new THREE.MeshStandardMaterial({color: raw(CITY.signalHousing), roughness: 0.55}),
      lens: new THREE.MeshStandardMaterial({color: raw(RACE.boardBlack), roughness: 0.15}),
    }),
    [],
  );
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh material={mats.steel} position={[0, 0.006, 0]}>
        <boxGeometry args={[0.16, 0.012, 0.16]} />
      </mesh>
      <mesh material={mats.steel} position={[0, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.022, 0.022, 0.4, 10]} />
      </mesh>
      {[0.3, 0.17].map((y) => (
        <group key={y} position={[0, y, 0.02]}>
          <mesh geometry={roundedBox(0.1, 0.07, 0.09, 0.012, 2)} material={mats.box} castShadow />
          <mesh material={mats.lens} position={[0, 0, 0.046]}>
            <circleGeometry args={[0.018, 16]} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

// ---------------------------------------------------------------- the realism pass's edges and world (No. 007)

/** A small deterministic value noise in [0, 1] (wraps every `wrap` cells in x, so a texture tiles). */
const hash2 = (x: number, y: number) => {
  let h = (Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
};
export const vnoise = (x: number, y: number, wrap = 1 << 20) => {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const fx = x - xi;
  const fy = y - yi;
  const sx = fx * fx * (3 - 2 * fx);
  const sy = fy * fy * (3 - 2 * fy);
  const w = (i: number) => ((i % wrap) + wrap) % wrap;
  const a = hash2(w(xi), yi);
  const b = hash2(w(xi + 1), yi);
  const c = hash2(w(xi), yi + 1);
  const d = hash2(w(xi + 1), yi + 1);
  return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
};
const hexRgb = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));

/**
 * The guard wall's face (a texture for one segment, u along it, v up): poured concrete with grain and
 * blotches, a few vertical form lines, and tire scuffs (`RACE.rubber`: long low smears, a few darker
 * marks) on its lower half. `seed` varies the scuffs between segments.
 */
export const wallTexture = (seed: number) => {
  const W = 256;
  const H = 64;
  const base = hexRgb(RACE.concrete);
  const rub = hexRgb(RACE.rubber);
  const data = new Uint8Array(W * H * 4);
  // a few scuff smears: centre (u, v), length, height, strength
  const smears = [...Array(5).keys()].map((k) => ({
    u: random(`wall-${seed}-u${k}`),
    v: 0.12 + 0.35 * random(`wall-${seed}-v${k}`),
    len: 0.08 + 0.3 * random(`wall-${seed}-l${k}`),
    h: 0.025 + 0.06 * random(`wall-${seed}-h${k}`),
    k: 0.25 + 0.5 * random(`wall-${seed}-k${k}`),
  }));
  for (let j = 0; j < H; j++) {
    const v = (j + 0.5) / H;
    for (let i = 0; i < W; i++) {
      const u = (i + 0.5) / W;
      const grain = (vnoise(i * 0.9, j * 0.9 + seed * 31) - 0.5) * 14;
      const blotch = (vnoise(i / 24, j / 10 + seed * 7) - 0.5) * 16;
      // the bottom edge a little darker (splash, rubber dust), the top edge lighter (weathered)
      const edge = v < 0.12 ? -10 * (1 - v / 0.12) : v > 0.94 ? 6 : 0;
      let scuff = 0;
      for (const s of smears) {
        const du = (u - s.u) / s.len;
        const dv = (v - s.v) / s.h;
        const d = du * du + dv * dv;
        if (d < 1) scuff = Math.max(scuff, s.k * (1 - d) * (0.6 + 0.4 * vnoise(i * 0.5, j * 2 + seed)));
      }
      const form = i % 64 === 0 ? -6 : 0;
      const o = (j * W + i) * 4;
      for (let c = 0; c < 3; c++) {
        const g = base[c] + grain + blotch + edge + form;
        data[o + c] = Math.max(0, Math.min(255, g + (rub[c] - g) * scuff));
      }
      data[o + 3] = 255;
    }
  }
  const t = new THREE.DataTexture(data, W, H, THREE.RGBAFormat);
  t.magFilter = THREE.LinearFilter;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.generateMipmaps = true;
  t.anisotropy = 8;
  t.needsUpdate = true;
  return t;
};

/** A chain-link mesh's alpha (one diamond cell per texture repeat; mipmapped it fades to a fine grey haze far off). */
const chainLinkAlpha = () => {
  const N = 32;
  const data = new Uint8Array(N * N * 4);
  for (let j = 0; j < N; j++)
    for (let i = 0; i < N; i++) {
      // two diagonal wires through the cell
      const a = Math.abs(((i + j) % N) - N / 2) / (N / 2);
      const b = Math.abs(((i - j + N) % N) - N / 2) / (N / 2);
      const wire = Math.max(1 - Math.min(1, (1 - a) * N * 0.11), 1 - Math.min(1, (1 - b) * N * 0.11));
      const o = (j * N + i) * 4;
      data[o] = data[o + 1] = data[o + 2] = 255;
      data[o + 3] = Math.round(255 * Math.max(0, Math.min(1, wire)));
    }
  const t = new THREE.DataTexture(data, N, N, THREE.RGBAFormat);
  t.wrapS = THREE.RepeatWrapping;
  t.wrapT = THREE.RepeatWrapping;
  t.magFilter = THREE.LinearFilter;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.generateMipmaps = true;
  t.needsUpdate = true;
  return t;
};

export type ChainFenceProps = {
  /** Its span along x (m), the plane it stands in (z), its foot and top (y). */
  x0: number;
  x1: number;
  z: number;
  y0: number;
  y1: number;
  /** Post positions (x) inside the span. */
  posts: number[];
  /** The mesh's scroll along x (m; the strip's position), so the diamonds move with the posts. */
  offset?: number;
};

/** A galvanized chain-link fence (No. 007): the mesh (alpha-mapped, 5 cm diamonds), round posts, a top rail. */
export const ChainFence: React.FC<ChainFenceProps> = ({x0, x1, z, y0, y1, posts, offset = 0}) => {
  const mats = useMemo(() => {
    const alpha = chainLinkAlpha();
    return {
      mesh: new THREE.MeshStandardMaterial({
        color: raw(HIGHWAY.galvanized),
        roughness: 0.5,
        metalness: 0.5,
        alphaMap: alpha,
        transparent: true,
        opacity: 0.55,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
      steel: new THREE.MeshStandardMaterial({color: raw(HIGHWAY.galvanized), roughness: 0.45, metalness: 0.6}),
    };
  }, []);
  const cell = 0.05;
  const w = Math.max(0.01, x1 - x0);
  const h = y1 - y0;
  const map = mats.mesh.alphaMap!;
  map.repeat.set(w / cell, h / cell);
  map.offset.set((x0 - offset) / cell, 0);
  return (
    <group>
      <mesh material={mats.mesh} position={[(x0 + x1) / 2, (y0 + y1) / 2, z]}>
        <planeGeometry args={[w, h]} />
      </mesh>
      {posts.map((x, i) => (
        <mesh key={i} material={mats.steel} position={[x, (y0 + y1 + 0.05) / 2, z - 0.03]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, h + 0.05, 10]} />
        </mesh>
      ))}
      <mesh material={mats.steel} position={[(x0 + x1) / 2, y1, z - 0.03]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.022, 0.022, w, 8]} />
      </mesh>
    </group>
  );
};

/**
 * A strip light pole (No. 007): a tapered galvanized mast on a base, an arm reaching over the track (+z), two
 * flat lamp heads (off by day: a dark lens; never lit, nothing blooms). Origin at its foot.
 */
export const LightPole: React.FC<{position: V3; height?: number; reach?: number}> = ({
  position,
  height = 9,
  reach = 1.4,
}) => {
  const mats = useMemo(
    () => ({
      steel: new THREE.MeshStandardMaterial({color: raw(HIGHWAY.galvanized), roughness: 0.45, metalness: 0.6}),
      head: new THREE.MeshStandardMaterial({color: raw(CITY.signalHousing), roughness: 0.5}),
      lens: new THREE.MeshStandardMaterial({color: raw(RACE.boardBlack), roughness: 0.2}),
    }),
    [],
  );
  return (
    <group position={position}>
      <mesh material={mats.steel} position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.2, 0.24, 0.3, 12]} />
      </mesh>
      <mesh material={mats.steel} position={[0, height / 2, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.13, height, 12]} />
      </mesh>
      <mesh material={mats.steel} position={[0, height - 0.15, reach / 2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.05, reach, 8]} />
      </mesh>
      {[reach * 0.55, reach].map((zz) => (
        <group key={zz} position={[0, height - 0.22, zz]}>
          <mesh geometry={roundedBox(0.7, 0.14, 0.42, 0.04, 2)} material={mats.head} castShadow />
          <mesh material={mats.lens} position={[0, -0.071, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.6, 0.34]} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

/** One seated spectator: where they sit (the bench's top under the pelvis), a clothes and a skin index, a lean (rad). */
export type Spectator = {p: V3; top: number; skin: number; lean: number};

const PERSON_BODY = new THREE.CapsuleGeometry(0.15, 0.28, 4, 10);
const PERSON_HEAD = new THREE.SphereGeometry(0.1, 14, 10);
const PERSON_LEGS = roundedBox(0.3, 0.12, 0.42, 0.05, 2);

/**
 * A stylized crowd (No. 007, style guide § 8: rounded, no faces): each spectator a capsule torso, a ball
 * head and a block for the thighs, sitting on a bench facing +z. Instanced (one draw per part).
 */
export const Crowd: React.FC<{people: Spectator[]; max?: number}> = ({people, max = 400}) => {
  const inst = useMemo(() => {
    const mk = (g: THREE.BufferGeometry) => {
      const m = new THREE.InstancedMesh(
        g,
        new THREE.MeshStandardMaterial({color: raw('#ffffff'), roughness: 0.85}),
        max,
      );
      m.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(max * 3), 3);
      m.castShadow = true;
      m.frustumCulled = false;
      return m;
    };
    return {
      body: mk(PERSON_BODY),
      head: mk(PERSON_HEAD),
      legs: mk(PERSON_LEGS),
      tops: RACE.crowd.map((c) => raw(c)),
      skins: RACE.crowdSkin.map((c) => raw(c)),
      bottoms: [raw(CAST_NEUTRAL.bottom), raw(CAST.extra.bottom)],
    };
  }, [max]);
  const n = Math.min(max, people.length);
  const o = new THREE.Object3D();
  people.slice(0, n).forEach((q, i) => {
    const [x, y, z] = q.p;
    o.rotation.set(-q.lean, 0, 0);
    o.position.set(x, y + 0.29, z - 0.04);
    o.updateMatrix();
    inst.body.setMatrixAt(i, o.matrix);
    inst.body.setColorAt(i, inst.tops[q.top % inst.tops.length]);
    o.position.set(x, y + 0.6, z - 0.04 + 0.6 * Math.sin(q.lean));
    o.updateMatrix();
    inst.head.setMatrixAt(i, o.matrix);
    inst.head.setColorAt(i, inst.skins[q.skin % inst.skins.length]);
    o.rotation.set(0, 0, 0);
    o.position.set(x, y + 0.06, z + 0.17);
    o.updateMatrix();
    inst.legs.setMatrixAt(i, o.matrix);
    inst.legs.setColorAt(i, inst.bottoms[(q.top + q.skin) % 2]);
  });
  for (const m of [inst.body, inst.head, inst.legs]) {
    m.count = n;
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }
  return (
    <>
      <primitive object={inst.body} />
      <primitive object={inst.head} />
      <primitive object={inst.legs} />
    </>
  );
};

/** A faceted crown (flat-shaded: its facets read as leaf masses, not a balloon). */
const CANOPY = new THREE.IcosahedronGeometry(1, 1);
const TRUNK = new THREE.CylinderGeometry(0.12, 0.16, 1, 6);

/**
 * A distant tree line (No. 007: the world beyond the strip, so the frame is a place, not a void): rounded
 * canopies in two rows, the far row smaller and hazier (its colour mixed toward the sky's horizon, a little
 * of the sky's light added), each tree a trunk and two or three blobs. The pattern repeats every `period`
 * metres and scrolls with `offset` (the strip's position), drawn only between x0 and x1. Instanced.
 */
export const TreeLine: React.FC<{
  mood: Mood;
  x0: number;
  x1: number;
  /** The rows' z (near, far) and their ground's height. */
  z: [number, number];
  y: number;
  offset: number;
  period?: number;
}> = ({mood, x0, x1, z, y, offset, period = 96}) => {
  const max = 1400;
  const inst = useMemo(() => {
    const haze = raw(MOODS[mood].sky[2]);
    const mk = (g: THREE.BufferGeometry, color: string, k: number) => {
      const c = raw(color).lerp(haze, k);
      const m = new THREE.InstancedMesh(
        g,
        new THREE.MeshStandardMaterial({
          color: c,
          roughness: 1,
          flatShading: true,
          emissive: haze.clone().multiplyScalar(0.3 * k),
        }),
        max,
      );
      m.frustumCulled = false;
      return m;
    };
    // the trees of one period: row, x, height, canopy radius
    const trees: {row: 0 | 1; x: number; h: number; r: number; seed: number}[] = [];
    for (const row of [0, 1] as const) {
      let x = 0;
      let k = 0;
      while (x < period) {
        const r = (row ? 1.4 : 1.7) + (row ? 0.9 : 1.1) * random(`tree-${row}-r${k}`);
        trees.push({row, x, h: (row ? 3.6 : 4.4) + 2.6 * random(`tree-${row}-h${k}`), r, seed: k});
        x += r * (0.75 + 0.6 * random(`tree-${row}-gap${k}`));
        k++;
      }
    }
    return {
      near: mk(CANOPY, RACE.treeNear, 0.55),
      far: mk(CANOPY, RACE.treeFar, 0.72),
      trunk: mk(TRUNK, CITY.signalHousing, 0.55),
      trees,
    };
  }, [mood, period]);
  const o = new THREE.Object3D();
  const n = {near: 0, far: 0, trunk: 0};
  const k0 = Math.floor((x0 + offset) / period) - 1;
  const k1 = Math.ceil((x1 + offset) / period) + 1;
  for (let k = k0; k <= k1; k++) {
    for (const t of inst.trees) {
      const x = t.x + k * period - offset;
      if (x < x0 - t.r || x > x1 + t.r) continue;
      const zz = z[t.row];
      const m = t.row ? inst.far : inst.near;
      const key = t.row ? 'far' : 'near';
      // two or three blobs: the crown, a lower one each side
      // the crown, two lower blobs each side, a low bush hiding the trunk's foot
      const blobs: [number, number, number, number][] = [
        [0, t.h, 0, t.r],
        [-t.r * 0.6, t.h - t.r * 0.6, 0.4, t.r * 0.8],
        [t.r * 0.55, t.h - t.r * 0.5, -0.4, t.r * 0.75],
        [t.r * 0.2, t.r * 0.55, 0.9, t.r * 0.6],
      ];
      for (const [dx, by, dz, br] of blobs) {
        if (n[key] >= max) break;
        o.position.set(x + dx, y + by, zz + dz);
        o.scale.set(br, br * 0.9, br);
        o.updateMatrix();
        m.setMatrixAt(n[key]++, o.matrix);
      }
      if (n.trunk < max) {
        o.position.set(x, y + (t.h - t.r) / 2, zz);
        o.scale.set(1, Math.max(0.5, t.h - t.r), 1);
        o.updateMatrix();
        inst.trunk.setMatrixAt(n.trunk++, o.matrix);
      }
    }
  }
  inst.near.count = n.near;
  inst.far.count = n.far;
  inst.trunk.count = n.trunk;
  for (const m of [inst.near, inst.far, inst.trunk]) m.instanceMatrix.needsUpdate = true;
  return (
    <>
      <primitive object={inst.far} />
      <primitive object={inst.trunk} />
      <primitive object={inst.near} />
    </>
  );
};

/**
 * The field beyond the strip (a texture, tiling; bytes display-referred): dry grass (`RACE.field`) with
 * mottled patches and faint mowing stripes along the strip (u). One tile ≈ 24 m.
 */
export const fieldTexture = () => {
  const N = 256;
  const base = hexRgb(RACE.field);
  const data = new Uint8Array(N * N * 4);
  for (let j = 0; j < N; j++)
    for (let i = 0; i < N; i++) {
      const patch = (vnoise(i / 22, j / 22, N / 22) - 0.5) * 22 + (vnoise(i / 6, j / 6, N / 6) - 0.5) * 8;
      const stripe = Math.floor(j / 32) % 2 ? 5 : -5;
      const grain = (vnoise(i * 0.9, j * 0.9, Math.round(N * 0.9)) - 0.5) * 10;
      const o = (j * N + i) * 4;
      for (let c = 0; c < 3; c++) data[o + c] = Math.max(0, Math.min(255, base[c] + patch + stripe + grain));
      data[o + 3] = 255;
    }
  const t = new THREE.DataTexture(data, N, N, THREE.RGBAFormat);
  t.wrapS = THREE.RepeatWrapping;
  t.wrapT = THREE.RepeatWrapping;
  t.magFilter = THREE.LinearFilter;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.generateMipmaps = true;
  t.anisotropy = 8;
  t.needsUpdate = true;
  return t;
};
