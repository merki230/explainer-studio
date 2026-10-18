import React, {useLayoutEffect, useRef} from 'react';
import {continueRender, delayRender, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {fonts, fontsReady} from '../fonts';
import {
  headBoxOnScreen,
  headTopOnScreen,
  phoneOnScreen,
  screenFor,
  type SectionRoomSceneProps,
} from '../scenes/SectionRoomScene';
import type {CastName, Mood} from '../theme';
import {ease} from './card';
import {drawScreen, focusRect, screenKey, SCREEN_H, SCREEN_W} from './screenKit';
import {LEFT, overlayInk, RIGHT} from './sectionStyle';
import {drawCluster} from './dashboardKit';
import {carHeadBoxOnScreen, clusterOnScreen, type CarSliceSceneProps} from '../scenes/CarSliceScene';
import {anchorOnScreen} from './anchors';
import {MOODS} from '../theme';
import {StreetBox} from './streetBoxes';

export type DetailBoxProps = {
  /** Whose phone it magnifies (the scene's `ui` script for them drives what it shows); for 'dashboard', the driver. Default 'you'. */
  who?: CastName;
  /**
   * What it shows: 'phone' (default: the holder's screen, `section-room` only) or 'dashboard' (the
   * instrument cluster of a `car-slice`: speed, a trip timer counting on, the tire-pressure light, off or
   * lit in warning yellow from the scene's `warningAt`).
   */
  content?: 'phone' | 'dashboard' | 'keypad' | 'laptop' | 'usage' | 'register';
  /** 'usage' (street-slice): seconds after the box enters when the "Possible leak" banner gives way to the hourly page (default 1.2; 0 = the page at once). */
  pageAt?: number;
  /** 'usage': seconds after the box enters when the hourly bars start drawing (default `pageAt` + 0.3), and how long (default 1.2). */
  barsAt?: number;
  barsFor?: number;
  /** 'register': the odometer digits (default '01462', 🎭). */
  reading?: string;
  /** 'keypad': the floor typed (default '9', 🎭 illustrative). */
  floor?: string;
  /** 'keypad': the car the answer screen names (default 'C', 🎭 illustrative). */
  car?: string;
  /** 'keypad': seconds after the box enters when the screen turns to the answer (default 1.5). */
  answerAt?: number;
  /** 'dashboard': force the tire light on or off (default: the scene's `warningAt`). */
  warning?: boolean;
  /** 'dashboard': the trip timer's value at the scene's start, seconds (default 760, "12:40"); it counts on. */
  trip?: number;
  /** 'dashboard': the speed shown, mph (default 38). */
  speed?: number;
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
type SceneCtx = {props: Partial<SectionRoomSceneProps>; durationInFrames: number; offset: number; name?: string};

export const DetailBox: React.FC<DetailBoxProps & {mood?: Mood; scene: SceneCtx}> = (p) =>
  p.content === 'laptop' || p.content === 'usage' || p.content === 'register' ? (
    <StreetBox {...p} content={p.content} scene={{...p.scene, props: p.scene.props as Record<string, unknown>}} />
  ) : p.content === 'dashboard' ? (
    <DashboardBox {...p} />
  ) : p.content === 'keypad' ? (
    <KeypadBox {...p} />
  ) : (
    <PhoneBox {...p} />
  );

const PhoneBox: React.FC<
  DetailBoxProps & {
    mood?: Mood;
    scene: SceneCtx;
  }
> = ({who = 'you', crop = 'auto', size = 336, side, top, left: leftAt, leader = true, mood = 'day', scene}) => {
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
  const nearHead = phone[0] > hx0 - CLEAR && phone[0] < hx1 + CLEAR && hy1 > by && hy0 < phone[1];
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

/** The tab and frame shared by both contents. */
const Frame: React.FC<{
  left: number;
  top: number;
  w: number;
  h: number;
  ink: string;
  paper: string;
  rise: number;
  children: React.ReactNode;
}> = ({left, top, w, h, ink, paper, rise, children}) => (
  <div style={{position: 'absolute', left, top, transform: `translateY(${rise}px)`}}>
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
        width: w,
        height: h,
        boxSizing: 'border-box',
        border: `${BORDER}px solid ${ink}`,
        background: paper,
        boxShadow: '0 13px 32px rgba(0,0,0,0.25)',
        overflow: 'hidden',
      }}
    >
      {children}
    </div>
  </div>
);

/**
 * The dashboard detail box (No. 002): the car's instrument cluster as a flat 2D crop (the same drawing
 * as the cluster in the car), read like a phone screen; a 2 px ink elbow leader to the cluster.
 * Only in a `car-slice` scene.
 */
const DashboardBox: React.FC<DetailBoxProps & {mood?: Mood; scene: SceneCtx}> = ({
  who = 'you',
  size = 360,
  side,
  top,
  left: leftAt,
  leader = true,
  warning,
  trip = 760,
  speed = 38,
  mood = 'day',
  scene,
}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const ref = useRef<HTMLCanvasElement>(null);
  const sceneFrame = frame + scene.offset;
  const t = sceneFrame / fps;
  const carProps = scene.props as Partial<CarSliceSceneProps>;
  const warnAt = carProps.warningAt ?? null;
  const on = warning ?? (warnAt !== null && t >= warnAt);
  const secs = Math.floor(trip + t);
  const tripText = `TRIP ${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`;
  const innerW = size;
  const innerH = Math.round(size * 0.58);
  const key = `${on}|${tripText}|${speed}|${innerW}`;
  useLayoutEffect(() => {
    const handle = delayRender('Drawing the dashboard box');
    fontsReady().then(() => {
      const cx = ref.current?.getContext('2d');
      if (cx) drawCluster(cx, innerW, innerH, {warning: on, speed, trip: tripText});
      continueRender(handle);
    });
    // `key` captures everything the drawing depends on
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  const o = {frame: sceneFrame, fps, durationInFrames: scene.durationInFrames};
  const target = clusterOnScreen(carProps, o);
  const headBox = carHeadBoxOnScreen(carProps, who, o);
  const {ink, paper} = overlayInk(mood);
  const outerW = innerW + 2 * BORDER;
  const outerH = innerH + 2 * BORDER;
  const onLeft = (side ?? (target[0] > width / 2 ? 'left' : 'right')) === 'left';
  const left = leftAt ?? (onLeft ? LEFT : RIGHT - outerW);
  // above the head (or the cluster), inside the safe zone
  const above = Math.min(target[1], headBox ? headBox[2] : target[1]);
  const boxTop = top ?? Math.max(328, Math.min(1248 - outerH, above - 70 - outerH));
  const enter = ease(frame, 0, DETAIL_FADE);
  const rise = interpolate(enter, [0, 1], [8, 0]);
  const by = boxTop + outerH;
  const lx = onLeft ? left + outerW - 28 : left + 28;
  const px = target[0] + (lx < target[0] ? -12 : 12);
  const points = `${lx},${by} ${lx},${target[1]} ${px},${target[1]}`;
  return (
    <div style={{position: 'absolute', inset: 0, opacity: enter}}>
      {leader ? (
        <svg width={width} height={height} style={{position: 'absolute', inset: 0}}>
          <polyline points={points} fill="none" stroke={ink} strokeWidth={2} strokeLinejoin="miter" />
        </svg>
      ) : null}
      <Frame left={left} top={boxTop} w={outerW} h={outerH} ink={ink} paper={paper} rise={rise}>
        <canvas ref={ref} width={innerW} height={innerH} style={{display: 'block', width: innerW, height: innerH}} />
      </Frame>
    </div>
  );
};

/**
 * The keypad screen as its user sees it (No. 003, `hotel-lobby`): a light, generic destination-dispatch
 * UI. First the entry (a "Select your floor" prompt, the floor typed in the field, a 3 × 4 digit grid
 * with that key pressed), then the answer (the floor, "Go to", a large `ink` car letter with an arrow).
 * No maker's look; text ≥ 28 px. A 2 px `ink` elbow leader to the keypad's screen.
 */
export const drawKeypad = (
  cx: CanvasRenderingContext2D,
  w: number,
  h: number,
  o: {floor: string; car: string; answer: boolean; ink: string; sub: string},
) => {
  const ui = MOODS.day.ui;
  cx.setTransform(1, 0, 0, 1, 0, 0);
  cx.fillStyle = ui;
  cx.fillRect(0, 0, w, h);
  const pad = 20;
  cx.textBaseline = 'alphabetic';
  if (!o.answer) {
    cx.fillStyle = o.sub;
    cx.font = `600 28px ${fonts.sans}`;
    cx.textAlign = 'left';
    cx.fillText('Select your floor', pad, 46);
    // the field with the typed floor and a cursor
    const fy = 64;
    const fh = 84;
    cx.strokeStyle = o.ink;
    cx.lineWidth = 3;
    cx.strokeRect(pad + 1.5, fy + 1.5, w - 2 * pad - 3, fh - 3);
    cx.fillStyle = o.ink;
    cx.font = `700 64px ${fonts.sans}`;
    cx.fillText(o.floor, pad + 20, fy + 64);
    const tw = cx.measureText(o.floor).width;
    cx.fillRect(pad + 26 + tw, fy + 16, 4, fh - 32);
    // the digit grid
    const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', ''];
    const gy = fy + fh + 16;
    const gap = 8;
    const kw = (w - 2 * pad - 2 * gap) / 3;
    const kh = (h - gy - pad - 3 * gap) / 4;
    cx.textAlign = 'center';
    cx.font = `700 30px ${fonts.sans}`;
    keys.forEach((k, i) => {
      if (!k) return;
      const x = pad + (i % 3) * (kw + gap);
      const y = gy + Math.floor(i / 3) * (kh + gap);
      const on = k === o.floor.slice(-1);
      cx.fillStyle = on ? o.ink : '#e6e7ea';
      cx.fillRect(x, y, kw, kh);
      cx.fillStyle = on ? ui : o.ink;
      cx.fillText(k, x + kw / 2, y + kh / 2 + 11);
    });
    return;
  }
  cx.textAlign = 'left';
  cx.fillStyle = o.sub;
  cx.font = `600 28px ${fonts.sans}`;
  cx.fillText(`Floor ${o.floor}`, pad, 46);
  cx.fillStyle = o.ink;
  cx.font = `700 34px ${fonts.sans}`;
  cx.fillText('Go to elevator', pad, 96);
  // the letter in a square, an arrow pointing to it
  const s = Math.min(w - 2 * pad - 110, h - 140);
  const bx = w - pad - s;
  const by = 120;
  cx.strokeStyle = o.ink;
  cx.lineWidth = 6;
  cx.strokeRect(bx + 3, by + 3, s - 6, s - 6);
  cx.textAlign = 'center';
  cx.font = `800 ${Math.round(s * 0.78)}px ${fonts.display}`;
  cx.fillText(o.car, bx + s / 2, by + s * 0.79);
  const ay = by + s / 2;
  cx.lineWidth = 10;
  cx.beginPath();
  cx.moveTo(pad + 4, ay);
  cx.lineTo(bx - 20, ay);
  cx.stroke();
  cx.beginPath();
  cx.moveTo(bx - 44, ay - 26);
  cx.lineTo(bx - 16, ay);
  cx.lineTo(bx - 44, ay + 26);
  cx.stroke();
};

const KeypadBox: React.FC<DetailBoxProps & {mood?: Mood; scene: SceneCtx}> = ({
  size = 336,
  side,
  top,
  left: leftAt,
  leader = true,
  floor = '9',
  car = 'C',
  answerAt = 1.5,
  mood = 'day',
  scene,
}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const ref = useRef<HTMLCanvasElement>(null);
  const answer = frame / fps >= answerAt;
  const innerW = size;
  const innerH = Math.round(size * 1.18);
  const {ink, paper} = overlayInk(mood);
  const key = `${answer}|${floor}|${car}|${innerW}`;
  useLayoutEffect(() => {
    const handle = delayRender('Drawing the keypad box');
    fontsReady().then(() => {
      const cx = ref.current?.getContext('2d');
      // the screen is a Day UI in both moods (a lit screen), so its ink is the Day ink
      if (cx) drawKeypad(cx, innerW, innerH, {floor, car, answer, ink: MOODS.day.ink, sub: MOODS.day.inkSub});
      continueRender(handle);
    });
    // `key` captures everything the drawing depends on
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  const target = anchorOnScreen({...scene, props: scene.props as Record<string, unknown>}, 'keypad', frame, fps) ?? [
    width / 2,
    height / 2,
  ];
  const outerW = innerW + 2 * BORDER;
  const outerH = innerH + 2 * BORDER;
  const onLeft = (side ?? (target[0] > width / 2 ? 'left' : 'right')) === 'left';
  const left = leftAt ?? (onLeft ? LEFT : RIGHT - outerW);
  const boxTop = top ?? Math.max(328, Math.min(1248 - outerH, target[1] - 160 - outerH));
  const enter = ease(frame, 0, DETAIL_FADE);
  const rise = interpolate(enter, [0, 1], [8, 0]);
  const by = boxTop + outerH;
  const lx = onLeft ? left + outerW - 28 : left + 28;
  const px = target[0] + (lx < target[0] ? -12 : 12);
  const points = `${lx},${by} ${lx},${target[1]} ${px},${target[1]}`;
  return (
    <div style={{position: 'absolute', inset: 0, opacity: enter}}>
      {leader ? (
        <svg width={width} height={height} style={{position: 'absolute', inset: 0}}>
          <polyline points={points} fill="none" stroke={ink} strokeWidth={2} strokeLinejoin="miter" />
        </svg>
      ) : null}
      <Frame left={left} top={boxTop} w={outerW} h={outerH} ink={ink} paper={paper} rise={rise}>
        <canvas ref={ref} width={innerW} height={innerH} style={{display: 'block', width: innerW, height: innerH}} />
      </Frame>
    </div>
  );
};
