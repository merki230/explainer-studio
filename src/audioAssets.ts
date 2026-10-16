// Audio lives with its video (src/videos/<slug>/audio/), not in public/. The Remotion bundler turns every
// .mp3 under src/videos/ into a served asset; this map resolves "<slug>" + a path relative to the video
// folder (e.g. "audio/voiceover.mp3") to its URL. Browser/bundler only: Node scripts check the files
// with fs instead (see scripts/check.ts). Studio and renders both go through this, so there is one path.
const ctx = require.context('./videos', true, /\.mp3$/);

const urls = new Map<string, string>();
for (const key of ctx.keys()) {
  const mod = ctx(key) as string | {default: string};
  // key looks like "./phone-listening/audio/voiceover.mp3"
  urls.set(key.replace(/^\.\//, ''), typeof mod === 'string' ? mod : mod.default);
}

const warned = new Set<string>();

/**
 * URL of `rel` (relative to `src/videos/<slug>/`, e.g. `audio/sfx/click.mp3`), or null when the file
 * does not exist. `<Audio>` fails the render on a missing file, so callers skip a null with the
 * warning logged here once.
 */
export const audioUrl = (slug: string, rel: string): string | null => {
  const path = `${slug}/${rel}`;
  const url = urls.get(path) ?? null;
  if (!url && !warned.has(path)) {
    warned.add(path);
    console.warn(`[sound] src/videos/${path} not found: skipped.`);
  }
  return url;
};
