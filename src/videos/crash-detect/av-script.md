# No. 020 · Crash detect: audio + visual script (draft 2.2, 2026-11-16, timed to the real voice take; brand rulings v0.18.17 applied)

Words: `script.txt`, **owner-approved** (17 lines, 239 words). Times are **real**, read from `transcript.json` (the recorded
take, `audio/voiceover.mp3`): voice 0.14 → **76.40 s** (≈ 3.13 words/s, faster than No. 019's 2.91), plus a **1.5 s tail**
(`spec.tail: 1.5`) for the loop push: **77.90 s = 2337 frames** (last frame 2336 = 77.87 s). Times are video seconds. A
cue's time is the start of its first word (scene 1 starts at 0). Draft 1 (estimate × 0.84) was skipped: the take arrived
before it was finished, so this draft is cut straight to the voice.

## Decisions applied (style guide v0.18.17, brand-director, relayed by the main session)

| Flag | Now |
|---|---|
| F3 held instant | § 8 Held instant: allowed once, ≤ 20 s. The world eases 1 → 0 over 0.3 s from **19.95** (≥ 0.35 s after the 19.60 kick); the shake never runs inside it. Held 19.95 → 38.24 (18.29 s), out by the slide. Disclosed in the post |
| F4 windows | § 3 Windows in a cut-open car: the far window fully raised. The pressure rings are clipped to the cabin's inner outline in their own plane. Cut edges never pulse |
| F5 ink waves | § 5 Physical events in ink: 3 px `cutLine` on a 2 px `cut` halo, solid, § 5 kinds and timings. Never within 16 px of a figure, never across a card, leader or caption. Never in the same frame as an orange mark from the same source: the phone's last alarm/siren arc is gone by **59.30**, before the first call ring (60.30) |
| F6 / F8 crash | § 3 Crashes on screen. Brake lamps ≥ 0.4 s before contact. Scroll at contact 50–70 % of cruise; stop ≤ 0.25 s. No deformation, nothing comes off. **Driver's front bag only (no side curtain).** Everyone upright and active (no figure still > 2 s after the impact; glances down ≤ 1.0 s). **No person in frame from the alert to the call** (51.12 → 59.68; this draft keeps it person-free from 49.52) |
| F9 counter | § 6 Counter: `256` lands whole, no count-up, nothing pulses with it. Optional ink full-scale tick on lane 1 at 21.68 |
| F11 cameo | § 3 A cameo: **option A**, a new small 3D scene `cameo-slices`. Option B (ink sheet) is out |
| F14 drop | No change: quiet lanes flat ink, the agree node an empty ink ring, no X |
| N7 alert | § 8 Alert screens: one headline and at most one button per state, **no slide-to-call bar**. Box **360 × 540, right edge x 888, top y 440** |
| F10 map | The dispatch-map box sits away from the rising rings (below) |
| Phone float | **Main session (scene-builder finding):** at the fixed angle YOU hides the cupholder. So the phone **floats out of its cupholder toward the camera** (§ 3 Object cut-aways) for `board` (scenes 4–8 and 11) and for the person-free countdown (49.52 → 59.68), then **settles back** into the cupholder. Framings renamed: `crashCabin` (was `cabin`), `cupClear` (was `cupholder`). Final prop names come from the scene-builder's report |

## The system in one line

**Orange = the phone's crash signs, then the call.** It shows up in three places. (1) **Inside the cupholder phone**, drawn
on its own board once the front lifts off: four **sensor lanes**, one per sensor (motion sensor, GPS, barometer,
microphone). Each lane is ink while it reads nothing unusual and turns orange when it catches its crash sign. Then the
**agree node**, at the processor where the four lanes meet, lights once they all agree. (2) **In the air**: the 911
call's rings rise from the phone up through the cut roof into the sky, and later three small dots rise the same way (the
texts). Radio goes up, never into the ground or onto the cut face (§ 5 Where the system is drawn). (3) **In cards**: the
dispatcher map's location circle and pin (§ 6, the No. 009 mark). In The Lab: the crash recordings the phone learned from
(the crash tiles on the wall). Test (§ 5 One system per video): every orange mark ends in "the phone decides it's a crash
and calls".

**Not orange:**
- What physically happens is drawn in **ink waves** (§ 5 Physical events in ink): the pressure rings from the airbag,
  the crash sound's arcs, the alarm's and siren's arcs.
- Airbags, brake lamps (`brakeLit`), hazards (§ 1 Lamps), and the lead car.
- The alert UI: its warning glyph is `warning` yellow, the rest is UI ink.
- The counter, the callouts, and every lane while it is quiet.

## The look in one paragraph

**One car, cut open along its length, used in three states:**
- **P**, parked at the curb, engine off. Frame 0 and the loop.
- **D′**, driving down a city street, seconds before the crash. The replay, inside one held instant.
- **D**, the moment of and after a low-drama crash into the back of a stopped car. Airbags out, hazards blinking.

All three use the same street, the same Day light, and the same fixed angle. The car is YOU's: a generic gas sedan in YOU's
paint, facing left (rear lamps toward the camera, nose at frame left), near wheels whole, the generic phone (`RealPhone`, one
camera strip, no logo) in the centre console's cupholder with its screen toward the driver's seat. Between the drop and the
alert we visit **The Lab**, re-dressed as a crash-data room. Near the end there is a short **cameo** of a roller coaster and
a ski slope (F11). **Nothing readable on the street** (no shop names, blank plates). **No Apple look anywhere:** a generic
phone and UI, invented labels, no iOS colours. "iPhone" and "Apple" are in the voice only.

**On-screen words** (all ink):
- the title block;
- four callouts: `MOTION SENSOR`, `GPS`, `BAROMETER`, `MICROPHONE`;
- two counters: `UP TO` / `256` `× GRAVITY` / `SENSOR RANGE`, and `MORE THAN` / `1,000,000` `hours` / `OF DRIVING AND CRASH DATA` (as built: the sub-line takes the script's own words, "driving and crash data", instead of the draft's `HOURS OF DATA`);
- the `crash-alert` detail box (`Crash detected`, `Cancel`, the countdown digits, `Calling 911`);
- the dispatch-map box (no label).

