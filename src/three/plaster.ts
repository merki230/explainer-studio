import * as THREE from 'three';
import {theme} from '../theme';

/*
 * Plaster Museum material kit.
 *
 * Colour handling: the museum look was designed with "display-referred" colours
 * (hex values are used as-is in lighting, and the post pass writes them out
 * without an sRGB curve). `raw()` builds a Color that skips three's sRGB→linear
 * conversion, so `#e8e3da` lights exactly like it did in the approved mock-up.
 * Anything drawn inside a <MuseumStage> must take its colours from `raw()`.
 */
export const raw = (hex: string): THREE.Color => new THREE.Color().setStyle(hex, THREE.LinearSRGBColorSpace);

const cache = new Map<string, unknown>();
const memo = <T>(key: string, make: () => T): T => {
  if (!cache.has(key)) cache.set(key, make());
  return cache.get(key) as T;
};

/** Matte plaster. Shared per (colour, roughness); never mutate the result. */
export const plaster = (color: string = theme.plaster, roughness = 0.92): THREE.MeshStandardMaterial =>
  memo(
    `plaster:${color}:${roughness}`,
    () => new THREE.MeshStandardMaterial({color: raw(color), roughness, metalness: 0}),
  );

/**
 * The stain line a path leaves behind: flat (unlit, so it reads as pigment on
 * the plaster, not as a lit cable) and translucent.
 */
export const stainMaterial = (): THREE.MeshBasicMaterial =>
  memo(
    'stain',
    () =>
      new THREE.MeshBasicMaterial({
        color: raw(theme.orangeStainLine),
        transparent: true,
        opacity: 0.7,
        depthWrite: false,
      }),
  );

/** Soft wide edge around the stain line, so it bleeds into the plaster. */
export const stainSoftMaterial = (): THREE.MeshBasicMaterial =>
  memo(
    'stain-soft',
    () =>
      new THREE.MeshBasicMaterial({
        color: raw(theme.orangeStainLine),
        transparent: true,
        opacity: 0.12,
        depthWrite: false,
      }),
  );

/** Lit orange surface (an object the system has claimed): matte, takes shadows like plaster. */
export const stainSurface = (): THREE.MeshStandardMaterial =>
  memo('stain-surface', () => new THREE.MeshStandardMaterial({color: raw(theme.orangeStain), roughness: 0.9}));

/**
 * Box with rounded edges (extruded rounded rectangle with a bevel). Bevels catch
 * the light, which is most of what makes simple shapes look finished.
 * `segments` smooths the bevel: 3 is fine for small parts, 5 for big ones the
 * camera gets close to (couch, cushions). Centred on the origin. Cached by size.
 */
export const roundedBox = (w: number, h: number, d: number, r: number, segments = 3): THREE.BufferGeometry =>
  memo(`rbox:${w}:${h}:${d}:${r}:${segments}`, () => {
    r = Math.min(r, w / 2 - 0.002, h / 2 - 0.002, d / 2 - 0.002);
    const x = w / 2 - r;
    const y = h / 2 - r;
    const cr = Math.min(r, x, y);
    const s = new THREE.Shape();
    s.moveTo(-x + cr, -y);
    s.lineTo(x - cr, -y);
    s.quadraticCurveTo(x, -y, x, -y + cr);
    s.lineTo(x, y - cr);
    s.quadraticCurveTo(x, y, x - cr, y);
    s.lineTo(-x + cr, y);
    s.quadraticCurveTo(-x, y, -x, y - cr);
    s.lineTo(-x, -y + cr);
    s.quadraticCurveTo(-x, -y, -x + cr, -y);
    const g = new THREE.ExtrudeGeometry(s, {
      depth: Math.max(0.0001, d - 2 * r),
      bevelEnabled: true,
      bevelThickness: r,
      bevelSize: r,
      bevelSegments: segments,
      curveSegments: Math.max(4, segments + 1),
    });
    g.translate(0, 0, -(d - 2 * r) / 2);
    g.computeVertexNormals();
    return g;
  });

/**
 * Cylinder with rounded top and bottom edges (a lathe), for plinths and pedestals.
 * Centred on the origin, axis along y. Cached by size.
 */
