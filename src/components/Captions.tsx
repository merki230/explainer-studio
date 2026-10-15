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

/** Lower-third captions, a few words at a time, current word underlined. */
export const Captions: React.FC<{words: Word[]; y?: number}> = ({words, y = 0.74}) => {
  const frame = useCurrentFrame();
  const {fps, height} = useVideoConfig();
  const pages = useMemo(() => buildPages(words), [words]);
  const t = frame / fps;
  const page = pages.find((p) => t >= p.start && t < p.end);
  if (!page) return null;

  const local = frame - Math.round(page.start * fps);
  const pop = spring({frame: local, fps, config: {damping: 14, mass: 0.5}});

  return (
    <div
      style={{
        position: 'absolute',
        top: y * height,
        left: 60,
        right: 60,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          padding: '10px 26px 16px',
          borderRadius: 14,
          background: 'rgba(10, 14, 35, 0.72)',
          transform: `translateY(-50%) scale(${interpolate(pop, [0, 1], [0.9, 1])})`,
          fontFamily: fonts.sans,
          fontWeight: 800,
          fontSize: 62,
          lineHeight: 1.2,
          color: theme.text,
          textAlign: 'center',
        }}
      >
        {page.words.map((w, i) => {
          const spoken = t >= w.start;
          const active = spoken && (t < w.end || i === page.words.length - 1 || t < page.words[i + 1].start);
          return (
            <React.Fragment key={i}>
              <span
                style={{
                  opacity: spoken ? 1 : 0.45,
                  textDecorationLine: active ? 'underline' : 'none',
                  textDecorationThickness: 5,
                  textUnderlineOffset: 10,
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
