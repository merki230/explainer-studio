import {useThree} from '@react-three/fiber';
import React, {useLayoutEffect, useMemo, useRef} from 'react';
import * as THREE from 'three';
import {CITY, HIGHWAY, MOODS, section, STREET, type Mood} from '../../theme';
import {raw, roundedBox} from '../plaster';
import {RoadSign, type RoadSignKind} from '../real/RoadSigns';
import {CutOutline, cutMaterial, INK} from './cutLook';


/*
 * The car slice's city street (No. 006, `car-slice` `road: 'city'`): the No. 002 lane block re-dressed
 * as a US city street seen across, on a cut ground block. World metres; the lane runs along x; the
 * near cut face at z = +ROAD.z. From the cut: the double yellow centre line by the cut, the lane, the
 * curb and a sidewalk (its own cut end), low storefronts with blank awnings at the back of the
 * sidewalk. Things that arrive with the road (stop lines, post-mounted signals, signs, storefronts)
 * slide in through the block's ends: they are clipped to the block, never popped in.
 *
 *  - A corner: a white stop line across the lane (12 in) and, just past it on the far sidewalk, a
 *    post-mounted US signal (black housing and backplate, three 12 in lenses under cap visors, facing
 *    the oncoming traffic). The lit lens is flat emissive (`section.signalRed` / `signalGreen`), never
 *    bloomed; the yellow is never lit here.
 *  - Signs: `RoadSign`s on the far sidewalk, facing the traffic.
 */

export const CITY_ROAD = {
  /** The block: half-length along x, the road's half-width (its near face is the cut), its depth. */
  x: 5.0,
  z: 1.75,
  depth: 0.7,
  /** The sidewalk: from the curb back to here, its top above the road. */
  back: -3.55,
  curb: 0.15,
  /** The double yellow centre line's two stripes (z centres) and the stop line's width. */
  yellow: [1.39, 1.51],
  stop: 0.3,
  /** The signal post's place across the street, and how far past the stop line it stands. */
  postZ: -2.35,
  postPast: 3.0,
};

export type CityCorner = {
  /** The stop line's centre (x, world). */
  x: number;
  /** Draw the stop line (default true). */
  line?: boolean;
  /** The signal's lit lens: 'red', 'green' or 'off'; null for no signal at this corner. */
  signal?: 'red' | 'green' | 'off' | null;
  /** How far past the stop line the signal's post stands (m, default `CITY_ROAD.postPast`). */
  post?: number;
};

export type CitySign = {x: number; kind: RoadSignKind; text: string[]};

export type CarCityRoadProps = {
  mood: Mood;
  /** How far the road has moved (metres, + toward +x): the lane paint and the storefronts slide with it. */
  scroll: number;
  /** Which way the traffic in this lane drives: −1 toward −x (the default), 1 toward +x. Signals and signs face it. */
  dir?: 1 | -1;
  corners?: CityCorner[];
  signs?: CitySign[];
  /** Low storefronts at the back of the sidewalk (default true). */
  storefronts?: boolean;
  /** × the cut edges' ink thickness. */
  inkScale?: number;
  /**
   * The block's ends along x (default ±`CITY_ROAD.x`). A longer run ahead of the car lets a corner and its
   * signal be seen from further off; the +x end is the cut end.
   */
  from?: number;
  to?: number;
};

const R = CITY_ROAD;

