import React, {useEffect, useMemo} from 'react';
import * as THREE from 'three';
import {CHARGE, CITY, MOODS, REAL, section, type Mood} from '../../theme';
import {raw, roundedBox} from '../plaster';
import {CITY_LAYOUT, cityIntersection} from './CitySlice';
import {cutMaterial} from './cutLook';
import {FlatInk} from './HighwaySlice';

type V3 = [number, number, number];
const L = CITY_LAYOUT;
const FT = 0.3048;

/*
 * No. 019 (`light-countdown`): the street hardware of the city slice's two dressings, and the orange system's small
 * pieces. Street hardware carries no text, sticker, seal or maker mark (style guide § 3 Generic devices, v0.18.15).
 *  - `CountdownBox` (N1): a two-digit seven-segment countdown display on the mast arm beside the middle head, facing the
 *    camera; digits flat emissive in `signalRed` / `signalGreen` (never bloomed), dark while yellow.
 *  - `countdownGhostLines` (N9): the same box as § 3 ghost lines, and its dashed seven-segment ghost digits.
 *  - `LoopDetectors` (N2): two 6 × 6 ft sawcut loops behind the stop line (lanes 2 and 3), their lead-ins to the curb and
 *    a pull box in the sidewalk, in the black crack sealant `CITY.seal`.
 *  - `ControllerCabinet` (N2): the signal cabinet at the mast pole's foot, cut open on the camera side (hatched cut rim,
 *    ink edge), a generic controller inside with relays and one LED (orange once a call came in: the system's bleed).
 *  - `GlowCore` / `GlowHalo` / `InkBar`: core-only dots, one halo per bunch (§ 5: touching dots share one halo) and flat
 *    ink bars for the time tape.
 */

// ---------------------------------------------------------------- the countdown box (N1)

/**
 * The box's size and its digits (m): a panel 0.86 × 0.7 with two digits 0.5 tall (a real countdown module's scale;
 * ≈ 35 px at `signal`, ≈ 80 px at `count`).
 */
export const COUNTDOWN_BOX = {w: 0.86, h: 0.7, d: 0.18, digitH: 0.5, digitW: 0.28, pitch: 0.36, seg: 0.065};

/**
 * The box's centre (world) for a stop line `S`: on the arm beside the middle head, on its left (between the lane 1 and
 * lane 2 heads, nearer the queues in a vertical frame), at the heads' height.
 */
export const countdownSpot = (S: number): V3 => {
  const sig = cityIntersection(S).signal;
  return [(L.lanes[0] + L.lanes[1]) / 2, sig.headY, sig.z];
};

/** Which segments light for a digit (a top, b upper right, c lower right, d bottom, e lower left, f upper left, g middle). */
const SEGS: Record<string, string> = {
  '0': 'abcdef',
  '1': 'bc',
  '2': 'abged',
  '3': 'abgcd',
  '4': 'fgbc',
  '5': 'afgcd',
  '6': 'afgedc',
  '7': 'abc',
  '8': 'abcdefg',
  '9': 'abcdfg',
};

/** A segment's centre (digit-local, m), length and whether it runs across (true) or up. */
const segRect = (s: string, w: number, h: number, th: number): {c: [number, number]; len: number; across: boolean} => {
  const hx = w / 2 - th / 2;
  const hy = h / 2 - th / 2;
  const across = s === 'a' || s === 'd' || s === 'g';
  const len = across ? w - th * 1.2 : h / 2 - th * 1.2;
  const c: Record<string, [number, number]> = {
    a: [0, hy],
    g: [0, 0],
    d: [0, -hy],
    b: [hx, hy / 2],
    c: [hx, -hy / 2],
    e: [-hx, -hy / 2],
    f: [-hx, hy / 2],
  };
  return {c: c[s], len, across};
};

/** The digits to show for a number (no leading zero, right-aligned in two places). */
export const countdownDigits = (n: number | null): [string | null, string | null] => {
  if (n === null) return [null, null];
  const s = String(Math.max(0, Math.min(99, Math.round(n))));
  return s.length === 1 ? [null, s] : [s[0], s[1]];
};

