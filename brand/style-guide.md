# WORKING TITLE: style guide (The Plaster Museum)

v0.2, 2026-10-15. Owner: brand-director. Frame: **1080 × 1920, 30 fps**. v0.1 came from the direction board (`museumScene`, three.js r149 units); v0.2 is reconciled with the R3F build in `src/` (scene-builder review round 1), so every value here is one you can read in code. Each colour names its `theme.ts` token; a colour with no token is marked and must not be copied elsewhere. Research citations: `brand/research/platforms.md` (P§), `brand/research/landscape.md` (L§). Status: 🧪 testing, ✅ proven (by feedback, or a platform rule).

The look in one line: everything is matte off-white plaster lit like a museum; the hidden system is the only colour, it glows, bleeds light onto the plaster, and leaves a stain where it has been. Stains stay.

## 1. Palette (`src/theme.ts`)

| Token (`theme.*`) | Hex | Used for |
|---|---|---|
| `plaster` | `#e8e3da` | Walls, furniture, people, devices, the guard: everything |
| `plasterShade` | `#dad3c7` | Plinth, pedestals, the recessed phone screen, the ad-card placeholder square |
| `plasterFloor` | `#cdc6b9` | The museum floor beyond the plinth |
| `museum` | `#d6d0c5` | Scene background, fog colour, and the composition's backdrop |
| `plate` / `plateBorder` | `#d6cfc2` / `#a79d8d` | Engraved wall plate: slab and texture fill / its rule |
| `labelCard` / `labelBorder` | `#f8f4ed` / `#d3cbbd` | Every 2D card (exhibit label, callout, search bar, ad card, counter) and the callout ring fill |
| `cardShadow` | `0 5px 16px rgba(60,50,30,0.12)` | Shadow under every 2D card |
| `textHalo` | `0 0 16px rgba(232,227,218,0.85)` | Plaster halo behind captions (plaster at 85%) |
| `orange` | `#ff5b14` | The hidden system: path halo, screens, LEDs, mic light, bleed lights, wall wash, the current caption word, the search-bar strike |
| `orangeCore` | `#ffb27a` | Hot centre of a glowing path |
| `orangeStain` | `#e8702a` | A lit matte surface the system has claimed (`stainSurface()`), not yet used in a scene |
| `orangeStainLine` | `#dc8250` | The thin stain line a path leaves on the wall: flat, translucent (new in v0.2) |
| `orangeDot` | `#fff0e0` | Travelling dots on an active path |
| `ink` | `#1f1c18` | Captions; also the caption outline at 35% alpha |
| `inkLabel` / `inkMuted` | `#2a2622` / `#7a7064` | Card titles, numbers, watermark / sub-lines, callout leaders and rings, icons |
| `inkPlate` / `inkPlateMuted` | `#2b2722` / `#5c5449` | Plate number / plate title (3D texture) |

Light colours have no token yet and live inline in `MuseumLights` (`src/three/MuseumStage.tsx`): sky `#fff9f1`, ground `#cbc2b4`, key `#fff3e3`, fill `#dfe6f2`, rim `#ffffff`. Nothing else may use them. Every 3D colour goes through `raw()` (`src/three/plaster.ts`), which keeps the hex display-referred so it lights as it did in the mock-up.

