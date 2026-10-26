import React, {useMemo} from 'react';
import * as THREE from 'three';
import {keyedValue, type Keyed} from '../../scenes/keyframes';
import {REAL, section, type Mood} from '../../theme';
import {raw, roundedBox} from '../plaster';
import {cutMaterial, INK, InkLine} from '../section/cutLook';
import {applyAlbedo, applyEnv, useAlbedo, useEnvStrength, useStudioEnv} from './useStudioEnv';

type V3 = [number, number, number];
type P2 = [number, number];

/*
 * A gas car's engine bay, pedal module and steering (No. 008, `car-slice` `variant: 'gas'`), in the car's
 * own frame (`RealCar`: x forward, y up, the near cut at z = 0.8; metres; the driver by the cut, as the EV
 * variant). Generic, no maker. Object cut-aways (style guide § 3): the engine, the intake and the
 * throttle body are cut on planes facing the camera (hatched, inked), the inside realistic. Nothing here
 * is orange: the scene draws the system (the signal path, its pulses and node dots) on top.
 *
 *  - Engine: a transverse four-cylinder cut through one cylinder (block, bore, piston, rod, crank, head
 *    with its ports, valves and two cams, the cam cover); its exhaust in front, the radiator.
 *  - Intake: the plenum (cut) on the engine's firewall side, a runner to the head's port, the air duct
 *    from the air box over the engine down into the throttle body.
 *  - Throttle body (🎭 ×1.5): cut through its (vertical) bore: the butterfly plate on its shaft, turning
 *    from closed to open (`open`), a small DC motor beside it (cut: can, magnets, armature with copper
 *    windings) and its gears (pinion, a compound intermediate, the sector gear on the plate's shaft) with
 *    the gear cover off.
 *  - The computer: a finned aluminium box on the engine side of the firewall, up by the cowl.
 *  - Pedal module: a hanging accelerator with a sealed sensor housing at its pivot; the brake pedal with
 *    its switch at the top of its arm. `accel` / `brake` press them (0 → 1).
 *  - Steering: wheel → column (in its shroud) → U-joint → a steel intermediate shaft (🎭 a little thick)
 *    → U-joint → the pinion on the rack, with the rack's assist motor. `shaft` fades the intermediate shaft
 *    out (the what-if), leaving its two stubs with hatched cut faces.
 *  - The loom: black wiring along the signal routes (`GAS_ROUTES`), so the orange rides real wire.
 *
 * No. 007 (`ev-acceleration`) adds rear drive, at the end of the file:
 *
 *  - `EngineBay` `engine: 'v8'` (`V8Bay`): a generic longitudinal V8 cut across (plane x = `V8.sectionX`, the
 *    cut face toward the cabin, so the camera's 3/4 angle sees it) through its rear pair of cylinders: the
 *    block's banks at 90°, two pistons and rods on one crank pin, the turning crankshaft (`crank`, from `rpm`
 *    keys via `crankAngleAt`, 🎭 slowed so idle reads as a slow crank), the heads, cams, intake in the valley,
 *    exhaust logs, the oil pan. No supercharger, no maker's shapes.
 *  - `Gearbox`: the converter housing and the case cut lengthwise (plane z = `GBX.caseCut`, in front of the
 *    shafts), the torque converter, and 8 gear pairs (🎭 scaled up) on an input shaft in line with the crank
 *    and an output shaft above it; the active pair lit (`gear`, `from`, `shift`, via `gearShiftAt`).
 *  - `RearDrive`: the driveshaft (flanges, U-joints), the rear diff (housing cut, ring gear and pinion) and
 *    the near rear half-shaft (CV boots, hub flange).
 *  - `gasDriveRoute(gear)`: the drive path's legs (crank → active pair → driveshaft → diff → wheel) for N4.
 */

export const GAS = {
  /** The engine's section plane, its crank centre, the cylinder axis's lean back toward the firewall (rad). */
  engineZ: 0.3,
  crank: [1.68, 0.34] as P2,
  lean: 0.15,
  /** Bore radius, crank throw, rod length (a generic 2.0 L: 86 × 86 mm). */
  boreR: 0.043,
  throw: 0.043,
  rod: 0.145,
  /** The throttle body's section plane, its bore's centre (the plate's shaft) and radius (🎭 ×1.5: 66 → 100 mm). */
  tbZ: 0.36,
  tb: [1.3, 0.862] as P2,
  tbR: 0.05,
  /** The body's outline (x0, x1, y0, y1): the bore, its two walls and the motor's housing. */
  tbBox: [1.232, 1.475, 0.792, 0.935] as [number, number, number, number],
  /** The DC motor's centre and can radius (on the engine side of the bore). */
  motor: [1.418, 0.848] as P2,
  motorR: 0.037,
  /** The plenum (x0, x1, y0, y1) under the throttle body, cut at `tbZ`. */
  plenum: [1.205, 1.4, 0.6, 0.792] as [number, number, number, number],
  /** The computer box (x0, x1, y0, y1, z0, z1). */
  ecu: [1.062, 1.152, 0.76, 0.935, 0.14, 0.45] as [number, number, number, number, number, number],
  /** The accelerator: its pivot (the sensor), its plane (z), the pad's rest centre and face angle (rad from the floor). */
  accelPivot: [0.915, 0.79] as P2,
  accelZ: 0.25,
  accelPad: [0.765, 0.47] as P2,
  accelFace: 0.86,
  /** How far the arm swings at a full press (rad). */
  accelSwing: 0.2,
  /** The brake pedal: its pivot, plane, the pad's rest centre and face angle; its swing at a full press. */
  brakePivot: [0.945, 0.935] as P2,
  brakeZ: 0.42,
  brakePad: [0.845, 0.6] as P2,
  brakeFace: 1.32,
  brakeSwing: 0.17,
  /** The steering: the column's lower U-joint, the shaft's lower U-joint, the pinion; the rack's height and x. */
  ujA: [1.0, 1.06] as P2,
  ujB: [0.985, 0.63] as P2,
  pinion: [1.165, 0.43] as P2,
  /** The wheel's plane (the driver's), and the shaft's: just in front of the firewall's cut (EV_FIREWALL_Z 0.4), so it shows. */
  steerZ: 0.38,
  shaftZ: 0.445,
  /** The rack's assist motor's span along the rack (z0, z1), between the pinion and the near wheel. */
  rackMotor: [0.5, 0.64] as P2,
  /** The intermediate shaft's radius (🎭 ≈ 1.7× real, so it and its cut faces read in the wide framing). */
  shaftR: 0.03,
};

/** Where a point on a hanging pedal goes when its arm swings by `a` (rad) about the pivot. */
const swing = (p: P2, pivot: P2, a: number): P2 => {
  const vx = p[0] - pivot[0];
  const vy = p[1] - pivot[1];
  return [pivot[0] + vx * Math.cos(a) - vy * Math.sin(a), pivot[1] + vx * Math.sin(a) + vy * Math.cos(a)];
};

/** The accelerator pad's centre and face angle at a press (0 → 1). */
export const accelPadAt = (press: number) => {
  const a = GAS.accelSwing * Math.max(0, Math.min(1, press));
  return {c: swing(GAS.accelPad, GAS.accelPivot, a), face: GAS.accelFace + a};
};
/** The brake pad's centre and face angle at a press (0 → 1). */
export const brakePadAt = (press: number) => {
  const a = GAS.brakeSwing * Math.max(0, Math.min(1, press));
  return {c: swing(GAS.brakePad, GAS.brakePivot, a), face: GAS.brakeFace + a};
};

/**
 * The signal routes (car frame), each riding the loom: the pedal sensor → up the firewall → the
 * computer; the computer → along the intake → the throttle motor; the brake switch → the computer;
 * the column's angle sensor → the rack's motor (the steer-by-wire what-if). The first point is where a
 * pulse starts, the last where it arrives (node dots at both).
 */
export const GAS_ROUTES: Record<'pedal' | 'motor' | 'brake' | 'steer', V3[]> = {
  pedal: [
    [GAS.accelPivot[0], GAS.accelPivot[1] + 0.035, GAS.accelZ + 0.05],
    [0.93, 0.85, 0.34],
    [0.975, 0.885, 0.43],
    [1.02, 0.895, 0.465],
    [GAS.ecu[0] + 0.01, GAS.ecu[2] + 0.12, GAS.ecu[5] + 0.025],
  ],
  motor: [
    [GAS.ecu[1] - 0.01, GAS.ecu[3] - 0.02, GAS.ecu[5] + 0.025],
    [GAS.ecu[1] + 0.05, GAS.tbBox[3] + 0.035, 0.44],
    [GAS.motor[0] - 0.02, GAS.tbBox[3] + 0.03, 0.42],
    [GAS.motor[0], GAS.motor[1] + GAS.motorR + 0.01, GAS.tbZ + 0.03],
  ],
  brake: [
    [GAS.brakePivot[0] + 0.03, GAS.brakePivot[1] - 0.045, GAS.brakeZ + 0.035],
    [0.99, 0.84, 0.46],
    [1.03, 0.81, 0.475],
    [GAS.ecu[0] + 0.01, GAS.ecu[2] + 0.04, GAS.ecu[5] + 0.025],
  ],
  steer: [
    // beside the shaft on its cabin side, so the gap it leaves stays in view
    [GAS.ujA[0] - 0.06, GAS.ujA[1] + 0.025, GAS.shaftZ + 0.02],
    [GAS.ujA[0] - 0.1, GAS.ujA[1] - 0.08, GAS.shaftZ + 0.05],
    [GAS.ujB[0] - 0.1, GAS.ujB[1] + 0.02, GAS.shaftZ + 0.07],
    [GAS.ujB[0] - 0.02, GAS.pinion[1] + 0.06, GAS.rackMotor[0] + 0.02],
    [GAS.pinion[0], GAS.pinion[1] + 0.03, (GAS.rackMotor[0] + GAS.rackMotor[1]) / 2],
  ],
};

const circlePts = (c: P2, r: number, n = 48, a0 = 0, a1 = Math.PI * 2): P2[] =>
  [...Array(n).keys()].map((i) => {
    const a = a0 + ((a1 - a0) * i) / (a1 - a0 === Math.PI * 2 ? n : n - 1);
    return [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)];
  });
const shapeOf = (pts: P2[], holes: P2[][] = []) => {
  const s = new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(x, y)));
  for (const h of holes) s.holes.push(new THREE.Path(h.map(([x, y]) => new THREE.Vector2(x, y))));
  return s;
};
/** Extrude a shape in the (x, y) plane from z0 back to z1 > z0 (front cap at z1). */
const extrude = (shape: THREE.Shape, z0: number, z1: number, curveSegments = 16) => {
  const g = new THREE.ExtrudeGeometry(shape, {depth: z1 - z0, bevelEnabled: false, curveSegments});
  g.translate(0, 0, z0);
  return g;
};
const rect = (x0: number, x1: number, y0: number, y1: number): P2[] => [
  [x0, y0],
  [x1, y0],
  [x1, y1],
  [x0, y1],
];
/** A spur gear's outline (teeth as trapezoids) round the origin, over [a0, a1] (a sector) or the whole turn. */
const gearPts = (r: number, teeth: number, depth: number, a0 = 0, a1 = Math.PI * 2, hub = 0): P2[] => {
  const out: P2[] = [];
  const full = a1 - a0 >= Math.PI * 2 - 1e-6;
  const p = (Math.PI * 2) / teeth;
  const n = Math.round((a1 - a0) / p);
  for (let i = 0; i < n; i++) {
    const a = a0 + i * p;
    for (const [f, rr] of [
      [0, r - depth],
      [0.2, r - depth],
      [0.32, r],
      [0.68, r],
      [0.8, r - depth],
    ] as [number, number][])
      out.push([rr * Math.cos(a + f * p), rr * Math.sin(a + f * p)]);
  }
  if (!full) {
    // a sector: close it through the hub
    out.push([(r - depth) * Math.cos(a1), (r - depth) * Math.sin(a1)]);
    for (let k = 0; k <= 8; k++) {
      const a = a1 - ((a1 - a0) * k) / 8;
      out.push([hub * Math.cos(a), hub * Math.sin(a)]);
    }
  }
  return out;
};
/** A point at `along` the cylinder axis and `across` (toward the front) from the crank. */
const cyl = (along: number, across = 0): P2 => {
  const [cx, cy] = GAS.crank;
  const s = Math.sin(GAS.lean);
  const c = Math.cos(GAS.lean);
  return [cx - s * along + c * across, cy + c * along + s * across];
};
const toV3 = (pts: P2[], z: number): V3[] => pts.map(([x, y]) => [x, y, z]);
/**
 * A closed outline subdivided into steps ≤ `step` (m), for `InkLine`, which samples its path evenly by
 * length: on a long outline with short edges the few samples would cut its corners.
 */
