# Sources: datacenter-water

Researcher draft, 2026-11-01. Long-form horizontal video (Part 1 of 2; Part 2 is electricity) plus four Shorts cut from its chapters. There's no script yet, so claims are grouped by the four agreed chapters, in story order. Statuses are my starting confidence; the fact-checker sets the final ones.

Owner-agreed story: one data center on a hot afternoon, following the heat from a server rack up to the roof. The surprise is that cooling towers get rid of heat by evaporating water, so water use isn't a leak; it's how the building stays cool. Working hook: "A data center can evaporate millions of gallons of water a year, and that's not a leak, it's how it stays cool." **The verdict on the hook is in section H. It holds, and the honest scale is bigger than "millions": a typical large site evaporates tens of millions of gallons a year.**

Everything was accessed on 2026-11-01. **How to read the quotes** (same rules as `byd-price/sources.md`):

- **(tool)** means the web tool's small model returned the quote from the opened page. Re-open and re-quote before ✅.
- **(snippet)** means seen only in a search-result summary; the page wasn't opened. Use it as a lead only (🟡 at best).
- **🧮** means our own calculation. The inputs are sourced and the working is in section P.
- **Company claim** = the operator's own statement (Google, Microsoft). **Independent** = regulator, national lab, peer-reviewed paper, NGO analysis, or a journalist's own finding.
- **Units:** US gallons, °F. 1 US gallon = 3.785 L. Liter figures are converted 🧮.
- **Withdrawal vs consumption:** withdrawal = water taken in. Consumption = withdrawal minus what's discharged, which for a cooling tower is mostly evaporation. Never mix the two in one sentence. Google reports site *consumption*; Cardinal News's site list is *withdrawal*.
- **LBNL report:** the PDF couldn't be decoded directly. I read it through the r.jina.ai text reader of the eScholarship PDF (`https://r.jina.ai/https://escholarship.org/content/qt32d6m0d1/qt32d6m0d1.pdf`). Cite the eScholarship URL, not the reader.
- **Could not open:** the Washington Post 2024-09-18 article (403); the DCD 2022-12-19 article (403; read through WaterWatch's republication); the Google 2025 and 2026 environmental report PDFs (over 10 MB); the EPA WaterSense at Work Section 6.3 PDF (binary; I used EPA's archived HTML pages of the same 2012 guide); the Ohio EPA draft-permit PDFs and the Ohio EPA 2026-05-27 legislative testimony (404 or binary); the FEMP cooling-tower web article (404; I used the FEMP fact sheet PDF through the text reader); NIST WebBook gave no direct ΔvapH line (I used formation enthalpies instead, see P1).

---

## Fact-check pass 1 (2026-11-01, fact-checker): read this first

Order worked: hook and Ch 1 core, Ch 2, Ch 3, Ch 4, myths. Opened and re-quoted at the primary this pass: LBNL 2024 (via the r.jina.ai text of the eScholarship PDF; the page is cut at 100,000 characters, so I read the second half too), Pacific Institute brief (via r.jina.ai; the direct PDF is binary), Google 2026 Environmental Report (via r.jina.ai, the site table), Microsoft 2024-12-09 blog, Microsoft Local page, Flatwater Free Press, EPA WaterSense pp. 195 and 199 (archived), FEMP fact sheet (via r.jina.ai), EPA Quincy case study (archived), Ohio EPA testimony 2026-05-27 (via r.jina.ai), Water & Wastes Digest, Bricker, LII 33 USC 1362, Google 2022 blog, Latitude Media, EPA How We Use Water, Li et al. arXiv HTML v5, Google arXiv 2508.15734 (abstract and HTML), Karimi abstract, Loudoun page, Altman blog.
**Still not opened:** Washington Post 2024-09-18 (403; a search also failed to confirm the URL), NAE *The Bridge* page (verification wall), Cardinal News, EPA pp. 196/197/p.199 neighbours other than 195/199, GCSAA/GCM golf pages, DCD/WaterWatch Dalles page, Alston arXiv preprint, Circle of Blue, NIST/USGS inputs, CDC, BMP #10, Nevada fact sheet.

**Findings that change wording**
1. **Council Bluffs is now read at the primary** (Google 2026 report, "Water use by data center location", 2025): Withdrawal 1,746.4 / Discharge 400.4 / **Consumption 1,346.0** million gallons (consumption is 77% of withdrawal 🧮). "About 1.3 billion gallons" is **consumption**. Say "campus", "Google reported". Google's fleet: "we consumed 10.9 billion gallons" in 2025, up 34% from 2024 (report text, data centers and offices).
2. **Pacific Institute "74%" is partly an assumption.** Consumption was reported for only **36 of 65** facilities; for the rest the authors "assumed a 0.74 consumptive ratio" (tool). So "about three-quarters of what's pulled in is consumed" is the authors' typical value, not 65 measured sites. The 44.3 M gal withdrawal median is from 65 facilities (2024 or 2025 data, worldwide).
3. **Ohio attribution.** The line "most data centers in Ohio currently discharge wastewater to municipal wastewater treatment plants / only one facility holds an NPDES permit" is the **Alliance for the Great Lakes** (an advocacy group) as reported by Water & Wastes Digest. The **Ohio EPA Director's written testimony (2026-05-27, John Logue)** independently says "Most data centers send their wastewater to publicly owned wastewater treatment works" (so no Ohio EPA discharge permit needed), and "Cooling water blowdown may require an IDP" (indirect discharge permit). Use Ohio EPA for "most go to the sewer"; keep "only one NPDES permit" attributed or drop it.
4. **Loudoun "75 to 85 percent" is about older open-loop designs** ("Older designs had..."). Don't use it as a current-fleet figure; the (C-1)/C formula (2.7) and Pacific's 74% are the better support.
5. **Li et al. "bottle for 10 to 50 responses"** carries the qualifier "depending on when and where it is deployed", and its water definition is scope 1 (on-site) plus scope 2 (power plants). A "medium request" is about 800 words in, 150-300 words out; the authors call their energy-per-request assumption conservative.
6. **Altman post date:** the page shows no date (the "Posted" label is empty). The post is dated 2025-06-10 by Simon Willison's page URL and by coverage (secondary; not opened).
7. **Google 0.26 mL scope:** the paper scopes water to "the water consumed for cooling machines and associated infrastructure in data centers", with no upstream power-plant water. Compare it only with on-site figures. arXiv, Aug 2025, not peer-reviewed.

### Hedge table for the scriptwriter (by chapter)

| Ch | Script claim | Status | Safe wording |
|---|---|---|---|
| Hook | "can evaporate tens of millions of gallons a year" | ✅ with "can" and "big" | Keep "can". Support: Pacific median withdrawal 44.3 M gal/yr (65 facilities, worldwide); Google 2021 average 164 M gal/yr consumed (company); Council Bluffs 1,346 M consumed (company). No source gives an *evaporation* volume; "consumed" is the measured term. In the description say "consumed, mostly by evaporation". |
| Hook | "isn't a leak, it's how the building stays cool" | ✅ | FEMP and EPA state evaporation is the heat-transfer mechanism; Microsoft: "Traditionally, water has been evaporated on-site". |
| 1 | "every watt becomes heat" | 🟡 | "nearly all of the electricity becomes heat" (NAE page not opened; abstract quote only via LBNL record). |
| 1 | rack to roof path | 🟡 | LBNL confirms cooling towers release heat to the environment and chillers pair with room air handlers; keep the loop detail generic. |
| 1 | one gallon = about 8,800 BTU, 100x warming | 🧮 ✅ | "about 8,800 BTU, roughly 2.5 kWh". Arithmetic rechecked (P1): 44.004 kJ/mol gives 1,050 BTU/lb, 8.34 lb/gal, 8,760 BTU, 2.57 kWh, 83 BTU for +10°F, ratio 105. EPA rule agrees. Don't say "boils". |
| 1 | US 2023: 17 B gal | ✅ | "Berkeley Lab estimates US data centers consumed about 17 billion gallons on site in 2023." "Evaporated" only as "used up, mostly by evaporation". |
| 1 | Council Bluffs 1.3 B gal | ✅ company-reported | "Google reported its Council Bluffs, Iowa campus consumed about 1.3 billion gallons in 2025." Never "withdrew"; withdrawal was 1.75 B. |
| 1 | typical site 44 M gal, 3/4 consumed | 🟡 | "A typical large site pulls in about 44 million gallons a year, the Pacific Institute found in 65 big-tech facilities, and by its estimate about three-quarters of that is consumed." |
| 1 | 400 families, golf course | 🧮 / 🟡 | "about 400 families" ✅ 🧮 (EPA "more than 300 gal/day"); golf not re-opened, keep 🟡 or cut. |
| 2 | cycles 2-4, 6+ possible | ✅ | EPA: "Many systems operate at two to four cycles of concentration, while six cycles or more might be possible." Microsoft 2-5 (company). |
| 2 | 3 to 6 cycles cuts drain | ✅ attributed | "EPA says about half; the math says more than half." Never "exactly half". |
| 2 | 75-85% evaporates | 🟡 | "At four to six cycles, 75 to 83 percent of the makeup water evaporates" 🧮 from the FEMP formula; or cite Pacific's 74% as the typical consumed share. Avoid Loudoun's range unless "older designs". |
| 3 | blowdown goes mostly to the sewer | ✅ | "Usually it goes to the local wastewater plant" (Microsoft; Ohio EPA testimony). |
| 3 | direct discharge needs a permit with limits | ✅ | Ohio draft permit (Bricker) covered cooling tower blowdown with limits on pH, TDS, chlorine and oxidants, and **monitoring** (not limits) for temperature. |
| 3 | heat is a pollutant | ✅ | CWA statute text lists "heat". Don't imply data centers get thermal permits. |
| 3 | blowdown is hot or warm | ❌ | No source. Cut. |
| 3 | Quincy | ✅ | "Under a plan in which Microsoft would finance it ($31 million), Quincy treats the cooling water and sends it back, saving an estimated 138 million gallons a year." Say "estimated". |
| 4 | air cooling uses more energy | ✅ | LBNL: "While air-cooled chillers use no water, they use more energy." No percentage. |
| 4 | Google ~10% less energy | 🟡 | "Google says water-cooled sites use about 10 percent less energy." Company claim, 2022. |
| 4 | Microsoft 125 M L | ✅ company projection | "Microsoft says its new design will avoid more than 125 million liters a year per data center." Don't convert to "30 million gallons" aloud without "about 33". |
| 4 | reclaimed water | ✅ | Loudoun delivered "750 million gallons of reclaimed water" to about 40 customers in 2025; data centers' share of that is unknown. |
| 4 | 12x indirect water | ✅ | "Berkeley Lab found the water behind their electricity was about twelve times the on-site use, nationally, in 2023" (Pacific range 2.4-12x). |
| Myth | bottle per AI question | 🟡 | "A 2023 study estimated a 500 mL bottle for roughly 10 to 50 responses, counting water at power plants." Don't attach 519 mL to the Washington Post. |
| Myth | Google 0.26 mL, Altman | 🟡 company claims | "Google says its median text prompt uses about five drops on site"; Altman: "about one fifteenth of a teaspoon", no method published. |

---

## Script check (fact-checker, 2026-11-01, first draft of script.txt, line numbers = script.txt lines)

Verdict: **FAIL** until the 2 REQUIRED fixes are made (line 57 and Short hook 4). Everything else is ✅ or 🟡 with the optional wording below. Re-quoted this pass: Pacific Institute hot-periods lines; Karimi abstract (via the Arizona record); EPA Quincy; Alston arXiv abstract; Google 2022 blog (Douglas County); EPA p. 196 (cycles definition); NAE abstract via the LBNL record ("nearly all electricity is converted into heat").

| Ch / line | Claim | Status | Fix |
|---|---|---|---|
| 1 / 3-4 | towns pushing back; water one of the biggest complaints; tens of millions of gallons | ✅ | See section O and H. |
| 1 / 6 | most leaves through the roof as vapor | ✅ at a tower site | Pacific's 74% is an estimate (assumed ratio for 29 of 65 sites) and 75-83% is 🧮 from the FEMP formula; "at a tower site" is already implied by line 36. |
| 1 / 8 | nearly all the electricity turns into heat | ✅ | NAE abstract, "nearly all electricity is converted into heat" (via the LBNL record). Flag resolved. |
| 1 / 9-11 | rack → hot air → coils of cold water → pipes → tower on the roof | 🟡 generic | Real, common design (LBNL: chillers pair with room air handlers and reject heat via cooling towers), but not the only layout (two water loops; liquid-to-chip). Disclose as illustrative: "a typical layout". Optional wording: "In many data centers, the hot air passes over coils of cold water." |
| 1 / 12-13 | evaporation takes heat away; one gallon ≈ 1 h 40 min of a space heater | ✅ 🧮 | FEMP/EPA quotes. Heater assumed 1,500 W (disclose as illustrative assumption); optional "a 1,500-watt space heater" in the Short hook. |
| 1 / 14 | warming 10°F carries a hundredth; "which is why towers let water evaporate" | ✅ 🧮; inference is sound | Ruling: fine. 83 BTU vs 8,760 BTU (105×); EPA's "1 percent per 10°F" rule is the same fact. Towers also shed a little heat by warming air, so keep "rely on evaporation" if you want it tighter. |
| 1 / 15 | most water in hot weather, "the Pacific Institute found" | 🟡 | Pacific states it ("concentrated during hot periods when cooling needs are highest") but cites no study for it. Say "the Pacific Institute says". |
| 1 / 16 | 44 M gal, about 400 families | ✅ 🧮 | 44.3 M ÷ (300 gal × 365 = 109,500) = 405. EPA says "more than 300 gallons per day" (How We Use Water, updated 2026-08-04), so "about 400" is an upper bound; withdrawal vs household use, fine. |
| 1 / 17 | most of the water pulled in was drinking water | ✅ | Pacific: "76% was potable water" (65 facilities). |
| 2 / 22 | reuses water, several times | ✅ company claim in the source | Microsoft: "between 2–5 times"; Quincy 4-5 (EPA). |
| 2 / 23-24 | only water leaves; minerals stay; cycles of concentration | ✅ | EPA p. 195 and p. 196. |
| 2 / 25 | at four cycles, about four times the minerals; EPA: many towers 2-4 | ✅ | EPA p. 196: ratio of TDS (conductivity) in blowdown to make-up water. Loop water is about four times as concentrated, not table-salt. "four times the minerals" is fair; "four times as mineral-heavy" is tighter. EPA p. 199 quote ✅. |
| 2 / 26-27 | scale, corrosion, bacteria, chemicals | ✅ | FEMP. Kettle crust illustrative. |
| 2 / 28 | "a valve drains off some", blowdown | ✅ (valve is illustrative detail) | FEMP defines blowdown; EPA mentions automatic blowdown control. Disclose the valve visual as illustrative. |
| 2 / 29 | fresh water replaces it and what evaporated | ✅ | FEMP makeup definition. |
| 2 / 30 | at four cycles, 3/4 vapor, 1/4 drained | ✅ 🧮 | (C−1)/C = 75%; ignores drift and leaks, "about" covers it. |
| 2 / 31 | 3 → 6 cycles cuts drained water about half, EPA says | ✅ attributed | EPA p. 199: "blowdown by 50 percent". Math gives 60%; "about half, the EPA says" is correct. |
| 3 / 36-37 | most vapor; rest usually to the sewer, under local rules | ✅ | Microsoft: "in compliance with local regulations"; Ohio EPA. |
| 3 / 38 | Ohio EPA told lawmakers in May that most send wastewater to those plants | ✅ | John Logue, Ohio EPA Director, written testimony to the House Select Committee on Data Centers, 2026-05-27. It is written testimony; "told" is acceptable, "wrote to" is exact. |
| 3 / 39 | straight into a river takes a federal permit | ✅ | NPDES under the Clean Water Act (usually state-issued). Optional: "a Clean Water Act permit". |
| 3 / 40 | draft Ohio permit: limits on minerals, chlorine, acidity | ✅ | Bricker 2025-12-02: pH, TDS ("total filterable residue"), chlorine and oxidants. Ohio later dropped the statewide draft (WWD, Circle of Blue, 2026-07-22). Optional: "A draft permit Ohio proposed". True as worded; don't add the controversy. "Acidity" = pH, fine. |
| 3 / 41 | Clean Water Act lists heat next to sand and rock | ✅ | 33 USC 1362(6): "heat, wrecked or discarded equipment, rock, sand, cellar dirt". |
| 3 / 43 | Quincy cleans a Microsoft data center's drained water, sends it back | ✅ | EPA: the city's Quincy Water Reuse Utility "treats cooling water from a Microsoft data center and recirculates it". Legally sensitive. |
| 3 / 44 | Microsoft agreed to cover $31 million; EPA estimates 138 M gal/yr | ✅ with wording | EPA: agreement stipulates Microsoft "would entirely finance the capital investments and related costs ($31 million)"; "agreed" is fair. The EPA page says "an estimated 138 million gallons" without naming who estimated, so "the EPA estimates" slightly overstates. Wording: "and the EPA's case study puts the saving at an estimated 138 million gallons a year." |
| 3 / 45 | salt ends up in lined ponds | ✅ | EPA: "lined brine ponds". |
| 3 / 46 | "even in Quincy, the towers still send water into the air" | ✅ | EPA: "water evaporates during the cooling process"; blowdown "recirculated back to the cooling towers". |
| 4 / 50-51 | air-cooled machines, like a car radiator; use no water, more energy | ✅ | LBNL quote re-read: "While air-cooled chillers use no water, they use more energy." Radiator is illustrative. |
| 4 / 52-54 | Microsoft design: fill once; avoid >125 M L (33 M gal); "nominal" | ✅ company claim, projection | 125 M L = 33.0 M gal 🧮. "Nominal" is Microsoft's word for the energy increase. Legally sensitive. |
| 4 / 55-56 | electricity uses water; 12× in 2023 | ✅ | LBNL ~800 B L vs 66 B L = 12.1×. |
| 4 / 57 | Phoenix: air-cooled chillers "used the most water overall once the power plants were counted" | ❌ **REQUIRED fix** | Karimi's abstract says air-cooled chillers "consume the most energy and source water" and water-cooled have the highest on-site water. It says nothing about total water, and the Alston preprint finds air cooling *halves* total water. "Most water overall" is unsupported. Replacement: "When researchers modeled data centers in Phoenix, air-cooled chillers used the most electricity, and the most water at the power plants." ("source water" isn't defined on the page I read; if the scriptwriter wants this exact, someone should open the paper's definition. Safer: "...air-cooled chillers used the most energy, which shifts water use to the power plants.") |
| 4 / 58-59 | bottle myth: ~500 mL for 10-50 answers from an older model, counting power plants | ✅ | Li et al.: "roughly 10 – 50 medium-length responses", "depending on when and where it is deployed", GPT-3, scope 1 + 2. Line 58 ("a claim you may have heard") is a framing, not a sourced fact; fine, no Washington Post attribution. Optional "medium-length" before "answers". |
| 4 / 60-61 | Google, Douglas County, local wastewater that would otherwise go into the Chattahoochee | ✅ attributed, dated | Google 2022-11-21: "recycling local municipal wastewater that would otherwise be deposited in the Chattahoochee River." Present-tense "cools with" overstates a 2022 blog; wording: "Google said in 2022 its Douglas County, Georgia data center cools with local wastewater that would otherwise go into the Chattahoochee River." (Same blog says leftover water is treated and returned to the river, so no conflict with the permit line.) Legally sensitive. |
| 4 / 62-64 | recap; "part of the water it saves then gets used up at a power plant" | ✅ with line 57 fixed | Alston preprint (arXiv 2026-09-21, not peer-reviewed): air cooling halves total water and raises indirect water by one-third. "Part of" matches (net saving). It depends on the grid; say "can get used up". Not "all". |
| 4 / 65-66 | "ask about its electricity too"; Part 2 | ✅ not a factual claim | Neutral. No politics. |
| Hook 1 | one gallon ≈ space heater 1 h 40 min | ✅ 🧮 | As line 13. |
| Hook 2 | water goes around several times, then some is drained and replaced | ✅ | As Ch 2. |
| Hook 3 | most of a data center's cooling water goes up as vapor, the rest usually to the sewer | ✅ for a tower site | "a data center that cools with towers". Legal/accuracy: not all data centers evaporate (H table). |
| Hook 4 | "cooled with no water at all, but it takes more electricity, and power plants use water too" | ❌ **REQUIRED fix** | "No water at all" overstates: Microsoft's claim is zero water for *cooling*, and sites still use water for restrooms and other uses. Wording: "A data center can be cooled with no cooling water at all, but it takes more electricity, and power plants use water too." |

