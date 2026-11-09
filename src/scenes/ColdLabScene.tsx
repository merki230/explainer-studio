import React, {useMemo} from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import * as THREE from 'three';
import {CAST, CHARGE, CITY, EXTRA_B, HIGHWAY, LAB, MOODS, REAL, WINTER, type Mood} from '../theme';
import {raw, roundedBox} from '../three/plaster';
import {InkGauge} from '../three/real/HeatKit';
import {SlicedCar, wheelTurnRevs, type SlicedCarOptions, type SlicedCarProps} from '../three/real/SlicedCar';
import {applyAlbedo, applyEnv, useAlbedo, useEnvStrength, useStudioEnv} from '../three/real/useStudioEnv';
import {cutMaterial, CutOutline, INK, type Rect} from '../three/section/cutLook';
import {Figure} from '../three/section/Figure';
import {formatOf, SectionCamera, sectionCameraAt, type Framing} from '../three/section/SectionCamera';
import {SectionLights, SectionStage} from '../three/section/SectionStage';
import {skyTexture} from '../three/section/textures';
import {framingAtKeys, keyedValue, type CameraKey, type Keyed, type SpeedKey} from './keyframes';

type V3 = [number, number, number];

/*
 * L, The Lab · cold chamber (No. 017 `ev-winter`, N7; style guide § 3 The Lab, v0.18.11 Winter and heat parts). The Lab's
 * block scaled to a car (the teardown room's size): an insulated test cell cut open toward the camera, frost on its back
 * and left walls (`WINTER.frost` / `snowShade`), an insulated door in the left wall, two evaporator units high on the back
 * wall (`CHARGE.cabinetDark`, their fans turning), a **chassis dyno** set in the floor (a roller pair under each axle,
 * `HIGHWAY.galvanized`, turning under the car's wheels while the car stays put), restraint straps (`REAL.flex`), a
 * road-speed fan at the nose, an ink thermometer on the back wall (§ 3 In-set ink gauge, no digits). Outside the right
 * wall, through its window: the technician (an extra) at a desk, the laptop facing them. The test car is a generic EV
 * crossover in the extras' charcoal (`CITY.carBodies[0]`), a test driver (`EXTRA_B`); give it any `SlicedCar` option
 * (`hvac`, `rangeGauge`, `packCold`, …). No place label, no set counter (the counter is the overlay). Nothing here is
 * orange but what the car's options draw. Times are seconds into the scene.
 *
 * World: x along the cell (the car faces −x, centred at x 0), y up from the cell floor, z toward the camera; the floor
 * slab's front face (z = `COLD_CELL.z1`) is the cut.
 */

export const COLD_CELL = {
  x0: -4.4,
  x1: 3.6,
  z0: -2.6,
  z1: 2.4,
  wallH: 3.0,
  /** Insulated walls: thickness (two skins and a core, seen in the cut top). */
  wallT: 0.32,
  ground: 0.6,
  /** The dyno: rollers per axle at ± `rollGap` from the axle, radius, their centres' height; the pit's half size. */
  rollGap: 0.2,
  rollR: 0.15,
  pit: {x: 0.42, z: 1.15, depth: 0.42},
  /** The road-speed fan's centre (x, y), its radius. */
  fan: [-3.35, 0.75] as [number, number],
  fanR: 0.48,
  /** The technician's desk outside the right wall (x, z), the window's centre (z) and size. */
  desk: [4.25, 0.3] as [number, number],
  window: {z: 0.1, y: 1.45, w: 1.3, h: 0.8},
  /** The wall thermometer's foot (on the back wall). */
  thermo: [-0.7, 1.95, -2.6 + 0.02] as V3,
};

const AXLES = [1.35, -1.35];
const WHEEL_R = 0.36;
/** The roller centres' height: two rollers under a wheel of radius R at ± gap. */
const rollY = WHEEL_R - Math.sqrt((WHEEL_R + COLD_CELL.rollR) ** 2 - COLD_CELL.rollGap ** 2);

export type ColdLabFraming = 'chamber' | 'dynoLow' | 'dynoCabin';

