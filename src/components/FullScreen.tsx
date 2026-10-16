import React, {useLayoutEffect, useRef} from 'react';
import {continueRender, delayRender, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {fonts, fontsReady} from '../fonts';
import {screenFor, type SectionRoomSceneProps} from '../scenes/SectionRoomScene';
import type {CastName, Mood} from '../theme';
import {ease} from './card';
import {drawScreen, screenKey, SCREEN_H, SCREEN_W, screenStateAt, type ScreenStep} from './screenKit';
import {overlayInk} from './sectionStyle';

export type FullScreenProps = {
  /** Whose phone (the scene's `ui` script for them, so it matches their phone and any detail box). */
  who?: CastName;
  /** Or a screen script of its own (times are seconds into the scene), when the beat is about a phone in general. */
  ui?: ScreenStep[];
  /** Clock on the screen when using `ui` (default: the scene's clock, else "9:47"). */
  clock?: string;
};

/** Frames it fades in (and out, see Explainer). */
export const FULLSCREEN_FADE = 10;
const BORDER = 4;
const TAB = 28;
/** The box fills the safe area from its top (y 288) down to just above the caption band (captions continue under a full-frame screen). */
const TOP = 288;
const BOTTOM = 1030;

/**
 * Full-frame screen (v0.8 § 6): the detail box enlarged to the whole safe area, holding a whole
 * phone screen from the phone-screen kit, over a `paper` scrim that hides the slice. For beats about
 * the phone itself (at most twice per video). Counts as the frame's one card; captions continue.
 */
export const FullScreen: React.FC<
  FullScreenProps & {
    mood?: Mood;
    scene: {props: Partial<SectionRoomSceneProps>; durationInFrames: number; offset: number};
  }
> = ({who, ui, clock, mood = 'day', scene}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const ref = useRef<HTMLCanvasElement>(null);
  const t = (frame + scene.offset) / fps;
  const state = who
    ? screenFor(scene.props, who, t)
    : ui
      ? screenStateAt(ui, t, {
          mood,
          clock: clock ?? scene.props.clock ?? '9:47',
          date: scene.props.date ?? 'Tuesday, October 14',
        })
      : undefined;
  const outerH = BOTTOM - TOP - TAB;
  const innerH = outerH - 2 * BORDER;
  const innerW = Math.round((innerH * SCREEN_W) / SCREEN_H);
  const outerW = innerW + 2 * BORDER;
  const key = state ? screenKey(state) : '';

  useLayoutEffect(() => {
    if (!state) return;
    const handle = delayRender('Drawing the full-frame screen');
    fontsReady().then(() => {
      const c = ref.current;
      const cx = c?.getContext('2d');
      if (c && cx) {
        const k = innerW / SCREEN_W;
        cx.setTransform(k, 0, 0, k, 0, 0);
        drawScreen(cx, state);
      }
      continueRender(handle);
    });
    // `key` captures everything the drawing depends on
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  if (!state) return null;
  const {ink, paper} = overlayInk(mood);
  const enter = ease(frame, 0, FULLSCREEN_FADE);
  const left = Math.round(540 - outerW / 2);
  return (
    <div style={{position: 'absolute', inset: 0, opacity: enter}}>
      <div style={{position: 'absolute', inset: 0, background: paper, opacity: 0.94}} />
      <div
        style={{
          position: 'absolute',
          left,
          top: TOP + TAB,
          transform: `translateY(${interpolate(enter, [0, 1], [8, 0])}px)`,
        }}
      >
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
          DETAIL
        </div>
        <div
          style={{
            width: outerW,
            height: outerH,
            boxSizing: 'border-box',
            border: `${BORDER}px solid ${ink}`,
            background: paper,
            boxShadow: '0 13px 32px rgba(0,0,0,0.25)',
            overflow: 'hidden',
          }}
        >
          <canvas ref={ref} width={innerW} height={innerH} style={{display: 'block', width: innerW, height: innerH}} />
        </div>
      </div>
    </div>
  );
};
