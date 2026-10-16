import React, {useMemo} from 'react';
import * as THREE from 'three';
import {CAR, MOODS, REAL, type Mood} from '../../theme';
import {BlobShadow} from '../MuseumStage';
import {raw, roundedBox} from '../plaster';
import {CutOutline, cutMaterial, InkLine} from '../section/cutLook';
import {drawCluster} from '../../components/dashboardKit';
import {useFontsLoaded} from '../section/useFontsLoaded';
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
};

const L = CAR_LAYOUT;

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
  [0.45, L.roofCut],
  [-1.45, L.roofCut],
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
  /** Body colour: 'you' or 'mom' (theme `CAR` bodies), never red or orange. */
  body?: 'you' | 'mom';
  /** The cluster's tire-pressure light lit (warning yellow, flat; the same drawing as the dashboard detail box). */
  warning?: boolean;
};

/** The car body, cabin and fittings (see the file comment). */
export const RealCar: React.FC<RealCarProps> = ({mood, body = 'you', warning = false}) => {
  const ready = useFontsLoaded();
  const face = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 380;
    c.height = 120;
    const tx = new THREE.CanvasTexture(c);
    return {c, tx, key: '', mat: new THREE.MeshBasicMaterial({map: tx})};
  }, []);
  if (ready && face.key !== `${warning}`) {
    drawCluster(face.c.getContext('2d')!, 380, 120, {warning, speed: 38, trip: 'TRIP 12:40'});
    face.tx.needsUpdate = true;
    face.key = `${warning}`;
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
      paint: phys(CAR[mood].bodies[body], {roughness: 0.32, metalness: 0.35, clearcoat: 1, clearcoatRoughness: 0.12}),
      cut: cutMaterial(),
      trim: phys(REAL.dash, {roughness: 0.7}),
      seat: phys(REAL.seat, {roughness: 0.85}),
      carpet: phys(REAL.carpet, {roughness: 0.95}),
      glass: phys(REAL.carGlass, {roughness: 0.05, clearcoat: 1, transparent: true, opacity: 0.45, depthWrite: false}),
      chrome: phys(REAL.steel, {metalness: 1, roughness: 0.25}),
      receiver: phys(REAL.receiver, {roughness: 0.5}),
      light: phys('#dfe3e8', {roughness: 0.15, clearcoat: 1}),
    };
  }, [mood, body]);
  applyEnv(
    env,
    [
      [mats.paint, 0.8],
      [mats.glass, 1.5],
      [mats.chrome, 1],
      [mats.light, 0.8],
    ],
    envScale,
  );
  applyAlbedo([mats.paint, mats.trim, mats.seat, mats.carpet, mats.receiver], albedo);

  const geo = useMemo(
    () => ({
      body: extrude(shapeOf(BODY), -0.87, L.cutZ),
      far: extrude(shapeOf(FAR, WINDOWS), L.farZ, -0.87),
      glass: WINDOWS.map((w) => new THREE.ShapeGeometry(shapeOf(w))),
    }),
    [],
  );
  const bodyInk = useMemo(() => BODY.map(([x, y]) => [x, y, L.cutZ + 0.003] as V3), []);
  const ws = new THREE.Vector3(1.12, 1.2, 0);
  const we = new THREE.Vector3(0.45, L.roofCut, 0);
  const wLen = ws.distanceTo(we);
  const wAng = Math.atan2(we.y - ws.y, we.x - ws.x);
  const [sx, sy, sz] = L.steering;
  void m;

  return (
    <group>
      {/* the lower body: cut face (hatched) at the near cut, paint elsewhere */}
      <mesh geometry={geo.body} material={[mats.cut, mats.paint]} castShadow receiveShadow />
      <InkLine points={bodyInk} />
      {/* the far side with its windows, standing like a room's back wall; the roof rail cut on top */}
      <mesh geometry={geo.far} material={[mats.paint, mats.paint]} castShadow receiveShadow />
      {geo.glass.map((g, i) => (
        <mesh key={i} geometry={g} material={mats.glass} position={[0, 0, -0.905]} />
      ))}
      <mesh position={[-0.5, L.roofCut + 0.001, (L.farZ - 0.87) / 2]} rotation={[-Math.PI / 2, 0, 0]} material={mats.cut}>
        <planeGeometry args={[1.9, 0.08]} />
      </mesh>
      <CutOutline
        rects={[
          [
            [-1.45, L.roofCut + 0.002, L.farZ],
            [0.45, L.roofCut + 0.002, -0.87],
          ],
        ]}
      />
      {/* the windshield, cut at the roof and at the near cut */}
      <mesh
        position={[(ws.x + we.x) / 2, (ws.y + we.y) / 2, (L.cutZ - 0.87) / 2]}
        rotation={[0, 0, wAng]}
        material={mats.glass}
      >
        <boxGeometry args={[wLen, 0.012, L.cutZ + 0.87]} />
      </mesh>
      {/* head and tail lights (generic strips) */}
      <mesh position={[2.33, 0.86, 0.55]} rotation={[0, Math.PI / 2, 0]} material={mats.light}>
        <planeGeometry args={[0.36, 0.08]} />
      </mesh>
      <mesh position={[2.33, 0.86, -0.6]} rotation={[0, Math.PI / 2, 0]} material={mats.light}>
        <planeGeometry args={[0.36, 0.08]} />
      </mesh>
      {/* the cabin: carpet, dashboard (cut at the near cut), seats */}
      <mesh position={[0, L.floor + 0.003, -0.03]} rotation={[-Math.PI / 2, 0, 0]} material={mats.carpet} receiveShadow>
        <planeGeometry args={[1.74, 1.66]} />
      </mesh>
      <mesh position={[0.92, 1.08, (L.cutZ - 0.87) / 2]} material={[mats.trim, mats.trim, mats.trim, mats.trim, mats.cut, mats.trim]} castShadow receiveShadow>
        <boxGeometry args={[0.4, 0.28, L.cutZ + 0.87]} />
      </mesh>
      <CutOutline
        rects={[
          [
            [0.72, 0.94, L.cutZ],
            [1.12, 1.22, L.cutZ],
          ],
        ]}
      />
      {/* the cluster's binnacle and face (the face looks at the driver, read in the detail box) */}
      <mesh geometry={roundedBox(0.12, 0.16, 0.44, 0.02)} material={mats.trim} position={[L.cluster[0] + 0.07, L.cluster[1], L.cluster[2]]} castShadow />
      {cluster ? (
        <mesh position={[L.cluster[0] + 0.005, L.cluster[1], L.cluster[2]]} rotation={[0, -Math.PI / 2, 0]} material={cluster}>
          <planeGeometry args={[0.38, 0.12]} />
        </mesh>
      ) : null}
      {/* steering column and wheel */}
      <group position={[sx, sy, sz]} rotation={[0, 0, -0.42]}>
        <mesh rotation={[0, Math.PI / 2, 0]} material={mats.trim} castShadow>
          <torusGeometry args={[0.17, 0.018, 12, 40]} />
        </mesh>
        <mesh position={[0.11, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={mats.trim} castShadow>
          <cylinderGeometry args={[0.03, 0.04, 0.22, 16]} />
        </mesh>
        <mesh position={[0.005, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={mats.trim}>
          <cylinderGeometry args={[0.06, 0.06, 0.03, 20]} />
        </mesh>
      </group>
      {/* the receiver under the dash (its node dot is drawn by the scene) */}
      <mesh geometry={roundedBox(0.14, 0.05, 0.1, 0.008)} material={mats.receiver} position={L.receiver} castShadow />
      {[L.driver, L.passenger].map((p, i) => (
        <Seat key={i} at={p} mats={mats} />
      ))}
      {/* the rear bench on its riser */}
      <mesh geometry={roundedBox(0.55, 0.14, 1.5, 0.05, 4)} material={mats.seat} position={[-1.35, 0.92, -0.05]} castShadow receiveShadow />
      <mesh
        geometry={roundedBox(0.14, 0.62, 1.5, 0.05, 4)}
        material={mats.seat}
        position={[-1.62, 1.28, -0.05]}
        rotation={[0, 0, 0.12]}
        castShadow
        receiveShadow
      />
      <BlobShadow position={[0, 0.003, -0.05]} size={[5.4, 2.4]} opacity={0.45} />
    </group>
  );
};

/** A front seat: cushion at the figure's seat height (0.57 above its origin), back, headrest. */
const Seat: React.FC<{at: V3; mats: {seat: THREE.Material; trim: THREE.Material}}> = ({at, mats}) => {
  const [x, y, z] = at;
  return (
    <group position={[x, y, z]}>
      <mesh geometry={roundedBox(0.52, 0.12, 0.5, 0.04, 4)} material={mats.seat} position={[-0.05, 0.51, 0]} castShadow receiveShadow />
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
      <mesh geometry={roundedBox(0.1, 0.18, 0.26, 0.04, 4)} material={mats.seat} position={[-0.43, 1.4, 0]} castShadow />
    </group>
  );
};
