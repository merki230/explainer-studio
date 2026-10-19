# No. 005 · The Shoulder: audio + visual script

Draft by the director, 2026-10-18, before voice (playbook step 0). Inputs: `script.txt` (11 lines, 178 words), `performance.txt`,
`sources.md` (fact-check PASS, § G signs and cross-section, § 3D scene list, focus objects), `brand/style-guide.md` v0.11.3,
`brand/brand.md`, the owner's fixed decisions in the brief (below), and the parts in `src/scenes` (`car-slice`, `street-slice`,
`wheel-slice`), `src/three` (`real/`, `section/`, `TirePieces.tsx`, `OrangePath.tsx`) and `src/components`.

**Owner decisions this draft follows (fixed):** a realistic US interstate at night at frame 0 (white 65 mph speed limit sign,
green mile markers, one generic green guide sign with no route numbers and no Interstate shield, 12 ft lanes, a 10 ft outside
shoulder, a white right edge line, a yellow left edge line); **no rumble-strip sign of any kind**; The Section look, orange only for
the grooves, the tire-drop impacts and the vibration path; the dashboard read through the DetailBox, **speedometer 60 while the sign
says 65**; the vibration path tire → wheel → steering wheel and seat, **the suspension not labelled**; shot sizes vary, open close on
the tire drifting over the edge line onto the grooves, then reveal; Lancaster as a generic road with an animated musical cue and a
house whose light switches on, no real map or logo; the ending loops back to the opening night drift; about 61 s at 2.92 words/s.

**Times** are estimates at 2.92 words/s from the script words only: 178 words = **60.96 s**. `performance.txt` adds three `[pause]`
tags (before lines 7, 9 and 11) and two ellipses (lines 8 and 11), about 0.4 to 0.6 s each, so from line 7 on the real times run
later: ≈ +0.5 s at line 7, ≈ +0.9 s at 8b, ≈ +1.4 s at line 9, ≈ +2.0 s at line 11. **Spoken length ≈ 63 s**, plus a 1.0 s hold on the
loop frame. Over 60 s means our own music or none (brand.md § Structure). The estimated `transcript.json` (`yarn timings`,
2.5 words/s) ends at 69.7 s. Re-time against the real take before writing `spec.ts`.

**Re-timed to the recorded take** (transcript.json, 58.56 s; the owner approved all seven decisions below, line 2 now reads
"How does a road make that noise?", `[amused]` is dropped). The table's in → out times are the pre-voice estimates; the real
times and the spec scenes they became (`spec.ts`) are:

| Beat | Cue | Real in (s) | Spec scene |
|---|---|---|---|
| 1a / 1b | `Drift toward the edge` / `and the road itself` | 0.00 / 2.24 (first drop "road" 2.48, "yelling" 3.84) | 1 (H, 0 → 7.52, holds the title block) |
| 2 | `How does a road` | 5.17 (question ends ≈ 6.9) | 1 |
| 3a / 3b | `Look at the shoulder` / `where there's a row` | 7.52 / 8.72 ("half" 10.36) | 2 (H, 7.52 → 12.68) |
| 4a / 4b | `Your tires drop` / `and that squeezes` | 12.68 / 14.72 ("squeezes" 15.04, "air" 16.48) | 3 (C, slide) |
| 5a | `At 60 miles` | 18.28 ("60" 18.52, "88" 20.28) | 4 (C) |
| 5b | `so fast it blurs` | 22.16 | 5 (C) |
| 6a / 6b | `You feel it` / `which is how it warns` | 25.64 / 28.08 ("wheel" 26.96, "seat" 27.44, "drowsy" 29.04) | 6 (C, one scene: 6a alone would be 2.4 s) |
| 7 | `On rural freeways` | 31.44 ("a fifth" 34.48) | 7 (H, slide) |
| 8a / 8b | `The pitch depends` / `which means the right gaps` | 37.12 / 40.16 | 8 (L, slide; one scene: 8b alone would be 2.9 s) |
| 9a | `In Lancaster, California` | 43.02 | 9 (L) |
| 9b / 10 | `but it kept neighbors` / `And the city says` | 47.72 / 50.60 ("moved" 49.56, "notes" 51.68) | 10 (L, one scene: each alone under 3 s) |
| 11a | `Next time your car` | 53.12 ("roars" 54.16) | 11 (H, slide) |
| 11b | `that's the road telling` | 56.24 ("steer" 57.60) → end 59.76 (1.2 s tail) | 12 (H, the loop frame) |

