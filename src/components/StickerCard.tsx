import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {fonts} from '../fonts';
import {CAR, TWINS, type Mood} from '../theme';
import {ease} from './card';
import {overlayInk} from './sectionStyle';

/** A column of the sticker card: its header word, its car's paint square and its two numbers. */
export type StickerColumn = {
  /** The header word (Inter 700 26 px, uppercase), e.g. 'GAS'. */
  label: string;
  /** The car's paint (the same theme token as that car's body in the scene). */
  paint: string;
  /** The two numbers, top row then bottom row (as `sources.md` gives them). */
  values: [number, number];
  /** Seconds after the card enters when the digits land (the top row first, the bottom row 4 frames later). */
  at?: number;
};

/** A box (4 px ink, 14 px clear round a number's cap height): draws on clockwise from its top-left, may move. */
export type StickerBox = {
  /** Seconds after the card enters when it starts to draw (12 frames). Negative: already drawn when the card enters. */
  at: number;
  /** The number it rounds: [column 0 | 1, row 0 | 1]. */
  cell: [number, number];
  /** Moves to another number (12 frames, cubic in-out, no fade) from each `at`. */
  moves?: {at: number; cell: [number, number]}[];
};

export type StickerCardProps = {
  /** The two columns, in the order the voice compares them. Default No. 014's: GAS 29 / 37, HYBRID 51 / 44. */
  columns?: [StickerColumn, StickerColumn];
  /** The row labels (Inter 700 28 px, uppercase). Default `['CITY', 'HWY']`. */
  rows?: [string, string];
  /** The tab's word (the unit; the digits carry none). Default 'MPG'. */
  tab?: string;
  /** Every number already in when the card enters (the card returning in an earlier end state). Default false. */
  landed?: boolean;
  /** Up to two boxes (§ 6). Default none. */
  boxes?: StickerBox[];
  /** One row dims to `inkSub` (its label and both digits) over 10 frames from `at` (s after the card enters). */
  dim?: {at: number; row: number} | null;
  /** The bracket under one row, GAS digit centre → HYBRID digit centre, drawing left to right over 12 frames; no label. */
  bracket?: {at: number; row: number} | null;
  /** Outer left / top (px). Default x 120, y 330 (§ 6). */
  left?: number;
  top?: number;
  /** The digits' size (px). Default 120; 104 when the card has to sit under a held title block (§ 6). */
  digitSize?: number;
};

/** Frames: the card's entrance and exit, a digit pair's landing, a box's draw or move, the dim, the bracket. */
export const STICKER_FADE = 10;
const LAND_F = 10;
const BOX_F = 12;
const DIM_F = 10;
const BRACKET_F = 12;
const BORDER = 4;
/** The outer size and the grid (px inside the border, style guide § 6 Sticker card). */
const S = {
  w: 696,
  h: 440,
  padX: 36,
  label: [36, 186] as [number, number],
  cols: [
    [186, 419],
    [419, 652],
  ] as [number, number][],
  header: [40, 80] as [number, number],
  rowsY: [
    [104, 224],
    [272, 392],
  ] as [number, number][],
  rule: 248,
  square: 26,
  clear: 14,
  /** Archivo 800's cap height and tabular figure advance (em), measured on the stills. */
  cap: 0.7,
  fig: 0.6,
};

const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

/** A number's cap-height box (x0, y0, x1, y1) inside the border. */
const numberBox = (col: number, row: number, value: number, size: number) => {
  const [c0, c1] = S.cols[col];
  const [r0, r1] = S.rowsY[row];
  const cx = (c0 + c1) / 2;
  const cy = (r0 + r1) / 2;
  const w = String(value).length * S.fig * size;
  const h = S.cap * size;
  return {x0: cx - w / 2, x1: cx + w / 2, y0: cy - h / 2, y1: cy + h / 2, cx, cy};
};

/** A rectangle's outline from its top-left corner, clockwise, as an SVG path, and its perimeter. */
const rectPath = (x0: number, y0: number, x1: number, y1: number) => ({
  d: `M${x0} ${y0} H${x1} V${y1} H${x0} Z`,
  len: 2 * (x1 - x0 + (y1 - y0)),
});

