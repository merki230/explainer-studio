# No. 016 · EV cost: audio + visual script (draft 1, 2026-11-05, before voice)

Words: `script.txt` as approved by the owner (17 lines, after fact-check PASS; line 15 already carries the fact-checker's
hedge "it can take"). Times are **estimates** from `transcript.json` (`yarn timings`, no audio): voice 0.15 → 92.19 s,
plus a 1.5 s tail, comes to **≈ 93.7 s**. The estimate runs at ≈ 2.5 words/s. Our narrator measures ≈ 2.7 words/s, so the
real take should land near **≈ 83–85 s**, not the brief's ≈ 76 s (F2). Every time below gets re-read from the real
transcript when `spec.ts` is written, after the voiceover.

## The look in one paragraph

One compact SUV in two versions, a generic **crossover** (`shape: 'crossover'`, no badge or model cue: the voice names
no model, so § 3 Real car models doesn't apply, as in No. 014). The **electric version** is YOU's car (YOU's paint). The
**gas version** is the same body in `TWINS.gasPaint`, driven by an extra. Two places. **P, the plug sheet:** three cut
sections stacked on one sheet with sky between them, the three plugs of the story. On top is a **home garage** (the
EV nose-in at a wall charger). In the middle is a **gas pump island** (the gas twin at a pump). At the bottom is a
**US fast-charger row** (four posts, its utility feed at the end: a pole, a pad transformer, a meter). **A, the
street:** the No. 014 twin corner (`city-twin`), the EV in the top lane and the gas twin below, for driving and upkeep.
**Orange is only the demand fee**: the meter's peak pointer, the path from the meter to the utility, the fee slab and
its share-out to the drivers. Not orange: the charging current and the pack's charge (not drawn in this video), the
port rings (`signalGreen`), the regen and the brakes (ink and grey, F4), the weight arrow, every card. Day mood
throughout (🎭 5:40 PM).

**On-screen words** (all ink, plain labels): the title block; car tags `ELECTRIC` / `GAS`; counters `15` / `6` / `17`
`CENTS A MILE`, `6,000` `DOLLARS MORE`, `3` / `17` `YEARS`; callouts `BUSIEST 15 MIN`, `ENGINE OIL`; the bars card
`VALUE LOST` (`EV`, `GAS`). No maker, model, utility, network, price sign, per-kWh price or source text. The pump's
display stays dark (F15).

## Locations

| Code | Location | Built with |
|---|---|---|
| **P** | The plug sheet, three sections stacked at the fixed angle (top → bottom): **home garage** (slab, back and side wall cut, a wall charger with its holster, a door into the house, a shelf, YOU's EV nose-in, plugged; a house meter on the outside wall), **pump island** (asphalt, a generic pump on its island, hose and nozzle, the gas twin beside it, its filler door open, an extra fuelling), **fast-charger row** (the `charge-slice` US bay grammar widened to 4 posts in a row, asphalt, curb, the station clock; at the row's end a utility pole, a pad transformer and a meter cabinet; the feed runs along the ground's front cut face to the posts) | **N1** (new `plug-sheet` scene, or `charge-slice` with bay kinds; the scene-builder decides), **N2** (supply), **N3** (fee slab), **N4** (pump + filler door) |
| **A** | The corner as a twin section (No. 014): two stacked city lanes, signals in sync, lead cars. Top: YOU's EV crossover. Bottom: the gas crossover, extra driving, engine idling, grey puffs | `city-twin` with `top: {variant: 'ev', shape: 'crossover'}`, `bottom: {variant: 'gas', shape: 'crossover'}` + **N5** (framings), **N6** (brakes), **N7** (tread) |

P → (slide) → A → (slide) → P → (slide) → A → (slide) → P. **Four slides**, no hard cuts. Inside each location every
framing change is a glide. The last P stay (scenes 16–19) ends in a glide onto frame 0 (the loop, N8).

## Title block

Line 1: `Does an EV cost less` / `per mile than gas?` (20 / 18 characters). Line 2: `NO. 016 · THE PLUGS · 5:40 PM`. Up
from frame 0, fades at ≈ 8.0 s (0.8 s after line 2 ends; no card before scene 6). The script asks no question until
the end, so this is the No. 014 / No. 015 F1 pattern (F1).

## Line by line

Cues are copied word for word from `script.txt`. "The electric version costs" and "And the electric version", and
"If you charge mostly" and "If you only use", run long enough to stay unique. Times are video seconds (estimates).

| Sc | Cue · in (s) | Line (words) | What's on screen | Motion / events (s) | Overlay | Transition in |
|---|---|---|---|---|---|---|
| 1 | `An EV can cost` · 0.00 | An EV can cost less per mile than a gas car, or more. | **Frame 0, P `sheet`:** all three sections. Home: YOU's EV plugged, YOU walking from the car toward the house door. Pump: the gas twin, the extra holding the nozzle in the filler. Fast row: post 1 busy (an EV in YOU's paint, extra B on the curb with a phone), posts 2–4 empty | 0.0 slow push starts, drift 0 · 1.0 "cost" YOU reaches the house door and goes in · 1.7 "per mile" a car reverses toward post 3 from frame right (reverse lamps white, wheels rolling backward, as it moves) · 2.9 "gas car" the pump handle clicks off, the nozzle rocks once · 4.0 "more" the reversing car stops at post 3, brake lamps lit | **Title block** 0 → 8.0 | — (frame 0) |
| 2 | `It comes down to` · 4.66 | It comes down to which plug you use. | P, glide to `plugs` (a little closer: the three connectors in a near-vertical line) | 4.7 glide (0.8 s) · 5.3 the pump extra hangs the nozzle back, closes the filler door · 6.0 "which" post 3's driver gets out · 6.4 "plug" post 3's plug latches (port ring `signalGreen`) · 7.0 "use" home: the wall charger's status LED steps from blinking to steady green | Title block | continue (glide) |
| 3 | `Some people swear` · 7.66 | Some people swear an EV is cheaper to run, | P, glide to `home` (the garage close: the EV, cable, wall charger, the house door) | 7.7 glide · 8.5 "swear" YOU comes back out of the house door, phone in hand · 9.7 "cheaper" YOU leans on the EV's roof, reading the phone (it faces YOU) · 10.4 the charger LED pulses once | — | continue (glide) |
| 4 | `others say it costs` · 10.90 | others say it costs more, and they can both be right. | P, glide down to `fast` (the four posts close), then crane out to `sheet` on "both" | 10.9 glide · 11.4 "say" post 3's driver leans on the island, phone in hand · 12.3 "more" post 1's driver unplugs and gets in · 13.5 crane out (1.0 s) · 13.8 "both" home and fast row both in frame · 14.6 post 1's car drives out forward (lamps off, wheels forward) | — | continue (glide) |
| 5 | `Look at a compact` · 15.20 | Look at a compact SUV that comes in gas and electric versions. | **A `stack`:** both crossovers rolling at ≈ 25 mph behind their lead cars, storefronts streaming toward the tail | 15.2 slide (18 fr) · 16.5 "SUV" a lead car's brake lamps flick · 17.2 tags in · 17.9 "gas" a grey puff from the gas twin · 18.5 "electric" the EV beside it, no puff, no engine · 19.0 both brake gently for a yellow, lamps lit | **Tags** `ELECTRIC` (top, YOU's paint square) / `GAS` (bottom, `TWINS.gasPaint`), 17.0 → 19.7 | **slide** |
| 6 | `At today's prices` · 19.94 | At today's prices, the gas one costs about fifteen cents a mile. | A, glide to `bottomCar` (the gas twin whole, its engine bay, sky over the top lane kept for the counter) | 19.9 glide · 20.7 both stopped at the red, the gas engine idling (tremor) · 21.6 "gas" a puff · 22.2 green; the gas twin pulls away, revs, a bigger puff · 23.5 "fifteen cents" the counter lands · 24.2 "mile" the street scrolls at speed | **Counter** `15` / `CENTS A MILE` / sub `GAS`, 22.4 → 24.7, counts 0 → 15 landing on "cents" | continue (glide) |
| 7 | `The electric version costs` · 24.84 | The electric version costs about six cents, if you charge it at home at the average US rate. | **P `home`:** YOU's EV plugged in the garage | 24.8 slide · 25.7 "version" YOU walks round the car's tail · 26.4 counter in · 27.4 "six cents" it lands · 28.5 "charge" YOU tugs the cable straight; the charger LED steady · 29.5 "home" glide out a little to show the house's cut outside wall and its meter, the meter's dial turning slowly (neutral, never orange) · 31.2 "rate" YOU goes back in | **Counter** `6` / `CENTS A MILE` / sub `AT HOME · AVERAGE RATE`, 26.4 → 31.4, landing on "cents" (27.4) | **slide** |
| 8 | `At a public fast` · 31.85 | At a public fast charger, that same mile costs about seventeen cents. | P, glide down to `fast` | 31.9 glide · 32.8 "fast" an EV reverses into post 2 · 33.8 it stops, lamps lit · 34.5 "mile" its driver gets out and lifts the connector · 35.7 "seventeen" counter lands at 36.3 · 36.6 the plug latches, ring green | **Counter** `17` / `CENTS A MILE` / sub `FAST CHARGER`, 35.0 → 37.0 (F5) | continue (glide) |
| 9 | `Why do fast chargers` · 37.05 | Why do fast chargers cost so much more? | P, glide out to `row` (all four posts; the pole, transformer and meter at the row's right end) | 37.1 glide · 38.0 "chargers" post 3's car unplugs · 38.9 its driver walks to the door · 39.5 "more" the **time-lapse** starts: the station clock's hands speed up, clouds drift, shadows swing | — | continue (glide) |
| 10 | `Many fast chargers pay` · 40.20 | Many fast chargers pay the utility an extra fee set by their busiest fifteen minutes of the month. | P, glide to `supply` (pole, transformer, meter cabinet with its dial, the feed along the cut face; two posts in frame) | 40.2 glide · 40.9 time-lapse running: cars come and go at the posts (time-lapse speed), the meter's needle rising and falling with them · 42.1 "utility" the line up the pole is in frame, wires to the frame top · 43.3 "fee" the meter's **peak pointer** appears, orange, riding just above the needle · 44.6 "busiest" all four posts busy at once; the needle shoves the pointer to its highest mark; the pointer holds there · 45.1 "fifteen minutes" an orange **path** draws from the meter up the pole and out of the frame top (to the utility), pulses up · 46.4 "month" the clock keeps spinning, the cars leave, the needle drops; the pointer stays at the peak (§ 5 Trace) | **Callout** `BUSIEST 15 MIN` / `Sets the fee` on the peak pointer, 44.8 → 46.9 (F6) | continue (glide) |
| 11 | `And the average fast` · 47.40 | And the average fast charger sits idle most of the day, so fewer drivers share that fee. | P, glide back out to `row`; the time-lapse runs through a day | 47.4 glide · 48.0 one car in, one out; most posts empty · 49.4 "sits idle" dashed ink **ghost cars** draw into the three empty bays (0.8 s), the drivers who aren't there · 50.7 the ghosts fade (0.7 s) · 51.2 an orange **fee slab** lifts off the meter · 51.8 "fewer drivers" it splits into **two** big pieces, one per car on the row · 52.7 "share" each piece slides along the feed on the cut face to its post (node dot lights) · 53.5 "fee" the pieces land; the pointer still lit | — | continue (glide) |
| 12 | `Wherever you charge` · 54.10 | Wherever you charge, an EV needs no oil changes, | **A `bays`:** both front bays, the EV's drive unit on top, the gas four-cylinder below with its oil pan cut | 54.1 slide · 54.7 both rolling; the signal ahead goes yellow · 55.5 both brake, stopped, lamps lit · 56.1 "needs" the gas engine idles (tremor) · 56.8 "oil" callout on the gas oil pan · 57.4 a puff (gas) | **Callout** `ENGINE OIL` / `Gas version only` on the gas oil pan, 56.6 → 57.8 (F9) | **slide** |
| 13 | `and its brakes last` · 57.80 | and its brakes last longer because the motor does much of the slowing. | A, glide to `twinBrakes` (both near front wheels, whole, calipers in view through the spokes) | 57.8 glide · 58.1 green; both pull away (wheels forward) · 58.8 "last" the next signal yellow · 59.2 "longer" both brake: the gas twin's caliper squeezes, a faint grey **dust puff** off its disc · 59.7 "because" the EV's caliper barely closes; an **ink** curved arrow runs from its wheel to the drive unit (F4) · 60.5 "motor" the drive unit's rotor is seen turning · 61.9 "slowing" both stopped, lamps lit | — | continue (glide) |
| 14 | `EVs tend to be` · 63.01 | EVs tend to be heavier, so their tires can wear out sooner. | A, glide to `wheels` (both near rear wheels and the road under them) | 63.0 glide · 63.9 "heavier" an **ink** weight arrow draws down over the EV's rear wheel; its tire's contact patch flattens a touch more than the gas twin's · 64.9 green, both pull away · 65.5 "tires" the tread **time-lapse**: both treads wear, the EV's a step faster (ink depth ticks on each cut tire) · 66.9 "sooner" the EV's tread sits visibly lower; the arrow fades | — (F10) | continue (glide) |
| 15 | `And the electric version` · 67.71 | And the electric version also costs about six thousand dollars more to buy. | A, glide out to `stack` | 67.7 glide · 68.3 "electric" the lead cars brake · 69.4 both twins stop, lamps lit · 69.8 counter in · 71.5 "dollars" it lands · 72.3 a puff (gas) · 72.8 green | **Counter** `6,000` / `DOLLARS MORE` / sub `TO BUY`, 69.6 → 73.0, landing on "dollars" | continue (glide) |
| 16 | `If you charge mostly` · 73.21 | If you charge mostly at home, the savings cover that gap in about three years. | **P `home`**, a slow time-lapse of days: the EV leaves each morning and reverses back in each evening; YOU plugs it in | 73.2 slide · 73.8 "charge" YOU plugs in, ring green · 74.7 time-lapse starts: shadows swing · 75.3 the EV unplugs and drives out forward · 76.3 "cover" it reverses back in, lamps lit · 77.1 "gap" plugged again · 78.0 "three" counter lands · 78.5 the next cycle starts | **Counter** `3` / `YEARS` / sub `TO CATCH UP · AT HOME`, 75.5 → 79.0, landing on "three" (F12) | **slide** |
| 17 | `If you only use` · 79.19 | If you only use fast chargers, it can take about seventeen years. | P, glide down to `row`, time-lapse, cars cycling through the posts | 79.2 glide · 80.4 "fast" an EV reverses into post 2 · 81.0 plugged · 81.8 "can take" it leaves, another comes in at post 4 · 82.8 "seventeen" the FAST row of the counter runs on and lands at 83.5 · 83.8 a post's car leaves | **Counter** (rows) `HOME` 3 (already stopped) / `FAST` 3 → 17, label `YEARS`, 79.6 → 84.0, FAST landing on "years" (F12) | continue (glide) |
| 18 | `But EVs also tend` · 84.19 | But EVs also tend to lose value faster, and that can cut into those savings. | P, glide to `rowLow` (the fast row low in the frame, under the card); the time-lapse slows | 84.2 glide · 85.0 card in · 85.8 "lose" the GAS bar draws · 86.6 "faster" the EV bar draws, longer · 87.5 a car leaves post 1 · 88.2 "cut into" the EV bar's extra length gets an ink bracket · 89.2 "savings" the card holds; off-frame, home and pump sections reset to frame 0 (N8) | **Chart card, bars mode** tab `VALUE`, one row `VALUE LOST` with bars `EV` / `GAS` (ink only, no numbers), 85.0 → 89.7 (F11) | continue (glide) |
| 19 | `Which plug would you` · 90.07 | Which plug would you use most? | P, glide up and out to `sheet`: frame 0's framing | 90.1 glide (1.2 s) · 90.5 "plug" the pump extra lifts the nozzle into the filler · 91.3 "you" YOU walks from the EV toward the house door · 91.9 the car for post 3 is just out of frame right · 92.2 voice ends, captions end · 93.7 **last frame = frame 0** | — (captions end) | continue (glide) |

### Gaps (longest stretch with no listed event, estimated)

Every scene has an event at least every ≈ 2 s on the estimates. The longest gaps are scene 1 (1.7 → 2.9), scene 7
(29.5 → 31.2, the glide fills it), scene 10 (40.9 → 42.1, covered by the time-lapse traffic) and scene 18
(86.6 → 87.5). Re-check on the real take.

### Scene lengths

Between 2.1 and 7.2 s estimated (≈ 1.9 to 6.4 s on the real take). **Over 6 s estimated:** scene 7 (7.0), scene 10
(7.2) and scene 11 (6.7). Each holds one card or one continuous time-lapse beat; splitting 7 at `if you charge it` or 10
at `set by their busiest` would make the counter or callout blink out and back in. Split only if the take stretches one
past 7 s. **Short:** scene 2 (3.0), scene 9 (3.2), scene 19 (2.1 voice + 1.5 tail).

## Lines that are hard to show (fixes proposed, not made)

- **F1 · No question until the end.** The only questions are line 8 ("Why do fast chargers…", 37 s) and line 17 (the
  ending). **Proposal:** the title block asks `Does an EV cost less per mile than gas?` from frame 0 and fades at
  ≈ 8.0 s (the No. 014 / No. 015 precedent). Alternative: `Which plug would you use most?` (the spoken ending), but it
  makes no sense at frame 0. Main session decides; owner if it's read as a title-block default.
- **F2 · Length.** ≈ 83–85 s expected on the take, not ≈ 76 s. Over 60 s means our own music or none (§ 9, § 10).
  Nothing here pads: 17 lines, 19 scenes. A shorter video needs a script cut (scriptwriter), not a picture fix. The
  candidates, if wanted: line 3's second half, or folding line 12 into line 11.
- **F3 · The same EV in two sections at once (P).** The sheet is a drawing of alternatives, but YOU's EV can't be at home
  and at the fast row at the same time. **Proposal:** YOU appears only at home. The fast-row EVs share the electric
  version's body and YOU's paint ("that same mile"), driven by extras (`CAST.extra`, `EXTRA_B`). Alternative: the fast-row
  cars in other paints (`CITY.carBodies`), which reads as "other people's cars" and weakens "that same mile".
- **F4 · Regen and brake heat aren't orange here.** The brief keeps orange for the demand fee. No. 014 drew the regen
  path and brake heat orange (energy, the system there). **Proposal:** in this video the regen is an **ink** curved arrow
  (`CurveArrow` `'ink'`) and friction braking is a grey dust puff, so the only orange in the video is the fee.
  Alternative: reuse No. 014's orange regen and `brakeHeat` as they are (no new parts, but two orange systems in one
  video). Brand-director or main session decides. I recommend ink.
- **F5 · 15¢ and 17¢ are 12 s apart in two places.** The viewer compares from memory. The voice carries "that same
  mile costs about seventeen". Optional: a Mono sub-line `GAS 15` on the 17 counter. That's a second number in one card,
  so I'd leave it out.
- **F6 · Line 9, "busiest fifteen minutes of the month."** A month can't play in 7 s, so the station's time-lapse spins
  the clock (🎭 compressed), and the meter's **peak pointer** (a real demand-meter idea: the needle pushes a pointer that
  stays at the highest reading) is the orange system. **Proposal:** the 3D meter plus one callout `BUSIEST 15 MIN`.
  Alternative: a chart card in a new **peak mode** (`POWER` over `TIME`, tick `1 MONTH`, the orange load line with one
  narrow spike and a `15 MIN` bracket). It reads more like a bill, but it's a new card mode, needs a brand-director spec,
  and covers the set. I recommend the meter.
