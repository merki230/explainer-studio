// Self-made "battery filling" tone: a gentle rising glide, a deterministic synth (no API, no cost).
//
// usage: yarn sfx:charge <slug> [--name charge] [--out <file>] [--from 300] [--to 700] [--seconds 2.5] [--lufs -20]
//
// Model: a clean sine gliding UP from --from to --to Hz (exponential, i.e. even in musical pitch, eased
// at both ends), plus two soft partials (x2 at 22%, x3 at 7%) detuned by a few cents so they shimmer
// slowly, and a faint 5 Hz level swell. The level rises a little with the pitch. Low-passed at 3 kHz,
// no noise: no buzz. Mono 44.1 kHz, 0.25 s fade-in/out, scaled to the target integrated loudness
// (default -20 LUFS) and checked to stay under -1.5 dBTP (the bundled ffmpeg has no limiter, so it
// fails rather than clips), encoded with Remotion's bundled ffmpeg (libmp3lame, 128k). Same samples
// every run. Default output: out/<slug>/raw/sfx/<name>.mp3 (audition). Not logged in audio-log.md.
import {spawnSync} from 'node:child_process';
import {mkdirSync, mkdtempSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {dirname, join} from 'node:path';

const usage = 'yarn sfx:charge <slug> [--name charge] [--out <file>] [--from 300] [--to 700]\n  [--seconds 2.5] [--lufs -20]';
const fail = (msg) => {
  console.error(`${msg}\nusage: ${usage}`);
  process.exit(1);
};
const argv = process.argv.slice(2);
if (argv.includes('--help') || argv.includes('-h')) {
  console.log(`${usage}\n\n  Default output: out/<slug>/raw/sfx/<name>.mp3 (audition; never writes into src/).`);
  process.exit(0);
}
const opt = {name: 'charge', out: '', from: '300', to: '700', seconds: '2.5', lufs: '-20'};
const pos = [];
for (let i = 0; i < argv.length; i++) {
  if (argv[i].startsWith('--') && argv[i].slice(2) in opt) opt[argv[i].slice(2)] = argv[++i] ?? '';
  else pos.push(argv[i]);
}
const [slug] = pos;
const re = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;
if (!slug || pos.length > 1 || !re.test(slug) || !re.test(opt.name)) fail('expected exactly one valid <slug> and a valid --name');
const seconds = Number(opt.seconds), lufs = Number(opt.lufs);
const f0 = Number(opt.from), f1 = Number(opt.to);
if (!(seconds > 0.5 && seconds <= 60) || !(lufs < 0 && lufs > -40)) fail('invalid --seconds or --lufs');
if (![f0, f1].every(Number.isFinite) || f0 < 50 || f0 > 3000 || f1 < 50 || f1 > 3000) fail('invalid --from/--to (50-3000 Hz)');
const outFile = opt.out || join('out', slug, 'raw', 'sfx', `${opt.name}.mp3`);

const sr = 44100, n = Math.round(sr * seconds);
const lp = (x, fc, passes = 1) => {
  const a = 1 - Math.exp(-2 * Math.PI * fc / sr);
  const y = Float64Array.from(x);
  for (let p = 0; p < passes; p++) { let s = 0; for (let i = 0; i < y.length; i++) y[i] = s += a * (y[i] - s); }
  return y;
};

const z0 = new Float64Array(n);
let p1 = 0, p2 = 0, p3 = 0;
for (let i = 0; i < n; i++) {
  const u = i / (n - 1), e = u * u * (3 - 2 * u), f = f0 * (f1 / f0) ** e, t = i / sr;
  p1 += 2 * Math.PI * f / sr;
  p2 += 2 * Math.PI * f * 2 * (1 + 0.0035 * Math.sin(2 * Math.PI * 0.7 * t)) / sr;
  p3 += 2 * Math.PI * f * 3 * (1 - 0.0035 * Math.sin(2 * Math.PI * 0.9 * t)) / sr;
  const level = (0.7 + 0.3 * u) * (1 + 0.05 * Math.sin(2 * Math.PI * 5 * t));
  z0[i] = level * (Math.sin(p1) + 0.22 * Math.sin(p2) + 0.07 * Math.sin(p3));
}
const z = lp(z0, 3000, 2);
let pk = 0;
for (let i = 0; i < n; i++) pk = Math.max(pk, Math.abs(z[i]));
for (let i = 0; i < n; i++) z[i] *= 0.3 / pk;
const fade = Math.round(0.25 * sr);
for (let i = 0; i < fade; i++) { const g = Math.sin(0.5 * Math.PI * i / fade); z[i] *= g; z[n - 1 - i] *= g; }

const writeWav = (file, gain) => {
  const pcm = new Int16Array(n);
  for (let i = 0; i < n; i++) pcm[i] = Math.round(Math.max(-1, Math.min(1, z[i] * gain)) * 32767);
  const data = Buffer.from(pcm.buffer), h = Buffer.alloc(44);
  h.write('RIFF', 0); h.writeUInt32LE(36 + data.length, 4); h.write('WAVEfmt ', 8);
  h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22); h.writeUInt32LE(sr, 24);
  h.writeUInt32LE(sr * 2, 28); h.writeUInt16LE(2, 32); h.writeUInt16LE(16, 34); h.write('data', 36); h.writeUInt32LE(data.length, 40);
  writeFileSync(file, Buffer.concat([h, data]));
};
const ff = (args) => spawnSync('npx', ['remotion', 'ffmpeg', '-hide_banner', '-nostdin', '-y', ...args], {encoding: 'utf8'});
const meas = (file) => {
  const m = ff(['-i', file, '-af', 'loudnorm=I=-15:TP=-1.5:print_format=json', '-f', 'null', '-']);
  const j = /\{[^{}]*"input_i"[^{}]*\}/.exec(m.stderr || '');
  if (!j) fail(`could not measure loudness:\n${(m.stderr || '').slice(-800)}`);
  const o = JSON.parse(j[0]);
  return {i: Number(o.input_i), tp: Number(o.input_tp)};
};

const tmp = mkdtempSync(join(tmpdir(), 'sfx-charge-'));
try {
  const wav = join(tmp, 'charge.wav');
  writeWav(wav, 1);
  const d = meas(wav);
  const gain = 10 ** ((lufs - d.i) / 20);
  if (d.tp + (lufs - d.i) > -1.5) fail(`peak would exceed -1.5 dBTP at ${lufs} LUFS (${(d.tp + lufs - d.i).toFixed(2)}); lower --lufs`);
  writeWav(wav, gain);
  mkdirSync(dirname(outFile), {recursive: true});
  const r = ff(['-i', wav, '-c:a', 'libmp3lame', '-b:a', '128k', outFile]);
  if (r.status !== 0) fail(`ffmpeg failed:\n${(r.stderr || '').slice(-1500)}`);
  console.log(`wrote ${outFile} (target ${lufs} LUFS)`);
} finally {
  rmSync(tmp, {recursive: true, force: true});
}
