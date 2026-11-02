import React, {useLayoutEffect, useState} from 'react';
import {continueRender, delayRender, useVideoConfig} from 'remotion';
import {fonts, fontsReady} from '../fonts';
import type {Mood} from '../theme';
import {useLayout} from './layout';
import {overlayInk, paperHalo} from './sectionStyle';

export type CoverTextProps = {
  /** The hook; `\n` forces the break, else the most even break into ≤ 2 lines. */
  text: string;
  /** Largest size in px (default 150). */
  size?: number;
  /** Top edge in px (default 288; wide frame 120). */
  top?: number;
  /** Width the lines may fill from x 120 (default 768, to x 888; wide frame: from x 144, default 960, the left half). */
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
export const CoverText: React.FC<CoverTextProps> = ({text, size = 150, top: topIn, width: widthIn, mood = 'day'}) => {
  const L = useLayout();
  const top = topIn ?? L.cover.top;
  const width = widthIn ?? L.cover.width;
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
        left: L.left,
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

/** The long-form thumbnail's text block, in the 1280 × 720 design grid (style guide § 11.9.1). */
export const THUMB_TEXT = {left: 64, right: 470, centreY: 330, size: 108, halo: 40, maxLines: 3};

export type ThumbTextProps = {
  /** The lines as the owner picked them (`\n` between lines, ≤ 3). */
  text: string;
  mood?: Mood;
};

/**
 * The horizontal (YouTube thumbnail) variant of the cover text (§ 11.9.1): Archivo 800 at 108 units, 0.95 leading,
 * −0.03em, `ink` with the stacked `paper` halo (40 + 20 units), left-aligned at x 64, the block centred on y 330, the
 * lines exactly as given (≤ 3). The design grid is 1280 × 720 units, scaled to the composition's width, so the same
 * layout renders at 1280, 1920 or 3840. If the widest line would pass x 470, the size comes down until it fits.
 */
export const ThumbText: React.FC<ThumbTextProps> = ({text, mood = 'day'}) => {
  const {width} = useVideoConfig();
  const u = width / 1280;
  const T = THUMB_TEXT;
  const lines = text.split('\n').slice(0, T.maxLines);
  const [handle] = useState(() => delayRender('Fitting the thumbnail text'));
  const [size, setSize] = useState<number | null>(null);
  useLayoutEffect(() => {
    fontsReady().then(() => {
      const cx = document.createElement('canvas').getContext('2d')!;
      const widest = Math.max(...lines.map((l) => measure(cx, l)));
      setSize(Math.min(T.size, (100 * (T.right - T.left)) / widest));
      continueRender(handle);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, handle]);
  if (size === null) return null;
  const blockH = lines.length * size * LINE;
  return (
    <div
      style={{
        position: 'absolute',
        left: T.left * u,
        top: (T.centreY - blockH / 2) * u,
        fontFamily: fonts.display,
        fontWeight: 800,
        fontSize: size * u,
        lineHeight: LINE,
        letterSpacing: `${TRACK}em`,
        color: overlayInk(mood).ink,
        textShadow: paperHalo(mood, T.halo * u),
        textAlign: 'left',
        whiteSpace: 'nowrap',
      }}
    >
      {lines.map((l, i) => (
        <div key={i}>{l}</div>
      ))}
    </div>
  );
};
