# Brand changelog

Every change to `brand.md` or `style-guide.md` gets a line here: date, what changed, why (pointing to a `feedback.md` entry or a research section). Nothing changes silently.

## v0.2 · 2026-10-15 · Reconciled with the R3F build (scene-builder review round 1)

The scene-builder ported the Plaster Museum to `src/` and had to tune several values by eye. Every value below was verified in code before the guide changed. Where the built value won it is adopted (🧪); where the guide wins, the code change is listed at the end for the scene-builder. No owner feedback yet, so nothing moves to ✅ except studio rules.

**Adopted from the build (style-guide.md)**
- § 1: new token `orangeStainLine #dc8250` for the thin stain line (the old `orangeStain #e8702a` stays for lit surfaces, unused so far). Every colour row now names its `theme.ts` token; the five light colours are marked as inline in `MuseumLights` with no token yet. `cardShadow` and `textHalo` added as tokens.
- § 2: skylight 0.34 → **0.42** (wide shot read muddy at 0.34); vignette 0.46 → **0.34** (0.46 greyed the corners; ≈ 11% dark at the corners now); shadows radius 5 → **9**, bias −0.0004 → **−0.0008**, plus **normalBias 0.02** (acne on curved plaster); penumbra stays 0.75 (0.95 darkened the wall; it is cone falloff, not shadow softness). Light table now states the `intensity × π` multiplier (default 0.9, living room 0.84) and the per-scene key positions, including the room key at (1.3, 5.8, 4.6) → (0, 1.1, −0.5) so the wall is even and the table top not hot. Grain seeding described as built (`frame % 97`). Focus line given per camera preset.
- § 2: **`MuseumPost.tsx` is the single documented `useFrame` exception; no other `useFrame`** recorded as a ✅ studio rule (ESLint enforces it everywhere else).
- § 3: bevel segments 3 by default, **5** on couch, cushions and the pedestal phone; blob shadow height 4 to 16 mm; figure radii as built (forearm 0.062, shin 0.085); set dimensions as built (plinth at z 0.15, wall face z −0.93). Phone exhibit has **no screen UI** (plaster phone, recessed screen, one mic light).
- § 4: halo 0.07 at 22% → **2.6 × core (0.052) at 20%**; route draw 3 s → **1.7 to 3 s** (default 1.8; the mock-up's 3 s felt slow in a 4 s scene); bleed lights restated on `OrangeLight`'s 0–1 scale (screen 0.3, router 1.3, runner 1.2, mic 0.35) so lit plaster stays under 90%; the tell flickers 20 to 80% for ≈ 1 s then ramps 0.5 s, starting 1.5 s before the route; wall wash 0.55 → **0.40** (0.55 blew the wall past the exposure ceiling), plane 2.4 × 1.8; stain line **radius 0.010, flat, opacity 0.7, soft tube 0.03 at 0.12, on the wall plane behind the figures** (a lit tube on the route read as a cable in front of them); LED at mid-draw; glow fades to stain over 0.8 s. Matched tiles use `orange` × 0.62 albedo so they land on `#ff5b14` after the key light and bloom (added to the checklist). Search-bar strike recorded as the one orange allowed on a card.
- § 5: captions 62 → **64 px**; 16 px plaster halo (`textHalo`) and a 1 px ink edge on the orange word (orange on an orange-lit wall needed an edge); card type sizes for callout, search bar, ad card and counter written in; watermark `inkMuted` → `inkLabel` at 0.75; plate title thin-spaced (U+2009), not 3 spaces.
- § 6 and § 7: one card style (`card.ts`) for every overlay; callout leader 2 px `inkMuted`, hollow ring r 6 px, `place: 'side' | 'above'`, cards clamped to x 120 to 888 automatically; captions anchored by the bottom edge (single line centred at y 1152, bottom ≈ 1188). Exhibit label is **one label per scene**, entering with its scene. Wall plate: default 0.56 × 0.31 at (−1.15, 0.98) kept for the phone exhibit; living room **(−0.96, 1.95), 0.44 × 0.24** (the default spot is behind the couch).
- § 8: camera described by the built presets (wide, push, table; push starts where wide ends so the dissolve is invisible) instead of the mock-up's drift rates; dolly easing sine in-out, captions and label on overdamped springs.

**Guide wins (code to change, scene-builder)**
- § 8 Transitions: **12 frames, cubic in-out.** `theme.FADE` is still 8 and `FadeIn` in `src/Explainer.tsx` is linear. 8 is the pre-museum starter value (it is in the last commit, before the museum work) and was never tuned by eye; a 0.27 s linear fade reads as a softened cut, the museum wants a dissolve. 🧪: shorten to 8 if the first review stills show two readable cards overlapping mid-dissolve.
- § 7 Exhibit label: in the first scene the label should not appear before ≈ 1 s (brand.md § Structure); `Chip` currently enters at frame 4 of every scene and has no delay prop.
- § 1: light colours should get `theme.ts` tokens (studio rule: no inline colours).

**brand.md**
- § Structure, Reveal: "draws itself across the room over about 3 s" → "over 2 to 3 s", to match the built draw time (1.7 to 1.8 s in the living room, 3 s reserved for a route that crosses the whole frame).

## v0.1 · 2026-10-15 · First version, from the brand workshop

Created `brand.md`, `style-guide.md`, `feedback.md`, `CHANGELOG.md`.

**Decided by the owner (treated as given)**
- Topic: how everyday things secretly work, broad (objects, services, habits, systems), not only tech.
- Platforms: TikTok, YouTube Shorts, Instagram Reels; one master file for all three; English first, other languages later.
- Visual direction: **The Plaster Museum** (direction A of the round-2 direction board). Matte off-white plaster, museum lighting (skylight plus one warm spot, soft shadows, vignette, light grain, shallow focus). The hidden system is the only colour: one signal orange `#ff5b14` that glows, bleeds onto the plaster, and leaves a stain. Stains stay. Each video is a numbered exhibit ("No. 014 · The Living Room"); the chip becomes an exhibit label; captions in Fraunces with the current word in orange italic; small labels in JetBrains Mono; all geometry rounded; whites at 85 to 90%, never clipped (a brighter version was rejected as "too bright").
- Rejected looks: dark navy with glowing arcs (too common), pop-up book, lens-only. A glass lens may be used occasionally as a reveal technique, not as the identity.
- Rules stay flexible: each tagged 🧪 testing or ✅ proven with a one-line why; changes go through `feedback.md` and this changelog.

**Defaults written in, not yet confirmed by the owner (all 🧪, listed under "Open decisions" in brand.md)**
- Channel name: placeholder "WORKING TITLE"; candidate table in brand.md (How Things Secretly Work, Moonlit Mechanics, Backstage of Everything, The Hidden Exhibit, Museum of Everyday Things). Handles not checked here; need an in-app check on all three platforms.
- Mascot: a silent night guard, a small plaster figure with a torch; the beam can be the orange reveal; torch click-on/click-off is the sting and the loop point; never in the first 3 s; never speaks. Alternative: no mascot.
- Length: 59 s or less (platforms.md §3: YouTube blocks Shorts over 1 min with any Content ID claim; TikTok Creator Rewards needs ≥ 1 min, revisit later).
- AI-voice label: on, on all three platforms (platforms.md §6).
- Sources: in the post description, never on screen (owner's choice; landscape.md §4 had argued for an on-screen chip).
- Added by the brand-director as defaults: cadence 3 to 5 exhibits a week (landscape.md §4); lens at most once per video and never in consecutive exhibits; crossfade 12 frames; music 16 to 20 dB under voice; loudness −14 LUFS / −1 dBTP (platforms.md rule 9).

**Values taken from the direction board mock-up** (`museumScene`, three.js r149 units; to be re-tuned in R3F): palette hexes, light rig (hemisphere 0.34, key spot 1.0, fill 0.15, rim 0.2), post-processing (exposure 0.86, knee at 0.82, vignette 0.46, grain 0.035, tilt 0.75, bloom 1.0), plaster roughness 0.92/0.95, orange path (core 0.02 `#ffb27a`, halo 0.07 at 22%), stain values, label and plate typography, camera fov 40° and drift.

**Layout values taken from platforms.md** (§1 and §2): safe rectangle x 120 to 888, y 288 to 1248; label top 340; captions centred at y 1152, 696 px wide; watermark top 300 left 120; focal band y 420 to 1040; export settings from platforms.md rules 7 to 15.
