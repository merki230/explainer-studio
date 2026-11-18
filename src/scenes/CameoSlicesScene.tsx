import React, {useEffect, useMemo} from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import * as THREE from 'three';
import {CAST_NEUTRAL, CHARGE, CITY, HIGHWAY, MOODS, RACE, section, WINTER, type Mood} from '../theme';
import {raw, roundedBox} from '../three/plaster';
import {cutMaterial, CutOutline, INK} from '../three/section/cutLook';
import {Figure} from '../three/section/Figure';
import {SectionCamera, type Framing} from '../three/section/SectionCamera';
import {SectionLights, SectionStage} from '../three/section/SectionStage';
import {skyTexture} from '../three/section/textures';
import {RadioPulse} from '../three/TirePieces';
import {ease} from './keyframes';

type V3 = [number, number, number];

/*
 * K, the cameo (No. 020 `crash-detect`, N9; style guide v0.18.17 § 3 "A cameo"): two small cut-open blocks stacked on one
 * sheet (§ 8 twin-section grammar), Day, the fixed angle. Top: a generic steel coaster track (galvanized rails, dark
 * supports) dropping into a level brake run, a two-car train (cool paint, no theming) with two riders as extras behind lap
 * bars. Bottom: a groomed snow slope (`WINTER` tokens, the cut face hatched and inked) and one skier extra (cool jacket,
 * grey helmet). Orange rings (the automatic calls, N4's look; upper arcs, so they never dip toward a head) rise from
 * `ringLift` (≥ 0.35 m) above the tops of a rider's and the skier's heads and fade before the block above. Nobody is hurt: the riders stay upright, the skier sits down after a hard stop, then stands.
 * No park, resort, ride or brand name, signage, theming or logo. World: x across, y up, z toward the camera.
 */

export type CameoSlicesSceneProps = {
  durationInFrames: number;
  mood?: Mood;
  /**
   * The coaster (seconds into the scene): the train creeps over the crest until `trainAt`, drops into the brake run and
   * stops hard at `stopAt` (≤ 0.25 s). Rings rise from above the front rider from `ringsAt`, every `ringEvery` (default 0.8)
   * until `ringsUntil`.
   */
  coaster?: {trainAt?: number; stopAt?: number; ringsAt?: number | null; ringEvery?: number; ringsUntil?: number};
  /**
   * The skier (seconds): standing at the top until `skiAt`, slides down, a hockey stop at `stopAt` (skis turned across,
   * 0.3 s), sits down in the snow at `sitAt`, stands back up at `upAt`. Rings from above the skier's head from `ringsAt`.
   */
  skier?: {skiAt?: number; stopAt?: number; sitAt?: number | null; upAt?: number | null; ringsAt?: number | null; ringEvery?: number; ringsUntil?: number};
  /** How far above the tops of the heads the rings start (m; default 0.35, § 3 A cameo). */
  ringLift?: number;
  /** Framing: 'sheet' (default: both blocks between the safe zone's top and a 2-line caption page) or a custom one. */
  framing?: 'sheet';
  camera?: {from: Framing; to?: Framing};
  /** Push toward the sheet, units/s (default 0.04) and the idle drift (default 0.08). */
  push?: number;
  drift?: number;
  location?: string;
  transition?: 'auto' | 'continue' | 'glide' | 'cut' | 'dissolve' | 'slide' | 'follow';
  startFrame?: number;
};

/** The sheet's framing (set on stills). */
export const CAMEO_FRAMINGS: Record<'sheet', Framing> = {
  sheet: {look: [0.1, -0.85, -0.4], distance: 52},
};

/** The blocks: the top block's ground (y), the bottom slope's ends, the blocks' x span and depth (z). */
const B = {x0: -3.2, x1: 3.2, z0: -1.3, z1: 0.5, topY: 3.9, topT: 0.45, slopeY: [1.0, 0.1] as [number, number], baseY: -0.45};
const slopeAt = (x: number) => B.slopeY[0] + ((x - B.x0) / (B.x1 - B.x0)) * (B.slopeY[1] - B.slopeY[0]);

