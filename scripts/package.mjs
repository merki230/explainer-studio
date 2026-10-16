// Finish the posting folder src/videos/<slug>/release/: renders the YouTube frame and prints a checklist
// of what is there (publish.md is already in the video folder). Does not render the video or the cover
// (yarn render / yarn cover).
//
// usage: yarn package <slug>
// The YouTube frame comes from publish.md, preferably a machine-readable marker line
//   <!-- youtube-frame: 1490 -->
// and otherwise the first "frame <n>" in the "## Cover" section. Output: release/youtube-frame.png.
import {execFileSync} from 'node:child_process';
import {existsSync, mkdirSync, readFileSync} from 'node:fs';
import {hasCover, videoPaths} from './lib.mjs';

const slug = process.argv[2];
const paths = videoPaths(slug, 'yarn package <slug>');
const dir = paths.releaseDir;
const publish = `${paths.dir}/publish.md`;
const warnings = [];
mkdirSync(dir, {recursive: true});

let frame = null;
if (existsSync(publish)) {
  const text = readFileSync(publish, 'utf8');
  const marker = text.match(/<!--\s*youtube-frame:\s*(\d+)\s*-->/);
  const cover = text.match(/^## Cover\b[\s\S]*?(?=^## |(?![\s\S]))/m)?.[0] ?? '';
  const loose = cover.match(/\bframe\s+(\d+)/i);
  frame = marker ? Number(marker[1]) : loose ? Number(loose[1]) : null;
} else {
  warnings.push(`${publish} is missing (the publisher makes it)`);
}

if (frame !== null) {
  execFileSync('npx', ['remotion', 'still', slug, `${dir}/youtube-frame.png`, `--frame=${frame}`], {stdio: 'inherit'});
}

const items = [
  [`${dir}/${slug}.mp4`, true, 'final video (yarn render; git-ignored)'],
  [`${dir}/cover.png`, hasCover(slug), 'TikTok / Instagram cover (yarn cover)'],
  [`${dir}/youtube-frame.png`, false, 'YouTube frame (publish.md names one)'],
  [publish, true, 'publish copy'],
];
console.log(`\nPosting files for ${slug}`);
for (const [file, required, label] of items) {
  const ok = existsSync(file);
  const optional = !required && !ok;
  console.log(`  [${ok ? 'x' : optional ? '-' : ' '}] ${file}  ${label}${optional ? ' (not applicable)' : ''}`);
  if (!ok && required) warnings.push(`${file} is missing: ${label}`);
}
if (frame === null && existsSync(publish)) warnings.push('publish.md names no YouTube frame (no marker or "frame <n>" in ## Cover)');
for (const w of warnings) console.warn(`WARNING: ${w}`);
