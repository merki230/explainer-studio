import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {fonts} from '../fonts';
import {FADE, theme} from '../theme';
import {cardStyle, ease} from './card';

/** What a label shows. Two labels with the same text, title and dot are the same label. */
export type ChipText = {text: string; title?: string; color?: string};

export type ChipProps = ChipText & {
  /** Distance from the top of the frame in px. */
  top?: number;
  /**
   * Seconds into the scene before the label enters (e.g. 1.0 on a video's first scene: no text in
   * the first second). With `previous`, it is when the changed text starts to swap.
   */
  delay?: number;
  /** Play the slide/fade entry. Ignored when `previous` is set (the card is already there). */
  animate?: boolean;
  /**
   * The label on screen before this one (the previous scene's). The card stays put and only the
   * lines that differ swap: the old text fades out over FADE/2 frames, then the new one fades in
   * over FADE/2, so two different texts are never drawn over each other.
   */
  previous?: ChipText;
  /** Frame (in this element's time) at which the whole label fades out over FADE frames (next scene has none). */
  exitAt?: number;
  /** Frames the exit takes (default FADE; 2 for the click-off at the loop point). */
  exitFrames?: number;
};

const monoLine = (text: string, color?: string) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      fontFamily: fonts.mono,
      fontWeight: 500,
      fontSize: 20,
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
      color: theme.inkMuted,
    }}
  >
    {color ? <span style={{width: 10, height: 10, borderRadius: 5, background: color}} /> : null}
    {text}
  </span>
);

const serifLine = (text: string) => (
  <span
    style={{
      fontFamily: fonts.serif,
      fontWeight: 600,
      fontSize: 30,
      color: theme.inkLabel,
      letterSpacing: '0.02em',
    }}
  >
    {text}
  </span>
);

/** Line 1 (serif) and line 2 (mono, only with a title), each with a key that says when it changed. */
const lines = (c: ChipText) => ({
  l1: {key: c.title ?? c.text, node: serifLine(c.title ?? c.text)},
  l2: c.title ? {key: `${c.text}|${c.color ?? ''}`, node: monoLine(c.text, c.color)} : null,
});

type Line = {key: string; node: React.ReactNode} | null;

/** One grid cell holding the old and the new line on top of each other, so the card keeps its size mid-swap. */
const SwapCell: React.FC<{from: Line; to: Line; out: number; in: number}> = ({from, to, out, in: inn}) => {
  if (!from && !to) return null;
  if (from?.key === to?.key) return <>{to?.node}</>;
  return (
    <span style={{display: 'grid', justifyItems: 'center'}}>
      {from && out > 0 ? <span style={{gridArea: '1 / 1', opacity: out}}>{from.node}</span> : null}
      {to ? <span style={{gridArea: '1 / 1', opacity: inn}}>{to.node}</span> : null}
    </span>
  );
};

/**
 * Exhibit label: a small paper card pinned near the top, inside the platform safe zone.
 * The Explainer draws it outside the scene crossfade, so across a cut it is one element:
 * identical labels hold still, and a label that changes swaps only its changed text.
 */
export const Chip: React.FC<ChipProps> = ({
  text,
  title,
  color,
  top = 340,
  delay = 0,
  animate = true,
  previous,
  exitAt,
  exitFrames = FADE,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const start = Math.round(delay * fps);
  const enter = previous || !animate ? 1 : spring({frame: frame - 4 - start, fps, config: {damping: 20}});
  const exit = exitAt === undefined ? 1 : 1 - ease(frame, exitAt, exitAt + exitFrames);

  const now = lines({text, title, color});
  const before = previous ? lines(previous) : now;
  const out = 1 - ease(frame, start, start + FADE / 2);
  const inn = ease(frame, start + FADE / 2, start + FADE);

  return (
    <div
      style={{
        position: 'absolute',
        top,
        left: 120,
        right: 1080 - 888,
        display: 'flex',
        justifyContent: 'center',
        opacity: enter * exit,
        transform: `translateY(${interpolate(enter, [0, 1], [-10, 0])}px)`,
      }}
    >
      <div
        style={{
          ...cardStyle,
          display: 'inline-grid',
          gap: 3,
          textAlign: 'center',
          padding: '16px 32px 18px',
          maxWidth: 768,
        }}
      >
        <SwapCell from={before.l1} to={now.l1} out={out} in={inn} />
        <SwapCell from={before.l2} to={now.l2} out={out} in={inn} />
      </div>
    </div>
  );
};
