import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {fonts} from '../fonts';
import type {Mood} from '../theme';
import {ATTRIBUTION_FADE, attributionStyle} from './Attribution';
import {ease} from './card';
import {LEFT, overlayInk, paperHalo, RIGHT} from './sectionStyle';

export type StatementProps = {
  /** The key phrase exactly as said, sentence case, with a full stop: "One household." ≤ 4 words, ≤ 2 lines. */
  text: string;
  /**
   * 'low' (default): the block's bottom edge at y 1000, growing upward. 'high': its top edge at
   * y 500 (when the subject fills the lower focal band).
   */
  place?: 'low' | 'high';
  /** Optional attribution line under the card (who + year, e.g. "FTC staff report, 2017"). */
  attribution?: string;
};

/** Frames the statement card fades in (and out, see Explainer). Style guide § 6. */
export const STATEMENT_FADE = 12;

/**
 * Statement card (v0.8 § 6): the key phrase set large over the scene, Archivo 800 88 px / 0.95,
 * −0.03em, `ink` with a 32 px `paper` halo, no box, left-aligned at x 120. Calm: opacity over
 * 12 frames with a 6 px rise. The attribution line sits 24 px under its last line and enters
 * 6 frames later. Captions are off while it is up (Explainer).
 */
export const Statement: React.FC<StatementProps & {mood?: Mood}> = ({
  text,
  place = 'low',
  attribution,
  mood = 'day',
}) => {
  const frame = useCurrentFrame();
  const enter = ease(frame, 0, STATEMENT_FADE);
  const rise = interpolate(enter, [0, 1], [6, 0]);
  const low = place === 'low';
  const words = (
    <div
      style={{
        fontFamily: fonts.display,
        fontWeight: 800,
        fontSize: 88,
        lineHeight: 0.95,
        letterSpacing: '-0.03em',
        color: overlayInk(mood).ink,
        textShadow: paperHalo(mood, 32),
        textAlign: 'left',
      }}
    >
      {text}
    </div>
  );
  const attr = attribution ? (
    <div style={{...attributionStyle(mood), opacity: ease(frame, 6, 6 + ATTRIBUTION_FADE)}}>{attribution}</div>
  ) : null;
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: LEFT,
          maxWidth: RIGHT - LEFT,
          ...(low ? {bottom: 1920 - 1000} : {top: 500}),
          opacity: enter,
          transform: `translateY(${rise}px)`,
        }}
      >
        {words}
        {!low && attr ? <div style={{marginTop: 24}}>{attr}</div> : null}
      </div>
      {low && attr ? <div style={{position: 'absolute', left: LEFT, top: 1024}}>{attr}</div> : null}
    </>
  );
};