/** N1: the countdown box (see the file comment). `n` null: dark (yellow, off). */
export const CountdownBox: React.FC<{mood: Mood; position: V3; n: number | null; color: 'red' | 'green'}> = ({
  mood,
  position,
  n,
  color,
}) => {
  const B = COUNTDOWN_BOX;
  const mats = useMemo(
    () => ({
      housing: new THREE.MeshPhysicalMaterial({color: raw(CITY.signalHousing), roughness: 0.45, clearcoat: 0.3}),
      face: new THREE.MeshStandardMaterial({color: raw(CITY.signalHousing), roughness: 0.25, metalness: 0.1}),
      red: new THREE.MeshStandardMaterial({color: raw(CITY.lensRed), roughness: 0.3, emissive: raw(section.signalRed)}),
      green: new THREE.MeshStandardMaterial({color: raw(CITY.lensGreen), roughness: 0.3, emissive: raw(section.signalGreen)}),
    }),
    [],
  );
  useEffect(() => () => Object.values(mats).forEach((m) => m.dispose()), [mats]);
  // flat emissive like the lit lenses (CitySlice: 1.1 / exposure), never bloomed
  mats.red.emissiveIntensity = 1.1 / MOODS[mood].exposure;
  mats.green.emissiveIntensity = 1.1 / MOODS[mood].exposure;
  const geo = useMemo(() => roundedBox(B.w, B.h, B.d, 0.02, 3), [B.w, B.h, B.d]);
  useEffect(() => () => geo.dispose(), [geo]);
  const digits = countdownDigits(n);
  const lit = color === 'red' ? mats.red : mats.green;
  return (
    <group position={position}>
      <mesh geometry={geo} material={mats.housing} castShadow />
      <mesh material={mats.face} position={[0, 0, B.d / 2 + 0.002]}>
        <planeGeometry args={[B.w - 0.06, B.h - 0.06]} />
      </mesh>
      {/* the hanger up to the arm (the arm runs 0.95 above the heads' centre) */}
      <mesh material={mats.housing} position={[0, (0.95 + B.h / 2) / 2, -0.02]}>
        <cylinderGeometry args={[0.03, 0.03, 0.95 - B.h / 2, 10]} />
      </mesh>
      {digits.map((d, i) =>
        d === null
          ? null
          : SEGS[d].split('').map((s) => {
              const r = segRect(s, B.digitW, B.digitH, B.seg);
              return (
                <mesh
                  key={`${i}${s}`}
                  material={lit}
                  position={[(i === 0 ? -1 : 1) * (B.pitch / 2) + r.c[0], r.c[1], B.d / 2 + 0.004]}
                >
                  <planeGeometry args={r.across ? [r.len, B.seg] : [B.seg, r.len]} />
                </mesh>
              );
            }),
      )}
    </group>
  );
};

/**
 * N9: the countdown box's ghost outline (world polylines): the front face and the hanger (the box is too thin for its
 * depth edges to read apart at 3 px: they stepped the top line).
 */
export const countdownGhostLines = (S: number): V3[][] => {
  const B = COUNTDOWN_BOX;
  const [x, y, z] = countdownSpot(S);
  const x0 = x - B.w / 2;
  const x1 = x + B.w / 2;
  const y0 = y - B.h / 2;
  const y1 = y + B.h / 2;
  const zf = z + B.d / 2;
  return [
    [
      [x0, y1, zf],
      [x1, y1, zf],
      [x1, y0, zf],
      [x0, y0, zf],
      [x0, y1, zf],
    ],
    [
      [x, y1, zf],
      [x, y + 0.95, zf],
    ],
  ];
};

/**
 * N9 (§ 3 ghost digits): one digit's dashed seven-segment outlines inside the ghost box (world polylines): each segment's
 * outline as a closed rectangle `segW` wide, the digit centred in the box (one digit, as large as the box allows).
 */
