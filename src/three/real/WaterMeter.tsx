import React, {useMemo} from 'react';
import * as THREE from 'three';
import {fonts} from '../../fonts';
import {REAL, section, STREET} from '../../theme';
import {raw, roundedBox} from '../plaster';
import {cutMaterial, InkLine} from '../section/cutLook';
import {useFontsLoaded} from '../section/useFontsLoaded';
import {applyAlbedo, applyEnv, useAlbedo, useEnvStrength, useStudioEnv} from './useStudioEnv';

type V3 = [number, number, number];

/*
 * The meter-box focus objects (No. 004), realistic and generic (no maker, invented legends), in metres:
 *  - `WaterMeter`: a residential positive-displacement meter (5/8 × 3/4 in class): a cast bronze body
 *    with a round measuring chamber, bolted top flange, threaded spuds, brass coupling nuts and
 *    tailpieces; on top the register (black housing, glass lens, dial face with odometer digits, the sweep
 *    hand and the red leak triangle on its own small dial) under an open hinged lid.
 *  - `RadioModule`: the grey potted radio endpoint with an invented label, two cable glands and the node
 *    dot (the system: orange while sending).
 *  - `LidAntenna`: the flat round black cap (≈ 114 mm, 4.5 in) on a threaded stem with its nut, for a
 *    1¾ in hole in the lid.
 * Frames: the meter's flow axis is x (inlet +x), up y, origin at the body's axis; the radio's origin at
 * the middle of its top; the antenna's origin at the lid's top surface, the stem going down −y.
 */

export const METER = {
  /** Body axis to the register's dial face (y), the dial's radius. */
  dialY: 0.094,
  dialR: 0.046,
  /** End to end over the tailpieces (x). */
  length: 0.33,
  /** Where the three-wire cable enters the register (local). */
  wireIn: [-0.045, 0.082, 0.02] as V3,
};
export const RADIO = {
  w: 0.105,
  h: 0.072,
  d: 0.058,
  /** gland where the meter cable leaves (local) */ wireOut: [-0.03, -0.072, 0] as V3,
  coaxIn: [0.03, 0, 0] as V3,
};
export const ANTENNA = {capR: 0.057, capH: 0.016, stemR: 0.016, stemL: 0.085};

const useDrawn = (w: number, h: number, key: string, draw: (c: CanvasRenderingContext2D) => void) => {
  const ready = useFontsLoaded();
  const tex = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return {c, t, key: ''};
  }, [w, h]);
  if (ready && tex.key !== key) {
    draw(tex.c.getContext('2d')!);
    tex.t.needsUpdate = true;
    tex.key = key;
  }
  return ready ? tex.t : null;
};

/** The register's dial face: ring of ten, odometer window, units, the leak dial's ring (the triangle is a mesh). */
export const drawDial = (cx: CanvasRenderingContext2D, reading: string) => {
  const S = 512;
  cx.clearRect(0, 0, S, S);
  cx.fillStyle = STREET.dial;
  cx.beginPath();
  cx.arc(256, 256, 254, 0, Math.PI * 2);
  cx.fill();
  cx.strokeStyle = STREET.dialInk;
  cx.fillStyle = STREET.dialInk;
  // the sweep ring: 100 ticks, numbers every 10
  for (let i = 0; i < 100; i++) {
    const a = (i / 100) * Math.PI * 2 - Math.PI / 2;
    const r0 = i % 10 === 0 ? 206 : i % 5 === 0 ? 220 : 228;
    cx.lineWidth = i % 10 === 0 ? 5 : 2.5;
    cx.beginPath();
    cx.moveTo(256 + Math.cos(a) * r0, 256 + Math.sin(a) * r0);
    cx.lineTo(256 + Math.cos(a) * 240, 256 + Math.sin(a) * 240);
    cx.stroke();
    if (i % 10 === 0) {
      cx.font = `600 30px ${fonts.sans}, Arial`;
      cx.textAlign = 'center';
      cx.textBaseline = 'middle';
      cx.fillText(String(i / 10), 256 + Math.cos(a) * 180, 256 + Math.sin(a) * 180);
    }
  }
  // the odometer window (black wheels, white digits; the last wheel white with black)
  const n = reading.length;
  const cw = 34;
  const x0 = 256 - (n * cw) / 2;
  for (let i = 0; i < n; i++) {
    const last = i >= n - 1;
    cx.fillStyle = last ? STREET.dial : STREET.dialInk;
    cx.fillRect(x0 + i * cw + 1, 196, cw - 2, 52);
    cx.fillStyle = last ? STREET.dialInk : STREET.radioLabel;
    cx.font = `700 40px ${fonts.mono}, monospace`;
    cx.textAlign = 'center';
    cx.textBaseline = 'middle';
    cx.fillText(reading[i], x0 + i * cw + cw / 2, 224);
  }
  cx.strokeStyle = STREET.dialInk;
  cx.lineWidth = 3;
  cx.strokeRect(x0 - 3, 193, n * cw + 6, 58);
  cx.fillStyle = STREET.dialInk;
  cx.font = `700 24px ${fonts.sans}, Arial`;
  cx.fillText('U.S. GALLONS', 256, 286);
  cx.font = `600 18px ${fonts.sans}, Arial`;
  cx.fillText('MODEL WM-58  ·  5/8 × 3/4', 256, 380);
  // the leak dial's ring (upper left): the triangle spins over it
  cx.lineWidth = 3;
  cx.beginPath();
  cx.arc(170, 140, 34, 0, Math.PI * 2);
  cx.stroke();
};

