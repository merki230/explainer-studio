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
  /**
   * Phone screen glass: plaster a step brighter than the body (≈ 8–10% once lit),
   * so the screen reads as glass without UI. Review round 2.
   */
  plasterGlass: '#fcf7ee',

  // --- gallery lights (MuseumLights only; a light colour, never a surface) ---
  /** Skylight (hemisphere) sky and ground colours. */
  lightSky: '#fff9f1',
  lightGround: '#cbc2b4',
  /** Warm key spot. */
  lightKey: '#fff3e3',
  /** Cool fill from the front left. */
  lightFill: '#dfe6f2',
  /** Back rim. */
  lightRim: '#ffffff',

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

// ---------------------------------------------------------------------------------------------
// v0.8 "The Section" (brand/style-guide.md § 1, § 4, § 8). Every place is a slice cut open and
// seen from outside; two moods (Night, Day); a recurring cast; orange only for the system.
// The Plaster Museum keys in `theme` above stay until stage 3 removes them.
// ---------------------------------------------------------------------------------------------

export type Mood = 'night' | 'day';

/** Constant in both moods. */
export const section = {
  /** The hidden system (also `theme.orange`). */
  orange: '#ff5b14',
  orangeCore: '#ffb27a',
  orangeDot: '#fff0e0',
  /** Every cut face (wall tops and ends, the floor slab, the ground block's cut sides); Night overlay ink. */
  cut: '#efe9df',
  /** Characters' eye dots. */
  eye: '#1d1d1f',
  /** Light from a lit phone screen onto its holder's face (§ 3). */
  screenLight: '#dbe6ff',
  /** Small set pieces the guide doesn't list, chosen outside the reserved band (hue 8–40°, sat ≥ 60%). */
  shoe: '#26272b',
  glasses: '#2a2b30',
  /** The ink line along every cut edge (architect's-section look, both moods). */
  cutLine: '#24262c',
  /** House plant: leaves and pot (outside the reserved band). */
  leaf: '#4f8a5b',
  leafDark: '#3c6e48',
  pot: '#d8d4cc',
  /** The router's status LED while the system is idle (dark). */
  ledOff: '#3a3d44',
  /**
   * Dashboard warning icons and device indicator lights, lit (v0.11.1 § 1 Warning lights): flat, never
   * bloomed, never orange. Same value as the light channels' yellow.
   */
  warning: '#eedd2b',
};

type Lamp = {light: string; intensity: number; reach: number; shade: string; glow: string; glowIntensity: number};

/** Per-mood palette and lights (§ 1, § 4). Light values are the mock-up's (× π is applied in code). */
export const MOODS: Record<
  Mood,
  {
    bg: string;
    /** Sky gradient behind the slice, top → bottom. */
    sky: [string, string, string];
    wall: string;
    floor: string;
    soft: string;
    softLight: string;
    wood: string;
    trim: string;
    device: string;
    earth: string;
    ink: string;
    paper: string;
    inkSub: string;
    capBg: string;
    /** The view through the window: sky top, sky bottom, the skyline. */
    window: [string, string, string];
    hemi: [string, string, number];
    key: {color: string; intensity: number; position: [number, number, number]};
    fill: {color: string; intensity: number; position: [number, number, number]};
    /** The floor lamp; null in Day (the lamp is there, off). */
    lamp: Lamp | null;
    /** Corner darkening of the post pass. */
    vignette: number;
    /**
     * Post-pass exposure. The mock-up's lights (× π) clip Day's walls and cut faces; exposure brings
     * whites under the § 2 limits without touching the light ratios. Set by measuring stills.
     */
    exposure: number;
    /** Post-pass highlight roll-off start (above it, 45% of the excess is kept). */
    shoulder: number;
    /** Phone UI background (what the screen shows in the slice when lit). */
    ui: string;
    /** The rug under the coffee table. */
    rug: string;
    /** Router and other appliances; the cup; the router's shelf (a step below white, so they never clip). */
    appliance: string;
    ceramic: string;
    shelf: string;
    /** Inside the back wall, seen through the X-ray cut-away (dark, so the cut-away reads). */
    cavity: string;
    /** Lamp shade colour (lit from inside in Night). */
    shade: string;
    /**
     * A narrow cool spot on the people (Night: lifts the subjects to the ≥ 30% floor without touching
     * the wall tops; the guide's rim colour), or null.
     */
    figureLight: {
      color: string;
      intensity: number;
      position: [number, number, number];
      target: [number, number, number];
    } | null;
    /**
     * Strength of the studio reflections on realistic objects (realism pass): 1 in Day; lower in Night
     * (its exposure is ≈ 2.2× Day's, and a dark room shouldn't read as a lit studio).
     */
    env: number;
    /**
     * Albedo scale for realistic objects' fixed colours (realism pass): 1 in Day; lower in Night,
     * whose exposure (≈ 2.2× Day's) would otherwise make a phone's label or a chip glare.
     */
    albedo: number;
    /** Ambient-occlusion strength (N8AO, realism pass) when a scene switches AO on, 0–1. */
    ao: number;
    /** Extra soft light on the walls (Day: whiter walls without hotter tops), or null. */
    bounce: {color: string; intensity: number; position: [number, number, number]} | null;
  }
