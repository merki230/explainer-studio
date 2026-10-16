import React, {useMemo} from 'react';
import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import {REAL} from '../../theme';
import {BlobShadow} from '../MuseumStage';
import {raw} from '../plaster';
import {REAL_DISPLAY, REAL_PHONE} from './RealPhone';
import {roundedPlane, roundedSlab} from './shapes';
import {applyAlbedo, applyEnv, useAlbedo, useEnvStrength, useStudioEnv} from './useStudioEnv';

type V3 = [number, number, number];
const V = (p: V3 | THREE.Vector3) => (p instanceof THREE.Vector3 ? p : new THREE.Vector3(...p));
const UP = new THREE.Vector3(0, 1, 0);

/*
 * The Lab's equipment made realistic (realism pass): a steel lab bench with an ESD mat, a row of
 * lightweight realistic test phones in clamp fixtures (instanced), industrial robot arms on a linear
 * rail (motor housings, tapered links, a cable loom, a stylus gripper), a belt conveyor with rollers,
 * a test-rig cabinet, and real wall devices for the counter and the audio meter. Neutral metals and
 * plastics; nothing orange (nothing here is the system).
 */

const geos = new Map<string, THREE.BufferGeometry>();
const memo = <T extends THREE.BufferGeometry>(key: string, make: () => T) => {
  if (!geos.has(key)) geos.set(key, make());
  return geos.get(key) as T;
};
const rbox = (w: number, h: number, d: number, r: number) =>
  memo(`rb:${w}:${h}:${d}:${r}`, () => new RoundedBoxGeometry(w, h, d, 3, r));

