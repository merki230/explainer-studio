import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {fonts} from '../fonts';
import {SAFE, theme} from '../theme';
import {cardStyle, ease, monoStyle, monoWidth} from './card';
import {Pointer, type PointTo} from './Pointer';

export type AdCardProps = {
  title: string;
  label?: string;
  /** Where the card sits, as fractions of the frame: `x` is its centre, left or right edge (see `align`), `y` its centre. */
  x?: number;
  y?: number;
  /** Which edge `x` refers to. 'right' with x 0.822 puts the right edge on the safe line (888 px). */
  align?: 'center' | 'left' | 'right';
  /**
   * Point at the thing the ad is shown on (e.g. a phone), as fractions of the frame [x, y]: a hollow
   * ring on it and a thin leader to the card, as on a callout.
   */
  pointTo?: PointTo;
};

const H = 100; // 64 px icon + 2 × 16 px padding + 2 × 2 px border
/** Card width: icon, gap, the wider of the two lines (Fraunces ≈ 0.56 em per character, rounded up), padding. */
const estWidth = (title: string, label: string) =>
  Math.min(696, 4 + 16 + 64 + 20 + Math.max(monoWidth(label, 18), title.length * 34 * 0.56) + 28);

/**
 * An ad, shown as a paper exhibit card: a plaster mug icon, a mono label, a serif title.
 * Kept inside the safe area (x 120–888) whatever `x` says; can point at a target.
 */
export const AdCard: React.FC<AdCardProps> = ({
  title,
  label = 'SPONSORED · FOR YOU',
  x = 0.5,
  y = 0.28,
  align = 'center',
  pointTo,
}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const enter = ease(frame, 0, 12);

  // Anchor on the chosen edge, then clamp so the (estimated) card stays inside x 120–888.
  const w = estWidth(title, label);
  const shift = align === 'left' ? 0 : align === 'right' ? 1 : 0.5;
  const ax = Math.max(SAFE.left + shift * w, Math.min(x * width, SAFE.right - (1 - shift) * w));
  const cy = y * height;

  return (
    <>
      {pointTo ? <Pointer to={pointTo} from={[ax + (0.5 - shift) * w, cy]} box={[w, H]} /> : null}
      <div
        style={{
          ...cardStyle,
          position: 'absolute',
          left: ax,
          top: cy,
          transform: `translate(${-shift * 100}%, -50%) translateY(${interpolate(enter, [0, 1], [10, 0])}px)`,
          opacity: enter,
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          padding: '16px 28px 16px 16px',
          // max-content: an absolutely placed box anchored near the right edge would otherwise
          // shrink to the space left of the frame's edge and wrap the title.
          width: 'max-content',
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
    </>
  );
};