const dense = (pts: P2[], step = 0.004): P2[] =>
  pts.flatMap((p, i) => {
    const q = pts[(i + 1) % pts.length];
    const n = Math.max(1, Math.ceil(Math.hypot(q[0] - p[0], q[1] - p[1]) / step));
    return [...Array(n).keys()].map((k) => [p[0] + ((q[0] - p[0]) * k) / n, p[1] + ((q[1] - p[1]) * k) / n] as P2);
  });

const usePhys = () => ({env: useStudioEnv(), envScale: useEnvStrength(), albedo: useAlbedo()});
const phys = (c: string, o: THREE.MeshPhysicalMaterialParameters = {}) =>
  new THREE.MeshPhysicalMaterial({color: raw(c), ...o});

/** The throttle's intermediate gear centre: meshes the motor's pinion and the plate's sector. */
const GEAR = (() => {
  const pin = 0.012;
  const big = 0.03;
  const small = 0.013;
  const sector = 0.06;
  const S = GAS.tb;
  const M = GAS.motor;
  const a = sector + small;
  const b = big + pin;
  const d = Math.hypot(M[0] - S[0], M[1] - S[1]);
  // the intersection of the two circles (|I − S| = a, |I − M| = b), the upper one
  const x = (d * d + a * a - b * b) / (2 * d);
  const h = Math.sqrt(Math.max(0, a * a - x * x));
  const ux = (M[0] - S[0]) / d;
  const uy = (M[1] - S[1]) / d;
  const I: P2 = [S[0] + ux * x - uy * h, S[1] + uy * x + ux * h];
  return {pin, big, small, sector, I, toSector: Math.atan2(I[1] - S[1], I[0] - S[0])};
})();

/** The plate's angle from the bore's axis' normal: closed (≈ 7°, as a real plate rests) → open (90°). */
const plateAngle = (open: number) => 0.12 + (Math.PI / 2 - 0.12) * Math.max(0, Math.min(1, open));

export type EngineBayProps = {
  mood: Mood;
  /** The throttle plate, 0 (closed, at idle) → 1 (wide open). Four-cylinder only. */
  open?: number;
  /** × the ink lines' thickness (close framings thin them). */
  inkScale?: number;
  /**
   * Which engine (default 'i4', No. 008: the transverse four-cylinder, front drive, with its throttle body and
   * computer). 'v8' (No. 007): the longitudinal V8 for rear drive, cut across through its rear pair of
   * cylinders (`V8Bay`); mount `Gearbox` and `RearDrive` behind it.
   */
  engine?: 'i4' | 'v8';
  /** 'v8': the crankshaft's angle (rad; `crankAngleAt` turns `rpm` keys into it). Default 0. */
  crank?: number;
};

/** The engine bay: the four-cylinder (default, No. 008) or the V8 (`engine: 'v8'`, No. 007). */
export const EngineBay: React.FC<EngineBayProps> = ({engine = 'i4', crank = 0, ...p}) =>
  engine === 'v8' ? <V8Bay mood={p.mood} crank={crank} inkScale={p.inkScale} /> : <I4Bay {...p} />;

