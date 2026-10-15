# Secretly Works: style guide (The Section)

v0.8, 2026-10-15. Owner: brand-director. Frame: **1080 × 1920, 30 fps**.

> **Every value in this guide is 🧪 until the pilot's stills (`yarn stills`) in this look are judged by the owner.** The *decisions* marked ✅ (the Section frame, the orange rule, the cast, phones facing their owners, etc.) are approved; the numbers that implement them were set on a browser mock-up (`section-frame.html`, three.js r149 units, before the R3F `× π` light convention) and will move when the build is reviewed.

History: v0.1 to v0.7 described **The Plaster Museum** (matte plaster, one orange, numbered exhibits); see `CHANGELOG.md`. v0.8 replaces it with **The Section**, approved by the owner from `proposals/visual-identity-v1.md` (rev. 2). Research citations: `brand/research/platforms.md` (P§), `brand/research/landscape.md` (L§). Status: 🧪 testing, ✅ proven (by feedback, an owner decision, or a platform rule).

The look in one line: every place is **cut open and seen from outside**, with warm off-white cut faces; inside it is a realistic, everyday-coloured world with a recurring cast; the hidden system is the only orange, and it runs through the walls and the ground, out of the room and back.

## 1. Palette

Proposed `theme.ts` tokens (the scene-builder adds them; no inline colours in videos or scenes, ✅ studio rule). The old plaster/museum/plate/label tokens are retired.

**Constant in both moods**

| Token | Hex | Used for |
|---|---|---|
| `orange` | `#ff5b14` | The hidden system: path halo, node dots, its light, active LEDs and screens' glow, its mark on a screen (✅ owner decision) |
| `orangeCore` | `#ffb27a` | Hot core of the path in Night |
| `orangeDot` | `#fff0e0` | Travelling dots on an active path |
| `cut` | `#efe9df` | **Every cut face**: wall tops and ends, floor slab, the ground block's cut sides. Also the overlay ink in Night |
| `eye` | `#1d1d1f` | Characters' eye dots |

**Per mood** (§ 4 for lights)

