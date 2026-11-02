import React, {useEffect, useMemo} from 'react';
import {random, useCurrentFrame, useVideoConfig} from 'remotion';
import * as THREE from 'three';
import {STREET, theme} from '../theme';
import {raw, softTexture} from './plaster';

type V3 = [number, number, number];

const smooth = (a: number, b: number, x: number) => {
  const u = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return u * u * (3 - 2 * u);
};
const wrap = (x: number, lo: number, hi: number) => lo + ((((x - lo) % (hi - lo)) + (hi - lo)) % (hi - lo));

/**
 * A plaster-white air particle: unlit and a touch brighter than lit plaster, so it reads as
 * dust catching the light (never blooms: no `glow` flag).
 */
const moteMaterial = (opacity: number) => {
  const m = new THREE.MeshBasicMaterial({
    color: raw(theme.plasterGlass),
    transparent: true,
    depthWrite: false,
    opacity,
  });
  m.color.multiplyScalar(1.35);
  return m;
};
const MOTE = new THREE.SphereGeometry(1, 8, 6);

/**
 * Dust motes drifting slowly in a spot light's beam: seeded positions inside `box`, a slow fall
 * and sway, wrapping top to bottom; each mote shows only while it is inside the cone (it fades
 * at the beam's edge), so they follow the light if it drifts.
 */
