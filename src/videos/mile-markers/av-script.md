# No. 009 · Mile markers: audio + visual script

Draft 1 by the director, 2026-10-26, for the **approved 11-line script** (157 words), before voice. Inputs:

- `script.txt` and `sources.md` (fact-check PASS; the 🎭 list; § E visual details: D10-3 sign, exit plaque);
- `brand/style-guide.md` v0.12, `CLAUDE.md`;
- the No. 007 and No. 008 A/V scripts (format, owner rules);
- the parts as built: `highway-slice` (`HighwaySliceScene`, `section/HighwaySlice`, `real/RoadSigns` with the real D10-3
  `mile` sign, `real/DrivingCar`, speed / lateral / brake support, Night mood from No. 005), `car-slice` / `SlicedCar` with
  `road: 'highway'`, `real/UtilityTruck`, `TirePieces` `RadioPulse`, `OrangePath`, `Counter`, `Callout`, `DetailBox`,
  `NameTag`, `TitleBlock`. `city-slice`, `musical-road` and `race-slice` were checked and aren't used (city street, desert
  road, drag strip).

`performance.txt` and `voice.json` are the voice agent's (written in parallel); I don't touch them. Pause ideas for them are
in § Pause notes.

## Owner rules applied (from No. 006–008 and this brief)

- **Frame 0 reads in the first second:** YOU's car on the interstate with **MILE 150** and the **EXIT 150** sign up the right
  verge, both readable.
- **The camera moves one way.** Each location visit gets one dive and one pull-out, never close → wide → close. Every scene
  starts where the last one ended. Road scroll, wheel spin, speed, hazard phase and lighting carry across cuts (§ Camera path).
- **Realistic road and car fill the frame:** highway-slice's real asphalt, paint, gravel and signs; the whole car (RealCar) or
  the cut car (SlicedCar). No toy shots, no empty sky shots.
- **The mile marker looks real:** a narrow D10-3 sign, 12 in × 48 in, white **MILE** over the digits **stacked vertically**,
  white border on green, on one thin post on the right shoulder, panel bottom 4 ft up. It's already built (`RoadSigns`
  `'mile'`). **No big green panel** for the marker. Exit signs are green guide signs with the **"EXIT 150" plaque** on top
  (new, M2).
- **Orange only for the hidden system:** the mile count (the ruler), the marker ↔ exit link, the 58-mile stretch, and the
  location link (phone → dispatch, sign → dispatch, the rough circle → the pin).
- **Night from line 5:** the car dies on a dark rural stretch, hazards on, the sign beside it. Help arrives with flashing lights,
  generic, no branding.
- **Stopped cars show lit lamps:** brake lamps as the car stops, then hazards blinking. The service truck's brake lamps light when
  it stops.
- **Physical sounds only:** no whooshes, no whines, no risers. A music bed from frame 0, about 12 dB under the dry voice
  (§ Sound plan).
- **A scene change every 3–6 s**, one idea per scene.
- **Title line 2:** this is **No. 009**. No. 007 is ev-acceleration, No. 008 is drive-by-wire. No spec or A/V script uses
  009 yet; the parked self-checkout also used "No. 007" but never shipped.

## Times

