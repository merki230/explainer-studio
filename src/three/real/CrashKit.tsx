import React, {useEffect, useMemo} from 'react';
import * as THREE from 'three';
import {CAST_NEUTRAL, CHARGE, CITY, EXTRA_B, type CastLook, type Mood} from '../../theme';
import {raw} from '../plaster';
import {ease, type Keyed} from '../../scenes/keyframes';
import {Figure} from '../section/Figure';
import {DrivingCar} from './DrivingCar';
import type {ShellProfile} from './CarShell';

type V3 = [number, number, number];
type P2 = [number, number];

/*
 * No. 020 (`crash-detect`): the parts of a calm crash and of the phone that senses it, mounted by `SlicedCar` and the
 * Lab (style guide v0.18.17).
 *  - Strokes (`inkStrokes.tsx`) and the sensor lanes on the phone's board (`SensorLanes.tsx`, N3) live in their own files.
 *  - `Airbag`: the driver's front bag from the wheel hub, matte `CHARGE.canopy`, blooming and sagging (N2).
 *  - `LeadCar`: the stopped whole car ahead (N1), its brake lamps, hazards, rock at contact, its driver stepping out.
 *  - Ink-wave geometry (N5): pressure rings clipped to the cabin's outline, sound arcs, alarm and siren arcs, a figure mask.
 * Nothing here is readable; colours from the theme only.
 */

// ---------------------------------------------------------------------------------------------------------------
// N2: the airbag

/** The airbag's keys (seconds into the scene, its own clock: it ignores `timeScale` and the held instant). */
export type AirbagKeys = {
  /** It blooms from the wheel hub. */
  at: number;
  /** How long the bloom takes (default 0.08 s, real time; ≤ 0.5 s inside a held instant). */
  bloomFor?: number;
  /** It deflates to hanging fabric from here (null: stays full; default null). */
  sagAt?: number | null;
  /** How long the sag takes (default 1.5 s). */
  sagFor?: number;
};

/** The bag's bloom (0 → 1) and sag (0 → 1) at t. */
export const airbagState = (k: AirbagKeys | null | undefined, t: number) => {
  if (!k) return {bloom: 0, sag: 0};
  const bf = Math.max(0.02, k.bloomFor ?? 0.08);
  const u = Math.max(0, Math.min(1, (t - k.at) / bf));
  const bloom = 1 - (1 - u) ** 3;
  const sag = k.sagAt == null ? 0 : ease(t, k.sagAt, k.sagAt + (k.sagFor ?? 1.5));
  return {bloom, sag};
};

/** The driver's push-back from the bag (m, ≤ 0.03), out and back over 0.4 s from the bloom. */
export const airbagPush = (k: AirbagKeys | null | undefined, t: number) => {
  if (!k) return 0;
  const u = (t - k.at) / 0.4;
  return u <= 0 || u >= 1 ? 0 : 0.03 * Math.sin(Math.PI * u);
};

/**
 * The driver's front airbag (car frame, inside the car's group): a smooth rounded cushion from the steering wheel's hub
 * toward the chest, its top under the chin; sagging to fabric hanging from the hub. Matte `CHARGE.canopy`, roughness 0.9,
 * never orange, no powder.
 */
export const Airbag: React.FC<{hub: V3; bloom: number; sag: number}> = ({hub, bloom, sag}) => {
  const base = useMemo(() => new THREE.SphereGeometry(1, 36, 26), []);
  const mat = useMemo(() => new THREE.MeshStandardMaterial({color: raw(CHARGE.canopy), roughness: 0.9, metalness: 0}), []);
  useEffect(() => () => mat.dispose(), [mat]);
  const geo = useMemo(() => base.clone(), [base]);
  useEffect(() => () => geo.dispose(), [geo]);
  const k = Math.max(0, Math.min(1, bloom));
  const s = Math.max(0, Math.min(1, sag));
  const src = base.attributes.position as THREE.BufferAttribute;
  const dst = geo.attributes.position as THREE.BufferAttribute;
  // full: centred 0.16 m behind the hub toward the chest; sagged: a thin sheet hanging below the hub
  const cx = hub[0] - 0.15 * k + 0.1 * s * k;
  const cy = hub[1] - 0.06 * k - 0.13 * s;
  const rx = Math.max(0.006, 0.14 * k * (1 - 0.8 * s));
  const ry = (0.03 + 0.12 * k) * (1 - 0.1 * s);
  const rz = (0.04 + 0.21 * k) * (1 - 0.18 * s);
  for (let i = 0; i < src.count; i++) {
    const x = src.getX(i);
    const y = src.getY(i);
    const z = src.getZ(i);
    // fabric folds once it sags (more toward the hem)
    const hem = Math.max(0, -y);
    const w = s * (0.012 + 0.02 * hem) * Math.sin(17 * z + 6 * y) + s * 0.01 * Math.sin(29 * z - 11 * y);
    // the sag pulls the lower half down and the top in toward the hub
    const droop = s * (y < 0 ? 0.08 * hem : -0.03 * y);
    dst.setXYZ(i, cx + rx * x + w, cy + ry * y - droop, hub[2] + rz * z + 0.4 * w);
  }
  dst.needsUpdate = true;
  geo.computeVertexNormals();
  if (k <= 0.001) return null;
  return <mesh geometry={geo} material={mat} castShadow receiveShadow />;
};

