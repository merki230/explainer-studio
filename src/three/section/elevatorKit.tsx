import React, {useMemo} from 'react';
import {random} from 'remotion';
import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import {MOODS, REAL, section, TOWER, type Mood} from '../../theme';
import {raw, roundedCylinder} from '../plaster';
import {roundedPlane, roundedSlab} from '../real/shapes';
import {applyEnv, useEnvStrength, useStudioEnv} from '../real/useStudioEnv';

type V3 = [number, number, number];

/*
 * The elevator close-up kit (No. 003 rework, "focus objects realistic"): the parts the camera gets
 * close to, built from real proportions and materials. A hall call station (brushed faceplate, bevels,
 * security screws, stainless buttons with engraved arrows, the lit ring in `warning` yellow, flat),
 * the hall lantern, realistic landing door frames and sills, the car's operating panel with its
 * display, the group-controller cabinet (door open, boards, DIN rails, ducts, wiring, status LEDs) and
 * the hotel's destination keypad. Nothing here is orange: none of it is the hidden system.
 */

// ---------------------------------------------------------------- textures (canvas, seeded)

const geos = new Map<string, THREE.BufferGeometry>();
const memo = <T extends THREE.BufferGeometry>(key: string, make: () => T): T => {
  if (!geos.has(key)) geos.set(key, make());
  return geos.get(key) as T;
};
const rbox = (w: number, h: number, d: number, r: number) =>
  memo(
    `rb:${w}:${h}:${d}:${r}`,
    () => new RoundedBoxGeometry(w, h, d, 3, Math.min(r, w / 2 - 1e-4, h / 2 - 1e-4, d / 2 - 1e-4)),
  );

const canvasTex = (
  w: number,
  h: number,
  draw: (cx: CanvasRenderingContext2D) => void,
  repeat: [number, number] = [1, 1],
) => {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  draw(c.getContext('2d')!);
  const t = new THREE.CanvasTexture(c);
  // drawn with theme hexes and read as linear, like `raw()` colours
  t.colorSpace = THREE.NoColorSpace;
  t.wrapS = THREE.RepeatWrapping;
  t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(...repeat);
  t.anisotropy = 4;
  return t;
};

/** Brushed metal: fine streaks along x (or y), as a roughness and bump map. */
const brushed = (seed: string, vertical: boolean) =>
  canvasTex(256, 256, (cx) => {
    cx.fillStyle = 'rgb(214,214,214)';
    cx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 900; i++) {
      const p = random(`${seed}-p-${i}`) * 256;
      const v = 150 + Math.floor(random(`${seed}-v-${i}`) * 105);
      const a = 0.18 + random(`${seed}-a-${i}`) * 0.35;
      const len = 40 + random(`${seed}-l-${i}`) * 216;
      const s = random(`${seed}-s-${i}`) * 256;
      cx.fillStyle = `rgba(${v},${v},${v},${a})`;
      if (vertical) {
        cx.fillRect(p, s, 1, len);
        cx.fillRect(p, s - 256, 1, len);
      } else {
        cx.fillRect(s, p, len, 1);
        cx.fillRect(s - 256, p, len, 1);
      }
    }
  });

/** Car laminate: a pale linen-grain panel (fine vertical fibres and soft flecks). */
const laminate = () =>
  canvasTex(256, 256, (cx) => {
    cx.fillStyle = TOWER.carWall;
    cx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 700; i++) {
      const x = random(`lam-x-${i}`) * 256;
      const y = random(`lam-y-${i}`) * 256;
      cx.globalAlpha = 0.12 + random(`lam-a-${i}`) * 0.2;
      cx.fillStyle = TOWER.laminateGrain;
      cx.fillRect(x, y, 1, 6 + random(`lam-l-${i}`) * 40);
    }
    cx.globalAlpha = 1;
  });

/** Dark granite floor tile with pale flecks and a tile joint. */
const granite = () =>
  canvasTex(256, 256, (cx) => {
    cx.fillStyle = TOWER.carFloor;
    cx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 1600; i++) {
      cx.globalAlpha = 0.25 + random(`gr-a-${i}`) * 0.5;
      cx.fillStyle = random(`gr-c-${i}`) > 0.7 ? TOWER.carFloorFleck : TOWER.engrave;
      const s = 1 + random(`gr-s-${i}`) * 2.5;
      cx.fillRect(random(`gr-x-${i}`) * 256, random(`gr-y-${i}`) * 256, s, s);
    }
    cx.globalAlpha = 1;
    cx.fillStyle = TOWER.engrave;
    cx.fillRect(0, 0, 256, 2);
    cx.fillRect(0, 0, 2, 256);
  });

/** A wiring diagram sheet: a title block, a bus, boxes and the wires between them, in grey ink on paper. */
const diagram = () =>
  canvasTex(192, 256, (cx) => {
    cx.fillStyle = TOWER.paper;
    cx.fillRect(0, 0, 192, 256);
    cx.strokeStyle = TOWER.engrave;
    cx.fillStyle = TOWER.engrave;
    cx.lineWidth = 1.5;
    cx.strokeRect(8, 8, 176, 240);
    cx.strokeRect(108, 214, 76, 34);
    for (let r = 0; r < 4; r++) cx.fillRect(114, 220 + r * 7, 40 + random(`dg-t-${r}`) * 26, 2);
    cx.beginPath();
    cx.moveTo(24, 24);
    cx.lineTo(24, 200);
    cx.moveTo(34, 24);
    cx.lineTo(34, 200);
    cx.stroke();
    for (let i = 0; i < 9; i++) {
      const y = 30 + i * 19;
      const x = 60 + random(`dg-x-${i}`) * 60;
      const w = 22 + random(`dg-w-${i}`) * 30;
      cx.beginPath();
      cx.moveTo(i % 2 ? 24 : 34, y + 6);
      cx.lineTo(x, y + 6);
      cx.stroke();
      cx.strokeRect(x, y, w, 12);
      if (random(`dg-l-${i}`) > 0.4) {
        cx.beginPath();
        cx.moveTo(x + w, y + 6);
        cx.lineTo(170, y + 6);
        cx.lineTo(170, y + 18);
        cx.stroke();
      }
    }
  });

let TEX: ReturnType<typeof makeTextures> | null = null;
const makeTextures = () => ({
  brushH: brushed('brush-h', false),
  brushV: brushed('brush-v', true),
  laminate: laminate(),
  granite: granite(),
  diagram: diagram(),
});
const kitTextures = () => (TEX ??= makeTextures());

