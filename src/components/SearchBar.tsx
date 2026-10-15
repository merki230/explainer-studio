import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {fonts} from '../fonts';
import {SAFE, theme} from '../theme';
import {cardStyle, ease, monoStyle} from './card';

export type SearchBarProps = {
  text: string;
  /** Mono tag on the right, e.g. "NEVER SEARCHED". Empty string hides it. */
  tag?: string;
  /** Vertical centre as a fraction of the frame. */
  y?: number;
  /** Strike the query through (in orange) after this many frames (-1 = never). */
  strikeAt?: number;
};

/** A search query typed on a paper card, then struck through: "you never searched this". */
export const SearchBar: React.FC<SearchBarProps> = ({text, tag = 'NEVER SEARCHED', y = 0.34, strikeAt = 18}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const enter = ease(frame, 0, 10);
  const typed = Math.round(
    interpolate(frame, [4, 4 + text.length * 1.5], [0, text.length], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
  );
  const strike = strikeAt < 0 ? 0 : ease(frame, strikeAt + 6, strikeAt + 14);
  const tagIn = strikeAt < 0 ? 1 : ease(frame, strikeAt + 12, strikeAt + 22);

  return (
    <div
      style={{
        position: 'absolute',
        top: y * height,
        left: 192,
        right: width - SAFE.right,
        display: 'flex',
        justifyContent: 'center',
        transform: `translateY(-50%) translateY(${interpolate(enter, [0, 1], [8, 0])}px)`,
        opacity: enter,
      }}
    >
      <div
        style={{
          ...cardStyle,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '16px 24px',
          width: '100%',
        }}
      >
        <svg width={30} height={30} viewBox="0 0 24 24" fill="none" stroke={theme.inkMuted} strokeWidth={2.2}>
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
        </svg>
        <span
          style={{
            position: 'relative',
            fontFamily: fonts.serif,
            fontWeight: 600,
            fontSize: 30,
            color: theme.inkLabel,
            whiteSpace: 'nowrap',
          }}
        >
          {text.slice(0, typed)}
          <span
            style={{
              position: 'absolute',
              left: -4,
              top: '54%',
              height: 3,
              width: `calc(${strike * 100}% + ${strike * 8}px)`,
              background: theme.orange,
            }}
          />
        </span>
        {tag ? <span style={{...monoStyle(18, 600), marginLeft: 'auto', opacity: tagIn}}>{tag}</span> : null}
      </div>
    </div>
  );
};
