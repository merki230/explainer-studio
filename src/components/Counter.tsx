import React from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {fonts} from '../fonts';
import type {Mood} from '../theme';
import {ease} from './card';
import {overlayInk} from './sectionStyle';

/** One row of a stopwatch compare (No. 007): a label, and the value its clock stops at. */
export type CounterRow = {
  /** Mono label on the left ("ELECTRIC"). */
  label: string;
  /** The value this row stops at (3.3). */
  to: number;
  /**
   * Seconds after the counter enters when this row reaches `to` and stops (sync to the picture, e.g.
   * the frame its car reaches 60). Default: `start` + (`to` − `from`), i.e. the clock in real time.
   */
  stopAt?: number;
};

export type CounterProps = {
  from?: number;
  /** The counted value (required unless `rows` is set). */
  to?: number;
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
  /** Digits after the decimal point (default 0: whole numbers, as before). */
  decimals?: number;
  /**
   * Stopwatch compare (No. 007): rows stacked in one frame (top row first; order them like the lanes),
   * sharing one clock that runs from `from` and stops each row at its own `to` on its `stopAt`. The
   * clock is piecewise linear through the rows' stop keys (race time, so it slows with the picture's
   * slow motion), not eased. `label` is the unit after every row's digits ("s"). `to`, `rangeTo` and
   * `duration` are ignored. Default none (the single counter).
   */
  rows?: CounterRow[];
  /** Rows: seconds after the counter enters when the clock starts at `from` (default 0). */
  start?: number;
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
  decimals = 0,
  rows,
  start = 0,
  mood = 'day',
}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const {ink, paper, inkSub} = overlayInk(mood);
  const enter = ease(frame, 0, 10);
  if (rows?.length)
    return <CounterRows {...{from, label, sub, x, y, subPlace, decimals, rows, start, mood}} />;
  const fmt = (v: number) =>
    decimals > 0
      ? v.toLocaleString('en-US', {minimumFractionDigits: decimals, maximumFractionDigits: decimals})
      : Math.round(v).toLocaleString('en-US');
  const value = interpolate(frame, [0, duration * fps], [from, to ?? 0], {
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
            fmt(value)
          ) : (
            <>
              {/* the counted number in a box as wide as its final value (tabular digits), so the range never shifts */}
              <span style={{display: 'inline-block', minWidth: `${fmt(to ?? 0).length}ch`, textAlign: 'right'}}>
                {fmt(value)}
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

/**
 * The stopwatch compare (No. 007): the counter's frame holding rows stacked like the lanes they stand
 * for, each a label (Inter 700 30 px, uppercase), digits (Archivo 800 80 px, right-aligned, tabular)
 * and the unit (Inter 600 34 px). One clock for all rows, linear between the stop keys; each row shows
 * min(clock, its `to`), truncated like a stopwatch so it reads its final value only on its stop frame.
 */
const CounterRows: React.FC<
  Required<Pick<CounterProps, 'from' | 'x' | 'y' | 'subPlace' | 'decimals' | 'start'>> &
    Pick<CounterProps, 'label' | 'sub'> & {rows: CounterRow[]; mood: Mood}
> = ({from, label, sub, x, y, subPlace, decimals, rows, start, mood}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const {ink, paper, inkSub} = overlayInk(mood);
  const enter = ease(frame, 0, 10);
  // the clock's keys: `from` at `start`, then each row's `to` at its stop time (sorted, never running back)
  const keys = [{t: start, v: from}, ...rows.map((r) => ({t: r.stopAt ?? start + (r.to - from), v: r.to}))].sort(
    (a, b) => a.t - b.t,
  );
  for (let i = 1; i < keys.length; i++) keys[i].v = Math.max(keys[i].v, keys[i - 1].v);
  const t = frame / fps;
  let clock = keys[0].v;
  for (let i = 0; i < keys.length - 1; i++)
    if (t >= keys[i].t)
      clock =
        keys[i + 1].t > keys[i].t
          ? keys[i].v + (keys[i + 1].v - keys[i].v) * Math.min(1, (t - keys[i].t) / (keys[i + 1].t - keys[i].t))
          : keys[i + 1].v;
  const k = 10 ** decimals;
  const fmt = (v: number) =>
    (Math.floor(v * k + 1e-6) / k).toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
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
        margin: subPlace === 'above' ? '0 0 10px' : '8px 0 0',
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
      <div style={{display: 'grid', gridTemplateColumns: 'auto auto auto', columnGap: 14, rowGap: 4, alignItems: 'baseline'}}>
        {rows.map((r) => (
          <React.Fragment key={r.label}>
            <span
              style={{
                fontFamily: fonts.sans,
                fontWeight: 700,
                fontSize: 30,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                color: ink,
                marginRight: 10,
              }}
            >
              {r.label}
            </span>
            <span
              style={{
                justifySelf: 'end',
                fontFamily: fonts.display,
                fontWeight: 800,
                fontSize: 80,
                lineHeight: 1,
                letterSpacing: '-0.02em',
                color: ink,
                fontVariantNumeric: 'tabular-nums lining-nums',
              }}
            >
              {fmt(Math.min(clock, r.to))}
            </span>
            <span style={{fontFamily: fonts.sans, fontWeight: 600, fontSize: 34, color: ink}}>{label}</span>
          </React.Fragment>
        ))}
      </div>
      {sub && subPlace === 'below' ? subLine : null}
    </div>
  );
};
