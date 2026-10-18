import React, {useLayoutEffect, useRef} from 'react';
import {continueRender, delayRender, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {fonts, fontsReady} from '../fonts';
import {streetDialAt, truckReads, type StreetSliceSceneProps} from '../scenes/StreetSliceScene';
import {MOODS, section, STREET, type Mood} from '../theme';
import {anchorOnScreen} from './anchors';
import {ease} from './card';
import {drawScreen, screenStateAt, type ScreenStep} from './screenKit';
import {LEFT, overlayInk, RIGHT} from './sectionStyle';

/*
 * The detail-box contents of the street slice (No. 004), each a flat 2D crop read like a phone screen
 * (§ 6): 'laptop' (the truck computer matching each ID it hears to an address), 'usage' (YOU's phone:
 * the "Possible leak" banner, then the utility's hourly-use page) and 'register' (the meter's register
 * seen from above: digits, the sweep hand, the red leak triangle turning). Text ≥ 28 px. Every ID,
 * address, reading and bar is invented (🎭, disclosed in the post).
 */

const BORDER = 4;
const FADE = 10;

/** The invented route: each lid's meter ID and address (🎭). Lid 0 is YOURS. */
export const ROUTE: {id: string; address: string}[] = [
  {id: '30514827', address: '1418 Linden St'},
  {id: '30514862', address: '1422 Linden St'},
  {id: '30515109', address: '1426 Linden St'},
  {id: '30514733', address: '1430 Linden St'},
  {id: '30515246', address: '1434 Linden St'},
  {id: '30514918', address: '1438 Linden St'},
  {id: '30515370', address: '1442 Linden St'},
  {id: '30514655', address: '1446 Linden St'},
];

export type StreetBoxProps = {
  content: 'laptop' | 'usage' | 'register';
  side?: 'left' | 'right';
  top?: number;
  left?: number;
  leader?: boolean;
  /** Inner width in px (defaults: laptop 560, usage 336, register 360). */
  size?: number;
  /** 'usage': seconds after the box enters when the banner gives way to the hourly page (default 1.2; 0 = the page at once). */
  pageAt?: number;
  /** 'usage': seconds after the box enters when the bars start drawing (default `pageAt` + 0.3), and how long (default 1.2). */
  barsAt?: number;
  barsFor?: number;
  /** 'register': the odometer digits (default '01462'). */
  reading?: string;
};

type SceneCtx = {props: Record<string, unknown>; durationInFrames: number; offset: number; name?: string};

/** Draw the truck computer's screen: a light rugged-laptop UI, YOUR row first, a row per read. */
const drawLaptop = (
  cx: CanvasRenderingContext2D,
  w: number,
  h: number,
  rows: {id: string; address: string; mine: boolean; k: number}[],
  count: number,
) => {
  const ui = MOODS.day.ui;
  const ink = MOODS.day.ink;
  const sub = MOODS.day.inkSub;
  cx.setTransform(1, 0, 0, 1, 0, 0);
  cx.fillStyle = ui;
  cx.fillRect(0, 0, w, h);
  cx.fillStyle = ink;
  cx.fillRect(0, 0, w, 58);
  cx.fillStyle = ui;
  cx.font = `700 28px ${fonts.mono}`;
  cx.textBaseline = 'middle';
  cx.textAlign = 'left';
  cx.fillText('ROUTE 12 · LINDEN ST', 20, 30);
  cx.textAlign = 'right';
  cx.fillText(`READS ${count}`, w - 20, 30);
  const rh = 50;
  rows.forEach((r, i) => {
    const y = 70 + i * rh;
    if (y + rh > h) return;
    cx.globalAlpha = r.k;
    if (r.mine) {
      cx.fillStyle = STREET.dial;
      cx.fillRect(0, y, w, rh);
      cx.fillStyle = ink;
      cx.fillRect(0, y, 8, rh);
    }
    cx.fillStyle = r.mine ? ink : sub;
    cx.textAlign = 'left';
    cx.font = `${r.mine ? 700 : 600} 28px ${fonts.mono}`;
    cx.fillText(r.id, 22, y + rh / 2 + 1);
    cx.font = `${r.mine ? 800 : 600} 28px ${fonts.sans}`;
    cx.fillText('→', 186, y + rh / 2);
    cx.fillText(r.address, 222, y + rh / 2 + 1);
    cx.globalAlpha = 1;
    cx.fillStyle = MOODS.day.inkSub;
    cx.fillRect(16, y + rh - 1, w - 32, 1);
  });
};

/** The register from above at `s` px: housing ring, dial, odometer, ring of ten, sweep hand, the red triangle. */
const drawRegister = (cx: CanvasRenderingContext2D, s: number, o: {sweep: number; leak: number; reading: string}) => {
  const c = s / 2;
  cx.setTransform(1, 0, 0, 1, 0, 0);
  cx.fillStyle = MOODS.day.paper;
  cx.fillRect(0, 0, s, s);
  cx.fillStyle = STREET.register;
  cx.beginPath();
  cx.arc(c, c, c - 6, 0, Math.PI * 2);
  cx.fill();
  const R = c - 26;
  cx.fillStyle = STREET.dial;
  cx.beginPath();
  cx.arc(c, c, R, 0, Math.PI * 2);
  cx.fill();
  cx.strokeStyle = STREET.dialInk;
  cx.fillStyle = STREET.dialInk;
  for (let i = 0; i < 50; i++) {
    const a = (i / 50) * Math.PI * 2 - Math.PI / 2;
    const r0 = i % 5 === 0 ? R - 22 : R - 12;
    cx.lineWidth = i % 5 === 0 ? 4 : 2;
    cx.beginPath();
    cx.moveTo(c + Math.cos(a) * r0, c + Math.sin(a) * r0);
    cx.lineTo(c + Math.cos(a) * (R - 4), c + Math.sin(a) * (R - 4));
    cx.stroke();
    // numbers 0, 2, 8 (4 and 6 would sit on the units line)
    if (i % 10 === 0 && i !== 20 && i !== 30) {
      cx.font = `700 28px ${fonts.sans}`;
      cx.textAlign = 'center';
      cx.textBaseline = 'middle';
      cx.fillText(String(i / 5), c + Math.cos(a) * (R - 44), c + Math.sin(a) * (R - 44));
    }
  }
  // the odometer: black wheels, white digits, the last wheel white
  const n = o.reading.length;
  const cw = 36;
  const x0 = c - (n * cw) / 2;
  const oy = c + 18;
  for (let i = 0; i < n; i++) {
    const last = i === n - 1;
    cx.fillStyle = last ? STREET.dial : STREET.dialInk;
    cx.fillRect(x0 + i * cw + 1, oy, cw - 2, 50);
    cx.fillStyle = last ? STREET.dialInk : STREET.dial;
    cx.font = `700 40px ${fonts.mono}`;
    cx.textAlign = 'center';
    cx.textBaseline = 'middle';
    cx.fillText(o.reading[i], x0 + i * cw + cw / 2, oy + 27);
  }
  cx.strokeStyle = STREET.dialInk;
  cx.lineWidth = 3;
  cx.strokeRect(x0 - 3, oy - 3, n * cw + 6, 56);
  cx.fillStyle = STREET.dialInk;
  cx.font = `700 28px ${fonts.sans}`;
  cx.fillText('GALLONS', c, oy + 82);
  // the leak triangle on its small dial (upper left), red, flat; it spins
  const lx = c - R * 0.36;
  const ly = c - R * 0.36;
  cx.lineWidth = 3;
  cx.beginPath();
  cx.arc(lx, ly, 30, 0, Math.PI * 2);
  cx.stroke();
  cx.save();
  cx.translate(lx, ly);
  cx.rotate(o.leak * Math.PI * 2);
  cx.fillStyle = section.leakRed;
  cx.beginPath();
  cx.moveTo(0, -24);
  cx.lineTo(21, 13);
  cx.lineTo(-21, 13);
  cx.closePath();
  cx.fill();
  cx.restore();
  // the sweep hand (one turn = one unit of the ring)
  cx.save();
  cx.translate(c, c);
  cx.rotate(o.sweep * Math.PI * 2);
  cx.fillStyle = STREET.dialInk;
  cx.beginPath();
  cx.moveTo(-5, 22);
  cx.lineTo(0, -(R - 16));
  cx.lineTo(5, 22);
  cx.closePath();
  cx.fill();
  cx.beginPath();
  cx.arc(0, 0, 10, 0, Math.PI * 2);
  cx.fill();
  cx.restore();
};

export const StreetBox: React.FC<StreetBoxProps & {mood?: Mood; scene: SceneCtx}> = ({
  content,
  side,
  top,
  left: leftAt,
  leader = true,
  size,
  pageAt = 1.2,
  barsAt,
  barsFor = 1.2,
  reading = '01462',
  mood = 'day',
  scene,
}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const ref = useRef<HTMLCanvasElement>(null);
  const local = frame / fps;
  const sceneT = (frame + scene.offset) / fps;
  const props = scene.props as Partial<StreetSliceSceneProps>;
  const innerW = size ?? (content === 'laptop' ? 520 : content === 'usage' ? 336 : 360);

  // what to draw, and a key that changes when the drawing would
  let innerH = innerW;
  let key = '';
  let draw: (cx: CanvasRenderingContext2D) => void = () => undefined;
  let anchor = 'register';
  if (content === 'laptop') {
    anchor = 'laptop';
    const all = truckReads(props, sceneT).filter((r) => r.lid !== 0);
    const reads = all.slice(-3);
    const rows = [
      {...ROUTE[0], mine: true, k: 1},
      ...reads.map((r) => ({
        ...ROUTE[Math.min(ROUTE.length - 1, r.lid)],
        mine: false,
        k: ease(sceneT, r.at, r.at + 0.3),
      })),
    ];
    innerH = 70 + 6 * 50 + 6;
    key = `laptop|${all.length}|${rows.map((r) => `${r.id}:${r.k.toFixed(2)}`).join(',')}|${innerW}`;
    draw = (cx) => drawLaptop(cx, innerW, innerH, rows, all.length + 1);
  } else if (content === 'usage') {
    anchor = 'phone';
    const steps: ScreenStep[] = [
      ...(pageAt > 0 ? [{at: 0, app: 'notification' as const, from: 'Water utility', text: 'Possible leak'}] : []),
      {at: pageAt, app: 'usage', barsAt: (barsAt ?? pageAt + 0.3) - pageAt, barsFor},
    ];
    const st = screenStateAt(steps, local, {mood: 'day', clock: '10:15', date: 'Tuesday, May 14'});
    const rect: [number, number, number, number] = [0, 50, 360, 450];
    innerH = Math.round((innerW * rect[3]) / rect[2]);
    key = `usage|${st.app}|${st.enter.toFixed(3)}|${st.bars.toFixed(3)}|${innerW}`;
    draw = (cx) => {
      const k = innerW / rect[2];
      cx.setTransform(k, 0, 0, k, -rect[0] * k, -rect[1] * k);
      drawScreen(cx, st);
    };
  } else {
    const {sweep, leak} = streetDialAt(props, sceneT);
    key = `register|${sweep.toFixed(4)}|${leak.toFixed(4)}|${reading}|${innerW}`;
    draw = (cx) => drawRegister(cx, innerW, {sweep, leak, reading});
  }

  useLayoutEffect(() => {
    const handle = delayRender('Drawing the street detail box');
    fontsReady().then(() => {
      const cx = ref.current?.getContext('2d');
      if (cx) draw(cx);
      continueRender(handle);
    });
    // `key` captures everything the drawing depends on
  }, [key]);

  const target =
    anchorOnScreen(scene, anchor, frame, fps) ??
    (content === 'laptop' ? anchorOnScreen(scene, 'cab', frame, fps) : undefined) ??
    (content === 'usage' ? anchorOnScreen(scene, 'youSpot', frame, fps) : undefined);
  const {ink, paper} = overlayInk(mood);
  const outerW = innerW + 2 * BORDER;
  const outerH = innerH + 2 * BORDER;
  const tx = target?.[0] ?? width / 2;
  const ty = target?.[1] ?? height / 2;
  const onLeft = (side ?? (tx > width / 2 ? 'left' : 'right')) === 'left';
  const left = leftAt ?? (onLeft ? LEFT : RIGHT - outerW);
  const boxTop = top ?? Math.max(328, Math.min(1248 - outerH, ty - 90 - outerH));
  const enter = ease(frame, 0, FADE);
  const rise = interpolate(enter, [0, 1], [8, 0]);
  // a 2 px elbow leader from the box to the thing (down from the box's bottom, then across), when it's on screen
  const by = boxTop + outerH;
  const lx = Math.max(left + 28, Math.min(left + outerW - 28, tx));
  const under = tx >= left + 12 && tx <= left + outerW - 12;
  const points = under
    ? ty > by
      ? `${tx},${by} ${tx},${ty - 12}`
      : ''
    : `${onLeft ? left + outerW - 28 : left + 28},${by} ${onLeft ? left + outerW - 28 : left + 28},${ty} ${tx + (lx < tx ? -12 : 12)},${ty}`;
  const onScreen = target && tx > 0 && tx < width && ty > 0 && ty < height;
  return (
    <div style={{position: 'absolute', inset: 0, opacity: enter}}>
      {leader && onScreen && points ? (
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
