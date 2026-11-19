# Sources: ev-oil (No. 021)

Researcher draft, 2026-11-19. There's no script yet, so the claims follow the owner-approved story order. **Story:** a gas engine needs its oil changed because dozens of metal parts slide and spin on an oil film, and the fire inside the engine keeps dirtying that oil. An EV motor has one big moving part, the rotor, and no fire, so there is no engine oil to change. The statuses are my starting confidence. The fact-checker sets the final ones.

**Owner-approved angle (2026-11-19):** EV vs gas, why EVs need no oil change: what oil does in a gas engine and why it wears out, and why an EV motor doesn't need it.
**Hook direction:** "Your gas engine has hundreds of moving parts that need oil. An EV motor has about one." **Read section H (hook check) before scripting.** "About one" holds for the motor (the rotor). "Hundreds" is 🟡: every published count for a gas car is 200 or more, but each one counts the engine plus the transmission/drivetrain, and none is a primary engineering count. The widely shared "2,000 vs 20" is a high-end estimate from a 2016 talk, and the "20" is for a whole EV drivetrain, not the motor.

**The surprising core (my recommendation):** the number of parts is only half the reason. The other half is that **an EV still has oil**, about a quart and a half sealed in its gearbox (claims 15 and 16), and nobody schedules a change, because no fire ever reaches it. Gas-engine oil gets combustion gas, soot, water, acids and raw fuel blown into it past the piston rings (claims 6 and 7). That contrast is the hidden mechanism a viewer can picture: same job (oil on spinning metal), but one oil lives next to a fire.

Everything was accessed on 2026-11-19. **How to read the quotes** (same rules as `crash-detect/sources.md`):

- **(tool)** means the web tool's small model returned the quote from the page, and I asked for exact words. Re-open and re-quote before ✅. **(summary)** means the tool paraphrased; it is not a quote.
- **(snippet)** means I saw it only in a search-result summary and didn't open the page. It's a lead only (🟡 at best).
- **🧮** means our own arithmetic or counting.
- **Couldn't open:** tesla.com support pages and owner's manual (HTTP 403; I used Tesla's public service site, service.tesla.com, which opened); Consumer Reports articles and the CR white paper PDF (403; I used Green Car Reports' write-up of the same study); the AAA 2017 oil fact sheet and Hyundai NZ service PDF (compressed, unreadable to the tool); Axios on the Lucid motor (403); NREL PDFs (DNS failure; I used the OSTI record); the core.ac.uk piston-ring film review (403); the Petro-Canada lubricant handbook (429).
- **Not found:** a primary engineering count of moving parts in a gas engine; any statement by Ford's CEO with moving-parts numbers (secondary sites attribute it to him; the articles they cite don't); an official current US count of oil changes per year; an official Hyundai US reduction-gear interval; a Tesla source that says *why* its gearbox oil has no interval.
- **No politics.** Nothing here on climate policy, mandates, subsidies or tax credits. Claim 22 (EPA, used oil) is environmental housekeeping, optional; leave it out if in doubt.
- **Company names in the voice:** Tesla, Nissan and Chevrolet are named below only where the claim is about their own car's schedule or parts. Mazda's explainer (claim 11) is a citation; don't name Mazda in the voice.

---

## FACT-CHECK of script v1 (fact-checker, 2026-11-19)

