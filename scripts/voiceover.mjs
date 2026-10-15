// Text-to-speech + word timestamps in ONE call (ElevenLabs "with-timestamps").
// Writes public/voiceover.mp3 and src/data/transcript.json.
//
// usage:
//   ELEVENLABS_API_KEY=... [ELEVENLABS_VOICE_ID=...] node scripts/voiceover.mjs [script.txt]
//
// Pick a voice in the ElevenLabs Voice Library and copy its ID. Calm, slightly
// low narrators work best for this style.
import {readFileSync, writeFileSync} from 'node:fs';

const key = process.env.ELEVENLABS_API_KEY;
if (!key) {
  console.error('Set ELEVENLABS_API_KEY first.');
  process.exit(1);
}
const voiceId = process.env.ELEVENLABS_VOICE_ID ?? '21m00Tcm4TlvDq8ikWAM';
const modelId = process.env.ELEVENLABS_MODEL_ID ?? 'eleven_multilingual_v2';
const text = readFileSync(process.argv[2] ?? 'script.txt', 'utf8').trim();

const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/with-timestamps`, {
  method: 'POST',
  headers: {'xi-api-key': key, 'Content-Type': 'application/json'},
  body: JSON.stringify({
    text,
    model_id: modelId,
    voice_settings: {stability: 0.5, similarity_boost: 0.75, style: 0.2},
  }),
});
if (!res.ok) {
  console.error(`ElevenLabs ${res.status}: ${await res.text()}`);
  process.exit(1);
}
const data = await res.json();
writeFileSync('public/voiceover.mp3', Buffer.from(data.audio_base64, 'base64'));

// Character alignment -> words (split on whitespace).
const {characters, character_start_times_seconds: starts, character_end_times_seconds: ends} = data.alignment;
const words = [];
let cur = null;
characters.forEach((ch, i) => {
  if (/\s/.test(ch)) {
    if (cur) words.push(cur);
    cur = null;
    return;
  }
  if (!cur) cur = {text: '', start: starts[i], end: ends[i]};
  cur.text += ch;
  cur.end = ends[i];
});
if (cur) words.push(cur);

const rounded = words.map((w) => ({text: w.text, start: +w.start.toFixed(3), end: +w.end.toFixed(3)}));
writeFileSync('src/data/transcript.json', JSON.stringify({audio: 'voiceover.mp3', words: rounded}, null, 2));
console.log(`Wrote public/voiceover.mp3 and src/data/transcript.json (${rounded.length} words, ${rounded.at(-1)?.end}s).`);