No maker, app name, "SOS" or source text.

## Locations

| Code | Location | Built with |
|---|---|---|
| **P** | Parked at the curb, Day, engine off, **lamps off** (§ 8, parked scope). YOU in the driver's seat with the phone in hand (lit, screen to the face) | `car-slice` (`variant: 'gas'`, `shape: 'sedan'`, `road: 'city'`, `storefronts`, speed 0) + `cupPhone` + **N6** |
| **D′** | The same car driving at city speed (≈ 30 mph, wheels forward), phone in the cupholder (dark). The stopped lead car is ahead, off-frame at first | `car-slice` + `cupPhone` (`cutAt`, motion sensor) + **N1, N2, N3, N5** |
| **D** | The same car stopped against the back of the lead car: airbags hanging, hazards blinking, both drivers upright | `car-slice` + **N1, N2, N4, N5**, `hazardAt`, `crash-alert` (**N7**), `dispatch-map` |
| **L** | The Lab · crash data: a back wall of small trace tiles, one researcher at a laptop, a bench with a cut console holding the same phone | `section-lab` + **N8** |
| **K** | The cameo: a roller coaster block on top, a ski slope block below, one sheet (§ 3 A cameo) | new scene `cameo-slices` (**N9**) |

Moves between states and locations are **slides** (§ 8: a re-dressing of the same slice counts). There are seven:
P → D (3.04) → D′ (13.42) → P (38.24) → L (42.32) → D (47.76) → K (67.09) → P (73.28). The closest pair is 4.08 s apart.
Inside a location every framing change is a glide. `car-slice` was last used in No. 017 (and in neither of the last two
videos, No. 018 and No. 019), so § 3 Re-dressing doesn't apply. The Lab returns re-dressed, as it always does.

## Title block

Line 1, as spoken: `How does the phone tell` / `a crash from a drop?` (23 / 20 characters). Line 2:
`NO. 020 · THE CUP HOLDER · 5:40 PM`. It is up from frame 0 and fades at **14.08 s** (0.8 s after "drop?" ends at 13.28),
over 10 frames. It stays up over the slides at 3.04 and 13.42 (No. 019 F2 precedent; F1).

## Framings (names for the spec, values for the scene-builder)

All at the fixed angle. Start from the `car-slice` gas presets and set the values on stills.

| Name | What's in it | Start from |
|---|---|---|
| `parked` | **Frame 0 and the loop.** The cabin whole: YOU's head and the held phone (≈ x 430, y 760), the steering wheel, the console and cupholder, the driver's footwell by the cut (where the phone lands), the storefronts behind. Room under the title block | GAS `call` (9.5), ≈ 8.5 |
| `carWide` | Both cars whole: YOU's car at frame centre-right, the lead car's tail at frame left (≈ 1 m gap before contact), sky above the roof for the rings (y ≈ 300–600) | GAS `car` (19), ≈ 22 |
| `crashCabin` | The driver, the wheel (airbag), the far window, the console. The phone sits in the cupholder, hidden behind YOU at this angle; only its rings show once they clear YOU's head | EV_CABIN (No. 017) look, ≈ 7.5 |
| `cabinSky` | `crashCabin` pulled back and up so the roof cut and ≈ 400 px of sky above it are in frame. The phone and its ring column sit **right of frame centre (x ≥ 600)**, so the dispatch-map box fits on the left, clear of the rings | ≈ 11 |
| `cupClear` | **The floated phone, no person at all** (§ 3 Crashes on screen): the phone, floated out of the cupholder toward the camera and clear of YOU, ≈ 24 % of frame height, with the console behind it. No knee, hands, face or any part of a figure, at every frame including the push and drift. Used in scenes 4, 7 (end) and 8, and from 49.52 to 59.68 | `CUP_FRAMINGS.cupholder` (2.1), look moved toward the console's far side and lowered; set on stills |
| `board` | The floated, cut-open phone's board filling ≈ 55 % of the frame height: four lanes stacked, each ≥ 90 px tall, the agree node at the right | ≈ 1.0 (between `cupClear` 2.1 and `chip` 0.6) |
| `floor` | The dropped phone on the driver's floor mat by the cut, opened, its four lanes readable | new, ≈ 1.4 |

## Line by line