export type ColdLabSceneProps = {
  durationInFrames: number;
  /** Day (default) or Night. */
  mood?: Mood;
  /**
   * The test car: any `SlicedCar` option over `{variant: 'ev', shape: 'crossover', paint: CITY.carBodies[0], driver:
   * 'extra', driverLook: EXTRA_B, nearWheels: 'whole'}`. Its `driving` (rev/s) turns its wheels and the rollers; the car
   * stays put.
   */
  car?: Partial<SlicedCarOptions>;
  /** The rollers' (and the wheels') speed keys, rev/s of the car's wheels. Default standing; the car's own `driving` wins. */
  driving?: SpeedKey[];
  /** The evaporator fans' speed, 0 → 1 (constant or keys). Default 0. */
  fans?: Keyed;
  /** The road-speed fan's speed, 0 → 1 (constant or keys). Default: with the rollers. */
  noseFan?: Keyed;
  /** Frost on the cell's walls, 0 → 1 (constant or keys: it spreads). Default 0.5. */
  frost?: Keyed;
  /** The wall thermometer's fill, 0 → 1 (constant or keys). Default 0.3. Null: none. */
  thermometer?: Keyed | null;
  /** The technician's taps on the laptop (s). Default none. The technician: false for none. */
  technician?: {taps?: number[]} | false;
  framing?: ColdLabFraming;
  camera?: {from: Framing; to?: Framing};
  cameraKeys?: CameraKey[];
  /** Push toward the subject, units/s (default 0.05). */
  push?: number;
  drift?: number;
  location?: string;
  transition?: 'auto' | 'continue' | 'glide' | 'cut' | 'dissolve' | 'slide' | 'follow';
  glide?: number;
  cameraFrom?: Framing;
  cameraGlide?: number;
  startFrame?: number;
};

/**
 * The framings (world; set on test stills). 'chamber': the cell whole, the technician at the right; 'dynoLow': the car
 * low in the frame under a top-left counter; 'dynoCabin': the car's pack, HVAC box and the test driver.
 */
export const COLD_LAB_FRAMINGS: Record<ColdLabFraming, Framing> = {
  chamber: {look: [1.0, 1.2, 0.0], distance: 27},
  dynoLow: {look: [-0.2, 2.35, 0.0], distance: 17},
  dynoCabin: {look: [-0.45, 0.95, 0.55], distance: 5.2},
};

const coldMove = (p: Partial<ColdLabSceneProps>, d: number, fps: number, frame?: number) => {
  const preset = COLD_LAB_FRAMINGS[p.framing ?? 'chamber'];
  if (p.cameraKeys && p.cameraKeys.length) {
    const base = p.camera?.from ?? preset;
    const f = framingAtKeys(p.cameraKeys, base, frame === undefined ? Infinity : frame / fps);
    return {from: f, to: f, pre: undefined};
  }
  const pre =
    p.cameraGlide && p.cameraFrom ? {from: p.cameraFrom, hold: 0, move: Math.max(1, Math.round(p.cameraGlide * fps)), ease: 'cubic' as const} : undefined;
  if (p.camera) return {from: p.camera.from, to: p.camera.to ?? p.camera.from, pre};
  const secs = Math.max(0, d - (pre ? pre.move : 0)) / fps;
  const c = pre ? undefined : p.cameraFrom;
  const same = c && c.look.every((v, i) => Math.abs(v - preset.look[i]) < 1e-6);
  const from = c && same ? c : preset;
  return {from, to: {look: from.look, distance: from.distance - (p.push ?? 0.05) * secs}, pre};
};

export const coldLabCameraStart = (p: Partial<ColdLabSceneProps>, d: number, fps: number): Framing =>
  coldMove({...p, cameraFrom: undefined, cameraGlide: undefined}, d, fps, 0).from;
export const coldLabCameraEnd = (p: Partial<ColdLabSceneProps>, d: number, fps: number): Framing => coldMove(p, d, fps).to;

