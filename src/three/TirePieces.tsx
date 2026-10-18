import React, {useMemo} from 'react';
import * as THREE from 'three';
import {CAST, REAL, section} from '../theme';
import {limb, raw} from './plaster';
import {SECTION_ANGLE} from './section/SectionCamera';

type V3 = [number, number, number];
const V = (p: V3) => new THREE.Vector3(...p);

/** Seconds a radio pulse ring lives (two rings, 0.15 s apart). */
export const PULSE_LIFE = 0.8;

const RING = new THREE.TorusGeometry(1, 0.035, 8, 64);

/**
 * A radio pulse (the system, § 5): two thin orange rings expanding from a point, facing the camera,
 * bloomed, fading as they grow (through the rubber). `age` is seconds since the pulse left (≤ 0 or
 * past `PULSE_LIFE`: nothing). `reach` is the final radius in world units.
 */
export const RadioPulse: React.FC<{
  position: V3;
  age: number;
  reach?: number;
  weight?: number;
  /** How much of the ring is drawn (radians), centred on the top (default 2π: whole). π: the upper half, for a source on the ground. */
  arc?: number;
}> = ({position, age, reach = 0.9, weight = 1, arc = Math.PI * 2}) => {
  const ring = useMemo(() => {
    if (arc >= Math.PI * 2 - 1e-3) return RING;
    const g = new THREE.TorusGeometry(1, 0.035, 8, 48, arc);
    g.rotateZ(Math.PI / 2 - arc / 2);
    return g;
  }, [arc]);
  const mats = useMemo(
    () =>
      [0, 1].map(
        () =>
          new THREE.MeshBasicMaterial({color: raw(section.orange), transparent: true, depthWrite: false, opacity: 0}),
      ),
    [],
  );
  const q = useMemo(
    () => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), V(SECTION_ANGLE).normalize()),
    [],
  );
  return (
    <group position={position} quaternion={q}>
      {[0, 1].map((k) => {
        const u = (age - k * 0.15) / (PULSE_LIFE - 0.15);
        const on = u > 0 && u < 1;
        const r = 0.04 + reach * (1 - Math.pow(1 - Math.max(0, Math.min(1, u)), 2));
        mats[k].opacity = on ? (1 - u) * (k === 0 ? 1 : 0.6) : 0;
        // the tube keeps its width as the ring grows (thin, like § 5's core)
        const tube = (0.018 * weight) / Math.max(0.05, r) / 0.035;
        return (
          <mesh
            key={k}
            geometry={ring}
            material={mats[k]}
            scale={[r, r, r * tube]}
            visible={on}
            userData={{glow: true}}
            renderOrder={3}
          >
            {null}
          </mesh>
        );
      })}
    </group>
  );
};

/**
 * The wire gag (No. 002, "it's hard to run a wire to a spinning wheel"): a grey cable (not the system)
 * from `from` to a turning hub, winding round it (`turns`), pulled taut as it winds (`taut` 0 → 1),
 * fading out with `opacity`. `hub` is the hub's centre, `axis` the axle direction, `coil` its radius,
 * `width` the length of hub the coil spreads along.
 */
