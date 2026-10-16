import * as THREE from 'three';

/** A rounded-rectangle path (true circular corners), centred on (cx, cy). */
export const rrPath = <T extends THREE.Path>(p: T, w: number, h: number, r: number, cx = 0, cy = 0): T => {
  const x = w / 2;
  const y = h / 2;
  const rr = Math.max(0.0001, Math.min(r, x, y));
  p.moveTo(cx - x + rr, cy - y);
  p.lineTo(cx + x - rr, cy - y);
  p.absarc(cx + x - rr, cy - y + rr, rr, -Math.PI / 2, 0, false);
  p.lineTo(cx + x, cy + y - rr);
  p.absarc(cx + x - rr, cy + y - rr, rr, 0, Math.PI / 2, false);
  p.lineTo(cx - x + rr, cy + y);
  p.absarc(cx - x + rr, cy + y - rr, rr, Math.PI / 2, Math.PI, false);
  p.lineTo(cx - x, cy - y + rr);
  p.absarc(cx - x + rr, cy - y + rr, rr, Math.PI, Math.PI * 1.5, false);
  return p;
};

export const rrShape = (w: number, h: number, r: number, cx = 0, cy = 0) => rrPath(new THREE.Shape(), w, h, r, cx, cy);

/** A rounded-rectangle ring: outer w × h (corner r) minus the inner one inset by `t`. */
export const rrRing = (w: number, h: number, r: number, t: number) => {
  const s = rrShape(w, h, r);
  s.holes.push(rrPath(new THREE.Path(), w - 2 * t, h - 2 * t, Math.max(0.001, r - t)));
  return s;
};

const cache = new Map<string, THREE.BufferGeometry>();
const memo = (key: string, make: () => THREE.BufferGeometry) => {
  let g = cache.get(key);
  if (!g) {
    g = make();
    cache.set(key, g);
  }
  return g;
};

/**
 * A slab with soft rounded edges: the shape extruded `depth` along +z from z = 0, with a round
 * bevel of `bevel` on both faces (the outline stays `w` × `h`). Cached by its arguments.
 */
export const roundedSlab = (w: number, h: number, depth: number, r: number, bevel: number, hole?: number) =>
  memo(`slab:${w}:${h}:${depth}:${r}:${bevel}:${hole ?? ''}`, () => {
    const b = Math.min(bevel, depth / 2 - 0.0002);
    const s = rrShape(w - 2 * b, h - 2 * b, Math.max(0.001, r - b));
    if (hole !== undefined) {
      s.holes.push(rrPath(new THREE.Path(), w - 2 * hole + 2 * b, h - 2 * hole + 2 * b, Math.max(0.001, r - hole + b)));
    }
    const g = new THREE.ExtrudeGeometry(s, {
      depth: depth - 2 * b,
      bevelEnabled: b > 0,
      bevelThickness: b,
      bevelSize: b,
      bevelSegments: 5,
      curveSegments: 18,
    });
    g.translate(0, 0, b);
    g.computeVertexNormals();
    return g;
  });

/** A flat rounded rectangle (UVs 0–1 across its bounding box), facing +z. */
export const roundedPlane = (w: number, h: number, r: number) =>
  memo(`rplane:${w}:${h}:${r}`, () => {
    const g = new THREE.ShapeGeometry(rrShape(w, h, r), 18);
    const uv = g.attributes.uv as THREE.BufferAttribute;
    const pos = g.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < uv.count; i++) uv.setXY(i, pos.getX(i) / w + 0.5, pos.getY(i) / h + 0.5);
    return g;
  });

/** A flat rounded ring, facing +z (a cut face, or an ink line when `t` is the ink width). */
export const roundedRingPlane = (w: number, h: number, r: number, t: number) =>
  memo(`rring:${w}:${h}:${r}:${t}`, () => new THREE.ShapeGeometry(rrRing(w, h, r, t), 18));
