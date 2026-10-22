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
 */

export type RoadSignKind = 'speed' | 'mile' | 'guide' | 'oneway';

const IN = 0.0254;

/** Panel sizes (m) and the canvas scale (px per inch). */
export const SIGN_SIZE: Record<RoadSignKind, {w: number; h: number; ppi: number; r: number}> = {
  speed: {w: 48 * IN, h: 60 * IN, ppi: 10, r: 3 * IN},
  mile: {w: 12 * IN, h: 48 * IN, ppi: 20, r: 1.5 * IN},
  guide: {w: 156 * IN, h: 84 * IN, ppi: 8, r: 9 * IN},
  oneway: {w: 24 * IN, h: 30 * IN, ppi: 16, r: 1.5 * IN},
};

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

/** Draw a sign face onto a canvas (transparent outside the rounded panel). */
const drawSign = (c: HTMLCanvasElement, kind: RoadSignKind, text: string[]) => {
  const s = SIGN_SIZE[kind];
  const k = s.ppi;
  const W = Math.round((s.w / IN) * k);
  const H = Math.round((s.h / IN) * k);
  c.width = W;
  c.height = H;
  const cx = c.getContext('2d')!;
  cx.clearRect(0, 0, W, H);
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
    const px = (capIn * k) / CAP;
    cx.font = `700 ${px}px ${fonts.sans}, Arial`;
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
    // D10-3: MILE (3.5 in) over the digits stacked, 8 in each
    const digits = (text[0] ?? '112').split('');
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
  /** The legend: 'speed' [SPEED, LIMIT, nn] (or just [nn] via `value`), 'mile' [digits], 'guide' [line 1, line 2], 'oneway' [ONE, WAY]. */
  text: string[];
  /** The foot of the sign (its centre line on the ground). */
  position: V3;
  /** The panel's bottom edge above y = 0 (default 7 ft for 'speed' and 'guide', 4 ft for 'mile'). */
  bottom?: number;
  /** Retroreflective brightening, 0 → ≈ 0.6 (headlights on it). */
  retro?: number;
};

/** One road sign on its posts (see the file comment). */
export const RoadSign: React.FC<RoadSignProps> = ({mood, kind, text, position, bottom, retro = 0}) => {
  const ready = useFontsLoaded();
  const s = SIGN_SIZE[kind];
  const b = bottom ?? (kind === 'mile' ? 48 * IN : 84 * IN);
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
  const key = `${kind}|${text.join('/')}`;
  if (ready && face.key !== key) {
    drawSign(face.c, kind, text);
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
  const back = useMemo(() => {
    const sh = new THREE.Shape();
    const {w, h, r} = s;
    sh.moveTo(-w / 2 + r, 0);
    sh.lineTo(w / 2 - r, 0);
    sh.quadraticCurveTo(w / 2, 0, w / 2, r);
    sh.lineTo(w / 2, h - r);
    sh.quadraticCurveTo(w / 2, h, w / 2 - r, h);
    sh.lineTo(-w / 2 + r, h);
    sh.quadraticCurveTo(-w / 2, h, -w / 2, h - r);
    sh.lineTo(-w / 2, r);
    sh.quadraticCurveTo(-w / 2, 0, -w / 2 + r, 0);
    const g = new THREE.ExtrudeGeometry(sh, {depth: 0.003, bevelEnabled: false, curveSegments: 6});
    g.translate(0, 0, -0.004);
    return g;
  }, [s]);
  const [x, gy, z] = position;
  // posts: 'speed' two 2.5 in square tubes, 'mile' one U-channel, 'oneway' one square tube, 'guide' two W6 I-beams with breakaway bases
  const posts =
    kind === 'speed'
      ? [-0.38, 0.38].map((dx) => ({dx, w: 0.064, d: 0.064}))
      : kind === 'oneway'
        ? [{dx: 0, w: 0.064, d: 0.064}]
        : kind === 'mile'
          ? [{dx: 0, w: 0.07, d: 0.045}]
          : [-1.25, 1.25].map((dx) => ({dx, w: 0.1, d: 0.15}));
  const top = b + s.h - 0.08;
  return (
    <group position={[x, 0, z]}>
      {posts.map((p, i) => (
        <group key={i}>
          <mesh material={mats.steel} position={[p.dx, (gy + top) / 2, -0.012 - p.d / 2]} castShadow>
            <boxGeometry args={[p.w, top - gy, p.d]} />
          </mesh>
          {kind === 'guide' ? (
            <mesh material={mats.steel} position={[p.dx, gy + 0.08, -0.012 - p.d / 2]} castShadow>
              <boxGeometry args={[p.w + 0.12, 0.025, p.d + 0.12]} />
            </mesh>
          ) : null}
        </group>
      ))}
      <group position={[0, b, 0]}>
        <mesh geometry={back} material={mats.steel} castShadow />
        {ready ? (
          <mesh material={face.mat} position={[0, s.h / 2, 0.0005]}>
            <planeGeometry args={[s.w, s.h]} />
          </mesh>
        ) : null}
      </group>
    </group>
  );
};
