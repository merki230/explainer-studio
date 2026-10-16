import React, {useMemo} from 'react';
import {random} from 'remotion';
import * as THREE from 'three';
import {REAL, section} from '../../theme';
import {raw} from '../plaster';
import {useFontsLoaded} from '../section/useFontsLoaded';
import {
  batteryTexture,
  boardTexture,
  chipTexture,
  flexTexture,
  floorTexture,
  glowTexture,
  grilleTexture,
  shieldTexture,
  type BoardPart,
} from './phoneTextures';
import {REAL_PHONE} from './RealPhone';
import {roundedPlane, roundedSlab, rrPath, rrShape} from './shapes';
import {applyAlbedo, applyEnv, useAlbedo, useEnvStrength, useStudioEnv} from './useStudioEnv';

type V3 = [number, number, number];
type R = [number, number, number, number];

const P = REAL_PHONE;
/** The cavity floor (the midframe's face) and the board's top. */
const FLOOR = -P.d / 2 + 0.014;
const BOARD_T = 0.008;
const BOARD_TOP = FLOOR + 0.012 + BOARD_T;
const IN = {x: P.w / 2 - P.t, y: P.h / 2 - P.t};

/** The logic board: an L (the camera modules sit in its top-left notch). */
const BOARD: R = [-0.415, 0.14, 0.415, 0.895];
const NOTCH: R = [-0.415, 0.53, -0.055, 0.895];

/** The wake-word chip's centre in the phone's local units (the scene's waves aim here). */
export const WAKE_CHIP: V3 = [0.14, 0.42, BOARD_TOP + 0.01];

type Chip = {c: [number, number]; s: [number, number]; h: number; legend: string[]; ref: string; key: string};
const CHIPS: Chip[] = [
  {c: [0.12, 0.735], s: [0.2, 0.2], h: 0.016, legend: ['X7-AP', 'N3 2641', 'A1F 8812', 'TW'], ref: 'U1000', key: 'soc'},
  {
    c: [WAKE_CHIP[0], WAKE_CHIP[1]],
    s: [0.085, 0.085],
    h: 0.01,
    legend: ['WW-201', 'LP DSP', '2638'],
    ref: 'U3300',
    key: 'wake',
  },
  {c: [0.335, 0.43], s: [0.12, 0.12], h: 0.012, legend: ['RF-M2', '5G MDM', '2633 K'], ref: 'U4100', key: 'modem'},
  {c: [0.13, 0.555], s: [0.11, 0.065], h: 0.009, legend: ['PM-81', '2630'], ref: 'U2200', key: 'pmic'},
  {c: [0.335, 0.56], s: [0.12, 0.07], h: 0.01, legend: ['NV 256G', '2629 X'], ref: 'U1800', key: 'nand'},
];
const SHIELDS: {c: [number, number]; s: [number, number]; h: number}[] = [
  {c: [-0.235, 0.335], s: [0.33, 0.33], h: 0.018},
  {c: [0.35, 0.745], s: [0.1, 0.25], h: 0.016},
];
const CONNECTORS: {c: [number, number]; s: [number, number]; ref: string}[] = [
  {c: [0.0, 0.205], s: [0.12, 0.045], ref: 'J2'},
  {c: [0.26, 0.205], s: [0.12, 0.045], ref: 'J5'},
  {c: [-0.02, 0.85], s: [0.055, 0.06], ref: 'J8'},
];
const BATTERY: R = [-0.4, -0.76, 0.4, 0.1];

const rectOf = (c: [number, number], s: [number, number], g = 0): R => [
  c[0] - s[0] / 2 - g,
  c[1] - s[1] / 2 - g,
  c[0] + s[0] / 2 + g,
  c[1] + s[1] / 2 + g,
];
const overlaps = (a: R, b: R) => a[0] < b[2] && a[2] > b[0] && a[1] < b[3] && a[3] > b[1];

