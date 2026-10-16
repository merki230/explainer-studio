import {useThree} from '@react-three/fiber';
import {useEffect, useMemo, useRef, useState} from 'react';
import {cancelRender, continueRender, delayRender, staticFile} from 'remotion';
import * as THREE from 'three';

/**
 * CC0 PBR texture sets in `public/assets/textures/` (sources and licences in
 * public/assets/LICENSES.md): each is a diffuse, an OpenGL normal and a roughness map, 1k JPG.
 */
export const TEXTURE_SETS = ['poly_wool_herringbone', 'hessian_380', 'ash_veneer'] as const;
export type TextureSetName = (typeof TEXTURE_SETS)[number];
export type TextureSet = {map: THREE.Texture; normalMap: THREE.Texture; roughnessMap: THREE.Texture};

// Images are shared by every canvas in the page (three uploads a texture per renderer itself).
const cache = new Map<TextureSetName, Promise<TextureSet>>();
const done = new Map<TextureSetName, TextureSet>();

const load = (name: TextureSetName) => {
  let p = cache.get(name);
  if (!p) {
    const loader = new THREE.TextureLoader();
    const one = (kind: string) =>
      loader.loadAsync(staticFile(`assets/textures/${name}_${kind}_1k.jpg`)).then((t) => {
        // display-referred like the rest of the kit (plaster.ts `raw`): no colour-space conversion
        t.wrapS = THREE.RepeatWrapping;
        t.wrapT = THREE.RepeatWrapping;
        t.anisotropy = 8;
        return t;
      });
    p = Promise.all([one('diff'), one('nor_gl'), one('rough')]).then(([map, normalMap, roughnessMap]) => {
      const set = {map, normalMap, roughnessMap};
      done.set(name, set);
      return set;
    });
    cache.set(name, p);
  }
  return p;
};

/**
 * The named texture sets, or null until they are all loaded. The frame waits (delayRender) until
 * they are in and drawn once, so no frame renders untextured. Deterministic: fixed files.
 */
export const useTextureSets = (names: readonly TextureSetName[]): Record<TextureSetName, TextureSet> | null => {
  const advance = useThree((s) => s.advance);
  const all = () => names.every((n) => done.has(n));
  const [ready, setReady] = useState(all);
  const hold = useRef<number | null>(null);
  const key = names.join(',');
  useEffect(() => {
    if (ready) return;
    hold.current = delayRender(`textures ${key}`);
    let alive = true;
    Promise.all(key.split(',').map((n) => load(n as TextureSetName)))
      .then(() => {
        if (alive) setReady(true);
      })
      .catch((e) => cancelRender(e));
    return () => {
      alive = false;
    };
  }, [ready, key]);
  useEffect(
    () => () => {
      if (hold.current !== null) continueRender(hold.current);
      hold.current = null;
    },
    [],
  );
  useEffect(() => {
    if (!ready || hold.current === null) return;
    advance(performance.now());
    const h = hold.current;
    hold.current = null;
    continueRender(h);
  }, [ready, advance]);
  // one stable object per load (callers memo materials on it: a new object every frame would rebuild them)
  return useMemo(
    () =>
      ready
        ? (Object.fromEntries(key.split(',').map((n) => [n, done.get(n as TextureSetName)!])) as Record<
            TextureSetName,
            TextureSet
          >)
        : null,
    [ready, key],
  );
};

/**
 * A texture set repeated `rx` × `ry` times (clones share the image; one clone per use so each
 * mesh keeps its own repeat).
 */
export const repeated = (set: TextureSet, rx: number, ry: number): TextureSet => {
  const c = (t: THREE.Texture) => {
    const k = t.clone();
    k.repeat.set(rx, ry);
    k.needsUpdate = true;
    return k;
  };
  return {map: c(set.map), normalMap: c(set.normalMap), roughnessMap: c(set.roughnessMap)};
};
