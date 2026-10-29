/*
 * The real car models (style guide v0.15 § 3 "Real car models", No. 011): the Tesla Model 3 (2024+ "Highland")
 * and the BYD Seal 06 EV (2027 model year, launched 2026-08; sources.md claim 20), drawn to resemble the real
 * cars inside the house's cut-car system. Pure data (no React, no three): the cut car's outlines in the car frame
 * (x forward, y up, metres; faces +x), the layouts' offsets and where the cues sit. No logo, badge or lettering.
 *
 * Scale. The house's drive parts, pack, wheels and seats are built on one wheelbase (axles at x ±1.35, tire r 0.36),
 * so each model keeps that wheelbase and takes its length from the real ratio: Model 3 2,875 / 4,720 mm (0.609 L) →
 * L 4.433; Seal 06 2,820 / 4,870 mm (0.579 L) → L 4.663 (the Seal reads longer, as it is). Overhangs from the real
 * ratios (Model 3 868 / 977 mm: 0.184 / 0.207; Seal 06 ≈ 0.20 / 0.22, split by eye from a side photo). Heights: the
 * silhouette's top (the roof cut, where the cut car ends) at the real height ratio (Model 3 1,442 / 4,720 = 0.305 →
 * 1.36, a hair over; Seal 06 1,495 / 4,870 = 0.307 → 1.44). Two house parts don't shrink to the real car: the
 * front drive unit's inverter (top y 0.96 at x 1.04 → 1.37) holds the hood and cowl ≈ 7 cm over the real line,
 * and the house tire (r 0.36) is ≈ 10–14 % over the real 18 in tire's share of the length.
 */

export type P2 = [number, number];
type V3 = [number, number, number];

/** The real shapes (`ShellProfile` 'model3' | 'seal06'). */
export type RealShape = 'model3' | 'seal06';
export const isRealShape = (s?: string): s is RealShape => s === 'model3' || s === 'seal06';

/** A wheel arch from its rear foot over the top to its front foot (centre y 0.36, the axle). */
const arch = (cx: number, r: number, n = 14): P2[] =>
  [...Array(n + 1).keys()].map((i) => {
    const t = Math.PI - (i / n) * Math.PI;
    return [cx + r * Math.cos(t), 0.36 + r * Math.sin(t)] as P2;
  });

/** Everything `RealCar` needs to draw one model cut (the sedan's own set is built in `RealCar` the same way). */
export type CutSet = {
  /** The solid front (nose, hood, firewall, sill), sectioned at the near cut. */
  front: P2[];
  /** The bay front (hood skin, front wall, firewall), sectioned at the firewall's plane (`ev`, `gas`). */
  bayFront: P2[];
  /** The rear (rear arch, bench riser, parcel shelf, deck, tail, bumper). */
  rear: P2[];
  /** The trunk, a hole in `rear`. */
  trunk: P2[];
  /** The far side's silhouette up to the roof cut, its window holes. */
  far: P2[];
  windows: P2[][];
  /** The windshield's foot and top; the roof cut (height) and its x span; the rear glass from the roof cut down. */
  ws: [P2, P2];
  roofCut: number;
  roofX: P2;
  /** The roof's highest point on the centre line (car frame x, y): where a tag's leader starts. */
  roofTop: P2;
  backlight: [P2, P2];
  /** The arch radius. */
  archR: number;
  /** The lamps' anchors (x, y on the outline): headlamp, tail lamp, the centre high-mount lamp. */
  lamps: {head: P2; tail: P2; high: P2};
  /** The charging port on the near rear quarter. */
  port: V3;
  /** The cabin, sunk from the crossover's: the seats (`sink` + `drop`), the wheel and cluster (`sink`), moved back. */
  cabin: {sink: number; drop: number; back: number};
  /** The low dash slab (x, y spans), under the windshield. */
  dash: {x: P2; y: P2};
  /** The rear bench: cushion centre (x, y), backrest centre (x, y), its height and lean (rad). */
  bench: {cushion: P2; back: P2; backH: number; lean: number};
  /** The trunk carpet's x centre and width, its floor y, the height of its far wall's carpet (from y 0.6). */
  trunkFloor: {x: number; w: number; y: number; wallH: number};
  /**
   * The far side's beltline, a straight line (front point, rear point): above it the greenhouse, drawn in black trim
   * (the Model 3's glass roof and black window trim). Null: the far side all paint.
   */
  belt: [P2, P2] | null;
};

