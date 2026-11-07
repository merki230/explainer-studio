import React, {useMemo} from 'react';
import * as THREE from 'three';
import {CHARGE, HIGHWAY, MOODS, PLUGS, REAL, type Mood} from '../../theme';
import {raw, roundedBox, roundedCylinder} from '../plaster';
import {cutMaterial, CutOutline, INK, type Rect} from '../section/cutLook';
import {surfaceTexture} from './ChargeSite';
import {applyAlbedo, applyEnv, useAlbedo, useEnvStrength, useStudioEnv} from './useStudioEnv';

type V3 = [number, number, number];

/*
 * No. 016 (N4): the pump island as a section block, in the charge kit's bay frame (x along the lane, the car parked at
 * x 0 facing −x, its filler door on the near rear quarter; y up; z toward the camera). A generic US pump: no brand, no
 * price sign, a dark display that never reads (F15). The hose hangs from the pump's top; the nozzle (spout, head, grip
 * and trigger guard) sits in its boot, in a hand, or in the car's filler neck (`nozzle`). The scene's extra carries it
 * with the charge kit's driver beats (`chargeMotion`'s plug and unplug, with the pump's own `DriverGeo`).
 * Nothing here is the system: never orange.
 */

/** The pump's fixed points (bay frame, metres): the island, the pump's foot, its nozzle boot (the nose's place), the hose's outlet. */
export const PUMP = {
  island: {x0: 2.72, x1: 4.62, z0: 0.52, z1: 1.62, h: 0.15},
  foot: [3.55, 0.15, 1.02] as V3,
  /** The pump body (w along x, d along z, h). */
  size: [0.78, 1.78, 0.5] as V3,
  /** The nozzle's nose in its boot (dir into the pump's face, −z). */
  boot: [3.32, 1.02, 1.35] as V3,
  /** Where the hose leaves the pump (top left of its face). */
  outlet: [3.24, 1.8, 1.3] as V3,
  /** The block's ends and its front (the cut) and back. */
  block: {x0: -11.5, x1: 5.6, front: 2.3, back: -3.0, depth: 0.6},
};

/** The nozzle's points along it (from the spout's tip, metres back along its axis and up): its grip and the hose's end. */
export const NOZZLE = {grip: [0.16, -0.1] as [number, number], tail: [0.27, 0.04] as [number, number]};

/** A nozzle pose: its spout's tip and the way it points (normalised in the xz plane by the scene). */
export type NozzlePose = {nose: V3; dir: V3};

/** The hose's end on the nozzle for a pose. */
export const nozzleTail = (p: NozzlePose): V3 => {
  const d = new THREE.Vector3(...p.dir).normalize();
  return [p.nose[0] - d.x * NOZZLE.tail[0], p.nose[1] - d.y * NOZZLE.tail[0] + NOZZLE.tail[1], p.nose[2] - d.z * NOZZLE.tail[0]];
};

/** The hose's route from the outlet to the nozzle: down off the pump, a sagging loop, into the nozzle's head. */
export const hoseRoute = (p: NozzlePose): V3[] => {
  const o = PUMP.outlet;
  const e = nozzleTail(p);
  const d = new THREE.Vector3(...p.dir).normalize();
  const back: V3 = [e[0] - d.x * 0.14, e[1] + 0.02, e[2] - d.z * 0.14];
  const low = Math.max(0.12, Math.min(o[1], e[1]) - 0.55);
  const mid: V3 = [(o[0] + back[0]) / 2 - 0.05, low, (o[2] + back[2]) / 2 + 0.12];
  return [o, [o[0] - 0.04, o[1] - 0.3, o[2] + 0.06], mid, back, e];
};

export type PumpIslandProps = {
  mood: Mood;
  inkScale?: number;
};

