import React, {useMemo} from 'react';
import * as THREE from 'three';
import {fonts} from '../../fonts';
import {CAR, HIGHWAY, MOODS, REAL, section, STREET, type Mood} from '../../theme';
import {BlobShadow} from '../MuseumStage';
import {raw, roundedBox} from '../plaster';
import {CutOutline, cutMaterial, InkLine} from '../section/cutLook';
import {drawCluster, drawEvCluster} from '../../components/dashboardKit';
import {useFontsLoaded} from '../section/useFontsLoaded';
import {CarShell, shellSink, type ShellProfile} from './CarShell';
import {DriveUnit, type DriveUnitProps} from './EvDrive';
import {applyAlbedo, applyEnv, useAlbedo, useEnvStrength, useStudioEnv} from './useStudioEnv';

type V3 = [number, number, number];
type P2 = [number, number];

/*
 * A generic car (No. 002), cut open in the Section's grammar: the near side removed along the near
 * wheels' mid-plane (z = CUT_Z) and the roof removed above the windows, like a room's near wall and
 * ceiling. A crossover, ≈ 4.8 long, metres; faces +x; the driver sits on the far (−z) side. No logo, no
 * signature shape. The body's cut face, the dashboard's and the roof rail's are hatched and inked.
 * Moving parts (wheels, road, figure) belong to the scene.
 */

export const CAR_LAYOUT = {
  /** The near cut (the near wheels' mid-plane) and the far side's outer face. */
  cutZ: 0.8,
  farZ: -0.95,
  floor: 0.34,
  /** Wheel centres (x) and the track half-width (z), the tire radius. */
  axleX: {front: 1.35, rear: -1.35},
  track: 0.8,
  wheelR: 0.36,
  /** The driver's figure origin (on the floor under the pelvis) and the passenger seat. */
  driver: [0.25, 0.34, -0.38] as V3,
  passenger: [0.25, 0.34, 0.38] as V3,
  /** The steering wheel's centre, its tilt back from vertical. */
  steering: [0.68, 1.37, -0.38] as V3,
  /** The instrument cluster's face (toward the driver) and the receiver box under the dash. */
  cluster: [0.79, 1.3, -0.38] as V3,
  receiver: [0.78, 0.6, 0.5] as V3,
  /** The roof cut height. */
  roofCut: 1.92,
  /**
   * The whole car's interior (seats, dash, wheel) sits this much lower than the cut car's, under its
   * lower roof: put a figure driving the whole car this much lower too.
   */
  wholeSink: 0.14,
};

/** The layout with the driver by the near cut (`driverSide: 'near'`): the wheel and cluster move across. */
export const LAYOUT_NEAR = {
  ...CAR_LAYOUT,
  driver: [CAR_LAYOUT.driver[0], CAR_LAYOUT.driver[1], -CAR_LAYOUT.driver[2]] as V3,
  passenger: [CAR_LAYOUT.passenger[0], CAR_LAYOUT.passenger[1], -CAR_LAYOUT.passenger[2]] as V3,
  steering: [CAR_LAYOUT.steering[0], CAR_LAYOUT.steering[1], -CAR_LAYOUT.steering[2]] as V3,
  cluster: [CAR_LAYOUT.cluster[0], CAR_LAYOUT.cluster[1], -CAR_LAYOUT.cluster[2]] as V3,
};

/**
 * The coupe (No. 007, `shape: 'coupe'`), cut: the same wheelbase, wheels, floor, pedals and drive mounts
 * as the crossover (every drive part fits unchanged), but a low cabin: the seats sit `COUPE_SEAT_DROP`
 * lower relative to the wheel, and the whole cabin (seats, low dash, wheel, cluster) `COUPE_CABIN_SINK`
 * lower again, the seats and wheel `COUPE_SEAT_BACK` further back, so the roof cut comes down to 1.57
 * (the crossover's 1.92) and the windshield rakes back. A figure in the cut coupe stands at its layout's
 * `driver` (`carLayout`), so a foot left at the rig's rest sits that much under the floor: give both
 * feet `legs` targets.
 */
export const COUPE_SEAT_DROP = 0.1;
/**
 * The realism pass (No. 007, owner): the cut coupe's whole cabin (seats, dashboard, steering wheel, cluster
 * and the driver with them) sits this much lower again, under a real coupe's roof (the cut at
 * `COUPE_ROOF_CUT`, ≈ 1.6 tall at the peak against the crossover's 1.92). The floor, the pedals and every
 * drive part stay where they were: a figure's feet keep their `legs` targets (car coordinates).
 */
export const COUPE_CABIN_SINK = 0.2;
/**
 * …and the seats and the steering wheel sit this much further back (a low seat's legs reach forward to the
 * pedals, which stay put; at the crossover's place the knees folded up to the wheel). The cluster stays on the dash.
 */
export const COUPE_SEAT_BACK = 0.22;
const COUPE_ROOF_CUT = 1.57;
const dropped = (p: V3): V3 => [p[0] - COUPE_SEAT_BACK, p[1] - COUPE_SEAT_DROP - COUPE_CABIN_SINK, p[2]];
const sunkBack = (p: V3): V3 => [p[0] - COUPE_SEAT_BACK, p[1] - COUPE_CABIN_SINK, p[2]];
const sunk = (p: V3): V3 => [p[0], p[1] - COUPE_CABIN_SINK, p[2]];
export const COUPE_LAYOUT: typeof CAR_LAYOUT = {
  ...CAR_LAYOUT,
  driver: dropped(CAR_LAYOUT.driver),
  passenger: dropped(CAR_LAYOUT.passenger),
  steering: sunkBack(CAR_LAYOUT.steering),
  cluster: sunk(CAR_LAYOUT.cluster),
  roofCut: COUPE_ROOF_CUT,
};
export const COUPE_LAYOUT_NEAR: typeof CAR_LAYOUT = {
  ...LAYOUT_NEAR,
  driver: dropped(LAYOUT_NEAR.driver),
  passenger: dropped(LAYOUT_NEAR.passenger),
  steering: sunkBack(LAYOUT_NEAR.steering),
  cluster: sunk(LAYOUT_NEAR.cluster),
  roofCut: COUPE_ROOF_CUT,
};
/**
 * The cut sedan (No. 010, `shape: 'sedan'` cut): the crossover's wheelbase, wheels, floor, pedals, drive unit
 * and pack (every drive part fits unchanged), a lower four-door cabin: the seats and the steering wheel sit
 * `SEDAN_SEAT_BACK` further back, the whole cabin (seats, low dash, wheel, cluster) `SEDAN_CABIN_SINK` lower
 * and the seats `SEDAN_SEAT_DROP` lower again, under a sedan's roof (the cut at `SEDAN_ROOF_CUT`, the
 * crossover's 1.92, the coupe's 1.57). A low hood, a raked rear window and a short trunk deck; the trunk is
 * hollow in the section. Generic: no maker's silhouette, badge or lamp signature.
 */
export const SEDAN_SEAT_DROP = 0.06;
export const SEDAN_CABIN_SINK = 0.18;
export const SEDAN_SEAT_BACK = 0.1;
const SEDAN_ROOF_CUT = 1.7;
const sedanDropped = (p: V3): V3 => [p[0] - SEDAN_SEAT_BACK, p[1] - SEDAN_SEAT_DROP - SEDAN_CABIN_SINK, p[2]];
const sedanSunkBack = (p: V3): V3 => [p[0] - SEDAN_SEAT_BACK, p[1] - SEDAN_CABIN_SINK, p[2]];
const sedanSunk = (p: V3): V3 => [p[0], p[1] - SEDAN_CABIN_SINK, p[2]];
export const SEDAN_LAYOUT: typeof CAR_LAYOUT = {
  ...CAR_LAYOUT,
  driver: sedanDropped(CAR_LAYOUT.driver),
  passenger: sedanDropped(CAR_LAYOUT.passenger),
  steering: sedanSunkBack(CAR_LAYOUT.steering),
  cluster: sedanSunk(CAR_LAYOUT.cluster),
  roofCut: SEDAN_ROOF_CUT,
};
export const SEDAN_LAYOUT_NEAR: typeof CAR_LAYOUT = {
  ...LAYOUT_NEAR,
  driver: sedanDropped(LAYOUT_NEAR.driver),
  passenger: sedanDropped(LAYOUT_NEAR.passenger),
  steering: sedanSunkBack(LAYOUT_NEAR.steering),
  cluster: sedanSunk(LAYOUT_NEAR.cluster),
  roofCut: SEDAN_ROOF_CUT,
};

/**
 * The layout for a shape and a driver's side. The whole car (`whole`) keeps the crossover's layout for
 * every shape and sinks its interior instead (`wholeSink` + `shellSink(shape)`), so a figure driving a
 * whole car goes at `driver` minus both.
 */
export const carLayout = (
  shape: ShellProfile = 'crossover',
  driverSide: 'far' | 'near' = 'far',
  whole = false,
): typeof CAR_LAYOUT =>
  shape === 'coupe' && !whole
    ? driverSide === 'near'
      ? COUPE_LAYOUT_NEAR
      : COUPE_LAYOUT
    : shape === 'sedan' && !whole
      ? driverSide === 'near'
        ? SEDAN_LAYOUT_NEAR
        : SEDAN_LAYOUT
      : driverSide === 'near'
        ? LAYOUT_NEAR
        : CAR_LAYOUT;

/** The side section: lower body with the cabin hollowed and two wheel arches (x forward, y up). */
const arch = (cx: number, r = 0.44, n = 14): P2[] =>
  [...Array(n + 1).keys()].map((i) => {
    // from the arch's rear foot (x − r) over the top to its front foot (x + r)
    const t = Math.PI - (i / n) * Math.PI;
    return [cx + r * Math.cos(t), 0.36 + r * Math.sin(t)] as P2;
  });
const BODY: P2[] = [
  [2.3, 0.24],
  [2.37, 0.5],
  [2.35, 0.82],
  [2.22, 1.02],
  [1.7, 1.12],
  [1.12, 1.2],
  [1.02, 1.18],
  [0.97, 0.8],
  [0.88, 0.34],
  [-0.88, 0.34],
  [-0.88, 0.84],
  [-1.85, 0.84],
  [-1.9, 1.28],
  [-2.3, 1.3],
  [-2.4, 1.1],
  [-2.4, 0.5],
  [-2.32, 0.24],
  [-1.79, 0.24],
  ...arch(-1.35),
  [-0.91, 0.24],
  [0.91, 0.24],
  ...arch(1.35),
  [1.79, 0.24],
];
/** The far side's silhouette: the body's outline plus the greenhouse up to the roof cut. */
const FAR: P2[] = [
  [2.3, 0.24],
  [2.37, 0.5],
  [2.35, 0.82],
  [2.22, 1.02],
  [1.7, 1.12],
  [1.12, 1.2],
  [0.45, CAR_LAYOUT.roofCut],
  [-1.45, CAR_LAYOUT.roofCut],
  [-2.25, 1.34],
  [-2.3, 1.3],
  [-2.4, 1.1],
  [-2.4, 0.5],
  [-2.32, 0.24],
  [-1.79, 0.24],
  ...arch(-1.35),
  [-0.91, 0.24],
  [0.91, 0.24],
  ...arch(1.35),
  [1.79, 0.24],
];
/**
 * The electric car's body (No. 006, `ev`): no engine, so the front is an open bay under the hood (the
 * firewall, the hood's skin, the front structure), and no solid sill band between the arches (the
 * battery pack fills it). Two pieces: the front (bumper, hood, bay, firewall) and the rear.
 */
