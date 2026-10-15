import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {fonts} from '../fonts';
import {theme} from '../theme';
import {cardStyle} from './card';

export type ChipProps = {
  /** Small monospace line, e.g. "Same couch · same evening". Shown alone (in serif) if there's no title. */
  text: string;
  /** Serif exhibit title, e.g. "No. 014 · The Living Room". */
  title?: string;
  /** Optional small dot before the mono line (orange is the only accent). */
  color?: string;
  /** Distance from the top of the frame in px. */
  top?: number;
};

/** Exhibit label: a small plaster card pinned near the top, inside the platform safe zone. */
export const Chip: React.FC<ChipProps> = ({text, title, color, top = 340}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame: frame - 4, fps, config: {damping: 20}});

  const mono = (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        fontFamily: fonts.mono,
        fontWeight: 500,
        fontSize: 20,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: theme.inkMuted,
      }}
    >
      {color ? <span style={{width: 10, height: 10, borderRadius: 5, background: color}} /> : null}
      {text}
    </span>
  );

  return (
    <div
      style={{
        position: 'absolute',
        top,
        left: 120,
        right: 1080 - 888,
        display: 'flex',
        justifyContent: 'center',
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [-10, 0])}px)`,
      }}
    >
      <div
        style={{
          ...cardStyle,
          display: 'inline-grid',
          gap: 3,
          textAlign: 'center',
          padding: '16px 32px 18px',
          maxWidth: 768,
        }}
      >
        <span
          style={{
            fontFamily: fonts.serif,
            fontWeight: 600,
            fontSize: 30,
            color: theme.inkLabel,
            letterSpacing: '0.02em',
          }}
        >
          {title ?? text}
        </span>
        {title ? mono : null}
      </div>
    </div>
  );
};
