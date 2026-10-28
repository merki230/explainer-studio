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
  /** Light sneakers (No. 006: YOU's shoes in the car, so the foot reads against the dark footwell). Neutral. */
  sneaker: '#d9d5cc',
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
  /**
   * A water meter's leak (low-flow) triangle (No. 004; brand-director, 2026-10-18): the real object's red,
   * outside the reserved band. Same value as the light channels' red. Flat: no emissive, glow or bloom;
   * it may spin, never pulse.
   */
  leakRed: '#ef3957',
  /**
   * A traffic signal's lit lenses (No. 006, A/V script S6; added by the city-slice builder, values for the
   * brand-director): flat emissive, never bloomed, never the system. Red = `brakeLit` (#e00208, renders
   * ≈ 354°; `leakRed` read pink as a lit lens). Green ≈ 164°, 74%, 47%: a real signal's blue-green, far from the band. The
   * yellow lens, if ever lit, is `warning`.
   */
  signalRed: '#e00208',
  signalGreen: '#1fcf9f',
  /**
   * A lit brake lamp's emissive colour (No. 006, owner fix: "a clearly bright, saturated red, no pink
   * cast"), used only while `brake` > 0 (running lights keep `HIGHWAY.tailLight`, dimmer, so No. 005 is
   * unchanged). A true red: emissive values are linear, and the output encoding lifts small green/blue
   * components, so `#e8102f` (351°) rendered at 341° (pink); this value renders ≈ 355°, ~95% saturated on
   * the stills. Flat emissive, never bloomed.
   */
  brakeLit: '#e00208',
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
  rotor: '#8c9097',
  valve: '#1d1e21',
  brass: '#a8955f',
  /** Two-tone alloy (polish round 1): the machined spoke faces and lip, the painted gunmetal pockets. */
  rimMachined: '#c8ccd2',
  rimPaint: '#6b7078',
  /** The brake caliper (painted, fixed) and the lug nuts' chrome. */
  caliper: '#383b41',
  chrome: '#c4c8cd',
  /** The valve stem's anodised aluminium (clamp-in TPMS stem) and its rubber grommet. */
  stemAlu: '#9ea3aa',
  grommet: '#202124',
  /** The tire sensor: grey plastic housing, steel coin cell, its label ink, the tone ring's dark steel. */
  sensor: '#80868f',
  /** The housing's moulded details (ribs, the screw boss, the vent) a shade darker; the potting gasket. */
  sensorDark: '#646a72',
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
  /**
   * No. 006 (A/V script S6; values for the brand-director). Rust on a brake disc's swept face, light and
   * its pitting: HSL ≈ 17°, 25%, 37% / 17°, 26%, 23% (owner review: darker and browner, so it can't be
   * read as the system's orange on a phone). Real rust's hue sits inside the reserved band (8–40°), so
   * both stay far under its 60% saturation floor and below its 35% lightness floor. Never glows.
   */
  rust: '#775548',
  rustDark: '#4a342b',
  /**
   * Copper (stator windings, bus bars), unlit: a dark, weathered copper-brown, ≈ 22°, 28%, 33% (final review: the
   * brighter copper read as the system already lit). Under the band's 60% saturation and 35% lightness floor.
   */
  copper: '#6b4d3c',
  /** The brake pads' friction material (a light grey-brown composite, ≈ 27°, 9%, 56%) and their steel backing plates (≈ 77% light): light, so the pads and their gaps read against the dark disc at phone size. */
  friction: '#9a8f86',
  backing: '#bfc4ca',
  /** EV drive unit and battery: cast aluminium housings, electrical-steel laminations, magnets, the pack's modules and cells. */
  housing: '#a9adb3',
  lamination: '#80858d',
  magnet: '#33363c',
  module: '#575c64',
  cell: '#3d4654',
  /** The pedals' rubber pads and steel arms. */
  pedal: '#232428',
};

