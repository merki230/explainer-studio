# No. 007 · The self-checkout: audio + visual script

Draft by the director, 2026-10-24, before voice (playbook step 0). Inputs: `script.txt` (near-final, 11 lines, 161 words; a
fact-check re-check is running in parallel, so the words may still move), `sources.md` (the revised-script line map: no ❌, line 9
🟡 allowed because of "can"; § 3D scene list; A3, the four corner load cells, **as a picture only**), `docs/playbook.md` § How a
video is built step 0, `brand/style-guide.md` v0.12, `brand/brand.md`, `CLAUDE.md`, the No. 004 and No. 006 A/V scripts for format,
and the parts in `src/scenes` (`street-slice`, `tower-slice`, `hotel-lobby`, `section-room`, `section-lab`), `src/three`
(`section/Figure`, `section/cutLook`, `section/SectionCamera`, `section/SectionStage`, `OrangePath`, `real/`) and `src/components`
(`DetailBox`, `Callout`, `NameTag`, `TitleBlock`, `Counter`, `anchors.ts`, `screenKit.ts`).

**Times** are estimates at 2.92 words/s from the script words only (as No. 004 and No. 006): 161 words = **55.1 s**, plus a 1.0 s hold
on the loop frame ≈ **56.1 s**. Under 60 s, so licensed music is allowed if the owner wants it. There is no `performance.txt`
yet; the pauses proposed below add ≈ 1 s. The scaffold's estimated `transcript.json` runs slower (2.5 words/s). Re-time against
the real take before writing `spec.ts`.

**Mood: Day** (a store interior under even ceiling light), story time 6:20 PM (🎭, the after-work grocery run). One location, no
time-passes beat.

## The world

One location, **S, the store's front end**, so every hand-over is a `continue` with a glide. No slides, no cuts.

- **The slice.** A block of the store floor cut square across **YOUR kiosk**, front to back, through its middle. On the cut face,
  left to right: YOU standing at the kiosk (whole, not cut), the kiosk body cut open (the computer board and cables inside), the
  **scanner bed** (horizontal glass and the upright window), and the **bagging area**: a bag rack with two arms of plain film
  bags, standing on a **platform** that sits on **four bar load cells at its corners** on a base frame (A3, picture only), the
  floor slab cut and hatched under it. Behind the cut, the front end runs away into depth: **five more kiosks in a row** (whole,
  not cut), each with a grey extra scanning and bagging, an **attendant podium** at the far end (its monitor turned to the
  attendant), aisle ends with invented goods, the back wall with a **ceiling air diffuser** over YOUR kiosk. A generic hanging
  "SELF CHECKOUT" lane sign is allowed (plain words, no store name).
- **The kiosk** (focus, realistic, generic US style, no logo or maker's look): a touchscreen on an arm, **turned to YOU** (read only
  in the detail box); the flatbed scanner; a card reader and receipt slot; a **status light pole** on top (off, then `warning`
  yellow when it calls the attendant, never orange); the bag rack and platform as above.
