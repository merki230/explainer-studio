import React, {useMemo} from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {fonts} from '../fonts';
import type {Mood} from '../theme';
import type {Word} from '../types';
import {ease} from './card';
import {LEFT, overlayInk, RIGHT} from './sectionStyle';

type Page = {words: Word[]; start: number; end: number};

/** v0.8: ≤ 5 words a page (style guide § 6). */
const MAX_WORDS = 5;
const MAX_GAP = 0.3; // seconds of silence that forces a new page

export const buildPages = (words: Word[]): Page[] => {
  const groups: Word[][] = [];
  let cur: Word[] = [];
  words.forEach((w, i) => {
    const prev = words[i - 1];
    const breakHere =
      cur.length > 0 && (cur.length >= MAX_WORDS || w.start - prev.end > MAX_GAP || /[.!?,;:]$/.test(prev.text));
    if (breakHere) {
      groups.push(cur);
      cur = [];
    }
    cur.push(w);
  });
  if (cur.length) groups.push(cur);

  return groups.map((g, i) => ({
    words: g,
    start: g[0].start,
    end: i + 1 < groups.length ? groups[i + 1][0].start : g[g.length - 1].end + 0.6,
  }));
};

/** Bottom edge of the caption block (style guide § 6–7). */
const BOTTOM = 1188;
/** Frames each word takes to fade in as it is spoken. */
const WORD_IN = 4;

/**
 * Captions as a margin note (style guide v0.8 § 6): a square `capBg` block with a 12 px `ink` rule
 * on its left edge, Inter 700 50 px, left-aligned at x 120, bottom edge y 1188, ≤ 5 words a page.
 * Words appear one by one as they are spoken (4-frame fade); no highlight, never orange. The block
 * grows to the right with the words (a block sized for the whole page sat mostly empty behind the
 * first word). Colours follow the mood of the scene on screen.
 */
export const Captions: React.FC<{
  words: Word[];
  /** Mood per stretch of the video: `{from}` is the first frame where `mood` applies. Default Day. */
  moods?: {from: number; mood: Mood}[];
  /**
   * Frame ranges [from, to) when captions are off (a statement card is up). A page that starts
   * inside a range stays off; captions resume with the next page.
   */
  suppress?: [number, number][];
}> = ({words, moods = [], suppress = []}) => {
  const frame = useCurrentFrame();
  const {fps, height} = useVideoConfig();
  const pages = useMemo(() => buildPages(words), [words]);
  const t = frame / fps;
  const page = pages.find((p) => t >= p.start && t < p.end);
  if (!page) return null;
  // nothing until the first word has started to appear (no empty block)
  if (frame <= Math.round(page.words[0].start * fps)) return null;
  const inQuiet = (f: number) => suppress.some(([a, b]) => f >= a && f < b);
  if (inQuiet(frame) || inQuiet(Math.round(page.start * fps))) return null;

  const mood = [...moods].reverse().find((m) => frame >= m.from)?.mood ?? 'day';
  const {ink, capBg} = overlayInk(mood);
  const local = frame - Math.round(page.start * fps);
  // overdamped (no overshoot): the block settles 6 px into place
  const pop = spring({frame: local, fps, config: {damping: 26, mass: 0.6}});

  return (
    <div style={{position: 'absolute', left: LEFT, bottom: height - BOTTOM, maxWidth: RIGHT - LEFT}}>
      <div
        style={{
          display: 'inline-block',
          background: capBg,
          borderLeft: `12px solid ${ink}`,
          borderRadius: 0,
          padding: '13px 26px 15px 28px',
          fontFamily: fonts.sans,
          fontWeight: 700,
          fontSize: 50,
          lineHeight: 1.22,
          color: ink,
          textAlign: 'left',
          opacity: interpolate(pop, [0, 1], [0.6, 1]),
          transform: `translateY(${interpolate(pop, [0, 1], [6, 0])}px)`,
        }}
      >
        {page.words
          .filter((w) => Math.round(w.start * fps) <= frame)
          .map((w, i) => {
            const at = Math.round(w.start * fps);
            const o = ease(frame, at, at + WORD_IN);
            return (
              <React.Fragment key={i}>
                {i > 0 ? ' ' : ''}
                <span style={{opacity: o}}>{w.text}</span>
              </React.Fragment>
            );
          })}
      </div>
    </div>
  );
};
