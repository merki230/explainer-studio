import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {fonts} from '../fonts';
import {theme} from '../theme';

/** "● MIC ON · ALL DAY" label pinned near the top of the frame. */
export const Chip: React.FC<{text: string; color?: string}> = ({text, color = theme.accent}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame: frame - 4, fps, config: {damping: 20}});
  const pulse = 0.55 + 0.45 * Math.abs(Math.sin((frame / fps) * Math.PI));

  return (
    <div
      style={{
        position: 'absolute',
        top: 200,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [-16, 0])}px)`,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '12px 22px',
          borderRadius: 999,
          background: 'rgba(8, 11, 28, 0.55)',
          border: `1px solid ${theme.hairline}`,
          fontFamily: fonts.mono,
          fontWeight: 600,
          fontSize: 26,
          letterSpacing: '0.18em',
          color: theme.text,
          textTransform: 'uppercase',
        }}
      >
        <span
          style={{
            width: 14,
            height: 14,
            borderRadius: 7,
            background: color,
            opacity: pulse,
            boxShadow: `0 0 14px ${color}`,
          }}
        />
        {text}
      </div>
    </div>
  );
};