const carOf = (p: Partial<ColdLabSceneProps>): Partial<SlicedCarProps> => ({
  variant: 'ev',
  shape: 'crossover',
  paint: CITY.carBodies[0],
  driver: 'extra',
  driverLook: EXTRA_B,
  nearWheels: 'whole',
  driving: p.driving ?? [{at: 0, speed: 0}],
  clusterSpeed: 'auto',
  clusterBlank: true,
  ...(p.car ?? {}),
  ground: false,
  road: 'street',
});

/** A turn (rad) from 0 → 1 speed keys at `revs` rev/s, fixed steps (deterministic). */
const turnOf = (k: Keyed | undefined, t: number, revs: number, fps: number) => {
  if (k === undefined) return 0;
  let a = 0;
  for (let x = 0; x < t; x += 1 / fps) a += Math.max(0, Math.min(1, keyedValue(k, x + 0.5 / fps, 0))) * Math.min(1 / fps, t - x);
  return a * revs * 2 * Math.PI;
};

/** N7: the cold chamber (see the file comment). */
export const ColdLabScene: React.FC<ColdLabSceneProps> = (props) => {
  const {durationInFrames, mood = 'day', startFrame = 0} = props;
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const {from, to, pre} = coldMove(props, durationInFrames, fps, frame);
  const cam = sectionCameraAt({from, to, pre, frame, fps, durationInFrames, drift: props.drift ?? 0, clockOffset: startFrame / fps, format: formatOf(props)});
  const camD = cam.position.distanceTo(cam.look);
  const inkK = Math.max(0.15, Math.min(4, camD / 12.75));
  return (
    <AbsoluteFill>
      <SectionStage mood={mood} post={{focusY: 0.5, aoRadius: 0.3}} ao far={200}>
        <SectionCamera from={from} to={to} pre={pre} durationInFrames={durationInFrames} drift={props.drift ?? 0} clockOffset={startFrame / fps} fitClip farMin={120} />
        <SectionLights mood={mood} target={[0, 0.8, 0]} lamp={0} />
        <ColdLabWorld {...props} mood={mood} t={t} fps={fps} camD={camD} inkK={inkK} />
      </SectionStage>
    </AbsoluteFill>
  );
};