/** Shared materials for the Lab's equipment, made once per canvas. */
export const useLabMaterials = () => {
  const env = useStudioEnv();
  const envScale = useEnvStrength();
  const albedo = useAlbedo();
  const mats = useMemo(() => {
    const phys = (c: string, o: THREE.MeshPhysicalMaterialParameters = {}) =>
      new THREE.MeshPhysicalMaterial({color: raw(c), ...o});
    return {
      steel: phys(REAL.steel, {metalness: 1, roughness: 0.34}),
      alu: phys(REAL.alu, {metalness: 1, roughness: 0.42}),
      dark: phys(REAL.labDark, {metalness: 0.5, roughness: 0.4}),
      mat: phys(REAL.esdMat, {roughness: 0.85}),
      armShell: phys(REAL.armShell, {roughness: 0.38, clearcoat: 0.6, clearcoatRoughness: 0.25}),
      armJoint: phys(REAL.labDark, {metalness: 0.3, roughness: 0.35, clearcoat: 0.4}),
      cable: phys(REAL.cable, {roughness: 0.6}),
      rubber: phys(REAL.rubber, {roughness: 0.8}),
      belt: phys(REAL.belt, {roughness: 0.75}),
      cabinet: phys(REAL.cabinet, {metalness: 0.2, roughness: 0.5, clearcoat: 0.3}),
      vent: new THREE.MeshBasicMaterial({color: raw('#0c0d10')}),
      led: new THREE.MeshBasicMaterial({color: raw(REAL.statusLed)}),
      glass: phys('#000000', {
        roughness: 0.04,
        clearcoat: 1,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
      phoneFrame: phys(REAL.frame, {metalness: 1, roughness: 0.34}),
      phoneGlass: phys(REAL.glass, {roughness: 0.08, clearcoat: 1}),
      screw: phys(REAL.screw, {metalness: 1, roughness: 0.3}),
    };
  }, []);
  applyEnv(
    env,
    [
      [mats.steel, 1],
      [mats.alu, 0.7],
      [mats.dark, 0.6],
      [mats.armShell, 0.5],
      [mats.armJoint, 0.6],
      [mats.cabinet, 0.5],
      [mats.glass, 2.5],
      [mats.phoneFrame, 1.1],
      [mats.phoneGlass, 1],
      [mats.screw, 1],
      [mats.belt, 0.2],
      [mats.cable, 0.3],
    ],
    envScale,
  );
  applyAlbedo(
    Object.entries(mats).flatMap(([k, v]) => (k === 'glass' ? [] : [v])),
    albedo,
  );
  return mats;
};
export type LabMaterials = ReturnType<typeof useLabMaterials>;

/** A mesh spanning a → b (unit geometry along y, scaled to the length). */
const Span: React.FC<{
  a: V3 | THREE.Vector3;
  b: V3 | THREE.Vector3;
  g: THREE.BufferGeometry;
  m: THREE.Material;
  s?: V3;
}> = ({a, b, g, m, s = [1, 1, 1]}) => {
  const A = V(a);
  const d = V(b).clone().sub(A);
  const len = d.length();
  const q = new THREE.Quaternion().setFromUnitVectors(UP, d.clone().normalize());
  return (
    <mesh
      geometry={g}
      material={m}
      position={A.clone().addScaledVector(d, 0.5)}
      quaternion={q}
      scale={[s[0], len * s[1], s[2]]}
      castShadow
      receiveShadow
    />
  );
};
const UNIT_CYL = new THREE.CylinderGeometry(1, 1, 1, 20);
const UNIT_TAPER = new THREE.CylinderGeometry(0.75, 1, 1, 20);

/** Steel lab bench: square-tube frame with a cross bar, an ESD mat on a laminate top, an aluminium edge. */
export const RealBench: React.FC<{mats: LabMaterials; y: number; z: number; width: number; depth: number}> = ({
  mats,
  y,
  z,
  width,
  depth,
}) => (
  <group>
    <mesh
      geometry={rbox(width, 0.045, depth, 0.008)}
      material={mats.dark}
      position={[0, y - 0.008, z]}
      castShadow
      receiveShadow
    />
    <mesh
      geometry={rbox(width - 0.08, 0.006, depth - 0.08, 0.002)}
      material={mats.mat}
      position={[0, y + 0.017, z]}
      receiveShadow
    />
    <mesh
      geometry={rbox(width + 0.01, 0.02, 0.012, 0.004)}
      material={mats.alu}
      position={[0, y, z + depth / 2]}
      castShadow
    />
    {[-1, 1].flatMap((sx) =>
      [-1, 1].map((sz) => (
        <group key={`${sx}${sz}`} position={[sx * (width / 2 - 0.08), 0, z + sz * (depth / 2 - 0.06)]}>
          <mesh
            geometry={rbox(0.04, y - 0.03, 0.04, 0.006)}
            material={mats.steel}
            position={[0, (y - 0.03) / 2, 0]}
            castShadow
            receiveShadow
          />
          <mesh position={[0, 0.008, 0]} material={mats.rubber}>
            <cylinderGeometry args={[0.028, 0.03, 0.016, 14]} />
          </mesh>
        </group>
      )),
    )}
    {[-1, 1].map((sx) => (
      <mesh
        key={sx}
        geometry={rbox(0.03, 0.03, depth - 0.12, 0.004)}
        material={mats.steel}
        position={[sx * (width / 2 - 0.08), 0.18, z]}
        castShadow
      />
    ))}
    <mesh
      geometry={rbox(width - 0.16, 0.03, 0.03, 0.004)}
      material={mats.steel}
      position={[0, 0.18, z - depth / 2 + 0.06]}
      castShadow
    />
    {/* a power strip along the back */}
    <mesh
      geometry={rbox(1.1, 0.03, 0.05, 0.008)}
      material={mats.cabinet}
      position={[0.5, y + 0.035, z - depth / 2 + 0.05]}
      castShadow
    />
    <BlobShadow position={[0, 0.004, z]} size={[width + 0.3, depth + 0.4]} opacity={0.32} />
  </group>
);

/**
 * A row of lightweight realistic phones in clamp fixtures (instanced bodies, glass and clamps; the
 * screens stay per phone so each can show its own app). `screens` are the screen materials.
 */
export const RealPhoneRow: React.FC<{
  mats: LabMaterials;
  xs: number[];
  y: number;
  z: number;
  tilt: number;
  /** The phone's height (the stylized ones were 0.2). */
  height: number;
  children: (i: number, displayW: number, displayH: number, front: number) => React.ReactNode;
}> = ({mats, xs, y, z, tilt, height, children}) => {
  const k = height / REAL_PHONE.h;
  const inst = useMemo(() => {
    const make = (g: THREE.BufferGeometry, m: THREE.Material, place: (o: THREE.Object3D, x: number) => void) => {
      const im = new THREE.InstancedMesh(g, m, xs.length);
      const o = new THREE.Object3D();
      xs.forEach((x, i) => {
        o.position.set(0, 0, 0);
        o.rotation.set(0, 0, 0);
        o.scale.set(1, 1, 1);
        place(o, x);
        o.updateMatrix();
        im.setMatrixAt(i, o.matrix);
      });
      im.castShadow = true;
      im.receiveShadow = true;
      return im;
    };
    const body = roundedSlab(REAL_PHONE.w * k, REAL_PHONE.h * k, REAL_PHONE.d * k, REAL_PHONE.r * k, 0.014 * k);
    const glass = roundedPlane((REAL_PHONE.w - 0.014) * k, (REAL_PHONE.h - 0.014) * k, (REAL_PHONE.r - 0.007) * k);
    const clamp = new RoundedBoxGeometry(0.03, 0.05, 0.03, 2, 0.006);
    const base = new RoundedBoxGeometry(0.09, 0.02, 0.08, 2, 0.006);
    const at = (o: THREE.Object3D, x: number, dz = 0) => {
      o.position.set(x, y, z);
      o.rotation.set(tilt, 0, 0);
      o.translateZ(dz);
    };
    return [
      make(body, mats.phoneFrame, (o, x) => at(o, x, -(REAL_PHONE.d * k) / 2)),
      make(glass, mats.phoneGlass, (o, x) => at(o, x, (REAL_PHONE.d * k) / 2 + 0.0005)),
      // clamp jaws either side, and the fixture base under each phone
      make(clamp, mats.dark, (o, x) => {
        at(o, x - (REAL_PHONE.w * k) / 2 - 0.012, -0.002);
      }),
      make(clamp, mats.dark, (o, x) => {
        at(o, x + (REAL_PHONE.w * k) / 2 + 0.012, -0.002);
      }),
      make(base, mats.alu, (o, x) => {
        o.position.set(x, y - (REAL_PHONE.h * k) / 2 - 0.0, z - 0.03);
      }),
    ];
  }, [mats, xs, y, z, tilt, k]);
  const dw = REAL_DISPLAY.w * k;
  const dh = REAL_DISPLAY.h * k;
  const front = (REAL_PHONE.d * k) / 2 + 0.0012;
  return (
    <group>
      {inst.map((m, i) => (
        <primitive key={i} object={m} />
      ))}
      {xs.map((x, i) => (
        <group key={i} position={[x, y, z]} rotation={[tilt, 0, 0]}>
          {children(i, dw, dh, front)}
        </group>
      ))}
    </group>
  );
};

/**
 * An industrial robot arm hanging from a rail carriage: carriage plate with bolts, a shoulder motor
 * housing, a tapered upper link, an elbow motor, a forearm, a wrist and a stylus gripper (collet and
 * soft tip), with a cable loom from the carriage to the wrist. Joints at `shoulder`, `elbow`, `tip`.
 */
export const RealRobotArm: React.FC<{mats: LabMaterials; shoulder: V3; elbow: THREE.Vector3; tip: THREE.Vector3}> = ({
  mats,
  shoulder,
  elbow,
  tip,
}) => {
  const S = V(shoulder);
  const wrist = tip.clone().add(new THREE.Vector3(0, 0.07, 0));
  // the cable loom: a sagging curve from the carriage, past the elbow, to the wrist
  const loom = new THREE.CatmullRomCurve3([
    S.clone().add(new THREE.Vector3(0.05, 0.03, -0.03)),
    S.clone()
      .lerp(elbow, 0.5)
      .add(new THREE.Vector3(0.06, -0.01, -0.02)),
    elbow.clone().add(new THREE.Vector3(0.05, 0.0, 0.0)),
    elbow
      .clone()
      .lerp(wrist, 0.5)
      .add(new THREE.Vector3(0.045, -0.02, 0.0)),
    wrist.clone().add(new THREE.Vector3(0.03, 0.01, 0)),
  ]);
  const loomGeo = new THREE.TubeGeometry(loom, 24, 0.009, 6, false);
  const housing = (p: THREE.Vector3, r: number, len: number) => (
    <group position={p}>
      <mesh rotation={[0, 0, Math.PI / 2]} material={mats.armJoint} castShadow receiveShadow>
        <cylinderGeometry args={[r, r, len, 24]} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[(s * len) / 2 + s * 0.002, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={mats.alu}>
          <cylinderGeometry args={[r * 0.6, r * 0.6, 0.006, 20]} />
        </mesh>
      ))}
    </group>
  );
  return (
    <group>
      {/* carriage on the rail, with bolt heads */}
      <mesh
        geometry={rbox(0.13, 0.05, 0.11, 0.008)}
        material={mats.alu}
        position={[S.x, S.y + 0.035, S.z]}
        castShadow
      />
      {[-1, 1].flatMap((sx) =>
        [-1, 1].map((sz) => (
          <mesh key={`${sx}${sz}`} position={[S.x + sx * 0.045, S.y + 0.061, S.z + sz * 0.035]} material={mats.screw}>
            <cylinderGeometry args={[0.007, 0.007, 0.004, 10]} />
          </mesh>
        )),
      )}
      {housing(S, 0.05, 0.11)}
      <Span a={S} b={elbow} g={UNIT_TAPER} m={mats.armShell} s={[0.04, 1, 0.04]} />
      {housing(elbow, 0.04, 0.095)}
      <Span a={elbow} b={wrist} g={UNIT_TAPER} m={mats.armShell} s={[0.03, 1, 0.03]} />
      {/* wrist and the stylus gripper: collet, shaft, soft tip */}
      <mesh position={wrist} material={mats.armJoint} castShadow>
        <cylinderGeometry args={[0.028, 0.028, 0.035, 18]} />
      </mesh>
      <Span
        a={wrist}
        b={tip.clone().add(new THREE.Vector3(0, 0.02, 0))}
        g={UNIT_CYL}
        m={mats.steel}
        s={[0.007, 1, 0.007]}
      />
      <mesh position={tip.clone().add(new THREE.Vector3(0, 0.035, 0))} material={mats.alu} castShadow>
        <cylinderGeometry args={[0.011, 0.009, 0.02, 14]} />
      </mesh>
      <mesh position={tip.clone().add(new THREE.Vector3(0, 0.012, 0))} material={mats.rubber}>
        <sphereGeometry args={[0.008, 12, 10]} />
      </mesh>
      <mesh geometry={loomGeo} material={mats.cable} castShadow />
    </group>
  );
};

