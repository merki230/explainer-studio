# No. 018 · Home heat: audio + visual script (draft 2, 2026-11-11, re-timed to the real voice take)

Words: `script.txt` **v11** (16 lines, 269 words, owner-approved). Times are **real**, read from `transcript.json` (the
recorded take, `audio/voiceover.mp3`): voice 0.13 → 88.56 s (≈ 3.04 words/s, a little faster than the 2.97 projected), plus
a **1.5 s tail** (`spec.tail: 1.5`) for the loop glide, comes to **90.06 s = 2702 frames** (last frame 2701 = 90.03 s).
Times are video seconds; a cue's time is its first word's start (scene 1 starts at 0).

**Changes since draft 1** (marked **Δ** below): every time moved to the take; no line, scene, cue or part changed. Four
events moved to a different word because the take bunches words together: scene 10's in-scene glide (`test house` →
`Canadian`, so the counter isn't born mid-glide), scene 12's shut-off (`them` → `most`, since "them shut off" now lasts
0.36 s), scene 14's order (feed first, then glow, both after the glide) and scene 5's new event on "30-degree" (fills a
1.8 s hole). Three glides are shorter (scenes 6, 7, 14). See **Pacing on the real take** below.

## Decisions applied

| Flag | Now |
|---|---|
| F1 title | **Owner: A.** `How can the air outside hold` / `any heat when it's 30 degrees?` |

## The system in one line

**Orange = heat: where it comes from and where it goes.** Following No. 017's rule (§ 5 One system per video, "energy that
becomes the system"), the energy **spent on making or moving heat** is orange **from its source**: the outlet → cord →
space heater; the electric meter → disconnect → compressor; the panel → backup strips. Then the heat itself: the faint
heat held in the night air; the heat leaving through the window (scene 3 only); the wisps pulled into the outdoor coil;
the gas line after the boil and the hot gas line after the compressor; the indoor coil and the warm air at the register;
the space heater's element and its warm air; the strips' glow; the EV's pack → heater feed and its heat pump's wisps.
**Widths carry the units, true to scale:** one unit of energy in is one line width **w** in every system. Space heater:
w in, w out. Heat pump: the feed is always w; wisps from outside + w = the indoor width. At 40°F: 2 w of wisps, 3 w
indoors. At −6°F: 0.5 w + w = 1.5 w. At 30°F (frame 0 to scene 9, no number in the voice): **2.5 w** (F5). Backup
strips: w in, w out.
**Not orange:** the cold (neutral `WINTER.snowShade`), the refrigerant itself (liquid `CHARGE.coolant`, streaks
`coolantFlow`, vapour streaks in the same family; the heat rides on the line as its own path, § 5 "along a cable or hose"),
copper (`REAL.copper`), duct metal, the pilot lamp (`warning`), every thermometer, gauge and card (ink), the cold liquid line
after the expansion valve, the EV's stored charge.

## The look in one paragraph

**One US house on one cold night**, cut open front to back like a sheet in a drawing set. Night mood, 🎭 9:40 PM, snow
on the ground, the roof and the outdoor unit's pad, a light snowfall. The section is tall, so it suits 9:16. From the top
down: the gable roof; the living room (YOU on the couch with a phone, a floor lamp lit, a small space heater by the couch,
a supply register in the floor, a window in the **left** side wall, a small ink thermometer on the wall); the basement (an
**air handler**: indoor A-coil, blower, a bank of backup strips in the supply plenum, the trunk rising to the register, the
electrical panel on the wall); the cut ground. On the **right**, beside the house: the **outdoor unit** on its pad, the line
set going through the wall to the basement, the disconnect box and the electric meter on the wall, and the **air
thermometer** on a post (magnified, readable at the wide framing). Past the unit: the **driveway** with YOU's EV crossover,
cut along its length (N6). The house is **all-electric**. Its heat pump and the space heater run **one at a time** (🎭).

**On-screen words** (all ink): the title block; one name tag `YOU`; callout `HEAT PUMP` / `Outdoor coil`; three rows
counters (`ELECTRICITY IN` / `HEAT OUT`: 1 / 1 sub `UNITS`; 1 / 3 sub `ABOUT · 40°F`; 1.0 / 1.5 sub `−6°F`); callout
`SHUT-OFF` / `Newer: 5°F to −13°F`. No maker, agency, "Canada", COP, %, kWh, price, refrigerant name or source text.
Thermometers carry no digits (§ 3 In-set ink gauge).

## Location

| Code | Location | Built with |
|---|---|---|
| **H** | The house, cut open, winter night: roof, living room, basement, cut ground; the outdoor unit and the yard; the driveway with YOU's EV | **New scene `house-slice` (N1)** + N2 to N10. Reuses `RealLivingRoom` / `LivingRoomSlice` furniture, `Figure`, `SpaceHeater`, `HeatKit` (`HeatFlow`, `HeatWisps`, `wispStates`, the `intakeWisps` pattern, `InkGauge`, `HvacBox`, `HeatPump`), `Snow`, `SlicedCar`, the `townParts` cut-block and gable-roof approach, `HomeGarage`'s meter dial |

