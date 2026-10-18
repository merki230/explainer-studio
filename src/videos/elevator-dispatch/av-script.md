# No. 003 · The Elevator: audio + visual script

Draft by the director, 2026-10-17, before voice. Inputs: `script.txt` (final, owner-approved, 17 lines, 282 words),
`performance.txt`, `sources.md` (the fact-check ruling at the top, § 3D scene list, the orange note), `brand/style-guide.md`
v0.11.1, `brand/brand.md`, the scenes and parts in `src/scenes`, `src/three`, `src/three/section`, `src/three/real`,
`src/components`.

**Times** are estimates at 2.92 words/s from the script words only, as in No. 002. The `[pause]` tags and ellipses in
`performance.txt` add about 0.4 to 0.6 s each (4 tags, 7 ellipses), so by the end the real times run about 4 to 5 s later
(spoken length about 101 s). The estimated `transcript.json` from `yarn timings` runs slower (2.5 words/s, 112 s). Re-time
against the real voiceover before writing `spec.ts`.

**The world.** Everything is **Day** (a weekday morning in an office tower; no time-passes beat). Two locations:

- **T, the tower:** an office building cut open, seen whole in the vertical frame: a lobby (L) and floors 1 to 5, a
  machine room on top with the **group controller** (a realistic generic cabinet). A bank of **four shafts, A to D** (letters
  set into the cut face above each shaft head), each with a realistic car cut in half so its riders show, rails, ropes and
  a counterweight. A landing on every level with a call panel (brushed steel, up and down buttons). YOU waits on **floor 4**.
  Framings: `tower` (whole building, frame 0), `shafts` (floors 1 to 5 and the four cars), `top` (machine room and
  floors 4 to 5), `landing` (floor 4: YOU, the call panel, the car arriving).
- **K, the hotel:** a tall hotel tower from the same kit (about 15 levels, never seen whole). Its lobby has four doors
  lettered A to D and **no call buttons**, a destination keypad on a pedestal, a reception desk, guests with suitcases.
  Framings: `lobby` and `mid` (a band of upper floors where the cars stop).

**Layout to settle on a test still first.** The section has to show all four cars cut open *and* a landing where YOU faces a
call panel, without the X-ray (it can't be the opening image, § 5). Proposal: a jogged section, as architects draw them:
the cut runs through the shafts' centre lines (cars cut in half, riders visible), then steps forward on the right to keep a
landing about 3.0 wide on every level, the call panel on the shaft bank's end wall, YOU seen 3/4 from behind. The
scene-builder proposes the layout on one still before building the rest (Decision 1).

**Car positions** (🎭 illustrative, disclosed), the Peters "closest car with a stop first" case (A3) placed in our tower:

| Car | Frame 0 and last frame | Riders | Role |
|---|---|---|---|
| A | Lobby, parked, doors closed | 0 | The farther car (4 floors away), nothing in its way: the controller's pick |
| B | Floor 5, stopped, doors closed | 1 (getting out at 5) | The closest car (1 floor), with a stop to make first |
| C | Floor 1, doors closed | 6 (full) | Heading up, full |
| D | Floor 2, doors closed | 2 | Heading down, away from YOU |

**Colour.** Orange is only the controller's decision: its lines down the shafts to the cars, node dots (controller, chosen
car, calls it has assigned), travelling dots, the direction chevrons and load bars it "knows" (5), the winner's mark (8), the
flicker of plans (9), and the keypad-to-door assignment lines in K. **Not orange:** call-button lights and the hall lanterns
are `warning` yellow `#eedd2b` when lit, flat, no bloom (v0.11.1; `sources.md` orange note); the lanterns stay dark
throughout (see 12b). Car ceiling lights are neutral (`screenLight` or plain white panel, never in the reserved band); cables
and ropes grey; car-call stop ticks and score digits `ink`; the dashed "preview" outlines `ink`; the keypad screen a light
generic UI with an `ink` letter. Brushed steel and any brass trim below 60% saturation; no orange safety stickers.

**Title block** (frame 0 to about 9.7 s): line 1 `Why would it skip the closest elevator?` (two lines: "Why would it skip" /
"the closest elevator?"; the spoken "So" dropped and "one" made "elevator" so it reads on frame 0 without the first
sentence; Decision 4); line 2 `NO. 003 · THE ELEVATOR · 8:52 AM`.

## Revision 2 (2026-10-18): shot plan for variety and clarity

