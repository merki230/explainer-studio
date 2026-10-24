# No. 007 · EV acceleration: audio + visual script

Revision 2 by the director, 2026-10-24, for the **owner-approved 13-line script** (205 words, `script.txt` as of 17:45), before
voice (playbook step 0). It replaces the first draft (11 lines, 196 words). Inputs: `script.txt`, `sources.md` (line map, § Physics
check, § H visual ideas, C1's fairness caveats), `docs/playbook.md` step 0, `brand/style-guide.md` v0.12, `brand/brand.md`,
`CLAUDE.md`, the No. 006 and self-checkout A/V scripts for format, and the parts in `src/scenes` (`car-slice` `variant: 'ev'`,
`city-slice`, `highway-slice`, `street-slice`), `src/three` (`real/EvDrive`: `DriveUnit`, `BatteryPack`, `PedalBox`, `footPose`;
`real/RealCar`, `real/RealWheel`, `OrangePath`) and `src/components` (`Counter`, `DetailBox` `ev-dashboard`, `Callout`,
`TitleBlock`).

**Fixed (owner, 2026-10-24; followed here):**

- The script's words (approved).
- **Orange push on both cars**: the push is the hidden system in the electric car and in the gas car.
- **Stacked lanes, the electric car on top** (the twin section, R below).

**Times** are estimates at 2.92 words/s from the script words only (as for No. 006): 205 words = **70.2 s**, plus a 1.0 s hold on
the loop frame ≈ **71.2 s**. At this rate the question runs 6.85 → 9.25 s (the coordinator's estimate is ≈ 8.6 s). Numbers are
spoken longer than they count ("797-horsepower" is five spoken words, "1,400" three), so the real take may run 1 to 2 s longer. **Over
60 s, so our own music or none** (still open, Decisions 6). There is no `performance.txt` yet; the pauses proposed below add
≈ 1 s. Re-time against the real take before writing `spec.ts`.

**Mood: Day**, a dry afternoon at a drag strip, story time 2:40 PM (🎭). Two locations, no time-passes beat.

## The world

Two locations: **R, the strip** (14 of 15 scenes), and **U, a drive unit cut open** (line 12). Inside R every framing change is
a `continue` glide, except **one hard cut** at line 3, back to the start line for the replay (still open, Decisions 3). R ↔ U by
`slide`.

- **R, the strip: the twin section** (new `race-slice`, N1; **owner-approved layout**). Two drag-strip lanes, each **cut lengthwise
  like `car-slice`**, drawn **one above the other** like two sections on one drawing sheet: **the electric car's lane on top, the
  gas car's lane below**, each with its own cut ground block (concrete launch pad then asphalt, hatched, ink cut edges), sky between
  and around them. Both cars face left (−x), cut along the near side, **whole cut cars at the fixed 3/4 angle**. It also reads as
  **two runs compared**, which is the truth: the testers' times come from separate runs (C1).
  - **The start line** in each lane: a white line across the lane, the **light column** for that lane just ahead of it on the
    infield side (a generic drag "tree" half: two stage bulbs, three ambers, one green, one red; no logos). Ambers lit in
    **`warning` yellow** (a lamp the driver is meant to see, § 1), green in `signalGreen` (No. 006's token), the red never lit.
  - **Distance boards** on posts beside each lane (generic black boards, white numerals: `60 FT`, `330 FT`, `1/8`, `1000 FT`),
    so the road scroll and the gap read. A guard wall behind each lane; low grandstands far behind the top lane, empty or with
    grey extras. No sponsor boards, no names.
  - **The electric car (top):** a generic two-door coupe (no maker's silhouette: not a Charger or any real car's shape), **all-wheel
    drive**: the No. 006 `DriveUnit` at the front **and a second one at the rear**, the `BatteryPack` cut lengthwise between them
    under the floor, inverters on top of each unit, HV cables, half-shafts out to the near wheels. The `PedalBox` with the driver's
    foot (`foot` keys). Driver: a grey extra, a tester (still open, Decisions 2).
  - **The gas car (bottom):** the same generic coupe class, another paint, **rear-wheel drive**: a generic V8 cut open (block, two
    pistons and rods in section, the crankshaft turning with `rpm`), the torque-converter or clutch housing, a **multi-speed gearbox
    drawn as a row of stacked gear pairs** (8 pairs, 🎭; still open, Decisions 4), the **active pair lit**, a driveshaft under the
    floor to the rear axle, the rear half-shaft to the near rear wheel. No supercharger or maker's engine look. Driver: a grey extra.
- **U, the drive unit** (new `drive-unit` object cut-away, N7). A generic **two-speed rear electric drive unit** floating on `bg` /
  `sky` like a slice (§ 3 object cut-aways): housing cut at its mid-plane, stator and rotor, **two gear stages** (a short first and
  a long second) with the shift element between them, the output to a short wheel stub with a tire segment and its contact patch.
  **Nothing from the Taycan's body or brand on screen**: the voice names it, the picture stays generic.

**Colour (owner decision: push orange on both cars).** Orange is only:

- the **drive paths**, on the energy-path radius (`VIB_R` 0.0225): electric, battery → inverter → stator windings → rotor → gears →
  half-shaft → wheel; gas, crankshaft → **the active gear pair** → driveshaft → rear axle → wheel;
- the **push arrows**: one at the contact patch of each driven wheel, lying along the road's cut face and pointing forward (−x),
  **its length the push** (🎭 scale; a node dot when it is zero). The electric car has two (front and rear), the gas car one
  (rear). The cars are told apart by lane (top or bottom) and by how the arrow changes (a smooth shrink or a sawtooth), not by
  colour;
- the system's marks on screens: the **power meter's fill** in the `ev-dashboard` box (line 9), the **"strongest" band** on the
  gas car's tach (line 8), the **chart's lines** (line 10);
- in U, the path through the **engaged gear stage** and U's push arrow.

**Not orange:** the ambers (`warning`), the green (`signalGreen`), tail lamps (`HIGHWAY.tailLight`, unlit), copper windings
(< 60% saturation), the engine block, gears not engaged, both paints (outside the band and ≥ 25° from YOU's cobalt), the
back-voltage arrow in line 7 (`ink`), the distance boards. No flames, no exhaust glow, no tire smoke.

**Title block** (frame 0 until just after the question, fading over the `[pause]` before line 3): line 1 the spoken question
without "So", `Why did its head start fade?` (28 characters, one line); line 2 `NO. 007 · THE DRAG STRIP · 2:40 PM` (🎭 story time;
the self-checkout draft also says "No. 007", see Decisions 7).

**Framing sizes** (the one fixed 3/4 angle, fov 26°; distances set on the test still):

- **C**, close: `line` (frame 0 and the loop: the two cars' front ends at the start line, stacked, each lane's light column at frame
  left; the electric car's front drive unit and the V8's front visible through the cuts); `evMotor` (the electric car's rear drive
  unit in section: windings, rotor, gears, the phase cables from the inverter); `gasBox` (the V8, the gear pairs and the rear wheel
  with its arrow, the bottom lane only).
- **M**, medium: `pair` (both drivetrains stacked: the electric car's two units, pack and two arrows above; the gas car's engine,
  gearbox and rear arrow below); `ev` (the top lane's whole cut car, both arrows, the gas lane cropped at frame bottom).
- **MW**, medium-wide: `twin` (both whole cars, stacked, the camera tracking them, boards passing).
- **W**, wide: `wide` (both lanes long, many boards; behind the chart and at the restage).

U has `unit` (M, the whole cut-away) and `gears` (C, the two stages and the output).

Camera keys do every move: a glide into each framing (0.7 to 1.0 s), then a push, truck or pull-back on the line's key word. The
camera **tracks the pair** (the road scrolls, as in `car-slice`), so the gap between the cars is what moves. **Subject band:** on
C and M shots the subject sits above y ≈ 1030, clear of the caption band; on `line` the top lane starts below the title block
(≈ y 450).

**Race time** (🎭, disclosed): line 1 runs fast (0 to 100 mph in ≈ 6 s on screen; the real run took 7.8 s for the gas car and 8.0 s for the electric one). From line 3 one continuous run plays
in **slow motion** (`timeScale` keys ≈ 0.1 to 0.3) through line 11, timed so the stopwatch card and the picture agree (line 5).

## The table

| # | Words | Cue | In → out (s) | Shot | On screen | Camera motion | What moves (2–3 s rule) | Transition into next | Overlays | SFX idea | New or existing | Flag |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1a | An electric car beat a 797-horsepower muscle car to 60 miles an hour, | `An electric car` | 0.00 → 4.45 | **C** (`line`) → **MW** (`twin`) | **Frame 0:** the twin section at the start line: the electric car's nose (top) and the gas car's nose (bottom) on their white lines, the **ambers lit** in both light columns, the cars still. Through the cuts: the electric car's front drive unit, the V8's front | Holds (drift 0, for the loop); log pull-back 2.0 → 3.0 s to `twin` | **Green at 0.3 s** in both columns; both cars launch (0.4); the electric car **pulls ahead at once** and leads by ≈ 1.5 car lengths by "60" (3.1) (0.3 s at 60 mph ≈ 8 m, C1) | `continue` | Title block, captions | Idle V8 burble from frame 0; at the launch a V8 rising through gears and an electric whine rising (self-made) | **New:** R (N1), both cars (N2, N3), light columns, boards (N5) | Frame 0 is the action line 1 names (the launch), then the reveal. No orange yet: the push is revealed in line 3 on the same cars |
| 1b | but the gas car hit 100 first. | `but the gas` | 4.45 → 6.85 | **MW** (`twin`) | Both whole cars at speed, stacked, boards streaming | Tracks the pair, slow push | The gas car **closes the gap**; its nose **passes the electric car's** at "first" (6.5) | `continue` | Title block, captions | Engines | N1 race keys | Fast-forward (🎭). The pass, not a finish line: the electric car still won the quarter mile (C1), so nothing on screen says "loses" |
| 2 | So why did its head start fade? | `So why did` | 6.85 → 9.25 | **MW** | As 1b | Holds, drift | The gas car **edges ≈ 2 car lengths ahead** (0.2 s at 100 mph ≈ 9 m, C1) | **`cut`** on line 3's cue (the replay; still open, Decisions 3) | Title block (fades 9.25 → 9.6 over the `[pause]`); captions | Engines fade out under the question | — | Question ends ≈ 9.2 s by this estimate (≈ 8.6 s by the coordinator's), past the 5–6 s target. The words are approved; the title block shows the question from frame 0. Scene 1 is 9.25 s (+ the pause), see the scene table |
| 3a | An electric motor pushes hardest from a stop, | `An electric motor` | 9.25 → 11.99 | **M** (`pair`) | **Back at the start line**, staged, ambers lit. Both drivetrains in section, stacked | Holds, then slow push toward the top lane | **Green at "stop"** (11.6); the electric car's foot presses; **orange runs battery → inverters → windings → rotors → gears → half-shafts** (0.5 s) and **both arrows jump to full length** at once. Below, the gas car's crank spins up, **its arrow still a dot** | `continue` | Captions | Whine starts; V8 revs | **New:** drive paths and push arrows (N4). Existing: `DriveUnit` ×2, `BatteryPack`, `PedalBox` / `foot` (`accel`) | The gas car's arrow growing from a dot is seen here and explained in line 4 ("seen first, explained next") |
| 3b | and that usually holds until around 30 miles an hour. | `and that usually` | 11.99 → 15.41 | **M** (`pair`) | As 3a, both cars rolling in slow motion | Slow push | The electric car's arrows **hold their length** as it speeds up; the speed in the detail box climbs **0 → 30** and lands on "30" (14.0) | `continue`, glide down to `gasBox` | **Detail box** `ev-dashboard` (`meter: false`), left side, leader to the electric car's cluster, 12.3 → 15.3: speed 0 → 30 mph | Whine rising | Existing `ev-dashboard` (+ `meter: false`, N8) | "usually" and "around" stay in the voice; 30 mph for this car is 🎭 (A1's typical range). The power meter stays hidden until line 9 (one idea per frame) |
| 4 | A gas engine makes no push until it's spinning, so it has to rev up and shift gears. | `A gas engine` | 15.41 → 21.58 | **C** (`gasBox`) | The V8 cut open, the gear pairs, the rear wheel with its arrow | Glide 15.4 → 16.2 s, slow push | The crank **spinning faster** ("spinning", 18.2), the first pair lit, the arrow **growing** as revs rise ("rev up", 19.9); at "shift gears" (20.9) the **lit pair steps to the second**: the arrow **drops, then regrows** | `continue`, log pull-back to `twin` | Captions | V8 rising, a short dip at the shift; a soft shift clunk | **New:** gas drivetrain (N3): `rpm`, `gear` keys | 6.2 s, one shot with two events. The arrow regrows within ≈ 0.5 s race time: the gas car is only 0.3 s slower to 60, so it must not look stuck |
| 5 | Testers timed the electric car at 3.3 seconds to 60 and the gas car at 3.6. | `Testers timed the` | 21.58 → 27.05 | **MW** (`twin`) | Both whole cars, stacked, still in slow motion, the electric car a little ahead | Log pull-back 21.6 → 22.6 s | The **stopwatch** runs in race time; its **ELECTRIC row stops at 3.3** the frame the electric car reaches 60, on "3.3" (23.6); the **GAS row stops at 3.6** on "3.6" (26.7). The gap: ≈ 1.5 car lengths | `continue`, glide to `ev` | **Counter** (compare, N6), top-left in the sky band: sub `0–60 MPH` above, rows `ELECTRIC 3.3 s` / `GAS 3.6 s` (top row = top lane), 21.8 → 27.0 | none under the card | **New:** Counter `decimals` + compare rows (N6) | The rows' order matches the stacked lanes, so the cars need no labels. No source on screen; "Testers" stays in the voice |
| 6 | All-wheel drive helped the electric one. | `All-wheel drive helped` | 27.05 → 29.11 | **M** (`ev`) | The electric car's whole cut car: front unit, pack, rear unit, **two arrows** | Glide 27.05 → 27.8 s | At "helped" (27.7) **both arrows brighten once**; the gas car's single rear arrow sits in the crop at frame bottom | `continue`, push to `evMotor` | Captions | — | N4 | Short scene (2.1 s) with its own glide and event. "helped" (C1: AWD launch advantage). No wheelspin drawn on the gas car (not in the source) |
| 7a | Past about 30, the spinning motor starts fighting its own battery, | `Past about 30` | 29.11 → 32.88 | **C** (`evMotor`) | The rear drive unit in section, the phase cables from the inverter | Glide 29.1 → 29.9 s, slow push | The rotor **spinning up**; on the phase cable an **orange arrow (the battery's push)** points in; at "fighting" (31.5) an **`ink` arrow points back out of the windings and grows with the rotor's speed**; by "battery" (32.5) they **nearly meet** and the orange current pulses **thin** | `continue`, pull-back to `pair` | Captions | Whine high | **New:** back-voltage arrows (N4). Existing: `DriveUnit`, `rotorRatio` (try the real 9 in slow motion) | "fighting its own battery" is the back-voltage (A2): the ink arrow is a second element in the shot, not a second colour |
| 7b | so the push shrinks as speed climbs. | `so the push` | 32.88 → 35.27 | **M** (`pair`) | Both drivetrains stacked, at speed | Pull-back 32.9 → 33.7 s | The electric car's two arrows **shrink smoothly** as the boards stream faster | `continue` | Captions | — | N4 | Sub-beat: one scene with 8a |
| 8a | The gas car's push shrinks too, | `The gas car's` | 35.27 → 37.33 | **M** (`pair`) | As 7b | Slow crane down toward the bottom lane | The gas car's arrow **shrinks too**, inside its gear | `continue`, glide to `gasBox` | Captions | V8 | N3, N4 | The parallel ("too") is the point: both arrows in one frame |
| 8b | but each gear change brings its engine back close to where it's strongest. | `but each gear` | 37.33 → 41.78 | **C** (`gasBox`) | The V8, the gear pairs, the rear arrow | Glide 37.3 → 38.1 s | Gear change at "gear change" (38.0): the **lit pair steps**, the arrow **jumps back up**; the tach needle **drops back to the strongest band's edge**; a second change at "strongest" (41.4) | `continue`, glide to `ev` | **Detail box** `gas-dashboard`, right side, leader to the gas car's cluster, 38.4 → 41.6: tach with the **"strongest" band** (the engine's power peak, orange), gear digit, speed | Two shift clunks | **New:** `gas-dashboard` (N8) | "close to" stays: the needle lands at the band's lower edge, not its middle (B1). No text on the band |
| 9 | Above about 30, the motor's power stays steady even though its push shrinks. | `Above about 30` | 41.78 → 46.23 | **M** (`ev`) | The electric car's whole cut car at speed, both arrows | Glide 41.8 → 42.6 s, slow push | In the detail box the **power meter sits full and still** from "power stays steady" (43.5) while the speed climbs; on the car both **arrows keep shrinking** at "push shrinks" (45.6) | `continue`, log pull-back to `wide` | **Detail box** `ev-dashboard` (meter on), left side, leader to the cluster, 42.6 → 46.1: speed climbing 55 → 80 mph, the power meter full and steady (its fill orange, the system's mark) | Whine high and steady | Existing `ev-dashboard` (meter on; positive fill orange, a small change in N8) | Line 9 is the mid-video surprise (power steady, push shrinking): one box, one car, both halves in one frame |
| 10 | A gas car needs up to ten gears to get close to that. | `A gas car needs` | 46.23 → 50.68 | **W** (`wide`) | Both lanes long, the cars far down the strip, small, still racing | Log pull-back 46.2 → 47.2 s | In the chart, the **electric car's line draws first** (rising to the `30 MPH` tick, then flat); then **ten humps draw** under the flat part, gear by gear, each hump's top **touching** the line, by "close to that" (50.0) | `continue`, glide to `twin` | **Chart card** (N9; still open, Decisions 1), 46.6 → 50.6, top y ≈ 330: axes `SPEED →` and `POWER ↑`, one tick `30 MPH` | none (music only) | **New:** chart card (N9) | "that" = the steady power of line 9, so the chart plots **power**, not push. Shapes only, not the test cars' data (🎭); ten humps for "up to ten" (B2), no number on screen. Fallback without a new overlay type in Decisions 1 |
| 11a | At high speed, horsepower per pound matters most, | `At high speed` | 50.68 → 53.42 | **MW** (`twin`) | Both whole cars at high speed, stacked; all arrows short | Glide 50.7 → 51.5 s | The **gas car's arrow is now longer than the electric car's** (more horsepower at the same speed); the gap **closing** | `continue` | Captions | Engines high | N4 | — |
| 11b | and the electric car had less horsepower and was about 1,400 pounds heavier. | `and the electric car had` | 53.42 → 57.88 | **MW** | As 11a | Slow push toward the top lane's battery pack | The gas car **passes** at "heavier" (57.5), as in 1b | `slide` (to U) | **Counter** `1,400`, label `lb`, sub `HEAVIER BY ABOUT` above, over the top lane, 56.0 → 57.8 | none under the card | Existing `Counter` | Numbers on screen only as spoken; 670 vs 797 hp is **not** shown (670 is a launch-mode figure, C1). The cue needs five words ("and the electric car" alone also fits line 5's "the electric car") |
| 12a | Porsche gave its electric Taycan's rear motor two gears, | `Porsche gave its` | 57.88 → 60.96 | **M** (`unit`) | **U:** the two-speed rear drive unit cut open, floating; the wheel stub and tire segment at frame left | Slide in, slow push | At "two gears" (60.3) **both stages outline** once; then the **first stage lights** and the output starts turning | `continue`, glide to `gears` | **Callout** `FIRST GEAR` (60.4 → 62.6; leader to the short stage) | Whoosh on the slide; a lower electric whine | **New:** U (N7) | Brand name in the voice only (E1, approved script); captions print the words; nothing on screen names or shapes the Taycan |
| 12b | one for pulling away and one for high speed. | `one for pulling` | 60.96 → 64.04 | **C** (`gears`) | The two stages and the output | Glide 61.0 → 61.7 s | In first, the rotor turns **about twice as fast as in second** for the same wheel speed (the real 15:1 vs 8:1, E1, in slow motion); U's arrow **long** at "pulling away" (61.6); at "high speed" (63.4) the **shift**: the second stage lights, the first fades, the arrow **shorter**, the rotor slower | `slide` (to R) | Callout `SECOND GEAR` (63.2 → 64.0, after `FIRST GEAR` has left) | A soft shift clunk | N7 | Ratios shown by motion, no numbers on screen |
| 13a | Next time an electric car leaves a light, | `Next time an` | 64.04 → 66.78 | **W** (`wide`) | R again: both lanes, the **next run**: the two cars **creep up into the stage beams** | Slide in, slow push | The cars roll forward and **stop on their lines**; the **stage bulbs light** (66.0) | `continue`, glide to `line` | Captions | Whoosh on the slide; idle V8 | N1 (`restage` keys) | The strip's lights stand in for "a light" |
| 13b | watch how the gap changes as both cars speed up. | `watch how the` | 66.78 → end (≈ 70.2 + 1.0 s hold) | **C** (`line`), **landing on frame 0's picture** | The two front ends at the start line | Glide lands on `line` by 67.6; drift 0 | The cars settle; the **ambers light** in the hold (70.5); no orange. Last frame: frame 0's picture | **Loop** to frame 0 | Captions end before the hold | Idle burble; music (if any) ends in silence on the last frame | Existing (R) | TIMED: the cars' places and the lit ambers must match frame 0. The replay's launch is the "next time" the line asks for |

Spec scenes: **15** in ≈ 71 s (≈ 4.7 s each):

| Scene | Location | In → out (s) | Beats | Shot |
|---|---|---|---|---|
| 1 | R | 0 → 9.25 | 1a, 1b, 2; holds the title block | C → MW |
| 2 | R | 9.25 → 15.41 | 3a, 3b (after the cut) | M |
| 3 | R | 15.41 → 21.58 | 4 | C |
| 4 | R | 21.58 → 27.05 | 5 | MW |
| 5 | R | 27.05 → 29.11 | 6 | M |
| 6 | R | 29.11 → 32.88 | 7a | C |
| 7 | R | 32.88 → 37.33 | 7b, 8a | M |
| 8 | R | 37.33 → 41.78 | 8b | C |
| 9 | R | 41.78 → 46.23 | 9 | M |
| 10 | R | 46.23 → 50.68 | 10 (the chart) | W |
| 11 | R | 50.68 → 53.42 | 11a | MW |
| 12 | R | 53.42 → 57.88 | 11b | MW |
| 13 | U | 57.88 → 64.04 | 12a, 12b | M → C |
| 14 | R | 64.04 → 66.78 | 13a | W |
| 15 | R | 66.78 → end | 13b | C |

Rhythm: C → MW | M | C | MW | M | C | M | C | M | **W** | MW | MW | M → C | **W** | C. Close and medium alternate through the
mechanism (electric, gas, electric, gas, electric); the wide shot appears twice, behind the chart and at the restage. **Scene 1 runs
9.25 s** (≈ 9.75 s with the proposed pause), over the 6 s guide, because the approved line 1 and the question are one continuous
race. It carries three events (the launch, the pull-back, the pass) and the title block must hold through the question. The
alternative is a scene break at 1b ("but the gas car") with the title block holding into scene 2, as No. 004 and the self-checkout
draft do; the spec has to support that. Scenes 5 (2.1 s) and 11 (2.7 s) are short but each has its own glide and event.

Card budget, never two at once:

- `ev-dashboard` speed-only box (3b);
- stopwatch Counter (5);
- `gas-dashboard` box (8b);
- `ev-dashboard` box with the meter (9);
- chart card (10);
- 1,400 lb Counter (11b);
- the two callouts in U, one after the other (12).

No name tags (no cast member, still open, Decisions 2). No statement cards. No X-ray. Transitions: **1 cut** (line 3), **2 slides**
(R → U → R), the rest `continue` with glides.

**Motion rule:** in every scene a camera move lands within its first second, and a story event (the green, the pass, an arrow
jumping or shrinking, a gear change, the stopwatch stopping, the meter holding, the chart drawing, the stage bulbs) follows within
2 to 3 s. Check in Studio playback.

## Line fixes

The script is approved, so no word changes are proposed. These are picture notes.

| Line | Flag | How the picture handles it | Mark |
|---|---|---|---|
| 1, 2 | The question lands ≈ 8.6 to 9.2 s, past the 5–6 s target (approved words) | The title block shows the question from frame 0; scene 1 runs long (see above) | none |
| 1, 4, 7, 8, 11 | 18 to 21 words each (6.2 to 6.9 s) | Each is split at its comma into two beats, apart from line 4, which is one shot with two events | none |
| 4 | "no push until it's spinning": an engine at the line idles, so it is already spinning | The arrow stays a dot while it idles, then grows as revs climb | none |
| 9, 10 | "that" in line 10 refers to the steady power in line 9 | Line 9 shows the steady power meter; the chart in line 10 plots power, so "that" is the flat line | none |
| 13 | "leaves a light": the picture uses the strip's start lights | Keeps the loop; alternative 13a on `city-slice` costs a slide and the glide to frame 0 | none |

## Pause and tag notes for `performance.txt`

This is for the voice agent; I don't write the file. Words unchanged.

| Line | Change | Why | Mark |
|---|---|---|---|
| 3 | `[pause] An electric motor` | Lands on the cut back to the start line; the title block fades in it | recommended |
| 10 | `[pause] A gas car needs` | Gives line 9's surprise a beat; lands on the pull-back to the chart | optional |
| 12 | `[pause] Porsche gave its` | Lands on the slide to U | recommended |

That's three tags across 13 sentences, inside "about 1 per 3".

## Reuse

| Part | Where it's used | What it already does |
|---|---|---|
| `car-slice` (`CarSliceScene`, `variant: 'ev'`) | Pattern and parts for R | Car cut along its near side, facing left, `driving` speed keys (`integrateSpeed`), `timeScale` keys (slow motion), `cameraKeys` (`log`), `foot` keys (`accel`), `rotorRatio`, `revsFrom` carry, `clusterOnScreen` (detail-box leader) |
| `EvDrive` (`DriveUnit`, `BatteryPack`, `PedalBox`, `footPose`) | Electric car in R (two units), U's base | Cut-open motor (copper stator, rotor, magnets, reduction gears, half-shaft, inverter, cables), pack cut lengthwise, pedals and foot |
| `RealCar` / `CarShell`, `RealWheel` | Both cars in R | Realistic body and cut, wheels cut at their mid-plane, tail lamps (flat) |
| `OrangePath` (`VIB_R` 0.0225) and No. 006's `regen` keys | Drive paths (run forward) | The § 5 tube, halo, node dots, runner light; staged keys per leg |
| `DetailBox` `ev-dashboard` | 3b and 9; base for `gas-dashboard` | Speed keys (mph), power meter keys, no brand, text ≥ 28 px |
| `Counter` | 11b as is; base for the stopwatch (N6) | Archivo digits, unit, Mono sub (`subPlace: 'above'`), thousands separator |
| `Callout` | U (12) | Elbow leader, label, paper halo |
| `TitleBlock`, `Captions`, `sfx` overlay, `music`, `transitions.ts` (`continue`, `slide`, `cut`) | Overlays, sound, hand-overs | As built |
| `SectionStage`, `SectionLights`, `cutLook`, `SectionCamera` / `projectToFrame`, `keyframes.ts`, `moods.ts`, `useStudioEnv` | R and U | The Section look, Day light, camera keys, anchors |
| `scripts/sfx-whine.mjs` | Electric whine | Self-made whine following speed |

Not reused: `city-slice`, `highway-slice` and `street-slice` as scenes (none has a start line or two cut cars), the No. 006 brake
corner, the `regen` direction, the brake-light `signal`, the `shake`, `section-lab`.

## Missing: scene-builder tasks (not requested yet)

Changes from the first draft are marked **[changed]**.

| # | Task | Size | Short spec |
|---|---|---|---|
| N1 | **`race-slice` scene (R)** | large | Two drag lanes, each cut lengthwise like `car-slice` (concrete pad then asphalt, hatched ground block, ink cut edges, guard wall, far grandstand), **stacked vertically, the electric car's lane on top** (owner-approved), at the one fixed angle, sky between. Each lane: a start line, a **light column** (stage ×2, amber ×3 in `warning`, green `signalGreen`, red never lit; `lights` keys per lane), **distance boards** (`60 FT`, `330 FT`, `1/8`, `1000 FT`). The camera tracks the pair; each lane's road scrolls with its own car, so the cars' offset **is** the gap. Per car: `driving` (or a launch model: electric flat push to a base speed then constant power; gas per-gear), shared `timeScale` keys, `restage` (creep into the beams and stop on the line). **Framings:** `line` (frame 0 and the loop), `pair`, `ev`, `evMotor`, `gasBox`, `twin`, `wide`. **Anchors:** each car's cluster (detail-box leaders), each lane's top (Counter placement). **Test stills first:** `line` (top lane below the title block at ≈ y 450, both noses and the light columns readable above y 1030) and `twin` (both cars and their arrows readable at phone size) |
| N2 | **Electric car for R** | medium | A generic two-door coupe body (`shape: 'coupe'`, no maker's silhouette), **AWD**: `DriveUnit` front and rear, `BatteryPack` between, inverters, HV cables, both near half-shafts; `PedalBox` with `foot` keys; a grey extra driving; paint token (N10) |
| N3 | **Gas car and drivetrain (`GasDrive`)** | large | Same coupe class, other paint, RWD. A generic V8 cut open (block, two pistons and rods in section, crankshaft) turning with **`rpm` keys** (idle ≈ 800 rpm visible as a slow crank); converter or clutch housing; a **gearbox of 8 stacked gear pairs** in section with **`gear` keys** (the active pair lit and on the orange path, a 0.2 s step at each change; picture still open, Decisions 4); driveshaft under the floor; rear diff and the near rear half-shaft. No supercharger, no maker's engine shapes, no amber parts |
| N4 | **Drive paths, push arrows, back-voltage** | medium | Orange **drive paths** (`OrangePath`, `VIB_R`) **on both cars** (owner decision): electric battery → inverter → windings (lighting) → rotor → gears → half-shaft → wheel, for each unit; gas crank → active pair → driveshaft → diff → wheel. A **push arrow** at each driven wheel's contact patch along the road's cut face, pointing forward: tube + flat head, halo, bloom; length from keys or from N1's push model (🎭 scale; a node dot at zero); a one-shot `brighten` key. **Back-voltage** in `evMotor`: an orange arrow in on the phase cable, an `ink` arrow out of the windings growing with rotor speed (keys), the orange pulses thinning as they meet |
| N5 | **Strip set pieces** | small | The light-column prop (lens states, flat emissive, no bloom), the distance boards (Inter 700 set lettering, generic), the start line; all outside the reserved band |
| N6 | **`Counter` decimals + compare rows** | small | `decimals: 1`; a **stopwatch compare** mode: `rows: [{label: 'ELECTRIC', to: 3.3}, {label: 'GAS', to: 3.6}]`, unit `s`, sub `0–60 MPH`; rows count together in race time and each **stops at its `to`** (`stopAt` keys, so it can sync to the picture); one frame, rows stacked to match the lanes |
| N7 | **`drive-unit` object cut-away (U)** | medium | A generic two-speed rear electric drive unit floating on `bg` / `sky`: housing cut at its mid-plane (hatch, ink edge), stator and rotor, a **short first stage** and a **long second stage** with the shift element, the output to a wheel stub with a tire segment, contact patch and push arrow. `gear` keys (first / second, a short shift), rotor speed = output speed × the stage's ratio (real **15** and **8**, E1, in slow motion so they don't strobe), arrow length per stage. Generic: no Porsche part shapes or markings. **Framings:** `unit` (M), `gears` (C). **Anchors:** each stage (callouts) |
| N8 | **`DetailBox` `gas-dashboard`; `ev-dashboard` options** **[changed]** | small | `gas-dashboard`: a generic tach (needle, `rpm` keys) with an orange **power-peak band** (where the engine is strongest), a gear digit, speed in mph; text ≥ 28 px, no brand. `ev-dashboard`: `meter: false` to hide the power meter (3b), and **the meter's positive (power) fill drawn orange** as the system's mark (line 9; today only the CHARGE zone is orange) |
| N9 | **Chart card** (still open, Decisions 1) **[changed]** | small to medium | A square-cornered card in the detail box's frame (4 px `ink` border, `paper`; a tab reading `DETAIL` or `POWER`, the brand-director's call), ≤ 696 × 620, top y ≈ 330. Axes `SPEED →`, `POWER ↑` (Inter 700 26 px), one tick `30 MPH`. `line` draw keys (the electric car: rising to the tick, then flat, orange); `humps` (n = 10) draw keys, each hump rising to touch the flat line and falling (orange, thinner). **It now plots power, not push** (line 10's "that" is the steady power). Shapes only, no data values. Counts as the frame's one card |
| N10 | **Theme tokens** (values to the brand-director) | small | `RACE.evPaint`, `RACE.gasPaint` (outside the band, ≥ 25° from YOU's cobalt, not red-orange), strip concrete and asphalt, board black and white; reuse `signalGreen` and `warning` |
| — | Audio (tooling) | small | Self-made, free: a V8 with `rpm` keys and gear-change dips (new, like `sfx:rumble`), shift clunks, the slide whoosh; the electric whine exists (`sfx:whine`). ElevenLabs only with the owner's go-ahead (paid) |

## Frame 0 and the loop

**Frame 0** (Day, 2:40 PM): R at `line`, the fixed 3/4 angle. The twin section at the start line: the electric car's nose on its
white line in the top lane, the gas car's nose on its line in the bottom lane, both still; through the cuts, the electric car's
front drive unit and the V8's front; each lane's light column at frame left with **the ambers lit**; distance boards just beyond.
Nothing orange. Title block at top (top y 300, one line plus line 2, to ≈ y 430); the top lane starts below it. Readable: the title
block and the first caption. Drift 0 on this scene and the last. Green at 0.3 s, launch at 0.4 s.

**Last frame:** the same picture after line 13: `line`, both cars staged on their lines, the ambers lit, no orange, no card,
captions gone. On replay the cut to frame 0 adds only the title block, and the green comes on. The last line ("watch how the gap
changes as both cars speed up") leads into the first ("An electric car beat…").

## Cover idea

The `pair` framing at about 12.5 s: just after the green, the electric car's two arrows at full length, the gas car's arrow still a
dot below it, both drivetrains cut open. Cover text: "Full push from a stop." or "Why EVs fade." The publisher decides.

## Decisions

**Made by the owner (2026-10-24):** the script; orange push arrows on both cars; stacked lanes with the electric car on top.

**Still open, for the owner (recommendations, not decided):**

1. **Chart card (new overlay type)** for line 10. Recommended: the power chart in the detail box's frame (N9), one card, shapes only.
   It shows "ten gears get close to that" at a glance. Fallback that needs no new overlay type: a **power meter on the
   `gas-dashboard`** that dips at each gear change and climbs back near full, read against line 9's steady meter (in-world, but it
   shows two or three changes, not ten). If approved, the brand-director adds the chart to the style guide.
2. **No cast member:** the drivers are grey extras (the testers), and YOU doesn't appear, against brand.md's "cast … in every
   video". Recommended: accept for this video. Alternative: YOU drives the electric car as an illustrative tester, with a name tag
   in scene 1 (🎭).
3. **The hard cut at line 3** (one of the ≤ 2 allowed): back to the start line for the slow-motion replay. Alternative: a fast
   rewind of the run under the question (new motion grammar).
4. **The gas gearbox as 8 stacked gear pairs** (manual-style) while the tested car has an automatic: a readable simplification
   (🎭). Alternative: a generic planetary automatic, which is harder to read as "gears stepping".
5. **Disclosures (🎭)** for the publisher's "Illustrative:" line: the two separate test runs shown side by side; race time
   compressed (line 1) and slowed (lines 3 to 11); arrow lengths, meters and chart are shapes, not measured data; 30 mph as this
   car's knee; the 8-pair gearbox; the line-12 drive unit is a generic drawing, not Porsche's design; story time.
6. **Music:** ≈ 71 s, over 60 s, so our own music or none.

**For the main session:** 7. the self-checkout draft also says "No. 007"; assign the number for title line 2.
