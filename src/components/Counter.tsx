import React from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {fonts} from '../fonts';
import type {Mood} from '../theme';
import {ease} from './card';
import {overlayInk} from './sectionStyle';

export type CounterProps = {
  from?: number;
  to: number;
  /** The unit beside the digits ("years"). */
  label: string;
  /** A Mono line under it ("up to about"). */
  sub?: string;
  /** Top-left corner, as fractions of the frame (0.111 = the safe area's left edge, 120 px). */
  x?: number;
  y?: number;
  /** Seconds to count. */
  duration?: number;
  /** Where the sub-line sits: 'below' (default, like the title block's line 2) or 'above' (reads first: "UP TO ABOUT / 10 years"). */
  subPlace?: 'above' | 'below';
  /**
   * A range (No. 006): the upper end, shown after the counted number with an en dash and one unit
   * ("64–95 %"). The first number counts `from` → `to`; then "–95" lands (fades in with a 6 px rise
   * over 8 frames) at `rangeAt`. Its room is kept from the start, so nothing shifts. Default none.
   */
  rangeTo?: number;
  /** Seconds after the counter enters when the range's upper end lands (default `duration` + 0.3). */
  rangeAt?: number;
};

/**
 * A number counting up, in The Section's look (v0.8 § 6): the title block's frame (a `paper` box,
 * 3 px `ink` border, square corners, padding 13 / 24 / 15), Archivo 800 digits at 80 px, the unit in
 * Inter 600 34 px, the sub-line in JetBrains Mono 600 20 px `inkSub`. In over 10 frames (opacity, 8 px
 * rise). Counts as the frame's one card. Mood colours from the scene.
 */
export const Counter: React.FC<CounterProps & {mood?: Mood}> = ({
  from = 0,
  to,
  label,
  sub,
  x = 0.111,
  y = 0.55,
  duration = 1.6,
  subPlace = 'below',
  rangeTo,
  rangeAt,
  mood = 'day',
}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const {ink, paper, inkSub} = overlayInk(mood);
  const enter = ease(frame, 0, 10);
  const value = interpolate(frame, [0, duration * fps], [from, to], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

  const subLine = (
    <div
      style={{
        fontFamily: fonts.mono,
        fontWeight: 600,
        fontSize: 20,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: inkSub,
        margin: subPlace === 'above' ? '0 0 8px' : '6px 0 0',
      }}
    >
      {sub}
    </div>
  );

  return (
    <div
      style={{
        position: 'absolute',
        left: x * width,
        top: y * height,
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [8, 0])}px)`,
        background: paper,
        border: `3px solid ${ink}`,
        borderRadius: 0,
        padding: '13px 24px 15px',
      }}
    >
      {sub && subPlace === 'above' ? subLine : null}
      <div style={{display: 'flex', alignItems: 'baseline', gap: 14}}>
        <span
          style={{
            fontFamily: fonts.display,
            fontWeight: 800,
            fontSize: 80,
            lineHeight: 1,
            letterSpacing: '-0.02em',
            color: ink,
            fontVariantNumeric: 'tabular-nums lining-nums',
          }}
        >
          {rangeTo === undefined ? (
            Math.round(value).toLocaleString('en-US')
          ) : (
            <>
              {/* the counted number in a box as wide as its final value (tabular digits), so the range never shifts */}
              <span style={{display: 'inline-block', minWidth: `${to.toLocaleString('en-US').length}ch`, textAlign: 'right'}}>
                {Math.round(value).toLocaleString('en-US')}
              </span>
              <span
                style={{
                  display: 'inline-block',
                  opacity: ease(frame, (rangeAt ?? duration + 0.3) * fps, (rangeAt ?? duration + 0.3) * fps + 8),
                  transform: `translateY(${interpolate(
                    ease(frame, (rangeAt ?? duration + 0.3) * fps, (rangeAt ?? duration + 0.3) * fps + 8),
                    [0, 1],
                    [6, 0],
                  )}px)`,
                }}
              >
                {`\u2013${rangeTo.toLocaleString('en-US')}`}
              </span>
            </>
          )}
        </span>
        <span style={{fontFamily: fonts.sans, fontWeight: 600, fontSize: 34, color: ink}}>{label}</span>
      </div>
      {sub && subPlace === 'below' ? subLine : null}
    </div>
  );
};
