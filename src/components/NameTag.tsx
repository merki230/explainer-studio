import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {fonts} from '../fonts';
import {headTopOnScreen, type SectionRoomSceneProps} from '../scenes/SectionRoomScene';
import {carHeadTopOnScreen, type CarSliceSceneProps} from '../scenes/CarSliceScene';
import {CAST, type CastName, type Mood} from '../theme';
import {ease} from './card';
import {LEFT, overlayInk, paperHalo, RIGHT} from './sectionStyle';

export type NameTagProps = {
  /** Who it labels (their seat and colour come from the scene). */
  who: CastName;
  /** The role shown, ≤ 12 characters (default: YOU, FRIEND, MOM). Never a personal name. */
  label?: string;
  /** Which margin the tag sits in (default: left for the left seat, right for the right seat). */
  side?: 'left' | 'right';
  /** How far above the head the tag sits, px (default 120). */
  rise?: number;
};

/** Frames the tag fades in (and out, see Explainer). */
export const TAG_FADE = 10;
const SQUARE = 26;
const GAP = 12;
const SIZE = 26;
/** Inter 700 uppercase at 26 px with 0.08em tracking: ≈ 0.72 em a letter plus the tracking. */
const textWidth = (s: string) => s.length * SIZE * (0.72 + 0.08);

/**
 * Name tag as a drawing label (v0.8 § 6): a 26 px square in the person's top colour (3 px `paper`
 * outline), the role in Inter 700 26 px uppercase, `ink`, no fill; a 2 px `ink` leader from the top
 * of the head straight up, then across (one right angle) to the tag in the margin (left tags start
 * at x 120, right tags end at x 888). It follows the head as the camera moves. Only in a
 * `section-room` scene (it reads the scene's camera from `scene`).
 */
export const NameTag: React.FC<
  NameTagProps & {
    mood?: Mood;
    /** The scene's props, its length, and this overlay's start within it (set by Explainer). */
    scene: {props: Partial<SectionRoomSceneProps>; durationInFrames: number; offset: number; name?: string};
  }
> = ({who, label, side, rise = 120, mood = 'day', scene}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const when = {frame: frame + scene.offset, fps, durationInFrames: scene.durationInFrames};
  const car = scene.name === 'car-slice';
  const head = car ? carHeadTopOnScreen(scene.props as Partial<CarSliceSceneProps>, who, when) : headTopOnScreen(scene.props, who, when);
  if (!head) return null;
  const {ink, paper} = overlayInk(mood);
  const text = (label ?? who).toUpperCase();
  const cast = scene.props.cast ?? ['friend', 'you'];
  const onLeft = (side ?? (car ? (head[0] < 540 ? 'left' : 'right') : cast.indexOf(who) === 0 ? 'left' : 'right')) === 'left';
  const w = SQUARE + GAP + textWidth(text);
  const tagLeft = onLeft ? LEFT : RIGHT - w;
  const [hx, hy] = head;
  const ty = Math.max(470, hy - rise);
  // The leader runs up from the head, then across to 10 px short of the tag. When the head is
  // right under the tag, it just runs straight up to 10 px below it.
  const under = hx >= tagLeft - 14 && hx <= tagLeft + w + 14;
  const lx = onLeft ? tagLeft + w + 10 : tagLeft - 10;
  const points = under ? `${hx},${hy - 4} ${hx},${ty + SIZE / 2 + 10}` : `${hx},${hy - 4} ${hx},${ty} ${lx},${ty}`;
  const o = ease(frame, 0, TAG_FADE);

  return (
    <div style={{position: 'absolute', inset: 0, opacity: o}}>
      <svg width={width} height={height} style={{position: 'absolute', inset: 0}}>
        <polyline points={points} fill="none" stroke={ink} strokeWidth={2} strokeLinejoin="miter" />
      </svg>
      <div
        style={{
          position: 'absolute',
          left: tagLeft,
          top: ty,
          transform: 'translateY(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: GAP,
        }}
      >
        <div
          style={{
            width: SQUARE,
            height: SQUARE,
            boxSizing: 'border-box',
            background: CAST[who].top,
            outline: `3px solid ${paper}`,
            flex: 'none',
          }}
        />
        <div
          style={{
            fontFamily: fonts.sans,
            fontWeight: 700,
            fontSize: SIZE,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: ink,
            textShadow: paperHalo(mood, 10),
            whiteSpace: 'nowrap',
            lineHeight: 1,
          }}
        >
          {text}
        </div>
      </div>
    </div>
  );
};
