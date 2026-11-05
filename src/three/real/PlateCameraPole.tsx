import React, {useMemo} from 'react';
import * as THREE from 'three';
import {CITY, REAL, section, type Mood} from '../../theme';
import {raw, roundedBox} from '../plaster';
import {RadioPulse, PULSE_LIFE} from '../TirePieces';
import {CutOutline, cutMaterial, type Rect} from '../section/cutLook';
import {GlowNode, GlowPolyline, NODE_SCALE} from '../section/GlowLines';
import {SECTION_ANGLE} from '../section/SectionCamera';

type V3 = [number, number, number];

/*
 * No. 015 N1: a generic plate-reading camera on its own pole, the kind put up at a city corner. A slim dark pole
 * (`CITY.mast`, like the signal's), a small solar panel on top (its cells a texture), a short arm holding a small camera
 * housing with a sun hood, the lens and an infrared LED ring round it; lower down a small modem box with a stub antenna
 * and a battery box. No logo, text, sticker or brand colour anywhere.
 *
 * The hidden system (orange, style guide § 5): the status dot on the housing's back (`status`), the IR pulse (a faint
 * cone, halo only, ≤ 25 %, from the lens to the plate, with the LED ring lit; `ir`, ruling v0.18.7: ≤ 0.6 s a pulse, in
 * 4 frames, out over 10, never steady, no light source), the stills peeling off the lens (`shots`), the rings from the
 * antenna (`rings`) and the path up out of the frame (`uplink`). Everything else keeps its real colours.
 *
 * The cut-away (`cut`, § 3 object cut-aways): the housing's near half (the half toward the camera) is cut away top-down
 * over 0.8 s, leaving the far half with its cut edges hatched and inked, and the inside, realistic like a repair photo:
 * the lens barrel, the LED ring board, a small main board with chips (invented legends), the cable out to the modem.
 *
 * World: metres, y up. `position` is the pole's foot on the sidewalk; the housing hangs at the end of an arm toward
 * −x (the street) and points at `aim`.
 */

/** The pole's sizes (metres). */
export const POLE = {
  height: 4.0,
  r: 0.055,
  /** The arm toward the street, at this height; the housing hangs from its end. */
  armY: 2.85,
  armLength: 0.42,
  /** The housing: width (across), height, length (along its aim). */
  housing: {w: 0.15, h: 0.13, l: 0.36},
  wall: 0.012,
  /** The modem box and the battery box (on the pole's camera side, +z). */
  modem: {w: 0.22, h: 0.28, d: 0.1, y: 2.1},
  battery: {w: 0.3, h: 0.42, d: 0.16, y: 1.4},
  antenna: 0.15,
  panel: {w: 0.72, d: 0.5, t: 0.035, tilt: 0.62},
};

/** The IR cone: radius at the lens and at the plate (≤ the plate's half-height, 0.076 m), and its halo's opacity. */
export const CONE = {r0: 0.03, r1: 0.065, alpha: 0.14};

/** A key that switches something on or off from `at` (s). */
export type OnKey = {at: number; on: boolean};
/** A run of IR pulses: `every` s apart from `from` to `to` (each pulse ≤ 0.6 s). */
export type PulseRun = {from: number; to: number; every?: number};

export type PlateCameraKeys = {
  /** The status dot: on (`orange`, active; default) or off (`ledOff`), or keys. */
  status?: boolean | OnKey[];
  /** One-shot swells of the status dot (s), e.g. as each label lands in the camera view. */
  statusPulses?: number[];
  /** IR pulses (s): a list of times, or runs. Each lights the LED ring and the cone for ≤ 0.6 s. */
  ir?: (number | PulseRun)[];
  /** Captures (s): 3 small orange-edged stills peel off the lens and fold back into the housing over 0.6 s. */
  shots?: number[];
  /** The cut-away: opens (top-down over 0.8 s) and closes (bottom-up) on keys. Default closed. */
  cut?: OnKey[];
  /** Rings rise from the antenna's tip at these times (No. 009 / 012 ring grammar). */
  rings?: number[];
  /**
   * The path leaves the antenna's tip at `at`: up 12 cm, across past the solar panel's edge (screen right), then up
   * `height` m (default 40), drawn over `draw` s (default 1.2).
   */
  uplink?: {at: number; draw?: number; height?: number} | null;
};

