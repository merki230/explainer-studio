import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {fonts} from '../fonts';
import {section, type Mood} from '../theme';
import {ease} from './card';
import {useLayout} from './layout';
import {overlayInk} from './sectionStyle';

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

/**
 * One row of the `bars` mode (v0.14 § 6, No. 011): a full-width row label over two bars, the reference (top, hatched)
 * and the subject (below, solid ink), on the row's own scale (the reference bar is full length). Times are seconds
 * after the card enters.
 */
export type ChartBarRow = {
  /** The row label (Inter 700 26 px, uppercase, one line, ≤ 30 characters), e.g. `TO BUILD · 2023 SEAL`. */
  label: string;
  /** When the reference bar starts to grow (0.6 s; the row label, its name and the row's zero rule fade in with it). */
  refAt?: number;
  /** The subject bar's length as a fraction of the reference (a shape from the voice's numbers), e.g. 0.85. */
  value: number;
  /** When the subject bar starts to grow (default `refAt` + 0.5). */
  valueAt?: number;
  /** An optional label 12 px past the subject bar's end (Inter 700 22 px, e.g. `ABOUT HALF`); dropped where it doesn't fit. */
  barLabel?: string;
  /** When the bar label fades in (default: as the subject bar lands). */
  barLabelAt?: number;
  /**
   * A bracket under the subject bar (3 px ink, 8 px legs up) with a label under it, right-aligned to its right end.
   * `measured` (default true): it spans the subject's end to the reference's end exactly. `measured: false`: an
   * unmeasured part, drawn crisp but sized by eye, from the subject's end to `to` × the reference (default 0.75), kept
   * ≥ 40 px short of the reference's end and ≥ 40 px from any bar end in another row.
   */
  bracket?: {label: string; at?: number; labelAt?: number; measured?: boolean; to?: number};
};

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
  /**
   * Outer size in px, border included (default 696 × 560; capped at the detail box's 696 × 620). Wide frame (§ 11.5):
   * default 900 × 640, capped at 900 × 700 (bars: 640, with a footnote 700).
   * Bars mode: 560 high (620 with a footnote; wide 640 / 700) unless `height` is given, which then wins (capped the
   * same). A row takes 150 px inside the border (+51 with a bracket), rows from y 40: one row with a bracket fits
   * `height: 290` (40 px bottom padding), one row without `240`. A footnote sits at y 516 (wide 578): keep the default.
   */
  width?: number;
  height?: number;
  /** Left and top edges in px (default x 120, y 330; wide frame x 144, y 150: the left half, the slice composed right). */
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
  /**
   * Bars mode (v0.14 § 6, No. 011): paired horizontal bars instead of a plot, ink and paper only (no orange, no axes,
   * ticks or numbers). ≤ 2 rows with a footnote, ≤ 3 without. Each row on its own scale (see `ChartBarRow`).
   */
  bars?: ChartBarRow[];
  /** Bars mode: the two names in the left column, reference first (≤ 6 characters each). Default `['TESLA', 'BYD']`. */
  barNames?: [string, string];
  /**
   * Bars mode: a footnote of up to two lines (≤ 44 characters each) inside the card under the last row, Inter 600 24 px
   * `inkSub`, under a 1 px rule; on for the card's whole life. With a footnote the card is 620 high, else 560.
   */
  footnote?: string[];
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

