# No. 011 · BYD price: audio + visual script (draft 6, 2026-10-29, on the recorded take)

Words: `script.txt` (14 lines, approved). Voice: `audio/voiceover.mp3`; times are video seconds from the **real**
`transcript.json` (92.64 s of speech + 1.5 s tail = 94.14 s). Over 60 s: only our own music or none (§ 9, § 10).
Built in `spec.ts` (cues for scene starts; inside a scene every beat is keyed to a word time `W.*` and shifted into scene time).

## Draft 6 (2026-10-29): the whole China story plays in The Lab (owner, concept A; scene-builder R1–R3)

Supersedes scenes 1–11 and 23 below; scenes 12–22 (hatch, bars card, US) are unchanged. The China parking lot is gone.

| Sc | Cue | Location / take | What happens (video s) |
|---|---|---|---|
| 1 | `In China` | **Lab, take A** (both cars: the Seal 06 on its stands, the Model 3 on the shop dolly beside it, the grid empty) | Frame 0 pushing in (37 → 33 over 16 s, ≈ 0.7 %/s). BYD tag on `top` (name 1.28, price lines 4.80); Tesla tag on `second:top`, right side (name 2.76, lines 4.20); both out at 7.11. Title block `NO. 011 · THE LAB · 1:20 PM` |
| 2 | `assume it's subsidies` | take A | 6.6 the mechanic walks to the Model 3's tail · 8.4 he glances back at the Seal |
| 3 | `Subsidies do help` | take A | 9.8 he walks to the tool chest (drawer 11.3–12.6, at the frame's left edge) · 11.9 he walks between the cars · 13.5 leans on the Seal's rear quarter |
| 4 | `So analysts took` | take A | 15.1 he heads for the stool · 16.2 the Seal comes apart into the grid; the camera glides to the grid (16.0–16.8); the Model 3 stays beside it (it never crosses the grid) · 18.0 scan |
| 5–7 | `about three quarters` … `and industry estimates` | take A | As draft 4 (glow waves, the grey quarter, the pack tile, the 30–40 % counter) |
| 8–9 | `Tesla's annual report`, `from suppliers like` | take A | 30.9 glide across to the Model 3's pack and tail (lands 31.7) · 31.6 its pack rewinds · 31.9 crate 1 in · modules in from "buys" (route low) · crate 2 on "Panasonic". Callout `CELLS / Bought in` on its tail |
| 10–11 | `BYD makes its own cells`, `and builds the battery` | **Lab re-dressed (a slide, `teardown-pair`)**: both cars whole again | The Seal's pack close (`mainPack`): 38.9 rewind · 39.45 blades grow · 40.9 one slides out · `BLADE CELLS / Made by BYD` · 43.2 floor lifts · 43.9 lid becomes the floor · 45.1 seats settle |
| 23 | `linked to China` | Lab, frame 0's state (slide) | Both cars whole, grid empty, mechanic at the chest; frame 0's framing and push speed. Checked: frame 2823 = frame 0 |

- **Slides:** take A → pair (10) → hatch (12) → sedan grid (15) → US (20) → loop (23): 5, the China lot's two gone.
- **The Model 3 stays in the room** through take A (it never touches the grid) and is whole again in the re-dressed Lab, so
  no roll-out is needed (my call: the grid has room, and line 6 needs it).
- **Cover:** frame 0's Lab, both cars, `BYD vs Tesla / Why so cheap?`.
- **No `CHINA` label** (confirmed): The Lab carries no place label (style guide § 3); the voice says "In China".
- **Pass 2 (reviewer):** the loop scene carries take A's second car, mechanic and chest (keys shifted by the loop's
  length), so the room has the same width and frame 2823 = frame 0 at full size; the opening is aimed 0.6 m left and
  starts at 39 (the Seal's nose ≥ 20 px inside); both price tags raised 12 px (rise 72 / 66); the tool chest and stool
  moved to the room's right (`chest.at [3.7, −0.4]`, `worker.stool [4.6, 0.1]`), so the drawer reads between the cars;
  `BLADE CELLS` on the `blade` anchor, `CELLS` on the `crate` anchor.
- **Limits:** the tool-chest drawer sits at the frame's left edge (barely seen; the mechanic's walks carry lines 2–3). The caption
  crosses the Model 3's lower body during line 1 (the § 7 known overlap).

