// Scaffold a new video: folder, placeholder script, starter spec, sources.md, estimated
// timings, and an entry in the registry (src/videos/index.ts).
//
// usage: yarn new <slug>      e.g. yarn new wifi-router-tracking
import {execFileSync} from 'node:child_process';
import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';

const slug = process.argv[2];
if (!slug || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
  console.error('usage: yarn new <slug>   (lowercase words joined by dashes, e.g. wifi-router-tracking)');
  process.exit(1);
}
const dir = `src/videos/${slug}`;
if (existsSync(dir)) {
  console.error(`${dir} already exists.`);
  process.exit(1);
}

mkdirSync(dir, {recursive: true});
mkdirSync(`public/${slug}`, {recursive: true});
writeFileSync(`public/${slug}/.gitkeep`, '');
writeFileSync(
  `${dir}/script.txt`,
  'Put the hook in this first sentence. Then write the rest of the voiceover here, about 150 to 170 words for a minute.\n',
);
writeFileSync(
  `${dir}/spec.ts`,
  `import type {VideoSpec} from '../../types';

/**
 * Scene layout for this video. See src/videos/phone-listening/spec.ts for a
 * full example. Scenes start on a \`cue\` (first words of a phrase in
 * script.txt) and run until the next scene.
 */
export const spec: VideoSpec = {
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