export const WireWind: React.FC<{
  from: V3;
  hub: V3;
  axis: V3;
  coil: number;
  width?: number;
  turns: number;
  taut: number;
  opacity?: number;
  radius?: number;
}> = ({from, hub, axis, coil, width = 0.1, turns, taut, opacity = 1, radius = 0.012}) => {
  const key = [from, hub, axis, coil, width, turns.toFixed(3), taut.toFixed(3), radius].join('|');
  const geometry = useMemo(() => {
    const ax = V(axis).normalize();
    const H = V(hub);
    // two axes across the axle
    const u = new THREE.Vector3(0, 1, 0).sub(ax.clone().multiplyScalar(ax.y)).normalize();
    const w = ax.clone().cross(u).normalize();
    const pts: THREE.Vector3[] = [];
    // the coil: from the far end along the axle, round `turns` times, ending where the free run leaves
    const n = Math.max(2, Math.ceil(turns * 24));
    const coilPts: THREE.Vector3[] = [];
    for (let i = 0; i <= n; i++) {
      const k = i / n;
      const ang = -turns * Math.PI * 2 * (1 - k);
      const along = (k - 0.5) * width * Math.min(1, turns / 2);
      coilPts.push(
        H.clone()
          .addScaledVector(ax, along)
          .addScaledVector(u, Math.cos(ang) * coil)
          .addScaledVector(w, Math.sin(ang) * coil),
      );
    }
    const leave = coilPts[coilPts.length - 1];
    // the free run: a sagging curve that straightens as it gets taut
    const A = V(from);
    const sag = 0.35 * (1 - taut) * A.distanceTo(leave);
    for (let i = 0; i <= 16; i++) {
      const k = i / 16;
      const p = A.clone().lerp(leave, k);
      p.y -= Math.sin(Math.PI * k) * sag;
      pts.push(p);
    }
    const all = [...pts, ...coilPts.slice(0, -1).reverse()];
    const curve = new THREE.CatmullRomCurve3(all);
    return new THREE.TubeGeometry(curve, Math.max(32, all.length * 2), radius, 8, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  const material = useMemo(
    () => new THREE.MeshStandardMaterial({color: raw(REAL.cabinet), roughness: 0.6, transparent: true}),
    [],
  );
  material.opacity = opacity;
  return opacity > 0.01 ? <mesh geometry={geometry} material={material} castShadow /> : null;
};

/**
 * An air chuck on its hose, held by YOU's hand (cobalt sleeve, small hand, the cast's stylized look),
 * pressed onto a valve. `tip` is where the chuck meets the valve's end, `dir` points out of the valve
 * (the chuck comes in along it), `k` 0 (away, off along `dir` and `armFrom`) → 1 (on). `size` scales it
 * (1 = wheel units of a radius-1 wheel).
 */
export const AirChuck: React.FC<{tip: V3; dir: V3; armFrom: V3; k: number; size?: number; arm?: number}> = ({
  tip,
  dir,
  armFrom,
  k,
  size = 1,
  arm = 2.4,
}) => {
  const mats = useMemo(() => {
    const phys = (c: string, o: THREE.MeshPhysicalMaterialParameters = {}) =>
      new THREE.MeshPhysicalMaterial({color: raw(c), ...o});
    return {
      steel: phys(REAL.chuck, {metalness: 1, roughness: 0.32}),
      brass: phys(REAL.brass, {metalness: 1, roughness: 0.35}),
      hose: phys(REAL.hose, {roughness: 0.7}),
      sleeve: new THREE.MeshStandardMaterial({color: raw(CAST.you.top), roughness: 0.9}),
      skin: new THREE.MeshStandardMaterial({color: raw(CAST.you.skin), roughness: 0.75}),
    };
  }, []);
  const d = V(dir).normalize();
  const away = (1 - k) * 1.2 * size;
  const off = V(armFrom).normalize();
  const T = V(tip)
    .addScaledVector(d, away * 0.5)
    .addScaledVector(off, away);
  const L = 0.16 * size;
  const head = T.clone().addScaledVector(d, L / 2);
  const back = T.clone().addScaledVector(d, L);
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d);
  // the arm at the cast's scale (`arm` × the figure's metre units, ≈ 2.4 for a radius-1 wheel of 0.33 m... kept a little small)
  const hand = back.clone().addScaledVector(off, 0.02 * arm);
  const elbow = hand
    .clone()
    .addScaledVector(off, 0.42 * arm)
    .add(new THREE.Vector3(0, -0.1 * arm, 0));
  const fore = limb(hand.clone().addScaledVector(off, 0.04 * arm), elbow, 0.058 * arm);
  const hoseCurve = useMemo(
    () => new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]),
    [],
  );
  hoseCurve.points[0].copy(back);
  hoseCurve.points[1].copy(
    back
      .clone()
      .addScaledVector(d, 0.25 * size)
      .add(new THREE.Vector3(0, -0.15 * size, 0)),
  );
  hoseCurve.points[2].copy(
    back
      .clone()
      .addScaledVector(d, 0.4 * size)
      .addScaledVector(off, 0.6 * size)
      .add(new THREE.Vector3(0, -0.9 * size, 0)),
  );
  const hoseKey = hoseCurve.points
    .map((p) =>
      p
        .toArray()
        .map((x) => x.toFixed(3))
        .join(','),
    )
    .join('|');
  const hoseGeo = useMemo(
    () => new THREE.TubeGeometry(hoseCurve, 24, 0.018 * size, 8, false),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hoseKey, size],
  );
  return k > 0.001 ? (
    <group>
      <mesh position={head} quaternion={q} material={mats.steel} castShadow>
        <cylinderGeometry args={[0.032 * size, 0.026 * size, L, 24]} />
      </mesh>
      <mesh position={T.clone().addScaledVector(d, 0.012 * size)} quaternion={q} material={mats.brass}>
        <cylinderGeometry args={[0.022 * size, 0.022 * size, 0.024 * size, 20]} />
      </mesh>
      <mesh geometry={hoseGeo} material={mats.hose} castShadow />
      <mesh
        geometry={fore.geometry}
        position={fore.position}
        quaternion={fore.quaternion}
        material={mats.sleeve}
        castShadow
      />
      <mesh position={hand} material={mats.skin} castShadow>
        <sphereGeometry args={[0.045 * arm, 16, 12]} />
      </mesh>
    </group>
  ) : null;
};
