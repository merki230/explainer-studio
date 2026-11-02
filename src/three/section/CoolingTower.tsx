import React, {useEffect, useMemo} from 'react';
import {random, useCurrentFrame, useVideoConfig} from 'remotion';
import * as THREE from 'three';
import {DESERT, HIGHWAY, MOODS, REAL, section, STREET, TOWER, type Mood} from '../../theme';
import {Plume} from '../Atmosphere';
import {PushArrow} from '../PushArrow';
import {raw, roundedBox} from '../plaster';
import {applyAlbedo, applyEnv, useAlbedo, useEnvStrength, useStudioEnv} from '../real/useStudioEnv';
import {CutOutline, cutMaterial, INK, InkLine, type Rect} from './cutLook';
import {GlowNode, GlowSegment} from './GlowLines';
import {SECTION_ANGLE} from './SectionCamera';

type V3 = [number, number, number];

/*
 * Rooftop heat rejection for the data-centre slice (No. 013), realistic and generic (no maker, nothing readable), metres:
 *
 *  - `CoolingTower`: an induced-draft counterflow cell. FRP casing on a steel frame, side air-inlet louvers over a
 *    cold-water basin, a translucent fill pack, a spray header with nozzles, drift eliminators, and a fan in a stack
 *    on the top deck. Its near (+z) face can be cut away top-down (§ 3: hatched cut faces, ink edges), showing the warm
 *    water raining from the nozzles over the fill into the basin (orange at the nozzles fading to `STREET.water` in
 *    the basin, § 5: the warm water is the system), vapour wisps peeling off with orange heat tokens and leaving
 *    through the fan, neutral air arrows in through the louvers and up, the basin's level, mineral dots (grey and
 *    off-white), lap ticks on the basin wall, a muted-olive biofilm (`DESERT.scrubDark`), and the makeup valve with
 *    its float and a neutral fresh-water stream.
 *  - `DryCooler`: an air-cooled fluid cooler (a car radiator writ large): legs, casing, a horizontal finned coil whose
 *    tubes carry the orange warm water, three fans on top, and orange warm air rising off it. No water touches the air,
 *    so no vapour and no basin. Its near face can be cut away the same way.
 *  - `AxialFan`: the fan both use (hub, pitched blades), turning by `turns`; above ≈ half a blade gap a frame it smears
 *    into a disc (§ 8 motion check: never strobing backward).
 *
 * Local frames: origin at the centre of the unit's base, +z toward the camera, y up. Every value is a function of the
 * props (the scene drives them from the frame).
 */

export const TOWER_DC = {
  w: 4.0,
  d: 3.6,
  h: 4.0,
  basinH: 0.55,
  louverTop: 1.6,
  fillBot: 1.75,
  fillTop: 3.0,
  sprayY: 3.25,
  driftY: 3.55,
  stackR: 1.35,
  stackH: 1.0,
};
export const DRY_DC = {l: 4.6, d: 2.2, legs: 0.6, h: 1.9, coilBot: 1.0, coilTop: 1.35, fanR: 0.62, fans: 3};

/** Fan turn rate above which the blades smear (rev/s per blade count: half a blade gap a frame at 30 fps). */
export const fanSmear = (blades: number) => 30 / (2 * blades);

const stripeTex = (() => {
  let tex: THREE.DataTexture | null = null;
  return () => {
    if (tex) return tex;
    const w = 64;
    const h = 4;
    const data = new Uint8Array(w * h * 4);
    for (let j = 0; j < h; j++)
      for (let i = 0; i < w; i++) {
        const o = (j * w + i) * 4;
        // fine fin / sheet lines: a dark line every 8 px
        const v = i % 8 === 0 ? 150 : i % 8 === 1 ? 200 : 245;
        data[o] = v;
        data[o + 1] = v;
        data[o + 2] = v;
        data[o + 3] = 255;
      }
    tex = new THREE.DataTexture(data, w, h, THREE.RGBAFormat);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.magFilter = THREE.LinearFilter;
    tex.minFilter = THREE.LinearFilter;
    tex.needsUpdate = true;
    return tex;
  };
})();

