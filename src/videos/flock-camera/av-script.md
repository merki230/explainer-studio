# No. 015 (to confirm) · Flock camera: audio + visual script (draft 1, 2026-11-03, before voice)

Words: `script.txt` as approved by the owner on 2026-11-03 (15 lines, after fact-check PASS, ai-tell and spoken-check
polish). Times are **estimates** from `transcript.json` (`yarn timings`, no audio): voice 0.15 → 88.02 s, plus a 1.5 s
tail, comes to **≈ 89.5 s**. The estimate runs at ≈ 2.4 words/s. Our narrator measures ≈ 2.7 words/s, so the real take
should land near **≈ 78–80 s**, still over the brief's ≈ 70 s (F11). Every time below gets re-read from the real
transcript when `spec.ts` is written, after the voiceover.

## The look in one paragraph

One street corner and one car. The corner is the downtown street from No. 006 (`city-slice`), cut through the road,
on a calm weekday afternoon (🎭 2:14 PM, Day). On the right sidewalk, just before the stop line, stands a **generic
plate-camera pole**: a slim dark pole, a small tilted solar panel on top, a small camera housing on a short arm aimed up
the street at rear plates, and beside it a small modem box with a stub antenna and a battery box. The pole has no
logo, no text and no colour code. **YOU's car** (YOU's paint, crossover shape, plus a **roof rack**, an invented plate)
rolls past the pole and stops at the red light. That is "your car". **Orange is only the data path**: the IR pulse and
the stills the camera takes, the boxes and marks the software draws on the photo, the record, its trip off the pole to
the server room, the search's pulse, the matching records and the retention ruler. Not orange: the pole, the
camera body, the signal, the car's lamps, every label and card text. The data's second place is a **two-section sheet**
reached by following the path up. Below is a server room (two generic racks, "the cloud"), and above it an office
with one extra at a desk whose monitor faces them. There are no people being followed, no police, no uniforms, no
badges, no maps of a route.

**On-screen words** (all ink, all plain labels): the title block; in the camera's detail box the plate text
`8KTR 214` and the labels `LIGHT BLUE` · `SUV` · `ROOF RACK` plus a blank make badge (F2); in the record,
`ELM ST · CAMERA 12` and `TUE · 2:14 PM`; the search query and result rows; the callouts `REGISTRATION RECORDS`,
`INFRARED LIGHT`, `30 DAYS`, `7 DAYS`. No brand, model, state, real street or source text.

## Locations

| Code | Location | Built with |
|---|---|---|
| **A** | The corner: the No. 006 city street (three lanes, sidewalks, trees, stop line, post signal, cut face with the duct bank and storm sewer), Day. The pole on the right sidewalk ≈ 6 m before the stop line. YOU's car in lane 3 (nearest the camera), driving away from the camera, so its rear plate faces both the pole camera and our camera. Optional grey traffic in lanes 1–2 | `city-slice` + **N1** (pole), **N2** (roof rack), **N5** (framings, loop) |
| **B** | The data's sheet, two sections stacked at the fixed angle with sky between them. Bottom is the **server room** (two generic racks with record slabs, neutral LEDs, the floor's front cut face carrying the retention ruler). Top is the **office** (a plain desk, a monitor turned to the extra sitting at it, a keyboard, a plant) | **N4** (a `report-slice` location variant, or a new `camera-chain` scene; the scene-builder decides) |

A → (`follow` up the path) → B → (`slide`) → A. Two location changes, no hard cuts. Inside each location every framing
change is a glide.

## Title block

Line 1: `How does a plate camera` / `know your car?` (two lines, ≤ 32 characters each). Line 2:
`NO. 015 · THE CORNER · 2:14 PM` (the number is to be confirmed: `blade-battery` is also in progress). The block is up
from frame 0 and fades at ≈ 9.0 s, before line 3's ghost callout (F1).

## Line by line

Cues are copied word for word from `script.txt`. Three lines open with "The company says", so those cues run one word
longer to stay unique. Times are video seconds (estimates).

