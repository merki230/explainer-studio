import React, {useMemo} from 'react';
import * as THREE from 'three';
import {REAL, section, type Mood} from '../../theme';
import {raw, roundedBox} from '../plaster';
import {cutMaterial, INK, InkLine} from '../section/cutLook';
import {applyAlbedo, applyEnv, useAlbedo, useEnvStrength, useStudioEnv} from './useStudioEnv';

type V3 = [number, number, number];
type P2 = [number, number];

/*
 * An electric car's front drive unit, battery pack and pedal box (No. 006), in the car's own frame
 * (`RealCar`: x forward, y up, the near cut at z = 0.8; metres). Generic, no maker. Both the drive
 * unit and the pack are object cut-aways (style guide § 3): their casings are cut on a plane facing
 * the camera (hatched, inked); inside, the parts are realistic (laminated steel, copper, magnets,
 * cells), shown at the cut as on a sectioned display model. Nothing here is orange unless the scene
 * lights it (the regen path: windings, module levels).
 *
 *  - Drive unit: the motor (stator with 24 copper-filled slots, a rotor with 8 V-pairs of magnets)
 *    cut at z = EV.motorZ; behind it, the reduction gears (the final gear on the axle, an
 *    intermediate) in their own case cut at z = EV.gearZ (a stepped section); the inverter on top;
 *    the three phase cables; the HV cable down the firewall to the pack; the near half-shaft with
 *    its CV boots out to the wheel's axle stub.
 *  - Battery pack: under the floor between the axles, cut lengthwise at z = EV.packZ: the casing
 *    (lid, tray, end walls; hatched), a cooling plate, six modules of cylindrical cells, a level in
 *    each module (`fill`, orange: the system).
 *  - Pedal box: a hanging brake pedal and a floor-hinged accelerator in front of the driver's
 *    pedal foot; `accel` presses the accelerator (0 up → 1 floored).
 */

export const EV = {
  /** The motor: its centre (x, y), stator outer and inner radius, rotor radius; its section plane. */
  motor: [1.2, 0.66] as P2,
  statorR: 0.145,
  boreR: 0.094,
  rotorR: 0.087,
  caseR: 0.17,
  motorZ: 0.3,
  /** The reduction gears' section plane, the final gear (on the axle) and the intermediate. */
  gearZ: 0.2,
  final: {c: [1.35, 0.36] as P2, r: 0.12, teeth: 36},
  inter: {c: [1.257, 0.546] as P2, r: 0.088, teeth: 26},
  /** The inverter box (x0, x1, y0, y1, z0, z1). */
  inverter: [1.04, 1.37, 0.86, 0.96, -0.24, 0.27] as [number, number, number, number, number, number],
  /** The battery pack (x0, x1, y0, y1) and its section plane; the module count. */
  pack: [-0.86, 0.84, 0.12, 0.33] as [number, number, number, number],
  packZ: 0.62,
  packBack: -0.72,
  modules: 6,
  /** The HV cable's run: inverter → down the firewall → into the pack's front wall. */
  hv: [
    [1.06, 0.9, 0.24],
    [1.02, 0.86, 0.24],
    [1.0, 0.36, 0.24],
    [0.95, 0.28, 0.3],
    [0.84, 0.27, 0.45],
  ] as V3[],
  /** The driver's pedal foot's plane (z), the accelerator's hinge and the brake pedal. */
  pedalZ: 0.25,
  accelHinge: [0.7, 0.37] as P2,
  brake: [0.86, 0.62] as P2,
  brakeZ: 0.42,
  /** The firewall is sectioned on its own plane (a step in the car's cut), so the bay shows past it. */
  firewallZ: 0.4,
};

/** A module's box (x0, x1) along the pack, front (k = 0) to back. */
export const moduleSpan = (k: number): [number, number] => {
  const [x0, x1] = EV.pack;
  const w = (x1 - x0 - 0.06) / EV.modules;
  const hi = x1 - 0.03 - k * w;
  return [hi - w + 0.012, hi - 0.012];
};
/** Module levels' vertical span (y0, y1) inside a module. */
export const MODULE_Y: [number, number] = [0.165, 0.305];

