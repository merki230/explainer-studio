import React, {useEffect, useMemo} from 'react';
import * as THREE from 'three';
import {CHARGE, REAL, section, TOWER, type Mood} from '../../theme';
import {CurveArrow} from '../PushArrow';
import {raw, roundedBox} from '../plaster';
import {cutMaterial, INK, InkLine} from '../section/cutLook';
import {SECTION_ANGLE} from '../section/SectionCamera';
import {applyEnv, useEnvStrength, useStudioEnv} from './useStudioEnv';

type V3 = [number, number, number];

/*
 * No. 010 (N3): a DC fast-charging cable, generic (no maker's connector shape, no logo), in the scene's frame.
 *
 *  - The cable: a heavy, liquid-cooled lead (🎭 drawn ≈ 9 cm thick so it reads; real ones are ≈ 3–4 cm) from
 *    the charger's cable exit along `points` to the connector's handle. Black jacket.
 *  - The cut-away run (`cut`, a stretch of the route): the cable cut lengthwise on a plane facing the camera,
 *    showing what a real liquid-cooled cable holds: the jacket (a cut face: hatched, inked edges), two cooling
 *    hoses, each with a copper conductor inside bathed in coolant (DC+ and DC−), and a filler with the signal
 *    wires in the middle. Its two ends are the jacket's cross-section (hatched half discs).
 *  - The current (the system, orange): `arrows` arrows (continuous: the scene's amps ÷ 250, 🎭) riding the
 *    cable's core toward the car, spaced evenly, sliding along with `flow` (metres). They run inside the
 *    cable and show where it is cut open (the jacket hides them elsewhere). Adding one closes the spacing up.
 *  - The heat (the system): the copper glows orange, `heat` 0 → 1 (the scene drives it ∝ amps²); `spread`
 *    0 → 1 lets a soft glow run out along the whole cable from the cut-away. Illustrative, not a temperature.
 *  - The coolant: neutral streaks (`CHARGE.coolantFlow` on `CHARGE.coolant`, never orange) moving in the
 *    hoses, `coolant` metres of travel (out to the plug in one hose, back in the other).
 *  - The connector (`plug`): 'gbt' (a chunky DC handle, China) or 'nacs' (a slim handle, US), its nose in the
 *    port (or a charger's holster), a grip below with the cable leaving its foot (`plugTail`).
 *
 * `HvRun` is the car's own high-voltage lead from the port to the pack, carrying the same arrows.
 */

/** The connector: where its nose sits (the port's face), which way it goes in, and its kind. */
export type PlugPose = {at: V3; dir: V3; kind: 'gbt' | 'nacs'};

/** The connector's frame: the insertion axis `a`, up (world y made orthogonal), and the side. */
const plugFrame = (p: PlugPose) => {
  const a = new THREE.Vector3(...p.dir).normalize();
  const up = new THREE.Vector3(0, 1, 0).sub(a.clone().multiplyScalar(a.y)).normalize();
  const side = new THREE.Vector3().crossVectors(up, a).normalize();
  return {a, up, side};
};

/** Where the cable leaves the connector's grip (the route's last point), and the cable's way out of it. */
export const plugTail = (p: PlugPose): {at: V3; out: V3} => {
  const {a, up} = plugFrame(p);
  const o = new THREE.Vector3(...p.at);
  const back = p.kind === 'gbt' ? 0.2 : 0.25;
  const down = p.kind === 'gbt' ? 0.2 : 0.075;
  const at = o.clone().addScaledVector(a, -back).addScaledVector(up, -down);
  const out = a.clone().multiplyScalar(-0.35).addScaledVector(up, -1).normalize();
  return {at: at.toArray() as V3, out: out.toArray() as V3};
};

/** Evenly spaced arrows on a conveyor: their [tail, head] along a run of `len` metres (may run past its ends). */
export const conveyorArrows = (n: number, flow: number, len: number, maxLen = 0.26): [number, number][] => {
  if (n <= 0.02 || len <= 0) return [];
  const s = len / n;
  const a = Math.min(0.6 * s, maxLen);
  const p = ((flow % s) + s) % s;
  const out: [number, number][] = [];
  for (let h = p - s; h < len + a + s; h += s) if (h > 0 && h - a < len) out.push([h - a, h]);
  return out;
};

