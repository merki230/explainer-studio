// Scaffold a new video: folder, placeholder script, starter spec, sources.md, estimated
// timings, and an entry in the registry (src/videos/index.ts).
//
// usage: yarn new <slug> [--horizontal]      e.g. yarn new wifi-router-tracking
//   --horizontal  a long-form video: spec `format: 'horizontal'` (1920 x 1080) and a script with `## chapter` and
//                 `> Short hook:` lines (see brand/brand.md § Structure, Long-form)
import {execFileSync} from 'node:child_process';
import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';

const horizontal = process.argv.includes('--horizontal');
const slug = process.argv.slice(2).find((a) => !a.startsWith('--'));
if (!slug || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
  console.error('usage: yarn new <slug> [--horizontal]   (lowercase words joined by dashes, e.g. wifi-router-tracking)');
  process.exit(1);
}
const dir = `src/videos/${slug}`;
if (existsSync(dir)) {
  console.error(`${dir} already exists.`);
  process.exit(1);
}

// spec lines a long-form video starts with
const WIDE = `
  format: 'horizontal',
  // shorts: [{chapter: 2, hookScene: {scene: '...'}}],  // vertical Shorts cut from chapters (see ShortSpec in src/types.ts)`;

mkdirSync(dir, {recursive: true});
// audio/ (voiceover, music, sfx; in git) and release/ (cover and frame in git, the mp4 is not)
for (const sub of ['audio', 'release']) {
  mkdirSync(`${dir}/${sub}`, {recursive: true});
  writeFileSync(`${dir}/${sub}/.gitkeep`, '');
}
writeFileSync(
  `${dir}/script.txt`,
  horizontal
    ? [
        '## The question chapter 1 answers',
        '> Short hook: A first sentence that carries this chapter\'s surprise, written for a Short.',
        'Put the video\'s hook here: the question by about 20 s, the stakes, the payoff picture. Then the rest of chapter 1.',
        '',
        '## The question chapter 2 answers',
        '> Short hook: ...',
        'Chapter 2 names its own place and subject in its first lines.',
        '',
        '## The question chapter 3 answers',
        '> Short hook: ...',
        'Chapter 3. Each chapter ends on the next one\'s question. Lines starting with ## or > are not spoken.',
        '',
      ].join('\n')
    : 'Put the hook in this first sentence. Then write the rest of the voiceover here, about 150 to 170 words for a minute.\n',
);
writeFileSync(
  `${dir}/spec.ts`,
  `import type {VideoSpec} from '../../types';

/**
 * Scene layout for this video. See src/videos/phone-listening/spec.ts for a
 * full example. Scenes start on a \`cue\` (first words of a phrase in
 * script.txt) and run until the next scene.
 */
export const spec: VideoSpec = {${horizontal ? WIDE : ''}
  scenes: [
    {
      scene: 'phone',
      chip: {text: 'Replace me'},
    },
  ],
};
`,
);

writeFileSync(
  `${dir}/sources.md`,
  `# Sources: ${slug}\n\nOne section per claim in the script. Format and statuses: docs/sources-format.md\n`,
);

// Register it between the markers in src/videos/index.ts.
const ident = slug.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase()).replace(/^(\d)/, 'v$1');
const registry = 'src/videos/index.ts';
let src = readFileSync(registry, 'utf8');
src = src.replace(
  '// </imports>',
  `import {spec as ${ident}} from './${slug}/spec';\nimport ${ident}Transcript from './${slug}/transcript.json';\n// </imports>`,
);
src = src.replace(
  '  // </entries>',
  `  '${slug}': {spec: ${ident}, transcript: ${ident}Transcript as Transcript},\n  // </entries>`,
);
writeFileSync(registry, src);

execFileSync('node', ['scripts/fake-timings.mjs', slug], {stdio: 'inherit'});
console.log(
  `\nCreated ${dir}/. Next: write ${dir}/script.txt, run "yarn timings ${slug}", then lay out ${dir}/spec.ts.`,
);
