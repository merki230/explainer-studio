# No. 012 · Insurance app: audio + visual script (draft 3, 2026-10-30, built in `spec.ts`)

Words: `script.txt` (19 lines, the owner's rebalance around the app). Voice: the final take, `transcript.json` 293
words, 96.72 s + 1.5 s tail = 98.22 s. `spec.ts` reads every word time from the transcript through a phrase list, so
the times below follow the take. Over 60 s: our own music or none.

## Draft 3 (2026-10-30): the app-first script

Every earlier fix and fact-checker condition is kept: the dash mount, Corlo, the ghost pin with `COULD COUNT AS` /
`HARD BRAKING`, the hedged counters (`MANY PROGRAMS` on 6–8), the generic second car, nothing orange after "GM
settled", YOU's lamps in frame, no drift in A, and the loop seam (frame 0 = last frame, checked).

| Sc | Cue | In (s) | Picture and events | Overlays |
|---|---|---|---|---|
| 1 | `An insurance app` | 0.00 | Frame 0: the hard stop at a red light, the arrow past the tick, a pin plants · it waits at the red through line 3 | Title block (to ≈ 8.0) |
| 2 | `and it doesn't need` | 3.44 | Down to the port: the ghost plug-in box draws and fades | — |
| 3 | `How does the phone` | 5.84 | The dash mount, the phone's dot pulses on "dash" | — |
| 4 | `It has its own` | 8.00 | The cut-away (0.2 m): the motion sensor's lid opens, the proof mass on springs | Callout `MOTION SENSOR` |
| 5 | `so it feels every` | 10.72 | Out to the whole car: frame 0's pin swells on "every stop", the phone's dot pulses on "every mile" (flag D3-1) | — |
| 6 | `You start driving` | 14.80 | Green on "start", the car pulls away · the phone's screen wakes by itself on "the app notices" (light on YOU's face), the dot pulses on "started" | Tag `YOU`, then callout `TRIP STARTED` / `No tap` |
| 7 | `Some programs look` | 20.24 | The whole car driving in the late-day light | Statement `5:40 PM.` on "5:40" (ink, never a penalty; flag D3-2) |
| 8 | `At a red light` | 24.64 | The light ahead goes yellow, then red · the gentle stop begins (lamps) | — |
| 9 | `Many programs` | 28.00 | The whole car, the arrow growing toward the tick, the lit tail lamps | Counter `MANY PROGRAMS` / `6–8 MPH` / `LOST IN ONE SECOND` |
| 10 | `So a normal stop` | 33.92 | The arrow crosses on "normal stop", a ghost pin plants, it rests on "yours" | Callout `COULD COUNT AS` / `HARD BRAKING` |
| 11 | `When the light turns green` | 38.91 | Green, away (slower, 2.6 rev/s) · YOU lifts the phone on "pick it up", the screen lights · signs stream past behind YOU about every 1.5 s | — |
| 12 | `One insurer's app` | 43.60 | A pin pops on "distraction" · the phone tilts · back on the mount at the end | Callouts `PHONE MOVING`, then `SCREEN ON` |
| 13 | `The same insurer's` | 48.80 | Speed-limit signs keep streaming past; nobody is shown speeding | Counter `8 MPH` / `OR MORE OVER THE LIMIT` (ink, no orange) |
| 14 | `Each trip is` | 54.88 | Lines 12–13 are one scene (7.4 s), so one detail box can carry trip → scores → price | Detail box `trip-app` Corlo: the route draws over "Each trip is recorded", pins `HARD BRAKE`, `PHONE` · the scores page on "turns" · the price marker goes down, then up |
| 15 | `One insurer says` | 62.24 | The whole car, a green corner | Counter `UP TO 30 % SAVED` |
| 16 | `but another says` | 65.52 | A short slow-down (lamps, small arrow) | Counter `ABOUT 2 IN 10 · RATE UP` |
| 17–23 | `And some drivers` … `still advertises` | 69.72 | R, as in draft 2: the second car stops at the red (line at the tire, pole and red lens, lamps), the module and its rings, the path up, the report company, the insurer, the fade on "settled", `STILL ADVERTISED` | As draft 2 |
| 24 | `Would a cheaper` | 93.49 | Slide to A: frame 0's stop replayed (4.7 s), the last frame = frame 0 | — |

