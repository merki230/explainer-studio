import React, {useMemo} from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {fonts} from '../fonts';
import {theme} from '../theme';
import type {Word} from '../types';

type Page = {words: Word[]; start: number; end: number};

const MAX_WORDS = 3;
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

const FONT_SIZE = 64;
const LINE_HEIGHT = 1.12;

/**
 * Serif captions a few words at a time, current word in orange italic.
 * Centred on `y` (fraction of the frame) with `margin` px each side, anchored by
 * the bottom edge so a two-line page grows upward, never into the platform UI.
 */
export const Captions: React.FC<{words: Word[]; y?: number; margin?: number}> = ({words, y = 0.6, margin = 192}) => {
  const frame = useCurrentFrame();
  const {fps, height} = useVideoConfig();
  const pages = useMemo(() => buildPages(words), [words]);
  const t = frame / fps;
  const page = pages.find((p) => t >= p.start && t < p.end);
  if (!page) return null;

  const local = frame - Math.round(page.start * fps);
  const pop = spring({frame: local, fps, config: {damping: 16, mass: 0.5}});
  // Bottom of a single line centred on y.
  const bottom = height - (y * height + (FONT_SIZE * LINE_HEIGHT) / 2);

  return (
    <div
      style={{
        position: 'absolute',
        bottom,
        left: margin,
        right: margin,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          transform: `translateY(${interpolate(pop, [0, 1], [8, 0])}px)`,
          opacity: interpolate(pop, [0, 1], [0.4, 1]),
          fontFamily: fonts.serif,
          fontWeight: 600,
          fontSize: FONT_SIZE,
          lineHeight: LINE_HEIGHT,
          color: theme.ink,
          textAlign: 'center',
          textWrap: 'balance',
          // A thin highlight, plus a plaster halo so the line stays legible over the scene.
          textShadow: `0 1px 0 rgba(255,255,255,0.55), ${theme.textHalo}`,
        }}
      >
        {page.words.map((w, i) => {
          const spoken = t >= w.start;
          const active = spoken && (t < w.end || i === page.words.length - 1 || t < page.words[i + 1].start);
          return (
            <React.Fragment key={i}>
              <span
                style={{
                  color: active ? theme.orange : theme.ink,
                  fontStyle: active ? 'italic' : 'normal',
                  // Orange on an orange-lit wall needs an edge: a 1 px ink outline outside the glyph.
                  WebkitTextStroke: active ? '2px rgba(31, 28, 24, 0.35)' : undefined,
                  paintOrder: 'stroke fill',
                }}
              >
                {w.text}
              </span>
              {i < page.words.length - 1 ? ' ' : ''}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