export const ghostDigitLines = (S: number, d: string, segW = 0.075): V3[][] => {
  const B = COUNTDOWN_BOX;
  const [x, y, z] = countdownSpot(S);
  const zf = z + B.d / 2 + 0.01;
  const w = B.digitW + 0.08;
  const h = B.digitH + 0.04;
  // the segments' outlines never touch (a gap ≈ 1 cm at each corner), so no two dashed lines stack
  const hx = w / 2 - segW / 2;
  const hy = h / 2 - segW / 2;
  const across = w - 2.4 * segW;
  const up = h / 2 - 1.8 * segW;
  const C: Record<string, [number, number]> = {a: [0, hy], g: [0, 0], d: [0, -hy], b: [hx, hy / 2], c: [hx, -hy / 2], e: [-hx, -hy / 2], f: [-hx, hy / 2]};
  return (SEGS[d] ?? '').split('').map((s) => {
    const isAcross = s === 'a' || s === 'd' || s === 'g';
    const hw = (isAcross ? across : segW) / 2;
    const hh = (isAcross ? segW : up) / 2;
    const px = x + C[s][0];
    const py = y + C[s][1];
    return [
      [px - hw, py + hh, zf],
      [px + hw, py + hh, zf],
      [px + hw, py - hh, zf],
      [px - hw, py - hh, zf],
      [px - hw, py + hh, zf],
    ] as V3[];
  });
};

// ---------------------------------------------------------------- loops and the cabinet (N2)

/** A loop's sawcut square (world, y = road): lane 2 or 3, its x range and z range (6 × 6 ft, 0.9 m behind the stop line). */
export const loopRect = (S: number, lane: number) => {
  const side = 6 * FT;
  const cx = L.lanes[lane - 1] ?? L.lanes[2];
  const zNear = -S + 0.9;
  return {x: [cx - side / 2, cx + side / 2] as [number, number], z: [zNear, zNear + side] as [number, number]};
};

/** The pull box in the right sidewalk (centre, world) where the lead-ins end. */
export const pullBoxSpot = (S: number): V3 => [L.curbR[1] + 0.55, L.grade, -S + 0.7];

/** Where the cabinet stands: 'near' (the near right corner, by the loops) or 'pole' (at the mast pole's foot). */
export type CabinetSpot = 'near' | 'pole';

/**
 * The controller cabinet's box (world): min and max corners, 1.2 × 1.5 × 0.6 m on a pad. 'near' (default): on the near
 * right corner's sidewalk just past the stop line, so the loops, the lead-in and the open cabinet share one framing;
 * 'pole': at the mast pole's foot on the far corner (≈ 12 m from the loops on screen at the fixed angle).
 */
export const cabinetBox = (S: number, at: CabinetSpot = 'near'): {min: V3; max: V3} => {
  const I = cityIntersection(S);
  if (at === 'pole') {
    const sig = I.signal;
    return {min: [sig.x + 0.45, L.grade + 0.1, sig.z - 0.3], max: [sig.x + 1.65, L.grade + 1.6, sig.z + 0.3]};
  }
  const z = (I.stopFar + I.crossNear) / 2;
  return {min: [L.curbR[1] + 1.4, L.grade + 0.1, z - 0.3], max: [L.curbR[1] + 2.6, L.grade + 1.6, z + 0.3]};
};

/** The controller's LED (world), on the controller's face inside the open cabinet. */
export const cabinetLed = (S: number, at: CabinetSpot = 'near'): V3 => {
  const {min, max} = cabinetBox(S, at);
  return [min[0] + 0.42, min[1] + 0.86, max[2] - 0.08];
};

/**
 * The call's cable route (world polyline) from a loop to the cabinet: the loop's near right corner, the lead-in sawcut
 * across to the curb, the pull box, along the curb's top edge to the corner, across the cross street (the conduit under
 * it) and up to the cabinet's foot.
 */