### Draft 3 flags

- **D3-1 (hard to show): "and GPS … tracks every mile".** No GPS picture exists. For now the phone's dot pulses
  on "every mile" while the car waits at the red. Scene-builder option: a small ink "trip line" on the trip-app box,
  or an orange route trace on the road.
- **D3-2: time of day.** The trip-app box has no time field, so 5:40 is an ink statement card (`5:40 PM.`): no
  orange, no pin, never a penalty. Scene-builder option: a `subtitle` on the trip-app header (`Drive home · 5:40 PM`
  with an ink clock glyph). That would replace the statement, and the time would move into the box in scene 14.
- **D3-3: no SPEED pin in the box.** YOU is never shown speeding, so a `SPEED` pin on YOU's trip would claim
  something the picture doesn't. Line 11 stays a rule, told by the ink counter and the speed signs. Add the pin only
  if the owner wants a speeding moment staged.
- **D3-4:** the car now waits at frame 0's red light from 1.1 s to "start driving" (15 s), so that line 4 can start
  the trip. The mass in the cut-away rests while the car stands still.
- **D3-5:** at the `call` framing a passing sign can sit behind the line-13 counter for a moment (top left).

## Sound effects plan (draft, not wired; style guide § 9), 2026-10-30

Physical sounds for actions seen on screen only, 15–19 dB under the voice. No stingers, risers or impacts, nothing
on an overlay's entry, nothing under the `5:40 PM.` statement (scene 7, captions off), and no slide whoosh (No.
010–011 used none). Times are video seconds on the final take; each is the moment the thing makes its sound.
`volume = (voice LUFS − dB under) − the file's measured LUFS`, measured after the takes land (No. 011's `sfxIn`
pattern: events listed in video seconds, split per scene).

| # | Sound (file) | What on screen | Time (s) | Length | Under voice | Source |
|---|---|---|---|---|---|---|
| 1 | `car-stop` (**the anchor**) | YOU's car rolling to a stop: tire hush and a short soft brake squeak at rest | 0.0 → 1.1 (frame 0's stop; the loop's last 0.5 s, ≈ 97.7 → 98.2, carries its start so the replay joins) · ≈ 34.6 → 35.1 (the gentle stop, last second only) | 1.4 s | 16 | **Paid 1:** `yarn sfx insurance-app car-stop --prompt "a small sedan rolling slowly to a stop on smooth city asphalt, soft tire hush fading out, a short gentle brake squeak at the very end, recorded from the curb, dry, no engine revving, no music" --seconds 1.4` |
| 2 | `pull-away` | the car pulling away on green (light engine and tires) | 15.1 · 40.0 | 2.0 s | 18 | Self-made: `yarn sfx:cruise insurance-app day --seconds 2 --ramp 6 --name pull-away` (the cruise mix ramping up), trimmed |
| 3 | `mount-click` | the phone unclipped from and clipped back into the dash mount | 41.7 (off) · ≈ 49.1 (on) | 0.3 s | 18 | Self-made: `yarn sfx:latch insurance-app --part out --name mount-click` (a small plastic clack) |
| 4 | `car-stop` (reuse) | the second car stopping at its red | ≈ 73.4 → 74.1 | 1.4 s | 17 | as 1 |
| 5 | `printer` | a report sheet printing at the report company | 81.8 · ≈ 90.5 | 1.0 s | 17 | **Paid 2:** `yarn sfx insurance-app printer --prompt "a small office laser printer feeding and pushing out one sheet of paper, a short soft whirr and the page sliding out, close, dry, no music" --seconds 1.0` |
| 6 | `paper-tray` | the sheet landing in the insurer's tray, then picked up | ≈ 83.9 · ≈ 84.6 | 0.5 s | 18 | **Paid 3:** `yarn sfx insurance-app paper-tray --prompt "a single sheet of paper dropped into a plastic desk tray, then lifted out, soft paper rustle, close, dry, no music" --seconds 0.5` |
| 7 | `stamp` | the insurer stamps the sheet | ≈ 85.0 | 0.3 s | 17 | Self-made: `yarn sfx:thump insurance-app --pitch 1.4 --seconds 0.3 --name stamp` (a short muted desk thud) |
| — | city bed (optional) | under the drive scenes only, if playback feels empty | 15 → 69.7 | loop | ≈ 24 | Self-made: `yarn sfx:cruise insurance-app day --lufs -36 --name city-bed`; only if the music doesn't already fill it |