/** A linear rail: an aluminium extrusion with T-slots, end plates and wall brackets. */
export const RealRail: React.FC<{mats: LabMaterials; y: number; z: number; length: number}> = ({
  mats,
  y,
  z,
  length,
}) => (
  <group>
    <mesh
      geometry={rbox(length, 0.05, 0.07, 0.006)}
      material={mats.alu}
      position={[0, y, z]}
      castShadow
      receiveShadow
    />
    {[0.015, -0.015].map((dy) => (
      <mesh key={dy} position={[0, y + dy, z + 0.0352]} material={mats.vent}>
        <planeGeometry args={[length - 0.02, 0.006]} />
      </mesh>
    ))}
    {[-1, 1].map((s) => (
      <mesh
        key={s}
        geometry={rbox(0.03, 0.08, 0.09, 0.006)}
        material={mats.dark}
        position={[(s * length) / 2, y, z]}
        castShadow
      />
    ))}
    {[-0.9, 0, 0.9].map((x) => (
      <mesh
        key={x}
        geometry={rbox(0.04, 0.04, Math.abs(z - -1.1) - 0.02, 0.004)}
        material={mats.steel}
        position={[x, y + 0.02, (z + -1.1) / 2]}
        castShadow
      />
    ))}
  </group>
);

/** A belt conveyor from a to b: side rails, a ribbed belt (its texture runs with `t`), end rollers, legs. */
export const RealConveyor: React.FC<{
  mats: LabMaterials;
  a: THREE.Vector3;
  b: THREE.Vector3;
  t: number;
  speed: number;
}> = ({mats, a, b, t, speed}) => {
  const d = b.clone().sub(a);
  const len = d.length();
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), d.clone().normalize());
  const beltMat = useMemo(() => {
    const m = new THREE.MeshPhysicalMaterial({roughness: 0.75, map: beltTexture()});
    m.map = m.map!.clone();
    m.map.wrapT = THREE.RepeatWrapping;
    m.map.wrapS = THREE.RepeatWrapping;
    m.map.needsUpdate = true;
    return m;
  }, []);
  beltMat.color.copy(mats.belt.color);
  beltMat.map!.repeat.set(1, len / 0.12);
  beltMat.map!.offset.set(0, -(t * speed) / 0.12);
  const W = 0.12;
  return (
    <group position={a.clone().lerp(b, 0.5)} quaternion={q}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]} material={beltMat} receiveShadow>
        <planeGeometry args={[W, len]} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh
          key={s}
          geometry={rbox(0.012, 0.045, len + 0.04, 0.003)}
          material={mats.alu}
          position={[(s * (W + 0.012)) / 2, 0.01, 0]}
          castShadow
        />
      ))}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[0, 0, (s * len) / 2]} rotation={[0, 0, Math.PI / 2]} material={mats.steel} castShadow>
          <cylinderGeometry args={[0.016, 0.016, W + 0.01, 16]} />
        </mesh>
      ))}
      <mesh geometry={rbox(W, 0.02, len, 0.004)} material={mats.dark} position={[0, -0.01, 0]} receiveShadow />
    </group>
  );
};

