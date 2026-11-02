// Free post-step: add real pauses to a recorded --by-chapter voiceover take (eleven_v4 has no speed setting and
// mostly ignores "..." marks). Local only, no API call, never touches the live audio.
//
// usage: yarn voiceover:pace <slug> --take <name> [--marked <s>] [--sentence <s>] [--chapter-sentence <n>=<s>]
//                            [--out <name>] [--dry-run]
//   --take <name>               the saved take to start from (chapter takes in out/<slug>/raw/voices/chapters/<name>/)
//   --marked <s>                minimum word-to-word gap at each "..." in performance.txt (default 0.5)
//   --sentence <s>              minimum gap after each sentence end (. ? ! in script.txt) (default 0.35)
//   --chapter-sentence <n>=<s>  sentence minimum for chapter n only (repeatable), e.g. --chapter-sentence 1=0.5
//   --out <name>                name of the new take (default <name>-paced)
//   --dry-run                   print the plan and numbers, write nothing
// Rules: a gap is only ever lengthened, by the difference to the minimum (marked and sentence do not add up: the
// larger minimum wins). A "..." after a chapter's last word is skipped (the chapter break handles it). Silence goes
// in at the middle of the quietest stretch of the existing gap (longest run of 10 ms
// windows with RMS under QUIET, searched from 50 ms before the word end to 300 ms after the next word's start); 3 ms fades guard every cut. Chapters are then re-joined with the usual chapter break (3.9 s word to word).
// Output: out/<slug>/raw/voices/<out>.mp3 + <out>.transcript.json (all word times shifted). Copy into place with
// `yarn voiceover:use <slug> <out>`. The source take is never changed.
import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import {decode, audioDuration, breakGaps, CHAPTER_BREAK_S, joinSamples, RATE, splitChapters, stitchWords} from './voiceover-chapters.mjs';
import {norm, videoPaths} from './lib.mjs';

const QUIET = 300; // RMS (of 32768) under which a 10 ms window counts as quiet
const WIN = 2 * Math.round(0.005 * RATE);
const CUT_FADE = Math.round(0.003 * RATE);

