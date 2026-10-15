import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {fonts} from '../fonts';
import {theme} from '../theme';
import {cardStyle, ease, monoStyle} from './card';

export type AdCardProps = {
  title: string;
  label?: string;
  /** Centre of the card, as fractions of the frame. */
  x?: number;
  y?: number;
};

/** An ad, shown as a paper exhibit card: a plaster mug icon, a mono label, a serif title. */
export const AdCard: React.FC<AdCardProps> = ({title, label = 'SPONSORED · FOR YOU', x = 0.5, y = 0.28}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const enter = ease(frame, 0, 12);

  return (
    <div
      style={{
        ...cardStyle,
        position: 'absolute',
        left: x * width,
        top: y * height,
        transform: `translate(-50%, -50%) translateY(${interpolate(enter, [0, 1], [10, 0])}px)`,
        opacity: enter,
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        padding: '16px 28px 16px 16px',
        maxWidth: 696,
      }}
    >
      {/* product placeholder: a plaster mug silhouette on the plaster square (an icon, never a picture) */}
      <div
        style={{
          width: 64,
          height: 64,
          flexShrink: 0,
          background: theme.plasterShade,
          border: `2px solid ${theme.labelBorder}`,
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <svg width={40} height={40} viewBox="0 0 40 40" aria-hidden>
          {/* handle, then the cup over it, then the saucer */}
          <path d="M27 15 h3 a5 5 0 0 1 0 10 h-3" fill="none" stroke={theme.inkMuted} strokeWidth={2.4} />
          <path
            d="M8 11 h20 v13 a7 7 0 0 1 -7 7 h-6 a7 7 0 0 1 -7 -7 z"
            fill={theme.plaster}
            stroke={theme.inkMuted}
            strokeWidth={2}
            strokeLinejoin="round"
          />
          <path d="M5 34.5 h26" stroke={theme.inkMuted} strokeWidth={2} strokeLinecap="round" />
        </svg>
      </div>
      <div>
        <div style={monoStyle(18, 500)}>{label}</div>
        <div style={{fontFamily: fonts.serif, fontWeight: 600, fontSize: 34, color: theme.inkLabel, marginTop: 2}}>
          {title}
        </div>
      </div>
    </div>
  );
};
