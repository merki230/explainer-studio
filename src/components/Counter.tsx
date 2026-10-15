import React from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {fonts} from '../fonts';
import {theme} from '../theme';
import {cardStyle, ease, monoStyle} from './card';

export type CounterProps = {
  from?: number;
  to: number;
  label: string;
  sub?: string;
  /** Top-left corner, as fractions of the frame (0.111 = the safe area's left edge, 120 px). */
  x?: number;
  y?: number;
  /** Seconds to count. */
  duration?: number;
};

/** A number counting up on a paper card: serif digits and label, mono sub-line. */
export const Counter: React.FC<CounterProps> = ({from = 0, to, label, sub, x = 0.111, y = 0.55, duration = 1.6}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const enter = ease(frame, 0, 10);
  const value = interpolate(frame, [0, duration * fps], [from, to], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

  return (
    <div
      style={{
        ...cardStyle,
        position: 'absolute',
        left: x * width,
        top: y * height,
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [8, 0])}px)`,
        padding: '14px 26px 18px',
      }}
    >
      <div style={{display: 'flex', alignItems: 'baseline', gap: 14}}>
        <span
          style={{
            fontFamily: fonts.serif,
            fontWeight: 600,
            fontSize: 80,
            lineHeight: 1.1,
            color: theme.inkLabel,
            fontVariantNumeric: 'tabular-nums lining-nums',
          }}
        >
          {Math.round(value).toLocaleString('en-US')}
        </span>
        <span style={{fontFamily: fonts.serif, fontWeight: 600, fontSize: 34, color: theme.inkLabel}}>{label}</span>
      </div>
      {sub ? <div style={monoStyle(20, 500)}>{sub}</div> : null}
    </div>
  );
};
