import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {theme} from '../theme';
import {cardStyle, clampToSafe, ease, monoStyle, monoWidth} from './card';

export type CalloutProps = {
  /** Anchor point (the thing being labelled), as fractions of the frame. */
  x: number;
  y: number;
  /**
   * Where the label card sits, in px relative to the anchor. With `place: 'side'`
   * (default) this is the middle of its near edge (left edge if dx ≥ 0, else right);
   * with `place: 'above'` it is the middle of its bottom edge.
   */
  dx?: number;
  dy?: number;
  place?: 'side' | 'above';
  /** ≤ 3 words, shown uppercase in mono. */
  title: string;
  sub?: string;
};

const TITLE = 26;
const SUB = 20;
const PAD_X = 20;

/**
 * Exhibit callout: a hollow ring on the thing, a thin leader, and a paper card
 * with a mono title. The card is kept inside the safe area (x 120–888); the
 * leader follows it.
 */
export const Callout: React.FC<CalloutProps> = ({x, y, dx = 80, dy = -120, place = 'side', title, sub}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();

  const ax = x * width;
  const ay = y * height;
  const above = place === 'above';
  const labelLeft = dx >= 0;
  // JetBrains Mono is monospaced, so the card's width is known up front.
  const cardW = Math.ceil(Math.max(monoWidth(title, TITLE), sub ? monoWidth(sub, SUB) : 0)) + 2 * PAD_X + 6;
  const wantLeft = above ? ax + dx - cardW / 2 : labelLeft ? ax + dx : ax + dx - cardW;
  const left = clampToSafe(wantLeft, cardW);
  // Leader ends at the card edge nearest the anchor.
  const lx = above ? left + cardW / 2 : labelLeft ? left : left + cardW;
  const ly = ay + dy;

  const ring = ease(frame, 0, 8);
  const line = ease(frame, 4, 16);
  const label = ease(frame, 12, 24);
  const len = Math.hypot(lx - ax, ly - ay);

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <svg width={width} height={height} style={{position: 'absolute', inset: 0}}>
        <line
          x1={ax}
          y1={ay}
          x2={lx}
          y2={ly}
          stroke={theme.inkMuted}
          strokeWidth={2}
          strokeDasharray={len}
          strokeDashoffset={len * (1 - line)}
        />
        <circle
          cx={ax}
          cy={ay}
          r={6}
          fill={theme.labelCard}
          stroke={theme.inkMuted}
          strokeWidth={2}
          opacity={ring}
          transform={`translate(${ax} ${ay}) scale(${0.4 + 0.6 * ring}) translate(${-ax} ${-ay})`}
        />
      </svg>
      <div
        style={{
          ...cardStyle,
          position: 'absolute',
          left,
          top: ly,
          width: cardW,
          boxSizing: 'border-box',
          transform: `translateY(${above ? '-100%' : '-50%'}) translateY(${interpolate(label, [0, 1], [8, 0])}px)`,
          opacity: label,
          padding: `12px ${PAD_X}px 13px`,
        }}
      >
        <div style={monoStyle(TITLE, 600, theme.inkLabel)}>{title}</div>
        {sub ? <div style={{...monoStyle(SUB, 500), marginTop: 4}}>{sub}</div> : null}
      </div>
    </div>
  );
};
