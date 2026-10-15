// Generates approximate word timings from script.txt so you can preview and
// lay out scenes BEFORE recording a voiceover. Real timings come later from
// `yarn voiceover` (ElevenLabs) or `yarn from-whisper` (your own recording).
//
// usage: yarn timings <slug>
import {readFileSync, writeFileSync} from 'node:fs';
import {videoPaths} from './lib.mjs';

const paths = videoPaths(process.argv[2], 'yarn timings <slug>');
const text = readFileSync(paths.script, 'utf8').trim();

const words = [];
let t = 0.15;
for (const raw of text.split(/\s+/)) {
  const letters = raw.replace(/[^\p{L}\p{N}]/gu, '').length;
  const dur = 0.12 + letters * 0.05;
  words.push({text: raw, start: +t.toFixed(3), end: +(t + dur).toFixed(3)});
  t += dur + 0.04;
  if (/[.!?]$/.test(raw)) t += 0.32;
  else if (/[,;:]$/.test(raw)) t += 0.16;
}

writeFileSync(paths.transcript, JSON.stringify({audio: null, words}, null, 2));
console.log(`Wrote ${paths.transcript} — ${words.length} words, ~${t.toFixed(1)}s (no audio).`);