Left out on purpose: the phone's screen waking (silent: no chime, so it doesn't sound like a notification), the
orange arrow, pins and rings (the system makes no sound), the data path's pulses, the counters and the detail box,
the second car's rings (no "data" bleeps), and the passing signs.

**Paid takes: 3** (car-stop, printer, paper-tray), under the cap of 4. Self-made: 3 (pull-away, mount-click, stamp)
plus the optional bed. Nothing generated yet.

---

## Earlier drafts (for reference)

### Draft 2 (superseded) · audio + visual script (draft 2, 2026-10-30, built in `spec.ts`)

Words: `script.txt` (17 lines). Voice: the final take, `transcript.json` 248 words, 83.84 s + 1.5 s tail = 85.34 s.
**Timing:** `spec.ts` reads every beat's word time from `transcript.json` (a phrase list, found in order), so a
re-record re-keys the whole video; nothing else in the spec holds a time. Scene times below are from the final take.
Line 17 ("Would a cheaper rate be worth having every trip scored?") is the loop scene. Over 60 s: our own music or none.

## Pass 3 (2026-10-30, final take)

- Stills re-run on the final take (21 per scene + 21 key moments).
- The cabin framing (scenes 7–8) was pulled back to 12.5 so the arrow clears the counter, which is now three lines.
- **No idle drift in A** (`drift: 0`). Drift runs on the video clock and shifted the loop's last frame. Frame 0 and
  the last frame now match by eye. Outside the title, 0.7 % of pixels differ by more than 24 levels, all in the
  car/road band (render noise, road texture).
- The 6–8 counter carries `MANY PROGRAMS` (`sub2`, scene-builder R-b).
- The spec's pin workaround is gone: the scene-builder fixed R-a, and the pins were checked across the cuts.

## What changed since draft 1

- **Owner:** the phone rides a **dash mount** (generic clip mount, house grey, on the dash top outboard of the wheel,
  screen tipped to YOU, back to the camera), not a cupholder. Line 2: "How does the phone on your dash know?".
- **Owner:** the orange data path **fades on "GM settled"** (approved; § 5 Trace deviation on purpose).
- **Fact-checker rulings applied:** the red-light callout reads `COULD COUNT AS` / `HARD BRAKING`, and that stop's pin
  is a **ghost pin** (dashed). Frame 0's pin is a real one, because that stop is a real hard brake (arrow past the
  tick). The counters read `6–8 MPH` / `LOST IN ONE SECOND`, `UP TO` `30 % SAVED` and `ABOUT` `2 IN 10 · RATE UP`.
  `MANY PROGRAMS` is on the counter (pass 3). The data chain shows a generic car, no GM shape, badge
  or label, and nothing lit after the fade.
- **App name: "Corlo"** (name check: "Tallo" is taken). It shows in the detail box only.
- **Real timing merged lines 10–11 into one scene (8.8 s),** so one detail box can turn trip → scores → price. An
  anchored box can't carry across cuts, and two boxes would blink out and back in.