// ---------------------------------------------------------------- materials

/**
 * Large-format stone cladding drawn from world position (no UVs needed, so it tiles evenly on boxes of
 * any size): 0.6 × 1.2 slabs with thin darker joints, and a faint per-slab tone shift. Joints fade out
 * where they'd be finer than a pixel (a wide shot shows plain stone).
 */
export const cladMaterial = (color: string): THREE.MeshPhysicalMaterial => {
  const m = new THREE.MeshPhysicalMaterial({
    color: raw(color),
    roughness: 0.38,
    clearcoat: 0.25,
    clearcoatRoughness: 0.5,
  });
  m.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vCladPos;\nvarying vec3 vCladN;')
      .replace(
        '#include <project_vertex>',
        '#include <project_vertex>\nvCladPos = (modelMatrix * vec4(transformed, 1.0)).xyz;\nvCladN = normalize(mat3(modelMatrix) * objectNormal);',
      );
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vCladPos;\nvarying vec3 vCladN;')
      .replace(
        '#include <color_fragment>',
        `#include <color_fragment>
        {
          vec3 an = abs(vCladN);
          vec2 uv = an.x > 0.5 ? vCladPos.zy : (an.z > 0.5 ? vCladPos.xy : vCladPos.xz);
          vec2 g = (uv + vec2(0.3, 0.45)) / vec2(0.6, 1.2);
          vec2 cell = floor(g);
          vec2 f = abs(fract(g) - 0.5);
          vec2 w = fwidth(g);
          vec2 jw = vec2(0.0025 / 0.6, 0.0025 / 1.2);
          float joint = max(1.0 - smoothstep(0.5 - jw.x - w.x, 0.5 - jw.x + w.x, 0.5 - f.x), 1.0 - smoothstep(0.5 - jw.y - w.y, 0.5 - jw.y + w.y, 0.5 - f.y));
          joint *= 1.0 - smoothstep(0.02, 0.08, max(w.x, w.y));
          float tone = fract(sin(dot(cell, vec2(12.9898, 78.233))) * 43758.5453);
          diffuseColor.rgb *= (0.975 + 0.05 * tone) * (1.0 - 0.28 * joint);
        }`,
      );
  };
  m.customProgramCacheKey = () => 'elevator-clad';
  return m;
};

/** The kit's materials, made once per canvas; studio reflections on the metals; flat lights per exposure. */
export const useKitMaterials = (mood: Mood) => {
  const env = useStudioEnv();
  const envScale = useEnvStrength();
  const m = MOODS[mood];
  const mats = useMemo(() => {
    const tex = kitTextures();
    const std = (c: string, roughness = 0.8, o: THREE.MeshStandardMaterialParameters = {}) =>
      new THREE.MeshStandardMaterial({color: raw(c), roughness, ...o});
    const phys = (c: string, o: THREE.MeshPhysicalMaterialParameters = {}) =>
      new THREE.MeshPhysicalMaterial({color: raw(c), ...o});
    const basic = (c: string) => new THREE.MeshBasicMaterial({color: raw(c)});
    const steel = (map: THREE.Texture) => phys(TOWER.stainless, {metalness: 0.55, roughness: 0.4, roughnessMap: map});
    return {
      /** Brushed stainless, grain along x (lanterns, heads, sills' trims) and along y (faceplates, jambs, leaves). */
      steelH: steel(tex.brushH),
      steelV: steel(tex.brushV),
      /** Door leaves: brushed vertically, a mid grey (so a shut door never reads as a hole). */
      door: (() => {
        const d = steel(tex.brushV);
        d.color.copy(raw(TOWER.door));
        d.metalness = 0.45;
        return d;
      })(),
      /** Polished stainless: button caps' rims, screw heads, handrails. */
      polished: phys(TOWER.stainless, {metalness: 0.7, roughness: 0.18}),
      engrave: std(TOWER.engrave, 0.6),
      glass: phys(TOWER.displayGlass, {roughness: 0.06, clearcoat: 1}),
      lensOff: phys(TOWER.lensOff, {roughness: 0.45, clearcoat: 0.6}),
      /** Lit indicators: `warning` yellow, flat (never bloom); a neutral power LED; unlit. */
      warn: basic(section.warning),
      neutral: basic(TOWER.displayInk),
      ledOff: std(section.ledOff, 0.35),
      laminate: phys('#ffffff', {map: tex.laminate, roughness: 0.55, clearcoat: 0.25, clearcoatRoughness: 0.4}),
      granite: phys('#ffffff', {map: tex.granite, roughness: 0.35, clearcoat: 0.5}),
      paint: phys(TOWER.cabinetPaint, {roughness: 0.42, clearcoat: 0.35}),
      plate: phys(TOWER.mountPlate, {metalness: 0.75, roughness: 0.45}),
      duct: std(TOWER.duct, 0.7),
      terminal: std(TOWER.terminalBlock, 0.55),
      terminalBlue: std(TOWER.wireBlue, 0.55),
      contactor: std(TOWER.contactor, 0.5),
      pcb: phys(REAL.pcb, {roughness: 0.38, clearcoat: 0.5}),
      chip: std(REAL.chip, 0.5),
      shield: phys(REAL.shield, {metalness: 0.85, roughness: 0.35}),
      heatsink: phys(REAL.alu, {metalness: 0.9, roughness: 0.5}),
      wireBlack: std(REAL.cable, 0.55),
      wireGrey: std(TOWER.wireGrey, 0.6),
      wireBlue: std(TOWER.wireBlue, 0.6),
      paper: std('#ffffff', 0.95, {map: tex.diagram}),
      rubber: std(REAL.rubber, 0.8),
      screw: phys(REAL.screw, {metalness: 1, roughness: 0.3}),
      alu: phys(REAL.alu, {metalness: 1, roughness: 0.4}),
      dark: phys(TOWER.button, {metalness: 0.4, roughness: 0.4}),
      vent: basic('#0c0d10'),
    };
  }, []);
  applyEnv(
    env,
    [
      [mats.steelH, 1.1],
      [mats.steelV, 1.1],
      [mats.door, 1],
      [mats.polished, 1.2],
      [mats.glass, 1],
      [mats.lensOff, 0.4],
      [mats.laminate, 0.3],
      [mats.granite, 0.4],
      [mats.paint, 0.5],
      [mats.plate, 0.8],
      [mats.pcb, 0.5],
      [mats.shield, 1],
      [mats.heatsink, 0.8],
      [mats.screw, 1],
      [mats.alu, 0.8],
      [mats.dark, 0.6],
    ],
    envScale,
  );
  // flat lights: shown as authored whatever the exposure (warning lights never bloom, § 1)
  mats.warn.color.copy(raw(section.warning)).multiplyScalar(0.9 / m.exposure);
  mats.neutral.color.copy(raw(TOWER.displayInk)).multiplyScalar(0.85 / m.exposure);
  return mats;
};
export type KitMaterials = ReturnType<typeof useKitMaterials>;

