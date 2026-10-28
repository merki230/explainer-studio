import React, {useMemo} from 'react';
import * as THREE from 'three';
import {CHARGE, HIGHWAY, MOODS, REAL, STREET, type Mood} from '../../theme';
import {raw, roundedBox, roundedCylinder} from '../plaster';
import {cutMaterial, CutOutline, INK, type Rect} from '../section/cutLook';
import {fieldTexture, TreeLine, vnoise} from './StripProps';
import {applyAlbedo, applyEnv, useAlbedo, useEnvStrength, useStudioEnv} from './useStudioEnv';

type V3 = [number, number, number];

/*
 * No. 010 (N1): a fast-charging bay on its own cut ground block, generic (no network's colours, no logos, no
 * signage text), in the twin section's frame: x along the bay (a car backed in faces −x, its centre at x 0),
 * y up from the bay's surface, z toward the camera (the block's front face is the cut). Metres.
 *
 *  - `ChargeBay`: the block (hatched cut faces on the front and both ends, ink edges); its surface (China:
 *    poured concrete in slabs, optionally the bay painted a muted green; the US: asphalt); the painted bay
 *    lines either side of the car; two rubber wheel stops; the charger's raised island with two bollards.
 *  - `ChargerCabinet`: 'china': a tall cabinet (a body in a warm light grey, a dark front panel with an unlit
 *    screen, a card reader, the holster, side vents, a dark cap; the cable leaves its side through a boot);
 *    'us': a shorter, slimmer post with a dark front band. `CABINET` gives the cable exit and holster.
 *  - `Canopy`: the station's roof on two columns behind the bay, cut on its front edge and both ends.
 *  - `ChargeHorizon`: a field on its own cut block far behind, with the tree line (as the drag strip's).
 * Nothing here is the system: never orange, nothing blooms.
 */

/** The bay block (metres): its ends, front (the cut) and back, depth. */
export const BAY = {x0: -6.2, x1: 6.6, front: 2.3, back: -3.1, depth: 0.6};
/** The painted bay: its lines' z (near, far) and their ends (x). */
export const BAY_LINES = {near: 1.42, far: -1.48, from: -2.95, to: 3.0, width: 0.1};
/** Where the charger stands (its island's centre) and the cabinet's turn (its front faces +z, the camera's side). */
export const CHARGER_AT: V3 = [3.3, 0, 1.15];

/** Points on a cabinet (its own frame: its foot on the island's top at the origin, its front toward +z). */
export const CABINET = {
  china: {exit: [-0.34, 1.32, 0.02] as V3, exitDir: [-1, -0.25, 0.15] as V3, holster: [0.16, 1.02, 0.235] as V3, top: 2.05, screen: [0, 1.48, 0.22] as V3},
  us: {exit: [-0.17, 1.12, 0.0] as V3, exitDir: [-1, -0.3, 0.2] as V3, holster: [0.0, 0.95, 0.15] as V3, top: 1.5, screen: [0, 1.25, 0.14] as V3},
};
/** The island's height (the cabinet stands on it). */
export const ISLAND_H = 0.15;
/** No. 010 draft 2: the kerb stone past the charger (x0 → x1 along the bay, z0 → z1 across, h high), where a driver sits. */
export const CURB = {x0: 4.35, x1: 6.35, z0: 1.2, z1: 1.5, h: 0.24};

const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));