/**
 * The sticker card (style guide v0.18.2 § 6, No. 014 F3 / N7): two cars' city and highway numbers side by side,
 * in the spirit of a window sticker but built from the house parts (the detail box's frame, an `MPG` tab, Inter
 * labels, Archivo digits), never the EPA label. Ink only: emphasis by a box (≤ 2, drawing on, moving), a row dim
 * and a bracket. Counts as the frame's one card. Times are seconds after the card enters.
 */
export const StickerCard: React.FC<StickerCardProps & {mood?: Mood}> = ({
  columns = [
    {label: 'GAS', paint: TWINS.gasPaint, values: [29, 37], at: 0.6},
    {label: 'HYBRID', paint: CAR.day.bodies.you, values: [51, 44], at: 1.6},
  ],
  rows = ['CITY', 'HWY'],
  tab = 'MPG',
  landed = false,
  boxes = [],
  dim = null,
  bracket = null,
  left = 120,
  top = 330,
  digitSize = 120,
  mood = 'day',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {ink, paper, inkSub} = overlayInk(mood);
  const F = (s: number) => Math.round(s * fps);
  const enter = ease(frame, 0, STICKER_FADE);
  const rise = interpolate(enter, [0, 1], [8, 0]);
  const W = S.w - 2 * BORDER;
  const H = S.h - 2 * BORDER;
  // the row dim: ink → inkSub (an opacity cross-fade between the two inks)
  const dimK = dim ? ease(frame, F(dim.at), F(dim.at) + DIM_F) : 0;
  const rowInk = (row: number) => (dim && dim.row === row ? dimK : 0);
  const text = (size: number): React.CSSProperties => ({
    fontFamily: fonts.sans,
    fontWeight: 700,
    fontSize: size,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    lineHeight: 1,
    whiteSpace: 'nowrap',
  });
  // a digit pair's landing: fade in with a 6 px rise, the top row first, the bottom row 4 frames later
  const land = (col: number, row: number) => {
    if (landed) return 1;
    const at = F(columns[col].at ?? (col === 0 ? 0.6 : 1.6)) + row * 4;
    return ease(frame, at, at + LAND_F);
  };
  // the boxes: where each is (moving between cells) and how much of its outline is drawn
  const boxNow = boxes.slice(0, 2).map((b) => {
    const cells: {at: number; cell: [number, number]}[] = [{at: b.at, cell: b.cell}, ...(b.moves ?? [])];
    let cur = numberBox(b.cell[0], b.cell[1], columns[b.cell[0]].values[b.cell[1]], digitSize);
    for (const m of cells.slice(1)) {
      const k = ease(frame, F(m.at), F(m.at) + BOX_F);
      if (k <= 0) break;
      const to = numberBox(m.cell[0], m.cell[1], columns[m.cell[0]].values[m.cell[1]], digitSize);
      cur = {
        x0: lerp(cur.x0, to.x0, k),
        x1: lerp(cur.x1, to.x1, k),
        y0: lerp(cur.y0, to.y0, k),
        y1: lerp(cur.y1, to.y1, k),
        cx: lerp(cur.cx, to.cx, k),
        cy: lerp(cur.cy, to.cy, k),
      };
    }
    const draw = b.at < 0 ? 1 : ease(frame, F(b.at), F(b.at) + BOX_F);
    return {...cur, draw};
  });
  // the bracket: under its row's boxes (or digits), from the first column's digit centre to the second's
  const br = bracket
    ? (() => {
        const row = bracket.row;
        const a = numberBox(0, row, columns[0].values[row], digitSize);
        const b = numberBox(1, row, columns[1].values[row], digitSize);
        const boxed = boxNow.filter((q) => Math.abs(q.cy - a.cy) < 1 && q.draw > 0);
        const under = Math.max(a.y1, b.y1, ...boxed.map((q) => q.y1 + S.clear)) + 10;
        return {x0: a.cx, x1: b.cx, y: under, k: ease(frame, F(bracket.at), F(bracket.at) + BRACKET_F)};
      })()
    : null;

  return (
    <div style={{position: 'absolute', left, top, opacity: enter, transform: `translateY(${rise}px)`}}>
      {/* the tab: the unit, Mono 700 17 px, paper on ink, like DETAIL */}
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
          width: S.w,
          height: S.h,
          boxSizing: 'border-box',
          border: `${BORDER}px solid ${ink}`,
          background: paper,
          borderRadius: 0,
          boxShadow: '0 13px 32px rgba(0,0,0,0.25)',
          overflow: 'hidden',
        }}
      >
        {/* the column headers: the paint square (2 px ink outline), 12 px, the word */}
        {columns.map((c, i) => {
          const [c0, c1] = S.cols[i];
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: c0,
                width: c1 - c0,
                top: S.header[0],
                height: S.header[1] - S.header[0],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
              }}
            >
              <div
                style={{
                  width: S.square,
                  height: S.square,
                  boxSizing: 'border-box',
                  background: c.paint,
                  border: `2px solid ${ink}`,
                  flex: 'none',
                }}
              />
              <div style={{...text(26), color: ink}}>{c.label}</div>
            </div>
          );
        })}
        {/* the row labels, centred on the digits' cap height; the rule between the rows */}
        {rows.map((r, row) => {
          const [r0, r1] = S.rowsY[row];
          return (
            <div
              key={r}
              style={{
                position: 'absolute',
                left: S.label[0],
                top: (r0 + r1) / 2 - 14,
                height: 28,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <div style={{position: 'relative'}}>
                <div style={{...text(28), color: ink, opacity: 1 - rowInk(row)}}>{r}</div>
                <div style={{...text(28), color: inkSub, opacity: rowInk(row), position: 'absolute', left: 0, top: 0}}>{r}</div>
              </div>
            </div>
          );
        })}
        <div style={{position: 'absolute', left: S.padX, width: W - 2 * S.padX, top: S.rule, height: 1, background: inkSub}} />
        {/* the digits, the boxes and the bracket (SVG: exact cap-height centring) */}
        <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0}}>
          {columns.map((c, col) =>
            c.values.map((v, row) => {
              const k = land(col, row);
              if (k <= 0.001) return null;
              const nb = numberBox(col, row, v, digitSize);
              const dy = (1 - k) * 6;
              const style: React.CSSProperties = {
                fontFamily: fonts.display,
                fontWeight: 800,
                fontSize: digitSize,
                fontVariantNumeric: 'tabular-nums lining-nums',
              };
              return (
                <g key={`${col}-${row}`} opacity={k} transform={`translate(0 ${dy})`}>
                  <text x={nb.cx} y={nb.y1} textAnchor="middle" fill={ink} opacity={1 - rowInk(row)} style={style}>
                    {v}
                  </text>
                  {rowInk(row) > 0 ? (
                    <text x={nb.cx} y={nb.y1} textAnchor="middle" fill={inkSub} opacity={rowInk(row)} style={style}>
                      {v}
                    </text>
                  ) : null}
                </g>
              );
            }),
          )}
          {boxNow.map((b, i) => {
            if (b.draw <= 0) return null;
            const p = rectPath(b.x0 - S.clear, b.y0 - S.clear, b.x1 + S.clear, b.y1 + S.clear);
            return (
              <path
                key={i}
                d={p.d}
                fill="none"
                stroke={ink}
                strokeWidth={4}
                strokeLinejoin="miter"
                strokeDasharray={`${p.len} ${p.len}`}
                strokeDashoffset={p.len * (1 - b.draw)}
              />
            );
          })}
          {br && br.k > 0 ? (
            (() => {
              const len = 8 + (br.x1 - br.x0) + 8;
              return (
                <path
                  d={`M${br.x0} ${br.y - 8} V${br.y} H${br.x1} V${br.y - 8}`}
                  fill="none"
                  stroke={ink}
                  strokeWidth={3}
                  strokeLinejoin="miter"
                  strokeDasharray={`${len} ${len}`}
                  strokeDashoffset={len * (1 - br.k)}
                />
              );
            })()
          ) : null}
        </svg>
      </div>
    </div>
  );
};
