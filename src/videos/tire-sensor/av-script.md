# No. 002 · The Tire: audio + visual script

Draft by the director, 2026-10-16, before voice. Inputs: `script.txt` (final, fact-checked, 233 words), `performance.txt`,
`sources.md` (fact-check and § 3D scene list), `brand/style-guide.md` v0.11.1, `brand/brand.md`, the scenes and parts in
`src/scenes`, `src/three`, `src/three/real`, `src/components`.

**Times** are estimates at 2.92 words/s from the script words only (20 = 2 words). The `[pause]` tags and ellipses in
`performance.txt` add about 0.4 to 0.6 s each, so by the end the real times run about 3 s later (spoken length about
83 s). Re-time against the real voiceover before writing `spec.ts`.

**The world.** Everything is **Day** (the story starts with driving away in the morning; no time-passes beat). Three
locations and one Lab:

- **W, the wheel:** an object cut-away (§ 3) floating on the Day sky, with three framings: `wheel` (frame 0),
  `valve` and `sensor` (the sensor lifted off the rim into an exploded teardown). Moves between them are glides.
- **C, the car:** a generic car cut open (near side and roof removed, like a room's near wall and ceiling), YOU in the
  driver's seat, the dashboard, the receiver, four wheels turning over a scrolling road. Name tag YOU on first
  appearance.
- **C2, the other car:** the same car kit, another body colour, no tire sensors, MOM driving. Name tag MOM.
- **L, The Lab:** re-dressed as an inspection bay for the US safety officials' check.

**Colour.** Orange is only the sensor's radio: the pulse, its route to the receiver, node dots on the sensor and the
receiver. The dashboard warning light is `warning` yellow `#eedd2b`, flat, no bloom. Valve brass and gold pads stay below
60% saturation; car bodies are never red or orange. The wire in line 3 is grey (it's not the system). No orange in C2
(there is no radio there; owner decision 2, below).

**Title block** (frame 0 to about 9 s): line 1 `Why would a tire need its own radio?` (two lines: "Why would a tire need" /
"its own radio?"; the spoken "So" dropped); line 2 `NO. 002 · THE TIRE · 7:58 AM`.

## The table

| # | Words | In → out (s) | On screen | What moves (2–3 s rule) | Transition into next | Overlays | New or existing | Flag |
|---|---|---|---|---|---|---|---|---|
| 1 | In many cars, a little radio inside each tire wakes up as you drive away. | 0.00 → 5.14 | **Frame 0.** W `wheel`: a realistic wheel cut through the axle plane, front half removed, at the fixed 3/4 angle. The tire's profile on the cut face (off-white, hatched, inked) reads like the dashboard symbol. Inside the air cavity, the valve stem runs through the rim with the sensor on its inner end, at about 2 o'clock (clear of captions and the title block). Sensor asleep (dim orange node dot, decision 1), wheel still | 3.1 s "wakes": the sensor wakes and its node dot brightens to full orange. 4.4 s "drive away": the wheel starts turning (tread, spokes, valve and sensor rotate; the cut faces stay put, since the tire is round). Holds: yes (nothing in the first ~3 s but the voice and the title, which is the § 8 frame 0) | `continue` (same framing, the glide starts on line 2) | Title block, captions | **New:** wheel slice (W). Existing: `TitleBlock`, `Captions`, `cutLook`, `useStudioEnv` | PAUSE (see line 2) |
| 2 | So why would a tire need its own radio? | 5.14 → 8.22 | W: glide from `wheel` toward the valve and sensor (a mid framing, the sensor about 25% of frame height). The wheel keeps turning | Glide 0.8 s on the cue; first orange pulse ring leaves the sensor through the rubber at about 7 s. Holds: yes | `slide` (new location C) | Title block (fades about 0.8 s after the question, ≈ 9.0 s), captions | New: W mid framing, **radio pulse** part | PAUSE: the `[pause]` before the question sits on a continue, not a cut, and pushes the question to ≈ 5.6 s |
| 3a | Your car needs to know the pressure inside, | 8.22 → 10.96 | C wide: the cut-open car on the road, YOU driving, the dashboard and four wheels visible | Slide in (0.6 s), wheels turning, road scrolling; YOU's hands on the wheel. Holds: yes | `continue` | Name tag **YOU** (no card) | **New:** car slice (C), a `drive` pose. Existing: `Figure` (YOU), `NameTag` | — |
| 3b | but it's hard to run a wire to a spinning wheel... | 10.96 → 14.73 | C: glide to the front wheel. A grey cable runs from under the dashboard to the hub and winds round the turning axle until it pulls tight | Glide on the cue, the cable winding (about 2 s), then it slackens and fades on "wheel...". Holds: yes | `slide` to W (the ellipsis lands on it) | Captions | New: **wire-wind** gag (small, in C) | — |
| 4a | Instead, each tire gets a small sensor with its own battery, | 14.73 → 18.50 | W `wheel` (as frame 0 but turning slowly): the sensor on the rim | Slide in; at "small sensor" (≈ 16.8 s) the callout draws. Holds: yes | `continue`, glide to `valve` | Callout on the sensor: **SENSOR**, sub-line "own battery" | Existing: `Callout`, W | — |
| 4b | often behind the valve where you pump in the air. | 18.50 → 21.92 | W `valve`: the valve stem from its cap outside the rim to the sensor body inside the tire | Glide 0.8 s; callout swaps at "valve" (≈ 19.6 s); the valve cap turns a quarter as if being opened. Holds: yes | `continue`, glide to `sensor` | Callout on the stem's outer end: **VALVE** | Existing: `Callout`. New: W `valve` framing | — |
| 5 | Look inside... and there's a pressure sensor, a motion sensor, a tiny computer and the radio itself. | 21.92 → 27.74 | W `sensor`: the sensor lifts off the rim and opens like a repair photo (housing cut faces hatched): board, coin cell, pressure sensor with its port, motion sensor, chip, antenna | Glide on "Look", the housing opens during the "..." (≈ 22.6 s). Each part lifts 2 mm and brightens as it's named: pressure ≈ 23.6, motion ≈ 24.7, computer ≈ 25.7, radio ≈ 27.1 (the antenna turns orange: the only orange part). Holds: yes, every ~1 s | `continue`, glide back to `wheel` | One callout at a time, swapping: **PRESSURE SENSOR**, **MOTION SENSOR**, **TINY COMPUTER**, **RADIO**, about 1.0 to 1.2 s each | **New:** sensor teardown (in W). Reuse the `PhoneTeardown` pattern, `REAL` tokens, `Callout` | RUSHED: four labels in about 4.6 s, ~1.1 s each |
| 6 | When you're parked, it's asleep, and the motion sensor wakes it up once the wheel turns. | 27.74 → 33.22 | W `wheel`: the sensor back on the rim, the wheel stopped, everything on the sensor dark | Glide out 0.8 s (sensor folds back during it); 29.5 s still and dark; at "motion sensor" (≈ 30.1 s) the wheel starts to turn; at "wakes" (≈ 31.2 s) a neutral light on the motion sensor, then the orange node dot. Holds: yes | `follow` up to C (the first pulse leads the camera out) | Captions | Existing: W, pulse | — |
| 7 | Then, every minute or so, it sends the car a quick radio message with the pressure. | 33.22 → 38.70 | C wide, driving: the near front wheel's sensor sends an orange pulse; the route runs from the wheel to the receiver under the dashboard (node dots at both ends) | Follow 0.8 s; pulse 1 at ≈ 34 s, the receiver's node dot lights at "message" (≈ 36.8 s); a second pulse at ≈ 38 s (time is compressed, the callout says so). Holds: yes | `continue`, glide wider | Callout on the wheel: **≈ ONCE A MINUTE** | Existing: `OrangePath` (node dots, runner light). New: receiver box, pulse | — |
| 8a | The car can tell which wheel is talking | 38.70 → 41.44 | C wider, all four wheels readable | Pulses leave the four wheels one after another (≈ 0.6 s apart); the rear-left one carries a tag; the receiver blinks per pulse. Holds: yes | `continue` | Callout riding the rear-left pulse: **ID 4F2A** (🎭 invented, disclose) | Existing: `Callout`, `OrangePath` | — |
| 8b | because each message carries the sensor's own ID. | 41.44 → 44.18 | C as 8a, the tag fading | Pulses keep cycling; the card enters on "own ID" (≈ 43.5 s). Holds: yes | `slide` to W | **Statement card 1:** "Its own ID." (sky band, top y 288; captions off) | Existing: `Statement` | — |
| 9a | It stays quiet most of the time to save power, | 44.18 → 47.60 | W `wheel`, turning steadily | The sensor's node dot is dark; one short orange blink at ≈ 45 s and another at ≈ 47 s (long dark gaps, a brief flash). Holds: yes, just | `continue`, glide to `sensor` | Captions | Existing: W, pulse | HARD TO SHOW (mild): "quiet" is an absence; the gaps between blinks carry it |
| 9b | and that's how the battery lasts up to about ten years. | 47.60 → 51.37 | W `sensor`: the teardown again, the coin cell forward | Glide; the counter counts 0 → 10 from ≈ 48.5 to 51 s. Holds: yes | `continue`, glide to `wheel` | **Counter:** 10, unit "years", sub-line "up to about" | Existing: `Counter` (needs the § 6 restyle, it's still in the plaster look). W teardown | — |
| 10a | Once a tire's about a quarter low, | 51.37 → 53.77 | W `wheel`: the tire loses air; the cut profile squashes and the sidewall bulges at the bottom | Glide 0.8 s, then the squash over ≈ 1.6 s. Holds: yes | `follow` to C (the soft tire's pulse leads) | Captions (they carry the hedge "about") | New: W deflate parameter | RUSHED: the deflation gets ~1.6 s after the glide |
| 10b | US rules say the warning light's gotta come on within 20 minutes of driving. | 53.77 → 58.56 | C wide, driving: the soft front tire visibly low; its pulse reaches the receiver; YOU glances down | Follow; at "warning light's" (≈ 55.1 s) the cluster's tire symbol lights yellow in the detail box; the trip timer in the cluster counts on; YOU `glance-down`. Holds: yes | `slide` to C2 (on the `[pause]`) | **Detail box** on the cluster (YOU's side): speedometer, trip timer, the cut-tire symbol in `warning` yellow, flat | New: cluster content for `DetailBox` (today it only shows a cast member's phone). Existing: `glance-down` | — |
| 11a | Some cars don't have tire sensors at all... | 58.56 → 61.30 | C2 wide: a second car, other body colour, MOM driving, no sensors in its wheels, no orange anywhere | Slide in (on the `[pause]`); wheels turning, road scrolling; the absence of pulses reads against C. Holds: yes | `continue`, glide to the wheels (the ellipsis lands on it) | Name tag **MOM** | New: C2 variant of the car kit. Existing: `Figure` (MOM), `NameTag` | — |
| 11b | and they spot a soft tire because it spins slightly faster. | 61.30 → 65.07 | C2 low framing on the near wheels: each hub with its toothed speed ring; one tire slightly low with a white tick mark on its sidewall | Glide; the soft wheel's tick visibly gains on the others' (exaggerated a little). Holds: yes | `slide` to L | Callout on the soft wheel: **SPINS FASTER** | New: tick marks, tone rings, per-wheel spin rate | — |
| 12a | When US safety officials checked mid-2000s cars, | 65.07 → 67.47 | L wide (Day), re-dressed: two rows of 8 wheels on stands, each standing for one car; two grey extras with gauges | Slide in; the extras press gauges to the valves. Holds: yes | `continue`, glide to row 1 | Captions | Existing: `SectionLabScene`, `LabSlice`, `RealLab` bench, extras. New: wheel stands, gauge pose | — |
| 12b | the ones with the warning were about half as likely to have a badly low tire. | 67.47 → 72.95 | L bench: row "WITHOUT THE WARNING": 2 of 8 tires sag; glide to row "WITH THE WARNING": 1 of 8 sags | Two sag at ≈ 68 s, glide at ≈ 69.5 s ("about half"), one sags at ≈ 70.5 s. Holds: yes | `slide` to W (on the `[pause]`) | The row labels are set panels in the Lab (in-set text = the frame's one card); no other card | New: Lab re-dress. 🎭 the 2-of-8 vs 1-of-8 picture is illustrative (NHTSA: 23.1% vs 11.8%, D2) | — |
| 13a | Next time you fill a tire, | 72.95 → 75.00 | W `valve`: YOU's arm (cobalt sleeve) brings an air chuck onto the valve | Slide in; the chuck clicks on, the tire firms back up (the squash from 10a undoes). Holds: yes | `continue`, glide out to `wheel` | Captions | New: air chuck, YOU's arm (reuse `Figure` limbs) | — |
| 13b | there's probably a little radio behind that valve... waiting for the wheel to turn. | 75.00 → 79.79 | W: the chuck lifts away, the glide lands on frame 0's framing; the wheel slows and stops with the valve back at 2 o'clock; the sensor asleep, dim node dot | Glide ≈ 75.0 → 77.7 s (the ellipsis lands at its end), the wheel stops by ≈ 78.5 s; then the hold on frame 0's picture (≈ 1.5 s plus the tail). Holds: yes, the end hold is the loop landing | **Loop** to frame 0 | Captions end before the last frame; nothing else | Existing: W | — |

Scene count: 21 beats in about 80 s (about 3.8 s each). The sub-beats under 3 s (3a, 8a, 10a, 11a, 12a, 13a) are events
inside one scene (a glide or a tag), not separate scenes, so `yarn check` doesn't flag them as too short.

Card budget: callouts, the counter, the detail box, the statement and the Lab panels never overlap; name tags (3a, 11a)
never share a frame with a card. One statement card (≤ 2 allowed, never in the first 3 s). Hard cuts: none. Slides: 7,
follows: 3, the rest continue or glide.

## Line fixes

No fact or required hedge changes. The hedges that stay as they are: "In many cars" (1), "often behind the valve" (4),
"every minute or so" (7), "up to about ten years" (9), "about a quarter low", "of driving" (10), "Some cars" (11),
"about half as likely", "badly low", "mid-2000s" (12), "probably" (13). "Short bursts" stays out (unsourced, item 6).

| Line | Flag | Suggestion | Mark |
|---|---|---|---|
| 2 | PAUSE | No wording change. Fix it in `performance.txt` (below). | — |
| 5 | RUSHED | Keep the words: the list is one idea (what's inside), and the visual fix is one callout that swaps label as each part lights. If the labels read too fast in Studio, slow the list with a breath, not new words (performance fix below). | optional |
| 9a | HARD TO SHOW (mild) | Keep the words. The only clearer wording ("short bursts") is unsourced, so the picture does the work: long dark gaps between brief orange blinks. | none |
| 10a | RUSHED | Keep the words; give the deflation a beat with an ellipsis after "low" (performance fix below). | applied (as a pause, in `performance.txt`) |

No line needs a wording change. Every flag is fixed by a pause or by the picture.

## Pause and tag fixes for `performance.txt`

Words unchanged; only tags and ellipses.

| Line | Now | Change | Why | Mark |
|---|---|---|---|---|
| 2 | `[pause] [curious] So why would a tire need its own radio?` | `[curious] So why would a tire need its own radio?` (drop `[pause]`) | The pause sits on a continue, not a cut, and pushes the question from ≈ 5.1 s to ≈ 5.6 s; the wheel starting to turn already gives line 1 its ending | optional (keep it if the question still starts by ≈ 6 s on the real take) |
| 3 | `...spinning wheel...` | keep | Lands on the slide to W | — |
| 5 | `Look inside... and there's` | keep | Lands on the housing opening | — |
| 5 | `a pressure sensor, a motion sensor, a tiny computer and the radio itself.` | only if the labels read too fast: `a pressure sensor, a motion sensor, a tiny computer... and the radio itself.` | ~0.4 s more for the last label, the radio, which is the one that matters | optional |
| 6 | `it's asleep, and the motion sensor` | `it's asleep... and the motion sensor` | Holds the dark, still wheel before it starts turning | optional |
| 9 | `to save power, and that's how` | `to save power... and that's how` | Lands on the glide to the battery and lets the second dark gap read | optional |
| 10 | `about a quarter low, US rules say` | `about a quarter low... US rules say` | Lands on the follow from the deflating tire to the car | **applied** (main session added it to `performance.txt`) |
| 11 | `[pause] Some cars ... at all... and they` | keep both | `[pause]` lands on the slide to C2, the ellipsis on the glide to the wheels | — |
| 12 | (no tag) | keep | A third pause in a row (11, 12, 13) would drag; the 0.6 s slide fits on "When" | — |
| 13 | `[pause] Next time ... that valve... waiting` | keep both | `[pause]` lands on the slide to W, the ellipsis on the end of the glide to frame 0 | — |

With the line 10 pause applied: spoken length about 83 s. Over 60 s is allowed because the video has no licensed music
(brand.md § Structure).

## New 3D pieces

| Piece | Size | What it needs | Reuse |
|---|---|---|---|
| **W, the wheel slice** | large | A realistic generic wheel (tire with tread and plain sidewalls (no lettering), alloy rim, valve stem with cap, brass below 60% saturation) cut through the axle plane, front half removed, cut faces hatched and inked, floating on the Day sky. Framings `wheel`, `valve`, `sensor`. Props: `spin` (rate over time, lands on a set angle so the end matches frame 0), `deflate` (0 to 1: profile squash, sidewall bulge), `sensorAwake`, pulse times. The cut faces stay static while tread, spokes, valve and sensor rotate (the tire is round, so the section doesn't change) | `cutLook`, `SectionCamera`, `SectionStage`, `useStudioEnv`, `REAL` tokens, the `phone-cutaway` scene structure |
| **Sensor teardown** (inside W) | medium | The sensor lifts off the rim and opens: housing with hatched cut faces, green PCB, coin cell with an invented label, pressure sensor with its port, motion sensor, chip with an invented legend, antenna. Each part can lift and brighten on a time; the antenna is the only part that turns orange | `PhoneTeardown` pattern, `REAL` materials, `Callout` anchors via `projectToFrame` |
| **Radio pulse** | small | An orange ring that expands from the sensor through the rubber and fades (bloomed, it's the system), optional ID tag anchor | `OrangePath` (node dots, runner light, bloom), § 5 values |
| **C, the car slice** | large | A realistic generic car (no logo, no signature shape), near side and roof cut away, cut faces hatched; cabin with seats, steering wheel, dashboard with a cluster, a receiver box under the dash; four wheels turning; the road on the ground block scrolling; YOU seated with a `drive` pose (hands on the wheel), `glance-down` already exists. Framings `wide`, `front-wheel`, `four-wheels` | `Figure`, `rig.ts` poses, `cutLook`, `SectionStage`, the W tire at low detail for the wheels |
| **Wire-wind gag** (in C) | small | A grey cable from the dashboard to the hub that winds round the turning axle, pulls tight, slackens and fades | three tube geometry as in `OrangePath`, unbloomed |
| **Cluster detail content** | small | A flat 2D cluster: speedometer, trip timer, the cut-tire warning symbol in `warning` yellow (flat, no glow). `DetailBox` today only shows a cast member's phone from `section-room`, so it needs a generic content mode | `DetailBox`, `screenKit` drawing helpers |
| **C2, the other car** | small (given C) | The car kit in another body colour, MOM driving, no sensors and no orange; toothed speed rings at the hubs, a white tick on each sidewall, a per-wheel spin rate (one slightly faster) and one tire slightly low | C, W deflate, `Figure` (MOM) |
| **Lab re-dress** | medium | Two rows of 8 wheels on stands with set panels "WITHOUT THE WARNING" / "WITH THE WARNING", gauges, 2 and 1 sagging tires; a `gauge` pose for two grey extras | `SectionLabScene`, `LabSlice`, `RealLab` bench and rail, W tire at low detail, `Figure` extras |
| **Air chuck + arm** | small | A generic air chuck on a hose, held by YOU's arm (cobalt sleeve, small hand) entering from the right | `Figure` limbs, `limb()` |
| **Counter restyle** | small | `Counter` still uses the plaster look (serif, `inkLabel`); § 6 wants Archivo 800 digits 80 px, Inter unit 34 px, Mono sub 20 px | `TitleBlock` frame styles |

Already there: `TitleBlock`, `Captions`, `NameTag`, `Callout`, `Statement`, `DetailBox` frame, `Figure` (YOU, MOM, extras),
`OrangePath`, the Lab, `slide` / `follow` / `continue` / glide transitions.

## Frame 0 and the loop

**Frame 0** (Day): W at the `wheel` framing, the fixed 3/4 angle. A realistic wheel cut through the axle plane, front
half removed, floating on the Day sky; the tire's two cut profiles (off-white, hatch, ink edge) show the same shape as
the dashboard symbol. The valve stem at about 2 o'clock runs through the rim, and the sensor sits on its inner end
inside the air cavity, clearly shaped and lit, but asleep, with a dim orange node dot (decision 1, to try on a still). The wheel is still, the tire full. The wheel fills about
y 480 to 1040, below the title block (top y 300, two lines to ≈ y 440) and above the caption band. The title block shows
the question. Nothing else readable. Camera drift is 0 on this scene and the last, so the loop matches (the idle drift
runs on the video clock and would land at another phase after 80 s).

**Last frame:** the same picture: W `wheel` framing, same angle, the valve back at 2 o'clock, the sensor asleep with the same dim node dot, the
wheel stopped, the tire full (just refilled in 13a), no chuck, no callout, captions already gone. On replay the cut to
frame 0 only adds the title block.

## Cover idea

The cut-open wheel at frame 0's framing with the sensor sending its first orange pulse through the rubber, and the
cover text "The radio inside the tire."

## Decisions (owner, 2026-10-16; all four recommendations accepted)

1. **Frame 0 sensor marker:** the sleeping sensor gets a dim orange node dot at frame 0 and on the last frame,
   brightening when it wakes. To be tried on a still first (an idle system part is otherwise `ledOff`).
2. **Orange in C2:** none. The other car has no radio, and the absence is the twist.
3. **Disclosures:** the sensor ID "4F2A" (8a) and the Lab's wheel rows, 2 of 8 vs 1 of 8 (12b), are illustrative (🎭).
   The publisher adds an "Illustrative: …" line to the post description.
4. **Title place:** "The Tire" (`NO. 002 · THE TIRE · 7:58 AM`).
