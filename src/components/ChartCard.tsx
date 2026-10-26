import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {fonts} from '../fonts';
import {section, type Mood} from '../theme';
import {ease} from './card';
import {LEFT, overlayInk} from './sectionStyle';

/** Progress keys: `{at, value}`, seconds after the card enters, value 0 (not drawn) → 1 (drawn), eased between keys. */
export type DrawKeys = {at: number; value: number}[];

export type ChartCardProps = {
  /** The tab's word, top-left (Mono 700 17 px, like DETAIL). Default 'POWER'. */
  tab?: string;
  /** The horizontal axis's label, an arrow drawn after it (Inter 700 26 px). Default 'SPEED'. */
  xLabel?: string;
  /** The vertical axis's label, an up arrow after it. Default 'POWER'. */
  yLabel?: string;
  /** The one tick's label under the horizontal axis. Default '30 MPH'. */
  tick?: string;
  /** Where the tick sits along the plot, 0 → 1 (default 0.25). The line's rise ends here. */
  tickAt?: number;
  /** The flat line's height, 0 → 1 of the plot (default 0.72). */
  level?: number;
  /** The orange line drawing on: rises from the origin to the tick, then runs flat (default 0.3 → 1.3 s). */
  line?: DrawKeys;
  /** The humps drawing on, one after another, under the flat part (default 1.5 → 3.4 s). */
  humps?: DrawKeys;
  /** How many humps (default 10). 0: none. */
  humpCount?: number;
  /** Where each hump starts and ends, 0 → 1 of the flat line's height (default 0.8). */
  dip?: number;
  /** Each hump this much wider than the one before (default 1.06: low gears short, high gears long). */
  growth?: number;
  /** Outer size in px, border included (default 696 × 560; capped at the detail box's 696 × 620). */
  width?: number;
  height?: number;
  /** Left and top edges in px (default x 120, y 330). */
  left?: number;
  top?: number;
};

/** Frames the card takes to fade in (and out, see Explainer). */
export const CHART_FADE = 10;
const BORDER = 4;
const LINE_W = 8;
const HUMP_W = 4;

const progress = (keys: DrawKeys, t: number) => {
  const ks = [...keys].sort((a, b) => a.at - b.at);
  if (!ks.length) return 1;
  if (t <= ks[0].at) return ks[0].value;
  for (let i = 0; i < ks.length - 1; i++)
    if (t < ks[i + 1].at) return ks[i].value + (ks[i + 1].value - ks[i].value) * ease(t, ks[i].at, ks[i + 1].at);
  return ks[ks.length - 1].value;
};

/** An axis-label arrow (Inter's latin subset has no →), drawn as a shape at the label's weight. */
const Arrow: React.FC<{dir: 'right' | 'up'; color: string}> = ({dir, color}) => (
  <svg width={24} height={22} viewBox="0 0 24 22" style={{marginLeft: 8, transform: dir === 'up' ? 'rotate(-90deg)' : undefined}}>
    <path d="M2 11 H20 M13 4 L20 11 L13 18" fill="none" stroke={color} strokeWidth={3.6} strokeLinecap="square" />
  </svg>
);

/**
 * The chart card (No. 007, owner decision 1): a shape-only chart in the detail box's frame (square
 * corners, 4 px `ink` border, `paper` fill, the box's shadow, a Mono tab). Two axes with their labels
 * and one tick; an `orange` line that rises from the origin to the tick and then runs flat (the
 * electric motor's steady power); then `humpCount` thinner `orange` humps drawing one by one under
 * the flat part, each rising to touch it and falling (a gas engine's power through its gears). No data
 * values, no numbers on the axes. In over 10 frames (opacity, 8 px rise). Counts as the frame's one card.
 */
