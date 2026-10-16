// Assemble the posting folder out/<slug>/: copies publish.md, renders the YouTube frame, and prints a
// checklist of what is there. Does not render the video or the cover (yarn render / yarn cover).
//
// usage: yarn package <slug>
// The YouTube frame comes from publish.md, preferably a machine-readable marker line
//   <!-- youtube-frame: 1490 -->
// and otherwise the first "frame <n>" in the "## Cover" section. Output: out/<slug>/youtube-frame.png.
import {execFileSync} from 'node:child_process';
import {copyFileSync, existsSync, mkdirSync, readFileSync} from 'node:fs';
import {hasCover, outDir, videoPaths} from './lib.mjs';

const slug = process.argv[2];
const paths = videoPaths(slug, 'yarn package <slug>');
const dir = outDir(slug);
const publish = `${paths.dir}/publish.md`;
const warnings = [];
mkdirSync(dir, {recursive: true});

let frame = null;
if (existsSync(publish)) {
  copyFileSync(publish, `${dir}/publish.md`);
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

const mp4 = `${dir}/${slug}.mp4`;
const items = [
  [mp4, true, 'final video (yarn render)'],
  [`${dir}/cover.png`, hasCover(slug), 'TikTok / Instagram cover (yarn cover)'],
  [`${dir}/youtube-frame.png`, false, 'YouTube frame (publish.md names one)'],
  [`${dir}/publish.md`, true, 'publish copy'],
];
console.log(`\nPosting folder ${dir}/`);
for (const [file, required, label] of items) {
  const ok = existsSync(file);
  const optional = !required && !ok;
  console.log(`  [${ok ? 'x' : optional ? '-' : ' '}] ${file.slice(dir.length + 1)}  ${label}${optional ? ' (not applicable)' : ''}`);
  if (!ok && required) warnings.push(`${file} is missing: ${label}`);
}
if (frame === null && existsSync(publish)) warnings.push('publish.md names no YouTube frame (no marker or "frame <n>" in ## Cover)');
for (const w of warnings) console.warn(`WARNING: ${w}`);