| Sc | Cue · in (s) | Line (words) | What's on screen | Motion / events (s) | Overlay | Transition in |
|---|---|---|---|---|---|---|
| 1 | `Flock cameras don't just` · 0.00 | Flock cameras don't just read your plate. | **Frame 0, A `corner`:** the pole in the right foreground, YOU's car in lane 3 just past it, braking for the red, brake lamps lit, wheels turning forward. The camera's status dot is orange (active) | 0.0 slow push starts, drift 0 · 0.3 a faint orange **IR pulse** from the lens ring toward the plate, and 3 small orange-edged still frames peel off the lens and fold back into the housing (0.6 s) · 1.2 the car stops at the line, lamps stay lit · 1.8 "read" a thin orange outline draws round the 3D plate · 2.5 "plate" it pulses once | **Title block** 0 → 9.0 | — (frame 0) |
| 2 | `The company says they` · 3.24 | The company says they also pick out your car's make, color and even a roof rack. | A, glide to `poleClose` (the camera head top right, the car's tail and roof below it) | 3.3 glide (0.8 s) · 3.6 **detail box** in (camera view, colour still of the car's rear three-quarter from pole height) · 6.5 "make" an orange box on the badge area, chip `MAKE ▭` (F2) · 7.0 "color" an orange sample box on the tailgate, chip `LIGHT BLUE` · 7.6 chip `SUV` (body box) · 8.3 "roof rack" an orange box round the rack, chip `ROOF RACK` · each chip lands with a pulse of the camera's status dot in 3D | Title block (to 9.0) · **Detail box** `camera-view` 3.6 → 9.1, left edge x 120, top ≈ y 710, leader to the camera | continue (glide) |
| 3 | `You'd guess the camera` · 9.38 | You'd guess the camera looks your plate up in registration records. | A, glide to `poleSky` (the pole head and the sky up and right of it) | 9.4 glide · 9.7 "guess" a **dashed ink line** draws from the camera up and right (0.8 s, ghost grammar, never orange) · 10.5 at its end a **ghost outline** of a filing cabinet draws on (0.8 s) · 11.7 "plate" the 3D plate's outline pulses · 12.6 "registration" callout in · 13.4 a grey car in lane 2 rolls up and stops beside YOU's car (its lamps light) | **Callout** `REGISTRATION RECORDS` / `The guess` on the ghost cabinet, 12.4 → 14.1 | continue (glide) |
| 4 | `But in its own letter` · 14.21 | But in its own letter, the company says | A, glide back to `poleClose` | 14.2 "But" the ghost cabinet and dashed line fade (0.7 s, opacity only) · 14.4 glide · 15.4 "letter" (no document on screen, F6) the camera's status dot pulses · 16.3 YOU's head turns to the signal (a glance) | — | continue (glide) |
| 5 | `those details come from` · 17.20 | those details come from analyzing the photo, not from car registration data. | A `poleClose`, slow push toward the car's tail | 17.3 detail box in (the colour still, no chips yet) · 18.8 "analyzing" a soft orange scan band sweeps down the photo (0.8 s) · 19.4 "the photo" the boxes come back on the picture itself, one after another: rack, tailgate sample, badge, body (0.25 s apart), each chip landing under it · 21.0 "car registration" nothing new is added; the chips hold, and the status dot pulses · 22.1 "data" the box holds | **Detail box** `camera-view` 17.3 → 22.6 | continue |
| 6 | `Reading the plate is` · 22.75 | Reading the plate is the old part. | A, glide to `plate` (the car's tail with the plate and the camera head both in frame) | 22.8 glide · 23.6 "plate" the 3D plate's orange outline draws again · 24.6 "old" the signal's cross-street lenses change (pedestrian phase; signal stays red for lane 3) · 25.2 the grey car in lane 2 edges forward a little (creep, lamps lit) | — | continue (glide) |
| 7 | `A plate reader can light` · 25.54 | A plate reader can light it with infrared you can't see, | A, glide into the **camera cut-away** (`poleHead`): the housing's side opens like a repair photo. Inside are the lens, the IR LED ring round it, a small board with invented legends, a cable to the modem box, and the battery box beside it | 25.5 glide (0.8 s) · 26.2 the housing's cut-away opens (0.8 s) · 26.9 "light" the IR LEDs light **orange** and a faint orange cone reaches out to the plate · 28.0 "infrared" the plate in the 3D set brightens (it reflects the IR) while the street's light stays the same · 29.2 "see" the cone fades | **Callout** `INFRARED LIGHT` / `Invisible to the eye` on the LED ring, 27.6 → 29.5 | continue (glide) |
| 8 | `and software reads the letters` · 29.70 | and software reads the letters by their shape. | A, the cut-away closes (0.8 s) and the camera glides out to `plate` | 29.7 close and glide · 30.0 detail box in, **IR still**: monochrome, the plate bright, the letters dark · 30.5 "reads" small orange boxes step across the plate, one per character (0.15 s each) · 31.8 "by" each boxed letter is copied below the photo as ink text · 32.4 "shape" the text `8KTR 214` completes; the boxes fade to a single plate box | **Detail box** `camera-view` (IR) 30.0 → 33.0 | continue (glide) |
| 9 | `Telling the make and color` · 33.16 | Telling the make and color is the newer trick. | A, glide to `poleClose` | 33.2 glide · 33.6 detail box in, colour still, the plate chip `8KTR 214` already under it · 34.0 "make" the badge box and `MAKE ▭` chip land · 34.6 "color" the sample box and `LIGHT BLUE` land · 35.6 "newer" both chips pulse once | **Detail box** `camera-view` 33.6 → 36.6 | continue (glide) |
| 10 | `After training on large sets` · 36.77 | After training on large sets of labeled car photos, software can learn to do it. | A `poleClose`, slow push | 36.9 detail box in: the still shrinks into one tile of a **grid of labeled car photos** (F4) · 37.2 "training" the grid streams up through the box, each tile a generic car with one ink label (`RED`, `SEDAN`, `WHITE`, `PICKUP`, `ROOF RACK`…) · 38.4 "sets" the stream speeds up (64 tiles) · 39.0 in 3D the signal turns **green**; lamps off, YOU's car pulls away (wheels forward), the grey car beside it too · 41.3 "learn" the grid collapses back onto our photo; its chips snap on together · 42.3 the car has left the frame up the street | **Detail box** `camera-view` (training) 36.9 → 42.7 | continue |
| 11 | `Each sighting is then saved` · 42.85 | Each sighting is then saved with its plate text, its labels, and when and where the car passed. | A, glide to `poleHead` (the camera and the modem box; the empty lane below) | 42.9 glide · 43.2 detail box in, **record** layout: the photo as a thumbnail · 45.5 "plate text" `8KTR 214` lands · 46.7 "labels" `LIGHT BLUE · SUV · ROOF RACK` + `MAKE ▭` land · 47.6 "when" `TUE · 2:14 PM` · 48.3 "where" `ELM ST · CAMERA 12` · 48.6 the record's edge turns orange (saved) · 49.0 orange **rings** rise from the modem's antenna; the path starts up out of the frame top | **Detail box** `camera-view` (record) 43.2 → 49.6 | continue (glide) |
| 12 | `A search can ask` · 50.12 | A search can ask for a color and make at a certain place and time, and get back the sightings whose labels match. | **B `chain`:** the path climbs in from the bottom edge, into the server room, and reaches the first rack (node dot). A record slab slides into the rack among many. Glide up to `desk` | 50.1 follow up (24 fr), the path's seam line · 50.9 the slab slots in, the rack's node dot lights · 51.4 glide to `desk` · 51.7 the extra types (hands on the keyboard) · 52.0 detail box in, **search screen**: the query field fills chip by chip, `LIGHT BLUE` ("color"), `MAKE ▭` ("make"), `ELM ST` ("place"), `2–3 PM` ("time") · 55.5 "get back" an orange pulse runs from the monitor down the path to the rack; matching slabs in the rack light up · 56.5 "sightings" the pulse returns; 3 result rows drop into the screen, the rest stay out · 58.0 "match" the matching rows get the 5 px orange edge | **Detail box** `search` 52.0 → 58.5, leader to the monitor | **follow** (up) |
| 13 | `The company says a paper` · 58.73 | The company says a paper, covered or missing plate doesn't stop the search from finding the car. | B `desk`, slow push | 58.8 detail box in, the same results; three more rows arrive with odd plates · 60.1 "paper" a row whose plate field reads `PAPER TAG` · 60.7 "covered" a row reading `COVERED` · 61.5 "missing" a row reading `NO PLATE` · 62.4 the extra leans in · 64.3 "finding" all those rows take the orange edge: same labels, so they match | **Detail box** `search` 58.8 → 65.5 | continue |
| 14 | `The labels can match` · 65.78 | The labels can match without the plate. | B, glide down to `racks` (the two racks, close) | 65.8 glide · 66.1 "labels" in the lit slabs the label strip glows · 67.3 "without" the plate strip of three slabs goes dark, yet their label strips stay lit (F9: no thin coplanar detail) · 68.1 "plate" the pulse runs up to the office once more | — | continue (glide) |
| 15 | `Flock's default for keeping` · 68.82 | Flock's default for keeping saved sightings used to be thirty days, | B, glide to `ruler` (the server room's floor cut face, the racks above) | 68.8 glide · 69.8 the **retention ruler** draws along the floor's front cut face, an orange line with 30 day ticks (§ 5 ruler) · 70.6 "saved sightings" record slabs ride out along it, one batch per tick (time-lapse) · 72.5 "thirty" the batch at tick 30 fades softly at the line's end · 73.0 "days" a new batch enters at tick 0 | **Callout** `30 DAYS` / `Old default` on tick 30, 72.3 → 73.4 | continue (glide) |
| 16 | `and since August 2026` · 73.50 | and since August 2026 it's seven for new police customers. | B `ruler`, slow push toward tick 7 | 73.5 batches keep riding · 75.3 "seven" the ruler's lit end slides back from tick 30 to tick 7 (0.8 s); ticks past 7 dim to ink, and the slabs past 7 fade (a soft sweep, opacity only) · 76.4 the next batch enters at tick 0 and the oldest fades at tick 7 · 77.2 one more step | **Callout** `7 DAYS` / `New police customers` on tick 7, 75.3 → 77.6 (F7) | continue |
| 17 | `The company says whoever` · 77.76 | The company says whoever runs the camera can pick another number, within the law. | B, glide up to `desk` (the ruler still in the lower edge of the frame) | 77.8 glide · 78.6 detail box in, **settings**: `KEEP SIGHTINGS FOR` `[ 7 ] DAYS` with − / + · 79.5 "runs" the extra reaches to the mouse · 80.9 "pick" the field steps 7 → 14 (🎭) and, in the lower frame, the ruler's lit end slides out to tick 14 in sync · 82.4 "within the law" an ink bracket under the field marks its allowed range (no number on it) · 83.2 holds | **Detail box** `settings` 78.6 → 83.6 | continue (glide) |
| 18 | `If there's one near` · 83.78 | If there's one near you, do you know which number it uses? | **A again:** YOU's car rolling up toward the pole and the red light | 83.8 slide (18 fr) · 84.5 the car comes in from the frame's lower left (no pop at the plane, N5) · 85.6 "do you" the light is red · 86.6 "which" the car brakes, lamps lit · 87.7 "uses" the camera's dot is lit orange; the car passes the pole · 89.5 **last frame = frame 0** (car position, speed, lamps, wheel angle, signal, camera) | — (captions end ≈ 88.0) | **slide** |

### Gaps (longest stretch with no listed event, estimated)

Every scene has an event at least every ≈ 2 s on the estimates. The longest gaps: scene 4 (16.3 → 17.2 continues
into scene 5's box), scene 5 (19.4 → 21.0, during which the chips land in turn), scene 11 (43.2 → 45.5, 2.3 s: add the
thumbnail's capture time ticking if Studio shows a lull), and scene 13 (62.4 → 64.3). Re-check on the real take.

### Scene lengths

Between 2.8 and 8.6 s. **Over 6 s:** scene 2 (6.1), 10 (6.1), 11 (7.3), 12 (8.6), 13 (7.0), 17 (6.0). Each of these
holds one detail box whose content changes every ≈ 1 to 2 s. An anchored box can't carry across a cut (No. 012's lesson),
so splitting them would make the box blink out and back in. Split 12 at `and get back` only if the take stretches it
past 9 s. **Short:** scene 6 (2.8 s, one glide and two events) and scene 4 (3.0 s).

## Lines that are hard to show (fixes proposed, not made)

- **F1 · The question isn't spoken early.** The script has no question until the very end (line 15). Line 3 is a
  guess, a statement. § 6 wants the title block to show the question the voice asks, held to ≈ 0.8 s after it is
  spoken. **Proposal:** the title block shows the mechanism question `How does a plate camera know your car?` (two
  lines) from frame 0 and fades at ≈ 9.0 s, before the line 3 callout. That's the hybrid-city F1 precedent: the main
  session decides, owner if it's seen as a title-block default. Alternative: `Do you know which number it uses?` is the
  spoken ending, but it means nothing at frame 0.
- **F2 · "make" with no brand on screen.** The voice says "make" three times (lines 2, 7, 10). Logos and maker names
  are banned, and YOU's car is generic. **Proposal:** a **blank badge chip**: an outlined badge oval with no mark, plus
  the word `MAKE` (`MAKE ▭`), as the visual notes in `sources.md` suggest ("a generic word or a blank badge").
  Alternatives: an invented make name (🎭; it risks reading as a real brand) or no make chip at all (the words then don't
  match the picture). I recommend the blank badge.
- **F3 · A detail box for a camera's view.** § 6 opens a detail box for a **screen** (held, or a screen no one on screen
  holds). A camera has no screen. Here the box shows "what the camera sees" (its stills) and what the software
  draws on them, with the leader going to the camera. That's a new use of the box. **Brand-director:** a short ruling or
  spec before the build: the leader to the lens, the tab still reading `DETAIL`, the orange boxes as "the system's mark
  in a card". Fallback: the same content in a § 6 full-frame screen box (scrim, no leader), which is capped at 2 per
  video and so can't cover scenes 2–11.
