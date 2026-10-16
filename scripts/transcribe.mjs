// Speech-to-text with ElevenLabs Scribe v2 (word timestamps) -> transcript.json in our format.
// Use for human recordings. COSTS CREDITS (billed per audio minute).
//
// usage: yarn transcribe <slug> [audio-file]
// Default audio: src/videos/<slug>/audio/voiceover.mp3. Writes src/videos/<slug>/transcript.json.
// Words are Scribe's own spelling; replaced by script.txt's text when word counts match; otherwise "yarn check" will warn.
import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import {basename} from 'node:path';
import {apiKey, videoPaths, withScriptText} from './lib.mjs';

const paths = videoPaths(process.argv[2], 'yarn transcribe <slug> [audio-file]');
const file = process.argv[3] ?? paths.audioFile;
const key = apiKey();

const form = new FormData();
form.append('model_id', 'scribe_v2');
form.append('timestamps_granularity', 'word');
form.append('tag_audio_events', 'false');
form.append('file', new Blob([readFileSync(file)]), basename(file));

const res = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
  method: 'POST',
  headers: {'xi-api-key': key},
  body: form,
});
if (!res.ok) {
  console.error(`ElevenLabs ${res.status}: ${await res.text()}`);
  process.exit(1);
}
const data = await res.json();
let words = (data.words ?? [])
  .filter((w) => w.type === 'word' && w.text.trim())
  .map((w) => ({text: w.text.trim(), start: +w.start.toFixed(3), end: +w.end.toFixed(3)}));

// Same spelling/punctuation as script.txt when the word counts match (timings stay Scribe's).
if (existsSync(paths.script)) words = withScriptText(words, readFileSync(paths.script, 'utf8')).words;

writeFileSync(paths.transcript, JSON.stringify({audio: paths.audio, words}, null, 2));
console.log(`Wrote ${paths.transcript} (${words.length} words, ${words.at(-1)?.end}s) from ${file}.`);