/**
 * The tower slice (No. 003): an office building's lift core cut open. Neutral building materials, the
 * same in both moods (the lights change); nothing here is the system, nothing in the reserved band.
 */
export const TOWER = {
  /** Shaft walls and the core's back wall (fair-faced concrete). */
  concrete: '#bdbab4',
  /** Inside a shaft: dark, so empty doorways read as openings and the lit cars stand out. */
  shaft: '#5c5b59',
  /** Landing doors and car doors (brushed stainless, kept mid-grey so they don't read as holes). */
  door: '#a3a7ad',
  /** Car interior wall panels (light laminate), so the riders read against them. */
  carWall: '#e2dccf',
  /** Brushed stainless: car walls' trim, door frames, the call panel plate. */
  stainless: '#c3c6ca',
  /** Glass landing and car doors, shaft front glazing (a faint cool tint, mostly see-through). */
  glass: '#d6e2e6',
  /** Piers between the landing doors (stone cladding). */
  pier: '#d9d3c8',
  /** Landing and lobby floors (pale stone). */
  stone: '#c3bdb2',
  /** Landing walls (painted). */
  paint: '#e6e2da',
  /** Car floor (dark rubber tile). */
  carFloor: '#3e4046',
  /** Car ceiling light panel (neutral, never in the reserved band). */
  lightPanel: '#eef1f4',
  /** Steel ropes and the counterweight's cast iron. */
  rope: '#5f6268',
  counterweight: '#4c4f55',
  /** Hoist machines in the machine room. */
  machine: '#6a7078',
  /** The call panel's button faces (dark) and the unlit ring. */
  button: '#2a2c31',
  /** A corridor or entrance seen through a doorway (shadowed, so people fade into it). */
  corridor: '#6e6c69',
  /** Hotel lobby (No. 003 K): walnut reception desk and wall panel (low saturation, outside the reserved band). */
  walnut: '#6b5646',
  /** Hotel lobby floor (polished pale stone, a step warmer than the office halls). */
  lobbyStone: '#cfc7b8',
  /** Rolling suitcases: shells (graphite, slate blue) and the handle. */
  suitcase: '#3d4148',
  suitcaseAlt: '#5a6d86',
  handle: '#9a9ea5',
  /** The destination keypad's screen glass seen from behind (dark, like a phone's back). */
  keypadBack: '#1d1f24',
  /** Close-up kit (No. 003 rework): the car's laminate grain (a shade under `carWall`) and its kick plate seam. */
  laminateGrain: '#d3ccbd',
  /** Display glass (car operating panel, keypad) and its lit digits (neutral, like `screenLight`). */
  displayGlass: '#0b0c0f',
  displayInk: '#dbe6ff',
  /** A hall lantern's lens when dark (milky acrylic). */
  lensOff: '#cfccc5',
  /** Engraved button and panel markings (dark fill in the stainless). */
  engrave: '#3a3c41',
  /** The group-controller cabinet: light grey enamel, galvanised mounting plate, grey PVC ducts, terminals, contactors. */
  cabinetPaint: '#c9cbc8',
  mountPlate: '#aeb2b5',
  duct: '#8e918f',
  terminalBlock: '#7f858c',
  contactor: '#3b3e44',
  /** Control wiring: black, grey and blue cores (never amber or orange). */
  wireGrey: '#7a7d82',
  wireBlue: '#3d5d9c',
  /** The wiring diagram in the cabinet door's pocket (paper) and its ink. */
  paper: '#e4e1d8',
  /** Car floor: dark granite tile with paler flecks. */
  carFloorFleck: '#5b5e64',
};

/**
 * The street slice (No. 004): a residential street cut square to the road through a meter box, the
 * meter, its radio and lid antenna, a utility pickup, the receivers. Real materials, the same in both
 * moods; nothing here is the system and nothing sits in the reserved band (bronze and brass stay under
 * 60% saturation, the centre line is a muted yellow at hue ≈ 49°, no amber lamps).
 */