- **The weight gauge** (the system's readout, new): an **in-set readout panel** standing just behind the bag rack, like the
  tower's load bars and score readouts. It is a slim vertical bar whose **orange fill is the weight on the platform**, with the
  reading in digits beside it (Inter 700, `ink` on a `paper` halo, lb, 🎭). On each scan an **expected step** appears above the
  current fill as a **window**: a band with an orange outline at 25% fill. The landing step's top settles inside it or misses
  it. In line 3b small orange **ticks** (one per earlier shopper's weighing) land beside the bar and cluster, and the window is
  drawn around the cluster. In line 10 the bar leaves a **trace** (a staircase line) of the whole visit.
- **Cast.** YOU (standing, cobalt hoodie). Grey extras at the other kiosks, and an **attendant** (an extra in slate, no vest
  colour near the reserved band). Extras are never tagged.
- **Items.** A soup can with a green or blue invented label (not the classic tomato red-orange), a bottle of water, a cereal box,
  plain film bags, a grey hand basket. No produce in the orange range (no oranges, carrots or pumpkins) anywhere in the set.

**Orange (the hidden system) is only:** the four load cells and their cables to the kiosk board; the line from the scanner to the
board when an item is looked up (3a); the gauge's fill, window and ticks; the lines and dots from the other kiosks in 3b.

**Not orange:** the scanner's scan pattern (a flat red, no bloom; token to the brand-director, see Decisions); the light pole
(`warning` yellow); price tags, shelf strips, signs, baskets and the attendant's clothes (cool or neutral); the screen UI
(generic Day UI, `screenKit` accents).

**Title block** (frame 0 to ≈ 7.3 s, 0.8 s after the question; it holds into scene 2 as No. 004's did): line 1 the spoken question
without "So", `How does it decide` / `something is unexpected?` (two lines, 18 and 24 characters); line 2
`NO. 007 · THE SELF-CHECKOUT · 6:20 PM` (one line, ≈ 37 characters at Mono 19 px ≈ 550 px).

**Framing sizes** (the one fixed 3/4 angle, fov 26°; distances set on the test still):

- **C**, close: `shelf` (frame 0 and the loop: the bag rack, the platform and its four load cells, the gauge behind, YOU's hand
  coming in); `scanner` (the scanner bed and the near half of the shelf, so the window appears in frame); `cells` (under the
  platform, the four load cells and the base frame); `gauge` (the gauge panel with the bag tops below it).
- **M**, medium: `kiosk` (YOU at the whole cut kiosk, the light pole on top, the gauge readable).
- **MW**, medium-wide: `lane` (YOUR kiosk, the next two kiosks and the attendant podium).
- **W**, wide: `bank` (the whole front end in depth: six kiosks, six shoppers, the podium), used **once** (3b), where the
  many earlier shoppers are the point.

Camera keys do every move: a glide into each framing (0.7 to 0.9 s), then a push, crane or pull-back on the line's key word.
**Subject band:** on C and M shots the subject sits above y ≈ 1030, clear of the caption band.

## The table

| # | Words | Cue | In → out (s) | Shot | On screen | Camera motion | What moves (2–3 s rule) | Transition into next | Overlays | SFX idea | New or existing | Flag |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | On a lot of self-checkouts, the bagging shelf is a scale. | `On a lot` | 0.00 → 3.77 | **C** (`shelf`) | **Frame 0:** the bagging area cut open: the bag rack with an open film bag, the platform, **the four load cells under its corners lit orange**, their cables to the cut kiosk body; the gauge panel behind the rack, low fill, digits `2.36 lb` (🎭); YOU's hand coming in from the left holding the soup can just above the bag | Holds (drift 0, for the loop) | The hand **sets the can in the bag** at "shelf" (2.4); the load cells pulse; the fill **steps up** and the digits roll to `3.48 lb` by "scale" (3.5) | `continue`, log pull-back | Title block, captions | A soft can-on-plastic tap at 2.4 (self-made); store room tone from frame 0 | **New:** S slice, kiosk (focus), platform and load cells, gauge, soup can, bag | Frame 0 is the action line 1 names (an item landing on the shelf, which is a scale). The load cells are already visible, so line 4 repeats them close up (on purpose, as No. 004's cap) |
| 2 | So how does it decide something is unexpected? | `So how does` | 3.77 → 6.51 | **C → M** (`kiosk`) | The reveal: YOU standing at the whole cut kiosk, the screen on its arm turned to YOU (its light on YOU's face), the scanner, the shelf and the gauge, the dark light pole on top; the next kiosk faint behind | Log pull-back 3.8 → 4.8 s (`log: true`), then a slow push | YOU **glances from the bag to the screen** at "decide" (4.9); YOU reaches for the next item in the basket (5.8) | `continue`, glide to `scanner` | Title block (fades ≈ 6.5 → 7.3 s); name tag **YOU** 4.8 → 6.4 (right margin, under the title block); captions | — | Existing: `Figure` (`stance: 'stand'`, glance), `NameTag` (needs a head anchor on S), `cameraKeys` (`log`) | Question spoken 3.8 → 6.5 s: starts before the 5–6 s window, ends just after it (mild) |
| 3a | Scanning the barcode pulls up what the item should weigh, | `Scanning the barcode` | 6.51 → 9.93 | **C** (`scanner`) | The scanner bed in section, the near half of the shelf and the gauge | Glide 6.5 → 7.3 s | YOU **passes the bottle of water over the glass** at "barcode" (7.2): the red scan pattern flicks across it; at "pulls up" (7.6) an **orange line runs from the scanner window through the cut kiosk body to the board** (0.6 s), and on to the gauge, where **the window appears** above the current fill at "should weigh" (9.4) | `continue`, log pull-back to `bank` | Captions | Scanner beep at 7.2 (self-made, generic, two short tones) | **New:** scan gesture (an item carried along a hand path), scan pattern, scanner → board → gauge line (`OrangePath`), gauge `window` | TOO LONG for one shot (7.9 s for line 3): split at the comma |
| 3b | a number many systems learned from the shoppers who bought it before you. | `a number many` | 9.93 → 14.38 | **W** (`bank`), the only wide shot | The whole front end in depth: YOUR cut kiosk at the front, five kiosks behind it, a grey extra at each, the podium at the end | Log pull-back 9.9 → 11.0 s, then a slow crane | **The surprise:** each extra in turn **sets the same bottle on their own shelf** (0.5 s apart, back to front, from "learned" 11.0); each shelf's load cells flash and send **one orange dot** along the floor's cut face, out of frame and back into YOUR kiosk, where it lands as a **tick beside YOUR gauge**; the ticks **cluster** and the window **redraws tighter** around them by "before you" (13.7). The back extras finish and walk off with their bags as their dot leaves (they came first) | `continue`, glide to `cells` (the pause lands on it) | Captions | none (quiet, music only) | **New:** five background kiosks, extras' scan-and-bag loop, dot lines (`OrangePath` with travelling dots), gauge `ticks` | The line's own visual: the window is built from other shoppers' weighings (B2; the range idea is US8843397's). The extras are shown at the same time, so "before" rests on them leaving first and on the ticks arriving before YOU's item lands. Alternative in Decisions 1 |
| 4 | Look under the shelf, where sensors called load cells weigh the whole platform. | `Look under the` | 14.38 → 18.84 | **C** (`cells`) | Under the platform, cut open: **four realistic bar load cells** bolted between the platform and the base frame, cables to the kiosk board; the bag bottoms on the platform above | Glide 14.4 → 15.2 s, slow push | At "load cells" (16.6) the near cell **lights brighter**; at "whole platform" (18.2) all four pulse and **their four cables join at the board** into one line up to the gauge (one total, A2) | `continue`, glide to `shelf` | **Callout** `LOAD CELLS` (16.4 → 18.6; leader to the near cell) | — | **New:** load cell detail (realistic: anodized bar, cable gland, bolt pair), the four-into-one join | The corner layout is a picture only (A3 🟡); no on-screen text says "four" or "corners". No callout sub-line |
| 5 | When you set an item down, the scale checks how much the weight went up. | `When you set` | 18.84 → 23.97 | **M** (`shelf` with YOU's arm, the gauge in frame) | The bagging area from just above: YOU's hand with the bottle, the bag, the platform, the gauge behind | Glide 18.8 → 19.6 s | YOU **sets the bottle in the bag** at "set an item down" (19.8); the load cells pulse; the **fill rises by one step** (20.4 → 21.0) and the digits roll `3.48` → `4.62 lb`; at "how much" (22.3) the **step alone outlines** (the new part of the fill) | `continue`, push to `gauge` | Captions | Bottle-on-plastic tap at 19.8 | New: gauge step outline | One scene of 5.1 s (one action, one readout) |
| 6 | If the change lands inside a window around the expected weight, you keep scanning. | `If the change` | 23.97 → 28.77 | **C** (`gauge`) → **M** (`kiosk`) | The gauge filling the frame: the step's top sitting **inside** the window | Push 24.0 → 24.8 s; at "keep scanning" (28.1) a pull-back to `kiosk` | At "inside" (25.0) the step's top **settles inside the band**; the band's outline **brightens once** and fades (the match); at "keep scanning" YOU **scans the cereal box** (beep, a new window appears) | `continue` | **Callout** `WINDOW` (25.8 → 27.6; leader to the band) | Beep at 28.3 | New: gauge `match` state | The pull-back in the last 0.7 s is the "keep scanning" picture |
| 7a | Outside it, you get "unexpected item" and the machine pauses, | `Outside it, you` | 28.77 → 32.19 | **M** (`kiosk`) | YOU at the kiosk, the box going into the bag | Slow push | YOU **sets the box down** (28.9); the step **overshoots the window** at "Outside" (29.2), the band's outline **flickers**; the screen's light on YOU's face changes; the scan pattern **goes dark** at "pauses" (31.9) | `continue` | **Detail box** (kiosk screen, `kiosk` content, left side, leader to the screen) from "unexpected item" (29.9) to 32.1: a generic pause screen, `Unexpected item` and `Please wait` (🎭 wording beyond the two spoken words) | A soft two-note alert chime at 29.9 (generic, not a known machine's sound) | **New:** `DetailBox` `kiosk` content, gauge `miss` state | TOO LONG for one shot (6.9 s for line 7): split at the comma. The miss has no visible cause here on purpose; line 8 shows causes |
| 7b | and if you can't clear it, it calls an attendant. | `and if you` | 32.19 → 35.62 | **M → MW** (`lane`) | YOU, the kiosk, the next two kiosks and the podium with the attendant | Pull-back 32.2 → 33.0 s | At "can't clear" (33.6) YOU **lifts the box and sets it down again**: the step misses again; at "calls" (34.6) the **light pole blinks `warning` yellow**, and the attendant **looks up and walks over** (35.0 → end of scene 8) | `continue`, glide to `kiosk` | Captions | — | **New:** light pole states, attendant walk (`walk`) | Shows "if you can't clear it" as one retry before the call (D4: rescan first, then notify) |
| 8 | Anything that changes the number counts, even a bump or a draft from the air conditioning. | `Anything that changes` | 35.62 → 41.10 | **M** (`kiosk`, the diffuser at frame top) | YOU at the kiosk, the attendant arriving and **tapping the screen** (the pole goes dark, the step clears); the diffuser above | Glide 35.6 → 36.4 s, slow push | The attendant clears it (35.9 → 36.8); at "bump" (38.4) YOU's **hip knocks the kiosk** turning for the basket: the fill **jumps and wobbles**, the digits flick; at "draft" (39.1) the **bag tops ripple** under the diffuser (a slow cloth flutter) and the fill **wavers** with them through "air conditioning" (40.4) | `continue`, glide to `shelf` | Captions | A dull knock at 38.4 (self-made); a faint air hiss from 39.0 | **New:** bag flutter keys, gauge `wobble` keys, kiosk jolt | HARD TO SHOW (mild): a draft is invisible, so the bags carry it. "bump" and "draft" are 0.7 s apart; the picture lets the bump land first and the flutter run long |
| 9a | And if you lift a bag off before you pay, | `And if you lift` | 41.10 → 44.52 | **M** (`shelf`) | The bag rack with two full bags, YOU's hand reaching in | Glide 41.1 → 41.9 s | YOU **lifts a full bag off the rack** at "lift a bag off" (42.2) and holds it | `continue`, pull-back to `kiosk` | Captions | Film-bag rustle at 42.2 | New: bag lift (the bag follows the hand) | TOO LONG for one shot (6.5 s for line 9): split at the comma. The cue has four words because "and if you" also starts 7b's cue; four is unambiguous |
| 9b | the weight drops, which can trip the machine too. | `the weight drops` | 44.52 → 47.60 | **MW** (`kiosk` a little wider, the pole in frame) | YOU holding the bag, the kiosk, the gauge | Pull-back 44.5 → 45.3 s | At "drops" (45.2) the **fill falls by a bag's weight**, below where it should be; at "trip" (46.6) the **pole blinks `warning` yellow** again; YOU **sets the bag back** at 47.2 | `continue`, push to `gauge` (the pause lands on it) | Captions | Alert chime at 46.6 | Existing pieces from 7 and 8 | "can" stays: the picture shows one case of it tripping, not a rule. No theft framing (YOU is just early) |
| 10 | To the scale, your groceries are numbers going up and down. | `To the scale` | 47.60 → 51.37 | **C** (`gauge`) | The gauge alone, the bag tops below it | Push 47.6 → 48.4 s | The bar **replays the visit as a trace**: an orange staircase line draws left to right beside it, every step from the video (the can, the bottle, the box, the miss, the bump's spike, the bag's drop) by "up and down" (51.0) | `continue`, glide to `shelf` | Captions | none | **New:** gauge `trace` | HARD TO SHOW (mild): the line is an idea; the trace makes it a picture of the same numbers the viewer has watched |
| 11 | Next time it complains, look at what last touched the shelf. | `Next time it` | 51.37 → end (≈ 55.1 + 1.0 s hold) | **C** (`shelf`), **landing on frame 0's picture** | The bagging area, the four load cells lit, the gauge at `2.36 lb` | Glide lands on `shelf` by 52.2; drift 0 | At "last touched" (54.0) YOU's hand **comes in with the soup can** and stops just above the bag, exactly where frame 0 has it; the trace has faded by 52.5 and the gauge reads frame 0's value | **Loop** to frame 0 | Captions end before the hold; nothing else | Room tone only; music ends in silence on the last frame | Existing (S) | TIMED: the gauge reading, the hand and the can must match frame 0 on the last frame. The last line leads into line 1 ("the bagging shelf is a scale") |

Spec scenes: **13** in ≈ 56 s (≈ 4.3 s each):

| Scene | In → out (s) | Beats | Shot |
|---|---|---|---|
| 1 | 0 → 6.51 | 1, 2; holds the title block | C → M |
| 2 | 6.51 → 9.93 | 3a | C |
| 3 | 9.93 → 14.38 | 3b | W |
| 4 | 14.38 → 18.84 | 4 | C |
| 5 | 18.84 → 23.97 | 5 | M |
| 6 | 23.97 → 28.77 | 6 | C → M |
| 7 | 28.77 → 32.19 | 7a | M |
| 8 | 32.19 → 35.62 | 7b | M → MW |
| 9 | 35.62 → 41.10 | 8 | M |
| 10 | 41.10 → 44.52 | 9a | M |
| 11 | 44.52 → 47.60 | 9b | MW |
| 12 | 47.60 → 51.37 | 10 | C |
| 13 | 51.37 → end | 11 | C |

Rhythm: C → M | C | **W** | C | M | C → M | M | M → MW | M | M | MW | C | C. The wide shot is used once (3b). The size changes every
scene or two, except 7a → 9a, which stay medium but each brings a new event (the pause, the attendant, the bump, the lift).

Card budget: the callouts (4, 6) and the kiosk detail box (7a) never overlap; the YOU name tag (2) leaves before scene 2. No
statement cards, no counter, no full-frame screens. **No X-ray** (the kiosk is cut by the section; nothing hidden runs inside a
wall). Transitions: all `continue` with glides; no slides, no cuts. Screens: the kiosk screen faces YOU and is read only in the
detail box; the podium monitor faces the attendant and is never read.

**Motion rule:** in every scene a camera move lands within its first second, and a story event (an item landing, a step, the
window, the dots, a callout, the pause, the light, the bump, the lift, the trace) follows within 2 to 3 s. Check in Studio playback.

## Line fixes

The words carry the fact-check's required hedges ("On a lot of", "many systems", "if you can't clear it", "can trip"); none of
the proposals below touches them. Fixes go to the scriptwriter through the owner.

| Line | Flag | Suggestion | Mark |
|---|---|---|---|
| 2 | Question ends at ≈ 6.5 s (mild) | Keep the words; it starts at 3.8 s, and the title block shows it from frame 0 | none |
| 3 | TOO LONG for one shot (23 words, 7.9 s) | Keep the words; two shots split at the comma (3a scan, 3b the learned window). Optional tighter version if the owner wants line 3 under 7 s: "Scanning the barcode pulls up what the item should weigh, a number many systems learned from earlier shoppers." (19 words, 6.5 s; the fact-checker must re-check "earlier shoppers" against B2) | optional |
| 4 | Frame 0 already shows the load cells (mild repetition) | Keep the words; line 4 is the close-up and the four-into-one join, which frame 0 doesn't show | none |
| 7 | TOO LONG for one shot (20 words, 6.9 s) | Keep the words; two shots split at the comma | none |
| 8 | HARD TO SHOW (mild): the draft; "bump" and "draft" 0.7 s apart | Keep the words; the bags' flutter carries the draft. Optional: "…even a bump, or a draft from the air conditioning." (a comma gives the voice a breath between the two causes, no word change) | optional |
| 9 | TOO LONG for one shot (19 words, 6.5 s) | Keep the words; two shots split at the comma | none |
| 10 | HARD TO SHOW (mild): an idea, not an event | Keep the words; the trace replays the visit's numbers | none |

No line needs a wording change. Every flag is handled by a split, a pause or the picture.

## Pause and tag notes for `performance.txt`

There is no `performance.txt` yet. For the voice agent; I don't write it. Words unchanged.

| Line | Change | Why | Mark |
|---|---|---|---|
| 3 | `…should weigh... a number many systems…` (ellipsis) | Lands on the log pull-back to the wide shot, so the surprise starts on the reveal | recommended |
| 4 | `[pause] Look under the shelf` | Lands on the glide from the wide shot down to the load cells | recommended |
| 10 | `[pause] To the scale` | Lands on the push to the gauge before the "keep" line | optional |

Two tags and one ellipsis across 11 sentences, inside "about 1 per 3".

## Reuse

| Part | Where it's used | What it already does |
|---|---|---|
| `street-slice` / `tower-slice` scene structure | Pattern for S | A Section location with named framings, `cameraKeys` (incl. `log`), `projectToFrame` anchors for callouts, name tags and detail boxes |
| `tower-slice` `loadBars` and score readouts | Pattern for the gauge | In-set 2D readouts tied to 3D objects: an orange fill with readings beside it |
| `Figure` + `rig` | YOU, extras, attendant | `stance: 'stand'`, `hands` (two-bone IK), `point`, `walk`, glances; `look` overrides for extras |
| `OrangePath` (`OrangeLight`) | Scanner → board → gauge; cables; 3b dot lines | The § 5 tube, halo, node dots, runner light, travelling dots |
| `SectionStage`, `SectionLights`, `cutLook` (`cutMaterial`, `CutOutline`, `InkLine`), `SectionCamera`, `keyframes.ts`, `moods.ts`, `useStudioEnv`, `REAL` tokens | All of S | The Section look, Day light, camera keys |
| `DetailBox` (frame, leader, content modes) | Base for `kiosk` content | The `keypad` / `usage` / `register` modes are the pattern |
| `screenKit` | Base for the kiosk UI | Day UI colours, generic type, ≥ 28 px rules |
| `Callout`, `NameTag`, `TitleBlock`, `Captions`, `transitions.ts` (`continue`) | Overlays | As built |

Not reused: `section-room` (a living room), `section-lab` (no study in this script), `Counter`, `Statement`, `shake` / `shakeKick`
(calm video; the bump is a small kiosk jolt, not the "feel it" shake), `RadioPulse`.

## Missing: scene-builder tasks (not requested yet)

| # | Task | Size | Short spec |
|---|---|---|---|
| K1 | **`checkout-slice` scene (S)** | large | The store front end as above: block cut square across YOUR kiosk (YOU whole beside it), floor slab hatched, five whole kiosks behind in a row into depth, the podium, aisle ends with invented goods, back wall with a ceiling diffuser over YOUR kiosk, a plain "SELF CHECKOUT" sign. Day store light (even, neutral). Props: `you` gestures (scan path, place, lift, glance, hip bump), `items` (which item, held or in which bag, keyed), `extras` (per kiosk: a scan-and-bag loop with a start time, `leaveAt`), `attendant` (spot, `walkAt`, `tapAt`), `light` keys (off / `warning` blink), `scan` keys (pattern flicks; off while paused), `flutter` keys, `jolt` keys, `lines` (scanner → board → gauge; per-kiosk dot lines, keyed). **Framings:** `shelf` (frame 0 and the loop), `scanner`, `cells`, `gauge`, `kiosk`, `lane`, `bank`. **Anchors:** `cell` (near load cell), `gauge`, `window`, `screen`, `light`, `youHead`, `attendant`. **Test still first:** frame 0 at `shelf` (the four cells, the gauge and the hand all readable above y 1030) and `bank` (six kiosks readable at phone size) |
| K2 | **Kiosk** (focus, realistic) | medium | Generic US self-checkout, no logo or maker's signature shape: body cut open at the section (board with invented chip legends, black cables), touchscreen on an arm turned to the shopper (screen light on YOU's face), flatbed scanner (glass + upright window) with a flat red scan pattern (no bloom), card reader, receipt slot, status light pole, bag rack with two arms and hooks, plain film bags (flutter-able), a platform on **four bar load cells** at its corners on a base frame (realistic: anodized bar, bolts, cable gland), cables to the board. The background kiosks are the same model, whole |
| K3 | **Weight gauge** (in-set readout, the system) | medium | A slim vertical panel behind the bag rack (2D layer anchored to the platform, like the tower's readouts): orange fill = platform weight with eased steps; digits in lb (🎭, Inter 700, `ink` on a `paper` halo, ≥ 28 px at `shelf`); `window` (a band, orange outline, 25% fill) per scanned item; states `match` (outline brightens once), `miss` (outline flickers); `ticks` (dots landing beside the bar, clustering, the window redrawing around them, 3b); `wobble` keys (bump spike, draft waver); `trace` (a staircase line of the visit, drawn on a key, fades on a key). Values from a keyed `weights` list so frame 0 and the last frame match |
| K4 | **Hand-held items** | small | `Figure` holds an item in a hand (a `holding` prop: which hand, which item, from / to keys), so the can, bottle, box and a full bag follow the hand IK; items stay where they're set down (in the bag on the platform). Items: soup can (green or blue invented label), water bottle, cereal box (invented brand), film bag full of groceries, grey hand basket |
| K5 | **`DetailBox` `kiosk` content** | small | A generic self-checkout screen in Day UI: the item list with prices (🎭), and a pause state reading `Unexpected item` / `Please wait` (🎭) with a neutral pause icon; no brand, no maker's colours, text ≥ 28 px. Drawn by one function for the 3D screen texture and the box (as `screenKit`) |
| K6 | **Extras and attendant** | small | Grey extras running a seeded scan-and-bag loop at their kiosks (staggered), walking off with bags on `leaveAt`; the attendant (slate) at the podium, looking up on the light, walking to YOUR kiosk (`walk`), tapping the screen (`point`) |
| K7 | **Theme tokens** (values to the brand-director) | small | A flat red for the scan pattern (reuse `leakRed` or a new `scanRed`, outside the reserved band, never bloomed); a `STORE` location palette (floor, kiosk body, shelving, bag film) |
| — | Audio (tooling) | small | Self-made, free: a scanner beep (two short tones), a soft two-note alert chime (generic), item taps on film, a knock, an air hiss, store room tone. ElevenLabs only with the owner's go-ahead (paid) |

## Frame 0 and the loop

**Frame 0** (Day, 6:20 PM): S at `shelf`, the fixed 3/4 angle. The bagging area cut open (subject ≈ y 620 to 1030): the bag rack
with an open film bag, the platform on its **four load cells, lit orange**, their cables into the cut kiosk body; the gauge behind
the rack, low fill, `2.36 lb` (🎭); YOU's hand at frame left holding the soup can just above the bag. Store depth beyond, ceiling
light, the title block at top (top y 300, two lines to ≈ y 440, plus line 2). Readable: the title block, the gauge digits and the
first caption. Drift 0 on this scene and the last. The can lands at 2.4 s.

**Last frame:** the same picture after line 11: `shelf`, the four cells lit, the gauge at `2.36 lb`, YOU's hand with the can above
the bag, no trace, no card, captions gone. On replay the cut to frame 0 adds only the title block, and the can goes on to land.

## Cover idea

The `shelf` framing at about 30 s: the box just set in the bag, the gauge's step overshooting the orange window, the four load
cells lit under the platform. Cover text: "It's weighing you." / or "The shelf is a scale." The publisher decides.

## Decisions for the owner

1. **Line 3b's picture.** Recommended: **the row of kiosks** (above): other shoppers' weighings travel as orange dots into YOUR
   gauge and build the window. It uses the one wide shot and stays inside the Section grammar. Alternative (the research's idea):
   **a ghosted queue** of translucent grey shoppers at YOUR kiosk, one after another, each adding a tick. It says "before you" more
   literally, but translucent people are a new look for the channel (identity-level taste), and the style guide warns against
   double-exposing anything that moves.
2. **Title line 2:** `NO. 007 · THE SELF-CHECKOUT · 6:20 PM` (🎭 story time).
3. **The scan-pattern red:** reuse `leakRed` or a new token (brand-director sets the value).
4. **Disclosures (🎭)** for the publisher's "Illustrative:" line: the gauge readings and the window's size, the number of earlier
   shoppers shown, the screen's wording beyond "unexpected item", the four-corner load-cell layout (one patented design), and the
   order of events on screen (a miss, a retry, the attendant).
5. **Music:** under 60 s, so licensed or our own; no preference from the picture.
