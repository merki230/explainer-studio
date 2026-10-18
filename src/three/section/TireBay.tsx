import React, {useMemo} from 'react';
import * as THREE from 'three';
import {fonts} from '../../fonts';
import {LAB, MOODS, REAL, section, type Mood} from '../../theme';
import {ease} from '../../scenes/keyframes';
import {raw, roundedBox} from '../plaster';
import {RealWheel, WHEEL, wheelPoint} from '../real/RealWheel';
import {applyEnv, useEnvStrength, useStudioEnv} from '../real/useStudioEnv';
import {Figure, STAND_LIFT} from './Figure';
import {SLICE} from './LivingRoomSlice';
import {useFontsLoaded} from './useFontsLoaded';

type V3 = [number, number, number];

/** One row of the bay: its set-panel label, which wheels (0–7) go low, and when (s into the scene). */
export type TireBayRow = {label: string; low: number[]; lowAt: number};

export type TireBayProps = {
  /** Up to two rows, top shelf first. Default: "WITHOUT THE WARNING" (2 of 8 low) over "WITH THE WARNING" (1 of 8). 🎭 illustrative. */
  rows: TireBayRow[];
  /** How low a low tire goes (default 0.55: visibly soft). */
  lowPressure: number;
  /**
   * The beat: 'check' (nothing low yet; the workers gauge the end tires and write) or 'result' (each
   * row's low tires sag and light their readouts at the row's `lowAt`; the workers turn to look).
   * Default 'check'.
   */
  beat: 'check' | 'result';
  /** The two workers (default true). */
  workers: boolean;
};

