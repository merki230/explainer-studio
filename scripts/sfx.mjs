// One sound effect from the ElevenLabs Sound Generation API (COSTS CREDITS; ask the owner first).
//
// usage: yarn sfx <slug> <name> --prompt "..." [--seconds N] [--take <t>] [--dry-run]
//
// Writes public/<slug>/sfx/<name>.mp3, or with --take out/sfx/<slug>/<name>.<t>.mp3 (audition first,
// then copy it into public/ yourself). Never overwrites a file. Appends to src/videos/<slug>/audio-log.md.
// Model eleven_text_to_sound_v2, seconds 0.5-30 (default: the model chooses). Own generations only:
// never use ElevenLabs' community SFX library, and never publish an effect as a standalone file.
// --dry-run prints the request without the key and writes nothing. Key: ELEVENLABS_API_KEY in .env.
import {existsSync, mkdirSync, writeFileSync} from 'node:fs';
import {appendLog, parseArgs, postAudio, printDryRun, validName} from './audio-lib.mjs';
import {apiKey, videoPaths} from './lib.mjs';

const usage = 'yarn sfx <slug> <name> --prompt "..." [--seconds N] [--take <t>] [--dry-run]';
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`${usage}

  Generates one sound effect (model eleven_text_to_sound_v2) into public/<slug>/sfx/<name>.mp3.
  --prompt "..."   required; describe the sound
  --seconds N      0.5-30; default: the model chooses
  --take <t>       write out/sfx/<slug>/<name>.<t>.mp3 instead of public/ (audition)
  --dry-run        print the request (no key), call nothing, write nothing
  Costs credits: needs the owner's go-ahead. Logged in src/videos/<slug>/audio-log.md (never hand-edit).`);
  process.exit(0);
}

const fail = (msg) => {
  console.error(`${msg}\nusage: ${usage}`);
  process.exit(1);
};
let parsed;
try {
  parsed = parseArgs(process.argv.slice(2), ['--prompt', '--seconds', '--take'], ['--dry-run']);
} catch (e) {
  fail(e.message);
}
const {pos, opts, bools} = parsed;
const paths = videoPaths(pos[0], usage);
const [slug, name] = pos;
if (!name) fail('Missing <name>.');
if (pos.length > 2) fail(`Unexpected argument "${pos[2]}".`);
if (!validName(name)) fail(`Bad name "${name}": use letters, digits, - _ .`);
if (opts.take !== undefined && !validName(opts.take)) fail(`Bad take name "${opts.take}".`);
const prompt = (opts.prompt ?? '').trim();
if (!prompt) fail('--prompt is required.');

const body = {text: prompt, model_id: 'eleven_text_to_sound_v2'};
if (opts.seconds !== undefined) {
  const s = Number(opts.seconds);
  if (!Number.isFinite(s) || s < 0.5 || s > 30) fail(`--seconds must be 0.5-30, got "${opts.seconds}".`);
  body.duration_seconds = s;
}
const url = 'https://api.elevenlabs.io/v1/sound-generation?output_format=mp3_44100_128';
const dir = opts.take ? `out/sfx/${slug}` : `public/${slug}/sfx`;
const out = `${dir}/${name}${opts.take ? `.${opts.take}` : ''}.mp3`;
if (bools['dry-run']) {
  printDryRun('POST', url, body);
  console.log(`Would write ${out} and log it in ${paths.dir}/audio-log.md.`);
  process.exit(0);
}
if (existsSync(out)) fail(`${out} exists; pick another name or --take (files are never overwritten).`);
const key = apiKey();
console.log(`SFX ${body.model_id}, ${body.duration_seconds ?? 'auto'} s. Generating (costs credits)...`);
const audio = await postAudio(url, key, body);
mkdirSync(dir, {recursive: true});
writeFileSync(out, audio);
const log = appendLog({
  dir: paths.dir,
  kind: 'sfx',
  endpoint: 'POST /v1/sound-generation (output_format=mp3_44100_128)',
  model: body.model_id,
  prompt,
  length: body.duration_seconds ? `${body.duration_seconds} s` : 'auto',
  output: out,
  file: out,
});
console.log(`Wrote ${out} (${audio.length} bytes) and logged it in ${log}.`);