/** Position of the leak dial's centre on the dial face (local, metres). */
export const LEAK_AT: [number, number] = [((170 - 256) / 256) * 0.046, ((140 - 256) / 256) * 0.046];

export type WaterMeterProps = {
  position?: V3;
  /** Rotation about y (rad). */
  yaw?: number;
  /** Sweep hand angle, in turns (1 = one revolution of the big hand). */
  sweep?: number;
  /** Leak triangle angle, in turns. */
  leak?: number;
  /** The register lid's opening, 0 (shut) to 1 (open, ≈ 110°). Default 1. */
  lidOpen?: number;
  /** The odometer digits (🎭 illustrative). */
  reading?: string;
};

/** A residential water meter (see the file comment). */
export const WaterMeter: React.FC<WaterMeterProps> = ({
  position = [0, 0, 0],
  yaw = 0,
  sweep = 0,
  leak = 0,
  lidOpen = 1,
  reading = '01462',
}) => {
  const env = useStudioEnv();
  const envScale = useEnvStrength();
  const albedo = useAlbedo();
  const dial = useDrawn(512, 512, reading, (c) => drawDial(c, reading));
  const mats = useMemo(() => {
    const phys = (c: string, o: THREE.MeshPhysicalMaterialParameters = {}) =>
      new THREE.MeshPhysicalMaterial({color: raw(c), ...o});
    return {
      bronze: phys(STREET.bronze, {metalness: 0.85, roughness: 0.52, clearcoat: 0.15, clearcoatRoughness: 0.6}),
      bronzeDark: phys(STREET.bronzeDark, {metalness: 0.8, roughness: 0.6}),
      brass: phys(STREET.brassNut, {metalness: 0.95, roughness: 0.34}),
      bolt: phys(REAL.screw, {metalness: 1, roughness: 0.38}),
      housing: phys(STREET.register, {roughness: 0.42, clearcoat: 0.4}),
      lens: phys(STREET.lamp, {
        roughness: 0.03,
        transmission: 0,
        transparent: true,
        opacity: 0.18,
        clearcoat: 1,
        depthWrite: false,
      }),
      dial: new THREE.MeshStandardMaterial({color: raw('#ffffff'), roughness: 0.6}),
      hand: phys(STREET.dialInk, {roughness: 0.4}),
      // the leak triangle: the real object's red, flat (no emissive, never bloomed)
      leak: new THREE.MeshStandardMaterial({color: raw(section.leakRed), roughness: 0.45}),
    };
  }, []);
  if (dial && mats.dial.map !== dial) {
    mats.dial.map = dial;
    mats.dial.needsUpdate = true;
  }
  applyEnv(
    env,
    [
      [mats.bronze, 0.9],
      [mats.bronzeDark, 0.7],
      [mats.brass, 1.1],
      [mats.bolt, 1],
      [mats.housing, 0.6],
      [mats.lens, 1.4],
    ],
    envScale,
  );
  applyAlbedo([mats.bronze, mats.bronzeDark, mats.brass, mats.housing, mats.hand, mats.leak], albedo);

  const geo = useMemo(() => {
    const tri = new THREE.Shape();
    tri.moveTo(0, 0.0085);
    tri.lineTo(-0.0074, -0.0043);
    tri.lineTo(0.0074, -0.0043);
    tri.closePath();
    const hex = new THREE.CylinderGeometry(0.031, 0.031, 0.026, 6);
    hex.rotateZ(Math.PI / 2);
    const thread = new THREE.TorusGeometry(0.0205, 0.0016, 6, 24);
    thread.rotateY(Math.PI / 2);
    return {
      chamber: new THREE.CylinderGeometry(0.058, 0.054, 0.072, 40),
      flange: new THREE.CylinderGeometry(0.064, 0.064, 0.012, 40),
      body: (() => {
        const g = new THREE.CylinderGeometry(0.032, 0.032, 0.17, 28);
        g.rotateZ(Math.PI / 2);
        return g;
      })(),
      spud: (() => {
        const g = new THREE.CylinderGeometry(0.021, 0.021, 0.03, 24);
        g.rotateZ(Math.PI / 2);
        return g;
      })(),
      tail: (() => {
        const g = new THREE.CylinderGeometry(0.016, 0.017, 0.045, 20);
        g.rotateZ(Math.PI / 2);
        return g;
      })(),
      hex,
      thread,
      bolt: new THREE.CylinderGeometry(0.0055, 0.0055, 0.008, 6),
      housing: new THREE.CylinderGeometry(0.052, 0.054, 0.03, 40),
      lens: new THREE.CylinderGeometry(0.047, 0.047, 0.004, 40),
      dial: new THREE.CircleGeometry(METER.dialR, 48),
      lid: new THREE.CylinderGeometry(0.054, 0.054, 0.006, 40),
      hinge: (() => {
        const g = new THREE.CylinderGeometry(0.004, 0.004, 0.03, 10);
        g.rotateZ(Math.PI / 2);
        return g;
      })(),
      hand: new THREE.BoxGeometry(0.0022, 0.0012, 0.04),
      hub: new THREE.CylinderGeometry(0.0035, 0.0035, 0.002, 12),
      tri: new THREE.ShapeGeometry(tri),
    };
  }, []);

  const lidA = -(Math.PI * 0.61) * lidOpen;
  return (
    <group position={position} rotation={[0, yaw, 0]}>
      {/* the bronze body: flow tube, measuring chamber, bolted top flange */}
      <mesh geometry={geo.body} material={mats.bronze} castShadow receiveShadow />
      <mesh geometry={geo.chamber} material={mats.bronze} position={[0, 0.012, 0]} castShadow receiveShadow />
      <mesh geometry={geo.flange} material={mats.bronzeDark} position={[0, 0.052, 0]} castShadow />
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const a = (i / 6) * Math.PI * 2 + 0.3;
        return (
          <mesh
            key={i}
            geometry={geo.bolt}
            material={mats.bolt}
            position={[Math.cos(a) * 0.058, 0.061, Math.sin(a) * 0.058]}
          />
        );
      })}
      {/* threaded spuds, brass coupling nuts, tailpieces (both ends) */}
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh geometry={geo.spud} material={mats.bronze} position={[s * 0.1, 0, 0]} castShadow />
          {[0, 1, 2].map((k) => (
            <mesh key={k} geometry={geo.thread} material={mats.bronzeDark} position={[s * (0.091 + k * 0.006), 0, 0]} />
          ))}
          <mesh geometry={geo.hex} material={mats.brass} position={[s * 0.127, 0, 0]} castShadow />
          <mesh geometry={geo.tail} material={mats.brass} position={[s * 0.16, 0, 0]} castShadow />
        </group>
      ))}
      {/* the register: housing, dial, hands, lens; the hinged lid open toward −z */}
      <group position={[0, 0.058, 0]}>
        <mesh geometry={geo.housing} material={mats.housing} position={[0, 0.015, 0]} castShadow receiveShadow />
        <mesh
          geometry={geo.dial}
          material={mats.dial}
          position={[0, METER.dialY - 0.058 - 0.004, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        />
        <group position={[0, METER.dialY - 0.058 - 0.003, 0]} rotation={[0, -sweep * Math.PI * 2, 0]}>
          <mesh geometry={geo.hand} material={mats.hand} position={[0, 0, -0.014]} />
          <mesh geometry={geo.hub} material={mats.hand} />
        </group>
        <group
          position={[LEAK_AT[0], METER.dialY - 0.058 - 0.0032, LEAK_AT[1]]}
          rotation={[-Math.PI / 2, 0, -leak * Math.PI * 2]}
        >
          <mesh geometry={geo.tri} material={mats.leak} />
        </group>
        <mesh geometry={geo.lens} material={mats.lens} position={[0, 0.032, 0]} />
        <mesh geometry={geo.hinge} material={mats.housing} position={[0, 0.032, -0.054]} />
        <group position={[0, 0.033, -0.054]} rotation={[lidA, 0, 0]}>
          <mesh geometry={geo.lid} material={mats.housing} position={[0, 0.003, 0.054]} castShadow />
        </group>
      </group>
    </group>
  );
};

