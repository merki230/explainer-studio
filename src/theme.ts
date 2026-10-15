// One palette for every video keeps the channel recognisable.
//
// "The Plaster Museum" (brand/style-guide.md): the world is matte off-white
// plaster lit like a gallery. The hidden system is the only colour (signal
// orange); it glows, bleeds light onto the plaster, and leaves a stain where it
// has been. Token names follow the style guide's § 1 (camelCased).
export const theme = {
  // --- 3D world (plaster) ---
  /** `plaster`: walls, furniture, people, devices. Everything. */
  plaster: '#e8e3da',
  /** `plaster-dark`: plinths, recessed parts, anything that should sit back. */
  plasterShade: '#dad3c7',
  /** `floor`: the museum floor beyond the plinth. */
  plasterFloor: '#cdc6b9',
  /** `background`: scene background and fog colour. */
  museum: '#d6d0c5',
  /** `plate` / `plate-border`: the engraved wall plate. */
  plate: '#d6cfc2',
  plateBorder: '#a79d8d',

  // --- the one accent ---
  /** Signal orange: the hidden system. The only colour in the frame. */
  orange: '#ff5b14',
  /** Hot core of a glowing orange path (blooms). */
  orangeCore: '#ffb27a',
  /** Matte orange on a surface where the system has been (lit, not glowing). */
  orangeStain: '#e8702a',
  /** The thin stain line a path leaves on the wall (flat, translucent). Review round 1. */
  orangeStainLine: '#dc8250',
  /** `glow-white`: travelling data dots on a path. */
  orangeDot: '#fff0e0',

  // --- 2D overlays (exhibit labels, captions, callouts) ---
  /** Captions. */
  ink: '#1f1c18',
  /** Label titles, callout titles, numbers on cards. */
  inkLabel: '#2a2622',
  /** Sub-lines, callout leaders, icons. */
  inkMuted: '#7a7064',
  /** Wall plate number / title (3D texture). */
  inkPlate: '#2b2722',
  inkPlateMuted: '#5c5449',
  /** `label-card` / `label-border`: every 2D card (paper, square corners). */
  labelCard: '#f8f4ed',
  labelBorder: '#d3cbbd',
  /** Shadow under every 2D card. */
  cardShadow: '0 5px 16px rgba(60, 50, 30, 0.12)',
  /** Soft plaster halo behind text that sits over the 3D scene. */
  textHalo: '0 0 16px rgba(232, 227, 218, 0.85)',
};

// Frame is 1080x1920 (9:16). Overlay positions are fractions of it.
export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
// Frames of crossfade between scenes.
export const FADE = 8;

/**
 * Area no platform UI (TikTok, Shorts, Reels) covers, in px of the 1080x1920 frame.
 * Keep every piece of text inside it.
 */
export const SAFE = {left: 120, right: 888, top: 288, bottom: 1248};
