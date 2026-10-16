// Pure sound-mix maths (no React, no browser APIs): safe to import from Node scripts.
// Levels are in dB relative to the voiceover, which plays at gain 1 (0 dB).
import type {MusicSpec, SfxOverlay, VideoSpec} from '../types';

/** Music bed defaults (style guide § 9: enters after the hook, 16–20 dB under the voice). */
export const MUSIC_DEFAULTS = {
  /** Seconds into the video when the bed starts fading in (≥ 3 s, after the hook). */
  startAt: 3,
  /** Seconds of fade-in from `startAt`. */
  fadeIn: 2,
  /** Seconds of fade-out, ending silent on the last frame (clean loop). */
  fadeOut: 1.5,
  /** dB relative to the voice. */
  level: -18,
  /** Extra dB of dip while words are spoken. */
  duckDb: 4,
} as const;

/** Duck envelope timing (seconds). */
export const DUCK_ATTACK = 0.15;
export const DUCK_RELEASE = 0.3;
/** Gaps between words shorter than this stay ducked (no pumping between words). */
export const DUCK_BRIDGE = 0.35;

export const dbToGain = (db: number) => Math.pow(10, db / 20);

/** `public/`-relative path of the music bed. */
export const musicSrc = (slug: string, music: MusicSpec) => music.src ?? `${slug}/music.mp3`;

/** Timeline label of an audition take: `music-a` → "Music A", `calm` → "Music CALM". */
export const auditionLabel = (entry: string) =>
  `Music ${entry.replace(/^music[-_ ]?/i, '').toUpperCase() || entry}`;

/**
 * The music beds to play, each `{key, name, src}`. Normally the one `src` bed. In audition mode one
 * per `audition` entry (`<slug>/<entry>.mp3`), or only the first when `rendering` (a render must never
 * mix several beds).
 */
export const musicBeds = (
  slug: string,
  music: MusicSpec,
  rendering: boolean,
): {key: string; name: string; src: string}[] => {
  const takes = music.audition ?? [];
  if (!takes.length) return [{key: 'music', name: 'music', src: musicSrc(slug, music)}];
  return (rendering ? takes.slice(0, 1) : takes).map((t) => ({
    key: t,
    name: auditionLabel(t),
    src: `${slug}/${t}.mp3`,
  }));
};

/** The warning `yarn check` and renders give while audition mode is on, or null. */
export const auditionWarning = (music: MusicSpec | undefined): string | null =>
  music?.audition?.length
    ? `music audition is on (${music.audition.join(', ')}): renders play only "${music.audition[0]}". ` +
      'Remove `audition` from the music block once a take is chosen.'
    : null;

/** `public/`-relative path of a sound effect. */
export const sfxSrc = (slug: string, name: string) => `${slug}/sfx/${name}.mp3`;

/**
 * Every sound file a video asks for (`public/`-relative), with where it is asked from.
 * For `yarn check` (missing-file warnings) and the renderer.
 */
export const soundFiles = (slug: string, spec: VideoSpec): {src: string; from: string}[] => {
  const out: {src: string; from: string}[] = [];
  if (spec.music) {
    musicBeds(slug, spec.music, false).forEach((b) =>
      out.push({src: b.src, from: spec.music?.audition ? `music audition "${b.key}"` : 'music'}),
    );
  }
  if (spec.voice?.src) out.push({src: `${slug}/${spec.voice.src}`, from: 'voice.src (falls back to transcript.audio)'});
  spec.scenes.forEach((s, i) =>
    (s.overlays ?? []).forEach((o) => {
      if (o.type === 'sfx') out.push({src: sfxSrc(slug, o.name), from: `scene ${i + 1} sfx "${o.name}"`});
    }),
  );
  return out;
};

/**
 * Per-frame duck amount (0 = no dip, 1 = full `duckDb` dip) over `durationInFrames`, from word
 * timings. Each spoken stretch (words joined across gaps under DUCK_BRIDGE) ramps the dip in over
 * DUCK_ATTACK so it is fully down by the first word (look-ahead), holds to the last word's end, then
 * ramps out over DUCK_RELEASE. Pure function of the words: the same on every render.
 */
export const duckEnvelope = (
  words: {start: number; end: number}[],
  durationInFrames: number,
  fps: number,
): Float32Array => {
  const env = new Float32Array(Math.max(0, durationInFrames));
  // merge words into spoken stretches
  const spans: [number, number][] = [];
  for (const w of words) {
    const last = spans[spans.length - 1];
    if (last && w.start - last[1] < DUCK_BRIDGE) last[1] = Math.max(last[1], w.end);
    else spans.push([w.start, w.end]);
  }
  for (const [a, b] of spans) {
    for (let f = 0; f < env.length; f++) {
      const t = f / fps;
      let v = 0;
      if (t >= a && t <= b) v = 1;
      else if (t < a && t > a - DUCK_ATTACK) v = 1 - (a - t) / DUCK_ATTACK;
      else if (t > b && t < b + DUCK_RELEASE) v = 1 - (t - b) / DUCK_RELEASE;
      if (v > env[f]) env[f] = v;
    }
  }
  // ease the ramps (smoothstep) so the dip has no corners
  for (let f = 0; f < env.length; f++) env[f] = env[f] * env[f] * (3 - 2 * env[f]);
  return env;
};

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

/**
 * Gain of the music bed at absolute frame `frame` (0 before `startAt`, silent on the last frame).
 * Fades are equal-power (sine) curves; the duck is applied in dB.
 */
export const musicGain = (
  frame: number,
  durationInFrames: number,
  fps: number,
  music: MusicSpec,
  duck: Float32Array,
): number => {
  const startAt = music.startAt ?? MUSIC_DEFAULTS.startAt;
  const fadeIn = Math.max(1 / fps, music.fadeIn ?? MUSIC_DEFAULTS.fadeIn);
  const fadeOut = Math.max(1 / fps, music.fadeOut ?? MUSIC_DEFAULTS.fadeOut);
  const level = music.level ?? MUSIC_DEFAULTS.level;
  const duckDb = music.duckDb ?? MUSIC_DEFAULTS.duckDb;
  const lastFrame = durationInFrames - 1;
  const inP = clamp01((frame / fps - startAt) / fadeIn);
  const outP = clamp01((lastFrame - frame) / (fadeOut * fps));
  const fade = Math.sin((inP * Math.PI) / 2) * Math.sin((outP * Math.PI) / 2);
  const d = duck[Math.min(duck.length - 1, Math.max(0, frame))] ?? 0;
  return fade * dbToGain(level - duckDb * d);
};

/**
 * Gain of a sound effect at frame `frame` of its own sequence: its `volume` (dB), with an optional
 * linear `fade` (seconds) in at the start and out before `length` frames (when it has an end).
 */
export const sfxGain = (frame: number, fps: number, o: Pick<SfxOverlay, 'volume' | 'fade'>, length?: number) => {
  const fade = (o.fade ?? 0) * fps;
  const base = dbToGain(o.volume ?? 0);
  if (fade <= 0) return base;
  const inP = clamp01(frame / fade);
  const outP = length === undefined ? 1 : clamp01((length - 1 - frame) / fade);
  return base * Math.min(inP, outP);
};
