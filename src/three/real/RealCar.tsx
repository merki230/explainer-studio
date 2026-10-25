import React, {useMemo} from 'react';
import * as THREE from 'three';
import {fonts} from '../../fonts';
import {CAR, HIGHWAY, MOODS, REAL, section, STREET, type Mood} from '../../theme';
import {BlobShadow} from '../MuseumStage';
import {raw, roundedBox} from '../plaster';
import {CutOutline, cutMaterial, InkLine} from '../section/cutLook';
import {drawCluster, drawEvCluster} from '../../components/dashboardKit';
import {useFontsLoaded} from '../section/useFontsLoaded';
import {CarShell, shellSink} from './CarShell';
import {applyAlbedo, applyEnv, useAlbedo, useEnvStrength, useStudioEnv} from './useStudioEnv';

type V3 = [number, number, number];
type P2 = [number, number];

/*
 * A generic car (No. 002), cut open in the Section's grammar: the near side removed along the near
 * wheels' mid-plane (z = CUT_Z) and the roof removed above the windows, like a room's near wall and
 * ceiling. A crossover, ≈ 4.8 long, metres; faces +x; the driver sits on the far (−z) side. No logo, no
 * signature shape. The body's cut face, the dashboard's and the roof rail's are hatched and inked.
 * Moving parts (wheels, road, figure) belong to the scene.
 */

export const CAR_LAYOUT = {
  /** The near cut (the near wheels' mid-plane) and the far side's outer face. */
  cutZ: 0.8,
  farZ: -0.95,
  floor: 0.34,
  /** Wheel centres (x) and the track half-width (z), the tire radius. */
  axleX: {front: 1.35, rear: -1.35},
  track: 0.8,
  wheelR: 0.36,
  /** The driver's figure origin (on the floor under the pelvis) and the passenger seat. */
  driver: [0.25, 0.34, -0.38] as V3,
  passenger: [0.25, 0.34, 0.38] as V3,
  /** The steering wheel's centre, its tilt back from vertical. */
  steering: [0.68, 1.37, -0.38] as V3,
  /** The instrument cluster's face (toward the driver) and the receiver box under the dash. */
  cluster: [0.79, 1.3, -0.38] as V3,
  receiver: [0.78, 0.6, 0.5] as V3,
  /** The roof cut height. */
  roofCut: 1.92,
  /**
   * The whole car's interior (seats, dash, wheel) sits this much lower than the cut car's, under its
   * lower roof: put a figure driving the whole car this much lower too.
   */
  wholeSink: 0.14,
};

/** The layout with the driver by the near cut (`driverSide: 'near'`): the wheel and cluster move across. */
export const LAYOUT_NEAR = {
  ...CAR_LAYOUT,
  driver: [CAR_LAYOUT.driver[0], CAR_LAYOUT.driver[1], -CAR_LAYOUT.driver[2]] as V3,
  passenger: [CAR_LAYOUT.passenger[0], CAR_LAYOUT.passenger[1], -CAR_LAYOUT.passenger[2]] as V3,
  steering: [CAR_LAYOUT.steering[0], CAR_LAYOUT.steering[1], -CAR_LAYOUT.steering[2]] as V3,
  cluster: [CAR_LAYOUT.cluster[0], CAR_LAYOUT.cluster[1], -CAR_LAYOUT.cluster[2]] as V3,
};

/** The side section: lower body with the cabin hollowed and two wheel arches (x forward, y up). */
const arch = (cx: number, r = 0.44, n = 14): P2[] =>
  [...Array(n + 1).keys()].map((i) => {
    // from the arch's rear foot (x − r) over the top to its front foot (x + r)
    const t = Math.PI - (i / n) * Math.PI;
    return [cx + r * Math.cos(t), 0.36 + r * Math.sin(t)] as P2;
  });