The estimates come from `transcript.json` (`yarn timings`, generated from today's script): **61.5 s** spoken, plus a ≈ 2.0 s
end hold (§ Frame 0 and the loop), so ≈ **63.5 s**. The estimator counts every number as one word, but the voice will say
"one fifty" (×3), "ninety-two" (×2), "fifty-eight", "nine one one" and "one thirty-seven". **The real take will run ≈ 2–4 s
longer.** It's over 60 s, so the music must be **our own bed** (style guide § 9 Licensing). Re-time everything against the
real take before writing `spec.ts`.

## Mood and story time

**Recommended (owner decision D1, § Decisions): Day for lines 1–4 and Night from line 5.** The change happens on the slide to
the dark stretch: a mood change on a location change is allowed (§ 4) and costs nothing. The **loop** needs frame 0's mood
on the last frame. The last scene (line 11, at night) therefore uses the video's **one time-passes beat in the end hold**:
Night blends to Day over 1.5 s and lands on frame 0's picture. It reads as the night passing, and nothing is spoken over it.

Story time (🎭): a summer evening. Frame 0 is daylight at **7:50 PM**, and the breakdown, forty minutes past Exit 92, falls
after dark. If the owner picks all-Night (D1 option c), the title time becomes **9:40 PM**, the brief's example.

## The world

Four slices, joined by `slide` (18 frames, **no whoosh**). Inside a slice every framing change is a `continue` glide.
Every slice is a **highway-slice**, except K.

- **A, the exit (Day; Night at the end).** The No. 005 interstate, dry, light traffic far ahead. YOU's cobalt car is whole,
  in the right lane, driving away from the plane. On the right verge, near to far:
  - **MILE 150** (D10-3, stacked 1 / 5 / 0);
  - ≈ 15 m beyond it, the **exit direction sign**: a green guide panel with a white up-right arrow and a generic legend, no real
    place and no shield (🎭, e.g. "Town Center"), under the green **EXIT 150** plaque.

  The default SPEED LIMIT and NEXT EXIT signs are removed. A is frame 0 and the last scene.
- **S, the state line (Day).** The same interstate, but **the cut plane is the state line**. A node on the cut face at the
  shoulder edge is the count's zero, and a `Callout` names it. Up the verge, **markers 1, 2, 3 … at a compressed spacing**
  (🎭, ≈ 40 m apart instead of 1,609 m) so that several stand in view like a ruler's ticks. Exit signs appear only when their
  number matches a marker (EXIT 92 beside MILE 92, scene 4). S then becomes the drive north: markers **stream past** with the
  road (M1). In fast-forward the count climbs to 92, then real speed returns at Exit 92.
- **B, the dark stretch (Night).** A rural section with nothing around: **no traffic, no guardrail, no exit, no lights**,
  dark grass verges and the Night sky. The only sign is **MILE 137**. YOU's car runs with headlights and tail lamps on. The
  engine dies, the car coasts onto the shoulder and stops with the marker **beside its front right**, in the edge of the
  headlights' spill. Brake lamps light as it stops, then hazards blink. Later a **highway service-patrol truck** (D3) comes up
  the shoulder with its light bar flashing and stops right behind YOU's car, beside the sign.
- **K, YOU's car cut open, stopped on the dark shoulder (Night).** `car-slice` on `road: 'highway'`, YOU's No. 008 gas sedan,
  speed 0. **YOU sits whole, in profile, phone at the ear** (new pose, M7), screen toward the face. The cluster's hazard arrows
  blink, the rear lamps blink outside, and dark windows show nothing beyond.

**Colour: orange is the system only** (core at `VIB_R` 0.0225, node dots, no spill):

- **The ruler (the mile count):** an orange line on the ground along the right shoulder's outer edge, with a short tick at
  each marker's foot. It moves with the road. Its zero is a node on S's cut face.
- **The same count:** a short orange link from a marker's foot to the exit plaque's post (scene 4).
- **The 58 miles to go:** the ruler ahead of the car brightens from the 92 tick into the haze (scene 5).
- **The location link:**
  - rings from YOU's phone on the call (`RadioPulse`, orange);
  - on the dispatch map in the detail box, the **rough-location circle** (translucent orange, soft edge: approximate);
  - at line 10, a link drawing **sign → car → up and out of frame**, while the circle **collapses to a pin** on the map.
- **Marks on the sign:** a node on MILE 137 when it's read, and a brief tick at MILE 150 at the end (fades before the hold).

**Not orange:**

- the signs (green `HIGHWAY.signGreen`, white legend);
- YOU's tail, brake and rear hazard lamps (flat red, never bloomed);
- the front hazard corners and the patrol truck's light bar (`warning` yellow, flat, no bloom; D3, D6);
- the cluster's hazard arrows (`signalGreen`);
- headlights (white), the yellow left edge line (check it at Night, style guide § 1 open check);
- every card, callout, counter digit, tag and caption.

**No orange text anywhere.** The subtraction is drawn in 3D as the orange stretch of the ruler, with the numbers in an ink
`Counter` (§ Line flags, line 4).

## Title block

Frame 0 to the end of scene 1. It fades over 5.0 → 5.33 s, before the slide.

- **Line 1, no spoken question (D2).** The style guide wants the question "as the voice will ask it", but this script asks
  none: line 1 is a statement. Recommended: **`What do exit numbers count?`** (27 characters, one line), answered at once by
  the voice. Alternative: `Why is it called Exit 150?` (26).
- **Line 2:** **`NO. 009 · THE INTERSTATE · 7:50 PM`** (or `9:40 PM` with all-Night).

## Framings (the fixed 3/4 angle, fov 26°; distances are targets, set on test stills)

| Name | Size | Where | Readable |
|---|---|---|---|
| `exit` (new) | MW, ≈ 35 m | A: YOU's car lower left, MILE 150 and EXIT 150 up the right verge (the No. 005 `signs` framing, re-aimed) | **Frame 0 and the last frame.** Each marker digit ≥ 28 px tall, the plaque's "EXIT 150" ≥ 32 px, the car ≥ 220 px wide, the signs below the title block (y > 450) |
| `line` (new) | W, ≈ 90 m | S: the cut face (the state line) along the bottom, the road in depth, markers 1–4 up the verge | The zero node and the ruler; the markers as shapes |
| `signs` (exists) | MW, 35 m | S: the verge 30 m up, where markers stream past | Each passing marker's digits |
| `stop` (new) | M, ≈ 22 m | B: YOU's stopped car whole, the marker beside its front right, **the cut plane below the frame edge** | Hazards, brake lamps, the sign's shape |
| `marker` (new) | C, ≈ 5 m | B: MILE 137 beside the car's front corner | Digits ≈ 120 px each, the sign ≈ 520 px tall, inside the subject band (y 470 to 1030) |
| `help` (new) | MW, ≈ 45 m | B: car, sign and the shoulder behind, with ≈ 3 marker ticks of the ruler; the plane still out of frame | The patrol truck's arrival, the ruler |
| `cabin` / `car` (exist) | M / MW | K: YOU and the phone / the whole cut car on the shoulder | The phone at the ear; the dark windows |

**Subject band:** on C and M shots the subject sits between y ≈ 470 and 1030, clear of the captions (bottom y 1188) and the
title block (to ≈ y 430).

## Camera path (one way)

| Visit | Beats (spec scenes) | Path | Move |
|---|---|---|---|
| A, first | 1 (1) | `exit` (frame 0, drift 0) → a little wider | Holds to 1.0 s, then one slow pull-back (the visit's pull-out) |
| S | 2–4b (2–6) | `line` W → `signs` MW → slow push | Slides in wide, **one dive** at beat 3a, then only pushes |
| B, first | 5a–5b (7–8) | MW behind the car → `stop` M | Slides in, **one dive** as the car stops (the dive continues in B's second visit) |
| K | 6–7b (9–10) | `cabin` M → `car` MW | Slides in close, **one pull-out** |
| B, second | 8–10b (11–15) | `stop` M → `marker` C (end of B's dive) → `help` MW | Slides in exactly as B's first visit ended, pushes in to the sign, then **one pull-out** |
| A, last | 11 (16) | a little wider than `exit` → `exit` | Slides in, **one glide in** landing on frame 0's framing by 60.5 s, then drift 0 |

State carried by hand across the slides (car-slice and highway-slice carry only between back-to-back scenes):

- speed ≈ 30 m/s (67 mph, so Exit 92 → MILE 137 in 40 min agrees with sources.md S5);
- the wheel phase and road scroll;
- the stopped car's position, lamps and **hazard phase** (blink on the video clock, not the scene clock, so B → K → B never
  jumps);
- headlights on at Night.

## The table

Times are the estimated transcript's (each beat starts on its cue word's start). Beats are numbered by script line (a/b where a line is split); § Spec scenes maps them to spec scenes 1–16, which the rest of this file uses.

| Beat | Words | Cue | In → out (s) | Shot | On screen | Camera | What moves (2–3 s rule) | Transition into next | Overlays | SFX idea | New or existing | Flag |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | On most interstates, Exit 150 is about 150 miles from the state line. | `On most interstates` | 0.00 → 5.46 | **MW** (`exit`) | **Frame 0**, Day: YOU's car in the right lane, wheels turning, road streaming; up the right verge **MILE 150** and the **EXIT 150** sign. Nothing orange | Holds (drift 0); slow pull-back 1.0 → 5.0 s | On "Exit 150" (1.64) the camera still holds on the sign pair. On "150 miles" (2.98–3.29) **the ruler draws** from MILE 150's foot **back along the shoulder toward the plane**, a tick at the marker. On "state line" (4.37) it runs **off the cut face**, down and out of frame (the way back to zero) | `slide` (no whoosh) | **Title block** (fades 5.0 → 5.33), captions | Music from 0 (1.5 s fade-in); tire roar (dry hiss) and a light engine bed | **New:** `exit` framing, EXIT plaque sign (M2), ruler (M3). Existing: highway-slice, `mile` sign, DrivingCar | Frame 0 must read with no orange. The ruler pointing "back" sets up the slide to the state line |
| 2 | The count starts at the state's south or west end and goes up from there. | `The count starts` | 5.46 → 11.03 | **W** (`line`) | **S:** the interstate cut at the state line, YOU's car just past the plane heading north (away), markers 1–4 up the verge (compressed) | Slides in; slow push | On "count starts" (5.77) the **zero node lights on the cut face** at the shoulder edge; on "south or west end" (7.67–8.7) the callout is up; on "goes up from there" (9.32–10.3) **the ruler draws up the road** and the ticks at markers 1, 2, 3, 4 **light one after another** into depth | `continue`, glide to `signs` | **Callout** `STATE LINE`, sub `Mile 0`, leader to the zero node, 6.4 → 9.6 | Same road sound, carried | **New:** S (M1 compressed markers, M3 zero node). Existing: `Callout` | "South or west" is spoken only; the picture shows "south" (the car drives north). Compressed spacing is 🎭 |
| 3a | If you're driving north, you pass a little green sign every mile, | `If you're driving` | 11.03 → 15.82 | **MW** (`signs`) | The verge, markers **streaming past** in fast-forward, each a real D10-3 with a higher number | Glide in 11.0 → 11.8 s (S's one dive) | Markers stream past (≈ 1 every 0.7 s), **their numbers jumping up** (4 … 30 … 55 … 80 … 89); at each one **its ruler tick lights as the car passes**. On "little green sign" (13.66–14.53) one passes close and slow enough to read | `continue` | **Counter** (ink), top left in the sky band, label `MILE`, rolls 4 → 89 with the stream, 11.6 → 15.6 | Tire roar steady | **New:** marker stream with a count function and fast-forward (M1) | Fast-forward and skipped numbers 🎭. If the stream reads as flicker, slow it to 3 markers |
| 3b | and the exit numbers follow the same count. | `and the exit numbers` | 15.82 → 19.17 | **MW** (`signs`, slow push) | The stream slows to real speed: **MILE 92**, then just beyond it the **EXIT 92** sign | Slow push | On "exit numbers" (16.44) the EXIT 92 sign arrives; on "same count" (18.08) **an orange link draws from MILE 92's foot to the plaque's post**, a node at each | `continue` | Captions | — | M1, M2, M3 (link) | The pair is the whole idea, so no card |
| 4a | When you get to Exit 92 on your way to 150, | `When you get to` | 19.17 → 22.69 | **MW** | YOU's car **passes EXIT 92**; the road ahead runs into the haze | Slow push | On "Exit 92" (20.41) the car is level with the sign; on "on your way to 150" (21.29–22.22) **the ruler ahead of the car brightens** from the 92 tick up the road, running out of sight (the 58 miles) | `continue` | Captions | — | M3 (segment brighten) | Exit 150 is never on screen here: 58 miles can't be, even compressed |
| 4b | you've got roughly 58 miles to go. | `you've got roughly` | 22.69 → 25.43 | **MW** | As 5a, the bright stretch ahead | Holds, slow push | **Counter** rolls to **58** on "58" (23.92); the bright stretch pulses once along its length | `slide` (to B; Day → Night) | **Counter** (ink), sub `150 − 92` above, digits 0 → 58, unit `mi`, 22.9 → 25.3 | — | Existing `Counter` | Numbers only as spoken; "roughly" stays in the voice (S4). **No orange text:** orange is the 3D stretch, the card is ink |
| 5a | Forty minutes past Exit 92, | `Forty minutes past` | 25.43 → 27.49 | **MW** behind the car | **B at Night:** the dark stretch, nothing around; YOU's car, headlights on the road ahead, tail lamps lit | Slides in; slow push | The car **driving** (speed carried), headlight cones sweeping the dark verge; nothing else moves (the emptiness is the point) | `continue`, glide to `stop` | Captions | Night bed (wind, faint crickets) under the tire roar | **New:** B (existing props: `traffic: []`, `guardrail: false`, `signs` with MILE 137 only, Night) | The slide and the mood change carry the forty minutes; no clock card |
| 5b | your engine dies on a dark stretch with nothing around. | `your engine dies` | 27.49 → 31.66 | **MW → M** (`stop`) | The car slows, drifts right onto the shoulder and stops; **MILE 137** stands beside its front right in the edge of the headlights | Glide 27.5 → 28.3, then follows the stop (B's dive) | On "dies" (28.31) the **engine note cuts**, speed decays over ≈ 2.5 s (coasting), the car drifts onto the shoulder; **brake lamps light** as it stops (≈ 30.6), then **hazards start blinking** (≈ 31.0, rear lamps red, ≈ 1.4 Hz) | `slide` (to K) | Captions | **Engine sputter and die**; gravel crunch as it rolls to a stop; first **hazard ticks** | **New:** car stop with `brake` and hazard keys (M4), `stop` framing. Existing: speed and lateral keys | "Nothing around": no other light source in frame; the Night rim keeps the car readable (§ 2 Night floor) |
| 6, 7a | You call 911. / Your phone usually sends a rough location, | `You call 911` | 31.66 → 35.99 | **M** (`cabin`) | **K:** YOU in profile in the stopped cut car, **phone to the ear** (screen toward the face, its light on the face); the cluster's hazard arrows blinking | Slides in on `cabin`; holds | On "call" (31.97) the **phone comes up to the ear**; on "911" (32.33) **orange rings leave the phone** up through the roof (the location going out); on "rough location" (34.86) the detail box enters: a dark map, one road line, a **wide translucent orange circle** over a long stretch of it, its edge soft and slowly breathing | `continue`, pull-back to `car` | **Name tag** `YOU` 31.9 → 33.6 (first clear appearance); **detail box** `dispatch-map` (new), right side, leader to the phone, 34.5 → 37.8 | **Phone dial** (three keypad tones, then a US ringback), low; hazard ticking continues | **New:** phone-at-ear pose (M7), K at Night stopped with hazards (M7), `dispatch-map` box (M8). Existing: `RadioPulse`, `NameTag`, `DetailBox` | 🟡 "usually sends a rough location": the circle must read as approximate (soft edge, breathing), not as wrong or failing (sources.md D3, S6) |
| 7b | but you can't say where you are. | `but you can't` | 35.99 → 38.63 | **M → MW** (`car`) | The whole cut car on the dark shoulder, nothing outside the windows | One pull-back 36.0 → 37.2 s (K's pull-out) | On "can't say" (36.61) YOU **turns the head to the window, then ahead** (two glances); the box leaves (37.8); outside, only darkness and the blinking rear lamps | `slide` (back to B) | Captions | Hazard ticks; the ringback cuts to silence as the call connects (a soft click) | M7 (glances) | Short (2.6 s) but it has its own move and event |
| 8 | Then you spot the little green sign beside your car, and it reads 137. | `Then you spot` | 38.63 → 44.10 | **M → C** (`stop` → `marker`) | **B, as it was left:** the stopped car, hazards blinking (phase carried), the marker beside the front corner | Slides in on `stop`; one push to `marker`, 39.3 → 41.0 s (the end of B's dive) | On "spot" (39.30) the push starts; on "beside your car" (41.20) the sign fills the frame, the hazard flashes catching its edge; on "137" (43.47) the digits are crisp, **MILE / 1 / 3 / 7**, and **an orange node lights** at the sign's post | `continue`, pull-back | Captions | Hazard ticks | **New:** `marker` framing. Existing: the D10-3 sign (with Overpass lettering, M2) | Must look like the real sign: narrow, stacked, thin post, 4 ft up. Optional motivation for the sign "catching": YOU flicks to high beams on "spot" (owner's call; default no) |
| 9a | That sign is there partly for moments like this, | `That sign is` | 44.10 → 47.65 | **C → MW** | Pulling back from the sign to the car and the shoulder | One log pull-back 44.1 → 47.0 s (B's pull-out begins) | The **ruler lights from the 137 tick** both ways along the shoulder; ticks at 136 behind and 138 ahead (compressed 🎭), each at a small dark marker | `continue` | Captions | Night bed, hazard ticks | M3 | "Partly" stays in the voice (S8); no on-screen claim |
| 9b | so crews can find a breakdown or a crash. | `so crews can` | 47.65 → 51.01 | **MW** (`help`) | The car and its marker, the ruler along the dark shoulder | Slow pull to `help`, landing 48.5 | On "crews can find" (47.91–48.63) **a pulse runs along the ruler and stops at the 137 tick** (that number is an address); the node at the sign pulses | `continue` | Captions | — | M3 (pulse) | **No crash on screen** (tone); "crash" is spoken only |
| 10a | You read that number to the dispatcher, | `You read that` | 51.01 → 53.89 | **MW** (`help`) | As 10b | Holds, drift | On "read that number" (51.32–52.04) **an orange link draws sign → YOU's car → up and out of frame**; on "dispatcher" (53.07) the detail box shows the map again: **the circle collapses to a pin**, `MILE 137` in ink beside it | `continue` | **Detail box** `dispatch-map` (pin), right side, leader to the car's window, 52.2 → 53.9 | — | M3 (link), M8 (collapse) | The box must leave before the truck's motion takes over (one idea per frame) |
| 10b | and help pulls up right beside it. | `and help pulls` | 53.89 → 56.68 | **MW** (`help`) | The **service-patrol truck** comes up the shoulder from below the frame edge, light bar flashing, and stops right behind YOU's car beside the sign | Holds (the end of the pull-out) | On "help" (54.20) the truck enters; on "pulls up" (54.56–54.97) it slows, **brake lamps lit**; on "beside it" (55.64) it stops; light bar and hazards blink out of step | `slide` (to A at Night) | Captions | **Diesel approach**, gravel crunch, a short air-brake hiss; no siren (D3) | **New:** the patrol truck with light bar and drive keys (M6) | It enters from below the frame, never through the cut plane (keep the plane out of `help`) |
| 11 | On a night drive, it's worth noticing the last mile marker you pass. | `On a night drive` | 56.68 → end (≈ 61.5 + 2.0 hold) | **MW**, landing on **frame 0's picture** (`exit`) | **A at Night:** YOU's car driving with headlights; MILE 150 and EXIT 150 bright in them (retroreflective); traffic tail lamps far ahead | Slides in a little wider; glide in to `exit` by 60.5; drift 0 | On "last mile marker" (59.72–60.44) **a brief orange tick lights at MILE 150's foot** and fades by 61.5 (noticed, then gone). In the hold (≈ 61.6 → 63.1) **Night blends to Day** (the time-passes beat): headlights and tail lamps fade off as the sky lightens, landing on frame 0 | **Loop** to frame 0 | Captions end before the hold | Cruise sound as frame 0; music ends in silence on the last frame | **New:** highway-slice time-passes (M9) | The fact-checker's note: no head turn or looking away from the road; the marker passes in the headlights, seen from outside |

### Spec scenes

**16 scenes** in ≈ 63.5 s (≈ 4.0 s each):

| Scene | Slice | Cue | In → out (s) | Beat | Shot |
|---|---|---|---|---|---|
| 1 | A (Day) | `On most interstates` | 0 → 5.46 | 1, title block | MW |
| 2 | S | `The count starts` | 5.46 → 11.03 | 2 | W |
| 3 | S | `If you're driving` | 11.03 → 15.82 | 3a | MW |
| 4 | S | `and the exit numbers` | 15.82 → 19.17 | 3b | MW |
| 5 | S | `When you get to` | 19.17 → 22.69 | 4a | MW |
| 6 | S | `you've got roughly` | 22.69 → 25.43 | 4b | MW |
| 7 | B (Night) | `Forty minutes past` | 25.43 → 27.49 | 5a | MW |
| 8 | B | `your engine dies` | 27.49 → 31.66 | 5b | MW → M |
| 9 | K | `You call 911` | 31.66 → 35.99 | 6, 7a | M |
| 10 | K | `but you can't` | 35.99 → 38.63 | 7b | M → MW |
| 11 | B | `Then you spot` | 38.63 → 44.10 | 8 | M → C |
| 12 | B | `That sign is` | 44.10 → 47.65 | 9a | C → MW |
| 13 | B | `so crews can` | 47.65 → 51.01 | 9b | MW |
| 14 | B | `You read that` | 51.01 → 53.89 | 10a | MW |
| 15 | B | `and help pulls` | 53.89 → 56.68 | 10b | MW |
| 16 | A (Night → Day) | `On a night drive` | 56.68 → end | 11, loop hold | MW |

**Notes on the scenes:**

- **Cues:** all unique searching forward. "On most interstates" and "On a night drive" differ from the second word; "Exit 92"
  is never used as a cue.
- **Rhythm:** MW | W | MW ×4 | MW | MW → M | M | M → MW | M → C | C → MW | MW ×3 | MW.
  - The day half is mostly MW on purpose: road and car fill the frame, the signs read, and the stream and ruler carry the
    motion.
  - The night half has the one close-up (the sign, scene 11).
- **Short scenes:** 7 (2.1 s), 10, 14 and 15 (2.6–2.9 s). Each has its own move or event. If the real take stretches the
  numbers, 7 and 8 can merge (one scene, two events).
- **Card budget**, never two at once, never with a tag:
  - title block (1);
  - callout STATE LINE (2);
  - mile Counter (3);
  - 58 Counter (6);
  - name tag YOU (9, before the box);
  - dispatch-map box (9 → 10, then 14).
- No statement cards, no X-ray, no full-frame screen.
- **Transitions:** 5 slides (1 → 2, 6 → 7, 8 → 9, 10 → 11, 15 → 16), no hard cuts, the rest `continue`.
- **Motion rule:** a camera move lands in every scene's first second, and a story event follows within 2–3 s (the ruler, the
  stream, the link, the stop, the hazards, the phone, the glances, the push to the sign, the pulse, the truck, the tick).
  Check in Studio playback.

## Sound plan (physical only)

Music: **our own bed**, ≈ 64 s (set to the real take), from frame 0 with a 1.5 s fade-in, ≈ 12 dB under the dry voice, no
duck, silent on the last frame. A generation is paid (ask first). Set every SFX `volume` from the file's measured LUFS (No. 008
method).

| Sound | Source | Where | Level under the voice |
|---|---|---|---|
| Dry tire roar, pitch with speed | **reuse** `sfx:hiss` (dry setting) | Scenes 1–7 and 16; falls away in 8 | ≈ 20 dB |
| Four-cylinder cruise | **reuse** `sfx:engine` | Under the day drive and 16, ≈ steady | ≈ 20 dB |
| **Engine sputter and die** | **extend** `sfx:engine` (tooling): two or three misfires, then the note falls to nothing over ≈ 1 s | Scene 8, on "dies" | ≈ 14 dB |
| Gravel crunch, rolling to a stop | self-made (new): filtered noise bursts slowing with speed | Scene 8 (the stop); scene 15 (the truck) | ≈ 16 dB |
| **Hazard ticking** (relay, ≈ 1.4 Hz) | self-made, `sfx:click` variant (lower, shorter) | From the stop (scene 8) through 15, on the video clock with the lamps; quieter outside the car (B) than inside (K) | ≈ 18 dB (K), ≈ 22 dB (B) |
| **Phone dial** (three DTMF keypad tones, then a US ringback, 440 + 480 Hz, 2 s on) | self-made (new), deterministic | Scene 9 on "call"; ringback under "rough location"; a soft connect click in scene 10 | ≈ 18 dB |
| Night bed: low wind, faint crickets | self-made (filtered noise + synthesized chirps) or a Freesound CC0 bed | B and K (scenes 7–15) | ≈ 24 dB |
| Diesel truck approach, a short air-brake hiss | **reuse** `sfx:engine` (low, diesel-like) + self-made hiss | Scene 15 | ≈ 15 dB |
| — | **No** slide whoosh, no whine, no siren (unless D3 picks a patrol car), no stingers | | |

### `music.txt` mood (proposal; the file isn't written)

> Calm instrumental bed for a late-evening drive, about 80 BPM, no drums, no lead melody. Warm felt piano and soft electric
> piano over a low analog pad, a slow steady pulse from a muted bass or softly plucked guitar. First third open and warm
> (daylight on the highway), middle sparse and darker with a held low note (a car stopped on an empty road at night), last
> quarter gently resolving. Ends in silence. About 64 seconds.

## Line flags (script approved; picture notes only, no word changes)

| Line | Flag | How the picture handles it |
|---|---|---|
| 1 | **No spoken question** for the title block (the § 6 default assumes one) | Title line 1 proposed (D2); it holds through line 1 |
| 1–2 | "the state line": which one? | The ruler runs back from 150 off the cut face; the slide lands on the state line with its zero (scenes 1, 2) |
| 3 | "a little green sign every mile": a mile is 1,609 m and the slice is 500 m deep | Compressed spacing and fast-forward (🎭, disclosed); one marker passes slow enough to read |
| 3 | 20 words (≈ 7.8 s) | Split at the comma (scenes 3, 4) |
| 4 | **Brief vs style guide:** the brief wants the 150 − 92 = 58 subtraction in orange; § 6 says cards are never orange | The orange is the **3D stretch of the ruler** ahead of the car (the system in the set); the numbers are an **ink** Counter. No rule bent |
| 4 | Exit 150 can't share a frame with Exit 92 | The bright stretch runs out of sight up the road; the Counter gives the 58 |
| 5 | "Forty minutes" is a time jump | The slide to the dark stretch with the change to Night carries it; no clock card |
| 6 | 3 words (≈ 1 s) | One scene with line 7a |
| 7 | 🟡 "usually sends a rough location"; the dispatcher's screen isn't anyone's phone on screen | The circle is soft and breathing (approximate, not failing); the detail box's leader goes to YOU's phone (what it sent). **Brand-director:** confirm a detail box may show an off-screen screen |
| 8 | "beside your car": staging | The car stops with the marker by its front right corner, in the edge of the headlights |
| 9 | Abstract ("partly", "crews", "a crash") | The ruler and the pulse homing to 137 (the number is an address); no crash drawn |
| 10 | Two events | Split at the comma (scenes 14, 15) |
| 10 | Help must arrive from behind, but the slice can't show a vehicle crossing the cut plane | `help` keeps the plane below the frame edge; the truck drives in from below |
| 11 | Advice: don't show a driver looking away from the road (fact-checker S10) | The marker passes in the headlights, seen from outside; a brief orange tick, no head turn |
| All | Numbers are spoken longer than estimated | Re-time on the real take; scenes 7/8 can merge |

## Pause notes for `performance.txt` (for the voice agent; I don't edit it)

Words unchanged. About one tag per three sentences:

| Line | Suggestion | Lands on |
|---|---|---|
| 5 | `[pause] Forty minutes past Exit 92,` | The slide from Day to the dark stretch |
| 8 | `Then you spot the little green sign beside your car… and it reads 137.` | The push landing on the digits |
| 11 | `[pause] On a night drive,` | The slide back to A |

## Reuse

| Part | Where | What it already does |
|---|---|---|
| `highway-slice` (`HighwaySliceScene`, `section/HighwaySlice`) | A, S, B | The cut interstate, Night and Day, the road scroll with shutter blur, YOU's whole car with `speed` and `lateral` keys, `headlights`, `tail`, `traffic` (or `[]`), `guardrail`, `signs` with `x`/`z`, `cameraKeys` (`log`), anchors (`youSpot`, `tail`, `sign:mile`) |
| `RoadSigns` `'mile'` | Every marker | The real D10-3: 12 × 48 in, MILE over stacked digits, white border on green, one U-channel post, bottom 4 ft up, retroreflective `retro` brightening in headlights |
| `DrivingCar` / `RealCar` | YOU's car, traffic | `brake` lamps (flat red) already built, not yet exposed by highway-slice |
| `car-slice` / `SlicedCar`, `road: 'highway'`, Night | K | The cut gas sedan (No. 008), YOU in profile, `brakeLights`, framings `cabin`, `car` |
| `UtilityTruck` | Base of the patrol truck (M6) | A generic white pickup with a service body, driver, wheels, unlit lamps; no light bar yet |
| `RadioPulse` (`TirePieces`) | The phone's rings | Orange rings, bloomed, fading as they grow |
| `OrangePath` (`VIB_R` 0.0225) | The ruler, links | Tube, halo, nodes, runner light |
| `Counter`, `Callout`, `DetailBox`, `NameTag`, `TitleBlock`, `Captions`, `sfx`, `music`, `transitions.ts` | Overlays, sound | As built |
| `sfx:hiss`, `sfx:engine`, `sfx:click`, `sfx:thump` | Sound | Self-made, deterministic |

Not used: `city-slice`, `musical-road`, `race-slice`, `street-slice`, the rumble grooves' orange (`grooveLit` must be 0
here), `impacts`, `shake`, `wet`, `curve`.