// ---------------------------------------------------------------- small pieces

const FACE_Z = new THREE.Euler(Math.PI / 2, 0, 0);

/** A security screw head (countersunk, a hex socket), facing +z. */
const Screw: React.FC<{mats: KitMaterials; at: V3; r?: number}> = ({mats, at, r = 0.0055}) => (
  <group position={at}>
    <mesh
      rotation={FACE_Z}
      material={mats.screw}
      geometry={roundedCylinder(r, r * 0.45, r * 0.2, 20)}
      position={[0, 0, r * 0.2]}
    />
    <mesh rotation={FACE_Z} material={mats.vent} position={[0, 0, r * 0.43]}>
      <cylinderGeometry args={[r * 0.4, r * 0.4, 0.0006, 6]} />
    </mesh>
  </group>
);

/** An arrow (triangle) shape pointing up (+y) or down, `w` wide. */
const arrowGeo = (w: number, h: number, dir: 1 | -1) =>
  memo(`arrow:${w}:${h}:${dir}`, () => {
    const s = new THREE.Shape();
    s.moveTo(-w / 2, (-h / 2) * dir);
    s.lineTo(w / 2, (-h / 2) * dir);
    s.lineTo(0, (h / 2) * dir);
    s.closePath();
    return new THREE.ShapeGeometry(s);
  });
const ringGeo = (r0: number, r1: number) => memo(`ring:${r0}:${r1}`, () => new THREE.RingGeometry(r0, r1, 48));

export type ButtonState = {
  /** Ring lit (warning yellow, flat). */
  lit: boolean;
  /** 0–1: how far the cap is pushed in (≈ 4 mm at 1). */
  press?: number;
};

/**
 * A round stainless push button with its light ring, facing +z, centred on the origin: the polished
 * bezel, the ring (lit `warning`, or dark), the brushed cap with a soft edge and the engraved symbol
 * (an arrow up or down, or nothing). `r` is the cap's radius.
 */
export const RingButton: React.FC<{mats: KitMaterials; r?: number; state: ButtonState; arrow?: 'up' | 'down'}> = ({
  mats,
  r = 0.033,
  state,
  arrow,
}) => {
  const push = Math.max(0, Math.min(1, state.press ?? 0));
  return (
    <group>
      <mesh
        rotation={FACE_Z}
        material={mats.polished}
        geometry={roundedCylinder(r * 1.45, 0.005, 0.0016, 48)}
        position={[0, 0, 0.0025]}
      />
      <mesh
        material={state.lit ? mats.warn : mats.ledOff}
        geometry={ringGeo(r * 1.06, r * 1.36)}
        position={[0, 0, 0.0052]}
      />
      <group position={[0, 0, 0.0052 + 0.004 - 0.0042 * push]}>
        <mesh rotation={FACE_Z} material={mats.steelH} geometry={roundedCylinder(r, 0.008, 0.0022, 48)} />
        {arrow ? (
          <mesh
            material={mats.engrave}
            geometry={arrowGeo(r * 0.72, r * 0.6, arrow === 'up' ? 1 : -1)}
            position={[0, 0, 0.0041]}
          />
        ) : null}
      </group>
    </group>
  );
};

/** Braille dots (a short cell), facing +z. */
const Braille: React.FC<{mats: KitMaterials; at: V3; dots: [number, number][]}> = ({mats, at, dots}) => (
  <group position={at}>
    {dots.map(([c, r], i) => (
      <mesh key={i} position={[c * 0.0042, -r * 0.0042, 0]} material={mats.polished}>
        <sphereGeometry args={[0.0014, 8, 6]} />
      </mesh>
    ))}
  </group>
);

// ---------------------------------------------------------------- hall fixtures

/** The hall call station's faceplate size and its buttons' offsets from its centre (y). */
export const CALL_PANEL = {w: 0.16, h: 0.36, depth: 0.01, button: 0.08, cap: 0.032};

/**
 * A hall call station, centred on the origin with its back on z = 0 (the wall), facing +z: a brushed
 * stainless faceplate with rounded corners and a soft bevel, four security screws, the up button above
 * the down button (either may be absent: the top floor has no up, the lobby no down), each with its
 * light ring and engraved arrow, and braille beside each.
 */
export const HallCallPanel: React.FC<{mats: KitMaterials; up?: ButtonState | null; down?: ButtonState | null}> = ({
  mats,
  up,
  down,
}) => {
  const {w, h, depth, button, cap} = CALL_PANEL;
  const z = depth;
  return (
    <group>
      <mesh geometry={roundedSlab(w, h, depth, 0.012, 0.003)} material={mats.steelV} castShadow receiveShadow />
      {[
        [-1, 1],
        [1, 1],
        [-1, -1],
        [1, -1],
      ].map(([sx, sy], i) => (
        <Screw key={i} mats={mats} at={[sx * (w / 2 - 0.018), sy * (h / 2 - 0.02), z]} />
      ))}
      {[
        {s: up, y: button, dir: 'up' as const},
        {s: down, y: -button, dir: 'down' as const},
      ].map((b) =>
        b.s ? (
          <group key={b.dir} position={[0, b.y, z]}>
            <RingButton mats={mats} r={cap} state={b.s} arrow={b.dir} />
            <Braille
              mats={mats}
              at={[cap * 1.45 + 0.012, 0.006, 0.0008]}
              dots={
                b.dir === 'up'
                  ? [
                      [0, 0],
                      [0, 1],
                      [1, 1],
                      [0, 2],
                    ]
                  : [
                      [0, 0],
                      [1, 0],
                      [1, 1],
                      [0, 2],
                    ]
              }
            />
          </group>
        ) : null,
      )}
    </group>
  );
};

