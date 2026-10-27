import React, {useMemo} from 'react';
import * as THREE from 'three';
import {fonts} from '../../fonts';
import {HIGHWAY, MOODS, type Mood} from '../../theme';
import {raw} from '../plaster';
import {useFontsLoaded} from '../section/useFontsLoaded';

type V3 = [number, number, number];

/*
 * Generic US road signs (No. 005), realistic and drawn to MUTCD sizes, facing +z (the traffic coming
 * toward −z sees them; in a slice whose traffic drives away from the camera they read square-on at
 * the fixed 28° yaw). No shield, no route number, no place name, no logo. Lettering: Inter 700 from
 * `fonts` for now (a highway face may replace it later). Metres; the origin is the sign's foot on the
 * ground at its centre line, `groundY` the ground there, `bottom` the panel's bottom edge above y = 0
 * (the road surface). Sheeting is retroreflective: `retro` (0 → ≈ 0.6) brightens the face as a car's
 * headlights reach it (flat emissive from the face's own drawing; never bloomed).
 *
 *  - 'speed': R2-1 SPEED / LIMIT / nn, 48 × 60 in, white, black legend and border, two square posts.
 *  - 'mile': D10-3 reference location sign, green, white border, MILE over the digits stacked one per
 *    line (the real three-digit layout), 12 × 48 in, one post.
 *  - 'guide': a generic white-on-green guide sign of two lines (e.g. NEXT EXIT / 2 MILES), 13 × 7 ft,
 *    two breakaway I-beam posts.
 *  - 'oneway': R6-2 ONE WAY, 24 × 30 in, white with a black border, ONE / WAY over a black arrow
 *    pointing ahead (up), one square post (city slice, No. 006).
 *  - 'exit' (No. 009): a generic exit direction sign, a green guide panel (one or two lines of legend, no
 *    place name of a real town, no shield) with a white up-right arrow, under the green "EXIT nn" plaque
 *    (E1-5P style) sitting on its top right edge, white borders, two breakaway I-beam posts.
 *
 * No. 009: the 'mile' panel is sized by its digit count (12 × 24 in one digit, × 36 two, × 48 three,
 * MUTCD Table 2H-1), and `font: 'overpass'` letters the legends in Overpass (the owner-approved highway
 * face, § 6); the default stays Inter so earlier videos render unchanged.
 */

export type RoadSignKind = 'speed' | 'mile' | 'guide' | 'oneway' | 'exit';
/** The legend's face: 'inter' (default, No. 005–008) or 'overpass' (the highway face, No. 009 on). */
export type RoadSignFont = 'inter' | 'overpass';

const IN = 0.0254;

/** Panel sizes (m) and the canvas scale (px per inch). */
export const SIGN_SIZE: Record<RoadSignKind, {w: number; h: number; ppi: number; r: number}> = {
  speed: {w: 48 * IN, h: 60 * IN, ppi: 10, r: 3 * IN},
  mile: {w: 12 * IN, h: 48 * IN, ppi: 20, r: 1.5 * IN},
  guide: {w: 156 * IN, h: 84 * IN, ppi: 8, r: 9 * IN},
  oneway: {w: 24 * IN, h: 30 * IN, ppi: 16, r: 1.5 * IN},
  // the default exit sign (three digits, one line): the panel 150 × 66 in under a 30 in plaque
  exit: {w: 150 * IN, h: 96 * IN, ppi: 8, r: 6 * IN},
};

/** The exit sign's parts (inches): the guide panel and the EXIT plaque on its top right edge. */
const exitLayout = (text: string[]) => {
  const num = text[0] ?? '150';
  const lines = text.slice(1).filter((t) => t.length > 0);
  const legend = lines.length ? lines : ['Town Center'];
  const panel = {w: 150, h: legend.length > 1 ? 90 : 66};
  const plaque = {w: 54 + 13 * Math.max(1, num.replace(/\s/g, '').length), h: 30};
  return {num, legend, panel, plaque, w: panel.w, h: panel.h + plaque.h};
};

/**
 * A sign's panel size (m) for its legend: 'mile' by its digit count (one, two or three digits: 24, 36, 48 in
 * tall), 'exit' by its plaque and legend lines; the others fixed (`SIGN_SIZE`).
 */
