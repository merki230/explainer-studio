// The channel symbol (mark C, the "S-line", Night palette) and the lockup, as SVG strings.
// Spec: brand/brand.md § Channel identity and brand/channel-kit.md § 4. Pure (no DOM), so the same
// builders write the SVG masters from Node and draw the PNG stills in Remotion.
import {MOODS, section} from '../theme';
import {TAGLINE, WORDMARK, type Outline} from './glyphs';

/** Logo-only hatch colours (channel-kit § 4: no theme token). */
export const HATCH_BG = '#111830';
export const HATCH_LINE = '#3a4668';

export const MARK = {
  ground: MOODS.night.bg,
  ink: section.cut,
  inkDay: MOODS.day.ink,
  line: section.orange,
  square: {x: 18, y: 18, size: 84, rx: 12, stroke: 3.6},
  hatch: {period: 6, width: 1.8, angle: 45},
  path: 'M80 38 C 40 26, 36 54, 60 60 S 82 92, 40 84',
  pathWidth: 7.5,
  dots: [
    [80, 38],
    [40, 84],
  ] as [number, number][],
  dotR: 5.5,
  viewBox: 120,
};

export type SymbolOptions = {
  /** Unique prefix for pattern/mask ids (several symbols on one page). Default 'sw'. */
  id?: string;
  /** Square stroke colour. Default `cut` (Night ink). */
  ink?: string;
  /** Hatch line width in symbol units. Default 1.8 (the spec). */
  hatchWidth?: number;
  /**
   * One colour (watermark): square, hatch, path and dots all in this colour, the hatch knocked out
   * around the path so the S still reads. Default undefined (full colour).
   */
  mono?: string;
};

/** The symbol's parts in its own 120-unit space (no ground). */
export const symbolBody = (o: SymbolOptions = {}): string => {
  const id = o.id ?? 'sw';
  const {square: q, hatch: h} = MARK;
  const ink = o.mono ?? o.ink ?? MARK.ink;
  const line = o.mono ?? MARK.line;
  const hw = o.hatchWidth ?? h.width;
  const mid = h.period / 2;
  const dots = MARK.dots.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${MARK.dotR}" fill="${line}"/>`).join('');
  const sq = `x="${q.x}" y="${q.y}" width="${q.size}" height="${q.size}" rx="${q.rx}"`;
  if (o.mono) {
    // Knock the hatch out 3 units around the path and dots.
    const gap = 3;
    const knock = MARK.dots
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${MARK.dotR + gap}" fill="#000"/>`)
      .join('');
    return (
      `<defs><pattern id="${id}-h" patternUnits="userSpaceOnUse" width="${h.period}" height="${h.period}" patternTransform="rotate(${h.angle})">` +
      `<line x1="${mid}" y1="0" x2="${mid}" y2="${h.period}" stroke="${o.mono}" stroke-width="${hw}"/></pattern>` +
      `<mask id="${id}-k" maskUnits="userSpaceOnUse" x="0" y="0" width="120" height="120"><rect width="120" height="120" fill="#fff"/>` +
      `<path d="${MARK.path}" fill="none" stroke="#000" stroke-width="${MARK.pathWidth + gap * 2}" stroke-linecap="round"/>${knock}</mask></defs>` +
      `<rect ${sq} fill="url(#${id}-h)" mask="url(#${id}-k)"/>` +
      `<rect ${sq} fill="none" stroke="${ink}" stroke-width="${q.stroke}"/>` +
      `<path d="${MARK.path}" fill="none" stroke="${line}" stroke-width="${MARK.pathWidth}" stroke-linecap="round"/>${dots}`
    );
  }
  return (
    `<defs><pattern id="${id}-h" patternUnits="userSpaceOnUse" width="${h.period}" height="${h.period}" patternTransform="rotate(${h.angle})">` +
    `<rect width="${h.period}" height="${h.period}" fill="${HATCH_BG}"/>` +
    `<line x1="${mid}" y1="0" x2="${mid}" y2="${h.period}" stroke="${HATCH_LINE}" stroke-width="${hw}"/></pattern></defs>` +
    `<rect ${sq} fill="url(#${id}-h)" stroke="${ink}" stroke-width="${q.stroke}"/>` +
    `<path d="${MARK.path}" fill="none" stroke="${line}" stroke-width="${MARK.pathWidth}" stroke-linecap="round"/>${dots}`
  );
};

export type SymbolSvgOptions = SymbolOptions & {
  /** Output size in px (width = height). Default 120. */
  size?: number;
  /** Fill the canvas with the Night ground. Default true. */
  ground?: boolean;
  /** Scale of the mark about the centre (profile picture: fit the circle crop). Default 1. */
  scale?: number;
};

/** The standalone symbol: a square SVG document. */
export const symbolSvg = (o: SymbolSvgOptions = {}): string => {
  const size = o.size ?? 120;
  const k = o.scale ?? 1;
  const ground = o.ground ?? true;
  const t = k === 1 ? '' : ` transform="translate(60 60) scale(${k}) translate(-60 -60)"`;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 120 120">` +
    (ground ? `<rect width="120" height="120" fill="${MARK.ground}"/>` : '') +
    `<g${t}>${symbolBody(o)}</g></svg>`
  );
};

// ---------------------------------------------------------------------------------------------
// Lockup: symbol + "Secretly Works". Units are symbol units; the square's outer stroke edge is the
// lockup's top-left corner (0, 0).
// ---------------------------------------------------------------------------------------------

