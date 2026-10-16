# Secretly Works: style guide (The Section)

v0.10.1, 2026-10-16. Owner: brand-director. Frame: **1080 × 1920, 30 fps**. v0.10.1 (owner decisions): on wake-bookend openings the title block enters at ≈ 2.8 s (§ 6, § 8, checklist 5 and 12); screen placement on full-frame bookend screens settled, not applying to the § 6 full-frame screen box (§ 6, § 8); no "Full sources: link in profile" line until a profile link exists (§ 10). Pilot fix pass values (🧪): soft PCF shadows with new biases (§ 2, § 4), X-ray opens over a fixed 0.45 s with a 0.055 hatched band (§ 5). v0.10 records the owner's decisions from the realism test (stills in `out/review/realism-test/`, built in `src/three/real/`): **objects realistic, people stylized**, glints allowed, generic devices, CC0-first assets, no orange on non-system parts (§ 1, § 2, § 3, § 10, checklist 2 to 4 and 15); values not built yet are 🧪. v0.9.1 records the owner's Studio review of the pilot's rough cut (`feedback.md`, No. 001 rough cut): the motion rule, camera glides, single-render time passes, object cut-aways and The Lab (§ 3, § 4, § 8, checklist 13 to 14); values not built yet are 🧪 placeholders. v0.9 retires the on-screen attribution line (owner decision) and folds in build stage 3 as built (transitions, time passes, bookends, full-frame screen, X-ray cut-away, callout, route ends), read in `src/scenes/{transitions.ts,SectionRoomScene.tsx}`, `src/Explainer.tsx`, `src/three/section/LivingRoomSlice.tsx`, `src/components/{FullScreen,ScreenBookend,Callout,Statement,TitleBlock,DetailBox}.tsx`, `screenKit.ts` and `src/theme.ts`. v0.8.2 added the screen-bookend loop (§ 8, owner decision). v0.8.1 folded in what the owner approved in build stages 1 and 2a (commit b501dde); those values were read in `src/theme.ts`, `src/three/section/*`, `src/scenes/SectionRoomScene.tsx` and the v0.8 overlay components.

> **Every value in this guide is 🧪 until the pilot's stills (`yarn stills`) in this look are judged by the owner.** The *decisions* marked ✅ (the Section frame, the orange rule, the cast, phones facing their owners, etc.) are approved; the numbers that implement them were set on a browser mock-up (`section-frame.html`, three.js r149 units, before the R3F `× π` light convention) and will move when the build is reviewed.

History: v0.1 to v0.7 described **The Plaster Museum** (matte plaster, one orange, numbered exhibits); see `CHANGELOG.md`. v0.8 replaces it with **The Section**, approved by the owner from `proposals/visual-identity-v1.md` (rev. 2). Research citations: `brand/research/platforms.md` (P§), `brand/research/landscape.md` (L§). Status: 🧪 testing, ✅ proven (by feedback, an owner decision, or a platform rule).

The look in one line: every place is **cut open and seen from outside**, with warm off-white cut faces, ink cut edges and hatch; inside it, **the objects are as real as we can build them and the people are stylized** (a recurring cast with dot eyes); the hidden system is the only orange, and it runs through the walls and the ground, out of the room and back.

## 1. Palette

Proposed `theme.ts` tokens (the scene-builder adds them; no inline colours in videos or scenes, ✅ studio rule). The old plaster/museum/plate/label tokens are retired.

**Constant in both moods**

| Token | Hex | Used for |
|---|---|---|
| `orange` | `#ff5b14` | The hidden system: path halo, node dots, its light, active LEDs and screens' glow, its mark on a screen (✅ owner decision) |
| `orangeCore` | `#ffb27a` | Not used by the path since stage 3 (its core is `orange` in both moods, § 5); kept in the theme |
| `orangeDot` | `#fff0e0` | Travelling dots on an active path |
| `cut` | `#efe9df` | **Every cut face**: wall tops and ends, floor slab, the ground block's cut sides. Also the overlay ink in Night |
| `eye` | `#1d1d1f` | Characters' eye dots |
| `cutLine` | `#24262c` | The ink line along every cut edge (§ 3), unlit, both moods |
| `screenLight` | `#dbe6ff` | A lit phone screen's light on its holder's face |
| `shoe` / `glasses` | `#26272b` / `#2a2b30` | Shoes; MOM's glasses |
| `leaf` / `leafDark` / `pot` | `#4f8a5b` / `#3c6e48` / `#d8d4cc` | The house plant |
| `ledOff` | `#3a3d44` | A device's status LED while the system is idle |

**Per mood** (§ 4 for lights)

