import type React from 'react';
import {Easing, interpolate} from 'remotion';
import {fonts} from '../fonts';
import {SAFE, theme} from '../theme';

/**
 * The exhibit-card look shared by every 2D overlay (style guide § 7): paper,
 * square corners, a thin border, a soft shadow. Never orange.
 */
export const cardStyle: React.CSSProperties = {
  background: theme.labelCard,
  border: `2px solid ${theme.labelBorder}`,
  borderRadius: 0,
  boxShadow: `0 1px 0 rgba(255, 255, 255, 0.7) inset, ${theme.cardShadow}`,
};

/** Small uppercase mono line: callout titles (600) and sub-lines (500). */
export const monoStyle = (size: number, weight: 500 | 600 = 500, color = theme.inkMuted): React.CSSProperties => ({
  fontFamily: fonts.mono,
  fontWeight: weight,
  fontSize: size,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color,
  whiteSpace: 'nowrap',
});

/** 0 → 1 between two frames, cubic in-out (the only easing in the museum). */
export const ease = (frame: number, from: number, to: number) =>
  interpolate(frame, [from, to], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

/** Rough rendered width of a mono line (JetBrains Mono advance ≈ 0.6 em plus letter-spacing). */
export const monoWidth = (text: string, size: number, spacing = 0.12) => text.length * size * (0.6 + spacing);

/** Shift a box [left, left + width] so it stays inside the safe area horizontally. */
export const clampToSafe = (left: number, width: number) => Math.max(SAFE.left, Math.min(left, SAFE.right - width));
