import React, {useMemo} from 'react';
import * as THREE from 'three';
import {fonts} from '../../fonts';
import {REAL, section} from '../../theme';
import {raw, roundedBox} from '../plaster';
import {cutMaterial} from '../section/cutLook';
import {useFontsLoaded} from '../section/useFontsLoaded';
import {applyAlbedo, applyEnv, useAlbedo, useEnvStrength, useStudioEnv} from './useStudioEnv';

type V3 = [number, number, number];

/** The sensor's parts that can be named (and light up) in the teardown. */
export type SensorPart = 'battery' | 'pressure' | 'motion' | 'computer' | 'radio';

/*
 * A valve-mounted tire-pressure sensor (No. 002), in the wheel's radius-1 units (≈ 330 mm a unit):
 * a grey housing ≈ 0.14 long on the rim well, its node dot (the system: orange) on top. Opened up
 * (`explode` 0 → 1) it comes apart like a repair photo: the housing tray (cut walls, hatched), the
 * coin cell with an invented label, the board with the pressure sensor (its port), the motion sensor,
 * the computer chip (an invented legend), the antenna, the lid. Frame: +y radial (up, into the
 * cavity), +x outboard (toward the stem), +z round the wheel; origin at its base.
 */

const HOUSING = {w: 0.08, h: 0.055, d: 0.14};
/** Each part's rest height (assembled) and its exploded height (in sensor units), and its centre (x, z). */
const LAYOUT: Record<SensorPart | 'tray' | 'lid' | 'board', {y: number; up: number; x: number; z: number}> = {
  tray: {y: 0, up: 0, x: 0, z: 0},
  battery: {y: 0.016, up: 0.05, x: 0, z: 0.028},
  board: {y: 0.03, up: 0.1, x: 0, z: 0},
  pressure: {y: 0.034, up: 0.1, x: 0.0, z: 0.04},
  motion: {y: 0.034, up: 0.1, x: 0.0, z: 0.0},
  computer: {y: 0.034, up: 0.1, x: 0.0, z: -0.038},
  radio: {y: 0.036, up: 0.145, x: -0.03, z: 0},
  lid: {y: 0.046, up: 0.2, x: 0, z: 0},
};

/** A part's centre in the sensor's frame for an explode amount (for callouts and the scene's framing). */
export const sensorPartAt = (part: SensorPart | 'lid' | 'node', explode: number): V3 => {
  if (part === 'node') return [0, HOUSING.h + 0.01 + LAYOUT.lid.up * explode, 0.035];
  const L = LAYOUT[part];
  return [L.x, L.y + L.up * explode + 0.006, L.z];
};

const canvasTex = (w: number, h: number) => {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const t = new THREE.CanvasTexture(c);
  t.anisotropy = 4;
  return {c, t, key: ''};
};

export type TireSensorProps = {
  /** The node dot: 0 off (`ledOff`), up to ≈ 0.4 a dim orange (no bloom), 1 full orange (bloomed). */
  dot?: number;
  /** 0 assembled → 1 opened up (exploded). */
  explode?: number;
  /** The part lit (lifted a little, brighter); the radio turns its antenna orange. */
  highlight?: SensorPart | null;
  /** 0 → 1: how far the highlight has come in. */
  highlightK?: number;
  /** A brief neutral light on the motion sensor as it wakes the chip, 0–1. */
  wake?: number;
};

