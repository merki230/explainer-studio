import React, {useMemo} from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import * as THREE from 'three';
import {fonts} from '../../fonts';
import {HIGHWAY, MOODS, REAL, section, STREET, type Mood} from '../../theme';
import {beaconLevels} from './hazard';
import {raw, roundedBox} from '../plaster';
import {Figure} from '../section/Figure';
import {useFontsLoaded} from '../section/useFontsLoaded';
import {RealWheel} from './RealWheel';
import {applyAlbedo, applyEnv, useAlbedo, useEnvStrength, useStudioEnv} from './useStudioEnv';

type V3 = [number, number, number];
type P2 = [number, number];

/*
 * A generic white utility pickup with a service body (No. 004), whole (it is not sectioned): no logo,
 * no light bar, no beacons, nothing amber; clear unlit headlamps, dark-red unlit tail lamps. A regular
 * cab with a raked windshield and side windows (the driver, a grey extra in the 'drive' pose, seen
 * through them), wheel arches with dark liners, a service body with three compartments a side
 * (seams, chrome T-handles) and an open bed between, mirrors, realistic wheels. A small receiver whip
 * on a magnetic base on the cab roof (its node dot is the system), a rugged laptop on a pedestal beside
 * the driver, its screen turned to him (read in the detail box). Metres; the truck's own frame faces −z
 * (front bumper at lz −3.12), x across (+x its right side), origin on the ground at mid-length. The
 * driver sits on the left (−x, a left-hand-drive US truck).
 */

export const TRUCK = {
  front: -3.12,
  rear: 3.12,
  halfWidth: 1.06,
  /** Wheel centres (lz), track half-width, tire radius. */
  axles: [-2.3, 1.75],
  track: 0.83,
  wheelR: 0.4,
  /** The receiver whip's tip and its base on the cab roof. */
  receiver: [0.35, 2.5, -0.9] as V3,
  receiverBase: [0.35, 2.03, -0.9] as V3,
  /** The driver's figure origin (cab floor, under the pelvis), the steering wheel, the cab's centre. */
  driver: [-0.45, 0.45, -1.1] as V3,
  /** 0.43 m behind the windshield's base (lz −1.96), at the seated driver's chest, on a column out of the binnacle. */
  steering: [-0.45, 1.48, -1.53] as V3,
  cab: [0, 1.5, -1.1] as V3,
  /** The rugged laptop (its pedestal top) and where its screen looks (the driver's eyes). */
  laptop: [0.14, 1.4, -1.6] as V3,
  eyes: [-0.45, 1.81, -1.07] as V3,
};

export type TruckDirection = 'away' | 'toward';

/** No. 009: the roof light bar (truck frame): its centre across the roof's front half, the four lenses' x. */
export const LIGHT_BAR = {z: -1.18, lenses: [-0.5, -0.17, 0.17, 0.5], top: 2.18};

/** Truck frame → world: 'away' faces −z (no turn); 'toward' is turned π about y (faces +z). */
export const truckToWorld = (p: V3, at: [number, number], direction: TruckDirection): V3 =>
  direction === 'away' ? [at[0] + p[0], p[1], at[1] + p[2]] : [at[0] - p[0], p[1], at[1] - p[2]];

/** Side profile (lz, y) of the cab and front end, with the front wheel arch; window holes. */
const arch = (cz: number, r: number, from: number, to: number, n = 16): P2[] =>
  [...Array(n + 1).keys()].map((i) => {
    const a = from + ((to - from) * i) / n;
    return [cz + r * Math.cos(a), 0.4 + r * Math.sin(a)] as P2;
  });
