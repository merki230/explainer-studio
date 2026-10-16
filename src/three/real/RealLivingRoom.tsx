import React, {useMemo} from 'react';
import {random} from 'remotion';
import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import {REAL} from '../../theme';
import {BlobShadow} from '../MuseumStage';
import {raw} from '../plaster';
import type {MoodPalette} from '../section/moods';
import {repeated, useTextureSets, type TextureSet} from './useAssetTextures';
import {applyEnv, useEnvStrength, useStudioEnv} from './useStudioEnv';

type V3 = [number, number, number];
const GREY = new THREE.Color(0.45, 0.45, 0.45);

/*
 * The living room's objects made realistic (realism pass, owner rule "objects realistic, people
 * stylized"): same footprint and heights as the stylized ones in LivingRoomSlice (the cast still sits
 * at seat height 0.57), mood colours from the palette, CC0 texture sets (public/assets/LICENSES.md)
 * and studio reflections scaled per mood.
 */

const geos = new Map<string, THREE.BufferGeometry>();
const memo = (key: string, make: () => THREE.BufferGeometry) => {
  if (!geos.has(key)) geos.set(key, make());
  return geos.get(key)!;
};

/** A smooth rounded box; `sag` presses the top down round (sx, sz) (a cushion someone sits on). */
const cushion = (w: number, h: number, d: number, r: number, sag = 0, at: [number, number] = [0, 0]) =>
  memo(`cushion:${w}:${h}:${d}:${r}:${sag}:${at}`, () => {
    const g = new RoundedBoxGeometry(w, h, d, 6, r);
    if (sag > 0) {
      const p = g.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < p.count; i++) {
        const y = p.getY(i);
        if (y <= 0) continue;
        const dx = (p.getX(i) - at[0]) / (w * 0.32);
        const dz = (p.getZ(i) - at[1]) / (d * 0.4);
        // a soft dip, deepest in the middle of the seat, fading to nothing at the welts
        p.setY(i, y - sag * Math.exp(-(dx * dx + dz * dz)) * (y / (h / 2)));
      }
      g.computeVertexNormals();
    }
    return g;
  });

/** Piping: a thin cord round the top edge of a cushion (a rounded-rectangle loop). */
const piping = (w: number, d: number, r: number, cord: number) =>
  memo(`piping:${w}:${d}:${r}:${cord}`, () => {
    const pts: THREE.Vector3[] = [];
    const x = w / 2 - r;
    const z = d / 2 - r;
    const corner = (cx: number, cz: number, a0: number) => {
      for (let k = 0; k <= 6; k++) {
        const a = a0 + (k / 6) * (Math.PI / 2);
        pts.push(new THREE.Vector3(cx + Math.cos(a) * r, 0, cz + Math.sin(a) * r));
      }
    };
    corner(x, z, 0);
    corner(-x, z, Math.PI / 2);
    corner(-x, -z, Math.PI);
    corner(x, -z, Math.PI * 1.5);
    const curve = new THREE.CatmullRomCurve3(pts, true, 'catmullrom', 0.1);
    return new THREE.TubeGeometry(curve, 120, cord, 6, true);
  });

const Mesh: React.FC<{g: THREE.BufferGeometry; m: THREE.Material; p?: V3; r?: V3; shadow?: boolean}> = ({
  g,
  m,
  p,
  r,
  shadow = true,
}) => <mesh geometry={g} material={m} position={p} rotation={r} castShadow={shadow} receiveShadow />;

/**
 * Fabric with the herringbone weave, tinted with a mood colour; `repeat` sets the weave's scale.
 * Standard, not physical: sheen on the couch's large area doubled the frame time for little gain.
 */
const fabric = (set: TextureSet, rx: number, ry: number) =>
  new THREE.MeshStandardMaterial({
    ...repeated(set, rx, ry),
    normalScale: new THREE.Vector2(1.4, 1.4),
    roughness: 1,
  });

