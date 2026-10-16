// The post pass has to take over drawing the canvas, and in React Three Fiber the
// only supported way to do that is a useFrame subscriber with priority > 0. It is
// render-only: no motion reads R3F's clock. Grain is seeded from useCurrentFrame().
// eslint-disable-next-line no-restricted-imports
import {useFrame, useThree} from '@react-three/fiber';
import React, {useEffect, useMemo, useRef} from 'react';
import {useCurrentFrame} from 'remotion';
import * as THREE from 'three';
import {N8AOPass} from 'n8ao';

export type PostSettings = {
  /** Strength of the bloom on objects flagged `userData.glow` (orange only). */
  bloom: number;
  /** Vignette darkening at the corners, 0–1. */
  vignette: number;
  /** Film grain amplitude. */
  grain: number;
  /** How much the frame softens away from the focus band, 0–1. */
  softFocus: number;
  /** Centre of the sharp band, as a fraction of the frame from the TOP. */
  focusY: number;
  /** Overall exposure multiplier. */
  exposure: number;
  /** Values above this are rolled off so whites never clip. */
  shoulder: number;
  /**
   * Screen-space ambient occlusion (N8AO, realism pass): 0 off (default; the pass isn't even built),
   * up to 1. Soft contact shadows in corners, under objects and between parts. Deterministic: no
   * accumulation, fixed blue noise, no clock.
   */
  ao: number;
  /** AO radius in world units (default 0.35: the scale of a phone to a couch cushion). */
  aoRadius: number;
};

export const DEFAULT_POST: PostSettings = {
  bloom: 1.0,
  vignette: 0.34,
  grain: 0.035,
  softFocus: 0.75,
  focusY: 0.45,
  exposure: 0.86,
  shoulder: 0.82,
  ao: 0,
  aoRadius: 0.35,
};

const QUAD_VS = 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }';

const BLUR_FS = `
uniform sampler2D tDiffuse; uniform vec2 dir; varying vec2 vUv;
void main(){
  vec4 c = texture2D(tDiffuse, vUv) * 0.227027;
  c += (texture2D(tDiffuse, vUv + dir * 1.3846) + texture2D(tDiffuse, vUv - dir * 1.3846)) * 0.3162162;
  c += (texture2D(tDiffuse, vUv + dir * 3.2307) + texture2D(tDiffuse, vUv - dir * 3.2307)) * 0.0702703;
  gl_FragColor = c;
}`;

const COMP_FS = `
uniform sampler2D tBase; uniform sampler2D tGlow; uniform sampler2D tSoft; uniform sampler2D tAO; uniform float aoStrength;
uniform vec2 res;
uniform float bloom, vig, grain, seed, tilt, focusY, exposure, shoulder;
varying vec2 vUv;
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
void main(){
  vec2 uv = vUv;
  float aspect = res.x / res.y;
  vec3 col = texture2D(tBase, uv).rgb;
  float tf = smoothstep(0.14, 0.5, abs(uv.y - focusY)) * tilt;
  col = mix(col, texture2D(tSoft, uv).rgb, tf);
  // ambient occlusion darkens the lit scene, never the glow added on top
  col *= mix(1.0, texture2D(tAO, uv).r, aoStrength);
  col += texture2D(tGlow, uv).rgb * bloom;
  col *= exposure;
  col -= max(col - shoulder, 0.0) * 0.55;
  vec2 vp = (uv - 0.5) * vec2(aspect, 1.0);
  col *= 1.0 - vig * smoothstep(0.35, 0.95, length(vp));
  col += (hash(floor(uv * res) + seed) - 0.5) * grain;
  gl_FragColor = vec4(col, 1.0);
}`;

const BLACK = new THREE.Color(0, 0, 0);

/**
 * Museum post pass: selective bloom (meshes with `userData.glow`), soft focus
 * away from a horizontal band, exposure with highlight roll-off, vignette, grain.
 * Same maths as the approved mock-up. Mount it once inside a canvas.
 */
