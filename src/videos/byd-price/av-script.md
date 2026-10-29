# No. 011 · BYD price: audio + visual script (draft 3, 2026-10-29)

Director's draft, before voice. Words: `script.txt` (12 lines, 204 words; the owner restored the "expected answer" beat,
lines 3–4). Times are video seconds from the regenerated **estimated** `transcript.json` (82.3 s of speech + 1.5 s tail ≈
83.8 s). A directed take usually runs ≈ 9 % shorter (≈ 76 s), so every time and scene length gets re-timed on the real
take. Over 60 s: only our own music or none (style guide § 9 Licensing, § 10 Length).

## Decisions taken

- **D1 · Title block** (owner). Line 1 `Why is a BYD so much cheaper` / `than a Tesla?`. Line 2 `NO. 011 · THE PARKING LOT · 1:20 PM`.
- **D2 · Location C** (owner): the twin section with the **chargers hidden** (`chargers: false`, both regions).
- **D3 · Line 8's car** (owner): a **small BYD hatch** in `RACE.evPaint`, in The Lab · teardown (the Seagull teardown).
- **D4 · The "expected answer" beat** (owner, 2026-10-29): **restored** (lines 3–4). It plays **in C**, where both cars are:
  the `CHINA` label lands over both on "in China too", then the BYD's "made by" glow returns on "the parts". C then runs
  on through lines 5–7 (battery, cells, floor), so the slide count stays at 5.
- **D5 · The bars card** (owner): built. Fact-checker **CONDITIONAL PASS**; the six conditions below are requirements.

## What the screen has to say

One idea: **BYD makes the car's parts itself; Tesla buys some of the most expensive ones.** The hidden system (orange) is
**"made by BYD"**, drawn as style guide v0.14 § 5 sets it: **an orange edge line + a 25 % orange halo**, nothing else.
Cut faces stay `cut` with their hatch and surfaces keep their real material: never orange cut faces or panel faces.
Wherever this script says a part "glows" or "lights", it means that edge line and halo.

- **Orange:** BYD-made parts in the teardown grid and in the cars (pack, motor, the electronics, body panels, lamp housings),
  BYD's blades and the lid as it becomes the floor.
- **Not orange:** the Tesla's cells (bought), the grey quarter of the BYD's parts (tires, glass, seats, some chips; claims 8
  and 15), every card, the ghost, the supplier crates, the bars.
- **Honesty rules for the picture** (`sources.md` H, the hedges table, script checks):
  - Never "half" on screen as a number, except the bars card's optional `ABOUT HALF` label (fact-checker condition 4).
  - Never draw the Tesla as making nothing (claim 7). The 3/4 grid glow is on the BYD **alone**. In scene 6 the BYD glows
    in C with the Tesla in the bay below it: the camera has **glided to the BYD's bay alone** before the first part lights,
    so it never reads as "BYD lit, Tesla dark".
  - No chemistry gap (claim 12): the Tesla's cells are generic grey modules; the blades are generic too (no chemistry text).
  - No "only BYD" on the floor beat.
  - Line 3 ("subsidies and cheap labor") gets **no picture of its own claim**: no money, flags, factories or workers. The
    picture stays on the two cars; line 4 answers it ("Tesla builds the Model 3 in China too").
- **Names on screen:** `BYD` and `TESLA` car tags only. No UBS, Caresoft, S&P, Panasonic or CATL. Crates carry no names.

## Locations

| Code | Location | Scene (as built) |
|---|---|---|
| **C** | China, a parking lot: two cut-open sedans stacked like two sections on a sheet. Top: the BYD (`sedan`, `CHARGE.bydPaint`, **blade pack**). Bottom: the Model 3 (`sedan`, `CHARGE.teslaPaint`). Day, 1:20 PM (🎭) | `charge-slice`, `region: 'china'`, `chargers: false`, `canopy: false`, `bayPaint: false`, bottom `car: {shape: 'sedan'}`; top `car.blade` (grown before the scene); framings `twin`/`stack`, `wide`, `emptyBay`, `topPack`, `bottomPack` |
| **T** | **The Lab · teardown** (The Lab re-dressed, § 3; **no place label**). Dressing `sedan` (the car comes apart into the floor-tape grid) and `hatch` (the hatch whole on the stands) | `teardown-slice`; framings `whole`, `grid`, `pack`, `car`, `nose`, `tail`. A change of dressing is a `slide` |
| **U** | The US: the twin section, `region: 'us'`, chargers hidden. Top bay empty with the BYD's **ghost** (`shape: 'sedan'`), bottom the Model 3 | `charge-slice`, `region: 'us'`, `chargers: false`, `ghost` |

