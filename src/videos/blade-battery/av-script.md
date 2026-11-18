# No. 017 · Blade battery: audio + visual script (draft 1, 2026-11-09, before voice)

Words: `script.txt` v3 (13 lines, fact-check PASS on v2's wording, v3 keeps it). Times are **estimates** from
`transcript.json` (`yarn timings`, no audio): voice 0.15 → 74.4 s, plus a 1.5 s tail, comes to **≈ 75.9 s**. The estimate
runs at ≈ 2.5 words/s. Our narrator measures ≈ 2.7 words/s, and "4680" is spoken as three words ("forty-six eighty", S1),
so the real take should land near **≈ 70–71 s**, not the brief's ≈ 60 s (S2). Every time below gets re-read from the real
transcript when `spec.ts` is written, after the voiceover.

## The look in one paragraph

**One system: the heat inside a cell, and the oxygen that feeds it** (§ 5 One system per video). Orange is only that:
the heat glowing in a cell's cut layers, the oxygen specks leaving (or held in) the cathode, the heat tokens leaving a
cell's faces, and the wall meters' fill (they measure the system, § 3 The Lab). Not orange: the flames (F2), the smoke and
vent gas (grey), the nails, the press, the hot plates' coils, the energy comparison (bars card, ink), the Model 3's pack,
every card and tag. The story plays in **The Lab, re-dressed as a battery abuse bay** (N1): two cells clamped side by side
on a bench, a two-head nail press over them, one wall meter per cell, a heat station with two hot plates, a shelf of spare
cells, a technician (the grey extra) at a control box. Every cell on the bench is **cut along the nail's plane** (§ 3
Object cut-aways): the front cut face shows its layers in `cut` hatch with the ink line, so the heat is seen inside. The
chemistry beat glides into a **magnified cut-away** of each cell's layers (N2). The Tesla and energy beats slide to **The
Lab · teardown** (No. 011's room, re-dressed: a Model 3 on stands, a bench with a balance; N5, N6). Day mood throughout
(🎭 2:10 PM).

**On-screen words** (all ink): the title block; cell tags `NICKEL` / `BLADE` (F4); counter rows `NICKEL` / `BLADE`, unit
`°F`, sub `SURFACE TEMPERATURE`; callouts `OXYGEN` (twice, sub-lines differ), `IRON PHOSPHATE` (sub `Standard range`);
the bars card `ENERGY` · `PER KILOGRAM` · `BLADE` / `4680`. No maker name, logo, model badge, readable label or source
text anywhere (BYD is named by the voice only; the Model 3 is drawn to resemble the real car, no badges, § 3 Real car
models).

## Locations

| Code | Location | Built with |
|---|---|---|
| **A** | **The Lab · abuse bay**: the Lab block (3.4 × 2.4, back and left walls cut, Day). Centre: a steel bench with two clamp fixtures. Left fixture: a short, fat **nickel prismatic cell** (silver aluminium can, ≈ 148 × 91 × 27 mm, 🎭 a common size; BYD didn't publish its NCM cell's size), lying on its broad face. Right fixture: a **Blade cell** (965 × 90 × 14 mm, true scale, silver case), lying flat along x, so it reads ≈ 70× longer than thick. Over them a **two-head nail press** (a gantry, two pneumatic rams, two steel-grey nails; no label, "steel" never shown in text). On the back wall over each cell a **surface-temperature meter** (the heat bench's bar meter: ink scale, orange fill, an ink tick that can mark a level, a peak that holds). Right of the bench: a **heat station** (two hot plates, the heat bench's), a **control box** on a stand, a **shelf** of spare cells (two blades, two nickel cells). The technician (grey extra) works the control box, behind a clear shield panel | **N1** (new `section-lab` dressing `abuse-bay`), **N3** (ink dimension lines), **N4** (flames, pending F2) |
| **B** | **The cell cut-away** (an object cut-away, § 3): the cut face of a cell seen close, its layers magnified (≈ 20× in thickness, 🎭): aluminium foil, **cathode**, separator, graphite anode, copper foil, repeating. Nickel cathode: dark grey; iron-phosphate cathode: a duller grey-green (both realistic, both ≤ 25 % saturation). Oxygen = small orange specks in the cathode. Reached by a **glide** from A's cut face, and back | **N2** (new: `cell-cutaway` scene, or framings inside N1; the scene-builder decides) |
| **T** | **The Lab · teardown**, re-dressed: the No. 011 room and floor grid, a **Model 3** (realistic `model3` shape, `CHARGE.teslaPaint`) whole and cut on its four axle stands, a supplier crate on the grid, the mechanic (grey extra); at the front of the grid a low bench with a **beam balance**, a spare Blade cell and a tray of **4680 cells** | `teardown-slice` (reused: `model3`, `packRewind`, `packModules` from a crate, `madeBy: null`) + **N5** (LFP modules), **N6** (balance and 4680 cells) |

A → (glide) → B → (glide) → A → (slide) → T → (slide) → A. **Two slides**, no hard cuts. Every framing change inside a
location is a glide (0.5–1.0 s). The last A stay (scene 16) lands on frame 0 (N9).

## Title block

Line 1: `Why did only one` / `cell catch fire?` (16 / 16 characters). Line 2: `NO. 017 · THE LAB · 2:10 PM`. Up from frame 0,
fades at ≈ 8.1 s (0.8 s after line 1 ends; no card before scene 4). The spoken question ("So why does chemistry matter
that much?") comes at 20.8 s and makes no sense at frame 0, so this is the No. 014–016 pattern (F1).

## Line by line

Cues are copied word for word from `script.txt`. Times are video seconds (estimates). "Iron phosphate holds" (line 6)
and "Iron-phosphate cells can still" (line 9) differ by the hyphen and the next words, so both stay unique.

| Sc | Cue · in (s) | Line (words) | What's on screen | Motion / events (s) | Overlay | Transition in |
|---|---|---|---|---|---|---|
| 1 | `BYD drove a nail` · 0.00 | BYD drove a nail through two battery cells. | **Frame 0, A `bench`:** both cells clamped, the press head ≈ 6 cm over them and already descending, both meters at zero, the technician at the control box, hand on the lever | 0.0 slow push starts, drift 0; the press descends at a steady speed · 1.2 tags in · 1.4 "through" both nails enter both cells at once, straight down through the broad faces (perpendicular, F9) · 2.0 the press stops, nails in · 2.3 "battery" the nickel cell's cut face: an orange glow starts in its layers at the nail and spreads; its meter starts to climb · 2.8 "cells" the blade's cut face: a faint orange point at its nail, no spread | **Tags** `NICKEL` (left, over the nickel cell) / `BLADE` (right, over the blade's far end), 1.2 → 3.4 (F4) | — (frame 0) |
| 2 | `One burst into flames` · 3.50 | One burst into flames, and the other didn't even smoke. | A, glide to `nickel` (the nickel cell close, its meter above it) | 3.5 glide (0.6 s) · 3.6 a grey vent wisp from the nickel cell's top · 3.8 "burst" **stylised flames** flare from the vent (≈ 1.2 s, F2); the cut layers glow bright orange; the meter's fill runs to the top · 5.0 flames die back, the can scorched dark, a thin grey wisp, orange still deep in the layers · 5.5 glide on to `blade` (0.8 s) · 6.2 "the other" the blade: intact, the nail in it, only the faint orange point · 6.6 "didn't even" its meter has crept up a hair and holds · 7.0 "smoke" no wisp; the technician lets go of the lever | — | continue (glide) |
| 3 | `You might think every` · 7.73 | You might think every EV battery has the same fire risk. | A, glide out to `cuts` (both cut faces side by side, the press over them) | 7.7 glide · 8.1 title block fades · 8.5 the press lifts both nails out, steady, straight up · 9.3 "every EV" from here the two cut faces read alike: the same grey layer stacks, the same hatch (the "same" picture, F3) · 10.3 "same" the technician steps out from behind the shield · 11.0 "fire risk" she looks at the scorched nickel cell | — (F3) | continue (glide) |
| 4 | `In BYD's own test` · 12.06 | In BYD's own test, a nickel cell went over 900 degrees Fahrenheit, | A, glide to `meters` (both wall meters, the cells low in the frame) | 12.1 glide · 12.8 counter in · 13.0 the counter's clock starts; the nickel meter's peak line (where its fill stopped) gets an ink tick · 14.2 "nickel cell" the counter's NICKEL row runs on · 15.3 "900" the NICKEL row lands at 900 · 16.1 "Fahrenheit" the technician lifts a hand-held probe off the control box | **Counter (rows)** `NICKEL` 0 → 900 / `BLADE` 0 → 140, unit `°F`, sub `SURFACE TEMPERATURE`; one clock; BLADE stops at 140 at ≈ 13.4, NICKEL lands at 900 on "900" (15.3); in 12.8 → 20.4 (F5) | continue (glide) |
| 5 | `and BYD's iron-phosphate Blade` · 16.90 | and BYD's iron-phosphate Blade stayed at 140 or below. | A, glide down to `blade` (the blade's nail end, the BLADE row of the counter above) | 16.9 glide · 17.5 the counter's BLADE row gets an ink bracket (stopped since 13.4) · 18.4 "Blade" the technician touches the probe to the blade's case near the nail · 19.5 "140" the probe's tip rests; the blade's meter ticks at its low peak (ink tick) · 20.1 "below" she lifts the probe away | **Counter** continues (rows held), out 20.4 | continue (glide) |
| 6 | `So why does chemistry` · 20.81 | So why does chemistry matter that much? | A, glide to `cuts` close (the two cut faces, nickel left, blade right) | 20.8 glide · 21.4 "chemistry" a thin **ink outline** draws round the cathode layers in both cut faces (one layer type, both cells; F6) · 22.3 "matter" the camera starts a slow push into the nickel cell's cut face · 23.2 "much" the push speeds into the glide of scene 7 | — | continue (glide) |
| 7 | `When a charged nickel` · 23.85 | When a charged nickel cell overheats, it can release oxygen that helps fuel the fire. | **B `nickel`:** the nickel cell's layers magnified, orange specks (oxygen) sitting in the cathode lattice | 23.9 glide in (1.0 s, the cut face fills the frame) · 24.9 "nickel cell" the layers warm: a dim orange glow rises in the cathode · 25.8 "overheats" the glow brightens; the specks start to shiver · 26.5 specks break loose from the cathode, a few at a time · 27.1 "release oxygen" they drift out across the separator into the electrolyte gap · 27.8 callout in on a drifting speck · 28.8 "fuel" where the specks reach, the orange glow brightens a step (the heat feeding on the oxygen) · 29.5 "fire" the whole gap glows | **Callout** `OXYGEN` / `Leaves the cathode`, on the leading speck, 27.6 → 29.9 | continue (glide) |
| 8 | `Iron phosphate holds` · 30.18 | Iron phosphate holds its oxygen much more tightly. | **B `lfp`:** the blade's layers magnified, the same build, a duller iron-phosphate cathode, the same orange specks | 30.2 glide across (0.8 s) · 30.9 the same dim orange warmth in the cathode · 31.6 "holds" the specks shiver in place and stay; none crosses the separator · 32.3 callout in · 32.7 "much more" the warmth stays low and steady · 33.4 "tightly" the specks settle, still in place | **Callout** `OXYGEN` / `Held in place`, on a speck in the cathode, 32.3 → 33.8 | continue (glide) |
| 9 | `BYD says the Blade's` · 33.88 | BYD says the Blade's long, flat shape also helps the cell cool. | **A `bladeLong`:** glide back out of the cut-away onto the whole blade on the bench (the nickel cell out of frame left) | 33.9 glide out (1.0 s) · 34.9 the faint orange at the blade's nail spreads along its length both ways, thinning (the heat spreading through the long cell) · 35.8 "long" the spread reaches ≈ a third of the length · 36.2 "flat" small orange **heat tokens** leave the blade's broad top face along its length, rising and fading · 37.4 "helps" the spot at the nail dims · 38.0 "cool" the blade back to its faint point, the last tokens fading | — | continue (glide) |
| 10 | `Each cell is more` · 38.73 | Each cell is more than three feet long and just over half an inch thick. | A, glide to `shelf` (the shelf, the technician beside it, room for her full height) | 38.7 glide · 39.0 the technician lifts a spare blade off the shelf · 39.8 she stands it on end on the floor beside her: its top reaches her hip · 40.4 "three feet" an **ink dimension line** draws up its length, end ticks top and bottom, no digits (N3) · 41.6 "long" glide to `bladeEnd` (its top end close, 0.6 s) · 42.6 "half an inch" a short ink dimension across its 14 mm edge · 43.6 "thick" both dimension lines fade; she tips the blade level to carry it | — (F7) | continue (glide) |
| 11 | `Iron-phosphate cells can still` · 44.30 | Iron-phosphate cells can still overheat out of control, | A, glide to `heat` (the heat station: a fresh nickel cell on the left plate, the technician laying the spare blade on the right plate; both meters above) | 44.3 glide · 44.6 she sets the blade down on its plate and steps back behind the shield · 45.1 both plates on (coils dull red-grey, never orange); both meters climb together, steadily · 45.8 "still" the **nickel** meter's fill reaches its ink tick (low): the nickel cell runs away: bright orange through its layers, a grey vent jet, many heat tokens (no flames, F2) · 46.8 "overheat" the meters climb on · 47.1 "out of control" the **blade**'s fill reaches its tick (higher): the blade runs away: orange through its layers, smaller and dimmer, a thinner vent wisp | — | continue (glide) |
| 12 | `but it takes a` · 48.04 | but it takes a higher temperature, and they give off less heat. | A, glide up to `heatMeters` (the two meters, the cells' tops at the frame bottom) | 48.0 glide · 48.9 "higher" an **ink bracket** draws between the two ticks (nickel low, blade high) · 50.0 "temperature" the plates switch off; the fills start to fall, the peaks hold · 50.6 glide down to `heat` (0.6 s) · 51.2 "give off" the nickel cell's heat tokens: a dense column; the blade's: a thin one · 52.3 "less heat" the blade's tokens stop first; both cells scorched, still | — | continue (glide) |
| 13 | `Tesla said in 2021` · 52.94 | Tesla said in 2021 it was moving its standard-range cars to iron phosphate as well. | **T `car`:** the Model 3 on its stands, cut, its pack in view (nickel modules); a supplier crate on the grid; the mechanic at the crate | 52.9 slide (18 fr) · 53.7 tag in · 54.3 "2021" the pack's modules rewind out through the cut face, front first (No. 011 `packRewind`) · 55.4 "moving" the crate's lid opens · 56.0 "standard-range" iron-phosphate modules ride in from the crate, one by one, into the tray (`packModules`) · 57.1 callout in · 57.5 "iron phosphate" the last module seats · 58.3 "well" the mechanic closes the crate | **Tag** `TESLA` (car tag, `CHARGE.teslaPaint` square, sky above the roof), 53.7 → 56.5; then **callout** `IRON PHOSPHATE` / `Standard range`, on the pack, 57.1 → 58.8 | **slide** |
| 14 | `That chemistry stores less` · 59.01 | That chemistry stores less energy for its weight, though. | T, glide to `balance` (the bench at the grid's front, the beam balance, the Model 3's tail behind) | 59.0 glide · 59.6 the mechanic sets a Blade cell on the left pan; the beam tips left · 60.4 "stores" he sets 4680 cells on the right pan, one at a time · 61.3 "energy" the beam rises toward level, swinging less each time · 62.0 "weight" the eighth cell: the beam settles level (equal weight, 🎭 count) · 62.6 he steps back | — | continue (glide) |
| 15 | `Tesla's` · 63.28 | Tesla's 4680 nickel cell holds about fifty percent more than the Blade, German researchers found. | T, glide to `balanceLow` (the balance low in the frame, under the card) | 63.3 glide · 63.9 card in · 64.6 "nickel cell" the mechanic taps the 4680 stack · 65.1 the BLADE bar draws · 66.2 "fifty percent" the 4680 bar draws, half again as long · 67.0 "more" an ink bracket marks its extra half · 68.3 "German" the mechanic writes on a clipboard · 69.4 "found" the card holds; the beam still level | **Chart card, bars mode** tab `ENERGY`, one row `PER KILOGRAM`, bars `BLADE` 1.0 / `4680` 1.5 (ink only, no numbers; ratio 241 ÷ 160 = 1.51 ✅), 63.9 → 69.9 | continue (glide) |
| 16 | `Do you know which` · 70.16 | Do you know which battery chemistry is in the car you'd buy? | **A, slide in on `bench`, landing on frame 0:** a fresh pair clamped (a new nickel cell, a new blade), the scorched cells gone, the press up | 70.2 slide (18 fr) · 70.8 the technician presses the fresh blade into its clamp · 71.6 "battery" she walks to the control box · 72.6 "is in" she takes the lever · 73.4 "car" the press starts down at frame 0's speed · 74.4 voice ends, captions end · 75.9 **last frame = frame 0** (press height, her pose, meters at zero) | — (captions end) | **slide** |

### Gaps (longest stretch with no listed event, estimated)

Every scene has an event at least every ≈ 1.3 s on the estimates. The longest gaps: scene 3 (11.0 → 12.1, the glide
fills it), scene 9 (36.2 → 37.4, the tokens keep rising), scene 15 (66.2 → 67.0 and 68.3 → 69.4, the card holds while
the mechanic writes). Re-check on the real take.

### Scene lengths

Between 3.0 and 6.9 s estimated (≈ 2.8 to 7.0 s on the real take, scene 15 longer because "forty-six eighty" adds two
spoken words). **Over 6 s:** scene 7 (6.3), scene 13 (6.1), scene 15 (6.9 → ≈ 7.0 real). Each holds one mechanism or one
card; splitting 15 at `German researchers found` gives a 1.9 s scene and makes the card blink. Split 13 at `to iron
phosphate` only if the take stretches it past 7 s. **Short:** scene 6 (3.0, the question; it has to be short).

## Lines that are hard to show (fixes proposed, not made)

- **F1 · Title-block question.** The spoken question ("So why does chemistry matter that much?", 20.8 s) can't be shown
  at frame 0. **Proposal:** `Why did only one cell catch fire?` from frame 0, fading ≈ 8.1 s (the No. 014–016
  precedent). Main session decides; owner if read as a title-block default.
- **F2 · The flames (brand decision).** The researcher's note says orange is the heat inside, **not** the flames. But real
  flames sit inside the reserved band (§ 1), and they can't be orange without reading as the system. **Proposal:** draw
  the scene-2 flame as a **drawing flame**: three or four flame tongues in `paper` fill with the 0.011 ink line, no
  bloom, no light cast, no smoke cloud, flaring ≈ 0.3 s, holding ≈ 0.6 s, dying ≈ 0.3 s; the orange is the heat in the
  cut layers under it. It reads as a section drawing and avoids fear-mongering. **Alternative A:** orange flames, counted
  as the system (heat made visible): simpler, but the fire becomes the "hidden" thing, and § 5's halo would make it
  read as a blaze. **Alternative B:** no flame; a bright orange flare in the layers plus a grey vent jet (the voice carries
  "burst into flames"). Brand-director rules (it's a palette and look question); owner if it's identity-level taste.
  Scene 11 has **no flames** either way: the runaway there is orange layers and grey vent gas only.
- **F3 · Line 2, "the same fire risk" (the belief).** A belief has no object. **Proposal:** the two cut faces, glided to
  side by side, look alike (the same grey layer stacks), so "every battery is the same" is what the eye sees, just before
  line 4 picks out the one layer that differs. Alternative: a back-wall rack of identical grey spare cells. Weak either
  way; acceptable because it's 4 s and the scorched-vs-intact pair is still in frame.
- **F4 · Tags on cells.** § 6 allows name tags on people and (v0.13) on cars, not on objects. The hook names two cells and
  the counter rows reuse the names, the same reason car tags exist. **Proposal:** cell tags `NICKEL` / `BLADE`, same look
  as car tags (square = the cell's case colour, 2 px ink outline; leader from the cell's top), 1.2 → 3.4 s (after the
  first second, § What we never do), out before the flames. **Fallback inside the rules:** one callout at a time (`NICKEL
  CELL` 1.2 → 2.3, `BLADE` 2.4 → 3.4). Brand-director decides.
- **F5 · Counter "over 900" and "or below".** The counter shows `900` and `140` with no sign; the voice says "over" and
  "or below". A `>` / `≤` before the digits needs a small Counter change (`prefix` per row). **Proposal:** no sign
  (captions carry it); add `prefix` only if the reviewer reads `900` as exact. Values: 932 °F and 140 °F are BYD's
  500 °C and 60 °C (sources P1). The meters have no digits (§ 3 in-set gauge), so the counter is the frame's one card.
- **F6 · Line 4, the question.** The ink outline round the cathode layers is an ink mark in the set (like § 3's in-set
  gauge), not a callout: no text. It points at where the answer lives without saying "cathode", which the voice never says.
- **F7 · Line 8, the size.** The voice says the numbers; the picture shows them by scale (the blade reaching the
  technician's hip, 965 mm) and two **ink dimension lines with no digits** (N3). No card: the captions carry the numbers.
  If the brand-director wants the figures on screen: one callout at a time (`3 FT +`, then `½ IN +`), but that turns a
  picture of size into a label.
- **F8 · BYD's test in our Lab.** The Lab is the "researchers found" room; here it stages **BYD's own** test. The voice
  attributes it at 12 s ("In BYD's own test"), and nothing in the room is branded or looks like a third party's lab
  (no certificates, no standards text). Fact-checker / main session: confirm that's enough. Lines 14–15's teardown
  (RWTH) is a true researchers beat.
- **F9 · Nail direction and test details.** The nails go in perpendicular to the broad face, at a steady speed, both at
  once (🎭 "at once": BYD's video showed the cells separately; voice says "two cells", which the fact-checker accepted as a
  selection). The researcher flagged the direction as **not verified** against BYD's video: the scene-builder or
  researcher checks one still before N1's press is built. No sparks, ever.
- **F10 · Scene 11–12, the heat ramp.** Shown as a shared ramp on two hot plates: nickel runs away at the lower tick, the
  blade at the higher one, the blade's glow and tokens smaller. The tick heights and the token amounts are 🎭 but in the
  sources' proportions (runaway ≈ 170–190 vs 230–260 °C; heat ≈ 20–25 vs 10–15 kJ/Ah, Battery Design). The nickel cell
  goes first, at "still", a beat before the voice reaches the blade; that's the physical order.
- **F11 · Scene 13, "moving to iron phosphate".** The module swap is a picture of "moving to", not a claim that packs
  were retrofitted (🎭, disclosed). The car is a Model 3 (Tesla's standard-range cars include it, sources claim 12).
  No orange on the swap: the pack isn't the system here.
- **F12 · Scene 14, the balance.** Eight 4680 cells ≈ one Blade cell by weight is 🎭 (≈ 355 g vs ≈ 2.7 kg, our estimate,
  not sourced); the picture only needs "equal weight". If the fact-checker wants no implied count, the right pan holds a
  closed tray of cells instead.

## Script lines I'd change (scriptwriter's call)

- **S1 · "4680" (line 12).** Voiced "forty-six eighty". `yarn check` warns when `performance.txt` minus tags differs from
  `script.txt`, so writing "forty-six eighty" only in `performance.txt` will trip that check. **Options:** (a) keep
  "4680" in both and let the voice agent confirm the model reads it as "forty-six eighty" on a `--dry-run` listen (risk:
  "four thousand six hundred eighty"); (b) spell it "forty-six eighty" in `script.txt` too (captions then show words);
  (c) tooling teaches the check a number alias. I'd pick (b) for safety, (a) if the captions must show the product
  number. The scene-15 cue is `Tesla's`, which avoids the number either way.
- **S2 · Length.** ≈ 70–71 s on the take, not ≈ 60 s. Over 60 s means our own music or none (§ 9, § 10). Nothing in the
  picture pads; a shorter video needs a script cut. Candidates: merge lines 11–12 ("Tesla's forty-six eighty nickel
  cell stores about fifty percent more energy for its weight, German researchers found.", ≈ −2 s); or cut line 8 (the
  size, ≈ −5 s, but it's the best picture of "blade").
- **S3 · Optional swap of lines 7 and 8.** Size first, then the cooling claim, reads better on screen: the technician
  stands the blade up, then the heat spreads along it. "Each Blade cell is more than three feet long and just over half
  an inch thick. BYD says that long, flat shape also helps it cool." Same facts; spoken-check should hear it.
- No other changes: every other line maps to one picture.

## Reused vs new

**Reused as they are:** the Lab block (`LabSlice`) and `section-lab`'s keyed camera (framings, glides, push); the heat
bench's **hot plates** and **bar meters** (`HeatBench`) for the abuse bay's heat station and wall meters; the grey extra
(Lab workers); `teardown-slice` with `shape: 'model3'` (realistic, `CHARGE.teslaPaint`), `packRewind`, `packModules`
from a `SupplierCrate`, axle stands, the mechanic's walks, `madeBy: null` (no orange); the **counter** (`rows`); callouts;
car name tag (`TESLA`); the **chart card, bars mode**; the title block; slides and glides.

**Not reused:** `SlicedCar`'s `blade` pack (No. 011's blade pack beat; here the Blade is a loose cell, true scale, on a
bench); the "made by" glow (another video's system, § 5 One system per video); the ruler (§ 5, that is an orange count).
No detail box: no screen is read.

## Missing scenes and parts (scene-builder, one brief each; all new)

- **N1 · NEW `section-lab` dressing `abuse-bay` (A).** The Lab block, Day, nothing readable.
  - **Bench + two clamp fixtures** (steel, bolted jaws). **Nickel prismatic cell** ≈ 148 × 91 × 27 mm, silver aluminium
    can, terminals on the top edge, a vent disc; **Blade cell** 965 × 90 × 14 mm, silver aluminium case, terminals at
    both ends. Both lie on their broad faces; **both cut along the nail's plane** (§ 3 object cut-away: the front cut face
    in `cut` hatch with the ink line; the layer stack visible as fine bands, true thickness ≈ 10× magnified for reading,
    🎭). Real materials (`REAL` tokens), no labels, no orange except the heat.
  - **Nail press:** a gantry over the bench, two rams, two steel-grey nails (≈ 8 mm, 🎭). Keys `{downAt, speed, stopAt,
    upAt}`; steady speed; both nails together; perpendicular to the broad faces.
  - **Heat in a cell (the system):** per cell, keyed `heat` 0 → 1: an orange glow in the cut layers from the nail point
    (nickel: spreads through the whole face; blade: a point that can spread **along the length**, thinning, then fade);
    `runaway` (bright orange through the layers, ≈ 1 s rise); **heat tokens** (the heat bench's orange tokens) leaving
    the broad top face, rate keyed. Bloom per § 5. Scorch: the can darkens after a runaway (neutral, `REAL` dark).
  - **Grey vent wisp / vent jet** (neutral, `CHARGE.coolantFlow`-like grey, deterministic, opacity-only fades); **no
    smoke cloud**, never filling the frame.
  - **Flames:** see N4.
  - **Wall meters**, one per cell (the `HeatBench` bar: ink scale, orange fill = the cell's surface heat, eased), each
    with an **ink tick** at a keyed level (`tickAt`, `tickLevel`), a **peak** that holds after the fill falls, and an
    optional **ink bracket** between two meters' ticks (scene 12). No digits.
  - **Heat station:** two hot plates (the heat bench's), coils dull grey-red when on (outside the band; never orange),
    a fresh nickel cell on the left plate.
  - **Ink cathode outline** (scene 6): an ink line drawn round the cathode bands on both cut faces, draw-on 0.6 s, fade.
  - **Shelf** of spares (two blades, two nickel cells), a **control box** with a lever, a clear **shield** panel
    (polycarbonate, faint edges, no glare sheet over the cells).
  - **Technician** (grey extra, adult proportions): beats `lever` (hand on, pull, release), `walk`, `probe` (pick up a
    hand probe, touch a case, lift away), `takeSpare`, `standOnEnd` (the blade on end beside her, top at hip height),
    `carry`, `placeOnPlate`, `clamp`, `lookAt`.
  - **Fresh pair / reset** (scene 16): a `reset` key swaps the scorched pair for fresh cells (off frame, under the slide)
    and resets meters, press and shield.
  - **Framings:** `bench` (frame 0: both cells, press, both meters, technician; meters between the title block and the
    cells), `nickel`, `blade`, `cuts` (both cut faces, a close variant for scene 6), `meters` (room for the counter top
    left), `bladeLong` (the whole blade), `shelf` (her full height), `bladeEnd`, `heat`, `heatMeters`, `wide`.
- **N2 · NEW `cell-cutaway` (B).** An object cut-away of a cell's layers, magnified (≈ 20× in thickness, 🎭): repeating
  aluminium foil · cathode · separator (pale, slightly translucent) · graphite anode · copper foil (`REAL.copper`), the
  section look on the cut. Two cathodes: **nickel** (dark grey) and **iron phosphate** (dull grey-green), both ≤ 25 %
  saturation. **Oxygen specks** (small orange spheres, `orange`, bloomed lightly, § 5 dot weight) in the cathode band.
  Modes, keyed: `warm` (a dim orange glow in the cathode), `shiver` (specks jitter, deterministic), `release` (specks leave
  the cathode a few at a time, cross the separator, drift into the gap; the glow brightens where they arrive), `hold`
  (specks jitter in place, never cross; the glow stays low). Framings `nickel`, `lfp`, reached by a glide from N1's `cuts`
  and back to `bladeLong`. Either its own scene with a matched camera hand-over, or framings inside N1 (preferred for
  the glide); the scene-builder decides. Needs an anchor on a chosen speck for the `OXYGEN` callout.
- **N3 · NEW ink dimension lines (A).** An architect's dimension in the set: two short extension lines, a dimension line
  with **ink end ticks** (45° slashes, the section-drawing convention), `cutLine` on a thin `cut` halo (the in-set ink
  gauge look, § 3), **no digits, no units, no text**. Keys `{at, fadeAt}`, draws on along its length over 0.6 s. Used
  along the standing blade (965 mm) and across its edge (14 mm, magnified ticks if needed, 🎭).
- **N4 · NEW stylised flame (A, pending F2).** On the proposal: 3–4 flame tongues as flat `paper` shapes with the ink
  line, billboarded at the vent, shape animated by a seeded noise on the video clock (no `Math.random`), keys `{at,
  peak, out}` (≈ 0.3 / 0.6 / 0.3 s), no light, no bloom, no smoke. If F2 goes to B, skip N4.
- **N5 · LFP modules for the `teardown-slice` swap (T).** `packModules` today seats grey modules from a crate. For the
  swap to read, the modules leaving and arriving should differ: outgoing **nickel modules** (rows of cylindrical cell
  ends on their cut face) and incoming **iron-phosphate modules** (a few big prismatic cells on their cut face). Both
  neutral, no orange, no labels. Plus an anchor on the pack for the callout, and a `car`-style framing with the pack and
  the crate in view.
- **N6 · NEW beam balance + 4680 cells (T).** A generic lab beam balance on a low bench at the grid's front (a centre post,
  a beam, two pans; steel and black plastic, no scale text). A **Blade cell** (N1's model) on the left pan; **4680 cells**
  (46 × 80 mm cylinders, true scale, bare silver cans, no wrap or text) placed one by one on the right pan by the
  mechanic. The beam's angle follows the pans' masses with a damped swing (physically right: tips toward the heavier
  side, settles level when equal). Keys: `bladeAt`, `cellsAt[]`. Framings `balance` and `balanceLow` (the balance under a
  top card, above y 1040).
- **N7 · Counter `prefix` per row (optional, F5).** A short glyph before a row's digits (`>`, `≤`), in the digits' font.
  Only if the reviewer asks for it.
- **N8 · Tags on objects (pending F4).** The car tag with its leader starting at an object's anchor (the cell's top
  centre) instead of a roof. Anchors on both cells in N1.
- **N9 · The A loop.** Scene 16's last frame is frame 0: the camera lands on `bench` at frame 0's distance (drift 0);
  the press at frame 0's height and moving at frame 0's speed (its descent is one function across the loop seam: last
  frame's height = frame 0's height minus one frame's travel); the technician at frame 0's pose (hand on the lever);
  a fresh, unscorched pair; meters at zero, no tick, no peak, no bracket; no tokens, wisps or flames; the shield in place.

**Brand-director (before the build):** F2 (the flames), F4 (tags on objects), N3 (dimension lines as an in-set ink
mark), the magnified layers in N2 (a cut-away at more than true scale, 🎭), and whether the iron-phosphate cathode's
grey-green and the hot plates' coil colour need theme tokens.

## The loop seam plan

1. **Frame 0 (scene 1):** A `bench`, Day, 2:10 PM. Both cells fresh and clamped, the press ≈ 6 cm above them and moving
   down, both meters at zero, the technician's hand on the lever, the shield in place. No orange anywhere. Title block up,
   drift 0, a slow push from distance D0.
2. **The last shot (scene 16):** a slide into A on `bench`, the push resumed so the camera lands on D0 at the last frame.
   The scorched pair was swapped under the slide (N1 `reset`); the technician clamps the fresh blade, walks to the lever
   and takes it at frame 0's pose; the press starts down so its height on the last frame meets frame 0's.
3. **Phase-locked details:** meters at zero; no peaks, ticks or brackets; no tokens or wisps; the cells' cut faces plain.
4. **Words:** the voice ends at ≈ 74.4, captions are gone for the last ≈ 1.5 s. On replay the cut adds only the title
   block. "...the car you'd buy?" hands over to "BYD drove a nail through two battery cells."
5. **Check:** `yarn stills blade-battery --frames=0,<last>` and compare the two PNGs; the press motion in Studio.

## For the publisher's 🎭 "Illustrative:" line

The test is restaged in our lab (BYD filmed its own test); the nickel cell's size; the nails' size and that both go in at
once; the flames' look; the heat glow, the oxygen specks and the heat tokens; the layers' magnification; the meters'
levels and ticks; the heat-station comparison (proportions from the sources, not a recorded test); the pack swap on the
Model 3; the number of cells on the balance; the story time. The Model 3 is drawn to resemble the real car; no logos.

## Sound (note only, for later)

Physical sounds only: the press's pneumatic hiss and the nails' crunch into the cells (scene 1), the nickel cell's vent
hiss and a short soft whoomp for the flame (no crackle bed, no alarm: no fear-mongering), the press lifting, the clamp's
ratchet, the technician's steps, the hot plates' click on and off, the module seats and the crate lid (No. 011's
`module-seat`, `lid-clack` recipes), the cells set on the balance pan (light metal taps). The orange, the cards and the
tags make no sound.
