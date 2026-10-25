import React, {useMemo} from 'react';
import {random} from 'remotion';
import * as THREE from 'three';
import {HIGHWAY} from '../../theme';
import {raw} from '../plaster';

type V3 = [number, number, number];

/**
 * One tire's spray source. `at` is the contact patch (world); `back` the unit direction (world x, z)
 * the water streams away in (where the road comes from, in the car's frame: the air moves that way);
 * `out` the unit direction away from the car's side. `strength(tBirth)` gives, for a droplet born at
 * that time, the fine `mist` (0 → 1: the film of water any rolling tire lifts) and the `spin` (0 → 1:
 * a driven wheel spinning faster than the road, throwing a dense, high rooster tail). Droplets keep
 * the strength they were born with, so a spray that stops on a key thins out over a life, not a frame.
 */
export type SprayEmitter = {
  at: V3;
  back: [number, number];
  out: [number, number];
  /** Road speed, m/s (how fast the droplets stream back). */
  speed: number;
  strength: (tBirth: number) => {mist: number; spin: number};
};

/** Droplets per tire, how long each lives (s). */
const N = 220;
const LIFE = 0.5;

/**
 * Tire spray on a wet road (No. 008): soft white-grey mist puffs (`HIGHWAY.spray`, never the system),
 * camera-facing, streaming back from each tire with the air, rising and spreading as they go, fading
 * over their life. Deterministic: every droplet's slot, phase and path come from seeded `random`, its
 * place is a pure function of `t`. Droplets past the section plane (`clipZ`) are not drawn: the cut
 * cuts the air too. Unlit, never bloomed; `exposure` keeps its grey the token's under the post pass.
 */
export const TireSpray: React.FC<{
  emitters: SprayEmitter[];
  /** Scene time, s. */
  t: number;
  seed: string;
  /** The section plane (world z): nothing nearer the camera than this. Default 0. */
  clipZ?: number;
  /** The mood's post exposure (the token is divided by it so the mist reads as `spray`). */
  exposure?: number;
  /** × opacity (default 1). */
  opacity?: number;
}> = ({emitters, t, seed, clipZ = 0, exposure = 1, opacity = 1}) => {
  const count = emitters.length * N;
  const geo = useMemo(() => {
    const g = new THREE.InstancedBufferGeometry();
    const quad = new THREE.PlaneGeometry(1, 1);
    g.index = quad.index;
    g.setAttribute('position', quad.getAttribute('position'));
    g.setAttribute('uv', quad.getAttribute('uv'));
    g.setAttribute('iCenter', new THREE.InstancedBufferAttribute(new Float32Array(count * 3), 3));
    g.setAttribute('iSize', new THREE.InstancedBufferAttribute(new Float32Array(count), 1));
    g.setAttribute('iAlpha', new THREE.InstancedBufferAttribute(new Float32Array(count), 1));
    g.instanceCount = count;
    return g;
  }, [count]);
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: {cSpray: {value: raw(HIGHWAY.spray)}, uClipZ: {value: 0}, uGain: {value: 1}},
        vertexShader: `
          attribute vec3 iCenter;
          attribute float iSize;
          attribute float iAlpha;
          varying vec2 vUv;
          varying float vAlpha;
          varying float vZ;
          void main() {
            vUv = uv;
            vAlpha = iAlpha;
            vZ = iCenter.z;
            vec4 mv = viewMatrix * modelMatrix * vec4(iCenter, 1.0);
            mv.xy += position.xy * iSize;
            gl_Position = projectionMatrix * mv;
          }`,
        fragmentShader: `
          uniform vec3 cSpray;
          uniform float uClipZ, uGain;
          varying vec2 vUv;
          varying float vAlpha;
          varying float vZ;
          void main() {
            if (vZ > uClipZ) discard;
            vec2 d = vUv - 0.5;
            float a = exp(-dot(d, d) * 14.0) * vAlpha;
            if (a < 0.002) discard;
            gl_FragColor = vec4(cSpray * uGain, a);
          }`,
      }),
    [],
  );
  mat.uniforms.uClipZ.value = clipZ;
  mat.uniforms.uGain.value = 1 / exposure;

  const c = geo.getAttribute('iCenter') as THREE.InstancedBufferAttribute;
  const sz = geo.getAttribute('iSize') as THREE.InstancedBufferAttribute;
  const al = geo.getAttribute('iAlpha') as THREE.InstancedBufferAttribute;
  emitters.forEach((e, ei) => {
    for (let i = 0; i < N; i++) {
      const k = ei * N + i;
      const ph = random(`${seed}-ph-${ei}-${i}`);
      const clock = t + ph * LIFE;
      const cycle = Math.floor(clock / LIFE);
      const a = clock - cycle * LIFE;
      const r = (j: number) => random(`${seed}-${ei}-${i}-${cycle}-${j}`);
      const {mist, spin} = e.strength(t - a);
      // mist uses the first share of the slots, spin's rooster tail all of them
      const live = r(0) < Math.max(mist * 0.45, spin);
      const heavy = spin > 0 && r(0) < spin;
      const w = heavy ? 1 : 0;
      const back = e.speed * a * (0.55 + 0.4 * r(1)) * (1 + 0.25 * w);
      const up = Math.max(0.03, (0.6 + 1.6 * r(2)) * (1 + 1.4 * w) * a - 2.2 * a * a);
      const side = (r(3) - 0.3) * (1.4 + 1.4 * w) * a;
      const x = e.at[0] + e.back[0] * back + e.out[0] * side;
      const z = e.at[2] + e.back[1] * back + e.out[1] * side;
      c.setXYZ(k, x, e.at[1] + 0.06 + up, z);
      sz.setX(k, (0.22 + 1.5 * a) * (1 + 0.8 * w) * (0.7 + 0.6 * r(4)));
      const fade = Math.min(1, a / 0.05) * Math.pow(1 - a / LIFE, 1.6);
      al.setX(k, live ? fade * opacity * (heavy ? 0.4 : 0.2 * Math.min(1, mist)) : 0);
    }
  });
  c.needsUpdate = sz.needsUpdate = al.needsUpdate = true;
  return <mesh geometry={geo} material={mat} frustumCulled={false} renderOrder={6} />;
};