Locations run C → T → C → T → U → C: **5 slides**, plus the one `slide` inside T for the re-dressing (scene 15, § 3). No hard
cuts. `continue` (with one glide on the cue) inside a location. The camera pushes or drifts in every scene, frame 0 included.

## Scenes (estimated timings, 20 scenes)

| Sc | Loc | Cue | In → out (s) | Len | Camera |
|---|---|---|---|---|---|
| 1 | C | `In China` | 0.00 → 6.20 | 6.2 | `twin` (or `stack` at 42), slow push from frame 0 |
| 2 | T | `Analysts who took` | 6.20 → 9.28 | 3.1 | slide in on `whole`, push |
| 3 | T | `about three quarters` | 9.28 → 14.27 | 5.0 | glide to `grid` (the parts are small at `whole`), push |
| 4 | C | `People tend to` | 14.27 → 17.87 | 3.6 | slide in on `wide`, slow push |
| 5 | C | `Subsidies do help` | 17.87 → 22.51 | 4.6 | push continues toward `twin` |
| 6 | C | `and the teardown pointed` | 22.51 → 25.96 | 3.5 | glide to the BYD's bay (`emptyBay`, car in), push |
| 7 | C | `The battery is` | 25.96 → 28.84 | 2.9 | glide to `topPack`, push |
| 8 | C | `and industry analysts` | 28.84 → 34.51 | 5.7 | push |
| 9 | C | `Tesla's annual report` | 34.51 → 41.03 | 6.5 | glide down to `bottomPack`, push |
| 10 | C | `BYD makes its own cells` | 41.03 → 45.97 | 4.9 | glide up to `topPack`, push |
| 11 | C | `and it builds the pack` | 45.97 → 49.43 | 3.5 | slow pull (the cabin over the pack) |
| 12 | T | `A different teardown` | 49.43 → 53.33 | 3.9 | slide in on `car` (hatch dressing), push |
| 13 | T | `the electronics that` | 53.33 → 55.54 | 2.2 | glide to `nose`, push |
| 14 | T | `even the body` | 55.54 → 58.12 | 2.6 | glide back to `car`, push |
| 15 | T | `But that first` | 58.12 → 61.20 | 3.1 | `slide` (re-dressing → the sedan and its grid), `grid`, push |
| 16 | T | `only about 15` | 61.20 → 66.31 | 5.1 | slow push (the card is up) |
| 17 | T | `Part of the remaining` | 66.31 → 73.35 | 7.0 | slow pull (the card is up) |
| 18 | U | `You can't buy` | 73.35 → 77.90 | 4.6 | slide in on `twin` (US), push |
| 19 | U | `and a ban on` | 77.90 → 81.13 | 3.2 | glide to `emptyBay` (the ghost), push |
| 20 | C | `with 2027 models` | 81.13 → ≈ 83.77 | 2.6 | slide to C, glide and push landing on frame 0's framing **at frame 0's push speed** |

