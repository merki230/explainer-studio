/**
 * "Real to section" reveals (style guide § 11.6.1), per video: the real building's measured screen box in the clip
 * (for the footage's line, wipe and dissolves) and the 3D camera over the footage (for the scene underneath). Pure data;
 * frames are the video's (F0 = the clip's first frame, 30 fps).
 *
 * `datacenter-water` (Pexels 38081600 cut, `footage/opening.mp4`): the main box's corners measured by eye on full-res
 * crops at F0, F66 and F90 (± 3 px), F96 extrapolated. The 3D camera is NOT a solve within § 11.6.1's 8 px: N1's data
 * centre (14 × 6 m, 9.4 m to the parapet) can't take the clip box's proportions (its long face ≈ 2.3 × its height on
 * screen); a least-squares fit of the six visible corners leaves ≈ 70–90 px RMS. The track below instead frames the DC on
 * the clip box's screen area (centre and width) from a clip-like angle, and the reveal hands over on the dissolve.
 */

type V3 = [number, number, number];
type P2 = [number, number];

/** The real box's visible corners at one frame (1920 × 1080 px). */
export type RevealBoxKey = {
  f: number;
  /** Front-left top / bottom (the section line runs between them), near corner top / bottom, right-back top / bottom, back-left top. */
  flt: P2;
  flb: P2;
  nt: P2;
  nb: P2;
  rbt: P2;
  rbb: P2;
  blt: P2;
};

/** One key of the 3D camera over the footage: look-at, distance, direction (yaw about +y from +z, pitch down), vertical fov. */
export type RevealCamKey = {f: number; look: V3; distance: number; yaw: number; pitch: number; fov: number};

export type Reveal = {
  box: RevealBoxKey[];
  track: RevealCamKey[];
  /** The section line draws (F54 → 66), the facade wipes (66 → 90), the box behind cross-fades (72 → 90), the surroundings dissolve (66 → 96). */
  line: [number, number];
  wipe: [number, number];
  fade: [number, number];
  dissolve: [number, number];
  /** The camera leaves the track at `release` and lands on the scene's own camera at `land` (the dolly-zoom and angle glide). */
  release: number;
  land: number;
  /** The orange tell (node dots pulse once) from this frame. */
  tell: number;
};

const deg = Math.PI / 180;

export const REVEALS: Record<string, Reveal> = {
  'datacenter-water': {
    box: [
      {f: 0, flt: [478, 370], flb: [482, 540], nt: [894, 464], nb: [896, 690], rbt: [1260, 368], rbb: [1256, 540], blt: [870, 308]},
      {f: 66, flt: [462, 388], flb: [466, 562], nt: [970, 472], nb: [972, 690], rbt: [1242, 362], rbb: [1250, 530], blt: [828, 310]},
      {f: 90, flt: [456, 392], flb: [462, 572], nt: [996, 476], nb: [998, 692], rbt: [1242, 360], rbb: [1246, 532], blt: [810, 310]},
      {f: 96, flt: [455, 393], flb: [461, 575], nt: [1003, 477], nb: [1005, 693], rbt: [1242, 360], rbb: [1245, 533], blt: [805, 310]},
    ],
    // least-squares on the front face's corners and the right-back top (lens bounded to 30–50°, pitch 11–26°):
    // residuals 25–85 px (the DC is taller for its width than the clip box), see the file comment
    track: [
      {f: 0, look: [7.69, 4.62, -0.5], distance: 56.9, yaw: 29.2 * deg, pitch: 25.8 * deg, fov: 30},
      {f: 96, look: [5.56, 4.23, -0.5], distance: 53.6, yaw: 17.5 * deg, pitch: 25.5 * deg, fov: 30},
    ],
    line: [54, 66],
    wipe: [66, 90],
    fade: [72, 90],
    dissolve: [66, 96],
    release: 96,
    land: 138,
    tell: 84,
  },
};

const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

/** The real box at frame `f` (linear between keys, held outside). */
export const revealBoxAt = (r: Reveal, f: number): RevealBoxKey => {
  const ks = r.box;
  if (f <= ks[0].f) return ks[0];
  if (f >= ks[ks.length - 1].f) return ks[ks.length - 1];
  const j = ks.findIndex((k) => k.f > f);
  const a = ks[j - 1];
  const b = ks[j];
  const k = (f - a.f) / (b.f - a.f);
  const m = (p: P2, q: P2): P2 => [lerp(p[0], q[0], k), lerp(p[1], q[1], k)];
  return {f, flt: m(a.flt, b.flt), flb: m(a.flb, b.flb), nt: m(a.nt, b.nt), nb: m(a.nb, b.nb), rbt: m(a.rbt, b.rbt), rbb: m(a.rbb, b.rbb), blt: m(a.blt, b.blt)};
};

/** The track's camera at frame `f` (linear between keys) and its per-frame velocity. */
export const revealTrackAt = (r: Reveal, f: number): {key: RevealCamKey; vel: RevealCamKey} => {
  const ks = r.track;
  const seg = (() => {
    if (f <= ks[0].f) return [ks[0], ks[Math.min(1, ks.length - 1)]];
    for (let i = 0; i < ks.length - 1; i++) if (f < ks[i + 1].f) return [ks[i], ks[i + 1]];
    return [ks[Math.max(0, ks.length - 2)], ks[ks.length - 1]];
  })();
  const [a, b] = seg;
  const span = Math.max(1, b.f - a.f);
  const k = Math.max(0, Math.min(1, (f - a.f) / span));
  const key: RevealCamKey = {
    f,
    look: a.look.map((v, i) => lerp(v, b.look[i], k)) as V3,
    distance: lerp(a.distance, b.distance, k),
    yaw: lerp(a.yaw, b.yaw, k),
    pitch: lerp(a.pitch, b.pitch, k),
    fov: lerp(a.fov, b.fov, k),
  };
  const vel: RevealCamKey = {
    f: 1,
    look: a.look.map((v, i) => (b.look[i] - v) / span) as V3,
    distance: (b.distance - a.distance) / span,
    yaw: (b.yaw - a.yaw) / span,
    pitch: (b.pitch - a.pitch) / span,
    fov: (b.fov - a.fov) / span,
  };
  return {key, vel};
};
