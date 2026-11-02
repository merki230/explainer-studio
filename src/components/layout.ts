import {useFormat} from '../format';
import {CAPTIONS_H, SAFE, SAFE_H, WATERMARK_CORNER_H, type Format} from '../theme';

/**
 * Where and how big each overlay is, per frame format (style guide § 6–7 for the vertical frame, § 11.2–11.5 for the
 * horizontal one). Overlays read it with `useLayout()`; the vertical set is exactly the values every video up to
 * No. 012 was rendered with, so vertical output never changes. Pixel values are for the frame of that format
 * (1080 × 1920 or 1920 × 1080).
 */
export type OverlayLayout = {
  format: Format;
  /** Left edge of every left-aligned overlay, right limit of everything readable, and the readable rectangle's top / bottom. */
  left: number;
  right: number;
  top: number;
  bottom: number;
  /** The YouTube watermark / end-screen corner (no readable overlay at x ≥ left and y ≥ top); null in the vertical frame. */
  corner: {left: number; top: number} | null;
  captions: {
    left: number;
    bottom: number;
    maxRight: number;
    /** Right edge while a full-frame screen is up (it sits on the right half in the wide frame). */
    narrowRight: number;
    fontSize: number;
    lineHeight: number;
    padding: string;
    /** Paging: ≤ `maxWords` a page (vertical), or lines of ≤ `maxChars` characters, ≤ `maxLines` a page (horizontal). */
    maxWords: number | null;
    maxChars: number | null;
    maxLines: number;
  };
  /** `line2Tracking`: line 2's letter-spacing (em). */
  title: {left: number; top: number; line1: number; line2: number; line2Tracking: number; padding: string; wrap: number};
  tag: {size: number; square: number; ceiling: number};
  price: {name: number; price: number; sub: number; square: number; ceiling: number};
  callout: {title: number; sub: number};
  place: {size: number; sub: number; top: number};
  detail: {size: number; dashSize: number; top: number; maxW: number; maxH: number; tab: number; minTop: number};
  screen: {top: number; bottom: number; centerX: number; tab: number};
  statement: {size: number; skyTop: number; highTop: number; lowBottom: number; maxWidth: number};
  attribution: {skyTop: number; highTop: number; lowBottom: number};
  counter: {x: number; y: number; digits: number; unit: number; sub: number; rowLabel: number};
  chart: {
    left: number;
    top: number;
    maxW: number;
    maxH: number;
    width: number;
    height: number;
    barsH: number;
    barsFootH: number;
    label: number;
    tab: number;
  };
  chip: {top: number};
  cover: {top: number; width: number};
};

export const LAYOUTS: Record<Format, OverlayLayout> = {
  vertical: {
    format: 'vertical',
    left: 120,
    right: 888,
    top: SAFE.top,
    bottom: SAFE.bottom,
    corner: null,
    captions: {
      left: 120,
      bottom: 1188,
      maxRight: 888,
      narrowRight: 888,
      fontSize: 50,
      lineHeight: 1.22,
      padding: '13px 26px 15px 28px',
      maxWords: 5,
      maxChars: null,
      maxLines: 2,
    },
    title: {left: 120, top: 300, line1: 37, line2: 19, line2Tracking: 0.18, padding: '13px 24px 15px', wrap: 32},
    tag: {size: 26, square: 26, ceiling: 470},
    price: {name: 26, price: 32, sub: 22, square: 26, ceiling: 470},
    callout: {title: 26, sub: 20},
    place: {size: 30, sub: 20, top: 300},
    detail: {size: 336, dashSize: 360, top: 328, maxW: 696, maxH: 1248, tab: 17, minTop: 328},
    screen: {top: 288, bottom: 1030, centerX: 540, tab: 17},
    statement: {size: 88, skyTop: 288, highTop: 500, lowBottom: 1000, maxWidth: 768},
    attribution: {skyTop: 300, highTop: 500, lowBottom: 1024},
    counter: {x: 0.111, y: 0.55, digits: 80, unit: 34, sub: 20, rowLabel: 30},
    chart: {left: 120, top: 330, maxW: 696, maxH: 620, width: 696, height: 560, barsH: 560, barsFootH: 620, label: 26, tab: 17},
    chip: {top: 340},
    cover: {top: 288, width: 768},
  },
  horizontal: {
    format: 'horizontal',
    left: SAFE_H.left,
    right: SAFE_H.right,
    top: SAFE_H.top,
    bottom: SAFE_H.bottom,
    corner: WATERMARK_CORNER_H,
    captions: {
      left: CAPTIONS_H.left,
      bottom: CAPTIONS_H.bottom,
      maxRight: CAPTIONS_H.maxRight,
      narrowRight: 1040,
      fontSize: CAPTIONS_H.fontSize,
      lineHeight: CAPTIONS_H.lineHeight,
      padding: `${CAPTIONS_H.padding.top}px ${CAPTIONS_H.padding.right}px ${CAPTIONS_H.padding.bottom}px ${CAPTIONS_H.padding.left}px`,
      maxWords: null,
      maxChars: CAPTIONS_H.maxChars,
      maxLines: CAPTIONS_H.maxLines,
    },
    // line 2 at the 26 px floor, tracking 0.12em, ≤ 46 characters (style guide v0.16.1 § 11)
    title: {left: 144, top: 120, line1: 40, line2: 26, line2Tracking: 0.12, padding: '14px 26px 16px', wrap: 40},
    // a tag's centre: its top never above y 160
    tag: {size: 28, square: 28, ceiling: 174},
    // sub-lines at the 26 px floor (v0.16.1 § 11)
    price: {name: 28, price: 34, sub: 26, square: 28, ceiling: 160},
    callout: {title: 28, sub: 26},
    place: {size: 32, sub: 26, top: 120},
    // the DETAIL tab sits above the box: a box top at 180 keeps the 26 px tab inside y ≥ 120
    detail: {size: 460, dashSize: 460, top: 180, maxW: 900, maxH: 760, tab: 26, minTop: 158},
    screen: {top: 120, bottom: 940, centerX: 1300, tab: 26},
    statement: {size: 96, skyTop: 120, highTop: 300, lowBottom: 840, maxWidth: SAFE_H.right - SAFE_H.left},
    attribution: {skyTop: 120, highTop: 300, lowBottom: 864},
    counter: {x: 144 / 1920, y: 120 / 1080, digits: 88, unit: 36, sub: 26, rowLabel: 32},
    chart: {left: 144, top: 150, maxW: 900, maxH: 700, width: 900, height: 640, barsH: 640, barsFootH: 700, label: 28, tab: 26},
    chip: {top: 120},
    cover: {top: 120, width: 960},
  },
};

/** The overlay layout for the frame being rendered (vertical or horizontal, from the composition's size). */
export const useLayout = (): OverlayLayout => LAYOUTS[useFormat().format];

/**
 * Keep a box (x, y = its top-left, w × h) out of the watermark corner (horizontal only): a box reaching into it is moved
 * up until its bottom is at the corner's top. Returns the new top.
 */
export const clearCorner = (L: OverlayLayout, x: number, y: number, w: number, h: number) =>
  L.corner && x + w > L.corner.left && y + h > L.corner.top ? Math.max(L.top, L.corner.top - h) : y;
