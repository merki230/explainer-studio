import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {fonts, theme} from '../theme';

export type SearchBarProps = {
  text: string;
  /** Red tag on the right, e.g. "NEVER SEARCHED". Empty string hides it. */
  tag?: string;
  /** Vertical position as a fraction of the frame. */
  y?: number;
  /** Strike the query through after this many frames (-1 = never). */
  strikeAt?: number;
};

export const SearchBar: React.FC<SearchBarProps> = ({text, tag = 'NEVER SEARCHED', y = 0.62, strikeAt = 18}) => {
  const frame = useCurrentFrame();
  const {fps, height} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 14}});
  const typed = Math.round(interpolate(frame, [4, 4 + text.length * 1.5], [0, text.length], {extrapolateRight: 'clamp'}));
  const strike = strikeAt < 0 ? 0 : interpolate(frame, [strikeAt + 6, strikeAt + 14], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const tagIn = spring({frame: frame - strikeAt - 12, fps, config: {damping: 20}});

  return (
    <div
      style={{
        position: 'absolute',
        top: y * height,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        transform: `translateY(-50%) scale(${interpolate(enter, [0, 1], [0.85, 1])})`,
        opacity: enter,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          padding: '20px 30px',
          minWidth: 600,
          background: '#ffffff',
          borderRadius: 999,
          boxShadow: '0 20px 60px rgba(0,0,0,0.45)',
        }}
      >
        <svg width={34} height={34} viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth={2.4}>
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
        </svg>
        <span style={{position: 'relative', fontFamily: fonts.sans, fontWeight: 600, fontSize: 36, color: '#111827'}}>
          {text.slice(0, typed)}
          <span
            style={{
              position: 'absolute',
              left: 0,
              top: '54%',
              height: 4,
              width: `${strike * 100}%`,
              background: theme.danger,
            }}
          />
        </span>
        {tag ? (
          <span
            style={{
              marginLeft: 'auto',
              opacity: tagIn,
              fontFamily: fonts.mono,
              fontWeight: 600,
              fontSize: 20,
              letterSpacing: '0.14em',
              color: theme.danger,
            }}
          >
            {tag} ✕
          </span>
        ) : null}
      </div>
    </div>
  );
};
