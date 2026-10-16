// Instrumental music bed from the ElevenLabs Music API (COSTS CREDITS; ask the owner first).
//
// usage:
//   yarn music <slug> --take <name> [--prompt "..."] [--seconds N] [--dry-run]
//   yarn music:use <slug> <name>      copy a take to src/videos/<slug>/audio/music.mp3 (free, see music-use.mjs)
//
// Writes out/<slug>/raw/music/<name>.mp3 and appends an entry to src/videos/<slug>/audio-log.md.
// Prompt: --prompt, else src/videos/<slug>/music.txt. Length: --seconds (3-600), else the composition
// duration (what Root renders: last word + tail) rounded up to a whole second. Model music_v2_5, always force_instrumental.
// Rules (brand/research/music-licensing.md): instrumental only; a prompt must name no artist, song,
// label or lyrics (a pattern check rejects "in the style of", "by <Name>", "lyrics", "vocals", ...).
// Generate only while a paid plan (Creator+) is active; never use ElevenLabs' ready-made tracks.
// --dry-run prints the request without the key and writes nothing. Key: ELEVENLABS_API_KEY in .env.
import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {appendLog, bannedPattern, parseArgs, postAudio, printDryRun, validName} from './audio-lib.mjs';
import {FPS} from '../src/theme';
import {resolveTimeline} from '../src/timeline';
import {VIDEOS} from '../src/videos';
import {apiKey, videoPaths} from './lib.mjs';

const usage = 'yarn music <slug> --take <name> [--prompt "..."] [--seconds N] [--dry-run]';
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`${usage}

  Generates an instrumental bed (ElevenLabs Music, model music_v2_5) into out/<slug>/raw/music/<name>.mp3.
  --take <name>    required; the file name of this take
  --prompt "..."   default: src/videos/<slug>/music.txt
  --seconds N      3-600; default: composition duration (as Root), rounded up
  --dry-run        print the request (no key), call nothing, write nothing
  Rules: instrumental only. Prompts may not name an artist, song, label or lyrics ("in the style of",
  "by <Name>", "lyrics", "vocals" ... are refused). Costs credits: needs the owner's go-ahead.
  Every file is logged in src/videos/<slug>/audio-log.md (generated, never hand-edit).
  Use a take for free with: yarn music:use <slug> <name>`);
  process.exit(0);
}

const fail = (msg: string): never => {
  console.error(`${msg}\nusage: ${usage}`);
  process.exit(1);
};
let parsed: {pos: string[]; opts: Record<string, string>; bools: Record<string, boolean>};
try {
  parsed = parseArgs(process.argv.slice(2), ['--take', '--prompt', '--seconds'], ['--dry-run']);
} catch (e) {
  fail((e as Error).message);
  throw e;
}
const {pos, opts, bools} = parsed;
const paths = videoPaths(pos[0], usage);
const slug = pos[0];
if (pos.length > 1) fail(`Unexpected argument "${pos[1]}".`);
if (!opts.take) fail('--take <name> is required (live files are never written directly).');
if (!validName(opts.take)) fail(`Bad take name "${opts.take}": use letters, digits, - _ .`);

const musicTxt = `${paths.dir}/music.txt`;
const prompt = (opts.prompt ?? (existsSync(musicTxt) ? readFileSync(musicTxt, 'utf8') : '')).trim();
if (!prompt) fail(`No prompt: pass --prompt or write ${musicTxt}.`);
const bad = bannedPattern(prompt);
if (bad) fail(`Prompt refused: "${bad}" looks like an artist, song, label or lyrics reference. Describe mood, instruments and tempo only.`);

let seconds: number;
if (opts.seconds !== undefined) {
  seconds = Number(opts.seconds);
  if (!Number.isFinite(seconds)) fail(`--seconds must be a number, got "${opts.seconds}".`);
  seconds = Math.ceil(seconds);
} else {
  // Same value Root uses for durationInFrames (last word + the spec's tail), rounded up to a whole second.
  const v = VIDEOS[slug];
  if (!v || !v.transcript.words.length) fail(`No transcript for ${slug}; pass --seconds.`);
  seconds = Math.ceil(resolveTimeline(v.spec, v.transcript.words, FPS).durationInFrames / FPS);
}
if (seconds < 3 || seconds > 600) fail(`Length must be 3-600 seconds, got ${seconds}.`);

const model = 'music_v2_5';
const url = 'https://api.elevenlabs.io/v1/music?output_format=mp3_44100_128';
const body = {prompt, music_length_ms: seconds * 1000, model_id: model, force_instrumental: true};
if (bools['dry-run']) {
  printDryRun('POST', url, body);
  console.log(`Would write out/${slug}/raw/music/${opts.take}.mp3 and log it in ${paths.dir}/audio-log.md.`);
  process.exit(0);
}

const dir = `out/${slug}/raw/music`;
const out = `${dir}/${opts.take}.mp3`;
if (existsSync(out)) fail(`${out} exists; pick another --take name (takes are never overwritten).`);
const key = apiKey();
console.log(`Music ${model}, ${seconds}s, instrumental. Generating (costs credits)...`);
const audio = await postAudio(url, key, body);
mkdirSync(dir, {recursive: true});
writeFileSync(out, audio);
const log = appendLog({
  dir: paths.dir,
  kind: 'music',
  endpoint: 'POST /v1/music (output_format=mp3_44100_128)',
  model,
  prompt,
  length: `${seconds} s (force_instrumental: true)`,
  output: out,
  file: out,
});
console.log(`Wrote ${out} (${audio.length} bytes) and logged it in ${log}. Use it: yarn music:use ${slug} ${opts.take}`);