- **F4 · Line 8, the training.** The training doesn't happen on the pole, so a box anchored on the camera that shows a
  grid of labeled photos is a picture of the idea, not of this camera. **Proposal:** keep the in-box grid (cheap,
  stays on the corner, and the car leaving in 3D gives the scene its motion), disclosed as illustrative. Alternative:
  slide to **The Lab** (§ 3) re-dressed as a labeling bench (a wall of labeled car prints, a monitor), which costs two
  slides and ≈ 6 s off the corner for one line. I recommend the grid.
- **F5 · The car waits ≈ 38 s at the red (1.2 → 39.0 s).** Plausible for a US downtown red, but long. The red is what
  keeps the plate in front of the camera for lines 2–8. Scene 7's IR pulse is a **re-enactment** of the capture, not a
  second capture (a series of stills is real, a capture 25 s later isn't claimed). Motion during the wait comes from
  the glides, the box, the cut-away, the IR, the grey car in lane 2 and YOU's glance. Alternative: the car rolls through
  at frame 0, and lines 2–8 live only in the box (the still). That's honest, but it loses the 3D plate and IR beats. I
  recommend the red.
- **F6 · "in its own letter" (line 4).** Source text and documents are banned on screen (§ 6 No source text), so
  nothing shows the letter. The ghost fading on "But" carries the turn, and the box coming back on "analyzing the
  photo" carries the answer. Leave it.
- **F7 · "new police customers" on screen.** The fact-checker ruled "the default is seven" for everyone ❌. An on-screen
  `7 DAYS` with no scope would generalise the claim. **Proposal:** sub-line `New police customers`, the voice's own words,
  in ink. The owner's "no police imagery" is about pictures, so this is a word label, but it puts "police" on screen.
  **Main session / owner:** confirm. The alternative `7 DAYS` / `Default since Aug 2026` needs the fact-checker to accept that
  the voice carries the scope.
- **F8 · The data's trip is unspoken.** The script never says "cell" or "cloud". The path (rings from the modem, then a
  path up the sheet into a server room) is the picture of Flock's claims 12–14 (LTE, upload, cloud), attributed to the
  company in the description. The path drawn up the sheet after the rings is the No. 012 grammar (a wireless hop shown as
  rings, then a route on the drawing). It doesn't claim a wire. The racks are generic: no Amazon, no logo.