const useUnitMats = () => {
  const env = useStudioEnv();
  const envScale = useEnvStrength();
  const albedo = useAlbedo();
  const mats = useMemo(() => {
    const phys = (c: string, o: THREE.MeshPhysicalMaterialParameters = {}) =>
      new THREE.MeshPhysicalMaterial({color: raw(c), ...o});
    // dark PVC fill sheets (as most are), translucent so the rain shows; white vapour and the orange read on it
    const fill = new THREE.MeshStandardMaterial({
      color: raw(REAL.cabinet),
      roughness: 0.7,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
      map: stripeTex().clone(),
    });
    fill.map!.repeat.set(10, 1);
    fill.map!.needsUpdate = true;
    const fins = new THREE.MeshStandardMaterial({
      color: raw(REAL.alu),
      roughness: 0.45,
      metalness: 0.6,
      map: stripeTex().clone(),
    });
    fins.map!.repeat.set(30, 1);
    fins.map!.needsUpdate = true;
    const finsCut = fins.clone();
    finsCut.transparent = true;
    finsCut.opacity = 0.55;
    finsCut.depthWrite = false;
    return {
      casing: phys(TOWER.cabinetPaint, {roughness: 0.55, clearcoat: 0.25}),
      casingDark: phys(TOWER.mountPlate, {roughness: 0.55, side: THREE.DoubleSide}),
      steel: phys(HIGHWAY.galvanized, {metalness: 0.8, roughness: 0.45}),
      louver: phys(REAL.cabinet, {roughness: 0.55, metalness: 0.3}),
      basin: phys(TOWER.concrete, {roughness: 0.85}),
      basinIn: phys(TOWER.duct, {roughness: 0.8}),
      fill,
      fins,
      finsCut,
      drift: phys(REAL.labDark, {roughness: 0.7, transparent: true, opacity: 0.55, depthWrite: false}),
      pipe: phys(REAL.steel, {metalness: 0.7, roughness: 0.4}),
      nozzle: phys(REAL.labDark, {roughness: 0.5}),
      blade: phys(REAL.labDark, {roughness: 0.45, clearcoat: 0.3}),
      hub: phys(REAL.cabinet, {metalness: 0.6, roughness: 0.4}),
      blur: new THREE.MeshBasicMaterial({color: raw(REAL.labDark), transparent: true, opacity: 0, depthWrite: false}),
      water: new THREE.MeshStandardMaterial({
        color: raw(STREET.water),
        roughness: 0.15,
        metalness: 0.1,
        transparent: true,
        opacity: 0.88,
      }),
      fresh: new THREE.MeshBasicMaterial({
        color: raw(STREET.stream),
        transparent: true,
        opacity: 0.75,
        depthWrite: false,
      }),
      ripple: new THREE.MeshBasicMaterial({
        color: raw(STREET.stream),
        transparent: true,
        opacity: 0.5,
        depthWrite: false,
      }),
      float: phys(REAL.chrome, {metalness: 0.8, roughness: 0.3}),
      dotGrey: new THREE.MeshStandardMaterial({color: raw(STREET.gravel), roughness: 0.8}),
      dotWhite: new THREE.MeshStandardMaterial({color: raw(section.cut), roughness: 0.8}),
      film: new THREE.MeshStandardMaterial({color: raw(DESERT.scrubDark), roughness: 0.9}),
      tickOn: new THREE.MeshBasicMaterial({color: raw(section.cutLine)}),
      tickOff: new THREE.MeshStandardMaterial({color: raw(TOWER.mountPlate), roughness: 0.8}),
      cut: cutMaterial(),
      token: new THREE.MeshBasicMaterial({color: raw(section.orange), transparent: true}),
      // the rain in six height bands, warm (orange) at the nozzles → the basin's water colour
      rain: [...Array(6).keys()].map(
        () => new THREE.MeshBasicMaterial({color: raw(STREET.water), transparent: true, opacity: 0.9}),
      ),
    };
  }, []);
  useEffect(
    () => () => Object.values(mats).forEach((m) => (Array.isArray(m) ? m.forEach((x) => x.dispose()) : m.dispose())),
    [mats],
  );
  applyEnv(
    env,
    [
      [mats.casing, 0.5],
      [mats.steel, 0.9],
      [mats.pipe, 0.9],
      [mats.hub, 0.8],
      [mats.float, 1],
      [mats.water, 0.8],
    ],
    envScale,
  );
  applyAlbedo([mats.casing, mats.casingDark, mats.steel, mats.louver, mats.basin, mats.blade], albedo);
  return mats;
};
type UnitMats = ReturnType<typeof useUnitMats>;

const BLADE = new THREE.BoxGeometry(1, 0.025, 0.22);

/** An axial fan turning about +y: hub and `blades` pitched blades of `radius`; smears into a disc when fast. */
export const AxialFan: React.FC<{
  mats: UnitMats;
  radius: number;
  blades?: number;
  /** Revolutions so far. */
  turns: number;
  /** Current rate (rev/s), for the smear. */
  rate?: number;
}> = ({mats, radius, blades = 6, turns, rate = 0}) => {
  const smear = fanSmear(blades);
  const blur = Math.max(0, Math.min(1, (Math.abs(rate) - smear * 0.8) / (smear * 0.2)));
  mats.blur.opacity = 0.35 * blur;
  return (
    <group>
      <group rotation={[0, turns * Math.PI * 2, 0]}>
        {[...Array(blades).keys()].map((b) => (
          <group key={b} rotation={[0, (b / blades) * Math.PI * 2, 0]}>
            <mesh
              geometry={BLADE}
              material={mats.blade}
              position={[radius * 0.55, 0, 0]}
              scale={[radius * 0.82, 1, radius * 0.4]}
              rotation={[0.28, 0, 0]}
              castShadow
            />
          </group>
        ))}
        <mesh material={mats.hub}>
          <cylinderGeometry args={[radius * 0.16, radius * 0.18, 0.16, 18]} />
        </mesh>
      </group>
      {blur > 0.01 ? (
        <mesh material={mats.blur} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <ringGeometry args={[radius * 0.18, radius * 0.97, 40]} />
        </mesh>
      ) : null}
    </group>
  );
};

/** A box spanning two corners (for the hatched cut bands). */
/** How far the corner posts stand out of the panels' outer faces (m): flush faces z-fight while the camera moves. */
const POST_PROUD = 0.012;
/** How far a hatched cut band stands in front of the face it lies on (m), for the same reason. */
const CUT_PROUD = 0.003;

