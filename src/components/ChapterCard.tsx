import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {fonts} from '../fonts';
import {CARD_FRAMES, type ChapterCardFrames} from '../timeline';
import type {Mood} from '../theme';
import {ease} from './card';
import {cardText} from './chapterCardLayout';
import {useLayout} from './layout';
import {overlayInk} from './sectionStyle';

/** Scrim (the mood's `paper`) opacity over the scene (style guide § 11.5.1: 72%; raise to 80% if a still fails 4.5:1). */
export const CARD_SCRIM = 0.72;
/** Gaussian blur of the scene behind the card, px (σ at 1920 × 1080). */
export const CARD_BLUR = 16;
/** Scale added to the blurred scene layer at full ramp, so its blurred edges stay off screen (≈ 2.4σ of 16 px at 1920 px wide). */
export const CARD_BLUR_SCALE = 0.04;
/** The block is centred on this y; the label's box is 28 px, the gap to the question 20 px. */
const CENTER_Y = 500;
const LABEL = 28;
const GAP = 20;

/** 0 → 1 → 0: how far the scrim and blur are in at `frame`, for one card (cubic in-out, 12 frames in, 15 out). */
export const cardRamp = (frame: number, c: ChapterCardFrames) =>
  ease(frame, c.rampIn, c.rampIn + CARD_FRAMES.rampLen) - ease(frame, c.clearStart, c.clearEnd);

/**
 * The silent full-frame chapter card (style guide § 11.5.1): a `paper` scrim over the scene (the scene's blur is the
 * Explainer's `SceneLayer`), then the label `CHAPTER 2` (Mono 700 28 px, 0.18em) and the question (Archivo 800 80 px,
 * −0.02em), both `ink`, left at x 144, the block centred on y 500. Nothing else on it. Pure function of the frame.
 */
export const ChapterCard: React.FC<{card: ChapterCardFrames; mood: Mood}> = ({card, mood}) => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const {ink, paper} = overlayInk(mood);
  if (frame < card.rampIn || frame >= card.clearEnd) return null;
  const text = cardText(card.question) ?? {lines: card.question.split('\n'), size: 72};
  const out = 1 - ease(frame, card.outStart, card.outStart + CARD_FRAMES.outLen);
  const label = ease(frame, card.labelIn, card.labelIn + CARD_FRAMES.inLen);
  const question = ease(frame, card.questionIn, card.questionIn + CARD_FRAMES.inLen);
  const height = LABEL + GAP + text.lines.length * text.size;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: paper, opacity: CARD_SCRIM * cardRamp(frame, card)}} />
      <div style={{position: 'absolute', left: L.left, top: CENTER_Y - height / 2}}>
        <div
          style={{
            fontFamily: fonts.mono,
            fontWeight: 700,
            fontSize: LABEL,
            lineHeight: `${LABEL}px`,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: ink,
            opacity: label * out,
            transform: `translateY(${(1 - label) * 6}px)`,
          }}
        >
          Chapter {card.chapter}
        </div>
        <div
          style={{
            marginTop: GAP,
            fontFamily: fonts.display,
            fontWeight: 800,
            fontSize: text.size,
            lineHeight: 1,
            letterSpacing: '-0.02em',
            color: ink,
            whiteSpace: 'nowrap',
            opacity: question * out,
            transform: `translateY(${(1 - question) * 6}px)`,
          }}
        >
          {text.lines.map((l, i) => (
            <div key={i}>{l}</div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
