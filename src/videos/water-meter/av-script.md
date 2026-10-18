# No. 004 · The Meter Box: audio + visual script

Draft by the director, 2026-10-18, before voice (playbook step 0). Inputs: `script.txt` (final, owner-approved, 12 lines,
182 words; read again at 12:29 after a same-day edit, see the next paragraph), `performance.txt`, `sources.md` (the current
12-line fact-check ruling, § 3D scene list, focus objects, the red-triangle brand note), `brand/style-guide.md` v0.11.2,
`brand/brand.md`, `docs/playbook.md` step 0, and the parts in `src/three` (`real/`, `section/`, `elevatorKit.tsx`,
`TirePieces.tsx`), `src/scenes` (the car slice, the tower) and `src/components`.

**Script version.** Confirmed by the owner (2026-10-18) as the approved script. The table follows `script.txt` as of 12:28: line 7 now reads "…twenty years, **and** each burst is so short
and so weak" (the fact-checker's fully ✅ wording, which replaces "because"). The word count is the same, so the times don't change.

**Times** are estimates at 2.92 words/s from the script words only, as in No. 003. At that rate 182 words come to **62.3 s**, not
the "about 58 s" in the brief. `performance.txt` has one `[curious]` (adds no time), three `[pause]` tags and four ellipses, about
0.4 to 0.6 s each, so the real times run about 3 s later by the end: **spoken length ≈ 65 s**. The estimated
`transcript.json` (`yarn timings`, 2.5 words/s) ends at 70.8 s. Over 60 s means our own music or none (brand.md § Structure);
No. 003's generated bed qualifies (Decision 8). Re-time against the real take before writing `spec.ts`.

**The world.** Everything is **Day**: a weekday morning on a residential street, 10:15 AM. One location, so there are no slides:

- **S, the street:** a **cross-section of a residential street** cut square to the road, through YOUR meter box. On the cut
  face, from left to right: YOUR house's front room (a **kitchen**: counter, sink, faucet, window; YOU at the sink), the front
  yard, the sidewalk, the park strip with **the meter box cut open in the ground**, the curb, and two lanes of road with the
  **water main** cut round under it. The **service pipe** runs from the main, under the curb, to the meter and on under the
  yard into the house, all on the cut face. Behind the cut, the street runs away into depth: neighbours' houses (simple,
  realistic massing), **a lid with a round cap at each neighbour's curb** (one every ≈ 15 m), **a utility pole across the road
  with a receiver** (a grey box and a whip antenna, 7 to 9 ft, D1), and **a water tank** on the skyline at the far end with
  antennas on its rim.
- **In the box** (the focus objects, realistic like a repair photo): **the meter** (bronze body, couplings, a register with a
  hinged lid, odometer digits, a sweep hand, the small **red leak triangle**), **the radio module** (grey potted box hanging
  under the lid, a black coax lead up to the antenna, a three-wire cable down to the register), **the lid antenna** (a flat round
  black cap, ≈ 4.5 in across, on a threaded stem through a 1¾ in hole in the lid; B1 note). The cut runs through the box's
  centre; the antenna hole sits just **behind** the cut, so the cap stays a whole round disc and its stem and coax drop into the
  cut-open pit.
- **The truck:** a generic white utility pickup with a service body (no logo, no light bar), a small receiver antenna on the
  cab roof, a driver (a grey extra), and a rugged laptop on a dash mount, **its screen turned to the driver** (C1 note). The
  words say "truck", so the picture is a truck, not a van (Decision 2).