/** Seeded small parts (capacitors, resistors, inductors) in the board's free space. */
const smallParts = () => {
  const busy: R[] = [
    ...CHIPS.map((c) => rectOf(c.c, c.s, 0.018)),
    ...SHIELDS.map((s) => rectOf(s.c, s.s, 0.012)),
    ...CONNECTORS.map((c) => rectOf(c.c, c.s, 0.02)),
    rectOf([0.0, 0.205], [0.42, 0.07]), // the bracket over J2/J5
    NOTCH,
  ];
  const out: {r: R; kind: 0 | 1 | 2; rot: boolean; ref: string}[] = [];
  for (let i = 0; out.length < 170 && i < 6000; i++) {
    const u = random(`smd-${i}-u`);
    const kind: 0 | 1 | 2 = u < 0.62 ? 0 : u < 0.9 ? 1 : 2;
    const rot = random(`smd-${i}-r`) > 0.5;
    const big = random(`smd-${i}-b`) > 0.8;
    let w = kind === 2 ? 0.026 : big ? 0.018 : 0.012;
    let h = kind === 2 ? 0.026 : big ? 0.009 : 0.006;
    if (rot) [w, h] = [h, w];
    const x = BOARD[0] + 0.02 + random(`smd-${i}-x`) * (BOARD[2] - BOARD[0] - 0.04);
    const y = BOARD[1] + 0.02 + random(`smd-${i}-y`) * (BOARD[3] - BOARD[1] - 0.04);
    const r: R = [x - w / 2, y - h / 2, x + w / 2, y + h / 2];
    const pad: R = [r[0] - 0.004, r[1] - 0.004, r[2] + 0.004, r[3] + 0.004];
    if (busy.some((b) => overlaps(pad, b)) || out.some((o) => overlaps(pad, o.r))) continue;
    const ref =
      random(`smd-${i}-t`) < 0.22 ? `${['C', 'R', 'L'][kind]}${1000 + Math.floor(random(`smd-${i}-n`) * 8999)}` : '';
    out.push({r, kind, rot, ref});
  }
  return out;
};

/** A screw head: pan head with a cross recess, lying on a surface facing +z. */
const Screw: React.FC<{p: V3; mat: THREE.Material; slot: THREE.Material}> = ({p, mat, slot}) => (
  <group position={p}>
    <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.003]} material={mat} castShadow>
      <cylinderGeometry args={[0.0135, 0.015, 0.006, 20]} />
    </mesh>
    <mesh position={[0, 0, 0.0062]} material={slot} rotation={[0, 0, 0.4]}>
      <planeGeometry args={[0.016, 0.0035]} />
    </mesh>
    <mesh position={[0, 0, 0.0062]} material={slot} rotation={[0, 0, 0.4 + Math.PI / 2]}>
      <planeGeometry args={[0.016, 0.0035]} />
    </mesh>
  </group>
);

/** A flat flex ribbon from `a` to `b` (x, y) at height `z`, `w` wide, with a stiffened connector end at `b`. */
const Flex: React.FC<{
  a: [number, number];
  b: [number, number];
  z: number;
  w: number;
  mat: THREE.Material;
  end: THREE.Material;
}> = ({a, b, z, w, mat, end}) => {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy);
  const ang = Math.atan2(dy, dx) - Math.PI / 2;
  return (
    <group position={[(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, z]} rotation={[0, 0, ang]}>
      <mesh material={mat} castShadow receiveShadow>
        <boxGeometry args={[w, len, 0.0025]} />
      </mesh>
      <mesh position={[0, len / 2 - 0.02, 0.003]} material={end} castShadow>
        <boxGeometry args={[w + 0.008, 0.04, 0.004]} />
      </mesh>
    </group>
  );
};

export type PhoneTeardownProps = {
  /** The wake-word chip lit, 0–1 (the mood's screen-light colour, never orange). */
  chipLit?: number;
};

/**
 * The inside of the realistic phone, laid out like a teardown photo: the midframe, an L-shaped
 * logic board (solder mask, traces, silkscreen, ~170 small parts, RF shield cans, the SoC, modem,
 * PMIC, storage and the small wake-word chip, which the scene labels with a callout), board-to-board
 * connectors under a screwed bracket, the battery with its printed label and pull tabs, the camera
 * modules, black flex ribbons, the speaker and haptic engine. Contact shadows are baked into the
 * board and floor textures. Mount inside a `RealPhone` (its local units).
 */
