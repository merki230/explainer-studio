// Render one video to out/<slug>.mp4. Extra args go straight to `remotion render`.
//
// usage: yarn render <slug> [--gl=swangle] [--concurrency=1] ...
import {execFileSync} from 'node:child_process';
import {videoPaths} from './lib.mjs';

const [slug, ...rest] = process.argv.slice(2);
videoPaths(slug, 'yarn render <slug> [remotion flags]');
execFileSync('remotion', ['render', slug, `out/${slug}.mp4`, ...rest], {stdio: 'inherit'});