**Illustrative items to disclose in the post description ("Illustrative: …")**: the hot afternoon and "this data center" (a composite site, not a real one); the rack-to-coils-to-tower path as a typical layout; the kettle comparison; the car-radiator comparison; the blowdown valve and chemical-pump visuals; the 1,500-watt space heater used to size the heat comparison; reading "400 families" as an approximate calculation.

**Legally sensitive (named companies, agencies, people):** Microsoft (Quincy, 125 M L, "nominal"), Google (Douglas County, 2022), Ohio EPA (Logue testimony), EPA (Quincy, 138 M gal), UC Riverside authors (Li et al.). No politics found in the script.

---

## Script check, pass 3 (fact-checker, 2026-11-01, script revised after pass 2; line numbers = script.txt lines)

Verdict: **FAIL** until the 1 REQUIRED fix (line 9) is made. Re-opened this pass: JLARC Report 598 (via r.jina.ai), Data Center Knowledge on Uptime's 2026 survey, SemiAnalysis GB200 piece, Microsoft blog 2024-12-09 (Solomon), EPA Quincy case study (archived). NAE page: still behind the verification wall (not opened).

| Line | Claim | Status | Finding / fix |
|---|---|---|---|
| 7 | power use of these buildings changed in the last few years | ✅ | LBNL: 76 TWh (2018) to 176 TWh (2023), 1.9% to 4.4% of US electricity (see 1.W3). |
| 8 | "used to need a few megawatts, and Virginia's state auditors say a typical one now needs more than a hundred" | ✅ attributed (legally sensitive: a state agency) | JLARC Report 598, Ch 1, p. 5, re-quoted: "the capacity of a typical data center has increased from requiring only a few megawatts of power to more than 100 megawatts". The sentence is industry-wide, not Virginia-only, and cites no sub-source in the text I read. It is JLARC's own claim; "Virginia's state auditors say" is the right attribution. Keep the attribution, never drop it. Same report says "a larger data center can require 100 or more megawatts" (p. 3), so the "typical" claim is the strong one. Don't set it beside the Pacific Institute median site (44 M gal/yr) as if they describe the same buildings. |
| 9 | "Most server racks still draw under 10 kilowatts, an industry survey finds" | ❌ **REQUIRED fix** | Uptime 2026 (via Data Center Knowledge, 2026-07-31): "the average sits at 7.8 kW" (excluding a few facilities designed for above 30 kW) and "The modal rack density (the most commonly reported density) reached 11 kW". The most common rack is over 10 kW, and no share of racks under 10 kW is given, so "most ... under 10" is not supported. The average is under 10. |
| 9 | "a rack of today's AI chips draws around 120" | 🟡 | SemiAnalysis, 2024-07-17: "This form factor requires approximately 120kW per rack" (GB200 NVL72, one product; analyst estimate, not the survey). The "an industry survey finds" clause covers only the first half, which is fine, but "today's AI chips" implies all of them. Hedge: "some of today's AI chips". |
| 10 | nearly all the electricity turns into heat | ✅ | NAE abstract via the LBNL record: "nearly all electricity is converted into heat". NAE page itself not opened; the quote is from the record. |
| 11 | "At many data centers, water carries that heat away" | ✅ hedged | "Many" is right. LBNL: water-cooled chillers release heat "via cooling towers"; Pacific Institute: median site consumes 74% of withdrawn water (some assumed). Not all (air-cooled sites exist, see Ch 4). Don't change to "most" or "all". |
| 6 | "Most of it leaves through the roof, as vapor." | ✅ at a tower site | As pass 2 (74% Pacific, 75% at four cycles 🧮). |
| Opener candidate | "Most of it leaves through the roof, as vapor, and by the end we'll be up there watching it go." | ✅ no false fact | Structure line. Ch 4 does return to the roof ("Back on the roof"). Note it repeats line 6 if both stay. |
| Hooks 1-4 | four "> Short hook:" lines | ✅ | Hook 1 "can use up tens of millions" (Pacific median 44.3 M withdrawn; ✅ H). Hook 2 matches Ch 2. Hook 3 "pipe that water into the nearest river" matches Ch 3 and says nothing wrong (the permit point is in line 42). **Hook 4 says "no cooling water at all", which resolves the pass 2 "no water at all" ❌.** |
| 54 | Microsoft design fills loop once, circulates from then on | ✅ company claim | Solomon, 2024-12-09: "Once the system is filled during construction, it will continually circulate water". Legally sensitive. |
| 55 | "each of those data centers will avoid more than 125 million liters a year, about 33 million gallons" | ✅ company projection | "this design will avoid the need for more than 125 million liters of water per year per datacenter." 125 M L = 33.0 M gal 🧮. |
| 56-57 | order: Berkeley Lab (air-cooled use more energy), then Microsoft calls its own increase nominal | ✅ order and attribution correct | LBNL: "While air-cooled chillers use no water, they use more energy." Microsoft: "The result is a nominal increase in our annual energy usage compared to our evaporative datacenter designs across the global fleet." "Its own increase" = the increase from its design, in Microsoft's word. Nothing independent says "nominal", and the script attributes it to Microsoft, as required. Legally sensitive. |
| 48 | "Microsoft agreed to cover the system's $31 million cost, and the EPA's case study puts the saving at an estimated 138 million gallons a year" | ✅ | EPA case study (archived, updated 2024-12-31): "Microsoft would entirely finance the capital investments and related costs ($31 million) to build the new infrastructure"; "saving an estimated 138 million gallons of water per year (522 million liters per year)". The page does not say who made the estimate, and the saving is of potable groundwater for cooling. "The EPA's case study puts the saving at an estimated" is accurate. |
| Cuts | Phoenix, bottle myth, Georgia, Ohio testimony | ✅ not relied on | Script no longer contains Phoenix (Karimi), the bottle claim (Li et al.), Douglas County, Georgia, or Logue's testimony. Line 41 ("usually goes down the sewer ... under local rules") now rests on Microsoft's blog ("typically discharged back to the local wastewater treatment plant", "in compliance with local regulations"), still ✅. Line 43 uses the Ohio draft permit via Bricker, not the testimony, still ✅. |

**Required fix (exact wording), line 9:** "The average server rack still draws under 8 kilowatts, an industry survey finds, but a rack of some of today's AI chips draws around 120."
Alternative that keeps "most": none supported. Don't use "most racks" or "typical rack under 10".

**Legally sensitive (this pass):** Virginia JLARC (state agency, "typical" claim), Microsoft (125 M L, "nominal", fill-once design, Quincy $31 M), EPA (Quincy 138 M gal).

---

## Script check, pass 4 (fact-checker, 2026-11-01, script revision 3; line numbers = script.txt lines)

Verdict: **PASS** (no ❌). The pass 3 ❌ on the rack line is fixed. No sources re-opened this pass beyond passes 1-3 (all quotes below were re-quoted then); only the changed wording was checked against them.

| Line | Claim | Status | Note |
|---|---|---|---|
| 10 | "the average server rack still draws under 8 kilowatts, an industry survey finds, but a rack of some of today's AI chips draws around 120" | ✅ | Uptime 2026 via Data Center Knowledge: "the average sits at 7.8 kW" (excludes a few facilities designed above 30 kW). SemiAnalysis: "approximately 120kW per rack" (GB200 NVL72), hedged by "some of". |
| 8 | buildings use a lot more power than a few years ago | ✅ | LBNL: 76 TWh (2018) to 176 TWh (2023). |
| 12 | "At many data centers, including this one, water carries that heat away" | ✅ / 🎭 | "Many" hedged (LBNL cooling towers). "This one" is the illustrative composite site; disclose it. |
| 17 | "On each trip down, a small part of the water evaporates" | ✅ | FEMP: "a portion of the water is evaporated"; EPA ~1% per 10°F of cooling. |
| 19 | warming the gallon 10°F "without evaporating it" carries off about a hundredth | ✅ 🧮 | 83 BTU vs 8,760 BTU (105x); EPA's 1%-per-10°F rule. |
| 21-23 | typical site run by a big tech company in the institute's study pulled in about 44 million gallons; about 400 families; most was drinking water | ✅ | Pacific Institute median 44.3 M gal/yr (65 facilities, worldwide); 76% potable; 400 families is an upper-bound 🧮. Scope now stated ("in the institute's study"). |
| 51 | Quincy "pipes it back for the towers to use again" | ✅ | EPA: the utility "treats cooling water from a Microsoft data center and recirculates it"; blowdown "recirculated back to the cooling towers". Legally sensitive. |
| 53-54 | Microsoft covers $31 M; "the EPA's case study puts the water saving at an estimated 138 million gallons a year" | ✅ | As pass 3. |
| 64 | "while air-cooled machines use no water, they use more energy, Berkeley Lab says" | ✅ attributed | LBNL: "While air-cooled chillers use no water, they use more energy." Optional for consistency with hook 4: "use no cooling water". |
| 65 | "For its new design, Microsoft calls the increase in energy use nominal, meaning small" | ✅ | Solomon, 2024-12-09: "a nominal increase in our annual energy usage compared to our evaporative datacenter designs". "Meaning small" is the script's plain-language gloss, not Microsoft's; fair. Legally sensitive. |
| 67 | "Across the US in 2023, the water used to make data centers' electricity was about 12 times what they used up on site, Berkeley Lab found" | ✅ | LBNL: indirect water footprint nearly 800 B L vs 66 B L consumed on site = 12.1x (national average 4.52 L/kWh of indirect water consumption). Scope (US, 2023) now stated. |
| Hooks 1-4 | four "Short hook" lines | ✅ | Hook 2 ("tower already reuses that water several times"): Microsoft 2-5 cycles, Quincy 4-5 (EPA). Hook 3 is a question matching lines 45-49. Hook 4: "no cooling water at all" is Microsoft's claim; "why doesn't every data center" is a question. Hook 1 "tens of millions" as before. |
| Closers 25, 41, 56, 71-72 | chapter-end questions and the Part 2 hand-off | ✅ | Questions and framing, no factual claims. Line 56 "without evaporating any water at all" is a question about cooling, consistent with Ch 4. |

**Illustrative to disclose (unchanged):** the hot afternoon and "this data center/this one" (composite site); rack-to-coils-to-tower layout; kettle; car radiator; blowdown valve and chemical pumps; 1,500 W space heater; "400 families" as a calculation.
**Legally sensitive:** Microsoft (Quincy, 125 M L, "nominal", fill-once design), EPA (Quincy 138 M gal), Virginia JLARC (line 9 "typical"), Berkeley Lab (12x).

---

## Key facts in one screen

1. **Mechanism (independent, DOE/FEMP):** in a cooling tower, "a portion of the water is evaporated into the air passing through the tower. As the water evaporates, the air absorbs heat, which lowers the temperature of the remaining water." EPA: evaporation "is the method that transfers heat from the cooling tower system to the environment."
2. **One gallon evaporated carries off about 8,800 BTU (about 2.6 kWh) of heat** 🧮. That's about as much heat as a 1,500 W space heater puts out in 1 h 40 min, and about 100 times what the same gallon absorbs if you only warm it by 10°F. EPA's rule of thumb agrees: a tower evaporates "approximately 1 percent of the rate of recirculating water flow for every 10°F in temperature drop."
3. **US total (independent, LBNL Dec 2024):** US data centers directly consumed **66 billion liters (about 17.4 billion gallons) in 2023**, up from 21.2 billion liters (5.6 billion gallons) in 2014. Hyperscale and colocation sites are 84% of it. Water used *off-site* to make their electricity: **nearly 800 billion liters (about 211 billion gallons)**, about 12 times the on-site figure.
4. **One site (company claim, Google):** Council Bluffs, Iowa, Google's biggest consumer, **about 1.3 billion gallons consumed in 2025** (about 3.6 million gallons a day 🧮; withdrawal 1,746 million gallons). In 2021 Google said its *average* data center consumed **about 450,000 gallons a day**.
5. **Typical site (independent, Pacific Institute, Sept 2026, 65 large facilities worldwide, 2024–25 data):** median withdrawal **44.3 million gallons a year** (121,000 gallons a day); average 159 million. The median facility consumed **74%** of what it withdrew, and **76%** of the water withdrawn was potable. Peak daily demand can run **3 to 30 times** the average, concentrated in hot periods.
6. **Familiar comparisons** 🧮: the median site (44.3 million gal/yr) is about **400 US families' home water use** (EPA: a family uses "more than 300 gallons of water per day at home"), and about **one average US golf facility** (about 38 million gal/yr, from GCSAA's national total). Council Bluffs is about **12,000 families**.
7. **Cycles and blowdown (independent, EPA/DOE):** the water is reused, with "many systems" at "two to four cycles of concentration, while six cycles or more might be possible." Evaporation leaves the minerals behind, so some concentrated water (blowdown) has to be drained and replaced with fresh makeup water: blowdown = evaporation ÷ (cycles − 1). At 4–6 cycles, 75–83% of the water evaporates 🧮. Loudoun County gives "between 75 and 85 percent" for open-loop cooling.
8. **Where blowdown goes:** usually the city sewer. Microsoft: the remainder "is typically discharged back to the local wastewater treatment plant." In Ohio (2026), "most data centers... discharge wastewater to municipal wastewater treatment plants," and only one holds a direct-discharge NPDES permit. Heat itself is a "pollutant" under the Clean Water Act.
9. **No-water cooling costs power (independent, LBNL):** "While air-cooled chillers use no water, they use more energy." Microsoft's zero-water design avoids "more than 125 million liters" (33 million gallons) a year per data center, at "a nominal increase in our annual energy usage" (company claim). Google: water-cooled sites "use about 10% less energy" (company claim). A peer-reviewed Phoenix model: air-cooled chillers "consume the most energy and source water."
10. **Hand-off to Part 2:** making US electricity consumes on average **4.52 L/kWh (about 1.2 gal/kWh)** off-site (LBNL), more than ten times Microsoft's reported on-site 0.30 L/kWh. Switching to air cooling shifts water to power plants: one preprint finds air cooling halves total water at the site but raises indirect water "by one-third."

---

## H. The hook: "A data center can evaporate millions of gallons of water a year, and that's not a leak, it's how it stays cool."

