# No. 019 · Light countdown: audio + visual script (draft 2.5, 2026-11-12, timed to the real voice take; review round 2)

Words: `script.txt` **owner-approved rewrite** (15 lines, 231 words; the answer comes straight after the question). Times
are **real**, read from `transcript.json` (the recorded take, `audio/voiceover.mp3`): voice 0.08 → **79.36 s** (≈ 2.91
words/s), plus a **1.5 s tail** (`spec.tail: 1.5`) for the loop push: **80.86 s = 2426 frames** (last frame 2425 = 80.83
s). Times are video seconds; a cue's time is its first word's start (scene 1 starts at 0).

**Changes since draft 1** (draft 1 was cut to the old 14-line script): re-cut to the new order (the US block of rules,
crash research and sensors before China's app); the start strip becomes a **time tape** (starts land, bunches repeat with
the same gap, the gap is the cycle, the next green one gap ahead); the walk-signal and "faster through the yellow / faster
starts" beats are gone (N8, N10 dropped); the ending is "wait for your car" at the US corner, then a slide to the timer
corner on "or run on a timer?" (F4 settled); six slides instead of seven; every time on the real take. On the take, line
5's two halves stay **one spec scene** with an in-scene glide (its first half is 2.96 s), so there are 16 scenes.

## Decisions applied

| Flag | Now |
|---|---|
| F4 ending | **Main session:** the script ends "wait for your car, or run on a timer?", so the last slide lands on the timer corner on `or run on a timer` |
| F11 Lab | **Main session:** The Lab for the test line |
| F1 title | **Owner: B** (`Why don't US traffic lights` / `count down for drivers?`), accepting the departure from § 6 |
| Voice | **Main session:** the take stays as recorded, mid-phrase pauses included (P1 closed) |
| F3 slides | **Brand-director (v0.18.15 § 8):** no cap; ≥ 3 s apart, each a change of place. Six pass (closest pair 5.40 s) |
| F6 walk signal | **Brand-director (v0.18.15 § 1):** default no pedestrian head. **Dropped** from U (N2) |
| F7 ghost digits | **Brand-director (v0.18.15 § 3):** allowed. Dash 8 / gap 5 px, ≥ 40 px tall, each digit whole in 3 frames, one sequence of ≤ 3 per video. **Main session times:** `3` 15.36, `2` 15.72, `1` 16.08, yellow 16.40; `1` fades over 6 frames |
| F10 tape | **Brand-director (v0.18.15 § 5, The time tape):** approved; it sits in x 120–888, y 288–1000 whenever it carries an event (framings re-aimed below) |
| N5 app mark | **Brand-director (v0.18.15 § 1, § 8 kit):** the estimate's 5 px orange edge under its number is approved; the number stays the UI's text colour |
| F15 two drivers | **Kept, with conditions** (scene 4 and F15) |
| P4 scene 16 | **Main session:** 2.86 s accepted |
| Street hardware | **v0.18.15 § 3 Generic devices:** cabinet, pull-box lid, poles and housings carry no text, sticker, seal or maker mark (N1, N2) |

## The system in one line

**Orange = the light's timing, as data.** At the countdown corner: a small orange dot over each car **whose driver uses
the app**, the moment each of those cars starts **rising from its roof** to the **time tape**, a floating timeline in the
air above the street (owner: nothing about the app happens underground), the bunches of
starts that come back with the same gap, the predicted next green one gap ahead, the gap bar from "now" to it (the
estimate), and the estimate's mark in the phone app. In The Lab: the estimates being made (a wave across the wall grid).
At the US corner: the **detector calls** that set the green (loop outline → lead-in → controller cabinet) and the
cabinet's **decision** to end it (a pulse up the mast to the heads). Test (§ 5 One system per video): every orange line
ends in the light's timing.
**Not orange:** the signal lenses and every countdown digit on a pole (`signalRed`, `signalGreen`, yellow `warning`, flat,
never bloomed), the tape's cursor and gap brackets (ink), the ghost box and its digits (ink, § 3), the Lab's results
(ink), cars, plates, cabinets, the app's UI.

## The look in one paragraph

**One downtown intersection, cut open square to the street, used twice:** the existing `city-slice` (No. 006, No. 015),
re-dressed as **a countdown corner** (signal heads with a two-digit countdown box, no signs, blank plates, an e-scooter
rider in the bike lane, optional) and as **a US corner** (the same heads with no box, ONE WAY and SPEED LIMIT 25, loop
detectors cut in the lanes, the controller cabinet on the corner cut open). Same fixed angle and framings, so the missing
number reads at a glance. Day, morning. Cars drive away from the camera: we see the signal faces and every brake lamp.
Between the app beat and the payoff, **The Lab** re-dressed as a timing check. **Nothing readable on the street:** no shop
names, no plates, no flags, no police, no app logo (owner), no rulebook on screen.

