import React, {useMemo} from 'react';
import {random} from 'remotion';
import * as THREE from 'three';
import {LAB, MOODS, REAL, section, STREET, theme, TOWER, type Mood} from '../../theme';
import {raw, roundedBox, softTexture} from '../plaster';
import {SpaceHeater} from './CordCorner';
import {GlowNode} from './GlowLines';
import {PushArrow} from '../PushArrow';
import {SECTION_ANGLE} from './SectionCamera';
import {SLICE} from './LivingRoomSlice';

type V3 = [number, number, number];

/*
 * The Lab's `heat-bench` dressing (No. 013, av-script § 4 N3): on the bench, two gallon jugs of water on two hot plates
 * and the small space heater; on the wall over each, a heat meter (a bar that fills orange: the heat each one carries
 * away), and a wall clock whose hands can sweep fast. Jug 1 boils off (bubbles, the level falls, white vapour wisps
 * with orange heat tokens); jug 2 has a thermometer whose column creeps up. Orange only for the heat (§ 5): the bars,
 * the heater's warm air, the tokens. Everything a function of the times the scene passes.
 */

const smooth = (a: number, b: number, x: number) => {
  const u = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return u * u * (3 - 2 * u);
};

/** The Lab's bench (`LAB_LAYOUT.bench`: top 0.84 + 0.03, z −0.6; not imported, LabSlice imports this file). */
const BENCH_TOP = 0.87;
const BZ = -0.6;
/** Where things stand on the bench (x), the bars and the clock on the back wall. */
export const HEAT_BENCH = {
  jug1: [-0.95, BENCH_TOP, BZ + 0.02] as V3,
  jug2: [-0.2, BENCH_TOP, BZ + 0.02] as V3,
  heater: [0.72, BENCH_TOP, BZ + 0.04] as V3,
  /** Each bar's centre on the back wall and its size. */
  bar: {y: 1.72, w: 0.14, h: 0.62, z: SLICE.z0 + 0.02},
  clock: [1.3, 1.95, SLICE.z0 + 0.03] as V3,
  clockR: 0.2,
  jugH: 0.3,
  plateH: 0.07,
};

export type HeatBenchProps = {
  mood: Mood;
  /** Seconds into the scene, and the video clock (wisps, bubbles). */
  t: number;
  clock: number;
  /** Jug 1 boils from `boilAt` (bubbles, vapour, the level falls ≈ 15 % over 6 s). */
  boil?: number;
  /** The heater runs from `heaterOn` (0 → 1 over 0.5 s): lamp lit, fan, warm air. */
  heaterOn?: number;
  /** Jug 2 warms from `warmAt`: its thermometer climbs `degrees` (default 10) over 2 s. */
  warm?: number;
  degrees?: number;
  /** The clock's minutes swept so far (its hands from 3:12). */
  minutes?: number;
  /** The bars, 0 → 1 each. */
  bars?: {jug1?: number; jug2?: number; heater?: number};
};

