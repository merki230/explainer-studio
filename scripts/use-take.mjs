// Copy a saved voiceover take into place (no API call, free).
//
// usage: yarn voiceover:use <slug> <name>
// Copies out/<slug>/raw/voices/<name>.mp3 -> public/<slug>/voiceover.mp3 and
// out/<slug>/raw/voices/<name>.transcript.json -> src/videos/<slug>/transcript.json.
// Word text is normalised to script.txt (punctuation included) when word counts match.
// Make takes with: yarn voiceover <slug> --take <name>
import {copyFileSync, existsSync, readdirSync, readFileSync, writeFileSync} from 'node:fs';
import {videoPaths, withScriptText} from './lib.mjs';

const usage = 'yarn voiceover:use <slug> <name>';
const paths = videoPaths(process.argv[2], usage);
const name = process.argv[3];
const have = existsSync(paths.takesDir)
  ? readdirSync(paths.takesDir).filter((f) => f.endsWith('.mp3')).map((f) => f.slice(0, -4))
  : [];
if (!name || !have.includes(name)) {
  console.error(`usage: ${usage}\ntakes for ${process.argv[2]}: ${have.join(', ') || '(none)'}`);
  process.exit(1);
}
copyFileSync(`${paths.takesDir}/${name}.mp3`, paths.audioFile);
const t = JSON.parse(readFileSync(`${paths.takesDir}/${name}.transcript.json`, 'utf8'));
let note = '';
if (existsSync(paths.script)) {
  const r = withScriptText(t.words, readFileSync(paths.script, 'utf8'));
  if (r.applied) t.words = r.words;
  else note = ` WARNING: ${t.words.length} transcript words vs ${r.scriptCount} in script.txt, text left as recorded.`;
}
writeFileSync(paths.transcript, JSON.stringify(t, null, 2));
console.log(`Using take "${name}": wrote ${paths.audioFile} and ${paths.transcript}.${note}`);