/** Which word gaps want a minimum: [{after: wordIndex, marked?: true, sentence?: true}]. Never the chapter's last word. */
export const gapPlan = (words, perfChapterText) => {
  const marked = new Set();
  if (perfChapterText !== undefined) {
    const toks = perfChapterText.replace(/\[[^\]]*\]/g, ' ').split(/\s+/).filter(Boolean);
    let n = 0;
    for (const t of toks) {
      const dots = /…|\.{2,}/.test(t);
      const hasWord = norm(t) !== '';
      if (hasWord) n++;
      if (dots && n > 0 && !/^(…|\.{2,})\S/.test(t)) marked.add(n - 1);
    }
    if (n !== words.length) throw new Error(`performance chapter has ${n} words, take has ${words.length}`);
  }
  return words.slice(0, -1).map((w, i) => ({after: i, marked: marked.has(i), sentence: /[.?!]["')”’]*$/.test(w.text)})).filter((g) => g.marked || g.sentence);
};

const rms = (x, a, b) => {
  a = Math.max(0, a);
  b = Math.min(x.length, b);
  let s = 0;
  for (let i = a; i < b; i++) s += x[i] * x[i];
  return b > a ? Math.sqrt(s / (b - a)) : Infinity;
};

/**
 * Where to cut for the gap between two words. The API's word times are only roughly right (the real silence can sit a
 * little after the "start" of the next word), so the search window is [a.end - 50 ms, b.start + 300 ms] (never past b.end).
 * Finds the longest run of quiet 10 ms windows (RMS < QUIET) there and cuts in its middle; {cut, quiet, run} with
 * `run` the measured silence in samples. With no quiet run it cuts at the quietest spot ({quiet: false}).
 */
export const cutPoint = (x, a, b) => {
  const from = Math.max(0, Math.round((a.end - 0.05) * RATE));
  const to = Math.min(x.length - 1, Math.round(Math.min(b.start + 0.3, b.end) * RATE));
  const step = 88;
  let best = {len: 0, from: 0, to: 0};
  let run = null;
  let quietest = {r: Infinity, c: Math.round(((a.end + b.start) / 2) * RATE)};
  for (let c = from; c <= to; c += step) {
    const r = rms(x, c - WIN / 2, c + WIN / 2);
    if (r < quietest.r) quietest = {r, c};
    if (r < QUIET) {
      run = run ?? {from: c, to: c};
      run.to = c;
      if (run.to - run.from > best.len) best = {len: run.to - run.from, from: run.from, to: run.to};
    } else run = null;
  }
  if (best.len > 0 || quietest.r < QUIET) {
    const c = best.len > 0 ? Math.round((best.from + best.to) / 2) : quietest.c;
    return {cut: c, quiet: true, run: best.len + WIN};
  }
  return {cut: quietest.c, quiet: false, run: 0};
};

/**
 * Lengthen gaps in one chapter. `want`: [{after, min}] sorted by word. Returns {samples, words, inserted, loud}.
 * Silence is added at the cut, 3 ms fades on both sides; later words shift by what was inserted before them.
 */
export const padChapter = (x, words, want) => {
  x = Int16Array.from(x);
  const parts = [];
  const out = words.map((w) => ({...w}));
  let last = 0;
  let shift = 0;
  let inserted = 0;
  let loud = 0;
  for (const {after, min} of want) {
    const a = words[after];
    const b = words[after + 1];
    const {cut, quiet, run} = cutPoint(x, a, b);
    const need = min - Math.max(b.start - a.end, run / RATE);
    if (need <= 0.002) continue;
    if (!quiet) {
      loud++;
      console.warn(`  not quiet: "${a.text} ${b.text}" at ${a.end}s (cut at the quietest spot, 3 ms fades)`);
    }
    const add = Math.round(need * RATE);
    const piece = x.slice(last, cut);
    for (let i = 0; i < Math.min(CUT_FADE, piece.length); i++) piece[piece.length - 1 - i] = Math.round(piece[piece.length - 1 - i] * (i / CUT_FADE));
    parts.push(piece, new Int16Array(add));
    const next = x.slice(cut, Math.min(cut + CUT_FADE, x.length));
    for (let i = 0; i < next.length; i++) next[i] = Math.round(next[i] * (i / CUT_FADE));
    x.set(next, cut);
    last = cut;
    shift += add / RATE;
    inserted++;
    for (let j = after + 1; j < words.length; j++) {
      out[j].start = +(words[j].start + shift).toFixed(3);
      out[j].end = +(words[j].end + shift).toFixed(3);
    }
  }
  parts.push(x.slice(last));
  const samples = new Int16Array(parts.reduce((s, p) => s + p.length, 0));
  let at = 0;
  for (const p of parts) {
    samples.set(p, at);
    at += p.length;
  }
  return {samples, words: out, inserted, loud, added: +shift.toFixed(3)};
};

const wpm = (words, dur) => Math.round(words.length / (dur / 60));
const speech = (words) => words.at(-1).end - words[0].start;

const main = () => {
  const args = process.argv.slice(2);
  const usage = 'yarn voiceover:pace <slug> --take <name> [--marked <s>] [--sentence <s>] [--chapter-sentence <n>=<s>] [--out <name>] [--dry-run]';
  const flag = (name, all = false) => {
    const vals = [];
    for (let i = args.indexOf(name); i >= 0; i = args.indexOf(name)) {
      vals.push(args[i + 1]);
      args.splice(i, 2);
    }
    return all ? vals : vals[0];
  };
  const dryRun = args.includes('--dry-run');
  if (dryRun) args.splice(args.indexOf('--dry-run'), 1);
  const take = flag('--take');
  const marked = Number(flag('--marked') ?? 0.5);
  const sentence = Number(flag('--sentence') ?? 0.35);
  const outName = flag('--out') ?? `${take}-paced`;
  const per = new Map(flag('--chapter-sentence', true).map((v) => v.split('=')).map(([n, s]) => [Number(n), Number(s)]));
  const paths = videoPaths(args[0], usage);
  const bad = [marked, sentence, ...per.values()].some((v) => !Number.isFinite(v) || v < 0 || v > 5);
  if (!take || bad || [...per.keys()].some((n) => !Number.isInteger(n))) {
    console.error(`--take is required; pauses are seconds (0..5); --chapter-sentence is n=<s>. usage: ${usage}`);
    process.exit(1);
  }
  if (outName === take) {
    console.error('--out must differ from --take (a take is never overwritten).');
    process.exit(1);
  }
  const dir = `${paths.takesDir}/chapters/${take}`;
  const perf = existsSync(paths.performance) ? splitChapters(readFileSync(paths.performance, 'utf8')) : null;
  if (!perf) console.warn('No performance.txt: no marked pauses, sentence gaps only.');
  const chapters = [];
  for (let n = 1; existsSync(`${dir}/ch${n}.mp3`); n++) chapters.push(n);
  if (!chapters.length) {
    console.error(`No chapter takes in ${dir} (make them with yarn voiceover <slug> --by-chapter --take ${take}).`);
    process.exit(1);
  }
  if (perf && perf.length !== chapters.length) throw new Error(`performance.txt has ${perf.length} chapters, take has ${chapters.length}`);

  const rows = [];
  const parts = [];
  const before = [];
  for (const n of chapters) {
    const doc = JSON.parse(readFileSync(`${dir}/ch${n}.json`, 'utf8'));
    const x = decode(`${dir}/ch${n}.mp3`);
    const plan = gapPlan(doc.words, perf?.[n - 1].text);
    const sMin = per.get(n) ?? sentence;
    const want = plan.map((g) => ({after: g.after, min: Math.max(g.marked ? marked : 0, g.sentence ? sMin : 0)}));
    const r = padChapter(x, doc.words, want);
    const dur = +(r.samples.length / RATE).toFixed(3);
    before.push({n, words: doc.words, dur: x.length / RATE});
    rows.push({n, count: doc.words.length, r, dur, plan});
    parts.push({words: r.words, duration: dur, samples: r.samples});
  }
  const origParts = before.map((b) => ({words: b.words, duration: b.dur}));
  const gaps = breakGaps(parts, CHAPTER_BREAK_S);
  const oldGaps = breakGaps(origParts, CHAPTER_BREAK_S);
  const {words, offsets} = stitchWords(parts, gaps);
  const newTotal = offsets.at(-1) + parts.at(-1).duration;
  const oldTotal = stitchWords(origParts, oldGaps);
  const oldLen = oldTotal.offsets.at(-1) + origParts.at(-1).duration;
  console.log(`Pacing take "${take}" -> "${outName}": marked >= ${marked}s, sentence >= ${sentence}s${per.size ? ` (chapter overrides ${[...per].map(([n, s]) => `${n}=${s}`).join(', ')})` : ''}.`);
  console.log('chapter  words  speech(s) before->after   wpm before->after   pauses  added(s)  non-quiet cuts');
  for (const [i, w] of rows.entries()) {
    const b = before[i];
    console.log(
      `ch${w.n}      ${String(w.count).padStart(5)}  ${speech(b.words).toFixed(1).padStart(7)} -> ${speech(w.r.words).toFixed(1).padEnd(7)}  ${String(wpm(b.words, speech(b.words))).padStart(8)} -> ${String(wpm(w.r.words, speech(w.r.words))).padEnd(6)}  ${String(w.r.inserted).padStart(6)}  ${w.r.added.toFixed(2).padStart(8)}  ${String(w.r.loud).padStart(14)}`,
    );
  }
  const totalWords = rows.reduce((s, r) => s + r.count, 0);
  console.log(`total: ${oldLen.toFixed(1)}s -> ${newTotal.toFixed(1)}s, ${rows.reduce((s, r) => s + r.r.inserted, 0)} pauses inserted, ${totalWords} words, chapter breaks add ${gaps.join(', ')}s (was ${oldGaps.join(', ')}).`);
  if (dryRun) return console.log('DRY RUN: nothing written.');
  const mp3 = `${paths.takesDir}/${outName}.mp3`;
  joinSamples(parts.map((p) => p.samples), gaps, mp3);
  writeFileSync(`${paths.takesDir}/${outName}.transcript.json`, JSON.stringify({audio: paths.audio, words}, null, 2));
  const got = audioDuration(mp3);
  console.log(`Wrote ${mp3} (${got}s) and ${outName}.transcript.json. Put it in place with: yarn voiceover:use ${args[0]} ${outName}`);
  if (Math.abs(got - newTotal) > 0.1) console.warn('WARNING: joined length differs from the planned length by more than 0.1 s.');
};

if (import.meta.url === `file://${process.argv[1]}`) main();
