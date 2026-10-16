import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {fonts} from '../fonts';
import type {Mood} from '../theme';
import {ease} from './card';
import {LEFT, overlayInk, paperHalo, RIGHT} from './sectionStyle';

export type CalloutProps = {
  /** Anchor point (the thing being labelled), as fractions of the frame. */
  x: number;
  y: number;
  /**
   * Where the label sits, in px relative to the anchor. With `place: 'side'` (default) this is the
   * middle of its near edge (left edge if dx ≥ 0, else right); with `place: 'above'` it is the middle
   * of its bottom edge.
   */
  dx?: number;
  dy?: number;
  place?: 'side' | 'above';
  /**
   * `place: 'above'` only: the leader first runs across from the thing to this x (fraction of the
   * frame), then up to the label, which centres on it. For a thing with something else labelled-
   * looking right above it (a small chip under a big one): the leader goes round it, not across it.
   */
  via?: number;
  /** ≤ 3 words, shown uppercase. */
  title: string;
  sub?: string;
};

const TITLE = 26;
const SUB = 20;
/** Inter 700 uppercase with 0.08em tracking: ≈ 0.72 em a letter plus the tracking. */
const width = (s: string, size: number, spacing: number) => s.length * size * (0.72 + spacing);

/**
 * Object callout as a drawing label (v0.8 § 6: "same as a tag without the square"): a 2 px `ink`
 * elbow leader from the thing (straight up or down, then across) to the label, Inter 700 26 px
 * uppercase `ink` with a `paper` halo, no card; an optional sub-line in Inter 600 20 px `inkSub`.
 * Same props as before. Kept inside x 120–888.
 */
export const Callout: React.FC<CalloutProps & {mood?: Mood}> = ({
  x,
  y,
  dx = 80,
  dy = -120,
  place = 'side',
  via,
  title,
  sub,
  mood = 'day',
}) => {
  const frame = useCurrentFrame();
  const {width: W, height: H} = useVideoConfig();
  const {ink, inkSub} = overlayInk(mood);
  const ax = x * W;
  const ay = y * H;
  const above = place === 'above';
  const labelLeft = dx >= 0;
  const w = Math.ceil(Math.max(width(title, TITLE, 0.08), sub ? width(sub, SUB, 0.04) : 0)) + 8;
  const vx = above && via !== undefined ? via * W : undefined;
  const want = above ? (vx ?? ax) + dx - w / 2 : labelLeft ? ax + dx : ax + dx - w;
  const left = Math.max(LEFT, Math.min(want, RIGHT - w));
  const ly = ay + dy;
  // elbow: up or down from the thing to the label's height, then across to its near edge
  const lx = above ? left + w / 2 : labelLeft ? left - 10 : left + w + 10;
  const points =
    above && vx !== undefined
      ? `${ax},${ay} ${vx},${ay} ${vx},${ly + 6} ${lx},${ly + 6}`
      : above
        ? `${ax},${ay} ${ax},${ly + 6} ${lx},${ly + 6}`
        : `${ax},${ay} ${ax},${ly} ${lx},${ly}`;

  const line = ease(frame, 0, 12);
  const label = ease(frame, 6, 16);

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <svg width={W} height={H} style={{position: 'absolute', inset: 0, opacity: line}}>
        <polyline points={points} fill="none" stroke={ink} strokeWidth={2} strokeLinejoin="miter" />
      </svg>
      <div
        style={{
          position: 'absolute',
          left,
          top: ly,
          width: w,
          transform: above ? 'translateY(-100%)' : 'translateY(-50%)',
          opacity: label,
          textAlign: above ? 'center' : labelLeft ? 'left' : 'right',
        }}
      >
        <div
          style={{
            fontFamily: fonts.sans,
            fontWeight: 700,
            fontSize: TITLE,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: ink,
            textShadow: paperHalo(mood, 10),
            whiteSpace: 'nowrap',
            lineHeight: 1.1,
          }}
        >
          {title}
        </div>
        {sub ? (
          <div
            style={{
              fontFamily: fonts.sans,
              fontWeight: 600,
              fontSize: SUB,
              letterSpacing: '0.04em',
              color: inkSub,
              textShadow: paperHalo(mood, 10),
              whiteSpace: 'nowrap',
              marginTop: 4,
            }}
          >
            {sub}
          </div>
        ) : null}
      </div>
    </div>
  );
};