export const callRoute = (S: number, lane: number, at: CabinetSpot = 'near'): V3[] => {
  const I = cityIntersection(S);
  const r = loopRect(S, lane);
  const pb = pullBoxSpot(S);
  const cab = cabinetBox(S, at);
  const lead = lane === 3 ? -S + 0.65 : -S + 0.45;
  const y = 0.03;
  const g = L.grade + 0.03;
  const curbX = L.curbR[1] + 0.12;
  const head: V3[] = [
    [r.x[1], y, r.z[0]],
    [r.x[1], y, lead],
    [L.curbR[0], y, lead],
    [pb[0], g, lead],
  ];
  const into: V3[] = [
    [cab.min[0] + 0.3, g, cab.max[2] + 0.25],
    [cab.min[0] + 0.3, cab.min[1] + 0.3, cab.max[2] + 0.02],
  ];
  if (at === 'near') return [...head, [pb[0], g, cab.max[2] + 0.25], ...into];
  return [
    ...head,
    [pb[0], g, pb[2] - 0.3],
    [curbX, g, pb[2] - 0.6],
    [curbX, g, I.crossNear],
    [curbX, y, I.crossNear - 0.3],
    [curbX, y, I.crossFar + 0.3],
    [curbX, g, I.crossFar],
    [curbX, g, cab.max[2] + 0.25],
    ...into,
  ];
};

/** The decision's route (world polyline): out of the cabinet, up the mast pole and along the arm to the left head. */
export const decisionRoute = (S: number, at: CabinetSpot = 'near'): V3[] => {
  const I = cityIntersection(S);
  const sig = I.signal;
  const cab = cabinetBox(S, at);
  const armY = sig.headY + 0.95;
  // riding on the pole's camera side (its radius ≈ 0.15) and on the arm's front
  const zf = sig.z + 0.2;
  const g = L.grade + 0.03;
  const curbX = L.curbR[1] + 0.12;
  const out: V3[] = [
    [cab.min[0] + 0.3, cab.min[1] + 0.3, cab.max[2] + 0.02],
    [cab.min[0] + 0.3, g, cab.max[2] + 0.25],
  ];
  // from the near corner: along the curb, across the cross street (the conduit under it) to the pole's foot
  const across: V3[] =
    at === 'near'
      ? [
          [curbX, g, cab.max[2] + 0.25],
          [curbX, g, I.crossNear],
          [curbX, 0.03, I.crossNear - 0.3],
          [curbX, 0.03, I.crossFar + 0.3],
          [curbX, g, I.crossFar],
          [curbX, g, zf],
        ]
      : [];
  return [...out, ...across, [sig.x + 0.1, g, zf], [sig.x + 0.1, armY - 0.1, zf], [L.lanes[0], armY - 0.12, sig.z + 0.14]];
};

/** N2: the loops' sawcuts, their lead-ins and the pull box (no text on the lid). */
export const LoopDetectors: React.FC<{S: number; lanes: number[]}> = ({S, lanes}) => {
  const mats = useMemo(
    () => ({
      seal: new THREE.MeshStandardMaterial({color: raw(CITY.seal), roughness: 0.6, polygonOffset: true, polygonOffsetFactor: -2}),
      lid: new THREE.MeshStandardMaterial({color: raw(CITY.cover), roughness: 0.55, metalness: 0.3}),
    }),
    [],
  );
  useEffect(() => () => Object.values(mats).forEach((m) => m.dispose()), [mats]);
  const W = 0.035;
  const strip = (a: [number, number], b: [number, number], y: number, k: string) => {
    const dx = b[0] - a[0];
    const dz = b[1] - a[1];
    const len = Math.hypot(dx, dz);
    return (
      <mesh
        key={k}
        material={mats.seal}
        position={[(a[0] + b[0]) / 2, y, (a[1] + b[1]) / 2]}
        rotation={[-Math.PI / 2, 0, -Math.atan2(dz, dx)]}
        receiveShadow
      >
        <planeGeometry args={[len + W, W]} />
      </mesh>
    );
  };
  const pb = pullBoxSpot(S);
  return (
    <group>
      {lanes.map((lane) => {
        const r = loopRect(S, lane);
        const lead = lane === 3 ? -S + 0.65 : -S + 0.45;
        const c: [number, number][] = [
          [r.x[0], r.z[0]],
          [r.x[1], r.z[0]],
          [r.x[1], r.z[1]],
          [r.x[0], r.z[1]],
        ];
        return (
          <group key={lane}>
            {c.map((p, i) => strip(p, c[(i + 1) % 4], 0.004, `e${i}`))}
            {strip([r.x[1], r.z[0]], [r.x[1], lead], 0.004, 'l0')}
            {strip([r.x[1], lead], [L.curbR[0], lead], 0.004, 'l1')}
          </group>
        );
      })}
      {/* the pull box: a plain cast-iron lid flush in the sidewalk */}
      <mesh material={mats.lid} position={[pb[0], L.grade + 0.004, pb[2]]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[0.45, 0.7]} />
      </mesh>
    </group>
  );
};

