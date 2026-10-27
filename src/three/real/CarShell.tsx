import React, {useMemo} from 'react';
import * as THREE from 'three';
import {toCreasedNormals} from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import {roundedBox} from '../plaster';

type P2 = [number, number];
/** A polygon corner (x, y) with its fillet radius (0: sharp). */
type Corner = [number, number, number];

/*
 * The whole car's outer shell (No. 005; `RealCar whole`): the same crossover as the cut car, built for
 * the rear three-quarter view of the highway: a lower body with softened edges (a side profile
 * extruded with a rounded bevel, its corners filleted), a tumblehome glasshouse (one tinted, rounded
 * glass volume under a painted roof, the pillars laid on its flat sides), a raked rear window with a
 * spoiler, a wiper and a high brake lamp, tail lamps that wrap round the rear corners with a light
 * guide and a light bar between them, reversing lamps, a bumper with its diffuser and reflectors, a
 * plate in a dark recess, black wheel-arch and sill cladding, arch liners, door seams, handles and
 * mirrors. x forward, y up, z to the right (near side +z); metres. No logo, no signature shape.
 */

/** Half-widths: the lower body's flat sides, the glasshouse's flat sides (tumblehome). */
export const SHELL = {
  half: 0.93,
  glassHalf: 0.82,
  bevel: 0.09,
  glassBevel: 0.1,
  archR: 0.43,
  archY: 0.36,
  roofFoot: 1.66,
};

/** Tumblehome: the glasshouse leans in, its half-width shrinking by this share from the beltline to the roof. */
const TUMBLE = {from: 1.12, to: 1.76, share: 0.13};
const tumble = (g: THREE.BufferGeometry, T: {from: number; to: number; share: number} = TUMBLE) => {
  const p = g.getAttribute('position');
  for (let i = 0; i < p.count; i++) {
    const k = Math.max(0, Math.min(1, (p.getY(i) - T.from) / (T.to - T.from)));
    p.setZ(i, p.getZ(i) * (1 - T.share * k));
  }
  p.needsUpdate = true;
  g.computeBoundingSphere();
  return g;
};

/** A filleted polygon: each corner rounded by a quadratic curve cut back `r` along both edges. */
const roundPoly = (pts: Corner[], seg = 6): P2[] => {
  const out: P2[] = [];
  const n = pts.length;
  for (let i = 0; i < n; i++) {
    const [x, y, r] = pts[i];
    if (!r) {
      out.push([x, y]);
      continue;
    }
    const [px, py] = pts[(i - 1 + n) % n];
    const [nx, ny] = pts[(i + 1) % n];
    const d1 = Math.hypot(px - x, py - y);
    const d2 = Math.hypot(nx - x, ny - y);
    const a: P2 = [x + ((px - x) * Math.min(r, d1 / 2)) / d1, y + ((py - y) * Math.min(r, d1 / 2)) / d1];
    const b: P2 = [x + ((nx - x) * Math.min(r, d2 / 2)) / d2, y + ((ny - y) * Math.min(r, d2 / 2)) / d2];
    for (let j = 0; j <= seg; j++) {
      const t = j / seg;
      const u = 1 - t;
      out.push([u * u * a[0] + 2 * u * t * x + t * t * b[0], u * u * a[1] + 2 * u * t * y + t * t * b[1]]);
    }
  }
  return out;
};

/** A wheel arch from its rear foot over the top to its front foot (sharp corners). */
const archCorners = (cx: number, n = 18): Corner[] =>
  [...Array(n + 1).keys()].map((i) => {
    const t = Math.PI - (i / n) * Math.PI;
    return [cx + SHELL.archR * Math.cos(t), SHELL.archY + SHELL.archR * Math.sin(t), 0];
  });

/** The lower body's side profile: bumper, hood, beltline, tailgate, bumper, sill with two arches. */
const LOWER: P2[] = roundPoly([
  [2.28, 0.25, 0.04],
  [2.4, 0.42, 0.1],
  [2.37, 0.78, 0.12],
  [2.15, 0.93, 0.22],
  [1.2, 1.07, 0.06],
  [-1.95, 1.17, 0.1],
  [-2.29, 1.17, 0.08],
  [-2.36, 1.08, 0.06],
  [-2.405, 0.62, 0.06],
  [-2.36, 0.27, 0.05],
  [-1.79, 0.27, 0],
  [-1.78, 0.36, 0],
  ...archCorners(-1.35),
  [-0.92, 0.36, 0],
  [-0.91, 0.25, 0],
  [0.91, 0.25, 0],
  [0.92, 0.36, 0],
  ...archCorners(1.35),
  [1.78, 0.36, 0],
  [1.79, 0.26, 0],
]);

