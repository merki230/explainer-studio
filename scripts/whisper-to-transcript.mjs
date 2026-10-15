// Use your OWN recording instead of TTS:
//   1. Put your recording at public/voiceover.mp3
//   2. pip install -U openai-whisper
//      whisper public/voiceover.mp3 --model small --word_timestamps True --output_format json --output_dir out
//   3. node scripts/whisper-to-transcript.mjs out/voiceover.json
import {readFileSync, writeFileSync} from 'node:fs';

const file = process.argv[2];
if (!file) {
  console.error('usage: node scripts/whisper-to-transcript.mjs <whisper.json> [audio file in public/]');
  process.exit(1);
}
const audio = process.argv[3] ?? 'voiceover.mp3';
const json = JSON.parse(readFileSync(file, 'utf8'));
const words = (json.segments ?? [])
  .flatMap((s) => s.words ?? [])
  .map((w) => ({text: w.word.trim(), start: +w.start.toFixed(3), end: +w.end.toFixed(3)}))
  .filter((w) => w.text.length > 0);

writeFileSync('src/data/transcript.json', JSON.stringify({audio, words}, null, 2));
console.log(`Wrote src/data/transcript.json (${words.length} words).`);