- **F7 · "Many fast chargers".** One station stands for "many". Nothing on screen says "all" or "every"
  (fact-checker: keep "many").
- **F8 · Line 10, idle.** No number on screen (fact-checker: the 15.9 % is one chart caption, don't say "one hour in
  six"). Empty bays plus ghost cars carry "idle", and the fee slab splitting into **two** big pieces carries "fewer drivers
  share". The split count is 🎭.
- **F9 · Line 11, "no oil changes".** An EV's drive unit has its own gear fluid, so I don't draw an "empty" ghost oil pan
  in the EV (that would claim "no oil at all"). Only the gas pan gets the callout.
- **F10 · Line 12, "heavier".** The fact-checker notes "heavier" isn't sourced for this pair; the voice says it of EVs in
  general. The ink weight arrow carries no number. The tread wear amount is 🎭 ("can wear out sooner").
- **F11 · Line 16, the value bars.** **Decided (main session):** bars without a precise ratio, the gap modest: `EV` the reference bar, `GAS` at 0.78 of it, lengths 🎭 illustrative (disclosed), no numbers on the card. Original note: Bars mode has no numbers, but the lengths still imply a ratio. AAA's compact-SUV
  figures ($5,298 vs $3,568 a year) come from a search summary of the brochure (🟡). **Fact-checker:** confirm a ratio
  (≈ 1.5 : 1) or I set "visibly longer", disclosed 🎭. Alternative: no card, the voice alone over the time-lapse.
- **F12 · Lines 14–15, the catch-up.** One 10.9 s scene would hold one counter, but it runs well past 6 s. **Proposal:** two
  scenes. Scene 16: a single counter `3 YEARS`. Scene 17: the **rows** counter (`from: 3`, HOME stopped at 0 s, FAST
  running 3 → 17), so the race reads and the 3 never jumps. The card leaves and re-enters at the cut (≈ 0.5 s gap, § 6
  one-card rule).
- **F13 · The time-lapse and the loop.** Scenes 16–18 run a time-lapse at P and scene 19 glides (no slide) onto frame 0,
  so the sun, the clock and every car must land on frame 0's state (N8). Fallback: a slide into P at scene 19 (opens
  clean, the easy loop), at the cost of a fifth slide on the last line.