const Jug: React.FC<{mats: ReturnType<typeof useHeatMats>; level: number; boil: number; clock: number; seed: string; thermo?: number}> = ({mats, level, boil, clock, seed, thermo}) => {
  const H = HEAT_BENCH.jugH;
  const w = 0.16;
  const water = H * 0.85 * level;
  const bubbles: React.ReactNode[] = [];
  if (boil > 0.01)
    for (let k = 0; k < 14; k++) {
      const u = (clock * (0.8 + random(`${seed}-s-${k}`) * 0.6) + random(`${seed}-p-${k}`)) % 1;
      bubbles.push(
        <mesh
          key={k}
          material={mats.bubble}
          position={[(random(`${seed}-x-${k}`) - 0.5) * w * 0.7, HEAT_BENCH.plateH + 0.02 + u * (water - 0.02), (random(`${seed}-z-${k}`) - 0.5) * w * 0.6]}
          scale={0.008 + 0.006 * u}
        >
          <sphereGeometry args={[1, 8, 6]} />
        </mesh>,
      );
    }
  return (
    <group>
      {/* the hot plate */}
      <mesh geometry={roundedBox(0.24, HEAT_BENCH.plateH, 0.22, 0.012)} material={mats.plate} position={[0, HEAT_BENCH.plateH / 2, 0]} castShadow receiveShadow />
      <mesh material={mats.plateTop} position={[0, HEAT_BENCH.plateH + 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.085, 24]} />
      </mesh>
      {/* the water, the jug (translucent plastic), its handle and cap */}
      <mesh material={mats.water} position={[0, HEAT_BENCH.plateH + water / 2 + 0.005, 0]}>
        <boxGeometry args={[w - 0.012, water, w - 0.012]} />
      </mesh>
      <mesh geometry={roundedBox(w, H, w, 0.025)} material={mats.jug} position={[0, HEAT_BENCH.plateH + H / 2, 0]} />
      <mesh material={mats.jug} position={[0.03, HEAT_BENCH.plateH + H + 0.03, 0]}>
        <cylinderGeometry args={[0.022, 0.03, 0.05, 16]} />
      </mesh>
      <mesh material={mats.jug} position={[-0.05, HEAT_BENCH.plateH + H * 0.8, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.04, 0.012, 8, 16, Math.PI]} />
      </mesh>
      {bubbles}
      {thermo !== undefined ? (
        <group position={[0.035, HEAT_BENCH.plateH + 0.05, 0.035]}>
          <mesh material={mats.glass} position={[0, H * 0.55, 0]}>
            <cylinderGeometry args={[0.008, 0.008, H * 1.1, 10]} />
          </mesh>
          <mesh material={mats.mercury} position={[0, 0.06 + (H * 0.5 * thermo) / 2, 0]}>
            <cylinderGeometry args={[0.0042, 0.0042, H * 0.5 * thermo + 0.02, 8]} />
          </mesh>
          <mesh material={mats.mercury} position={[0, 0.02, 0]}>
            <sphereGeometry args={[0.011, 10, 8]} />
          </mesh>
          {/* tick marks */}
          {[...Array(6).keys()].map((i) => (
            <mesh key={i} material={mats.ink} position={[0.012, 0.06 + i * H * 0.1, 0]}>
              <boxGeometry args={[0.008, 0.0025, 0.002]} />
            </mesh>
          ))}
        </group>
      ) : null}
    </group>
  );
};

const useHeatMats = (mood: Mood) =>
  useMemo(() => {
    const m = MOODS[mood];
    const std = (c: string, r = 0.8, o: THREE.MeshStandardMaterialParameters = {}) => new THREE.MeshStandardMaterial({color: raw(c), roughness: r, ...o});
    return {
      plate: std(REAL.labDark, 0.5),
      plateTop: std(REAL.cable, 0.4),
      water: std(STREET.water, 0.2, {transparent: true, opacity: 0.55, depthWrite: false}),
      jug: new THREE.MeshPhysicalMaterial({color: raw(TOWER.glass), roughness: 0.35, transparent: true, opacity: 0.28, depthWrite: false}),
      glass: new THREE.MeshPhysicalMaterial({color: raw(TOWER.glass), roughness: 0.05, transparent: true, opacity: 0.35, depthWrite: false}),
      mercury: std(STREET.dialInk, 0.4),
      ink: new THREE.MeshBasicMaterial({color: raw(section.cutLine)}),
      bubble: new THREE.MeshBasicMaterial({color: raw(theme.plasterGlass).multiplyScalar(0.95 / m.exposure), transparent: true, opacity: 0.85}),
      panel: std(LAB[mood].panel, 0.6),
      barBack: std(LAB[mood].segOff, 0.6),
      bar: new THREE.MeshBasicMaterial({color: raw(section.orange)}),
      face: std(STREET.dial, 0.6),
      rim: std(STREET.dialInk, 0.5),
    };
  }, [mood]);