const EDGE = MARK.square.x - MARK.square.stroke / 2; // 16.2
/** Height of the lockup in symbol units (the square with its stroke). */
export const LOCKUP_H = MARK.square.size + MARK.square.stroke; // 87.6
/** Wordmark cap height, in symbol units (≈ 45% of the square). */
const CAP = 38;
/** Gap between the square and the wordmark, in symbol units. */
const GAP = 22;
const wmScale = CAP / WORDMARK.capHeight;
/** Left edge of the wordmark's pen position, in symbol units. */
export const WORDMARK_X = LOCKUP_H + GAP;
/** Width of the lockup in symbol units (to the wordmark's right ink edge). */
export const LOCKUP_W = WORDMARK_X + WORDMARK.bbox[2] * wmScale;

export type LockupOptions = {
  id?: string;
  /** Wordmark and square-stroke colour. Default `cut`. */
  ink?: string;
};

/** The lockup's parts in symbol units (no background). */
export const lockupBody = (o: LockupOptions = {}): string => {
  const ink = o.ink ?? MARK.ink;
  const baseline = LOCKUP_H / 2 + CAP / 2;
  return (
    `<g transform="translate(${-EDGE} ${-EDGE})">${symbolBody({id: o.id, ink})}</g>` +
    `<path transform="translate(${WORDMARK_X} ${baseline}) scale(${wmScale})" d="${WORDMARK.d}" fill="${ink}"/>`
  );
};

export type LockupSvgOptions = LockupOptions & {
  /** Output width and height in px; the lockup is centred and fitted with `pad` (fraction of height). */
  width?: number;
  height?: number;
  pad?: number;
  /** Background fill, or none (transparent). */
  background?: string;
};

export const lockupSvg = (o: LockupSvgOptions = {}): string => {
  const pad = o.pad ?? 0;
  const vw = LOCKUP_W + 2 * pad * LOCKUP_H;
  const vh = LOCKUP_H * (1 + 2 * pad);
  const w = o.width ?? Math.round(vw * 4);
  const h = o.height ?? Math.round(vh * 4);
  // Fit the padded lockup inside w × h, centred.
  const s = Math.min(w / vw, h / vh);
  const x = (w - LOCKUP_W * s) / 2;
  const y = (h - LOCKUP_H * s) / 2;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">` +
    (o.background ? `<rect width="${w}" height="${h}" fill="${o.background}"/>` : '') +
    `<g transform="translate(${r(x)} ${r(y)}) scale(${r(s, 4)})">${lockupBody(o)}</g></svg>`
  );
};

const r = (n: number, p = 2) => Math.round(n * 10 ** p) / 10 ** p;

// ---------------------------------------------------------------------------------------------
// YouTube banner (channel-kit § 1): 2560 × 1440, readable things inside x 507–2053, y 508–931.
// ---------------------------------------------------------------------------------------------

export const BANNER = {
  width: 2560,
  height: 1440,
  safe: {x0: 507, x1: 2053, y0: 508, y1: 931},
  /** Device crops (channel-kit § 1). */
  crops: [
    {name: 'TV  2560 × 1440', x0: 0, y0: 0, x1: 2560, y1: 1440},
    {name: 'DESKTOP  2560 × 423', x0: 0, y0: 508, x1: 2560, y1: 931},
    {name: 'TABLET  1855 × 423', x0: 352, y0: 508, x1: 2207, y1: 931},
    {name: 'MOBILE = SAFE AREA  1546 × 423', x0: 507, y0: 508, x1: 2053, y1: 931},
  ],
};

export type BannerOptions = {
  /** Lockup width in px. Default 1240. */
  lockupWidth?: number;
  /** Tagline under the wordmark, or null for the lockup only. Default the channel tagline. */
  tagline?: Outline | null;
  /** Tagline cap height in px. Default 40. */
  taglineCap?: number;
  /** Gap from the lockup's bottom to the tagline's cap line, in px. Default 44. */
  taglineGap?: number;
  /** Quiet full-canvas section hatch behind everything. Default true. */
  texture?: boolean;
};

export const bannerSvg = (o: BannerOptions = {}): string => {
  const {width: W, height: H, safe} = BANNER;
  const lw = o.lockupWidth ?? 1240;
  const s = lw / LOCKUP_W;
  const lh = LOCKUP_H * s;
  const tag = o.tagline === undefined ? TAGLINE : o.tagline;
  const tCap = o.taglineCap ?? 40;
  const tGap = o.taglineGap ?? 44;
  const tScale = tag ? tCap / tag.capHeight : 0;
  const tDesc = tag ? tag.bbox[3] * tScale : 0; // descender ink below the baseline
  const groupH = lh + (tag ? tGap + tCap + tDesc : 0);
  const cx = (safe.x0 + safe.x1) / 2;
  const cy = (safe.y0 + safe.y1) / 2;
  const x = cx - lw / 2;
  const y = cy - groupH / 2;
  const tagX = x + WORDMARK_X * s;
  const tagBase = y + lh + tGap + tCap;
  const texture = o.texture ?? true;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">` +
    `<rect width="${W}" height="${H}" fill="${MARK.ground}"/>` +
    (texture
      ? `<defs><pattern id="bg-h" patternUnits="userSpaceOnUse" width="44" height="44" patternTransform="rotate(45)">` +
        `<line x1="22" y1="0" x2="22" y2="44" stroke="${HATCH_BG}" stroke-width="5"/></pattern></defs>` +
        `<rect width="${W}" height="${H}" fill="url(#bg-h)"/>`
      : '') +
    `<g transform="translate(${r(x)} ${r(y)}) scale(${r(s, 4)})">${lockupBody({id: 'bn'})}</g>` +
    (tag
      ? `<path transform="translate(${r(tagX)} ${r(tagBase)}) scale(${r(tScale, 5)})" d="${tag.d}" fill="${MOODS.night.inkSub}"/>`
      : '') +
    `</svg>`
  );
};