**Mood.** Everything is **Night** (the script says "at night" twice: lines 9 and 11). One mood across all three locations, so there's
no time-passes beat. Night guard rails apply (§ 4): a lit slice, not arcs on a void. The light comes from a moon key, the car's
headlights (white cones on the asphalt ahead), retroreflective sign faces lit by them, and the cut faces glowing off-white.

## The world

Three locations, linked by `slide` (18 frames). Inside a location every framing change is a `continue` glide.

- **H, the highway slice** (new, the opening and the end). A **cross-section of a divided rural interstate, cut square to the
  road**, with the road running **into depth** (the No. 004 street layout). On the cut face, from left to right: the median (grass,
  ≥ 36 ft, drawn short), the 4 ft inside shoulder, the **yellow left edge line**, two **12 ft lanes** with a broken white lane line,
  the **white right edge line** (6 in), the **10 ft outside shoulder** with **the groove row just outside the white line** (≈ 6 in
  from it, a band ≈ 1 to 1¼ ft wide: a narrow band of a wide shoulder, the proportion that reads real, G5), then gravel, a grass
  ditch and a W-beam guardrail. Asphalt, base and subgrade layers hatched and inked on the cut. **One scoop is cut across its length**
  on the face (curved bottom, ½ in deep at the middle), and the row recedes up the shoulder as a striped ribbon, scoops 12 in
  centre to centre. The milled faces show coarser fresh aggregate than the lane (A2 note).
  - **Traffic drives away from the camera**, so the right-side signs face the camera and read square-on (at 28° yaw). On the right
    verge, receding: the **R2-1 SPEED LIMIT 65** (white, black legend, 48 × 60 in, galvanized posts) near the plane; a **D10 green
    mile marker** `MILE / 112` (🎭 number); further up, **one generic green guide sign**, recommended legend `NEXT EXIT / 2 MILES`
    (white on green, no route number, no shield, no place name). Signs retroreflective: they light up as the headlights reach them.
    **No rumble-strip sign** (owner decision; there's none in the MUTCD, G1).
  - **YOU's car**, whole (not cut), driving away just behind the section plane, its right tires near the white line. Tail lights
    red, unlit amber markers desaturated, headlights white. Seen from the rear-right quarter. YOU isn't readable from here (the
    rear window); YOU's first clear view is in C.
  - A second green mile marker belongs to the opposite carriageway (beyond the median, seen from the back): markers are a mile
    apart, so only one per direction fits the slice. Value for the scene-builder.
- **C, the car slice on the shoulder** (existing `car-slice`, re-dressed). The No. 002 car cut open along its near (right) side,
  the near wheels cut at their mid-plane, driving +x on a road block whose **front cut face runs along the centreline of the
  groove row**, so the cut face is a **longitudinal section of the scoops**: a row of shallow curved dips 12 in apart. Night highway
  dressing (white edge line just behind the cut edge, asphalt, gravel strip). This is where the mechanism lives: the tire dropping
  into each scoop, the squeezed tread and trapped air, the hum, and the vibration path into the cabin. YOU (cobalt hoodie) drives
  on the far side, hands on the wheel.
- **L, the musical road** (new). A generic **two-lane desert road at night**, laid across the frame (as in C), cut along the right
  wheel path so the cut face shows **groups of grooves at different spacings** (wide groups and tight groups, invented layout, 🎭).
  Behind the road (behind the cut), sand, scrub, and **one neighbour's house** at a modest distance (simple realistic massing, a
  bedroom window). A grey extra's car (not YOU's: this isn't YOU's drive) passes along the road. No sign, no street name, no map,
  no logo.

**Colour.** Orange is only the system: the **groove row lit** while a tire is on it (a faint orange wash on the scoop faces, never
the whole shoulder), the **impact flashes** at each drop (a short `RadioPulse`-style ring at the contact patch), the **trapped-air
puff** (C), the **blur band** of continuous impacts (5b), the **vibration path** (`OrangePath`: tire contact → wheel hub → steering
wheel; a branch → seat rails → seat; node dots at the wheel, the steering wheel and the seat; **no label on the suspension**), and the
**groove groups lighting** on the musical road (L). **Not orange:** the yellow left edge line (a muted yellow at hue ≥ 45°, below
the reserved band; new token, see below); tail lights red; turn signals and side markers unlit and desaturated; no amber beacons,
cones, work-zone signs or reflectors; sign sheeting white and green; headlights white; the neighbour's window warm but in the lamp
practical (`#ffd29a`, lightness above the band, as § 4); the musical notes ink, not orange.

**Title block** (frame 0 to ≈ 8.0 s): line 1 the spoken question, `How does a road do that?` (24 characters, one line; see the
flag on line 2), line 2 `NO. 005 · THE SHOULDER · 11:40 PM` (🎭 story time; owner decision 2 below).