/** The pump section's block (asphalt, cut front and ends), the island, two bollards and the pump. */
export const PumpIsland: React.FC<PumpIslandProps> = ({mood, inkScale = 1}) => {
  const env = useStudioEnv();
  const envScale = useEnvStrength();
  const albedo = useAlbedo();
  const m = MOODS[mood];
  const B = PUMP.block;
  const mats = useMemo(() => {
    const surf = surfaceTexture('asphalt');
    surf.repeat.set((B.x1 - B.x0) / 6, 1);
    return {
      cut: cutMaterial(),
      surface: new THREE.MeshStandardMaterial({color: raw('#ffffff'), roughness: 0.92, map: surf}),
      earth: new THREE.MeshStandardMaterial({color: raw(m.earth), roughness: 1}),
      island: new THREE.MeshStandardMaterial({color: raw(CHARGE.concrete), roughness: 0.85}),
      steel: new THREE.MeshPhysicalMaterial({color: raw(HIGHWAY.galvanized), roughness: 0.4, metalness: 0.6}),
      cap: new THREE.MeshStandardMaterial({color: raw(CHARGE.cabinetDark), roughness: 0.6}),
      body: new THREE.MeshPhysicalMaterial({color: raw(PLUGS.pump), roughness: 0.38, clearcoat: 0.5, clearcoatRoughness: 0.35}),
      band: new THREE.MeshPhysicalMaterial({color: raw(PLUGS.pumpBand), roughness: 0.45, clearcoat: 0.3}),
      dark: new THREE.MeshPhysicalMaterial({color: raw(PLUGS.pumpDark), roughness: 0.4, clearcoat: 0.3}),
      screen: new THREE.MeshPhysicalMaterial({color: raw(CHARGE.screen), roughness: 0.08, clearcoat: 1}),
      key: new THREE.MeshStandardMaterial({color: raw(REAL.steel), roughness: 0.4}),
      line: new THREE.MeshStandardMaterial({color: raw(HIGHWAY.lineWhite), roughness: 0.7, polygonOffset: true, polygonOffsetFactor: -2}),
    };
  }, [B.x0, B.x1, m.earth]);
  applyEnv(env, [[mats.steel, 0.9], [mats.body, 0.7], [mats.dark, 0.5], [mats.screen, 1], [mats.band, 0.6]], envScale);
  applyAlbedo([mats.surface, mats.island, mats.body, mats.band], albedo);
  const I = PUMP.island;
  const [fx, fy, fz] = PUMP.foot;
  const [w, h, d] = PUMP.size;
  const rects: Rect[] = [
    [
      [B.x0, -B.depth, B.front],
      [B.x1, 0, B.front],
    ],
    [
      [B.x0, -B.depth, B.back],
      [B.x0, 0, B.front],
    ],
    [
      [B.x1, -B.depth, B.back],
      [B.x1, 0, B.front],
    ],
  ];
  return (
    <group>
      <mesh
        position={[(B.x0 + B.x1) / 2, -B.depth / 2, (B.front + B.back) / 2]}
        material={[mats.cut, mats.cut, mats.surface, mats.earth, mats.cut, mats.earth]}
        receiveShadow
      >
        <boxGeometry args={[B.x1 - B.x0, B.depth, B.front - B.back]} />
      </mesh>
      {/* the lane's edge line in front of the car */}
      <mesh material={mats.line} position={[-0.6, 0.0015, 1.62]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8.4, 0.1]} />
      </mesh>
      <mesh geometry={roundedBox(I.x1 - I.x0, I.h, I.z1 - I.z0, 0.04, 3)} material={mats.island} position={[(I.x0 + I.x1) / 2, I.h / 2, (I.z0 + I.z1) / 2]} castShadow receiveShadow />
      {[0.66, 1.48].map((z) => (
        <group key={z} position={[I.x1 - 0.16, I.h, z]}>
          <mesh geometry={roundedCylinder(0.065, 0.85, 0.02, 28)} material={mats.steel} position={[0, 0.425, 0]} castShadow />
          <mesh position={[0, 0.86, 0]} material={mats.cap}>
            <sphereGeometry args={[0.066, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
          </mesh>
        </group>
      ))}
      {/* the pump: a base, the body, a plain top band, the dark face panel, an unreadable display and keypad, the boot */}
      <group position={[fx, fy, fz]}>
        <mesh geometry={roundedBox(w + 0.08, 0.1, d + 0.08, 0.02, 2)} material={mats.dark} position={[0, 0.05, 0]} castShadow receiveShadow />
        <mesh geometry={roundedBox(w, h - 0.28, d, 0.05, 4)} material={mats.body} position={[0, 0.1 + (h - 0.28) / 2, 0]} castShadow receiveShadow />
        <mesh geometry={roundedBox(w + 0.04, 0.2, d + 0.04, 0.04, 3)} material={mats.band} position={[0, h - 0.08, 0]} castShadow />
        <mesh geometry={roundedBox(w - 0.16, 0.62, 0.014, 0.03, 3)} material={mats.dark} position={[0.04, 1.12, d / 2 + 0.004]} />
        <mesh material={mats.screen} position={[0.04, 1.28, d / 2 + 0.012]}>
          <planeGeometry args={[0.4, 0.17]} />
        </mesh>
        {[0, 1, 2].flatMap((r) =>
          [0, 1, 2].map((c) => (
            <mesh key={`${r}${c}`} geometry={roundedBox(0.045, 0.035, 0.01, 0.006, 2)} material={mats.key} position={[0.12 + c * 0.06, 1.04 - r * 0.05, d / 2 + 0.014]} />
          )),
        )}
        {/* the nozzle's boot on the face's left: a dark cup the spout points into */}
        <mesh geometry={roundedBox(0.16, 0.2, 0.08, 0.03, 3)} material={mats.dark} position={[PUMP.boot[0] - fx, PUMP.boot[1] - fy - 0.02, d / 2 + 0.04]} castShadow />
        {/* the hose's outlet */}
        <mesh material={mats.dark} position={[PUMP.outlet[0] - fx, PUMP.outlet[1] - fy, PUMP.outlet[2] - fz - 0.02]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 0.08, 16]} />
        </mesh>
      </group>
      <CutOutline rects={rects} thickness={INK * inkScale} />
    </group>
  );
};

