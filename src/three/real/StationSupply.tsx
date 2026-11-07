import React, {useMemo} from 'react';
import * as THREE from 'three';
import {CHARGE, HIGHWAY, MOODS, PLUGS, REAL, section, STREET, type Mood} from '../../theme';
import {raw, roundedBox, roundedCylinder} from '../plaster';
import {cutMaterial, CutOutline, INK, type Rect} from '../section/cutLook';
import {GlowNode, GlowSegment} from '../section/GlowLines';
import {CHARGER_AT, CURB, ISLAND_H, surfaceTexture} from './ChargeSite';
import {applyAlbedo, applyEnv, useAlbedo, useEnvStrength, useStudioEnv} from './useStudioEnv';

type V3 = [number, number, number];

/*
 * No. 016 (N1, N2, N3): the US fast-charger row as a section block and its supply, in the row's frame (x across the
 * row, y up, z toward the camera; the block's front face is the cut). Four back-in stalls side by side (each the charge
 * kit's US bay turned a quarter turn, never mirrored: the car's nose toward the camera, its left (cut) side to +x, the
 * post on its island behind the car's left rear corner at the stall's far end, a kerb stone past it), the aisle in
 * front of them, and at the row's right end the station's supply: a utility pole with its line, a pad transformer
 * and a meter cabinet with a big round dial (the aisle runs behind the cabinet and the pole). Generic: no network,
 * no utility, no text.
 *
 *  - `ChargeRow`: the block (asphalt), the stalls' lines, wheel stops, islands, bollards and kerb stones.
 *  - `StationSupply`: the pole (crossarm, insulators, the line leaving to the right), the transformer on its pad, the
 *    meter cabinet (turned toward the camera) with the dial: an ink needle (`needle` 0 → 1 of full scale) and the
 *    orange peak pointer (`peak`, `peakGlow`: the § 5 glow, bloomed), the system's only fixed mark here.
 *  - `RowFeed`: the underground feed drawn on the cut face (neutral grey, § 5 route grammar), with a node dot under
 *    each post; a dot turns orange once a fee piece has landed on it (`lit`, the § 5 Trace).
 *  - `FeePieces`: the fee slab and its pieces (orange core and a 25% halo, bloomed).
 *  - `ReverseLamps`: white reversing lamps on a cut car's tail (flat, never bloomed).
 */

/** The row's fixed points (row frame, metres). */
export const ROW = {
  /** Stall centres (x), left → right (post 1 → 4). The parked car's centre is at (x, stallZ); its nose toward +z. */
  stalls: [-7.6, -4.2, -0.8, 2.6],
  /** The stalls' parked spot (z): back far enough that the aisle (at stallZ + 5.8) runs behind the meter cabinet and the pole. */
  stallZ: -2.0,
  /** The stall's width (between its lines). */
  stallW: 3.4,
  block: {x0: -36, x1: 40, back: -8.6, front: 6.6, depth: 0.6},
  /** The meter cabinet's foot and its turn toward the camera (rad about y): in front of the aisle, so passing cars never hide the dial. */
  meter: [5.55, 0, 5.6] as V3,
  meterYaw: 0.42,
  /** The cabinet's size (w, h, d) and its dial (centre height on the face, radius). */
  cabinet: [0.92, 1.56, 0.46] as V3,
  dial: {y: 1.08, r: 0.27},
  /** The pad transformer, behind the aisle. */
  transformer: [7.2, 0, 1.6] as V3,
  /** The pole stands at the block's front edge (its base on the cut face). */
  pole: [8.95, 0, 6.32] as V3,
  poleH: 8.6,
  /** The feed on the cut face: its height and how far proud of the face. */
  feedY: -0.2,
  /** The orange route's run on the cut face (0.12 under the feed). */
  routeY: -0.34,
  faceZ: 6.6 + 0.025,
};

/** The dial's swing: needle 0 at −135°, full scale at +135° (clockwise seen from the front). */
export const dialAngle = (v: number) => ((-135 + 270 * Math.max(0, Math.min(1, v))) * Math.PI) / 180;