- **F9 · Record slabs and their strips (scenes 12–16).** The "plate strip goes dark, label strip stays lit" beat needs
  each slab built as two separate pieces with real depth between them. **No thin detail lying on a face** (owner: no
  coplanar flicker). The same goes for the ruler (25 mm proud of the cut face, § 5), the plate's characters (a texture on
  the plate, not a decal on the body) and the solar cells (a texture, not stacked planes).
- **F10 · "within the law" (line 14).** There's no picture for law. The ink bracket under the settings field (no number)
  says "a range" without inventing one. Optional: drop it and let the voice carry it.
- **F11 · Length.** ≈ 78–80 s expected on the take (≈ 89.5 s estimated). Over 60 s means our own music or none (§ 9,
  § 10). The brief said ≈ 70 s. Nothing here pads: 15 lines, 18 scenes. A shorter video needs a script cut (scriptwriter),
  not a picture fix.
- **F12 · IR drawn orange.** The brief's orange list is "photo, labels, record, search, retention". The IR pulse is how
  the photo is taken, and the voice says "you can't see", so I treat it as part of the hidden system: a faint orange
  cone, halo only, **no spill light** on the car except the plate brightening. Alternative: an ink outline of the cone
  (not the system). The main session decides; brand-director if it's read as an orange-rule question.
