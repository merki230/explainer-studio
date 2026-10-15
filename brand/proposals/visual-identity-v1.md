# Proposal: visual identity v1 ("The Section")

> **Status: ACCEPTED, merged into v0.8 (2026-10-15).** The owner approved frame A (The Section) and every summary line below with its recommendation, plus one addition: **phones face their owners, never the camera**. The rules now live in `brand/brand.md` and `brand/style-guide.md` v0.8; where this file and v0.8 differ, **v0.8 wins** (values were reconciled with the mock-up the owner saw, `section-frame.html`; see `CHANGELOG.md` v0.8). This file is kept as the record of the reasoning; don't edit it further.

Draft for owner approval, 2026-10-15 (rev. 2), brand-director. (Historical: at the time of writing, v0.7 and the Plaster Museum look were in force.) Every value is 🧪 unless marked. Citations: `research/landscape.md` (L§), `research/platforms.md` (P§). Mock-up values come from the owner's comparison page `story-styles.html` (three.js r149 units, before the R3F `× π` light convention).

**Owner decisions taken as given (✅).** The Plaster Museum is replaced. Kept from the reference (@wealthy_path, "why iMessage bubbles are blue or green"): realistic and pleasant, coloured characters with identities, real-looking (generic) phone screens, several locations, the system as a journey, Night and Day moods per scene, orange = the secret system. Kept from us: writing recipe, sourcing, attribution lines, statement cards, one idea per frame, safe zones, motion work. **New in rev. 2:** owner feedback on the mock-ups, "I think we should change the frame also, I feel like it's a copy of that video". So the **frame** (camera, composition, captions, tags, transitions) must be ours. That is now the core of this proposal (§ 1). Soft length rule (v0.7, ✅) is unchanged.

## 0. One-page summary (approve, change or reject each line)

| # | Line | Recommendation | Owner |
|---|---|---|---|
| 1 | **Signature frame:** pick one of three (§ 1): **A. The Section** (every location a cut-open slice seen from outside), B. The Map (isometric, orthographic), C. X-ray (interior shots whose walls turn see-through) | **A, with C as its reveal technique once per video** | |
| 2 | **Camera:** always outside the cut, one fixed 3/4 angle per video, long lens, moves only by sliding (truck, crane) and slow push; never enters a room (§ 1.2) | **Approve** | |
| 3 | **Transitions:** "follow the line": the camera rides the orange path to the next slice; locations stack and slide like a building section (§ 1.3). Replaces the dissolve between locations | **Approve** | |
| 4 | **Phone screens via a detail inset:** a square-cornered magnified crop of the screen, joined to the phone by an elbow leader (§ 1.4) | **Approve** | |
| 5 | **Captions: the margin note.** Left-aligned, square-cornered block in the mood's colour with a 6 px rule on its left; words appear as spoken; no highlight, no underline (§ 2.1) | **Approve** | |
| 6 | **Name tags: drawing labels.** No pill: an elbow leader to a colour square and the name, set in the margin outside the cut (§ 2.2) | **Approve** | |
| 7 | **The cut is plaster:** every cut face (walls, floors, ground) is the same warm off-white `#efe9df` in both moods | **Approve** (it is what makes a still ours) | |
| 8 | **The orange rule:** the system is always `#ff5b14`, never blue or green; nothing else may sit in the reserved orange band (§ 3) | **Approve** | |
| 9 | **Cast:** YOU, FRIEND, MOM, plus grey untagged extras; dot eyes that blink; our rounded rig, adult proportions (§ 2.4) | **Approve** | |
| 10 | **Type:** Inter (UI, captions, tags, phone screens), Archivo 800 (statements, title), JetBrains Mono (attribution, number). Fraunces retired | **Approve** | |
| 11 | **Moods:** Day is the default, Night when the story's moment is at night; the sky strip at the top of the slice shows which (§ 4) | **Approve** | |
| 12 | **Title block:** "No. 001 · Title", first scene only, styled as a drawing's title block | **Approve** | |
| 13 | **Stains → trace:** what the system touched keeps an orange mark for the rest of that slice; no wall stain or wash | **Trace** (it was your rule, so your call) | |
| 14 | Retire the night guard (Open decision 2 → no mascot) and the glass lens as a standalone technique (Open decision 7; the X-ray in line 1 takes its place) | **Retire** | |
| 15 | Before publishing: a research note on the reference channel, plus a side-by-side still check against it (§ 6) | **Approve** | |

