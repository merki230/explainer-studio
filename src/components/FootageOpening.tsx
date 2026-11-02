import React from 'react';
import {AbsoluteFill, Easing, interpolate, OffthreadVideo, useCurrentFrame, useVideoConfig} from 'remotion';
import {revealBoxAt, type Reveal} from '../scenes/openingReveal';
import {section} from '../theme';

/** One key of a mask's track: the box (frame pixels at 1920 × 1080) at `t` seconds into the clip. */
export type MaskKey = {t: number; x: number; y: number; w: number; h: number};

/** A patch over a readable brand mark (style guide § 11.6.1 "Anonymous"): a blurred copy of the clip, feathered at the box edge. */
export type OpeningMask = {
  label: string;
  /** At least one key; the box moves linearly between keys and holds before the first and after the last. */
  keys: MaskKey[];
  /** Gaussian blur radius, px. Default 7. */
  radius?: number;
  /** Soft edge width, px, inside the box. Default 10. */
  feather?: number;
  /**
   * 'blur' (default: a readable brand mark) or 'desaturate' (an object in the reserved orange band that isn't the system,
   * e.g. a store's orange facade, § 11.6.1 grade step 5: CSS can't clamp a hue band globally, so the patch takes the
   * colour out locally). Desaturate patches use `saturate` (default 0.25) and keep the picture sharp.
   */
  kind?: 'blur' | 'desaturate';
  /** Saturation kept by a 'desaturate' patch (0–1). Default 0.25. */
  saturate?: number;
};

export const MASK_RADIUS = 7;
export const MASK_FEATHER = 10;

/** Grade (style guide § 11.6.1, the part CSS can do deterministically): saturation −30%, whites capped at ≈ 96%. Hue 8–40° clamp and black lift can't be done in CSS: bake them into the clip. */
export const OPENING_GRADE = 'saturate(0.7) brightness(0.96)';

/** The box of `keys` at second `t` (linear between keys, held outside). */
export const maskBox = (keys: MaskKey[], t: number) => {
  const first = keys[0];
  const last = keys[keys.length - 1];
  if (t <= first.t) return first;
  if (t >= last.t) return last;
  const j = keys.findIndex((k) => k.t > t);
  const a = keys[j - 1];
  const b = keys[j];
  const f = (t - a.t) / (b.t - a.t);
  const lerp = (u: number, v: number) => u + (v - u) * f;
  return {t, x: lerp(a.x, b.x), y: lerp(a.y, b.y), w: lerp(a.w, b.w), h: lerp(a.h, b.h)};
};

const Patch: React.FC<{mask: OpeningMask; t: number}> = ({mask, t}) => {
  const b = maskBox(mask.keys, t);
  const f = Math.min(mask.feather ?? MASK_FEATHER, b.w / 2, b.h / 2);
  const filter = mask.kind === 'desaturate' ? `saturate(${mask.saturate ?? 0.25})` : `blur(${mask.radius ?? MASK_RADIUS}px)`;
  const ramp = (dir: string) =>
    `linear-gradient(${dir}, transparent 0, #000 ${f}px, #000 calc(100% - ${f}px), transparent 100%)`;
  const m = `${ramp('to right')}, ${ramp('to bottom')}`;
  return (
    <div
      title={mask.label}
      style={{
        position: 'absolute',
        left: b.x,
        top: b.y,
        width: b.w,
        height: b.h,
        // backdrop-filter blurs (or desaturates) the clip behind the box and mirrors its own edge, so a sign at the frame
        // edge stays covered
        backdropFilter: filter,
        WebkitBackdropFilter: filter,
        WebkitMaskImage: m,
        maskImage: m,
        WebkitMaskComposite: 'source-in',
        maskComposite: 'intersect',
      }}
    />
  );
};

const ease = (x: number, a: number, b: number) =>
  interpolate(x, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});

type P2 = [number, number];
const poly = (pts: P2[]) => `polygon(${pts.map(([x, y]) => `${x.toFixed(1)}px ${y.toFixed(1)}px`).join(', ')})`;
const pathOf = (pts: P2[]) => `M${pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L')} Z`;