Cues are copied word for word from `script.txt`. All 16 are unique and in order against the real transcript. Lines 3 and 4
share scene 3 (an in-scene glide at `How does the phone`). Line 6 is split at `one is a motion` (so scene 4 isn't 2.77 s).
Line 14 is split at `with your location`, and line 15 joins that scene. "In-scene glide" means a `cameraKeys` glide inside
one spec scene.

| Sc | Cue · in (s) · len | Line | What's on screen | Motion / events (s, on the word) | Overlay | Transition in |
|---|---|---|---|---|---|---|
| 1 | `If you drop your` · 0.00 · 3.04 | If you drop your phone, nothing should happen. | **Frame 0, P `parked`.** YOU holds the phone (lit, screen to the face, its light on the face); engine off, lamps off. Nothing orange | 0.0 slow push · 0.44 "drop" the phone slips from the hand and falls (0.35 s) into the footwell by the cut, one small bounce, lands back down (N6) · 0.9 its screen goes dark · 1.52 "nothing" (after the 0.72 s pause) YOU glances down at it · 2.08 "happen" YOU looks back up ahead; nothing else changes | **Title block** 0 → 14.08 | — (frame 0) |
| 2 | `If your car crashes` · 3.04 · 4.00 | If your car crashes with it in the cup holder, it can call 911. | **D at `carWide`**: YOU's car driving (≈ 30 mph, wheels forward, the street scrolling); the lead car (extra, `CITY` charcoal body, `EXTRA_B` driving) stopped ahead at frame left, **brake lamps lit** | 3.04 slide · 3.10 YOU's brake lamps light (0.50 s before contact); the car slows hard, never steering (an accident, F8) · **3.60 "crashes"**: contact at ≈ 60 % of cruise, a short `shakeKick`, YOU's car pitches ≤ 1.5° and settles (0.6 s), the lead car is pushed ≤ 0.3 m and rocks ≤ 1°. No deformation, nothing comes off. The driver's front bag blooms (0.08 s, small at this distance, N2); speed 0 within 0.25 s · 4.3 hazards on (both cars) · 4.4 YOU turns the head toward the lead car · 4.8 the lead car's driver glances back · 5.44 "can" the phone's screen lights (hidden behind YOU at this angle; its light shows on the console) · 5.88 "911" **orange rings** rise from the phone up through the roof cut into the sky, appearing as they clear YOU's head, one every 0.8 s (N4) · 6.2 YOU looks to the window; 6.4 the lead driver faces ahead | — | slide |
| 3 | `Every iPhone 14 and` · 7.04 · 6.38 | Every iPhone 14 and later comes with this feature turned on. How does the phone tell a crash from a drop? | D, glide to `crashCabin`: YOU upright behind the hanging airbag, the phone in the cupholder (hidden behind YOU), the rings rising off-frame top. **In-scene glide** to `carWide` at `How does the phone` (10.77) | 7.04 glide (0.8 s) · 7.3 the bag sags to hanging fabric (1.5 s) · 7.6 YOU shifts back in the seat · 8.32 "later" YOU turns the head toward the lead car (out the windshield) · 9.36 "feature" the next ring clears the roof (the phone itself is hidden behind YOU) · 10.0 "on" **a quick glance** down at the phone and back (≤ 1.0 s, head ≤ 0.25 rad below level) · 10.77 glide (0.8 s) out to both cars, rings rising over the roof · 11.3 YOU turns toward the lead car · 11.84 "crash" the lead car's driver glances back (upright) · 12.76 "drop" **a quick glance** at the cupholder and back (≤ 1.0 s) | Title block | glide |
| 4 | `It waits until several` · 13.42 · 4.18 | It waits until several of its sensors agree. On the iPhone 14, | **D′ `cupClear`** (slid back to seconds before the crash, F16): driving, the phone dark in the cupholder; no person in frame | 13.42 slide · 13.42 → 13.92 **the phone floats out of its cupholder toward the camera** (§ 3 Object cut-aways, 0.5 s, cubic in-out), clear of YOU · 13.92 **its front lifts off** (`cutAt`, 0.5 s): board, battery, chips · 14.08 title fades · 14.24 "several" glide to `board` (0.8 s) · 14.84 "sensors" four **lanes** draw on one after another (0.15 s apart, ink baselines), each starting at its part: motion chip, GPS chip, barometer can, microphone port. Live ink readings: motion a small road wiggle, GPS a high plateau scrolling, barometer flat, microphone dashed (off) then solid from a small tick (driving detected, 15.2) · 15.64 "agree" the **agree node** draws on at the processor where the lanes meet: an empty ink ring · 16.19–17.60 "On the iPhone 14," (the 0.88 s pause): the readings scroll | — | slide |
| 5 | `one is a motion` · 17.60 · 5.92 | one is a motion sensor that measures jolts up to 256 times the pull of gravity. | D′ `board` | 18.43 "motion sensor" callout, leader to the motion chip · **19.60 "jolts": the impact** (off-frame; a hard `shakeKick` on the phone and car), the chip's proof mass swings full, lane 1 **spikes orange**, its node dot lights · **19.95 the held instant begins** (F3): the kick has decayed; the world's time scale eases 1 → 0 over 0.3 s (still by 20.25); the camera keeps its push (≥ 0.04 units/s) and drift · 20.2 callout out · 20.44 "256" the counter **lands whole** (10 frames, no count-up) · 21.68 "times" optional: a short ink full-scale tick at the top of lane 1's track (gauge look, no digits) · nothing pulses with the counter | **Callout** `MOTION SENSOR` 18.43 → 20.2 · **Counter** sub `UP TO`, `256`, unit `× GRAVITY`, sub2 `SENSOR RANGE` 20.44 → 23.3, lands whole (F9) | continue |
| 6 | `Another is GPS, which` · 23.52 · 5.23 | Another is GPS, which shows the car moving fast and then suddenly stopping. | D′ `board`, the held instant | 24.32 "GPS" callout, leader to the GPS chip · 25.40 "shows" lane 2 re-draws its recorded window from the left: a **high plateau** ("moving fast", 26.52) · 27.20 "suddenly" the line drops off a cliff to zero · 27.68 "stopping" lane 2 **turns orange**, its node dot lights · 28.2 callout out | **Callout** `GPS` 24.32 → 28.2 | continue |
| 7 | `A third feels the` · 28.75 · 5.06 | A third feels the air pressure in the car change when the airbags fire, if the windows are up. | D′ `board`, then **in-scene glide** to `crashCabin` at `car change` (30.60): the steering wheel with the bag folded in its hub, the far window fully raised, the cut phone small in the cupholder, YOU held upright. For the `crashCabin` glide the open phone **settles back** into its cupholder (30.60 → 31.10). **In-scene glide** to `cupClear` at `if the windows` (32.36), the phone **floating out again** (32.36 → 32.86). YOU is in frame ≈ 30.9 → 32.9 only, and moves at 31.56 (§ 3: no figure still > 2 s) | 29.32 "feels" the barometer lane is the only one still ink; its can's node ring swells in ink · 30.08 "pressure" callout `BAROMETER`, leader to the can · 30.5 callout out · 30.60 glide (0.5 s) · **31.56 "airbags"** the **driver's front bag** blooms on its own clock (0.5 s, N2), meeting the chest; YOU is pushed back ≤ 3 cm and returns, head pitch ≤ 3°, eyes never covered · 32.00 "fire" **ink pressure rings** (3, 0.25 s apart, 0.10 → 2.2 m over 0.6 s each) spread from the bag in the plane through it parallel to the cut face, **clipped to the cabin's inner outline** (windshield, headliner, rear glass, floor), never past the cut plane. The first reaches the phone in the cupholder at ≈ 32.3, and lane 3 shows a **bump, orange**, node dot lit (read once the phone floats out) · 32.36 glide (0.7 s) · 32.72 "windows" the far window's raised glass in frame as the last ring fades at the outline (≈ 33.1) | **Callout** `BAROMETER` 30.08 → 30.5 (optional; drop it if 0.4 s reads as a flash) | continue |
| 8 | `And the microphone listens` · 33.81 · 4.43 | And the microphone listens for the sound of a crash once the phone knows you're driving. | D′ `cupClear` (no person), **in-scene glide** to `board` at `once the phone` (36.16) | 34.16 "microphone" callout, leader to the mic port · 35.28 "sound" **ink sound arcs** (3, 60°, 0.15 s apart, 0.5 s each) arrive at the phone's bottom edge from the frame's left edge (the crash's sound from the nose), gone by ≈ 36.1, never across the callout or its leader · 35.76 "crash" lane 4 **bursts orange** (a short block of spikes, no waveform of a voice, F12), node dot lit · 36.0 callout out · 36.16 glide (0.6 s) · 36.80 "knows" lane 4's early tick (dashed → solid) swells in ink · **37.20 "driving"** all four lanes orange: they run on to the agree node, which **lights orange** with one pulse (0.3 s) and holds; the phone stays floated into the slide | **Callout** `MICROPHONE` 34.16 → 36.0 | continue |
| 9 | `A dropped phone gets` · 38.24 · 4.08 | A dropped phone gets the jolt but usually not the other signs. | **P `parked`**, YOU holding the lit phone as at frame 0; **in-scene glide** to `floor` at `gets` (39.08) | 38.24 slide · 38.72 "phone" it slips and drops into the footwell as in scene 1 · 39.08 glide (0.7 s); the phone's front lifts off where it lies (0.4 s) · 39.44 "jolt" lane 1 **spikes orange** (the landing), node dot lit · 40.08 "but usually not" lanes 2–4 stay **flat ink** (GPS at zero, barometer flat, microphone dashed: not driving), each takes an ink swell in turn (40.3, 40.6, 40.9) · 41.28 "signs" the agree node stays an **empty ink ring** (one ink pulse). No cross, no X (F14) | — | slide |
| 10 | `Apple says it taught` · 42.32 · 5.44 | Apple says it taught the phone those signs with more than a million hours of driving and crash data. | **L `wide`**: The Lab · crash data, Day. Back wall: a panel of ≈ 20 × 12 small **trace tiles** (four mini lanes each, ink, quiet), one researcher at a laptop (lid toward them), a bench with a cut console and the same phone in its cupholder | 42.32 slide · 42.64 "says" the researcher types · 43.92 "signs" a few dozen **crash tiles** light orange across the wall in a seeded wave (four lanes spiking together, halo ≤ 25 %) · 44.40 counter in, counting to 1,000,000 by "hours" (45.36) · 46.48 "crash" the bench phone's lanes light the same pattern once · 47.24 the researcher leans in | **Counter** sub `MORE THAN`, `1,000,000`, sub2 `HOURS OF DATA` 44.40 → 47.5 | slide |
| 11 | `When the phone does` · 47.76 · 5.04 | When the phone does sense a crash, it sounds an alarm and shows an alert for 10 seconds. | **D `board`**: after the crash, the phone floated out and still open with the four orange lanes (the trace from D′); hazards blinking off-frame; no person in frame | 47.76 slide · 48.68 "sense" the agree node **pulses** and a short orange line runs from it to the phone's top edge · 49.0 the front closes (0.5 s); the phone stays floated out, clear of YOU; **every orange mark on the phone is gone by 49.5** (lanes, node, dot), so its ink arcs never share a frame with its orange (§ 5) · 49.52 glide to `cupClear` (0.8 s; no person in frame from here to 59.68) · 49.68 "sounds" the screen lights; **ink alarm arcs**: a pair either side of the phone every 0.6 s (0.03 → 0.20 m, 0.6 s, ≤ 2 per side), never across the box or its leader · 51.12 "alert" detail box in, alert state (N7) · 51.64 "10 seconds" the ring round the triangle runs | **Detail box** `crash-alert` **360 × 540, right edge x 888, top y 440**, 51.12 → 62.5 (one card through scenes 11–13), leader to the phone | slide |
| 12 | `Then it counts down` · 52.80 · 5.55 | Then it counts down for 30 seconds with a loud siren, and you can still cancel. | D `cupClear`, slow push; **no person in frame** (§ 3) | 53.28 "counts down" the box turns to the countdown · 54.08 "30" the digits read **30**, then tick in real seconds: 29 (55.08), 28 (56.08), 27 (57.08), 26 (58.08) · 55.25 "loud siren" the arcs turn to the **whoop**: a pair every 0.5 s, max radius alternating 0.20 / 0.12 m, filling the 1.0 s pause at "siren," · 56.96 "still cancel" an ink box draws round the box's `Cancel` button (0.4 s) | Detail box (countdown) | continue |
| 13 | `If nobody does, it` · 58.35 · 4.69 | If nobody does, it calls 911 and plays a message that there's been a severe crash, | D, `cupClear` (no person), glide to `cabinSky` at `calls` (59.68): the roof cut and the sky above; YOU, upright and active, comes into frame only once the call has started | 58.44 "nobody" the digits **time-lapse** 26 → 0 (1.0 s, F7) · **58.70 the last siren pair leaves; gone by 59.30** (no ink after it) · 59.68 "calls" glide (0.8 s); the phone **settles back** into its cupholder (59.68 → 60.28); the box turns to **Calling 911** · **60.30 the first orange ring** rises from the phone (once it's back, so the rings start from the cupholder) up through the roof into the sky, one every 0.8 s, appearing as they clear YOU's head · 60.3 YOU turns the head toward the lead car · 61.12 "message" the box's speaker line animates (`Message playing`) · 61.9 YOU shifts in the seat, looks out the far window · 62.5 box out | Detail box (calling) to 62.5 | continue |
| 14 | `with your location` · 63.04 · 4.05 | with your location. It also texts your emergency contacts. | D `cabinSky`, the rings rising right of centre; **in-scene glide** to `carWide` at `It also texts` (64.40) | 63.04 detail box in: `dispatch-map` (Day), **on the left (x 120, top ≈ 600), ≥ 48 px clear of the ring column at every frame**; its leader runs to the phone below the rings, never through them; a rough orange circle over the street · 63.4 YOU turns back ahead · 63.80 "location" it collapses to a pin (0.6 s) · 64.40 glide (0.8 s) · 64.88 "texts" three small **orange dots** rise from the phone up through the roof, 0.2 s apart, and leave the frame top (N4) · 65.0 YOU looks up · 65.64 "emergency" the lead car's driver steps out on the curb side and stands by his car · 66.48 "contacts" YOU turns toward him; the rings keep rising | **Detail box** `dispatch-map` 63.04 → 64.9, leader to the phone, no pin label (F10) | continue |
| 15 | `In the first months` · 67.09 · 6.19 | In the first months after launch, roller coasters and ski slopes also set off automatic 911 calls. | **K `sheet`**, the cameo (`cameo-slices`, § 3 A cameo): two cut mini-blocks on one sheet, Day, the fixed angle. Top: a generic steel coaster's drop into a level brake run. Below: a groomed ski slope. No park, resort, ride or brand, no signage, theming or trail signs | 67.09 slide · 67.6 the coaster train crests and runs down the drop; the skier starts down the slope · 68.88 "roller coasters" the train hits the brake run and stops hard (riders upright, lap bars down, all heads up) · 69.84 "ski slopes" the skier makes a hard hockey stop and sits back in the snow · 70.6 the skier sits up and pushes up to standing; the riders look around · 71.36 "automatic" orange rings rise from a rider's pocket and the skier's jacket, starting ≥ 0.35 m above each head, up into the sky; the coaster's rings fade ≥ 24 px before the top of the sheet, the slope's ≥ 24 px before the coaster block · 72.48 "calls" the rings keep rising | — | slide |
| 16 | `Has your phone ever` · 73.28 · 4.62 (incl. 1.5 tail) | Has your phone ever sounded that alarm when you weren't in a crash? | **P**, a little wider than frame 0; **slow push landing on frame 0's `parked` framing** at the last frame | 73.28 slide · 73.72 "phone" YOU reaches to the cupholder (`pickAt`), lifts the phone (0.6 s), the screen lights toward the face · 74.76 "alarm" YOU glances at it, then holds frame 0's pose · 76.40 voice ends, captions end · **77.87 last frame (2336) = frame 0** | — (captions end) | slide |

