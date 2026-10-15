import React from 'react';
import {useCurrentFrame} from 'remotion';
import {fonts} from '../fonts';
import type {Mood} from '../theme';
import {ease} from './card';
import {LEFT, overlayInk, paperHalo, RIGHT} from './sectionStyle';

export type AttributionProps = {
  /** Who + year, as in sources.md: "FTC staff report, 2017" (shown uppercase). One line, ≤ 36 characters, no URL. */
  text: string;
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
 * A quiet footnote under a claim (v0.8 § 6–7): left-aligned at x 120, its bottom edge at y 1024
 * when alone. Opacity only, 10 frames in (and out).
 */
export const Attribution: React.FC<AttributionProps & {mood?: Mood; delay?: number}> = ({
  text,
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
        top: 1024,
        transform: 'translateY(-100%)',
        opacity: o,
      }}
    >
      <div style={attributionStyle(mood)}>{text}</div>
    </div>
  );
};