- **F14 · The house meter in scene 7.** "At the average US rate" has no picture. The house meter turning slowly is
  optional dressing. Drop it if N1 runs long.
- **F15 · The pump has no price sign or readable display.** A pump's dollars and gallons would be source-like numbers
  the voice doesn't say. The display stays a dark, unreadable panel; the 15¢ is on the counter.

## Reused vs new

**Reused as they are:** `city-twin` (stack, signals, lead cars, `autoPedals`, `loop`); `SlicedCar` `'ev'` and `'gas'` on
the crossover shape (`exhaust`, `engineRun`, `chargePort` with `signalGreen` ring, brake lamps, wheels forward); the
`charge-slice` kit: `ChargerCabinet`, `ChargeCable` (`'nacs'`, no cut-away), `ChargeDriverFigure` and `chargeMotion`
(`arrive` reversing in, `leave` forward, `cycle`, `driver` beats), `StationClock`, `DriftingClouds`, the `timelapse`,
`GhostCar` (dashed ink); `CurveArrow` `'ink'`; `DrivingCar` lead cars; the counter (single and `rows`); callouts; car
name tags; the chart card's bars mode; the title block; slides and glides. **In this video:** `amps: 0` / no `packCharge`
on every charging car, so no orange current or orange module levels.

**Not reused:** the realistic `model3` / `seal06` shapes (both sedans, and the voice names no model). No detail box: no
screen in the story is read (the per-mile figures are counters, not a pump or app screen).