/** The track's line (x, height over the top block's ground): crest, drop, level brake run. */
const TRACK: [number, number][] = [
  [-3.1, 1.85],
  [-2.6, 2.0],
  [-2.05, 1.8],
  [-1.5, 1.05],
  [-0.95, 0.55],
  [-0.4, 0.45],
  [3.0, 0.45],
];

/** The train's arc length along the track at t (creep, the drop, the hard stop). */
const trainS = (c: CameoSlicesSceneProps['coaster'], t: number) => {
  const go = c?.trainAt ?? 1.8;
  const stop = c?.stopAt ?? go + 1.0;
  const h = 1 / 120;
  let s = 1.45;
  for (let x = 0; x < t; x += h) {
    const m = x + h / 2;
    const v = m < go ? 0.35 : m < stop ? 0.35 + 5.6 * ease(m, go, go + 0.7) : (0.35 + 5.6 * ease(stop, go, go + 0.7)) * (1 - ease(m, stop, stop + 0.22));
    s += v * Math.min(h, t - x);
  }
  return s;
};

/** Ring births (scene seconds) from `at` every `every` until `until`, still alive at t. */
const ringsLive = (at: number | null | undefined, t: number, every = 0.8, until = Infinity, life = 1.3) => {
  if (at == null || t < at) return [];
  const out: {at: number; age: number}[] = [];
  for (let k = Math.floor((t - at) / every); k >= 0 && out.length < 3; k--) {
    const b = at + k * every;
    if (b <= until && t - b < life) out.push({at: b, age: t - b});
  }
  return out;
};

