import React, {useMemo} from 'react';
import * as THREE from 'three';
import {fonts} from '../../fonts';
import {LAB, REAL, type Mood} from '../../theme';
import {ease} from '../../scenes/keyframes';
import {raw, roundedBox} from '../plaster';
import {RealWheel} from '../real/RealWheel';
import {applyEnv, useEnvStrength, useStudioEnv} from '../real/useStudioEnv';
import {Figure} from './Figure';
import {SLICE} from './LivingRoomSlice';
import {useFontsLoaded} from './useFontsLoaded';

type V3 = [number, number, number];

/** One row of the bay: its set-panel label, which wheels (0–7) go low, and when (s into the scene). */
export type TireBayRow = {label: string; low: number[]; lowAt: number};

export type TireBayProps = {
  /** Up to two rows, top shelf first. Default: "WITHOUT THE WARNING" (2 of 8 low) over "WITH THE WARNING" (1 of 8). 🎭 illustrative. */
  rows: TireBayRow[];
  /** Seconds into the scene when the two extras bring their gauges to the valves (default 0.4); null: they don't. */
  gaugeAt: number | null;
  /** How low a low tire goes (default 0.7: visibly soft). */
  lowPressure: number;
};

export const TIRE_BAY = {
  /** Shelf board heights (top row first), the rack's depth and centre. */
  shelves: [1.64, 1.0],
  z: SLICE.z0 + 0.3,
  depth: 0.44,
  cx: -0.2,
  width: 2.56,
  wheelR: 0.135,
  x: (i: number) => -1.25 + i * 0.3,
};

/** The default rows (the 🎭 2-of-8 vs 1-of-8 picture). Sagging off until a scene asks (`lowAt` Infinity). */
export const DEFAULT_ROWS: TireBayRow[] = [
  {label: 'WITHOUT THE WARNING', low: [2, 6], lowAt: Infinity},
  {label: 'WITH THE WARNING', low: [4], lowAt: Infinity},
];

const B = TIRE_BAY;

/** A set panel with a label (the Lab's dark panel, its ink), drawn once the fonts are in. */
const Panel: React.FC<{text: string; position: V3; size: [number, number]; mood: Mood}> = ({text, position, size, mood}) => {
  const ready = useFontsLoaded();
  const lab = LAB[mood];
  const tex = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 1024;
    c.height = Math.round((1024 * size[1]) / size[0]);
    const t = new THREE.CanvasTexture(c);
    t.anisotropy = 8;
    return {c, t, key: '', mat: new THREE.MeshBasicMaterial({map: t})};
  }, [size]);
  if (ready && tex.key !== `${text}|${mood}`) {
    const cx = tex.c.getContext('2d')!;
    const {width: w, height: h} = tex.c;
    cx.fillStyle = lab.panel;
    cx.fillRect(0, 0, w, h);
    cx.fillStyle = lab.panelInk;
    cx.font = `700 ${Math.round(h * 0.56)}px ${fonts.sans}, Arial`;
    cx.textAlign = 'center';
    cx.textBaseline = 'middle';
    cx.fillText(text, w / 2, h * 0.54, w - 40);
    tex.t.needsUpdate = true;
    tex.key = `${text}|${mood}`;
  }
  return (
    <group position={position}>
      <mesh geometry={roundedBox(size[0] + 0.05, size[1] + 0.05, 0.03, 0.008)} material={useMemo(() => new THREE.MeshStandardMaterial({color: raw(lab.panel), roughness: 0.6}), [lab.panel])} />
      <mesh position={[0, 0, 0.017]} material={tex.mat} visible={ready}>
        <planeGeometry args={size} />
      </mesh>
    </group>
  );
};

/**
 * The Lab dressed as a tire bay (No. 002, "when US safety officials checked mid-2000s cars"): a steel
 * rack on the back wall with two shelves of eight wheels standing on edge (each standing for one car),
 * a set panel over each row, and two grey extras on stools pressing gauges to the valves. Wheels in a
 * row go soft on cue (the 🎭 2-of-8 vs 1-of-8 picture). Neutral; nothing here is the system.
 */