/** The test-rig cabinet: powder-coated enclosure, vent slots, a status strip of neutral LEDs, a handle. */
export const RealRig: React.FC<{mats: LabMaterials; position: V3}> = ({mats, position}) => (
  <group position={position}>
    <mesh geometry={rbox(0.5, 0.7, 0.5, 0.02)} material={mats.cabinet} castShadow receiveShadow />
    {new Array(8).fill(0).map((_, i) => (
      <mesh key={i} position={[0, 0.2 - i * 0.03, 0.2501]} material={mats.vent}>
        <planeGeometry args={[0.32, 0.01]} />
      </mesh>
    ))}
    {[0, 1, 2, 3].map((i) => (
      <mesh key={i} position={[-0.17 + i * 0.03, -0.12, 0.2502]} material={mats.led}>
        <circleGeometry args={[0.006, 12]} />
      </mesh>
    ))}
    <mesh geometry={rbox(0.16, 0.02, 0.02, 0.008)} material={mats.steel} position={[0.08, -0.2, 0.262]} castShadow />
    <mesh geometry={rbox(0.52, 0.04, 0.52, 0.01)} material={mats.dark} position={[0, 0.37, 0]} castShadow />
    <BlobShadow position={[0, -position[1] + 0.004, 0]} size={[0.8, 0.8]} opacity={0.35} />
  </group>
);