/** Rough rendered width of an Inter 700 label with 0.04em tracking (≈ 0.68 em a letter). */
const labelWidth = (s: string, size = 26) => s.length * size * 0.72;

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
  width: widthIn,
  height: heightIn,
  left: leftIn,
  top: topIn,
  curves,
  xMax,
  yMax,
  ticks,
  bars,
  barNames,
  footnote,
  mood = 'day',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const Lay = useLayout();
  const K = Lay.chart;
  const width = widthIn ?? K.width;
  const height = heightIn ?? K.height;
  const left = leftIn ?? K.left;
  const top = topIn ?? K.top;
  const t = frame / fps;
  const {ink, paper} = overlayInk(mood);
  const enter = ease(frame, 0, CHART_FADE);
  const rise = interpolate(enter, [0, 1], [8, 0]);
  const barsMode = !!bars?.length;
  const W = Math.min(K.maxW, width) - 2 * BORDER;
  // bars mode: the style guide's 560 (620 with a footnote) unless the spec gives a height (a short card for 1 row)
  const H = Math.min(K.maxH, barsMode ? (heightIn ?? (footnote?.length ? K.barsFootH : K.barsH)) : height) - 2 * BORDER;
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
  const xLabelLeft = x1 + 26 - labelWidth(xLabel, K.label) - 32;
  const xLabelLow = cTicks.some((k) => px(k.at) + labelWidth(k.label, K.label) / 2 > xLabelLeft - 16);
  const label: React.CSSProperties = {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    fontFamily: fonts.sans,
    fontWeight: 700,
    fontSize: K.label,
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
          fontSize: K.tab,
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
        {barsMode ? (
          <BarsBody rows={bars!} names={barNames ?? ['TESLA', 'BYD']} footnote={footnote} t={t} W={W} mood={mood} />
        ) : (
        <>
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
        </>
        )}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- bars mode (v0.14 § 6, No. 011)

/** The bars mode's layout (px inside the border, style guide § 6). Wide frame: `BARS_H`. */
export const BARS = {
  pad: 40,
  /** The names' right edge, the bars' left edge (zero rule), the reference length. */
  nameRight: 152,
  x0: 168,
  ref: 480,
  barH: 48,
  barGap: 12,
  /** The row label's height, its gap to the first bar. */
  labelH: 26,
  labelGap: 16,
  rowTop: [40, 272, 504],
  /** The bracket: 10 px under the subject bar, 3 px line, 8 px legs; its label 12 px under it. */
  bracketGap: 10,
  bracketLeg: 8,
  bracketLabelGap: 12,
  /** The footnote's rule and first line (with a footnote, ≤ 2 rows). */
  ruleY: 500,
  footY: 516,
  /** Frames: a bar's reveal, the fade of its name / row label / zero rule, a bracket's draw, a label's fade. */
  growF: 18,
  fadeF: 6,
  bracketF: 12,
  labelF: 10,
  /** Type: row label, names and bracket label; the bar label; the footnote. */
  label: 26,
  barLabel: 22,
  foot: 24,
};

/** The bars mode in the wide card (§ 11.5: 900 wide, the reference bar 640 px, type +2 px). */
export const BARS_H: typeof BARS = {
  ...BARS,
  nameRight: 160,
  x0: 176,
  ref: 640,
  labelH: 28,
  rowTop: [40, 264, 488],
  ruleY: 560,
  footY: 578,
  label: 28,
  barLabel: 26,
  foot: 26,
};

/** Rough width of an Inter 700 uppercase label with 0.08em tracking (≈ 0.74 em a letter). */
const capsWidth = (s: string, size: number) => s.length * size * 0.74;

const BarsBody: React.FC<{
  rows: ChartBarRow[];
  names: [string, string];
  footnote?: string[];
  t: number;
  W: number;
  mood: Mood;
}> = ({rows, names, footnote, t, W, mood}) => {
  const {fps} = useVideoConfig();
  const {ink, paper, inkSub} = overlayInk(mood);
  const B = useLayout().format === 'horizontal' ? BARS_H : BARS;
  const f = t * fps;
  const shown = rows.slice(0, footnote?.length ? 2 : 3);
  // each row's times (s after the card enters), defaults chained: a row draws after the one before
  let next = 0.4;
  const timed = shown.map((r) => {
    const refAt = r.refAt ?? next;
    const valueAt = r.valueAt ?? refAt + 0.5;
    const landed = valueAt + B.growF / fps;
    const bracketAt = r.bracket ? (r.bracket.at ?? landed + 0.2) : landed;
    next = (r.bracket ? bracketAt + B.bracketF / fps : landed) + 0.6;
    return {r, refAt, valueAt, landed, bracketAt};
  });
  const xRef = B.x0 + B.ref;
  // every bar end on the card, per row (for keeping a by-eye bracket clear of other rows' values)
  const ends = timed.map(({r}) => [xRef, B.x0 + B.ref * Math.max(0, Math.min(1, r.value))]);
  const caps = (size: number): React.CSSProperties => ({
    position: 'absolute',
    fontFamily: fonts.sans,
    fontWeight: 700,
    fontSize: size,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    lineHeight: 1,
    color: ink,
    whiteSpace: 'nowrap',
  });
  const hatchId = `bars-hatch-${mood}`;
  return (
    <>
      <svg width={W} height={B.ruleY + 200} style={{position: 'absolute', left: 0, top: 0}}>
        <defs>
          {/* the reference bar's 45° hatch, in card space so a reveal never stretches it */}
          <pattern id={hatchId} patternUnits="userSpaceOnUse" width={10} height={10} patternTransform="rotate(45)">
            <rect width={10} height={10} fill={paper} />
            <rect x={0} y={0} width={2} height={10} fill={ink} />
          </pattern>
        </defs>
        {timed.map(({r, refAt, valueAt, bracketAt}, i) => {
          const top = B.rowTop[i];
          const y1 = top + B.labelH + B.labelGap;
          const y2 = y1 + B.barH + B.barGap;
          const pRef = ease(f, refAt * fps, refAt * fps + B.growF);
          const pVal = ease(f, valueAt * fps, valueAt * fps + B.growF);
          const v = Math.max(0, Math.min(1, r.value));
          const wv = B.ref * v;
          const rule = ease(f, refAt * fps, refAt * fps + B.fadeF);
          let bracket: React.ReactNode = null;
          if (r.bracket) {
            const measured = r.bracket.measured ?? true;
            const a = B.x0 + wv;
            let b = xRef;
            if (!measured) {
              b = Math.min(B.x0 + B.ref * (r.bracket.to ?? 0.75), xRef - 40);
              for (let k = 0; k < ends.length; k++)
                if (k !== i) for (const e of ends[k]) if (Math.abs(b - e) < 40 && e > a) b = Math.min(b, e - 40);
              b = Math.max(a + 24, b);
            }
            const yb = y2 + B.barH + B.bracketGap + 1.5;
            const pb = ease(f, bracketAt * fps, bracketAt * fps + B.bracketF);
            const len = b - a;
            if (pb > 0) {
              const d = `M${a} ${yb - B.bracketLeg} V${yb} H${b} V${yb - B.bracketLeg}`;
              const total = 2 * B.bracketLeg + len;
              bracket = (
                <path
                  d={d}
                  fill="none"
                  stroke={ink}
                  strokeWidth={3}
                  strokeLinejoin="miter"
                  strokeLinecap="butt"
                  pathLength={total}
                  strokeDasharray={`${total} ${total}`}
                  strokeDashoffset={total * (1 - pb)}
                />
              );
            }
          }
          return (
            <g key={i}>
              {/* the row's own zero rule: its two bars only */}
              <rect x={B.x0 - 1.5} y={y1} width={3} height={y2 + B.barH - y1} fill={ink} opacity={rule} />
              {/* reference: paper, hatched, 3 px ink outline; revealed from the left */}
              {pRef > 0 ? (
                <g>
                  <clipPath id={`bars-ref-${i}`}>
                    <rect x={B.x0} y={y1 - 2} width={B.ref * pRef} height={B.barH + 4} />
                  </clipPath>
                  <g clipPath={`url(#bars-ref-${i})`}>
                    <rect x={B.x0 + 1.5} y={y1 + 1.5} width={B.ref - 3} height={B.barH - 3} fill={`url(#${hatchId})`} stroke={ink} strokeWidth={3} />
                  </g>
                </g>
              ) : null}
              {/* subject: solid ink, revealed from the left */}
              {pVal > 0 && wv > 0 ? <rect x={B.x0} y={y2} width={wv * pVal} height={B.barH} fill={ink} /> : null}
              {bracket}
            </g>
          );
        })}
        {footnote?.length ? <rect x={B.pad} y={B.ruleY} width={W - 2 * B.pad} height={1} fill={inkSub} /> : null}
      </svg>
      {timed.map(({r, refAt, valueAt, landed, bracketAt}, i) => {
        const top = B.rowTop[i];
        const y1 = top + B.labelH + B.labelGap;
        const y2 = y1 + B.barH + B.barGap;
        const fadeRef = ease(f, refAt * fps, refAt * fps + B.fadeF);
        const fadeVal = ease(f, valueAt * fps, valueAt * fps + B.fadeF);
        const v = Math.max(0, Math.min(1, r.value));
        const xe = B.x0 + B.ref * v;
        const labelIn = (at: number) => {
          const k = ease(f, at * fps, at * fps + B.labelF);
          return {opacity: k, transform: `translateY(${(1 - k) * 6}px)`};
        };
        const bl = r.barLabel;
        const blFits = bl ? xRef - xe >= capsWidth(bl, B.barLabel) + 24 : false;
        const measured = r.bracket?.measured ?? true;
        let bEnd = xRef;
        if (r.bracket && !measured) {
          bEnd = Math.min(B.x0 + B.ref * (r.bracket.to ?? 0.75), xRef - 40);
          for (let k = 0; k < ends.length; k++)
            if (k !== i) for (const e of ends[k]) if (Math.abs(bEnd - e) < 40 && e > xe) bEnd = Math.min(bEnd, e - 40);
          bEnd = Math.max(xe + 24, bEnd);
        }
        const bLabelTop = y2 + B.barH + B.bracketGap + 3 + B.bracketLabelGap;
        // right-aligned to the bracket's right end, clamped inside the padding
        const bRight = Math.min(bEnd, W - B.pad);
        return (
          <React.Fragment key={i}>
            <div style={{...caps(B.label), left: B.pad, top, width: W - 2 * B.pad, overflow: 'hidden', opacity: fadeRef}}>{r.label}</div>
            <div style={{...caps(B.label), right: W - B.nameRight, top: y1 + B.barH / 2, transform: 'translateY(-50%)', opacity: fadeRef}}>
              {names[0]}
            </div>
            <div style={{...caps(B.label), right: W - B.nameRight, top: y2 + B.barH / 2, transform: 'translateY(-50%)', opacity: fadeVal}}>
              {names[1]}
            </div>
            {bl && blFits ? (
              <div style={{...caps(B.barLabel), left: xe + 12, top: y2 + B.barH / 2 - B.barLabel / 2, ...labelIn(r.barLabelAt ?? landed)}}>{bl}</div>
            ) : null}
            {r.bracket ? (
              <div
                style={{
                  ...caps(B.label),
                  right: W - bRight,
                  top: bLabelTop,
                  ...labelIn(r.bracket.labelAt ?? bracketAt + B.bracketF / fps),
                }}
              >
                {r.bracket.label}
              </div>
            ) : null}
          </React.Fragment>
        );
      })}
      {footnote?.length ? (
        <div
          style={{
            position: 'absolute',
            left: B.pad,
            top: B.footY,
            width: W - 2 * B.pad,
            fontFamily: fonts.sans,
            fontWeight: 600,
            fontSize: B.foot,
            lineHeight: 1.25,
            color: inkSub,
          }}
        >
          {footnote.slice(0, 2).map((l, i) => (
            <div key={i} style={{whiteSpace: 'nowrap'}}>
              {l}
            </div>
          ))}
        </div>
      ) : null}
    </>
  );
};
