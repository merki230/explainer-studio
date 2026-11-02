# No. 013 · Part 1 · The data center: audio + visual script (draft 4, 2026-11-02, re-timed to the voice; framings after the full stills pass)

Words: `script.txt` (62 spoken lines in 4 chapters plus 4 `> Short hook:` lines, approved by the owner 2026-11-02; draft 2
follows the scriptwriter's 2026-11-02 edits: ch. 1 heading, Short hook 1, lines 28 + 29 merged, line 18 split).
**Draft 3 (2026-11-02): re-timed to the live take "a-slow"** (`audio/voiceover.mp3` + `transcript.json`, 1,059 words, recorded
by chapter with the 3.9 s word-to-word chapter breaks built in, `CHAPTER_BREAK_FRAMES` = 117). The **t** column is now the real
start of each cue. Speech ends **6:54.6**, plus the 12 s end-screen hold = **426.6 s, 7:06.6**. The take runs faster than the
estimate (draft 2 had ≈ 7:19 of speech), so 22 shots fell under ≈ 3 s; in `spec.ts` each of them is **merged into its
neighbour** as a camera key inside one scene (marked *(in n)* in the t column), which leaves **76 scenes** (75 since the opening merged shot 2 into 1). Shot 82 starts on
`liters of water a year` (its old cue fell 2.5 s after 81's). Owner decisions since draft 2: the silent full-frame chapter cards stand, and **the real-footage opening is approved** (2026-11-02,
"keep it"; § 6.1 below). It replaces draft 3's earlier fully 3D opening: shots 1–6 now play in DC, and TOWN first appears at shot 32. **The event times inside the
Motion cells are still draft 2's estimates** (kept for their order and spacing): `spec.ts` keys every event to a spoken word, and
it is the timing reference from here on.

**Draft 3 staging changes in `spec.ts`** (values only; the shots and their ideas are draft 2's):
- **In-set `follow`s become glides** (12 yard → hall, 20 riser crane, 57 drain crane): a `follow` renders two copies of the set across
  a seam; inside one set the camera simply moves. The cross-set follows (6, 32, 34, 59, 86, 94) and the chapter openers (37, 59) stay
  `follow`. Every follow is 24 frames (the build has no per-follow length; draft 2 asked 30 to 36 on some).
- **The 3/4 and 1/4 rows (54)** show as two counters in turn, `75 %` / `LEAVES AS VAPOR` then `25 %` / `DRAINED` (the counter has no
  fraction display, and its stopwatch rows can't stop in the spoken order).
- **`QUINCY` lands on "Quincy"** (69), not on the slide (68): a place label lands on the spoken place name.
- **Short 4's ending (96+97)** stays a TOWN scene, restaged in 9:16 on the town sheet's DC roof with dry coolers (a `vertical` block
  can change props, not the scene), gliding to a `roofDry` framing that must match the hook's DC `roof` for the loop.

Format: **horizontal 1920 × 1080** (style guide § 11), with four vertical Shorts
re-rendered from the chapters (§ 11.8). Over 60 s, so the music is our own or there is none (§ 9, § 11.7).

**The place and the time.** One data center (a composite, 🎭, disclosed) on the edge of a small US town, on one hot
afternoon, in **Day** mood. Story clock: ch. 1 3:12 PM · ch. 2 3:20 PM · ch. 3 3:31 PM · ch. 4 3:45 PM. Quincy (ch. 3) is
the one other real place. It gets a place label, and the voice names it.

**The orange (§ 5).** In this video the hidden system is **the heat, and the water that carries it away**. To keep
that to one meaning on screen, my call (listed under Deviations in the report):

| Orange | Never orange |
|---|---|
| Heat leaving the chips: the shimmer behind the racks, the hot-air arrows | Electricity: power lines, transformers, the electric meter (neutral steel and ink) |
| The **warm** water: the coil's outlet, the riser up to the roof, the water at the top of the tower | The **cold** water coming back down: blue-grey `water` `#7d97ad`, like No. 004's main |
| What the water takes away: the vapor's heat tokens (the plume itself stays white, as it really is), the blowdown path to the sewer, the warm plume in the river, the Quincy return pipe, the power plant's water (ch. 4 tease) | Fresh makeup water and drinking water: neutral, with neutral flow arrows |
| | Minerals (grey and white dots), scale (off-white), corrosion (`rust`/`rustDark`, already outside the reserved band), biofilm (needs a muted-olive token, see inventory), chemicals (clear drops) |

**Rules this draft holds to.** The camera never stops: a slow push or truck plus drift in every shot, glides between
framings, and `follow`/`slide` between sets. Something visible changes every 2 to 3 s; each row below names its events.
One idea per scene, and scenes run 3 to 8 s (§ 11.6 asks for 4 to 8 s; a few glides inside one set are ≈ 3 s). At most one card besides
captions and the title block or chapter card. No source text on screen; numbers appear as counters and callouts.
Everything readable sits inside x 144 to 1776, y 120 to 960, never in the watermark corner (x ≥ 1560 and y ≥ 780), and is
never under 26 px.

**Sets** (details in § 4): **DC** = `datacenter-slice` (new) · **TOWN** = `town-slice` (new; it includes the sewer, the
wastewater plant, the river, the power-plant tease and the Quincy dressing) · **LAB** = `section-lab` with a new `heat-bench`
dressing and horizontal support.

---

## 1. Line by line

Columns: **#** shot · **Cue** (first words as spoken, scene start) · **t** (start, m:ss, from `transcript.json`) · **Set · framing** · **Motion and
visible events** (every 2–3 s) · **Overlay / number** · **In** (transition into the shot). `continue` = same set, the camera
carries on, and a new framing glides 0.8 to 1.2 s.

### Chapter 1: Where does a data center's water go? (0:00 to Q 2:29.6)

| # | Cue | t | Set · framing | Motion and visible events | Overlay / number | In |
|---|---|---|---|---|---|---|
| 1 | `Towns across the US` | 0:00.0 | **F0–F96: the real drone shot** (`opening`, § 11.6.1): a dark data-center box lower middle, the city and a retail park behind it (the "towns" of line 1), brand marks blurred. **From F96: DC**, the 3D data center at the house angle, framed on **the reveal's landing framing** (`OPENING_LAND`, the block at the clip's F96 screen box) | F0–F96 the clip's slow orbit (the camera never stops). F96: today a hard switch to 3D (the reveal comes later, § 6.1 below). F96 → F138 slow push onto the landing framing. Plume and fans moving from the first 3D frame | **Title block** from frame 0 (x 144, y 120): "Where does all that water go?" / `NO. 013 · PART 1 · THE DATA CENTER · 3:12 PM`, holds to ≈ 0.8 s after the question (**known issue:** hidden under the opening layer until F96, § 6.1) | none |
| 2 | `and one of the biggest complaints is water` | 0:03.9 *(in 1)* | DC, still in shot 1 | On `complaints` (after F138): a log glide down the cut face to the street **water meter**, arriving just before shot 3. The dial spins fast, and neutral flow arrows run in along the service line | title block | (camera key in 1) |
| 3 | `A big data center can use up` | 0:07.7 | DC `meter`: the service line and its **water meter** in the cut ground (No. 004's `WaterMeter`) | The meter's dial spins **fast**. 9.5: the push drifts along the service line into the building's wall. 11.0: the flow arrows enter | title block | `continue` |
| 4 | `So where does all that water go?` | 0:12.8 *(in 3)* | DC, crane up the cut face from the meter to the roof | The camera keeps climbing past the hall, the riser and the roof edge, and lands on the towers about 2.4 s after `So where`. Hold on the object the question is about | title block (out ≈ 0.8 s after the question) | (camera key in 3) |
| 5 | `Most of it leaves through the roof` | 0:15.6 | DC `roof`, close on the towers and the plume | 16.0: **the first orange**. Small heat tokens ride up inside the plume and fade high in the sky. 17.5: the plume swells. The fans keep turning | **Statement 1** on cue `through the roof` (title is gone by then): **"Through the roof, / as vapor."** (`low`, bottom y 840). Auto hold | `continue` |
| 6 | `To see why, we'll follow the heat` | 0:19.4 | **DC** `wide`: the data center alone, bigger. Data hall on the ground floor (two rack rows), the mechanical room beside it, the riser shaft, the roof with two towers, and the cut ground with the service line and the sewer lateral | The camera glides back out of the plume to the whole building (in-set, no `follow`: the opening is already in DC). 20.5: one rack in the hall shows a faint orange shimmer at its back. 22.0: a technician extra walks the cold aisle | none | `continue` (log glide to `wide`) |
| 7 | `on a hot afternoon` | 0:22.5 | DC, a slow crane **from that rack up the riser to the roof** (the payoff picture, previewed) | The heat haze over the roof wavers. 25.2: the tower fans speed up a notch. The sun's shadows lie long to the left | none | `continue` |
| 8 | `That heat starts with power` | 0:26.5 | DC `yard`: the utility yard beside the building. A power line comes in from the left to one transformer and switchgear with a small electric meter | The meter's disc turns. The transformer's fan turns. 29.0: the line's insulators catch the light as the camera trucks along the line toward the building | none | `continue` (glide) |
| 9 | `and these buildings use a lot more power` | 0:28.5 *(in 8)* | DC `yard` | 29.6: a **second transformer slides in** beside the first, and 32.8 a third (the yard grows), each landing with a small settle. The meter spins faster | none | `continue` |
| 10 | `A data center used to need a few megawatts` | 0:33.1 | DC `yard`, wider | 35.0: the yard **rewinds** to one small transformer, an older grey box. 37.0: its meter turns slowly | none | `continue` |
| 11 | `and Virginia's state auditors say` | 0:35.8 *(in 10)* | DC `yard`, pulling back | 38.4: a **row of big transformers** slides in, one after another (4 to 6, every 0.5 s). The power line thickens to a double circuit. The meter blurs | **Counter** `100+` unit `MW`, sub `A TYPICAL DATA CENTER NOW` (side margin, top y 180, left x 144). The digits roll on `more than a hundred` | `continue` |
| 12 | `Inside, the average server rack` | 0:41.3 | DC `racks`: a row of ordinary racks in the hall | Fans turn. Status LEDs blink (neutral). 45.0: a faint orange shimmer rises off each rack's back. 47.5: the technician pulls a server half out, then slides it back | **Counter** `UNDER 8` unit `KW`, sub `AVERAGE RACK` (left x 144, top y 180) | `follow` (into the hall, truck right, 24 f) |
| 13 | `But some racks of today's AI chips` | 0:48.5 | DC, glide right to **the AI rack** at the row's end (denser, heavier, more fans, coolant hoses) | 50.5: the glide lands. 51.5: its shimmer is several times stronger, a tall orange column. 53.0: its fans rev | Counter carries and **rolls to `120` `KW`**, sub `SOME AI RACKS` | `continue` (`carry` on the counter) |
| 14 | `Nearly all that electricity turns into heat` | 0:54.7 | DC `hall`: the whole hall | A neutral power cable runs into each rack, and orange heat pours out of each rack's back into the hot aisle. 56.5: the hot aisle fills with orange haze from the floor up | none | `continue` |
| 15 | `so more power means more heat` | 0:57.2 *(in 14)* | DC `hall` | 58.3: the AI rack's column brightens again. The haze reaches the ceiling and pools against the coil wall | none | `continue` |
| 16 | `At many data centers, including this one` | 1:00.9 | DC `coil`: the coil wall at the back of the hot aisle (finned coils, blue-grey supply pipe below, return pipe above) | 62.0: cold water visibly flows in the supply pipe (neutral arrows). 64.0: the **orange route is born** where the return pipe leaves the coil; its node dot lights | none | `continue` |
| 17 | `Look at the back of this rack` | 1:06.2 | DC `rackBack`: the AI rack's back, close | Fans spin. **Orange hot-air arrows** stream out of the rack toward the coil, a new one every 0.6 s. 70.0: the camera trucks with the arrows toward the coil | none | `continue` |
| 18 | `The hot air passes over coils of cold water` | 1:11.1 | DC `coil`, close | The arrows pass through the fins and **come out the other side neutral** (cooled air back to the cold aisle). 76.0: the return pipe glows orange | **Callout** `COILS` sub `COLD WATER INSIDE` (leader to the fins) | `continue` |
| 19 | `and the water carries the heat out` | 1:14.0 *(in 18)* | DC, the hall's back wall | 16.8: **X-ray** of the wall (the DC's one X-ray in the hall): the orange route runs inside the wall to the riser. 18.3: its node dot lights at the riser foot | none | `continue` |
| 20 | `Pipes take the warmed water up` | 1:17.3 | DC `riser` → `roof` | **`follow` crane up along the orange riser** through the slab to the roof. The route draws ahead of the camera and reaches the tower inlet at 23.8 | none | `follow` (crane up, 36 f) |
| 21 | `Inside the tower, the water rains down` | 1:21.9 | DC `tower`: **the cooling tower cut open** (fill packs, spray nozzles, basin, louvers, the fan stack on top) | 25.0: the tower's near face **cuts away** top-down (hatched edges). 26.5: warm water sprays from the nozzles and **rains down over the fill**. 28.0: the fan spins up and neutral air arrows come in through the side louvers and rise | none | `continue` |
| 22 | `On each trip down, a small part` | 1:27.8 | DC `fill`, close on the fill | Every 0.8 s a few droplets **peel off as vapor** wisps, each carrying a small orange heat token, rising out through the fan | none | `continue` |
| 23 | `and as it does, it takes heat away` | 1:31.5 | DC `tower`, pulled back | The falling water's orange **fades from top to bottom**: hot at the nozzles, neutral blue-grey in the basin. 37.9: the cold water leaves the basin down the return riser (neutral) | none | `continue` |
| 24 | `Each gallon that evaporates` | 1:35.7 | **LAB** `heat-bench`. One gallon jug sits on a hot plate. On the wall behind it is a heat meter (a bar, filling orange). A space heater stands at the bench's right end, with a wall clock above it | 40.3: the jug **boils off**, vapor rising, and its meter bar fills orange. 42.5: the camera trucks right toward the heater | none | `slide` (from the right, 24 f) |
| 25 | `as a space heater puts out` | 1:38.9 *(in 24)* | LAB, the heater and the clock | The heater's element glows (orange heat shimmer off its grille: the same heat, the same meaning). 44.5: **the clock's hands sweep 1 h 40** (fast, ≈ 3 s), and its heat bar fills to the same height as the jug's | **Callout** `1 H 40 MIN` (leader to the clock) | `continue` |
| 26 | `Warm that gallon by 10 degrees instead` | 1:43.3 | LAB, back across to **a second jug** on a second plate, with a thermometer in it and its own meter | 49.0: its thermometer creeps up 10 degrees with no vapor. 51.5: its heat bar fills **a thin sliver**. 53.5: jug 1's full bar is beside it for comparison | **Callout** `≈ 1/100` sub `AS MUCH HEAT` (leader to the sliver), on `only about a hundredth` | `continue` |
| 27 | `That's why towers let the water evaporate` | 1:49.3 | DC `tower` (**the Short 1 hook framing**) | Vapor wisps rise. The rain falls. The fan turns. Push in | none | `slide` |
| 28 | `Data centers use the most water in hot weather` | 1:52.8 | DC `roof`: both towers | The heat haze shimmers over the roof membrane. 2:00.4: tower 2's fan kicks to full. 2:02.4: the plume thickens | none | `continue` |
| 29 | `so this afternoon the towers` | 1:57.0 *(in 28)* | DC `roof`, pulling back to the whole roof | Both fans at full. The plume rises in pulses. The sun's shadow edges move a hair (time passing, no mood change) | none | `continue` |
| 30 | `Over a whole year, a typical site` | 2:01.1 | DC → the street meter, `meter` | The camera cranes down the cut face to the meter pit. The dial spins | **Counter** `44 MILLION` unit `GAL / YEAR`, on `44 million gallons` (≈ 2:14.3), left x 144, top y 180 | `continue` |
| 31 | `pulled in about 44 million gallons` | 2:06.0 | DC `meter`, trucking left along the service line toward the street main | The arrows run, the dial spins | the counter holds | `continue` (`carry`) |
| 32 | `That's about what 400 American families` | 2:09.8 | **TOWN** `houses`: the town's houses, wide | 17.1: the kitchen windows light one by one. 18.3: rows of small houses **fill the field behind the town** (instanced, row by row) | **Counter** `≈ 400` unit `FAMILIES` | `follow` (truck left along the main, 24 f) |
| 33 | `And most of the water those sites` | 2:14.1 | TOWN `kitchen`: one house cut open, **YOU** at the kitchen sink filling a glass (No. 004's kitchen) | 20.9: the tap runs and the glass fills. A slow push holds on YOU (draft 4: the truck along the main to the DC showed only road surface mid-move, so the kitchen holds; the shared main is left to the voice) | **Tag** `YOU` (first appearance, 2.0 s) | `continue` |
| 34 | `Back in the tower, only part` | 2:18.3 | DC `tower` | Wisps rise. 27.4: most of the rain lands in the basin. 28.9: the basin's level ripples | none | `follow` (crane up the cut face, 30 f) |
| 35 | `and the rest drops back down for another trip` | 2:21.5 *(in 34)* | DC `wide` | **The whole loop at once**: cold down the riser (neutral) → coil → warm back up (orange) → tower → basin, a full lap in ≈ 3 s, then a second | none | `continue` |
| 36 | `So why can't the tower keep sending` | 2:25.6 | DC `basin`, close | The loop keeps running. 36.0: **faint grey dots** appear in the basin water (the minerals, foreshadowing ch. 2). Push in, still moving when the card dims it | none | `continue` |

### Chapter 2: Why don't they just reuse the water? (card Q 2:29.6, voice 2:33.5 to Q 4:00.4)

| # | Cue | t | Set · framing | Motion and visible events | Overlay / number | In |
|---|---|---|---|---|---|---|
| — | **card 2** (silent) | Q = 2:29.6 → voice at 2:33.5 | Previous shot keeps moving, dimmed (`paper` 72 %) and blurred 16 px; **the transition to the next shot runs under the card** (`follow`: crane up from the basin along the riser to the roof, from Q + 30, settled by Q + 66) | **Full-frame chapter card** (§ 11.5.1): `CHAPTER 2` / **"Why don't they just reuse the water?"**, x 144, centred on y 500, hold 2.5 s. Captions off from Q + 6. Nothing else on screen; every earlier overlay gone by Q + 6. Music swells | — |
| 37 | `The cooling tower on this data center's roof` | 2:33.5 | DC `roof` (entered under the card, already moving when it clears) | The loop runs. 44.5: a **marked parcel of water** (a thin neutral ring) rides the loop | none (place and story time need no label: same roof, the picture says it) | `follow` (crane up, under the card) |
| 38 | `sending the same water around the loop` | 2:37.8 | DC `wide` | The ring completes **lap 1, 2, 3** (fast-forward, ≈ 1.2 s a lap); a tick mark lights on the basin wall at each lap (neutral) | none | `continue` |
| 39 | `Every time some of that water evaporates` | 2:41.6 | DC `fill` | The vapor wisps rise **clean**. The grey mineral dots in the falling water **stay behind** and fall on into the basin | none | `continue` |
| 40 | `and the calcium, magnesium and silica` | 2:45.8 | DC `basin` | The dots settle and gather. 58.6: the basin water greys slightly | **Callout** `MINERALS` sub `CALCIUM · MAGNESIUM · SILICA` (sub on the spoken words) | `continue` |
| 41 | `The loop water holds more and more minerals` | 2:50.2 | DC `basin` | Each lap adds a visible batch of dots (every 1.2 s) | none | `continue` |
| 42 | `and engineers measure that` | 2:52.9 *(in 41)* | DC `plant`: the mechanical room, conductivity controller on the wall, and a small **sample bench** under it | The controller's needle climbs one band per lap | **Counter** `CYCLES` from 1 to `4` (one step per lap) | `continue` |
| 43 | `Many towers run at two to four cycles` | 2:57.8 | DC `plant`, the controller | The needle **swings between the 2 and 4 bands** as the loop runs | **Counter** `2–4` unit `CYCLES` (`rangeTo`) | `continue` |
| 44 | `which means up to four times the minerals` | 3:02.6 | DC `plant`, glide down to the **sample bench**: two glass jars, fresh water and loop water, each with a probe (moved here from the Lab: no slide pair for one line) | The loop jar's dots **multiply to four times** the fresh jar's. 15.8: its probe needle swings to 4× | **Counter** `4×` sub `THE MINERALS` | `continue` |
| 45 | `If the cycles go too high` | 3:06.7 | DC `pipe`: a plant-room pipe **cut across** (a section close) | A white **scale crust grows inward** from the pipe wall. The flow arrows inside slow down as the bore narrows | none | `continue` |
| 46 | `like the crust inside a kettle` | 3:10.2 *(in 45)* | DC `pipe` | The crust thickens in two more steps (at 22.0 and 23.5) | **Callout** `SCALE` | `continue` |
| 47 | `The minerals also speed up corrosion` | 3:12.7 | DC `pipe`, gliding along to a cleaner section of the same pipe | **Pits bloom** in the steel (`rust`/`rustDark`), and the wall thins in two steps | none | `continue` |
| 48 | `And the warm, wet tower is an easy place` | 3:16.5 | DC `basin` | A **muted-olive film creeps** up the basin wall and across the fill's bottom edge (spreading every 1 s) | none | `continue` |
| 49 | `so pumps add chemicals to the loop` | 3:20.6 | DC `plant`: the chemical dosing skid (two small pumps, two plain drums) | Pump heads **tick** (strokes every 0.5 s), and clear drops fall into the loop line. 35.6: the glide pulls back far enough to show the basin above, where the film recedes | none | `continue` |
| 50 | `To keep the minerals in check, a valve drains off` | 3:23.9 | DC `valve`: the blowdown valve under the controller | 36.3: the needle crosses the set line. 37.3: **the valve's actuator turns it open**. 38.3: dense water drains into the floor drain, and **the orange drain path** starts down through the slab | none | `continue` |
| 51 | `which engineers call blowdown` | 3:28.0 *(in 50)* | DC `valve` | The drain stream runs steadily | **Callout** `BLOWDOWN` (leader to the stream) | `continue` |
| 52 | `Fresh water replaces what's drained` | 3:30.7 | DC `basin` + the makeup line | 44.1: the makeup valve opens and neutral fresh water pours in. A float rises. The mineral dots thin out | none | `continue` |
| 53 | `so the tower keeps drawing water` | 3:33.8 *(in 52)* | DC `wide` | The street meter's dial spins (seen in the cut ground). Vapor goes up, the drain goes down, the makeup comes in, all three running at once | none | `continue` |
| 54 | `In all, at four cycles` | 3:37.6 | DC `wide`, framed right (card on the left) | 4 neutral flow arrows come in at the meter → **3 rise as vapor** out of the towers (orange tokens) and **1 goes down the drain** (orange). They are drawn in sequence on the spoken words | **Counter rows**: `3/4` `VAPOR` on `three quarters`; `1/4` `DRAINED` on `the other quarter` | `continue` |
| 55 | `Going from three cycles to six` | 3:46.3 | DC `valve` | The controller's set point turns from 3 to 6. **The drain stream halves** in width | **Counter** `3 → 6` unit `CYCLES`, sub `HALF THE DRAINED WATER` | `continue` |
| 56 | `but some always has to go` | 3:51.7 *(in 55)* | DC `valve` | The stream thins to a steady trickle that never stops | the counter holds | `continue` |
| 57 | `That drained water carries the minerals` | 3:54.5 | DC → ground | **`follow`** down along the orange drain through the slab into the cut ground, to the lateral | none | `follow` (crane down, 30 f) |
| 58 | `so why not let it run into the nearest river?` | 3:58.0 | DC ground, trucking right along the cut face with the drain path | The orange drain runs along the lateral toward the frame's right edge (toward the river, not yet seen). Still moving when the card dims it | none | `continue` |

### Chapter 3: Why not release it into a river? (card Q 4:00.4, voice 4:04.3 to Q 5:25.4)

| # | Cue | t | Set · framing | Motion and visible events | Overlay / number | In |
|---|---|---|---|---|---|---|
| — | **card 3** (silent) | Q = 4:00.4 → voice at 4:04.3 | Previous shot keeps moving, dimmed (`paper` 72 %) and blurred 16 px; **the transition to the next shot runs under the card** (`follow`: truck right along the drain from DC into TOWN, the river coming into frame, from Q + 30, settled by Q + 66) | **Full-frame chapter card** (§ 11.5.1): `CHAPTER 3` / **"Why not release it into a river?"**, x 144, centred on y 500, hold 2.5 s. Captions off from Q + 6. Nothing else on screen; every earlier overlay gone by Q + 6. Music swells | — |
| 59 | `At a data center like this one` | 4:04.3 | TOWN `site`: the DC on the left of the sheet (plume up, drain down), the street, and **the river** far right (entered under the card) | The plume billows (bigger pulse at 21.5). 24.0: an orange pulse runs down the drain path | none | `follow` (truck right, under the card) |
| 60 | `What's left is the drained water` | 4:10.9 | TOWN `sewer`: the lateral joins **the sewer main** under the street (cut face) | The orange drain flows into the main and mixes with neutral flows coming from the houses' laterals (every 1.5 s a new one) | **Place label** `THE SEWER` sub `3:31 PM` on `down the sewer` (the chapter's first new place; story time on the sub-line) | `continue` |
| 61 | `to the city's wastewater plant` | 4:14.9 | TOWN `plant`: the wastewater plant at the edge of town, cut open (a round clarifier, an aeration basin) | Trucking right along the main into the plant. The **clarifier's rake turns** and aeration bubbles rise | none | `continue` |
| 62 | `Piping that water straight into a river` | 4:18.8 | TOWN `river`: a second pipe runs from the DC lot straight to the riverbank, ending at a **closed outfall gate** | The river flows (ripples drift left to right). 37.8: water backs up behind the gate, held | none | `continue` |
| 63 | `with limits on what the water carries` | 4:22.7 *(in 62)* | TOWN `outfall`, close | A **sampler bottle** on the gate fills. Its three small gauges (no text on them) twitch | **Callout** `FEDERAL PERMIT` (leader to the gate) | `continue` |
| 64 | `When Ohio proposed a permit` | 4:25.6 | TOWN `outfall` | 43.8: the gauges' needles settle under their limit marks one by one (at 43.0, 45.0, 47.0, on the spoken words) | **Place label** `OHIO` (0 to 2.6 s), then **callout** `THREE LIMITS` sub `MINERALS · CHLORINE · ACIDITY` (from `dissolved minerals`) | `continue` |
| 65 | `The Clean Water Act behind those permits` | 4:34.4 | TOWN `riverbed`: the river cut across (water, sandy bed, rocks) | 53.7: the gate opens a crack, and **a warm orange plume spreads** into the cold river and drifts downstream | **Callout** `HEAT` sub `A POLLUTANT` on `heat` (≈ 4:53) | `continue` |
| 66 | `next to things like sand and rock` | 4:39.0 | TOWN `riverbed` | Sand ripples. 59.2: grains drift along the bed. The plume thins downstream | the callout holds to 4:56.8 | `continue` |
| 67 | `Instead of a sewer or a river` | 4:42.2 *(in 66)* | TOWN `site`, pulled back | **The fork**: the sewer route and the river route both pulse once (dim). 3.3: a **third pipe stub** grows from the DC lot up and back | none | `continue` |
| 68 | `one town in Washington State` | 4:44.2 | **TOWN, Quincy dressing**: another data center (same building type, different town; no logos) with a **reuse plant** beside it and **lined ponds** beyond | The sheet slides in. The plant's tank rake turns. A pump runs | **Place label** `QUINCY` sub `WASHINGTON` | `slide` |
| 69 | `In Quincy, the city cleans the drained water` | 4:49.0 | Quincy `plant`: a lime-softening tank (cut open) | The orange blowdown arrives in the tank through the sewer. 9.7: lime is dosed (white drift). 11.2: sludge settles to the bottom | none | `continue` |
| 70 | `and pipes it back for the towers` | 4:53.5 | Quincy `site` | **The orange return route** runs from the plant back to the DC and up its makeup line to the towers, and its node dot lights at the tower | none | `continue` |
| 71 | `The minerals the city removes` | 4:56.8 | Quincy `ponds`: lined ponds (black liner, cut in section) | Brine pumps in. The water level drops (time-lapse) and **a white salt crust spreads** across the pond floor | none | `continue` |
| 72 | `instead of in a river` | 5:01.4 *(in 71)* | Quincy, trucking right past the ponds to **the river** beyond | The river flows clean, with no plume. In Short 3 (9:16) the return pipe's orange fades out during the last crane (`returnOutAt`), so the end frame matches the hook's | none | `continue` |
| 73 | `Microsoft agreed to cover` | 5:03.4 | Quincy `site`, wide | The rake turns. The return pipe pulses (one pulse every 1 s). The towers steam | **Counter** `$31 MILLION`, sub `THE SYSTEM'S COST` | `continue` |
| 74 | `The EPA's case study puts the water saving` | 5:08.8 | Quincy `meter`: the DC's street meter | **The dial slows** (less fresh water drawn). 30.8: the return pipe beside it keeps pulsing | **Counter** `138 MILLION` unit `GAL / YEAR`, sub `ESTIMATED SAVING` | `continue` |
| 75 | `Even in Quincy, the towers still send water` | 5:16.4 | Quincy, crane up to the roof | The plume is still rising, with its orange tokens | none | `continue` |
| 76 | `Could a data center be cooled` | 5:21.1 | Quincy `roof`, close on one tower | The fan turns. Push in on the plume | none | `continue` |

### Chapter 4: Why not cool it without water? (card Q 5:25.4, voice 5:29.3 to 6:54.6, then the 12 s hold)

| # | Cue | t | Set · framing | Motion and visible events | Overlay / number | In |
|---|---|---|---|---|---|---|
| — | **card 4** (silent) | Q = 5:25.4 → voice at 5:29.3 | Previous shot keeps moving, dimmed (`paper` 72 %) and blurred 16 px; **the transition to the next shot runs under the card** (`slide` from the right: Quincy's roof out, our DC's roof in, from Q + 30, settled by Q + 66) | **Full-frame chapter card** (§ 11.5.1): `CHAPTER 4` / **"Why not cool it without water?"**, x 144, centred on y 500, hold 2.5 s. Captions off from Q + 6. Nothing else on screen; every earlier overlay gone by Q + 6. Music swells | — |
| 77 | `This data center could skip evaporation` | 5:29.3 | **DC** `roof` (our data center again; entered under the card, towers still on) | 48.8 (after the card has cleared): **the towers lift away** (slide out to the right, one after the other), and **air-cooled machines are lowered in from above** (dry coolers: long finned banks, rows of fans on top). 52.5: the plume thins to nothing | none (the voice says "This data center"; no spoken place name to hang a label on) | `slide` (under the card) |
| 78 | `They work like a car's radiator` | 5:35.1 | DC `drycooler`: one machine cut open | Orange warm water runs through the finned tubes. The fans spin and pull air through. **Orange warm air** rises off the top. No vapor, no drain | none | `continue` |
| 79 | `Microsoft's newest design works this way` | 5:39.3 | DC `loop`: the loop's fill valve in the mechanical room | 58.9: a **fill hose** is connected (a worker extra). The level gauge rises | none | `continue` |
| 80 | `filling its cooling loop once` | 5:41.5 *(in 79)* | DC `loop` | 1.5: the gauge reaches full. 2.5: the hose is disconnected and **a cap and lock tag go on the valve**. 4.0: the loop circulates sealed | **Callout** `FILLED ONCE` | `continue` |
| 81 | `The company says each data center` | 5:46.9 | DC `wide`, roof with dry coolers | No plume, no drain. 9.4: the street meter's dial **slows almost to a stop** | none | `continue` |
| 82 | `will avoid more than 125 million liters` | 5:49.4 *(scene starts on `liters of water a year`, 5:52.3)* | DC `meter` | The dial creeps | **Counter** `33 MILLION` unit `GAL / YEAR`, sub `125 MILLION LITERS` (the sub on `liters`, the digits land on `33 million gallons`) | `continue` |
| 83 | `But while air-cooled machines use no cooling water` | 5:57.9 | DC `yard` | The electric meter's disc **speeds up**. The transformers' fans speed up | none | `continue` |
| 84 | `they use more energy` | 6:00.8 *(in 83)* | DC `roof` | The dry coolers' fans run **visibly faster** than the towers' did. Their orange warm air rises harder | none | `continue` |
| 85 | `For its new design, Microsoft says` | 6:04.0 | DC `yard`, the meter close | The disc's speed **nudges up only a little** (≈ 5 % in the spin). The power line hums (insulator glints) | none | `continue` |
| 86 | `Either way, that extra electricity` | 6:09.7 | DC → TOWN | **`follow`**: truck left along the power line, out of the yard, across the fields | none | `follow` (truck, 36 f) |
| 87 | `and making electricity uses water too` | 6:13.3 | TOWN `plant-tease`: a power plant at the far edge of the sheet, its own hyperbolic cooling tower **steaming hard** | The plume billows. 35.4: the plant's water path lights orange inside its cut face (the tease) | none | `continue` |
| 88 | `Across the US in 2023, Berkeley Lab found` | 6:16.6 | TOWN `twoShot`: the power plant (left) and the DC (right) on one sheet, the line between them | 37.4: the DC's small water mark (one orange drop token) lights at its roof | none | `continue` |
| 89 | `took about 12 times the water` | 6:21.7 | TOWN `twoShot` | **Twelve drop tokens** light at the plant's tower, one every 0.3 s, against the DC's one | **Counter** `≈ 12×` sub `WATER TO MAKE THEIR POWER` | `continue` |
| 90 | `Back on the roof this afternoon` | 6:26.5 | DC `wide`, the roof with **its towers again** (today's state) | The plume rises. 47.8: orange tokens go up | none | `slide` |
| 91 | `and the rest usually goes down the city drain` | 6:30.3 *(in 90)* | DC `wide` | The orange drain pulses down to the sewer lateral (one pulse every 1 s) | none | `continue` |
| 92 | `This data center can keep that water out of the air` | 6:33.3 | DC `roof` | 55.3: the swap again: towers out, dry coolers lowered in from above, and **the plume stops** | none | `continue` |
| 93 | `but only by using more electricity` | 6:36.5 *(in 92)* | DC `yard` + roof in one framing | The meter spins up | **Statement 2** on cue `only by using`: **"Only by using / more electricity."** (`low`) | `continue` |
| 94 | `And part of the water this data center saves` | 6:39.7 | → TOWN `twoShot` | **`follow`** along the line. The orange the DC no longer sends up **reappears at the plant**: its plume swells | none | `follow` (truck left, 30 f) |
| 95 | `at a power plant instead` | 6:43.1 *(in 94)* | TOWN `plant-tease` | The plant plume swells once more. The drop tokens rise into it | none | `continue` |
| 96 | `The next time your town argues` | 6:45.5 | TOWN `frame0`'s composition (town, DC with towers, fence), pulled back so the plant is in on the far left (`eastEnd: false`, same sheet as the hold) | **YOU** walks to the fence with two extras and looks up at the plume (the roof shows today's towers, not the dry coolers) | **Tag** `YOU` (re-entry, 2.0 s) | `continue` |
| 97 | `ask about its electricity too` | 6:48.6 *(in 96)* | TOWN | YOU's head turns along the power line toward the plant. A soft pulse runs along the line (neutral glint, not orange) | none | `continue` |
| 98 | `Part 2 follows that electricity` | 6:51.2 | TOWN `endHold` (`eastEnd: false`: the sheet ends past the DC, so the right half is free): slow truck left along the line, settling with **the plant, the line and the DC in the left ≈ 55 %** (x ≤ 1056) and plain sky and field on the right | The plumes rise. The fans turn. The trace stays lit (the DC's node dots, the plant's water path). Drift only after 7:18 | none. Captions end with the voice | `continue` |
| — | (hold) | 6:54.6 → 7:06.6 | TOWN `endHold` | 12 s calm hold: drift, plumes, fans. Music ends in silence on the last frame | **No overlays.** Right half free for the end-screen elements | — |

**Counts.** 98 shots (76 scenes in `spec.ts` after draft 3's merges) plus 3 silent chapter cards over 414.6 s of voice track (≈ 5.5 s a scene). Slides: 5 (24 → LAB, 27, 68, 77 under card 4, 90). Follows: 10 (incl. 37 and 59 under cards 2 and 3). A few glides inside one set run 2 to 3 s (9, 31, 56, 72); they are framing changes on a continuous camera, not new ideas. No hard cuts. X-rays: the
hall wall (19), the tower (21), each once. Statement cards: 2 (5, 93), > 6 min apart. Counters: 13, never two at once.
Callouts: 11. Place labels: 3 (`THE SEWER`, `OHIO`, `QUINCY`). Tags: YOU twice (33, 96). Lines that point at the screen: 1 ("Look at the back of this rack").

---

## 2. The four Shorts (vertical re-render, § 11.8)

Each Short is `<slug>-short-<n>`: the hook line (own voice file), a 0.35 s gap, then the chapter's voice from `from` to just
before `until`. It ends on frame 0's picture, so it loops. Title block at frame 0 (vertical § 6: x 120, top y 300), line 2
`NO. 013 · CH. n · <PLACE> · <TIME>`. No chapter card (the title block replaces it). Vertical overlays sit inside x 120 to 888 and
y 288 to 1248. Captions use the vertical spec. Counters go in the title block's spot after it leaves. Every two-shot **stacks**
(the twin-section convention: one sheet, two sections, top and bottom).

**General vertical rules per set** (they apply to every scene's `vertical` block, including those outside a Short window, so the
chapters can be recut later):

- **DC** stacks naturally. The building is two storeys plus a roof, so in 9:16 the `wide` framing becomes the **roof and towers on
  top, the riser in the middle, the hall at the bottom**, with the cut ground and meter in the bottom ≈ 15 %. The horizontal
  side-by-side of hall and mechanical room becomes a glide between them.
- **TOWN** horizontal sheets become **stacked sections**: the town's houses above, the main and sewer cut below; the
  `twoShot` becomes the plant on top and the DC below, with the power line crossing the gap vertically.
- **LAB**: the bench framed tight. Jug and heater sit closer together so they fit in 768 px, or the camera glides
  between them instead of holding both.

| Short | Hook line (frame 0) | `from` → `until` (real, voice) | Length (hook est.) | Frame 0 / loop | What changes from the horizontal |
|---|---|---|---|---|---|
| **1** · ch. 1 | "One big data center can use up tens of millions of gallons of water a year. Where does it all go?" (7.5 s) | `Look at the back of this rack` (1:06.2) → `Data centers use the most` (ends on "evaporate." 1:52.1; lines 12–19) | 7.5 + 0.35 + 45.9 + 1.2 tail ≈ **55.0 s** | **Hook scene: DC vertical `wide`**: the tower cut open on top with the plume into the sky band, the orange riser, the AI rack at the bottom, the meter's dial spinning in the cut ground. The Short ends on shot 27 (`That's why towers let the water evaporate`, DC `tower`), which glides out to this framing in its last 1.0 s | Shots 17–23: stacked crane (rack low → coil → riser → tower, all in one tall frame). Shots 24–26 (LAB): glide jug → heater → jug 2. Callouts on the vertical anchors. Title `Where does it all go?` / `NO. 013 · CH. 1 · THE DATA CENTER · 3:12 PM` |
| **2** · ch. 2 | "A data center's cooling tower reuses its water several times, so why does it still drain some away?" (7.1 s) | `Every time some of that water` (2:41.6) → `Fresh water replaces` (ends on "blowdown." 3:30.2; lines 27–33) | 7.1 + 0.35 + 48.6 + 1.2 ≈ **57.3 s** | **Hook scene: DC vertical `tower`**: the tower cut open, rain over the fill, the basin, and the blowdown valve below it **already trickling** (the hook asks about that drain). Ends on shot 51 (`BLOWDOWN`, the valve open), which glides up to this framing | The pipe section (45–47) is turned so **the pipe runs up the frame** (the riser itself, cut). The sample jars (44) on the plant-room bench, side by side, close. The plant controller and valve stack (controller above, valve and drain below). Title `Why don't they just reuse the water?` / `NO. 013 · CH. 2 · THE ROOF · 3:20 PM` |
| **3** · ch. 3 | "When a data center drains water from its cooling towers, why not just pipe it into the nearest river?" (7.4 s) | `Piping that water straight` (4:18.8) → `Microsoft agreed to cover` (ends on "river." 5:02.9; lines 40–44) | 7.4 + 0.35 + 44.1 + 1.2 ≈ **53.0 s** | **Hook scene: TOWN vertical `river`**: the DC lot at the top (plume up), its drain pipe running down the cut ground, and the river cut across at the bottom with the closed gate. Ends on shot 72 (the river beyond the Quincy ponds), which cranes up to the same composition (Quincy's sheet has the same river edge, so the frame matches) | Shots 62–66 stack bank over river. The fork (67): sewer above, river below, the third pipe growing up. Quincy (68–72): plant on top, ponds below, river at the foot. `OHIO` and `QUINCY` labels move to the vertical place-label spot. Title `Why not release it into a river?` / `NO. 013 · CH. 3 · THE DRAIN · 3:31 PM` |
| **4** · ch. 4 | "A data center can be cooled with no cooling water at all, so why doesn't every data center do that?" (7.3 s) | `But while air-cooled machines` (5:57.9) → `Part 2 follows` (ends on "too." 6:50.7; lines 54–61) | 7.3 + 0.35 + 52.8 + 1.2 ≈ **61.7 s** (over 60: kept, owner decision 2026-11-02; `yarn check` warns) | **Hook scene: DC vertical `roof`, dry coolers** (no plume, fans spinning, orange warm air rising), the yard's meter below. Ends on shot 97 restaged vertically: **the DC roof with dry coolers** (props override: not the town), YOU's line said over it, gliding to frame 0's framing | 83–85 meter close. 86–89 and 94–95: **stacked twin**, plant on top, DC below, the line crossing the gap, 12 drop tokens vs 1. 90–93: DC vertical wide. 96–97: the vertical override above (no town shot). Title `Why not cool it without water?` / `NO. 013 · CH. 4 · THE ROOF · 3:45 PM` |

Shorts drop the chapter's closing question (lines 25, 37, 49) and the Part 2 tease, as the rules say. No spoken plug. **No chapter card in
any Short** (§ 11.5.1), and the 3.9 s chapter gaps never fall inside a Short's window (each window lies inside one chapter).
Short lengths are from the chapter voice, unaffected by the gaps. The hook lines aren't voiced yet: their lengths are still estimates (`transcript.json` `hooks`). Ends after draft 3's merges: Short 1 on shot 27, Short 2 on 50+51, Short 3 on 71+72 (the crane to the river now in its last second), Short 4 on 96+97.

---

## 3. Lines that are hard to show or badly paced (proposed fixes, not made)

**Status 2026-11-02:** items 1, 2, 3 and 5 are settled. The scriptwriter applied the fixes, and the owner kept Short 4 at ≈ 67 s. Item 7 (belief line) and item 6 (line 6 cut) are skipped for now. The rest are staging notes. Line numbers below are draft 1's.

1. ✅ settled · **The first question doesn't match the title.** The `##` heading (and so the YouTube chapter title and the video's question) is
   "Why does a data center need water?", but the voice asks "So where does all that water go?" (line 3). The title block must
   show the question as the voice asks it (§ 6), and chapter titles are the question as spoken. **Recommendation:** title block
   line 1 = "Where does all that water go?" and rename the ch. 1 heading to "Where does a data center's water go?". Or keep
   the heading and change line 3 to "So why does a data center need all that water?" (the answer, "Most of it leaves through the roof",
   still fits). Scriptwriter's call, and the owner's if it changes the YouTube title.
2. ✅ settled · **Short 1's hook asks no question.** The others do. With lines 12–18 there is no spoken question by 5–6 s. **Fix:** "One big
   data center can use up tens of millions of gallons of water a year. Where does it all go?" (+≈ 1.7 s → ≈ 61 s). No new
   claim, so no new source is needed.
3. ✅ settled · **Shorts 2 and 4 run past 60 s** (≈ 63 s and ≈ 67 s, estimated). There is no contiguous window inside 45–60 s that keeps the
   mechanism *and* the answer. Options: (a) accept them (allowed over 60 s with no licensed music, brand.md § Structure, but the
   chapter-Short rule says 45–60), (b) Short 2 from line 27 (≈ 54 s, losing *why* minerals stay), Short 4 until line 61 (≈ 60 s, losing
   the house ending "ask about its electricity too"), or (c) tighten lines 28–29 and 55–56 in the script. **Recommendation:** (a) for
   Short 4 (line 61 is the house ending) and (c) for Short 2: merge 28 and 29 into "Many towers run at two to four cycles, the EPA says,
   which means up to four times the minerals of the fresh water." That saves ≈ 4 s. Owner/main-session decision.
4. **Short 4 starts on "But".** Its window opens on "But while air-cooled machines…", right after the hook's question. It reads as an
   answer, but if the cut sounds abrupt, start on the cue `while air-cooled machines` (only if the take has a breath after "But").
5. ✅ settled · **Line 18 is 10.7 s and 27 words** with two subordinate clauses: "Warming the same gallon by 10 degrees, without evaporating it,
   would carry off only about a hundredth as much, which is why towers let water evaporate." Heavy on the ear and on the
   captions (4 pages). **Fix:** "Warm that gallon by 10 degrees instead, and it carries off only about a hundredth as much. That's why
   towers let the water evaporate." Same claim.
6. *(skipped for now)* **The power stretch (lines 6–10, 0:27 to 1:01, 34 s) has no water.** It's on-thread (heat starts with power) and shows fine (the yard
   growing, the racks, counters), but it is the longest gap from the video's subject, right after the hook. No fix is required. If
   the owner finds it slow in the rough cut, line 6's second half ("and these buildings use a lot more power than they did a few years ago")
   repeats what line 7 says with numbers and could go (−4 s).
7. *(skipped for now)* **No "belief, then correction" line** (brand.md § Long-form asks for one per video). sources.md § M has the material ("most people
   picture the water going down a drain"). It could sit in ch. 1 before line 4: "You might picture all that water going down a drain.
   Most of it leaves through the roof, as vapor." Optional; it needs a fact-checker look if attributed.
8. **Line 1, "Towns are pushing back".** Showing opposition without politics: I stage it as extras at the fence looking up at the plume
   (no signs, no meeting, no text). A town-hall slice with raised hands would be more literal but reads political. The owner has said no
   politics, so I recommend the fence.
9. **Line 41 (Ohio): show the limits, not the document.** A permit sheet on screen would come close to "no document title". I show three
   unlabelled gauges plus one callout `THREE LIMITS / MINERALS · CHLORINE · ACIDITY`. The words come from the voice. No change
   needed.
10. **Line 52, "filling its cooling loop once during construction".** Construction isn't in our afternoon. I show the fill hose, the gauge
    and the locked cap without a time jump. If the owner wants scaffolding (a time-passes beat), that's a bigger build.
11. **Line 57's 12× is national, not this site.** The two-shot (our DC vs a plant) could read as "this plant uses 12× this site". Sub-line
    `WATER TO MAKE THEIR POWER` plus the voice's "Across the US in 2023" carry it. Optional script fix: none needed if the sub-line holds;
    flag for the reviewer.
12. **Line 51's car radiator** is spoken only. The picture stays on the dry cooler's cutaway (one idea). A cut to a gas car's radiator
    (`DriveUnitScene` gas variant) would be a 4-s detour to a car set. Not recommended.

---

## 4. Sets and scenes inventory

### Reused (existing)

| Part | Where it's used | Note |
|---|---|---|
| `three/section/SectionCamera` (`FOV_H` 14.8, `useFormatProps`, `widenFraming`), `SectionStage`/`SectionLights`, `moods`, `textures` (sky) | every new set | Already horizontal-ready |
| `three/section/cutLook` (`CutOutline`, `InkLine`, hatch, `cutMaterial`) | every cut face | — |
| `three/section/GlowLines` (`GlowPolyline`, `GlowNode`, `pointAlong`) | the orange route: coil → riser → tower; drain → sewer; Quincy return; plant tease | — |
| `three/PushArrow` / `CurveArrow` | the hot-air arrows (orange), flow arrows | Neutral variant needed for cold air and fresh water (see requests) |
| `three/Atmosphere` `Steam` | the vapor wisps in the fill; scaled up for the roof plumes | Plume = many wisps, larger, slower; white, the orange only in tokens |
| `three/section/Figure` | YOU (tagged twice), extras: technician, fill-hose worker, people at the fence | — |
| `three/section/StreetSlice` `House`, the main and service pipe, the kitchen with YOU at the sink (No. 004) | TOWN houses, main, `kitchen` | Needs horizontal framings |
| `three/real/WaterMeter` | the DC's street meter (dial speed as a prop) | The dial's reading stays unreadable or generic |
| `three/section/CordCorner` space heater | LAB `heat-bench` heater | Extract the heater as its own part |
| `ReportSliceScene` server racks (`REPORT.rack`, LEDs) | DC rack rows | Extract a shared `ServerRack` part (ordinary + AI variant) |
| `three/section/LabSlice` + `SectionLabScene` | LAB (shots 24–26 only) | Needs a horizontal format and the new dressing |
| Components: `TitleBlock`, the full-frame chapter card (§ 11.5.1, `spec.chapters`; built, the timeline starts each chapter's first scene at Q + 30), `Captions`, `Counter` (incl. `rows`, `rangeTo`), `Callout`, `PlaceLabel`, `Statement`, `NameTag` | as in § 1 | No new overlay type needed |

### New sets (build briefs for the scene-builder)

All new sets: horizontal and vertical framings from the start (§ 11.6 wide block ≈ 5.6 wide; the DC is bigger, see below), the fixed angle,
Day mood (hot afternoon, long shadows to the left), real materials (§ 3 "objects real"), no logos or readable text, orange only as the
table at the top says. Every motion a function of the frame. Times are seconds into the scene, and keys may lie outside it (the byd/insurance
pattern, so `continue` runs share one take).

**N1. `datacenter-slice` (DC), the main set (≈ 60 % of the video).** A two-storey data center cut open at the fixed angle, about
14 m wide on the sheet:
- *Ground floor, left:* the **data hall**: two rack rows on a raised floor with a cold aisle and a contained hot aisle. The last rack in a
  row is the **AI rack** (denser, more fans, coolant hoses). Behind the hot aisle is the **coil wall** (finned coils, blue-grey supply below,
  return above; the return turns orange when warm). Props: per-rack heat (`shimmer` 0..1), the hot-aisle haze level, `serverPull` (the
  technician slides one out and in).
- *Ground floor, right:* the **mechanical room**: the loop pumps, the **conductivity controller** (needle with bands, set point that can
  turn 3 → 6), the **blowdown valve** with an actuator and floor drain, the **makeup valve** and float, the **chemical dosing skid** (two
  small pumps that stroke, two plain drums, clear drops), the **fill valve** with a hose, a cap and a lock tag (ch. 4), a small **sample bench**
  (two glass jars with probes: mineral dots 1× and 4×, a needle swing; shot 44), and one pipe that can be shown **cut across** for scale (crust growing inward, a 0..1 key) and corrosion (pits, wall thinning).
- *Riser:* a shaft up through the slab and the roof, with the warm pipe (orange route) and the cold return (neutral).
- *Roof:* two **cooling towers**, one with a **cutaway** (spray nozzles, fill packs, basin, side louvers, fan stack). Rain over the fill,
  droplets peeling off as vapor with orange tokens, the water's orange fading from top to basin, neutral air arrows in through the louvers.
  **Mineral dots** in the basin (density key), a lap tick on the basin wall, and a muted-olive **biofilm** that spreads and recedes. **The
  roof swap**: `roof: 'towers' | 'dry'` with a swap time (towers slide out right, dry coolers slide in). **Dry coolers** with a cutaway
  (finned tubes carrying orange warm water, rows of fans, orange warm air rising, no vapor). Fan speed keys for both.
- *Outside:* the **utility yard** (a power line in from the left, transformers that slide in and out by count, switchgear with an electric
  meter whose disc speed is a key). The **cut ground** in front holds the service line + `WaterMeter` (dial speed key), the sewer lateral,
  and the drain path (orange) down to it.
- *The loop as a route:* one polyline coil → riser → tower → basin → return riser → coil, with a "lap" key that runs a marked ring (neutral)
  around it, and `routeAt` for the orange draw.
- Framings (horizontal and vertical): `wide`, `hall`, `racks`, `rackBack`, `coil`, `riser`, `roof`, `tower`, `fill`, `basin`, `plant`,
  `valve`, `pipe`, `loop`, `drycooler`, `yard`, `meter`. Anchors for callouts: `fins`, `stream`, `valve`, `fill`, `basin`, `hose`, `pipe`, `minerals`.
- Vertical: `wide` = roof over riser over hall (§ 2).

**N2. `town-slice` (TOWN), the outside world.** One long sheet cut along the street, which the camera trucks along (`follow` left and right):
- From left to right: a **power plant (tease)** far left (a hyperbolic cooling tower with a big plume, a cut face that shows its water path
  lit orange on a key, the transmission line leaving it), fields with the line, **the data center** (the DC's building as a lower-detail
  instance, plume and dry-cooler states matching DC), the **fence** with extras, **three houses** (StreetSlice `House`) and a **water
  tower**, the street with the **water main** and the **sewer main** on the ground's cut face, the **wastewater plant** (a round clarifier
  with a turning rake, an aeration basin with bubbles), and **the river** (cut across: water, sandy bed with drifting grains, rocks), an
  **outfall gate** with a sampler bottle and three unlabelled gauges (needle keys), and a warm plume (orange) that can spread downstream.
- The **400 houses**: a field behind the town that fills with instanced small houses, row by row (a 0..1 key). If too costly, fall back to
  kitchen windows lighting along the street.
- **Quincy dressing** (`dressing: 'quincy'`): the same sheet type re-dressed: the DC, a **lime-softening tank** cut open (lime drift,
  sludge settling, a rake), the **orange return pipe** to the DC roof, **lined brine ponds** (black liner in section, water level falling,
  a white salt crust spreading), and the river at the edge (same river-edge framing as the main sheet, for Short 3's loop).
- Framings: `frame0` (town left, DC right, plume), `meter`, `houses`, `kitchen`, `roof`, `site`, `sewer`, `plant`, `river`, `outfall`,
  `riverbed`, `plant-tease`, `twoShot` (plant + DC), `endHold` (subject in the left 55 %), Quincy: `site`, `plant`, `ponds`, `meter`, `roof`.
- Vertical: stacked sections (§ 2).

**N3. LAB `heat-bench` dressing + horizontal `section-lab`.** On the bench: two gallon jugs on two hot plates (jug 1 boils off with vapor;
jug 2 has a thermometer that creeps 10 degrees), a wall heat meter per item (bars filling orange: jug 1 full, jug 2 a sliver ≈ 1 %,
heater full), **the space heater** (the CordCorner heater, glowing) and a **wall clock** whose hands can sweep 1 h 40 in ≈ 3 s. (The ch. 2 sample jars moved to N1's plant room in draft 2.) Horizontal framings `wide`, `bench`, `jug1`, `heater`,
`jug2`; vertical as today.

**Small requests.** A **neutral** variant of `PushArrow` for cold air and fresh water. A theme token for **biofilm** (muted olive, outside the
reserved band, not `signalGreen`; brand-director to approve as a colour addition). `Steam` scaled up for a plume (or a `Plume` part).

**Not built (Part 2):** the full power plant. This video only needs the tease (N2, far left).

### Effort and order (suggestion)

N1 first (it carries ch. 1–2 and half of ch. 4; the stills of shots 1–36 can be judged on it alone), then N2, then N3. N2's DC instance
reuses N1's building. If time is short, N3 can be cut by staging shots 24–26 on DC with callouts. That's weaker: the comparison wants
the bench.

---

## 5. Chapter cards, watermark, end screen (horizontal layout)

- **Title block** (shot 1): x 144, y 120, line 1 Archivo 800 40 px, line 2 Mono 600 26 px. Up from frame 0, out at ≈ 15.4 s (0.8 s after
  "So where does all that water go?"). No other card while it is up (statement 1 enters after it).
- **Chapter cards: full frame, silent** (§ 11.5.1, v0.17; they replace draft 1's corner cards). None for ch. 1 (the title block) and none
  in the Shorts. Q = the frame the previous chapter's question ends; the voice resumes at Q + 117 (3.9 s):

  | Card | Q (end of the spoken question) | Question on the card (the `##` heading, verbatim) | Transition under it (Q + 30 → ≤ Q + 66) | Voice resumes |
  |---|---|---|---|---|
  | 2 | 2:29.6 "…around forever?" | `Why don't they just reuse the water?` | `follow`: crane up the riser from the basin to the roof | 2:33.5 |
  | 3 | 4:00.4 "…the nearest river?" | `Why not release it into a river?` | `follow`: truck right along the drain from DC into TOWN, the river arriving | 4:04.3 |
  | 4 | 5:25.4 "…any water at all?" | `Why not cool it without water?` | `slide` from the right: Quincy's roof out, our DC's roof in | 5:29.3 |

  All three fit one line at 80 px (≤ 36 characters; ≈ 30 a line is the guide's figure, so check on stills, with a manual break as the
  fallback: `Why don't they just\nreuse the water?`). Left x 144, right edge ≤ 1536, block centred on y 500. The scene behind is dimmed
  (`paper` 72 %, blur 16 px) and keeps moving. Captions are off from Q + 6 to the first word. Every counter, callout, tag or label of the
  previous chapter is gone by Q + 6, and nothing new enters before Q + 111. So shots 36, 58 and 76 carry no overlay in their last ≈ 1 s
  (none do in this draft). The music swells under each card (§ 11.7); an optional sound at Q + 24 is the music's call.
  `spec.chapters` entries are needed only for the manual break or a hold other than 2.5 s; `place`/`time`/`askedAt` are gone.
- **Place and time after a card:** ch. 2 none (same roof, and the picture says it). Ch. 3: `THE SEWER` / `3:31 PM` on "down the sewer"
  (shot 60), the first new place. Ch. 4 none (no spoken place name in line 50; the voice says "This data center" and the slide brings back
  our roof). The story times 3:20 PM and 3:45 PM now live only on the Shorts' title blocks. YouTube chapter timestamps start at the cards
  (Q + 6, rounded down: 2:29, 4:00, 5:25; the publisher's call).
- **Watermark:** YouTube's branding watermark is applied at upload, for the whole video (publisher checklist). In the video:
  `watermark: null` (no burned-in tag). **The corner x ≥ 1560, y ≥ 780 stays free of readable overlays in every shot.** Counters,
  callouts and labels sit left or top-right (right-side cards keep their bottom ≤ y 780). The DC's meter pit is framed off that corner in
  `meter` shots.
- **Captions:** burned in, the margin note at 52 px, left x 144, bottom y 960, ≤ 42 characters a line. On two-line pages, subjects sit
  above y ≈ 808 or on the right half. That's why counters go top-left and the 3D subject is composed right/up when a counter is up.
- **End screen:** after "where it's made" (6:54.6), a **12 s hold** on TOWN `endHold`: power plant, line and DC in the left ≈ 55 %
  (x ≤ 1056), with the right half plain sky and field for the end-screen elements (Part 2 / the series playlist, subscribe). Drift only, plumes
  and fans moving, trace lit, no overlays, captions off with the voice, music to silence on the last frame. No loop.

## 5.1 Framings set in `spec.ts` (draft 4, full stills pass 2026-11-02)

Where a named set preset hid the beat's subject, `spec.ts` sets the camera itself (constants with a comment each). Scenes that
also play in a Short keep the named preset in their `vertical` block.

| Shots | Constant | Why |
|---|---|---|
| 1 | `OPENING_LAND` | The reveal's landing at F138 (§ 6.1) |
| 8–11 | `YARD_H`, `YARD_WIDE_H` | The yard presets put the transformers under the captions |
| 38, 54, 81, 90 | `WIDE_ALL` | `wide` cut off the meter, the drain and the plume |
| 50 (9:16) | `VALVE_V` | The valve sat behind the captions |
| 60 | `SEWER_H` | The `sewer` preset was an abstract close-up of cut lines |
| 62–64 | `OUTFALL_H` | The three gauges were cut off at the top |
| 65–66 | `RIVERBED_H` | The warm plume was off the top of the frame |
| 75–76 | `QUINCY_ROOF_H`, `QUINCY_PLUME_H` | "Still send water into the air": the plume needs room above the towers |
| 77 | `ROOF_DRY_H` | After the swap the low dry coolers were under the captions |
| 87 | `PLANT_TEASE_H` | The power plant sat under the captions |
| Short 2 hook, 50 end (9:16) | `TOWER_VALVE_V` | `towerValve` put the title block over the tower's open interior |
| Short 4 hook, 96 end (9:16) | `ROOF_DRY_V` | The dry coolers sat low under the captions |

Also changed in draft 4: log glides on long pulls (30, 49, 66, 3, 6) so the camera doesn't dive through the building; the cycles
counter in shot 41 starts on "and engineers measure" so it reaches 4 as the phrase lands; 9:16 callout placements in the Lab (24, 26).

## 6. Thumbnail (1280 × 720)

**Moment:** shots 21–22 (≈ 1:25 to 1:35), recomposed as a still. The data center cut open at the fixed angle, **the cooling tower's
cutaway** on the roof with water raining over the fill, a **big white plume** rising into the sky, and the **orange route** climbing
from the glowing AI rack up the riser into the tower. This is the whole video's thread in one picture, readable at a small size. The plume and
the orange carry it at 168 px wide.
**Text** (≤ 4 words, Archivo 800, left third, statement look): "Where does the water go?" or "It goes up." The subject goes on the right
two-thirds, and the bottom-right is kept clear of YouTube's duration badge.
The thumbnail isn't specced yet (§ 11.9). This is a suggestion for the brand-director and publisher, and the owner picks.

## 6.1 The real opening and the reveal (§ 11.6.1, owner approved 2026-11-02)

- **In `spec.ts`:** `opening: {footage: 'footage/opening.mp4', until: 3.2, masks: OPENING_MASKS}` (clip git-ignored; masks in
  `openingMasks.ts`). The clip is Pexels 38081600, a 1680 × 945 crop scaled to 1920 × 1080, 3.4 s long, used F0–F96. Long video only;
  every Short opens in 3D.
- **The town of line 1 is the real city behind the building.** That's why the TOWN two-shot of draft 2's frame 0 is gone from the opening.
  Shots 1–6 stay in DC: clip → DC at the house angle → meter → crane to the towers → wide. TOWN first appears on the `follow` at shot 32
  ("400 families"), and the frame-0 TOWN composition is still the end-screen hold's base (shots 96–98).
- **What the reveal needs (scene-builder, to build):**

  | Frames | What | Target |
  |---|---|---|
  | F0–F54 | The clip alone, title block and captions up | — |
  | F54–F66 | 3 px `cutLine` section line drawn on the real building along the projected cut edge, roof corner → ground | The clip's near (left) corner of the main box, ≈ x 456 at F60 |
  | F66–F96 | Near facade wipes back from the line (24 px feather, F66–90); behind the cut plane the real box cross-fades to the 3D DC (F72–90); the ground, roads, trees, the retail park and the city dissolve to the Section's floating world (F66–96); plume hand-off (F72–90) | The 3D camera **is** the clip's solved camera over F0–F96 (roof corners within 8 px at F66 and F90) |
  | F84–F102 | Orange tell: node dots at the racks' backs, the riser head, the tower basin; one pulse, no route | — |
  | F96–F138 | Dolly-zoom (solved lens → 26° across, building's screen size ±3 %) and angle glide to the house angle, leaving the track with its own velocity | **Lands on `OPENING_LAND`** = `{look: [2.0, 8.6, 0], distance: 88}` at the house angle (2026-11-02, after the full stills pass: towers fully in frame, ≈ 40 px clear under the title block; `openingReveal.ts` targets the same value). The building is about 7 % smaller than the clip's F96 box and sits lower; the angle glide absorbs the offset. Spec key at 4.6 s (F138) |
  | F138 → | Shot 1's own camera: slight push, then the log glide to `meter` on "complaints" | Already in `spec.ts` |

  The reveal is built (scene-builder) and lands on `OPENING_LAND`. Any change to that constant must be made in `spec.ts` and
  `src/scenes/openingReveal.ts` together.
- **Reveal shape mismatch: owner approved as-is** ("accept it as it is", 2026-11-02). Our 3D building is taller and narrower than the
  real one, so the facade wipe and cross-fade don't match shape for shape. It stays that way.
- **Title block over the footage:** fixed by the scene-builder (the title block now sits above the opening layer from F0).
- **Criteria flag (the owner's call, already made):** the clip shows **rooftop units, not cooling towers, and no white plume**. § 11.6.1's
  "Truthful" criterion asks for "rooftop cooling towers and a white water-vapor plume" for this video. The owner said "keep it". The
  3D takes over at F96 with towers and the plume, and the description's illustrative clause ("stock footage of an unnamed data center, not
  the site in this story") covers the difference. Brand-director: record this as an owner-approved exception, or tighten the wording.
- **Publisher:** the footage credit line and the illustrative clause (§ 11.6.1 Disclosure). Upload Private first and wait for Checks.

## 7. Illustrative items shown on screen (for the publisher's "Illustrative:" line)

The hot afternoon and "this data center" (composite site, generic building, no logo); the rack → coil → riser → tower layout; the kettle
(spoken only); the car radiator (spoken only); the blowdown valve, controller and chemical pumps; the space heater and clock (1,500 W
assumption); "400 families" as a calculation (the house field); the fence extras; the Quincy plant and ponds as a generic drawing of the
EPA-described system; the power plant (tease, generic).