/**
 * A hall lantern above a landing door, centred on the origin with its back on z = 0, facing +z: a
 * brushed housing with two arrow lenses (up left, down right), milky when dark, `warning` yellow when
 * lit (flat).
 */
export const HallLantern: React.FC<{mats: KitMaterials; up?: boolean; down?: boolean; w?: number}> = ({
  mats,
  up = false,
  down = false,
  w = 0.34,
}) => (
  <group>
    <mesh geometry={roundedSlab(w, 0.11, 0.022, 0.01, 0.004)} material={mats.steelH} castShadow />
    {[
      {x: -0.07, dir: 1 as const, on: up},
      {x: 0.07, dir: -1 as const, on: down},
    ].map((a) => (
      <group key={a.x} position={[a.x, 0, 0.0222]}>
        <mesh material={mats.engrave} geometry={arrowGeo(0.084, 0.066, a.dir)} />
        <mesh
          material={a.on ? mats.warn : mats.lensOff}
          geometry={arrowGeo(0.07, 0.054, a.dir)}
          position={[0, -a.dir * 0.002, 0.0006]}
        />
      </group>
    ))}
    <Screw mats={mats} at={[-w / 2 + 0.018, 0, 0.022]} r={0.004} />
    <Screw mats={mats} at={[w / 2 - 0.018, 0, 0.022]} r={0.004} />
  </group>
);

/**
 * A landing door frame, its origin at the opening's foot centre on the wall face (z = 0), facing +z:
 * brushed stainless jambs and head with a face and a return into the opening, and an aluminium sill
 * with its two guide grooves running into the hall.
 */
export const DoorFrame: React.FC<{
  mats: KitMaterials;
  w: number;
  h: number;
  face?: number;
  ret?: number;
  sill?: boolean;
}> = ({mats, w, h, face = 0.075, ret = 0.13, sill = true}) => {
  const t = 0.012;
  return (
    <group>
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh
            position={[s * (w / 2 + face / 2), (h + face) / 2, t / 2]}
            material={mats.steelV}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[face, h + face, t]} />
          </mesh>
          <mesh position={[s * (w / 2 + t / 2), h / 2, t - ret / 2]} material={mats.steelV} receiveShadow>
            <boxGeometry args={[t, h, ret]} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, h + face / 2, t / 2]} material={mats.steelH} castShadow receiveShadow>
        <boxGeometry args={[w + 2 * face, face, t]} />
      </mesh>
      <mesh position={[0, h + t / 2, t - ret / 2]} material={mats.steelH}>
        <boxGeometry args={[w, t, ret]} />
      </mesh>
      {sill ? (
        <group position={[0, 0, 0.02]}>
          <mesh position={[0, 0.009, 0]} material={mats.alu} receiveShadow>
            <boxGeometry args={[w + 2 * face, 0.018, 0.16]} />
          </mesh>
          {[-0.035, 0.012].map((dz) => (
            <mesh key={dz} position={[0, 0.0182, dz]} material={mats.engrave}>
              <boxGeometry args={[w, 0.0006, 0.009]} />
            </mesh>
          ))}
        </group>
      ) : null}
    </group>
  );
};

// ---------------------------------------------------------------- the car's operating panel

/** Draw the car operating panel's markings (labels beside the buttons) and its display. */
const copLabels = (cx: CanvasRenderingContext2D, W: number, H: number, labels: string[], rows: number[]) => {
  cx.clearRect(0, 0, W, H);
  cx.fillStyle = TOWER.engrave;
  cx.font = `700 ${Math.round(W * 0.11)}px Inter, Arial`;
  cx.textAlign = 'center';
  cx.textBaseline = 'middle';
  labels.forEach((l, i) => cx.fillText(l, W * (i % 2 ? 0.86 : 0.14), rows[i]));
};

const displayDraw = (cx: CanvasRenderingContext2D, W: number, H: number, floor: string, dir: number, full: boolean) => {
  cx.fillStyle = TOWER.displayGlass;
  cx.fillRect(0, 0, W, H);
  cx.fillStyle = TOWER.displayInk;
  cx.font = `700 ${Math.round(H * 0.62)}px Inter, Arial`;
  cx.textAlign = 'center';
  cx.textBaseline = 'middle';
  cx.fillText(floor, W * 0.62, H * 0.47);
  if (dir !== 0) {
    const ax = W * 0.24;
    const ay = H * 0.47;
    const s = H * 0.2;
    cx.beginPath();
    cx.moveTo(ax - s, ay + dir * s * 0.6);
    cx.lineTo(ax + s, ay + dir * s * 0.6);
    cx.lineTo(ax, ay - dir * s * 0.9);
    cx.closePath();
    cx.fill();
  }
  if (full) {
    cx.fillStyle = section.warning;
    cx.font = `800 ${Math.round(H * 0.17)}px Inter, Arial`;
    cx.fillText('FULL', W * 0.62, H * 0.86);
  }
};

export type CopState = {
  /** Floor labels bottom to top (default L, 1, 2, …). */
  labels: string[];
  /** Lit floor buttons (indexes into `labels`). */
  lit: number[];
  /** The display: the floor shown, the arrow (+1 up, −1 down, 0 none) and the FULL sign. */
  floor: string;
  dir: number;
  full: boolean;
};

/**
 * The car operating panel, centred on the origin with its back on z = 0, facing +z (the scene turns
 * it onto the car's side wall): a tall brushed plate, the floor display (neutral digits, an arrow, a
 * `FULL` sign in warning yellow when the car is full), two columns of floor buttons with lit rings for
 * the floors asked for, door open/close and the alarm button, a key switch and a speaker grille.
 */