**Framing sizes** (one fixed 3/4 angle, fov 26°, front-right; distances set on the test still). **C**, close: one focus object fills
the frame (the right-rear tire on the white line in H; one scoop on H's cut face; the near front tire on the grooves in C; the
groove group in L). **M**, medium: the shoulder band with the speed limit sign in H; the cabin in C. **MW**, medium-wide: the car and
the right carriageway in H; the whole car in C; the road and the house in L. **W**: the whole interstate in H, used twice (line 2,
the reveal; line 7, the statistic over many cars), and L's wide once (9b). Camera keys do every move: a glide into each framing
(0.7 to 0.9 s), then a push, crane, track or pull-back on the line's key word. **Subject band:** on C and M shots the subject sits
above y ≈ 1030, clear of the caption band.

## The table

| # | Words | Cue | In → out (s) | Shot | On screen | Camera motion | What moves (2–3 s rule) | Transition into next | Overlays | SFX idea | New or existing | Flag |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1a | Drift toward the edge of the highway, | `Drift toward the edge` | 0.00 → 2.40 | **C** (`tire`) | **Frame 0, H:** YOU's **right-rear tire** from behind-right, rolling just inside the **white edge line**; on the cut face in front of it, the lane's asphalt layers, the 6 in line, and the **first scoop cut across** in the shoulder; the groove ribbon receding beside the car; the tail light red at the top of the frame, the night shoulder beyond, sky under the title block | Holds (drift 0, for the loop) | From frame 0 the car rolls on (the road texture streams into depth, tread turning); the tire **drifts right** and crosses the white line at "edge" (≈ 1.0 to 1.8 s) | `continue` | Title block, captions | Steady tire and road noise from frame 0 (a bed under the music, low) | **New:** H, YOU's car whole, drift keys | Frame 0 is the action line 1 names |
| 1b | and the road itself starts yelling at you. | `and the road itself` | 2.40 → 5.14 | **C → MW** (`edge`) | The right tires on the groove row; the **scoops light orange** under them and an **impact flash** fires at each drop (shown slowed, ≈ 6 a second, so the eye can count; real rate comes in line 5); pull back to the car and the right carriageway: both right tires on the ribbon, headlights on the shoulder ahead, the **SPEED LIMIT 65** sign catching the light | Log pull-back 3.4 → 5.0 s (`log: true`) | First drop at "road" (3.1); the flashes start on "yelling" (4.1) and keep firing; the car body shivers slightly | `continue` | Title block, captions | **The rumble-strip roar** starts on the first drop (3.1), a real tire-on-grooves roar, ≈ 14 dB under the voice | Existing: `RadioPulse`, `cameraKeys` (`log`) | — |
| 2 | How does a road do that? | `How does a road` | 5.14 → 7.19 | **W** (`wide`) | The whole cut-open interstate: median, yellow line, two lanes, white line, shoulder with the lit ribbon, ditch, guardrail; the signs receding up the right verge (65, `MILE 112`, the guide sign far ahead); YOU's car small on the edge | Pull-back continues to `wide` (lands ≈ 6.2 s), then holds | The roar continues, the lit ribbon trails the car; the guide sign lights as the headlights reach it (≈ 6.5 s) | `continue`, glide to `shoulder` | Title block (fades ≈ 8.0 s, 0.8 s after the question), captions | Roar continues (ducks 3 dB under the question) | New: H signs kit | Question spoken 5.1 → 7.2 s: inside the 5–6 s window. Title text reads alone on frame 0 only weakly, see Line fixes |
| 3a | Look at the shoulder, | `Look at the shoulder` | 7.19 → 8.56 | **M** (`shoulder`) | The shoulder band on the cut face, white line to gravel, the ribbon receding, the 65 sign post at the right edge; the car has steered back into its lane up the road (the ribbon goes dark behind it) | Glide 0.8 s on "Look" | The car eases back left (the drift corrected) as the camera lands; the roar stops | `continue` | Captions (title block out as the glide lands) | The roar cuts out as the tires leave the grooves (7.4) | Existing | Sub-beat under 3 s: an event in scene 2's continuation, not its own spec scene |
| 3b | where there's a row of grooves about half an inch deep and a foot apart. | `where there's a row` | 8.56 → 13.70 | **C** (`groove`) | **One scoop cut across** on the face: its curved bottom, the milled aggregate, the ink line; behind it the next scoops recede, 12 in centre to centre | Push in 8.6 → 10.0 s, slow push after | At "half an inch deep" (11.0) a **thin ink dimension tick** draws across the scoop's depth; at "a foot apart" (12.7) a tick spans the first two scoops in depth | `slide` (to C) | Callout **½ INCH DEEP** (11.0 to 12.4, leader to the scoop bottom), then callout **1 FOOT APART** (12.6 to 13.6, leader to the second scoop) | none | New: groove geometry on H's cut face. Existing: `Callout` (needs `groove` anchors on H) | TOO LONG for one shot (6.5 s for line 3): split. The ½ in reads only at C (≈ 40 px at distance ≈ 1.2): set on the test still |
| 4a | Your tires drop into each one, | `Your tires drop` | 13.70 → 15.75 | **C** (`frontWheel`, C) | **C, slow motion:** the near front tire cut at its mid-plane (tread, belts, sidewall, rim) rolling along the **longitudinal section of the groove row**: a line of shallow dips | Slide in, then holds on the wheel | The tire **drops into a dip and climbs out**, ≈ 2 a second (slowed; the road scroll slowed to match). An orange **impact flash** at the contact patch on each drop | `continue` | Captions | One soft thump per drop, synced (slowed sound, low) | **Extend `car-slice`:** highway road block, groove profile on the cut face, `timeScale` for slow motion, tire drop | HARD TO SHOW (mild): the drop is only visible slowed down. Slow motion shown honestly by the slow road scroll; no claim about the rate until line 5 |
| 4b | and that squeezes the rubber and the air trapped underneath. | `and that squeezes` | 15.75 → 19.18 | **C** (push) | The tread and sidewall on the cut flexing into the dip; the pocket of air between the tread and the scoop bottom | Slow push 0.06/s toward the contact patch | At "squeezes" (16.4) the tread **bulges into the dip** and the sidewall flexes; at "air trapped" (18.2) the pocket **fills orange and squirts out** at the scoop's edges as a small ring (the trapped-air puff), on every drop | `continue`, pull-back to `lowWheels` | Captions | Thumps continue | New: tread squeeze, air-pocket puff (`RadioPulse` variant) | Mechanism is 🟡 (B1), drawn as described in the Oregon report; the picture claims nothing beyond the line |
| 5a | At 60 miles an hour, that's about 88 times a second, | `At 60 miles an hour` | 19.18 → 22.95 | **M** (`lowWheels`) | Both near wheels and the cabin's lower half in section; YOU's hands on the wheel at the top of the frame | Glide back 0.8 s from 19.2 | The **slow motion ramps to real speed** over 1.5 s (19.2 → 20.7): the road scroll and the drops speed up until they flicker | `continue` | **Detail box** (`dashboard`, **speed 60**, tire light off, leader to the cluster) from "At 60" (19.5) to 21.4, then **Counter** 0 → 88, unit "a second", from "88" (21.6) to ≈ 24.3 | The roar returns, rising in pitch with the ramp | Existing: `DetailBox` `dashboard` (`speed: 60`), `Counter` | DENSE (mild): two cards in 6.5 s, strictly in turn. The speedometer reads 60, the sign said 65 (owner decision) |
| 5b | so fast it blurs into one loud hum. | `so fast it blurs` | 22.95 → 25.68 | **MW** (`wide` on C) | The whole car on the shoulder in section, both near tires on the groove row | Pull-back to C's `wide` 23.0 → 24.2 s | The flashes **blur into one continuous orange band** under each near tire (motion-blurred, `SHUTTER` as the wheel slice); the car body hums (a fine shake) | `continue`, glide to `cabin` | Counter finishes, out by 24.3; captions | Full roar, steady (the real sound of a rumble strip) | New: blur mode | — |
| 6a | You feel it in the steering wheel and the seat, | `You feel it` | 25.68 → 29.11 | **M** (`cabin`) | The cut-open cabin: YOU at the wheel, the seat, the steering column, the near front wheel below | Glide 0.8 s on "You feel" | The **vibration path draws**: orange from the front tire's contact patch → the wheel hub → (an unlabelled run up through the body) → the **steering wheel** at "steering wheel" (27.4); a branch → seat rails → the **seat** at "seat" (28.8). Node dots at the hub, the wheel and the seat. YOU's hands buzz on the rim | `continue` | Name tag **YOU** (25.8 to 27.4; first clear view of YOU), then nothing | Roar continues, 3 dB lower | Existing: `OrangePath`, `Figure` (`drive`), `NameTag` (`carHeadBoxOnScreen`). New: path anchors on the car | Path drawn is 🎭 illustrative, endpoints ✅ (B5). **No label on the suspension** (owner decision) |
| 6b | which is how it warns drowsy or distracted drivers. | `which is how it warns` | 29.11 → 32.19 | **M** (slow push on YOU) | YOU in the cabin, the path lit (trace) | Slow push toward YOU | At "drowsy" (30.8) YOU's head has **nodded forward**; the buzz reaches the seat and YOU **jolts upright**, eyes on the road, hands tighten (31.3); the car eases left, the near tires leave the grooves and the band goes dark (31.8) | `slide` (to H), the `[pause]` lands on it | Captions | The roar stops as the tires leave the grooves (31.8) | New: `nod-off` and `jolt` gestures on the rig | — |
| 7 | On rural freeways, studies credit them with up to a fifth fewer cars running off the road. | `On rural freeways` | 32.19 → 38.01 | **W** (`wide` on H) | H at the wide framing, no YOU: **five grey ink tire tracks** (a drawing on the road, 🎭) drift right across the lane, one after the other, toward the shoulder | Slow crane up 0.04/s | From "studies" (33.2) the tracks draw one by one; where they cross the ribbon it flashes orange. At "a fifth" (35.6) the **fifth track bends back into the lane** at the ribbon; the other four run on into the grass (tracks only; no crash, no car) | `slide` (to L) | **Counter** 0 → 20, unit "%", sub "UP TO · FEWER RUN-OFFS" (above), from "a fifth" (35.4) to ≈ 37.9 | none (a quiet beat; music only) | New: `tracks` diagram on H. Existing: `Counter` | HARD TO SHOW (stat). The tracks show the share (≈ 1 in 5, D2 top of range); the counter says "up to". No source on screen |
| 8a | The pitch depends on your speed and the spacing... | `The pitch depends` | 38.01 → 41.10 | **MW** (`road` on L) | **L:** the two-lane desert road at night, the cut face showing **groups of grooves at different spacings**; the grey car enters from the left | Slide in, then a slow track right with the car | The car crosses the first group: each groove flashes orange as the tire hits; at "speed" (39.7) the car speeds up and the flashes quicken; at "spacing" (40.8) it reaches a **tighter group** and the flashes quicken again | `continue` | Captions | Groove tone rising in pitch with the speed, then a higher tone on the tight group | **New:** L, musical road | Generic until line 9 names the place |
| 8b | which means the right gaps can play a tune. | `which means the right gaps` | 41.10 → 44.18 | **C** (`notes`) | Close on the car's near wheel crossing groove groups; above the road, the **musical cue** begins | Push in to `notes` 41.1 → 42.0 s | Each group the tire crosses flashes orange and **a note head rises** from it into the sky; by "tune" (43.8) four notes stand in a row, a little melody | `continue` (pull-back) | **Note staff** (new overlay, ink on a paper halo, in the sky band; counts as the frame's card) from 42.0 | Four synthesised groove notes, one per group (self-made) | New: `NoteStaff` overlay | — |
| 9a | In Lancaster, California, a road was built to play the William Tell Overture, | `In Lancaster, California` | 44.18 → 48.63 | **MW → W** (`wide` on L) | The road in its setting: desert scrub, the **neighbour's house** behind the road, dark windows; the car passing over a long run of groove groups | Pull-back 44.2 → 46.0 s | The groups flash in sequence under the car; the notes on the staff run on in the overture's **gallop rhythm** (simplified, a few bars) | `continue` | Note staff continues; captions | **The tune**: a few bars of the gallop played as groove tones, slightly off-key (Rossini, public domain; self-made) | New: house on L (reuse `StreetSlice` house massing) | Lancaster named only in the voice. No map, no logo, no road name |
| 9b | but it kept neighbors up at night and got moved. | `but it kept neighbors` | 48.63 → 52.05 | **W** | The house and the road | Slow push toward the house | At "neighbors" (49.7) the **bedroom window lights** (warm lamp practical); at "got moved" (51.4) the **groove groups lift out of the road as a strip and slide away** along the road, out of frame right; the road is plain asphalt again; the window stays lit | `continue`, glide to `notes` | Note staff fades by 49.4; captions | A light-switch click at the window (49.7); the tune stops | New: window light keys, "moved" strip animation | HARD TO SHOW (mild): "got moved" drawn as the grooves sliding away. Optional fix below. TOO LONG for one shot (7.9 s for line 9): split |
| 10 | And the city says the notes are off. | `And the city says` | 52.05 → 54.79 | **C** (`notes`) | The sky band over the road, the staff back up | Glide up to `notes` | The note heads reappear; at "notes are off" (53.8) two of them **slide off their lines** (wrong pitch) and wobble | `slide` (to H), the `[pause]` lands on it | Note staff (52.2 to 54.7) | The last two notes played visibly flat | Existing pattern | Scene ≈ 2.7 s + the `[pause]` ≈ 3.2 s: fine |
| 11a | Next time your car roars on the shoulder at night, | `Next time your car` | 54.79 → 58.22 | **MW** (`edge` on H) | Back on H: YOU's car on the edge, right tires on the ribbon, the ribbon lit, impacts flashing, the 65 sign passing | Slide in, then a glide toward `tire` from 56.5 s | Flashes firing; at "roars" (56.2) the full blur band | `continue` | Captions | The roar | Existing (H) | — |
| 11b | that's the road telling you to steer back. | `that's the road telling` | 58.22 → end (≈ 61.0 + 1.0 s hold) | **C** (`tire`), **landing on frame 0's picture** | The right-rear tire on the ribbon, then off it | Glide lands on `tire` by 59.5 s; drift 0 | At "steer back" (60.3) the car **steers left**: the tire climbs off the grooves, crosses the white line back into the lane, the ribbon goes dark. On the last frame the tire sits **just inside the white line, grooves dark**: frame 0's picture | **Loop** to frame 0 | Captions end before the hold; nothing else | The roar stops as the tire leaves the grooves (60.6); tire noise only into the loop; music ends in silence on the last frame | Existing | TIMED: the tire's lateral position on the last frame must match frame 0's (it heads left at the end, right at frame 0: same picture, opposite drift) |

