import React, {useMemo} from 'react';
import * as THREE from 'three';
import {fonts} from '../../fonts';
import {LAB, REAL, section, type Mood} from '../../theme';
import {ease} from '../../scenes/keyframes';
import {raw, roundedBox} from '../plaster';
import {RealWheel, WHEEL, wheelPoint} from '../real/RealWheel';
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
  shelves: [1.62, 1.0],
  z: SLICE.z0 + 0.3,
  depth: 0.5,
  cx: -0.52,
  width: 2.3,
  /** Wheel radius: as big as two rows of eight fit the Lab's back wall (≈ 57% of a real 17", vs 43% before). */
  wheelR: 0.18,
  x: (i: number) => -1.5 + i * 0.28,
  /**
   * Each wheel turned so its face is square to the camera across the floor (the camera sits ≈ 28°
   * to the right of the cut face): neighbours overlap a little, like tires in a shop rack, without
   * touching (their mid-planes are 0.13 apart, the tire 0.12 wide).
   */
  yaw: -1.08,
};

/** The default rows (the 🎭 2-of-8 vs 1-of-8 picture). Sagging off until a scene asks (`lowAt` Infinity). */
export const DEFAULT_ROWS: TireBayRow[] = [
  {label: 'WITHOUT THE WARNING', low: [2, 5], lowAt: Infinity},
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

/** Where a wheel's valve cap is (world) for a wheel at `p` turned to the camera, at valve angle φ. */
const valveAt = (p: V3, phi: number, radius: number): V3 => wheelPoint({position: p, yaw: B.yaw, radius}, WHEEL.cap[0] + 0.03, WHEEL.cap[1], phi);

/** The valve angle the extras' wheels are turned to: lower right, toward the extra (φ from the top, + toward screen left). */
const VALVE_PHI = -Math.PI / 2 - 0.35;

/**
 * The Lab dressed as a tire bay (No. 002, "when US safety officials checked mid-2000s cars"): a steel
 * rack on the back wall with two shelves of eight wheels (each standing for one car), a set panel
 * under each row, and two grey extras checking pressures with pencil gauges: one seated on a low
 * stool at the bottom row's left end, one standing at the top row's right end, both turned in to
 * the rack. Wheels in a row go soft on cue (the 🎭 2-of-8 vs 1-of-8 picture): the tire sags, the rim
 * drops, and a small readout tag lights in warning yellow (a gauge readout: flat, never orange).
 * Neutral; nothing here is the system.
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
      bezel: new THREE.MeshStandardMaterial({color: raw(REAL.labDark), roughness: 0.5}),
      readout: new THREE.MeshBasicMaterial({color: raw(section.warning)}),
      cord: new THREE.MeshStandardMaterial({color: raw(REAL.cable), roughness: 0.8}),
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
  const R = B.wheelR;
  const reach = gaugeAt === null ? 0 : ease(t, gaugeAt, gaugeAt + 0.8);
  const wheelY = (r: number) => B.shelves[r] + 0.018 + R;
  const wheelZ = B.z + 0.02;
  // each wheel's spin: varied, but the two the extras check have the valve toward them
  const spinOf = (r: number, i: number) => ((r === 1 && i === 1) || (r === 0 && i === 7) ? VALVE_PHI - WHEEL.valveBase : 0.6 + i * 1.3 + r * 0.7);
  // the extras: one seated low at the bottom row's left end, one standing at the top row's right end
  const extras = [
    {pos: [-1.05, 0, -0.2] as V3, row: 1, wheel: 1, seed: 'bay-a', stance: 'sit' as const},
    {pos: [0.8, 0, -0.16] as V3, row: 0, wheel: 7, seed: 'bay-b', stance: 'stand' as const},
  ];
  const out = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), B.yaw);
  return (
    <group>
      {/* the rack: posts and two shelf boards */}
      {[B.cx - W / 2, B.cx + W / 2].flatMap((x) =>
        [-1, 1].map((s) => (
          <mesh key={`${x}${s}`} position={[x, 1.1, B.z + (s * B.depth) / 2]} material={mats.steel} castShadow>
            <boxGeometry args={[0.04, 2.2, 0.04]} />
          </mesh>
        )),
      )}
      {B.shelves.map((y, i) => (
        <mesh key={i} geometry={roundedBox(W + 0.06, 0.035, B.depth, 0.006)} material={mats.board} position={[B.cx, y, B.z]} castShadow receiveShadow />
      ))}
      {rows.slice(0, 2).map((row, r) => (
        <group key={r}>
          {[...Array(8).keys()].map((i) => {
            const low = row.low.includes(i);
            const k = low && Number.isFinite(row.lowAt) ? ease(t, row.lowAt, row.lowAt + 1.0) : 0;
            const p: V3 = [B.x(i), wheelY(r), wheelZ];
            // the readout tag: hangs from the tire's top on the face toward the camera, lights as it sags
            const top = new THREE.Vector3(p[0], p[1] + R * 0.98, p[2]).addScaledVector(out, 0.075);
            return (
              <group key={i}>
                <RealWheel
                  mood={mood}
                  position={p}
                  grounded
                  yaw={B.yaw}
                  radius={R}
                  cut="none"
                  spin={spinOf(r, i)}
                  pressure={1 - (1 - lowPressure) * k}
                  low
                  ink={false}
                />
                {low && k > 0.01 ? (
                  <group position={top} rotation={[0, B.yaw + Math.PI / 2, 0]} scale={0.6 + 0.4 * k}>
                    <mesh position={[0, -0.03, 0]} material={mats.cord}>
                      <cylinderGeometry args={[0.003, 0.003, 0.06, 6]} />
                    </mesh>
                    <mesh position={[0, -0.095, 0]} geometry={roundedBox(0.1, 0.075, 0.012, 0.006)} material={mats.bezel} castShadow />
                    <mesh position={[0, -0.095, 0.0065]} material={mats.readout}>
                      <planeGeometry args={[0.078, 0.052]} />
                    </mesh>
                  </group>
                ) : null}
              </group>
            );
          })}
          {/* the row's label: a strip hanging from the shelf's front edge, under its wheels */}
          <Panel text={row.label} mood={mood} position={[B.cx, B.shelves[r] - 0.085, B.z + B.depth / 2 + 0.02]} size={[1.3, 0.11]} />
        </group>
      ))}
      {extras.map((e) => {
        const wp: V3 = [B.x(e.wheel), wheelY(e.row), wheelZ];
        const valve = valveAt(wp, VALVE_PHI, R);
        const rot = Math.atan2(wp[0] - e.pos[0], wp[2] - e.pos[2]);
        // world → figure-local (the figure turned `rot` about y)
        const local = (p: V3): V3 => {
          const v = new THREE.Vector3(p[0] - e.pos[0], p[1] - e.pos[1], p[2] - e.pos[2]).applyAxisAngle(new THREE.Vector3(0, 1, 0), -rot);
          return [v.x, v.y, v.z];
        };
        const lift = e.stance === 'stand' ? 0.47 : 0;
        const rest: V3[] = [
          [-0.12, 0.78 + lift, 0.3],
          [0.12, 0.78 + lift, 0.3],
        ];
        // the gauge hand a little short of the valve (the gauge spans the gap), the other hand steadying
        // the tire on its sidewall just above (both hands where the extra is looking)
        const hold = new THREE.Vector3(...valve).addScaledVector(out, 0.1).add(new THREE.Vector3(0.06, -0.04, 0));
        const steady = new THREE.Vector3(wp[0] + R * 0.35, wp[1] + R * 0.45, wp[2]).addScaledVector(out, 0.09);
        const target: V3[] = [local([hold.x, hold.y, hold.z]), local([steady.x, steady.y, steady.z])];
        const hands = [0, 1].map((h) => rest[h].map((v, j) => v + (target[h][j] - v) * reach) as V3) as [V3, V3];
        const g0 = new THREE.Vector3(...hands[0]).applyAxisAngle(new THREE.Vector3(0, 1, 0), rot).add(new THREE.Vector3(...e.pos));
        const g1 = new THREE.Vector3(...valve);
        const gd = g1.clone().sub(g0);
        const seat = new THREE.Vector3(0, 0, -0.1).applyAxisAngle(new THREE.Vector3(0, 1, 0), rot).add(new THREE.Vector3(...e.pos));
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
              stance={e.stance}
              gestures={[{pose: 'gauge', at: gaugeAt ?? 99, blend: 0.8}]}
            />
            {e.stance === 'sit' ? (
              // a low shop stool on the floor under the seat
              <>
                <mesh position={[seat.x, 0.535, seat.z]} material={mats.stool} castShadow receiveShadow>
                  <cylinderGeometry args={[0.18, 0.18, 0.05, 24]} />
                </mesh>
                <mesh position={[seat.x, 0.26, seat.z]} material={mats.stool} castShadow>
                  <cylinderGeometry args={[0.03, 0.045, 0.51, 12]} />
                </mesh>
                <mesh position={[seat.x, 0.015, seat.z]} material={mats.stool} castShadow receiveShadow>
                  <cylinderGeometry args={[0.2, 0.22, 0.03, 24]} />
                </mesh>
              </>
            ) : null}
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
