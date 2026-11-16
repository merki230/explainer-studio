import React, {useEffect, useMemo} from 'react';
import {random} from 'remotion';
import * as THREE from 'three';
import {CAST_NEUTRAL, EXTRA_B, LAB, MOODS, section, type Mood} from '../../theme';
import {BlobShadow} from '../MuseumStage';
import {raw, roundedBox} from '../plaster';
import {Figure} from './Figure';
import {SLICE} from './LivingRoomSlice';

type V3 = [number, number, number];

/*
 * No. 019 (`light-countdown`, N11): The Lab dressed as a timing check. On the back wall a dark panel (`device`) holding a
 * plain square grid of 100 × 100 cells (never a map outline): unlit (`ledOff`), then lit pale behind an orange wave (the
 * estimates being made: halo only, ≤ 25 %, a soft band sweeping left to right), then resolved in a sweep: ≈ 77 % (seeded)
 * solid ink-light (`cut`, within five seconds), the rest a hollow ink-light outline, which can blink once. Two researchers
 * (an extra and `EXTRA_B`) on stools at the bench's ends, facing the camera, laptops with their lids toward them (the
 * camera sees the lids' backs), typing; one can lean in. Nothing readable.
 */

const {z0: Z0} = SLICE;

/** The panel and its grid (m): the panel 2.4 × 1.6 on the back wall, the grid 1.44 square (cells 14.4 mm). */
export const TIMING_GRID = {centre: [-0.25, 1.88, Z0 + 0.012] as V3, panel: [2.4, 1.6] as [number, number], side: 1.44, n: 100};

/** The bench and the two seats (x of each researcher, facing +z). */
const BENCH = {x: -0.25, y: 0.76, z: -0.28, w: 2.8, d: 0.6};
const SEATS = [-1.2, 0.68];

export type TimingCheckProps = {
  mood: Mood;
  /** Seconds into the scene. */
  t: number;
  /** The video clock (idle life), default `t`. */
  clock?: number;
  /** The orange wave sweeps the grid over `waveFor` s (default 1.8) from `waveAt`; cells light pale behind it. */
  waveAt?: number;
  waveFor?: number;
  /** The cells resolve in a 0.6 s sweep from `resolveAt`: `share` solid (default 0.77, seeded), the rest hollow. */
  resolveAt?: number;
  share?: number;
  /** The hollow cells blink once (0.3 s). */
  blinkAt?: number;
  /** The grid starts lit (after an earlier scene's wave), default false. */
  lit?: boolean;
  /** The researchers type (default true); researcher k leans in to the screen at `leanAt[k]` (s, held 1.2 s). */
  typing?: boolean;
  leanAt?: [number | null, number | null];
};

/** The grid's state at t: the wave front (0 → 1 across), lit share, the resolve front, the blink. */
const gridState = (p: TimingCheckProps) => {
  const {t} = p;
  const wf = p.waveFor ?? 1.8;
  const wave = p.waveAt === undefined ? (p.lit ? 1.2 : -1) : (t - p.waveAt) / wf;
  const resolve = p.resolveAt === undefined ? -1 : (t - p.resolveAt) / 0.6;
  const blink = p.blinkAt !== undefined && t >= p.blinkAt && t <= p.blinkAt + 0.3 ? Math.sin((Math.PI * (t - p.blinkAt)) / 0.3) : 0;
  return {wave, resolve, blink};
};