// ------------------------------------------------------------------ Tesla Model 3 (Highland)

/**
 * The nose and hood's outer line, bumper foot → cowl: a low, rounded, grille-less nose (its most forward point at
 * y 0.43), the hood rising in one curve to the cowl (held up over the drive unit's inverter).
 */
const M3_NOSE: P2[] = [
  [2.09, 0.24],
  [2.14, 0.29],
  [2.163, 0.36],
  [2.166, 0.43],
  [2.152, 0.51],
  [2.115, 0.58],
  [2.05, 0.64],
  [1.95, 0.7],
  [1.8, 0.78],
  [1.62, 0.875],
  [1.45, 0.96],
  [1.28, 1.0],
  [1.12, 1.018],
  [0.97, 1.03],
];
/** The hood's inner skin and the front wall (the bay front), firewall top → front wall foot. */
const M3_BAY_INNER: P2[] = [
  [1.0, 0.99],
  [1.12, 0.983],
  [1.28, 0.965],
  [1.45, 0.92],
  [1.62, 0.835],
  [1.8, 0.74],
  [1.93, 0.665],
  [2.02, 0.6],
  [2.08, 0.52],
  [2.1, 0.45],
  [2.09, 0.35],
  [2.04, 0.24],
];
/** The firewall behind the hood. */
const M3_COWL: P2[] = [
  [0.95, 1.0],
  [0.93, 0.8],
];
const M3_ROOF = 1.36;
const M3_WS: [P2, P2] = [
  [0.97, 1.03],
  [0.1, M3_ROOF],
];
const M3_ROOF_X: P2 = [-0.4, 0.1];
/** The fastback: one line from the roof cut down to a short deck (the rear glass ends low, near the tail). */
const M3_FASTBACK: P2[] = [
  [-0.62, 1.34],
  [-0.88, 1.29],
  [-1.15, 1.215],
  [-1.42, 1.13],
  [-1.62, 1.07],
  [-1.7, 1.055],
];
/** The deck and tail: a short deck to an integrated lip, a rounded tail, the bumper. Deck start → bumper foot. */
const M3_TAIL: P2[] = [
  [-1.7, 1.055],
  [-1.95, 1.045],
  [-2.12, 1.04],
  [-2.19, 1.052],
  [-2.235, 1.01],
  [-2.262, 0.93],
  [-2.268, 0.8],
  [-2.262, 0.62],
  [-2.245, 0.42],
  [-2.215, 0.3],
  [-2.17, 0.24],
];
const M3_ARCH = 0.41;
const M3: CutSet = {
  front: [
    ...M3_NOSE,
    ...M3_COWL,
    [0.88, 0.34],
    [-0.88, 0.34],
    [-0.91, 0.24],
    [0.91, 0.24],
    ...arch(1.35, M3_ARCH),
    [1.77, 0.24],
  ],
  bayFront: [[0.88, 0.34], [0.925, 0.34], [0.985, 0.8], ...M3_BAY_INNER, ...M3_NOSE, ...M3_COWL],
  rear: [
    [-0.88, 0.34],
    [-0.88, 0.79],
    [-1.6, 0.79],
    [-1.64, 0.98],
    [-1.67, 1.05],
    ...M3_TAIL,
    [-1.77, 0.24],
    ...arch(-1.35, M3_ARCH),
  ],
  trunk: [
    [-1.73, 0.6],
    [-1.73, 1.0],
    [-2.1, 1.0],
    [-2.19, 0.97],
    [-2.222, 0.88],
    [-2.225, 0.6],
  ],
  far: [
    ...M3_NOSE,
    M3_WS[1],
    [M3_ROOF_X[0], M3_ROOF],
    ...M3_FASTBACK,
    ...M3_TAIL.slice(1),
    [-1.77, 0.24],
    ...arch(-1.35, M3_ARCH),
    [-0.91, 0.24],
    [0.91, 0.24],
    ...arch(1.35, M3_ARCH),
    [1.77, 0.24],
  ],
  // the glass roof: the side glass runs up close to the roof, black trim round it (the greenhouse is black)
  windows: [
    [
      [0.83, 1.05],
      [0.1, 1.325],
      [-0.12, 1.325],
      [-0.12, 1.058],
    ],
    [
      [-0.22, 1.06],
      [-0.22, 1.325],
      [-0.45, 1.325],
      [-0.75, 1.285],
      [-1.0, 1.215],
      [-1.12, 1.18],
      [-1.12, 1.075],
    ],
    [
      [-1.2, 1.077],
      [-1.2, 1.155],
      [-1.46, 1.085],
    ],
  ],
  ws: M3_WS,
  roofCut: M3_ROOF,
  roofX: M3_ROOF_X,
  // the fastback's crown, ahead of the B-pillar (x −0.17)
  roofTop: [-0.05, M3_ROOF],
  backlight: [
    [M3_ROOF_X[0], M3_ROOF],
    [-1.66, 1.062],
  ],
  archR: M3_ARCH,
  // the high-mount lamp: a short slim bar on the deck at the rear glass's foot (the real one sits at the glass's top,
  // which the roof cut takes away: drawn there it floated over the cabin)
  lamps: {head: [2.11, 0.585], tail: [-2.24, 0.985], high: [-1.72, 1.064]},
  port: [-1.98, 0.86, 0.93],
  cabin: {sink: 0.36, drop: 0.1, back: 0.25},
  dash: {x: [0.55, 0.92], y: [0.84, 0.98]},
  bench: {cushion: [-1.22, 0.74], back: [-1.45, 0.94], backH: 0.3, lean: 0.24},
  trunkFloor: {x: -1.98, w: 0.48, y: 0.603, wallH: 0.38},
  belt: [
    [1.0, 1.02],
    [-1.75, 1.058],
  ],
};