/**
 * A wall-mounted device housing (for the counter display and the audio meter): a dark metal bezel,
 * screws, and a glass front that catches the studio reflection. The face content is the slice's.
 */
export const RealWallDevice: React.FC<{mats: LabMaterials; position: V3; size: [number, number]}> = ({
  mats,
  position,
  size,
}) => {
  const [w, h] = size;
  return (
    <group position={position}>
      <mesh geometry={rbox(w + 0.08, h + 0.08, 0.05, 0.012)} material={mats.dark} castShadow receiveShadow />
      {[-1, 1].flatMap((sx) =>
        [-1, 1].map((sy) => (
          <mesh
            key={`${sx}${sy}`}
            position={[sx * (w / 2 + 0.022), sy * (h / 2 + 0.022), 0.0255]}
            rotation={[Math.PI / 2, 0, 0]}
            material={mats.screw}
          >
            <cylinderGeometry args={[0.007, 0.007, 0.003, 12]} />
          </mesh>
        )),
      )}
      <mesh position={[0, 0, 0.034]} material={mats.glass}>
        <planeGeometry args={[w + 0.01, h + 0.01]} />
      </mesh>
    </group>
  );
};

/** Belt surface: dark rubber with cross ribs (canvas, tiles along the belt). */
let beltTex: THREE.CanvasTexture | null = null;
const beltTexture = () => {
  if (beltTex) return beltTex;
  const c = document.createElement('canvas');
  c.width = 64;
  c.height = 64;
  const cx = c.getContext('2d')!;
  cx.fillStyle = '#9a9a9a';
  cx.fillRect(0, 0, 64, 64);
  cx.fillStyle = '#5a5a5a';
  cx.fillRect(0, 26, 64, 12);
  beltTex = new THREE.CanvasTexture(c);
  return beltTex;
};

/** The housing's face area (for the slice to place its own display behind the glass). */
export const wallDeviceFace = (position: V3): V3 => [position[0], position[1], position[2] + 0.027];