// ---------------------------------------------------------------------------------------------------------------
// N1: the lead car

/**
 * The lead car's keys (seconds into the scene): a whole generic car stopped in YOU's lane ahead, in road space (it
 * streams in with the road and stops when YOU stops), its brake lamps lit; contact when YOU's nose reaches its bumper.
 */
export type LeadCarKeys = {
  /** When YOU's nose reaches its rear bumper (the gap closes then, from the speed keys). Null: no contact, see `gap`. */
  contactAt?: number | null;
  /** Without `contactAt`: the gap (m, nose to bumper) at the scene's start; it closes with the road. Default 6. */
  gap?: number;
  /** Its body (a theme token; default `CITY.charcoal`) and shape (default 'sedan'). Plate blank. */
  paint?: string;
  shape?: ShellProfile;
  /** Its driver's colours (default the extras' grey with `EXTRA_B`); `driver: false` leaves it empty. */
  look?: Partial<CastLook>;
  driver?: boolean;
  /** Brake lamps, 0 → 1, a constant or keys (default 1: stopped, foot on the brake). */
  brake?: Keyed;
  /** Hazards from here (s; on the video clock like YOU's, 1.4 Hz). Null: off. */
  hazardAt?: number | null;
  /** The driver glances back (seconds, held `hold`, default 1.0). */
  glances?: {at: number; hold?: number}[];
  /** The driver steps out on the curb side (the far side) and stands by the car's rear quarter (≈ 1.6 s). Null: stays in. */
  stepOutAt?: number | null;
  /** Once standing: glances (the head turns to `target`, world metres, default toward YOU's car). */
  standGlances?: {at: number; hold?: number}[];
};

/** The lead car's rock (rad) at a time after contact: it lurches ≤ 1° and settles in 0.6 s. */
export const contactPitch = (u: number) =>
  u <= 0 || u >= 0.6 ? 0 : (u < 0.08 ? u / 0.08 : Math.exp(-(u - 0.08) / 0.14) * Math.cos((2 * Math.PI * (u - 0.08)) / 0.5)) * (1 - ease(u, 0.4, 0.6));

/** The step-out's progress at t: 'in' (seated), 'out' (standing, walking `walk` 0 → 1 to its spot). */
export const stepOutState = (k: LeadCarKeys, t: number) => {
  const s = k.stepOutAt ?? null;
  if (s === null || t < s + 0.5) return {seated: true, slide: s === null ? 0 : ease(t, s, s + 0.5), rise: 0, walk: 0};
  return {seated: false, slide: 1, rise: ease(t, s + 0.5, s + 1.0), walk: ease(t, s + 0.7, s + 1.7)};
};

/**
 * The lead car (world): a whole `DrivingCar` heading the same way as YOU's car, its origin at `x` (world) on z = 0, rocked
 * by `rock` about its front axle; the extra at the wheel, or (stepped out) standing on the far side by its rear quarter.
 */
