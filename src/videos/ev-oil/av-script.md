# No. 021 · EV oil: audio + visual script (draft 2.1, 2026-11-19, timed to the real voice take; brand rulings v0.18.18 applied)

Words: `script.txt`, **owner-approved** (21 lines, 237 words). Times are **real**, read from `transcript.json` (the recorded
take, `audio/voiceover.mp3`): voice 0.14 → **85.36 s** (≈ 2.78 words/s, slower than the estimate's 2.89), plus a **1.5 s
tail** (`spec.tail: 1.5`) for the loop push: **86.86 s ≈ 2606 frames** (last frame 2605 = 86.83 s). Times are video
seconds. A cue's time is the start of its first word (scene 1 starts at 0). Draft 1 used the estimate × 0.84; this draft
replaces every time in it.

## Decisions applied

| Flag | Now |
|---|---|
| F5 generic EV | **Owner decision (relayed by the main session):** the EV stays a generic crossover. "Tesla" and "Model 3" are in the voice only, and nothing on screen resembles a Model 3 |
| F7 system | § 5 "A fluid's work as the system": orange = what the oil **does** (the circulation path on the cut face, the film along sliding interfaces, flung drops that end at the pool's surface), engine only. Not the oil at rest (pool, jug, streams), the EV gearbox oil, the transaxle fluid, or the gauge |
| F7 strength | § 5 "System strength": the hue never changes. On "protective additives" the halo (25 → 12 %) and the dots (count × 0.4, speed × 0.5) dim over **1.5 s**. On "thinner" the core narrows × 0.6 over **1.0 s**. Floors 0.45 and ≥ 2 px, never dashed. Back to full only on the on-screen fresh-oil fill; the loop ends full |
| F1 combustion | § 5 "Combustion on screen": a **1-frame `screenLight` spark dot** at the plug, then a **flat `screenLight` flash clipped to the chamber**, opacity 0.75 → 0.4 → 0.15 over 3 frames. No bloom, no spill, **≤ 1 firing a second** on screen. No ink rings. Blow-by haze `RACE.haze` **≤ 0.45 opacity**, out of the bloom layer, the film halo masked where the haze crosses it. Acid gets no picture |
| F3 tokens | `REAL.oilFresh` `#8c7235` → `REAL.coffee` `#3a2a22` → `REAL.oilOld` `#1e1815` (fallback fresh `#877a45`). Particles ≥ 6 px: soot `REAL.flex`, water `HIGHWAY.spray`, fuel `REAL.pad` `#b49f5e` (not `shade`). The EV gearbox oil and the transaxle fluid stay `oilFresh` |
| F8 magnification | Approved as illustrative, built once in the geometry: the film gap **≥ 8 px at `crankcase`**, the ring end gap **≥ 10 px at `cylinder`**. Never a solid orange fill |
| F9 shop | § 3 "The shop": approved as a new location for No. 021 (not The Lab; line 20 stays a bars card). Values in N8. Whether it becomes a recurring house location is the owner's call; doesn't affect this video |
| F10 ghost pan | § 3 Ghost outline, "an absent job": approved. The pan is **≥ 120 px wide** on screen, only on line 18, the mechanic who doesn't do the job glances at it and **stays ≥ 0.3 m from it**; nobody walks through it |

## Changes from draft 1 (because of the real timings)

- **Line 13 moves into the shop** (scene 9, in-scene glide to the EV's bay at `An EV motor has no`, 48.00). On the real
  take, line 13 alone runs 2.56 s, and lines 13+14 together would have made a 7.44 s scene. In the shop the parked EV's
  motor sits still in the bay below the gas car: "no combustion" reads as a direct comparison. Scene 10 now starts at
  `Its rotor spins inside` (50.56), the slide back to the road.
- **The `COILS` callout is dropped.** After the slide (50.56 → 51.16), only 1.16 s is left before "coils". One callout,
  `ROTOR`, holds 51.16 → 52.95, and its leader shows the coil ring around the rotor.
- Every other beat, framing and part is unchanged; only the seconds moved.

## The system in one line

**Orange = what the gas engine's oil does** (§ 5 A fluid's work as the system):
- the oil's **circulation**, a path on the engine's cut face: pump → filter → drilled galleries → main and rod bearings →
  cams;
- the **film** along each sliding interface;
- the **drops** flung off the crank and running off the piston underside. Each drop ends at the pool's surface.

The oil at rest is not orange. **System strength** (§ 5) shows how much protection is left:
- full while the oil is fresh;
- on "protective additives" (39.64) the halo goes 25 → 12 % and the dots go to count × 0.4 and speed × 0.5, over 1.5 s;
- on "thinner" (42.24) the core narrows × 0.6 over 1.0 s;
- floors 0.45 and ≥ 2 px, never dashed, and the hue never changes;
- back to full only on the on-screen fresh-oil fill (44.76); the loop ends full;
- with the engine off (the shop) the film stays, and the dots and drops stop.

**Where it is drawn** (§ 5 Where the system is drawn): only inside the gas engine, where the oil really goes.
- The path rides the galleries on the engine's cut face (§ 5 Along a cable or hose: a separate line on the passage).
- The film is an edge line on each sliding interface, at the "made by" edge's car-scale weight.
- Drops fall inside the crankcase and end at the pool.

Nothing orange leaves the engine. One system: every orange mark ends in "the engine's oil protects the metal, and
combustion wears that out".

**Not orange:**
- **The combustion burst.** A physical event (§ 5 Combustion on screen): a 1-frame `screenLight` spark dot, then a flat
  `screenLight` flash clipped to the chamber (0.75 → 0.4 → 0.15 over 3 frames). No bloom, no spill, ≤ 1 a second.
- **The blow-by gas.** `RACE.haze` at ≤ 0.45 opacity, out of the bloom layer, masking the film halo where it crosses.
  It carries soot (`REAL.flex`), water (`HIGHWAY.spray`) and fuel droplets (`REAL.pad`), each ≥ 6 px.
- **The oil at rest.** The pool, the drain and pour streams, the jug: § 3 Liquids, flat, level. `REAL.oilFresh` →
  `REAL.coffee` → `REAL.oilOld`.
- **The EV.** The motor (copper `REAL.copper`, unlit) and its gearbox oil (`oilFresh`, clean). Also the gas car's
  transaxle fluid (`oilFresh`, N5).
- **Everything else:** the ink oil-life gauge, the counter, the callouts, the bars card, the ghost drain pan, the shop.

## The look in one paragraph

**Two cars on one sheet, in two places:**
- **T, the highway twin** (`city-twin`, `road: 'highway'`, Day, mild). Two stacked highway lanes, both cars cruising,
  wheels forward. **Top: the gas car** (generic crossover, `TWINS.gasPaint`, an extra driving), its transverse
  four-cylinder running. **Bottom: the EV** (generic crossover, YOU's car colour, YOU driving), its **rear** drive unit
  turning (N6). Gas on top follows the voice's order (gas first, then EV). It also flips No. 016/017's EV-on-top layout.
- **S, the shop** (new location, N8). A cut-open two-bay service shop drawn as the same twin sheet: the gas car on a lift
  in the top bay, the EV on a lift in the bottom bay, two mechanics (the grey extra and `EXTRA_B`), engines off, lamps off
  (§ 8 parked scope). § 3 The shop: Day rig, no practicals, no new tokens, lifts and pans never in safety colours,
  nothing readable.

The engine and the drive unit are **object cut-aways inside the cars** (§ 3), reached by glides from the whole cars and
back. The near wheel in front of each is ghosted while the camera is in close (No. 016 precedent, `wheelGhost`), and whole
again on the wide framings. **No logos, generic cars;** "Tesla" and "Model 3" are in the voice only (F5).

**On-screen words** (all ink):
- the title block;
- callouts `ROTOR`, `ABOUT 2 LITERS`, `BRAKE FLUID`, `CABIN FILTER`;
- the counter `ABOUT EVERY` / `5,000–10,000` / `miles`;
- the bars card `COST` (`GAS`, `EV`).

No maker name, oil brand, or source text anywhere.

## Locations

| Code | Location | Built with |
|---|---|---|
| **T** | Highway twin, Day, mild: gas crossover top, EV crossover bottom, cruising (≈ 60 mph, wheels forward, lane dashes streaming). No stops, so no brake lamps | `city-twin` (`road: 'highway'`, `top: {variant: 'gas', shape: 'crossover', oilPan: true, engineRun, rpm, exhaust}`, `bottom: {variant: 'ev', shape: 'crossover'}`, `wheelGhost`, `loop: true`) + **N1–N7** |
| **S** | The shop: two bays stacked on one sheet, a lift in each. Gas car top, EV bottom, raised ≈ 1.0 m, wheels whole and still, lamps off. Two mechanics, a drain pan, an oil jug, a tool chest | **new, N8**: built from the teardown room's parts (block, walls, floor, tool chest, the mechanic's rig, `HIGHWAY.galvanized`, `CHARGE.cabinetDark`) |

**Moves:** four slides, T → S (43.12), S → T (50.56), T → S (66.48), S → T (82.87). The closest pair is 7.44 s apart
(≥ 3 s, § 8). Every framing change inside a location is a glide.

**§ 3 Re-dressing:** `city-twin` was last used in No. 017 (not in No. 019 or No. 020). `car-slice` (No. 020) is not used.
The shop is new, which meets "at least one location neither of the last two videos used". The twin still changes all three
things anyway:
- the dressing: the highway, mild Day, gas on top;
- the system: engine oil, new on any twin;
- the framings: all new (below).

## Title block

Line 1, as spoken: `Why does only the gas car` / `need engine oil changes?` (25 / 24 characters). Line 2:
`NO. 021 · THE OIL PAN · 2:10 PM`. Up from frame 0. It fades at **10.80 s** (0.8 s after "changes?" ends at 10.00), over 10
frames. It stays up over scene 3's glide into the engine (10.14), as in No. 019 F2. The block is 2D and still.

## Framings (names for the spec, values for the scene-builder)

All at the fixed angle. Set the values on stills. "Gas" is the top car, "EV" the bottom car.

| Name | Location | What's in it | Start from |
|---|---|---|---|
| `twinBays` | T | **Frame 0 and the loop.** The gas car's engine bay (head, cylinder, crank, sump, transaxle) upper left, the EV's rear drive unit (motor, closed gearbox) lower right. Both cars' near wheels whole and turning; title block clear of the gas bay (bay top ≥ y 450) | No. 016 `bays` (12.5), widened for the rear unit, ≈ 13–14 |
| `evUnit` | T | The EV's rear drive unit whole: the motor, the gearbox, the half-shaft; the near rear wheel ghosted | ≈ 3.5 |
| `engine` | T | The gas engine whole, cam cover to the sump floor, the transaxle edge, the ink gauge's spot beside the sump; near front wheel ghosted | GAS `bay` (6.5) → ≈ 2.4 |
| `cylinder` | T | The combustion chamber, valves, plug, the piston and its three rings, the wall: the ring gap readable (🎭 magnified, N2) | ≈ 1.2 |
| `crankcase` | T | The rod big end on the crank, the piston underside and its oil jet, the pool below | ≈ 1.4 |
| `blowby` | T | Close under the piston skirt: the grey haze running down to the pool surface, specks readable (≥ 6 px) | ≈ 0.8 |
| `motor` | T | The EV motor cut: the stator's ring of coils, the rotor turning; room on the left for one callout | EV `motor` (2.2) mirrored for the rear unit |
| `gearbox` | T | The EV gearbox case, then open: the gears, the oil pool, the small pump and filter | ≈ 1.4 |
| `gasLift` | S | The gas car on its lift, top bay: the sump and drain plug under it, the drain pan, the filler at the engine top, both mechanics | ≈ 5 |
| `evLift` | S | The EV on its lift, bottom bay: the rear drive unit (motor, gearbox closed in scene 9, open in scene 13) and the floor under it for the ghost pan | ≈ 5 |
| `evService` | S | The EV whole on its lift: the reservoir under the hood cut, the dash and glovebox cut, both near wheels | ≈ 7 |
| `shop` | S | Both bays and both cars, room at the top for the bars card (x 120, y 330, 696 × 560) | ≈ 18 |

## Line by line

Cues are copied word for word from `script.txt`. All 16 are unique and in order (checked against the real transcript; the
two "An EV motor has" lines no longer collide, because line 13 is now inside scene 9). Merged lines:
- lines 2 and 3 (scene 2);
- lines 4 and 5 (scene 3);
- lines 9 and 10 (scene 7);
- lines 12 and 13 (scene 9);
- lines 15 and 16 (scene 11).

"In-scene glide" means a `cameraKeys` glide inside one spec scene. The engine is 🎭 slowed (`CRANK_SCALE`), so each power
stroke reads, about one firing every 1.2 s on the close framings. The road keeps its real speed.

| Sc | Cue · in (s) · len | Line | What's on screen | Motion / events (s, on the word) | Overlay | Transition in |
|---|---|---|---|---|---|---|
| 1 | `A gas car's engine` · 0.00 · 4.40 | A gas car's engine and transmission have hundreds of moving parts. | **Frame 0, T `twinBays`.** Both cars cruising, wheels forward. Gas: the four-cylinder running, every part moving: piston, rod, crank, cams, valves, chain, the transaxle's gears (N5). The orange oil film lights the sliding parts at full strength, and runner dots circulate. EV: the rotor turning, the gearbox case closed. Nothing orange on the EV | 0.0 slow push (0.04) · 1.52 "transmission" the transaxle shifts a pair (0.2 s, `gearShiftAt` look) · 2.52 "hundreds" a dot pass runs the full oil circuit, pump to cams · 3.4 a grey exhaust puff from the gas tailpipe | **Title block** 0 → 10.80 | — (frame 0) |
| 2 | `An EV motor has about` · 4.40 · 5.74 | An EV motor has about one. Why does only the gas car need engine oil changes? | T: glide to `evUnit` (0.8 s), then an **in-scene glide** back to `twinBays` at `Why does only` (6.80) | 4.40 glide; the EV's near rear wheel ghosts out (0.5 s) · 4.88 "motor" the rotor alone turns inside the still stator · 6.08 "one" YOU's hands shift on the wheel (seen through the cut cabin edge) · 6.80 glide (0.8 s), the wheel back to whole · 7.84 "gas car" the gas engine's film surges once (halo to 45 %, 0.4 s, § 5 surge) · 8.92 "oil" a dot pass down the galleries into the sump | Title block | continue |
| 3 | `A big part of` · 10.14 · 6.62 | A big part of the answer is combustion. The fuel burning inside the engine slowly wears out its oil. | T: glide into `engine` (0.9 s), the gas car's near front wheel ghosted (0.5 s) | 10.14 glide · 10.80 title fades · **11.60 "combustion"** the first firing on screen: the plug's spark, a 1-frame spark dot, then the **flat `screenLight` flash** clipped to the chamber (0.75 → 0.4 → 0.15 over 3 frames), the piston driven down; firing repeats every ≈ 1.2 s from here (≤ 1 a second) · 13.24 "burning" a firing · 15.04 "wears out" a drop falls off the crank into the pool, which darkens one faint step (the first hint) · 15.7 a firing · 16.2 the drop's ripple settles | Title block to 10.80 | continue |
| 4 | `Inside the engine alone` · 16.76 · 5.24 | Inside the engine alone, dozens of metal parts slide and spin against each other. | T `engine`, slow push | 16.9 a firing · **18.08 "dozens"** the film surges part by part in a seeded wave across every sliding pair (main and rod bearings, piston skirt and rings, wrist pin, cam lobes and followers, valve stems, chain), 0.08 s apart · 19.36 "slide" the piston stroke · 20.24 "spin" the crank's journals surge · 21.0 a firing | — | continue |
| 5 | `Oil keeps that metal` · 22.00 · 3.44 | Oil keeps that metal from rubbing and carries the heat away. | T: glide to `crankcase` (0.8 s) | 22.76 "metal" the rod bearing: the orange film between journal and shell, 🎭 magnified so the gap reads (≥ 8 px, F8) · 23.20 "rubbing" the journal turns on it, metal never touching · **23.92 "carries"** the oil jet squirts onto the piston underside, and orange drops run off it and end at the pool surface, dots riding the drain · 24.40 "heat" more drops · 25.0 a firing (the flash at the frame top) | — | continue |
| 6 | `Each time the fuel` · 25.44 · 5.68 | Each time the fuel burns, a little hot gas leaks past the piston and down into the oil. | T: glide up to `cylinder` (0.8 s); **in-scene glide** down to `crankcase` at `down into the` (29.60), following the gas | **26.48 "burns"** a firing · **27.48 "hot gas"** a thin grey haze (`RACE.haze`, ≤ 0.45, the film halo masked under it) squeezes through the ring end gap between piston and wall (🎭 magnified, ≥ 10 px) · 28.16 "leaks past" it slides down past the skirt as the piston falls · 28.7 the next firing, a smaller wisp · 29.60 glide (0.8 s) · 30.32 "oil" the haze reaches the pool and spreads over its surface | — | continue |
| 7 | `That gas is dirty.` · 31.12 · 6.08 | That gas is dirty. It carries soot, water, acid and bits of unburned fuel. | T: glide to `blowby` (0.7 s): the haze's path from the skirt to the pool | 31.12 glide · 32.36 "dirty" the haze thickens a shade · **33.36 "soot"** black specks (`REAL.flex`, ≥ 6 px) appear in it · **33.92 "water"** small pale droplets (`HIGHWAY.spray`) · 34.64 "acid" no picture of its own (F2); the haze's next wisp arrives · **35.76 "unburned fuel"** fuel droplets (`REAL.pad`) · 36.5 each kind drifts down and sinks into the pool, which darkens a step | — (F2: no list callout) | continue |
| 8 | `Over time, the acid` · 37.20 · 5.92 | Over time, the acid uses up the oil's protective additives, and the fuel makes the oil thinner. | T: glide out to `engine` (0.9 s) | 37.68 "time" the **ink oil-life gauge** draws on beside the sump (§ 3 In-set ink gauge, range-gauge look, no digits, 🎭), full, and starts stepping down a tick every ≈ 0.8 s · 38.16 "acid" the pool darkens to `REAL.coffee` · **39.64 "protective additives"** the orange **dims** (§ 5 System strength): halo 25 → 12 %, dots × 0.4 and slower × 0.5, over 1.5 s; the hue stays · 41.12 "fuel" the pool goes to `REAL.oilOld`; drops fall off the crank faster · **42.24 "thinner"** the core narrows × 0.6 over 1.0 s (≥ 2 px); the gauge reaches its low tick | — | continue |
| 9 | `That's why many gas` · 43.12 · 7.44 | That's why many gas cars need fresh oil about every five to ten thousand miles. An EV motor has no combustion. | **S `gasLift`**: the same gas car on the lift, engine off (film static at strength 0.45, no dots), the gauge low, the pool `REAL.oilOld`. **In-scene glide** down to `evLift` at `An EV motor has no` (48.00): the EV parked on its lift in the bay below, its rear motor cut open and still, the gearbox case closed | 43.12 slide · 43.7 mechanic A pulls the drain plug: an `oilOld` stream falls into the drain pan (1.0 s) · 44.52 "need" the stream stops, plug back in (0.3 s) · **44.76 "fresh oil"** mechanic B pours `oilFresh` from a plain grey jug (`CHARGE.cabinet`) into the filler; the pool refills from the bottom (1.2 s); the film returns to full strength with it (the only restore, § 5); the gauge refills to full (45.72) · **46.04 "five to ten thousand"** counter lands · 47.2 the gauge fades out (0.5 s) · 48.00 glide (0.8 s) · 49.0 mechanic A walks into the EV's bay · **49.56 "combustion"** no cylinder, no plug, no flash: the motor's cut face sits plain; mechanic A glances up at it | **Counter** sub `ABOUT EVERY`, `5,000–10,000`, unit `miles`, lands whole (§ 6 range), 46.04 → 47.95 (out before the glide) | slide |
| 10 | `Its rotor spins inside` · 50.56 · 4.88 | Its rotor spins inside a ring of coils, and there's no engine oil to change. | **T `motor`**: the EV's rear motor cut open on the road, the rotor turning, the near rear wheel ghosted. **In-scene glide** to `twinBays` at `and there's no` (53.12) | 50.56 slide · 51.12 "spins" the rotor turning (the same speed key as scene 2) · 51.16 callout in · 51.92 "ring of coils" the leader runs past the stator's coil ring to the rotor · 53.12 glide (0.8 s), the wheel whole again: the gas car's orange oil (fresh, full) above, the EV with no sump below · 53.76 "engine oil" the gas film surges once (0.4 s) · 54.88 "change" a gas firing | **Callout** `ROTOR` 51.16 → 52.95 | slide |
| 11 | `Even so, an EV` · 55.44 · 6.80 | Even so, an EV does have oil. A Tesla Model 3's rear gearbox holds about two liters. | T: glide to `gearbox` (0.8 s), the case closed | 55.44 glide, the near rear wheel ghosts out · **57.04 "does have"** the gearbox case's front lifts off (`gearboxOpen`, 0.5 s): the gears turning, dipping into a clean `oilFresh` pool, the small pump and filter · 57.60 "oil" the teeth come up wet and glinting (material, not orange) · 59.92 "gearbox" the pump's outlet drips onto the gears · 61.12 "two liters" callout, leader to the pool | **Callout** `ABOUT 2 LITERS` 61.12 → 62.1 | continue |
| 12 | `That oil coats spinning` · 62.24 · 4.24 | That oil coats spinning gears, but nothing burns anywhere near them. | T `gearbox`, push; **in-scene glide** out to `evUnit` at `nothing burns` (64.60) | 62.80 "coats" the oil sheets over each tooth as it rises · 63.52 "gears" a splash off the big gear falls back to the pool · 64.60 glide (0.8 s): the motor beside the gearbox, cool and quiet, no flame anywhere · 65.20 "anywhere" the rotor turns, the pool steady and clean · 65.9 YOU's head turns to the lane (cabin edge) | — | continue |
| 13 | `Tesla's maintenance schedule doesn't` · 66.48 · 3.52 | Tesla's maintenance schedule doesn't list a change for that oil. | **S `evLift`**: the EV on its lift, gearbox open now (clean oil, as in T) | 66.48 slide · 67.1 mechanic A walks into the bay, wiping his hands · **67.88 "doesn't list"** a **ghost drain pan** draws on under the gearbox's drain plug (dashed, 0.8 s, ≥ 120 px wide, § 3 Ghost outline "an absent job") · 68.7 mechanic A glances at it and walks on, staying ≥ 0.3 m from it · 69.2 the ghost fades (0.7 s, gone by 69.9) | — | slide |
| 14 | `In fairness, that same` · 70.00 · 6.16 | In fairness, that same schedule still lists brake fluid checks, cabin filters and tire rotations. | S: glide to `evService` (0.9 s) | 70.00 glide; the lift lowers the EV to working height (1.2 s) · 71.5 mechanic A steps to the front · **72.56 "brake fluid"** mechanic A unscrews the reservoir cap (under the hood cut) and looks in · **73.68 "cabin filters"** the cabin filter slides out of the cut dash behind the glovebox and back (0.5 s each way) · **74.76 "tire rotations"** two ink curve arrows (`InkArrowAlong`) draw between the near front and rear tires, one each way; mechanic B kneels at the front wheel | **Callout** `BRAKE FLUID` 72.56 → 73.35 · **Callout** `CABIN FILTER` 73.68 → 74.55 (F11) | continue |
| 15 | `Counting those, one consumer` · 76.16 · 6.71 | Counting those, one consumer study found EVs cost about half as much as gas cars to maintain and repair. | S: glide out to `shop` (0.9 s): both bays, both cars | 76.16 glide; the ink arrows fade · 76.6 mechanic B stands up · 76.72 card in · 77.76 "study" the GAS bar grows (reference) · **78.48 "EVs"** the EV bar grows to 0.5 · 79.68 "half" bar label `ABOUT HALF` · 80.3 mechanic A lowers the gas car's lift · 81.2 mechanic B wipes the EV's wheel · 82.5 card out | **Bars card** (§ 6 bars mode, no orange): tab `COST`, one row `MAINTENANCE + REPAIR`, `GAS` reference (hatched) 1.0, `EV` solid 0.5, label `ABOUT HALF`; no footnote; 76.72 → 82.5 | continue |
| 16 | `How many miles do` · 82.87 · 3.99 (incl. 1.5 tail) | How many miles do you go between oil changes? | **T**, a little wider than frame 0; the **slow push lands on frame 0's `twinBays`** at the last frame | 82.87 slide · 83.4 the EV gearbox's front settles back on (0.5 s) · 83.92 "go" a dot pass round the gas oil circuit · 84.52 "oil changes" a firing (flash, small at this distance) · 85.36 voice ends, captions end · **86.83 last frame (2605) = frame 0** | — (captions end) | slide |

### Gaps (longest stretch with no listed event)

Every scene has a meaningful change at least every ≈ 2 s. The running engine (piston, crank, cams) and the turning rotor
are mechanisms animating (§ 8 motion rule 0). The firings come every ≈ 1.2 s on every gas framing. The longest stretches:
- scene 1, 0.0 → 1.52 (the engine runs and the push carries it);
- scene 11, 57.60 → 59.92 (2.3 s; the gears turn and drip, and the push runs; add a splash at 58.8 if the motion check fails);
- scene 16, 84.52 → 86.83 (the loop's push into frame 0; the engine runs).

### Scene lengths

Spec scenes run **3.44 to 7.44 s**.
- **Long:** 9 (7.44: the oil change, then an in-scene glide to the EV's bay), 11 (6.80: the case opening, then the
  callout), 15 (6.71: the bars card), 3 (6.62: a glide and the first firing).
- **Short:** 5 (3.44), 13 (3.52).
- **Splitting 11:** possible at `A Tesla Model 3's` (58.45), which gives 3.01 + 3.79 s. Not recommended: a 3.01 s scene is at
  the floor, and the picture doesn't change at that word.

## Lines that are hard to show

- **F1 · Combustion: ruled** (§ 5 Combustion on screen). A 1-frame spark dot, then the flat `screenLight` flash clipped to
  the chamber (0.75 → 0.4 → 0.15 over 3 frames). No bloom, no spill, no ink rings. **≤ 1 firing a second:** the scene
  rows space them ≈ 1.2 s apart, and the closest pair (25.0 → 26.48) is 1.48 s.
- **F2 · "acid": ruled.** No picture of its own. Soot, water and fuel appear on their words, and acid gets only the next
  wisp. No list callout.
- **F3 · Tokens: ruled.**
  - The oil: `REAL.oilFresh` `#8c7235` → `REAL.coffee` → `REAL.oilOld` `#1e1815`.
  - Particles: soot `REAL.flex`, water `HIGHWAY.spray`, fuel `REAL.pad`, each ≥ 6 px.
  - The EV gearbox oil and the transaxle fluid stay `oilFresh`.
  - Check fresh amber beside the orange film on stills; the fallback fresh is `#877a45`.
- **F4 · "hundreds of moving parts".** No number on screen (the voice says "hundreds" with no figure). The frame sells it by
  everything moving at once in the gas bay, with the transaxle cut open (N5). If N5 isn't built, the transaxle stays a closed
  case, and the engine's valvetrain and chain carry "many".
- **F5 · Generic EV vs the named Model 3: decided (owner).** The EV stays generic; "Model 3" is in the voice only. Draft 1's note, kept for the record: The brief says generic
  cars, with Tesla named only in the voice. Style guide § 3 Real car models (v0.15) says a car the voice names as the
  story's product is drawn to resemble the real model. Here the voice names the Model 3 as one example of an EV's gearbox
  (line 16), and the story isn't about Tesla's product. **This draft follows the brief:** the EV is the generic crossover.
  Line 16 is framed on the gearbox (`gearbox`), where the body's shape doesn't read. Recommendation was to keep it
  generic, and the owner agreed. The post says "the cars are generic".
- **F6 · "rear gearbox".** The built EV drive unit sits at the **front** axle. N6 moves the bottom twin's unit to the rear
  (`RearDriveUnit` alone), so "rear" matches the picture. **Fallback:** the front unit, which means the voice says "rear"
  over a front gearbox. Not recommended.
- **F7 · System and strength: ruled** (§ 5 A fluid's work as the system; § 5 System strength). Values are in "The
  system in one line" and scene 8.
- **F8 · Magnifications: ruled, 🎭 illustrative.** The film gap is ≥ 8 px at `crankcase`, the ring end gap ≥ 10 px at
  `cylinder`. Both are built once in the geometry, never as an orange fill. The engine is slowed. Disclosed.
- **F9 · The shop: ruled** (§ 3 The shop), a new location for No. 021. Line 20 stays a bars card with no Lab visit. Open
  for the owner, with no effect on this video: whether the shop becomes a recurring location.
- **F10 · Ghost drain pan: ruled** (§ 3 Ghost outline, "an absent job").
  - Only on line 18, ≥ 120 px wide.
  - Mechanic A glances at it and stays ≥ 0.3 m from it; nobody walks through it.
  - Fallback: the glance and walk-on alone.
- **F11 · Three items in 2.2 s (line 19).** "brake fluid checks" 72.56, "cabin filters" 73.68, "tire rotations" 74.76. The
  callouts hold ≈ 0.8 s each, one at a time. Tires get ink arrows only (no third callout, since there's no room to leave
  and enter). If the callouts flash in Studio, drop them: the parts' actions and the captions carry the line.
- **F12 · Line 12's oil change in 4.88 s** (43.12 → 48.00; the glide to the EV comes after it). The slide, drain, fill and counter are tight. Two mechanics share the work (one
  drains under the car, one pours from the top). The steps overlap less than in life (🎭).
- **F13 · "Each time the fuel burns" (fact-checker note).** In life, blow-by is continuous. The picture shows a wisp per
  firing, which illustrates the line as approved.
- **F14 · "Over time" (line 11).** The car keeps cruising at the same speed (wheels capped). The ink gauge's steps and the
  pool's darkening carry the time. No time-passes beat; the mood is unchanged.
- **F15 · The question lands at 6.80 → 10.00 s.** That is past the § 8 target (≈ 5–6 s) because the hook runs two lines. The
  title block carries the question from frame 0. The script is approved, so this is noted only.
- **F16 · Length 86.86 s.** Over 60 s, so our own music or none.

**Script fixes:** none needed. Only if N6's rear unit isn't built would dropping "rear" from line 16 remove the F6
dependency; otherwise keep the approved wording.

## Reused vs new

**Reused as they are:**
- `city-twin`: `road: 'highway'`, `top` / `bottom` as any `SlicedCar` options, `loop`, `wheelGhost`, `cameraKeys`, Day mild;
- `SlicedCar` 'gas' 'i4': `EngineBay` piston, rod, crank, cams, `engineRun`, `rpm`, `exhaust`, and `oilPan` (No. 016, the
  sump, the oil level in `REAL.coffee`);
- `SlicedCar` 'ev': the `EvDrive` motor (24 copper slots, 8 magnet pairs) and reduction gears, and `RearDriveUnit` (`awd`);
- the in-set ink range gauge (`rangeGauge`, No. 017), anchored at the sump instead of the pack;
- `InkArrowAlong` (No. 016) for the tire-rotation arrows;
- the ghost outline look (`GhostCar`'s dashed line, No. 010);
- the teardown room's block, walls, floor, tool chest and mechanic (No. 011);
- callouts, the counter, the bars card, title block, slides and glides.

**Not used:** statement cards, name tags, place labels, the X-ray, detail boxes, The Lab, `car-slice` (No. 020's location).

## Missing scenes and parts (scene-builder)

Values from style guide v0.18.18 (§ 1 oil tokens, § 3 The shop, § 3 Ghost outline, § 5 A fluid's work as the system, § 5
System strength, § 5 Combustion on screen).

- **N1 · The engine's oil system** on the 'gas' 'i4' (`SlicedCar` `oilSystem`), drawn on the engine's section plane.
  - **Parts (neutral metal):** in the sump, the oil pump and its pickup; the filter on the block's side; the drilled
    galleries on the cut face (main gallery → main bearings → the crank's drilling to the rod bearing; a riser to the head
    and cams); bearing shells; the wrist pin; three piston rings with a ring end gap; an oil jet under the piston.
  - **The system (orange)**, what the oil does:
    - the circulation path riding the galleries (core car-scale × camD/12, halo 25 %, summed ≤ 25 %) with runner dots;
    - the film, an edge line along each sliding interface (the "made by" edge's weight; the parts keep their metal);
    - drops flung from the crank and running off the piston underside, **ending at the pool's surface**.
  - **Never orange:** the pool, the streams, the jug.
  - **Magnified once in the geometry (🎭):** the film gap ≥ 8 px at `crankcase`, the ring end gap ≥ 10 px at `cylinder`.
    Never a solid orange fill.
  - **`strength`** (§ 5 System strength): two channels, so the two words land apart.
    - `protect` (additives): halo 25 → 12 %, dots count × 0.4 and speed × 0.5, eased over 1.5 s (key at 39.64);
    - `body` (thinning): core × 0.6, eased over 1.0 s (key at 42.24);
    - floors 0.45 and ≥ 2 px core on screen, never dashed, the hue fixed;
    - `restoreAt`: both channels back to full with the fill (44.76, over the pour's 1.2 s); no other restore.
  - **Other keys:** `waveAt` (the film's part-by-part surge, 0.08 s apart), `surgeAt[]` (halo to 45 %, 0.4 s), `passAt[]`
    (one bright dot pass round the circuit), `jetAt`, `dripRate` (Keyed).
  - **Engine off:** no dots, no drops; the film static at its strength.
- **N2 · Combustion and blow-by** (`combustion`, `blowBy`, `specks`).
  - **A firing** on the cut cylinder's power stroke (keys or `every`, **never more than 1 a second on screen**): a
    1-frame `screenLight` spark dot at the plug, then a flat `screenLight` flash clipped to the chamber, opacity 0.75 →
    0.4 → 0.15 over 3 frames. No bloom, no spill, no ink rings.
  - **`blowBy: {at, until, size}`:** per firing a `RACE.haze` wisp (≤ 0.45 opacity, out of the bloom layer) squeezes
    through the ring end gap, runs down the skirt into the crankcase and spreads on the pool's surface (fades 1.0 s). It
    masks the film halo where it crosses.
  - **`specks: {soot?, water?, fuel?}`** (s): `REAL.flex`, `HIGHWAY.spray`, `REAL.pad`, each ≥ 6 px at `blowby` with the
    § 5 contrast floors, riding the haze and sinking into the pool. No acid picture.
- **N3 · The oil at rest** (`oilPan` keys; § 3 Liquids: flat, level, an ink line where it meets the shell).
  - `color` keys `oilFresh` → `coffee` → `oilOld` (each step eased 0.6 s);
  - `level` keys (drain to empty, refill from the bottom);
  - the drips' speed from N1's `dripRate`.
  - New theme tokens `REAL.oilFresh` `#8c7235` and `REAL.oilOld` `#1e1815` (§ 1, v0.18.18).
- **N4 · The ink oil-life gauge** at the sump: the No. 017 range gauge with an `at` beside the sump (car frame), `level`,
  `step` and `ticks` keys, refill and fade. Ink, no digits, 🎭.
- **N5 · The transaxle cut-away (optional)**, beside the i4.
  - The case cut on a plane facing the camera; three or four gear pairs on two shafts and the differential, turning with the
    engine; a shift (`gear` keys, 0.2 s).
  - Its fluid a shallow `oilFresh` pool, never darkening, never orange.
  - Fallback: a closed case with the input shaft turning.
- **N6 · The EV's rear drive unit, alone** (`evDrive: 'rear'`): `RearDriveUnit` without the front unit, on the bottom twin
  (generic crossover, F5).
  - `gearboxOpen: {at, closeAt}`: the gear case closed (uncut) until `at`, then its front lifts off (0.5 s, cubic in-out);
    the motor's cut shows from frame 0.
  - Inside: an `oilFresh` pool, the gears dipping and coming up wet (specular sheen), a splash off the big gear, a small
    pump and filter. Nothing orange.
  - The motor's bearings stay grey rings.
- **N7 · T framings and the loop** on `city-twin` with `top: 'gas'`, `bottom: 'ev'` (check the presets, which assume an EV
  or hybrid on top).
  - Framings: `twinBays`, `evUnit`, `engine`, `cylinder`, `crankcase`, `blowby`, `motor`, `gearbox`.
  - Wheel ghost keys: gas FR for the engine framings, EV RR for the unit framings, eased 0.5 s.
  - `loop: true` on the highway: wheels, lane dashes, the crank and the oil dots land on frame 0's state at the last frame
    (2605), strength full; `drift: 0` or phase-locked.
- **N8 · The shop**, a new scene `shop-slice` (or `teardown-slice` `dressing: 'shop'`). Register in `src/scenes/index.ts`
  if new. § 3 The shop:
  - **Sheet:** two bays stacked on one sheet, Day rig, **no practicals**, the fixed angle.
  - **Block:** per bay **8.0 wide × 6.0 deep, walls 3.6 high** (set on stills), in the teardown room's grammar, no floor
    grid.
  - **Tokens (none new):**
    - floor `CHARGE.concrete`, walls `PLUGS.garageWall`;
    - lift posts `HIGHWAY.galvanized`;
    - lift arms, the drain pan and its stand, the tool chest `CHARGE.cabinetDark`;
    - arm pads `REAL.rubber`;
    - the oil jug `CHARGE.cabinet` with a `cabinetDark` cap;
    - no safety orange, yellow or red anywhere.
  - **Cars:** the same cars as T (shape, paint, cut, wheel design, oil state), near wheels whole and still, lamps off,
    raised ≈ 1.0 m. Lift arms under the body, never through a cut face. `lift` keys lower to working height over 1.2 s.
  - **Keys:**
    - `drain` (an `oilOld` stream to the pan) and `pour` (an `oilFresh` stream into the filler), driving N3 and N1's
      `restoreAt`;
    - `cap` (the EV's brake-fluid reservoir cap under the hood cut);
    - `filter` (the cabin filter slides out of the cut dash and back, 0.5 s each way);
    - `rotateArrows` (`InkArrowAlong` between the near tires);
    - `ghostPan`: a dashed drain pan under the EV gearbox's plug, ≥ 120 px wide on screen at `evLift`, draws on 0.8 s,
      fades 0.7 s.
  - **Mechanics:** the grey extra and `EXTRA_B`, never tagged. Actions: walk, pull the plug, pour, wipe hands, unscrew a
    cap, kneel at a wheel, stand, lower a lift. Mechanic A's path at 66.48–69.9 keeps ≥ 0.3 m from the ghost pan.
  - **Framings:** `gasLift`, `evLift`, `evService`, `shop`.
  - **Nothing readable:** no shop name, sign, poster, oil brand, price board, label, maker plate or capacity sticker.

## The loop seam plan

1. **Frame 0 (scene 1):** T `twinBays`, Day, 2:10 PM. Both cruising. The gas oil fresh and the film at full strength. The EV
   gearbox closed. No gauge. Title block up, slow push.
2. **Last shot (scene 16):** a slide into T a little wider. The EV gearbox closes by 83.9. The push lands on `twinBays` at
   the last frame (2605, 86.83 s).
3. **Continuity:** the gas oil was renewed in the shop (scene 9), so it is fresh again at the loop, as at frame 0. The
   gauge is gone by 47.7.
4. **Phase-locked:** wheels, lane dashes, the crank (modulo a cam turn), the rotor (modulo its magnet pitch), the oil's
   dots (modulo the circuit), the push and drift.
5. **Words:** the voice ends at 85.36; captions are gone for the last 1.5 s. "…between oil changes?" hands over to "A gas
   car's engine and transmission…".
6. **Check:** `yarn stills ev-oil --frames=0,2605`, compare, then the motion in Studio.

## For the publisher's 🎭 "Illustrative:" line

The cars, the shop and the mechanics (generic; the EV isn't drawn as a Tesla). The engine slowed down. The oil film and
ring gap magnified. The colour of the oil and its particles, the combustion flash, and the oil-life gauge. The orange marks showing the oil's
work. The oil change sped up.

## Sound (note only, for later)

Physical sounds only:
- a highway cruise bed (`sfx:cruise day`) with the gas car's four-cylinder audible on its framings (`sfx:engine`) and the EV
  near silent (a faint motor whine on `motor` / `gearbox`);
- no sound for the flash itself (the engine's running note carries it);
- in the shop: a room bed, the drain plug's clink, the oil stream into the pan, the pour, a cap unscrewing, the filter
  sliding, the lift's hydraulic hum;
- a soft whoosh on each of the four slides.

No sound for orange, the gauge, cards or the counter. Over 60 s, so our own music.
