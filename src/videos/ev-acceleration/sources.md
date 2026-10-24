# Sources: ev-acceleration (No. 007)

Researcher draft, 2026-10-24. The script doesn't exist yet, so each entry gives a *likely* line. Statuses are the researcher's starting confidence. The fact-checker sets the final ones.

Agreed angle (owner): (1) EVs win from a red light because an electric motor makes full torque from 0 rpm, while a gas engine has to rev up and shift. (2) The twist: above the motor's base speed it is power-limited and its torque falls. Most EVs have one fixed gear, so the push fades, while a gas car with many gears stays near peak power. (3) Payoff: why some fast EVs use a two-speed gearbox.

Everything was accessed on 2026-10-24. Quotes are verbatim as returned by the web tool, which uses a small model. Re-open and re-quote before ✅, as for No. 006. "(tool)" marks a quote read through that tool. A long quote is given in pieces joined by "…". Numbers in **[brackets]** are our own unit conversions or arithmetic, not the source's.

---

## Script line map, revision 4 (CURRENT: script is now 13 lines; fact-checker 2026-10-24)

Verdict: **PASS** (no ❌; no wording fixes outstanding; two optional notes). Revision 3's fixes for old lines 4, 7 and 8 were applied. Lines are renumbered; the old numbers appear only in revisions 1 to 3 below.

| Line | Current wording | Status | Entry | Note |
| --- | --- | --- | --- | --- |
| 1 | "An electric car beat a 797-horsepower muscle car to 60 miles an hour, but the gas car hit 100 first." | 🟡 | C1 | Unchanged, the owner's choice. Numbers ✅ (3.3 vs 3.6 s to 60; 7.8 s gas vs 8.0 s EV to 100). "First" framing 🟡 as noted in revision 2 (separate runs; EV won the quarter mile, 11.7 vs 11.8 s). Line 5 attributes to "testers". |
| 2 | "So why did its head start fade?" | ✅ | C1 | |
| 3 | "pushes hardest from a stop, and that usually holds until around 30 miles an hour." | ✅ attributed | A1 | "From a stop" is fine here (the motor gives its maximum torque from 0 rpm). "Usually" and "around" are the paper's hedges (40–60 km/h, about 25–37 mph). |
| 4 | "A gas engine makes no push until it's spinning, so it has to rev up and shift gears." | ✅ | B1 | NPTEL: "cannot produce torque at zero speed". The revision-3 fix is applied. |
| 5 | "Testers timed the electric car at 3.3 seconds to 60 and the gas car at 3.6." | ✅ attributed | C1 | |
| 6 | "All-wheel drive helped the electric one." | ✅ attributed | C1 | Car and Driver: "the Scat Pack has the advantage of an all-wheel-drive launch". Now a standalone line without "testers", but it follows line 5 and states C/D's own point. Fine. |
| 7 | "Past about 30, the spinning motor starts fighting its own battery, so the push shrinks as speed climbs." | 🟡 | A1, A2 | Same as revision 3: ships. MathWorks: "the back EMF exceeds the supply voltage, preventing speedup"; limited torque above base speed. |
| 8 | "The gas car's push shrinks too, but each gear change brings its engine back close to where it's strongest." | 🟡 | B1, B2 | Hedged ("close to") as revision 3 asked. Synthesis of NPTEL "approximates" and EPA "near peak efficiency". |
| 9 | "Above about 30, the motor's power stays steady even though its push shrinks." | ✅ (idealised) | A1, A2 | MathWorks: "Above the base speed, the motor operates in the constant power region with a limited torque." Scope caveat: this holds to the motor's top-end range; at very high speed power itself falls (A3, 🟡), and an EV's peak power can be a timed or thermal boost (C1: 670 hp launch mode, 630 hp otherwise). Fine for the idealised curve; optional "up to its limit" if room. |
| 10 | "A gas car needs up to ten gears to get close to that." | 🟡 | B1, B2 | NPTEL: gears "approximate" constant power, more gears "a better approximation". "Up to ten" is supported (9- and 10-speed boxes were 31% of new US light trucks in MY2020, DOE). "That" now clearly points at line 9's steady power. Joined claim is our synthesis. |
| 11 | "At high speed, horsepower per pound matters most, and the electric car had less horsepower and was about 1,400 pounds heavier." | 🟡 (numbers ✅) | C1 | 5,925 lb vs 4,514 lb **[1,411 lb]**, tester-measured; 670 hp (launch mode) vs 797 hp. "Matters most" is standard physics, no single source (hedged). "Horsepower" is the unit in the source. |
| 12 | "Porsche gave its electric Taycan's rear motor two gears, one for pulling away and one for high speed." | ✅ | E1 | Porsche Newsroom (2019): first gear "acceleration from a standing start"; second gear "efficiency and power reserves even at very high speeds". Nuance only: Porsche says first gear "is mainly used in Sport or Sport Plus driving modes", so "pulling away" is the first gear's purpose, not what every launch uses. Fine as written. Brand rule OK (own product); legally sensitive named company, claim is Porsche's own description, past tense. |
| 13 | "Next time an electric car leaves a light, watch how the gap changes as both cars speed up." | ✅ | n/a | An invitation to observe, not a claim. |

---

## Script line map, revision 3 (superseded; plain-language rewrites of old lines 4, 6, 7, 8; fact-checker 2026-10-24)

Verdict: **PASS WITH FIXES** (no ❌). Lines 4, 7 and 8 need the wording below; line 6 can ship. Lines 1–3, 5, 9–11 unchanged from revision 2 (line 1 stays as the owner chose, 🟡 framing note kept). No new pages were needed; evidence is the NPTEL, MathWorks, DOE and Car and Driver quotes already re-opened.

| Line | Current wording | Status | Why / plainest accurate wording |
| --- | --- | --- | --- |
| 4 | "A gas engine can't push from a dead stop, so it has to rev up and shift gears." | 🟡, **fix** | Source: NPTEL, "the internal combustion engine cannot produce torque at zero speed", meaning the engine's own speed. "From a dead stop" is heard as the *car* being stopped, and a stopped car with an idling engine does pull away (through a clutch or torque converter), so a listener can take it as "a gas car can't pull away" (the scriptwriter's worry is right). Fix: **"A gas engine makes no push until it's spinning, so it has to rev up and shift gears."** (the scriptwriter's alternative, with "so it has to…" kept). |
| 6 | "Past about 30, the spinning motor starts fighting its own battery, so its push shrinks as speed climbs." | 🟡, ships | Mechanism ✅ (MathWorks: "the back EMF exceeds the supply voltage, preventing speedup"; "Above the base speed, the motor operates in the constant power region with a limited torque"). "Fighting its own battery" is a fair picture of the motor's own voltage opposing the battery's; slight risk that a lay listener hears wasted energy or a battery fight. If the owner wants it tighter without jargon: "the spinning motor makes its own voltage that works against the battery's" (✅). "About 30" matches line 3 (base speed usually 25–37 mph). |
| 7 | "The gas car's push shrinks too, but every gear change puts its engine back where it's strongest." | 🟡, **fix** | Drops the hedge and overclaims. NPTEL says gears "approximate" the ideal curve; EPA says more gears let the engine "more frequently operate near peak efficiency". No source says every shift lands at its peak: an upshift from near the rev limit lands near, not at, peak power, and "strongest" is ambiguous (torque vs power). Fix: **"The gas car's push shrinks too, but each gear change brings its engine back close to where it's strongest."** |
| 8 | "So above about 30, the electric motor does on its own what gas cars need up to ten gears to get close to." | 🟡, **fix** | Content is supported (NPTEL: ideal is "constant power output", gears "approximate" it, more gears "a better approximation"; DOE: 9- and 10-speed was 31% of new US light trucks, MY2020; motor holds constant power above base speed per MathWorks). Problem: "what" has no clear referent. A lay listener can hear "above 30 the motor keeps pushing as hard as ever", which contradicts line 6, and "So" implies line 7 causes it. Fix: **"Above about 30, the electric motor holds its power steady on its own, and gas cars need up to ten gears to get close to that."** (Power steady, not push: line 9 then picks up "power per pound".) Joined claim stays 🟡 (our synthesis). Add "up to its limit" only if room. |

