import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {fonts} from '../fonts';
import type {Mood} from '../theme';
import {anchorOnScreen, type AnchorScene} from './anchors';
import {ease} from './card';
import {LEFT, overlayInk, paperHalo, RIGHT} from './sectionStyle';

export type PriceTagProps = {
  /**
   * The scene anchor of the car's roof (its highest point; `charge-slice`: 'top:top' / 'top:bottom'). The leader
   * starts there and the block follows it as the car or the camera moves (the block's x stays put).
   */
  anchor: string;
  /** Which margin the block sits in: 'left' starts at x 120 (default), 'right' ends at x 888. */
  side?: 'left' | 'right';
  /**
   * Up to three lines: [name, price, sub]. Name: Inter 700 26 px, `ink`, ≤ 18 characters, the maker as the voice
   * says it plus the model ('BYD SEAL 06 EV'). Price: Inter 800 32 px, `ink`, ≤ 20 characters ('FROM ABOUT $16,300').
   * Sub: Inter 600 22 px, `inkSub`, ≤ 30 characters ('¥109,900 · CHINA LIST PRICE'). All set uppercase.
   */
  lines: [string, string?, string?];
  /** The square's fill: the car's paint token (e.g. `CHARGE.bydPaint`). It always has a 2 px `ink` outline. */
  color: string;
  /**
   * When lines 2 and 3 join (seconds into the scene, like `at`): the price as spoken. They fade in with a 6 px rise
   * over 10 frames, the block growing downward. Default: with line 1.
   */
  linesAt?: number;
  /** Gap between the roof point and the block's bottom edge, px (default 60). */
  rise?: number;
  /**
   * An anchor the block must stay ≥ 16 px below (the other lane's set, e.g. 'under:top' over the bottom car). The
   * rise shortens down to `minRise` to do so; if the full block still doesn't fit, line 3 is dropped (§ 6).
   */
  below?: string;
  /** The shortest rise when `below` pushes the block down, px (default 40). */
  minRise?: number;
  /** The highest the block's top may sit, px (default 470; set it ≥ 24 px under the title block's bottom edge). */
  ceiling?: number;
};

/** Frames the leader draws, the block fades in (and out, see Explainer). */
export const PRICE_TAG_FADE = 10;
const SQUARE = 26;
const GAP = 12;
const LINE_GAP = 4;
const RISE_PX = 6;
const L1 = {size: 26, weight: 700, spacing: 0.08, lh: 1, em: 0.72} as const;
const L2 = {size: 32, weight: 800, spacing: 0.02, lh: 1.1, em: 0.66} as const;
const L3 = {size: 22, weight: 600, spacing: 0.04, lh: 1, em: 0.68} as const;
const STYLES = [L1, L2, L3];
const heightOf = (s: (typeof STYLES)[number]) => Math.round(s.size * s.lh);
/** Rough rendered width of an uppercase Inter line (advance ≈ `em` per letter plus the tracking). */
const widthOf = (text: string, s: (typeof STYLES)[number]) => text.length * s.size * (s.em + s.spacing);

/**
 * Car price tag (style guide v0.14.2 § 6, No. 011 N9): a car name tag that grows. A 2 px `ink` leader from the
 * roof straight up, then across (one right angle) to 10 px short of the block; a 26 px square in the car's paint
 * (2 px `ink` outline) beside line 1 (the name); lines 2 (price) and 3 (sub, `inkSub`) join on `linesAt`. All text on
 * a 10 px `paper` halo. A tag, not a card. Pure function of the frame.
 */
