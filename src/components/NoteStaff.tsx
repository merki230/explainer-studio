import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import type {Mood} from '../theme';
import {anchorOnScreen, type AnchorScene} from './anchors';
import {ease} from './card';
import {overlayInk} from './sectionStyle';

/** One note on the staff. */
export type StaffNote = {
  /** Seconds after the overlay starts when the note appears. */
  at: number;
  /**
   * Where it sits: 0 = the bottom line, 1 = the space above it, 2 = the second line … 8 = the top line;
   * below 0 or above 8 it gets ledger lines.
   */
  step: number;
  /**
   * Rise from a named point of the scene into its place (e.g. 'group:2' on `musical-road`: the groove
   * group that played it), over `rise` seconds. Without it the note fades in with a small rise.
   */
  from?: string;
  /**
   * Play it off: from `at` (s, after the overlay starts) the head slides `by` steps (default −0.5: a quarter
   * of a line gap, so it sits neither on a line nor in a space), wobbles, and stays tilted by `tilt` degrees (default 14).
   */
  detune?: {at: number; by?: number; tilt?: number};
  /** Room before this note, in note slots (default 1; 0.5 for a quick pickup, 1.5 for a held one). */
  gap?: number;
  /** A bar line before this note. */
  bar?: boolean;
  /** 'quarter' (default: filled head and stem), 'eighth' (with a flag), 'half' (open head and stem). */
  kind?: 'quarter' | 'eighth' | 'half';
};

export type NoteStaffProps = {
  notes: StaffNote[];
  /** Left end of the staff and its top line, fractions of the frame (default 0.111, 0.19: x 120, y ≈ 365, the sky band). */
  x?: number;
  y?: number;
  /** Staff length, fraction of the frame width (default 0.711: to x 888). */
  width?: number;
  /** Space between staff lines (px, default 26). */
  lineGap?: number;
  /** Width of one note slot (px, default 76). */
  slot?: number;
  /** Seconds a note takes to rise from its `from` point (default 0.6). */
  rise?: number;
  /** When notes run past the right end, the staff scrolls them left (default true); false: they stop at the end. */
  scroll?: boolean;
};

const IN = 10;

/**
 * A five-line music staff in The Section's overlay look (§ 6): `ink` lines with square ends on a soft
 * `paper` halo, no box, in the sky band. Notes appear at their times (fading in, or rising from a point
 * in the scene such as the groove group that played them); `detune` slides chosen heads off their
 * lines with a small decaying wobble ("the notes are off"). Long runs scroll left. Counts as the
 * frame's one card. Mood colours, never orange.
 */