**On-screen words** (all ink): the title block; place label `CHINA` (sc 6); the detail box (a generic map app: a light icon
and its seconds); one counter `MORE THAN` / `75 %` / `WITHIN 5 SECONDS` (sc 13). In-set digits only on the pole's countdown
box (and the ghost's dashed `3 2 1`, F7). No maker, app name, agency, "MUTCD", study name or source text.

## Locations

| Code | Location | Built with |
|---|---|---|
| **C** | The countdown corner (Day): mast-arm heads with a countdown box, 4-car queues in lanes 2–3, the phone car at the front of lane 3, the time tape floating in the air above the street, 4–6 m up (owner, 2026-11-12) (v0.18.16: 12–24 m up the street, 4.0 m up, straight over lane 3, above the queue's near half) | `city-slice` + **N1**, **N3**, **N4**, **N6** |
| **U** | The US corner (Day): the same heads, no box (ghost), loops and the cabinet, YOU's car | `city-slice` + **N2**, **N3**, **N7**, **N9** |
| **B** | The Lab · timing check: a wall grid of 10,000 cells, two researchers at laptops | `section-lab` + **N11** |

Moves between locations are **`slide`s** (§ 8; a re-dressing within one video slides, as No. 011's teardown). Six in all:
C → U (3.96) → C (29.68) → B (57.12) → C (66.80) → U (72.60) → C (78.00) (F3). Inside a location every framing change is a
glide. `city-slice` was last used in No. 015, so § 3 Re-dressing doesn't apply; dressing, system and framings are new.

## Title block

Line 2: `NO. 019 · THE INTERSECTION · 8:12 AM`. Up from frame 0; fades at **10.20 s** (0.8 s after "…here?" ends at 9.40),
over 10 frames (gone by 10.53). It stays up over the slide at 3.96 and the glide at 9.76 (F2). The fade stays keyed to the end of the spoken question.

**Owner's choice: B**, `Why don't US traffic lights` / `count down for drivers?` (27 / 23 characters). It is not the spoken
line ("A countdown sounds helpful, so why not here?"); the owner accepts the departure from § 6 so that frame 0 says the
whole question on its own. Captions run under it as usual.

## Framings (names for the spec, values for the scene-builder)

All at the fixed angle; a look-at point plus a distance, set on stills. Existing `city-slice` presets as starting points.

| Name | What's in it | Start from |
|---|---|---|
| `signal` | **Frame 0 and the loop.** The stop line with the lane 2–3 queues (front cars ≈ 160 px wide), the heads and the countdown box at upper right under the title block, the cross street. Cut face off-frame | `lanes` (56), ≈ 40 |
| `count` | The heads and the countdown box (or ghost box) close (digits ≈ 80 px), the front cars' roofs below | ≈ 18 |
| `car` | The phone car's tail and roof at the line (lane 3 front), the countdown box top right, room for a detail box on the left (x 120 to ≈ 480, top ≈ 710) | ≈ 22 |
| `queue` | Not used (the tape scenes use `queueTape`) | — |
| `queueClose` | The front of both queues and the heads, the green readable, cars ≈ 120 px | `queueClose` (60), ≈ 38 |
| `queueTape` | Look [8.2, −1.6, −16], 48: the floating line over lane 3's queue (x ≈ 370–830, y ≈ 385–535), the roof under its middle ≈ 200 px below it; the heads above the frame | builder 44 |
| `tape` | Look [8.6, 1.2, −17], 32: the floating line close (x ≈ 140–865, y ≈ 465–730), the 3rd car's roof under it at y ≈ 865 | builder 20 |
| `approach` (U) | Lanes 2 and 3 approaching the stop line, the heads and the ghost box at top right | `follow` (36) |
| `loopsWide` (U) | The stop line and loops, the approach behind with incoming cars, the heads, the cabinet small | ≈ 42 |
| `loops` (U) | The loops, the lead-in to the curb, the cabinet at the mast pole's foot cut open, the heads at top | ≈ 30 |

## Line by line

Cues are copied word for word from `script.txt`; all 16 resolve uniquely and in order against the real transcript. Line 1
is split at `but in the US`; line 12 at `and more than three`; line 15 at `or run on a timer`; line 2 joins scene 2; line 5
is one scene with an in-scene glide at `because road sensors`; line 14 and line 15's first half share scene 15. "In-scene
glide" = a `cameraKeys` glide inside one spec scene. Countdown digits as shown (whole seconds, N3).

| Sc | Cue · in (s) · len | Line | What's on screen | Motion / events (s, on the word) | Overlay | Transition in |
|---|---|---|---|---|---|---|
| 1 | `In China, many traffic` · 0.00 · 3.96 | In China, many traffic lights count down for drivers, | **Frame 0, C `signal`.** Red; the countdown box beside the heads shows **red `23`**. Lane 3: the phone car at the line (an extra driving, the dash phone lit, its light on the face), three cars behind; lane 2: four cars. **Every brake lamp lit.** Nothing orange | 0.0 slow push from frame 0's distance · digits **23 → 22** at 1.0, **21** at 2.0, **20** at 3.0 · 1.36 "traffic" the phone car's driver glances up from the phone to the light · 2.48 "down" the e-scooter rider puts a foot down (N1, optional) · 2.96 → 3.96 "drivers," (held 1.0 s) `20` holds, the push runs | **Title block** 0 → 10.20 | — (frame 0) |
| 2 | `but in the US,` · 3.96 · 5.80 | but in the US, that's not allowed. A countdown sounds helpful, so why not here? | **U `signal`, the same framing.** Red, **no box**. YOU's car at the line in lane 3 (on the loop), brake lamps lit | 3.96 slide (18 frames) · 5.28 "not allowed" a grey car rolls up behind YOU and stops, lamps lighting · 6.40 "countdown" YOU glances up at the light (1.0 s) · 8.20 "so" (after the 0.9 s pause at "helpful,") **in-scene glide** (0.8 s) closer to YOU's car and the heads · 9.04 "here" YOU glances back down | Title block | slide |
| 3 | `US rules keep countdowns` · 9.76 · 3.76 | US rules keep countdowns off the lights drivers watch. | U, glide to `count`: the heads close, red | 9.76 glide (0.8 s) · 10.20 title starts fading · 10.80 "countdowns" the **ghost box** draws on beside the middle head where the countdown was (dashed ink, 0.8 s, N9) · 12.64 "watch" the heads go **green** · 13.0 the front cars' roofs pull away along the frame's bottom | — | glide |
| 4 | `The rulebook says research` · 13.52 · 7.52 | The rulebook says research found warnings before the yellow increase crashes, **though studies of countdowns disagree.** | U, glide to `count`, closer (the ghost digits ≈ 80 px), then **in-scene glide** down to `approach` at 16.10, 0.3 s before the yellow: green; car A (grey crossover) in lane 2 and car B (dark sedan, `EXTRA_B` driving) in lane 3 approaching **side by side at the same speed**; **no car behind B**; the heads and the ghost box at top right; **cross traffic held** (none moves on the cross street all scene) | 13.52 glide (0.8 s) · 14.56 "research" both cars nearing the line off-frame, level with each other · 15.36 "warnings" **dashed ink digits** in the ghost box, each whole in 3 frames: `3` (15.36), `2` (15.72), `1` (16.08) (F7) · 16.40 "yellow" the heads go yellow; `1` fades over 6 frames; **A and B are at the same speed and the same distance from the line** (≈ 12 m before it, in frame as the glide lands) · 16.10 glide (0.8 s) down to `approach` · 16.60 car B starts slowing **evenly** (6.25 m/s²), `brakeLit` from 16.60 · ≈ 17.9 car A, at unchanged speed, is past the line, **inside the yellow** (F15) · 18.40 "though" car B at rest at the line, lamps lit · 19.84 "disagree" red · 20.2 the ghost box fades (0.7 s) | — | glide |
| 5 | `And many US lights` · 21.04 · 8.64 | And many US lights would struggle to count down anyway, **because road sensors decide when the green ends, often just seconds before the light changes.** | U, glide to `loopsWide`: red; car B waiting on the lane 3 loop; the approach behind it. **In-scene glide** to `loops` (the loops, the lead-in, the cabinet cut open, the heads at top) at `because road` (24.00) | 21.04 glide (0.8 s) · 21.76 "lights" the loop under car B flashes **orange** (0.3 s), a pulse rides the lead-in to the curb and on to the cabinet (0.6 s, N7); the controller's LED turns orange · 22.32 "struggle" green; car B's lamps go dark at 22.5, it pulls away · 23.16 "down" car C comes up the approach (B clears the loop first) · 24.00 glide (0.7 s) · 24.5 "sensors" car C crosses the loop: flash, pulse · 25.5 "when the green" car D: flash, pulse; the green holds · 26.16 "ends," the approach behind is empty, no more calls · 27.36 "just" **the cabinet decides**: its LED flashes and a short orange pulse runs up the mast and along the arm to the heads (0.5 s, N7) · 28.72 "changes" yellow (1.36 s after the decision, F17) | — | glide |
| 6 | `Meanwhile, in China, a` · 29.68 · 7.67 | Meanwhile, in China, a map app can even count down a red light without needing a connection to it, the app's maker says. | C `signal`, a red: box **red `12`**, the same phone car at the front of lane 3; **in-scene glide** to `car` at `app can` (31.76) | 29.68 slide · 30.60 place label in, landing on "China" (30.84, after the 0.36 s pause at "in") · 31.76 glide (0.7 s) · 32.48 "count down" **detail box** in: the phone's map app, a red-light icon and **`9`**, the same second as the pole (N5) · 33.0 / 34.0 / 35.0 / 36.0 the pole and the phone tick down together (8 → 5) · 35.76 "maker" the driver glances from the light to the phone | **Place** `CHINA` 30.60 → 31.90 · **Detail box** (the app) 32.48 → 37.20 (shows `4` as it leaves), leader to the dash phone | slide |
| 7 | `Instead, the app can` · 37.35 · 3.00 | Instead, the app can learn the timing from the cars. | C, glide to `queueTape` (the queues and the floating tape above them) | 37.35 glide (0.8 s) · 38.0 the box reads `3` (if the heads are in frame) · 38.84 "timing" the **time tape** draws on in the air above the street (an orange line, 0.6 s) with its ink "now" cursor; the tape starts to scroll right to left (N6) · 39.0 `2` · 39.36 "cars" the drivers' phones glow on their faces · 40.0 `1` | — | glide |
| 8 | `When the light turns` · 40.35 · 3.33 | When the light turns green, the waiting cars start to move. | C, glide to `queueClose`: the front of both queues and the heads | 40.35 glide (0.7 s) · 41.0 "turns green" box `0` → **green**, green digits from **`30`** · 41.92 "waiting" the phone car's lamps go dark and it pulls away (wheels rolling forward), then lane 2's front car at 42.2 · 42.6, 43.0, 43.4 the next cars start, one after another, lane by lane | — | glide |
| 9 | `The app sees that` · 43.68 · 3.36 | The app sees that moment on the phones of drivers using it. | C, glide to `queueTape`: the queues pulling away, the floating tape above them; each app car's start **rises from its roof** to the tape | 43.68 glide (0.7 s) · 44.16 "sees" a small **orange dot** lights over each car whose driver uses the app (**5 of 8**: the phone car and both lanes' 3rd and 4th cars, the ones in view), riding with them (F9) · 44.80 "moment" the five dots pulse, and **each car's start lands on the tape** as an orange dot at the time it pulled away (the earliest furthest left of the cursor, the last just behind it), 0.25 s apart, to 45.55 · 45.84 "drivers using" the cars without a dot drive on; nothing lands for them · 46.68 "it" the last cars leave the frame; their dots fade (1.0 s) | — | glide |
| 10 | `Over many days, those` · 47.04 · 6.08 | Over many days, those starts repeat with the same gap, **and that gap is the light's cycle.** | C, glide up to `tape` (the floating timeline close) | 47.04 glide (0.8 s) · 47.40 "many days" the tape **speeds up** (time-lapse, N6): it scrolls faster and squeezes time, so cycles pass in ≈ 0.6 s; each cycle a new bunch lands at the cursor · 48.96 "repeat" ≈ 5 bunches on the tape, evenly spaced · 49.60 "same" **ink brackets** draw between neighbouring bunches, one after another (4, 0.2 s apart), all the same length, the last landing on "gap" (50.24, after the 0.32 s pause) · 51.04 "that gap" the tape slows back to real time (through the 0.44 s pause at "light's") · 52.52 "cycle" the brackets pulse together once | — | glide |
| 11 | `Once it knows the` · 53.12 · 4.00 | Once it knows the gap, the app can count down to the next green. | C `tape`; **in-scene glide** to `queueTape` at `the app can` (54.40): a new red, a new queue, the phone car **4th in lane 3** (the same commute, another day), so it and the tape share the framing | 53.44 "knows" the last bracket copies forward ahead of the cursor (ink, 0.4 s) and an **orange marker** (a node dot on a short stem) lands at its far end on "gap" (54.00): the next green · 54.40 glide (0.7 s) · 54.96 "count down" detail box in (**right side, top ≈ 600**, below the floating tape, its marker and the gap bar; leader to the phone car): red **`40`**; on the tape (y ≤ 1000) an **orange gap bar** runs from the cursor to the marker, shrinking as the digits tick · 55.9 the phone and the bar (and the pole box, if the heads are in frame) tick to `39` together (inside the 0.48 s pause before "green") · 56.9 `38` | **Detail box** (the app) 54.96 → 57.00 | glide |
| 12 | `One research team tested` · 57.12 · 5.23 | One research team tested a similar method at about 10,000 intersections in China, | **B `wide`**: The Lab, Day; on the back wall a grid of **100 × 100 small cells**, dark; two researchers at a bench, laptops with their lids toward them | 57.12 slide · 57.52 "research team" both type · 58.08 "tested" an **orange wave** starts across the grid (estimates being made, halo-only, ≤ 25 %), leaving each cell lit pale behind it · 59.92 "10,000" the wave reaches the far edge; the whole grid is lit · 61.44 "in" one researcher leans in to the screen (the 0.36 s pause before "China") | — | slide |
| 13 | `and more than three` · 62.35 · 4.45 | and more than three in four timing estimates were within five seconds. | B, **in-scene glide** to `grid` (the wall grid close, cells ≈ 6 px) | 62.35 glide (0.7 s) · 62.96 "three in four" the cells resolve in a 0.6 s sweep: **about 77 % fill solid ink** (within 5 s), the rest turn to a **hollow ink outline**, seeded · 63.2 counter in, counting 0 → 75 · 64.1 lands · 65.36 "five seconds" the hollow cells blink once (0.3 s) | **Counter** `75` `%`, sub `MORE THAN` above, sub2 `WITHIN 5 SECONDS` below, 63.2 → 66.6 | glide |
| 14 | `The countdown on the` · 66.80 · 5.80 | The countdown on the light and the one in the app both work best on lights that keep a steady schedule. | C `count`: red, box **red `33`**; **in-scene glide** to `car` at `and the one` (68.00); **in-scene glide** to `queueTape` at `keep a steady` (70.72) | 66.80 slide · 67.30 the box ticks to `32` · 68.00 glide (0.7 s) · 68.80 "app" detail box in: red **`31`**, the same second as the pole box (top right) · 69.30 both tick to `30` ("work best") · 70.30 `29` · 70.60 box out · 70.72 glide (0.7 s) · 71.92 "schedule" (after the 0.48 s pause at "steady") on the tape (y ≤ 1000) the bunches sit evenly spaced and the brackets pulse once; the marker waits one gap ahead | **Detail box** (the app) 68.80 → 70.60 | slide |
| 15 | `Many US lights don't,` · 72.60 · 5.40 | Many US lights don't, because they wait for your car. Do the lights near you wait for your car, | U `loops`: red, the approach empty; **in-scene glide** closer on the lane 3 loop and the heads at `Do the lights` (75.90) | 72.60 slide · 73.52 "don't" YOU's car rolls up the approach · 74.48 "wait" YOU stops on the loop, lamps lit · 74.72 "for" the loop flashes orange, a pulse rides to the cabinet; its LED lights · 75.90 glide (0.7 s) · 76.64 "you" YOU glances up at the red · 77.12 "for your car" **green**; YOU's lamps go dark at 77.45, YOU pulls away | — | slide |
| 16 | `or run on a timer?` · 78.00 · 2.86 (incl. 1.5 tail) | or run on a timer? | C, a red: the queue as at frame 0, a little wider; **slow push landing on frame 0's `signal` framing** at the last frame | 78.00 slide · 78.2 box **red `26`** · 78.84 "timer" `25` (78.87) · 79.36 voice ends, captions end · 79.87 box `24` · 79.9 the phone car's driver back in frame 0's pose (looking at the phone) · **80.83 last frame (2425) = frame 0**, `24` handing over to frame 0's `23` | — (captions end) | slide |

### Gaps (longest stretch with no listed event, real times)

Every scene has an event at least every ≈ 1.8 s; brake lamps already lit, drift, the push and the tape's slow scroll are
texture (§ 8 motion rule); ticking digits count, they belong to the line. Longest: scene 3, 10.80 → 12.64 (1.84 s, the
ghost drawn on a red US head: **add** a car rolling up below at 11.8 if the motion check fails); scene 2, 6.40 → 8.20
(1.8 s, inside the 0.9 s pause at "helpful,"); scene 12, 59.92 → 61.44 (1.52 s); scene 16's tail.

### Scene lengths

Spec scenes run **2.86 to 8.64 s**. Picture changes are never more than **4.74 s** apart (scene 6, 32.46 → 37.20, held on
`car` with the detail box and both countdowns ticking; the next glide at 37.35). **Long:** 4 (7.52), 5 (8.64), 6 (7.67),
each with a glide in plus an in-scene glide or a held box. **Short:** 7 (3.00), 8 (3.33), 9 (3.36), one glide each; **16
(2.86 incl. the tail; 1.36 s of voice)**: below the 3 s floor (P4).

### Countdowns on screen (N3)

| Scene | Pole box | Phone (detail box) | Tape gap bar |
|---|---|---|---|
| 1 | red 23 → 20 | — | — |
| 6–7 | red 12 → 1 (green at 41.0, sc 8) | 9 → 4 | — |
| 8 | green 30 | — | — |
| 11 | red 40 → 38 | 40 → 38 | 40 → 38 |
| 14 | red 33 → 29 | 31 → 30 | — (the marker waits) |
| 16 | red 26 → 24 (24 for the last 0.97 s; frame 0 shows 23) | — | — |

The app and the pole always show the same second (F8). Red and green lengths are 🎭 illustrative.

### Loop tail

Voice ends **79.36**; `spec.tail: 1.5` puts the end at **80.86 s (2426 frames)**, last frame 2425 (80.83 s). The slide runs
78.00 → 78.60; the slow push to frame 0's distance runs to the last frame; the driver's pose returns at 79.9. Captions are
off for the last 1.5 s.

## Pacing on the real take

- **P1 · Mid-phrase pauses.** The take holds a beat inside six phrases: "in … China" (30.32 → 30.84, 0.36 s), "same …
  gap" (49.60 → 50.24, 0.32 s), "light's … cycle" (51.76 → 52.52, 0.44 s), "the … gap" (53.60 → 54.00, 0.32 s), "next …
  green" (55.84 → 56.56, 0.48 s), "in … China" (61.44 → 61.88, 0.36 s) and "steady … schedule" (71.12 → 71.92, 0.48 s).
  Five of them sit in the app explanation (lines 10 to 13), where they can read as hesitation. Each is filled: the label
  lands, the brackets land on "gap", the tape slows on "cycle", the marker lands on "gap", the digits tick on "green",
  a researcher leans in, the glide lands on "schedule". **Settled: the take stays as recorded, pauses included** (main session). The fills above stay in the plan.
- **P2 · Long holds at line ends that work for the picture:** "drivers," 1.0 s (frame 0 holds the countdown), "helpful,"
  0.9 s (the glide), "crashes," 1.0 s (car A reaches the line on "though"), "disagree." 1.1 s (the ghost fades), "changes."
  0.9 s (the yellow holds before the slide), "seconds." 1.0 s (the counter holds).
- **P3 · Line 5 stays one scene** (21.04 → 29.68): its first half is 2.96 s on the take, too short alone; an in-scene glide
  at `because road` (24.00) splits it in the picture.
- **P4 · Scene 16 is 2.86 s** (1.36 s of voice and the tail), under the § 8 floor of 3 s, because the slide lands on "or run
  on a timer?" (F4). `yarn check` may warn. Sliding earlier (`Do the lights near you`) would put "wait for your car" over
  the timer corner and lose the match. I recommend keeping it.
- **P5 · Lines 7–9 are three short scenes (3.00, 3.33, 3.36 s),** one glide each: queue → front → tape. If three glides in
  9.7 s read busy, drop scene 8's glide (stay on `queue`; the green reads small but the starts read).
- **P6 · No beat between the question and the answer** (9.40 → 9.76, 0.36 s): enough, with the glide on "US rules".

## Lines that are hard to show

- **F1 · Title.** A (as spoken) or B (search-style); owner. See Title block.
- **F2 · Title block over the slide at 3.96** (and the glide at 9.76). It's 2D and still, so it should read. The alternative,
  holding C through lines 1 and 2, loses the same-framing comparison on "that's not allowed". Keep; judge in Studio.
- **F3 · Six slides.** Ruled (v0.18.15 § 8): no cap, ≥ 3 s apart, each a change of place. All six pass; the closest pair is 72.60 → 78.00 (5.40 s).
- **F5 · "Without needing a connection to it" (line 6)** is shown by **not** drawing a link: the pole and the phone tick
  together. No dashed "no link" ghost, because that says "isn't connected" outright (hook check).
- **F6 · Walk signal.** Ruled (v0.18.15 § 1): default no pedestrian head. **Dropped** from the US corner (N2). If one is ever added: hand `signalRed`, walking person `screenLight`, countdown unlit.
- **F7 · Line 4, "warnings before the yellow".** Ruled (v0.18.15 § 3 ghost digits): dashed ink digits inside the ghost box, dash 8 / gap 5 px, ≥ 40 px tall (check at `approach`), each whole in 3 frames, the video's one sequence. Times: `3` 15.36, `2` 15.72, `1` 16.08, yellow 16.40, `1` fading over 6 frames (gone by 16.60). Each digit replaces the one before. The callout fallback is retired. "Increase crashes" gets no picture: the rulebook's claim, no crash, no near miss, no mechanism.
- **F8 · The app and the pole show the same second.** Keep (a one-second offset would read as a mistake).
- **F9 · Orange car dots** only over cars whose drivers use the app (5 of 8), as line 9 says. Small node dots, no crosshair,
  ring, label or trail (sources § Visual notes, Avoid). They show only at C, from scene 9, and fade after their car leaves.
- **F10 · The time tape.** Ruled (v0.18.15 § 5, The time tape): approved, in x 120–888, **y 288–1000 whenever it carries an event**. The framings that carry tape events are set for it: `queue` re-aimed (tape at y ≈ 860–1000; scenes 7, 11, 14), `queueTape` (scene 9) and `tape` (scenes 10, 11) with the tape at or above y 1000. Detail boxes at `queue` sit top ≈ 500 to stay clear of it.
- **F12 · Counter `75 %` vs "three in four".** Sources: "more than 75% of estimations" (preprint, 🟡, attributed). The sub
  `MORE THAN` keeps the hedge.
- **F13 · Length 80.86 s.** Over 60 s, so our own music only.
- **F14 · The phone car's driver is an extra; YOU is the US viewer's stand-in** (scenes 2 and 15). The same phone car comes
  back at every C visit; the same car B at U in scenes 4 and 5. No `YOU` tag (no driver head anchor in `city-slice`).
- **F15 · "Though studies of countdowns disagree"** is drawn as two drivers at the same yellow doing two things: car A carries
  on through, car B stops. Both are ordinary and legal; it shows "it depends on the driver" without claiming a result.
  **Conditions (kept on these):** (1) at 16.40 (yellow), A and B have the **same speed and the same distance** to the line;
  (2) B slows **evenly** from 16.60 to rest at 18.40, `brakeLit` from 16.60 (retimed in the review FIX so both cars are in
  frame from the yellow); (3) **no car behind B**; (4) A is past the line by ≈ 17.9, **inside the yellow** (yellow 16.40 → red 19.84); (5) **cross traffic held** all scene. The scene-builder keys A
  and B from these numbers; the visual-reviewer checks (1) on the 16.40 frame and (4) on the 17.9 frame.
- **F16 · The phones' starts land on the tape after the fact** (scene 9): the cars moved in scene 8, and their dots land at the
  times they started. That's how the data really arrives (phones report), and it lets line 8 show the plain starts and line 9
  show the app seeing them.
- **F17 · "Often just seconds before the light changes".** Sources: an actuated light changes "only one to four seconds after
  the decision". The decision pulse comes 1.36 s before the yellow. The decision is the system (timing), so its pulse is
  orange; the yellow stays `warning`.

## Reused vs new

**Reused as they are:** `city-slice` (`CitySlice` street, cut face, `SignalHead` and its state keys, `cityIntersection`,
`CityCar` stops, queues, `brakeAt` / `lamps`, `goAt` pull-away, `glances`, `wheels: 'forward'`, `loop: true`, `cameraKeys`;
the `lanes`, `queue`, `queueClose`, `follow` presets as starting points); `RoadSign` (ONE WAY, SPEED LIMIT 25 at U);
`CarPhoneKit` dash mount and `RealPhone` (No. 012 option C); `GhostLines` (No. 012 R6); `GlowNode` / `GlowSegment` and
`EventPin` (No. 012) for dots, pulses and the marker; `section-lab` (the Lab block, extras, laptops); detail box, place
label, counter (`sub`, `sub2`), title block, slides and glides. **Not used:** statement cards, chart cards, tags, the X-ray,
the plate-camera pole, the time-passes blend, the city-twin and house sets.

## Missing scenes and parts (scene-builder)

No new scene. Numbers kept from draft 1; **N8 and N10 are dropped**; **N6 and N7 changed** (re-cut).

- **N1 · `city-slice` dressing `'china'`.** (1) A **countdown box** on the mast arm beside the middle head, facing the camera:
  black housing (`CITY.signalHousing`), a two-digit seven-segment display, digits flat emissive in `signalRed` during red
  and `signalGreen` during green, dark during yellow, never bloomed, no maker mark. Digits ≈ 35 px at `signal`, ≈ 80 px at
  `count`. (2) `signs: []`. (3) **Blank plates** on every car, also at U (`plates: 'blank'`, § 3 Generic devices). (4)
  Optional: a bike lane on the right with one e-scooter rider waiting (standing extra, helmet in a cool grey). No guard
  fences, police, banners, cameras or flags.
- **N2 · `city-slice` dressing `'us'`.** The No. 015 street plus: (1) **Loop detectors**: two 6 × 6 ft sawcut squares in
  lanes 2 and 3 just behind the stop line (dark sealant lines, `HIGHWAY.milled` or `CITY.charcoal`), a lead-in sawcut to the
  curb, a small pull box in the sidewalk. (2) A **controller cabinet** at the mast pole's foot (≈ 1.2 × 0.6 × 1.5 m,
  galvanized or `CITY.signalHousing`), cut open on the camera side (hatch, ink edge), a generic controller inside
  (`CHARGE.cabinetDark` box, a few relays, one LED, no text). (3) Blank plates. **No pedestrian head** (F6, ruled). All street hardware carries no text, sticker, seal or maker mark (v0.18.15 § 3).
- **N3 · Countdown digits from the signal keys.** The pole box shows `ceil(next state change − t)` for the current state; keys
  may sit past a scene's end, so the last scene counts into frame 0's number (last frame `24`, frame 0 `23`). The detail box
  (N5) and the tape's gap bar (N6) read the same timeline (optional `offset`, default 0, F8).
- **N4 · A dash-mounted phone in a whole car** (`CityCar.phone`): the No. 012 dash mount and `RealPhone`, the screen toward the
  driver (§ 3), lit, the screen light on the driver's face; a scene anchor `'phone'` for the detail box leader; `glances`
  toward `'phone'` as well as the signal.
- **N5 · Detail box content `'light-app'`** (`screenKit` palette, Day UI): a plain light-grey map with one road and a cross
  street, a neutral dark car arrow, and at the intersection a **signal icon** (three small lenses, the lit one `signalRed` /
  `signalGreen`) with the **seconds** beside it (Inter 700 ≥ 56 px, UI text colour). The system's mark: a **5 px `orange`
  edge** under the seconds chip (the number is the estimate). No real map style, logo, icon, brand colour or app name
  (owner). Edge approved (v0.18.15).
- **N6 · The time tape and the car dots** (changed). (1) **Car dots:** an orange node dot (r 0.035, × camD / 12, clamped 0.5
  to 3.5) ≈ 0.4 m over the roof of each car flagged `app`, riding with it; on `dotsAt`, all light (0.3 s); on `reportAt`,
  each pulses once; each fades 1.0 s after its car leaves the frame. (2) **The tape:** an orange line **floating in the air above the street, 4–6 m up** (owner, 2026-11-12: on the cut face it
  read as something happening under the road), path weight, ≥ 6 m long; each start **rises from its car's roof dot** to the
  tape. Built v0.18.16 (`tape.x` m up the street, `y` height, `across`); this video uses x [12, 24], y 4.0, across 8.25. A fixed ink **"now" cursor** (`cutLine` needle, 3 px) at ≈ 65 % of its length; time scrolls
  right to left at a set scale (m per second). Keys: `drawAt` (draws on along its length, 0.6 s); **`report`** (at
  `reportAt`, each app car's start lands as an orange node dot at the tape position of its `goAt`, behind the cursor,
  staggered 0.25 s, a short drop of 0.15 m); **`timelapse`** (keys of a scroll speed and a time scale, so ≈ 5 cycles fit the
  tape at the peak, with synthetic bunches of 3 to 6 dots landing at the cursor each cycle at seeded small offsets, bunch
  fronts exactly one cycle apart); **`brackets`** (ink brackets between neighbouring bunch fronts, the § 6 bars-mode bracket
  look, drawn on one after another, no digits; `pulseAt` thickens them once); **`predict`** (the last bracket's copy slides
  forward ahead of the cursor, 0.4 s, and an **orange marker**, an `EventPin`-style dot on a short stem, lands at its far
  end: the next green); **`gapBar`** (an orange bar from the cursor to the marker, shrinking as the tape scrolls, `at` /
  `until`); `fadeAt`. Halo sums ≤ 25 % (§ 5): one halo per bunch, never one hull for the whole tape. The trace stays for the
  rest of each C visit and is off-frame at `signal`. Approved (v0.18.15 § 5): **x 120–888, y 288–1000 whenever it carries an event**.
- **N7 · Detector calls and the decision at U** (changed). (1) **Call:** when a car's front wheels cross a loop (from its
  motion, or a `callAt` key for a car standing on it), the loop's sealant outline takes an orange edge (0.3 s, the "made by"
  edge weight) and a pulse (a short bright segment with a node-dot head) rides the lead-in to the pull box, then along the
  curb's top edge to the cabinet (0.6 s), on the cable route (§ 5 "along a cable"). The controller's LED turns `orange` on
  the first call and stays lit for the scene (§ 5 Bleed, Trace). (2) **Decision:** on `decideAt`, the LED flashes and a pulse
  runs from the cabinet up the mast pole and along the arm to the heads (0.5 s), riding on them; the yellow comes on its own
  `signal` key. No orange on the cars or the lenses.