export const LeadCar: React.FC<{
  mood: Mood;
  keys: LeadCarKeys;
  x: number;
  dir: 1 | -1;
  rock: number;
  travelled: number;
  brake: number;
  hazard: number;
  t: number;
  clock: number;
  /** Where the driver looks back to (world). */
  lookBack: V3;
}> = ({mood, keys, x, dir, rock, travelled, brake, hazard, t, clock, lookBack}) => {
  const shape = keys.shape ?? 'sedan';
  const st = stepOutState(keys, t);
  const look = keys.look ?? {...CAST_NEUTRAL, ...EXTRA_B};
  const driverOn = keys.driver ?? true;
  // the front axle (world), the rock's pivot: a hit from behind lifts the tail a little, then it settles
  const pivotX = x + dir * 1.35;
  // car-local glance target: back over the shoulder toward YOU (car-local: x forward, z right)
  const back: V3 = [-4, 1.1, 0.6];
  const glances = (keys.glances ?? []).map((g) => ({at: g.at, hold: g.hold ?? 1.0, target: back}));
  // the standing driver: on the far side (−z), by the rear quarter, facing YOU's car
  const standX = x - dir * (1.2 + 0.6 * st.walk);
  const standZ = -1.45;
  return (
    <group>
      <group position={[pivotX, 0.36, 0]} rotation={[0, 0, dir * rock]}>
        <group position={[-pivotX, -0.36, 0]}>
          <DrivingCar
            mood={mood}
            at={{x, z: 0, yaw: dir > 0 ? Math.PI / 2 : -Math.PI / 2}}
            travelled={travelled}
            blur={0}
            body="extra"
            paint={keys.paint ?? CITY.charcoal}
            shape={shape}
            tail={0}
            brake={brake}
            frontLamps={hazard}
            driver={driverOn && st.seated ? 'extra' : false}
            look={look}
            plate=""
            clockOffset={clock - t}
            glances={glances}
          />
        </group>
      </group>
      {driverOn && !st.seated ? (
        <Figure
          who="extra"
          look={look}
          mood={mood}
          // it rises from behind the far door as it steps out (the body hides its legs), then walks back to stand
          position={[standX, -0.45 * (1 - st.rise), standZ]}
          rotationY={dir > 0 ? -Math.PI / 2 + 0.5 : Math.PI / 2 - 0.5}
          stance="stand"
          walk={{phase: st.walk * 1.6, amount: st.walk > 0 && st.walk < 1 ? 0.6 : 0}}
          phone={false}
          hands={[
            [-0.22, 0.86, 0.06],
            [0.22, 0.86, 0.06],
          ]}
          gestures={(keys.standGlances ?? []).map((g) => ({pose: 'turn-to' as const, at: g.at, hold: g.hold ?? 1.0, target: lookBack}))}
          seed="lead-driver"
          clockOffset={clock - t}
        />
      ) : null}
    </group>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// N5: ink-wave geometry

/** The cabin's inner outline (car frame x, y): floor, toe board, windshield, headliner (the roof cut), rear glass, bench back. */
export const cabinOutline = (o: {
  floor: number;
  ws: [P2, P2];
  roofCut: number;
  roofX: P2;
  backlight: [P2, P2];
  benchBackX: number;
}): P2[] => {
  const [wf, wt] = o.ws;
  const [bt, bb] = o.backlight;
  return [
    [o.benchBackX, o.floor],
    [wf[0] - 0.42, o.floor],
    [wf[0] - 0.42, wf[1] - 0.12],
    [wf[0] - 0.02, wf[1] - 0.02],
    [wt[0], o.roofCut - 0.03],
    [o.roofX[0], o.roofCut - 0.03],
    [bt[0] - 0.02, Math.min(o.roofCut - 0.05, bt[1])],
    [(bt[0] + bb[0]) / 2, (bt[1] + bb[1]) / 2 - 0.02],
    [o.benchBackX, (bt[1] + bb[1]) / 2 - 0.22],
  ];
};

/** Is a point inside a closed polygon (ray cast)? */
export const insidePoly = (poly: P2[], x: number, y: number) => {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
};

/** A body capsule for the figure mask (a segment and a radius). */
export type Capsule = {a: V3; b: V3; r: number};

/**
 * The seated driver's silhouette as capsules (car frame), from the figure's origin: head, torso, both arms to the wheel,
 * both thighs and shins (the legs either side of the figure's centre plane), and the seat the figure sits in (cushion,
 * back, headrest), generous so a ring never touches the figure or its seat.
 */
export const seatedCapsules = (origin: V3, seatUp: number): Capsule[] => {
  const [x, y, z] = origin;
  const Y = y + seatUp;
  const caps: Capsule[] = [
    {a: [x - 0.06, Y + 1.24, z], b: [x - 0.02, Y + 1.44, z], r: 0.17},
    {a: [x - 0.12, Y + 0.62, z], b: [x - 0.03, Y + 1.2, z], r: 0.26},
  ];
  for (const s of [-1, 1]) {
    const zz = z + s * 0.12;
    caps.push({a: [x - 0.02, Y + 1.14, z + s * 0.19], b: [x + 0.45, Y + 1.0, zz], r: 0.11});
    caps.push({a: [x, Y + 0.62, zz], b: [x + 0.5, Y + 0.66, zz], r: 0.14});
    caps.push({a: [x + 0.5, Y + 0.64, zz], b: [x + 0.66, Y + 0.08, zz], r: 0.12});
  }
  // the seat: cushion, back, headrest
  caps.push({a: [x - 0.2, Y + 0.45, z], b: [x + 0.25, Y + 0.45, z], r: 0.2});
  caps.push({a: [x - 0.25, Y + 0.55, z], b: [x - 0.33, Y + 1.32, z], r: 0.24});
  caps.push({a: [x - 0.33, Y + 1.38, z], b: [x - 0.34, Y + 1.56, z], r: 0.16});
  return caps;
};

/** Distance from p to segment ab, measured across the view (the view component removed). */
const viewDist = (p: THREE.Vector3, a: THREE.Vector3, b: THREE.Vector3, v: THREE.Vector3) => {
  const flat = (q: THREE.Vector3) => q.clone().sub(v.clone().multiplyScalar(q.dot(v)));
  const P = flat(p);
  const A = flat(a);
  const B = flat(b);
  const ab = B.clone().sub(A);
  const u = Math.max(0, Math.min(1, P.clone().sub(A).dot(ab) / Math.max(1e-9, ab.lengthSq())));
  return P.distanceTo(A.add(ab.multiplyScalar(u)));
};

/** Split a polyline into the runs whose points pass `keep`. */
export const keepRuns = (pts: V3[], keep: (p: V3) => boolean): V3[][] => {
  const out: V3[][] = [];
  let cur: V3[] = [];
  for (const p of pts) {
    if (keep(p)) cur.push(p);
    else {
      if (cur.length > 1) out.push(cur);
      cur = [];
    }
  }
  if (cur.length > 1) out.push(cur);
  return out;
};

/** A keep-test that drops points within `margin` (m) of any capsule, seen along `view` (car frame). */
export const outsideFigures = (caps: Capsule[], view: V3, margin: number) => {
  const v = new THREE.Vector3(...view).normalize();
  const cs = caps.map((c) => ({a: new THREE.Vector3(...c.a), b: new THREE.Vector3(...c.b), r: c.r}));
  return (p: V3) => {
    const P = new THREE.Vector3(...p);
    return cs.every((c) => viewDist(P, c.a, c.b, v) > c.r + margin);
  };
};

/** § 5 pressure rings: 3 rings 0.25 s apart, radius 0.10 → 2.2 m over 0.6 s each (cubic out), fading over the last 60 %. */
export const pressureRings = (age: number, o: {rings?: number; every?: number; reach?: number; life?: number} = {}) =>
  [...Array(o.rings ?? 3).keys()].flatMap((j) => {
    const life = o.life ?? 0.6;
    const u = (age - j * (o.every ?? 0.25)) / life;
    if (u <= 0 || u >= 1) return [];
    const r = 0.1 + ((o.reach ?? 2.2) - 0.1) * (1 - (1 - u) ** 3);
    const a = u < 0.4 ? 1 : 1 - (u - 0.4) / 0.6;
    return [{r, alpha: a}];
  });

/** § 5 sound arcs: 3 arcs 0.15 s apart, each travelling 0.5 s and fading over its last 0.15 s; `k` 0 → 1 along the way. */
export const soundArcs = (age: number, o: {arcs?: number; every?: number; travel?: number} = {}) =>
  [...Array(o.arcs ?? 3).keys()].flatMap((j) => {
    const tr = o.travel ?? 0.5;
    const a = age - j * (o.every ?? 0.15);
    if (a <= 0 || a >= tr) return [];
    return [{k: a / tr, alpha: a < tr - 0.15 ? 1 : (tr - a) / 0.15}];
  });

/**
 * § 5 alarm arcs from a device: a pair every 0.6 s while it sounds (`at` → `until`), each growing 0.03 → 0.20 m over 0.6 s
 * (cubic out), fading over the last 50 %; from `whoopAt` (the siren) a pair every 0.5 s, the max alternating 0.20 / 0.12 m.
 * Returns the live pairs' radii outside the device's edge and opacities (≤ 2 per side).
 */
export const alarmArcs = (t: number, o: {at: number; until?: number | null; whoopAt?: number | null}) => {
  const starts: {s: number; max: number}[] = [];
  const end = o.until ?? Infinity;
  const w = o.whoopAt ?? Infinity;
  for (let s = o.at; s <= Math.min(t, end); s += s >= w ? 0.5 : 0.6) {
    if (s >= w) {
      const n = Math.round((s - w) / 0.5);
      starts.push({s, max: n % 2 ? 0.12 : 0.2});
    } else starts.push({s, max: 0.2});
    if (starts.length > 400) break;
    if (s < w && s + 0.6 > w) s = w - 0.6;
  }
  return starts
    .map(({s, max}) => {
      const u = (t - s) / 0.6;
      if (u < 0 || u >= 1) return null;
      return {r: 0.03 + (max - 0.03) * (1 - (1 - u) ** 3), alpha: u < 0.5 ? 1 : 1 - (u - 0.5) / 0.5};
    })
    .filter((x): x is {r: number; alpha: number} => x !== null)
    .slice(-2);
};
