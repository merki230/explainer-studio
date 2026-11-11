import React, {useEffect, useMemo} from 'react';
import * as THREE from 'three';
import {MOODS, REAL, STREET, theme, WINTER, CHARGE, type Mood} from '../../theme';
import {raw, roundedBox} from '../plaster';
import {CUT_LIT, HOUSE, HOUSE_SNOW} from '../real/HouseHeat';
import {cutMaterial, CutOutline, INK, InkLine, type Rect} from './cutLook';
import type {MoodPalette} from './moods';
import {House} from './StreetSlice';

type V3 = [number, number, number];

/*
 * No. 018 (N1, N7): one single-storey US house with a basement, cut open front to back like a sheet in a drawing set
 * (`HOUSE` layout, world metres). The cut ground block (earth, hatched on its front and end faces), the basement's
 * concrete foundation walls and slab, the floor deck (cut, with the supply trunk's boot through it), the living-room
 * walls (back, left with a window, right; cut at the front), the ceiling slab, the gable roof (ridge front to back: two
 * roof slabs and the attic, cut at the front, ink line), siding outside, snow on the roof. Neighbours' houses far
 * behind, windows lit at Night. No gas meter, no vent, no chimney. Everything else (furniture, heat parts) is the scene's.
 */

/** The neighbours: x, z of each block's centre, its siding (`STREET.sidings`). */
const NEIGHBOURS: [number, number, number][] = [
  [-40, -14, 0],
  [16.5, -16, 2],
];

/** A box whose six faces each take a material ('+x', '-x', '+y', '-y', '+z', '-z'); cut faces push their rects. */
const box6 = (key: string, min: V3, max: V3, m: Partial<Record<'+x' | '-x' | '+y' | '-y' | '+z' | '-z', THREE.Material>>, dflt: THREE.Material, cut: THREE.Material, cutFaces: string, rects: Rect[]) => {
  const faces = ['+x', '-x', '+y', '-y', '+z', '-z'] as const;
  const mats = faces.map((f) => (cutFaces.includes(f) ? cut : (m[f] ?? dflt)));
  if (cutFaces.includes('+x')) rects.push([[max[0], min[1], min[2]], [max[0], max[1], max[2]]]);
  if (cutFaces.includes('-x')) rects.push([[min[0], min[1], min[2]], [min[0], max[1], max[2]]]);
  if (cutFaces.includes('+y')) rects.push([[min[0], max[1], min[2]], [max[0], max[1], max[2]]]);
  if (cutFaces.includes('+z')) rects.push([[min[0], min[1], max[2]], [max[0], max[1], max[2]]]);
  return (
    <mesh key={key} material={mats} position={[(min[0] + max[0]) / 2, (min[1] + max[1]) / 2, (min[2] + max[2]) / 2]} castShadow receiveShadow>
      <boxGeometry args={[max[0] - min[0], max[1] - min[1], max[2] - min[2]]} />
    </mesh>
  );
};

export type HouseShellProps = {
  mood: Mood;
  palette?: MoodPalette;
  /** × the ink weight (camera distance). */
  ink: number;
  /** The supply trunk's boot through the deck: its x span (the deck leaves a gap there at the cut face). */
  boot?: [number, number];
  /** Neighbours' houses far behind (default true). */
  neighbours?: boolean;
  /** Snow on the roof (default true). */
  roofSnow?: boolean;
};

