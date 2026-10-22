# No. 006 · One pedal: audio + visual script

Revision 2 by the director, 2026-10-21, for the owner-approved 13-line script (196 words), before voice (playbook step 0). It
replaces the first draft (12 lines). Inputs: `script.txt` and `performance.txt` as of 14:58, `sources.md` (the fact-checker's
recheck of the reordered wording: PASS; line 12's 🟡 is fixed by the current words "There's a catch, though, since a brake supplier
says…"), `brand/style-guide.md` v0.12, `brand/brand.md`, and the parts in `src/scenes` (`car-slice`, `highway-slice`, `street-slice`),
`src/three` (`real/RealCar`, `real/CarShell`, `real/RealWheel`, `real/RoadSigns`, `section/StreetSlice`, `OrangePath.tsx`) and
`src/components` (`DetailBox` `dashboard`, `Counter`, `Callout`, `NameTag`, `TitleBlock`).

**Fixed (brief and owner, 2026-10-21; followed here):**

- The Section look; orange only for **energy flowing backwards** (wheel → motor → battery) and the **brake-light signal path when
  the car lights the lamps by itself**; screens read through the DetailBox.
- Focus objects realistic, people stylized; US setting, generic signs, no brands.
- **Day**; **YOU's car faces left** (the driver's side is the cut side).
- **The testers' finding drawn on the street**, not in The Lab.
- Title line 2 `NO. 006 · THE STOPLIGHT · 5:40 PM`; a **Counter range** for 64–95.
- **Our own music**, no "feel it" shake, no music dips.
- Frame 0 opens on the hook's action (an EV rolling to a stop at a red light, the driver's foot visibly off the brake), then
  reveals.
- The story order in the coordinator's brief; loop to frame 0 if natural; every line re-timed at 2.92 words/s.

**Times** are estimates at 2.92 words/s from the script words only: 196 words = **67.12 s**. `performance.txt` adds two `[pause]`
tags (before lines 12 and 13), about 0.5 s each: ≈ +0.5 s from line 12, ≈ +1.0 s from line 13. **Spoken length ≈ 68.1 s**, plus a
1.0 s hold on the loop frame ≈ **69.1 s**. Over 60 s, so our own music or none (approved). The estimated `transcript.json`
(`yarn timings`, 2.5 words/s) ends at 80.4 s. Re-time against the real take before writing `spec.ts`.

**Mood: Day** (approved), 5:40 PM. The brake lamps go from a dark lens to lit red, and the signal's red and green read as flat lenses.
One mood for both locations, no time-passes beat.

## The world

Two locations, joined by `slide` (18 frames). Inside a location every framing change is a `continue` glide.

- **K, YOU's electric car, cut open, on a city street** (an extension of `car-slice`, see S1). The car **faces left (−x)**, so the
  section runs along the driver's door line. **YOU sits whole, in profile**, with the pedal box and the right foot in plain view. A
  generic **front-drive** layout (no maker), so one framing (`drive`) holds:
  - the near front wheel, cut at its mid-plane;
  - the **drive unit**, cut at its own mid-plane as an object cut-away (copper stator windings, rotor and magnets, reduction gears,
    the half-shaft out to the wheel, the inverter on top, phase and HV cables);
  - the firewall, the **pedals and YOU's foot**;
  - the front of the **battery pack**, cut lengthwise under the floor (casing, modules, cells, cooling plate).

  That framing is **frame 0 and the last frame**. The rear of the car faces the camera at ≈ 64°, so the tail lamps and the third
  brake light read in the wide framing. The road is a **US city lane laid across the frame** (the No. 002 street block, re-dressed)
  with a **white stop line** that the road scroll brings to a set place. Behind the cut:
  - a curb and sidewalk;
  - a **post-mounted US traffic signal at the corner** (black housing, three lenses; red or green lit, flat, the yellow never lit)
    that arrives with the road scroll;
  - a **SPEED LIMIT 25** sign (R2-1, `RoadSigns`);
  - low storefronts at block distance with blank awnings and no names.