| Token | Night | Day |
|---|---|---|
| `bg` (outside the slice, fog) | `#0d1322` (never darker) | `#cfe3f5` |
| `sky` (gradient behind the slice) | `#070b18` → `#141c36` → `#232c4c` | `#9cc8f2` → `#d4e8f8` → `#eef4f8` |
| `wall` / `floor` | `#2a3550` / `#3a3b4a` | `#f3eee6` / `#c9a982` |
| `soft` (couch) / `softLight` (cushions) | `#33405f` / `#3e4d72` | `#6f8fd1` / `#86a2dd` |
| `wood` / `trim` (window frame, sill) / `device` | `#5a4636` / `#404a62` / `#1b1d22` | `#8a6a4e` / `#e2e1dc` / `#2a2c31` |
| `appliance` (router, antennas) / `ceramic` (cup) / `shelf` | `#b9b9b5` / `#bdb9b1` / `#404a62` | `#d2d2ce` / `#e2ded6` / `#d2d2ce` (a step below white, so they never clip) |
| `shade` (lamp shade) / `rug` / `ui` (phone screen) | `#c4ae8a` / `#4a4a5c` / `#121318` | `#e4dccd` / `#cbbfae` / `#fafafa` |
| `window` (view: sky top, sky bottom, skyline) | `#0b1230` / `#27305a` / `#121833` | `#8ec5ff` / `#d9ecff` / `#9fb4cc` |
| `earth` (ground block's uncut sides) | `#2b2a33` | `#b9a68e` |
| `ink` (overlay text, rules, leaders) | `#efe9df` (= `cut`) | `#1b1d22` |
| `paper` (overlay fills, halos) | `#121828` | `#f6f2ea` |
| `inkSub` (sub-lines) | `rgba(239,233,223,0.7)` | `rgba(27,29,34,0.65)` |
| `capBg` (caption block) | `rgba(12,16,28,0.86)` | `rgba(246,242,234,0.94)` |
| `cavity` (inside a wall, seen through the X-ray cut-away, § 5) | `#0a0e1a` (darker than `bg`: see § 2 Night floor, open) | `#7d7870` |

| Rule | Value | Why | Status |
|---|---|---|---|
| **The orange rule** | The hidden system is always `orange`, in both moods; never blue, green or any other hue | One hue, one meaning; the reference colours each idea differently | ✅ owner decision |
| **Reserved band** | Nothing but the system may have HSL hue **8 to 40°**, saturation **≥ 60%**, lightness **35 to 75%**: no surface, clothing, UI element, overlay or practical light. Wood, skin and beige pass (low saturation) | Makes "everything else any colour" checkable; `#ff5b14` = 18°, 100%, 54% | ✅ owner decision (the band); 🧪 (its edges) |
| Never orange | People, cut faces, captions, tags, callouts, cards, statements, title block, background | The system keeps the colour to itself | ✅ owner decision |
| No pure white or black surfaces | Nothing at `#ffffff` / `#000000` except lights, glow cores, the off screen of the bookends (§ 8) and **glints** (§ 2) | Carried over: clipping and crushed blacks | 🧪 |
| **No orange on non-system parts** | On a realistic object, every part that is not the hidden system stays outside the reserved band, even if it is orange in life: **flex cables black** (`REAL.flex` `#1b1c1f`, not amber polyimide), gold and copper below 60% saturation (as built: gold pads `REAL.pad` `#b49f5e`), no amber LEDs, no orange labels or warning stickers | A real teardown is full of amber; on our screen amber would read as the system | ✅ owner decision (v0.10); 🧪 (values) |
| **Realistic object colours** | Objects take the colours of their real materials, outside the reserved band: graphite aluminium (`REAL.frame` `#5f6268`), near-black glass (`#0a0b0d`), dark green PCB (`#14261b`), tin shields (`#b9bdc2`), dark battery foil (`#2a2c31`). The `REAL` tokens in `theme.ts` (as built for the realism test, the same in both moods) are the source; no inline colours | Realism comes from real materials, not from a palette we invent | ✅ owner decision (realistic); 🧪 (values) |

## 2. Light and finish

| Rule | Value | Status |
|---|---|---|
| Rig | Hemisphere + one shadow-casting directional key + one fill; Night adds the practicals (lamp, screens). Values § 4 | 🧪 |
| Shadows | Key only; **soft PCF** (canvas `shadows="soft"`), 1024 map, bias **−0.0004**, normalBias **0.02**, shadow camera ±3 units around the slice. Not plain PCF with a radius: at radius 4 it drew shadow edges as stepped bands at close range (pilot fix pass, v0.10.1) | 🧪 |
| Cut faces read in both moods | `cut` must read as off-white in Night: lit by the key/hemisphere, luma ≥ 70% on the front cut face | 🧪 |
| Whites (Day) | On a full-scale still with overlays, screens and glow masked: **brightest near-neutral pixel ≤ 96%** (≤ 244), **zero pixels at 255,255,255**. Do not raise brightness to fix a dull still without the owner (the "too bright" lesson, v0.3). **Glint exception** (✅ owner decision, v0.10): small pure-white specular glints on **glass and metal edges** may reach 255 and are masked from this check. Placeholder for "small" (🧪): each glint ≤ 12 px across in the 1080 frame, total glint pixels ≤ 0.5% of the object's pixels; never a whole face or a broad sheen. Every other surface still obeys the 96% ceiling | ✅ owner feedback (the lesson), ✅ owner decision (glints); 🧪 (thresholds) |
| **Environment reflections** (objects) | Realistic objects reflect a **CC0 studio HDRI** (as built: Poly Haven *Studio Small 09*, 1k, `public/assets/hdri/`, gain 1.5 in `src/three/real/useStudioEnv.ts`). The HDRI lights reflections only; it is never shown as a background (outside the slice stays `sky` / `bg`, § 3) and does not replace the § 4 rig | ✅ owner decision (HDRI reflections); 🧪 (file, gain) |
| **Contact shadows and ambient occlusion** | Objects sit on contact shadows and get screen-space AO (**N8AO**, owner-approved dependency) in corners, under parts, between components. Not built yet: placeholders AO radius ≈ 0.05 units, intensity to judge on stills, applied before the post pass; Night must still meet the subject floor | ✅ owner decision (AO, N8AO); 🧪 (values, not built) |
| Exposure and roll-off (post pass) | Per mood, set by measuring stills without touching the light ratios: **Night exposure 1.4, shoulder 0.88; Day exposure 0.64, shoulder 0.74** (above the shoulder, 45% of the excess is kept). The sky and the window view are pictures, not lit surfaces: they are divided by the exposure so they show as authored | 🧪 |
| Night floor | The subject (the character or object the line is about) has p50 luma ≥ 30%; nothing darker than `bg`. Not yet met at the wide framing: a rim light is being added to reach it (scene-builder); the floor stays as is. **Open (v0.9):** the X-ray `cavity` in Night (`#0a0e1a`) is darker than `bg` (`#0d1322`) by design, so the cut-away reads; to check on a Night still whether it renders below `bg` after exposure, then keep it as a named exception or lift it (owner's call) | 🧪 |
| Vignette | Night `rgba(0,0,0,0.45)`, Day `rgba(30,40,60,0.18)` at the corners | 🧪 |
| Bloom | Selective: only meshes with `userData.glow` (the system). Lamps and screens never bloom | ✅ (rule) 🧪 (values) |
| Grain | Monochrome, 1 px, strength 0.035, seeded from `useCurrentFrame()` | 🧪 |
| Shallow focus | Focus line on the subject's height (default frame centre, 0.5); sharp ±0.14 of frame height; light, soft-focus strength **0.35** (the slice should read sharp, like a drawing) | 🧪 |
| The post pass | The post-processing component is the **single documented `useFrame` exception**; no other `useFrame` anywhere | ✅ studio rule |

## 3. The slice (geometry and materials)

| Rule | Value | Why | Status |
|---|---|---|---|
| **The Section** | Every location is a slice block seen **from outside**: near wall and ceiling removed, the cut faces visible. The camera never enters it | Seeing inside is the brand ("how things *secretly* work"); the reference's frame is an eye-level interior | ✅ owner decision |
| Block | ≈ **3.4 wide × 2.4 deep**, walls **2.7 high, 0.18 thick** (back and left walls standing, cut on top and at the front edge), ground block **2.2 deep** under the floor, cut on its front and right faces | One readable room per slice | 🧪 |
| **The section look** | Every cut edge carries a thin ink line: `cutLine` `#24262c`, **0.011 units** thick (≈ 3 px at the wide framing), unlit, both moods. Every cut face is filled with a **fine 45° hatch** in the cut colour, lines 13% darker (spacing 0.045 units, line half-width 16% of the spacing), fading out where lines would be finer than ≈ 2 px. **Nothing else is outlined** | Reads as an architect's section drawing; makes a single still ours | ✅ owner decision (2026-10-15); 🧪 (values) |
| What the frame shows (wide) | A band of sky on top (over the cut wall tops, back corner ≈ y 430), the room in the middle, the cut ground in the bottom ≈ 20% (the floor's front edge ≈ y 1540) | The slice reads as an object, seen whole | ✅ owner decision (stage 2a); 🧪 (values) |
| Living-room furniture (built) | Couch 2.5 wide (seats at x ±0.58), coffee table 1.4 × 0.6 with a cup, rug, shelf with a router (0.56 × 0.13 × 0.24, antennas, vent slot, status LED dark until the system is active), window with a trim frame and sill, a house plant front left, a floor lamp (lit in Night, there and off in Day); optional laptop with its lid toward the couch. Built stylized; to rebuild realistically under v0.10 (real materials, generic devices) | Lived-in, readable from the wide framing | 🧪 |
| Outside the block | `sky` gradient plane behind, `bg` elsewhere; **no floor plane, no horizon**: the slice floats like a section drawing | 🧪 |
| Other locations | Same grammar: a car cut along its length, a street cut through the road to the ducts under it, a data centre cut through a rack row. Services (ducts, cables, pipes) in neutral greys until the system uses them | New slices every video (P§4) | 🧪 |
| **The Lab** (second, recurring location) | A cut-open test room, same block and grammar as any slice, for every "researchers found" beat: a **bench of phones**, **robot arms** that tap them, a **test rig**, a **counter built into the set** (digits on a panel in the room, not an overlay) and a **wall meter**. Reached from a story slice by `follow` or `slide` (§ 8). Re-dressed per study (what is on the bench, what the rig does, what the counter counts) so no two videos show the same Lab beat. Equipment realistic and generic (v0.10, rows below) and neutral (greys, `device`, `appliance`); the counter and meter are never orange unless they measure the system. A legible set counter counts as the frame's one card (§ 6). Placeholders until built: block 3.4 × 2.4 like the living room, mood by the story (default Day), 4 to 6 phones on the bench, 2 arms | Findings need a picture of the finding; one reusable set keeps the build cost down (owner, rough-cut review) | ✅ owner decision (location, props); 🧪 (values) |
| **Object cut-aways** | The section look applies to **objects** too: a phone (or router, car key, card reader) cut open and seen from outside at the video's angle, cut faces in `cut` with the 45° hatch and the ink line, the inside **realistic, like a repair photo** (v0.10: board, chips with invented legends, shields, black flex cables, a labelled battery; § 1 no orange on non-system parts), the part that matters animated (e.g. a tiny **wake-word chip** with a slow waveform). **Non-system glows inside a cut-away are not orange**: placeholder `screenLight` `#dbe6ff` or none; orange only if that part is the hidden system. Placeholders until built: the object fills ≈ 50% of the frame height, floating on `bg` / `sky` like a slice, reached by a glide (§ 8) from the object in the room and back. **Does not count toward the X-ray's once-per-video cap** (§ 5, ✅ owner decision): it shows an object opened up, not the system running through the set | Every mechanism beat needs a visual of the mechanism (§ 8 Motion); the owner found two still mannequins "boring" during the wake-word part | ✅ owner decision (technique, not-orange rule); 🧪 (values) |
| **Objects realistic, people stylized** | **World objects** (phones, devices, furniture, lab equipment, vehicles) are built as realistically as we can: physically based materials (glass, metal, fabric, wood), HDRI reflections and AO (§ 2), and **real detail where the eye goes** (ports, seams, screws, chip legends, battery labels; a teardown reads like a repair photo). **The cast stays stylized** (§ 8 The cast: rounded, dot eyes). **The cut faces, ink cut edges and hatch stay** as the frame's signature, on objects too | Real objects make the mechanism believable; stylized people stay calm and clear of the uncanny (L§4); the cut look keeps a still ours | ✅ owner decision (v0.10, realism test) |
| Materials: objects | `MeshPhysicalMaterial` where it matters. As built (realism test, 🧪): aluminium frame metalness 1, roughness 0.34; cover glass roughness 0.04 to 0.08, clearcoat 1; frosted back glass roughness 0.42, clearcoat 0.6; PCB roughness 0.38, clearcoat 0.5. Not built yet (🧪 placeholders): fabric roughness 0.85 to 0.95 with a weave normal map, wood roughness 0.5 to 0.7 with a CC0 grain texture | Real surfaces are what make an object read as real | 🧪 |
| Materials: cast and cut faces | Matte `MeshStandardMaterial`, metalness 0: `cut` and walls 0.95, fabrics and hair on the cast 0.9, skin 0.75 | The drawing and the people stay soft and matte against the real objects | 🧪 |
| **Generic devices** | No logo, wordmark or maker's signature shape on any object. Phones: a **single plain camera strip** (not an iPhone square island or a Pixel visor), no notch or Dynamic Island shape; chip legends and labels invented (as built: "X7-AP", "CELL-07"). Same for routers, speakers, cars, cards | Realism without product placement or a claim about one company | ✅ owner decision (v0.10) |
| **Assets** | **CC0 first** (Poly Haven, ambientCG); anything else only if CC0 has nothing usable and its licence allows commercial use on all three platforms. Every file listed in `public/assets/LICENSES.md` (source URL, author, licence, date) before it ships; if a licence requires credit, the credit goes in the post description (§ 10). **New code dependencies only with the owner's approval** (approved: N8AO) | Assets must be safe to publish everywhere and traceable | ✅ owner decision (v0.10) |
| Rounded edges | Cast and stylized pieces: `roundedBox` radius ≈ 3 to 8% of the smallest dimension, bevel segments 3 (5 on anything the camera gets close to); limbs are capsules. Realistic objects: their real radii and chamfers (a phone's corner radius, a frame's edge). Cut faces stay **flat and sharp** (they are the drawing) | Soft for the cast, true to life for objects, sharp for the cut | 🧪 |
| Shadows under things | Figures: blob shadows (radial alpha 0.55 → 0). Objects: contact shadows and AO (§ 2); blob shadows only until those are built | Grounds things in the slice; real contact shadows sell real objects | 🧪 |
| **Phones face their owners** | A held phone's screen faces the holder's eyes (screen normal within ≈ 30° of the line to the eyes), held naturally (≈ 0.75 rad tilt in the hand). **Never turned to the camera.** The slice shows the phone's back or edge and the screen's light on the face; screens are read only in the detail box (§ 6) | ✅ owner decision |
| Screen light | Each lit screen has a point light `#dbe6ff`, 0.6, reach 0.9, on the holder's face (0.15 when locked) | Shows the screen is on without turning it to the camera | 🧪 |

## 4. Moods: Night and Day

Same slice, cast, orange and cut colour; light, palette (§ 1) and sky change.

| Light | Night | Day |
|---|---|---|
| Hemisphere | `#8aa0d8` / `#141a2a`, 0.55 | `#ffffff` / `#a8b4c8`, 0.85 |
| Key (directional, shadows) | `#ffc58a`, 0.85, from (−2, 3.4, 2.4) | `#ffffff`, **0.8**, from (−2.5, 4.2, 2.5) |
| Bounce (no shadows) | none | `#fff7ee`, **0.7**, from (4, 1.5, 3): low from the right front, lifts the walls (the left most) more than the tops |
| Fill | `#6f86c9`, 0.35, from (3, 2, 3) | `#cfe0ff`, 0.3, from (3, 2, 3) |
| Practicals | Lamp: point `#ffd29a`, 1.2 × 0.9, reach 4, **linear falloff** (decay 1: at 2 it burned a white disc into the wall); shade `shade` `#c4ae8a` lit from inside, emissive `#ffd9a0` at **0.096** (0.8 × 0.12: at 0.8 it clipped to white); breathes ±3% on a 4.5 s cycle. All outside the reserved band, no bloom | Lamp there and off (shade `#e4dccd`) |
| Rim (Night: being added to reach the § 2 subject floor) | `#9fb3e8`, 0.4, from behind (starting point) | — |

Intensities are the mock-up's; code multiplies them by π (three's physical light units). Shadows (key only): soft PCF, 1024 map, bias −0.0004, normalBias 0.02, shadow camera ±3 (§ 2).

| Rule | Value | Status |
|---|---|---|
| Which mood | The story decides: the moment happens at night → Night; daytime, "the next morning", scale, infrastructure by day → Day. **Default Day** | ✅ owner decision (both moods); 🧪 (default) |
| The system's mood | The path takes the mood of the slice it is in | 🧪 |
| Changing mood | Only on a location change (§ 8), or **one "time passes" beat per video** in the same slice | 🧪 |
| **Time passes** | **Render the slice once and blend light and colour**: sky, palette tokens and light colours/intensities interpolate from `moodFrom` to `mood` over **1.5 s**, cubic in-out, starting `moodAt` s into the scene (default 0.3). **Never double-expose anything that moves** (cast, phones, the route, the camera): no crossfade of two renders. It continues the previous scene's camera (no dissolve, § 8). Captions switch colours at the blend's midpoint. **As built (v0.9) it still crossfades two renders**, which made FRIEND jump in the rough cut: to rebuild (scene-builder) | ✅ owner decision (single render, rough-cut review); 🧪 (values) |
| Night guard rails | Night is a **lit room** (practicals, cut faces glowing off-white), never arcs on a dark void (the rejected navy look, L§1, L§5) | 🧪 |

## 5. The orange system

| State | Spec | Status |
|---|---|---|
| **Glow** (the system) | A path from device to device: tube core r **0.018**, `orange` in **both moods** (as built: the pale Night `orangeCore` bloomed to near-white on the light cut faces), halo r **0.055** `orange` at **25%**, both in the bloom layer. **Node dots** (r 0.035, `orange`) at every device it touches, from the moment the route starts. Draw 1.3 to 2.1 s per leg (built default 1.8 s each way), cubic in-out; a runner light (`orange`, 0.6, reach 1.2, as built) rides the head. Dots travel the finished path | 🧪 |
| **Route ends** (as built) | The route **starts and ends hidden inside the holder's body**, behind the phone (the node dot marks the phone); it comes out **behind the shoulder** on the router's side and runs in a **low arc** just above the router. From the camera it never crosses a body, and its light stays off the people | 🧪 |
| **Route through the section** | In the room: phone → router as above. Out of the room: straight segments with right-angle turns, **inside the wall** (X-ray, below), down into the ground, then along the ground's **front cut face** (25 mm proud), out of the frame edge. The way back runs parallel, 0.2 units lower. Underground runs sit on the cut face so they read like a line on a section drawing | 🧪 |
| **Bleed** | Screens and LEDs turn `orange` while the system is active; the screen tell (flicker ≈ 2.5 Hz between 20 and 80% for ≈ 1 s, ramp 0.5 s) starts 1.5 s before the route draws | 🧪 |
| **X-ray** (reveal technique) | While the route runs inside a wall, **a cut-away opens in the wall face**: the face is clipped over a rectangle round the route (living room: x 0.36 to 1.04, y 0.04 to 2.12 on the back wall), the reveal edges are cut faces: a hatched band (`cut` with the 45° hatch) **0.055 units** wide round the opening, with an ink line (`cutLine`) on **both** its edges; behind it is a shaded dark cavity (`cavity`, § 1) on which the orange reads, its soft front fading in from the wall colour. It **opens top-down** over a fixed **0.45 s** (`XRAY_OPEN`), finishing exactly when the route enters the wall, and closes the same way after the way back leaves it. Not a share of the route's length: v0.9's "≈ 10%" came to ≈ 2 frames at pilot route speed and read as a pop (pilot fix pass, v0.10.1). Values 🧪. It is a section cut, not a transparency (replaces v0.8's fade to 30% opacity). **At most once per video**, on objects inside the slice, never as the opening image. Object cut-aways (§ 3) do **not** count toward this cap (✅ owner decision, v0.9.1): they show an object opened up; the X-ray shows the hidden system running through the set | ✅ owner decision (technique); 🧪 (values) |
| **Trace** | After the reveal, what the system touched keeps a mark for the rest of that slice: node dots stay lit, the router LED stays on, a delivered ad keeps its 5 px orange edge in the detail box. No wall stain, no wash. The next slice opens clean | ✅ owner decision |
| Only the system moves fast | Everything else moves slowly (§ 8) | 🧪 |

## 6. Overlays

Fonts (`fonts.ts`): **Inter** 500 to 800 (captions, tags, callouts, counters, every phone UI), **Archivo** 800 (statement cards, the title), **JetBrains Mono** 600 to 700 (title sub-line, the DETAIL tab). Fraunces is retired. All OFL. ✅ owner decision (faces); 🧪 (sizes).

All overlays use the mood's `ink`, `paper` and `inkSub` (§ 1); **square corners everywhere**, no pills, no rounded boxes. Left-aligned elements start at **x 120**; nothing readable past **x 888** or below **y 1248**.

| Element | Spec | Status |
|---|---|---|
| **Captions: the margin note** | Block: `capBg`, square corners, padding 13 / 26 / 15 / 28 px, a **12 px `ink` rule on the left edge**. Inter 700, **50 px / 1.22**, `ink`, **left-aligned**. Left edge x 120, max right edge x 888, bottom edge **y 1188** (2 lines grow up to ≈ 1045). **Words appear one by one as spoken** (each fades in over 4 frames) and **the block grows with them** (a block sized for the whole page sat mostly empty behind the first word); **no highlight, no underline, no dimmed preview, never orange**. A new page starts at 5 words, after punctuation, or after a silence over 0.3 s; ≤ 2 lines. The page settles 6 px into place on an overdamped spring (opacity 0.6 → 1). Colours follow the mood of the scene on screen. Off while a statement card is up | ✅ owner decision (style, stage 2a); 🧪 (values) |
| **Name tags: drawing labels** | A **26 px colour square** (the character's top colour, 3 px `paper` outline), 12 px gap, the role in Inter 700 **26 px**, uppercase, letter-spacing 0.08em, `ink`, no fill. Leader: 2 px `ink`, from the top of the head **straight up, then horizontal** (one right angle) to the tag in the margin outside the slice (left tags start at x 120, right tags end at x 888), ending 10 px short of the tag; when the head is right under the tag, the leader runs straight up. The tag sits **120 px above the head** (never above y 470) and follows the head as the camera moves; text on a 10 px `paper` halo. Default side: the left seat's tag on the left, the right seat's on the right. Text ≤ 12 characters: YOU, FRIEND, MOM. On a character's first appearance and on re-entering in a new slice; hold ≥ 1.5 s, fade 10 frames; ≤ 2 at once; never with a card or statement | ✅ owner decision (style); 🧪 (values) |
| **Callouts (objects)** (as built) | A drawing label, **no card**: a 2 px `ink` **elbow leader** from the thing (straight up or down, then across; one right angle) to the label, ending 10 px short of it. Label **Inter 700 26 px, uppercase**, letter-spacing 0.08em, `ink` on a **10 px `paper` halo**, ≤ 3 words; optional sub-line Inter 600 20 px, 0.04em, `inkSub`, 4 px below. Placed beside the leader (`side`, default) or above it (`above`), clamped inside x 120 to 888. Leader in over 12 frames, label from frame 6 to 16 | 🧪 |
| **Detail box** (how screens are read) | Square-cornered frame, 4 px `ink` border, `paper` fill, shadow `0 13px 32px rgba(0,0,0,0.25)`; a **DETAIL** tab top-left (Mono 700, 17 px, 0.16em, `paper` on `ink`). Holds a **flat, crisp 2D crop of the screen part that matters** (the search field, the ad). Default **324 to 360 px square**, max 696 × 620, in the room zone (≈ top y 710); left edge x 120 or right edge x 888, on the holder's side. 2 px `ink` elbow leader to the phone. In over 10 frames (opacity, 8 px rise). Text inside ≥ 28 px. Counts as the frame's one card; captions continue | 🧪 |
| **Full-frame screen** (as built) | The detail box enlarged for a beat about the phone itself: a `paper` **scrim at 94%** hides the slice; the box (4 px `ink` border, DETAIL tab, shadow as the detail box) holds the **whole phone screen** from the screen kit, centred, filling the safe area from **y 288** (tab top) to **≈ y 1030** (just above the caption band; ≈ 378 × 714 px with the border). In over 10 frames (opacity, 8 px rise), out over 10. Captions continue under it. Counts as the frame's one card. **At most twice per video, not counting the two bookends** (§ 8). The § 8 "nothing readable above y 520" rule is for bookend screens only and does not apply to this box (✅ owner decision, 2026-10-16) | 🧪 |
| **Statement card** | Archivo 800, **88 px / 0.95**, letter-spacing −0.03em, `ink` with a stacked `paper` halo (32 px + 16 px), no box; **left-aligned at x 120**, max right edge x 888, ≤ 2 lines, ≤ 14 characters a line; sentence case, a full stop: "One household." **Default: in the sky band, top edge y 288** (✅ owner decision, stage 2a review; value as built, so a one-line card stays clear of the cut wall tops at ≈ y 430). **A two-line statement does not fit the sky band: use `place: 'low'`** (bottom edge y 1000, growing up). Also available: high (top edge y 500). ≤ 2 per video, ≥ 6 s apart, never in the first 3 s, never with another card. Hold from its first spoken word to 0.8 s after its last (or the next word), 1.2 to 3.0 s. In: opacity 12 frames, 6 px rise, cubic in-out; out: 12 frames, no movement. Captions off while up | ✅ owner decision (card, rules); 🧪 (values) |
| **No source text** | No attribution line, "Source:", URL or document title on screen (✅ owner decision, v0.9; the v0.6 attribution line is retired). Sources go in the post description (§ 10); attribution is spoken (brand.md § Voice) | ✅ owner decision |
| **Title block** | First scene only: enters at ≈ 1.0 s (opacity and a 6 px rise over 10 frames), holds ≈ 2.5 s, fades 10 frames. **Wake-bookend openings (§ 8): enters at ≈ 2.8 s**, after the wake finishes (✅ owner decision, 2026-10-16; why: at 1.0 s it sat on the wake moment, the video's first beat). Whether it then lands over the end of the pull-back or the wide frame is to check on stills. **Sits in the sky band** (✅ owner decision, stage 2a review; the sky band arrives with the pull-back, § 8): top edge **y 300** (as built: at 340 it sat on the cut wall tops), left edge x 120 (the band ends ≈ y 430 at the wide framing). `paper` fill, 3 px `ink` border, square corners, padding 13 / 24 / 15 px. Line 1: "No. 001 · The Living Room", Archivo 800, 37 px / 1.15, `ink`. Line 2 (6 px below): "SECTION A–A · 9:47 PM", Mono 600, 19 px, 0.18em, uppercase, `inkSub`: the story's time, matching the mood (never "9:41") | ✅ owner decision (placement); 🧪 (values) |
| Counter | Same frame as the title block: Archivo 800 digits 80 px, Inter 600 unit 34 px, Mono sub 20 px | 🧪 |

**One idea per frame** (✅ owner decision). Besides the title block and captions, **at most one card at a time**: detail box, full-frame screen, callout, counter or statement card. Name tags don't count but never share the frame with a card. Nothing rides along with a card (no sub-card, no source line). The next card enters only after the previous has left. The subject spans ≤ 60% of the safe width (≈ 460 px); nothing readable within 48 px of it except its own leader.

## 7. Layout and safe zones (`theme.SAFE`)

Combined safe rectangle: **x 120 to 888, y 288 to 1248** (P§1, ✅ platform rule). Everything readable stays inside it; set (the slice, sky, ground) may run under the rails and the bottom.

| Element | Position | Status |
|---|---|---|
| Sky band (wide framing) | y 288 to ≈ 430: the title block (top y 300) and, by default, one-line statement cards (top y 288) | ✅ owner decision (stage 2a); 🧪 (values) |
| The room (wide framing) | **≈ y 430 to 1540**; the subject (the people on the couch) **≈ y 820 to 1180**. Replaces v0.8's focal band (y 420 to 1040): the camera framing wins | ✅ owner decision (stage 2a framing); 🧪 (values) |
| Cut ground | The bottom ≈ 20% (below ≈ y 1540): set, not content | 🧪 |
| Detail box | In the room zone, on the holder's side | 🧪 |
| Statement card | Sky band, top edge y 288 (one line); two lines: low (bottom y 1000); high (top y 500) available; x 120 to 888 | 🧪 |
| Full-frame screen | Centred, y 288 to ≈ 1030, over a `paper` scrim; captions below it | 🧪 |
| Captions | Left x 120, bottom y 1188, right ≤ 888 | ✅ platform rule (inside the zone); 🧪 (values) |
| Name tags | Margins outside the slice, x 120 to 888, 120 px above the head, never above y 470 | 🧪 |
| Known overlap | A 2-line caption page (≈ y 1045 to 1188) covers the bottom of the subject zone (to ≈ 1180) at the wide framing. To check on stills; options: keep pages to 1 line on wide shots, or frame the subject higher | 🧪 open |
| Cover frame text | Inside the safe rectangle (3:4 grid crop, P§2) | ✅ platform rule |

## 8. Camera, transitions and motion

| Rule | Value | Why | Status |
|---|---|---|---|
| **Outside, always** | The camera never enters a slice: no eye-level interior, over-the-shoulder or handheld shots | Those are the reference's frame | ✅ owner decision |
| Angle | **One fixed 3/4 view per video**, from the front-right: the direction from (0.05, 0.75, −0.15) to (4.6, 3.6, 8.6) (the mock-up's camera): ≈ **28° yaw** off the cut face, ≈ **16° down**. A framing is a look-at point plus a distance along that direction. Never rotates within a video | A constant angle is recognisable | 🧪 |
| Lens | Perspective, **fov 26°** (long lens: flattens toward a drawing, keeps it real) | Between orthographic and the reference's wide interior | 🧪 |
| Framings (living room) | **Wide** (the default): look at (−0.2, 1.36, 0), distance 12.75, camera ≈ **(5.45, 4.90, 10.87)**: sky band on top, the room in the middle, the cut ground in the bottom ≈ 20% (§ 3, § 7). **Couch**: look at (0, 0.92, −0.45), distance 8.0: a seated figure fills ≈ 40% of frame height, the closest a push may come | The slice reads as a whole object; the couch is the close-up | ✅ owner decision (wide, stage 2a); 🧪 (values) |
| Moves | Truck, crane and slow push only, sine in-out, one move per scene. Defaults: push **0.04** units/s (max 0.06), idle sideways drift **±0.08** units on a 25 s sine of the video clock (max ±0.15), continuous across cuts | The slice is calm; the orange moves | 🧪 |
| **Glide** (framing change in one location) | Every change of framing **within a location** (wide ↔ couch ↔ a device ↔ an object cut-away) is an eased **glide**, not a cut: **0.5 to 1.0 s, cubic in-out**, from the current framing to the next along the fixed angle (look-at point and distance interpolate; the angle never changes). During the glide only, it may exceed the push limit above; the slow push and drift resume after it. Placeholders until built: default 0.8 s (24 frames), at most one glide per scene, starts on the scene's cue | The owner found the hard cuts between framings "abrupt" (rough-cut review) | ✅ owner decision (glide, 0.5 to 1.0 s, cubic); 🧪 (default, cap) |
| **Transitions** (as built, `transitions.ts`) | Five kinds, picked per scene (`transition`) or by the auto rule below. **`continue`**: same location and mood; the camera carries on from where the last scene ended, no dissolve, no overlap. **`slide`**: the next slice slides in from below as the current leaves at the top, **18 frames**, cubic in-out. **`follow`**: the move to a linked slice along the route, **24 frames**, sine in-out, with a short orange seam line where the route crosses; a **2D stand-in** (the two scenes translate as flat layers) until a second slice exists. **`dissolve`**: **12 frames**, cubic in-out, **legacy** (old scenes, and a mood change in the same slice without `moodFrom`). **`cut`**: plain cut | One name per hand-over, so the director picks a move, not a duration | 🧪 |
| Auto rule | Same location, same mood (or the next scene's `moodFrom` equals the last mood) → `continue` (a new framing glides, above); new location → `follow` if the scene sets `follow`, else `slide`; any non-Section scene → `dissolve`. **Same location, other mood → a time-passes beat (§ 4)**, not a dissolve: a dissolve double-exposes the cast (as built the auto rule still picks `dissolve` here: to change, scene-builder) | The default does the calm thing; a spec overrides only on purpose | ✅ owner decision (no double exposure); 🧪 (the rest) |
| Same slice, next idea | `continue`: the camera keeps moving through the scene change; a new framing is a glide | One continuous look into one place | 🧪 |
| **Follow the line** (linked locations) | Target: the camera cranes or trucks along the orange path to the next slice, stacked below, above or beside the current one, 18 to 30 frames, sine in-out; the path visible crossing the seam. Today the 2D `follow` stand-in above; The Lab (§ 3) is the first second slice to build it on. Between a story slice and The Lab: `follow` or `slide` | The journey out of the room is a camera move | ✅ owner decision (approach; follow/slide between locations); 🧪 (values) |
| **Section slide** (unlinked locations) | `slide`, 18 frames | Like scrolling a drawing | 🧪 |
| Cuts and dissolves | **Hard cuts are rare**: never to change framing within a location (glide instead), never for a time pass. Placeholder: at most 2 per video outside the bookend lock, each on purpose (a jolt the story wants), and no cut within 1.5 s of the previous one. The 12-frame dissolve is legacy: not between locations, not for the loop, not between moods in one slice | The owner found hard cuts "abrupt" (rough-cut review); the loop is carried by the black bookends | ✅ owner decision (cuts rare); 🧪 (the cap) |
| Scene length | 3 to 6 s, one idea per scene | Keeps the picture changing with the words (CLAUDE.md § Style) | 🧪 |
| Easing | Cubic in-out for reveals, cards, routes and camera glides; sine in-out for the slow camera moves; overdamped springs for captions; no linear, no overshoot, no bounce | Calm, deliberate motion; nothing cartoonish | 🧪 |
| Determinism | Every value a function of `useCurrentFrame()`; `random('seed')`, never `Math.random`; no `useFrame` outside the post pass | Renders must be repeatable frame by frame | ✅ studio rule |

**Motion principles** (owner feedback 2026-10-15, "everything feels static except the camera"; rough-cut review, "we still see both mannequins, it's kind of boring; animation is also what people want to see").
0. **The motion rule** (✅ owner decision, rough-cut review). **Something meaningful moves on screen at least every 2 to 3 s; never two people sitting still under narration. Every beat that explains a mechanism gets a visual of that mechanism** (the wake word: the phone cut open and its chip listening, § 3; a study: The Lab running it, § 3). *Meaningful* (🧪, so it can be checked): a change a viewer notices that belongs to the line: a gesture (type, lift a phone, glance, lean, point), a glide (§ 8), the route drawing or dots travelling, a mechanism animating (a chip's waveform, a robot arm tapping, the counter ticking, the meter's needle), a detail box or card entering. Breathing, blinks, the lamp and the idle drift keep a shot alive but **do not count**. Checked in Studio playback, not on stills.
1. **Something is always alive.** Figures breathe (±0.012 units, phase-offset per person), blink (eye scale y → 0.1 and back over 4 frames, every 3 to 5 s, seeded per character, the first within 3 s), nod gently, shift weight, thumbs scroll, glance (head turns up to 0.5 rad toward what the line points at), lean in to a screen, lift a phone when it lights.
2. **The set:** Night: screen light flickers on faces, the lamp breathes ±3%. Day: leaves pass the window, dust in the sun. Orange ambient life (LED pulse) only while the system is active.
3. **Calm and slow;** the orange is the only fast thing.

### The cast (✅ owner decision; values 🧪)

`Mannequin` rig, **adult proportions** (head r 0.165, about 1/7 of standing height): never chibi. Faces: **two dot eyes** (`eye`, r 0.018, at ±0.055 across, slightly below centre), no mouth, no brows. Hair: a cap sphere (r 0.172) plus the detail (MOM's bob: a deeper cap, r 0.18, down to the jaw; glasses: two rings r 0.034 and a bridge). Never a realistic face (L§4). As built (stage 1, ✅ owner approved): **sleeves to the wrist** (forearm r 0.058 in the top colour), **small hands** (sphere r 0.045, skin) with a thumb that scrolls; seated, seat height ≈ 0.57; a phone 0.12 × 0.22 held in both hands, screen toward the eyes; extras default to skin `#d9a77f`.

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
| Apps (as built, `screenKit.ts`) | `lock`, `notification`, `search`, `results`, `feed`, and **`assistant`**: a generic voice assistant waiting for its wake word (a round mic button, a slow neutral waveform, one line of text, default "Waiting for the wake word"). Screen 360 × 686 units, drawn by one function for the 3D phone, the detail box, the full-frame screen and the bookends, so they always match |
| Mic indicator | A small mic glyph in the status bar (and on the lock screen): **`mic: 'on'`** neutral (the UI's text colour: an app is using the mic, nothing hidden); **`mic: 'system'`** `orange` (only when the story says the mic is the hidden system). Default off |
| The system's mark | Where the system shows on a screen: the targeted ad's 5 px `orange` edge, or the mic indicator at `'system'`. Nothing else on a screen is orange |
| Where it's read | Only in the detail box, a full-frame screen (§ 6) or a bookend. Phones in the slice face their owners (§ 3) |
| Readable | ≥ 28 px in the 1080 frame; one readable thing per screen |

### The screen-bookend loop (✅ owner decision, v0.8.2; values 🧪)

No intro, no title card, no logo. Every video **opens on a phone screen waking and ends on a phone locking**; frame 1 and the last frame are both black (`#000000`, the one allowed pure black: a screen that is off), so the replay is seamless whatever the mood of the first and last slices. Why: the pilot opened at Night and ended in Day and the replay jumped; the bookend is mood-agnostic and frames each video on the phone. Replaces v0.8's loop (phone locks in the slice, cut or 12-frame dissolve to the room's frame 1).

| Beat | Value |
|---|---|
| Opening: wake (as built, `wake`) | Frame 0 black; the screen stays dark for `darkFor` (default **0.2 s**, 6 frames), then **wakes over 8 frames** (opacity, cubic in-out). The screen is drawn by the screen kit at the frame's full height (≈ 1008 × 1920, centred, black at the sides: nothing cropped) |
| Opening: lock screen | Lit by ≈ 0.5 s, holds to ≈ 1.0 s: the story's time (never 9:41), mood UI (§ 8 phone-screen kit). Clock centred at ≈ y 640 (screen placement row below) |
| Opening: first app action | ≈ 1.0 to 2.2 s: the story's first action on the screen (the search typed, the message arriving), one readable thing, generic UI. The title block does **not** enter over it: on a wake-bookend opening it enters at ≈ 2.8 s (§ 6 title block). Screen content stays inside x 120 to 888, y 520 to 1040 (clear of the title block's zone and the caption page) |
| **Screen placement** (full-frame **bookend** screens only: the bookends' lock and app screens, e.g. lock, search) | **Nothing readable above y 520**; lock-screen clock centred at ≈ y 640. **All text at x ≤ 888**: long rows are truncated (ellipsis), never run past. ✅ owner decision, 2026-10-16 (closes the v0.9 open item); values 🧪. **Does not apply to the § 6 full-frame screen box** (✅ owner decision, 2026-10-16): the box keeps its own layout, DETAIL tab at y 288, inside the safe area. Why: above y 520 is the title block's zone and the top rail (§ 7), and past x 888 is the right rail. As read in v0.9 the kit's lock clock sat at ≈ y 560 (digits' top ≈ y 460) and the status-bar clock at ≈ y 67: both break this rule until changed (scene-builder) |
| Opening: pull-back (as built) | At `pullAt` the full-frame screen **shrinks onto its phone in the slice** (size on a log scale, a steady dolly) while the 3D camera pulls back from the phone (distance 2.6) to the scene's framing, sine in-out, over `pullDuration` (default **1.4 s, 42 frames**; the guide's 18 to 30 frames is a 🧪 target to judge in the Studio). The black round the screen clears over the first 25% of the move; over the last 30% the 2D screen fades into the 3D phone's own screen. The camera stays outside the slice and the phone in 3D keeps facing its owner; the screen is a 2D layer (like the detail box), so neither "Outside, always" nor "Phones face their owners" is bent. Wide by ≈ 3 s |
| Closing: push-in (as built, `sleep`) | At `pushAt` the reverse move: the camera pushes toward a phone (to distance 2.6) and its screen grows from the phone to full frame, sine in-out, over `pushDuration` (default **1.2 s, 36 frames**). The last slice needs a phone in it (any cast member's); its screen shows the story's last state or the lock screen, nothing new to read |
| Closing: lock | At `lockAt` (default **6 frames before the end**) the screen goes **black in 2 frames**, one **soft click** (§ 9), then a **4-frame black hold** to the end. Captions end before the click; no overlay on the black |
| Mood | Each bookend's screen uses the mood of the slice it leaves or enters (Night dark UI, Day light UI); the black bridges them |
| Full-frame budget | The two bookends **do not count** toward the "full-frame screen at most twice" cap (§ 6): they are the frame of every video, not a story beat |

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
| SFX | One soft click (CC0) when the phone locks at the end (§ 8 screen-bookend loop); optional low hum while the orange is active, 20 dB under the voice. Nothing else | A quiet world; the sound marks the loop | 🧪 |
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
| Description | Hook line; if `sources.md` has a 🎭 claim, "Illustrative: [what is invented]." (brand.md § Sourcing policy; owner decision); one "Sources:" line (no "Full sources: link in profile" while there is no profile link, ✅ owner decision 2026-10-16; it comes back when a link exists); **asset credits** ("Assets: [name] by [author], [licence]") only for assets in `public/assets/LICENSES.md` whose licence requires credit (CC0 needs none; § 3 Assets, ✅ owner decision v0.10). ≤ 2,200 chars so one text works everywhere |
| Cover | Custom cover on Instagram and TikTok (desktop, 3:4-safe); on YouTube pick a frame until YPP. Cover text inside the safe rectangle |

## Review checklist (one still per scene, `yarn stills <slug>`)

1. **Outside, always:** apart from the two screen bookends, every shot looks into a slice from outside at the video's one fixed angle; cut faces visible in `cut` off-white with the fine 45° hatch, an ink line on every cut edge and on nothing else; no interior, eye-level or over-the-shoulder shot. Wide shots: sky band on top (to ≈ y 430), room in the middle, cut ground in the bottom ≈ 20%.
2. **Orange:** the only pixels in the reserved band (hue 8 to 40°, sat ≥ 60%, lightness 35 to 75%) are the system (path, nodes, dots, its light, active LEDs, its mark on a screen: the ad's edge or a `'system'` mic indicator). Captions, tags, callouts, cards, people and cut faces are never orange; nor are non-system parts of realistic objects (flex cables black, no amber parts, labels or LEDs).
3. **Phones face their owners, devices generic:** no screen turned to the camera in the slice; every readable screen is in a detail box, one of ≤ 2 full-frame screens, or a bookend (not counted); phone UI generic (no real app, logo, brand colour, "9:41"); no logo, wordmark or maker's signature shape on any device (phone camera = a single plain strip).
4. **Mood:** one mood per slice (or the single time-passes beat, rendered once with light and colour blending, nothing double-exposed); Night: subject p50 ≥ 30%, cut faces read off-white; Day: brightest near-neutral ≤ 96%, zero pixels at 255,255,255 (overlays, screens, glow and small glass/metal glints masked; no pure-white surface).
5. **Frame:** title block only in the first scene (top y 300; enters at ≈ 2.8 s on a wake-bookend opening, else ≈ 1 s); one-line statements in the sky band (top y 288), two-line statements low (bottom y 1000); no source text anywhere on screen; nothing readable past x 888 or below y 1248; left-aligned elements start at x 120; the subject (≈ y 820 to 1180 on wide shots) not covered by a 2-line caption page (§ 7 known overlap).
6. **Captions:** margin note (square, left rule, `capBg`), Inter 700 50 px, words appear as spoken, no highlight or underline, bottom y 1188, ≤ 5 words; off while a statement is up.
7. **Tags:** colour square + role, elbow leader, in the margin outside the slice; ≤ 2; never with a card; first appearance only (and on re-entry).
8. **One idea per frame:** at most one card (detail box, full-frame screen, callout, counter, statement) besides title block and captions; nothing riding along with it. Callouts are labels with an elbow leader and a paper halo, no card.
9. **Statement cards:** ≤ 2, Archivo 88 px left-aligned, at the § 7 positions. No attribution line, "Source:" or URL on screen (sources are in the post description).
10. **System:** route ends hidden inside the bodies, coming out behind the shoulders in a low arc (never crossing a body); leaves through the wall and ground on the cut face; node dots at devices; X-ray at most once, as a cut-away (hatched reveal edges, ink line, dark cavity) opening top-down; trace present on every later shot of that slice; next slice opens clean.
11. **Cast:** dot eyes, no mouth; adult proportions; sleeves to the wrist, small hands; colours as § 8; something alive in every shot (breath, blink, glance).
12. **Screen-bookend loop:** frame 0 black, the screen wakes (8 frames after ≈ 0.2 s dark; lock screen lit by ≈ 0.5 s, first app action, the story's time, never 9:41), the screen shrinks onto its phone as the camera pulls back and hands over to the 3D phone, wide by ≈ 3 s; at the end a push into a phone's screen, it locks (black in 2 frames, soft click), 4 black frames; last frame black. No title card, logo or overlay text over the wake: the title block enters at ≈ 2.8 s (§ 6). On every full-frame bookend screen (lock, search, any app; not the § 6 full-frame screen box): nothing readable above y 520 (lock clock ≈ y 640), no text past x 888, long rows truncated (§ 8 screen placement).
13. **Transitions and camera:** same slice and mood `continue` (no dissolve); a framing change in one location is a 0.5 to 1.0 s cubic glide, never a cut; new slice (incl. The Lab) `slide` (18 frames, from below) or `follow` (24 frames, seam line visible); a time-passes beat is a 1.5 s light-and-colour blend of one render; hard cuts rare (≤ 2 outside the bookend lock, 🧪); no 12-frame dissolve between Section scenes unless chosen on purpose.
14. **Motion (Studio playback, not stills):** in every 2 to 3 s window something meaningful moves (§ 8 motion rule; breathing, blinks and drift don't count); never two people sitting still under narration; every mechanism beat shows that mechanism (object cut-away or The Lab, § 3), cut faces hatched and inked, non-system glows not orange.
15. **Objects real, people stylized:** objects read as real (physical materials, HDRI reflections, contact shadows / AO, real detail where the eye goes; a teardown reads like a repair photo), the cast stays rounded with dot eyes, the cut faces keep their ink edge and hatch; every third-party asset on screen is in `public/assets/LICENSES.md`.