## Missing scenes and parts (scene-builder, one brief each)

- **N1 · `plug-sheet` scene (P).** Three cut sections stacked on one sheet at the fixed angle, sky between (the
  `report-slice` three-stack grammar, the `charge-slice` bay grammar). Either a new scene or `charge-slice` with per-bay
  `kind: 'home' | 'pump' | 'fast'` and a third bay. The scene-builder decides.
  - **Home garage** (top): slab, back and side wall cut (§ 3 section look), a generic Level 2 **wall charger** (box,
    holster, status LED in `signalGreen`, no logo), a door into the house, a shelf, a house meter on the outside cut wall
    with a slowly turning dial (neutral). YOU's EV parks nose-in, its port side toward the camera. YOU's beats: walk,
    door in and out, plug and unplug, lean on the roof, phone. Day evening light.
  - **Pump island** (middle): see N4.
  - **Fast-charger row** (bottom): the US bay widened to **4 posts** in a row (posts, islands, curb, station clock),
    cars reversing in and driving out by post (`visits` / `cycle` per post), extras as drivers, the supply at the right
    end (N2).
  - **Framings:** `sheet` (frame 0 and the loop: all three sections between the title block and the captions), `plugs`,
    `home`, `fast`, `row`, `rowLow` (the row under a top card, above y 1040), `supply`.
  - **Time-lapse** per section (sun, clocks, clouds, cars cycling), and **no orange** from current or charge.