/** A texture set's relief and roughness without its colour (the palette colours the surface). */
const weaveOnly = (set: TextureSet, rx: number, ry: number) => {
  const t = repeated(set, rx, ry);
  return {normalMap: t.normalMap, roughnessMap: t.roughnessMap, normalScale: new THREE.Vector2(1.6, 1.6)};
};

export type RealLivingRoomProps = {
  palette: MoodPalette;
  /** Couch centre z (the slice's). */
  couchZ: number;
  table: V3;
  cup: V3;
  plant: V3;
  lamp: V3;
  /** The lamp shade's material (the slice's: lit from inside in Night). */
  shade: THREE.MeshStandardMaterial;
};

/**
 * The couch (herringbone fabric, piping, seams, slight sag where people sit, wooden legs), the
 * coffee table (ash veneer grain), a ceramic mug, the rug (jute weave with a border), a snake plant in
 * a glazed pot, and a floor lamp (metal base and stem, fabric shade). Baked contact
 * blobs under each.
 */
export const RealLivingRoom: React.FC<RealLivingRoomProps> = ({
  palette: m,
  couchZ: cz,
  table,
  cup,
  plant,
  lamp,
  shade,
}) => {
  const sets = useTextureSets(['poly_wool_herringbone', 'hessian_380', 'ash_veneer']);
  const env = useStudioEnv();
  const envScale = useEnvStrength();

  const mats = useMemo(() => {
    if (!sets) return null;
    const fab = sets.poly_wool_herringbone;
    const jute = sets.hessian_380;
    const ash = sets.ash_veneer;
    const phys = (o: THREE.MeshPhysicalMaterialParameters) => new THREE.MeshPhysicalMaterial(o);
    return {
      base: fabric(fab, 8, 1.4),
      arm: fabric(fab, 3, 2.4),
      back: fabric(fab, 8, 2.4),
      seat: fabric(fab, 3.4, 2.6),
      backCushion: fabric(fab, 3.4, 1.8),
      pipe: new THREE.MeshStandardMaterial({roughness: 0.85}),
      legWood: phys({...repeated(ash, 0.3, 1), roughness: 1}),
      top: phys({...repeated(ash, 2, 1), roughness: 1, clearcoat: 0.35, clearcoatRoughness: 0.35}),
      edge: phys({...repeated(ash, 2, 0.15), roughness: 1, clearcoat: 0.35, clearcoatRoughness: 0.35}),
      // the jute's relief and roughness only: the colour stays the palette's rug (the photo's brown is too warm)
      rug: new THREE.MeshStandardMaterial({...weaveOnly(jute, 7, 4), roughness: 1}),
      rugBorder: new THREE.MeshStandardMaterial({...weaveOnly(jute, 12, 1), roughness: 1}),
      mug: phys({roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.08}),
      coffee: phys({color: raw(REAL.coffee), roughness: 0.08, clearcoat: 1}),
      pot: phys({roughness: 0.22, clearcoat: 0.8, clearcoatRoughness: 0.15}),
      soil: new THREE.MeshStandardMaterial({color: raw(REAL.soil), roughness: 1}),
      leaf: phys({
        color: raw('#ffffff'),
        map: snakeLeafTexture(),
        roughness: 0.42,
        clearcoat: 0.35,
        clearcoatRoughness: 0.4,
        side: THREE.DoubleSide,
      }),
      metal: phys({metalness: 1, roughness: 0.32}),
    };
  }, [sets]);

  if (!mats || !sets) return null;
  // the lamp shade (the slice's material, lit from inside in Night) gets the woven fabric's relief
  if (!shade.normalMap) {
    const t = repeated(sets.hessian_380, 4, 1);
    shade.normalMap = t.normalMap;
    shade.roughnessMap = t.roughnessMap;
    shade.needsUpdate = true;
  }
  // mood colours (a blended palette renders once)
  const soft = raw(m.soft);
  const softLight = raw(m.softLight);
  // the weave image is a mid grey: lift the tint so the couch keeps the palette's value
  mats.base.color.copy(soft).multiplyScalar(1.55);
  mats.arm.color.copy(soft).multiplyScalar(1.55);
  mats.back.color.copy(soft).multiplyScalar(1.55);
  mats.seat.color.copy(softLight).multiplyScalar(1.55);
  mats.backCushion.color.copy(softLight).multiplyScalar(1.55);
  mats.pipe.color.copy(soft).multiplyScalar(0.85);
  // the veneer photo is warm: pull the tint toward grey (more under Night's warm lamp) so lit wood
  // stays out of the reserved orange band
  const cool = 0.35 + 0.4 * (1 - m.albedo);
  mats.legWood.color.copy(raw(m.wood)).lerp(GREY, cool);
  mats.top.color.copy(raw(m.wood)).lerp(GREY, cool).multiplyScalar(1.05);
  mats.edge.color.copy(raw(m.wood)).lerp(GREY, cool).multiplyScalar(1.1);
  mats.rug.color.copy(raw(m.rug));
  mats.rugBorder.color.copy(raw(m.rug)).multiplyScalar(0.8);
  mats.mug.color.copy(raw(m.ceramic));
  mats.pot.color.copy(raw(REAL.pot));
  mats.metal.color.copy(raw(m.device)).lerp(raw('#8d9096'), 0.35);
  applyEnv(
    env,
    [
      [mats.top, 0.35],
      [mats.edge, 0.35],
      [mats.mug, 0.6],
      [mats.coffee, 0.6],
      [mats.pot, 0.55],
      [mats.leaf, 0.35],
      [mats.metal, 0.9],
      [mats.seat, 0.15],
      [mats.base, 0.15],
    ],
    envScale,
  );

  const [tx, ty, tz] = table;
  const [lx, , lz] = lamp;
  return (
    <group>
      {/* couch: raised frame on wooden legs, arms, back, seat and back cushions with piping */}
      <Mesh g={cushion(2.5, 0.34, 1.0, 0.05)} m={mats.base} p={[0, 0.06 + 0.17, cz]} />
      <Mesh g={cushion(2.5, 0.74, 0.26, 0.07)} m={mats.back} p={[0, 0.06 + 0.37 + 0.02, cz - 0.4]} />
      {[-1, 1].map((s) => (
        <group key={s}>
          <Mesh g={cushion(0.26, 0.6, 1.0, 0.08)} m={mats.arm} p={[s * 1.25, 0.06 + 0.3, cz]} />
          <Mesh g={cushion(1.14, 0.16, 0.86, 0.05, 0.022, [0, 0.06])} m={mats.seat} p={[s * 0.59, 0.49, cz + 0.05]} />
          <Mesh
            g={piping(1.12, 0.84, 0.05, 0.007)}
            m={mats.pipe}
            p={[s * 0.59, 0.49 + 0.08 - 0.012, cz + 0.05]}
            shadow={false}
          />
          <Mesh
            g={cushion(1.14, 0.6, 0.16, 0.06)}
            m={mats.backCushion}
            p={[s * 0.59, 0.93, cz - 0.23]}
            r={[-0.06, 0, 0]}
          />
          {/* legs */}
          {[-0.45, 0.42].map((dz) => (
            <mesh key={dz} position={[s * 1.2, 0.03, cz + dz]} material={mats.legWood} castShadow>
              <cylinderGeometry args={[0.022, 0.016, 0.06, 12]} />
            </mesh>
          ))}
        </group>
      ))}
      <BlobShadow position={[0, 0.003, cz]} size={[2.9, 1.3]} opacity={0.42} />

      {/* coffee table: veneer top with a thin edge, tapered legs */}
      <Mesh
        g={memo('tabletop', () => new RoundedBoxGeometry(1.4, 0.05, 0.6, 3, 0.012))}
        m={mats.top}
        p={[tx, ty + 0.005, tz]}
      />
      <Mesh
        g={memo('tableedge', () => new RoundedBoxGeometry(1.36, 0.03, 0.56, 2, 0.008))}
        m={mats.edge}
        p={[tx, ty - 0.03, tz]}
      />
      {[-0.6, 0.6].flatMap((x) =>
        [-0.22, 0.22].map((dz) => (
          <mesh key={`${x}${dz}`} position={[tx + x, 0.205, tz + dz]} material={mats.legWood} castShadow receiveShadow>
            <cylinderGeometry args={[0.024, 0.015, 0.41, 14]} />
          </mesh>
        )),
      )}
      <BlobShadow position={[tx, 0.004, tz]} size={[1.7, 0.9]} opacity={0.3} />

      {/* a glazed mug with a handle and coffee in it */}
      <group position={[cup[0], ty + 0.03, cup[2]]}>
        <mesh geometry={MUG} material={mats.mug} castShadow receiveShadow />
        <mesh position={[0, 0.098, 0]} rotation={[-Math.PI / 2, 0, 0]} material={mats.coffee}>
          <circleGeometry args={[0.049, 32]} />
        </mesh>
        <mesh position={[0.066, 0.06, 0]} material={mats.mug} castShadow>
          <torusGeometry args={[0.027, 0.0075, 10, 24, Math.PI * 1.25]} />
        </mesh>
        <BlobShadow position={[0, 0.002, 0]} size={[0.2, 0.2]} opacity={0.4} />
      </group>

      {/* rug: jute weave with a darker woven border */}
      <mesh position={[0, 0.006, 0.55]} material={mats.rug} receiveShadow>
        <boxGeometry args={[1.94, 0.012, 1.09]} />
      </mesh>
      {[
        {p: [0, 0.0062, 0.55 - 0.625 + 0.04] as V3, s: [2.1, 0.0124, 0.08] as V3},
        {p: [0, 0.0062, 0.55 + 0.625 - 0.04] as V3, s: [2.1, 0.0124, 0.08] as V3},
        {p: [-1.01, 0.0062, 0.55] as V3, s: [0.08, 0.0124, 1.25] as V3},
        {p: [1.01, 0.0062, 0.55] as V3, s: [0.08, 0.0124, 1.25] as V3},
      ].map((b, i) => (
        <mesh key={i} position={b.p} material={mats.rugBorder} receiveShadow>
          <boxGeometry args={b.s} />
        </mesh>
      ))}

      {/* snake plant in a glazed pot */}
      <group position={plant}>
        <mesh geometry={POT} material={mats.pot} castShadow receiveShadow />
        <mesh position={[0, 0.29, 0]} rotation={[-Math.PI / 2, 0, 0]} material={mats.soil}>
          <circleGeometry args={[0.115, 24]} />
        </mesh>
        {LEAVES.map((l, i) => (
          <mesh
            key={i}
            geometry={l.g}
            material={mats.leaf}
            position={[l.x, 0.28, l.z]}
            rotation={[l.tilt, l.yaw, 0]}
            castShadow
            receiveShadow
          />
        ))}
        <BlobShadow position={[0, 0.003, 0]} size={[0.42, 0.42]} opacity={0.45} />
      </group>

      {/* floor lamp: weighted metal base, stem with a joint, fabric shade */}
      <mesh position={[lx, 0.012, lz]} material={mats.metal} castShadow receiveShadow>
        <cylinderGeometry args={[0.14, 0.15, 0.024, 40]} />
      </mesh>
      <mesh position={[lx, 0.65, lz]} material={mats.metal} castShadow>
        <cylinderGeometry args={[0.011, 0.013, 1.26, 16]} />
      </mesh>
      <mesh position={[lx, 0.8, lz]} material={mats.metal} castShadow>
        <cylinderGeometry args={[0.017, 0.017, 0.035, 16]} />
      </mesh>
      <mesh position={[lx, 1.38, lz]} material={shade} castShadow>
        <cylinderGeometry args={[0.16, 0.24, 0.26, 48, 1, true]} />
      </mesh>
      <BlobShadow position={[lx, 0.003, lz]} size={[0.4, 0.4]} opacity={0.4} />
    </group>
  );
};

