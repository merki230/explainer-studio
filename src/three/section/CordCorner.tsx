import React, {useMemo} from 'react';
import * as THREE from 'three';
import {REAL, section} from '../../theme';
import {raw, roundedBox} from '../plaster';
import {cutMaterial, InkLine} from './cutLook';
import {GlowSegment} from './GlowLines';
import type {MoodPalette} from './moods';

type V3 = [number, number, number];

/** The cord's jacket radius (a heavy household 3-wire cord, drawn a touch thick so it reads), its inside, the copper's, the insulation's. */
const R = 0.009;
const R_IN = 0.0068;
const CU = 0.0021;
const INS = 0.0031;
/** The outlet on the back wall's inner face, right of the couch (faces +z, toward the camera). */
const OUTLET: V3 = [1.56, 0.31, -1.1 + 0.003];
/** The cord hangs straight down the wall from the plug: its x and z, and the cut-away along it (y from CUT_A up to CUT_B). */
const DX = OUTLET[0];
const DZ = OUTLET[2] + 0.021;
const CUT_A = 0.07;
const CUT_B = 0.225;
/** Where the cord's socket end (a three-outlet block) lies on the floor, the cord coming in along +z. */
const BLOCK: V3 = [1.6, 0.019, -0.86];

/**
 * The extension-cord corner of the living room (No. 010), right of the couch: an outlet low on the
 * back wall, a household extension cord plugged into it that hangs down the wall and runs forward on
 * the floor to its three-outlet end, and a small ceramic fan heater plugged into that, beside the
 * couch's arm. Positions other parts need (the camera, callouts) live here.
 */
export const CORD_CORNER = {
  /** The outlet plate's centre on the back wall. */
  outlet: OUTLET,
  /** The middle of the cord's cut-away run (for a callout's leader). */
  cut: [DX, (CUT_A + CUT_B) / 2, DZ] as V3,
  /** The heater's footprint centre on the floor, and its front's yaw (0: facing +z, the camera's side). */
  heater: [1.5, 0, -0.6] as V3,
  heaterYaw: -0.2,
  /** The heater's pilot lamp (front, under the grille), for a callout. */
  lamp: [0, 0, 0] as V3,
};
/** The heater's size (a small ceramic fan heater) and its pilot lamp on its front, in the heater's own frame. */
const HW = 0.2;
const HH = 0.27;
const HD = 0.15;
const LAMP: V3 = [HW * 0.3, 0.02 + HH * 0.13, HD / 2];
{
  const [hx, , hz] = CORD_CORNER.heater;
  const c = Math.cos(CORD_CORNER.heaterYaw);
  const sn = Math.sin(CORD_CORNER.heaterYaw);
  CORD_CORNER.lamp = [hx + LAMP[0] * c + LAMP[2] * sn, LAMP[1], hz - LAMP[0] * sn + LAMP[2] * c];
}

/** One fan blade: a rounded paddle from the hub out to just inside the grille. */
const bladeShape = (() => {
  const s = new THREE.Shape();
  s.moveTo(0.008, -0.006);
  s.bezierCurveTo(0.03, -0.014, 0.058, -0.01, 0.062, 0.002);
  s.bezierCurveTo(0.06, 0.014, 0.03, 0.014, 0.008, 0.006);
  s.closePath();
  return s;
})();

/** The cut plane's normal: level, toward the camera's side (the fixed 3/4 angle, § 8), square to the hanging cord. */
const N = new THREE.Vector3(0.46, 0, 0.89).normalize();

/** Rotation that turns a part built along local +y, cut face toward local +z, onto the hanging cord, cut face toward N. */
const RUN_Q = (() => {
  const ly = new THREE.Vector3(0, 1, 0);
  const lz = N.clone();
  const lx = new THREE.Vector3().crossVectors(ly, lz);
  return new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(lx, ly, lz));
})();

export type CordCornerProps = {
  /** A blended or plain mood palette (the heater's and plug's plastics follow it). */
  palette: MoodPalette;
  /** The heater on, 0 → 1: its pilot lamp lights (flat `warning`, never glowing) and its fan spins up. */
  heater?: number;
  /** The fan's turn in seconds at full speed (the scene eases the spin-up in). */
  run?: number;
  /** The heat in the cord's conductors, 0 → 1: an `orange` glow along the copper in the cut-away run. */
  glow?: number;
};