const BODY_EV_FRONT: P2[] = [
  [0.88, 0.34],
  [0.925, 0.34],
  [1.015, 0.8],
  [1.06, 1.1],
  [1.7, 1.05],
  [2.08, 0.96],
  [2.13, 0.86],
  [2.13, 0.24],
  [2.3, 0.24],
  [2.37, 0.5],
  [2.35, 0.82],
  [2.22, 1.02],
  [1.7, 1.12],
  [1.12, 1.2],
  [1.02, 1.18],
  [0.97, 0.8],
];
/**
 * The whole front (firewall, hood, front structure, bumper) is sectioned on one plane of its own,
 * `EV_FIREWALL_Z`, behind the near wheel: one clean outline, and the drive unit shows in the bay.
 */
export const EV_FIREWALL_Z = 0.4;
/**
 * The cut coupe's bay front sectioned further back (`tunnel`, No. 007's V8): behind the gearbox's case
 * (`GBX.back` −0.18), so the firewall and hood don't hide its front pairs where it runs back under the dash.
 */
export const TUNNEL_Z = -0.2;
const BODY_EV_REAR: P2[] = [
  [-0.88, 0.36],
  [-0.88, 0.84],
  [-1.85, 0.84],
  [-1.9, 1.28],
  [-2.3, 1.3],
  [-2.4, 1.1],
  [-2.4, 0.5],
  [-2.32, 0.24],
  [-1.79, 0.24],
  ...arch(-1.35),
];
/** The gas car's sill (No. 008, `gas`): the band between the arches the EV's pack filled. */
const SILL_GAS: P2[] = [
  [-0.91, 0.24],
  [0.91, 0.24],
  [0.9, 0.35],
  [-0.9, 0.35],
];
/** The gas car's lower dashboard is sectioned on its own plane (a step in the cut), so the column and pedals show. */
export const GAS_DASH_Z = 0.28;
const WINDOWS: P2[][] = [
  [
    [1.02, 1.32],
    [0.5, 1.84],
    [-0.1, 1.84],
    [-0.1, 1.32],
  ],
  [
    [-0.22, 1.32],
    [-0.22, 1.84],
    [-1.12, 1.84],
    [-1.2, 1.32],
  ],
  [
    [-1.32, 1.32],
    [-1.32, 1.84],
    [-1.45, 1.84],
    [-2.05, 1.38],
  ],
];

/**
 * The cut coupe's pieces (No. 007). The front: solid (`coupeFront`, with the sill), or the open bay of
 * the electric and gas cars (`coupeBayFront`: firewall, hood skin, front wall and bumper, sectioned
 * at `EV_FIREWALL_Z` like the crossover's). The rear is always hollow (`coupeRear`: the bulkhead behind
 * the seats, the deck's skin, the rear wall and bumper; no rear seats), sectioned at the near cut, or
 * at `REAR_BAY_Z` behind the near rear wheel when the rear bay is open (`rearBay`, `awd`), so a rear
 * drive unit, a differential or a half-shaft shows (the hood's and the deck's inner faces clear the
 * drive unit's inverter by ≈ 2 and 4 cm: the inner lines are the same for every style).
 *
 * The realism pass (No. 007, owner) adds the cues of a style (`coupeStyle`), all generic (no maker's
 * silhouette, badge or lamp signature): 'muscle' (the V8): a taller blunt nose and a long hood (a power
 * bulge over the engine, `CoupeExtras`), haunches rising over the rear wheels, a ducktail lip, a fastback
 * with a thick C-pillar; 'electric': a low rounded closed nose, a smooth deck, a long fastback with
 * frameless glass. No style: the plain coupe (the same cabin, plainer lines).
 */
export type CoupeStyle = 'muscle' | 'electric';

/** The nose and hood's outer line: the front bumper's foot → the cowl (x 1.4). */
const coupeNose = (s?: CoupeStyle): P2[] =>
  s === 'muscle'
    ? [
        [2.33, 0.24],
        [2.45, 0.4],
        [2.465, 0.66],
        [2.42, 0.84],
        [2.3, 0.915],
        [2.0, 0.955],
        [1.4, 1.035],
      ]
    : s === 'electric'
      ? [
          [2.3, 0.24],
          [2.43, 0.33],
          [2.48, 0.52],
          [2.43, 0.7],
          [2.3, 0.82],
          [2.1, 0.895],
          [1.8, 0.96],
          [1.4, 1.025],
        ]
      : [
          [2.32, 0.24],
          [2.44, 0.42],
          [2.4, 0.68],
          [2.25, 0.85],
          [2.0, 0.95],
          [1.4, 1.04],
        ];
/** The deck and tail's outer line: the bulkhead's top (x −0.88) → the rear bumper's foot. */
const coupeTail = (s?: CoupeStyle): P2[] =>
  s === 'muscle'
    ? [
        [-0.88, 1.0],
        [-0.95, 1.07],
        [-1.25, 1.115],
        [-1.62, 1.11],
        [-2.1, 1.065],
        [-2.3, 1.1],
        [-2.37, 1.085],
        [-2.41, 0.98],
        [-2.44, 0.6],
        [-2.36, 0.24],
      ]
    : s === 'electric'
      ? [
          [-0.88, 1.0],
          [-0.95, 1.06],
          [-1.5, 1.075],
          [-2.1, 1.055],
          [-2.31, 1.02],
          [-2.4, 0.93],
          [-2.43, 0.6],
          [-2.35, 0.24],
        ]
      : [
          [-0.88, 1.0],
          [-0.95, 1.06],
          [-1.7, 1.05],
          [-2.28, 1.04],
          [-2.38, 0.97],
          [-2.42, 0.6],
          [-2.34, 0.24],
        ];
/** The coupe's wheel arches: tighter round the tires than the crossover's (0.44), for a lower stance. */
const COUPE_ARCH_R = 0.405;
/** The firewall and cowl behind the hood (the same for every style). */
const COWL: P2[] = [
  [1.04, 1.01],
  [1.0, 0.99],
  [0.97, 0.8],
];
const coupeFront = (s?: CoupeStyle): P2[] => [
  ...coupeNose(s),
  ...COWL,
  [0.88, 0.34],
  [-0.88, 0.34],
  [-0.91, 0.24],
  [0.91, 0.24],
  ...arch(1.35, COUPE_ARCH_R),
  [1.79, 0.24],
];
const coupeBayFront = (s?: CoupeStyle): P2[] => [
  [0.88, 0.34],
  [0.925, 0.34],
  [1.005, 0.8],
  [1.03, 0.975],
  [1.5, 0.975],
  [1.9, 0.9],
  [2.1, 0.82],
  [2.15, 0.74],
  [2.15, 0.24],
  ...coupeNose(s),
  ...COWL,
];
const coupeRear = (s?: CoupeStyle): P2[] => [
  [-0.88, 0.34],
  ...coupeTail(s),
  [-2.2, 0.24],
  [-2.2, 0.92],
  [-2.14, 0.99],
  [-1.7, 1.0],
  [-0.99, 1.0],
  [-0.94, 0.34],
];
/** The rear bay's section plane (`rearBay`): behind the near rear wheel, like the front's `EV_FIREWALL_Z`. */
export const REAR_BAY_Z = 0.4;
/** The windshield's foot (at the cowl) and top (the roof cut): ≈ 30° off the hood. */
const COUPE_WS: [P2, P2] = [
  [1.42, 1.03],
  [0.5, COUPE_ROOF_CUT],
];
const COUPE_ROOF_X: P2 = [-0.5, 0.5];
/** The fastback's line from the roof cut's back end down to the deck (the far side's top, the rear glass). */
const coupeFastback = (s?: CoupeStyle): P2[] =>
  s === 'muscle'
    ? [
        [-0.72, 1.53],
        [-1.15, 1.4],
        [-1.7, 1.22],
        [-2.0, 1.13],
        [-2.1, 1.065],
      ]
    : s === 'electric'
      ? [
          [-0.78, 1.525],
          [-1.3, 1.37],
          [-1.85, 1.19],
          [-2.15, 1.08],
          [-2.25, 1.045],
        ]
      : [[-2.05, 1.06]];
/** The rear glass (cut car): from the roof cut down the fastback to this point. */
const coupeRearGlass = (s?: CoupeStyle): P2 =>
  s === 'muscle' ? [-1.7, 1.22] : s === 'electric' ? [-1.85, 1.19] : [-1.6, 1.21];
/** The cut coupe's far side: its body's outline and the greenhouse up to the roof cut (a fastback). */
const coupeFar = (s?: CoupeStyle): P2[] => {
  const fb = coupeFastback(s);
  const end = fb[fb.length - 1][0];
  return [
    ...coupeNose(s),
    COUPE_WS[1],
    [COUPE_ROOF_X[0], COUPE_ROOF_CUT],
    ...fb,
    ...coupeTail(s).filter(([x]) => x < end - 1e-6),
    [-1.79, 0.24],
    ...arch(-1.35, COUPE_ARCH_R),
    [-0.91, 0.24],
    [0.91, 0.24],
    ...arch(1.35, COUPE_ARCH_R),
    [1.79, 0.24],
  ];
};
/** The cut coupe's low dashboard (x, y spans): one slim slab under the cowl, behind the firewall (clear of the bay and the gearbox). */
const LOW_DASH = {x: [0.64, 0.99] as P2, y: [0.9, 1.07] as P2};
/** The A-pillar's back edge (a window's front edge): x at height y, parallel to the windshield, 9 cm behind it. */
const aPillarX = (y: number) =>
  COUPE_WS[0][0] -
  0.11 -
  ((y - COUPE_WS[0][1]) * (COUPE_WS[0][0] - COUPE_WS[1][0])) / (COUPE_WS[1][1] - COUPE_WS[0][1]);
/**
 * Two doors: one long door window, a quarter light under the fastback. 'muscle': a thick C-pillar (a
 * short quarter light); 'electric': frameless glass, both lights tall and close to the roof and the
 * fastback, a slim black B-pillar between them (`CoupeExtras`).
 */
const coupeWindows = (s?: CoupeStyle): P2[][] =>
  s === 'muscle'
    ? [
        [
          [aPillarX(1.14), 1.14],
          [aPillarX(1.5), 1.5],
          [-0.5, 1.5],
          [-0.5, 1.14],
        ],
        [
          [-0.62, 1.14],
          [-0.62, 1.49],
          [-0.82, 1.46],
          [-1.3, 1.3],
          [-1.42, 1.14],
        ],
      ]
    : s === 'electric'
      ? [
          [
            [aPillarX(1.12), 1.12],
            [aPillarX(1.525), 1.525],
            [-0.52, 1.525],
            [-0.52, 1.12],
          ],
          [
            [-0.58, 1.12],
            [-0.58, 1.525],
            [-0.8, 1.495],
            [-1.35, 1.33],
            [-1.75, 1.18],
            [-1.82, 1.12],
          ],
        ]
      : [
          [
            [aPillarX(1.12), 1.12],
            [aPillarX(1.5), 1.5],
            [-0.55, 1.5],
            [-0.55, 1.12],
          ],
          [
            [-0.68, 1.12],
            [-0.68, 1.47],
            [-1.55, 1.18],
            [-1.58, 1.12],
          ],
        ];

/*
 * The cut sedan's pieces (No. 010, see `SEDAN_LAYOUT`), like the coupe's: the nose and hood, the open bay
 * (firewall, hood skin, front wall, bumper; sectioned at `EV_FIREWALL_Z`), the rear (the sill over the rear
 * arch, the bulkhead behind the rear bench, the parcel shelf, the trunk deck, the rear wall and bumper; the
 * trunk hollow), the far side with a four-door glasshouse, the windshield and rear glass.
 */