**Layout to settle on a test still first** (Decision 1). The cross-section is the textbook street drawing and puts all three
focus objects on the main cut face, square to the camera. The cost is that the road runs **into depth**, so the truck drives
**away from the camera, through the section plane**. In the Section's grammar anything in front of the cut is not drawn, so
the truck **emerges from the plane already cut open**: first a section through the hood, then the cab (driver and laptop
visible in section, hatched and inked like No. 003's cars), then the bed, and then the whole truck drives on up the street past
the neighbours' lids. Frame 0 catches it mid-crossing. The alternative (road across the frame, a sideways pass) puts the box on
the slice's right end face, foreshortened to about half width at our 28° yaw, or behind the road in a notch the truck would
have to drive over. The scene-builder proposes the layout on one still before building the rest.

**Colour.** Orange is only the radio and what it sends: the radio's node dot, a short run up the coax, the **burst rings**
leaving the cap (`RadioPulse`), the **lines to the truck's roof receiver, the pole's and the tank's receivers**, their node dots,
and the line out to the utility (8b, 9). **Not orange:** the **red triangle** is red, flat, outside the reserved band
(Decision 5); the bronze meter, brass couplings and any copper pipe below 60% saturation (style guide § 1, no orange on
non-system parts), so prefer grey or black poly service pipe; no amber light bar, beacons or lit marker lamps on the truck
(unlit side markers desaturated); the road's centre line is white or a muted yellow at hue ≥ 45°, never amber; no hydrant or
traffic cones; the water stream from the faucet is a pale, neutral, translucent blue with no glow; coax and cables black or grey;
the battery cells in dark foil with invented labels; the receivers grey until a line reaches them (then only the node dot).

**Title block** (frame 0 to ≈ 8.7 s): line 1 `How does a meter talk to a moving truck?` (two lines: "How does a meter talk" / "to a
moving truck?"; the spoken "So" dropped so it reads on frame 0, as in No. 003); line 2 `NO. 004 · THE METER BOX · 10:15 AM`
(Decision 3).

**Framing sizes** (one fixed 3/4 angle, fov 26°; distances to set on the test still). **C**, close: one focus object fills
the frame (the cap, the radio, the register, YOU at the sink). **M**, medium: the whole box, or the kitchen with YOU. **MW**,
medium-wide: house to road on the cut face, with the near street behind. **W**: the whole street to the water tank, used **once**
(8), where the whole network is the point. Camera keys (`cameraKeys`) do every move: a glide into each new framing (0.7 to
0.9 s), then a push, crane, track or pull-back on the line's key word. **Subject band:** on C and M shots the subject sits above
y ≈ 1030, clear of the caption band.

## The table

| # | Words | In → out (s) | On screen and framing | What moves (2–3 s rule) | Transition into next | Overlays | New or existing | Flag |
|---|---|---|---|---|---|---|---|---|
| 1a | A truck can read your water meter | 0.00 → 2.40 | **Frame 0, C (`cap`):** the lid's round antenna cap, whole, the cut lid and the top of the cut-open pit (the radio's top, the coax dropping from the cap's stem); beside it on the road, **the truck mid-crossing the section plane**, driving away from camera: hood and front wheels beyond the cut, the **cab cut open** (driver's shoulder, the laptop's back on its mount), the bed not yet drawn. Street and sky beyond, under the title block | Truck rolling at a steady speed from frame 0 (wheels turning, the cut sliding back along it). 0.8 s ("read"): the radio's node dot lights, orange runs up the coax, a **burst ring** leaves the cap, and a line hops to the truck's roof receiver (1.0 to 1.6 s). Holds: yes | `continue` (pull-back) | Title block, captions | **New:** street slice S, lid and cap, radio module, truck with the section-plane cut. Existing: `RadioPulse`, `OrangePath`, `TitleBlock`, `Captions` | Frame 0 is the action line 1 names |
| 1b | just by driving past your house. | 2.40 → 4.45 | **C → MW:** a log pull-back (2.4 to 4.2 s, `log: true`) to `street`: YOUR house on the left (YOU at the sink, tap running), yard, sidewalk, the box, curb, road; the truck now whole, receding up the street | The pull-back; the truck passes the first neighbour's lid, which bursts to it at ≈ 3.8 s. Holds: yes | `continue` | Title block, captions | Existing: `cameraKeys` (`log`) | — |
| 2 | So how does a meter talk to a moving truck? | 4.45 → 7.88 | **MW**, slow push toward the box; the near street empty, the truck small at the far end | At "talk" (6.2) YOUR cap bursts again; the ring spreads over the empty near street, and its line reaches the truck far off at "moving truck" (7.3). Holds: yes | `continue`, glide to `box` | Title block (fades ≈ 8.7 s, 0.8 s after the question), captions | Existing | Question spoken 4.5 → 7.9 s: starts in the 5–6 s window, ends after it (mild, as No. 003) |
| 3 | Look at the meter box. | 7.88 → 9.59 | **M (`box`):** the pit cut open fills the frame: lid and cap on top, the radio under the lid, the coax up, the three-wire cable down to the register, the bronze meter on the service pipe (pipe ends cut round), gravel floor, hatched soil | Glide 0.8 s on "Look"; the meter's **sweep hand turns** (YOU's tap is running). Holds: yes | `continue` | Captions (title block out as the glide lands) | **New:** water meter (focus), pit box | — |
| 4a | There's a little battery radio in there wired to the meter, | 9.59 → 13.36 | **C (`radio`):** push in on the radio module, then down the cable | Push from 9.6 s; at "wired to the meter" (12.0) the camera **cranes down the three-wire cable** to the register (≈ 1 s, cameraKeys). Holds: yes | `continue` | Callout **RADIO**, sub "battery-powered" (11.0 to 12.9; on the module) | New: radio module (focus). Existing: `Callout` (needs an anchor on S) | TOO LONG for one shot (7.2 s for line 4): split |
| 4b | and that round cap on the lid is its antenna. | 13.36 → 16.78 | **C**, craning up the coax from the radio through the lid to the cap (cap and half the lid in frame) | Crane 13.4 → 14.6 s on the ellipsis after "meter"; the callout lands on "round cap". Holds: yes | `continue`, small pull-back | Callout **ANTENNA** (14.0 to 16.6; on the cap) | New: lid antenna (focus) | — |
| 5a | Every few seconds, most newer radios send out a short burst on their own, | 16.78 → 21.56 | **M (`box`, with air above the lid):** the box and the sky over the curb | **Bursts every ≈ 2.5 s** from "Every" (17.1, 19.6, 22.1…): node dot, a short run up the coax, a ring from the cap. Rhythm visible by the second burst. Holds: yes | `continue` | Captions | Existing: `RadioPulse`, `OrangePath` | TOO LONG for one shot (7.2 s for line 5): split. Interval shown (≈ 2.5 s) is "every few seconds", not one model's 14 s (🎭 timing, Decision 4) |
| 5b | with your reading and an ID number. | 21.56 → 23.97 | **M → MW:** pull back over the near street as the burst crosses it | At "reading" (22.3) the burst carries a small **tag riding the ring**: `READING 01462` / `ID 30514827` (🎭), Inter 700 ≥ 28 px; it rises over the street and fades by 23.8 s. Holds: yes | `continue` | Ride-along tag (in-set label, as No. 002's ID tags; not a card) | Existing pattern: car slice `ids` | — |
| 6a | The truck rolls by at normal speed | 23.97 → 26.36 | **MW (`street`)** at the box and the plane | At "truck" (24.3) the truck **emerges from the section plane**: hood, then the cab in section (driver, the laptop on its mount, screen toward him), then the bed; then it drives on at a steady road speed, wheels turning. Holds: yes | `continue` (track) | Captions | New: truck motion through the plane (`integrateSpeed`) | Truck shown at a real road speed (≈ 20 mph); the camera tracks to keep it readable (Decision 6) |
| 6b | while a computer on board matches each ID to an address. | 26.36 → 30.14 | **MW, tracking** up the street behind the truck past two neighbours' lids | Each neighbour's lid bursts as the truck passes (26.8, 28.4) and a line hops to its roof receiver; each adds a row in the detail box. Holds: yes | `continue`, glide back to `radio` (the `[pause]` lands on it) | **Detail box** (truck computer, from "computer" 27.1 to ≈ 30.0, leader to the cab): rows of ID → address filling, YOUR row first, `30514827 → 1418 Linden St` (🎭) | **New:** detail content `route` | — |
| 7a | One maker says the battery's designed to last twenty years, | 30.14 → 33.56 | **C (`radio`):** back on the radio; it **opens as an object cut-away** (§ 3; not the X-ray): the potting splits to show **two slim lithium cells**, a small board, the coax lead and the three wires | Glide 0.8 s on the `[pause]`; the cut-away opens over 0.8 s from "battery's" (31.5). Holds: yes | `continue` | **Counter** 0 → 20, unit "years", sub "DESIGNED TO LAST" (above), from "twenty" (32.9) to ≈ 35.0 | New: radio cut-away (from the `TireSensor` explode pattern). Existing: `Counter` (`subPlace: 'above'`) | — |
| 7b | and each burst is so short and so weak. | 33.56 → 36.64 | **C**, the open module | At "short" (35.3) the board's chip sends a burst: a flick of orange up the coax for **4 frames**; at "weak" (36.0) a **small ring with a short reach** that fades fast (half the reach of 5a's rings). Holds: yes | `continue`, pull-back to `wide` (the `[pause]` lands on it) | Captions | Existing: `RadioPulse` (`reach`, `weight`) | HARD TO SHOW (mild): "weak" carried by the small ring next to 5a's |
| 8a | Newer systems skip the truck, | 36.64 → 38.38 | **W (`wide`)**, the only wide shot: the whole street receding up the frame, houses, lids at every curb, the pole across the road, the water tank on the skyline; no truck | The module closes as the camera **cranes up and back** (≈ 1.2 s). Holds: yes | `continue` | Captions | **New:** pole receiver, water-tank receiver, neighbours' houses | — |
| 8b | and many send hourly readings to receivers on poles or water tanks. | 38.38 → 42.47 | **W**, slow push | On the ellipsis after "truck" every lid bursts; on "receivers on poles" (40.4) the near lids' lines run to the pole's receiver, on "water tanks" (41.8) the far lids' to the tank's | `continue`, glide to `kitchen` | Callout **RECEIVER**, sub "hourly readings" (40.4 to 42.3; on the pole box) | Existing: `OrangePath`, `Callout` | — |
| 9 | That lets many utilities flag a possible leak. | 42.47 → 45.21 | **M (`kitchen`):** YOU at the sink in the cut-open front room, the tap running, the phone in one hand | From the pole a line runs along the ground's cut face out of frame (to the utility) as the camera glides (42.5 to 43.3). At "flag" (43.8) the phone lights **(screen toward YOU)** and YOU lifts it (`lift-phone`). Holds: yes | `continue` | Name tag **YOU** (42.6 to 44.2), then **detail box** (phone, `notification`: "Possible leak" 🎭) from "possible" (44.5) | **New:** kitchen (sink, faucet, stream). Existing: `Figure` (`stance: 'stand'`, `phoneModel: 'real'`), `NameTag` (needs a head anchor on S), `DetailBox` `notification` | HARD TO SHOW (mild): the flag happens at the utility; the notification makes it concrete (EPA "notifications of a potential leak") |
| 10 | Your utility's website might show you your own use hour by hour. | 45.21 → 49.32 | **C:** push in on YOU and the phone | The detail box turns to the **usage page** (45.6); 24 hourly bars draw left to right on "hour by hour" (48.3); the overnight bars never reach zero (🎭). YOU's thumb scrolls. Holds: yes | `continue` | Detail box (phone, `usage`), out at ≈ 49.6 | **New:** screen-kit app `usage` | — |
| 11a | Turn off every tap, | 49.32 → 50.67 | **M**, YOU at the sink | YOU's hand goes to the faucet handle and turns it; the stream stops at "tap" (50.3). Holds: yes | `continue` (glide down) | Captions | Existing: `hands` IK (the No. 003 press timing) | — |
| 11b | and if you can see your meter... | 50.67 → 53.07 | **M → C:** the camera **follows the service pipe** down from the kitchen wall, under the yard, to the box | Glide 1.4 s along the grey pipe (cameraKeys, two keys), landing on the register as the ellipsis ends. Holds: yes | `continue` | Captions | Existing: `cameraKeys` | RUSHED (mild) without the ellipsis (kept) |
| 11c | a red triangle that's still turning may mean a leak. | 53.07 → 56.51 | **C (`register`):** the meter's register in the cut pit, YOU's tap off | The sweep hand is **still**; the detail box opens on "red triangle" (53.4) with the **register seen from above**: digits, the sweep hand at rest, the **red triangle still turning** slowly. Holds: yes | `continue`, crane up (the `[pause]` lands on it) | **Detail box** (`register`, 53.4 to ≈ 56.3; leader to the register) | **New:** detail content `register` | Red, never orange (Decision 5) |
| 12a | And if there's a round cap on your meter box lid, | 56.51 → 59.92 | **C → C:** crane up from the register past the radio to **frame 0's `cap` framing**, landing by "cap" (58.2) | The crane (56.6 to 58.2); the cap holds as the line names it. Holds: yes | `continue` | Captions | Existing | — |
| 12b | that's what's been doing the talking. | 59.92 → end (≈ 62.3 + 1.0 s hold) | **C (`cap`), landing on frame 0's picture** | The truck **emerges from the plane** again (hood at ≈ 60.3), rolling to its frame-0 position; one burst leaves the cap on "doing" (61.3); its ring and line are gone by ≈ 62.2. On the last frame the truck is exactly where it was at frame 0, still rolling | **Loop** to frame 0 | Captions end before the hold; nothing else | Existing | TIMED: the truck's distance must match frame 0 on the last frame |

Scene count: 23 beats in ≈ 62 s (≈ 2.7 s each). The sub-beats under 3 s (1a, 1b, 3, 5b, 6a, 8a, 9, 11a, 11b) are events
inside one scene (a pull-back, a burst, a tag, a glide), not separate scenes, so `yarn check` won't flag them. As spec scenes:
about 14.

Rhythm: C → MW | MW | M | C | C | M → MW | MW (track) | MW (track) | C | C | **W** | W | M | C | M | M → C | C | C → C. The
wide shot is used once (8), where the whole network is the point, and the size changes every scene or two.

Card budget: callouts (4a, 4b, 8b), the truck detail box (6b), the counter (7a), the phone detail box (9 to 10) and the
register detail box (11c) never overlap. The name tag (9) leaves before the phone box enters. No statement cards and no
full-frame screens. **The X-ray is not used** (the pit is cut by the section; the radio is an object cut-away, § 3).
Transitions: no slides and no cuts, all `continue` with camera keys (one location). Screens: the laptop faces the driver and the
phone faces YOU; both are read only in the detail box.

**Motion rule:** in every scene a camera move lands within its first second, and a story event (a burst, a line, the truck, a
callout, a box, a hand on the tap) follows within 2 to 3 s. Check this in Studio playback.

## Line fixes

No fact or required hedge changes. The hedges that stay as they are: "can" (1), "most newer radios" (5), "One maker says",
"designed to" (7), "many send" (8), "many utilities", "possible" (9), "might" (10), "if you can see", "may mean" (11), "if
there's" (12).

| Line | Flag | Suggestion | Mark |
|---|---|---|---|
| 2 | Question ends at ≈ 7.9 s (mild) | Keep the words; it starts at 4.5 s, inside the window. The title block has shown it since frame 0 | none |
| 4 | TOO LONG for one shot | Keep the words; two shots (4a, 4b), the existing ellipsis carries the crane | none |
| 5 | TOO LONG for one shot | Keep the words; two shots (5a, 5b); optional ellipsis below | none |
| 6 | TOO LONG (mild) | Keep the words; one tracking shot in two halves (6a, 6b) | none |
| 7 | HARD TO SHOW (mild) | Keep the words; the cut-away and the counter carry "twenty years", the small ring carries "short and weak" | none |
| 9 | HARD TO SHOW (mild) | Keep the words; the phone's "Possible leak" notification makes the flag concrete | none |
| 11 | Three actions in 7.2 s | Keep the words; three sub-beats, the existing ellipsis carries the glide along the pipe | none |

No line needs a wording change. Every flag is fixed by a split, a pause or the picture.

## Pause and tag fixes for `performance.txt`

Words unchanged; only tags and ellipses.

| Line | Now | Change | Why | Mark |
|---|---|---|---|---|
| 2 | `[curious] So how does…` | keep | Adds tone, not time; the question still starts at ≈ 4.5 s | — |
| 4 | `wired to the meter... and that round cap` | keep | Lands on the crane from the register up the coax to the cap | — |
| 5 | `a short burst on their own, with your reading` | `a short burst on their own... with your reading` | Gives the pull-back its beat, so the ID tag enters on "reading" | optional |
| 7 | `[pause] One maker says` | keep | Lands on the glide from the street back to the radio | — |
| 8 | `[pause] Newer systems skip the truck... and many` | keep both | `[pause]` on the pull-back to the wide shot, the ellipsis on every lid bursting at once | — |
| 9 / 10 | (no tag) | keep | The glide into the kitchen fits "That lets"; the phone box runs straight through | — |
| 11 | `if you can see your meter... a red triangle` | keep | Lands on the glide down the service pipe to the register | — |
| 12 | `[pause] And if there's… lid... that's` | keep both | `[pause]` on the crane up from the register, the ellipsis on the truck emerging for the loop | — |

Tag count: four audio tags (`[curious]` and three `[pause]`) across 12 sentences, about 1 per 3, at the § 9 limit. Add none.
The optional ellipsis on line 5 is not a tag.

## New 3D pieces

| Piece | Size | What it needs | Reuse |
|---|---|---|---|
| **S, the street slice** | large | The cross-section above: kitchen front room (cut walls, window, counter, sink), yard, sidewalk, park strip, curb, two-lane road with the main cut round, the service pipe on the cut face, hatched soil and gravel, asphalt and base layers on the cut. Behind the cut: the street in depth with 4 to 6 neighbours' houses (simple, realistic, no brand), a lid with a cap at each curb, the pole and the tank. Props: `bursts` (per lid, keyed times), `lines` (to `truck`, `pole`, `tank`, `out`), `truck` (speed keys, `integrateSpeed`), `tap` (on/off time), YOU's gestures and phone script, framings `cap`, `box`, `radio`, `register`, `street`, `wide`, `kitchen`, `cameraKeys`. Layout on a test still first (Decision 1) | `SectionStage`, `SectionLights`, `cutLook` (`cutMaterial`, `CutOutline`, `InkLine`), `SectionCamera` / `projectToFrame`, `keyframes.ts` (`CameraKey`, `keyed`, `integrateSpeed`), `useStudioEnv`, `REAL` tokens, the car slice's and tower's scene structure |
| **Water meter** (focus) | medium | Bronze body with couplings and nuts (below 60% saturation), the register with a hinged lid (open), odometer digits, a sweep hand (turns while a tap runs, `flow` keys), the **red leak triangle** (spin speed keyed). Cut by the section only through the pit, not the meter itself (the meter is whole, seen in the open pit) | `RealWheel` / `TireSensor` material setup, `phoneTextures` for the dial face |
| **Radio module** (focus) | medium | Grey potted box under the lid, invented label (e.g. "RF-ENDPOINT 2", no maker's look), cable glands, black coax up to the antenna stem, black three-wire cable to the register. **Object cut-away:** the potting splits to show two slim lithium cells (dark foil, invented label), a small dark-green board with an invented chip legend, the leads. A node dot on the board (the system) | `TireSensor` (`explode`, `highlight`, node `dot`), `phoneTextures` (`boardTexture`, `chipTexture`, `batteryTexture`) |
| **Lid and antenna** (focus) | small | A composite or cast lid with pick holes, a generic embossed "WATER METER" (no utility or maker name), cut in the section look; the flat round black cap ≈ 4.5 in on a threaded stem through a 1¾ in hole, just behind the cut | `cutLook`, `roundedSlab` (`real/shapes.ts`) |
| **Utility truck** | large | Generic white pickup with a service body, no logo, no light bar, unlit desaturated markers; roof receiver antenna; driver (a grey extra, `drive` pose); rugged laptop on a dash mount, screen toward the driver. **Clipped at the section plane with hatched, inked caps** while it crosses (frame 0, 6a, 12b) | `RealCar` (body section approach, materials, wheels), `Figure` (`drive`), `RealWheel` |
| **Receivers** | small | A wooden pole (low saturation) with a grey collector box and a 7 to 9 ft whip antenna; a water tank (pale steel, legs or a pedestal) with small antennas on its rim. Node dots appear when lines arrive | `RealLab` materials (`RealWallDevice`) |
| **Kitchen** (in S) | medium | Counter, sink, a generic faucet with a lever handle, a water stream (pale translucent neutral, on/off with a 6-frame taper), window to the street; YOU standing at it | `RealLivingRoom` / `LivingRoomSlice` materials, `Figure` (`stance: 'stand'`, `hands`, `point`, `phoneModel: 'real'`), the tower's `handAt` press timing for the handle |
| **Bursts and lines** | small | Burst = node dot on the radio, a 0.3 s orange run up the coax, a `RadioPulse` ring from the cap; lines from a cap to the moving roof receiver (re-aimed each frame), to the pole and the tank; the line out along the ground's cut face to the frame edge. A ride-along tag (`READING` / `ID`, ink on a paper halo) | `RadioPulse`, `PULSE_LIFE`, `OrangePath`, the car slice's `pulses` and `ids` |
| **Detail contents** | small (×3) | `route` (truck computer: a generic light rugged-laptop UI, rows `ID → address` appearing one per burst, YOUR row emphasised in `ink`, 🎭); `usage` (screen-kit app: Day UI, 24 hourly bars, an overnight floor above zero, 🎭); `register` (the dial from above: digits, sweep hand, red triangle, its spin keyed). Text ≥ 28 px, generic | `DetailBox` (content modes, like `keypad`), `screenKit` (`notification` exists), `drawKeypad` as the pattern |
| **Anchors on S** | small | Callout, name tag and detail-box anchors: `cap`, `radio`, `register`, `pole`, `truckCab`, `phone`, YOU's head | `anchorOnScreen`, `carHeadBoxOnScreen` pattern |
| **Theme token** | small | A red for the leak triangle (Decision 5), in `REAL` | `theme.ts` |

Already there: `TitleBlock`, `Captions`, `NameTag`, `Callout`, `Counter`, `DetailBox` (frame, `notification`), `Figure` (YOU,
extras; `stand`, `drive`, `lift-phone`, `hands`, `point`), `OrangePath`, `RadioPulse`, `cameraKeys` (incl. `log`), `continue`
and glides.

## Frame 0 and the loop

**Frame 0** (Day, 10:15 AM): S at the `cap` framing, the fixed 3/4 angle. The lid's round black antenna cap sits low in the frame
centre (≈ y 820), whole, on the cut lid, with the coax and the top of the radio visible in the cut pit just below it (above the
caption band, ≈ y 1030). To the right, on the road, the truck is **mid-crossing the section plane**: hood and front wheels beyond
the cut, the cab cut open in hatched section (the driver's shoulder, the laptop's back on its mount), the bed not drawn. Beyond:
the park strip and the street receding, a neighbour's lid, houses, sky under the title block (top y 300, two lines to
≈ y 440). Nothing lit but the radio's node dot at rest (off), no ring, no line. Readable: only the title block and the first
caption. Camera drift 0 on this scene and the last, so the loop matches.

**Last frame:** the same picture. `cap` framing, same angle, the truck at the same distance through the plane (still rolling),
no ring or line on screen, YOU's tap off (not in frame), no callout or box, captions already gone. On replay the cut to frame 0
only adds the title block (the burst comes at 0.8 s).

## Cover idea

Frame 0's picture a moment later: the cap with one orange ring leaving it, its line reaching the cut-open truck's roof receiver,
the radio and the top of the meter showing in the cut pit below. Cover text: "Who's reading your meter?" ("Who's reading" / "your
meter?"). The publisher decides.

## Decisions (owner, 2026-10-18; all eight recommendations accepted)

The owner also confirmed the 12:28 line 7 as the approved script: "One maker says the battery's designed to last twenty years,
and each burst is so short and so weak."

1. **Street layout:** the cross-section, with the truck cut by the plane, is tested on one still before the rest of S is built.
2. **The truck:** a white utility pickup with a service body (no logo, no light bar).
3. **Title line 2:** `NO. 004 · THE METER BOX · 10:15 AM`.
4. **Disclosures (🎭):** the ID and reading digits, the addresses on the truck computer, the "Possible leak" notification text,
   the hourly bars, and the burst timing as drawn. The publisher adds the "Illustrative: …" line.
5. **Leak triangle:** a new red `REAL` token outside the reserved band; the brand-director sets the value.
6. **Truck speed:** a real road speed (≈ 20 mph), with the camera tracking it.
7. **Leak notification (9):** kept; the fact-checker glances at the 🎭 text.
8. **Music:** our own generated bed (as No. 003), present from frame 0; the ≈ 65 s length stands.