- **N2 · The station's supply (P, fast row).** A utility pole with a line to the frame top, a pad transformer, a meter
  cabinet with a big round dial: a **needle** that follows the row's load (number of busy posts × a 🎭 step, eased) and a
  **peak pointer** (orange, bloomed, § 5 Bleed weight) the needle pushes up and that stays (keys: `appearAt`, auto from the
  needle, `resetAt` for a new slice). The feed runs from the transformer along the ground's front cut face to each post
  (neutral). An orange **path** (§ 5, right-angle runs) from the meter up the pole and out of frame, keys `{at, fadeAt}`,
  pulses up.
- **N3 · The fee slab and its share-out (P).** An orange slab (§ 5 halo, bloomed) lifts off the meter cabinet, splits into
  `n` equal pieces (`n` = cars plugged at `splitAt`), and each piece slides along the cut-face feed to its post and lands
  on the post's node dot. Keys `{liftAt, splitAt, n, landAt}`. Opacity-only fades, no pop.
- **N4 · Pump island + gas filler (P).** A generic US pump (no brand, no price sign, a dark unreadable display), hose and
  nozzle, the handle's click-off (a small rock of the nozzle), the extra's beats: take the nozzle, open the filler door,
  nozzle in, hold, click-off, nozzle back, door shut. On `SlicedCar` `'gas'` crossover: a **filler door** on the near
  rear quarter (open / closed keys), the same way the EV has its `chargePort`.