export const STREET = {
  /** Road surface, its paint (muted yellow centre line, white edge), the kerb and sidewalk concrete. */
  asphalt: '#5c5f64',
  centreLine: '#cdb85a',
  edgeLine: '#dedcd4',
  concrete: '#c9c5bd',
  /** Lawn and park strip; the gravel bed in the meter pit. */
  grass: '#7d9a5e',
  grassDark: '#62804a',
  gravel: '#9a958c',
  /** The meter box (composite, dark grey), its lid and the lid's embossed lettering. */
  box: '#4a4d52',
  lid: '#3a3c40',
  lidEmboss: '#55585e',
  /** The lid antenna's black cap and its threaded stem. */
  cap: '#17181a',
  stem: '#2a2c30',
  /** The meter: cast bronze body (desaturated), brass couplings, the register's black housing, dial face, ink. */
  bronze: '#8c7b5c',
  bronzeDark: '#6e614a',
  brassNut: '#a8955f',
  register: '#232528',
  dial: '#e9e7e0',
  dialInk: '#1e1f22',
  /** The radio module (grey potting), its label, the coax and three-wire cable (black). */
  radio: '#7d828a',
  radioLabel: '#d8d9d3',
  cable: '#1c1d20',
  /** Service pipe (black poly) and the water main (ductile iron, blue-grey); the main's water. */
  poly: '#2b2d31',
  main: '#4f5966',
  water: '#7d97ad',
  /** The utility pickup: white paint, black trim and bumpers, unlit lamps (clear; dark red tails). */
  truck: '#e4e5e1',
  truckTrim: '#2a2c30',
  lamp: '#dfe3e8',
  tailLamp: '#6e2a2c',
  /** The rugged laptop (dark grey shell). */
  laptop: '#3a3d42',
  /** Utility pole (weathered wood), the receiver box (grey), the water tank (pale steel). */
  pole: '#7a6c5c',
  receiverBox: '#9ea2a8',
  tank: '#cfd3d6',
  /** Neighbours' houses: sidings and roofs (neutral). */
  sidings: ['#ddd7cb', '#bec8ce', '#d2c9b6', '#c9ccc4'],
  roof: '#5b5e63',
  /** The faucet's water stream (pale, neutral, translucent; never glows). */
  stream: '#d6e3ec',
  /** Kitchen: counter top, cabinets. */
  counter: '#cfccc5',
  cabinet: '#e3dfd5',
};

/**
 * The car slice (No. 002), per mood: the road on the ground block, its lane paint, the car bodies
 * (never red or orange, § 1). Neutral; nothing here is the system. `friend` (No. 008, scene-builder; value
 * for the brand-director): FRIEND's car, a graphite (≈ 215°, 7%, 37%) far darker than YOU's pale
 * blue-grey, so FRIEND's car never reads as YOU's.
 */
export const CAR: Record<
  Mood,
  {asphalt: string; lane: string; verge: string; bodies: {you: string; mom: string; extra: string; friend: string}}
> = {
  day: {
    asphalt: '#5a5d63',
    lane: '#e4e2da',
    verge: '#8f9a7e',
    bodies: {you: '#9fb0c4', mom: '#5f7d6e', extra: '#b4b7bb', friend: '#575c64'},
  },
  night: {
    asphalt: '#3b3e46',
    lane: '#c9c7c0',
    verge: '#4a5246',
    bodies: {you: '#6d7d92', mom: '#45594f', extra: '#7d8187', friend: '#40444b'},
  },
};

/**
 * The highway slice (No. 005): a divided rural interstate cut square to the road, its paint, the
 * shoulder's milled grooves, the guardrail and the road signs; the cars' lamps. Real materials, the
 * same in both moods (the lights change). Nothing here is the system: the grooves turn `orange` only
 * when the scene lights them. Values for the brand-director (A/V script S6):
 *  - `lineYellow` #d6bc45 is HSL ≈ 49°, 64%, 56%: above the reserved band (8–40°), like `STREET.centreLine`.
 *  - `signGreen` #14674a ≈ 159° (MUTCD guide green), `signWhite` a step under white (§ 1 no pure white).
 *  - `tailLight` #e23a52 ≈ 351° (lit lamp, flat emissive, never bloomed), `tailLens` the unlit lens.
 */