/** The four-cylinder, intake, throttle body, air duct, radiator and the computer (see the file comment). */
const I4Bay: React.FC<Omit<EngineBayProps, 'engine' | 'crank'>> = ({mood, open = 0, inkScale = 1}) => {
  const {env, envScale, albedo} = usePhys();
  const mats = useMemo(
    () => ({
      cut: cutMaterial(),
      alu: phys(REAL.housing, {metalness: 0.55, roughness: 0.48}),
      iron: phys(REAL.lamination, {metalness: 0.45, roughness: 0.5}),
      steel: phys(REAL.steel, {metalness: 0.9, roughness: 0.3}),
      piston: phys(REAL.alu, {metalness: 0.75, roughness: 0.35}),
      plastic: phys(REAL.dash, {roughness: 0.6}),
      rubber: phys(REAL.rubber, {roughness: 0.75}),
      dark: phys(REAL.labDark, {roughness: 0.6}),
      bore: phys(REAL.lamination, {metalness: 0.6, roughness: 0.32, side: THREE.BackSide}),
      plate: phys(REAL.chrome, {metalness: 0.85, roughness: 0.28, side: THREE.DoubleSide}),
      gear: phys(REAL.steel, {metalness: 0.85, roughness: 0.35}),
      nylon: phys(REAL.shield, {roughness: 0.45}),
      can: phys(REAL.chrome, {metalness: 0.9, roughness: 0.3}),
      magnet: phys(REAL.magnet, {metalness: 0.3, roughness: 0.4}),
      copper: phys(REAL.copper, {metalness: 0.5, roughness: 0.38}),
      ecu: phys(REAL.alu, {metalness: 0.7, roughness: 0.42}),
      connector: phys(REAL.receiver, {roughness: 0.55}),
      exhaust: phys(REAL.rimPaint, {metalness: 0.7, roughness: 0.5}),
      radiator: phys(REAL.labDark, {metalness: 0.3, roughness: 0.6}),
      ink: new THREE.MeshBasicMaterial({color: raw(section.cutLine)}),
    }),
    [],
  );
  applyEnv(
    env,
    [
      [mats.alu, 0.6],
      [mats.iron, 0.6],
      [mats.steel, 1],
      [mats.piston, 0.8],
      [mats.bore, 0.6],
      [mats.plate, 1],
      [mats.gear, 0.9],
      [mats.can, 0.9],
      [mats.ecu, 0.8],
      [mats.exhaust, 0.6],
    ],
    envScale,
  );
  applyAlbedo(
    [
      mats.alu,
      mats.iron,
      mats.steel,
      mats.piston,
      mats.plastic,
      mats.rubber,
      mats.dark,
      mats.bore,
      mats.plate,
      mats.gear,
      mats.nylon,
      mats.can,
      mats.magnet,
      mats.copper,
      mats.ecu,
      mats.connector,
      mats.exhaust,
      mats.radiator,
    ],
    albedo,
  );
  void mood;

  const geo = useMemo(() => {
    const z = GAS.engineZ;
    const r = GAS.boreR;
    // the block's section: the crankcase round the crank, up to the deck, a cylinder bore through it
    const deck = 0.275;
    const block: P2[] = [
      cyl(-0.12, -0.17),
      cyl(-0.12, 0.17),
      cyl(0.05, 0.16),
      cyl(deck, 0.1),
      cyl(deck, -0.1),
      cyl(0.05, -0.16),
    ];
    const boreHole: P2[] = [cyl(0.105, -r), cyl(0.105, r), cyl(deck + 0.002, r), cyl(deck + 0.002, -r)];
    // the two pieces either side of the bore (it opens through the deck), the crankcase under it
    const blockL: P2[] = [
      cyl(0.105, -r),
      cyl(deck, -r),
      cyl(deck, -0.1),
      cyl(0.05, -0.16),
      cyl(-0.12, -0.17),
      cyl(-0.12, -0.105),
    ];
    const blockR: P2[] = [
      cyl(-0.12, 0.105),
      cyl(-0.12, 0.17),
      cyl(0.05, 0.16),
      cyl(deck, 0.1),
      cyl(deck, r),
      cyl(0.105, r),
    ];
    // the head: from the deck up, with the intake port (rear) and exhaust port (front) opening into the chamber
    const h0 = deck;
    const h1 = deck + 0.12;
    const head: P2[] = [
      cyl(h0, -0.1),
      cyl(h0, -0.05),
      cyl(h0 + 0.03, -0.035),
      cyl(h0 + 0.035, 0),
      cyl(h0 + 0.03, 0.035),
      cyl(h0, 0.05),
      cyl(h0, 0.1),
      cyl(h1, 0.1),
      cyl(h1, -0.1),
    ];
    const intakePort: P2[] = [
      cyl(h0 + 0.03, -0.03),
      cyl(h0 + 0.05, -0.012),
      cyl(h0 + 0.075, -0.06),
      cyl(h0 + 0.09, -0.1015),
      cyl(h0 + 0.055, -0.1015),
    ];
    const exhaustPort: P2[] = [
      cyl(h0 + 0.03, 0.03),
      cyl(h0 + 0.05, 0.012),
      cyl(h0 + 0.07, 0.06),
      cyl(h0 + 0.08, 0.1015),
      cyl(h0 + 0.045, 0.1015),
    ];
    // the plenum's walls (cut), a hollow chamber
    const [px0, px1, py0, py1] = GAS.plenum;
    const w = 0.014;
    const bx = GAS.tb[0];
    const plenumWalls: P2[] = [
      [px0, py0],
      [px1, py0],
      [px1, py0 + 0.07],
      [px1 - w, py0 + 0.07],
      [px1 - w, py0 + w],
      [px0 + w, py0 + w],
      [px0 + w, py1 - w],
      [bx - GAS.tbR, py1 - w],
      [bx - GAS.tbR, py1],
      [px0, py1],
    ];
    const plenumTop: P2[] = [
      [bx + GAS.tbR, py1 - w],
      [px1 - w, py1 - w],
      [px1 - w, py0 + 0.14],
      [px1, py0 + 0.14],
      [px1, py1],
      [bx + GAS.tbR, py1],
    ];
    // the throttle body's section: the wall left of the bore, the right part with the motor's bore
    const [tx0, tx1, ty0, ty1] = GAS.tbBox;
    const tbL = rect(tx0, bx - GAS.tbR, ty0, ty1);
    const tbR = rect(bx + GAS.tbR, tx1, ty0, ty1);
    const motorHole = circlePts(GAS.motor, GAS.motorR + 0.003, 40).reverse();
    const tbz = GAS.tbZ;
    return {
      blockL: extrude(shapeOf(blockL), -0.25, z),
      blockR: extrude(shapeOf(blockR), -0.25, z),
      blockInk: [block, boreHole].map((p) => toV3(p, z + 0.002)),
      head: extrude(shapeOf(head, [intakePort, exhaustPort]), -0.25, z),
      headInk: [head, intakePort, exhaustPort].map((p) => toV3(p, z + 0.002)),
      // the bore's back half (seen through the cut)
      boreBack: (() => {
        const g = new THREE.CylinderGeometry(r, r, deck - 0.105, 24, 1, true, Math.PI / 2, Math.PI);
        return g;
      })(),
      piston: roundedBox(2 * r - 0.003, 0.05, 2 * r - 0.003, 0.006),
      rod: new THREE.BoxGeometry(0.022, GAS.rod, 0.016),
      crankWeb: extrude(shapeOf(circlePts([0, 0], 0.075, 40)), z - 0.06, z - 0.02),
      pin: new THREE.CylinderGeometry(0.018, 0.018, 0.06, 16),
      // the cam cover: a dark plastic lid on the head
      cover: extrude(
        shapeOf([
          cyl(h1, -0.105),
          cyl(h1, 0.105),
          cyl(h1 + 0.05, 0.095),
          cyl(h1 + 0.075, 0.05),
          cyl(h1 + 0.075, -0.05),
          cyl(h1 + 0.05, -0.095),
        ]),
        -0.25,
        z - 0.002,
      ),
      cam: extrude(shapeOf([...circlePts([0, 0], 0.017, 24, 0.6, Math.PI * 2 - 0.6), [0.034, 0]]), z - 0.05, z - 0.004),
      valve: new THREE.BoxGeometry(0.006, 0.07, 0.006),
      valveHead: new THREE.CylinderGeometry(0.016, 0.016, 0.004, 20),
      plenumWalls: extrude(shapeOf(plenumWalls), -0.3, tbz),
      plenumTop: extrude(shapeOf(plenumTop), -0.3, tbz),
      plenumInk: [plenumWalls, plenumTop].map((p) => toV3(p, tbz + 0.002)),
      // the runner from the plenum to the head's intake port (dark plastic)
      runner: new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3(
          [
            [px1 - 0.01, py0 + 0.105, tbz - 0.05],
            [px1 + 0.07, py0 + 0.1, z - 0.02],
            cyl(h0 + 0.075, -0.13).concat([z - 0.03]) as V3,
          ].map((p) => new THREE.Vector3(...(p as V3))),
        ),
        16,
        0.03,
        12,
      ),
      plenumBack: new THREE.PlaneGeometry(px1 - px0 - 2 * w, py1 - py0 - 2 * w),
      tbL: extrude(shapeOf(tbL), tbz - 0.16, tbz),
      tbR: extrude(shapeOf(tbR, [motorHole]), tbz - 0.16, tbz),
      tbInk: [tbL, tbR, motorHole].map((p) => toV3(p, tbz + 0.002)),
      tbBore: new THREE.CylinderGeometry(GAS.tbR, GAS.tbR, ty1 - ty0, 32, 1, true, Math.PI / 2, Math.PI),
      // the plate: a half disc (its near half is cut away with the section), on its shaft
      plate: (() => {
        const g = new THREE.CircleGeometry(GAS.tbR - 0.002, 32, 0, Math.PI);
        return g;
      })(),
      plateEdge: new THREE.BoxGeometry(2 * (GAS.tbR - 0.002), 0.006, 0.003),
      shaft: new THREE.CylinderGeometry(0.0065, 0.0065, 0.17, 12),
      // the gears, cover off, just proud of the cut
      sector: extrude(shapeOf(gearPts(GEAR.sector, 64, 0.005, -0.5, 0.5, 0.012)), tbz + 0.001, tbz + 0.007),
      inter: extrude(shapeOf(gearPts(GEAR.big, 22, 0.004)), tbz + 0.001, tbz + 0.006),
      interSmall: extrude(shapeOf(gearPts(GEAR.small, 12, 0.004)), tbz + 0.006, tbz + 0.011),
      pinion: extrude(shapeOf(gearPts(GEAR.pin, 10, 0.003)), tbz + 0.001, tbz + 0.009),
      hub: new THREE.CylinderGeometry(0.005, 0.005, 0.016, 10),
      // the motor in section: the can, two magnets, the armature (three poles wound in copper)
      can: extrude(
        shapeOf(circlePts([0, 0], GAS.motorR, 40), [circlePts([0, 0], GAS.motorR - 0.004, 40).reverse()]),
        tbz - 0.15,
        tbz - 0.002,
      ),
      magnets: [0, Math.PI].map((a0) =>
        extrude(
          shapeOf([
            ...circlePts([0, 0], GAS.motorR - 0.004, 12, a0 + 0.6, a0 + Math.PI - 0.6),
            ...circlePts([0, 0], GAS.motorR - 0.012, 12, a0 + Math.PI - 0.6, a0 + 0.6),
          ]),
          tbz - 0.15,
          tbz - 0.003,
        ),
      ),
      pole: extrude(
        shapeOf([
          [-0.004, 0.004],
          [0.017, 0.004],
          [0.017, 0.012],
          [0.021, 0.012],
          [0.021, -0.012],
          [0.017, -0.012],
          [0.017, -0.004],
          [-0.004, -0.004],
        ]),
        tbz - 0.15,
        tbz - 0.003,
      ),
      winding: extrude(shapeOf(rect(0.006, 0.0165, -0.0095, 0.0095)), tbz - 0.15, tbz - 0.0025),
      // the air duct from the air box, over the engine, down into the throttle body
      duct: new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3(
          (
            [
              [bx, ty1 + 0.005, tbz - 0.05],
              [bx, ty1 + 0.06, tbz - 0.05],
              [bx + 0.12, 0.99, tbz - 0.06],
              [1.75, 0.985, tbz - 0.08],
              [1.93, 0.94, tbz - 0.1],
            ] as V3[]
          ).map((p) => new THREE.Vector3(...p)),
        ),
        40,
        0.038,
        14,
      ),
      exhaust: new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3(
          ([cyl(h0 + 0.065, 0.12).concat([z - 0.05]), [1.93, 0.52, z - 0.08], [1.9, 0.26, z - 0.12]] as V3[]).map(
            (p) => new THREE.Vector3(...p),
          ),
        ),
        24,
        0.026,
        12,
      ),
    };
  }, []);

  const ink = INK * inkScale;
  const z = GAS.engineZ;
  // the piston, rod and crank pin at a fixed crank angle (a still section: 35° after top dead centre)
  const th = 0.6;
  const pinPos = cyl(GAS.throw * Math.cos(th), GAS.throw * Math.sin(th));
  const pinAlong = GAS.throw * Math.cos(th);
  const pinAcross = GAS.throw * Math.sin(th);
  const pistonAlong = pinAlong + Math.sqrt(GAS.rod ** 2 - pinAcross ** 2);
  const pistonC = cyl(pistonAlong + 0.012);
  const rodMid = cyl((pinAlong + pistonAlong) / 2, pinAcross / 2);
  const rodAng = Math.atan2(-pinAcross, pistonAlong - pinAlong) + GAS.lean;
  const [, , ty0, ty1] = GAS.tbBox;
  const tbz = GAS.tbZ;
  const pa = plateAngle(open);
  // the gears follow the plate: the sector turns with it; the intermediate and the pinion step it up
  const sectorRot = pa;
  const interRot = -pa * (GEAR.sector / GEAR.small);
  const pinRot = pa * (GEAR.sector / GEAR.small) * (GEAR.big / GEAR.pin);
  const [ex0, ex1, ey0, ey1, ez0, ez1] = GAS.ecu;
  const lean = GAS.lean;

  return (
    <group>
      {/* the block (cut), the bore's back wall, the piston, rod and crank */}
      <mesh geometry={geo.blockL} material={[mats.cut, mats.iron]} castShadow receiveShadow />
      <mesh geometry={geo.blockR} material={[mats.cut, mats.iron]} castShadow receiveShadow />
      {geo.blockInk.map((p, i) => (
        <InkLine key={i} points={p} thickness={ink} />
      ))}
      <mesh
        geometry={geo.boreBack}
        material={mats.bore}
        position={[...cyl((0.105 + 0.275) / 2), z] as V3}
        rotation={[0, 0, lean]}
      />
      <mesh
        geometry={geo.piston}
        material={mats.piston}
        position={[...pistonC, z - GAS.boreR] as V3}
        rotation={[0, 0, lean]}
        castShadow
      />
      <mesh
        geometry={geo.rod}
        material={mats.steel}
        position={[...rodMid, z - GAS.boreR] as V3}
        rotation={[0, 0, rodAng]}
      />
      <mesh geometry={geo.crankWeb} material={mats.iron} position={[GAS.crank[0], GAS.crank[1], 0]} />
      <mesh
        geometry={geo.pin}
        material={mats.steel}
        position={[...pinPos, z - GAS.boreR] as V3}
        rotation={[Math.PI / 2, 0, 0]}
      />
      {/* the head (cut, its ports), the valves, the two cams, the cam cover */}
      <mesh geometry={geo.head} material={[mats.cut, mats.alu]} castShadow receiveShadow />
      {geo.headInk.map((p, i) => (
        <InkLine key={i} points={p} thickness={ink} />
      ))}
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh
            geometry={geo.valve}
            material={mats.steel}
            position={[...cyl(0.275 + 0.07, s * 0.022), z - 0.01] as V3}
            rotation={[0, 0, lean - s * 0.2]}
          />
          <mesh
            geometry={geo.valveHead}
            material={mats.steel}
            position={[...cyl(0.275 + 0.034, s * 0.03), z - 0.01] as V3}
            rotation={[0, 0, lean - s * 0.2]}
          />
          <mesh
            geometry={geo.cam}
            material={mats.steel}
            position={[...cyl(0.275 + 0.1, s * 0.045), 0] as V3}
            rotation={[0, 0, s * 1.2]}
            castShadow
          />
        </group>
      ))}
      <mesh geometry={geo.cover} material={mats.plastic} castShadow receiveShadow />
      {/* exhaust down the front, the radiator behind the grille */}
      <mesh geometry={geo.exhaust} material={mats.exhaust} castShadow />
      <mesh
        geometry={roundedBox(0.045, 0.56, 0.9, 0.01)}
        material={mats.radiator}
        position={[2.06, 0.6, -0.15]}
        castShadow
        receiveShadow
      />

      {/* the plenum (cut, hollow) and its runner to the head's intake port */}
      <mesh geometry={geo.plenumWalls} material={[mats.cut, mats.plastic]} castShadow receiveShadow />
      <mesh geometry={geo.plenumTop} material={[mats.cut, mats.plastic]} castShadow receiveShadow />
      {geo.plenumInk.map((p, i) => (
        <InkLine key={i} points={p} thickness={ink} />
      ))}
      <mesh
        geometry={geo.plenumBack}
        material={mats.dark}
        position={[(GAS.plenum[0] + GAS.plenum[1]) / 2, (GAS.plenum[2] + GAS.plenum[3]) / 2, -0.28]}
      />
      <mesh geometry={geo.runner} material={mats.plastic} castShadow />
      {/* the air box and its duct down into the throttle body */}
      <mesh
        geometry={roundedBox(0.24, 0.2, 0.42, 0.03)}
        material={mats.plastic}
        position={[1.95, 0.85, tbz - 0.24]}
        castShadow
        receiveShadow
      />
      <mesh geometry={geo.duct} material={mats.rubber} castShadow />

      {/* the throttle body (cut through its bore): walls, the bore's back half, the plate on its shaft */}
      <mesh geometry={geo.tbL} material={[mats.cut, mats.alu]} castShadow receiveShadow />
      <mesh geometry={geo.tbR} material={[mats.cut, mats.alu]} castShadow receiveShadow />
      {geo.tbInk.map((p, i) => (
        <InkLine key={i} points={p} thickness={ink} />
      ))}
      <mesh geometry={geo.tbBore} material={mats.bore} position={[GAS.tb[0], (ty0 + ty1) / 2, tbz]} />
      <group position={[GAS.tb[0], GAS.tb[1], tbz]} rotation={[0, 0, pa]}>
        {/* the half disc lies in the plate's plane (across the bore and along z), behind the cut */}
        <mesh geometry={geo.plate} material={mats.plate} rotation={[Math.PI / 2, 0, 0]} />
        {/* the plate's cut edge on the section plane: the bar that reads as open or shut */}
        <mesh geometry={geo.plateEdge} material={mats.ink} position={[0, 0, 0.001]} />
      </group>
      <mesh
        geometry={geo.shaft}
        material={mats.steel}
        position={[GAS.tb[0], GAS.tb[1], tbz - 0.08]}
        rotation={[Math.PI / 2, 0, 0]}
      />
      {/* the gears, cover off: the sector on the plate's shaft, the compound intermediate, the motor's pinion */}
      <group position={[GAS.tb[0], GAS.tb[1], 0]} rotation={[0, 0, GEAR.toSector - 0.12 + sectorRot - plateAngle(0)]}>
        <mesh geometry={geo.sector} material={mats.nylon} castShadow />
      </group>
      <group position={[GEAR.I[0], GEAR.I[1], 0]} rotation={[0, 0, interRot]}>
        <mesh geometry={geo.inter} material={mats.nylon} castShadow />
        <mesh geometry={geo.interSmall} material={mats.nylon} castShadow />
      </group>
      <mesh
        geometry={geo.hub}
        material={mats.steel}
        position={[GEAR.I[0], GEAR.I[1], tbz + 0.006]}
        rotation={[Math.PI / 2, 0, 0]}
      />
      {/* the motor (cut): the can, two magnets, the armature turning with the pinion */}
      <group position={[GAS.motor[0], GAS.motor[1], 0]}>
        <mesh geometry={geo.can} material={[mats.can, mats.can]} castShadow />
        {geo.magnets.map((g, i) => (
          <mesh key={i} geometry={g} material={mats.magnet} />
        ))}
        <group rotation={[0, 0, pinRot]}>
          {[0, 1, 2].map((k) => (
            <group key={k} rotation={[0, 0, (k / 3) * Math.PI * 2]}>
              <mesh geometry={geo.pole} material={mats.iron} />
              <mesh geometry={geo.winding} material={mats.copper} />
            </group>
          ))}
          <mesh geometry={geo.pinion} material={mats.steel} />
        </group>
      </group>
      <InkLine points={toV3(circlePts(GAS.motor, GAS.motorR, 40), tbz + 0.002)} thickness={ink} />

      {/* the computer: a finned aluminium box on the firewall, its connector on the near end */}
      <mesh
        geometry={roundedBox(ex1 - ex0, ey1 - ey0, ez1 - ez0, 0.008)}
        material={mats.ecu}
        position={[(ex0 + ex1) / 2, (ey0 + ey1) / 2, (ez0 + ez1) / 2]}
        castShadow
        receiveShadow
      />
      {[...Array(7).keys()].map((k) => (
        <mesh key={k} position={[ex1 + 0.008, ey0 + 0.022 + k * 0.022, (ez0 + ez1) / 2]} material={mats.ecu} castShadow>
          <boxGeometry args={[0.018, 0.005, ez1 - ez0 - 0.03]} />
        </mesh>
      ))}
      <mesh
        geometry={roundedBox(0.06, 0.12, 0.03, 0.006)}
        material={mats.connector}
        position={[(ex0 + ex1) / 2, (ey0 + ey1) / 2 - 0.005, ez1 + 0.012]}
        castShadow
      />
    </group>
  );
};

