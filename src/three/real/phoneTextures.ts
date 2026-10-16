import {random} from 'remotion';
import * as THREE from 'three';
import {fonts} from '../../fonts';
import {REAL} from '../../theme';

/*
 * Canvas textures for the realistic phone and its teardown. Drawn once per page (cached), from
 * seeded `random()` only, after the fonts are in (the legends are text). Colours are display-referred
 * like the rest of the kit (no colour-space tag on the textures).
 */

type R = [number, number, number, number]; // x0, y0, x1, y1 in phone units

const cache = new Map<string, THREE.CanvasTexture>();
const make = (key: string, w: number, h: number, draw: (cx: CanvasRenderingContext2D) => void, aniso = 8) => {
  let t = cache.get(key);
  if (t) return t;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const cx = c.getContext('2d')!;
  draw(cx);
  t = new THREE.CanvasTexture(c);
  t.anisotropy = aniso;
  t.generateMipmaps = true;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  cache.set(key, t);
  return t;
};

const rnd = (seed: string) => {
  let i = 0;
  return () => random(`${seed}-${i++}`);
};

/** A part on the logic board, for the board's texture (pads, silkscreen, contact shadow). */
export type BoardPart = {rect: R; kind: 'chip' | 'shield' | 'small' | 'connector'; ref?: string; rot?: boolean};

/**
 * The logic board's top: dark solder mask, copper traces under it, vias, gold pads, white
 * silkscreen outlines and reference designators, and a baked contact shadow round every part
 * (the AO the real-time lights can't give at this size). `bounds` maps the canvas to phone units.
 */
