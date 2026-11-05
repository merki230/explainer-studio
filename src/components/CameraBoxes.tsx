import React, {useLayoutEffect, useRef} from 'react';
import {continueRender, delayRender, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {fontsReady} from '../fonts';
import {CAR, type Mood} from '../theme';
import {anchorOnScreen, withFormat} from './anchors';
import {ease} from './card';
import {fonts} from '../fonts';
import {clearCorner, useLayout} from './layout';
import {
  drawCameraView,
  drawSearch,
  drawSettings,
  PHOTO_ASPECT,
  type CameraViewState,
  type MarkName,
  type SearchState,
  type SettingsState,
} from './plateCameraKit';
import {overlayInk} from './sectionStyle';
import {loadSnapshots, snapshotsNow} from './cameraSnapshots';

/*
 * No. 015 detail-box contents (N3, N7), drawn by `plateCameraKit.ts`: 'camera-view' (what the pole camera captured;
 * style guide v0.18.7 § 6: the leader goes to the lens), 'search' and 'settings' (the office monitor; the leader goes to
 * the monitor). Same box as every detail box: 4 px ink border, paper fill, the DETAIL tab, a 2 px ink elbow leader.
 * Times are seconds after the box enters.
 */

export type CameraBoxProps = {
  /** 'camera-view': which still (default 'color'; see `plateCameraKit`). */
  view?: 'color' | 'ir' | 'training' | 'record';
  /**
   * 'camera-view' 'color': the software's marks, each an orange outline box drawn on at `at` (0.3 s) with its chip landing
   * (6 px rise) 0.1 s later. `chip` overrides the default label ('plate' → the plate text, 'badge' → `MAKE` + a blank
   * badge, 'color' → `LIGHT BLUE`, 'body' → `SUV`, 'rack' → `ROOF RACK`); null for no chip.
   */
  marks?: {at: number; mark: MarkName; chip?: string | null}[];
  /** 'camera-view' 'color': one soft orange scan band sweeps down the still from `scanAt` (0.8 s). Default none. */
  scanAt?: number | null;
  /** 'camera-view' 'ir': boxes step across the plate from `charsAt`, one character every 0.15 s, each copied under it. */
  charsAt?: number;
  /** 'camera-view' 'ir': the character boxes give way to one plate box (0.3 s). Default: after the last character + 0.6. */
  plateBoxAt?: number | null;
  /**
   * 'camera-view': whose rendered stills to show (`src/videos/<set>/snapshots/`, made with `zz-camera-snapshot`).
   * Default: the video's own slug (from the composition id). With no stills there, the flat drawing is used instead.
   */
  snapshots?: string;
  /** The plate's invented characters (default '8KTR 214', as the 3D car). */
  plateText?: string;
  /** The car's paint in the flat fallback still (default YOU's, `CAR.day.bodies.you`; a rendered still has its own). */
  paint?: string;
  /** Flat fallback still: draw the roof rack (default true) and lit brake lamps (default true: stopped at the red). */
  rack?: boolean;
  lamps?: boolean;
  /** 'camera-view' 'training': the still shrinks into a tile (0.5 s) at `streamAt` (default 0.3); the grid streams up. */
  streamAt?: number;
  /** 'training': the stream speeds up (×3) from here (default none). */
  fastAt?: number | null;
  /** 'training': the grid collapses back onto the still (0.5 s) here (default none). */
  gridCollapseAt?: number | null;
  /**
   * 'camera-view' 'record': the record's fields, each landing at `at`: the first is the plate text (beside the
   * thumbnail), the rest are chips wrapping under it (`badge`: the blank make badge). Default: the plate, LIGHT BLUE,
   * SUV, ROOF RACK, MAKE ▭, TUE · 2:14 PM, ELM ST · CAMERA 12.
   */
  fields?: {at: number; text: string; badge?: boolean}[];
  /** 'record': the record's edge turns orange (saved) here (0.3 s). Default none. */
  savedAt?: number | null;
  /** 'search': the query's chips, each landing at `at` (default: LIGHT BLUE, MAKE ▭, ELM ST, 2–3 PM at 0.2 s apart). */
  query?: {at: number; text: string; badge?: boolean}[];
  /**
   * 'search': result rows dropping in at `at` (0.3 s); `match` the time its 5 px orange edge comes on (default never);
   * `odd` for a plate field that isn't a plate ('PAPER TAG', 'COVERED', 'NO PLATE': `inkSub`). Non-matches never show.
   */
  results?: {at: number; plate: string; label?: string; time?: string; match?: number | null; odd?: boolean; paint?: string}[];
  /** 'settings': the label (default 'KEEP SIGHTINGS FOR'). */
  settingLabel?: string;
  /** 'settings': the number of days, keys `{at, value}` (a step presses − or + for 0.25 s). Default 7. */
  days?: {at: number; value: number}[];
  /** 'settings': an ink bracket under the controls draws on here (0.5 s; a range, no number). Default none. */
  rangeAt?: number | null;
};

type SceneCtx = {props: Record<string, unknown>; durationInFrames: number; offset: number; name?: string};
type BaseProps = {
  size?: number;
  side?: 'left' | 'right';
  top?: number;
  left?: number;
  leader?: boolean;
  anchor?: string;
  mood?: Mood;
  scene: SceneCtx;
};

const BORDER = 4;
const FADE = 10;

/** The shared frame: canvas drawn on `key`, tab, leader to `anchor` (elbow from the box's bottom, or out of its side). */
const CanvasBox: React.FC<
  BaseProps & {
    w: number;
    h: number;
    drawKey: string;
    draw: (cx: CanvasRenderingContext2D) => void;
    defaultAnchor: string;
    gap?: number;
    /** Default side: the anchor's own side (the camera view, v0.18.7) instead of the side away from it. */
    sameSide?: boolean;
    /** Awaited (with the fonts) before drawing, e.g. the rendered stills; the frame is held meanwhile. */
    prepare?: () => Promise<unknown>;
  }
> = ({w, h, drawKey, draw, prepare, side, top, left: leftAt, leader = true, anchor, defaultAnchor, mood = 'day', scene, gap = 70, sameSide = false}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const L = useLayout();
  const sc = {...scene, props: withFormat(scene.props, L.format)};
  const ref = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    const handle = delayRender('Drawing a camera box');
    Promise.all([fontsReady(), prepare ? prepare() : null]).then(() => {
      const cx = ref.current?.getContext('2d');
      if (cx) draw(cx);
      continueRender(handle);
    });
    // `drawKey` captures everything the drawing depends on
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drawKey]);
  const target = anchorOnScreen(sc, anchor ?? defaultAnchor, frame, fps);
  const {ink, paper} = overlayInk(mood);
  const outerW = w + 2 * BORDER;
  const outerH = h + 2 * BORDER;
  const targetRight = !!target && target[0] > width / 2;
  const onLeft = (side ?? ((sameSide ? !targetRight : targetRight) ? 'left' : 'right')) === 'left';
  const left = leftAt ?? (onLeft ? L.left : L.right - outerW);
  // above the target, inside the safe zone, and clear of the caption band (a 2-line page reaches up to ≈ y 1045)
  const vertical = () => Math.max(328, Math.min(1030 - outerH, (target ? target[1] : height / 2) - gap - outerH));
  const boxTop = top ?? (L.format === 'horizontal' ? clearCorner(L, left, L.detail.top, outerW, outerH) : vertical());
  const enter = ease(frame, 0, FADE);
  const rise = interpolate(enter, [0, 1], [8, 0]);
  const by = boxTop + outerH;
  const lx = onLeft ? left + outerW - 28 : left + 28;
  // the leader: a straight drop or rise when the target is under or over the box; an elbow out of the bottom or the top
  // edge when it is below or above it; else out of the side at the target's height. Ends 12 px short of the target.
  const inX = target ? target[0] >= left + 12 && target[0] <= left + outerW - 12 : false;
  let points = '';
  if (target) {
    const [tx, ty] = target;
    const towardX = tx + (lx < tx ? -12 : 12);
    if (inX && ty > by) points = `${tx},${by} ${tx},${Math.max(by, ty - 12)}`;
    else if (inX && ty < boxTop) points = `${tx},${boxTop} ${tx},${Math.min(boxTop, ty + 12)}`;
    else if (ty >= by) points = `${lx},${by} ${lx},${ty} ${towardX},${ty}`;
    else if (ty <= boxTop) points = `${lx},${boxTop} ${lx},${ty} ${towardX},${ty}`;
    else points = `${onLeft ? left + outerW : left},${ty} ${tx + (onLeft ? -12 : 12)},${ty}`;
  }
  return (
    <div style={{position: 'absolute', inset: 0, opacity: enter}}>
      {leader && target ? (
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
            fontSize: L.detail.tab,
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
          <canvas ref={ref} width={w} height={h} style={{display: 'block', width: w, height: h}} />
        </div>
      </div>
    </div>
  );
};

const q3 = (v: number) => Math.round(v * 1000) / 1000;
const DEFAULT_CHIP: Record<MarkName, string | null> = {plate: null, badge: 'MAKE', color: 'LIGHT BLUE', body: 'SUV', rack: 'ROOF RACK'};

/** 'camera-view': the pole camera's still and the software's marks (leader to the lens; the box on the camera's side, v0.18.7). */
export const CameraViewBox: React.FC<BaseProps & CameraBoxProps> = (p) => {
  const frame = useCurrentFrame();
  const {fps, id} = useVideoConfig();
  const t = frame / fps;
  const set = p.snapshots ?? id.replace(/-cover$/, '').replace(/-short-\d+$/, '');
  const w = p.size ?? 440;
  const plate = p.plateText ?? '8KTR 214';
  const mode = p.view ?? 'color';
  const ph = Math.round(w * PHOTO_ASPECT);
  const h = mode === 'record' ? Math.round(16 + w * 0.46 * PHOTO_ASPECT + 18 + 4 * 56 + 6) : mode === 'ir' ? ph + 84 : ph + 18 + 2 * 56;
  const marks = (p.marks ?? []).map((m) => ({
    mark: m.mark,
    draw: q3(ease(t, m.at, m.at + 0.3)),
    chip: m.chip === undefined ? (m.mark === 'plate' ? plate : DEFAULT_CHIP[m.mark]) : m.chip,
    land: q3(ease(t, m.at + 0.1, m.at + 0.4)),
  }));
  const nChars = plate.replace(/ /g, '').length;
  const charsAt = p.charsAt ?? 0.4;
  const chars = mode === 'ir' ? Math.max(0, Math.min(nChars, (t - charsAt) / 0.15)) : 0;
  const plateBoxAt = p.plateBoxAt === undefined ? charsAt + nChars * 0.15 + 0.6 : p.plateBoxAt;
  const streamAt = p.streamAt ?? 0.3;
  const fast = p.fastAt ?? null;
  // the grid's scroll in rows: 0.9 rows/s, ×3 after `fastAt` (a stream of 16 → 64 tiles)
  const scrollAt = (x: number) => {
    const a = Math.max(0, x - streamAt - 0.5);
    if (fast === null || x < fast) return a * 0.9;
    return (fast - streamAt - 0.5) * 0.9 + (x - fast) * 2.7;
  };
  const collapse = p.gridCollapseAt ?? null;
  const shrinkIn = ease(t, streamAt, streamAt + 0.5);
  const shrinkOut = collapse === null ? 0 : ease(t, collapse, collapse + 0.5);
  const fields = (
    p.fields ?? [
      {at: 0.3, text: plate},
      {at: 0.9, text: 'LIGHT BLUE'},
      {at: 1.0, text: 'SUV'},
      {at: 1.1, text: 'ROOF RACK'},
      {at: 1.2, text: 'MAKE', badge: true},
      {at: 1.8, text: 'TUE · 2:14 PM'},
      {at: 2.4, text: 'ELM ST · CAMERA 12'},
    ]
  ).map((f) => ({text: f.text, badge: f.badge, land: q3(ease(t, f.at, f.at + 0.3))}));
  const state: CameraViewState = {
    mode,
    plate,
    paint: p.paint ?? CAR.day.bodies.you,
    rack: p.rack ?? true,
    lamps: p.lamps ?? true,
    marks,
    scan: p.scanAt === undefined || p.scanAt === null ? null : q3((t - p.scanAt) / 0.8),
    chars: q3(chars),
    plateBox: plateBoxAt === null ? 0 : q3(ease(t, plateBoxAt, plateBoxAt + 0.3)),
    shrink: mode === 'training' ? q3(shrinkIn * (1 - shrinkOut)) : 0,
    scroll: mode === 'training' ? q3(scrollAt(t)) : 0,
    grid: mode === 'training' ? q3(shrinkIn * (1 - shrinkOut)) : 0,
    fields,
    saved: p.savedAt === undefined || p.savedAt === null ? 0 : q3(ease(t, p.savedAt, p.savedAt + 0.3)),
  };
  const key = JSON.stringify(state) + w + set;
  return (
    <CanvasBox
      {...p}
      w={w}
      h={h}
      drawKey={key}
      prepare={() => loadSnapshots(set)}
      draw={(cx) => drawCameraView(cx, w, h, state, snapshotsNow(set))}
      defaultAnchor="lens"
      sameSide
    />
  );
};

/** 'search': the office monitor's search screen (leader to the monitor). */
export const SearchBox: React.FC<BaseProps & CameraBoxProps> = (p) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const w = p.size ?? 620;
  const h = 560;
  const query = (
    p.query ?? [
      {at: 0.3, text: 'LIGHT BLUE'},
      {at: 0.9, text: 'MAKE', badge: true},
      {at: 1.5, text: 'ELM ST'},
      {at: 2.1, text: '2–3 PM'},
    ]
  ).map((q) => ({text: q.text, badge: q.badge, land: q3(ease(t, q.at, q.at + 0.3))}));
  const you = CAR.day.bodies.you;
  const rows = (p.results ?? []).map((r) => ({
    plate: r.plate,
    label: r.label ?? 'LIGHT BLUE',
    time: r.time ?? '2:14',
    paint: r.paint ?? you,
    land: q3(ease(t, r.at, r.at + 0.3)),
    match: r.match === undefined || r.match === null ? 0 : q3(ease(t, r.match, r.match + 0.25)),
    odd: !!r.odd,
  }));
  const state: SearchState = {query, rows};
  const key = JSON.stringify(state) + w;
  return <CanvasBox {...p} w={w} h={h} drawKey={key} draw={(cx) => drawSearch(cx, w, h, state)} defaultAnchor="monitor" gap={60} />;
};

/** 'settings': KEEP SIGHTINGS FOR [ n ] DAYS (leader to the monitor). */
export const SettingsBox: React.FC<BaseProps & CameraBoxProps> = (p) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const w = p.size ?? 560;
  const h = 260;
  const keys = [...(p.days ?? [{at: 0, value: 7}])].sort((a, b) => a.at - b.at);
  let value = keys[0]?.value ?? 7;
  let press = 0;
  let pressSide: -1 | 1 = 1;
  keys.forEach((k, i) => {
    if (t < k.at) return;
    if (i > 0 && t < k.at + 0.25) {
      press = 1;
      pressSide = k.value >= value ? 1 : -1;
    }
    value = k.value;
  });
  const state: SettingsState = {
    label: p.settingLabel ?? 'KEEP SIGHTINGS FOR',
    value,
    press,
    pressSide,
    range: p.rangeAt === undefined || p.rangeAt === null ? 0 : q3(ease(t, p.rangeAt, p.rangeAt + 0.5)),
  };
  const key = JSON.stringify(state) + w;
  return <CanvasBox {...p} w={w} h={h} drawKey={key} draw={(cx) => drawSettings(cx, w, h, state)} defaultAnchor="monitor" gap={60} />;
};