const circlePts = (c: P2, r: number, n = 64, a0 = 0): P2[] =>
  [...Array(n).keys()].map((i) => {
    const a = a0 + (i / n) * Math.PI * 2;
    return [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)];
  });

const shapeOf = (pts: P2[], holes: P2[][] = []) => {
  const s = new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(x, y)));
  for (const h of holes) s.holes.push(new THREE.Path(h.map(([x, y]) => new THREE.Vector2(x, y))));
  return s;
};
/** Extrude a shape in the (x, y) plane from z0 back to z1 > z0 (front cap at z1). */
const extrude = (shape: THREE.Shape, z0: number, z1: number, curveSegments = 24) => {
  const g = new THREE.ExtrudeGeometry(shape, {depth: z1 - z0, bevelEnabled: false, curveSegments});
  g.translate(0, 0, z0);
  return g;
};

/** A spur gear's outline (teeth as trapezoids), centred on the origin. */
const gearPts = (r: number, teeth: number, depth: number): P2[] => {
  const out: P2[] = [];
  for (let i = 0; i < teeth; i++) {
    const a = (i / teeth) * Math.PI * 2;
    const p = (Math.PI * 2) / teeth;
    for (const [f, rr] of [
      [0, r - depth],
      [0.2, r - depth],
      [0.32, r],
      [0.68, r],
      [0.8, r - depth],
    ] as [number, number][])
      out.push([rr * Math.cos(a + f * p), rr * Math.sin(a + f * p)]);
  }
  return out;
};

