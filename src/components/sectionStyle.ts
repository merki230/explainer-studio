import {MOODS, type Mood} from '../theme';

/**
 * v0.8 overlay colours for a mood (style guide § 1, § 6): `ink` (text, rules, leaders), `paper`
 * (fills, halos), `inkSub` (sub-lines, attribution), `capBg` (the caption block). Never orange.
 */
export const overlayInk = (mood: Mood = 'day') => {
  const m = MOODS[mood];
  return {ink: m.ink, paper: m.paper, inkSub: m.inkSub, capBg: m.capBg};
};

/** A soft `paper` halo behind text that sits over the scene (stacked so it holds on busy parts). */
export const paperHalo = (mood: Mood, px: number) => {
  const {paper} = overlayInk(mood);
  return `0 0 ${px}px ${paper}, 0 0 ${Math.round(px / 2)}px ${paper}`;
};

/** Left edge of every left-aligned overlay, and the right limit (theme.SAFE). */
export const LEFT = 120;
export const RIGHT = 888;