export type GasPedalsProps = {
  mood: Mood;
  /** How far the accelerator and the brake are pressed, 0 (up) → 1. */
  accel?: number;
  brake?: number;
};

/** The pedal module (hanging accelerator with its sensor) and the brake pedal with its switch. */
export const GasPedals: React.FC<GasPedalsProps> = ({mood, accel = 0, brake = 0}) => {
  const {env, envScale, albedo} = usePhys();
  const mats = useMemo(
    () => ({
      pad: phys(REAL.pedal, {roughness: 0.7}),
      padFace: phys(REAL.alu, {metalness: 0.7, roughness: 0.38}),
      arm: phys(REAL.steel, {metalness: 0.8, roughness: 0.4}),
      housing: phys(REAL.receiver, {roughness: 0.5}),
      bracket: phys(REAL.labDark, {metalness: 0.4, roughness: 0.55}),
      ribs: phys(REAL.pedal, {roughness: 0.8}),
      plunger: phys(REAL.shield, {roughness: 0.45}),
    }),
    [],
  );
  applyEnv(
    env,
    [
      [mats.arm, 0.8],
      [mats.padFace, 0.8],
    ],
    envScale,
  );
  applyAlbedo(Object.values(mats), albedo);
  void mood;
  const a = accelPadAt(accel);
  const b = brakePadAt(brake);
  const [apx, apy] = GAS.accelPivot;
  const [bpx, bpy] = GAS.brakePivot;
  // an arm from the pivot to the pad's back, as a box along the segment
  const arm = (p0: P2, p1: P2, z: number, w = 0.016) => {
    const dx = p1[0] - p0[0];
    const dy = p1[1] - p0[1];
    return {
      position: [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2, z] as V3,
      rotation: [0, 0, Math.atan2(dy, dx)] as V3,
      args: [Math.hypot(dx, dy), w, 0.012] as V3,
    };
  };
  // the pad's back, a little behind its face (away from the driver)
  const back = (c: P2, face: number, d: number): P2 => [c[0] + d * Math.sin(face), c[1] - d * Math.cos(face)];
  const aArm = arm([apx, apy], back(a.c, a.face, 0.014), GAS.accelZ);
  const bArm = arm([bpx, bpy], back(b.c, b.face, 0.02), GAS.brakeZ, 0.022);
  return (
    <group>
      {/* the accelerator module: a bracket on the firewall, the sealed sensor housing at the pivot, the arm, the pad */}
      <mesh
        geometry={roundedBox(0.05, 0.11, 0.08, 0.006)}
        material={mats.bracket}
        position={[apx + 0.035, apy + 0.01, GAS.accelZ]}
        rotation={[0, 0, 0.19]}
        castShadow
      />
      <mesh
        geometry={roundedBox(0.07, 0.07, 0.034, 0.012)}
        material={mats.housing}
        position={[apx, apy, GAS.accelZ + 0.03]}
        castShadow
      />
      <mesh
        geometry={roundedBox(0.03, 0.025, 0.026, 0.005)}
        material={mats.housing}
        position={[apx, apy + 0.045, GAS.accelZ + 0.03]}
        castShadow
      />
      <mesh position={aArm.position} rotation={aArm.rotation} material={mats.arm} castShadow>
        <boxGeometry args={aArm.args} />
      </mesh>
      <group position={[a.c[0], a.c[1], GAS.accelZ]} rotation={[0, 0, a.face]}>
        <mesh geometry={roundedBox(0.15, 0.018, 0.075, 0.007)} material={mats.pad} castShadow />
        {[...Array(5).keys()].map((k) => (
          <mesh key={k} position={[-0.056 + k * 0.028, 0.01, 0]} material={mats.ribs}>
            <boxGeometry args={[0.008, 0.004, 0.062]} />
          </mesh>
        ))}
      </group>
      {/* the brake pedal: its bracket, the switch at the top of the arm, the arm, the wide pad */}
      <mesh
        geometry={roundedBox(0.06, 0.06, 0.07, 0.006)}
        material={mats.bracket}
        position={[bpx + 0.01, bpy + 0.005, GAS.brakeZ]}
        castShadow
      />
      <mesh
        geometry={roundedBox(0.032, 0.024, 0.03, 0.005)}
        material={mats.housing}
        position={[bpx + 0.03, bpy - 0.045, GAS.brakeZ + 0.03]}
        castShadow
      />
      <mesh
        position={[bpx + 0.012, bpy - 0.045, GAS.brakeZ + 0.03]}
        rotation={[0, 0, Math.PI / 2]}
        material={mats.plunger}
      >
        <cylinderGeometry args={[0.005, 0.005, 0.02, 10]} />
      </mesh>
      <mesh position={bArm.position} rotation={bArm.rotation} material={mats.arm} castShadow>
        <boxGeometry args={bArm.args} />
      </mesh>
      <group position={[b.c[0], b.c[1], GAS.brakeZ]} rotation={[0, 0, b.face]}>
        <mesh geometry={roundedBox(0.1, 0.03, 0.17, 0.012)} material={mats.padFace} castShadow />
        {[-1, 0, 1].map((k) => (
          <mesh key={k} position={[k * 0.026, 0.016, 0]} material={mats.ribs}>
            <boxGeometry args={[0.008, 0.004, 0.15]} />
          </mesh>
        ))}
      </group>
    </group>
  );
};

/**
 * The gas pedal foot (car frame): its ankle (x, y), pitch (toes up), its lateral offset from the
 * accelerator's plane (+ toward the cut), and how far it presses each pedal. 'floor': flat, pulled back.
 * 'accel': the heel on the floor, the ball on the accelerator's pad. 'brake': the ball on the brake
 * pad, the heel lifted (pressing `press`). 'both': across both pedals, the ball on the brake (`press`)
 * and the shoe's edge on the accelerator (`edge`). `k` is the foot's scale (Figure `footScale`).
 */
export const gasFootPose = (
  pose: 'floor' | 'accel' | 'brake' | 'both',
  press = 0.5,
  edge = 0.45,
  floorY = 0.34,
  k = 1,
): {x: number; y: number; pitch: number; side: number; accel: number; brake: number} => {
  // the heel's offset from the ankle at a pitch (sole 0.1 below, heel 0.05 behind, × k)
  const heelOff = (a: number) => ({
    dx: k * (0.1 * Math.sin(a) - 0.05 * Math.cos(a)),
    dy: k * (-0.1 * Math.cos(a) - 0.05 * Math.sin(a)),
  });
  const ballL = 0.2 * k;
  const fromHeel = (h: P2, a: number) => {
    const o = heelOff(a);
    return {x: h[0] - o.dx, y: h[1] - o.dy, pitch: a};
  };
  if (pose === 'floor') return {x: 0.6 - 0.21 * k, y: floorY + 0.1 * k, pitch: 0, side: 0, accel: 0, brake: 0};
  if (pose === 'accel') {
    // the heel planted; the pitch that puts the ball on the pad's face line
    const pad = accelPadAt(press);
    const hx = 0.62;
    const h: P2 = [hx, floorY];
    // solve |c + s·d − h| = ballL for s (the face line through the pad's centre)
    const d: P2 = [Math.cos(pad.face), Math.sin(pad.face)];
    const lift = 0.012;
    const c: P2 = [pad.c[0] - lift * d[1], pad.c[1] + lift * d[0]];
    const ox = c[0] - h[0];
    const oy = c[1] - h[1];
    const B = ox * d[0] + oy * d[1];
    const Cc = ox * ox + oy * oy - ballL * ballL;
    const disc = Math.max(0, B * B - Cc);
    const s = -B + Math.sqrt(disc);
    const ball: P2 = [c[0] + s * d[0], c[1] + s * d[1]];
    const a = Math.atan2(ball[1] - h[1], ball[0] - h[0]);
    return {...fromHeel(h, a), side: 0, accel: press, brake: 0};
  }
  // on the brake: the ball on the pad's face (a little below its centre), the foot at a fixed pitch
  const pad = brakePadAt(press);
  const a = pose === 'both' ? 0.62 : 0.66;
  const d: P2 = [Math.cos(pad.face), Math.sin(pad.face)];
  const ballOn: P2 = [
    pad.c[0] - 0.018 * d[1] - 0.025 * d[0],
    pad.c[1] + 0.018 * d[0] - 0.025 * d[1] - (pose === 'both' ? 0.035 : 0),
  ];
  const h: P2 = [ballOn[0] - ballL * Math.cos(a), ballOn[1] - ballL * Math.sin(a)];
  return {
    ...fromHeel(h, a),
    side: pose === 'both' ? 0.055 : 0.15,
    accel: pose === 'both' ? edge : 0,
    brake: press,
  };
};

export type SteeringProps = {
  mood: Mood;
  /** The steering wheel's turn (rad): the column and the shaft turn with it. */
  steer?: number;
  /** The intermediate shaft, 1 (there) → 0 (gone: the steer-by-wire what-if; its stubs show hatched cut faces). */
  shaft?: number;
  /** The rack's travel (m, + to the near side), from the steering. */
  rack?: number;
  inkScale?: number;
};

