import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {fonts} from '../fonts';
import {theme} from '../theme';

export type AdCardProps = {
  title: string;
  label?: string;
  /** Centre of the card, as fractions of the frame. */
  x?: number;
  y?: number;
};

export const AdCard: React.FC<AdCardProps> = ({title, label = 'SPONSORED · FOR YOU', x = 0.62, y = 0.28}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 13, mass: 0.7}});
  const float = Math.sin(frame / 18) * 6;

  return (
    <div
      style={{
        position: 'absolute',
        left: x * width,
        top: y * height,
        transform: `translate(-50%, -50%) translateY(${float + interpolate(enter, [0, 1], [40, 0])}px) scale(${interpolate(enter, [0, 1], [0.8, 1])})`,
        opacity: enter,
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        padding: '18px 26px 18px 18px',
        background: '#ffffff',
        borderRadius: 16,
        boxShadow: '0 24px 70px rgba(0,0,0,0.5)',
      }}
    >
      <div
        style={{width: 64, height: 64, borderRadius: 12, background: '#1f2433', display: 'grid', placeItems: 'center'}}
      >
        <div style={{width: 26, height: 34, borderRadius: 4, border: '4px solid #e5e7eb'}} />
      </div>
      <div>
        <div
          style={{fontFamily: fonts.mono, fontWeight: 600, fontSize: 16, letterSpacing: '0.14em', color: theme.accent}}
        >
          {label}
        </div>
        <div style={{fontFamily: fonts.sans, fontWeight: 600, fontSize: 34, color: '#111827', marginTop: 2}}>
          {title}
        </div>
      </div>
    </div>
  );
};