Scene count: 19 beats in ≈ 61 s (≈ 3.2 s each). The sub-beats under 3 s (2, 3a, 4a, 5b, 10) are events inside one scene, not
separate scenes, so `yarn check` won't flag them. As spec scenes, about **14**: H 0 → 5.1 (1), H 5.1 → 8.6 (2 + 3a), H 8.6 → 13.7 (3b),
C 13.7 → 19.2 (4), C 19.2 → 25.7 (5), C 25.7 → 29.1 (6a), C 29.1 → 32.2 (6b), H 32.2 → 38.0 (7), L 38.0 → 41.1 (8a), L 41.1 → 44.2 (8b),
L 44.2 → 48.6 (9a), L 48.6 → 52.1 (9b), L 52.1 → 54.8 (10), H 54.8 → 58.2 (11a), H 58.2 → end (11b).

Rhythm: C → MW | W | M | C | C | C | M | MW | M | M | **W** | MW | C | MW → W | W | C | MW | C. Wide shots three times (2, 7, 9b), each
where the whole place is the point; the size changes on every beat but one (6a → 6b, a slow push).

Card budget: callouts (3b, one at a time), the dashboard detail box then the counter (5a, in turn), the counter (7), the note staff
(8b to 9b, 10). The YOU name tag (6a) never shares the frame with a card. No statement cards, no full-frame screens, **no X-ray** (the
car is cut by the section; the tire is an object cut at its mid-plane, § 3).

