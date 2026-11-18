import React, {useEffect, useMemo} from 'react';
import {random} from 'remotion';
import * as THREE from 'three';
import {CAST_NEUTRAL, LAB, MOODS, section, type Mood} from '../../theme';
import {BlobShadow} from '../MuseumStage';
import {raw, roundedBox} from '../plaster';
import {Figure} from './Figure';
import {SLICE} from './LivingRoomSlice';
import {CupConsole, CupPhone} from '../real/CarPhoneKit';
import {metresPerPx} from '../real/inkStrokes';
import {REAL_PHONE} from '../real/RealPhone';
import type {SensorLanesKeys} from '../real/SensorLanes';

type V3 = [number, number, number];

/*
 * No. 020 (`crash-detect`, N8): The Lab dressed as a crash-data room. On the back wall a dark panel (`device`) holding a
 * grid of small trace tiles, each four mini lanes in ink-light (quiet driving); on `waveAt` a seeded set of crash tiles
 * light in a wave left to right (their four lanes spike together; an orange halo only, ≤ 25 %). One researcher on a stool
 * at a laptop (lid toward them), typing, leaning in. On the bench a cut centre console with the same generic phone in its
 * cupholder, opened, its four sensor lanes (N3) lighting once on `benchAt`. No sled, no crash, no dummy; nothing readable.
 */

const {z0: Z0} = SLICE;

/** The wall panel and its tile grid (m). */
export const CRASH_WALL = {centre: [-0.25, 1.9, Z0 + 0.012] as V3, panel: [2.4, 1.4] as [number, number], cols: 20, rows: 12, grid: [2.2, 1.2] as [number, number]};
const BENCH = {x: -0.25, y: 0.76, z: -0.28, w: 2.8, d: 0.6};
const SEAT_X = -1.15;
/** The bench phone's place (on the console on the bench, right of centre) and its height (the cupholder phone's 🎭 0.22 m). */
const PHONE = {x: 0.55, h: 0.22};

export type CrashDataProps = {
  mood: Mood;
  t: number;
  clock?: number;
  /** The crash tiles light in a wave over `waveFor` (default 1.2 s) from here (s); null: quiet. Negative: already lit. */
  waveAt?: number | null;
  waveFor?: number;
  /** How many crash tiles (seeded, default 30). */
  crashTiles?: number;
  /** The bench phone's lanes all catch their signs and the agree node lights (s); null: they stay quiet. */
  benchAt?: number | null;
  /** The researcher types (default true) and leans in at `leanAt` (held 1.2 s). */
  typing?: boolean;
  leanAt?: number | null;
  /** The camera's distance (m), so the lanes keep their on-screen weight. Default 12.75. */
  cameraDistance?: number;
};

/** The crash tiles: a seeded set of tile indices, each with its place in the wave (0 → 1 across). */
const crashSet = (n: number) => {
  const W = CRASH_WALL;
  const out: {i: number; j: number; u: number}[] = [];
  for (let k = 0; out.length < n && k < 2000; k++) {
    const i = Math.floor(random(`crash-tile-i-${k}`) * W.cols);
    const j = Math.floor(random(`crash-tile-j-${k}`) * W.rows);
    if (out.some((o) => o.i === i && o.j === j)) continue;
    out.push({i, j, u: (i + random(`crash-tile-u-${k}`) * 0.8) / W.cols});
  }
  return out;
};

