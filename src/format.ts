import {useVideoConfig} from 'remotion';
import {FRAMES, formatOfSize, type Format} from './theme';

/**
 * The frame a scene or overlay is rendering in: 'vertical' (1080 × 1920, every Short and every video up to No. 012)
 * or 'horizontal' (1920 × 1080, long-form, style guide § 11), with its `width`, `height` and `safe` rectangle. It reads
 * the composition's size, so a Short cut from a horizontal video is 'vertical' (its own composition), no prop needed.
 * Wide-frame constants (captions, safe zones, fov, ...) are in theme.ts (`*_H`).
 */
export const useFormat = (): {format: Format; width: number; height: number; safe: (typeof FRAMES)[Format]['safe']} => {
  const {width, height} = useVideoConfig();
  const format = formatOfSize(width, height);
  return {format, width, height, safe: FRAMES[format].safe};
};