/** The steering column, intermediate shaft, rack and its assist motor (see the file comment). */
export const Steering: React.FC<SteeringProps> = ({mood, steer = 0, shaft = 1, rack = 0, inkScale = 1}) => {
  const {env, envScale, albedo} = usePhys();
  const mats = useMemo(
    () => ({
      // bright, satin steel (a mirror finish went dark against the bay)
      steel: phys(REAL.chrome, {metalness: 0.35, roughness: 0.32, clearcoat: 0.4}),
      fade: phys(REAL.chrome, {metalness: 0.35, roughness: 0.32, clearcoat: 0.4, transparent: true}),
      shroud: phys(REAL.dash, {roughness: 0.6}),
      housing: phys(REAL.housing, {metalness: 0.55, roughness: 0.48}),
      boot: phys(REAL.rubber, {roughness: 0.75}),
      sensor: phys(REAL.receiver, {roughness: 0.5}),
      cut: cutMaterial(),
    }),
    [],
  );
  applyEnv(
    env,
    [
      [mats.steel, 1],
      [mats.fade, 1],
      [mats.housing, 0.6],
    ],
    envScale,
  );
  applyAlbedo(
    Object.values(mats).filter((m) => m !== mats.cut),
    albedo,
  );
  void mood;
  const z = GAS.shaftZ;
  const seg = (p0: P2, p1: P2) => {
    const dx = p1[0] - p0[0];
    const dy = p1[1] - p0[1];
    return {
      mid: [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2, z] as V3,
      len: Math.hypot(dx, dy),
      ang: Math.atan2(dy, dx) - Math.PI / 2,
      dir: [dx, dy] as P2,
    };
  };
  // the column runs from the wheel's hub along its axis (RealCar: the wheel tilted 0.42 rad) to U-joint A
  const hub: P2 = [0.68 + 0.2 * Math.cos(-0.42), 1.37 + 0.2 * Math.sin(-0.42)];
  // the column angles across from the wheel's plane to the shaft's (3D)
  const col = (() => {
    const a = new THREE.Vector3(hub[0], hub[1], GAS.steerZ);
    const b = new THREE.Vector3(GAS.ujA[0], GAS.ujA[1], z);
    const d = b.clone().sub(a);
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize());
    const at = (k: number): V3 => {
      const v = a.clone().addScaledVector(d, k);
      return [v.x, v.y, v.z];
    };
    return {mid: at(0.5), len: d.length(), q, at};
  })();
  const ab = seg(GAS.ujA, GAS.ujB);
  const bp = seg(GAS.ujB, GAS.pinion);
  const stub = 0.035;
  const fade = Math.max(0, Math.min(1, shaft));
  mats.fade.opacity = fade;
  const gone = 1 - fade;
  const ink = INK * inkScale;
  const along = (s: ReturnType<typeof seg>, from: P2, d: number): V3 => [
    from[0] + (s.dir[0] / s.len) * d,
    from[1] + (s.dir[1] / s.len) * d,
    z,
  ];
  // a cut face on a stub: a hatched disc facing along the shaft, with its ink ring
  const cutFace = (p: V3, s: ReturnType<typeof seg>, k: string) => (
    <group key={k} position={p} rotation={[0, 0, s.ang]} visible={gone > 0.02} scale={Math.max(0.001, gone)}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} material={mats.cut}>
        <circleGeometry args={[GAS.shaftR + 0.001, 20]} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[GAS.shaftR + 0.001, Math.max(ink, 0.004) / 2, 4, 24]} />
        <meshBasicMaterial color={raw(section.cutLine)} />
      </mesh>
    </group>
  );
  const ujoint = (p: P2, k: string) => (
    <group key={k} position={[p[0], p[1], z]} rotation={[steer, 0, 0]}>
      <mesh material={mats.steel} castShadow>
        <sphereGeometry args={[0.038, 16, 12]} />
      </mesh>
      <mesh material={mats.steel} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.034, 0.008, 8, 20]} />
      </mesh>
    </group>
  );
  return (
    <group>
      {/* the column in its shroud, the angle sensor ring at its lower end */}
      <mesh position={col.mid} quaternion={col.q} material={mats.shroud} castShadow>
        <cylinderGeometry args={[0.034, 0.042, col.len, 20]} />
      </mesh>
      <mesh position={col.at(1 - 0.06 / col.len)} quaternion={col.q} material={mats.sensor} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.035, 24]} />
      </mesh>
      {ujoint(GAS.ujA, 'a')}
      {/* the steel intermediate shaft: two stubs that stay, the middle that fades for the what-if */}
      <mesh position={along(ab, GAS.ujA, stub / 2 + 0.02)} rotation={[0, 0, ab.ang]} material={mats.steel} castShadow>
        <cylinderGeometry args={[GAS.shaftR, GAS.shaftR, stub, 16]} />
      </mesh>
      <mesh
        position={along(ab, GAS.ujA, ab.len - stub / 2 - 0.02)}
        rotation={[0, 0, ab.ang]}
        material={mats.steel}
        castShadow
      >
        <cylinderGeometry args={[GAS.shaftR, GAS.shaftR, stub, 16]} />
      </mesh>
      {fade > 0.01 ? (
        <mesh position={ab.mid} rotation={[0, 0, ab.ang]} material={mats.fade} castShadow={fade > 0.5}>
          <cylinderGeometry args={[GAS.shaftR, GAS.shaftR, ab.len - 2 * (stub + 0.02), 16]} />
        </mesh>
      ) : null}
      {cutFace(along(ab, GAS.ujA, stub + 0.02 + 0.001), ab, 'ca')}
      {cutFace(along(ab, GAS.ujA, ab.len - stub - 0.02 - 0.001), ab, 'cb')}
      {ujoint(GAS.ujB, 'b')}
      <mesh position={bp.mid} rotation={[0, 0, bp.ang]} material={mats.steel} castShadow>
        <cylinderGeometry args={[0.022, 0.022, bp.len, 16]} />
      </mesh>
      {/* the rack (across the car), its pinion housing, boots and the assist motor */}
      <mesh position={[GAS.pinion[0], GAS.pinion[1], z]} material={mats.housing} castShadow>
        <boxGeometry args={[0.07, 0.08, 0.08]} />
      </mesh>
      <mesh
        position={[GAS.pinion[0], GAS.pinion[1] - 0.03, 0.12 + rack]}
        rotation={[Math.PI / 2, 0, 0]}
        material={mats.steel}
        castShadow
      >
        <cylinderGeometry args={[0.014, 0.014, 1.3, 14]} />
      </mesh>
      <mesh
        position={[GAS.pinion[0], GAS.pinion[1] - 0.03, -0.015]}
        rotation={[Math.PI / 2, 0, 0]}
        material={mats.housing}
        castShadow
      >
        <cylinderGeometry args={[0.03, 0.03, 0.87, 20]} />
      </mesh>
      <mesh
        position={[GAS.pinion[0], GAS.pinion[1] - 0.03, (GAS.rackMotor[0] + GAS.rackMotor[1]) / 2]}
        rotation={[Math.PI / 2, 0, 0]}
        material={mats.housing}
        castShadow
      >
        <cylinderGeometry args={[0.058, 0.058, GAS.rackMotor[1] - GAS.rackMotor[0], 24]} />
      </mesh>
      <mesh
        position={[GAS.pinion[0], GAS.pinion[1] - 0.03, 0.66]}
        rotation={[Math.PI / 2, 0, 0]}
        material={mats.boot}
        castShadow
      >
        <cylinderGeometry args={[0.022, 0.032, 0.12, 16]} />
      </mesh>
    </group>
  );
};

/** The loom: black wiring along the signal routes (the orange rides it). */
export const GasLoom: React.FC<{mood: Mood; routes?: V3[][]}> = ({
  mood,
  routes = [GAS_ROUTES.pedal, GAS_ROUTES.motor, GAS_ROUTES.brake],
}) => {
  const albedo = useAlbedo();
  const mat = useMemo(() => phys(REAL.cable, {roughness: 0.55}), []);
  applyAlbedo([mat], albedo);
  void mood;
  const key = JSON.stringify(routes);
  const geos = useMemo(
    () =>
      (JSON.parse(key) as V3[][]).map(
        (r) =>
          new THREE.TubeGeometry(
            new THREE.CatmullRomCurve3(r.map((p) => new THREE.Vector3(p[0], p[1], p[2] - 0.006))),
            40,
            0.009,
            8,
          ),
      ),
    [key],
  );
  return (
    <group>
      {geos.map((g, i) => (
        <mesh key={i} geometry={g} material={mat} castShadow />
      ))}
    </group>
  );
};

/* ───────────── No. 007: the V8, the 8-pair gearbox and the rear drive (rear-wheel drive) ───────────── */

/**
 * The V8's layout (car frame, metres). The engine sits longitudinally behind the front axle, its crank on
 * the car's centre line (z = 0). It is cut across on the plane x = `sectionX` through its rear pair of
 * cylinders; the cut face looks back toward the cabin (the camera's 3/4 side), the engine runs forward to
 * `front`. A generic 5.0 L: 100 mm bore, 90 mm stroke, banks at 90°.
 */
export const V8 = {
  sectionX: 1.42,
  front: 1.93,
  /** The block's rear face (the converter housing bolts here). */
  rear: 1.355,
  crankY: 0.5,
  /** Each bank's lean from vertical (rad). */
  bank: Math.PI / 4,
  boreR: 0.05,
  throw: 0.045,
  rod: 0.155,
  /** The deck's height along a bank's axis from the crank; the bore's bottom; the bank's half width. */
  deck: 0.235,
  boreFoot: 0.1,
  bankW: 0.072,
  /** The head's height along the axis and half width. */
  head: 0.11,
  headW: 0.085,
};

/** The crank's on-screen speed as a share of the real one (🎭: the real 800 rpm idle would strobe at 30 fps). */
export const CRANK_SCALE = 0.04;

/**
 * The crankshaft's angle (rad) at `t` seconds (race time, after any slow motion) from `rpm` (a number or
 * keys, eased cubic between keys), integrated in fixed steps, × `scale` (🎭, default `CRANK_SCALE`: 800 rpm
 * → 0.53 turns/s, 6,500 → 4.3). `from`: the angle at t = 0 (to carry it across a cut).
 */
export const crankAngleAt = (rpm: Keyed, t: number, {scale = CRANK_SCALE, from = 0} = {}) => {
  const step = 1 / 120;
  let turns = 0;
  for (let x = 0; x < t; x += step) turns += (keyedValue(rpm, x + step / 2, 800) / 60) * Math.min(step, t - x);
  return from + turns * Math.PI * 2 * scale;
};

/** The gearbox's layout (car frame): in line behind the engine, the input shaft on the crank's axis. */
export const GBX = {
  /** The main case's front wall (behind the converter housing, which runs from `V8.rear`). */
  front: 1.13,
  rear: 0.37,
  /** The tail housing's end, where the output shaft leaves. */
  tail: 0.29,
  inputY: V8.crankY,
  /** The output shaft sits this far above the input shaft (the pairs' centre distance, 🎭 scaled up). */
  D: 0.16,
  /** Pair 1's centre (x, the front one), the step between pairs, each gear's face width (🎭 scaled up). */
  first: 1.059,
  pitch: 0.082,
  face: 0.064,
  /** Output gear ÷ input gear, pairs 1 → 8 (🎭: a generic spread, not one maker's ratios). */
  ratios: [2.4, 1.9, 1.55, 1.3, 1.1, 0.95, 0.83, 0.72],
  /** The case is cut on this plane (z), in front of the shafts, so the gears show whole; its far wall. */
  caseCut: 0.15,
  back: -0.18,
  /** The converter housing is cut on the crank's own plane (z), so the V8's cut face shows past it. */
  bellCut: 0,
  /** The torque converter: its centre (x), radius and length. */
  converter: {x: 1.2, r: 0.125, len: 0.11},
};

/** The rear drive's layout (car frame): the rear axle as `CAR_LAYOUT` (x −1.35, wheel radius 0.36). */
export const RWD = {
  /** The driveshaft's front flange (at the output shaft) and its rear one (the pinion's), x. */
  flange: 0.27,
  pinionX: -1.17,
  /** The pinion's axis sits in front of the ring gear (z). */
  pinionZ: 0.03,
  axleX: -1.35,
  axleY: 0.36,
  ringR: 0.105,
  /** The diff's ratio (driveshaft turns per wheel turn). */
  final: 3.15,
  /** The diff housing's cut plane (z) and the half-shaft's hub flange (z, just inside the near wheel). */
  diffCut: 0.075,
  hub: 0.68,
};

/** Pair `i` (1 → 8): its centre x, the input gear's and the output gear's radius and teeth. */
export const gearPair = (i: number) => {
  const k = Math.max(1, Math.min(8, Math.round(i))) - 1;
  const rho = GBX.ratios[k];
  const rIn = GBX.D / (1 + rho);
  const rOut = GBX.D - rIn;
  const teeth = (r: number) => Math.max(10, Math.round((Math.PI * 2 * r) / 0.0165));
  return {x: GBX.first - k * GBX.pitch, rIn, rOut, nIn: teeth(rIn), nOut: teeth(rOut)};
};

export type GearKey = {at: number; gear: number};
/** How long a gear change takes to light the new pair (s). */
export const GEAR_STEP = 0.2;

/**
 * The gear at `t` (s) from `gear` keys: the active pair, the pair before the last change and the change's
 * progress (0 → 1 over `step`, default 0.2 s). Before the first key, its gear, settled. Gear 0: neutral.
 */
export const gearShiftAt = (keys: GearKey[] | number | undefined, t: number, step = GEAR_STEP) => {
  if (keys === undefined || typeof keys === 'number') {
    const g = keys ?? 1;
    return {gear: g, from: g, shift: 1};
  }
  const ks = [...keys].sort((a, b) => a.at - b.at);
  if (!ks.length) return {gear: 1, from: 1, shift: 1};
  let gear = ks[0].gear;
  let from = gear;
  let at = -Infinity;
  for (const k of ks) {
    if (k.at > t) break;
    if (k.gear !== gear) {
      from = gear;
      gear = k.gear;
      at = k.at;
    }
  }
  const shift = step > 0 ? Math.max(0, Math.min(1, (t - at) / step)) : 1;
  return {gear, from, shift};
};

/** How lit pair `i` is during a change (0 → 1): the new pair rises as the old one falls. */
const pairLit = (i: number, gear: number, from: number, shift: number) => {
  const s = shift * shift * (3 - 2 * shift);
  return (i === gear ? s : 0) + (i === from && from !== gear ? 1 - s : 0);
};

