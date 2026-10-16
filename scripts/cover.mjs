// Render a video's cover still to out/<slug>/cover.png (TikTok / Instagram cover).
// Only videos whose spec.ts sets `cover` have a `<slug>-cover` composition; others get a note and exit 0.
//
// usage: yarn cover <slug>
import {execFileSync} from 'node:child_process';
import {mkdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {hasCover, outDir, videoPaths} from './lib.mjs';

/** Returns the written path, or null when the video has no cover. */
export const renderCover = (slug) => {
  if (!hasCover(slug)) {
    console.log(`${slug} has no cover (no \`cover\` in its spec.ts); nothing to render.`);
    return null;
  }
  const target = `${outDir(slug)}/cover.png`;
  mkdirSync(outDir(slug), {recursive: true});
  execFileSync('npx', ['remotion', 'still', `${slug}-cover`, target], {stdio: 'inherit'});
  return target;
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const slug = process.argv[2];
  videoPaths(slug, 'yarn cover <slug>');
  renderCover(slug);
}