/** The pole's places in the world for a foot `position` and an `aim` point (anchors, the cone, the path). */
export const poleParts = (position: V3, aim: V3) => {
  const [px, py, pz] = position;
  const H = POLE.housing;
  const centre = new THREE.Vector3(px - POLE.armLength, py + POLE.armY - 0.1, pz);
  const m = new THREE.Object3D();
  m.position.copy(centre);
  m.lookAt(new THREE.Vector3(...aim));
  m.updateMatrixWorld();
  const local = (v: V3): V3 => new THREE.Vector3(...v).applyMatrix4(m.matrixWorld).toArray() as V3;
  const modemTop: V3 = [px, py + POLE.modem.y + POLE.modem.h / 2, pz + POLE.r + 0.012 + POLE.modem.d / 2];
  return {
    quaternion: m.quaternion.clone(),
    centre: centre.toArray() as V3,
    local,
    /** The lens's centre on the housing's front window. */
    lens: local([0, -0.005, H.l / 2 + 0.004]),
    /** The LED ring (its top, for a callout leader). */
    ring: local([0, 0.045, H.l / 2 - 0.02]),
    /** The status dot on the housing's back (faces the camera side). */
    status: local([0.035, 0.03, -H.l / 2 - 0.006]),
    /** The housing's middle (the cut-away's subject). */
    housing: centre.toArray() as V3,
    modem: [px, py + POLE.modem.y, pz + POLE.r + 0.012 + POLE.modem.d] as V3,
    antenna: [modemTop[0] - 0.06, modemTop[1] + POLE.antenna, modemTop[2]] as V3,
    battery: [px, py + POLE.battery.y, pz + POLE.r + 0.012 + POLE.battery.d] as V3,
    panel: [px, py + POLE.height + 0.18, pz] as V3,
    top: [px, py + POLE.height + 0.35, pz] as V3,
  };
};

/** IR pulse envelope (0 → 1) at t: in over 4 frames, held, out over 10, ≤ 0.6 s in all (ruling v0.18.7). */
export const IR_PULSE = {in: 4 / 30, hold: 0.6 - 14 / 30, out: 10 / 30};
const pulseTimes = (ir: (number | PulseRun)[] | undefined): number[] =>
  (ir ?? []).flatMap((k) => {
    if (typeof k === 'number') return [k];
    const every = Math.max(0.7, k.every ?? 0.9);
    const n = Math.max(0, Math.floor((k.to - k.from) / every + 1e-6));
    return [...Array(n + 1).keys()].map((i) => k.from + i * every);
  });
export const irLevel = (ir: (number | PulseRun)[] | undefined, t: number) =>
  pulseTimes(ir).reduce((m, a) => {
    const u = t - a;
    if (u < 0 || u > IR_PULSE.in + IR_PULSE.hold + IR_PULSE.out) return m;
    const v =
      u < IR_PULSE.in ? u / IR_PULSE.in : u < IR_PULSE.in + IR_PULSE.hold ? 1 : 1 - (u - IR_PULSE.in - IR_PULSE.hold) / IR_PULSE.out;
    return Math.max(m, v);
  }, 0);

const onAt = (k: boolean | OnKey[] | undefined, t: number, dflt: boolean) => {
  if (k === undefined) return dflt;
  if (typeof k === 'boolean') return k;
  let v = dflt;
  for (const q of [...k].sort((a, b) => a.at - b.at)) if (t >= q.at) v = q.on;
  return v;
};
const smooth = (u: number) => {
  const x = Math.max(0, Math.min(1, u));
  return x * x * (3 - 2 * x);
};
/** The cut-away's opening at t, 0 closed → 1 open (0.8 s each way, from the last key). */
export const cutLevel = (cut: OnKey[] | undefined, t: number) => {
  let v = 0;
  for (const q of [...(cut ?? [])].sort((a, b) => a.at - b.at)) {
    if (t < q.at) break;
    const k = smooth((t - q.at) / 0.8);
    v = q.on ? v + (1 - v) * k : v * (1 - k);
  }
  return v;
};