export type RadioModuleProps = {
  position?: V3;
  yaw?: number;
  /** The node dot, 0 (idle, `ledOff`) to 1 (sending, orange, bloomed). */
  dot?: number;
  /**
   * The object cut-away (§ 3), 0 (closed) to 1 (open): the potted block splits along its middle, the
   * front half slides off to the right and fades, and the back half's cut face (hatched potting) shows
   * what is cast inside: two slim lithium cells (dark foil, invented label), the small board with an
   * invented chip legend, the coax lead and the three wires. The node dot moves to the board.
   */
  open?: number;
};

/** Inside the potting (module-local, origin at the middle of the top; the cut face at z = 0). */
const CELL = {r: 0.0085, len: 0.052, ys: [-0.024, -0.048], x: -0.018};
const BOARD = {w: 0.034, h: 0.05, x: 0.03, y: -0.036};

/** The grey potted radio endpoint (see the file comment). Origin at the middle of its top. */
export const RadioModule: React.FC<RadioModuleProps> = ({position = [0, 0, 0], yaw = 0, dot = 0, open = 0}) => {
  const env = useStudioEnv();
  const envScale = useEnvStrength();
  const albedo = useAlbedo();
  const label = useDrawn(512, 256, 'radio', (cx) => {
    cx.fillStyle = STREET.radioLabel;
    cx.fillRect(0, 0, 512, 256);
    cx.fillStyle = STREET.dialInk;
    cx.font = `800 54px ${fonts.sans}, Arial`;
    cx.textAlign = 'left';
    cx.textBaseline = 'top';
    cx.fillText('RF-ENDPOINT 2', 26, 22);
    cx.font = `600 30px ${fonts.mono}, monospace`;
    cx.fillText('ID 30514827', 26, 98);
    cx.fillText('LITHIUM · DO NOT OPEN', 26, 142);
    // a printed barcode (fixed bars from the index, no randomness)
    for (let i = 0; i < 64; i++) {
      const w = 2 + ((i * 7) % 4);
      if ((i * 13) % 5 < 3) cx.fillRect(26 + i * 7, 192, w, 46);
    }
  });
  const cellLabel = useDrawn(512, 160, 'cell', (cx) => {
    cx.fillStyle = REAL.battery;
    cx.fillRect(0, 0, 512, 160);
    cx.fillStyle = REAL.batteryInk;
    cx.font = `800 46px ${fonts.sans}, Arial`;
    cx.textBaseline = 'middle';
    cx.fillText('LC-14 3.6V', 30, 56);
    cx.font = `600 30px ${fonts.mono}, monospace`;
    cx.fillText('LITHIUM CELL · 2.6Ah', 30, 112);
  });
  const chip = useDrawn(256, 256, 'chip', (cx) => {
    cx.fillStyle = REAL.chip;
    cx.fillRect(0, 0, 256, 256);
    cx.fillStyle = REAL.chipInk;
    cx.font = `700 44px ${fonts.mono}, monospace`;
    cx.textAlign = 'center';
    cx.textBaseline = 'middle';
    cx.fillText('RFX-9', 128, 100);
    cx.font = `600 30px ${fonts.mono}, monospace`;
    cx.fillText('2417 A3', 128, 160);
    cx.beginPath();
    cx.arc(40, 40, 12, 0, Math.PI * 2);
    cx.fill();
  });
  const mats = useMemo(() => {
    const phys = (c: string, o: THREE.MeshPhysicalMaterialParameters = {}) =>
      new THREE.MeshPhysicalMaterial({color: raw(c), ...o});
    const cutFace = cutMaterial();
    return {
      body: phys(STREET.radio, {roughness: 0.55, clearcoat: 0.2}),
      shell: phys(STREET.radio, {roughness: 0.55, clearcoat: 0.2, transparent: true}),
      cut: cutFace,
      gland: phys(STREET.cable, {roughness: 0.5}),
      label: new THREE.MeshStandardMaterial({color: raw('#ffffff'), roughness: 0.7}),
      cell: new THREE.MeshPhysicalMaterial({color: raw('#ffffff'), roughness: 0.4, clearcoat: 0.6}),
      cap: phys(REAL.screw, {metalness: 1, roughness: 0.3}),
      pcb: phys(REAL.pcb, {roughness: 0.38, clearcoat: 0.5}),
      chip: new THREE.MeshPhysicalMaterial({color: raw('#ffffff'), roughness: 0.5}),
      pad: phys(REAL.pad, {metalness: 0.9, roughness: 0.35}),
      wire: phys(STREET.cable, {roughness: 0.5}),
      wireGrey: phys(REAL.cap, {roughness: 0.5}),
      on: new THREE.MeshBasicMaterial({color: raw(section.orange)}),
      off: new THREE.MeshStandardMaterial({color: raw(section.ledOff), roughness: 0.4}),
    };
  }, []);
  for (const [m, t] of [
    [mats.label, label],
    [mats.cell, cellLabel],
    [mats.chip, chip],
  ] as [THREE.MeshStandardMaterial, THREE.Texture | null][]) {
    if (t && m.map !== t) {
      m.map = t;
      m.needsUpdate = true;
    }
  }
  applyEnv(
    env,
    [
      [mats.body, 0.6],
      [mats.shell, 0.6],
      [mats.cap, 1],
      [mats.pad, 1],
      [mats.cell, 0.6],
    ],
    envScale,
  );
  applyAlbedo([mats.body, mats.shell, mats.gland, mats.pcb, mats.wire], albedo);
  const geo = useMemo(() => {
    const cell = new THREE.CylinderGeometry(CELL.r, CELL.r, CELL.len, 28);
    cell.rotateZ(Math.PI / 2);
    const capG = new THREE.CylinderGeometry(CELL.r * 0.55, CELL.r * 0.55, 0.003, 16);
    capG.rotateZ(Math.PI / 2);
    const tube = (pts: V3[], r: number) =>
      new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p))), 24, r, 6, false);
    const z = 0.004;
    return {
      whole: roundedBox(RADIO.w, RADIO.h, RADIO.d, 0.008, 4),
      half: roundedBox(RADIO.w, RADIO.h, RADIO.d / 2, 0.006, 3),
      gland: new THREE.CylinderGeometry(0.007, 0.008, 0.014, 6),
      dot: new THREE.SphereGeometry(0.0055, 14, 10),
      cell,
      capG,
      board: new THREE.BoxGeometry(BOARD.w, BOARD.h, 0.0016),
      chip: new THREE.BoxGeometry(0.014, 0.014, 0.002),
      part: new THREE.BoxGeometry(0.004, 0.0022, 0.0015),
      coax: tube(
        [
          [RADIO.coaxIn[0], 0.0, z],
          [RADIO.coaxIn[0], -0.008, z],
          [BOARD.x + 0.006, BOARD.y + BOARD.h / 2 + 0.002, z],
        ],
        0.0022,
      ),
      leads: [0, 1].map((k) =>
        tube(
          [
            [CELL.x + CELL.len / 2, CELL.ys[k], z],
            [CELL.x + CELL.len / 2 + 0.006, CELL.ys[k], z],
            [BOARD.x - BOARD.w / 2, BOARD.y - 0.01 + k * 0.006, z],
          ],
          0.0011,
        ),
      ),
      wires: [-1, 0, 1].map((k) =>
        tube(
          [
            [BOARD.x - 0.006 + k * 0.004, BOARD.y - BOARD.h / 2, z],
            [RADIO.wireOut[0] + k * 0.003, -RADIO.h + 0.012, z],
            [RADIO.wireOut[0] + k * 0.0015, -RADIO.h, z],
          ],
          0.001,
        ),
      ),
    };
  }, []);
  const k = Math.max(0, Math.min(1, open));
  const lit = dot > 0.05;
  const dotMesh = (p: V3) => (
    <mesh
      geometry={geo.dot}
      material={lit ? mats.on : mats.off}
      position={p}
      userData={{glow: lit}}
      scale={lit ? 1 + 0.4 * dot : 1}
    />
  );
  const glands = (
    <>
      <mesh geometry={geo.gland} material={mats.gland} position={[RADIO.wireOut[0], -RADIO.h - 0.006, 0]} />
      <mesh geometry={geo.gland} material={mats.gland} position={[RADIO.coaxIn[0], 0.006, 0]} />
    </>
  );
  if (k <= 0.001) {
    return (
      <group position={position} rotation={[0, yaw, 0]}>
        <mesh geometry={geo.whole} material={mats.body} position={[0, -RADIO.h / 2, 0]} castShadow receiveShadow />
        <mesh material={mats.label} position={[0, -RADIO.h / 2 - 0.004, RADIO.d / 2 + 0.0008]}>
          <planeGeometry args={[RADIO.w * 0.82, RADIO.w * 0.41]} />
        </mesh>
        {glands}
        {dotMesh([RADIO.w / 2 - 0.012, -0.011, RADIO.d / 2 + 0.002])}
      </group>
    );
  }
  // open: the front half slides right and toward the camera, fading; the back half shows its cut face
  mats.shell.opacity = 1 - k;
  mats.shell.depthWrite = k < 0.5;
  const front: V3 = [0.09 * k, -0.01 * k, RADIO.d / 4 + 0.05 * k];
  const ink: V3[] = [
    [-RADIO.w / 2, 0, 0.0006],
    [RADIO.w / 2, 0, 0.0006],
    [RADIO.w / 2, -RADIO.h, 0.0006],
    [-RADIO.w / 2, -RADIO.h, 0.0006],
  ];
  return (
    <group position={position} rotation={[0, yaw, 0]}>
      {/* the back half: grey outside, its front (the split) a hatched cut face */}
      <group position={[0, -RADIO.h / 2, -RADIO.d / 4]}>
        <mesh geometry={geo.half} material={mats.body} castShadow receiveShadow />
      </group>
      <mesh material={mats.cut} position={[0, -RADIO.h / 2, 0.0003]}>
        <planeGeometry args={[RADIO.w - 0.002, RADIO.h - 0.002]} />
      </mesh>
      <InkLine points={ink} thickness={0.0012} />
      {/* cast in the potting, half proud of the cut: two cells, the board, the leads */}
      {CELL.ys.map((y, i) => (
        <group key={i} position={[CELL.x, y, 0]}>
          <mesh geometry={geo.cell} material={mats.cell} rotation={[0.2, 0, 0]} />
          <mesh geometry={geo.capG} material={mats.cap} position={[CELL.len / 2 + 0.0015, 0, 0]} />
        </group>
      ))}
      <mesh geometry={geo.board} material={mats.pcb} position={[BOARD.x, BOARD.y, 0.0012]} />
      <mesh geometry={geo.chip} material={mats.chip} position={[BOARD.x, BOARD.y + 0.004, 0.0028]} />
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh
          key={i}
          geometry={geo.part}
          material={i % 2 ? mats.pad : mats.wireGrey}
          position={[BOARD.x - 0.011 + i * 0.0055, BOARD.y - 0.014, 0.0024]}
        />
      ))}
      <mesh geometry={geo.coax} material={mats.wire} />
      {geo.leads.map((g, i) => (
        <mesh key={i} geometry={g} material={i ? mats.wire : mats.wireGrey} />
      ))}
      {geo.wires.map((g, i) => (
        <mesh key={i} geometry={g} material={i === 1 ? mats.wireGrey : mats.wire} />
      ))}
      {dotMesh([BOARD.x + 0.011, BOARD.y + BOARD.h / 2 - 0.006, 0.003])}
      {glands}
      {/* the front half, sliding off */}
      <group position={front} visible={k < 0.99}>
        <mesh geometry={geo.half} material={mats.shell} position={[0, -RADIO.h / 2, 0]} />
      </group>
    </group>
  );
};