export const HIGHWAY = {
  /** Interstate asphalt, the darker wheel paths, the fresh milled faces in the grooves (coarser, darker). */
  asphalt: '#4b4e54',
  wheelPath: '#43464c',
  milled: '#36373b',
  /** Pavement markings: the white right edge line and lane line, the yellow left edge line. */
  lineWhite: '#dedcd4',
  lineYellow: '#d6bc45',
  /** The gravel edge beyond the shoulders, the median and verge grass. */
  gravel: '#8b867d',
  grass: '#62794c',
  grassDry: '#77845a',
  /** Galvanized steel: guardrail, sign posts and breakaway bases, the signs' backs. */
  galvanized: '#a4a9ae',
  /** Sign sheeting (retroreflective): guide green, white, the black legend. */
  signGreen: '#14674a',
  signWhite: '#e9e8e2',
  signInk: '#18191c',
  /** Car lamps: lit tail-light red, the unlit lens; the headlights' light (a light, not a surface). */
  tailLight: '#e23a52',
  tailLens: '#6a1d29',
  headlight: '#eef1ff',
  /**
   * After the rain (No. 008, `wet`; values 🧪 for the brand-director): wet asphalt (darker, the sky's
   * sheen comes from the shader), the wheel paths drying first (a touch lighter), standing water in the
   * puddles (darkest, the most sheen), and the tires' spray (white-grey mist, never the system).
   * All under 10% saturation.
   */
  asphaltWet: '#34363b',
  wheelPathWet: '#3c3f44',
  puddle: '#2a2c30',
  spray: '#d5d9de',
};

/**
 * The musical road (No. 005, L): a generic two-lane desert road. Real materials, the same in both
 * moods (the lights change). Nothing here is the system: the groove groups turn `orange` only when the scene lights them. Asphalt, paint and
 * grooves reuse `HIGHWAY`; the house reuses `STREET` sidings and roof; the lit window is the lamp
 * practical (`MOODS.night.lamp`). Values for the brand-director: all under 30% saturation, so none is
 * in the reserved band (sand ≈ 41° at 13%, sandDark ≈ 41° at 12%, scrub ≈ 80° at 16%).
 */
export const DESERT = {
  /** Packed sand and the sand on the cut (warm grey-beige), a darker sand for the road's dirt verge. */
  sand: '#a49b87',
  sandDark: '#8c836f',
  /** Creosote-like scrub clumps: two dusty olive greens. */
  scrub: '#6f7a58',
  scrubDark: '#56603f',
};

/**
 * The city slice (No. 006, T): a one-way US downtown street. Real materials, the same in both moods (the
 * lights change). Nothing here is the system. Lane paint reuses `HIGHWAY.lineWhite`, the sidewalk
 * concrete `STREET.concrete`, the signs `HIGHWAY`, the lit lenses `section.signalRed` / `signalGreen`.
 * Values for the brand-director: every colour under 35% saturation except the unlit lenses (dark, under
 * 30% lightness), so none is in the reserved band (brick ≈ 15° at 17%, sandstone ≈ 38° at 20%).
 */