/** The solar panel's cells: dark blue-black cells on a white backsheet grid, an aluminium frame (texture only). */
const panelTexture = () => {
  const c = document.createElement('canvas');
  c.width = 288;
  c.height = 200;
  const x = c.getContext('2d')!;
  x.fillStyle = REAL.alu;
  x.fillRect(0, 0, 288, 200);
  x.fillStyle = REAL.silk;
  x.fillRect(8, 8, 272, 184);
  const cols = 6;
  const rows = 4;
  const cw = (272 - (cols + 1) * 3) / cols;
  const ch = (184 - (rows + 1) * 3) / rows;
  for (let i = 0; i < cols; i++)
    for (let j = 0; j < rows; j++) {
      const cx = 8 + 3 + i * (cw + 3);
      const cy = 8 + 3 + j * (ch + 3);
      x.fillStyle = REAL.carGlass;
      x.fillRect(cx, cy, cw, ch);
      // the busbars: two faint lines a cell
      x.fillStyle = REAL.module;
      x.fillRect(cx + cw / 3, cy, 1.5, ch);
      x.fillRect(cx + (2 * cw) / 3, cy, 1.5, ch);
    }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
};

/** The main board's face: green solder mask, traces and invented silkscreen legends (unreadable at phone size). */
const boardTexture = () => {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 128;
  const x = c.getContext('2d')!;
  x.fillStyle = REAL.pcb;
  x.fillRect(0, 0, 256, 128);
  x.strokeStyle = REAL.trace;
  x.lineWidth = 3;
  for (let i = 0; i < 9; i++) {
    x.beginPath();
    x.moveTo(10 + i * 26, 6);
    x.lineTo(10 + i * 26, 50 + (i % 3) * 12);
    x.lineTo(30 + i * 24, 120);
    x.stroke();
  }
  x.fillStyle = REAL.silk;
  x.font = '600 13px monospace';
  x.fillText('IRC-8', 150, 20);
  x.fillText('LT-2', 14, 118);
  x.fillText('PW 12', 182, 118);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
};

/** One still frame peeling off the lens: a pale card with an orange edge (the system's capture). */
const shotTexture = () => {
  const c = document.createElement('canvas');
  c.width = 120;
  c.height = 84;
  const x = c.getContext('2d')!;
  x.fillStyle = section.orange;
  x.fillRect(0, 0, 120, 84);
  x.fillStyle = REAL.silk;
  x.fillRect(8, 8, 104, 68);
  // a faint car-shape in grey (no detail)
  x.fillStyle = REAL.chipInk;
  x.fillRect(34, 40, 52, 22);
  x.fillRect(42, 28, 36, 14);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
};

const usePoleMats = () =>
  useMemo(() => {
    const std = (c: string, r = 0.6, metal = 0) => new THREE.MeshStandardMaterial({color: raw(c), roughness: r, metalness: metal});
    const cells = new THREE.MeshPhysicalMaterial({map: panelTexture(), roughness: 0.18, metalness: 0.1, clearcoat: 1, clearcoatRoughness: 0.08});
    return {
      pole: std(CITY.mast, 0.55, 0.4),
      collar: std(CITY.gutter, 0.9),
      housing: std(REAL.labDark, 0.42, 0.15),
      inner: std(REAL.chip, 0.7),
      boxes: std(REAL.cabinet, 0.55, 0.25),
      battery: std(REAL.labDark, 0.5, 0.2),
      rubber: std(REAL.rubber, 0.8),
      cable: std(REAL.cable, 0.6),
      frame: std(REAL.alu, 0.35, 0.7),
      cells,
      glass: new THREE.MeshPhysicalMaterial({color: raw(REAL.glass), roughness: 0.06, metalness: 0, clearcoat: 1}),
      lens: std(REAL.lens, 0.25, 0.1),
      lensRing: std(REAL.lensRing, 0.7, 0.1),
      board: new THREE.MeshStandardMaterial({map: boardTexture(), roughness: 0.4}),
      ringBoard: std(REAL.pcb, 0.4),
      chip: std(REAL.chip, 0.5),
      ledOff: std(section.ledOff, 0.4),
      ledOn: new THREE.MeshBasicMaterial({color: raw(section.orange)}),
      cut: cutMaterial(),
      cone: new THREE.MeshBasicMaterial({
        color: raw(section.orange),
        transparent: true,
        opacity: 0,
        depthWrite: false,
        side: THREE.DoubleSide,
        fog: false,
      }),
      shot: new THREE.MeshBasicMaterial({map: shotTexture(), transparent: true, side: THREE.DoubleSide, fog: false}),
    };
  }, []);