export const NoteStaff: React.FC<NoteStaffProps & {mood?: Mood; scene?: AnchorScene}> = ({
  notes,
  x = 0.111,
  y = 0.19,
  width = 0.711,
  lineGap = 26,
  slot = 76,
  rise = 0.6,
  scroll = true,
  mood = 'day',
  scene,
}) => {
  const frame = useCurrentFrame();
  const {fps, width: W, height: H} = useVideoConfig();
  const t = frame / fps;
  const {ink, paper} = overlayInk(mood);
  const left = x * W;
  const len = width * W;
  const top = y * H;
  const bottom = top + 4 * lineGap;
  const lineIn = ease(frame, 0, IN);
  const pad = slot * 0.8;

  // slot positions along the staff (before scrolling)
  const pos: number[] = [];
  notes.reduce((acc, n, i) => {
    const p = acc + (i === 0 ? 0 : (n.gap ?? 1) * slot);
    pos.push(p);
    return p;
  }, 0);
  // the scroll: once a note would land past the right end, the staff eases left to make room
  const room = len - pad * 1.6;
  const offset = scroll ? Math.max(0, ...notes.map((n, i) => Math.max(0, pos[i] - room) * ease(t, n.at, n.at + 0.35))) : 0;

  const headRx = lineGap * 0.62;
  const headRy = lineGap * 0.46;
  const stemLen = lineGap * 3.4;

  return (
    <svg
      width={W}
      height={H}
      style={{
        position: 'absolute',
        inset: 0,
        filter: `drop-shadow(0 0 6px ${paper}) drop-shadow(0 0 3px ${paper})`,
      }}
    >
      <defs>
        <clipPath id="note-staff-clip">
          <rect x={left} y={0} width={len} height={H} />
        </clipPath>
      </defs>
      {/* the staff: five lines drawn in from the left, bar lines at both ends */}
      {[0, 1, 2, 3, 4].map((k) => (
        <line
          key={k}
          x1={left}
          x2={left + len * lineIn}
          y1={top + k * lineGap}
          y2={top + k * lineGap}
          stroke={ink}
          strokeWidth={3}
          strokeLinecap="butt"
        />
      ))}
      <line x1={left} x2={left} y1={top - 1.25} y2={bottom + 1.25} stroke={ink} strokeWidth={3} opacity={lineIn} />
      <line x1={left + len} x2={left + len} y1={top - 1.25} y2={bottom + 1.25} stroke={ink} strokeWidth={3} opacity={ease(frame, IN - 2, IN)} />

      {notes.map((n, i) => {
        if (t < n.at) return null;
        const age = t - n.at;
        const nx = left + pad + pos[i] - offset;
        // scrolled out past the left end: fade, then gone
        const edge = Math.max(0, Math.min(1, (nx - left - headRx) / (pad * 0.6)));
        if (edge <= 0) return null;
        const d = n.detune;
        const dk = d ? ease(t, d.at, d.at + 0.35) : 0;
        const off = d ? (d.by ?? -0.5) * dk : 0;
        const tau = d ? t - d.at : -1;
        const wobble = (tau > 0 ? 12 * Math.sin(2 * Math.PI * 3.5 * tau) * Math.exp(-2.2 * tau) : 0) + (d ? (d.tilt ?? 14) * dk : 0);
        const step = n.step + off;
        const ty = bottom - (step * lineGap) / 2;
        // rising from the scene, or a short fade and rise in place
        const src = n.from && scene ? anchorOnScreen(scene, n.from, frame, fps) : undefined;
        const k = src ? ease(age, 0, rise) : 1;
        const hx = src ? src[0] + (nx - src[0]) * k : nx;
        const hy = src ? src[1] + (ty - src[1]) * k : ty + 8 * (1 - ease(age, 0, 8 / fps));
        const alpha = (src ? ease(age, 0, 0.15) : ease(age, 0, 8 / fps)) * edge;
        const scale = src ? 0.7 + 0.3 * k : 1;
        const up = n.step < 4;
        const kind = n.kind ?? 'quarter';
        // ledger lines (only once it has landed)
        const ledgers: number[] = [];
        for (let s = -2; s >= n.step; s -= 2) ledgers.push(s);
        for (let s = 10; s <= n.step; s += 2) ledgers.push(s);
        const sx = up ? headRx - 1.2 : -headRx + 1.2;
        return (
          <g key={i} opacity={alpha}>
            {n.bar && k > 0.99 ? (
              <line
                x1={nx - slot * (n.gap ?? 1) * 0.5}
                x2={nx - slot * (n.gap ?? 1) * 0.5}
                y1={top}
                y2={bottom}
                stroke={ink}
                strokeWidth={3}
                clipPath="url(#note-staff-clip)"
              />
            ) : null}
            {ledgers.map((s) => (
              <line
                key={s}
                x1={nx - headRx * 1.6}
                x2={nx + headRx * 1.6}
                y1={bottom - (s * lineGap) / 2}
                y2={bottom - (s * lineGap) / 2}
                stroke={ink}
                strokeWidth={3}
                opacity={k}
              />
            ))}
            <g transform={`translate(${hx} ${hy}) rotate(${wobble}) scale(${scale})`}>
              <ellipse
                rx={headRx}
                ry={headRy}
                transform="rotate(-22)"
                fill={kind === 'half' ? 'none' : ink}
                stroke={ink}
                strokeWidth={kind === 'half' ? 3.5 : 0}
              />
              <line x1={sx} x2={sx} y1={up ? -2 : 2} y2={up ? -stemLen : stemLen} stroke={ink} strokeWidth={3} strokeLinecap="butt" />
              {kind === 'eighth' ? (
                <path
                  d={
                    up
                      ? `M ${sx} ${-stemLen} q ${headRx * 0.2} ${lineGap * 1.1} ${headRx * 1.25} ${lineGap * 1.7}`
                      : `M ${sx} ${stemLen} q ${headRx * 0.2} ${-lineGap * 1.1} ${headRx * 1.25} ${-lineGap * 1.7}`
                  }
                  fill="none"
                  stroke={ink}
                  strokeWidth={3}
                />
              ) : null}
            </g>
          </g>
        );
      })}
    </svg>
  );
};
