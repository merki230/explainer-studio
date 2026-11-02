// Copy a saved voiceover take into place (no API call, free).
//
// usage: yarn voiceover:use <slug> <name> [--hook <chapter>]
// With --hook the take is a Short's hook line (made with `yarn voiceover <slug> --hook <n> --take <name>`): it is copied to
// audio/short-<n>-hook.mp3 and recorded under `hooks.<n>` in transcript.json; the main voice is untouched.
// Copies out/<slug>/raw/voices/<name>.mp3 -> src/videos/<slug>/audio/voiceover.mp3 and
// out/<slug>/raw/voices/<name>.transcript.json -> src/videos/<slug>/transcript.json.
// Word text is normalised to script.txt (punctuation included) when word counts match.
// Make takes with: yarn voiceover <slug> --take <name>
import {copyFileSync, mkdirSync, existsSync, readdirSync, readFileSync} from 'node:fs';
import {hookAudioPath, parseScript, videoPaths, withScriptText, writeTranscript} from './lib.mjs';

const usage = 'yarn voiceover:use <slug> <name> [--hook <chapter>]';
const argv = process.argv.slice(2);
const hi = argv.indexOf('--hook');
const hook = hi < 0 ? null : Number(argv[hi + 1]);
if (hi >= 0) argv.splice(hi, 2);
if (hook !== null && !(Number.isInteger(hook) && hook >= 1)) {
  console.error(`--hook needs a chapter number. usage: ${usage}`);
  process.exit(1);
}
const paths = videoPaths(argv[0], usage);
const name = argv[1];
const have = existsSync(paths.takesDir)
  ? readdirSync(paths.takesDir).filter((f) => f.endsWith('.mp3')).map((f) => f.slice(0, -4))
  : [];
if (!name || !have.includes(name)) {
  console.error(`usage: ${usage}\ntakes for ${argv[0]}: ${have.join(', ') || '(none)'}`);
  process.exit(1);
}
mkdirSync(paths.audioDir, {recursive: true});
const t = JSON.parse(readFileSync(`${paths.takesDir}/${name}.transcript.json`, 'utf8'));
let note = '';
if (hook !== null) {
  const text = existsSync(paths.script) ? parseScript(readFileSync(paths.script, 'utf8')).chapters[hook - 1]?.hook : undefined;
  if (!text) {
    console.error(`script.txt has no "> Short hook:" line under chapter ${hook}.`);
    process.exit(1);
  }
  const r = withScriptText(t.words, text);
  if (r.applied) t.words = r.words;
  else note = ` WARNING: ${t.words.length} transcript words vs ${r.scriptCount} in the hook line, text left as recorded.`;
  const doc = {audio: hookAudioPath(hook), words: t.words};
  copyFileSync(`${paths.takesDir}/${name}.mp3`, `${paths.dir}/${doc.audio}`);
  const current = JSON.parse(readFileSync(paths.transcript, 'utf8'));
  writeTranscript(paths, {audio: current.audio, words: current.words}, {...current.hooks, [hook]: doc});
  console.log(`Using take "${name}" for chapter ${hook}'s Short hook: wrote ${paths.dir}/${doc.audio} and hooks.${hook} in ${paths.transcript}.${note}`);
  process.exit(0);
}
copyFileSync(`${paths.takesDir}/${name}.mp3`, paths.audioFile);
if (existsSync(paths.script)) {
  const r = withScriptText(t.words, readFileSync(paths.script, 'utf8'));
  if (r.applied) t.words = r.words;
  else note = ` WARNING: ${t.words.length} transcript words vs ${r.scriptCount} in script.txt, text left as recorded.`;
}
writeTranscript(paths, t);
console.log(`Using take "${name}": wrote ${paths.audioFile} and ${paths.transcript}.${note}`);