- **N5 · `city-twin` with crossovers, EV over gas.** Verify `variant: 'ev'` (top) and `'gas'` (bottom) on
  `shape: 'crossover'` in the twin lanes, then add framings for that pair: `bottomCar` (the gas twin whole, sky over the
  top lane for a counter), `bays` (the EV's drive unit over the gas engine with its **oil pan** in view), `twinBrakes`
  (both near front wheels, calipers visible through the spokes), `wheels` (both near rear wheels). No. 014's hybrid
  framings are built for the sedan.
- **N6 · Brake beat without orange (A, pending F4).** Per car `caliper` squeeze keys (pads visibly closing on the disc),
  a faint grey **brake-dust puff** off the gas twin's disc (neutral, ≈ 1 s, deterministic), and on the EV an ink
  `CurveArrow` from the hub to the drive unit with the rotor turning while it slows. If F4 goes the other way, use
  No. 014's orange `regen` and `brakeHeat` as they are, and skip N6.
- **N7 · Tread wear + weight arrow (A).** On `SlicedCar` near wheels: `treadDepth` keys (0 → 1) that lower the cut
  tire's tread blocks (geometry, not a decal: no coplanar flicker), with short ink depth ticks beside the cut tread; and
  an ink `weightArrow` (paper outline, never bloomed) pointing down over a wheel, drawing on over 0.6 s, `fadeAt`. The
  contact patch may flatten slightly with weight (🎭).
- **N8 · The P loop.** The last frame is frame 0: the camera lands exactly on D0 (drift 0); YOU at frame 0's point on the
  walk to the door; the pump extra's nozzle in; post 1 busy, post 3's car out of frame right at frame 0's distance;
  every wheel at frame 0's angle (modulo the spoke pitch); the station clock and the sun back at the story time (the
  time-lapse ends on a whole number of days, or the sun's swing is made periodic per story day); no orange, no ghosts.
  Sections out of frame in scene 18 may reset there (no pop, they're off screen).

**Brand-director (before the build):** F4 (ink regen in an orange-for-the-fee video); F6 if the chart-card peak mode
is chosen; whether the pump island needs new set colours in `theme`.

## The loop seam plan

1. **Frame 0 (scene 1):** P `sheet`, Day, 5:40 PM. Home: YOU's EV plugged (ring green), YOU mid-walk toward the door. Pump:
   the extra holding the nozzle in. Fast row: post 1 busy with extra B on the curb, posts 2–4 empty, post 3's car just
   out of frame right. No orange, no ghosts, no time-lapse. Title block up, drift 0, a slow push from distance D0.
2. **The last shot (scene 19):** a glide from `rowLow` back to `sheet`, landing exactly on D0 at the last frame (the
   No. 011 / No. 014 pattern). The time-lapse ended in scene 18 on the story time; the home and pump sections were reset
   while off frame; YOU and the pump extra replay their frame-0 beats to land on frame 0's poses.
3. **Phase-locked details:** the charger LED steady; the station clock at 5:40; the meter's needle low and **no peak
   pointer** (scenes 16–19 open clean after the slide at 73.2); no exhaust, no ghost, no fee slab.
4. **Words:** the voice ends at ≈ 92.2, captions are gone for the last ≈ 1.5 s. On replay the cut adds only the title
   block. The last line ("Which plug would you use most?") hands over to "An EV can cost less per mile than a gas car".
5. **Check:** `yarn stills ev-cost --frames=0,<last>` and compare the two PNGs; motion in Studio. Fallback F13.

## For the publisher's 🎭 "Illustrative:" line

The SUV is generic (the per-mile figures are for one named pair in the description only); the story time; the garage,
pump island and station layout; the time-lapses; the meter's dial, needle and peak pointer, and the station's load; the
fee slab and the two-way split; the tread wear amount and the weight arrow; the value bars' lengths.

## Sound (note only, for later)

Physical sounds only: the latch and the contactor's clunk at each plug (`sfx:latch`, `sfx:contactor`), the cabinet fans
(`sfx:cabfan`) and the outdoor station bed (`sfx:station`) at the row, the pump's click-off, a gas idle and puffs at A,
a soft brake creak at stops, the house door. The EV pulling away makes no engine sound. The orange fee, the cards and
the tags make no sound.