// ------------------------------------------------------------------ BYD Seal 06 EV (2027 MY)

/**
 * The nose: a low, closed front, blunter than the Model 3's (a near-vertical face from 0.29 to 0.6, a sharper
 * corner into the hood), the hood rising to the cowl.
 */
const S6_NOSE: P2[] = [
  [2.21, 0.24],
  [2.255, 0.29],
  [2.278, 0.37],
  [2.283, 0.5],
  [2.274, 0.6],
  [2.24, 0.665],
  [2.16, 0.71],
  [2.0, 0.765],
  [1.8, 0.84],
  [1.62, 0.91],
  [1.45, 0.968],
  [1.28, 1.002],
  [1.12, 1.022],
  [0.97, 1.035],
];
const S6_BAY_INNER: P2[] = [
  [1.0, 0.992],
  [1.12, 0.985],
  [1.28, 0.968],
  [1.45, 0.928],
  [1.62, 0.87],
  [1.8, 0.8],
  [2.0, 0.725],
  [2.15, 0.67],
  [2.21, 0.6],
  [2.225, 0.45],
  [2.205, 0.32],
  [2.16, 0.24],
];
const S6_COWL: P2[] = [
  [0.95, 1.0],
  [0.93, 0.8],
];
const S6_ROOF = 1.44;
/** A steeper windshield than the Model 3's (≈ 28° against ≈ 21°): a more upright greenhouse. */
const S6_WS: [P2, P2] = [
  [0.97, 1.035],
  [0.22, S6_ROOF],
];
const S6_ROOF_X: P2 = [-0.62, 0.22];
/** The rear glass, steeper than the Model 3's, meeting the deck at a notch. */
const S6_BACKLIGHT: P2[] = [
  [-0.78, 1.415],
  [-1.0, 1.35],
  [-1.25, 1.24],
  [-1.45, 1.14],
  [-1.55, 1.1],
];
/** A short notched boot: the deck, a small ducktail lip, a near-vertical tail, the bumper. */
const S6_TAIL: P2[] = [
  [-1.55, 1.1],
  [-1.8, 1.095],
  [-2.05, 1.09],
  [-2.22, 1.095],
  [-2.3, 1.104],
  [-2.345, 1.06],
  [-2.37, 0.98],
  [-2.376, 0.86],
  [-2.372, 0.62],
  [-2.35, 0.42],
  [-2.315, 0.3],
  [-2.27, 0.24],
];
const S6_ARCH = 0.41;
const S6: CutSet = {
  front: [
    ...S6_NOSE,
    ...S6_COWL,
    [0.88, 0.34],
    [-0.88, 0.34],
    [-0.91, 0.24],
    [0.91, 0.24],
    ...arch(1.35, S6_ARCH),
    [1.77, 0.24],
  ],
  bayFront: [[0.88, 0.34], [0.925, 0.34], [0.985, 0.8], ...S6_BAY_INNER, ...S6_NOSE, ...S6_COWL],
  rear: [
    [-0.88, 0.34],
    [-0.88, 0.79],
    [-1.47, 0.79],
    [-1.5, 1.04],
    [-1.53, 1.095],
    ...S6_TAIL,
    [-1.77, 0.24],
    ...arch(-1.35, S6_ARCH),
  ],
  trunk: [
    [-1.6, 0.6],
    [-1.6, 1.05],
    [-2.22, 1.05],
    [-2.305, 1.01],
    [-2.33, 0.9],
    [-2.333, 0.6],
  ],
  far: [
    ...S6_NOSE,
    S6_WS[1],
    [S6_ROOF_X[0], S6_ROOF],
    ...S6_BACKLIGHT,
    ...S6_TAIL.slice(1),
    [-1.77, 0.24],
    ...arch(-1.35, S6_ARCH),
    [-0.91, 0.24],
    [0.91, 0.24],
    ...arch(1.35, S6_ARCH),
    [1.77, 0.24],
  ],
  // a body-coloured roof: a painted band over the side glass
  windows: [
    [
      [0.86, 1.045],
      [0.28, 1.36],
      [-0.1, 1.36],
      [-0.1, 1.052],
    ],
    [
      [-0.2, 1.054],
      [-0.2, 1.36],
      [-0.66, 1.36],
      [-0.86, 1.32],
      [-1.05, 1.25],
      [-1.15, 1.21],
      [-1.15, 1.062],
    ],
    [
      [-1.24, 1.064],
      [-1.24, 1.17],
      [-1.37, 1.106],
      [-1.4, 1.066],
    ],
  ],
  ws: S6_WS,
  roofCut: S6_ROOF,
  roofX: S6_ROOF_X,
  roofTop: [-0.2, S6_ROOF],
  backlight: [
    [S6_ROOF_X[0], S6_ROOF],
    [-1.52, 1.11],
  ],
  archR: S6_ARCH,
  lamps: {head: [2.25, 0.645], tail: [-2.355, 1.02], high: [-1.53, 1.115]},
  port: [-2.06, 0.9, 0.93],
  cabin: {sink: 0.3, drop: 0.08, back: 0.18},
  dash: {x: [0.58, 0.92], y: [0.86, 1.0]},
  bench: {cushion: [-1.18, 0.74], back: [-1.38, 0.97], backH: 0.36, lean: 0.2},
  trunkFloor: {x: -1.97, w: 0.7, y: 0.603, wallH: 0.43},
  // the body-coloured roof: no black greenhouse
  belt: null,
};