Transitions: 4 slides (H → C at 4, C → H at 7, H → L at 8, L → H at 11), the rest `continue` with glides. No cuts.

**Motion rule:** in every scene a camera move lands within its first second, and a story event (a drop, a flash, the path, a
track, a note, the window) follows within 2 to 3 s. Check in Studio playback.

## Line fixes

No fact or required hedge changes. The hedges that stay: "about" (3, 5), "studies credit … up to" (7), "the city says" (10).

| Line | Flag | Suggestion | Mark |
|---|---|---|---|
| 2 | The title block shows the question from frame 0, and "How does a road **do that**?" doesn't read alone before line 1 has been heard (viewers see it at 0 s, the road yells at 4 s) | Change line 2 to **"How does a road make that noise?"** (the owner's original question in `sources.md`; +1 word, +0.3 s; starts at 5.1 s, ends ≈ 7.5 s). The title block then reads on its own on frame 0 | optional, owner's call |
| 3 | TOO LONG for one shot | Keep the words; two shots (3a, 3b) | none |
| 4 | HARD TO SHOW (mild) | Keep the words; slow motion carries the drop, the real rate lands in line 5 | none |
| 5 | DENSE (mild): two numbers in one sentence | Keep the words; the dashboard box takes "60", the counter takes "88", strictly in turn | none |
| 7 | HARD TO SHOW (stat) | Keep the words; the five-track drawing and the counter. Balanced option from the fact-checker exists ("roughly a tenth to a fifth"), but it's harder to draw and the ✅ "up to" stands | none |
| 9 | TOO LONG for one shot; "got moved" hard to show | Keep the words; two shots (9a, 9b). Optional, clearer to draw: "…but it kept neighbors up at night, so the city moved it." That repeats "the city" right before line 10, so I'd keep the current words | none |
| 10 | Short scene (2.7 s) | Keep; the `[pause]` before line 11 brings it to ≈ 3.2 s | none |
| 11 | "steer back" vs the loop to the drift | Keep the words; the car steers back and lands with the tire just inside the line, which is frame 0's picture | none |