export const boardTexture = (bounds: R, parts: BoardPart[], cutout: R) =>
  make('board', 1400, Math.round((1400 * (bounds[3] - bounds[1])) / (bounds[2] - bounds[0])), (cx) => {
    const W = cx.canvas.width;
    const H = cx.canvas.height;
    const k = W / (bounds[2] - bounds[0]);
    const X = (x: number) => (x - bounds[0]) * k;
    const Y = (y: number) => H - (y - bounds[1]) * k;
    const r = rnd('pcb');
    // mask, with a faint mottling
    cx.fillStyle = REAL.pcb;
    cx.fillRect(0, 0, W, H);
    for (let i = 0; i < 900; i++) {
      cx.fillStyle = `rgba(255,255,255,${0.012 + 0.01 * r()})`;
      cx.fillRect(r() * W, r() * H, 2 + 6 * r(), 2 + 6 * r());
    }
    // traces: orthogonal and 45° runs, the copper showing a step lighter through the mask
    cx.strokeStyle = REAL.trace;
    cx.lineCap = 'round';
    cx.lineJoin = 'round';
    for (let i = 0; i < 260; i++) {
      cx.lineWidth = 1.5 + 3 * r() * r();
      let x = r() * W;
      let y = r() * H;
      cx.beginPath();
      cx.moveTo(x, y);
      for (let s = 0; s < 3; s++) {
        const dir = Math.floor(r() * 8);
        const len = 20 + 140 * r();
        x += Math.round(Math.cos((dir * Math.PI) / 4)) * len;
        y += Math.round(Math.sin((dir * Math.PI) / 4)) * len;
        cx.lineTo(x, y);
      }
      cx.stroke();
    }
    // bus runs: bundles of parallel traces between the big chips
    for (let b = 0; b < 7; b++) {
      const x0 = r() * W;
      const y0 = r() * H;
      const horiz = r() > 0.5;
      const len = 150 + 300 * r();
      cx.lineWidth = 2;
      for (let j = 0; j < 8; j++) {
        cx.beginPath();
        if (horiz) {
          cx.moveTo(x0, y0 + j * 6);
          cx.lineTo(x0 + len, y0 + j * 6);
          cx.lineTo(x0 + len + 30, y0 + j * 6 + 30);
        } else {
          cx.moveTo(x0 + j * 6, y0);
          cx.lineTo(x0 + j * 6, y0 + len);
        }
        cx.stroke();
      }
    }
    // vias
    for (let i = 0; i < 420; i++) {
      const x = r() * W;
      const y = r() * H;
      cx.fillStyle = REAL.pad;
      cx.beginPath();
      cx.arc(x, y, 3.2, 0, Math.PI * 2);
      cx.fill();
      cx.fillStyle = '#0b0d0c';
      cx.beginPath();
      cx.arc(x, y, 1.4, 0, Math.PI * 2);
      cx.fill();
    }
    // contact shadows (baked AO) under every part
    cx.save();
    for (const p of parts) {
      const grow = p.kind === 'small' ? 3 : 9;
      cx.shadowColor = 'rgba(0,0,0,0.85)';
      cx.shadowBlur = p.kind === 'small' ? 5 : 16;
      cx.fillStyle = 'rgba(0,0,0,0.55)';
      cx.fillRect(
        X(p.rect[0]) - grow,
        Y(p.rect[3]) - grow,
        (p.rect[2] - p.rect[0]) * k + 2 * grow,
        (p.rect[3] - p.rect[1]) * k + 2 * grow,
      );
    }
    cx.restore();
    // pads and silkscreen
    cx.font = `600 13px ${fonts.mono}`;
    for (const p of parts) {
      const x0 = X(p.rect[0]);
      const x1 = X(p.rect[2]);
      const y0 = Y(p.rect[3]);
      const y1 = Y(p.rect[1]);
      const w = x1 - x0;
      const h = y1 - y0;
      cx.fillStyle = REAL.pad;
      if (p.kind === 'small') {
        const pw = (p.rot ? h : w) * 0.32;
        if (p.rot) {
          cx.fillRect(x0 - 1, y0 - 2, w + 2, pw);
          cx.fillRect(x0 - 1, y1 - pw + 2, w + 2, pw);
        } else {
          cx.fillRect(x0 - 2, y0 - 1, pw, h + 2);
          cx.fillRect(x1 - pw + 2, y0 - 1, pw, h + 2);
        }
      } else if (p.kind === 'shield') {
        // the shield's soldered fence
        cx.strokeStyle = REAL.pad;
        cx.lineWidth = 5;
        cx.strokeRect(x0 - 3, y0 - 3, w + 6, h + 6);
      }
      if (p.kind !== 'small') {
        cx.strokeStyle = REAL.silk;
        cx.lineWidth = 2;
        cx.setLineDash(p.kind === 'shield' ? [10, 6] : []);
        cx.strokeRect(x0 - 9, y0 - 9, w + 18, h + 18);
        cx.setLineDash([]);
        if (p.kind === 'chip') {
          // pin-1 mark
          cx.fillStyle = REAL.silk;
          cx.beginPath();
          cx.moveTo(x0 - 14, y0 - 14);
          cx.lineTo(x0 - 2, y0 - 14);
          cx.lineTo(x0 - 14, y0 - 2);
          cx.fill();
        }
      }
      if (p.ref) {
        cx.fillStyle = REAL.silk;
        cx.textAlign = 'left';
        cx.fillText(p.ref, x0, y0 - (p.kind === 'small' ? 5 : 14));
      }
    }
    // test points and board legends
    cx.font = `600 12px ${fonts.mono}`;
    for (let i = 0; i < 26; i++) {
      const x = r() * W;
      const y = r() * H;
      cx.fillStyle = REAL.pad;
      cx.beginPath();
      cx.arc(x, y, 6, 0, Math.PI * 2);
      cx.fill();
      cx.fillStyle = REAL.silk;
      cx.fillText(`TP${100 + Math.floor(r() * 800)}`, x + 9, y + 4);
    }
    cx.font = `700 18px ${fonts.mono}`;
    cx.fillStyle = REAL.silk;
    cx.fillText('MLB  REV 1.3  2641', X(0.06), Y(0.165));
    cx.font = `600 14px ${fonts.mono}`;
    cx.fillText('820-04417-A', X(-0.04), Y(0.51));
    // the camera cut-out (outside the board's outline; never seen)
    cx.clearRect(X(cutout[0]), Y(cutout[3]), (cutout[2] - cutout[0]) * k, (cutout[3] - cutout[1]) * k);
  });

