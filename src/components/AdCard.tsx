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

/** An ad, shown as a paper exhibit card: a product placeholder, a mono label, a serif title. */
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
      {/* product placeholder: a plaster square with a muted outline, no picture */}
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
        <div style={{width: 24, height: 30, border: `2px solid ${theme.inkMuted}`}} />
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