**One location for the whole video.** Every change of framing is a glide (§ 8). There are no slides or cuts, and no
location from No. 016 or No. 017 comes back (§ 3 Re-dressing). The EV is a recurring car, not a location; its framing is
new. The variety comes from **object cut-aways** (the outdoor unit, its coil and compressor, the space heater, the air
handler, the car's nose), reached by glides (§ 3 Object cut-aways).

## Title block

**A (owner decision):** line 3 as spoken: **`How can the air outside hold`** / **`any heat when it's 30 degrees?`** (28 / 30
characters, ≤ 32). Line 2: `NO. 018 · THE HOUSE · 9:40 PM`. Up from frame 0, fades at **13.44 s** (0.8 s after
"…30 degrees?" ends at 12.64), over 10 frames (gone by 13.77). Δ was 13.27.

## Line by line

Cues are copied word for word from `script.txt`; all 16 resolve uniquely and in order against the real transcript. Line 2
(3 words) is merged with line 3 into scene 2. Line 14 is split into scenes 13 and 14 at `and backup heat, if`. "In-scene
glide" means a `cameraKeys` glide (No. 017) inside one spec scene; its cue word and start time are given.

| Sc | Cue · in (s) · len | Line | What's on screen | Motion / events (s, on the word) | Overlay | Transition in |
|---|---|---|---|---|---|---|
| 1 | `A heat pump puts` · 0.00 · 7.16 | A heat pump puts more heat into your house than the electricity it uses, **because the extra heat was already outside.** | **Frame 0, H `house`**: the whole section, sky band on top for the title. **The heat pump is already running.** A thin orange line (w) runs meter → disconnect → outdoor unit. Faint wisps converge from the night air into its coil. A fat flow (2.5 w) rides the line set through the wall to the air handler. Halo-only wisps rise from the living-room register and stop short of YOU (§ 5). YOU is on the couch scrolling (phone toward YOU). Air thermometer low (30°F). Snow is falling. **In-scene glide** to `yard` at `because` (4.32) | 0.0 slow push from D0 · 0.48 "pump" outdoor fan turning, dots on the line set · 1.52 "heat" register wisps swell · 2.24 "house" YOU glances at the register · 2.88 "electricity" the thin feed pulses once (it stays thin) · 4.32 glide (0.8 s) to `yard`: the unit, the house wall, the line set entering it, the air thermometer · 4.72 "extra heat" wisps out of the air thicken and pour into the coil · 5.72 "already outside" a gust carries snow through them | **Title block** 0 → 13.44 | — (frame 0) |
| 2 | `That sounds impossible.` · 7.16 · 5.56 | That sounds impossible. How can the air outside hold any heat when it's 30 degrees? | H, glide to `room` (YOU on the couch, the space heater dark by its arm, the register wisps, the left window); **in-scene glide** to `yard` at `hold any heat` (10.16) | 7.16 glide (0.7 s) · 7.9 tag in · 8.2 (inside the drawn-out "impossible…", 7.52–8.80) YOU lowers the phone and looks at the register wisps · 8.88 "How can" YOU turns toward the outside (head to camera-right, toward the yard) · 9.36 "air outside" snow thickens past the window · 10.16 glide (0.8 s) to `yard` · 10.72 "heat" a gust rocks the fan's grille shadow · 11.40 "30 degrees" the air thermometer's fill **settles at 30** with a small ink tick | **Tag** `YOU` 7.9 → 10.0 (F11) · title block | glide |
| 3 | `Even 30-degree air holds` · 12.72 · 5.76 | Even 30-degree air holds heat, **and heat always flows from warmer to colder.** | H, glide (0.6 s) closer to `air` (the unit, the open air beside it, the thermometer); **in-scene glide** across the house to `window` (the left side wall's window from inside and out: lamp-lit room, dark snowy air beyond) at `and heat always` (15.12) | 12.72 glide · 13.44 title starts fading · 14.08 "holds heat" **faint, still wisps appear all through the open air** (zero drift, halo-only, ≈ 10 %: the air's heat, not moving yet) · 15.12 glide (0.8 s, truck left across the section) · 16.16 "flows" warm wisps in the room drift to the window · 16.80 "warmer" they pass **out through the glass** into the night (F6) · 17.44 "colder" they fade into the cold air; a snowflake melts on the pane | — | glide |
| 4 | `That's why the heat` · 18.48 · 6.88 | That's why the heat pump keeps a liquid in its outdoor coil colder than the air, **usually by 10 to 20 degrees.** | H, glide to `coil` (the outdoor unit cut open: top fan, wraparound coil cut through its tubes, compressor dome, expansion valve) with **two ink thermometers**: the air one on its post, a coil one clipped on the cut tubes; **in-scene glide** to `gauges` (both thermometers side by side, the cut tubes behind) at `colder than the` (21.52) | 18.48 glide (0.9 s, truck right) · 19.2 "pump" callout in; fan blades overhead · 20.00 "liquid" cold liquid leaves the expansion valve and runs into the cut tubes, its streaks moving · 20.56 "outdoor coil" the coil thermometer draws on (ink, 0.4 s) · 21.52 glide (0.6 s) · 21.6 "colder" the coil's fill **sinks below** the air's, settling on "air" (22.24) · 22.88 "usually" an ink bracket draws between the two fill lines · 23.60 / 24.00 "10 to 20" the bracket ticks at each end · 24.16 → 25.28 "degrees…" (drawn out) the bracket holds | **Callout** `HEAT PUMP` / `Outdoor coil` on the coil, 19.2 → 21.4 | glide |
| 5 | `To that liquid, 30-degree` · 25.36 · 6.64 | To that liquid, 30-degree air is warm, so heat flows in **and the liquid boils into a gas.** | H, glide to `fins` (the coil face and two cut tubes, the coil thermometer at the edge); **in-scene glide** closer to `tubes` (the cut tubes and the suction line leaving them) at `and the liquid` (29.44) | 25.36 glide (0.6 s) · 25.68 "liquid" the cold liquid's streaks in the tubes · Δ 26.36 "30-degree air" the still air wisps by the fins brighten (≈ 10 % → 15 %) · 27.52 "warm" they start to **drift toward the fins** · 28.40 "heat flows in" they converge and vanish into the fins (the mirror of scene 3's window) · 29.44 glide (0.5 s) · 30.08 "boils" bubbles rise in the cut tubes, then vapour streaks · 30.88 "gas" an orange line (1.5 w) rides out along the suction line toward the compressor | — | glide |
| 6 | `Then a compressor squeezes` · 32.00 · 3.52 | Then a compressor squeezes the gas, which heats it up. | H, glide to `compressor` (the cut dome, the suction line in, the hot gas line out, the disconnect's thin feed in) with a third thermometer clipped on the hot gas line | 32.00 glide (Δ 0.5 s) · 32.32 "compressor" the scroll inside orbits; the feed (w) pulses in · 33.00 "squeezes" the suction line and the feed **merge into one 2.5 w line** on the hot side · 33.80 "gas" the hot-line thermometer draws on · 34.36 "heats it up" its fill climbs high, well above the air's | — | glide |
| 7 | `Now the gas is` · 35.52 · 3.97 | Now the gas is hotter than your living room, so it can heat the house. | H, glide following the hot line through the wall and down to `indoor` (the air handler cut open, the A-coil, the trunk, the register and the living-room floor; the hot-line thermometer moved to the line's indoor end, the **room thermometer** on the living-room wall in frame) | 35.52 glide (Δ 0.7 s, along the line set) · 36.40 "hotter" both thermometers in frame: the line's fill sits **above** the room's · 37.16 "living room" the room thermometer ticks · 37.76 "so" the A-coil takes the glow, the blower spins · 38.32 "heat" warm air rises up the trunk · 39.00 "house" (after a 0.44 s pause) register wisps up in the room, stopping short of YOU's feet | — | glide |
| 8 | `The electricity runs the` · 39.49 · 4.70 | The electricity runs the compressor, **and the rest of the heat comes in from outside.** | H, glide to `feed` (the meter and disconnect on the wall, the thin feed to the compressor, the unit's side); **in-scene glide** out to `yard` (unit, wisps, line set and wall in one frame) at `and the rest` (41.44) | 39.49 glide (0.7 s) · 39.76 "electricity" a dot runs meter → disconnect → compressor along the thin line (w) · 40.84 "compressor" the scroll orbits behind the cut · 41.44 glide (0.8 s) · 42.16 "heat" the intake wisps pulse (1.5 w) · 42.52 "comes in" both lines visibly **add up** at the compressor: w + 1.5 w = the 2.5 w line set · 42.96 (0.56 s pause) the summed flow surges along the line set into the wall · 43.52 "outside" a gust carries snow through the wisps | — | glide |
| 9 | `A space heater brings` · 44.19 · 6.42 | A space heater brings nothing in, **so it makes all its heat, one unit for each unit of electricity.** | H, glide to `room`; **in-scene glide** to `heater` (the heater cut open: element, fan, grille, the cord and the outlet) at `so it makes` (46.24) | 44.19 glide (0.7 s); **the heat pump goes quiet**: register wisps thin out and stop (F14) · 44.64 "heater" YOU leans over and switches it on: pilot lamp `warning`, fan spins up · 45.28 "nothing in" the window stays dark and still; no wisps come in anywhere · 46.24 glide (0.7 s) · 46.64 "makes" the element takes the **§ 5 "made by" glow** (never red-hot); **orange draws from the outlet along the cord** (w, riding on the black cord) · 47.0 counter in · 47.48 "heat" warm wisps leave the grille, as wide as the cord's line · 48.08 "unit" HEAT OUT lands 1 · 49.52 "electricity" ELECTRICITY IN lands 1; a dot runs outlet → element | **Counter (rows)** `ELECTRICITY IN` 1 / `HEAT OUT` 1, sub `UNITS`, 47.0 → 50.2; HEAT stops 48.08, ELECTRICITY 49.52 (F12) | glide |
| 10 | `At a mild 40` · 50.61 · 7.39 | At a mild 40 degrees, one Canadian government test house got about three units of heat for each unit of electricity. | H, glide to `yard` (the unit and the air thermometer); **in-scene glide** out to `house` at Δ `Canadian` (52.80) | 50.61 glide (0.8 s); the heater's lamp goes dark, its glow fades 0.5 s · 50.84 "mild" snowfall eases · 51.28 "40 degrees" the air thermometer's fill **rises** above its 30 mark · Δ 51.9 "degrees" the fan restarts · Δ 52.40 "one" wisps return at 2 w · Δ 52.80 glide (0.9 s) · 53.9 counter in · 54.64 "three" HEAT OUT lands 3; the line set swells to 3 w, beside the w feed, both in frame · 55.44 "heat" register wisps up; YOU puts the phone down, sits back · 56.88 "electricity" ELECTRICITY IN lands 1; feed dot | **Counter (rows)** `ELECTRICITY IN` 1 / `HEAT OUT` 3, sub `ABOUT · 40°F`, 53.9 → 57.6; HEAT stops 54.64, ELECTRICITY 56.88 (F12) | glide |
| 11 | `At 6 below zero` · 58.00 · 5.39 | At 6 below zero, the same house got one and a half, **which still beats a space heater.** | H, glide to `loopWide` (the unit, the line set, the air handler, the register in one frame); **in-scene glide** to `room` at `which still beats` (61.44) | 58.00 glide (0.8 s); a heavy gust, the snow thickens · 58.44 "below zero" the air thermometer **falls low** · 58.9 the wisps thin to a trickle (2 w → 0.5 w) and the line set narrows (3 w → 1.5 w) · 59.4 counter in · 60.96 "half" (after a 0.32 s pause, which the count-up fills) HEAT OUT lands 1.5; register wisps narrower, still flowing · 61.2 ELECTRICITY IN lands 1.0 · 61.44 glide (0.7 s, under the counter, F15) · 62.24 "space heater" YOU glances at the dark heater by the couch | **Counter (rows)** `ELECTRICITY IN` 1.0 / `HEAT OUT` 1.5, decimals 1, sub `−6°F`, 59.4 → 62.9 | glide |
| 12 | `As it gets colder,` · 63.39 · 5.97 | As it gets colder, heat pumps pull less and less heat out of the air, **until most of them shut off.** | H, glide to `loopWide`; **in-scene glide** to `yard` (the unit close, the thermometer) at `until` (67.36) | 63.39 glide (0.8 s) · 63.92 "colder" the air thermometer falls **below the −6 level** · 65.20 "pull" the wisps thin again (0.5 w → 0.2 w), the line set narrows (1.5 w → 1.2 w) · 66.12 "less" register wisps weaker; in the room, YOU pulls a blanket over (if in frame) · 66.96 "air" only a few wisps still reach the coil · 67.36 glide (0.7 s) · Δ 67.80 "most" `cutoff.at`: the fan **winds down** (1.0 s) · 68.48 "off" the wisps stop, the line set's flow fades from the unit end toward the house, the feed fades · 68.8 the fan and the compressor scroll stop (F8) | — | glide |
| 13 | `On newer heat pumps,` · 69.36 · 5.44 | On newer heat pumps, that can happen somewhere between 5 above and 13 below zero, | H, glide to `thermo` (the magnified air thermometer large, the stopped unit beside it, snow settling on its grille) | 69.36 glide (0.7 s) · 69.88 "heat pumps" snow begins to settle on the still fan grille · 70.88 "happen" the fill ticks down once more · 71.4 callout in · 71.60 "between" an **ink band** draws on the tube between the 5°F and −13°F marks (no digits) · 72.20 "5 above" the band's top end ticks · 73.16 "13 below" the bottom end ticks; the fill sits inside the band | **Callout** `SHUT-OFF` / `Newer: 5°F to −13°F` on the band, 71.4 → 74.6 (F10) | glide |
| 14 | `and backup heat, if` · 74.80 · 3.28 | and backup heat, if there is any, takes over. | H, glide down to `basement` (the air handler cut open, the strip bank in the plenum, the panel on the wall, the trunk to the register above) | 74.80 glide (Δ 0.6 s, crane down) · Δ 75.44 "heat" **orange draws from the panel along the cable** to the strips (w, riding on the cable, 0.3 s) · Δ 75.76 "if there" the strips take the **made-by glow** (never red-hot) · 76.16 "any" the blower spins · 76.56 "takes over" warm air rises up the trunk; register wisps come back upstairs (w, top of frame) by 77.2 (F9) | — | glide |
| 15 | `Electric cars heat the` · 78.08 · 7.20 | Electric cars heat the cabin one of the same two ways, **with a plain heater that makes heat or a heat pump that moves it.** | H, glide (truck, 1.0 s) to `drive`: YOU's EV crossover parked in the driveway, cut along its length (pack, HVAC box, nose), snow on the roof; **in-scene glide** to `cabin` (the HVAC box and the pack) at `with a plain` (81.09); **in-scene glide** to `nose` (the nose, the HVAC box and the pack in one frame) at `or a heat pump` (83.12) | 78.08 glide · 79.04 "cabin" snow drifting past the car · 80.16 "two ways" the HVAC box blower starts · 81.09 glide (0.6 s) · 81.68 "heater" **orange draws pack → heater** (the No. 017 N1 route); the element takes the made-by glow · 82.24 "makes heat" halo-only wisps from the vents into the empty cabin · 83.12 glide (0.7 s); the heater's feed fades · 83.64 "heat pump" **the heat-pump parts draw in** (ink outlines, then materials, 0.6 s) · 84.36 "moves it" wisps pulled out of the night air into the nose, a line to the HVAC box, a thin pack → compressor line | — | glide |
| 16 | `And at home, does` · 85.28 · 4.78 (incl. 1.5 tail) | And at home, does your house make its heat, or move it? | H, glide (truck, 1.0 s) back to `house`, then a slow push landing on **frame 0's framing** at the last frame. Off-frame during the glide the house is back at frame 0's state (F3) | 85.28 glide; the EV's heat pump runs on at the frame edge · 85.80 "home" lamp-lit living room, register wisps, the heat pump running, the strips dark · 86.88 "make" the space heater sits dark · 88.00 "move" the outdoor unit's wisps pour in · 88.56 voice ends, captions end · 89.0 YOU returns to frame 0's pose (scrolling) · 90.03 **last frame (2701) = frame 0** | — (captions end) | glide |

### Gaps (longest stretch with no listed event, real times)

Every scene has an event at least every ≈ 1.45 s. Snow, the outdoor fan and flowing dots are texture and don't count
(§ 8 motion rule). Longest: scene 1, 2.88 → 4.32 (1.44 s, the push runs); scene 10, 55.44 → 56.88 (1.44 s, counter on
screen); scene 13, 73.16 → 74.6 (1.44 s, callout and band on screen); scene 4's drawn-out "degrees…", 24.00 → 25.36
(1.36 s, the bracket holds); and scene 16's tail 89.0 → 90.03 (the push lands).

### Scene lengths

Spec scenes run 3.28 to 7.39 s. Picture changes (glides and in-scene glides) are never more than **5.44 s** apart (scene
13, 69.36 → 74.80, one framing with the band, the callout and the settling snow) or 5.20 s (scene 10, 52.80 → 58.00, held
on `house` under the counter). **Long:** 1, 4, 10, 15 (6.88 to 7.39 s), each with an in-scene glide where its line turns.
**Short:** 6, 7, 14 (3.52, 3.97, 3.28 s), each one glide, now shortened (see P4).

### Counters (F4) on the real take

| Counter | On screen | Hold | Gap to the next |
|---|---|---|---|
| 1 / 1 `UNITS` (sc 9) | 47.0 → 50.2 | 3.2 s | **3.7 s** (50.2 → 53.9) |
| 1 / 3 `ABOUT · 40°F` (sc 10) | 53.9 → 57.6 | 3.7 s | **1.8 s** (57.6 → 59.4) |
| 1.0 / 1.5 `−6°F` (sc 11) | 59.4 → 62.9 | 3.5 s | — |

Both gaps stay over 1 s, so **all three counters stay with both rows** (F4's fallback isn't needed). Each counter is in its
own scene and leaves before the next scene's counter enters. HEAT lands 0.7 s (sc 10) to 1.6 s (sc 11) after the counter
enters, so the count-up is visible every time.

### Loop tail

Voice ends **88.56**; `spec.tail: 1.5` puts the end at **90.06 s (2702 frames)**; the last frame is 2701 (90.03 s). The
1.0 s truck glide runs 85.28 → 86.28, the slow push 86.28 → 90.03, YOU's pose returns at 89.0. Captions are off for the
last 1.5 s. N9's "last frame" is frame 2701.

## Pacing on the real take

- **P1 · No beat between the question and the answer (12.64 → 12.72).** "…30 degrees?" runs straight into "Even
  30-degree air". The picture is fine: the title holds the question on screen to 13.44, over the start of scene 3. A
  breath here would need a new take or an edit to the audio (voice agent; a new take costs money). I recommend we keep it.
- **P2 · Two pauses in the middle of a phrase:** "heat the … house" (0.44 s, 38.56 → 39.00) and "comes in from …
  outside" (0.56 s, 42.96 → 43.52). Both are filled: register wisps arrive on "house", and the summed flow surges along
  the line set before the gust on "outside". They sound like a hesitation, not a beat. **Owner/voice: listen and decide**
  whether to keep them or close them with an audio edit. If they're closed, scenes 8 to 16 move earlier by up to 1.0 s and
  `yarn check` re-times the spec. Nothing in the picture breaks.
- **P3 · Bunched words.** "them shut off" (68.12 → 68.48) leaves no room to wind the fan down before "off", so
  `cutoff.at` moves to "most" (67.80) and the fan stops at 68.8, just after "off". Scene 14's "heat, if" (75.44 → 75.68)
  is too close for two events, so the feed draws on "heat" and the strips glow on "there" (feed before glow, as energy
  arrives). Scene 10's counter would have been born under the glide at `test house`, so the glide moves to `Canadian`.
- **P4 · Short scenes get shorter glides.** Scene 6 (3.52 s) 0.6 → 0.5 s; scene 7 (3.97 s) 0.9 → 0.7 s, so the
  glide ends before "hotter" (36.40) instead of on it; scene 14 (3.28 s) 0.7 → 0.6 s. Scene 6 still carries four events in
  2.4 s (one each 0.5 to 0.8 s apart). If it reads busy, drop the hot-line thermometer's draw-on and have it already
  there.
- **P5 · Drawn-out words** ("impossible…" 1.28 s, "colder." 0.96 s, "degrees." 1.12 s, "gas." 0.96 s, "over." 1.12 s)
  give each line's end room. Only "degrees." (scene 4) has no new event, and the bracket holds there (1.36 s).
- **P6 · No line runs too slow** for its picture: the longest single framing is 5.44 s (scene 13) and it changes every
  ≤ 1.44 s.

## Lines that are hard to show

- **F1 · Title.** Settled: **A** (owner). Known 🧪: the captions repeat it under the title at 8.9 to 12.6 s.
- **F2 · Length 90.06 s.** Over 60 s, so the video needs our own music (brand.md § Structure). Same as No. 017's F1.
- **F3 · The thermometer moves like a dial, not a clock.** 30°F (lines 1–9) → 40°F (line 11) → −6°F (line 12) → colder,
  into the shut-off band (lines 13–14) → back to 30°F at the loop. The reset happens off-frame while we're at the EV
  (scene 15). Without it the loop can't land on frame 0. I recommend we keep it and disclose ("the outdoor temperature is
  drawn changing to show each case").
- **F4 · Three counters in 16 s** (47.0 → 62.9). Re-timed: gaps 3.7 s and 1.8 s, all three kept (see Counters above).
- **F5 · Width at 30°F.** The voice gives no number at 30°F, but frame 0 and the mechanism (scenes 1–8) need a width.
  I've drawn **2.5 w** (1.5 w of wisps + w), between the two measured points (3.0 at 41°F, 1.5 at −6°F; straight-line
  ≈ 2.65). 🎭, disclosed. That way, when line 11 says "40 degrees", the flow visibly swells to 3 w.
- **F6 · "Heat always flows from warmer to colder" (line 4)** is drawn as heat leaving the warm room through the
  **left** window into the night. The window is on the side away from the outdoor unit, so nobody reads it as the pump
  re-using the house's own lost heat. The leak shows in scene 3 only, as one idea. Scene 5 mirrors it: the same wisps
  flowing *into* the colder coil.
- **F7 · No frost.** A coil 10 to 20 degrees under 30°F air is below freezing, and real coils frost. v11 dropped the frost
  and defrost lines, so the coil is drawn clean. That's an omission, not a false picture (fact-checker v6: the video simply
  doesn't cover defrost). Snow on the fins' top edge is fine; frost on the fin faces isn't.
- **F8 · Line 13 is general ("heat pumps … most of them"),** but it's drawn on our one unit as the example. Its fill
  stops **below −6°F and inside the 5°F to −13°F band**, so it agrees with line 12 (the test unit still ran at −6°F;
  fact-checker v9/v10 fit check). The fill must never sit above the −6 mark when the unit stops.
- **F9 · "Backup heat, if there is any".** Our house has electric strips in the air handler (all-electric, 🎭). Other
  houses back up with a gas furnace, and some have nothing. The voice's "if there is any" carries that; the picture shows
  one case. The strips run at w in, w out (they *make* heat, like the space heater). The voice doesn't say so, so there's
  no counter.
- **F10 · Shut-off callout.** The ink band on the thermometer (no digits, § 3) shows *where*; the callout gives the °F
  numbers for US viewers and names it. It's optional (the captions carry "5 above and 13 below zero"). Drop it if the
  stills read busy. I'd keep it, since it's the one range the counters don't show.
- **F11 · `YOU` tag** (optional). Line 1 says "your house"; the tag on YOU's first close appearance ties the viewer to the
  figure, and line 3 is the viewer's question. It shares the frame with the title block (a tag isn't a card) and must sit
  ≥ 24 px under the title block's bottom edge. 2.1 s on screen (7.9 → 10.0). Drop it if the stills read crowded.
- **F12 · Counter order.** The voice says heat first, then electricity, so HEAT OUT lands before ELECTRICITY IN, although
  ELECTRICITY IN is the top row (in → out reads top to bottom). Fine.
- **F13 · Line 9 "the electricity runs the compressor."** The feed is drawn to the compressor only, as the voice says.
  The outdoor fan's and the blower's small draw isn't drawn (fact-checker v5 noted they exist; the script makes no "only"
  claim).
