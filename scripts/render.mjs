// Render one video to out/<slug>.mp4, then loudness-normalise it (-14 LUFS, -1.5 dBTP; scripts/normalize.mjs).
// The raw Remotion mix is kept as out/<slug>.raw.mp4. Extra args go straight to `remotion render`.
//
// usage: yarn render <slug> [--no-normalize] [--post-only] [--gl=swangle] [--concurrency=1] ...
//   --no-normalize  skip the loudness step; writes the raw mix straight to out/<slug>.mp4
//   --post-only     skip the render; only normalise the existing render (same as `yarn normalize <slug>`)
import {execFileSync} from 'node:child_process';
import {videoPaths} from './lib.mjs';
import {normalize} from './normalize.mjs';

const [slug, ...args] = process.argv.slice(2);
videoPaths(slug, 'yarn render <slug> [--no-normalize] [--post-only] [remotion flags]');
const skip = args.includes('--no-normalize');
const postOnly = args.includes('--post-only');
const rest = args.filter((a) => a !== '--no-normalize' && a !== '--post-only');

if (!postOnly) {
  const target = skip ? `out/${slug}.mp4` : `out/${slug}.raw.mp4`;
  execFileSync('remotion', ['render', slug, target, ...rest], {stdio: 'inherit'});
}
if (!skip) normalize(slug);
