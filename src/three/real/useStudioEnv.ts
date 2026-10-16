import {useThree} from '@react-three/fiber';
import {createContext, useContext, useEffect, useRef, useState} from 'react';
import {cancelRender, continueRender, delayRender, staticFile} from 'remotion';
import * as THREE from 'three';
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader.js';

/**
 * The studio HDRI used for reflections on realistic objects (CC0, Poly Haven "Studio Small 09",
 * Sergej Majboroda; see public/assets/LICENSES.md). Reflections only: it is never the background
 * and never `scene.environment`, so the stylized cast and the slice keep their tuned lighting; each
 * realistic material takes it as its own `envMap`.
 */
export const STUDIO_HDRI = 'assets/hdri/studio_small_09_1k.hdr';

// The decoded HDR is shared by every canvas in the page; the prefiltered (PMREM) map belongs to
// one WebGL context, so it is cached per renderer.
let hdr: Promise<THREE.DataTexture> | null = null;
const pmrem = new WeakMap<THREE.WebGLRenderer, THREE.Texture>();

/**
 * Radiance cap: the studio's softboxes are 20–50× the cyc, and in a kit without tone mapping their
 * reflections burn pure-white glints into every metal edge (the whites rule: zero pixels at 255).
 * Capping the source keeps the shape of the reflections and loses only the burn.
 */
export const HDRI_CAP = 3;

const loadHdr = () => {
  if (!hdr) {
    hdr = new RGBELoader().loadAsync(staticFile(STUDIO_HDRI)).then((tex) => {
      const d = tex.image.data as unknown as Uint16Array; // RGBELoader default: HalfFloatType
      for (let i = 0; i < d.length; i++) {
        if ((i & 3) === 3) continue; // alpha
        const v = THREE.DataUtils.fromHalfFloat(d[i]);
        if (v > HDRI_CAP) d[i] = THREE.DataUtils.toHalfFloat(HDRI_CAP);
      }
      tex.needsUpdate = true;
      return tex;
    });
  }
  return hdr;
};

/**
 * The prefiltered studio environment for this canvas, or null on the very first render. The frame
 * waits (delayRender) until it is loaded, prefiltered and drawn once with it, so no frame is ever
 * rendered without reflections. Deterministic: same file, same prefilter, every time.
 */
export const useStudioEnv = (): THREE.Texture | null => {
  const gl = useThree((s) => s.gl);
  const advance = useThree((s) => s.advance);
  const [env, setEnv] = useState<THREE.Texture | null>(() => pmrem.get(gl) ?? null);
  const hold = useRef<number | null>(null);
  useEffect(() => {
    if (env) return;
    hold.current = delayRender('studio HDRI');
    let alive = true;
    loadHdr()
      .then((data) => {
        if (!alive) return;
        let tex = pmrem.get(gl);
        if (!tex) {
          const gen = new THREE.PMREMGenerator(gl);
          tex = gen.fromEquirectangular(data).texture;
          gen.dispose();
          pmrem.set(gl, tex);
        }
        setEnv(tex);
      })
      // a missing file must fail the render loudly, not silently drop the reflections
      .catch((e) => cancelRender(e));
    return () => {
      alive = false;
    };
  }, [env, gl]);
  // unmounted before it loaded: never leave the frame waiting
  useEffect(
    () => () => {
      if (hold.current !== null) continueRender(hold.current);
      hold.current = null;
    },
    [],
  );
  // after the render that applied the map: draw once, then release the frame
  useEffect(() => {
    if (!env || hold.current === null) return;
    advance(performance.now());
    const h = hold.current;
    hold.current = null;
    continueRender(h);
  }, [env, advance]);
  return env;
};

/**
 * The HDRI's radiance read straight into the display-referred kit (no tone mapping, no sRGB curve)
 * is dim: this gain brings a strength of 1 to "a metal looks like metal" under the Section lights.
 */
export const ENV_GAIN = 1.5;

/**
 * The canvas's mood for realistic objects (set by SectionStage from the palette): `env`, the studio
 * reflections' strength (1 in Day, lower in Night so a dark room isn't lit like a studio), and
 * `albedo`, a scale on fixed object colours (Night's exposure would make them glare).
 */
export const MoodLook = createContext({env: 1, albedo: 1});
/** The reflections' strength in this canvas. */
export const useEnvStrength = () => useContext(MoodLook).env;
/** The albedo scale for fixed object colours in this canvas. */
export const useAlbedo = () => useContext(MoodLook).albedo;

/**
 * Scale materials' authored colours by the mood's albedo (each material's own colour is kept in
 * userData the first time, so this can run every frame).
 */
export const applyAlbedo = (mats: THREE.Material[], k: number) => {
  for (const m of mats) {
    const c = (m as THREE.MeshBasicMaterial).color;
    if (!c) continue;
    if (!m.userData.baseColor) m.userData.baseColor = c.clone();
    c.copy(m.userData.baseColor as THREE.Color).multiplyScalar(k);
  }
};

/**
 * Give each material the environment (once it is there) with its own strength (× ENV_GAIN × the
 * canvas's mood strength).
 */
export const applyEnv = (env: THREE.Texture | null, mats: [THREE.MeshStandardMaterial, number][], scale = 1) => {
  for (const [m, k] of mats) {
    if (m.envMap !== env) {
      m.envMap = env;
      m.needsUpdate = true;
    }
    m.envMapIntensity = k * ENV_GAIN * scale;
  }
};
