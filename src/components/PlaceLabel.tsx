import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {fonts} from '../fonts';
import type {Mood} from '../theme';
import {anchorOnScreen, type AnchorScene} from './anchors';
import {ease} from './card';
import {LEFT, overlayInk, paperHalo, RIGHT} from './sectionStyle';

export type PlaceLabelProps = {
  /** The place, one or two words, shown uppercase ("CHINA", "THE US"). ≤ 12 characters. */
  text: string;
  /** An optional quieter line under the rule (Inter 600 20 px, `inkSub`): "CHARGING STATION". */
  sub?: string;
  /** Left edge and top edge in px (default x 120, top y 300: the sky band, where the title block sits). */
  left?: number;
  top?: number;
  /**
   * A named point of the scene instead of `left`/`top`, followed as the camera moves (scenes with
   * anchors, see `anchorOnScreen`): the label's left edge and baseline rule sit at the point, so it
   * reads as lettering laid on the ground or the cut face. Clamped inside x 120–888.
   */
  anchor?: string;
  /** Type size in px (default 30; keep 26–30). */
  size?: number;
  /** The ink rule under the word, drawing left to right (default true), like a title on a section drawing. */
  rule?: boolean;
};

/** Frames the label takes to come in (and out, see Explainer). */
export const PLACE_FADE = 10;

/**
 * A place label (No. 010): where the slice is, as a section drawing names its sheet. One or two words
 * in Inter 700, uppercase, wide tracking, `ink` on a `paper` halo, no card, no leader; a 3 px `ink`
 * rule under it draws left to right as the word fades in (opacity and a 6 px rise over 10 frames).
 * Default place: the sky band, top-left (x 120, y 300). Never a flag, map or emblem. Counts as the
 * frame's one card.
 */
export const PlaceLabel: React.FC<PlaceLabelProps & {mood?: Mood; scene?: AnchorScene}> = ({
  text,
  sub,
  left = LEFT,
  top = 300,
  anchor,
  scene,
  size = 30,
  rule = true,
  mood = 'day',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {ink, inkSub} = overlayInk(mood);
  const at = anchor && scene ? anchorOnScreen(scene, anchor, frame, fps) : undefined;
  // Inter 700 uppercase with 0.14em tracking: ≈ 0.72 em a letter plus the tracking
  const w = Math.ceil(text.length * size * (0.72 + 0.14));
  const x = Math.max(LEFT, Math.min(at ? at[0] : left, RIGHT - w));
  // anchored: the rule sits on the point (the word stands on it)
  const y = at ? at[1] - size * 1.1 - 10 : top;
  const word = ease(frame, 0, PLACE_FADE);
  const line = ease(frame, 2, PLACE_FADE + 6);
  const rise = interpolate(word, [0, 1], [6, 0]);
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translateY(${rise}px)`}}>
      <div
        style={{
          fontFamily: fonts.sans,
          fontWeight: 700,
          fontSize: size,
          lineHeight: 1.1,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: ink,
          textShadow: paperHalo(mood, 10),
          whiteSpace: 'nowrap',
          opacity: word,
        }}
      >
        {text}
      </div>
      {rule ? (
        <div
          style={{
            marginTop: 8,
            height: 3,
            width: w * line,
            background: ink,
            boxShadow: paperHalo(mood, 6),
          }}
        />
      ) : null}
      {sub ? (
        <div
          style={{
            marginTop: 8,
            fontFamily: fonts.sans,
            fontWeight: 600,
            fontSize: 20,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: inkSub,
            textShadow: paperHalo(mood, 10),
            whiteSpace: 'nowrap',
            opacity: word,
          }}
        >
          {sub}
        </div>
      ) : null}
    </div>
  );
};