### Gaps (longest stretch with no listed event)

Every scene has an event at least every ≈ 2 s, and after each impact no figure in frame stays still over 2 s (§ 3). The held instant (scenes 5–8) keeps moving through glides, lanes drawing,
callouts and the counter. Hazards, drift and the push are texture. The longest stretches:
- scene 1, 0.9 → 1.52 (inside the 0.72 s pause at "phone,");
- scene 5, 20.44 → 21.68 (the counter landing), then 21.68 → 23.52 (1.84 s; add the optional ink tick or a lane-1 readings scroll if the motion check fails);
- scene 12, 57.08 → 58.08 (a tick).

### Scene lengths

Spec scenes run **3.04 to 6.38 s**. The longest held framing is scene 12's `cupClear` (5.55 s, with the digits ticking
and the arcs). **Short:** 1 (3.04) and 2 (4.00). **Long:** 3 (6.38) and 15 (6.19), each with an in-scene change.

### Countdown on screen

| Scene | Box | Digits |
|---|---|---|
| 11 | alert | the 10 s ring |
| 12 | countdown | 30 (54.08) → 26 (58.08), real seconds |
| 13 | countdown → calling | 26 → 0 time-lapse 58.44 → 59.44 (🎭), `Calling 911` from 59.68 |

## Pacing on the real take