/** Soft white vapour wisps off jug 1's mouth, each with a small orange heat token (the heat it carries away). */
const Vapor: React.FC<{at: V3; strength: number; clock: number; seed: string}> = ({at, strength, clock, seed}) => {
  const n = 9;
  const mats = useMemo(() => [...Array(n).keys()].map(() => new THREE.MeshBasicMaterial({map: softTexture(), color: raw(theme.plasterGlass), transparent: true, depthWrite: false, opacity: 0})), []);
  const q = useMemo(() => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), new THREE.Vector3(...SECTION_ANGLE)), []);
  return (
    <group position={at}>
      {mats.map((m, i) => {
        const life = 2.4;
        const ph = clock / life + i / n;
        const u = ((ph % 1) + 1) % 1;
        const k = Math.floor(ph);
        const x = (random(`${seed}-x-${i}-${k}`) - 0.5) * 0.08 + 0.05 * Math.sin(u * 4 + i);
        const y = u * 0.55;
        const sz = 0.08 + 0.18 * u;
        m.opacity = strength * 0.5 * smooth(0, 0.15, u) * (1 - smooth(0.5, 1, u));
        return (
          <group key={i}>
            {m.opacity > 0.005 ? (
              <mesh material={m} position={[x, y, 0]} quaternion={q} scale={[sz, sz, 1]} renderOrder={7}>
                <planeGeometry args={[1, 1]} />
              </mesh>
            ) : null}
            {strength > 0.05 && i % 2 === 0 ? <GlowNode at={[at[0] * 0 + x, y + 0.02, 0.01]} radius={0.012} glow={strength * smooth(0, 0.15, u) * (1 - smooth(0.6, 0.95, u))} /> : null}
          </group>
        );
      })}
    </group>
  );
};

/**
 * Warm air off the heater: small orange arrows rising from its top in a stagger (the dry coolers' warm-air marks, not
 * puffs, which read as smoke on the pale wall).
 */
const WarmAir: React.FC<{at: V3; strength: number; clock: number}> = ({at, strength, clock}) => {
  if (strength < 0.01) return null;
  return (
    <group>
      {[-0.07, 0.0, 0.07].map((dx, i) => {
        const u = (clock / 1.5 + i / 3) % 1;
        return (
          <PushArrow
            key={i}
            position={[at[0] + dx, at[1] + 0.02 + u * 0.3, at[2]]}
            direction={[0, 1, 0]}
            normal={SECTION_ANGLE}
            length={0.1}
            radius={0.008}
            node={false}
            glow={strength * smooth(0, 0.15, u) * (1 - smooth(0.7, 1, u))}
          />
        );
      })}
    </group>
  );
};

/** One wall heat meter: a dark panel, an unlit track, the orange fill rising from the bottom (a 1 % sliver still shows). */
const Bar: React.FC<{x: number; v: number; mats: ReturnType<typeof useHeatMats>}> = ({x, v, mats}) => {
  const B = HEAT_BENCH.bar;
  const k = Math.max(0, Math.min(1, v));
  const fill = k <= 0 ? 0 : Math.max(0.012, k) * (B.h - 0.04);
  return (
    <group position={[x, B.y, B.z]}>
      <mesh geometry={roundedBox(B.w + 0.06, B.h + 0.06, 0.02, 0.008)} material={mats.panel} />
      <mesh material={mats.barBack} position={[0, 0, 0.011]}>
        <planeGeometry args={[B.w, B.h - 0.04]} />
      </mesh>
      {fill > 0 ? (
        <mesh material={mats.bar} position={[0, -(B.h - 0.04) / 2 + fill / 2, 0.013]} userData={{glow: true}}>
          <planeGeometry args={[B.w, fill]} />
        </mesh>
      ) : null}
    </group>
  );
};

