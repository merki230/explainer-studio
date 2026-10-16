import React, {useLayoutEffect, useRef} from 'react';
import {continueRender, delayRender} from 'remotion';
import {fontsReady} from '../fonts';
import {drawScreen, screenKey, SCREEN_H, SCREEN_W, type ScreenState} from './screenKit';

/** The screen drawn to the frame's full height (1008 × 1920, centred, black at the sides): nothing cropped. */
const K = 1920 / SCREEN_H;
const W0 = Math.round(SCREEN_W * K);
const H0 = 1920;

/**
 * The bookends' phone screen (owner decision, the loop): a full-frame phone screen from the screen
 * kit that shrinks onto the phone in the slice as the camera pulls out (`e` 0 → 1), or grows from it
 * as the camera pushes in (`e` 1 → 0). Black behind; `bright` 0–1 wakes or locks the screen
 * (0 = black). Drawn by the same function as the phone's own texture and the detail box.
 */
export const ScreenBookend: React.FC<{
  state: ScreenState | undefined;
  /** 0: the screen fills the frame; 1: it sits on the phone (`phone`, px) at its size (`phoneH`, px tall). */
  e: number;
  bright: number;
  phone: [number, number];
  phoneH: number;
}> = ({state, e, bright, phone, phoneH}) => {
  const ref = useRef<HTMLCanvasElement>(null);
  // the full-frame layout (nothing readable above y 520, text at x ≤ 888) while the screen fills
  // the frame; it eases back to the phone's own layout as the screen shrinks (e 0.3 → 0.7), so the
  // hand-over to the 3D phone's screen matches
  const full = Math.round(Math.max(0, Math.min(1, (0.7 - e) / 0.4)) * 50) / 50;
  const key = state ? `${screenKey(state)}|${full}` : 'off';
  useLayoutEffect(() => {
    const handle = delayRender('Drawing the bookend screen');
    fontsReady().then(() => {
      const c = ref.current;
      const cx = c?.getContext('2d');
      if (c && cx) {
        cx.setTransform(1, 0, 0, 1, 0, 0);
        cx.fillStyle = '#000000';
        cx.fillRect(0, 0, c.width, c.height);
        if (state) {
          cx.setTransform(K, 0, 0, K, 0, 0);
          drawScreen(cx, state, full);
        }
      }
      continueRender(handle);
    });
    // `key` captures everything the drawing depends on
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // a steady dolly: the size changes on a log scale
  const h = Math.exp(Math.log(H0) + (Math.log(Math.max(4, phoneH)) - Math.log(H0)) * e);
  const scale = h / H0;
  const cx = 540 + (phone[0] - 540) * e;
  const cy = 960 + (phone[1] - 960) * e;
  // it hands over to the slice's own phone at the very end of the pull
  const fade = e < 0.7 ? 1 : Math.max(0, 1 - (e - 0.7) / 0.3);
  // black round the screen while it fills the frame (frame 0 and the last frame are all black)
  const backdrop = Math.max(0, 1 - e / 0.25);
  return (
    <>
      {backdrop > 0 ? <div style={{position: 'absolute', inset: 0, background: '#000000', opacity: backdrop}} /> : null}
      <div
        style={{
          position: 'absolute',
          left: cx - W0 / 2,
          top: cy - H0 / 2,
          width: W0,
          height: H0,
          transform: `scale(${scale})`,
          transformOrigin: '50% 50%',
          background: '#000000',
          opacity: fade,
        }}
      >
        <canvas ref={ref} width={W0} height={H0} style={{display: 'block', width: W0, height: H0, opacity: bright}} />
      </div>
    </>
  );
};