/** Convex hull (monotone chain) of points. */
const hull = (pts: P2[]): P2[] => {
  const p = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o: P2, a: P2, b: P2) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo: P2[] = [];
  for (const q of p) {
    while (lo.length >= 2 && cross(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop();
    lo.push(q);
  }
  const up: P2[] = [];
  for (const q of [...p].reverse()) {
    while (up.length >= 2 && cross(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop();
    up.push(q);
  }
  return [...lo.slice(0, -1), ...up.slice(0, -1)];
};

const usePhys = () => {
  const env = useStudioEnv();
  const envScale = useEnvStrength();
  const albedo = useAlbedo();
  return {env, envScale, albedo};
};

const phys = (c: string, o: THREE.MeshPhysicalMaterialParameters = {}) =>
  new THREE.MeshPhysicalMaterial({color: raw(c), ...o});

const glowMat = () =>
  new THREE.MeshBasicMaterial({color: raw(section.orange), transparent: true, depthWrite: false, opacity: 0});

export type DriveUnitProps = {
  mood: Mood;
  /** The near front wheel's turn (radians, in this frame): the final gear turns with it. */
  wheelSpin: number;
  /** The rotor's turn (radians) and its turn while the shutter is open (motion blur). */
  rotorSpin: number;
  rotorBlur?: number;
  /** Per-slot glow 0–1 (24 slots, counter-clockwise from +x): the windings lit by the regen. */
  slots?: number[];
  /** × the ink lines' thickness (close framings thin them). */
  inkScale?: number;
  /** The inverter's control board on its near end (No. 008: the computer the pedal talks to). Default false. */
  board?: boolean;
};

/** The inverter's control board (No. 008) on the inverter's near end face (x0, x1, y0, y1). */
export const EV_BOARD: [number, number, number, number] = [1.14, 1.32, 0.868, 0.952];

/** The front drive unit cut open (see the file comment). */
export const DriveUnit: React.FC<DriveUnitProps> = ({
  mood,
  wheelSpin,
  rotorSpin,
  rotorBlur = 0,
  slots,
  inkScale = 1,
  board = false,
}) => {
  const {env, envScale, albedo} = usePhys();
  const mats = useMemo(
    () => ({
      cut: cutMaterial(),
      housing: phys(REAL.housing, {metalness: 0.55, roughness: 0.5}),
      lam: phys(REAL.lamination, {metalness: 0.35, roughness: 0.42}),
      copper: phys(REAL.copper, {metalness: 0.5, roughness: 0.38}),
      magnet: phys(REAL.magnet, {metalness: 0.3, roughness: 0.4, clearcoat: 0.4}),
      steel: phys(REAL.steel, {metalness: 0.9, roughness: 0.3}),
      gear: phys(REAL.steel, {metalness: 0.85, roughness: 0.35}),
      dark: phys(REAL.labDark, {roughness: 0.6}),
      cable: phys(REAL.cable, {roughness: 0.55}),
      boot: phys(REAL.rubber, {roughness: 0.7}),
      ghost: phys(REAL.magnet, {metalness: 0.3, roughness: 0.4, transparent: true, opacity: 0.3, depthWrite: false}),
      pcb: phys(REAL.pcb, {roughness: 0.38, clearcoat: 0.5}),
      chip: phys(REAL.chip, {roughness: 0.4}),
      connector: phys(REAL.receiver, {roughness: 0.55}),
      glow: [...Array(24).keys()].map(() => glowMat()),
    }),
    [],
  );
  applyEnv(
    env,
    [
      [mats.housing, 0.6],
      [mats.lam, 0.7],
      [mats.copper, 0.8],
      [mats.magnet, 0.4],
      [mats.steel, 1],
      [mats.gear, 0.9],
    ],
    envScale,
  );
  applyAlbedo([mats.housing, mats.lam, mats.copper, mats.magnet, mats.steel, mats.gear, mats.dark], albedo);
  void mood;

  const geo = useMemo(() => {
    const [mx, my] = EV.motor;
    const z = EV.motorZ;
    // the motor's casing: an annulus round the stator, cut at the section plane
    const caseG = extrude(shapeOf(circlePts(EV.motor, EV.caseR), [circlePts(EV.motor, EV.statorR + 0.002)]), -0.24, z);
    // the stator: laminated ring with 24 slots open to the bore
    const N = 24;
    const inner: P2[] = [];
    const slotR = EV.statorR - 0.027;
    for (let i = 0; i < N; i++) {
      const p = (Math.PI * 2) / N;
      const a = i * p;
      for (const [f, r] of [
        [0.0, EV.boreR],
        [0.28, EV.boreR],
        [0.3, EV.boreR + 0.006],
        [0.33, slotR],
        [0.67, slotR],
        [0.7, EV.boreR + 0.006],
        [0.72, EV.boreR],
      ] as [number, number][])
        inner.push([mx + r * Math.cos(a + f * p), my + r * Math.sin(a + f * p)]);
    }
    const stator = extrude(shapeOf(circlePts(EV.motor, EV.statorR, 96), [inner]), -0.2, z - 0.001);
    // the copper in each slot (a little inside the slot walls)
    const slotGeos = [...Array(N).keys()].map((i) => {
      const p = (Math.PI * 2) / N;
      const a = i * p;
      const pts: P2[] = [];
      for (let k = 0; k <= 6; k++) {
        const f = 0.345 + (0.31 * k) / 6;
        pts.push([mx + (slotR - 0.003) * Math.cos(a + f * p), my + (slotR - 0.003) * Math.sin(a + f * p)]);
      }
      for (let k = 6; k >= 0; k--) {
        const f = 0.345 + (0.31 * k) / 6;
        pts.push([mx + (EV.boreR + 0.009) * Math.cos(a + f * p), my + (EV.boreR + 0.009) * Math.sin(a + f * p)]);
      }
      return extrude(shapeOf(pts), -0.2, z);
    });
    // the gear case behind the motor: a hull round the two gears, cut at its own plane
    const caseOut = hull([
      ...circlePts(EV.final.c, EV.final.r + 0.05, 32),
      ...circlePts(EV.inter.c, EV.inter.r + 0.05, 32),
    ]);
    const caseIn = hull([
      ...circlePts(EV.final.c, EV.final.r + 0.022, 32),
      ...circlePts(EV.inter.c, EV.inter.r + 0.022, 32),
    ]);
    const gearCase = extrude(shapeOf(caseOut, [caseIn.slice().reverse()]), -0.15, EV.gearZ);
    return {
      caseG,
      stator,
      slotGeos,
      gearCase,
      caseInk: [circlePts(EV.motor, EV.caseR, 96), circlePts(EV.motor, EV.statorR + 0.002, 96)].map((c) =>
        c.map(([x, y]) => [x, y, z + 0.002] as V3),
      ),
      gearInk: [caseOut, caseIn].map((c) => c.map(([x, y]) => [x, y, EV.gearZ + 0.002] as V3)),
      rotor: (() => {
        // the rotor's laminations with 8 V-pairs of magnet pockets, centred on the origin
        const s = shapeOf(circlePts([0, 0], EV.rotorR, 96), [circlePts([0, 0], 0.024, 32)]);
        return extrude(s, -0.2, z - 0.002);
      })(),
      magnet: new THREE.BoxGeometry(0.03, 0.009, 0.01),
      shaft: extrude(shapeOf(circlePts([0, 0], 0.024, 32)), -0.2, z),
      final: extrude(
        shapeOf(gearPts(EV.final.r, EV.final.teeth, 0.012), [circlePts([0, 0], 0.03, 24)]),
        EV.gearZ - 0.05,
        EV.gearZ - 0.006,
      ),
      inter: extrude(
        shapeOf(gearPts(EV.inter.r, EV.inter.teeth, 0.011), [circlePts([0, 0], 0.022, 24)]),
        EV.gearZ - 0.05,
        EV.gearZ - 0.006,
      ),
      hub: extrude(shapeOf(circlePts([0, 0], 0.03, 24)), EV.gearZ - 0.06, EV.gearZ - 0.004),
      hv: new THREE.TubeGeometry(new THREE.CatmullRomCurve3(EV.hv.map((p) => new THREE.Vector3(...p))), 48, 0.016, 8),
      phase: [-1, 0, 1].map(
        (k) =>
          new THREE.TubeGeometry(
            new THREE.CatmullRomCurve3(
              [
                [1.26 + 0.028 * k, EV.inverter[2] + 0.005, EV.motorZ - 0.03],
                [1.265 + 0.03 * k, 0.835, EV.motorZ - 0.025],
                [1.255 + 0.022 * k, 0.8, EV.motorZ - 0.04],
              ].map((p) => new THREE.Vector3(...(p as V3))),
            ),
            16,
            0.011,
            8,
          ),
      ),
      // the near half-shaft: from the final gear's output out to the wheel's axle stub (z ≈ 0.69)
      shaft2: new THREE.CylinderGeometry(0.02, 0.02, 0.36, 16),
      bootIn: new THREE.CylinderGeometry(0.042, 0.03, 0.09, 20),
      bootOut: new THREE.CylinderGeometry(0.028, 0.044, 0.09, 20),
    };
  }, []);

  const [mx, my] = EV.motor;
  const [ix0, ix1, iy0, iy1, iz0, iz1] = EV.inverter;
  const ink = INK * inkScale;
  // the intermediate gear turns the other way, by the ratio of the radii
  const interSpin = -wheelSpin * (EV.final.r / EV.inter.r);
  const blur = Math.abs(rotorBlur);
  const ghostK = Math.min(1, blur / 0.35);
  slots?.forEach((v, i) => {
    mats.glow[i].opacity = Math.max(0, Math.min(1, v));
  });
  const fz = (EV.gearZ + 0.69) / 2;

  return (
    <group>
      {/* the motor casing, cut (hatched cap) */}
      <mesh geometry={geo.caseG} material={[mats.cut, mats.housing]} castShadow receiveShadow />
      {geo.caseInk.map((c, i) => (
        <InkLine key={i} points={c} thickness={ink} />
      ))}
      {/* the stator: laminations and the copper in its slots, lit slot by slot */}
      <mesh geometry={geo.stator} material={[mats.lam, mats.lam]} receiveShadow />
      {geo.slotGeos.map((g, i) => (
        <group key={i}>
          <mesh geometry={g} material={mats.copper} />
          <mesh
            geometry={g}
            material={mats.glow[i]}
            position={[0, 0, 0.0015]}
            visible={(slots?.[i] ?? 0) > 0.01}
            userData={{glow: true}}
            renderOrder={3}
          />
        </group>
      ))}
      {/* the rotor turning: laminations, 8 V-pairs of magnets, the shaft */}
      <group position={[mx, my, 0]} rotation={[0, 0, rotorSpin]}>
        <mesh geometry={geo.rotor} material={[mats.lam, mats.lam]} receiveShadow />
        <mesh geometry={geo.shaft} material={mats.steel} />
        {[...Array(8).keys()].map((k) => {
          const a = (k / 8) * Math.PI * 2;
          return (
            <group key={k} rotation={[0, 0, a]}>
              {[-1, 1].map((s) => (
                <mesh
                  key={s}
                  geometry={geo.magnet}
                  material={mats.magnet}
                  position={[0.062, s * 0.017, EV.motorZ - 0.004]}
                  rotation={[0, 0, s * 0.55]}
                />
              ))}
            </group>
          );
        })}
      </group>
      {/* the rotor's motion blur: faint copies of the magnets across the shutter arc */}
      {ghostK > 0.02
        ? [-0.5, -0.25, 0.25, 0.5].map((f) => (
            <group key={f} position={[mx, my, 0.0008]} rotation={[0, 0, rotorSpin + f * rotorBlur]}>
              {[...Array(8).keys()].map((k) => (
                <group key={k} rotation={[0, 0, (k / 8) * Math.PI * 2]}>
                  {[-1, 1].map((s) => (
                    <mesh
                      key={s}
                      geometry={geo.magnet}
                      material={mats.ghost}
                      position={[0.062, s * 0.017, EV.motorZ - 0.004]}
                      rotation={[0, 0, s * 0.55]}
                    />
                  ))}
                </group>
              ))}
            </group>
          ))
        : null}

      {/* the gear case behind, cut at its own plane; the final gear on the axle, the intermediate */}
      <mesh geometry={geo.gearCase} material={[mats.cut, mats.housing]} castShadow receiveShadow />
      {geo.gearInk.map((c, i) => (
        <InkLine key={i} points={c} thickness={ink} />
      ))}
      <group position={[EV.final.c[0], EV.final.c[1], 0]} rotation={[0, 0, wheelSpin]}>
        <mesh geometry={geo.final} material={mats.gear} castShadow receiveShadow />
        <mesh geometry={geo.hub} material={mats.steel} />
      </group>
      <group position={[EV.inter.c[0], EV.inter.c[1], 0]} rotation={[0, 0, interSpin]}>
        <mesh geometry={geo.inter} material={mats.gear} castShadow receiveShadow />
        <mesh geometry={geo.hub} material={mats.steel} />
      </group>
      <mesh geometry={roundedBox(0.3, 0.14, 0.32, 0.02)} material={mats.housing} position={[1.33, 0.36, -0.02]} />

      {/* the near half-shaft and its CV boots, out to the wheel's axle stub */}
      <group position={[EV.final.c[0], EV.final.c[1], fz]} rotation={[Math.PI / 2, wheelSpin, 0]}>
        <mesh geometry={geo.shaft2} material={mats.steel} scale={[1, (0.69 - EV.gearZ) / 0.36, 1]} castShadow />
      </group>
      <mesh
        geometry={geo.bootIn}
        material={mats.boot}
        position={[EV.final.c[0], EV.final.c[1], EV.gearZ + 0.06]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
      />
      <mesh
        geometry={geo.bootOut}
        material={mats.boot}
        position={[EV.final.c[0], EV.final.c[1], 0.62]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
      />

      {/* the inverter on top (cast aluminium, a lid seam, cooling fins), the phase cables, the HV cable */}
      <mesh
        geometry={roundedBox(ix1 - ix0, iy1 - iy0, iz1 - iz0, 0.012)}
        material={mats.housing}
        position={[(ix0 + ix1) / 2, (iy0 + iy1) / 2, (iz0 + iz1) / 2]}
        castShadow
        receiveShadow
      />
      <mesh position={[(ix0 + ix1) / 2, iy1 - 0.025, iz1 + 0.0015]} material={mats.dark}>
        <boxGeometry args={[ix1 - ix0 - 0.02, 0.004, 0.002]} />
      </mesh>
      {[...Array(7).keys()].map((k) => (
        <mesh key={k} position={[ix0 + 0.04 + k * 0.042, iy0 - 0.008, (iz0 + iz1) / 2]} material={mats.housing}>
          <boxGeometry args={[0.008, 0.016, iz1 - iz0 - 0.06]} />
        </mesh>
      ))}
      {geo.phase.map((g, i) => (
        <mesh key={i} geometry={g} material={mats.cable} castShadow />
      ))}
      <mesh geometry={geo.hv} material={mats.cable} castShadow />
      {board ? (
        // the control board on the inverter's near end: a green board, its processor and a connector
        <group>
          <mesh
            position={[(EV_BOARD[0] + EV_BOARD[1]) / 2, (EV_BOARD[2] + EV_BOARD[3]) / 2, iz1 + 0.004]}
            material={mats.pcb}
            castShadow
          >
            <boxGeometry args={[EV_BOARD[1] - EV_BOARD[0], EV_BOARD[3] - EV_BOARD[2], 0.006]} />
          </mesh>
          <mesh position={[EV_BOARD[0] + 0.07, (EV_BOARD[2] + EV_BOARD[3]) / 2, iz1 + 0.01]} material={mats.chip}>
            <boxGeometry args={[0.04, 0.04, 0.006]} />
          </mesh>
          <mesh
            position={[EV_BOARD[1] - 0.035, (EV_BOARD[2] + EV_BOARD[3]) / 2, iz1 + 0.014]}
            material={mats.connector}
          >
            <boxGeometry args={[0.04, 0.05, 0.02]} />
          </mesh>
        </group>
      ) : null}
    </group>
  );
};

export type BatteryPackProps = {
  mood: Mood;
  /** Each module's charge level 0–1 (orange, the system), front (0) to back. Default none. */
  fill?: number[];
  /** The levels' glow (0 → 1): the loop fades them out. */
  glow?: number;
  inkScale?: number;
};

/** A canvas of cells cut lengthwise (one module's face): cylindrical cells, their caps, a bus bar. */
const cellTexture = (() => {
  let t: THREE.CanvasTexture | null = null;
  return () => {
    if (t) return t;
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 256;
    const cx = c.getContext('2d')!;
    cx.fillStyle = REAL.module;
    cx.fillRect(0, 0, 512, 256);
    const n = 12;
    const w = 512 / n;
    for (let i = 0; i < n; i++) {
      const x = i * w + 4;
      // the cell's sleeve, its steel can showing at the cut, the cap
      cx.fillStyle = REAL.cell;
      cx.fillRect(x, 34, w - 8, 196);
      cx.fillStyle = REAL.stemAlu;
      cx.fillRect(x + 4, 38, w - 16, 188);
      cx.fillStyle = REAL.cell;
      cx.fillRect(x + 8, 42, w - 24, 180);
      cx.fillStyle = REAL.chrome;
      cx.fillRect(x + (w - 8) / 2 - 7, 22, 14, 14);
    }
    // the bus bar along the top (nickel-plated copper: kept a neutral grey)
    cx.fillStyle = REAL.shield;
    cx.fillRect(0, 12, 512, 10);
    t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  };
})();

/** The battery pack cut open (see the file comment). */
export const BatteryPack: React.FC<BatteryPackProps> = ({mood, fill, glow = 1, inkScale = 1}) => {
  const {env, envScale, albedo} = usePhys();
  const mats = useMemo(
    () => ({
      cut: cutMaterial(),
      casing: phys(REAL.housing, {metalness: 0.5, roughness: 0.55}),
      plate: phys(REAL.alu, {metalness: 0.8, roughness: 0.35}),
      module: phys('#ffffff', {roughness: 0.6, map: cellTexture()}),
      moduleSide: phys(REAL.module, {roughness: 0.55}),
      dark: phys(REAL.labDark, {roughness: 0.7}),
      levels: [...Array(EV.modules).keys()].map(() => glowMat()),
    }),
    [],
  );
  applyEnv(
    env,
    [
      [mats.casing, 0.6],
      [mats.plate, 0.9],
    ],
    envScale,
  );
  applyAlbedo([mats.casing, mats.plate, mats.module, mats.moduleSide, mats.dark], albedo);
  void mood;
  const [x0, x1, y0, y1] = EV.pack;
  const z = EV.packZ;
  const zb = EV.packBack;
  const t = 0.014;
  const ink = INK * inkScale;
  // the casing's section: tray (floor), lid, the two end walls
  const parts: [number, number, number, number][] = [
    [x0, x1, y0, y0 + t],
    [x0, x1, y1 - t, y1],
    [x0, x0 + t, y0, y1],
    [x1 - t, x1, y0, y1],
  ];
  return (
    <group>
      {parts.map(([a, b, c, d], i) => (
        <mesh
          key={i}
          position={[(a + b) / 2, (c + d) / 2, (z + zb) / 2]}
          material={[mats.casing, mats.casing, mats.casing, mats.casing, mats.cut, mats.casing]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[b - a, d - c, z - zb]} />
        </mesh>
      ))}
      <InkLine
        points={[
          [x0, y0, z + 0.002],
          [x1, y0, z + 0.002],
          [x1, y1, z + 0.002],
          [x0, y1, z + 0.002],
        ]}
        thickness={ink}
      />
      <InkLine
        points={[
          [x0 + t, y0 + t, z + 0.002],
          [x1 - t, y0 + t, z + 0.002],
          [x1 - t, y1 - t, z + 0.002],
          [x0 + t, y1 - t, z + 0.002],
        ]}
        thickness={ink}
      />
      {/* the inside's back (dark), the cooling plate under the modules */}
      <mesh position={[(x0 + x1) / 2, (y0 + y1) / 2, zb + 0.01]} material={mats.dark}>
        <planeGeometry args={[x1 - x0, y1 - y0]} />
      </mesh>
      <mesh position={[(x0 + x1) / 2, y0 + t + 0.009, (z + zb) / 2]} material={mats.plate} receiveShadow>
        <boxGeometry args={[x1 - x0 - 2 * t, 0.018, z - zb - 0.03]} />
      </mesh>
      {[...Array(EV.modules).keys()].map((k) => {
        const [a, b] = moduleSpan(k);
        const lv = Math.max(0, Math.min(1, fill?.[k] ?? 0));
        mats.levels[k].opacity = 0.75 * Math.max(0, Math.min(1, glow));
        const h = (MODULE_Y[1] - MODULE_Y[0]) * lv;
        return (
          <group key={k}>
            <mesh
              position={[(a + b) / 2, (MODULE_Y[0] + MODULE_Y[1]) / 2, (z - 0.01 + zb + 0.03) / 2]}
              material={[
                mats.moduleSide,
                mats.moduleSide,
                mats.moduleSide,
                mats.moduleSide,
                mats.module,
                mats.moduleSide,
              ]}
              castShadow
              receiveShadow
            >
              <boxGeometry args={[b - a, MODULE_Y[1] - MODULE_Y[0], z - 0.01 - zb - 0.03]} />
            </mesh>
            {/* the level: a band of orange rising from the module's floor */}
            <mesh
              position={[(a + b) / 2, MODULE_Y[0] + h / 2, z - 0.006]}
              material={mats.levels[k]}
              visible={lv > 0.005 && glow > 0.01}
              userData={{glow: true}}
              renderOrder={3}
            >
              <planeGeometry args={[b - a - 0.012, Math.max(1e-4, h)]} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

export type PedalBoxProps = {
  mood: Mood;
  /** How far the accelerator is pressed, 0 (up) → 1 (floored). */
  accel?: number;
  /** A sealed position sensor at the accelerator's hinge (No. 008). Default false. */
  sensor?: boolean;
};

/** The accelerator's pad angle from the floor (radians, its top forward) for a press (0 → 1). */
export const accelAngle = (press: number) => 0.9 - 0.45 * Math.max(0, Math.min(1, press));
/** The accelerator pad's length along its face. */
export const ACCEL_LEN = 0.27;

/** The pedal box (see the file comment): a floor-hinged accelerator and a hanging brake pedal. */
export const PedalBox: React.FC<PedalBoxProps> = ({mood, accel = 0, sensor = false}) => {
  const {env, envScale, albedo} = usePhys();
  const mats = useMemo(
    () => ({
      // brushed aluminium pads with rubber strips, so the pedals read against a dark shoe
      pad: phys(REAL.alu, {metalness: 0.7, roughness: 0.38}),
      arm: phys(REAL.steel, {metalness: 0.8, roughness: 0.4}),
      ribs: phys(REAL.pedal, {roughness: 0.8}),
      sensor: phys(REAL.receiver, {roughness: 0.5}),
    }),
    [],
  );
  applyEnv(
    env,
    [
      [mats.arm, 0.8],
      [mats.pad, 0.8],
    ],
    envScale,
  );
  applyAlbedo([mats.pad, mats.arm, mats.ribs, mats.sensor], albedo);
  void mood;
  const ang = accelAngle(accel);
  const [hx, hy] = EV.accelHinge;
  const [bx, by] = EV.brake;
  return (
    <group>
      {/* the accelerator: a narrow, tall pad hinged at the floor, its top leaning forward (set back from the
          brake, so the two read side by side from the camera) */}
      <group position={[hx, hy, EV.pedalZ]} rotation={[0, 0, ang]}>
        <mesh
          geometry={roundedBox(ACCEL_LEN, 0.022, 0.085, 0.008)}
          material={mats.pad}
          position={[ACCEL_LEN / 2, 0.011, 0]}
          castShadow
        />
        {[...Array(7).keys()].map((k) => (
          <mesh key={k} position={[0.03 + k * 0.034, 0.023, 0]} material={mats.ribs}>
            <boxGeometry args={[0.008, 0.004, 0.07]} />
          </mesh>
        ))}
      </group>
      <mesh position={[hx - 0.01, hy - 0.012, EV.pedalZ]} material={mats.arm}>
        <boxGeometry args={[0.05, 0.024, 0.07]} />
      </mesh>
      {sensor ? (
        <mesh
          geometry={roundedBox(0.06, 0.05, 0.03, 0.01)}
          material={mats.sensor}
          position={[hx - 0.01, hy + 0.005, EV.pedalZ + 0.05]}
          castShadow
        />
      ) : null}
      {/* the brake pedal hanging from under the dash: its arm and a wide, short pad facing the driver */}
      <mesh
        position={[(bx + 0.92) / 2 + 0.01, (by + 0.94) / 2, EV.brakeZ]}
        rotation={[0, 0, 0.18]}
        material={mats.arm}
        castShadow
      >
        <boxGeometry args={[0.022, 0.34, 0.024]} />
      </mesh>
      <mesh
        geometry={roundedBox(0.03, 0.09, 0.2, 0.014)}
        material={mats.pad}
        position={[bx, by, EV.brakeZ]}
        rotation={[0, 0, -0.25]}
        castShadow
      />
      {[-1, 0, 1].map((k) => (
        <mesh key={k} position={[bx - 0.017, by + k * 0.024, EV.brakeZ]} rotation={[0, 0, -0.25]} material={mats.ribs}>
          <boxGeometry args={[0.004, 0.008, 0.17]} />
        </mesh>
      ))}
    </group>
  );
};

/**
 * Where the driver's pedal foot goes (car frame): its ankle (x, y) and pitch (toes up), for 'floor'
 * (flat on the floor, pulled back clear of both pedals) or 'accel' (the sole on the accelerator's
 * pad at a press of 0 → 1). The foot box is the cast's (0.26 long, its sole 0.1 under the ankle, the
 * heel 0.05 behind it).
 */
export const footPose = (
  pose: 'floor' | 'accel',
  press = 0,
  floorY = 0.34,
  /** The foot's scale (Figure `footScale`): the sole and heel offsets from the ankle grow with it. */
  k = 1,
): {x: number; y: number; pitch: number} => {
  // flat on the floor, back from the pedals (the toe 2 cm short of the accelerator's hinge)
  if (pose === 'floor') return {x: 0.68 - 0.21 * k, y: floorY + 0.1 * k, pitch: 0};
  const a = accelAngle(press);
  // the heel on the floor just in front of the pedal, the sole flush with the pad's top face (ball up on it)
  const [hx, hy] = EV.accelHinge;
  const top = hy + 0.022 + 0.004;
  const heel = [hx - (top - floorY) / Math.tan(a), floorY];
  // the heel's offset from the ankle at this pitch (sole 0.1 below, heel 0.05 behind, × k)
  const hy0 = k * (-0.1 * Math.cos(a) - 0.05 * Math.sin(a));
  const hz0 = k * (0.1 * Math.sin(a) - 0.05 * Math.cos(a));
  return {x: heel[0] - hz0, y: heel[1] - hy0, pitch: a};
};
