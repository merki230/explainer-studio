// Writes the brand masters and PNGs (brand/channel-kit.md § 4).
//
// usage: yarn tsx src/brand/export.ts [--only=profile-800,banner-2560x1440] [--out=brand/assets]
// SVG masters (symbol.svg, lockup.svg) and every PNG go to --out; `review-*` stills go to out/brand/.
import {mkdirSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {bundle} from '@remotion/bundler';
import {getCompositions, renderStill} from '@remotion/renderer';
import {lockupSvg, symbolSvg} from './mark';

const args = process.argv.slice(2);
const flag = (name: string) => args.find((a) => a.startsWith(`--${name}=`))?.split('=')[1];
const outDir = flag('out') ?? 'brand/assets';
const reviewDir = 'out/brand';
const only = flag('only')?.split(',');
mkdirSync(outDir, {recursive: true});
mkdirSync(reviewDir, {recursive: true});

if (!only) {
  writeFileSync(`${outDir}/symbol.svg`, symbolSvg({size: 1024}) + '\n');
  writeFileSync(`${outDir}/lockup.svg`, lockupSvg() + '\n');
  console.log(`${outDir}/symbol.svg\n${outDir}/lockup.svg`);
}

const serveUrl = await bundle({entryPoint: path.resolve('src/brand/index.ts')});
for (const composition of await getCompositions(serveUrl)) {
  const {id} = composition;
  if (only && !only.includes(id)) continue;
  const output = `${id.startsWith('review-') ? reviewDir : outDir}/${id}.png`;
  await renderStill({composition, serveUrl, frame: 0, output, imageFormat: 'png', scale: 1});
  console.log(output);
}