export type FuelNozzleProps = {
  pose: NozzlePose;
  /** The click-off: the nozzle rocks once (0 → 1 over its 0.45 s). */
  rock?: number;
};

/**
 * The hose and the nozzle at a pose: the spout's tip at `pose.nose`, pointing along `pose.dir` (into the filler neck,
 * into the boot, or forward in a hand). `rock` tips it about the tip, once, for the click-off.
 */
export const FuelNozzle: React.FC<FuelNozzleProps> = ({pose, rock = 0}) => {
  const env = useStudioEnv();
  const envScale = useEnvStrength();
  const mats = useMemo(
    () => ({
      hose: new THREE.MeshStandardMaterial({color: raw(REAL.hose), roughness: 0.75}),
      grip: new THREE.MeshPhysicalMaterial({color: raw(PLUGS.nozzle), roughness: 0.5, clearcoat: 0.2}),
      spout: new THREE.MeshPhysicalMaterial({color: raw(PLUGS.spout), roughness: 0.3, metalness: 0.75}),
    }),
    [],
  );
  applyEnv(env, [[mats.spout, 1], [mats.grip, 0.4]], envScale);
  const pts = hoseRoute(pose);
  const key = JSON.stringify(pts.map((p) => p.map((v) => Math.round(v * 500) / 500)));
  const hoseGeo = useMemo(() => {
    const q = (JSON.parse(key) as V3[]).map((p) => new THREE.Vector3(...p));
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(q, false, 'centripetal'), 48, 0.017, 8, false);
  }, [key]);
  const d = new THREE.Vector3(...pose.dir).setY(0);
  if (d.lengthSq() < 1e-6) d.set(0, 0, -1);
  d.normalize();
  // the nozzle's own frame: +x along the spout toward the tip, y up; turned about y to the pose's direction
  const yaw = Math.atan2(-d.z, d.x);
  const rk = Math.sin(Math.PI * Math.max(0, Math.min(1, rock))) * 0.12 * Math.sin(Math.PI * 2 * Math.max(0, Math.min(1, rock)));
  return (
    <group>
      <mesh geometry={hoseGeo} material={mats.hose} castShadow />
      <group position={pose.nose} rotation={[0, yaw, 0]}>
        <group rotation={[0, 0, rk]}>
          {/* the spout: a steel tube from the tip back, angled up into the head */}
          <mesh material={mats.spout} position={[-0.07, 0.012, 0]} rotation={[0, 0, Math.PI / 2 - 0.17]}>
            <cylinderGeometry args={[0.011, 0.012, 0.15, 14]} />
          </mesh>
          {/* the head, the grip under it and the trigger guard */}
          <mesh geometry={roundedBox(0.13, 0.07, 0.06, 0.02, 3)} material={mats.grip} position={[-0.19, 0.035, 0]} castShadow />
          <mesh geometry={roundedBox(0.13, 0.035, 0.045, 0.012, 2)} material={mats.grip} position={[-0.2, -0.09, 0]} rotation={[0, 0, -0.12]} castShadow />
          <mesh geometry={roundedBox(0.025, 0.11, 0.035, 0.01, 2)} material={mats.grip} position={[-0.25, -0.03, 0]} castShadow />
          <mesh geometry={roundedBox(0.012, 0.09, 0.03, 0.005, 2)} material={mats.spout} position={[-0.135, -0.035, 0]} />
        </group>
      </group>
    </group>
  );
};
