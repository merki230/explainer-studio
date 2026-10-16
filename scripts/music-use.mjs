// Copy a saved music take into place (no API call, free).
//
// usage: yarn music:use <slug> <name>
// Copies out/<slug>/raw/music/<name>.mp3 -> src/videos/<slug>/audio/music.mp3. Make takes with: yarn music
import {copyFileSync, existsSync, mkdirSync, readdirSync} from 'node:fs';
import {videoPaths} from './lib.mjs';

const usage = 'yarn music:use <slug> <name>';
const paths = videoPaths(process.argv[2], usage);
const dir = `out/${process.argv[2]}/raw/music`;
const name = process.argv[3];
const have = existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith('.mp3')).map((f) => f.slice(0, -4)) : [];
if (!name || !have.includes(name)) {
  console.error(`usage: ${usage}\ntakes for ${process.argv[2]}: ${have.join(', ') || '(none)'}`);
  process.exit(1);
}
const dest = `${paths.audioDir}/music.mp3`;
mkdirSync(paths.audioDir, {recursive: true});
copyFileSync(`${dir}/${name}.mp3`, dest);
console.log(`Using take "${name}": wrote ${dest}. (${paths.dir}/audio-log.md already records how it was made.)`);