export const REAL_CUT: Record<RealShape, CutSet> = {model3: M3, seal06: S6};

/** How much further forward a seated driver's idle foot rests than in the cut sedan (the seat sits further back). */
export const realFootReach = (s?: string): number => (isRealShape(s) ? REAL_CUT[s].cabin.back - 0.1 : 0);

/** The road wheel each model gets (`RealWheel` `design`): invented designs, never a copy of a real wheel. */
export const realWheelDesign = (s?: string): 'aero5' | 'twin10' | undefined =>
  s === 'model3' ? 'aero5' : s === 'seal06' ? 'twin10' : undefined;

// ------------------------------------------------------------------ the cues on the nose and tail

/** Where an outline's face crosses height y (the nose: the largest x; the tail: the smallest), its slope there. */
export const surfaceAt = (pts: P2[], y: number, end: 'front' | 'rear'): {x: number; tx: number; ty: number} => {
  let best = {x: end === 'front' ? -Infinity : Infinity, tx: 0, ty: 1};
  for (let i = 0; i < pts.length; i++) {
    const [ax, ay] = pts[i];
    const [bx, by] = pts[(i + 1) % pts.length];
    if ((ay - y) * (by - y) > 0 || ay === by) continue;
    const x = ax + ((bx - ax) * (y - ay)) / (by - ay);
    if (end === 'front' ? x <= best.x : x >= best.x) continue;
    // the tangent going up
    const s = by > ay ? 1 : -1;
    const l = Math.hypot(bx - ax, by - ay) || 1;
    best = {x, tx: (s * (bx - ax)) / l, ty: (s * (by - ay)) / l};
  }
  return best;
};