/** N1: the house's structure and the cut ground (see the file comment). */
export const HouseShell: React.FC<HouseShellProps> = ({mood, palette, ink, boot, neighbours = true, roofSnow = true}) => {
  const m = palette ?? MOODS[mood];
  const mats = useMemo(() => {
    const std = (c: string, r = 0.9) => new THREE.MeshStandardMaterial({color: raw(c), roughness: r});
    return {
      cut: cutMaterial(),
      // brand v0.18.13 (Night whites): every lit cut face of this set read 245–248 under the Night key and the house's
      // practicals (the ground block, the basement's faces by the bulb, the ceiling and wall ends): × 0.96 on them
      cutLit: (() => {
        const c = cutMaterial();
        c.color.multiplyScalar(CUT_LIT);
        return c;
      })(),
      earth: std(m.earth, 1),
      concrete: std(CHARGE.concrete, 0.95),
      bsmtFloor: std(STREET.gravel, 0.95),
      siding: std(STREET.sidings[1], 0.85),
      roof: std(STREET.roof, 0.9),
      wall: std(m.wall, 0.95),
      floor: std(m.floor, 0.8),
      ceiling: std(m.wall, 0.95),
      attic: std(REAL.labDark, 1),
      joist: std(m.wood, 0.85),
      trim: std(m.trim, 0.6),
      glass: new THREE.MeshPhysicalMaterial({color: raw(REAL.carGlass), roughness: 0.08, metalness: 0.1, transparent: true, opacity: 0.28, depthWrite: false}),
      snow: new THREE.MeshStandardMaterial({color: raw(WINTER.snow).multiplyScalar(HOUSE_SNOW), roughness: 0.95}),
      snowShade: std(WINTER.snowShade, 0.95),
    };
  }, [m]);
  useEffect(() => () => Object.values(mats).forEach((x) => x.dispose()), [mats]);
  const H = HOUSE;
  const rects: Rect[] = [];
  const parts: React.ReactNode[] = [];
  const {x0, x1, zb, zf, wallT, foundT} = H;
  const ix0 = x0 + foundT;
  const ix1 = x1 - foundT;
  // ---- the cut ground: left, right (yard and driveway), behind, under the slab
  parts.push(box6('gl', [H.gx0, H.ground, H.gzb], [x0, 0, zf], {'+y': mats.earth}, mats.earth, mats.cutLit, '+z-x', rects));
  parts.push(box6('gr', [x1, H.ground, H.gzb], [H.gx1, 0, zf], {'+y': mats.earth}, mats.earth, mats.cutLit, '+z+x', rects));
  parts.push(box6('gb', [x0, H.ground, H.gzb], [x1, 0, zb], {}, mats.earth, mats.cutLit, '', rects));
  parts.push(box6('gu', [x0, H.ground, zb], [x1, H.slabBottom, zf], {}, mats.earth, mats.cutLit, '+z', rects));
  // ---- the basement: foundation walls (concrete, cut at the front), the slab
  parts.push(box6('fl', [x0, H.slabBottom, zb], [ix0, H.deckY, zf], {'+x': mats.concrete, '-x': mats.concrete}, mats.concrete, mats.cutLit, '+z', rects));
  parts.push(box6('fr', [ix1, H.slabBottom, zb], [x1, H.deckY, zf], {'+x': mats.concrete, '-x': mats.concrete}, mats.concrete, mats.cutLit, '+z', rects));
  parts.push(box6('fb', [ix0, H.slabBottom, zb], [ix1, H.deckY, zb + foundT], {}, mats.concrete, mats.cutLit, '', rects));
  parts.push(box6('sl', [ix0, H.slabBottom, zb + foundT], [ix1, H.bsmt, zf], {'+y': mats.bsmtFloor}, mats.concrete, mats.cutLit, '+z', rects));
  // ---- the floor deck: joists and subfloor between the basement and the living room, cut at the front (a gap for the boot)
  const deck = (key: string, a: number, b: number) =>
    parts.push(box6(key, [a, H.deckY, zb], [b, H.floor, zf], {'+y': mats.floor, '-y': mats.joist}, mats.joist, mats.cutLit, '+z', rects));
  if (boot) {
    deck('dk0', x0, boot[0]);
    deck('dk1', boot[1], x1);
    parts.push(box6('dkb', [boot[0], H.deckY, zb], [boot[1], H.floor, 1.7], {'+y': mats.floor, '-y': mats.joist}, mats.joist, mats.cutLit, '', rects));
  } else deck('dk', x0, x1);
  // ---- the living-room walls: back, right, left (with the window), siding outside, cut at the front
  const wt = H.wallTop;
  parts.push(box6('wb', [x0, H.floor, zb], [x1, wt, zb + wallT], {'+z': mats.wall}, mats.siding, mats.cutLit, '', rects));
  parts.push(box6('wr', [x1 - wallT, H.floor, zb + wallT], [x1, wt, zf], {'-x': mats.wall, '+x': mats.siding}, mats.siding, mats.cutLit, '+z', rects));
  const W = H.window;
  const left = (key: string, z0: number, z1: number, y0: number, y1: number, cutFront: boolean) =>
    parts.push(box6(key, [x0, y0, z0], [x0 + wallT, y1, z1], {'+x': mats.wall, '-x': mats.siding}, mats.siding, mats.cutLit, cutFront ? '+z' : '', rects));
  left('wl0', zb + wallT, W.z0, H.floor, wt, false);
  left('wl1', W.z1, zf, H.floor, wt, true);
  left('wl2', W.z0, W.z1, H.floor, W.y0, false);
  left('wl3', W.z0, W.z1, W.y1, wt, false);
  // the siding's lap lines on the right wall's outer face (thin dark strokes, every 0.2 m)
  const laps = [...Array(Math.floor((wt - H.floor) / 0.2)).keys()].map((i) => H.floor + 0.2 * (i + 1));
  // ---- the ceiling slab and the roof: two slabs and the attic, the gable wall at the back
  parts.push(box6('cl', [x0, wt, zb], [x1, H.ceilTop, zf], {'-y': mats.ceiling}, mats.joist, mats.cutLit, '+z', rects));
  const roofBase = H.ceilTop;
  const half = x1 - x0 + 2 * H.eave;
  const rise = H.ridge - roofBase;
  const run = half / 2;
  const slope = Math.atan2(rise, run);
  const slabLen = Math.hypot(run, rise);
  const zr0 = zb - H.roofBack;
  const roofD = zf - zr0;
  const rt = H.roofT;
  // a roof slab's cut face: a parallelogram at z = zf (hatched), ink round it
  const roofGeo = useMemo(() => {
    const s = new THREE.Shape();
    // the left slab in the x–y plane: from the eave to the ridge, rt thick (measured vertically)
    const vt = rt / Math.cos(slope);
    s.moveTo(-run, 0);
    s.lineTo(0, rise);
    s.lineTo(0, rise + vt);
    s.lineTo(-run, vt);
    s.closePath();
    const g = new THREE.ExtrudeGeometry(s, {depth: roofD, bevelEnabled: false});
    g.translate(0, 0, -roofD);
    return g;
  }, [run, rise, rt, slope, roofD]);
  useEffect(() => () => roofGeo.dispose(), [roofGeo]);
  const vt = rt / Math.cos(slope);
  const cx = (x0 + x1) / 2;
  const roofInk: V3[][] = [-1, 1].map((sd) => [
    [cx + sd * run, roofBase, zf + 0.002],
    [cx, roofBase + rise, zf + 0.002],
    [cx, roofBase + rise + vt, zf + 0.002],
    [cx + sd * run, roofBase + vt, zf + 0.002],
  ]);
  // the attic: a dark void under the slabs (its back gable wall), a thin insulation layer on the ceiling
  const atticGeo = useMemo(() => {
    const s = new THREE.Shape();
    const atWall = rise * (1 - (x1 - x0) / 2 / run);
    s.moveTo(x0, 0);
    s.lineTo(x0, atWall);
    s.lineTo(cx, rise);
    s.lineTo(x1, atWall);
    s.lineTo(x1, 0);
    s.closePath();
    return new THREE.ShapeGeometry(s);
  }, [x0, x1, cx, rise, run]);
  useEffect(() => () => atticGeo.dispose(), [atticGeo]);
  // snow on the slopes (a slab on each, its front face in the shade tone)
  const snowT = 0.13;
  // neighbours' windows (lit at Night)
  const winLit = useMemo(() => new THREE.MeshBasicMaterial({color: raw(theme.plasterGlass).multiplyScalar(0.92 / MOODS[mood].exposure)}), [mood]);
  const win = useMemo(() => new THREE.MeshPhysicalMaterial({color: raw(REAL.carGlass), roughness: 0.1, metalness: 0.2, clearcoat: 1}), []);
  const nSidings = useMemo(() => STREET.sidings.map((c) => new THREE.MeshStandardMaterial({color: raw(c), roughness: 0.85})), []);
  useEffect(() => () => [winLit, win, ...nSidings].forEach((x) => x.dispose()), [winLit, win, nSidings]);
  const night = mood === 'night';
  return (
    <group>
      {parts}
      {/* the window: trim frame, sill, glass (the night outside shows through) */}
      <group position={[x0 + wallT / 2, (W.y0 + W.y1) / 2, (W.z0 + W.z1) / 2]}>
        <mesh material={mats.glass} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[W.z1 - W.z0, W.y1 - W.y0]} />
        </mesh>
        {(
          [
            [0, (W.y1 - W.y0) / 2, 0, W.z1 - W.z0 + 0.08, 0.05],
            [0, -(W.y1 - W.y0) / 2, 0, W.z1 - W.z0 + 0.08, 0.05],
            [0, 0, (W.z1 - W.z0) / 2, 0.05, W.y1 - W.y0],
            [0, 0, -(W.z1 - W.z0) / 2, 0.05, W.y1 - W.y0],
            [0, 0, 0, 0.03, W.y1 - W.y0],
          ] as [number, number, number, number, number][]
        ).map(([x, y, z, a, b], i) => (
          <mesh key={i} material={mats.trim} position={[x + wallT / 2 + 0.01, y, z]} rotation={[0, Math.PI / 2, 0]} castShadow>
            <boxGeometry args={[a, b, 0.03]} />
          </mesh>
        ))}
        <mesh geometry={roundedBox(0.09, 0.03, W.z1 - W.z0 + 0.14, 0.008)} material={mats.trim} position={[wallT / 2 + 0.04, -(W.y1 - W.y0) / 2 - 0.02, 0]} castShadow />
      </group>
      {/* siding laps on the right wall's outer face */}
      {laps.map((y) => (
        <mesh key={y} material={mats.joist} position={[x1 + 0.002, y, (zb + zf) / 2]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[zf - zb, 0.006]} />
        </mesh>
      ))}
      {/* the attic: dark void behind (the gable wall's inner face), the roof slabs over it */}
      <mesh geometry={atticGeo} material={mats.attic} position={[0, roofBase, zb + wallT + 0.002]} />
      {[-1, 1].map((sd) => (
        <mesh key={sd} geometry={roofGeo} material={[mats.cutLit, mats.roof]} position={[cx, roofBase, zf]} scale={[sd, 1, 1]} castShadow receiveShadow />
      ))}
      {roofInk.map((pts, i) => (
        <InkLine key={i} points={pts} thickness={INK * ink} />
      ))}
      {roofSnow
        ? [-1, 1].map((sd) => (
            <group key={sd} position={[cx + sd * (run / 2), roofBase + vt + rise / 2 + snowT / 2 - 0.01, (zr0 + zf) / 2]} rotation={[0, 0, -sd * slope]}>
              <mesh material={[mats.snow, mats.snow, mats.snow, mats.snow, mats.snowShade, mats.snowShade]} castShadow receiveShadow>
                <boxGeometry args={[slabLen - 0.05, snowT, roofD]} />
              </mesh>
            </group>
          ))
        : null}
      <CutOutline rects={rects} thickness={INK * ink} />
      {/* neighbours far behind, their windows lit at Night */}
      {/* neighbours far behind, each on its own small cut block (snow on top), windows lit at Night; placed so the
          `house` framing (frame 0) doesn't show them: they come in at the yard and the driveway */}
      {neighbours
        ? NEIGHBOURS.map(([x, z, s], i) => (
            <group key={i} position={[x, 0, z]}>
              <mesh material={[mats.cutLit, mats.earth, mats.snow, mats.earth, mats.cutLit, mats.earth]} position={[0, -0.6 + HOUSE.snowT, 0]} receiveShadow>
                <boxGeometry args={[10.5, 1.2, 10.5]} />
              </mesh>
              <CutOutline
                rects={[
                  [
                    [-5.25, -1.2 + HOUSE.snowT, 5.25],
                    [5.25, HOUSE.snowT, 5.25],
                  ],
                  [
                    [5.25, -1.2 + HOUSE.snowT, -5.25],
                    [5.25, HOUSE.snowT, 5.25],
                  ],
                ]}
                thickness={INK * ink * 1.5}
              />
              <group rotation={[0, -Math.PI / 2, 0]}>
                <House x0={-4} x1={4} z0={4.5} z1={-4.5} siding={nSidings[s]} roof={mats.roof} trim={mats.trim} win={win} faceX={1} ground={HOUSE.snowT} windows={night ? [winLit, win, winLit] : undefined} />
              </group>
            </group>
          ))
        : null}
    </group>
  );
};