/** The lane's paint on city asphalt: grain, the double yellow by the cut (u along x, v across). */
const laneTexture = () => {
  const W = 512;
  const H = 256;
  const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [a, y] = [hex(CITY.asphalt), hex(STREET.centreLine)];
  const data = new Uint8Array(W * H * 4);
  for (let j = 0; j < H; j++) {
    // the box's top face runs v from the near face (+z) at 0 to the back at 1
    const z = R.z - ((j + 0.5) / H) * 2 * R.z;
    for (let i = 0; i < W; i++) {
      const g = ((i * 73 + j * 151) % 17) - 8;
      const paint = R.yellow.some((c) => Math.abs(z - c) < 0.05);
      const c = paint ? y : a.map((v) => v + g * 0.8);
      const o = (j * W + i) * 4;
      data[o] = c[0];
      data[o + 1] = c[1];
      data[o + 2] = c[2];
      data[o + 3] = 255;
    }
  }
  const t = new THREE.DataTexture(data, W, H, THREE.RGBAFormat);
  t.wrapS = THREE.RepeatWrapping;
  t.magFilter = THREE.LinearFilter;
  t.minFilter = THREE.LinearFilter;
  t.colorSpace = THREE.SRGBColorSpace;
  t.needsUpdate = true;
  return t;
};

/** Sidewalk slabs: concrete with a joint every 1.5 m (u along x). */
const walkTexture = () => {
  const W = 256;
  const H = 8;
  const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const c0 = hex(STREET.concrete);
  const data = new Uint8Array(W * H * 4);
  for (let j = 0; j < H; j++)
    for (let i = 0; i < W; i++) {
      const joint = i < 3;
      const g = ((i * 37 + j * 91) % 11) - 5;
      const c = c0.map((v) => (joint ? v * 0.78 : v + g * 0.6));
      const o = (j * W + i) * 4;
      data[o] = c[0];
      data[o + 1] = c[1];
      data[o + 2] = c[2];
      data[o + 3] = 255;
    }
  const t = new THREE.DataTexture(data, W, H, THREE.RGBAFormat);
  t.wrapS = THREE.RepeatWrapping;
  t.magFilter = THREE.LinearFilter;
  t.minFilter = THREE.LinearFilter;
  t.colorSpace = THREE.SRGBColorSpace;
  t.needsUpdate = true;
  return t;
};

/** Clips every material under it to the block's length (things slide in through the ends). */
const ClipToBlock: React.FC<{planes: THREE.Plane[]; children: React.ReactNode}> = ({planes, children}) => {
  const ref = useRef<THREE.Group>(null);
  useLayoutEffect(() => {
    ref.current?.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      const ms = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      for (const m of ms) if (m.clippingPlanes !== planes) m.clippingPlanes = planes;
    });
  });
  return <group ref={ref}>{children}</group>;
};

/** A post-mounted US traffic signal (its foot at the origin, facing +x). */
const PostSignal: React.FC<{state: 'red' | 'green' | 'off'; mood: Mood; mats: Record<string, THREE.Material>}> = ({
  state,
  mood,
  mats,
}) => {
  const lens = useMemo(
    () =>
      (['red', 'yellow', 'green'] as const).map(
        (c) =>
          new THREE.MeshStandardMaterial({
            color: raw(c === 'red' ? CITY.lensRed : c === 'yellow' ? CITY.lensYellow : CITY.lensGreen),
            roughness: 0.25,
            emissive: raw(c === 'red' ? section.signalRed : c === 'green' ? section.signalGreen : CITY.lensYellow),
            emissiveIntensity: 0,
          }),
      ),
    [],
  );
  const e = MOODS[mood].exposure;
  lens[0].emissiveIntensity = state === 'red' ? 1.1 / e : 0;
  lens[1].emissiveIntensity = 0;
  lens[2].emissiveIntensity = state === 'green' ? 1.1 / e : 0;
  const L = 0.305; // a 12 in lens
  const headH = 1.05;
  const y0 = 2.45;
  return (
    <group>
      <mesh material={mats.mast} position={[0, (y0 + 0.1) / 2, 0]} castShadow>
        <cylinderGeometry args={[0.055, 0.065, y0 + 0.1, 16]} />
      </mesh>
      <mesh material={mats.mast} position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.13, 0.15, 0.08, 16]} />
      </mesh>
      <group position={[0.06, y0 + headH / 2, 0]}>
        {/* the backplate, the housing */}
        <mesh geometry={roundedBox(0.02, headH + 0.22, 0.62, 0.01)} material={mats.housing} position={[-0.11, 0, 0]} castShadow />
        <mesh geometry={roundedBox(0.22, headH, 0.4, 0.03)} material={mats.housing} castShadow />
        {[0, 1, 2].map((k) => {
          const y = (1 - k) * 0.34;
          return (
            <group key={k} position={[0.111, y, 0]}>
              <mesh material={lens[k]} rotation={[0, Math.PI / 2, 0]}>
                <circleGeometry args={[L / 2 - 0.01, 32]} />
              </mesh>
              {/* a cap visor over the top of the lens (the lens stays in view from the side) */}
              <mesh material={mats.housing} position={[0.09, 0.03, 0]} rotation={[0, 0, 0]}>
                <cylinderGeometry args={[L / 2 + 0.01, L / 2 + 0.01, 0.18, 24, 1, true, -Math.PI / 2, Math.PI]} />
              </mesh>
            </group>
          );
        })}
      </group>
    </group>
  );
};