const CAB: P2[] = [
  [-3.06, 0.42],
  [-3.1, 0.98],
  [-2.98, 1.18],
  [-1.96, 1.3],
  [-1.42, 1.98],
  [-0.46, 2.02],
  [-0.36, 1.95],
  [-0.36, 0.42],
  [-1.8, 0.42],
  ...arch(-2.3, 0.5, 0.05, Math.PI - 0.05),
  [-3.06, 0.42],
];
const WINDOWS: P2[][] = [
  [
    [-1.84, 1.38],
    [-1.42, 1.9],
    [-0.96, 1.9],
    [-0.96, 1.38],
  ],
  [
    [-0.86, 1.38],
    [-0.86, 1.9],
    [-0.5, 1.9],
    [-0.5, 1.38],
  ],
];
/** The service body's side profile (lz, y), with the rear wheel arch. */
const BODY: P2[] = [
  [-0.28, 0.68],
  [-0.28, 1.62],
  [3.02, 1.62],
  [3.02, 0.68],
  [2.27, 0.68],
  ...arch(1.75, 0.52, 0.12, Math.PI - 0.12),
  [1.23, 0.68],
];

/** A shape in (u = −lz, y) so that after `rotateY(π/2)` the shape's x runs along the truck (lz). */
const sideShape = (pts: P2[], holes: P2[][] = []) => {
  const s = new THREE.Shape(pts.map(([z, y]) => new THREE.Vector2(-z, y)));
  for (const h of holes) s.holes.push(new THREE.Path(h.map(([z, y]) => new THREE.Vector2(-z, y))));
  return s;
};
/** Extrude a side profile across x from x0 to x1. */
const sideSlab = (shape: THREE.Shape, x0: number, x1: number) => {
  const g = new THREE.ExtrudeGeometry(shape, {depth: x1 - x0, bevelEnabled: false, curveSegments: 16});
  g.rotateY(Math.PI / 2);
  g.translate(x0, 0, 0);
  return g;
};

export type UtilityTruckProps = {
  mood: Mood;
  /** World x of the truck's centre line and world z of its origin (the middle of its length). */
  at: [number, number];
  direction?: TruckDirection;
  /**
   * Wheel turn (rad) and the turn while the shutter is open (motion blur, rad, signed like `spin`). Rolling forward
   * (either `direction`) is a NEGATIVE turn: pass −metres driven / `TRUCK.wheelR`, capped with `cappedTravel` and
   * smeared with `wheelSmear` above `capSpeed` (`wheelMotion.ts`; see `PatrolTruck`).
   */
  spin?: number;
  blur?: number;
  /** The roof receiver's node dot (the system), 0 (off) to 1 (lit). */
  dot?: number;
  clockOffset?: number;
  /** The roof receiver (whip and magnetic base). Default true (No. 004); false for the service-patrol truck. */
  receiver?: boolean;
  /**
   * No. 009: a roof light bar across the cab roof (a black base, four lenses in `warning` yellow, D3: no red, no
   * blue, no lettering). Default false.
   */
  lightBar?: boolean;
  /**
   * The light bar flashing, 0 (dark lenses) → 1: the two halves alternate on the video clock (`beaconLevels`,
   * out of step with the hazards), flat emissive, never bloomed, no spill. Default 0.
   */
  flashing?: number;
  /** Headlights, 0 → 1: the lenses lit and two spot lights on the road ahead (Night). Default 0. */
  headlights?: number;
  /** The tail lamps lit (running lights), 0 → 1, flat red. Default 0. */
  tail?: number;
  /** The brake lamps lit, 0 → 1, flat red, brighter than the running lights. Default 0. */
  brake?: number;
};

