import {loadFont as loadFraunces} from '@remotion/google-fonts/Fraunces';
import {loadFont as loadMono} from '@remotion/google-fonts/JetBrainsMono';

// Kept apart from theme.ts: loading fonts needs a browser, and theme.ts is also
// imported from Node (yarn check / yarn stills).
// Two faces only (style guide § 5): Fraunces and JetBrains Mono.
const mono = loadMono('normal', {weights: ['500', '600'], subsets: ['latin']});
const serif = loadFraunces('normal', {weights: ['500', '600'], subsets: ['latin']});
const serifItalic = loadFraunces('italic', {weights: ['500', '600'], subsets: ['latin']});

/**
 * Resolves once every face is loaded and registered. CSS text waits on its own;
 * canvas drawing (e.g. the wall plate texture) must await this first.
 */
export const fontsReady = (): Promise<void> =>
  Promise.all([mono.waitUntilDone(), serif.waitUntilDone(), serifItalic.waitUntilDone()]).then(() => undefined);

export const fonts = {
  /** Labels, sub-lines, callouts, the watermark. */
  mono: mono.fontFamily,
  /** Captions, exhibit titles, card titles, numbers, the plate number. */
  serif: serif.fontFamily,
};