/** The sedan's wheel arches (between the coupe's 0.405 and the crossover's 0.44). */
const SEDAN_ARCH_R = 0.42;
/** The nose and hood's outer line: the front bumper's foot → the cowl (x 1.4). */
const SEDAN_NOSE: P2[] = [
  [2.31, 0.24],
  [2.43, 0.42],
  [2.42, 0.68],
  [2.28, 0.86],
  [2.0, 0.96],
  [1.4, 1.06],
];
const SEDAN_FRONT: P2[] = [
  ...SEDAN_NOSE,
  ...COWL,
  [0.88, 0.34],
  [-0.88, 0.34],
  [-0.91, 0.24],
  [0.91, 0.24],
  ...arch(1.35, SEDAN_ARCH_R),
  [1.79, 0.24],
];
const SEDAN_BAY_FRONT: P2[] = [
  [0.88, 0.34],
  [0.925, 0.34],
  [1.005, 0.8],
  [1.03, 0.985],
  [1.5, 0.99],
  [1.9, 0.92],
  [2.1, 0.84],
  [2.15, 0.76],
  [2.15, 0.24],
  ...SEDAN_NOSE,
  ...COWL,
];
/** The deck and tail's outer line: the parcel shelf's back edge → the rear bumper's foot. */
const SEDAN_TAIL: P2[] = [
  [-1.88, 1.165],
  [-2.05, 1.17],
  [-2.24, 1.158],
  [-2.36, 1.12],
  [-2.425, 1.02],
  [-2.445, 0.62],
  [-2.35, 0.24],
];
const SEDAN_REAR: P2[] = [
  [-0.88, 0.34],
  [-0.88, 0.78],
  [-1.74, 0.78],
  [-1.78, 1.1],
  [-1.84, 1.15],
  ...SEDAN_TAIL,
  [-1.79, 0.24],
  ...arch(-1.35, SEDAN_ARCH_R),
];
/** The trunk, hollow in the section (a hole in `SEDAN_REAR`): its floor, the deck lid's and the rear wall's skins. */
const SEDAN_TRUNK: P2[] = [
  [-1.92, 0.6],
  [-1.92, 1.11],
  [-2.22, 1.118],
  [-2.33, 1.085],
  [-2.385, 1.0],
  [-2.39, 0.6],
];
/** The windshield's foot (at the cowl) and top (the roof cut). */
const SEDAN_WS: [P2, P2] = [
  [1.4, 1.06],
  [0.42, SEDAN_ROOF_CUT],
];
const SEDAN_ROOF_X: P2 = [-0.95, 0.42];
/** The rear glass's line from the roof cut's back end down to the deck. */
const SEDAN_BACKLIGHT: P2[] = [
  [-1.3, 1.58],
  [-1.65, 1.37],
  [-1.88, 1.18],
];
const SEDAN_FAR: P2[] = [
  ...SEDAN_NOSE,
  SEDAN_WS[1],
  [SEDAN_ROOF_X[0], SEDAN_ROOF_CUT],
  ...SEDAN_BACKLIGHT,
  ...SEDAN_TAIL.filter(([x]) => x < -1.9),
  [-1.79, 0.24],
  ...arch(-1.35, SEDAN_ARCH_R),
  [-0.91, 0.24],
  [0.91, 0.24],
  ...arch(1.35, SEDAN_ARCH_R),
  [1.79, 0.24],
];
/** Four doors: the front and rear door windows (a sedan's C-pillar behind the rear one). */
const SEDAN_WINDOWS: P2[][] = [
  [
    [1.15, 1.15],
    [0.43, 1.63],
    [-0.1, 1.63],
    [-0.1, 1.15],
  ],
  [
    [-0.22, 1.15],
    [-0.22, 1.63],
    [-0.9, 1.63],
    [-1.38, 1.36],
    [-1.5, 1.15],
  ],
];

/**
 * No. 010: a cut car's side silhouette (car frame, x forward), for a drawing of it (`GhostCar`): the body
 * with its glasshouse (the far side's outline), the windows, and the wheels (centre x, y; radius). The sedan
 * and the coupe have their own; any other shape is the crossover's.
 */
export const carSilhouette = (
  shape: ShellProfile = 'crossover',
): {body: P2[]; windows: P2[][]; wheels: {c: P2; r: number}[]; roof: P2} => {
  const wheels = [CAR_LAYOUT.axleX.front, CAR_LAYOUT.axleX.rear].map((x) => ({c: [x, CAR_LAYOUT.wheelR] as P2, r: CAR_LAYOUT.wheelR}));
  if (shape === 'sedan')
    return {body: SEDAN_FAR, windows: SEDAN_WINDOWS, wheels, roof: [(SEDAN_ROOF_X[0] + SEDAN_ROOF_X[1]) / 2, SEDAN_ROOF_CUT]};
  if (shape === 'coupe')
    return {body: coupeFar(), windows: coupeWindows(), wheels, roof: [(COUPE_ROOF_X[0] + COUPE_ROOF_X[1]) / 2, COUPE_ROOF_CUT]};
  return {body: FAR, windows: WINDOWS, wheels, roof: [-0.5, CAR_LAYOUT.roofCut]};
};

/**
 * No. 010: the charging port on the near rear quarter (car frame, x forward), its centre on the quarter's
 * outer skin (`QUARTER_Z`). The scene plugs a connector in here (`ChargeCable`).
 */
export const QUARTER_Z = 0.93;
export const chargePortAt = (shape: ShellProfile = 'crossover'): V3 =>
  shape === 'sedan' ? [-2.08, 0.9, QUARTER_Z] : shape === 'coupe' ? [-2.05, 0.82, QUARTER_Z] : [-2.05, 0.95, QUARTER_Z];
/** Where the quarter drawn whole begins (just behind the rear arch). */
const QUARTER_X = -1.83;
/** A closed outline shrunk by d (each vertex moved along its bisector; enough for a gentle bevel). */
const offsetIn = (p: P2[], d: number): P2[] => {
  const area = p.reduce((s, [x, y], i) => s + x * p[(i + 1) % p.length][1] - p[(i + 1) % p.length][0] * y, 0);
  const sgn = area > 0 ? 1 : -1;
  return p.map(([x, y], i) => {
    const [px, py] = p[(i - 1 + p.length) % p.length];
    const [nx, ny] = p[(i + 1) % p.length];
    const n1 = [-(y - py), x - px];
    const n2 = [-(ny - y), nx - x];
    const l1 = Math.hypot(n1[0], n1[1]) || 1;
    const l2 = Math.hypot(n2[0], n2[1]) || 1;
    const m = [n1[0] / l1 + n2[0] / l2, n1[1] / l1 + n2[1] / l2];
    const ml = Math.hypot(m[0], m[1]) || 1;
    return [x + (sgn * d * m[0]) / ml, y + (sgn * d * m[1]) / ml] as P2;
  });
};
/** A closed outline clipped to x ≤ x0 (Sutherland–Hodgman). */
const clipBehind = (p: P2[], x0: number): P2[] => {
  const out: P2[] = [];
  for (let i = 0; i < p.length; i++) {
    const a = p[i];
    const b = p[(i + 1) % p.length];
    const ina = a[0] <= x0;
    const inb = b[0] <= x0;
    if (ina) out.push(a);
    if (ina !== inb) out.push([x0, a[1] + ((b[1] - a[1]) * (x0 - a[0])) / (b[0] - a[0])]);
  }
  return out;
};

/**
 * The second drive unit of the all-wheel-drive coupe (`awd`), for the scene to mount in the car's frame:
 * the front `DriveUnit` as it is, mirrored about x = 0, so its final gear sits on the rear axle, its motor
 * ahead of it under the deck, its inverter on top, its HV cable down the bulkhead into the pack's rear
 * wall and its half-shaft out to the near rear wheel. Give it the same values as the front unit: the
 * turns are negated here, so in the mirror it turns the same way as the front one.
 */
export const RearDriveUnit: React.FC<DriveUnitProps> = ({wheelSpin, rotorSpin, rotorBlur = 0, ...rest}) => (
  <group scale={[-1, 1, 1]}>
    <DriveUnit {...rest} wheelSpin={-wheelSpin} rotorSpin={-rotorSpin} rotorBlur={-rotorBlur} />
  </group>
);
/** A point of the front drive unit (`EV`, `EV_BOARD`, its routes) moved to the rear unit (`RearDriveUnit`). */
export const rearUnitPoint = ([x, y, z]: V3): V3 => [-x, y, z];

const shapeOf = (pts: P2[], holes: P2[][] = []) => {
  const s = new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(x, y)));
  for (const h of holes) s.holes.push(new THREE.Path(h.map(([x, y]) => new THREE.Vector2(x, y))));
  return s;
};
const extrude = (shape: THREE.Shape, z0: number, z1: number) => {
  const g = new THREE.ExtrudeGeometry(shape, {depth: z1 - z0, bevelEnabled: false, curveSegments: 12});
  g.translate(0, 0, z0);
  return g;
};