export const ChartCard: React.FC<ChartCardProps & {mood?: Mood}> = ({
  tab = 'POWER',
  xLabel = 'SPEED',
  yLabel = 'POWER',
  tick = '30 MPH',
  tickAt = 0.25,
  level = 0.72,
  line = [
    {at: 0.3, value: 0},
    {at: 1.3, value: 1},
  ],
  humps = [
    {at: 1.5, value: 0},
    {at: 3.4, value: 1},
  ],
  humpCount = 10,
  dip = 0.8,
  growth = 1.06,
  width = 696,
  height = 560,
  left = LEFT,
  top = 330,
  mood = 'day',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const {ink, paper} = overlayInk(mood);
  const enter = ease(frame, 0, CHART_FADE);
  const rise = interpolate(enter, [0, 1], [8, 0]);
  const W = Math.min(696, width) - 2 * BORDER;
  const H = Math.min(620, height) - 2 * BORDER;
  // the plot: y axis at x0, x axis at y1; arrowheads past the ends
  const x0 = 64;
  const x1 = W - 40;
  const y0 = 96;
  const y1 = H - 100;
  const xe = x1 - 26; // where the curves end, short of the arrowhead
  const tx = x0 + (xe - x0) * tickAt;
  const fy = y1 - (y1 - y0) * level;
  const lineP = progress(line, t);
  const humpsP = progress(humps, t);
  // humps: widths growing by `growth`, from the tick to the end, peaks just touching the line
  const n = Math.max(0, Math.round(humpCount));
  const widths = Array.from({length: n}, (_, i) => growth ** i);
  const sum = widths.reduce((a, b) => a + b, 0);
  const peakY = fy + LINE_W / 2 + HUMP_W / 2 - 1;
  const dipY = y1 - (y1 - fy) * dip;
  const a = Math.log(0.5) / Math.log(0.6); // the hump peaks 60 % of the way along (power peaks before the shift)
  let cursor = tx;
  const humpPaths = widths.map((wi) => {
    const hw = ((xe - tx) * wi) / sum;
    const pts = Array.from({length: 25}, (_, k) => {
      const u = k / 24;
      const f = Math.sin(Math.PI * u ** a);
      return `${(cursor + hw * u).toFixed(2)},${(dipY + (peakY - dipY) * f).toFixed(2)}`;
    });
    cursor += hw;
    return `M${pts.join(' L')}`;
  });
  const label: React.CSSProperties = {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    fontFamily: fonts.sans,
    fontWeight: 700,
    fontSize: 26,
    letterSpacing: '0.04em',
    lineHeight: 1,
    color: ink,
    whiteSpace: 'nowrap',
  };
  return (
    <div style={{position: 'absolute', left, top, opacity: enter, transform: `translateY(${rise}px)`}}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          bottom: '100%',
          background: ink,
          color: paper,
          fontFamily: fonts.mono,
          fontWeight: 700,
          fontSize: 17,
          letterSpacing: '0.16em',
          padding: '4px 10px 3px',
          lineHeight: 1.2,
        }}
      >
        {tab}
      </div>
      <div
        style={{
          position: 'relative',
          width: W + 2 * BORDER,
          height: H + 2 * BORDER,
          boxSizing: 'border-box',
          border: `${BORDER}px solid ${ink}`,
          background: paper,
          borderRadius: 0,
          boxShadow: '0 13px 32px rgba(0,0,0,0.25)',
          overflow: 'hidden',
        }}
      >
        <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0}}>
          {/* axes with arrowheads */}
          <path d={`M${x0} ${y0 - 18} V${y1} H${x1 + 18}`} fill="none" stroke={ink} strokeWidth={4} strokeLinejoin="miter" />
          <path d={`M${x0 - 11} ${y0 - 6} L${x0} ${y0 - 26} L${x0 + 11} ${y0 - 6} Z`} fill={ink} />
          <path d={`M${x1 + 6} ${y1 - 11} L${x1 + 26} ${y1} L${x1 + 6} ${y1 + 11} Z`} fill={ink} />
          {/* the tick */}
          <path d={`M${tx} ${y1} V${y1 + 16}`} stroke={ink} strokeWidth={4} />
          {/* the humps, one after another */}
          {humpPaths.map((d, i) => {
            const p = Math.max(0, Math.min(1, humpsP * n - i));
            return p > 0 ? (
              <path
                key={i}
                d={d}
                pathLength={1}
                strokeDasharray="1 1"
                strokeDashoffset={1 - p}
                fill="none"
                stroke={section.orange}
                strokeWidth={HUMP_W}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : null;
          })}
          {/* the line: rise to the tick, then flat */}
          {lineP > 0 ? (
            <path
              d={`M${x0} ${y1} L${tx} ${fy} L${xe} ${fy}`}
              pathLength={1}
              strokeDasharray="1 1"
              strokeDashoffset={1 - lineP}
              fill="none"
              stroke={section.orange}
              strokeWidth={LINE_W}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : null}
        </svg>
        <div style={{...label, left: x0 - 12, top: 30}}>
          {yLabel}
          <Arrow dir="up" color={ink} />
        </div>
        <div style={{...label, right: W - x1 - 26, top: y1 + 38}}>
          {xLabel}
          <Arrow dir="right" color={ink} />
        </div>
        <div style={{...label, left: tx, top: y1 + 38, transform: 'translateX(-50%)'}}>{tick}</div>
      </div>
    </div>
  );
};
