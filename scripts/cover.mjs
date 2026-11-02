// Render a video's cover still to src/videos/<slug>/release/cover.png (TikTok / Instagram cover).
// Only videos whose spec.ts sets `cover` have a `<slug>-cover` composition; others get a note and exit 0.
// A horizontal video's cover is its YouTube thumbnail (style guide § 11.9.1): the 1920 x 1080 composition rendered at
// scale 2 to release/thumbnail.png (3840 x 2160, PNG, the desktop upload), then downscaled to release/thumbnail-1280.jpg
// (1280 x 720, the mobile fallback, kept <= 2 MB by lowering the JPEG quality step by step). A Short's cover
// (`shorts[].cover`) is vertical and goes to release/short-<n>-cover.png.
//
// usage: yarn cover <slug> [--short <n>]
import {execFileSync, spawnSync} from 'node:child_process';
import {mkdirSync, statSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {takeShort, videoInfo, videoPaths} from './lib.mjs';

/** Returns the written path, or null when the video (or the Short) has no cover. */
export const renderCover = (slug, short = null) => {
  const paths = videoPaths(slug, 'yarn cover <slug> [--short <n>]');
  const info = videoInfo(slug);
  const has = short === null ? info.cover : info.shorts.find((s) => s.chapter === short)?.cover;
  if (!has) {
    console.log(`${short === null ? slug : `${slug} short ${short}`} has no cover (no \`cover\` in its spec.ts); nothing to render.`);
    return null;
  }
  const id = short === null ? `${slug}-cover` : `${slug}-short-${short}-cover`;
  mkdirSync(paths.releaseDir, {recursive: true});
  if (short === null && info.format === 'horizontal') return renderThumbnail(id, paths.releaseDir);
  const target = `${paths.releaseDir}/${short === null ? 'cover.png' : `short-${short}-cover.png`}`;
  execFileSync('npx', ['remotion', 'still', id, target], {stdio: 'inherit'});
  return target;
};

/** YouTube's limit for a thumbnail uploaded from mobile (YouTube Help, "Add video thumbnails"). */
const JPG_MAX = 2 * 1024 * 1024;

/** The horizontal cover: release/thumbnail.png at 3840 x 2160 and release/thumbnail-1280.jpg <= 2 MB. Returns the PNG. */
const renderThumbnail = (id, dir) => {
  const png = `${dir}/thumbnail.png`;
  const jpg = `${dir}/thumbnail-1280.jpg`;
  execFileSync('npx', ['remotion', 'still', id, png, '--scale=2'], {stdio: 'inherit'});
  // mjpeg -q:v 2 is near-lossless; step down until it fits (it always does long before 31 at 1280 x 720)
  for (let q = 2; q <= 31; q++) {
    const r = spawnSync(
      'npx',
      ['remotion', 'ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', png, '-vf', 'scale=1280:720:flags=lanczos', '-q:v', String(q), jpg],
      {encoding: 'utf8'},
    );
    if (r.status !== 0) throw new Error(`ffmpeg failed:\n${r.stderr.slice(-1500)}`);
    const size = statSync(jpg).size;
    if (size <= JPG_MAX) {
      console.log(`${png}  (3840 x 2160)\n${jpg}  (1280 x 720, ${(size / 1024).toFixed(0)} KB, q ${q})`);
      return png;
    }
  }
  throw new Error(`${jpg} stays over 2 MB at every quality step`);
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const short = takeShort(args);
  videoPaths(args[0], 'yarn cover <slug> [--short <n>]');
  renderCover(args[0], short);
}
