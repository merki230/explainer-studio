// Licensed stock footage lives with its video (src/videos/<slug>/footage/, git-ignored: the repo is public and the
// Pexels/Pixabay licences ban redistributing the file, style guide § 11.6.1). Same idea as audioAssets.ts: the bundler
// serves every .mp4 under src/videos/ and this resolves "<slug>" + a path relative to the video folder to its URL.
// An empty context (fresh clone, no footage) is fine; callers skip a null.
const ctx = require.context('./videos', true, /\/footage\/.*\.mp4$/);

const urls = new Map<string, string>();
for (const key of ctx.keys()) {
  const mod = ctx(key) as string | {default: string};
  urls.set(key.replace(/^\.\//, ''), typeof mod === 'string' ? mod : mod.default);
}

/** URL of `rel` (e.g. `footage/opening.mp4`) under `src/videos/<slug>/`, or null when the file is missing. */
export const footageUrl = (slug: string, rel: string): string | null => {
  const url = urls.get(`${slug}/${rel}`) ?? null;
  if (!url) console.warn(`[footage] src/videos/${slug}/${rel} not found: opening skipped.`);
  return url;
};
