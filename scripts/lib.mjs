// Shared helpers for the per-video scripts.
import {existsSync, mkdirSync, readdirSync, readFileSync} from 'node:fs';

// Load secrets from .env (ELEVENLABS_API_KEY, ...) when it exists.
if (existsSync('.env')) process.loadEnvFile('.env');

export const listVideos = () =>
  readdirSync('src/videos', {withFileTypes: true})
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

/** Paths for one video. Exits with a helpful message if the slug is unknown. */
export const videoPaths = (slug, usage) => {
  if (!slug) {
    console.error(`usage: ${usage}\nvideos: ${listVideos().join(', ')}`);
    process.exit(1);
  }
  const dir = `src/videos/${slug}`;
  if (!existsSync(dir)) {
    console.error(`No video "${slug}" in src/videos/. Create one with: yarn new ${slug}`);
    process.exit(1);
  }
  mkdirSync(`public/${slug}`, {recursive: true});
  return {
    dir,
    script: `${dir}/script.txt`,
    transcript: `${dir}/transcript.json`,
    // Relative to public/, as staticFile() expects.
    audio: `${slug}/voiceover.mp3`,
    audioFile: `public/${slug}/voiceover.mp3`,
    performance: `${dir}/performance.txt`,
    voice: `${dir}/voice.json`,
    takesDir: `out/voices/${slug}`,
  };
};

/** Remove audio tags like [pause] and ellipses from performance text. */
export const stripTags = (text) =>
  text
    .replace(/\[[^\]]*\]/g, ' ')
    .replace(/\u2026|\.{2,}/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .join(' ');

/** Lowercase letters/digits only, for comparing words ignoring punctuation. */
export const norm = (s) => s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '');

/** Require ELEVENLABS_API_KEY or exit. Never print it. */
export const apiKey = () => {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) {
    console.error('Set ELEVENLABS_API_KEY in .env first (see .env.example).');
    process.exit(1);
  }
  return key;
};

/** Parse src/videos/<slug>/voice.json if present. */
export const readVoiceConfig = (paths) =>
  existsSync(paths.voice) ? JSON.parse(readFileSync(paths.voice, 'utf8')) : {};

/**
 * Take each word's text (with punctuation) from script.txt, keep timings from the alignment.
 * Only when the word counts match; otherwise returns the words unchanged.
 */
export const withScriptText = (words, scriptText) => {
  const tokens = scriptText.split(/\s+/).filter(Boolean);
  if (tokens.length !== words.length) return {words, applied: false, scriptCount: tokens.length};
  return {words: words.map((w, i) => ({...w, text: tokens[i]})), applied: true, scriptCount: tokens.length};
};