export type RealCarProps = {
  mood: Mood;
  /** Body colour: 'you', 'mom' or 'extra' (a neutral grey for traffic; theme `CAR` bodies), never red or orange. */
  body?: 'you' | 'mom' | 'extra' | 'friend';
  /** The cluster's tire-pressure light lit (warning yellow, flat; the same drawing as the dashboard detail box). */
  warning?: boolean;
  /**
   * The whole car, not cut (default false): both sides with their windows, the roof, the rear window,
   * tail lamps, a rear bumper and a plain plate. For a car seen driving in a slice (the highway), not
   * sectioned by it.
   */
  whole?: boolean;
  /** The tail lamps lit, 0 (off: the dark lens) → 1 (running lights at night), flat emissive, never bloomed. */
  tail?: number;
  /** The plate's invented characters (whole car only; no state name, no logo). */
  plate?: string;
  /** The speed on the cluster's face (mph, default 38). */
  speed?: number;
  /** The tire-pressure symbol on the cluster (default true; false: not drawn). */
  tireLight?: boolean;
  /** Offset of the steering wheel and column (m): a tremble from the scene. Default none. */
  steeringJitter?: [number, number, number];
  /**
   * The electric car (No. 006): an open bay under the hood for the drive unit, no sill band (the pack
   * under the floor shows), no tire-sensor receiver. Default false.
   */
  ev?: boolean;
  /**
   * Which side the driver sits (default 'far', −z). 'near' (+z, the cut side) puts the seat's
   * occupant, wheel and cluster by the cut: with the car drawn mirrored (facing −x), a left-hand-drive
   * car seen from its driver's side.
   */
  driverSide?: 'far' | 'near';
  /** The car is drawn mirrored (a parent scale of −1 in x): the cluster's face is flipped back so it reads. */
  mirrored?: boolean;
  /**
   * The brake lamps lit (cut car), 0 → 1, flat emissive, never bloomed: both tail lamps and a centre
   * high-mount lamp on the tailgate. Default undefined: the cut car keeps its one far tail lamp (as No. 002/005).
   */
  brake?: number;
  /** × the cut edges' ink thickness (default 1; close framings thin it). */
  inkScale?: number;
  /** The cluster as an EV's (No. 006): speed and a power meter, its CHARGE zone orange while `power` < 0 (−1 → 1). */
  evCluster?: {power: number};
  /** The paint colour, overriding `body`'s (a theme token, e.g. `CITY.carBodies`; never red or orange). Default none. */
  paint?: string;
  /**
   * The car's shape: 'crossover' (default), 'hatch' (whole car only, No. 009: the cut car's own outline,
   * a raked hatch, so a car seen whole and then cut keeps its shape; cut, it is the crossover), 'sedan' (whole car only: lower roof, a trunk; cut, it is
   * the crossover) or 'coupe' (No. 007: two doors, low, a long hood and a fastback, whole and cut; cut,
   * its seats sit lower (`carLayout`) and it has no rear seats; no maker's silhouette).
   */
  shape?: ShellProfile;
  /**
   * The all-wheel-drive electric car (No. 007; with `ev` and `shape: 'coupe'`): the rear bay open
   * (`rearBay`) for a second drive unit, which the scene mounts (`RearDriveUnit`). Default false.
   */
  awd?: boolean;
  /**
   * The cut coupe's rear sectioned at `REAR_BAY_Z` behind the near rear wheel, so what sits at the rear
   * axle shows (a drive unit, a differential, the near half-shaft). Default `awd`. Coupe only.
   */
  rearBay?: boolean;
  /** Draw the passenger seat (default true). False leaves it out of the section, e.g. so a gearbox behind it reads (No. 007). */
  passengerSeat?: boolean;
  /** The cut coupe's bay front sectioned at `TUNNEL_Z` instead of `EV_FIREWALL_Z` (a gearbox in the tunnel shows whole). Default false. */
  tunnel?: boolean;
  /**
   * The gas car (No. 008): the EV's open bay under the hood (for the engine), a sill between the
   * arches, no receiver, and the dashboard below its top slab sectioned at `GAS_DASH_Z` so the steering
   * column, the pedals and their wiring show. Default false.
   */
  gas?: boolean;
  /** The dashboard below its top slab sectioned at `GAS_DASH_Z`, as the gas car's (No. 008: the EV's inverter board shows). Default false (implied by `gas`). */
  splitDash?: boolean;
  /** The steering wheel's turn (rad); when given, the wheel has three spokes so the turn reads. Default none (No. 002–006). */
  steer?: number;
  /**
   * The coupe's style (No. 007 realism pass; `shape: 'coupe'` only, whole and cut): 'muscle' (a long hood
   * with a power bulge, haunches, a ducktail, twin exhaust tips, a mesh grille, round lamps) or 'electric'
   * (a closed nose, full-width light bars, flush handles, a fastback with frameless glass). Either one
   * also gets a deep clearcoat paint, darker tinted glass, sport bucket seats and a thick three-spoke
   * wheel, panel lines and a diffuser. Generic: no maker's silhouette, badge or lamp signature. Default
   * none (the plain coupe).
   */
  coupeStyle?: CoupeStyle;
  /**
   * No. 010 (cut car only): the near rear quarter drawn whole (not sectioned), from just behind the rear arch to
   * the rear bumper, with a charging port on it (`chargePortAt`): a recessed socket, its flap open, a ring
   * light `light` 0 (off, `ledOff`) → 1 (`section.signalGreen`, flat, never bloomed). Default none.
   */
  port?: {light?: number};
};

const TAIL_RED = raw(HIGHWAY.tailLight);
const BRAKE_RED = raw(section.brakeLit);

