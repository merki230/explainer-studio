# No. 008 · Drive by wire: audio + visual script

Draft 2 by the director, 2026-10-23, for the locked 12-line gas-and-electric script (186 words), before voice. It replaces
draft 1, which was written for the earlier script with limp mode and the 2011 rule. Inputs:

- `script.txt` and `performance.txt` as of today;
- `sources.md` (fact-checks three to five, all PASS);
- `brand/style-guide.md` v0.12 and `brand/brand.md`;
- the parts in `src/scenes` (`car-slice` with `variant: 'ev'` and `road: 'highway'`, `highway-slice`), `src/three` (`real/EvDrive`,
  `real/RealCar`, `real/CarShell`, `real/RealWheel`, `section/HighwaySlice`, `section/Figure`, `OrangePath`) and `src/components`
  (`NameTag`, `TitleBlock`);
- No. 006's `spec.ts` as built, the reference for camera keys, state carry and sound levels.

**Owner decisions, 2026-10-23 (applied):**

1. One wet highway, Day after the rain, no falling rain, no new mood.
2. The question's timing is kept.
3. Steer-by-wire is shown as a what-if on YOU's car (🎭).
4. **No. 006's music bed is reused** (free): copy `src/videos/one-pedal/audio/music.mp3` into `audio/` when the sound is wired.
5. Title line 2 is `NO. 008 · THE GAS PEDAL · 3:50 PM`.
6. One computer box per car (🎭).

**Fixed (brief and owner rules from No. 006; followed here):**

- **The camera path goes one way.** No close → wide → close. Each location gets one dive in and one pull out, every scene starts
  exactly where the previous one ended, and wheel, road and pose state carry across cuts. That includes K's return after E and R.
- **The opening reads in the first second:** the whole car on the road, the gas pedal, and the foot on it.
- **Brake lamps:** a clear, flat red on any braking or stopped car whenever they're in frame (`HIGHWAY.tailLight`, never bloomed).
- **Foot actions:** the light sneakers (`section.sneaker`) and `footScale`, readable at phone size.
- **Music** from frame 0 (1.5 s fade-in), about 12 dB under the dry voice, no duck, silent on the last frame. SFX planned up front
  (§ Sound plan): self-made, physical sounds; nothing "futuristic".
- **The Section look**, v0.12. Orange (`#ff5b14`) only for the hidden system:
  - the signal path pedal sensor → computer → throttle motor (gas), or → the motor's power (EV);
  - the computer saying yes (a pulse passes) or no (a pulse dies at the computer, the outgoing leg dims);
  - the brake-switch lead in the override;
  - the steer-by-wire signal at the end.
  Focus objects are realistic, people stylized.
- **US audience**, generic cars, no brands, US units.

**Times** are estimates at 2.92 words/s (No. 006's rate) from the script words: 186 words = **63.70 s**. `performance.txt` adds
three `[pause]` tags (before lines 7, 10 and 12), about 0.5 s each. **Spoken length ≈ 65.2 s**, plus a 1.0 s hold on the loop
frame ≈ **66.2 s**. That's over 60 s; the music is our own (No. 006's bed, 71 s). Re-time every value against the real take
before writing `spec.ts`.

**Mood:** Day after the rain, 3:50 PM (🎭). Wet roads from frame 0 to the last frame: dark asphalt, a soft sky sheen, a fine
spray off the tires.

## The world

Three locations, joined by `slide` (18 frames). Inside a location every framing change is a `continue` glide.