/** The city street (see the file comment). */
export const CarCityRoad: React.FC<CarCityRoadProps> = ({
  mood,
  scroll,
  dir = -1,
  corners = [],
  signs = [],
  storefronts = true,
  inkScale = 1,
  from = -CITY_ROAD.x,
  to = CITY_ROAD.x,
}) => {
  const cx = (from + to) / 2;
  const len = to - from;
  const gl = useThree((s) => s.gl);
  gl.localClippingEnabled = true;
  const m = MOODS[mood];
  const planes = useMemo(
    () => [new THREE.Plane(new THREE.Vector3(1, 0, 0), -from), new THREE.Plane(new THREE.Vector3(-1, 0, 0), to)],
    [from, to],
  );
  const mats = useMemo(() => {
    const lane = new THREE.MeshStandardMaterial({color: raw('#ffffff'), roughness: 0.92, map: laneTexture()});
    lane.map!.repeat.set(len / 7.6, 1);
    const walk = new THREE.MeshStandardMaterial({color: raw('#ffffff'), roughness: 0.9, map: walkTexture()});
    walk.map!.repeat.set(len / 1.5, 1);
    return {
      lane,
      walk,
      curb: new THREE.MeshStandardMaterial({color: raw(STREET.concrete), roughness: 0.85}),
      earth: new THREE.MeshStandardMaterial({color: raw(m.earth), roughness: 1}),
      cut: cutMaterial(),
      paint: new THREE.MeshStandardMaterial({color: raw(HIGHWAY.lineWhite), roughness: 0.7, clippingPlanes: planes}),
      mast: new THREE.MeshStandardMaterial({color: raw(CITY.mast), roughness: 0.5, metalness: 0.4, clippingPlanes: planes}),
      housing: new THREE.MeshStandardMaterial({color: raw(CITY.signalHousing), roughness: 0.55, clippingPlanes: planes}),
      facades: CITY.facades.map((c) => new THREE.MeshStandardMaterial({color: raw(c), roughness: 0.9, clippingPlanes: planes})),
      awnings: CITY.awnings.map((c) => new THREE.MeshStandardMaterial({color: raw(c), roughness: 0.85, clippingPlanes: planes})),
      window: new THREE.MeshStandardMaterial({color: raw(CITY.window), roughness: 0.2, metalness: 0.3, clippingPlanes: planes}),
      roof: new THREE.MeshStandardMaterial({color: raw(CITY.roof), roughness: 0.9, clippingPlanes: planes}),
    };
  }, [m.earth, planes, len]);
  // the paint and the slabs move with the road (u along x)
  mats.lane.map!.offset.x = -scroll / 7.6;
  mats.walk.map!.offset.x = -scroll / 1.5;
  const ink = INK * inkScale;
  // storefronts: three 4 m shops repeating every 12 m, sliding with the road
  const SHOP = 4;
  const PERIOD = 12;
  const visibleShops = storefronts
    ? [...Array(9).keys()]
        .map((k) => {
          const base = ((scroll % PERIOD) + PERIOD) % PERIOD;
          return {x: -PERIOD + base + (k - 2) * SHOP, k: (((k - 2) % 3) + 3) % 3};
        })
        .filter((s) => s.x > from - SHOP && s.x < to + SHOP)
    : [];
  const face = dir < 0 ? 1 : -1; // signals and signs face the oncoming traffic (+x when it drives toward −x)
  return (
    <group>
      {/* the road on its cut ground block (cut on the near face and the +x end) */}
      <mesh
        position={[cx, -R.depth / 2, 0]}
        material={[mats.cut, mats.earth, mats.lane, mats.earth, mats.cut, mats.earth]}
        receiveShadow
      >
        <boxGeometry args={[len, R.depth, 2 * R.z]} />
      </mesh>
      {/* the sidewalk behind the curb, cut at its +x end */}
      <mesh
        position={[cx, (R.curb - R.depth) / 2, (R.back - R.z) / 2]}
        material={[mats.cut, mats.earth, mats.walk, mats.earth, mats.curb, mats.earth]}
        receiveShadow
        castShadow
      >
        <boxGeometry args={[len, R.curb + R.depth, -R.back - R.z]} />
      </mesh>
      <CutOutline
        thickness={ink}
        rects={[
          [
            [from, -R.depth, R.z],
            [to, 0, R.z],
          ],
          [
            [to, -R.depth, -R.z],
            [to, 0, R.z],
          ],
          [
            [to, -R.depth, R.back],
            [to, R.curb, -R.z],
          ],
        ]}
      />
      {/* stop lines and the corner signals */}
      {corners.map((c, i) => (
        <group key={i}>
          {c.line !== false ? (
            <mesh position={[c.x, 0.003, (R.yellow[0] - 0.06 - R.z) / 2]} rotation={[-Math.PI / 2, 0, 0]} material={mats.paint}>
              <planeGeometry args={[R.stop, R.yellow[0] - 0.06 + R.z]} />
            </mesh>
          ) : null}
          {c.signal ? (
            <group position={[c.x + dir * (c.post ?? R.postPast), R.curb, R.postZ]} rotation={[0, face > 0 ? 0 : Math.PI, 0]}>
              <PostSignal state={c.signal} mood={mood} mats={{mast: mats.mast, housing: mats.housing}} />
            </group>
          ) : null}
        </group>
      ))}
      <ClipToBlock planes={planes}>
        {signs.map((s, i) => (
          <group key={i} position={[s.x, R.curb, R.postZ - 0.25]} rotation={[0, face > 0 ? Math.PI / 2 : -Math.PI / 2, 0]}>
            <RoadSign mood={mood} kind={s.kind} text={s.text} position={[0, 0, 0]} />
          </group>
        ))}
      </ClipToBlock>
      {/* storefronts at the back of the sidewalk: facade, shop window, blank awning, parapet */}
      {visibleShops.map((s, i) => {
        const h = 3.3 + 0.35 * s.k;
        return (
          <group key={i} position={[s.x + SHOP / 2, R.curb, R.back - 0.5]}>
            <mesh material={mats.facades[s.k % mats.facades.length]} position={[0, h / 2, 0]} castShadow receiveShadow>
              <boxGeometry args={[SHOP - 0.04, h, 1.0]} />
            </mesh>
            <mesh material={mats.window} position={[0.15, 1.25, 0.505]}>
              <planeGeometry args={[SHOP - 1.6, 1.7]} />
            </mesh>
            <mesh material={mats.window} position={[-SHOP / 2 + 0.55, 1.05, 0.505]}>
              <planeGeometry args={[0.8, 2.1]} />
            </mesh>
            <mesh
              material={mats.awnings[s.k % mats.awnings.length]}
              position={[0, 2.55, 0.85]}
              rotation={[0.35, 0, 0]}
              castShadow
            >
              <boxGeometry args={[SHOP - 0.3, 0.04, 0.75]} />
            </mesh>
            <mesh material={mats.roof} position={[0, h + 0.03, 0]}>
              <boxGeometry args={[SHOP - 0.04, 0.06, 1.0]} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};