export const CarOperatingPanel: React.FC<{
  mats: KitMaterials;
  state: CopState;
  ready: boolean;
  /** The display's brightness (the scene passes 0.85 / exposure, so it shows as authored). */
  light?: number;
  w?: number;
  h?: number;
}> = ({mats, state, ready, light = 1, w = 0.24, h = 0.95}) => {
  const n = state.labels.length;
  const rowsN = Math.ceil(n / 2);
  const capR = 0.017;
  const pitch = 0.072;
  const top = h / 2 - 0.2;
  // floors bottom to top, two to a row (left, right); the top row under the display
  const btn = (i: number): [number, number] => [
    (i % 2 ? 1 : -1) * 0.045,
    top - (rowsN - 1 - Math.floor(i / 2)) * pitch,
  ];
  const k = `${state.labels.join(',')}|${state.floor}|${state.dir}|${state.full}`;
  const tex = useMemo(() => {
    const lab = document.createElement('canvas');
    lab.width = 256;
    lab.height = Math.round((256 * h) / w);
    const dsp = document.createElement('canvas');
    dsp.width = 256;
    dsp.height = 140;
    const lt = new THREE.CanvasTexture(lab);
    const dt = new THREE.CanvasTexture(dsp);
    lt.colorSpace = THREE.NoColorSpace;
    dt.colorSpace = THREE.NoColorSpace;
    return {
      lab,
      dsp,
      lt,
      dt,
      key: '',
      labMat: new THREE.MeshBasicMaterial({map: lt, transparent: true, depthWrite: false}),
      dspMat: new THREE.MeshBasicMaterial({map: dt}),
    };
  }, [w, h]);
  if (ready && tex.key !== k) {
    const W = tex.lab.width;
    const H = tex.lab.height;
    const rows = state.labels.map((_, i) => H * (0.5 - btn(i)[1] / h));
    copLabels(tex.lab.getContext('2d')!, W, H, state.labels, rows);
    tex.lt.needsUpdate = true;
    displayDraw(tex.dsp.getContext('2d')!, tex.dsp.width, tex.dsp.height, state.floor, state.dir, state.full);
    tex.dt.needsUpdate = true;
    tex.key = k;
  }
  tex.dspMat.color.setScalar(light);
  return (
    <group>
      <mesh geometry={roundedSlab(w, h, 0.01, 0.01, 0.003)} material={mats.steelV} castShadow receiveShadow />
      {/* the display under its glass */}
      <mesh position={[0, h / 2 - 0.085, 0.0102]} geometry={roundedPlane(0.15, 0.085, 0.006)} material={mats.glass} />
      <mesh position={[0, h / 2 - 0.085, 0.0106]} material={tex.dspMat} visible={ready}>
        <planeGeometry args={[0.135, 0.074]} />
      </mesh>
      {/* labels (engraved) */}
      <mesh position={[0, 0, 0.0104]} material={tex.labMat} visible={ready} renderOrder={4}>
        <planeGeometry args={[w, h]} />
      </mesh>
      {state.labels.map((_, i) => {
        const [x, y] = btn(i);
        return (
          <group key={i} position={[x, y, 0.01]}>
            <RingButton mats={mats} r={capR} state={{lit: state.lit.includes(i)}} />
          </group>
        );
      })}
      {/* door open / close, the alarm */}
      {[-0.06, 0, 0.06].map((x, i) => (
        <group key={i} position={[x, -h / 2 + 0.2, 0.01]}>
          <RingButton mats={mats} r={capR * 0.9} state={{lit: false}} />
          <mesh position={[0, 0, 0.0136]} material={mats.engrave}>
            {i === 2 ? <circleGeometry args={[0.006, 16]} /> : <planeGeometry args={[0.012, 0.0025]} />}
          </mesh>
        </group>
      ))}
      {/* key switch and the speaker grille */}
      <group position={[0.06, -h / 2 + 0.1, 0.01]}>
        <mesh
          rotation={FACE_Z}
          material={mats.polished}
          geometry={roundedCylinder(0.011, 0.006, 0.002, 24)}
          position={[0, 0, 0.003]}
        />
        <mesh position={[0, 0, 0.0062]} material={mats.vent}>
          <planeGeometry args={[0.0025, 0.012]} />
        </mesh>
      </group>
      {Array.from({length: 20}, (_, i) => (
        <mesh
          key={i}
          position={[-0.075 + (i % 5) * 0.012, -h / 2 + 0.085 + Math.floor(i / 5) * 0.012, 0.0102]}
          material={mats.vent}
        >
          <circleGeometry args={[0.0028, 8]} />
        </mesh>
      ))}
      {[
        [-1, 1],
        [1, 1],
        [-1, -1],
        [1, -1],
      ].map(([sx, sy], i) => (
        <Screw key={i} mats={mats} at={[sx * (w / 2 - 0.016), sy * (h / 2 - 0.016), 0.01]} r={0.0045} />
      ))}
    </group>
  );
};

// ---------------------------------------------------------------- the group controller

/** The controller cabinet's size (w, h, d), plinth and where its decision node sits (local, from the front-bottom centre). */
export const CABINET = {w: 0.9, h: 2.0, d: 0.5, plinth: 0.1, node: [-0.06, 1.56, -0.5 + 0.072] as V3};

const tubeGeo = (pts: V3[], r: number) =>
  memo(
    `tube:${r}:${JSON.stringify(pts)}`,
    () => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p))), 24, r, 6, false),
  );

/** One status LED: blinks (deterministic, from the scene clock) or holds. */
const led = (t: number, seed: string, rate: number) =>
  rate <= 0 ? true : Math.floor(t * rate + random(seed) * 2) % 2 === 0;

/**
 * The group controller: a light-grey enamel floor cabinet in the machine room, its door swung open
 * (hinged left, opening toward the camera's side, a wiring diagram in the door pocket). Inside on the
 * galvanised mounting plate: slotted grey cable ducts, the main controller board (processor under a
 * heatsink, memory, headers, a column of status LEDs) beside a shielded comms module, a DIN rail of
 * power supply and breakers, a rail of contactors and terminal blocks, wiring into the ducts and a
 * cable bundle out of the foot toward the shafts. LEDs: neutral (power) and `warning` yellow
 * (activity, blinking); flat, no bloom, never orange. Origin: the front-bottom centre; front at z = 0.
 */