/** N9: the cameo (see the file comment). */
export const CameoSlicesScene: React.FC<CameoSlicesSceneProps> = (props) => {
  const {durationInFrames, mood = 'day', coaster, skier, startFrame = 0} = props;
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const m = MOODS[mood];
  const from = props.camera?.from ?? CAMEO_FRAMINGS.sheet;
  const push = props.push ?? 0.04;
  const to = props.camera?.to ?? {look: from.look, distance: from.distance - push * (durationInFrames / fps)};
  const mats = useMemo(
    () => ({
      cut: cutMaterial(),
      earth: new THREE.MeshStandardMaterial({color: raw(m.earth), roughness: 1}),
      snow: new THREE.MeshStandardMaterial({color: raw(WINTER.snow), roughness: 0.95}),
      snowShade: new THREE.MeshStandardMaterial({color: raw(WINTER.snowShade), roughness: 0.95}),
      rail: new THREE.MeshStandardMaterial({color: raw(HIGHWAY.galvanized), roughness: 0.35, metalness: 0.7}),
      support: new THREE.MeshStandardMaterial({color: raw(CHARGE.cabinetDark), roughness: 0.6}),
      car: new THREE.MeshStandardMaterial({color: raw(CITY.carBodies[2]), roughness: 0.45}),
      bar: new THREE.MeshStandardMaterial({color: raw(CHARGE.cabinetDark), roughness: 0.5}),
      ski: new THREE.MeshStandardMaterial({color: raw(CITY.carBodies[0]), roughness: 0.4}),
      sky: new THREE.MeshBasicMaterial({map: skyTexture(mood), fog: false}),
      ink: new THREE.MeshBasicMaterial({color: raw(section.cutLine)}),
    }),
    [m.earth, mood],
  );
  useEffect(() => () => Object.values(mats).forEach((q) => q.dispose()), [mats]);
  mats.sky.color.setScalar(1 / m.exposure);
  // the track: a smooth curve over the top block, two rails 0.8 m apart, ties and supports
  const curve = useMemo(() => new THREE.CatmullRomCurve3(TRACK.map(([x, y]) => new THREE.Vector3(x, B.topY + y, -0.4))), []);
  const len = useMemo(() => curve.getLength(), [curve]);
  const rails = useMemo(
    () =>
      [-0.38, 0.38].map((dz) => {
        const c = new THREE.CatmullRomCurve3(TRACK.map(([x, y]) => new THREE.Vector3(x, B.topY + y, -0.4 + dz)));
        return new THREE.TubeGeometry(c, 120, 0.045, 8, false);
      }),
    [],
  );
  useEffect(() => () => rails.forEach((g) => g.dispose()), [rails]);
  const wedge = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(B.x0, B.baseY);
    s.lineTo(B.x1, B.baseY);
    s.lineTo(B.x1, B.slopeY[1]);
    s.lineTo(B.x0, B.slopeY[0]);
    s.closePath();
    const g = new THREE.ExtrudeGeometry(s, {depth: B.z1 - B.z0, bevelEnabled: false});
    g.translate(0, 0, B.z0);
    return g;
  }, []);
  // the slope's cut face on its own, its UVs 0 → 1 like a box face (the hatch's scale)
  const face = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const P: [number, number][] = [
      [B.x0, B.baseY],
      [B.x1, B.baseY],
      [B.x1, B.slopeY[1]],
      [B.x0, B.slopeY[0]],
    ];
    g.setAttribute('position', new THREE.Float32BufferAttribute(P.flatMap(([x, y]) => [x, y, 0]), 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(P.flatMap(([x, y]) => [(x - B.x0) / (B.x1 - B.x0), (y - B.baseY) / (B.slopeY[0] - B.baseY)]), 2));
    g.setIndex([0, 1, 2, 0, 2, 3]);
    g.computeVertexNormals();
    return g;
  }, []);
  useEffect(() => () => face.dispose(), [face]);
  // the groomed top as its own quad (the extrusion's slanted side came out facing down)
  const top = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const P: V3[] = [
      [B.x0, B.slopeY[0], B.z0],
      [B.x0, B.slopeY[0], B.z1],
      [B.x1, B.slopeY[1], B.z1],
      [B.x1, B.slopeY[1], B.z0],
    ];
    g.setAttribute('position', new THREE.Float32BufferAttribute(P.flat(), 3));
    g.setIndex([0, 1, 2, 0, 2, 3]);
    g.computeVertexNormals();
    if ((g.attributes.normal as THREE.BufferAttribute).getY(0) < 0) {
      g.setIndex([0, 2, 1, 0, 3, 2]);
      g.computeVertexNormals();
    }
    return g;
  }, []);
  useEffect(() => () => top.dispose(), [top]);
  useEffect(() => () => wedge.dispose(), [wedge]);
  const carGeo = useMemo(() => roundedBox(1.05, 0.42, 0.86, 0.06), []);
  useEffect(() => () => carGeo.dispose(), [carGeo]);

  // the train: two cars along the track, the front one leading
  const s = Math.min(len - 0.6, trainS(coaster, t));
  const carAt = (sv: number) => {
    const u = Math.max(0, Math.min(1, sv / len));
    const p = curve.getPointAt(u);
    const tg = curve.getTangentAt(u);
    return {p, pitch: Math.atan2(tg.y, tg.x)};
  };
  const cars = [carAt(s), carAt(s - 1.15)];
  // the top of a seated rider's head over the track (the figure 0.12 up in the car, its head top ≈ 1.45 over that)
  const lift = props.ringLift ?? 0.35;
  const riderHead = (c: {p: THREE.Vector3}): V3 => [c.p.x, c.p.y + 1.57, c.p.z];
  const coasterRings = ringsLive(coaster?.ringsAt, t, coaster?.ringEvery, coaster?.ringsUntil, 1.3);
  const ringFrom = (at: number) => riderHead(carAt(Math.min(len - 0.6, trainS(coaster, at))));

  // the skier: stands, slides down (+x), hockey-stops, sits, stands
  const sk = skier ?? {};
  const skiAt = sk.skiAt ?? 2.4;
  const stopAt = sk.stopAt ?? skiAt + 0.9;
  const skX = (tt: number) => {
    const a = -1.9;
    const run = 3.0 * ease(tt, skiAt, stopAt + 0.15);
    return a + run;
  };
  const x = skX(t);
  const yaw = -Math.PI / 2 + (Math.PI / 2) * 0.9 * ease(t, stopAt - 0.1, stopAt + 0.2);
  const sat = sk.sitAt == null ? 0 : ease(t, sk.sitAt, sk.sitAt + 0.5) * (sk.upAt == null ? 1 : 1 - ease(t, sk.upAt, sk.upAt + 0.6));
  const ground = slopeAt(x);
  // the top of the skier's helmet (standing ≈ 1.9 over the snow; sitting ≈ 1.0)
  const skierHead: V3 = [x, ground + 1.92 - 0.9 * sat, 0.0];
  const skierRings = ringsLive(sk.ringsAt, t, sk.ringEvery, sk.ringsUntil, 1.0);
  const slopeAngle = Math.atan2(B.slopeY[1] - B.slopeY[0], B.x1 - B.x0);
  const ink = INK * 3;
  const helmet = {shell: RACE.helmetEv, visor: RACE.visor};
  const jacket = {...CAST_NEUTRAL, top: CITY.carBodies[2]};
  return (
    <AbsoluteFill>
      <SectionStage mood={mood} post={{focusY: 0.5}} far={200}>
        <SectionCamera from={from} to={to} durationInFrames={durationInFrames} drift={props.drift ?? 0.08} clockOffset={startFrame / fps} />
        <SectionLights mood={mood} target={[0, 1.6, 0]} lamp={0} />
        <mesh position={[0, 6, -20]} material={mats.sky}>
          <planeGeometry args={[220, 170]} />
        </mesh>
        {/* top block: the ground slab, cut on its front and right faces */}
        <mesh position={[0, B.topY - B.topT / 2, (B.z0 + B.z1) / 2]} material={[mats.cut, mats.earth, mats.earth, mats.earth, mats.cut, mats.earth]} receiveShadow castShadow>
          <boxGeometry args={[B.x1 - B.x0, B.topT, B.z1 - B.z0]} />
        </mesh>
        <CutOutline
          thickness={ink}
          rects={[
            [
              [B.x0, B.topY - B.topT, B.z1],
              [B.x1, B.topY, B.z1],
            ],
            [
              [B.x1, B.topY - B.topT, B.z0],
              [B.x1, B.topY, B.z1],
            ],
          ]}
        />
        {/* the track: rails, ties, supports */}
        {rails.map((g, i) => (
          <mesh key={i} geometry={g} material={mats.rail} castShadow />
        ))}
        {[...Array(26).keys()].map((i) => {
          const u = (i + 0.5) / 26;
          const p = curve.getPointAt(u);
          return (
            <mesh key={i} position={[p.x, p.y - 0.05, p.z]} material={mats.support} castShadow>
              <boxGeometry args={[0.07, 0.06, 0.9]} />
            </mesh>
          );
        })}
        {[-2.6, -1.7, -0.9, 0.4, 1.7, 2.8].map((sx) => {
          const pts = curve.getSpacedPoints(200);
          const near = pts.reduce((a, b) => (Math.abs(b.x - sx) < Math.abs(a.x - sx) ? b : a));
          const h = near.y - 0.08 - B.topY;
          return (
            <mesh key={sx} position={[sx, B.topY + h / 2, -0.4]} material={mats.support} castShadow>
              <boxGeometry args={[0.12, h, 0.12]} />
            </mesh>
          );
        })}
        {/* the train and its riders (extras, lap bars down) */}
        {cars.map((c, i) => (
          <group key={i} position={[c.p.x, c.p.y, c.p.z]} rotation={[0, 0, c.pitch]}>
            <mesh geometry={carGeo} material={mats.car} position={[0, 0.28, 0]} castShadow receiveShadow />
            <Figure
              who="extra"
              look={i === 0 ? CAST_NEUTRAL : {...CAST_NEUTRAL, top: CITY.carBodies[3]}}
              mood={mood}
              position={[-0.05, 0.12, 0]}
              rotationY={Math.PI / 2}
              seed={`rider-${i}`}
              phone={false}
              hands={[
                [-0.18, 0.72, 0.28],
                [0.18, 0.72, 0.28],
              ]}
              clockOffset={startFrame / fps}
            />
            <mesh material={mats.bar} position={[0.25, 0.7, 0]}>
              <boxGeometry args={[0.06, 0.06, 0.62]} />
            </mesh>
          </group>
        ))}
        {/* bottom block: the snow slope, cut on its front */}
        <mesh geometry={wedge} material={[mats.snowShade, mats.snowShade]} castShadow />
        <mesh geometry={top} material={mats.snow} position={[0, 0.003, 0]} receiveShadow />
        <mesh geometry={face} material={mats.cut} position={[0, 0, B.z1 + 0.002]} receiveShadow />
        <CutOutline
          thickness={ink}
          edges={[
            [
              [B.x0, B.baseY, B.z1],
              [B.x1, B.baseY, B.z1],
            ],
            [
              [B.x1, B.baseY, B.z1],
              [B.x1, B.slopeY[1], B.z1],
            ],
            [
              [B.x0, B.slopeY[0], B.z1],
              [B.x0, B.baseY, B.z1],
            ],
          ]}
        />
        {/* the slope's top cut edge (CutOutline draws axis-aligned edges only): an ink bar along it */}
        <mesh
          material={mats.ink}
          position={[(B.x0 + B.x1) / 2, (B.slopeY[0] + B.slopeY[1]) / 2, B.z1 + 0.004]}
          rotation={[0, 0, slopeAngle]}
        >
          <boxGeometry args={[Math.hypot(B.x1 - B.x0, B.slopeY[1] - B.slopeY[0]), ink, ink]} />
        </mesh>
        {/* the skier: skis under the feet, across the slope after the stop */}
        <group position={[x, ground + 0.02, 0]} rotation={[0, yaw + Math.PI / 2, 0]}>
          <group rotation={[0, 0, sat > 0.5 ? 0 : -slopeAngle * Math.cos(yaw + Math.PI / 2)]}>
            {[-0.1, 0.1].map((dz) => (
              <mesh key={dz} material={mats.ski} position={[0, 0.01, dz]} castShadow>
                <boxGeometry args={[1.5, 0.025, 0.08]} />
              </mesh>
            ))}
          </group>
        </group>
        <Figure
          who="extra"
          look={jacket}
          mood={mood}
          position={[x, ground + 0.03 - 0.4 * sat, 0]}
          rotationY={yaw + Math.PI}
          stance={sat > 0.5 ? 'sit' : 'stand'}
          seed="skier"
          phone={false}
          hands={[
            [-0.3, sat > 0.5 ? 0.45 : 0.95, 0.15],
            [0.3, sat > 0.5 ? 0.45 : 0.95, 0.15],
          ]}
          helmet={helmet}
          clockOffset={startFrame / fps}
        />
        {/* the automatic calls: orange rings rising from above the heads, fading before the block above */}
        {coasterRings.map((r) => {
          const h = ringFrom(r.at);
          return <RadioPulse key={`c${r.at.toFixed(2)}`} position={[h[0], h[1] + lift + 0.04 + 0.35 * r.age, h[2]]} age={r.age} reach={0.4} weight={2.2} life={1.3} arc={Math.PI} />;
        })}
        {skierRings.map((r) => (
          <RadioPulse key={`s${r.at.toFixed(2)}`} position={[skierHead[0], skierHead[1] + lift + 0.04 + 0.2 * r.age, skierHead[2]]} age={r.age} reach={0.24} weight={2.2} life={1.0} arc={Math.PI} />
        ))}
      </SectionStage>
    </AbsoluteFill>
  );
};
