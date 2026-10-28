import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {fonts} from '../fonts';
import {section, type Mood} from '../theme';
import {ease} from './card';
import {LEFT, overlayInk} from './sectionStyle';

/** Progress keys: `{at, value}`, seconds after the card enters, value 0 (not drawn) → 1 (drawn), eased between keys. */
export type DrawKeys = {at: number; value: number}[];

/**
 * One curve of the `curves` mode (No. 010, the taper chart): data points joined by a smooth curve that
 * never overshoots them (monotone cubic), drawn on by `draw`, in `orange` (the hidden system).
 */
export type ChartCurve = {
  /** `[x, y]` in data units (0 → `xMax`, 0 → `yMax`), in x order. E.g. minutes and kW. */
  points: [number, number][];
  /** Ink label at the curve's end (Inter 700 26 px, uppercase, ≤ 8 characters), fading in as the line lands. */
  label?: string;
  /** Where the label sits from the last point: 'right' (default), 'above', 'below' or 'left'. */
  labelPlace?: 'right' | 'above' | 'below' | 'left';
  /** Line width in px (default 8, as the flat line; a second, thinner curve: 5). */
  weight?: number;
  /** Progress keys, seconds after the card enters (default 0.3 → 1.6 s). */
  draw?: DrawKeys;
};

/** A tick on the horizontal axis of the `curves` mode: `at` in data units, its label under the axis. */
export type ChartTick = {at: number; label: string};

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
  /**
   * Curves mode (No. 010): one or more `orange` curves in data units instead of the line and the humps
   * (`line`, `humps`, `level`, `tickAt` are then ignored). Each draws on its own keys, one after another.
   * The axes keep no numbers (house rule); the ticks carry the only words on them.
   */
  curves?: ChartCurve[];
  /** Curves mode: the right end of the horizontal axis in data units (default: the largest x × 1.06). */
  xMax?: number;
  /** Curves mode: the top of the vertical axis in data units (default: the largest y × 1.1). */
  yMax?: number;
  /** Curves mode: ticks on the horizontal axis (default: one, `tick` at `xMax` × `tickAt`). */
  ticks?: ChartTick[];
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

/**
 * A smooth SVG path through screen points (x increasing) that never overshoots them: a monotone cubic
 * (Fritsch–Carlson), so a curve that holds flat stays flat and a fall never bumps back up.
 */
const monotonePath = (pts: [number, number][]) => {
  const n = pts.length;
  if (n === 0) return '';
  if (n === 1) return `M${pts[0][0]} ${pts[0][1]}`;
  const dx = pts.slice(1).map((p, i) => p[0] - pts[i][0]);
  const sl = pts.slice(1).map((p, i) => (dx[i] === 0 ? 0 : (p[1] - pts[i][1]) / dx[i]));
  const m = pts.map((_, i) =>
    i === 0 ? sl[0] : i === n - 1 ? sl[n - 2] : sl[i - 1] * sl[i] <= 0 ? 0 : (sl[i - 1] + sl[i]) / 2,
  );
  for (let i = 0; i < n - 1; i++) {
    if (sl[i] === 0) {
      m[i] = 0;
      m[i + 1] = 0;
      continue;
    }
    const a = m[i] / sl[i];
    const b = m[i + 1] / sl[i];
    const h = a * a + b * b;
    if (h > 9) {
      const k = 3 / Math.sqrt(h);
      m[i] = k * a * sl[i];
      m[i + 1] = k * b * sl[i];
    }
  }
  const f = (v: number) => v.toFixed(2);
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 0; i < n - 1; i++) {
    const [x0, y0] = pts[i];
    const [x1, y1] = pts[i + 1];
    const h = dx[i] / 3;
    d += ` C${f(x0 + h)} ${f(y0 + m[i] * h)} ${f(x1 - h)} ${f(y1 - m[i + 1] * h)} ${f(x1)} ${f(y1)}`;
  }
  return d;
};