export const ControllerCabinet: React.FC<{mats: KitMaterials; open?: number; t: number}> = ({mats, open = 1, t}) => {
  const {w, h, d, plinth} = CABINET;
  const T = 0.02;
  const zb = -d;
  const plateZ = zb + 0.03;
  const iw = w - 2 * T;
  const duct = (x: number, y: number, len: number, vertical = false) => (
    <group position={[x, y, plateZ + 0.035]}>
      <mesh material={mats.duct} castShadow receiveShadow>
        <boxGeometry args={vertical ? [0.055, len, 0.06] : [len, 0.055, 0.06]} />
      </mesh>
      {/* the duct's slots: dark gaps between its fingers */}
      {Array.from({length: Math.floor(len / 0.025)}, (_, i) => {
        const u = -len / 2 + 0.0125 + i * 0.025;
        return (
          <mesh key={i} position={vertical ? [0, u, 0.0302] : [u, 0, 0.0302]} material={mats.vent}>
            <planeGeometry args={vertical ? [0.05, 0.007] : [0.007, 0.05]} />
          </mesh>
        );
      })}
    </group>
  );
  const angle = -open * 1.9;
  const leds = [
    {x: 0.13, y: 1.71, rate: 0, mat: mats.neutral},
    {x: 0.13, y: 1.68, rate: 3.1, mat: mats.warn},
    {x: 0.13, y: 1.65, rate: 1.7, mat: mats.warn},
    {x: 0.13, y: 1.62, rate: 4.3, mat: mats.warn},
    {x: 0.13, y: 1.59, rate: 0, mat: mats.neutral},
    {x: 0.13, y: 1.56, rate: 2.3, mat: mats.warn},
    {x: 0.31, y: 1.47, rate: 0, mat: mats.neutral},
    {x: 0.31, y: 1.44, rate: 5.2, mat: mats.warn},
    {x: -0.16, y: 1.17, rate: 0, mat: mats.neutral},
  ];
  // control wiring from the parts into the ducts, then down the side ducts (black, grey, blue)
  const wires: {pts: V3[]; m: THREE.Material}[] = [];
  const wz = plateZ + 0.05;
  [-0.22, -0.16, -0.1, -0.04, 0.02, 0.08].forEach((x, i) =>
    wires.push({
      pts: [
        [x, 1.385, wz + 0.01],
        [x + 0.005, 1.35, wz + 0.02],
        [x + 0.01, 1.3, wz],
      ],
      m: [mats.wireBlack, mats.wireGrey, mats.wireBlue][i % 3],
    }),
  );
  [-0.2, -0.14, -0.08, 0.06, 0.12, 0.18, 0.24].forEach((x, i) =>
    wires.push({
      pts: [
        [x, 1.06, wz + 0.02],
        [x, 1.0, wz + 0.03],
        [x + 0.004, 0.95, wz],
      ],
      m: [mats.wireBlue, mats.wireBlack, mats.wireGrey][i % 3],
    }),
  );
  [-0.24, -0.18, -0.12, -0.02, 0.04, 0.1, 0.16, 0.22].forEach((x, i) =>
    wires.push({
      pts: [
        [x, 0.71, wz + 0.02],
        [x, 0.66, wz + 0.03],
        [x, 0.6, wz],
      ],
      m: [mats.wireGrey, mats.wireBlue, mats.wireBlack][i % 3],
    }),
  );
  // the bundle out of the foot, toward the shafts (left) along the floor
  const bundle: V3[][] = [0, 1, 2, 3, 4].map((i) => [
    [-0.3 + i * 0.012, 0.42, wz],
    [-0.31 + i * 0.012, 0.2, wz + 0.03],
    [-0.36 + i * 0.01, 0.06, 0.05 + i * 0.012],
    [-0.75, 0.025 + i * 0.012, 0.12 + i * 0.01],
  ]);
  return (
    <group>
      {/* shell: sides, top, back, plinth (the front is the open door) */}
      <mesh position={[-w / 2 + T / 2, h / 2, -d / 2]} material={mats.paint} castShadow receiveShadow>
        <boxGeometry args={[T, h, d]} />
      </mesh>
      <mesh position={[w / 2 - T / 2, h / 2, -d / 2]} material={mats.paint} castShadow receiveShadow>
        <boxGeometry args={[T, h, d]} />
      </mesh>
      <mesh position={[0, h - T / 2, -d / 2]} material={mats.paint} castShadow receiveShadow>
        <boxGeometry args={[w, T, d]} />
      </mesh>
      <mesh position={[0, h / 2, zb + T / 2]} material={mats.paint} receiveShadow>
        <boxGeometry args={[w, h, T]} />
      </mesh>
      {/* the plinth, set in a little (flush with the sides it z-fought them) */}
      <mesh position={[0, plinth / 2, -d / 2 - 0.006]} material={mats.dark} castShadow receiveShadow>
        <boxGeometry args={[w - 2 * T - 0.004, plinth, d - 0.02]} />
      </mesh>
      {/* the folded front frame round the opening, with its gasket */}
      {[
        {p: [-w / 2 + 0.02, h / 2, -0.01] as V3, s: [0.04, h, 0.02] as V3},
        {p: [w / 2 - 0.02, h / 2, -0.01] as V3, s: [0.04, h, 0.02] as V3},
        {p: [0, h - 0.02, -0.01] as V3, s: [w, 0.04, 0.02] as V3},
        {p: [0, plinth + 0.02, -0.01] as V3, s: [w, 0.04, 0.02] as V3},
      ].map((f, i) => (
        <mesh key={i} position={f.p} material={mats.paint} castShadow receiveShadow>
          <boxGeometry args={f.s} />
        </mesh>
      ))}
      {/* the mounting plate */}
      <mesh position={[0, (h + plinth) / 2, plateZ]} material={mats.plate} receiveShadow>
        <boxGeometry args={[iw - 0.04, h - plinth - 0.08, 0.004]} />
      </mesh>
      {duct(0, 1.86, iw - 0.06)}
      {duct(0, 1.3, iw - 0.18)}
      {duct(0, 0.94, iw - 0.18)}
      {duct(0, 0.59, iw - 0.18)}
      {duct(-iw / 2 + 0.06, 1.12, 1.42, true)}
      {duct(iw / 2 - 0.06, 1.12, 1.42, true)}
      {/* the main controller board on standoffs */}
      <group position={[-0.06, 1.57, plateZ + 0.025]}>
        <mesh material={mats.pcb} castShadow receiveShadow>
          <boxGeometry args={[0.44, 0.38, 0.003]} />
        </mesh>
        <mesh position={[-0.06, 0.04, 0.012]} material={mats.chip} castShadow>
          <boxGeometry args={[0.08, 0.08, 0.008]} />
        </mesh>
        {/* the processor's finned heatsink */}
        <group position={[-0.06, 0.04, 0.02]}>
          {Array.from({length: 7}, (_, i) => (
            <mesh key={i} position={[-0.033 + i * 0.011, 0, 0.012]} material={mats.heatsink} castShadow>
              <boxGeometry args={[0.003, 0.075, 0.03]} />
            </mesh>
          ))}
          <mesh material={mats.heatsink}>
            <boxGeometry args={[0.078, 0.078, 0.005]} />
          </mesh>
        </group>
        {[
          [0.07, 0.11],
          [0.07, 0.05],
          [0.07, -0.01],
        ].map(([x, y], i) => (
          <mesh key={i} position={[x, y, 0.004]} material={mats.chip} castShadow>
            <boxGeometry args={[0.06, 0.03, 0.004]} />
          </mesh>
        ))}
        {[
          [-0.16, 0.12],
          [-0.16, -0.04],
          [0.0, -0.08],
        ].map(([x, y], i) => (
          <mesh key={i} position={[x, y, 0.004]} material={mats.chip}>
            <boxGeometry args={[0.03, 0.03, 0.003]} />
          </mesh>
        ))}
        {/* headers along the lower edge (where the wiring lands) */}
        <mesh position={[-0.07, -0.165, 0.01]} material={mats.terminal} castShadow>
          <boxGeometry args={[0.34, 0.028, 0.02]} />
        </mesh>
        {/* a battery-backed clock cell and a shielded comms module on the right */}
        <mesh position={[0.16, -0.1, 0.004]} rotation={FACE_Z} material={mats.shield}>
          <cylinderGeometry args={[0.012, 0.012, 0.004, 20]} />
        </mesh>
      </group>
      <group position={[0.29, 1.5, plateZ + 0.04]}>
        <mesh material={mats.shield} geometry={rbox(0.14, 0.24, 0.05, 0.004)} castShadow receiveShadow />
        {[0.06, 0.0, -0.06].map((y, i) => (
          <mesh key={i} position={[-0.02, y, 0.0255]} material={mats.vent}>
            <planeGeometry args={[0.05, 0.035]} />
          </mesh>
        ))}
      </group>
      {leds.map((l, i) => (
        <mesh
          key={i}
          position={[l.x, l.y, plateZ + (l.x > 0.2 ? 0.066 : 0.03)]}
          material={led(t, `cab-led-${i}`, l.rate) ? l.mat : mats.ledOff}
        >
          <boxGeometry args={[0.016, 0.011, 0.008]} />
        </mesh>
      ))}
      {/* DIN rail 1: power supply, breakers, relays */}
      <group position={[0, 1.12, plateZ]}>
        <mesh position={[0, 0, 0.006]} material={mats.alu}>
          <boxGeometry args={[iw - 0.18, 0.035, 0.008]} />
        </mesh>
        <mesh position={[-0.2, 0, 0.05]} material={mats.shield} geometry={rbox(0.15, 0.15, 0.09, 0.004)} castShadow />
        {[-0.03, -0.01, 0.01, 0.03].map((y, i) => (
          <mesh key={i} position={[-0.2, y, 0.0952]} material={mats.vent}>
            <planeGeometry args={[0.1, 0.004]} />
          </mesh>
        ))}
        {Array.from({length: 6}, (_, i) => (
          <group key={i} position={[-0.06 + i * 0.022, 0, 0.04]}>
            <mesh material={mats.paint} geometry={rbox(0.02, 0.09, 0.07, 0.002)} castShadow />
            <mesh position={[0, 0.005, 0.037]} material={mats.dark}>
              <boxGeometry args={[0.008, 0.018, 0.008]} />
            </mesh>
          </group>
        ))}
        {Array.from({length: 4}, (_, i) => (
          <mesh
            key={i}
            position={[0.11 + i * 0.028, 0, 0.035]}
            material={mats.contactor}
            geometry={rbox(0.024, 0.075, 0.06, 0.002)}
            castShadow
          />
        ))}
      </group>
      {/* DIN rail 2: contactors and terminal blocks */}
      <group position={[0, 0.77, plateZ]}>
        <mesh position={[0, 0, 0.006]} material={mats.alu}>
          <boxGeometry args={[iw - 0.18, 0.035, 0.008]} />
        </mesh>
        {Array.from({length: 3}, (_, i) => (
          <group key={i} position={[-0.23 + i * 0.065, 0, 0.045]}>
            <mesh material={mats.contactor} geometry={rbox(0.055, 0.09, 0.08, 0.003)} castShadow />
            <mesh position={[0, 0.0, 0.041]} material={mats.terminal}>
              <boxGeometry args={[0.04, 0.03, 0.003]} />
            </mesh>
          </group>
        ))}
        {Array.from({length: 22}, (_, i) => (
          <mesh
            key={i}
            position={[-0.02 + i * 0.0105, 0, 0.026]}
            material={i % 5 === 4 ? mats.terminalBlue : mats.terminal}
            castShadow
          >
            <boxGeometry args={[0.0095, 0.07, 0.045]} />
          </mesh>
        ))}
      </group>
      {/* the bottom terminal strip */}
      <group position={[0, 0.44, plateZ]}>
        <mesh position={[0, 0, 0.006]} material={mats.alu}>
          <boxGeometry args={[iw - 0.18, 0.035, 0.008]} />
        </mesh>
        {Array.from({length: 46}, (_, i) => (
          <mesh
            key={i}
            position={[-0.27 + i * 0.012, 0, 0.026]}
            material={i % 6 === 5 ? mats.terminalBlue : mats.terminal}
          >
            <boxGeometry args={[0.011, 0.065, 0.045]} />
          </mesh>
        ))}
      </group>
      {wires.map((wr, i) => (
        <mesh key={i} geometry={tubeGeo(wr.pts, 0.0035)} material={wr.m} castShadow />
      ))}
      {bundle.map((pts, i) => (
        <mesh
          key={`b${i}`}
          geometry={tubeGeo(pts, 0.009)}
          material={i % 2 ? mats.wireGrey : mats.wireBlack}
          castShadow
          receiveShadow
        />
      ))}
      {/* the door, hinged on the left edge, open toward the camera's side */}
      <group position={[-w / 2, plinth, 0.005]} rotation={[0, angle, 0]}>
        <mesh
          position={[w / 2, (h - plinth) / 2, 0.0125]}
          material={mats.paint}
          // a few mm short of the top, so its edge never sits on the body's top face
          geometry={rbox(w - 0.004, h - plinth - 0.01, 0.025, 0.006)}
          castShadow
          receiveShadow
        />
        {/* inside: the gasket, the document pocket with the wiring diagram */}
        <mesh position={[w / 2, (h - plinth) / 2, -0.001]} material={mats.rubber}>
          <boxGeometry args={[w - 0.06, h - plinth - 0.06, 0.003]} />
        </mesh>
        <mesh position={[w / 2, (h - plinth) / 2, -0.0026]} material={mats.paint}>
          <boxGeometry args={[w - 0.08, h - plinth - 0.08, 0.002]} />
        </mesh>
        <mesh position={[w / 2, 0.95, -0.012]} rotation={[0, Math.PI, 0.02]} material={mats.paper}>
          <planeGeometry args={[0.3, 0.42]} />
        </mesh>
        <mesh position={[w / 2, 0.82, -0.02]} material={mats.paint}>
          <boxGeometry args={[0.4, 0.2, 0.012]} />
        </mesh>
        {/* outside: the latch handle; the vent louvres low on the door */}
        <mesh
          position={[w - 0.06, (h - plinth) / 2, 0.035]}
          material={mats.dark}
          geometry={rbox(0.03, 0.14, 0.02, 0.006)}
          castShadow
        />
        {Array.from({length: 6}, (_, i) => (
          <mesh key={i} position={[w / 2, 0.15 + i * 0.03, 0.0255]} material={mats.vent}>
            <planeGeometry args={[0.3, 0.008]} />
          </mesh>
        ))}
      </group>
    </group>
  );
};

