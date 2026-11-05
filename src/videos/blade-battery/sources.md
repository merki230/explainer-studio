# Sources: blade-battery

Researcher draft, 2026-11-03. No script yet, so claims follow the agreed beat order (hook: BYD's nail test → belief "all EV batteries burn the same way" → what the test showed → the question → chemistry → cell shape → cell-to-pack → fairness: Tesla uses LFP too → the trade-off → LFP is calmer, not fireproof → what a nail test does and doesn't prove → ending question). Statuses are the researcher's starting confidence; the fact-checker sets the final ones.

Owner-agreed angle (2026-11-03): **belief:** all EV batteries can catch fire the same way. **Reveal:** in BYD's own nail test, the Blade cell warmed up and didn't burn while a nickel-rich cell flared; why: chemistry (LFP vs NMC/NCA), the long flat cell, cell-to-pack. **Fairness:** Tesla uses LFP too, so the story is "why this chemistry is calmer". **Working hook:** "BYD drove a steel nail through its battery on camera, and it didn't catch fire." **Verdict on the hook is in section H: "steel" is not sourced and "its battery" was one cell. Read H before scripting.**

Everything was accessed on 2026-11-03. **How to read the quotes** (same rules as `byd-price/sources.md`):

- **(tool)** means the web tool's small model returned the quote from the page. Re-open and re-quote before ✅.
- **(snippet)** means seen only in a search-result summary; the page was not opened. Lead only (🟡 at best).
- **Company claim** = BYD's or Tesla's own statement. **Independent** = peer-reviewed paper, national lab, standards text, journalist's own finding, analyst.
- **Temperatures** are as the sources give them, in °C. For the US voice: 30–60 °C ≈ 86–140 °F; 500 °C ≈ 930 °F; 200–400 °C ≈ 390–750 °F (our conversion 🧮, rounded).
- Could not open: pubs.rsc.org (403, Golubkov 2014/2015 papers), iea.org (403), sciencedirect.com (403, Gorsch et al. full text), publica.fraunhofer.de (bot wall), PMC10963544 (captcha), mdpi.com (403), chinesestandard.net (403, GB 38031 text), tuvsud.com (403), electrichybridvehicletechnology.com (403), batterytechonline.com (403), wapcar.my (403), Tesla's Q1 2022 update PDF and KIT PDF (binary, no text extracted).

---

## Key facts in one screen