/** A lamp, intake or slot laid on the nose or tail: a box (car frame) turned `rot` about z to lie on the face. */
export type FaceBox = {kind: 'head' | 'tail' | 'high' | 'intake' | 'slot'; at: V3; size: V3; rot: number};

/** A box on the face of `outline` at height y, from z0 to z1, `h` tall (along the face), `d` deep, `proud` out. */
const onFace = (outline: P2[], end: 'front' | 'rear', kind: FaceBox['kind'], y: number, z: P2, h: number, d = 0.03, proud = 0.004): FaceBox => {
  const f = surfaceAt(outline, y, end);
  // the face's outward normal (the nose's +x, the tail's −x), the box's local x along it, local y along the face
  const sgn = end === 'front' ? 1 : -1;
  const nx = sgn * f.ty;
  const ny = -sgn * f.tx;
  const k = d / 2 - proud;
  return {kind, at: [f.x - nx * k, y - ny * k, (z[0] + z[1]) / 2], size: [d, h, z[1] - z[0]], rot: Math.atan2(-f.tx, f.ty)};
};

/** The near cut and the bay's firewall plane (as `RealCar`'s): the near lamps stop at the section. */
const CUT_Z = 0.8;
/** The Seal 06's full-width tail bar's height (m). */
const SEAL_BAR_H = 0.063;
const BAY_Z = 0.4;

/**
 * Each model's face cues (car frame), the same boxes `RealModelParts` draws and the "made by" glow lights:
 * Model 3: slim headlamps set wide at the corners, a thin lower intake slot, C-shaped tail lamps at the corners
 * (a bar under the lip, the outer upright, a short lower bar: the C opens inward), the high-mount lamp at the rear
 * glass's foot. Seal 06: sharp slim headlamps, a lower trapezoidal intake (`intake`, drawn as a trapezoid), the
 * full-width tail light bar across the boot lid to the cut. `bay`: the nose is sectioned at the firewall's plane
 * (no near headlamp); `brake`: the near tail lamp and the high-mount lamp drawn (the cut car's brake lamps).
 */
