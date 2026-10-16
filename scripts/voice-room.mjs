// Gives the voiceover a light sense of room so it sits in the same space as the music bed.
// Local processing only (free, no network, no dependencies). Never modifies the input.
//
// Usage: yarn voice:room <slug> [--wet <dB>] [--size <0..1>] [--width <0..1>] [--out <name>]
//   --wet    wet level relative to dry, dB (default -18)
//   --size   room size 0..1 (default 0.5; RT60 0.30 s .. 0.55 s, delay lengths scale with it)
//   --width  stereo spread of the dry voice 0..1 (default 0). Mid/side lift of a decorrelated copy,
//            so the mono sum is exactly the original (mono-compatible).
//   --out    output name without extension (default voiceover-room), written in src/videos/<slug>/audio/
// Reads src/videos/<slug>/audio/voiceover.mp3. Output is stereo 44.1 kHz mp3 (192k), same length as the input.
//
// How: Remotion's bundled ffmpeg decodes to float PCM, Node does the DSP, ffmpeg encodes. The ffmpeg
// bundle has no reverb or EQ filters. DSP: dry centred and unchanged; wet = 15 ms predelay -> 200 Hz
// high-pass -> 5.5 kHz low-pass -> Freeverb-style bank (8 combs + 4 allpasses per side, side delays
// offset so left and right are decorrelated). Output is gain-matched to the input's integrated loudness
// (measured on the mono fold, so a mono source compares like for like) and a limiter holds the peak.
// Deterministic: no randomness at all, so the same input gives byte-identical output.
import {spawnSync} from 'node:child_process';
import {existsSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {parseArgs, validName} from './audio-lib.mjs';

const SR = 44100;
const root = path.resolve(import.meta.dirname, '..');

const fail = (m) => {
  console.error(m);
  process.exit(1);
};

const ffmpeg = (args, opts = {}) => {
  const r = spawnSync('npx', ['remotion', 'ffmpeg', '-hide_banner', '-nostdin', ...args], {
    cwd: root,
    encoding: 'utf8',
    maxBuffer: 1 << 28,
    ...opts,
  });
  if (r.status !== 0 && !opts.allowFail) fail(`ffmpeg failed:\n${(r.stderr || '').slice(-1500)}`);
  return r;
};

/** 16-bit PCM WAV I/O (the bundled ffmpeg has no raw PCM muxer and no float PCM encoder). */
const wavHeader = (bytes, ch) => {
  const h = Buffer.alloc(44);
  h.write('RIFF', 0); h.writeUInt32LE(36 + bytes, 4); h.write('WAVEfmt ', 8);
  h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(ch, 22);
  h.writeUInt32LE(SR, 24); h.writeUInt32LE(SR * ch * 2, 28); h.writeUInt16LE(ch * 2, 32);
  h.writeUInt16LE(16, 34); h.write('data', 36); h.writeUInt32LE(bytes, 40);
  return h;
};
const readWav = (file) => {
  const b = readFileSync(file);
  let p = 12;
  while (p + 8 <= b.length && b.toString('latin1', p, p + 4) !== 'data') p += 8 + b.readUInt32LE(p + 4);
  const start = p + 8;
  const len = Math.floor((b.length - start) / 2);
  const o = new Float32Array(len);
  for (let i = 0; i < len; i++) o[i] = b.readInt16LE(start + 2 * i) / 32768;
  return o;
};

/** Integrated loudness and true peak of a WAV, via ffmpeg loudnorm (print only). */
const measure = (file, ch, fold) => {
  const af = (fold && ch === 2 ? 'pan=mono|c0=0.5*c0+0.5*c1,' : '') + 'loudnorm=print_format=json';
  const r = ffmpeg(['-i', file, '-af', af, '-f', 'null', '-']);
  const j = JSON.parse(r.stderr.slice(r.stderr.lastIndexOf('{'), r.stderr.lastIndexOf('}') + 1));
  return {lufs: parseFloat(j.input_i), tp: parseFloat(j.input_tp)};
};

// ---- DSP building blocks (Float32Array in, Float32Array out) ----
const biquad = (x, b0, b1, b2, a1, a2) => {
  const y = new Float32Array(x.length);
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  for (let i = 0; i < x.length; i++) {
    const v = b0 * x[i] + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2;
    x2 = x1; x1 = x[i]; y2 = y1; y1 = v; y[i] = v;
  }
  return y;
};
const rbj = (type, f0, q = Math.SQRT1_2) => {
  const w = (2 * Math.PI * f0) / SR, c = Math.cos(w), al = Math.sin(w) / (2 * q), a0 = 1 + al;
  const lo = type === 'lp';
  const b0 = ((lo ? 1 - c : 1 + c) / 2) / a0;
  return [b0, (lo ? 1 - c : -(1 + c)) / a0, b0, (-2 * c) / a0, (1 - al) / a0];
};
const filt = (x, type, f0, order = 2) => {
  let y = x;
  for (let i = 0; i < order / 2; i++) y = biquad(y, ...rbj(type, f0));
  return y;
};

const comb = (x, delay, rt60, damp) => {
  const g = Math.pow(10, (-3 * delay) / (SR * rt60)); // feedback for the target RT60
  const buf = new Float32Array(delay);
  const y = new Float32Array(x.length);
  let p = 0, lp = 0;
  for (let i = 0; i < x.length; i++) {
    const o = buf[p];
    lp = o * (1 - damp) + lp * damp; // damped feedback: highs die faster, like a real room
    buf[p] = x[i] + lp * g;
    y[i] = o;
    if (++p === delay) p = 0;
  }
  return y;
};
const allpass = (x, delay, g) => {
  const buf = new Float32Array(delay);
  const y = new Float32Array(x.length);
  let p = 0;
  for (let i = 0; i < x.length; i++) {
    const b = buf[p];
    const v = x[i] + b * g;
    buf[p] = v;
    y[i] = b - v * g;
    if (++p === delay) p = 0;
  }
  return y;
};

const COMBS = [1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617]; // Freeverb tunings at 44.1 kHz
const APS = [556, 441, 341, 225];
const reverb = (x, side, size) => {
  const sc = 0.8 + 0.4 * size; // delay scale
  const rt60 = 0.3 + 0.25 * size;
  const spread = side * 23;
  const sum = new Float32Array(x.length);
  for (const d of COMBS) {
    const y = comb(x, Math.round(d * sc) + spread, rt60, 0.35);
    for (let i = 0; i < y.length; i++) sum[i] += y[i] / COMBS.length;
  }
  let y = sum;
  for (const d of APS) y = allpass(y, Math.round(d * sc) + spread, 0.5);
  return y;
};

// ---- main ----
let parsed;
try {
  parsed = parseArgs(process.argv.slice(2), ['--wet', '--size', '--width', '--out']);
} catch (e) {
  fail(`${e.message}\nUsage: yarn voice:room <slug> [--wet <dB>] [--size <0..1>] [--width <0..1>] [--out <name>]`);
}
const {pos, opts} = parsed;
const slug = pos[0];
if (!slug || pos.length > 1 || !validName(slug)) fail('Usage: yarn voice:room <slug> [--wet <dB>] [--size <0..1>] [--width <0..1>] [--out <name>]');
const num = (k, d, lo, hi) => {
  if (opts[k] === undefined) return d;
  const v = Number(opts[k]);
  if (!Number.isFinite(v) || v < lo || v > hi) fail(`--${k} must be a number from ${lo} to ${hi}.`);
  return v;
};
const wetDb = num('wet', -18, -60, 0);
const size = num('size', 0.5, 0, 1);
const width = num('width', 0, 0, 1);
const outName = opts.out ?? 'voiceover-room';
if (!validName(outName)) fail('--out must be a plain name (letters, digits, dash, underscore, dot).');

const dir = path.join(root, 'src', 'videos', slug, 'audio');
const inFile = path.join(dir, 'voiceover.mp3');
const outFile = path.join(dir, `${outName}.mp3`);
if (!existsSync(inFile)) fail(`Missing ${path.relative(root, inFile)}.`);
if (path.resolve(outFile) === path.resolve(inFile)) fail('Refusing to overwrite the input.');

const tmp = mkdtempSync(path.join(tmpdir(), 'voice-room-'));
try {
  // 1. decode to mono float PCM at 44.1 kHz
  const dryRaw = path.join(tmp, 'dry.wav');
  ffmpeg(['-i', inFile, '-vn', '-ac', '1', '-ar', String(SR), '-c:a', 'pcm_s16le', dryRaw]);
  const dry = readWav(dryRaw);
  const n = dry.length;
  const inM = measure(dryRaw, 1, false);

  // 2. wet path: predelay -> low-cut -> high-cut -> reverb (L/R decorrelated)
  const pre = Math.round(0.015 * SR);
  const delayed = new Float32Array(n);
  delayed.set(dry.subarray(0, n - pre), pre);
  const feed = filt(filt(delayed, 'hp', 200), 'lp', 5500);
  const wetG = Math.pow(10, wetDb / 20);
  const wetL = reverb(feed, 0, size);
  const wetR = reverb(feed, 1, size);

  // 3. dry (centred; optional mono-compatible spread via +/- a decorrelated copy)
  let side = null;
  if (width > 0) {
    let s = dry;
    for (const [d, g] of [[113, 0.6], [37, 0.6]]) s = allpass(s, d, g);
    side = s;
  }
  const L = new Float32Array(n), R = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const sd = side ? side[i] * width * 0.2 : 0;
    L[i] = dry[i] + sd + wetL[i] * wetG;
    R[i] = dry[i] - sd + wetR[i] * wetG;
  }

  const inter = (a, b, g, lim) => {
    const o = new Float32Array(n * 2);
    for (let i = 0; i < n; i++) {
      const k = g * (lim ? lim[i] : 1);
      o[2 * i] = a[i] * k;
      o[2 * i + 1] = b[i] * k;
    }
    return o;
  };
  const write = (name, arr, scale = 1) => {
    const f = path.join(tmp, name);
    const pcm = Buffer.alloc(arr.length * 2);
    for (let i = 0; i < arr.length; i++) pcm.writeInt16LE(Math.round(Math.max(-1, Math.min(0.99997, arr[i] * scale)) * 32768), 2 * i);
    writeFileSync(f, Buffer.concat([wavHeader(pcm.length, 2), pcm]));
    return f;
  };

  // 4. match loudness (mono fold of the output vs the input), then limit
  const probe = write('probe.wav', inter(L, R, 1), 0.5); // -6.02 dB so nothing clips in 16-bit PCM
  const gain = Math.pow(10, (inM.lufs - (measure(probe, 2, true).lufs + 6.0206)) / 20);
  const CEIL = Math.pow(10, -2 / 20); // -2 dBFS sample peak leaves room for true peak and mp3 overshoot
  // Limiter: instant attack, smooth release. Gain envelope is the same on both channels.
  const env = new Float32Array(n);
  let cur = 1;
  const rel = Math.exp(-1 / (0.08 * SR));
  for (let i = 0; i < n; i++) {
    const pk = Math.max(Math.abs(L[i]), Math.abs(R[i])) * gain;
    const need = pk > CEIL ? CEIL / pk : 1;
    cur = need < cur ? need : 1 - (1 - cur) * rel;
    env[i] = cur;
  }
  // look-behind smoothing can't prevent the first sample of a peak, so enforce the ceiling hard
  for (let i = 0; i < n; i++) {
    const pk = Math.max(Math.abs(L[i]), Math.abs(R[i])) * gain;
    if (pk * env[i] > CEIL) env[i] = CEIL / pk;
  }
  const final = write('final.wav', inter(L, R, gain, env));

  // 5. encode (the mp3 encoder delay matches the input's, so timings line up)
  ffmpeg(['-i', final, '-c:a', 'libmp3lame', '-b:a', '192k',
    '-ar', String(SR), '-ac', '2', '-map_metadata', '-1', '-bitexact', '-flags:a', '+bitexact',
    '-fflags', '+bitexact', '-y', outFile]);

  // 6. report: re-decode what was written
  const back = path.join(tmp, 'back.wav');
  ffmpeg(['-i', outFile, '-ac', '2', '-ar', String(SR), '-c:a', 'pcm_s16le', back]);
  const outStereo = measure(back, 2, false);
  const outMono = measure(back, 2, true);
  const samples = readWav(back).length / 2;
  const sha = createHash('sha256').update(readFileSync(outFile)).digest('hex').slice(0, 16);
  console.log(`room: wet ${wetDb} dB, size ${size}, width ${width}`);
  console.log(`in : ${inM.lufs} LUFS, ${inM.tp} dBTP, ${n} samples (${(n / SR).toFixed(3)} s)`);
  console.log(`out: ${outMono.lufs} LUFS mono fold (${outStereo.lufs} stereo), ${Math.max(outMono.tp, outStereo.tp)} dBTP, ${samples} samples`);
  console.log(`wrote ${path.relative(root, outFile)} (${statSync(outFile).size} bytes, sha256 ${sha}...)`);
  if (samples !== n) console.warn(`WARNING: length differs from the input by ${samples - n} samples.`);
} finally {
  rmSync(tmp, {recursive: true, force: true});
}
