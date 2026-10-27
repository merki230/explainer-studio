// Self-made roadside sounds for No. 009 (mile-markers): deterministic synths (no API, no cost).
// Physical sounds only: no whooshes, whines or risers. (The engine stall is `sfx:engine --die`, in sfx-drive.mjs.)
//
// usage: yarn sfx:<kind> <slug> [--name <kind>] [--out <file>] [--seconds N] [--lufs L] [kind options]
//        (or: node scripts/sfx-road.mjs <kind> <slug> ...)
//   kinds: gravel | hazard | phone | night | diesel
//
//  gravel   tires rolling onto the gravel shoulder and slowing to a stop (default 3.2 s). Stone crunches are
//           seeded Poisson-ish grains (band-passed noise, 3-8 ms decay, heavy-tailed sizes) at 220/s x speed,
//           over a band-passed tire scrub and a low roll. Speed falls (1-u)^1.4 to zero at 85% of the clip, so
//           the crunch thins out to single stones, then silence. --speed X scales the start speed (0.3-1.5).
//  hazard   hazard-flasher relay at 1.4 Hz (= HAZARD_HZ in src/three/real/hazard.ts): a sharp tick when the
//           contacts close (lamp on, at t = k/1.4) and a softer, lower clack when they open (half a cycle
//           later, lamp off). Case resonances 1.1 k and 2.7 k, a small 220 Hz housing thump. Default
//           10 cycles = 7.1428 s, seamless loop. --outside = heard through the car body from the road (low-
//           passed 1.8 kHz, thinner). Start it on a video time that is a multiple of 1/1.4 s (0.7143 s), or
//           trim it by the phase, so ticks land on the lamp edges.
//  phone    a small phone speaker (band-limited 350-3300 Hz, a little saturation). --part dial = the three
//           DTMF digits 9-1-1 (852+1477, 697+1209, 697+1209 Hz; 120 ms tones, 80 ms gaps; 0.52 s);
//           --part ring = US ringback 440+480 Hz, 2 s on, 4 s off, --cycles N (default 1; ends after the last
//           on-period); --part connect = a soft 0.2 s answer click; --part all (default) = dial, 0.6 s, ringback.
//  night    quiet rural night bed (default 16 s, seamless loop, 1.2 s cross-fade): low wind (80-500 Hz noise,
//           slow gusts) and a few distant field crickets (4.2-4.9 kHz pulse trains, 3 pulses per chirp).
//           --crickets 0..1 (default 0.6) sets their level against the wind (0 = wind only).
//  diesel   a diesel pickup arriving and stopping (default 5 s): inline-six at 1300 rpm easing to 650 idle,
//           combustion knock per firing (noise burst + 90 Hz body), a muffled start that opens up as it
//           comes close, gravel/road roll that thins as it brakes, a stop at 3.2 s with an air-brake hiss
//           (exhaust 2-9 kHz, 0.6 s), then idle. --squeal 0..1 (default 0.2) = a light brake squeal in the
//           last 0.5 s before the stop (narrow-band noise at 2.3 kHz, flutter, not a tone; 0 = off).
// Mono 44.1 kHz, scaled to the target integrated loudness and checked to stay under -1.5 dBTP (the bundled
// ffmpeg has no limiter, so it fails rather than clips), encoded with Remotion's bundled ffmpeg (libmp3lame,
// 128k). Clips under 4 s are measured repeated back to back. Same samples every run. Default output:
// out/<slug>/raw/sfx/<name>.mp3 (audition; never touches src/). Not logged in audio-log.md.
import {spawnSync} from 'node:child_process';
import {mkdirSync, mkdtempSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {dirname, join} from 'node:path';

const KINDS = {
  gravel: {seconds: 3.2, lufs: -24},
  hazard: {seconds: 10 / 1.4, lufs: -32},
  phone: {seconds: 0, lufs: -24},
  night: {seconds: 16, lufs: -28},
  diesel: {seconds: 5, lufs: -22},
};
const usage = `yarn sfx:<${Object.keys(KINDS).join('|')}> <slug> [--name <kind>] [--out <file>] [--seconds N] [--lufs L]\n  gravel [--speed X] | hazard [--outside] | phone [--part dial|ring|connect|all] [--cycles N] | night [--crickets 0..1] | diesel [--squeal 0..1]`;
const fail = (msg) => {
  console.error(`${msg}\nusage: ${usage}`);
  process.exit(1);
};
const argv = process.argv.slice(2);
if (argv.includes('--help') || argv.includes('-h')) {
  console.log(`${usage}\n\n  Default output: out/<slug>/raw/sfx/<name>.mp3 (audition; never writes into src/).`);
  process.exit(0);
}
const opt = {name: '', out: '', seconds: '', lufs: '', speed: '1', outside: '', part: 'all', cycles: '1', crickets: '0.6', squeal: '0.2'};
const flags = new Set(['outside']);
const pos = [];
for (let i = 0; i < argv.length; i++) {
  if (argv[i].startsWith('--') && flags.has(argv[i].slice(2))) opt[argv[i].slice(2)] = '1';
  else if (argv[i].startsWith('--') && argv[i].slice(2) in opt) opt[argv[i].slice(2)] = argv[++i] ?? '';
  else pos.push(argv[i]);
}
const [kind, slug] = pos;
const re = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;
if (!(kind in KINDS)) fail('first argument must be a kind');
const D = KINDS[kind];
const name = opt.name || kind;
if (!slug || pos.length > 2 || !re.test(slug) || !re.test(name)) fail('expected exactly one valid <slug> and a valid --name');
const part = opt.part, cycles = Number(opt.cycles), speed0 = Number(opt.speed), crick = Number(opt.crickets), squeal = Number(opt.squeal), outside = opt.outside === '1';
if (!['dial', 'ring', 'connect', 'all'].includes(part)) fail('--part is dial, ring, connect or all');
if (!Number.isInteger(cycles) || cycles < 1 || cycles > 6) fail('--cycles is an integer 1-6');
if (!(speed0 >= 0.3 && speed0 <= 1.5) || !(crick >= 0 && crick <= 1) || !(squeal >= 0 && squeal <= 1)) fail('--speed 0.3-1.5, --crickets and --squeal 0-1');
const phoneSeconds = {dial: 0.52, connect: 0.2, ring: 2 + 6 * (cycles - 1), all: 0.52 + 0.6 + 2 + 6 * (cycles - 1)}[part];
const seconds = opt.seconds === '' ? (kind === 'phone' ? phoneSeconds : D.seconds) : Number(opt.seconds);
const lufs = opt.lufs === '' ? D.lufs : Number(opt.lufs);
if (!(seconds >= 0.1 && seconds <= 60) || !(lufs < 0 && lufs > -50)) fail('invalid --seconds (0.1-60) or --lufs');
const outFile = opt.out || join('out', slug, 'raw', 'sfx', `${name}.mp3`);

const sr = 44100, n = Math.round(sr * seconds), TAU = 2 * Math.PI;
let seed = 909;
const r01 = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
const rnd = () => r01() * 2 - 1;
const noise = (len) => Float64Array.from({length: len}, rnd);
const lp = (x, fc, passes = 1) => {
  const a = 1 - Math.exp((-TAU * fc) / sr), y = Float64Array.from(x);
  for (let p = 0; p < passes; p++) { let s = 0; for (let i = 0; i < y.length; i++) y[i] = s += a * (y[i] - s); }
  return y;
};
const hp = (x, fc, passes = 1) => { const l = lp(x, fc, passes); return x.map((v, i) => v - l[i]); };
const band = (x, lo, hi) => lp(hp(x, lo, 2), hi, 2);
const bq = (x, fc, q) => { // RBJ band-pass biquad (constant 0 dB peak)
  const w = (TAU * fc) / sr, al = Math.sin(w) / (2 * q), b0 = al, a0 = 1 + al, a1 = -2 * Math.cos(w) / a0, a2 = (1 - al) / a0;
  const y = new Float64Array(x.length); let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  for (let i = 0; i < x.length; i++) { y[i] = (b0 / a0) * (x[i] - x2) - a1 * y1 - a2 * y2; x2 = x1; x1 = x[i]; y2 = y1; y1 = y[i]; }
  return y;
};
const norm = (x) => { let m = 0; for (const v of x) m = Math.max(m, Math.abs(v)); return x.map((v) => v / (m || 1)); };
const smooth = (u) => { const c = Math.min(1, Math.max(0, u)); return c * c * (3 - 2 * c); };
const addAt = (z, t0, f) => { // add f(tSinceStart) from t0 until it returns null
  for (let i = Math.max(0, Math.round(t0 * sr)); i < z.length; i++) { const v = f((i - t0 * sr) / sr); if (v === null) break; z[i] += v; }
};
const loopX = (x, xf) => { // seamless loop: cross-fade the tail into the head
  const m = x.length - xf, y = new Float64Array(m);
  for (let i = 0; i < m; i++) y[i] = i < xf ? x[i] * Math.sin((0.5 * Math.PI * i) / xf) + x[m + i] * Math.cos((0.5 * Math.PI * i) / xf) : x[i];
  return y;
};
// Rolling stones: grains (random slice of band-passed noise, exponential decay) at `rate(t)` per second.
const stones = (z, rate, from = 0, to = z.length / sr) => {
  const gn = band(noise(Math.round(sr * 2)), 700, 3600);
  let acc = 0, next = 0.4 + 1.2 * r01();
  for (let i = Math.round(from * sr); i < Math.round(to * sr); i++) {
    acc += rate(i / sr) / sr;
    if (acc < next) continue;
    acc = 0; next = 0.4 + 1.2 * r01();
    const amp = 0.15 + 1.4 * r01() ** 3, tau = (0.003 + 0.005 * r01()) * sr, off = Math.floor(r01() * (gn.length - 600)), tilt = r01();
    for (let k = 0; k < 600 && i + k < z.length; k++) z[i + k] += amp * gn[off + k] * Math.exp(-k / tau) * (1 + 2 * tilt * (k < 40 ? 1 : 0));
  }
};

let z = new Float64Array(n);
if (kind === 'gravel') {
  const tStop = seconds * 0.85, v = (t) => (t >= tStop ? 0 : speed0 * (1 - t / tStop) ** 1.4);
  const scrub = band(noise(n), 600, 3000), roll = lp(noise(n), 140, 2), flut = lp(noise(n), 20, 2);
  stones(z, (t) => 220 * v(t));
  for (let i = 0; i < n; i++) {
    const vv = v(i / sr);
    z[i] = 1.6 * z[i] + 2.2 * scrub[i] * vv ** 1.2 * (0.7 + 6 * flut[i]) + 6 * roll[i] * vv;
  }
  z = lp(z, 6000, 1);
} else if (kind === 'hazard') {
  const period = 1 / 1.4, cyc = Math.round(seconds / period);
  const click = norm(hp(noise(n), 1500, 1));
  for (let k = 0; k < cyc; k++) {
    for (const [t0, a, fr] of [[k * period, 1, 1], [k * period + period / 2, 0.7, 0.85]]) {
      addAt(z, t0, (t) => (t > 0.06 ? null : a * (
        3 * click[Math.round(t * sr) + 7 > n - 1 ? 0 : Math.round(t * sr) + 7] * Math.exp(-t / 0.0008)
        + 0.9 * Math.sin(TAU * 1100 * fr * t) * Math.exp(-t / 0.006)
        + 0.6 * Math.sin(TAU * 2700 * fr * t) * Math.exp(-t / 0.003)
        + 0.8 * Math.sin(TAU * 220 * fr * t) * Math.exp(-t / 0.012))));
    }
  }
  if (outside) z = lp(z.map((v) => v * 0.7), 1800, 2);
} else if (kind === 'phone') {
  const tone = (t0, dur, freqs, amp = 1) => addAt(z, t0, (t) => {
    if (t > dur) return null;
    const env = Math.min(1, t / 0.006, (dur - t) / 0.006);
    return amp * env * freqs.reduce((s, f) => s + Math.sin(TAU * f * (t + t0)), 0) * 0.5;
  });
  if (part === 'dial' || part === 'all') for (const [i, f] of [[0, [852, 1477]], [1, [697, 1209]], [2, [697, 1209]]]) tone(i * 0.2, 0.12, f);
  if (part === 'ring' || part === 'all') for (let c = 0; c < cycles; c++) tone((part === 'all' ? 1.12 : 0) + 6 * c, 2, [440, 480], 0.8);
  if (part === 'connect') {
    const click = norm(hp(noise(n), 1200, 1));
    addAt(z, 0.01, (t) => (t > 0.1 ? null : 2 * click[Math.round(t * sr)] * Math.exp(-t / 0.0012) + 0.8 * Math.sin(TAU * 1800 * t) * Math.exp(-t / 0.006) + 0.5 * Math.sin(TAU * 600 * t) * Math.exp(-t / 0.015)));
  }
  z = band(z, 350, 3300).map((v) => Math.tanh(1.8 * v));
} else if (kind === 'night') {
  const xf = Math.round(1.2 * sr), len = n + xf, warm = 6 * sr, w = new Float64Array(len); // warm-up: the 0.2 Hz gusts need seconds to settle
  const cut = (x) => x.slice(warm);
  const base = cut(band(noise(len + warm), 80, 500)), gust = cut(lp(noise(len + warm), 0.2, 2)), swirl = cut(lp(noise(len + warm), 1.5, 2)), gm = norm(gust), sm = norm(swirl);
  for (let i = 0; i < len; i++) w[i] = base[i] * (0.55 + 0.45 * gm[i]) * (0.85 + 0.15 * sm[i]);
  const wn = norm(w), c = new Float64Array(len);
  for (const [f, rate, ph0, amp] of [[4250, 2.1, 0.13, 1], [4600, 1.7, 0.57, 0.7], [4900, 2.5, 0.81, 0.5]]) {
    const wob = cut(lp(noise(len + warm), 0.4, 1));
    for (let i = 0; i < len; i++) {
      const t = i / sr, cu = (t * rate * (1 + 0.04 * wob[i] * 20) + ph0) % 1; // chirp phase, wobbling rate
      const ct = cu / rate; // time into the chirp (s)
      if (ct > 0.2) continue;
      const pu = (ct % 0.06) / 0.06, pulse = ct < 0.15 ? Math.sin(Math.PI * Math.min(1, pu * 1.6)) ** 2 * (pu < 0.625 ? 1 : 0) : 0;
      c[i] += amp * pulse * Math.sin(TAU * f * t);
    }
  }
  const mix = new Float64Array(len);
  for (let i = 0; i < len; i++) mix[i] = wn[i] + 0.12 * crick * c[i] * 6 * (0.6 + 0.4 * gm[i]);
  z = loopX(mix, xf);
} else { // diesel
  const tStop = 3.2, tClose = 2.4;
  const rpm = (t) => (t < 2 ? 1300 - 100 * smooth(t / 2) : t < tStop ? 1200 - 550 * smooth((t - 2) / (tStop - 2)) : 650);
  const vel = (t) => (t < 2 ? 1 : t < tStop ? (1 - smooth((t - 2) / (tStop - 2))) ** 1.2 : 0);
  const knock = band(noise(n), 400, 2500), nz = band(noise(n), 60, 500), jit = lp(noise(n), 8, 2);
  const eng = new Float64Array(n);
  let ph = 0, last = -1;
  for (let i = 0; i < n; i++) {
    ph += (TAU * (rpm(i / sr) * 6)) / 120 / sr; // six firings per two revolutions
    const cy = Math.floor(ph / TAU);
    if (cy === last) continue;
    last = cy;
    const a = 0.8 + 0.5 * Math.abs(jit[i]) * 8 + 0.3 * (cy % 6 === 3 ? 1 : 0); // uneven firings
    for (let k = 0; k < 2000 && i + k < n; k++) { const t = k / sr; eng[i + k] += a * (2.4 * knock[i + k] * Math.exp(-t / 0.005) + 0.9 * Math.sin(TAU * 90 * t) * Math.exp(-t / 0.022)); }
  }
  const dull = lp(eng, 450, 2), road = new Float64Array(n);
  const scrub = band(noise(n), 500, 2800);
  stones(road, (t) => 90 * vel(t) * (t > 0.3 ? 1 : 0));
  for (let i = 0; i < n; i++) {
    const t = i / sr, e = smooth((t - 0.2) / tClose), vv = vel(t);
    z[i] = (0.25 + 0.75 * smooth(t / tClose)) * (dull[i] * (1 - e) + eng[i] * e + 0.5 * nz[i]) + (0.15 + 0.85 * smooth(t / tClose)) * (0.5 * road[i] + 1.1 * scrub[i] * vv ** 1.3);
  }
  const hiss = band(noise(n), 2000, 9000);
  for (let i = Math.round(tStop * sr); i < n; i++) { const t = i / sr - tStop; z[i] += 1.6 * hiss[i] * Math.min(1, t / 0.03) * Math.exp(-t / 0.2) * (t < 0.1 ? 1 : 0.8); }
  if (squeal > 0) {
    const sq = bq(noise(n), 2300, 30), fl = lp(noise(n), 30, 1);
    for (let i = 0; i < n; i++) { const t = i / sr, u = (t - (tStop - 0.5)) / 0.45; if (u > 0 && u < 1) z[i] += squeal * 9 * sq[i] * Math.sin(Math.PI * u) ** 2 * (0.6 + 6 * fl[i]); }
  }
  z = lp(z, 7000, 1);
}
{
  let pk = 0;
  for (let i = 0; i < n; i++) pk = Math.max(pk, Math.abs(z[i]));
  const fade = Math.min(Math.round((kind === 'night' || kind === 'hazard' ? 0 : 0.02) * sr), n >> 1);
  for (let i = 0; i < n; i++) z[i] *= 0.3 / (pk || 1);
  for (let i = 0; i < fade; i++) { const g = Math.sin((0.5 * Math.PI * i) / fade); z[i] *= g; z[n - 1 - i] *= g; }
}

const writeWav = (file, gain, reps = 1) => {
  const pcm = new Int16Array(n * reps);
  for (let r = 0; r < reps; r++) for (let i = 0; i < n; i++) pcm[r * n + i] = Math.round(Math.max(-1, Math.min(1, z[i] * gain)) * 32767);
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
