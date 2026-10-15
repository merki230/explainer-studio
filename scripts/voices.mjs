// List ElevenLabs voices you can use (id, name, labels). Free.
//
// usage: yarn voices [--search american]
// Needs the key to have "voices_read"; enable it in the ElevenLabs dashboard (API keys) if you get a 401.
import {apiKey} from './lib.mjs';

const i = process.argv.indexOf('--search');
const search = i > 0 ? process.argv[i + 1] : undefined;
const url = new URL('https://api.elevenlabs.io/v2/voices');
url.searchParams.set('page_size', '100');
if (search) url.searchParams.set('search', search);

const res = await fetch(url, {headers: {'xi-api-key': apiKey()}});
if (res.status === 401) {
  console.error('401: the key may lack the "voices_read" permission. Enable it in the ElevenLabs dashboard (Developers > API keys).');
  process.exit(1);
}
if (!res.ok) {
  console.error(`ElevenLabs ${res.status}: ${await res.text()}`);
  process.exit(1);
}
const {voices = []} = await res.json();
for (const v of voices) {
  const labels = Object.values(v.labels ?? {}).join(', ');
  console.log(`${v.voice_id}  ${v.name}${labels ? `  [${labels}]` : ''}${v.category ? `  (${v.category})` : ''}`);
}
console.log(`${voices.length} voice(s).`);