/** The cell's contents (inside the Canvas: the studio-env hooks need it). */
const ColdLabWorld: React.FC<ColdLabSceneProps & {mood: Mood; t: number; fps: number; camD: number; inkK: number}> = (props) => {
  const {mood, t, fps, camD, inkK, startFrame = 0} = props;
  const m = MOODS[mood];
  const lab = LAB[mood];
  const C = COLD_CELL;
  const env = useStudioEnv();
  const envScale = useEnvStrength();
  const albedo = useAlbedo();
  const mats = useMemo(() => {
    const std = (c: string, r = 0.9) => new THREE.MeshStandardMaterial({color: raw(c), roughness: r});
    return {
      cut: cutMaterial(),
      earth: std(m.earth, 1),
      floor: std(lab.floor, 0.95),
      wall: std(lab.rig, 0.95),
      pit: std(REAL.labDark, 0.9),
      frost: new THREE.MeshStandardMaterial({color: raw(WINTER.frost), roughness: 0.95, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2}),
      frostShade: new THREE.MeshStandardMaterial({color: raw(WINTER.snowShade), roughness: 0.95, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -3}),
      dark: new THREE.MeshPhysicalMaterial({color: raw(CHARGE.cabinetDark), roughness: 0.5, metalness: 0.2}),
      roller: new THREE.MeshPhysicalMaterial({color: raw(HIGHWAY.galvanized), roughness: 0.35, metalness: 0.7}),
      stripe: new THREE.MeshStandardMaterial({color: raw(REAL.labDark), roughness: 0.6}),
      strap: new THREE.MeshStandardMaterial({color: raw(REAL.flex), roughness: 0.8}),
      glass: new THREE.MeshPhysicalMaterial({color: raw(WINTER.frost), roughness: 0.15, metalness: 0, transparent: true, opacity: 0.22}),
      desk: std(lab.bench, 0.7),
      laptop: new THREE.MeshPhysicalMaterial({color: raw(REAL.frame), roughness: 0.4, metalness: 0.6}),
      screen: new THREE.MeshBasicMaterial({color: raw(REAL.panelOff)}),
      sky: new THREE.MeshBasicMaterial({map: skyTexture(mood), fog: false}),
    };
  }, [m, lab, mood]);
  mats.sky.color.setScalar(1 / m.exposure);
  applyEnv(env, [[mats.roller, 1], [mats.dark, 0.6], [mats.laptop, 0.8]], envScale);
  applyAlbedo([mats.floor, mats.wall, mats.desk], albedo);
  const frostK = Math.max(0, Math.min(1, keyedValue(props.frost, t, 0.5)));
  mats.frost.opacity = 0.85 * frostK;
  mats.frostShade.opacity = 0.6 * frostK;

  // ---- the car and the rollers
  const car = carOf(props);
  const drv = car.driving ?? [{at: 0, speed: 0}];
  const wheelTurn = wheelTurnRevs(car, t, fps) * 2 * Math.PI;
  // the rollers' tops move with the tire's tread (backward under a car facing −x: +x), so they turn opposite the wheel
  const rollAngle = -(wheelTurn * WHEEL_R) / C.rollR;
  const noseFanK = props.noseFan !== undefined ? props.noseFan : drv.map((k) => ({at: k.at, value: Math.min(1, k.speed / 6)}));
  const noseTurn = turnOf(noseFanK, t, 1.2, fps);
  const fanTurn = turnOf(props.fans ?? 0, t, 1.4, fps);

  // ---- walls (insulated: the cut top shows two skins and the core)
  const W = C.wallT;
  const ink = INK * inkK;
  const rects: Rect[] = [
    [
      [C.x0 - W, -C.ground, C.z1],
      [C.x1 + W, 0, C.z1],
    ],
    [
      [C.x1 + W, -C.ground, C.z0 - W],
      [C.x1 + W, 0, C.z1],
    ],
    [
      [C.x0 - W, 0, C.z1],
      [C.x0, C.wallH, C.z1],
    ],
    [
      [C.x1, 0, C.z1],
      [C.x1 + W, C.wallH, C.z1],
    ],
  ];
  const top: V3[] = [
    [C.x0 - W, C.wallH, C.z1],
    [C.x0 - W, C.wallH, C.z0 - W],
    [C.x1 + W, C.wallH, C.z0 - W],
    [C.x1 + W, C.wallH, C.z1],
    [C.x1, C.wallH, C.z1],
    [C.x1, C.wallH, C.z0],
    [C.x0, C.wallH, C.z0],
    [C.x0, C.wallH, C.z1],
  ];
  const edges = top.map((q, i) => [q, top[(i + 1) % top.length]] as [V3, V3]);
  // the floor around the two pits (pieces)
  const P = C.pit;
  const floorPieces: [number, number, number, number][] = [
    [C.x0, AXLES[1] - P.x, C.z0, C.z1],
    [AXLES[1] + P.x, AXLES[0] - P.x, C.z0, C.z1],
    [AXLES[0] + P.x, C.x1, C.z0, C.z1],
    ...AXLES.flatMap((ax) => [
      [ax - P.x, ax + P.x, C.z0, -P.z] as [number, number, number, number],
      [ax - P.x, ax + P.x, P.z, C.z1] as [number, number, number, number],
    ]),
  ];
  const tech = props.technician === false ? null : (props.technician ?? {});
  const tap = (tech?.taps ?? []).reduce((a, k) => Math.max(a, t > k && t < k + 0.3 ? Math.sin(((t - k) / 0.3) * Math.PI) : 0), 0);
  const [dx, dz] = C.desk;
  // frost patches on the back and left walls (seeded, fixed; they show with `frost`)
  const patches = useMemo(
    () =>
      [...Array(9).keys()].map((i) => {
        const r = (k: string) => {
          const v = Math.sin((i + 1) * 12.9898 + k.length * 78.233) * 43758.5453;
          return v - Math.floor(v);
        };
        return {x: C.x0 + 0.4 + r('x') * (C.x1 - C.x0 - 0.8), y: 0.3 + r('yy') * 2.3, w: 0.6 + r('www') * 1.1, h: 0.3 + r('hhhh') * 0.5};
      }),
    [C.x0, C.x1],
  );
  return (
    <>
        <mesh position={[0, 8, -40]} material={mats.sky}>
          <planeGeometry args={[160, 90]} />
        </mesh>
        {/* the cut block under the cell, the floor in pieces round the dyno's pits, the pits */}
        <mesh position={[(C.x0 + C.x1) / 2, -C.ground / 2 - 0.001, (C.z0 - W + C.z1) / 2]} material={[mats.cut, mats.earth, mats.earth, mats.earth, mats.cut, mats.earth]} receiveShadow>
          <boxGeometry args={[C.x1 - C.x0 + 2 * W, C.ground - 0.002, C.z1 - C.z0 + W]} />
        </mesh>
        {floorPieces.map(([a, b, c, d], i) => (
          <mesh key={i} position={[(a + b) / 2, -0.005, (c + d) / 2]} material={mats.floor} receiveShadow>
            <boxGeometry args={[b - a, 0.01, d - c]} />
          </mesh>
        ))}
        {AXLES.map((ax) => (
          <mesh key={ax} position={[ax, -P.depth / 2, 0]} material={mats.pit} receiveShadow>
            <boxGeometry args={[2 * P.x, P.depth, 2 * P.z]} />
          </mesh>
        ))}
        {/* the rollers: a pair under each axle, across the car, turning with the tread */}
        {AXLES.flatMap((ax) =>
          [-1, 1].map((sd) => (
            <group key={`${ax}${sd}`} position={[ax + sd * C.rollGap, rollY, 0]} rotation={[0, 0, rollAngle]}>
              <mesh material={mats.roller} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[C.rollR, C.rollR, 2 * P.z - 0.06, 32]} />
              </mesh>
              {/* a dark stripe along it, so the turn reads */}
              <mesh material={mats.stripe} position={[0, C.rollR + 0.001, 0]}>
                <boxGeometry args={[0.03, 0.004, 2 * P.z - 0.04]} />
              </mesh>
            </group>
          )),
        )}
        {/* the walls: back and left (insulated, cut on top), the right wall with its window, cut at the front */}
        <mesh position={[(C.x0 + C.x1) / 2, C.wallH / 2, C.z0 - W / 2]} material={[mats.cut, mats.cut, mats.cut, mats.cut, mats.wall, mats.wall]} castShadow receiveShadow>
          <boxGeometry args={[C.x1 - C.x0 + 2 * W, C.wallH, W]} />
        </mesh>
        <mesh position={[C.x0 - W / 2, C.wallH / 2, (C.z0 + C.z1) / 2]} material={[mats.wall, mats.wall, mats.cut, mats.cut, mats.cut, mats.cut]} castShadow receiveShadow>
          <boxGeometry args={[W, C.wallH, C.z1 - C.z0]} />
        </mesh>
        <RightWall mats={mats} />
        <CutOutline rects={rects} edges={edges} thickness={ink} />
        {/* the insulation's two skins in the cut tops (ink lines inside the wall's thickness) */}
        <CutOutline
          edges={[
            [
              [C.x0 - W * 0.82, C.wallH + 0.002, C.z1],
              [C.x0 - W * 0.82, C.wallH + 0.002, C.z0 - W * 0.82],
            ],
            [
              [C.x0 - W * 0.82, C.wallH + 0.002, C.z0 - W * 0.82],
              [C.x1 + W * 0.82, C.wallH + 0.002, C.z0 - W * 0.82],
            ],
            [
              [C.x0 - W * 0.18, C.wallH + 0.002, C.z1],
              [C.x0 - W * 0.18, C.wallH + 0.002, C.z0 - W * 0.18],
            ],
            [
              [C.x0 - W * 0.18, C.wallH + 0.002, C.z0 - W * 0.18],
              [C.x1 + W * 0.18, C.wallH + 0.002, C.z0 - W * 0.18],
            ],
          ]}
          thickness={ink * 0.6}
        />
        {/* frost: a film over the back and left walls, heavier patches */}
        <mesh position={[(C.x0 + C.x1) / 2, C.wallH / 2, C.z0 + 0.004]} material={mats.frost}>
          <planeGeometry args={[C.x1 - C.x0, C.wallH]} />
        </mesh>
        <mesh position={[C.x0 + 0.004, C.wallH / 2, (C.z0 + C.z1) / 2]} rotation={[0, Math.PI / 2, 0]} material={mats.frost}>
          <planeGeometry args={[C.z1 - C.z0, C.wallH]} />
        </mesh>
        {patches.map((q, i) => (
          <mesh key={i} geometry={roundedBox(q.w, q.h, 0.004, Math.min(q.w, q.h) * 0.45, 4)} position={[q.x, q.y, C.z0 + 0.008]} material={mats.frostShade} />
        ))}
        {/* the insulated door in the left wall (a thick leaf, its handle) */}
        <mesh geometry={roundedBox(0.08, 2.1, 1.1, 0.02)} position={[C.x0 + 0.04, 1.05, -0.9]} material={mats.wall} castShadow />
        <mesh geometry={roundedBox(0.06, 0.04, 0.22, 0.01)} position={[C.x0 + 0.1, 1.05, -0.5]} material={mats.dark} />
        {/* the evaporator units high on the back wall, their fans turning */}
        {[-2.2, 0.8].map((x) => (
          <group key={x} position={[x, 2.45, C.z0 + 0.22]}>
            <mesh geometry={roundedBox(1.5, 0.5, 0.42, 0.04)} material={mats.dark} castShadow />
            {[-0.38, 0.38].map((fx) => (
              <group key={fx} position={[fx, 0, 0.215]} rotation={[0, 0, fanTurn + fx]}>
                {[0, 1, 2, 3, 4].map((b) => (
                  <mesh key={b} position={[Math.cos((b / 5) * Math.PI * 2) * 0.09, Math.sin((b / 5) * Math.PI * 2) * 0.09, 0]} rotation={[0, 0, (b / 5) * Math.PI * 2]} material={mats.roller}>
                    <boxGeometry args={[0.15, 0.05, 0.006]} />
                  </mesh>
                ))}
              </group>
            ))}
          </group>
        ))}
        {/* the road-speed fan at the nose: a square housing on a stand, the blades turning */}
        <group position={[C.fan[0], 0, 0.1]}>
          <mesh geometry={roundedBox(0.3, 0.4, 0.7, 0.03)} position={[0, 0.2, 0]} material={mats.dark} castShadow />
          <group position={[0, C.fan[1], 0]} rotation={[0, Math.PI / 2, 0]}>
            <mesh material={mats.dark} castShadow>
              <torusGeometry args={[C.fanR + 0.04, 0.05, 10, 40]} />
            </mesh>
            <group rotation={[0, 0, noseTurn]}>
              {[0, 1, 2, 3, 4, 5].map((b) => (
                <mesh key={b} position={[Math.cos((b / 6) * Math.PI * 2) * C.fanR * 0.5, Math.sin((b / 6) * Math.PI * 2) * C.fanR * 0.5, 0]} rotation={[0.3, 0, (b / 6) * Math.PI * 2]} material={mats.roller}>
                  <boxGeometry args={[C.fanR * 0.85, 0.13, 0.01]} />
                </mesh>
              ))}
              <mesh material={mats.dark} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.08, 0.08, 0.1, 18]} />
              </mesh>
            </group>
          </group>
        </group>
        {/* the restraint straps: tow points → floor anchors, front and rear */}
        {(
          [
            [
              [-2.15, 0.36, 0.62],
              [-2.85, 0.01, 1.05],
            ],
            [
              [2.2, 0.38, 0.62],
              [2.9, 0.01, 1.05],
            ],
          ] as [V3, V3][]
        ).map(([a, b], i) => {
          const va = new THREE.Vector3(...a);
          const vb = new THREE.Vector3(...b);
          const mid = va.clone().add(vb).multiplyScalar(0.5);
          const len = va.distanceTo(vb);
          const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), vb.clone().sub(va).normalize());
          return (
            <group key={i}>
              <mesh position={mid} quaternion={q} material={mats.strap}>
                <boxGeometry args={[0.05, len, 0.008]} />
              </mesh>
              <mesh position={b} material={mats.dark}>
                <boxGeometry args={[0.1, 0.03, 0.1]} />
              </mesh>
            </group>
          );
        })}
        {/* the test car, staying put on the rollers */}
        <SlicedCar {...(car as SlicedCarProps)} mood={mood} startFrame={startFrame} cameraDistance={camD} />
        {/* the wall thermometer (ink, no digits) */}
        {props.thermometer === null ? null : (
          <InkGauge kind="thermo" level={keyedValue(props.thermometer, t, 0.3)} at={C.thermo} height={0.6} mood={mood} k={Math.max(1, Math.min(3, camD / 6))} />
        )}
        {/* outside the right wall: the desk, the laptop facing the technician, the technician looking in */}
        {tech ? (
          <group>
            <mesh geometry={roundedBox(0.7, 0.04, 1.0, 0.01)} position={[dx - 0.15, 0.74, dz]} material={mats.desk} castShadow receiveShadow />
            {[-0.42, 0.42].map((z) => (
              <mesh key={z} position={[dx - 0.15, 0.37, dz + z]} material={mats.dark}>
                <boxGeometry args={[0.04, 0.74, 0.04]} />
              </mesh>
            ))}
            <group position={[dx - 0.2, 0.765, dz]}>
              <mesh geometry={roundedBox(0.24, 0.012, 0.32, 0.004)} material={mats.laptop} />
              {/* the lid, its screen toward the technician (+x) */}
              <group position={[-0.12, 0.0, 0]} rotation={[0, 0, -0.32]}>
                <mesh geometry={roundedBox(0.008, 0.22, 0.32, 0.003)} position={[0, 0.11, 0]} material={mats.laptop} />
                <mesh position={[0.005, 0.11, 0]} rotation={[0, Math.PI / 2, 0]} material={mats.screen}>
                  <planeGeometry args={[0.29, 0.19]} />
                </mesh>
              </group>
            </group>
            <Figure
              who="extra"
              mood={mood}
              look={CAST.extra}
              position={[dx + 0.3, 0, dz]}
              rotationY={-Math.PI / 2}
              stance="stand"
              phone={false}
              hands={[
                [-0.12, 0.8 + 0.02 * tap, 0.42 - 0.02 * tap],
                [0.12, 0.8, 0.42],
              ]}
              clockOffset={startFrame / fps}
            />
          </group>
        ) : null}
    </>
  );
};