| Part | Evidence | Status |
|---|---|---|
| "evaporate millions of gallons of water a year" | Conservative. Median large facility: 44.3 M gal/yr withdrawn and 74% consumed, so about 33 M gal/yr gone 🧮 (Pacific Institute, global sample, 2024–25). Microsoft: its zero-water design avoids >125 M L = 33 M gal/yr per data center, which implies about that much was evaporated before (company claim). Google 2021 average: 450,000 gal/day = 164 M gal/yr consumed (company claim). Council Bluffs 2025: 1.3 B gal (company claim). "Consumed" ≈ evaporated for cooling towers, but not exactly (some is drift or other uses). | ✅ for "tens of millions" with "can" (fact-check: Pacific median 44.3 M withdrawn re-quoted; Google 2021 average 450,000 gal/day = 164 M/yr re-quoted; Council Bluffs 1,346 M consumed re-quoted; Microsoft's "avoid >125 M L" is a projection, and "implies it evaporated that much" is our inference, not Microsoft's words). No source gives a data-center *evaporation* volume: "consumed" is the measured term, so say "evaporate" only with "consumed, mostly by evaporation" in the description. |
| "that's not a leak, it's how it stays cool" | DOE/FEMP and EPA describe evaporation as the cooling mechanism itself (claims 1–2). | ✅ |
| Implied "every data center does this" | Not all of them. Many sites use outside air most of the year and evaporate only on hot days (Microsoft: above 85°F; in Georgia, "the hottest roughly 55 days"). Some sites use no evaporation at all (air-cooled chillers, Microsoft's new design). The script should say "a data center *can*" or "*this* data center", as the working hook already does. | 🟡 keep "can" |

**Recommended hook wording (all ✅ with attribution in the description):** "A big data center can evaporate tens of millions of gallons of water a year. That isn't a leak. It's how the building stays cool."

---

## O. The controversy opener (owner's new hook and title, added 2026-11-01)

New hook direction: "Towns across the US are pushing back on new data centers, and one of the biggest complaints is water. A big one can use up tens of millions of gallons a year. So where does all that water go?" Title direction: "Why are people fighting data centers? Part 1: the water."

**Fact-check pass 2 (2026-11-01, fact-checker), section O re-quoted at the pages:**

| Item | Status | Finding |
|---|---|---|
| O3 Gallup "seven in 10 oppose AI data centers in their local area", 71%, 48% strongly | ✅ | Re-quoted. Jeffrey M. Jones, 2026-05-13. Phone survey (Recon MR) 2026-03-02 to 03-18, n=1,000, ±4. |
| O4 reasons: half "excessive use of resources", 18% each water and energy, 16% pollution incl. noise, ~1 in 5 economic | ✅ | Re-quoted. Open-ended web survey of Gallup Panel, 2026-04-01 to 04-15; opponents n=1,561, ±3. "About one in five" for costs comes from "a similar share" next to "about one in five" quality-of-life, so say "about one in five". |
| O1 Data Center Watch Q1 2026: at least 75 projects, "approximately $130 billion", 49 states | ✅ attributed | Re-quoted. Page has no publication date (window Jan-Mar 2026). |
| O1 2025: "at least $156 billion", 42 states | ✅ attributed | Re-quoted (TL;DR). Window Jul-Dec 2025. |
| O1 first report $64 B ($18 B blocked, $46 B delayed) | ✅ attributed | Re-quoted, with definitions. The page itself warns that blaming delays only on opposition "oversimplifies a complex landscape". Don't add this to the other totals. |
| O1 "Data Center Watch is a 10a Labs project, industry-side" | ❌ unsupported | None of the three Data Center Watch pages names 10a Labs or any operator (contact email only), and a search found no link between the two. Don't say it. Say "a tracker called Data Center Watch" and nothing about its sponsor. |
| O1 Q2 2026: 45 projects, $68 B, 843 groups | 🟡 secondary | Only via AI Weekly (2026-09-21), which attributes it to Bloomberg; Bloomberg not opened. Skip or attribute "Bloomberg reported, citing Data Center Watch". |
| O2 Heatmap: at least 20 canceled in Q1 2026, a record; ~100 new fights; more than $41.7 B | ✅ attributed | Re-quoted. Robinson Meyer, 2026-05-06. Heatmap's "at least $260 billion" and S&P's 294 moratoriums stay snippets (🟡, not opened). |
| O5 Tucson Project Blue, unanimous vote 2025-08-06 | ✅ for vote; 🟡 for "after residents raised water concerns" | AZ Luminaria re-quoted: voted "unanimously", "effectively shuts down one of the largest development projects ever considered by the city", calls it "water-devouring" (the outlet's own description). It does not detail residents' water concerns; the azfamily quote ("Some residents and council members raised concerns over water use") wasn't re-opened. Write "amid water concerns" and attribute. Don't say the project is dead (KJZZ snippet says it may proceed on county land). |
| O6 St. Charles MO: unanimous one-year ban (2025-08-22), 7-1 permanent ban (2026-05-19) | ✅ | Both re-quoted (STLPR; KFVS12). Residents cited "its potential to contaminate water", "issues with our water", "water and noise pollution". Water was one of several concerns. |
| O7 Pinal County La Osa, 4-1 reject, 2026-08-26 | ✅ | Re-quoted (KJZZ). Wells quote is one resident's. Residents say the aquifer is overdrawn; supervisors also questioned the 500 MW gas plant covering half of 1 GW demand, so say "water was among the concerns". 600 acre-feet "close to 200 million gallons". Both sides in the story. |

**Opener ruling.** "Towns across the US are pushing back on new data centers" ✅ (Gallup plus two trackers; attribute the trackers, not "everywhere"). "one of the biggest complaints is water" ✅ (Gallup 18% water, tied with energy, inside half naming resource use; never "the biggest"). "A big one can use up tens of millions of gallons a year" ✅ (hook ruling above; "use up" = consumed is actually the better verb than "evaporate"). "So where does all that water go?" is a question, no claim. **Title "Why are people fighting data centers? Part 1: the water"**: not a factual claim, ✅; it implies water is a reason for the fights, which Gallup supports. No politics used (O1 party split and S&P election framing stay out).

**Verdict on the first sentence (researcher's note, kept):** ✅ as worded, with one tweak to keep it honest.
- **"Towns across the US are pushing back on new data centers":** ✅. Two separate trackers agree on the scale, and so does a national poll (O1–O3).
- **"one of the biggest complaints is water":** ✅. Gallup (O4) finds water tied with energy as the most-named single resource concern among opponents, at 18% each. Don't say "*the* biggest". Electricity and bills get as many mentions in Gallup and more in national news.
- **Second sentence:** ✅ (see H and 1.9).
- **Title:** "Why are people fighting data centers?" is fine as a question.

**Safe wording:** see O8.

### O1. Local opposition has blocked or delayed tens of billions of dollars of US data center projects (tracker counts)

- **Script (expected):** "Towns across the US are pushing back on new data centers."
- **Status:** ✅ (tool) for "pushing back, across the US". 🟡 for any dollar figure, which must be attributed to the tracker.
- **Source:** [Q1 2026: Data Center Watch Report](https://datacenterwatch.org/q1-2026), Data Center Watch (a 10a Labs project), undated page (research window Jan–Mar 2026)
- **Quote (tool):** at least 75 projects worth "approximately $130 billion" were blocked or delayed in Q1 2026, "roughly matching the scale of all of 2025 in just three months"; opposition groups "more than doubled since the end of Q4 2025, now spanning 49 states" (partly paraphrased by the tool; re-quote)
- **Source:** [Q3–Q4 2025 Update](https://www.datacenterwatch.org/q3-q4-2025), Data Center Watch, undated (research window Jul–Dec 2025)
- **Quote (tool):** projects "with publicly disclosed values totaling at least **$156 billion**" were blocked or delayed in 2025; hundreds of local groups were active "across 42 U.S. states"
- **Source (Q2 2026, secondary):** [Data Center Watch: 45 US AI Data Center Projects Worth $68B Blocked or Delayed in Q2 2026](https://aiweekly.co/alerts/data-center-watch-45-us-ai-data-center-projects-worth-68b-blocked-or-delayed-in), AI Weekly, 2026-09-21, summarising Bloomberg ([original](https://www.bloomberg.com/news/articles/2026-09-21/new-data-centers-worth-68-billion-disrupted-in-us-data-show), not opened)
- **Quote (tool):** "45 US data center projects worth $68B were blocked or delayed by local opposition between April and June 2026" / "843 opposition groups now operate across 49 states (Hawaii excepted)"
- **Source (first report, definitions):** [$64 billion of data center projects have been blocked or delayed amid local opposition](https://www.datacenterwatch.org/report), Data Center Watch, research window May 2024–Mar 2025
- **Quote (tool):** "Blocked" means "development has been definitively halted"; "Delayed" means the timeline is disrupted but the developer is still pursuing approvals. $18 B blocked and $46 B delayed.
- **Note (fact-check: the 10a Labs link is ❌ unverified, see the pass 2 table; ignore the industry-side claim):** Its "delayed" category is broad, and the first report listed only 16 projects. Its definitions and Heatmap's differ, so the two totals can't be added or compared. Say "trackers count dozens of projects blocked or delayed", or attribute the figure: "one tracker, Data Center Watch, counted about $130 billion in the first quarter of 2026 alone." The first report also includes a party split of officials; **don't use it (no politics).**

### O2. A second tracker counts record cancellations (Heatmap)

- **Script (optional):** "Another tracker counted a record twenty cancellations after local pushback in just three months."
- **Status:** ✅ (tool), attributed
- **Source:** [local-opposition-data-center-cancellations](https://heatmap.news/politics/local-opposition-data-center-cancellations), Robinson Meyer, Heatmap, 2026-05-06
- **Quote (tool):** at least 20 projects were canceled after local pushback in Q1 2026, "smashing a record set only in the previous quarter"; Heatmap Pro added "roughly 100 new data center fights to their database" in Q1 2026 (partly paraphrased; re-quote). Canceled projects were worth more than $41.7 B; about 25 were canceled in all of 2025.
- **Lead (snippet, not opened):** a later Heatmap piece says "at least $260 billion" was canceled in 2026 after local opposition ([link](https://heatmap.news/daily/260-billion-data-center-opposition), paywalled). Separately, S&P Global, citing Programs.com, reports local governments adopted 294 moratoriums and bans from January through July 2026 ([link](https://www.spglobal.com/energy/en/news-research/latest-news/electric-power/100126-data-center-backlash-shapes-midterm-ballots-campaigns-across-us), not opened; the article frames this around elections, so use the number only if a neutral source confirms it).

### O3. Most Americans oppose an AI data center in their own area (Gallup, 2026)

- **Script (optional):** "In a Gallup poll this spring, seven in ten Americans said they'd oppose one in their area."
- **Status:** ✅ (tool)
- **Source:** [Americans Oppose AI Data Centers in Their Area](https://news.gallup.com/poll/709772/americans-oppose-data-centers-area.aspx), Jeffrey M. Jones, Gallup, 2026-05-13
- **Quote (tool):** "Seven in 10 Americans oppose constructing data centers for artificial intelligence in their local area." 71% oppose, 48% strongly, and about a quarter favor.
- **Note:** Telephone survey (Recon MR), 2026-03-02 to 03-18, 1,000 US adults, ±4 points. The question is about *AI* data centers *in their local area*, so say exactly that.

### O4. What opponents cite, counted: resource use first; water and energy tied at 18%

- **Script (expected):** "...and one of the biggest complaints is water."
- **Status:** ✅ (tool)
- **Source:** Gallup 2026-05-13 (O3)
- **Quote (tool):** "Half of opponents mention data centers' excessive use of resources" / "including 18% each mentioning their use of water and energy." / "Sixteen percent mention a related environmental concern of pollution, including noise pollution and air and water pollution." / "A similar share mention potentially negative economic consequences, including higher utility bills"
- **Note:** The "similar share" (bills and costs) is about one in five, like quality-of-life concerns (traffic, growth, other uses for the land). Open-ended answers, Gallup Panel web survey 2026-04-01 to 04-15, opponents n=1,561, ±3 points. **Ranking:** "resource use" is the top category, and inside it water and energy are tied. So water is "one of the biggest", not "the biggest". Water also shows up in the 16% pollution answers ("water pollution"), but don't add the two together. This is national opinion, not a count of local fights.
- **Supporting (local records, 🟡):** [Why do communities oppose data centers?](https://www.compute-atlas.com/learn/why-do-communities-oppose-data-centers), Compute Atlas (independent one-person project by Edward Kubiak), records reviewed August 2026. **Quote (tool):** its review of local friction records "found water raised most often", ahead of noise, complaints about the approval process, and air quality; electricity appeared less often than any of those. It covers 536 facilities with documented friction, but publishes no per-concern counts and says the order reflects "what reporting captured, not what was felt". Use as a lead only.
- **Unranked list (✅ tool):** Data Center Watch's first report says common themes are "higher utility bills, water consumption, noise, impact on property value, and green space preservation."
- **Counterweight:** national reporting often leads with electricity bills (NBC News, 2025-11-14, Allan Smith: backlash over "rising electricity bills"; the article doesn't mention water). That's another reason to keep "one of".

### O5. Example: Tucson, Arizona, "Project Blue" (August 2025)

- **Script (optional):** "In Tucson, Arizona, the city council voted unanimously in 2025 to end talks on a huge data center after residents raised water concerns."
- **Status:** ✅ (tool)
- **Source:** [Tucson City Council rejects Project Blue amid intense community pressure](https://azluminaria.org/2025/08/06/tucson-city-council-rejects-project-blue-amid-intense-community-pressure/), Yana Kunichoff, AZ Luminaria, 2025-08-06 (updated 2025-08-19)
- **Quote (tool):** the unanimous vote "effectively shuts down one of the largest development projects ever considered by the city." The council ended negotiations and pulled the annexation and development agreement, which the developer needed to get city water. The site was 290 acres.
- **Source:** [Tucson rejects Amazon-linked data center amid water, energy concerns](https://www.azfamily.com/2025/08/09/tucson-rejects-amazon-linked-data-center-amid-water-energy-concerns/), Alexandra Rangel, azfamily (KTVK/KPHO), 2025-08-08
- **Quote (tool):** "Some residents and council members raised concerns over water use," along with energy demands and ratepayer costs. The developer (Beale Infrastructure) said the project would have been "net water positive", relying mainly on reclaimed water.
- **Note:** Give both sides: residents' water concern and the developer's reclaimed-water plan. Later reporting ((snippet), KJZZ 2026-05-29) says the project may be going ahead on county land outside city limits, at up to 31 million gallons a year. I didn't open it; don't claim it's dead.

### O6. Example: St. Charles, Missouri, moratorium then ban (August 2025, May 2026)

- **Script (optional):** "In St. Charles, Missouri, the city paused all data center applications for a year, then voted to ban them, with residents pointing to the city's well water."
- **Status:** ✅ (tool)
- **Source:** [St. Charles City Council approves 1-year ban on data center applications](https://www.stlpr.org/news-briefs/2025-08-22/st-charles-city-council-1-year-ban-data-center-applications), Kate Grumke, St. Louis Public Radio, 2025-08-22
- **Quote (tool):** a unanimous "one-year ban on data center applications"; residents criticized "the secrecy around the project and its potential to contaminate water." The developer withdrew its zoning application.
- **Source:** [St. Charles City Council votes to permanently ban data centers](https://www.kfvs12.com/2026/05/20/st-charles-city-council-votes-permanently-ban-data-centers/), First Alert 4 staff (KFVS12), 2026-05-19
- **Quote (tool):** "The city council voted 7-1 in favor of the proposed ban." / a local group's president: "We were already kind of running into issues with our water." The city has "existing issues with its water well heads and contamination."
- **Note:** The developer says the project would have paid for water-system upgrades ([First Alert 4, 2026-05-18](https://www.firstalert4.com/2026/05/18/st-charles-weighs-data-center-ban-developer-says-project-would-have-upgraded-water-system/), (snippet)). Mention that if the example runs long. Avoid the DCD article about a national politician praising residents (politics).

### O7. Example: Pinal County, Arizona, La Osa (August 2026)

- **Script (optional):** "In Pinal County, Arizona, supervisors turned down a rezoning after neighbors said their wells were already running dry."
- **Status:** ✅ (tool)
- **Source:** [Pinal County rejects massive La Osa data center. Residents want more rules for future projects](https://www.kjzz.org/text/politics/2026-08-26/pinal-county-rejects-massive-la-osa-data-center-residents-want-more-rules-for-future-projects), Taylor Griffith, KJZZ, 2026-08-26
- **Quote (tool):** supervisors "voted 4-1 to reject La Osa's rezoning request". A resident said: "Many of my neighbors' wells have gone dry and require additional depth." The developer cited the irrigation district's view that the sub-basin was adequate and offered a 600 acre-foot cap on fresh water (about 200 million gallons).
- **Note:** The project also included a 500 MW gas plant, so water wasn't the only issue. Say "water was among the concerns". The URL path contains "politics" (KJZZ's section name only); the content is a county land-use vote.

### O8. Safe wording

| Phrase | Supported? | Use |
|---|---|---|
| "Towns across the US are pushing back on new data centers" | ✅ Trackers find groups in 42–49 states and dozens of projects blocked or delayed (O1–O2). | Yes. "Communities" or "towns and counties" are also fine. |
| "one of the biggest complaints is water" | ✅ Gallup: water ties energy at 18%, inside "resource use", which half of opponents name (O4). | Yes. Never "the biggest" or "the number one". |
| "controversial" | ✅ as a description of local fights (votes, moratoriums, hearings). | "Contested", "fought over" or "facing local opposition" are more neutral. |
| "Most Americans oppose data centers" | ❌ as worded. Gallup asked about *AI* data centers *in their local area*. | "Seven in ten Americans told Gallup they'd oppose an AI data center in their area." |
| "hated", "backlash everywhere", "war on data centers" | ❌ No source supports the strength or universality. | Don't use. |
| "$130 billion blocked" | 🟡 It's one tracker's count, in one quarter, and blocked and delayed together. | Attribute it or skip it. "Dozens of projects blocked or delayed" is safe. |
| Party or election framing | Out of scope (no politics). | Don't use. |

**Suggested opener (✅ with these sources):** "Towns across the US are pushing back on new data centers, and one of the complaints people raise most is water. A big one can use up tens of millions of gallons a year. So where does all that water go?" ("One of the biggest complaints" also passes.)

---

## Chapter 1: Why does a data center drink water?

### 1.1 Nearly all the electricity a data center uses ends up as heat

- **Script (expected):** "Every watt that goes into these servers comes out as heat."
- **Status:** 🟡 (NAE page behind a verification wall; abstract seen only via the LBNL record). Wording that makes it ✅: "nearly all the electricity ends up as heat", after re-quoting the NAE page.
- **Source:** [Avoiding Waste Heat through AI Infrastructure Thermal Integration](https://www.nae.edu/349844/avoiding-waste-heat-through-ai-infrastructure-thermal-integration-), Jennifer Kurtz, Jibran Zuberi, Luke Wierl, Steve Hammond, National Academy of Engineering, *The Bridge* vol. 56 no. 1, 2026 (record found via [LBNL publications export](https://eta-publications.lbl.gov/bibcite/export/ris/bibcite_reference/36958))
- **Quote (tool):** "Data centers are high-power-density facilities in which nearly all electricity is converted into heat."
- **Note:** Say "nearly all", not "every watt". I didn't open the NAE page itself, only the LBNL record with the abstract.

### 1.2 The heat path: chips → room air → water loop → chiller → cooling tower

- **Script (expected):** "Air carries the heat off the chips, water carries it out of the room, and a tower on the roof throws it into the sky."
- **Status:** 🟡 for the full chain (fact-check: LBNL quote "releasing it into the environment via cooling towers" ✅ re-read at the primary; the rack-to-roof chain itself is generic HVAC, no source). Keep generic. Earlier note: the in-between details (CRAH coils, chilled-water and condenser loops) are standard HVAC, so phrase them generically
- **Source:** [2024 United States Data Center Energy Usage Report](https://escholarship.org/uc/item/32d6m0d1), Arman Shehabi et al., Lawrence Berkeley National Laboratory, 2024-12-19 (independent; prepared at Congress's request)
- **Quote (tool):** Water-cooled chiller systems "use water-cooled condensers to extract heat from the system, subsequently" "releasing it into the environment via cooling towers." / "They are typically integrated with computer room air handler units to ensure optimal IT operating conditions."
- **Note:** LBNL doesn't spell out the full rack-to-roof path in one sentence (the reader returned the table descriptions only). The two-loop picture (chilled water inside, condenser water to the tower) is the standard water-cooled chiller design; the fact-checker can accept it as the generic description or ask for an HVAC reference.

### 1.3 The cooling tower cools water by evaporating part of it

- **Script (expected):** "Up on the roof, warm water rains down through the tower, fans pull air through, and a small part of the water evaporates. That evaporation is what takes the heat away."
- **Status:** ✅ (tool)
- **Source:** [Cooling Towers: Understanding Key Components of Cooling Towers and How to Improve Water Efficiency](https://www1.eere.energy.gov/femp/pdfs/waterfs_coolingtowers.pdf), US DOE Federal Energy Management Program (PNNL-SA-75820), 2011-02
- **Quote (tool):** "a portion of the water is evaporated into the air passing through the tower" / "As the water evaporates, the air absorbs heat, which lowers the temperature of the remaining water."
- **Source:** [WaterSense at Work, Section 6.3 Cooling Towers, p. 194](https://19january2017snapshot.epa.gov/www3/watersense/commercial/docs/watersense_at_work/files/assets/basic-html/page194.html), US EPA, 2012-10 (archived snapshot)
- **Quote (tool):** evaporation "is the method that transfers heat from the cooling tower system to the environment."
- **Source (general physics):** [Evaporation and the Water Cycle](https://www.usgs.gov/special-topics/water-science-school/science/evaporation-and-water-cycle), USGS Water Science School, 2019-06-08
- **Quote (tool):** "evaporation removes heat from the environment, leading to a net cooling"

### 1.4 One gallon evaporated carries off about 8,800 BTU, about 100 times what warming it carries

- **Script (expected):** "Every gallon that evaporates carries away about as much heat as a space heater makes in an hour and a half. Just warming that gallon would carry about a hundredth of that."
- **Status:** 🧮 (inputs ✅ (tool))
- **Source (inputs):** [Water, NIST Chemistry WebBook, SRD 69](https://webbook.nist.gov/cgi/cbook.cgi?ID=C7732185&Mask=3), NIST (CODATA values, Cox, Wagman et al. 1984)
- **Quote (tool):** ΔfH° gas "−241.826 ± 0.040 kJ/mol"; ΔfH° liquid "−285.830 ± 0.040 kJ/mol"
- **Source (density):** [Water Density](https://www.usgs.gov/special-topics/water-science-school/science/water-density), USGS Water Science School, page dated 2026-08-24
- **Quote (tool):** table value at 39.2°F: "62.424" pounds per cubic foot
- **Cross-check (independent):** [WaterSense at Work p. 195](https://19january2017snapshot.epa.gov/www3/watersense/commercial/docs/watersense_at_work/files/assets/basic-html/page195.html), EPA, 2012-10. **Quote (tool):** evaporation is "approximately 1 percent of the rate of recirculating water flow for every 10°F in temperature drop." (Evaporating 1 lb absorbs about what 100 lb absorbs when warmed 10°F, so this rule of thumb *is* the latent-heat fact.)
- **Note:** Working in P1. The result is about 1,050 BTU/lb at 77°F; about 8,750 BTU (2.6 kWh) per gallon; space-heater equivalent 1,500 W × 1.7 h. Round on screen to "about 8,800 BTU" or "about 2.5 kWh of heat". The textbook 970 BTU/lb value is at 212°F (boiling); at tower temperatures it's higher, so don't use 970. Real towers also shed a little heat by warming the air directly, so this is the *per gallon evaporated* figure, not total tower performance.

### 1.5 Evaporation peaks on hot afternoons; many sites barely evaporate on cool days

- **Script (expected):** "On a mild day this building might use almost no water. On a 95-degree afternoon, the towers run flat out."
- **Status:** ✅ (tool) for the principle; the "95-degree" detail is 🎭 illustrative
- **Source:** [Understanding water use at Microsoft datacenters](https://local.microsoft.com/blog/understanding-water-use-at-microsoft-datacenters/), Microsoft Local, undated (assets suggest 2026) (**company claim**)
- **Quote (tool):** "For direct evaporative cooling, when the temperature exceeds 85°F (29.4°C), water flows into the facility" / "During the hottest roughly 55 days, we switch to evaporative cooling," (Georgia)
- **Source:** [How Much Water Do Data Centers Use? And Why Does It Matter?](https://pacinst.org/wp-content/uploads/2026/09/Issue-Brief_AI-Data-Centers-2026_Final.pdf), Heather Cooley and Morgan Shimabuku, Pacific Institute, 2026-09 (independent)
- **Quote (tool):** water use "is concentrated during hot periods when cooling needs are highest"; peak daily demand can be 3 to 30 times the average (paraphrased by tool; re-quote).
- **Note:** Microsoft's 85°F rule is for *direct evaporative* air cooling (water sprayed into the supply air), not a cooling tower. The principle (more heat and hotter air mean more evaporation) holds for both.

### 1.6 US data centers consumed about 17 billion gallons on-site in 2023

- **Script (expected):** "Across the US, data centers evaporated about 17 billion gallons of water in 2023, Berkeley Lab estimates."
- **Status:** ✅ (tool)
- **Source:** [2024 United States Data Center Energy Usage Report](https://escholarship.org/uc/item/32d6m0d1), Shehabi et al., LBNL, 2024-12-19 (independent)
- **Quote (tool):** "By 2023, hyperscale and colocation account for 84% of the 66-billion-liter total" / "In 2014, data centers consumed 21.2 billion liters of water, with 64% in internal data centers." / "Hyperscale data centers in 2028 are expected to consume between 60 and 124 billion liters."
- **Secondary (same figure, in gallons):** [Data centers' hidden water footprint is linked to the grid](https://www.latitudemedia.com/news/data-centers-hidden-water-footprint-is-linked-to-the-grid/), Catherine Boudreau, Latitude Media, 2026-08-25. **Quote (tool):** LBNL estimated "U.S. data centers directly consumed 17 billion gallons of water."
- **Note:** 66 B L = 17.4 B gal 🧮; 2014: 21.2 B L = 5.6 B gal 🧮, so more than tripled in nine years 🧮. "Consumed" includes cooling and humidification, so don't say "all evaporated in cooling towers". Hedge "evaporated" as "used up, mostly by evaporation" if the fact-checker wants it exact.

### 1.7 Google's average data center: about 450,000 gallons a day (2021)

- **Script (optional):** "Google said in 2021 its average data center consumed about 450,000 gallons a day."
- **Status:** ✅ (tool), **company claim**, dated
- **Source:** [Our commitment to climate-conscious data center cooling](https://blog.google/outreach-initiatives/sustainability/our-commitment-to-climate-conscious-data-center-cooling/), Urs Hölzle, Google, 2022-11-21
- **Quote (tool):** "In 2021, the average Google data center consumed approximately 450,000 gallons of water per day." / "Last year, our global data center fleet consumed approximately 4.3 billion gallons of water."
- **Note:** 450,000 × 365 = 164 M gal/yr 🧮. Old (2021); fleet consumption has more than doubled since (10.5–10.9 B gal in 2025, (snippet), see 1.8). Use the Pacific Institute median (1.9) for a "typical" figure instead.

### 1.8 Google's biggest site, Council Bluffs, Iowa: about 1.3 billion gallons consumed in 2025

- **Script (expected):** "Google's campus in Council Bluffs, Iowa, reported using up about 1.3 billion gallons in 2025."
- **Status:** ✅ verified at the primary (fact-check 2026-11-01): Google's 2026 Environmental Report, "Water use by data center location" (2025), Council Bluffs, IA row, million gallons: Withdrawal 1,746.4 | Discharge 400.4 | **Consumption 1,346.0** | golf course equivalents 9.0. Company-reported; say "consumed", "campus", "Google reported". Legally sensitive (named company).
- **Source:** [Data centers can guzzle serious water. As some Nebraskans worry, tech giants seek solutions.](https://flatwaterfreepress.org/data-centers-can-guzzle-serious-water-as-some-nebraskans-worry-tech-giants-seek-solutions/), Anila Yoganathan, Flatwater Free Press with Grist, 2026-07-08
- **Quote (tool):** Google "self-reported consuming more water than any of its other data center locations in 2025 at 1.3 billion gallons." / "evaporative cooling generally uses more water, while closed-loop cooling typically uses more electricity."
- **Source (withdrawal list):** [By water use, Google's Botetourt site would be its 8th-largest data center complex in the world](https://cardinalnews.org/2026/07/09/by-water-use-googles-botetourt-site-would-be-its-8th-largest-data-center-complex-in-the-world/), Dwayne Yancey, Cardinal News (Opinion), 2026-07-09
- **Quote (tool):** "Council Bluffs, Iowa (1,746.4 million gallons)"; the article says the figures "represent what the company drew from water sources." Also: "Mayes County, Oklahoma (1,396.7 million gallons)", "New Albany, Ohio (1,008.1 million gallons)", "Berkeley County, South Carolina (999.5 million gallons)", "Douglas County, Georgia (834.9 million gallons)".
- **Note:** Withdrawal 1,746 vs consumption about 1,346 M gal (a search snippet gives 1,346; not opened) means about 77% consumed 🧮, which fits evaporation. 1.3 B gal ÷ 365 = 3.6 M gal/day 🧮. It's a campus of several buildings, not one building; say "campus". The primary is Google's 2026 Environmental Report (PDF too large to open): https://sustainability.google/files/google-2026-environmental-report.pdf. **Fact-checker: open the site table in that PDF.**

### 1.9 A typical large data center withdraws about 44 million gallons a year and consumes about three-quarters of it

- **Script (expected):** "A typical big data center pulls in about 44 million gallons a year, and about three-quarters of it never comes back."
- **Status:** ✅ for "44.3 million gallons withdrawn" (65 facilities, 2024 or 2025, worldwide; re-quoted). 🟡 for "74% consumed": consumption was reported for only 36 of 65 facilities and the rest "assumed a 0.74 consumptive ratio". Hedged wording: "the Pacific Institute estimates about three-quarters is consumed." Also "76% was potable water" ✅ re-quoted.
- **Source:** [How Much Water Do Data Centers Use? And Why Does It Matter?](https://pacinst.org/wp-content/uploads/2026/09/Issue-Brief_AI-Data-Centers-2026_Final.pdf), Heather Cooley and Morgan Shimabuku, Pacific Institute, 2026-09
- **Quote (tool):** "Water withdrawals for a typical facility, as represented by the median value, were 44.3 million gallons per year" / "A typical facility, as indicated by the median value, consumed 74% of the water withdrawn." / daily withdrawals ranged "from 270 gallons to 3.9 million gallons per day."
- **Note:** Scope: 65 facilities run by major tech companies, **worldwide** (not US-only), 2024 or 2025 data, compiled from Google's 2025 Environmental Report, Microsoft's 2026 data fact sheet and Han et al. 2026. Facility vs campus isn't always clear. The average is 159 M gal/yr, pulled up by a few giants. Say "a typical large data center run by a big tech company". 44.3 × 0.74 ≈ 33 M gal consumed 🧮 (a median times a median, so approximate). That matches Microsoft's 33 M gal/yr (4.1), a nice independent cross-check.

### 1.10 Comparison: US homes

- **Script (expected):** "That's about the water 400 American families use at home in a year."
- **Status:** 🧮 (input ✅ (tool))
- **Source:** [How We Use Water](https://www.epa.gov/watersense/how-we-use-water), US EPA WaterSense, last updated 2026-08-04
- **Quote (tool):** "The average American family uses more than 300 gallons of water per day at home."
- **Note:** 300 × 365 = 109,500 gal/yr per family. Median data center withdrawal 44.3 M ÷ 109,500 ≈ **400 families** 🧮. Council Bluffs consumption 1.3 B ÷ 109,500 ≈ **12,000 families** 🧮. EPA says "more than 300", so the results are upper bounds; say "about". Compare withdrawal with withdrawal (homes return most of their water to the sewer too).

### 1.11 Comparison: a golf course

- **Script (expected):** "About the same as an average American golf course."
- **Status:** 🟡 🧮 (not re-opened in the fact-check; inputs unverified this pass; the facility count is the survey's population, see note). Cut or keep 🟡.
- **Source:** [Golf courses reduce water usage by 31 percent, according to national survey](https://www.gcsaa.org/who-we-are/media/news-release/2025/12/30/golf-courses-reduce-water-usage-by-31-percent-according-to-national-survey), GCSAA, 2025-12-30
- **Quote (tool):** "U.S. golf facilities applied a projected 1.63 million acre-feet of water in 2024."
- **Source:** [From acre-feet to outcomes: Interpreting the 2024 GCEP Water Survey](https://www.gcmonline.com/research/news/from-acre-feet-to-outcomes-interpreting-the-2024-gcep-water-survey), J. Bryan Unruh and Travis Shaddox, GCM, 2025-12
- **Quote (tool):** the survey reached "13,952 golf facilities nationwide"; Southwest courses "used more than double the water per facility compared to other regions."
- **Source (company comparison):** Google 2022 blog (1.7): its 2021 fleet use "is comparable to the water needed to irrigate and maintain 29 golf courses in the southwest U.S. each year." (tool)
- **Note:** 1.63 M acre-ft × 325,851 gal ÷ 13,952 ≈ **38 M gal per facility per year** 🧮 (a mean; the survey's median isn't in the text). Close to the 44.3 M median data center. Google's comparison implies about 148 M gal per Southwest course 🧮, which is Google's framing and flattering; Cardinal News called the golf framing convenient for Google. Prefer homes or the national-average course.

### 1.12 Comparison: a farm (optional)

- **Script (optional):** "Google's Nebraska data centers used about as much as 2,500 to 3,500 acres of irrigated corn."
- **Status:** ✅ (tool), attributed to a named expert
- **Source:** Flatwater Free Press 2026-07-08 (1.8)
- **Quote (tool):** "as much water as it takes to irrigate between 2,500 to 3,500 acres of central Nebraska cornfields." (Anthony Schutz, University of Nebraska–Lincoln College of Law; about Google's Nebraska total, about 732 M gal in 2025)

### 1.13 (Backup US example) The Dalles, Oregon: 355 million gallons in 2021, 29% of the city's water

- **Script (optional):** "In The Dalles, Oregon, Google's data centers used 29 percent of the city's water in 2021."
- **Status:** 🟡 (fact-check: WaterWatch/DCD page not re-opened; AP gives a different figure for the same year, 274.5 M gal). Legally sensitive (named company and a lawsuit). Prefer Google's own 2026 report, which says it "consumed 469 million gallons" at The Dalles in 2025 (report text, read via reader).
- **Source:** [We now know how much water Google's Oregon data centers use after The Dalles drops lawsuit against journalists](https://waterwatch.org/we-now-know-how-much-water-googles-oregon-data-centers-use-after-the-dalles-drops-lawsuit-against-journalists/), Sebastian Moss, Data Center Dynamics, 2022-12-19 (republished by WaterWatch of Oregon; DCD original returned 403)
- **Quote (tool):** "In 2021, the company's facilities consumed 355.1 million gallons of water." / "Google accounts for 29 percent of the city's total consumption." / "Google's water use has nearly tripled since 2017."
- **Note:** The AP reported Google's own figure as 274.5 M gal for the same year ((snippet), not opened); the gap is unexplained. The figure came out of a records lawsuit; telling that story drifts toward controversy, so state the number only, if at all.

### 1.W Why now? Data centers are decades old, so why did pushback spread with AI? (added 2026-11-01)

**Short version the evidence supports:** typical racks are still under 10 kW. AI racks run around 120 kW and up. Buildings went from a few MW to over 100 MW each, and campuses are now announced at a gigawatt or more. US data center electricity more than doubled from 2018 to 2023 and could double or triple again by 2028. More power means more heat to remove. Whether that heat costs water depends on how the building gets rid of it: some new AI campuses use closed loops and air-cooled chillers and evaporate almost nothing. **Don't say AI data centers always use more water.** Pushback also predates AI: noise complaints in Northern Virginia and Arizona go back years.

#### 1.W1 Rack power: most racks are still under about 10 kW; AI racks draw around 120 kW and more

- **Script (expected):** "A typical rack of servers draws under ten kilowatts. A rack of the newest AI chips can draw more than ten times that."
- **Status:** (fact-check pass 3) ❌ for "most racks are under 10 kW": Uptime's modal rack is 11 kW and no share under 10 kW is given; ✅ for "the average is 7.8 kW (excluding facilities designed for above 30 kW)"; 🟡 for 120 kW (one product, GB200 NVL72, analyst estimate; say "some of today's AI chips"). The AI-rack figure comes from an analyst firm (SemiAnalysis); the Rubin-generation figures are 🟡. Script-safe line 1 below ("Most server racks ... under ten") is superseded by: "The average server rack still draws under 8 kilowatts, an industry survey finds, but a rack of some of today's AI chips draws around 120."
- **Source:** [AI Drives Data Center Uncertainty in Uptime's 2026 Survey](https://www.datacenterknowledge.com/ai-data-centers/ai-drives-data-center-uncertainty-in-uptime-s-2026-survey), Sean Michael Kerner, Data Center Knowledge, 2026-07-31 (reporting Uptime Institute's 16th annual Global Data Center Survey)
- **Quote (tool):** "the average sits at 7.8 kW" (up from 7.5 kW in 2025, excluding a small number of facilities designed for above 30 kW) / "The modal rack density surpassed 11 kW per rack for the first time in the survey's history."
- **Source:** [GB200 Hardware Architecture – Component Supply Chain & BOM](https://newsletter.semianalysis.com/p/gb200-hardware-architecture-and-component), Dylan Patel et al., SemiAnalysis, 2024-07-17 (independent analyst; free intro section)
- **Quote (tool):** "This form factor requires approximately 120kW per rack." / "123.6kW per NVL72 is the total power draw including the inefficiencies." / "Moving well past 40kW per rack is the primary reason why liquid cooling is required for GB200."
- **Lead (snippet, 🟡):** the next generation (Vera Rubin NVL72) is reported at "over 200 kW" per rack (Tom's Hardware, not opened). NVIDIA hadn't published an official wattage in what I saw. Don't use it in the script.
- **Note:** 120 ÷ 7.8 ≈ 15× 🧮. "More than ten times" is safe, and "several times" is very safe. Uptime's average is a global operator survey and excludes the densest sites. AFCOM's 2026 survey reports a 27 kW average ((snippet)) because it counts differently, so don't cite a single "typical" figure without saying whose. The 120 kW figure is the full NVL72 rack (72 GPUs), which is liquid-cooled.

#### 1.W2 Building scale: from a few megawatts to 100+ MW per building, and campuses near a gigawatt or more

- **Script (expected):** "A typical data center used to need a few megawatts. New ones need over a hundred, and AI campuses are being planned at a gigawatt or more."
- **Status:** ✅ (tool)
- **Source:** [Data Centers in Virginia (Report 598)](https://jlarc.virginia.gov/pdfs/reports/Rpt598-2.pdf), Joint Legislative Audit and Review Commission (JLARC), Virginia General Assembly, 2024-12-09 (independent state audit agency; read through r.jina.ai)
- **Quote (tool):** "the capacity of a typical data center has increased from requiring only a few megawatts of power to more than 100 megawatts." / "The largest new data centers can draw from 100 to over 200 MW each, which is more than most industrial consumers."
- **US campus examples (company plans, dated, attributed):**
  - **Abilene, Texas (Stargate / Crusoe):** a 1.2 GW campus of eight buildings. [ConvergeDigest, 2025-05-21](https://convergedigest.com/1-2gw-ai-campus-in-abilene-moves-to-phase-two/). **Quote (tool):** the campus totals 1.2 GW, "positioning the site as one of the largest AI compute hubs in the world"; the first phase was "200+ MW". (Its "50,000 NVIDIA GB200 NVL72 systems per building" looks like an error, probably GPUs not racks; don't use it.) Crusoe's page confirms "a total of eight buildings" (tool).
  - **Richland Parish, Louisiana (Meta "Hyperion"):** [Fortune, Delaney Nolan, 2025-08-24](https://www.fortune.com/2025/08/24/meta-data-center-rural-louisiana-framework-ai-power-boom). **Quote (tool):** "more than 2 gigawatts of computing capacity", which could eventually expand to 5 GW; "more than 2,000 acres". Later reports ((snippet), not opened) say Meta confirmed a 5 GW scale in July 2026.
  - **Context, IEA (snippet, iea.org returned 403):** *Energy and AI* (2025-04) reportedly says a typical AI-focused data center uses as much electricity as 100,000 households and the largest under construction about 20 times that. Not opened; ❌ until someone opens it.
- **Note:** A gigawatt campus is roughly 5–10 of today's big buildings, not one building. Say "campus".

#### 1.W3 Speed and clustering: US data center electricity more than doubled 2018–2023 and could double or triple by 2028

- **Script (expected):** "US data centers' electricity use more than doubled in five years, and Berkeley Lab projects it could double or triple again by 2028."
- **Status:** ✅ (tool)
- **Source:** LBNL 2024 report (1.2), 2024-12-19
- **Quote (tool):** in 2018 "data centers consumed about 76 TWh, representing 1.9% of total annual U.S. electricity consumption" / "reaching 176 TWh by 2023, representing 4.4% of total U.S. electricity consumption." / 2028 is "6.7% to 12.0% of total U.S. electricity consumption forecasted for 2028" (325–580 TWh) / "the rapid growth in accelerated servers has caused current total data center energy demand to more than double"
- **Clustering:** JLARC 2024: "Prince William County is the fastest-growing data center locality" (tool, paraphrased; re-quote). The three largest Virginia markets changed or are considering zoning changes "in response to growing residential opposition" (tool, paraphrased). Pacific Institute (1.9): water "is not a major factor driving data center siting" and many new sites are in water-stressed areas (tool).
- **Note:** 176 ÷ 76 = 2.3× 🧮; 325–580 ÷ 176 = 1.8–3.3× 🧮, so "could roughly double or triple". I found no clean, sourced US capex or new-project count for this section; leave capex out. Data Center Watch's opposition counts are in O1.

#### 1.W4 More power means more heat per building; whether that costs water depends on the cooling design

- **Script (expected):** "Every one of those megawatts ends up as heat. Some new AI campuses get rid of it with closed loops and giant radiators that barely use water. Others still evaporate it, especially on the hottest days."
- **Status:** ✅ (tool) as hedged; ❌ for "AI data centers use more water" as a blanket claim
- **More heat:** "nearly all electricity is converted into heat" (1.1), so a 100 MW building rejects about 100 MW of heat, whatever chips it holds 🧮 (logic).
- **Liquid-to-chip + no evaporation (company claim):** [An inside look at the Abilene AI data center](https://www.crusoe.ai/resources/blog/an-inside-look-at-the-abilene-ai-data-center), Crusoe, 2025-08-05. **Quote (tool):** "closed-loop, non-evaporative liquid cooling systems" with "heat rejected via air-cooled chillers" / "The initial fill for the closed-loop system in each of the eight buildings requires one million gallons of water." [Crusoe in Abilene](https://www.crusoe.ai/about/communities/abilene) (tool): its systems "do not consume or evaporate water to cool the equipment"; a 200 MW closed-loop building "typically uses approximately 2 million gallons of water per year." That's company-reported, and far below a typical evaporative site's tens of millions.
- **But not always (independent):** [AI data centers are less thirsty now: tech giants](https://kuwaittimes.com/article/49367/business/ai-data-centers-are-less-thirsty-now-tech-giants/), AFP via Kuwait Times, 2026-09-07. **Quote (tool):** in extreme climates or heat waves "chill airflow or water evaporation is still necessary"; Microsoft and AWS "used more water overall between 2022 and 2025" while their water efficiency improved; Rystad estimates cooling water worldwide "could nearly triple to 644 billion liters by 2030" without adaptive measures.
- **LBNL:** liquid cooling paired with an evaporative economizer "consumes substantial amounts of water, like all evaporative cooling systems" (4.5). Hyperscale on-site water is projected at 60–124 billion liters in 2028 (1.6), against a 66-billion-liter all-data-center total in 2023.
- **Pacific Institute (🟡, tool paraphrase):** AI-specific data centers' WUE is about 1.8 L/kWh vs a US average of about 0.36 L/kWh (from Han et al. 2026; not traced to the paper). Re-quote before use, and hedge: it's a study estimate, not a rule.
- **Note:** The honest framing is that AI multiplies heat. Some operators answer with waterless designs, which move the cost to electricity (Ch 4). Others still evaporate, and total water is projected to rise. The Abilene closed-loop design is a strong Ch 4 example of the trade-off.

#### 1.W5 Pushback predates AI (one neutral line)

- **Script (expected):** "Neighbors were complaining about data centers long before AI. In Northern Virginia, the steady hum was the top complaint for years."
- **Status:** ✅ (tool) for Northern Virginia noise; 🟡 for "for years" (no dated start in the opened sources); Chandler dates are (snippet)
- **Source:** JLARC 2024 (1.W2). **Quote (tool):** "Some nearby residents report that the constant noise generated by some data centers affects their well-being." / "One-third of data centers are currently located near residential areas."
- **Source:** [Data Centers: Noise & Air Quality Concerns](https://www.loudoun.gov/6405/Data-Centers-Noise-and-Air-Quality), Loudoun County, undated. **Quote (tool):** noise complaints are "among the most persistent issues brought forward to Loudoun County officials" and "frequently pertain to tonal noise."
- **Source (Digital Gateway, neutral facts):** [Judge voids Digital Gateway rezoning in Prince William County](https://wtop.com/prince-william-county/2025/08/judge-voids-digital-gateway-rezoning-in-prince-william-county/), InsideNoVa via WTOP, 2025-08-09. **Quote (tool):** the supervisors approved it in December 2023; it planned 37 data centers across over 2,100 acres near Manassas National Battlefield; the judge found "the advertised notice provided by the County did not comply with either the State or County code." Later reports ((snippet)): the appeals court upheld the ruling in 2026 and the county and developer dropped their defenses.
- **Lead (snippet):** Chandler, Arizona residents complained of a constant hum from a CyrusOne site around 2018, and the city later adopted a data-center noise ordinance (No. 5033, 2022/2023). DCD was 403 and ABC15 is undated.
- **Note:** Digital Gateway was approved about a year after ChatGPT launched but proposed earlier (proposal date not sourced), so it isn't a clean "pre-AI" case. The cleanest pre-AI line is the noise one, sourced to JLARC and Loudoun. **Pacific Institute vs JLARC on water:** JLARC (Virginia, 2024) says "Most data centers use about the same amount of water or less as an average large office building" (tool). Pacific Institute (2026, 65 big-tech sites worldwide) finds 91% withdraw more than a large office. The two cover different sets (all Virginia data centers vs the biggest operators' sites), so don't quote either as universal.

**Script-safe lines (hedged):**
1. "Most server racks still draw under ten kilowatts, an industry survey finds. A rack of today's AI chips draws around 120, the heat of dozens of space heaters in one cabinet." (✅ Uptime/DCK + SemiAnalysis; 120 kW ÷ 1.5 kW = 80 heaters, so "dozens" is conservative 🧮. No historical rack series was sourced, so avoid "for decades".)
2. "A data center used to need a few megawatts. Virginia's auditors say a typical one now needs over a hundred, and AI campuses are being planned at a gigawatt or more." (✅ JLARC; campuses: Abilene 1.2 GW, Hyperion 2+ GW, company plans.)
3. "More power means more heat. Some new AI campuses get rid of it with sealed loops and radiators that barely touch water. Others still evaporate it, especially on hot days." (✅ hedged; Crusoe company claim + AFP + LBNL.)
4. Optional: "And the complaints aren't new. In Northern Virginia, neighbors have been reporting the constant hum for years. AI just made the buildings bigger, and there are a lot more of them." (✅ JLARC/Loudoun for the noise; "for years" is 🟡.)

---

## Chapter 2: Why don't they just reuse the water?

### 2.1 They do reuse it: the same water circulates several times

- **Script (expected):** "They do reuse it. The same water goes around the loop again and again."
- **Status:** ✅ (tool)
- **Source:** Microsoft Local page (1.5) (**company claim**). **Quote (tool):** water "cycles through the cooling system between 2–5 times."
- **Source:** [Water Reuse Case Study: Quincy, Washington](https://19january2025snapshot.epa.gov/waterreuse/water-reuse-case-study-quincy-washington), US EPA, last updated 2024-12-31 (archived). **Quote (tool):** "After the water is cycled four to five times at the data center, the resulting blowdown water is transferred"

### 2.2 Evaporation leaves the minerals behind, so they build up

- **Script (expected):** "When water evaporates, only pure water leaves. The calcium, magnesium and silica stay behind in what's left."
- **Status:** ✅ (tool)
- **Source:** [WaterSense at Work p. 195](https://19january2017snapshot.epa.gov/www3/watersense/commercial/docs/watersense_at_work/files/assets/basic-html/page195.html), EPA, 2012-10
- **Quote (tool):** "When water evaporates from the tower, dissolved solids (e.g., calcium, magnesium, chloride, silica) are left behind."

### 2.3 "Cycles of concentration": how many times more concentrated the loop water gets

- **Script (expected):** "Engineers call it cycles of concentration. At four cycles, the water in the loop is four times as salty as the water that came in."
- **Status:** 🟡 (fact-check: pp. 196/197 not re-opened; the FEMP formula, re-quoted, implies the same ratio). Re-quote p. 196 to make it ✅. "Salty" should be "mineral-heavy".
- **Source:** [WaterSense at Work p. 196](https://19january2017snapshot.epa.gov/www3/watersense/commercial/docs/watersense_at_work/files/assets/basic-html/page196.html) and [p. 197](https://19january2017snapshot.epa.gov/www3/watersense/commercial/docs/watersense_at_work/files/assets/basic-html/page197.html), EPA, 2012-10
- **Quote (tool):** cycles are defined as a ratio of conductivity (blowdown ÷ make-up) and are "approximately equal to the ratio of volume of make-up water" to blowdown volume. / "TDS enter the system in the make-up water and exit the system in the blowdown water"
- **Note:** "Salty" is a fair plain-English word for dissolved minerals (TDS) but not literal table salt; "mineral-heavy" is safer.

### 2.4 Too many minerals cause scale, corrosion and biological growth

- **Script (expected):** "Push it too far and the minerals turn to scale, like the crust in a kettle, pipes corrode, and the warm, wet tower grows bacteria."
- **Status:** ✅ (tool)
- **Source:** FEMP fact sheet (1.3), DOE, 2011-02
- **Quote (tool):** "All dissolved minerals have a saturation limit that, if exceeded, will lead to scale formation." / corrosion "is enhanced by elevated dissolved mineral content in the water and the presence of oxygen" / "Cooling towers present the perfect environment for biological activity due to the warm, moist environment."
- **Source (optional, health angle):** [CDC telebriefing: Vital Signs, Legionnaires' disease](https://archive.cdc.gov/www_cdc_gov/media/releases/2016/t0607-legionnaires.html), CDC, 2016-06-07. **Quote (tool):** "Cooling towers can create plumes of potentially contaminated water that can drift out and affect more people." / cooling towers "typically sit on top of buildings."
- **Note:** The kettle comparison is ours (illustrative, physically right). The Legionella beat is alarming, and no data-center outbreak was found; if used at all, keep it to "that's why the water is treated", with no scare.

### 2.5 So they drain some (blowdown) and top up with fresh water (makeup)

- **Script (expected):** "So a little of the loop water is drained off. Engineers call it blowdown. Fresh makeup water replaces it and everything that evaporated."
- **Status:** ✅ (tool)
- **Source:** FEMP fact sheet (1.3)
- **Quote (tool):** Blowdown: "Water discharged to remove high mineral content system water, impurities, and sediment." / Makeup: "Water supply needed to replace all losses due to evaporation, leaks, or discharge in cooling systems." / "Blowdown = Evaporation ÷ (Cycles of Concentration -1)"
- **Source:** EPA p. 195. **Quote (tool):** blowdown means "removing (i.e., bleeding or blowing down) a portion of the water that has high TDS concentration" and "replacing that water with make-up water, which has a lower concentration of TDS."

### 2.6 Typical cycles: 2–4, sometimes 6 or more; going from 3 to 6 cuts blowdown in half

- **Script (expected):** "Most towers run at two to four cycles. Going from three to six cuts the drain water by about half."
- **Status:** ✅ (tool)
- **Source:** [WaterSense at Work p. 199](https://19january2017snapshot.epa.gov/www3/watersense/commercial/docs/watersense_at_work/files/assets/basic-html/page199.html), EPA, 2012-10
- **Quote (tool):** "Many systems operate at two to four cycles of concentration, while six cycles or more might be possible." / "Increasing cycles from three to six reduces cooling tower make-up water by 20 percent and cooling tower blowdown by 50 percent."
- **Note:** EPA's 50% blowdown figure is softer than the FEMP formula's 60% (see P4); "about half" or "more than half" are both safe. This EPA guide covers commercial buildings in general (2012). Data-center-specific: Microsoft 2–5 cycles (company claim), Quincy 4–5 (EPA).

### 2.7 Share: about three-quarters to five-sixths of the water evaporates; the rest is blowdown

- **Script (expected):** "Roughly three of every four gallons go up as vapor. The fourth goes down the drain."
- **Status:** 🟡 for the Loudoun range (fact-check: the page says "Older designs had... between 75 and 85 percent" for open-loop, so it's not a current-fleet figure); ✅ 🧮 for 75% at 4 cycles and 83% at 6 (FEMP formula re-quoted: "Blowdown = Evaporation ÷ (Cycles of Concentration -1)"). Wording: "at four to six cycles, 75 to 83 percent of the makeup water evaporates."
- **Source:** [Data Centers: Water Considerations](https://www.loudoun.gov/6402/Data-Centers-Water-Considerations), Loudoun County, Virginia, undated (cites 2025 data)
- **Quote (tool):** for open-loop systems, "between 75 and 85 percent of water used for cooling eventually vaporizes or evaporates."
- **Source:** Pacific Institute (1.9): median facility "consumed 74% of the water withdrawn." (tool)
- **Note:** From the FEMP formula, the evaporated share of makeup = (C−1)/C: 3 cycles 67%, 4 cycles 75%, 5 cycles 80%, 6 cycles 83% 🧮 (ignores drift and leaks). Three independent routes agree on about 75–85%.

### 2.8 Water treatment: chemicals, conductivity control, and sometimes softening

- **Script (expected):** "Down in the plant room, pumps dose the loop with scale inhibitors and biocide, and a sensor watches the water's conductivity to decide when to drain."
- **Status:** ✅ (tool)
- **Source:** FEMP fact sheet (1.3). **Quote (tool):** treatment programs "consist of chemical additives including corrosion inhibitors, dispersants, scale inhibitors, and biocides"
- **Source:** EPA p. 197 (tool, paraphrased): vendors monitor "pH, alkalinity, conductivity, hardness, microbial growth, biocide, and corrosion inhibitor levels"; "automatic blowdown control" holds TDS near a set point. Re-quote exact words before ✅.
- **Source:** [Best Management Practice #10: Cooling Tower Management](https://www.energy.gov/node/849241), DOE FEMP ((snippet), not opened): softening "removes hardness using an ion exchange resin and can allow you to operate at higher cycles of concentration."

---

## Chapter 3: Why not release it to a river?

### 3.1 The evaporated part is already gone as vapor; only blowdown is left to deal with

- **Script (expected):** "Most of the water has already left, as invisible vapor over the roof. What's left is the blowdown."
- **Status:** ✅ (tool)
- **Source:** Microsoft Local page (1.5) (**company claim**). **Quote (tool):** "A portion of the water evaporates, while the remainder is typically discharged back to the local wastewater treatment plant" "in compliance with local regulations."
- **Note:** The white plume over a tower is condensed droplets (vapor re-condensing in cool air), not smoke and not the vapor itself. That's standard physics, but I found no source quote; mark 🎭 if used, or skip.

### 3.2 Blowdown is mineral-heavy and carries treatment chemicals

- **Script (expected):** "It's several times more mineral-heavy than tap water, and it carries the treatment chemicals."
- **Status:** ✅ (tool)
- **Source:** Pacific Institute (1.9). **Quote (tool):** the remaining cooling water is "often referred to as effluent or blowdown," and "typically requires treatment prior to disposal."
- **Source:** FEMP and EPA (2.3, 2.5, 2.8): concentrated TDS plus inhibitors and biocides.
- **Note:** **"Warm" is not sourced.** Blowdown is normally drawn from the tower's cooled loop, so I wouldn't call it hot; no temperature source was found. Avoid temperature claims about blowdown (❌ for "hot water").

### 3.3 It usually goes to the city sewer and the municipal treatment plant

- **Script (expected):** "Usually it goes down the drain to the city's wastewater plant, like a giant building's sink."
- **Status:** ✅ as typical, attributed (fact-check: Microsoft quote re-read; **Ohio EPA Director's written testimony 2026-05-27 read at the primary via reader**: "Most data centers send their wastewater to publicly owned wastewater treatment works"; "Cooling water blowdown may require an IDP" depending on volume vs the receiving system's capacity). "Only one NPDES permit" is the Alliance for the Great Lakes (advocacy group), reported by WWD, so 🟡 and attributed; better to drop it.
- **Source:** Microsoft Local page (3.1) (**company claim**)
- **Source:** [Ohio EPA drops proposed streamlined wastewater permits for data centers](https://www.wwdmag.com/compliance-regulations/news/55392750/ohio-epa-drops-proposed-streamlined-wastewater-permits-for-data-centers), Water & Wastes Digest, 2026-07-22 (citing the Alliance for the Great Lakes)
- **Quote (tool):** "most data centers in Ohio currently discharge wastewater to municipal wastewater treatment plants" / "only one facility in the state currently holds an NPDES permit authorizing direct discharge to freshwater."
- **Lead (snippet, not opened):** Ohio EPA written testimony to the Ohio House data-center committee, 2026-05-27: "Most data centers send their wastewater to publicly owned wastewater treatment works, so they do not need a discharge permit from Ohio EPA." / blowdown "may require an IDP" (industrial discharge permit) depending on volume vs the plant's capacity. [PDF](https://search-prod.lis.state.oh.us/api/v2/general_assembly_136/committees/cmte_h_data_centers_1/meetings/cmte_h_data_centers_1_2026-05-27-1000_1337/submissions/datacenterwrittentestimonylogueohioepa.pdf) (binary; fact-checker should try another reader).
- **Source (capacity strain):** Loudoun County (2.7). **Quote (tool):** some data centers built infrastructure "to carry wastewater to the nearest available wastewater main capable of handling the flow."
- **Note:** One state's picture (Ohio) plus one company's statement. "Usually" is fair; "always" isn't.

### 3.4 Discharging straight to a river or stream needs an NPDES permit, which can limit minerals, chlorine and more

- **Script (expected):** "To pipe it straight into a river, a data center needs a federal Clean Water Act permit, usually issued by the state, with limits on what's in it."
- **Status:** ✅ (tool) via the Ohio draft permit as reported; the general NPDES rule is textbook CWA
- **Source:** [Ohio EPA Issues Draft General NPDES Permit for Data Centers](https://www.bricker.com/insights/publications/ohio-epa-issues-draft-general-npdes-permit-for-data-centers), Bricker Graydon LLP, 2025-12-02
- **Quote (tool):** covered low-volume wastewater "including cooling tower blowdown, boiler blowdown, or air compressor condensate"; limits on pH, total dissolved solids, residual chlorine and residual oxidants; monitoring of flow, oil and grease, TSS and **temperature** (tool, partly paraphrased; re-quote).
- **Source (outcome):** [Ohio scraps controversial plan to ease data center wastewater discharges](https://www.circleofblue.org/2026/supply/water-quality/ohio-scraps-controversial-plan-to-ease-data-center-wastewater-discharges/), Christian Thorsberg, Circle of Blue, 2026-07-22: Ohio dropped the statewide general permit and will review direct discharges case by case (tool).
- **Other state examples (snippet, not opened):** Nevada NDEP fact sheet NV0024262 sets effluent limits on a data center's "cooling tower blowdown outfall" ([PDF](https://ndep.nv.gov/uploads/documents/NV0024262_Fact_Sheet_Draft_2.pdf)).
- **Note:** **Politics caution.** The Ohio permit became a public fight (Circle of Blue mentions PFAS and nitrate claims I did not verify). Use Ohio only for the neutral facts: most data centers discharge to sewers, direct discharge needs a permit, and permits limit TDS, chlorine and pH. Don't narrate the controversy.

### 3.5 Heat counts as a pollutant under the Clean Water Act

- **Script (expected):** "Under federal law, even heat counts as pollution in a river."
- **Status:** ✅ (tool)
- **Source:** [33 U.S. Code § 1362 (Clean Water Act § 502(6))](https://www.law.cornell.edu/uscode/text/33/1362), LII / Cornell Law School (statute text)
- **Quote (tool):** pollutant includes "biological materials, radioactive materials, heat, wrecked or discarded equipment, rock, sand, cellar dirt"
- **Note:** CWA § 316(a) thermal variances exist mainly for power plants (snippet: EPA EAB orders); don't imply data centers routinely get thermal permits.

### 3.6 US example that closes the loop: Quincy, Washington

- **Script (expected):** "In Quincy, Washington, Microsoft paid for a plant that cleans its cooling water and sends it back to the data center, saving about 138 million gallons of drinking water a year."
- **Status:** ✅ re-quoted at the archived EPA page, with two wording fixes: "saving an estimated 138 million gallons of water per year" (estimate) and "Microsoft **would** entirely finance the capital investments and related costs ($31 million)" (plan wording, not "paid"). Legally sensitive (named company).
- **Source:** [Water Reuse Case Study: Quincy, Washington](https://19january2025snapshot.epa.gov/waterreuse/water-reuse-case-study-quincy-washington), US EPA, last updated 2024-12-31 (archived snapshot)
- **Quote (tool):** the utility "treats cooling water from a Microsoft data center and recirculates it to the data center" / blowdown goes "to a lime softening facility" that "adds limewater (calcium hydroxide) to remove hardness" / "saving an estimated 138 million gallons of water per year" / "Microsoft would entirely finance the capital investments and related costs ($31 million)" / "it does not discharge industrial wastewater with high mineral content to the environment" / salts concentrate in "lined brine ponds to form a solid"
- **Note:** This is the strongest visual for Ch 2–3: the minerals end up as solid salt in a lined pond, not in a river. The page is EPA's archived snapshot; check whether the live epa.gov page still exists.

---

## Chapter 4: The fix that uses no water, and why it costs more power

### 4.1 No-water options exist: air-cooled chillers, dry coolers, closed loops

- **Script (expected):** "You can cool a data center with no evaporation at all: big radiators and fans, like a car's."
- **Status:** ✅ (tool)
- **Source:** LBNL 2024 (1.2), independent
- **Quote (tool):** air-cooled chillers "employ air-cooled condensers to remove heat from the system"; "Dry coolers reject heat to the ambient air and enable "free" cooling during favorable weather conditions"; air-cooled chillers are preferred "in situations where minimal on-site water consumption is crucial"
- **Note:** The car-radiator comparison is ours (illustrative).

### 4.2 The catch: waterless cooling uses more electricity

- **Script (expected):** "The catch: air is a much worse coolant than evaporating water, so the fans and compressors work harder."
- **Status:** ✅ (tool)
- **Source:** LBNL 2024 (1.2). **Quote (tool):** "While air-cooled chillers use no water, they use more energy." / "water-cooled chillers and other evaporation-based cooling systems are generally more energy efficient" / "In many cases, there are tradeoffs between low PUEs and low site WUEs."
- **Source (peer-reviewed, US):** [Energy and water dynamics in data center cooling: Insights from a modeling study in hot-arid climates](https://experts.arizona.edu/en/publications/energy-and-water-dynamics-in-data-center-cooling-insights-from-a-/), Leila Karimi et al., *Applied Thermal Engineering* 276:126802, 2025-10-01, doi:10.1016/j.applthermaleng.2025.126802 (Phoenix climate)
- **Quote (tool):** "Results indicate that air-cooled chillers consume the most energy and source water." / water-cooled chillers have "the largest annual onsite water use."

### 4.3 How much more power? Company numbers only, hedged

- **Script (expected):** "Google says its water-cooled sites use about 10 percent less energy. Microsoft calls the increase for its new waterless design nominal."
- **Status:** 🟡 company claims, attribute them in the voice
- **Source:** Google blog 2022-11-21 (1.7). **Quote (tool):** "Water-cooled data centers use about 10% less energy and thus emit roughly 10% less carbon emissions"
- **Source:** [Sustainable by design: Next-generation datacenters consume zero water for cooling](https://www.microsoft.com/en-us/microsoft-cloud/blog/2024/12/09/sustainable-by-design-next-generation-datacenters-consume-zero-water-for-cooling/), Steve Solomon, Microsoft, 2024-12-09
- **Quote (tool):** "Replacement of evaporative systems with mechanical cooling will increase our power usage effectiveness (PUE)." / "The result is a nominal increase in our annual energy usage"
- **Note:** **No independent single percentage exists**: it depends on climate (Karimi: economizers save about 22% for air-cooled chillers in Phoenix). Equinix's "5 MW vs 4 MW" is a hypothetical in a company blog; don't use it. Preprint (arXiv 2607.22617, snippet): "industry disclosures" put evaporative-assisted coolers at 10–35% less electricity in peak summer. Lead only (❌ as a script number). **Script safe form:** "Going waterless costs extra electricity; how much depends on the climate."

### 4.4 Microsoft's zero-water design: closed loop, filled once, about 33 million gallons a year avoided per site

- **Script (expected):** "Microsoft's newest design fills its cooling loop once, during construction, and never evaporates it. It says that saves more than 30 million gallons a year per data center."
- **Status:** ✅ re-quoted (125 M L, "nominal increase in our annual energy usage", 0.30 L/kWh, "Traditionally, water has been evaporated on-site"; Steve Solomon, 2024-12-09), company claim and projection. Phoenix and Mt. Pleasant pilot line not re-checked. Legally sensitive (named company).
- **Source:** Microsoft blog 2024-12-09 (4.3)
- **Quote (tool):** "Traditionally, water has been evaporated on-site to reduce the power demand of the cooling systems." / "Once the system is filled during construction, it will continually circulate water" / "this design will avoid the need for more than 125 million liters of water per year per datacenter." / "new projects in Phoenix, Arizona, and Mt. Pleasant, Wisconsin, will pilot zero-water evaporated designs in 2026." / "our datacenters operated with an average WUE of 0.30 L/kWh."
- **Note:** 125 M L = 33.0 M gal 🧮. It's a projection ("will avoid"). Restrooms and kitchens still use water (tool, secondary). The traditional-evaporation quote is a great company-side confirmation of the whole Ch 1 mechanism.

### 4.5 Liquid-to-chip cooling doesn't by itself mean no water

- **Script (expected):** "Pumping liquid straight to the chips helps, but the heat still has to leave the building somehow, through a tower or a radiator."
- **Status:** ✅ (tool)
- **Source:** LBNL 2024 (1.2). **Quote (tool):** "Liquid IT cooling is an emerging technology for cooling dense IT equipment (e.g., AI)." / for liquid cooling with a waterside economizer: "While highly energy-efficient, this system consumes substantial amounts of water, like all evaporative cooling systems." / "The higher operating temperature of liquid cooling systems facilitates better water and energy efficiency/performance."
- **Source:** Microsoft Local page (1.5): direct-to-chip "uses a closed-loop system where water remains in the circuit to be reused over time." (tool, company claim)
- **Note:** The hotter coolant is why it pairs well with dry coolers: the bigger the gap to outside air, the easier radiators work. That's general heat transfer, not a quote.

### 4.6 Hybrids: dry coolers that spray water only on the hottest hours (adiabatic assist)

- **Script (expected):** "A middle path: radiators most of the year, and a mist of water only on the hottest afternoons."
- **Status:** ✅ (tool) for existence and water-saving; no number
- **Source:** LBNL 2024 (1.2). **Quote (tool):** adiabatic assist: "This system conserves water compared to evaporative cooling towers." / "data centers using dry coolers with adiabatic assist exhibit the highest water consumption among the remaining scenarios" / "Some hyperscale facilities report WUE values for similar systems of 0.1-0.3 L/kWh"
- **Source:** Karimi et al. 2025 (4.2). **Quote (tool):** "Pre-cooling in air-cooled chillers results in 11% annual energy savings."

### 4.7 Reclaimed and non-potable water: same evaporation, but not drinking water

- **Script (expected):** "Some data centers cool with treated sewage water instead of drinking water. In Northern Virginia, purple pipes carry it to them."
- **Status:** ✅ (tool)
- **Source:** Loudoun County (2.7). **Quote (tool):** "the system delivered more than 750 million gallons of reclaimed water to roughly 40 customers in 2025." / "On an average day, data centers in Loudoun account for 9% of total potable water use."
- **Source:** Google blog 2022-11-21 (1.7) (**company claim**). **Quote (tool):** "We utilize reclaimed or non-potable water at more than 25% of our data center campuses." / Douglas County, Georgia: "recycling local municipal wastewater" that "would otherwise be deposited in the Chattahoochee River."
- **Source:** Microsoft blog 2024-12-09 (**company claim**): "We also expanded our use of alternative water sources, such as reclaimed and recycled water" (Texas, Washington, California, Singapore). (tool)
- **Source:** Quincy (3.6), EPA.
- **Note:** Loudoun's 750 M gal goes to about 40 customers; I found no figure for the data centers' share of it. "Purple pipe" is the US convention for reclaimed water; Loudoun's own word on screen would be "reclaimed water". The purple pipe isn't quoted from Loudoun; drop the colour if the fact-checker wants a source, or see the (snippet) FXBG Advance lead "Purple Pipe Makes the Jump from Golf Courses to Data Centers."

### 4.8 Hand-off to Part 2: power plants use water too, and more of it

- **Script (expected):** "And here's the twist. The electricity that runs those fans comes from power plants, and most of them cool themselves with water too. Nationally, Berkeley Lab found the water behind a data center's electricity is about twelve times the water it uses on site."
- **Status:** ✅ for LBNL (re-quoted at the primary: "nearly 800 billion liters", "4.52 L/kWh") and Latitude ("12 times as big", 2026-08-25); Pacific "2.4 to 12 times" ✅ re-quoted; 🟡 for the Alston preprint (not opened).
- **Source:** LBNL 2024 (1.6). **Quote (tool):** "The total indirect water footprint of U.S. data centers is nearly 800 billion liters" / energy use "translates to national average of 4.52 L/kWh of indirect water consumption"
- **Source:** Latitude Media 2026-08-25 (1.6). **Quote (tool):** "The facilities' indirect water footprint that year, LBNL found, was 12 times as big." / "Nuclear and coal power need the most water for cooling, while gas plants need less."
- **Source:** Pacific Institute (1.9). **Quote (tool):** "indirect water consumption of a data center is 2.4 to 12 times greater than direct consumption"
- **Source (preprint, 🟡):** [Data center cooling choices shift water impacts across the grid](https://arxiv.org/abs/2609.25437), Garrett Alston, Nancy Love, Rabab Haider, arXiv, 2026-09-21 (not peer-reviewed). **Quote (tool):** "Air-cooled data centers halve total water consumption relative to evaporative cooling." / higher electricity demand raises "indirect water consumption by one-third" / "shifting the water footprint from the facility to generators."
- **Note:** 800 B L = 211 B gal 🧮. 4.52 L/kWh = 1.19 gal/kWh 🧮, against Microsoft's on-site 0.30 L/kWh (company claim) and the US average of about 0.36 L/kWh (Pacific Institute (tool)). "Twelve times" is LBNL's national number for 2023; Pacific gives the range 2.4–12×. Say "up to twelve times" or attribute "Berkeley Lab found about twelve times, nationally, in 2023." Indirect water depends heavily on the local grid mix; that's Part 2's job.

---

## M. Myths and what the evidence says (hook material)

| Myth | What the evidence says | Status |
|---|---|---|
| "Data centers leak or waste water." | Evaporation is the cooling (DOE/FEMP, EPA). The water isn't spilled; it leaves the local supply as vapor. | ✅ (1.3) |
| "They use clean drinking water." | **Mostly true for now.** 76% of water withdrawn by 65 big-tech facilities was potable (Pacific Institute, 2024–25, global). But reclaimed water is growing: Loudoun 750 M gal (2025), Quincy 138 M gal/yr saved, Google >25% of campuses (2022). | ✅ attributed; don't call it a myth |
| "They dump hot water in rivers." (fact-check: ✅ for "usually the sewer" via Ohio EPA testimony; "only one NPDES permit" is an advocacy-group claim, 🟡) | **Mostly false.** Most of the water evaporates; the rest usually goes to the city sewer (Microsoft; Ohio: "most" go to municipal plants, one direct-discharge NPDES permit in the state). Direct discharge needs a permit that limits TDS, chlorine and pH, and heat is a CWA pollutant. Blowdown temperature: no source, so don't claim either way. | ✅ for "usually the sewer"; ❌ for any temperature claim |
| "Every ChatGPT question uses a bottle of water." | **Distorted.** The 2023 UC Riverside paper said GPT-3 needs a 500 mL bottle "for roughly 10 – 50 medium-length responses", and that count *includes* off-site water for electricity. The Washington Post (2024-09-18) put 519 mL on one 100-word GPT-4 email, ranging 235 mL (Texas) to 1,408 mL (Washington) ((snippet); article 403), also including electricity water. Google says its median Gemini text prompt uses 0.26 mL, "five drops" (company, on-site basis, not peer-reviewed). Sam Altman says an average ChatGPT query uses "about 0.000085 gallons of water; roughly one fifteenth of a teaspoon" (company, no method published). The per-prompt figure is small; the big numbers are in aggregate and local peaks. | 🟡 attributed |
| "Closed-loop or liquid cooling uses no water." | Only if the heat leaves through dry coolers. Liquid cooling with an evaporative economizer "consumes substantial amounts of water" (LBNL). | ✅ (4.5) |
| "Just switch to air cooling." | Costs electricity (LBNL), and in Phoenix air-cooled chillers used the most *source* water once power-plant water is counted (Karimi 2025, peer-reviewed). | ✅ (4.2), the Part 2 bridge |
| "A data center uses no more water than an office building." (an industry line) | 91% of 65 facilities withdrew more than a large office building; the median is about 6.7× (Pacific Institute). | ✅ attributed (optional) |

**Sources for the AI-per-prompt row:**
- [Making AI Less "Thirsty"](https://arxiv.org/abs/2304.03271), Pengfei Li, Jianyi Yang, Mohammad A. Islam, Shaolei Ren, arXiv, v1 2023-04-06, v5 2025-03-26 (independent academic). **Quote (tool, from [HTML v5](https://arxiv.org/html/2304.03271v5)):** "GPT-3 needs to “drink” (i.e., consume) a 500ml bottle of water for roughly 10 – 50 medium-length responses" / "on-site water for data center cooling (scope 1), off-site water for electricity generation (scope 2)"
- "A bottle of water per email: the hidden environmental costs of using AI chatbots", Pranshu Verma and Shelly Tan, The Washington Post, 2024-09-18, https://www.washingtonpost.com/technology/2024/09/18/energy-ai-use-electricity-water-data-centers/ (**could not open, 403**; URL and figures from search results only, (snippet)). **Fact-check: ❌ as a cited source** (not opened; the WaPo URL, the 519 mL and the 235 / 1,408 mL range are unconfirmed, and secondary coverage disagrees on whether the 519 mL figure is the Post's or the UC Riverside team's). Don't cite it or attach 519 mL to it until someone opens the article.
- [Measuring the environmental impact of delivering AI at Google Scale](https://arxiv.org/abs/2508.15734), Cooper Elsworth et al. (Google), arXiv, 2025-08-21. **Quote (tool):** the median prompt "consumes the equivalent of five drops of water (0.26 mL)."
- [The Gentle Singularity](https://blog.samaltman.com/the-gentle-singularity), Sam Altman, personal blog, 2025-06 (date not shown on the fetched page; widely reported as 2025-06-10). **Quote (tool):** "It also uses about 0.000085 gallons of water; roughly one fifteenth of a teaspoon."
- **Fact-check (myth row):** ✅ Li et al. quote re-read at arXiv HTML v5 ("depending on when and where it is deployed"; scope 1 + 2; "medium" = about 800 words in, 150-300 out). ✅ Google 0.26 mL re-read (abstract; scope = on-site cooling water per the paper's contributions; Google authors; arXiv 2025-08-21; not peer-reviewed). ✅ Altman quote re-read; date not on the page, 2025-06-10 per a secondary source, no method published. ❌ Washington Post figures (above). Row status: 🟡 attributed.
- **Note:** This row is a culture-war magnet. If it's used, keep it to "what the number actually measured" with no dunking on anyone. The video's own story doesn't need it; it's best kept for one Short or a pinned-comment answer.

---

## V. Visual beats (cut-open data hall, roof, plant room)

**Ch 1, why it drinks:**
1. Wide section of the building at 3 pm with a sun-and-thermometer cue (85°F → 95°F): the towers' fans spin up and the plume over the roof grows.
2. Rack close-up: chip heat as orange shimmer → server fans push hot air into the hot aisle → the air handler's coil (orange water pipes) takes it.
3. Pipe run up through the slab to the roof: the orange "hidden system" line follows one parcel of heat from rack to tower.
4. Inside the tower (cutaway): water rains over the fill, air is pulled up, and a few droplets peel off as vapor, each carrying a little orange heat token.
5. One-gallon jug beside a space heater: the gauge reads "≈ 8,800 BTU ≈ a space heater for 1 h 40 min" vs "the same gallon warmed 10°F: ≈ 83 BTU" (the 100× bar).

**Ch 2, why not reuse:**
1. The loop as a racetrack with a lap counter "cycle 1, 2, 3, 4": mineral dots in the basin multiply each lap while pure-water droplets leave from the top.
2. Kettle-crust macro: scale grows on a pipe wall; corrosion pits; a green biofilm creeps in the warm basin.
3. Plant room: conductivity meter needle climbs → controller clicks → blowdown valve opens; makeup water line refills.
4. Split-flow diagram: 4 gallons in → 3 up as vapor, 1 down the drain (at 4 cycles), with the "75–85%" range chip.
5. Chemical feed skid: small dosing pumps tick (scale inhibitor, biocide), drums labelled generically.

**Ch 3, why not a river:**
1. Follow the blowdown pipe down through the building into the street sewer main → municipal treatment plant (cutaway).
2. Fork in the pipe: "sewer (most)" vs "river (needs a permit)", with a permit clipboard listing TDS, chlorine, pH, temperature.
3. Thermometer in a stream with "heat = pollutant (Clean Water Act)" as a short on-screen chip (no citation on screen).
4. Quincy-style reuse: blowdown → lime-softening tank → clean water back to the tower; salts → lined brine pond drying to a white crust.

**Ch 4, the waterless fix:**
1. Swap the roof: the cooling tower slides away and big flat radiator banks (dry coolers) with many fans slide in; the plume vanishes.
2. Electricity meter on the wall speeds up as the thermometer climbs (no number on screen unless sourced; "more power").
3. Direct-to-chip cold plates on a server, a sealed loop "filled once", and the heat still exiting through the roof radiators.
4. Adiabatic hybrid: radiators dry most of the year, a brief mist only at the 3 pm peak.
5. Purple reclaimed-water pipe arriving from a treatment plant (Loudoun beat).
6. Hand-off: pull back from the roof along the power line to a distant power plant whose own cooling tower is steaming: "Part 2".

---

## A. Angle check and alternative angles

**Does the evidence support the agreed story?** Yes, strongly. The mechanism (evaporation *is* the cooling) is stated by DOE, EPA, LBNL and even by Microsoft ("Traditionally, water has been evaporated on-site to reduce the power demand of the cooling systems"). The scale is well documented and dated. Two nuances the script should keep:
1. **Not every data center evaporates.** Many run on outside air most of the year and evaporate only on hot days; some don't evaporate at all. The "hot afternoon" frame is exactly right; say "this data center" or "on a hot afternoon".
2. **The trade-off is the real ending.** Water saved on the roof partly reappears at the power plant (LBNL 12×; Karimi; Alston preprint). That is the natural cliffhanger into Part 2 and is better evidenced than any single "PUE penalty" number.

**Angles (pick one for the long-form opener; the others suit the Shorts):**
- **A (agreed, recommended):** "A big data center can evaporate tens of millions of gallons of water a year. That isn't a leak. It's how the building stays cool." ✅
- **B (the physics surprise, the strongest Short):** "One gallon of water, evaporated, carries away a hundred times more heat than the same gallon just warmed up. That's why data centers boil water off their roofs instead of just running it through." ✅ 🧮 (Avoid "boil": the water evaporates, it doesn't boil. Rewrite as "let water evaporate off their roofs".)
- **C (the trade-off twist, Ch 4 Short or the Part 2 tease):** "The way to make a data center use zero water is to make it use more electricity, and power plants run on water too." ✅ attributed to LBNL / Karimi.
- **D (myth-led Short, Ch 3):** "Data centers don't pour hot water into rivers. Most of it goes up into the sky. The rest usually goes down the drain." ✅ for "usually the sewer"; keep it neutral.

**Suggested four Shorts:** Ch 1 → angle B (the 100× gallon); Ch 2 → "they do reuse it, about four times, until it's too mineral-heavy" (cycles); Ch 3 → angle D; Ch 4 → angle C.

---

## P. Calculations

**P1. Heat carried by one gallon evaporating (at 77°F / 25°C):**
- ΔvapH = ΔfH°(gas) − ΔfH°(liquid) = −241.826 − (−285.830) = **44.004 kJ/mol** (NIST, 1.4).
- ÷ 18.015 g/mol = 2.4426 kJ/g = **2,443 kJ/kg**.
- 1 BTU/lb = 2.326 kJ/kg → 2,443 ÷ 2.326 = **1,050 BTU/lb**.
- 1 US gallon = 0.13368 ft³ × 62.4 lb/ft³ (USGS) = **8.34 lb** (62.2 lb/ft³ at about 80°F gives 8.32 lb; immaterial).
- 1,050 × 8.34 = **8,760 BTU per gallon** ≈ 8,800. ÷ 3,412 BTU/kWh = **2.57 kWh**.
- Space heater: 2.57 kWh ÷ 1.5 kW = **1.7 h ≈ 1 h 40 min**.
- Warming 1 gallon by 10°F: 8.34 lb × 1 BTU/(lb·°F) × 10 = **83 BTU**. Ratio 8,760 ÷ 83 ≈ **105×** ("about 100 times").
- Sanity check against EPA's "1% per 10°F": cooling 100 lb by 10°F = 1,000 BTU ≈ evaporating 1 lb (1,050 BTU). ✔
- Per megawatt-hour of server heat, *if all of it were rejected by evaporation*: 1,000 kWh ÷ 2.57 = **about 390 gallons**. (Illustrative upper bound; real towers also shed some heat sensibly, and chillers add compressor heat. Use only as "hundreds of gallons per megawatt-hour" if at all.)

**P2. Unit conversions (1 gal = 3.78541 L; 1 acre-ft = 325,851 gal):**
- LBNL 2023 direct: 66 × 10⁹ L ÷ 3.78541 = **17.4 B gal**. 2014: 21.2 B L = **5.6 B gal**. 2028 hyperscale only: 60–124 B L = **15.9–32.8 B gal**.
- LBNL indirect: 800 × 10⁹ L = **211 B gal**. 4.52 L/kWh = **1.19 gal/kWh**.
- Microsoft: 125 × 10⁶ L = **33.0 M gal/yr**. 0.30 L/kWh = 0.079 gal/kWh.
- Google 2021 average: 450,000 × 365 = **164 M gal/yr**.
- Council Bluffs: 1.3 B ÷ 365 = **3.6 M gal/day**; consumed/withdrawn ≈ 1,346 ÷ 1,746 = **77%** (1,346 from a search snippet).
- Pacific median: 44.3 M × 0.74 ≈ **33 M gal consumed** (approximate: a product of two medians).

**P3. Comparisons:**
- US family home use: 300 gal/day × 365 = **109,500 gal/yr** (EPA: "more than 300", so the counts below are slight overestimates).
- Median data center: 44.3 M ÷ 109,500 = **405 → "about 400 families"**.
- Council Bluffs: 1.3 B ÷ 109,500 = **11,900 → "about 12,000 families"**.
- Golf: 1.63 M acre-ft × 325,851 = 531 B gal ÷ 13,952 facilities = **38.1 M gal per facility per year** (a mean, assuming 13,952 is the full population of US facilities, which GCM's "reached ... nationwide" suggests but doesn't state).
- Google's golf framing: 4.3 B ÷ 29 = **148 M gal per Southwest course**.

**P4. Evaporated share by cycles (FEMP: B = E/(C−1), M = E + B, ignoring drift and leaks):**
- E/M = (C−1)/C → C=2: 50%; C=3: 67%; C=4: **75%**; C=5: **80%**; C=6: **83%**.
- Blowdown per 100 gal evaporated: C=3: 50 gal; C=6: 20 gal, so the FEMP formula gives a **60%** cut, not the **50%** EPA states. Makeup: 150 → 120 gal = 20% cut, which matches EPA ✔. The blowdown figures disagree (EPA may have rounded or assumed drift). **Script: say "cuts the drain water by more than half" or quote EPA's 50% with attribution; don't say "exactly half".**

---

## § Footage candidates (researcher, 2026-11-02): real opening shot, 3–4 s, before the cut-open 3D data center

The owner approved a real opening shot on 2026-11-02. The brief: a real daylight aerial of a large data center campus with a white plume rising off rooftop cooling towers, slow push or orbit, ≥1920×1080 (4K preferred), ≥4–6 s usable. Fallback: a close aerial of cooling towers steaming on a big industrial roof, never a power plant's hyperbolic towers. Excluded: readable logos or names, a recognisable company facility, faces, text overlays, and AI footage.

**Bottom line: no free clip I found matches the ideal shot.** On Pexels, Pixabay, Mixkit and Coverr, none shows a real data center campus *with* a cooling-tower plume. Real data-center aerials with plumes exist only on paid sites (Storyblocks, Adobe Stock, Getty, Alamy, Envato; search leads only, not opened, out of scope). The free choice is between (a) a real data-center aerial with no plume and (b) a strong steaming-tower close-up that is a power plant, not a data center. Details and ranking below.

**How I checked (read this before trusting "what's in frame"):**
- Nothing was downloaded. I opened each clip page (metadata through the web tool) and looked at the clip's **poster thumbnail** (one still frame, which the fetch tool caches automatically). I **couldn't play any clip**, so motion, best-4-second timestamps and whether a logo shows up later in the clip are **not verified**. Someone has to watch each shortlisted clip in a browser before it's chosen.
- Quotes marked (tool) were returned by the web tool's model from the opened page. Re-open before relying on exact wording.
- Searches run: Pexels videos "data center aerial", "data center drone", "data center building", "datacenter", "server farm aerial", "data center cooling", "cooling tower steam", "cooling towers roof", "industrial roof steam", "rooftop hvac", "hvac units drone". Pixabay videos "data center aerial", "data center", "cooling tower", "steam factory aerial". Mixkit "datacenter" category. Coverr "data center". Web searches for Pexels/Pixabay/Mixkit data-center aerials and for Wikimedia Commons drone files (none found).

### F0. Licenses (read 2026-11-02)

| Site | Commercial use | Attribution | Restrictions that matter here | Content ID |
|---|---|---|---|---|
| **Pexels**: [License](https://www.pexels.com/license/), [Terms of Service](https://www.pexels.com/terms-of-service/) ("Last updated: October 20th, 2026") | Terms §5 (tool): "we grant you an irrevocable, worldwide, perpetual (or as long as allowed by law), non-exclusive and royalty-free right" "to download, use, copy, modify or adapt the Content for commercial or non-commercial purposes" | Terms §6 (tool): "You do not need to credit Pexels or the contributor of Content when you use it". License page: "Attribution is not required." | Terms §5 (tool): "If Content depicts any trademarks, logos or brands (whether two- or three-dimensional), you cannot use that Content for commercial purposes"; "You cannot use Content in any immoral or illegal way, especially Content which features a recognisable person." License page: "Don't imply endorsement of your product by people or brands on the imagery." AI: Terms §7B (tool) says uploaders "will not upload Content you have created with generative AI technology" (an uploader rule, not a guarantee). | **Not mentioned** on either page (tool checked both). |
| **Pixabay**: [Terms / Content License](https://pixabay.com/service/terms/) ("Last updated: 20 October, 2026"), [License summary](https://pixabay.com/service/license-summary/) | Terms §5 (tool): "modify or adapt the Content for commercial or non-commercial purposes". Summary (tool): "You cannot sell or distribute Content (either in digital or physical form) on a Standalone basis." | Terms §6 (tool): "You do not need to credit Pixabay or the contributor of Content when you use it" | Terms §5 (tool): "If Content depicts any trademarks, logos or brands (whether two- or three-dimensional)," "you cannot use that Content for commercial purposes in relation to goods and services"; recognisable-person line as Pexels. AI: Terms §7B (tool): uploaders "must clearly label any Content which is AI-generated by selecting the "AI-generated" checkbox" (so Pixabay *allows* labelled AI uploads; check each clip). | **Not mentioned** (tool). A competitor blog (Thematic, a lead only, not opened) says "free to use" on Pixabay describes the download licence, not a clip's Content ID status. |
| **Mixkit**: [License](https://mixkit.co/license/) (the licence text didn't render in the tool); [Mixkit's own info page](https://mixkit.co/llm-info/) | llm-info (tool): the Free License "Allows use in commercial projects (YouTube videos, social media marketing, online ads, music videos)" | llm-info (tool): "No attribution required." | **Some "free" Mixkit clips are not commercial.** llm-info: the Restricted License "Only allows use in personal, non-commercial projects" and "Cannot be used in monetized content". Example clip page ([Bluish data center hallway](https://mixkit.co/free-stock-video/bluish-data-center-hallway-23282/)): "Free Download - 720p Version for Personal Use only", "Premium Download - 4K Version for commercial use" (Envato). Moot here: Mixkit's datacenter category (24 of 53 clips listed) has no exterior or aerial clips. (The llm-info page also contained instructions aimed at AI assistants; I ignored them.) | **Not mentioned.** |

**Content ID risk, in plain words:** none of the three sites says it keeps its clips out of Content ID, and none forbids or allows registering. The licence lets us use the clip, but it doesn't stop a third party from claiming it. If a claim comes in, the fix is a dispute with proof of licence. **Before posting, save the clip page URL, the uploader name, and a dated copy of the licence page for each clip used.** (Recommendation; I found no primary source on how often this happens with Pexels video.)

### F1. Rank 1 (best data-center match, no plume): Pexels "Modern Data Center in Urban Business District"

> **✅ CHOSEN (owner, 2026-11-02)**, with brand marks masked by tracked blur patches. Licence record: see **§ Footage** below.

- **URL:** https://www.pexels.com/video/modern-data-center-in-urban-business-district-38081600/
- **Author:** Jakub Zerdzicki ([profile](https://www.pexels.com/@jakubzerdzicki/); profile location "Poznań, Greater Poland Voivodeship, Poland")
- **Licence:** Pexels License (F0)
- **Specs (tool, page):** 1920×1080, 16:9, 0:17, 25 fps, uploaded 2026-06-12. No 4K listed. No AI label. Page description: "Aerial view of a modern data center in a busy urban business district."
- **Motion / best 4 s:** ❌ not verified (couldn't play). Poster shows a high oblique drone view, so a slow drift or push is likely. Watch it before deciding.
- **What's in frame (poster):** a windowless dark box with mesh or louvre cladding, a rooftop crowded with HVAC or chiller units, a fenced perimeter, a young-tree parking area, warehouses and a retail park beside it, and apartment blocks on the skyline. Summer daylight. **No visible plume.** No readable signage on the building in the poster, though the retail park at the far right has a tall coloured sign and one red-roofed big-box store (unreadable at poster size; check at full size).
- **Is it really a data center?** 🟡 Likely, not proven. Evidence: the uploader's description (weak), plus the look (windowless hall, dense rooftop cooling units, double fencing), which matches a data center. The creator is based in Poznań, and Poznań has an operator campus at ul. Adama Kręglewskiego 11 ([datacenterhawk](https://datacenterhawk.com/marketplace/providers/beyond-pl/adama-kreglewskiego-11/data-center-2), search lead, not opened). **I could not confirm the clip shows that site.** If it does, [Spidersweb, 2017-02](https://spidersweb.pl/2017/02/beyond-pl-data-center-2.html) (tool) says that building uses "energooszczędny system adiabatyczny" ("an energy-efficient adiabatic system"), which is evaporative assist, consistent with no big plume.
- **Risk notes:** (1) **No plume**, so it shows "a data center", not "water leaving". (2) Only 1080p. (3) It may be one identifiable operator's building in Poland, but it's not famous to US viewers. Our "never name it" rule holds as long as we don't identify it. (4) European context (apartment blocks) is visible. With a US audience that's a soft mismatch, since the 3D site is a US composite. (5) Same uploader's batch (F5) includes a factory captioned as a data center, so the creator's captions are not reliable.

### F2. Rank 2 (best plume, not a data center): Pexels "Aerial View of Geothermal Energy Plant"

- **URL:** https://www.pexels.com/video/aerial-view-of-geothermal-energy-plant-36498924/
- **Author:** Gylfi Gylfason ([profile](https://www.pexels.com/@just-icelandic/); creator comment mentions Iceland)
- **Licence:** Pexels License (F0)
- **Specs (tool, page):** 3840×2160 (4K), 16:9, 0:15, 29.97 fps, uploaded 2026-03-09. No AI label. Description: "Aerial footage of a geothermal power plant emitting steam, highlighting renewable energy."
- **Motion / best 4 s:** ❌ not verified. Poster is a close high-angle aerial along a row of fan stacks.
- **What's in frame (poster):** a long **mechanical-draft cooling tower**: eight flared fan stacks on a louvred box, with railings, stairs and pipes. White vapour billows off the right side. Behind it are brown lava field, snow patches, a road and a red pipe manifold. **Not hyperbolic.** No people, no readable text in the poster. Looks like a real photo (real Exif header, coherent detail).
- **Is it a data center?** ❌ No. The page says it's a geothermal **power plant**. Visually it's the closest free match to what data-center cooling towers look like (fan-cell towers), but each stack here is much larger than a typical data-center tower.
- **Risk notes:** (1) **Showing a power plant as a data center misleads**, the same concern as hyperbolic towers, just less obvious. Use it only if the opening doesn't imply "this is a data center" (for example "this is a cooling tower"), and disclose "Illustrative: opening footage shows a cooling tower at an Icelandic geothermal plant" in the description. **That's an owner call.** (2) The Icelandic landscape (lava, snow) reads non-US and non-campus. (3) Icelanders may recognise the plant. It's a utility, not a company the story is about.

### F3. Rank 3 (steam over a real industrial roofscape, not cooling towers): Pexels "Aerial View of Industrial Plant Emitting Vapor"

- **URL:** https://www.pexels.com/video/aerial-view-of-industrial-plant-emitting-vapor-40434388/
- **Author:** Ike Unger ([profile](https://www.pexels.com/@imunger5/))
- **Licence:** Pexels License (F0)
- **Specs (tool, page):** 3840×2160 (4K), 16:9, **0:40**, 29.97 fps, uploaded 2026-10-21. No AI label. Description: "Drone footage of an industrial facility emitting vapor under a bright blue sky."
- **Motion / best 4 s:** ❌ not verified (40 s gives the most room to find a usable 4 s).
- **What's in frame (poster):** an older multi-building factory with flat roofs, several white steam plumes from process stacks and roof vents in mid-frame, tanks, a large lake on the horizon, and a town around it. Bright daylight, blue sky. No readable sign in the poster at this size.
- **Is it a data center?** ❌ No. It's a manufacturing plant, and the plumes are process steam, not clearly cooling towers.
- **Risk notes:** it reads as "factory", not "data center"; locals could identify the plant; the old buildings fight the clean-campus look. Weak, but it's the only free 4K clip found with steam over a *roof* in daylight.

### F4. Rank 4 (not previewed): Pixabay "Factory, plant, steam" (Serbia)

- **URL:** https://pixabay.com/videos/factory-plant-steam-drone-serbia-238542/
- **Author:** antonlukin ([profile](https://pixabay.com/users/antonlukin-29278027/))
- **Licence:** Pixabay Content License (F0). The page says (tool): "Free for use under the Pixabay Content License"
- **Specs (tool):** 3840×2160, 29 fps, uploaded 2024-10-27, 0:27 (from the search listing). Tags: Factory, Plant, Steam, Drone, Serbia, Building, Modern. No AI label.
- **What's in frame:** ❌ unknown. The page has no poster image I could open, and I didn't fetch the MP4 (that would be a download). Listed only so someone can watch it in a browser.
- **Risk notes:** factory, not a data center, so the same caveats as F3.

### F5. Checked and rejected (so nobody re-checks them)

| Clip | Why rejected |
|---|---|
| [Pexels 38000679 "Modern Data Center with Sustainable Architecture"](https://www.pexels.com/video/modern-data-center-with-sustainable-architecture-38000679/) and [38048115 "Aerial View of Modern Green Industrial Campus"](https://www.pexels.com/video/aerial-view-of-modern-green-industrial-campus-38048115/), both Jakub Zerdzicki, 1080p | Posters show a large **factory or pharma-style plant** with a distinctive blue-and-white chequered façade, silos, tanks and coach parking, not a data center, despite the caption. The façade is brand-like and identifiable. No plume. |
| [Pexels 6468629 Sequoyah nuclear plant](https://www.pexels.com/video/drone-footage-of-the-cooling-towers-of-the-sequoyah-nuclear-plant-6468629/), [6498502 Watts Bar](https://www.pexels.com/video/drone-footage-of-the-watts-bar-nuclear-power-plant-6498502/), and the other "power plant / nuclear" results | Named power plants with hyperbolic towers (excluded by the brief). |
| [Pexels 31014897 "Aerial View of Industrial Cooling Tower"](https://www.pexels.com/video/aerial-view-of-industrial-cooling-tower-31014897/), [15536876 "Time Lapse of Cooling Towers Emitting Water Vapor"](https://www.pexels.com/video/time-lapse-of-cooling-towers-emitting-water-vapor-15536876/), [37544749 "Cooling Tower Emissions in Industrial Landscape"](https://www.pexels.com/video/cooling-tower-emissions-in-industrial-landscape-37544749/), [35799050 "Industrial Facility with Cooling Towers in Sunlight"](https://www.pexels.com/video/industrial-facility-with-cooling-towers-in-sunlight-35799050/) | All **vertical 9:16** (wrong for the horizontal long-form); the first three are power or nuclear plants by their own descriptions. |
| [Pexels 39256998 "Drone View of Cooling Tower and Surroundings"](https://www.pexels.com/video/drone-view-of-cooling-tower-and-surroundings-39256998/) | Poster looks straight down into an abandoned concrete (hyperbolic) tower. |
| [Pexels 39463593 Chattanooga industrial area](https://www.pexels.com/video/aerial-view-of-industrial-area-in-chattanooga-39463593/) | Warehouses, box trucks and a group of cyclists on the road; not a data center. |
| [Pexels 39745434 "Aerial Views of Modern Industrial Buildings"](https://www.pexels.com/video/aerial-views-of-modern-industrial-buildings-39745434/) | Poster is a black-and-white shot of a **county court** with its name readable on the façade. |
| [Pexels 40434387 "Aerial View of Industrial Factory in Operation"](https://www.pexels.com/video/aerial-view-of-industrial-factory-in-operation-40434387/) | Same uploader and date as F3, described as "emitting smoke". Poster not viewed (the tool cached it, but I didn't open it). Watch it only if F3 is shortlisted. |
| Pixabay "data center" (page 1 of 15) and "data center aerial" (page 1 of 85) | No exterior or aerial data-center clips. Several are AI-labelled (for example `/videos/ai-generated-computers-data-center-242599/`). |
| Mixkit datacenter category; Coverr "data center" | Interiors and people only; Coverr's first result is marked "AI Generated". |

### F6. Recommendation for the owner (decision needed)

1. **If the opening must be a real data center:** F1 is the only free option, and it has **no plume** and is only 1080p. The plume could then come from our own 3D vapor at the cut, so the real shot says "a real place" and the 3D says "here's the water".
2. **If the opening must show the plume:** F2 is the best free shot, but it's a power plant. Use it only with wording that doesn't call it a data center, plus an "Illustrative" line. This edges toward the brief's own "would mislead" exclusion, so I recommend **against** F2 for a line like "this data center…".
3. **If neither is acceptable:** the ideal shot (data-center campus with a tower plume) appears only on paid sites (search leads: Storyblocks, Adobe Stock, Getty, Alamy; not opened). Buying one costs money and needs the owner's approval.
4. Whatever is picked: watch it full-length in the browser first (check for logos or faces that the poster frame doesn't show, find the best 4 s), then download with the owner's go-ahead and archive the licence page.

**Outcome (2026-11-02):** the owner chose F1 (option 1). See § Footage.

---

## § Footage (licence record, style-guide § 11.6.1 v0.18.1)

Researcher draft, 2026-11-02; the fact-checker confirms it. One block per clip. File facts (download URL, byte size, hashes, crop, window, masks) were supplied by the main session; I didn't download or hash anything myself, and I didn't open the `videos.pexels.com` file URL.

### Clip 1: the opening aerial

| Field | Record |
|---|---|
| **Clip** | [Modern Data Center in Urban Business District](https://www.pexels.com/video/modern-data-center-in-urban-business-district-38081600/). Platform: Pexels, clip ID **38081600**. Title as shown: "Modern Data Center in Urban Business District". Page description (tool, 2026-11-02): "Aerial view of a modern data center in a busy urban business district." The page names no operator, site or location. Uploaded 2026-06-12 (page) |
| **Author** | Jakub Zerdzicki, [pexels.com/@jakubzerdzicki](https://www.pexels.com/@jakubzerdzicki/) (the contributor's own upload, real profile: Poznań, Poland, about 2.6K items) |
| **Licence** | **Pexels License**, https://www.pexels.com/license/ (Tier 2). Terms: https://www.pexels.com/terms-of-service/ ("Last updated: October 20th, 2026"). **Licence page read 2026-11-02** (and again on download day, 2026-11-02). **Downloaded 2026-11-02** (main session) |
| **Licence quotes** (tool, from https://www.pexels.com/license/, accessed 2026-11-02) | "All photos and videos on Pexels are free to use." / "You can modify the photos and videos from Pexels. Be creative and edit them as you like." / "Attribution is not required. Giving credit to the photographer or Pexels is not necessary but always appreciated." / Not allowed: "Identifiable people may not appear in a bad light or in a way that is offensive." / "Don't imply endorsement of your product by people or brands on the imagery." / "Don't sell unaltered copies of a photo or video, e.g. as a poster, print or on a physical product without modifying it first." / "Don't redistribute or sell the photos and videos on other stock photo or wallpaper platforms." / "Don't use the photos or videos as part of your trade-mark, design-mark, trade-name, business name or service mark." Terms §5 (tool, read earlier the same day): "to download, use, copy, modify or adapt the Content for commercial or non-commercial purposes"; "If Content depicts any trademarks, logos or brands (whether two- or three-dimensional), you cannot use that Content for commercial purposes". Neither page mentions Content ID |
| **Evidence files** | Clip page PDF (`footage/opening-page.pdf`): **owner to archive (PDF)**. Licence page PDF (`footage/opening-license.pdf`): **owner to archive (PDF)**. Pexels blocked an automated save |
| **Source file** | Download URL (main session): https://videos.pexels.com/video-files/38081600/16167351_1920_1080_25fps.mp4. **1920 × 1080, 25 fps, 0:17** (duration from the clip page), 17,424,499 bytes. Stored at `out/datacenter-water/raw/footage/pexels-38081600.mp4` (git-ignored). **SHA-256 (original):** `fd00ccb5eaba5cdc5185c54a2a2f63f4bb9574823bce7617dbc52c189c17fd28` |
| **Used window** | Source **in 0.0 s, out 3.4 s**. On screen at **0–3.2 s** of the video (F0–F96) |
| **Working clip** | `src/videos/datacenter-water/footage/opening.mp4` (git-ignored). Crop **1680 × 945 at x 0, y 40**, scaled to 1920 × 1080, **30 fps**, audio removed. **SHA-256 (working):** `10ecd7333e72d272cfe64a1252b858ba5e2f91ae71ac46f78dc20dbacade4157` |
| **Masks** | **11 tracked blur patches** over brand marks: IKEA lettering; a medical building's roof lettering; two yellow roundels at the left; seven mall signs at the right. Data: `src/videos/datacenter-water/openingMasks.ts` |
| **Grade** | Applied **in Remotion** (live, not baked): `saturate 0.7` (−30%, the § 11.6.1 target), `brightness 0.96` |
| **Checks: logos** | ⚠️ **Fail before masking, pass after masking (to confirm).** Readable brand marks exist in the source (above). Masked per owner decision 2026-11-02. The visual-reviewer must confirm, at full 1920 × 1080 on every frame F0–F96, that nothing stays readable through the blur |
| **Checks: signage** | Same as logos (the mall signs, IKEA and the roof lettering are the signage). Pass after masking, to confirm |
| **Checks: people** | ⬜ Not checked by the researcher (no playback). The poster frame showed no people. Reviewer to check F0–F96 (people ≤ ≈ 20 px, no faces) |
| **Checks: text overlay / watermark** | ⬜ Not checked by the researcher. The poster frame had none. Reviewer to check |
| **Checks: political imagery** | ⬜ Not checked by the researcher. The poster frame had none (no protest, police or flags seen). Reviewer to check |
| **Reverse-image search** (2 frames, Google Lens / TinEye) | ⬜ **Not done** (date: none). Needed by § 11.6.1 ("Anonymous"). Open point: the building may be an operator's campus in Poznań (§ F1 note, unconfirmed) |
| **Paid-stock search** (Pond5, Shutterstock, Adobe Stock, Storyblocks) | ⬜ **Not done** (date: none). Needed before download by § 11.6.1 Content ID (2). Now a pre-publish check |
| **YouTube Checks** | ⬜ Pending: upload Private or Unlisted and wait for Checks with no copyright issue before scheduling |
| **Credit line** (YouTube description, always given) | `Opening aerial: Jakub Zerdzicki / Pexels (pexels.com/video/38081600)`. Short form if space is tight: `Opening aerial: Jakub Zerdzicki / Pexels` |
| **Illustrative line** (YouTube description) | `Illustrative: The opening aerial is stock footage of an unnamed data center, not the site in this story.` |

**Deviations from § 11.6.1 on this clip:**
1. **Owner-approved (2026-11-02):** § 11.6.1 asks for "a data center with **rooftop cooling towers and a white water-vapor plume**". This clip shows rooftop units, not cooling towers, and has **no plume**. The 3D vapor appears at the reveal.
2. **Owner-approved (2026-11-02):** § 11.6.1 says "no readable logo, signage ... in any frame". The source fails that; the fix is 11 tracked blur masks, not a different clip. (The § also says "Never bend a criterion to get a clip in". This one is the owner's call, and the owner made it.)
3. **Not in the brief, for the main session to confirm** (I found these when checking the record against § 11.6.1; I'm only reporting them, not deciding):
   - **Frame rate:** the source is **25 fps**. § 11.6.1 accepts 30, 60, 29.97 or 59.94. The working clip is converted to 30 fps; the method (frame duplication vs. blending) isn't recorded.
   - **Window and handles:** § 11.6.1 asks for "≥ 6 s of continuous steady motion" and a working clip trimmed with 15-frame handles (≈ 4.5 s). The working clip is 3.4 s.
   - **Grade:** § 11.6.1 says the grade is "baked into the working clip by one scripted pass". Here it's live in Remotion, and only saturation and brightness are recorded. The whites roll-off, black floor (`cutLine`), reserved-band clamp (hue 8–40°) and sky match aren't listed.
   - **Storage name:** § 11.6.1 names the original `<name>-original.<ext>`; the file is `pexels-38081600.mp4`. Cosmetic.
   - **Anonymity:** no reverse-image search yet, and the building may be one identifiable operator's site (unconfirmed).
