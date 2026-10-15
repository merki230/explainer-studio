// Generates approximate word timings from script.txt so you can preview and
// lay out scenes BEFORE recording a voiceover. Real timings come later from
// `npm run voiceover` (ElevenLabs) or `npm run from-whisper` (your own recording).
//
// usage: node scripts/fake-timings.mjs [script.txt]
import {readFileSync, writeFileSync} from 'node:fs';

const file = process.argv[2] ?? 'script.txt';
const text = readFileSync(file, 'utf8').trim();

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

writeFileSync('src/data/transcript.json', JSON.stringify({audio: null, words}, null, 2));
console.log(`Wrote src/data/transcript.json — ${words.length} words, ~${t.toFixed(1)}s (no audio).`);
