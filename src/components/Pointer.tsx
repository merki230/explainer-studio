import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {theme} from '../theme';
import {ease} from './card';

/** A target on screen, as fractions of the frame [x, y] (0.5, 0.5 = centre). */
export type PointTo = [number, number];

/**
 * Callout-style pointer from a card to the thing it is about: a hollow ring on the target
 * (scales in over frames 0–8) and a 2 px `inkMuted` leader drawn from the target toward the
 * card (frames 4–16). `from` is the card's centre in px and `box` its (approximate) size: the
 * leader stops 12 px inside the card's edge, so draw the card after this and its paper hides
 * the end of the line even if the size is a little off.
 */
export const Pointer: React.FC<{to: PointTo; from: [number, number]; box: [number, number]}> = ({to, from, box}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const ax = to[0] * width;
  const ay = to[1] * height;
  // Where the line from the target to the card's centre crosses the card's edge, 12 px inside.
  const [cx, cy] = from;
  const dx = ax - cx;
  const dy = ay - cy;
  const hw = Math.max(1, box[0] / 2 - 12);
  const hh = Math.max(1, box[1] / 2 - 12);
  const k = Math.min(1, hw / Math.max(1e-6, Math.abs(dx)), hh / Math.max(1e-6, Math.abs(dy)));
  const bx = cx + dx * k;
  const by = cy + dy * k;
  const ring = ease(frame, 0, 8);
  const line = ease(frame, 4, 16);
  const len = Math.hypot(bx - ax, by - ay);
  return (
    <svg width={width} height={height} style={{position: 'absolute', inset: 0}}>
      <line
        x1={ax}
        y1={ay}
        x2={bx}
        y2={by}
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
  );
};