export const PriceTag: React.FC<PriceTagProps & {mood?: Mood; scene: AnchorScene}> = ({
  anchor,
  side = 'left',
  lines,
  color,
  linesAt,
  rise = 60,
  below,
  minRise = 40,
  ceiling = 470,
  mood = 'day',
  scene,
}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const at = (a: string, f = frame) => anchorOnScreen(scene, a, f, fps);
  const join = linesAt === undefined ? 0 : Math.round(linesAt * fps) - scene.offset;
  const roof = at(anchor);
  if (!roof) return null;
  const [hx, hy] = roof;
  const {ink, inkSub} = overlayInk(mood);

  const shown = lines.filter((l): l is string => !!l).map((l) => l.toUpperCase());
  const blockH = (n: number) => STYLES.slice(0, n).reduce((h, s) => h + heightOf(s), 0) + LINE_GAP * Math.max(0, n - 1);

  // Where the block sits: its bottom `rise` above the roof, its top never above `ceiling`; under `below`, ≥ 16 px
  // clear of that point. The rise shortens down to `minRise`; if the full block still doesn't fit between the upper
  // limit and the roof, line 3 is dropped (§ 6: drop the sub line rather than overlap a car).
  // The fit is judged once, at the frame lines 2–3 join, so line 3 never pops in or out mid-shot.
  const upperAt = (f: number) => {
    const lid = below ? at(below, f) : undefined;
    return Math.max(ceiling, lid ? lid[1] + 16 : -Infinity);
  };
  const upper = upperAt(frame);
  const roofJ = at(anchor, Math.max(0, join));
  const n =
    shown.length === 3 && roofJ && upperAt(Math.max(0, join)) + blockH(3) > roofJ[1] - minRise ? 2 : shown.length;
  const top = Math.max(upper, hy - rise - blockH(n));
  const text = shown.slice(0, n);

  const textW = Math.max(...text.map((t, i) => widthOf(t, STYLES[i])));
  const w = SQUARE + GAP + textW;
  const left = side === 'left' ? LEFT : RIGHT - w;
  const lineY = top + SQUARE / 2; // line 1's centre: the leader's level

  // The leader: up from the roof, then across to 10 px short of the block. When the roof is right under the block,
  // straight up to 10 px below it.
  const under = hx >= left - 14 && hx <= left + w + 14;
  const lx = side === 'left' ? left + w + 10 : left - 10;
  const bottom = top + blockH(n);
  // (no leader when the block reaches down to the roof: the director's framing leaves no gap)
  const pts: [number, number][] = under
    ? bottom + 10 >= hy - 4
      ? []
      : [
          [hx, hy - 4],
          [hx, bottom + 10],
        ]
    : [
        [hx, hy - 4],
        [hx, lineY],
        [lx, lineY],
      ];
  const len = pts.slice(1).reduce((s, p, i) => s + Math.abs(p[0] - pts[i][0]) + Math.abs(p[1] - pts[i][1]), 0);

  const e1 = ease(frame, 0, PRICE_TAG_FADE);
  const e2 = ease(frame, join, join + PRICE_TAG_FADE);
  const halo = paperHalo(mood, 10);
  const lineStyle = (s: (typeof STYLES)[number], c: string): React.CSSProperties => ({
    fontFamily: fonts.sans,
    fontWeight: s.weight,
    fontSize: s.size,
    lineHeight: s.lh,
    letterSpacing: `${s.spacing}em`,
    textTransform: 'uppercase',
    color: c,
    textShadow: halo,
    whiteSpace: 'nowrap',
  });

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <svg width={width} height={height} style={{position: 'absolute', inset: 0}}>
        {pts.length < 2 ? null : (
          <polyline
            points={pts.map((p) => p.join(',')).join(' ')}
            fill="none"
            stroke={ink}
            strokeWidth={2}
            strokeLinejoin="miter"
            strokeDasharray={`${len} ${len}`}
            strokeDashoffset={len * (1 - e1)}
          />
        )}
      </svg>
      <div style={{position: 'absolute', left, top, width: w}}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: GAP,
            height: SQUARE,
            opacity: e1,
            transform: `translateY(${(1 - e1) * RISE_PX}px)`,
          }}
        >
          <div
            style={{
              width: SQUARE,
              height: SQUARE,
              boxSizing: 'border-box',
              background: color,
              outline: `2px solid ${ink}`,
              flex: 'none',
            }}
          />
          <div style={lineStyle(L1, ink)}>{text[0]}</div>
        </div>
        {text.length > 1 ? (
          <div
            style={{
              marginLeft: SQUARE + GAP,
              marginTop: LINE_GAP,
              display: 'flex',
              flexDirection: 'column',
              gap: LINE_GAP,
              opacity: e2 * e1,
              transform: `translateY(${(1 - e2) * RISE_PX}px)`,
            }}
          >
            <div style={lineStyle(L2, ink)}>{text[1]}</div>
            {text[2] ? <div style={lineStyle(L3, inkSub)}>{text[2]}</div> : null}
          </div>
        ) : null}
      </div>
    </div>
  );
};