/** The glasshouse's side profile (its foot hidden inside the lower body). */
const GLASS_CROSSOVER: P2[] = roundPoly(
  [
    [1.34, 1.03, 0],
    [0.3, 1.71, 0.22],
    [-0.7, 1.765, 0.7],
    // the rear window's rake (≈ 16° off vertical): its normal stays clear of the Night key's mirror
    // angle from the fixed camera (at ≈ 28° it reflected the key as a hot disc)
    [-2.1, 1.72, 0.14],
    [-2.27, 1.13, 0.05],
    [-2.27, 1.03, 0],
  ],
  8,
);

/**
 * The sedan's glasshouse (No. 006, `profile: 'sedan'`): a lower roof (peak ≈ 1.62 against 1.77) and a
 * raked rear window ending on a short trunk deck at x ≈ −1.9 (the lower body unchanged).
 */
const GLASS_SEDAN: P2[] = roundPoly(
  [
    [1.3, 1.03, 0],
    [0.3, 1.56, 0.22],
    [-0.65, 1.62, 0.55],
    [-1.4, 1.52, 0.15],
    [-1.9, 1.13, 0.05],
    [-1.9, 1.03, 0],
  ],
  8,
);
/** The sedan's roof foot, and how much lower its interior (seats, dash, the driver) sits than the crossover's. */
const SEDAN = {roofFoot: 1.5, sink: 0.14};

/**
 * The hatch's glasshouse (No. 009, `profile: 'hatch'`): the cut car's own outline seen whole (`RealCar`'s far
 * side, `FAR`, lowered by `wholeSink` like every whole car), so YOU's car keeps its shape across a slide between
 * highway-slice and car-slice: the windshield a little steeper than the crossover's, the roof ending at x ≈ −1.5
 * and a long raked hatch falling to the tailgate's lip (the crossover's is near vertical). Lower body, roof
 * height and interior as the crossover's (sink 0).
 */
const GLASS_HATCH: P2[] = roundPoly(
  [
    [1.24, 1.03, 0],
    [0.42, 1.73, 0.24],
    [-0.5, 1.77, 0.5],
    [-1.45, 1.74, 0.3],
    [-2.2, 1.21, 0.06],
    [-2.27, 1.13, 0.05],
    [-2.27, 1.03, 0],
  ],
  8,
);

/** The whole car's shapes: 'crossover' (No. 005), 'sedan' (No. 006), 'coupe' (No. 007), 'hatch' (No. 009). */
export type ShellProfile = 'crossover' | 'sedan' | 'coupe' | 'hatch';

/**
 * The coupe's lower body (No. 007, `profile: 'coupe'`): a generic two-door, the same wheelbase, arches
 * and wheels as the crossover (so every drive part and `wheelsWhole` fit), but a low nose, a long hood
 * falling to it, a shoulder line ≈ 0.1 under the crossover's beltline and a short deck ending in a small
 * ducktail lip. No maker's silhouette: no hood scoop, no side vents, no signature lamp shapes.
 */
const LOWER_COUPE: P2[] = roundPoly([
  [2.32, 0.25, 0.04],
  [2.45, 0.4, 0.1],
  [2.42, 0.66, 0.12],
  [2.2, 0.83, 0.25],
  [1.4, 1.0, 0.1],
  [-1.6, 1.05, 0.25],
  [-2.28, 1.06, 0.04],
  [-2.34, 1.0, 0.05],
  [-2.41, 0.62, 0.06],
  [-2.36, 0.27, 0.05],
  [-1.79, 0.27, 0],
  [-1.78, 0.36, 0],
  ...archCorners(-1.35),
  [-0.92, 0.36, 0],
  [-0.91, 0.25, 0],
  [0.91, 0.25, 0],
  [0.92, 0.36, 0],
  ...archCorners(1.35),
  [1.78, 0.36, 0],
  [1.79, 0.26, 0],
]);
/**
 * The styled coupes' lower bodies (No. 007 realism pass, `style`): the same wheelbase and arches.
 * 'muscle': a taller, blunter nose, haunches rising over the rear wheels and a ducktail lip on the deck;
 * 'electric': a lower, rounder closed nose and a smooth deck falling to a soft tail. Generic shapes.
 */