> = {
  night: {
    bg: '#0d1322',
    sky: ['#070b18', '#141c36', '#232c4c'],
    wall: '#2a3550',
    floor: '#3a3b4a',
    soft: '#33405f',
    softLight: '#3e4d72',
    wood: '#5a4636',
    trim: '#404a62',
    device: '#1b1d22',
    earth: '#2b2a33',
    ink: '#efe9df',
    paper: '#121828',
    inkSub: 'rgba(239,233,223,0.7)',
    capBg: 'rgba(12,16,28,0.86)',
    window: ['#0b1230', '#27305a', '#121833'],
    hemi: ['#8aa0d8', '#141a2a', 0.55],
    key: {color: '#ffc58a', intensity: 0.85, position: [-2, 3.4, 2.4]},
    fill: {color: '#6f86c9', intensity: 0.35, position: [3, 2, 3]},
    lamp: {light: '#ffd29a', intensity: 1.2, reach: 4, shade: '#fff0d6', glow: '#ffd9a0', glowIntensity: 0.8},
    vignette: 0.45,
    exposure: 1.4,
    shoulder: 0.88,
    ui: '#121318',
    rug: '#4a4a5c',
    cavity: '#0a0e1a',
    appliance: '#b9b9b5',
    ceramic: '#bdb9b1',
    shelf: '#404a62',
    shade: '#c4ae8a',
    env: 0.22,
    albedo: 0.55,
    ao: 0.4,
    bounce: null,
    figureLight: {color: '#9fb3e8', intensity: 0.8, position: [1.6, 3.2, 2.2], target: [0, 0.95, -0.5]},
  },
  day: {
    bg: '#cfe3f5',
    sky: ['#9cc8f2', '#d4e8f8', '#eef4f8'],
    wall: '#f3eee6',
    floor: '#c9a982',
    soft: '#6f8fd1',
    softLight: '#86a2dd',
    wood: '#8a6a4e',
    trim: '#e2e1dc',
    device: '#2a2c31',
    earth: '#b9a68e',
    ink: '#1b1d22',
    paper: '#f6f2ea',
    inkSub: 'rgba(27,29,34,0.65)',
    capBg: 'rgba(246,242,234,0.94)',
    window: ['#8ec5ff', '#d9ecff', '#9fb4cc'],
    hemi: ['#ffffff', '#a8b4c8', 0.85],
    key: {color: '#ffffff', intensity: 0.8, position: [-2.5, 4.2, 2.5]},
    fill: {color: '#cfe0ff', intensity: 0.3, position: [3, 2, 3]},
    lamp: null,
    vignette: 0.18,
    exposure: 0.64,
    shoulder: 0.74,
    ui: '#fafafa',
    rug: '#cbbfae',
    cavity: '#7d7870',
    appliance: '#d2d2ce',
    ceramic: '#e2ded6',
    shelf: '#d2d2ce',
    shade: '#e4dccd',
    env: 1,
    albedo: 1,
    ao: 0.8,
    bounce: {color: '#fff7ee', intensity: 0.7, position: [4, 1.5, 3]},
    figureLight: null,
  },
};