/** Rough rendered width of an Inter 700 26 px label with 0.04em tracking (≈ 0.68 em a letter). */
const labelWidth = (s: string) => s.length * 26 * 0.72;

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
 * Curves mode (`curves`, No. 010): instead of the line and the humps, one or more `orange` curves from
 * data points (a taper: power against time), each drawing on its own keys, with ink end labels and
 * ink ticks; the scale is the data's (`xMax`, `yMax`), so two curves compare honestly.
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
  curves,
  xMax,
  yMax,
  ticks,
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
  // curves mode: data units → the plot (x from the y axis to `xe`, y from the x axis up to `y0`)
  const cv = curves?.length ? curves : undefined;
  const dataX = cv ? (xMax ?? Math.max(...cv.flatMap((c) => c.points.map((q) => q[0]))) * 1.06) || 1 : 1;
  const dataY = cv ? (yMax ?? Math.max(...cv.flatMap((c) => c.points.map((q) => q[1]))) * 1.1) || 1 : 1;
  const px = (v: number) => x0 + ((xe - x0) * v) / dataX;
  const py = (v: number) => y1 - ((y1 - y0) * v) / dataY;
  const cTicks = cv ? (ticks ?? [{at: dataX * tickAt, label: tick}]) : [];
  // the axis label moves down a row when a tick's label would run into it
  const xLabelLeft = x1 + 26 - labelWidth(xLabel) - 32;
  const xLabelLow = cTicks.some((k) => px(k.at) + labelWidth(k.label) / 2 > xLabelLeft - 16);
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
          {cv ? (
            cTicks.map((k, i) => <path key={i} d={`M${px(k.at)} ${y1} V${y1 + 16}`} stroke={ink} strokeWidth={4} />)
          ) : (
            <path d={`M${tx} ${y1} V${y1 + 16}`} stroke={ink} strokeWidth={4} />
          )}
          {/* curves mode: each curve draws on its own keys */}
          {cv?.map((c, i) => {
            const p = progress(c.draw ?? [{at: 0.3, value: 0}, {at: 1.6, value: 1}], t);
            return p > 0 ? (
              <path
                key={`c${i}`}
                d={monotonePath(c.points.map(([vx, vy]) => [px(vx), py(vy)]))}
                pathLength={1}
                strokeDasharray="1 1"
                strokeDashoffset={1 - p}
                fill="none"
                stroke={section.orange}
                strokeWidth={c.weight ?? LINE_W}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : null;
          })}
          {/* the humps, one after another */}
          {cv ? null : humpPaths.map((d, i) => {
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
          {!cv && lineP > 0 ? (
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
        <div style={{...label, right: W - x1 - 26, top: xLabelLow ? y1 + 66 : y1 + 38}}>
          {xLabel}
          <Arrow dir="right" color={ink} />
        </div>
        {cv ? (
          cTicks.map((k, i) => (
            <div key={i} style={{...label, left: px(k.at), top: y1 + 28, transform: 'translateX(-50%)'}}>
              {k.label}
            </div>
          ))
        ) : (
          <div style={{...label, left: tx, top: y1 + 38, transform: 'translateX(-50%)'}}>{tick}</div>
        )}
        {/* curves mode: the end labels, fading in as each line lands */}
        {cv?.map((c, i) => {
          if (!c.label || !c.points.length) return null;
          const p = progress(c.draw ?? [{at: 0.3, value: 0}, {at: 1.6, value: 1}], t);
          const o = Math.max(0, Math.min(1, (p - 0.85) / 0.15));
          if (o <= 0) return null;
          const [ex, ey] = c.points[c.points.length - 1];
          const lx = px(ex);
          const ly = py(ey);
          const place = c.labelPlace ?? 'right';
          const gap = (c.weight ?? LINE_W) / 2 + 12;
          const pos: React.CSSProperties =
            place === 'right'
              ? {left: lx + gap, top: ly, transform: 'translateY(-50%)'}
              : place === 'left'
                ? {right: W - lx + gap, top: ly, transform: 'translateY(-50%)'}
                : place === 'above'
                  ? {left: lx, top: ly - gap, transform: 'translate(-50%, -100%)'}
                  : {left: lx, top: ly + gap, transform: 'translateX(-50%)'};
          return (
            <div key={`l${i}`} style={{...label, ...pos, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: o}}>
              {c.label}
            </div>
          );
        })}
      </div>
    </div>
  );
};