const LOWER_MUSCLE: P2[] = roundPoly([
  [2.33, 0.25, 0.04],
  [2.46, 0.4, 0.08],
  [2.46, 0.7, 0.1],
  [2.3, 0.86, 0.2],
  [1.4, 1.0, 0.1],
  [-1.0, 1.06, 0.3],
  [-1.5, 1.09, 0.25],
  [-2.15, 1.05, 0.06],
  [-2.3, 1.1, 0.02],
  [-2.36, 1.05, 0.03],
  [-2.42, 0.62, 0.06],
  [-2.37, 0.27, 0.05],
  [-1.79, 0.27, 0],
  [-1.78, 0.36, 0],
  ...archCorners(-1.35),
  [-0.92, 0.36, 0],
  [-0.91, 0.25, 0],
  [0.91, 0.25, 0],
  [0.92, 0.36, 0],
  ...archCorners(1.35),
  [1.78, 0.36, 0],
  [1.79, 0.26, 0],
]);
const LOWER_ELECTRIC: P2[] = roundPoly([
  [2.3, 0.25, 0.04],
  [2.46, 0.36, 0.1],
  [2.47, 0.56, 0.12],
  [2.3, 0.8, 0.25],
  [1.4, 0.99, 0.12],
  [-1.6, 1.05, 0.3],
  [-2.25, 1.03, 0.1],
  [-2.38, 0.95, 0.08],
  [-2.42, 0.62, 0.06],
  [-2.36, 0.27, 0.05],
  [-1.79, 0.27, 0],
  [-1.78, 0.36, 0],
  ...archCorners(-1.35),
  [-0.92, 0.36, 0],
  [-0.91, 0.25, 0],
  [0.91, 0.25, 0],
  [0.92, 0.36, 0],
  ...archCorners(1.35),
  [1.78, 0.36, 0],
  [1.79, 0.26, 0],
]);
/** The coupe's style (No. 007 realism pass; see `RealCar` `coupeStyle`). */
export type ShellStyle = 'muscle' | 'electric';

/**
 * The coupe's glasshouse: a raked windshield (≈ 22° off the hood), the roof's peak ≈ 1.46 (the sedan's
 * 1.62, the crossover's 1.77) over the driver's head, and a long fastback down to the deck.
 */
const GLASS_COUPE: P2[] = roundPoly(
  [
    [1.42, 0.95, 0],
    [0.3, 1.4, 0.22],
    [-0.5, 1.45, 0.6],
    [-1.95, 1.09, 0.22],
    [-2.16, 1.0, 0],
    [-2.16, 0.95, 0],
  ],
  8,
);
/**
 * The coupe's numbers: the roof's foot, the glass's flat side's foot, its tumblehome, one long door
 * window and a quarter window under the fastback (two doors), the paint behind them; the tail lamps
 * sit `lampDrop` lower (under the deck's lip); the interior and driver sink `sink` more than the
 * crossover's (with `RealCar`'s `wholeSink`: the head ≈ 0.12 under the roof).
 */
const COUPE = {
  roofFoot: 1.3,
  flatFoot: 1.05,
  tumble: {from: 1.05, to: 1.45, share: 0.13},
  door: [-0.55, 3] as P2,
  quarter: [-1.5, -0.68] as P2,
  cPillar: -1.55,
  lampDrop: 0.05,
  sink: 0.34,
};
/** How much lower a whole car's interior and driver sit for a shape (0 for the crossover). */
export const shellSink = (profile: ShellProfile = 'crossover') =>
  profile === 'sedan' ? SEDAN.sink : profile === 'coupe' ? COUPE.sink : 0;

const signedArea = (p: P2[]) =>
  p.reduce((s, [x, y], i) => s + x * p[(i + 1) % p.length][1] - p[(i + 1) % p.length][0] * y, 0) / 2;

/** Offset a closed polygon by `d` (positive: outward), mitred at each vertex. */
const offsetPoly = (p: P2[], d: number): P2[] => {
  const s = signedArea(p) > 0 ? 1 : -1;
  const n = p.length;
  return p.map(([x, y], i) => {
    const [px, py] = p[(i - 1 + n) % n];
    const [nx, ny] = p[(i + 1) % n];
    // outward normals of the two edges (CCW: right-hand normal is outward)
    const n1 = [py - y, x - px].map((v) => v * -s);
    const n2 = [y - ny, nx - x].map((v) => v * -s);
    const l1 = Math.hypot(n1[0], n1[1]) || 1;
    const l2 = Math.hypot(n2[0], n2[1]) || 1;
    const m = [n1[0] / l1 + n2[0] / l2, n1[1] / l1 + n2[1] / l2];
    const ml = Math.hypot(m[0], m[1]) || 1;
    const cos = (m[0] / ml) * (n1[0] / l1) + (m[1] / ml) * (n1[1] / l1);
    const k = d / Math.max(0.35, cos);
    return [x + (m[0] / ml) * k, y + (m[1] / ml) * k] as P2;
  });
};

