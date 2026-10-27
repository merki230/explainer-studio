// Highway cruise bed heard from outside, for No. 009 (mile-markers): free, deterministic, physical only.
// Mixes two stems made by sfx-drive.mjs: dry-asphalt tire roar (`hiss --dry`, --pitch = speed) and a distant
// four-cylinder (`engine`, 1800 rpm = the same car as `engine --die`). Local ffmpeg has no filters, so the
// mix (levels, one-pole low-pass, fades, level ramp) is done here on the decoded samples.
//
// usage: yarn sfx:cruise <slug> day|night [--name <n>] [--seconds N] [--lufs L] [--out <file>]
//          [--pitch X] [--hiss dB] [--eng dB] [--dark Hz] [--rpm R]
//          [--hiss-fade S] [--eng-fade S] [--eng-fade-at T] [--ramp dB] [--ramp-s S]
//        (or: node scripts/sfx-cruise.mjs day <slug> ...)
//   day    25.4 s, speed pitch 1.5 (about 65-70 mph), engine stem 12 dB down; both fade out over the last
//          1 s. Plays straight through scenes 1-6 (no loop); the spec crossfades into `night`.
//   night  3.6 s, a little quieter (roar -3 dB, engine -11 dB) and darker (roar low-passed at 1.6 kHz, pitch 1.25). The engine
//          swells by --ramp dB (default 9) over the 1.8 s before --eng-fade-at (2.71 s) as it starves, then fades
//          out over 0.3 s into `engine-die` (same rpm, so same engine); the roar fades over the last 1.2 s as the
//          car coasts.
// Mono 44.1 kHz, scaled to --lufs (default -24; day -24, night -26; with --ramp the level is measured on the
// lead-in before the swell, so the swell comes on top), checked under -1.5 dBTP, MP3 128k.
// Default output: out/<slug>/raw/sfx/<name>.mp3 (audition; never touches src/). Not logged in audio-log.md.
import {spawnSync} from 'node:child_process';
import {mkdirSync, mkdtempSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {dirname, join} from 'node:path';

const usage = 'yarn sfx:cruise <slug> day|night [--name <n>] [--seconds N] [--lufs L] [--out <file>] [--pitch X] [--hiss dB] [--eng dB] [--dark Hz] [--rpm R] [--hiss-fade S] [--eng-fade S] [--eng-fade-at T] [--ramp dB] [--ramp-s S]';
const fail = (m) => { console.error(`${m}\nusage: ${usage}`); process.exit(1); };
const argv = process.argv.slice(2);
if (argv.includes('--help') || argv.includes('-h')) { console.log(usage); process.exit(0); }
const pos = [], o = {};
for (let i = 0; i < argv.length; i++) {
  if (argv[i].startsWith('--')) o[argv[i].slice(2)] = argv[++i];
  else pos.push(argv[i]);
}
const [a, b] = pos;
const mode = ['day', 'night'].includes(a) ? a : ['day', 'night'].includes(b) ? b : '';
const slug = pos.find((p) => p !== mode);
const re = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;
if (!mode || !slug || pos.length !== 2 || !re.test(slug)) fail('expected <slug> and day|night');
const night = mode === 'night';
const P = {
  name: `cruise-${mode}`, seconds: night ? 3.6 : 25.4, lufs: night ? -26 : -24, pitch: night ? 1.25 : 1.5,
  hiss: night ? -3 : 0, eng: night ? -11 : -12, dark: night ? 1600 : 0, rpm: 1800,
  'hiss-fade': night ? 1.2 : 1, 'eng-fade': night ? 0.3 : 1, 'eng-fade-at': night ? 2.71 : 24.4, ramp: night ? 9 : 0, 'ramp-s': 1.8,
};
for (const k in P) if (o[k] !== undefined) P[k] = k === 'name' ? o[k] : Number(o[k]);
const S = P.seconds;
if (!re.test(P.name) || ![S, P.lufs, P.pitch, P.hiss, P.eng, P.dark, P.rpm, P.ramp, P['ramp-s'], P['hiss-fade'], P['eng-fade'], P['eng-fade-at']].every(Number.isFinite) || S < 1 || S > 55 || !(P.lufs < 0 && P.lufs > -40)) fail('invalid option value');
const outFile = o.out || join('out', slug, 'raw', 'sfx', `${P.name}.mp3`);

const sr = 44100, PAD = 0.3, TAU = 2 * Math.PI;
const ff = (args, opts) => spawnSync('npx', ['remotion', 'ffmpeg', '-hide_banner', '-nostdin', '-y', ...args], {encoding: 'utf8', ...opts});
const tmp = mkdtempSync(join(tmpdir(), 'sfx-cruise-'));
const stem = (kind, extra) => {
  const f = join(tmp, `${kind}.mp3`), len = String(S + 2 * PAD);
  const r = spawnSync('node', [new URL('./sfx-drive.mjs', import.meta.url).pathname, kind, slug, '--out', f, '--seconds', len, ...extra], {encoding: 'utf8'});
  if (r.status !== 0) fail(`sfx-drive ${kind} failed:\n${r.stderr}`);
  const d = spawnSync('npx', ['remotion', 'ffmpeg', '-hide_banner', '-nostdin', '-v', 'error', '-i', f, '-ac', '1', '-ar', String(sr), '-c:a', 'pcm_s16le', '-f', 'wav', '-'], {maxBuffer: 1 << 29});
  const buf = d.stdout, x = new Float64Array(Math.round(S * sr)), off = 44 + 2 * Math.round(PAD * sr);
  for (let i = 0; i < x.length; i++) x[i] = buf.readInt16LE(off + 2 * i) / 32768;
  return x;
};
const db = (d) => 10 ** (d / 20);
const lp = (x, fc) => { const k = 1 - Math.exp(-TAU * fc / sr); let s = 0; return x.map((v) => (s += k * (v - s))); };
const cosFade = (t, from, len) => (t <= from ? 1 : t >= from + len ? 0 : Math.cos(0.5 * Math.PI * (t - from) / len));
try {
  let hiss = stem('hiss', ['--dry', '--pitch', String(P.pitch), '--lufs', '-24']);
  const eng = stem('engine', ['--from', String(P.rpm), '--to', String(P.rpm), '--lufs', '-20']);
  if (P.dark > 0) { hiss = lp(hiss, P.dark); hiss = lp(hiss, P.dark * 1.4); } // a gentle two-pole roll-off
  const z = new Float64Array(hiss.length);
  const rampAt = P['eng-fade-at'] - P['ramp-s'];
  for (let i = 0; i < z.length; i++) {
    const t = i / sr, r = Math.min(1, Math.max(0, (t - rampAt) / P['ramp-s'])), sm = r * r * (3 - 2 * r);
    const eg = db(P.eng + P.ramp * sm) * cosFade(t, P['eng-fade-at'], P['eng-fade']);
    const hg = db(P.hiss) * cosFade(t, S - P['hiss-fade'], P['hiss-fade']);
    z[i] = hiss[i] * hg + eng[i] * eg;
  }
  const wav = (file, gain) => {
    const pcm = new Int16Array(z.length);
    for (let i = 0; i < z.length; i++) pcm[i] = Math.round(Math.max(-1, Math.min(1, z[i] * gain)) * 32767);
    const data = Buffer.from(pcm.buffer), h = Buffer.alloc(44);
    h.write('RIFF', 0); h.writeUInt32LE(36 + data.length, 4); h.write('WAVEfmt ', 8); h.writeUInt32LE(16, 16);
    h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22); h.writeUInt32LE(sr, 24); h.writeUInt32LE(sr * 2, 28);
    h.writeUInt16LE(2, 32); h.writeUInt16LE(16, 34); h.write('data', 36); h.writeUInt32LE(data.length, 40);
    writeFileSync(file, Buffer.concat([h, data]));
  };
  const w = join(tmp, 'mix.wav');
  let pk = 0;
  for (const v of z) pk = Math.max(pk, Math.abs(v));
  const g0 = 0.3 / pk;
  wav(w, g0);
  const lead = P.ramp > 0 ? ['-t', String(Math.max(0.5, rampAt))] : []; // a swell is not part of the level: measure the lead-in
  const m = ff([...lead, '-i', w, '-af', 'loudnorm=I=-15:TP=-1.5:print_format=json', '-f', 'null', '-']);
  const j = /\{[^{}]*"input_i"[^{}]*\}/.exec(m.stderr || '');
  if (!j) fail('could not measure loudness');
  const meas = JSON.parse(j[0]), dg = P.lufs - Number(meas.input_i);
  if (Number(meas.input_tp) + dg > -1.5) fail('peak would exceed -1.5 dBTP; lower --lufs');
  wav(w, g0 * 10 ** (dg / 20));
  { // log the engine's own level (dB rms in the file) over the 0.2 s before it fades, to match `engine-die`
    const e1 = Math.round(P['eng-fade-at'] * sr), e0 = Math.max(0, e1 - Math.round(0.2 * sr));
    let ss = 0;
    for (let i = e0; i < e1; i++) ss += (eng[i] * db(P.eng + P.ramp) * g0 * 10 ** (dg / 20)) ** 2;
    console.log(`engine just before its fade: ${(10 * Math.log10(ss / (e1 - e0))).toFixed(2)} dB rms in the file`);
  }
  mkdirSync(dirname(outFile), {recursive: true});
  const r = ff(['-i', w, '-c:a', 'libmp3lame', '-b:a', '128k', outFile]);
  if (r.status !== 0) fail(`ffmpeg failed:\n${(r.stderr || '').slice(-1500)}`);
  console.log(`wrote ${outFile} (${mode}, ${S} s, target ${P.lufs} LUFS)`);
} finally {
  rmSync(tmp, {recursive: true, force: true});
}