export const DustMotes: React.FC<{
  /** The light's position and where it points. */
  from: V3;
  to: V3;
  /** Cone half-angle of the beam (radians; MuseumLights' key is 0.5). */
  angle?: number;
  /** Where motes live: [min corner, max corner] in world units. */
  box?: [V3, V3];
  count?: number;
  /** Mote radius in world units. */
  size?: number;
  opacity?: number;
  seed?: string;
  /** Seconds added to the scene time (the scene's start in the video, for continuity across cuts). */
  clockOffset?: number;
}> = ({
  from,
  to,
  angle = 0.5,
  box = [
    [-1.5, 0.5, -0.6],
    [1.5, 2.7, 1.8],
  ],
  count = 40,
  size = 0.0065,
  opacity = 0.42,
  seed = 'dust',
  clockOffset = 0,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps + clockOffset;
  const material = useMemo(() => moteMaterial(opacity), [opacity]);
  useEffect(() => () => material.dispose(), [material]);
  const motes = useMemo(
    () =>
      new Array(count).fill(0).map((_, i) => {
        const r = (k: string) => random(`${seed}-${k}-${i}`);
        return {
          p: [r('x'), r('y'), r('z')],
          fall: 0.012 + 0.02 * r('f'),
          sway: 0.04 + 0.05 * r('s'),
          period: 7 + 8 * r('p'),
          ph: r('ph') * Math.PI * 2,
          scale: 0.6 + 0.8 * r('k'),
        };
      }),
    [count, seed],
  );
  const [lo, hi] = box;
  const L = new THREE.Vector3(...from);
  const axis = new THREE.Vector3(...to).sub(L).normalize();
  const cosEdge = Math.cos(angle * 0.95);
  const cosIn = Math.cos(angle * 0.6);
  const v = new THREE.Vector3();
  return (
    <group>
      {motes.map((m, i) => {
        const w = (Math.PI * 2 * t) / m.period + m.ph;
        const x = lo[0] + m.p[0] * (hi[0] - lo[0]) + m.sway * Math.sin(w);
        const y = wrap(lo[1] + m.p[1] * (hi[1] - lo[1]) - m.fall * t, lo[1], hi[1]);
        const z = lo[2] + m.p[2] * (hi[2] - lo[2]) + m.sway * 0.7 * Math.cos(w * 0.8);
        v.set(x, y, z).sub(L).normalize();
        const inBeam = smooth(cosEdge, cosIn, v.dot(axis));
        // fade in and out at the top and bottom of the box, so wrapping never pops
        const ends = smooth(lo[1], lo[1] + 0.25, y) * (1 - smooth(hi[1] - 0.25, hi[1], y));
        const s = size * m.scale * inBeam * ends;
        return <mesh key={i} geometry={MOTE} material={material} position={[x, y, z]} scale={s} visible={s > 1e-4} />;
      })}
    </group>
  );
};

/**
 * Steam rising from a cup: soft white wisps that rise, widen, sway and fade, in a slow loop.
 * The planes face +z (the museum cameras are always in front).
 */
export const Steam: React.FC<{
  /** Where the steam leaves the cup (centre of the rim). */
  position: V3;
  /** Number of wisps alive at once. */
  count?: number;
  /** Seconds a wisp lives. */
  life?: number;
  /** Rise over a wisp's life (units). */
  rise?: number;
  opacity?: number;
  clockOffset?: number;
}> = ({position, count = 7, life = 3.6, rise = 0.32, opacity = 0.2, clockOffset = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps + clockOffset;
  const mats = useMemo(
    () =>
      new Array(count).fill(0).map(() => {
        const m = new THREE.MeshBasicMaterial({
          map: softTexture(),
          color: raw(theme.plasterGlass),
          transparent: true,
          depthWrite: false,
          opacity: 0,
        });
        m.color.multiplyScalar(1.3);
        return m;
      }),
    [count],
  );
  useEffect(() => () => mats.forEach((m) => m.dispose()), [mats]);
  return (
    <group position={position}>
      {mats.map((m, i) => {
        const u = (((t / life + i / count) % 1) + 1) % 1;
        const n = Math.floor(t / life + i / count);
        const jitter = random(`steam-${i}-${n}`) - 0.5;
        const y = 0.02 + rise * u;
        const x = 0.025 * jitter + 0.03 * Math.sin(u * 5 + i * 1.7) * u;
        const s = 0.05 + 0.13 * u;
        m.opacity = opacity * smooth(0, 0.2, u) * (1 - smooth(0.45, 1, u));
        return (
          <mesh key={i} material={m} position={[x, y, 0.01 * i]} scale={[s, s * 1.3, 1]} renderOrder={4}>
            <planeGeometry args={[1, 1]} />
          </mesh>
        );
      })}
    </group>
  );
};

const PUFF = new THREE.PlaneGeometry(1, 1);
const TOKEN = new THREE.SphereGeometry(1, 14, 10);

/**
 * A water-vapour plume (No. 013): `Steam` scaled up for a cooling tower. Soft white puffs leave a round mouth, rise,
 * widen, drift downwind and fade, in a seeded loop on the video clock (every puff is a pure function of the time). The
 * plume itself stays white (it is water vapour, as it really is); `tokens` adds small `orange` heat tokens riding up
 * inside some puffs (the heat it carries, § 5: the system), fading high in the sky. The puffs face the fixed Section
 * angle (`facing`), so they read as round from every framing.
 */
const VAPOR_SHADE = raw(STREET.stream);
const VAPOR_WHITE = raw(theme.plasterGlass);

export const Plume: React.FC<{
  /** The centre of the mouth (the fan stack's top). */
  position: V3;
  /** Strength: 0 none, 1 a normal plume, up to 2 a thick, tall one (more puffs, bigger, more opaque, higher). */
  strength?: number;
  /** The mouth's radius (m). Default 1.4. */
  radius?: number;
  /** Rise over a puff's life at strength 1 (m). Default 9. */
  rise?: number;
  /** Seconds a puff lives. Default 6. */
  life?: number;
  /** Puffs alive at strength 2 (fewer below). Default 36. */
  count?: number;
  /** Downwind drift over a puff's life (m, +x). Default 2.5. */
  wind?: number;
  /** Peak opacity of a puff. Default 0.42. */
  opacity?: number;
  /** 0 → 1: share of puffs carrying an orange heat token (fading high up). Default 0. */
  tokens?: number;
  /** The token's radius (m). Default 0.09. */
  tokenSize?: number;
  /** Swell: the puffs born on a slow beat grow by this share (the plume "rises in pulses"). Default 0.15. */
  pulse?: number;
  /** Seconds between pulses. Default 2.4. */
  pulseEvery?: number;
  /** The direction the puffs face (default +z; a Section scene passes `SECTION_ANGLE`). */
  facing?: V3;
  seed?: string;
  clockOffset?: number;
  /**
   * The puffs' brightness multiplier (default 1.3, as `Steam`). A Section scene passes ≈ 0.95 / the mood's exposure so the
   * white survives the post pass's exposure (the sky gets the same compensation), and the plume reads against the sky.
   */
  tone?: number;
  /** The grey puffs' brightness relative to `tone` (default 0.95; ≈ 0.75 gives a plume with more body on a pale sky). */
  shade?: number;
}> = ({
  position,
  strength = 1,
  radius = 1.4,
  rise = 9,
  life = 6,
  count = 36,
  wind = 2.5,
  opacity = 0.42,
  tokens = 0,
  tokenSize = 0.09,
  pulse = 0.15,
  pulseEvery = 2.4,
  facing = [0, 0, 1],
  seed = 'plume',
  clockOffset = 0,
  tone = 1.3,
  shade = 0.95,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps + clockOffset;
  const mats = useMemo(
    () =>
      new Array(count).fill(0).map(() => {
        const m = new THREE.MeshBasicMaterial({
          map: softTexture(),
          // white puffs and pale cool-white shaded ones: the post pass clips a white puff to the sky's own brightness, so
          // the plume's body comes from the shaded ones; they stay a light blue-white (water vapour, never grey smoke)
          // and whiten as they rise (set per frame below)
          color: raw(theme.plasterGlass),
          transparent: true,
          depthWrite: false,
          opacity: 0,
        });
        m.color.multiplyScalar(tone);
        return m;
      }),
    [count, tone],
  );
  const tokenMat = useMemo(
    () => new THREE.MeshBasicMaterial({color: raw(theme.orange), transparent: true, depthWrite: false}),
    [],
  );
  useEffect(
    () => () => {
      mats.forEach((m) => m.dispose());
      tokenMat.dispose();
    },
    [mats, tokenMat],
  );
  const s = Math.max(0, Math.min(2, strength));
  // puffs alive: half the count at strength 1, all of them at 2; each puff keeps its place in the loop (spaced
  // i / count) and shows when its golden-ratio rank is under the share, so a keyed strength never jumps a puff
  const share = Math.min(1, s / 2);
  const q = useMemo(() => {
    const n = new THREE.Vector3(...facing).normalize();
    return new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), n);
  }, [facing[0], facing[1], facing[2]]); // eslint-disable-line react-hooks/exhaustive-deps
  const riseK = rise * (0.75 + 0.25 * s);
  const sizeK = 0.8 + 0.25 * s;
  const opK = opacity * Math.min(1, s * 1.2);
  return (
    <group position={position}>
      {mats.map((m, i) => {
        const rank = (i * 0.6180339887) % 1;
        const vis = 1 - smooth(share - 0.04, share + 0.04, rank);
        if (vis <= 0.001) {
          m.opacity = 0;
          return null;
        }
        const phase = t / life + i / count;
        const u = ((phase % 1) + 1) % 1;
        const n = Math.floor(phase);
        const r = (k: string) => random(`${seed}-${k}-${i}-${n}`);
        const born = t - u * life;
        const beat = 1 + pulse * Math.max(0, Math.sin((born / pulseEvery) * Math.PI * 2));
        const ang = r('a') * Math.PI * 2;
        const rad = radius * 0.7 * Math.sqrt(r('r'));
        // rise fast at the mouth, slower as it cools; widen; drift downwind
        const y = riseK * (1 - Math.pow(1 - u, 1.6)) * (0.85 + 0.3 * r('y'));
        const spread = 1 + 1.6 * u;
        const x = Math.cos(ang) * rad * spread + wind * u * u + 0.25 * Math.sin(u * 4 + i);
        const z = Math.sin(ang) * rad * spread * 0.6;
        const size = radius * (1.3 + 2.0 * u) * (0.75 + 0.5 * r('s')) * sizeK * beat;
        m.opacity = vis * opK * smooth(0, 0.06, u) * (1 - smooth(0.35, 1, u));
        // the shaded third: a pale cool white (`STREET.stream`) at the mouth, lifting to white as the puff rises and thins
        if (i % 3 === 1) {
          const k = Math.max(shade, 0.88) + (1 - Math.max(shade, 0.88)) * smooth(0.1, 0.7, u);
          m.color.copy(VAPOR_SHADE).lerp(VAPOR_WHITE, smooth(0.15, 0.75, u)).multiplyScalar(tone * k);
        }
        const tokenOn = tokens > 0 && r('t') < tokens;
        // a token shrinks away as it fades high up (one shared material, so the fade is its size)
        const tk = tokenOn ? vis * smooth(0.02, 0.15, u) * (1 - smooth(0.45, 0.8, u)) : 0;
        return (
          <group key={i} position={[x, y, z]}>
            <mesh geometry={PUFF} material={m} quaternion={q} scale={[size, size * 0.9, 1]} renderOrder={6} />
            {tk > 0.01 ? (
              <mesh
                geometry={TOKEN}
                material={tokenMat}
                scale={tokenSize * tk}
                userData={{glow: true}}
                renderOrder={7}
              />
            ) : null}
          </group>
        );
      })}
    </group>
  );
};