export const MuseumPost: React.FC<Partial<PostSettings>> = (props) => {
  const settings = {...DEFAULT_POST, ...props};
  const frame = useCurrentFrame();
  const gl = useThree((s) => s.gl);

  const kit = useMemo(() => {
    const rt = (depth: boolean, samples = 0) =>
      new THREE.WebGLRenderTarget(2, 2, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        depthBuffer: depth,
        type: THREE.HalfFloatType,
        samples,
      });
    const quadScene = new THREE.Scene();
    const quadCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2));
    quad.frustumCulled = false;
    quadScene.add(quad);
    const blurMat = new THREE.ShaderMaterial({
      vertexShader: QUAD_VS,
      fragmentShader: BLUR_FS,
      uniforms: {tDiffuse: {value: null}, dir: {value: new THREE.Vector2()}},
      depthTest: false,
      depthWrite: false,
    });
    const compMat = new THREE.ShaderMaterial({
      vertexShader: QUAD_VS,
      fragmentShader: COMP_FS,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        tBase: {value: null},
        tGlow: {value: null},
        tSoft: {value: null},
        tAO: {value: null},
        aoStrength: {value: 0},
        res: {value: new THREE.Vector2(2, 2)},
        bloom: {value: 1},
        vig: {value: 0.46},
        grain: {value: 0.035},
        seed: {value: 0},
        tilt: {value: 0.75},
        focusY: {value: 0.55},
        exposure: {value: 0.86},
        shoulder: {value: 0.82},
      },
    });
    const black = new THREE.MeshBasicMaterial({color: BLACK});
    return {
      base: rt(true, 4),
      glow: rt(true),
      a: rt(false),
      b: rt(false),
      soft: rt(false),
      aoTarget: rt(false),
      ao: null as N8AOPass | null,
      white: (() => {
        const t = new THREE.DataTexture(new Uint8Array([255, 255, 255, 255]), 1, 1);
        t.needsUpdate = true;
        return t;
      })(),
      quadScene,
      quadCam,
      quad,
      blurMat,
      compMat,
      black,
      size: new THREE.Vector2(),
    };
  }, []);

  useEffect(
    () => () => {
      [kit.base, kit.glow, kit.a, kit.b, kit.soft, kit.aoTarget].forEach((r) => r.dispose());
      kit.white.dispose();
      kit.blurMat.dispose();
      kit.compMat.dispose();
      kit.black.dispose();
      kit.quad.geometry.dispose();
    },
    [kit],
  );

  // Latest settings for the render callback.
  const live = useRef({settings, frame});
  live.current = {settings, frame};

  useFrame(({scene, camera}) => {
    const {settings: s, frame: f} = live.current;
    gl.getDrawingBufferSize(kit.size);
    const W = Math.max(2, kit.size.x);
    const H = Math.max(2, kit.size.y);
    const hw = Math.max(1, W >> 1);
    const hh = Math.max(1, H >> 1);
    if (kit.base.width !== W || kit.base.height !== H) {
      kit.base.setSize(W, H);
      [kit.glow, kit.a, kit.b, kit.soft, kit.aoTarget].forEach((r) => r.setSize(hw, hh));
      kit.ao?.setSize(W, H);
      kit.aoTarget.setSize(W, H);
    }

    const pass = (mat: THREE.Material, target: THREE.WebGLRenderTarget | null) => {
      kit.quad.material = mat;
      gl.setRenderTarget(target);
      gl.render(kit.quadScene, kit.quadCam);
    };
    const blur = (src: THREE.WebGLRenderTarget, dst: THREE.WebGLRenderTarget, iterations: number, spread: number) => {
      let input = src.texture;
      const u = kit.blurMat.uniforms;
      for (let i = 0; i < iterations; i++) {
        const k = spread * (i + 1);
        u.tDiffuse.value = input;
        u.dir.value.set(k / dst.width, 0);
        pass(kit.blurMat, kit.b);
        u.tDiffuse.value = kit.b.texture;
        u.dir.value.set(0, k / dst.height);
        pass(kit.blurMat, dst);
        input = dst.texture;
      }
    };

    // 1. The scene.
    gl.setRenderTarget(kit.base);
    gl.render(scene, camera);

    // 2. Glow layer: everything not flagged `glow` drawn black, then blurred.
    const saved: [THREE.Mesh, THREE.Material | THREE.Material[]][] = [];
    scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh || o.userData.glow) return;
      saved.push([m, m.material]);
      m.material = kit.black;
    });
    const bg = scene.background;
    const fog = scene.fog;
    const autoShadows = gl.shadowMap.autoUpdate;
    scene.background = BLACK;
    scene.fog = null;
    gl.shadowMap.autoUpdate = false;
    gl.setRenderTarget(kit.glow);
    gl.render(scene, camera);
    saved.forEach(([m, mat]) => {
      m.material = mat;
    });
    scene.background = bg;
    scene.fog = fog;
    gl.shadowMap.autoUpdate = autoShadows;

    // 2b. Ambient occlusion (only when asked): N8AO renders its own beauty and depth
    // (AO at half resolution, depth-aware upsampling) and writes the occlusion factor alone (render mode 1, black, no colour multiply) to aoTarget.
    let aoTex: THREE.Texture = kit.white;
    if (s.ao > 0) {
      if (!kit.ao) {
        const pass = new N8AOPass(scene, camera, W, H);
        Object.assign(pass.configuration, {
          aoSamples: 16,
          denoiseSamples: 16,
          denoiseRadius: 12,
          distanceFalloff: 1,
          intensity: 2.5,
          halfRes: true,
          depthAwareUpsampling: true,
          gammaCorrection: false,
          screenSpaceRadius: false,
          renderMode: 1,
          colorMultiply: false,
          transparencyAware: false,
          accumulate: false,
        });
        pass.configuration.color = new THREE.Color(0, 0, 0);
        kit.ao = pass;
      }
      kit.ao.scene = scene;
      kit.ao.camera = camera;
      kit.ao.configuration.aoRadius = s.aoRadius;
      gl.shadowMap.autoUpdate = false;
      kit.ao.render(gl, kit.aoTarget, null);
      gl.shadowMap.autoUpdate = autoShadows;
      aoTex = kit.aoTarget.texture;
    }

    blur(kit.glow, kit.a, 2, 1.7);
    blur(kit.base, kit.soft, 1, 1.3);

    // 3. Composite to the canvas.
    const u = kit.compMat.uniforms;
    u.tBase.value = kit.base.texture;
    u.tGlow.value = kit.a.texture;
    u.tSoft.value = kit.soft.texture;
    u.tAO.value = aoTex;
    u.aoStrength.value = s.ao;
    u.res.value.set(W, H);
    u.bloom.value = s.bloom;
    u.vig.value = s.vignette;
    u.grain.value = s.grain;
    u.seed.value = (f % 97) * 13.37;
    u.tilt.value = s.softFocus;
    u.focusY.value = 1 - s.focusY;
    u.exposure.value = s.exposure;
    u.shoulder.value = s.shoulder;
    pass(kit.compMat, null);
  }, 1);

  return null;
};
