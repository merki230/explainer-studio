import React, {useMemo} from 'react';
import {random} from 'remotion';
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
 * A valve-mounted tire-pressure sensor (No. 002; with the tire, the hero of the video), modelled on
 * a real clamp-in TPMS sensor and generic (no maker, no logo; invented legends), in the wheel's
 * radius-1 units (≈ 317 mm a unit, so the housing is ≈ 25 × 17 × 44 mm):
 *  - closed: a moulded glass-filled plastic housing with rounded edges, a recessed label panel with
 *    an invented moulding, three stiffening ribs, the pressure vent (a ringed port), and on its
 *    outboard end the boss where the valve stem's root is screwed in (a Torx screw head);
 *  - opened (`explode` 0 → 1), a clean repair-photo teardown: the housing tray (cut walls hatched,
 *    mounting posts), the coin cell with welded tabs and an invented label, the board (traces, pads,
 *    silkscreen) with the pressure sensor (metal lid, port), the motion sensor, the computer chip
 *    (an invented legend), a crystal, a low-frequency wake-up coil, small passives, the antenna (a
 *    formed metal strip on two legs), and the lid with its gasket.
 * The node dot on top is the system (orange). Frame: +y radial (up, into the cavity), +x outboard
 * (toward the stem), +z round the wheel; origin at its base.
 */

const HOUSING = {w: 0.08, h: 0.052, d: 0.14};
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

/** The node dot's radius (sensor units): big enough that the dim dot reads at the hook framing. */
const DOT_R = 0.016;

/** A part's centre in the sensor's frame for an explode amount (for callouts and the scene's framing). */
export const sensorPartAt = (part: SensorPart | 'lid' | 'node', explode: number): V3 => {
  if (part === 'node') return [0, HOUSING.h + 0.012 + LAYOUT.lid.up * explode, 0.035];
  const L = LAYOUT[part];
  return [L.x, L.y + L.up * explode + 0.006, L.z];
};

const canvasTex = (w: number, h: number) => {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const t = new THREE.CanvasTexture(c);
  t.anisotropy = 8;
  return {c, t, key: ''};
};