- **P1 · Fast read.** 3.13 words/s overall, and lines 6–9 explain four sensors in 22 s. The picture stays on one subject
  (the board) and adds one thing per spoken idea. No second card rides along.
- **P2 · Pauses that the picture uses:** "phone," 0.72 s (the phone lands, YOU glances down), "iPhone 14," 0.88 s (the
  readings scroll before the jolt), "GPS," 0.80 s (the callout lands), "siren," 1.0 s (the whoop arcs), "911" 0.68 s
  (the first ring clears the roof).
- **P3 · Question at 10.77 s.** The spoken question comes later than the § 6 target of ≈ 5–6 s, because the hook runs
  three lines. The title block carries it from frame 0. The script is approved, so this is noted only.

## Lines that are hard to show

- **F1 · Title block over two slides** (3.04 and 13.42). It is 2D and still, so it should read, as in No. 019 F2. Keep it,
  and judge in Studio.
- **F2 · Line 3, "Every iPhone 14 and later comes with this feature turned on."** No honest picture. A settings screen
  would need a toggle row that reads as Apple's, and the phone's screen at that moment shows the call. Shown instead by
  the phone acting with no one touching it (the rings, the node dot's swell on "feature"). The fallback is a callout
  `ON BY DEFAULT` on the phone on "turned on" (no "iPhone" on screen). **Recommended: no overlay.**
- **F3 · The held instant (scenes 5–8): ruled (§ 8).** Held 19.95 → 38.24 (18.29 s ≤ 20). It eases in over 0.3 s after
  the kick has decayed and leaves by the slide. Inside it only the camera, overlays, the lanes, the airbag bloom and the
  ink waves move. **Note on order:** at real time the bag would fire ≈ 0.08 s after contact. The bag stays folded through
  19.60 → 19.95 and fires on "airbags fire" (31.56). The framing then is `board` (no wheel in frame), and the post's
  "Illustrative:" line names the held instant. Check that `timeScale` holds at 0 and that the bag, lanes and waves run on
  their own clocks. **Fallback** (if not): a real-time crash with the bag out at once.
- **F4 · Windows: ruled (§ 3 Windows in a cut-open car).** The far window is fully raised. The rings are clipped to the
  cabin's inner outline in their own plane. Cut edges never pulse.
- **F5 · Ink waves: ruled (§ 5 Physical events in ink).** Values as in the scene rows. The phone's alarm/siren arcs end by
  59.30, before its first call ring (60.30). Read as the rule says ("from the same source"): the crash's sound arcs (from
  the nose) and the pressure rings (from the bag) arrive while the phone's own lanes show orange. That is allowed, since
  they come from other sources, and they are what the lane is reading. **Settled (main session):** keep this reading. The
  wave arriving at the sensor reads as the physical event reaching it; the lane times stay (lane 3 at 32.3, lane 4 at
  35.76).