/** The wall clock: a plain dial with 60 ticks and 12 hour bars, ink hands, no numerals; from 3:12 plus `minutes`. */
const Clock: React.FC<{minutes: number; mats: ReturnType<typeof useHeatMats>}> = ({minutes, mats}) => {
  const R = HEAT_BENCH.clockR;
  const total = 3 * 60 + 12 + minutes;
  const mA = -((total % 60) / 60) * Math.PI * 2;
  const hA = -(((total / 60) % 12) / 12) * Math.PI * 2;
  return (
    <group position={HEAT_BENCH.clock}>
      <mesh material={mats.rim} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[R + 0.015, R + 0.015, 0.03, 40]} />
      </mesh>
      <mesh material={mats.face} position={[0, 0, 0.016]}>
        <circleGeometry args={[R, 40]} />
      </mesh>
      {[...Array(60).keys()].map((i) => {
        const a = (i / 60) * Math.PI * 2;
        const big = i % 5 === 0;
        const l = big ? 0.035 : 0.014;
        return (
          <mesh key={i} material={mats.ink} position={[Math.sin(a) * (R - 0.012 - l / 2), Math.cos(a) * (R - 0.012 - l / 2), 0.018]} rotation={[0, 0, -a]}>
            <planeGeometry args={[big ? 0.01 : 0.004, l]} />
          </mesh>
        );
      })}
      <group rotation={[0, 0, hA]} position={[0, 0, 0.02]}>
        <mesh material={mats.ink} position={[0, R * 0.27, 0]}>
          <planeGeometry args={[0.016, R * 0.6]} />
        </mesh>
      </group>
      <group rotation={[0, 0, mA]} position={[0, 0, 0.022]}>
        <mesh material={mats.ink} position={[0, R * 0.4, 0]}>
          <planeGeometry args={[0.01, R * 0.88]} />
        </mesh>
      </group>
      <mesh material={mats.ink} position={[0, 0, 0.024]}>
        <circleGeometry args={[0.012, 16]} />
      </mesh>
    </group>
  );
};

/** The heat bench (see the file comment). */
export const HeatBench: React.FC<HeatBenchProps> = ({mood, clock, boil = 0, heaterOn = 0, warm = 0, degrees = 10, minutes = 0, bars = {}}) => {
  const mats = useHeatMats(mood);
  const m = MOODS[mood];
  const HB = HEAT_BENCH;
  const level1 = 1 - 0.15 * boil;
  // the thermometer's column: room temperature at 0.35 of the scale, +10 degrees ≈ +0.12
  const thermo = 0.35 + 0.012 * degrees * warm;
  return (
    <group>
      <group position={HB.jug1}>
        <Jug mats={mats} level={level1} boil={Math.min(1, boil * 3)} clock={clock} seed="jug1" />
      </group>
      <group position={HB.jug2}>
        <Jug mats={mats} level={1} boil={0} clock={clock} seed="jug2" thermo={thermo} />
      </group>
      <Vapor at={[HB.jug1[0] + 0.03, HB.jug1[1] + HB.plateH + HB.jugH + 0.06, HB.jug1[2]]} strength={Math.min(1, boil * 3)} clock={clock} seed="v1" />
      <group position={HB.heater} rotation={[0, -0.25, 0]} scale={1.5}>
        <SpaceHeater palette={m} heater={heaterOn} run={clock * heaterOn} />
      </group>
      <WarmAir at={[HB.heater[0], HB.heater[1] + 0.47, HB.heater[2]]} strength={heaterOn} clock={clock} />
      <Bar x={HB.jug1[0]} v={bars.jug1 ?? 0} mats={mats} />
      <Bar x={HB.jug2[0]} v={bars.jug2 ?? 0} mats={mats} />
      <Bar x={HB.heater[0]} v={bars.heater ?? 0} mats={mats} />
      <Clock minutes={minutes} mats={mats} />
    </group>
  );
};