/** A chip's top: matte black package with a laser-etched legend and a pin-1 dot. */
export const chipTexture = (lines: string[], key: string) =>
  make(`chip:${key}`, 256, 256, (cx) => {
    cx.fillStyle = REAL.chip;
    cx.fillRect(0, 0, 256, 256);
    const r = rnd(`chip-${key}`);
    for (let i = 0; i < 600; i++) {
      cx.fillStyle = `rgba(255,255,255,${0.02 * r()})`;
      cx.fillRect(r() * 256, r() * 256, 2, 2);
    }
    cx.fillStyle = REAL.chipInk;
    cx.textAlign = 'left';
    const size = lines.length > 3 ? 26 : 30;
    cx.font = `600 ${size}px ${fonts.mono}`;
    lines.forEach((l, i) => cx.fillText(l, 30, 80 + i * (size + 12)));
    cx.beginPath();
    cx.arc(30, 30, 9, 0, Math.PI * 2);
    cx.fill();
  });

/** An RF shield can's top: tin plate with a fine grain, a row of vent holes and a pick-up pad. */
export const shieldTexture = () =>
  make('shield', 512, 512, (cx) => {
    const g = cx.createLinearGradient(0, 0, 512, 512);
    g.addColorStop(0, '#c4c8cd');
    g.addColorStop(1, '#a9adb3');
    cx.fillStyle = g;
    cx.fillRect(0, 0, 512, 512);
    const r = rnd('shield');
    for (let i = 0; i < 2500; i++) {
      const v = r();
      cx.fillStyle = v > 0.5 ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
      cx.fillRect(r() * 512, r() * 512, 1 + 30 * r(), 1);
    }
    // vent holes
    cx.fillStyle = 'rgba(20,22,26,0.85)';
    for (let i = 0; i < 6; i++) for (let j = 0; j < 2; j++) cx.fillRect(60 + i * 70, 40 + j * 24, 36, 10);
    // embossed stiffening rib
    cx.strokeStyle = 'rgba(0,0,0,0.12)';
    cx.lineWidth = 6;
    cx.strokeRect(40, 110, 432, 360);
    cx.strokeStyle = 'rgba(255,255,255,0.18)';
    cx.lineWidth = 2;
    cx.strokeRect(44, 114, 432, 360);
  });

/**
 * The battery's printed label: dark foil, specs, warnings in small print, a barcode and a dot
 * code. Generic: an invented model, no maker, no certification marks. Aspect w : h.
 */
export const batteryTexture = (aspect: number) =>
  make('battery', 1024, Math.round(1024 / aspect), (cx) => {
    const W = cx.canvas.width;
    const H = cx.canvas.height;
    const g = cx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, '#303237');
    g.addColorStop(1, REAL.battery);
    cx.fillStyle = g;
    cx.fillRect(0, 0, W, H);
    const r = rnd('battery');
    // foil wrinkles
    for (let i = 0; i < 40; i++) {
      cx.strokeStyle = `rgba(255,255,255,${0.015 + 0.02 * r()})`;
      cx.lineWidth = 2 + 6 * r();
      cx.beginPath();
      const y = r() * H;
      cx.moveTo(0, y);
      cx.bezierCurveTo(W * 0.3, y + 40 * (r() - 0.5), W * 0.7, y + 40 * (r() - 0.5), W, y + 30 * (r() - 0.5));
      cx.stroke();
    }
    cx.fillStyle = REAL.batteryInk;
    cx.textAlign = 'left';
    const L = 90;
    cx.font = `700 54px ${fonts.sans}`;
    cx.fillText('Li-ion Polymer Battery', L, 190);
    cx.font = `600 34px ${fonts.mono}`;
    cx.fillText('Rated  3.88 V  ·  4,380 mAh  ·  17.00 Wh', L, 260);
    cx.fillText('Limited charge voltage  4.47 V', L, 310);
    cx.fillText('Model  CELL-07   Rev A', L, 360);
    cx.font = `500 22px ${fonts.sans}`;
    const warn = [
      'Caution: risk of fire and burns. Do not open, crush, heat above 60 °C or incinerate.',
      'Do not puncture or short-circuit. Use only with the device it was designed for.',
      'Replace only with an approved cell. Dispose of according to local regulations.',
    ];
    warn.forEach((wl, i) => cx.fillText(wl, L, 440 + i * 32));
    // barcode
    let x = L;
    const by = H - 300;
    while (x < L + 440) {
      const w = 2 + Math.floor(r() * 4) * 2;
      if (r() > 0.4) cx.fillRect(x, by, w, 120);
      x += w + 2;
    }
    cx.font = `600 24px ${fonts.mono}`;
    cx.fillText('C2641 0731 8842 06', L, by + 156);
    // dot code
    const qx = W - 290;
    const qy = H - 320;
    for (let i = 0; i < 21; i++)
      for (let j = 0; j < 21; j++) {
        const finder = (i < 7 && j < 7) || (i > 13 && j < 7) || (i < 7 && j > 13);
        const on = finder
          ? i % 6 === 0 || j % 6 === 0 || (i % 7 > 1 && i % 7 < 5 && j % 7 > 1 && j % 7 < 5)
          : r() > 0.5;
        if (on) cx.fillRect(qx + i * 9, qy + j * 9, 9, 9);
      }
    // a thin printed border
    cx.strokeStyle = 'rgba(216,217,211,0.45)';
    cx.lineWidth = 3;
    cx.strokeRect(50, 90, W - 100, H - 140);
  });