| Token | Night | Day |
|---|---|---|
| `bg` (outside the slice, fog) | `#0d1322` (never darker) | `#cfe3f5` |
| `sky` (gradient behind the slice) | `#070b18` → `#141c36` → `#232c4c` | `#9cc8f2` → `#d4e8f8` → `#eef4f8` |
| `wall` / `floor` | `#2a3550` / `#3a3b4a` | `#f3eee6` / `#c9a982` |
| `soft` (couch) / `softLight` (cushions) | `#33405f` / `#3e4d72` | `#6f8fd1` / `#86a2dd` |
| `wood` / `trim` (shelves) / `device` | `#5a4636` / `#404a62` / `#1b1d22` | `#8a6a4e` / `#f7f6f2` / `#2a2c31` |
| `earth` (ground block's uncut sides) | `#2b2a33` | `#b9a68e` |
| `ink` (overlay text, rules, leaders) | `#efe9df` (= `cut`) | `#1b1d22` |
| `paper` (overlay fills, halos) | `#121828` | `#f6f2ea` |
| `inkSub` (sub-lines, attribution) | `rgba(239,233,223,0.7)` | `rgba(27,29,34,0.65)` |
| `capBg` (caption block) | `rgba(12,16,28,0.86)` | `rgba(246,242,234,0.94)` |

| Rule | Value | Why | Status |
|---|---|---|---|
| **The orange rule** | The hidden system is always `orange`, in both moods; never blue, green or any other hue | One hue, one meaning; the reference colours each idea differently | ✅ owner decision |
| **Reserved band** | Nothing but the system may have HSL hue **8 to 40°**, saturation **≥ 60%**, lightness **35 to 75%**: no surface, clothing, UI element, overlay or practical light. Wood, skin and beige pass (low saturation) | Makes "everything else any colour" checkable; `#ff5b14` = 18°, 100%, 54% | ✅ owner decision (the band); 🧪 (its edges) |
| Never orange | People, cut faces, captions, tags, cards, statements, attribution, title block, background | The system keeps the colour to itself | ✅ owner decision |
| No pure white or black surfaces | Nothing at `#ffffff` / `#000000` except lights and glow cores | Carried over: clipping and crushed blacks | 🧪 |

## 2. Light and finish

| Rule | Value | Status |
|---|---|---|
| Rig | Hemisphere + one shadow-casting directional key + one fill; Night adds the practicals (lamp, screens). Values § 4 | 🧪 |
| Shadows | Key only; PCF soft, 1024 map, radius 4, bias −0.0006, shadow camera ±3 units around the slice | 🧪 |
| Cut faces read in both moods | `cut` must read as off-white in Night: lit by the key/hemisphere, luma ≥ 70% on the front cut face | 🧪 |
| Whites (Day) | On a full-scale still with overlays, screens and glow masked: **brightest near-neutral pixel ≤ 96%** (≤ 244), **zero pixels at 255,255,255**. Do not raise brightness to fix a dull still without the owner (the "too bright" lesson, v0.3) | ✅ owner feedback (the lesson); 🧪 (thresholds) |
| Night floor | The subject (the character or object the line is about) has p50 luma ≥ 30%; nothing darker than `bg` | 🧪 |
| Vignette | Night `rgba(0,0,0,0.45)`, Day `rgba(30,40,60,0.18)` at the corners | 🧪 |
| Bloom | Selective: only meshes with `userData.glow` (the system). Lamps and screens never bloom | ✅ (rule) 🧪 (values) |
| Grain | Monochrome, 1 px, strength 0.035, seeded from `useCurrentFrame()` | 🧪 |
| Shallow focus | Focus line on the subject's height; sharp ±0.14 of frame height; light (the slice should read sharp, like a drawing) | 🧪 |
| The post pass | The post-processing component is the **single documented `useFrame` exception**; no other `useFrame` anywhere | ✅ studio rule |

## 3. The slice (geometry and materials)

| Rule | Value | Why | Status |
|---|---|---|---|
| **The Section** | Every location is a slice block seen **from outside**: near wall and ceiling removed, the cut faces visible. The camera never enters it | Seeing inside is the brand ("how things *secretly* work"); the reference's frame is an eye-level interior | ✅ owner decision |
| Block | ≈ **3.4 wide × 2.4 deep**, walls **2.7 high, 0.18 thick** (back and left walls standing, cut on top and at the front edge), ground block **2.2 deep** under the floor, cut on its front and right faces | One readable room per slice | 🧪 |
| Outside the block | `sky` gradient plane behind, `bg` elsewhere; **no floor plane, no horizon**: the slice floats like a section drawing | 🧪 |
| Other locations | Same grammar: a car cut along its length, a street cut through the road to the ducts under it, a data centre cut through a rack row. Services (ducts, cables, pipes) in neutral greys until the system uses them | New slices every video (P§4) | 🧪 |
| Materials | Matte `MeshStandardMaterial`, metalness 0: `cut` and walls 0.95, fabrics and hair 0.9, wood 0.7, skin 0.75, device bodies 0.4 | 🧪 |
| Rounded edges | `roundedBox` radius ≈ 3 to 8% of the smallest dimension, bevel segments 3 (5 on anything the camera gets close to); limbs are capsules. Cut faces stay **flat and sharp** (they are the drawing) | 🧪 |
| Blob shadows | Under props and figures, as before (radial alpha 0.55 → 0) | 🧪 |
| **Phones face their owners** | A held phone's screen faces the holder's eyes (screen normal within ≈ 30° of the line to the eyes), held naturally (≈ 0.75 rad tilt in the hand). **Never turned to the camera.** The slice shows the phone's back or edge and the screen's light on the face; screens are read only in the detail box (§ 6) | ✅ owner decision |
| Screen light | Each lit screen has a point light `#dbe6ff`, 0.6, reach 0.9, on the holder's face (0.15 when locked) | 🧪 |

## 4. Moods: Night and Day

Same slice, cast, orange and cut colour; light, palette (§ 1) and sky change.

| Light | Night | Day |
|---|---|---|
| Hemisphere | `#8aa0d8` / `#141a2a`, 0.55 | `#ffffff` / `#a8b4c8`, 0.85 |
| Key (directional, shadows) | `#ffc58a`, 0.85, from (−2, 3.4, 2.4) | `#ffffff`, 0.95, from (−2.5, 4.2, 2.5) |
| Fill | `#6f86c9`, 0.35, from (3, 2, 3) | `#cfe0ff`, 0.3, from (3, 2, 3) |
| Practicals | Lamp: point `#ffd29a`, 1.2, reach 4; shade emissive `#ffd9a0` at 0.8 (both outside the reserved band, no bloom) | None |
| Rim (only if figures merge with the wall) | `#9fb3e8`, 0.4, from behind | — |

| Rule | Value | Status |
|---|---|---|
| Which mood | The story decides: the moment happens at night → Night; daytime, "the next morning", scale, infrastructure by day → Day. **Default Day** | ✅ owner decision (both moods); 🧪 (default) |
| The system's mood | The path takes the mood of the slice it is in | 🧪 |
| Changing mood | Only on a location change (§ 8), or **one "time passes" beat per video** in the same slice: sky, palette and lights blend Night → Day over 1.5 s, cubic in-out | 🧪 |
| Night guard rails | Night is a **lit room** (practicals, cut faces glowing off-white), never arcs on a dark void (the rejected navy look, L§1, L§5) | 🧪 |

## 5. The orange system

| State | Spec | Status |
|---|---|---|
| **Glow** (the system) | A path from device to device: tube core r **0.018** (Night `orangeCore`; Day `orange`, since the pale core vanishes on light walls), halo r **0.055** `orange` at **25%**, both in the bloom layer. **Node dots** (r 0.035, core colour) at every device it touches, from the moment the route starts. Draw 1.3 to 2.1 s per leg, cubic in-out; a runner light (`orange`, 1.2, reach 1.6) rides the head. Dots travel the finished path | 🧪 |
| **Route through the section** | In the room: a soft curve phone → router. Out of the room: straight segments with right-angle turns, **inside the wall** (X-ray, below), down into the ground, then along the ground's **front cut face** (25 mm proud), out of the frame edge. The way back runs parallel, 0.2 units lower. Underground runs sit on the cut face so they read like a line on a section drawing | 🧪 |
| **Bleed** | Screens and LEDs turn `orange` while the system is active; the screen tell (flicker ≈ 2.5 Hz between 20 and 80% for ≈ 1 s, ramp 0.5 s) starts 1.5 s before the route draws | 🧪 |
| **X-ray** (reveal technique) | While the route runs inside a wall or a device body, that surface fades to **30% opacity** over 0.5 s (no depth write while see-through), and back after. **At most once per video**, on objects inside the slice, never as the opening image | ✅ owner decision (technique); 🧪 (values) |
| **Trace** | After the reveal, what the system touched keeps a mark for the rest of that slice: node dots stay lit, the router LED stays on, a delivered ad keeps its 5 px orange edge in the detail box. No wall stain, no wash. The next slice opens clean | ✅ owner decision |
| Only the system moves fast | Everything else moves slowly (§ 8) | 🧪 |

## 6. Overlays

Fonts (`fonts.ts`): **Inter** 500 to 800 (captions, tags, callouts, counters, every phone UI), **Archivo** 800 (statement cards, the title), **JetBrains Mono** 600 to 700 (title sub-line, attribution, the DETAIL tab). Fraunces is retired. All OFL. ✅ owner decision (faces); 🧪 (sizes).

All overlays use the mood's `ink`, `paper` and `inkSub` (§ 1); **square corners everywhere**, no pills, no rounded boxes. Left-aligned elements start at **x 120**; nothing readable past **x 888** or below **y 1248**.

| Element | Spec | Status |
|---|---|---|
| **Captions: the margin note** | Block: `capBg`, square corners, padding 13 / 26 / 15 / 28 px, a **12 px `ink` rule on the left edge**. Inter 700, **50 px / 1.22**, `ink`, **left-aligned**. Left edge x 120, max right edge x 888, bottom edge **y 1188** (2 lines grow up to ≈ 1045). **Words appear one by one as spoken** (each fades in over 4 frames); **no highlight, no underline, no dimmed preview, never orange**. ≤ 5 words a page, ≤ 2 lines. Off while a statement card is up | ✅ owner decision (style); 🧪 (values) |
| **Name tags: drawing labels** | A **26 px colour square** (the character's top colour, 3 px `paper` outline), 12 px gap, the role in Inter 700 **26 px**, uppercase, letter-spacing 0.08em, `ink`, no fill. Leader: 2 px `ink`, from the top of the head **straight up, then horizontal** (one right angle) to the tag in the margin outside the slice (left tags start at x 120, right tags end at x 888). Text ≤ 12 characters: YOU, FRIEND, MOM. On a character's first appearance and on re-entering in a new slice; hold ≥ 1.5 s, fade 10 frames; ≤ 2 at once; never with a card or statement | ✅ owner decision (style); 🧪 (values) |
| Callouts (objects) | Same as a tag without the square: elbow leader to the thing, ≤ 3 words, Inter 700 26 px uppercase | 🧪 |
| **Detail box** (how screens are read) | Square-cornered frame, 4 px `ink` border, `paper` fill, shadow `0 13px 32px rgba(0,0,0,0.25)`; a **DETAIL** tab top-left (Mono 700, 17 px, 0.16em, `paper` on `ink`). Holds a **flat, crisp 2D crop of the screen part that matters** (the search field, the ad). Default **324 to 360 px square**, max 696 × 620, inside the focal band (≈ top y 710); left edge x 120 or right edge x 888, on the holder's side. 2 px `ink` elbow leader to the phone. In over 10 frames (opacity, 8 px rise). Text inside ≥ 28 px. Counts as the frame's one card; captions continue. A **full-frame screen** (the box enlarged to the whole safe area) at most twice per video | 🧪 |
| **Statement card** | Archivo 800, **88 px / 0.95**, letter-spacing −0.03em, `ink` with a 32 px `paper` halo, no box; **left-aligned at x 120**, ≤ 2 lines, ≤ 14 characters a line; sentence case, a full stop: "One household." Low (default): bottom edge y 1000; high: top edge y 500. ≤ 2 per video, ≥ 6 s apart, never in the first 3 s, never with another card. Hold from its first spoken word to 0.8 s after its last (or the next word), 1.2 to 3.0 s. In: opacity 12 frames, 6 px rise, cubic in-out; out: 12 frames, no movement. Captions off while up | ✅ owner decision (card, rules); 🧪 (values) |
| **Attribution line** | JetBrains Mono 600, **24 px**, letter-spacing 0.18em, uppercase, `inkSub`, left-aligned at x 120. Who + year ("FTC STAFF REPORT, 2017"), ≤ 36 characters, no URL. Under a statement: 24 px below its last line, enters 6 frames after it, leaves with it. Alone: bottom edge y 1024, holds its claim's sentence (≥ 2.0 s). ≤ 2 per video; ✅ claims, or 🟡 spoken with that attribution; never 🎭. Fade 10 frames, no movement | ✅ owner decision (line, rules); 🧪 (values) |
| **Title block** | First scene only: enters at ≈ 1.0 s, holds ≈ 2.5 s, fades 10 frames. Top edge **y 340**, left edge x 120. `paper` fill, 3 px `ink` border, padding 13 / 24 / 15 px. Line 1: "No. 001 · The Living Room", Archivo 800, 37 px, `ink`. Line 2: "SECTION A–A · 9:47 PM", Mono 600, 19 px, 0.18em, `inkSub`: the story's time, matching the mood (never "9:41") | 🧪 |
| Counter | Same frame as the title block: Archivo 800 digits 80 px, Inter 600 unit 34 px, Mono sub 20 px | 🧪 |

**One idea per frame** (✅ owner decision). Besides the title block and captions, **at most one card at a time**: detail box, callout, counter or statement card. Name tags don't count but never share the frame with a card; the attribution line belongs to its claim. The next card enters only after the previous has left. The subject spans ≤ 60% of the focal band's width; nothing readable within 48 px of it except its own leader.

## 7. Layout and safe zones (`theme.SAFE`)

Combined safe rectangle: **x 120 to 888, y 288 to 1248** (P§1, ✅ platform rule). Everything readable stays inside it; set (the slice, sky, ground) may run under the rails and the bottom.

| Element | Position | Status |
|---|---|---|
| Title block | Top y 340, left x 120 (clears YouTube's 288 px top reserve, P§2) | ✅ platform rule (inside the zone); 🧪 (values) |
| The slice's room interior | Focal band **y 420 to 1040** | 🧪 |
| Detail box | Inside the focal band, on the holder's side | 🧪 |
| Statement card | Low: bottom y 1000; high: top y 500; x 120 to 888 | 🧪 |
| Attribution line | Under the statement, or alone with bottom edge y 1024 | 🧪 |
| Captions | Left x 120, bottom y 1188, right ≤ 888 | ✅ platform rule (inside the zone); 🧪 (values) |
| Name tags | Margins outside the slice, x 120 to 888, inside the focal band | 🧪 |
| Cover frame text | Inside the safe rectangle (3:4 grid crop, P§2) | ✅ platform rule |

## 8. Camera, transitions and motion

| Rule | Value | Why | Status |
|---|---|---|---|
| **Outside, always** | The camera never enters a slice: no eye-level interior, over-the-shoulder or handheld shots | Those are the reference's frame | ✅ owner decision |
| Angle | **One fixed 3/4 view per video**, from the front-right: camera at ≈ (4.6, 3.6, 8.6) looking at (0.05, 0.75, −0.15) for the living-room slice: ≈ **28° yaw** off the cut face, ≈ **16° down**. Never rotates within a video | A constant angle is recognisable | 🧪 |
| Lens | Perspective, **fov 26°** (long lens: flattens toward a drawing, keeps it real) | Between orthographic and the reference's wide interior | 🧪 |
| Moves | Truck, crane and slow push only, sine in-out, one move per scene; idle drift ≤ ±0.15 units, push ≤ 0.06 units/s. A push stops when a figure fills **40%** of frame height | The slice is calm; the orange moves | 🧪 |
| Same slice, next idea | The camera keeps moving through the scene change; no dissolve, no cut | One continuous look into one place | 🧪 |
| **Follow the line** (linked locations) | The camera cranes or trucks along the orange path to the next slice, stacked below, above or beside the current one, 18 to 30 frames, sine in-out; the path is visible crossing the seam | The journey out of the room is a camera move | ✅ owner decision (approach); 🧪 (values) |
| **Section slide** (unlinked locations) | The next slice slides in from below as the current leaves at the top, 18 frames, cubic in-out | Like scrolling a drawing | 🧪 |
| Cuts and dissolves | No cut within 1.5 s of the previous one. The 12-frame dissolve is retired between locations; allowed only for the loop and the "time passes" beat | 🧪 |
| Scene length | 3 to 6 s, one idea per scene | 🧪 |
| Easing | Cubic in-out for reveals, cards and routes; sine in-out for camera; overdamped springs for captions; no linear, no overshoot, no bounce | 🧪 |
| Determinism | Every value a function of `useCurrentFrame()`; `random('seed')`, never `Math.random`; no `useFrame` outside the post pass | ✅ studio rule |

**Motion principles** (owner feedback 2026-10-15, "everything feels static except the camera").
1. **Something is always alive.** Figures breathe (±0.012 units, phase-offset per person), blink (eye scale y → 0.1 and back over 4 frames, every 3 to 5 s, seeded per character), glance (head turns up to 0.5 rad toward what the line points at), lean in to a screen, lift a phone when it lights.
2. **The set:** Night: screen light flickers on faces, the lamp breathes ±3%. Day: leaves pass the window, dust in the sun. Orange ambient life (LED pulse) only while the system is active.
3. **Calm and slow;** the orange is the only fast thing.

### The cast (✅ owner decision; values 🧪)

`Mannequin` rig, **adult proportions** (head r 0.165, about 1/7 of standing height): never chibi. Faces: **two dot eyes** (`eye`, r 0.018, at ±0.055 across, slightly below centre), no mouth, no brows. Hair: a cap sphere (r 0.172) plus the detail. Never a realistic face (L§4).

| Tag | Top | Bottom | Skin | Hair | One detail |
|---|---|---|---|---|---|
| YOU | Cobalt hoodie `#2f55c9` | `#2a2d3a` | `#c58c63` | Short crop `#2a1d14` | The hood |
| FRIEND | Green sweater `#2e9a63` | `#4a4038` | `#a8734f` | Bun `#1a120c` (sphere r 0.075) | The bun |
| MOM | Plum cardigan `#7d4e8f` | `#3b3a40` | `#f1c9a5` | Grey bob `#8c8a86` | Round glasses, `#2a2b30` frames |
| extras | Slate `#8a909c` | `#5b606b` | any in range | Short `#3a3532` | Never tagged |

Skin range: `#f1c9a5`, `#d9a77f`, `#c58c63`, `#a8734f`, `#6e4630` (all below 60% saturation, outside the reserved band). Clothes stay cool or mid hues: a red top reads orange under the Night lamp.

### Phone-screen kit (✅ owner decision: realistic, full colour, generic; values 🧪)

| Rule | Value |
|---|---|
| Generic | Invented one-word app names ("Shop", "Feed"), invented products; no real logo, icon, brand colour or trade dress (no iOS blue `#0b84ff`, no green bubbles, no Dynamic Island); clock matches the story's time, never "9:41" |
| Mode follows mood | Night: dark UI (`#121318`, text `#e9ecf2`); Day: light UI (`#fafafa`, text `#15171a`) |
| Accents | Neutral: buttons `#15171a` / `#3a3f4b`; bubbles `#3a3f4b` sent, `#e6e7ea` received; never in the reserved band |
| The system's mark | Where the system shows on a screen (the targeted ad), a 5 px `orange` edge |
| Where it's read | Only in the detail box (§ 6). Phones in the slice face their owners (§ 3) |
| Readable | ≥ 28 px in the 1080 frame; one readable thing per screen |

### Intro and loop

No intro, no title card, no logo: the first frame is the slice at the story's moment, already lit, cast in place. **Loop:** in the last 0.5 s the phone in the slice locks (its screen light drops to 0 in 2 frames, one dry click), 4-frame hold, then frame 1; with no phone in the last shot, the camera returns to the opening framing and dissolves (12 frames) into frame 1.

## 9. Sound

| Rule | Value | Why | Status |
|---|---|---|---|
| Narrator | **American English**, one voice for the whole channel. Calm, unhurried, conversational, not a newsreader. AI voice labelled on all three platforms (P§6) | Owner asked for an American narrator; P§6 Instagram requires the label | ✅ owner feedback (American) / ✅ platform rule (label) / 🧪 (voice choice) |
| Model and settings | ElevenLabs **`eleven_v4`** by default. v4 takes only `stability` and `similarity_boost` (no `speed`, no `style`, no SSML). Starting point **stability 0.4 to 0.5**, similarity_boost 0.75 (`.claude/skills/elevenlabs-text-to-speech/references/voice-settings.md`) | Lower stability gives the natural variation a narrator has; below ≈ 0.35 v4 can sound erratic | 🧪 |
| Pacing | Comes from the words and punctuation, not a speed setting: commas for breath, full stops for a beat, **an ellipsis (…) for a longer pause**. Check on the transcript: ≈ 2.5 to 2.8 words/s overall | v4 has no `speed`; pauses live in the text | 🧪 |
| Audio tags | Only where a human narrator would naturally pause or react: a beat before the answer (`[pause]`), a breath before the reveal, a hint of curiosity on the question (`[curious]`). **At most about 1 per 3 sentences.** Never comic tags (`[laughs]`, `[sarcastic]`) | Tags overused are the audio version of the banned AI patterns (brand.md § Voice) | 🧪 |
| Performance text vs captions | Tags and pause marks live **only in the performance text** sent to the voice; never in `script.txt` words shown as captions, never on screen | Captions show what is said, not stage directions | 🧪 |
| Takes | Always generate **2 to 3 takes** of the same text and pick by ear (listen for flat stretches, odd stress, rushed numbers). Note the chosen take in the report | The same text and settings give different reads; the ear is the check | 🧪 |
| Music | Optional, one quiet bed per video, enters after the hook (≥ 3 s), sits 16 to 20 dB under the voice, no drums, no melody that competes with speech | Voice-first mix | 🧪 |
| SFX | One dry click (CC0) when the phone locks at the loop point; optional low hum while the orange is active, 20 dB under the voice. Nothing else | A quiet world; the sound marks the loop | 🧪 |
| Licensing | Only music and SFX we hold a multi-platform licence for: **Epidemic Sound Creator plan** (YouTube channel safelisted) and **Freesound CC0**, or **music we make ourselves** (own composition, or a generator whose terms grant commercial multi-platform rights and that registers nothing in Content ID; P§5). Only our own music or none in a video over 60 s (§ 10 Length). No in-app library sounds, no CC BY-NC, no track with Content ID risk (P§5, P rule 16) | Platform libraries are licensed per app; claims block Shorts over 1 min (P§3) | ✅ platform rule |
| Loudness | **−14 LUFS integrated, −1 dBTP** true peak (house choice, P rule 9) | No platform documents a target | 🧪 |

## 10. Export and upload

From P rules 7 to 15 (✅ platform rule unless noted).

| Setting | Value |
|---|---|
| Container, codec | MP4 (moov at front), H.264 High, 4:2:0 |
| Frame | 1080 × 1920, 30 fps |
| Bitrate | 8 to 12 Mbps VBR (YouTube recommends 8; Instagram caps at 25). File < 300 MB |
| Audio | AAC-LC, 48 kHz, stereo, ≥ 128 kbps |
| Length | Follows the idea, most Shorts **around 30 to 60 s** (brand.md § Structure, ✅ owner decision). **Over 60 s only with no licensed (Content ID-claimable) music**: our own music or none (§ 9 Licensing), or YouTube blocks the Short (P§3) |
| Upload | The clean master to each platform. Never a file downloaded from another app |
| AI label | On: TikTok "AI-generated", YouTube "altered or synthetic content", Instagram AI label |
| Title (YouTube) | ≤ 100 chars, hook in the first 40 |
| Hashtags | 3 to 5 on every platform (Instagram caps at 5) |
| Description | Hook line; if `sources.md` has a 🎭 claim, "Illustrative: [what is invented]." (brand.md § Sourcing policy; owner decision); one "Sources:" line; "Full sources: link in profile". ≤ 2,200 chars so one text works everywhere |
| Cover | Custom cover on Instagram and TikTok (desktop, 3:4-safe); on YouTube pick a frame until YPP. Cover text inside the safe rectangle |

## Review checklist (one still per scene, `yarn stills <slug>`)

1. **Outside, always:** every shot looks into a slice from outside at the video's one fixed angle; cut faces visible in `cut` off-white; no interior, eye-level or over-the-shoulder shot.
2. **Orange:** the only pixels in the reserved band (hue 8 to 40°, sat ≥ 60%, lightness 35 to 75%) are the system (path, nodes, dots, its light, active LEDs, its mark on a screen). Captions, tags, cards, people and cut faces are never orange.
3. **Phones face their owners:** no screen turned to the camera in the slice; every readable screen is in a detail box (or one of ≤ 2 full-frame screens); phone UI generic (no real app, logo, brand colour, "9:41").
4. **Mood:** one mood per slice (or the single time-passes beat); Night: subject p50 ≥ 30%, cut faces read off-white; Day: brightest near-neutral ≤ 96%, zero pixels at 255,255,255 (overlays, screens, glow masked).
5. **Frame:** title block only in the first scene (≈ 1 s, top y 340); nothing readable past x 888 or below y 1248; left-aligned elements start at x 120.
6. **Captions:** margin note (square, left rule, `capBg`), Inter 700 50 px, words appear as spoken, no highlight or underline, bottom y 1188, ≤ 5 words; off while a statement is up.
7. **Tags:** colour square + role, elbow leader, in the margin outside the slice; ≤ 2; never with a card; first appearance only (and on re-entry).
8. **One idea per frame:** at most one card (detail box, callout, counter, statement) besides title block and captions.
9. **Statement cards and attribution:** ≤ 2 each, Archivo 88 px left-aligned / Mono 24 px who + year, at the § 7 positions.
10. **System:** route leaves through the wall and ground on the cut face; node dots at devices; X-ray at most once; trace present on every later shot of that slice; next slice opens clean.
11. **Cast:** dot eyes, no mouth; adult proportions; colours as § 8; something alive in every shot (breath, blink, glance).
12. **No intro:** no title card, logo or text in the first second; the last 0.5 s is the phone-lock loop.