## 1. The frame: three signature options

The reference's frame, as seen in the mock-ups: an **interior, eye-level perspective camera** inside one room, characters on a couch, **white rounded name pills** with straight leaders, a **dark rounded caption pill** with the current word underlined, locations joined by cuts. Each option below replaces that frame, not just its colours.

### Option A: The Section (recommended)

Every location is a **slice cut through the world and seen from outside**: the near wall is cut away and the cut faces are visible, so the viewer always looks *into* a place, never stands in it. Seeing inside is the brand, and it is literally the channel's promise (how things *secretly* work). The tall 9:16 frame fits a vertical slice: sky strip on top, the room, the cut floor slab, and below it the ground with the cables, pipes and ducts the system travels through. It takes L§5 directions B (cutaway diorama) and C (vertical cross-section; "no one owns the vertical cross-section. It works natively at 9:16", L§5).

**What a frame looks like.** Hook, Night: a dark band of night sky at the top (y 0 to 300), then the living room cut open at a 3/4 angle, its cut walls and floor slab drawn as thick off-white bands (≈ 16 to 24 px on screen), lamplight inside, FRIEND and YOU on the couch, small in the middle of the frame (a figure ≈ 22% of frame height). Below the slab, the cut ground in a darker plaster, a conduit running to the street. Tags sit in the margin outside the cut. Reveal: the orange leaves FRIEND's phone, crosses the room to the router, drops through the cut slab into the conduit, and the camera cranes down with it to the next slice (the street cabinet), stacked below.

| Rule | Value |
|---|---|
| Slice | One location per slice block, ≈ 4.0 units wide, 3.0 deep. Near wall and ceiling removed; cut faces flat `cut` `#efe9df`, roughness 0.95; walls 0.2 thick, floor slab 0.25, ground below in `cutGround` `#cfc6b8` with services (conduits, cables, pipes) drawn in neutral greys until the system uses them |
| Fill | The block spans x 120 to 960 (≈ 78% of width); the room's interior sits in the focal band y 420 to 1040; ground and services may run under the caption band (set, not content) |
| Outside the block | Mood background (§ 4), no floor plane, no horizon: the slice floats like a section drawing |
| Exterior locations (car, street, data centre) | Same grammar: the car is cut along its length, the data centre cut through a rack row; a street is cut through the road to show what lies under it |

**Pros.** No other channel found owns it (L§5); nothing in it resembles the reference's frame; the journey out of the room becomes a camera move, not a cut; the plaster cut face carries the museum's colour forward. **Cons.** Faces are small, so emotion comes from gestures and the push-in; dioramas can read as dollhouse or toy (L§5 B: "can read as kids' content"); a repeated slice template is a "template" risk (L§5 C, P§4). Cost: medium; a block is cheaper to dress than a full room, but each video needs new slices.

### Option B: The Map

An **orthographic, isometric camera** (no perspective) looking down at 30° on the whole house, street or city at once. The world is still realistic and full colour, but it reads like a map, and the orange system reads as a diagram drawn over it: clean lines with node dots at each device. **A frame:** the whole apartment block as one tile on a flat mood-coloured ground, characters ≈ 6% of frame height, the orange path a crisp line hopping from window to cabinet to tower. **Pros:** maximum clarity for systems; distinct from any interior camera; cheap camera work. **Cons:** characters are too small to carry a story or read a face; real phone screens are unreadable without insets on every shot; the isometric low-poly look is very common (games, "isometric room" renders) and is the most toy-like of the three; the owner liked the pleasant, realistic feel, which orthographic flattens.