- **K, YOU's gas car, cut open, on the wet highway lane** (new `car-slice` `variant: 'gas'`, S1, on the No. 005 `road: 'highway'`
  lane with `wet`, S2). It's the No. 006 EV layout with an engine in front:
  - the car faces left (−x), so the section runs along the driver's door line;
  - **YOU sits whole, in profile**, hands on the wheel, the right foot in a light sneaker on the pedals;
  - realistic, generic focus objects, no maker:
    - the **accelerator pedal module**: a hanging pedal with a sealed sensor housing at its pivot;
    - the **brake pedal** with its switch;
    - the bare **firewall** (no cable);
    - the **computer**: a finned aluminium box on the engine side of the firewall, up by the cowl, above the pedals;
    - a **transverse four-cylinder** as an object cut-away;
    - the **electronic throttle body**, cut through its bore: butterfly plate, a small DC motor and gears. It's scaled ×1.5 (🎭);
    - the **steering column**: wheel → column → steel shaft with U-joints (🎭 a little thicker) → rack;
    - the near front wheel cut at its mid-plane;
    - a black wiring loom.
  - Cruise at ≈ 45 mph (🎭).
- **E, FRIEND's electric car, cut open, on the same wet highway** (No. 006's `car-slice` `variant: 'ev'`, extended in S6).
  - Same layout and angle as K, so the cut from K reads as **the same section with the engine swapped for a drive unit**: the
    drive unit cut at its mid-plane (copper stator, rotor, gears), the inverter on top, the battery under the floor, the pedals.
  - **No intake and no throttle anywhere.**
  - **FRIEND** (green sweater, the cast's) at the wheel, in a body colour other than YOU's cobalt, so no one reads it as YOU's
    car changing.
- **R, the wet curve, in depth** (`highway-slice` with a new `curve` and `wet`, S2).
  - The road is cut square at the near plane; the carriageway bends left about 30 to 40 m up, wet, with the guardrail
    following, and SPEED LIMIT 45 near the plane.
  - **YOU's cobalt car is whole, never cut**, seen from behind-right, with spray off the tires.
  - No other traffic.

**Why a slide between two cars, not side by side:** two stacked car slices in one frame would be a new kind of scene, and each
car would be half as big. The slide keeps one car per frame at full size. Throttle close-up → drive-unit close-up at the same
place on screen reads as a direct comparison.

**Colour.** Orange is only the system. Every leg rides the real wiring at radius 0.0225, with node dots.

- **K:**
  - pedal sensor → up the firewall → computer → along the intake → throttle motor, with pulses that follow the press;
  - **yes:** a pulse passes the computer;
  - **no:** a pulse dies at the computer and the outgoing leg dims;
  - the brake-switch lead → computer (lines 8–9);
  - the steer-by-wire signal (lines 10–12).
- **E:**
  - pedal sensor → the inverter's control board (the "computer", 🎭 one box) → phase cables → **the stator windings lighting**
    with the power the computer sets;
  - **no:** the windings dim and the rotor slows while the foot stays down (line 6).
  - E shows power going *to* the motor, the reverse of No. 006's regen path; it's still the system's command, not energy for its
    own sake.
- **R: no orange.** The cars are whole and hide the system. Stability control is shown from outside: the drive wheels stop
  spraying and the car straightens.

**Not orange:**

- the brake lamps (flat red);
- the throttle plate, the engine and the loom;
- copper windings while unlit (under 60% saturation);
- the spray (white-grey);
- the steel shaft;
- turn signals unlit, headlights off.

**Title block** (frame 0 to ≈ 9.4 s, 0.8 s after the spoken question):

- line 1: `What happens when it says no?` (29 characters, one line), the spoken question without "so";
- line 2: `NO. 008 · THE GAS PEDAL · 3:50 PM`.

**Framing sizes** (the one fixed 3/4 angle, fov 26°). The distances are targets; S1 and S6 set them on test stills.

- **K:**
  - `car`, MW ≈ 18–20 m: **frame 0 and the last frame**. The whole car on the road, the sneaker on the pedal (≥ 50 px), the
    engine bay, the rear lamps at frame right, the car below y 470;
  - `bay`, M ≈ 6 m: foot and pedals, computer, throttle body (plate ≥ 60 px), the front wheel, the lower column and the rack;
  - `signal`, C ≈ 3 m: the pedal at the bottom, the wire up the firewall, the computer at the top;
  - `pedal`, C ≈ 3 m: the pedal module, its sensor and the foot;
  - `throttle`, C ≈ 2 m: the throttle body in section, plate ≥ 80 px, the motor.
- **E:**
  - `motor`, C ≈ 2.2 m (exists): the drive unit and the inverter, placed where `throttle` sits on screen;
  - `evBay`, M ≈ 7 m (new): drive unit, inverter, pedals and foot, FRIEND's head.
- **R:** `curve`, MW, the car ≈ 200 px wide, the bend in the upper half.

**The path, in distance:**

- **K, the dive:** `car` 20 → `bay` 6 → `signal` 3 → `pedal` 3 (a crane down) → `throttle` 2;
- **E:** `motor` 2.2 → `evBay` 7, its only pull-out;
- **R:** one slow push;
- **K, the pull-out:** `throttle` 2 → `bay` 6 → `car` 16 → (slow pull) 20 = frame 0.

**Subject band:** on C and M shots the subject sits between y ≈ 470 and 1030.

## The table

| # | Words | Cue | In → out (s) | Shot | On screen | Camera motion | What moves (2–3 s rule) | Transition into next | Overlays | SFX idea | New or existing | Flag |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | In most new cars, pressing the gas won't always speed you up. | `In most new cars` | 0.00 → 3.77 | **MW → M** (`car` → `bay`) | **Frame 0:** YOU's car cut open on the wet lane, wheels turning, road streaming; YOU in profile; **the light sneaker on the gas pedal**; the engine bay open at frame left | Holds to 1.0 s, then one log glide in to `bay`, landing at 3.4 | On "pressing the gas" (1.37) the **foot presses deeper**; on "speed you up" (2.74) nothing changes: the road scroll stays steady and the engine note stays flat (a quiet tease of the "no") | `continue` | Title block, captions | Music from 0 (fade-in 1.5); **engine** bed (self-made, ≈ 18 dB under); **wet tire hiss** loop | **New:** S1 `car`, `bay`; S2 wet lane | Test first: sneaker ≥ 50 px at `car`. If the flat "no response" reads as a glitch in Studio, let the car pick up a little instead |
| 2 | A computer has to say yes first, so what happens when it says no? | `A computer has` | 3.77 → 8.56 | **C** (`signal`) | Pedal at the bottom, the wire up the firewall, **the computer** at the top | Glide in 3.6 → 4.4 s | On "computer" (4.11) **the orange draws from the sensor up to the computer**; on "say yes" (5.14) a pulse **passes through** and runs out of frame toward the engine; on "says no" (7.88) the next pulse **dies at the computer** | `continue` | Title block, captions | A soft tick as the computer's node lights (optional); engine follows the yes | S1: path leg 1, `gate` keys (pass / stop) | Question spoken at 6.2–8.6 s |
| 3a | Normally it says yes, | `Normally it says` | 8.56 → 9.93 | **C** (`signal`) | As 2 | Holds | Pulses pass again, steady | `continue`, crane down to `pedal` | Title block fades 9.4 → 9.7; captions | — | S1 | Scene 1 runs to 9.93 so the title block holds 0.8 s past the question |
| 3b | because the pedal is only a sensor that tells the computer how far you pressed. | `because the pedal` | 9.93 → 15.07 | **C** (`pedal`) | The pedal module: the sealed **sensor housing at the pivot**, the sneaker on the pad, the wire leaving upward | Crane down 9.9 → 10.7 s, landing on "pedal" (10.62) | The sensor node lights on "sensor" (11.99); on "how far you pressed" (13.70) the **foot presses in two steps**, and the pulses up the wire come **faster with each step** | `continue`, truck to `throttle` | Captions | Engine rises with each step | S1: pulses that follow `press` | — |
| 4 | In a gas car, the computer tells a small motor to open the throttle. | `In a gas car` | 15.07 → 19.86 | **C** (`throttle`) | The throttle body on the intake, cut through its bore: plate, **small motor** and gears | One glide up and left 15.1 → 16.0 s, landing on "gas car" (16.10) | On "computer" (16.78) the **orange draws computer → motor**; on "small motor" (17.81) the motor's node lights; on "open the throttle" (18.84) the **plate turns open** | `slide` (to E) | Captions | **Throttle-motor whirr** (self-made, 0.25 s, ≈ 16 dB under); intake note up; **whoosh** on the slide | S1: `throttle` keys, leg 2 | — |
| 5 | An electric car has no throttle valve, and its computer sets how much power the motor gets. | `An electric car` | 19.86 → 25.68 | **C** (`motor` on E) | **E:** FRIEND's electric car, the same section with the engine swapped: the drive unit cut open (stator, rotor, gears), the inverter on top, **no intake, no valve**, where the throttle was a moment ago | Slides in on `motor`; slow push 0.03 | On "no throttle valve" (21.23) the frame holds on the empty space; on "its computer" (22.60) **orange arrives from the pedal at the inverter's board**; on "how much power" (23.63) it runs down the **phase cables** and the **windings light**, the rotor speeding up with them by "gets" (25.34) | `continue` | Captions | Whoosh; the **EV whine rising** with the rotor (`yarn sfx:whine --from 200 --to 900`, self-made, ≈ 12 dB under) | **New:** S6 drive-power keys, EV pedal path, EV on the wet highway; existing EV drive unit, `motor` framing | 🟡 handled in the words ("no throttle valve") |
| 6a | Either way, in most cars the computer can say no, | `Either way, in` | 25.68 → 29.11 | **C → M** (`motor` → `evBay`) | The pull reveals FRIEND in profile, the foot pressing, the inverter and drive unit | One pull-back 25.7 → 27.0 s (E's only move out) | On "say no" (28.42) the **windings dim** and the pulses from the pedal **die at the inverter's board** | `continue` | Name tag **FRIEND** 1.4 → 3.2 s (first appearance); captions | Whine **falling** (No. 006 `whine`, copy) | S6: `evBay`, `cut` keys; existing `carHeadBoxOnScreen` | Owner check: FRIEND at the wheel of the EV (report) |
| 6b | and your power gets cut while your foot's still down. | `and your power` | 29.11 → 33.03 (incl. pause) | **M** (`evBay`) | As 6a | Slow pull 0.03 | On "power gets cut" (29.79) the **rotor slows**, the road eases; on "foot's still down" (31.50) the frame holds the contrast: **sneaker pressed, motor dark** | `slide` (to R), on the `[pause]` | Captions | Whine low; whoosh on the slide | S6 | — |
| 7 | If you skid on a wet curve, stability control can cut your power by itself. | `If you skid` | 33.03 → 38.17 | **MW** (`curve` on R) | **R:** the wet highway, the bend; **YOU's cobalt car** whole, from behind-right, already in the bend | Slides in; one slow push toward the bend | On "skid" (33.71) the **rear steps out** (yaw ≈ 15°) and the **drive wheels throw spray** (power on); on "cut your power" (36.45) **the spray stops** and the car **eases straight** by "by itself" (37.83) | `slide` (back to K) | Name tag **YOU** 0.7 → 2.4 s (re-entering in a new slice); captions | Whoosh; **wet skid scrub** (self-made, no squeal, ≈ 14 dB under); engine drops on "cut" | **New:** S2 `curve`, `wet`, `yaw`, `spin` keys | No orange (whole car); the cut reads from outside. The tag covers YOU, who can't be tagged at frame 0 |
| 8 | Your power can also drop when you brake hard and your shoe catches the gas pedal too. | `Your power can also` | 38.17 → 43.99 | **C → M** (`throttle` → `bay`) | **Back in K exactly where it left:** close on the throttle, plate open; the pull reveals the foot, pedals, computer | Slides in on `throttle`; one pull-back 38.4 → 39.6 s (the start of K's only pull-out) | On "brake hard" (40.57) the foot **stamps on the brake** (the brake-switch lead lights), the **nose dips**, YOU leans; on "shoe catches" (41.60) the **sneaker's edge lands on the gas pad and presses it**; gas pulses run again | `continue` | Captions | Whoosh; **brake thump** (self-made, ≈ 15 dB under) on "hard"; engine flares on "catches" | **New:** S1 foot poses `brake` and `both`, nose dip, brake lead; existing `lean` | **State carried by hand** across E and R: `camera.from`, `revsFrom`, foot, plate, path. The lamps are lit but off-frame here (they read in 9b) |
| 9a | That's brake override, which makes the car ignore or cut the gas, | `That's brake override` | 43.99 → 48.10 | **M** (`bay`) | Sneaker across both pedals; both leads into the computer lit | Holds | On "ignore" (46.39) the **gas pulses die at the computer**; on "cut the gas" (47.07) the **outgoing leg goes dark and the plate snaps shut** | `continue`, pull-back to `car` | Captions | Whirr (snap shut); **engine falls to idle** | S1: `gate` keys | — |
| 9b | and it's not something to test on the road. | `and it's not` | 48.10 → 51.68 (incl. pause) | **M → MW** (`bay` → `car` at 16 m) | **The reveal:** the whole car on the wet lane, braking: the **rear lamps a clear red**, the nose down | One log pull-back 48.1 → 49.5 s | The car **slows hard**; then in the pause the **foot goes back to the gas alone**, the lamps go dark and the path re-lights (normal again) | `continue` | Captions | Hiss falling, then back up | S1: `car`, `brakeLights` | — |
| 10 + 11a | Steering could be next. / At least one new pickup in the US already | `Steering could be` | 51.68 → 56.13 | **MW** (`car`, 16 → 17.5 m) | The whole car cruising; the steering column in plain view | Slow log pull (the pull-out's last stretch, 16 → 20 m, lines 10–12) | On "Steering" (51.68) the **steel shaft fades out**, leaving a hatched gap with cut faces (a what-if on YOU's car); from 53.5 an **orange wire draws column sensor → rack motor** across the gap | `continue` | Captions | — | **New:** S1c `steerByWire` keys | 🎭 a what-if on YOU's car (decision 3) |
| 11b | steers by wire, with no mechanical link to the wheels. | `steers by wire` | 56.13 → 60.06 (incl. pause) | **MW** | As 10 | Slow pull | On "steers by wire" (56.13) **YOU turns the wheel a little**, a pulse runs down the wire, and the **near front wheel steers**; on "no mechanical link" (57.50) the hatched gap is the clearest thing in frame | `continue` | Captions | **Steering-motor whirr** (self-made, ≈ 17 dB under) | S1c: `steer` keys | — |
| 12 | Would you trust a computer with your steering, like you probably do with the gas? | `Would you trust` | 60.06 → end (≈ 65.2 + 1.0 s hold) | **MW**, **landing on frame 0's picture** (`car` 20 m) | The whole car, both systems in view | The pull lands on `car` by 64.5; drift 0 | On "steering" (62.46) a **pulse runs the steering wire**; on "gas" (64.86) a **pulse runs the pedal path**, the foot pressing; in the hold **every orange fades** (65.3 → 66.0), **the shaft fades back in**, and the foot settles at frame 0's press | **Loop** to frame 0 | Captions end before the hold | Engine and hiss as at frame 0; music ends in silence on the last frame | Existing (K) | TIMED: speed, press, road and framing on the last frame must match frame 0 |

### Spec scenes

13 spec scenes in ≈ 66 s:

| Scene | Location | Cue | In → out (s) | Beats |
|---|---|---|---|---|
| 1 | K | `In most new cars` | 0 → 9.93 | 1, 2, 3a; holds the title block (`car` → `bay` → `signal`) |
| 2 | K | `because the pedal` | 9.93 → 15.07 | 3b |
| 3 | K | `In a gas car` | 15.07 → 19.86 | 4 |
| 4 | E | `An electric car` | 19.86 → 25.68 | 5 |
| 5 | E | `Either way, in` | 25.68 → 29.11 | 6a |
| 6 | E | `and your power` | 29.11 → 33.03 | 6b |
| 7 | R | `If you skid` | 33.03 → 38.17 | 7 |
| 8 | K | `Your power can also` | 38.17 → 43.99 | 8 |
| 9 | K | `That's brake override` | 43.99 → 48.10 | 9a |
| 10 | K | `and it's not` | 48.10 → 51.68 | 9b |
| 11 | K | `Steering could be` | 51.68 → 56.13 | 10, 11a |
| 12 | K | `steers by wire` | 56.13 → 60.06 | 11b |
| 13 | K | `Would you trust` | 60.06 → end | 12, loop hold |

**Cues:** "In most new cars" (line 1) and "in most cars" (line 6) differ, and the cues stay unique when searched forward.

**State across E and R:** car-slice only carries camera and wheel state between back-to-back scenes, so scene 8 sets it by
hand:

- `camera.from` = scene 3's last framing;
- `revsFrom` from scene 3 plus 18.3 s of driving;
- the foot pose and press, plate angle and lit path as scene 3 ended.

R's car runs at K's speed; E's at the same speed.

**Rhythm:** MW → M | C | C | C | C | C (E) | C → M | M | MW (R) | C → M | M | M → MW | MW ×3.

- The dive is fast (a framing every 2.5 to 3 s).
- E and R each hold one move.
- The pull-out's last 14 s sit in one slowly widening MW framing, kept alive by the shaft, the wire, the wheel turn and the
  pulses.

**Card budget:** two name tags (FRIEND in E, YOU in R), no cards. No callouts, counter, statement card, detail box or X-ray.

**Transitions:** 3 slides (K → E at 5, E → R at 7, R → K at 8), each with the whoosh. The rest are `continue` glides; no cuts.

**Motion rule:** in every scene a camera move lands within its first second and a story event follows within 2 to 3 s. Check
in Studio playback.

## Sound plan

Every effect is a real, physical sound of something on screen. Measure every file's LUFS and set `volume` as No. 006 did.

| Sound | Source | Where | Level (under voice) |
|---|---|---|---|
| Music bed | **No. 006's `music.mp3`** (71 s, copy; decision 4) | Frame 0 → last frame, fade-in 1.5 s, silent on the last frame | ≈ 12 dB, steady, no duck (No. 006's level −18.6 is the starting point) |
| **Engine** (four-cylinder) | **New, self-made** `yarn sfx:engine` (S5) | K throughout: flat on the tease (1), following the yes (2), the steps (3b), the throttle opening (4), dropping in R (7), flaring on "catches" (8), idle on "cut the gas" (9a), cruise to the end | ≈ 18 dB as a bed, ≈ 14 dB on the changes |
| **Wet tire hiss** | **New, self-made** (S5), looped, pitch with speed | Under K, E and R; louder in R | ≈ 20 dB (K, E), ≈ 15 dB (R) |
| Throttle-motor whirr | **New, self-made** (S5), 0.25 s | 4 (opens), 9a (snaps shut) | ≈ 16 dB |
| EV whine, rising | **Existing tool:** `yarn sfx:whine --from 200 --to 900` (free) | 5, the windings lighting | ≈ 12 dB |
| EV whine, falling | **Existing file:** No. 006 `whine` (copy) | 6a "say no" | ≈ 12 dB |
| Wet skid scrub | **New, self-made** (S5) | 7 "skid" | ≈ 14 dB |
| Brake thump | **New, self-made** (S5) | 8 "brake hard" | ≈ 15 dB |
| Steering-motor whirr | **New, self-made** (S5) | 11b, the wheel turn | ≈ 17 dB |
| Slide whoosh | **Existing:** `phone-listening` `whoosh` (copy) | The start of scenes 4, 7 and 8 | as No. 001 (−18) |

No hum bed, no stingers, no risers. Dropped since draft 1: the dashboard chime and the relay tick (limp mode is cut).

## Line fixes

No word changes: the script is locked. These are picture notes.

| Line | Flag | How the picture handles it |
|---|---|---|
| 1 | The hook's "no" is verbal; frame 0 must read in a second | Frame 0 is the whole car, the pedal and the foot. The press with no response is a quiet tease; if it reads as a glitch, the car responds normally and the "no" waits for line 2 |
| 2 | Yes/no is abstract | The pulse passing or dying at the computer is the one picture for "yes" and "no", used again in lines 6 and 9 |
| 4–5 | Gas versus electric | A slide from K's throttle close-up to E's drive unit at the same screen place, the same section with the engine swapped; FRIEND at the wheel so it's clearly another car |
| 5 | "No throttle valve" is an absence | E lands where the throttle sat in K and holds on the empty space before the orange arrives |
| 6 | "Either way" covers both cars, but only E is on screen | E shows the "no" here; K shows it twice more (R's cut, the override) |
| 7 | Stability control's orange can't be seen in a whole car | Shown from outside: the spinning drive wheels stop spraying and the car straightens |
| 8 | The lamps are off-frame in `bay` | Lit through the beat, revealed a clear red in the 9b pull-out |
| 10 | 1.4 s line | One scene with the start of line 11 |
| 11 | The pickup is the fact, but YOU's car is on screen | A what-if on YOU's car (decision 3); disclosed |
| 12 | The loop needs no orange and the shaft back | Every orange fades and the shaft returns in the 1 s hold |

## Pause and tag notes for `performance.txt`

Words unchanged; only tags. For the voice agent; I don't edit the file.

| Line | Tag | Lands on |
|---|---|---|
| 7 | `[pause] If you skid` | The slide E → R |
| 10 | `[pause] Steering could be` | The car back to normal after the override |
| 12 | `[pause] Would you trust` | A beat before the closing question |

## Reuse

| Part | Where it's used | What it already does |
|---|---|---|
| `car-slice` `variant: 'ev'` (`CarSliceScene`, `EvDrive`) | **E as is**, and the base of S1 (K) | Facing left, the pedal box, `foot` keys with `press`, the light sneaker and `footScale`, `driving` speed keys, wheel and road carry, `cameraKeys`, `brakeLights`, `gestures` (`lean`), `driver` (cast name), the **drive unit cut-away** (stator, rotor, gears, inverter, phase cables), the battery, the `motor` framing, `OrangePath` at 0.0225, `fadeAt` / `fadeFor`, the `carHeadBoxOnScreen` anchor |
| `car-slice` `road: 'highway'` (No. 005) | K's and E's road (with S2 `wet`) | The highway lane block and its scroll |
| `highway-slice` (No. 005) | Base of R (S2) | Road cut at the plane, YOU's car whole driving away, lateral keys and the yaw they give, tail lamps, guardrail, signs |
| `RealCar`, `CarShell`, `RealWheel`, `Figure` + `rig` | K, E, R | Bodies, lamps, cut wheels, YOU and FRIEND |
| `NameTag`, `TitleBlock`, `Captions`, `sfx` overlay, `music` | Overlays and sound | As built |
| `SectionStage`, `cutLook`, `SectionCamera`, `keyframes.ts`, `moods.ts` (Day), `transitions.ts` | All locations | As built |
| `yarn sfx:whine`; files `whine` (No. 006), `whoosh` (No. 001), `music.mp3` (No. 006) | Sound | Copy into `src/videos/drive-by-wire/audio/` |

Not used: `city-slice`, the city road, `DetailBox` (no screen beat now), `Counter`, `Callout`, `shake`.

## Missing: scene-builder tasks (not requested yet)

S1a–S1c and S6 touch `CarSliceScene`, so they run in sequence. S2 can run in parallel. S5 belongs to tooling.

| # | Task | Size | Short spec |
|---|---|---|---|
| S1a | **`car-slice` `variant: 'gas'` (K)** | large | The EV layout with a front engine. **Realistic, generic:** a pedal module with its sensor at the pivot, a brake pedal with its switch, a bare firewall, the computer by the cowl above the pedals, a transverse four-cylinder cut-away, the **throttle body** cut through its bore (plate, DC motor, gears; 🎭 ×1.5), a black loom. **Props:** `throttle` keys; path legs `pedalAt` (sensor → computer) and `motorAt` (computer → motor); pulses that follow `press`; **`gate` keys** (pulses pass the computer, or die there and the outgoing leg dims: the yes/no); `fadeAt` / `fadeFor`. **Framings:** `car`, `bay`, `signal`, `pedal`, `throttle`, placed so the `throttle` subject sits where E's `motor` subject does. **Test stills first:** `car` (sneaker ≥ 50 px) and `bay` |
| S1b | **Brake override in K** | medium | Unchanged: foot poses `brake` and `both`, a brake-switch lead, a nose dip on hard braking, `brakeLights` flat red |
| S1c | **Steering column and steer-by-wire what-if in K** | medium | Unchanged: a realistic column and shaft with U-joints, `steerByWire` keys (the shaft fades to a hatched gap; an orange wire draws column sensor → rack motor; reverses for the loop), `steer` keys (wheel, hands, near front wheel) |
| **S6** | **EV extension (E)** | medium | **New.** On `variant: 'ev'`: `road: 'highway'` with `wet` (with S2); **`drive` keys**, power to the motor (pedal sensor → inverter board → phase cables → windings lighting, rotor speed following); **`cut` keys** (windings dim, rotor slows, pedal pulses die at the board, the foot still down); `driver: 'friend'` and a body other than YOU's cobalt; framing **`evBay`** (drive unit, inverter, pedals and foot, FRIEND's head); the `motor` framing lined up on screen with K's `throttle` |
| S2 | **Wet road and the wet curve (R)** | large | Unchanged, plus recovery: `wet` for car-slice `road: 'highway'` (both variants) and for `highway-slice`; `curve`; YOU's car following the bend; `yaw` keys (out, then back straight); **`spin` keys that stop on a key** (stability control's cut); framing `curve`; a `youSpot` anchor |
| ~~S3~~ | ~~`DetailBox` `gas-dashboard`~~ | — | **Dropped** (limp mode is cut) |
| S4 | **Theme tokens** (values to the brand-director) | small | Wet asphalt and sheen, spray, aluminium, computer housing, loom, steel shaft |
| S5 | **Audio (tooling)** | medium | Self-made: `sfx:engine`, the wet tire hiss loop, the throttle-motor whirr, the skid scrub, the brake thump, the steering-motor whirr. The rising EV whine uses the existing `sfx:whine`. Copy `whine`, `whoosh` and `music.mp3`. **Dropped:** the chime and the relay tick |

## Frame 0 and the loop

**Frame 0** (Day after the rain, 3:50 PM): K at `car`, drift 0.

- YOU's cobalt car, cut open along the driver's side, driving left on the wet highway lane: wheels turning, road streaming, a
  fine spray;
- YOU in profile, hands on the wheel;
- **the light sneaker on the gas pedal**;
- the engine bay open at the front;
- the rear lamps dark at frame right;
- sky under the title block.

Nothing orange. Readable: only the title block and the first caption.

**Last frame:** the same picture after line 12, reached by the one slow pull-out: `car`, the same speed and press, no orange,
the shaft back, captions gone. On replay the cut to frame 0 adds only the title block. "…like you probably do with the gas?"
leads back into "pressing the gas won't always speed you up."

## Cover idea

`bay` at ≈ 42.5 s: the sneaker across both pedals, the gas pulses dying at the computer, the plate shut. Cover text: "Your gas
pedal needs permission." The publisher decides.

## For the publisher's 🎭 "Illustrative:" line

The generic gas and electric layouts, the scaled throttle and shaft, the speeds, the skid, one computer box per car, FRIEND's
electric car, steer-by-wire shown on a sedan, and the story time.