/**
 * N2: the controller cabinet, cut open on its camera (+z) side: shell walls with hatched cut rims and an ink edge, a
 * generic controller (`CHARGE.cabinetDark`) with a row of relays and one LED. `led`: 0 off (`ledOff`) → 1 orange (the
 * system), `flash` 0 → 1 a brighter swell. No text, sticker or maker mark.
 */
export const ControllerCabinet: React.FC<{S: number; at?: CabinetSpot; mood: Mood; led: number; flash: number; ink: number}> = ({
  S,
  at = 'near',
  led,
  flash,
  ink,
}) => {
  const {min, max} = cabinetBox(S, at);
  const mats = useMemo(
    () => ({
      shell: new THREE.MeshStandardMaterial({color: raw(CITY.mast), roughness: 0.55, metalness: 0.35}),
      inner: new THREE.MeshStandardMaterial({color: raw(CITY.mast), roughness: 0.8, metalness: 0.1}),
      pad: new THREE.MeshStandardMaterial({color: raw(CITY.gutter), roughness: 0.9}),
      controller: new THREE.MeshStandardMaterial({color: raw(CHARGE.cabinetDark), roughness: 0.6}),
      relay: new THREE.MeshStandardMaterial({color: raw(REAL.frame), roughness: 0.6}),
      ledOff: new THREE.MeshStandardMaterial({color: raw(section.ledOff), roughness: 0.4}),
      ledOn: new THREE.MeshBasicMaterial({color: raw(section.orange), transparent: true, toneMapped: false}),
      ledHalo: new THREE.MeshBasicMaterial({color: raw(section.orange), transparent: true, depthWrite: false}),
      cut: cutMaterial(),
    }),
    [],
  );
  useEffect(() => () => Object.values(mats).forEach((m) => m.dispose()), [mats]);
  mats.ledOn.opacity = Math.max(0, Math.min(1, led));
  // § 5: the halo stays at 25 % authored; the flash swells its size, not its strength
  mats.ledHalo.opacity = 0.25 * led;
  const T = 0.03;
  const [x0, y0, z0] = min;
  const [x1, y1, z1] = max;
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;
  const cz = (z0 + z1) / 2;
  // [size, centre] of each wall; the +z face is open (cut), every wall's +z end face is the hatched cut
  const walls: [V3, V3][] = [
    [
      [x1 - x0, y1 - y0, T],
      [cx, cy, z0 + T / 2],
    ],
    [
      [T, y1 - y0, z1 - z0],
      [x0 + T / 2, cy, cz],
    ],
    [
      [T, y1 - y0, z1 - z0],
      [x1 - T / 2, cy, cz],
    ],
    [
      [x1 - x0, T, z1 - z0],
      [cx, y1 - T / 2, cz],
    ],
    [
      [x1 - x0, T, z1 - z0],
      [cx, y0 + T / 2, cz],
    ],
  ];
  // the side, top and bottom walls end at the cut (their +z face hatched); the back wall's +z face is the inside
  const six = [mats.shell, mats.shell, mats.shell, mats.shell, mats.cut, mats.inner];
  const back = [mats.inner, mats.inner, mats.inner, mats.inner, mats.inner, mats.shell];
  const ledP = cabinetLed(S, at);
  const zc = z1 + 0.003;
  const rim: V3[] = [
    [x0, y0, zc],
    [x1, y0, zc],
    [x1, y1, zc],
    [x0, y1, zc],
    [x0, y0, zc],
  ];
  const inner: V3[] = [
    [x0 + T, y0 + T, zc],
    [x1 - T, y0 + T, zc],
    [x1 - T, y1 - T, zc],
    [x0 + T, y1 - T, zc],
    [x0 + T, y0 + T, zc],
  ];
  return (
    <group>
      {/* the concrete pad */}
      <mesh material={mats.pad} position={[cx, L.grade + 0.05, cz]} castShadow receiveShadow>
        <boxGeometry args={[x1 - x0 + 0.2, 0.1, z1 - z0 + 0.2]} />
      </mesh>
      {walls.map(([s, c], i) => (
        <mesh key={i} position={c} material={i === 0 ? back : six} castShadow receiveShadow>
          <boxGeometry args={s} />
        </mesh>
      ))}
      {/* inside: a shelf, the controller, a row of relays */}
      <mesh material={mats.inner} position={[cx, y0 + 0.7, cz]} receiveShadow>
        <boxGeometry args={[x1 - x0 - 2 * T, 0.02, z1 - z0 - 2 * T]} />
      </mesh>
      <mesh
        geometry={roundedBox(0.62, 0.32, 0.34, 0.015, 2)}
        material={mats.controller}
        position={[x0 + 0.42, y0 + 0.87, cz + 0.02]}
        castShadow
      />
      {[0, 1, 2, 3, 4].map((k) => (
        <mesh key={k} material={mats.relay} position={[x0 + 0.2 + k * 0.17, y0 + 1.22, cz + 0.04]} castShadow>
          <boxGeometry args={[0.08, 0.12, 0.08]} />
        </mesh>
      ))}
      <mesh material={mats.relay} position={[x1 - 0.22, y0 + 0.45, cz]} castShadow>
        <boxGeometry args={[0.22, 0.42, 0.3]} />
      </mesh>
      {/* the LED: dark, then orange (its own small halo, ≤ 25 %, swelling on the decision) */}
      <mesh material={mats.ledOff} position={ledP}>
        <circleGeometry args={[0.022, 16]} />
      </mesh>
      {led > 0.003 ? (
        <>
          <mesh material={mats.ledOn} position={[ledP[0], ledP[1], ledP[2] + 0.002]} userData={{glow: true}}>
            <circleGeometry args={[0.024 * (1 + 0.4 * flash), 16]} />
          </mesh>
          <mesh material={mats.ledHalo} position={[ledP[0], ledP[1], ledP[2] + 0.003]} userData={{glow: true}}>
            <circleGeometry args={[0.06 * (1 + 0.6 * flash), 20]} />
          </mesh>
        </>
      ) : null}
      <FlatInk points={rim} width={0.012 * ink} />
      <FlatInk points={inner} width={0.008 * ink} />
    </group>
  );
};