/**
 * The real opening (style guide § 11.6.1): a stock clip played frame-accurately, graded, with soft blurred patches over
 * every readable brand mark (`masks`; everything else stays sharp). Pure function of the frame. Mount it in a `<Sequence>`
 * so frame 0 of the sequence is frame 0 of the clip.
 *
 * With `reveal` (`scenes/openingReveal.ts`) it also plays the footage's half of "real to section", over the 3D scene
 * underneath: a 3 px `cutLine` section line draws down the real building's front-left edge (`reveal.line`), the near
 * facade wipes back from it toward the near corner with a 24 px feathered edge (`wipe`), the box behind cross-fades out
 * (`fade`), and the surroundings dissolve (`dissolve`), so the last real pixel is gone at the dissolve's end.
 */
export const FootageOpening: React.FC<{src: string; masks?: OpeningMask[]; grade?: string; reveal?: Reveal}> = ({
  src,
  masks = [],
  grade = OPENING_GRADE,
  reveal,
}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const t = frame / fps;
  const video = <OffthreadVideo src={src} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />;
  const patches = masks.map((m) => <Patch key={m.label} mask={m} t={t} />);
  if (!reveal) {
    return (
      <AbsoluteFill style={{filter: grade, overflow: 'hidden'}}>
        {video}
        {patches}
      </AbsoluteFill>
    );
  }
  const b = revealBoxAt(reveal, frame);
  const aS = 1 - ease(frame, reveal.dissolve[0], reveal.dissolve[1]);
  const aB = 1 - ease(frame, reveal.fade[0], reveal.fade[1]);
  const w = ease(frame, reveal.wipe[0], reveal.wipe[1]);
  const lineK = ease(frame, reveal.line[0], reveal.line[1]);
  const lineA = 1 - ease(frame, reveal.wipe[1] - 6, reveal.dissolve[1]);
  const started = frame >= Math.min(reveal.wipe[0], reveal.dissolve[0]);
  const building: P2[] = [b.flb, b.flt, b.blt, b.rbt, b.rbb, b.nb];
  const behind: P2[] = [b.flt, b.blt, b.rbt, b.rbb, b.nb, b.nt];
  const facade: P2[] = [b.flt, b.nt, b.nb, b.flb];
  const x0 = (b.flt[0] + b.flb[0]) / 2;
  const x1 = Math.max(b.nt[0], b.nb[0]) + 24;
  const front = x0 + (x1 - x0) * w;
  const lineEnd: P2 = [b.flt[0] + (b.flb[0] - b.flt[0]) * lineK, b.flt[1] + (b.flb[1] - b.flt[1]) * lineK];
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      {!started ? (
        <AbsoluteFill style={{filter: grade}}>{video}</AbsoluteFill>
      ) : (
        <>
          {/* the surroundings (everything but the building), dissolving */}
          <AbsoluteFill style={{filter: grade, opacity: aS, clipPath: `path(evenodd, '${pathOf([[0, 0], [width, 0], [width, height], [0, height]])} ${pathOf(building)}')`}}>{video}</AbsoluteFill>
          {/* the box behind the cut plane (roof, far side), cross-fading to the 3D one */}
          <AbsoluteFill style={{filter: grade, opacity: aB, clipPath: poly(behind)}}>{video}</AbsoluteFill>
          {/* the near facade, in front of the cut plane, wiping back from the section line */}
          {w < 1 ? (
            <AbsoluteFill
              style={{
                filter: grade,
                clipPath: poly(facade),
                WebkitMaskImage: `linear-gradient(to right, transparent ${(front - 12).toFixed(1)}px, #000 ${(front + 12).toFixed(1)}px)`,
                maskImage: `linear-gradient(to right, transparent ${(front - 12).toFixed(1)}px, #000 ${(front + 12).toFixed(1)}px)`,
              }}
            >
              {video}
            </AbsoluteFill>
          ) : null}
        </>
      )}
      {aS > 0.002 ? <AbsoluteFill style={{opacity: aS}}>{patches}</AbsoluteFill> : null}
      {lineK > 0 && lineA > 0.002 ? (
        <svg width={width} height={height} style={{position: 'absolute', left: 0, top: 0, opacity: lineA}}>
          {/* a light under-stroke so the 3 px ink reads on a dark facade */}
          <line x1={b.flt[0]} y1={b.flt[1]} x2={lineEnd[0]} y2={lineEnd[1]} stroke={section.cut} strokeOpacity={0.75} strokeWidth={7} strokeLinecap="square" />
          <line x1={b.flt[0]} y1={b.flt[1]} x2={lineEnd[0]} y2={lineEnd[1]} stroke={section.cutLine} strokeWidth={3} strokeLinecap="square" />
        </svg>
      ) : null}
    </AbsoluteFill>
  );
};