const Band: React.FC<{a: V3; b: V3; mat: THREE.Material}> = ({a, b, mat}) => (
  <mesh material={mat} position={[(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2]}>
    <boxGeometry
      args={[
        Math.max(0.002, Math.abs(b[0] - a[0])),
        Math.max(0.002, Math.abs(b[1] - a[1])),
        Math.max(0.002, Math.abs(b[2] - a[2])),
      ]}
    />
  </mesh>
);

const smooth = (a: number, b: number, x: number) => {
  const u = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return u * u * (3 - 2 * u);
};
const mixC = (a: string, b: string, k: number) => raw(a).lerp(raw(b), Math.max(0, Math.min(1, k)));

export type CoolingTowerProps = {
  mood?: Mood;
  /** The near face cut away, 0 (closed) → 1 (open), top-down. Default 1. */
  cut?: number;
  /** The fan's turn so far (rev) and its rate (rev/s, for the smear). */
  fanTurns?: number;
  fanRate?: number;
  /** The video clock (s): the rain, wisps, arrows and ripples run on it. */
  clock: number;
  /** Rain over the fill, 0 → 1 (the loop's flow). */
  rain?: number;
  /** How warm (orange) the water is at the nozzles, 0 → 1; it fades to the basin's colour by the bottom. */
  warm?: number;
  /** 0 → 1: the falling water orange all the way down (before the fade top → basin is shown). Default 0. */
  uniform?: number;
  /** 0 → 1: mineral dots ride the falling water down (they stay behind when it evaporates). Default 0. */
  mineralFall?: number;
  /** Vapour wisps peeling off the fill and leaving through the fan, 0 → 1. */
  vapor?: number;
  /** The wisps carry orange heat tokens (default true). */
  tokens?: boolean;
  /** Seconds between wisps (default 0.8). */
  vaporEvery?: number;
  /** Neutral air arrows in through the side louvers and up through the fan, 0 → 1. */
  airIn?: number;
  /** The basin's water level, 0 → 1 of the basin's height (default 0.6). */
  level?: number;
  /** Mineral dots in the basin, 0 → 1 (density); some ride the falling water down. */
  minerals?: number;
  /** Lap ticks lit on the basin wall (0 → 6). */
  laps?: number;
  /** The muted-olive biofilm on the basin wall and the fill's bottom edge, 0 → 1. */
  biofilm?: number;
  /** The makeup valve's opening, 0 → 1: fresh water pours into the basin. */
  makeup?: number;
  /** The basin's whole content hidden (the second, closed tower shows none of it). */
  inside?: boolean;
  ink?: number;
  seed?: string;
};

/** Where the makeup line enters the basin (local): the scene runs its pipe here. */
export const TOWER_MAKEUP_IN: V3 = [-TOWER_DC.w / 2 + 0.45, TOWER_DC.basinH + 0.35, -TOWER_DC.d / 2 - 0.05];
/** The spray header's inlet at the back (local) and the basin outlet at the back (local). */
export const TOWER_INLET: V3 = [-0.6, TOWER_DC.sprayY, -TOWER_DC.d / 2 - 0.05];
export const TOWER_OUTLET: V3 = [-0.6, 0.22, -TOWER_DC.d / 2 - 0.05];

/** A cooling-tower cell (see the file comment). */
export const CoolingTower: React.FC<CoolingTowerProps> = ({
  mood = 'day',
  cut = 1,
  fanTurns = 0,
  fanRate = 0,
  clock,
  rain = 1,
  warm = 1,
  uniform = 0,
  mineralFall = 0,
  vapor = 0,
  tokens = true,
  vaporEvery = 0.8,
  airIn = 0,
  level = 0.6,
  minerals = 0,
  laps = 0,
  biofilm = 0,
  makeup = 0,
  inside = true,
  ink = INK,
  seed = 'tower',
}) => {
  const mats = useUnitMats();
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const T = TOWER_DC;
  const {w, d, h} = T;
  const c = Math.max(0, Math.min(1, cut));
  const open = c > 0.001;
  // the front panel's top edge comes down as it cuts away
  const panelTop = h * (1 - c);
  const P = 0.06; // panel thickness
  const waterY = 0.08 + (T.basinH - 0.12) * Math.max(0, Math.min(1, level));
  const geo = useMemo(() => {
    // the top deck with the stack's hole, whole and (cut) its back half
    const deck = (half: boolean) => {
      const s = new THREE.Shape();
      const zf = half ? 0 : d / 2;
      s.moveTo(-w / 2, -d / 2);
      s.lineTo(w / 2, -d / 2);
      s.lineTo(w / 2, zf);
      s.lineTo(-w / 2, zf);
      s.closePath();
      const hole = new THREE.Path();
      if (half) {
        hole.moveTo(T.stackR, 0);
        hole.absarc(0, 0, T.stackR, 0, -Math.PI, true);
        hole.closePath();
      } else hole.absarc(0, 0, T.stackR, 0, Math.PI * 2, false);
      s.holes.push(hole);
      const g = new THREE.ExtrudeGeometry(s, {depth: 0.08, bevelEnabled: false, curveSegments: 36});
      // shape in x/y → x/z (y of the shape = z), extruded up
      g.rotateX(Math.PI / 2);
      g.translate(0, 0.08, 0);
      return g;
    };
    return {
      deckWhole: deck(false),
      deckHalf: deck(true),
      stackWhole: new THREE.CylinderGeometry(T.stackR, T.stackR * 1.04, T.stackH, 40, 1, true),
      stackHalf: new THREE.CylinderGeometry(T.stackR, T.stackR * 1.04, T.stackH, 40, 1, true, Math.PI / 2, Math.PI),
      slat: roundedBox(0.04, 0.16, d - 0.2, 0.01),
    };
  }, [w, d, T.stackR, T.stackH]);
  useEffect(() => () => Object.values(geo).forEach((g) => g.dispose()), [geo]);

  // ---- rain: nozzles in a 5 × 3 grid, 7 drops each, in six colour bands by height
  const nozzles: [number, number][] = [];
  for (let i = 0; i < 5; i++)
    for (let k = 0; k < 3; k++) nozzles.push([(-0.4 + i * 0.2) * w * 0.85, (-0.33 + k * 0.33) * d * 0.8]);
  const fallTop = T.sprayY - 0.1;
  const fallH = fallTop - waterY;
  const v = 2.6; // m/s (slowed for reading; the real fall is faster)
  const warmK = Math.max(0, Math.min(1, warm));
  mats.rain.forEach((m, b) => {
    const u = (b / 5) * (1 - Math.max(0, Math.min(1, uniform))); // 0 top → 1 bottom (all top-coloured while uniform)
    m.color.copy(mixC(section.orange, STREET.water, Math.min(1, u * 1.15 + (1 - warmK))));
    m.opacity = 0.9 * Math.max(0, Math.min(1, rain));
  });
  const drops: React.ReactNode[] = [];
  if (inside && rain > 0.01) {
    nozzles.forEach(([nx, nz], ni) => {
      for (let k = 0; k < 7; k++) {
        const ph = random(`${seed}-rp-${ni}-${k}`);
        const u = ((((clock * v) / fallH + ph + k / 7) % 1) + 1) % 1;
        const y = fallTop - u * fallH;
        const jx = (random(`${seed}-rx-${ni}-${k}-${Math.floor((clock * v) / fallH + ph + k / 7)}`) - 0.5) * 0.35;
        const band = Math.min(5, Math.floor(u * 6));
        const x = nx + jx;
        const z = nz + (ph - 0.5) * 0.3;
        drops.push(
          <mesh key={`r${ni}-${k}`} material={mats.rain[band]} position={[x, y, z]} renderOrder={8}>
            <boxGeometry args={[0.02, 0.16, 0.02]} />
          </mesh>,
        );
        // a mineral dot riding the drop down (it stays behind when the water evaporates)
        if (mineralFall > 0 && random(`${seed}-rm-${ni}-${k}`) < Math.max(0.25, minerals) * 0.6 * mineralFall) {
          drops.push(
            <mesh
              key={`rm${ni}-${k}`}
              material={k % 2 ? mats.dotWhite : mats.dotGrey}
              position={[x + 0.03, y - 0.1, z]}
              renderOrder={8}
            >
              <sphereGeometry args={[0.022, 8, 6]} />
            </mesh>,
          );
        }
      }
    });
  }

  // ---- vapour wisps: peeling off the fill (one every ≈ `vaporEvery` s), rising out through the fan, each with an
  // orange heat token (the `Plume` part at a small scale, in the front half of the fill so it reads through the cut)
  const wispCount = Math.max(3, Math.round(2.6 / Math.max(0.3, vaporEvery)));
  const wisps =
    inside && vapor > 0.01 ? (
      <Plume
        position={[0, T.fillBot + 0.35, d * 0.18]}
        strength={2 * Math.min(1, vapor)}
        radius={w * 0.22}
        rise={h + T.stackH + 1.0 - T.fillBot - 0.35}
        life={2.6}
        count={wispCount}
        wind={0.15}
        opacity={0.9}
        tone={0.9 / MOODS[mood].exposure}
        shade={0.62}
        tokens={tokens ? 1 : 0}
        tokenSize={0.075}
        pulse={0}
        facing={SECTION_ANGLE}
        seed={`${seed}-wisp`}
        clockOffset={clock - frame / fps}
      />
    ) : null;

  // ---- air arrows (neutral): in through both louvers, then up through the fill and out of the fan
  const air: React.ReactNode[] = [];
  if (airIn > 0.01) {
    const cyc = 1.6;
    for (let s = -1; s <= 1; s += 2)
      for (let j = 0; j < 2; j++) {
        const u = (((clock / cyc + j * 0.5 + (s > 0 ? 0.25 : 0)) % 1) + 1) % 1;
        const x = s * (w / 2 + 0.9 - u * 1.2);
        air.push(
          <PushArrow
            key={`ai${s}${j}`}
            kind="neutral"
            mood={mood}
            position={[x, 1.0 + j * 0.25, d / 2 - 0.4]}
            direction={[-s, 0, 0]}
            normal={SECTION_ANGLE}
            length={0.55}
            radius={0.035}
            node={false}
            glow={airIn * smooth(0, 0.2, u) * (1 - smooth(0.8, 1, u))}
          />,
        );
      }
    for (let j = 0; j < 3; j++) {
      const u = (((clock / (cyc * 1.4) + j / 3) % 1) + 1) % 1;
      air.push(
        <PushArrow
          key={`au${j}`}
          kind="neutral"
          mood={mood}
          position={[(j - 1) * 0.5, T.louverTop + u * (h + T.stackH + 0.8 - T.louverTop), d / 2 - 0.5]}
          direction={[0, 1, 0]}
          normal={SECTION_ANGLE}
          length={0.6}
          radius={0.035}
          node={false}
          glow={airIn * smooth(0, 0.15, u) * (1 - smooth(0.85, 1, u))}
        />,
      );
    }
  }

  // ---- basin minerals: dots settling as the density grows
  const dots: React.ReactNode[] = [];
  const nDots = Math.round(Math.max(0, Math.min(1, minerals)) * 90);
  const settle = Math.pow(Math.max(0, Math.min(1, minerals)), 1.4);
  for (let i = 0; i < nDots; i++) {
    const r = (s: string) => random(`${seed}-md-${s}-${i}`);
    const x = (r('x') - 0.5) * (w - 0.3);
    const z = (r('z') - 0.5) * (d - 0.3);
    const free = 0.1 + r('y') * (waterY - 0.14);
    const bob = 0.012 * Math.sin(clock * (0.8 + r('b')) + i);
    const y = free + (0.1 - free) * settle * r('s') + bob;
    dots.push(
      <mesh key={`d${i}`} material={i % 3 ? mats.dotGrey : mats.dotWhite} position={[x, y, z]}>
        <sphereGeometry args={[0.028, 8, 6]} />
      </mesh>,
    );
  }
  mats.water.color.copy(mixC(STREET.water, STREET.gravel, 0.45 * Math.max(0, Math.min(1, minerals))));

  // ---- biofilm: a film of small overlapping spots creeping up the back wall from the water line (the lowest first)
  // and spreading along the fill's bottom edge from the left; it recedes the other way when the share drops
  const film: React.ReactNode[] = [];
  const bf = Math.max(0, Math.min(1, biofilm));
  if (bf > 0.001) {
    for (let i = 0; i < 110; i++) {
      const r = (s: string) => random(`${seed}-bf-${s}-${i}`);
      const onFill = i % 4 === 3;
      const x = (r('x') - 0.5) * (w - 0.3);
      const hk = Math.pow(r('y'), 1.6); // 0 at the water line → 1 high up the wall
      const th = onFill ? 0.15 + 0.8 * ((x / (w - 0.3)) + 0.5) : 0.9 * hk;
      const k = smooth(th, th + 0.08, bf);
      if (k <= 0) continue;
      const pos: V3 = onFill
        ? [x, T.fillBot - 0.012, d / 2 - 0.2 - r('z') * 0.5]
        : [x, waterY + 0.02 + hk * 1.0, -d / 2 + P + 0.012];
      const sz = (0.05 + 0.05 * r('s')) * k;
      film.push(
        <mesh key={`f${i}`} material={mats.film} position={pos} scale={onFill ? [sz * 1.4, 0.012, sz] : [sz * 1.4, sz, 0.012]}>
          <sphereGeometry args={[1, 12, 8]} />
        </mesh>,
      );
    }
  }

  // ---- ripples where the rain lands
  const ripples: React.ReactNode[] = [];
  if (inside && rain > 0.05)
    for (let i = 0; i < 6; i++) {
      const u = (((clock / 1.1 + i / 6) % 1) + 1) % 1;
      const n = Math.floor(clock / 1.1 + i / 6);
      const x = (random(`${seed}-rip-x-${i}-${n}`) - 0.5) * (w - 0.6);
      const z = (random(`${seed}-rip-z-${i}-${n}`) - 0.5) * (d - 0.6);
      ripples.push(
        <mesh
          key={`rp${i}`}
          material={mats.ripple}
          position={[x, waterY + 0.005, z]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={0.1 + 0.35 * u}
          renderOrder={7}
        >
          <ringGeometry args={[0.8, 1, 24]} />
        </mesh>,
      );
    }

  const mk = Math.max(0, Math.min(1, makeup));
  const floatY = waterY + 0.04;
  const cutRects: Rect[] = open
    ? [
        [
          [-w / 2, Math.max(panelTop, 0), d / 2 + CUT_PROUD],
          [-w / 2 + P, h, d / 2 + CUT_PROUD],
        ],
        [
          [w / 2 - P, Math.max(panelTop, 0), d / 2 + CUT_PROUD],
          [w / 2, h, d / 2 + CUT_PROUD],
        ],
        [
          [-w / 2, h, d / 2 + CUT_PROUD],
          [w / 2, h + 0.08, d / 2 + CUT_PROUD],
        ],
      ]
    : [];
  return (
    <group>
      {/* the basin (concrete tub), its inside face, the water */}
      <mesh material={mats.basin} position={[0, 0.04, 0]} receiveShadow>
        <boxGeometry args={[w, 0.08, d]} />
      </mesh>
      <mesh material={mats.basinIn} position={[0, T.basinH / 2, -d / 2 + P / 2]} receiveShadow>
        <boxGeometry args={[w, T.basinH, P]} />
      </mesh>
      {inside ? (
        <mesh material={mats.water} position={[0, (waterY + 0.08) / 2, 0]}>
          <boxGeometry args={[w - 2 * P - 0.01, waterY - 0.08, d - 2 * P - 0.01]} />
        </mesh>
      ) : null}
      {/* back panel; side panels: louvers low, solid above */}
      <mesh material={mats.casing} position={[0, (h + T.basinH) / 2, -d / 2 + P / 2]} castShadow receiveShadow>
        <boxGeometry args={[w, h - T.basinH, P]} />
      </mesh>
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh material={mats.casing} position={[s * (w / 2 - P / 2), T.basinH / 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[P, T.basinH, d]} />
          </mesh>
          <mesh
            material={mats.casing}
            position={[s * (w / 2 - P / 2), (T.louverTop + h) / 2, 0]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[P, h - T.louverTop, d]} />
          </mesh>
          {[...Array(6).keys()].map((i) => (
            <mesh
              key={i}
              geometry={geo.slat}
              material={mats.louver}
              position={[s * (w / 2 - 0.02), T.basinH + 0.1 + i * 0.17, 0]}
              rotation={[0, 0, s * 0.6]}
              castShadow
            />
          ))}
          {/* steel corner posts, standing POST_PROUD clear of the panels' outer faces (flush faces z-fought: No. 013 flicker) */}
          <mesh material={mats.steel} position={[s * (w / 2 - 0.04 + POST_PROUD), h / 2, -d / 2 + 0.04 - POST_PROUD]}>
            <boxGeometry args={[0.08, h, 0.08]} />
          </mesh>
          <mesh
            material={mats.steel}
            position={[s * (w / 2 - 0.04 + POST_PROUD), h / 2, d / 2 - 0.04 + POST_PROUD]}
            visible={!open}
          >
            <boxGeometry args={[0.08, h, 0.08]} />
          </mesh>
        </group>
      ))}
      {/* the front panel (louvers low): shrinks top-down as the cut opens */}
      {panelTop > 0.01 ? (
        <group>
          <mesh
            material={mats.casing}
            position={[0, Math.min(panelTop, T.basinH) / 2, d / 2 - P / 2]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[w, Math.min(panelTop, T.basinH), P]} />
          </mesh>
          {panelTop > T.louverTop ? (
            <mesh
              material={mats.casing}
              position={[0, (T.louverTop + panelTop) / 2, d / 2 - P / 2]}
              castShadow
              receiveShadow
            >
              <boxGeometry args={[w, panelTop - T.louverTop, P]} />
            </mesh>
          ) : null}
          {[...Array(6).keys()]
            .filter((i) => T.basinH + 0.1 + i * 0.17 < panelTop)
            .map((i) => (
              <mesh
                key={i}
                material={mats.louver}
                position={[0, T.basinH + 0.1 + i * 0.17, d / 2 - 0.02]}
                rotation={[-0.6, 0, 0]}
                castShadow
              >
                <boxGeometry args={[w - 0.2, 0.16, 0.04]} />
              </mesh>
            ))}
        </group>
      ) : null}
      {/* the cut: hatched bands on the side panels' front edges and the deck's front edge, ink round them */}
      {open ? (
        <group>
          {/* the bands stand CUT_PROUD in front of the side panels' front faces, so the hatch never fights the casing */}
          <Band a={[-w / 2, Math.max(panelTop, 0), d / 2 - 0.004]} b={[-w / 2 + P, h, d / 2 + CUT_PROUD]} mat={mats.cut} />
          <Band a={[w / 2 - P, Math.max(panelTop, 0), d / 2 - 0.004]} b={[w / 2, h, d / 2 + CUT_PROUD]} mat={mats.cut} />
          <CutOutline rects={cutRects} thickness={ink} />
        </group>
      ) : null}
      {/* fill pack (translucent, so the rain shows), drift eliminators, spray header and nozzles */}
      {inside ? (
        <>
          <mesh material={mats.fill} position={[0, (T.fillBot + T.fillTop) / 2, 0]} renderOrder={6}>
            <boxGeometry args={[w - 2 * P - 0.02, T.fillTop - T.fillBot, d - 2 * P - 0.02]} />
          </mesh>
          <mesh material={mats.drift} position={[0, T.driftY + 0.1, -0.1]} castShadow>
            <boxGeometry args={[w - 2 * P - 0.02, 0.18, d - 2 * P - 0.25]} />
          </mesh>
          <mesh material={mats.pipe} position={[0, T.sprayY, -d / 2 + 0.3]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.08, 0.08, w - 0.3, 14]} />
          </mesh>
          {[...Array(5).keys()].map((i) => {
            const x = (-0.4 + i * 0.2) * w * 0.85;
            return (
              <group key={i}>
                <mesh material={mats.pipe} position={[x, T.sprayY, 0]} rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.045, 0.045, d - 0.6, 10]} />
                </mesh>
                {[-1, 0, 1].map((k) => (
                  <mesh key={k} material={mats.nozzle} position={[x, T.sprayY - 0.07, k * 0.33 * d * 0.8]}>
                    <coneGeometry args={[0.05, 0.08, 10]} />
                  </mesh>
                ))}
              </group>
            );
          })}
          {drops}
          {ripples}
          {dots}
          {film}
          {wisps}
          {/* lap ticks on the basin's back wall, above the water */}
          {[...Array(6).keys()].map((i) => (
            <mesh
              key={`tk${i}`}
              material={i < Math.round(laps) ? mats.tickOn : mats.tickOff}
              position={[-w / 2 + 0.45 + i * 0.16, T.basinH - 0.12, -d / 2 + P + 0.006]}
            >
              <boxGeometry args={[0.04, 0.14, 0.01]} />
            </mesh>
          ))}
          {/* makeup: the pipe in at the back-left, the float on its arm, the fresh stream when open */}
          <mesh
            material={mats.pipe}
            position={[TOWER_MAKEUP_IN[0], TOWER_MAKEUP_IN[1], -d / 2 + 0.25]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.05, 0.05, 0.5, 12]} />
          </mesh>
          <mesh material={mats.nozzle} position={[TOWER_MAKEUP_IN[0], TOWER_MAKEUP_IN[1], -d / 2 + 0.52]}>
            <boxGeometry args={[0.12, 0.12, 0.1]} />
          </mesh>
          <InkLine
            points={[
              [TOWER_MAKEUP_IN[0], TOWER_MAKEUP_IN[1], -d / 2 + 0.55],
              [TOWER_MAKEUP_IN[0] + 0.45, floatY, -d / 2 + 0.75],
            ]}
            closed={false}
            thickness={0.018}
            color={REAL.steel}
          />
          <mesh material={mats.float} position={[TOWER_MAKEUP_IN[0] + 0.5, floatY, -d / 2 + 0.78]}>
            <sphereGeometry args={[0.09, 16, 12]} />
          </mesh>
          {mk > 0.01 ? (
            <>
              <mesh
                material={mats.fresh}
                position={[TOWER_MAKEUP_IN[0], (TOWER_MAKEUP_IN[1] - 0.06 + waterY) / 2, -d / 2 + 0.56]}
                scale={[0.4 + 0.6 * mk, 1, 0.4 + 0.6 * mk]}
                renderOrder={8}
              >
                <cylinderGeometry args={[0.045, 0.055, TOWER_MAKEUP_IN[1] - 0.06 - waterY, 10, 1, true]} />
              </mesh>
              <PushArrow
                kind="neutral"
                mood={mood}
                position={[
                  TOWER_MAKEUP_IN[0] + 0.22,
                  TOWER_MAKEUP_IN[1] + 0.05 - ((clock / 0.9) % 1) * 0.3,
                  -d / 2 + 0.6,
                ]}
                direction={[0, -1, 0]}
                normal={SECTION_ANGLE}
                length={0.3}
                radius={0.025}
                node={false}
                glow={mk}
              />
            </>
          ) : null}
        </>
      ) : null}
      {/* the top deck, the stack (its front half cut away), the fan on a beam */}
      <group position={[0, h, 0]}>
        <mesh geometry={open ? geo.deckHalf : geo.deckWhole} material={mats.casing} castShadow receiveShadow />
        <mesh
          geometry={open ? geo.stackHalf : geo.stackWhole}
          material={mats.casingDark}
          position={[0, 0.08 + T.stackH / 2, 0]}
          castShadow
          receiveShadow
        />
        {open ? (
          <>
            {[-1, 1].map((s) => (
              <InkLine
                key={s}
                points={[
                  [s * T.stackR, 0.08, 0],
                  [s * T.stackR * 1.02, 0.08 + T.stackH, 0],
                ]}
                closed={false}
                thickness={ink}
              />
            ))}
          </>
        ) : null}
        <mesh material={mats.steel} position={[0, 0.25, 0]}>
          <boxGeometry args={[T.stackR * 2, 0.08, 0.12]} />
        </mesh>
        <mesh material={mats.hub} position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.25, 16]} />
        </mesh>
        <group position={[0, 0.42, 0]}>
          <AxialFan mats={mats} radius={T.stackR * 0.94} turns={fanTurns} rate={fanRate} />
        </group>
        {/* the guard ring on the stack's lip */}
        <mesh material={mats.steel} position={[0, 0.08 + T.stackH, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[T.stackR * 1.02, 0.025, 6, 40, open ? Math.PI : Math.PI * 2]} />
        </mesh>
      </group>
      {air}
    </group>
  );
};