// ---------------------------------------------------------------- glow and ink primitives (N6, N7)

const unitSphere = new THREE.SphereGeometry(1, 16, 12);
const UP = new THREE.Vector3(0, 1, 0);

const useOrange = () => {
  const mats = useMemo(
    () => ({
      core: new THREE.MeshBasicMaterial({color: raw(section.orange), transparent: true, fog: false}),
      halo: new THREE.MeshBasicMaterial({color: raw(section.orange), transparent: true, depthWrite: false, fog: false}),
    }),
    [],
  );
  useEffect(() => () => Object.values(mats).forEach((m) => m.dispose()), [mats]);
  return mats;
};

/** A node dot's core only (its bunch carries the halo). */
export const GlowCore: React.FC<{at: V3; radius: number; glow?: number}> = ({at, radius, glow = 1}) => {
  const m = useOrange();
  const g = Math.max(0, Math.min(1, glow));
  m.core.opacity = g;
  if (g < 0.003) return null;
  return <mesh geometry={unitSphere} material={m.core} position={at} scale={radius} userData={{glow: true}} renderOrder={4} />;
};

/** One halo (25 % × glow) round a bunch: a capsule from a to b, `radius` wide. */
export const GlowHalo: React.FC<{a: V3; b: V3; radius: number; glow?: number}> = ({a, b, radius, glow = 1}) => {
  const m = useOrange();
  const g = Math.max(0, Math.min(1, glow));
  m.halo.opacity = 0.25 * g;
  if (g < 0.003) return null;
  const va = new THREE.Vector3(...a);
  const vb = new THREE.Vector3(...b);
  const d = vb.clone().sub(va);
  const len = d.length();
  const mid = va.clone().add(vb).multiplyScalar(0.5);
  const q = len > 1e-5 ? new THREE.Quaternion().setFromUnitVectors(UP, d.normalize()) : new THREE.Quaternion();
  // a capsule as one shape: the side and two end caps, drawn once (no overlap, so the sum stays at 25 %)
  if (len < 1e-4) return <mesh geometry={unitSphere} material={m.halo} position={a} scale={radius} userData={{glow: true}} renderOrder={5} />;
  return (
    <mesh position={mid.toArray() as V3} quaternion={q} userData={{glow: true}} renderOrder={5} material={m.halo}>
      <capsuleGeometry args={[radius, len, 6, 16]} />
    </mesh>
  );
};