export const signSize = (kind: RoadSignKind, text: string[]) => {
  const s = SIGN_SIZE[kind];
  if (kind === 'mile') {
    const n = Math.max(1, Math.min(3, (text[0] ?? '112').length));
    return {...s, h: (12 + 12 * n) * IN};
  }
  if (kind === 'exit') {
    const e = exitLayout(text);
    return {...s, w: e.w * IN, h: e.h * IN};
  }
  return s;
};

/** The panel's bottom edge above the road by default (m): 4 ft for 'mile', 7 ft for the others. */
export const signBottom = (kind: RoadSignKind) => (kind === 'mile' ? 48 * IN : 84 * IN);

const roundRect = (cx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
  cx.beginPath();
  cx.moveTo(x + r, y);
  cx.lineTo(x + w - r, y);
  cx.arcTo(x + w, y, x + w, y + r, r);
  cx.lineTo(x + w, y + h - r);
  cx.arcTo(x + w, y + h, x + w - r, y + h, r);
  cx.lineTo(x + r, y + h);
  cx.arcTo(x, y + h, x, y + h - r, r);
  cx.lineTo(x, y + r);
  cx.arcTo(x, y, x + r, y, r);
  cx.closePath();
};

/** Inter's cap height as a fraction of the font size. */
const CAP = 0.727;

/** The canvas font for a face at `px`. */
const faceCss = (font: RoadSignFont, px: number) =>
  font === 'overpass' ? `700 ${px}px ${fonts.sign}, ${fonts.sans}, Arial` : `700 ${px}px ${fonts.sans}, Arial`;

const capCache: Partial<Record<RoadSignFont, number>> = {};
/** Cap height / font size: Inter's fixed value (as No. 005–008), Overpass's measured once from an "H". */
const capRatio = (cx: CanvasRenderingContext2D, font: RoadSignFont) => {
  if (font === 'inter') return CAP;
  if (capCache[font] === undefined) {
    cx.save();
    cx.font = faceCss(font, 100);
    const a = cx.measureText('H').actualBoundingBoxAscent;
    cx.restore();
    capCache[font] = a > 20 && a < 100 ? a / 100 : CAP;
  }
  return capCache[font]!;
};

/**
 * The exit sign's face: the green guide panel (legend, white up-right arrow, white border) and, on its top
 * right edge, the green EXIT plaque ("EXIT" 10 in, the number 15 in), transparent elsewhere.
 */
