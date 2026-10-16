import React, {useLayoutEffect, useState} from 'react';
import {continueRender, delayRender} from 'remotion';
import {fonts, fontsReady} from '../fonts';
import type {Mood} from '../theme';
import {LEFT, overlayInk, paperHalo} from './sectionStyle';

export type CoverTextProps = {
  /** The hook; `\n` forces the break, else the most even break into ≤ 2 lines. */
  text: string;
  /** Largest size in px (default 150). */
  size?: number;
  /** Top edge in px (default 288). */
  top?: number;
  /** Width the lines may fill from x 120 (default 768, to x 888). */
  width?: number;
  mood?: Mood;
};

const TRACK = -0.03; // em, the statement card's letter-spacing
const LINE = 0.95;

/** Width in px of `s` at 100 px (Archivo 800, statement tracking). */
const measure = (cx: CanvasRenderingContext2D, s: string) => {
  cx.font = `800 100px ${fonts.display}`;
  return cx.measureText(s).width + TRACK * 100 * s.length;
};

/** Lines and size: the forced or most even ≤ 2-line split, fitted to `width`. */
const fit = (text: string, max: number, width: number): {lines: string[]; size: number} => {
  const cx = document.createElement('canvas').getContext('2d')!;
  let lines: string[];
  if (text.includes('\n')) {
    lines = text.split('\n').slice(0, 2);
  } else {
    const words = text.split(/\s+/).filter(Boolean);
    lines = [words.join(' ')];
    let best = measure(cx, lines[0]);
    // one line only if it can stay at the full size; else the break with the narrowest widest line
    if ((best / 100) * max > width) {
      best = Infinity;
      for (let i = 1; i < words.length; i++) {
        const pair = [words.slice(0, i).join(' '), words.slice(i).join(' ')];
        const w = Math.max(...pair.map((l) => measure(cx, l)));
        if (w < best) {
          best = w;
          lines = pair;
        }
      }
    }
  }
  const widest = Math.max(...lines.map((l) => measure(cx, l)));
  return {lines, size: Math.floor(Math.min(max, (100 * width) / widest))};
};

/**
 * The cover's hook line: the statement card's look (style guide § 6: Archivo 800, 0.95 leading,
 * −0.03em, `ink` with the stacked `paper` halo, no box, left-aligned at x 120), set as large as the
 * width allows so it reads at thumbnail size. Static (covers are stills).
 */
export const CoverText: React.FC<CoverTextProps> = ({text, size = 150, top = 288, width = 768, mood = 'day'}) => {
  const [handle] = useState(() => delayRender('Fitting the cover text'));
  const [layout, setLayout] = useState<{lines: string[]; size: number} | null>(null);
  useLayoutEffect(() => {
    fontsReady().then(() => {
      setLayout(fit(text, size, width));
      continueRender(handle);
    });
  }, [text, size, width, handle]);
  if (!layout) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: LEFT,
        top,
        width,
        fontFamily: fonts.display,
        fontWeight: 800,
        fontSize: layout.size,
        lineHeight: LINE,
        letterSpacing: `${TRACK}em`,
        color: overlayInk(mood).ink,
        textShadow: paperHalo(mood, 32),
        textAlign: 'left',
        whiteSpace: 'nowrap',
      }}
    >
      {layout.lines.map((l, i) => (
        <div key={i}>{l}</div>
      ))}
    </div>
  );
};