## Pause and tag notes for `performance.txt`

Words unchanged; only tags and ellipses. For the voice agent; I don't edit the file.

| Line | Now | Change | Why | Mark |
|---|---|---|---|---|
| 2 | `[curious] How does…` | keep | Adds tone, not time | — |
| 7 | `[pause] On rural freeways` | keep | Lands on the slide C → H | — |
| 8 | `the spacing... which means` | keep | Gives the car time to reach the tight group before the notes rise | — |
| 9 | `[pause] In Lancaster` | keep | Lands on 9a's pull-back from the notes to the road and the house | — |
| 10 | `[amused] And the city says` | **drop `[amused]`** | Five tags across 11 sentences is over the "about 1 per 3" limit (§ 9), and `[amused]` leans toward the comic tags § 9 rules out. The line is dry enough on its own | recommended |
| 11 | `[pause] Next time … at night... that's` | keep both | `[pause]` on the slide L → H, the ellipsis on the glide down to the tire | — |

## Reuse

| Part | Where it's used | What it already does |
|---|---|---|
| `car-slice` (`CarSliceScene`) | C, lines 4 to 6 | The car cut along its near side, near wheels cut at their mid-plane, YOU driving, Night mood (`CAR.night`), scrolling road block cut on its front face, `driving` speed keys (`integrateSpeed`), framings `cabin`, `frontWheel`, `lowWheels`, `wide`, `cameraKeys`, `carHeadBoxOnScreen` (name tag), `clusterOnScreen` (detail-box leader) |
| `DetailBox` `dashboard` | 5a | The cluster as a flat crop: `speed` (set 60), trip timer, tire light off |
| `RealCar`, `RealWheel`, `tireTextures` | C, and H's whole car (variant) | Realistic body, wheels, tread, the cut tire section |
| `street-slice` / `StreetSlice` | Pattern for H; house for L | The road-into-depth layout, `through` / `beyond` handling for vehicles near the plane, `track`, named framings; neighbour house massing |
| `wheel-slice` | Pattern for 5b | Motion blur on a turning wheel (`SHUTTER`) |
| `TirePieces` (`RadioPulse`, `PULSE_LIFE`) | Impact flashes, air puff | Rings and their timing |
| `OrangePath` | 6a | The path, node dots, draw timing |
| `Figure` + `rig` | YOU in C | `drive` pose, glances; needs `nod-off` and `jolt` |
| `SectionStage`, `SectionLights`, `cutLook`, `SectionCamera` / `projectToFrame`, `keyframes.ts`, `moods.ts`, `skyTexture`, `useStudioEnv` | All three locations | The Section look, Night light, camera keys, anchors |
| `TitleBlock`, `Captions`, `Callout`, `Counter`, `NameTag`, `sfx` overlay | Overlays | As built |