export const roundedCylinder = (radius: number, height: number, r: number, segments = 48): THREE.BufferGeometry =>
  memo(`rcyl:${radius}:${height}:${r}:${segments}`, () => {
    r = Math.min(r, radius - 0.001, height / 2 - 0.001);
    const h = height / 2;
    const pts: THREE.Vector2[] = [new THREE.Vector2(0, -h)];
    const corner = (cx: number, cy: number, a0: number) => {
      for (let i = 0; i <= 6; i++) {
        const a = a0 + (i / 6) * (Math.PI / 2);
        pts.push(new THREE.Vector2(cx + Math.cos(a) * r, cy + Math.sin(a) * r));
      }
    };
    corner(radius - r, -h + r, -Math.PI / 2);
    corner(radius - r, h - r, 0);
    pts.push(new THREE.Vector2(0, h));
    const g = new THREE.LatheGeometry(pts, segments);
    g.computeVertexNormals();
    return g;
  });

/** Capsule between two points (a limb). Returns geometry + placement. */
export const limb = (a: THREE.Vector3, b: THREE.Vector3, radius: number) => {
  const dir = new THREE.Vector3().subVectors(b, a);
  const len = dir.length();
  const geometry = memo(
    `limb:${radius}:${len.toFixed(4)}`,
    // 8 cap / 32 radial segments: at 4 / 12 the close framings (the bookends' pull) showed a polygonal
    // silhouette on the forearms and per-facet shadow-terminator bands down the shins
    () => new THREE.CapsuleGeometry(radius, Math.max(0.001, len), 8, 32),
  );
  const position = a.clone().addScaledVector(dir, 0.5);
  const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  return {geometry, position, quaternion};
};

/** Radial gradient texture (computed, so it's identical on every render). */
const radialTexture = (key: string, rgb: [number, number, number], stops: [number, number][]) =>
  memo(key, () => {
    const N = 128;
    const data = new Uint8Array(N * N * 4);
    for (let j = 0; j < N; j++) {
      for (let i = 0; i < N; i++) {
        const dx = (i + 0.5) / N - 0.5;
        const dy = (j + 0.5) / N - 0.5;
        const d = Math.min(1, Math.sqrt(dx * dx + dy * dy) * 2);
        let a = 0;
        for (let k = 0; k < stops.length - 1; k++) {
          const [p0, a0] = stops[k];
          const [p1, a1] = stops[k + 1];
          if (d >= p0 && d <= p1) {
            a = a0 + ((a1 - a0) * (d - p0)) / (p1 - p0);
            break;
          }
        }
        const o = (j * N + i) * 4;
        data[o] = rgb[0];
        data[o + 1] = rgb[1];
        data[o + 2] = rgb[2];
        data[o + 3] = Math.round(a * 255);
      }
    }
    const tex = new THREE.DataTexture(data, N, N, THREE.RGBAFormat);
    tex.magFilter = THREE.LinearFilter;
    tex.minFilter = THREE.LinearFilter;
    tex.needsUpdate = true;
    return tex;
  });

/** Soft dark disc for contact shadows. */
export const blobTexture = () =>
  radialTexture(
    'blob',
    [0, 0, 0],
    [
      [0, 0.55],
      [0.55, 0.18],
      [1, 0],
    ],
  );

/** Soft orange disc for the wash the system leaves on a wall. */
export const washTexture = () =>
  radialTexture(
    'wash',
    [255, 91, 20],
    [
      [0, 0.9],
      [0.45, 0.35],
      [1, 0],
    ],
  );

/**
 * Soft horizontal band for a scan line: a 1 × 64 alpha ramp, transparent at the
 * top, rising to full near the bottom edge (the leading edge of a downward
 * sweep), then a short fade. Orange; computed, so identical on every render.
 */
export const scanTexture = () =>
  memo('scan', () => {
    const N = 64;
    const data = new Uint8Array(N * 4);
    for (let j = 0; j < N; j++) {
      // v = 0 at the bottom row of the texture
      const v = (j + 0.5) / N;
      const lead = Math.min(1, v / 0.14);
      const trail = Math.pow(Math.max(0, 1 - (v - 0.14) / 0.86), 2.2);
      const a = v < 0.14 ? lead * lead * (3 - 2 * lead) : trail;
      data[j * 4] = 255;
      data[j * 4 + 1] = 91;
      data[j * 4 + 2] = 20;
      data[j * 4 + 3] = Math.round(a * 255);
    }
    const tex = new THREE.DataTexture(data, 1, N, THREE.RGBAFormat);
    tex.magFilter = THREE.LinearFilter;
    tex.minFilter = THREE.LinearFilter;
    tex.needsUpdate = true;
    return tex;
  });

/** Soft white disc (smooth falloff to the edge), for steam and other airborne wisps. */
export const softTexture = () =>
  radialTexture(
    'soft',
    [255, 255, 255],
    [
      [0, 0.85],
      [0.35, 0.5],
      [0.7, 0.14],
      [1, 0],
    ],
  );
