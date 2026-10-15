import React from 'react';
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {fonts} from '../fonts';
import {theme} from '../theme';

export type CalloutProps = {
  /** Anchor point (the thing being labelled), as fractions of the frame. */
  x: number;
  y: number;
  /** Where the label box sits, in px relative to the anchor. */
  dx?: number;
  dy?: number;
  title: string;
  sub?: string;
};

/** Dot + leader line + label box, like "Microphone · BOTTOM EDGE". */
export const Callout: React.FC<CalloutProps> = ({x, y, dx = 80, dy = -120, title, sub}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();

  const ax = x * width;
  const ay = y * height;
  const lx = ax + dx;
  const ly = ay + dy;

  const dot = spring({frame, fps, config: {damping: 12, mass: 0.6}});
  const line = interpolate(frame, [4, 16], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const label = spring({frame: frame - 12, fps, config: {damping: 20}});
  const len = Math.hypot(dx, dy);
  const labelLeft = dx >= 0;

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <svg width={width} height={height} style={{position: 'absolute', inset: 0}}>
        <line
          x1={ax}
          y1={ay}
          x2={lx}
          y2={ly}
          stroke="rgba(255,255,255,0.7)"
          strokeWidth={2}
          strokeDasharray={len}
          strokeDashoffset={len * (1 - line)}
        />
        <circle cx={ax} cy={ay} r={9 * dot} fill={theme.text} />
        <circle cx={ax} cy={ay} r={22 * dot} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={2} />
      </svg>
      <div
        style={{
          position: 'absolute',
          left: labelLeft ? lx : undefined,
          right: labelLeft ? undefined : width - lx,
          top: ly,
          transform: `translateY(-50%) translateY(${interpolate(label, [0, 1], [10, 0])}px)`,
          opacity: label,
          padding: '14px 20px',
          background: theme.panel,
          border: `1px solid ${theme.hairline}`,
          borderRadius: 10,
          whiteSpace: 'nowrap',
        }}
      >
        <div style={{fontFamily: fonts.sans, fontWeight: 600, fontSize: 32, color: theme.text}}>{title}</div>
        {sub ? (
          <div
            style={{
              fontFamily: fonts.mono,
              fontSize: 18,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: theme.muted,
              marginTop: 4,
            }}
          >
            {sub}
          </div>
        ) : null}
      </div>
    </div>
  );
};
