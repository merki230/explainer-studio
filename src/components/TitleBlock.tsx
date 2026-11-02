import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {fonts} from '../fonts';
import type {Mood} from '../theme';
import {ease} from './card';
import {useLayout} from './layout';
import {overlayInk} from './sectionStyle';

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
  /** Top edge in px: default 300, in the sky band above the cut wall tops (the guide's 340 sat on them); wide frame: 120. */
  top?: number;
  /**
   * No. 002 mode (v0.11 § 6): line 1 is the video's question (≤ 2 lines; `\n` forces the break, else it
   * wraps at ≈ 32 characters), line 2 `NO. 002 · THE TIRE · 7:58 AM`. It is already up at frame 0 (no
   * entry move) unless `enter` is set. Without `question`, No. 001's block, unchanged.
   */
  question?: string;
  /** Fade and rise in over 10 frames (default: true for No. 001's block, false with `question`). */
  enter?: boolean;
  /**
   * Chapter card (style guide § 11.5, long-form): the same block reused for a chapter's question. Line 1 the
   * `question`, line 2 `CHAPTER 2 · THE ROOF · 3:12 PM` (`title` = the chapter's place, `time` its story time; either
   * may be empty). It enters (opacity and a 6 px rise over 10 frames). The Explainer draws one per chapter from the
   * transcript's `chapters` (see `VideoSpec.chapters`); `number` is ignored.
   */
  chapter?: number;
};

/** Frames the title block takes to fade in and out. */
export const TITLE_FADE = 10;
export const TITLE_HOLD = 2.5;

/**
 * Title block (v0.8 § 6), first scene only: a `paper` box with a 3 px `ink` border, square corners,
 * top edge y 300 (the sky band), left edge x 120. Line 1 "No. 001 · The Living Room" in Archivo 800 37 px; line 2
 * "SECTION A–A · 9:47 PM" in Mono 600 19 px, 0.18em, `inkSub`. Start it at ≈ 1.0 s (`at: 1`).
 * Wide frame (§ 11.5): x 144, top y 120, line 1 40 px (≤ 40 characters a line), line 2 26 px at 0.12em (≤ 46 characters, v0.16.1), padding 14 / 26 / 16.
 */
export const TitleBlock: React.FC<TitleBlockProps & {mood?: Mood}> = ({
  number,
  title,
  time,
  section = 'A–A',
  top,
  mood = 'day',
  question,
  enter,
  chapter,
}) => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const T = L.title;
  const {ink, paper, inkSub} = overlayInk(mood);
  const o = (enter ?? (!question || chapter !== undefined)) ? ease(frame, 0, TITLE_FADE) : 1;
  const lines = question ? wrapQuestion(question, T.wrap) : null;
  const sub =
    chapter !== undefined
      ? [`Chapter ${chapter}`, title, time].filter(Boolean).join(' · ')
      : question
        ? `${number} · ${title} · ${time}`
        : `Section ${section} · ${time}`;
  return (
    <div
      style={{
        position: 'absolute',
        left: T.left,
        top: top ?? T.top,
        background: paper,
        border: `3px solid ${ink}`,
        borderRadius: 0,
        padding: T.padding,
        opacity: o,
        transform: `translateY(${interpolate(o, [0, 1], [6, 0])}px)`,
      }}
    >
      <div
        style={{
          fontFamily: fonts.display,
          fontWeight: 800,
          fontSize: T.line1,
          lineHeight: 1.15,
          color: ink,
          whiteSpace: 'nowrap',
        }}
      >
        {lines ? lines.map((l, i) => <div key={i}>{l}</div>) : `${number} · ${title}`}
      </div>
      <div
        style={{
          fontFamily: fonts.mono,
          fontWeight: 600,
          fontSize: T.line2,
          letterSpacing: `${T.line2Tracking}em`,
          textTransform: 'uppercase',
          color: inkSub,
          marginTop: 6,
          whiteSpace: 'nowrap',
        }}
      >
        {sub}
      </div>
    </div>
  );
};

/** Two even lines of ≤ `wrap` characters (32 vertical, 40 wide; a `\n` in the text wins). */
const wrapQuestion = (q: string, wrap: number): string[] => {
  if (q.includes('\n')) return q.split('\n');
  if (q.length <= wrap) return [q];
  const words = q.split(' ');
  let best: string[] = [q];
  let score = Infinity;
  for (let i = 1; i < words.length; i++) {
    const a = words.slice(0, i).join(' ');
    const b = words.slice(i).join(' ');
    const s = Math.max(a.length, b.length);
    if (s < score) {
      score = s;
      best = [a, b];
    }
  }
  return best;
};