/** A box from two corners (local metres), its material(s). */
const Bx: React.FC<{a: V3; b: V3; mat: THREE.Material | THREE.Material[]; shadow?: boolean}> = ({a, b, mat, shadow = true}) => {
  const size: V3 = [Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1]), Math.abs(b[2] - a[2])];
  if (size.some((s) => s < 1e-4)) return null;
  return (
    <mesh position={[(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2]} material={mat} castShadow={shadow} receiveShadow>
      <boxGeometry args={size} />
    </mesh>
  );
};

/** A cylinder between two world points. */
const Rod: React.FC<{a: V3; b: V3; r: number; mat: THREE.Material}> = ({a, b, r, mat}) => {
  const va = new THREE.Vector3(...a);
  const vb = new THREE.Vector3(...b);
  const d = vb.clone().sub(va);
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize());
  return (
    <mesh position={va.add(vb).multiplyScalar(0.5).toArray() as V3} quaternion={q} material={mat} castShadow>
      <cylinderGeometry args={[r, r, d.length(), 14]} />
    </mesh>
  );
};

export type PlateCameraPoleProps = PlateCameraKeys & {
  mood: Mood;
  /** The pole's foot (on the sidewalk's top). */
  position: V3;
  /** Where the camera points (the stopped car's plate). */
  aim: V3;
  /** Where the IR cone ends (the target plate now; default `aim`). */
  irTarget?: V3;
  /**
   * The stretches of the cone to draw, as shares of its length (0 the lens → 1 the plate). Default [[0, 1]]. A scene
   * that knows its camera passes only the stretches that stay clear of every car body on screen, plus the plate cap
   * (`city-slice` does), so the cone never tints a body or glass (§ 5: no spill).
   */
  coneSpans?: [number, number][];
  /** Seconds into the scene. */
  t: number;
  /** The camera's distance (m): the system's weights hold their size on screen. */
  camD: number;
};

