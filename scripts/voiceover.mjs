// Text-to-speech + word timestamps in ONE call (ElevenLabs "with-timestamps").
// Writes src/videos/<slug>/audio/voiceover.mp3 and src/videos/<slug>/transcript.json.
// COSTS CREDITS (one character per character sent, tags included).
//
// usage:
//   yarn voiceover <slug>                 write the live files
//   yarn voiceover <slug> --take <name>   write out/<slug>/raw/voices/<name>.mp3 + .transcript.json instead
//   yarn voiceover:use <slug> <name>      copy a take into place (no API call, see use-take.mjs)
//   yarn voiceover --text "Hello. [pause] World." --take _test   ad-hoc text (needs --take; uses slug "_adhoc")
//
// Text: src/videos/<slug>/performance.txt when it exists (the same words as script.txt plus audio
// tags like [pause], [curious] and ellipses), otherwise script.txt. Tags never reach transcript.json.
//
// Settings, highest priority first: env (ELEVENLABS_VOICE_ID, ELEVENLABS_MODEL_ID), then
// src/videos/<slug>/voice.json {voiceId, modelId?, stability?, similarityBoost?}, then defaults
// (model eleven_v4). Eleven v4 accepts only stability + similarity_boost; style/speed are sent
// only for older models. Put ELEVENLABS_API_KEY in .env (see .env.example).
import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {apiKey, norm, readVoiceConfig, stripTags, videoPaths, withScriptText} from './lib.mjs';

const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(name);
  if (i < 0) return undefined;
  const v = args[i + 1];
  args.splice(i, v === undefined ? 1 : 2);
  return v ?? '';
};
const take = flag('--take');
const adhoc = flag('--text');
const usage = 'yarn voiceover <slug> [--take <name>]';
if (take === '' || args.includes('--take')) {
  console.error(`--take needs a name. usage: ${usage}`);
  process.exit(1);
}

const paths = adhoc ? null : videoPaths(args[0], usage);
if (adhoc && !take) {
  console.error('--text requires --take <name> so live files are never touched.');
  process.exit(1);
}

const key = apiKey();
const cfg = paths ? readVoiceConfig(paths) : {};
const voiceId = process.env.ELEVENLABS_VOICE_ID ?? cfg.voiceId ?? '21m00Tcm4TlvDq8ikWAM';
const modelId = process.env.ELEVENLABS_MODEL_ID ?? cfg.modelId ?? 'eleven_v4';
const isV4 = modelId.startsWith('eleven_v4');

let source = 'script.txt';
let text;
if (adhoc) {
  text = adhoc.trim();
  source = '--text';
} else if (existsSync(paths.performance)) {
  text = readFileSync(paths.performance, 'utf8').trim();
  source = 'performance.txt';
} else text = readFileSync(paths.script, 'utf8').trim();

const voice_settings = {stability: cfg.stability ?? 0.5, similarity_boost: cfg.similarityBoost ?? 0.75};
if (!isV4) voice_settings.style = 0.2;

console.log(`Voice ${voiceId}, model ${modelId}, text from ${source} (${text.length} characters).`);

const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/with-timestamps`, {
  method: 'POST',
  headers: {'xi-api-key': key, 'Content-Type': 'application/json'},
  body: JSON.stringify({text, model_id: modelId, voice_settings}),
});
if (!res.ok) {
  console.error(`ElevenLabs ${res.status}: ${await res.text()}`);
  process.exit(1);
}
const used = res.headers.get('x-character-count');
const data = await res.json();

// Character alignment -> words. Skip [tags] (and the characters returned for them) and ellipses.
const {characters, character_start_times_seconds: starts, character_end_times_seconds: ends} = data.alignment;
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
const cleaned = words
  .map((w) => ({text: w.text.replace(/\.{2,}/g, ''), start: +w.start.toFixed(3), end: +w.end.toFixed(3)}))
  .filter((w) => norm(w.text) !== '');

// The words must match the script word for word, or cues and "yarn check" break.
// When the counts match, use script.txt's spelling and punctuation (captions page on punctuation).
let rounded = cleaned;
if (paths && existsSync(paths.script)) {
  rounded = withScriptText(cleaned, readFileSync(paths.script, 'utf8')).words;
}
const expected = stripTags(text).split(' ').map(norm).filter(Boolean);
const got = rounded.map((w) => norm(w.text));
if (expected.join(' ') !== got.join(' ')) {
  console.warn(`WARNING: transcript words differ from the text sent (${got.length} vs ${expected.length} words).`);
}

const transcript = JSON.stringify({audio: 'audio/voiceover.mp3', words: rounded}, null, 2);
const audio = Buffer.from(data.audio_base64, 'base64');
let audioOut;
let transcriptOut;
if (take) {
  const dir = adhoc ? 'out/voices/_test' : paths.takesDir;
  mkdirSync(dir, {recursive: true});
  audioOut = `${dir}/${take}.mp3`;
  transcriptOut = `${dir}/${take}.transcript.json`;
} else {
  mkdirSync(paths.audioDir, {recursive: true});
  audioOut = paths.audioFile;
  transcriptOut = paths.transcript;
}
writeFileSync(audioOut, audio);
writeFileSync(transcriptOut, transcript);
console.log(
  `Wrote ${audioOut} and ${transcriptOut} (${rounded.length} words, ${rounded.at(-1)?.end}s). Characters used: ${used ?? 'unknown'}.`,
);