/** The bay's surface: concrete slabs (China) or asphalt (US), u along x over one tile, v across. */
const surfaceTexture = (kind: 'concrete' | 'asphalt') => {
  const W = 512;
  const H = 256;
  const conc = kind === 'concrete';
  const base = hex(conc ? CHARGE.concrete : STREET.asphalt);
  const data = new Uint8Array(W * H * 4);
  for (let j = 0; j < H; j++)
    for (let i = 0; i < W; i++) {
      const grain = (vnoise(i * 0.7, j * 0.7, Math.round(W * 0.7)) - 0.5) * (conc ? 12 : 18);
      const mottle = (vnoise(i / 40, j / 26, W / 40) - 0.5) * (conc ? 16 : 10);
      const speck = vnoise(i + 31, j + (conc ? 7919 : 15401));
      const spot = speck > 0.992 ? 20 : speck < 0.006 ? -16 : 0;
      // saw-cut joints: across at the tile's end, and along the middle (concrete only)
      const joint = conc && (i < 2 || Math.abs(j - H / 2) < 1);
      // tire wear and a faint oil stain where cars park (a soft band down the middle)
      const wear = Math.exp(-(((j - H * 0.5) / (H * 0.22)) ** 2)) * (conc ? 6 : 4);
      const o = (j * W + i) * 4;
      for (let c = 0; c < 3; c++) data[o + c] = Math.max(0, Math.min(255, (base[c] + grain + mottle + spot - wear) * (joint ? 0.72 : 1)));
      data[o + 3] = 255;
    }
  const t = new THREE.DataTexture(data, W, H, THREE.RGBAFormat);
  t.wrapS = THREE.RepeatWrapping;
  t.magFilter = THREE.LinearFilter;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.generateMipmaps = true;
  t.anisotropy = 8;
  t.needsUpdate = true;
  return t;
};

/** The green bay paint: worn at the edges and in the wheel paths, a little mottled. */
const paintTexture = () => {
  const W = 256;
  const H = 128;
  const base = hex(CHARGE.bayGreen);
  const data = new Uint8Array(W * H * 4);
  for (let j = 0; j < H; j++)
    for (let i = 0; i < W; i++) {
      const n = vnoise(i / 9, j / 9);
      const wearPath = Math.max(...[0.22, 0.78].map((c) => Math.exp(-(((j / H - c) / 0.07) ** 2))));
      const a = Math.max(0, Math.min(1, 0.92 - 0.35 * wearPath * n - 0.25 * (n > 0.86 ? 1 : 0)));
      const o = (j * W + i) * 4;
      const g = (vnoise(i * 0.8, j * 0.8) - 0.5) * 10;
      for (let c = 0; c < 3; c++) data[o + c] = Math.max(0, Math.min(255, base[c] + g));
      data[o + 3] = Math.round(255 * a);
    }
  const t = new THREE.DataTexture(data, W, H, THREE.RGBAFormat);
  t.magFilter = THREE.LinearFilter;
  t.minFilter = THREE.LinearFilter;
  t.needsUpdate = true;
  return t;
};

export type ChargeBayProps = {
  mood: Mood;
  region: 'china' | 'us';
  /** The bay painted green (China only). Default false. */
  paint?: boolean;
  /** The block's y (its surface). */
  y: number;
  /** × the ink's thickness. Default 1. */
  inkScale?: number;
  /** No. 010 draft 2: where the block's left end is (m; default `BAY.x0`): further left, a drive-in lane for arriving cars. */
  x0?: number;
  /** No. 010 draft 2: the kerb stone past the charger (`CURB`). Default false. */
  curb?: boolean;
  /** No. 010 draft 2: the block's depth (m; default `BAY.depth`): a deep cut ground block fills a tall framing. */
  depth?: number;
};

