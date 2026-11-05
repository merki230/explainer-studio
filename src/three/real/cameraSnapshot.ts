import * as THREE from 'three';
import {CAR, CHARGE, CITY} from '../../theme';
import type {ShellProfile} from './CarShell';
import {rackBounds} from './RoofRack';

type V3 = [number, number, number];

/*
 * No. 015 (owner, 2026-11-03: "the car photo need to be improve"): the plate camera's stills as real renders of the 3D
 * car, not a 2D sketch. One helper composition (`zz-camera-snapshot`, `src/scenes/CameraSnapshotStill.tsx`) renders
 * each variant below as one frame on the city slice; `yarn remotion render zz-camera-snapshot <dir> --sequence
 * --image-format=png` writes them, and they are kept as `src/videos/<slug>/snapshots/<name>.png`. The camera-view box
 * (`plateCameraKit.ts`) draws those PNGs and places its orange marks by projecting the car's parts with the same views
 * (`projectSnap`), so a re-render keeps the marks on their parts. Pure: safe to import anywhere.
 *
 * Everything is car-local (metres: x forward, y up, z right; the car's middle on the road), as `RealCar`.
 */

/** Every snapshot's size (px); the box's photo keeps this aspect (0.64). */
export const SNAP_SIZE = {width: 1000, height: 640};

/** A snapshot camera, car-local: where it stands, what it looks at, its vertical fov (deg). */
export type SnapView = {position: V3; look: V3; fov: number};

/**
 * The pole camera, car-local: 8.6 m behind the car's middle (≈ 6.2 m behind its bumper), 2.4 m to its right and 3.0 m
 * up, aimed just above the plate: the car's rear three-quarter from pole height, a little to the side.
 */
const POLE_EYE: V3 = [-8.6, 3.0, 2.4];

export const SNAP_VIEWS = {
  /** The colour still: the whole car, its roof rack and the lane around it. */
  main: {position: POLE_EYE, look: [-0.75, 0.82, 0.12], fov: 23} as SnapView,
  /** The IR still: the same eye, zoomed ≈ 8 × on the plate (it fills ≈ 55% of the width, its letters read). */
  ir: {position: POLE_EYE, look: [-2.405, 0.75, 0], fov: 2.9} as SnapView,
  /** A training photo: another car's rear three-quarter from its right, framed tight (the tile is small). */
  tile: {position: [-7.8, 2.7, 2.3], look: [-0.45, 0.72, 0.05], fov: 19} as SnapView,
  /** The same from its left (the grid mixes both). */
  tileL: {position: [-7.8, 2.7, -2.3], look: [-0.45, 0.72, -0.05], fov: 19} as SnapView,
};

/** The car's plate (`CitySliceScene` `PLATE_LOCAL`): its face's centre and half-size (the 256 × 128 texture's 2 : 1). */
export const SNAP_PLATE = {x: -2.405, y: 0.735, halfW: 0.152, halfH: 0.076};

/** The blank make badge (F2: an oval, no mark) on the tailgate, above the plate: centre and half-size (y, z). */
export const SNAP_BADGE = {x: -2.4, y: 0.915, halfH: 0.032, halfW: 0.058};

/** One snapshot: its file name, the view, and the car in it. */
export type SnapVariant = {
  name: string;
  view: keyof typeof SNAP_VIEWS;
  paint: string;
  shape: ShellProfile;
  rack: boolean;
  plate: string;
  /** Brake lamps lit (stopped at the red). */
  brake: boolean;
  /** The plate lit by the IR flash (`RealCar` `plateBright`). */
  ir: boolean;
  badge: boolean;
  driver: 'you' | 'extra';
  /** The training label (an invented one-word tag, ink under the tile). */
  label?: string;
};

const YOU = {paint: CAR.day.bodies.you, shape: 'crossover' as ShellProfile, rack: true, plate: '8KTR 214', badge: true, driver: 'you' as const};
const tile = (paint: string, shape: ShellProfile, label: string, plate: string, left: boolean, rack = false): Omit<SnapVariant, 'name'> => ({
  view: left ? 'tileL' : 'tile',
  paint,
  shape,
  rack,
  plate,
  brake: false,
  ir: false,
  badge: false,
  driver: 'extra',
  label,
});

/** The snapshots, in frame order (frame n of `zz-camera-snapshot` renders variant n). */
export const SNAP_VARIANTS: SnapVariant[] = [
  {name: 'main', view: 'main', ...YOU, brake: true, ir: false},
  {name: 'ir', view: 'ir', ...YOU, brake: true, ir: true},
  // training photos: our existing whole-car shapes in theme paints, each with the one label that fits it (all invented)
  {name: 'tile-0', ...tile(CITY.carBodies[1], 'crossover', 'SILVER', '6PLM 402', false)},
  {name: 'tile-1', ...tile(CITY.carBodies[0], 'sedan', 'SEDAN', '7DRX 118', true)},
  {name: 'tile-2', ...tile(CHARGE.teslaPaint, 'hatch', 'WHITE', '5WEN 337', false)},
  {name: 'tile-3', ...tile(CITY.carBodies[2], 'sedan', 'BLUE', '9HBA 260', true)},
  {name: 'tile-4', ...tile(CAR.day.bodies.mom, 'crossover', 'SUV', '4KQS 581', true)},
  {name: 'tile-5', ...tile(CITY.carBodies[3], 'coupe', 'COUPE', '3TVG 749', false)},
  {name: 'tile-6', ...tile(CAR.day.bodies.extra, 'crossover', 'ROOF RACK', '8NFD 025', false, true)},
  {name: 'tile-7', ...tile(CAR.day.bodies.friend, 'hatch', 'GREY', '2MUC 964', true)},
];

