# No. 007 · EV acceleration: audio + visual script

Revision 3 by the director, 2026-10-25: the owner's decisions 1–7 recorded (§ Decisions), the owner rules from No. 006/008 applied
(§ Owner rules, § Camera path, which supersedes the table's camera column), and the build list rebuilt on the merged No. 008 kit
(§ Missing). Revision 2 by the director, 2026-10-24, for the **owner-approved 13-line script** (205 words, `script.txt` as of 17:45), before
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
- **2026-10-25, decisions 1–7, all as recommended** (§ Decisions): the chart card, grey extras as the testers, the hard cut at line
  3, the 8 stacked gear pairs (🎭), the disclosures, our own music bed (≈ 71 s), and this video is **No. 007** (drive-by-wire is
  No. 008).

## Owner rules from No. 006 and No. 008 (apply them all)

- **The camera goes one way.** One dive in and one pull-out per location visit, no close → wide → close yo-yo; every scene starts
  exactly where the previous one ended; wheel, road, pose and race state carry across cuts. The one hard cut (line 3, owner
  decision 3) starts a new visit to R. **§ Camera path below replaces the table's camera column.**
- **Frame 0 reads in the first second:** both cars at the start line, the light columns with the ambers lit, the drivers' feet on
  the pedals readable; the launch (the action line 1 names) at 0.3–0.4 s.
- **Foot actions readable at phone size:** the light sneakers (`section.sneaker`) and `footScale` on both drivers (grey extras
  too), the electric car's press at line 3 framed so the foot reads.
- **Near wheels whole** (`wheelsWhole: true`, No. 008 owner note) on both cars: the push arrows sit at whole tires' contact
  patches; check that the drive units behind the near wheels still read.
- **Physical sounds only, no "spaceship" sounds:** the owner rejected the EV whines and the slide whoosh in No. 008. No electric
  whine here: the electric car is heard through its tires and the road (and at most a very low, plain motor hum); no whoosh on
  slides; no beeps on the tree. § Sound plan.
- **Music and SFX planned from the start** (§ Sound plan), music from frame 0 at ≈ 12 dB under the dry voice, silent on the last
  frame.
- **Brake and tail lamps** a clear flat red whenever lit and in frame (the cars don't brake on screen here; lamps unlit).

**Times** are estimates at 2.92 words/s from the script words only (as for No. 006): 205 words = **70.2 s**, plus a 1.0 s hold on
the loop frame ≈ **71.2 s**. At this rate the question runs 6.85 → 9.25 s (the coordinator's estimate is ≈ 8.6 s). Numbers are
spoken longer than they count ("797-horsepower" is five spoken words, "1,400" three), so the real take may run 1 to 2 s longer. **Over
60 s: our own music bed** (owner decision 6). `performance.txt` now exists with two `[pause]` tags (lines 3 and 12). There is no `performance.txt` yet; the pauses proposed below add
≈ 1 s. Re-time against the real take before writing `spec.ts`.

**Mood: Day**, a dry afternoon at a drag strip, story time 2:40 PM (🎭). Two locations, no time-passes beat.

## The world

Two locations: **R, the strip** (14 of 15 scenes), and **U, a drive unit cut open** (line 12). Inside R every framing change is
a `continue` glide, except **one hard cut** at line 3, back to the start line for the replay (owner decision 3). R ↔ U by
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
    foot (`foot` keys). Driver: a grey extra, a tester (owner decision 2: grey extras).
  - **The gas car (bottom):** the same generic coupe class, another paint, **rear-wheel drive**: a generic V8 cut open (block, two
    pistons and rods in section, the crankshaft turning with `rpm`), the torque-converter or clutch housing, a **multi-speed gearbox
    drawn as a row of stacked gear pairs** (8 pairs, 🎭; owner decision 4), the **active pair lit**, a driveshaft under the
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
without "So", `Why did its head start fade?` (28 characters, one line); line 2 **`NO. 007 · THE DRAG STRIP · 2:40 PM`** (🎭 story time;
the number is settled, owner decision 7).

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

## Camera path (one-way; supersedes the table's camera column)

The revision-2 table alternates close and medium shots (C → MW | M | C | MW | M | C | M | C | M | W …), a yo-yo the owner ruled
out after No. 006/008. The path below keeps the table's beats, events and overlays, and changes only the framings and moves.
Distances are targets for the test stills.

| Visit | Lines | Path (framing, ≈ distance) | Move |
|---|---|---|---|
| R1 (frame 0 → the cut) | 1–2 | `line` C (frame 0) → `twin` MW | One log pull-back after the launch (2.0 → 3.0 s), then tracking. The one pull-out |
| — | — | **hard cut** at line 3 (owner decision 3): a new visit, back at the line for the slow-motion replay | — |
| R2 (the replay) | 3–6 | `pair` M, constant distance | Slow push only. Line 4's gear steps and line 6's two arrows are read **at `pair`** (the gearbox and arrows 🎭 scaled up so a lit pair reads ≥ 20 px); line 6 is a crane up to `ev` at the **same distance** (lateral, not in/out) |
| R2 | 7a | `evMotor` C | **The one dive** (back-voltage needs the close-up) |
| R2 | 7b → 11 | `evMotor` C → `pair` M (7b, 8a, 8b; the `gas-dashboard` box carries the tach and gear in 8b) → `ev` M (9, crane at the same distance) → `twin` MW (10, behind the chart) → `wide` W (11, the pass from far) | **The one pull-out**: distances only grow from here; 8b no longer glides to `gasBox` |
| U | 12 | `unit` M → `gears` C | Slide in, one dive |
| R3 | 13 | `wide` W → `line` C (= frame 0's picture) | Slide in, one dive, landing on frame 0 |

`gasBox` is dropped as a framing (the gearbox reads at `pair` and in the `gas-dashboard` box). Slides carry no whoosh. Across the
cut and the slides, each visit's first camera key, race state and wheel phase are set by hand in the spec (car-slice's carry only
flows between back-to-back scenes).

## The table

| # | Words | Cue | In → out (s) | Shot | On screen | Camera motion | What moves (2–3 s rule) | Transition into next | Overlays | SFX idea | New or existing | Flag |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1a | An electric car beat a 797-horsepower muscle car to 60 miles an hour, | `An electric car` | 0.00 → 4.45 | **C** (`line`) → **MW** (`twin`) | **Frame 0:** the twin section at the start line: the electric car's nose (top) and the gas car's nose (bottom) on their white lines, the **ambers lit** in both light columns, the cars still. Through the cuts: the electric car's front drive unit, the V8's front | Holds (drift 0, for the loop); log pull-back 2.0 → 3.0 s to `twin` | **Green at 0.3 s** in both columns; both cars launch (0.4); the electric car **pulls ahead at once** and leads by ≈ 1.5 car lengths by "60" (3.1) (0.3 s at 60 mph ≈ 8 m, C1) | `continue` | Title block, captions | Idle V8 burble from frame 0; at the launch a V8 rising through gears and tire roar (self-made; no whine) | **New:** R (N1), both cars (N2, N3), light columns, boards (N5) | Frame 0 is the action line 1 names (the launch), then the reveal. No orange yet: the push is revealed in line 3 on the same cars |
| 1b | but the gas car hit 100 first. | `but the gas` | 4.45 → 6.85 | **MW** (`twin`) | Both whole cars at speed, stacked, boards streaming | Tracks the pair, slow push | The gas car **closes the gap**; its nose **passes the electric car's** at "first" (6.5) | `continue` | Title block, captions | Engines | N1 race keys | Fast-forward (🎭). The pass, not a finish line: the electric car still won the quarter mile (C1), so nothing on screen says "loses" |
| 2 | So why did its head start fade? | `So why did` | 6.85 → 9.25 | **MW** | As 1b | Holds, drift | The gas car **edges ≈ 2 car lengths ahead** (0.2 s at 100 mph ≈ 9 m, C1) | **`cut`** on line 3's cue (the replay; owner decision 3) | Title block (fades 9.25 → 9.6 over the `[pause]`); captions | Engines fade out under the question | — | Question ends ≈ 9.2 s by this estimate (≈ 8.6 s by the coordinator's), past the 5–6 s target. The words are approved; the title block shows the question from frame 0. Scene 1 is 9.25 s (+ the pause), see the scene table |
| 3a | An electric motor pushes hardest from a stop, | `An electric motor` | 9.25 → 11.99 | **M** (`pair`) | **Back at the start line**, staged, ambers lit. Both drivetrains in section, stacked | Holds, then slow push toward the top lane | **Green at "stop"** (11.6); the electric car's foot presses; **orange runs battery → inverters → windings → rotors → gears → half-shafts** (0.5 s) and **both arrows jump to full length** at once. Below, the gas car's crank spins up, **its arrow still a dot** | `continue` | Captions | Tire roar starts; V8 revs | **New:** drive paths and push arrows (N4). Existing: `DriveUnit` ×2, `BatteryPack`, `PedalBox` / `foot` (`accel`) | The gas car's arrow growing from a dot is seen here and explained in line 4 ("seen first, explained next") |
| 3b | and that usually holds until around 30 miles an hour. | `and that usually` | 11.99 → 15.41 | **M** (`pair`) | As 3a, both cars rolling in slow motion | Slow push | The electric car's arrows **hold their length** as it speeds up; the speed in the detail box climbs **0 → 30** and lands on "30" (14.0) | `continue`, glide down to `gasBox` | **Detail box** `ev-dashboard` (`meter: false`), left side, leader to the electric car's cluster, 12.3 → 15.3: speed 0 → 30 mph | Tire roar rising | Existing `ev-dashboard` (+ `meter: false`, N8) | "usually" and "around" stay in the voice; 30 mph for this car is 🎭 (A1's typical range). The power meter stays hidden until line 9 (one idea per frame) |
| 4 | A gas engine makes no push until it's spinning, so it has to rev up and shift gears. | `A gas engine` | 15.41 → 21.58 | **C** (`gasBox`) | The V8 cut open, the gear pairs, the rear wheel with its arrow | Glide 15.4 → 16.2 s, slow push | The crank **spinning faster** ("spinning", 18.2), the first pair lit, the arrow **growing** as revs rise ("rev up", 19.9); at "shift gears" (20.9) the **lit pair steps to the second**: the arrow **drops, then regrows** | `continue`, log pull-back to `twin` | Captions | V8 rising, a short dip at the shift; a soft shift clunk | **New:** gas drivetrain (N3): `rpm`, `gear` keys | 6.2 s, one shot with two events. The arrow regrows within ≈ 0.5 s race time: the gas car is only 0.3 s slower to 60, so it must not look stuck |
| 5 | Testers timed the electric car at 3.3 seconds to 60 and the gas car at 3.6. | `Testers timed the` | 21.58 → 27.05 | **MW** (`twin`) | Both whole cars, stacked, still in slow motion, the electric car a little ahead | Log pull-back 21.6 → 22.6 s | The **stopwatch** runs in race time; its **ELECTRIC row stops at 3.3** the frame the electric car reaches 60, on "3.3" (23.6); the **GAS row stops at 3.6** on "3.6" (26.7). The gap: ≈ 1.5 car lengths | `continue`, glide to `ev` | **Counter** (compare, N6), top-left in the sky band: sub `0–60 MPH` above, rows `ELECTRIC 3.3 s` / `GAS 3.6 s` (top row = top lane), 21.8 → 27.0 | none under the card | **New:** Counter `decimals` + compare rows (N6) | The rows' order matches the stacked lanes, so the cars need no labels. No source on screen; "Testers" stays in the voice |
| 6 | All-wheel drive helped the electric one. | `All-wheel drive helped` | 27.05 → 29.11 | **M** (`ev`) | The electric car's whole cut car: front unit, pack, rear unit, **two arrows** | Glide 27.05 → 27.8 s | At "helped" (27.7) **both arrows brighten once**; the gas car's single rear arrow sits in the crop at frame bottom | `continue`, push to `evMotor` | Captions | — | N4 | Short scene (2.1 s) with its own glide and event. "helped" (C1: AWD launch advantage). No wheelspin drawn on the gas car (not in the source) |
| 7a | Past about 30, the spinning motor starts fighting its own battery, | `Past about 30` | 29.11 → 32.88 | **C** (`evMotor`) | The rear drive unit in section, the phase cables from the inverter | Glide 29.1 → 29.9 s, slow push | The rotor **spinning up**; on the phase cable an **orange arrow (the battery's push)** points in; at "fighting" (31.5) an **`ink` arrow points back out of the windings and grows with the rotor's speed**; by "battery" (32.5) they **nearly meet** and the orange current pulses **thin** | `continue`, pull-back to `pair` | Captions | Tire roar high | **New:** back-voltage arrows (N4). Existing: `DriveUnit`, `rotorRatio` (try the real 9 in slow motion) | "fighting its own battery" is the back-voltage (A2): the ink arrow is a second element in the shot, not a second colour |
| 7b | so the push shrinks as speed climbs. | `so the push` | 32.88 → 35.27 | **M** (`pair`) | Both drivetrains stacked, at speed | Pull-back 32.9 → 33.7 s | The electric car's two arrows **shrink smoothly** as the boards stream faster | `continue` | Captions | — | N4 | Sub-beat: one scene with 8a |
| 8a | The gas car's push shrinks too, | `The gas car's` | 35.27 → 37.33 | **M** (`pair`) | As 7b | Slow crane down toward the bottom lane | The gas car's arrow **shrinks too**, inside its gear | `continue`, glide to `gasBox` | Captions | V8 | N3, N4 | The parallel ("too") is the point: both arrows in one frame |
| 8b | but each gear change brings its engine back close to where it's strongest. | `but each gear` | 37.33 → 41.78 | **C** (`gasBox`) | The V8, the gear pairs, the rear arrow | Glide 37.3 → 38.1 s | Gear change at "gear change" (38.0): the **lit pair steps**, the arrow **jumps back up**; the tach needle **drops back to the strongest band's edge**; a second change at "strongest" (41.4) | `continue`, glide to `ev` | **Detail box** `gas-dashboard`, right side, leader to the gas car's cluster, 38.4 → 41.6: tach with the **"strongest" band** (the engine's power peak, orange), gear digit, speed | Two shift clunks | **New:** `gas-dashboard` (N8) | "close to" stays: the needle lands at the band's lower edge, not its middle (B1). No text on the band |
| 9 | Above about 30, the motor's power stays steady even though its push shrinks. | `Above about 30` | 41.78 → 46.23 | **M** (`ev`) | The electric car's whole cut car at speed, both arrows | Glide 41.8 → 42.6 s, slow push | In the detail box the **power meter sits full and still** from "power stays steady" (43.5) while the speed climbs; on the car both **arrows keep shrinking** at "push shrinks" (45.6) | `continue`, log pull-back to `wide` | **Detail box** `ev-dashboard` (meter on), left side, leader to the cluster, 42.6 → 46.1: speed climbing 55 → 80 mph, the power meter full and steady (its fill orange, the system's mark) | Tire roar high and steady | Existing `ev-dashboard` (meter on; positive fill orange, a small change in N8) | Line 9 is the mid-video surprise (power steady, push shrinking): one box, one car, both halves in one frame |
| 10 | A gas car needs up to ten gears to get close to that. | `A gas car needs` | 46.23 → 50.68 | **W** (`wide`) | Both lanes long, the cars far down the strip, small, still racing | Log pull-back 46.2 → 47.2 s | In the chart, the **electric car's line draws first** (rising to the `30 MPH` tick, then flat); then **ten humps draw** under the flat part, gear by gear, each hump's top **touching** the line, by "close to that" (50.0) | `continue`, glide to `twin` | **Chart card** (N9; owner decision 1), 46.6 → 50.6, top y ≈ 330: axes `SPEED →` and `POWER ↑`, one tick `30 MPH` | none (music only) | **New:** chart card (N9) | "that" = the steady power of line 9, so the chart plots **power**, not push. Shapes only, not the test cars' data (🎭); ten humps for "up to ten" (B2), no number on screen. The chart card is approved (owner decision 1) |
| 11a | At high speed, horsepower per pound matters most, | `At high speed` | 50.68 → 53.42 | **MW** (`twin`) | Both whole cars at high speed, stacked; all arrows short | Glide 50.7 → 51.5 s | The **gas car's arrow is now longer than the electric car's** (more horsepower at the same speed); the gap **closing** | `continue` | Captions | Engines high | N4 | — |
| 11b | and the electric car had less horsepower and was about 1,400 pounds heavier. | `and the electric car had` | 53.42 → 57.88 | **MW** | As 11a | Slow push toward the top lane's battery pack | The gas car **passes** at "heavier" (57.5), as in 1b | `slide` (to U) | **Counter** `1,400`, label `lb`, sub `HEAVIER BY ABOUT` above, over the top lane, 56.0 → 57.8 | none under the card | Existing `Counter` | Numbers on screen only as spoken; 670 vs 797 hp is **not** shown (670 is a launch-mode figure, C1). The cue needs five words ("and the electric car" alone also fits line 5's "the electric car") |
| 12a | Porsche gave its electric Taycan's rear motor two gears, | `Porsche gave its` | 57.88 → 60.96 | **M** (`unit`) | **U:** the two-speed rear drive unit cut open, floating; the wheel stub and tire segment at frame left | Slide in, slow push | At "two gears" (60.3) **both stages outline** once; then the **first stage lights** and the output starts turning | `continue`, glide to `gears` | **Callout** `FIRST GEAR` (60.4 → 62.6; leader to the short stage) | No whoosh; a very low plain hum at most | **New:** U (N7) | Brand name in the voice only (E1, approved script); captions print the words; nothing on screen names or shapes the Taycan |
| 12b | one for pulling away and one for high speed. | `one for pulling` | 60.96 → 64.04 | **C** (`gears`) | The two stages and the output | Glide 61.0 → 61.7 s | In first, the rotor turns **about twice as fast as in second** for the same wheel speed (the real 15:1 vs 8:1, E1, in slow motion); U's arrow **long** at "pulling away" (61.6); at "high speed" (63.4) the **shift**: the second stage lights, the first fades, the arrow **shorter**, the rotor slower | `slide` (to R) | Callout `SECOND GEAR` (63.2 → 64.0, after `FIRST GEAR` has left) | A soft shift clunk | N7 | Ratios shown by motion, no numbers on screen |
| 13a | Next time an electric car leaves a light, | `Next time an` | 64.04 → 66.78 | **W** (`wide`) | R again: both lanes, the **next run**: the two cars **creep up into the stage beams** | Slide in, slow push | The cars roll forward and **stop on their lines**; the **stage bulbs light** (66.0) | `continue`, glide to `line` | Captions | Idle V8 (no whoosh) | N1 (`restage` keys) | The strip's lights stand in for "a light" |
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

No name tags (no cast member, owner decision 2). No statement cards. No X-ray. Transitions: **1 cut** (line 3), **2 slides**
(R → U → R), the rest `continue` with glides.

**Motion rule:** in every scene a camera move lands within its first second, and a story event (the green, the pass, an arrow
jumping or shrinking, a gear change, the stopwatch stopping, the meter holding, the chart drawing, the stage bulbs) follows within
2 to 3 s. Check in Studio playback.

## Sound plan (planned from the start; physical only)

Music: **our own bed** (owner decision 6), ≈ 71 s, from frame 0 with a 1.5 s fade-in, ≈ 12 dB under the dry voice, no duck, ends
silent on the last frame. Prompt in `music.txt`; a generation is paid (ask first). SFX levels are set from measured LUFS, as in
No. 008.

| Sound | Source | Where |
|---|---|---|
| V8 burble and revs, rising through gears with a short dip at each change | **extend** `sfx:engine` (tooling): `--cyl 8` (firing Hz = rpm/15) and a gear-change sequence (or chain the existing `--from/--to/--peak` flares) | Idle from frame 0; the launch (1a); revs (3a, 4); each gear change (4, 8b); the pass (11b) |
| Shift clunk | **reuse** `sfx:thump` (low body thud, `--pitch`) or `sfx:throttle --clunk` | 4, 8b (gas); 12b (U's shift) |
| Tire and road roar, rising with speed (the electric car's sound) | **reuse** `sfx:hiss` on a dry setting (`--pitch` with speed) | Both cars at speed, louder on the electric car's scenes (3, 6, 7, 9) |
| A very low, plain motor hum (optional) | self-made, steady, no glide | Under U (12) only, ≈ 20 dB under; leave it out if it reads as a whine |
| — | **No** electric whine, **no** slide whoosh, no tree beeps, no crowd | (owner, No. 008 "spaceship sound") |


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
| `scripts/sfx-drive.mjs` (`sfx:engine`, `sfx:hiss`, `sfx:thump`, `sfx:throttle`) | Sound plan | Self-made physical sounds (No. 008); `sfx:engine` extended for a V8. **Not** `sfx:whine` (owner: no whines) |
| No. 008 kit: car-slice `variant: 'gas'` / `GasDrive`, EV `drive`, `gate` / `cut`, `wheelsWhole`, light sneakers | Both cars (§ Missing) | See the build list |

Not reused: `city-slice`, `highway-slice` and `street-slice` as scenes (none has a start line or two cut cars), the No. 006 brake
corner, the `regen` direction, the brake-light `signal`, the `shake`, `section-lab`.

## Missing: scene-builder tasks (rebuilt on the merged No. 008 kit, 2026-10-25)

Every task is marked **reuse** (as built), **extend** (add options to an existing file) or **new** (a new file). The No. 008 kit
is in main: car-slice `variant: 'gas'` with `GasDrive.tsx` (`EngineBay`, `GasPedals`, `gasFootPose`, `Steering`, `GasLoom`,
`gasPath` / `gate` / `cut`), the EV `drive` power path (pedal sensor → board → phase → windings, `gate` / `cut` on 'ev'),
`wheelsWhole`, the wet highway / curve (`TireSpray`, `roadBend`, not needed on a dry strip), and the self-made SFX tools.

| # | Task | Mark | Files | Size | Short spec |
|---|---|---|---|---|---|
| N0 | **Shared cut-car rig** | extend (refactor) | `src/scenes/CarSliceScene.tsx` → a new `src/three/real/SlicedCar.tsx` | medium | Lift the car-at-a-pose part of `CarSliceScene` (body and cut, drivetrain by variant, driver and foot IK, pedals, wheels with `wheelsWhole`, orange legs, the lane block and its scroll) into a `SlicedCar` component that both `car-slice` and the new `race-slice` mount. **No behaviour change:** regression stills of No. 006 and No. 008 before and after. The alternative, re-implementing the rig in `race-slice`, would duplicate the foot IK, carry and path code |
| N1 | **`race-slice` scene (R)** | new | `src/scenes/RaceSliceScene.tsx`, `src/scenes/index.ts` | large | Two drag lanes stacked (electric on top, owner-approved), each a `SlicedCar` (N0) on its own cut lane block at the one fixed angle; the camera tracks the pair; per car `driving` (or a push model), shared `timeScale` keys, `restage`. Framings `line` (frame 0 and the loop), `pair`, `ev` (same distance as `pair`), `evMotor`, `twin`, `wide` (no `gasBox`, § Camera path). Anchors: each car's cluster, each lane's top. **Test stills first:** `line` (sneakers and noses readable, top lane below the title block) and `pair` (a lit gear pair ≥ 20 px, both arrows readable) |
| N2 | **The electric coupe, AWD** | extend | `src/three/real/RealCar.tsx` (+ `CarShell` profile), the EV variant in `SlicedCar` (N0) | medium | Today's EV variant is a front-drive crossover with one `DriveUnit` and the pack (No. 006), the `drive` path and `gate` / `cut` (No. 008). Add **`shape: 'coupe'`** to `RealCar` (two doors, low roof, no maker's silhouette; today only 'crossover' and 'sedan') and **`awd: true`**: a second `DriveUnit` (reuse, as is) at the rear axle with its inverter, HV cable and near rear half-shaft. The driver a grey extra (`driver: 'extra'`) in light sneakers |
| N3 | **The V8 and the 8-pair gearbox** | extend | `src/three/real/GasDrive.tsx` (new components beside `EngineBay`); the gas variant in `SlicedCar` (N0) | large | **Extend `GasDrive`, no new file of the same name.** Today it holds a transverse four-cylinder (front drive) with the throttle body. Add `engine: 'v8'` (longitudinal, generic: block, two pistons and rods in section, crankshaft turning with **`rpm` keys**, idle visible as a slow crank), a converter/clutch housing, a **`Gearbox`** of **8 stacked gear pairs** in section (owner decision 4, 🎭) with **`gear` keys** (active pair lit and on the orange path, a 0.2 s step), a driveshaft under the floor, the rear diff and the near rear half-shaft; `drive: 'rear'`. Gearbox 🎭 scaled so a pair reads at `pair`. No supercharger, no maker's engine look. Coupe body from N2 |
| N4 | **Drive paths, push arrows, back-voltage** | extend + new | `GasDrive.tsx` / `EvDrive.tsx` routes (extend), `src/three/PushArrow.tsx` (new), `OrangePath` (reuse) | medium | Orange **drive paths** on both cars (owner decision): electric = No. 006's `regen` route **run forward** (battery → inverter → windings → rotor → gears → half-shaft → hub; reuse the geometry and staged keys), one per unit; gas = crank → the active pair → driveshaft → diff → hub (new legs in `GasDrive`). **`PushArrow`** (new): at each driven wheel's contact patch, along the road's cut face, pointing forward; length keys or the push model; a node dot at zero; a one-shot `brighten`. **Back-voltage** at `evMotor`: an orange arrow in on the phase cable, an `ink` arrow out of the windings growing with rotor speed |
| N5 | **Strip set pieces** | new | `src/three/real/StripProps.tsx` | small | Light column (stage ×2, amber ×3 in `warning`, green `signalGreen`, red never lit; flat, no bloom; `lights` keys), distance boards (Inter 700 set lettering), start line. Reuse `RoadSigns`' board drawing where it fits |
| N6 | **`Counter` decimals + compare rows** | extend | `src/components/Counter.tsx` | small | As revision 2: `decimals: 1`, `rows` (`ELECTRIC 3.3`, `GAS 3.6`), each row stopping at its `to` on its own key |
| N7 | **Two-speed drive unit (U)** | extend + new | `src/three/real/EvDrive.tsx` (`DriveUnit` `stages: 2`, `gear` keys), `src/scenes/DriveUnitScene.tsx` (new), `src/scenes/index.ts` | medium | Reuse `DriveUnit`'s housing, stator, rotor and reduction gears; add a second gear stage and the shift element (`stages: 2`, `gear` keys, rotor speed = output × the stage ratio, real 15 and 8 in slow motion). The scene floats it on `bg` / `sky` like an object cut-away with a wheel stub, tire segment and a `PushArrow` (N4). Framings `unit`, `gears`; anchors for the callouts. Generic, no Porsche shapes |
| N8 | **`DetailBox` `gas-dashboard`; `ev-dashboard` options** | extend | `src/components/DetailBox.tsx`, `dashboardKit.ts` | small | New content `gas-dashboard` (No. 008's was specified but dropped, never built): tach with `rpm` keys and the orange **power-peak band**, a gear digit, mph. `ev-dashboard`: `meter: false`, and the meter's positive fill orange |
| N9 | **Chart card** (owner decision 1) | new | `src/components/ChartCard.tsx`, `src/types.ts` (`OverlaySpec`), `src/Explainer.tsx` (switch) | small to medium | As revision 2: power vs speed, the electric line rising to `30 MPH` then flat, ten humps touching it; shapes only. Brand-director adds it to the style guide |
| N10 | **Theme tokens** | extend | `src/theme.ts` (values from the brand-director) | small | `RACE.evPaint`, `RACE.gasPaint`, strip concrete/asphalt, board black/white; reuse `signalGreen`, `warning`, `section.sneaker`, `CAST_NEUTRAL` drivers |
| — | **Reuse as built** | reuse | — | — | `foot` keys with `press`, `footScale`, the light sneakers; `timeScale`; `cameraKeys` (`log`); `revsFrom`; `wheelsWhole`; `clusterOnScreen`; `ev-dashboard`; `Callout`; `TitleBlock`; `Captions`; `transitions.ts` (`cut`, `slide`, `continue`) |

**Order for parallel scene-builders** (separate worktrees; one owner per file at a time):

| Wave | Worker | Tasks | Files touched | Notes |
|---|---|---|---|---|
| 1 | A | N0 | `CarSliceScene.tsx`, new `SlicedCar.tsx` | Blocks N1, N2's and N3's mounting. Regression stills for No. 006 and No. 008 |
| 1 | B | N3 (components only) | `GasDrive.tsx` | V8, `Gearbox`, `rpm` / `gear` keys, built and stilled in isolation |
| 1 | C | N2 (body) + N10 | `RealCar.tsx`, `CarShell`, `theme.ts` | Coupe profile, paints (values from the brand-director) |
| 1 | D | N7 | `EvDrive.tsx`, new `DriveUnitScene.tsx`, `scenes/index.ts` | The only wave-1 worker in `EvDrive.tsx` and `index.ts` |
| 1 | E | N6, N8, N9 | `Counter.tsx`, `DetailBox.tsx`, `dashboardKit.ts`, new `ChartCard.tsx`, `types.ts`, `Explainer.tsx` | One worker, because `types.ts` and `Explainer.tsx` are shared |
| 1 | F | N5 | new `StripProps.tsx` | Independent |
| 2 | A or B | N2 + N3 mounting in `SlicedCar` (AWD, V8 / RWD) | `SlicedCar.tsx` | After N0, B, C |
| 2 | another | N1 | new `RaceSliceScene.tsx`, `scenes/index.ts` | After N0 and F; `index.ts` after D |
| 3 | one | N4 | `GasDrive.tsx`, `EvDrive.tsx` routes, new `PushArrow.tsx` | After waves 1–2 (touches B's and D's files); N7's arrow uses it, so U's arrow lands here |
| any | tooling | Audio (§ Sound plan) | `scripts/sfx-drive.mjs` | Independent of the scene work |

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

**Made by the owner (2026-10-25), all as recommended:**

1. **The chart card (N9)** for line 10: power vs speed in the detail box's frame, shapes only. The brand-director adds it to the
   style guide.
2. **Grey extras as the testers**, no cast member in this video (an exception to brand.md's "cast in every video").
3. **The hard cut at line 3** (one of the ≤ 2 allowed), back to the start line for the slow-motion replay.
4. **The gas gearbox as 8 stacked gear pairs** (🎭).
5. **Disclosures (🎭)** for the publisher's "Illustrative:" line: the two separate test runs shown side by side; race time
   compressed (line 1) and slowed (lines 3 to 11); arrow lengths, meters and chart are shapes, not measured data; 30 mph as this
   car's knee; the 8-pair gearbox (and its scale); the line-12 drive unit is a generic drawing, not Porsche's design; story time.
6. **Our own music bed**, ≈ 71 s.
7. **This video is No. 007**; drive-by-wire becomes No. 008. Title line 2: `NO. 007 · THE DRAG STRIP · 2:40 PM`.

**Open:** none. The one-way camera path (§ Camera path) is the director's application of the owner's No. 006/008 rule; the main
session should check it against the brief.