- **N8 · Pedestrian at U: dropped** (no walk-signal beat).
- **N9 · The ghost box** at U: `GhostLines` drawing the China countdown box's outline beside the middle head (§ 3: 3 px, dash
  16 / gap 10, `CHARGE.ghost`, draws on 0.8 s, fades 0.7 s); keys `ghostAt`, `ghostFadeAt`, and optional
  `ghostDigits: {at, d}[]` (dashed ink seven-segment outlines, **dash 8 / gap 5 px, ≥ 40 px tall**, each appearing whole in 3 frames and replacing the one before; keys `3` 15.36, `2` 15.72, `1` 16.08; `1` fades over 6 frames from 16.40) per F7 (v0.18.15).
- **N10 · Car speed-up: dropped** (car A keeps its speed through the yellow; `CityCar` cruise already does this).
- **N11 · `section-lab` dressing `'timing-check'`.** The Lab block (§ 3), Day. On the back wall a dark panel (`device`) ≈ 2.4 ×
  1.6 m with a **100 × 100 grid of cells** (≈ 6 px each at `grid`): unlit `ledOff`; **lit pale** behind an **orange wave**
  (halo-only, ≤ 25 %, a soft band sweeping left to right over 1.8 s, `waveAt`); on `resolveAt`, in a 0.6 s sweep, ≈ 77 %
  (seeded) turn **solid ink-light** (`cut`) and the rest a **hollow ink outline**; `blinkAt` on the hollow ones. Two
  researchers (extra and `EXTRA_B`) on stools at a bench, laptops with lids toward them, `type` and `lean-in`. Nothing
  readable; the grid a plain square, no map shape. Framings `wide` and `grid`.
