# No. 014 (to confirm) · Hybrid city: audio + visual script (draft 1, 2026-11-02, before voice)

Words: `script.txt` as approved by the owner on 2026-11-02 (15 lines, after fact-check PASS, ai-tell POLISH and
spoken-check). Times are **estimates** from `transcript.json` (`yarn timings`, no audio): voice 0.15 → 84.94 s, plus a 1.5 s
tail = **≈ 86.4 s**. The real take will probably run shorter, close to the brief's ≈ 80 s. Every time below gets re-read from
the real transcript when `spec.ts` is written. `spec.ts` comes after the voiceover (a paid step), not before.

## The look in one paragraph

One drive across town in one cut-open **generic sedan hybrid** (`shape: 'sedan'`, no badge or model cue: the voice names no
model, so § 3 Real car models doesn't apply). YOU drives it ("If you drive a hybrid"), in YOU's paint. Beside it at every
light is its **gas twin**: the same body in a second paint, driven by an extra, in a second lane stacked under it like
two sections on one sheet (the `charge-slice` / `race-slice` grammar). **Orange is the energy flow only**: battery →
motor → wheel (pulling away), wheel → motor → battery (gentle braking), and **heat at the brake discs** (any friction stop,
seen through the spokes of whole wheels). Not orange: the engines (running = the crank pulley and belt turning, a small
tremor; off = still), the grey exhaust puffs, the air-resistance arrow (ink), every card. Day mood throughout. The cold beat
is the same corner re-dressed for winter. No temperature, MPG or percentage in the 3D set; the numbers live on two cards only.

**On-screen words** (all ink): `HYBRID`, `GAS` (car tags), `ENGINE`, `ELECTRIC MOTOR`, `BATTERY` (callouts), the sticker
card (`CITY`, `HWY`, `MPG`, 29 / 37, 51 / 44), the counter `4×` / `THE PUSH` / `AT TWICE THE SPEED`. No model names, badges,
logos or source text.

## Locations

| Code | Location | Built with |
|---|---|---|
| **A** | The corner, a mild weekday morning (🎭 8:10 AM): two city lanes stacked, a stop line and a post signal in each (in sync), the hybrid on top, the gas twin below, a generic lead car ahead of each (uncut) for the stop-and-go | **New** `city-twin` (build N4), cars are `SlicedCar` with the new `variant: 'hybrid'` (N1) and `'gas'` (N3) |
| **H** | The highway, right lane, the hybrid alone | `car-slice`, `road: 'highway'`, `highwayLane: 'lane'`, `variant: 'hybrid'` (N1) + the drag arrow (N5) |
| **W** | The same corner on a very cold day: snowbanks at the curb, frost on the glass, bare trees. The hybrid alone (top lane framing) | `city-twin` with `dressing: 'winter'` (N6) |

A → H → W → A: **3 slides**, no hard cuts. Inside A every framing change is a glide.

## Line by line

Cues are copied word for word from `script.txt`. "Sc" is the planned scene. Times are video seconds (estimates).

| Sc | Cue · in (s) | Line (words) | What's on screen | Motion / events (s) | Overlay | Transition in |
|---|---|---|---|---|---|---|
| 1 | `Most gas cars` · 0.00 | Most gas cars get their worst mileage in stop-and-go traffic, | **Frame 0, A `stack`:** both twins stopped at a red light behind their lead cars, brake lamps lit. The hybrid's engine is still; the gas twin's engine idles (belt turning, small tremor) | 0.0 push in starts (drift 0) · 1.2 grey puff from the gas twin's tailpipe · 2.2 both signals green · 2.6 lead cars pull away · 3.0 both twins creep forward (lamps off, wheels roll forward); the gas engine revs (bigger puff), the hybrid moves with its engine still · 3.7 "traffic" | **Title block** 0 → ≈ 9.4 (see F1) · **Tags** `HYBRID` (top) / `GAS` (bottom) 0.3 → 3.3 | — (frame 0) |
| 2 | `but many hybrids` · 4.40 | but many hybrids get their best mileage right there. | As 1 | 4.7 "many" lead cars brake again (their lamps) · 5.6 both twins brake gently, lamps lit · 6.6 both stopped, a car length behind the leads · 7.1 a puff (gas) · 7.5 "there" the hybrid's engine is still the only quiet one | Title block | continue |
| 3 | `Look at the window` · 8.27 | Look at the window sticker. On a gas car, the highway number is bigger, | A, glide to `stackLow` (both cars low in frame, under the card) | 8.3 glide (0.8 s) · 9.7 "sticker" card in · 11.0 "gas" the GAS column's 29 and 37 land · 12.1 "highway" an ink box draws round 37 · 12.8 leads creep · 13.3 twins creep (lamps off) | **Sticker card** (N7) 9.7 → 19.0: headers `GAS` / `HYBRID` with paint squares, rows `CITY` / `HWY`, unit `MPG` | continue (glide) |
| 4 | `but on the hybrid version` · 13.90 | but on the hybrid version of the same car, the city number is bigger. | As 3 | 14.8 "hybrid" the HYBRID column's 51 and 44 land · 15.5 everyone stops again (lamps) · 16.6 a puff (gas) · 17.5 "city" an ink box draws round 51 · 18.6 the card fades (out by 19.0) | Sticker card | continue |
| 5 | `So why does a hybrid` · 19.32 | So why does a hybrid do better in town? | A, glide back to `stack` | 19.3 glide · 19.6 "why" green · 20.0 both pull away · 20.5 "hybrid" the hybrid's engine starts as it speeds up (pulley turns, tremor) · 21.5 both at ≈ 25 mph, the street scrolling | — | continue (glide) |
| 6 | `It wastes less energy` · 22.58 | It wastes less energy every time it stops. | A `stack`, the next corner sliding in | 23.0 the signal ahead turns yellow, 23.7 red · 24.1 "every" both brake, lamps lit · 24.5 "time" the gas twin's discs glow orange through its spokes (heat); the hybrid's discs stay dark (the "why?") · 25.3 "stops" both stopped | — | continue |
| 7 | `At a red light` · 25.88 | At a red light, the engine switches off. | A, glide to `bays` (both engine bays, one above the other) | 25.9 glide · 26.4 the gas discs' glow fades · 27.5 "engine" the hybrid's engine spins down · 28.0 "switches off" its pulley stops, the tremor goes · 28.4 the gas engine keeps idling, a puff | **Callout** `ENGINE` / `Off at the light` on the hybrid's engine, 27.3 → 29.0 | continue (glide) |
| 8 | `When the light turns green` · 29.19 | When the light turns green, the hybrid can pull away on the electric motor. | A, glide to `hybrid` (the top car whole: motor and inverter at the front, the battery under the rear seat) | 29.2 glide · 30.3 "turns" green · 30.7 YOU's foot to the accelerator · 31.0 **drive path** draws: battery → HV cable → inverter → motor (orange) · 31.6 "hybrid" the hybrid pulls away, engine still · 32.7 "away" the path reaches the wheel, pulses flow · 33.6 "electric" the windings light · 34.2 the gas twin's nose leaves frame bottom (the camera tracks the hybrid) | **Callout** `ELECTRIC MOTOR` on the motor, 33.3 → 34.8 | continue (glide) |
| 9 | `When you brake gently` · 34.91 | When you brake gently, the motor turns some of the car's motion into electricity. | A `hybrid`, push | 35.0 the drive path fades; traffic ahead slows (a lead car's lamps) · 35.6 "brake" foot to the brake, pressed lightly; lamps lit · 36.0 "gently" **regen path** draws: hub → half-shaft → motor (36.9 "motor": windings light) → inverter (37.7) → HV cable → battery (39.0) · 39.9 "electricity" the modules fill a step; the cluster needle swings to charge · 40.3 traffic moves on, the hybrid at ≈ 18 mph, foot back on the accelerator | **Callout** `BATTERY` on the modules, 39.4 → 40.8 | continue |
| 10 | `When you brake hard` · 40.88 | When you brake hard, the regular brakes take over | A, glide to `hybridFront` (the near front wheel whole, the bay above it) | 40.9 glide · 41.0 the signal ahead flips to yellow close · 41.5 "brake" foot hard on the brake · 42.0 "hard" the nose dips, lamps lit; the regen path flickers and stays thin · 42.8 "regular brakes" the disc glows orange behind the spokes · 43.8 "take over" glow peaks · 44.3 stopped at the line | — | continue (glide) |
| 11 | `and turn that motion` · 44.50 | and turn that motion into heat, as in a gas car. | A, crane out to `twinBrakes` (both cars' near front wheels) | 44.5 glide · the gas twin has made the same hard stop beside it (synced from scene 10) · 45.5 "motion" both discs glowing · 46.3 "heat" glow at its peak, a soft halo · 47.6 "gas car" both glows fade over 1.5 s; the gas engine idles, a puff at 48.0; the hybrid's engine still | **Tags** `HYBRID` / `GAS` 46.8 → 48.3 | continue (glide) |
| 12 | `Out on the highway` · 48.52 | Out on the highway, there's almost no idling or braking, | **H:** the hybrid in the right lane at ≈ 35 mph (🎭), engine running steadily, lane dashes scrolling | 48.5 slide (18 fr) · 49.4 "highway" a car passes in the left lane · 51.0 a verge sign passes · 51.7 "braking" lamps stay dark; foot steady on the accelerator · 52.2 the passing car pulls ahead out of frame | — | **slide** |
| 13 | `so the hybrid has little` · 52.60 | so the hybrid has little to save. | H, glide to `battery` (the pack under the rear seat) | 52.6 glide · 53.2 "hybrid" one weak orange pulse runs along the HV cable and dies · 54.0 "little" the modules' levels stay flat · 54.7 "save" the cable's node dot dims | — | continue (glide) |
| 14 | `What's left is air` · 55.38 | What's left is air resistance, and it grows with the square of your speed. | H, glide out to `wide` (the whole car, room ahead of the nose) | 55.4 glide · 56.4 "air" an **ink** arrow draws on the nose, pointing back, with 3 ink streamlines over the roof (N5) · 57.5 the hybrid speeds up, ≈ 35 → 70 mph by 60.3 (wheels, dashes speed up) · the arrow grows with speed², ×4 by 60.3 · 59.2 "square" the streamlines thicken | **Counter** `4×` / `THE PUSH` / sub `AT TWICE THE SPEED`, 58.1 → 60.8, counts 1 → 4 landing on "speed" (60.3) | continue (glide) |
| 15 | `So the faster you go` · 61.00 | So the faster you go, the harder the engine works. | H, glide to `bay` (engine and motor) | 61.0 glide · 61.6 "faster" the engine's pulley spins faster · 62.3 "go" the throttle plate opens wider · 63.1 "harder" the tremor grows; the cluster's tach needle climbs · 64.3 the air arrow still at the nose's edge, full length | — | continue (glide) |
| 16 | `Even so` · 65.03 | Even so, the hybrid still beats its gas version on the highway, by a smaller margin. | H, glide back out to `wide` | 65.0 glide · 65.8 the sticker card returns as in scene 4 (both boxes) · 66.6 "still" the CITY row dims to `inkSub` · 67.0 "beats" the box moves to 44 · 68.0 a car passes in the left lane · 69.8 "smaller margin" a short ink bracket joins 44 and 37 · 71.2 card out | **Sticker card** 65.8 → 71.2 (HWY row) | continue (glide) |
| 17 | `Back in town` · 71.53 | Back in town, government figures show a very cold day | **W:** the same corner in winter, the hybrid alone, frost on its glass, snowbanks, light snow drifting (🎭) | 71.5 slide · 72.2 "town" the signal ahead yellow, 72.7 red · 72.9 YOU brakes gently, lamps lit · 73.3 the regen path draws, **thinner and dimmer** than in scene 9, pulses slower · 74.4 "very cold" the modules rise only a sliver | — | **slide** |
| 18 | `can cut a hybrid's` · 75.40 | can cut a hybrid's city mileage by about a third. If you drive a hybrid, | W, glide to `hybrid`, push | 75.4 stopped at the red; the regen path fades · 76.3 glide · 77.1 "mileage" a gust of snow crosses the street · 78.5 "third" (no number on screen) · 79.3 "If you drive" green · 80.0 the hybrid pulls away, a thin drive path (see F5 for the engine at the stop) | — | continue (glide) |
| 19 | `is your mileage really` · 81.10 | is your mileage really better in town, even in winter? | **A again, mild day:** both twins rolling up to frame 0's red light | 81.1 slide · 82.2 "really" both brake, lamps lit · 83.2 both stop on frame 0's marks behind the leads · 83.9 a puff (gas) · 84.9 voice ends, captions end · 86.4 **last frame = frame 0** | — (captions end) | **slide** |

### Gaps (longest stretch with no listed event, estimated)

Every scene has an event at least every ≈ 2 s on the estimates; the longest gaps are scene 1 (1.2 → 2.2), scene 12
(49.4 → 51.0) and scene 18 (78.5 → 79.3, after a 1.4 s stretch). Re-check on the real take.

### Scene lengths

All between 2.8 and 6.5 s. Short: scene 13 (2.8 s, one glide and three small events). Long: scene 16 (6.5 s, the card's
three steps keep it moving) and scene 9 (6.0 s). Split 16 at `by a smaller margin` only if the take stretches it past 7 s.

## Lines that are hard to show (fixes proposed, not made)

- **F1 · The question comes late (line 4, ≈ 19.3 s).** § 6 holds the title block until 0.8 s after the spoken question
  (target ≈ 6–7 s); here that would be ≈ 23 s, through the sticker card. **Proposal:** the title block shows the question
  from frame 0 (`Why does a hybrid do better in town?`, two lines) and fades at ≈ 9.4 s, before the card. Alternative:
  hold it to ≈ 23 s and set the card lower (top ≥ y 450, under the title), which squeezes the cars into ≈ y 860–1040.
  Owner-level (title block default), so the main session decides; I recommend the early fade. Title line 2:
  `NO. 014 · ACROSS TOWN · 8:10 AM` (number to confirm).
- **F2 · "Look at the window sticker" (line 2).** A real sticker on cars driving in traffic would be wrong (stickers come
  off at the dealer). **Proposal:** the sticker is a card, not a decal and not a detail box (a detail box needs a leader to
  the thing on screen). Alternative: a short dealer-lot shot (`charge-slice` re-dressed, chargers off, as in No. 011),
  which adds two slides and a fourth location for 11 s. I recommend the card.
- **F3 · The sticker card is a new overlay type.** Nothing in § 6 shows two numbers per car side by side: the counter shows one
  value, the price tag is for named cars' prices (once per video), and bars mode allows no numbers. Needs a short
  brand-director spec (sizes, where the ink boxes go) before the scene-builder builds it (N7).
- **F4 · Line 11, "square of your speed".** The speed doubles on screen (35 → 70 mph, 🎭 illustrative) while the ink arrow
  grows ×4 and the counter lands on `4×`. A highway car at 35 mph reads as "just merged"; if that bothers the owner, play
  45 → 90 as a what-if instead (worse: 90 mph is past every US limit). Keep 35 → 70.
- **F5 · Line 14, the cold.** What the sources support on screen: the battery works less well in the cold, and so does
  regenerative braking (fueleconomy.gov cold-weather page, quoted in `sources.md` claim 18). So W shows a **weaker regen
  path and a smaller fill**, with no number. The strongest picture, **the hybrid's engine staying on at the red light**
  (to warm up and heat the cabin), isn't quoted in `sources.md`: it appears only in the fact-checker's own note on line 6.
  **Fact-checker:** confirm a source line before the engine runs at the W stop (with a white vapor plume, never orange). Until
  then, the engine stops as in scene 7.
- **F6 · Line 15, "even in winter?" over a mild day.** The loop needs frame 0's picture (A, mild day), so the question about
  winter plays as the cars arrive at the mild-day corner. The words carry "winter". Alternative: hold W through "town," and
  slide on `even in winter` (≈ 83.9), leaving ≈ 2.5 s to land the loop. That's tight and puts the slide on the key words. Keep
  the slide on `is your mileage really`.
- **F7 · Line 12, the highway's "little to save".** No picture of a missing saving; the battery's flat levels and one dying
  pulse (scene 13) carry it. A gauge would be a card for a non-number. Leave it.
- **F8 · Line 13 has no gas twin on the highway.** The card carries the comparison (it needs no leader). Optional: give
  `city-twin` a `road: 'highway'` mode (SlicedCar already has the road) and crane down to the gas twin cruising in the lane
  below. Only if cheap.

## Reused vs new

**Reused as they are:** `SlicedCar` (sedan shape, `road: 'city'` with `corners` and signals, `road: 'highway'` lane,
`foot`, `regen`, `drivePath`, `brakeLights`, `noseDip`, `power` cluster needle, `nearWheels: 'whole'`, `wheels: 'forward'`,
`revsFrom` carry), `car-slice` (H), the `charge-slice` / `race-slice` twin-lane pattern (for N4), `CurveArrow` `'ink'`
(N5), `RACE.haze` grey (puffs), callouts, counter, name tags on cars, title block, slides and glides.

**New (scene-builder, one brief each):**

- **N1 · `SlicedCar` `variant: 'hybrid'`.** The EV and gas layouts merged into one generic full hybrid: a transverse
  four-cylinder (the gas variant's i4, cut open the same way) with **a motor-generator unit beside it** (the EV's drive unit,
  smaller), the inverter above them, **a small HV battery under the rear seat** (`BatteryPack`, ≈ 6 modules, cut open, its
  modules' levels showing), and an HV cable along the sill's cut face between them. Engine state keys `engine: {at, on}[]`
  and `rpm` keys: running = the crank pulley and accessory belt turning at the rpm (🎭 slowed like the V8's `CRANK_SCALE`),
  plus a ±1 mm block tremor; off = still, spinning down over 0.6 s. The EV's `drivePath` (battery → inverter → motor → hub)
  and `regen` (hub → motor → inverter → battery, `fill`) re-routed to the rear pack, plus a `strength` 0–1 on both paths
  (thinner core, slower pulses, smaller fill; W uses ≈ 0.4). `brakeLights`, `foot`, `noseDip`, the cluster's power needle
  and a tach needle. Near wheels whole, wheels forward. No planetary gearset shown (owner). Framings: `hybrid` (whole car),
  `hybridFront` (the near front wheel and the bay), `bay` (engine + motor), `battery`.
- **N2 · Brake heat glow** (`brakeHeat` keys per axle, 0 → 1, on 'hybrid' and 'gas'). The disc's swept face glows
  `orange` and is **seen through the whole wheel's spokes**, plus the § 5 halo at 25 % in the bloom layer. It rises with the
  brake press × speed and fades over ≈ 1.5 s after the stop (heat lingering). Front stronger than rear. The tire is never cut;
  the caliper stays its own colour. This is the system (heat lost), so orange is right.
- **N3 · Gas variant: running engine + exhaust.** The same `engine` / `rpm` tell as N1 on the gas i4 (idle by default);
  grey puffs (`RACE.haze`-like neutral, never orange) at the tailpipe, bigger with the throttle, on the scene clock with
  a phase set so frame 0 and the last frame match (or none in the air at both).
- **N4 · `city-twin` scene.** Two city lanes stacked (lane gap like `charge-slice` `stack`), each a `SlicedCar` on
  `road: 'city'` with a stop line and a post signal (the lanes' signals keyed together), a generic uncut lead car per lane
  (`CarShell`, own speed keys, auto brake lamps), `storefronts` behind the top lane. Per-car props as `race-slice`
  (`top`, `bottom`), `track` keys for the camera. Framings: `stack` (frame 0 and the loop: both whole cars between the
  title block and the captions), `stackLow` (both cars under a top card, above y 1040), `bays` (both engine bays), the
  top car's N1 framings, `twinBrakes` (both near front wheels). Dressings: `'mild'` (default) and `'winter'` (N6).
  **The loop:** cars come to rest on frame 0's marks with the same drawn wheel angle (a `restAngle` or a stop distance
  solved modulo the spoke pitch), the signal red, lamps lit, the hybrid's pack at frame 0's level (no trace carried in).
- **N5 · Air-resistance arrow** (`dragArrow` on `SlicedCar` `road: 'highway'`). An **ink** arrow (CurveArrow `'ink'`
  style, paper outline, never bloomed) at the nose, pointing backward, its length ∝ (speed / reference)² from the car's own
  speed keys (🎭 illustrative scale), drawing on over 0.6 s. With it, 3 ink streamlines over the hood and roof, flowing
  back at road speed, thicker with speed. Not orange: drag is not the energy flow.
- **N6 · Winter dressing** (`dressing: 'winter'` on `city-twin`). Snowbanks at the curbs, packed snow at the road edges,
  frost on the car glass, bare street trees, a paler sky inside the Day palette, optional light deterministic snow
  (`random('seed')`). Slush tire tracks may scroll with the road. The brand-director checks the palette (new set colours
  go into `theme`).
- **N7 · Sticker card overlay** (after the brand-director's spec, F3). A generic window-sticker-style card (paper,
  4 px ink border, square corners, not the EPA label's design, no logos), at the chart card's place (x 120, y 330,
  ≤ 696 × 620 by § 6). Two columns `GAS` / `HYBRID`, each with its car's paint square (2 px ink outline); rows `CITY` /
  `HWY` with big digits (Archivo 800) and `MPG`. Props: when each column's digits land, an ink box that draws round one
  number at a time and can move, a row dim (`inkSub`), and a short ink bracket between two numbers. Ink only, no orange.
  Counts as the frame's one card.

**Brand-director (before the build):** F3's card spec; N6's winter palette. Paint tokens: reuse YOU's car colour for the
hybrid and `CHARGE.teslaPaint` (light pearl grey) for the gas twin, or add two `HYBRID` theme tokens if reuse reads wrong.

## The loop seam plan

1. **Frame 0 (scene 1):** A `stack`, both twins stopped at the red light behind their lead cars, brake lamps lit, the
   hybrid's engine still and dark, the gas twin's engine idling, no orange anywhere, no puff in the air. Title block up,
   drift 0, the camera starting a slow push from distance D0.
2. **The last shot (scene 19):** a slide into A at 81.1. The twins are already rolling toward the light; they brake at 82.2
   and come to rest on frame 0's marks by ≈ 83.2 (N4's wheel-angle match), lamps lit, the hybrid's engine still. The pack's
   level is reset to frame 0's (a new slide opens clean, § 5 Trace). The camera pushes from a little further out and
   **lands exactly on D0 at the last frame** (No. 011's 42.65 → 42.0 pattern), drift 0.
3. **Phase-locked details:** the gas engine's pulley angle and the puff cycle are set so the last frame equals frame 0
   (N3); the signals hold red from 81.1; the lead cars stop on their frame-0 marks too.
4. **Words:** the voice ends at ≈ 84.9, captions are gone for the last ≈ 1.5 s, nothing new to read. On the replay the
   cut adds only the title block (the accepted pop). The last line ("better in town") leads back into the first line's
   "stop-and-go traffic".
5. **Check:** `yarn stills hybrid-city --frames=0,<last>` and compare the two PNGs; the motion check runs in Studio.

## For the publisher's 🎭 "Illustrative:" line

The cars are generic (the sticker figures are 2026 base trims of one model, named only in the description: gas 29 city /
37 highway, hybrid 51 / 44); the story time; the lead cars; the 35 → 70 mph run and the arrow's scale; the slowed engine
pulley and motor; the brake glow and the energy paths are drawings of the energy, not measurements; the winter dressing
and the weaker regen are pictures of "battery and regenerative braking perform worse in the cold", not a measured amount.

## Sound (note only, for later)

Physical sounds only: tire hush and brake creak at each stop, a gas idle under A, the gas engine pulling away, highway
cruise in H, a muffled winter street bed in W. The hybrid pulling away makes no engine sound (the point of line 7). The
orange paths, cards and tags make no sound. Full plan after the take.
