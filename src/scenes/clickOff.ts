import {interpolate} from 'remotion';

/**
 * Torch click-off at the loop point (style guide § 8): every orange glow (paths, dots, screens,
 * LEDs, the bleed on the plaster) drops to zero in 2 frames; plaster and stains stay; then a
 * 4-frame hold, and the video loops to its clean first frame.
 *  - `true`: the scene's last 6 frames (2 off + 4 held). Use it on a video's last scene.
 *  - a number: seconds into the scene when the 2-frame drop starts (held off from then on).
 */
export type ClickOff = boolean | number;

/** Frame at which the click-off starts, or undefined when it is off. */
export const clickOffFrame = (clickOff: ClickOff | undefined, durationInFrames: number, fps: number) =>
  clickOff === undefined || clickOff === false
    ? undefined
    : clickOff === true
      ? Math.max(0, durationInFrames - 6)
      : Math.round(clickOff * fps);

/** 1 while the system's light is on, 0 once clicked off (over 2 frames). Multiply every glow by it. */
export const clickOffLevel = (frame: number, at: number | undefined) =>
  at === undefined
    ? 1
    : interpolate(frame, [at, at + 2], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