export const PhoneTeardown: React.FC<PhoneTeardownProps> = ({chipLit = 0}) => {
  const ready = useFontsLoaded();
  const env = useStudioEnv();
  const envScale = useEnvStrength();
  const albedo = useAlbedo();
  const smd = useMemo(smallParts, []);
  const mats = useMemo(() => {
    const phys = (o: THREE.MeshPhysicalMaterialParameters) => new THREE.MeshPhysicalMaterial(o);
    const std = (c: string, roughness: number, metalness = 0) =>
      new THREE.MeshStandardMaterial({color: raw(c), roughness, metalness});
    return {
      floor: std('#ffffff', 0.6, 0.3),
      wall: std(REAL.midframe, 0.5, 0.6),
      board: phys({color: raw('#ffffff'), roughness: 0.38, clearcoat: 0.5, clearcoatRoughness: 0.25}),
      boardEdge: std(REAL.pcb, 0.6),
      chip: std(REAL.chip, 0.45),
      chipTop: new Map<string, THREE.MeshStandardMaterial>(),
      shield: std(REAL.shield, 0.42, 0.6),
      shieldTop: std('#ffffff', 0.45, 0.6),
      conn: std('#1a1b1e', 0.5),
      bracket: std(REAL.shield, 0.42, 0.6),
      screw: std(REAL.screw, 0.28, 1),
      slot: new THREE.MeshBasicMaterial({color: raw('#1a1b1e')}),
      battery: phys({color: raw(REAL.battery), roughness: 0.4, metalness: 0.35, clearcoat: 0.5}),
      label: phys({color: raw('#ffffff'), roughness: 0.5, clearcoat: 0.3}),
      tab: std(REAL.tab, 0.7),
      flex: std('#ffffff', 0.45),
      flexEnd: std(REAL.shield, 0.3, 1),
      camera: std('#6f7379', 0.4, 0.7),
      cameraTop: std('#1c1d20', 0.55),
      haptic: std('#8a8e94', 0.35, 1),
      speaker: std('#ffffff', 0.6),
      port: std(REAL.shield, 0.3, 1),
      smd: [std(REAL.cap, 0.6), std(REAL.resistor, 0.5), std(REAL.inductor, 0.45, 0.4)],
      glow: new THREE.MeshBasicMaterial({
        color: raw(section.screenLight),
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
      litFace: new THREE.MeshBasicMaterial({color: raw(section.screenLight), transparent: true, depthWrite: false}),
    };
  }, []);

  // textures need the fonts (legends): set once they're in
  const boardParts: BoardPart[] = useMemo(
    () => [
      ...CHIPS.map((c) => ({rect: rectOf(c.c, c.s), kind: 'chip' as const, ref: c.ref})),
      ...SHIELDS.map((s) => ({rect: rectOf(s.c, s.s), kind: 'shield' as const})),
      ...CONNECTORS.map((c) => ({rect: rectOf(c.c, c.s), kind: 'connector' as const, ref: c.ref})),
      ...smd.map((s) => ({rect: s.r, kind: 'small' as const, ref: s.ref || undefined, rot: s.rot})),
    ],
    [smd],
  );
  if (ready && !mats.board.map) {
    const bt = boardTexture(BOARD, boardParts, NOTCH);
    bt.repeat.set(1 / (BOARD[2] - BOARD[0]), 1 / (BOARD[3] - BOARD[1]));
    bt.offset.set(-BOARD[0] / (BOARD[2] - BOARD[0]), -BOARD[1] / (BOARD[3] - BOARD[1]));
    mats.board.map = bt;
    mats.board.needsUpdate = true;
    const cavity: R = [-IN.x, -IN.y, IN.x, IN.y];
    mats.floor.map = floorTexture(cavity, [
      BATTERY,
      [BOARD[0], BOARD[1], BOARD[2], NOTCH[1]],
      [NOTCH[2], NOTCH[1], BOARD[2], BOARD[3]],
    ]);
    mats.floor.needsUpdate = true;
    mats.label.map = batteryTexture((BATTERY[2] - BATTERY[0] - 0.04) / (BATTERY[3] - BATTERY[1] - 0.06));
    mats.label.needsUpdate = true;
    mats.shieldTop.map = shieldTexture();
    mats.shieldTop.needsUpdate = true;
    mats.speaker.map = grilleTexture();
    mats.speaker.needsUpdate = true;
    const ft = flexTexture();
    mats.flex.map = ft;
    mats.flex.needsUpdate = true;
    for (const c of CHIPS) {
      mats.chipTop.set(c.key, new THREE.MeshStandardMaterial({map: chipTexture(c.legend, c.key), roughness: 0.5}));
    }
    mats.glow.map = glowTexture();
    mats.glow.needsUpdate = true;
  }
  applyEnv(
    env,
    [
      [mats.floor, 0.6],
      [mats.board, 0.7],
      [mats.chip, 0.5],
      [mats.shield, 1.0],
      [mats.shieldTop, 1.0],
      [mats.bracket, 1.0],
      [mats.screw, 1.0],
      [mats.battery, 0.8],
      [mats.label, 0.5],
      [mats.flexEnd, 1.2],
      [mats.camera, 1.2],
      [mats.haptic, 1.2],
      [mats.port, 1.2],
      [mats.flex, 0.5],
      ...[...mats.chipTop.values()].map((m) => [m, 0.5] as [THREE.MeshStandardMaterial, number]),
    ],
    envScale,
  );
  applyAlbedo(
    Object.values(mats).flatMap((v) =>
      v instanceof THREE.Material ? [v] : Array.isArray(v) ? v : v instanceof Map ? [...v.values()] : [],
    ),
    albedo,
  );
  const lit = Math.max(0, Math.min(1, chipLit));
  mats.glow.opacity = 0.9 * lit;
  mats.litFace.opacity = 0.35 * lit;

  // geometry built once
  const geo = useMemo(() => {
    const board = new THREE.Shape();
    board.moveTo(NOTCH[2], BOARD[3]);
    board.lineTo(BOARD[2], BOARD[3]);
    board.lineTo(BOARD[2], BOARD[1]);
    board.lineTo(BOARD[0], BOARD[1]);
    board.lineTo(BOARD[0], NOTCH[1]);
    board.lineTo(NOTCH[2], NOTCH[1]);
    board.closePath();
    const boardG = new THREE.ExtrudeGeometry(board, {depth: BOARD_T, bevelEnabled: false});
    const floorG = new THREE.ShapeGeometry(rrShape(2 * IN.x, 2 * IN.y, P.r - P.t), 16);
    {
      const uv = floorG.attributes.uv as THREE.BufferAttribute;
      const pos = floorG.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < uv.count; i++) uv.setXY(i, pos.getX(i) / (2 * IN.x) + 0.5, pos.getY(i) / (2 * IN.y) + 0.5);
    }
    // the midframe's lip round the cavity (so the floor meets the frame walls)
    const lip = rrShape(2 * IN.x + 0.01, 2 * IN.y + 0.01, P.r - P.t + 0.005);
    lip.holes.push(rrPath(new THREE.Path(), 2 * IN.x - 0.02, 2 * IN.y - 0.02, P.r - P.t - 0.01));
    const lipG = new THREE.ExtrudeGeometry(lip, {depth: 0.012, bevelEnabled: false, curveSegments: 16});
    const smdGeo = new THREE.BoxGeometry(1, 1, 1);
    const inst = [0, 1, 2].map((k) => {
      const list = smd.filter((s) => s.kind === k);
      const m = new THREE.InstancedMesh(smdGeo, undefined, list.length);
      const o = new THREE.Object3D();
      list.forEach((s, i) => {
        const w = s.r[2] - s.r[0];
        const h = s.r[3] - s.r[1];
        const z = k === 2 ? 0.008 : 0.004;
        o.position.set((s.r[0] + s.r[2]) / 2, (s.r[1] + s.r[3]) / 2, BOARD_TOP + z / 2);
        o.scale.set(w, h, z);
        o.updateMatrix();
        m.setMatrixAt(i, o.matrix);
      });
      m.instanceMatrix.needsUpdate = true;
      m.castShadow = true;
      m.receiveShadow = true;
      return m;
    });
    return {boardG, floorG, lipG, inst};
  }, [smd]);
  geo.inst.forEach((m, k) => {
    m.material = mats.smd[k];
  });

  const bz = BOARD_TOP;
  const batT = 0.05;
  return (
    <group>
      {/* the cavity: midframe floor (baked occlusion) and its lip */}
      <mesh geometry={geo.floorG} material={mats.floor} position={[0, 0, FLOOR]} receiveShadow />
      <mesh geometry={geo.lipG} material={mats.wall} position={[0, 0, FLOOR - 0.006]} receiveShadow />

      {/* logic board */}
      <mesh
        geometry={geo.boardG}
        material={[mats.board, mats.boardEdge]}
        position={[0, 0, bz - BOARD_T]}
        castShadow
        receiveShadow
      />
      {geo.inst.map((m, i) => (
        <primitive key={i} object={m} />
      ))}
      {CHIPS.map((c) => (
        <group key={c.key} position={[c.c[0], c.c[1], bz]}>
          <mesh position={[0, 0, c.h / 2]} material={mats.chip} castShadow receiveShadow>
            <boxGeometry args={[c.s[0], c.s[1], c.h]} />
          </mesh>
          {mats.chipTop.get(c.key) ? (
            <mesh position={[0, 0, c.h + 0.0004]} material={mats.chipTop.get(c.key)} receiveShadow>
              <planeGeometry args={[c.s[0] * 0.98, c.s[1] * 0.98]} />
            </mesh>
          ) : null}
        </group>
      ))}
      {/* the wake-word chip lights: a glow on its top, a soft halo round it */}
      <group position={[WAKE_CHIP[0], WAKE_CHIP[1], bz + 0.0108]} visible={lit > 0.01}>
        <mesh material={mats.litFace}>
          <planeGeometry args={[0.083, 0.083]} />
        </mesh>
        <mesh material={mats.glow} position={[0, 0, 0.002]}>
          <planeGeometry args={[0.26, 0.26]} />
        </mesh>
      </group>
      {SHIELDS.map((s, i) => (
        <group key={i} position={[s.c[0], s.c[1], bz]}>
          <mesh
            geometry={roundedSlab(s.s[0], s.s[1], s.h, 0.012, 0.003)}
            material={mats.shield}
            castShadow
            receiveShadow
          />
          <mesh
            geometry={roundedPlane(s.s[0] - 0.008, s.s[1] - 0.008, 0.008)}
            material={mats.shieldTop}
            position={[0, 0, s.h + 0.0003]}
            receiveShadow
          />
        </group>
      ))}
      {CONNECTORS.map((c, i) => (
        <mesh key={i} position={[c.c[0], c.c[1], bz + 0.004]} material={mats.conn} castShadow>
          <boxGeometry args={[c.s[0], c.s[1], 0.008]} />
        </mesh>
      ))}
      {/* the bracket that holds the battery and display connectors, with its screws */}
      <mesh
        geometry={roundedSlab(0.44, 0.075, 0.003, 0.012, 0.001)}
        material={mats.bracket}
        position={[0.13, 0.205, bz + 0.0125]}
        castShadow
        receiveShadow
      />
      {[
        [-0.065, 0.205],
        [0.325, 0.205],
        [0.39, 0.87],
        [-0.395, 0.165],
        [0.39, 0.165],
        [-0.02, 0.6],
      ].map(([x, y], i) => (
        <Screw key={i} p={[x, y, i < 2 ? bz + 0.0155 : bz]} mat={mats.screw} slot={mats.slot} />
      ))}

      {/* camera modules in the board's notch (their backs, with flexes to J8) */}
      {[
        {c: [-0.315, 0.79], s: 0.15, h: 0.07},
        {c: [-0.15, 0.79], s: 0.15, h: 0.07},
        {c: [-0.315, 0.62], s: 0.12, h: 0.06},
      ].map((m, i) => (
        <group key={i} position={[m.c[0], m.c[1], FLOOR]}>
          <mesh geometry={roundedSlab(m.s, m.s, m.h, 0.012, 0.004)} material={mats.camera} castShadow receiveShadow />
          <mesh
            geometry={roundedPlane(m.s * 0.62, m.s * 0.62, 0.006)}
            material={mats.cameraTop}
            position={[0, 0, m.h + 0.0004]}
          />
        </group>
      ))}
      <Flex a={[-0.15, 0.79]} b={[-0.02, 0.85]} z={FLOOR + 0.075} w={0.04} mat={mats.flex} end={mats.flexEnd} />
      <Flex a={[-0.315, 0.62]} b={[-0.03, 0.57]} z={FLOOR + 0.064} w={0.035} mat={mats.flex} end={mats.flexEnd} />

      {/* battery: foil pouch, printed label, pull tabs, its flex up to J2 */}
      <group position={[(BATTERY[0] + BATTERY[2]) / 2, (BATTERY[1] + BATTERY[3]) / 2, FLOOR]}>
        <mesh
          geometry={roundedSlab(BATTERY[2] - BATTERY[0], BATTERY[3] - BATTERY[1], batT, 0.03, 0.008)}
          material={mats.battery}
          castShadow
          receiveShadow
        />
        <mesh
          geometry={roundedPlane(BATTERY[2] - BATTERY[0] - 0.04, BATTERY[3] - BATTERY[1] - 0.06, 0.012)}
          material={mats.label}
          position={[0, 0, batT + 0.0004]}
          receiveShadow
        />
        {[-0.2, 0.2].map((x) => (
          <mesh
            key={x}
            position={[x, -(BATTERY[3] - BATTERY[1]) / 2 + 0.01, batT + 0.001]}
            material={mats.tab}
            castShadow
          >
            <boxGeometry args={[0.07, 0.07, 0.0015]} />
          </mesh>
        ))}
      </group>
      <Flex a={[0.0, 0.09]} b={[0.0, 0.205]} z={bz + 0.011} w={0.08} mat={mats.flex} end={mats.flexEnd} />
      {/* the long flex down the right side to the port, and along the bottom */}
      <Flex a={[0.418, -0.79]} b={[0.418, 0.14]} z={FLOOR + 0.004} w={0.026} mat={mats.flex} end={mats.flexEnd} />
      <Flex a={[0.06, -0.785]} b={[0.43, -0.785]} z={FLOOR + 0.004} w={0.024} mat={mats.flex} end={mats.flexEnd} />
      {/* bottom: haptic engine, port, speaker */}
      <mesh
        geometry={roundedSlab(0.28, 0.08, 0.04, 0.012, 0.004)}
        material={mats.haptic}
        position={[-0.25, -0.85, FLOOR]}
        castShadow
        receiveShadow
      />
      <mesh
        geometry={roundedSlab(0.11, 0.06, 0.032, 0.02, 0.006)}
        material={mats.port}
        position={[0.0, -0.86, FLOOR]}
        castShadow
        receiveShadow
      />
      <group position={[0.25, -0.85, FLOOR]}>
        <mesh geometry={roundedSlab(0.28, 0.08, 0.036, 0.012, 0.004)} material={mats.conn} castShadow receiveShadow />
        <mesh geometry={roundedPlane(0.24, 0.05, 0.006)} material={mats.speaker} position={[0, 0, 0.0365]} />
      </group>
      <Screw p={[-0.39, -0.85, FLOOR + 0.04]} mat={mats.screw} slot={mats.slot} />
      <Screw p={[0.395, -0.86, FLOOR + 0.004]} mat={mats.screw} slot={mats.slot} />
    </group>
  );
};