export const realFaceBoxes = (shape: RealShape, o: {bay?: boolean; brake?: boolean} = {}): FaceBox[] => {
  const c = REAL_CUT[shape];
  const noseZ = o.bay ? BAY_Z : CUT_Z;
  const nose = (kind: FaceBox['kind'], y: number, z: P2, h: number, d?: number) =>
    z[0] < noseZ - 0.02 ? [onFace(c.far, 'front', kind, y, [z[0], Math.min(z[1], noseZ)], h, d)] : [];
  const tail = (y: number, z: P2, h: number) => [onFace(c.far, 'rear', 'tail', y, z, h)];
  const high: FaceBox = {kind: 'high', at: [c.lamps.high[0], c.lamps.high[1], 0], size: [0.03, 0.02, shape === 'model3' ? 0.24 : 0.34], rot: 0};
  if (shape === 'model3')
    return [
      ...nose('head', c.lamps.head[1], [-0.86, -0.5], 0.034),
      ...(o.bay ? [] : nose('head', c.lamps.head[1], [0.5, 0.78], 0.034)),
      ...nose('slot', 0.315, [-0.62, 0.62], 0.032, 0.02),
      // the C: under the lip, the outer upright, the short lower bar (far corner; the near one with the brake lamps)
      ...[1, ...(o.brake ? [-1] : [])].flatMap((s) => {
        const zs = (a: number, b: number): P2 => (s === 1 ? [-b, -a] : [a, Math.min(b, CUT_Z)]);
        return [...tail(0.975, zs(0.5, 0.86), 0.032), ...tail(0.925, zs(0.8, 0.86), 0.075), ...tail(0.877, zs(0.62, 0.86), 0.024)];
      }),
      ...(o.brake ? [high] : []),
    ];
  return [
    ...nose('head', c.lamps.head[1], [-0.86, -0.48], 0.03),
    ...(o.bay ? [] : nose('head', c.lamps.head[1], [0.48, 0.78], 0.03)),
    ...nose('intake', 0.36, [-0.56, 0.56], 0.13, 0.02),
    // the full-width bar, one continuous lamp from the far corner to the cut
    // 6.3 cm tall (reviewer: lit vs unlit must read at phone size; was 4.2)
    ...tail(c.lamps.tail[1], [-0.86, CUT_Z], SEAL_BAR_H),
    ...(o.brake ? [high] : []),
  ];
};

/** The near rear quarter's outer skin (`RealCar` `QUARTER_Z`), drawn whole behind the rear arch when the car has a port. */
const QUARTER_SKIN = 0.93;

/**
 * The near tail lamp carried round the whole near rear quarter (`RealCar` `port`), car frame: the same lamp as the
 * far corner's on the tail face between the cut and the skin, and its wrap forward onto the flank (`side`: boxes on
 * the skin, local x across the car). Model 3: the C (bar, upright, lower bar), the upper bar wrapping 0.17 onto the
 * flank; Seal 06: the full-width bar's end, wrapping 0.1. The Seal also gets its crisp shoulder crease on the flank
 * (`crease`: a polyline at the skin, x and y, from behind the arch to the tail).
 */
export const realQuarterParts = (
  shape: RealShape,
): {face: FaceBox[]; side: {at: V3; size: V3}[]; crease: P2[] | null} => {
  const c = REAL_CUT[shape];
  const z: P2 = [CUT_Z, QUARTER_SKIN];
  const tailX = (y: number) => surfaceAt(c.far, y, 'rear').x;
  if (shape === 'model3') {
    const yTop = 0.975;
    return {
      face: [
        onFace(c.far, 'rear', 'tail', yTop, z, 0.032),
        onFace(c.far, 'rear', 'tail', 0.925, [0.87, QUARTER_SKIN], 0.075),
        onFace(c.far, 'rear', 'tail', 0.877, z, 0.024),
      ],
      side: [{at: [tailX(yTop) + 0.09, yTop - 0.004, QUARTER_SKIN + 0.002], size: [0.17, 0.03, 0.008]}],
      crease: null,
    };
  }
  const y = c.lamps.tail[1];
  return {
    face: [onFace(c.far, 'rear', 'tail', y, z, SEAL_BAR_H)],
    side: [{at: [tailX(y) + 0.055, y, QUARTER_SKIN + 0.002], size: [0.1, SEAL_BAR_H, 0.008]}],
    crease: [
      [-1.83, 0.985],
      [-2.05, 0.975],
      [tailX(0.97) + 0.03, 0.97],
    ],
  };
};
