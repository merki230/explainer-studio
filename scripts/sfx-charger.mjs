// Self-made charging-station sounds for No. 010 (ev-charging): deterministic synths (no API, no cost).
// Physical sounds only: no whooshes, whines, risers or "power-up" tones. Every tone here is fixed in pitch.
//
// usage: yarn sfx:<kind> <slug> [--name <kind>] [--out <file>] [--seconds N] [--lufs L] [kind options]
//        (or: node scripts/sfx-charger.mjs <kind> <slug> ...)
//   kinds: contactor | cabfan | pump | latch | heater | heaterfan | station
//
//  contactor  DC fast-charger contactor, a heavy relay (default 0.7 s). Armature slam: a 62 Hz body thud with a
//             short noise burst, two contact bounces (11 ms and 23 ms, quieter), a metallic click on top
//             (case resonances 1.9 k and 3.4 k, 2 ms decay) and a 150 Hz housing ring. --part close (default) or
//             open (softer, lower, one release clack, no bounce). --pitch X scales the resonances (0.6-1.6).
//  cabfan     charger cabinet cooling fans (default 8 s, seamless loop, 1 s cross-fade): broadband air (180-3200 Hz)
//             with a slow turbulence wobble, a low rumble (45-130 Hz), and a faint blade-pass flutter (amplitude
//             only, 2.5 % at 47 Hz, no tone). Steady: the spec fades it in; no pitch glide.
//  pump       cable coolant pump (default 8 s, seamless loop): motor hum at 72 Hz with partials 144 and 216 Hz
//             (whole cycles per loop), a soft 300-900 Hz flow texture and a little low rumble. Fixed pitch, quiet.
//  latch      plug latch (default 0.3 s): a plastic snap (2.4 k, 4 ms), a lower metal clack 28 ms later (900 Hz,
//             10 ms) and a small 190 Hz body thump. --part in (default) or out (the release: clack first, softer).
//  heater     space-heater switch (default 0.9 s): a rocker click (hard tick, 1.3 k / 3 k ring, 380 Hz body), then
//             three soft thermal ticks of the housing (0.25-0.8 s, seeded, 1.6 k ring, 5 ms).
//  heaterfan  small ceramic-heater fan (default 6 s, seamless loop): air (350-4200 Hz) with a gentle wobble, a
//             little motor body at 100 Hz and 200 Hz (whole cycles per loop). No whistle.
//  station    quiet outdoor charging-station bed (default 20 s, seamless loop, 2 s cross-fade): light wind
//             (70-600 Hz, slow gusts), faint far traffic (five seeded car passes, 4-6 s swells of 90-900 Hz road
//             noise, one soft lower truck), and a thin steady far-away broadband hum.
// Mono 44.1 kHz, scaled to the target integrated loudness and checked to stay under -1.5 dBTP (the bundled
// ffmpeg has no limiter, so it fails rather than clips), encoded with Remotion's bundled ffmpeg (libmp3lame,
// 128k). Clips under 4 s are measured repeated back to back. Same samples every run. Default output:
// out/<slug>/raw/sfx/<name>.mp3 (audition; never touches src/). Not logged in audio-log.md.
import {spawnSync} from 'node:child_process';
import {mkdirSync, mkdtempSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {dirname, join} from 'node:path';

const KINDS = {
  contactor: {seconds: 0.7, lufs: -29, seed: 101},
  cabfan: {seconds: 8, lufs: -30, seed: 202},
  pump: {seconds: 8, lufs: -34, seed: 303},
  latch: {seconds: 0.3, lufs: -26, seed: 404},
  heater: {seconds: 0.9, lufs: -28, seed: 505},
  heaterfan: {seconds: 6, lufs: -32, seed: 606},
  station: {seconds: 20, lufs: -32, seed: 707},
};
const usage = `yarn sfx:<${Object.keys(KINDS).join('|')}> <slug> [--name <kind>] [--out <file>] [--seconds N] [--lufs L]\n  contactor [--part close|open] [--pitch X] | latch [--part in|out]`;
const fail = (msg) => {
  console.error(`${msg}\nusage: ${usage}`);
  process.exit(1);
};
const argv = process.argv.slice(2);
if (argv.includes('--help') || argv.includes('-h')) {
  console.log(`${usage}\n\n  Default output: out/<slug>/raw/sfx/<name>.mp3 (audition; never writes into src/).`);
  process.exit(0);
}
const opt = {name: '', out: '', seconds: '', lufs: '', part: '', pitch: '1'};
const pos = [];
for (let i = 0; i < argv.length; i++) {
  if (argv[i].startsWith('--') && argv[i].slice(2) in opt) opt[argv[i].slice(2)] = argv[++i] ?? '';
  else pos.push(argv[i]);
}
const [kind, slug] = pos;
const re = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;
if (!(kind in KINDS)) fail('first argument must be a kind');
const D = KINDS[kind];
const name = opt.name || kind;
if (!slug || pos.length > 2 || !re.test(slug) || !re.test(name)) fail('expected exactly one valid <slug> and a valid --name');
const part = opt.part || (kind === 'latch' ? 'in' : 'close'), pitch = Number(opt.pitch);
if (kind === 'contactor' && !['close', 'open'].includes(part)) fail('--part is close or open');
if (kind === 'latch' && !['in', 'out'].includes(part)) fail('--part is in or out');
if (!(pitch >= 0.6 && pitch <= 1.6)) fail('--pitch is 0.6-1.6');
const seconds = opt.seconds === '' ? D.seconds : Number(opt.seconds);
const lufs = opt.lufs === '' ? D.lufs : Number(opt.lufs);
if (!(seconds >= 0.1 && seconds <= 60) || !(lufs < 0 && lufs > -50)) fail('invalid --seconds (0.1-60) or --lufs');
const outFile = opt.out || join('out', slug, 'raw', 'sfx', `${name}.mp3`);

const sr = 44100, TAU = 2 * Math.PI;
const looped = ['cabfan', 'pump', 'heaterfan', 'station'].includes(kind);
const xf = Math.round((kind === 'station' ? 2 : 1) * sr);
const n = Math.round(sr * seconds), len = looped ? n + xf : n;
let seed = D.seed;
const r01 = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
const rnd = () => r01() * 2 - 1;
const noise = (l) => Float64Array.from({length: l}, rnd);
const lp = (x, fc, passes = 1) => {
  const a = 1 - Math.exp((-TAU * fc) / sr), y = Float64Array.from(x);
  for (let p = 0; p < passes; p++) { let s = 0; for (let i = 0; i < y.length; i++) y[i] = s += a * (y[i] - s); }
  return y;
};
const hp = (x, fc, passes = 1) => { const l = lp(x, fc, passes); return x.map((v, i) => v - l[i]); };
const band = (x, lo, hi) => lp(hp(x, lo, 2), hi, 2);
const norm = (x) => { let m = 0; for (const v of x) m = Math.max(m, Math.abs(v)); return x.map((v) => v / (m || 1)); };
const addAt = (z, t0, f) => { for (let i = Math.max(0, Math.round(t0 * sr)); i < z.length; i++) { const v = f((i - t0 * sr) / sr); if (v === null) break; z[i] += v; } };
const loopX = (x) => { // seamless loop: cross-fade the tail into the head
  const m = x.length - xf, y = new Float64Array(m);
  for (let i = 0; i < m; i++) y[i] = i < xf ? x[i] * Math.sin((0.5 * Math.PI * i) / xf) + x[m + i] * Math.cos((0.5 * Math.PI * i) / xf) : x[i];
  return y;
};
// Warm-up so slow filters settle before the part we keep.
const WARM = 6 * sr;
const slow = (fc, passes = 1) => lp(noise(len + WARM), fc, passes).slice(WARM);
const tick = (z, t0, a, hard, fr, decay) => { // a short click: a noise burst plus ringing case resonances
  const c = hp(noise(Math.round(0.03 * sr)), 1500, 1);
  addAt(z, t0, (t) => (t > 0.05 ? null : a * (hard * 3 * c[Math.min(c.length - 1, Math.round(t * sr))] * Math.exp(-t / (decay * 0.5)) * (t < 0.03 ? 1 : 0)
    + 0.9 * Math.sin(TAU * fr[0] * t) * Math.exp(-t / decay) + 0.6 * Math.sin(TAU * fr[1] * t) * Math.exp(-t / (decay * 0.8)))));
};

let z = new Float64Array(len);
if (kind === 'contactor') {
  const o = part === 'open', p = pitch, body = o ? 48 : 62;
  const burst = band(noise(n), 90, 700);
  const slam = (t0, a) => {
    addAt(z, t0, (t) => (t > 0.25 ? null : a * (1.5 * Math.sin(TAU * body * t) * Math.exp(-t / 0.045) + 0.9 * burst[Math.min(n - 1, Math.round(t * sr))] * Math.exp(-t / 0.012) + 0.5 * Math.sin(TAU * 150 * t) * Math.exp(-t / 0.07))));
  };
  if (o) { slam(0.01, 0.55); tick(z, 0.012, 0.7, 1, [1500 * p, 2800 * p], 0.0025); }
  else {
    slam(0.01, 1); tick(z, 0.008, 1.4, 1.2, [1900 * p, 3400 * p], 0.002);
    slam(0.021, 0.35); tick(z, 0.021, 0.5, 0.8, [1700 * p, 3100 * p], 0.0018);
    tick(z, 0.033, 0.25, 0.6, [2100 * p, 3600 * p], 0.0015);
  }
  z = lp(z, 6500, 1);
} else if (kind === 'cabfan') {
  const air = band(noise(len + WARM), 180, 3200).slice(WARM), rum = band(noise(len + WARM), 45, 130).slice(WARM), wob = norm(slow(1.2, 2)), wob2 = norm(slow(0.35, 2));
  for (let i = 0; i < len; i++) {
    const t = i / sr;
    z[i] = air[i] * (0.8 + 0.12 * wob[i] + 0.08 * wob2[i]) * (1 + 0.025 * Math.sin(TAU * 47 * t)) + 2.2 * rum[i] * (0.85 + 0.15 * wob2[i]);
  }
  z = loopX(z);
} else if (kind === 'pump') {
  const flow = band(noise(len + WARM), 300, 900).slice(WARM), rum = band(noise(len + WARM), 30, 120).slice(WARM), wob = norm(slow(0.8, 2));
  const cyc = (f) => Math.round(f * seconds) / seconds; // whole cycles per loop
  for (let i = 0; i < len; i++) {
    const t = i / sr;
    z[i] = (0.9 * Math.sin(TAU * cyc(72) * t) + 0.45 * Math.sin(TAU * cyc(144) * t + 0.7) + 0.18 * Math.sin(TAU * cyc(216) * t + 1.9)) * (0.92 + 0.08 * wob[i])
      + 0.9 * flow[i] * (0.7 + 0.3 * wob[i]) + 1.2 * rum[i];
  }
  z = loopX(z);
} else if (kind === 'latch') {
  const i0 = part === 'in';
  const plastic = (t0, a) => tick(z, t0, a, 0.5, [2400, 3800], 0.004);
  const clack = (t0, a) => addAt(z, t0, (t) => (t > 0.08 ? null : a * (1.4 * Math.sin(TAU * 900 * t) * Math.exp(-t / 0.01) + 0.7 * Math.sin(TAU * 1700 * t) * Math.exp(-t / 0.006) + 0.9 * Math.sin(TAU * 190 * t) * Math.exp(-t / 0.025))));
  if (i0) { plastic(0.01, 1); clack(0.038, 0.9); } else { clack(0.01, 0.6); plastic(0.04, 0.5); }
  z = lp(z, 7000, 1);
} else if (kind === 'heater') {
  tick(z, 0.01, 1, 1.2, [1300, 3000], 0.003);
  addAt(z, 0.012, (t) => (t > 0.1 ? null : 1.1 * Math.sin(TAU * 380 * t) * Math.exp(-t / 0.02)));
  tick(z, 0.045, 0.45, 0.6, [1000, 2400], 0.004); // switch settles
  for (const t0 of [0.25 + 0.1 * r01(), 0.5 + 0.1 * r01(), 0.75 + 0.05 * r01()]) tick(z, Math.min(t0, seconds - 0.06), 0.12 + 0.08 * r01(), 0.3, [1600, 2500], 0.005);
  z = lp(z, 7000, 1);
} else if (kind === 'heaterfan') {
  const air = band(noise(len + WARM), 350, 4200).slice(WARM), body = band(noise(len + WARM), 60, 260).slice(WARM), wob = norm(slow(1.6, 2));
  const cyc = (f) => Math.round(f * seconds) / seconds;
  for (let i = 0; i < len; i++) {
    const t = i / sr;
    z[i] = air[i] * (0.85 + 0.15 * wob[i]) + 0.8 * body[i] + 0.25 * Math.sin(TAU * cyc(100) * t) + 0.12 * Math.sin(TAU * cyc(200) * t + 1.1);
  }
  z = loopX(z);
} else { // station
  const wind = band(noise(len + WARM), 70, 600).slice(WARM), gust = norm(slow(0.25, 2)), swirl = norm(slow(1.5, 2));
  const road = band(noise(len), 90, 900), hum = band(noise(len + WARM), 120, 700).slice(WARM);
  const tr = new Float64Array(len), truck = lp(road, 300, 1);
  // Car passes: [centre s, width s, level]; ends wrap through the cross-fade because the loop is cut after len.
  const passes = [[3.1, 5, 0.9], [7.6, 4.2, 0.6], [11.2, 6, 1], [15.4, 4.5, 0.7], [19.2, 5.5, 0.8]].map(([c, w, a]) => [c + 0.4 * rnd(), w, a]);
  passes.push([13.2, 7, 0.9]); // truck, lower
  for (const [c, w, a] of passes) for (let i = 0; i < len; i++) { const u = (i / sr - c) / w; if (Math.abs(u) < 1) tr[i] += a * Math.cos(0.5 * Math.PI * u) ** 2 * (c === 13.2 ? truck[i] * 1.6 : road[i]); }
  for (let i = 0; i < len; i++) z[i] = wind[i] * (0.5 + 0.5 * gust[i]) * (0.9 + 0.1 * swirl[i]) * 2.2 + 0.9 * tr[i] + 0.25 * hum[i];
  z = loopX(z);
}
const nOut = looped ? n : len;
{
  let pk = 0;
  for (let i = 0; i < nOut; i++) pk = Math.max(pk, Math.abs(z[i]));
  const fade = looped ? 0 : Math.min(Math.round(0.004 * sr), nOut >> 1);
  for (let i = 0; i < nOut; i++) z[i] *= 0.3 / (pk || 1);
  for (let i = 0; i < fade; i++) { const g = Math.sin((0.5 * Math.PI * i) / fade); z[i] *= g; z[nOut - 1 - i] *= g; }
}

const writeWav = (file, gain, reps = 1) => {
  const pcm = new Int16Array(nOut * reps);
  for (let r = 0; r < reps; r++) for (let i = 0; i < nOut; i++) pcm[r * nOut + i] = Math.round(Math.max(-1, Math.min(1, z[i] * gain)) * 32767);
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

const tmp = mkdtempSync(join(tmpdir(), `sfx-${kind}-`));
try {
  const reps = Math.max(1, Math.ceil(4 / seconds)), wav = join(tmp, `${kind}.wav`);
  writeWav(wav, 1, reps);
  const d = meas(wav), gain = 10 ** ((lufs - d.i) / 20);
  if (d.tp + (lufs - d.i) > -1.5) fail(`peak would exceed -1.5 dBTP at ${lufs} LUFS (${(d.tp + lufs - d.i).toFixed(2)}); lower --lufs`);
  writeWav(wav, gain);
  mkdirSync(dirname(outFile), {recursive: true});
  const r = ff(['-i', wav, '-c:a', 'libmp3lame', '-b:a', '128k', outFile]);
  if (r.status !== 0) fail(`ffmpeg failed:\n${(r.stderr || '').slice(-1500)}`);
  console.log(`wrote ${outFile} (${kind}, ${seconds.toFixed(2)} s, target ${lufs} LUFS)`);
} finally {
  rmSync(tmp, {recursive: true, force: true});
}