- Builds used (scene times in the table are from the 80.48 s take; the final take is within ≈ 1 s, the spec re-keys itself): `cupPhone` (dash), `feel`, `events` (ghost), `plugBox`, the yellow signal lens, the `trip-app` box,
  and `report-slice`.

## Title block

`How does the phone on your dash know?` / `NO. 012 · THE DRIVE HOME · 5:40 PM`. Up from frame 0 and carried through
the `continue` cuts until 0.8 s after "know?" (≈ 8.0 s on the take).

## Locations

| Code | Location | Built with |
|---|---|---|
| **A** | The drive home: YOU's cut-open gas sedan (house paint), facing left (brake lamps to the camera), near wheels whole, city road (`roadAhead` 14), the phone on the dash mount, Day | `car-slice` + `cupPhone {mount: 'dash'}`, `feel`, `events`, `plugBox`, `corners` (yellow lens) |
| **R** | The data chain: the second car (sage, `EXTRA_B`, its phone dark on the same dash mount) on its street; the report company; the insurer | `report-slice` (`location: 'report-chain'`) |

A → R → A: two slides. The camera runs on one path per location, sampled into each scene, so it never stops.
Corners, signs and pins are placed on an odometer integrated from the drive, so they stay in place across cuts.

## Scenes (21; recorded-take times)