/** The car body, cabin and fittings (see the file comment). */
export const RealCar: React.FC<RealCarProps> = ({
  mood,
  body = 'you',
  warning = false,
  whole = false,
  tail = 0,
  plate = '8KTR 214',
  speed = 38,
  tireLight = true,
  steeringJitter,
  ev = false,
  driverSide = 'far',
  mirrored = false,
  brake,
  inkScale = 1,
  evCluster,
  paint,
  shape = 'crossover',
  gas = false,
  splitDash = false,
  steer,
  awd = false,
  rearBay = awd,
  passengerSeat = true,
  tunnel = false,
  coupeStyle,
  port,
}) => {
  const split = gas || splitDash;
  // the gas car's body is the EV's (open bay) plus a sill
  const bay = ev || gas;
  const coupe = shape === 'coupe';
  // No. 010: the cut sedan uses the coupe's low-cabin pieces with its own outlines (`SEDAN_LAYOUT`)
  const sedanCut = shape === 'sedan' && !whole;
  // the coupe's style (No. 007 realism pass): ignored on the other shapes
  const style = coupe ? coupeStyle : undefined;
  const ready = useFontsLoaded();
  const L = carLayout(shape, driverSide, whole);
  const face = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 380;
    c.height = 120;
    const tx = new THREE.CanvasTexture(c);
    return {c, tx, key: '', mat: new THREE.MeshBasicMaterial({map: tx})};
  }, []);
  const faceKey = evCluster ? `ev|${speed}|${Math.round(evCluster.power * 100)}` : `${warning}|${speed}|${tireLight}`;
  if (ready && face.key !== faceKey) {
    if (evCluster) drawEvCluster(face.c.getContext('2d')!, 380, 120, {speed, power: evCluster.power});
    else drawCluster(face.c.getContext('2d')!, 380, 120, {warning, speed, trip: 'TRIP 12:40', tireLight});
    face.tx.needsUpdate = true;
    face.key = faceKey;
  }
  face.mat.color.setScalar(0.9 / MOODS[mood].exposure);
  const cluster = ready ? face.mat : null;
  const env = useStudioEnv();
  const envScale = useEnvStrength();
  const albedo = useAlbedo();
  const m = MOODS[mood];
  const mats = useMemo(() => {
    const phys = (c: string, o: THREE.MeshPhysicalMaterialParameters = {}) =>
      new THREE.MeshPhysicalMaterial({color: raw(c), ...o});
    return {
      // the whole car's paint satin, not gloss: its rounded roof and beltline edges mirrored the key as
      // broad white bands (style guide § 2: only glints ≤ 12 px may clip)
      // the styled coupe (No. 007 realism pass): a deep metallic base under a clear, glossy coat
      paint: phys(
        paint ?? CAR[mood].bodies[body],
        style
          ? {
              roughness: whole ? 0.34 : 0.26,
              metalness: 0.45,
              clearcoat: 1,
              clearcoatRoughness: whole ? 0.12 : 0.05,
            }
          : {
              roughness: whole ? 0.5 : 0.32,
              metalness: whole ? 0.2 : 0.35,
              clearcoat: whole ? 0.3 : 1,
              clearcoatRoughness: whole ? 0.55 : 0.12,
            },
      ),
      cut: cutMaterial(),
      trim: phys(REAL.dash, {roughness: 0.7}),
      seat: phys(REAL.seat, {roughness: 0.85}),
      carpet: phys(REAL.carpet, {roughness: 0.95}),
      glass: phys(REAL.carGlass, {roughness: 0.05, clearcoat: 1, transparent: true, opacity: 0.45, depthWrite: false}),
      chrome: phys(REAL.steel, {metalness: 1, roughness: 0.25}),
      receiver: phys(REAL.receiver, {roughness: 0.5}),
      light: phys('#dfe3e8', {roughness: 0.15, clearcoat: 1}),
      tail: phys(HIGHWAY.tailLens, {
        roughness: 0.2,
        clearcoat: 1,
        emissive: raw(HIGHWAY.tailLight),
        emissiveIntensity: 0,
      }),
      tailBright: phys(HIGHWAY.tailLens, {
        roughness: 0.2,
        clearcoat: 1,
        emissive: raw(HIGHWAY.tailLight),
        emissiveIntensity: 0,
      }),
      reverse: phys(REAL.chrome, {roughness: 0.12, clearcoat: 1, metalness: 0.2}),
      reflector: phys(HIGHWAY.tailLens, {roughness: 0.3, clearcoat: 1}),
      // tinted glass, slightly soft: its rounded top edge mirrored the key as an ≈ 90 px streak at 0.08
      // (the rear window's rake keeps the key's image off the flat glass: CarShell GLASS)
      tint: phys(REAL.carGlass, {
        roughness: 0.3,
        clearcoat: 0.3,
        clearcoatRoughness: 0.4,
        transparent: true,
        opacity: 0.62,
        depthWrite: false,
      }),
      mirror: phys(REAL.carGlass, {roughness: 0.02, metalness: 0.9}),
      gloss: phys(REAL.dash, {roughness: 0.3, clearcoat: 0.6}),
      bumper: phys(REAL.dash, {roughness: 0.55}),
      plate: new THREE.MeshStandardMaterial({color: raw('#ffffff'), roughness: 0.5}),
      // the styled coupe's parts (No. 007 realism pass): darker tinted glass, chrome exhaust tips, the
      // grille's mesh, gloss-black trim (the EV's pillars and light-bar housings), the sport seats' bolsters
      glassTint: phys(REAL.carGlass, {
        roughness: 0.04,
        clearcoat: 1,
        transparent: true,
        opacity: 0.6,
        depthWrite: false,
      }),
      tip: phys(REAL.chrome, {metalness: 1, roughness: 0.34}),
      // the coupe's raked windshield and fastback glass, a touch soft: sharp, they mirrored the sky as a
      // ≈ 26 px clipped band from the fixed camera (style guide § 2: glints ≤ 12 px)
      rakedGlass: phys(REAL.carGlass, {
        roughness: 0.2,
        clearcoat: 0.4,
        clearcoatRoughness: 0.3,
        transparent: true,
        opacity: 0.45,
        depthWrite: false,
      }),
      grille: phys(REAL.labDark, {roughness: 0.55, metalness: 0.3}),
      gloss2: phys(REAL.dash, {roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.1}),
      bolster: phys(REAL.dash, {roughness: 0.75, sheen: 0.4, sheenRoughness: 0.5, sheenColor: raw(REAL.steel)}),
    };
  }, [mood, body, whole, paint, style]);
  const tailLit = Math.max(0, Math.min(1, tail));
  const brakeLit = Math.max(0, Math.min(1, brake ?? 0));
  const lit = Math.max(tailLit, brakeLit);
  // Brake lamps (No. 006 `brake`, whole and cut cars): a saturated red (`section.brakeLit`, the signal
  // red's hue) brighter than the running lights, held under the tone curve's shoulder so it stays red,
  // not pink. Running lights keep `tailLight` at their old level; unchanged when `brake` is 0. Flat
  // emissive, never bloomed.
  const tailLevel = (whole ? 0.45 : 0.9) * tailLit;
  const brakeOn = brakeLit > 0 && 1.7 * brakeLit >= tailLevel;
  mats.tail.emissive.copy(brakeOn ? BRAKE_RED : TAIL_RED);
  mats.tailBright.emissive.copy(brakeOn ? BRAKE_RED : TAIL_RED);
  mats.tail.emissiveIntensity = (brakeOn ? 1.7 * brakeLit : tailLevel) / m.exposure;
  // the light guides and the light bar: the brightest part of a lit lamp (still flat, never bloomed)
  mats.tailBright.emissiveIntensity = (brakeOn ? 1.9 * brakeLit : 1.5 * lit) / m.exposure;
  // a plain plate with invented characters (no state name, no logo), drawn once the fonts are in
  const plateTex = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 128;
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return {c, t, key: ''};
  }, []);
  if (whole && ready && plateTex.key !== plate) {
    const cx = plateTex.c.getContext('2d')!;
    cx.fillStyle = STREET.dial;
    cx.fillRect(0, 0, 256, 128);
    cx.strokeStyle = STREET.dialInk;
    cx.lineWidth = 6;
    cx.strokeRect(6, 6, 244, 116);
    cx.fillStyle = STREET.dialInk;
    cx.font = `700 46px ${fonts.mono}, monospace`;
    cx.textAlign = 'center';
    cx.textBaseline = 'middle';
    cx.fillText(plate, 128, 68);
    plateTex.t.needsUpdate = true;
    plateTex.key = plate;
    mats.plate.map = plateTex.t;
    mats.plate.needsUpdate = true;
  }
  applyEnv(
    env,
    [
      [mats.paint, style ? 1.05 : 0.8],
      [mats.glass, 1.5],
      [mats.chrome, 1],
      [mats.light, 0.8],
      [mats.tint, 0.7],
      [mats.mirror, 1.2],
      [mats.reverse, 1],
      [mats.gloss, 0.6],
      [mats.glassTint, 1.4],
      [mats.rakedGlass, 0.9],
      [mats.tip, 1.1],
      [mats.grille, 0.5],
      [mats.gloss2, 0.45],
    ],
    envScale,
  );
  applyAlbedo([mats.paint, mats.trim, mats.seat, mats.carpet, mats.receiver, mats.gloss, mats.bumper], albedo);
  if (style) applyAlbedo([mats.grille, mats.gloss2, mats.bolster], albedo);

  const geo = useMemo(
    () => ({
      body: extrude(shapeOf(BODY), -0.87, CAR_LAYOUT.cutZ),
      evFront: extrude(shapeOf(BODY_EV_FRONT), -0.87, EV_FIREWALL_Z),
      evRear: extrude(shapeOf(BODY_EV_REAR), -0.87, CAR_LAYOUT.cutZ),
      sill: extrude(shapeOf(SILL_GAS), -0.87, CAR_LAYOUT.cutZ),
      far: extrude(shapeOf(FAR, WINDOWS), CAR_LAYOUT.farZ, -0.87),
      glass: WINDOWS.map((w) => new THREE.ShapeGeometry(shapeOf(w))),
    }),
    [],
  );
  // the cut coupe's pieces, for its style (No. 010: the cut sedan's, from its own outlines)
  const cg = useMemo(() => {
    if (sedanCut)
      return {
        front: extrude(shapeOf(SEDAN_FRONT), -0.87, CAR_LAYOUT.cutZ),
        bay: extrude(shapeOf(SEDAN_BAY_FRONT), -0.87, EV_FIREWALL_Z),
        bayTunnel: extrude(shapeOf(SEDAN_BAY_FRONT), -0.87, TUNNEL_Z),
        rear: extrude(shapeOf(SEDAN_REAR, [SEDAN_TRUNK]), -0.87, CAR_LAYOUT.cutZ),
        rearBay: extrude(shapeOf(SEDAN_REAR, [SEDAN_TRUNK]), -0.87, REAR_BAY_Z),
        far: extrude(shapeOf(SEDAN_FAR, SEDAN_WINDOWS), CAR_LAYOUT.farZ, -0.87),
        glass: SEDAN_WINDOWS.map((w) => new THREE.ShapeGeometry(shapeOf(w))),
      };
    if (!coupe || whole) return null;
    const win = coupeWindows(style);
    return {
      front: extrude(shapeOf(coupeFront(style)), -0.87, CAR_LAYOUT.cutZ),
      bay: extrude(shapeOf(coupeBayFront(style)), -0.87, EV_FIREWALL_Z),
      bayTunnel: extrude(shapeOf(coupeBayFront(style)), -0.87, TUNNEL_Z),
      rear: extrude(shapeOf(coupeRear(style)), -0.87, CAR_LAYOUT.cutZ),
      rearBay: extrude(shapeOf(coupeRear(style)), -0.87, REAR_BAY_Z),
      far: extrude(shapeOf(coupeFar(style), win), CAR_LAYOUT.farZ, -0.87),
      glass: win.map((w) => new THREE.ShapeGeometry(shapeOf(w))),
    };
  }, [coupe, whole, style, sedanCut]);
  const zRear = rearBay ? REAR_BAY_Z : CAR_LAYOUT.cutZ;
  const bodyInk = useMemo(
    () =>
      sedanCut
        ? [
            bay
              ? SEDAN_BAY_FRONT.map(([x, y]) => [x, y, (tunnel ? TUNNEL_Z : EV_FIREWALL_Z) + 0.003] as V3)
              : SEDAN_FRONT.map(([x, y]) => [x, y, CAR_LAYOUT.cutZ + 0.003] as V3),
            SEDAN_REAR.map(([x, y]) => [x, y, zRear + 0.003] as V3),
            SEDAN_TRUNK.map(([x, y]) => [x, y, zRear + 0.003] as V3),
            ...(gas ? [SILL_GAS.map(([x, y]) => [x, y, CAR_LAYOUT.cutZ + 0.003] as V3)] : []),
          ]
        : coupe
        ? [
            ...(bay
              ? [coupeBayFront(style).map(([x, y]) => [x, y, (tunnel ? TUNNEL_Z : EV_FIREWALL_Z) + 0.003] as V3)]
              : [coupeFront(style).map(([x, y]) => [x, y, CAR_LAYOUT.cutZ + 0.003] as V3)]),
            coupeRear(style).map(([x, y]) => [x, y, zRear + 0.003] as V3),
            ...(gas ? [SILL_GAS.map(([x, y]) => [x, y, CAR_LAYOUT.cutZ + 0.003] as V3)] : []),
          ]
        : bay
          ? [
              BODY_EV_FRONT.map(([x, y]) => [x, y, EV_FIREWALL_Z + 0.003] as V3),
              BODY_EV_REAR.map(([x, y]) => [x, y, CAR_LAYOUT.cutZ + 0.003] as V3),
              ...(gas ? [SILL_GAS.map(([x, y]) => [x, y, CAR_LAYOUT.cutZ + 0.003] as V3)] : []),
            ]
          : [BODY.map(([x, y]) => [x, y, CAR_LAYOUT.cutZ + 0.003] as V3)],
    [bay, gas, coupe, zRear, tunnel, style, sedanCut],
  );
  const inkT = 0.011 * inkScale;
  const ws = sedanCut
    ? new THREE.Vector3(...SEDAN_WS[0], 0)
    : coupe
      ? new THREE.Vector3(...COUPE_WS[0], 0)
      : new THREE.Vector3(1.12, 1.2, 0);
  const we = sedanCut
    ? new THREE.Vector3(...SEDAN_WS[1], 0)
    : coupe
      ? new THREE.Vector3(...COUPE_WS[1], 0)
      : new THREE.Vector3(0.45, L.roofCut, 0);
  // the roof rail's cut (x0, x1) on the far side's top
  const rail: P2 = sedanCut ? SEDAN_ROOF_X : coupe ? COUPE_ROOF_X : [-1.45, 0.45];
  const wLen = ws.distanceTo(we);
  const wAng = Math.atan2(we.y - ws.y, we.x - ws.x);
  const [sx, sy, sz] = L.steering;
  // across the car: the whole width, or from the far side to the near cut
  const span = whole ? {w: 1.6, z: 0} : {w: L.cutZ + 0.87, z: (L.cutZ - 0.87) / 2};
  // the cut car's lamps (x, y): headlights on the nose, the far tail lamp, the centre high-mount lamp
  const lamps: Record<'head' | 'tail' | 'high', P2> = sedanCut
    ? {head: [2.345, 0.78], tail: [-2.415, 0.98], high: [-1.86, 1.19]}
    : coupe
      ? {head: [2.43, 0.6], tail: [-2.4, 0.88], high: [-2.22, 1.065]}
      : {head: [2.33, 0.86], tail: [-2.39, 1.0], high: [-2.33, 1.315]};

  return (
    <group>
      {whole ? (
        // the whole car's shell: rounded body, glasshouse, lamps, bumper, plate, cladding (CarShell)
        <CarShell
          profile={shape}
          style={style}
          mats={{
            paint: mats.paint,
            glass: mats.tint,
            trim: mats.trim,
            gloss: mats.mirror,
            tail: mats.tail,
            tailBright: mats.tailBright,
            reverse: mats.reverse,
            reflector: mats.reflector,
            light: mats.light,
            plate: mats.plate,
          }}
        />
      ) : (
        <>
          {/* the lower body: cut face (hatched) at the near cut, paint elsewhere */}
          {cg ? (
            <>
              <mesh
                geometry={bay ? (tunnel ? cg.bayTunnel : cg.bay) : cg.front}
                material={[mats.cut, mats.paint]}
                castShadow
                receiveShadow
              />
              <mesh
                geometry={rearBay ? cg.rearBay : cg.rear}
                material={[mats.cut, mats.paint]}
                castShadow
                receiveShadow
              />
              {gas ? <mesh geometry={geo.sill} material={[mats.cut, mats.paint]} castShadow receiveShadow /> : null}
            </>
          ) : bay ? (
            <>
              <mesh geometry={geo.evFront} material={[mats.cut, mats.paint]} castShadow receiveShadow />
              <mesh geometry={geo.evRear} material={[mats.cut, mats.paint]} castShadow receiveShadow />
              {gas ? <mesh geometry={geo.sill} material={[mats.cut, mats.paint]} castShadow receiveShadow /> : null}
            </>
          ) : (
            <mesh geometry={geo.body} material={[mats.cut, mats.paint]} castShadow receiveShadow />
          )}
          {bodyInk.map((b, i) => (
            <InkLine key={i} points={b} thickness={inkT} />
          ))}
          {port ? (
            <ChargeQuarter
              outline={sedanCut ? SEDAN_REAR : coupe ? coupeRear(style) : bay ? BODY_EV_REAR : BODY}
              port={chargePortAt(shape)}
              light={port.light ?? 0}
              lampY={lamps.tail[1]}
              lampX={lamps.tail[0]}
              mood={mood}
              mats={mats}
              inkT={inkT}
            />
          ) : null}
          {/* the far side with its windows, standing like a room's back wall; the roof rail cut on top */}
          <mesh geometry={cg ? cg.far : geo.far} material={[mats.paint, mats.paint]} castShadow receiveShadow />
          {(cg ? cg.glass : geo.glass).map((g, i) => (
            <mesh key={i} geometry={g} material={style ? mats.glassTint : mats.glass} position={[0, 0, -0.905]} />
          ))}
          <mesh
            position={[(rail[0] + rail[1]) / 2, L.roofCut + 0.001, (L.farZ - 0.87) / 2]}
            rotation={[-Math.PI / 2, 0, 0]}
            material={mats.cut}
          >
            <planeGeometry args={[rail[1] - rail[0], 0.08]} />
          </mesh>
          <CutOutline
            rects={[
              [
                [rail[0], L.roofCut + 0.002, L.farZ],
                [rail[1], L.roofCut + 0.002, -0.87],
              ],
            ]}
            thickness={inkT}
          />
          {/* the windshield, cut at the roof and at the near cut */}
          <mesh
            position={[(ws.x + we.x) / 2, (ws.y + we.y) / 2, span.z]}
            rotation={[0, 0, wAng]}
            material={cg ? mats.rakedGlass : mats.glass}
          >
            <boxGeometry args={[wLen, 0.012, span.w]} />
          </mesh>
          {cg ? (
            // the coupe's fastback glass, cut at the roof and at the near cut like the windshield
            sedanCut ? (
              <RearGlass
                from={[SEDAN_ROOF_X[0], SEDAN_ROOF_CUT]}
                to={SEDAN_BACKLIGHT[2]}
                z={span.z}
                w={span.w}
                material={mats.rakedGlass}
              />
            ) : (
              <RearGlass to={coupeRearGlass(style)} z={span.z} w={span.w} material={mats.rakedGlass} />
            )
          ) : null}
          {style && cg ? (
            <CoupeExtras
              style={style}
              mats={mats}
              zFront={bay ? (tunnel ? TUNNEL_Z : EV_FIREWALL_Z) : CAR_LAYOUT.cutZ}
              zRear={zRear}
              brakeLamp={brake !== undefined}
              inkT={inkT}
            />
          ) : (
            <>
              {/* headlights (generic strips) */}
              <mesh position={[...lamps.head, 0.55]} rotation={[0, Math.PI / 2, 0]} material={mats.light}>
                <planeGeometry args={[0.36, 0.08]} />
              </mesh>
              <mesh position={[...lamps.head, -0.6]} rotation={[0, Math.PI / 2, 0]} material={mats.light}>
                <planeGeometry args={[0.36, 0.08]} />
              </mesh>
              {/* the tail lamps on the far side's back corner (lit at night, like the whole car's) */}
              <mesh
                geometry={roundedBox(0.04, 0.17, 0.3, 0.012)}
                material={mats.tail}
                position={[...lamps.tail, -0.68]}
              />
              {brake !== undefined ? (
                <>
                  {/* the brake lamps (No. 006): the near tail lamp, cut by the section, and the centre high-mount lamp */}
                  <mesh
                    material={[mats.tail, mats.tail, mats.tail, mats.tail, mats.cut, mats.tail]}
                    position={[...lamps.tail, 0.66]}
                  >
                    <boxGeometry args={[0.04, 0.17, 0.28]} />
                  </mesh>
                  <mesh
                    geometry={roundedBox(0.05, 0.035, 0.36, 0.01)}
                    material={mats.tailBright}
                    position={[...lamps.high, 0]}
                  />
                </>
              ) : null}
            </>
          )}
        </>
      )}
      <group position={[0, whole ? -L.wholeSink - shellSink(shape) : 0, 0]}>
        {/* the cabin: carpet, dashboard (cut at the near cut), seats */}
        <mesh
          position={[0, L.floor + 0.003, -0.03]}
          rotation={[-Math.PI / 2, 0, 0]}
          material={mats.carpet}
          receiveShadow
        >
          <planeGeometry args={[1.74, 1.66]} />
        </mesh>
        {cg ? (
          <>
            {/* the coupe's low dash (No. 007 realism pass): one slim slab under the cowl, sectioned at the near cut */}
            <mesh
              position={[(LOW_DASH.x[0] + LOW_DASH.x[1]) / 2, (LOW_DASH.y[0] + LOW_DASH.y[1]) / 2, span.z]}
              material={[mats.trim, mats.trim, mats.trim, mats.trim, mats.cut, mats.trim]}
              castShadow
              receiveShadow
            >
              <boxGeometry args={[LOW_DASH.x[1] - LOW_DASH.x[0], LOW_DASH.y[1] - LOW_DASH.y[0], span.w]} />
            </mesh>
            <CutOutline
              rects={[
                [
                  [LOW_DASH.x[0], LOW_DASH.y[0], L.cutZ],
                  [LOW_DASH.x[1], LOW_DASH.y[1], L.cutZ],
                ],
              ]}
              thickness={inkT}
            />
          </>
        ) : split && !whole ? (
          <>
            {/* the gas car: the dash's top slab runs to the cut; below it the dash is sectioned at GAS_DASH_Z */}
            <mesh
              position={[0.92, 1.16, span.z]}
              material={[mats.trim, mats.trim, mats.trim, mats.trim, mats.cut, mats.trim]}
              castShadow
              receiveShadow
            >
              <boxGeometry args={[0.4, 0.12, span.w]} />
            </mesh>
            <mesh
              position={[0.92, 1.01, (GAS_DASH_Z - 0.87) / 2]}
              material={[mats.trim, mats.trim, mats.trim, mats.trim, mats.cut, mats.trim]}
              castShadow
              receiveShadow
            >
              <boxGeometry args={[0.4, 0.18, GAS_DASH_Z + 0.87]} />
            </mesh>
            <CutOutline
              rects={[
                [
                  [0.72, 1.1, L.cutZ],
                  [1.12, 1.22, L.cutZ],
                ],
                [
                  [0.72, 0.92, GAS_DASH_Z],
                  [1.12, 1.1, GAS_DASH_Z],
                ],
              ]}
              thickness={inkT}
            />
          </>
        ) : (
          <mesh
            position={[0.92, 1.08, span.z]}
            material={[mats.trim, mats.trim, mats.trim, mats.trim, whole ? mats.trim : mats.cut, mats.trim]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[0.4, 0.28, span.w]} />
          </mesh>
        )}
        {whole || split || cg ? null : (
          <CutOutline
            rects={[
              [
                [0.72, 0.94, L.cutZ],
                [1.12, 1.22, L.cutZ],
              ],
            ]}
            thickness={inkT}
          />
        )}
        {/* the cluster's binnacle and face (the face looks at the driver, read in the detail box) */}
        <mesh
          geometry={roundedBox(0.12, 0.16, 0.44, 0.02)}
          material={mats.trim}
          position={[L.cluster[0] + 0.07, L.cluster[1], L.cluster[2]]}
          castShadow
        />
        {cluster ? (
          <mesh
            position={[L.cluster[0] + 0.005, L.cluster[1], L.cluster[2]]}
            rotation={[0, -Math.PI / 2, 0]}
            scale={mirrored ? [-1, 1, 1] : undefined}
            material={cluster}
          >
            <planeGeometry args={[0.38, 0.12]} />
          </mesh>
        ) : null}
        {/* steering column and wheel */}
        <group
          position={
            steeringJitter ? [sx + steeringJitter[0], sy + steeringJitter[1], sz + steeringJitter[2]] : [sx, sy, sz]
          }
          rotation={[0, 0, -0.42]}
        >
          <group rotation={[steer ?? 0, 0, 0]}>
            {style ? (
              // the styled coupe's sport wheel: a thick rim, three broad spokes, a padded hub
              <>
                <mesh rotation={[0, Math.PI / 2, 0]} material={mats.bolster} castShadow>
                  <torusGeometry args={[0.162, 0.027, 14, 48]} />
                </mesh>
                {[Math.PI / 2, Math.PI / 2 + (2 * Math.PI) / 3, Math.PI / 2 - (2 * Math.PI) / 3].map((a) => (
                  <mesh
                    key={a}
                    position={[0, -0.085 * Math.sin(a), 0.085 * Math.cos(a)]}
                    rotation={[a, 0, 0]}
                    material={mats.trim}
                    castShadow
                  >
                    <boxGeometry args={[0.02, 0.05, 0.15]} />
                  </mesh>
                ))}
                <mesh position={[-0.012, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={mats.bolster}>
                  <cylinderGeometry args={[0.065, 0.065, 0.035, 24]} />
                </mesh>
              </>
            ) : (
              <mesh rotation={[0, Math.PI / 2, 0]} material={mats.trim} castShadow>
                <torusGeometry args={[0.17, 0.018, 12, 40]} />
              </mesh>
            )}
            {steer !== undefined && !style
              ? // three spokes (No. 008), so a turn of the wheel reads
                [Math.PI / 2, Math.PI / 2 + (2 * Math.PI) / 3, Math.PI / 2 - (2 * Math.PI) / 3].map((a) => (
                  <mesh
                    key={a}
                    position={[0, -0.085 * Math.sin(a), 0.085 * Math.cos(a)]}
                    rotation={[a, 0, 0]}
                    material={mats.trim}
                    castShadow
                  >
                    <boxGeometry args={[0.012, 0.03, 0.16]} />
                  </mesh>
                ))
              : null}
          </group>
          {/* the column (the coupe's longer: its wheel sits back, `COUPE_SEAT_BACK`) */}
          <mesh position={[cg ? 0.2 : 0.11, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={mats.trim} castShadow>
            <cylinderGeometry args={[0.03, 0.04, cg ? 0.4 : 0.22, 16]} />
          </mesh>
          <mesh position={[0.005, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={mats.trim}>
            <cylinderGeometry args={[0.06, 0.06, 0.03, 20]} />
          </mesh>
        </group>
        {/* the receiver under the dash (its node dot is drawn by the scene); none on the electric car */}
        {bay ? null : (
          <mesh
            geometry={roundedBox(0.14, 0.05, 0.1, 0.008)}
            material={mats.receiver}
            position={L.receiver}
            castShadow
          />
        )}
        {(passengerSeat ? [L.driver, L.passenger] : [L.driver]).map((p, i) =>
          style ? (
            <SportSeat key={i} at={p} mats={mats} drop={whole ? 0 : COUPE_SEAT_DROP + COUPE_CABIN_SINK} />
          ) : (
            <Seat
              key={i}
              at={p}
              mats={mats}
              drop={coupe && !whole ? COUPE_SEAT_DROP + COUPE_CABIN_SINK : sedanCut ? SEDAN_SEAT_DROP + SEDAN_CABIN_SINK : 0}
            />
          ),
        )}
        {/* the rear bench on its riser (none in the coupe: two seats) */}
        {coupe ? null : sedanCut ? (
          <>
            {/* the cut sedan's rear bench, lower and shorter-backed under its roof; the trunk's carpet */}
            <mesh
              geometry={roundedBox(0.55, 0.14, 1.5, 0.05, 4)}
              material={mats.seat}
              position={[-1.3, 0.92 - SEDAN_CABIN_SINK, -0.05]}
              castShadow
              receiveShadow
            />
            <mesh
              geometry={roundedBox(0.14, 0.5, 1.5, 0.05, 4)}
              material={mats.seat}
              position={[-1.57, 1.03, -0.05]}
              rotation={[0, 0, 0.2]}
              castShadow
              receiveShadow
            />
            <mesh position={[-2.155, 0.603, (zRear - 0.87) / 2]} rotation={[-Math.PI / 2, 0, 0]} material={mats.carpet}>
              <planeGeometry args={[0.46, zRear + 0.87]} />
            </mesh>
            <mesh position={[-2.155, 0.85, -0.865]} material={mats.carpet}>
              <planeGeometry args={[0.46, 0.5]} />
            </mesh>
          </>
        ) : (
          <>
            <mesh
              geometry={roundedBox(0.55, 0.14, 1.5, 0.05, 4)}
              material={mats.seat}
              position={[-1.35, 0.92, -0.05]}
              castShadow
              receiveShadow
            />
            <mesh
              geometry={roundedBox(0.14, 0.62, 1.5, 0.05, 4)}
              material={mats.seat}
              position={[-1.62, 1.28, -0.05]}
              rotation={[0, 0, 0.12]}
              castShadow
              receiveShadow
            />
          </>
        )}
      </group>
      <BlobShadow position={[0, 0.003, -0.05]} size={[5.4, 2.4]} opacity={0.45} />
    </group>
  );
};

/**
 * A front seat: cushion at the figure's seat height (0.57 above its origin), back, headrest. `drop`: the
 * seat stands that much lower than its floor (`at` is the figure's origin), its pedestal shortened.
 */
const Seat: React.FC<{at: V3; mats: {seat: THREE.Material; trim: THREE.Material}; drop?: number}> = ({
  at,
  mats,
  drop = 0,
}) => {
  const [x, y, z] = at;
  return (
    <group position={[x, y, z]}>
      <mesh
        geometry={roundedBox(0.52, 0.12, 0.5, 0.04, 4)}
        material={mats.seat}
        position={[-0.05, 0.51, 0]}
        castShadow
        receiveShadow
      />
      <mesh position={[-0.05, 0.22 + drop / 2, 0]} material={mats.trim}>
        <boxGeometry args={[0.36, 0.44 - drop, 0.3]} />
      </mesh>
      <mesh
        geometry={roundedBox(0.12, 0.72, 0.48, 0.04, 4)}
        material={mats.seat}
        position={[-0.34, 0.92, 0]}
        rotation={[0, 0, 0.18]}
        castShadow
        receiveShadow
      />
      <mesh
        geometry={roundedBox(0.1, 0.18, 0.26, 0.04, 4)}
        material={mats.seat}
        position={[-0.43, 1.4, 0]}
        castShadow
      />
    </group>
  );
};

/** Where a closed outline's edges cross height y: the smallest x (the rear face) or the largest (the nose). */
const xAtY = (p: P2[], y: number, end: 'rear' | 'front') => {
  let best = end === 'rear' ? Infinity : -Infinity;
  for (let i = 0; i < p.length; i++) {
    const [ax, ay] = p[i];
    const [bx, by] = p[(i + 1) % p.length];
    if ((ay - y) * (by - y) > 0 || ay === by) continue;
    const x = ax + ((bx - ax) * (y - ay)) / (by - ay);
    best = end === 'rear' ? Math.min(best, x) : Math.max(best, x);
  }
  return best;
};
/** The highest point of a closed outline over x (its top line: the hood, the deck). */
const topAtX = (p: P2[], x: number) => {
  let best = -Infinity;
  for (let i = 0; i < p.length; i++) {
    const [ax, ay] = p[i];
    const [bx, by] = p[(i + 1) % p.length];
    if ((ax - x) * (bx - x) > 0 || ax === bx) continue;
    best = Math.max(best, ay + ((by - ay) * (x - ax)) / (bx - ax));
  }
  return best;
};

/** The coupe's fastback glass (cut car): a pane from the roof cut's back end down to `to`, across the cabin. */
const RearGlass: React.FC<{from?: P2; to: P2; z: number; w: number; material: THREE.Material}> = ({
  from = [COUPE_ROOF_X[0], COUPE_ROOF_CUT],
  to,
  z,
  w,
  material,
}) => {
  const a = new THREE.Vector2(...from);
  const b = new THREE.Vector2(...to);
  return (
    <mesh
      position={[(a.x + b.x) / 2, (a.y + b.y) / 2, z]}
      rotation={[0, 0, Math.atan2(b.y - a.y, b.x - a.x)]}
      material={material}
    >
      <boxGeometry args={[a.distanceTo(b), 0.012, w]} />
    </mesh>
  );
};

type ExtraMats = {
  paint: THREE.Material;
  cut: THREE.Material;
  trim: THREE.Material;
  light: THREE.Material;
  tail: THREE.Material;
  tailBright: THREE.Material;
  mirror: THREE.Material;
  tip: THREE.Material;
  grille: THREE.Material;
  gloss2: THREE.Material;
  chrome: THREE.Material;
};

/** A cylinder along x (a lamp's lens, an exhaust tip), centred at p. */
const AlongX: React.FC<{p: V3; r: number; len: number; material: THREE.Material; seg?: number}> = ({
  p,
  r,
  len,
  material,
  seg = 28,
}) => (
  <mesh position={p} rotation={[0, 0, Math.PI / 2]} material={material}>
    <cylinderGeometry args={[r, r, len, seg]} />
  </mesh>
);

/** A thin seam (a panel gap) along a polyline: a dark tube. */
const Seam: React.FC<{pts: V3[]; material: THREE.Material; r?: number}> = ({pts, material, r = 0.0045}) => {
  const g = useMemo(
    () => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map((q) => new THREE.Vector3(...q))), 24, r, 5),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(pts), r],
  );
  return <mesh geometry={g} material={material} />;
};

/**
 * The styled coupe's fittings on the cut car (No. 007 realism pass, `coupeStyle`). Only what stands on the
 * kept part of the body (z ≤ the front piece's section `zFront`, ≤ the rear piece's `zRear`):
 *  - both: the far door mirror, panel seams on the hood and the deck, a dark diffuser with fins under the rear;
 *  - 'muscle': the power bulge over the V8 (sectioned with the bay front), round headlamps and a mesh grille
 *    on the nose, a gloss-black tail panel with two round lamps a side, twin chrome exhaust tips a side
 *    (the near pair with its pipes, under the open rear bay), a high brake lamp on the ducktail;
 *  - 'electric': a full-width light bar across the nose (lamp white) and the tail (lit with the tail
 *    lamps), slim corner lamps, gloss-black pillars round frameless glass.
 * Lamps use the car's tail / brake materials, so `tail` and `brake` light them (flat, never bloomed).
 */
const CoupeExtras: React.FC<{
  style: CoupeStyle;
  mats: ExtraMats;
  zFront: number;
  zRear: number;
  brakeLamp: boolean;
  inkT: number;
}> = ({style, mats, zFront, zRear, brakeLamp, inkT}) => {
  const muscle = style === 'muscle';
  const geo = useMemo(() => {
    const rearPts = coupeRear(style);
    const nosePts = coupeFront(style);
    const rx = (y: number) => xAtY(rearPts, y, 'rear');
    const fx = (y: number) => xAtY(nosePts, y, 'front');
    const hood = (x: number) => topAtX(nosePts, x);
    const deck = (x: number) => topAtX(rearPts, x);
    // the power bulge: a low swell along the hood's middle, its foot sunk into the skin
    let bulge: THREE.ExtrudeGeometry | null = null;
    let bulgeInk: V3[] | null = null;
    if (muscle) {
      const x0 = 1.5;
      const x1 = 2.12;
      const n = 16;
      const top: P2[] = [...Array(n + 1).keys()].map((i) => {
        const x = x1 - ((x1 - x0) * i) / n;
        const t = (x1 - x) / (x1 - x0);
        // rises fast at the front, holds, rounds off into the cowl
        const k = Math.min(1, t / 0.22) * Math.min(1, (1 - t) / 0.12) ** 0.6;
        return [x, hood(x) + 0.05 * k];
      });
      const outline: P2[] = [[x1, hood(x1) - 0.03], ...top, [x0, hood(x0) - 0.03]];
      const z1 = Math.min(0.34, zFront);
      bulge = extrude(shapeOf(outline), -0.34, z1);
      bulgeInk = z1 < 0.34 ? top.map(([x, y]) => [x, y, z1 + 0.003] as V3) : null;
    }
    return {rx, fx, hood, deck, bulge, bulgeInk};
  }, [style, muscle, zFront]);
  const {rx, fx, hood, deck} = geo;
  const zR = zRear - 0.012;
  const zF = Math.min(zFront, 0.86) - 0.012;
  const nearRear = zRear > 0.75;
  // tail-panel and lamp heights
  const lampY = 0.885;
  const zs = (zf: number[]) => zf.filter((z) => z < zR - 0.06);
  // the frameless glass's black surround (electric): the daylight opening, the windows cut out of it
  const dlo = useMemo(() => {
    if (muscle) return null;
    const outer: P2[] = [
      [aPillarX(1.1) + 0.045, 1.1],
      [aPillarX(1.553) + 0.045, 1.553],
      [-0.5, 1.553],
      [-0.78, 1.508],
      [-1.3, 1.354],
      [-1.85, 1.174],
      [-1.93, 1.1],
    ];
    return new THREE.ShapeGeometry(shapeOf(outer, coupeWindows(style)));
  }, [muscle, style]);
  return (
    <group>
      {/* the far door mirror on its stalk, its glass facing back */}
      <group position={[1.12, 1.1, -0.95]}>
        <mesh geometry={roundedBox(0.08, 0.04, 0.07, 0.015, 2)} material={mats.trim} position={[0, -0.02, -0.03]} />
        <mesh
          geometry={roundedBox(0.15, 0.1, 0.2, 0.04, 4)}
          material={mats.paint}
          position={[-0.01, 0.03, -0.15]}
          castShadow
        />
        <mesh
          geometry={roundedBox(0.01, 0.075, 0.16, 0.025, 3)}
          material={mats.mirror}
          position={[-0.088, 0.03, -0.15]}
        />
      </group>
      {dlo ? (
        // gloss-black pillars round the frameless glass, on both faces of the far side
        <>
          <mesh geometry={dlo} material={mats.gloss2} position={[0, 0, -0.8685]} />
          <mesh
            geometry={dlo}
            material={mats.gloss2}
            position={[0, 0, -0.9515]}
            rotation={[0, Math.PI, 0]}
            scale={[-1, 1, 1]}
          />
        </>
      ) : null}
      {/* panel seams: the hood's edges and the deck lid's */}
      <Seam
        pts={[...Array(9).keys()].map((i) => {
          const x = 1.46 + (i / 8) * (2.26 - 1.46);
          return [x, hood(x) + 0.002, -0.64] as V3;
        })}
        material={mats.trim}
      />
      {(() => {
        const [x0, x1] = muscle ? [-1.74, -2.28] : [-1.9, -2.27];
        const pts: V3[] = [...Array(7).keys()].map((i) => {
          const x = x0 + (i / 6) * (x1 - x0);
          return [x, deck(x) + 0.002, -0.64];
        });
        return (
          <>
            <Seam pts={pts} material={mats.trim} />
            <Seam
              pts={[
                [x0, deck(x0) + 0.002, -0.64],
                [x0 - 0.01, deck(x0 - 0.01) + 0.002, Math.min(0.64, zR)],
              ]}
              material={mats.trim}
            />
          </>
        );
      })()}
      {/* the diffuser: a dark valance under the rear with vertical fins */}
      <mesh position={[rx(0.31) + 0.03, 0.31, (-0.86 + zR) / 2]} material={mats.grille} castShadow>
        <boxGeometry args={[0.1, 0.12, zR + 0.86]} />
      </mesh>
      {[-0.6, -0.3, 0, 0.3, 0.6]
        .filter((z) => z < zR - 0.02)
        .map((z) => (
          <mesh key={z} position={[rx(0.3) - 0.012, 0.3, z]} material={mats.grille}>
            <boxGeometry args={[0.04, 0.07, 0.012]} />
          </mesh>
        ))}
      {muscle ? (
        <>
          {/* the power bulge over the V8, sectioned with the bay front */}
          {geo.bulge ? <mesh geometry={geo.bulge} material={[mats.cut, mats.paint]} castShadow receiveShadow /> : null}
          {geo.bulgeInk ? <InkLine points={geo.bulgeInk} closed={false} thickness={inkT} /> : null}
          {/* round headlamps (an outer and an inner a side) with chrome bezels, the mesh grille between */}
          {zs([-0.72, -0.52, 0.52, 0.72])
            .filter((z) => z < zF - 0.06)
            .map((z) => (
              <group key={z}>
                <AlongX p={[fx(0.69) - 0.006, 0.69, z]} r={0.068} len={0.03} material={mats.light} />
                <mesh position={[fx(0.69) + 0.008, 0.69, z]} rotation={[0, Math.PI / 2, 0]} material={mats.chrome}>
                  <torusGeometry args={[0.072, 0.008, 8, 28]} />
                </mesh>
              </group>
            ))}
          {zF > -0.42 ? (
            <group>
              <mesh position={[fx(0.6) - 0.02, 0.6, (-0.42 + zF) / 2]} material={mats.grille}>
                <boxGeometry args={[0.05, 0.26, zF + 0.42]} />
              </mesh>
              {[0.5, 0.55, 0.6, 0.65, 0.7].map((y) => (
                <mesh key={y} position={[fx(y) + 0.006, y, (-0.42 + zF) / 2]} material={mats.trim}>
                  <boxGeometry args={[0.012, 0.008, zF + 0.42]} />
                </mesh>
              ))}
              {[...Array(Math.max(0, Math.floor((zF + 0.42) / 0.05))).keys()].map((i) => (
                <mesh key={i} position={[fx(0.6) + 0.006, 0.6, -0.42 + 0.025 + i * 0.05]} material={mats.trim}>
                  <boxGeometry args={[0.012, 0.25, 0.008]} />
                </mesh>
              ))}
            </group>
          ) : null}
          {/* the tail: a gloss-black panel with two round lamps a side, chrome bezels */}
          <mesh position={[rx(lampY) + 0.004, lampY, (-0.86 + zR) / 2]} material={mats.gloss2}>
            <boxGeometry args={[0.02, 0.15, zR + 0.86]} />
          </mesh>
          {zs([-0.72, -0.5, 0.5, 0.72]).map((z) => (
            <group key={z}>
              <AlongX p={[rx(lampY) - 0.01, lampY, z]} r={0.06} len={0.02} material={mats.tail} />
              <mesh position={[rx(lampY) - 0.016, lampY, z]} rotation={[0, Math.PI / 2, 0]} material={mats.chrome}>
                <torusGeometry args={[0.064, 0.007, 8, 28]} />
              </mesh>
            </group>
          ))}
          {brakeLamp ? (
            <mesh
              geometry={roundedBox(0.03, 0.022, 0.34, 0.008, 2)}
              material={mats.tailBright}
              position={[-2.34, 1.095, -0.2]}
            />
          ) : null}
          {/* twin chrome exhaust tips a side, dark inside; the near pair's pipes run forward under the open rear bay */}
          {[-0.64, -0.5, 0.5, 0.64].map((z) => {
            const x = rx(0.27) - 0.03;
            const kept = z < zR - 0.04;
            return (
              <group key={z}>
                <AlongX p={[x, 0.27, z]} r={0.042} len={0.14} material={mats.tip} />
                <AlongX p={[x - 0.071, 0.27, z]} r={0.031} len={0.004} material={mats.grille} seg={20} />
                {kept ? null : <AlongX p={[x + 0.3, 0.27, z]} r={0.03} len={0.48} material={mats.trim} seg={14} />}
              </group>
            );
          })}
          {nearRear ? null : (
            // the near muffler under the open rear bay (the pipes run into it)
            <mesh
              geometry={roundedBox(0.42, 0.11, 0.28, 0.04, 3)}
              material={mats.trim}
              position={[-1.92, 0.27, 0.57]}
              castShadow
            />
          )}
        </>
      ) : (
        <>
          {/* the closed nose's full-width light bar and slim corner lamps */}
          <mesh position={[fx(0.71) - 0.004, 0.71, (-0.88 + zF) / 2]} material={mats.gloss2}>
            <boxGeometry args={[0.02, 0.045, zF + 0.88]} />
          </mesh>
          <mesh position={[fx(0.71) + 0.004, 0.71, (-0.88 + zF) / 2]} material={mats.light}>
            <boxGeometry args={[0.012, 0.016, zF + 0.88]} />
          </mesh>
          {/* the tail's full-width light bar (lit with the tail and brake lamps) in a gloss-black strip, corner lamps */}
          <mesh position={[rx(0.95) + 0.004, 0.95, (-0.9 + zR) / 2]} material={mats.gloss2}>
            <boxGeometry args={[0.02, 0.05, zR + 0.9]} />
          </mesh>
          <mesh position={[rx(0.95) - 0.004, 0.95, (-0.9 + zR) / 2]} material={mats.tailBright}>
            <boxGeometry args={[0.012, 0.02, zR + 0.9]} />
          </mesh>
          {[-1, ...(nearRear ? [1] : [])].map((s) => (
            <mesh
              key={s}
              geometry={roundedBox(0.02, 0.07, 0.26, 0.008, 2)}
              material={mats.tail}
              position={[rx(0.9) - 0.004, 0.9, s * 0.75]}
            />
          ))}
        </>
      )}
    </group>
  );
};

/**
 * A sport bucket seat (the styled coupe): a low cushion and a tall back with raised side bolsters, the
 * headrest moulded into the back. `at` is the figure's origin; `drop` as on `Seat`.
 */
const SportSeat: React.FC<{
  at: V3;
  mats: {seat: THREE.Material; trim: THREE.Material; bolster: THREE.Material};
  drop?: number;
}> = ({at, mats, drop = 0}) => {
  const ped = 0.44 - drop;
  return (
    <group position={at}>
      <mesh
        geometry={roundedBox(0.5, 0.1, 0.42, 0.04, 4)}
        material={mats.seat}
        position={[-0.06, 0.5, 0]}
        castShadow
        receiveShadow
      />
      {[-1, 1].map((s) => (
        <mesh
          key={s}
          geometry={roundedBox(0.46, 0.1, 0.08, 0.035, 4)}
          material={mats.bolster}
          position={[-0.07, 0.565, s * 0.245]}
          castShadow
        />
      ))}
      {ped > 0.02 ? (
        <mesh position={[-0.05, drop + ped / 2, 0]} material={mats.trim}>
          <boxGeometry args={[0.36, ped, 0.3]} />
        </mesh>
      ) : null}
      <group position={[-0.33, 0.93, 0]} rotation={[0, 0, 0.21]}>
        <mesh geometry={roundedBox(0.11, 0.68, 0.42, 0.04, 4)} material={mats.seat} castShadow receiveShadow />
        {[-1, 1].map((s) => (
          <mesh
            key={s}
            geometry={roundedBox(0.15, 0.52, 0.08, 0.035, 4)}
            material={mats.bolster}
            position={[0.03, -0.06, s * 0.245]}
            castShadow
          />
        ))}
        <mesh geometry={roundedBox(0.11, 0.26, 0.3, 0.06, 4)} material={mats.seat} position={[0, 0.44, 0]} castShadow />
        <mesh geometry={roundedBox(0.12, 0.05, 0.1, 0.02, 2)} material={mats.bolster} position={[0.005, 0.28, 0]} />
      </group>
    </group>
  );
};

/**
 * No. 010: the near rear quarter drawn whole (`RealCar` `port`): the rear body's outline behind the rear arch
 * extruded from the cut out to the outer skin (`QUARTER_Z`), its step face at `QUARTER_X` hatched and inked
 * (it is a cut), the near tail lamp carried round onto it, and the charging port: a recessed socket with its
 * pins, a flap hinged at its front edge and swung open, and a ring light (flat `signalGreen` while `light`,
 * else `ledOff`; never bloomed). Car frame (x forward).
 */
const ChargeQuarter: React.FC<{
  outline: P2[];
  port: V3;
  light: number;
  lampX: number;
  lampY: number;
  mood: Mood;
  mats: {paint: THREE.Material; cut: THREE.Material; tail: THREE.Material; trim: THREE.Material};
  inkT: number;
}> = ({outline, port, light, lampX, lampY, mood, mats, inkT}) => {
  const m = MOODS[mood];
  const geo = useMemo(() => {
    const q = clipBehind(outline, QUARTER_X);
    const ys = q.filter(([x]) => Math.abs(x - QUARTER_X) < 1e-6).map(([, y]) => y);
    return {
      body: (() => {
        // the skin's outer edges rounded (a pressed panel, not a slab)
        const b = 0.022;
        const g = new THREE.ExtrudeGeometry(shapeOf(offsetIn(q, b)), {
          depth: QUARTER_Z - CAR_LAYOUT.cutZ - b,
          bevelEnabled: true,
          bevelThickness: b,
          bevelSize: b,
          bevelSegments: 3,
          curveSegments: 12,
        });
        g.translate(0, 0, CAR_LAYOUT.cutZ - 0.0005);
        return g;
      })(),
      step: ys.length >= 2 ? ([Math.min(...ys), Math.max(...ys)] as P2) : null,
      flap: roundedBox(0.14, 0.13, 0.008, 0.02, 3),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(outline)]);
  const pm = useMemo(
    () => ({
      socket: new THREE.MeshStandardMaterial({color: raw(REAL.labDark), roughness: 0.6}),
      face: new THREE.MeshStandardMaterial({color: raw(REAL.dash), roughness: 0.45}),
      pin: new THREE.MeshStandardMaterial({color: raw('#0b0c0e'), roughness: 0.9}),
      ring: new THREE.MeshStandardMaterial({color: raw(section.ledOff), roughness: 0.35}),
    }),
    [],
  );
  const k = Math.max(0, Math.min(1, light));
  pm.ring.color.copy(raw(section.ledOff)).lerp(raw(section.signalGreen), k);
  pm.ring.emissive.copy(raw(section.signalGreen));
  pm.ring.emissiveIntensity = (1.1 * k) / m.exposure;
  const [px, py, pz] = port;
  const zMid = (CAR_LAYOUT.cutZ + QUARTER_Z) / 2;
  return (
    <group>
      <mesh geometry={geo.body} material={[mats.paint, mats.paint]} castShadow receiveShadow />
      {geo.step ? (
        <>
          <mesh
            position={[QUARTER_X + 0.0015, (geo.step[0] + geo.step[1]) / 2, zMid]}
            rotation={[0, Math.PI / 2, 0]}
            material={mats.cut}
          >
            <planeGeometry args={[QUARTER_Z - CAR_LAYOUT.cutZ, geo.step[1] - geo.step[0]]} />
          </mesh>
          <CutOutline
            rects={[
              [
                [QUARTER_X + 0.002, geo.step[0], CAR_LAYOUT.cutZ],
                [QUARTER_X + 0.002, geo.step[1], QUARTER_Z],
              ],
            ]}
            thickness={inkT}
          />
        </>
      ) : null}
      {/* the near tail lamp, carried round the whole corner */}
      <mesh position={[lampX, lampY, zMid]} material={mats.tail}>
        <boxGeometry args={[0.04, 0.17, QUARTER_Z - CAR_LAYOUT.cutZ]} />
      </mesh>
      {/* the port: the recess, the socket's face with its pins, the ring light, the open flap */}
      <mesh position={[px, py, pz + 0.001]} rotation={[Math.PI / 2, 0, 0]} material={pm.socket}>
        <cylinderGeometry args={[0.066, 0.066, 0.004, 40]} />
      </mesh>
      <mesh position={[px, py, pz + 0.004]} rotation={[Math.PI / 2, 0, 0]} material={pm.face}>
        <cylinderGeometry args={[0.048, 0.05, 0.006, 40]} />
      </mesh>
      {[
        [-0.02, 0.012],
        [0.02, 0.012],
        [0, -0.022],
        [-0.024, -0.012],
        [0.024, -0.012],
      ].map(([dx, dy], i) => (
        <mesh key={i} position={[px + dx, py + dy, pz + 0.0075]} rotation={[Math.PI / 2, 0, 0]} material={pm.pin}>
          <cylinderGeometry args={[i < 2 ? 0.011 : 0.006, i < 2 ? 0.011 : 0.006, 0.002, 20]} />
        </mesh>
      ))}
      <mesh position={[px, py, pz + 0.004]} material={pm.ring}>
        <torusGeometry args={[0.058, 0.0055, 10, 40]} />
      </mesh>
      <group position={[px + 0.075, py, pz + 0.002]} rotation={[0, (100 * Math.PI) / 180, 0]}>
        <mesh geometry={geo.flap} material={mats.paint} position={[-0.072, 0, 0.004]} castShadow />
      </group>
    </group>
  );
};
