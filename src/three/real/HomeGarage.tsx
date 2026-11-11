import React, {useMemo} from 'react';
import * as THREE from 'three';
import {MOODS, PLUGS, REAL, section, STREET, type Mood} from '../../theme';
import {raw, roundedBox, roundedCylinder} from '../plaster';
import {cutMaterial, CutOutline, INK, type Rect} from '../section/cutLook';
import {applyAlbedo, applyEnv, useAlbedo, useEnvStrength, useStudioEnv} from './useStudioEnv';

type V3 = [number, number, number];

/*
 * No. 016 (N1): YOU's home garage as a section block, in the charge kit's bay frame (x along the garage, the car parked
 * nose in at x 0 facing −x; y up from the slab; z toward the camera, the slab's front face is the cut). Generic: no
 * brand, no text.
 *
 *  - The slab (a cut block) runs on to the right as the driveway (`driveway` m), so the car can reverse out of frame.
 *  - The back wall (door to the house, a shelf, the wall charger) and the left wall stand, cut on top and at the front;
 *    of the right wall only the back pier stands, cut at the garage door's opening (the camera's side stays open). The back wall runs on past the left wall as the house's outside
 *    wall, where the house meter hangs (its dial turns slowly; neutral, never the system).
 *  - The house door's leaf swings in (`door` 0 → 1); a dark hallway behind it (seen only through the doorway).
 *  - The wall charger (generic Level 2): a pale box with a dark face, its status LED `section.signalGreen` (`led`
 *    0 → 1, flat, never bloomed), a holster beside it on the wall.
 * Nothing here is the system: never orange.
 */

/** The garage's fixed points (bay frame, metres). */
export const GARAGE = {
  /** Interior: the left wall's inner face, the right wall's inner face, the back wall's inner face, the slab's front. */
  x0: -3.5,
  x1: 3.6,
  back: -2.2,
  front: 2.4,
  wall: 0.18,
  height: 2.7,
  /** The house door's opening (x) and height. */
  door: [-3.22, -2.36] as [number, number],
  doorH: 2.04,
  /** The garage door's opening in the right wall (z from here to the front): the right wall's pier ends at its first value. */
  opening: [-1.45, 1.45] as [number, number],
  /** The house's outside wall runs on to here (x) past the left wall. */
  outside: -5.3,
  /** The slab's depth. */
  depth: 0.6,
  /** The wall charger's box centre (on the back wall), its holster (where the plug's nose sits) and cable exit. */
  charger: [3.02, 1.32, -2.2 + 0.065] as V3,
  holster: [3.33, 1.06, -2.2 + 0.12] as V3,
  cableExit: [3.02, 1.1, -2.2 + 0.07] as V3,
  /** The house meter's dial centre (on the outside wall's face). */
  meter: [-4.45, 1.5, -2.2 + 0.09] as V3,
};

/** The hallway behind the door (seen through the doorway; back faces only). */
const HALL = {x0: -3.24, x1: -2.34, z0: -4.6, z1: -2.42, h: 2.12};

