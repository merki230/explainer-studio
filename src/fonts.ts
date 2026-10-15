import {loadFont as loadArchivo} from '@remotion/google-fonts/Archivo';
import {loadFont as loadFraunces} from '@remotion/google-fonts/Fraunces';
import {loadFont as loadInter} from '@remotion/google-fonts/Inter';
import {loadFont as loadMono} from '@remotion/google-fonts/JetBrainsMono';

// Kept apart from theme.ts: loading fonts needs a browser, and theme.ts is also
// imported from Node (yarn check / yarn stills).
// v0.8 (style guide § 6): Inter (captions, tags, callouts, phone UI), Archivo 800 (statements,
// the title), JetBrains Mono (title sub-line, attribution, the DETAIL tab). Fraunces is retired
// and stays loaded only until stage 3 moves the old overlays over.
const mono = loadMono('normal', {weights: ['500', '600', '700'], subsets: ['latin']});
const inter = loadInter('normal', {weights: ['500', '600', '700', '800'], subsets: ['latin']});
const archivo = loadArchivo('normal', {weights: ['800'], subsets: ['latin']});
const serif = loadFraunces('normal', {weights: ['500', '600'], subsets: ['latin']});
const serifItalic = loadFraunces('italic', {weights: ['500', '600'], subsets: ['latin']});

/**
 * Resolves once every face is loaded and registered. CSS text waits on its own;
 * canvas drawing (e.g. the wall plate texture) must await this first.
 */
export const fontsReady = (): Promise<void> =>
  Promise.all([
    mono.waitUntilDone(),
    serif.waitUntilDone(),
    serifItalic.waitUntilDone(),
    inter.waitUntilDone(),
    archivo.waitUntilDone(),
  ]).then(() => undefined);

export const fonts = {
  /** Labels, sub-lines, callouts, the watermark. */
  mono: mono.fontFamily,
  /** Captions, exhibit titles, card titles, numbers, the plate number. */
  serif: serif.fontFamily,
  /** v0.8: captions, tags, callouts, counters' units, every phone UI. */
  sans: inter.fontFamily,
  /** v0.8: statement cards, the title block, counter digits. */
  display: archivo.fontFamily,
};
