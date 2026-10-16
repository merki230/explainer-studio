// Loudness-normalise a rendered video to the platform target (two-pass loudnorm), copying the video
// stream untouched. Called by `yarn render`; also usable alone on an existing render.
//
// usage: yarn normalize <slug>      (or: node scripts/normalize.mjs <slug>)
//   Input is out/<slug>/raw/<slug>.raw.mp4 (the raw Remotion mix). If only the release mp4 exists, it is
//   treated as the raw render and moved to the raw path first. Output: src/videos/<slug>/release/<slug>.mp4 (git-ignored).
//
// Target: -14 LUFS integrated, -1.5 dBTP, LRA 11 (edit TARGET to change).
// Pass 1 measures, pass 2 applies with linear=true. When linear can't reach the target without the true
// peak passing TP (typical for a quiet voice mix), loudnorm falls back to dynamic mode; the script
// reports which mode ran. The bundled ffmpeg has no alimiter, so there is no other way to reach -14.
// Audio: AAC, 48 kHz, 192k, trimmed to the video's length (AAC priming adds ~0.1 s of padding).
// Checks: video frame count and duration equal the raw file's; audio start within 1 frame of video.
import {execFileSync, spawnSync} from 'node:child_process';
import {existsSync, mkdirSync, renameSync, rmSync} from 'node:fs';
import {dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const TARGET = {I: -14, TP: -1.5, LRA: 11};
const FPS = 30;

const ffmpeg = (args) => {
  const r = spawnSync('remotion', ['ffmpeg', '-hide_banner', ...args], {encoding: 'utf8', maxBuffer: 1 << 28});
  if (r.status !== 0) throw new Error(`ffmpeg failed:\n${r.stderr.slice(-1500)}`);
  return r.stderr;
};

const loudnormJson = (stderr) => {
  const m = stderr.match(/\{[^{}]*"input_i"[^{}]*\}/);
  if (!m) throw new Error('Could not read loudnorm output.');
  return JSON.parse(m[0]);
};

const probe = (file) => {
  const out = execFileSync(
    'remotion',
    ['ffprobe', '-v', 'error', '-count_packets', '-show_entries',
      'stream=codec_type,start_time,duration,nb_read_packets', '-of', 'json', file],
    {encoding: 'utf8'},
  );
  const streams = JSON.parse(out).streams;
  const v = streams.find((s) => s.codec_type === 'video');
  const a = streams.find((s) => s.codec_type === 'audio');
  if (!v) throw new Error(`${file} has no video stream.`);
  return {
    frames: Number(v.nb_read_packets),
    vDur: Number(v.duration),
    vStart: Number(v.start_time),
    aStart: a ? Number(a.start_time) : null,
    aDur: a ? Number(a.duration) : null,
  };
};

const fmt = (j, p) => `${Number(j[p + 'i']).toFixed(1)} LUFS, ${Number(j[p + 'tp']).toFixed(1)} dBTP, LRA ${Number(j[p + 'lra']).toFixed(1)}`;

export const normalize = (slug) => {
  const raw = `out/${slug}/raw/${slug}.raw.mp4`;
  const final = `src/videos/${slug}/release/${slug}.mp4`;
  if (!existsSync(raw)) {
    if (!existsSync(final)) throw new Error(`Nothing to normalise: ${raw} and ${final} are missing.`);
    mkdirSync(`out/${slug}/raw`, {recursive: true});
    renameSync(final, raw);
  }
  mkdirSync(dirname(final), {recursive: true});
  const target = `I=${TARGET.I}:TP=${TARGET.TP}:LRA=${TARGET.LRA}`;
  const rawInfo = probe(raw);
  if (rawInfo.aStart === null) throw new Error(`${raw} has no audio stream.`);

  console.log(`Measuring ${raw} ...`);
  const m = loudnormJson(ffmpeg(['-i', raw, '-vn', '-af', `loudnorm=${target}:print_format=json`, '-f', 'null', '-']));
  const gain = TARGET.I - Number(m.input_i);
  const linearOk = Number(m.input_tp) + gain <= TARGET.TP;
  const measured =
    `measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:` +
    `measured_thresh=${m.input_thresh}:offset=${m.target_offset}`;

  const tmp = `out/${slug}/raw/${slug}.normalizing.mp4`;
  const args = [
    '-y', '-i', raw, '-map', '0:v', '-map', '0:a', '-c:v', 'copy',
    '-af', `loudnorm=${target}:${measured}:linear=true:print_format=json`,
    '-ar', '48000', '-c:a', 'aac', '-b:a', '192k', '-t', String(rawInfo.vDur), '-movflags', '+faststart', tmp,
  ];
  console.log(`Applying (${linearOk ? 'linear expected' : 'linear would exceed true peak, dynamic fallback expected'}) ...`);
  const applied = loudnormJson(ffmpeg(args));
  rmSync(final, {force: true});
  renameSync(tmp, final);

  // Verify the written file: loudness, sync, frames.
  const after = loudnormJson(ffmpeg(['-i', final, '-vn', '-af', `loudnorm=${target}:print_format=json`, '-f', 'null', '-']));
  const out = probe(final);
  const frame = 1 / FPS;
  const problems = [];
  if (out.frames !== rawInfo.frames) problems.push(`frame count ${rawInfo.frames} -> ${out.frames}`);
  if (Math.abs(out.vDur - rawInfo.vDur) > 1e-3) problems.push(`video duration ${rawInfo.vDur} -> ${out.vDur}`);
  if (Math.abs(out.aStart - out.vStart) > frame) problems.push(`audio starts ${(out.aStart - out.vStart).toFixed(3)} s off video`);

  console.log(`Mode:    ${applied.normalization_type}${linearOk ? '' : ' (linear would put the true peak at ' + (Number(m.input_tp) + gain).toFixed(1) + ' dBTP)'}`);
  console.log(`Before:  ${fmt(m, 'input_')}`);
  console.log(`After:   ${fmt(after, 'input_')}   (target ${TARGET.I} LUFS, <= ${TARGET.TP} dBTP)`);
  console.log(`Video:   ${out.frames} frames, ${out.vDur.toFixed(3)} s (raw ${rawInfo.frames}, ${rawInfo.vDur.toFixed(3)} s), stream copied`);
  console.log(`Audio:   start ${out.aStart.toFixed(3)} s vs video ${out.vStart.toFixed(3)} s, duration ${out.aDur.toFixed(3)} s`);
  if (problems.length) throw new Error(`Normalised file failed checks: ${problems.join('; ')}`);
  console.log(`Wrote ${final} (raw kept as ${raw}).`);
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const slug = process.argv[2];
  if (!slug) {
    console.error('usage: yarn normalize <slug>');
    process.exit(1);
  }
  normalize(slug);
}