- **N12 · The loop seam.** Frame 0: C `signal` at its starting distance, red with the box at `23`, the queues of sc 1 with every
  brake lamp lit, the phone lit, the driver's pose, the e-scooter rider. Last frame 2425: the same framing, cars at the same
  rest points, lamps lit, the box at `24`, no orange (tape and dots off-frame or faded), `loop: true` for the drivers' idle,
  `drift: 0` or phase-locked.

## The loop seam plan

1. **Frame 0 (scene 1):** C `signal`, Day, 8:12 AM. Red, box `23`. Two 4-car queues, brake lamps lit, the phone car at the front
   of lane 3 (phone lit). Title block up, slow push.
2. **Last shot (scene 16):** a slide into C a little wider than frame 0 on "or run on a timer?", then the slow push landing on
   frame 0's framing and distance at the last frame (2425, 80.83 s).
3. **Phase-locked:** the countdown (`24` → `23` across the seam), the drivers' idle, the e-scooter rider, wheels at rest, drift.
4. **Words:** the voice ends at 79.36; captions gone for the last 1.5 s. "…or run on a timer?" hands over to "In China, many
   traffic lights count down for drivers".
5. **Check:** `yarn stills light-countdown --frames=0,2425`, compare the two PNGs, then the motion in Studio.