/**
 * The drive path's legs (car frame) in `gear`, for the orange path (N4): `crank` (the crank's centre on
 * the V8's cut face → through the converter → along the input shaft to the active pair's input gear),
 * `pair` (up through the mesh to the output gear), `driveshaft` (along the output shaft, out the tail,
 * down the driveshaft to the pinion), `wheel` (the pinion → the ring gear → out along the near half-shaft
 * to the hub). Points ride the parts' axes; lift them toward the camera (z) where a part hides them.
 */
export const gasDriveRoute = (gear: number): Record<'crank' | 'pair' | 'driveshaft' | 'wheel', V3[]> => {
  const p = gearPair(gear);
  const yIn = GBX.inputY;
  const yOut = GBX.inputY + GBX.D;
  return {
    crank: [
      [V8.sectionX - 0.01, V8.crankY, 0],
      [GBX.converter.x, yIn, 0],
      [GBX.front - 0.02, yIn, 0],
      [p.x, yIn, 0],
    ],
    pair: [
      [p.x, yIn, 0],
      [p.x, yIn + p.rIn, 0],
      [p.x, yOut, 0],
    ],
    driveshaft: [
      [p.x, yOut, 0],
      [GBX.tail, yOut, 0],
      [RWD.flange, yOut, 0],
      [RWD.pinionX, RWD.axleY, RWD.pinionZ],
      [RWD.axleX + RWD.ringR + 0.03, RWD.axleY, RWD.pinionZ],
    ],
    wheel: [
      [RWD.axleX + RWD.ringR + 0.03, RWD.axleY, RWD.pinionZ],
      [RWD.axleX + RWD.ringR - 0.01, RWD.axleY, 0],
      [RWD.axleX, RWD.axleY, 0.02],
      [RWD.axleX, RWD.axleY, RWD.diffCut + 0.02],
      [RWD.axleX, RWD.axleY, RWD.hub],
    ],
  };
};

/** How far toward the camera (z) the drawn drive path rides in front of the gear pairs and the converter (their radii reach ≈ 0.125). */
export const GAS_PATH_LIFT = 0.135;

/**
 * The drive path as drawn (N4): `gasDriveRoute(gear)` with its points lifted toward the camera where a
 * part hides them: in front of the converter and the gear pairs (`GAS_PATH_LIFT`, inside the case's cut at
 * `GBX.caseCut`), off the driveshaft's front, in front of the diff's cut and along the top of the near
 * half-shaft, ending at `hubZ` (the near rear wheel's cut face, or its outer face when the wheel is whole).
 * The crank's node sits on the V8's cut face. `view`: the direction toward the camera in the car's frame
 * (e.g. `SECTION_ANGLE`, x mirrored for a left-facing car): each point is lifted along it, so on screen it
 * stays over the part it rides (a pure z lift would slide it off the active pair). Car frame.
 */
export const gasDrivePath = (
  gear: number,
  hubZ = RWD.hub + 0.115,
  view?: V3,
): Record<'crank' | 'pair' | 'driveshaft' | 'wheel', V3[]> => {
  const p = gearPair(gear);
  const yIn = GBX.inputY;
  const yOut = GBX.inputY + GBX.D;
  const L = GAS_PATH_LIFT;
  const ds = 0.05;
  const dz = RWD.diffCut + 0.02;
  // a point on a part's axis, `l` toward the camera (along `view`, else straight +z)
  const up = (x: number, y: number, z: number, l: number): V3 =>
    view && view[2] > 0.05 ? [x + (l * view[0]) / view[2], y + (l * view[1]) / view[2], z + l] : [x, y, z + l];
  return {
    crank: [
      up(V8.sectionX - 0.01, V8.crankY, 0, 0.02),
      up(V8.rear - 0.03, yIn, 0, L * 0.6),
      up(GBX.converter.x, yIn, 0, L),
      up(GBX.front - 0.02, yIn, 0, L),
      up(p.x, yIn, 0, L),
    ],
    pair: [up(p.x, yIn, 0, L), up(p.x, yIn + p.rIn, 0, L), up(p.x, yOut, 0, L)],
    driveshaft: [
      up(p.x, yOut, 0, L),
      up(GBX.tail, yOut, 0, L * 0.8),
      up(RWD.flange, yOut, 0, ds),
      up(RWD.pinionX, RWD.axleY, 0, ds),
      up(RWD.axleX + RWD.ringR + 0.03, RWD.axleY, RWD.pinionZ, dz - RWD.pinionZ),
    ],
    wheel: [
      up(RWD.axleX + RWD.ringR + 0.03, RWD.axleY, RWD.pinionZ, dz - RWD.pinionZ),
      [RWD.axleX + 0.03, RWD.axleY + 0.04, dz],
      [RWD.axleX, RWD.axleY + 0.032, dz + 0.06],
      [RWD.axleX, RWD.axleY + 0.032, Math.min(RWD.hub - 0.04, hubZ - 0.05)],
      [RWD.axleX, RWD.axleY, hubZ],
    ],
  };
};

/** A point on a V8 bank (section coordinates: a across the car toward the cut, b up from the crank). */
const bp = (side: number, along: number, across: number): P2 => {
  const s = Math.sin(V8.bank);
  const c = Math.cos(V8.bank);
  return [along * side * s + across * side * c, along * c - across * s];
};

export type V8BayProps = {
  mood: Mood;
  /** The crankshaft's angle (rad): pistons, rods, crank and cams follow it. */
  crank?: number;
  inkScale?: number;
};

