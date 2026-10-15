import {loadFont as loadInter} from '@remotion/google-fonts/Inter';
import {loadFont as loadMono} from '@remotion/google-fonts/JetBrainsMono';

// Kept apart from theme.ts: loading fonts needs a browser, and theme.ts is also
// imported from Node (yarn check / yarn stills).
const inter = loadInter('normal', {weights: ['400', '600', '800'], subsets: ['latin']});
const mono = loadMono('normal', {weights: ['400', '600'], subsets: ['latin']});

export const fonts = {
  sans: inter.fontFamily,
  mono: mono.fontFamily,
};