/** The mug: a lathe profile with a wall thickness (outside up, rim, inside down). */
const MUG = new THREE.LatheGeometry(
  [
    [0, 0],
    [0.05, 0],
    [0.056, 0.006],
    [0.058, 0.1],
    [0.056, 0.106],
    [0.052, 0.104],
    [0.05, 0.02],
    [0, 0.018],
  ].map(([x, y]) => new THREE.Vector2(x, y)),
  40,
);

/** The pot: a tapered glazed planter with a rolled rim (lathe). */
const POT = new THREE.LatheGeometry(
  [
    [0, 0],
    [0.1, 0],
    [0.112, 0.02],
    [0.13, 0.27],
    [0.142, 0.285],
    [0.14, 0.305],
    [0.125, 0.3],
    [0.118, 0.28],
  ].map(([x, y]) => new THREE.Vector2(x, y)),
  40,
);

/**
 * Snake-plant leaves: tall tapered blades (a bent, slightly twisted strip), seeded heights and
 * angles, rising from the pot.
 */
const LEAVES = (() => {
  const out: {g: THREE.BufferGeometry; x: number; z: number; tilt: number; yaw: number}[] = [];
  for (let i = 0; i < 11; i++) {
    const r = (k: string) => random(`snake-${i}-${k}`);
    const hgt = 0.42 + 0.38 * r('h');
    const wid = 0.05 + 0.025 * r('w');
    const g = new THREE.PlaneGeometry(wid, hgt, 2, 14);
    const p = g.attributes.position as THREE.BufferAttribute;
    const bend = 0.06 + 0.1 * r('b');
    const twist = (r('t') - 0.5) * 0.9;
    for (let k = 0; k < p.count; k++) {
      const v = (p.getY(k) + hgt / 2) / hgt; // 0 at the base, 1 at the tip
      const taper = v < 0.75 ? 1 - 0.25 * v : (1 - v) * 3.2;
      const x = p.getX(k) * Math.max(0.02, taper);
      const a = twist * v;
      // channel: a shallow V across the blade
      const zc = -Math.abs(p.getX(k)) * 0.35 * taper;
      p.setXYZ(k, x * Math.cos(a) - zc * Math.sin(a), v * hgt, x * Math.sin(a) + zc * Math.cos(a) + bend * v * v);
    }
    g.computeVertexNormals();
    const ang = (i / 11) * Math.PI * 2 + r('a') * 0.5;
    const rad = 0.02 + 0.06 * r('r');
    out.push({g, x: Math.cos(ang) * rad, z: Math.sin(ang) * rad, tilt: (r('k') - 0.5) * 0.25, yaw: -ang + Math.PI / 2});
  }
  return out;
})();

/** Snake-plant leaf colouring: dark green with lighter cross-bands and a pale edge (canvas, seeded). */
let leafTex: THREE.CanvasTexture | null = null;
const snakeLeafTexture = () => {
  if (leafTex) return leafTex;
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 512;
  const cx = c.getContext('2d')!;
  cx.fillStyle = REAL.leafDeep;
  cx.fillRect(0, 0, 128, 512);
  for (let i = 0; i < 46; i++) {
    const y = random(`band-${i}`) * 512;
    cx.fillStyle = `rgba(150,180,120,${0.18 + 0.2 * random(`band-a-${i}`)})`;
    cx.beginPath();
    cx.ellipse(64, y, 70, 3 + 5 * random(`band-h-${i}`), (random(`band-r-${i}`) - 0.5) * 0.4, 0, Math.PI * 2);
    cx.fill();
  }
  cx.fillStyle = REAL.leafEdge;
  cx.fillRect(0, 0, 9, 512);
  cx.fillRect(119, 0, 9, 512);
  leafTex = new THREE.CanvasTexture(c);
  leafTex.anisotropy = 4;
  return leafTex;
};