/** The lid antenna: the flat round black cap on top of the lid, the threaded stem and nut below it. */
export const LidAntenna: React.FC<{position?: V3}> = ({position = [0, 0, 0]}) => {
  const env = useStudioEnv();
  const envScale = useEnvStrength();
  const albedo = useAlbedo();
  const mats = useMemo(() => {
    const phys = (c: string, o: THREE.MeshPhysicalMaterialParameters = {}) =>
      new THREE.MeshPhysicalMaterial({color: raw(c), ...o});
    return {
      cap: phys(STREET.cap, {roughness: 0.5, clearcoat: 0.35, clearcoatRoughness: 0.4}),
      stem: phys(STREET.stem, {roughness: 0.6}),
      nut: phys(REAL.screw, {metalness: 0.9, roughness: 0.4}),
    };
  }, []);
  applyEnv(
    env,
    [
      [mats.cap, 0.9],
      [mats.nut, 1],
    ],
    envScale,
  );
  applyAlbedo([mats.cap, mats.stem], albedo);
  const geo = useMemo(() => {
    // the cap: a low profile disc with a softly domed top and a rounded rim (lathed)
    const R = ANTENNA.capR;
    const H = ANTENNA.capH;
    const pts: THREE.Vector2[] = [new THREE.Vector2(0, H)];
    for (let i = 1; i <= 12; i++) {
      const u = i / 12;
      pts.push(new THREE.Vector2(u * (R - 0.006), H - 0.004 * u * u));
    }
    for (let i = 1; i <= 6; i++) {
      const a = (i / 6) * (Math.PI / 2);
      pts.push(new THREE.Vector2(R - 0.006 + Math.sin(a) * 0.006, H - 0.004 - (1 - Math.cos(a)) * (H - 0.004)));
    }
    pts.push(new THREE.Vector2(R, 0), new THREE.Vector2(0, 0));
    const ring = new THREE.TorusGeometry(R * 0.62, 0.0011, 6, 64);
    ring.rotateX(Math.PI / 2);
    const thread = new THREE.TorusGeometry(ANTENNA.stemR + 0.0005, 0.0013, 6, 24);
    thread.rotateX(Math.PI / 2);
    return {
      // the profile runs centre → rim, so reverse it for outward-facing normals
      cap: new THREE.LatheGeometry(pts.reverse(), 64),
      ring,
      stem: new THREE.CylinderGeometry(ANTENNA.stemR, ANTENNA.stemR, ANTENNA.stemL, 24),
      thread,
      nut: new THREE.CylinderGeometry(0.028, 0.028, 0.012, 6),
    };
  }, []);
  return (
    <group position={position}>
      <mesh geometry={geo.cap} material={mats.cap} castShadow receiveShadow />
      {/* a moulded ring on the top (a real cap's seam) */}
      <mesh geometry={geo.ring} material={mats.stem} position={[0, ANTENNA.capH - 0.0022, 0]} />
      <mesh geometry={geo.stem} material={mats.stem} position={[0, -ANTENNA.stemL / 2, 0]} />
      {[0, 1, 2, 3, 4, 5, 6].map((k) => (
        <mesh key={k} geometry={geo.thread} material={mats.stem} position={[0, -0.05 - k * 0.0045, 0]} />
      ))}
      <mesh geometry={geo.nut} material={mats.nut} position={[0, -0.046, 0]} />
    </group>
  );
};
