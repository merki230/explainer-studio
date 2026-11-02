// Chapter-by-chapter recording for `yarn voiceover <slug> --by-chapter` (see voiceover.mjs for usage).
// Helpers (alignmentToWords, splitChapters, stitchWords, joinAudio) are pure or ffmpeg-only and tested offline;
// runByChapter does the paid requests.
import {spawnSync} from 'node:child_process';
import {existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {CHAPTER_BREAK_FRAMES, FPS} from '../src/theme.ts';
import {apiKey, norm, stripTags, withScriptText, writeTranscript} from './lib.mjs';

/** ElevenLabs character alignment -> words. Skips [tags] (and the characters returned for them) and ellipses. */
export const alignmentToWords = (alignment) => {
  const {characters, character_start_times_seconds: starts, character_end_times_seconds: ends} = alignment;
  const words = [];
  let cur = null;
  let depth = 0;
  const flush = () => {
    if (cur) words.push(cur);
    cur = null;
  };
  characters.forEach((ch, i) => {
    if (ch === '[') depth++;
    if (depth > 0) {
      if (ch === ']') depth--;
      flush();
      return;
    }
    if (/\s/.test(ch) || ch === '…') return flush();
    if (!cur) cur = {text: '', start: starts[i], end: ends[i]};
    cur.text += ch;
    cur.end = ends[i];
  });
  flush();
  // Remove "..." runs inside/at the edge of words; drop words that were only punctuation dots.
  return words
    .map((w) => ({text: w.text.replace(/\.{2,}/g, ''), start: +w.start.toFixed(3), end: +w.end.toFixed(3)}))
    .filter((w) => norm(w.text) !== '');
};

/**
 * Split a script/performance text into chapters: [{title, text}] where `text` is the chapter's spoken lines (tags kept,
 * `> Short hook:` lines dropped). Words before the first `## ` heading are folded into chapter 1. [] without headings.
 */
export const splitChapters = (text) => {
  const out = [];
  let lead = [];
  for (const line of text.split(/\r?\n/)) {
    const h = line.match(/^##\s+(.*\S)\s*$/);
    if (h) {
      out.push({title: h[1], lines: out.length ? [] : lead});
      continue;
    }
    if (/^>\s*Short hook:/i.test(line)) continue;
    (out.length ? out.at(-1).lines : lead).push(line);
  }
  return out.map((c) => ({title: c.title, text: c.lines.join('\n').trim()}));
};

/** Chapter break (word to word) in seconds: CHAPTER_BREAK_FRAMES / FPS = 3.9 s, from src/theme.ts (style-guide § 11.5.1). */
export const CHAPTER_BREAK_S = CHAPTER_BREAK_FRAMES / FPS;

/**
 * Silence to insert after each chapter but the last so the last word of a chapter and the first word of the next are
 * `target` seconds apart: target minus the take's own trailing silence (audio length - last word end, [pause] tags
 * included) minus the next take's leading silence. Never negative.
 */
export const breakGaps = (chapters, target) =>
  chapters.slice(0, -1).map((c, i) => {
    const trail = c.duration - (c.words.at(-1)?.end ?? 0);
    const lead = chapters[i + 1].words[0]?.start ?? 0;
    return +Math.max(0, target - trail - lead).toFixed(3);
  });

/**
 * Join chapter words onto one timeline. `chapters`: [{words, duration}] with times relative to each chapter's audio;
 * `gap` (a number, or one number per join) seconds of silence follow every chapter but the last. Returns {words, offsets}.
 */
export const stitchWords = (chapters, gap) => {
  const words = [];
  const offsets = [];
  let t = 0;
  for (const [i, c] of chapters.entries()) {
    offsets.push(+t.toFixed(3));
    for (const w of c.words) words.push({...w, start: +(w.start + t).toFixed(3), end: +(w.end + t).toFixed(3)});
    t += c.duration + (Array.isArray(gap) ? (gap[i] ?? 0) : gap);
  }
  return {words, offsets};
};

export const RATE = 44100;
const FADE_IN = 0.01;
const FADE_OUT = 0.025;

/** Decode any audio file to mono 16-bit samples at 44.1 kHz (Remotion's bundled ffmpeg: it has a wav muxer, no raw one). */
export const decode = (file) => {
  const tmp = mkdtempSync(`${tmpdir()}/vo-`);
  try {
    const wav = `${tmp}/x.wav`;
    const r = spawnSync('remotion', ['ffmpeg', '-hide_banner', '-loglevel', 'error', '-nostdin', '-y', '-i', file, '-ac', '1', '-ar', String(RATE), '-c:a', 'pcm_s16le', wav], {
      encoding: 'utf8',
    });
    if (r.status !== 0) throw new Error(`ffmpeg failed on ${file}:\n${(r.stderr || '').slice(-1500)}`);
    const b = readFileSync(wav);
    for (let i = 12; i + 8 <= b.length; ) {
      const size = b.readUInt32LE(i + 4);
      if (b.toString('ascii', i, i + 4) === 'data') {
        const n = Math.min(size, b.length - i - 8) >> 1;
        return new Int16Array(b.buffer.slice(b.byteOffset + i + 8, b.byteOffset + i + 8 + n * 2));
      }
      i += 8 + size + (size & 1);
    }
    throw new Error(`no audio data in ${file}`);
  } finally {
    rmSync(tmp, {recursive: true, force: true});
  }
};

/** Decoded length of an audio file in seconds (what the join will actually play). */
export const audioDuration = (file) => +(decode(file).length / RATE).toFixed(3);

/**
 * Join audio files with a gap of silence between them (none at the ends; `gap` is one number or one per join) into the mp3 `out`. Done on decoded
 * samples: each piece gets a 10 ms linear fade-in and 25 ms fade-out so a hard cut cannot click, everything is mono
 * 44.1 kHz. Fades keep lengths, so offsets from stitchWords stay exact (piece length = samples / 44100).
 */
export const joinAudio = (files, gap, out) => joinSamples(files.map(decode), gap, out);

/** joinAudio on already decoded pieces (Int16Array, mono 44.1 kHz); the pieces are faded in place. */
export const joinSamples = (decoded, gap, out) => {
  const gapSamples = decoded.map((_, i) => Math.round((Array.isArray(gap) ? (gap[i] ?? 0) : gap) * RATE));
  const pieces = decoded.map((x) => {
    const fi = Math.min(Math.round(FADE_IN * RATE), x.length);
    const fo = Math.min(Math.round(FADE_OUT * RATE), x.length);
    for (let i = 0; i < fi; i++) x[i] = Math.round(x[i] * (i / fi));
    for (let i = 0; i < fo; i++) x[x.length - 1 - i] = Math.round(x[x.length - 1 - i] * (i / fo));
    return x;
  });
  const total = pieces.reduce((a, x) => a + x.length, 0) + gapSamples.slice(0, -1).reduce((a, g) => a + g, 0);
  const all = new Int16Array(total);
  let at = 0;
  for (const [i, x] of pieces.entries()) {
    all.set(x, at);
    at += x.length + gapSamples[i];
  }
  mkdirSync(out.replace(/\/[^/]*$/, ''), {recursive: true});
  const r = spawnSync('remotion', ['ffmpeg', '-hide_banner', '-loglevel', 'error', '-nostdin', '-y', '-f', 's16le', '-ar', String(RATE), '-ac', '1', '-i', 'pipe:0', '-c:a', 'libmp3lame', '-b:a', '128k', out], {
    input: Buffer.from(all.buffer),
    maxBuffer: 1 << 28,
  });
  if (r.status !== 0) throw new Error(`ffmpeg failed:\n${String(r.stderr).slice(-1500)}`);
};

const clip = (s, n, tail) => (s.length <= n ? s : tail ? s.slice(-n) : s.slice(0, n));

/**
 * ctx: {paths, take, voiceId, modelId, dryRun, gap, chapter, joinOnly, scriptText, perfText}
 * Chapter takes live in out/<slug>/raw/voices/chapters/<take|live>/ch<n>.{mp3,json}; the join goes to the live files
 * (or voices/<take>.mp3 + .transcript.json with --take).
 */
export const runByChapter = async (ctx) => {
  const {paths, take, voiceId, modelId, dryRun, gap, chapter, joinOnly, scriptText, perfText} = ctx;
  const fromScript = splitChapters(scriptText);
  if (!fromScript.length) {
    console.error('--by-chapter needs a script with "## " chapter headings.');
    process.exit(1);
  }
  const source = perfText ? 'performance.txt' : 'script.txt';
  const sent = perfText ? splitChapters(perfText) : fromScript;
  if (sent.length !== fromScript.length) {
    console.error(`performance.txt has ${sent.length} chapters, script.txt ${fromScript.length}. Keep the "## " lines in step.`);
    process.exit(1);
  }
  const N = sent.length;
  if (chapter !== null && (chapter < 1 || chapter > N)) {
    console.error(`--chapter must be 1..${N}.`);
    process.exit(1);
  }
  const dir = `${paths.takesDir}/chapters/${take ?? 'live'}`;
  const f = (n, ext) => `${dir}/ch${n}.${ext}`;
  const todo = joinOnly ? [] : chapter === null ? sent.map((_, i) => i + 1) : [chapter];

  // Plan: a full run chains previous_request_ids (the 3 latest ids from this run) and sends next_text; a single
  // chapter uses previous_text/next_text from the neighbouring chapters (saved ids may be older than the 2 h limit).
  const body = (n, ids) => {
    const b = {text: sent[n - 1].text, model_id: modelId, voice_settings: ctx.voice_settings};
    if (n < N) b.next_text = clip(sent[n].text, 1000, false);
    if (chapter === null && ids.length) b.previous_request_ids = ids.slice(-3);
    else if (n > 1) b.previous_text = clip(sent[n - 2].text, 1000, true);
    return b;
  };

  if (dryRun) {
    console.log(`DRY RUN (nothing sent). ${N} chapters from ${source}, voice ${voiceId}, model ${modelId}, last word to next first word ${gap}s (silence already in each take counts; the join adds only the rest).`);
    console.log(`Chapter takes: ${dir}/ch<n>.mp3 + .json. Join: ${take ? `${paths.takesDir}/${take}.mp3` : paths.audioFile}.\n`);
    let total = 0;
    const ids = [];
    sent.forEach((c, i) => {
      const n = i + 1;
      const b = body(n, ids);
      const before = ids.slice(-3);
      if (todo.includes(n)) {
        total += c.text.length;
        ids.push(`id(ch${n})`);
      }
      const ctxs = [
        b.previous_request_ids && `previous_request_ids=[${before.join(', ')}]`,
        b.previous_text && `previous_text (${b.previous_text.length} chars of chapter ${n - 1})`,
        b.next_text && `next_text (${b.next_text.length} chars of chapter ${n + 1})`,
      ].filter(Boolean);
      const mark = todo.includes(n) ? `REQUEST ${todo.indexOf(n) + 1}` : existsSync(f(n, 'mp3')) ? 'saved take, reused' : 'NOT RECORDED YET';
      console.log(`--- chapter ${n}: ${c.title}\n${mark}; ${c.text.length} characters${ctxs.length ? '; ' + ctxs.join('; ') : ''}\n\n${c.text}\n`);
    });
    console.log(`${todo.length} request(s), ${total} characters in total.${sent.some((c) => c.text.length > 10000) ? ' WARNING: a chapter is over the 10,000 character limit of eleven_v4.' : ''}`);
    return;
  }

  mkdirSync(dir, {recursive: true});
  if (todo.length) {
    const key = apiKey();
    console.log(`Voice ${voiceId}, model ${modelId}, text from ${source}: ${todo.length} request(s).`);
    const ids = [];
    let used = 0;
    for (const n of todo) {
      const b = body(n, ids);
      process.stdout.write(`chapter ${n}/${N} (${sent[n - 1].text.length} characters)... `);
      const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/with-timestamps`, {
        method: 'POST',
        headers: {'xi-api-key': key, 'Content-Type': 'application/json'},
        body: JSON.stringify(b),
      });
      if (!res.ok) {
        console.error(`\nElevenLabs ${res.status}: ${await res.text()}\nChapters recorded so far are kept in ${dir}; resume with --chapter ${n}.`);
        process.exit(1);
      }
      const requestId = res.headers.get('request-id');
      used += Number(res.headers.get('x-character-count') ?? 0);
      if (requestId) ids.push(requestId);
      const data = await res.json();
      let words = alignmentToWords(data.alignment);
      const spelled = withScriptText(words, fromScript[n - 1].text);
      words = spelled.words;
      const expected = stripTags(sent[n - 1].text).split(' ').map(norm).filter(Boolean);
      if (expected.join(' ') !== words.map((w) => norm(w.text)).join(' ')) {
        console.warn(`\nWARNING: chapter ${n} transcript words differ from the text sent (${words.length} vs ${expected.length} words).`);
      }
      if (!spelled.applied) console.warn(`\nWARNING: chapter ${n} word count differs from script.txt (${words.length} vs ${spelled.scriptCount}); script spelling not applied.`);
      writeFileSync(f(n, 'mp3'), Buffer.from(data.audio_base64, 'base64'));
      writeFileSync(f(n, 'json'), JSON.stringify({title: sent[n - 1].title, requestId, model: modelId, words}, null, 2));
      console.log('saved.');
    }
    console.log(`Characters used: ${used || 'unknown'}.`);
  }

  const missing = sent.map((_, i) => i + 1).filter((n) => !existsSync(f(n, 'mp3')) || !existsSync(f(n, 'json')));
  if (missing.length) {
    console.log(`Join skipped: chapter(s) ${missing.join(', ')} not recorded yet in ${dir}. Record them with --chapter <n>.`);
    return;
  }
  const parts = sent.map((_, i) => ({words: JSON.parse(readFileSync(f(i + 1, 'json'), 'utf8')).words, duration: audioDuration(f(i + 1, 'mp3'))}));
  const gaps = breakGaps(parts, gap);
  gaps.forEach((g, i) => {
    if (g === 0) console.warn(`WARNING: chapters ${i + 1} and ${i + 2} already have more than ${gap}s of silence between their words; nothing added.`);
  });
  const {words, offsets} = stitchWords(parts, gaps);
  const audioOut = take ? `${paths.takesDir}/${take}.mp3` : paths.audioFile;
  joinAudio(sent.map((_, i) => f(i + 1, 'mp3')), gaps, audioOut);
  const doc = {audio: 'audio/voiceover.mp3', words};
  if (take) writeFileSync(`${paths.takesDir}/${take}.transcript.json`, JSON.stringify(doc, null, 2));
  else writeTranscript(paths, doc);
  const total = audioDuration(audioOut);
  console.log(`Joined ${N} chapters (word-to-word break ${gap}s, silence added: ${gaps.join(', ')}) into ${audioOut}: ${words.length} words, ${total}s. Chapter offsets: ${offsets.join(', ')}.`);
  if (Math.abs(total - (offsets.at(-1) + parts.at(-1).duration)) > 0.1) console.warn('WARNING: joined length differs from the planned length by more than 0.1 s.');
};