export const TIRE_BAY = {
  /** Shelf board heights (top row first), the rack's depth and centre. */
  shelves: [1.62, 1.0],
  z: SLICE.z0 + 0.3,
  depth: 0.5,
  cx: -0.255,
  width: 1.86,
  /** Wheel radius (≈ 47% of a real 17"): eight to a row, with room beside both ends of the rack for a worker. */
  wheelR: 0.15,
  x: (i: number) => -0.99 + i * 0.21,
  /**
   * Each wheel turned so its face is square to the camera across the floor (the camera sits ≈ 28°
   * to the right of the cut face): neighbours overlap a little, like tires in a shop rack, without
   * touching (their mid-planes are 0.099 apart, the tire 0.1 wide).
   */
  yaw: -1.08,
  /** Where the workers stand clear of the rack: beside each end, at the rack's depth. */
  /**
   * Where the workers stand: beside each end of the shelves, clear of the board ends (≥ 0.06 with the
   * torso, more for the head, which is above the top shelf) and of the side wall.
   */
  spots: {left: [-1.38, -0.62] as [number, number], right: [0.88, -0.3] as [number, number]},
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

/** Valve angles (φ from the top, + toward screen left): the side each row's worker checks from. */
const VALVE_RIGHT = -Math.PI / 2 - 0.25;
const VALVE_LEFT = Math.PI / 2 + 0.25;

/** One action at a worker's spot: the gauge on the end tire, or writing on the clipboard. */
type Act = {kind: 'gauge' | 'write'; from: number; to: number};
/** A turn of the head toward a tire (its readout lighting, or a look along the row). */
type Look = {at: number; hold: number; row: number; wheel: number};

/**
 * Each worker's actions per beat (seconds into the scene). Each gauges the bottom row's tire at
 * its end (left: wheel 0, right: wheel 7). Something changes every 1–2 s; they never sync. In the result
 * beat both turn their heads to each row's low tires as the readouts light.
 */
const actionsFor = (who: 'left' | 'right', beat: 'check' | 'result', rows: TireBayRow[]): {acts: Act[]; looks: Look[]} => {
  if (beat === 'check') {
    return who === 'left'
      ? {acts: [{kind: 'gauge', from: 0.5, to: 1.8}, {kind: 'write', from: 2.1, to: 3.3}], looks: [{at: 2.0, hold: 0.9, row: 1, wheel: 5}]}
      : {acts: [{kind: 'write', from: 0.2, to: 1.3}, {kind: 'write', from: 2.4, to: 3.3}], looks: [{at: 1.3, hold: 0.8, row: 0, wheel: 2}]};
  }
  const top = rows[0];
  const bottom = rows[1];
  const looks: Look[] = [];
  // the head turns as each readout lights (the nearer low tire of each row for each worker)
  if (top && Number.isFinite(top.lowAt) && top.low.length) looks.push({at: top.lowAt + 0.1, hold: 1.0, row: 0, wheel: who === 'left' ? Math.min(...top.low) : Math.max(...top.low)});
  if (bottom && Number.isFinite(bottom.lowAt) && bottom.low.length) looks.push({at: bottom.lowAt + 0.1, hold: 1.1, row: 1, wheel: bottom.low[0]});
  return who === 'left'
    ? {acts: [{kind: 'write', from: 0.2, to: 1.5}, {kind: 'gauge', from: 1.8, to: 2.8}, {kind: 'write', from: 3.7, to: 4.8}], looks}
    : {acts: [{kind: 'write', from: 1.5, to: 2.6}, {kind: 'write', from: 4.1, to: 4.9}], looks};
};

/** How far into an action (0 → 1 → 0, eased in and out over 0.35 s). */
const actK = (acts: Act[], kind: Act['kind'], t: number) =>
  acts.filter((a) => a.kind === kind).reduce((m, a) => Math.max(m, ease(t, a.from, a.from + 0.35) * (1 - ease(t, a.to - 0.35, a.to))), 0);

/**
 * The Lab dressed as a tire bay (No. 002, "when US safety officials checked mid-2000s cars"): a steel
 * wall-mounted rack (uprights on the back wall, shelves on brackets) with two shelves of eight wheels (each standing for one car), a set panel
 * under each row, and two grey workers standing at the rack's ends, clear of the wheels and signs:
 * they lean in to gauge the end tires (a pencil gauge to the valve), write on clipboards, and turn
 * their heads to each low tire as its readout lights. In the result beat each row's low tires sag
 * and their readout tags light in warning yellow at the row's `lowAt` (a gauge readout: flat, never
 * orange). 🎭 the 2-of-8 vs 1-of-8 picture. Neutral; nothing here is the system.
 */
export const TireBay: React.FC<{mood: Mood; t: number} & Partial<TireBayProps>> = ({
  mood,
  t,
  rows = DEFAULT_ROWS,
  lowPressure = 0.55,
  beat = 'check',
  workers = true,
}) => {
  const env = useStudioEnv();
  const envScale = useEnvStrength();
  const mats = useMemo(
    () => ({
      steel: new THREE.MeshPhysicalMaterial({color: raw(REAL.steel), metalness: 1, roughness: 0.38}),
      board: new THREE.MeshPhysicalMaterial({color: raw(REAL.alu), metalness: 0.6, roughness: 0.45}),
      gauge: new THREE.MeshPhysicalMaterial({color: raw(REAL.chuck), metalness: 1, roughness: 0.3}),
      gaugeHead: new THREE.MeshPhysicalMaterial({color: raw(REAL.labDark), metalness: 0.3, roughness: 0.4}),
      bezel: new THREE.MeshStandardMaterial({color: raw(REAL.labDark), roughness: 0.5}),
      readout: new THREE.MeshBasicMaterial({color: raw(section.warning)}),
      cord: new THREE.MeshStandardMaterial({color: raw(REAL.cable), roughness: 0.8}),
      clip: new THREE.MeshStandardMaterial({color: raw(REAL.labDark), roughness: 0.55}),
      sheet: new THREE.MeshStandardMaterial({color: raw(MOODS[mood].paper), roughness: 0.9}),
      screen: new THREE.MeshBasicMaterial({color: raw(section.screenLight)}),
      bars: new THREE.MeshBasicMaterial({color: raw(REAL.labDark)}),
    }),
    [mood],
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
  const wheelY = (r: number) => B.shelves[r] + 0.018 + R;
  const wheelZ = B.z + 0.02;
  const out = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), B.yaw);
  // every valve on the side its worker checks from: the top row's on the right, the bottom row's on the left
  // each valve on the side of the nearer end (where that end's worker checks from)
  const valvePhi = (i: number) => (i < 4 ? VALVE_LEFT : VALVE_RIGHT);
  const wheelPos = (r: number, i: number): V3 => [B.x(i), wheelY(r), wheelZ];
  const readoutPos = (r: number, i: number): V3 => {
    const p = wheelPos(r, i);
    const v = new THREE.Vector3(p[0], p[1] + R * 0.98 - 0.09, p[2]).addScaledVector(out, 0.075);
    return [v.x, v.y, v.z];
  };
  return (
    <group>
      {/*
        the rack: wall-mounted shelving (no front posts for the workers to stand into): two slotted
        uprights on the back wall, the shelf boards on steel brackets
      */}
      {[B.cx - W / 2 + 0.06, B.cx + W / 2 - 0.06].map((x) => (
        <group key={x}>
          <mesh position={[x, 1.25, SLICE.z0 + 0.012]} material={mats.steel} castShadow>
            <boxGeometry args={[0.04, 1.5, 0.024]} />
          </mesh>
          {B.shelves.map((y, i) => (
            <mesh key={i} position={[x, y - 0.05, B.z - B.depth / 2 + (B.depth * 0.8) / 2 + 0.02]} material={mats.steel} castShadow>
              <boxGeometry args={[0.012, 0.07, B.depth * 0.8]} />
            </mesh>
          ))}
        </group>
      ))}
      {B.shelves.map((y, i) => (
        <mesh key={i} geometry={roundedBox(W + 0.06, 0.035, B.depth, 0.006)} material={mats.board} position={[B.cx, y, B.z]} castShadow receiveShadow />
      ))}
      {rows.slice(0, 2).map((row, r) => (
        <group key={r}>
          {[...Array(8).keys()].map((i) => {
            const low = beat === 'result' && row.low.includes(i) && Number.isFinite(row.lowAt);
            const k = low ? ease(t, row.lowAt, row.lowAt + 0.5) : 0;
            const lit = low && t >= row.lowAt;
            const p = wheelPos(r, i);
            // the readout tag: hangs from the tire's top on the face toward the camera
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
                  spin={valvePhi(i) - WHEEL.valveBase + (i % 2) * 0.12}
                  pressure={1 - (1 - lowPressure) * k}
                  low
                  ink={false}
                />
                {lit ? (
                  <group position={top} rotation={[0, B.yaw + Math.PI / 2, 0]} scale={0.75 + 0.25 * ease(t, row.lowAt, row.lowAt + 0.25)}>
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
      {workers
        ? (['left', 'right'] as const).map((who) => {
            const spot = B.spots[who];
            const pos: V3 = [spot[0], 0, spot[1]];
            // the left worker three-quarter to the camera, facing into the rack's end
            // the right worker turned toward the camera, so the tablet sits in front of its body, off the rack
            const rot = who === 'left' ? 0.9 : -0.35;
            const r = 1;
            const wheel = who === 'left' ? 0 : 7;
            const {acts, looks} = actionsFor(who, beat, rows);
            // the right worker reads a tablet held in both hands (no gauge); its 'write' beats are taps
            const tab = who === 'right';
            const gK = tab ? 0 : actK(acts, 'gauge', t);
            const tapK = tab ? actK(acts, 'write', t) : 0;
            // the right worker has no clipboard: its 'write' beats are glances down the row, hands still
            const clip = who === 'left';
            const wK = clip ? actK(acts, 'write', t) : 0;
            const toWorld = (v: V3) => new THREE.Vector3(...v).applyAxisAngle(new THREE.Vector3(0, 1, 0), rot).add(new THREE.Vector3(...pos));
            const local = (q: THREE.Vector3): V3 => {
              const v = q.clone().sub(new THREE.Vector3(...pos)).applyAxisAngle(new THREE.Vector3(0, 1, 0), -rot);
              return [v.x, v.y, v.z];
            };
            const lift = STAND_LIFT;
            // the clipboard hand (left) at the chest, the board tilted up to the eyes; the gauge hand (right)
            // low at the side, writing on the board, or out to the end tire's valve
            const writeJiggle = wK * 0.012 * Math.sin(t * 19);
            // the gauge in the right hand,
            // the clipboard in the other, held close to the chest (clear of the posts)
            // both gauge with the right hand (local −x): the left worker's camera side, the right worker's
            // rack side (its reach then goes straight to the tire, never back behind its body)
            const cs = -1;
            // the free hand: the clipboard at the chest (left worker); the right worker's rests forward on
            // its thigh, in front of the body, so both arms read from the camera
            const clipHand = clip ? toWorld([-cs * 0.12, 0.8 + lift, 0.14]) : toWorld([-cs * 0.3, 0.6 + lift, 0.06]);
            const restG = toWorld([cs * 0.15, 0.74 + lift, 0.2]);
            const writeG = toWorld([-cs * 0.06 + writeJiggle, 0.84 + lift + writeJiggle * 0.6, 0.2]);
            const valve = new THREE.Vector3(...valveAt(wheelPos(r, wheel), valvePhi(wheel), R));
            // reaching straight in at the rack's end, between its posts: the gauge spans the last 0.2
            const gaugeG = valve.clone().add(new THREE.Vector3(who === 'left' ? -0.2 : 0.15, 0.05, who === 'left' ? 0.02 : 0.14));
            const handG = restG.clone().lerp(writeG, wK).lerp(gaugeG, gK);
            // gauging, the clipboard drops to the side a little
            // gauging, the clipboard drops to the side a little; the right worker gauges one-handed, its free
            // arm hanging relaxed at its side the whole time
            const handC = clip ? clipHand.clone().lerp(toWorld([-cs * 0.2, 0.68 + lift, 0.06]), gK) : clipHand;
            const gDir = valve
              .clone()
              .sub(handG)
              .normalize()
              .lerp(new THREE.Vector3(Math.sin(rot), -0.5, Math.cos(rot)).normalize(), 1 - gK)
              .normalize();
            const gq = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), gDir);
            // the clipboard faces up and back toward the face
            const cq = new THREE.Quaternion().setFromEuler(new THREE.Euler(-1.1 + 0.5 * gK, rot, 0, 'YXZ'));
            // tablet: both hands at its two sides, in front of the chest at reading height; a tap brings the
            // right hand in over the screen side (toward the body)
            const tap = tapK * Math.max(0, Math.sin(t * 9)) * 0.03;
            const tabletHands: [V3, V3] = [
              [-0.13 + tapK * 0.05, 0.9 + lift + tap * 0.5, 0.24 - tapK * 0.03 - tap],
              [0.13, 0.9 + lift, 0.24],
            ];
            // the screen faces its owner (§ 3): tipped up and back toward the eyes, so the camera sees the
            // slate's back and edge
            const tq = new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.95, rot, 0, 'YXZ'));
            const gestures = [
              ...acts
                .filter((a) => a.kind === 'gauge')
                // no forward lean (it would put the head into the end post): the head tips down to the gauge
                .map((a) => ({pose: 'glance-down' as const, at: a.from, hold: Math.max(0, a.to - a.from - 1.0), blend: 0.5})),
              ...acts
                .filter((a) => a.kind === 'write')
                .map((a) => ({pose: 'glance-down' as const, at: a.from, hold: Math.max(0, a.to - a.from - 1.0), blend: 0.5})),
              ...looks.map((l) => ({pose: 'turn-to' as const, at: l.at, hold: l.hold, blend: 0.4, target: readoutPos(l.row, l.wheel)})),
            ];
            return (
              <group key={who}>
                <Figure
                  who="extra"
                  mood={mood}
                  position={pos}
                  rotationY={rot}
                  seed={who === 'left' ? 'bay-a' : 'bay-b'}
                  phone={false}
                  hands={tab ? tabletHands : [local(handG), local(handC)]}
                  stance="stand"
                  gestures={gestures}
                />
                {/* the pencil gauge in the right hand: a steel barrel, a dark chuck head */}
                <group position={handG} quaternion={gq} visible={!tab}>
                  <mesh position={[0, 0.09, 0]} material={mats.gauge} castShadow>
                    <cylinderGeometry args={[0.014, 0.014, 0.18, 12]} />
                  </mesh>
                  <mesh position={[0, 0.195, 0]} material={mats.gaugeHead} castShadow>
                    <cylinderGeometry args={[0.02, 0.016, 0.035, 12]} />
                  </mesh>
                </group>
                {tab ? (
                  // the tablet: a dark slate in both hands, its light screen with simple bars (neutral)
                  <group position={toWorld([0, 0.9 + lift, 0.26])} quaternion={tq}>
                    <mesh material={mats.clip} castShadow>
                      <boxGeometry args={[0.24, 0.01, 0.17]} />
                    </mesh>
                    <mesh position={[0, 0.0055, 0]} rotation={[-Math.PI / 2, 0, 0]} material={mats.screen}>
                      <planeGeometry args={[0.215, 0.145]} />
                    </mesh>
                    {[0.05, 0.08, 0.035, 0.065, 0.045].map((h, k) => (
                      <mesh key={k} position={[-0.075 + k * 0.035, 0.006, 0.055 - h / 2]} rotation={[-Math.PI / 2, 0, 0]} material={mats.bars}>
                        <planeGeometry args={[0.02, h]} />
                      </mesh>
                    ))}
                  </group>
                ) : null}
                {/* the clipboard in the left hand: a dark board, a sheet, the clip */}
                <group position={handC} quaternion={cq} visible={clip}>
                  <mesh position={[0, 0, 0.06]} material={mats.clip} castShadow>
                    <boxGeometry args={[0.16, 0.012, 0.22]} />
                  </mesh>
                  <mesh position={[0, 0.0065, 0.07]} material={mats.sheet}>
                    <boxGeometry args={[0.145, 0.002, 0.19]} />
                  </mesh>
                  <mesh position={[0, 0.012, -0.04]} material={mats.gauge}>
                    <boxGeometry args={[0.08, 0.012, 0.025]} />
                  </mesh>
                </group>
              </group>
            );
          })
        : null}
    </group>
  );
};