export const TireBay: React.FC<{mood: Mood; t: number} & Partial<TireBayProps>> = ({
  mood,
  t,
  rows = DEFAULT_ROWS,
  gaugeAt = 0.4,
  lowPressure = 0.55,
}) => {
  const env = useStudioEnv();
  const envScale = useEnvStrength();
  const mats = useMemo(
    () => ({
      steel: new THREE.MeshPhysicalMaterial({color: raw(REAL.steel), metalness: 1, roughness: 0.38}),
      board: new THREE.MeshPhysicalMaterial({color: raw(REAL.alu), metalness: 0.6, roughness: 0.45}),
      stool: new THREE.MeshStandardMaterial({color: raw(REAL.labDark), roughness: 0.5}),
      gauge: new THREE.MeshPhysicalMaterial({color: raw(REAL.chuck), metalness: 1, roughness: 0.3}),
    }),
    [],
  );
  applyEnv(
    env,
    [
      [mats.steel, 0.8],
      [mats.board, 0.6],
      [mats.gauge, 1],
    ],
    envScale,
  );
  const W = B.width;
  // the two extras: one on a low stool at the bottom row, one on a tall stool at the top row
  const reach = gaugeAt === null ? 0 : ease(t, gaugeAt, gaugeAt + 0.8);
  // at the two ends of the rack, turned in toward the end wheels, so they never cover the rows
  const extras = [
    {pos: [-1.38, 0.18, -0.22] as V3, row: 1, wheel: 0, seed: 'bay-a'},
    {pos: [1.42, 0.8, -0.42] as V3, row: 0, wheel: 7, seed: 'bay-b'},
  ];
  return (
    <group>
      {/* the rack: posts and two shelf boards */}
      {[B.cx - W / 2, B.cx + W / 2].flatMap((x) =>
        [-1, 1].map((s) => (
          <mesh key={`${x}${s}`} position={[x, 1.0, B.z + (s * B.depth) / 2]} material={mats.steel} castShadow>
            <boxGeometry args={[0.04, 2.0, 0.04]} />
          </mesh>
        )),
      )}
      {B.shelves.map((y, i) => (
        <mesh key={i} geometry={roundedBox(W + 0.06, 0.035, B.depth, 0.006)} material={mats.board} position={[B.cx, y, B.z]} castShadow receiveShadow />
      ))}
      {rows.slice(0, 2).map((row, r) => {
        const y = B.shelves[r] + 0.018 + B.wheelR;
        return (
          <group key={r}>
            {[...Array(8).keys()].map((i) => {
              const low = row.low.includes(i);
              const k = low && Number.isFinite(row.lowAt) ? ease(t, row.lowAt, row.lowAt + 1.0) : 0;
              return (
                <RealWheel
                  key={i}
                  mood={mood}
                  position={[B.x(i), y, B.z + B.depth / 2 - 0.08]}
                  grounded
                  yaw={-Math.PI / 2}
                  radius={B.wheelR}
                  cut="none"
                  spin={0.6 + i * 1.3}
                  pressure={1 - (1 - lowPressure) * k}
                  low
                  ink={false}
                />
              );
            })}
            {/* the row's label: a strip hanging from the shelf's front edge, under its wheels */}
            <Panel text={row.label} mood={mood} position={[B.cx, B.shelves[r] - 0.085, B.z + B.depth / 2 + 0.02]} size={[1.3, 0.11]} />
          </group>
        );
      })}
      {extras.map((e) => {
        const wheelPos: V3 = [B.x(e.wheel), B.shelves[e.row] + 0.018 + B.wheelR, B.z + B.depth / 2 - 0.08];
        const valve: V3 = [wheelPos[0] + 0.02, wheelPos[1] + 0.05, B.z + B.depth / 2 - 0.02];
        const rot = Math.atan2(wheelPos[0] - e.pos[0], wheelPos[2] - e.pos[2]);
        // world → figure-local (the figure turned `rot` about y)
        const local = (p: V3): V3 => {
          const v = new THREE.Vector3(p[0] - e.pos[0], p[1] - e.pos[1], p[2] - e.pos[2]).applyAxisAngle(new THREE.Vector3(0, 1, 0), -rot);
          return [v.x, v.y, v.z];
        };
        const rest: V3[] = [
          [-0.12, 0.78, 0.3],
          [0.12, 0.78, 0.3],
        ];
        const target: V3[] = [local([valve[0] + 0.05, valve[1], valve[2] + 0.06]), local([wheelPos[0] - 0.08, wheelPos[1] + 0.14, B.z + 0.06])];
        const hands = [0, 1].map((h) => rest[h].map((v, j) => v + (target[h][j] - v) * reach) as V3) as [V3, V3];
        const g0 = new THREE.Vector3(...hands[0]).applyAxisAngle(new THREE.Vector3(0, 1, 0), rot).add(new THREE.Vector3(...e.pos));
        const g1 = new THREE.Vector3(...valve);
        const gd = g1.clone().sub(g0);
        return (
          <group key={e.seed}>
            <Figure
              who="extra"
              mood={mood}
              position={e.pos}
              rotationY={rot}
              seed={e.seed}
              phone={false}
              hands={hands}
              gestures={[{pose: 'gauge', at: gaugeAt ?? 99, blend: 0.8}]}
            />
            {/* the stool */}
            <mesh position={[e.pos[0] - 0.1 * Math.sin(rot), e.pos[1] + 0.535, e.pos[2] - 0.1 * Math.cos(rot)]} material={mats.stool} castShadow>
              <cylinderGeometry args={[0.2, 0.2, 0.05, 24]} />
            </mesh>
            <mesh position={[e.pos[0] - 0.1 * Math.sin(rot), (e.pos[1] + 0.51) / 2, e.pos[2] - 0.1 * Math.cos(rot)]} material={mats.stool}>
              <cylinderGeometry args={[0.03, 0.05, e.pos[1] + 0.51, 12]} />
            </mesh>
            {/* the gauge: a steel pencil gauge from the hand to the valve */}
            <mesh
              position={g0.clone().addScaledVector(gd, 0.5)}
              quaternion={new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), gd.clone().normalize())}
              material={mats.gauge}
              visible={reach > 0.05}
              castShadow
            >
              <cylinderGeometry args={[0.012, 0.012, Math.max(0.01, gd.length()), 12]} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};
