import React, {useLayoutEffect, useRef} from 'react';
import {continueRender, delayRender, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {fonts, fontsReady} from '../fonts';
import {headBoxOnScreen, headTopOnScreen, phoneOnScreen, screenFor, type SectionRoomSceneProps} from '../scenes/SectionRoomScene';
import type {CastName, Mood} from '../theme';
import {ease} from './card';
import {drawScreen, focusRect, screenKey, SCREEN_H, SCREEN_W} from './screenKit';
import {LEFT, overlayInk, RIGHT} from './sectionStyle';

export type DetailBoxProps = {
  /** Whose phone it magnifies (the scene's `ui` script for them drives what it shows). */
  who: CastName;
  /** 'auto' (default): the part of the screen that matters (the field, the ad); 'full': the whole screen. */
  crop?: 'auto' | 'full';
  /** Inner width in px (default 336; the box is 344 wide with its border, inside the guide's 324–360). */
  size?: number;
  /** Which margin (default: the holder's side). */
  side?: 'left' | 'right';
  /** Top edge in px (default: 60 px above the holder's head, kept inside y 300–1248). */
  top?: number;
  /** Left edge in px, overriding `side` (default: x 120 or right edge x 888). Covers only; videos keep the margins. */
  left?: number;
  /** Draw the 2 px leader to the phone (default true). */
  leader?: boolean;
};

/** Frames the box takes to fade in (and out, see Explainer). */
export const DETAIL_FADE = 10;
const BORDER = 4;

/**
 * The detail box (v0.8 § 6): how screens are read. A square-cornered frame (4 px `ink` border,
 * `paper` fill, a soft shadow) with a DETAIL tab, holding a flat crop of the phone's screen drawn
 * by the phone-screen kit from the same state as the phone's own screen texture, so they match.
 * Sits on the holder's side (left edge x 120 or right edge x 888) above their head, joined to the
 * phone by a 2 px `ink` leader: straight down at the phone's x when the phone is under the box
 * (when that would graze the holder's head, down beside the phone, then a short diagonal into it),
 * else an elbow that drops from the box (on the side away from the head) and runs across to it.
 * In over 10 frames (opacity, 8 px rise). Only in a `section-room` scene.
 */
export const DetailBox: React.FC<
  DetailBoxProps & {
    mood?: Mood;
    scene: {props: Partial<SectionRoomSceneProps>; durationInFrames: number; offset: number};
  }
> = ({who, crop = 'auto', size = 336, side, top, left: leftAt, leader = true, mood = 'day', scene}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const ref = useRef<HTMLCanvasElement>(null);
  const sceneFrame = frame + scene.offset;
  const state = screenFor(scene.props, who, sceneFrame / fps);
  const rect: [number, number, number, number] =
    !state || crop === 'full' ? [0, 0, SCREEN_W, SCREEN_H] : focusRect(state);
  const innerW = size;
  const innerH = Math.round((size * rect[3]) / rect[2]);
  const key = state ? `${screenKey(state)}|${rect.join(',')}|${innerW}` : '';

  useLayoutEffect(() => {
    if (!state) return;
    const handle = delayRender('Drawing the detail box');
    fontsReady().then(() => {
      const c = ref.current;
      const cx = c?.getContext('2d');
      if (c && cx) {
        cx.setTransform(1, 0, 0, 1, 0, 0);
        cx.clearRect(0, 0, c.width, c.height);
        const k = innerW / rect[2];
        cx.setTransform(k, 0, 0, k, -rect[0] * k, -rect[1] * k);
        drawScreen(cx, state);
      }
      continueRender(handle);
    });
    // `key` captures everything the drawing depends on
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const o = {frame: sceneFrame, fps, durationInFrames: scene.durationInFrames};
  const phone = phoneOnScreen(scene.props, who, o);
  const head = headTopOnScreen(scene.props, who, o);
  const headBox = headBoxOnScreen(scene.props, who, o);
  if (!state || !phone || !head || !headBox) return null;

  const {ink, paper} = overlayInk(mood);
  const cast = scene.props.cast ?? ['friend', 'you'];
  const onLeft = (side ?? (cast.indexOf(who) === 0 ? 'left' : 'right')) === 'left';
  const outerW = innerW + 2 * BORDER;
  const outerH = innerH + 2 * BORDER;
  const left = leftAt ?? (onLeft ? LEFT : RIGHT - outerW);
  // above the head, inside the safe zone (the tab needs ≈ 28 px above the box)
  const boxTop = top ?? Math.max(328, Math.min(1248 - outerH, head[1] - 60 - outerH));
  const enter = ease(frame, 0, DETAIL_FADE);
  const rise = interpolate(enter, [0, 1], [8, 0]);
  // Leader. When the phone is under the box, it drops straight down from the box at the phone's x
  // and stops 12 px short of it (an elbow from the box's corner read as tied to whoever sits
  // between). Otherwise: from the box's bottom edge down to the phone's height, then across to the
  // phone, dropping on whichever side of the box keeps it clear of the holder's head.
  const by = boxTop + outerH;
  const under = phone[0] >= left + 12 && phone[0] <= left + outerW - 12;
  let points: string;
  // A straight drop that would pass within CLEAR px of the holder's head (it runs down past the
  // head to a phone held below it) starts on the far side of the phone instead, then ends in a short
  // 45° diagonal into the phone, stopping 12 px short as before.
  const CLEAR = 24;
  const [hx0, hx1, hy0, hy1] = headBox;
  const nearHead =
    phone[0] > hx0 - CLEAR && phone[0] < hx1 + CLEAR && hy1 > by && hy0 < phone[1];
  if (under && nearHead) {
    const away = (hx0 + hx1) / 2 > phone[0] ? -1 : 1;
    const edge = away < 0 ? hx0 - CLEAR : hx1 + CLEAR;
    const pick = away < 0 ? Math.min(phone[0] - 34, edge) : Math.max(phone[0] + 34, edge);
    const dx = Math.max(left + 12, Math.min(left + outerW - 12, pick));
    const run = Math.abs(dx - phone[0]);
    const knee = Math.max(by, phone[1] - run);
    const len = Math.hypot(phone[0] - dx, phone[1] - knee);
    const k = len > 12 ? (len - 12) / len : 0;
    const ex = dx + (phone[0] - dx) * k;
    const ey = knee + (phone[1] - knee) * k;
    points = `${dx},${by} ${dx},${knee} ${ex},${ey}`;
  } else if (under) {
    points = `${phone[0]},${by} ${phone[0]},${Math.max(by, phone[1] - 12)}`;
  } else {
    const sides = [left + 28, left + outerW - 28];
    const lx = sides.reduce((best, x) => (Math.abs(x - head[0]) > Math.abs(best - head[0]) ? x : best));
    const px = phone[0] + (lx < phone[0] ? -12 : 12);
    points = `${lx},${by} ${lx},${phone[1]} ${px},${phone[1]}`;
  }

  return (
    <div style={{position: 'absolute', inset: 0, opacity: enter}}>
      {leader ? (
        <svg width={width} height={height} style={{position: 'absolute', inset: 0}}>
          <polyline points={points} fill="none" stroke={ink} strokeWidth={2} strokeLinejoin="miter" />
        </svg>
      ) : null}
      <div style={{position: 'absolute', left, top: boxTop, transform: `translateY(${rise}px)`}}>
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
            borderRadius: 0,
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