| Sc | Cue | In (s) | Picture and events | Overlays |
|---|---|---|---|---|
| 1 | `An insurance app` | 0.00 | **Frame 0:** the whole sedan braking hard (lamps lit, nose dipped), the orange feel arrow past its ink tick · 0.55 a pin pops from the phone and plants by the front wheel · rests 1.1 | Title block (carried to ≈ 8.0) |
| 2 | `and it doesn't need` | 2.84 | Glide to the pedals and the port (`pedal` framing) · on "need" the **ghost plug-in box** draws, fades at ≈ 4.6 · YOU glances at the phone | — |
| 3 | `How does the phone` | 5.04 | Green; the car pulls away · glide to the dash mount · the phone's dot pulses on "dash" | — |
| 4 | `It has its own` | 7.24 | Glide into the **cut-away** (0.2 m): the face lifts off, the motion sensor's lid opens to the proof mass on springs; it swings as the car speeds up and on "every stop" (a short ease, small arrow under the tick); closes at "makes" | Callout `MOTION SENSOR` on the chip, "motion" → "every" |
| 5 | `You're driving home` | 12.68 | Out to the whole car · the story's signal turns yellow (≈ 13.0), red on "red" (out of frame, see flag L3) | Tag `YOU` |
| 6 | `You slow down` | 15.84 | Foot onto the brake, lamps on, the arrow starts to grow | — |
| 7 | `Many programs` | 18.32 | Glide to the cabin (the arrow, the front wheel, the road) · the arrow grows toward the tick; the stop line and the red signal slide in | Counter `MANY PROGRAMS` / `6–8` `MPH` / `LOST IN ONE SECOND` ("loses" → "So") |
| 8 | `So a normal stop` | 24.44 | The arrow crosses the tick on "normal stop" · a **ghost pin** plants by the wheel · the car rests on "yours" · YOU glances at the phone on "Consumer" | Callout `COULD COUNT AS` / `HARD BRAKING` on the ghost pin ("count" → "When") |
| 9 | `When the light turns green` | 29.56 | Green, lamps off, away (the ghost pin rides off with the road) · glide to `call` · YOU lifts the phone on "pick it up", its screen lights the face, thumb scroll · a speed sign passes on "moving" | — |
| 10 | `One insurer's app` | 34.88 | A pin pops from the phone on "distraction" · the phone tilts on "moving" · the phone goes back on the mount at the end | Callout `PHONE MOVING` on the phone · then `SCREEN ON` on the face |
| 11 | `Each hard stop` | 40.32 | Glide so the driver sits left · the phone's dot pulses on "saved" | **Detail box** `trip-app` ("Corlo"): pins `HARD BRAKE`, `PHONE` land on the spoken words · scores page on "turns" (bars `BRAKING`, `PHONE USE`, orange) · price row on "Those": the marker goes down on "price", up on "either way", settles |
| 12 | `One insurer says` | 49.12 | Glide out to the whole car; a green corner passes · YOU glances | Counter `UP TO` `30 % SAVED` |
| 13 | `but another says` | 52.56 | A short slow-down (lamps, small arrow) and on | Counter `ABOUT` `2 IN 10 · RATE UP` |
| 14 | `And some drivers` | 56.77 | **Slide to R:** the second car driving · glide to its cabin on "never installed": its phone dark on the mount, no dot · the driver glances at it on "app" | — |
| 15 | `The FTC alleged` | 59.52 | Back to the car · its light goes yellow, red; it brakes (lamps) · on "collected" the module's dot lights, the first ring rises | — |
| 16 | `braking and speeding` | 62.56 | Rings on "braking" and "speeding" · green, it pulls away past a speed sign · on "straight from" the path draws up; the camera cranes with it | — |
| 17 | `The agency said` | 66.16 | The report company's room · the path reaches the rack on "sold" · a sheet prints on "reports" · leg 2 leaves on "insurers" | Callout `REPORT COMPANY` ("companies" → "who") |
| 18 | `who then used` | 71.01 | The insurer's office · the leg reaches the tray on "used", a sheet lands · picked up · stamped on "set rates" | Callout `INSURER` |
| 19 | `GM settled` | 73.76 | Glide out to all three sections · on "settled" all the orange fades from the car up (0.9 s); after that nothing is lit | — |
| 20 | `still advertises` | 76.64 | Glide to the report company's room; a sheet prints (ink only) | Callout `STILL ADVERTISED` / `Carmakers' driving data` |
| 21 | `Would a cheaper` (line 17) | 80.53 | **Slide to A:** frame 0's stop replayed (4.8 s) so the last frame is frame 0: the car nearing the red light, braking, lamps lit, the arrow growing past the tick | — |

Short scenes: 2, 3 (2.2 s each, each with its own glide and event), 14 and 19 (≈ 2.8 s).

## Line flags

- **L1:** the question ends at 7.2 s (the guide wants ≈ 5–6 s). The title block carries to ≈ 8.0 s.
- **L2:** the plug-in box ghost reads only at the close pedal framing, so scene 2 glides there for 2 s.
- **L3 (limit): the story's light can't be seen turning red in scene 5.** The car is ≈ 40 m from it at that moment,
  and the vertical frame shows ≈ 6 m of road ahead. The signal comes into frame in scene 7, red, as the car nears
  the line. The voice carries line 4. A fix needs a different stop (a shorter, harder one), which would clash with
  "the way you always do".
- **L4:** the gentle stop runs from "slow down" to "yours" (≈ 9.5 s), timed so the arrow crosses on "normal stop"
  (🎭 timing).
- **L5:** scene 11 is 8.8 s (lines 10–11), one box changing every ≈ 2 s.
- **L6:** the data chain is a re-enactment of the FTC's allegation (fact-checker: acceptable with the disclosure).

## For the publisher

The fact-checker's disclosure for the data chain (sources.md "On-screen check"). Also illustrative: the stop timing,
the arrow and its tick, the pins, the app ("Corlo", invented), its scores and price marker, and the story time.

## Sound (physical only; nothing generated)

Tires and a soft brake creak at each stop (1, 6–8, 13, 15, 21), the phone lifted off and clipped back on the mount
(9, 10), the second car's stop (15), the printer (17, 20), paper landing in the tray (18), the stamp (18). Whooshes
on the two slides only.