/** Speaker mesh / grille: a fine dark hole grid on black. */
export const grilleTexture = () =>
  make('grille', 256, 128, (cx) => {
    cx.fillStyle = '#18191c';
    cx.fillRect(0, 0, 256, 128);
    cx.fillStyle = '#050506';
    for (let i = 0; i < 32; i++)
      for (let j = 0; j < 14; j++) {
        cx.beginPath();
        cx.arc(6 + i * 8 + (j % 2) * 4, 6 + j * 8.5, 2.4, 0, Math.PI * 2);
        cx.fill();
      }
  });

/**
 * Baked occlusion for the cavity floor (the midframe): darker toward the frame walls and round
 * the battery's footprint. `bounds` is the cavity, `blockers` the parts sitting on it.
 */
export const floorTexture = (bounds: R, blockers: R[]) =>
  make('floor', 512, Math.round((512 * (bounds[3] - bounds[1])) / (bounds[2] - bounds[0])), (cx) => {
    const W = cx.canvas.width;
    const H = cx.canvas.height;
    const k = W / (bounds[2] - bounds[0]);
    cx.fillStyle = REAL.midframe;
    cx.fillRect(0, 0, W, H);
    const r = rnd('floor');
    for (let i = 0; i < 1500; i++) {
      cx.fillStyle = `rgba(255,255,255,${0.03 * r()})`;
      cx.fillRect(r() * W, r() * H, 1 + 20 * r(), 1);
    }
    cx.save();
    cx.shadowColor = 'rgba(0,0,0,0.9)';
    cx.shadowBlur = 18;
    cx.fillStyle = 'rgba(0,0,0,0.6)';
    for (const b of blockers) {
      cx.fillRect(
        (b[0] - bounds[0]) * k - 4,
        H - (b[3] - bounds[1]) * k - 4,
        (b[2] - b[0]) * k + 8,
        (b[3] - b[1]) * k + 8,
      );
    }
    cx.restore();
    // walls
    const edge = 26;
    const grads: [number, number, number, number][] = [
      [0, 0, edge, 0],
      [W, 0, W - edge, 0],
      [0, 0, 0, edge],
      [0, H, 0, H - edge],
    ];
    for (const [x0, y0, x1, y1] of grads) {
      const g = cx.createLinearGradient(x0, y0, x1, y1);
      g.addColorStop(0, 'rgba(0,0,0,0.55)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      cx.fillStyle = g;
      cx.fillRect(0, 0, W, H);
    }
  });

/** A flex cable's surface: black coverlay with faint copper lines along it and a gold contact end. */
export const flexTexture = () =>
  make('flex', 64, 512, (cx) => {
    cx.fillStyle = REAL.flex;
    cx.fillRect(0, 0, 64, 512);
    cx.strokeStyle = 'rgba(160,150,120,0.16)';
    cx.lineWidth = 2;
    for (let i = 0; i < 6; i++) {
      cx.beginPath();
      cx.moveTo(8 + i * 9.5, 0);
      cx.lineTo(8 + i * 9.5, 512);
      cx.stroke();
    }
  });

/** A soft round glow (additive), for the lit chip. */
export const glowTexture = () =>
  make(
    'glow',
    128,
    128,
    (cx) => {
      const g = cx.createRadialGradient(64, 64, 0, 64, 64, 64);
      g.addColorStop(0, 'rgba(255,255,255,1)');
      g.addColorStop(0.35, 'rgba(255,255,255,0.45)');
      g.addColorStop(1, 'rgba(255,255,255,0)');
      cx.fillStyle = g;
      cx.fillRect(0, 0, 128, 128);
    },
    1,
  );

/**
 * A studio reflection on glass: a soft diagonal band and a faint falloff, drawn as light to be
 * added on top (the HDRI alone leaves a screen facing the camera with almost no visible reflection).
 */
export const glassStreakTexture = () =>
  make(
    'glass-streak',
    256,
    512,
    (cx) => {
      const g = cx.createLinearGradient(0, 0, 256, 512);
      g.addColorStop(0, 'rgba(255,255,255,0.55)');
      g.addColorStop(0.28, 'rgba(255,255,255,0.12)');
      g.addColorStop(0.42, 'rgba(255,255,255,0.0)');
      g.addColorStop(0.58, 'rgba(255,255,255,0.0)');
      g.addColorStop(0.66, 'rgba(255,255,255,0.22)');
      g.addColorStop(0.74, 'rgba(255,255,255,0.0)');
      g.addColorStop(1, 'rgba(255,255,255,0.0)');
      cx.fillStyle = g;
      cx.fillRect(0, 0, 256, 512);
    },
    1,
  );

/** The router's top vent grille: rows of rounded slots (dark, on transparent). */
export const routerVentTexture = () =>
  make('router-vent', 512, 256, (cx) => {
    cx.fillStyle = 'rgba(12,13,15,0.85)';
    for (let r = 0; r < 7; r++)
      for (let k = 0; k < 9; k++) {
        cx.beginPath();
        cx.roundRect(18 + k * 54 + (r % 2) * 27, 20 + r * 32, 36, 12, 6);
        cx.fill();
      }
  });

/**
 * The router's front print (transparent): a fine rule, a capacity mark, and the status icons
 * (power, Wi-Fi, internet) above the three neutral LEDs. Laid out for a 0.40 × 0.09 plane centred
 * at x −0.05 on a 0.56-wide body (LEDs at x −0.16, −0.10, −0.04).
 */
export const routerPrintTexture = () =>
  make('router-print', 1024, 230, (cx) => {
    const X = (x: number) => ((x + 0.25) / 0.4) * 1024;
    const Y = (y: number) => ((0.045 - y) / 0.09) * 230;
    cx.strokeStyle = 'rgba(70,72,78,0.8)';
    cx.fillStyle = 'rgba(70,72,78,0.85)';
    cx.lineWidth = 5;
    cx.lineCap = 'round';
    const iy = Y(0.006);
    // power
    let x = X(-0.16);
    cx.beginPath();
    cx.arc(x, iy, 16, -Math.PI * 0.3, Math.PI * 1.3);
    cx.stroke();
    cx.beginPath();
    cx.moveTo(x, iy - 22);
    cx.lineTo(x, iy - 4);
    cx.stroke();
    // Wi-Fi
    x = X(-0.1);
    for (const r of [8, 18, 28]) {
      cx.beginPath();
      cx.arc(x, iy + 14, r, -Math.PI * 0.78, -Math.PI * 0.22);
      cx.stroke();
    }
    cx.beginPath();
    cx.arc(x, iy + 14, 3.5, 0, Math.PI * 2);
    cx.fill();
    // internet (a globe)
    x = X(-0.04);
    cx.beginPath();
    cx.arc(x, iy, 17, 0, Math.PI * 2);
    cx.stroke();
    cx.beginPath();
    cx.ellipse(x, iy, 7, 17, 0, 0, Math.PI * 2);
    cx.stroke();
    cx.beginPath();
    cx.moveTo(x - 17, iy);
    cx.lineTo(x + 17, iy);
    cx.stroke();
    // capacity mark and a fine rule
    cx.font = `700 34px ${fonts.sans}`;
    cx.textAlign = 'left';
    cx.fillText('AX3000', X(0.02), Y(0.0) + 12);
    cx.fillRect(X(-0.24), Y(-0.036), X(0.14) - X(-0.24), 2);
  });
