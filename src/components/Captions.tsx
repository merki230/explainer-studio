import React, {useMemo} from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {fonts} from '../fonts';
import type {Mood} from '../theme';
import type {Word} from '../types';
import {ease} from './card';
import {useLayout} from './layout';
import {overlayInk} from './sectionStyle';

/** A caption page; `lines` (horizontal paging only): the index of the first word of each line after the first. */
type Page = {words: Word[]; start: number; end: number; lines?: number[]};

/** v0.8: ≤ 5 words a page (style guide § 6). */
const MAX_WORDS = 5;
const MAX_GAP = 0.3; // seconds of silence that forces a new page

/** Rough advance of an Inter 700 string in em (for breaking caption lines before CSS would wrap them). */
export const interBoldEm = (s: string) =>
  [...s].reduce(
    (w, c) =>
      w +
      (c === ' '
        ? 0.26
        : /[il.,:;'!|]/.test(c)
          ? 0.3
          : /[fjrt()-]/.test(c)
            ? 0.4
            : /[mwMW]/.test(c)
              ? 0.88
              : /[A-Z]/.test(c)
                ? 0.7
                : /[0-9]/.test(c)
                  ? 0.62
                  : 0.6),
    0,
  );

/**
 * Caption pages. Vertical (default): ≤ 5 words a page (v0.8 § 6). With `chars` (the wide frame, § 11.4): words fill
 * lines of ≤ `chars` characters and ≤ `em` wide (so the block never wraps a line itself), ≤ `lines` lines a page; a new
 * page when the next word would need one more line.
 * Both: a new page after punctuation or a silence over 0.3 s.
 */
export const buildPages = (
  words: Word[],
  wide?: {chars: number; em: number; lines: number; narrow?: {chars: number; em: number; at: (t: number) => boolean}},
): Page[] => {
  const groups: {words: Word[]; lines: number[]}[] = [];
  let cur: Word[] = [];
  let breaks: number[] = [];
  let lineLen = 0;
  let lineText = '';
  words.forEach((w, i) => {
    const prev = words[i - 1];
    // a page that starts while a full-frame screen is up keeps its narrower lines (its block's right edge is pulled in)
    const pageStart = cur.length ? cur[0].start : w.start;
    const lim = wide?.narrow?.at(pageStart) ? wide.narrow : wide;
    const line = (text: string) => !lim || (text.length <= lim.chars && interBoldEm(text) <= lim.em);
    // wide: where this word goes (the current line, or a new one)
    const fits = lineLen === 0 || line(`${lineText} ${w.text}`);
    const full = wide ? !fits && breaks.length + 1 >= wide.lines : cur.length >= MAX_WORDS;
    const breakHere = cur.length > 0 && (full || w.start - prev.end > MAX_GAP || /[.!?,;:]$/.test(prev.text));
    if (breakHere) {
      groups.push({words: cur, lines: breaks});
      cur = [];
      breaks = [];
      lineLen = 0;
      lineText = '';
    }
    const limNow = wide?.narrow?.at(cur.length ? cur[0].start : w.start) ? wide.narrow : wide;
    const nextLine = `${lineText} ${w.text}`;
    if (limNow && lineLen > 0 && (nextLine.length > limNow.chars || interBoldEm(nextLine) > limNow.em)) {
      breaks.push(cur.length);
      lineLen = 0;
      lineText = '';
    }
    lineLen += (lineLen > 0 ? 1 : 0) + w.text.length;
    lineText = lineText ? `${lineText} ${w.text}` : w.text;
    cur.push(w);
  });
  if (cur.length) groups.push({words: cur, lines: breaks});

  return groups.map((g, i) => ({
    words: g.words,
    start: g.words[0].start,
    end: i + 1 < groups.length ? groups[i + 1].words[0].start : g.words[g.words.length - 1].end + 0.6,
    ...(wide ? {lines: g.lines} : {}),
  }));
};
/** Frames each word takes to fade in as it is spoken. */
const WORD_IN = 4;

/**
 * Captions as a margin note (style guide v0.8 § 6): a square `capBg` block with a 12 px `ink` rule
 * on its left edge, Inter 700 50 px, left-aligned at x 120, bottom edge y 1188, ≤ 5 words a page.
 * Wide frame (§ 11.4): Inter 700 52 px / 1.2, left x 144, bottom edge y 960, right edge ≤ x 1344 (x 1040 while a
 * full-frame screen is up, `narrow`), lines of ≤ 42 characters broken by the page builder, ≤ 2 lines a page.
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
  /** Frame ranges [from, to) when a full-frame screen is up: the block's right edge pulls in (horizontal only). */
  narrow?: [number, number][];
}> = ({words, moods = [], suppress = [], narrow = []}) => {
  const frame = useCurrentFrame();
  const {fps, height} = useVideoConfig();
  const L = useLayout();
  const C = L.captions;
  const {maxChars, maxLines} = C;
  // while a full-frame screen is up the block narrows, so its lines hold fewer characters (same px per character)
  const narrowChars = maxChars === null ? 0 : Math.floor((maxChars * (C.narrowRight - C.left)) / (C.maxRight - C.left));
  // the text's room in em: the block's width less its 12 px rule and side padding (≈ 58 px)
  const emFor = (right: number) => (right - C.left - 70) / C.fontSize;
  const wideEm = emFor(C.maxRight);
  const narrowEm = emFor(C.narrowRight);
  const pages = useMemo(
    () =>
      buildPages(
        words,
        maxChars === null
          ? undefined
          : {
              chars: maxChars,
              em: wideEm,
              lines: maxLines,
              narrow: narrow.length
                ? {
                    chars: narrowChars,
                    em: narrowEm,
                    at: (t: number) => narrow.some(([a, b]) => t * fps >= a && t * fps < b),
                  }
                : undefined,
            },
      ),
    [words, maxChars, maxLines, narrow, narrowChars, fps, wideEm, narrowEm],
  );
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

  const narrowed = narrow.some(([a, b]) => frame >= a && frame < b);
  const right = narrowed ? C.narrowRight : C.maxRight;
  return (
    <div style={{position: 'absolute', left: C.left, bottom: height - C.bottom, maxWidth: right - C.left}}>
      <div
        style={{
          display: 'inline-block',
          background: capBg,
          borderLeft: `12px solid ${ink}`,
          borderRadius: 0,
          padding: C.padding,
          fontFamily: fonts.sans,
          fontWeight: 700,
          fontSize: C.fontSize,
          lineHeight: C.lineHeight,
          color: ink,
          textAlign: 'left',
          // the wide frame breaks its own lines (page builder): never a third line from CSS wrapping
          ...(maxChars === null ? {} : {whiteSpace: 'nowrap' as const}),
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
                {page.lines?.includes(i) ? <br /> : i > 0 ? ' ' : ''}
                <span style={{opacity: o}}>{w.text}</span>
              </React.Fragment>
            );
          })}
      </div>
    </div>
  );
};