- **T, the street in depth** (new `city-slice`, see S3). A **one-way US downtown street cut square to the road**, the road running
  into depth, traffic driving away from the camera (the `highway-slice` grammar on the `street-slice` road cut). Cut face: sidewalk
  with a storefront edge, curb, **three lanes**, far curb and sidewalk, hatched base, a storm drain and a duct bank in neutral greys.
  Up the road (≈ 35 m): **stop line, ladder crosswalk, mast-arm signal**, red. ONE WAY and SPEED LIMIT 25 near the plane. Generic
  facades. Cars **whole, never cut**: grey extras (drivers in `CAST_NEUTRAL` behind tinted glass) and YOU's cobalt car.

**Colour.** Orange is only the system:

- the **regen path** (`OrangePath` at the No. 005 energy-path radius 0.0225): near front hub → half-shaft → gears → rotor; the
  **stator windings light** coil by coil; then phase cables → inverter → HV cable → battery modules filling front to back;
- the **brake-light signal path**: inverter → along the sill → the rear lamps, only while the car lights them by itself (K only);
- the **CHARGE zone** on the dashboard's power meter in the detail box (the system's mark on a screen, § 1).

**Not orange:**

- **The brake lamps:** `HIGHWAY.tailLight` red, flat emissive, never bloomed.
- **The signal lenses:** red and green flat; the yellow never lit (if it ever is, `warning`).
- **Copper windings:** under 60% saturation.
- **The caliper:** `REAL.caliper` grey.
- **Rust:** a brown outside the reserved band (S6).
- **No heat glow** on the disc.
- **Turn signals** unlit and desaturated, **headlights** off.
- **The brake-pedal circuit:** never drawn.

**Title block** (frame 0 to ≈ 7.0 s): line 1 the spoken question without "So", `What's doing the braking?` (25 characters, one
line); line 2 `NO. 006 · THE STOPLIGHT · 5:40 PM` (🎭 story time).

**Framing sizes** (the one fixed 3/4 angle, fov 26°; distances set on the test still).