/** The V8 cut across (see `V8`): block, heads, pistons, rods, crank, cams, intake, exhaust, pan, radiator. */
export const V8Bay: React.FC<V8BayProps> = ({mood, crank = 0, inkScale = 1}) => {
  const {env, envScale, albedo} = usePhys();
  const mats = useMemo(
    () => ({
      cut: cutMaterial(),
      alu: phys(REAL.housing, {metalness: 0.55, roughness: 0.48}),
      iron: phys(REAL.lamination, {metalness: 0.45, roughness: 0.5}),
      ironDark: phys(REAL.labDark, {metalness: 0.4, roughness: 0.6}),
      steel: phys(REAL.steel, {metalness: 0.9, roughness: 0.3}),
      piston: phys(REAL.alu, {metalness: 0.75, roughness: 0.35}),
      plastic: phys(REAL.dash, {roughness: 0.6}),
      bore: phys(REAL.lamination, {metalness: 0.6, roughness: 0.32, side: THREE.BackSide}),
      exhaust: phys(REAL.rimPaint, {metalness: 0.7, roughness: 0.5}),
      radiator: phys(REAL.labDark, {metalness: 0.3, roughness: 0.6}),
    }),
    [],
  );
  applyEnv(
    env,
    [
      [mats.alu, 0.6],
      [mats.iron, 0.6],
      [mats.steel, 1],
      [mats.piston, 0.8],
      [mats.bore, 0.6],
      [mats.exhaust, 0.6],
    ],
    envScale,
  );
  applyAlbedo(
    Object.values(mats).filter((m) => m !== mats.cut),
    albedo,
  );
  void mood;

  const geo = useMemo(() => {
    const len = V8.front - V8.sectionX;
    const r = V8.boreR;
    const W = V8.bankW;
    const deck = V8.deck;
    const foot = V8.boreFoot;
    const mirror = (pts: P2[]): P2[] => pts.map(([a, b]) => [-a, b] as P2).reverse();
    // the block: an outer wall each side (bank wall + skirt), the valley piece between the bores (Λ)
    const outerNear: P2[] = [
      bp(1, deck, r),
      bp(1, deck, W),
      bp(1, 0.13, W),
      [0.165, -0.02],
      [0.165, -0.075],
      [0.125, -0.075],
      [0.115, -0.02],
      bp(1, foot, r),
    ];
    const valley: P2[] = [
      bp(1, deck, -r),
      [0.019, 0.09],
      [-0.019, 0.09],
      bp(-1, deck, -r),
      bp(-1, deck, -W),
      [-0.041, 0.143],
      [0.041, 0.143],
      bp(1, deck, -W),
    ];
    const blocks = [outerNear, mirror(outerNear), valley];
    // a bore's slot, filled behind the half-bore (the block between cylinders)
    const slot = (side: number): P2[] => [bp(side, foot, -r), bp(side, foot, r), bp(side, deck, r), bp(side, deck, -r)];
    // the heads (ports: intake on the valley side, exhaust outside), their cam covers
    const h0 = deck;
    const h1 = deck + V8.head;
    const w = V8.headW;
    const head = (sd: number) => {
      const hp = (al: number, ac: number) => bp(sd, al, ac);
      const outline = [
        hp(h0, -w),
        hp(h0, -r),
        hp(h0 + 0.03, -0.033),
        hp(h0 + 0.035, 0),
        hp(h0 + 0.03, 0.033),
        hp(h0, r),
        hp(h0, w),
        hp(h1, w),
        hp(h1, -w),
      ];
      const intake = [
        hp(h0 + 0.03, -0.026),
        hp(h0 + 0.05, -0.01),
        hp(h0 + 0.075, -0.051),
        hp(h0 + 0.09, -w - 0.0015),
        hp(h0 + 0.055, -w - 0.0015),
      ];
      const exhaust = [
        hp(h0 + 0.03, 0.026),
        hp(h0 + 0.05, 0.01),
        hp(h0 + 0.07, 0.051),
        hp(h0 + 0.08, w + 0.0015),
        hp(h0 + 0.045, w + 0.0015),
      ];
      const cover = [
        hp(h1, -w - 0.005),
        hp(h1, w + 0.005),
        hp(h1 + 0.045, w - 0.005),
        hp(h1 + 0.065, 0.045),
        hp(h1 + 0.065, -0.045),
        hp(h1 + 0.045, -w + 0.005),
      ];
      return {outline, holes: [intake, exhaust], cover};
    };
    const heads = [head(1), head(-1)];
    // the intake in the valley: a hollow plenum, open each side toward the intake ports
    const plenumLow: P2[] = [
      [-0.13, 0.262],
      [-0.13, 0.25],
      [-0.04, 0.162],
      [0.04, 0.162],
      [0.13, 0.25],
      [0.13, 0.262],
      [0.118, 0.262],
      [0.118, 0.255],
      [0.035, 0.174],
      [-0.035, 0.174],
      [-0.118, 0.255],
      [-0.118, 0.262],
    ];
    const plenumTop: P2[] = [
      [-0.135, 0.3],
      [-0.135, 0.37],
      [0.135, 0.37],
      [0.135, 0.3],
      [0.123, 0.3],
      [0.123, 0.358],
      [-0.123, 0.358],
      [-0.123, 0.3],
    ];
    // the oil pan (pressed steel, cut) under the skirts; the crankcase's far wall seen through the cut
    const pan: P2[] = [
      [-0.17, -0.075],
      [-0.162, -0.075],
      [-0.142, -0.202],
      [0.142, -0.202],
      [0.162, -0.075],
      [0.17, -0.075],
      [0.15, -0.21],
      [-0.15, -0.21],
    ];
    const cavity: P2[] = [
      [-0.15, -0.205],
      [0.15, -0.205],
      [0.165, -0.075],
      [0.115, -0.02],
      bp(1, foot, r),
      [0.019, 0.09],
      [-0.019, 0.09],
      bp(-1, foot, r),
      [-0.115, -0.02],
      [-0.165, -0.075],
    ];
    // the exhaust logs (cut rings) outside each head
    const exhaustC = (sd: number) => bp(sd, h0 + 0.0625, w + 0.03);
    const ring = (c: P2) =>
      shapeOf(
        circlePts(c, 0.026, 28),
        [circlePts(c, 0.018, 28).reverse()],
      );
    const pieces = [...blocks, ...heads.map((h) => h.outline), plenumLow, plenumTop, pan];
    // the crank's web: a counterweight opposite the pin, a boss round the pin (pin up at angle 0)
    const web: P2[] = [
      ...circlePts([0, V8.throw], 0.034, 14, -0.25, Math.PI + 0.25),
      ...circlePts([0, 0], 0.085, 20, Math.PI + 0.55, Math.PI * 2 - 0.55),
    ];
    return {
      len,
      blocks: blocks.map((b) => extrude(shapeOf(b), -len, 0)),
      slots: [1, -1].map((sd) => extrude(shapeOf(slot(sd)), -len, -r)),
      boreBack: new THREE.CylinderGeometry(r, r, deck - foot, 24, 1, true, Math.PI / 2, Math.PI),
      heads: heads.map((h) => extrude(shapeOf(h.outline, h.holes), -len, 0)),
      covers: heads.map((h) => extrude(shapeOf(h.cover), -len, -0.002)),
      plenum: [plenumLow, plenumTop].map((p) => extrude(shapeOf(p), -len, 0)),
      pan: extrude(shapeOf(pan), -len, 0),
      cavity: new THREE.ShapeGeometry(shapeOf(cavity)),
      exhaust: [1, -1].map((sd) => extrude(ring(exhaustC(sd)), -len, 0)),
      ink: [
        ...pieces,
        ...heads.flatMap((h) => h.holes),
        ...[1, -1].flatMap((sd) => [circlePts(exhaustC(sd), 0.026, 28), circlePts(exhaustC(sd), 0.018, 28)]),
      ].map((p) => toV3(dense(p), 0.002)),
      piston: new THREE.CylinderGeometry(r - 0.002, r - 0.002, 0.05, 28),
      ringGroove: new THREE.CylinderGeometry(r - 0.0005, r - 0.0005, 0.003, 28),
      rod: new THREE.BoxGeometry(0.022, V8.rod, 0.013),
      bigEnd: new THREE.CylinderGeometry(0.026, 0.026, 0.013, 20),
      web: extrude(shapeOf(web), -0.05, -0.035),
      pin: new THREE.CylinderGeometry(0.02, 0.02, 0.05, 16),
      journal: new THREE.CylinderGeometry(0.03, 0.03, 0.14, 18),
      cam: extrude(
        shapeOf([...circlePts([0, 0], 0.016, 24, 0.6, Math.PI * 2 - 0.6), [0.031, 0]]),
        -len + 0.02,
        -0.004,
      ),
      valve: new THREE.BoxGeometry(0.006, 0.065, 0.006),
      valveHead: new THREE.CylinderGeometry(0.015, 0.015, 0.004, 20),
      rearShaft: new THREE.CylinderGeometry(0.03, 0.03, V8.sectionX - (GBX.converter.x + GBX.converter.len / 2) + 0.01, 18),
    };
  }, []);

  const ink = INK * inkScale;
  const th = crank;
  const pin: P2 = [V8.throw * Math.sin(th), V8.throw * Math.cos(th)];
  const s = Math.sin(V8.bank);
  const c = Math.cos(V8.bank);
  // each bank's piston and rod from the shared crank pin
  const banks = [1, -1].map((sd) => {
    const al = pin[0] * sd * s + pin[1] * c;
    const ac = pin[0] * sd * c - pin[1] * s;
    const pistonAlong = al + Math.sqrt(V8.rod ** 2 - ac ** 2);
    const q = bp(sd, pistonAlong, 0);
    const pc = bp(sd, pistonAlong + 0.012, 0);
    const mid: P2 = [(pin[0] + q[0]) / 2, (pin[1] + q[1]) / 2];
    const ang = Math.atan2(q[1] - pin[1], q[0] - pin[0]) - Math.PI / 2;
    return {sd, pc, mid, ang, rodZ: sd > 0 ? 0.007 : -0.007};
  });
  const h0 = V8.deck;

  return (
    <group>
      {/* the crank's rear end, out of the block into the converter */}
      <mesh
        geometry={geo.rearShaft}
        material={mats.steel}
        position={[(V8.sectionX + GBX.converter.x + GBX.converter.len / 2) / 2, V8.crankY, 0]}
        rotation={[0, 0, Math.PI / 2]}
      />
      {/* the engine in its section frame: local x = the car's z (toward the cut), y up, local +z = the car's −x */}
      <group position={[V8.sectionX, V8.crankY, 0]} rotation={[0, -Math.PI / 2, 0]}>
        {geo.blocks.map((g, i) => (
          <mesh key={i} geometry={g} material={[mats.cut, mats.iron]} castShadow receiveShadow />
        ))}
        {geo.slots.map((g, i) => (
          <mesh key={i} geometry={g} material={mats.iron} />
        ))}
        <mesh geometry={geo.cavity} material={mats.ironDark} position={[0, 0, -0.16]} />
        {[1, -1].map((sd) => (
          <mesh
            key={sd}
            geometry={geo.boreBack}
            material={mats.bore}
            position={[...bp(sd, (V8.boreFoot + V8.deck) / 2, 0), 0]}
            rotation={[0, 0, -sd * V8.bank]}
          />
        ))}
        {geo.heads.map((g, i) => (
          <mesh key={i} geometry={g} material={[mats.cut, mats.alu]} castShadow receiveShadow />
        ))}
        {geo.covers.map((g, i) => (
          <mesh key={i} geometry={g} material={mats.plastic} castShadow receiveShadow />
        ))}
        {geo.plenum.map((g, i) => (
          <mesh key={i} geometry={g} material={[mats.cut, mats.alu]} castShadow receiveShadow />
        ))}
        <mesh geometry={geo.pan} material={[mats.cut, mats.ironDark]} castShadow receiveShadow />
        {geo.exhaust.map((g, i) => (
          <mesh key={i} geometry={g} material={[mats.cut, mats.exhaust]} castShadow />
        ))}
        {geo.ink.map((p, i) => (
          <InkLine key={i} points={p} thickness={ink} />
        ))}
        {/* valves and cams (the cams turn at half the crank's speed) */}
        {[1, -1].map((sd) =>
          [-1, 1].map((v) => (
            <group key={`${sd}${v}`}>
              <mesh
                geometry={geo.valve}
                material={mats.steel}
                position={[...bp(sd, h0 + 0.068, v * 0.019), -0.01] as V3}
                rotation={[0, 0, -sd * V8.bank - sd * v * 0.2]}
              />
              <mesh
                geometry={geo.valveHead}
                material={mats.steel}
                position={[...bp(sd, h0 + 0.033, v * 0.026), -0.01] as V3}
                rotation={[0, 0, -sd * V8.bank - sd * v * 0.2]}
              />
              <mesh
                geometry={geo.cam}
                material={mats.steel}
                position={[...bp(sd, h0 + 0.095, v * 0.04), 0] as V3}
                rotation={[0, 0, -th / 2 + sd * 0.9 + v * 1.3]}
                castShadow
              />
            </group>
          )),
        )}
        {/* the crank: main journal, the web, the pin; each bank's rod and piston */}
        <mesh geometry={geo.journal} material={mats.steel} position={[0, 0, -0.13]} rotation={[Math.PI / 2, 0, 0]} />
        <mesh geometry={geo.web} material={mats.iron} rotation={[0, 0, -th]} castShadow />
        <mesh geometry={geo.pin} material={mats.steel} position={[pin[0], pin[1], -0.01]} rotation={[Math.PI / 2, 0, 0]} />
        {banks.map((b) => (
          <group key={b.sd}>
            <mesh geometry={geo.rod} material={mats.steel} position={[b.mid[0], b.mid[1], b.rodZ]} rotation={[0, 0, b.ang]} />
            <mesh
              geometry={geo.bigEnd}
              material={mats.steel}
              position={[pin[0], pin[1], b.rodZ]}
              rotation={[Math.PI / 2, 0, 0]}
            />
            <group position={[b.pc[0], b.pc[1], 0]} rotation={[0, 0, -b.sd * V8.bank]}>
              <mesh geometry={geo.piston} material={mats.piston} castShadow />
              {[0.016, 0.007].map((y) => (
                <mesh key={y} geometry={geo.ringGroove} material={mats.ironDark} position={[0, y, 0]} />
              ))}
            </group>
          </group>
        ))}
      </group>
      {/* the radiator behind the grille */}
      <mesh
        geometry={roundedBox(0.045, 0.56, 0.9, 0.01)}
        material={mats.radiator}
        position={[2.06, 0.6, -0.15]}
        castShadow
        receiveShadow
      />
    </group>
  );
};

export type GearboxProps = {
  mood: Mood;
  /** The input shaft's angle (rad): the crank's (the converter locked, 🎭). Every gear turns, meshed. */
  input?: number;
  /** The active pair, 1 → 8 (0: neutral, none lit). Default 1. */
  gear?: number;
  /** The pair before the last change, and the change's progress 0 → 1 (`gearShiftAt`). Default settled. */
  from?: number;
  shift?: number;
  /** How bright the lit pair is (0 → 1, default 1): a pale non-system glow (`screenLight`), never orange. */
  litLevel?: number;
  inkScale?: number;
};

/** The converter housing, torque converter, the case cut open and the 8 gear pairs (see `GBX`). */
export const Gearbox: React.FC<GearboxProps> = ({
  mood,
  input = 0,
  gear = 1,
  from,
  shift = 1,
  litLevel = 1,
  inkScale = 1,
}) => {
  const {env, envScale, albedo} = usePhys();
  const mats = useMemo(
    () => ({
      cut: cutMaterial(),
      alu: phys(REAL.housing, {metalness: 0.55, roughness: 0.48}),
      back: phys(REAL.lamination, {metalness: 0.4, roughness: 0.55}),
      steel: phys(REAL.steel, {metalness: 0.9, roughness: 0.3}),
      converter: phys(REAL.chrome, {metalness: 0.75, roughness: 0.35}),
      bolt: phys(REAL.labDark, {metalness: 0.5, roughness: 0.45}),
      // one material per pair, so each lights on its own
      pairs: [...Array(8).keys()].map(() =>
        phys(REAL.rimPaint, {metalness: 0.8, roughness: 0.4, emissive: raw(section.screenLight), emissiveIntensity: 0}),
      ),
    }),
    [],
  );
  applyEnv(
    env,
    [
      [mats.alu, 0.6],
      [mats.back, 0.5],
      [mats.steel, 1],
      [mats.converter, 0.9],
      ...mats.pairs.map((m) => [m, 0.9] as [THREE.MeshStandardMaterial, number]),
    ],
    envScale,
  );
  applyAlbedo([mats.alu, mats.back, mats.steel, mats.converter, mats.bolt, ...mats.pairs], albedo);
  void mood;
  const fromGear = from ?? gear;
  const unlit = raw(REAL.rimPaint);
  const lit = raw(REAL.chrome);
  mats.pairs.forEach((m, k) => {
    const l = pairLit(k + 1, gear, fromGear, shift) * litLevel;
    m.color.copy(unlit).lerp(lit, l);
    m.emissiveIntensity = 0.8 * l;
    // unlit pairs reflect less, so the lit one stands out
    m.envMapIntensity *= 0.4 + 0.6 * l;
  });

  const geo = useMemo(() => {
    const cY = GBX.inputY;
    // the converter housing: open toward the engine (it bolts to the block), a C in section
    const bellOut: P2[] = [
      [V8.rear, cY - 0.19],
      [V8.rear, cY - 0.176],
      [GBX.front + 0.014, cY - 0.147],
      [GBX.front + 0.014, cY + 0.147],
      [V8.rear, cY + 0.176],
      [V8.rear, cY + 0.19],
      [GBX.front, cY + 0.16],
      [GBX.front, cY - 0.16],
    ];
    const outline: P2[] = [
      [GBX.front, cY + 0.3],
      [GBX.rear, cY + 0.3],
      [GBX.rear, cY + 0.215],
      [GBX.tail, cY + 0.2],
      [GBX.tail, cY + 0.12],
      [GBX.rear, cY + 0.105],
      [GBX.rear, cY - 0.12],
      [GBX.front, cY - 0.12],
    ];
    const main: P2[] = rect(GBX.rear + 0.014, GBX.front - 0.014, cY - 0.106, cY + 0.286);
    const z = GBX.caseCut;
    const pairs = [...Array(8).keys()].map((k) => {
      const p = gearPair(k + 1);
      const g = (rr: number, n: number) => {
        const geom = extrude(shapeOf(gearPts(rr, n, 0.008)), -GBX.face / 2, GBX.face / 2, 6);
        return geom;
      };
      return {...p, gIn: g(p.rIn, p.nIn), gOut: g(p.rOut, p.nOut)};
    });
    return {
      caseG: extrude(shapeOf(outline, [main]), GBX.back, z),
      backG: extrude(shapeOf(outline), GBX.back - 0.015, GBX.back),
      bellG: extrude(shapeOf(bellOut), GBX.back, GBX.bellCut),
      bellBack: extrude(shapeOf(rect(GBX.front, V8.rear, cY - 0.17, cY + 0.17)), GBX.back - 0.015, GBX.back),
      ink: [
        ...[outline, main].map((p) => toV3(dense(p), z + 0.002)),
        toV3(dense(bellOut), GBX.bellCut + 0.002),
      ],
      pairs,
      converter: new THREE.CylinderGeometry(GBX.converter.r, GBX.converter.r, GBX.converter.len, 40),
      lug: new THREE.CylinderGeometry(0.011, 0.011, 0.012, 10),
      inShaft: new THREE.CylinderGeometry(0.02, 0.02, GBX.converter.x - GBX.rear, 14),
      outShaft: new THREE.CylinderGeometry(0.022, 0.022, GBX.front - RWD.flange, 14),
      hub: new THREE.CylinderGeometry(0.028, 0.028, GBX.face + 0.01, 14),
    };
  }, []);

  const cY = GBX.inputY;
  const yOut = cY + GBX.D;
  const cv = GBX.converter;
  return (
    <group>
      {/* the case, cut in front of the shafts (its cut face hatched and inked), and its far wall */}
      <mesh geometry={geo.caseG} material={[mats.cut, mats.alu]} castShadow receiveShadow />
      <mesh geometry={geo.backG} material={mats.back} receiveShadow />
      <mesh geometry={geo.bellG} material={[mats.cut, mats.alu]} castShadow receiveShadow />
      <mesh geometry={geo.bellBack} material={mats.back} receiveShadow />
      {geo.ink.map((p, i) => (
        <InkLine key={i} points={p} thickness={INK * inkScale} />
      ))}
      {/* the torque converter on the crank, its lugs turning */}
      <group position={[cv.x, cY, 0]} rotation={[input, 0, 0]}>
        <mesh geometry={geo.converter} material={mats.converter} rotation={[0, 0, Math.PI / 2]} castShadow />
        {[...Array(6).keys()].map((k) => {
          const a = (k / 6) * Math.PI * 2;
          return (
            <mesh
              key={k}
              geometry={geo.lug}
              material={mats.bolt}
              position={[-cv.len / 2 - 0.005, 0.085 * Math.cos(a), 0.085 * Math.sin(a)]}
              rotation={[0, 0, Math.PI / 2]}
            />
          );
        })}
      </group>
      {/* the input shaft (on the crank's axis) and the output shaft above it */}
      <mesh
        geometry={geo.inShaft}
        material={mats.steel}
        position={[(cv.x + GBX.rear) / 2, cY, 0]}
        rotation={[0, 0, Math.PI / 2]}
      />
      <mesh
        geometry={geo.outShaft}
        material={mats.steel}
        position={[(GBX.front + RWD.flange) / 2, yOut, 0]}
        rotation={[0, 0, Math.PI / 2]}
      />
      {/* the 8 pairs: input gears fixed to their shaft, output gears meshed with them; the active pair lit */}
      {geo.pairs.map((p, k) => {
        const outA = -input * (p.nIn / p.nOut) + Math.PI / p.nOut;
        return (
          <group key={k}>
            <group position={[p.x, cY, 0]} rotation={[input, 0, 0]}>
              <mesh geometry={p.gIn} material={mats.pairs[k]} rotation={[0, Math.PI / 2, 0]} castShadow />
              <mesh geometry={geo.hub} material={mats.steel} rotation={[0, 0, Math.PI / 2]} />
            </group>
            <group position={[p.x, yOut, 0]} rotation={[outA, 0, 0]}>
              <mesh geometry={p.gOut} material={mats.pairs[k]} rotation={[0, Math.PI / 2, 0]} castShadow />
              <mesh geometry={geo.hub} material={mats.steel} rotation={[0, 0, Math.PI / 2]} />
            </group>
          </group>
        );
      })}
    </group>
  );
};