/** The Lab slice's own surfaces (a test room), per mood. Neutral; never orange. */
export const LAB: Record<
  Mood,
  {
    floor: string;
    bench: string;
    rig: string;
    arm: string;
    joint: string;
    panel: string;
    panelInk: string;
    segOff: string;
    segLow: string;
    /** App icon colours on the conveyor (cool and mid hues, outside the reserved band). */
    icons: string[];
  }
> = {
  day: {
    floor: '#d3d6d4',
    bench: '#e4e4e0',
    rig: '#c3c8cf',
    arm: '#dfe1e4',
    joint: '#3a3f4b',
    panel: '#1f2229',
    panelInk: '#e9ecf2',
    segOff: '#363b46',
    segLow: '#8f97a5',
    icons: ['#5b7bd5', '#3fa37a', '#8a5cc2', '#3b9bb0', '#c9b54a', '#7d8796'],
  },
  night: {
    floor: '#3a3d47',
    bench: '#4a5068',
    rig: '#454b5e',
    arm: '#5a6178',
    joint: '#1b1d22',
    panel: '#12151c',
    panelInk: '#e9ecf2',
    segOff: '#2a2f3a',
    segLow: '#7d8696',
    icons: ['#5b7bd5', '#3fa37a', '#8a5cc2', '#3b9bb0', '#c9b54a', '#7d8796'],
  },
};

/**
 * Realistic objects (realism test, owner rule "objects realistic, people stylized"): the phone's
 * physical materials, the same in both moods (the lights change, the object doesn't). Neutral
 * metals, glass and electronics; nothing in the reserved orange band (hue 8–40°, sat ≥ 60%), so the
 * flex cables are black, not the usual amber polyimide.
 */