const BODY: P2[] = [
  [2.3, 0.24],
  [2.37, 0.5],
  [2.35, 0.82],
  [2.22, 1.02],
  [1.7, 1.12],
  [1.12, 1.2],
  [1.02, 1.18],
  [0.97, 0.8],
  [0.88, 0.34],
  [-0.88, 0.34],
  [-0.88, 0.84],
  [-1.85, 0.84],
  [-1.9, 1.28],
  [-2.3, 1.3],
  [-2.4, 1.1],
  [-2.4, 0.5],
  [-2.32, 0.24],
  [-1.79, 0.24],
  ...arch(-1.35),
  [-0.91, 0.24],
  [0.91, 0.24],
  ...arch(1.35),
  [1.79, 0.24],
];
/** The far side's silhouette: the body's outline plus the greenhouse up to the roof cut. */
const FAR: P2[] = [
  [2.3, 0.24],
  [2.37, 0.5],
  [2.35, 0.82],
  [2.22, 1.02],
  [1.7, 1.12],
  [1.12, 1.2],
  [0.45, CAR_LAYOUT.roofCut],
  [-1.45, CAR_LAYOUT.roofCut],
  [-2.25, 1.34],
  [-2.3, 1.3],
  [-2.4, 1.1],
  [-2.4, 0.5],
  [-2.32, 0.24],
  [-1.79, 0.24],
  ...arch(-1.35),
  [-0.91, 0.24],
  [0.91, 0.24],
  ...arch(1.35),
  [1.79, 0.24],
];
/**
 * The electric car's body (No. 006, `ev`): no engine, so the front is an open bay under the hood (the
 * firewall, the hood's skin, the front structure), and no solid sill band between the arches (the
 * battery pack fills it). Two pieces: the front (bumper, hood, bay, firewall) and the rear.
 */
const BODY_EV_FRONT: P2[] = [
  [0.88, 0.34],
  [0.925, 0.34],
  [1.015, 0.8],
  [1.06, 1.1],
  [1.7, 1.05],
  [2.08, 0.96],
  [2.13, 0.86],
  [2.13, 0.24],
  [2.3, 0.24],
  [2.37, 0.5],
  [2.35, 0.82],
  [2.22, 1.02],
  [1.7, 1.12],
  [1.12, 1.2],
  [1.02, 1.18],
  [0.97, 0.8],
];
/**
 * The whole front (firewall, hood, front structure, bumper) is sectioned on one plane of its own,
 * `EV_FIREWALL_Z`, behind the near wheel: one clean outline, and the drive unit shows in the bay.
 */
export const EV_FIREWALL_Z = 0.4;
const BODY_EV_REAR: P2[] = [
  [-0.88, 0.36],
  [-0.88, 0.84],
  [-1.85, 0.84],
  [-1.9, 1.28],
  [-2.3, 1.3],
  [-2.4, 1.1],
  [-2.4, 0.5],
  [-2.32, 0.24],
  [-1.79, 0.24],
  ...arch(-1.35),
];
/** The gas car's sill (No. 008, `gas`): the band between the arches the EV's pack filled. */
const SILL_GAS: P2[] = [
  [-0.91, 0.24],
  [0.91, 0.24],
  [0.9, 0.35],
  [-0.9, 0.35],
];
/** The gas car's lower dashboard is sectioned on its own plane (a step in the cut), so the column and pedals show. */
export const GAS_DASH_Z = 0.28;
const WINDOWS: P2[][] = [
  [
    [1.02, 1.32],
    [0.5, 1.84],
    [-0.1, 1.84],
    [-0.1, 1.32],
  ],
  [
    [-0.22, 1.32],
    [-0.22, 1.84],
    [-1.12, 1.84],
    [-1.2, 1.32],
  ],
  [
    [-1.32, 1.32],
    [-1.32, 1.84],
    [-1.45, 1.84],
    [-2.05, 1.38],
  ],
];

