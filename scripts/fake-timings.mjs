// Generates approximate word timings from script.txt so you can preview and
// lay out scenes BEFORE recording a voiceover. Real timings come later from
// `yarn voiceover` (ElevenLabs) or `yarn from-whisper` (your own recording).
//
// usage: yarn timings <slug>
// A long-form script's `## chapter` and `> Short hook:` lines are not spoken: they get no words. Chapter boundaries
// go into transcript.json (`chapters`), and each Short hook line gets its own estimated timings (`hooks.<n>`,
// times from 0, `audio: null` until `yarn voiceover <slug> --hook <n>`).
import {readFileSync} from 'node:fs';
import {chaptersFor, spokenOf, videoPaths, writeTranscript} from './lib.mjs';

const paths = videoPaths(process.argv[2], 'yarn timings <slug>');
const raw = readFileSync(paths.script, 'utf8');
const text = spokenOf(raw).trim();

/** Estimated word times for a text, starting at `t0` seconds. */
const estimate = (source, t0) => {
  const words = [];
  let t = t0;
  for (const word of source.split(/\s+/).filter(Boolean)) {
    const letters = word.replace(/[^\p{L}\p{N}]/gu, '').length;
    const dur = 0.12 + letters * 0.05;
    words.push({text: word, start: +t.toFixed(3), end: +(t + dur).toFixed(3)});
    t += dur + 0.04;
    if (/[.!?]$/.test(word)) t += 0.32;
    else if (/[,;:]$/.test(word)) t += 0.16;
  }
  return {words, end: t};
};

const {words, end} = estimate(text, 0.15);
const hooks = {};
chaptersFor(raw, words).forEach((c, i) => {
  if (c.hook) hooks[i + 1] = {audio: null, words: estimate(c.hook, 0.15).words};
});
const out = writeTranscript(paths, {audio: null, words}, hooks);
const note = out.chapters ? `, ${out.chapters.length} chapters, ${Object.keys(hooks).length} Short hook line(s)` : '';
console.log(`Wrote ${paths.transcript} — ${words.length} words, ~${end.toFixed(1)}s (no audio)${note}.`);