- **F6 · "If nobody does": ruled (§ 3 Crashes on screen).** No person in frame from the alarm (49.52) until the call
  starts (59.68): `cupClear` is reframed with no knee. In every other post-impact shot YOU and the lead driver are upright
  and move at least every 2 s. **The § 3 two-second rule meets the § 8 held instant in scene 7:** inside the hold the cast
  can't move, so YOU is framed for ≈ 2.0 s only (30.9 → 32.9), and the bag's push-back at 31.56 is the movement. **Accepted (main session)**, as is the bag held folded until 31.56 (F3).
- **F7 · The 30-second countdown in 5 s of voice.** The digits tick in real seconds (30 → 26), then time-lapse to 0 on
  "nobody does" (🎭, disclosed). The alternative is to cut from 26 to `Calling 911` with no time-lapse.
- **F8 · The crash: ruled (§ 3 Crashes on screen).** Applied in scene 2 and N1/N2:
  - brake lamps 0.50 s before contact;
  - ≈ 60 % of cruise at contact;
  - stop ≤ 0.25 s;
  - pitch ≤ 1.5°; the lead car pushed ≤ 0.3 m, rocking ≤ 1°;
  - no deformation, nothing comes off;
  - the driver's front bag only (no passenger, no curtain);
  - one muffled thump.

  It plays twice: in real time (scene 2) and at the start of the held instant (scene 5, off-frame from `board`).
- **F9 · `256`: ruled (§ 6 Counter).** Lands whole on "256". No count-up, and no lane pulse with it (the 22.48 pulse is
  cut). An optional ink full-scale tick at 21.68.