### Scene-builder requests (draft 6, small)

- Teardown anchors for the slid-out blade's tip (`blade`) and the crate (`crate`), as on `charge-slice`.
- Optional: the chest placeable (or the stool) so the drawer reads in the `pair` framing.

## Sound effects plan (owner: "yes sfx"; style guide § 9), 2026-10-29

Physical sounds for actions on screen only, 15–19 dB under the voice (−22.1 LUFS), no stingers, risers or whooshes beyond
the slide whoosh, nothing on an overlay's entry, **nothing during the bars card (58.66 → 77.28)**, and nothing in the US
part (only the ghost and cards move there, and they're overlays). Times are video seconds on the recorded take; each is the moment
the thing makes its sound (a landing, a seat, a clack), not the start of its motion.

| # | Sound (file) | What on screen | Cue / time (s) | Length | Under voice | Source |
|---|---|---|---|---|---|---|
| 1 | `steps` | the mechanic's walks (four short trims) | 6.6 → 8.2 · 9.8 → 11.2 · 11.9 → 13.4 · 15.1 → 16.0 | 3 s file, trimmed with `until`, 0.2 s fades | 19 | **Paid 1:** `yarn sfx byd-price steps --prompt "slow footsteps in work shoes on a smooth concrete workshop floor, indoor, close, dry, no music, no voices" --seconds 3` |
| 2 | `drawer` | the tool-chest drawer opens, then shuts | 11.3 (open) – 12.6 (shut) | 1.8 s | 17 | **Paid 2:** `yarn sfx byd-price drawer --prompt "a steel tool chest drawer sliding open on ball-bearing runners, a one-second pause, then pushed shut with a soft metal clack, close, dry, no music" --seconds 1.8` |
| 3 | `parts-land` (**the anchor**) | the Seal comes apart: parts land in the grid, big to small | 16.85 (first landing) → ≈ 18.3 | 2 s | 15 | **Paid 3:** `yarn sfx byd-price parts-land --prompt "car parts set down one after another on a smooth concrete floor: one heavy dull thud first, then lighter metal and plastic taps and clinks spreading out, dry, close, no music, no voices" --seconds 2` |
| 4 | `crate-slide` | crate 1 slides in · out · crate 2 in | 31.9 · 35.18 · 35.28 (out and in overlap: one hit at 35.2) | 0.9 s | 17 | **Paid 4:** `yarn sfx byd-price crate-slide --prompt "a steel crate on a wooden pallet pushed a short way across a concrete floor, then stopping, dry, close, no music" --seconds 0.9` |
| 5 | `lid-clack` | each crate's lid opens | 32.7 · 36.08 | 0.3 s | 17 | Self-made: `yarn sfx:latch byd-price --part out --name lid-clack` (copy from `out/byd-price/raw/sfx/`) |
| 6 | `module-seat` | each grey module seats in the Model 3's pack | 34.1 · 34.8 · 35.4 · 37.4 · 37.8 · 38.4 | 0.4 s | 18 | Self-made: `yarn sfx:contactor byd-price --part open --pitch 0.7 --lufs -31 --name module-seat` (a soft low clack) |
| 7 | `blade-slide` | the blade slides out, and back | 40.9 (out) · 42.36 (back) | 0.8 s | 17 | **Paid 5:** `yarn sfx byd-price blade-slide --prompt "a long flat aluminium battery cell sliding out of a tight metal rack, smooth metal-on-metal slide ending in a light tap, close, dry, no music" --seconds 0.8` |
| 8 | `lid-seat` | the pack lid rises and seats as the floor | 44.45 | 0.7 s | 16 | Self-made: `yarn sfx:contactor byd-price --pitch 0.6 --lufs -29 --name lid-seat` (heavy, low relay slam) |
| 9 | `seat-settle` | the seats settle onto the lid, the driver rocks | 45.15 | 0.3 s | 19 | Self-made: `yarn sfx:thump byd-price --pitch 0.8 --seconds 0.3 --lufs -28 --name seat-settle` |
| — | slide whoosh | the location slides (pair 38.2, hatch 46.24, grid 56.48, US 78.64, loop 91.52) | as today | — | — | Only if the video already uses one; No. 010 didn't, so none |

Left out on purpose (sparse): the pack rewinds (31.6, 38.9), the blades growing, the grid's glow, the hatch's wheels and
rotor (no whine), the dolly (it never rolls), the Tesla driver's door in the US (85.6–86.9; add `sfx:thump --pitch 1.2`
as a door thud only if playback feels empty), anything under the bars card.