// ---------------------------------------------------------------- the destination keypad

/** The keypad head's pose on its pedestal (local to the pedestal's foot) and its key grid (head-local). */
export const KEYPAD = {
  head: [0, 1.13, -0.03] as V3,
  tilt: 0.55,
  screen: {w: 0.27, h: 0.19},
};

/** A key on the keypad's screen (0–9 as on a phone pad, 10 = ✓), head-local (the screen faces +z). */
export const keypadKeyLocal = (i: number): V3 => {
  const order = [10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 11];
  const idx = Math.max(0, order.indexOf(i));
  const col = idx % 3;
  const row = Math.floor(idx / 3);
  return [-0.06 + col * 0.06, 0.057 - row * 0.034, 0.002];
};

const keypadScreen = (cx: CanvasRenderingContext2D, W: number, H: number) => {
  cx.fillStyle = TOWER.displayGlass;
  cx.fillRect(0, 0, W, H);
  cx.fillStyle = TOWER.displayInk;
  cx.font = `600 ${Math.round(H * 0.08)}px Inter, Arial`;
  cx.textAlign = 'center';
  cx.textBaseline = 'middle';
  cx.fillText('Enter your floor', W / 2, H * 0.1);
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', ''];
  keys.forEach((k, i) => {
    if (!k) return;
    const x = W * (0.28 + (i % 3) * 0.22);
    const y = H * (0.3 + Math.floor(i / 3) * 0.18);
    cx.strokeStyle = TOWER.displayInk;
    cx.lineWidth = 2;
    cx.strokeRect(x - W * 0.09, y - H * 0.07, W * 0.18, H * 0.14);
    cx.font = `700 ${Math.round(H * 0.1)}px Inter, Arial`;
    cx.fillText(k, x, y);
  });
};

