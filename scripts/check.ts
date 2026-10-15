// Fast sanity check for every video (or one): resolves cues against the
// transcript and flags common mistakes (stale timings, missing audio or
// sources, unsupported claims), without opening the Studio.
//
// usage: yarn check [slug]
import {existsSync, readFileSync} from 'node:fs';
import {FADE, FPS} from '../src/theme';
import {resolveTimeline} from '../src/timeline';
import {VIDEOS} from '../src/videos';
import {listVideos} from './lib.mjs';

const norm = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '');
const only = process.argv[2];
let failed = false;

for (const folder of listVideos()) {
  if (!VIDEOS[folder]) console.warn(`! src/videos/${folder}/ is not registered in src/videos/index.ts`);
}

for (const [slug, {spec, transcript}] of Object.entries(VIDEOS)) {
  if (only && slug !== only) continue;
  const errors: string[] = [];
  const warnings: string[] = [];
  const words = transcript.words;

  // Script edited but timings not regenerated?
  const scriptFile = `src/videos/${slug}/script.txt`;
  if (existsSync(scriptFile)) {
    const scriptWords = readFileSync(scriptFile, 'utf8').split(/\s+/).map(norm).filter(Boolean);
    const said = words.map((w) => norm(w.text)).filter(Boolean);
    if (scriptWords.join(' ') !== said.join(' ')) {
      warnings.push(`script.txt and transcript.json differ. Run "yarn timings ${slug}" (or redo the voiceover).`);
    }
  }

  const sourcesFile = `src/videos/${slug}/sources.md`;
  if (!existsSync(sourcesFile)) warnings.push('no sources.md yet (see docs/sources-format.md).');
  else {
    const unsupported = (readFileSync(sourcesFile, 'utf8').match(/\*\*Status:\*\*\s*❌/g) ?? []).length;
    if (unsupported) warnings.push(`${unsupported} unsupported (❌) claim(s) in sources.md.`);
  }

  if (!transcript.audio) warnings.push('no audio yet (estimated timings).');
  else if (!existsSync(`public/${transcript.audio}`)) errors.push(`audio file public/${transcript.audio} is missing.`);

  try {
    const tl = resolveTimeline(spec, words, FPS);
    tl.scenes.forEach((s, i) => {
      const secs = (s.endFrame - s.startFrame) / FPS;
      if (s.endFrame - s.startFrame <= FADE * 2) {
        warnings.push(`scene ${i + 1} (${s.scene}) is only ${secs.toFixed(2)}s long.`);
      }
    });
    const secs = tl.durationInFrames / FPS;
    console.log(`${slug}: ${tl.scenes.length} scenes, ${words.length} words, ${secs.toFixed(1)}s`);
  } catch (e) {
    errors.push((e as Error).message);
    console.log(`${slug}:`);
  }

  warnings.forEach((w) => console.log(`  warn  ${w}`));
  errors.forEach((e) => console.log(`  ERROR ${e}`));
  if (errors.length) failed = true;
}

if (only && !VIDEOS[only]) {
  console.error(`No registered video "${only}".`);
  failed = true;
}
process.exit(failed ? 1 : 0);