## For the publisher's 🎭 "Illustrative:" line

The intersection and its traffic, drawn once as a Chinese-style corner and once as a US corner; the signal timings and
countdown numbers; the generic map app (no real app shown); the dots over the cars and the tape where the starts land, drawn
to show the idea in the method's patent (not the app's actual system); the 10,000-cell grid standing for the study's
intersections; the "warnings before the yellow" drawn as an outline at a US light that has none; the two drivers at the
yellow.

## Sound (note only, for later)

Physical sounds only: a daytime city bed (the No. 015 `city` bed, re-mixed), idling engines at the red, tire roll and a light
acceleration at each pull-away, car B's stop. At U, the cabinet's relay click on the decision (27.36), very low. The Lab:
keyboard taps. No sound for orange, the tape, cards, digits or ghosts, no beep on the countdown. A soft whoosh on each slide
(six; keep them low). Over 60 s, so our own music.

## Spec notes (spec.ts, after the visual review FIX, 2026-11-12)

Where `spec.ts` departs from the tables above (values only; lines, cues and scenes unchanged).

- **Tape in the air** (owner, v0.18.16): `tape.x` [12, 24] m up the street, `y` 4.0 m, `across` 8.25 (straight over lane 3): the
  line passes right above the queue's roofs on screen. Over lane 2/3's line (the default) or further up the street it
  projected onto the far sidewalk or the cross street and read as paint on the ground. Framings above. Nothing in the China scenes is underground.