/** The sensor (see the file comment). */
export const TireSensor: React.FC<TireSensorProps> = ({dot = 0, explode = 0, highlight = null, highlightK = 0, wake = 0}) => {
  const env = useStudioEnv();
  const envScale = useEnvStrength();
  const albedo = useAlbedo();
  const ready = useFontsLoaded();
  const tex = useMemo(() => ({chip: canvasTex(128, 128), cell: canvasTex(256, 256)}), []);
  const mats = useMemo(() => {
    const phys = (c: string, o: THREE.MeshPhysicalMaterialParameters = {}) =>
      new THREE.MeshPhysicalMaterial({color: raw(c), ...o});
    return {
      housing: phys(REAL.sensor, {roughness: 0.55, clearcoat: 0.3}),
      cut: cutMaterial(),
      pcb: phys(REAL.pcb, {roughness: 0.38, clearcoat: 0.5}),
      chip: phys(REAL.chip, {roughness: 0.4}),
      chipTop: phys('#ffffff', {roughness: 0.4}),
      lidMetal: phys(REAL.shield, {metalness: 1, roughness: 0.3}),
      cell: phys(REAL.coinCell, {metalness: 1, roughness: 0.28}),
      cellTop: phys('#ffffff', {metalness: 0.9, roughness: 0.3}),
      antenna: phys(REAL.shield, {metalness: 1, roughness: 0.25}),
      antennaGlow: new THREE.MeshBasicMaterial({color: raw(section.orange), transparent: true, opacity: 0}),
      port: new THREE.MeshBasicMaterial({color: raw('#08090b')}),
      dotOff: new THREE.MeshStandardMaterial({color: raw(section.ledOff), roughness: 0.4}),
      dotDim: new THREE.MeshBasicMaterial({color: raw(section.orange)}),
      dotGlow: new THREE.MeshBasicMaterial({color: raw(section.orange), transparent: true, opacity: 0}),
      lit: new THREE.MeshBasicMaterial({color: raw(section.screenLight), transparent: true, opacity: 0, depthWrite: false}),
    };
  }, []);
  applyEnv(
    env,
    [
      [mats.housing, 0.4],
      [mats.lidMetal, 1],
      [mats.cell, 1],
      [mats.cellTop, 1],
      [mats.antenna, 1],
      [mats.pcb, 0.5],
      [mats.chip, 0.4],
      [mats.chipTop, 0.4],
    ],
    envScale,
  );
  applyAlbedo([mats.housing, mats.pcb, mats.chip, mats.cell, mats.antenna, mats.lidMetal], albedo);

  if (ready && tex.chip.key !== 'v1') {
    const cx = tex.chip.c.getContext('2d')!;
    cx.fillStyle = REAL.chip;
    cx.fillRect(0, 0, 128, 128);
    cx.fillStyle = REAL.chipInk;
    cx.font = `700 26px ${fonts.mono}, monospace`;
    cx.textAlign = 'center';
    cx.fillText('TP-48', 64, 52);
    cx.font = `600 20px ${fonts.mono}, monospace`;
    cx.fillText('MCU 2631', 64, 82);
    cx.beginPath();
    cx.arc(18, 18, 6, 0, Math.PI * 2);
    cx.fill();
    tex.chip.t.needsUpdate = true;
    tex.chip.key = 'v1';
    mats.chipTop.map = tex.chip.t;
    mats.chipTop.needsUpdate = true;
    const c2 = tex.cell.c.getContext('2d')!;
    c2.fillStyle = REAL.coinCell;
    c2.fillRect(0, 0, 256, 256);
    c2.fillStyle = REAL.chipInk;
    c2.font = `700 40px ${fonts.sans}, Arial`;
    c2.textAlign = 'center';
    c2.fillText('CR-2050', 128, 118);
    c2.font = `600 30px ${fonts.sans}, Arial`;
    c2.fillText('3V  +', 128, 162);
    tex.cell.t.center.set(0.5, 0.5);
    tex.cell.t.rotation = Math.PI / 2;
    tex.cell.t.needsUpdate = true;
    tex.cell.key = 'v1';
    mats.cellTop.map = tex.cell.t;
    mats.cellTop.needsUpdate = true;
  }

  const e = Math.max(0, Math.min(1, explode));
  const lift = (p: SensorPart) => (highlight === p ? 0.012 * highlightK : 0);
  const glowOf = (p: SensorPart) => (highlight === p ? highlightK : 0);
  const at = (p: keyof typeof LAYOUT, extra = 0): V3 => {
    const L = LAYOUT[p];
    return [L.x, L.y + L.up * e + extra, L.z];
  };
  const d = Math.max(0, Math.min(1, dot));
  mats.dotDim.color.copy(raw(section.orange)).multiplyScalar(0.25 + 0.75 * Math.min(1, d / 0.4) * 0.55);
  mats.dotGlow.opacity = Math.max(0, (d - 0.4) / 0.6);
  const radio = glowOf('radio');
  mats.antennaGlow.opacity = radio;
  const H = HOUSING;
  const wall = 0.006;
  const open = e > 0.01;

  // a translucent neutral wash over a lit part (not orange: only the radio is the system)
  const lit = (k: number, size: V3, pos: V3) =>
    k > 0.01 ? (
      <mesh position={pos} material={mats.lit} scale={size} renderOrder={4}>
        <boxGeometry args={[1, 1, 1]} />
      </mesh>
    ) : null;
  mats.lit.opacity = 0.35;

  return (
    <group>
      {/* the housing: closed, a rounded grey body; opened, a tray with cut (hatched) wall tops and a lid */}
      {open ? (
        <>
          <mesh position={[0, wall / 2, 0]} material={mats.housing} castShadow receiveShadow>
            <boxGeometry args={[H.w, wall, H.d]} />
          </mesh>
          {[
            {p: [0, 0.014, H.d / 2 - wall / 2], s: [H.w, 0.028, wall]},
            {p: [0, 0.014, -H.d / 2 + wall / 2], s: [H.w, 0.028, wall]},
            {p: [H.w / 2 - wall / 2, 0.014, 0], s: [wall, 0.028, H.d]},
            {p: [-H.w / 2 + wall / 2, 0.014, 0], s: [wall, 0.028, H.d]},
          ].map((w, i) => (
            <mesh
              key={i}
              position={w.p as V3}
              material={[mats.housing, mats.housing, mats.cut, mats.housing, mats.housing, mats.housing]}
              castShadow
            >
              <boxGeometry args={w.s as V3} />
            </mesh>
          ))}
          {/* the lid, lifted off, its cut rim hatched */}
          <group position={at('lid')}>
            <mesh geometry={roundedBox(H.w, 0.012, H.d, 0.004)} material={mats.housing} position={[0, 0.006, 0]} castShadow />
            <mesh position={[0, -0.0005, 0]} rotation={[Math.PI / 2, 0, 0]} material={mats.cut}>
              <planeGeometry args={[H.w - 0.004, H.d - 0.004]} />
            </mesh>
          </group>
        </>
      ) : (
        <mesh geometry={roundedBox(H.w, H.h, H.d, 0.012, 4)} material={mats.housing} position={[0, H.h / 2, 0]} castShadow receiveShadow />
      )}

      {open ? (
        <>
          {/* the coin cell */}
          <group position={at('battery', lift('battery'))}>
            <mesh material={[mats.cell, mats.cellTop, mats.cell]} castShadow>
              <cylinderGeometry args={[0.03, 0.03, 0.008, 40]} />
            </mesh>
            {lit(glowOf('battery'), [0.064, 0.012, 0.064], [0, 0, 0])}
          </group>
          {/* the board */}
          <group position={at('board')}>
            <mesh material={mats.pcb} castShadow receiveShadow>
              <boxGeometry args={[H.w - 0.014, 0.004, H.d - 0.014]} />
            </mesh>
          </group>
          {/* pressure sensor: a metal-lidded package with its port */}
          <group position={at('pressure', 0.006 + lift('pressure'))}>
            <mesh geometry={roundedBox(0.03, 0.01, 0.03, 0.002)} material={mats.lidMetal} castShadow />
            <mesh position={[0, 0.0052, 0]} rotation={[-Math.PI / 2, 0, 0]} material={mats.port}>
              <circleGeometry args={[0.005, 20]} />
            </mesh>
            {lit(glowOf('pressure'), [0.036, 0.014, 0.036], [0, 0, 0])}
          </group>
          {/* motion sensor: a small square package */}
          <group position={at('motion', 0.005 + lift('motion'))}>
            <mesh material={mats.chip} castShadow>
              <boxGeometry args={[0.018, 0.006, 0.018]} />
            </mesh>
            {lit(Math.max(glowOf('motion'), wake), [0.024, 0.01, 0.024], [0, 0, 0])}
          </group>
          {/* the computer: the biggest chip, its invented legend on top */}
          <group position={at('computer', 0.005 + lift('computer'))}>
            <mesh material={[mats.chip, mats.chip, mats.chipTop, mats.chip, mats.chip, mats.chip]} castShadow>
              <boxGeometry args={[0.032, 0.006, 0.032]} />
            </mesh>
            {lit(glowOf('computer'), [0.038, 0.01, 0.038], [0, 0, 0])}
          </group>
          {/* the antenna: a thin metal strip arching along the board's edge (orange when it's the radio) */}
          <group position={at('radio', lift('radio'))}>
            <mesh material={mats.antenna} castShadow>
              <boxGeometry args={[0.004, 0.004, H.d - 0.03]} />
            </mesh>
            <mesh position={[0, -0.006, H.d / 2 - 0.017]} material={mats.antenna}>
              <boxGeometry args={[0.004, 0.012, 0.004]} />
            </mesh>
            <mesh material={mats.antennaGlow} scale={[1.6, 1.6, 1.02]} userData={{glow: true}} visible={radio > 0.01}>
              <boxGeometry args={[0.004, 0.004, H.d - 0.03]} />
            </mesh>
          </group>
        </>
      ) : null}

      {/* the node dot (the system), on top: off, dim, or full and bloomed */}
      <group position={sensorPartAt('node', e)}>
        <mesh material={d < 0.02 ? mats.dotOff : mats.dotDim}>
          <sphereGeometry args={[0.011, 16, 12]} />
        </mesh>
        <mesh material={mats.dotGlow} userData={{glow: true}} visible={d > 0.41} scale={1.15}>
          <sphereGeometry args={[0.011, 16, 12]} />
        </mesh>
      </group>
      {!open && wake > 0.01 ? (
        <mesh position={[0, H.h + 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]} material={mats.lit}>
          <planeGeometry args={[H.w * 0.6, H.d * 0.4]} />
        </mesh>
      ) : null}
    </group>
  );
};