const drawExit = (cx: CanvasRenderingContext2D, text: string[], k: number, font: RoadSignFont) => {
  const e = exitLayout(text);
  const green = HIGHWAY.signGreen;
  const white = HIGHWAY.signWhite;
  const panelY = e.plaque.h * k;
  const plaqueX = (e.panel.w - e.plaque.w - 6) * k;
  const part = (x: number, y: number, w: number, h: number, r: number, inset: number, bw: number) => {
    roundRect(cx, x, y, w, h, r * k);
    cx.fillStyle = green;
    cx.fill();
    const o = (inset + bw / 2) * k;
    roundRect(cx, x + o, y + o, w - 2 * o, h - 2 * o, Math.max(2, (r - inset - bw / 2) * k));
    cx.strokeStyle = white;
    cx.lineWidth = bw * k;
    cx.stroke();
  };
  // the plaque overlaps the panel's top border a little, as the real ones are bolted on
  part(0, panelY, e.panel.w * k, e.panel.h * k, 6, 1, 1.5);
  part(plaqueX, 0, e.plaque.w * k, (e.plaque.h + 1.5) * k, 3, 0.75, 1.25);
  cx.fillStyle = white;
  cx.textBaseline = 'alphabetic';
  const cap = capRatio(cx, font);
  const fit = (t: string, capIn: number, maxIn: number) => {
    cx.font = faceCss(font, (capIn * k) / cap);
    return Math.min(1, (maxIn * k) / Math.max(1, cx.measureText(t).width));
  };
  const put = (t: string, capIn: number, x: number, baseIn: number, sq: number, align: CanvasTextAlign) => {
    cx.font = faceCss(font, (capIn * k) / cap);
    cx.textAlign = align;
    cx.save();
    cx.translate(x, baseIn * k);
    cx.scale(sq, 1);
    cx.fillText(t, 0, 0);
    cx.restore();
  };
  // plaque: EXIT (10 in) and the number (15 in) on one baseline, centred as a pair
  {
    const gap = 4 * k;
    cx.font = faceCss(font, (10 * k) / cap);
    const wE = cx.measureText('EXIT').width;
    cx.font = faceCss(font, (15 * k) / cap);
    const wN = cx.measureText(e.num).width;
    const sq = Math.min(1, ((e.plaque.w - 10) * k) / (wE + gap + wN));
    const x0 = plaqueX + (e.plaque.w * k - (wE + gap + wN) * sq) / 2;
    const base = 22.5;
    put('EXIT', 10, x0, base, sq, 'left');
    put(e.num, 15, x0 + (wE + gap) * sq, base, sq, 'left');
  }
  // the legend: mixed case, 13.3 in capitals, left of the arrow
  const arrowW = 30;
  const textMax = e.panel.w - arrowW - 26;
  const cxL = 10 + textMax / 2;
  e.legend.forEach((t, i) => {
    const base = e.plaque.h + (e.legend.length > 1 ? 36 + i * 26 : 41);
    put(t, 13.3, cxL * k, base, fit(t, 13.3, textMax), 'center');
  });
  // the up-right arrow (45°), right of the legend
  const ax = (e.panel.w - 10 - arrowW / 2) * k;
  const ay = (e.plaque.h + e.panel.h / 2) * k;
  const L = 26 * k;
  cx.save();
  cx.translate(ax, ay);
  cx.rotate(Math.PI / 4);
  cx.beginPath();
  const sw = 2.6 * k;
  const hw = 7.5 * k;
  const hl = 9 * k;
  cx.moveTo(-sw, L / 2);
  cx.lineTo(-sw, -L / 2 + hl);
  cx.lineTo(-hw, -L / 2 + hl);
  cx.lineTo(0, -L / 2);
  cx.lineTo(hw, -L / 2 + hl);
  cx.lineTo(sw, -L / 2 + hl);
  cx.lineTo(sw, L / 2);
  cx.closePath();
  cx.fill();
  cx.restore();
};