const shapeOf = (pts: P2[], holes: P2[][] = []) => {
  const s = new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(x, y)));
  for (const h of holes) s.holes.push(new THREE.Path(h.map(([x, y]) => new THREE.Vector2(x, y))));
  return s;
};
const extrude = (shape: THREE.Shape, z0: number, z1: number) => {
  const g = new THREE.ExtrudeGeometry(shape, {depth: z1 - z0, bevelEnabled: false, curveSegments: 12});
  g.translate(0, 0, z0);
  return g;
};

export type RealCarProps = {
  mood: Mood;
  /** Body colour: 'you', 'mom' or 'extra' (a neutral grey for traffic; theme `CAR` bodies), never red or orange. */
  body?: 'you' | 'mom' | 'extra' | 'friend';
  /** The cluster's tire-pressure light lit (warning yellow, flat; the same drawing as the dashboard detail box). */
  warning?: boolean;
  /**
   * The whole car, not cut (default false): both sides with their windows, the roof, the rear window,
   * tail lamps, a rear bumper and a plain plate. For a car seen driving in a slice (the highway), not
   * sectioned by it.
   */
  whole?: boolean;
  /** The tail lamps lit, 0 (off: the dark lens) → 1 (running lights at night), flat emissive, never bloomed. */
  tail?: number;
  /** The plate's invented characters (whole car only; no state name, no logo). */
  plate?: string;
  /** The speed on the cluster's face (mph, default 38). */
  speed?: number;
  /** The tire-pressure symbol on the cluster (default true; false: not drawn). */
  tireLight?: boolean;
  /** Offset of the steering wheel and column (m): a tremble from the scene. Default none. */
  steeringJitter?: [number, number, number];
  /**
   * The electric car (No. 006): an open bay under the hood for the drive unit, no sill band (the pack
   * under the floor shows), no tire-sensor receiver. Default false.
   */
  ev?: boolean;
  /**
   * Which side the driver sits (default 'far', −z). 'near' (+z, the cut side) puts the seat's
   * occupant, wheel and cluster by the cut: with the car drawn mirrored (facing −x), a left-hand-drive
   * car seen from its driver's side.
   */
  driverSide?: 'far' | 'near';
  /** The car is drawn mirrored (a parent scale of −1 in x): the cluster's face is flipped back so it reads. */
  mirrored?: boolean;
  /**
   * The brake lamps lit (cut car), 0 → 1, flat emissive, never bloomed: both tail lamps and a centre
   * high-mount lamp on the tailgate. Default undefined: the cut car keeps its one far tail lamp (as No. 002/005).
   */
  brake?: number;
  /** × the cut edges' ink thickness (default 1; close framings thin it). */
  inkScale?: number;
  /** The cluster as an EV's (No. 006): speed and a power meter, its CHARGE zone orange while `power` < 0 (−1 → 1). */
  evCluster?: {power: number};
  /** The paint colour, overriding `body`'s (a theme token, e.g. `CITY.carBodies`; never red or orange). Default none. */
  paint?: string;
  /** The whole car's shape (`CarShell` `profile`): 'crossover' (default) or 'sedan' (lower roof, a trunk). */
  shape?: 'crossover' | 'sedan';
  /**
   * The gas car (No. 008): the EV's open bay under the hood (for the engine), a sill between the
   * arches, no receiver, and the dashboard below its top slab sectioned at `GAS_DASH_Z` so the steering
   * column, the pedals and their wiring show. Default false.
   */
  gas?: boolean;
  /** The dashboard below its top slab sectioned at `GAS_DASH_Z`, as the gas car's (No. 008: the EV's inverter board shows). Default false (implied by `gas`). */
  splitDash?: boolean;
  /** The steering wheel's turn (rad); when given, the wheel has three spokes so the turn reads. Default none (No. 002–006). */
  steer?: number;
};

const TAIL_RED = raw(HIGHWAY.tailLight);
const BRAKE_RED = raw(section.brakeLit);