- **F13 · The office extra (scenes 12–13, 17).** "Whoever runs the camera" searches and sets the days. The extra sits
  at a plain desk: slate clothes, no uniform, badge, flag, seal or wall text, monitor turned to them (read only in the
  box). If the owner reads any desk as "police", the fallback is a search screen box anchored to the rack (a "screen
  no one on screen holds", which needs the voice to name a viewer, and it doesn't). I recommend the extra.

## Reused vs new

**Reused as they are:** `city-slice` (the street, cut face and duct bank, three lanes, stop line, post signal and its
keys, trees, signs, whole `DrivingCar`s with invented plates and `'auto'` lamps, `wheels: 'forward'`, `shape:
'crossover'`, YOU's body and driver, grey extras' cars), the ghost outline's dashed style (`GhostCar`, § 3), the ring
grammar and the right-angle data path (`report-slice` rings, `OrangePath`), the § 5 ruler (No. 009), `report-slice`'s
rooms (server racks with neutral LEDs, the desk with a monitor turned to an extra) for B, `DetailBox`'s frame and tab,
`Callout`, `TitleBlock`, follow / slide / continue and glides.

**New (scene-builder, one brief each):**

- **N1 · The camera pole** (`three/real/`, e.g. `PlateCameraPole`). It stands on the right sidewalk (`walkR`) ≈ 6 m
  before the stop line, the camera on a short arm aimed up the street at lane 2–3 rear plates. Parts: a slim dark pole
  (≈ 4 m, `HIGHWAY.galvanized` or `device`), a small solar panel tilted south (≈ 0.5 × 0.7 m; cells as a texture), a
  small camera housing with a sun hood, the lens and an **IR LED ring** round it, a small modem box with a stub antenna,
  a battery box, and a concrete footing seen in the cut ground (no conduit). Everything generic: no logo, text, sticker
  or brand colour. Props:
  - `status` keys: the LED is `ledOff` idle, `orange` active.
  - `ir` keys: the ring lights orange; a faint orange cone (halo only, bloom layer, 25 %) reaches the target plate; the
    target car's plate brightens. No spill light.
  - `shots` times: 3 small orange-edged still frames peel off the lens and fold back into the housing over 0.6 s.
  - `cut` keys: the object cut-away (§ 3). The side opens over 0.8 s to show the lens, LED ring, a small board with
    invented legends, the cable to the modem, the battery.
  - `rings` times from the antenna (No. 009 / No. 012 grammar).
  - `pathFrom`: the antenna top, where B's path starts.
  - Anchors for callouts and the detail box leader (lens, LED ring, antenna).
- **N2 · Roof rack and plate outline on a whole car** (`CityCar` `roofRack: true`, `plateMark` keys). Two crossbars
  on two side rails, matte black (`REAL.flex`-dark or a new `REAL` token), real thickness, on the crossover roof. The
  plate mark is a thin orange outline round the 3D plate (proud of the plate, never coplanar) that draws on and pulses
  on keys.
- **N3 · Detail box content `camera-view`** (after the brand-director's F3 ruling). A flat, crisp 2D drawing of the
  pole's view of YOU's car (rear three-quarter from above, same paint, rack and plate as the 3D car), modes keyed in
  time:
  - `color`: the colour still.
  - `ir`: monochrome, plate bright, letters dark.
  - `training`: the still shrinks into one tile of a grid of generic labeled car tiles that streams upward (16 → 64
    tiles), then collapses back.
  - `record`: thumbnail plus fields.

  Marks: orange outline boxes (plate, per-character, badge, paint sample, body, rack), a soft orange scan band. Chips
  under the photo: Inter 700 ≥ 28 px, ink on paper, landing with a 6 px rise on keys. Text is plain labels only. Orange
  only for the boxes, the scan band and the record's saved edge (§ 1, the system's mark in a card).
- **N4 · B, the data's sheet** (a `report-slice` `location: 'camera-chain'` variant, or a new scene). Two stacked
  sections:
  - **Server room:** two generic racks with neutral LEDs; **record slabs** in the racks, each built as a plate piece and
    a label piece with real depth between them (F9); slabs that slide in, light up on a match and dim. Its floor's
    front cut face carries the **retention ruler**: § 5, 30 ink ticks, the orange line drawn to the current `days`
    (keys `{at, days}`, the end sliding over 0.8 s), batches of small slabs riding along it one tick per step (🎭
    time-lapse) and fading past the end.
  - **Office:** a plain desk, a monitor turned to the extra (`CAST.extra`), keyboard and mouse, a plant; no wall text,
    flag or badge. The extra's gestures: type, lean in, reach to the mouse.
  - **The path:** in from the bottom edge (the `follow` from A) → rack (node dot) → monitor (node dot). Pulses up; a
    query pulse down and back on keys.
  - **Framings:** `chain` (both sections), `racks`, `ruler`, `desk`.
- **N5 · `city-slice` framings and loop.** New framings:
  - `corner`: frame 0 and the loop. The pole and the car at the stop line between the title block and the captions.
  - `poleClose`: the camera head with the car's tail and rack below.
  - `plate`: the plate and the camera head.
  - `poleSky`: the pole head and sky for the ghost.
  - `poleHead`: the cut-away.

  A cross-street pedestrian phase is optional. **The car must not pop in at the cut plane** in scene 18: enter from out
  of frame. **`loop`:** the last frame lands YOU's car at frame 0's position, speed and wheel angle (solved modulo the
  spoke pitch), lamps lit, signal red, drift 0 (No. 012's lesson).
- **N6 · The ghost lookup** (in A). A dashed ink line from the camera to a dashed outline of a filing cabinet in the
  sky (§ 3 ghost: 3 px, dash 16 / gap 10, draws over 0.8 s, fades over 0.7 s, never orange, a callout anchor on the
  cabinet). It's the second "not here" use: a lookup that doesn't happen.
- **N7 · Detail box contents `search` and `settings`** (the office monitor, Day light UI `#fafafa`, generic, no real
  product's look, no logo).
  - `search`: a query field filled with chips on keys; result rows (thumb, plate field, labels, time) dropping in on
    keys. Non-matches never show. Matches get the 5 px orange edge (the system's mark). Plate fields can read
    `PAPER TAG`, `COVERED`, `NO PLATE` in `inkSub`.
  - `settings`: `KEEP SIGHTINGS FOR [ n ] DAYS` with − / +, the number stepping on keys, and an optional ink range
    bracket with no number.

  Text ≥ 28 px.

**Brand-director (before the build):** F3 (the camera-view box), F12 if escalated, and the roof rack's colour token
if no existing `REAL` token fits.

## The loop seam plan

1. **Frame 0 (scene 1):** A `corner`. YOU's car in lane 3 just past the pole, braking (lamps lit), at a set position
   and speed. The signal is red, the camera's status dot is orange, no path, no rings, no ghost, no box. Drift 0, and
   the camera starts a slow push from distance D0. The title block is up.
2. **The last shot (scene 18):** a `slide` into A at ≈ 83.8 opens the slice **clean** (no trace of the path, § 5
   Trace), signal red. YOU's car comes in from out of frame, brakes from ≈ 86.6 and reaches **frame 0's position,
   speed and wheel angle on the last frame** (N5 `loop`). The camera pushes from a little further out and lands exactly
   on D0 at the last frame (the No. 011 / No. 014 pattern), drift 0.
3. **Phase-locked details:** the status dot is lit at both ends; the IR pulse and stills of frame 0 start at 0.3 s, so
   none is in the air on the last frame; the grey car in lane 2 is absent at both ends; trees and signals static.
4. **Words:** the voice ends at ≈ 88.0, and the captions are gone for the last ≈ 1.5 s. On replay the cut adds only the
   title block. The last line ("which number it uses?") hands over to "Flock cameras don't just read your plate."
5. **Check:** `yarn stills flock-camera --frames=0,<last>` and compare the two PNGs; motion in Studio.

## For the publisher's 🎭 "Illustrative:" line

The street, the corner and the story time (2:14 PM, Tuesday); the camera pole's look (generic, not a Flock unit); the
car and its plate `8KTR 214`; the label wording on screen (`LIGHT BLUE`, `SUV`, `ROOF RACK`, the blank make badge);
the boxes drawn on the photo; the grid of labeled training photos; the record's fields (`ELM ST · CAMERA 12`,
`TUE · 2:14 PM`); the search screen, its query (`2–3 PM`) and its rows, including the paper, covered and missing plates;
the server room and office; the settings screen and its 14-day step; the orange path, rings and ruler, which are
drawings of the data, not measurements; the time-lapse of days on the ruler. **Sourced, not illustrative:** 30 days → 7
days (Flock, 2026-08-13 and 2026-09-01 posts, new police customers).

## Sound (note only, for later)

Physical sounds only: a quiet downtown street bed, tire hush and a soft brake creak at each stop (scenes 1, 18), the
grey car's stop and pull-away, both cars pulling away on green (scene 10), keyboard taps and a mouse click in the office
(12, 17), a faint server-room fan bed in B. The camera, IR, stills, rings, path, ruler and every box make **no sound**
(no shutter click: Flock's capture is silent, and a click would read as a speed camera). Whoosh on the slide only.
Over 60 s: our own music or none.