/** Draw a sign face onto a canvas (transparent outside the rounded panel). */
const drawSign = (c: HTMLCanvasElement, kind: RoadSignKind, text: string[], font: RoadSignFont = 'inter') => {
  const s = signSize(kind, text);
  const k = s.ppi;
  const W = Math.round((s.w / IN) * k);
  const H = Math.round((s.h / IN) * k);
  c.width = W;
  c.height = H;
  const cx = c.getContext('2d')!;
  cx.clearRect(0, 0, W, H);
  if (kind === 'exit') {
    drawExit(cx, text, k, font);
    return;
  }
  const white = kind === 'speed' || kind === 'oneway';
  const bg = white ? HIGHWAY.signWhite : HIGHWAY.signGreen;
  const ink = white ? HIGHWAY.signInk : HIGHWAY.signWhite;
  roundRect(cx, 0, 0, W, H, (s.r / IN) * k);
  cx.fillStyle = bg;
  cx.fill();
  // the border: inset and width per the sign's size (in inches)
  const [inset, bw] = kind === 'speed' ? [0.75, 1.25] : kind === 'mile' || kind === 'oneway' ? [0.5, 0.75] : [1.0, 1.5];
  const o = (inset + bw / 2) * k;
  roundRect(cx, o, o, W - 2 * o, H - 2 * o, Math.max(2, (s.r / IN - inset - bw / 2) * k));
  cx.strokeStyle = ink;
  cx.lineWidth = bw * k;
  cx.stroke();
  cx.fillStyle = ink;
  cx.textAlign = 'center';
  cx.textBaseline = 'alphabetic';
  /** A line whose caps are `capIn` inches tall with its baseline at `baseIn` inches from the top, squeezed to `maxIn` wide. */
  const line = (t: string, capIn: number, baseIn: number, maxIn: number) => {
    const px = (capIn * k) / capRatio(cx, font);
    cx.font = faceCss(font, px);
    const w = cx.measureText(t).width;
    const sq = Math.min(1, (maxIn * k) / Math.max(1, w));
    cx.save();
    cx.translate(W / 2, baseIn * k);
    cx.scale(sq, 1);
    cx.fillText(t, 0, 0);
    cx.restore();
  };
  if (kind === 'speed') {
    // R2-1 48 × 60: 8 in letters, 20 in numerals
    line(text[0] ?? 'SPEED', 8, 14, 40);
    line(text[1] ?? 'LIMIT', 8, 25, 40);
    line(text[2] ?? '65', 20, 51, 40);
  } else if (kind === 'mile') {
    // D10-3: MILE (3.5 in) over the digits stacked, 8 in each (the panel is 12 in taller per digit)
    const digits = (text[0] ?? '112').split('').slice(0, 3);
    line('MILE', 3.2, 6.5, 10);
    digits.forEach((d, i) => line(d, 8, 18 + i * 10.5, 10));
  } else if (kind === 'oneway') {
    // R6-2 24 × 30: ONE / WAY in 4 in capitals over a black arrow pointing ahead
    line(text[0] ?? 'ONE', 4, 6.5, 18);
    line(text[1] ?? 'WAY', 4, 12, 18);
    const u = k;
    const cx0 = W / 2;
    cx.beginPath();
    cx.moveTo(cx0, 13.6 * u);
    cx.lineTo(cx0 + 6 * u, 20 * u);
    cx.lineTo(cx0 + 2 * u, 20 * u);
    cx.lineTo(cx0 + 2 * u, 27.6 * u);
    cx.lineTo(cx0 - 2 * u, 27.6 * u);
    cx.lineTo(cx0 - 2 * u, 20 * u);
    cx.lineTo(cx0 - 6 * u, 20 * u);
    cx.closePath();
    cx.fill();
  } else {
    // two lines of 13.3 in capitals, centred
    line(text[0] ?? 'NEXT EXIT', 13.3, 36, 140);
    line(text[1] ?? '2 MILES', 13.3, 66, 140);
  }
};

export type RoadSignProps = {
  mood: Mood;
  kind: RoadSignKind;
  /**
   * The legend: 'speed' [SPEED, LIMIT, nn] (or just [nn] via `value`), 'mile' [digits], 'guide' [line 1, line 2],
   * 'oneway' [ONE, WAY], 'exit' [number, legend line 1, optional line 2] (default legend 'Town Center').
   */
  text: string[];
  /** The foot of the sign (its centre line on the ground). */
  position: V3;
  /** The panel's bottom edge above y = 0 (default 7 ft for 'speed', 'guide' and 'exit', 4 ft for 'mile'). */
  bottom?: number;
  /** Retroreflective brightening, 0 → ≈ 0.6 (headlights on it). */
  retro?: number;
  /** The legend's face (default 'inter'; 'overpass' is the highway face, No. 009). */
  font?: RoadSignFont;
};

/** A rounded plate outline (w × h, corner r), its bottom edge at y = 0, centred on x = 0. */
const plateShape = (w: number, h: number, r: number) => {
  const sh = new THREE.Shape();
  sh.moveTo(-w / 2 + r, 0);
  sh.lineTo(w / 2 - r, 0);
  sh.quadraticCurveTo(w / 2, 0, w / 2, r);
  sh.lineTo(w / 2, h - r);
  sh.quadraticCurveTo(w / 2, h, w / 2 - r, h);
  sh.lineTo(-w / 2 + r, h);
  sh.quadraticCurveTo(-w / 2, h, -w / 2, h - r);
  sh.lineTo(-w / 2, r);
  sh.quadraticCurveTo(-w / 2, 0, -w / 2 + r, 0);
  return sh;
};

