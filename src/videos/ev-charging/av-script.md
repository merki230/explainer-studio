# No. 010 · EV charging: audio + visual script

## Final decisions (2026-10-27)

- **D1 (owner):** title line 1 is **`Why does EV charging take so long?`**. Line 2: `NO. 010 · THE CHARGING STATION · 1:20 PM`.
- **D2 = (a) (owner):** the living-room cord corner (`section-room`, `cast: [null, null]`, `camera: 'cord'`, `corner`).
- **D3 = (a) (owner):** both taper curves in the chart. The Tesla's draws first, then the BYD's (thinner, higher, shorter, and falling too).
- **D4 = (a) (owner):** the `CHINA` place label, then the US twin with the ghost, the `THE US` label and the callout.
- **D5 (brand-director, style guide v0.13 § 6):** car tags with roof leaders, the square in the car's paint with a
  2 px ink outline. Both tags on the left at x 120, 120 px above each roof (at least 60 px), never above y 470, in at
  0.3 s and out by 3.8 s. **Not in the spec yet:** `NameTag` can't follow a charge-slice anchor ('top:top' /
  'top:bottom'), so it's a missing build. The spec has the two tags ready, commented.

_Status note, 2026-10-28: `NameTag` now has an `anchor` prop, so D5's two tags are live in `spec.ts` (the decision
stands; only the "not in the spec yet" note is stale)._

---

# Draft 2: the screen tells its own story (2026-10-28)

The owner rejected the first preview: "the animation seems fixed and boring and people can swipe away; we hear the
narrator, but the animation is important too." Two parked cars charging is a still picture. This draft replaces draft 1's
picture. The words, the voice (the 74.24 s directed take) and `transcript.json` don't change. Draft 1 is superseded,
except D1–D5 above and the parts carried over below.

## Owner-approved plan (all five)

1. **Drivers who do things.** The BYD pulls in, the driver gets out, plugs in and leans on the car. At 5 minutes the
   BYD driver unplugs and drives off while the Tesla driver waits. A second BYD pulls in, charges and leaves, then a third.
   By the time the Tesla reaches 80 %, three BYDs have come and gone. The Tesla driver walks to the curb, checks the phone
   and sits. All 🎭, disclosed.
2. **Time-lapse feel during the 30 minutes:** shadows swing, clouds move, the clock spins.
3. **The camera never fully stops:** a slow push or drift in every scene, frame 0 included.
4. **The hidden system big and alive:** thick racing pulses in the cable, heat that breathes, cells filling visibly, and the
   cable's cross-section filling the frame in the dive.
5. **The US part:** a Tesla pulls in, plugs in, and the driver settles in to wait. The top bay stays empty, and the ghost
   outline draws in as the "not here" mark.

**Standing rule:** every scene lists a visible event every 2–3 s. Nothing on screen stays still for 3 s.

## What carries over from draft 1

- The three locations and their order: **C** China (the twin section: the BYD-like sedan in the top bay, the Tesla-like
  crossover in the bottom bay), **R** the living-room cord corner (D2), **U** the US station (the top bay empty).
- The one hard cut, at line 4 (the replay). Slides between locations, `continue` inside one.
- **Orange is the system only:** the pulses in the cables and HV leads, the heat, the cells' levels, the cord's glow and
  the chart's curves. Not orange: coolant, port lights (flat `signalGreen`), cabinet screens, the clock, the ghost (ink),
  every card.