/**
 * No. 019 (review: a height cue for the air tape): a faint neutral shadow strip on the road under a line, `cutLine` at
 * `opacity` (default 0.18), from a to b (both on the road), `w` wide. Never orange.
 */
export const RoadShadow: React.FC<{a: V3; b: V3; w: number; opacity?: number}> = ({a, b, w, opacity = 0.18}) => {
  const mat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: raw(section.cutLine),
        transparent: true,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -3,
      }),
    [],
  );
  useEffect(() => () => mat.dispose(), [mat]);
  mat.opacity = Math.max(0, Math.min(1, opacity));
  const dx = b[0] - a[0];
  const dz = b[2] - a[2];
  const len = Math.hypot(dx, dz);
  if (len < 1e-4 || opacity < 0.005) return null;
  return (
    <mesh
      material={mat}
      position={[(a[0] + b[0]) / 2, a[1], (a[2] + b[2]) / 2]}
      rotation={[-Math.PI / 2, 0, -Math.atan2(dz, dx)]}
      renderOrder={3}
    >
      <planeGeometry args={[len, w]} />
    </mesh>
  );
};

/**
 * A flat ink bar (`cutLine`, unlit) from a to b, `w` thick (m), drawn over the set; `depth`: hidden behind what stands in
 * front (a dimension line that passes behind a car).
 */
export const InkBar: React.FC<{a: V3; b: V3; w: number; mood: Mood; opacity?: number; depth?: boolean}> = ({
  a,
  b,
  w,
  mood,
  opacity = 1,
  depth = false,
}) => {
  const mat = useMemo(
    () => new THREE.MeshBasicMaterial({color: raw(section.cutLine), transparent: true, depthTest: depth, toneMapped: false}),
    [depth],
  );
  useEffect(() => () => mat.dispose(), [mat]);
  mat.color.copy(raw(section.cutLine)).multiplyScalar(1 / MOODS[mood].exposure);
  mat.opacity = Math.max(0, Math.min(1, opacity));
  const va = new THREE.Vector3(...a);
  const vb = new THREE.Vector3(...b);
  const d = vb.clone().sub(va);
  const len = d.length();
  if (len < 1e-5 || opacity < 0.01) return null;
  const q = new THREE.Quaternion().setFromUnitVectors(UP, d.normalize());
  return (
    <mesh position={va.add(vb).multiplyScalar(0.5).toArray() as V3} quaternion={q} material={mat} renderOrder={depth ? 6 : 24}>
      <boxGeometry args={[w, len + w, w]} />
    </mesh>
  );
};