Notes: line 4 is the only one where plain wording turned a true statement into a misleading one; lines 7 and 8 plain-wording problems are an overclaim and a vague referent. After the three fixes the verdict is **PASS** (lines 4, 7, 8 then ✅ or hedged 🟡).

---

## Script line map, revision 2 (superseded for lines 4, 6, 7, 8 by revision 3; fact-checker, 2026-10-24, 11 lines)

Verdict: **PASS WITH FIXES** (no ❌; one recommended tweak to line 1's new "hit 100 first", see its row; lines 2 to 11 need nothing. Updated after the owner's clarity edits to lines 6, 8, 9, the rear-motor wording in line 10 and the new line 1). The ❌ on the old line 11 is resolved. The 🟡 lines (7, 8, 9) are hedged synthesis of sourced physics; they're allowed with their hedges. Evidence is the pages re-quoted in revision 1 below (C1, A1, A2, B1, B2, E1); nothing new was needed.

| Line | Script wording (current) | Status | Entry | Result / exact fix |
| --- | --- | --- | --- | --- |
| 1 | CURRENT (owner, latest): "An electric car beat a 797-horsepower muscle car to 60 miles an hour, but the gas car hit 100 first." | 🟡 | C1 | **Numbers ✅, "first" framing 🟡.** C/D: "100 mph comes in 7.8 seconds versus the Scat Pack's 8.0 seconds" (gas car 7.8, EV 8.0), so "hit 100 first" is true of the printed times. Why only 🟡: (a) "first" implies one head-to-head race, but these are separate timed runs (C/D: "hardly fair"; the surface of the 3.6 s run is unstated; the same-surface Redeye did 3.8 s to 60); (b) the line, as the hook, has no "testers" and drops the quarter-mile result (EV won, 11.7 vs 11.8 s, with a lower trap speed, 119 vs 125 mph), which a viewer could take as "the gas car won". Not ❌, since each fact is sourced and line 5 attributes. Recommended wording: **"…to 60 miles an hour, but in testing the gas car reached 100 first."** (or "…was quicker to 100"). Keep the line from implying a finish-line result. Previous wording ("but by 100 it was behind") was ✅ attributed and slightly safer, because "behind" is a timing comparison, not a race order. Earlier note: matches: 60 mph 3.3 s vs 3.6 s; 100 mph "7.8 seconds versus the Scat Pack's 8.0 seconds" (gas car first). Scope is only "to 60" and "by 100", so the EV's quarter-mile win (11.7 vs 11.8 s) isn't contradicted. "Testers" appears in line 5, which attributes it. No fix. |
| 2 | "So why did its head start fade?" | ✅ | C1 | Question; the lead (0.3 s at 60) becomes a 0.2 s deficit at 100. No fix. |
| 3 | "pushes hardest from a standstill, and that usually holds until around 30 miles an hour." | ✅ attributed | A1 | Paper: base speed "usually corresponds to around 40–60 km/h" **[≈ 25–37 mph]**. "Usually" and "around" are the source's hedges. No fix. |
| 4 | "A gas engine makes no push at zero revs, so it has to rev up and shift." | ✅ | B1 | NPTEL: "cannot produce torque at zero speed." No fix. |
| 5 | "Testers timed the electric car at 3.3 seconds to 60 and the gas car at 3.6, and all-wheel drive helped the electric one." | ✅ attributed | C1 | Car and Driver: "the Scat Pack has the advantage of an all-wheel-drive launch". Attribution is now in the line. No fix. |
| 6 | "Past about 30, the motor's own voltage works against the battery's, and its push shrinks as speed climbs." (rechecked after owner clarity edit: still ✅; "about 30" repeats line 3's hedge, base speed usually 25–37 mph) | ✅ (plain-English wording) | A1, A2 | MathWorks: "the back EMF exceeds the supply voltage, preventing speedup"; "Above the base speed, the motor operates in the constant power region with a limited torque." "Works against" is a fair gloss of back-EMF (the supply is the battery via the inverter). "That speed" refers back to line 3's "around 30". No fix. |
| 7 | "The gas car's push shrinks too, but each shift brings its engine back toward its power peak." | 🟡 | B1 | Our synthesis, but now hedged ("toward"). NPTEL supports gears approximating the constant-power ideal ("approximates as closely as possible"). Acceptable as is; no opened source says it in these words. |
| 8 | CURRENT: "Above about 30, the motor makes the ideal shrinking curve by itself, and gas cars use up to ten gears to get close to it." **Fix applied by owner edit; the ambiguity below is resolved, scope is now above base speed, status 🟡 (synthesis), no further fix.** Earlier wording: "The motor makes that shrinking curve by itself, and gas cars use up to ten gears to get close to it." | 🟡 | A2, B1, B2 | Content is supported: the ideal is "constant power output" with torque varying "hyperbolically" (NPTEL), the gearbox "approximates" it, more gears "a better approximation", and 9- and 10-speed boxes were 31% of new US light trucks in MY2020 (DOE). **Remaining problem: "that shrinking curve" is ambiguous.** It follows line 7, which is about the gas car's shrinking push, so a listener can read it as "the motor makes the gas car's curve", and "get close to it" then loops on itself. It should point at the motor's curve above base speed. Fix: **"Above that speed, the motor makes the ideal shrinking curve by itself, and gas cars use up to ten gears to get close to it."** The joined sentence stays 🟡 (our synthesis). |
| 9 | CURRENT: "At high speed, power per pound matters most, and the electric car had less power and about 1,400 more pounds." (rechecked: "at high speed" is vaguer than "from there" but not wrong; same support) | 🟡 (numbers ✅) | C1 | 5,925 lb vs 4,514 lb **[1,411 lb]**, tester-measured; 670 hp (launch mode; 630 otherwise) vs 797 hp, so "less power" is true either way. **[Power per pound: about 0.11 vs 0.18 hp/lb.]** "Matters most" is standard physics (force = power ÷ speed, then ÷ mass), no single source says it, and "most" is a hedge. Acceptable; "testers weighed" is optional. No fix. |
| 10 | CURRENT: "Porsche gave its electric Taycan's rear motor two gears, one for the launch and one for high speed." **Precision below now applied; status ✅, no fix.** Earlier wording: "Porsche gave its electric Taycan two gears, one for the launch and one for high speed." | ✅ | E1 | Porsche Newsroom (2019): "The two-speed transmission installed on the rear axle in the Taycan…"; first gear "acceleration from a standing start"; second gear "efficiency and power reserves even at very high speeds". Past tense is right. **Precision:** the gearbox is on the **rear** axle only (the front is single-speed, about 8:1), so "gave its Taycan two gears" can be heard as the whole car. Fix: **"Porsche gave its electric Taycan's rear motor two gears, one for the launch and one for high speed."** Brand rule OK: own product, own newsroom. Legally sensitive (named company), claim is Porsche's own description. |
| 11 | "Next time an electric car leaves a light, watch how the gap changes as both cars speed up." | ✅ | n/a | An invitation to observe, not a factual claim; nothing numeric. The old ❌ (a catch-up "past about 30", contradicted by the EV still leading at 60) is gone. No fix. |

Fixes still wanted: none. (Line 8's ambiguous "that" and line 10's "rear motor" precision were both applied.)

### Revision 1 (superseded by the table above; kept for the evidence notes)

## Script line map, revision 1 (fact-checker, 2026-10-24; script.txt as read, 11 lines)

Re-opened and re-quoted on 2026-10-24: C1 (AOL/Car and Driver), A1 (MDPI), A2 (MathWorks), B1 (NPTEL page 6), B2 (DOE FOTW #1185), E1 (Porsche Newsroom). Not re-opened this pass: the NPTEL page 2, EPA PDFs, Tesla manual, Audi, The Drive, MotorWeek (none is spoken in the script; their earlier researcher quotes stand as "(tool, researcher)").

| Line | Script wording | Status | Entry | Exact fix |
| --- | --- | --- | --- | --- |
| 1 | "An electric car beat a 797-horsepower muscle car to 60, then trailed it by 100." | 🟡 | C1 | Facts are right, wording is loose (see notes). Use: **"In testing, an electric car beat a 797-horsepower muscle car to 60 miles an hour, then reached 100 behind it."** Do not say "lost the race" (it won the quarter mile). |
| 2 | "So why did its head start fade?" | 🟡 | C1 | Fine as a question. The lead was 0.3 s at 60 and a 0.2 s deficit at 100, but the EV still won the quarter mile, so "fade" is true only up to 100 mph. |
| 3 | "usually up to around 30 miles an hour" | ✅ attributed | A1 | OK as written. Paper: base speed "usually corresponds to around 40–60 km/h" **[≈ 25–37 mph]**, midpoint **[≈ 31 mph]**. Keep "usually" and "around". Don't drop either. |
| 4 | "A gas engine makes no push at zero revs, so it has to rev up and shift." | ✅ | B1 | OK. NPTEL: "the internal combustion engine cannot produce torque at zero speed." The "so it has to... shift" part is NPTEL's gearbox argument; the reason to shift is the narrow power band, not zero-rev torque. Acceptable as a one-line summary. |
| 5 | "Testers clocked 3.3 seconds to 60 against 3.6, with help from the electric car's all-wheel drive." | ✅ attributed | C1 | OK. C/D: "the Scat Pack has the advantage of an all-wheel-drive launch". C/D does not state the 3.6 s run's surface. A second Redeye on the Daytona's surface did 3.8 s (EV lead then 0.5 s). Weaker than a "head start is mostly AWD" claim, so keep "help from". |
| 6 | "Past 30, the motor's own voltage fights the battery's, and its push shrinks as speed climbs." | 🟡 | A1, A2 | Physics is right: MathWorks, "the back EMF exceeds the supply voltage, preventing speedup", torque limited above base speed. "Fights the battery's" is our plain image (no source words it so). It's the motor's voltage versus the supply (inverter DC bus, fed by the battery). Hedge: **"Past about 30, the motor's own voltage works against the battery's"**. "Past 30" is a typical value, not a fixed one (25–37 mph, varies by car). |
| 7 | "The gas car's push shrinks too, but each shift puts its engine back near peak power." | 🟡 | B1 | Our synthesis. NPTEL supports the gearbox approximating constant power ("approximates as closely as possible"); no opened source says "each shift puts it back near peak power". Hedge: **"each shift brings its engine back toward its power peak"**. |
| 8 | "So the motor makes, by itself, the curve that gas cars use up to ten gears to get close to." | 🟡 | A2, B1, B2 | "Get close to" matches NPTEL "approximates"; "up to ten gears" is fine (DOE FOTW #1185: 9- and 10-speed was 31% of new US light trucks in MY2020; 7% of cars per its headline). Overreach: the ideal curve is constant power; the motor makes it only **above base speed**. Below it, torque is flat and power rises. Fix: **"Above that speed, the motor makes by itself the constant-power curve that gas cars use up to ten gears to get close to."** Joined sentence stays 🟡 (our synthesis). |
| 9 | "Above that, it's power for the weight, and the electric car had less power and about 1,400 more pounds." | 🟡 (numbers ✅) | C1 | Weights re-checked: Daytona "five thousand nine hundred and twenty-five pounds" (5,925 lb, "on our scales"), Redeye "4514-pound mass". Difference **[1,411 lb]**, so "about 1,400" is right. Power: 670 hp vs 797 hp, but 670 is the launch-mode figure (630 hp otherwise), so "less power" is true either way. Overreach: "it's power for the weight" as the whole answer. C/D itself blames the trap gap on the EV's 136 mph top speed (fixed gear), and the EV has AWD. Fix: **"Above that, power for the weight matters most, and the electric car had less power..."** Add "testers weighed" if room. |
| 10 | "Porsche gave its electric Taycan a second gear, a short one for the launch and a long one for high speed." | ✅ | E1 | OK. Past tense is right: the source is the 2019 launch page, which also says its content may be outdated; I did not confirm the current model year. Re-quoted: "The two-speed transmission installed on the rear axle in the Taycan is an innovation developed by Porsche." / "First gear gives the Taycan even more acceleration from a standing start," / "the long second gear ensures high efficiency and power reserves even at very high speeds." Add "rear" only if room (it's the rear axle; the front is single-speed). The Audi first/second-gear discrepancy does not matter here (Audi isn't named). |
| 11 | "Next time an electric car pulls away at a light, watch whether the gas car catches up past about 30." | ❌ | C1 | The data says otherwise: in the cited test the EV was still ahead at 60 (3.3 vs 3.6 s), and the lead only turned into a deficit by 100. Nothing sourced shows a catch-up at 30. A viewer can't see it at a light either. Cut the number: **"Next time an electric car pulls away at a light, watch how the gap changes as they both speed up."** Or point at the cited range: "watch whether the gas car closes in by highway speed". |

### Notes on line 1 (the priority question)

- **"Trailed it by 100" is accurate in substance but ambiguous in sound.** Car and Driver: "100 mph comes in 7.8 seconds versus the Scat Pack's 8.0 seconds" (Redeye gas car 7.8, EV 8.0). So the EV was 0.2 s slower to 100. Trap speed at the end of the quarter: "125 mph to 119 mph", the gas car faster. Lower trap speed fits with being slower at 100 (C/D blames the EV's 136 mph top speed).
- **But the EV won the quarter mile**: "The quarter-mile goes to the Scat Pack—barely, 11.7 to 11.8 ticks." So the safe scope is "to 100", never "the race" or "the quarter mile". A listener may take "beat... to 60, then trailed it" as one head-to-head run; they were separate test runs, and C/D's own caveat is "hardly fair" (670 vs 797 hp, 5,925 vs 4,514 lb). The second Redeye on the EV's surface was slower to 60 (3.8 s) and faster in the quarter (11.6 s at 128 mph).
- **The alternative "then lost the race to 100"** is accurate on the 100 mph number, but "race" and "lost" suggest a head-to-head finish. Prefer "reached 100 behind it".
- **Correction to C1 below:** the researcher's caveat (c) said the first gas-car run was on a different surface. The page doesn't say that. It says only that the second Redeye ran "on the same surface as the Daytona". Read as "the surface of the first run isn't stated".
- **Internal oddity to know about:** the EV was slower to 100 (8.0 vs 7.8 s) yet won the quarter mile (11.7 vs 11.8 s) with a lower trap speed. That's what C/D printed. Don't build an explanation on the gap between them.

### Other checks

- **Taycan naming (brand rule):** brand.md allows a company name in the voice "only when the story is about that company's own product, never as a citation". Line 10 is about the Taycan's own gearbox and cites Porsche's own newsroom, so naming it qualifies. **Legally sensitive (named company, a product claim)**: the claim is Porsche's own description of its design, stated in the past tense. Don't add performance claims (the 260 km/h top speed, the 12,000 Nm wheel torque) without "at the wheels". The two cars in line 1 are correctly unnamed.
- **Legal flag:** line 1, line 5, line 9 describe two named-in-source cars (Dodge Daytona, Challenger Redeye) that the script leaves unnamed. Good. A viewer can still identify "797-horsepower muscle car" as the Redeye; the claims are attributed to testers and match the source.
- **Verdict summary:** one ❌ (line 11, one-line fix); lines 1, 6–9 need hedged wording. Verdict is **FAIL (BLOCKED)** until line 11 is reworded, then **PASS WITH FIXES** if the line 1, 6, 8 and 9 fixes are applied.

---

## Physics check on the agreed angle (read this first)

The angle holds, but step (2) needs one correction before the script is written, or the script will be wrong.

- **Above base speed the EV is not below its peak power. It is at it.** "Constant power region" means the motor keeps delivering its full power while its torque (the push) falls as speed rises (A1, A2). A gas car at full throttle in the right gear is also near its peak power, and its push also falls with speed. That's what the gears are for (B1, B2). So above about 25 to 37 mph **both** cars' pushes fade. What decides the race there is power for the weight, not torque.
- **The EV's real head start is below base speed.** From 0 rpm the motor gives its maximum torque, and it keeps giving it up to base speed. Peer-reviewed sources put that "usually" around 40 to 60 km/h **[≈ 25 to 37 mph]** (A1). A gas engine "cannot produce torque at zero speed" (B1). It has to slip a clutch or converter, rev up, wait for the turbo and shift (B3). Above base speed the EV has no special edge.
- **What actually makes an EV fade more than a gas car at high speed** (each one sourced below):
  1. Its peak power is often a **timed boost**: Audi says 390 kW "for roughly 2.5 seconds" with launch control (E2). Car and Driver: 670 hp in launch mode, "drops to 630 hp" otherwise (C1).
  2. Above the constant-power range, the motor's power itself falls (third region, A3). One fixed gear also caps top speed where the motor runs out of rpm (D1, D3).
  3. Heat, a cold battery or a low charge cut power (F1, F2).
- **Safe one-line version for the script:** "Past about 30 miles an hour, the motor hits its power limit, so its push shrinks as you go faster. A gas car's push shrinks too, but its gears keep the engine near its best speed."
- **Unsafe:** "the EV loses power above base speed while the gas car keeps its peak power". That's wrong as worded. Also unsafe: "EVs are slower at highway speed" as a general rule (C2 shows an everyday pair that's even).

The neatest true surprise that falls out of this: **an electric motor already makes, by itself, the curve that a gas car needs 7 to 10 gears to approximate** (A2 + B2 + D2). See § Surprise and hooks.

---

## Index: claims the script is likely to make

| # | Claim | Status | Entry |
| --- | --- | --- | --- |
| 1 | An electric motor gives its maximum torque from standstill (0 rpm) and holds it up to a "base speed" | ✅ | A1, A2 |
| 2 | Base speed in real cars is usually around 40–60 km/h [≈ 25–37 mph] | ✅ attributed ("usually", one peer-reviewed paper) | A1 |
| 3 | Above base speed the motor is power-limited: power stays about constant and torque falls as speed rises | ✅ | A1, A2, A3 |
| 4 | Why: the spinning motor makes its own opposing voltage (back-EMF), and once that meets the supply voltage, current (and torque) can't rise | ✅ (MathWorks + university paper) / 🟡 plain-English wording | A2 |
| 5 | At even higher speed, power itself falls (a third region) | 🟡 (induction-motor paper; not EV-specific) | A3 |
| 6 | A gas engine can't make torque at zero rpm and makes its peak power at one engine speed | ✅ | B1 |
| 7 | Gears let a gas engine approximate constant power ("traction hyperbola"); more gears approximate it better | ✅ | B1, B2 |
| 8 | More gears let the engine run near peak efficiency more often (EPA) | ✅ | B2 |
| 9 | Share of new US vehicles with 7+ gears: 55.6% in MY2024; CVT 28.6% | 🟡 (table value read by tool; re-check) | B2 |
| 10 | 9- and 10-speed transmissions: 31% of new US light trucks in MY2020 | ✅ attributed (DOE/EPA, 2020 preliminary) | B2 |
| 11 | Turbo gas engines are slow to respond at low rpm, off the line | ✅ (Car and Driver, MotorWeek) | B3 |
| 12 | Electric muscle car beat a 797-hp gas car to 60 mph (3.3 vs 3.6 s), lost to 100 mph (8.0 vs 7.8 s), quarter-mile trap 119 vs 125 mph | ✅ attributed (Car and Driver 2025); fairness caveats | C1 |
| 13 | An everyday same-model pair: EV and turbo gas Kona both 0–60 in 7.0 s, quarter-mile 15.5 s; trap 92 (EV) vs 89 mph | ✅ (MotorWeek) | C2 |
| 14 | Most EVs have a single-speed fixed reduction gear (e.g. 9:1 in one popular sedan) | ✅ | D1, D2 |
| 15 | Single fixed gear means top speed is capped by the motor's maximum rpm | 🟡 (reputable press reasoning, no maker statement) | D3 |
| 16 | Two-speed rear gearbox: first gear about 15:1 for launch, second about 8:1 for efficiency and high-speed reserves | ✅ (Porsche, Audi) | E1, E2 |
| 17 | Some EVs' peak power is a short boost (2.5 s; 10 s push-to-pass) | ✅ (Audi) / 🟡 (Porsche dealer page) | E2, E3 |
| 18 | Repeated hard driving / heat reduces power; a 2016 instrumented track test saw about half power | 🟡 (old, one test) | F1, F2 |
| 19 | Myth: EVs have no gears | ❌ myth (they have a reduction gear) | D2, G |
| 20 | Myth: EVs are always quicker | ❌ myth | C1, C2, G |

---

## A. How an electric motor's push changes with speed

### A1. Full torque from standstill up to a base speed, then roughly constant power; base speed is usually 40–60 km/h

- **Script (likely):** "An electric motor gives its hardest push from the moment the wheels start turning, and it keeps that push up to about 30 miles an hour."
- **Status:** ✅ verified (researcher, tool-quoted; re-quote) for the shape. ✅ **attributed** for the number: "usually around 40–60 km/h" is one peer-reviewed paper's generalisation. Spoken "about 30 miles an hour" is a fair midpoint of [25–37 mph]. Better: "somewhere around 30 miles an hour" or "around 25 to 35 miles an hour". It varies by car and isn't a spec.
- **Source:** [Battery Electric Vehicles: How Many Gears? A Technical–Economic Analysis](https://www.mdpi.com/2624-8921/6/1/3), Bertucci E, Bucchi F, Ceraolo M, Frendo F, Lutzemberger G., *Vehicles* (MDPI) 6(1):71–92, published online 2023-12-25 (accessed 2026-10-24)
- **Quote (tool):** "In the red part of this maximum torque, the curve is roughly a constant power curve, while at low speeds, it is constant." / base speed "in actual vehicles, it usually corresponds to around 40–60 km/h" / "The natural torque characteristic of BEVs makes it possible for them to use a single-speed mechanical transmission"
- **Note:** The base-speed sentence was returned only in part (it's over the tool's quote limit). Re-open and give the full sentence.

### A2. Why the push falls: back-EMF meets the supply voltage

- **Script (likely):** "As the motor spins faster, it starts acting like a generator pushing back against the battery. Past a certain speed, the battery can't force any more current in, so the push shrinks."
- **Status:** ✅ verified (researcher, tool-quoted) for the mechanism (MathWorks engineering docs). 🟡 for the plain-English "generator pushing back" image, which is ours. It's physically correct (back-EMF *is* generated voltage), but no opened source words it that way. The motorauthority explainer (secondary, not for citation) says the same in plain words. **Overlap check with No. 006:** No. 006 explained the motor *as a generator when braking*. Here it's the motor's own voltage *while driving*. They are different, but the "generator" word may echo. The scriptwriter could say "the motor makes its own voltage that fights the battery's" instead.
- **Source:** [Field-Weakening Control (with MTPA) of PMSM](https://www.mathworks.com/help/mcb/gs/field-weakening-control.html), MathWorks, Motor Control Blockset documentation, undated (accessed 2026-10-24)
- **Quote (tool):** "the maximum speed, also known as base speed, is determined by the stator voltages, rated current, and back EMF." / "Therefore, the motor operates in the constant torque region until the base speed." / "Above the base speed, the motor operates in the constant power region with a limited torque." / "the back EMF exceeds the supply voltage, preventing speedup." / field weakening "extends the operating speed range of motor beyond its base speed by reducing the back EMF."
- **Source (university course, the ideal curve):** [Module 2: Dynamics of Electric and Hybrid vehicles, Lecture 4: Vehicle Power Plant and Transmission Characteristics](https://archive.nptel.ac.in/content/storage2/courses/108103009/module2/lec4/2.html), NPTEL archive (India's national online engineering courses), course 108103009, undated; the page names no institution or author (accessed 2026-10-24)
- **Quote (tool):** "the ideal performance characteristic of a power plant is constant power output over the full speed range" / "the torque varies hyperbolically with respect to speed" / "In practice however, the torque is constrained to be constant a low speeds." [sic] / "In hybrid and electric vehicle technology, the electric motor is used."
- **Secondary (lead only, don't cite):** [How do electric cars produce maximum torque instantly?](https://www.motorauthority.com/news/1111678_how-do-electric-cars-produce-maximum-torque-instantly), Motor Authority, 2017-07-23: "The faster the motor spins, the more back EMF is created, reducing the effective voltage it can deliver." Also evkx.net (dictionary). Both are leads only.
- **What limits it (Q1):** The three limits are (a) voltage: back-EMF vs battery/DC-bus voltage, which sets base speed (MathWorks: "stator voltages … back EMF"); (b) current: the inverter's and motor's current rating, which sets the flat torque level ("rated current", MathWorks); (c) battery power: low charge or temperature cuts power (F2; ORNL TM-2000/130 notes supply voltage falls "as the battery discharges", a lead). (c) is ✅ only via F2.

### A3. A third region: at very high speed, power itself falls

- **Script (likely):** Probably not spoken directly. It supports "and near its top speed the motor runs out of breath altogether".
- **Status:** 🟡. The source is a university conference paper on traction **induction** motors (one motor type). Permanent-magnet motors, the most common in EVs, have an analogous voltage-limited fall-off, but I didn't open an EV-specific source that says so.
- **Source:** [Design Strategy of Traction Induction Motors](https://research.ee.sun.ac.za/emr/staff/rwang/papers/SAUPEC_Masuku_2019.pdf), Masuku TM, Wang R-J, Botha MC, Gerber S., Proc. 27th SAUPEC, Stellenbosch University, 2019-01 (accessed 2026-10-24)
- **Quote (tool):** "The constant power region is entered when the supply frequency continues increasing while the voltage is at maximum" / "This decreases the output torque inversely to the angular velocity and the output power remains constant." / "For the slip limited region the machine operates at breakdown slip to maximize the output torque, which results in the reduction of output power."

---

## B. Why a gas car needs many gears

### B1. A gas engine makes no torque at zero rpm and peaks at one engine speed; gears let it approximate constant power

- **Script (likely):** "A gas engine makes no push at all until it's spinning, and it's strongest in a narrow band of engine speed. That's why it needs gears."
- **Status:** ✅ verified (researcher, tool-quoted; re-quote). University course text.
- **Source:** [Module 2, Lecture 4 (page 6)](https://archive.nptel.ac.in/content/storage2/courses/108103009/module2/lec4/6.html), NPTEL archive, course 108103009, undated (accessed 2026-10-24)
- **Quote (tool):** "Unlike the electric motors, the internal combustion engine cannot produce torque at zero speed." / "The internal combustion engine produces maximum power at a certain engine speed." / "if the full load engine power Pmax were available over the whole speed range, the traction hyperbolas shown in Figure 7 would result." / "The output converter must convert the characteristics of the combustion engine in such a way that it approximates as closely as possible to the ideal traction hyperbola" / "increasing the number of gears gives a better approximation of the effective traction hyperbola"
- **Note:** This is the core of the surprise. The "ideal traction hyperbola" a gearbox tries to approximate is constant power, which is the shape the electric motor makes by itself above base speed (A1, A2). "Narrow band" is our paraphrase of "maximum power at a certain engine speed" (🟡 wording).

### B2. More gears: the engine runs near its best speed more often; how many gears US cars have

- **Script (likely):** "That's why many new gas cars have eight, nine, even ten gears: each shift drops the engine back to where it's strongest."
- **Status:** ✅ verified for the purpose (EPA, DOE/EPA). For the counts: ✅ attributed for 9–10 speed = 31% of US light trucks in MY2020 (preliminary). 🟡 for MY2024 "7+ gears 55.6%" (a table value the tool read from the full PDF; re-check the table and its base). "Eight, nine, even ten gears" as a plain description of common transmissions is fair, but a specific share needs one of the numbers above with its scope. No source opened gives an "8-speed" share. Note: EPA's purpose sentence is about **efficiency**. The **performance** purpose (staying near peak power) is B1.
- **Source:** [The 2025 EPA Automotive Trends Report: Executive Summary (EPA-420-S-26-001)](https://www.epa.gov/system/files/documents/2026-02/420s26001.pdf), US EPA, 2026-02 (accessed 2026-10-24)
- **Quote (tool):** "Transmissions that have more gear ratios, or speeds, allow the engine to more frequently operate near peak efficiency." / categories: "transmissions with seven or more discrete speeds ("7+Gears")" … "and continuously variable transmissions (CVTs)."
- **Source:** [The 2025 EPA Automotive Trends Report (EPA-420-R-26-001)](https://www.epa.gov/system/files/documents/2026-02/420r26001.pdf), US EPA, 2026-02 (accessed 2026-10-24)
- **Quote (tool):** Table 4.1, MY2024, all production: 7+ gears "55.6%"; CVT "28.6%" (table values) / "vehicles with one electric motor can be directly connected to the driveline without a traditional transmission." / "some manufacturers are producing electric vehicles with 2-speed transmissions."
- **Source:** [FOTW #1185: Nearly One-Third of All Light-Duty Trucks and 7% of Cars Produced in Model Year 2020 had 9- or 10-speed Transmissions](https://www.energy.gov/eere/vehicles/articles/fotw-1185-may-10-2021-nearly-one-third-all-light-duty-trucks-and-7-cars), US DOE Vehicle Technologies Office, 2021-05-10, data from the 2020 EPA Automotive Trends Report (preliminary) (accessed 2026-10-24)
- **Quote (tool):** "The number of transmission speeds in new light-duty vehicles has been growing over the last four decades." / "The share of new light-duty truck transmissions in the 9- and 10-speed category grew to 31% in model year 2020."
- **Source:** [Advanced Transmission Technologies](https://fueleconomy.gov/feg/tech_transmission.shtml), fueleconomy.gov (US DOE/EPA), undated (accessed 2026-10-24)
- **Quote (tool):** "Adding gears allows your engine to operate at a more efficient speed more often."

### B3. Off the line, a turbo gas engine needs time to wake up

- **Script (likely):** "At the light, the gas engine has to rev up, wait for its turbo and shift, while the motor is already pushing as hard as it can."
- **Status:** ✅ verified (researcher, tool-quoted) for one turbo car, from two independent testers. Fair as an illustration, not a rule for every gas car ("a turbo engine" or "many gas engines").
- **Source:** [2018 Hyundai Kona: Engine and Transmission](https://autos.yahoo.com/engine-transmission-200000841.html), Drew Dorian, Car and Driver (syndicated on Yahoo Autos), 2018-06-07 (accessed 2026-10-24)
- **Quote (tool):** "The turbocharger needs time to come online at lower engine speeds, where its gusto is merely adequate." / "it stumbles at low speed in parking lots and in bumper-to-bumper traffic"
- **Source:** [2018 Hyundai Kona](https://motorweek.org/road_tests/2018-hyundai-kona), MotorWeek (PBS), 2018-09-20 (accessed 2026-10-24)
- **Quote (tool):** "things are a little slow to get going" / "the little turbo eventually wakes up, and starts delivering power with a purpose" / "1.6-liter and DCT team is quite competent if still a little sluggish off the line."

---

## C. Real test numbers

### C1. An electric muscle car beat a 797-hp gas car to 60 mph, then lost by 100 mph (Car and Driver, 2025)

- **Script (likely):** "When testers raced a 670-horsepower electric muscle car against a 797-horsepower gas one, the electric car got to 60 first, 3.3 seconds to 3.6. By 100 miles an hour, the gas car was ahead."
- **Status:** ✅ verified (researcher, tool-quoted; re-quote) **as attributed** ("testers"). **Fairness caveats the script must respect:** (a) not a power-matched pair: 670 vs 797 hp; (b) the EV is all-wheel drive and the gas car rear-wheel drive. C/D itself notes the EV's "advantage of an all-wheel-drive launch", so part of the early win is traction, not only the motor curve; (c) the surface of the first gas-car run isn't stated (fact-check 2026-10-24; the earlier "different surface" was an inference); a second gas car tested on the EV's surface did 3.8 s to 60 and an 11.6 s quarter at 128 mph; (d) the EV's 670 hp is a launch-mode figure (630 hp otherwise); (e) quarter-mile time: EV 11.7 vs 11.8 s, so the EV still won the quarter by a hair, while the gas car crossed faster (125 vs 119 mph). So say "got to 60 first … the gas car was faster by the end of the quarter mile" or "by 100", **not** "the gas car won the race". **Company rule:** both cars are one maker's products and the story is about them, so naming may qualify under brand.md, but it's not necessary. Unnamed reads fine ("an electric muscle car"). **Flag for owner.**
- **Source:** [Dodge Charger Daytona EV Hits 60 MPH Quicker Than a 797-HP Hellcat](https://www.aol.com/dodge-charger-daytona-ev-hits-130000981.html), Dan Edmunds, Car and Driver (syndicated on AOL), 2025-03-10 (accessed 2026-10-24)
- **Quote (tool):** "Yet, the 670-hp Daytona Scat Pack's 60-mph time of 3.3 seconds outruns the" … "797-hp Challenger Hellcat Redeye's time of 3.6 seconds" / "Besides, after that, the story is mostly Redeye, as 100 mph comes in 7.8 seconds versus the Scat Pack's 8.0 seconds." / "The quarter-mile goes to the Scat Pack—barely, 11.7 to 11.8 ticks." / "But the velocity is all Redeye, 125 mph to 119 mph." / "That's because the Daytona poops out at 136 mph, while the Hellcat is good for a claimed 203 mph." / second Redeye: "its 60-mph time was slower at 3.8 seconds" … "its 11.6-second quarter-mile at 128 mph outgunned the electric two-door." / "The Daytona, on the other hand, delivers its full 670 hp in launch mode," … "but that drops to 630 hp unless you hit the overboost PowerShot button on the steering wheel." / "Of course, the Scat Pack has the advantage of an all-wheel-drive launch…"
- **Note:** Measured weights (tool, re-quoted 2026-10-24): "On our scales, it weighed five thousand nine hundred and twenty-five pounds." (EV) / "the Challenger's relatively trim 4514-pound mass." (gas car). Difference **[1,411 lb]**. Also re-quoted: "It's hardly fair" (C/D's own caveat). Watch the trap reasoning: C/D attributes the trap gap to the EV's low top speed (136 mph). That matches D3 (one fixed gear, top speed capped), but C/D doesn't say "single gear". The Drive (D3) does, for this car.

### C2. Everyday pair, same model: electric and turbo-gas Kona are dead even to 60 and over the quarter mile (MotorWeek)

- **Script (likely):** Fairness line, optional: "In an everyday pair, the same small SUV with a battery or a turbo engine, testers measured the same 7.0 seconds to 60."
- **Status:** ✅ verified (researcher, tool-quoted) for the numbers. **This pair does NOT show the fade.** The EV crossed the quarter mile slightly faster (92 vs 89 mph). It's useful as an honest counterweight, and it backs the myth "EVs are always quicker" (they aren't; here it's a tie), but don't use it as evidence for "the EV fades". Different model years (2019 EV vs 2018 gas, AWD gas test car per C/D, drivetrain not stated by MotorWeek). No 0–30 split was found for this pair (Car and Driver and MotorTrend test pages weren't reachable; Consumer Reports is paywalled).
- **Source:** [2019 Hyundai Kona Electric](https://www.motorweek.org/reviews/road_tests/2019-hyundai-kona-electric), MotorWeek (PBS), 2019-08-29 (page metadata), Episode 3852 (accessed 2026-10-24)
- **Quote (tool):** "Getting to 60 took just 7.0-seconds; with the ¼-mile pass, at 15.5 at 92 miles-per-hour." / "Going full throttle right away, will cause the fronts to spin up quite a bit."
- **Source:** [2018 Hyundai Kona](https://motorweek.org/road_tests/2018-hyundai-kona), MotorWeek (PBS), 2018-09-20 (accessed 2026-10-24)
- **Quote (tool):** "Upper trims get a smaller but mightier 1.6-liter I4 turbo that rates 175-horsepower and 195 lb-ft. of torque. It works with a 7-speed EcoShift DCT." / "shuttling us to 60 in a good 7.0-seconds flat." / the quarter-mile run "took 15.5-seconds at 89 miles-per-hour."
- **Note:** "the fronts spin up" is a useful detail: at launch the limit is often tire grip, not the motor. Car and Driver's own test of the gas Kona Ultimate AWD measured 6.6 s to 60 ([C/D via Yahoo, 2018-05-07](https://autos.yahoo.com/2018-hyundai-kona-1-6l-210900904.html): "reached 60 mph in 6.6 seconds"). Don't mix testers in one comparison.
- **Rejected pair:** Volvo XC40 Recharge vs XC40 T5 (C/D 2021: 4.3 vs 6.3 s to 60; 30–50 mph 1.6 vs 3.4 s). The EV had far more power, so it's not a fair illustration.

---

## D. One fixed gear

### D1. Most EVs use a single-speed reduction gear; manufacturers rarely add more

- **Script (likely):** "Most electric cars have exactly one gear, and it never shifts."
- **Status:** ✅ verified (researcher, tool-quoted) as "most/almost all" via IEEE VTS and EPA (B2). "Exactly one gear" is fair for a single-speed reducer. Pedants will note there are several gear wheels inside, so "one gear ratio" is safest on screen.
- **Source:** [Multi-Speed Gearboxes for Battery Electric Vehicles](https://vtsociety.org/post/news/multi-speed-gearboxes-battery-evs), Machado FA, Kollmeyer P, Goretti Barroso D, Emadi A., IEEE Vehicular Technology Society, undated (page shows "4 years 11 months ago", so about late 2021) (accessed 2026-10-24)
- **Quote (tool):** "Electric vehicles have become increasingly popular, but so far, they have almost solely utilized single-ratio gearboxes." / "The use of multiple gear ratios has several potential benefits" … "increasing vehicle acceleration, gradeability, and top speed, and reducing overall traction system mass and volume."
- **Source:** Bertucci et al. 2023 (A1): "single-speed simplifies construction and reduces capital costs"

### D2. Typical ratio: about 9:1 (the motor turns about nine times for each turn of the wheels)

- **Script (likely):** "Inside, the motor turns about nine times for every turn of the wheels, and that ratio is fixed."
- **Status:** ✅ verified (researcher, tool-quoted) for one popular sedan (manufacturer manual). "About eight to nine to one" as typical is supported by Porsche/Audi front axles (~8:1, E1/E2) and a 7.05:1 GM hatchback (trade press reporting GM's release; 🟡). **Company rule:** don't name the sedan's maker. It's a citation, not the story.
- **Source:** [Model 3 Owner's Manual (2017–2023): Subsystems / specifications](https://www.tesla.cn/ownersmanual/2017_2023_model3/en_au/GUID-E414862C-CFA1-4A0B-9548-BE21C32CAA58.html), Tesla, owner's manual (Australian English edition, hosted on tesla.cn), undated (accessed 2026-10-24)
- **Quote (tool):** "Single speed fixed gear" / "Gearbox Ratio" "9:1"
- **Source (🟡, press report of GM's release):** [2017 Chevrolet Bolt EV's Drive Unit, Battery Detailed](https://www.automotive-fleet.com/133199/2017-chevrolet-bolt-ev-s-drive-unit-battery-detailed), Automotive Fleet, 2016-01-11 (accessed 2026-10-24)
- **Quote (tool):** "Combined with a 7.05:1 final drive ratio, it helps propel the Bolt EV from 0-60 mph in less than seven seconds."
- **Lead (🟡, secondary):** the same motor's maximum speed, "8,810 max rpm" (InsideEVs citing CNET, 2016). Don't speak it without GM's own document.

### D3. One fixed gear means the motor's maximum rpm caps top speed

- **Script (likely):** "With one gear, the car's top speed is wherever the motor runs out of revs."
- **Status:** 🟡. This is reputable press reasoning about one car, not a manufacturer statement. Physically sound (fixed ratio means wheel speed = motor rpm ÷ ratio). For a ✅, the fact-checker could accept the arithmetic from D2 with a sourced maximum motor rpm, which I didn't find in a primary source.
- **Source:** [670-HP Dodge Charger Daytona Scat Pack EV Has a 134-MPH Top Speed](https://www.thedrive.com/news/670-hp-dodge-charger-daytona-scat-pack-ev-tops-out-at-134-mph), James Gilboy, The Drive, 2024-03-05 (accessed 2026-10-24)
- **Quote (tool):** "Chiefly, it has to do with EVs' transmissions, which are almost always single-speed reduction gears." / "But like internal combustion engines, electric motors can only rev so high." / "They're less efficient at higher rpm, which is why EVs get worse range on the highway than in the city."
- **Note:** The Drive (2024, maker's claim) gives 134 mph; Car and Driver (2025, their test) gives 136 mph. If spoken, use C/D's with "testers", or say "about 135". The Drive also says the author *suspects* the car was tuned for the quarter mile. That's speculation; don't use it.

---

## E. The payoff: the two-speed gearbox

### E1. Porsche Taycan: first gear about 15:1 for the launch, second about 8:1 for efficiency and reserves at very high speed

- **Script (likely):** "That's why one sports sedan puts a second gear on its rear motor: a short first gear that turns the motor about fifteen times per wheel turn for the launch, then a long second gear for high speed."
- **Status:** ✅ verified (researcher, tool-quoted; re-quote). Manufacturer's own technical press page about its own product, so naming Porsche in the voice qualifies under brand.md ("the story is about its own product"). **Flag for owner** as the brief asked. Date: 2019 launch. A 2025 first-drive review mentions "the rear motor's two-speed transmission shifting" on the 2025 Turbo, so it appears to carry over (🟡; I couldn't open a 2024–25 Porsche document confirming it, as the newsroom PDFs returned binary). Safe tense: "uses" with the 2019 source, or "was built with".
- **Source:** [The powertrain: Pure performance](https://newsroom.porsche.com/en/products/taycan/powertrain-18555.html), Porsche Newsroom, 2019-09-04 (accessed 2026-10-24)
- **Quote (tool):** "The two-speed transmission installed on the rear axle in the Taycan is an innovation developed by Porsche." / "First gear gives the Taycan even more acceleration from a standing start," / "while the long second gear ensures high efficiency and power reserves even at very high speeds." / "Roughly 15 revolutions of the motor represent one revolution of the wheel." / "This results in a very high wheel torque of almost 12,000 Nm, which allows breathtaking acceleration from a standing start." / "First gear is mainly used in Sport or Sport Plus driving modes." / "The transmission remains in first gear for a relatively long time, then shifts into second gear with a shift overboost." / "Second gear has a ratio of around 8:1 like the transmission on the front axle." / "This enables a top speed of 260 km/h typical of a sports car and acceleration reserves at high speeds"
- **Note:** [12,000 Nm ≈ 8,850 lb-ft at the wheel; 260 km/h ≈ 162 mph]. Wheel torque includes the gear multiplication, so it's not motor torque. If spoken, "at the wheels" is essential. Better to skip the number.

### E2. Audi e-tron GT: rear two-speed, 15.6:1 and 8.2:1; front axle single gear 8.1:1; launch boost for about 2.5 seconds

- **Script (likely):** Supports E1. The "boost for 2.5 seconds" fact can support the fade beat: "and its full power only comes in a boost that lasts a couple of seconds."
- **Status:** ✅ verified (researcher, tool-quoted; re-quote) for the ratios, the front single gear and the boost length. **Inconsistency to resolve:** the Audi media page as returned says "If the driver decides against this, the car moves off in **first** gear", while Audi's technology portal says "the e-tron GT moves off in **second** gear". The second reading is the logical one (choosing *against* first gear). Treat "starts in second unless the driver wants first" as ✅ from the technology portal only, and don't quote the media-page sentence. **Company rule:** a second maker's product. Naming both in the voice isn't needed; "some fast electric cars" covers it.
- **Source:** [Drive and recuperation (Audi e-tron GT quattro and RS e-tron GT)](https://www.audi.com/en/emotive-design-and-revolutionary-technologythe-audi-e-tron-gt-quattro-and-the-audi-rs-e-tron-gt-2021-13655/drive-and-recuperation-13780), Audi MediaCenter, 2021-03-03 (accessed 2026-10-24)
- **Quote (tool):** "The second gear (ratio of 8.2:1) provides excellent efficiency and also large amounts of reserve power." / "The first gear, which has a very short ratio of 15.6:1, ensures spirited acceleration right from the start" / "The front motor is installed coaxially and has a ratio of 8.1:1." / "Up to 390 kW (530 PS) are available for roughly 2.5 seconds in boost mode via launch control." / "Both values apply for boost with launch control, which the driver can access in "dynamic" mode"
- **Source:** [Audi RS e-tron GT: Drive concept](https://www.audi-technology-portal.de/en/drivetrain/electric-drives/rs-e-tron-gt-antriebskonzept-en), Audi Technology Portal, 2021-02 (accessed 2026-10-24)
- **Quote (tool):** "The close-ratio first gear ensures spirited acceleration right from the start, if the driver so desires." / "If they choose not to use first gear, the e-tron GT moves off in second gear." / "Generally speaking, the long-ratio second gear improves efficiency and also provides large amounts of reserve power."

### E3. Peak power as a short boost (push-to-pass)

- **Script (likely):** Probably not spoken. Supports "full power comes in short bursts".
- **Status:** 🟡. A Porsche dealer's news page (manufacturer-affiliated, undated), not the newsroom.
- **Source:** [Porsche unleashes the new Taycan](https://dealer.porsche.com/gb/porschecentrebristol/en-GB/News-and-Events/News/Porsche-unleashes-the-new-Taycan), Porsche Centre Bristol (UK dealer site), undated (accessed 2026-10-24)
- **Quote (tool):** "a boost of up to 70 kw, depending on the model, can be called upon for 10 seconds at the touch of a button."

### E4. Why a second gear helps, in research terms

- **Status:** ✅ attributed (peer-reviewed). Supports "a second gear makes it both quicker and more efficient".
- **Source:** Bertucci et al. 2023 (A1)
- **Quote (tool):** multi-speed "can be used to make it operate at points with larger efficiencies" / "it also increases dynamic performance (i.e., acceleration between 0 and 100 km/h)" / "the advantages in terms of efficiency overcome the disadvantages due to the additional capital costs"
- **Note:** The paper also reports a case where a ratio chosen for efficiency cut acceleration ("the improvement in efficiency led to a significant reduction in the vehicle's acceleration"). That's the single-ratio compromise in one line, if the script needs it.

---

## F. Heat and charge derating (optional beat, brief: "only if strongly sourced")

**Verdict: not strong enough for a spoken claim about EVs in general. Recommend cutting it, or one attributed, past-tense line at most.** Evidence: one instrumented track test (2016, one car), one maker's manual (hill climbing, not launches), and one maker's claim that its car *doesn't* fade (which implies fade is a known engineering problem but proves nothing about others).

### F1. A 2016 instrumented track test: an electric sedan cut to about half power within a lap

- **Script (likely, if used):** "When testers took an early electric sedan around a race track in 2016, it cut its own power by about half to protect the battery."
- **Status:** 🟡 (old, one car, a track lap, not repeated launches). ✅ only as attributed and in the past tense.
- **Source:** [Between a Watt and a Hot Place: We Lap the Tesla Model S P85D at VIR!](https://autos.yahoo.com/between-watt-hot-place-lap-123700900.html), Car and Driver (syndicated on Yahoo Autos), 2016-09-13 (accessed 2026-10-24)
- **Quote (tool):** "the 5010-pound P85D entered a reduced power mode (roughly half of the max)" / "Electric wiring resistance and losses converting maximum DC-battery watts to AC-motor horses generate a lot of heat." / "And too much heat can permanently damage the battery, so the car protects itself by limiting current flow."
- **Counterpoint (maker's claim, 🟡):** Porsche (E1 page, 2019): "Porsche is also committed to ensuring that this can also be done multiple times in succession." / "for the sprint from 0-100 km/h 10 times in succession without any problems" / "The new Taycan also proves its performance capability multiple times in succession without any drop in performance,"

### F2. Manufacturer manual: power is reduced when the system is hot, the battery is cold, or the charge is very low

- **Status:** ✅ verified (researcher, tool-quoted) for one maker's car. Good for "a low battery or a hot system can cut power" (also explains why the same EV can be quicker on some days).
- **Source:** [LEAF Owner's Manual 2023: Power limitation indicator light](https://www.nissan.com.mt/ownership/owners-manuals/manuals.html/iom/leaf/0ze1/e0/2023/power-limitation-indicator-light-1.shtml), Nissan (Malta site), 2023 (accessed 2026-10-24)
- **Quote (tool):** "When the power limitation indicator light is illuminated, the power provided to the traction motor is reduced." / "If the light illuminates when the electric vehicle system becomes hot due to continuous hill climbing" / "When the Li-ion battery available charge is extremely low." / "When the Li-ion battery temperature is very low."

---

## G. Common myths (good hook material)

| Myth | What the evidence says | Status | Entry |
| --- | --- | --- | --- |
| "Electric cars have no gears / no transmission." | Most have one fixed reduction gear (one popular sedan: "Single speed fixed gear", 9:1). Some have two. EPA: one-motor EVs connect "without a **traditional** transmission". | ✅ | D1, D2, B2, E1 |
| "EVs are always quicker than gas cars." | An everyday same-model pair tied to 60 and over the quarter mile, the EV crossing at 92 vs 89 mph (MotorWeek). A 670-hp EV beat a 797-hp gas car to 60 but was slower to 100 and crossed the quarter slower. Its top speed was 136 vs a claimed 203 mph (Car and Driver). | ✅ attributed | C1, C2 |
| "Instant torque means the push stays the same at every speed." | Full torque holds only to base speed (usually 40–60 km/h [≈ 25–37 mph]); above it torque falls. | ✅ | A1, A2 |
| "Above 30 mph the EV loses power while the gas car keeps its peak power." | Both run near peak power at full throttle. The EV's push falls because of physics (force = power ÷ speed), as the gas car's does. The gas car's gears keep it near peak power, the EV's motor does that naturally. EV-specific fades are timed boosts, very high speed, heat and charge. | 🟡 (our synthesis of A–F; the physics is standard, but no single source says it in one sentence) | Physics check |
| "Gas cars need gears because their engines are weak." | Gears exist because a gas engine makes no torque at 0 rpm and peaks at one speed. | ✅ | B1 |
| "EVs win at the light only because of the motor." | Partly traction: at launch the limit is often the tires (MotorWeek: "the fronts … spin up"), and AWD helps (C/D on the Daytona). | ✅ attributed | C1, C2 |
| "Electric motors can't rev high, so they need no gears." | The opposite. They rev high enough that one ratio covers 0 to top speed (A1: the natural characteristic "makes it possible … to use a single-speed"). A specific rpm (8,810, one GM motor) is only secondary-sourced. | ✅ / 🟡 number | A1, D2 |

---

## H. Surprise, hooks, outline, visuals

### The strongest one-sentence surprise

**"An electric motor already makes, on its own, the push curve that gas cars use eight or ten gears to imitate."** (A2: the ideal is "constant power output over the full speed range", with torque "constant at low speeds". B1: more gears give "a better approximation" of that curve. D2: the EV does it with one ratio.) Status: ✅ for each part, 🟡 for the joined sentence (our synthesis). The fact-checker should check the wording "imitate": NPTEL says "approximates", so "copy" or "get close to" is safer.

Runner-up (dated, concrete, viewer-debate fuel): "Testers found a 670-horsepower electric muscle car beat a 797-horsepower gas one to 60, then fell behind by 100." (✅ attributed, C1.)

### Hook options (≤ about 12 words, question by about 6 s)

1. **The finding (C1):** "An electric car beat a 797-horsepower muscle car to 60, then fell behind." Question: "So why does an electric car's head start fade?" Strongest "no way" for a general audience, and it invites EV-vs-gas comments without us taking a side. Needs C1's caveats (AWD, not power-matched) kept out of the hook but fair in the body ("testers").
2. **The wrong assumption (A2 + B1):** "Most electric cars have one gear. Gas cars need up to ten." Question: "So why is the one-gear car quicker off the line?" Two sentences, but each a full sentence. Checks out (D1, B2 with scope "up to ten").
3. **The lived moment (A1):** "At a red light, an electric car pushes hardest before it even moves." Question: "So why does that push fade on the highway?" 🟡 wording: "pushes hardest from standstill" is ✅; "before it moves" is poetic. Use "the instant it starts moving".

Recommendation: **1** for the hook, with **2**'s fact as the mid-video surprise (beat 5).

### Beat outline (about 45–55 s)

1. **Surprise (0–3 s):** Hook 1. Frame 0: two cut-open cars side by side at a start line, the EV a nose ahead.
2. **Specific (3–6 s):** 3.3 vs 3.6 s to 60; by 100 mph, the gas car is ahead (C1, "testers").
3. **Question (≈6 s):** "So why does an electric car's head start fade?"
4. **Answer, part 1, the launch (6–18 s):** The motor gives its full push from zero rpm. The gas engine makes no push at zero (B1), so it has to rev, slip its clutch, wait for the turbo and shift (B3). Orange push bars at the EV's tires: full height from the first frame. The gas car's bars start low and climb.
5. **Answer, part 2, the fade (18–32 s):** Around 25 to 35 mph the motor reaches its power limit. Its own voltage fights the battery's, so the push shrinks as speed climbs (A1, A2). Then the key turn: the gas car's push shrinks too. It jumps back up at each shift because gears keep the engine near its best speed (B1, B2). **Mid-video surprise:** that shrinking, stepped curve is the gas car's gears trying to copy the curve the motor makes by itself.
6. **Answer, part 3, why it falls behind (32–40 s):** At high speed it's power for the weight that counts. The EV is heavier, and its full power often comes in a short boost (E2: about 2.5 s on one car; C1: 670 hp only in launch mode). With one fixed gear, the motor eventually runs out of revs (D2, D3).
7. **Payoff (40–50 s):** That's why some fast electric cars add a second gear. First turns the motor about 15 times per wheel turn for the launch, second about 8 for high speed (E1, E2). Naming Porsche is allowed (own product); **flag for owner**.
8. **Turn it back (50–55 s):** Something to notice: "Next time an electric car leaves you at a light, watch whether you catch up past about 30." (🟡: it depends on the cars; hedge "watch whether" keeps it a question, not a claim.) Loop back to frame 0's start line.

Fairness line, if room (brand.md "In fairness"): "In fairness, in an everyday pair, testers clocked the electric and gas versions of one small SUV at the same 7.0 seconds to 60." (C2)

### Visual ideas (The Section)

- **Reuse from No. 006 (`src/scenes/CarSliceScene.tsx`, `variant: 'ev'`; `src/three/real/EvDrive.tsx`):** the cut-open drive unit (`DriveUnit`, rotor and final gear), the battery pack (`BatteryPack`), the pedal box with the foot pressing the accelerator (`PedalBox`, the scene's `foot` prop with `pose: 'accel'`), speed keys (`driving`, `MPH60_REVS`) and the cluster power meter. Change the system: in No. 006 the orange was regen current flowing *into* the battery; here the orange is the **push** (current out to the motor, then torque at the contact patch). Run it the other way, and don't reuse the brake/disc framings or the brake-light signal (No. 006's topic).
- **`rotorRatio` is already a prop (default 3, 🎭 because the real ≈ 9 would strobe).** For D2's "nine turns per wheel turn", use a slow-motion beat at low speed where the real 9:1 can be shown without strobing, with a counter. Visual-reviewer to check.
- **New slice needed (brand: no slices reused unchanged):** a gas car cut open beside the EV, showing a generic inline-four with a turbo and a multi-speed gearbox. Gears shown as stacked gear pairs, the active pair lit orange and stepping down a pair at each shift. No brand shapes (brand.md: a generic sports sedan, not a Taycan or Charger silhouette).
- **Torque/power as orange bars on the tires** (one per car, at the contact patch), shrinking and rising in real time with the speed keys. The single on-screen card at beat 5 is a **chart in the detail box**: speed on the x-axis, push on the y-axis, the EV's line flat then curving down (orange), the gas car's sawtooth (ink, not orange; orange is reserved for the hidden system, which here is the push in *both* cars. **Decision for the director:** either both cars' push is orange, or only the EV's. Brand logic suggests both, since it's "the system").
- **Back-EMF beat:** inside the cut-open motor, the battery's orange current arrow meets a counter-arrow growing with rotor speed (ink or hatched, not a second colour) until the orange arrow can't grow. One idea per frame.
- **Payoff:** a generic two-speed rear drive unit cut open, the planetary set for first gear lit, then a shift to the spur stage (second). Taken from Porsche's description: "three shafts", "a shiftable planetary gear set".
- **Start line / drag strip** as a new location (two lanes, a Christmas-tree light as a generic prop, no logos), framed as a slice from outside. The end shot loops to this frame 0.