- **C**, close (one focus object fills the frame), all in K:
  - `pedals` (the foot and the pedal box);
  - `motor` (the drive unit in section);
  - `battery` (modules under the floor);
  - `brake` (the brake corner: disc, caliper, pads);
  - `pads` (pads and the disc's swept face);
  - `disc` (the swept face, closest).
- **M**, medium, in K:
  - `drive` (frame 0: front wheel, drive unit, pedals and foot, front of the battery, the stop line on the cut road);
  - `cabin` (YOU in profile, the wheel, the cluster, the footwell, and a post-mounted signal at frame top-left as it arrives).
- **MW**, medium-wide:
  - K: `wide` (the whole cut car, the corner signal, the lamps at frame right);
  - T: `follow` (YOU's car and the car behind it).
- **W**, wide, in T:
  - `lanes` (two lanes at the stop line);
  - `queue` (the street to the signal, five cars in a lane).

Camera keys do every move: a glide into each framing (0.7 to 1.0 s), then a push, truck or pull-back on the line's key word.
**Subject band:** on C and M shots the subject sits above y ≈ 1030, clear of the caption band.

## The table

| # | Words | Cue | In → out (s) | Shot | On screen | Camera motion | What moves (2–3 s rule) | Transition into next | Overlays | SFX idea | New or existing | Flag |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1a | Some electric cars stop at red lights | `Some electric cars` | 0.00 → 2.40 | **M** (`drive` on K) | **Frame 0:** YOU's cobalt car cut open, front end: the near front wheel cut at its mid-plane, rolling slowly; behind it the drive unit in section; the **pedal box with YOU's right foot resting flat on the floor, clear of both pedals**; the front of the battery under the floor; on the cut road ahead, the **white stop line** coming up | Holds (drift 0, for the loop) | The road scroll **slows**; the front tire **rolls to a stop on the stop line** at "lights" (2.05) | `continue` | Title block, captions | City bed from frame 0 (distant traffic, low); the **EV whine falling** to silence at the stop (self-made) | **New:** K (S1): car facing left, pedal box and foot, drive unit and battery cut-aways, stop-line placement | No orange yet, although regen is running: the system is revealed in line 4, on this same picture. The red light isn't in this frame (see Line fixes 1) |
| 1b | without the driver touching the brake. | `without the driver` | 2.40 → 4.45 | **C** (`pedals`) | The footwell: the foot flat, heel down; the **brake pedal up, untouched**; the accelerator up | Glide 2.4 → 3.2 s | The camera lands on the foot by "touching" (3.42); the accelerator settles the last mm; the foot **doesn't move** | `continue` | Title block, captions | — | New: pedal box (S1) | — |
| 2 | So what's doing the braking? | `So what's doing` | 4.45 → 6.16 | **MW** (`wide` on K) | The reveal: the whole cut car **stopped at the line**, YOU at the wheel in profile, the **corner signal red** at frame left, the **brake lamps lit** at frame right | Log pull-back 4.5 → 5.5 s (`log: true`), holds | The pull-back is the move; the lamps are lit as it lands (5.5) | `continue` | Title block; name tag **YOU** 4.7 → 6.1 (left margin, under the title block); captions | — | Existing `cameraKeys` (`log`), `NameTag` (`carHeadBoxOnScreen`) | Question spoken 4.45 → 6.16: inside the 5–6 s window. Sub-beat under 3 s: an event in scene 1 |
| 3a | Say you're driving one, | `Say you're driving` | 6.16 → 7.53 | **MW** | As 2 | Holds | The **signal turns green** (6.3); the lamps go dark, the car **pulls away** (wheels turning, road streaming) | `continue` (glide to `cabin`) | Title block fades 6.96 → 7.3 (0.8 s after the question); captions | Whine rising | New: signal state keys (S1) | Sub-beat (1.4 s): stays in scene 1 so the title block holds past the question |
| 3b | and you lift your foot as a red light comes up. | `and you lift` | 7.53 → 11.30 | **M** (`cabin`) | YOU at the wheel in profile, the cluster, the footwell with the foot on the accelerator; the street streaming past | Glide 7.5 → 8.2 s, slow push | At "lift" (8.22) the **foot lifts off the accelerator** and rests on the floor, the pedal springs up; at "red light" (9.93) the **next corner signal arrives at frame top-left, red** | `continue`, glide down to `drive` | Captions | Whine falling from the lift (8.2) | New: foot keys, signal arriving with the scroll (S1) | The signal at the top of `cabin` is set on the test still (it must clear y 288 and the frame edge) |
| 4 | The wheels keep spinning, and now they're the ones turning the motor. | `The wheels keep` | 11.30 → 15.41 | **M** (`drive`) | **Frame 0's picture**, the car rolling toward the line | Glide 11.3 → 12.1 s, slow push | At "spinning" (12.33) the **orange starts at the wheel hub** and runs along the **half-shaft** into the gears; it reaches the **rotor** at "motor" (15.07): the wheel is now turning the motor | `continue` | Captions | A **soft electric hum** under the whine from 12.3 (the "system active" bed, ≈ 20 dB under) | **New:** regen path keys (S1). Existing: `OrangePath` | HARD TO SHOW (mild): the wheel spins the same way before and after; the orange arriving is what shows who's turning whom. The repeat of frame 0's picture is on purpose: the same shot, now with the system lit |
| 5a | That turns the motor into a generator, | `That turns the` | 15.41 → 17.81 | **C** (`motor`) | The drive unit cut at its mid-plane: rotor and magnets inside the copper stator, the phase cables leaving the top | Push in 15.4 → 16.2 s | At "generator" (17.47) the **stator windings light orange coil by coil** as each magnet sweeps past; pulses leave through the **phase cables** | `continue` | Captions | Hum swells slightly | New: stator glow (S1) | — |
| 5b | and making that electricity is what slows you down. | `and making that` | 17.81 → 20.89 | **C** (slow push) | As 5a; the half-shaft and the edge of the wheel at frame left | Slow push 0.04/s | At "electricity" (18.84) the pulses **brighten**; at "slows" (19.86) the **rotor visibly slows** with the wheel and the gears | `continue`, glide down to `battery` | Captions | Whine pitch falling with the rotor | New: rotor speed tied to the car's speed (S1) | — |
| 6a | The electricity flows back into your battery, | `The electricity flows` | 20.89 → 23.29 | **C** (`battery`) | The battery pack in section under the floor, the HV cable arriving from the inverter | Glide 20.9 → 21.7 s | The orange **runs down the HV cable into the modules**, which **fill front to back** (a level in each module, not a wash) by "battery" (22.95) | `continue`, log pull-back | Captions | Hum | New: battery cut-away, fill keys (S1) | — |
| 6b | and the car keeps slowing until you're stopped at the line. | `and the car` | 23.29 → 27.05 | **MW** (`wide`) | The whole cut car, the red corner signal ahead, the orange in the battery under the floor | Log pull-back 23.3 → 24.3 s | At "keeps slowing" (24.3) the **signal path draws** from the inverter **along the sill to the rear lamps**, which **light**; the car rolls on, slowing, and **stops on the line** at "line" (26.7); the orange settles | `slide` (to T) | Captions | Whine falling to silence | New: signal path keys (S1) | Scene 5 is 6.2 s with two framings, at the top of the range (three events). The orange signal path appears here so line 9 can lean on it |
| 7a | Some electric cars can't stop all the way, | `Some electric cars can't` | 27.05 → 29.79 | **W** (`lanes` on T) | **T:** the one-way street at the stop line, two lanes: **YOU's cobalt car stopped at the line**, lamps lit; in the next lane a **grey electric car** coming up, lamps lit, slowing | Slide in, slow crane 0.04/s | The grey car **slows but keeps creeping** toward the line (27.5 → 31.8) | `continue` | Captions | Whoosh on the slide; street bed | **New:** T `city-slice` (S3) | The cue has four words because "Some electric cars" also starts line 1 (`findCue` searches forward, so three would resolve too; four is unambiguous) |
| 7b | and those only slow until you press the brake. | `and those only` | 29.79 → 32.88 | **W** | As 7a | Holds | At "press" (31.85) the grey car's **lamps brighten** (its driver presses the brake) and it **stops** beside YOU | `continue`, glide to `follow` | Captions | A soft brake squeak at "press" (≈ 16 dB under) | New: per-car `liftAt` / `brakeAt` (S3) | Sub-beat: one scene with 7a. 🎭 illustrative. No callouts (the captions name both cases) |
| 8a | Either way, the driver behind you can't see your foot, | `Either way, the` | 32.88 → 36.30 | **MW** (`follow`) | Behind YOU's car: a **grey car rolling up behind it** (the nearest car, just beyond the plane), its driver a grey figure behind the rear glass; YOU's car ahead, lamps lit | Glide 32.9 → 33.7 s, slow push | The follower **closes the gap**; at "can't see your foot" (35.3) the camera's slow push frames YOU's car body: no foot to see from here | `continue` | Captions | Tires rolling | New: follower car (S3) | — |
| 8b | so they're watching your brake lights. | `so they're watching` | 36.30 → 38.36 | **MW** | As 8a | Slow push toward YOU's lamps | At "watching" (37.0) the follower **eases off and stops** a car-length back as it reaches YOU's lit lamps (38.0) | `continue`, pull-back to `queue` | Captions | — | S3 | Sub-beat: one scene with 8a |
| 9 | Testers found most electric cars they checked turn those lights on by themselves when they slow firmly. | `Testers found most` | 38.36 → 44.18 | **W** (`queue`) | The street in depth to the signal; in the third lane, **five generic electric cars** approaching the red, seen from behind | Pull-back 38.4 → 39.4 s, slow crane | From "most" (39.0) the five **lift off in turn** (0.8 s apart, front car first) and slow; each one's **lamps light** as it slows, **except the fourth**, which slows with its lamps **dark** (🎭: 4 of 5 ≈ the tested fleet's share). All five queue to the line by "firmly" (43.8) | `slide` (to K) | Captions | Five whines falling, staggered | S3 fleet keys | No orange: whole cars hide the path, which line 6b showed |
| 10a | And with the motor doing so much of the slowing, | `And with the` | 44.18 → 47.60 | **MW** (`wide` on K) | Back on YOU's cut car, driving again, then slowing for the next light | Slide in, slow push | At "motor" (45.2) the **orange runs wheel → motor → battery** again; the car slows | `continue`, glide to `brake` | Captions | Whoosh on the slide; whine falling; hum | Existing (S1) | — |
| 10b | your regular brakes get a lot less work. | `your regular brakes` | 47.60 → 50.34 | **C** (`brake`) | The **near front brake corner**: the vented disc (vanes in section), the caliper with its piston cut, **two pads** with a hairline gap | Glide 47.6 → 48.4 s | The disc **spins freely**; the pads **never touch it** while the car slows (the orange on the half-shaft at frame edge still lit) | `continue`, push to `pads` | Captions | — | **New:** brake corner detail (S2). Existing: `RealWheel` rotor and caliper | Scene 9 (10a + 10b) is 6.2 s, two framings. "A lot less" isn't "none": nothing on screen claims the pads never work |
| 11 | One modeling study estimates brake wear drops by 64 to 95 percent. | `One modeling study` | 50.34 → 54.95 | **C** (`pads`) | Close on the pads and the disc's swept face: the friction material **thick** (🎭), the disc clean grey | Slow push 0.05/s | The disc turns slowly; the pads stay off it | `continue`, the `[pause]` lands on it | **Counter** `64–95`, unit `%`, sub `LESS BRAKE WEAR` (above), from "brake wear" (51.7): 0 → 64 by "64" (53.1), `–95` lands on "95" (53.8); out at 54.9 | none (quiet under the card) | New: Counter range (S5, approved) | No source on screen; "one modeling study" stays in the voice |
| 12a | There's a catch, though, | `There's a catch` | 54.95 → 56.32 | **C** (push to `disc`) | The disc's swept face, the car parked (the wheel stops) | Push 55.0 → 55.8 s | The wheel **comes to rest**; the push frames the bare swept face | `continue` | Captions | — | S2 | Sub-beat (1.4 s): one scene with 12b |
| 12b | since a brake supplier says discs used this rarely can rust. | `since a brake` | 56.32 → 60.59 | **C** (`disc`) | As 12a | Slow push 0.06/s | A **light brown rust bloom** spreads across the swept face in a time-lapse from the edges in (57.0 → 59.7), fully there at "rust" (59.75) | `continue`, the `[pause]` lands on the glide | Captions | none (a silent beat; music only) | New: `rust` keys, rust token (S2, S6) | Rust outside the reserved band (S6). A change on the object, not a mood change. 🎭 illustrative |
| 13a | Still, next time you lift your foot in an electric car and feel it pull back, | `Still, next time` | 60.59 → 66.07 | **M** (`cabin`) | YOU at the wheel in profile, the cluster, the foot on the accelerator; the car driving | Glide 60.6 → 61.4 s, slow push | At "lift" (61.96) the **foot lifts**; the cluster's power meter swings into **CHARGE**; at "pull back" (65.4) **YOU sways gently forward** against the belt | `continue`, glide to `drive` | **Detail box** `ev-dashboard` (right side, leader to the cluster) from 62.6 to 65.9: **speed falling 28 → 19 mph**, the power meter in the **CHARGE** zone (orange) | Whine falling; hum | **New:** `ev-dashboard` (S4); `lean` gesture (S1) | Not the shake (approved: lift-off braking is smooth) |
| 13b | that's the motor charging your battery. | `that's the motor` | 66.07 → end (≈ 68.1 + 1.0 s hold) | **M** (`drive`), **landing on frame 0's picture** | Front wheel, drive unit, foot off the pedals, battery front, the stop line arriving on the cut road | Glide lands on `drive` by 66.9; drift 0 | The orange **flows wheel → rotor → battery** at "charging" (67.1); in the hold the **orange fades** (68.2 → 68.9) and the road scroll places the stop line where it was on frame 0. Last frame: the car rolling slowly, foot off, no orange: frame 0's picture | **Loop** to frame 0 | Captions end before the hold; nothing else | Whine low and falling, as at frame 0; music ends in silence on the last frame | Existing (K) | TIMED: the car's speed and the stop line's place on the last frame must match frame 0. The orange fade in the hold is the one cheat (regen hasn't stopped); see Line fixes 13 |

