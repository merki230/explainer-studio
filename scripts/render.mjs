// Render one video to src/videos/<slug>/release/<slug>.mp4 (git-ignored), then loudness-normalise it (-14 LUFS, -1.5 dBTP; scripts/normalize.mjs).
// The raw Remotion mix is kept as out/<slug>/raw/<slug>.raw.mp4. Extra args go straight to `remotion render`.
//
// usage: yarn render <slug> [--short <n>] [--no-normalize] [--post-only] [--force] [--gl=swangle] [--concurrency=1] ...
//   --short <n>     render the vertical Short cut from chapter n of a long-form video (composition <slug>-short-<n>);
//                   files are named <slug>-short-<n> (raw out/<slug>/raw/<slug>-short-<n>.raw.mp4, final release/<slug>-short-<n>.mp4)
//   --no-normalize  skip the loudness step; writes the raw mix straight to release/<slug>.mp4
//   --force         render a sandbox video (spec.sandbox, e.g. `lab`); refused otherwise so it isn't posted
//   --post-only     skip the render; only normalise the existing render (same as `yarn normalize <slug>`)
import {execFileSync} from 'node:child_process';
import {existsSync, mkdirSync, readFileSync} from 'node:fs';
import {compId, rawDir, takeShort, videoPaths} from './lib.mjs';
import {normalize} from './normalize.mjs';

const [slug, ...args] = process.argv.slice(2);
const short = takeShort(args);
const id = compId(slug, short);
const paths = videoPaths(slug, 'yarn render <slug> [--short <n>] [--no-normalize] [--post-only] [remotion flags]');
const force = args.includes('--force');
const specFile = `src/videos/${slug}/spec.ts`;
if (existsSync(specFile) && /^\s*sandbox:\s*true/m.test(readFileSync(specFile, 'utf8')) && !force) {
  console.error(`${slug} is a sandbox video (spec.sandbox). Not for posting; pass --force to render it anyway.`);
  process.exit(1);
}
const skip = args.includes('--no-normalize');
const postOnly = args.includes('--post-only');
const rest = args.filter((a) => a !== '--no-normalize' && a !== '--post-only' && a !== '--force');

if (!postOnly) {
  mkdirSync(rawDir(slug), {recursive: true});
  mkdirSync(paths.releaseDir, {recursive: true});
  const target = skip ? `${paths.releaseDir}/${id}.mp4` : `${rawDir(slug)}/${id}.raw.mp4`;
  execFileSync('remotion', ['render', id, target, ...rest], {stdio: 'inherit'});
}
if (!skip) normalize(slug, short);