Owner feedback on the rough cut: "the start is weak" (frame 0 was the whole tower, too wide to read as "I'm pressing a
button in a lobby with four cars"), and "the rest of the video is the same wide animation". Script, voice and timings
unchanged; this revision replaces the **framings and camera moves** of the table below (what happens in each beat stays
as written there unless noted). Times are the directed take (`transcript.json`, 92.9 s with the tail). Built in `spec.ts`.

**Framing sizes** (one fixed 3/4 angle, fov 26°; `distance` is along that angle): **C** close, one subject fills the frame
(distance 9.5 to 21); **M** medium, two or three shafts, one to three floors (22 to 34); **MW** medium-wide (42 to 71);
**W** the whole tower (88 to 94), only where the whole picture is the point. Camera keys (`cameraKeys`) do the moves:
a glide into each new framing (0.7 to 0.9 s), then a slow push, a crane or a pull-back on a line's key word.
**Subject band:** on C and M shots YOU's feet and the subject sit above y ≈ 1030, clear of the caption band.

| # | Words (cue) | In → out (s) | Size | On screen and camera | Overlays |
|---|---|---|---|---|---|
| 1 | When you press… (hook + question) | 0.00 → 9.12 | **C → W → MW** | **Frame 0, close:** YOU's hand pushes the lit down button on 4 (ring `warning` yellow), B's doors behind YOU and C's on the right, B's rider at 5 just above. 1.5 → 3.4 s (on "computer's already picking") the camera pulls back to the whole cut-open tower; dots start down the line to A; B's rider turns on "not". Question: slow push toward floors 3–5; a bright dot runs past B down to A on "skip" (7.44) | Title block (to 9.12), captions |
| 2 | Look at the shafts… closest car has a stop | 9.12 → 13.00 | **M** | Glide to B at 5 straight above YOU at 4 (B_MED), slow push; the line fades to its node dots; B's stop tick on "stop" | Tag YOU (to "car has a stop"), then callout CLOSEST CAR / a stop first (beside B) |
| 3 | and a farther one could come straight to you | 13.00 → 15.56 | **C/M, crane** | Glide down to A parked in the lobby (A_LOBBY); on "straight" (14.3) A's dashed preview races up and the camera cranes up with it to YOU's floor (A_UP) | Callout FARTHER CAR (to "straight") |
| 4 | Many systems pick by time… | 15.56 → 21.52 | **MW** | Pull back to A's shaft from the lobby and B at 5 (RACE); the race of the two previews; A's line comes back with a dot on "farther car" | Captions |
| 5 | It knows where every car is… | 21.52 → 24.56 | **C → MW** | Glide up to the **controller cabinet** (CTRL, door open on its board); on "every car" lines fan out of it across the machine room; on "which way" the camera follows them down (KNOW) as C and D start up with chevrons | Callout GROUP CONTROLLER / the building's computer (to "which way") |
| 6 | and it can weigh each one… | 24.56 → 27.28 | **C, track** | Inside full **car C** (six riders), the camera tracking it up to 2; its load bar fills | Callout FULL (beside C, from "how full") |
| 7 | For each car… seconds… | 27.28 → 31.24 | **MW** | The four readouts count up (SCORES, held). **Fix:** the decision lines fade on the cut (B, C, D gone, A's to its node dots), so only the numbers talk | Readouts (the one card) |
| 8 | counting the stops it's already promised | 31.24 → 33.48 | **M** | B at 5 with its stop tick (pulses) and its readout 9 → 19; YOU below (B_STOP) | Readouts |
| 9 | Some systems also add up… delay everyone else | 33.48 → 37.60 | **M** | Full car C and D's two riders (DELAY); they check their watches on "delay"; C 14 → 32, D 22 → 24 | Readouts |
| 10 | In those systems, every car gets a score… | 37.60 → 42.93 | **MW → M** | Back to the four readouts; on "lowest" A's readout gets its orange mark, A's line returns with a bright dot (no other lines) and the camera pushes in on A starting up (A_WIN); the readouts hold to the cut | Readouts |
| 11 | With four elevators and five floors calling | 42.93 → 45.76 | **W** | Pull out to the whole tower; a caller on L, 1, 2, 3 pushes, each button lights | Captions |
| 12 | there are already 1,024 ways… | 45.76 → 49.52 | **W** | The plan flicker; slow push | Counter 1,024 |
| 13 | And most systems keep re-deciding… | 49.52 → 52.96 | **M** | Floor 5 (F5): the new caller pushes, D's link snaps to B, B opens and the caller boards; YOU below | Captions |
| 14 | It can even change its mind… | 52.96 → 55.44 | **M** | Floors 3–5 (MIND), A climbing on the left; YOU's line snaps from A to B | Captions |
| 15 | In one maker's design, it only locks in a car | 55.44 → 58.24 | **M → M-close, push** | Push in on B and YOU (LOCK_PUSH); B starts down; the line hops B → A → B | Captions |
| 16 | once that car has to start braking… | 58.24 → 61.88 | **C** | B brakes down into floor 4 right behind YOU (BRAKE), levels and opens; the line locks on "braking"; YOU looks up | Callout LOCKED IN / once it brakes, on YOU's call button (straight up the pier) |
| 17 | Since around 1990… tell you which elevator | 61.88 → 68.48 | **C → M** | Slide to K, **close on the keypad with YOU standing at it** (KEYPAD, slow push). **Fix:** YOU is at the keypad from the first frame (the walk in from the street arrived after the typing); the hand rises and taps 9 on "enter". On "tell you" the screen answers C, the orange line runs to door C and the camera pulls back to the doors (LOBBY_DOORS) as YOU walks to C | Tag YOU (to "enter your floor"), detail box (keypad, left, from "enter your floor" to the cut) |
| 18 | That lets the system group people… | 68.48 → 71.52 | **W (lobby)** | The whole lobby (LOBBY_WIDE): four guests type in turn, lines to C and A, the groups walk to their doors | Captions |
| 19 | so each car makes fewer stops | 71.52 → 73.76 | **MW** | The hotel's upper floors (`mid`); one solid stop tick per car | Captions |
| 20 | It can be confusing… in hotels… | 73.76 → 79.48 | **C → M** | Close on the guest at the bare wall by B (WALL_B): pats it, raises a hand; on "in hotels" pull back to the lobby (LOBBY_MED) as two more guests arrive (they now set off ≈ 1 s earlier so they are in frame) | Callout NO UP BUTTON (to "and in hotels") |
| 21 | Button or keypad… everyone at once | 79.48 → 83.24 | **W** | Slide back to the tower, a touch wider; lines to all four cars | Statement "Everyone / at once." (low) |
| 22 | which can mean you wait longer | 83.24 → 85.44 | **M** | Glide in to YOU at 4 (YOU_MC); B slides past without stopping (its trip moved to 83.3 so it passes ≈ 84.6, after the glide lands); YOU looks up | Captions |
| 23 | Next time you press that button… | 85.44 → 88.68 | **M → W** | YOU's hand rises and presses (the ring lights); on "farther car shows up" the camera pulls back to the whole tower as the line to A draws | Captions |
| 24 | it was probably the one the computer scored lowest | 88.68 → end | **W → C** | A bright dot runs down to A, then the camera pushes back in to **frame 0's close-up** (by ≈ 91.4) and holds; dots ease to rest. **Last frame = frame 0** minus the title block | Captions end before the hold |

Rhythm: C W | M | C | MW | C | C | MW | M | M | MW-M | W | W | M | M | M | C | C-M | W | MW | C-M | W | M | M-W | W-C. No more
than two whole-tower scenes in a row (11–12, the five calls and the flicker); every other change of scene changes size.

**Motion rule:** in every scene a camera move lands within its first second, and a story event (a press, a preview, a
line, a door, a readout, a walk) follows within 2 to 3 s. To check in Studio playback.

**Revision 2a (same day): built on the scene-builder's close-ups.** Frame 0 and the last frame are the `button` framing
(the call panel, YOU's finger on the lit down button); the hook pulls back `button` → `landing` → `tower` (log dolly,
1.5 → 4.6 s) on "computer's already picking", and line 17b pushes back to `button`. Scene 5 uses `controller` (cabinet
open); 16 the `arrival:B` framing aimed 0.55 lower so YOU's head clears the captions; 17 pushes into the hotel `keypad`
close-up as YOU types (`you.keys: [9]`); 22–23 use `landing`. Scores (7, 10) are a true medium (distance 46) with
`scorePlace: 'clamp'`; 8 and 9 keep the readouts on the roofs. Line 5b shows C's load reading (100 %) and FULL sign
instead of a callout. YOU's push lights the button itself (no hand-timed call). Not used: `fullDoors` (it would hide
B braking into 4 and change floor 4 between cuts), `lanterns` (the late lantern is unsourced, B5 note), `focus` (the
scoring lines are already reduced to A's trace).

**Open items for the scene-builder** (resolved by the close-up pass: node dots now shrink, `scorePlace` exists):

- Keypad node dot: at the close keypad framing the controller-style node dot on the pedestal (r 0.1) reads as a large
  orange ball when the entry line starts (66.7 s). Scale node dots with camera distance, as the line radius already is.
- Score readouts force a near-wide framing (all four readouts span 15 world units, A's in the lobby has to stay above
  y 1248): a readout placement option (for example beside the car's cut face, or clamped into the safe zone with a
  leader) would let 7 and 10 come in to a true medium.

## The table (rough cut; framings superseded by Revision 2 above)

| # | Words | In → out (s) | On screen | What moves (2–3 s rule) | Transition into next | Overlays | New or existing | Flag |
|---|---|---|---|---|---|---|---|---|
| 1 | When you press that button, a computer's already picking your elevator, and it's not always the closest one. | 0.00 → 6.16 | **Frame 0.** T `tower`: the whole cut-open building, machine room under the title block, lobby at the bottom. YOU on floor 4, right hand on the call panel's down button, the button ring lit `warning` yellow. Cars as the table above. A thin orange line (tentative state) runs from the controller down A's shaft to A's roof at the lobby, node dots at both ends: it skips B, one floor above YOU | 0.7 s "press": YOU's finger pushes in and eases back. 2.4 s "already picking": dots start travelling down the line to A. 4.5 s "not always": B's rider turns to its doors, ready to get out at 5 (B is busy). Holds: yes (first ~3 s is voice and title, the § 8 frame 0) | `continue` (same framing, line 2 pushes) | Title block, captions | **New:** tower slice (T), controller, decision line states, a standing `press` gesture. Existing: `TitleBlock`, `Captions`, `Figure` (stance, `hands` IK), `OrangePath` | PAUSE (line 2), TOO LONG for the hook target: the question starts at ≈ 6.2 s (≈ 6.7 s with the `[pause]`), past § 8's 5 to 6 s |
| 2 | So why would it skip the closest one? | 6.16 → 8.90 | T: slow push toward floors 3 to 5 (YOU, B, the line) | Push 0.04 u/s; at "skip" (≈ 7.5 s) a single bright dot runs past B's shaft head and on down to A. Holds: yes | `continue`, glide to `shafts` | Title block (fades ≈ 0.8 s after the question, ≈ 9.7 s), captions | Existing: line states | PAUSE: the `[pause]` sits on a continue, not a cut |
| 3a | Look at the shafts: the closest car has a stop to make first, | 8.90 → 13.36 | T `shafts`: floors 1 to 5, all four cars cut open. The orange line fades to its node dots (trace) so the physical case reads. B at 5 with its rider; an `ink` tick on B's shaft at 5 marks the rider's stop | Glide 0.8 s on "Look". At "stop" (≈ 12.0 s) B's doors open, the rider steps out, a waiting extra steps in. Holds: yes | `continue` | Name tag **YOU** (8.9 to 10.4 s, no card), then callout on B: **CLOSEST CAR**, sub "a stop first" (from 10.6 s) | New: car doors, riders (extras) boarding | — |
| 3b | and a farther one could come straight to you. | 13.36 → 16.44 | T `shafts` as 3a, B's doors still open | At "farther" (≈ 14.0 s) the callout swaps to A; at "straight" (≈ 15.4 s) a **dashed `ink` outline of A** (drafting's hidden-line convention, a preview, not the car) rises straight up A's shaft to floor 4 in 0.9 s and fades. Holds: yes | `continue` | Callout on A: **FARTHER CAR**, sub "straight to you" | New: **preview outline** (dashed ghost car) | — |
| 4 | Many systems pick by time instead of distance, so sometimes the farther car gets the job. | 16.44 → 21.92 | T `shafts` | At "pick by time" (≈ 17.1 s) a race of two preview outlines from the cars' real positions: B's goes down a floor, waits with dashed doors open (its stop), moves on; A's goes straight up and reaches floor 4 first (≈ 19.3 s, on the ellipsis after "distance"). At "farther car" (≈ 20.2 s) the orange line redraws from the controller to A (1.3 s draw). Holds: yes | `continue`, glide out to `tower` | Captions (no card: the race carries it) | New: preview race. Existing: `OrangePath` draw | — |
| 5a | It knows where every car is and which way it's moving, | 21.92 → 25.69 | T `tower`, controller at the top: a realistic grey cabinet, its front cut open on a board and terminal rows, a grey cable bundle into the shafts | Glide 0.8 s; at "every car" (≈ 22.9 s) four thin orange lines draw from the controller to the four cars, node dots on each roof; at "which way" (≈ 24.3 s) C starts up and D starts down, a small orange chevron on each moving car. Holds: yes | `continue`, glide to `shafts` | Callout on the cabinet: **GROUP CONTROLLER**, sub "the building's computer" (22.0 to 24.4 s) | New: controller cabinet, direction chevrons, keyed car motion | RUSHED (mild): two facts and a glide in 3.8 s |
| 5b | and it can weigh each one to see how full it is. | 25.69 → 29.79 | T `shafts`: the cars with their riders readable (A 0, B 1, C 6, D 2) | Glide on "and it can"; at "weigh" (≈ 26.7 s) each car's floor dips a hair (the load cell) and a thin orange bar on its cut face fills to its load: C's to the top at "full" (≈ 28.8 s). Holds: yes | `continue` | Captions | New: load bars | — |
| 6a | For each car, it works out how many seconds it's gonna take to reach you, | 29.79 → 34.93 | T `shafts`. Chevrons and load bars fade (node dots stay). Beside each car a small set readout, the controller's estimate in seconds | Readouts appear one by one on "For each car" (≈ 0.2 s apart) and count up to 16 (A), 9 (B), 14 (C), 22 (D) by ≈ 34.6 s. Holds: yes | `continue` | The four readouts (one in-set group, the frame's one card; Decision 2) | New: **score readouts** (🎭 values) | — |
| 6b | counting the stops it's already promised. | 34.93 → 36.99 | As 6a | At "stops" (≈ 35.6 s) B's stop tick pulses and B's readout climbs 9 → 19. Holds: yes | `continue` | Readouts | As 6a | — |
| 7 | Some systems also add up how much your stop would delay everyone else. | 36.99 → 41.44 | As 6a; the riders inside the cars | At "delay everyone else" (≈ 40.4 s) the riders in B, C and D glance down (`glance-down`, watch-check), and each readout climbs by its riders' delay: C 14 → 32, B 19 → 25, D 22 → 24, A stays 16 (no riders). Holds: yes | `continue` | Readouts | Existing: `glance-down`. New: delay tick | HARD TO SHOW (mild): "delay to everyone else" is abstract; the glances and the climbing numbers carry it |
| 8 | In those systems, every car gets a score, and the lowest one gets you. | 41.44 → 46.23 | As 6a | At "score" (≈ 43.8 s) the readouts settle bold (the ellipsis after "score" holds them); at "lowest" (≈ 44.9 s) A's readout gets an orange mark, the other three lines fade, A's line goes from tentative to steady, and A starts up its shaft. Holds: yes | `continue`, glide out to `tower` (the `[pause]` lands on it) | Readouts (out at ≈ 46.0 s) | New: winner mark | — |
| 9a | With four elevators and five floors calling, | 46.23 → 48.63 | T `tower`: an extra appears on the landing of L, 1, 2, 3 and YOU on 4, one call each (five separate calls on five floors, as B6 requires) | Glide 0.8 s; the five call buttons light `warning` yellow one after another (≈ 0.3 s apart) from "four elevators" (≈ 46.6 s); each extra presses. Holds: yes | `continue` | Captions | Existing: `Figure` extras, `press`. New: lit call panels on every level | RUSHED: five calls in about 1.7 s |
| 9b | there are already 1,024 ways to answer them. | 48.63 → 51.37 | T `tower` | The orange lines flick through plans: five links (call → car) recombine about 8 times a second (only the orange moves fast, § 8). Counter 0 → 1,024 from ≈ 49.0 to 50.6 s. Holds: yes | `continue` | **Counter:** 1,024, unit "ways", sub "4 × 4 × 4 × 4 × 4" | Existing: `Counter` (already in the § 6 look). New: plan flicker | — |
| 10 | And most systems keep re-deciding as new calls come in. | 51.37 → 54.79 | T `tower` | Flicker settles on one plan at ≈ 51.6 s (counter out); at "new calls" (≈ 53.4 s) an extra arrives on floor 5 and presses; two links snap to other cars. Holds: yes | `continue`, glide to `top` | Captions | New: line snap (re-assignment) | — |
| 11 | It can even change its mind late in the game. | 54.79 → 58.22 | T `top`: floors 4 and 5, the controller above, YOU waiting (arms down), A climbing in view below | Glide 0.8 s; at "change its mind" (≈ 55.8 s) YOU's line snaps from A (still climbing) to B (its stop done, doors closing at 5). The ellipsis after "game" holds on the new link. Holds: yes | `continue` | Captions | New: line snap | — |
| 12a | In one maker's design, it only locks in a car | 58.22 → 61.64 | T `top`, settling to `landing`: B starts down toward floor 4 | B moves; YOU's line stays tentative (thin, dots running) and hops once B → A → B (≈ 59.0 and 59.8 s) to show it's still open. Holds: yes | `continue` | Captions | Existing: line states | — |
| 12b | once that car has to start braking for your floor. | 61.64 → 65.07 | T `landing`: B above floor 4 | At "start braking" (≈ 63.4 s) B visibly decelerates (an `ink` braking-distance mark from its sill to floor 4), and in the same frame YOU's line locks: thicker, steady, node dot bright, dots stop. B levels at 4 by ≈ 64.8 s, doors start to open; YOU looks up (`look-up`). The hall lantern stays dark (its late lighting is unsourced, B5 note) | `slide` to K (on the `[pause]`) | Callout on B: **LOCKED IN**, sub "once it brakes" (63.7 to 65.0 s) | New: deceleration curve on car motion, lock state | — |
| 13a | Since around 1990, some buildings have had you enter your floor in the lobby, | 65.07 → 69.86 | K `lobby`: the hotel lobby, four lettered doors, no buttons at them, the keypad pedestal (its screen tilted toward the user, so the slice shows its back), reception desk on the left | Slide in (0.6 s); YOU walks in from the right to the keypad (`walk`) and taps at "enter your floor" (≈ 67.8 s). Holds: yes | `continue` | Name tag **YOU** (re-entering, 65.8 to 67.3 s), then **detail box** on the keypad screen (from ≈ 68.0 s): a generic Day keypad, "9" typed (🎭) | New: hotel slice (K), keypad pedestal, **keypad detail content** | TOO LONG (mild): 7.5 s for line 13, split in two |
| 13b | and they tell you which elevator to take. | 69.86 → 72.60 | K `lobby` | At "tell you" (≈ 70.5 s) the detail box screen turns to the answer, a large `ink` **C** with an arrow; a thin orange line runs from the keypad along the floor's cut face to door C; YOU turns to it (`turn-to`) and walks. Holds: yes | `continue` | Detail box (out at ≈ 72.4 s) | New: keypad → door line | — |
| 14a | That lets the system group people going to the same floors, | 72.60 → 76.37 | K `lobby`, a little wider: four grey extras type in turn | Each tap sends an orange line from the keypad to a door: two to C (joining YOU), two to A; the groups walk to their doors. Holds: yes | `continue`, glide to `mid` | Captions | Existing: `walk`, `turn-to` | — |
| 14b | so each car makes fewer stops. | 76.37 → 78.42 | K `mid`: a band of upper floors; car C rises with its group and only one stop tick (floor 9), car A only one (floor 6) | Glide 0.8 s; at "fewer stops" (≈ 77.7 s) faint dashed ticks for a mixed load (four per car) fade, leaving the one real tick per car. Holds: just | `continue`, glide back to `lobby` | Captions | New: K `mid`. Existing: stop ticks, preview dashes | RUSHED: about 1.2 s after the glide (pause fix below) |
| 15a | It can be confusing, especially the first time, | 78.42 → 81.16 | K `lobby`: a guest with a rolling suitcase at door B, no keypad visit | Glide 0.8 s; the guest looks at the bare wall beside the doors (`turn-to`), pats it where a button would be, looks up. Holds: yes | `continue` | Callout on the bare wall: **NO UP BUTTON** (≈ 79.5 to 81.0 s; C1 ✅, optional) | New: suitcase prop, `pat` reuse of `press` | HARD TO SHOW (mild): confusion through body language only (no faces) |
| 15b | and in hotels, where many riders are new. | 81.16 → 83.90 | K `lobby`: two more guests with luggage come from reception | They walk to the doors (`walk`), one turns round looking for the keypad, the first guest heads back to it. Holds: yes | `slide` to T | Captions | Existing: `walk`, extras | — |
| 16a | Button or keypad, the computer's picking for everyone at once, | 83.90 → 87.32 | T `tower` (a touch wider than frame 0): people on every landing, riders in every car; YOU on 4, arms down | Slide in; orange lines from the controller to all four cars and every call, dots flowing on all at once (≈ 85.3 s "computer's picking"). Holds: yes | `continue` | **Statement card:** "Everyone / at once." (`place: 'low'`, from "everyone" ≈ 86.3 s to ≈ 87.8 s; captions off) | Existing: `Statement` | — |
| 16b | which can mean you wait longer. | 87.32 → 89.38 | T `tower` | At "wait longer" (≈ 88.7 s) a car slides past floor 4 without stopping, on its way to another call; YOU looks up after it (`look-up`). The other cars begin moving toward their frame-0 floors (TIMED, see 17b) | `continue`, glide to frame 0's `tower` framing (the `[pause]` lands on it) | Captions | Existing: `look-up` | — |
| 17a | Next time you press that button | 89.38 → 91.44 | T: glide to frame 0's framing; calls served one by one, their lines fade, extras board and leave | At "press" (≈ 90.4 s) YOU's hand rises to the down button and presses; the ring lights yellow. Holds: yes | `continue` | Captions | Existing: `press` | — |
| 17b | and a farther car shows up, it was probably the one the computer scored lowest. | 91.44 → 96.58 | T `tower`, landing on frame 0's picture: every car at its frame-0 floor (A lobby, B 5, C 1, D 2), doors closed, the line from the controller to A | At "farther car" (≈ 92.1 s) the line to A draws (1.3 s, tentative) and its dots run; on the ellipsis after "shows up" the last extras leave; at "scored lowest" (≈ 95.9 s) one bright dot runs down to A. Dots ease to their frame-0 rest positions and stop by the end. Holds: yes, the end hold (≈ 1.5 s plus the tail) is the loop landing | **Loop** to frame 0 | Captions end before the last frame; nothing else | Existing: T | — |

Scene count: 30 beats in about 97 s (about 3.2 s each). The sub-beats under 3 s (2, 6b, 9a, 9b, 13b, 14b, 15a, 15b, 16b,
17a) are events inside one scene (a glide, a callout swap, a number), not separate scenes, so `yarn check` doesn't flag
them. As spec scenes: about 16.

Card budget: callouts (3a, 3b, 5a, 12b, 15a), the readouts (6a to 8), the counter (9b), the detail box (13a to 13b) and the
statement (16a) never overlap; name tags (3a, 13a) never share a frame with a card. One statement card (≤ 2 allowed, never
in the first 3 s). Hard cuts: none. Slides: 2 (12b → 13a, 15b → 16a); follows: 0; the rest continue or glide. Glides in T
follow the camera-keys pattern of the car and wheel slices (`cameraKeys`).

## Line fixes

No fact or required hedge changes. The hedges that stay as they are: "not always" (1), "could" (3), "Many systems",
"sometimes" (4), "it can weigh" (5), "Some systems" (7), "In those systems" (8), "already" (9), "most systems" (10),
"It can even" (11), "In one maker's design" (12), "around 1990", "some buildings" (13), "the same floors" (14), "It can
be", "many riders are new" (15), "which can mean" (16), "probably" (17). The fact-checker's optional exact fit for 12
("In one maker's patent") stays the owner's call; the owner-approved wording is "design".

| Line | Flag | Suggestion | Mark |
|---|---|---|---|
| 1 | TOO LONG for the hook target | Keep the words: it is the owner's hook, and every cut would lose either the surprise or "not always the closest". Fix it in `performance.txt` (drop the `[pause]` on line 2), which brings the question to ≈ 6.2 s | applied (as a pause, in `performance.txt`) |
| 5 | RUSHED (mild) | Keep the words; split it over two shots (5a, 5b) | none |
| 7 | HARD TO SHOW (mild) | Keep the words; the riders' glances and the climbing readouts carry it | none |
| 9a | RUSHED | Keep the words; the five calls start lighting on "four elevators", not "five floors" | none |
| 13 | TOO LONG (mild) | Keep the words; two shots (13a, 13b) | none |
| 14b | RUSHED | Keep the words; an ellipsis after "floors" (below) | optional |
| 15 | HARD TO SHOW (mild) | Keep the words; the guests' gestures and the optional NO UP BUTTON callout carry it | none |

No line needs a wording change. Every flag is fixed by a pause, a split, or the picture.

## Pause and tag fixes for `performance.txt`

Words unchanged; only tags and ellipses.

| Line | Now | Change | Why | Mark |
|---|---|---|---|---|
| 2 | `[pause] [curious] So why would it skip the closest one?` | `[curious] So why would it skip the closest one?` (drop `[pause]`) | The pause sits on a continue, not a cut, and pushes the question from ≈ 6.2 s to ≈ 6.7 s, already past the 5 to 6 s target; B's rider turning to the doors gives line 1 its ending | **applied** (main session removed it from `performance.txt`) |
| 3 | `Look at the shafts... the closest car` | keep | Lands on the glide to `shafts` | — |
| 4 | `by time instead of distance... so sometimes` | keep | Lands on A's preview reaching floor 4 first | — |
| 8 | `every car gets a score... and the lowest` | keep | The readouts settle in it, before the winner | — |
| 9 | `[pause] With four elevators` | keep | Lands on the glide out to `tower` | — |
| 11 | `late in the game...` | keep | Holds on the new link before "In one maker's design" | — |
| 13 | `[pause] Since around 1990` | keep | Lands on the slide to K | — |
| 14 | `going to the same floors, so each car` | `going to the same floors... so each car` | Gives the glide up to `mid` its beat, so "fewer stops" lands on the ticks fading | optional |
| 15 | `the first time... and in hotels` | keep | Lands on the second pair of guests coming in | — |
| 16 | (no tag) | keep | The slide fits on "Button"; the statement card holds from "everyone" to 0.8 s after "once" | — |
| 17 | `[pause] Next time ... shows up... it was` | keep both | `[pause]` lands on the glide to frame 0's framing (the turn to the viewer), the ellipsis on the line to A drawing | — |

With line 2's `[pause]` dropped (applied) and line 14's ellipsis added (optional), the tag count stays at about 1 per 3 sentences
(style-guide § 9). Spoken length about 101 s: over 60 s is allowed only with no licensed music (brand.md § Structure); the
script is owner-approved at this length, so the music bed has to be our own (as No. 002's) or none.

## New 3D pieces

| Piece | Size | What it needs | Reuse |
|---|---|---|---|
| **T, the tower slice** | large | A realistic generic office building cut open (no logo, no maker's look): lobby and floors 1 to 5 (≈ 3.0 per level), machine room on top; four shafts A to D with guide rails, steel ropes over sheaves, counterweights; realistic cars (brushed-steel walls, handrail, ceiling light panel, sliding doors that open and close, a load-cell plate under the floor), cut in half so riders show; landing slabs with call panels (up and down buttons, ring lights `warning` yellow, flat) and dark hall lanterns; letters A to D set into the cut face above each shaft. Props: keyed car motion (`cars: {A: [{at, floor}], …}` with real acceleration and a visible braking curve), doors per car, riders and waiting extras, lit calls, framings `tower`, `shafts`, `top`, `landing`, `cameraKeys`. Layout on a test still first (Decision 1) | `SectionStage`, `cutLook`, `SectionCamera`, `projectToFrame`, `keyframes.ts` (`CameraKey`, `keyed`, `integrateSpeed`), `useStudioEnv`, `REAL` tokens, `Figure` (stand, walk, `hands`), the car slice's scene structure |
| **Group controller** (in T) | medium | A realistic generic cabinet in the machine room: grey steel, front cut open on a board with an invented chip legend, terminal rows, a grey cable bundle down into the shafts; the decision lines' node dot on it | `PhoneTeardown` board pattern, `RealLab` materials (`RealWallDevice`, `RealRig`) |
| **Decision lines** | medium | Orange routes from the controller down the shaft cut face (right angles) to a car roof or a call: states *tentative* (thin, travelling dots), *steady*, *locked* (thicker, bright node, dots stopped); *snap* (re-assignment, a 4-frame seam flick); *plan flicker* (five links recombining ≈ 8/s); dot phase that can ease to a rest position (for the loop) | `OrangePath` (legs, progress, flow, dots, runner light), § 5 values |
| **Knowledge marks** | small | An orange chevron riding a moving car (direction), a thin orange load bar on each car's cut face (0 to 1), `ink` stop ticks on the shaft cut face (a rider's floor; not orange) | `OrangePath` materials, `cutLook` line |
| **Score readouts** | small | Four small set panels, one beside each car, digits in `ink` (Inter 700, ≥ 28 px at `shafts`), counting to keyed values (🎭 A 16, B 9 → 19 → 25, C 14 → 32, D 22 → 24); the winner gets an orange mark | `Counter` digit style, `projectToFrame` |
| **Preview outline** | small | A dashed `ink` outline of a car (hidden-line convention) that moves along its shaft on keyed times, doors drawn dashed when it "stops"; used for 3b, the race in 4, and the mixed-load ticks in 14b | `cutLook` line, `keyed` |
| **`press` gesture** | small | Standing: the arm reaches a target point (a call button, a keypad, a wall), the index finger pushes in and eases back; a held variant for frame 0 | `Figure` `hands` IK, `rig.ts` `Gesture`, `solveArm` |
| **K, the hotel** | medium (given T) | The tower kit as a tall hotel (≈ 15 levels, only the lobby and a band of upper floors framed): lobby with four lettered doors and **no call buttons**, reception desk, plant, rolling suitcases; the destination keypad on a brushed-steel pedestal, its glass screen tilted toward the user (never the camera). Framings `lobby`, `mid` | T, `Figure` extras (walk, `turn-to`, `look-up`, `press`) |
| **Keypad detail content** | small | `DetailBox` content mode `keypad` (today: `phone`, `dashboard`): a generic light Day UI, a 3 × 4 digit grid with "9" typed (🎭), then the answer screen: a large `ink` letter C with an arrow. Text ≥ 28 px, no maker's look | `DetailBox`, `screenKit` drawing helpers |
| **Tags and callouts on new scenes** | small | `NameTag` reads head positions from `section-room` and `car-slice` only; T and K need head anchors (YOU standing), and callout anchors via `projectToFrame` | `NameTag`, `carHeadTopOnScreen` pattern |

Already there: `TitleBlock`, `Captions`, `NameTag` frame, `Callout`, `Counter` (§ 6 look), `Statement`, `DetailBox`
frame, `Figure` (YOU, extras; `stance: 'stand'`, `walk`, `hands`; poses `look-up`, `turn-to`, `glance-down`),
`OrangePath`, `cameraKeys`, `slide` / `continue` / glide transitions.

## Frame 0 and the loop

**Revision 2:** frame 0 and the last frame are now the **close-up** on YOU's hand at the lit button on 4 (B's and C's
doors round it, B's rider just above; framing `CLOSE` in `spec.ts`); the tower framing below is reached by the pull-back
at 1.5 to 3.4 s. The rest of this section (cars, riders, lit things) still holds. The cover idea below is the
publisher's call and is unchanged.

**Frame 0** (Day): T at the `tower` framing, the fixed 3/4 angle. The whole cut-open building in the vertical frame, its
machine room top at about y 470 (under the title block, top y 300, two lines to ≈ y 440), the lobby floor at about y 1500,
the cut ground below. YOU on the floor-4 landing (head ≈ y 810, feet ≈ y 900, above the caption band), seen 3/4 from behind,
right hand on the call panel's down button, the button ring lit `warning` yellow, flat. Car A parked at the lobby, doors
closed, empty; car B stopped at floor 5, doors closed, one rider; car C at floor 1 with six riders; car D at floor 2 with
two (floors 2 and 3 sit under the caption page; nothing that matters is there). One thin orange line, tentative state, from
the controller in the machine room down A's shaft to A's roof, node dots on the controller and on A, its dots at rest.
Nothing else lit or readable but the title block. Camera drift 0 on this scene and the last, so the loop matches.

**Last frame:** the same picture: `tower` framing, same angle; every car at its frame-0 floor with the same riders and doors
closed; YOU's hand on the lit button; the line to A with its dots back at rest, no other lines, no extras left on the
landings, no callout, captions already gone. On replay the cut to frame 0 only adds the title block.

## Cover idea

The cut-open tower at frame 0's framing: YOU at the lit button on floor 4, car B one floor above, and the orange line
passing B by on its way down to car A in the lobby. Cover text: "Who picked your elevator?" ("Who picked" / "your
elevator?").

## Decisions (owner, 2026-10-17; all five recommendations accepted)

1. **Tower layout:** the jogged section is proved on one test still before the rest of T is built.
2. **Score readouts:** the four in-set readouts (one per car, 6a to 8) count as one card, like No. 002's two Lab row
   panels.
3. **Disclosures:** the car positions and riders, the score values, the keypad's "9" and "C", and the hotel's stop floors
   are illustrative (🎭). The publisher adds an "Illustrative: …" line to the post description.
4. **Title line 1:** "Why would it skip the closest elevator?" ("Why would it skip" / "the closest elevator?").
5. **NO UP BUTTON callout** in 15a: kept (C1 ✅, NPR).