/** The car body, cabin and fittings (see the file comment). */
export const RealCar: React.FC<RealCarProps> = ({
  mood,
  body = 'you',
  warning = false,
  whole = false,
  tail = 0,
  plate = '8KTR 214',
  speed = 38,
  tireLight = true,
  steeringJitter,
  ev = false,
  driverSide = 'far',
  mirrored = false,
  brake,
  inkScale = 1,
  evCluster,
  paint,
  shape = 'crossover',
  gas = false,
  splitDash = false,
  steer,
}) => {
  const split = gas || splitDash;
  // the gas car's body is the EV's (open bay) plus a sill
  const bay = ev || gas;
  const ready = useFontsLoaded();
  const L = driverSide === 'near' ? LAYOUT_NEAR : CAR_LAYOUT;
  const face = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 380;
    c.height = 120;
    const tx = new THREE.CanvasTexture(c);
    return {c, tx, key: '', mat: new THREE.MeshBasicMaterial({map: tx})};
  }, []);
  const faceKey = evCluster ? `ev|${speed}|${Math.round(evCluster.power * 100)}` : `${warning}|${speed}|${tireLight}`;
  if (ready && face.key !== faceKey) {
    if (evCluster) drawEvCluster(face.c.getContext('2d')!, 380, 120, {speed, power: evCluster.power});
    else drawCluster(face.c.getContext('2d')!, 380, 120, {warning, speed, trip: 'TRIP 12:40', tireLight});
    face.tx.needsUpdate = true;
    face.key = faceKey;
  }
  face.mat.color.setScalar(0.9 / MOODS[mood].exposure);
  const cluster = ready ? face.mat : null;
  const env = useStudioEnv();
  const envScale = useEnvStrength();
  const albedo = useAlbedo();
  const m = MOODS[mood];
  const mats = useMemo(() => {
    const phys = (c: string, o: THREE.MeshPhysicalMaterialParameters = {}) =>
      new THREE.MeshPhysicalMaterial({color: raw(c), ...o});
    return {
      // the whole car's paint satin, not gloss: its rounded roof and beltline edges mirrored the key as
      // broad white bands (style guide § 2: only glints ≤ 12 px may clip)
      paint: phys(paint ?? CAR[mood].bodies[body], {
        roughness: whole ? 0.5 : 0.32,
        metalness: whole ? 0.2 : 0.35,
        clearcoat: whole ? 0.3 : 1,
        clearcoatRoughness: whole ? 0.55 : 0.12,
      }),
      cut: cutMaterial(),
      trim: phys(REAL.dash, {roughness: 0.7}),
      seat: phys(REAL.seat, {roughness: 0.85}),
      carpet: phys(REAL.carpet, {roughness: 0.95}),
      glass: phys(REAL.carGlass, {roughness: 0.05, clearcoat: 1, transparent: true, opacity: 0.45, depthWrite: false}),
      chrome: phys(REAL.steel, {metalness: 1, roughness: 0.25}),
      receiver: phys(REAL.receiver, {roughness: 0.5}),
      light: phys('#dfe3e8', {roughness: 0.15, clearcoat: 1}),
      tail: phys(HIGHWAY.tailLens, {
        roughness: 0.2,
        clearcoat: 1,
        emissive: raw(HIGHWAY.tailLight),
        emissiveIntensity: 0,
      }),
      tailBright: phys(HIGHWAY.tailLens, {
        roughness: 0.2,
        clearcoat: 1,
        emissive: raw(HIGHWAY.tailLight),
        emissiveIntensity: 0,
      }),
      reverse: phys(REAL.chrome, {roughness: 0.12, clearcoat: 1, metalness: 0.2}),
      reflector: phys(HIGHWAY.tailLens, {roughness: 0.3, clearcoat: 1}),
      // tinted glass, slightly soft: its rounded top edge mirrored the key as an ≈ 90 px streak at 0.08
      // (the rear window's rake keeps the key's image off the flat glass: CarShell GLASS)
      tint: phys(REAL.carGlass, {
        roughness: 0.3,
        clearcoat: 0.3,
        clearcoatRoughness: 0.4,
        transparent: true,
        opacity: 0.62,
        depthWrite: false,
      }),
      mirror: phys(REAL.carGlass, {roughness: 0.02, metalness: 0.9}),
      gloss: phys(REAL.dash, {roughness: 0.3, clearcoat: 0.6}),
      bumper: phys(REAL.dash, {roughness: 0.55}),
      plate: new THREE.MeshStandardMaterial({color: raw('#ffffff'), roughness: 0.5}),
    };
  }, [mood, body, whole, paint]);
  const tailLit = Math.max(0, Math.min(1, tail));
  const brakeLit = Math.max(0, Math.min(1, brake ?? 0));
  const lit = Math.max(tailLit, brakeLit);
  // Brake lamps (No. 006 `brake`, whole and cut cars): a saturated red (`section.brakeLit`, the signal
  // red's hue) brighter than the running lights, held under the tone curve's shoulder so it stays red,
  // not pink. Running lights keep `tailLight` at their old level; unchanged when `brake` is 0. Flat
  // emissive, never bloomed.
  const tailLevel = (whole ? 0.45 : 0.9) * tailLit;
  const brakeOn = brakeLit > 0 && 1.7 * brakeLit >= tailLevel;
  mats.tail.emissive.copy(brakeOn ? BRAKE_RED : TAIL_RED);
  mats.tailBright.emissive.copy(brakeOn ? BRAKE_RED : TAIL_RED);
  mats.tail.emissiveIntensity = (brakeOn ? 1.7 * brakeLit : tailLevel) / m.exposure;
  // the light guides and the light bar: the brightest part of a lit lamp (still flat, never bloomed)
  mats.tailBright.emissiveIntensity = (brakeOn ? 1.9 * brakeLit : 1.5 * lit) / m.exposure;
  // a plain plate with invented characters (no state name, no logo), drawn once the fonts are in
  const plateTex = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 128;
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return {c, t, key: ''};
  }, []);
  if (whole && ready && plateTex.key !== plate) {
    const cx = plateTex.c.getContext('2d')!;
    cx.fillStyle = STREET.dial;
    cx.fillRect(0, 0, 256, 128);
    cx.strokeStyle = STREET.dialInk;
    cx.lineWidth = 6;
    cx.strokeRect(6, 6, 244, 116);
    cx.fillStyle = STREET.dialInk;
    cx.font = `700 46px ${fonts.mono}, monospace`;
    cx.textAlign = 'center';
    cx.textBaseline = 'middle';
    cx.fillText(plate, 128, 68);
    plateTex.t.needsUpdate = true;
    plateTex.key = plate;
    mats.plate.map = plateTex.t;
    mats.plate.needsUpdate = true;
  }
  applyEnv(
    env,
    [
      [mats.paint, 0.8],
      [mats.glass, 1.5],
      [mats.chrome, 1],
      [mats.light, 0.8],
      [mats.tint, 0.7],
      [mats.mirror, 1.2],
      [mats.reverse, 1],
      [mats.gloss, 0.6],
    ],
    envScale,
  );
  applyAlbedo([mats.paint, mats.trim, mats.seat, mats.carpet, mats.receiver, mats.gloss, mats.bumper], albedo);

  const geo = useMemo(
    () => ({
      body: extrude(shapeOf(BODY), -0.87, CAR_LAYOUT.cutZ),
      evFront: extrude(shapeOf(BODY_EV_FRONT), -0.87, EV_FIREWALL_Z),
      evRear: extrude(shapeOf(BODY_EV_REAR), -0.87, CAR_LAYOUT.cutZ),
      sill: extrude(shapeOf(SILL_GAS), -0.87, CAR_LAYOUT.cutZ),
      far: extrude(shapeOf(FAR, WINDOWS), CAR_LAYOUT.farZ, -0.87),
      glass: WINDOWS.map((w) => new THREE.ShapeGeometry(shapeOf(w))),
    }),
    [],
  );
  const bodyInk = useMemo(
    () =>
      bay
        ? [
            BODY_EV_FRONT.map(([x, y]) => [x, y, EV_FIREWALL_Z + 0.003] as V3),
            BODY_EV_REAR.map(([x, y]) => [x, y, CAR_LAYOUT.cutZ + 0.003] as V3),
            ...(gas ? [SILL_GAS.map(([x, y]) => [x, y, CAR_LAYOUT.cutZ + 0.003] as V3)] : []),
          ]
        : [BODY.map(([x, y]) => [x, y, CAR_LAYOUT.cutZ + 0.003] as V3)],
    [bay, gas],
  );
  const inkT = 0.011 * inkScale;
  const ws = new THREE.Vector3(1.12, 1.2, 0);
  const we = new THREE.Vector3(0.45, L.roofCut, 0);
  const wLen = ws.distanceTo(we);
  const wAng = Math.atan2(we.y - ws.y, we.x - ws.x);
  const [sx, sy, sz] = L.steering;
  // across the car: the whole width, or from the far side to the near cut
  const span = whole ? {w: 1.6, z: 0} : {w: L.cutZ + 0.87, z: (L.cutZ - 0.87) / 2};

  return (
    <group>
      {whole ? (
        // the whole car's shell: rounded body, glasshouse, lamps, bumper, plate, cladding (CarShell)
        <CarShell
          profile={shape}
          mats={{
            paint: mats.paint,
            glass: mats.tint,
            trim: mats.trim,
            gloss: mats.mirror,
            tail: mats.tail,
            tailBright: mats.tailBright,
            reverse: mats.reverse,
            reflector: mats.reflector,
            light: mats.light,
            plate: mats.plate,
          }}
        />
      ) : (
        <>
          {/* the lower body: cut face (hatched) at the near cut, paint elsewhere */}
          {bay ? (
            <>
              <mesh geometry={geo.evFront} material={[mats.cut, mats.paint]} castShadow receiveShadow />
              <mesh geometry={geo.evRear} material={[mats.cut, mats.paint]} castShadow receiveShadow />
              {gas ? <mesh geometry={geo.sill} material={[mats.cut, mats.paint]} castShadow receiveShadow /> : null}
            </>
          ) : (
            <mesh geometry={geo.body} material={[mats.cut, mats.paint]} castShadow receiveShadow />
          )}
          {bodyInk.map((b, i) => (
            <InkLine key={i} points={b} thickness={inkT} />
          ))}
          {/* the far side with its windows, standing like a room's back wall; the roof rail cut on top */}
          <mesh geometry={geo.far} material={[mats.paint, mats.paint]} castShadow receiveShadow />
          {geo.glass.map((g, i) => (
            <mesh key={i} geometry={g} material={mats.glass} position={[0, 0, -0.905]} />
          ))}
          <mesh
            position={[-0.5, L.roofCut + 0.001, (L.farZ - 0.87) / 2]}
            rotation={[-Math.PI / 2, 0, 0]}
            material={mats.cut}
          >
            <planeGeometry args={[1.9, 0.08]} />
          </mesh>
          <CutOutline
            rects={[
              [
                [-1.45, L.roofCut + 0.002, L.farZ],
                [0.45, L.roofCut + 0.002, -0.87],
              ],
            ]}
            thickness={inkT}
          />
          {/* the windshield, cut at the roof and at the near cut */}
          <mesh position={[(ws.x + we.x) / 2, (ws.y + we.y) / 2, span.z]} rotation={[0, 0, wAng]} material={mats.glass}>
            <boxGeometry args={[wLen, 0.012, span.w]} />
          </mesh>
          {/* headlights (generic strips) */}
          <mesh position={[2.33, 0.86, 0.55]} rotation={[0, Math.PI / 2, 0]} material={mats.light}>
            <planeGeometry args={[0.36, 0.08]} />
          </mesh>
          <mesh position={[2.33, 0.86, -0.6]} rotation={[0, Math.PI / 2, 0]} material={mats.light}>
            <planeGeometry args={[0.36, 0.08]} />
          </mesh>
          {/* the tail lamps on the far side's back corner (lit at night, like the whole car's) */}
          <mesh geometry={roundedBox(0.04, 0.17, 0.3, 0.012)} material={mats.tail} position={[-2.39, 1.0, -0.68]} />
          {brake !== undefined ? (
            <>
              {/* the brake lamps (No. 006): the near tail lamp, cut by the section, and the centre high-mount lamp */}
              <mesh
                material={[mats.tail, mats.tail, mats.tail, mats.tail, mats.cut, mats.tail]}
                position={[-2.39, 1.0, 0.66]}
              >
                <boxGeometry args={[0.04, 0.17, 0.28]} />
              </mesh>
              <mesh
                geometry={roundedBox(0.05, 0.035, 0.36, 0.01)}
                material={mats.tailBright}
                position={[-2.33, 1.315, 0]}
              />
            </>
          ) : null}
        </>
      )}
      <group position={[0, whole ? -L.wholeSink - shellSink(shape) : 0, 0]}>
        {/* the cabin: carpet, dashboard (cut at the near cut), seats */}
        <mesh
          position={[0, L.floor + 0.003, -0.03]}
          rotation={[-Math.PI / 2, 0, 0]}
          material={mats.carpet}
          receiveShadow
        >
          <planeGeometry args={[1.74, 1.66]} />
        </mesh>
        {split && !whole ? (
          <>
            {/* the gas car: the dash's top slab runs to the cut; below it the dash is sectioned at GAS_DASH_Z */}
            <mesh
              position={[0.92, 1.16, span.z]}
              material={[mats.trim, mats.trim, mats.trim, mats.trim, mats.cut, mats.trim]}
              castShadow
              receiveShadow
            >
              <boxGeometry args={[0.4, 0.12, span.w]} />
            </mesh>
            <mesh
              position={[0.92, 1.01, (GAS_DASH_Z - 0.87) / 2]}
              material={[mats.trim, mats.trim, mats.trim, mats.trim, mats.cut, mats.trim]}
              castShadow
              receiveShadow
            >
              <boxGeometry args={[0.4, 0.18, GAS_DASH_Z + 0.87]} />
            </mesh>
            <CutOutline
              rects={[
                [
                  [0.72, 1.1, L.cutZ],
                  [1.12, 1.22, L.cutZ],
                ],
                [
                  [0.72, 0.92, GAS_DASH_Z],
                  [1.12, 1.1, GAS_DASH_Z],
                ],
              ]}
              thickness={inkT}
            />
          </>
        ) : (
          <mesh
            position={[0.92, 1.08, span.z]}
            material={[mats.trim, mats.trim, mats.trim, mats.trim, whole ? mats.trim : mats.cut, mats.trim]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[0.4, 0.28, span.w]} />
          </mesh>
        )}
        {whole || split ? null : (
          <CutOutline
            rects={[
              [
                [0.72, 0.94, L.cutZ],
                [1.12, 1.22, L.cutZ],
              ],
            ]}
            thickness={inkT}
          />
        )}
        {/* the cluster's binnacle and face (the face looks at the driver, read in the detail box) */}
        <mesh
          geometry={roundedBox(0.12, 0.16, 0.44, 0.02)}
          material={mats.trim}
          position={[L.cluster[0] + 0.07, L.cluster[1], L.cluster[2]]}
          castShadow
        />
        {cluster ? (
          <mesh
            position={[L.cluster[0] + 0.005, L.cluster[1], L.cluster[2]]}
            rotation={[0, -Math.PI / 2, 0]}
            scale={mirrored ? [-1, 1, 1] : undefined}
            material={cluster}
          >
            <planeGeometry args={[0.38, 0.12]} />
          </mesh>
        ) : null}
        {/* steering column and wheel */}
        <group
          position={
            steeringJitter ? [sx + steeringJitter[0], sy + steeringJitter[1], sz + steeringJitter[2]] : [sx, sy, sz]
          }
          rotation={[0, 0, -0.42]}
        >
          <group rotation={[steer ?? 0, 0, 0]}>
            <mesh rotation={[0, Math.PI / 2, 0]} material={mats.trim} castShadow>
              <torusGeometry args={[0.17, 0.018, 12, 40]} />
            </mesh>
            {steer !== undefined
              ? // three spokes (No. 008), so a turn of the wheel reads
                [Math.PI / 2, Math.PI / 2 + (2 * Math.PI) / 3, Math.PI / 2 - (2 * Math.PI) / 3].map((a) => (
                  <mesh
                    key={a}
                    position={[0, -0.085 * Math.sin(a), 0.085 * Math.cos(a)]}
                    rotation={[a, 0, 0]}
                    material={mats.trim}
                    castShadow
                  >
                    <boxGeometry args={[0.012, 0.03, 0.16]} />
                  </mesh>
                ))
              : null}
          </group>
          <mesh position={[0.11, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={mats.trim} castShadow>
            <cylinderGeometry args={[0.03, 0.04, 0.22, 16]} />
          </mesh>
          <mesh position={[0.005, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={mats.trim}>
            <cylinderGeometry args={[0.06, 0.06, 0.03, 20]} />
          </mesh>
        </group>
        {/* the receiver under the dash (its node dot is drawn by the scene); none on the electric car */}
        {bay ? null : (
          <mesh
            geometry={roundedBox(0.14, 0.05, 0.1, 0.008)}
            material={mats.receiver}
            position={L.receiver}
            castShadow
          />
        )}
        {[L.driver, L.passenger].map((p, i) => (
          <Seat key={i} at={p} mats={mats} />
        ))}
        {/* the rear bench on its riser */}
        <mesh
          geometry={roundedBox(0.55, 0.14, 1.5, 0.05, 4)}
          material={mats.seat}
          position={[-1.35, 0.92, -0.05]}
          castShadow
          receiveShadow
        />
        <mesh
          geometry={roundedBox(0.14, 0.62, 1.5, 0.05, 4)}
          material={mats.seat}
          position={[-1.62, 1.28, -0.05]}
          rotation={[0, 0, 0.12]}
          castShadow
          receiveShadow
        />
      </group>
      <BlobShadow position={[0, 0.003, -0.05]} size={[5.4, 2.4]} opacity={0.45} />
    </group>
  );
};

/** A front seat: cushion at the figure's seat height (0.57 above its origin), back, headrest. */
const Seat: React.FC<{at: V3; mats: {seat: THREE.Material; trim: THREE.Material}}> = ({at, mats}) => {
  const [x, y, z] = at;
  return (
    <group position={[x, y, z]}>
      <mesh
        geometry={roundedBox(0.52, 0.12, 0.5, 0.04, 4)}
        material={mats.seat}
        position={[-0.05, 0.51, 0]}
        castShadow
        receiveShadow
      />
      <mesh position={[-0.05, 0.22, 0]} material={mats.trim}>
        <boxGeometry args={[0.36, 0.44, 0.3]} />
      </mesh>
      <mesh
        geometry={roundedBox(0.12, 0.72, 0.48, 0.04, 4)}
        material={mats.seat}
        position={[-0.34, 0.92, 0]}
        rotation={[0, 0, 0.18]}
        castShadow
        receiveShadow
      />
      <mesh
        geometry={roundedBox(0.1, 0.18, 0.26, 0.04, 4)}
        material={mats.seat}
        position={[-0.43, 1.4, 0]}
        castShadow
      />
    </group>
  );
};