/** The right wall (insulated, cut at the front and on top) with its window toward the technician. */
const RightWall: React.FC<{mats: {wall: THREE.Material; cut: THREE.Material; glass: THREE.Material; dark: THREE.Material}}> = ({mats}) => {
  const C = COLD_CELL;
  const W = C.wallT;
  const wz0 = C.window.z - C.window.w / 2;
  const wz1 = C.window.z + C.window.w / 2;
  const wy0 = C.window.y - C.window.h / 2;
  const wy1 = C.window.y + C.window.h / 2;
  const x = C.x1 + W / 2;
  const piece = (z0: number, z1: number, y0: number, y1: number, key: string) => (
    <mesh key={key} position={[x, (y0 + y1) / 2, (z0 + z1) / 2]} material={[mats.wall, mats.wall, mats.cut, mats.cut, mats.cut, mats.cut]} castShadow receiveShadow>
      <boxGeometry args={[W, y1 - y0, z1 - z0]} />
    </mesh>
  );
  return (
    <group>
      {piece(C.z0 - W, wz0, 0, C.wallH, 'a')}
      {piece(wz1, C.z1, 0, C.wallH, 'b')}
      {piece(wz0, wz1, 0, wy0, 'c')}
      {piece(wz0, wz1, wy1, C.wallH, 'd')}
      <mesh position={[x, C.window.y, C.window.z]} rotation={[0, Math.PI / 2, 0]} material={mats.glass}>
        <planeGeometry args={[C.window.w, C.window.h]} />
      </mesh>
    </group>
  );
};