/** Clip a polygon to the half-plane `axis` ≥ v (dir 1) or ≤ v (dir −1) (Sutherland–Hodgman). */
const clipPoly = (p: P2[], axis: 0 | 1, v: number, dir: 1 | -1): P2[] => {
  const out: P2[] = [];
  const inside = (q: P2) => (q[axis] - v) * dir >= 0;
  for (let i = 0; i < p.length; i++) {
    const a = p[i];
    const b = p[(i + 1) % p.length];
    const ia = inside(a);
    const ib = inside(b);
    if (ia) out.push(a);
    if (ia !== ib) {
      const t = (v - a[axis]) / (b[axis] - a[axis]);
      out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
    }
  }
  return out;
};
const box = (p: P2[], x0: number, x1: number, y0: number, y1: number) =>
  clipPoly(clipPoly(clipPoly(clipPoly(p, 0, x0, 1), 0, x1, -1), 1, y0, 1), 1, y1, -1);

/** Where a closed polygon's edge crosses height y: the smallest x (the rear). */
const rearXAt = (p: P2[], y: number) => {
  let best = Infinity;
  for (let i = 0; i < p.length; i++) {
    const [ax, ay] = p[i];
    const [bx, by] = p[(i + 1) % p.length];
    if ((ay - y) * (by - y) > 0 || ay === by) continue;
    best = Math.min(best, ax + ((bx - ax) * (y - ay)) / (by - ay));
  }
  return best;
};

/** A thin band laid over an open polyline (x, y), `out` proud of it and `t` thick, as a closed outline. */
const bandAlong = (pts: P2[], out: number, t: number): P2[] => {
  const n = pts.length;
  const nrm = pts.map((_, i) => {
    const a = pts[Math.max(0, i - 1)];
    const b = pts[Math.min(n - 1, i + 1)];
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const l = Math.hypot(dx, dy) || 1;
    // the outline runs clockwise round the body here: its left normal points out
    return [-dy / l, dx / l] as P2;
  });
  const o = pts.map(([x, y], i) => [x + nrm[i][0] * out, y + nrm[i][1] * out] as P2);
  const inn = pts.map(([x, y], i) => [x + nrm[i][0] * (out - t), y + nrm[i][1] * (out - t)] as P2);
  return [...o, ...inn.reverse()];
};

const toShape = (pts: P2[], holes: P2[][] = []) => {
  const s = new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(x, y)));
  for (const h of holes) s.holes.push(new THREE.Path(h.map(([x, y]) => new THREE.Vector2(x, y))));
  return s;
};

/** Extrude a side profile across z0 → z1 with a rounded bevel that keeps the outline (edges softened by r). */
const bevelExtrude = (shape: THREE.Shape, z0: number, z1: number, r: number, segs = 5) => {
  const g = new THREE.ExtrudeGeometry(shape, {
    depth: Math.max(0.001, z1 - z0 - 2 * r),
    bevelEnabled: true,
    bevelThickness: r,
    bevelSize: r,
    bevelOffset: -r,
    bevelSegments: segs,
    curveSegments: 12,
  });
  g.translate(0, 0, z0 + r);
  return toCreasedNormals(g, 0.75);
};
const flatExtrude = (shape: THREE.Shape, z0: number, z1: number) => {
  const g = new THREE.ExtrudeGeometry(shape, {depth: z1 - z0, bevelEnabled: false, curveSegments: 12});
  g.translate(0, 0, z0);
  return g;
};

/**
 * A lamp band seen from above wrapping a rear corner: along the rear face from z = zIn to the corner,
 * round the corner's arc (the bevel's radius), along the side for `side` metres; `out` proud of the
 * paint, `t` deep. Extruded `h` high from y = 0 (place it at the lamp's bottom).
 */
const wrapBand = (xr: number, zIn: number, side: number, h: number, out: number, t: number) => {
  const r = SHELL.bevel;
  const zc = SHELL.half - r;
  const xc = xr + r;
  const outer: P2[] = [];
  const inner: P2[] = [];
  const push = (arr: P2[], rad: number, ox: number) => {
    arr.push([xr - ox, zIn]);
    for (let i = 0; i <= 8; i++) {
      const a = Math.PI + (i / 8) * (Math.PI / 2);
      arr.push([xc + rad * Math.cos(a), zc - rad * Math.sin(a)]);
    }
    arr.push([xc + side, zc + rad]);
  };
  push(outer, r + out, out);
  push(inner, r + out - t, out - t);
  // shape in (x, −z) so that, extruded along local z and turned −π/2 about x, it lands at world (x, y, z)
  const ring = [...outer, ...inner.reverse()].map(([x, z]) => new THREE.Vector2(x, -z));
  const g = new THREE.ExtrudeGeometry(new THREE.Shape(ring), {depth: h, bevelEnabled: false});
  g.rotateX(-Math.PI / 2);
  return g;
};

