import React from 'react';
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {fonts} from '../fonts';
import {theme} from '../theme';

export type CounterProps = {
  from?: number;
  to: number;
  label: string;
  sub?: string;
  /** Top-left corner, as fractions of the frame. */
  x?: number;
  y?: number;
  /** Seconds to count. */
  duration?: number;
};

export const Counter: React.FC<CounterProps> = ({from = 0, to, label, sub, x = 0.07, y = 0.55, duration = 1.6}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 20}});
  const value = interpolate(frame, [0, duration * fps], [from, to], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: x * width,
        top: y * height,
        opacity: enter,
        padding: '18px 26px',
        background: theme.panel,
        border: `1px solid ${theme.hairline}`,
        borderRadius: 12,
      }}
    >
      <div style={{display: 'flex', alignItems: 'baseline', gap: 14}}>
        <span
          style={{
            fontFamily: fonts.sans,
            fontWeight: 800,
            fontSize: 84,
            color: theme.text,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {Math.round(value).toLocaleString('en-US')}
        </span>
        <span style={{fontFamily: fonts.sans, fontWeight: 600, fontSize: 34, color: theme.text}}>{label}</span>
      </div>
      {sub ? (
        <div
          style={{
            fontFamily: fonts.mono,
            fontSize: 18,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: theme.muted,
          }}
        >
          {sub}
        </div>
      ) : null}
    </div>
  );
};
