// Outline a line of text from a TTF into one SVG path (font units, y down, baseline at 0).
// usage: node src/brand/outline.mjs font.ttf "Secretly Works" letterSpacingEm wordSpaceEm > out.json
/* global process, console */
import {readFileSync} from 'node:fs';

const [fontPath, text, lsArg, wsArg] = process.argv.slice(2);
const buf = readFileSync(fontPath);
const dv = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
const u16 = (o) => dv.getUint16(o);
const i16 = (o) => dv.getInt16(o);
const u32 = (o) => dv.getUint32(o);

const tables = {};
const numTables = u16(4);
for (let i = 0; i < numTables; i++) {
  const r = 12 + i * 16;
  const tag = String.fromCharCode(buf[r], buf[r + 1], buf[r + 2], buf[r + 3]);
  tables[tag] = u32(r + 8);
}
const head = tables.head;
const unitsPerEm = u16(head + 18);
const locFormat = i16(head + 50);
const numHMetrics = u16(tables.hhea + 34);
const ascender = i16(tables.hhea + 4);
const descender = i16(tables.hhea + 6);
const os2 = tables['OS/2'];
const capHeight = os2 && u16(os2) >= 2 ? i16(os2 + 88) : null;
const xHeight = os2 && u16(os2) >= 2 ? i16(os2 + 86) : null;

const advance = (g) => u16(tables.hmtx + 4 * Math.min(g, numHMetrics - 1));

// cmap: format 4 or 12
function glyphFor(cp) {
  const c = tables.cmap;
  const n = u16(c + 2);
  let best = null;
  for (let i = 0; i < n; i++) {
    const pid = u16(c + 4 + i * 8), eid = u16(c + 6 + i * 8), off = u32(c + 8 + i * 8);
    if (pid === 3 && (eid === 1 || eid === 10)) best = c + off;
    if (pid === 0 && best === null) best = c + off;
  }
  const fmt = u16(best);
  if (fmt === 4) {
    const segX2 = u16(best + 6);
    const ends = best + 14, starts = ends + segX2 + 2, deltas = starts + segX2, ranges = deltas + segX2;
    for (let s = 0; s < segX2 / 2; s++) {
      const end = u16(ends + s * 2), start = u16(starts + s * 2);
      if (cp >= start && cp <= end) {
        const delta = i16(deltas + s * 2), ro = u16(ranges + s * 2);
        if (ro === 0) return (cp + delta) & 0xffff;
        const g = u16(ranges + s * 2 + ro + (cp - start) * 2);
        return g === 0 ? 0 : (g + delta) & 0xffff;
      }
    }
    return 0;
  }
  if (fmt === 12) {
    const ng = u32(best + 12);
    for (let i = 0; i < ng; i++) {
      const s = u32(best + 16 + i * 12), e = u32(best + 20 + i * 12), g = u32(best + 24 + i * 12);
      if (cp >= s && cp <= e) return g + cp - s;
    }
    return 0;
  }
  throw new Error('cmap format ' + fmt);
}

const locaAt = (g) => (locFormat === 0 ? u16(tables.loca + g * 2) * 2 : u32(tables.loca + g * 4));