/** A point on the meter cabinet (its own frame: foot at 0, face toward +z) in the row frame. */
export const meterPoint = (v: V3): V3 => {
  const [mx, my, mz] = ROW.meter;
  const c = Math.cos(ROW.meterYaw);
  const s = Math.sin(ROW.meterYaw);
  return [mx + v[0] * c + v[2] * s, my + v[1], mz - v[0] * s + v[2] * c];
};

/** The dial's centre (row frame), slightly proud of the face. */
export const dialCentre = (): V3 => meterPoint([0, ROW.dial.y, ROW.cabinet[2] / 2 + 0.03]);

/** The peak pointer's tip (row frame) for a reading (0 → 1). */
export const dialTip = (v: number, r = ROW.dial.r * 0.92): V3 => {
  const a = dialAngle(v);
  return meterPoint([Math.sin(a) * r, ROW.dial.y + Math.cos(a) * r, ROW.cabinet[2] / 2 + 0.045]);
};

/** A post's foot (row frame) for stall k. */
export const postFoot = (k: number): V3 => [ROW.stalls[k] + CHARGER_AT[2], ISLAND_H, ROW.stallZ - CHARGER_AT[0]];

/**
 * The orange route from the meter to the utility (§ 5 right angles): from the dial's centre down the cabinet's face,
 * along the ground to the cut face, down it, along it to the pole, up the cut face and the pole's front to its top,
 * then out along the line to the right.
 */
export const supplyRoute = (): V3[] => {
  const d = dialCentre();
  const foot = meterPoint([0, 0.04, ROW.cabinet[2] / 2 + 0.03]);
  const F = ROW.faceZ;
  const [px, , pz] = ROW.pole;
  return [
    d,
    [foot[0], 0.04, foot[2]],
    [foot[0], 0.04, F],
    [foot[0], ROW.routeY, F],
    [px, ROW.routeY, F],
    [px, 0.04, F],
    [px, 0.04, pz + 0.2],
    [px, ROW.poleH - 0.35, pz + 0.2],
    [px + 0.9, ROW.poleH - 0.2, pz + 0.2],
    [px + 26, ROW.poleH - 0.2, pz + 0.2],
  ];
};

// ---------------------------------------------------------------- the row's block

export type ChargeRowProps = {mood: Mood; inkScale?: number};