**Paid takes: 5** (steps, drawer, parts-land, crate-slide, blade-slide). Self-made: 4 (lid-clack, module-seat, lid-seat,
seat-settle), free and deterministic.

**How the spec takes them** (No. 010's pattern, `ev-charging/spec.ts` ll. 671–720): one const per sound,
`{type: 'sfx', name, volume}` with `volume = (−22.1 − dB under) − the file's measured LUFS` (≤ 0); a list of
`[videoTime, sound, until?]` events; a helper `sfxIn(a, b)` returning the events inside each scene's span as overlays
with `at` (and `until` for the footstep trims) shifted into scene time, spread into each scene's `overlays`. Files live
in `src/videos/byd-price/audio/sfx/`. I wire it after the paid takes land and their LUFS are measured.

## Decisions taken

- **D1 · Title block** (owner). `Why is a BYD so much cheaper than a Tesla?` / `NO. 011 · THE PARKING LOT · 1:20 PM`.
- **D2 · Location C** (owner): the twin section with the **chargers hidden** (`chargers: false`, both regions).
- **D3 · The smaller BYD** (owner): a **hatch** in `RACE.evPaint` in The Lab · teardown (lines 8–9, the Seagull teardown).
- **D4 · The expected-answer beat** (owner): kept, and now **before** the teardown (lines 2–3), in C, over both cars.
- **D5 · The bars card** (owner): built. Fact-checker **CONDITIONAL PASS**: the six requirements below, over lines 10–12.

## The look in one paragraph

Orange = **"made by BYD"** (style guide v0.14 § 5: an orange edge line + a 25 % halo; cut faces and panel faces never
orange). Not orange: the Tesla's bought cells, the grey quarter of the BYD's parts (tires, glass, seats, some chips), every
card, the ghost, the crates, the bars. The 3/4 glow is on the BYD **alone** (The Lab), never "BYD lit, Tesla dark". The
cells and blades carry no chemistry text. Line 2 ("subsidies and cheap labor") gets no picture of its own claim. On-screen
names: `BYD`, `TESLA` only.

## Locations

| Code | Location | Built with |
|---|---|---|
| **C** | China, a parking lot: two cut-open sedans stacked. Top: the BYD (`sedan`, `bydPaint`, blade pack). Bottom: the Model 3 (`sedan`, `teslaPaint`). Day, 1:20 PM (🎭) | `charge-slice`, `region: 'china'`, `chargers: false`, `canopy: false`, `bayPaint: false` |
| **T** | **The Lab · teardown** (no place label): `sedan` dressing (comes apart into the floor-tape grid) and `hatch` dressing | `teardown-slice`; a change of dressing is a `slide` |
| **U** | The US: the empty top bay with the BYD's **ghost**, the Model 3 below | `charge-slice`, `region: 'us'`, `chargers: false`, `ghost` |

C → T → C → T → U → C: **5 slides**, plus 2 re-dressing slides inside T (scenes 12 and 15). No hard cuts.

## Scenes (23, real timings)

| Sc | Loc | Cue | In → out (s) | Len | Camera (all one path per run; see As built) |
|---|---|---|---|---|---|
| 1 | C | `In China` | 0.00 → 6.40 | 6.4 | stack look, 42 → 40.4 (push from frame 0) |
| 2 | C | `People usually assume` | 6.40 → 9.72 | 3.3 | continue, 40.4 → 38.6 |
| 3 | C | `Subsidies do help` | 9.72 → 14.28 | 4.6 | continue, 38.6 → 36.0 |
| 4 | T | `So analysts took` | 14.28 → 18.32 | 4.0 | slide in; whole (aimed 0.9 m higher), 31 → 29 |
| 5 | T | `about three quarters` | 18.32 → 22.72 | 4.4 | glide to grid (aimed 0.5 higher), 21.5 → 20.5 |
| 6 | T | `The battery is` | 22.72 → 26.08 | 3.4 | glide to `pack`, push |
| 7 | T | `and industry estimates` | 26.08 → 30.88 | 4.8 | continue on `pack`, push |
| 8 | C | `Tesla's annual report` | 30.88 → 34.64 | 3.8 | slide in; the Tesla's pack and crate (look [1.2, 0.85, 1.0]), 21 → 20.2 |
| 9 | C | `from suppliers like` | 34.64 → 38.20 | 3.6 | continue, 20.2 → 19.6 |
| 10 | C | `BYD makes its own cells` | 38.20 → 43.04 | 4.8 | glide up to the BYD's pack (look y 4.6, 9 → 8.8) |
| 11 | C | `and builds the battery` | 43.04 → 46.24 | 3.2 | slow pull, 8.8 → 11.5 (the cabin over the pack) |
| 12 | T | `Engineers who took` | 46.24 → 51.23 | 5.0 | slide in (hatch); car (aimed 0.45 higher), 19 → 17.6 |
| 13 | T | `and the electronics` | 51.23 → 53.28 | 2.1 | glide to `nose`, push |
| 14 | T | `Even the body` | 53.28 → 56.48 | 3.2 | glide back to car (aimed 0.25 higher), 17.6 → 16.8 |
| 15 | T | `Even so` | 56.48 → 60.24 | 3.8 | slide in (sedan grid, its trace); grid pulled low under the card, 24 → 23.2 |
| 16 | T | `only about 15` | 60.24 → 65.07 | 4.8 | continue, 23.2 → 22.2 |
| 17 | T | `Part of the remaining` | 65.07 → 67.60 | 2.5 | continue, 22.2 → 21.6 |
| 18 | T | `because the half-price` | 67.60 → 72.32 | 4.7 | continue, 21.6 → 22.8 |
| 19 | T | `Another part is` | 72.32 → 78.64 | 6.3 | continue, 22.8 → 24.6 |
| 20 | U | `You won't see` | 78.64 → 83.92 | 5.3 | slide in; `twin`, push |
| 21 | U | `There's a 100` | 83.92 → 87.92 | 4.0 | continue, `twin`, push |
| 22 | U | `starting with 2027` | 87.92 → 91.52 | 3.6 | glide to `emptyBay`, push |
| 23 | C | `linked to China` | 91.52 → 94.14 | 2.6 | slide to C; 42.65 → 42.0, landing on frame 0's framing |

Scene 13 (2.1 s) and 17 (2.5 s) are short, each with its own move and two events. Scene 19 (6.3 s) is just over 6 s; it
carries the bars card's last stretch and three surges.

## The beat table

| Sc | Words | Picture | Visible events (video s) | Overlays |
|---|---|---|---|---|
| **1** | In China, a BYD the size of a Tesla Model 3 starts at about half the price. | **Frame 0:** the BYD reversing the last metres into the top bay (6 m over 4.4 s, stopping at 1.2), the Model 3 below, its driver on the curb | 0.0 the BYD rolls · 0.3 tags in · 1.2 it stops (brake lamps) · 2.0 its driver gets out · 3.0 walks to the nose · 3.8 tags out · 4.4 the Tesla's driver stands · 4.9 walks to his door | **Title block** 0 → 6.2 · **Tags** `BYD` / `TESLA` 0.3 → 3.8 |
| **2** | People usually assume it's subsidies and cheap labor. | Both cars, both drivers. No picture of the belief | 7.2 "assume": the BYD's driver takes out his phone · 8.1 the Tesla's driver glances at his car | Captions |
| **3** | Subsidies do help, but Tesla builds the Model 3 in China too. | As 2 | 10.6 the BYD's driver pockets the phone · 11.2 "Tesla": the Tesla's driver gets in; the BYD's driver walks to his door · 12.8 "China": the label lands · 12.9 the BYD's driver gets in | **Place label** `CHINA` 12.78 → 14.2 |
| **4** | So analysts took a BYD sedan apart, and found | **T, sedan:** the BYD on the stands, the grid empty | 14.3 slide in · 16.2 "apart": the parts fly to their cells (1.3 s) · 18.0 the scan line sweeps the grid | Captions |
| **5** | BYD makes about three quarters of that car's parts, starting with the battery. | The grid close: 3 of 4 parts light, the bought quarter darkens | 18.3 the glide; the pack lights · 18.7–20.3 the wave · 20.4 the bought quarter × 0.8 · 21.0 "starting": the pack surges · 21.8 "battery": the pack lifts and settles | Captions |
| **6** | The battery is the most expensive part of an electric car, | The pack tile close | 22.7 glide to `pack` · 23.0 "battery": the other lit parts dim a step (focus) · 24.6 "part": the pack lifts | Captions |
| **7** | and industry estimates put it at 30 to 40 percent of the car's cost. | As 6 | 26.3 the counter enters · 27.8 "30": lands on 30, the pack surges · 28.5 "–40" lands · 29.8 "cost": the pack surges | **Counter** `30–40 %`, sub `OF AN EV'S COST`, 26.26 → 30.58 |
| **8** | Tesla's annual report says it buys the cells inside its batteries | **C:** the Model 3's pack. **N7 rewind:** its modules slide out, then a crate refills it | 30.9 slide in · 31.2 rewind (0.6 s) · 31.5 crate 1 slides in · 32.3 it opens · 32.7 "buys": first module in · 33.3 the callout · 33.6, 34.2 modules in | **Callout** `CELLS` / `Bought in`, above the crate, 33.28 → 34.59 |
| **9** | from suppliers like Panasonic and CATL. | As 8 | 35.2 crate 1 out · 35.3 crate 2 in · 36.3 "Panasonic", 36.7 "CATL", 37.3: modules in. All grey | Captions |
| **10** | BYD makes its own cells, long flat iron-phosphate blades, | The BYD's pack (cabin above). **N7 rewind**, then the blades grow in place, top edges lit | 38.2 glide up (lands 39.0) · 39.0 the blades sink (0.4 s) · 39.45 "own": they rise front to back (2.4 s) · 40.9 "long flat": one blade slides out ≈ 1 m toward the camera · 41.1 the callout · 42.4 the blade slides back | **Callout** `BLADE CELLS` / `Made by BYD`, beside the slid-out blade, 41.1 → 42.99 |
| **11** | and builds the battery pack into the car's floor. | Pull back; the old floor goes, the lid becomes the floor | 43.2 "builds": the floor panel lifts and fades · 43.9 "pack": the lid rises to floor height, edge lit · 45.1 "floor": the seats settle, the driver rocks | Captions |
| **12** | Engineers who took apart a smaller BYD found BYD's own motors in it too, | **T, hatch** (0.9 scale) on the stands | 46.2 slide in · 46.7 tag in · 46.9 "took apart": the scan along the car · 48.4 "found": wheels and rotor start turning · 50.0 "motors": the drive unit lights | **Tag** `BYD` (hatch roof) 46.74 → 48.64 |
| **13** | and the electronics that run them. | The hatch's nose | 51.2 glide to `nose` · 51.4 "electronics": the inverter lights, pulses to the motor (51.7) · 52.2 "run": the rotor speeds up | Captions |
| **14** | Even the body panels and lights were BYD's. | The whole hatch | 53.3 glide back · 53.8 "body": panels light nose to tail · 54.6 "lights": lamp housings · 55.1 "BYD's": surge | Captions |
| **15** | Even so, the analysts estimated the sedan they took apart cost | **T, sedan grid** (scene 5's lit state), pulled low in the frame | 56.5 slide in · 57.5 "analysts": surge · 58.7 the card enters · 58.8 "sedan": the stripped shell's edge lights · 59.0 the `TO BUILD` TESLA bar grows | **Bars card** 58.66 → 77.28 (carried) |
| **16** | only about 15 percent less to build than a China-made Model 3. | As 15 | 60.6 "about": the BYD bar grows to 0.85 · 61.6 "percent": the bracket draws · 61.8 "less": `ABOUT 15% LESS` · 63.6 "Model 3": surge | Bars card |
| **17** | Part of the remaining price gap is range, | As 15 | 65.3 the `TO BUY` TESLA bar grows · 66.0 "price": the BYD bar grows to 0.47 · 66.7 the by-eye bracket · 67.1 "range": `PART OF THE REST` | Bars card |
| **18** | because the half-price BYD doesn't go as far on a charge as the Model 3. | As 15 | 68.0 "half-price": `ABOUT HALF` · 68.3 the pack lifts · 70.5 "charge": the pack surges | Bars card |
| **19** | Another part is China's price war, since BYD has been cutting prices sharply there. | As 15 | 73.6 "price war": all surge · 74.7 "BYD": the shell surges · 75.6 "cutting": drive and electronics surge · 77.3 the card leaves | Bars card (out 77.28) |
| **20** | You won't see those prices in the US, where BYD doesn't sell its passenger cars. | **U:** the empty top bay, the Model 3 below, its driver on the curb | 78.6 slide in · 79.9 "US": the label · 81.0 "BYD doesn't sell": the ghost draws (0.8 s) · 82.4 the Tesla's driver stands · 82.8 walks to his door | **Place label** `THE US` 79.93 → 81.34 |
| **21** | There's a 100 percent tariff on Chinese-made EVs, | As 20 | 84.0 the counter enters, lands on 100 at ≈ 84.5 · 85.6 the Tesla's driver gets in | **Counter** `100 %`, sub `TARIFF`, 84.02 → 87.62 |
| **22** | and starting with 2027 models, a ban on car software linked to China. | The empty bay and the ghost | 87.9 glide (lands 88.7) · 88.5 the callout · 90.9 the ghost fades | **Callout** `SOFTWARE BAN` / `From 2027 models` on the ghost, 88.52 → 90.84 |
| **23** | (linked to China.) + tail | **C, 1:20 again:** the BYD rolling in, the Tesla's driver on the curb | 91.5 slide · the BYD rolls throughout · **last frame = frame 0** (checked: stills frame-2823 vs frame-0) | Captions end |

### The gaps, checked (longest stretch with no listed event)

1 · 1.0 · 2 · 1.6 · 3 · 1.6 · 4 · 1.3 · 5 · 1.0 · 6 · 1.5 · 7 · 1.1 · 8 · 0.9 · 9 · 1.0 · 10 · 1.5 · 11 · 1.1 · 12 · 1.6 ·
13 · 0.8 · 14 · 1.3 · 15 · 1.2 · 16 · 1.5 · 17 · 0.7 · 18 · 2.3 (68.3 → 70.5) · 19 · 1.7 · 20 · 1.3 · 21 · 2.3 (the driver getting
in runs 85.6 → 86.9) · 22 · 2.2 · 23 · rolling throughout. None reaches 3 s.

## Bars card requirements (fact-checker CONDITIONAL PASS; style guide v0.14 § 6), as built

1. Row labels `TO BUY · 2026 SEAL 06` and `TO BUILD · 2023 SEAL`; no firm names.
2. Footnote on the whole time the card is up (58.66 → 77.28, lines 10–12): `Different BYD models. Cost: 2023 estimate.` /
   `Price: China list, cheapest trim.` (Inter 600 24 px, part of the card; card 696 × 620).
3. TO BUILD: TESLA full, BYD 0.85, bracket `ABOUT 15% LESS` (measured).
4. TO BUY: BYD 0.47, no number; optional label `ABOUT HALF` (used).
5. Bracket `PART OF THE REST`, by eye (`measured: false`), no causes named.
6. Each row on its own scale; names in the left column; no split bar.

## As built: props used and limits

- `teardown-slice`: `dressing`, `apart`, `scan`, `glow` waves (`share` on), `dimAt`, `surge`, `focus`, `lift`, `car.madeBy`,
  `carScale`. The presets `whole`/`grid`/`car` leave the room in the frame's upper half, so the spec aims them higher
  (`up()` in the spec). **Limit:** the grid's parts are small at `whole`; the beats that need them read use `grid`/`pack`.
- `SlicedCar.madeBy` on the hatch. **Limit:** the inverter sits partly behind the dash; at `nose` it reads mainly by the
  pulses on the link (still frame-1584: the motor glow reads, the inverter hardly).
- `SlicedCar.blade` (`growAt`, `showAt`, `backAt`, `floorAt`, `lidAt`, `settleAt`) and **`packRewind` (N7, built)**: the
  Tesla's at 31.2 (0.6 s; crate 1 in ≥ 0.3 s later), the BYD's at 39.0 (0.4 s; growth from 39.45). The BYD carries a
  fully grown blade pack from frame 0, so its pack is the same object all video.
- `charge-slice` bay `bought` crates; `chargers: false`; a `camera` override for the Tesla's pack (`bottomPack` crops the
  front slots with a sedan).
- `ChartCard` `bars` with `footnote`, carried across scenes 15–19.
- **The camera** (ev-charging's pattern): one path per location run on the video clock, sampled every 2 frames into each
  scene's `cameraKeys`, so a push runs straight through the `continue` cuts. Steady pushes are linear; framing changes
  (grid, pack, the BYD's pack, nose, the ghost) are 0.6–0.8 s Hermite glides that leave and land at the neighbouring
  pushes' speeds, so the camera never stops, frame 0 and the last frame included (the loop arrives at frame 0's framing
  at frame 0's speed, 0.42 u/s). Speeds, as % of distance per second: China 1 ≈ 1.0; Lab whole ≈ 1.0, grid ≈ 1.2, pack
  ≈ 1.3; Tesla pack ≈ 0.9; BYD pack ≈ 1.5; hatch ≈ 1.5, nose ≈ 2.4; card run ≈ 0.5; US twin ≈ 0.9, ghost ≈ 1.0.

## Line flags

- **Line 2** has no honest picture of its own; the drivers carry the shot and line 3's `CHINA` label answers it.
- **Lines 10–12** keep one card up for 18.6 s (the fact-checker requires it over all three). The grid surges under it every
  1–2 s; the card's own bars and brackets land on the words. Long, but one idea.
- **Lines 8–9** are the hatch (D3), so the sedan isn't credited with the second teardown's findings.
- **Known overlap (§ 7, open):** on the C/U twin shots a one-line caption crosses the Model 3's front (stills 01, frame-2460);
  the hatch's front wheel touches the caption top in scene 14 (frame-1665). Left as is; the subject stays readable.

## For the publisher's 🎭 "Illustrative:" line

The cars, drivers, crates and teardown room are generic; the parts grid and its "3 of 4" glow show the analysts' share, not
the real parts list; the packs emptying and refilling are a re-enactment; the bars are shapes, each row on its own scale,
the two rows different BYD models (the card says so); the story time; the ghost.

## Sound (physical only; for tooling, nothing generated)

Tires rolling and a brake creak (1, 23), car doors (1–3, 21), parts landing on the lab floor (4), a crate sliding and
modules seating (8–9), an optional low hum while the orange is up in T (≈ 20 dB under the voice). Slide whooshes only.