- **F14 · One heater at a time.** The heat pump goes quiet for scene 9 and restarts in scene 10, so the space heater's
  1 / 1 isn't muddied by a second flow (🎭).
- **F15 · Scene 11's in-scene glide runs under the counter** (61.44, counter out 62.9). The fallback (glide at "space
  heater", 62.24) now leaves only 1.15 s of `room` before the scene ends and puts YOU's glance mid-glide, so I'd keep the
  glide under the counter unless the stills or motion read busy.

## Reused vs new

**Reused as they are:** `RealLivingRoom` / `LivingRoomSlice` furniture (couch, lamp lit in Night, rug, window, plant);
`Figure` (YOU, seated, phone toward YOU, `lean-in`, `look-up`, `glance-down`); `SpaceHeater` (body, fan, pilot lamp);
`HeatKit`'s `HeatFlow` (widths, draw-on, dots, surge), `HeatWisps` / `wispStates`, `InkGauge` (thermometers, range band),
`HvacBox` and `HeatPump` on `SlicedCar` (YOU's crossover, parked); `Snow` (`box` set to the house); `townParts`' `cutBlock`
and the gable-roof approach from `KitchenHouse`; `HomeGarage`'s meter dial look for the electric meter; rows counters with
`decimals` and per-row `startAt`/`stopAt`; callouts; the name tag; the title block; glides and `cameraKeys`. **Not used:**
slides, statement cards, detail boxes (no screen is read), place labels, No. 016's and No. 017's sets.

## Missing scenes and parts (scene-builder)

Numbering kept from the v4 draft where the part is the same. **N3 is now the air handler** (it was the gas furnace).
**N10 is new** (the thermometer set, split out of N4).

- **N1 · `house-slice` (new scene).** One single-storey US house with a basement, at the fixed angle, Night (`mood`, Day
  available). Block ≈ 6 wide × 4 deep, walls 2.7, basement 2.4 below grade in the cut ground, gable roof (ridge front to
  back, its front cap cut, ink line), ceiling slab, floor slab between living room and basement, all cut at the front with
  hatch and ink. The front wall is removed; the back and both side walls stand, cut on top and at the front. A window in
  the **left** side wall, seen from inside and out at `window`. Neighbours' houses far behind, windows lit (`StreetSlice`
  `House`). Outdoor unit, meter and disconnect on the **right**, the driveway past them. No gas meter, no vent, no
  chimney. Props: `mood`, `framing` / `cameraKeys`, `drift`, `snow` (density, gusts), `you` (pose keys), plus the keys of
  N2 to N10. Framings (look-at + distance at the fixed angle): **`house`** (frame 0: the whole section, roof to cut ground,
  the outdoor unit and the air thermometer in frame, sky band for the title), **`room`** (YOU, the heater, the register,
  the left window), **`window`** (the left window, room side and night side), **`yard`** (the unit, the wall, the line set
  entering, the air thermometer), **`air`** (closer: the unit, the open air beside it, the thermometer), **`coil`** (the
  unit cut-away whole), **`gauges`** (air and coil thermometers side by side, cut tubes behind), **`fins`** (coil face and
  two cut tubes), **`tubes`** (the cut tubes and the suction line leaving), **`compressor`** (dome, suction in, hot gas out,
  the feed), **`indoor`** (air handler, A-coil, trunk, register, living-room floor, room thermometer), **`feed`** (meter,
  disconnect, thin feed, the unit's side), **`heater`** (the heater cut-away close, outlet and cord in frame),
  **`loopWide`** (unit, line set, air handler, register in one frame), **`thermo`** (the magnified air thermometer large,
  the unit beside it), **`basement`** (air handler with the strips, the panel, the trunk to the register), **`drive`** (the
  EV whole), **`cabin`** (HVAC box and pack), **`nose`** (nose, HVAC box and pack). A framing that can't fit at the fixed
  angle may move; tell me which.
- **N2 · Space heater, cut open.** `SpaceHeater` with a cut through its side: the element (ceramic or wire, in
  `REAL.frame`/`HIGHWAY.galvanized`, never red-hot) takes the made-by glow on `on` keys; the existing fan and pilot lamp;
  the feed **outlet → cord → element** as a `HeatFlow` riding on the cord (the cord stays black, § 5); warm-air wisps from
  the grille, halo-only, ending ≥ 0.15 m and ≥ 16 px from YOU at `room` (§ 5 System heat near the cast). Keys: `on`, `off`.
- **N3 · Air handler with backup strips (new part; replaces the gas furnace).** An upflow air handler cabinet in the
  basement (`CHARGE.cabinetDark` or a pale appliance token, real sheet metal), cut open: the blower (spins), the filter,
  the **A-coil** (the line set's indoor end; takes the glow when hot gas arrives), and above it in the supply plenum a
  **bank of electric strips** (open wire coils on a ceramic frame, `HIGHWAY.galvanized`, made-by glow on `strips` keys,
  never red-hot). The supply trunk rising into the living-room floor to the register, a return. The **electrical panel**
  on the basement wall with a cable to the strips (the feed rides on the cable, w). Keys: `blower`, `strips` {on, off}.
- **N4 · Heat pump, house scale (new part, `HeatKit`'s grammar).** Outdoor unit on a pad: top fan (spins, winds down,
  stops), a wraparound coil cut through its tubes (refrigerant `CHARGE.coolant`, streaks `coolantFlow`, ink where it meets
  the cut copper, § 3 Liquids in a cut-away), compressor dome (cut, scroll orbiting, stops), expansion valve. Line set
  through the wall: the insulated suction/hot-gas line (black foam, an existing token such as `REAL.flex`) and the bare
  liquid line (`REAL.copper`), to the A-coil (N3). The electric meter and a disconnect box on the wall with the thin feed
  (w) to the compressor. Heat: **still air wisps** (zero drift) that can start drifting into the coil (the `intakeWisps`
  pattern re-aimed at the unit), the suction line's flow after the boil, the merge with the feed after the compressor,
  the A-coil glow, warm air up the trunk to the register wisps (N5). Keys: `run`; **`level`** keyed over time (indoor
  width: 2.5 w at 30°F, 3 w at 40°F, 1.5 w at −6°F, 1.2 w just before shut-off; the feed stays w; wisps = indoor − w);
  **`boil`** (bubbles and vapour streaks in the cut tubes); **`cutoff`** `{at}` (fan winds down over 1.0 s, wisps stop,
  the line-set flow fades from the unit end toward the house, the feed fades, the scroll stops; snow then settles on the
  grille). No reversing-valve action, no frost, no defrost.
- **N5 · Register, room air and the window.** The floor register's wisps (halo-only, ≤ 25 %) rising and dissolving before
  YOU at every framing that shows both; their strength follows N3's or N4's indoor width. **Window leak** on a key (scene 3
  only): room wisps drifting to the left window and out through the glass into the night, fading there.
- **N6 · The EV in the driveway.** `SlicedCar` crossover, YOU's paint, **parked** (wheels still, no lamps: § 8 motion
  check, the recommended scope for parked cars), snow on roof and hood, no driver. Placed so its nose faces the house and
  its cut side the camera **without a reflection** (§ 3 US fast-charger row rule: yaw or cut side, never mirror). Uses
  `HvacBox` electric (pack → heater feed, element glow, vent wisps) and `HeatPump` (`at`, `outAt`, wisps with zero drift)
  on the same timeline as scene 15.
- **N7 · Night winter dressing.** `WINTER` snow on the ground, roof, pad and car, `Snow` falling with gusts, all under the
  **Night** rig. This is new: No. 014 and No. 017 were Day. Check whites (lit snow ≤ 244 is a Day ceiling; at Night, check
  the snow reads as snow and not as cut faces), and check that the lamp-lit living room still makes it a "lit room" (§ 4
  Night guard rails). Brand-director, if a value fails.
- **N8 · Flow widths at house scale.** One base width w that reads ≈ 3 to 4 px core at `house` and stays ≤ 3.5× at
  `heater`, scaled with camera distance as § 5 does for car-scale paths. 2.5 w and 3 w must read clearly fatter than w at
  `house`, `yard` and `loopWide`; 1.2 w must still read as slightly fatter than w at `loopWide`. Brand-director confirms
  the value.
- **N9 · The loop.** At the last frame (2701 = 90.03 s): framing `house` at D0, the heat pump running at the 30°F level (2.5 w)
  with frame 0's dot and wisp phase, the air thermometer back at 30°F with no band, strips and space heater off, the EV's
  heat pump out of frame (or matching frame 0 if `house` shows the driveway), YOU in frame 0's pose, snow seeded to match.
- **N10 · Ink thermometers (`InkGauge 'thermo'`, § 3 In-set ink gauge: no digits, no °, ink fill, never red or orange).**
  **Air** (on a post beside the unit, magnified so it reads at `house`; a fill keyed in °F on a true scale with unlabelled
  ticks; marks at 40, 30, 5, −6 and −13; a **range band** drawn on between 5 and −13 on a key); **coil** (clipped on the cut
  tubes, its fill keyed to stay 10 to 20 degrees under the air's; drawn on in scene 4); an **ink bracket** between the air
  and coil fill lines, drawn on with end ticks; **hot line** (clipped on the hot gas line at the compressor in scene 6, at
  the line's indoor end in scene 7); **room** (small, on the living-room wall, a mid fill below the hot line's). All 🎭,
  disclosed.

## The loop seam plan

1. **Frame 0 (scene 1):** H `house`, Night, 9:40 PM, snow falling. The heat pump runs: thin feed, wisps in, 2.5 w line
   set, register wisps. Space heater and strips dark. Air thermometer at 30°F. YOU on the couch scrolling. Title block up;
   slow push from D0.
2. **Last shot (scene 16):** a 1.0 s glide from `nose` to `house`'s look point, slightly wider than D0, then the slow push
   landing on D0 at the last frame (2701, 90.03 s).
3. **Phase-locked:** flow dots, intake wisps, register wisps, the outdoor fan's angle, snow, YOU's scroll pose, the air
   thermometer at 30°F.
4. **Words:** the voice ends at 88.56, so the captions are gone for the last 1.5 s. "…or move it?" hands over to
   "A heat pump puts more heat into your house…".
5. **Check:** `yarn stills home-heat --frames=0,2701`, compare the two PNGs, then check the motion in Studio.

## For the publisher's 🎭 "Illustrative:" line

The house and its layout (all-electric, with a heat pump, backup strips and a space heater, run one at a time); our house
standing in for the Canadian government test house; the story time; the outdoor temperature drawn changing to show each
case (F3); flow widths drawn in proportion to the units the voice gives, with the 30°F width drawn between the two
measured points (F5); the ink thermometers (magnified, no readings) and the coil kept 10 to 20 degrees under the air;
the heat pump shown shutting off as one example inside the newer-model range (F8); electric strips shown as the backup
(F9); one parked EV drawn with both heater types in turn.

## Sound (note only, for later)

Physical sounds only: a quiet night bed with wind gusts (`sfx:night`); the outdoor fan and the compressor hum
(`sfx:cabfan` / `sfx:pump` family), and the **wind-down to silence at the shut-off** (67.80 → 68.8, the scene's beat); a soft
boil fizz is optional (scene 5, under the voice); the air handler's blower; the space heater's click and fan
(`sfx:heater`, `sfx:heaterfan`); the strips' relay click and a faint tick as they warm (scene 14); the EV's blower only,
no motor. No sound for orange, cards, tags or thermometers. Over 60 s, so our own music.

## Spec notes (spec.ts written on draft 2, 2026-11-11)

Where `spec.ts` departs from the table above (values only; lines, cues and scenes unchanged):

- **`YOU` tag dropped (F11).** `house-slice` has no `anchorOnScreen` entry, so a tag can't find YOU's head. A `you`
  anchor from the scene-builder would bring it back (7.9 → 10.0).
- **Thermometer reset moves to scene 14** (77.1 → 77.9, after "takes over", off-frame at `basement`). `drive` shows the
  air thermometer at its left edge, so a reset there would be seen. The strips go off at `drive` (house off-frame) and
  the heat pump restarts at `cabin` (unit off-frame), both in scene 15.
- **The EV's heat pump draws out at 85.58** (scene 16, 0.3 s into the glide), so it's gone long before the last frame.
- **Framings tuned:** scene 6 looks 0.22 m further left (hot-line thermometer fully in frame); scenes 11–12 use a
  lower, slightly wider `loopWide` (look [2.0, 0.0, 1.38], 29.5) so YOU clears the counter and the air thermometer is
  in frame. `neighbours: false` everywhere (the far block poked in at frame 0's left edge).
- **Scene 12 (brand ruling):** `lineScale` 2.0 for the whole scene; level 1.5 → 1.2 over 0.6 s, landing on "pull" (65.20).
- **Review fixes (FIX round 1):** frame 0 and the last frame use `house` 0.4 m lower (look y 1.4), so the title
  clears the roof (D4). Scene 3 uses `air` at look y 0.95 (D4), with `air` wisps at 1.0. Scene 5 rises to 1.3 after
  "30-degree" (D2). Scene 7 uses `indoor` at look y −1.2, with the supply drawing from "so it" (D1, D3). The SHUT-OFF
  callout is size 1.4 (D6).