/**
 * The corner's props (style guide § 3: realistic objects, the cut look on what is cut): the outlet,
 * the plug, the cord with its short lengthwise cut-away near the wall (jacket cut along its length,
 * cut faces in `cut` with a thin ink edge, three insulated conductors with their copper), the cord's
 * socket end, the heater's own short cord, and the heater (a light plastic body, a slatted grille with
 * its fan behind, a knob, a pilot lamp). No glowing element anywhere: the only orange is the heat in
 * the copper, the hidden system.
 */
export const CordCorner: React.FC<CordCornerProps> = ({palette, heater = 0, run = 0, glow = 0}) => {
  const mats = useMemo(() => {
    const std = (roughness: number, color?: string) =>
      new THREE.MeshStandardMaterial({roughness, metalness: 0, ...(color ? {color: raw(color)} : {})});
    return {
      jacket: std(0.6),
      jacketIn: new THREE.MeshStandardMaterial({roughness: 0.8, metalness: 0, side: THREE.BackSide}),
      plastic: std(0.45),
      dark: std(0.5),
      slot: std(0.9, REAL.rubber),
      cut: cutMaterial(),
      copper: new THREE.MeshStandardMaterial({color: raw(REAL.copper), roughness: 0.35, metalness: 0.6}),
      // the three conductors' insulation: black (hot), white (neutral), green (ground)
      insBlack: new THREE.MeshStandardMaterial({color: raw(REAL.rubber), roughness: 0.55, side: THREE.DoubleSide}),
      insWhite: new THREE.MeshStandardMaterial({roughness: 0.55, side: THREE.DoubleSide}),
      insGreen: new THREE.MeshStandardMaterial({color: raw(section.leafDark), roughness: 0.55, side: THREE.DoubleSide}),
      lampOff: new THREE.MeshBasicMaterial({color: raw(section.ledOff)}),
      lampOn: new THREE.MeshBasicMaterial({color: raw(section.warning), transparent: true}),
      fan: std(0.6),
    };
  }, []);
  // a black cord (the common one), so the cut's light faces and the copper read against it
  mats.jacket.color.copy(raw(palette.device)).multiplyScalar(1.15);
  mats.jacketIn.color.copy(raw(palette.device)).multiplyScalar(0.8);
  mats.plastic.color.copy(raw(palette.appliance));
  mats.dark.color.copy(raw(palette.device));
  mats.fan.color.copy(raw(palette.device)).multiplyScalar(1.6);
  mats.insWhite.color.copy(raw(palette.ceramic));
  const h = Math.max(0, Math.min(1, heater));
  mats.lampOn.opacity = h;

  // the cord's path: out of the plug's bottom, down the wall to the cut-away; below it, onto the floor and forward to the end block
  const geo = useMemo(() => {
    const top = new THREE.CatmullRomCurve3(
      [
        [DX, OUTLET[1] - 0.05, DZ],
        [DX, OUTLET[1] - 0.07, DZ],
        [DX, CUT_B, DZ],
      ].map((q) => new THREE.Vector3(...(q as V3))),
    );
    const bottom = new THREE.CatmullRomCurve3(
      [
        [DX, CUT_A, DZ],
        [DX, 0.045, DZ + 0.002],
        [DX + 0.003, R + 0.004, DZ + 0.04],
        [BLOCK[0] - 0.012, R, BLOCK[2] - 0.1],
        [BLOCK[0], R, BLOCK[2] - 0.035],
      ].map((q) => new THREE.Vector3(...(q as V3))),
      false,
      'catmullrom',
      0.2,
    );
    const [hx, , hz] = CORD_CORNER.heater;
    const heaterCord = new THREE.CatmullRomCurve3(
      [
        [BLOCK[0] - 0.012, 0.016, BLOCK[2] + 0.035],
        [BLOCK[0] - 0.02, 0.006, BLOCK[2] + 0.09],
        [hx + 0.01, 0.006, hz - HD / 2 - 0.08],
        [hx + 0.02, 0.03, hz - HD / 2 + 0.01],
      ].map((q) => new THREE.Vector3(...(q as V3))),
    );
    return {
      top: new THREE.TubeGeometry(top, 12, R, 14, false),
      bottom: new THREE.TubeGeometry(bottom, 80, R, 14, false),
      heaterCord: new THREE.TubeGeometry(heaterCord, 40, R * 0.75, 12, false),
    };
  }, []);

  const len = CUT_B - CUT_A;
  // the conductors in the cut: hot and neutral side by side on the cut plane, ground just behind
  const wires: {x: number; z: number; mat: THREE.Material; hot: boolean}[] = [
    {x: -0.0032, z: 0, mat: mats.insBlack, hot: true},
    {x: 0.0032, z: 0, mat: mats.insWhite, hot: true},
    {x: 0, z: -0.0036, mat: mats.insGreen, hot: false},
  ];
  const g = Math.max(0, Math.min(1, glow));
  const toWorld = (lx: number, ly: number, lz: number): V3 => {
    const v = new THREE.Vector3(lx, ly, lz).applyQuaternion(RUN_Q);
    return [v.x + DX, v.y + (CUT_A + CUT_B) / 2, v.z + DZ];
  };

  const [hx, , hz] = CORD_CORNER.heater;
  const spin = run * Math.PI * 2 * 1.9; // forward, ≈ 23° a frame: never strobes backward (5 blades)

  return (
    <group>
      {/* the outlet: a plate with two receptacles on the back wall (faces +z), the plug in the lower one */}
      <group position={CORD_CORNER.outlet}>
        <mesh geometry={roundedBox(0.072, 0.118, 0.006, 0.002)} material={mats.plastic} receiveShadow />
        {[0.026, -0.026].map((y) => (
          <group key={y} position={[0, y, 0.004]}>
            <mesh geometry={roundedBox(0.04, 0.036, 0.004, 0.006)} material={mats.plastic} />
            {[-0.0065, 0.0065].map((x) => (
              <mesh key={x} position={[x, 0.004, 0.0021]} material={mats.slot}>
                <planeGeometry args={[0.0025, 0.009]} />
              </mesh>
            ))}
            <mesh position={[0, -0.009, 0.0021]} material={mats.slot}>
              <circleGeometry args={[0.0028, 12]} />
            </mesh>
          </group>
        ))}
        {/* the plug: a moulded body on the lower receptacle, the cord leaving its bottom */}
        <mesh
          geometry={roundedBox(0.036, 0.046, 0.03, 0.006, 4)}
          material={mats.jacket}
          position={[0, -0.03, 0.019]}
          castShadow
          receiveShadow
        />
      </group>

      {/* the cord, whole except for the cut-away run */}
      <mesh geometry={geo.top} material={mats.jacket} castShadow receiveShadow />
      <mesh geometry={geo.bottom} material={mats.jacket} castShadow receiveShadow />

      {/* the cut-away run: the jacket cut along its length, its back half standing */}
      <group position={[DX, (CUT_A + CUT_B) / 2, DZ]} quaternion={RUN_Q}>
        <mesh material={mats.jacket} castShadow receiveShadow>
          <cylinderGeometry args={[R, R, len, 24, 1, true, Math.PI / 2, Math.PI]} />
        </mesh>
        <mesh material={mats.jacketIn}>
          <cylinderGeometry args={[R_IN, R_IN, len, 24, 1, true, Math.PI / 2, Math.PI]} />
        </mesh>
        {/* the jacket's cut faces (hatched like every cut face) */}
        {[-1, 1].map((s) => (
          <mesh key={s} position={[(s * (R + R_IN)) / 2, 0, 0]} material={mats.cut}>
            <planeGeometry args={[R - R_IN, len]} />
          </mesh>
        ))}
        {/* the jacket's end faces where the cut-away stops: the half ring, cut */}
        {[-1, 1].map((s) => (
          <mesh key={`e${s}`} position={[0, (s * len) / 2, 0]} rotation={[s * -Math.PI / 2, 0, 0]} material={mats.cut}>
            <ringGeometry args={[R_IN, R, 20, 1, Math.PI, Math.PI]} />
          </mesh>
        ))}
        {/* three conductors: insulation cut in half, the copper inside */}
        {wires.map((w, i) => (
          <group key={i} position={[w.x, 0, w.z]}>
            <mesh material={w.mat}>
              <cylinderGeometry args={[INS, INS, len + 0.004, 16, 1, true, Math.PI / 2, Math.PI]} />
            </mesh>
            {w.z === 0
              ? [-1, 1].map((s) => (
                  <mesh key={s} position={[(s * (INS + CU)) / 2, 0, 0.0001]} material={w.mat}>
                    <planeGeometry args={[INS - CU, len + 0.004]} />
                  </mesh>
                ))
              : null}
            <mesh material={mats.copper}>
              <cylinderGeometry args={[CU, CU, len + 0.004, 12]} />
            </mesh>
          </group>
        ))}
      </group>
      {/* thin ink along the cut's edges (scaled to the cord: the room's 0.011 would be thicker than the wires) */}
      {[-1, 1].map((s) => (
        <InkLine
          key={s}
          closed={false}
          thickness={0.0012}
          points={[toWorld(s * R, -len / 2, 0.0002), toWorld(s * R, len / 2, 0.0002)]}
        />
      ))}

      {/* the heat in the copper (the hidden system): a warm, thin orange glow along the live conductors */}
      {wires
        .filter((w) => w.hot)
        .map((w, i) => (
          <GlowSegment
            key={i}
            a={toWorld(w.x, -len / 2 - 0.001, w.z + 0.0004)}
            b={toWorld(w.x, len / 2 + 0.001, w.z + 0.0004)}
            radius={CU * 0.9}
            glow={g}
            halo={0.5 + 0.5 * g}
          />
        ))}

      {/* the cord's socket end: a three-outlet block on the floor */}
      <group position={BLOCK}>
        <mesh geometry={roundedBox(0.05, 0.038, 0.07, 0.008, 4)} material={mats.jacket} castShadow receiveShadow />
        {[-0.017, 0.017].map((z) => (
          <mesh key={z} position={[0, 0.0195, z]} rotation={[-Math.PI / 2, 0, 0]} material={mats.slot}>
            <planeGeometry args={[0.016, 0.012]} />
          </mesh>
        ))}
      </group>
      <mesh geometry={geo.heaterCord} material={mats.jacket} castShadow receiveShadow />

      {/* the heater: a small ceramic fan heater, front toward the room; no visible element */}
      <group position={[hx, 0, hz]} rotation={[0, CORD_CORNER.heaterYaw, 0]}>
        <mesh geometry={roundedBox(HW + 0.02, 0.02, HD + 0.02, 0.006, 4)} material={mats.dark} position={[0, 0.01, 0]} castShadow receiveShadow />
        <mesh geometry={roundedBox(HW, HH, HD, 0.022, 5)} material={mats.plastic} position={[0, 0.02 + HH / 2, 0]} castShadow receiveShadow />
        {/* the grille: a dark opening, the fan behind it, horizontal slats in front */}
        <group position={[0, 0.02 + HH * 0.58, HD / 2]}>
          <mesh position={[0, 0, 0.0008]} material={mats.dark}>
            <planeGeometry args={[HW * 0.78, HH * 0.6]} />
          </mesh>
          <group position={[0, 0, 0.003]} rotation={[0, 0, -spin]}>
            <mesh material={mats.fan}>
              <circleGeometry args={[0.012, 16]} />
            </mesh>
            {[0, 1, 2, 3, 4].map((k) => (
              <mesh key={k} rotation={[0, 0, (k * Math.PI * 2) / 5]} position={[0, 0, -0.0002]} material={mats.fan}>
                <shapeGeometry args={[bladeShape, 6]} />
              </mesh>
            ))}
          </group>
          {Array.from({length: 9}, (_, k) => (
            <mesh
              key={k}
              geometry={roundedBox(HW * 0.8, 0.0045, 0.008, 0.0015, 2)}
              material={mats.plastic}
              position={[0, -HH * 0.3 + (k + 0.5) * ((HH * 0.6) / 9), 0.007]}
              castShadow
            />
          ))}
        </group>
        {/* the pilot lamp, under the grille: dark until the heater runs, then flat `warning` (never glows) */}
        <mesh position={[LAMP[0], LAMP[1], LAMP[2] + 0.0008]} material={mats.lampOff}>
          <circleGeometry args={[0.0055, 16]} />
        </mesh>
        <mesh position={[LAMP[0], LAMP[1], LAMP[2] + 0.0012]} material={mats.lampOn} visible={h > 0.01}>
          <circleGeometry args={[0.0055, 16]} />
        </mesh>
        {/* the knob, on top toward the front, and the carry slot */}
        <mesh position={[HW * 0.22, 0.02 + HH + 0.008, HD * 0.18]} material={mats.dark} castShadow>
          <cylinderGeometry args={[0.016, 0.017, 0.016, 20]} />
        </mesh>
        <mesh position={[-HW * 0.12, 0.02 + HH + 0.0008, -HD * 0.1]} rotation={[-Math.PI / 2, 0, 0]} material={mats.dark}>
          <planeGeometry args={[HW * 0.42, 0.022]} />
        </mesh>
      </group>
    </group>
  );
};