export type DryCoolerProps = {
  mood?: Mood;
  /** The near face cut away, 0 → 1 (top-down). Default 1. */
  cut?: number;
  /** Fans' turn so far (rev) and their rate (rev/s). */
  fanTurns?: number;
  fanRate?: number;
  clock: number;
  /** The coil's tubes carry warm water, 0 → 1 (the orange in them; dots travel when > 0). */
  warm?: number;
  /** Orange warm air rising off the top, 0 → 1. */
  warmAir?: number;
  /** Neutral air drawn in from below, 0 → 1. */
  airIn?: number;
  ink?: number;
  seed?: string;
};

/** The near tube run's ends (local), for the scene's pipes: inlet (left) and outlet (right) at the back. */
export const DRY_INLET: V3 = [-DRY_DC.l / 2 - 0.1, 1.25, -0.6];
export const DRY_OUTLET: V3 = [DRY_DC.l / 2 + 0.1, 1.1, -0.6];

/** An air-cooled dry cooler (see the file comment). */
export const DryCooler: React.FC<DryCoolerProps> = ({
  mood = 'day',
  cut = 1,
  fanTurns = 0,
  fanRate = 0,
  clock,
  warm = 1,
  warmAir = 0,
  airIn = 0,
  ink = INK,
  seed = 'dry',
}) => {
  const mats = useUnitMats();
  const {l, d, legs, h, coilBot, coilTop, fanR, fans} = DRY_DC;
  const c = Math.max(0, Math.min(1, cut));
  const open = c > 0.001;
  const P = 0.05;
  const panelTop = legs + (h - legs) * (1 - c);
  const fanX = (i: number) => (i - (fans - 1) / 2) * (l / fans);
  const wk = Math.max(0, Math.min(1, warm));
  // tube runs (serpentine across the coil, seen in the cut): 4 rows
  const rows = [0, 1, 2, 3].map((i) => coilBot + 0.06 + i * ((coilTop - coilBot - 0.12) / 3));
  const tubeZ = d / 2 - 0.25;
  const coreR = 0.022;
  const flowDots: React.ReactNode[] = [];
  if (wk > 0.01)
    rows.forEach((y, ri) => {
      const dir = ri % 2 ? -1 : 1;
      for (let k = 0; k < 4; k++) {
        const u = (((clock / 2.2 + k / 4 + ri * 0.13) % 1) + 1) % 1;
        const x = dir * (-l / 2 + 0.2 + u * (l - 0.4));
        flowDots.push(<GlowNode key={`fd${ri}-${k}`} at={[x, y, tubeZ + 0.04]} radius={coreR * 1.9} dot glow={wk} />);
      }
    });
  const rising: React.ReactNode[] = [];
  if (warmAir > 0.01)
    for (let i = 0; i < fans; i++)
      for (let j = 0; j < 2; j++) {
        const rate = 1 + 0.4 * Math.max(0, fanRate - 1);
        const u = ((((clock * rate) / 1.6 + j * 0.5 + i * 0.21) % 1) + 1) % 1;
        rising.push(
          <PushArrow
            key={`wa${i}${j}`}
            position={[fanX(i) + (j - 0.5) * 0.4 + 0.12 * Math.sin(u * 7 + i), h + 0.45 + u * 2.4, 0.1]}
            direction={[0, 1, 0]}
            normal={SECTION_ANGLE}
            length={0.55}
            radius={0.032}
            node={false}
            glow={warmAir * smooth(0, 0.15, u) * (1 - smooth(0.75, 1, u))}
          />,
        );
      }
  const inArrows: React.ReactNode[] = [];
  if (airIn > 0.01)
    for (let i = 0; i < fans; i++) {
      const u = (((clock / 1.4 + i * 0.33) % 1) + 1) % 1;
      inArrows.push(
        <PushArrow
          key={`in${i}`}
          kind="neutral"
          mood={mood}
          position={[fanX(i), 0.05 + u * (coilBot - 0.15), d / 2 - 0.3]}
          direction={[0, 1, 0]}
          normal={SECTION_ANGLE}
          length={0.4}
          radius={0.03}
          node={false}
          glow={airIn * smooth(0, 0.2, u) * (1 - smooth(0.8, 1, u))}
        />,
      );
    }
  void seed;
  return (
    <group>
      {/* legs and the bottom frame */}
      {[-1, 1].flatMap((a) =>
        [-1, 1].map((b) => (
          <mesh
            key={`${a}${b}`}
            material={mats.steel}
            position={[a * (l / 2 - 0.05), legs / 2, b * (d / 2 - 0.05)]}
            castShadow
          >
            <boxGeometry args={[0.08, legs, 0.08]} />
          </mesh>
        )),
      )}
      {/* casing: back, ends; front panel shrinking top-down when cut */}
      <mesh material={mats.casing} position={[0, (legs + h) / 2, -d / 2 + P / 2]} castShadow receiveShadow>
        <boxGeometry args={[l, h - legs, P]} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh
          key={s}
          material={mats.casing}
          position={[s * (l / 2 - P / 2), (legs + h) / 2, 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[P, h - legs, d]} />
        </mesh>
      ))}
      {panelTop > legs + 0.01 ? (
        <mesh material={mats.casing} position={[0, (legs + panelTop) / 2, d / 2 - P / 2]} castShadow receiveShadow>
          <boxGeometry args={[l, panelTop - legs, P]} />
        </mesh>
      ) : null}
      {/* the coil: finned slab (translucent when cut, so the tubes show) */}
      <mesh material={open ? mats.finsCut : mats.fins} position={[0, (coilBot + coilTop) / 2, 0]} renderOrder={6}>
        <boxGeometry args={[l - 2 * P - 0.02, coilTop - coilBot, d - 2 * P - 0.02]} />
      </mesh>
      {open
        ? rows.map((y, i) => (
            <group key={i}>
              {/* the tube (steel) with the warm water's orange core in it */}
              <mesh material={mats.pipe} position={[0, y, tubeZ]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.035, 0.035, l - 0.2, 10]} />
              </mesh>
              <GlowSegment
                a={[-l / 2 + 0.12, y, tubeZ + 0.03]}
                b={[l / 2 - 0.12, y, tubeZ + 0.03]}
                radius={coreR}
                glow={wk}
              />
              {i < rows.length - 1 ? (
                <GlowSegment
                  a={[(i % 2 ? -1 : 1) * (l / 2 - 0.12), y, tubeZ + 0.03]}
                  b={[(i % 2 ? -1 : 1) * (l / 2 - 0.12), rows[i + 1], tubeZ + 0.03]}
                  radius={coreR}
                  glow={wk}
                />
              ) : null}
            </group>
          ))
        : null}
      {flowDots}
      {/* fan deck and the fans in their shrouds */}
      <mesh material={mats.casing} position={[0, h + 0.03, 0]} castShadow receiveShadow>
        <boxGeometry args={[l, 0.06, d]} />
      </mesh>
      {[...Array(fans).keys()].map((i) => (
        <group key={i} position={[fanX(i), h + 0.06, 0]}>
          <mesh material={mats.casingDark} position={[0, 0.18, 0]} castShadow>
            <cylinderGeometry args={[fanR * 1.04, fanR * 1.04, 0.36, 32, 1, true]} />
          </mesh>
          <group position={[0, 0.22, 0]}>
            <AxialFan
              mats={mats}
              radius={fanR}
              blades={5}
              turns={fanTurns * (1 + 0.05 * i) + i * 0.13}
              rate={fanRate}
            />
          </group>
          <mesh material={mats.steel} position={[0, 0.37, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[fanR * 1.04, 0.015, 6, 32]} />
          </mesh>
        </group>
      ))}
      {open ? (
        <>
          <Band a={[-l / 2, panelTop, d / 2 - 0.004]} b={[-l / 2 + P, h, d / 2 + CUT_PROUD]} mat={mats.cut} />
          <Band a={[l / 2 - P, panelTop, d / 2 - 0.004]} b={[l / 2, h, d / 2 + CUT_PROUD]} mat={mats.cut} />
          <CutOutline
            rects={[
              [
                [-l / 2, panelTop, d / 2 + CUT_PROUD],
                [-l / 2 + P, h, d / 2 + CUT_PROUD],
              ],
              [
                [l / 2 - P, panelTop, d / 2 + CUT_PROUD],
                [l / 2, h, d / 2 + CUT_PROUD],
              ],
            ]}
            thickness={ink}
          />
        </>
      ) : null}
      {rising}
      {inArrows}
    </group>
  );
};