/** N8: the crash-data dressing (see the file comment). */
export const CrashData: React.FC<CrashDataProps> = (p) => {
  const {mood, t} = p;
  const clock = p.clock ?? t;
  const m = MOODS[mood];
  const lab = LAB[mood];
  const W = CRASH_WALL;
  const tiles = useMemo(() => crashSet(p.crashTiles ?? 30), [p.crashTiles]);
  const wf = p.waveFor ?? 1.2;
  const front = p.waveAt == null ? -1 : (t - p.waveAt) / wf;
  const litK = (u: number) => Math.max(0, Math.min(1, (front - u) / 0.12));
  // the wall texture: quiet mini lanes in every tile; a lit crash tile's lanes spike together (ink-light)
  const PX = 64;
  const tw = W.cols * PX;
  const th = W.rows * Math.round(PX * (W.grid[1] / W.rows) / (W.grid[0] / W.cols));
  const tex = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = tw;
    c.height = th;
    const tx = new THREE.CanvasTexture(c);
    tx.colorSpace = THREE.SRGBColorSpace;
    tx.anisotropy = 8;
    return {c, tx, key: ''};
  }, [tw, th]);
  useEffect(() => () => tex.tx.dispose(), [tex]);
  const litCount = tiles.filter((o) => litK(o.u) > 0.5).length;
  const key = `${litCount}|${mood}`;
  if (tex.key !== key) {
    const cx = tex.c.getContext('2d')!;
    const ch = th / W.rows;
    cx.fillStyle = m.device;
    cx.fillRect(0, 0, tw, th);
    const lit = new Set(tiles.filter((o) => litK(o.u) > 0.5).map((o) => `${o.i},${o.j}`));
    for (let i = 0; i < W.cols; i++) {
      for (let j = 0; j < W.rows; j++) {
        const x0 = i * PX + 5;
        const y0 = j * ch + 4;
        const w = PX - 10;
        const h = ch - 8;
        cx.fillStyle = section.ledOff;
        cx.fillRect(x0, y0, w, h);
        const crash = lit.has(`${i},${j}`);
        cx.strokeStyle = section.cut;
        cx.lineWidth = 1.4;
        cx.globalAlpha = crash ? 1 : 0.75;
        for (let l = 0; l < 4; l++) {
          const y = y0 + (h * (l + 0.5)) / 4;
          cx.beginPath();
          for (let s = 0; s <= 24; s++) {
            const x = x0 + 3 + ((w - 6) * s) / 24;
            const q = random(`lane-${i}-${j}-${l}-${s}`) - 0.5;
            const spike = crash && s === 16 ? -h / 8.5 : crash && s === 17 ? h / 14 : 0;
            const v = q * h * 0.03 + spike;
            if (s === 0) cx.moveTo(x, y + v);
            else cx.lineTo(x, y + v);
          }
          cx.stroke();
        }
        cx.globalAlpha = 1;
      }
    }
    tex.tx.needsUpdate = true;
    tex.key = key;
  }
  const mats = useMemo(
    () => ({
      panel: new THREE.MeshStandardMaterial({color: raw(m.device), roughness: 0.6}),
      grid: new THREE.MeshBasicMaterial({map: tex.tx}),
      halo: new THREE.MeshBasicMaterial({color: raw(section.orange), transparent: true, depthWrite: false, fog: false, opacity: 0.25}),
      bench: new THREE.MeshStandardMaterial({color: raw(lab.bench), roughness: 0.8}),
      leg: new THREE.MeshStandardMaterial({color: raw(m.device), roughness: 0.5}),
      laptop: new THREE.MeshStandardMaterial({color: raw(lab.rig), roughness: 0.45, metalness: 0.3}),
      stool: new THREE.MeshStandardMaterial({color: raw(lab.joint), roughness: 0.6}),
    }),
    [m.device, lab, tex.tx],
  );
  useEffect(() => () => Object.values(mats).forEach((q) => q.dispose()), [mats]);
  mats.grid.color.setScalar(1 / m.exposure);
  const laptopLid = useMemo(() => roundedBox(0.34, 0.22, 0.012, 0.005), []);
  const laptopBase = useMemo(() => roundedBox(0.34, 0.016, 0.24, 0.005), []);
  useEffect(() => () => [laptopLid, laptopBase].forEach((g) => g.dispose()), [laptopLid, laptopBase]);
  const cw = W.grid[0] / W.cols;
  const chh = W.grid[1] / W.rows;
  const tap = (h: number) =>
    p.typing === false ? 0 : 0.012 * Math.max(0, Math.sin(clock * (11 + 2 * h) + random(`crash-tap-${h}`) * 6));
  // the bench phone: on a short cut console section, its board toward the camera
  const b = p.benchAt ?? null;
  const lanes: SensorLanesKeys | null =
    b === null
      ? {mic: {onAt: -10}}
      : {mic: {onAt: -10, burstAt: b}, motion: {spikeAt: b}, gps: {cliffAt: b - 0.48, signAt: b}, baro: {bumpAt: b}, agreeAt: b + 0.3, scroll: 0.3};
  const cupY = BENCH.y + 0.02 + 0.2;
  const yaw = Math.atan2(0.44, 0.85);
  const q = useMemo(() => new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), yaw), [yaw]);
  const camD = p.cameraDistance ?? 12.75;
  return (
    <group>
      {/* the panel and its tiles */}
      <mesh geometry={roundedBox(W.panel[0], W.panel[1], 0.04, 0.01)} material={mats.panel} position={[W.centre[0], W.centre[1], W.centre[2] + 0.005]} />
      <mesh material={mats.grid} position={[W.centre[0], W.centre[1], W.centre[2] + 0.027]}>
        <planeGeometry args={W.grid} />
      </mesh>
      {tiles.map((o, k) => {
        const a = litK(o.u);
        if (a <= 0.01) return null;
        const x = W.centre[0] - W.grid[0] / 2 + (o.i + 0.5) * cw;
        const y = W.centre[1] + W.grid[1] / 2 - (o.j + 0.5) * chh;
        return (
          <mesh key={k} material={mats.halo} position={[x, y, W.centre[2] + 0.032]} scale={[cw * 1.1 * a, chh * 1.1 * a, 1]} userData={{glow: true}} renderOrder={5}>
            <planeGeometry args={[1, 1]} />
          </mesh>
        );
      })}
      {/* the bench */}
      <mesh geometry={roundedBox(BENCH.w, 0.04, BENCH.d, 0.01)} material={mats.bench} position={[BENCH.x, BENCH.y, BENCH.z]} castShadow receiveShadow />
      {[-1, 1].flatMap((sx) =>
        [-1, 1].map((sz) => (
          <mesh key={`${sx}${sz}`} material={mats.leg} position={[BENCH.x + sx * (BENCH.w / 2 - 0.06), BENCH.y / 2, BENCH.z + sz * (BENCH.d / 2 - 0.05)]} castShadow>
            <boxGeometry args={[0.04, BENCH.y, 0.04]} />
          </mesh>
        )),
      )}
      <BlobShadow position={[BENCH.x, 0.004, BENCH.z]} size={[3.0, 1.0]} opacity={0.3} />
      {/* the console section and the phone, opened */}
      <group position={[PHONE.x, 0, BENCH.z + 0.05]} rotation={[0, Math.PI / 2, 0]}>
        <CupConsole cup={[0, cupY, 0]} back={-0.25} front={0.2} floor={BENCH.y + 0.02} />
      </group>
      <CupPhone
        mood={mood}
        position={[PHONE.x, cupY + PHONE.h / 2 - 0.05, BENCH.z + 0.05]}
        quaternion={q}
        height={PHONE.h}
        screen={0}
        open={1}
        sensors
        lanes={lanes ? {keys: lanes, t, unitPerPx: metresPerPx(camD) / (PHONE.h / REAL_PHONE.h)} : undefined}
      />
      {/* the researcher at a laptop (its lid toward them) */}
      <mesh material={mats.stool} position={[SEAT_X, 0.53, BENCH.z - BENCH.d / 2 - 0.3]} castShadow>
        <cylinderGeometry args={[0.19, 0.19, 0.05, 20]} />
      </mesh>
      <mesh material={mats.leg} position={[SEAT_X, 0.26, BENCH.z - BENCH.d / 2 - 0.3]}>
        <cylinderGeometry args={[0.025, 0.03, 0.5, 10]} />
      </mesh>
      <group position={[SEAT_X, BENCH.y + 0.02, BENCH.z - 0.06]}>
        <mesh geometry={laptopBase} material={mats.laptop} position={[0, 0.008, 0]} castShadow />
        <group position={[0, 0.016, 0.12]} rotation={[0.25, 0, 0]}>
          <mesh geometry={laptopLid} material={mats.laptop} position={[0, 0.11, 0]} castShadow />
        </group>
      </group>
      <Figure
        who="extra"
        look={CAST_NEUTRAL}
        mood={mood}
        position={[SEAT_X, 0, BENCH.z - BENCH.d / 2 - 0.3]}
        rotationY={0}
        seed="crash-data-a"
        phone={false}
        hands={[
          [-0.1, BENCH.y + 0.04 + tap(0), 0.44],
          [0.1, BENCH.y + 0.04 + tap(1), 0.44],
        ]}
        gestures={[
          {pose: 'glance-down', at: -1, blend: 0.4},
          ...(p.leanAt == null ? [] : [{pose: 'lean-in' as const, at: p.leanAt, hold: 1.2, blend: 0.4}]),
        ]}
        clockOffset={clock - t}
      />
    </group>
  );
};
