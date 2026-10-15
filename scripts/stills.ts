// Render one PNG per scene to out/<slug>/stills/, so you (or Claude) can check
// the layout of a whole video in seconds without scrubbing the Studio.
// Each still is taken just after the scene's last overlay appears.
//
// usage: yarn stills <slug> [--scale=0.5] [--frames=120,300]
import {mkdirSync, rmSync} from 'node:fs';
import path from 'node:path';
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import {FADE, FPS} from '../src/theme';
import {resolveTimeline} from '../src/timeline';
import {VIDEOS} from '../src/videos';
import {videoPaths} from './lib.mjs';

const args = process.argv.slice(2);
const slug = args.find((a) => !a.startsWith('--'));
videoPaths(slug, 'yarn stills <slug> [--scale=0.5] [--frames=120,300]');
const flag = (name: string) => args.find((a) => a.startsWith(`--${name}=`))?.split('=')[1];
const scale = Number(flag('scale') ?? 0.5);

const entry = VIDEOS[slug!];
if (!entry) {
  console.error(`"${slug}" is not registered in src/videos/index.ts.`);
  process.exit(1);
}

const tl = resolveTimeline(entry.spec, entry.transcript.words, FPS);
const shots: {name: string; frame: number}[] = flag('frames')
  ? flag('frames')!
      .split(',')
      .map((f) => ({name: `frame-${f}`, frame: Number(f)}))
  : tl.scenes.map((s, i) => {
      const lastOverlay = Math.max(s.startFrame + FADE, ...s.overlays.map((o) => o.startFrame + 20));
      const frame = Math.min(lastOverlay, s.endFrame - 1);
      return {name: `${String(i + 1).padStart(2, '0')}-${s.scene}`, frame};
    });

const outDir = `out/${slug}/stills`;
rmSync(outDir, {recursive: true, force: true});
mkdirSync(outDir, {recursive: true});

console.log('Bundling...');
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
// Must match remotion.config.ts, which bundle() does not read.
const chromiumOptions = {gl: 'angle' as const};
const composition = await selectComposition({serveUrl, id: slug!, chromiumOptions});

for (const shot of shots) {
  const output = `${outDir}/${shot.name}.png`;
  await renderStill({composition, serveUrl, frame: shot.frame, output, scale, chromiumOptions});
  console.log(`${output}  (frame ${shot.frame}, ${(shot.frame / FPS).toFixed(2)}s)`);
}