export const UtilityTruck: React.FC<UtilityTruckProps> = ({
  mood,
  at,
  direction = 'toward',
  spin = 0,
  blur = 0,
  dot = 0,
  clockOffset = 0,
  receiver = true,
  lightBar = false,
  flashing = 0,
  headlights = 0,
  tail = 0,
  brake = 0,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const env = useStudioEnv();
  const envScale = useEnvStrength();
  const albedo = useAlbedo();
  const ready = useFontsLoaded();
  const mats = useMemo(() => {
    const phys = (c: string, o: THREE.MeshPhysicalMaterialParameters = {}) =>
      new THREE.MeshPhysicalMaterial({color: raw(c), ...o});
    return {
      paint: phys(STREET.truck, {roughness: 0.28, metalness: 0.15, clearcoat: 1, clearcoatRoughness: 0.08}),
      trim: phys(STREET.truckTrim, {roughness: 0.7}),
      grille: phys(STREET.truckTrim, {roughness: 0.45, metalness: 0.3}),
      liner: phys(REAL.tab, {roughness: 0.95, side: THREE.DoubleSide}),
      seat: phys(REAL.seat, {roughness: 0.85}),
      dash: phys(REAL.dash, {roughness: 0.7}),
      floor: phys(REAL.carpet, {roughness: 0.95}),
      glass: phys(REAL.carGlass, {
        roughness: 0.04,
        clearcoat: 1,
        transparent: true,
        opacity: 0.32,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
      lamp: phys(STREET.lamp, {
        roughness: 0.1,
        clearcoat: 1,
        metalness: 0.4,
        emissive: raw(HIGHWAY.headlight),
        emissiveIntensity: 0,
      }),
      tail: phys(STREET.tailLamp, {
        roughness: 0.2,
        clearcoat: 1,
        emissive: raw(HIGHWAY.tailLight),
        emissiveIntensity: 0,
      }),
      barLens: [0, 1].map(() =>
        phys(section.warning, {roughness: 0.15, clearcoat: 1, emissive: raw(section.warning), emissiveIntensity: 0}),
      ),
      barBase: phys(REAL.dash, {roughness: 0.5}),
      laptop: phys(STREET.laptop, {roughness: 0.6}),
      steel: phys(REAL.steel, {metalness: 1, roughness: 0.3}),
      chrome: phys(REAL.chrome, {metalness: 1, roughness: 0.18}),
      rubber: phys(REAL.rubber, {roughness: 0.6}),
      seam: new THREE.MeshBasicMaterial({color: raw(STREET.truckTrim)}),
      plate: new THREE.MeshStandardMaterial({color: raw('#ffffff'), roughness: 0.5}),
      on: new THREE.MeshBasicMaterial({color: raw(section.orange)}),
      off: new THREE.MeshStandardMaterial({color: raw(section.ledOff), roughness: 0.4}),
    };
  }, []);
  applyEnv(
    env,
    [
      [mats.paint, 0.75],
      [mats.glass, 1.5],
      [mats.lamp, 1],
      [mats.steel, 1],
      [mats.chrome, 1.1],
      [mats.grille, 0.6],
    ],
    envScale,
  );
  applyAlbedo([mats.paint, mats.trim, mats.seat, mats.dash, mats.floor, mats.laptop, mats.liner], albedo);
  // No. 009: the lamps (flat emissive, never bloomed) and the light bar on the video clock
  const ex = MOODS[mood].exposure;
  const tailK = Math.max(0, Math.min(1, tail));
  const brakeK = Math.max(0, Math.min(1, brake));
  const brakeOn = brakeK > 0 && 1.7 * brakeK >= 0.9 * tailK;
  mats.tail.emissive.copy(raw(brakeOn ? section.brakeLit : HIGHWAY.tailLight));
  mats.tail.emissiveIntensity = (brakeOn ? 1.7 * brakeK : 0.9 * tailK) / ex;
  const headK = Math.max(0, Math.min(1, headlights));
  mats.lamp.emissiveIntensity = (0.9 * headK) / ex;
  const flashK = Math.max(0, Math.min(1, flashing));
  const beacon = beaconLevels(frame / fps + clockOffset);
  mats.barLens.forEach((m, i) => {
    // a dark lens is the same yellow, unlit and shaded down (no new colour)
    m.color.copy(raw(section.warning)).multiplyScalar(0.45);
    m.emissiveIntensity = (1.1 * flashK * beacon[i]) / ex;
  });
  const beams = useMemo(
    () => [-0.72, 0.72].map(() => new THREE.SpotLight(raw(HIGHWAY.headlight), 0, 30, 0.42, 0.6, 1)),
    [],
  );
  beams.forEach((l, i) => {
    l.intensity = 14 * headK;
    l.position.set([-0.72, 0.72][i], 0.93, -3.2);
    l.target.position.set([-0.72, 0.72][i] * 2, 0, -14);
  });

  // a plain plate with invented characters (no state name, no logo)
  const plate = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 128;
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return {c, t, drawn: false};
  }, []);
  if (ready && !plate.drawn) {
    const cx = plate.c.getContext('2d')!;
    cx.fillStyle = STREET.dial;
    cx.fillRect(0, 0, 256, 128);
    cx.strokeStyle = STREET.dialInk;
    cx.lineWidth = 6;
    cx.strokeRect(6, 6, 244, 116);
    cx.fillStyle = STREET.dialInk;
    cx.font = `700 64px ${fonts.mono}, monospace`;
    cx.textAlign = 'center';
    cx.textBaseline = 'middle';
    cx.fillText('UT 4471', 128, 68);
    plate.t.needsUpdate = true;
    plate.drawn = true;
    mats.plate.map = plate.t;
    mats.plate.needsUpdate = true;
  }

  const geo = useMemo(() => {
    const cab = sideShape(CAB, WINDOWS);
    const body = sideShape(BODY);
    const glass = WINDOWS.map((w) => {
      const g = new THREE.ShapeGeometry(sideShape(w));
      g.rotateY(Math.PI / 2);
      return g;
    });
    const liner = (r: number) => {
      const g = new THREE.CylinderGeometry(r, r, 0.34, 24, 1, true, -Math.PI / 2, Math.PI);
      g.rotateZ(Math.PI / 2);
      g.rotateX(Math.PI / 2);
      return g;
    };
    const len = (a: P2, b: P2) => Math.hypot(b[0] - a[0], b[1] - a[1]);
    return {
      cabL: sideSlab(cab, -0.98, -0.93),
      cabR: sideSlab(cab, 0.93, 0.98),
      bodyL: sideSlab(body, -1.06, -0.55),
      bodyR: sideSlab(body, 0.55, 1.06),
      glass,
      linerF: liner(0.48),
      linerR: liner(0.5),
      hoodLen: len([-2.98, 1.18], [-1.96, 1.3]),
      wsLen: len([-1.96, 1.3], [-1.42, 1.98]),
      mirror: roundedBox(0.07, 0.2, 0.15, 0.025, 3),
      handle: roundedBox(0.03, 0.035, 0.13, 0.01, 2),
      lamp: roundedBox(0.36, 0.17, 0.04, 0.03, 3),
      barBase: roundedBox(1.4, 0.06, 0.3, 0.02, 3),
      barLens: roundedBox(0.3, 0.09, 0.24, 0.035, 4),
    };
  }, []);

  const turn = direction === 'away' ? 0 : Math.PI;
  const laptopQ = useMemo(() => {
    const o = new THREE.Object3D();
    o.position.set(...TRUCK.laptop);
    o.lookAt(new THREE.Vector3(...TRUCK.eyes));
    return o.quaternion.clone();
  }, []);
  const lit = dot > 0.05;
  const [hx0, hy0] = [-2.98, 1.18];
  const hoodA = -Math.atan2(1.3 - hy0, -1.96 - hx0);
  const wsA = -Math.atan2(1.98 - 1.3, -1.42 + 1.96);
  const D = TRUCK.driver;

  return (
    <group position={[at[0], 0, at[1]]} rotation={[0, turn, 0]}>
      {/* the cab and front end: side panels with the windows, hood, fascia, roof, windshield */}
      <mesh geometry={geo.cabL} material={mats.paint} castShadow receiveShadow />
      <mesh geometry={geo.cabR} material={mats.paint} castShadow receiveShadow />
      {geo.glass.map((g, i) => (
        <group key={i}>
          <mesh geometry={g} material={mats.glass} position={[-0.955, 0, 0]} />
          <mesh geometry={g} material={mats.glass} position={[0.955, 0, 0]} />
        </group>
      ))}
      <mesh
        material={mats.paint}
        position={[0, (hy0 + 1.3) / 2 + 0.015, (hx0 - 1.96) / 2]}
        rotation={[hoodA, 0, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[1.9, 0.03, geo.hoodLen]} />
      </mesh>
      <mesh material={mats.trim} position={[0, 0.82, -2.5]}>
        <boxGeometry args={[1.86, 0.62, 1.0]} />
      </mesh>
      <mesh material={mats.paint} position={[0, 0.98, -3.06]} castShadow>
        <boxGeometry args={[1.96, 0.36, 0.1]} />
      </mesh>
      <mesh material={mats.grille} position={[0, 0.9, -3.115]}>
        <boxGeometry args={[1.0, 0.3, 0.02]} />
      </mesh>
      {[0.8, 0.88, 0.96, 1.02].map((y) => (
        <mesh key={y} material={mats.chrome} position={[0, y, -3.128]}>
          <boxGeometry args={[0.96, 0.012, 0.01]} />
        </mesh>
      ))}
      {[-0.72, 0.72].map((x) => (
        <mesh key={x} geometry={geo.lamp} material={mats.lamp} position={[x, 0.93, -3.11]} />
      ))}
      <mesh material={mats.trim} position={[0, 0.52, -3.1]} castShadow>
        <boxGeometry args={[2.02, 0.24, 0.16]} />
      </mesh>
      <mesh material={mats.plate} position={[0, 0.52, -3.185]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[0.3, 0.15]} />
      </mesh>
      <mesh material={mats.paint} position={[0, 2.0, -0.92]} castShadow receiveShadow>
        <boxGeometry args={[1.96, 0.06, 1.06]} />
      </mesh>
      <mesh material={mats.glass} position={[0, 1.64, -1.69]} rotation={[wsA, 0, 0]}>
        <planeGeometry args={[1.86, geo.wsLen]} />
      </mesh>
      <mesh material={mats.paint} position={[0, 1.2, -0.39]} castShadow receiveShadow>
        <boxGeometry args={[1.9, 1.56, 0.06]} />
      </mesh>
      {/* inside: floor, dash, seats, steering wheel */}
      <mesh material={mats.floor} position={[0, 0.405, -1.17]} receiveShadow>
        <boxGeometry args={[1.86, 0.09, 1.56]} />
      </mesh>
      {/* the dashboard: a deep padded top under the windshield, the instrument binnacle in front of the
          wheel, the lower dash and centre stack down to the floor */}
      <mesh material={mats.dash} position={[0, 1.12, -1.8]} castShadow receiveShadow>
        <boxGeometry args={[1.86, 0.3, 0.34]} />
      </mesh>
      <mesh
        geometry={roundedBox(1.86, 0.06, 0.4, 0.025, 3)}
        material={mats.dash}
        position={[0, 1.28, -1.79]}
        castShadow
        receiveShadow
      />
      <mesh
        geometry={roundedBox(0.44, 0.13, 0.18, 0.04, 3)}
        material={mats.dash}
        position={[TRUCK.steering[0], 1.33, -1.67]}
        castShadow
      />
      <mesh material={mats.dash} position={[0, 0.78, -1.86]} receiveShadow>
        <boxGeometry args={[1.86, 0.42, 0.2]} />
      </mesh>
      <mesh material={mats.dash} position={[0, 0.85, -1.6]} receiveShadow>
        <boxGeometry args={[0.3, 0.6, 0.3]} />
      </mesh>
      {[-0.45, 0.45].map((x) => (
        <group key={x} position={[x, D[1], D[2]]}>
          <mesh
            geometry={roundedBox(0.5, 0.12, 0.52, 0.04, 4)}
            material={mats.seat}
            position={[0, 0.51, 0.04]}
            castShadow
            receiveShadow
          />
          <mesh material={mats.dash} position={[0, 0.22, 0.05]}>
            <boxGeometry args={[0.34, 0.44, 0.3]} />
          </mesh>
          <mesh
            geometry={roundedBox(0.48, 0.7, 0.12, 0.04, 4)}
            material={mats.seat}
            position={[0, 0.92, 0.33]}
            rotation={[0.16, 0, 0]}
            castShadow
            receiveShadow
          />
          <mesh
            geometry={roundedBox(0.26, 0.17, 0.1, 0.04, 4)}
            material={mats.seat}
            position={[0, 1.38, 0.41]}
            castShadow
          />
        </group>
      ))}
      <group position={TRUCK.steering} rotation={[-0.45, 0, 0]}>
        <mesh material={mats.dash}>
          <torusGeometry args={[0.19, 0.02, 12, 40]} />
        </mesh>
        {/* the hub and three spokes, the column running forward and down into the binnacle */}
        <mesh material={mats.dash} position={[0, 0, -0.02]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.055, 0.06, 0.05, 20]} />
        </mesh>
        {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((a) => (
          <mesh
            key={a}
            material={mats.dash}
            position={[Math.sin(a) * 0.1, -Math.cos(a) * 0.1, -0.01]}
            rotation={[0, 0, a]}
          >
            <boxGeometry args={[0.03, 0.14, 0.015]} />
          </mesh>
        ))}
        <mesh material={mats.dash} position={[0, 0, -0.15]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.04, 0.24, 12]} />
        </mesh>
      </group>
      {/* the rugged laptop on its pedestal, screen to the driver */}
      <mesh material={mats.steel} position={[TRUCK.laptop[0], (TRUCK.laptop[1] + 0.45) / 2, TRUCK.laptop[2]]}>
        <cylinderGeometry args={[0.02, 0.025, TRUCK.laptop[1] - 0.45, 10]} />
      </mesh>
      <group position={TRUCK.laptop} quaternion={laptopQ}>
        <mesh
          geometry={roundedBox(0.34, 0.24, 0.035, 0.01)}
          material={mats.laptop}
          position={[0, 0.06, 0]}
          castShadow
        />
        <mesh
          geometry={roundedBox(0.34, 0.035, 0.25, 0.01)}
          material={mats.laptop}
          position={[0, -0.07, 0.12]}
          castShadow
        />
        {[-1, 1].map((sx) =>
          [-1, 1].map((sy) => (
            <mesh
              key={`${sx}${sy}`}
              geometry={roundedBox(0.04, 0.04, 0.045, 0.01)}
              material={mats.rubber}
              position={[sx * 0.16, 0.06 + sy * 0.11, 0]}
            />
          )),
        )}
      </group>
      <Figure
        who="extra"
        seed="truck-driver"
        mood={mood}
        position={D}
        rotationY={Math.PI}
        gestures={[{pose: 'drive', at: -1}]}
        phone={false}
        hands={[
          [-0.16, 1.02, 0.4],
          [0.16, 1.04, 0.41],
        ]}
        clockOffset={clockOffset}
      />
      {/* mirrors and door handles */}
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh material={mats.trim} position={[s * 1.05, 1.42, -1.8]}>
            <boxGeometry args={[0.16, 0.03, 0.05]} />
          </mesh>
          <mesh geometry={geo.mirror} material={mats.trim} position={[s * 1.15, 1.48, -1.78]} castShadow />
          <mesh geometry={geo.handle} material={mats.trim} position={[s * 0.985, 1.26, -1.05]} />
        </group>
      ))}
      {/* the service body: compartments (seams, handles), the bed between, bulkhead, tailgate, lamps */}
      <mesh geometry={geo.bodyL} material={mats.paint} castShadow receiveShadow />
      <mesh geometry={geo.bodyR} material={mats.paint} castShadow receiveShadow />
      <mesh material={mats.paint} position={[0, 0.94, -0.24]} castShadow>
        <boxGeometry args={[1.1, 0.52, 0.08]} />
      </mesh>
      <mesh material={mats.trim} position={[0, 0.9, 1.37]} receiveShadow>
        <boxGeometry args={[1.1, 0.04, 3.2]} />
      </mesh>
      <mesh material={mats.paint} position={[0, 0.94, 2.98]} castShadow>
        <boxGeometry args={[1.1, 0.52, 0.08]} />
      </mesh>
      {[-1, 1].map((s) => {
        const x = s * 1.062;
        const ry = s > 0 ? Math.PI / 2 : -Math.PI / 2;
        return (
          <group key={s}>
            {[0.52, 1.2, 2.3].map((z) => (
              <mesh key={z} material={mats.seam} position={[x, 1.15, z]} rotation={[0, ry, 0]}>
                <planeGeometry args={[0.012, 0.92]} />
              </mesh>
            ))}
            <mesh material={mats.seam} position={[x, 1.2, 1.75]} rotation={[0, ry, 0]}>
              <planeGeometry args={[1.1, 0.012]} />
            </mesh>
            {[0.12, 0.86, 1.75, 2.66].map((z) => (
              <mesh key={z} material={mats.chrome} position={[s * 1.075, z === 1.75 ? 1.42 : 1.3, z]}>
                <boxGeometry args={[0.025, 0.035, 0.12]} />
              </mesh>
            ))}
            <mesh material={mats.tail} position={[s * 0.83, 1.2, 3.025]}>
              <boxGeometry args={[0.12, 0.34, 0.01]} />
            </mesh>
          </group>
        );
      })}
      <mesh material={mats.trim} position={[0, 0.48, 3.06]} castShadow>
        <boxGeometry args={[2.04, 0.2, 0.14]} />
      </mesh>
      {/* chassis, wheel-arch liners, wheels */}
      <mesh material={mats.trim} position={[0, 0.5, 0]}>
        <boxGeometry args={[1.6, 0.3, 5.9]} />
      </mesh>
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh geometry={geo.linerF} material={mats.liner} position={[s * 0.82, 0.4, -2.3]} />
          <mesh geometry={geo.linerR} material={mats.liner} position={[s * 0.82, 0.4, 1.75]} />
        </group>
      ))}
      {TRUCK.axles.map((z) =>
        [-1, 1].map((s) => (
          <RealWheel
            key={`${z}${s}`}
            mood={mood}
            position={[s * TRUCK.track, TRUCK.wheelR, z]}
            yaw={s > 0 ? 0 : Math.PI}
            radius={TRUCK.wheelR}
            cut="none"
            spin={s > 0 ? spin : -spin}
            motionBlur={s > 0 ? blur : -blur}
            low
            ink={false}
            valve={false}
          />
        )),
      )}
      {/* No. 009: headlight beams on the road ahead (mounted only while lit, so earlier scenes are unchanged) */}
      {headK > 0
        ? beams.map((l, i) => (
            <React.Fragment key={i}>
              <primitive object={l} />
              <primitive object={l.target} />
            </React.Fragment>
          ))
        : null}
      {/* No. 009: the roof light bar: a low black base across the cab roof, four lenses (two a side) */}
      {lightBar ? (
        <group position={[0, 2.03, LIGHT_BAR.z]}>
          <mesh geometry={geo.barBase} material={mats.barBase} position={[0, 0.03, 0]} castShadow />
          {LIGHT_BAR.lenses.map((x) => (
            <mesh key={x} geometry={geo.barLens} material={mats.barLens[x < 0 ? 0 : 1]} position={[x, 0.1, 0]} />
          ))}
          {[-0.5, 0.5].map((x) => (
            <mesh key={x} material={mats.barBase} position={[x, 0.005, 0]}>
              <boxGeometry args={[0.06, 0.03, 0.3]} />
            </mesh>
          ))}
        </group>
      ) : null}
      {/* the roof receiver: a magnetic base and a whip; its node dot */}
      {receiver ? (
        <>
          <mesh material={mats.trim} position={TRUCK.receiverBase}>
            <cylinderGeometry args={[0.05, 0.06, 0.03, 20]} />
          </mesh>
          <mesh
            material={mats.trim}
            position={[TRUCK.receiver[0], (TRUCK.receiver[1] + TRUCK.receiverBase[1]) / 2, TRUCK.receiver[2]]}
          >
            <cylinderGeometry args={[0.005, 0.008, TRUCK.receiver[1] - TRUCK.receiverBase[1], 8]} />
          </mesh>
          <mesh
            position={[TRUCK.receiver[0], TRUCK.receiver[1] + 0.02, TRUCK.receiver[2]]}
            material={lit ? mats.on : mats.off}
            userData={{glow: lit}}
          >
            <sphereGeometry args={[0.035, 16, 12]} />
          </mesh>
        </>
      ) : null}
    </group>
  );
};
