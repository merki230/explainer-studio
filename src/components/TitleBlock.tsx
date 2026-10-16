import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {fonts} from '../fonts';
import type {Mood} from '../theme';
import {ease} from './card';
import {LEFT, overlayInk} from './sectionStyle';

export type TitleBlockProps = {
  /** "No. 001". */
  number: string;
  /** "The Living Room". */
  title: string;
  /** The story's time on the sub-line, matching the mood ("9:47 PM"; never "9:41"). */
  time: string;
  /** Section mark on the sub-line (default "A–A"). */
  section?: string;
  /** Seconds it holds after entering (default 2.5); it then fades over 10 frames (Explainer). */
  hold?: number;
  /** Top edge in px: default 300, in the sky band above the cut wall tops (the guide's 340 sat on them). */
  top?: number;
};

/** Frames the title block takes to fade in and out. */
export const TITLE_FADE = 10;
export const TITLE_HOLD = 2.5;

/**
 * Title block (v0.8 § 6), first scene only: a `paper` box with a 3 px `ink` border, square corners,
 * top edge y 300 (the sky band), left edge x 120. Line 1 "No. 001 · The Living Room" in Archivo 800 37 px; line 2
 * "SECTION A–A · 9:47 PM" in Mono 600 19 px, 0.18em, `inkSub`. Start it at ≈ 1.0 s (`at: 1`).
 */
export const TitleBlock: React.FC<TitleBlockProps & {mood?: Mood}> = ({
  number,
  title,
  time,
  section = 'A–A',
  top = 300,
  mood = 'day',
}) => {
  const frame = useCurrentFrame();
  const {ink, paper, inkSub} = overlayInk(mood);
  const o = ease(frame, 0, TITLE_FADE);
  return (
    <div
      style={{
        position: 'absolute',
        left: LEFT,
        top,
        background: paper,
        border: `3px solid ${ink}`,
        borderRadius: 0,
        padding: '13px 24px 15px',
        opacity: o,
        transform: `translateY(${interpolate(o, [0, 1], [6, 0])}px)`,
      }}
    >
      <div
        style={{
          fontFamily: fonts.display,
          fontWeight: 800,
          fontSize: 37,
          lineHeight: 1.15,
          color: ink,
          whiteSpace: 'nowrap',
        }}
      >
        {number} · {title}
      </div>
      <div
        style={{
          fontFamily: fonts.mono,
          fontWeight: 600,
          fontSize: 19,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: inkSub,
          marginTop: 6,
          whiteSpace: 'nowrap',
        }}
      >
        Section {section} · {time}
      </div>
    </div>
  );
};
