// Use your OWN recording instead of TTS:
//   1. Put your recording at public/<slug>/voiceover.mp3
//   2. pip install -U openai-whisper
//      whisper public/<slug>/voiceover.mp3 --model small --word_timestamps True --output_format json --output_dir out
//   3. yarn from-whisper <slug> out/voiceover.json
import {readFileSync, writeFileSync} from 'node:fs';
import {videoPaths} from './lib.mjs';

const usage = 'yarn from-whisper <slug> <whisper.json>';
const paths = videoPaths(process.argv[2], usage);
const file = process.argv[3];
if (!file) {
  console.error(`usage: ${usage}`);
  process.exit(1);
}
const json = JSON.parse(readFileSync(file, 'utf8'));
const words = (json.segments ?? [])
  .flatMap((s) => s.words ?? [])
  .map((w) => ({text: w.word.trim(), start: +w.start.toFixed(3), end: +w.end.toFixed(3)}))
  .filter((w) => w.text.length > 0);

writeFileSync(paths.transcript, JSON.stringify({audio: paths.audio, words}, null, 2));
console.log(`Wrote ${paths.transcript} (${words.length} words).`);