- **F10 · Dispatch map.** A screen no one on screen holds (§ 6, No. 009). The voice names who gets the call ("calls
  911"), and the leader goes to the phone. No pin label (`pinLabel` empty, not No. 009's `MILE 137`).
- **F11 · The cameo: ruled (§ 3 A cameo), option A.** A new 3D scene `cameo-slices` (N9). The ink sheet is out.
- **F12 · Microphone.** Lane 4 shows a short burst, never a speech-like waveform. No privacy beat (sources, No politics,
  no privacy).
- **F13 · "Apple" in the voice (line 11).** Nothing Apple is on screen. The Lab is generic, as always.
- **F14 · "Usually not the other signs": confirmed.** Quiet lanes flat ink, the agree node an empty ink ring. No X, cross,
  red, check or dimming.
- **F15 · The hook's 4 s (scene 2).** Crash and call in one framing (`carWide`), with no glide. The rings over the roof
  read at that size, but the phone doesn't (the voice names the cup holder; scene 3 shows it).
- **F16 · The rewind at 13.42.** The slide from the stopped car back to the moving car could read as a second drive. The
  same street, the same lead car and the phone opening right away should tie it to "how did it know". If the motion check
  finds it confusing, drop the lead car from D′'s frame until the impact.
- **F19 · Alert box: ruled (§ 8 Alert screens).** 360 × 540, right edge x 888, top y 440 (bottom 980, clear of a
  2-line caption page from ≈ 1045). No slide-to-call bar. The leader runs to the phone without crossing the alarm arcs.
- **F17 · Line 15, the texts.** Three dots rise (radio up), with no card. An optional detail box (a sent message with a
  location chip) would be the fourth box in 15 s, so it isn't recommended.
- **F18 · Length 77.90 s.** Over 60 s, so our own music only.

## Reused vs new

**Reused as they are:**
- `car-slice` (gas sedan, `road: 'city'`, `storefronts`, `driving` keys, `brakeLights`, `hazardAt`, `shake` /
  `shakeKick`, `glances`, `wheels: 'forward'`, `cameraKeys`, `timeScale`);
- `cupPhone` (`mount: 'cup'`, `pickAt`, `screen`, `dotAt`, `pulses`, `cutAt` / `chipAt` / `closeAt`, the motion sensor's
  swinging proof mass, `CUP_FRAMINGS`);
- `RadioPulse` rings (No. 009);
- detail box `dispatch-map` (No. 009);
- `section-lab` (the block, extras, laptops);
- callouts, counter (`sub`, `sub2`), title block, slides and glides.

**New scene:** `cameo-slices` (N9, § 3 A cameo).

**Not used:** statement cards, name tags (YOU is the only driver, and the car isn't named), the X-ray, chart cards, the
city-slice intersection. A wide street crash at the intersection was considered and dropped: the cabin slice shows the
airbags and the phone, and the intersection was No. 019's location.

## Missing scenes and parts (scene-builder)

One new scene, the cameo `cameo-slices` (N9, ruled). Everything else extends `car-slice`, `SlicedCar` / `CarPhoneKit`, `PhoneTeardown`,
`section-lab` and the detail box.

- **N1 · The lead car and the collision** (`car-slice`, `lead`).
  - A generic extra sedan, whole (not cut), stopped in YOU's lane in road space. It streams in with the road while YOU
    drives and stops when YOU stops (props move with the world). `CITY` charcoal body, blank plate, brake lamps lit
    (`brakeLit`), driver `EXTRA_B`.
  - YOU's brake lamps on ≥ 0.4 s before contact (keyed, 3.10 for a 3.60 contact). YOU never steers or speeds up into it.
  - Contact when YOU's nose reaches its bumper (`gap` → 0), at **50–70 % of cruise** (road scroll). YOU's car pitches
    ≤ 1.5° and settles over 0.6 s. The lead car is pushed ≤ 0.3 m and rocks ≤ 1°.
  - **No deformation** (no crumple, buckled hood, loose bumper, opened panel gap). **Nothing comes off** (glass, debris,
    fluid, steam, smoke, sparks, tire smoke, skid marks).
  - A **hard stop**: a speed key with its own ease (≤ 0.25 s after contact), since the default 0.8 s reads as braking.
  - `shakeKick` at contact. The scene's `timeScale` eases to 0 from 19.95 in scene 5 (§ 8 Held instant: 0.3 s, cubic out,
    after the kick has decayed). Cast breath, blinks, wheels, lamps and road all hold.
  - Hazards on both cars (`hazardAt`; the lead's on the same 1.4 Hz clock).
  - The lead driver glances back (`glances`) and steps out on the curb side to stand by his car (scene 14). Both figures
    stay upright and move at least every 2 s after the impact (§ 3).
- **N2 · The driver's front airbag** (§ 3 Crashes on screen). **No side curtain, no passenger bag** (frontal crash, empty
  seat).
  - It blooms from the steering wheel hub (`airbagAt`; 0.08 s at real time, or `airbagFor` ≤ 0.5 s on its own clock inside
    the held instant), a smooth rounded cushion meeting the chest. The head stays upright behind its top edge, eyes never
    covered.
  - Sags to hanging fabric (`sagAt`, 1.5 s).
  - `CHARGE.canopy` `#dcdcd8`, matte, roughness 0.9. No new colour, no orange, no powder.
  - The driver: pushed back ≤ 3 cm and back (0.4 s), head pitch ≤ 3°, no whip.
  - In the held instant it stays folded until `airbagAt` (31.56), even though the world stopped after contact (F3).
- **N3 · The sensor lanes inside the cupholder phone** (`PhoneTeardown` + `cupPhone.lanes`).
  - On the open board, beside the existing motion chip: a GPS chip, a barometer (small can with a vent), and the
    microphone port at the bottom edge (invented legends, § 3 Generic devices).
  - Four horizontal lanes, one per part, stacked, each starting at its part with a **node dot** (ink ring while quiet,
    orange when its sign lands) and running to the **agree node** at the processor.
  - Baselines 3 px `cutLine`. Readings drawn as a line in ink while quiet, **orange** (car-scale weight, × camD / 12,
    halo 25 %, summed ≤ 25 %) from the key on.
  - Keys:
    - `motion`: `wiggle` (live, ink) and `spikeAt`;
    - `gps`: a scrolling plateau, `redrawAt` (draws the recorded window left to right, 2.3 s) and `cliffAt`;
    - `baro`: `bumpAt`;
    - `mic`: `onAt` (dashed → solid at a small tick) and `burstAt` (a short block of spikes);
    - `agreeAt` (the four lanes' ends run into the node, it lights and pulses once);
    - `sendAt` (a short orange line from the node to the phone's top edge);
    - `swell: {lane, at}[]` (an ink swell on a quiet lane);
    - `drawAt` (the lanes draw on, 0.15 s apart).
  - Nothing readable: no units, digits or labels (the callouts name the parts).
  - Each lane ≥ 90 px tall at `board`, ≥ 50 px at `floor`.
  - The same lanes on the dropped phone (N6) and the Lab's bench phone (N8).
- **N12 · The floating phone** (§ 3 Object cut-aways; main session). The cupholder phone floats out of its cupholder
  toward the camera, clear of YOU on screen, at a pose where its screen-side face can open (`cutAt`), and settles back
  (0.5 s each way, cubic in-out). Keys: float 13.42 → 13.92, back 30.60 → 31.10, float 32.36 → 32.86 (stays out across the
  slide at 38.24; D's scene 11 opens with it out), back 59.68 → 60.28. The lanes (N3), the alarm arcs (N5) and the `phone`
  anchor (detail box leaders) follow it. Its screen still faces the driver's seat (§ 3 Phones face their owners); the
  alert is read only in the detail box. Prop names from the scene-builder.
- **N4 · Rings and dots from the cupholder phone** (`cupPhone.ringsAt`, `ringEvery`, `ringsUntil`; `cupPhone.sends:
  number[]`). The No. 009 `RadioPulse` rings, starting at the phone in the cupholder (not the ear) and rising straight up
  through the roof cut into the sky, fading as they grow. Never crossing the driver's head on screen (§ 5): if they would,
  start them 0.2 m to the console side. The phone is hidden behind YOU at `carWide` and `crashCabin`, so the rings show only once they clear the head. First call ring 60.30, after the phone is back. `sends`: small orange node dots, one per time, rising the same way and leaving the
  frame top.
- **N5 · Ink waves** (§ 5 Physical events in ink, ruled). A `cutLine` stroke 3 px on screen on a 2 px `cut` halo each side,
  solid, unlit, out of the bloom layer, never orange.
  - `pressureRings: {at, from: 'airbag'}`: 3 rings 0.25 s apart, radius 0.10 → 2.2 m over 0.6 s each (cubic out), opacity
    1 → 0 over the last 60 %. In the plane through the bag parallel to the cut face, **clipped to the cabin's inner outline
    in that plane** (windshield, headliner, rear glass, floor), never through the cut plane (§ 3 Windows).
  - `soundArcs: {at, from: 'nose', to: 'phone'}`: 3 arcs, 60° span, centred on the source, bulging toward the phone, 0.15 s
    apart, each travelling 0.5 s from the source or the frame edge to the phone's mic port, fading over the last 0.15 s.
  - `alarmArcs: {at, until, whoopAt?}` on the phone: a pair either side, 60°, facing the camera, 0.03 → 0.20 m outside the
    phone's edge over 0.6 s (cubic out), fading over the last 50 %, a pair every 0.6 s, ≤ 2 per side. From `whoopAt`: a
    pair every 0.5 s, max radius alternating 0.20 / 0.12 m. This video: `at` 49.68, `whoopAt` 55.25, last pair 58.70,
    all gone by 59.30.
  - Masked ≥ 16 px from any figure. Never across a card, its leader or the caption box.
- **N6 · The phone drop** (`cupPhone.dropAt`). From the hand: the phone falls (0.35 s, gravity), one small bounce, and
  lands back down on the driver's floor mat by the cut, where the camera sees it. Its screen sleeps (0.3 s).
  `cutAt` must work where it lies (the face toward the camera lifts off). Framing `floor`. Continuity: in P, lamps off and
  speed 0.
- **N7 · Detail box content `crash-alert`** (`screenKit` palette, Day UI, generic). States keyed in seconds after the box
  enters:
  - **`alert`**: a warning triangle (`warning` `#eedd2b` fill, 4 px `#15171a` outline, a `#15171a` "!", flat) with a thin
    4 px `#15171a` ring round it running for 10 s, the headline `Crash detected` (Inter 700 ≥ 40 px), an outlined `Cancel`
    (2 px `#15171a`, Inter 700 ≥ 32 px). **No slider of any kind.**
  - **`countdown`**: digits (Inter 800 ≥ 140 px, `#15171a`) counting from 30 on the scene's clock, with optional
    `timelapse: {from, to, at, for}`, and `Cancel`; `cancelBox` at a time (an ink box draws round `Cancel`).
  - **`calling`**: a plain handset glyph, `Calling 911` (Inter 700 ≥ 40 px), `Message playing` (Inter 600 28 px) with a
    neutral waveform `#3a3f4b`.

  One headline and at most one button per state (§ 8 Alert screens). Corner radius ≤ 8 px. No red, green or capsule
  buttons, no full-screen red or black, no SF-like font, no maker wording ("SOS", "Emergency SOS", "Call After Severe
  Crash", "Crash Detection"), no app name, no orange. **Box 360 × 540, right edge x 888, top y 440.** Leader to
  `'phone'`.
- **N8 · `section-lab` dressing `'crash-data'`.**
  - The Lab block, Day. On the back wall, a dark panel (`device`) ≈ 2.4 × 1.4 m holding ≈ 20 × 12 small trace tiles, each
    four mini lanes in ink (quiet driving). On `waveAt`, a seeded set (≈ 30) of **crash tiles** light orange in a wave
    (four spikes together, halo-only ≤ 25 %).
  - One researcher at a laptop (`type`, `lean-in`).
  - A bench with a cut centre console holding the same generic phone in a cupholder, opened, its lanes as N3, lit once on
    `benchAt`.
  - No sled, no crash, no dummy. Nothing readable. Framing `wide`.
- **N9 · New scene `cameo-slices`** (§ 3 A cameo, ruled option A). Register in `src/scenes/index.ts` (`SCENES` and
  `SceneName`).
  - Two cut mini-blocks stacked on one sheet (§ 8 twin-section grammar), Day, the video's fixed angle, `slide` in and out.
    Framing `sheet`: both blocks between the top of the safe zone and a 2-line caption page.
  - **Top block:** a generic steel coaster track (`HIGHWAY.galvanized` rails, `CHARGE.cabinetDark` supports) dropping into
    a level brake run, a two-car train (cool paint, no theming), riders as extras with lap bars. Keys `trainAt`
    (crest → drop), `stopAt` (hard stop in the brake run).
  - **Bottom block:** a groomed slope (`WINTER.snow` / `snowShade`, cut faces with hatch and ink), one skier extra (cool
    jacket, grey helmet). Keys `skiAt`, `stopAt` (hockey stop), `sitAt`, `upAt`.
  - Rings (N4's look) from a rider's pocket and the skier's jacket on `ringsAt`, starting ≥ 0.35 m above a head, never on a
    person. Each block's marks fade ≥ 24 px before the block above (the top block's before the sheet's top).
  - **Generic:** no park, resort, ride or brand name, signage, theming, logo, trail sign, or a famous ride's silhouette.
    Riders and skier upright, unhurt, moving.
- **N10 · Framings** for this car: `parked`, `carWide`, `crashCabin`, `cabinSky` (the ring column at x ≥ 600), `board`,
  `floor`, and **`cupClear`** (the floated phone, no person); `crashCabin` replaces `cabin` (values above, set on stills); `sheet` for `cameo-slices`.
- **N11 · The loop seam.** Frame 0: P `parked` at its starting distance, YOU holding the lit phone in frame 0's pose, lamps
  off, nothing orange, no lead car. Last frame 2336: the same framing, pose and screen, reached by the push. `drift: 0` or
  phase-locked (77.9 s isn't a multiple of the 25 s drift).

## The loop seam plan

1. **Frame 0 (scene 1):** P `parked`, Day, 5:40 PM, engine off. YOU holds the phone, lit, screen to the face. Title block
   up, slow push.
2. **Last shot (scene 16):** a slide into P a little wider on "Has your phone ever"; YOU picks the phone from the cupholder
   and holds it in frame 0's pose by 75.0. The slow push lands on frame 0's framing at the last frame (2336, 77.87 s).
3. **Phase-locked:** the push, the drift, YOU's idle.
4. **Words:** the voice ends at 76.40; captions are gone for the last 1.5 s. "…when you weren't in a crash?" hands over to
   "If you drop your phone, nothing should happen."
5. **Check:** `yarn stills crash-detect --frames=0,2336`, compare the two PNGs, then the motion in Studio.

## For the publisher's 🎭 "Illustrative:" line

The car, the street and the crash. The phone and its alert screens (generic, not Apple's). The four sensor lanes drawn
inside the phone and the order they appear in. The held instant. The countdown, sped up after 26. The dispatcher's map.
The Lab's wall of recordings standing for Apple's training data. The roller coaster and ski scenes (generic). The
hold on the crash's instant while each sensor's sign is shown in turn (the order is the script's).

## Sound (note only, for later)

Physical sounds only:
- a Day city bed and YOU's engine and tires in D′;
- **a single low, muffled thump** at each impact (3.60, 19.60), with no glass and no metal shriek; a soft airbag pop at
  31.56;
- the hazard relay at 1.4 Hz on both cars;
- the phone's alarm and siren, self-made generic whoops (not Apple's sound), ≈ 14 dB under the voice, because the voice
  names them;
- a ringback under `Calling 911`, low;
- keyboard taps in The Lab;
- in the cameo, coaster wheels on the brake run and skis on snow;
- a soft whoosh on each slide (seven; keep them low).

No sound for orange, the lanes, cards or digits. Over 60 s, so our own music.
