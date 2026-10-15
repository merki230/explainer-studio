import {loadFont as loadInter} from '@remotion/google-fonts/Inter';
import {loadFont as loadMono} from '@remotion/google-fonts/JetBrainsMono';

const inter = loadInter('normal', {weights: ['400', '600', '800'], subsets: ['latin']});
const mono = loadMono('normal', {weights: ['400', '600'], subsets: ['latin']});

export const fonts = {
  sans: inter.fontFamily,
  mono: mono.fontFamily,
};

// One palette for every video keeps the channel recognisable.
export const theme = {
  bg: '#0b1026',
  bgDeep: '#070a1a',
  wall: '#1b2247',
  floor: '#141a36',
  couch: '#2a3566',
  wood: '#3a3550',
  red: '#c2462f',
  blue: '#2046c8',
  pants: '#1a1d2e',
  skin: '#e2bf9c',
  hair: '#2b1d14',
  glow: '#8fd0ff',
  warm: '#ffb070',
  moon: '#f4f1e6',
  text: '#f4f5fa',
  muted: '#8c93b8',
  accent: '#ff9f3a',
  danger: '#ff4d5e',
  panel: 'rgba(12, 16, 38, 0.78)',
  hairline: 'rgba(255, 255, 255, 0.16)',
  tiles: ['#e5484d', '#f2994a', '#f5c542', '#3fbf6e', '#2bb3c0', '#3d7cf2', '#8a5cf6', '#d055b5'],
};

// Frame is 1080x1920 (9:16). Overlay positions are fractions of it.
export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
// Frames of crossfade between scenes.
export const FADE = 8;