export const REAL = {
  /** Graphite aluminium frame and buttons (dark enough to hold its shape against the Day sky). */
  frame: '#5f6268',
  /** The plastic antenna bands across the frame. */
  antenna: '#4a4c51',
  /** Front glass over the black display border. */
  glass: '#0a0b0d',
  /** Frosted back glass. */
  back: '#6a6e75',
  /** Camera bump: lens cover glass, the lens's inner rings, the flash diffuser. */
  lens: '#060708',
  lensRing: '#2b2d31',
  flash: '#d8d3c4',
  /** Display off (behind the glass, around the active area and when the screen is dark). */
  panelOff: '#0f1013',
  /** Inside: the magnesium midframe, the logic board, its traces, silkscreen, gold pads. */
  midframe: '#5a5d63',
  pcb: '#14261b',
  trace: '#21412c',
  silk: '#d4d6ca',
  pad: '#b49f5e',
  /** Chip packages and their laser-etched legends. */
  chip: '#151619',
  chipInk: '#8b8e94',
  /** Tin-plated RF shield cans, screws, brackets. */
  shield: '#b9bdc2',
  screw: '#a7abb1',
  /** Battery foil and its printed label ink; the black adhesive pull tabs. */
  battery: '#2a2c31',
  batteryInk: '#d8d9d3',
  tab: '#121315',
  /** Rubber (antennas, feet) and a neutral status LED (never orange: the system's LED is `orange`). */
  rubber: '#26282c',
  statusLed: '#a9d8ff',
  /** Living room (realism): coffee, potting soil, the glazed pot, snake-plant leaf green and its pale edge. */
  coffee: '#3a2a22',
  soil: '#3b3029',
  pot: '#cfcbc3',
  leafDeep: '#2f4f33',
  leafEdge: '#c3c68c',
  /** The Lab (realism): steel, aluminium, dark anodised parts, the ESD bench mat, the arms' shells, cables, belt, cabinet. */
  steel: '#9a9ea5',
  alu: '#b8bcc2',
  labDark: '#2c2f35',
  esdMat: '#3c4a57',
  armShell: '#d6d8d6',
  cable: '#1e1f22',
  belt: '#3a3b3f',
  cabinet: '#5d636c',
  /** Flex ribbon cables (black coverlay). */
  flex: '#1b1c1f',
  /** Small parts: ceramic capacitors, resistors, inductors. */
  cap: '#8f8166',
  resistor: '#1d1d20',
  inductor: '#5d6066',
  /** The wheel (No. 002): tire rubber, its inner liner, the alloy rim, brake rotor, valve rubber, brass valve core. */
  tire: '#2b2c30',
  liner: '#3a3c41',
  rim: '#b3b7bd',
  rotor: '#7c8087',
  valve: '#1d1e21',
  brass: '#a8955f',
  /** The tire sensor: grey plastic housing, steel coin cell, its label ink, the tone ring's dark steel. */
  sensor: '#80868f',
  coinCell: '#c3c6cb',
  toneRing: '#4a4d53',
  /** The air chuck's steel head and its black hose. */
  chuck: '#9fa3aa',
  hose: '#1f2023',
  /** The car's interior: seats, dashboard, carpet; the dark tinted glass; the receiver box. */
  seat: '#3b3e45',
  dash: '#2e3036',
  carpet: '#4a4c52',
  carGlass: '#1c2733',
  receiver: '#25272c',
  /** A white tick mark on a sidewall (the indirect system's spin cue). */
  tick: '#e8e6e0',
};

/**
 * The car slice (No. 002), per mood: the road on the ground block, its lane paint, the two car bodies
 * (never red or orange, § 1). Neutral; nothing here is the system.
 */
export const CAR: Record<
  Mood,
  {asphalt: string; lane: string; verge: string; bodies: {you: string; mom: string}}
> = {
  day: {asphalt: '#5a5d63', lane: '#e4e2da', verge: '#8f9a7e', bodies: {you: '#9fb0c4', mom: '#5f7d6e'}},
  night: {asphalt: '#3b3e46', lane: '#c9c7c0', verge: '#4a5246', bodies: {you: '#6d7d92', mom: '#45594f'}},
};

export type CastName = 'you' | 'friend' | 'mom' | 'extra';
export type CastLook = {
  top: string;
  bottom: string;
  skin: string;
  hair: string;
  /** The one detail that tells them apart at a glance (§ 8). */
  detail: 'hood' | 'bun' | 'bob-glasses' | 'none';
};

/** The recurring cast (brand.md § The cast, style guide § 8). Never orange. */
export const CAST: Record<CastName, CastLook> = {
  you: {top: '#2f55c9', bottom: '#2a2d3a', skin: '#c58c63', hair: '#2a1d14', detail: 'hood'},
  friend: {top: '#2e9a63', bottom: '#4a4038', skin: '#a8734f', hair: '#1a120c', detail: 'bun'},
  mom: {top: '#7d4e8f', bottom: '#3b3a40', skin: '#f1c9a5', hair: '#8c8a86', detail: 'bob-glasses'},
  extra: {top: '#8a909c', bottom: '#5b606b', skin: '#d9a77f', hair: '#3a3532', detail: 'none'},
};

// Frame is 1080x1920 (9:16). Overlay positions are fractions of it.
export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
// Frames of crossfade between scenes (style guide § 8: 12 frames, cubic in-out).
export const FADE = 12;

/**
 * Area no platform UI (TikTok, Shorts, Reels) covers, in px of the 1080x1920 frame.
 * Keep every piece of text inside it.
 */
export const SAFE = {left: 120, right: 888, top: 288, bottom: 1248};