/** Small passives on the board: [x, z, long axis along x?, capacitor?] (seeded once, clear of the big parts). */
const PASSIVES = (() => {
  const out: {x: number; z: number; alongX: boolean; cap: boolean}[] = [];
  const keepOut = [
    {x: 0, z: 0.04, r: 0.02},
    {x: 0, z: 0, r: 0.014},
    {x: 0, z: -0.038, r: 0.021},
    {x: 0.022, z: -0.012, r: 0.01},
    {x: -0.024, z: 0.02, r: 0.011},
  ];
  for (let i = 0; out.length < 14 && i < 400; i++) {
    const x = -0.027 + 0.054 * random(`tpms-px-${i}`);
    const z = -0.056 + 0.112 * random(`tpms-pz-${i}`);
    if (Math.abs(x + 0.03) < 0.006) continue; // the antenna's edge
    if (keepOut.some((k) => Math.hypot(x - k.x, z - k.z) < k.r)) continue;
    if (out.some((o) => Math.hypot(x - o.x, z - o.z) < 0.008)) continue;
    out.push({x, z, alongX: random(`tpms-pa-${i}`) > 0.5, cap: random(`tpms-pc-${i}`) > 0.45});
  }
  return out;
})();

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
  const tex = useMemo(() => ({chip: canvasTex(128, 128), cell: canvasTex(256, 256), pcb: canvasTex(256, 512), label: canvasTex(256, 384)}), []);
  const mats = useMemo(() => {
    const phys = (c: string, o: THREE.MeshPhysicalMaterialParameters = {}) =>
      new THREE.MeshPhysicalMaterial({color: raw(c), ...o});
    return {
      // glass-filled moulded plastic: satin, a faint clearcoat sheen on the edges
      housing: phys(REAL.sensor, {roughness: 0.5, clearcoat: 0.35, clearcoatRoughness: 0.4}),
      housingDark: phys(REAL.sensorDark, {roughness: 0.6, clearcoat: 0.2}),
      label: phys('#ffffff', {roughness: 0.62}),
      cut: cutMaterial(),
      pcb: phys(REAL.pcb, {roughness: 0.38, clearcoat: 0.5}),
      pcbTop: phys('#ffffff', {roughness: 0.38, clearcoat: 0.5}),
      chip: phys(REAL.chip, {roughness: 0.4}),
      chipTop: phys('#ffffff', {roughness: 0.4}),
      lidMetal: phys(REAL.shield, {metalness: 1, roughness: 0.3}),
      screw: phys(REAL.screw, {metalness: 1, roughness: 0.32}),
      cell: phys(REAL.coinCell, {metalness: 1, roughness: 0.28}),
      cellTop: phys('#ffffff', {metalness: 0.9, roughness: 0.3}),
      tab: phys(REAL.shield, {metalness: 1, roughness: 0.35}),
      antenna: phys(REAL.shield, {metalness: 1, roughness: 0.25}),
      ferrite: phys(REAL.inductor, {roughness: 0.55}),
      capPart: phys(REAL.cap, {roughness: 0.5}),
      resistor: phys(REAL.resistor, {roughness: 0.45}),
      gasket: phys(REAL.flex, {roughness: 0.8}),
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
      [mats.housingDark, 0.3],
      [mats.lidMetal, 1],
      [mats.screw, 1],
      [mats.cell, 1],
      [mats.cellTop, 1],
      [mats.tab, 1],
      [mats.antenna, 1],
      [mats.pcb, 0.5],
      [mats.pcbTop, 0.5],
      [mats.chip, 0.4],
      [mats.chipTop, 0.4],
      [mats.ferrite, 0.3],
    ],
    envScale,
  );
  applyAlbedo(
    [mats.housing, mats.housingDark, mats.label, mats.pcb, mats.pcbTop, mats.chip, mats.cell, mats.antenna, mats.lidMetal, mats.screw, mats.tab, mats.ferrite, mats.capPart, mats.resistor],
    albedo,
  );

  if (ready && tex.chip.key !== 'v2') {
    // the computer's legend (invented)
    const cx = tex.chip.c.getContext('2d')!;
    cx.fillStyle = REAL.chip;
    cx.fillRect(0, 0, 128, 128);
    cx.fillStyle = REAL.chipInk;
    cx.font = `700 26px ${fonts.mono}, monospace`;
    cx.textAlign = 'center';
    cx.fillText('TP-48', 64, 52);
    cx.font = `600 20px ${fonts.mono}, monospace`;
    cx.fillText('MCU 2631', 64, 82);
    cx.font = `600 15px ${fonts.mono}, monospace`;
    cx.fillText('K7 0924', 64, 106);
    cx.beginPath();
    cx.arc(18, 18, 6, 0, Math.PI * 2);
    cx.fill();
    tex.chip.t.needsUpdate = true;
    tex.chip.key = 'v2';
    mats.chipTop.map = tex.chip.t;
    mats.chipTop.needsUpdate = true;
    // the coin cell's label (invented)
    const c2 = tex.cell.c.getContext('2d')!;
    c2.fillStyle = REAL.coinCell;
    c2.fillRect(0, 0, 256, 256);
    c2.strokeStyle = REAL.chipInk;
    c2.lineWidth = 3;
    c2.beginPath();
    c2.arc(128, 128, 112, 0, Math.PI * 2);
    c2.stroke();
    c2.fillStyle = REAL.chipInk;
    c2.font = `700 40px ${fonts.sans}, Arial`;
    c2.textAlign = 'center';
    c2.fillText('CR-2050', 128, 112);
    c2.font = `600 30px ${fonts.sans}, Arial`;
    c2.fillText('3V  +', 128, 152);
    c2.font = `600 18px ${fonts.sans}, Arial`;
    c2.fillText('LITHIUM CELL', 128, 186);
    tex.cell.t.center.set(0.5, 0.5);
    tex.cell.t.rotation = Math.PI / 2;
    tex.cell.t.needsUpdate = true;
    tex.cell.key = 'v2';
    mats.cellTop.map = tex.cell.t;
    mats.cellTop.needsUpdate = true;
    // the board: solder mask, traces, gold pads, silkscreen outlines and reference marks
    const c3 = tex.pcb.c.getContext('2d')!;
    const W = 256;
    const H = 512;
    // board x (−0.033 … 0.033) → canvas x; board z (−0.063 … 0.063) → canvas y (top = −z)
    const X = (x: number) => ((x + 0.033) / 0.066) * W;
    const Y = (z: number) => ((0.063 - z) / 0.126) * H;
    c3.fillStyle = REAL.pcb;
    c3.fillRect(0, 0, W, H);
    c3.strokeStyle = REAL.trace;
    c3.lineWidth = 5;
    c3.lineCap = 'round';
    const traces: [number, number][][] = [
      [[0, 0.04], [0, 0.018], [0.0, 0.0]],
      [[0, 0.0], [0, -0.02], [0, -0.038]],
      [[-0.03, 0.055], [-0.03, -0.055]],
      [[0.012, -0.038], [0.022, -0.012], [0.022, 0.03], [0.012, 0.04]],
      [[-0.012, -0.038], [-0.024, -0.02], [-0.024, 0.02]],
      [[0.016, 0.0], [0.026, 0.0], [0.026, -0.05]],
      [[-0.01, 0.052], [0.02, 0.052], [0.026, 0.045]],
    ];
    for (const tr of traces) {
      c3.beginPath();
      tr.forEach(([x, z], i) => (i ? c3.lineTo(X(x), Y(z)) : c3.moveTo(X(x), Y(z))));
      c3.stroke();
    }
    c3.fillStyle = REAL.pad;
    for (const p of PASSIVES) {
      const [dx, dz] = p.alongX ? [0.0028, 0] : [0, 0.0028];
      for (const s of [-1, 1]) c3.fillRect(X(p.x + s * dx) - 5, Y(p.z + s * dz) - 5, 10, 10);
    }
    // vias
    for (let i = 0; i < 26; i++) {
      const x = -0.03 + 0.06 * random(`tpms-via-x-${i}`);
      const z = -0.06 + 0.12 * random(`tpms-via-z-${i}`);
      c3.beginPath();
      c3.arc(X(x), Y(z), 3.5, 0, Math.PI * 2);
      c3.fill();
    }
    c3.strokeStyle = REAL.silk;
    c3.fillStyle = REAL.silk;
    c3.lineWidth = 2;
    const box = (x: number, z: number, s: number) => c3.strokeRect(X(x - s), Y(z + s), X(x + s) - X(x - s), Y(z - s) - Y(z + s));
    box(0, 0.04, 0.018);
    box(0, 0, 0.012);
    box(0, -0.038, 0.019);
    c3.font = `600 16px ${fonts.mono}, monospace`;
    c3.fillText('U1', X(0.014), Y(-0.06));
    c3.fillText('U2', X(0.012), Y(0.062) + 14);
    c3.fillText('U3', X(-0.031), Y(-0.008));
    c3.fillText('Y1', X(0.017), Y(-0.02));
    c3.fillText('L1', X(-0.03), Y(0.031));
    tex.pcb.t.needsUpdate = true;
    tex.pcb.key = 'v2';
    mats.pcbTop.map = tex.pcb.t;
    mats.pcbTop.needsUpdate = true;
    // the housing's moulded label panel: an invented part code and the band (no maker)
    const c4 = tex.label.c.getContext('2d')!;
    c4.fillStyle = REAL.sensorDark;
    c4.fillRect(0, 0, 256, 384);
    c4.fillStyle = REAL.sensor;
    c4.textAlign = 'center';
    c4.font = `800 46px ${fonts.sans}, Arial`;
    c4.fillText('TPMS', 128, 120);
    c4.font = `700 34px ${fonts.sans}, Arial`;
    c4.fillText('433 MHz', 128, 190);
    c4.font = `600 26px ${fonts.mono}, monospace`;
    c4.fillText('S-120 7A', 128, 260);
    tex.label.t.center.set(0.5, 0.5);
    tex.label.t.rotation = -Math.PI / 2;
    tex.label.t.needsUpdate = true;
    tex.label.key = 'v2';
    mats.label.map = tex.label.t;
    mats.label.needsUpdate = true;
  }

  const e = Math.max(0, Math.min(1, explode));
  const lift = (p: SensorPart) => (highlight === p ? 0.012 * highlightK : 0);
  const glowOf = (p: SensorPart) => (highlight === p ? highlightK : 0);
  const at = (p: keyof typeof LAYOUT, extra = 0): V3 => {
    const L = LAYOUT[p];
    return [L.x, L.y + L.up * e + extra, L.z];
  };
  const d = Math.max(0, Math.min(1, dot));
  // the dim dot (asleep, owner decision): a clear orange at phone size, flat (no bloom); full is bloomed
  mats.dotDim.color.copy(raw(section.orange)).multiplyScalar(0.45 + 0.55 * Math.min(1, d / 0.35));
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

  // the stem boss on the outboard end (+x), where the valve's root is screwed in
  const boss = (
    <group position={[H.w / 2 + 0.006, 0.024, 0]}>
      <mesh rotation={[0, 0, Math.PI / 2]} material={mats.housing} castShadow>
        <cylinderGeometry args={[0.017, 0.019, 0.016, 24]} />
      </mesh>
      {/* the screw holding the stem: a pan head with a Torx recess, from the top */}
      <mesh position={[0.0, 0.017, 0]} material={mats.screw} castShadow>
        <cylinderGeometry args={[0.0075, 0.0075, 0.004, 20]} />
      </mesh>
      <mesh position={[0.0, 0.0192, 0]} rotation={[-Math.PI / 2, 0, 0]} material={mats.port}>
        <circleGeometry args={[0.0032, 6]} />
      </mesh>
    </group>
  );

  return (
    <group>
      {open ? (
        <>
          {/* the tray: floor, walls with cut (hatched) tops, two mounting posts */}
          <mesh geometry={roundedBox(H.w, wall, H.d, 0.0025)} position={[0, wall / 2, 0]} material={mats.housing} castShadow receiveShadow />
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
          {[-1, 1].map((s) => (
            <mesh key={s} position={[0.022 * s, 0.014, -0.05 * s]} material={mats.housingDark} castShadow>
              <cylinderGeometry args={[0.0045, 0.0055, 0.022, 14]} />
            </mesh>
          ))}
          {/* the lid, lifted off: its cut rim hatched, the gasket on its underside */}
          <group position={at('lid')}>
            <mesh geometry={roundedBox(H.w, 0.012, H.d, 0.004)} material={mats.housing} position={[0, 0.006, 0]} castShadow />
            <mesh position={[0, 0.0122, 0.012]} geometry={roundedBox(0.05, 0.0012, 0.08, 0.0005)} material={mats.label} />
            <mesh position={[0, -0.0005, 0]} rotation={[Math.PI / 2, 0, 0]} material={mats.cut}>
              <planeGeometry args={[H.w - 0.004, H.d - 0.004]} />
            </mesh>
            <mesh position={[0, -0.0012, 0]} geometry={roundedBox(H.w - 0.006, 0.0016, H.d - 0.006, 0.0007)} material={mats.gasket} />
          </group>
        </>
      ) : (
        <>
          {/* the closed housing: body, the label panel, three ribs, the vent, the boss */}
          <mesh geometry={roundedBox(H.w, H.h, H.d, 0.012, 4)} material={mats.housing} position={[0, H.h / 2, 0]} castShadow receiveShadow />
          <mesh geometry={roundedBox(0.05, 0.0016, 0.08, 0.0006)} material={mats.label} position={[0, H.h + 0.0002, 0.012]} />
          {[0, 1, 2].map((k) => (
            <mesh key={k} geometry={roundedBox(0.056, 0.004, 0.004, 0.0015)} material={mats.housingDark} position={[0, H.h + 0.001, -0.042 - k * 0.009]} castShadow />
          ))}
          <group position={[-H.w / 2 - 0.0002, 0.03, -0.035]}>
            <mesh rotation={[0, 0, Math.PI / 2]} material={mats.housingDark}>
              <cylinderGeometry args={[0.008, 0.008, 0.003, 20]} />
            </mesh>
            <mesh position={[-0.0018, 0, 0]} rotation={[0, -Math.PI / 2, 0]} material={mats.port}>
              <circleGeometry args={[0.0038, 16]} />
            </mesh>
          </group>
          {boss}
        </>
      )}

      {open ? (
        <>
          {/* the coin cell, its two welded tabs */}
          <group position={at('battery', lift('battery'))}>
            <mesh material={[mats.cell, mats.cellTop, mats.cell]} castShadow>
              <cylinderGeometry args={[0.031, 0.031, 0.009, 48]} />
            </mesh>
            <mesh position={[0, 0.0052, -0.03]} material={mats.tab} castShadow>
              <boxGeometry args={[0.012, 0.0012, 0.022]} />
            </mesh>
            <mesh position={[0, -0.0052, 0.03]} material={mats.tab}>
              <boxGeometry args={[0.012, 0.0012, 0.022]} />
            </mesh>
            {lit(glowOf('battery'), [0.066, 0.013, 0.066], [0, 0, 0])}
          </group>
          {/* the board: solder mask with traces and silkscreen, the small parts on it */}
          <group position={at('board')}>
            <mesh material={[mats.pcb, mats.pcb, mats.pcbTop, mats.pcb, mats.pcb, mats.pcb]} castShadow receiveShadow>
              <boxGeometry args={[0.066, 0.004, 0.126]} />
            </mesh>
            {PASSIVES.map((p, i) => (
              <mesh key={i} position={[p.x, 0.0032, p.z]} material={p.cap ? mats.capPart : mats.resistor} castShadow>
                <boxGeometry args={p.alongX ? [0.0065, 0.0024, 0.0034] : [0.0034, 0.0024, 0.0065]} />
              </mesh>
            ))}
            {/* the crystal (a small metal can) and the low-frequency wake-up coil (a ferrite bobbin) */}
            <mesh position={[0.022, 0.0045, -0.012]} geometry={roundedBox(0.008, 0.0045, 0.014, 0.0012)} material={mats.lidMetal} castShadow />
            <group position={[-0.024, 0.006, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
              <mesh material={mats.ferrite} castShadow>
                <cylinderGeometry args={[0.0045, 0.0045, 0.018, 16]} />
              </mesh>
              {[-1, 1].map((s) => (
                <mesh key={s} position={[0, s * 0.0095, 0]} material={mats.ferrite}>
                  <cylinderGeometry args={[0.0062, 0.0062, 0.0018, 16]} />
                </mesh>
              ))}
            </group>
          </group>
          {/* pressure sensor: a metal-lidded package with its port */}
          <group position={at('pressure', 0.006 + lift('pressure'))}>
            <mesh geometry={roundedBox(0.03, 0.01, 0.03, 0.002)} material={mats.lidMetal} castShadow />
            <mesh position={[0, 0.0052, 0]} rotation={[-Math.PI / 2, 0, 0]} material={mats.port}>
              <circleGeometry args={[0.005, 20]} />
            </mesh>
            <mesh position={[0, 0.0051, 0]} rotation={[-Math.PI / 2, 0, 0]} material={mats.chip}>
              <ringGeometry args={[0.005, 0.0075, 24]} />
            </mesh>
            {lit(glowOf('pressure'), [0.036, 0.014, 0.036], [0, 0, 0])}
          </group>
          {/* motion sensor: a small square package */}
          <group position={at('motion', 0.005 + lift('motion'))}>
            <mesh geometry={roundedBox(0.018, 0.006, 0.018, 0.001)} material={mats.chip} castShadow />
            <mesh position={[-0.006, 0.0031, -0.006]} rotation={[-Math.PI / 2, 0, 0]} material={mats.chipTop}>
              <circleGeometry args={[0.0012, 10]} />
            </mesh>
            {lit(Math.max(glowOf('motion'), wake), [0.024, 0.01, 0.024], [0, 0, 0])}
          </group>
          {/* the computer: the biggest chip, its invented legend on top, its leads */}
          <group position={at('computer', 0.005 + lift('computer'))}>
            <mesh material={[mats.chip, mats.chip, mats.chipTop, mats.chip, mats.chip, mats.chip]} castShadow>
              <boxGeometry args={[0.032, 0.006, 0.032]} />
            </mesh>
            {[-1, 1].map((s) => (
              <mesh key={s} position={[s * 0.0168, -0.0022, 0]} material={mats.tab}>
                <boxGeometry args={[0.0018, 0.0012, 0.028]} />
              </mesh>
            ))}
            {lit(glowOf('computer'), [0.038, 0.01, 0.038], [0, 0, 0])}
          </group>
          {/* the antenna: a formed metal strip along the board's edge on two legs (orange when it's the radio) */}
          <group position={at('radio', lift('radio'))}>
            <mesh material={mats.antenna} castShadow>
              <boxGeometry args={[0.004, 0.004, H.d - 0.03]} />
            </mesh>
            {[-1, 1].map((s) => (
              <mesh key={s} position={[0, -0.006, s * (H.d / 2 - 0.017)]} material={mats.antenna}>
                <boxGeometry args={[0.004, 0.012, 0.004]} />
              </mesh>
            ))}
            <mesh material={mats.antennaGlow} scale={[1.6, 1.6, 1.02]} userData={{glow: true}} visible={radio > 0.01}>
              <boxGeometry args={[0.004, 0.004, H.d - 0.03]} />
            </mesh>
          </group>
        </>
      ) : null}

      {/* the node dot (the system), on top: off, dim, or full and bloomed */}
      <group position={sensorPartAt('node', e)} scale={open ? 0.7 : 1}>
        <mesh material={d < 0.02 ? mats.dotOff : mats.dotDim} userData={{noFill: true}}>
          <sphereGeometry args={[DOT_R, 20, 14]} />
        </mesh>
        <mesh material={mats.dotGlow} userData={{glow: true}} visible={d > 0.41} scale={1.15}>
          <sphereGeometry args={[DOT_R, 20, 14]} />
        </mesh>
      </group>
      {!open && wake > 0.01 ? (
        <mesh position={[0, H.h + 0.003, 0]} rotation={[-Math.PI / 2, 0, 0]} material={mats.lit}>
          <planeGeometry args={[H.w * 0.6, H.d * 0.4]} />
        </mesh>
      ) : null}
    </group>
  );
};
