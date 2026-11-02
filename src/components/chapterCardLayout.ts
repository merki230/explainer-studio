// Pure layout of the chapter card's text (style guide § 11.5.1), shared by the card and `yarn check`.
// No fonts, no React: safe to import from Node.

/** Archivo 800 80 px: ≈ 30 characters fit the 1,392 px measure; 72 px: ≈ 33. */
export const CARD_SIZES = [
  {size: 80, chars: 30},
  {size: 72, chars: 33},
] as const;

export type CardText = {lines: string[]; size: number} | null;

/**
 * The question's lines and type size: its manual `\n` breaks if it has any, else a balanced split at a word boundary
 * (no orphan word on line 2). At most 2 lines of ≈ 30 characters at 80 px; if it needs more, 72 px (≈ 33 a line);
 * `null` when it fits neither (it goes back to the scriptwriter).
 */
export const cardText = (question: string): CardText => {
  const manual = question
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
  for (const {size, chars} of CARD_SIZES) {
    let lines = manual;
    if (manual.length === 1 && manual[0].length > chars) {
      const words = manual[0].split(/\s+/);
      let best: string[] | null = null;
      for (let k = 1; k < words.length; k++) {
        const a = words.slice(0, k).join(' ');
        const b = words.slice(k).join(' ');
        if (!best || Math.max(a.length, b.length) < Math.max(best[0].length, best[1].length)) best = [a, b];
      }
      if (best) lines = best;
    }
    if (lines.length <= 2 && lines.every((l) => l.length <= chars)) return {lines, size};
  }
  return null;
};