/** The pole (see the file comment). */
export const PlateCameraPole: React.FC<PlateCameraPoleProps> = ({
  position,
  aim,
  irTarget,
  coneSpans = [[0, 1]],
  t,
  camD,
  status,
  statusPulses = [],
  ir,
  shots = [],
  cut,
  rings = [],
  uplink,
}) => {
  const mats = usePoleMats();
  const parts = poleParts(position, aim);
  const [px, py, pz] = position;
  const H = POLE.housing;
  const T = POLE.wall;
  const hw = H.w / 2;
  const hh = H.h / 2;
  const hl = H.l / 2;
  // the system's weights (the path's core, held on screen like the ruler, § 5)
  const coreR = 0.0225 * Math.max(0.12, Math.min(3.5, camD / 30));
  const nodeR = coreR * NODE_SCALE;
  const on = onAt(status, t, true);
  const swell = statusPulses.reduce((m, a) => (t >= a && t < a + 0.45 ? Math.max(m, Math.sin((Math.PI * (t - a)) / 0.45)) : m), 0);
  const irK = irLevel(ir, t);
  const open = cutLevel(cut, t);
  // The cut is across the housing's axis at z = ZC: the plate camera and ours both look at the car from behind, so the
  // housing's back faces the camera and a section across it faces us. The rear block (z < ZC: the back wall and the
  // walls' rear parts) is cut away top-down; the front part keeps its cut faces at ZC (hatched, inked: a frame).
  const ZC = -0.03;
  const yCut = hh - open * H.h;
  const rear = (y0: number, y1: number): [number, number] | null => (Math.min(y1, yCut) - y0 > 1e-4 ? [y0, Math.min(y1, yCut)] : null);
  const c = mats.cut;
  const hs = mats.housing;
  // the front part's walls carry their cut faces on −z (box faces: +x, −x, +y, −y, +z, −z)
  const frontMat = [hs, hs, hs, hs, hs, c];
  const all = [hs, hs, hs, hs, hs, hs];
  const inkT = Math.max(0.0016, Math.min(0.011, 0.011 * (camD / 12.75)));
  const zc = ZC - 0.0005;
  const cutRects: Rect[] =
    open > 0.02
      ? [
          [
            [-hw, hh - T, zc],
            [hw, hh, zc],
          ],
          [
            [-hw, -hh, zc],
            [hw, -hh + T, zc],
          ],
          [
            [-hw, -hh + T, zc],
            [-hw + T, hh - T, zc],
          ],
          [
            [hw - T, -hh + T, zc],
            [hw, hh - T, zc],
          ],
        ]
      : [];
  // the IR cone: from the lens to the plate, halo only (no core), faint (≤ 25 %; as built 14 %). It narrows to the plate's
  // half-height at its end, so its foot stays inside the plate's edges
  const lens = new THREE.Vector3(...parts.lens);
  const tgt = new THREE.Vector3(...(irTarget ?? aim));
  const dir = tgt.clone().sub(lens);
  const coneLen = dir.length();
  const coneQ = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
  mats.cone.opacity = CONE.alpha * irK;
  const coneR = (u: number) => CONE.r0 + (CONE.r1 - CONE.r0) * u;
  // the stills: three cards out of the lens toward the camera side and back in, 0.1 s apart (0.6 s in all)
  const shotScale = Math.max(1, camD / 14);
  const cardQ = useMemo(() => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), new THREE.Vector3(...SECTION_ANGLE)), []);
  const cards = shots.flatMap((s) =>
    [0, 1, 2].flatMap((k) => {
      const u = (t - s - k * 0.1) / 0.4;
      if (u <= 0 || u >= 1) return [];
      const out = Math.sin(Math.PI * u);
      // straight up out of the lens and back (away from the car and its driver), fanned a little sideways
      const spread = (k - 1) * 0.17 * shotScale * out;
      const lp = parts.lens;
      const p: V3 = [lp[0] + spread * 0.88, lp[1] + (0.7 + 0.16 * k) * shotScale * out, lp[2] - spread * 0.47];
      return [{key: `${s}-${k}`, p, s: (0.25 + 0.75 * out) * 0.16 * shotScale}];
    }),
  );
  // the rings and the uplink from the antenna's tip
  const tip = parts.antenna;
  const ringScale = Math.max(1, camD / 19);
  const liveRings = rings.filter((r) => t >= r && t - r < PULSE_LIFE);
  const up = uplink ? smooth((t - uplink.at) / (uplink.draw ?? 1.2)) : 0;
  // right-angle runs (§ 5): up off the antenna's tip, across to the side past the solar panel's edge (screen right from
  // the fixed angle, so the climb never crosses the panel on screen), then up
  const sideX = px + POLE.panel.w / 2 + 0.24;
  const upRoute: V3[] = [
    tip,
    [tip[0], tip[1] + 0.12, tip[2]],
    [sideX, tip[1] + 0.12, tip[2]],
    [sideX, tip[1] + (uplink?.height ?? 40), tip[2]],
  ];
  const modem = POLE.modem;
  const bat = POLE.battery;
  const P = POLE.panel;
  const mz = pz + POLE.r + 0.012;
  return (
    <group>
      {/* the pole, its base collar, the arm */}
      <mesh material={mats.collar} position={[px, py + 0.04, pz]} receiveShadow castShadow>
        <cylinderGeometry args={[0.13, 0.15, 0.08, 20]} />
      </mesh>
      <mesh material={mats.pole} position={[px, py + POLE.height / 2, pz]} castShadow receiveShadow>
        <cylinderGeometry args={[POLE.r, POLE.r * 1.15, POLE.height, 18]} />
      </mesh>
      <Rod a={[px, py + POLE.armY, pz]} b={[px - POLE.armLength, py + POLE.armY, pz]} r={0.022} mat={mats.pole} />
      <Rod a={[px - POLE.armLength, py + POLE.armY, pz]} b={[parts.centre[0], parts.centre[1] + hh + 0.016, parts.centre[2]]} r={0.016} mat={mats.pole} />
      {/* the solar panel on a bracket at the top, tilted toward the camera side (cells a texture on its face) */}
      <Rod a={[px, py + POLE.height - 0.05, pz]} b={[px, py + POLE.height + 0.14, pz]} r={0.03} mat={mats.pole} />
      <group position={[px, py + POLE.height + 0.18, pz + 0.04]} rotation={[P.tilt, 0, 0]}>
        <mesh material={[mats.frame, mats.frame, mats.cells, mats.frame, mats.frame, mats.frame]} castShadow receiveShadow>
          <boxGeometry args={[P.w, P.t, P.d]} />
        </mesh>
      </group>
      {/* the modem box (stub antenna) and the battery box, strapped to the pole's camera side */}
      <mesh geometry={roundedBox(modem.w, modem.h, modem.d, 0.012)} material={mats.boxes} position={[px, py + modem.y, mz + modem.d / 2]} castShadow receiveShadow />
      <Rod a={[tip[0], tip[1] - POLE.antenna - 0.01, tip[2]]} b={tip} r={0.013} mat={mats.rubber} />
      <mesh geometry={roundedBox(bat.w, bat.h, bat.d, 0.014)} material={mats.battery} position={[px, py + bat.y, mz + bat.d / 2]} castShadow receiveShadow />
      {[modem.y - modem.h * 0.3, modem.y + modem.h * 0.3, bat.y - bat.h * 0.3, bat.y + bat.h * 0.3].map((y) => (
        <mesh key={y} material={mats.pole} position={[px, py + y, pz]}>
          <cylinderGeometry args={[POLE.r + 0.008, POLE.r + 0.008, 0.025, 18]} />
        </mesh>
      ))}
      {/* cables: housing → pole (then inside it), battery → modem */}
      <Rod a={[px + bat.w / 2 - 0.04, py + bat.y + bat.h / 2 - 0.01, mz + 0.04]} b={[px + modem.w / 2 - 0.03, py + modem.y - modem.h / 2 + 0.01, mz + 0.04]} r={0.008} mat={mats.cable} />

      {/* the housing, aimed at the plate */}
      <group position={parts.centre} quaternion={parts.quaternion}>
        {/* the front part (z ≥ ZC): top, bottom, both sides with their cut faces at ZC, the front window */}
        <Bx a={[-hw, hh - T, ZC]} b={[hw, hh, hl]} mat={frontMat} />
        <Bx a={[-hw, -hh, ZC]} b={[hw, -hh + T, hl]} mat={frontMat} />
        <Bx a={[-hw, -hh + T, ZC]} b={[-hw + T, hh - T, hl - T]} mat={frontMat} />
        <Bx a={[hw - T, -hh + T, ZC]} b={[hw, hh - T, hl - T]} mat={frontMat} />
        <Bx a={[-hw, -hh + T, hl - T]} b={[hw, hh - T, hl]} mat={[hs, hs, hs, hs, mats.glass, hs]} />
        {/* the rear block (z < ZC), cut away top-down */}
        {open < 0.999 ? (
          <>
            {rear(hh - T, hh) ? <Bx a={[-hw, hh - T, -hl]} b={[hw, hh, ZC]} mat={all} /> : null}
            {rear(-hh, -hh + T) ? <Bx a={[-hw, -hh, -hl]} b={[hw, -hh + T, ZC]} mat={all} /> : null}
            {(() => {
              const r = rear(-hh + T, hh - T);
              return r ? (
                <>
                  <Bx a={[-hw, r[0], -hl]} b={[hw, r[1], -hl + T]} mat={all} />
                  <Bx a={[-hw, r[0], -hl + T]} b={[-hw + T, r[1], ZC]} mat={all} />
                  <Bx a={[hw - T, r[0], -hl + T]} b={[hw, r[1], ZC]} mat={all} />
                </>
              ) : null;
            })()}
          </>
        ) : null}
        {/* the sun hood: 4 mm above the top, running past the front */}
        <Bx a={[-hw - 0.012, hh + 0.004, -hl + 0.06]} b={[hw + 0.012, hh + 0.014, hl + 0.075]} mat={hs} />
        <CutOutline rects={cutRects} thickness={inkT} />
        {/* inside: the lens barrel through the LED ring board, the LEDs, the main board, the cable */}
        <mesh material={mats.lensRing} position={[0, -0.005, hl - T - 0.05]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.026, 0.1, 24]} />
        </mesh>
        <mesh material={mats.lens} position={[0, -0.005, hl - T - 0.0015]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.022, 0.022, 0.003, 24]} />
        </mesh>
        {/* the rear lens element, seen from the cut */}
        <mesh material={mats.lens} position={[0, -0.005, hl - T - 0.105]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.003, 24]} />
        </mesh>
        <mesh material={mats.ringBoard} position={[0, -0.005, hl - T - 0.018]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.058, 0.058, 0.004, 32]} />
        </mesh>
        {[...Array(8).keys()].map((i) => {
          const a = (i / 8) * Math.PI * 2;
          return (
            <mesh
              key={i}
              material={irK > 0.02 ? mats.ledOn : mats.ledOff}
              position={[Math.cos(a) * 0.045, -0.005 + Math.sin(a) * 0.045, hl - T - 0.016]}
              rotation={[Math.PI / 2, 0, 0]}
            >
              {/* through-hole: the body in front of the board, its back end through it (seen from the cut) */}
              <cylinderGeometry args={[0.0065, 0.0065, 0.014, 10]} />
            </mesh>
          );
        })}
        <mesh material={[mats.chip, mats.chip, mats.board, mats.chip, mats.chip, mats.chip]} position={[0.0, -hh + T + 0.012, 0.06]}>
          <boxGeometry args={[0.11, 0.004, 0.15]} />
        </mesh>
        {[
          [-0.03, 0.02, 0.03, 0.035],
          [0.03, 0.04, 0.022, 0.022],
          [0.0, 0.1, 0.018, 0.028],
        ].map(([x, z, w, d], i) => (
          <mesh key={i} material={mats.chip} position={[0.01 + x, -hh + T + 0.0175, z]}>
            <boxGeometry args={[w, 0.007, d]} />
          </mesh>
        ))}
        {/* the cable from the board up through the top, into the bracket (and on inside the arm and the pole) */}
        <mesh material={mats.cable} position={[hw - T - 0.012, 0, 0.0]}>
          <cylinderGeometry args={[0.008, 0.008, H.h - 0.01, 10]} />
        </mesh>
        {/* the status dot's dark lens when idle (on the back wall; it goes with the cut-away) */}
        {!on && open < 0.5 ? (
          <mesh material={mats.ledOff} position={[0.035, 0.03, -hl - 0.002]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.008, 0.008, 0.004, 12]} />
          </mesh>
        ) : null}
      </group>

      {/* the system */}
      {/* the status dot lives on the back wall: it goes when the cut-away takes the back away */}
      <GlowNode at={parts.status} radius={nodeR * 0.8} glow={on ? Math.max(0, 1 - 3 * open) : 0} swell={1 + 0.4 * swell} />
      {irK > 0.003 ? (
        <>
          {coneSpans
            .filter(([a, b]) => b - a > 1e-3)
            .map(([a, b]) => (
              <mesh
                key={`${a.toFixed(3)}-${b.toFixed(3)}`}
                position={lens.clone().addScaledVector(dir, (a + b) / 2).toArray() as V3}
                quaternion={coneQ}
                material={mats.cone}
                userData={{glow: true}}
                renderOrder={5}
              >
                <cylinderGeometry args={[coneR(b), coneR(a), (b - a) * coneLen, 32, 1, true]} />
              </mesh>
            ))}
          <GlowNode at={parts.lens} radius={Math.max(0.03, nodeR * 0.7)} glow={irK} />
        </>
      ) : null}
      {cards.map((k) => (
        <mesh key={k.key} position={k.p} quaternion={cardQ} material={mats.shot} scale={[k.s * 1.43, k.s, 1]} renderOrder={6}>
          <planeGeometry args={[1, 1]} />
        </mesh>
      ))}
      {liveRings.map((r) => (
        <RadioPulse
          key={r.toFixed(3)}
          position={[tip[0], tip[1] + 0.1 + 0.9 * (t - r) * ringScale, tip[2]]}
          age={t - r}
          reach={0.42 * ringScale}
          weight={1.25 * ringScale}
          arc={Math.PI * 0.75}
        />
      ))}
      {up > 0 ? (
        <>
          <GlowPolyline points={upRoute} draw={up} radius={coreR} />
          <GlowNode at={tip} radius={nodeR} glow={1} />
        </>
      ) : null}
    </group>
  );
};