- **Scene 9:** the app cars are the phone car and both lanes' 3rd and 4th cars (5 of 8), the cars `queueTape` shows; the
  2nd cars, further up, have none (the contrast on "drivers using it").
- **Scene 11:** the phone car is 4th in lane 3; the app box is on the right, top 600 (bottom ≈ 930, below the floating tape; no trails in scene 11; the red reads 40 as the box enters.
- **Scene 4:** opens close on the heads (look [4.5, 5.5, −49], 17: ghost digits ≈ 80–120 px), glides at 16.10 to a wider
  `approach` (look [6.6, 2.8, −29], 62) that holds both cars from the yellow and both heads; B brakes from 16.60 to rest
  at 18.40; A is past the line by ≈ 17.9.
- **Scene 3:** `count` at distance 21 (the builder's 25).
- **Frame 0 and the loop:** `signal` 1.0 m higher (the heads ≈ 85 px lower, ≥ 40 px under the title), the same at both
  ends.
- **Scene 5:** B pulls away with `goSpeed` 10 / `goRamp` 2.5; C and D cross the loop at 24.5 and 25.5; `decideFor` 1.4
  (from "just" to "changes").
- **Scene 15:** `loops` 0.95 m higher, YOU's car ≈ 100 px lower, clear of the caption.
- **`trees: false`** everywhere: the far street trees sat behind the heads and the countdown box.
- **Review round 2:** scene 4 digits framing look [2.35, 4.4, −52.7], 14 (box ≈ x 670–920, y 400–645, digits ≈ 140 px);
  the approach framing look [6.0, −3.4, −27], 70 (A and B whole at y ≈ 800–960 from the yellow, B's stop ≈ y 700, above
  the captions). Tape framings: `queueTape` look [8.4, 1.6, −16.4], 36; `tape` look [8.65, 2.0, −17], 31 (line at
  y ≈ 530–840, cars filling ≈ 600–1450). Scene 11's app box top left, top 288, size 300, over the buildings and clear of
  the queue and the tape.
- **Sound pass** (owner-approved music, 81 s): music 9 dB under the voice from frame 0, fading at both ends. Beds split per
  scene with 0.15 s cut fades: city at both corners (25 under), room tone in the Lab (32), idles at every red (22),
  engine-work for the cars moving through (scenes 4, 5, 8–9; 22), the cabinet hum while it is open on screen (scenes 5 and
  15; 28), keyboard taps in the Lab (26). One-shots: pull-aways on the greens (scenes 3, 5, 8, 15), B's soft brake (16.60),
  the cabinet relay on the decision (27.36). Files in `audio/sfx/` (copies from flock-camera, ev-cost, home-heat; the hum,
  the tick and the keys made locally, free). Audio-only render: −22.10 LUFS integrated (voice alone −22.33), true peak
  −3.8 dBTP, no clipping.