// Returns contours: arrays of {x, y, on}
function contours(g, tx = [1, 0, 0, 1, 0, 0]) {
  const start = locaAt(g), end = locaAt(g + 1);
  if (start === end) return [];
  const o = tables.glyf + start;
  const nC = i16(o);
  const apply = (x, y) => [tx[0] * x + tx[2] * y + tx[4], tx[1] * x + tx[3] * y + tx[5]];
  if (nC >= 0) {
    const endPts = [];
    for (let i = 0; i < nC; i++) endPts.push(u16(o + 10 + i * 2));
    const nPts = endPts[nC - 1] + 1;
    let p = o + 10 + nC * 2;
    const insLen = u16(p);
    p += 2 + insLen;
    const flags = [];
    while (flags.length < nPts) {
      const f = buf[p++];
      flags.push(f);
      if (f & 8) {
        let r = buf[p++];
        while (r--) flags.push(f);
      }
    }
    const xs = [], ys = [];
    let v = 0;
    for (const f of flags) {
      if (f & 2) { const d = buf[p++]; v += f & 16 ? d : -d; }
      else if (!(f & 16)) { v += i16(p); p += 2; }
      xs.push(v);
    }
    v = 0;
    for (const f of flags) {
      if (f & 4) { const d = buf[p++]; v += f & 32 ? d : -d; }
      else if (!(f & 32)) { v += i16(p); p += 2; }
      ys.push(v);
    }
    const out = [];
    let s = 0;
    for (const e of endPts) {
      const c = [];
      for (let i = s; i <= e; i++) {
        const [x, y] = apply(xs[i], ys[i]);
        c.push({x, y, on: (flags[i] & 1) === 1});
      }
      out.push(c);
      s = e + 1;
    }
    return out;
  }
  // composite
  let p = o + 10;
  const out = [];
  for (;;) {
    const flags = u16(p), glyph = u16(p + 2);
    p += 4;
    let dx, dy;
    if (flags & 1) { dx = i16(p); dy = i16(p + 2); p += 4; }
    else { dx = dv.getInt8(p); dy = dv.getInt8(p + 1); p += 2; }
    let a = 1, b = 0, c = 0, d = 1;
    const f2 = (q) => i16(q) / 16384;
    if (flags & 8) { a = d = f2(p); p += 2; }
    else if (flags & 0x40) { a = f2(p); d = f2(p + 2); p += 4; }
    else if (flags & 0x80) { a = f2(p); b = f2(p + 2); c = f2(p + 4); d = f2(p + 6); p += 8; }
    if (!(flags & 2)) throw new Error('point-matched composite not supported');
    const t = [a, b, c, d, dx, dy];
    // compose: inner t then outer tx
    const m = [
      tx[0] * t[0] + tx[2] * t[1], tx[1] * t[0] + tx[3] * t[1],
      tx[0] * t[2] + tx[2] * t[3], tx[1] * t[2] + tx[3] * t[3],
      tx[0] * t[4] + tx[2] * t[5] + tx[4], tx[1] * t[4] + tx[3] * t[5] + tx[5],
    ];
    out.push(...contours(glyph, m));
    if (!(flags & 0x20)) break;
  }
  return out;
}

// GPOS pair kerning (lookup type 2, also via extension type 9). Only XAdvance of the first glyph.
function coverageIndex(off, g) {
  const fmt = u16(off);
  if (fmt === 1) {
    const n = u16(off + 2);
    for (let i = 0; i < n; i++) if (u16(off + 4 + i * 2) === g) return i;
    return -1;
  }
  const n = u16(off + 2);
  for (let i = 0; i < n; i++) {
    const r = off + 4 + i * 6;
    const s = u16(r), e = u16(r + 2), idx = u16(r + 4);
    if (g >= s && g <= e) return idx + g - s;
  }
  return -1;
}
function classOf(off, g) {
  const fmt = u16(off);
  if (fmt === 1) {
    const s = u16(off + 2), n = u16(off + 4);
    return g >= s && g < s + n ? u16(off + 6 + (g - s) * 2) : 0;
  }
  const n = u16(off + 2);
  for (let i = 0; i < n; i++) {
    const r = off + 4 + i * 6;
    if (g >= u16(r) && g <= u16(r + 2)) return u16(r + 4);
  }
  return 0;
}
const vfSize = (vf) => { let n = 0; for (let i = 0; i < 8; i++) if (vf & (1 << i)) n++; return n * 2; };
const xAdvIn = (p, vf) => {
  // order: XPlacement(1) YPlacement(2) XAdvance(4)
  if (!(vf & 4)) return 0;
  let q = p;
  if (vf & 1) q += 2;
  if (vf & 2) q += 2;
  return i16(q);
};
function pairSub(st, g1, g2) {
  const fmt = u16(st);
  const cov = st + u16(st + 2);
  const vf1 = u16(st + 4), vf2 = u16(st + 6);
  const ci = coverageIndex(cov, g1);
  if (ci < 0) return null;
  if (fmt === 1) {
    const ps = st + u16(st + 10 + ci * 2);
    const n = u16(ps);
    const rec = 2 + vfSize(vf1) + vfSize(vf2);
    for (let i = 0; i < n; i++) {
      const r = ps + 2 + i * rec;
      if (u16(r) === g2) return xAdvIn(r + 2, vf1);
    }
    return null;
  }
  const cd1 = st + u16(st + 8), cd2 = st + u16(st + 10);
  const c1n = u16(st + 12), c2n = u16(st + 14);
  const c1 = classOf(cd1, g1), c2 = classOf(cd2, g2);
  if (c1 >= c1n || c2 >= c2n) return null;
  const rec = vfSize(vf1) + vfSize(vf2);
  return xAdvIn(st + 16 + (c1 * c2n + c2) * rec, vf1);
}
function kern(g1, g2) {
  const gpos = tables.GPOS;
  if (!gpos) return 0;
  const ll = gpos + u16(gpos + 8);
  // only lookups referenced by the 'kern' feature
  const fl = gpos + u16(gpos + 6);
  const lookups = new Set();
  const nf = u16(fl);
  for (let i = 0; i < nf; i++) {
    const r = fl + 2 + i * 6;
    const tag = String.fromCharCode(buf[r], buf[r + 1], buf[r + 2], buf[r + 3]);
    if (tag !== 'kern') continue;
    const f = fl + u16(r + 4);
    const n = u16(f + 2);
    for (let j = 0; j < n; j++) lookups.add(u16(f + 4 + j * 2));
  }
  for (const li of [...lookups].sort((a, b) => a - b)) {
    const lk = ll + u16(ll + 2 + li * 2);
    let type = u16(lk);
    const n = u16(lk + 4);
    for (let s = 0; s < n; s++) {
      let st = lk + u16(lk + 6 + s * 2);
      let t = type;
      if (t === 9) { t = u16(st + 2); st = st + u32(st + 4); }
      if (t !== 2) continue;
      const v = pairSub(st, g1, g2);
      if (v !== null) return v;
    }
  }
  return 0;
}