/** The row's block: asphalt, stall lines, wheel stops, the posts' islands and bollards, the kerb stones. */
export const ChargeRow: React.FC<ChargeRowProps> = ({mood, inkScale = 1}) => {
  const env = useStudioEnv();
  const envScale = useEnvStrength();
  const albedo = useAlbedo();
  const m = MOODS[mood];
  const B = ROW.block;
  const mats = useMemo(() => {
    const surf = surfaceTexture('asphalt');
    surf.repeat.set((B.x1 - B.x0) / 6, 1);
    return {
      cut: cutMaterial(),
      earth: new THREE.MeshStandardMaterial({color: raw(m.earth), roughness: 1}),
      surface: new THREE.MeshStandardMaterial({color: raw('#ffffff'), roughness: 0.92, map: surf}),
      line: new THREE.MeshStandardMaterial({color: raw(HIGHWAY.lineWhite), roughness: 0.7, polygonOffset: true, polygonOffsetFactor: -2}),
      island: new THREE.MeshStandardMaterial({color: raw(CHARGE.concrete), roughness: 0.85}),
      stop: new THREE.MeshStandardMaterial({color: raw(REAL.rubber), roughness: 0.85}),
      steel: new THREE.MeshPhysicalMaterial({color: raw(HIGHWAY.galvanized), roughness: 0.4, metalness: 0.6}),
      cap: new THREE.MeshStandardMaterial({color: raw(CHARGE.cabinetDark), roughness: 0.6}),
      curb: new THREE.MeshStandardMaterial({color: raw(CHARGE.curb), roughness: 0.9}),
    };
  }, [B.x0, B.x1, m.earth]);
  applyEnv(env, [[mats.steel, 0.9]], envScale);
  applyAlbedo([mats.surface, mats.island, mats.curb], albedo);
  const rects: Rect[] = [
    [
      [B.x0, -B.depth, B.front],
      [B.x1, 0, B.front],
    ],
    [
      [B.x0, -B.depth, B.back],
      [B.x0, 0, B.front],
    ],
  ];
  const half = ROW.stallW / 2;
  const lines = [...ROW.stalls.map((x) => x - half), ROW.stalls[ROW.stalls.length - 1] + half];
  return (
    <group>
      <mesh
        position={[(B.x0 + B.x1) / 2, -B.depth / 2, (B.front + B.back) / 2]}
        material={[mats.cut, mats.cut, mats.surface, mats.earth, mats.cut, mats.earth]}
        receiveShadow
      >
        <boxGeometry args={[B.x1 - B.x0, B.depth, B.front - B.back]} />
      </mesh>
      {/* the stall lines (from the aisle's edge to the islands) */}
      {lines.map((x) => (
        <mesh key={x} material={mats.line} position={[x, 0.0015, ROW.stallZ - 0.1]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[0.1, 5.4]} />
        </mesh>
      ))}
      {ROW.stalls.map((x, k) => {
        const [cx, , cz] = postFoot(k);
        return (
          <group key={k}>
            {/* two wheel stops behind the rear tires */}
            {[-0.8, 0.62].map((dx) => (
              <mesh key={dx} geometry={roundedBox(0.55, 0.11, 0.16, 0.03, 3)} material={mats.stop} position={[x + dx, 0.055, ROW.stallZ - 1.98]} castShadow receiveShadow />
            ))}
            {/* the post's island and its two bollards */}
            <mesh geometry={roundedBox(0.95, 0.15, 1.25, 0.04, 3)} material={mats.island} position={[cx, 0.075, cz]} castShadow receiveShadow />
            {[-0.52, 0.52].map((dx) => (
              <group key={dx} position={[cx + dx, 0.15, cz - 0.45]}>
                <mesh geometry={roundedCylinder(0.065, 0.85, 0.02, 28)} material={mats.steel} position={[0, 0.425, 0]} castShadow />
                <mesh position={[0, 0.86, 0]} material={mats.cap}>
                  <sphereGeometry args={[0.066, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
                </mesh>
              </group>
            ))}
            {/* the kerb stone past the post, toward the block's back (where a driver sits) */}
            <mesh
              geometry={roundedBox(CURB.z1 - CURB.z0, CURB.h, CURB.x1 - CURB.x0, 0.03, 3)}
              material={mats.curb}
              position={[x + (CURB.z0 + CURB.z1) / 2, CURB.h / 2, ROW.stallZ - (CURB.x0 + CURB.x1) / 2]}
              castShadow
              receiveShadow
            />
          </group>
        );
      })}
      <CutOutline rects={rects} thickness={INK * inkScale} />
    </group>
  );
};

// ---------------------------------------------------------------- the supply

/** The meter's dial face (canvas): pale, an arc of ticks from −135° to +135°, every fifth long; no numerals. */
let dialTex: THREE.CanvasTexture | null = null;
const dialTexture = () => {
  if (dialTex) return dialTex;
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 256;
  const g = c.getContext('2d')!;
  g.fillStyle = STREET.dial;
  g.beginPath();
  g.arc(128, 128, 126, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = STREET.dialInk;
  for (let i = 0; i <= 30; i++) {
    const a = dialAngle(i / 30);
    const big = i % 5 === 0;
    g.lineWidth = big ? 8 : 3;
    const r0 = big ? 86 : 100;
    g.beginPath();
    g.moveTo(128 + Math.sin(a) * r0, 128 - Math.cos(a) * r0);
    g.lineTo(128 + Math.sin(a) * 114, 128 - Math.cos(a) * 114);
    g.stroke();
  }
  dialTex = new THREE.CanvasTexture(c);
  dialTex.colorSpace = THREE.SRGBColorSpace;
  dialTex.anisotropy = 8;
  return dialTex;
};

/** A sagging wire between two points (a catenary-ish arc). */
const sagPoints = (a: V3, b: V3, sag: number, n = 16): THREE.Vector3[] =>
  [...Array(n + 1).keys()].map((i) => {
    const u = i / n;
    return new THREE.Vector3(a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u - sag * 4 * u * (1 - u), a[2] + (b[2] - a[2]) * u);
  });

export type StationSupplyProps = {
  mood: Mood;
  /** The needle, 0 → 1 of full scale. */
  needle: number;
  /** The peak pointer's reading (0 → 1) and its glow (0: hidden). */
  peak: number;
  peakGlow: number;
  /** The glow's core radius (m), scaled with the camera by the scene. */
  glowR: number;
};

/** The pole, the transformer and the meter cabinet with its dial (see the file comment). */
export const StationSupply: React.FC<StationSupplyProps> = ({mood, needle, peak, peakGlow, glowR}) => {
  const env = useStudioEnv();
  const envScale = useEnvStrength();
  const albedo = useAlbedo();
  void mood;
  const mats = useMemo(
    () => ({
      pole: new THREE.MeshStandardMaterial({color: raw(STREET.pole), roughness: 0.9}),
      arm: new THREE.MeshStandardMaterial({color: raw(STREET.pole), roughness: 0.85}),
      insulator: new THREE.MeshPhysicalMaterial({color: raw(CHARGE.cabinet), roughness: 0.25, clearcoat: 0.6}),
      wire: new THREE.MeshStandardMaterial({color: raw(STREET.cable), roughness: 0.6}),
      conduit: new THREE.MeshStandardMaterial({color: raw(PLUGS.feed), roughness: 0.6}),
      pad: new THREE.MeshStandardMaterial({color: raw(CHARGE.concrete), roughness: 0.85}),
      transformer: new THREE.MeshPhysicalMaterial({color: raw(PLUGS.transformer), roughness: 0.5, clearcoat: 0.3}),
      vent: new THREE.MeshStandardMaterial({color: raw(CHARGE.cabinetDark), roughness: 0.9}),
      cabinet: new THREE.MeshPhysicalMaterial({color: raw(PLUGS.meterCabinet), roughness: 0.42, metalness: 0.35}),
      dark: new THREE.MeshStandardMaterial({color: raw(CHARGE.cabinetDark), roughness: 0.6}),
      ring: new THREE.MeshPhysicalMaterial({color: raw(REAL.steel), roughness: 0.3, metalness: 0.7}),
      dial: new THREE.MeshStandardMaterial({color: raw('#ffffff'), roughness: 0.55, map: dialTexture()}),
      ink: new THREE.MeshBasicMaterial({color: raw(STREET.dialInk)}),
      glass: new THREE.MeshPhysicalMaterial({color: raw('#ffffff'), roughness: 0.05, transparent: true, opacity: 0.14, depthWrite: false}),
    }),
    [],
  );
  applyEnv(env, [[mats.cabinet, 0.8], [mats.ring, 1], [mats.transformer, 0.5], [mats.insulator, 0.8]], envScale);
  applyAlbedo([mats.pole, mats.arm, mats.pad, mats.transformer, mats.cabinet], albedo);
  const [px, , pz] = ROW.pole;
  const H = ROW.poleH;
  const [tx, , tz] = ROW.transformer;
  const [cw, ch, cd] = ROW.cabinet;
  const wires = useMemo(
    () =>
      [-0.85, 0, 0.85].map((dz) => {
        const a: V3 = [px, H - 0.32 + (dz === 0 ? 0.36 : 0), pz + dz];
        const b: V3 = [px + 30, H - 0.1 + (dz === 0 ? 0.36 : 0), pz + dz];
        return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(sagPoints(a, b, 0.7)), 40, 0.012, 5, false);
      }),
    [px, pz, H],
  );
  const a = dialAngle(needle);
  const pa = dialAngle(peak);
  const R = ROW.dial.r;
  const face = cd / 2;
  return (
    <group>
      {/* the pole: a wood pole on the block's front edge, a crossarm, three insulators, the line leaving to the right */}
      <mesh geometry={roundedCylinder(0.15, H, 0.02, 20)} material={mats.pole} position={[px, H / 2 - 0.5, pz]} castShadow receiveShadow />
      <mesh geometry={roundedBox(0.12, 0.12, 2.1, 0.02, 2)} material={mats.arm} position={[px, H - 0.45, pz]} castShadow />
      {[-0.85, 0, 0.85].map((dz) => (
        <mesh key={dz} material={mats.insulator} position={[px, H - 0.32 + (dz === 0 ? 0.36 : 0), pz + dz]}>
          <cylinderGeometry args={[0.035, 0.05, 0.16, 14]} />
        </mesh>
      ))}
      <mesh geometry={roundedCylinder(0.035, 0.42, 0.01, 12)} material={mats.arm} position={[px, H - 0.05, pz]} />
      {wires.map((g, i) => (
        <mesh key={i} geometry={g} material={mats.wire} />
      ))}
      {/* the riser conduit down the pole's back into the ground */}
      <mesh material={mats.conduit} position={[px, (H - 0.8) / 2, pz - 0.19]}>
        <cylinderGeometry args={[0.045, 0.045, H - 0.8, 12]} />
      </mesh>
      {/* the pad transformer on its concrete pad: a box, a hinged front with vents */}
      <mesh geometry={roundedBox(1.55, 0.12, 1.35, 0.03, 2)} material={mats.pad} position={[tx, 0.06, tz]} castShadow receiveShadow />
      <mesh geometry={roundedBox(1.32, 1.1, 1.08, 0.05, 3)} material={mats.transformer} position={[tx, 0.12 + 0.55, tz]} castShadow receiveShadow />
      {[0.42, 0.58, 0.74, 0.9].map((y) => (
        <mesh key={y} position={[tx, y, tz + 0.545]} material={mats.vent}>
          <planeGeometry args={[0.9, 0.035]} />
        </mesh>
      ))}
      {/* the meter cabinet, turned toward the camera: a pad, the body, a dark cap, the dial with needle and peak pointer */}
      <group position={ROW.meter} rotation={[0, ROW.meterYaw, 0]}>
        <mesh geometry={roundedBox(cw + 0.2, 0.1, cd + 0.2, 0.02, 2)} material={mats.pad} position={[0, 0.05, 0]} castShadow receiveShadow />
        <mesh geometry={roundedBox(cw, ch, cd, 0.04, 4)} material={mats.cabinet} position={[0, 0.1 + ch / 2, 0]} castShadow receiveShadow />
        <mesh geometry={roundedBox(cw + 0.05, 0.06, cd + 0.05, 0.02, 2)} material={mats.dark} position={[0, 0.1 + ch + 0.02, 0]} castShadow />
        <mesh geometry={roundedCylinder(R + 0.035, 0.05, 0.012, 48)} material={mats.ring} position={[0, ROW.dial.y, face + 0.01]} rotation={[Math.PI / 2, 0, 0]} />
        <mesh material={mats.dial} position={[0, ROW.dial.y, face + 0.037]}>
          <circleGeometry args={[R, 48]} />
        </mesh>
        <group position={[0, ROW.dial.y, face + 0.041]} rotation={[0, 0, -a]}>
          <mesh material={mats.ink} position={[0, R * 0.38, 0]}>
            <planeGeometry args={[0.016, R * 0.92]} />
          </mesh>
        </group>
        <mesh material={mats.ink} position={[0, ROW.dial.y, face + 0.044]}>
          <circleGeometry args={[0.022, 20]} />
        </mesh>
        <mesh material={mats.glass} position={[0, ROW.dial.y, face + 0.06]}>
          <circleGeometry args={[R + 0.01, 48]} />
        </mesh>
        {/* a small dark latch and the conduit down to the ground */}
        <mesh geometry={roundedBox(0.05, 0.12, 0.03, 0.01, 2)} material={mats.dark} position={[cw / 2 - 0.08, 0.75, face + 0.01]} />
      </group>
      {/* the peak pointer: a short orange hand riding the dial's rim, bloomed (§ 5), in front of the glass */}
      {peakGlow > 0.003 ? (
        <>
          <GlowSegment
            a={meterPoint([Math.sin(pa) * R * 0.55, ROW.dial.y + Math.cos(pa) * R * 0.55, face + 0.07])}
            b={meterPoint([Math.sin(pa) * R * 0.97, ROW.dial.y + Math.cos(pa) * R * 0.97, face + 0.07])}
            radius={glowR}
            glow={peakGlow}
          />
          <GlowNode at={meterPoint([Math.sin(pa) * R * 0.97, ROW.dial.y + Math.cos(pa) * R * 0.97, face + 0.07])} radius={glowR * 1.6} glow={peakGlow} />
        </>
      ) : null}
    </group>
  );
};

// ---------------------------------------------------------------- the feed and the fee

export type RowFeedProps = {
  /** The posts' x (each gets a node dot under it). */
  posts: number[];
  /** Which node dots carry a landed fee piece (orange, the § 5 Trace), and how bright (0 → 1). */
  lit: boolean[];
  litGlow: number;
  /** The glow's core radius (scaled with the camera by the scene); the feed's tube is drawn at this radius too. */
  glowR: number;
};

/** The feed on the cut face (neutral grey) from the meter to post 1, a riser at the meter, node dots under the posts. */
export const RowFeed: React.FC<RowFeedProps> = ({posts, lit, litGlow, glowR}) => {
  const mats = useMemo(
    () => ({
      feed: new THREE.MeshStandardMaterial({color: raw(PLUGS.feed), roughness: 0.6}),
      dot: new THREE.MeshStandardMaterial({color: raw(PLUGS.feed), roughness: 0.5}),
    }),
    [],
  );
  const F = ROW.faceZ;
  const y = ROW.feedY;
  const xm = ROW.meter[0];
  const x0 = Math.min(...posts);
  const r = Math.max(0.012, glowR * 0.9);
  return (
    <group>
      <mesh material={mats.feed} position={[(x0 + xm) / 2, y, F]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[r, r, xm - x0, 10]} />
      </mesh>
      <mesh material={mats.feed} position={[xm, (y + 0) / 2, F]}>
        <cylinderGeometry args={[r, r, -y, 10]} />
      </mesh>
      {posts.map((x, i) => (
        <group key={i}>
          <mesh material={mats.dot} position={[x, y, F]}>
            <sphereGeometry args={[r * 2.1, 16, 12]} />
          </mesh>
          {lit[i] ? <GlowNode at={[x, y, F + 0.01]} radius={r * 2.4} glow={litGlow} /> : null}
        </group>
      ))}
    </group>
  );
};

export type FeePiecesProps = {
  pieces: {at: V3; w: number}[];
  glow: number;
  /** The slab's whole width (m); each piece is its share of it. Default 1.5. */
  width?: number;
};

/** The fee slab and its pieces: orange cores with a 25% halo, bloomed. */
export const FeePieces: React.FC<FeePiecesProps> = ({pieces, glow, width = 1.5}) => {
  const mats = useMemo(
    () => ({
      core: new THREE.MeshBasicMaterial({color: raw(section.orange), transparent: true, fog: false}),
      halo: new THREE.MeshBasicMaterial({color: raw(section.orange), transparent: true, depthWrite: false, fog: false}),
    }),
    [],
  );
  const g = Math.max(0, Math.min(1, glow));
  mats.core.opacity = g;
  mats.halo.opacity = 0.25 * g;
  if (g < 0.003) return null;
  return (
    <group>
      {pieces.map((p, i) => {
        const w = Math.max(0.12, width * p.w * (pieces.length > 1 ? 0.86 : 1));
        return (
          <group key={i} position={p.at}>
            <mesh material={mats.core} userData={{glow: true}} renderOrder={4}>
              <boxGeometry args={[w, 0.26, 0.14]} />
            </mesh>
            <mesh material={mats.halo} userData={{glow: true}} renderOrder={5}>
              <boxGeometry args={[w + 0.16, 0.42, 0.3]} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

/** White reversing lamps on a cut car's tail (car group frame: the car faces −x, its tail at +x). Flat, never bloomed. */
export const ReverseLamps: React.FC<{on: number; mood: Mood}> = ({on, mood}) => {
  const m = MOODS[mood];
  const mat = useMemo(() => new THREE.MeshStandardMaterial({color: raw(HIGHWAY.lineWhite), emissive: raw('#ffffff'), roughness: 0.3}), []);
  mat.emissiveIntensity = (1.4 * Math.max(0, Math.min(1, on))) / m.exposure;
  if (on < 0.02) return null;
  return (
    <group>
      {[-0.56, 0.56].map((z) => (
        <mesh key={z} material={mat} position={[2.425, 0.86, z]}>
          <boxGeometry args={[0.014, 0.05, 0.13]} />
        </mesh>
      ))}
    </group>
  );
};