/** One road sign on its posts (see the file comment). */
export const RoadSign: React.FC<RoadSignProps> = ({mood, kind, text, position, bottom, retro = 0, font = 'inter'}) => {
  const ready = useFontsLoaded();
  const s = signSize(kind, text);
  const b = bottom ?? signBottom(kind);
  const m = MOODS[mood];
  const face = useMemo(() => {
    const c = document.createElement('canvas');
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    const mat = new THREE.MeshStandardMaterial({
      color: raw('#ffffff'),
      roughness: 0.55,
      alphaTest: 0.5,
      emissive: raw('#ffffff'),
      emissiveIntensity: 0,
    });
    return {c, t, mat, key: ''};
  }, []);
  const key = `${kind}|${text.join('/')}|${font}`;
  if (ready && face.key !== key) {
    drawSign(face.c, kind, text, font);
    face.t.needsUpdate = true;
    face.mat.map = face.t;
    face.mat.emissiveMap = face.t;
    face.mat.needsUpdate = true;
    face.key = key;
  }
  face.mat.emissiveIntensity = Math.max(0, retro) / m.exposure;
  const mats = useMemo(
    () => ({
      steel: new THREE.MeshStandardMaterial({color: raw(HIGHWAY.galvanized), roughness: 0.45, metalness: 0.6}),
    }),
    [],
  );
  // the steel backs: one plate, or the exit sign's panel and its plaque (keyed on the sizes, built once)
  const backKey = kind === 'exit' ? `exit|${text[0] ?? ''}|${text.length > 2 ? 2 : 1}` : `${kind}|${s.h.toFixed(4)}`;
  const backs = useMemo(() => {
    const ext = (w: number, h: number, r: number, dx: number, y: number) => {
      const g = new THREE.ExtrudeGeometry(plateShape(w, h, r), {depth: 0.003, bevelEnabled: false, curveSegments: 6});
      g.translate(dx, y, -0.004);
      return g;
    };
    if (backKey.startsWith('exit|')) {
      const e = exitLayout(text);
      const plaqueDx = (e.panel.w / 2 - 6 - e.plaque.w / 2) * IN;
      return [
        ext(e.panel.w * IN, e.panel.h * IN, 6 * IN, 0, 0),
        ext(e.plaque.w * IN, (e.plaque.h + 1.5) * IN, 3 * IN, plaqueDx, (e.panel.h - 1.5) * IN),
      ];
    }
    return [ext(s.w, s.h, s.r, 0, 0)];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backKey]);
  const [x, gy, z] = position;
  // posts: 'speed' two 2.5 in square tubes, 'mile' one U-channel, 'oneway' one square tube, 'guide' and 'exit' two W6 I-beams with breakaway bases
  const posts =
    kind === 'speed'
      ? [-0.38, 0.38].map((dx) => ({dx, w: 0.064, d: 0.064}))
      : kind === 'oneway'
        ? [{dx: 0, w: 0.064, d: 0.064}]
        : kind === 'mile'
          ? [{dx: 0, w: 0.07, d: 0.045}]
          : [-1.25, 1.25].map((dx) => ({dx, w: 0.1, d: 0.15}));
  // posts stop under the top edge (the exit sign's under its panel, not the plaque)
  const top = b + (kind === 'exit' ? exitLayout(text).panel.h * IN : s.h) - 0.08;
  return (
    <group position={[x, 0, z]}>
      {posts.map((p, i) => (
        <group key={i}>
          <mesh material={mats.steel} position={[p.dx, (gy + top) / 2, -0.012 - p.d / 2]} castShadow>
            <boxGeometry args={[p.w, top - gy, p.d]} />
          </mesh>
          {kind === 'guide' || kind === 'exit' ? (
            <mesh material={mats.steel} position={[p.dx, gy + 0.08, -0.012 - p.d / 2]} castShadow>
              <boxGeometry args={[p.w + 0.12, 0.025, p.d + 0.12]} />
            </mesh>
          ) : null}
        </group>
      ))}
      <group position={[0, b, 0]}>
        {backs.map((g, i) => (
          <mesh key={i} geometry={g} material={mats.steel} castShadow />
        ))}
        {ready ? (
          <mesh material={face.mat} position={[0, s.h / 2, 0.0005]}>
            <planeGeometry args={[s.w, s.h]} />
          </mesh>
        ) : null}
      </group>
    </group>
  );
};