const r = (n) => Math.round(n * 10) / 10;
function contourToPath(c, ox) {
  // TrueType quadratic contour -> SVG (y flipped)
  const P = (pt) => `${r(pt.x + ox)} ${r(-pt.y)}`;
  const n = c.length;
  let startIdx = c.findIndex((p) => p.on);
  let start;
  if (startIdx < 0) {
    start = {x: (c[0].x + c[1].x) / 2, y: (c[0].y + c[1].y) / 2, on: true};
    startIdx = 0;
  } else start = c[startIdx];
  let d = `M${P(start)}`;
  let ctrl = null;
  for (let k = 1; k <= n; k++) {
    const pt = c[(startIdx + k) % n];
    if (pt.on) {
      d += ctrl ? `Q${P(ctrl)} ${P(pt)}` : `L${P(pt)}`;
      ctrl = null;
    } else if (ctrl) {
      const mid = {x: (ctrl.x + pt.x) / 2, y: (ctrl.y + pt.y) / 2};
      d += `Q${P(ctrl)} ${P(mid)}`;
      ctrl = pt;
    } else ctrl = pt;
  }
  if (ctrl) d += `Q${P(ctrl)} ${P(start)}`;
  return d + 'Z';
}

const ls = Number(lsArg ?? 0) * unitsPerEm;
const ws = Number(wsArg ?? 0) * unitsPerEm; // extra word space
const glyphs = [...text].map((ch) => glyphFor(ch.codePointAt(0)));
let x = 0;
let d = '';
let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
glyphs.forEach((g, i) => {
  for (const c of contours(g)) {
    d += contourToPath(c, x);
    for (const p of c) {
      minX = Math.min(minX, p.x + x); maxX = Math.max(maxX, p.x + x);
      minY = Math.min(minY, -p.y); maxY = Math.max(maxY, -p.y);
    }
  }
  x += advance(g) + (i < glyphs.length - 1 ? kern(g, glyphs[i + 1]) + ls + (text[i] === ' ' ? ws : 0) : 0);
});
const kerns = glyphs.slice(0, -1).map((g, i) => `${text[i]}${text[i + 1]}:${kern(g, glyphs[i + 1])}`);
console.error('kerning', kerns.join(' '));
console.log(
  JSON.stringify({text, unitsPerEm, ascender, descender, capHeight, xHeight, advance: x, bbox: [minX, minY, maxX, maxY], d}),
);
