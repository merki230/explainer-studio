// Shared helpers for the per-video scripts.
import {existsSync, mkdirSync, readdirSync} from 'node:fs';

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
  };
};