export const CITY = {
  /** City asphalt (a little lighter and greyer than the interstate's), the concrete gutter pans. */
  asphalt: '#53565c',
  gutter: '#a9a69f',
  /** Facades: limestone, brick, concrete, blue-grey panel, sandstone; their windows; flat roofs. */
  facades: ['#bdb6aa', '#8e7469', '#a9aeb3', '#7d8892', '#c6bcab'],
  window: '#3b4550',
  roof: '#6b6e73',
  /** Storefront awnings (blank, no names): slate, sage, plum-grey. */
  awnings: ['#4d5b6c', '#5f6c5b', '#665c6b'],
  /** Under the road: the duct bank's concrete, its grey conduits, the storm sewer's concrete pipe and its dark bore. */
  ductBank: '#9d9b95',
  conduit: '#6f7479',
  stormPipe: '#8e8b85',
  bore: '#2a2c30',
  /** The bores on the cut face, mid grey (a near-black bore read as a stray object at phone size). */
  boreCut: '#7b7f86',
  /** The signal: housing and backplate (near black, painted), the mast arm and pole (dark grey), unlit lenses. */
  signalHousing: '#1f2124',
  mast: '#4a4d52',
  lensRed: '#3b1d23',
  lensYellow: '#3a3522',
  lensGreen: '#183731',
  /**
   * The extras' car bodies (owner fix: variety): graphite, silver, slate blue, warm taupe, dark sage. All
   * under 25% saturation, far from the reserved band; none near YOU's body.
   */
  carBodies: ['#3f434a', '#a7acb2', '#4f5d70', '#8d8478', '#4d5a50'],
  /** The default body of an extra whose lamps are set 'dark' (the queue's odd one out): charcoal, ≈ 4% saturation. */
  charcoal: '#25272b',
};

/**
 * The drag strip (No. 007, R; scene-builder N10, values 🧪 for the brand-director). Real materials, the
 * same in both moods (the lights change). Nothing here is the system. The tree's lamps reuse
 * `section.warning` (ambers) and `section.signalGreen` (green); the drivers are grey extras
 * (`CAST_NEUTRAL`) in `section.sneaker`.
 *  - `evPaint` #3b8ea0 (HSL ≈ 191°, 46%, 43%): a petrol teal, 34° from YOU's cobalt (225°), 27° from
 *    `signalGreen` (164°), far outside the reserved band (8–40°).
 *  - `gasPaint` #4e3046 (≈ 316°, 24%, 25%): an aubergine, 91° from YOU's cobalt, 35° from the tail
 *    lamps' red (351°), 33° from MOM's plum (283°); not red-orange (52° short of the band's lower edge,
 *    8°). Darker than the teal, so the two cars differ in value as well as hue (colour-blind viewers).
 *  - The strip: the launch pad's concrete and the track's asphalt (darker than the interstate's: rubbered),
 *    the laid rubber in the launch's wheel tracks; the distance boards' black face and white numerals
 *    (a step under white, § 1). All under 15% saturation.
 *  - The realism pass (owner, values 🧪): the cars' wheels (the gas car's split spokes in gunmetal, the
 *    electric car's turbine blades machined with dark sides) and brake calipers (a light silver behind
 *    the gas car's dark spokes; a grey-teal behind the electric car's blades, echoing its paint); the
 *    testers' helmets (a light grey, a graphite) with a smoked visor. Calipers never red or orange.
 *  - The strip's realism pass ("the road too", owner; values 🧪): the grandstand's bench seats (a cool
 *    grey), the crowd's clothes (muted greys and dusty blues, greens and browns, all under 25% saturation,
 *    none in the reserved band, none a cast colour) and skins, the field beyond (a dry grass) and its tree
 *    line in two depths (the far one bluer: the haze), the wall's tire scuffs (`rubber`).
 */
export const RACE = {
  evPaint: '#3b8ea0',
  gasPaint: '#4e3046',
  concrete: '#b1aea6',
  asphalt: '#3e4045',
  rubber: '#2b2c2f',
  boardBlack: '#1e1f22',
  boardWhite: '#e9e8e2',
  wheelGasFace: '#5a5e65',
  wheelGasSide: '#34373c',
  caliperGas: '#b8bcc2',
  wheelEvFace: '#c8ccd2',
  wheelEvSide: '#2e3136',
  caliperEv: '#7d9aa1',
  helmetEv: '#c3c6ca',
  helmetGas: '#45484e',
  visor: '#25282d',
  standSeat: '#7c828b',
  crowd: ['#8a8e95', '#6b7079', '#a49f97', '#5f6a74', '#7c8a7e', '#8c7f73', '#9aa3ab', '#565a61'],
  crowdSkin: ['#d9a77f', '#b07d58', '#8a5d3f', '#e6bf9b'],
  field: '#9ea283',
  treeNear: '#5f6f58',
  treeFar: '#7d8d86',
  /** The launch's tire haze (a neutral light grey, never orange). */
  haze: '#c3c4c6',
};