/**
 * The hotel's destination keypad: a brushed stainless pedestal on a round foot with four screws, a
 * slim neck and the head, its touchscreen (dark glass, a floor pad) tilted back toward its user (the
 * pedestal's −z side). The camera sees the head's brushed back (vents, a service plate); the screen is
 * read in the detail box. Origin: the pedestal's foot.
 */
export const DestinationKeypad: React.FC<{mats: KitMaterials; ready: boolean}> = ({mats, ready}) => {
  const tex = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 270;
    c.height = 190;
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.NoColorSpace;
    return {c, t, done: false, mat: new THREE.MeshBasicMaterial({map: t})};
  }, []);
  if (ready && !tex.done) {
    keypadScreen(tex.c.getContext('2d')!, tex.c.width, tex.c.height);
    tex.t.needsUpdate = true;
    tex.done = true;
  }
  const {w, h} = KEYPAD.screen;
  return (
    <group>
      <mesh
        position={[0, 0.008, 0]}
        material={mats.steelH}
        geometry={roundedCylinder(0.2, 0.016, 0.004, 48)}
        castShadow
        receiveShadow
      />
      {[0, 1, 2, 3].map((i) => {
        const a = Math.PI / 4 + (i * Math.PI) / 2;
        return (
          <group key={i} position={[Math.cos(a) * 0.15, 0.016, Math.sin(a) * 0.15]} rotation={[-Math.PI / 2, 0, 0]}>
            <Screw mats={mats} at={[0, 0, 0]} r={0.006} />
          </group>
        );
      })}
      <mesh
        position={[0, 0.53, 0]}
        material={mats.steelV}
        geometry={rbox(0.13, 1.03, 0.085, 0.012)}
        castShadow
        receiveShadow
      />
      {/* the service plate on the column's camera side */}
      <mesh position={[0, 0.42, 0.0436]} geometry={roundedPlane(0.08, 0.2, 0.006)} material={mats.steelH} />
      {[1, -1].map((s) => (
        <Screw key={s} mats={mats} at={[0, 0.42 + s * 0.085, 0.0438]} r={0.004} />
      ))}
      <group position={KEYPAD.head} rotation={[KEYPAD.tilt, Math.PI, 0]}>
        <mesh
          position={[0, 0, -0.022]}
          material={mats.steelH}
          geometry={rbox(0.31, 0.23, 0.044, 0.012)}
          castShadow
          receiveShadow
        />
        {/* the screen side: black glass bezel and the floor pad */}
        <mesh position={[0, 0, 0.0005]} geometry={roundedPlane(0.295, 0.215, 0.01)} material={mats.glass} />
        <mesh position={[0, 0, 0.001]} material={tex.mat} visible={ready}>
          <planeGeometry args={[w, h]} />
        </mesh>
        {/* the back (toward the camera): vents and a seam */}
        {[-0.05, -0.03, -0.01].map((y, i) => (
          <mesh key={i} position={[0, y, -0.0445]} rotation={[0, Math.PI, 0]} material={mats.vent}>
            <planeGeometry args={[0.16, 0.006]} />
          </mesh>
        ))}
        <mesh position={[0, 0.07, -0.0446]} rotation={[0, Math.PI, 0]} material={mats.engrave}>
          <planeGeometry args={[0.29, 0.002]} />
        </mesh>
      </group>
    </group>
  );
};