## Missing: scene-builder tasks (not requested yet)

M1–M5 and M9 touch `HighwaySliceScene` / `HighwaySlice` / `RoadSigns`, so they run in sequence (one worker). M6, M7 and M8
can run in parallel in separate worktrees. Audio belongs to tooling.

| # | Task | Mark | Files | Size | Short spec |
|---|---|---|---|---|---|
| M1 | **Marker stream and custom marker rows** | extend | `HighwaySliceScene.tsx`, `section/HighwaySlice.tsx` | medium | Signs that **move with the road** (today they're fixed at `SIGN_SPOTS`): a `markers` prop with a **spacing** (m, 🎭 compressed, e.g. 40), a **count function** (the number on each marker: start, step, and `rate` keys for fast-forward), and optional **exit pairs** (an EXIT n sign ≈ 15 m past marker n). Markers enter far up the verge and leave past the lower frame edge before reaching the plane (no cut sign). Static rows too (S's 0–4, B's 136–138). Anchors per marker (`marker:137`) |
| M2 | **Exit direction sign with the EXIT plaque; marker sizes; Overpass lettering** | extend | `real/RoadSigns.tsx`, `fonts.ts` + font file | small to medium | A new `'exit'` kind: green guide panel with a white up-right arrow and a generic legend (no place, no shield, 🎭), and the **green "EXIT nn" plaque** on top, white border, on two breakaway posts. The `'mile'` panel **sized by digit count** (12 × 24 in one digit, × 36 two, × 48 three, Table 2H-1) so MILE 0, 4 and 92 are right. **Sign lettering in Overpass** (OFL): approved by the owner 2026-10-18 and deferred to "the next highway video", which this is. Adding the font file is an asset; flag it to tooling if `fonts.ts` is theirs |
| M3 | **The ruler** | new | `HighwaySliceScene.tsx` (or a small `three/real/Ruler.tsx`) | medium | An orange line on the ground along the right shoulder's outer edge, in road space (it scrolls with the road), with a tick at each marker's foot. Props: `draw` keys (from a point, toward the plane or up the road), ticks lighting in sequence, a **zero node on the cut face**, a **link** marker-foot → exit post, a **segment brighten** ahead of the car, a **pulse** that runs and stops at a tick, a link **sign → car → up out of frame**, and a brief tick (on, fade). Radius `VIB_R`; nodes per § 5 |
| M4 | **Stopping car: brake lamps and hazards** | extend | `HighwaySliceScene.tsx` (`car.brake` keys → `DrivingCar` `brake`), `DrivingCar`, `RealCar` | small | Expose `brake` keys; add **`hazard`** (on from a time): the rear lamps blink **flat red** at ≈ 1.4 Hz on the **video clock** (so the phase carries across slides), the front corners `warning` yellow (D6); never bloomed. Headlights can stay on after the engine dies. New framings `exit`, `line`, `stop`, `marker`, `help` (the plane below the frame edge in `stop` and `help`, which needs `car.rear` ≈ 15–25 m); anchor `phoneWindow` (the driver's window, for the box leader) |
| M5 | **Dark stretch check** | reuse | — | small | B uses existing props (`traffic: []`, `guardrail: false`, one marker, Night). Test still: the car meets the Night subject floor (p50 ≥ 30%) with headlights on and no other light; add the § 2 rim if not. Check `lineYellow` at Night (§ 1 open check) |
| M6 | **Highway service-patrol truck** | extend | `real/UtilityTruck.tsx` (+ a drive mode in `HighwaySliceScene`, `helper` prop) | medium | D3 recommended: the white `UtilityTruck` with a **roof light bar** (two to four modules, **`warning` yellow**, alternating flash, flat, no bloom, no spill), headlights, tail and brake lamps; no lettering, no logo. A `helper` prop in highway-slice: drive keys along the shoulder from behind the camera (drawn only once wholly behind the plane), stopping at a set gap behind YOU's car; `brake` while slowing |
| M7 | **K: stopped at Night, phone call** | extend | `SlicedCar.tsx` / `CarSliceScene.tsx`, `section/Figure.tsx` | medium | The driver's **phone-at-ear pose** (right hand raises the phone to the ear in ≈ 0.6 s; screen toward the head; the screen light on the face, `screenLight`), keyed `call: {at}`; **glance** keys (head to the window and back); speed 0 on `road: 'highway'` at Night (the lane stops scrolling); the cluster's **hazard arrows** blinking `signalGreen` and the outside rear lamps blinking with M4's clock; orange **`RadioPulse` rings** from the phone up through the roof (`ringsAt`); anchor for the phone (box leader) |
| M8 | **`DetailBox` content `dispatch-map`** | extend | `components/DetailBox.tsx` (+ `screenKit` / `dashboardKit` as fits) | small | A generic dark map (Night UI `#121318`): one grey road line, a few faint terrain tones, **no labels, no real map, no brand**. A **rough circle** (translucent orange fill ≈ 20%, soft orange edge, slow ±4% breathing) with `radius` keys; on `collapseAt` it shrinks in ≈ 0.6 s to an **orange pin** on the road, an ink label `MILE 137` beside it (Inter 700 ≥ 28 px). Text ≥ 28 px |
| M9 | **Time passes on highway-slice** | extend | `HighwaySliceScene.tsx`, `section/HighwaySlice.tsx`, `Explainer.tsx` auto rule if needed | medium | D1 recommended: `moodFrom` / `moodAt` on highway-slice, **one render, light and colour blended over 1.5 s** (§ 4 Time passes): sky, palette, lights, headlights and tail lamps fade off, the signs' `retro` falls. Used once, in the last scene's hold, landing exactly on frame 0. Not needed with D1 option (c) |
| M10 | **Callout anchor on S's cut face** | extend | `HighwaySliceScene.tsx` | small | Anchor `rulerZero` (the zero node) for the STATE LINE callout |
| — | **Audio (tooling)** | extend + new | `scripts/sfx-drive.mjs` and siblings | medium | `sfx:engine` sputter/die; gravel crunch; a hazard relay tick (a `sfx:click` variant); DTMF tones + US ringback + connect click; the night bed (wind, crickets) or a CC0 file; a diesel approach and air-brake hiss. All self-made where possible, deterministic |

## Frame 0 and the loop

**Frame 0** (Day, 7:50 PM 🎭): A at `exit`, drift 0.

- YOU's cobalt car in the right lane, lower left, wheels turning, the road streaming;
- up the right verge, **MILE 150** (stacked 1 / 5 / 0, readable) and just beyond it the **EXIT 150** sign with its plaque;
- a far car's tail ahead in the left lane;
- sky under the title block.

Nothing orange. Readable: the title block, the two signs and the first caption.

**Last frame:** the same picture. Scene 16 lands on `exit` at Night by 60.5 s; the tick at MILE 150 fades by 61.5; captions
end. Then the one time-passes beat (≈ 61.6 → 63.1) brings back Day: headlights and tail lamps off, the sky and light as at
frame 0, the car and road state matching. On replay the cut to frame 0 adds only the title block. "…the last mile marker you
pass." leads back into "On most interstates, Exit 150 is…".

## Cover idea

Scene 11 at ≈ 43.6 s: the stopped car's corner, the hazards red, **MILE 137** filling the right half with its orange node.
Cover text: "This sign is your address." The publisher decides.

## For the publisher's 🎭 "Illustrative:" line

The sources.md line already covers the breakdown, the 40-minute drive and the numbers 92, 137 and 150. The picture adds:

- marker spacing compressed and the drive fast-forwarded on screen;
- the exit sign's legend;
- the dispatch map (a generic drawing; real 911 maps differ);
- the service truck;
- the story time.

## Decisions

**Decided by the owner, 2026-10-27 (final):**

- **D1 = (a):** Day for lines 1–4, Night from line 5, and the one time-passes beat (Night → Day) in the last scene's hold, so
  the loop lands on frame 0's Day picture.
- **D2 = (a):** title line 1 `What do exit numbers count?`; line 2 `NO. 009 · THE INTERSTATE · 7:50 PM`.
- **D3 = (a):** a generic highway service-patrol pickup with a `warning` yellow light bar.
- Frame 0 layout: the builder's compromise (`HIGHWAY_EXIT`: the car level with or just past MILE 150, the exit sign 8 m
  beyond) is accepted.

`spec.ts` is written against the recorded take (57.68 s of speech + a 2.0 s hold = 59.7 s). Where it differs from the table
above (16 → 14 scenes, value changes), the spec's header and the director's report list it.

**As first proposed** (kept for the record):

- **D1. Mood and loop.**
  - **(a) Recommended:** Day for lines 1–4, Night from line 5 (the brief), with the one time-passes beat in the last scene's
    hold so the loop lands on frame 0's Day picture. Needs M9.
  - (b) Day/Night without M9: the replay pops from Night to Day, an exception to the § 8 loop rule.
  - (c) All Night: frame 0 at night with the signs bright in the headlights, title time 9:40 PM, loop clean, no M9. Frame 0 is
    darker, and it departs from "Night from line 5".
- **D2. Title line 1** (the script has no spoken question). Recommended: `What do exit numbers count?`. Alternative:
  `Why is it called Exit 150?`. Line 2 follows from D1.
- **D3. Who brings help.**
  - **Recommended:** a generic highway service-patrol pickup (M6) with a `warning` yellow light bar. It's real (many states
    run them), cheap (UtilityTruck plus a light bar), and keeps amber-as-orange out.
  - Alternatives: a tow truck (a new, larger build), or a patrol car with red/blue lights. Red/blue needs a blue token from
    the brand-director, and that option adds the distant siren.

**For the brand-director** (values, not blocking the draft):

- **D6.** YOU's hazards: rear lamps blinking red, as on many US cars, and the front corners in `warning` yellow, since amber
  reads as the system.
- A detail box showing an off-screen screen (the dispatch map), with its leader to the phone.