/** The meter's dial (canvas): a pale face, an arc of ticks, no numerals, no logo. */
let meterTex: THREE.CanvasTexture | null = null;
export const meterDial = () => {
  if (meterTex) return meterTex;
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 256;
  const g = c.getContext('2d')!;
  g.fillStyle = STREET.dial;
  g.beginPath();
  g.arc(128, 128, 126, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = STREET.dialInk;
  for (let i = 0; i < 40; i++) {
    const a = (i / 40) * Math.PI * 2;
    const big = i % 5 === 0;
    g.lineWidth = big ? 8 : 3;
    g.beginPath();
    g.moveTo(128 + Math.sin(a) * (big ? 90 : 102), 128 - Math.cos(a) * (big ? 90 : 102));
    g.lineTo(128 + Math.sin(a) * 114, 128 - Math.cos(a) * 114);
    g.stroke();
  }
  meterTex = new THREE.CanvasTexture(c);
  meterTex.colorSpace = THREE.SRGBColorSpace;
  meterTex.anisotropy = 8;
  return meterTex;
};

export type HomeGarageProps = {
  mood: Mood;
  /** × the ink's thickness. Default 1. */
  inkScale?: number;
  /** The house door's leaf, 0 (shut) → 1 (open, swung in ≈ 95°). */
  door?: number;
  /** The wall charger's status LED, 0 (off) → 1 (lit `signalGreen`). */
  led?: number;
  /** The house meter's pointer turn (revolutions). */
  meterTurns?: number;
  /** How far the slab runs on to the right as the driveway (m from the right wall). Default 40. */
  driveway?: number;
};

/** YOU's garage (see the file comment). */
export const HomeGarage: React.FC<HomeGarageProps> = ({mood, inkScale = 1, door = 0, led = 0, meterTurns = 0, driveway = 40}) => {
  const env = useStudioEnv();
  const envScale = useEnvStrength();
  const albedo = useAlbedo();
  const m = MOODS[mood];
  const mats = useMemo(
    () => ({
      cut: cutMaterial(),
      earth: new THREE.MeshStandardMaterial({color: raw(m.earth), roughness: 1}),
      floor: new THREE.MeshStandardMaterial({color: raw(PLUGS.garageFloor), roughness: 0.9}),
      wall: new THREE.MeshStandardMaterial({color: raw(PLUGS.garageWall), roughness: 0.92}),
      siding: new THREE.MeshStandardMaterial({color: raw(STREET.sidings[1]), roughness: 0.85}),
      door: new THREE.MeshStandardMaterial({color: raw(PLUGS.door), roughness: 0.6}),
      hall: new THREE.MeshStandardMaterial({color: raw(PLUGS.hall), roughness: 1, side: THREE.BackSide}),
      shelf: new THREE.MeshPhysicalMaterial({color: raw(PLUGS.shelf), roughness: 0.45, metalness: 0.5}),
      boxes: PLUGS.boxes.map((c) => new THREE.MeshStandardMaterial({color: raw(c), roughness: 0.85})),
      charger: new THREE.MeshPhysicalMaterial({color: raw(PLUGS.wallCharger), roughness: 0.35, clearcoat: 0.6}),
      chargerDark: new THREE.MeshPhysicalMaterial({color: raw(PLUGS.wallChargerDark), roughness: 0.4, clearcoat: 0.4}),
      led: new THREE.MeshStandardMaterial({color: raw(section.ledOff), roughness: 0.3}),
      steel: new THREE.MeshPhysicalMaterial({color: raw(REAL.steel), roughness: 0.35, metalness: 0.7}),
      meterBox: new THREE.MeshStandardMaterial({color: raw(STREET.box), roughness: 0.6}),
      dial: new THREE.MeshStandardMaterial({color: raw('#ffffff'), roughness: 0.5, map: meterDial()}),
      ink: new THREE.MeshBasicMaterial({color: raw(STREET.dialInk)}),
      glass: new THREE.MeshPhysicalMaterial({color: raw('#ffffff'), roughness: 0.05, transmission: 0, transparent: true, opacity: 0.18}),
      knob: new THREE.MeshPhysicalMaterial({color: raw(REAL.chrome), roughness: 0.25, metalness: 0.8}),
    }),
    [m.earth],
  );
  applyEnv(env, [[mats.shelf, 0.8], [mats.charger, 0.7], [mats.chargerDark, 0.5], [mats.steel, 1], [mats.knob, 1]], envScale);
  applyAlbedo([mats.floor, mats.wall, mats.siding, mats.door, ...mats.boxes], albedo);
  const k = Math.max(0, Math.min(1, led));
  mats.led.color.copy(raw(section.ledOff)).lerp(raw(section.signalGreen), k);
  mats.led.emissive.copy(raw(section.signalGreen));
  mats.led.emissiveIntensity = (1.2 * k) / m.exposure;

  const G = GARAGE;
  const H = G.height;
  const W = G.wall;
  const bz = G.back; // the back wall's inner face
  const ob = bz - W; // its outer face
  const x1 = G.x1 + driveway;
  // a wall box: [x0, x1] × [y0, y1] × [z0, z1] with per-face materials [px, nx, py, ny, pz, nz]
  const wallBox = (key: string, a: V3, b: V3, faces: THREE.Material[]) => (
    <mesh key={key} position={[(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2]} material={faces} castShadow receiveShadow>
      <boxGeometry args={[b[0] - a[0], b[1] - a[1], b[2] - a[2]]} />
    </mesh>
  );
  const {cut, wall, siding} = mats;
  const [d0, d1] = G.door;
  const o0 = G.opening[0];
  const lx0 = G.x0 - W; // the left wall's outer face
  const rx1 = G.x1 + W; // the right wall's outer face
  const rects: Rect[] = [
    // the slab: its front face and left end
    [
      [G.outside - 0.3, -G.depth, G.front],
      [x1, 0, G.front],
    ],
    [
      [G.outside - 0.3, -G.depth, ob - 0.02],
      [G.outside - 0.3, 0, G.front],
    ],
    // the wall tops
    [
      [G.outside, H, ob],
      [rx1, H, bz],
    ],
    [
      [lx0, H, bz],
      [G.x0, H, G.front],
    ],
    [
      [G.x1, H, bz],
      [rx1, H, G.opening[0]],
    ],
    // the walls' front ends (the cut) and the outside wall's left end
    [
      [lx0, 0, G.front],
      [G.x0, H, G.front],
    ],
    [
      [G.x1, 0, G.opening[0]],
      [rx1, H, G.opening[0]],
    ],
    [
      [G.outside, 0, ob],
      [G.outside, H, bz],
    ],
  ];
  const doorAng = (95 * Math.PI * Math.max(0, Math.min(1, door))) / 180;
  const mt = meterTurns * Math.PI * 2;
  return (
    <group>
      {/* the slab, running on to the right as the driveway */}
      <mesh
        position={[(G.outside - 0.3 + x1) / 2, -G.depth / 2, (G.front + ob - 0.02) / 2]}
        material={[cut, cut, mats.floor, mats.earth, cut, mats.earth]}
        receiveShadow
      >
        <boxGeometry args={[x1 - (G.outside - 0.3), G.depth, G.front - (ob - 0.02)]} />
      </mesh>
      {/* the back wall: the outside part (siding both sides), the inside part with the door's opening */}
      {wallBox('bo', [G.outside, 0, ob], [lx0, H, bz], [siding, cut, cut, siding, siding, siding])}
      {wallBox('bl', [lx0, 0, ob], [d0, H, bz], [wall, wall, cut, wall, wall, siding])}
      {wallBox('bh', [d0, G.doorH, ob], [d1, H, bz], [wall, wall, cut, wall, wall, siding])}
      {wallBox('br', [d1, 0, ob], [rx1, H, bz], [wall, wall, cut, wall, wall, siding])}
      {/* the left wall: inside face toward +x, the house side out */}
      {wallBox('l', [lx0, 0, bz], [G.x0, H, G.front], [wall, siding, cut, wall, cut, wall])}
      {/* the right wall with the garage door's opening */}
      {/* the right wall: only its back pier stands (cut at the garage door's opening), so the camera sees in */}
      {wallBox('r0', [G.x1, 0, bz], [rx1, H, o0], [siding, wall, cut, wall, cut, wall])}
      {/* the hallway behind the house door (only its inside faces) */}
      <mesh position={[(HALL.x0 + HALL.x1) / 2, HALL.h / 2 + 0.012, (HALL.z0 + HALL.z1) / 2]} material={mats.hall}>
        <boxGeometry args={[HALL.x1 - HALL.x0, HALL.h, HALL.z1 - HALL.z0]} />
      </mesh>
      {/* the house door's leaf, hinged on its left jamb, swinging into the house */}
      <group position={[d0 + 0.012, 0, bz - W / 2]} rotation={[0, doorAng, 0]}>
        <mesh geometry={roundedBox(d1 - d0 - 0.03, G.doorH - 0.02, 0.04, 0.008, 2)} material={mats.door} position={[(d1 - d0 - 0.03) / 2, (G.doorH - 0.02) / 2, 0]} castShadow receiveShadow />
        <mesh material={mats.knob} position={[d1 - d0 - 0.12, 1.0, 0.04]}>
          <sphereGeometry args={[0.03, 16, 10]} />
        </mesh>
      </group>
      {/* the shelf on the back wall, behind the car, with tubs and boxes */}
      {[1.85, 2.3].map((y) => (
        <mesh key={y} geometry={roundedBox(1.9, 0.03, 0.36, 0.008, 2)} material={mats.shelf} position={[1.15, y, bz + 0.19]} castShadow receiveShadow />
      ))}
      {[0.25, 2.05].map((x) => (
        <mesh key={x} geometry={roundedBox(0.03, 0.62, 0.03, 0.006, 2)} material={mats.shelf} position={[x, 2.06, bz + 0.36]} castShadow />
      ))}
      {(
        [
          [0.55, 1.85, 0.42, 0.26, 0],
          [1.08, 1.85, 0.36, 0.3, 1],
          [1.62, 1.85, 0.44, 0.22, 2],
          [0.7, 2.3, 0.5, 0.2, 1],
          [1.5, 2.3, 0.34, 0.24, 0],
        ] as [number, number, number, number, number][]
      ).map(([x, y, w, h, c], i) => (
        <mesh key={i} geometry={roundedBox(w, h, 0.3, 0.015, 2)} material={mats.boxes[c]} position={[x, y + 0.015 + h / 2, bz + 0.18]} castShadow receiveShadow />
      ))}
      {/* the wall charger: a pale box, its dark face, the status LED, the cable's boot; the holster beside it */}
      <group position={G.charger}>
        <mesh geometry={roundedBox(0.3, 0.4, 0.12, 0.04, 4)} material={mats.charger} castShadow receiveShadow />
        <mesh geometry={roundedBox(0.2, 0.26, 0.012, 0.03, 3)} material={mats.chargerDark} position={[0, 0.03, 0.062]} />
        <mesh material={mats.led} position={[0, 0.12, 0.07]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.016, 0.016, 0.006, 20]} />
        </mesh>
        <mesh material={mats.chargerDark} position={[0, -0.2, 0.0]}>
          <cylinderGeometry args={[0.028, 0.034, 0.06, 18]} />
        </mesh>
      </group>
      <group position={[G.holster[0], G.holster[1], bz]}>
        <mesh geometry={roundedBox(0.11, 0.13, 0.08, 0.02, 3)} material={mats.chargerDark} position={[0, 0, 0.04]} castShadow />
      </group>
      {/* the house meter on the outside wall: a grey base, the glass ring, the dial and its turning pointer */}
      <group position={[G.meter[0], G.meter[1], bz]}>
        <mesh geometry={roundedBox(0.3, 0.42, 0.06, 0.02, 3)} material={mats.meterBox} position={[0, -0.04, 0.03]} castShadow />
        <mesh geometry={roundedCylinder(0.12, 0.05, 0.01, 40)} material={mats.steel} position={[0, 0, 0.085]} rotation={[Math.PI / 2, 0, 0]} />
        <mesh material={mats.dial} position={[0, 0, 0.112]}>
          <circleGeometry args={[0.1, 40]} />
        </mesh>
        <group position={[0, 0, 0.116]} rotation={[0, 0, -mt]}>
          <mesh material={mats.ink} position={[0, 0.035, 0]}>
            <planeGeometry args={[0.012, 0.075]} />
          </mesh>
        </group>
        <mesh material={mats.glass} position={[0, 0, 0.122]}>
          <circleGeometry args={[0.112, 40]} />
        </mesh>
      </group>
      <CutOutline rects={rects} thickness={INK * inkScale} />
    </group>
  );
};
