import {SNAP_VARIANTS} from '../three/real/cameraSnapshot';

/*
 * The plate camera's rendered stills (`zz-camera-snapshot`, see `three/real/cameraSnapshot.ts`), kept with their video
 * as `src/videos/<slug>/snapshots/<variant>.png`. Same idea as `audioAssets.ts`: the bundler serves every PNG there and
 * this resolves a set (the slug) to loaded images. Browser/bundler only. A set with no files resolves to null, and the
 * camera-view box falls back to its flat drawing.
 */
const ctx = require.context('../videos', true, /\/snapshots\/[a-z0-9-]+\.png$/);

const urls = new Map<string, string>();
for (const key of ctx.keys()) {
  const mod = ctx(key) as string | {default: string};
  // "./flock-camera/snapshots/main.png" → "flock-camera/main"
  const m = key.match(/^\.\/(.+)\/snapshots\/([a-z0-9-]+)\.png$/);
  if (m) urls.set(`${m[1]}/${m[2]}`, typeof mod === 'string' ? mod : mod.default);
}

export type Snapshots = {main: HTMLImageElement; ir: HTMLImageElement; tiles: {img: HTMLImageElement; label: string}[]};

const loaded = new Map<string, Snapshots | null>();
const pending = new Map<string, Promise<Snapshots | null>>();

const loadImage = (src: string) =>
  new Promise<HTMLImageElement | null>((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });

/** Load a set's stills once (await it before drawing; the box holds the frame with delayRender meanwhile). */
export const loadSnapshots = (set: string): Promise<Snapshots | null> => {
  const p = pending.get(set);
  if (p) return p;
  const tiles = SNAP_VARIANTS.filter((v) => v.label);
  const q = Promise.all(
    ['main', 'ir', ...tiles.map((v) => v.name)].map((n) => {
      const u = urls.get(`${set}/${n}`);
      return u ? loadImage(u) : Promise.resolve(null);
    }),
  ).then(([main, ir, ...rest]) => {
    const t = rest.flatMap((img, i) => (img ? [{img, label: tiles[i].label as string}] : []));
    const s = main && ir && t.length ? {main, ir, tiles: t} : null;
    loaded.set(set, s);
    return s;
  });
  pending.set(set, q);
  return q;
};

/** A set's stills once `loadSnapshots` has resolved (null before, or with no files). */
export const snapshotsNow = (set: string): Snapshots | null => loaded.get(set) ?? null;