/**
 * No. 010 `charge-slice` (the charging station; scene-builder values, 🧪 until the brand-director's review):
 *  - The two cars' paints: `teslaPaint` #cdd1d4 (a light pearl grey, a step under white so the cut car's
 *    clearcoat never clips) and `bydPaint` #34465c (a deep slate blue, ≈ 213°, 28% saturation: 12° and far
 *    less saturated than YOU's cobalt, so it never reads as a cast colour). Different in value too.
 *  - The charger: `cabinet` (the body, a warm light grey), `cabinetDark` (the front panel, the cap, the
 *    holster), `screen` (the unlit, unread screen glass). The port light is `section.signalGreen`, flat.
 *  - The bays: `concrete` (the China pad), `bayGreen` (the green bay paint many Chinese EV bays have,
 *    China only; brand-director v0.13, replacing a sage that read grey), `canopy` / `canopyUnder` (the
 *    roof's fascia and soffit), `column` (its steel columns).
 *  - `ghost`: the dashed outline of a car that isn't there, Day (Night uses `section.cut`); v0.13.
 *  - Approved as built (v0.13): the two paints, `coolant`, `coolantFlow`.
 *  - The cable's cut-away: `coolant` (the liquid in the cooling hoses: a neutral blue-grey, never orange)
 *    and `coolantFlow` (its moving streaks, lighter); the copper is `REAL.copper`, the jacket `REAL.cable`.
 */
export const CHARGE = {
  teslaPaint: '#cdd1d4',
  bydPaint: '#34465c',
  cabinet: '#d3d4d1',
  cabinetDark: '#2a2d32',
  screen: '#14181d',
  concrete: '#bcb8b0',
  bayGreen: '#5c9d72',
  canopy: '#dcdcd8',
  canopyUnder: '#babdbd',
  column: '#868b91',
  coolant: '#8ea3ad',
  coolantFlow: '#d9e3e7',
  /** The ghost car's dashed outline in Day (Night: `section.cut`). */
  ghost: '#24262c',
  /** No. 010 draft 2: the kerb stone beside each bay (a step darker than the slab, so its edge reads). */
  curb: '#a9a59f',
  /** The station clock: its face (a step under white) and its rim and hands (ink). */
  clockFace: '#eceae4',
  clockInk: '#24262c',
  /** Clouds in the sky band, Day / Night (soft, flat, never the system). */
  cloud: '#f5f7f9',
  cloudNight: '#2c3554',
};

/**
 * No. 010 draft 2: the second grey extra (the owner: "two different-looking extras"): the extras' slate
 * clothes with another skin and hair from the cast's range (style guide § 8), so the two drivers read as
 * two people. The first extra is `CAST.extra` as it is.
 */
export const EXTRA_B: Partial<CastLook> = {skin: '#6e4630', hair: '#1a120c', bottom: '#4b505a'};

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

/**
 * A warm neutral grey for an unnamed extra seen through a car's tinted glass at Night (No. 005): the
 * extra's cool `CAST.extra` grey read as YOU's blue there. HSL ≈ 36°, 4%, 54% / 40°, 5%, 33%: grey,
 * not in the reserved orange band (saturation ≈ 4%).
 */
export const CAST_NEUTRAL: Pick<CastLook, 'top' | 'bottom'> = {top: '#8f8b85', bottom: '#57544f'};

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