### Option C: X-ray

Shots stay inside and in perspective; at the reveal, walls, furniture and devices turn **see-through** (glassy, 15% opacity, a pale `#c9d3e6` fresnel edge), showing the orange flowing inside them. **A frame:** the couch scene at eye level; on "the router", the wall dissolves to glass and the orange runs through the wiring behind it. **Pros:** a strong signature moment, a direct heir of the lens. **Cons:** every frame *before* the reveal is the reference's frame, which is exactly what the owner objected to; it is a technique, not a frame.

**Recommendation: A, with C inside it.** The Section is the frame; the X-ray is its reveal technique, used at most once per video, on objects (a wall cavity, a phone's body) inside the slice. B is rejected as the frame; its diagram line survives in how the orange path is drawn (nodes at devices).

### 1.2 Camera (Option A)

| Rule | Value | Why |
|---|---|---|
| Angle | One fixed 3/4 view per video: yaw **32°** off the cut plane's normal, pitch **−18°** (looking slightly down). Never rotates within a video | A constant angle is recognisable; the reference cuts between free angles |
| Lens | fov **24°** (long lens: flattens toward a drawing, keeps realism) | Between B's orthographic and the reference's wide interior |
| Moves | Truck (sideways), crane (up and down) and slow push, sine in-out, one per scene. The push stops when a figure fills **40%** of frame height | The camera never enters the slice: "outside looking in" is the rule |
| Never | Eye-level interior shots, over-the-shoulder shots, handheld | Those are the reference's frame |

### 1.3 Transitions

| Case | Transition |
|---|---|
| Same slice, next idea | Camera keeps moving (one continuous move across scenes); no dissolve |
| Next location, linked by the system | **Follow the line:** the camera cranes or trucks along the orange path to the next slice, stacked below, above or beside the current one, 18 to 30 frames, sine in-out. The path is visible crossing the seam |
| Next location, not linked (a new day, a new person) | **Section slide:** the next slice slides in from below as the current one leaves at the top, 18 frames, cubic in-out, like scrolling a drawing |
| Night → Day in the same slice | The sky strip and the light shift over 1.5 s; at most once per video |

Cuts stay ≥ 1.5 s apart (carries over). The 12-frame dissolve is retired as the location transition.

### 1.4 Phone screens: the detail inset

A phone is small in a slice, so readable screens come in a **detail inset**, the way a technical drawing magnifies a detail. A square-cornered frame (2 px border in the mood's text colour, no shadow, no rounded corners) holding a **flat, crisp crop of the screen part that matters** (the search field, the ad), ≤ 696 × 620 px, inside the focal band; a 2 px elbow leader joins it to the phone in the slice. In over 10 frames (opacity, 8 px rise). It counts as the frame's one card; captions continue. Full-frame screen shots are allowed at most twice per video, when the screen is the whole idea. Phone-kit rules: § 2.5.

## 2. What stays constant across every video

### 2.1 Captions: the margin note

| Property | Value |
|---|---|
| Block | Square corners. Night: `rgba(14,20,36,0.72)` (night background); Day: `rgba(244,241,234,0.85)`. Padding 14 / 22 px. A **6 px rule on the left edge** in the text colour |
| Type | Inter 700, **52 px / 1.2**, Night `#f7f6f2`, Day `#17181b`; **left-aligned** |
| Words | Appear one by one as spoken (each fades in over 4 frames); no highlight colour, no underline, no dimmed preview |
| Page | ≤ 5 words, ≤ 2 lines; left edge at **x 192**, bottom edge at **y 1188** (2 lines grow upward to ≈ 1045). Off while a statement card is up (carries over) |

**How it differs from the reference:** theirs is centred, rounded, dark in every scene, showing the whole phrase with the current word underlined. Ours is left-aligned like a note in a drawing's margin, square, changes colour with the mood, and writes itself word by word.

### 2.2 Name tags: drawing labels

| Property | Value |
|---|---|
| Leader | 2 px line in the mood's text colour from a 6 px dot on top of the head: **up 48 px, then horizontal** (one right angle) to the margin outside the slice |
| Label | A **14 px square** in the character's top colour, 10 px gap, the role in Inter 700, **26 px**, uppercase, letter-spacing 0.08em, mood text colour; no fill, no pill; a soft shadow for contrast (`0 1px 8px` in the mood background at 60%) |
| Text | YOU, FRIEND, MOM (≤ 12 characters) |
| When | First appearance, and on re-entering in a new slice. Hold ≥ 1.5 s, fade 10 frames. ≤ 2 at once; never with a card or a statement |
| Same style for object callouts | The router, the cabinet: same elbow leader, no colour square |

**How it differs:** theirs is a white rounded pill on a straight leader beside the head. Ours has no box, uses an architectural elbow leader, keys each person by colour, and sits outside the room.

### 2.3 The orange path

Drawn like a diagram over a real world (from Option B): a clean tube plus **node dots** (r 2.5 × core) where it touches a device. Reveal states and timings carry over from style-guide § 4 (glow → bleed → trace; route 1.7 to 3 s; screen tell 1.5 s before). Night: core `#ffb27a`, halo `#ff5b14` 20 to 25%. Day: core `#ff5b14` (the pale core vanishes on light walls), halo 30%.

### 2.4 The cast

Adult proportions (head r 0.165 on the `Mannequin` body), our rounded rig, matte (clothes and hair roughness 0.85 to 0.95, skin 0.75).

| Tag | Top | Bottom | Skin | Hair | One detail |
|---|---|---|---|---|---|
| YOU | Cobalt hoodie `#3f63c9` | `#2a2d3a` | `#c58c63` | Short crop `#2a1d14` | The hood |
| FRIEND | Green sweater `#2f9e6a` | `#4a4038` | `#a8734f` | Bun `#1a120c` | The bun |
| MOM | Plum cardigan `#7d4e8f` | `#3b3a40` | `#f1c9a5` | Grey bob `#8c8a86` | Round glasses, `#2a2b30` frames |
| extras | Slate `#8a909c` | `#5b606b` | any in range | Short `#3a3532` | Never tagged |

- **Faces:** two matte dots `#1d1d1f`, r 0.018, at ±0.055; no mouth, no brows. Blink: eye scale y → 0.1 and back over 4 frames, every 3 to 5 s, seeded per character. Why: viewers can see where a character looks; still non-uncanny (L§4).
- **Skin range:** `#f1c9a5`, `#d9a77f`, `#c58c63`, `#a8734f`, `#6e4630` (all below 60% saturation, outside the reserved band).
- Cool and mid hues on purpose: World 1's YOU in red `#c9473a` read orange under the lamp.

### 2.5 Phone-screen kit

| Rule | Value |
|---|---|
| Generic (✅ owner) | Invented one-word app names ("Shop", "Feed"), invented products; no real logo, icon, brand colour or trade dress (no iOS blue `#0b84ff`, no green bubbles, no Dynamic Island); clock never "9:41" |
| Mode follows mood | Night: dark UI (`#121318`, text `#e9ecf2`); Day: light UI (`#fafafa`, text `#15171a`). The screen lights the face in front of it (`#dbe6ff`, 0.6, reach 0.9) |
| Accents | Neutral: buttons `#15171a` / `#3a3f4b`; bubbles `#3a3f4b` sent, `#e6e7ea` received; never in the reserved band |
| The system's mark | Where the system shows on a screen (the targeted ad), a 5 px `#ff5b14` edge |
| Readable | ≥ 28 px in the 1080 frame, inside the safe rectangle; one readable thing per screen |

### 2.6 Type, statement card, attribution line, title block

- **Faces:** Inter 500 to 800 (captions, tags, phone UI, callouts), **Archivo 800** (statement cards, title), JetBrains Mono 500 (attribution line, the number). All OFL.
- **Statement card:** every v0.6 rule carries over (≤ 2 per video, ≥ 6 s apart, not in the first 3 s, hold 1.2 to 3.0 s, fade 12 frames with 6 px rise, captions off). Look: Archivo 800, **88 px / 1.0**, −0.02em, ≤ 2 lines, ≤ 14 characters a line (check on stills), **left-aligned at x 192** like the captions; Night `#f7f6f2` with shadow `0 6px 32px rgba(0,0,0,0.45)`, Day `#17181b` with halo `0 0 28px rgba(247,246,242,0.75)`.
- **Attribution line:** v0.6 rules carry over; Mono 500, 20 px, 0.14em, uppercase, left-aligned under the statement; Night `#c9ccd4`, Day `#5d6068`.
- **Title block:** first scene only, enters ≈ 1 s, holds ≈ 2.5 s, top edge y 340, left at x 192: "NO. 001" in Mono 500 20 px over the title in Archivo 800 30 px, a 2 px rule between them, no card. Title = the everyday thing, 1 to 3 words. Why keep the number: a browsable series at no cost, which the reference doesn't have.
- **Loop:** last 0.5 s, the phone in the slice locks (screen to `#0b0c0f` in 2 frames, one dry CC0 click), 4-frame hold, cut to frame 1; otherwise the camera returns to the opening framing.

## 3. The orange rule

| Rule | Value | Why |
|---|---|---|
| The system is `#ff5b14` | Paths, nodes, dots, the light they cast, LEDs and screens while active, its mark on a screen. Both moods | One hue, one meaning; the reference colours each idea differently |
| **Reserved band** | Nothing but the system may have HSL hue **8 to 40°**, saturation **≥ 60%**, lightness **35 to 75%**: no surface, clothing, UI or practical light. Wood, skin, beige pass | Makes "everything else any colour" checkable; `#ff5b14` = 18°, 100%, 54% |
| Never orange | People, captions, tags, cards, statements, attribution, title block, cut faces, background | Carries over |
| Only the system glows and moves fast | Bloom only on `userData.glow`; lamps and screens never bloom | Carries over |
| **Trace** | After the reveal, what the system touched keeps a mark for the rest of that slice: LED stays on, a 2 px orange screen edge, a lit node dot. No wall stain line, no wash | Replaces "stains stay"; a painted line on a coloured wall reads as dirt |

## 4. The two moods

Same slice, cast, orange and cut colour; only light, palette and the sky strip change.

| Token | **Night** | **Day** |
|---|---|---|
| Background, sky strip | `#0e1424` (never darker), stars sparse | `#dfeaf5`, sky `#8ec5ff` → `#d9ecff` |
| Interior walls / floor | `#1c2438` / `#161c2c` | `#f4f1ea` / `#c9b39a` |
| Soft furnishings | Blue-violets: `#2f3b5c`, `#3a4870` | Sage: `#7d9a8c`, `#8fae9f` (World 3's mustard `#e0a33a` is in the reserved band) |
| Wood / trim / devices | `#5a4636` / `#2a3348` / `#1b1d22` | `#8a6a4e` / `#f7f6f2` / `#2a2c31` |
| Cut faces / ground | `#efe9df` / `#cfc6b8`, lit by a soft front light so they read in the dark | same |
| Hemisphere | `#8aa0d8` / `#141a2a`, 0.55 | `#ffffff` / `#a8b4c8`, 0.85 |
| Key / fill / rim | `#ffc58a` 1.0 / `#6f86c9` 0.35 / `#9fb3e8` 0.4 | `#fff6ea` 0.9 / `#cfe0ff` 0.3 / `#ffffff` 0.2 |
| Practicals | Lamp `#ffd6a0`, 1.4, reach 4 (not the mock-up's `#ffb36b`: too close to orange) | none |
| Vignette | `rgba(0,0,0,0.45)` | `rgba(30,40,60,0.18)` |
| Check | Subject p50 luma ≥ 30%; rim separates figures | Zero pixels at 255,255,255 outside screens and glow; brightest near-neutral ≤ 96% (v0.6 checks kept) |

**When.** The story decides: the moment is at night → Night; daytime, "the next morning", scale and infrastructure by day → Day. **Default Day.** The system's path takes the mood of the slice it is in. Example (No. 001): living room slice (Night) → follow the line down to the street cabinet and the data centre (Night) → section slide to "the next morning" (Day) → YOU's phone, detail inset showing the ad with its orange edge.

## 5. What the Plaster Museum leaves behind

**Carries over:** safe zones and positions (✅ platform rule); one idea per frame (✅); statement and attribution rules (✅ owner; values 🧪); writing, sourcing, sound, export, soft length rule (v0.7 ✅); determinism and the single `useFrame` exception (✅ studio rule); theme tokens only (✅); no pure `#ffffff` / `#000000` surfaces; rounded edges, bevels, blob shadows; selective bloom; grain; shallow focus (suits the slice); scene length 3 to 6 s; easing (no bounce); motion principles (blinks, glances, gestures on cue; screen flicker on faces at night; leaves past the window by day); reveal timings; first frame is the story; no realistic humans; new locations every video (P§4).
**The museum's colour lives on** as the cut face (`#efe9df` is a step from `plaster` `#e8e3da`).

**Retired:** plaster-on-everything and "one material"; museum, plate and label-card tokens; `MuseumSet`; wall plate; "no screens with UI"; faceless figures; "one accent, nothing else coloured" (→ reserved band); museum brightness values (checks kept); wall stain and wash (→ trace); Fraunces, orange-italic caption word, paper cards; exhibit sub-line and per-scene label; night guard and torch sting; glass lens (→ X-ray, once per video); interior eye-level camera; 12-frame dissolve between locations.

On approval, `brand.md` changes in § Promise (one sentence, difference 3), § Structure (the "what the exhibit does" column), § Mascot, § Naming and § What we never do.

## 6. Risks, candidly

1. **Still close to the reference in content.** Coloured characters, phones and several locations remain; the frame, captions, tags and transitions are now ours. A still from A shouldn't be mistaken for theirs: outside-looking-in, plaster cut faces, left-aligned notes, elbow labels. A *story* could still feel similar (same topic family). Check: before publishing, put one still of ours next to one of theirs and ask someone who hasn't seen either which is which.
2. **We have no research on the reference channel**; a web search for the account found nothing. A short `research/landscape.md` addendum is needed (size, cadence, recurring cast, sourcing).
3. **Dollhouse / kids risk** (L§5 B). Guards: adult proportions, muted palettes, long lens, calm voice, real-looking screens.
4. **Night is close to the rejected navy look** (L§1, L§5 A). Guards: Day default; Night slices are lit rooms with plaster cut faces, never arcs on a void.
5. **Template risk** (L§5 C, P§4): same angle and same block every video. Guard: new slices each video, varied shapes (car, street, rack), never the same room twice unchanged.
6. **Small faces.** Emotion moves to gestures, glances and the push-in; the detail inset carries the screen. Test on the first video.
7. **Cost.** A slice kit, cut-face shading (clipping planes), the camera grammar, the inset and the cast before the first video. Build order: one slice in both moods + cast + inset, then judge stills before the rest. Cadence (Open decision 6) is at risk until the kit exists.
8. **The orange is less special in Day.** The reserved band and "only the system glows" protect it; checked on every still.
