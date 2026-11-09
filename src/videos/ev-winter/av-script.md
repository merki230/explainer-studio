# No. 017 · EV winter: audio + visual script (draft 2, 2026-11-09, re-cut to the real voice take)

Words: `script.txt` **v6** (12 lines, owner-approved). Times are **real**, read from `transcript.json` (the recorded take,
`audio/voiceover.mp3`): voice 0.13 → 64.08 s, plus a **1.5 s tail** (F14) for the loop glide, comes to **≈ 65.6 s**
(F1 accepted: over 60 s, our own music). Times are video seconds; a cue's time is its first word's start.

**Changes since draft 1** (marked **Δ** below): the spring line moves up to right after the short-trips line, so the
video goes winter → spring → winter again ("Until then") → garage → back to the corner; the heat pump and the deep-cold
clause are one line; the seat/wheel line is one line; the preheat line is new wording and ends the content; the question
is now "Do you warm your car before unplugging?". Short glides that would have been their own 1.8–1.9 s scenes are now
**in-scene glides** (`cameraKeys`), so no scene runs under 2.6 s.

## Rulings and decisions applied (main session, brand v0.18.11)

| Flag | Now |
|---|---|
| F1 length | Accepted: ≈ 65.6 s, own music. Set aside |
| F2 highway | Keep **H** |
| F3 title | `Why do EVs lose range in winter?` |
| F5 orange near people | § 5 "System heat near the cast": wisps halo only ≤ 25 %, end ≥ 0.15 m **and** ≥ 16 px from any figure, never cross one; seat/wheel glow occluded by the figure, figure out of bloom; feed lines to the seat from below/behind. Fallback: orange stops at the vents. Applies to extras (gas twin's driver, Lab test driver) |
| F6 the two tests | **Two single counters**: 25 at H (scene 8), 50 at W (scene 9), nothing carried over |
| F7 heat pump | Drawn on YOU's car, illustrative (🎭, disclosed) |
| F8 test drivers | YOU stands in (🎭, disclosed) |
| F10 gas paint | Keep `TWINS.gasPaint`, bark ≥ one wheel's width from its outline on screen; check at `twinHeat` and `twinSpring`; fallback a separate `#4a5d72` token for this video |
| F11 reuse | W: winter dressing, heat system, every framing new (incl. **Δ** a new `twinSpring` for Wm, not No. 014/016's `stack`). G: **Δ** two new framings `garageWide` / `garageFeed`, not No. 016's `home` |
| F12 line 6 | Kept as is |

## The system in one line

**Orange = heat, and the energy spent making it** (map confirmed, § 5 "energy that becomes the system"; test: every
orange line ends in the system). Gas car: the engine's waste heat, a fat flow out through the radiator and the exhaust
(thrown away) and a thin branch to the heater core (free). EV: battery → heater (paid for), later battery → compressor
plus the heat pump's wisps pulled in from outside air, battery → seat/wheel, and wall → heater while preheating.
**Not orange:** stored charge (an **ink** in-set range gauge stands for range left), drive energy, charging, the regen
(**ink** arrow), friction braking (grey dust), exhaust vapour and breath (grey), the cold (a neutral `WINTER.snowShade`
tint), coolant (`CHARGE.coolant`), the port ring and the wall charger's LED (`signalGreen`), cards.

## The look in one paragraph

The No. 016 crossover pair re-dressed for winter: one generic **crossover** in two versions, no badge, no model. The
**EV** is YOU's car (YOU's paint, YOU driving), the **gas twin** is `TWINS.gasPaint` with an extra driving. Day mood, a
very cold morning (🎭 8:10 AM). Places: **W**, the twin corner in its **winter** dressing (snowbanks, packed snow, bare
trees, frost, falling snow), EV on top, gas twin below; **L**, The Lab as a **cold test chamber** (test car `#3f434a` on a
chassis dyno); **H**, the twin highway in winter (EV alone); **G**, YOU's garage on a snowy morning (🎭 7:40 AM), new
framings; **Wm**, the corner in its **mild** dressing, standing for spring. Both cars get one new shared part, an **HVAC
box** behind the dash, so the two heat stories are drawn the same way and differ only in where the heat comes from.

**On-screen words** (all ink, plain labels): the title block; car tags `ELECTRIC` / `GAS`; counters (line 3 rows
`HEATER OFF` 12 / `HEATER ON` 40, sub `LESS RANGE · 20°F`; **Δ** single `25` and single `50`); callouts `HEATER`,
`HEAT PUMP`. No maker, model, lab, magazine, study name, source text, kW, or °F digits other than the `20°F` sub.

## Locations

| Code | Location | Built with |
|---|---|---|
| **W** | Twin corner, winter: two stacked city lanes, signals in sync, lead cars. Top: YOU's EV crossover. Bottom: gas crossover, extra driving, idling with grey vapour puffs | `city-twin` `dressing: 'winter'`, `top: {variant: 'ev', shape: 'crossover'}`, `bottom: {variant: 'gas', shape: 'crossover'}`, `pavement`, `wheelStep`, `snow`, `frost` + N1–N6, N9, N10, N12 |
| **L** | The Lab, cold chamber: insulated cut cell, frost on the walls, test car on a chassis dyno, road-speed fan, wall thermometer, technician (extra) outside the window, laptop facing them | `section-lab` grammar + N7, N1/N4 in the test car |
| **H** | Twin highway, winter: the EV alone at ≈ 70 mph, snowbanks, slush wheel paths, snow falling | `city-twin` `road: 'highway'`, `bottom: false` + N8 |
| **G** | YOU's garage (No. 016 home section alone), snowy morning: snow on the driveway, frost on the EV's glass, plugged in | `plug-sheet` `{home: {...}, pump: false, fast: false}` + N11, **Δ framings `garageWide`, `garageFeed`** |
| **Wm** | The corner, mild dressing (spring): no snow, no frost, no orange | `city-twin` `dressing: 'mild'`, **Δ framing `twinSpring`** |

**Δ Order:** W → L → W → H → W → **Wm → W** → G → W. Eight slides (same count as draft 1), no hard cuts; every other
framing change is a glide. The last W stay ends on frame 0 (the loop, N13).

## Title block

Line 1 `Why do EVs lose` / `range in winter?` (15 / 16 characters). Line 2 `NO. 017 · THE COLD CORNER · 8:10 AM`. Up from
frame 0; **Δ fades at 8.24 s** (0.8 s after line 1's second sentence ends at 7.44, "…that drives it."), 10 frames. The
script's only spoken question is at the end, so the No. 014–016 pattern applies.

## Line by line

Cues are copied word for word from `script.txt` and checked unique in the transcript ("Test drivers lost" vs "but test
drivers using"; "but less in deep"). Cue matching ignores punctuation, so `Seat and steering-wheel` matches the
transcript's single `steering-wheel` token.

| Sc | Cue · in (s) · len | Line (words) | What's on screen | Motion / events (s, on the word) | Overlay | Transition in |
|---|---|---|---|---|---|---|
| 1 | `A gas car heats` · 0.00 · 3.72 | A gas car heats you with heat it was going to throw away. | **Frame 0, W `twinHeat`**: both cars' front halves stacked (bays, HVAC boxes, cabins), stopped at a red, brake lamps lit, snow falling. Gas twin idling, **orange already running**: fat flow engine → radiator → out the grille as wisps, and along the exhaust; a **thin** branch to the heater core, halo-only wisps from its vents stopping short of the driver (F5). EV: HVAC dark, no orange | 0.0 slow push · 0.88 "heats" gas blower spins up, cabin wisps thicken a touch · 1.4 grey vapour puff at the tailpipe · 1.88 "it" green; both pull away (wheels forward, snowbanks and lane paint streaming toward the tails) · 2.5 radiator flow pulses · 2.88 "throw away" a wave of orange wisps pours from the grille and trails **behind** the moving car, fading | **Title block** 0 → 8.24 · **Tag** `GAS` (bottom) 0.6 → 3.4 | — (frame 0) |
| 2 | `An EV has to` · 3.72 · 3.80 | An EV has to make its heat from the same battery that drives it. | W, glide to `evHeat` (the EV whole, low-ish: pack, drive unit, HVAC box, YOU) | 3.72 glide 0.8 s · 4.0 tag in · 4.72 "make" the heater clicks on: **orange line draws pack → heater** (1.2 s), node dots · 5.28 "from" halo-only wisps leave the vents toward YOU, ending ≥ 16 px short · 5.92 "battery" the **ink range gauge** steps down a tick (N4) · 6.48 "drives" drive-unit rotor turning (no orange) · 6.9 lead car brakes | **Tag** `ELECTRIC` (top) 4.0 → 7.1 · title block | glide |
| 3 | `You've probably heard` · 7.52 · 3.24 | You've probably heard the cold drains the battery. | W, glide to `evPack` (the cut pack close, near front wheel, sill) | 7.52 glide · 8.24 title block out · 8.40 "heard" snow gust across the lane · 8.80 "cold" **ink thermometer** beside the pack falls; the uncut cell surfaces tint toward `snowShade` (≤ 50 %, cut faces stay `cut`, N3) · 9.28 "drains" frost thickens on the side glass (0.55 → 0.75) · 9.9 EV stops at the next red, lamps lit; heater dots keep flowing | — | glide |
| 4 | `But in one lab` · 10.76 · 2.60 | But in one lab test at 20 degrees, | **L `chamber`**: the cold cell whole, test car on the rollers, technician at the window | 10.76 slide (18 fr) · 11.20 "one" chamber fans start, technician taps the laptop · 11.36 "lab" rollers start, the test car's wheels roll forward on them, car stays put; nose fan spins up · 12.20 "20 degrees" wall thermometer falls, frost spreads over the back wall | — | **slide** |
| 5 | `range fell 12` · 13.36 · 6.96 | range fell 12 percent with the heater off, and about 40 percent with it on. **Most of that was the heater.** | L `dynoLow` (car low, under the counter); **Δ in-scene glide** to `dynoCabin` (pack, HVAC box, test driver) at `Most of that was` (18.40) | 13.36 glide · 13.8 counter in; heater **off**, HVAC dark, test driver hunched · 14.40 "percent" OFF row lands on 12; gauge down a little · 15.08 "heater" heater **on**: orange pack → heater draws, wisps start · 16.16 "about" gauge falls faster · 16.88 "percent" ON row lands on 40 · 17.6 "on" dots flowing, rollers turning · 18.40 glide (0.8 s) · 18.92 "that" heater line **surges** (§ 5 surge), wisps thicken · 19.0 callout in · 19.40 "heater" gauge ticks again | **Counter (rows)** `HEATER OFF` 0 → 12 / `HEATER ON` 0 → 40, label `%`, sub `LESS RANGE · 20°F`, 13.8 → 18.3; OFF stops 14.40, ON stops 16.88 · **Callout** `HEATER` / `Most of the loss` on the HVAC box, 19.0 → 20.2 | glide |
| 6 | `The cold slows the` · 20.32 · 4.44 | The cold slows the battery too, so braking recovers less energy. | **W `evFront`** (pack front, drive unit, near front wheel and caliper), rolling toward a red | 20.32 slide · 20.48 "cold" tint holds, thermometer low · 21.48 "battery" lead car's lamps flick · 22.64 "braking" EV brakes: **ink regen arrow** from the hub toward the drive unit stops **short** (reach ≈ 0.4, N5) · 23.12 "recovers" caliper squeezes harder, faint grey dust puff · 23.84 "energy" stopped, lamps lit | — | **slide** |
| 7 | `And the heater draws` · 24.76 · 4.48 | And the heater draws power every minute, so short trips hurt most. | W, glide to `evCar` (the EV whole, the corner's post clock in frame, N6) | 24.76 glide · 25.00 "heater" orange line pulses · 25.36 "draws" still at the red, wheels still, lamps lit, dots **still** flowing · 26.16 "every minute" post clock's minute hand jumps (🎭 compressed), gauge ticks with it · 27.48 "short trips" green; a short hop to the next corner · 28.00 "hurt" brakes, lamps lit, another clock tick, another gauge tick | — | glide |
| 8 | `Test drivers lost` · 29.24 · 3.32 | Test drivers lost about a quarter of their range on the highway, | **H `cruise`**: the EV alone at ≈ 70 mph, low in frame | 29.24 slide · 29.5 cruising: dashes, snowbank edge and posts stream toward the tail, slush spray · 30.56 "quarter" counter lands · 31.36 "range" gauge ticks once (slower than town) · 31.9 a sign streams past | **Δ Counter (single)** `25` label `%`, sub2 above `ABOUT`, sub `LESS RANGE · HIGHWAY`, 29.6 → 32.4, 0 → 25 landing 30.56 | **slide** |
| 9 | `and earlier tests found` · 32.56 · 3.32 | and earlier tests found about half on short trips. | **W `evCar`**, stop-and-go | 32.56 slide · 32.8 the EV pulls away from a stop · 33.60 "found" brakes for the next red, lamps lit · 34.24 "half" counter lands; clock ticks, gauge ticks · 34.76 "short trips" dots flowing over the stopped car | **Δ Counter (single)** `50` label `%`, sub2 above `ABOUT`, sub `LESS RANGE · SHORT TRIPS`, 32.9 → 35.7, 0 → 50 landing 34.24 (F6) | **slide** |
| 10 | **Δ** `That lost range returns` · 35.88 · 6.68 | That lost range returns in spring, without lasting harm to the battery, one study of 30,000 EVs says. | **Wm `twinSpring`**: both twins whole on the spring corner, no snow, no frost, **no orange** (no heater running); **in-scene glide** to `evPack` at `without lasting harm` (38.12) | 35.88 slide (snow gone: time has passed) · 36.40 "range" the EV's ink gauge **refills** to full (N4 Δ) · 36.88 "returns" green, both pull away · 37.56 "spring" thermometer rises high · 38.12 glide · 38.72 "harm" the cells sit in their plain colour (no tint), nothing marked · 39.4 lead car brakes · 40.48 "30,000" the EV slows for the red · 41.4 stopped, lamps lit | — (F9) | **slide** |
| 11 | **Δ** `Until then, a heat` · 42.56 · 6.96 | Until then, a heat pump helps by moving heat in from outside instead of making it, **but less in deep cold.** | **W `evNose`** (heat exchanger behind the grille, compressor, lines to the HVAC box), snow back; **in-scene glide** out to `evSky` at `but less in deep` (47.73) | 42.56 slide (winter again: "until then") · 43.68 "pump" **heat-pump parts draw in** (ink outlines, then materials, 0.6 s); the heater's pack line fades (N9) · 43.9 callout in · 44.64 "moving" EV rolls; thin **orange wisps pulled in** from the air ahead of the grille · 45.60 "outside" orange along the lines to the HVAC box, vent wisps · 46.24 "instead" **thin** pack → compressor line; gauge ticks slower · 47.73 glide (0.8 s) · 48.00 "less" heavy gust, snow thickens · 48.40 "deep cold" incoming wisps thin to a trickle, pack line thickens · 49.2 EV stops at the red, lamps lit | **Callout** `HEAT PUMP` / `Moves heat in` on the outside exchanger, 43.9 → 47.0 (F7) | **slide** |
| 12 | **Δ** `Seat and steering-wheel` · 49.52 · 6.35 | Seat and steering-wheel heaters help too, **but test drivers using only those got uncomfortably cold.** | **W `evCabin`** (YOU in the seat, wheel, dash; heat pump still running); **in-scene glide** out to `evCar` at `but test drivers using` (51.92) | 49.52 slide · 49.92 "Seat" cushion and back **glow** ("made by" edge + halo, occluded by YOU, N10); thin feed line from under the floor · 50.08 "steering-wheel" rim glows, only between YOU's hands · 51.04 "help" gauge ticks only slightly · 51.92 glide (0.8 s) · **52.32 "drivers" HVAC off: vent wisps stop, the heat-pump parts draw back out (0.6 s, N9 Δ)**; only seat and wheel glow · 53.12 "only" YOU hunches, shoulders up (N10) · 53.6 frost creeps back on the **inside** of the glass · 53.9 grey breath puff by the head · 54.20 "uncomfortably" small shiver again · 55.0 stops at a red, lamps lit; seat and wheel still glowing | — (F8) | **slide** |
| 13 | **Δ** `The usual advice is` · 55.87 · 3.06 | The usual advice is to preheat while still plugged in, | **G `garageWide`** (**new framing**: the garage cut lower and closer than No. 016's `home`, the EV nose-in and plugged, the wall charger, the snowy driveway and the house door in frame), frost on the glass, snow falling | 55.87 slide · 56.3 the wall charger's LED steady green · 57.12 "preheat" heater clicks on: **orange draws wall charger → cable → port → heater** (1.2 s), **not** into the pack (N11) · 57.68 "while" halo-only vent wisps · 58.20 "plugged" windshield frost starts melting (0.7 → 0 over 2.5 s) | — | **slide** |
| 14 | **Δ** `so the heater runs` · 58.93 · 3.15 | so the heater runs on wall power instead of the battery. | G, glide to `garageFeed` (**new**: the charger, cable, port, HVAC box and the pack's ink gauge in one frame; the door at the frame edge) | 58.93 glide · 59.16 "heater" wisps thicken · 59.76 "on wall power" dots run along the cable · 60.64 "instead" the pack's ink gauge holds **full** · 61.0 frost gone from the windshield · 61.20 "battery" YOU comes out of the house door and walks to the car (`walkTo`) · 61.9 YOU's hand reaches the connector (no unplug: the question stays open) | — | glide |
| 15 | **Δ** `Do you warm your` · 62.08 · 3.50 (incl. 1.5 tail) | Do you warm your car before unplugging? | **W**, slide in at `twinHeat`'s look point from a wider distance, then glide onto frame 0's framing | 62.08 slide · 62.44 "warm" snow falling, both twins rolling toward the red; the gas twin's orange runs as at frame 0; EV plain (no heat pump, no glow, HVAC dark) · 63.12 "before" both brake, lamps lit · 63.44 "unplugging" both stopped on frame 0's marks · 64.08 voice ends, captions end · 64.4 vapour puff (frame 0's phase) · 65.58 **last frame = frame 0** | — (captions end) | **slide**, then glide |

### Gaps (longest stretch with no listed event, real times)

Every scene has an event at least every ≈ 1.2 s, plus falling snow and the gas idle as texture (texture doesn't count,
§ 8 motion rule). Longest: scene 10, 41.4 → 42.56 (1.2 s, a stopped car with the lead car beyond; acceptable), scene
15's tail 64.4 → 65.58 (the glide itself is the motion).

### Scene lengths

Spec scenes 2.6 to 6.96 s. Picture changes (slides, glides, in-scene glides) never more than 5.3 s apart. **Short:**
scene 4 (2.6 s, the Lab establishing slide; merging it into 5 would make one 9.6 s Lab scene). **Long:** 5, 10, 11, 12
(6.35–6.96 s), each carrying an in-scene glide where the line's idea turns, instead of a 1.8–2.4 s glide scene.

## Lines that are hard to show (open or new)

- **F4 · Line 3's two numbers** (no ruling asked; kept as recommended): the rows counter, both from 0, stopping on
  their words. "About" is spoken for 40 only; the counter shows 12 and 40 as the voice rounds them.
- **F9 · Line 8 has no number on screen** (kept): "30,000" would only echo the voice; spring and the plain cells carry
  the line. Never an ice-covered or cracked battery anywhere.
- **F13 · Scale of the heat flows** (kept): radiator flow ≈ 3× the cabin branch's width (a true ≈ 10× would make the
  branch vanish at phone size). 🎭, disclosed. No kW on screen.
- **F14 (new) · Tail 1.5 s, not the default 1.2 s.** The last scene slides in at 62.08 and must land on frame 0 after
  the voice ends at 64.08; 1.5 s gives the glide room to settle with the captions gone. Value only (`tail: 1.5` in
  `spec.ts`); revert = drop the key.
- **F15 (new) · The question is asked over the corner, not the garage.** Frame 0 is the corner, so the loop has to
  slide back there; the garage leaves on YOU's hand at the connector (61.9), and the corner shows both cars with the gas
  twin's free heat running and the EV's HVAC dark, which keeps the question open. Alternative: hold G through "Do you
  warm your car" and slide only at "before unplugging" (63.12), leaving ≈ 2.5 s for the slide, the stop and the landing
  on frame 0, which is tight. I recommend the plan as written.
- **F16 (new) · Same corner, three dressings back to back** (winter → spring → winter in scenes 9–11, 6.7 s apart).
  "Until then" makes the return literal, and the two slides read as time passing. If the reviewer finds the second slide
  confusing, the fallback is an in-scene re-dress (snow fades back in over 0.8 s) instead of a slide, which costs one
  new key on `city-twin` (`dressingKeys`). Not proposed for the build.

## Reused vs new

**Reused as they are:** `city-twin` (stack, signals, lead cars, `autoPedals`, `loop`, `pavement`, `wheelStep`,
`dressing: 'winter' | 'mild'`, `snow` with `gusts`, `road: 'highway'`, `bottom: false`, `cameraKeys` for the in-scene
glides); `SlicedCar` `'ev'` / `'gas'` on the crossover (`engineRun`, `exhaust`, brake lamps, wheels forward, `frost`
keys, `caliper`, `brakeDust`, `regenArrow` ink); `plug-sheet` home section (`HomeGarage`, YOU's `DriverKey` with
`walkTo` / `lean`, `led`, `ChargeCable`); the `section-lab` grammar and its figures; `StationClock`; counters (single
with `sub2`, and `rows`); callouts; car name tags; the title block; slides and glides. **Not used:** `packCharge` /
`packLevel`, `drivePath`, `brakeHeat`, the realistic `model3` / `seal06` shapes, the detail box (no screen is read), No.
014/016's `stack` and `home` framings.

## Missing scenes and parts (scene-builder): changes vs the N1–N13 brief

Unchanged parts are listed by name only. **Δ** = changed since the brief the scene-builder already has.

- **N1 · HVAC box (both cars).** Unchanged, built to § 5 "System heat near the cast" (wisps halo-only ≤ 25 %, end
  ≥ 0.15 m and ≥ 16 px from the figure at every framing). **Δ (small):** an `off` key that stops the wisps and dims the
  box (scene 12 at 52.32), separate from the heater's feed line.
- **N2 · Gas engine heat.** Unchanged. F10: bark out of the gas twin's outline at `twinHeat` and **Δ `twinSpring`**
  (was `stack`).
- **N3 · Cold pack cue.** **Δ (to the ruling):** tint the **uncut** cell surfaces toward `WINTER.snowShade` at ≤ 50 %;
  cut faces stay `cut` (draft 1 said the cut faces). Thermometer keys must go **up** as well as down (spring, 37.56).
- **N4 · In-set ink range gauge.** **Δ:** level keys must allow a **refill** (spring, 36.40, smooth over ≈ 0.8 s), not
  only down-ticks; and the loop resets it to frame 0's level (N13).
- **N5 · Weak regen.** Unchanged.
- **N6 · Corner post clock.** Unchanged (scenes 7 and 9).
- **N7 · Cold Lab.** Unchanged (framings `chamber`, `dynoLow`, `dynoCabin`); tokens per v0.18.11 (straps `REAL.flex`, car
  `#3f434a`).
- **N8 · Winter highway.** Unchanged (`cruise`).
- **N9 · Heat pump.** **Δ:** the parts draw **out on screen** (ink outline reversing, 0.6 s, at 52.32 in scene 12 under
  `evCar`), not off screen during a slide; keys `{at, drawFor, outAt, level}`. Everything else unchanged.
- **N10 · Seat and wheel heaters + cold occupant.** **Δ (to the ruling):** the glow is depth-occluded by the figure,
  never drawn over it, figure out of the bloom layer, rim glow only between the hands, feed line from under the floor.
  Shiver, breath and inside frost unchanged.
- **N11 · Garage, snowy morning.** **Δ:** two **new framings** `garageWide` (scene 13: garage cut lower and closer than
  `home`, EV nose-in, wall charger, driveway, house door) and `garageFeed` (scene 14: charger, cable, port, HVAC box and
  the pack gauge together, door at the edge); both must differ visibly from No. 016's `home` (F11). **Δ:** no unplug
  and no cable fade; YOU walks out of the door (61.20) and reaches the connector (61.9) with the existing `walkTo` /
  `lean`. The wall → cable → port → heater path, frost melt and snow are unchanged.
- **N12 · Framings (W).** `twinHeat`, `evHeat`, `evPack`, `evFront`, `evCar`, `evNose`, `evSky`, `evCabin` unchanged.
  **Δ add `twinSpring`** (Wm, scene 10: both twins whole, stacked, wider than `twinHeat`, new to this video, F11).
- **N13 · The W loop.** **Δ:** the last scene now comes **from G** (scene 15 slides G → W at 62.08), not from Wm. At the
  last frame: both twins stopped on frame 0's marks (`loop` as built), gas heat flows at frame 0's phase, EV HVAC dark,
  heater line faded, **no heat-pump parts and no seat/wheel glow** (both gone since scene 12), frost, `packCold`,
  thermometer and range gauge at frame 0's values, snow seeded to match, signal red, lamps lit. Glide lands on D0 at
  65.58.

No new scenes beyond these parts; draft 1 had none either (everything lives in `city-twin`, `section-lab` and
`plug-sheet`).

## The loop seam plan

1. **Frame 0 (scene 1):** W `twinHeat`, Day, 8:10 AM, winter. Both twins stopped at the red, lamps lit, snow falling.
   Gas twin idling, its heat flows running. EV HVAC dark, no orange in the EV; `packCold` and the gauges at frame 0's
   values. Title block up, drift 0, a slow push from distance D0.
2. **The last shot (scene 15):** a slide from G into W at `twinHeat`'s look point from a wider distance, then a glide
   landing exactly on D0 at the last frame (65.58). The cars roll in and stop on frame 0's marks.
3. **Phase-locked details:** gas flows' dots and wisps, the exhaust puff, snow, the post clock at 8:10, frost, the
   signal state.
4. **Words:** voice ends at 64.08; captions are gone for the last 1.5 s. "Do you warm your car before unplugging?"
   hands over to "A gas car heats you with heat it was going to throw away."
5. **Check:** `yarn stills ev-winter --frames=0,<last>` and compare the two PNGs; motion in Studio.

## For the publisher's 🎭 "Illustrative:" line

The crossover and the Lab's test car are generic; the story times; the heat flows' widths (not to scale, F13); the cold
tint on the cells; the ink range gauge and thermometer; the clock jumps; the heat pump drawn onto YOU's car (F7); YOU
standing in for the test drivers (F8); the lab chamber's layout; the spring scene as a picture of "returns in spring".

## Sound (note only, for later)

Physical sounds only: a cold gas idle and its vapour puffs, the blower fan (`sfx:heaterfan`), the heater relay click,
tires on packed snow, wind gusts, a soft brake creak at stops; in the Lab, the dyno rollers' whine and the chamber fans
(`sfx:cabfan`); spring: dry tires, no wind; in the garage, the house door and footsteps on snow (no latch: nothing is
unplugged). The EV makes no engine sound. The orange, the cards and the tags make no sound. Over 60 s: our own music.