- **The pulse scale, one pulse ≈ 250 A (🎭):** Tesla 3 (≈ 625 A), BYD 4 (1,000 A), the what-if 10 (2,500 A, the
  BYD's 1,000 kW at 400 V), the BYD at "up to 1,500 A" 6. Heat ∝ amps² (P2).
- The card budget (one card at a time, never with a tag) and every overlay's words. Only some timings move.
- The line flags (amps accuracy, D3's falling BYD curve, "reportedly", "passenger cars", the BIS wording on the ban).

## What changes

| Draft 1 | Draft 2 |
|---|---|
| Drivers sit unseen in the cars | Two grey extras (never tagged) act out the wait: arrive, plug in, lean, check the phone, walk to the curb, sit, unplug, leave. Extras' slate clothes with different skin and hair, so they read as two people |
| Frame 0 is still; the camera holds 1 s | Frame 0 is **mid-motion**: the BYD rolls the last 2 m into its bay, the Tesla's driver has the plug in hand, and the camera is already pushing. It still reads in the first second: both bays and the title block |
| The race is two sets of levels on a clock | The race is **traffic**: the BYD finishes and leaves, two more BYDs cycle through, and the Tesla driver waits on the curb. The counter keeps the numbers |
| Time compression is invisible | **Time-lapse** while the counter runs: the clock spins, shadows swing, clouds drift, and the cars move in fast-forward |
| Thin arrows along the cable | **Thick racing pulses**, with a surge on the key words. Heat **breathes**, the cells **fill visibly**, and the dive goes in until the cable's cut face **fills the frame** |
| Line 5 is one scene (5.9 s, one glide) | Split at `so charging faster`: one glide to the port and pack for the 400 V callout, then a second glide into the cable's cross-section (each scene keeps one glide) |
| U: the crossover already charging | U: **a Tesla reverses in**, its driver plugs in and goes to wait on the curb; the US half ends with a time-lapse to 80 % |
| The loop is a still hold | The loop is **a new BYD arriving**: the last scene ends on frame 0's exact state (BYD 2 m short and rolling, the Tesla driver with the plug, the camera mid-push) |

## Story time

1:20 PM (🎭, title line 2). **Visit 1** runs a time-lapse from 1:20 to 1:50 while the counter races (6.44 → 15.3 s).
**The replay** (visit 2) restarts at 1:20 and runs at near real time, except for line 7's compressed fill. **U** starts at
1:20 and runs a time-lapse to 1:50 in its last scene. **The loop** (C) is back at 1:20, so the last frame matches frame 0,
shadows and clock included. The time-lapse must return exactly to the 1:20 state when it's off.

## Re-timed to the directed take (74.24 s of speech + 1.5 s tail = 75.74 s), 19 scenes

| Scene | Loc | Cue | In → out (s) | Len | Camera |
|---|---|---|---|---|---|
| 1 | C | `In China` | 0.00 → 6.24 | 6.2 | `twin`, a slow push **from frame 0** |
| 2 | C | `BYD says` | 6.24 → 10.36 | 4.1 | `twin`, the push continues (time-lapse on) |
| 3 | C | `A Tesla Model` | 10.36 → 16.08 | 5.7 | `twin`, the push continues (time-lapse) |
| 4 | C, replay | `That gap comes` | 16.08 → 21.16 | 5.1 | **hard cut** to `cables`, slow push |
| 5 | C | `and a Model Y runs` | 21.16 → 24.24 | 3.1 | glide to `teslaCharge` (port, cable, pack), push |
| 6 | C | `so charging faster` | 24.24 → 27.08 | 2.8 | glide **into the cable's cut-away** (`cableClose`), push |
| 7 | C | `More amps means` | 27.08 → 30.32 | 3.2 | push, then a glide back to `teslaCharge` on "battery" |
| 8 | R | `like an extension` | 30.32 → 33.36 | 3.0 | slide to `cord`, push |
| 9 | C | `To protect the` | 33.36 → 37.60 | 4.2 | slide back to `teslaCharge`, push |
| 10 | C | `The BYD gets` | 37.60 → 40.80 | 3.2 | glide out and up to `byd` |
| 11 | C | `so it gets` | 40.80 → 44.32 | 3.5 | `byd`, slow pull |
| 12 | C | `Even so` | 44.32 → 50.00 | 5.7 | `byd`, slow push |
| 13 | C | `That's China` | 50.00 → 51.48 | 1.5 | glide out to `wide` |
| 14 | U | `Here in the` | 51.48 → 55.32 | 3.8 | slide to `twin` (US), slow push |
| 15 | U | `And a federal` | 55.32 → 60.84 | 5.5 | glide to `emptyBay`, push |
| 16 | U | `Our fastest chargers` | 60.84 → 65.04 | 4.2 | crane down to `usCharger`, push |
| 17 | U | `and a Model Y can` | 65.04 → 68.32 | 3.3 | push in to `teslaCharge` |
| 18 | U | `If your charging` | 68.32 → 71.68 | 3.4 | pull out to `wide` (time-lapse) |
| 19 | C | `would BYD's five` | 71.68 → 75.74 | 4.1 | slide in a little wide, glide and push onto `twin`, **arriving still pushing** on frame 0's framing |

Cues are unique searching forward (`and a Model Y runs` / `and a Model Y can`). Scene 6 (2.8 s) and 13 (1.5 s) are short.
Each has its own move and two events, and neither is under `yarn check`'s limit.

## The beat table

Times are video seconds from `transcript.json`. **Bold** = a story event; the "every 2–3 s" column lists the visible
events in order, so the gaps can be checked. The pulses race continuously whenever current flows; they count as motion, not
as an event.

| Sc | Words | Picture | Visible events (every 2–3 s) | Camera | Overlays | Sound (physical) |
|---|---|---|---|---|---|---|
| **1** | In China, some electric cars now claim to charge in about the time of a stop at the gas pump. | **Frame 0, C, 1:20 PM.** The Tesla-like crossover parked in the bottom bay; its driver stands at the cabinet, plug in hand, at the port. The BYD-like sedan reversing into the top bay, 2 m short of its stop, wheels turning. Both packs at 10 %, nothing flowing | 0.0 the BYD rolls in · **0.6 the Tesla's plug latches** · **0.9 the BYD stops**, brake lamps on, off at 1.4 (parked) · **1.4 the BYD's door opens, the driver steps out** and walks to the cabinet (2.0–2.7) · **2.96 "charge": the BYD's plug latches, both contactors close**, thick pulses race in both cables, the port lights go green, the cells start to fill · **3.6 the BYD driver leans on the rear quarter**; the Tesla driver walks back along his car and leans on it · **5.0 the BYD driver takes out his phone** (it faces him, unread) | `twin`, pushing from frame 0 (no hold) | **Title block** 0 → 6.24 (D1). **Tags** `BYD` / `TESLA` (D5), in once the BYD has stopped (≈ 1.0) → 3.8 | Tires rolling on concrete (soft), a brake creak at 0.9, door at 1.4, two plug latches, contactor clunks at 2.96, fans spin up |
| **2** | BYD says five minutes, from ten to seventy percent. | Both cars charging; **the time-lapse starts** | **6.44 the counter enters; the time-lapse begins:** the clock spins from 1:20, clouds drift, shadows start to swing · the BYD's cells race 10 → 70 % · **7.6 "minutes": the Tesla driver checks his phone** · **9.04–9.4 "seventy": the BYD hits 70 %, its contactor opens**, its pulses stop, the BYD row stops at **5** · **9.6 the BYD driver unplugs**, holsters the plug and **gets in (10.0)** | `twin`, push | **Counter** `rows` (from draft 1): `BYD · 70 %` stops at 5, `TESLA · 80 %` runs on | Contactor open at 9.4; plug out, door |
| **3** | A Tesla Model Y charging next to it would take about half an hour, from ten to eighty percent. | The time-lapse runs on. **The Tesla charges while BYDs come and go** | **10.4 BYD 1 drives out** (forward, wheels forward), gone by 11.2 · **10.7 the Tesla driver walks to the curb**, **sits at 11.5**, phone out · **11.2 BYD 2 reverses in**, stops 11.8 (brake lamps), its driver plugs in at 12.0, pulses race and the cells jump 10 → 70, **13.0 unplug, 13.3 out** · **13.4 BYD 3 in**, plugged 13.9, **14.7 unplug, 15.0 out**, gone by 15.6 · the Tesla's cells slow from ≈ 50 % and its pulses thin 3 → 1 (the taper, previewed) · **14.88 "eighty": the Tesla reaches 80 %; 15.3 its contactor opens**, the TESLA row stops at **30**, the clock reads 1:50 · **15.4 the Tesla driver stands up** | `twin`, push (the end of the visit) | Counter (carried) | Fast-forward tires, doors and latches, ducked and short; contactor at 15.3 |
| **4** | That gap comes down to amps. / Power is volts times amps, | **The replay.** Hard cut to both rear halves stacked (cabinets, cut-away cables, ports, the packs' rear modules), back at 1:20 and 10 % | **16.08 the cut: both drivers' hands leave the latched plugs; the contactors clunk, the pulses launch** (BYD 4, Tesla 3) · **17.36 "amps": both pulse trains surge** (brighten and swell once) · **18.0 the Tesla driver walks off toward the curb**; the BYD driver leans · **19.04 the statement covers the frame** · **20.12 "times amps": a second surge** | Hard cut in, slow push | Counter (carried) until 17.26 · **Statement** `Volts × amps.` 19.04 → 21.16 | Contactor clunks; the pump hum starts |
| **5** | and a Model Y runs on about 400 volts, | The crossover's port, cable cut-away and the rear of its pack | **21.16 glide in** (the visit's dive begins) and land at 22.0 · cells visibly filling, heat breathing faintly · **22.6 the callout lands** on the pack | Glide 21.16 → 22.0, then push | **Callout** `400 VOLTS` / `Model Y`, 22.6 → 24.2 | Pump hum |
| **6** | so charging faster means more amps. | **The cable's cross-section fills the frame:** copper conductors, two coolant tubes, the jacket, the hatched cut faces | **24.24 glide into the cut-away** (lands 25.0) · **24.92 "faster": the pulses multiply 3 → 10** and race faster, crowding the conductor (full by 26.28 "more amps") · **26.0 the coolant dashes speed up** · **26.4 the conductors begin to warm** | Glide 24.24 → 25.0 (the end of the dive), push | Captions | Pump hum a step up |
| **7** | More amps means more heat in the cable and the battery, | As 6, 10 pulses; then the pack comes back into frame | **28.44 "heat": the conductors glow and breathe** · **28.88 "cable": the glow runs the cable's length** · **28.9 glide back out** to the port and pack (lands 29.6) · **29.76 "battery": the cells' cut faces glow and breathe** | Push, then glide 28.9 → 29.6 | Captions | Pump works harder from "heat" |
| **8** | like an extension cord with a space heater plugged in. | **R:** the cord corner (outlet, thin cord with a cut-away, space heater; no visible element) | **30.32 the slide** (lands 30.9) · **31.9 the heater switches on** (flat pilot lamp, fan) · **32.3 "plugged in": the cord's conductor glows** orange, thin · **33.0 its glow breathes** | Slide in, push | Captions | Heater click, its fan |
| **9** | To protect the battery, the Tesla also slows down as it fills. | Back at the Tesla's port and pack, back to its **real** draw | **33.36 the slide; the pulses drop 10 → 3** and the heat fades to faint within 0.5 s · **33.6 the chart enters; the cells fill fast** (compressed) · **35.6 "slows down": the pulses thin 3 → 1 and slow their race**; the Tesla's curve lands · **35.8 the BYD's curve draws** (D3) · **36.84 "fills": the cells' rise has visibly slowed** | Slide in, push | **Chart card** (draft 1's: TESLA, then BYD falling too) | Pump hum |
| **10** | The BYD gets around that with about a thousand volts, | The top bay's charging side: cabinet, cable cut-away, port, pack, **and the BYD driver leaning on the car**, phone in hand | **37.6 glide out and up** (the pull-out begins; lands 38.6) · 4 thick pulses racing, cool · **38.8 the driver scrolls, then glances up at the cabinet (40.2)** · **39.4 the callout lands** | Glide 37.6 → 38.6, push | **Callout** `1,000 VOLTS` / `BYD`, 39.4 → 40.75 | The top cabinet's fan |
| **11** | so it gets the same power with less than half the amps. | As 10 | **41.1 the counter enters** · **42.44 the 1,000 V row stops at 1,000** · **43.28 the 400 V row stops at 2,500** · the BYD's cells fill visibly throughout; **43.8 the driver shifts his weight** | `byd`, slow pull | **Counter** `rows` `AT 1,000 V` / `AT 400 V`, `SAME POWER` (draft 1) | — |
| **12** | Even so, BYD's chargers reportedly push up to fifteen hundred amps. | As 11 | **44.6 the driver pockets the phone and straightens** · **46.9 the counter enters** · **47.0 "push up": the pulses grow 4 → 6** and race faster; the heat breathes stronger; the coolant runs faster · **48.64 the counter lands on 1,500** · **49.3 the BYD reaches 70 %, its contactor opens**, the pulses stop · **49.6 the driver reaches for the plug** | `byd`, slow push | **Counter** `UP TO` 1,000 → **1,500 A** | Pump a step up at 47.0; contactor at 49.3 |
| **13** | That's China, though. | The station wide: both bays; the Tesla still charging, its driver on the curb | **50.0 the glide out; the BYD driver unplugs and gets in** · **50.48 the label lands** · **50.9 the BYD pulls out of its bay** (forward, wheels forward), mid-exit at the slide | Glide out 50.0 → 50.8, then pull | **Place label** `CHINA` | Door, tires |
| **14** | Here in the US, BYD doesn't sell its passenger cars. | **U, 1:20:** the top bay empty (cable holstered); **a Tesla reversing into the bottom bay** | **51.48 the slide; the Tesla reverses in**, stops at 52.3 (brake lamps, off at 52.8) · **51.84 the label lands** · **52.56 "BYD doesn't sell": the BYD's ghost draws** into the empty bay (0.8 s) · **53.0 the Tesla driver steps out**, walks to the post · **54.4 he plugs in**, the contactor closes, 3 pulses start, the port light goes green | Slide in, slow push | **Place label** `THE US` → 54.2 | Tires, brake, door, latch, contactor |
| **15** | And a federal rule bans their connected-car software starting with 2027 models. | The empty bay and the ghost; the bottom bay's curb along the frame's lower edge | **55.32 the glide** (U's dive; lands 56.1) · **57.0 the callout's leader draws to the ghost's roof** · **57.5 the Tesla driver crosses the lower edge to the curb and sits (58.6)**, if the curb is in frame (else he leans on the car, in the bottom bay) · **59.9 the ghost fades** (→ 60.6) | Glide 55.32 → 56.1, push | **Callout** `CONNECTED-CAR SOFTWARE` / `Banned from 2027 models`, 57.0 → 60.0 | — |
| **16** | Our fastest chargers top out around 400 kilowatts for most cars, | The crossover's charger post and cable cut-away; the driver on the curb at the edge | **60.84 the crane down** (lands 61.6) · thick pulses racing in the US cable · **61.8 the counter enters** · **62.84 it lands on 400** · **63.6 the driver on the curb checks his phone** | Crane 60.84 → 61.6, push | **Counter** `UP TO ABOUT` **400 kW** | US post fan |
| **17** | and a Model Y can use only 250. | The crossover's port, cable and pack | **65.04 the push in** (U's dive ends, lands 65.8) · **65.3 the counter rolls**, **66.8 it lands on 250** · cells fill visibly; the heat breathes faintly · **67.6 the pulses' pace settles** (holding at 3: the car's limit, not the charger's) | Push 65.04 → 65.8, then slow push | **Counter** `MODEL Y MAX` **250 kW** | — |
| **18** | If your charging stops already take about half an hour, | The US station wide: the empty bay, the Tesla charging, its driver on the curb. **Time-lapse** | **68.32 the pull-out** (lands 69.5) · **68.6 the time-lapse starts:** the clock spins 1:20 → 1:50, shadows swing, clouds drift · **69.5 the driver glances at his car**, back to the phone · **70.64 "half an hour": the Tesla reaches 80 %; its contactor opens at 71.0** · **71.2 the driver stands up** | Pull-out 68.32 → 69.5, then slow pull | Captions | Contactor at 71.0 |
| **19** | would BYD's five minutes change much? | **C, 1:20 again:** the Tesla parked in the bottom bay, nothing flowing | **71.68 the slide** (lands 72.3) · **72.3 the Tesla driver walks from his door to the cabinet**, lifts the plug (74.5) · **73.2 "five minutes": a BYD reverses into the top bay from off-frame** and slows · **75.74 (last frame) = frame 0:** the BYD 2 m short and rolling, the driver with the plug at the port, the camera on `twin` mid-push | Slide in a little wide; one glide and push onto `twin`, arriving at frame 0's framing **with frame 0's push speed** (no hold) | Captions end at "much?" | Tires rolling in; fans idle; the music ends on the last frame |

### The gaps, checked

The longest stretch with no listed event in each scene: 1 · 1.4 s (3.6 → 5.0) · 2 · 1.4 · 3 · 1.0 · 4 · 1.3 · 5 · 1.6
(22.6 → 24.24) · 6 · 1.0 · 7 · 1.4 · 8 · 1.0 · 9 · 2.0 (33.6 → 35.6) · 10 · 1.0 · 11 · 1.3 · 12 · 2.3 (44.6 → 46.9) ·
13 · 0.5 · 14 · 1.4 · 15 · 1.3 · 16 · 1.4 · 17 · 1.0 · 18 · 1.1 · 19 · 1.3. None reaches 3 s, and the pulses and
the camera move throughout.

## Frame 0 and the loop

- **Frame 0** (C, 1:20, `twin`): the BYD rolling the last 2 m into the top bay; the Tesla parked below, its driver at the
  cabinet with the plug at the port; both packs at 10 %, nothing flowing, port lights off; the title block in the sky band;
  the camera already pushing. It reads in the first second: two bays, two cars, a charger, the title.
- **The last frame** is the same state, reached by scene 19 (a new BYD arriving). The car's position and wheel phase,
  the driver's pose, the clock, the shadows and the camera (framing and speed) all match. On replay the cut adds only the
  title block. "…would BYD's five minutes change much?" leads into "In China, some electric cars…".

## Framings

Draft 1's set, plus one:

- **`cableClose` (new, scene 6):** the Tesla cable's cut-away run, its cross-section filling ≈ 70 % of the frame width
  (≈ 2–3 m away). The spec can compute the look point from `chargeCableOf`; the builder makes sure the cut faces, strands
  and tubes hold up at that distance.
- In `byd` (10–12) the BYD driver, leaning on the rear quarter, is in frame.
- In `emptyBay` and `usCharger` (15–16) the bottom bay's curb sits at the frame's lower edge if the gap allows (a value;
  set on test stills).

## Sound (physical only; additions to draft 1's plan, for tooling, nothing generated)

- **New, self-made where possible:** tires rolling on concrete (low, soft), a brake creak, a car door (open and shut), the
  plug latch (`sfx:click` variant, now used ×6+), footsteps (very quiet, optional). In the fast-forward stretch (scene 3)
  they're short, ducked, and never stack.
- Kept: contactor clunks (each start and stop), cabinet fans, the pump hum (steps at "heat" and "push up"), the heater
  click and fan, the station bed.
- Still **no** whooshes, risers, electric whine or time-lapse "tick" sounds.

## For the publisher's 🎭 "Illustrative:" line (additions)

The drivers and what they do; the two BYDs (the second in a different paint) cycling through one bay while the Tesla charges; the time-lapse (clock,
shadows and clouds); the replay; the cars arriving in the US; one pulse ≈ 250 A; the heat glow is drawn, not measured.

## Props needed from the scene-builder (on `charge-slice`)

Times are seconds into the scene. **Every key below must accept times outside `[0, duration]`** (negative or past the
end), so a scene can start or end mid-move: frame 0 starts with the BYD rolling, and scene 19 ends with it rolling.

| # | Capability | Behaviour I need | Used in |
|---|---|---|---|
| B1 | **Drive in / out per bay** | Reverse into the bay (as parked now, facing −x) from a distance, decelerating to a stop at a time; drive out forward at a time, accelerating away and off-frame. Forward wheels. Brake lamps lit on the stop, off ≈ 0.5 s after (parked). The world doesn't move. Both regions; the US bottom bay too | 1, 3, 13, 14, 19 |
| B2 | **Driver figure per bay** (a grey extra; the seat empties when out) | A path of actions at times: `exit` (door opens, steps out), `walkTo` (cabinet, curb, door, the car's side), `plug` (lift from the holster, insert, latch), `unplug` (remove, holster), `lean` (on the rear quarter), `phone` (out, faces the figure, scroll, glance up), `pocket`, `glance` (at the car or cabinet), `sit` (curb), `stand`, `enter` (gets in, door shuts). Breathing and blinks as the cast rules. Two distinct extras (skin, hair) | 1–4, 10–19 |
| B3 | **Plug and current follow the figure** | The plug is in the hand, in the port or holstered; current flows only while it's latched. Either the contactor closes automatically on the latch, or I key `amps` to match (tell me which) | everywhere |
| B4 | **Cycling cars** (top bay) | n BYDs cycle on a list of times I choose (in, plugged, unplugged, out), each with a quick driver (out, plug, back in) and its cells filling 10 → 70 % with the pulses racing while plugged. Same body and paint | 3 |
| B5 | **Time-lapse mode** | Keyed on a clock (minutes past 1:20): the **sun and shadows swing** (amount a value; ≤ ≈ 20°, 🎭), **clouds drift** across the sky band, and a **clock spins** somewhere readable at `twin` and `wide` (where it lives is the builder's call; not on a cabinet screen, which stays unread). Off = the exact 1:20 state | 2–3, 18 |
| B6 | **Bold racing pulses** | Thick pulses (not dashes), count = amps ÷ 250, racing speed rising with amps; a **surge** key (brighten and swell once, ≈ 0.4 s); readable both at `twin` and at `cableClose` | everywhere; surges in 4 |
| B7 | **Breathing heat** | The conductors' and cells' glow swells and eases (period ≈ 1.2 s, ± ≈ 25 %), its depth rising with heat; packHeat breathes too | 5–7, 9, 12, 17 |
| B8 | **Cells filling visibly** | The modules' levels rise with a visible filling front (a bright edge), readable at `twin` | everywhere |
| B9 | **`cableClose` detail** | The cut-away's geometry holds up at ≈ 2–3 m (or tell me the closest that does), plus the look point exported or as a framing | 6–7 |
| B10 | **Curb** | A curb (or low kerb stone) beside each bay for the sit, in both regions | 3, 4, 13–18 |
| B11 | **Anchors** | The car-roof anchors follow a moving car (the D5 tags); `pack`, `ghost` and the US post's anchors stay as now | 1, 5, 10, 15 |

**Optional (nice to have, not blocking):** a small `×3` tally or three ticks beside the BYD row as the third BYD
leaves. Recommended **no**: the picture shows it, and the counter stays one idea.

## Risks and flags

- **Scene 3 is dense** (three BYD cycles in ≈ 5 s on fast-forward). If it reads as chaos on the phone, drop to two
  cycles (BYD 1 and BYD 2) and let the counter carry "30". Check in Studio first.
- **The shadow sweep is exaggerated:** the sun moves ≈ 7–8° in 30 minutes. A small visible swing is fine as time-lapse
  language (🎭). It shouldn't read as hours passing.
- **The loop needs frame-exact state** on both sides (car position and wheel phase, driver pose, camera speed). That's
  why B1/B2 must accept times outside the scene.
- **Camera speed:** "never stops" pushes at `twin` and `wide` distances (48–59) run above § 8's 0.06 units/s cap as draft
  1 already did (it scales with distance). A value deviation, recorded in the spec report.
- **The motion check (§ 8):** the BYDs in fast-forward must keep forward wheels (smeared above the limit), brake lamps
  on each stop, and parked cars' lamps off.

## As built in `spec.ts` (2026-10-28, on the builder's B1–B11)

Where the build moved a beat from the table above (times are video seconds):

- **Scene 1:** the BYD stops at 1.2 (1.4 m short and rolling on frame 0) and its driver gets out at 1.3. **The BYD latches at
  6.2**, because the walk round to the charger needs ≈ 4 s even at 1.5–2× (builder flag). On "charge" (2.96) **the Tesla's
  charger starts**: its driver latched at 0.6, carrying the plug on frame 0. The Tesla driver walks to the curb and sits by
  5.6, phone out at 6.0 (not during the time-lapse).
- **Scenes 2–3: two BYDs, not three** (one lane; builder flag; readable over busy). The counter starts at 6.5; the BYD hits 70 %
  and its row stops at 5 at 7.9 (right after "five minutes"); unplug 8.1, back in 10.95, out at 11.65 (as early as its walk
  back allows). BYD 2 reverses in as BYD 1's tail leaves the frame (stop ≈ 13.46); its driver (look 'a', explicit keys at
  ≈ 3.3×, no longer the ≈ 20× quick driver that read as a jump, owner preview 5) gets out at 13.56, walks to the cabinet,
  lifts the plug, walks to the port and latches at 15.70, 0.38 s before the cut, and **stays at the port: BYD 2 doesn't unplug
  or leave in visit 1** (owner, preview 3). Current flows from its latch to the cut and its cells climb from 10 % (≈ 28 % at
  the cut; an off-screen unplug key 1 s past the cut only sets the fill rate), so it reads as charging, not done. The
  Tesla's contactor opens at 80 %, 30 min, ≈ 15.4. BYD 1's driver runs at 2× throughout (one `rate` per driver).
  **BYD 1 is painted `RACE.evPaint`** (No. 007's petrol teal; `car: {paint}` on the visit; its "BYD" tag swatch matches) and
  BYD 2 keeps the bay's `CHARGE.bydPaint` slate, so the car that reverses in at ≈ 13.5 is the one the rest of the video shows
  (replay, chart, stack, close-ups). It replaced preview 2's teal BYD 2, which made the replay read as a third car
  (owner, preview 3). The loop (scene 19) shows the teal BYD 1 arriving, accepted. BYD 2 enters at the frame edge about a frame after
  BYD 1 leaves it (preview 5: moved up 0.35 s to give its driver room; at +0.3 the cars overlapped at the edge). **The counter's BYD row holds at 5 min** (BYD 1's session,
  the race result); BYD 2's new session gets no row, so the counter stays two rows and simple.
- **The replay: one continuous shot with a rewind** (owner, preview 4: "a jump between 0:15 and 0:16"). No hard cut: scene 4
  `continue`s, the camera carries the twin's push through 16.08 and glides into `cables` by 16.98 (inOut, log). Both plugs
  stay latched across the cut (the latches are visit 1's: the BYD's at 15.70, the Tesla's at 0.6), so the BYD's 1,000 A
  never drops and no contactor or latch plays at the cut. Over 16.08 → 16.68 the station's time runs back: the time-lapse
  and the station clock 30 → 0 min (sun and clouds with it), the Tesla's cells 80 → 10 %, the BYD's ≈ 30 → 10 %, the Tesla's
  current climbing back up its taper 0 → 625 A (no clunk); then both charge again on the replay's clock. The drivers carry
  through: the Tesla's is half-way up from the curb at the cut (visit 1's keys), stands, sits again at 19.8, phone at 20.3;
  the BYD's stands at the port until the cut, then leans by the front door (in the `byd` shot), phone out; he unplugs at 49.7.
  **The BYD doesn't drive off in scene 13:** he's carrying the plug back as the label lands. The counter fades over the
  rewind (gone 0.6 s in).
- **The US:** the Tesla stops at 52.8 (2.4 m out at the slide). Its driver (1.4×) gets out at 52.95 and **latches at 58.0**
  (in scene 15, the empty-bay shot's lower edge). He sits on the curb at 60.6, phone at 61.2. Time-lapse 68.6 → 70.64; 80 %
  and the contactor opens at ≈ 70.9.
- **The loop:** scene 19 replays visit 1's state, so the last frame is the frame before frame 0 (checked on stills 2271 vs 0).
- **Framings:** frame 0 / the loop on the builder's `stack` pulled back to 42 (both bays between the title block and the
  captions; the ground block fills the lower third). `cables` at 34.7 so the statement sits in the sky band (`place: 'sky'`).
  `cableClose` at 2.4 m in scene 6.
