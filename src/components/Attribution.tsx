import React from 'react';
import {useCurrentFrame} from 'remotion';
import {fonts} from '../fonts';
import type {Mood} from '../theme';
import {ease} from './card';
import {LEFT, overlayInk, paperHalo, RIGHT} from './sectionStyle';

export type AttributionProps = {
  /** Who + year, as in sources.md: "FTC staff report, 2017" (shown uppercase). One line, ≤ 36 characters, no URL. */
  text: string;
  /**
   * Where a standalone line sits: 'sky' (default: in the sky band, top edge y 300, clear of the
   * figures), 'low' (bottom edge y 1024, just above the captions: for frames without sky), or
   * 'high' (top edge y 500).
   */
  place?: 'sky' | 'low' | 'high';
};

/** Frames the attribution line fades in (and out, see Explainer). Style guide § 6. */
export const ATTRIBUTION_FADE = 10;

/** The line's look (v0.8 § 6): JetBrains Mono 600, 24 px, 0.18em, uppercase, `inkSub`. */
export const attributionStyle = (mood: Mood): React.CSSProperties => ({
  fontFamily: fonts.mono,
  fontWeight: 600,
  fontSize: 24,
  lineHeight: 1.2,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: overlayInk(mood).inkSub,
  textShadow: paperHalo(mood, 14),
  whiteSpace: 'nowrap',
  textAlign: 'left',
});

/**
 * A quiet footnote under a claim (v0.8 § 6–7): left-aligned at x 120; alone, in the sky band by
 * default (`place`). Opacity only, 10 frames in (and out).
 */
export const Attribution: React.FC<AttributionProps & {mood?: Mood; delay?: number}> = ({
  text,
  place = 'sky',
  mood = 'day',
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const o = ease(frame, delay, delay + ATTRIBUTION_FADE);
  return (
    <div
      style={{
        position: 'absolute',
        left: LEFT,
        maxWidth: RIGHT - LEFT,
        top: place === 'low' ? 1024 : place === 'high' ? 500 : 300,
        transform: place === 'low' ? 'translateY(-100%)' : undefined,
        opacity: o,
      }}
    >
      <div style={attributionStyle(mood)}>{text}</div>
    </div>
  );
};