// ---------------------------------------------------------------- the video-detection camera (owner note, No. 019)

/** The detection camera's mount on the mast arm (world): under the arm between the lane 2 and lane 3 heads. */
export const detectCamSpot = (S: number): V3 => {
  const sig = cityIntersection(S).signal;
  return [(L.lanes[1] + L.lanes[2]) / 2, sig.headY + 0.95 - 0.22, sig.z + 0.05];
};

/**
 * The camera's detection zone on a lane (world, on the road): the lane's width less 0.3 m, from 0.9 m behind the stop line
 * back 6 m up the approach (a car entering it, front wheels first, calls).
 */
export const camZone = (S: number, lane: number) => {
  const cx = L.lanes[lane - 1] ?? L.lanes[2];
  const hw = 3.3 / 2 - 0.3;
  return {x: [cx - hw, cx + hw] as [number, number], z: [-S + 0.9, -S + 6.9] as [number, number]};
};

/**
 * A camera call's wired route (world polyline): out of the camera along the arm to the pole, down the mast, then along the
 * cable route to the cabinet (the decision's route run backward from the pole's top).
 */
export const camRoute = (S: number, at: CabinetSpot = 'near'): V3[] => {
  const d = decisionRoute(S, at);
  const c = detectCamSpot(S);
  const sig = cityIntersection(S).signal;
  const back = d.slice(0, -1).reverse();
  // from the camera up its bracket onto the arm's front, along the arm to the pole, then down the mast (the decision's
  // route backward)
  const armY = sig.headY + 0.95 - 0.12;
  return [[c[0], c[1], c[2] + 0.12], [c[0], armY, sig.z + 0.14], [sig.x + 0.1, armY, sig.z + 0.2], ...back];
};

/**
 * The generic video-detection camera (owner note): a small dark housing with a short sun hood on a bracket under the mast
 * arm, aimed down the approach lanes. No logo, brand or text (§ 3 Generic devices, street hardware).
 */
export const DetectCam: React.FC<{S: number}> = ({S}) => {
  const p = detectCamSpot(S);
  const mats = useMemo(
    () => ({
      housing: new THREE.MeshPhysicalMaterial({color: raw(CITY.signalHousing), roughness: 0.45, clearcoat: 0.3}),
      glass: new THREE.MeshStandardMaterial({color: raw(REAL.tab), roughness: 0.15, metalness: 0.2}),
    }),
    [],
  );
  useEffect(() => () => Object.values(mats).forEach((m) => m.dispose()), [mats]);
  const body = useMemo(() => roundedBox(0.16, 0.15, 0.42, 0.02, 2), []);
  useEffect(() => () => body.dispose(), [body]);
  // pitched down toward the approach (≈ 18°: a 7 m mount looking ≈ 20 m up the lanes)
  return (
    <group position={p}>
      <mesh material={mats.housing} position={[0, 0.13, -0.02]}>
        <cylinderGeometry args={[0.025, 0.025, 0.2, 10]} />
      </mesh>
      <group rotation={[0.32, 0, 0]}>
        <mesh geometry={body} material={mats.housing} castShadow />
        {/* the sun hood: a thin plate over the front, reaching past the lens */}
        <mesh material={mats.housing} position={[0, 0.09, 0.08]} castShadow>
          <boxGeometry args={[0.2, 0.012, 0.5]} />
        </mesh>
        <mesh material={mats.glass} position={[0, 0, 0.212]}>
          <circleGeometry args={[0.045, 20]} />
        </mesh>
      </group>
    </group>
  );
};