**Verdict: FAIL (no ❌ claims, but one wording fix is required before voice: L3). Five more are optional.** Lines 1-2 (owner-approved hook) need no change. Re-opened this session (tool = the page-fetch tool's small model; exact only where marked): Tesla Model 3 public service intervals (re-quoted, exact), Tesla Model 3 service manual 4DU drain and refill (re-quoted, exact), Tesla 3DU (2024+) page (opened; the capacity did NOT come back, see L13), Spectro Scientific (re-quoted, exact), CalRecycle (exact), KBB oil-change article (exact), Machinery Lubrication GM article (exact), NAPA (exact), Explain that Stuff (exact), Mazda USA (exact, short), AFDC (exact), Green Car Reports on Consumer Reports (exact), Green Car Future and CarBuzz (exact), InsideEVs Bolt (exact), Nissan Cyprus Leaf manual (exact). Still not openable: the CR white paper (403) and Tesla's support pages (403, per the researcher).

**Legally sensitive:** Tesla is named in L13 and L15, both claims about its own car's parts and schedule, with the maker's own documents behind them (fine). L17 names no one ("one consumer study"; the study is Consumer Reports, to be named in the description only). No other company or person in the voice.

**Settled questions**

- **L1 "hundreds of moving parts" (engine and transmission).** 🟡. The scope is already in the line, which is what the researcher's hook check asked for. Counts found: Green Car Future (exact) gives "what they estimated as 200 in a conventional ICE drivetrain" and "some estimates placed at as many as 2,000 moving parts within an internal combustion engine vehicle", and says the counts depend on what qualifies as a moving part, so the figures aren't strictly comparable. CarBuzz (exact, author's own words): "roughly 2,000 moving parts". No primary engineering count exists. So "hundreds" sits inside every published estimate (200 to 2,000) but is an estimate, not a measured fact. A hedge ("an estimated") would make it ✅; none is REQUIRED because the line commits to no figure and no source contradicts "hundreds". Owner-approved, so leave it. Do not add "2,000" or "20" anywhere.
- **L2 "An EV motor has about one."** ✅. Mazda USA (exact): "only one moving part—the rotor—". Explain that Stuff (exact, induction motors): "They have only one moving part, the rotor". "About" is a fair hedge (the rotor spins on bearings). Note the asymmetry: L1 counts engine plus transmission, L2 counts only the motor, and the EV's reduction gearbox (L13) has gears of its own. L13-L14 already show the gearbox, so the line stays honest as a motor-vs-powertrain hook. Owner-approved; no change.
- **L3 "only the gas car need oil changes".** 🟡 → **REQUIRED, one word.** "Only the gas car" is an absolute about all cars. Tesla says its cars need no "traditional oil changes" (snippet), and AFDC (exact) says EVs have "fewer fluids, such as engine oil, that require regular maintenance". But some EVs do schedule a gearbox-oil replacement: Torque News (exact, secondary, one sentence) says "Hyundai's recommended 80,000-mile replacement interval for its fluid" on the Ioniq 5 (Hyundai's own PDF was unreadable, so 🟡; the researcher had also not found an official figure). The script itself says in L13 that an EV has oil. A viewer with an Ioniq 5 will object to "only". Adding "engine" makes the question exactly true and matches L12's "no engine oil to change".
- **L4 "The answer is the fire inside the engine, which slowly wears out its oil."** 🟡 (too absolute, but not wrong). Supported: combustion gas blows past the rings into the oil carrying "particles of carbon, water, acids, partially burned fuels" and the fuel "causes a loss in viscosity" (Spectro, exact). GM research (Machinery Lubrication, exact) says oil acid levels come "from oil oxidation and combustion products" and "The influence of temperature, in particular, has a marked impact on oil life". So heat (oxidation) is a second driver, and no source ranks the fire as THE reason. Oil without a fire also ages (Hyundai's 80,000-mile gearbox fluid change, above). "The answer is" reads as sole cause. Not required, because L7-L9 immediately explain the mechanism and L13-L15 concede that EV oil exists. Optional softer wording below.
- **L5 "dozens of metal parts" (our own count).** 🟡/🧮. The count in claim 9 is about 75 main moving parts for one four-cylinder engine (4 pistons, 4 rods, 4 pins, 12 rings, crank, 2 cams, 16 valves, 16 springs, 16 followers). Even the safest subset (pistons, rods, pins, crank, cams, valves: 31) is "dozens" (two dozen or more). The inputs are design norms (three rings per piston, 16-valve DOHC) and only a Toyota snippet is behind the valve count, never opened. NAPA (exact) confirms the oil reaches the main bearings, crankshaft and cylinder walls, so "slide and spin against each other" is fine. Safe because the claim is a floor, not a count. A three-cylinder engine has fewer; "dozens" still holds (about 60). Put the count in the description as "our count".
- **L6 "Oil keeps that metal from rubbing and carries the heat away."** ✅. NAPA (exact): "metal-against-metal friction, which creates heat" and oil "smooths movements and removes some heat as it flows over internal parts." Note NAPA says "reduces friction"; "keeps from rubbing" is the film idea, a plain gloss. Fine.
- **L7 piston rings and hot gas.** ✅. Spectro (exact): "Exhaust gases (blowby gases) that leak past the piston rings, valve guides and turbocharger seals into the crankcase." "Each time" is a generalization (blow-by is continuous; "a little" is right). Fine.
- **L8 soot, water, acids, unburned fuel.** ✅. Spectro (exact): "These gases contain particles of carbon, water, acids, partially burned fuels, varnish, and lacquers." "Soot" = carbon particles; Machinery Lubrication (exact): "Concentration of carbon soot and sludge." "Unburned fuel" = "partially burned fuels"; "unburned" is a fair simplification.
- **L9 additives used up fighting acids; fuel thins the oil.** ✅. Spectro (exact): "Engine oils contain additives designed to react with the acids formed and neutralize them." / "Additives will deplete to the point that the oil and additive combination can no longer satisfactorily protect the engine." / "Fuel dilution of the oil causes a loss in viscosity, resulting in severe wear and possible seizure if left unchecked." Spectro is an instrument maker, so it's fine for a mechanism, not for numbers.
- **L10 "most gas cars ... about every five to ten thousand miles".** 🟡. CalRecycle (exact): "The old standard of 3,000 miles is out of date and no longer applies to most cars." / "Many cars, even older models, can be driven up to 5,000, 7,500, 10,000, and even 15,000 miles". KBB (exact, 2025-05-27): conventional oil "approximately 5,000-7,500 miles", "Typically, synthetic oil is good for 10,000 miles or more." Toyota TSB (not re-opened): 10,000 for most 0W-20 cars. So 5-10k is the typical band, but no source gives a share, so "most" is the stretch (CalRecycle says "many" of the intervals, "most" only about the 3,000 rule). Intervals vary by manual and severe use. Not required: the band is supported. Optional hedge: "many gas cars today need fresh oil about every five to ten thousand miles" (or "typically"). The tie-in "That's why" (chemistry → interval) is a plain link, fine.
- **L11-L12 no fire; rotor in a ring of coils; no engine oil.** ✅. Explain that Stuff (exact): "the coils that make up the stator" ... "produce a rotating magnetic field, which turns the rotor (the moving part of the motor) in the space between them" (induction motor; same layout in most EV motors). Mazda (exact, paraphrase of the page): stator "includes a frame, core, and windings", rotor "sits on a shaft". AFDC (exact): "There are fewer fluids, such as engine oil, that require regular maintenance." "No engine oil to change" matches. Caveat: not every motor design has the rotor inside (outer-rotor and wheel motors exist); "ring of coils" is the common case and a picture, 🟡 only for that. Fine.
- **L13 "about two liters in a Tesla Model 3's rear gearbox".** ✅ for the 2017-2023 Model 3; 🟡 for 2024 and later. Tesla service manual, 4DU, page dated 2026-09-24 (exact): "The rear drive unit requires 2.3L/2300mL of fluid, however the excess fluid will prevent underfill and air entrapment." The page header lists the 2017-2023 Model 3 manual and notes it is a draft that may be missing cautions. The 2024+ page (3DU, 2026-08-09) says only "Drain and refill the rear drive unit gearbox fluid according to the oil pump procedure." with no capacity in the part I could read; the researcher's "minimum refill 2.1 liters" is a search snippet only. So the current-model figure is unconfirmed here, but 2.1 to 2.3 L both round to "about two liters". Is "about two" fair for 2.3? Yes: 2.3 L is within about 15% of 2, and the viewer hears an order of magnitude (a couple of quarts; 2.3 L is 2.4 US quarts). "About two and a quarter" is more exact but needless. Tesla calls it "gearbox fluid" (KAF1) and the manual uses "oil pump"; "oil" is a fair word (Electrek caption: "Model 3 drive unit oil filter"). "Rear gearbox" is right (an AWD Model 3 also has a front unit with its own fluid; the line says "rear", so it holds). The source is a service manual, current (revised Sept 2026). Optional: say "a Tesla Model 3's rear gearbox" is fine; no change.
- **L14 "nothing burns anywhere near them".** ✅ as physics (an EV has no combustion; AFDC and the sources on blow-by in L7-L8 define the contrast). It is a statement of absence, not a quote from any source. Caveat the fact-checker is flagging for the description, not the voice: the same oil gets hot (the Tesla page's oil pump and the drive unit's oil filter and heat exchanger, claims 15 and 24), so the oil still ages, just without combustion byproducts. "Coats spinning gears" ✅ (the gearbox is a reduction gear, claim 15; Motor1 "single-speed reduction gear"). Fine as written.
- **L15 "Tesla's maintenance schedule doesn't list a change for that oil."** ✅. Tesla Model 3 public service intervals page (exact): lists brake fluid, A/C desiccant bag, cabin filter, wipers, brake calipers, tire rotation; "The page lists no interval" for gearbox/drive-unit fluid, engine oil or coolant (tool, a statement of absence; I read the full list the tool returned). The service manual has a drain-and-refill procedure (L13), so "doesn't list a change" must stay worded as "schedule", never "never needs changing" or "sealed for life". Absence claims depend on the tool reading the whole page; the page's own words are "generally be serviced on an as-needed basis" (researcher, tool). Scope: this page is for the Model 3; the script's "Tesla's maintenance schedule" follows a Model 3 line, so it is the same car. Fine.
- **L16 "brake fluid checks, cabin filters and tire rotations".** ✅. Tesla (exact): "Brake fluid health check every 4 years (replace if necessary)", "Cabin air filter replacement every 2 years (or every year in China).", "Rotate tires every 6,250 miles (10,000 km) or if tread depth difference is 2/32 in (1.5 mm) or greater". InsideEVs on the 2017 Bolt (exact): tire rotation every 7,500 miles, cabin filter every 22,500, brake fluid every 5 years, coolant flush every 150,000 miles. Two makers support "EVs still need ...", enough for a general line with "In fairness". The caliper cleaning is salt-conditioned ("if in an area where roads are salted during winter"), but L16 doesn't voice it.
- **L17 "one consumer study found EVs cost about half as much to maintain and repair".** 🟡. Green Car Reports (exact, 2020-09-25) on Consumer Reports: EV drivers are "typically saving big—an average of 50% versus equivalent gas vehicles, over the life of the vehicle." / battery EVs and plug-in hybrids "cost 3 cents a mile to maintain and repair, while other internal combustion vehicles cost 6 cents per mile." / "Vehicle lifetime, as defined by the analysis, was 200,000 miles." / "The data is based on annual surveys from hundreds of thousands of vehicle owners about real-world reliability and costs." Caveats the script drops: (1) the 3-cent figure groups battery EVs with plug-in hybrids (only 200 PHEVs had over 100,000 miles); (2) the EV sample past 100,000 miles was mostly early Nissan Leafs and Tesla Model S; (3) the article's $4,600 vs $9,200 lifetime totals don't match 3 vs 6 cents over 200,000 miles (about $6,000 vs $12,000), so don't voice dollar figures; (4) the survey is from 2020 and owner-reported; (5) Argonne (modeled, scheduled maintenance only) puts the gap at about 40% (6.1 vs 10.1 cents), and AAA 2025 shows a smaller gap with tires included, so "about half" is the high end. "One consumer study found" is honest attribution; "about half" matches the headline exactly. Not required. Optional hedge below. CR's own white paper returned 403, so this rests on a trade-press write-up; that is the reason it is not ✅. Do not name Consumer Reports in the voice unless the script wants the attribution; cite it in the description.
- **L18 "How many miles do you go between oil changes?"** Question; no claim.

**Required fixes (exact minimal wording)**

1. **L3:** "Why does only the gas car need engine oil changes?" (One word added: "engine". Reason: some EVs, e.g. the Hyundai Ioniq 5 per Torque News, do schedule a gearbox-fluid replacement, and L13 says an EV has oil. If the owner prefers the approved wording, the alternative is to leave L3 and accept that "only" is slightly overstated; this is a judgment, not a hard contradiction, because the Hyundai source is secondary.)

**Optional fixes (not required; the wording stays 🟡/✅ without them)**

- **L1** "have hundreds" → "have an estimated hundreds of" is clumsy; if the owner wants the hedge, "A gas car's engine and transmission have hundreds of moving parts, by common estimates." Owner-approved; leave as is unless the owner wants a ✅.
- **L4** "The answer is the fire" → "A big part of the answer is the fire inside the engine, which slowly wears out its oil." (Heat oxidation is a second driver, GM research; no source ranks the fire as the sole cause.)
- **L10** "most gas cars" → "many gas cars" (CalRecycle's word) or "gas cars typically".
- **L17** "found EVs cost about half as much" → "found EVs and plug-in hybrids cost about half as much" (or "found EV owners reported about half the maintenance and repair costs"). Costs 1 to 2 words; closes the scope gap.
- **L13** nothing to change; if the director wants a chip, show "2.3 L" only for a 2017-2023 Model 3 and avoid a model year on screen.
- **L5** nothing to change; put "our count: about 75 main moving parts in one four-cylinder engine" in the description.

### Line table (script v1)

| Line | Claim | Status | Fix / note |
| --- | --- | --- | --- |
| L1 | A gas car's engine and transmission have hundreds of moving parts | 🟡 | Estimates run 200 (drivetrain) to 2,000 (Green Car Future, CarBuzz); no primary count. Scope already in the line. Owner-approved, no change required. |
| L2 | An EV motor has about one | ✅ | Mazda USA and Explain that Stuff (exact): "only one moving part, the rotor". Owner-approved. |
| L3 | Why does only the gas car need oil changes? | 🟡 → required fix | **"...need engine oil changes?"** Some EVs schedule gearbox-fluid replacement (Ioniq 5 ~80,000 miles, Torque News, secondary). |
| L4 | The answer is the fire inside the engine, which slowly wears out its oil | 🟡 | Spectro (blow-by) ✅; GM research says heat/oxidation also matters. Optional: "A big part of the answer is..." |
| L5 | Inside the engine alone, dozens of metal parts slide and spin | 🟡 / 🧮 | Our count ~75 for a four-cylinder; "dozens" is a floor. Disclose "our count" in the description. |
| L6 | Oil keeps that metal from rubbing and carries the heat away | ✅ | NAPA (exact). |
| L7 | A little hot gas slips past the piston's sealing rings into the oil | ✅ | Spectro (exact): blowby "leak past the piston rings ... into the crankcase". |
| L8 | That gas carries soot, water, acids and unburned fuel | ✅ | Spectro (exact): "particles of carbon, water, acids, partially burned fuels". |
| L9 | Additives get used up fighting acids; fuel thins the oil | ✅ | Spectro (exact): additives "neutralize" acids, "will deplete", fuel dilution "loss in viscosity". |
| L10 | Most gas cars need fresh oil about every five to ten thousand miles | 🟡 | CalRecycle ("many cars" 5,000-15,000), KBB (5,000-7,500 conventional, 10,000+ synthetic). Optional: "many"/"typically". |
| L11 | An EV motor has no fire inside it | ✅ | Definitional (electric motor, no combustion); AFDC. |
| L12 | Rotor spins inside a ring of coils; no engine oil to change | ✅ | Explain that Stuff (stator coils, rotor in the space between); AFDC (exact): "fewer fluids, such as engine oil". "Ring" is the common layout, a picture. |
| L13 | An EV does have oil, about two liters in a Tesla Model 3's rear gearbox | ✅ (2017-2023) / 🟡 (2024+) | Tesla manual (exact): "2.3L/2300mL". 2024+ capacity not re-confirmed (snippet: min 2.1 L). "About two" is fair. Manual page is marked draft. |
| L14 | That oil coats spinning gears, but nothing burns anywhere near them | ✅ | Physics of absence; no combustion in an EV. The oil still gets warm (heat exchanger); the line doesn't say otherwise. |
| L15 | Tesla's maintenance schedule doesn't list a change for that oil | ✅ | Tesla public intervals page (exact list, no gearbox fluid, no coolant, no engine oil). Don't upgrade to "never needs changing". |
| L16 | EVs still need brake fluid checks, cabin filters and tire rotations | ✅ | Tesla (exact) and 2017 Bolt (InsideEVs, exact). |
| L17 | One consumer study found EVs cost about half as much to maintain and repair | 🟡 | CR via Green Car Reports (exact): 50%, 3 vs 6 cents; groups BEVs with plug-in hybrids; owner survey (2020); CR PDF 403. Optional: "EVs and plug-in hybrids". |
| L18 | How many miles do you go between oil changes? | n/a | Question. |

---

## Re-check of script v4 (fact-checker, 2026-11-19)

**Verdict: PASS (no ❌). No required fixes. Two optional.** Script v4 is 20 lines (line numbers shift by two from v1 after L7; below I use the v4 numbers). Re-opened Spectro Scientific this session (tool, exact quotes below). Earlier v1 required fix (engine oil in L3) and optional hedges (L4 "a big part", L10 "many") are already in v4. Legally sensitive: unchanged (Tesla in L15 and L17, claims about its own car and schedule, sourced to Tesla's own documents).

| v4 line | Claim | Status | Ruling |
| --- | --- | --- | --- |
| L4 "A big part of the answer is combustion." | Combustion is a major cause of oil wear | ✅ | Hedged ("a big part"); GM research (heat/oxidation also matters) is consistent. "Combustion" is more accurate than "fire". |
| L5 "The fuel burning inside the engine slowly wears out its oil." | Combustion byproducts degrade the oil | ✅ | Spectro (exact): blow-by gases "contain particles of carbon, water, acids, partially burned fuels, varnish, and lacquers"; additives "will deplete to the point that the oil and additive combination can no longer satisfactorily protect the engine." "Slowly wears out" is a fair gloss; L4 carries the hedge. |
| L8 "...a little hot gas leaks past the piston and down into the oil." | Blow-by | ✅ | Spectro (exact): "Exhaust gases (blowby gases) that leak past the piston rings, valve guides and turbocharger seals into the crankcase." Gas does pass the piston, through the ring gap between piston and cylinder wall; "down into the oil" = into the crankcase. Broader than the source in a harmless way (it drops "rings" but loses no accuracy). "Each time the fuel burns" is a generalisation (blow-by is continuous), same as v1; "a little" is right. |
| L9 "That gas is dirty." | Plain gloss | ✅ | Follows from L10's list. |
| L10 "It carries soot, water, acid and bits of unburned fuel." | Contents of blow-by | ✅ | Spectro (exact): "particles of carbon, water, acids, partially burned fuels". Soot = carbon; "bits of unburned fuel" = "partially burned fuels", a fair simplification. Singular "acid" vs source's "acids": harmless. |
| L11 "Over time, the acid uses up the oil's protective additives, and the fuel makes the oil thinner." | Additive depletion and fuel dilution | ✅ | Spectro (exact): "Engine oils contain additives designed to react with the acids formed and neutralize them." / "Fuel dilution of the oil causes a loss in viscosity, resulting in severe wear and possible seizure if left unchecked." The page ties depletion mainly to acids (also nitration acids and glycol acids). Caveat: other things also load the additives (soot overloads dispersants, per Spectro), so "the acid uses up the additives" is the main mechanism, not the only one. Not wrong as worded; it never says "only". |
| L13 "An EV motor has no combustion." | Absence of combustion | ✅ | Definitional (electric motor). AFDC (exact): "fewer fluids, such as engine oil, that require regular maintenance." |

**Required fixes: none.**

**Optional (only if the owner wants a tighter match; none is needed)**

- **L8 "past the piston"**: fair as written. The exact-source version is "past the piston rings", which the owner just removed for clarity. Keep v4.
- **L11 "the acid uses up the oil's protective additives"**: fair; do not broaden. If the owner wants the hedge, "the acid wears down the oil's protective additives" or "...uses up the oil's additives" says no more than the source; "fighting" was the v1 wording and is also supported. A broader line ("dirt and acid use up the additives") would be less supported by Spectro, which names acid for depletion and soot only as an overload.

**Description note (unchanged):** cite Spectro Scientific for L8 to L11 and say "engineers call this blow-by".

---

## H. Hook check: "Your gas engine has hundreds of moving parts that need oil. An EV motor has about one."

| Part | Evidence | Status |
| --- | --- | --- |
| "Your gas engine has hundreds of moving parts" | Every count I found for a gas car is 200 or more, but always for the engine plus transmission/drivetrain, and never a primary count: Tony Seba (2016 talk, relayed): "Typical ICE vehicle has 2000+ moving parts"; the relaying article says he "uses the high-end estimate" and mentions a lower estimate of 200 (claim 10). CarBuzz 2022 (author's own words, unattributed): "roughly 2,000 moving parts" (claim 10). A widely shared line that Ford's CEO said "as many as 2,000" is a misattribution (claim 10). Our own count for one four-cylinder engine's main moving parts (pistons, rods, pins, rings, crank, cams, valves, springs, followers) is about 75 before chain links and pumps (🧮, claim 9). | 🟡. "Hundreds" is fair for "the engine and transmission together", not for the engine alone. Safer: "Your gas car has hundreds of moving parts in its engine and transmission" or "dozens of metal parts sliding and spinning". ❌ for "2,000" spoken as fact. |
| "...that need oil" | Engine oil reaches the main bearings, crankshaft, rods, cylinder walls, camshaft and timing chain (NAPA, claim 2). The transmission has its own fluid, not engine oil. | ✅ for engine parts. If the hook counts the transmission too, "need oil" stays true only loosely (transmission fluid is an oil, but it's a separate fluid and not what an "oil change" changes). |
| "An EV motor has about one" | "only one moving part, the rotor" (claim 11; Explain that Stuff on induction motors, Mazda on EV motors). Bearings have balls that roll, and the motor turns a reduction gear with its own oil (claims 15 and 16). | ✅ for "the motor has one big moving part, the rotor". "About one" is a fair hedge. Don't stretch it to "the whole EV has one moving part" or "an EV has 20 moving parts" as fact. |

**Verdict:** keep "about one" for the motor. Change "hundreds of moving parts" in one of two ways: scope it ("hundreds of moving parts in its engine and transmission", 🟡, no number) or make it countable ("dozens of metal parts sliding and spinning on a film of oil", ✅/🧮). The comparison is then honest: a gas powertrain against an EV *motor*, which is exactly what the hook compares. Hook variants are at the end.

## B. Beliefs to bust (myths)

1. **"EVs need no maintenance at all."** No. Tesla's own schedule lists a brake-fluid check every 4 years, cabin air filter every 2 years, wipers every year, tire rotation every 6,250 miles, and brake-caliper cleaning in salted-road areas (claim 17). The Chevy Bolt's 2017 schedule had a coolant flush at 150,000 miles and brake fluid every 5 years (claim 18). KBB: Teslas can wear tires faster (claim 19). ✅ The fair line: far less maintenance, not none.
2. **"EVs have no oil."** No. The gearbox holds oil: Tesla's service manual has a drain-and-refill procedure for 2.3 L of gearbox fluid in a Model 3 rear drive unit, with an oil pump and filter (claim 15); a 2025 Nissan Leaf takes 1.4 L of reduction-gear fluid, an automatic-transmission fluid (claim 16). What EVs don't have is *engine* oil. ✅
3. **"Change your oil every 3,000 miles."** Outdated for most cars. California's state recycling agency: "The old standard of 3,000 miles is out of date and no longer applies to most cars"; many cars go 5,000 to 15,000 (claim 8). Toyota extended most 0W-20 cars to 10,000 miles in 2013–14 (claim 8). Follow the owner's manual or the oil-life monitor. ✅
4. **"The oil-change light tests your oil."** On GM's system, no: it estimates oil life from engine revolutions and operating temperature, with no oil sensor (claim 8, GM research via Machinery Lubrication). ✅ for GM; 🟡 as a claim about every maker.
5. **"2,000 moving parts vs 20."** It's a high-end estimate from a 2016 talk, and the "20" counts a whole EV drivetrain (claim 10). Shared online as a Ford CEO quote, but the articles cited don't have him saying it. 🟡 as attributed; ❌ as a fact.
6. **"One moving part means nothing wears."** The rotor spins in bearings, and bearings wear eventually (claim 11 note; NSK on grease-lubricated motor bearings, claim 12). The gearbox has gears and its own oil. ✅
7. **"EV brakes never need service."** Regenerative braking cuts brake wear a lot (DOE, claim 14), but the fluid still gets checked and calipers need cleaning where roads are salted (claim 17). ✅

No survey measures any of these beliefs, so never say "most people think".

---

## Step 1: Why a gas engine needs oil

## 1. The gas engine is full of metal parts sliding and spinning against each other

- **Script (expected):** "Inside a gas engine, pistons slide up and down and a crankshaft spins thousands of times a minute."
- **Status:** ✅ verified for the parts and the oil's path; 🟡 for "thousands of times a minute" (see note)
- **Source:** [How Does an Engine Lubrication System Work?](https://knowhow.napaonline.com/how-does-an-engine-lubrication-system-work/), Blair Lampe, NAPA Know How, 2020-01-14
- **Quote (tool):** "most of the oil then moves to the main bearings." / oil travels through "small drilled passages" / "The rotating crankshaft flings oil up onto the cylinder walls." / oil reaches "the gears and the camshaft's timing chain."
- **Note:** NAPA is a parts retailer; fine for a how-it-works description, not for numbers. Engine speed: a Toyota Camry 2.5 L four made 169 hp "at 6,000 rpm" (snippet of a Toyota pressroom release for the 2010 Camry, not opened). If the script needs "thousands of times a minute", the fact-checker should open a maker's spec sheet (any tachometer redline of about 6,000 to 7,000 rpm supports it). 🟡 until then.

## 2. Oil does three jobs: it keeps metal from rubbing, carries heat away, and carries dirt to the filter

- **Script (expected):** "Oil keeps that metal from touching, carries heat away, and drags grime to the filter."
- **Status:** ✅ verified
- **Source:** NAPA Know How 2020-01-14 (claim 1)
- **Quote (tool):** Oil reduces friction between moving metal parts; metal-against-metal friction "creates heat" (summary + quote) / "Oil smooths movements and removes some heat as it flows over internal parts." / oil "binds to small particles produced by combustion and carries them to the filter." / "The oil pump is driven by the engine and pulls oil from the pan through lines to the filter." / Without oil: "Such intense heat quickly weakens, warps or breaks internal components, causing your engine to fail."
- **Note:** "Keeps metal from touching" is the lubricant-film idea; NAPA says "reduces friction" and doesn't describe a film (tool). The film itself: claim 3. Don't voice "the engine welds itself" (retailer-blog phrasing only).

## 3. The oil film is only a few thousandths of a millimeter thick

- **Script (expected, optional):** "That film is thinner than a hair."
- **Status:** 🟡 (snippet only) for piston-ring films of about 0 to 5 micrometers; ❌ for "thinner than a hair" (no hair-width source opened)
- **Source (snippet, not opened):** a review of piston-ring oil-film measurements at core.ac.uk ([PDF](https://core.ac.uk/download/74206249.pdf), 403 when opened): films "typically between 0 µm and 5 µm" for the top compression ring.
- **Note:** Good picture, weak sourcing. Cut it, or have the fact-checker find an open source (SAE abstracts on main-bearing film thickness exist but give no number in the abstract). Not needed for the story.

## 4. (No claim 4. The cost numbers are in Step 3, claims 20–22, so the story order stays mechanism first.)

## 5. Oil gets hot: temperature is the biggest driver of how fast it wears out

- **Script (expected):** "And it works next to a fire, so it runs hot."
- **Status:** ✅ verified (GM research)
- **Source:** [GM's Oil-Life System Improves Timing of Oil Change](https://www.machinerylubrication.com/Articles/Print/77?id=77), Machinery Lubrication (no author or date shown; refers to the 1999 Silverado, so about 1998–99), describing research by Shirley Schwartz and Donald Smolenski, GM Research Laboratories (SAE Paper 870403)
- **Quote (tool):** "The influence of temperature, in particular, has a marked impact on oil life." / degradation indicators include acids from "oil oxidation and combustion products" and carbon soot and sludge (quote + summary)
- **Note:** Old but primary research. No oil temperature number is given; don't voice one.

## 6. Combustion gas leaks past the piston rings into the oil ("blow-by"), carrying carbon, water, acids and unburned fuel

- **Script (expected):** "Every time the fuel burns, a little of the hot gas squeezes past the piston rings and down into the oil, with soot, water and unburned fuel in it."
- **Status:** ✅ verified
- **Source:** [Ask the Expert: Engine Oil Analysis](https://www.spectrosci.com/en/Knowledge%20Center/Blogs/Ask%20The%20Expert%20Series/Ask%20the%20Expert%20Engine%20Oil%20Analysis), Spectro Scientific (AMETEK, oil-analysis instrument maker), 2018-01-15
- **Quote (tool):** "Exhaust gases (blowby gases) that leak past the piston rings, valve guides and turbocharger seals into the crankcase." / "These gases contain particles of carbon, water, acids, partially burned fuels, varnish, and lacquers." / "Water combined with blowby gases creates acids, which degrade the oil and corrode the engine surfaces."
- **Source (history):** [Sources of Contamination of Crankcase Oil](https://saemobilus.sae.org/papers/sources-contamination-crankcase-oil-260033), R. L. Skinner, SAE, 1926. **(summary only):** four kinds of contamination: fuel dilution, water, acid and solids (metal particles, carbon, road dust); fuel vapor and blow-by gas enter the crankcase; dilution was the largest problem in 1924–25 samples.
- **Note:** This is the core of the "why" and the best visual: an orange wisp slipping past the rings into the oil pan. "Soot" in the voice is fine ("carbon" particles; NAPA also says particles "produced by combustion"). The 1926 paper is a nice "engineers have known this for a century" detail but I only have a summary; 🟡 if voiced.

## 7. The oil's additives get used up neutralizing acids, and fuel thins it out

- **Script (expected):** "The oil's additives get used up fighting those acids, and the fuel thins it, so it slowly stops protecting the engine."
- **Status:** ✅ verified
- **Source:** Spectro Scientific 2018-01-15 (claim 6)
- **Quote (tool):** "Engine oils contain additives designed to react with the acids formed and neutralize them." / "Blowby gases, combined with moisture from aggressive acids in the crankcase, deplete the base number." / "Fuel dilution of the oil causes a loss in viscosity, resulting in severe wear and possible seizure if left unchecked."
- **Source:** [Oil change truths](https://www.scientificamerican.com/article/oil-change-truths/), EarthTalk column (E/The Environmental Magazine), Scientific American, 2008-08-19
- **Quote (tool):** short trips "doesn't get the oil hot enough to boil off moisture condensation"
- **Note:** "Slowly stops protecting" is a plain gloss of additive depletion plus viscosity loss (🟡 as wording, fine). This is why the oil must be *replaced*, not just topped up: the filter catches particles but not dissolved fuel, water or spent additives (the filter limit is my gloss, 🟡; NAPA only says the filter strains out "small particulate matter").

## 8. How often: the 3,000-mile rule is outdated; most cars today go 5,000 to 10,000 miles or more, and oil-life monitors estimate it from engine turns and heat

- **Script (expected):** "Most cars today go five to ten thousand miles between changes, and the oil-life light works it out from how hard and hot the engine has run."
- **Status:** ✅ verified
- **Source:** [Oil Change](https://calrecycle.ca.gov/UsedOil/OilChange/) ("Check Your Number"), CalRecycle (California Department of Resources Recycling and Recovery), no date shown
- **Quote (tool):** "The old standard of 3,000 miles is out of date and no longer applies to most cars." / "Many cars, even older models, can be driven up to 5,000, 7,500, 10,000, and even 15,000 miles before needing an oil change." / drivers should "check your owner's manual for the manufacturer's recommendations"
- **Source:** [How Often Should I Change My Oil?](https://www.kbb.com/car-advice/how-often-should-i-change-my-oil), Chris Hardesty, Kelley Blue Book, 2025-05-27
- **Quote (tool):** "that rule of thumb is now largely outdated." / "Modern vehicles using synthetic or semi-synthetic oils can typically go 7,500 to 10,000 miles or more between oil changes." / conventional oil: "approximately 5,000-7,500 miles of service."
- **Source:** Toyota service bulletin T-TT-0262-13 Rev, 2014-07-08 (NHTSA TSB 10132741), [via CarComplaints](https://m.carcomplaints.com/Toyota/Prius/2015/tsbs/tsb-t-tt-0262-13-rev.shtml)
- **Quote (tool):** "Toyota has extended the oil change intervals to 10,000 mile for most vehicles that require this oil." (0W-20 synthetic; severe use still 5,000)
- **Source (oil-life monitor):** Machinery Lubrication (claim 5). **Quote (tool):** "computerized monitoring of engine revolutions, operating temperature, and other factors" / "The model uses engine revolutions as a basis for measuring duration of service." Summary: no oil property is measured directly.
- **Source:** [Smart oil drains for light trucks](https://www.fleetowner.com/news/article/21664829/smart-oil-drains-for-light-trucks), Sean Kilcarr, FleetOwner, 2005-06-13. **Quote (tool):** GM's system "can double or even triple the time between oil changes compared to the standard 3,000-mile interval" / GM's Brian McVeigh: change points "anywhere from 3,000 to 10,000 miles."
- **Note:** Scope: US, current owner's manuals. CalRecycle is a California agency; its advice is general. Severe use (short trips, towing, dust, heat) shortens intervals in every manual cited. The oil-life method is GM's (1990s–2005 sources); say "your car's oil-life light" only if hedged ("on many cars"), or attribute to GM.

## 9. Counting one four-cylinder engine's main moving parts 🧮

- **Script (expected, optional):** "A four-cylinder engine alone has dozens of moving metal parts."
- **Status:** 🧮 (our count; design facts need a maker's spec to be ✅)
- **Count:** 4 pistons, 4 connecting rods, 4 wrist pins, 12 piston rings (3 per piston), 1 crankshaft, 2 camshafts, 16 valves, 16 valve springs, 16 followers/lifters = **75**, before the timing chain (each link moves), oil pump, water pump, tensioners and accessory drive.
- **Note:** The 16-valve, twin-cam (DOHC), chain-driven layout of Toyota's 2.5 L four is in Toyota's 2025 Camry product information (snippet: "16-valve DOHC, Chain Drive valvetrain"; the PDF was a forum-hosted copy and unreadable to the tool). "Three rings per piston" is standard design but unsourced here. Use "dozens" (safe with the count), not a number.

## 10. The "2,000 vs 20 moving parts" line: where it comes from and what it counts

- **Script:** don't voice the numbers as fact. Optional: "One popular estimate puts a gas car's moving parts in the thousands."
- **Status:** 🟡 as an attributed estimate; ❌ as fact
- **Source:** [How Many Moving Parts Does a Tesla Have?](https://www.greencarfuture.com/?p=540), Tristan Perry, Green Car Future, 2021-04-12 (relaying Tony Seba's "Clean Disruption" talk, Swedbank Nordic Energy Summit, Oslo, 2016-03-17)
- **Quote (tool):** "Typical ICE vehicle has 2000+ moving parts, Tesla Model S has 18 – lower maintenance." / "Seba uses the high-end estimate of moving parts." / the article also uses a lower ICE estimate of 200 (summary)
- **Source:** [Ford's EVs Require 40% Less Labor To Manufacture](https://carbuzz.com/news/fords-evs-require-40-less-labor-to-manufacture), Gerhard Horn, CarBuzz, 2022-11-20
- **Quote (tool):** "EV motors are elementary items and, on average, contain less than 20 parts." / "An ICE engine is more complex and consists of roughly 2,000 moving parts." (author's own words, not attributed to anyone)
- **Misattribution:** [ArenaEV, 2022-11-20](https://www.arenaev.com/electric_fords_need_40_less_work_to_manufacture-news-1039.php) says Ford CEO Jim Farley "pointed out" that "an electric motor assembly is on average made of 20 moving parts" and an engine "can have as many as 2,000" (tool). Its cited source (CarBuzz, above) does not attribute the numbers to Farley, and Jalopnik's report of the same event (Collin Woodard, 2022-11-17) has no parts count (tool). Don't voice "Ford's CEO says".
- **Note:** Snippet-only leads: Tesla reportedly said "about 17" or "about 20" drivetrain moving parts vs "about 200" conventional (Ennovi/Interplex article, not opened; no Tesla page found). The 18/20 figures are for the whole EV *drivetrain* (motor, gears, differential), not the motor. Use this entry for the myth beat or the description, not the hook.

---

## Step 2: Why an EV motor doesn't need oil changes

## 11. An electric motor has one moving part: the rotor

- **Script (expected):** "An electric motor has one moving part, the rotor, spinning inside a ring of copper coils."
- **Status:** ✅ verified
- **Source:** [Induction motors](https://www.explainthatstuff.com/induction-motors.html), Chris Woodford, Explain that Stuff, updated 2023-08-06
- **Quote (tool):** "They have only one moving part, the rotor, which makes them low-cost, quiet, long-lasting, and relatively trouble free."
- **Source:** [Electric Car Motors Explained](https://www.mazdausa.com/resource-center/electric-car-motor), Mazda USA resource center, no date shown
- **Quote (tool):** electric motors "have only one moving part—the rotor" / in brushed motors "the brush wears over time but is not technically considered a moving part" (brushed designs are uncommon in EVs, summary)
- **Note:** Explain that Stuff's quote is about induction motors; Mazda's is about EV motors in general (permanent-magnet and induction). Cite both; don't name Mazda in the voice. "Ring of copper coils" = the stator (InsideEVs describes a stationary stator and rotating rotor, snippet; copper windings are standard but I didn't quote a source for "copper", 🟡; "coils" alone is safe). The rotor spins on bearings, which contain rolling balls; "one moving part" is the convention, keep "about" or "one big moving part" if the fact-checker wants it tighter.

## 12. The rotor's bearings are packed with grease, not fed engine oil

- **Script (expected, optional):** "It spins on bearings packed with grease."
- **Status:** 🟡 (one bearing maker's EV product; not a statement about every EV)
- **Source:** [Electrification Products](https://www.nsk.com/products/automotive/electrification), NSK (bearing maker), © 2026
- **Quote (tool):** "As a grease lubricated ball bearing for EV motors" / "it achieves the world's fastest rotation speed (1.8 million dmN or more)"
- **Note:** NSK's page doesn't say "sealed" (tool). Some EV drive units also wet some bearings with gearbox oil (NSK's tapered roller bearings are "designed to continuously supply lubricating oil to the rollers even under lean lubrication conditions", tool, for gearboxes). Safe wording: "bearings that carry their own grease". Don't say "sealed for life" (SKF's sealed, pre-lubricated unit I found is from 2009 and appears to be for rail traction motors).

## 13. No fire, so nothing dirties the lubricant

- **Script (expected):** "There's no fuel burning inside, so there's no hot gas, soot or acid getting into anything."
- **Status:** 🟡 as stated (inference from claims 6–7 plus the absence of combustion; no single source says it in these words); ✅ for "EVs need no engine oil / fewer fluids"
- **Source:** [Maintenance and Safety of Electric Vehicles](https://afdc.energy.gov/vehicles/electric-maintenance), U.S. Department of Energy, Alternative Fuels Data Center, no date shown
- **Quote (tool):** "There are fewer fluids, such as engine oil, that require regular maintenance." / "There are far fewer moving parts relative to a conventional fuel engine." / "The battery, motor, and associated electronics require little to no regular maintenance."
- **Note:** The "no combustion means no blow-by" link is physics, not a quote: blow-by is by definition combustion gas leaking past rings (claim 6), and an EV motor has no combustion chamber or rings. Fine to voice as the narrator's explanation, phrased as the mechanism, not as a quote from DOE. Don't say "DOE says there's no soot".

## 14. Regenerative braking cuts brake wear

- **Script (expected, optional):** "Even the brakes last longer, because the motor does most of the slowing."
- **Status:** ✅ verified (wording "most of the slowing" is 🟡: DOE says wear is "significantly reduced", not how much braking the motor does)
- **Source:** AFDC (claim 13)
- **Quote (tool):** "Brake wear is significantly reduced due to regenerative braking."
- **Note:** Safer: "the motor does much of the slowing, so the brake pads wear far less."

## 15. EVs do have oil: a Tesla Model 3 gearbox holds about 2.3 liters, with its own pump and filter

- **Script (expected):** "Your EV does have oil. About two liters of it sit sealed in the gearbox that steps the motor's speed down to the wheels."
- **Status:** ✅ verified for the fluid, amount, pump and the existence of a drain-and-refill procedure; 🟡 for "sealed" (gloss)
- **Source:** [Gearbox Fluid - Rear Drive Unit (4DU) (Drain and Refill)](https://service.tesla.com/docs/Model3/ServiceManual/en-us/GUID-86FFE9E8-C280-4BEF-A9C8-5BA7ABFD9728.html), Tesla Model 3 Service Manual, revised 2026-09-24
- **Quote (tool):** "The rear drive unit requires 2.3L/2300mL of fluid, however the excess fluid will prevent underfill and air entrapment." / "Pump 2.3L/2300mL of KAF1 gearbox fluid into the rear drive unit." / "Run the oil pump for 1 minute to drain the remaining gearbox fluid from the rear drive unit."
- **Source:** [Gearbox Fluid - Rear Drive Unit (3DU) (Drain and Refill)](https://service.tesla.com/docs/Model3/ServiceManual/2024/en-us/GUID-C5FB70CA-5960-42DB-B5A5-44991247A83C.html), Tesla Model 3 Service Manual (2024), revised 2026-08-09. **Quote (tool):** "Drain and refill the rear drive unit gearbox fluid according to the oil pump procedure." Snippet (search summary of the same page, not returned by the tool): "Tesla recommends that the oil filter is replaced with a new one upon removal." / "The minimum refill capacity of the rear drive unit assembly is 2.1 liters."
- **Source:** [Tesla Model 3 teardown: electric powertrain](https://electrek.co/2018/07/26/tesla-model-3-teardown-electric-powertrain/), Fred Lambert, Electrek, 2018-07-26. **Quote (tool, image captions):** "Model 3 drive unit oil filter" / "Model 3 drive unit plate stack heat exchanger"
- **Note:** 2.3 L ≈ 2.4 US quarts (🧮). This is a service procedure (used in repairs), not a schedule item: Tesla's schedule lists no gearbox-oil interval (claim 17). "Steps the motor's speed down": the reduction gear's job (Motor1: "most battery-electric vehicles use a single-speed reduction gear", tool; Dan Mihalascu, Motor1, Sep 10, year not shown). The oil pump and heat exchanger mean this oil also carries heat in Tesla's drive unit (🟡: captions only; see claim 21).

## 16. A Nissan Leaf's gearbox holds 1.4 liters of reduction-gear fluid

- **Script (expected, optional):** "A Nissan Leaf's holds about a quart and a half."
- **Status:** ✅ verified (European-market owner's manual, 2025 Leaf)
- **Source:** [Recommended fluids/lubricants and capacities](https://www.nissan.com.cy/ownership/car-owner-manual/manuals/iom/leaf/0ze2/e0/2025/recommended-fluids-lubricants-and-capacities-1.shtml), Nissan Leaf 2025 Owner's Manual (Nissan Cyprus site)
- **Quote (tool):** reduction gear fluid "1.4 L", "1-1/2 qt" / type "Genuine NISSAN Matic S ATF" / brake fluid "Genuine NISSAN Brake Fluid or equivalent DOT4" / cooling system coolant "8.6 L" (without PTC heater)
- **Note:** Scope: EU-market manual; the US Leaf uses the same drivetrain, but I didn't open a US manual. The fluid is an automatic-transmission fluid (ATF). Older US Leaf service guides (2013–14) say only to "visually inspect for signs of leakage" (snippet, not opened). No replacement interval found. If voiced, "about a quart and a half" is the manual's own US figure.

## 17. Tesla's maintenance schedule: no oil changes, no gearbox-oil or coolant interval; it does list brake fluid, cabin filter, wipers, tires, calipers

- **Script (expected):** "Tesla's schedule has no oil change at all. It lists a brake-fluid check every four years, a cabin filter every two, and tire rotations."
- **Status:** ✅ verified
- **Source:** [Vehicle Service Intervals (Model 3)](https://service.tesla.com/docs/Public/diy/model3/en_us/GUID-A84FDD77-7A8C-42F6-9385-E3F9CEE245A4.html), Tesla public service docs, no date shown (accessed 2026-11-19)
- **Quote (tool):** "Brake fluid health check every 4 years (replace if necessary)." / "Cabin air filter replacement every 2 years (or every year in China)." / "Wiper blade replacements every year." / "Clean and lubricate brake calipers every year or 12,500 miles (20,000 km)," / "Rotate tires every 6,250 miles (10,000 km)," / "Vehicles manufactured prior to approximately 2021: A/C dessicant bag replacement every 6 years." / "The above intervals are based on typical driving behaviors and scenarios." / the vehicle should "generally be serviced on an as-needed basis"
- **Note:** The tool says the caliper item comes with a note about areas where roads are salted in winter (summary); re-check whether it applies everywhere or only to salted-road regions before voicing it. The page lists **no** gearbox/drive-unit oil and **no** coolant interval (tool, summary). Tesla's support page says (snippet, 403 when opened): "Tesla vehicles require no traditional oil changes, fuel system maintenance, spark plug replacements or emission checks." KBB (claim 19) also says "Teslas do not need oil changes or coolant flushes." Naming Tesla is fine: it's Tesla's own schedule.

## 18. Chevrolet Bolt (2017): coolant flush at 150,000 miles, brake fluid every 5 years, tires every 7,500, cabin filter every 22,500

- **Script (expected, optional):** "A Chevy Bolt's schedule waits 150,000 miles for its first coolant change."
- **Status:** ✅ verified (reporting on the 2017 owner's manual)
- **Source:** [Chevrolet Bolt Requires Almost No Maintenance For First 150,000 Miles](https://insideevs.com/news/330737/chevrolet-bolt-requires-almost-no-maintenance-for-first-150000-miles/), Eric Loveday, InsideEVs, 2016-12-11
- **Quote (tool):** "tire rotations every 7,500 miles" / "cabin air filter replacements every 22,500" / "a coolant flush every 150,000 miles" / "brake fluid replacement is recommended every 5 years, regardless of mileage."
- **Note:** 2017 model year. The article doesn't mention drive-unit fluid (tool). A Bolt owners' forum says the 2018 manual has no transmission-fluid change event (snippet, forum, lead only). The coolant here serves the battery and electronics; DOE: "Some automotive battery systems use liquid coolant to maintain safe operating temperatures." / "These systems may require regular checks." (AFDC, tool).

## 19. EVs still wear tires, and can wear them faster

- **Script (expected, fairness):** "In fairness, an EV still needs tires, wipers, brake fluid and a cabin filter, and some wear through tires faster."
- **Status:** ✅ for Tesla per KBB (one outlet's figure); 🟡 as a claim about all EVs
- **Source:** [Maintaining Your Tesla: Everything You Need to Know](https://www.kbb.com/car-advice/maintaining-your-tesla), Sean Tucker, Kelley Blue Book, 2025-06-16
- **Quote (tool):** "Unlike traditional gasoline-powered vehicles, Teslas do not need oil changes or coolant flushes." / "Tires advertised to last 40,000 miles can last just 30,000 miles on a Tesla."
- **Note:** KBB gives no cause in the tool's output. Weight and instant torque are the usual explanations but I didn't source them here; don't voice a cause. Keep "some" or "can".

---

## Step 3: What it adds up to (numbers)

## 20. Consumer Reports (US, 2020): EV owners spent about half as much on maintenance and repair, about 3 cents a mile vs 6, or $4,600 vs $9,200 over 200,000 miles

- **Script (expected):** "Consumer Reports found EV owners spend about half as much on maintenance and repairs as gas-car owners."
- **Status:** ✅ verified (via Green Car Reports; CR's own pages returned 403)
- **Source:** [Plug-in hybrids and EVs cost less to maintain and repair, finds Consumer Reports](https://www.greencarreports.com/news/1129728_plug-in-hybrids-and-evs-cost-less-to-maintain-and-repair-finds-consumer-reports), Bengt Halvorson, Green Car Reports, 2020-09-25
- **Quote (tool):** EV drivers save "an average of 50% versus equivalent gas vehicles, over the life of the vehicle." / battery EVs and plug-in hybrids "cost 3 cents a mile to maintain and repair," vs 6 cents for gasoline vehicles (quote + summary) / "Vehicle lifetime, as defined by the analysis, was 200,000 miles." / "The data is based on annual surveys from hundreds of thousands of vehicle owners."
- **Source (lead):** [CR white paper, Maintenance Cost White Paper 9.24.20](https://advocacy.consumerreports.org/wp-content/uploads/2020/09/Maintenance-Cost-White-Paper-9.24.20.pdf), Consumer Reports, 2020-09 (403; the $4,600 vs $9,200 figures are from GCR's summary and search snippets of the white paper)
- **Note:** Scope: US, CR member surveys (model years and data 2019–2020 per snippets), out-of-pocket maintenance and repair, includes plug-in hybrids with EVs. "Consumer Reports found" is attribution to a research body, fine. A later CR brand ranking (2024, Tesla lowest 10-year cost at $4,035) is in snippets only; not needed.

## 21. Argonne National Laboratory (US DOE, 2021): scheduled maintenance about 6.1 cents a mile for a battery EV vs 10.1 for a gas car

- **Script (expected, optional):** "A Department of Energy lab put scheduled maintenance at about six cents a mile for an EV and ten for a gas car."
- **Status:** ✅ verified (two relays of the same report; report itself not opened)
- **Source:** [Report: EVs Cost Less to Maintain](https://www.government-fleet.com/news/report-evs-cost-less-to-maintain), Government Fleet (staff), 2021-07-07
- **Quote (tool):** "The BEV's scheduled maintenance cost is expected to be 6.1 cents per mile while an ICE vehicle costs 10.1 cents per mile."
- **Source:** [EVs Cost 40 Percent Less to Maintain Than Conventional Cars, Energy Department Report Says](https://e360.yale.edu/digest/energy-department-report-finds-that-evs-cost-40-percent-less-to-maintain-than-conventional-cars), Yale Environment 360, 2021-06-23
- **Quote (tool):** "Maintenance costs for a light-duty, battery-powered car are around 40 percent less per mile than for a gas-powered car." / "gasoline-powered cars cost around 10 cents per mile on average to maintain" / "electric cars cost only around 6 cents per mile"
- **Note:** Report: Burnham et al., "Comprehensive Total Cost of Ownership Quantification for Vehicles with Different Size Classes and Powertrains", Argonne, 2021 (OSTI 1780970; not opened). Scope: US, light-duty, modeled scheduled maintenance. Two different studies (CR survey vs Argonne model) agree on the direction; don't mix their numbers in one sentence.

## 22. AAA (US, 2025): EVs have the second-lowest maintenance costs, after hybrids

- **Script:** none needed; fairness context.
- **Status:** ✅ verified
- **Source:** [AAA: New Vehicle Costs Drop to $11,577](https://newsroom.aaa.com/2025/09/aaa-new-vehicle-costs-drop-to-11577/), AAA Newsroom, 2025-09-16
- **Quote (tool):** "with EVs having the second-lowest maintenance expenses among all vehicle categories." / hybrids are described as "offering the lowest maintenance fees."
- **Note:** AAA's evergreen page (2022 data) said EVs had "the lowest maintenance, repair, and tire costs" (tool). The 2025 brochure figures, 10.07 cents/mile for EVs vs 11.04 average (maintenance, repair and tires; snippet, not opened), show a smaller gap than CR's because tires are included. Useful as the honest scale: cheaper, not free. If voiced: "AAA puts EVs second only to hybrids for maintenance costs."

## 23. US oil-change volume

- **Script:** don't voice a national count.
- **Status:** 🟡 (old trade-press figure with no source)
- **Source:** [Lessons learned from the fast lube industry](https://digitaldealer.com/news/lessons-learned-from-the-fast-lube-industry/58871/), Digital Dealer, 2014-03-03
- **Quote (tool):** "There are roughly 450 million oil changes performed annually on the 249 million cars that are on the road."
- **Note:** No named source; 2014. Snippet lead: Valvoline reports about 25 million oil changes at its own US Instant Oil Change shops in fiscal 2023 (company figure, not opened). Optional EPA detail (environmental, not political): "used oil from one oil change can contaminate one million gallons of fresh water" ([EPA, Managing, Reusing, and Recycling Used Oil](https://www.epa.gov/recycle/managing-reusing-and-recycling-used-oil), updated 2026-06-25, tool). Off-story; I'd leave both out.

## 24. Some EV motors are cooled by oil sprayed on their windings

- **Script:** none recommended; background for the visual.
- **Status:** 🟡
- **Source:** [Electric Motor Thermal Management Research: Annual Progress Report](https://www.osti.gov/biblio/1404876-electric-motor-thermal-management-research-annual-progress-report), Kevin S. Bennion, National Renewable Energy Laboratory, 2017-10-19 (OSTI 1404876)
- **Quote (tool):** "Past work in the area of active convective cooling provided data on the average convective heat transfer coefficients of circular orifice automatic transmission fluid (ATF) jets." / planar jets have "the potential to achieve higher heat transfer over a larger area of the motor end winding."
- **Note:** The abstract doesn't say "vehicles" (tool), though the program is DOE's vehicle research. With claim 15 (Tesla drive unit oil pump, filter, heat exchanger), it suggests the EV's gearbox oil can also carry heat away from the motor. That complicates "the motor needs no oil": it needs no *oil change*. Keep the script on oil changes and the voice won't trip on this.

## 25. EV motors spin faster than gas engines (up to about 20,000 rpm), which is why they need a reduction gear

- **Script (optional):** "The rotor can spin about three times faster than a gas engine, so a gear steps it down."
- **Status:** 🟡 (opinion column plus a snippet; no maker page opened)
- **Source:** [How Electric Motors Killed The Transmission](https://www.theautopian.com/how-electric-motors-killed-the-transmission/), Zero Entropy (guest column), The Autopian, 2025-11-10. **Quote (tool):** "Modern high-performance EVs are approaching 20,000 RPM."
- **Snippet (not opened):** Axios, 2020-09-02, on Lucid's drive unit: the electric motors "can spin at up to 20,000 rotations per minute."
- **Note:** "Three times faster" is 🧮 against a ~6,000–7,000 rpm gas redline (claim 1 note, also unconfirmed). Nice surprise, but it needs a maker's rpm figure before ✅. Good visual if confirmed: a fast orange-tinted rotor next to a slower crank.

---

## Angles (2–3)

1. **The oil that lives next to a fire (recommended).** Both machines spin metal on oil, but only the gas engine's oil gets hot combustion gas, soot, water and unburned fuel blown into it past the rings, so it wears out and gets replaced. An EV motor has one moving part, the rotor, no fire, and the little oil it has sits in the gearbox with no change on Tesla's schedule. Hook: "Your gas car has hundreds of moving parts in its engine and transmission, and an EV motor has about one, but that's only half of why it never needs an oil change." Mechanism: claims 1–2, 6–8, 11, 13, 15, 17.
2. **Your EV does have oil.** Flip the myth: about two liters sealed in a Tesla's gearbox, a quart and a half in a Leaf's, with no change interval on Tesla's schedule, because nothing burns near it. Hook: "Your EV has oil in it, about two liters in a Tesla, and its maintenance schedule never asks you to change it." Claims 15–17, then back to why gas oil gets dirty (6–7).
3. **The oil-change light doesn't look at your oil.** Gas-side angle: the 3,000-mile habit is outdated, and GM's oil-life system counts engine turns and heat, because heat and combustion are what wear oil out; an EV has neither, so it has no light at all. Hook: "The oil-change light in a gas car doesn't test the oil; it counts how many times the engine turned and how hot it ran." Claims 5, 8, 6–7, 11, 17. Weaker for the owner's EV-vs-gas framing; better as a later video or a Short.

## Visual notes (The Section)

- **Frame 0 (split, for the hook):** a gas engine cut open on the left, an EV drive unit cut open on the right, both lit. Left: pistons, rods, crankshaft, camshafts and valves all moving; a thin orange film glints on every sliding surface (orange = the hidden system: the oil and heat). Right: one rotor spinning inside the stator, almost nothing else moving. A small counter-free contrast; no number on screen unless the script says one.
- **The oil's path (gas):** the oil pump pulls from the pan, through the filter, up drilled passages to the main bearings, crank, rods and cam chain; the crank flings it onto the cylinder walls (claim 1). Draw it as orange flowing through the block.
- **Blow-by (the reveal):** in a cut-open cylinder, the spark fires, and a grey-orange wisp slips past the piston rings down into the crankcase and darkens the oil pool a shade with each cycle (claims 6–7). A small acid/fuel tint, not a cartoon skull. Then the oil-life gauge drops.
- **Heat:** the cylinder head and piston crown glow a warm orange; the oil carries the glow away (claims 2, 5).
- **EV motor:** the rotor spins smoothly inside copper coils; bearings at each end shown as small grey rings (grease, not orange). No flame anywhere. Then the camera drops into the gearbox: two or three gears dipping into a small, clean, amber pool (the 2.3 L of gearbox oil), with the oil pump and filter as small parts (claim 15). The pool stays clean the whole time; that's the contrast with the darkening gas oil.
- **Fairness beat:** the EV on a lift, with the things that still need care lighting up one at a time: tires, brake-fluid reservoir, cabin filter behind the glovebox, wipers (claims 17–19). One at a time, never a list on screen.
- **Loop:** end on frame 0's split: the gas side's oil a little darker than at the start, the EV side's gearbox oil unchanged.
- **Wheels roll forward** if a car is shown driving; the rotor and gears turn in the direction that moves the wheels forward.

## Script-safe lines

Each is ✅ or 🟡 with the hedge shown. Claims in brackets.

1. "Your gas car has hundreds of moving parts in its engine and transmission, and an EV motor has about one." [H, 10, 11; "hundreds" 🟡 with the scope]
2. "A four-cylinder engine alone has dozens of metal parts sliding and spinning against each other." [9, 🧮; 1]
3. "Oil keeps that metal from rubbing, carries heat away, and drags grime to the filter." [2]
4. "Every time the fuel burns, a little hot gas squeezes past the piston rings into the oil, with soot, water and unburned fuel in it." [6]
5. "The oil's additives get used up fighting the acids that creates, and the fuel thins it, so it has to be replaced." [7]
6. "That's why most cars today go about five to ten thousand miles between oil changes, not three thousand." [8]
7. "On many cars, the oil-change light doesn't test the oil; GM's system counts engine turns and heat." [8, 🟡 for "many cars"; GM attributed]
8. "An electric motor has one moving part, the rotor, spinning inside a ring of coils." [11]
9. "There's no fuel burning inside it, so there's nothing to blow soot or acid into a lubricant." [13, mechanism 🟡]
10. "Your EV does have oil, about two liters in a Tesla's gearbox, and Tesla's schedule never asks you to change it." [15, 17]
11. "Tesla's maintenance schedule lists no oil change at all." [17]
12. "In fairness, an EV still needs tires, wipers, brake fluid checks and a cabin filter." [17, 18]
13. "Consumer Reports found EV owners spend about half as much on maintenance and repairs." [20]
14. "The motor does much of the slowing, so the brake pads wear far less." [14]
15. "Some EVs wear through tires faster." [19, 🟡 "some"]

**Don't say:** "2,000 moving parts" or "20 moving parts" as fact, "Ford's CEO says 2,000", "an EV has one moving part" (it's the motor), "EVs have no oil", "EVs need no maintenance", "sealed for life", "the oil film is thinner than a hair" (unsourced), "the oil light measures your oil" (GM's doesn't), "oil changes every 3,000 miles" as current advice, any national count of oil changes, any rpm figure until a maker's spec is opened.

## Hook variants (owner's direction)

1. "Your gas car has hundreds of moving parts in its engine and transmission that need oil, and an EV motor has about one." [H, 10, 11; "hundreds" 🟡 with the scope]
2. "A gas engine has dozens of metal parts sliding on a film of oil, and an EV motor has about one, the rotor." [9 🧮, 2, 11; fully countable, safest]
3. "Your gas engine has hundreds of moving parts that need oil, and an EV motor has about one, but the real reason it never needs an oil change is that nothing inside it burns." [H, 11, 13; leads straight into angle 1]

Shortest honest form of the owner's exact line: **"Your gas car's engine and transmission have hundreds of moving parts that need oil. An EV motor has about one."** (one change: scope "hundreds" to the engine plus transmission). If the owner wants "engine" alone, switch "hundreds" to "dozens".