Spec scenes: 13 in ≈ 69 s (≈ 5.3 s each). Sub-beats under 3 s (2, 3a, 5a, 6a, 7a, 8b, 10b, 12a) are events inside one scene:

| Scene | Location | In → out (s) | Beats |
|---|---|---|---|
| 1 | K | 0 → 7.53 | 1a, 1b, 2, 3a; holds the title block |
| 2 | K | 7.53 → 11.30 | 3b |
| 3 | K | 11.30 → 15.41 | 4 |
| 4 | K | 15.41 → 20.89 | 5a, 5b |
| 5 | K | 20.89 → 27.05 | 6a, 6b |
| 6 | T | 27.05 → 32.88 | 7a, 7b |
| 7 | T | 32.88 → 38.36 | 8a, 8b |
| 8 | T | 38.36 → 44.18 | 9 |
| 9 | K | 44.18 → 50.34 | 10a, 10b |
| 10 | K | 50.34 → 54.95 | 11 |
| 11 | K | 54.95 → 60.59 | 12a, 12b |
| 12 | K | 60.59 → 66.07 | 13a |
| 13 | K | 66.07 → end | 13b |

Rhythm: M | C | MW | MW | M | M | C | C | C | MW | **W** | **W** | MW | MW | **W** | MW | C | C | C | C | M | M. Wide shots
three times, all on T, where many cars are the point. The four C shots in a row (10b → 12b) are one continuous push into the brake,
pads and disc. `drive` appears three times (frame 0, line 4, the loop): the same picture, first plain, then lit.