Cues are unique searching forward (`BYD makes its own cells` is the second "BYD makes"; `the teardown pointed` the first
"teardown" after line 2's "took one apart"; `But that first` only in line 9; `with 2027 models` after "starting with").
Scenes 13 (2.2 s), 14 (2.6 s) and 20 (2.6 s) are short; each has its own move and two events. **Option:** merge 13–14 into one
scene on `car` with a push (4.8 s) if the inverter reads well enough at `car` on stills (see the limits). Scene 17 (7.0 s) is long:
see the line flags.

## The beat table

**Bold** = a story event. "Every 2–3 s" lists the visible events in order so the gaps can be checked. Camera push and
drift run throughout and don't count as events.

| Sc | Words | Picture | Visible events (every 2–3 s) | Overlays |
|---|---|---|---|---|
| **1** | In China, a BYD the size of a Tesla Model 3 starts at about half the price. | **Frame 0, C, 1:20 PM.** The Model 3 parked in the bottom bay, its driver (grey extra) at the curb. The BYD **reversing the last ≈ 2 m into the top bay**, wheels turning the right way. Same body length. No orange yet | **0.0 the BYD rolls in** · **0.3 tags in** · **1.2 the BYD stops**, brake lamps on, off at 1.7 · **2.0 the BYD's driver gets out** and walks to the nose · **3.8 tags out** · **4.4 the Tesla's driver walks from the curb to his car** · **4.8 "half": both drivers stand at their cars** | **Title block** 0 → ≈ 6.3 (D1). **Tags** `BYD` / `TESLA` on the roofs, left at x 120, 0.3 → 3.8 |
| **2** | Analysts who took one apart found BYD makes | **T, `sedan` dressing.** The BYD sedan whole on the stands, the grid empty. **It comes apart** into the floor-tape grid | **6.2 slide in** (lands 6.8) · **7.1 "took one apart": `apart`** (parts fly to their cells, big to small, 1.3 s) · **8.4 the last parts land**; **8.6 `scan`** (ink line, grid, 1.0 s) | Captions |
| **3** | about three quarters of that car's parts, starting with the battery. | The grid close (`grid`): **3 of every 4 parts light**, the bought quarter darkens | **9.3 glide to `grid`** (lands 10.0) · **9.3 `glow` wave 1: the pack** · **9.7 wave 2: every other made group**, `wave` 1.9 s, `sweep` · **11.7 `dimAt`**: the bought quarter × 0.8 · **12.2 "starting with": `surge` on the pack** · **13.4 "battery": `lift`** (the pack rises 5 cm and settles) | Captions. No counter (the grid is the number) |
| **4** | People tend to credit subsidies and cheap labor. | **C wide:** both cars in their bays, the BYD's driver by his car, the Tesla's driver at his. No orange (C opens clean) | **14.3 slide in** (lands 14.9) · **15.3 the Tesla's driver walks round to his door** · **16.7 the BYD's driver takes out his phone** (it faces him) | Captions |
| **5** | Subsidies do help, but Tesla builds the Model 3 in China too, | As 4; the push closes toward `twin` | **18.5 the Tesla's driver opens his door** · **19.6 "Tesla": he gets in**, door shut 20.2 · **20.9 the BYD's driver pockets his phone and walks to his door** · **21.5 "China": the label lands** | **Place label** `CHINA` 21.5 → 22.9 (sky band, x 120, y 300; the title block is long gone) |
| **6** | and the teardown pointed mainly to the parts. | The BYD's bay alone (`emptyBay` with the car in). **Its BYD-made parts light inside the cut car** (`madeBy` on the top bay's car) | **22.6 glide to the BYD's bay** (lands 23.3) · **23.2 "teardown": `pack`** · **24.2 "mainly": `driveUnit`, then `inverter` with `pulses`** · **24.6 `panels` nose to tail** (stagger 0.25) · **25.0 `lamps`** · **25.2 "parts": `surge`** all | Captions |
| **7** | The battery is the most expensive part, | The BYD's pack close (`topPack`): the blade pack, lit | **26.0 glide to `topPack`** (lands 26.7) · **26.3 "battery": `fadeAt`** on every group but the pack · **28.3 "part": the pack surges** | Captions |
| **8** | and industry analysts put it at 30 to 40 percent of an electric car's cost. | As 7; the BYD's driver comes into the cabin above the pack | **29.7 "analysts": the counter enters** · **31.1 it lands on 30** · **31.6 "–40" lands** · **32.9 the BYD's driver gets in and sits** (seen in the cut cabin) · **33.8 "cost": the pack surges once**; the counter leaves 34.2 | **Counter** `30–40 %`, sub `OF AN EV'S COST` (`rangeTo: 40`), 29.7 → 34.2, in the sky band over the top bay (set on stills) |
| **9** | Tesla's annual report says it buys its battery cells from suppliers like Panasonic and CATL. | The Tesla's pack in the bottom bay (`bottomPack`). **The pack empties, then crates refill it** (see the continuity flag) | **34.6 glide down** (lands 35.3) · **35.3 the rewind: the Tesla's modules slide out of their slots and away** (0.6 s, N7) · **35.6 crate 1 `in`** · **36.4 lid opens** · **36.6 "buys": the first module drops in**, then 37.3, 38.0 · **39.2 "like Panasonic": crate 1 `out`, crate 2 `in`** · **39.9, 40.3, 40.7 its modules drop in**. All grey | **Callout** `CELLS` / `Bought in`, leader to crate 1, 37.2 → 38.9 (optional) |
| **10** | BYD makes its own cells, which are long, flat iron-phosphate blades, | The BYD's pack (`topPack`): **the tray empties, then the blades grow in place**, each top edge lighting as it rises | **41.1 glide up** (lands 41.8) · **41.8 the rewind: the blades sink into the tray** (0.4 s, N7) · **42.1 "own": `growAt`** (front to back, 3 s) · **43.7 "long, flat": `showAt`**, one blade slides ≈ 1 m toward the camera · **45.0 `backAt`** · **45.1 the last blades rise** | **Callout** `BLADE CELLS` / `Made by BYD`, leader to the slid-out blade, 43.8 → 45.6 |
| **11** | and it builds the pack into the car's floor. | Pull back: the cabin over the pack, the driver seated. **The old floor goes, the lid becomes the floor** | **46.0 the pull starts** · **46.5 "builds": `floorAt`** (the floor panel lifts and fades) · **47.3 "pack": `lidAt`** (the lid rises to floor height, edge lit) · **48.3 "floor": `settleAt`**, the seats settle 2 cm, the driver rocks once | Captions |
| **12** | A different teardown found BYD makes its own motors | **T, `hatch` dressing**, `carScale` 0.9: the hatch whole on the stands (D3) | **49.4 slide in** (lands 50.0) · **50.3 "teardown": `scan` along the car** · **51.2 "found": the wheels and rotor start turning on the stands** (`driving`) · **52.6 "motors": `driveUnit` lights** | Captions. Optional tag `BYD` on the hatch's roof 49.8 → 51.8 (a new car) |
| **13** | and the electronics that run them, | The hatch's nose (`nose`) | **53.4 glide to `nose`** (lands 54.0) · **53.7 "electronics": `inverter` lights, `pulses` down the link to the motor** · **55.0 "them": the rotor speeds up** | Captions |
| **14** | even the body panels and lights. | The hatch whole again (`car`) | **55.6 glide back to `car`** (lands 56.3) · **56.2 "body panels": `panels` nose to tail** · **57.0 "lights": `lamps`**, heads then tails · **57.8 `surge`** all | Captions |
| **15** | But that first teardown found the BYD costs | **T, `sedan` dressing** again, in scene 3's lit state (the trace), on `grid` | **58.2 the slide** (lands 58.8) · **59.2 "teardown": `surge`** all · **60.5 "BYD": the stripped shell's edge lights** (`madeBy.panels` on the shell) | Captions |
| **16** | only about 15 percent less to build than a Model 3 made in China. | The bars card over the room's upper half, the footnote on from its first frame | **61.3 the card enters** with the footnote · **61.6 the `TO BUILD · 2023 SEAL` row: the TESLA bar grows** · **62.1 the BYD bar grows to 0.85** · **62.7 the bracket draws** (measured) · **63.1 "less": `ABOUT 15% LESS` lands** · **64.4 "Model 3": the grid behind surges (low, under the card)** · **65.6 "China": a second low surge** | **Bars card** (N6), tab `COST`, names `TESLA` / `BYD` in the left column, 696 × 620. Row 1 `TO BUILD · 2023 SEAL`, value 0.85, bracket `ABOUT 15% LESS` (measured). Footnote throughout. 61.3 → 71.9 (carries into 17) |
| **17** | Part of the remaining price gap comes from the cheapest trim's shorter range and China's price war. | The same card | **66.4 the `TO BUY · 2026 SEAL 06` row: the TESLA bar grows** (its own scale) · **67.9 "price": the BYD bar grows to 0.47** · **68.6 the bracket draws** (`measured: false`, by eye to 0.75) · **69.7 "trim's": `ABOUT HALF` lands** (optional bar label) · **71.1 "range": `PART OF THE REST` lands** · **71.9 the card leaves** · **72.3 "price war": the grid settles, the camera pulls** | Bars card (carried). Row 2 value 0.47, `barLabel` `ABOUT HALF` (optional), bracket `PART OF THE REST` (fallback `THE REST`). Footnote throughout |
| **18** | You can't buy one in the US. There's a 100 percent tariff, | **U, 1:20.** The top bay empty, the Model 3 parked below, its driver at the door | **73.4 slide in** (lands 74.0) · **73.7 "can't buy": the ghost draws** (0.8 s, nose back) · **75.0 "US": the label lands** · **75.6 the Tesla's driver gets in** · **76.4 the counter enters, 77.0 lands on 100** | **Place label** `THE US` 75.0 → 76.3 · **Counter** `100 %`, sub `TARIFF`, 76.4 → 77.9 |
| **19** | and a ban on Chinese-linked car software starts | The empty bay and the ghost (`emptyBay`) | **77.9 glide to the ghost** (lands 78.7) · **78.8 the callout's leader draws to the ghost's roof** · **79.9 the Tesla's lamps come on below** · **80.6 the ghost starts to fade** | **Callout** `SOFTWARE BAN` / `From 2027 models`, anchor `ghost`, 78.8 → 81.0 |
| **20** | with 2027 models. | **C again, 1:20:** the Model 3 parked below, the BYD reversing into the top bay | **81.2 the slide** (lands 81.8) · **81.8 the BYD rolls in from off frame**, slowing · **82.6 the Tesla's driver sits back at the curb** · **last frame = frame 0**: the BYD ≈ 2 m short and rolling, the drivers as on frame 0, the camera on frame 0's framing mid-push | Captions end at "models." |

### The gaps, checked

Longest stretch with no listed event: 1 · 1.8 s (2.0 → 3.8) · 2 · 1.3 · 3 · 1.2 · 4 · 1.4 · 5 · 1.1 · 6 · 1.0 · 7 · 2.0
(26.3 → 28.3) · 8 · 1.5 · 9 · 1.2 · 10 · 1.6 · 11 · 1.0 · 12 · 1.4 · 13 · 1.3 · 14 · 0.8 · 15 · 1.3 · 16 · 1.3 · 17 · 1.4 ·
18 · 1.3 · 19 · 1.1 · 20 · 1.2. None reaches 3 s.

## Frame 0 and the loop

- **Frame 0** (C, 1:20, `twin` or `stack`): the BYD rolling the last 2 m into the top bay, the Model 3 parked below, its
  driver at the curb, the title block in the sky band, the camera already pushing.
- **The last frame** is the same state, reached by scene 20 (a new arrival at 1:20, as No. 010's loop). Both packs full, no
  orange. "…starts with 2027 models." leads into "In China, a BYD…".

## As built (scene-builder) and limits

Props the spec will use, from `src/scenes/TeardownSliceScene.tsx`, `ChargeSliceScene.tsx`, `SlicedCar.tsx` and `ChartCard.tsx`:

- **`teardown-slice`** (N1): `dressing` `'sedan' | 'hatch'`, `car` (SlicedCar options, `madeBy` on the hatch), `carScale`
  (hatch 0.9), `apart {at, for}`, `scan [{at, for, along: 'grid' | 'car'}]`, `glow [{at, groups, wave, order}]`, `share`
  (3 of 4, default on), `surge`, `focus`, `dimAt`, `lift`, framings `whole | grid | pack | car | nose | tail`, `cameraKeys`.
  **Limit:** the grid's parts are small at `whole` (distance 31); every grid beat that needs the parts read is on `grid`
  (22) or pushes in (scenes 3, 15–17).
- **`SlicedCar.madeBy`** (N2): `pack`, `driveUnit`, `inverter` (+ `pulses {at, every, until}`), `panels {stagger, order}`,
  `lamps {stagger}`, `surge`, `fadeAt`. **Limit:** the inverter sits partly behind the dash; at the `emptyBay` (scene 6) and
  `car` distances it reads mainly by its halo and the pulses on the link. Scene 13 glides to `nose` for it.
- **`SlicedCar.blade`** (N3): `growAt`, `growFor` (3 s), `showAt`, `showFor`, `backAt`, `showIndex`, `floorAt`, `lidAt`,
  `settleAt`, `glow`. In C the BYD carries it from scene 1 (grown before frame 0) so its pack looks the same all video.
- **`charge-slice`** (N4, N5): `chargers: false`; bay `bought: {crates: [{in, open, drops, out, slots}], at}` (modules
  slide in through the cut face, never orange); framings `topPack`, `bottomPack`; a sedan in the bottom bay
  (`car: {shape: 'sedan'}`).
- **`ChartCard` `bars`** (N6): `bars: [{label, refAt, value, valueAt, barLabel, barLabelAt, bracket: {label, at, labelAt,
  measured, to}}]` (times after the card enters), `barNames` (default `['TESLA', 'BYD']`), `footnote: string[]`
  (card 620 high with it), tab `COST`.

## Still to build

| # | What | Behaviour I need | Used in |
|---|---|---|---|
| **N7** | **The pack rewind** (`charge-slice` / `SlicedCar`) | So a pack seen full can be filled on screen without breaking "the same object across cuts" (§ 8): a key that **empties** a pack quickly before its fill beat. Tesla: its modules slide out of their slots and away to the right (0.6 s). BYD: the blades sink back into the tray (0.4 s), then `growAt` runs as built. Reads like No. 010's rewind (owner-accepted). Times may lie outside the scene | 9, 10 |

## Bars card requirements (fact-checker, CONDITIONAL PASS; as style guide v0.14 § 6)

All six are requirements for scenes 16–17 (script lines 9–10):

1. **Row labels** `TO BUILD · 2023 SEAL` and `TO BUY · 2026 SEAL 06`. No firm names anywhere on the card.
2. **Footnote, the whole time the card is up** (61.3 → 71.9): `Different BYD models. Cost: 2023 estimate.` /
   `Price: China list, cheapest trim.` Two lines inside the card under the bars, Inter 600 **24 px**, under a 1 px rule;
   part of the card, not a second card. Card 696 × 620 at x 120, y 330: inside the safe zone, clear of the captions.
3. **TO BUILD row:** TESLA bar full, BYD bar at 0.85, bracket label exactly `ABOUT 15% LESS` (measured span).
4. **TO BUY row:** BYD bar at 0.47 of the TESLA bar, no number on it; the only optional label is `ABOUT HALF`.
5. **Bracket label** `PART OF THE REST` (or `THE REST`), never `NOT FROM BUILD COST`. Drawn crisp but sized by eye
   (`measured: false`, to 0.75), naming no causes.
6. **No shared scale:** each row on its own reference bar with its own zero rule, nothing running between rows, and no BYD
   bar split into "cost" and "other". Names in the left column, not at the bar ends.

## Line flags (hard to show or badly paced)

- **Line 3** ("People tend to credit subsidies and cheap labor", 3.6 s) has no honest picture of its own: it's the expected
  answer the next line corrects. The picture stays on the two cars and the drivers; line 4's `CHINA` label (both cars
  under it) does the answering.
- **The pack continuity (scenes 9–10).** Both packs are seen full from frame 0 (and the BYD's lit in scenes 6–8), then
  filled on screen in 9–10. Without N7 that breaks "the same object across cuts". **Recommended: build N7.** Fallback with
  no build: the BYD's blades stay in place and light in a front-to-back wave instead of growing (`blade.glow` only, loses
  "grown in place"); the Tesla's crate beat keeps the break (the reviewer will flag it).
- **Line 10** ("Part of the remaining price gap…", 7.0 s in one scene, over the 3–6 s rule) gives two causes no source
  sizes, so the card brackets "part of the rest" and stops there.
- **Line 8** is the Seagull teardown (claim 9): shown on the hatch (D3), so the Seal isn't credited with its findings.
- **Line 11** (2.1 s) shares scene 18 with line 12's first half: one US beat, two cards in sequence (label, then counter).
- **Line 1:** the title question is never spoken (as in No. 010).
- **"Teardown" three times** (lines 2, 4, 9): scene 6 lights the parts on the BYD itself (the finding, in C), and scene 15
  slides back to the first car's grid, so "that first teardown" resolves on screen.

## For the publisher's 🎭 "Illustrative:" line

The cars, drivers, crates and teardown room are generic; the parts grid and its "3 of 4" glow show the analysts' share, not
the real parts list; the pack emptying and refilling is a re-enactment; the bars are shapes, each row on its own scale
(lengths from the voice's numbers, no axis values), and the two rows are different BYD models (the card's footnote says
so); the story time; the ghost.

## Sound (physical only; for tooling, nothing generated)

Tires rolling in and a brake creak (1, 20), car doors (1, 5, 8, 18), parts landing on the lab floor (soft, staggered,
ducked, 2), a crate sliding on concrete and modules seating (9), an optional low hum while the orange is up in T (≈ 20 dB
under the voice). No whooshes beyond the slide whoosh, no risers, no "glow" sounds.