/**
 * No. 010 draft 2, the bold pulses: thick racing slugs of current. `count` (amps ÷ 250, continuous), `flow`
 * metres slid (the scene integrates a speed that rises with the amps), `radius` (m; the scene keeps it a
 * readable size on screen), `surge` 0 → 1 (a one-off brighten and swell).
 */
export type CableSlugs = {
  count: number;
  flow: number;
  radius: number;
  surge?: number;
  /** How strongly they show over the jacket (the far framings: 1; close in, 0, so they're seen only in the cut-away). Default 1. */
  outer?: number;
};

/** A slug: a tube along `curve` from u0 to u1 whose radius swells to `r` in the middle and rounds off at both ends. */
const slugGeometry = (curve: THREE.Curve<THREE.Vector3>, u0: number, u1: number, r: number, lift: THREE.Vector3 | null, radial = 12) => {
  const n = 14;
  const pos: number[] = [];
  const idx: number[] = [];
  const up = new THREE.Vector3(0, 1, 0);
  for (let i = 0; i <= n; i++) {
    const s = i / n;
    const u = Math.min(1, Math.max(0, u0 + (u1 - u0) * s));
    const p = curve.getPointAt(u);
    if (lift) p.add(lift);
    const t = curve.getTangentAt(u).normalize();
    const a = Math.abs(t.dot(up)) > 0.95 ? new THREE.Vector3(1, 0, 0) : up;
    const nx = new THREE.Vector3().crossVectors(t, a).normalize();
    const ny = new THREE.Vector3().crossVectors(t, nx).normalize();
    const rr = r * Math.sqrt(Math.max(0, Math.sin(Math.PI * s)));
    for (let j = 0; j <= radial; j++) {
      const th = (j / radial) * Math.PI * 2;
      const q = p.clone().addScaledVector(nx, Math.cos(th) * rr).addScaledVector(ny, Math.sin(th) * rr);
      pos.push(q.x, q.y, q.z);
      if (i > 0 && j > 0) {
        const a0 = (i - 1) * (radial + 1) + j - 1;
        const b0 = i * (radial + 1) + j - 1;
        idx.push(a0, a0 + 1, b0, b0, a0 + 1, b0 + 1);
      }
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  return g;
};

/** The slugs' spans along a run of `len` metres: [tail, head] (m), ≈ 2.6 diameters long, evenly spaced. */
const slugSpans = (sl: CableSlugs, len: number) => {
  const r = sl.radius * (1 + 0.45 * Math.max(0, Math.min(1, sl.surge ?? 0)));
  const runs = conveyorArrows(sl.count, sl.flow, len, Math.max(0.08, r * 9));
  return {r, runs};
};

/** Draws slugs on a curve (rebuilt each frame; a dozen small tubes). */
const Slugs: React.FC<{
  curve: THREE.Curve<THREE.Vector3>;
  len: number;
  sl: CableSlugs;
  from?: number;
  to?: number;
  lift?: V3 | null;
  radius?: number;
  opacity?: number;
  mood: Mood;
}> = ({curve, len, sl, from = 0, to = 1, lift = null, radius, opacity = 1, mood}) => {
  const mats = useMemo(
    () => ({
      core: new THREE.MeshBasicMaterial({color: raw(section.orange), transparent: true, depthWrite: false}),
      hot: new THREE.MeshBasicMaterial({color: raw(section.orangeDot), transparent: true, depthWrite: false}),
    }),
    [],
  );
  useEffect(() => () => Object.values(mats).forEach((m) => m.dispose()), [mats]);
  void mood;
  const fade = Math.max(0, Math.min(1, sl.count / 0.6)) * Math.max(0, Math.min(1, opacity));
  const surge = Math.max(0, Math.min(1, sl.surge ?? 0));
  mats.core.opacity = fade;
  mats.hot.opacity = fade * (0.55 + 0.45 * surge);
  const runLen = (to - from) * len;
  const {r, runs} = slugSpans(sl, runLen);
  const rr = radius !== undefined ? radius * (1 + 0.45 * surge) : r;
  const liftV = lift ? new THREE.Vector3(...lift) : null;
  const geos = runs
    .map(([a, b]) => {
      const t0 = Math.max(0, a);
      const t1 = Math.min(runLen, b);
      if (t1 - t0 < rr * 0.8) return null;
      return {
        core: slugGeometry(curve, from + t0 / len, from + t1 / len, rr, liftV),
        hot: slugGeometry(curve, from + (t0 + (t1 - t0) * 0.3) / len, from + (t1 - (t1 - t0) * 0.08) / len, rr * 0.5, liftV, 8),
      };
    })
    .filter((g): g is {core: THREE.BufferGeometry; hot: THREE.BufferGeometry} => !!g);
  useEffect(() => () => geos.forEach((g) => (g.core.dispose(), g.hot.dispose())), [geos]);
  if (fade <= 0.01) return null;
  return (
    <group>
      {geos.map((g, i) => (
        <React.Fragment key={i}>
          <mesh geometry={g.core} material={mats.core} userData={{glow: true}} renderOrder={5} />
          <mesh geometry={g.hot} material={mats.hot} userData={{glow: true}} renderOrder={6} />
        </React.Fragment>
      ))}
    </group>
  );
};

/** A thin streak texture along u (the coolant's flow), one period wide. */
const streakTexture = () => {
  const W = 64;
  const H = 4;
  const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [a, b] = [hex(CHARGE.coolant), hex(CHARGE.coolantFlow)];
  const data = new Uint8Array(W * H * 4);
  for (let j = 0; j < H; j++)
    for (let i = 0; i < W; i++) {
      // a soft streak over a third of the period, a fainter one between
      const u = i / W;
      const k = Math.max(0, 1 - Math.abs(u - 0.25) / 0.14) ** 1.5 + 0.35 * Math.max(0, 1 - Math.abs(u - 0.72) / 0.08);
      const o = (j * W + i) * 4;
      for (let c = 0; c < 3; c++) data[o + c] = Math.round(a[c] + (b[c] - a[c]) * Math.min(1, k));
      data[o + 3] = 255;
    }
  const t = new THREE.DataTexture(data, W, H, THREE.RGBAFormat);
  t.wrapS = THREE.RepeatWrapping;
  t.magFilter = THREE.LinearFilter;
  t.minFilter = THREE.LinearFilter;
  t.needsUpdate = true;
  return t;
};

/** Stranded copper (fine strands laid at a shallow angle), u along, v across. */
let copperTex: THREE.DataTexture | null = null;
const copperTexture = () => {
  if (copperTex) return copperTex;
  const W = 128;
  const H = 32;
  const base = [1, 3, 5].map((i) => parseInt(REAL.copper.slice(i, i + 2), 16));
  const data = new Uint8Array(W * H * 4);
  for (let j = 0; j < H; j++)
    for (let i = 0; i < W; i++) {
      const d = (i + j * 2.2) / 6;
      const f = Math.abs((d % 1) - 0.5) * 2;
      const k = 0.78 + 0.42 * f ** 2;
      const o = (j * W + i) * 4;
      for (let c = 0; c < 3; c++) data[o + c] = Math.max(0, Math.min(255, Math.round(base[c] * k + 18 * f)));
      data[o + 3] = 255;
    }
  copperTex = new THREE.DataTexture(data, W, H, THREE.RGBAFormat);
  copperTex.wrapS = THREE.RepeatWrapping;
  copperTex.magFilter = THREE.LinearFilter;
  copperTex.minFilter = THREE.LinearFilter;
  copperTex.needsUpdate = true;
  return copperTex;
};

/** The cut face's layers across the cable (v, −1 → 1, in radii), from the far edge to the near one. */
type Band = {v: [number, number]; mat: 'jacket' | 'wall' | 'coolA' | 'coolB' | 'copper' | 'filler' | 'wire' | 'wire2'};
const BANDS: Band[] = [
  {v: [-1, -0.88], mat: 'jacket'},
  {v: [-0.88, -0.83], mat: 'wall'},
  {v: [-0.83, -0.68], mat: 'coolA'},
  {v: [-0.68, -0.4], mat: 'copper'},
  {v: [-0.4, -0.27], mat: 'coolA'},
  {v: [-0.27, -0.22], mat: 'wall'},
  {v: [-0.22, 0.22], mat: 'filler'},
  {v: [-0.14, -0.09], mat: 'wire'},
  {v: [0.09, 0.14], mat: 'wire2'},
  {v: [0.22, 0.27], mat: 'wall'},
  {v: [0.27, 0.4], mat: 'coolB'},
  {v: [0.4, 0.68], mat: 'copper'},
  {v: [0.68, 0.83], mat: 'coolB'},
  {v: [0.83, 0.88], mat: 'wall'},
  {v: [0.88, 1], mat: 'jacket'},
];
/** The two conductors' bands (for the heat). */
const COPPER: [number, number][] = [
  [-0.68, -0.4],
  [0.4, 0.68],
];

/** Samples of a route between u0 and u1 (by length): point, tangent, across (⊥ tangent and view), face normal. */
const frames = (curve: THREE.CatmullRomCurve3, u0: number, u1: number, n: number, view: THREE.Vector3) =>
  [...Array(n + 1).keys()].map((i) => {
    const u = u0 + ((u1 - u0) * i) / n;
    const p = curve.getPointAt(u);
    const t = curve.getTangentAt(u).normalize();
    const b = new THREE.Vector3().crossVectors(t, view).normalize();
    const nrm = new THREE.Vector3().crossVectors(b, t).normalize();
    return {u, p, t, b, n: nrm};
  });

/** A ribbon across [v0, v1] (in radii) along the samples, `lift` m toward the camera; uv: u in metres. */
const ribbon = (fr: ReturnType<typeof frames>, r: number, v0: number, v1: number, lift: number, len: number) => {
  const pos: number[] = [];
  const uv: number[] = [];
  const idx: number[] = [];
  fr.forEach((f, i) => {
    for (const [k, v] of [
      [0, v0],
      [1, v1],
    ] as const) {
      const q = f.p.clone().addScaledVector(f.b, v * r).addScaledVector(f.n, lift);
      pos.push(q.x, q.y, q.z);
      uv.push(f.u * len, k);
    }
    if (i > 0) {
      const a = (i - 1) * 2;
      idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  });
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
};

/** The jacket's cross-section at a cut-away's end: the front half disc (toward the camera), ⊥ the tangent. */
const halfDisc = (f: ReturnType<typeof frames>[number], r: number) => {
  const n = 20;
  const pos: number[] = [f.p.x, f.p.y, f.p.z];
  const idx: number[] = [];
  const ring: V3[] = [];
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI;
    const q = f.p.clone().addScaledVector(f.b, Math.cos(a) * r).addScaledVector(f.n, Math.sin(a) * r);
    pos.push(q.x, q.y, q.z);
    ring.push([q.x, q.y, q.z]);
    if (i > 0) idx.push(0, i, i + 1);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return {g, ring};
};

export type ChargeCableProps = {
  /** The route (scene frame): from the charger's cable exit to the connector's grip (`plugTail`). */
  points: V3[];
  /** The cable's radius (m). Default 0.045 (🎭 thicker than real, so it reads). */
  radius?: number;
  /** The cut-away run [u0, u1] (0 → 1 along the route, by length); null: the cable whole. Default [0.3, 0.8]. */
  cut?: [number, number] | null;
  /** How many current arrows (continuous, e.g. amps ÷ 250); 0: none. Default 0. */
  arrows?: number;
  /** Metres the arrows have slid along (a steady clock × speed; continuous across cuts). Default 0. */
  flow?: number;
  /** The arrows' core radius (m). Default 0.022; the scene thins it in close-ups. */
  arrowRadius?: number;
  /** The conductors' glow, 0 → 1 (orange, bloomed). Default 0. */
  heat?: number;
  /** How far the soft heat glow runs out along the cable from the cut-away, 0 → 1. Default 0. */
  spread?: number;
  /** Metres the coolant streaks have moved. Default 0. */
  coolant?: number;
  /** The connector at the route's end. Default none. */
  plug?: PlugPose | null;
  mood?: Mood;
  /** × the ink's thickness (close framings thin it). Default 1. */
  inkScale?: number;
  /** The direction toward the camera (the cut face faces it). Default `SECTION_ANGLE`. */
  view?: V3;
  /**
   * No. 010 draft 2: bold pulses instead of `arrows` (see `CableSlugs`). Wider than the cable they ride over its
   * whole length (the far framings); in the cut-away they race along both copper conductors. Default none.
   */
  slugs?: CableSlugs | null;
};

/** The charging cable (see the file comment). */
export const ChargeCable: React.FC<ChargeCableProps> = ({
  points,
  radius = 0.045,
  cut = [0.3, 0.8],
  arrows = 0,
  flow = 0,
  arrowRadius = 0.022,
  heat = 0,
  spread = 0,
  coolant = 0,
  plug = null,
  mood = 'day',
  inkScale = 1,
  view = SECTION_ANGLE,
  slugs = null,
}) => {
  const env = useStudioEnv();
  const envScale = useEnvStrength();
  const key = JSON.stringify([points, radius, cut, view]);
  const geo = useMemo(() => {
    const [pts, r, c, vw] = JSON.parse(key) as [V3[], number, [number, number] | null, V3];
    const curve = new THREE.CatmullRomCurve3(pts.map((q) => new THREE.Vector3(...q)), false, 'centripetal');
    const len = curve.getLength();
    const viewV = new THREE.Vector3(...vw).normalize();
    const sub = (u0: number, u1: number) => {
      if (u1 - u0 < 1e-4) return null;
      const n = Math.max(4, Math.ceil(((u1 - u0) * len) / 0.03));
      const ps = [...Array(n + 1).keys()].map((i) => curve.getPointAt(u0 + ((u1 - u0) * i) / n));
      return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(ps), n * 2, r, 16, false);
    };
    const tubes = c ? [sub(0, c[0]), sub(c[1], 1)].filter((g): g is THREE.TubeGeometry => !!g) : [sub(0, 1)!];
    if (!c) return {curve, len, tubes, bands: [], heatBands: [], caps: [], edges: [] as V3[][]};
    const fr = frames(curve, c[0], c[1], Math.max(16, Math.ceil(((c[1] - c[0]) * len) / 0.02)), viewV);
    const bands = BANDS.map((b, i) => ({mat: b.mat, g: ribbon(fr, r, b.v[0], b.v[1], 0.0006 * (1 + (b.mat.startsWith('wire') ? 2 : i % 2)), len)}));
    const heatBands = COPPER.flatMap(([a, b]) => [
      ribbon(fr, r, a, b, 0.003, len),
      ribbon(fr, r, a - 0.12, b + 0.12, 0.0035, len),
    ]);
    const caps = [halfDisc(fr[0], r), halfDisc(fr[fr.length - 1], r)];
    const edges = [-1, 1].map((v) => fr.map((f) => f.p.clone().addScaledVector(f.b, v * r).addScaledVector(f.n, 0.001).toArray() as V3));
    return {curve, len, tubes, bands, heatBands, caps, edges};
  }, [key]);
  useEffect(
    () => () => {
      geo.tubes.forEach((g) => g.dispose());
      geo.bands.forEach((b) => b.g.dispose());
      geo.heatBands.forEach((g) => g.dispose());
      geo.caps.forEach((c) => c.g.dispose());
    },
    [geo],
  );
  const mats = useMemo(() => {
    const coolA = streakTexture();
    const coolB = streakTexture();
    return {
      jacketSkin: new THREE.MeshPhysicalMaterial({color: raw(REAL.cable), roughness: 0.55, clearcoat: 0.25, clearcoatRoughness: 0.6}),
      jacket: cutMaterial(),
      wall: new THREE.MeshStandardMaterial({color: raw(REAL.hose), roughness: 0.7}),
      coolA: new THREE.MeshStandardMaterial({color: raw('#ffffff'), roughness: 0.25, map: coolA}),
      coolB: new THREE.MeshStandardMaterial({color: raw('#ffffff'), roughness: 0.25, map: coolB}),
      copper: new THREE.MeshPhysicalMaterial({color: raw('#ffffff'), map: copperTexture(), metalness: 0.55, roughness: 0.4}),
      filler: new THREE.MeshStandardMaterial({color: raw(REAL.labDark), roughness: 0.85}),
      wire: new THREE.MeshStandardMaterial({color: raw(TOWER.wireGrey), roughness: 0.6}),
      wire2: new THREE.MeshStandardMaterial({color: raw(REAL.chrome), roughness: 0.6}),
      heatCore: new THREE.MeshBasicMaterial({color: raw(section.orange), transparent: true, depthWrite: false}),
      heatHalo: new THREE.MeshBasicMaterial({color: raw(section.orange), transparent: true, depthWrite: false}),
      spread: new THREE.MeshBasicMaterial({color: raw(section.orange), transparent: true, depthWrite: false}),
      plugBody: new THREE.MeshPhysicalMaterial({color: raw(CHARGE.cabinetDark), roughness: 0.42, clearcoat: 0.5, clearcoatRoughness: 0.4}),
      plugGrip: new THREE.MeshStandardMaterial({color: raw(REAL.rubber), roughness: 0.8}),
      plugTrim: new THREE.MeshPhysicalMaterial({color: raw(REAL.steel), roughness: 0.35, metalness: 0.7}),
    };
  }, []);
  useEffect(() => () => Object.values(mats).forEach((m) => m.dispose()), [mats]);
  applyEnv(
    env,
    [
      [mats.jacketSkin, 0.5],
      [mats.copper, 1.1],
      [mats.plugBody, 0.6],
      [mats.plugTrim, 1],
    ],
    envScale,
  );
  // the coolant's streaks: one period 0.14 m; out to the plug in one hose, back in the other
  const PERIOD = 0.14;
  mats.coolA.map!.repeat.set(1 / PERIOD, 1);
  mats.coolB.map!.repeat.set(1 / PERIOD, 1);
  mats.coolA.map!.offset.x = -coolant / PERIOD;
  mats.coolB.map!.offset.x = coolant / PERIOD;
  mats.copper.map!.repeat.set(1 / 0.12, 1);
  const h = Math.max(0, Math.min(1, heat));
  mats.heatCore.opacity = 0.72 * h;
  mats.heatHalo.opacity = 0.22 * h;
  const sp = Math.max(0, Math.min(1, spread));
  mats.spread.opacity = 0.2 * h;

  // the soft glow along the cable, growing out of the cut-away to both ends with `spread` (rebuilt in steps)
  const spreadQ = Math.round(sp * 24) / 24;
  const spreadGeo = useMemo(() => {
    if (!cut || spreadQ <= 0.001) return [];
    // out from both ends of the cut-away (never over the cut face itself)
    const spans: [number, number][] = [
      [Math.max(0, cut[0] - spreadQ * cut[0]), cut[0]],
      [cut[1], Math.min(1, cut[1] + spreadQ * (1 - cut[1]))],
    ];
    return spans
      .filter(([a, b]) => b - a > 1e-3)
      .map(([u0, u1]) => {
        const n = Math.max(6, Math.ceil(((u1 - u0) * geo.len) / 0.03));
        const ps = [...Array(n + 1).keys()].map((i) => geo.curve.getPointAt(u0 + ((u1 - u0) * i) / n));
        return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(ps), n * 2, radius * 1.35, 12, false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geo, spreadQ, radius]);
  useEffect(() => () => spreadGeo.forEach((g) => g.dispose()), [spreadGeo]);

  // the bold pulses' lanes in the cut-away: along each copper conductor's band of the cut face, toward the camera
  const lanes = useMemo(() => {
    if (!slugs || !cut) return null;
    const v = new THREE.Vector3(...view).normalize();
    const n = Math.max(12, Math.ceil(((cut[1] - cut[0]) * geo.len) / 0.03));
    const fr = frames(geo.curve, cut[0], cut[1], n, v);
    return COPPER.map(([a, b]) => {
      const m = (a + b) / 2;
      const c = new THREE.CatmullRomCurve3(fr.map((f) => f.p.clone().addScaledVector(f.b, m * radius).addScaledVector(f.n, 0.004)));
      // each lane as thick as its conductor and the coolant round it (≈ 0.3 radii): thick pulses, not dashes
      return {curve: c, len: c.getLength(), half: 0.3 * radius};
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geo, !!slugs, radius, view[0], view[1], view[2]]);

  // the arrows: on the core, lifted onto the cut face, toward the car (the route's end)
  const arrowPts = useMemo(() => {
    const v = new THREE.Vector3(...view).normalize();
    const n = Math.max(24, Math.ceil(geo.len / 0.04));
    return [...Array(n + 1).keys()].map((i) => {
      const u = i / n;
      const p = geo.curve.getPointAt(u);
      const t = geo.curve.getTangentAt(u).normalize();
      const b = new THREE.Vector3().crossVectors(t, v).normalize();
      const nrm = new THREE.Vector3().crossVectors(b, t).normalize();
      return p.addScaledVector(nrm, arrowRadius * 1.2).toArray() as V3;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geo, arrowRadius, view[0], view[1], view[2]]);
  // they ride the cut-away run only: each grows out of its start and shrinks into its end, fading
  const c0 = cut ? cut[0] * geo.len : 0;
  const runLen = cut ? (cut[1] - cut[0]) * geo.len : 0;
  const runs = cut && arrows > 0.02 ? conveyorArrows(arrows, flow, runLen) : [];
  const fade = Math.max(0, Math.min(1, arrows / 0.6));
  const inkT = INK * inkScale;

  return (
    <group>
      {geo.tubes.map((g, i) => (
        <mesh key={i} geometry={g} material={mats.jacketSkin} castShadow receiveShadow />
      ))}
      {geo.bands.map((b, i) => (
        <mesh key={`b${i}`} geometry={b.g} material={mats[b.mat]} receiveShadow />
      ))}
      {geo.caps.map((c, i) => (
        <React.Fragment key={`c${i}`}>
          <mesh geometry={c.g} material={mats.jacket} />
          <InkLine points={c.ring} closed={false} thickness={inkT} />
        </React.Fragment>
      ))}
      {geo.edges.map((e, i) => (
        <InkLine key={`e${i}`} points={e} closed={false} thickness={inkT} />
      ))}
      {h > 0.003
        ? geo.heatBands.map((g, i) => (
            <mesh
              key={`h${i}`}
              geometry={g}
              material={i % 2 ? mats.heatHalo : mats.heatCore}
              userData={{glow: true}}
              renderOrder={i % 2 ? 3 : 2}
            />
          ))
        : null}
      {h * sp > 0.003
        ? spreadGeo.map((g, i) => <mesh key={`s${i}`} geometry={g} material={mats.spread} userData={{glow: true}} renderOrder={3} />)
        : null}
      {runs.map(([a, b], i) => {
        const t0 = Math.max(0, a);
        const t1 = Math.min(runLen, b);
        if (t1 - t0 < 0.012) return null;
        const out = b > runLen ? Math.max(0, (runLen - a) / (b - a)) : 1;
        return (
          <CurveArrow
            key={i}
            points={arrowPts}
            from={(c0 + t0) / geo.len}
            to={(c0 + t1) / geo.len}
            radius={arrowRadius}
            opacity={fade * out}
            mood={mood}
            view={view}
          />
        );
      })}
      {slugs && (slugs.outer ?? 1) > 0.01 ? (
        <Slugs curve={geo.curve} len={geo.len} sl={slugs} radius={Math.max(radius * 1.18, slugs.radius)} opacity={slugs.outer ?? 1} mood={mood} />
      ) : null}
      {slugs && lanes
        ? lanes.map((l, i) => (
            <Slugs
              key={`cs${i}`}
              curve={l.curve}
              len={l.len}
              sl={{...slugs, flow: slugs.flow + i * 0.07}}
              radius={Math.min(slugs.radius, l.half)}
              mood={mood}
            />
          ))
        : null}
      {plug ? <Connector pose={plug} mats={mats} /> : null}
    </group>
  );
};

/** The connector's handle (see `PlugPose`): the nose in the port, the body, the grip, the latch. */
const Connector: React.FC<{
  pose: PlugPose;
  mats: {plugBody: THREE.Material; plugGrip: THREE.Material; plugTrim: THREE.Material};
}> = ({pose, mats}) => {
  const {a, up, side} = plugFrame(pose);
  const q = useMemo(
    () => new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(side, up, a)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [a.x, a.y, a.z],
  );
  const gbt = pose.kind === 'gbt';
  const g = useMemo(
    () =>
      gbt
        ? {
            body: roundedBox(0.115, 0.125, 0.15, 0.03, 4),
            grip: roundedBox(0.07, 0.19, 0.075, 0.03, 4),
            latch: roundedBox(0.04, 0.025, 0.07, 0.01, 2),
          }
        : {
            body: roundedBox(0.07, 0.075, 0.2, 0.03, 4),
            grip: roundedBox(0.058, 0.13, 0.06, 0.026, 4),
            latch: roundedBox(0.026, 0.016, 0.04, 0.007, 2),
          },
    [gbt],
  );
  // local frame: +z into the port, +y up; the nose at the origin (the port's face)
  return (
    <group position={pose.at} quaternion={q}>
      {/* the nose, in the port */}
      <mesh position={[0, 0, gbt ? -0.012 : -0.01]} rotation={[Math.PI / 2, 0, 0]} material={mats.plugTrim}>
        <cylinderGeometry args={[gbt ? 0.047 : 0.034, gbt ? 0.047 : 0.034, gbt ? 0.03 : 0.024, 32]} />
      </mesh>
      <mesh geometry={g.body} material={mats.plugBody} position={[0, gbt ? 0.0 : 0.004, gbt ? -0.095 : -0.11]} castShadow />
      <mesh
        geometry={g.grip}
        material={mats.plugGrip}
        position={gbt ? [0, -0.1, -0.16] : [0, -0.035, -0.215]}
        rotation={[gbt ? 0.38 : 0.75, 0, 0]}
        castShadow
      />
      <mesh geometry={g.latch} material={mats.plugTrim} position={gbt ? [0, 0.068, -0.08] : [0, 0.043, -0.1]} />
      {/* the boot where the cable leaves the grip */}
      <mesh
        position={gbt ? [0, -0.185, -0.195] : [0, -0.072, -0.245]}
        rotation={[gbt ? 0.38 : 0.75, 0, 0]}
        material={mats.plugGrip}
      >
        <cylinderGeometry args={[0.032, 0.04, 0.05, 20]} />
      </mesh>
    </group>
  );
};

export type HvRunProps = {
  /** The car's HV lead from the port to the pack (scene frame). */
  points: V3[];
  /** Arrows (as `ChargeCable`), the same count. */
  arrows?: number;
  flow?: number;
  arrowRadius?: number;
  mood?: Mood;
  view?: V3;
  /** The lead's radius (m). Default 0.02. */
  radius?: number;
  /** No. 010 draft 2: bold pulses instead of `arrows` (see `CableSlugs`). Default none. */
  slugs?: CableSlugs | null;
};

/** The car's high-voltage lead from the charging port to the pack, with the current's arrows on it (see the file comment). */
export const HvRun: React.FC<HvRunProps> = ({points, arrows = 0, flow = 0, arrowRadius = 0.022, mood = 'day', view = SECTION_ANGLE, radius = 0.02, slugs = null}) => {
  const key = JSON.stringify(points);
  const geo = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3((JSON.parse(key) as V3[]).map((q) => new THREE.Vector3(...q)), false, 'centripetal');
    return {curve, len: curve.getLength(), tube: new THREE.TubeGeometry(curve, 64, radius, 10, false)};
  }, [key, radius]);
  useEffect(() => () => geo.tube.dispose(), [geo]);
  const mat = useMemo(() => new THREE.MeshPhysicalMaterial({color: raw(REAL.cable), roughness: 0.55}), []);
  const lifted = useMemo(() => {
    const n = Math.max(24, Math.ceil(geo.len / 0.04));
    const v = new THREE.Vector3(...view).normalize();
    return [...Array(n + 1).keys()].map((i) => geo.curve.getPointAt(i / n).addScaledVector(v, radius * 1.1).toArray() as V3);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geo, radius, view[0], view[1], view[2]]);
  // the arrows fade in and out over the lead's first and last 12 cm (they come out of the port, go into the pack)
  const runs = arrows > 0.02 ? conveyorArrows(arrows, flow, geo.len, 0.2) : [];
  const fade = Math.max(0, Math.min(1, arrows / 0.6));
  return (
    <group>
      <mesh geometry={geo.tube} material={mat} castShadow />
      {slugs ? (
        <Slugs
          curve={geo.curve}
          len={geo.len}
          sl={slugs}
          lift={(() => {
            const v = new THREE.Vector3(...view).normalize().multiplyScalar(radius * 1.1);
            return [v.x, v.y, v.z] as V3;
          })()}
          radius={Math.max(radius * 1.25, slugs.radius * 0.8)}
          mood={mood}
        />
      ) : null}
      {runs.map(([a, b], i) => {
        const t0 = Math.max(0, a);
        const t1 = Math.min(geo.len, b);
        if (t1 - t0 < 0.01) return null;
        const edge = Math.min(1, b / 0.12, (geo.len - a) / 0.12);
        return (
          <CurveArrow
            key={i}
            points={lifted}
            from={t0 / geo.len}
            to={t1 / geo.len}
            radius={arrowRadius}
            opacity={fade * Math.max(0, edge)}
            mood={mood}
            view={view}
          />
        );
      })}
    </group>
  );
};