export type ShellMats = {
  paint: THREE.Material;
  glass: THREE.Material;
  trim: THREE.Material;
  gloss: THREE.Material;
  tail: THREE.Material;
  tailBright: THREE.Material;
  reverse: THREE.Material;
  reflector: THREE.Material;
  light: THREE.Material;
  plate: THREE.Material;
};

/** The whole car's shell (see the file comment). The interior, wheels and figure are drawn by others. */
export const CarShell: React.FC<{
  mats: ShellMats;
  /**
   * 'crossover' (default, as No. 005), 'sedan' (lower roof, a short trunk deck; no spoiler or rear
   * wiper), 'coupe' (No. 007: two doors, a low roof, a long hood and a fastback; see `LOWER_COUPE`) or
   * 'hatch' (No. 009: the cut car's silhouette, a raked hatch; see `GLASS_HATCH`).
   */
  profile?: ShellProfile;
  /**
   * The coupe's style (No. 007 realism pass; `profile: 'coupe'` only): 'muscle' (a power bulge, haunches,
   * a ducktail, round lamps, a mesh grille, twin exhaust tips a side) or 'electric' (a closed nose with a
   * full-width light bar, a full-width tail bar, flush handles, gloss-black pillars round frameless glass).
   * Default none (the plain coupe).
   */
  style?: ShellStyle;
}> = ({mats, profile = 'crossover', style: styleIn}) => {
  const sedan = profile === 'sedan';
  const coupe = profile === 'coupe';
  const hatch = profile === 'hatch';
  const style = coupe ? styleIn : undefined;
  const muscle = style === 'muscle';
  const electric = style === 'electric';
  // the lower body: the coupe's own (or its style's); the crossover's and the sedan's are the same
  const LB = coupe ? (muscle ? LOWER_MUSCLE : electric ? LOWER_ELECTRIC : LOWER_COUPE) : LOWER;
  // the tail lamps' heights (the coupe's under its deck's lip)
  const lampY = coupe ? -COUPE.lampDrop : 0;
  const geo = useMemo(() => {
    const H = SHELL.half;
    const G = SHELL.glassHalf;
    const GLASS = coupe ? GLASS_COUPE : sedan ? GLASS_SEDAN : hatch ? GLASS_HATCH : GLASS_CROSSOVER;
    const T = coupe ? COUPE.tumble : TUMBLE;
    const lower = bevelExtrude(toShape(LB), -H, H, SHELL.bevel);
    const RF = coupe ? COUPE.roofFoot : sedan ? SEDAN.roofFoot : SHELL.roofFoot;
    const glass = tumble(bevelExtrude(toShape(GLASS), -G, G, SHELL.glassBevel, 6), T);
    // the roof: the glasshouse's top above its foot, a little proud all round
    const top = GLASS.filter(([, y]) => y >= RF + 0.01);
    const roofPts = offsetPoly(top, 0.012);
    const roof = tumble(
      bevelExtrude(
        toShape([...roofPts, [roofPts[roofPts.length - 1][0], RF], [roofPts[0][0], RF]]),
        -G - 0.012,
        G + 0.012,
        SHELL.glassBevel + 0.012,
        6,
      ),
      T,
    );
    // the glasshouse's flat side (inside its bevel), above the beltline and under the roof: the pillars
    // (baked at the side's z so the tumblehome leans them with the glass; the left side is mirrored)
    const flat = box(offsetPoly(GLASS, -SHELL.glassBevel), -3, 3, coupe ? COUPE.flatFoot : 1.15, RF + 0.01);
    const win = offsetPoly(flat, -0.035);
    // four doors' windows and a rear quarter light; the coupe: one long door window and a quarter light
    const windows = (
      coupe
        ? [box(win, COUPE.door[0], COUPE.door[1], 0, 3), box(win, COUPE.quarter[0], COUPE.quarter[1], 0, 3)]
        : [box(win, -0.02, 3, 0, 3), box(win, -1.1, -0.14, 0, 3), box(win, -1.62, -1.22, 0, 3)]
    ).filter((w) => w.length > 2);
    const frame = tumble(flatExtrude(toShape(flat, windows), G + 0.001, G + 0.005), T);
    const dPillar = tumble(
      flatExtrude(toShape(box(flat, -3, coupe ? COUPE.cPillar : -1.66, 0, 3)), G + 0.003, G + 0.007),
      T,
    );
    // black cladding: the arch lips (a thick ring, so it fills the bevel under it) and the sill
    const lip = (() => {
      const s = new THREE.Shape();
      const R0 = SHELL.archR;
      const R1 = SHELL.archR + 0.05;
      const a0 = -0.12;
      const a1 = Math.PI + 0.12;
      s.absarc(0, 0, R1, a0, a1, false);
      s.absarc(0, 0, R0, a1, a0, true);
      return bevelExtrude(s, H - 0.1, H + 0.014, 0.012, 2);
    })();
    // the tailgate's top edge under the rear window: a dark garnish (bare paint there caught the Night
    // key as a broad white band from the fixed camera)
    // (the coupe has no tailgate edge: its deck's lip is painted)
    const edge = LB.filter(([x, y]) => x < -2.2 && y > 1.03);
    const garnish = coupe
      ? null
      : flatExtrude(toShape(bandAlong(edge, 0.005, 0.02)), -(H - SHELL.bevel), H - SHELL.bevel);
    const xr = rearXAt(LB, 0.94 + lampY);
    const xrPlate = rearXAt(LB, 0.735);
    const slope = Math.atan2(rearXAt(LB, 0.9) - rearXAt(LB, 0.6), 0.3);
    return {
      lower,
      glass,
      roof,
      frame,
      dPillar,
      lip,
      garnish,
      lens: wrapBand(xr, 0.42, 0.3, 0.1, 0.007, 0.03),
      guide: wrapBand(xr, 0.44, 0.27, 0.016, 0.011, 0.02),
      guide2: wrapBand(xr, 0.5, 0.2, 0.01, 0.01, 0.02),
      xr,
      xrPlate,
      xrReflector: rearXAt(LB, 0.48),
      xrShut: rearXAt(LB, 0.62),
      xrDiffuser: rearXAt(LB, 0.34),
      slope,
      liner: new THREE.CylinderGeometry(
        SHELL.archR - 0.006,
        SHELL.archR - 0.006,
        2 * H - 0.06,
        24,
        1,
        true,
        -Math.PI / 2,
        Math.PI,
      ),
    };
  }, [sedan, coupe, hatch, LB, lampY]);
  const {xr} = geo;

  return (
    <group>
      <mesh geometry={geo.lower} material={mats.paint} castShadow receiveShadow />
      <mesh geometry={geo.roof} material={mats.paint} castShadow receiveShadow />
      <mesh geometry={geo.glass} material={mats.glass} renderOrder={1} />
      {/* the pillars on both flat sides of the glass: black trim, the D-pillar in paint */}
      {[1, -1].map((s) => (
        <group key={s} scale={[1, 1, s]}>
          <mesh geometry={geo.frame} material={mats.trim} />
          {/* the electric coupe's pillars gloss black too (frameless glass, a floating roof) */}
          <mesh geometry={geo.dPillar} material={electric ? mats.trim : mats.paint} />
        </group>
      ))}
      {/* the inside seen through the tint: a dark trim deck at the sills (the solid body under it) */}
      <mesh
        position={[coupe ? -0.5 : sedan ? -0.44 : -0.62, coupe ? 1.035 : 1.178, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        material={mats.trim}
      >
        <planeGeometry args={[coupe ? 2.8 : sedan ? 2.88 : 3.24, 2 * SHELL.glassHalf]} />
      </mesh>
      {geo.garnish ? <mesh geometry={geo.garnish} material={mats.trim} castShadow /> : null}
      {hatch ? (
        // the hatch: the high brake lamp under the roof's back edge, laid on the raked glass (no spoiler or wiper)
        <mesh
          geometry={roundedBox(0.02, 0.018, 0.34, 0.008, 2)}
          material={mats.tailBright}
          position={[-1.6, 1.655, 0]}
          rotation={[0, 0, 0.95]}
        />
      ) : sedan || coupe ? (
        // the sedan's high brake lamp at the foot of the rear window (the coupe's on its deck, behind the fastback)
        <mesh
          geometry={roundedBox(0.03, 0.022, 0.36, 0.008, 2)}
          material={mats.tailBright}
          position={coupe ? [-2.1, 1.075, 0] : [-1.88, 1.185, 0]}
        />
      ) : (
        <>
          {/* the spoiler over the rear window, the high brake lamp under it, the rear wiper */}
          <mesh
            geometry={roundedBox(0.22, 0.035, 1.36, 0.015, 3)}
            material={mats.paint}
            position={[-2.02, 1.725, 0]}
            rotation={[0, 0, -0.12]}
            castShadow
          />
          <mesh
            geometry={roundedBox(0.02, 0.018, 0.3, 0.008, 2)}
            material={mats.tailBright}
            position={[-2.06, 1.695, 0]}
            rotation={[0, 0, 0.4]}
          />
          <mesh
            geometry={roundedBox(0.012, 0.014, 0.46, 0.005, 2)}
            material={mats.trim}
            position={[-2.253, 1.25, 0.1]}
          />
          <mesh
            geometry={roundedBox(0.03, 0.04, 0.05, 0.012, 2)}
            material={mats.trim}
            position={[-2.247, 1.24, 0.34]}
          />
        </>
      )}
      {/* tail lamps wrapping the rear corners (lens, light guide, reversing lamp), the light bar */}
      {[1, -1].map((s) => (
        <group key={s} scale={[1, 1, s]}>
          {muscle ? (
            // the muscle coupe: two round lamps a side in a black tail panel, chrome bezels
            <>
              {[0.52, 0.72].map((z) => (
                <group key={z} position={[xr - 0.008, 0.9 + lampY, z]} rotation={[0, 0, Math.PI / 2]}>
                  <mesh material={mats.tail}>
                    <cylinderGeometry args={[0.062, 0.062, 0.02, 28]} />
                  </mesh>
                  <mesh material={mats.reverse} position={[0, 0.011, 0]} rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[0.066, 0.007, 8, 28]} />
                  </mesh>
                </group>
              ))}
              <mesh
                geometry={roundedBox(0.03, 0.05, 0.07, 0.01, 2)}
                material={mats.reverse}
                position={[xr - 0.004, 0.9 + lampY, 0.34]}
              />
            </>
          ) : (
            <>
              <mesh geometry={geo.lens} material={mats.tail} position={[0, 0.89 + lampY, 0]} />
              <mesh geometry={geo.guide} material={mats.tailBright} position={[0, 0.964 + lampY, 0]} />
              <mesh geometry={geo.guide2} material={mats.tailBright} position={[0, 0.912 + lampY, 0]} />
              <mesh
                geometry={roundedBox(0.012, 0.05, 0.07, 0.006, 2)}
                material={mats.reverse}
                position={[xr - 0.006, 0.925 + lampY, 0.475]}
              />
            </>
          )}
          {muscle
            ? // twin chrome exhaust tips a side under the bumper, dark inside
              [0.5, 0.64].map((z) => (
                <group key={z} position={[geo.xrDiffuser - 0.03, 0.3, z]} rotation={[0, 0, Math.PI / 2]}>
                  <mesh material={mats.reverse}>
                    <cylinderGeometry args={[0.042, 0.042, 0.16, 24]} />
                  </mesh>
                  <mesh material={mats.trim} position={[0, 0.081, 0]}>
                    <cylinderGeometry args={[0.031, 0.031, 0.004, 20]} />
                  </mesh>
                </group>
              ))
            : null}
          {/* the bumper's reflector, low on the corner */}
          <mesh
            geometry={roundedBox(0.012, 0.035, 0.13, 0.008, 2)}
            material={mats.reflector}
            position={[geo.xrReflector - 0.003, 0.48, 0.76]}
          />
          {/* black cladding: arch lips and the sill */}
          {[-1.35, 1.35].map((x) => (
            <mesh key={x} geometry={geo.lip} material={mats.trim} position={[x, SHELL.archY, 0]} castShadow />
          ))}
          <mesh
            geometry={roundedBox(1.84, 0.13, 0.1, 0.02, 2)}
            material={mats.trim}
            position={[0, 0.315, SHELL.half - 0.035]}
            castShadow
          />
          {/* door seams (front door's leading edge, the shut line between the doors, the rear door's back; the coupe's one long door) */}
          {(coupe
            ? ([
                [1.04, 0.6, 0.99],
                [-0.62, 0.3, 1.04],
              ] as const)
            : ([
                [0.98, 0.62, 1.06],
                [-0.08, 0.3, 1.08],
                [-1.12, 0.81, 1.1],
              ] as const)
          ).map(([x, y0, y1]) => (
            <mesh key={x} material={mats.trim} position={[x, (y0 + y1) / 2, SHELL.half + 0.001]}>
              <boxGeometry args={[0.006, y1 - y0, 0.002]} />
            </mesh>
          ))}
          {/* door handles */}
          {(coupe ? [-0.38] : [0.32, -0.72]).map((x) =>
            electric ? (
              // flush handles: a dark slot in the skin
              <mesh key={x} material={mats.trim} position={[x, 0.9, SHELL.half + 0.001]}>
                <boxGeometry args={[0.18, 0.016, 0.003]} />
              </mesh>
            ) : (
              <mesh
                key={x}
                geometry={roundedBox(0.2, 0.035, 0.03, 0.012, 3)}
                material={mats.paint}
                position={[x, coupe ? 0.9 : 1.0, SHELL.half + 0.008]}
              />
            ),
          )}
          {/* the mirror on its stalk */}
          <group position={coupe ? [1.12, 1.02, SHELL.half] : [0.92, 1.17, SHELL.half]}>
            <mesh geometry={roundedBox(0.09, 0.04, 0.08, 0.015, 2)} material={mats.trim} position={[0, -0.02, 0.03]} />
            <mesh
              geometry={roundedBox(0.13, 0.12, 0.22, 0.045, 4)}
              material={mats.paint}
              position={[-0.02, 0.04, 0.14]}
              castShadow
            />
            <mesh
              geometry={roundedBox(0.01, 0.09, 0.18, 0.03, 3)}
              material={mats.gloss}
              position={[-0.088, 0.04, 0.14]}
            />
          </group>
          {/* front: a slim headlamp and the grille's end (the muscle coupe: two round lamps a side) */}
          {muscle ? (
            [0.5, 0.7].map((z) => (
              <group key={z} position={[2.455, 0.7, z]} rotation={[0, 0, Math.PI / 2]}>
                <mesh material={mats.light}>
                  <cylinderGeometry args={[0.066, 0.066, 0.03, 28]} />
                </mesh>
                <mesh material={mats.reverse} position={[0, -0.016, 0]} rotation={[Math.PI / 2, 0, 0]}>
                  <torusGeometry args={[0.07, 0.008, 8, 28]} />
                </mesh>
              </group>
            ))
          ) : (
            <mesh
              geometry={roundedBox(0.04, electric ? 0.04 : 0.06, 0.42, 0.02, 2)}
              material={mats.light}
              position={coupe ? (electric ? [2.42, 0.66, 0.58] : [2.42, 0.6, 0.56]) : [2.37, 0.76, 0.58]}
            />
          )}
        </group>
      ))}
      {/* the arch liners (black, inside each arch) */}
      {[-1.35, 1.35].map((x) => (
        <mesh
          key={x}
          geometry={geo.liner}
          material={mats.trim}
          position={[x, SHELL.archY, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        />
      ))}
      {/* the tailgate's light bar, the bumper/tailgate shut line, the diffuser */}
      {muscle ? (
        // the muscle coupe's black tail panel between the round lamps
        <mesh
          geometry={roundedBox(0.012, 0.16, 1.66, 0.006, 2)}
          material={mats.trim}
          position={[xr - 0.002, 0.9 + lampY, 0]}
        />
      ) : (
        // the light bar between the tail lamps (the electric coupe's full width, the lamps' own height)
        <mesh
          geometry={roundedBox(0.012, electric ? 0.024 : 0.018, electric ? 1.66 : 0.86, 0.006, 2)}
          material={mats.tailBright}
          position={[xr - 0.005, electric ? 0.94 + lampY : 0.97 + lampY, 0]}
        />
      )}
      {electric ? (
        // the closed nose's full-width light bar
        <mesh geometry={roundedBox(0.02, 0.018, 1.5, 0.008, 2)} material={mats.light} position={[2.43, 0.7, 0]} />
      ) : null}
      {muscle ? (
        // the power bulge along the hood's middle
        <mesh
          geometry={roundedBox(0.8, 0.07, 0.6, 0.03, 4)}
          material={mats.paint}
          position={[1.82, 0.955, 0]}
          rotation={[0, 0, -0.2]}
          castShadow
        />
      ) : null}
      <mesh material={mats.trim} position={[geo.xrShut - 0.002, 0.62, 0]} rotation={[0, 0, -geo.slope]}>
        <boxGeometry args={[0.004, 0.008, 1.62]} />
      </mesh>
      <mesh
        geometry={roundedBox(0.1, 0.13, 1.5, 0.03, 3)}
        material={mats.trim}
        position={[geo.xrDiffuser + 0.02, 0.34, 0]}
        castShadow
      />
      {/* the plate in its dark recess */}
      <group position={[geo.xrPlate, 0.735, 0]} rotation={[0, 0, -geo.slope]}>
        <mesh geometry={roundedBox(0.03, 0.2, 0.37, 0.01, 2)} material={mats.trim} position={[0.003, 0, 0]} />
        <mesh material={mats.plate} position={[-0.0135, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[0.305, 0.152]} />
        </mesh>
      </group>
      {/* the grille (none on the electric coupe's closed nose; the muscle coupe's a tall mesh with bars) */}
      {electric ? null : (
        <mesh
          geometry={roundedBox(0.06, muscle ? 0.26 : coupe ? 0.14 : 0.2, muscle ? 0.82 : 1.1, 0.04, 3)}
          material={mats.trim}
          position={muscle ? [2.44, 0.6, 0] : coupe ? [2.43, 0.44, 0] : [2.37, 0.55, 0]}
        />
      )}
      {muscle
        ? [0.52, 0.58, 0.64, 0.7].map((y) => (
            <mesh key={y} material={mats.gloss} position={[2.468, y, 0]}>
              <boxGeometry args={[0.008, 0.008, 0.8]} />
            </mesh>
          ))
        : null}
    </group>
  );
};
