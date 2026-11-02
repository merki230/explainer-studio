// Finish the posting folder src/videos/<slug>/release/: renders the YouTube frame and prints a checklist
// of what is there (publish.md is already in the video folder). Does not render the video or the cover
// (yarn render / yarn cover).
//
// usage: yarn package <slug> [--short <n>]
// Long-form videos (chapters in transcript.json) also get the YouTube chapter timestamps: printed, for the
// description, and written to release/chapters.txt. The first is 00:00; YouTube needs at least 3, each at least 10 s
// (warned otherwise); `mm:ss`, or `h:mm:ss` when the video is an hour or longer. Times are the chapter's first word,
// rounded down to the second (a click lands in the last moment of the previous chapter, never after the question).
// With --short <n> it checks the posting files of the Short cut from chapter n (no YouTube frame, no chapters).
// The YouTube frame comes from publish.md, preferably a machine-readable marker line
//   <!-- youtube-frame: 1490 -->
// and otherwise the first "frame <n>" in the "## Cover" section. Output: release/youtube-frame.png.
// Also checks publish.md for a "## Poll" section (every post carries a poll) and warns if it is missing.
import {execFileSync} from 'node:child_process';
import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {compId, takeShort, videoInfo, videoPaths} from './lib.mjs';

const args = process.argv.slice(2);
const short = takeShort(args);
const slug = args[0];
const paths = videoPaths(slug, 'yarn package <slug> [--short <n>]');
const info = videoInfo(slug);
const dir = paths.releaseDir;
const publish = `${paths.dir}/publish.md`;
const warnings = [];
mkdirSync(dir, {recursive: true});

/** Seconds -> `mm:ss` (or `h:mm:ss`). */
const stamp = (sec, hours) => {
  const t = Math.floor(sec);
  const [h, m, s] = [Math.floor(t / 3600), Math.floor((t % 3600) / 60), t % 60];
  const two = (n) => String(n).padStart(2, '0');
  return hours ? `${h}:${two(m)}:${two(s)}` : `${two(m + h * 60)}:${two(s)}`;
};

let frame = null;
if (short !== null) {
  if (!info.shorts.some((s) => s.chapter === short)) {
    console.error(`${slug} has no short for chapter ${short} in spec.shorts.`);
    process.exit(1);
  }
  const id = compId(slug, short);
  const items = [
    [`${dir}/${id}.mp4`, true, 'the Short (yarn render <slug> --short <n>; git-ignored)'],
    [`${dir}/short-${short}-cover.png`, info.shorts.find((s) => s.chapter === short).cover, 'TikTok / Instagram cover (yarn cover <slug> --short <n>)'],
    [publish, true, 'publish copy (the Short has its own block)'],
  ];
  console.log(`\nPosting files for ${id}`);
  for (const [file, required, label] of items) {
    const ok = existsSync(file);
    console.log(`  [${ok ? 'x' : required ? ' ' : '-'}] ${file}  ${label}${!ok && !required ? ' (not applicable)' : ''}`);
    if (!ok && required) console.warn(`WARNING: ${file} is missing: ${label}`);
  }
  process.exit(0);
}

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
  // a horizontal video's cover is its YouTube thumbnail (yarn cover writes both files; style guide § 11.9.1)
  ...(info.format === 'horizontal'
    ? [
        [`${dir}/thumbnail.png`, info.cover, 'YouTube thumbnail, 3840 x 2160 PNG, desktop upload (yarn cover)'],
        [`${dir}/thumbnail-1280.jpg`, info.cover, 'YouTube thumbnail, 1280 x 720 JPG <= 2 MB, mobile fallback (yarn cover)'],
      ]
    : [[`${dir}/cover.png`, info.cover, 'TikTok / Instagram cover (yarn cover)']]),
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
if (existsSync(publish)) {
  const hasPoll = /^##+\s*Poll/im.test(readFileSync(publish, 'utf8'));
  console.log(`  [${hasPoll ? 'x' : ' '}] publish.md § Poll  poll for every post (all three platforms)`);
  if (!hasPoll) warnings.push('publish.md has no "## Poll" section (every post carries a poll; the publisher writes it)');
}
if (frame === null && existsSync(publish)) warnings.push('publish.md names no YouTube frame (no marker or "frame <n>" in ## Cover)');
if (info.chapters.length) {
  const hours = info.duration >= 3600;
  const lines = info.chapters.map((c, i) => `${stamp(i === 0 ? 0 : c.start, hours)} ${c.title}`);
  console.log(`\nYouTube chapters${info.estimated ? ' (ESTIMATED timings: redo after the voiceover)' : ''}:\n${lines.join('\n')}`);
  writeFileSync(`${dir}/chapters.txt`, `${lines.join('\n')}\n`);
  if (info.chapters.length < 3) warnings.push(`only ${info.chapters.length} chapter(s): YouTube needs at least 3 for chapter markers`);
  info.chapters.forEach((c, i) => {
    const end = info.chapters[i + 1]?.start ?? info.duration;
    if (end - (i === 0 ? 0 : c.start) < 10) warnings.push(`chapter ${i + 1} ("${c.title}") is under 10 s: YouTube ignores the markers`);
  });
  if (!existsSync(publish) || !/00:00/.test(readFileSync(publish, 'utf8'))) {
    warnings.push('publish.md has no chapter list (paste the lines above into the description, first line 00:00)');
  }
}
for (const w of warnings) console.warn(`WARNING: ${w}`);