| Rule | Why | Status |
|---|---|---|
| **One accent per video, and it is always `orange`.** Data, money, heat, sound, pressure: all orange. No cyan, no red, no green | One colour is the identity (L§3); multi-accent was the rejected navy direction | 🧪 |
| Nothing in the frame is pure white `#ffffff` or pure black `#000000` (the rim light's colour is a light, not a surface) | Plaster world; § 2 exposure ceiling | ✅ owner feedback ("too bright") |
| New colours go in `src/theme.ts`, never inline in a video or scene (CLAUDE.md) | The shared look is the brand; this table is the check | ✅ studio rule |

## 2. Light (`MuseumLights`, `MuseumStage`, `MuseumPost`)

Every light is multiplied by `intensity × π` (`MuseumLights intensity`, default **0.9**; the living room uses **0.84** because its key is closer). The table gives the pre-multiplier values, so the ratios are what to keep.

| Light | Type | Colour | Value | Position → target | Notes |
|---|---|---|---|---|---|
| Skylight | Hemisphere | sky `#fff9f1`, ground `#cbc2b4` | **0.42** (v0.1: 0.34) | | The wide shot read muddy at the top and sides at 0.34 |
| Key spot | Spot | `#fff3e3` | 1.0 | default (1.5, 7, 3.5) → (0, 0.7, −0.1); living room (1.3, 5.8, 4.6) → (0, 1.1, −0.5); tiles (2, 9, 5) → (0, −0.5, −1) | Cone half-angle 0.5 rad (≈ 29°), penumbra **0.75** (0.95 dims everything off-axis; penumbra is cone falloff, not shadow softness). The only shadow caster. Aim it at the figures and wall, never at a table top |
| Fill | Directional | `#dfe6f2` (cool) | 0.15 | from (−4, 3, 4) | Opens the shadow side without flattening |
| Rim | Directional | `#ffffff` | 0.2 | from (0, 4, −5) | Separates figures from the back wall |
| Fog | Linear | `museum` | 9 → 18 units (tiles 8 → 24) | | Camera sits ≈ 6.2 units from the subject, so fog touches only the far floor |

Ratio key : skylight : rim : fill ≈ **1 : 0.42 : 0.2 : 0.15**.

| Rule | Value | Why | Status |
|---|---|---|---|
| Shadows | Key spot only; PCF soft (`shadows="percentage"`), 2048 map, **radius 9, bias −0.0008, normalBias 0.02**, shadow camera 1 → 20. Soft-edged, never hard; no hatching on curved plaster | Museum skylight feel; v0.1's radius 5 / bias −0.0004 gave acne on curved parts | 🧪 |
| Exposure | Multiply by **0.86**, then soft knee: anything above **0.82** is compressed by 55%. Pure white lands at ≈ 0.90 | Owner rejected a brighter version as "too bright" | ✅ owner feedback |
| Exposure ceiling (the check) | The brightest plaster in any still reads **85 to 90%** (RGB 217 to 230). Nothing reads 255 except the core of a glow | Checkable in a still with a colour picker | ✅ owner feedback |
| Vignette | Strength **0.34** (v0.1: 0.46), falloff smoothstep(0.35, 0.95) of the distance from centre in frame-height units: 0 inside a circle of radius ≈ 672 px, about **11% darker at the corners** | 0.46 closed the plaster corners down toward grey; the eye still lands on the exhibit at 0.34 | 🧪 |
| Grain | Monochrome, 1 px, strength 0.035 (±1.75% luminance), new pattern every frame, seeded from `useCurrentFrame()` (`(frame % 97) × 13.37`), never `Math.random` | Hides banding on flat plaster; CLAUDE.md determinism | 🧪 |
| Shallow focus | Focus line `focusY` as a fraction of the frame from the top, per camera: wide 0.45 (y ≈ 864), push and table 0.5, phone 0.42, tiles 0.5. Sharp within ±0.14 of frame height (≈ ±269 px), blending up to 75% of a half-res blur at the top and bottom | Tilt-shift makes the room read as an exhibit model | 🧪 |
| Bloom | Selective: only meshes with `userData.glow`. Half-res, 2 blur passes (spread 1.7 px, 3.4 px), added at 1.0 | Plaster must never bloom | 🧪 |
| The post pass | `src/three/MuseumPost.tsx` is the **single documented `useFrame` exception** (with an `eslint-disable` line): R3F only lets a priority > 0 `useFrame` take over drawing. It only draws; no motion reads the clock. **No other `useFrame` anywhere**, ever | CLAUDE.md determinism; ESLint blocks the import everywhere else | ✅ studio rule |

## 3. Materials and geometry (`src/three/plaster.ts`)

| Rule | Value | Why | Status |
|---|---|---|---|
| Plaster | `plaster(colour, roughness)`: `MeshStandardMaterial`, **roughness 0.92, metalness 0**. Pedestals `plasterShade` at 0.95. Floor roughness 1.0. Matched tiles 0.9 | Matte, no specular hot spots | 🧪 |
| One material | People, furniture, devices, walls, the guard: the same plaster. Only the plate texture and the orange stain carry anything else | The orange rule only works if nothing else differs | 🧪 |
| No textures, no wood, no fabric, **no screens with UI** (the phone exhibit is a plaster phone with a recessed `plasterShade` screen and one mic light) | Any surface detail competes with the orange | 🧪 |
| Rounded edges on all geometry | `roundedBox`: radius ≈ **3 to 8% of the smallest dimension**, minimum 0.005. Built radii: couch 0.08, cushions 0.06, pedestal phone 0.06, plinth 0.05, wall slab 0.04, feet and router 0.03, table 0.02, shelf 0.01, hand phone 0.008, plate slab 0.006. Bevel segments **3** by default, **5** on anything the camera gets close to (couch, cushions, the pedestal phone): 3 reads faceted there. Limbs are capsules | Bevels catch the key light; that is most of what makes simple 3D look finished | 🧪 |
| Blob shadows | `BlobShadow`: radial gradient alpha 0.55 at centre → 0.18 at 55% → 0 at edge, 4 to 16 mm above the surface; plane opacity 0.55 (0.44 for secondary pieces and pedestals) | Cheap contact shadow; reads as ambient occlusion | 🧪 |
| Figures | Faceless. `Mannequin`: sphere head r 0.165 (scaled 0.95, 1.06, 1), torso capsule r 0.2, upper arm r 0.07, forearm r 0.062, thigh r 0.1, shin r 0.085; seated, slouched, both hands on the phone; breathes ±0.008 units and nods ±0.03 rad, phase-offset per person. `Bust` (shoulders, neck, head on a rounded pedestal) for a person as an exhibit. The guard: same build at ≈ 1/3 scale, standing, torch in one hand (not built yet) | L§4: non-uncanny, no AI-slop association | 🧪 |
| The set | `MuseumSet`: `plasterShade` plinth 3.8 × 0.5 × 3.2, top at y 0, centred at z 0.15; wall slab 3.8 × 3.3 × 0.12 at z −0.99 (front face z −0.93); `plasterFloor` plane at y −0.5 running into fog. Tiles: no plinth, no wall | Same frame for every exhibit; the room inside changes every time | 🧪 |

## 4. The orange system (`src/three/OrangePath.tsx`)

Three states. Each video goes through all three in order: glow → bleed → stain.

| State | Spec (as built) | Why | Status |
|---|---|---|---|
| **Glow** (the system itself) | `OrangePath`: tube core radius **0.02** in `orangeCore`, halo **2.6 × core (0.052)** in `orange` at **20%** opacity, both in the bloom layer. The route draws over **1.7 to 3 s** (`pathDuration`, default 1.8; use 3 s only for a route that crosses the whole frame), cubic in-out. Once complete, 5 `orangeDot` dots (r 1.9 × core = 0.038) travel it at 0.3 of its length per second; they shrink and fade with the glow | The system is a flow, not an object (L takeaway 1) | 🧪 |
| **Bleed** (light on plaster) | `OrangeLight` in `orange`, 0–1 scale (× 0.45 internally), decay 2: phone screen 0.3 (reach 1.4), router hub 1.3 (reach 2.8), the moving head of the path 1.2 (reach 1.8), mic light 0.35 (reach 0.7). Lit plaster must stay under 90%. Screens and LEDs turn `orange` while the system is active. **The tell:** a screen flickers at ≈ 2.5 Hz between 20 and 80% for ≈ 1 s, then ramps to 100% over 0.5 s, starting **1.5 s before the route draws** | The plaster shows the colour it cannot have itself; the flicker is a tell before the words | 🧪 |
| **Stain** (what remains) | **Wall wash** (`OrangeWash`): radial `orange` rgba(255,91,20,0.9) → 0.35 at 45% → 0, plane 2.4 × 1.8 behind the hub, growing from 60 to 100% size, opacity rising to **0.40** (v0.1: 0.55) while the route is 50 to 85% drawn. **Stain line**: tube radius **0.010** in `orangeStainLine`, flat (`MeshBasicMaterial`) at **0.7** opacity, with a soft second tube at 3 × radius (0.03) at **0.12**; it runs **on the wall plane behind the figures** (`stainLegs`, 4 mm in front of the wall), never along the glowing route in front of them, and draws with the same progress. Router LED comes on at 46 to 54% of the draw. After `glowFor` seconds the glow fades over 0.8 s and the stain is all that is left. **Stains never fade within a video.** The next exhibit opens clean | A lit stain read as a cable; flat pigment on the wall reads as a mark. 0.55 wash blew the wall past the ceiling. "Stains stay" is the owner's rule | 🧪 |

| May be orange | Never orange |
|---|---|
| The hidden system (paths, signals, flows), its halo and dots | People, furniture, walls, floor, plinth |
| Light cast by the system onto plaster; the wall wash and stain line | The exhibit label, the wall plate, callout cards, counters, the `ILLUSTRATIVE` watermark |
| Device screens, LEDs, the mic light while the system is active | The night guard (his torch beam may be) |
| The current caption word; the strike-through on the search bar (the system's mark on the query) | Any second colour, tint, or gradient to another hue |
| The torch beam and what it lights | The background or fog |

**The glass lens (optional reveal technique, 🧪, not built).** Brass rim `#c9a35a` (no token until built), magnification 1.15, colour fringe 0.012, ring width ≈ 0.4% of frame height, soft drop shadow. The orange exists only inside the glass until it opens to full frame at the reveal. At most once per video, never in two consecutive exhibits, never as the opening image. It is a technique, not the identity.

## 5. Type (`src/fonts.ts`)

Fonts: **Fraunces** (`fonts.serif`: captions, card titles, digits, plate number) and **JetBrains Mono** (`fonts.mono`: sub-lines, callout titles, tags, watermark, plate title). No third face.

| Element | Face | Size / leading | Colour | Rules | Status |
|---|---|---|---|---|---|
| Captions | Fraunces 600 | **64 px / 1.12** (≈ 72 px line; v0.1: 62) | `ink`; text-shadow `0 1px 0 rgba(255,255,255,0.55)` plus `textHalo` | Max **3 words per page**, max 2 lines, centred, balanced wrap. **Current word: `orange`, italic**, with a 1 px `ink` edge (`-webkit-text-stroke 2px rgba(31,28,24,0.35)`, `paint-order: stroke fill`, so 1 px shows outside the glyph). No background box. Page enters with an overdamped spring (8 px rise, opacity 0.4 → 1) | 🧪 |
| Exhibit label title | Fraunces 600 | 30 px, letter-spacing 0.02em | `inkLabel` | "No. 014 · The Living Room" | 🧪 |
| Exhibit label sub-line | JetBrains Mono 500 | 20 px, letter-spacing 0.2em, uppercase | `inkMuted` | "EXHIBIT · 2 A.M.", ≤ 18 characters (brand.md § Naming) | 🧪 |
| Callout title / sub | JetBrains Mono 600 / 500 | 26 / 20 px, letter-spacing 0.12em, uppercase (`monoStyle`) | `inkLabel` / `inkMuted` | ≤ 3 words, never a sentence, never a number that is not ✅ verified | 🧪 |
| Search bar | Fraunces 600 query, Mono 600 tag | 30 / 18 px | `inkLabel` / `inkMuted`; strike 3 px `orange` | Query types in at 1.5 frames per character | 🧪 |
| Ad card | Mono 500 label, Fraunces 600 title | 18 / 34 px | `inkMuted` / `inkLabel` | 64 px `plasterShade` placeholder square, never a picture | 🧪 |
| Counter | Fraunces 600 digits and unit, Mono 500 sub | 80 / 34 / 20 px, tabular lining digits | `inkLabel` / `inkMuted` | One number per video, rounded, ✅ verified (brand.md § Voice) | 🧪 |
| `ILLUSTRATIVE` watermark | JetBrains Mono 600 | 20 px, letter-spacing 0.14em | `inkLabel` at 0.75 opacity | Only when `sources.md` has a 🎭 claim (CLAUDE.md) | ✅ studio rule |
| Plate number / title (3D texture) | Fraunces 600 / JetBrains Mono 500 | 86 px / 30 px, letters separated by thin spaces (U+2009) | `inkPlate` / `inkPlateMuted` | See § 7 | 🧪 |

Caption pacing: narration runs ≈ 2.5 to 2.8 words/s, so a 3-word page lasts about 1.1 s; well under TikTok's 5 to 10 words/s ceiling for on-screen text (P§4).

## 6. Layout and safe zones (`theme.SAFE`)

Combined safe rectangle, strictest edge of TikTok, Shorts and Reels: **x 120 to 888, y 288 to 1248** (`SAFE`, 768 × 960 px). For centred elements use symmetric 192 px side margins (x 192 to 888, 696 px wide). (P§1, ✅ platform rule.)

| Element | Position (px, 1080 × 1920) | Why | Status |
|---|---|---|---|
| Exhibit label (`Chip`) | Centred between x 120 and 888, **top 340** | Clears YouTube's 288 px top reserve (P§2) | ✅ platform rule |
| `ILLUSTRATIVE` watermark | **top 300, left 120**, left-aligned | Off the right rail; above the label (P§2) | ✅ platform rule |
| Focal action (the 3D subject, the orange) | **y 420 to 1040**, x 120 to 888 | Between label and captions (P§2) | 🧪 |
| Callout cards | Anchored on the thing (fractions of the frame); `place: 'side'` (card beside the anchor, `dx`/`dy` to its near edge) or `'above'` (card centred over the anchor). The card is **clamped to x 120 to 888 automatically** (`clampToSafe`); the leader follows it | Nothing readable past the rails, without hand-tuning | ✅ studio rule |
| Night guard | Lower-left or lower-right of the focal band, never over the focal action | brand.md § Mascot | 🧪 |
| Captions | Centred, 696 px wide, anchored by the bottom edge: a single line is centred on **y 1152** (bottom edge ≈ 1188); a 2-line page grows upward to ≈ 1045 | Inside 1248 (P§2) | ✅ platform rule |
| Wall plate | Set dressing in 3D; may fall anywhere. It never carries information that is not also on the exhibit label | It is texture, not UI | 🧪 |
| Cover frame text | Inside the safe rectangle | Survives the 3:4 grid crop (P§2) | ✅ platform rule |

Stays out of the **right 192 px (x > 888)**: everything readable, the guard, the end of any orange path that matters. Stays out of the **bottom 672 px (y > 1248)**: everything readable. The plinth edge and floor may run under both; they are set, not content.

## 7. Cards, exhibit label and wall plate

**One card style** (`cardStyle` in `src/components/card.ts`) for every 2D overlay: callout, search bar, ad card, counter, exhibit label. Paper, not plaster: `labelCard` fill, 2 px `labelBorder`, **square corners**, 1 px inset white highlight at the top (rgba(255,255,255,0.7)), `cardShadow`. Cards enter over 10 to 12 frames with an 8 to 10 px rise, cubic in-out (`ease`). Never orange, except the search-bar strike.

**Callout** (`Callout`): a hollow ring on the thing (radius 6 px, 2 px `inkMuted` stroke, `labelCard` fill, scales in over 8 frames), a **2 px `inkMuted` leader** drawn over frames 4 to 16, then the card (frames 12 to 24; padding 12 / 20 / 13 px).

**Exhibit label** (`Chip`): padding 16 px top, 32 px sides, 18 px bottom; title and sub-line stacked, centred, 3 px apart. With a `title`, line 1 is the serif title and line 2 the mono sub-line; without one, the text alone in serif. Timing: one label per scene, entering with its scene (overdamped spring from frame 4) and leaving with its crossfade. In the **first scene it should not appear before ≈ 1 s** (brand.md § Structure: the first frame is the exhibit, not text).

**Wall plate** (`WallPlate`, 3D, on the back wall of every exhibit):

| Property | Value |
|---|---|
| Default size and place | 0.56 × 0.31 units at (−1.15, 0.98) on the wall face: seated-eye height, left of centre (used by the phone exhibit) |
| Per exhibit | Move it to where the camera can see it and the stain will not cross it. Living room: **(−0.96, 1.95), 0.44 × 0.24**, left of the shelf; the default spot is behind the couch there |
| Build | `plate` slab 0.024 thick, radius 0.006, with a 512 × 280 texture inset 6 mm: `plate` fill, 3 px `plateBorder` rule inset 14 px, number Fraunces 600 86 px at y 108, title Mono 500 30 px thin-spaced at y 196 |
| Material | Standard, roughness 0.8, no emissive. It receives the orange bleed like everything else. Rendering waits for the fonts (`delayRender`) |

## 8. Camera and motion

| Rule | Value | Why | Status |
|---|---|---|---|
| Lens | Perspective, **fov 40°**, height ≈ 2.0 units looking at (0, 1.0, 0): slightly above seated eye level | Museum visitor's eye, not a drone | 🧪 |
| Move | One slow dolly per scene (`CameraRig`), sine in-out across the whole scene. Living-room presets: **wide** (−0.2, 2.0, 6.3) → (0.15, 1.95, 5.75); **push** starts exactly where wide ends and goes to (0.3, 1.95, 4.9) looking at (0.05, 1.45, −0.2), so wide → push on consecutive scenes reads as one move; **table** (0.15, 1.8, 4.3) → (0.05, 1.7, 3.9). No pans faster than these, no handheld shake | The room is still; the orange moves. Sine is gentler than cubic at the start and end of a move that lasts a whole scene | 🧪 |
| Scene length | **3 to 6 s** (90 to 180 frames), one idea per scene (CLAUDE.md) | Pacing benchmark from L§2, unverified against our retention | 🧪 |
| Cuts | No cut faster than **1.5 s** (45 frames) after the previous one. No cuts inside the reveal | Calm register | 🧪 |
| Transitions | Dissolve only: the next scene fades in over the previous one, which keeps running underneath, for **12 frames (0.4 s), cubic in-out** (`theme.FADE`; the code still has 8 and linear, see CHANGELOG v0.2). No wipes, no zoom transitions | One transition type keeps the museum quiet; 8 frames is the pre-museum starter value and reads as a softened cut | 🧪 |
| Easing | Cubic in-out for reveals, opacity, card entries and the route (`ease`, `seg`); sine in-out for the camera dolly; overdamped springs (no overshoot) for captions and the label. No linear, no overshoot, no bounce | Mock-up value | 🧪 |
| The reveal | Route draws over 1.7 to 3 s; the screen tell starts 1.5 s before it; LED at mid-draw; wall wash during the second half; glow holds `glowFor` then fades to the stain over 0.8 s | § 4 | 🧪 |
| Torch sting | Click-on: beam at full in 2 frames. Click-off at the loop point: orange and beam to zero in 2 frames, plaster and stains remain, 4 frames hold, then the first frame of the video. The guard is never in frame in the first 3 s; the beam may be (not built) | brand.md § Mascot; L§3 | 🧪 |
| Determinism | Every value is a function of `useCurrentFrame()`; `random('seed')` from Remotion, never `Math.random`; no `useFrame` outside `MuseumPost` (§ 2) | Renders must be reproducible | ✅ studio rule |

## 9. Sound

| Rule | Value | Why | Status |
|---|---|---|---|
| Voice | Calm, low, unhurried; ≈ 2.5 to 2.8 words/s; pauses of ≥ 0.4 s at full stops. One voice for the whole channel. AI voice labelled on all three platforms (P§6) | brand.md § Voice; P§6 Instagram requires the label | ✅ platform rule (label) / 🧪 (voice) |
| Music | Optional, one quiet bed per video, enters after the hook (≥ 3 s), sits 16 to 20 dB under the voice, no drums, no melody that competes with speech | Voice-first mix | 🧪 |
| SFX | Torch click (one dry mechanical click, CC0) at the loop point; optional low hum while the orange is active, 20 dB under the voice. Nothing else | The museum is quiet | 🧪 |
| Licensing | Only music and SFX we hold a multi-platform licence for: **Epidemic Sound Creator plan** (YouTube channel safelisted) and **Freesound CC0**. No in-app library sounds, no CC BY-NC, no track with Content ID risk (P§5, P rule 16) | Platform libraries are licensed per app; claims block Shorts over 1 min (P§3) | ✅ platform rule |
| Loudness | **−14 LUFS integrated, −1 dBTP** true peak (house choice, P rule 9) | No platform documents a target | 🧪 |

## 10. Export and upload

From P rules 7 to 15 (✅ platform rule unless noted).

| Setting | Value |
|---|---|
| Container, codec | MP4 (moov at front), H.264 High, 4:2:0 |
| Frame | 1080 × 1920, 30 fps |
| Bitrate | 8 to 12 Mbps VBR (YouTube recommends 8; Instagram caps at 25). File < 300 MB |
| Audio | AAC-LC, 48 kHz, stereo, ≥ 128 kbps |
| Length | **≤ 59 s** (🧪, see brand.md Open decision 3). Over 60 s only with zero-Content-ID music |
| Upload | The clean master to each platform. Never a file downloaded from another app |
| AI label | On: TikTok "AI-generated", YouTube "altered or synthetic content", Instagram AI label |
| Title (YouTube) | ≤ 100 chars, hook in the first 40 |
| Hashtags | 3 to 5 on every platform (Instagram caps at 5) |
| Description | Hook line, one "Sources:" line, "Full sources: link in profile". ≤ 2,200 chars so one text works everywhere |
| Cover | Custom cover on Instagram and TikTok (desktop, 3:4-safe); on YouTube pick a frame until YPP. Cover text inside the safe rectangle |

## Review checklist (one still per scene, `yarn stills <slug>`)

1. Brightest plaster 85 to 90%, nothing clipped; lit plaster near an orange light under 90%.
2. Only one hue in the frame, and it is `#ff5b14` or a bleed of it (matched tiles: `orange` × 0.62 albedo, so they land on `#ff5b14` under the key light after bloom).
3. Label at top 340, captions centred at y 1152, nothing readable past x 888 or y 1248.
4. Current caption word is orange italic with its ink edge; ≤ 3 words on the page.
5. Rounded edges everywhere; no texture other than plate and stain; no screen UI.
6. Stain line on the wall behind the figures (not in front of them) and the wash present in every scene after the reveal.
7. No guard and no label text in the first second; no guard in the first 3 s.