/** One charging bay on its cut block (see the file comment). */
export const ChargeBay: React.FC<ChargeBayProps> = ({mood, region, paint = false, y, inkScale = 1, x0: blockX0 = BAY.x0, curb = false, depth: D = BAY.depth}) => {
  const env = useStudioEnv();
  const envScale = useEnvStrength();
  const albedo = useAlbedo();
  const m = MOODS[mood];
  const china = region === 'china';
  const mats = useMemo(() => {
    const surf = surfaceTexture(china ? 'concrete' : 'asphalt');
    return {
      cut: cutMaterial(),
      earth: new THREE.MeshStandardMaterial({color: raw(m.earth), roughness: 1}),
      hidden: new THREE.MeshBasicMaterial({visible: false}),
      surface: new THREE.MeshStandardMaterial({color: raw('#ffffff'), roughness: 0.92, map: surf}),
      paint: new THREE.MeshStandardMaterial({
        color: raw('#ffffff'),
        roughness: 0.75,
        map: paintTexture(),
        transparent: true,
        polygonOffset: true,
        polygonOffsetFactor: -1,
      }),
      line: new THREE.MeshStandardMaterial({color: raw(HIGHWAY.lineWhite), roughness: 0.7, polygonOffset: true, polygonOffsetFactor: -2}),
      island: new THREE.MeshStandardMaterial({color: raw(CHARGE.concrete), roughness: 0.85}),
      stop: new THREE.MeshStandardMaterial({color: raw(REAL.rubber), roughness: 0.85}),
      steel: new THREE.MeshPhysicalMaterial({color: raw(HIGHWAY.galvanized), roughness: 0.4, metalness: 0.6}),
      cap: new THREE.MeshStandardMaterial({color: raw(CHARGE.cabinetDark), roughness: 0.6}),
      curb: new THREE.MeshStandardMaterial({color: raw(CHARGE.curb), roughness: 0.9}),
    };
  }, [china, m.earth]);
  applyEnv(env, [[mats.steel, 0.9]], envScale);
  applyAlbedo([mats.surface, mats.island, mats.curb], albedo);
  const L = BAY.x1 - blockX0;
  const w = BAY.front - BAY.back;
  const xc = (blockX0 + BAY.x1) / 2;
  const zc = (BAY.front + BAY.back) / 2;
  const tile = china ? 4.6 : 6;
  mats.surface.map!.repeat.set(L / tile, 1);
  const rects: Rect[] = [
    [
      [blockX0, -D, BAY.front],
      [BAY.x1, 0, BAY.front],
    ],
    [
      [blockX0, -D, BAY.back],
      [blockX0, 0, BAY.front],
    ],
    [
      [BAY.x1, -D, BAY.back],
      [BAY.x1, 0, BAY.front],
    ],
  ];
  const lineLen = BAY_LINES.to - BAY_LINES.from;
  const [cx, , cz] = CHARGER_AT;
  return (
    <group position={[0, y, 0]}>
      <mesh
        position={[xc, -D / 2, zc]}
        material={[mats.cut, mats.cut, mats.surface, mats.earth, mats.cut, mats.earth]}
        receiveShadow
      >
        <boxGeometry args={[L, D, w]} />
      </mesh>
      {china && paint ? (
        <mesh
          material={mats.paint}
          position={[(BAY_LINES.from + BAY_LINES.to) / 2, 0.0008, (BAY_LINES.near + BAY_LINES.far) / 2]}
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow
        >
          <planeGeometry args={[lineLen, BAY_LINES.near - BAY_LINES.far]} />
        </mesh>
      ) : null}
      {/* the bay's lines: both sides, and across its head behind the charger's island */}
      {[BAY_LINES.near, BAY_LINES.far].map((z) => (
        <mesh key={z} material={mats.line} position={[(BAY_LINES.from + BAY_LINES.to) / 2, 0.0015, z]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[lineLen, BAY_LINES.width]} />
        </mesh>
      ))}
      <mesh material={mats.line} position={[BAY_LINES.from, 0.0015, (BAY_LINES.near + BAY_LINES.far) / 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[BAY_LINES.width, BAY_LINES.near - BAY_LINES.far + BAY_LINES.width]} />
      </mesh>
      {/* two rubber wheel stops behind the rear tires (the car backs in toward +x) */}
      {[-0.8, 0.62].map((z) => (
        <mesh key={z} geometry={roundedBox(0.16, 0.11, 0.55, 0.03, 3)} material={mats.stop} position={[1.98, 0.055, z]} castShadow receiveShadow />
      ))}
      {/* the charger's island: a raised concrete kerb with two steel bollards */}
      <mesh geometry={roundedBox(1.25, ISLAND_H, 0.95, 0.04, 3)} material={mats.island} position={[cx, ISLAND_H / 2, cz]} castShadow receiveShadow />
      {[-0.52, 0.52].map((dz) => (
        <group key={dz} position={[cx + 0.45, ISLAND_H, cz + dz]}>
          <mesh geometry={roundedCylinder(0.065, 0.85, 0.02, 28)} material={mats.steel} position={[0, 0.425, 0]} castShadow />
          <mesh position={[0, 0.86, 0]} material={mats.cap}>
            <sphereGeometry args={[0.066, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
          </mesh>
        </group>
      ))}
      {curb ? (
        <mesh
          geometry={roundedBox(CURB.x1 - CURB.x0, CURB.h, CURB.z1 - CURB.z0, 0.03, 3)}
          material={mats.curb}
          position={[(CURB.x0 + CURB.x1) / 2, CURB.h / 2, (CURB.z0 + CURB.z1) / 2]}
          castShadow
          receiveShadow
        />
      ) : null}
      <CutOutline rects={rects} thickness={INK * inkScale} />
    </group>
  );
};

/** A canvas for the unlit screen: dark glass with a faint, unreadable layout (neutral greys only). */
let screenTex: THREE.CanvasTexture | null = null;
const screenTexture = () => {
  if (screenTex) return screenTex;
  const c = document.createElement('canvas');
  c.width = 192;
  c.height = 128;
  const cx = c.getContext('2d')!;
  cx.fillStyle = CHARGE.screen;
  cx.fillRect(0, 0, 192, 128);
  cx.fillStyle = 'rgba(200,210,220,0.10)';
  cx.fillRect(14, 14, 164, 14);
  cx.fillRect(14, 40, 70, 60);
  cx.fillRect(96, 40, 82, 26);
  cx.fillRect(96, 74, 82, 26);
  screenTex = new THREE.CanvasTexture(c);
  screenTex.colorSpace = THREE.SRGBColorSpace;
  return screenTex;
};

export type ChargerCabinetProps = {
  kind: 'china' | 'us';
  /** Its foot (the island's top). */
  position: V3;
};

/** A DC fast charger (see the file comment). */
export const ChargerCabinet: React.FC<ChargerCabinetProps> = ({kind, position}) => {
  const env = useStudioEnv();
  const envScale = useEnvStrength();
  const albedo = useAlbedo();
  const mats = useMemo(
    () => ({
      body: new THREE.MeshPhysicalMaterial({color: raw(CHARGE.cabinet), roughness: 0.38, clearcoat: 0.5, clearcoatRoughness: 0.35}),
      dark: new THREE.MeshPhysicalMaterial({color: raw(CHARGE.cabinetDark), roughness: 0.45, clearcoat: 0.3}),
      screen: new THREE.MeshPhysicalMaterial({color: raw('#ffffff'), map: screenTexture(), roughness: 0.08, clearcoat: 1}),
      vent: new THREE.MeshStandardMaterial({color: raw('#0d0e10'), roughness: 0.9}),
      rubber: new THREE.MeshStandardMaterial({color: raw(REAL.rubber), roughness: 0.8}),
      trim: new THREE.MeshPhysicalMaterial({color: raw(REAL.steel), roughness: 0.35, metalness: 0.7}),
    }),
    [],
  );
  applyEnv(
    env,
    [
      [mats.body, 0.7],
      [mats.dark, 0.5],
      [mats.screen, 1],
      [mats.trim, 1],
    ],
    envScale,
  );
  applyAlbedo([mats.body], albedo);
  const c = CABINET[kind];
  if (kind === 'china') {
    const W = 0.66;
    const H = 1.9;
    const D = 0.44;
    return (
      <group position={position}>
        <mesh geometry={roundedBox(W - 0.04, 0.08, D - 0.04, 0.02, 2)} material={mats.dark} position={[0, 0.04, 0]} />
        <mesh geometry={roundedBox(W, H, D, 0.045, 4)} material={mats.body} position={[0, 0.08 + H / 2, 0]} castShadow receiveShadow />
        {/* the cap */}
        <mesh geometry={roundedBox(W + 0.04, 0.07, D + 0.04, 0.025, 3)} material={mats.dark} position={[0, 0.08 + H + 0.03, 0]} castShadow />
        {/* the front panel, the screen, the card reader, the holster */}
        <mesh geometry={roundedBox(W - 0.14, 0.82, 0.012, 0.03, 3)} material={mats.dark} position={[0, 1.36, D / 2 + 0.004]} />
        <mesh material={mats.screen} position={[0, c.screen[1], D / 2 + 0.011]}>
          <planeGeometry args={[0.36, 0.24]} />
        </mesh>
        <mesh geometry={roundedBox(0.12, 0.08, 0.012, 0.012, 2)} material={mats.trim} position={[0, 1.18, D / 2 + 0.012]} />
        <group position={[c.holster[0], c.holster[1], D / 2]}>
          <mesh geometry={roundedBox(0.16, 0.16, 0.06, 0.03, 3)} material={mats.dark} position={[0, 0, 0.02]} />
          <mesh position={[0, 0, 0.052]} rotation={[Math.PI / 2, 0, 0]} material={mats.vent}>
            <cylinderGeometry args={[0.05, 0.05, 0.004, 28]} />
          </mesh>
        </group>
        {/* vents on the side toward the camera (+x) */}
        {[0.4, 0.5, 0.6, 0.7, 0.8].map((yy) => (
          <mesh key={yy} position={[W / 2 + 0.002, yy, 0]} rotation={[0, Math.PI / 2, 0]} material={mats.vent}>
            <planeGeometry args={[0.3, 0.025]} />
          </mesh>
        ))}
        {/* the cable's boot on the side toward the car */}
        <mesh position={[c.exit[0] + 0.025, c.exit[1], c.exit[2]]} rotation={[0, 0, Math.PI / 2 - 0.25]} material={mats.rubber}>
          <cylinderGeometry args={[0.05, 0.065, 0.1, 24]} />
        </mesh>
      </group>
    );
  }
  const W = 0.3;
  const H = 1.42;
  const D = 0.26;
  return (
    <group position={position}>
      <mesh geometry={roundedBox(W + 0.06, 0.06, D + 0.06, 0.02, 2)} material={mats.dark} position={[0, 0.03, 0]} />
      <mesh geometry={roundedBox(W, H, D, 0.11, 6)} material={mats.body} position={[0, 0.06 + H / 2, 0]} castShadow receiveShadow />
      {/* the dark front band with the screen and the holster */}
      <mesh geometry={roundedBox(0.13, H - 0.2, 0.014, 0.04, 3)} material={mats.dark} position={[0, 0.06 + H / 2 + 0.02, D / 2 - 0.002]} />
      <mesh material={mats.screen} position={[0, c.screen[1], D / 2 + 0.007]}>
        <planeGeometry args={[0.1, 0.13]} />
      </mesh>
      <group position={[c.holster[0], c.holster[1], D / 2]}>
        <mesh position={[0, 0, 0.012]} rotation={[Math.PI / 2, 0, 0]} material={mats.vent}>
          <cylinderGeometry args={[0.036, 0.036, 0.006, 24]} />
        </mesh>
      </group>
      <mesh position={[c.exit[0] + 0.02, c.exit[1], c.exit[2]]} rotation={[0, 0, Math.PI / 2 - 0.3]} material={mats.rubber}>
        <cylinderGeometry args={[0.042, 0.055, 0.08, 20]} />
      </mesh>
    </group>
  );
};

export type CanopyProps = {
  mood: Mood;
  /** The bay's surface y. */
  y: number;
  /** The soffit's height above the bay (clearance). Default 3.4. */
  height?: number;
  inkScale?: number;
};

/** The canopy: a roof slab on two columns behind the bay, its front edge and both ends cut. */
export const Canopy: React.FC<CanopyProps> = ({mood, y, height = 3.4, inkScale = 1}) => {
  const albedo = useAlbedo();
  void mood;
  const mats = useMemo(
    () => ({
      cut: cutMaterial(),
      fascia: new THREE.MeshStandardMaterial({color: raw(CHARGE.canopy), roughness: 0.6}),
      under: new THREE.MeshStandardMaterial({color: raw(CHARGE.canopyUnder), roughness: 0.8}),
      panel: new THREE.MeshStandardMaterial({color: raw('#e9ecee'), roughness: 0.4}),
      column: new THREE.MeshPhysicalMaterial({color: raw(CHARGE.column), roughness: 0.45, metalness: 0.5}),
    }),
    [],
  );
  applyAlbedo([mats.fascia, mats.under], albedo);
  const x0 = -3.8;
  const x1 = 4.9;
  const z0 = -3.0;
  const z1 = 0.7;
  const t = 0.32;
  const yb = height;
  return (
    <group position={[0, y, 0]}>
      {[-2.2, 3.7].map((x) => (
        <mesh key={x} geometry={roundedBox(0.28, yb, 0.28, 0.03, 3)} material={mats.column} position={[x, yb / 2, -2.45]} castShadow receiveShadow />
      ))}
      <mesh
        position={[(x0 + x1) / 2, yb + t / 2, (z0 + z1) / 2]}
        material={[mats.cut, mats.cut, mats.fascia, mats.under, mats.cut, mats.fascia]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[x1 - x0, t, z1 - z0]} />
      </mesh>
      {/* light panels in the soffit (unlit by day) */}
      {[-1.6, 1.2, 4.0].map((x) => (
        <mesh key={x} position={[x, yb - 0.002, -1.2]} rotation={[Math.PI / 2, 0, 0]} material={mats.panel}>
          <planeGeometry args={[1.2, 0.3]} />
        </mesh>
      ))}
      <CutOutline
        rects={[
          [
            [x0, yb, z1],
            [x1, yb + t, z1],
          ],
          [
            [x0, yb, z0],
            [x0, yb + t, z1],
          ],
          [
            [x1, yb, z0],
            [x1, yb + t, z1],
          ],
        ]}
        thickness={INK * inkScale}
      />
    </group>
  );
};

/** The world beyond: a field on its own cut block far behind, with the tree line (static). */
export const ChargeHorizon: React.FC<{mood: Mood; y: number; inkScale?: number}> = ({mood, y, inkScale = 1}) => {
  const H = {front: -26, back: -150, depth: 0.9, half: 110, trees: [-88, -116] as [number, number]};
  const mats = useMemo(() => {
    const f = fieldTexture();
    f.repeat.set((2 * H.half) / 24, (H.front - H.back) / 24);
    return {
      field: new THREE.MeshStandardMaterial({color: raw('#ffffff'), roughness: 1, map: f}),
      cut: cutMaterial(),
      hidden: new THREE.MeshBasicMaterial({visible: false}),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <group position={[0, y, 0]}>
      <mesh
        position={[0, -H.depth / 2, (H.front + H.back) / 2]}
        material={[mats.hidden, mats.hidden, mats.field, mats.hidden, mats.cut, mats.hidden]}
      >
        <boxGeometry args={[2 * H.half, H.depth, H.front - H.back]} />
      </mesh>
      <TreeLine mood={mood} x0={-H.half} x1={H.half} z={H.trees} y={0} offset={0} />
      <CutOutline
        rects={[
          [
            [-H.half, -H.depth, H.front],
            [H.half, 0, H.front],
          ],
        ]}
        thickness={INK * 2.2 * inkScale}
      />
    </group>
  );
};

/** The clock face (canvas): the dial in `clockFace`, 60 ticks and the 12 hour bars in `clockInk`, no numerals, no logo. */
let clockTex: THREE.CanvasTexture | null = null;
const clockTexture = () => {
  if (clockTex) return clockTex;
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 256;
  const cx = c.getContext('2d')!;
  cx.fillStyle = CHARGE.clockFace;
  cx.beginPath();
  cx.arc(128, 128, 126, 0, Math.PI * 2);
  cx.fill();
  cx.strokeStyle = CHARGE.clockInk;
  for (let i = 0; i < 60; i++) {
    const a = (i / 60) * Math.PI * 2;
    const big = i % 5 === 0;
    cx.lineWidth = big ? 9 : 3;
    const r0 = big ? 92 : 106;
    cx.beginPath();
    cx.moveTo(128 + Math.sin(a) * r0, 128 - Math.cos(a) * r0);
    cx.lineTo(128 + Math.sin(a) * 116, 128 - Math.cos(a) * 116);
    cx.stroke();
  }
  clockTex = new THREE.CanvasTexture(c);
  clockTex.colorSpace = THREE.SRGBColorSpace;
  clockTex.anisotropy = 8;
  return clockTex;
};

export type StationClockProps = {
  /** The face's centre (the bay's frame). */
  position: V3;
  /** Minutes past midnight (13:20 = 800); the hands sweep continuously. */
  minutes: number;
  /** The face's radius (m). Default 0.42. */
  radius?: number;
  /** The face turned toward the camera (rad about y). Default 0.48 (the section angle's yaw). */
  yaw?: number;
};

/**
 * No. 010 draft 2: the station clock, a plain round dial on a galvanized post (generic: no numerals, no brand),
 * turned to the camera so it reads at the twin and wide framings. The hands are ink; in the time-lapse they
 * spin with `minutes`. Not the system: never orange.
 */
export const StationClock: React.FC<StationClockProps> = ({position, minutes, radius = 0.42, yaw = 0.48}) => {
  const env = useStudioEnv();
  const envScale = useEnvStrength();
  const albedo = useAlbedo();
  const mats = useMemo(
    () => ({
      face: new THREE.MeshStandardMaterial({color: raw('#ffffff'), roughness: 0.6, map: clockTexture()}),
      ink: new THREE.MeshBasicMaterial({color: raw(CHARGE.clockInk)}),
      rim: new THREE.MeshPhysicalMaterial({color: raw(CHARGE.clockInk), roughness: 0.4, metalness: 0.3}),
      steel: new THREE.MeshPhysicalMaterial({color: raw(HIGHWAY.galvanized), roughness: 0.4, metalness: 0.6}),
    }),
    [],
  );
  applyEnv(env, [[mats.steel, 0.9], [mats.rim, 0.6]], envScale);
  applyAlbedo([mats.face], albedo);
  const m = ((minutes % 720) + 720) % 720;
  const hourA = (m / 720) * Math.PI * 2;
  const minA = ((m % 60) / 60) * Math.PI * 2;
  const r = radius;
  return (
    <group position={[position[0], 0, position[2]]}>
      <mesh geometry={roundedCylinder(0.045, position[1] - r + 0.02, 0.01, 20)} material={mats.steel} position={[0, (position[1] - r + 0.02) / 2, 0]} castShadow />
      <group position={[0, position[1], 0]} rotation={[0, yaw, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} material={mats.rim} castShadow>
          <cylinderGeometry args={[r * 1.08, r * 1.08, 0.08, 48]} />
        </mesh>
        <mesh position={[0, 0, 0.041]} material={mats.face}>
          <circleGeometry args={[r, 48]} />
        </mesh>
        {/* the hands, from the centre (rotation about z: clockwise as seen from the front) */}
        <group position={[0, 0, 0.046]} rotation={[0, 0, -hourA]}>
          <mesh position={[0, r * 0.25, 0]} material={mats.ink}>
            <planeGeometry args={[r * 0.1, r * 0.62]} />
          </mesh>
        </group>
        <group position={[0, 0, 0.05]} rotation={[0, 0, -minA]}>
          <mesh position={[0, r * 0.36, 0]} material={mats.ink}>
            <planeGeometry args={[r * 0.06, r * 0.86]} />
          </mesh>
        </group>
        <mesh position={[0, 0, 0.054]} material={mats.ink}>
          <circleGeometry args={[r * 0.07, 20]} />
        </mesh>
      </group>
    </group>
  );
};

/** A soft cloud (canvas alpha): a few overlapping round puffs with a flat base. */
let cloudTex: THREE.CanvasTexture | null = null;
const cloudTexture = () => {
  if (cloudTex) return cloudTex;
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 128;
  const cx = c.getContext('2d')!;
  cx.clearRect(0, 0, 256, 128);
  const puffs: [number, number, number][] = [
    [70, 78, 34],
    [110, 60, 44],
    [155, 66, 38],
    [192, 82, 28],
    [128, 88, 40],
  ];
  for (const [x, y, rr] of puffs) {
    const g = cx.createRadialGradient(x, y, rr * 0.2, x, y, rr);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.7, 'rgba(255,255,255,0.85)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    cx.fillStyle = g;
    cx.fillRect(x - rr, y - rr, rr * 2, rr * 2);
  }
  // a soft flat base
  const b = cx.createLinearGradient(0, 96, 0, 112);
  b.addColorStop(0, 'rgba(0,0,0,0)');
  b.addColorStop(1, 'rgba(0,0,0,1)');
  cx.globalCompositeOperation = 'destination-out';
  cx.fillStyle = b;
  cx.fillRect(0, 96, 256, 32);
  cloudTex = new THREE.CanvasTexture(c);
  cloudTex.colorSpace = THREE.SRGBColorSpace;
  return cloudTex;
};

export type DriftingCloudsProps = {
  mood: Mood;
  /** Story minutes (the time-lapse clock): the clouds drift with it, so the same minute is the same sky. */
  minutes: number;
  /** The band of sky they float in: y from → to (scene metres), and z (behind the bays). */
  y: [number, number];
  z?: number;
  /** Metres they drift per story minute. Default 0.35. */
  speed?: number;
  /** How many. Default 7. */
  count?: number;
};

/**
 * No. 010 draft 2: soft flat clouds in the sky around the sections (behind the bays, in front of the far field),
 * drifting along +x with the story clock (so a time-lapse moves them and the same minute shows the same sky).
 * Seeded places; never orange, never bloomed.
 */
export const DriftingClouds: React.FC<DriftingCloudsProps> = ({mood, minutes, y, z = -14, speed = 0.35, count = 7}) => {
  const mat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: raw(mood === 'night' ? CHARGE.cloudNight : CHARGE.cloud),
        map: cloudTexture(),
        transparent: true,
        depthWrite: false,
        opacity: mood === 'night' ? 0.55 : 0.95,
        fog: false,
      }),
    [mood],
  );
  mat.color.copy(raw(mood === 'night' ? CHARGE.cloudNight : CHARGE.cloud)).multiplyScalar(1 / MOODS[mood].exposure);
  const span = 64;
  return (
    <group>
      {[...Array(count).keys()].map((i) => {
        const r1 = vnoise(i * 7.13 + 0.5, 3.1);
        const r2 = vnoise(i * 3.71 + 1.5, 9.7);
        const r3 = vnoise(i * 5.37 + 2.5, 1.3);
        const w = 6 + 5 * r2;
        const x0 = -span / 2 + (i + 0.5) * (span / count) + (r1 - 0.5) * 4;
        const x = ((((x0 + minutes * speed + span / 2) % span) + span) % span) - span / 2;
        return (
          <mesh key={i} material={mat} position={[x, y[0] + (y[1] - y[0]) * r3, z - i * 0.3]} renderOrder={-1}>
            <planeGeometry args={[w, w * 0.5]} />
          </mesh>
        );
      })}
    </group>
  );
};
