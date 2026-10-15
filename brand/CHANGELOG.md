# Brand changelog

Every change to `brand.md` or `style-guide.md` gets a line here: date, what changed, why (pointing to a `feedback.md` entry or a research section). Nothing changes silently.

## v0.8 · 2026-10-15 · The Section replaces the Plaster Museum (owner decision)

Relayed by the main session: the owner approved `proposals/visual-identity-v1.md` rev. 2 with **frame A, The Section**, all 15 summary lines with their recommendations, after seeing the mock-up `section-frame.html`; plus one owner addition, **phones face their owners, never the camera**. Background: the owner chose a reference video's style (@wealthy_path, coloured characters with name tags, real phone screens, several locations), then said our first mock-ups (`story-styles.html`) felt "like a copy", so the frame became ours. No `feedback.md` entry (nothing published). The decisions are ✅ owner decision; **every value is 🧪 until the pilot's stills are judged** (noted at the top of the style guide).

**How values were set.** Where the approved proposal and the mock-up differ, the mock-up wins on *values* (it is what the owner saw), the proposal wins on *rules*. Mock-up values adopted: camera fov 26° at ≈ (4.6, 3.6, 8.6) → (0.05, 0.75, −0.15) (proposal: 24°, 32° yaw, −18°); slice 3.4 × 2.4, walls 0.18; Night and Day palettes and lights (incl. Day couch blue `#6f8fd1`, not the proposal's sage); YOU `#2f55c9`, FRIEND `#2e9a63`; one `cut` colour for every cut face, ground included (proposal had a separate `#cfc6b8`); overlay ink/paper per mood (Night ink = `cut`); caption 50 px with a 12 px left rule; tag colour square 26 px with a paper outline; detail box 324 to 360 px with a DETAIL tab and shadow; title block as a bordered paper box with a sub-line "SECTION A–A · time"; statement letter-spacing −0.03em; attribution Mono 600 24 px 0.18em; X-ray at 30% opacity; node dots r 0.035; route along the ground's cut face; breathing ±0.012. Mock-up values **not** adopted because they break a rule: the orange-coloured current caption word (`#ffb27a` / `#e14d0f`, reserved band; approved line 5 says no highlight) and the dimmed word preview; tags in JetBrains Mono (approved line 10 says Inter); right margin elements to x 960 and captions at y ≈ 1363 (safe zone x ≤ 888, y ≤ 1248); statement at ≈ 119 px across 840 px (too wide for the safe zone; 88 px kept); `#ffffff` shelf in Day (no pure white; `#f7f6f2`); "9:41 PM" in the title (never 9:41).

**style-guide.md rewritten as v0.8 "The Section".** § 1 palette (new tokens `cut`, `eye`, per-mood `bg`, `sky`, `wall`, `floor`, `soft`, `wood`, `trim`, `device`, `earth`, `ink`, `paper`, `inkSub`, `capBg`; the orange rule and the **reserved band** hue 8–40°, sat ≥ 60%, lightness 35–75%); § 2 light and finish (Day whites check kept, Night floor, selective bloom, single `useFrame` exception); § 3 the slice (outside always; geometry; materials; **phones face their owners**; screen light); § 4 moods (Night/Day lights, default Day, one time-passes beat); § 5 the orange system (glow with node dots, route through wall and ground, bleed and tell kept, **X-ray** once per video, **trace**); § 6 overlays (margin-note captions, drawing-label tags, detail box, statement, attribution, title block, counter; one idea per frame); § 7 layout; § 8 camera, transitions (follow the line, section slide), motion, cast, phone-screen kit, intro and loop; § 9 sound (torch click → phone-lock click); § 10 unchanged (v0.7 length). **Review checklist rewritten** (12 checks for the new frame).

**brand.md.** Header; Open decisions 2 (mascot → no mascot, the cast) and 7 (lens → retired, X-ray) settled, rows removed, numbers not reused; cadence row notes the higher build cost; § Promise one sentence and difference 3 (The Section, ✅); § Audience "Not for: kids" (dollhouse guard); § Voice register, point-at-screen why, banned words (no character speaks); § Hook first frame; § Structure: new "Several locations" paragraph, the step table's third column rewritten (slice, journey, X-ray, trace, phone-lock loop); **§ Mascot replaced by § The cast** (YOU, FRIEND, MOM, extras; dot eyes; never speaks; tags; phones face owners); § Naming of videos (title block, first scene only, sub-line = section and story time; per-scene label retired; "No. 014" example → No. 001); § Name and the proposed bio drop "museum"/"exhibit"; § What we never do: orange rule, no camera inside a room, no screen to the camera or real brands, no pills or underlined/orange caption words, Day whites, no speaking characters, dot-eye faces, reuse rule restated for slices.

**Retired** (were 🧪 or ✅ for the museum): plaster on everything and "one material"; plaster/museum/plate/label-card tokens; `MuseumSet`, wall plate, glass lens; "no screens with UI" and `plasterGlass`; faceless figures; "one accent, nothing else coloured"; the museum brightness values (skylight 0.42, exposure 0.86, shoulder 0.82, vignette 0.34; the ✅ applied to that look) and the p95 check; wall stain line and wash ("stains stay" → trace); Fraunces, orange-italic caption word, paper cards with square-corner `cardStyle`; exhibit sub-line, per-scene label and its crossfade rule; the night guard and torch sting; the 12-frame dissolve between locations; the eye-level 40° camera presets.

**Kept:** safe zones; one idea per frame; statement and attribution rules; writing, sourcing, sound, export, length; determinism; theme tokens only; no pure white/black surfaces; rounded edges and blob shadows; selective bloom, grain, shallow focus; scene length, cut spacing, easing; motion principles; no realistic faces; new locations every video.

**The proposal file** is marked "ACCEPTED, merged into v0.8"; v0.8 wins where they differ.

**Outside `brand/` (not changed here, reported):** files that still describe the Plaster Museum are listed in the brand-director's v0.8 report to the main session.

## v0.7 · 2026-10-15 · Length becomes a soft rule (owner decision)

Relayed by the main session as an approved owner decision. No `feedback.md` entry (nothing published yet).

- **The hard "never over 59 s" cap is removed; Open decision 3 (Length) is settled** (row removed; number not reused). New rule, ✅ owner decision: length follows the idea, most Shorts land around **30 to 60 s** (was "about 25 to 45 s"); **over 60 s is allowed when the story needs it, provided the video has no licensed (Content ID-claimable) music**; music we make ourselves is fine. Revisit when TikTok Creator Rewards (≥ 1 min, P§3, S19) is within reach. Why: YouTube blocks Shorts over 1 min with any active Content ID claim (P§3, S8), and our videos carry no third-party music.
- Files: brand.md (§ Open decisions, § Audience "in under a minute" → "in about a minute", § Structure); style-guide.md (§ 9 Licensing: adds "music we make ourselves", with the condition that the tool's terms grant commercial multi-platform rights and nothing is registered in Content ID, per P§5; § 10 Length); `research/script-references.md` R§3 note.
- **Not part of v0.7:** the visual-identity proposal `brand/proposals/visual-identity-v1.md` is a draft awaiting approval and changes nothing yet.
- **Outside `brand/`:** `CLAUDE.md`, `.claude/agents/scriptwriter.md`, `voice.md`, `researcher.md` and `.claude/skills/new-video/SKILL.md` already state 30–60 s with the over-60 condition. `README.md` line 38 still says "150–170 words is about 60 seconds" (an old word-count target, not the cap).

## v0.6 · 2026-10-15 · One idea per frame, statement cards, on-screen attribution (owner decisions from a reference video)

The owner shared a reference video (kinetic typography on black, @black.box.facts3 on TikTok, why metal "smells"). It reads clearer than our pilot because every frame carries one idea, key phrases are set large as statements, and sources are named quietly on screen ("a hypothesis from the researchers"). The owner keeps the Plaster Museum and borrows three things, all ✅ owner decision; the values that implement them are 🧪. No `feedback.md` entry (the pilot is not published). Nothing is built yet.

**1. One idea per frame** (brand.md § Structure, § What we never do; style-guide § 7, § 6, checklist 9)
- At most one card at a time (callout, search bar, ad card, counter, statement card) besides the exhibit label and captions; the next enters only after the previous has left. Empty space: the subject spans ≤ 60% of the focal band's width, nothing readable within 48 px of it except its own callout (🧪).
- **The `ILLUSTRATIVE` watermark comes off the picture.** 🎭 specifics are now disclosed by a description line "Illustrative: [what is invented]." right after the hook line, plus the AI label already on all three platforms. Watermark removed from style-guide § 1 (`inkLabel`), § 4 (never-orange list), § 5 (fonts, its type row, was ✅ studio rule), § 6 (its position row), and brand.md § Sourcing policy; § 10 Description row gains the illustrative line. Note: no platform label says "illustrative" (P§6), so the description line is the real disclosure.

**2. Statement cards** (style-guide § 5, § 6, § 7; brand.md § Structure)
- Large Fraunces 600, 96 px / 1.05, `ink` with `textHalo`, no box, sentence case with a full stop ("One household."), ≤ 4 words, ≤ 2 lines, ≤ 16 characters a line. Positions: low (bottom edge y 1000, default) or high (top edge y 500), x 192 to 888. At most 2 per video, ≥ 6 s apart, not in the first 3 s. Hold from the first word to 0.8 s after the last (or the next word), 1.2 to 3.0 s; fade in 12 frames with a 6 px rise, fade out 12 frames, cubic in-out, no pop. Optional engraved-on-the-wall variant for wide shots.
- **Captions suppressed while the card is up** (chosen over running both): the card already shows the exact spoken words to muted viewers (L§2), and the same words twice is two things saying one idea. Consequence: a statement phrase needs a beat after it in `performance.txt`.

**3. On-screen attribution line** (brand.md § Sourcing policy, Open decisions, § Promise, § Structure step 6, § What we never do; style-guide § 1, § 5, § 6, § 7, checklist 10)
- **Reverses v0.1 to v0.5 "sources never on screen"; Open decision 5 is settled** (row removed; number not reused). Full sources stay in the post description.
- JetBrains Mono 500, 20 px, letter-spacing 0.14em, uppercase, `inkMuted`. Under a statement card (24 px below it) or alone with its bottom edge at y 1024, above the caption band. At most 2 per video; ✅ claims, or 🟡 spoken with that attribution; never 🎭. Wording: who + year ("FTC staff report, 2017"), matching `sources.md`, no URL, no title, no "Source:", ≤ 36 characters. Fade 10 frames, no movement; alone it holds for its claim's sentence, ≥ 2 s.

**4. Motion principles, 🧪 pending build** (style-guide § 8). Owner feedback: "everything feels static except the camera; the mannequins barely move". Something is always alive (figure breathing and weight shifts, gestures on cue, dust in the light beam; orange ambient life such as the LED pulse only once the system is active); motion calm and slow; the orange stays the only fast-moving thing. Values follow once the owner approves the motion plan.

**Outside `brand/` (not changed here, reported):** `CLAUDE.md` § Sources ("marked illustrative (🎭, with the watermark on)", "Sources go in the post description, not on screen") and § Style ("The 'ILLUSTRATIVE' watermark stays on videos that use invented specifics"); `docs/sources-format.md` ("not on screen", 🎭 watermark); the watermark in the code and in `phone-listening/spec.ts`.

## v0.5 · 2026-10-15 · New writing recipe and narrator delivery (owner feedback on the pilot script)

The owner rejected the pilot script's style: "sounds too AI ... adding detail just to make it longer ... I find this style annoying when watching a video", shared two reference scripts, approved the 7-step recipe ("go"), and asked for an American narrator. No `feedback.md` entry (the pilot is not published); the material is in the new `research/script-references.md` (R§). The look is unchanged.

**1. New research file** `research/script-references.md`: the owner's two reference transcripts (excerpts), the analysis, the recipe (R§3), the banned AI patterns (R§4) and the pilot redrafted in the new style (R§5, not fact-checked). Source: YouTube transcripts shared by the owner, 2026-10-15.

**2. brand.md § Voice and tone rewritten.**
- ✅ owner feedback: **no padding** (every sentence adds new information; padding test), **no AI patterns** (banned list 1 to 6: fragment chains, lists of three for rhythm, fake reveals, filler, a hedge in every sentence, every sentence 4 to 6 words).
- 🧪: sentences mostly 10 to 20 words, short ones only to land a point (replaces "most under 10 words, fragments allowed"); one concrete story; talk to the viewer for their experience, narrate like a reporter for a story; point at what's on screen; answer straight; fairness; banned list 7 to 9 (signposts, slogan endings, loose comparisons).
- **Attribute, don't hedge** replaces "Hedge when the source hedges": say who claims it; hedge only where the source hedges. A 🟡 claim can be spoken with its attribution, not only with "can/often". Sourcing policy and § What we never do updated to match.
- **Numbers:** "one number per video at most, rounded" → any number that tells the story, each ✅ sourced. Same change in style-guide § 5 Counter.
- New "sounds AI vs sounds human" pairs (pilot vs R§5); the 5 on-brand and 5 off-brand lines replaced. Reference text is now R§5, not the pilot's `script.txt`.
- § Promise "calibrated honesty ('probably not')" and the § Naming platform-title example ("Your phone isn't listening. Probably not.") reworded: both used the hedge-and-fake-reveal pattern.

**3. brand.md § Hook patterns.** Hook = recipe steps 1 to 3 (moment, surprising fact, question by ≈ 6 s). Patterns now: the lived moment, the dated event, the role, the finding, the wrong recipient. Dropped: "the gentle denial" ("…Probably not." is a fake reveal plus hedge) and "the exhibit card" (a fragment chain). Numbering 1 to 5 kept for `feedback.md`. All 🧪.

**4. brand.md § Structure of a video.** The 5-part table with seconds and per-part word counts (8 to 14 / 20 to 30 / 40 to 55 / 45 to 55 / 12 to 20) and the 140-to-160-word target are removed. Now the 7 recipe steps, each mapped to what the exhibit does (plaster, orange reveal, stains, torch off). **No word-count target; Shorts ≈ 25 to 45 s**, ≤ 59 s kept (Open decision 3). Long-form later: 2 or 3 questions. Loop kept only where it reads naturally. All 🧪.

**5. style-guide.md § 9 Sound.** Voice row split into: **Narrator: American English** (✅ owner feedback); model `eleven_v4` by default, stability 0.4 to 0.5 starting point (🧪); pacing from punctuation and ellipses (v4 has no `speed`); audio tags only where a human narrator would pause or react, at most ≈ 1 per 3 sentences, never comic tags (`[laughs]`, `[sarcastic]`); tags only in the performance text, never in captions; always audition 2 to 3 takes and pick by ear (all 🧪 except American).

**Outside `brand/` (not changed here, reported):** `CLAUDE.md` § Style ("150–170 words ≈ 60 s", "Short, spoken sentences"), `.claude/agents/scriptwriter.md` and `.claude/skills/new-video/SKILL.md` (150–170 words, hedge 🟡 with "can/often"), `.claude/agents/researcher.md` ("about 160 words") and `docs/sources-format.md` (🟡 "Only with hedged wording") still state the old rules.

## v0.4 · 2026-10-15 · Reconciled with the Exhibit No. 001 build (scene-builder review round 2)

Every value below was read in code (`theme.ts`, `MuseumPost.tsx`, `MuseumStage.tsx`, `LivingRoom.tsx`, `PhoneScene.tsx`, `RoomScene.tsx`, `ProfilesScene.tsx`, `Mannequin.tsx`, `Chip.tsx`, `AdCard.tsx`, `Explainer.tsx`, `phone-listening/spec.ts`). The look is unchanged; nothing new moves to ✅.

**1. Whites rule made measurable** (style-guide § 2, checklist 1; brand.md § What we never do)
- v0.3's "brightest plaster 85 to 90% (RGB 217 to 230), nothing clipped" named no method. Measured with numpy on the approved build (scene-builder): p95 ≈ 88%, but the brightest near-neutral plaster is 242 to 244 (94.9 to 95.7%), and no pixel is 255. The old number was a p95, not a maximum, so the approved stills broke the rule as written.
- New rule, on a full-scale still with cards, captions and glow masked, Rec. 709 luma: **p95 ≤ 90%, brightest near-neutral pixel (max − min channel ≤ 30) ≤ 96%, zero pixels at 255,255,255**. The look stays ✅ owner feedback; the thresholds are 🧪 (set on one build).
- Checked in `MuseumPost`: the shoulder is linear (keeps 45% above 0.82 after × 0.86), not an asymptote, so it does not stop clipping. Lit 1.0 → 0.838; the approved 95.7% needs ≈ 1.31 in; 255 needs ≈ 1.42 (≈ 8% headroom). v0.3's "pure white lands at ≈ 0.90" was wrong and is removed.

**2. Tokens** (§ 1, § 2, § 3): `plasterGlass #fcf7ee` (screen glass, roughness 0.7, lit +9.3% over body plaster; the screen is no longer `plasterShade`); `lightSky`, `lightGround`, `lightKey`, `lightFill`, `lightRim` (closes the v0.2 "guide wins" item). Every colour in the guide now names a token. `plasterFloor` also used for the phone lens; `plasterShade` for earpiece, home bar, lens ring, keyboard well.

**3. Phone exhibit** (§ 3, § 4, § 8): phone detail (lens ring, earpiece without shadow, side button, home bar); camera presets `front` → `close` → `screen`, each starting where the previous ends; route core **0.012** at phone distance (0.02 is for the room at ≈ 6 units: scale with distance); new § 4 row **Screen recording**: edge trace 1.2 s, scan band every 1.5 s, outbound route 0.8 s with no stain, edge glow holds 1 s then fades to a stain frame (radius 0.007) that `screenStain` carries into later shots.

**4. Living room** (§ 3, § 4, § 6, § 7, § 8): plaster laptop on the table (lid open, screen to camera, bleed 0.3); `devicesAt` (flicker ≈ 0.5 s, ramp 0.3 s, hold); `householdAt` (router bleed ×1.35, wash 0.40 → 0.50, LED grows; only brightens); camera `devices`. Plate 0.40 × 0.22 at two `ROOM.plateSpots` (−0.87, 1.95) and (−0.68, 2.3), auto-picked per shot to stay inside x 120 to 888 and off the label. Plate only on wide shots (No. 001: 4a, 9b), 🧪.

**5. Overlays and figures** (§ 1, § 3, § 5, § 7): ad-card icon is an outlined plaster mug (SVG, `plaster` fill, `inkMuted` stroke) on the `plasterShade` square; `Chip` `delay` (scene 1 uses 1.0 s, so "no label text in the first second" is now built; closes the v0.2 item); `Chip` skips its entry when the label equals the previous scene's; `Bust` rebuilt from Mannequin parts, pedestal 0.8 → 0.7.

**6. Crossfade reconciled** (§ 8): `FADE` 12 and `Easing.inOut(Easing.cubic)` now in code; closes the v0.2 item. Known limit recorded in § 7: the outgoing scene stays opaque under the dissolve, so two different labels draw over each other for 12 frames. Rule for the director, 🧪: prefer identical label text across a crossfade (checklist 8).

**7. Label sub-line** (brand.md § Naming; style-guide § 5): the sub-line names a place, time or category and **stays the same across consecutive scenes of the same type**, changing only where the type changes (No. 001: 1 to 3 `A PHONE`, 4a to 5b `EVENING`, 6a to 7 `ONE HOME`, 8 `SCALE`, 9a `A PHONE`, 9b `EVENING`), as the director aligned it. New row: the first scene's label enters at ≈ 1 s. Both 🧪. Example sub-line in the guide changed from "2 A.M." to "EVENING".

## v0.3 · 2026-10-15 · Three owner decisions: name, brightness, pilot number

All three came from the owner directly (no `feedback.md` entry yet; the pilot is not published).

**1. Name: Secretly Works, `@secretlyworks`** (brand.md title, § Promise, § Name, Open decisions; style-guide.md title)
- "WORKING TITLE" replaced by "Secretly Works" everywhere in `brand/` except the v0.1 history below, which describes the placeholder as it was.
- § Name candidates replaced by a short § Name: the chosen name, handles per platform with status. The Instagram account (`@secretlyworks`, "Secretly Works | Tech in 3D") and both YouTube channels (`@secretlyworks`, `@howitsecretlyworks`) are the owner's own, so the "possibly the owner's placeholder" rows in `research/landscape.md` §6 are confirmed. **One open item: the TikTok handle still needs an in-app check** (it could not be verified from outside, L§6).
- Proposed Instagram bio, 🧪 until approved: "How everyday things secretly work. One 3D exhibit at a time, sources in every post." (83 characters; the current "Everyday tech, opened up in 3D" narrows the topic to tech).
- Open decisions: row 1 removed; rows keep their numbers so "Open decision 3 / 5" references in both documents still resolve.

**2. Brightness as built is approved** (style-guide.md § 2; brand.md § What we never do)
- Owner looked at the current renders (walls ≈ 70 to 80%, plaster highlights ≈ 88 to 90%, nothing clipped) and said it is right. Skylight 0.42, exposure 0.86, shoulder 0.82, vignette 0.34 and the 85 to 90% ceiling move from 🧪 to **✅ owner feedback**, as one rule "Brightness, as built", plus the vignette and skylight rows. **Don't raise brightness in future.** Every other rule stays 🧪.

**3. Pilot approved as Exhibit No. 001** (brand.md § Naming of exhibits)
- `phone-listening` is No. 001; numbering starts there in publication order. "No. 014" stays in the examples as a mock-up value. The pilot's `spec.ts` (chip and plate) still says No. 014; that is the director's change, listed in the report.

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