## Missing: scene-builder tasks (not requested yet)

| # | Task | Size | Short spec |
|---|---|---|---|
| S1 | **`highway-slice` scene (H)** | large | Cross-section of a divided rural interstate cut square to the road, road into depth, Night. Cut face as in § The world (median, 4 ft inside shoulder, yellow left edge line, two 12 ft lanes with a broken white lane line, 6 in white right edge line, 10 ft shoulder with the groove row ≈ 6 in outside the line and ≈ 1–1¼ ft wide, gravel, ditch, W-beam guardrail), layers hatched and inked, one scoop cut across on the face (½ in deep, curved, coarse milled texture), the row receding 12 in c/c. Props: `car` (YOU's car **whole**, driving away just behind the plane; `drift` keys = lateral offset in m; `speed` keys), `grooveLit` (orange wash on the scoops under the tires), `impacts` (flash per drop, `rate` slowed or real, `blur`), `tracks` (five ink tire tracks for line 7, keyed draw times, which one bends back), framings `tire`, `edge`, `wide`, `shoulder`, `groove`, anchors for callouts (`grooveDepth`, `grooveNext`). Headlights white cones; moon key; retroreflective signs that brighten as the headlights reach them. Layout on **one test still first** (frame 0 and `wide`) |
| S2 | **Signs kit** (inside S1) | medium | R2-1 `SPEED / LIMIT / 65` 48 × 60 in, white, black legend and border; D10 `MILE / 112` green, white numerals and border; one guide sign `NEXT EXIT / 2 MILES`, white on green, no shield or route number; galvanized posts with breakaway bases; generic highway lettering (see decision 3). No rumble-strip sign |
| S3 | **`car-slice` extensions (C)** | medium | `road: 'highway'`: Night highway dressing, the front cut face along the groove row's centreline (longitudinal profile, dips 12 in c/c, ½ in deep), white edge line just behind the cut edge. `timeScale` keys (slow motion for 4, ramping to real at 5a). Tire **drop** (the cut tire follows the profile), **tread squeeze** into each dip, **air-pocket puff** (orange, at the scoop edges), impact flashes, **blur** band at real speed. `vibration` path: contact patch → hub → steering wheel, branch → seat rails → seat, node dots, keyed draw times, no suspension label. YOU gestures `nod-off`, `jolt`, hands buzzing on the rim |
| S4 | **`musical-road` scene (L)** | medium | Two-lane desert road at Night across the frame, cut along the right wheel path; groove groups at different spacings on the cut face (🎭 layout); a grey extra's car (`speed` keys) whose tire lights each group orange as it crosses; a neighbour's house behind (reuse the street slice house), bedroom `windowOn` / `windowOff` keys (lamp practical); `moved` key: the groove strip lifts and slides out along the road; framings `road`, `notes`, `wide`; anchors for the note staff (each group's top) |
| S5 | **`NoteStaff` overlay** (component, `OverlaySpec`, `Explainer.tsx`) | small | A five-line staff in ink on a paper halo, square ends, in the sky band (or anchored above L's groups); note heads appear at keyed times (rising from a 3D anchor), `detune` keys slide chosen notes off their lines with a small wobble. Counts as the frame's one card. Never orange |
| S6 | **Theme tokens** | small | A highway yellow for the left edge line (hue ≥ 45°, outside the reserved band), sign green and sign white (retroreflective), tail-light red. Values to the brand-director |
| — | Audio (tooling / voice, not the scene-builder) | small | The rumble-strip roar (a real recording or an ElevenLabs SFX: paid, ask first), soft drop thumps for the slow motion, a light-switch click, and the groove-tone tune (a few off-key bars of the gallop; a self-made synth would be free and deterministic, like `sfx:click`) |

## Frame 0 and the loop

**Frame 0** (Night, 11:40 PM): H at the `tire` framing, the fixed 3/4 angle. YOU's right-rear tire low in the frame centre
(≈ y 820), rolling, **just inside the white edge line**; in front of it on the cut face the hatched lane layers, the line's paint
layer, and the first scoop cut across in the shoulder; the groove ribbon dark, receding beside the car; the red tail light above the
tire; the night shoulder and the 65 sign's post at the right edge; sky under the title block (top y 300, one line to ≈ y 400).
Nothing orange yet. Readable: only the title block and the first caption. Drift 0 on this scene and the last.

**Last frame:** the same picture: `tire` framing, the tire just inside the white line (having steered back), grooves dark, no
flash, no card, captions gone. On replay the cut to frame 0 only adds the title block; the drift right restarts.

## Cover idea

The `edge` framing a moment after 1b: the right tires on the lit groove row, impact flashes under them, the 65 sign catching the
headlights, the cut face with the scoop profile below. Cover text: "Why the road yells at you" ("Why the road" / "yells at you").
The publisher decides.

## Decisions for the owner (recommendations)

1. **Two layouts in one video:** H runs the road into depth (signs face the camera; the car whole, seen from behind), C runs it
   across the frame (the groove profile and the cut tire). With the fixed front-right angle, readable signs and a cut through the
   groove row can't share one slice: traffic going away shows the signs square-on, but a cut along the shoulder needs the road
   across the frame, where right-side signs face away from the camera. Recommendation: both, joined by slides; H tested on one
   still first.
2. **Title line 2:** `NO. 005 · THE SHOULDER · 11:40 PM` (alternative `THE INTERSTATE`).
3. **Sign lettering:** an OFL highway-style face (e.g. Overpass, after the FHWA alphabets) added to `public/assets` with its
   licence line, or Inter 700 as a fallback. Recommendation: Overpass, for realism on the focus objects.
4. **Disclosures (🎭):** the mile number, the guide sign's legend, the five tire tracks (line 7), the slow motion (4), the vibration
   path's route (6), the groove-group layout and the tune as drawn (L). The publisher adds the "Illustrative: …" line.
5. **Line 2 wording:** "How does a road make that noise?" (optional, see Line fixes).
6. **`[amused]` on line 10:** drop it (recommended).
7. **Music:** our own generated bed from frame 0 (as No. 003 and 004); the ≈ 63 s length stands.