/** N11: the timing-check dressing (see the file comment). */
export const TimingCheck: React.FC<TimingCheckProps> = (p) => {
  const {mood, t} = p;
  const clock = p.clock ?? t;
  const m = MOODS[mood];
  const lab = LAB[mood];
  const G = TIMING_GRID;
  const st = gridState(p);
  const share = p.share ?? 0.77;
  // the grid texture: redrawn only when a column changes state
  const PX = 7;
  const size = G.n * PX;
  const tex = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = size;
    c.height = size;
    const tx = new THREE.CanvasTexture(c);
    tx.colorSpace = THREE.SRGBColorSpace;
    tx.anisotropy = 8;
    return {c, tx, key: ''};
  }, [size]);
  useEffect(() => () => tex.tx.dispose(), [tex]);
  const litCols = Math.max(0, Math.min(G.n, Math.floor(st.wave * G.n)));
  const resCols = Math.max(0, Math.min(G.n, Math.floor(st.resolve * G.n)));
  const blinkQ = Math.round(st.blink * 10) / 10;
  const key = `${litCols}|${resCols}|${blinkQ}|${share}|${mood}`;
  if (tex.key !== key) {
    const cx = tex.c.getContext('2d')!;
    cx.fillStyle = m.device;
    cx.fillRect(0, 0, size, size);
    for (let i = 0; i < G.n; i++) {
      for (let j = 0; j < G.n; j++) {
        const x = i * PX + 1;
        const y = j * PX + 1;
        const w = PX - 2;
        if (i < resCols) {
          const solid = random(`timing-${i}-${j}`) < share;
          if (solid) {
            cx.fillStyle = section.cut;
            cx.fillRect(x, y, w, w);
          } else {
            cx.globalAlpha = 1 - 0.85 * blinkQ;
            cx.strokeStyle = section.cut;
            cx.lineWidth = 1.2;
            cx.strokeRect(x + 0.6, y + 0.6, w - 1.2, w - 1.2);
            cx.globalAlpha = 1;
          }
        } else if (i < litCols) {
          cx.fillStyle = section.ledOff;
          cx.fillRect(x, y, w, w);
          cx.globalAlpha = 0.55;
          cx.fillStyle = section.cut;
          cx.fillRect(x, y, w, w);
          cx.globalAlpha = 1;
        } else {
          cx.fillStyle = section.ledOff;
          cx.fillRect(x, y, w, w);
        }
      }
    }
    tex.tx.needsUpdate = true;
    tex.key = key;
  }
  const mats = useMemo(
    () => ({
      panel: new THREE.MeshStandardMaterial({color: raw(m.device), roughness: 0.6}),
      grid: new THREE.MeshBasicMaterial({map: tex.tx}),
      wave: new THREE.MeshBasicMaterial({color: raw(section.orange), transparent: true, depthWrite: false, fog: false}),
      bench: new THREE.MeshStandardMaterial({color: raw(lab.bench), roughness: 0.8}),
      leg: new THREE.MeshStandardMaterial({color: raw(m.device), roughness: 0.5}),
      laptop: new THREE.MeshStandardMaterial({color: raw(lab.rig), roughness: 0.45, metalness: 0.3}),
      stool: new THREE.MeshStandardMaterial({color: raw(lab.joint), roughness: 0.6}),
    }),
    [m.device, lab, tex.tx],
  );
  useEffect(() => () => Object.values(mats).forEach((q) => q.dispose()), [mats]);
  mats.grid.color.setScalar(1 / m.exposure);
  // the wave: a soft vertical band (halo only), its alpha a smooth bump peaking at 25 %
  const waveTex = useMemo(() => {
    const d = new Uint8Array(64 * 4);
    for (let i = 0; i < 64; i++) {
      const u = (i + 0.5) / 64;
      const a = Math.pow(Math.sin(Math.PI * u), 2);
      d.set([255, 255, 255, Math.round(255 * a)], i * 4);
    }
    const tx = new THREE.DataTexture(d, 64, 1, THREE.RGBAFormat);
    tx.needsUpdate = true;
    return tx;
  }, []);
  useEffect(() => () => waveTex.dispose(), [waveTex]);
  mats.wave.alphaMap = waveTex;
  mats.wave.opacity = 0.25;
  const showWave = st.wave > -0.05 && st.wave < 1.05;
  const band = 0.32;
  const gx0 = G.centre[0] - G.side / 2;
  const waveX = gx0 + st.wave * G.side;
  // a band clipped to the grid: its visible part only
  const wa = Math.max(gx0, waveX - band / 2);
  const wb = Math.min(gx0 + G.side, waveX + band / 2);
  const laptopLid = useMemo(() => roundedBox(0.34, 0.22, 0.012, 0.005), []);
  const laptopBase = useMemo(() => roundedBox(0.34, 0.016, 0.24, 0.005), []);
  useEffect(() => () => [laptopLid, laptopBase].forEach((g) => g.dispose()), [laptopLid, laptopBase]);
  return (
    <group>
      {/* the panel and its grid */}
      <mesh
        geometry={roundedBox(G.panel[0], G.panel[1], 0.04, 0.01)}
        material={mats.panel}
        position={[G.centre[0], G.centre[1], G.centre[2] + 0.005]}
      />
      <mesh material={mats.grid} position={[G.centre[0], G.centre[1], G.centre[2] + 0.027]}>
        <planeGeometry args={[G.side, G.side]} />
      </mesh>
      {showWave && wb > wa ? (
        <mesh
          material={mats.wave}
          position={[(wa + wb) / 2, G.centre[1], G.centre[2] + 0.032]}
          userData={{glow: true}}
          renderOrder={5}
        >
          <planeGeometry args={[wb - wa, G.side]} />
        </mesh>
      ) : null}
      {/* the bench, its legs and shadow */}
      <mesh
        geometry={roundedBox(BENCH.w, 0.04, BENCH.d, 0.01)}
        material={mats.bench}
        position={[BENCH.x, BENCH.y, BENCH.z]}
        castShadow
        receiveShadow
      />
      {[-1, 1].flatMap((sx) =>
        [-1, 1].map((sz) => (
          <mesh
            key={`${sx}${sz}`}
            material={mats.leg}
            position={[BENCH.x + sx * (BENCH.w / 2 - 0.06), BENCH.y / 2, BENCH.z + sz * (BENCH.d / 2 - 0.05)]}
            castShadow
          >
            <boxGeometry args={[0.04, BENCH.y, 0.04]} />
          </mesh>
        )),
      )}
      <BlobShadow position={[BENCH.x, 0.004, BENCH.z]} size={[3.0, 1.0]} opacity={0.3} />
      {SEATS.map((x, k) => {
        const fz = BENCH.z - BENCH.d / 2 - 0.3;
        // typing: small seeded taps of each hand on the keyboard
        const tap = (h: number) =>
          p.typing === false ? 0 : 0.012 * Math.max(0, Math.sin(clock * (11 + 2 * h + k) + random(`tap-${k}-${h}`) * 6));
        const lean = p.leanAt?.[k];
        return (
          <group key={k}>
            {/* the stool */}
            <mesh material={mats.stool} position={[x, 0.53, fz]} castShadow>
              <cylinderGeometry args={[0.19, 0.19, 0.05, 20]} />
            </mesh>
            <mesh material={mats.leg} position={[x, 0.26, fz]}>
              <cylinderGeometry args={[0.025, 0.03, 0.5, 10]} />
            </mesh>
            {/* the laptop: the base on the bench, the lid up toward its owner (the camera sees its back) */}
            <group position={[x, BENCH.y + 0.02, BENCH.z - 0.06]}>
              <mesh geometry={laptopBase} material={mats.laptop} position={[0, 0.008, 0]} castShadow />
              <group position={[0, 0.016, 0.12]} rotation={[0.25, 0, 0]}>
                <mesh geometry={laptopLid} material={mats.laptop} position={[0, 0.11, 0]} castShadow />
              </group>
            </group>
            <Figure
              who="extra"
              look={k === 0 ? CAST_NEUTRAL : {...CAST_NEUTRAL, ...EXTRA_B}}
              mood={mood}
              position={[x, 0, fz]}
              rotationY={0}
              seed={k === 0 ? 'timing-a' : 'timing-b'}
              phone={false}
              hands={[
                [-0.1, BENCH.y + 0.04 + tap(0), 0.44],
                [0.1, BENCH.y + 0.04 + tap(1), 0.44],
              ]}
              gestures={[
                {pose: 'glance-down', at: -1, blend: 0.4},
                ...(lean === null || lean === undefined ? [] : [{pose: 'lean-in' as const, at: lean, hold: 1.2, blend: 0.4}]),
              ]}
              clockOffset={clock - t}
            />
          </group>
        );
      })}
    </group>
  );
};
