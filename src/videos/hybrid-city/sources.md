# Sources: hybrid-city

Researcher draft, 2026-11-02. No script yet, so claims follow the agreed beat order: hook → the belief (stickers: gas cars higher on the highway) → one drive across town (red light, engine off → pull away on the motor → braking recharges → engine kept in its efficient zone) → the highway (engine on, drag grows with speed, little braking to catch) → payoff (a hybrid catches energy a gas car throws away; stop-and-go throws away the most) → honest ending (results vary: cold, speed, AC, braking style). Statuses are the researcher's starting confidence; the fact-checker sets the final ones.

Owner-agreed angle (2026-11-02). Hook (B): "Most cars burn the most gas in stop-and-go traffic. Many hybrids get their best mileage there." **Verdict in section H: both halves hold with a small rewording. Read H before scripting.**

Everything was accessed on 2026-11-02. **How to read the quotes** (same rules as `insurance-app/sources.md`):

- **(tool)** means the web tool's small model returned the quote from the page. Re-open and re-quote before ✅.
- **(snippet)** means seen only in a search-result summary; the page was not opened. A lead only (🟡 at best).
- **🧮** means our own calculation or count; inputs sourced, working shown.
- **Company claim** = a carmaker's statement about its own product. **Independent** = EPA/DOE (fueleconomy.gov, AFDC, energy.gov), NASA, university.
- **fueleconomy.gov pages carry no date.** The format is "undated page, live 2026". EPA sticker figures are 2026 model year, from the per-model pages (`/feg/bymodel/2026_<Make>_<Model>.shtml`).
- **Could not open / not found:** a credible, attributable figure for the share of braking energy a hybrid recovers (three searches, then stopped per protocol; see claim 9, ❌). The IEEE/THS PDF at engr.uvic.ca (binary, no text extracted). No DOE/EPA page states "power rises with the cube of speed" (claim 15 is 🧮).

---

## Script check (fact-checker, 2026-11-02, script.txt lines 1-14)

Re-opened and re-quoted on 2026-11-02: Corolla and Accord model pages, Cold Weather, Where the Energy Goes (Hybrids and Gasoline), How Hybrids Work, Tips for Hybrids, NASA Drag Equation. **Verdict: PASS (no ❌ in the script), with 1 required fix on the on-screen sticker numbers and 1 recommended attribution tweak.**

| Line | Claim | Status | Fix / note |
| --- | --- | --- | --- |
| 1 | Most gas cars: worst mileage in stop-and-go | 🟡 | City rating is lower than highway for every gas version checked. EPA city test (21 mph average, 23 stops) is not gridlock; fueleconomy.gov makes the same jump. Allowed via "most". |
| 2 | Many hybrids: best mileage there | 🟡 | Acceptable as spoken because lines 3-4 immediately say what "best" means (the sticker). Strictly, "there" = the EPA city rating, not gridlock. Fully ✅ wording: "Many hybrids are rated higher in the city than on the highway." Non-blocking. |
| 3 | Gas car sticker: highway number bigger | ✅ | Every gas version checked (Corolla, Accord, Maverick, CR-V, Grand Highlander, Tucson). Voice says "a gas car's", no "always": keep it that way. |
| 4 | "Hybrid version of the same car": city bigger | ✅ for the wording, **❌ for the planned on-screen pair** | See pair below. Needs matching bodies. |
| 6 | Engine off at the red light | ✅ | fueleconomy.gov: "Hybrids reduce idling by turning the engine off when the vehicle comes to a stop". "At every stop" is mildly absolute (engine can run for heat or low battery); acceptable. |
| 7 | Pulls away on the electric motor ("can") | ✅ | "The electric motor can be used to power the vehicle at lower speeds, where a combustion engine is typically less efficient." and "In some hybrids, the electric motor alone propels the vehicle at low speeds". Keep "can". |
| 8 | Gentle braking: motor turns some motion into electricity | ✅ | "Hybrids use regenerative braking to recover some energy that would otherwise be lost in braking." Tips page: "Anticipate stops and brake gently or moderately." |
| 9 | Hard braking: regular brakes, heat, like a gas car | ✅ | "Hard braking causes the vehicle to use its conventional friction brakes, which do not recover energy." Gas car: energy "is lost as heat through friction at the brakes." |
| 10 | Highway: almost no idling or braking, little to save | ✅ | "since there is little to no idling or low-speed driving, hybrids offer little advantage over conventional vehicles on the highway"; "there is little braking in highway driving, regenerative braking offers little advantage". |
| 11 | Air resistance grows with the square of speed | ✅ | NASA Glenn: "Drag depends on the density of the air, the square of the velocity," (D = Cd * rho * V^2 * A / 2). Speak "air resistance", fine. |
| 12 | Hybrid still beats its gas version on the highway, by less | ✅ | Accord 44 vs 37; Corolla Hybrid 46 vs gas sedan 38 (or 41 hatchback); Maverick 35 vs 32. Holds for the pairs checked; not every hybrid (Hyundai Elantra/Sonata Hybrid Blue etc. were not compared with their gas twins here). "Its gas version" scopes it to the same model, OK. |
| 13 | "The EPA says" hybrid city mileage can drop about a third in the cold | 🟡 attribution / ✅ figure | Page (fueleconomy.gov, "Fuel Economy in Cold Weather"): "The effect on hybrids is typically greater. Their fuel economy can drop about 30% to 34% under these conditions", where the condition is "in city driving ... at 20°F ... than it would be at 77°F". It also says "For hybrids, fuel economy typically decreases by 20% to 40% in city driving". Source is a DOE/EPA joint site administered by Oak Ridge National Laboratory (analysis of EPA Federal Test Procedure results), not an EPA-only page. Safer attribution: "the government's fuel economy site says" or "EPA and Energy Department data show". Also "in the cold" = 20°F, not a cool day; "can" is kept. If spoken as is, EPA is defensible (the site is co-run by EPA) but not exact. |
| 14 | Closing question | n/a | No factual claim beyond lines 2 and 13. |

**Sticker pair (line 4 "same car").** On the 2026 Corolla page the gas rows are: Corolla base 31 city / 38 hwy (AV-S10); Corolla (1-mode TM) 32/41, body not stated; **Corolla Hatchback 32/41**; Corolla Hybrid 53/46, body not stated (the page never says "sedan"). So 32/41 is the **hatchback** (and an unlabeled 1-mode row), and the researcher's pairing of 32/41 with the 53/46 Hybrid mixes bodies and is not a "same car" pair. The page does not list a hatchback hybrid, so I cannot prove the Hybrid is the sedan from this page (it is sedan-only in the US from my own knowledge, ❌ unsourced here). Required fix, either:

- **Accord (cleanest, one body):** gas 29 city / 37 hwy vs Accord Hybrid 51 / 44. Source: [2026 Honda Accord](https://www.fueleconomy.gov/feg/bymodel/2026_Honda_Accord.shtml): "2026 Honda Accord | 1.5 L | No | 32 | 29 | 37"; "2026 Honda Accord Hybrid | 2.0 L | Yes | 48 | 51 | 44". Caveat: the Accord SE gas is 28/36 and Hybrid Sport/Touring is 46/41; screen the base trims and say so in the description.
- **Or Corolla base:** gas 31 / 38 vs Corolla Hybrid 53 / 46 (both from the same page, base trims), not 32/41.
- Description line: "Sticker figures: 2026 <model> and <model> Hybrid base trims, EPA/fueleconomy.gov." Voice stays unnamed; the line-4 wording is fine once the pair matches ("the hybrid version of the same car" is true for a gas Accord and the Accord Hybrid).

The director's `spec.ts` and any sticker card must change from 32/41 vs 53/46 to one of the pairs above. Legally sensitive: named models appear only in the description, as examples.

**Re-check of the spoken-check rewrite (fact-checker, 2026-11-02).**

| Line | Wording | Status | Note / fix |
| --- | --- | --- | --- |
| 3 | "The window sticker shows the difference: on a gas car, the highway number is bigger." | ✅ | Same claim as before. "A gas car" is generic, no "always". |
| 6 | "...starting with a red light, where the engine switches off." | ✅ | Engine-off claim kept. Source: "Hybrids reduce idling by turning the engine off when the vehicle comes to a stop". |
| 11 | "Air resistance grows with the square of your speed, so the engine works harder the faster you go." | ✅ (🟡 if made stricter) | Square: NASA Glenn, "the square of the velocity". Consequence: fueleconomy.gov, drag takes "less energy at lower speeds and more as speed increases". "Works harder" is a fair plain-language reading of more energy needed; the strict form is "so the car needs more energy the faster you go". |
| 13 | "Back in town, a freezing day can cut a hybrid's city mileage by about a third, government figures show." | 🟡 | Figure and attribution OK: "government figures" fits a DOE/EPA site run by ORNL (30% to 34%, city driving, 20°F vs 77°F); "can" kept. "A freezing day" is loose: 20°F is 12 degrees below freezing, and the comparison is against 77°F. It is not wrong (20°F is freezing), but it understates the cold. Fix: "a 20-degree day can cut a hybrid's city mileage by about a third, government figures show." Or "a very cold day". |

---

## Key facts in one screen

1. **The sticker flip (EPA, 2026 models, city / highway MPG):** Corolla gas 32/41 vs Corolla Hybrid 53/46. Accord gas 29/37 vs Accord Hybrid 51/44. Maverick gas FWD 23/32 vs Maverick Hybrid FWD 42/35. CR-V gas FWD 28/33 vs CR-V Hybrid FWD 43/36. Grand Highlander gas 21/28 vs Grand Highlander Hybrid 37/34. Tucson gas FWD 25/33 vs Tucson Hybrid 36/37 (the flip doesn't happen here).
2. **Hybrid-only models, city ≥ highway:** Prius (FWD) 57/56; Camry FWD LE 52/49; RAV4 FWD 47/40; Civic Hybrid sedan 50/47.
3. **Not every hybrid flips.** Prius AWD 53/54; Hyundai Elantra Hybrid Blue 51/58; Sonata Hybrid Blue 47/56; Kia Sportage Hybrid FWD 41/44. And every mild hybrid and big towing hybrid in the list (BMW, Mercedes, Volvo 48-volt systems; F-150, Tundra, Tacoma, 4Runner hybrids) is higher on the highway.
4. **How common (🧮, fueleconomy.gov 2026 hybrid search, 200 of 230 rows read):** about 49 city > highway, 7 equal, about 144 city < highway. Every "city > highway" row is in the high-efficiency group (combined ≥ ~34 MPG). So "many hybrids" ✅, "most hybrids" ❌ (EPA's hybrid list includes mild and performance hybrids).
5. **Surprise:** even on the highway, the hybrid version still beats the gas version (Corolla 46 vs 41; Accord 44 vs 37; Maverick 35 vs 32). The highway doesn't make the hybrid worse than a gas car; its edge shrinks.
6. **EPA city test:** average 21.2 mph, 23 stops, idling 18% of the time. Highway test: average 48.3 mph, no stops, no idling.
7. **Where a gas car's fuel goes (fueleconomy.gov):** city: only 14–20% reaches the wheels, idling 6%; highway 22–30%, idling none. Braking energy "is lost as heat through friction at the brakes."
8. **Hybrids (fueleconomy.gov):** engine off at stops; motor at low speeds "where a combustion engine is typically less efficient"; regen braking; "Since more braking takes place in stop-and-go traffic, hybrids are most efficient in city driving"; on the highway "hybrids offer little advantage".
9. **Cold (fueleconomy.gov):** gas car city mileage ≈ 15% lower at 20°F than 77°F; hybrids "about 30% to 34%". **Heat:** AC can cut a conventional car's mileage by more than 25%, hybrids "even larger on a percentage basis". **Speed (DOE/ORNL, 74 vehicles):** 80 mph ≈ 27% worse than 60 mph. **Hard braking:** uses the friction brakes, "which do not recover energy."

---

## H. The hook: "Most cars burn the most gas in stop-and-go traffic. Many hybrids get their best mileage there."

| Part | Evidence | Status |
| --- | --- | --- |
| "Most cars burn the most gas in stop-and-go traffic" | Every gas version checked rates city below highway (Corolla 32/41, Accord 29/37, Maverick 23/32, CR-V 28/33, Tucson 25/33, Grand Highlander 21/28; EPA 2026). fueleconomy.gov: in the city only 14–20% of a gas car's fuel energy reaches the wheels vs 22–30% on the highway, and idling takes 6% in the city vs none on the highway. **Problem:** "burn the most gas" is ambiguous; per hour a car burns more on the highway. It is per mile that city is worst. | 🟡 as worded → ✅ as "Most gas cars get their worst mileage in stop-and-go traffic." |
| "Many hybrids get their best mileage there" | "Many" holds: about 49 of the 2026 hybrid listings rate city above highway, including the best sellers (Prius, Camry, Corolla, RAV4, CR-V, Accord, Civic, Maverick). fueleconomy.gov: "hybrids are most efficient in city driving." **Two caveats:** (1) "best mileage" means the higher of the two sticker ratings. The EPA city test (21 mph average, 23 stops) is not a traffic jam, and no source rates a hybrid in crawling gridlock. (2) Not all: Hyundai's Elantra/Sonata hybrids, Prius AWD, mild hybrids and truck hybrids rate higher on the highway. | 🟡 as worded (OK with "many") → ✅ as "Many hybrids are rated higher there." or "…get a better city rating than highway." |

**Verdict:** keep the shape and change two words: **"Most gas cars get their worst mileage in stop-and-go traffic. Many hybrids get their best mileage there."** ✅ for half 1. Half 2 is 🟡: "best mileage there" stretches the EPA city test (not gridlock) into "stop-and-go traffic". fueleconomy.gov itself says "Since more braking takes place in stop-and-go traffic, hybrids are most efficient in city driving", so the source uses the same jump; that makes it acceptable as an attributed or near-quoted line. Fully ✅ alternative: "On the window sticker, a gas car's worst number is the city one. On many hybrids, it's their best."

**Never say:** "all hybrids", "most hybrids", "hybrids are worse on the highway" (they still beat their gas versions there).

---

## 1. Gas cars' stickers show highway MPG higher than city (the belief)

- **Script (expected):** "On a gas car's window sticker, the highway number is always the bigger one."
- **Status:** ✅ verified for the examples / 🟡 for "always"
- **Source:** [2026 Toyota Corolla](https://www.fueleconomy.gov/feg/bymodel/2026_Toyota_Corolla.shtml), fueleconomy.gov (EPA/DOE), live 2026 (accessed 2026-11-02)
- **Quote (tool, table):** "2026 Toyota Corolla | 4 cyl, 2.0 L | Automatic (AV-S10) | No | 34 | 31 | 38" (combined/city/highway); Corolla Hatchback 2.0 L: "35 | 32 | 41"; Corolla 1-mode TM: "35 | 32 | 41"
- **Source:** [2026 Honda Accord](https://www.fueleconomy.gov/feg/bymodel/2026_Honda_Accord.shtml), fueleconomy.gov, live 2026
- **Quote (tool, table):** "2026 Honda Accord | 4 cyl, 1.5 L ... | 32 | 29 | 37"
- **Source:** [2026 Ford Maverick](https://www.fueleconomy.gov/feg/bymodel/2026_Ford_Maverick.shtml), fueleconomy.gov, live 2026
- **Quote (tool, table):** "2026 Ford Maverick FWD | 4 cyl, 2.0 L, Automatic 8-spd | 26 | 23 | 32"
- **Source:** [2026 Honda CR-V](https://www.fueleconomy.gov/feg/bymodel/2026_Honda_CR-V.shtml), fueleconomy.gov, live 2026
- **Quote (tool, table):** "FWD | 4 cyl, 1.5 L, automatic | 30 | 28 | 33"
- **Source:** [2026 Toyota Grand Highlander](https://www.fueleconomy.gov/feg/bymodel/2026_Toyota_Grand_Highlander.shtml), fueleconomy.gov, live 2026
- **Quote (tool, table):** "LE/XLE | 4 cyl, 2.4 L, Automatic (S8) | 24 | 21 | 28"
- **Note:** All gas versions checked are higher on the highway. "Always" isn't shown by this sample; say "on most gas cars" or "on a typical gas car". DOE also says "Between 40 and 50 mph is the optimum cruising speed" (claim 16), so "cars are most efficient on the highway" is itself only half-right: steady moderate speed is best, not fast highway speed.

## 2. Many hybrids flip it: city ≥ highway (sticker examples)

- **Script (expected):** "Many hybrids flip it. Look at the sticker: the city number is the bigger one."
- **Status:** ✅ verified (EPA figures, 2026 MY)
- **Source:** [2026 Toyota Prius](https://www.fueleconomy.gov/feg/bymodel/2026_Toyota_Prius.shtml), fueleconomy.gov, live 2026 (accessed 2026-11-02)
- **Quote (tool, table):** "2026 Toyota Prius | 57 | 57 | 56" (combined/city/highway); "Prius AWD | 54 | 53 | 54"; "Prius AWD XLE/LTD | 49 | 49 | 50"; "Prius XLE/LTD | 52 | 52 | 52"
- **Source:** [2026 Toyota Corolla](https://www.fueleconomy.gov/feg/bymodel/2026_Toyota_Corolla.shtml)
- **Quote (tool, table):** "2026 Toyota Corolla Hybrid | 4 cyl, 1.8 L | ... | Yes | 50 | 53 | 46"
- **Source:** [2026 Toyota Camry](https://www.fueleconomy.gov/feg/bymodel/2026_Toyota_Camry.shtml)
- **Quote (tool, table):** "2026 Toyota Camry HEV FF LE | 51 | 52 | 49"; "HEV FF SE/XLE/XSE | 46 | 47 | 45"; "HEV AWD SE/XLE | 46 | 46 | 46"
- **Source:** [2026 Toyota RAV4](https://www.fueleconomy.gov/feg/bymodel/2026_Toyota_RAV4.shtml)
- **Quote (tool, table):** "2026 Toyota RAV4 | 4 cyl, 2.5 L, Automatic (AV-S6) | 43 | 47 | 40"
- **Source:** [2026 Honda Accord](https://www.fueleconomy.gov/feg/bymodel/2026_Honda_Accord.shtml)
- **Quote (tool, table):** "2026 Honda Accord Hybrid | 4 cyl, 2.0 L ... | 48 | 51 | 44"
- **Source:** [2026 Honda CR-V](https://www.fueleconomy.gov/feg/bymodel/2026_Honda_CR-V.shtml)
- **Quote (tool, table):** "FWD | 4 cyl, 2.0 L, automatic | 40 | 43 | 36" (the hybrid; the page's tool reading doesn't label it, the hybrid search in claim 3 does: "2026 Honda CR-V FWD | 43 | 36")
- **Source:** [2026 Ford Maverick](https://www.fueleconomy.gov/feg/bymodel/2026_Ford_Maverick.shtml)
- **Quote (tool, table):** "2026 Ford Maverick HEV FWD | 4 cyl, 2.5 L ... | 38 | 42 | 35"
- **Source:** [2026 Honda Civic](https://www.fueleconomy.gov/feg/bymodel/2026_Honda_Civic.shtml)
- **Quote (tool, table):** 4-door, 2.0 L variable gear ratios "| 49 | 50 | 47" (hybrid, confirmed by the hybrid search: "2026 Honda Civic 4Dr | 50 | 47"); gas 4-door AV-S7 "| 34 | 31 | 39"
- **Note (fact-checker, corrected):** the 32/41 gas figure is the Corolla *Hatchback* (and an unlabeled 1-mode row); the base Corolla is 31/38, and the page lists no hatchback hybrid. Use Accord 29/37 vs 51/44 or Corolla base 31/38 vs 53/46 (see Script check). Researcher's original note follows. **Best pair for the screen: Corolla vs Corolla Hybrid, same model, same year:** gas 32 city / 41 hwy, hybrid 53 city / 46 hwy. Second: Maverick gas 23/32 vs hybrid 42/35 (city almost doubles). The 2026 Camry and RAV4 are sold only as hybrids in the US, so they have no gas twin for 2026. Camry AWD SE/XLE and XSE are equal (46/46, 43/43), so say "the city number is as high or higher".

## 3. How common is city > highway among hybrids (🧮 count)

- **Script (expected):** none directly. Governs the word "many".
- **Status:** 🟡 plausible (🧮 count of a tool reading; re-count before quoting any number)
- **Source:** [Find and compare cars: 2026 hybrids, sorted by combined MPG](https://www.fueleconomy.gov/feg/PowerSearch.do?action=noform&path=1&year1=2026&year2=2026&vtype=Hybrid&srchtyp=newAfv&pageno=1&sortBy=Comb&tabView=0&rowLimit=200), fueleconomy.gov, live 2026 (accessed 2026-11-02)
- **Quote (tool):** page header "Showing 1 to 200 of 230 vehicles"
- **🧮:** of the 200 rows read: about 49 city > highway, 7 equal, 144 city < highway. The last 30 rows (lowest MPG) were not read; the 56 rows before them were all city < highway. All 49 "city > highway" rows sit in the top of the list (combined ≥ ~34). The "city < highway" group is almost all 48-volt mild hybrids (BMW, Mercedes, Volvo, Land Rover), performance hybrids (Corvette E-Ray), and truck/large-SUV hybrids (F-150, Tundra, Tacoma, 4Runner, Sequoia, Grand Highlander Hybrid MAX).
- **Note:** Script "many hybrids" or "many of the most efficient hybrids". Never "most hybrids". If a number is wanted on screen, re-count from the EPA data download first.

## 4. Not every hybrid flips (fairness / comment fuel)

- **Script (expected, optional):** "Not every hybrid works this way. Some are tuned for the highway and show the opposite."
- **Status:** ✅ verified
- **Source:** [2026 hybrid search](https://www.fueleconomy.gov/feg/PowerSearch.do?action=noform&path=1&year1=2026&year2=2026&vtype=Hybrid&srchtyp=newAfv&pageno=1&sortBy=Comb&tabView=0&rowLimit=200), fueleconomy.gov
- **Quote (tool, table):** "2026 Hyundai Elantra Hybrid Blue | 51 | 58"; "2026 Hyundai Sonata Hybrid Blue | 47 | 56"; "2026 Toyota Prius AWD | 53 | 54"; "2026 Kia Sportage Hybrid FWD | 41 | 44"; "2026 Ford F150 Pickup 2WD HEV | 23 | 25"
- **Source:** [2026 Hyundai Tucson](https://www.fueleconomy.gov/feg/bymodel/2026_Hyundai_Tucson.shtml)
- **Quote (tool, table):** "2026 Hyundai Tucson Hybrid | 1.6 L, gasoline hybrid | 36 | 36 | 37"; "Tucson Hybrid Blue | 38 | 38 | 38"
- **Note:** I found no source explaining *why* the Hyundai hybrids flip back (they use a conventional 6-speed automatic with one motor; that is my reading, ❌ unsourced). Don't explain it in the voice; "some hybrids are built differently" is enough.

## 5. EPA's city and highway tests

- **Script (expected):** "The EPA's city test averages about 21 miles an hour, with 23 stops. The highway test averages 48, with none."
- **Status:** ✅ verified
- **Source:** [Detailed Test Information](https://www.fueleconomy.gov/feg/fe_test_schedules.shtml), fueleconomy.gov, undated, live 2026 (accessed 2026-11-02)
- **Quote (tool, table):** City (FTP): "Average speed 21.2 mph", "Stops 23", "Idling time 18% of time", "Top speed 56 mph". Highway (HWFET): "Average speed 48.3 mph", "Stops None", "Idling time None", "Top speed 60 mph". Also: starting with 2008 models, "three additional tests are used to adjust the city and highway estimates" (high speed, AC, cold).
- **Note:** Useful for the honest ending: real highway driving at 70–80 mph is faster than the 48 mph test, so a hybrid's real highway mileage drops further (claim 16).

## 6. Where a gas car's fuel goes in the city: idling and heat

- **Script (expected):** "In city driving, only about a sixth of a gas car's fuel actually moves it. Some is burned sitting at red lights, and every stop turns speed into heat in the brakes."
- **Status:** ✅ verified (EPA/DOE)
- **Source:** [Where the Energy Goes: Gasoline Vehicles](https://www.fueleconomy.gov/feg/atv.shtml), fueleconomy.gov, undated (diagram files suggest 2021), live 2026 (accessed 2026-11-02)
- **Quote (tool):** "Only about 12%–30% of the energy from the fuel you put in a conventional vehicle is used to move it down the road, depending on the drive cycle." City: energy to wheels "14% to 20%", idle losses "6%". Highway: energy to wheels "22%-30%", idle losses none.
- **Quote (tool):** "A vehicle spends significant time idling in city driving (stop and go traffic)," / "Highway driving, however, includes little to no idling." / "Any time you use your brakes in a conventional vehicle, energy initially used to overcome inertia and propel the vehicle" "is lost as heat through friction at the brakes."
- **Note:** 14–20% ≈ "a sixth to a fifth" (🧮). The page gives **no** percentage for braking losses (❌ for any "X% lost in braking" line). The biggest loss in both cycles is the engine itself (city 71–75%), which the hybrid attacks through claims 10–11. Idling: "a quarter to a half gallon of fuel per hour" (claim 19).

## 7. At a red light, the hybrid's engine is off

- **Script (expected):** "At the red light, the engine is off. Nothing is burning."
- **Status:** ✅ verified (EPA/DOE + DOE AFDC; carmaker statements for their own product)
- **Source:** [Where the Energy Goes: Hybrids](https://www.fueleconomy.gov/feg/atv-hev.shtml), fueleconomy.gov, undated, live 2026 (accessed 2026-11-02)
- **Quote (tool):** "Hybrids reduce idling by turning the engine off when the vehicle comes to a stop" / city idle losses for hybrids "Near 0" (table).
- **Source:** [How Hybrids Work](https://www.fueleconomy.gov/feg/hybridtech.shtml), fueleconomy.gov, undated, live 2026
- **Quote (tool):** "Automatically shuts off the engine when the vehicle comes to a stop and restarts it when the accelerator is pressed." / "This reduces wasted energy from idling."
- **Source:** [How Do Hybrid Electric Cars Work?](https://afdc.energy.gov/vehicles/how-do-hybrid-electric-cars-work), DOE Alternative Fuels Data Center, undated, live 2026
- **Quote (tool):** "The battery can also power auxiliary loads and reduce engine idling when stopped."
- **Note:** The engine can still run at a stop when the battery is low or the cabin needs heat (common knowledge, ❌ unsourced here). "Nothing is burning" is fine as the typical case; don't say "never".

## 8. Pulling away and creeping run on the electric motor

- **Script (expected):** "When the light turns green, the car pulls away on the electric motor, and in slow traffic it can creep along without the engine at all."
- **Status:** ✅ verified (EPA/DOE; company claims for their own systems)
- **Source:** [Where the Energy Goes: Hybrids](https://www.fueleconomy.gov/feg/atv-hev.shtml), fueleconomy.gov
- **Quote (tool):** "The electric motor can be used to power the vehicle at lower speeds, where a combustion engine is typically less efficient."
- **Source:** [How Hybrids Work](https://www.fueleconomy.gov/feg/hybridtech.shtml), fueleconomy.gov
- **Quote (tool):** "In some hybrids, the electric motor alone propels the vehicle at low speeds, where gasoline engines are least efficient."
- **Source:** [Not All Hybrids Created Equal](https://pressroom.toyota.com/not-all-hybrids-created-equal/), Toyota pressroom, 2009-07-05 (accessed 2026-11-02)
- **Quote (tool):** "Full hybrids run on electric drive at low speeds," "on gasoline and electric drive in traffic" "on gasoline alone at highway speeds." Idling and starting from a stop are "two times when a vehicle's engine is the most inefficient."
- **Source:** [e:HEV – Original Honda Hybrid System](https://global.honda/en/tech/two_motor_hybrid_system_honda_eHEV/), Honda, undated, live 2026
- **Quote (tool):** "During startup acceleration and city driving, the vehicle runs on the motor alone, powered by electricity from the battery."
- **Note:** fueleconomy.gov says "can be used" / "in some hybrids": keep "can" for creeping. Toyota's 2009 page is old and simplified ("gasoline alone at highway speeds" ignores motor assist); use it only as the carmaker's description. Don't name Toyota or Honda in the voice (they're examples, not the story).

## 9. Braking recharges the battery instead of heating the pads

- **Script (expected):** "When you brake, the motor runs backwards as a generator. It slows the car and puts some of that energy back in the battery, instead of turning it into heat."
- **Status:** ✅ verified for the mechanism / ❌ for any recovered-share number
- **Source:** [Where the Energy Goes: Hybrids](https://www.fueleconomy.gov/feg/atv-hev.shtml), fueleconomy.gov
- **Quote (tool):** "Hybrids use regenerative braking to recover energy typically wasted in braking." / "Since more braking takes place in stop-and-go traffic, hybrids are most efficient in city driving."
- **Source:** [How Do Hybrid Electric Cars Work?](https://afdc.energy.gov/vehicles/how-do-hybrid-electric-cars-work), DOE AFDC
- **Quote (tool):** regenerative braking "Generates electricity from the rotating wheels while braking, transferring that energy back to the traction battery pack." / the battery is "charged through regenerative braking and by the internal combustion engine." / "A hybrid electric vehicle cannot be plugged in to charge the battery."
- **Source:** [Not All Hybrids Created Equal](https://pressroom.toyota.com/not-all-hybrids-created-equal/), Toyota pressroom, 2009-07-05
- **Quote (tool):** "converting some of its kinetic energy into a storable form of energy instead of dissipating it as heat"
- **Source:** [e:HEV](https://global.honda/en/tech/two_motor_hybrid_system_honda_eHEV/), Honda
- **Quote (tool):** "When decelerating or driving downhill, the tire rotation drives the traction motor to generate electricity,"
- **❌ The share recovered:** no credible, attributable figure found. Leads seen only in search summaries: an arXiv paper citing an NREL ADVISOR assumption of 41% Prius "brake regeneration efficiency"; simulations at 26–38% on the city cycle; forum guesses of 25–60%. All are snippets, simulations or unsourced. **Don't put a percentage in the script.** "Some of that energy" (Toyota's own "some") is ✅.
- **Note:** "the motor runs backwards as a generator": AFDC and Honda say the wheels drive the motor to generate electricity; "backwards" is a picture, not a quote. Safer: "the wheels spin the motor, and it works as a generator."

## 10. Hard braking still uses the pads (surprise, and a real-world variable)

- **Script (expected, optional):** "Brake hard, and the regular brakes take over, and that energy is lost as heat again."
- **Status:** ✅ verified (EPA/DOE)
- **Source:** [Tips for Hybrids, Plug-in Hybrids, and Electric Vehicles](https://www.fueleconomy.gov/feg/evtips.shtml), fueleconomy.gov, undated, live 2026 (accessed 2026-11-02)
- **Quote (tool):** "Anticipate stops and brake gently or moderately." / "This allows the regenerative braking system to recover energy from the vehicle's forward motion" / "Hard braking causes the vehicle to use its conventional friction brakes, which do not recover energy."
- **Note:** Good for the honest ending: driving style changes how much a hybrid gets back.

## 11. The engine is kept in its efficient zone; the battery covers the rest

- **Script (expected):** "When the engine does run, the car keeps it near the speed and load where it burns fuel most efficiently, and the battery fills in the rest."
- **Status:** 🟡 plausible (company claims for their own systems + DOE on low-speed inefficiency; no independent source opened states the "efficient zone" control strategy in so many words)
- **Source:** [e:HEV – Original Honda Hybrid System](https://global.honda/en/tech/two_motor_hybrid_system_honda_eHEV/), Honda, undated, live 2026
- **Quote (tool):** "The vehicle drives with high quietness and fuel economy in the speed range where the engine is most efficient." / Hybrid drive mode: "The vehicle runs on the motor alone using electricity generated by the engine."
- **Source:** [How Hybrids Work](https://www.fueleconomy.gov/feg/hybridtech.shtml), fueleconomy.gov
- **Quote (tool):** "The electric motor provides power to assist the engine in accelerating, passing, or hill climbing." / "This allows a smaller, more-efficient engine to be used."
- **Source:** [How Hybrids Work](https://www.fueleconomy.gov/feg/hybridtech.shtml) and [Where the Energy Goes: Hybrids](https://www.fueleconomy.gov/feg/atv-hev.shtml) (low speeds are where the engine is "least efficient" / "typically less efficient")
- **Note:** Honda's mode description (engine drives a generator, motor drives the wheels) shows the engine decoupled from the wheels' speed, which is the core of "keeps it in its zone". For ✅, the fact-checker may accept the combination: DOE (engine inefficient at low load, motor assists) + Honda (engine run where it's most efficient). If the script says "the car keeps it…", it's the general mechanism; if it names a carmaker, it's that company's claim. Planetary gear "no gearbox": one plain line at most (owner); I found only dealer and press explanations (Tustin Toyota, SlashGear: snippets), so ❌ for anything beyond "a simple gear set instead of a gearbox" until a primary source is opened. Recommendation: skip it.

## 12. The Atkinson-cycle engine: more efficient, less powerful, motor makes up the difference

- **Script (expected, optional):** "The engine itself is built for efficiency over power, and the electric motor makes up the power it gives away."
- **Status:** ✅ verified (company claims about their own engines; attribute or keep general)
- **Source:** [Why does Toyota use Atkinson cycle engines?](https://mag.toyota.co.uk/toyota-use-atkinson-cycle-engines/), Joe Clifford, Toyota UK magazine, 2015-01-14, updated 2024-07-26 (accessed 2026-11-02)
- **Quote (tool):** "the benefits in efficiency could only be achieved at the cost of some power." / "Using an electric motor to assist the petrol engine addressed the shortfall of power characteristic of the Atkinson cycle." / the motor "provided an independent source of motivation in order that the engine could be shut off when possible."
- **Source:** [New 2.5-liter Direct-injection, Inline 4-cylinder Gasoline Engine](https://global.toyota/detail/14384561), Toyota global newsroom, 2016-12-06
- **Quote (tool):** "a 2.5-liter engine that has one of the world's best thermal efficiencies." Specs: "40% (Conventional Engine)" / "41% (HV Engine)".
- **Source:** [Toyota Develops New Series of Gas Engines…](https://pressroom.toyota.com/toyota-new-engines-fuel-efficiency-041014/), Toyota pressroom, 2014-04-10
- **Quote (tool):** "a 1.3-liter gasoline engine using the Atkinson cycle normally used in dedicated hybrid vehicles"
- **Source:** [Atkinson-Cycle Engine (Hybrid Vehicles)](https://www.hondainfocenter.com/Terms-and-Technologies/_content/Terms-and-Technologies/Atkinson-Cycle-Engine-Hybrid-Vehicles), Honda Information Center, ©2026
- **Quote (tool):** "This smaller intake charge would then burn more efficiently during ignition"
- **Note:** The 41% is Toyota's own figure for one engine (2016, "one of the world's best", Toyota survey). Don't voice "41%" as a general hybrid fact. "Atkinson" by name is jargon; the owner finds mechanics heavy, so "built for efficiency over power" is enough. 🟡 for any comparison number like "typical engines ≈ 25%" (Boing Boing snippet only, ❌).

## 13. Payoff: hybrids save fuel by catching energy a gas car throws away; stop-and-go throws away the most

- **Script (expected):** "So a hybrid saves fuel by catching energy a gas car throws away, and stop-and-go traffic throws away the most."
- **Status:** ✅ verified (DOE wording supports it closely)
- **Source:** [Where the Energy Goes: Hybrids](https://www.fueleconomy.gov/feg/atv-hev.shtml), fueleconomy.gov
- **Quote (tool):** "Hybrids use regenerative braking to recover energy typically wasted in braking." / "Since more braking takes place in stop-and-go traffic, hybrids are most efficient in city driving." / "Hybrids reduce idling by turning the engine off when the vehicle comes to a stop"
- **Source:** [Where the Energy Goes: Gasoline Vehicles](https://www.fueleconomy.gov/feg/atv.shtml) (idling 6% city vs none highway; braking energy "lost as heat")
- **Note:** "Catching" covers regen braking; "throws away" also covers idling (not caught, avoided). Fine as a summary. Watch banned pattern 8 ("not X, but Y") in the wording.

## 14. On the highway: the engine runs constantly, little braking, the battery adds little

- **Script (expected):** "On the highway, there's no red light to switch off at and almost no braking to catch, so the engine runs the whole time and the battery has little to add."
- **Status:** ✅ verified (EPA/DOE; Honda for its own system)
- **Source:** [Where the Energy Goes: Hybrids](https://www.fueleconomy.gov/feg/atv-hev.shtml), fueleconomy.gov
- **Quote (tool):** "However, since there is little to no idling or low-speed driving, hybrids offer little advantage over conventional vehicles" (on the highway). Highway idle losses: "None".
- **Source:** [Detailed Test Information](https://www.fueleconomy.gov/feg/fe_test_schedules.shtml): highway test "Stops None".
- **Source:** [Not All Hybrids Created Equal](https://pressroom.toyota.com/not-all-hybrids-created-equal/), Toyota, 2009: "on gasoline alone at highway speeds."
- **Source:** [e:HEV](https://global.honda/en/tech/two_motor_hybrid_system_honda_eHEV/), Honda: in "high-speed cruising, which requires less driving force," engine drive mode: "Engine output is directly connected to the driveshaft to reduce power loss."
- **Note:** "The engine runs the whole time" is the typical case (Toyota "gasoline alone"; Honda engine drive), not a rule (motors assist when passing). Say "runs almost the whole time" to be safe. **Fairness:** "little advantage" is DOE's phrase, but the EPA numbers still show the hybrid ahead on the highway (claim 17). Don't say the hybrid becomes worse than a gas car.

## 15. Air drag grows fast with speed (square of speed; power ~ cube)

- **Script (expected):** "And air resistance grows with the square of your speed: go twice as fast and the car pushes four times as much air out of the way."
- **Status:** ✅ verified (square) / 🟡 🧮 (cube)
- **Source:** [Drag Equation](https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/drag-equation/), NASA Glenn Research Center, updated 2025-07-01 (accessed 2026-11-02)
- **Quote (tool):** "Drag depends on the density of the air, the square of the velocity, the air's viscosity and compressibility,"
- **Source:** [Air Friction](https://hyperphysics.gsu.edu/hbase/airfri.html), R. Nave, HyperPhysics, Georgia State University, undated
- **Quote (tool):** "For higher velocites [sic] and larger objects the frictional drag is approximately proportional to the square of the velocity"
- **Source:** [Where the Energy Goes: Gasoline Vehicles](https://www.fueleconomy.gov/feg/atv.shtml), fueleconomy.gov
- **Quote (tool):** "A vehicle expends energy to move air out of the way as it goes down the road" "less energy at lower speeds and more as speed increases."
- **🧮 Cube:** power = force × speed, so drag power ∝ v² × v = v³ (doubling speed → 8× the power to push the air). Basic physics, but no opened page states it. If used, phrase as the doubling picture ("twice the speed takes about eight times the power just to push the air") and mark 🧮; the fact-checker decides. Safer: use only the square.
- **Note:** "Four times as much air" is loose (it's four times the *force*). Safer: "go twice as fast and the air pushes back four times as hard." Drag is also the part a hybrid can do nothing about, which is the point of the beat.

## 16. Real-world highway speed: mileage falls off fast above 50 mph

- **Script (expected, ending):** "And at 80, a typical car gets about a quarter fewer miles per gallon than at 60."
- **Status:** ✅ verified (DOE/ORNL; gas-car study, model years 2003–2012)
- **Source:** [FOTW #1240: Slow Down to Save Fuel: Fuel Economy Decreases About 27% When Traveling at 80 mph Versus 60 mph](https://www.energy.gov/cmei/vehicles/articles/fotw-1240-may-30-2022-slow-down-save-fuel-fuel-economy-decreases-about-27), DOE Vehicle Technologies Office, 2022-05-30 (accessed 2026-11-02)
- **Quote (tool):** "Fuel economy for a light-duty vehicle going 80 miles per hour (mph) is about 27% lower than when traveling at 60 mph." / "Between 40 and 50 mph is the optimum cruising speed for the best fuel economy in cars and light trucks." / ORNL study of "74 different vehicles" (MY 2003–2012).
- **Source:** [FOTW #1155: Light-Duty Vehicles Use More Gas at Speeds Above 50 Miles per Hour](https://www.energy.gov/node/4609833), DOE, 2020-10-12
- **Quote (tool):** "most vehicles reached their peak fuel efficiency at about 40 miles per hour (MPH)" / "The average decrease in fuel economy from 50 to 80 MPH was 36%."
- **Source:** [Gas Mileage Tips: Driving More Efficiently](https://www.fueleconomy.gov/feg/driveHabits.jsp), fueleconomy.gov, undated
- **Quote (tool):** "gas mileage usually decreases rapidly at speeds above 50 mph"
- **Note:** The ORNL set is mostly conventional cars; the pages don't mention hybrids. Script as "a typical car", not "a hybrid". The "most efficient around 40–50 mph" fact is a strong myth-breaker for the belief ("cars are most efficient on the highway").

## 17. Surprise: even on the highway, the hybrid still beats its gas twin

- **Script (expected, optional fairness line):** "In fairness, it still beats the gas version on the highway. Its lead just shrinks."
- **Status:** ✅ verified (EPA 2026 figures; 🧮 differences)
- **Source:** [2026 Toyota Corolla](https://www.fueleconomy.gov/feg/bymodel/2026_Toyota_Corolla.shtml): gas 2.0 L hatchback/1-mode "41" hwy vs Hybrid "46" hwy; city 32 vs 53.
- **Source:** [2026 Honda Accord](https://www.fueleconomy.gov/feg/bymodel/2026_Honda_Accord.shtml): gas "37" vs Hybrid "44" hwy; city 29 vs 51.
- **Source:** [2026 Ford Maverick](https://www.fueleconomy.gov/feg/bymodel/2026_Ford_Maverick.shtml): gas FWD "32" vs HEV FWD "35" hwy; city 23 vs 42.
- **🧮:** Corolla hybrid lead: city +21 MPG (+66%), highway +5 MPG (+12%). Maverick: city +19 (+83%), highway +3 (+9%). Accord: city +22 (+76%), highway +7 (+19%). Vs the 41-MPG Corolla variant; the 38-MPG base sedan (AV-S10) makes the highway gap 8.
- **Note:** This is the cleanest picture of the whole idea: two bars per car, the city gap huge, the highway gap small.

## 18. Why real results vary: cold weather

- **Script (expected, ending):** "In winter, the EPA says a hybrid's city mileage can drop about a third."
- **Status:** ✅ verified (EPA/DOE)
- **Source:** [Fuel Economy in Cold Weather](https://www.fueleconomy.gov/feg/coldweather.shtml), fueleconomy.gov, undated, live 2026 (accessed 2026-11-02)
- **Quote (tool):** "in city driving, a conventional gasoline car's gas mileage is roughly 15% lower at 20°F than it would be at 77°F." / "It can drop as much as 24% for short (3- to 4-mile) trips." / "The effect on hybrids is typically greater. Their fuel economy can drop about 30% to 34% under these conditions." / "Battery performance decreases in cold weather" / "This also affects the performance of the regenerative braking system on hybrids, plug-in hybrids, and electric vehicles." / "Colder air is denser, increasing aerodynamic drag on your vehicle, especially at highway speeds."
- **Note:** Scope: city driving, 20°F vs 77°F. "About a third" is a fair rounding of 30–34%; keep "can". fueleconomy.gov is run by the EPA and DOE together, so "the EPA says" or "the government's fuel economy site says" are both fair. The page doesn't describe its tests, so avoid "tests found".

## 19. Why real results vary: AC, idling, driving style, speed

- **Script (expected, ending):** "Air conditioning, hard braking and fast highway speeds all eat into it."
- **Status:** ✅ verified (EPA/DOE)
- **Source:** [Fuel Economy in Hot Weather](https://www.fueleconomy.gov/feg/hotweather.shtml), fueleconomy.gov, undated
- **Quote (tool):** "Under very hot conditions, AC use can reduce a conventional vehicle's fuel economy by more than 25%" (particularly on short trips) / "The AC's effect on hybrids, plug-in hybrids, and electric vehicles (EVs) can be even larger on a percentage basis."
- **Source:** [Gas Mileage Tips: Driving More Efficiently](https://www.fueleconomy.gov/feg/driveHabits.jsp), fueleconomy.gov, undated
- **Quote (tool):** aggressive driving "can lower your gas mileage by roughly 15% to 30% at highway speeds and 10% to 40% in stop-and-go traffic." / "Idling can use a quarter to a half gallon of fuel per hour, depending on engine size and air conditioner (AC) use." / the estimates "will likely be less accurate for diesels, hybrids, and vehicles with cylinder deactivation."
- **Source:** [Tips for Hybrids…](https://www.fueleconomy.gov/feg/evtips.shtml) (hard braking uses the friction brakes, claim 10)
- **Source:** [Your Mileage Will Vary](https://www.fueleconomy.gov/feg/why_differ.shtml), fueleconomy.gov: EPA ratings "may not accurately predict the average MPG you will get"; factors include "How & where you drive".
- **Note:** The aggressive-driving figures are for gas cars and the page says they're less accurate for hybrids. Don't apply the percentages to hybrids; name the factors only.

---

## Myths (hook and comment material)

| Myth | What the evidence says | Status |
| --- | --- | --- |
| "Every car is most efficient on the highway." | DOE/ORNL: most vehicles peak at about 40 mph; "Between 40 and 50 mph is the optimum cruising speed"; 80 mph is about 27% worse than 60. Highway beats city for gas cars because of stops and idling, not because highway speed is efficient. | ✅ (claim 16) |
| "Hybrids are bad on the highway." | Their edge shrinks (DOE: "little advantage"), but the hybrid still beats its gas twin (Corolla 46 vs 41 hwy). | ✅ (claims 14, 17) |
| "All hybrids do better in the city." | About a quarter of 2026 hybrid listings do; Hyundai Elantra/Sonata hybrids, Prius AWD, mild hybrids and truck hybrids rate higher on the highway. | ✅ / 🧮 (claims 3, 4) |
| "A hybrid charges its battery by plugging in." | AFDC: "A hybrid electric vehicle cannot be plugged in"; charged by regen braking and the engine. | ✅ (claim 9) |
| "Regenerative braking catches all braking energy." | Hard braking uses the friction brakes, "which do not recover energy" (fueleconomy.gov); no credible overall share found. | ✅ / ❌ number |
| "Hybrids barely care about cold." | Hybrids lose more in cold city driving than gas cars (30–34% vs ≈ 15%). | ✅ (claim 18) |

## Angles (2–3, with hook sentences)

- **A (agreed, recommended): the sticker flip, one drive across town.** Hook: "Most gas cars get their worst mileage in stop-and-go traffic. Many hybrids get their best mileage there." Picture: two window stickers side by side, the numbers swapping places.
- **B: the red light as the money shot.** Hook: "At a red light, a gas car is burning fuel to go nowhere. The hybrid next to it has switched its engine off." (✅ claims 6–7; "burning fuel to go nowhere" = idling, "a quarter to a half gallon of fuel per hour".) Good frame 0: two cars at a light, one exhaust trace, one dark.
- **C: the brakes as a power plant.** Hook: "Every time a gas car stops, the brakes turn its speed into heat. A hybrid turns some of it back into electricity." (✅ claim 9.) Strong picture (orange heat at the pads vs orange current to the battery) but no number.

## Visual notes for the director

- **One car, one drive:** a cut-open compact hybrid sedan (generic silhouette, no badge; the stickers' models are examples, not the car on screen). Section shows engine (front), small motor/generator unit beside it, battery under the rear seat, brake discs at the wheels. Orange is the hidden energy flow (house rule): orange current battery ↔ motor, orange heat at the brake discs only on the gas twin or on a hard stop.
- **The sticker:** the honest way to show the belief is a window-sticker-style card (generic, not the EPA label's exact design or logos) with two numbers, CITY / HWY. Gas twin: 32 / 41. Hybrid: 53 / 46 (Corolla, 2026, 🎭 if the car isn't named; ✅ if the post names the source model). Recommend: show the numbers on generic cards and put "Sticker figures: 2026 Toyota Corolla and Corolla Hybrid, EPA" in the description. No model name on screen or in voice unless the owner wants it (company-name rule: they're examples, not the story's product).
- **Beat by beat:** red light (engine block dark and cold-coloured, no exhaust; a ghost gas car beside it with a faint exhaust trace and a fuel gauge ticking, "6% idling" is a city-cycle average, don't put it on the gauge) → green: wheels driven by the motor, orange current from the battery → braking: wheels spin the motor, orange flows back to the battery; on the ghost gas car the discs glow → engine starts: a simple "zone" gauge with a needle held in a narrow band while the battery tops up or assists → highway slice: engine steady, wind lines thickening on the nose as speed rises (2× speed → 4× the push), battery arrow small and idle → payoff: split frame, city bars vs highway bars (claim 17).
- **Motion rules:** wheels roll forward; same car across cuts; something moves every 2–3 s (brake glow, current flow, wind lines).
- **Loop:** end on the red-light frame 0 (engine dark).
- **Avoid:** planetary gear close-ups (owner); an "X% recovered" counter (❌); temperatures on screen without the 20°F/77°F scope.

## Script-safe lines (✅ as worded; 🟡 noted)

1. "Most gas cars get their worst mileage in stop-and-go traffic. Many hybrids get their best mileage there." (half 2 🟡: the EPA's own wording makes the same jump; fully ✅: "…many hybrids are rated higher in the city than on the highway.")
2. "On a typical gas car's window sticker, the highway number is the bigger one."
3. "In the EPA's city test, the car stops 23 times and spends almost a fifth of the time idling." (18%)
4. "In city driving, only about a sixth to a fifth of a gas car's fuel energy actually reaches the wheels." (14–20%)
5. "At a red light, a hybrid switches its engine off."
6. "When the light turns green, it can pull away on the electric motor alone."
7. "When you brake gently, the wheels spin the motor, and it puts some of that energy back into the battery instead of turning it into heat."
8. "Brake hard, and the regular brakes take over, and that energy is lost as heat."
9. "On the highway there's almost no idling and almost no braking, so the government's fuel economy site says a hybrid has little advantage there."
10. "Air resistance grows with the square of your speed: twice as fast, and the air pushes back four times as hard."
11. "In fairness, the hybrid still beats its gas twin on the highway. The gap just shrinks." (Corolla 46 vs 41)
12. "In cold city driving, the EPA says a hybrid's mileage can drop about a third." (30–34%, 20°F vs 77°F)
13. "Most cars get their best mileage around 40 to 50 miles an hour, and at 80 they get about a quarter less than at 60." (DOE/ORNL, gas-car study)
14. 🟡 "When the engine runs, the car keeps it near its most efficient speed and lets the battery fill in the rest." (Honda's own description + DOE; general mechanism)

**Not script-safe:** any percentage of braking energy recovered (❌); "most hybrids" (❌); "hybrids are worse on the highway" (❌, the data says otherwise); "41% efficient engine" as a general fact (Toyota's claim for one engine); naming a model in the voice as a citation.