/** The camera for a view (aspect `SNAP_SIZE`), car-local. */
export const snapCamera = (v: SnapView) => {
  const cam = new THREE.PerspectiveCamera(v.fov, SNAP_SIZE.width / SNAP_SIZE.height, 0.1, 500);
  cam.position.set(...v.position);
  cam.lookAt(new THREE.Vector3(...v.look));
  cam.updateMatrixWorld(true);
  cam.updateProjectionMatrix();
  return cam;
};

/** A car-local point in a view's snapshot, as fractions of the picture (0, 0 top-left). */
export const projectSnap = (v: SnapView, p: V3): [number, number] => {
  const q = new THREE.Vector3(...p).project(snapCamera(v));
  return [(q.x + 1) / 2, (1 - q.y) / 2];
};

/** The picture-space box (x, y, w, h fractions) round a set of car-local points, grown by `pad` (fraction of width). */
export const snapBox = (v: SnapView, pts: V3[], pad = 0): [number, number, number, number] => {
  const q = pts.map((p) => projectSnap(v, p));
  const xs = q.map((a) => a[0]);
  const ys = q.map((a) => a[1]);
  const padY = (pad * SNAP_SIZE.width) / SNAP_SIZE.height;
  const x0 = Math.max(0.004, Math.min(...xs) - pad);
  const y0 = Math.max(0.004, Math.min(...ys) - padY);
  const x1 = Math.min(0.996, Math.max(...xs) + pad);
  const y1 = Math.min(0.996, Math.max(...ys) + padY);
  return [x0, y0, x1 - x0, y1 - y0];
};

const corners = (a: V3, b: V3): V3[] => {
  const out: V3[] = [];
  for (const x of [a[0], b[0]]) for (const y of [a[1], b[1]]) for (const z of [a[2], b[2]]) out.push([x, y, z]);
  return out;
};

/** The parts the software marks, as car-local point sets (YOU's crossover). */
export const SNAP_PARTS = {
  plate: corners(
    [SNAP_PLATE.x, SNAP_PLATE.y - SNAP_PLATE.halfH, -SNAP_PLATE.halfW],
    [SNAP_PLATE.x, SNAP_PLATE.y + SNAP_PLATE.halfH, SNAP_PLATE.halfW],
  ),
  badge: corners(
    [SNAP_BADGE.x, SNAP_BADGE.y - SNAP_BADGE.halfH, -SNAP_BADGE.halfW],
    [SNAP_BADGE.x, SNAP_BADGE.y + SNAP_BADGE.halfH, SNAP_BADGE.halfW],
  ),
  /** A paint sample on the tailgate, right of the plate, between the light bar and the crease (flat paint). */
  color: corners([-2.43, 0.68, 0.36], [-2.43, 0.88, 0.62]),
  /**
   * The whole car: points on its real outline (the rounded rear corners, the roof and rack, the near wheels' contact
   * patches, the front corners), not its bounding box, whose corners stand out in the road.
   */
  body: [
    [-2.45, 0.25, -0.92],
    [-2.45, 0.25, 0.92],
    [-2.4, 1.05, -0.95],
    [-2.4, 1.05, 0.95],
    [-2.1, 1.8, -0.75],
    [-2.1, 1.8, 0.75],
    [1.2, 1.8, 0.75],
    [-1.5, 0.0, 0.9],
    [1.5, 0.0, 0.9],
    [-1.5, 0.0, -0.9],
    [2.4, 0.6, 0.92],
    [2.4, 0.6, -0.92],
    ...corners(...rackBounds('crossover')),
  ] as V3[],
  rack: corners(...rackBounds('crossover')),
};

/**
 * The plate's characters in a view: one picture-space box (x, y, w, h fractions) per non-space character, read off the
 * plate texture's layout (`RealCar`: 256 × 128, mono 700 46 px centred at (128, 68); a mono advance of 0.6 em).
 */
export const snapPlateChars = (v: SnapView, text: string): [number, number, number, number][] => {
  const adv = 0.6 * 46;
  const left = 128 - (adv * text.length) / 2;
  const top = 68 - 20;
  const bottom = 68 + 20;
  const at = (u: number, w: number): V3 => [
    SNAP_PLATE.x,
    SNAP_PLATE.y + (0.5 - w / 128) * 2 * SNAP_PLATE.halfH,
    (u / 256 - 0.5) * 2 * SNAP_PLATE.halfW,
  ];
  const out: [number, number, number, number][] = [];
  for (let i = 0; i < text.length; i++) {
    if (text[i] === ' ') continue;
    const u0 = left + adv * i + 1;
    const u1 = left + adv * (i + 1) - 1;
    out.push(snapBox(v, [at(u0, top), at(u1, top), at(u0, bottom), at(u1, bottom)]));
  }
  return out;
};