1. **The test (company claim):** BYD unveiled the Blade Battery at an **online launch on 2020-03-29** and showed a **video** of nail-penetration tests on **three cells**: an NCM ("ternary") cell, a conventional LFP block cell, and a Blade cell. BYD's figures: Blade **no smoke, no fire, surface 30–60 °C**; ternary **"exceeded 500°C and violently burned"**; LFP block **no open flame, 200–400 °C**. BYD also claimed crush, bend, 300 °C furnace and 260% overcharge without fire. **No independent replication of BYD's test found.**
2. **It was a cell, not a pack or a car** (InsideEVs 2020: "nail penetration test - of NCM, LFP and Blade Battery cells"). The material of the nail is **not stated** in anything opened (❌ for "steel").
3. **Chemistry is the main reason (independent):** a 2024 peer-reviewed ARC study ranks thermal-runaway danger **LCO > NCA > NCM811 >> LFP**, credits the **strong phosphorus–oxygen bond** in LFP, and measured LFP peaking at **239 °C** vs **463 °C** for NCM811 (18650 cells, Frontiers in Chemistry). Sandia (2020 review): charged **layered metal-oxide cathodes** (the NMC/NCA family) become unstable and **release oxygen** when heated. BYD's own wording: LFP has "non oxygen release".
4. **Shape helps heat escape (company claim + industry nonprofit):** the Blade cell is about **965 mm long, 90 mm high, 14 mm thick** (RWTH Aachen teardown, 2025). BYD: the flat shape "improves cooling efficiency"; Volta Foundation: "The large surface area can increase the thermal dissipation of the cells." The teardown found the Blade cell makes **about half the heat per volume** of Tesla's 4680 cell under the same load.
5. **Cell-to-pack:** no modules; the long cells span the pack and act as **structural beams**; BYD claims **over 50%** better pack space use vs older LFP block packs.
6. **Tesla uses LFP too (Tesla's own words, via press):** Q3 2021: "For standard range vehicles, we are shifting to Lithium Iron Phosphate (LFP) battery chemistry globally." Q1 2022: "nearly half of Tesla vehicles produced in Q1 were equipped with" LFP. 2025: Tesla's standard Model 3/Model Y use LFP "primarily supplied by CATL" (electrive via Reuters); Tesla "does not disclose how many".
7. **The trade-off:** RWTH teardown: Blade **160 Wh/kg** vs Tesla 4680 (NMC811) **241 Wh/kg** at cell level, i.e. the nickel cell stores about **50% more energy per kilogram**. **Cold weather is contested:** Recurrent's 2025 study of 18,000+ US EVs found LFP cars "don't perform noticeably worse than NCA alternatives when it's freezing". Don't say LFP is bad in the cold.
8. **Calmer, not fireproof:** LFP cells still go into thermal runaway, and one 2024 peer-reviewed study found LFP vent gas burns with the **highest flame speed** of the cells tested (snippet). A BYD Han caught fire ~48 h after a 2021 media crash test (BYD blamed swapped, conductive coolant).
9. **The nail test itself:** it simulates an **internal short circuit** (and, per BYD, metal piercing the battery in a crash). China's mandatory standard **GB 38031-2020** (in force 2021-01-01) **deleted the cell needling test** of the old GB/T 31485-2015. Results depend heavily on test conditions: a 2026 AVL-group preprint found **slower nails didn't trigger runaway** in automotive pouch cells. **GB 38031-2025** (from 2026-07-01) instead requires that a pack doesn't catch fire or explode after a cell inside it runs away.

---

## H. The hook: "BYD drove a steel nail through its battery on camera, and it didn't catch fire."

| Part | Evidence | Status |
|---|---|---|
| "BYD drove … through … on camera" | BYD showed a **video** of the test at its online launch, 2020-03-29 (claim 1). BYD ran it (company test). | ✅ as "BYD filmed" / "in BYD's own test" |
| "a steel nail" | **Material not stated** in BYD's release, InsideEVs, Charged, Battery Design, BYD's sites. The old Chinese standard's needle is commonly described as steel, 5–8 mm (arXiv 2026 table gives 5–8 mm and 25 mm/s for GB/T 31485, no material). | ❌ "steel"; ✅ "a nail"; ✅ "a metal spike" is BYD's own framing ("metal objects", claim 9) only loosely |
| "its battery" | It was **one Blade cell** (InsideEVs: "cells"). Not a pack, not a car. In 2026 BYD showed nail tests on a **pack** for the 2nd-gen Blade (claim 14), but that's a different demo. | 🟡 → say "one of its battery cells" (✅) |
| "and it didn't catch fire" | BYD: "emitted neither smoke nor fire", surface 30–60 °C. Company claim, no independent replication. | ✅ attributed ("in BYD's own test") |

**Honest hooks (pick one):**

- **A (closest):** "In 2020, BYD filmed a nail being driven through one of its battery cells, and the cell didn't even smoke." (✅ each piece, attributed as BYD's test.)
- **B (side by side, strongest picture):** "BYD drove the same nail through two battery cells: one burst into flames, the other barely got warm." (✅ as BYD's test; "barely got warm" = BYD's 30–60 °C surface figure; "burst into flames" = BYD's "violently burned"; the flaming one was a nickel-based "ternary" cell.)
- **C (number-led):** "In BYD's nail test, one battery cell passed 500 degrees Celsius and burned; the other stayed under 60." (✅ attributed; US viewers: "over 900 degrees Fahrenheit … under 140".)

---

## 1. BYD launched the Blade Battery in March 2020 with a filmed nail test

- **Script (expected):** "In March 2020, BYD unveiled a new battery and showed a video of a nail being driven through it."
- **Status:** ✅ (tool), company claim relayed by press
- **Source:** [BYD's new Blade Battery set to redefine EV safety standards](https://www.automotiveworld.com/news-releases/byds-new-blade-battery-set-to-redefine-ev-safety-standards), Emma Georgiades, Automotive World (based on BYD's press release), 2020-03-29
- **Quote (tool):** "BYD highlighted a video of the Blade Battery successfully passing a nail penetration test" / launch was an online event titled "The Blade Battery – 'Unsheathed to Safeguard the World'" (tool paraphrase)
- **Source:** [BYD Reveals Ultra-Safe Blade Battery: Pierces It With A Nail](https://insideevs.com/news/406839/byd-blade-battery/), Mark Kane, InsideEVs, 2020-03-30
- **Quote (tool):** "The first model equipped with the Blade Battery will be the all-new BYD Han."
- **Note:** BYD's own North America news page carries the same release ([en.byd.com](https://en.byd.com/news/byds-new-blade-battery-set-to-redefine-ev-safety-standards/), undated on page; tool phrases match). Wikipedia gives 2020-03-29 as the formal launch and June 2020 for the Han going on sale (Wikipedia, tool; not needed in voice).

## 2. The test was on single cells: NCM, conventional LFP, and Blade

- **Script (expected):** "BYD tested three cells side by side."
- **Status:** ✅ (tool), InsideEVs describing BYD's video
- **Source:** InsideEVs, 2020-03-30 (claim 1)
- **Quote (tool):** "nail penetration test - of NCM, LFP and Blade Battery cells"
- **Source (independent comment):** [BYD Blade Nail Penetration Test](https://www.batterydesign.net/byd-blade-nail-penetration-test/), Nigel (Battery Design), 2023-10-18 (page also shows a 2026 header date)
- **Quote (tool):** "The Blade cell in this test" / references BYD's video "Nail Penetration Test on the BYD Blade Battery and NCM Battery"
- **Note:** Neither source names the NCM grade (e.g. NCM523 vs 811), the state of charge, nail diameter, material or speed. ❌ for any of those in voice. "Ternary" = BYD's word for NCM/NCA nickel-cobalt cells.

## 3. BYD's reported results: Blade 30–60 °C, no smoke or fire; ternary over 500 °C and burned; LFP block 200–400 °C

- **Script (expected):** "In BYD's own test, the nickel-based cell passed 500 degrees Celsius and burned, while the Blade cell's surface stayed between 30 and 60."
- **Status:** ✅ (tool) as BYD's claim; no independent replication found
- **Source:** [BYD's new Blade Battery set to redefine EV safety standards](https://en.byd.com/news/byds-new-blade-battery-set-to-redefine-ev-safety-standards/), BYD (North America news page), 2020-03 (no date on page)
- **Quote (tool, exact phrases):** "its surface temperature only reached 30 to 60°C." / "a ternary lithium battery exceeded 500°C and violently burned" / "its surface temperature reached dangerous temperatures of 200 to 400°C" / "being heated in a furnace to 300°C and overcharged by 260%" / "increased by over 50% compared to conventional lithium iron phosphate block batteries"
- **Source (same release via press):** Automotive World, 2020-03-29 (claim 1). Quote (tool): "While undergoing nail penetration tests, the Blade Battery emitted neither smoke nor fire" / "a conventional lithium iron phosphate block battery did not openly emit flames or smoke"
- **Source (press, same figures):** [BYD says its new Blade Battery offers far lower risk of fire](https://chargedevs.com/newswire/byd-says-its-new-blade-battery-offers-far-lower-risk-of-fire), Charles Morris, Charged EVs, 2020-04-01. Quote (tool): "emitted neither smoke nor fire after being penetrated"
- **Note:** **Surface** temperatures, not internal. BYD's UK page now words the Blade figure as "Surface temperature 30-60°C in extreme cases" (tool) and says of ternary only "Possible thermal runaway above 200°C" (tool) ([BYD UK technology page](https://www.byd.com/uk/technology/byd-blade-battery), undated). A later Nepal distributor release softened it to "mostly exceeds 500°C" (snippet). Say "more than 500 degrees" only attributed to BYD's 2020 test. The **LFP block** result is the most useful nuance: same chemistry as Blade, but much hotter (200–400 °C), which is BYD's case that shape matters too (claim 7).

## 4. The belief: "every EV battery burns the same way"

- **Script (expected):** "Most people picture every electric-car battery as the same kind of fire risk."
- **Status:** 🎭/framing (a belief, not a claim); no poll found on public belief
- **Note:** Spoken as the belief to be corrected (brand § Belief, then correction), not as a statistic. Don't attribute it to "most people" with a number. Safer: "It's easy to think every EV battery is the same kind of battery." Claims 5–6 correct it.

## 5. Chemistry: LFP is far less violent in thermal runaway than nickel-rich cells (independent)

- **Script (expected):** "The answer starts with chemistry. The Blade uses lithium iron phosphate, and in lab tests that chemistry runs away far less violently than nickel-rich cells."
- **Status:** ✅ (tool), peer-reviewed
- **Source:** [Influence of cathode materials on thermal characteristics of lithium-ion batteries](https://www.frontiersin.org/journals/chemistry/articles/10.3389/fchem.2024.1324840/full), Yuan Yuan et al., *Frontiers in Chemistry* vol. 12, 2024-03-12, doi:10.3389/fchem.2024.1324840
- **Quote (tool):** "the thermal runaway danger level of these 18,650 LIBs can be ranked as LCO > NCA > NCM811 >> LFP." / "LFP produces minimal thermal runaway consequence owing to the high strength of phosphorus oxygen bond in phosphate group." / "The Tmax at 239.26°C for LFP is much lower than the auto-ignition temperature (AIT) of organic carbonate." / "The higher the nickel and cobalt content, the higher the lithium-ion battery capacity, but the worse the thermal stability."
- **Source (independent, analysis):** Battery Design, 2023 (claim 2). Quote (tool): "Lithium Iron Phosphate chemistry is far less reactive in this test compared to NMC or NCA."
- **Note:** Tmax values (tool): NCM811 462.52 °C, NCA 491.84 °C, LCO 545.11 °C, LFP 239.26 °C. Scope: small 18650 cells, accelerating-rate calorimetry (heated, not nailed), one study. Script-safe: "in lab tests, iron-phosphate cells peaked at about half the temperature of nickel-rich ones" (🟡, needs "in one lab study"); safest: no number, the ranking only.

## 6. The oxygen question: nickel-oxide cathodes release oxygen when hot; LFP holds on to it

- **Script (expected):** "Look inside a nickel cell: when it overheats, its cathode starts giving off oxygen, so the fire feeds itself. In iron phosphate, the oxygen is locked to phosphorus far more tightly."
- **Status:** ✅ (tool) for nickel/metal-oxide oxygen release (Sandia review) and the P–O bond (Frontiers); 🟡 for "LFP releases no oxygen" (BYD's absolute wording; science says "minimal")
- **Source:** [Review: Materials Science Predictions of Thermal Runaway in Layered Metal-Oxide Cathodes: A Review of Thermodynamics](https://sandia.gov/research/publications/details/review-materials-science-predictions-of-thermal-runaway-in-layered-metal-ox-2020-01-07), Randy Shurtz and John C. Hewson, Sandia National Laboratories, *Journal of the Electrochemical Society* 167(9), 2020-05-20
- **Quote (tool):** "Cathode delithiation leads to a less stable metal oxide subject to phase transformations including oxygen release."
- **Source:** Frontiers in Chemistry 2024 (claim 5). Quote (tool): "active oxygen ions, such as O2-, O−, O22-, will lose electrons to form oxygen release." / "owing to the high strength of phosphorus oxygen bond in phosphate group"
- **Source (company claim):** [What is Blade Battery?](https://www.byd.com/za/technology/byd-blade-battery), BYD South Africa, undated. Quote (tool): LFP has "slow heat generation, low heat release and non oxygen release." BYD UK page (tool): "the stable chemistry does not release oxygen."
- **Note:** "Delithiation" = a charged cathode. NMC and NCA are layered metal oxides (Sandia's subject); LFP is a phosphate. The "fire feeds itself" image is our plain-English gloss of oxygen release inside a sealed cell; the sources support the release, not the phrase. Script-safe: "a charged nickel cathode can give off oxygen when it overheats" (✅); "iron phosphate holds its oxygen much more tightly" (✅ via P–O bond); avoid "no oxygen at all" unless "BYD says".

## 7. Shape: the long, thin cell sheds heat, and the same chemistry in a block ran much hotter

- **Script (expected):** "Then the shape. Each Blade cell is almost a meter long and about as thick as a finger, so heat has a lot of surface to escape through."
- **Status:** ✅ (tool) dimensions (independent teardown); 🟡 for the heat-dissipation mechanism (BYD + industry nonprofit + trade press; **no peer-reviewed study isolates shape in the nail test**)
- **Source (dimensions):** [PEM researchers analyse BYD and Tesla batteries](https://www.electrive.com/2025/03/07/pem-researchers-analyse-byd-and-tesla-batteries), Chris Randall, electrive, 2025-03-07, reporting Gorsch et al., *Cell Reports Physical Science*, doi:10.1016/j.xcrp.2025.102453, 2025-03-06 (RWTH Aachen PEM / Fraunhofer FFB)
- **Quote (tool):** "90 millimetres in height, 14 millimetres in width and an impressive 965 millimetres in length."
- **Source (mechanism, industry nonprofit):** [The Next-Generation Battery Pack Design: from the BYD Blade Cell to Module-Free Battery Pack](https://volta.foundation/the-next-generation-battery-pack-design-from-the-byd-blade-cell-to-module-free-battery-pack/), Xinghua Meng, Volta Foundation, 2020-10-31
- **Quote (tool):** "The large surface area can increase the thermal dissipation of the cells."
- **Source (company claim):** BYD South Africa (claim 6). Quote (tool): "The unique flat rectangle shape also improves cooling efficiency and preheating performance." BYD UK (tool): "heat is dissipated and the battery does not reach critical temperatures."
- **Source (trade press):** [BYD blade battery – What makes it ultra-safe…](https://evreporter.com/byd-blade-battery-what-makes-it-ultra-safe/), Rahul Bollini, EVreporter, 2021-11-08. Quote (tool): "The cell has a larger surface area than regular prismatic cells, allowing for better heat dissipation."
- **Source (independent heat data):** [Tesla vs. BYD: Study Reveals Different Battery Cell Technologies](https://battery-news.de/en/2025/03/10/tesla-vs-byd-study-reveals-different-battery-cell-technologies/), Junia Dietert, battery-news.de, 2025-03-10. Quote (tool): the Tesla 4680 "generates 2.3 times more heat per volume than the BYD Blade cell under a 1C load." ChEnected (2025-05-23, tool): "puts off twice the heat per volume during charging". (Normal operation, not abuse; supports "makes less heat", not "survives a nail".)
- **Note:** 965 mm ≈ 38 in ≈ "almost a meter / a little over three feet"; 14 mm ≈ 0.55 in 🧮. "About as thick as a finger" is our image (🎭-ish gloss, fine as a comparison; disclose not needed since it's a size comparison, but the fact-checker decides). Nominal spec is often given as 960 × 90 × 13.5 mm (Wikipedia, vendor, snippet); the teardown measured 965 × 90 × 14. **Best evidence for "shape matters" is BYD's own LFP-block result (claim 3): same chemistry, 200–400 °C vs 30–60 °C.** Script-safe: "BYD says the long, flat shape lets heat spread out and escape" (✅ attributed).

## 8. Cell-to-pack: no modules; the cells are the pack's beams

- **Script (expected):** "And the cells go straight into the pack, side by side, with no boxes in between, so each blade also works as a beam that holds the pack together."
- **Status:** ✅ (tool), company design described by press and an industry nonprofit
- **Source:** InsideEVs, 2020-03-30 (claim 1). Quote (tool): BYD changed conventional prismatic LFP cells into "thinner and longer cells" "designed to become structural parts (beams) of the pack"
- **Source:** Volta Foundation, 2020-10-31 (claim 7). Quote (tool): "battery packs are assembled directly from the cells without the need for modules." / "each cell is used for not only energy storage but also structural support of the battery pack."
- **Source:** Automotive World, 2020-03-29 (claim 1). Quote (tool): "The singular cells are arranged together in an array and then inserted into a battery pack." / "the space utilization of the battery pack is increased by over 50%"
- **Note:** The 50% is pack **space utilisation** vs BYD's older LFP block packs (company claim), not energy density vs nickel packs. Cell-to-pack is about packing and structure; **no source ties it to the nail result** (the nail test was on a single cell). So in the script it belongs to "how BYD gets range back from a less dense chemistry", not to "why it didn't burn". Cell-to-**body** (pack lid = floor) is a later step, see `byd-price` claim 10; Tesla has a similar structural pack (`byd-price` claim 7), so don't call it unique.

## 9. What a nail test simulates

- **Script (expected):** "A nail test is meant to mimic a short circuit inside the battery, the kind a crash or a manufacturing flaw could cause."
- **Status:** ✅ (tool) for "internal short circuit" (independent) and "metal penetrating in a serious accident" (BYD); 🟡 for "manufacturing flaw" (not stated in sources opened)
- **Source:** Battery Design (claim 2). Quote (tool): "The purpose is to simulate an internal short circuit of the battery."
- **Source (company claim):** BYD UK technology page (claim 3). Quote (tool): the test "simulates what could happen in a serious accident, when metal objects could penetrate the battery's structure."
- **Note:** Drop "manufacturing flaw" unless the fact-checker finds a source; "a short circuit inside the battery, like a crash could cause" is safe.

## 10. China dropped the cell nail test from its mandatory standard in 2020

- **Script (optional, surprise / fairness):** "China's battery safety standard actually dropped the nail test for single cells in 2020."
- **Status:** ✅ (tool), English edition of the standard's change list
- **Source:** [GB 38031-2020 Electric vehicles traction battery safety requirements (English)](https://www.codeofchina.com/standard/GB38031-2020.html), Code of China (English translation listing), standard issued 2020-05-12, in force 2021-01-01
- **Quote (tool):** "The safety requirements and test methods for needling test of secondary cell are deleted" (relating to clauses 5.1.7 and 6.2.8 of GB/T 31485-2015)
- **Source (context):** [GB 38031](https://www.batterydesign.net/legislation-rules-and-regulations/gb38031/), Battery Design, undated. Quote (tool): "GB 38031-2020 replaced GB/T 31485-2015 and GB/T 31467.3-2015."
- **Note:** "Needling" = nail penetration (a JIS comparison paper, snippet: "GB/T test is a so-called nail penetration test"). **Timing twist:** the standard deleting it was issued 2020-05-12, six weeks after BYD's 2020-03-29 launch made it the headline; BYD's test was against the then-current GB/T 31485 test (inference; BYD's release doesn't name the standard ❌). **No official reason for the deletion found** (❌ for "because it was unreliable"); Battery Design cites Gao et al. (2023, *Cell Reports Physical Science*) on poor nail-test reproducibility (tool, not opened). The pack-level **thermal propagation test** that came in with GB 38031-2020 aimed at no fire or explosion for **5 minutes** after one cell runs away (TÜV SÜD, snippet; page 403). Not political; regulatory detail only.

## 11. China's newer rule: a pack must not catch fire or explode after a cell runs away (from July 2026)

- **Script (optional):** "Since July 2026, China requires a battery pack not to catch fire or explode even after one cell inside it overheats."
- **Status:** ✅ (tool) for the rule and date (trade press); 🟡 for the 2-hour figure (Battery Design only)
- **Source:** [China to introduce stricter EV battery standards in 2026](https://www.electrive.com/2025/04/17/china-to-introduce-stricter-ev-battery-standards-in-2026), Carla Westerheide, electrive, 2025-04-17
- **Quote (tool):** batteries must "no longer pose any risk of fire or explosion" / the rules "come into effect on 1 July 2026" / packs must be safe "even after internal thermal runaway occurs" / old rule: a warning "at least five minutes prior to a potential fire or explosion" / batteries must withstand "300 rapid charging cycles" before a short-circuit test
- **Source:** Battery Design GB 38031 page (claim 10), tool paraphrase: 2 hours after thermal runaway without fire or explosion, up from 5 minutes; bottom impact test (30 mm steel ball, 150 J).
- **Note:** US audience: probably cut, or one line at most. No US federal standard requires a nail test or a no-fire propagation test (not researched in depth; ❌ for any US claim). Keep politics out: say what the rule requires, not why.

## 12. Tesla uses iron-phosphate cells too

- **Script (expected, fairness):** "In fairness, this isn't only BYD's chemistry. Tesla moved its standard-range cars to iron phosphate back in 2021."
- **Status:** ✅ (tool) for Tesla's 2021 and 2022 statements (Tesla's own words, quoted by Electrek); 🟡 for which current US trims use LFP (no Tesla source; press says the standard Model 3 and Model Y)
- **Source:** [Tesla moving Model 3 Standard Range to LFP cells…](https://electrek.co/2021/10/21/tesla-moving-model-3-standard-range-to-lfp-cells-fremont-cell-production-closer/), Fred Lambert, Electrek, 2021-10-21
- **Quote (tool, Tesla Q3 2021 shareholder deck as quoted):** "For standard range vehicles, we are shifting to Lithium Iron Phosphate (LFP) battery chemistry globally."
- **Source:** [Tesla using cobalt-free LFP batteries in half of new cars produced](https://electrek.co/2022/04/22/tesla-using-cobalt-free-lfp-batteries-in-half-new-cars-produced/), Fred Lambert, Electrek, 2022-04-22
- **Quote (tool, Tesla Q1 2022 results as quoted):** "nearly half of Tesla vehicles produced in Q1 were equipped with a lithium iron phosphate (LFP) battery"
- **Source (US manual):** [Tesla Recommends Charging Model 3 RWD's LFP Battery To 100%](https://insideevs.com/news/557527/tesla-model3-lfp-charging-recommendations/), Dan Mihalascu, InsideEVs, 2021-12-28. Quote (tool, from the US Model 3 owner's manual): "If your vehicle is equipped with an LFP Battery, Tesla recommends that you keep your charge limit set to 100%" / LFP cells "starting to find their way into US-market Model 3s."
- **Source (2025 status):** [Tesla reportedly places major LFP battery order with LGES](https://www.electrive.com/2025/07/30/tesla-reportedly-places-major-lfp-battery-order-with-lges), Carla Westerheide, electrive (citing Reuters), 2025-07-30. Quote (tool): LFP cells in standard Model 3 and Model Y versions, "primarily supplied by CATL" / "Tesla does not disclose how many of its vehicles are equipped with LFP cells."
- **Note:** Tesla's FY2025 10-K (opened, first ~200k of 265k characters) does **not** mention LFP or cathode chemistry; it names Panasonic and CATL as cell suppliers (`byd-price` claim 6). Recurrent (2022, tool) says in the US LFP was used in the RWD/standard-range Model 3. China-built Model 3 RWD on LFP: `byd-price` claim 12 (🟡). Tesla's Megapack/energy storage also uses LFP (press, snippet). The "nearly half" figure is **Q1 2022 production**, now old: don't present it as current. Script-safe: "Tesla switched its standard-range cars to iron phosphate in 2021" (✅ Tesla's words).

## 13. The trade-off: LFP stores less energy per kilogram

- **Script (expected):** "The catch is weight. When German researchers took both apart, Tesla's nickel cell stored about half again as much energy per kilogram as BYD's blade."
- **Status:** ✅ (tool), independent teardown (figures relayed by two trade outlets; paper itself not opened)
- **Source:** electrive, 2025-03-07 (claim 7). Quote (tool): "160 Wh/kg and 355.26 Wh/l were determined for BYD's LFP cell." / Tesla's cell reaches "241.01 Wh/kg and 643.3 Wh/l at the cell level." / "BYD's battery is more efficient because it enables simpler thermal management."
- **Source:** battery-news.de, 2025-03-10 (claim 7). Quote (tool): "160 watt-hours per kilogram of gravimetric and 355 watt-hours per liter of volumetric energy density" (Blade); "241 watt-hours per kilogram … 643 watt-hours per liter" (4680)
- **Note:** 241 ÷ 160 = 1.51 → "about 50% more per kilogram"; 643 ÷ 355 = 1.81 → "about 80% more per liter" 🧮. Cell level only; at pack level BYD's cell-to-pack claws some back (claim 8). These are the **first-gen** Blade (2020 design) vs the 4680 (NMC811). BYD says 2nd-gen Blade raises energy density "by over 5%" (CnEVPost 2026-03-05, tool); Wikipedia/CarNewsChina cite 190–210 Wh/kg for the long 2nd-gen Blade (snippet; chemistry possibly LMFP, unconfirmed). Say "first-generation" or keep the comparison as "the cells those researchers tested". The researchers are at RWTH Aachen (German): "German researchers" ✅.

## 14. Second-generation Blade (2026): BYD's nail test during fast charging, and on a pack

- **Script (optional, update):** "This year BYD repeated the stunt on its new battery, driving the nail in while it was fast-charging."
- **Status:** ✅ (tool) as BYD's claim via press
- **Source:** [BYD unveils 2nd-gen Blade battery…](https://cnevpost.com/2026/03/05/byd-unveils-2nd-gen-blade-battery/), Phate Zhang, CnEVPost, 2026-03-05
- **Quote (tool):** the battery passed a "simultaneous charging and nail penetration test" after 500 flash-charging cycles, "emitting no smoke or open flames" (second phrase from search summary, snippet)
- **Source (snippet):** InsideEVs (2026, [news/789094](https://insideevs.com/news/789094/byd-second-generation-blade-battery/), not opened): "multiple nail penetration tests on a single pack in a demo video—and the pack did not appear to catch fire." 🟡 until opened.
- **Note:** Chemistry of 2nd-gen not confirmed by BYD as LFP (CnEVPost doesn't say; Wikipedia: analysts suggest LMFP, filings say LFP; snippet). Don't call the 2026 battery "LFP" in voice without a hedge. Keep the 2020 test as the story's one event.

## 15. Cold weather: contested, so don't claim it as a weakness

- **Script:** avoid "LFP is bad in the cold".
- **Status:** 🟡 contested. Real-world US data says no noticeable difference in range; lab and IEA wording (unopened) say NMC has a cold-climate edge
- **Source:** [EVs lose 20% range on average in freezing conditions, study finds](https://www.carscoops.com/2025/01/evs-lose-20-range-on-average-in-freezing-conditions-study-finds/), Brad Anderson, Carscoops, 2025-01-31, reporting Recurrent's winter range study
- **Quote (tool):** LFP-battery vehicles "don't perform noticeably worse than NCA alternatives when it's freezing." / "more than 18,000 vehicles across 20 popular models in the United States"
- **Source (older, same firm):** [What kind of battery is in my Tesla?](https://www.recurrentauto.com/research/what-kind-of-battery-is-in-my-tesla), Liz Najman, Recurrent, 2022-09-12. Quote (tool): "Rumors that the LFP batteries suffer more range loss in cold weather have largely been dispelled."
- **Counter (snippet only):** IEA Global EV Outlook (2024/2025, iea.org 403), as quoted by trade sites: "The higher energy density of NMC batteries remains an advantage for applications requiring longer ranges or operation in cold climates". BYD's own 2nd-gen cold-charging claim: 20–97% in 12 min after 24 h at −30 °C, "only three minutes longer than at room temperature" (CnEVPost 2026-03-05, tool).
- **Note:** The owner's brief asked to cover cold performance "if sourced". It is sourced, but **in the other direction** for real-world range. Recommended: leave cold out, or use it as a myth beat ("a US study of 18,000 EVs found iron-phosphate cars lost no more range in freezing weather than nickel ones": ✅ attributed to Recurrent; scope = range, US, published 2025).

## 16. Calmer is not fireproof

- **Script (expected, one honest line):** "Iron-phosphate cells can still overheat and burn; they just do it later and less violently."
- **Status:** ✅ (tool) for "still goes into thermal runaway at lower intensity" (Frontiers Tmax and ranking, claim 5); 🟡 for the flame-speed finding (snippet); ✅ (tool) for the Han crash fire as reported
- **Source:** Frontiers in Chemistry 2024 (claim 5): LFP is last in the ranking, not absent; Tmax 239 °C.
- **Source (snippet, 🟡):** "The trade-off characteristic between battery thermal runaway and combustion", *Energy Storage Materials*, 2024, doi:10.1016/j.ensm.2024.103380 (abstract via search summary; faculty page and full text not opened): "The LiFePO4|Graphite (LFP|Gr) battery with the weak cathode oxidizability shows the lowest temperature of 297.4 °C within the battery, but with the highest laminar flame speed of 55 cm s−1 outside the battery."
- **Source:** [BYD Han EV suffers in independent crash testing](https://carnewschina.com/2021/07/29/byd-han-ev-suffers-in-independent-crash-testing), James Chen, CarNewsChina, 2021-07-29. Quote (tool): a "50% offset crash test (64km/h per car)" with an Arcfox α-S; the Han caught fire after sitting two days (tool paraphrase); BYD said it "suspect[s] that the car has been tampered with" (coolant of a different, conductive type).
- **Note:** The flame-speed point: an LFP cell vents gas that, once outside, can burn fast; matters for packs and garages (explosion risk), not for "will the cell ignite itself". The Han case is disputed (BYD's coolant explanation, not verified); don't use it in voice. **No fire-rate statistics** (brief rule): none used, none needed.

## 17. A nail test's result depends on how you run it

- **Script (optional, fairness):** "Researchers have found that the same cell can pass or fail depending on how fast the nail goes in."
- **Status:** 🟡 (tool) preprint, not yet peer-reviewed
- **Source:** [Safe or Slow? The Illusion of Thermal Stability Under Reduced-Velocity Nail Intrusion](https://arxiv.org/abs/2603.09254), Eymen Ipek, Oliver Korak, Georg Gsellmann, Andrey Golubkov, arXiv preprint, 2026-03-10
- **Quote (tool):** "Through six controlled tests varying the speed of nail insertion" / "lower penetration speeds did not induce thermal runaway" / "penetration speed is a critical factor in the onset of thermal runaway."
- **Source:** Battery Design (claim 2). Quote (tool): "We know there is a lot of test to test variation and differences between standards." / "Hence showing an arbitrary nail test doesn't really prove anything."
- **Note:** The preprint tested "large-format automotive lithium-ion pouch cells" (chemistry not named in the abstract) — it says nothing about BYD's test specifically, and **BYD did not publish its nail speed** (❌ for implying BYD slowed the nail). Use only as "results depend on test conditions"; never as "BYD's test was rigged". Say "researchers found" with "in a study not yet peer-reviewed" or skip.

## 18. "BYD's chemistry is calmer, Tesla's is denser" is a chemistry story, not a brand story

- **Script (ending lead-in):** the comparison is LFP vs nickel, whoever makes it.
- **Status:** ✅ via claims 5, 12, 13
- **Note:** Both companies sell both kinds of car in some form: Tesla uses LFP in standard trims (claim 12); BYD's 2nd-gen chemistry may be manganese-doped (claim 14). The fair framing: "the cell that burned in BYD's video was a nickel cell, the same family Tesla uses in its long-range cars" — **🟡**: Tesla's long-range packs are nickel-based (NCA/NMC per press and the RWTH teardown's NMC811 4680), but BYD didn't say whose NCM cell it used. Don't imply the burning cell was a Tesla cell (❌).

---

## Myths (good hook material)

| Myth | What the evidence says | Status |
|---|---|---|
| "All EV batteries burn the same way." | Chemistry changes everything: LCO > NCA > NCM811 >> LFP in thermal-runaway severity (claim 5). | ✅ |
| "LFP batteries can't catch fire." | They can; they run away later and cooler, but their vent gas burns (claim 16). BYD's own wording ("non oxygen release") is the absolute version. | ✅ / 🟡 |
| "The nail test is what regulators require." | China deleted the cell nail test in 2020 (claim 10) and now tests whole packs for fire after a cell fails (claim 11). | ✅ |
| "A nail test proves a battery is safe." | Results swing with test conditions, even nail speed (claim 17); BYD's is a one-off company demo. | ✅ / 🟡 |
| "Iron-phosphate EVs are useless in winter." | A 2025 study of 18,000+ US EVs found LFP cars lose no noticeably more range in freezing weather than nickel ones (claim 15). | ✅ attributed |
| "BYD's battery is safe, Tesla's isn't." | Tesla uses the same chemistry in its standard cars (claim 12). | ✅ |

## Angles (2–3, each with a hook)

1. **Same nail, two cells (recommended).** The side-by-side is the picture: one cell flares, the other barely warms. Explanation: oxygen in the cathode, then shape. Hook: "BYD drove the same nail through two battery cells: one burst into flames, the other barely got warm." Ending question: "Do you know which of those two chemistries is in the EV you'd buy?"
2. **The oxygen inside.** Lead with the hidden mechanism: a nickel cathode carries the oxygen its own fire needs. Hook: "Some EV batteries carry the oxygen for their own fire, locked inside the cathode." (✅ via Sandia + Frontiers, if worded "can release oxygen when it overheats".) Ending: "Next time you see an EV spec sheet, look for three letters: L-F-P."
3. **The test China dropped.** Lead with the stunt, then the twist that China removed it from its standard six weeks later, then why the chemistry still matters. Hook: "In 2020 BYD made a nail test famous, and six weeks later China dropped it from its battery rules." Riskier (regulation-heavy, US viewers care less); keep as a 1-line twist inside angle 1 at most.

## Script-safe lines (each tied to a claim)

| # | Line | Status | Claims |
|---|---|---|---|
| 1 | "In 2020, BYD filmed a nail being driven through one of its battery cells, and the cell didn't even smoke." | ✅ attributed | 1, 2, 3 |
| 2 | "In the same video, a nickel-based cell hit more than 500 degrees Celsius and burned." | ✅ as BYD's test | 3 |
| 3 | "BYD says the blade's surface stayed between 30 and 60 degrees Celsius, under 140 Fahrenheit." | ✅ attributed (no everyday comparison: none sourced) | 3 |
| 4 | "The blade uses lithium iron phosphate, and in lab tests that chemistry runs away far less violently than nickel-rich cells." | ✅ | 5 |
| 5 | "When a charged nickel cathode overheats, it can give off oxygen, the one thing a fire inside a sealed cell is short of." | ✅ for oxygen release; the "short of" phrase is our gloss (fact-checker) | 6 |
| 6 | "In iron phosphate, the oxygen is bound to phosphorus far more tightly." | ✅ | 6 |
| 7 | "Each blade is almost a meter long and only about 14 millimeters thick, so heat has a lot of surface to escape through, BYD says." | ✅ dims; ✅ attributed mechanism | 7 |
| 8 | "In BYD's test, an ordinary block-shaped cell with the same chemistry reached 200 to 400 degrees." | ✅ as BYD's test | 3 |
| 9 | "The blades go straight into the pack with no modules, and each one doubles as a beam." | ✅ | 8 |
| 10 | "In fairness, Tesla moved its standard-range cars to iron phosphate in 2021." | ✅ (Tesla's words via Electrek) | 12 |
| 11 | "The catch: when German researchers took both apart, Tesla's nickel cell held about half again as much energy per kilogram as BYD's blade." | ✅ | 13 |
| 12 | "Iron-phosphate cells can still overheat and burn; they just do it later and less violently." | ✅ | 5, 16 |

## Visual notes for the director

- **Frame 0 / hook:** The Lab, re-dressed as a battery abuse bay: two cells clamped side by side on a bench (left: a short, fat silver prismatic "nickel" cell; right: a long, thin blade, ~965 × 90 × 14 mm, so it reads almost 70× longer than thick). Two steel-grey nails (don't label "steel") above them on a press. A wall meter per cell reading surface °C (left climbs past 500, right stops under 60). Orange is the hidden system: the heat/oxygen inside, not the flames. Flames on the left cell: stylised, brief, no smoke cloud filling the frame (no fear-mongering).
- **The cut-open cell (chemistry beat):** slice the nickel cell to show the jelly-roll layers; inside the cathode layer, small orange "O" particles break loose as the layer heats and drift into the electrolyte (the oxygen release). Then slice the blade: same layers, but the "O" stay locked in tetrahedra (P–O bond), dimmer orange, no drift.
- **Heat spreading (shape beat):** top-down thermal view of the nail point: on a block cell the orange heat pools in a compact blob and climbs; on the blade the same heat spreads along the long thin body and fades at the faces (fins of air arrows leaving both broad faces). Use BYD's LFP-block result (200–400 °C) as the middle case if the scene can hold three cells; otherwise two.
- **Cell-to-pack beat:** the pack tray seen from above, blades sliding in side by side across its full width like planks, then the lid; a press pushes down on the lid and the blades take the load (beams). No modules (contrast: a ghosted older pack with boxes-of-cells).
- **Fairness beat:** a Tesla-ish sedan silhouette (realistic-cars rule after No. 011: recognisable Model 3) with its floor cut open showing a pack labelled by chemistry only ("LFP" on the standard trim). No logos in the scene beyond the shapes; the voice names Tesla for its own product.
- **Trade-off beat:** two equal kilogram weights on a balance; the nickel side lights 1.5 "units" of energy bars, the blade 1. Counter overlay "160 vs 241 Wh/kg" only if the script speaks it.
- **Loop:** end on the two cells on the bench, the left one dark and scorched, the right one intact with the nail still in it; meter frozen at its BYD figure. Matches frame 0 framing.
- **Physical correctness:** the nail goes in perpendicular to the broad face of the cell (as in BYD's video per its stills; check BYD's video before building — not verified here); the press moves at a steady speed; no sparks fountain from the blade.

---

## P. Our calculations (🧮)

- **P1 temperatures:** 30 °C = 86 °F; 60 °C = 140 °F; 200 °C = 392 °F; 400 °C = 752 °F; 500 °C = 932 °F; 239 °C = 462 °F; 462.5 °C = 865 °F.
- **P2 energy density:** 241.01 ÷ 160 = 1.506 (≈ 50% more per kg); 643.3 ÷ 355.26 = 1.811 (≈ 80% more per liter).
- **P3 cell size:** 965 mm = 38.0 in = 3.17 ft; 14 mm = 0.55 in; 965 ÷ 14 ≈ 69 (length-to-thickness ratio).
- **P4 timing:** BYD launch 2020-03-29 → GB 38031-2020 issued 2020-05-12 = 44 days (≈ six weeks).