Card budget:

- the YOU name tag (2, under the title block, no card);
- the Counter (11);
- the `ev-dashboard` detail box (13a).

No callouts, no statement cards, no full-frame screens, **no X-ray** (the car is cut by the section; drive unit, battery and brake
corner are object cut-aways, § 3).

Transitions: 2 slides (K → T at 7a, T → K at 10a); the rest are `continue` with glides; no cuts.

**Motion rule:** in every scene a camera move lands within its first second, and a story event (the stop, the foot, the signal, the
orange arriving, a car creeping or stopping, the queue, the rust) follows within 2 to 3 s. Check in Studio playback.

## Line fixes

No word changes proposed: the script is approved and fact-checked (the recheck's line-12 🟡 is fixed by the current wording).
These are picture notes, all handled on screen.

| Line | Flag | How the picture handles it | Mark |
|---|---|---|---|
| 1 | HARD TO SHOW (mild): the hook names the stop, the red light and the foot. At the fixed angle a signal head ≈ 3 m up doesn't fit above a frame that also shows a readable foot | Frame 0 shows the stop and the foot (the tire stopping on the stop line, the foot clear of the pedals). The red signal arrives in the reveal at 5.5 s. **Test first:** a pedal pad must read at ≥ 40 px in `drive`; if not, frame 0 opens on `pedals` and the wheel stops in the glide out | none |
| 2 | Short sub-beat (1.7 s) | Scene 1 runs to 7.53 so the title block holds 0.8 s after the question | none |
| 3 | The story restarts after the reveal ("Say you're driving one") | The light turns green, the car pulls away, the foot lifts as the next red signal arrives; one continuous drive | none |
| 4 | HARD TO SHOW (mild): the reversal has no motion of its own | The orange arriving wheel → motor on frame 0's picture | none |
| 6, 9, 10 | Scenes of 6.2 s, 5.8 s, 6.2 s | Each has two framings or a moving queue; at the top of the 3–6 s range, not over it in practice | none |
| 7 | Two outcomes | Two cars in two lanes; the brake press at "press" | none |
| 8 | "can't see your foot" is an absence | Seen from behind the follower: only the car body and its lamps | none |
| 13 | The loop needs no orange on the last frame, but regen is still running | The orange fades in the 1 s hold after the voice. Alternative: keep it lit and accept that the replay drops it at frame 0 (a pop). Recommendation: the fade | none |

## Pause and tag notes for `performance.txt`

Words unchanged; only tags. For the voice agent; I don't edit the file.

| Line | Now | Change | Why | Mark |
|---|---|---|---|---|
| 12 | `[pause] There's a catch` | keep | Lands between the Counter and the rust push | — |
| 13 | `[pause] Still, next time` | keep | Lands on the glide from the disc to the cabin | — |
| 10 | `And with the motor` | **add `[pause]`** (optional) | Lands on the slide T → K; 3 tags in 13 sentences, inside "about 1 per 3" | optional |

## Reuse

| Part | Where it's used | What it already does |
|---|---|---|
| `car-slice` (`CarSliceScene`) | K, the base | The car cut along its near side, near wheels cut at their mid-plane, YOU driving, `driving` speed keys (`integrateSpeed`), `road: 'street'` lane block, `cameraKeys` (`log`), framings, `gestures`, `carHeadBoxOnScreen` (name tag), `clusterOnScreen` (detail-box leader), `OrangePath` at `VIB_R` 0.0225 |
| `RealCar` + `CarShell` | K (cut), T (`whole: true`) | Realistic body, cabin, cluster face; tail lamps (`HIGHWAY.tailLight` / `tailLens`, flat, never bloomed); bodies `you` / `extra` |
| `RealWheel` (`axle: true`) | K brake corner | Realistic wheel and cut section; a rotor (`REAL.rotor`) and caliper (`REAL.caliper`): the base for S2 |
| `highway-slice` (`HighwaySliceScene`) | Pattern for T | Whole cars driving away from the plane (never cut), `HighwayTraffic` (lane, ahead, speed), tail lamps, signs facing the camera |
| `RoadSigns` | K and T | Generic R2-1 SPEED LIMIT (25), MUTCD sizes, Inter 700 legend |
| `street-slice` / `StreetSlice` | T's road cut | Road cut square to the street, curbs, sidewalks, hatched layers, under-road services, `through` / `beyond` vehicle handling |
| `Figure` + `rig` | YOU in K; drivers in T | `drive` pose; `CAST_NEUTRAL` extras behind tinted glass |
| `DetailBox` `dashboard` | Base for `ev-dashboard` (S4) | Cluster crop with `speed` (mph), `tireLight: false` |
| `Counter`, `NameTag`, `TitleBlock`, `Captions`, `sfx` overlay, `music` | Overlays and sound | As built |
| `SectionStage`, `SectionLights`, `cutLook`, `SectionCamera` / `projectToFrame`, `keyframes.ts`, `moods.ts`, `skyTexture`, `useStudioEnv` | Both locations | The Section look, Day light, camera keys, anchors |
| `transitions.ts` (`slide`, `continue`) | 2 slides, glides | As built |

Not reused: `highway-slice` itself, `musical-road`, `GrooveCut`, `shake` / `shakeKick`, `music.dips`, `Callout` (no callouts now).

## Missing: scene-builder tasks (not requested yet)

Changes from the first draft are marked **[changed]**, **[new]** or **[dropped]**.

| # | Task | Size | Short spec |
|---|---|---|---|
| S1 | **`car-slice` EV variant (K)** | large | **Layout:** `facing: 'left'` (driver's side cut, YOU whole in profile, rear toward the camera); front-drive. **Pedal box:** realistic accelerator and brake pedals; right-foot keys `accel` / `floor` (accelerator springs back). **[dropped]** the `brake` foot pose (no pedal press in K now). **Drive unit** cut at its mid-plane (copper stator, rotor and magnets, gears, half-shafts, inverter, phase and HV cables) and **battery pack** cut lengthwise (casing, modules, cells, cooling plate). **`regen` keys (orange):** hub → half-shaft → gears → rotor → windings lighting coil by coil → inverter → HV cable → modules filling; fades out on a key (the loop). Rotor speed follows the car's speed. **`signal` keys (orange):** inverter → sill → rear lamps; `brakeLights` keys (flat `HIGHWAY.tailLight`). **[changed]** the near tail lamp cut in section is now nice-to-have: it's seen only in `wide`; the `rear` framing is dropped. **`road: 'city'`:** US city lane, curb and sidewalk, SPEED LIMIT 25, storefronts. **[new]** a **stop line** that the road scroll brings to a set screen place (stop exactly on it, and repeat frame 0's position on the last frame); **post-mounted corner signals** that arrive with the scroll, with **state keys** (red / green, flat lenses, yellow never lit). **[dropped]** the car ahead (no stop-and-go beat) and the nose dip (no hard stop). `lean` gesture (a gentle sway forward). **Framings:** `drive` (frame 0 and the loop), `pedals`, `cabin` (with room for a signal at frame top-left), `motor`, `battery`, `wide`, `brake`, `pads`, `disc`. **Anchors:** cluster, YOU's head. **Test still first:** `drive` at frame 0 (pedal pads ≥ 40 px, stop line readable) and `cabin` with the arriving signal |
| S2 | **Brake corner detail** (in `RealWheel`) | medium | A realistic vented disc (vanes in section), the caliper with its piston cut, two pads (backing plate plus friction material, thickness readable at `pads`), a hairline gap; `padThickness` (🎭); `rust` 0 → 1 keyed bloom from the edges in, brown outside the reserved band. No heat glow. **[dropped]** `clamp` keys (the pads stay off in every beat now) |
| S3 | **`city-slice` scene (T)** | large | One-way US downtown street cut square to the road, road into depth, traffic driving away (`highway-slice` car logic on the `street-slice` road cut). Cut face: sidewalk with storefront edge, curb, three lanes, far curb and sidewalk; hatched base, storm drain, duct bank. Up the road: stop line, ladder crosswalk, mast-arm signal (red, flat). ONE WAY and SPEED LIMIT 25 near the plane. Generic facades. **Cars** whole, never cut, each with: `lane`, `ahead`, `speed` keys, `liftAt`, `lamps` (`'auto'` = on at lift-off, or `false` = stays dark), `brakeAt` (lamps on or brighter, a firmer stop), `stopAt` (the line or the car ahead); `CAST_NEUTRAL` drivers; YOU's car `body: 'you'`. **[changed]** the beats it serves: **two lanes** (YOU stopped, a car that creeps until `brakeAt`), a **follower** that rolls up behind YOU and stops a car-length back, the **five-car queue** with one dark car. **Framings:** `lanes` (W), `follow` (MW), `queue` (W) |
| S4 | **`DetailBox` `ev-dashboard`** | small | Unchanged: speed in mph with keys (falling), a power meter whose **CHARGE** zone fills **orange** during regen, no tire light, no brand, text ≥ 28 px |
| S5 | **`Counter` range** | small | Unchanged (approved): `64–95` with one unit `%`; the first number counts 0 → 64, then `–95` lands at `toAt` |
| S6 | **Theme tokens** (values to the brand-director) | small | `REAL.rust` (saturation < 60% or lightness < 35%; real rust's hue sits inside the reserved band); `REAL.copper` (saturation < 60%); `signalRed` / `signalGreen` (**[changed]**: the green is now lit on screen, in 3a); battery casing and module colours |
| — | Audio (tooling) | small | Self-made EV whine that follows speed (free, deterministic); a city street bed (self-made, or ElevenLabs: paid, ask first); a soft brake squeak (7b); the slide whoosh and the hum as before |

## Frame 0 and the loop

**Frame 0** (Day, 5:40 PM): K at `drive`, the fixed 3/4 angle. The front of YOU's cobalt car, cut open (subject ≈ y 650 to 1030):

- the near front wheel cut at its mid-plane, rolling slowly;
- the drive unit in section behind it;
- the pedal box with **the right foot flat on the floor, clear of both pedals**;
- the front of the battery under the floor;
- the white stop line coming up on the cut road;
- the sidewalk beyond, sky under the title block (top y 300, one line to ≈ y 400).

Nothing orange. Readable: only the title block and the first caption. Drift 0 on this scene and the last. The tire stops on the
line at 2.05 s.

**Last frame:** the same picture after line 13: `drive`, the car rolling slowly, foot off, the stop line at frame 0's place, no
orange (faded in the hold), no card, captions gone. On replay the cut to frame 0 adds only the title block, and the car rolls on
to its stop. The last line ("…lift your foot…") leads into the first ("…stop at red lights…").

## Cover idea

The `drive` framing at about 22 s: the front tire on the stop line, the foot clear of the pedals, the orange running wheel → motor
→ battery. Cover text: "No brake. Still stops." The publisher decides.

## Decisions for the owner

None new. All earlier decisions are approved and applied. Two updates for the publisher's 🎭 "Illustrative:" line, which follow
from the new order:

- the creeping car (7), and the follower (8), join the list;
- the dark car now appears only in the queue (9).