export type RearDriveProps = {
  mood: Mood;
  /** The near rear wheel's turn (rad, about the car's z axis): the half-shaft and ring gear follow it, the driveshaft × `RWD.final`. */
  axle?: number;
  inkScale?: number;
};

/** The driveshaft, the rear diff (housing cut, ring gear, pinion) and the near rear half-shaft (see `RWD`). */
export const RearDrive: React.FC<RearDriveProps> = ({mood, axle = 0, inkScale = 1}) => {
  const {env, envScale, albedo} = usePhys();
  const mats = useMemo(
    () => ({
      cut: cutMaterial(),
      housing: phys(REAL.lamination, {metalness: 0.45, roughness: 0.5}),
      tube: phys(REAL.steel, {metalness: 0.85, roughness: 0.35}),
      gear: phys(REAL.steel, {metalness: 0.85, roughness: 0.32}),
      dark: phys(REAL.labDark, {metalness: 0.4, roughness: 0.55}),
      boot: phys(REAL.rubber, {roughness: 0.75}),
    }),
    [],
  );
  applyEnv(
    env,
    [
      [mats.housing, 0.6],
      [mats.tube, 1],
      [mats.gear, 0.9],
    ],
    envScale,
  );
  applyAlbedo(
    Object.values(mats).filter((m) => m !== mats.cut),
    albedo,
  );
  void mood;
  const yOut = GBX.inputY + GBX.D;
  const A = new THREE.Vector3(RWD.flange, yOut, 0);
  const B = new THREE.Vector3(RWD.pinionX, RWD.axleY, RWD.pinionZ);
  const dir = B.clone().sub(A);
  const L = dir.length();
  const q = useMemo(
    () => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const ds = axle * RWD.final;

  const geo = useMemo(() => {
    const c: P2 = [RWD.axleX, RWD.axleY];
    const a0 = Math.asin(0.06 / 0.15);
    const outer: P2[] = [...circlePts(c, 0.15, 40, a0, Math.PI * 2 - a0), [-1.18, c[1] - 0.06], [-1.18, c[1] + 0.06]];
    const a1 = Math.asin(0.045 / 0.132);
    const inner: P2[] = [
      ...circlePts(c, 0.132, 40, a1, Math.PI * 2 - a1),
      [-1.192, c[1] - 0.045],
      [-1.192, c[1] + 0.045],
    ];
    const z = RWD.diffCut;
    return {
      housing: extrude(shapeOf(outer, [inner]), -0.12, z),
      back: extrude(shapeOf(outer), -0.135, -0.12),
      ink: [outer, inner].map((p) => toV3(dense(p), z + 0.002)),
      ring: extrude(shapeOf(gearPts(RWD.ringR, 40, 0.009)), -0.04, -0.008, 8),
      carrier: new THREE.CylinderGeometry(0.06, 0.06, 0.07, 24),
      pinion: extrude(shapeOf(gearPts(0.032, 11, 0.008)), -0.025, 0.025, 6),
      pinionShaft: new THREE.CylinderGeometry(0.018, 0.018, 0.1, 12),
      flange: new THREE.CylinderGeometry(0.048, 0.048, 0.012, 24),
      bolt: new THREE.CylinderGeometry(0.007, 0.007, 0.018, 8),
      tube: new THREE.CylinderGeometry(0.035, 0.035, L - 0.1, 20),
      yoke: new THREE.BoxGeometry(0.012, 0.05, 0.05),
      cross: new THREE.CylinderGeometry(0.009, 0.009, 0.07, 8),
      half: new THREE.CylinderGeometry(0.02, 0.02, RWD.hub - 0.11, 14),
      boot: new THREE.CylinderGeometry(0.026, 0.05, 0.1, 18, 4),
      hubFlange: new THREE.CylinderGeometry(0.056, 0.056, 0.016, 28),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // a flange with four bolts, spinning with the shaft (local y along the shaft)
  const flange = (y: number, k: string) => (
    <group key={k} position={[0, y, 0]}>
      <mesh geometry={geo.flange} material={mats.tube} />
      {[0, 1, 2, 3].map((b) => (
        <mesh
          key={b}
          geometry={geo.bolt}
          material={mats.dark}
          position={[0.034 * Math.cos((b * Math.PI) / 2), 0, 0.034 * Math.sin((b * Math.PI) / 2)]}
        />
      ))}
    </group>
  );
  // a U-joint: two yokes and the cross between them
  const ujoint = (y: number, k: string) => (
    <group key={k} position={[0, y, 0]}>
      {[-1, 1].map((sg) => (
        <mesh key={sg} geometry={geo.yoke} material={mats.tube} position={[sg * 0.03, 0, 0]} />
      ))}
      <mesh geometry={geo.cross} material={mats.dark} rotation={[0, 0, Math.PI / 2]} />
      <mesh geometry={geo.cross} material={mats.dark} rotation={[Math.PI / 2, 0, 0]} />
    </group>
  );
  const hubZ = RWD.hub;
  return (
    <group>
      {/* the driveshaft: flanges, U-joints, the tube with a balance weight, turning × the diff's ratio */}
      <group position={[A.x, A.y, A.z]} quaternion={q}>
        <group rotation={[0, ds, 0]}>
          {flange(0.006, 'fa')}
          {ujoint(0.05, 'ua')}
          <mesh geometry={geo.tube} material={mats.tube} position={[0, L / 2, 0]} castShadow />
          <mesh position={[0.036, L * 0.3, 0]} material={mats.dark}>
            <boxGeometry args={[0.006, 0.04, 0.03]} />
          </mesh>
          {ujoint(L - 0.05, 'ub')}
          {flange(L - 0.006, 'fb')}
        </group>
      </group>
      {/* the diff: the housing cut (hatched, inked), its far wall, the ring gear and carrier, the pinion */}
      <mesh geometry={geo.housing} material={[mats.cut, mats.housing]} castShadow receiveShadow />
      <mesh geometry={geo.back} material={mats.housing} receiveShadow />
      {geo.ink.map((p, i) => (
        <InkLine key={i} points={p} thickness={INK * inkScale} />
      ))}
      <group position={[RWD.axleX, RWD.axleY, 0]} rotation={[0, 0, axle]}>
        <mesh geometry={geo.ring} material={mats.gear} castShadow />
        <mesh geometry={geo.carrier} material={mats.housing} position={[0, 0, -0.06]} rotation={[Math.PI / 2, 0, 0]} />
        {[0, 1, 2, 3, 4, 5].map((b) => (
          <mesh
            key={b}
            geometry={geo.bolt}
            material={mats.dark}
            position={[0.075 * Math.cos((b * Math.PI) / 3), 0.075 * Math.sin((b * Math.PI) / 3), -0.004]}
            rotation={[Math.PI / 2, 0, 0]}
          />
        ))}
      </group>
      <group position={[RWD.axleX + RWD.ringR + 0.012, RWD.axleY, RWD.pinionZ]} rotation={[ds, 0, 0]}>
        <mesh geometry={geo.pinion} material={mats.gear} rotation={[0, Math.PI / 2, 0]} castShadow />
        <mesh geometry={geo.pinionShaft} material={mats.tube} position={[0.06, 0, 0]} rotation={[0, 0, Math.PI / 2]} />
      </group>
      {/* the near rear half-shaft: CV boots at both ends, the hub flange (its bolts show the turn) */}
      <group position={[RWD.axleX, RWD.axleY, 0]} rotation={[0, 0, axle]}>
        <mesh
          geometry={geo.half}
          material={mats.tube}
          position={[0, 0, (0.08 + hubZ) / 2]}
          rotation={[Math.PI / 2, 0, 0]}
          castShadow
        />
        <mesh geometry={geo.boot} material={mats.boot} position={[0, 0, 0.15]} rotation={[Math.PI / 2, 0, 0]} castShadow />
        <mesh geometry={geo.boot} material={mats.boot} position={[0, 0, hubZ - 0.09]} rotation={[-Math.PI / 2, 0, 0]} castShadow />
        <mesh geometry={geo.hubFlange} material={mats.housing} position={[0, 0, hubZ]} rotation={[Math.PI / 2, 0, 0]} castShadow />
        {[0, 1, 2, 3, 4].map((b) => (
          <mesh
            key={b}
            geometry={geo.bolt}
            material={mats.dark}
            position={[0.038 * Math.cos((b * 2 * Math.PI) / 5), 0.038 * Math.sin((b * 2 * Math.PI) / 5), hubZ + 0.008]}
            rotation={[Math.PI / 2, 0, 0]}
          />
        ))}
      </group>
    </group>
  );
};
