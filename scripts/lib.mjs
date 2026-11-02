// Shared helpers for the per-video scripts.
import {execFileSync} from 'node:child_process';
import {existsSync, readdirSync, readFileSync, writeFileSync} from 'node:fs';

// Load secrets from .env (ELEVENLABS_API_KEY, ...) when it exists.
if (existsSync('.env')) process.loadEnvFile('.env');

export const listVideos = () =>
  readdirSync('src/videos', {withFileTypes: true})
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

/** Paths for one video. Exits with a helpful message if the slug is unknown. */
export const videoPaths = (slug, usage) => {
  if (!slug) {
    console.error(`usage: ${usage}\nvideos: ${listVideos().join(', ')}`);
    process.exit(1);
  }
  const dir = `src/videos/${slug}`;
  if (!existsSync(dir)) {
    console.error(`No video "${slug}" in src/videos/. Create one with: yarn new ${slug}`);
    process.exit(1);
  }
  return {
    dir,
    script: `${dir}/script.txt`,
    transcript: `${dir}/transcript.json`,
    // Audio lives in the video folder. `audio` (what transcript.json stores) is relative to `dir`.
    audioDir: `${dir}/audio`,
    audio: 'audio/voiceover.mp3',
    audioFile: `${dir}/audio/voiceover.mp3`,
    releaseDir: `${dir}/release`,
    performance: `${dir}/performance.txt`,
    voice: `${dir}/voice.json`,
    takesDir: `out/${slug}/raw/voices`,
  };
};

/** Remove audio tags like [pause] and ellipses from performance text. */
export const stripTags = (text) =>
  text
    .replace(/\[[^\]]*\]/g, ' ')
    .replace(/\u2026|\.{2,}/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .join(' ');

/** Lowercase letters/digits only, for comparing words ignoring punctuation. */
export const norm = (s) => s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '');

/** Require ELEVENLABS_API_KEY or exit. Never print it. */
export const apiKey = () => {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) {
    console.error('Set ELEVENLABS_API_KEY in .env first (see .env.example).');
    process.exit(1);
  }
  return key;
};

/** Parse src/videos/<slug>/voice.json if present. */
export const readVoiceConfig = (paths) =>
  existsSync(paths.voice) ? JSON.parse(readFileSync(paths.voice, 'utf8')) : {};

/**
 * Long-form script layout (brand.md § Structure › Long-form): a line `## <chapter question>` opens a chapter and a
 * line `> Short hook: <text>` (under its heading) is that chapter's Short hook. Neither is spoken, so neither
 * reaches the voice, the timings, the captions or the word comparisons. A script with none of these lines parses
 * to itself (`spoken` is the text, `chapters` is empty), so older videos are untouched.
 * Returns {spoken, chapters: [{title, hook?, tokens}], lead}: `tokens` is how many spoken words come before the
 * chapter (audio tags and ellipses not counted), `lead` the spoken words before the first heading.
 */
export const parseScript = (text) => {
  /** @type {{title: string; tokens: number; hook?: string}[]} */
  const chapters = [];
  const kept = [];
  let tokens = 0;
  let lead = null;
  for (const line of text.split(/\r?\n/)) {
    const h = line.match(/^##\s+(.*\S)\s*$/);
    if (h) {
      if (lead === null) lead = tokens;
      chapters.push({title: h[1], tokens});
      continue;
    }
    const k = line.match(/^>\s*Short hook:\s*(.*\S)\s*$/i);
    if (k) {
      if (chapters.length) chapters.at(-1).hook = k[1];
      continue;
    }
    kept.push(line);
    tokens += stripTags(line).split(' ').filter((w) => norm(w) !== '').length;
  }
  return {spoken: kept.join('\n'), chapters, lead: lead ?? 0};
};

/** The spoken words of a script or performance text (headings and hook lines removed). */
export const spokenOf = (text) => parseScript(text).spoken;

/** Path (relative to the video folder) of a Short's hook-line voice file. */
export const hookAudioPath = (n) => `audio/short-${n}-hook.mp3`;

/**
 * Chapters for transcript.json: `{title, word, start, hook?}`, `word` the index of the chapter's first word in
 * `words` and `start` its time. [] when the script has no `##` lines (then nothing is written).
 */
export const chaptersFor = (scriptText, words) => {
  const {chapters} = parseScript(scriptText);
  const spokenIdx = words.map((w, i) => (norm(w.text) !== '' ? i : -1)).filter((i) => i >= 0);
  return chapters.map((c) => {
    const word = Math.min(spokenIdx[c.tokens] ?? words.length - 1, words.length - 1);
    return {
      title: c.title,
      word,
      start: words[word]?.start ?? 0,
      ...(c.hook ? {hook: stripTags(c.hook)} : {}),
    };
  });
};

/**
 * Write transcript.json: `{audio, words}` plus, for a script with chapters, `chapters` (see chaptersFor). Keeps
 * an existing `hooks` entry (the Shorts' hook-line voice, see `yarn voiceover <slug> --hook <n>`) unless `hooks`
 * is given. A script without chapters gets exactly `{audio, words}`, as before.
 */
export const writeTranscript = (paths, {audio, words}, hooks) => {
  const out = {audio, words};
  if (existsSync(paths.script)) {
    const chapters = chaptersFor(readFileSync(paths.script, 'utf8'), words);
    if (chapters.length) out.chapters = chapters;
  }
  const kept = hooks ?? (existsSync(paths.transcript) ? JSON.parse(readFileSync(paths.transcript, 'utf8')).hooks : undefined);
  if (kept && out.chapters) out.hooks = kept;
  writeFileSync(paths.transcript, JSON.stringify(out, null, 2));
  return out;
};

/**
 * Take each word's text (with punctuation) from script.txt, keep timings from the alignment.
 * Only when the word counts match; otherwise returns the words unchanged. Headings and hook lines are skipped.
 */
export const withScriptText = (words, scriptText) => {
  const tokens = spokenOf(scriptText).split(/\s+/).filter(Boolean);
  if (tokens.length !== words.length) return {words, applied: false, scriptCount: tokens.length};
  return {words: words.map((w, i) => ({...w, text: tokens[i]})), applied: true, scriptCount: tokens.length};
};

/** Scratch files (raw mix, takes, stills, reviews): git-ignored. The posting files are in src/videos/<slug>/release/. */
export const rawDir = (slug) => `out/${slug}/raw`;

/**
 * Takes `--short <n>` (a Short cut from chapter n of a long-form video) out of `args`; returns n or null.
 * Exits on a bad value.
 */
export const takeShort = (args) => {
  const i = args.indexOf('--short');
  if (i < 0) return null;
  const n = Number(args[i + 1]);
  args.splice(i, 2);
  if (!Number.isInteger(n) || n < 1) {
    console.error('--short needs a chapter number (1, 2, ...).');
    process.exit(1);
  }
  return n;
};

/** Composition id (also the file stem of the render): the slug, or `<slug>-short-<n>` for a Short. */
export const compId = (slug, short = null) => (short === null ? slug : `${slug}-short-${short}`);

/**
 * Facts about a video from the TypeScript registry (`scripts/info.ts`): {format, sandbox, cover, shorts, chapters,
 * estimated, duration}. Takes a second or two (it starts tsx).
 */
export const videoInfo = (slug) =>
  JSON.parse(execFileSync('tsx', ['scripts/info.ts', slug], {encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit']}));

/** True when the video's spec.ts sets `cover` (so a `<slug>-cover` composition exists). */
export const hasCover = (slug) => videoInfo(slug).cover;
