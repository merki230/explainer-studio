# Sources: ev-charging

Researcher draft, 2026-10-27. Re-checked against script v2 (12 lines): see "Re-check of script v2" first; it overrides the v1 section where lines changed. Fact-checked against script v1 (11 lines) on 2026-10-27: see "Fact-check of script v1" below, which overrides the researcher's statuses in the sections after it. Sections after it keep the researcher's research notes (some statuses there are updated, marked "Fact-checker").

Owner-approved angle: why EV charging takes as long as it does, and how some Chinese EVs claim to cut it to minutes. Two drivers on the same road trip plug in side by side, one in a Tesla and one in a Chinese EV. We cut open both cars and both chargers: cables, battery, heat. Payoff: why US drivers don't have this yet, and whether it matters. Owner-approved hook: "In China, some electric cars now claim to charge in about the time it takes to fill a gas tank."

Everything was accessed on 2026-10-27. **How to read the quotes:**

- **(tool)** means the web tool's small model returned the quote from the page. Re-open and re-quote before ✅. tesla.com, edmunds.com, cspdailynews.com and gmauthority.com returned 403. PDFs (DOE XFC report, GasBuddy report) could not be parsed because `pdftoppm` isn't installed.
- **(snippet)** means I saw it only in a search-result summary and didn't open the page. Lead only (🟡 at best).
- **🧮** means our own calculation. The inputs are sourced and the working is shown in section P.
- Numbers in **[brackets]** are my arithmetic or inference.
- **"Claim"** = the company's own figure. **"Tested"** = measured by someone outside the company. Most Chinese headline numbers are claims.
- **km → miles:** 1 km = 0.6214 mi. Chinese range numbers are **CLTC**, which reads about 35% higher than the US EPA rating (C3). Never turn a CLTC km figure into "miles" without saying so or discounting it.

---

## Re-check of script v2 (12 lines, fact-checker, 2026-10-27)

Verdict: **PASS** (no ❌). This section overrides the v1 section for lines that changed. One REQUIRED wording fix (line 10). The grid line (v1 claim 8) and the tariff (v1 claim 9) are no longer in the script, so those entries below are retired and need no status. Re-opened this session: BIS press release (confirmed), motor1 (opened). Still could not open: tesla.com, CSP Daily News / GasBuddy pages (403), the GasBuddy PDF.

| Script line | Status | Note |
|---|---|---|
| 1 "…claim to charge in about the time of a stop at the gas pump." | 🟡 | "In China", "some", "claim" ✅ (BYD gen 2 on 10 models; Zeekr). "A stop at the gas pump" is defensible and better than "fill a gas tank": a whole stop (pull in, pay, pump, leave) is about 3-6 min, and BYD's 5 min is inside that. Pumping alone is 1.2-1.5 min (🧮: 12-15 gal at the 10 gal/min cap, ✅ 40 CFR 1090.1550(b); tank size assumed). Dwell-time source, snippet only: GasBuddy Q3 2018 foot-traffic report via CSP Daily News: 45% of visits to a gas station or c-store lasted 5 minutes or less, 30% 5-10 min (page 403; "visit" = 2-30 min within 30 m of a pump, includes the store; 2018 data). So 5 min is a typical-to-longish stop, not a fast one. Needs no change: "about", "claim" and line 2's number keep it honest. To reach ✅: open the CSP/GasBuddy page, or hedge as "…about the time of a quick stop at the gas station." |
| 2 BYD says five minutes, 10 to 70% | ✅ | Unchanged (v1 claim 2). |
| 3 Model Y "would take about half an hour, from ten to eighty percent" | ✅ time; 🎭 "charging next to it" | Unchanged (v1 claim 3: Evercars 31:14, InsideEVs ~27 min). |
| 4 "That gap comes down to amps." | 🟡 | The gap is power (BYD 1,000-1,500 kW vs a Model Y's 250 kW); power is volts times amps, and BYD runs more amps (1,000-1,500 A vs about 625 A for a Model Y at 250 kW and 400 V, 🧮 P1), so it is true but compressed, and it ignores cell chemistry. OPTIONAL: "That gap comes down to power, which is volts times amps." |
| 5 P = V × I; Model Y about 400 V; "more amps" | ✅ P = V × I; 🟡 "about 400 volts" | As v1 claim 4. "About" is the hedge. |
| 6 "More amps means more heat in the cable and the battery" | ✅ cable (I²R, HyperPhysics; ABB patent); 🟡 battery | DOE workshop lists "rapid temperature rise" as a limit (snippet). Analogy needs no source. |
| 7 "And as the battery fills, the Tesla slows the charge to protect it." | ✅ | The required v1 fix is applied. Taper measured: Evercars Model Y 221 to 42 kW at 80%. "To protect it" matches Argonne/ScienceDaily (lithium plating, "one of the main causes of impaired battery performance during fast charging"). Heat is no longer given as the cause. Legally sensitive (Tesla): fine, general statement backed by tests. |
| 8 "about a thousand volts, same power with less than half the amps" | ✅ | v1 claim 6: 400/1000 = 40%; BYD says 1,000 V (EVCS), TechCrunch 945 V. "Same power" is a hypothetical. 🧮 |
| 9 "BYD says its chargers push up to fifteen hundred amps, through cables built to carry it." | 🟡 | Attributed, as v1 suggested. BYD's own gen 2 page gives 1,500 **kW**, not amps; 1,500 A is EVCS (Mark Kane, 2026-03-06: "maximum current is 1,500 amps") and follows from 1,500 kW at 1,000 V (🧮). EVCS also says it assumes the connector is upgraded "though there is little to no information on that". "Cables built to carry it" is inferred (above about 250 A a cable needs liquid cooling, ABB patent; gen 1 cables are liquid-cooled, CarNewsChina 2026-02-24). Acceptable with "BYD says". To reach ✅: "BYD says its chargers push up to fifteen hundred kilowatts" or "…reportedly up to fifteen hundred amps". Legally sensitive (BYD): attributed, no safety claim. |
| 10a "Here in the US, BYD doesn't sell its cars" | 🟡. **REQUIRED: "its passenger cars"** | BYD does sell commercial vehicles in the US (buses and trucks built in Lancaster, CA: Mass Transit/InsideEVs 2019, search results; a search summary says BYD sells commercial vehicles in the US), so "its cars" is true only for passenger cars, which is the ordinary reading, but say it exactly. Support: [Why Can't You Buy A BYD In America?](https://motor1.com/features/811958/why-cant-you-buy-a-byd-in-america/), Dan Mihalascu, Motor1, "Oct 15" (year not shown; cites an October 2026 report) (opened 2026-10-27): "the Chinese automaker remains largely shut out of the US market"; BYD's Stella Li "ruled out expanding the company's passenger-car business into the United States under current conditions". No primary source saying "BYD sells no passenger cars in the US" was found, and "largely shut out" is softer than "doesn't sell". Status stays 🟡 until a ✅ source is opened (BYD US site or a Commerce/USTR statement). Legally sensitive (BYD). |
| 10b "a federal rule bans their connected-car software starting with 2027 models" | ✅ rule and year; 🟡 "their" | [Commerce press release](https://www.bis.gov/press-release/commerce-finalizes-rule-secure-connected-vehicle-supply-chains-foreign-adversary-threats), BIS, 2025-01-14 (re-opened 2026-10-27): "The software-related prohibitions will take effect for Model Year 2027." The rule "prohibits manufacturers with a sufficient nexus to the PRC or Russia from selling new connected vehicles" containing covered software, and bars "the import and sale of vehicles containing VCS or ADS software". It applies to the maker's cars, built abroad or in the US, and does not name BYD (BYD's coverage is inference from its PRC base, obvious but unstated). Exact wording: "bans software from Chinese-linked carmakers". Not enacted and not relevant here: the Connected Vehicle Security Act of 2026 (pending per one search summary). Model-year caution: one source (Motor1) says hardware starts MY2029, BIS says MY2030; the script uses neither. Legally sensitive (US government rule, BYD): do not say "illegal". |
| 11 "Our fastest chargers top out around 400 kilowatts for most cars, and a Model Y can use only 250." | ✅ 250; 🟡 400 | Model Y 250 kW max: electrive 2025-09-30 ("the other electric car models will remain at a maximum charging power of 250 kW"); Notebookcheck. "Around 400 for most cars": InsideEVs (Rob Stumpf): owners "typically find themselves on the receiving end of a charger that delivers 250-400 kW today"; AFDC: "up to 500 kW" (the 500 kW Tesla V4 is for the Cybertruck only, so "for most cars" holds). The v1 optional hedge is now in the script. Legally sensitive (Tesla): ✅ via independent reports. |
| 12 "If your charging stops already take about half an hour, would BYD's five minutes change much?" | 🎭 | Conditional about the viewer, consistent with the 27-31 min tests. The hedges ("if", "would", "BYD's") keep it a question, not a claim. |

**Cut, so retired:** v1 claim 8 (grid: "a thousand homes", on-site batteries) and the tariff half of v1 claim 9 ("100 percent" is no longer in the script; the tariff conflict stays unresolved but is not needed).

### Post description 🎭 and caveats (v2)

- "Illustrative: the road trip and the side-by-side charging scene are a dramatization. Charging figures are the makers' claims or published tests (see sources)." (line 3 "charging next to it", line 12 "your charging stops")
- "Illustrative: 'about half an hour' is a typical independent test of a Model Y, 10 to 80 percent, not a promise for every car or charger." (optional, line 3)
- "Gas comparison: a whole stop at the pump (pull in, pay, fill, leave) is about 3 to 6 minutes; pumping alone is 1 to 2 minutes at the federal 10-gallon-per-minute limit, assuming a 12 to 15 gallon fill." (line 1; keeps "stop at the gas pump" honest)
- "BYD's five minutes (10 to 70 percent) is BYD's claim; no independent test of the 1,500 kW version was found."

---

## Fact-check of script v1 (fact-checker, 2026-10-27)

Verdict: **PASS** (no ❌), with 5 required wording fixes (marked REQUIRED) that keep claims inside what the sources support. Opened directly this session: BYD gen 2 and gen 1 press pages, EVCS (BYD 1.5 MW; Tesla Model 3 earlier), CarNewsChina (Blade 2.0; liquid-cooled chargers), Evercars, InsideEVs (AMG GT), electrive (V4), Notebookcheck, ScienceDaily/Argonne, EIA, AFDC, 40 CFR 1090.1550 (Cornell LII), BIS press release. **Could not open:** tesla.com (403, also the en_pr page), the GasBuddy/Cuebiq PDF (binary, unreadable in the tool; saved copy has no extractable text).

### 1. "In China, some electric cars now claim to charge in about the time it takes to fill a gas tank." (hook)

- **Script:** line 1
- **Status:** 🟡 plausible. "In China", "some electric cars" and "claim" are ✅ (BYD gen 2 on 10 models, Zeekr, press release titled "…Matching Refueling Speeds"). "About the time it takes to fill a gas tank" is not confirmed as stated: the GasBuddy "2-3 minutes" figure is still snippet-only (I could not open the PDF). The fallback is solid: the federal pump cap is 10 gal/min (below), so a 12-15 gal fill is about 1.2-1.5 min of pumping (🧮, tank size assumed), and BYD's 5 minutes is about 2-4 times that.
- **Source:** [40 CFR § 1090.1550(b)](https://www.law.cornell.edu/cfr/text/40/1090.1550), Cornell LII (eCFR), current (accessed 2026-10-27)
- **Quote:** "The dispensing flow rate must not exceed a maximum value of 10 gallons per minute."
- **Note:** Line 2 pins the claim to "five minutes, from ten to seventy percent", which is what keeps line 1 honest. OPTIONAL fix, closer to the evidence: "…claim to charge in about the time of a stop at the gas pump." (the whole stop, with paying, is about 5 min; pumping alone is 1-3 min). The hook is the owner's approved wording, so this is the owner's call. 🎭 not needed.

### 2. "BYD says five minutes, from ten to seventy percent."

- **Script:** line 2
- **Status:** ✅ verified (as BYD's claim)
- **Source:** [BYD Unveils 2nd Generation Blade Battery and FLASH Charging Technology](https://www.byd.com/mea/news-list/BYD%20Unveils%202nd%20Generation%20Blade%20Battery%20and%20FLASH%20Charging%20Technology), BYD, 2026-03-05 (accessed 2026-10-27)
- **Quote:** "going from 10% to 70% State of Charge (SOC) in just 5 minutes" and "a world-leading single-connector output of 1500 kW."
- **Note:** Attributed ("BYD says"), correct. Independent test: searched again on 2026-10-27, **none found** for gen 2 (every report relays BYD's table or BYD's own video). The one outside look is gen 1, BYD-run (InsideEVs, B3). Legally sensitive (named company): fine, because it is attributed to BYD and the script never says it was tested.

### 3. "A Tesla Model Y beside it would take about half an hour from ten to eighty percent."

- **Script:** line 3
- **Status:** ✅ verified for "about half an hour"; 🎭 for "beside it"
- **Source:** [2026 Tesla Model Y RWD Charging Test](https://www.evercars.com/resources/tesla-model-y-rwd-charging-test), Evercars, 2026-05-27 (accessed 2026-10-27)
- **Quote:** "From 10% to 80%, the total time came out to 31 minutes and 14 seconds at an average of 116kW." Also InsideEVs (Rob Stumpf, "May 21", year not shown): "Real-world performance is around 27 minutes."
- **Note:** Two tests, 27 and 31 minutes: "about half an hour" holds. The Evercars run was a non-Tesla 400 kW charger on a preconditioned RWD car. Tesla's own number is not a 10-80% time and tesla.com could not be opened (403). The "beside it" side-by-side is a staged comparison of a test result and a company claim: **list in the post under "Illustrative"** (🎭). Legally sensitive (Tesla): independent tests, not Tesla's claim, so no overstatement.

### 4. "Power is voltage times current, and a Model Y runs on about 400 volts, so faster means more current."

- **Script:** line 4
- **Status:** ✅ for P = V × I; 🟡 for the Model Y's "about 400 volts" (secondary sources only)
- **Source:** [Electric Power](http://hyperphysics.gsu.edu/hbase/electric/elepow.html), HyperPhysics, Georgia State University, undated (accessed 2026-10-27)
- **Quote:** "P = VI" / "Power = Voltage x Current"
- **Source:** [Cybertruck and Model Y Juniper to charge 30% faster…](https://www.notebookcheck.net/Cybertruck-and-Model-Y-Juniper-to-charge-30-faster-as-Tesla-unveils-500-kW-V4-Supercharger-upgrade.918802.0.html), Notebookcheck, 2025 (accessed 2026-10-27)
- **Quote:** the Model 3 and Model Y "are still built on Tesla's aging 400V platform"; the Model Y "will still charge at 250 kW maximum speed."
- **Note:** No Tesla spec sheet found; Tesla's Q1 2022 call framed 3/Y as the lower-voltage platform (T4). "About 400 volts" with the word "about" is acceptable; for ✅ it would need a Tesla or standards document. The Cybertruck is Tesla's 800 V car (Green Car Reports), so say "a Model Y", as the script does. "Faster means more current" follows if voltage is fixed: correct, and "more current" is the point the script builds on.

### 5. "More current heats the cable and battery, like an extension cord warming under a space heater, so the Tesla slows the charge as it fills."

- **Script:** line 5
- **Status:** 🟡 plausible. REQUIRED wording fix.
- **Problem:** the sentence makes heat the reason the Tesla tapers. The sources do not say that. Heat from current in the cable (I²R) is ✅ (HyperPhysics; ABB patent EP 3 770 925: "Non-cooled charging cable are typically used for charging current up to 250 A"). But the taper "as it fills" is documented as a protection of the cell: Argonne (ScienceDaily) names lithium plating ("Plating is one of the main causes of impaired battery performance during fast charging") and the page does **not** mention heat at all. DOE's workshop summary lists "Li plating, rapid temperature rise, and possible particle cracking" with plating "thought to be the primary culprit" (snippet only, page 404). No source states that a Tesla's taper is triggered by cable heat.
- **Minimal accurate wording (REQUIRED):** "More current heats the cable and battery, like an extension cord warming under a space heater, and as the battery fills the Tesla slows the charge to protect it." (cause of the slow-down is the battery's protection, not "so" heat.)
- **Source:** [Another reason why batteries can't charge in minutes](https://www.sciencedaily.com/releases/2021/12/211202153918.htm), DOE/Argonne via ScienceDaily, 2021-12-03 (accessed 2026-10-27)
- **Quote:** "Plating is one of the main causes of impaired battery performance during fast charging," said Argonne battery scientist Daniel Abraham.
- **Note:** The taper itself is ✅ measured (BYD demo 1,002 → 463 kW; Evercars Model Y 221 → 42 kW at 80%). The textbook reason (constant current, then constant voltage near full) has **no lab or university source found** (only vendor pages, patents, forums); keep "to protect it" and do not state the mechanism in voice. The extension-cord image is an analogy, not a claim, and needs no source.

### 6. "At about a thousand volts, the BYD gets the same power from less than half the current."

- **Script:** line 6
- **Status:** ✅ verified (BYD's figure, plus arithmetic)
- **Source:** BYD gen 1 press page (B1): "The charging current reaches 1000A" with 1,000 kW; EVCS (B2): "The maximum voltage remains at 1,000 volts." TechCrunch (B1 note) reports the real system voltage as "945 volts".
- **Note:** At equal power, I = P/V, so 400 V → 1,000 V cuts current to 400/1000 = 40 percent ("less than half" is correct; even 945 V gives 42 percent). The wording "same power" is a hypothetical (a Model Y peaks at 250 kW), which the sentence's logic makes clear. 🧮.

### 7. "BYD still pulls up to fifteen hundred amps, through a liquid-cooled cable into cells it says were built for it."

- **Script:** line 7
- **Status:** 🟡 plausible. OPTIONAL fix ("BYD says" wording for the cable or amps).
- **Amps:** EVCS (Mark Kane, 2026-03-06): "maximum current is 1,500 amps, compared to 1,000 amps previously" and "The maximum voltage remains at 1,000 volts." EVCS also says it "assume[s] the new version has a significantly upgraded charging connector capable of 1,500 amps, though there is little to no information on that." BYD's own gen 2 page gives 1,500 **kW** but no amps; the 1,500 A follows from 1,500 kW at 1,000 V (🧮). A CarNewsChina caption for gen 1 labels "(1000V + 1500A)" against its own 1000A spec (inconsistent). "Up to" is the right hedge.
- **Liquid-cooled cable:** sourced for **gen 1**: CarNewsChina, 2026-02-24, "both the charging gun cables and the terminal itself incorporate liquid cooling technology"; BYD gen 1 page: "the world's first all-liquid-cooled Megawatt Flash Charging terminal system" (terminal, not stated for the cable). For the **gen 2 1,500 kW connector**, cable cooling is **inferred only** (EVCS says nothing about cooling). Physics supports it (above about 250 A, uncooled cables are too heavy, ABB patent; Purdue 2021: most advanced chargers "rely on liquid cooling").
- **Cells "it says were built for it":** BYD's pages: "reducing the battery's internal resistance by 50%" (gen 1) and a "Lithium-Ion High-Speed Channel" with "Full-Spectrum Intelligent Thermal Management System" (gen 2). Attributed by "it says": ✅.
- **Source:** [BYD flash charging 1.5 MW](https://evchargingstations.com/chargingnews/byd-flash-charging-1-5-mw/), Mark Kane, EVCS, 2026-03-06 (accessed 2026-10-27)
- **Note:** To reach ✅ for the whole line, attribute amps and cooling to BYD or soften: "BYD still pulls up to fifteen hundred amps through a liquid-cooled cable…" is acceptable only because the 1,000 A gen 1 cable is documented as liquid-cooled; a safer line is "BYD says its chargers push up to fifteen hundred amps, through cables built to carry it, into cells…". Legally sensitive (BYD): not defamatory, no safety claim.

### 8. "Each charger draws about what a thousand American homes use on average, so many stations keep their own battery."

- **Script:** line 8
- **Status:** ✅ for the homes figure (🧮); 🟡 for "many stations keep their own battery" (BYD's plan, not an audited count)
- **Source:** [How much electricity does an American home use?](https://www.eia.gov/tools/faqs/faq.php?id=97&t=3), EIA, last updated 2024-01-08 (accessed 2026-10-27)
- **Quote:** "10,791 kilowatthours (kWh)" in 2022, the average annual use of a US residential customer.
- **Note:** 10,791 kWh ÷ 8,760 h = 1.23 kW average per home. 1,000 kW ≈ 810 homes; 1,500 kW ≈ 1,220 homes. "About a thousand" sits between BYD's two generations: correct if the sentence stays "on average". Peak home draw is higher; do not drop "on average".
- **Source:** [BYD unveils Blade Battery 2.0](https://carnewschina.com/2026/03/05/byd-unveils-blade-battery-2-0/), Liu Miao, CarNewsChina, 2026-03-05 (accessed 2026-10-27)
- **Quote:** "BYD's solution involves energy storage batteries." CEO Wang Chuanfu: "such high-power charging speeds would inevitably strain the power grid." Target: "20,000 flash charging stations this year, including 18,000" station-within-a-station sites. BYD's page: "Paired with a high-capacity energy storage system".
- **Note:** Storage is BYD's stated design, so "many stations keep their own battery" is true as BYD's approach, but I found no audit of how many built stations have one, and the "station-within-a-station" sites recharge storage from nearby public chargers. REQUIRED wording for ✅: "BYD says many stations keep their own battery" (or "…so BYD pairs many stations with a battery"). "Draws" is the peak, which is the point of the sentence.

### 9. "US drivers can't buy these cars, which face a 100 percent tariff and a ban on their software."

- **Script:** line 9
- **Status:** 🟡 plausible. REQUIRED wording check before publish.
- **Tariff, enacted:** ✅. [White House fact sheet](https://bidenwhitehouse.archives.gov/briefing-room/statements-releases/2024/05/14/fact-sheet-president-biden-takes-action-to-protect-american-workers-and-businesses-from-chinas-unfair-trade-practices/), 2024-05-14: "The tariff rate on electric vehicles under Section 301 will increase from 25% to 100% in 2024." In effect from 2024-09-27.
- **Tariff, still in force on 2026-10-27:** **not verified from a primary source.** 2026 guides list EVs at 100% (htsbase.com: "Electric vehicles … 100% … September 27, 2024"; hsrates.com; airliftusa.com, status 2026-09-23). One page (customsgenius.com) claims the code 9903.91.03 "expired on February 1, 2026"; htsbase and others show no such expiry, and htsbase says a second four-year review began 2026-05-06 with the 2018 actions "subject to changes from the review". I could not open USTR/CBP/Federal Register notices. Treat the conflict as unresolved. The Supreme Court ruling of 2026-02-20 concerned IEEPA tariffs, not Section 301.
- **Software rule:** ✅. [BIS press release](https://www.bis.gov/press-release/commerce-finalizes-rule-secure-connected-vehicle-supply-chains-foreign-adversary-threats), US Department of Commerce, 2025-01-14 (accessed 2026-10-27). Quote: "The software-related prohibitions will take effect for Model Year 2027." and the rule bars manufacturers tied to China or Russia from selling new connected vehicles in the US "even if the vehicles were built domestically". It "applies only to passenger vehicles (defined as those under 10,001 pounds)". Hardware prohibitions from Model Year 2030. No 2026 change found (searches returned no 2026 source on the rule).
- **"Can't buy":** BYD does not sell passenger cars in the US (secondary, 🟡). The tariff and the rule are not a ban on owning one.
- **Minimal wording (REQUIRED if the tariff cannot be confirmed in the Federal Register or HTSUS before publish):** "US drivers can't buy these cars, which face a 100 percent tariff and a ban on their connected-car software." Or, hedged for date: "…which face a 100 percent tariff, set in 2024, and a ban on their software." Do not give a combined rate. Legally sensitive (BYD, US government rules): the rule is a ban on selling vehicles with China-linked connected software, accurate as "a ban on their software"; do not say "illegal".

### 10. "And the fastest US chargers top out around 400 kilowatts for most cars, still more than a Model Y can use."

- **Script:** line 10
- **Status:** 🟡 plausible. OPTIONAL fix.
- **Source:** [Electric Vehicle Charging Stations](https://afdc.energy.gov/fuels/electricity-stations), US DOE AFDC, undated (accessed 2026-10-27)
- **Quote:** "A DC charging unit can provide up to 500 kW." / "many EVs on the roads today are not capable of charging at rates higher than 200 kW."
- **Source:** [11 Minutes To 80%…](https://insideevs.com/news/796468/mercedes-amg-gt-fast-charging/), Rob Stumpf, InsideEVs ("May 21", year not shown) (accessed 2026-10-27)
- **Quote:** "EV owners typically find themselves on the receiving end of a charger that delivers 250-400 kW today." 600 kW chargers "barely exist outside of semi-truck chargers today."
- **Note:** Tesla V4 stalls reach 500 kW but only for the Cybertruck; the Model Y stays at 250 kW (electrive, 2025-09-30: "the other electric car models will remain at a maximum charging power of 250 kW"). So "top out around 400 kW for most cars" is supported, and 400 > 250 kW (Model Y) is ✅. Because "fastest" strictly includes 500 kW, the exact-safe wording is OPTIONAL: "the fastest US chargers for most cars top out around 400 kilowatts" or "…deliver up to 500 kilowatts, and a Model Y can use only 250 of it." The comparison to the Model Y uses Tesla's 250 kW limit (✅ electrive, Notebookcheck).

### 11. "If your road-trip stops already take half an hour, would five minutes change anything?"

- **Script:** line 11
- **Status:** 🎭 illustrative (question). Rests on lines 2 and 3.
- **Note:** "Road-trip stops already take half an hour" is an assumption about the viewer (consistent with the 27-31 minute tests). Include the 🎭 line in the post. BYD's five minutes is a claim to 70 percent; keep "claims" framing in the post.

### Items the researcher asked about (open items), resolved or not

| Open item | Result |
|---|---|
| Tesla "miles in 15 minutes" on tesla.com | **Not opened** (403 on tesla.com/modely and /en_pr/modely). Search summary of the page: "up to 182 miles" in 15 minutes for the US Model Y Premium at 250 kW, based on a constant 65 mph, "may vary" (snippet only, 🟡). The script does not use this figure, so it is not blocking. |
| GasBuddy "2-3 minute" fill-up | **Unconfirmed** (PDF has no extractable text in the tool). A second search found no GasBuddy figure. Fall back to the 10 gal/min federal cap (✅ 40 CFR 1090.1550(b)) plus arithmetic (🧮, tank size assumed). The script line 1 is OK with that fallback (🟡). |
| Lab or university source for the taper near full | **Not found.** Only vendor, patent and forum pages. Keep "protect the battery". Line 5 fix is REQUIRED. |
| Independent test of BYD gen 2 (1,500 kW, 10 to 70% in 5 min) | **None found** as of 2026-10-27. A French outlet cites BYD's own video. The script attributes it to BYD: OK. |
| Latest BYD station count | 12,165 flash chargers in China (CarNewsChina, 2026-10-13); no newer figure found. The script uses no count. |
| 2026 change to tariff or connected-vehicle rule | No change to the BIS rule found. Tariff: unresolved conflict (see claim 9). |

### Post description (🎭 and caveats to include)

- "Illustrative: the road trip and the side-by-side charging scene are a dramatization. Charging figures are the makers' claims or published tests (see sources)."
- If the gas comparison appears anywhere beyond line 1: "Gas comparison assumes a 15-gallon fill at the federal 10-gallon-per-minute pump limit."
- Range and charging times are a mix of a BYD claim (10 to 70 percent), independent Tesla tests (27 to 31 minutes, 10 to 80 percent) and a BYD-run demo of the first-generation system.

---

## Key facts in one screen

1. **BYD's claim, gen 1 (2025-03-17):** a 1,000 V, 1,000 A, **1,000 kW** "Super e-Platform", with "5 minutes of charging for 400 kilometers of range" [≈ 250 mi CLTC]. It launched on the Han L and Tang L. ✅ as a claim.
2. **BYD's claim, gen 2 (2026-03-05):** Blade Battery 2.0 plus **1,500 kW** per connector, **10→70% in 5 minutes** and to 97% in about 9 minutes, on 10 models. ✅ as a claim. I found **no independent test of gen 2**.
3. **The only outside look at gen 1 (InsideEVs, 2025-05-07):** a Han L showed 1,002 kW "almost immediately", then tapered to 767 → 633 → 463 kW. It went from **13% to 60.1% in "a little under five minutes"**. BYD staff ran the demo. ✅ (tool).
4. **Stations:** BYD runs **12,165 flash chargers in China** (CarNewsChina, 2026-10-13) and targets 20,000 by the end of 2026. Many stations carry an on-site **storage battery** so they don't overload the grid. 🟡: reports mix up "stations" and "chargers".
5. **Tesla:** Model 3/Y peak at **250 kW** on Superchargers. Tesla's own figure is "up to" **162–195 miles in 15 minutes** depending on trim (2026 Model 3, via EVCS). A real 10→80% takes about **25–31 min** (tests). Model 3/Y are **400 V**. The Cybertruck is Tesla's only **800 V** car, and V4 cabinets give it **up to 500 kW**. 🟡/✅
6. **The physics:** **P = V × I**. 1,000 kW at 1,000 V = **1,000 A**. The same power at 400 V would need **2,500 A**, which means **6.25×** the cable heat (heat ∝ I²). Plain cables top out around **250 A**, and above that they're liquid-cooled (ABB patent). 🧮 + ✅
7. **Why charging slows:** the big limit is **lithium plating** (ions pile up on the anode surface instead of soaking in). Cold makes it worse. INL measured cold fast-charging as up to **about 3× slower**. ✅
8. **US situation:** a **100% tariff** on Chinese EVs (Section 301, from 2024) and Commerce's **connected-vehicle rule**, which bans Chinese-linked software from MY2027 and hardware from MY2030, even for cars built in the US. BYD sells no cars in the US. The fastest US public chargers are about **350–400 kW** for most cars (Tesla V4 500 kW for the Cybertruck). The quickest US-market claim I found is the Mercedes-AMG GT 4-Door: **10→80% in 11 min on a 600 kW charger** (claim, and such chargers barely exist). ✅
9. **Grid:** an average US home uses **10,791 kWh a year** (EIA, 2022 data) [≈ 1.23 kW average]. One 1,000 kW charger [≈ the average draw of **about 800 homes**]. One 1,500 kW connector [≈ **about 1,200 homes**]. 🧮
10. **The gas-tank comparison:** a US pump is capped at **10 gal/min** (federal rule). Filling a tank takes "two to three minutes" (GasBuddy/Cuebiq foot-traffic data, snippet). BYD's "5 minutes to 70%" is **close to but slower than** a fill-up, and it doesn't fill the "tank". The hook needs its hedge (H1).

---

## H. The hook: "In China, some electric cars now claim to charge in about the time it takes to fill a gas tank."

### H1. Verdict on each word

| Word | Evidence | Status |
|---|---|---|
| "In China" | BYD gen 1 and gen 2 launched in Shenzhen. The network is in China, with a first German station from May 2026 (B6) | ✅ |
| "some electric cars" | BYD: 10 models with Blade 2.0 (B2). Zeekr 001 (2026 MY) claims 10→80% in 7 min (Z2). CATL's battery claim is for a battery, not a car (Z3). "Some" is accurate | ✅ |
| "claim" | Correct and necessary. Gen 2 has no independent test. Gen 1 was tested once, with BYD running the demo (B3) | ✅ |
| "charge" | BYD's claim is **10→70%** in 5 min, not empty to full. To 97% takes about 9 min | 🟡: "charge" alone implies full |
| "about the time it takes to fill a gas tank" | BYD frames it the same way ("Matching Refueling Speeds", B1). A fill-up is "two to three minutes" (G2, snippet). Pumping 15 gal at the 10 gpm cap takes at least 1.5 min (🧮 P6). **5 min is about 2× a typical fill**, but it's in the same ballpark and close to a whole stop | 🟡 |

**Closest accurate wordings (pick one):**

- **A (keeps the owner's hook almost word for word):** "In China, some electric cars now claim to charge in about the time it takes to fill a gas tank." Keep it only if the **next line** pins the number: "BYD says five minutes, from ten to seventy percent." That makes the claim honest.
- **B (safer):** "In China, some electric cars now claim to charge in about five minutes. That's close to a stop at the gas pump."
- **C (attributed):** "BYD says its cars now charge almost as fast as you'd fill a gas tank."

Don't say "a full charge in five minutes", "faster than gas", or "400 miles in five minutes".

### H2. A typical US fill-up and the pump's flow cap

- **G1. Federal flow cap.** ✅ (tool)
  - **Source:** [40 CFR § 1090.1550, Requirements for gasoline dispensing nozzles used with motor vehicles](https://www.law.cornell.edu/cfr/text/40/1090.1550), Cornell LII (eCFR), current (accessed 2026-10-27)
  - **Quote (tool):** "The dispensing flow rate must not exceed a maximum value of 10 gallons per minute." It applies to "any nozzle installation used for dispensing gasoline into motor vehicles".
  - **Note:** The rule was first set at 40 CFR 80.22(j), effective 1996-07-01 ([61 FR, 1996-06-26](https://www.govinfo.gov/content/pkg/FR-1996-06-26/html/96-16205.htm), snippet). Many pumps run slower than the cap. 8–10 gpm is typical per a weak explainer (engineerfix.com, snippet, ❌ for the script).
- **G2. Fill-up time: "two to three minutes".** 🟡 (snippet only, every page 403 or unparsed PDF)
  - **Source:** [Foot Traffic Report Q1 2017](https://www.iab.com/wp-content/uploads/2015/10/FootTrafficReportQ1-17_CuebiqGasBuddy.pdf), Cuebiq & GasBuddy (hosted by IAB), 2017 (accessed 2026-10-27; PDF not parsed)
  - **Quote (snippet):** "an efficient 2-3 minutes". CSP Daily News's write-ups of the same data, snippet: "it takes an average of two to three minutes to fill a gas tank" and "the time it takes to fill a tank of gas".
  - **Note:** The data is 2017–2019 and was measured as location dwell time. **Fact-checker:** open the PDF in a viewer and search for "2-3 minutes". If it can't be confirmed, use G1 plus 🧮 P6 instead ("a gas pump moves about ten gallons a minute").

---

## B. BYD

### B1. Gen 1 "Super e-Platform": 1,000 V / 1,000 A / 1,000 kW, "400 km in 5 minutes" (claim)

- **Status:** ✅ (tool) as BYD's claim.
- **Source:** [BYD Unveils Super e-Platform with Megawatt Flash Charging for Electric Vehicles, Matching Refueling Speeds](https://www.byd.com/mea/news-list/byd-unveils-super-e-platform-with-megawatt-flash-charging.html), BYD, 2025-03-18 (event 2025-03-17) (accessed 2026-10-27)
- **Quote (tool):** "On March 17, 2025, BYD launched the Super e-Platform." / "achieving a charging power of 1 megawatt (1000 kW)" / "The charging current reaches 1000A, and the charging rate achieves 10C." / "5 minutes of charging for 400 kilometers of range" / "It will first be available on the Han L and Tang L." / "reducing the battery's internal resistance by 50%" / "In the future, we plan to build over 4,000 'Megawatt Flash Charging stations' in China." / the terminal has "a maximum output capacity of up to 1360kW."
- **Note:** 400 km is **CLTC** range [≈ 250 mi CLTC ≈ about 185 mi on an EPA-like basis, using C3's ~35%]. The Han L battery is 83.2 kWh LFP, 701/601 km CLTC, "Built on BYD's 1,000-volt high-voltage electrical platform", priced from "RMB 219,800 ($29,910)" ([CnEVPost, Phate Zhang, 2025-04-09](https://cnevpost.com/2025/04/09/byd-launches-han-l-tang-l/), tool). The same article: Han L "can charge from 10 percent to 70 percent in just six minutes". TechCrunch reports the real system voltage as "945 volts" ([Tim De Chant, 2025-03-21](https://techcrunch.com/2025/03/21/how-byd-plans-to-make-ev-charging-as-fast-as-filling-a-gas-tank), tool). Say "about a thousand volts".

### B2. Gen 2 "Blade Battery 2.0 + FLASH Charging": 1,500 kW, 10→70% in 5 min, 10→97% in about 9 min (claim)

- **Status:** ✅ (tool) as BYD's claim. ❌ as "tested".
- **Source:** [BYD Unveils 2nd Generation Blade Battery and FLASH Charging Technology](https://www.byd.com/mea/news-list/BYD%20Unveils%202nd%20Generation%20Blade%20Battery%20and%20FLASH%20Charging%20Technology), BYD, 2026-03-05 (posted 2026-03-06) (accessed 2026-10-27)
- **Quote (tool):** "going from 10% to 70% State of Charge (SOC) in just 5 minutes" / "meanwhile reaching 97% in only 9 minutes" / "world-leading single-connector output of 1500 kW" / "Even in extreme low temperatures, such as -30°C, the charging duration from 20% to 97% increases by merely 3 minutes compared to room temperature." / "Paired with a high-capacity energy storage system" / "20,000 FLASH Charging Stations across China"
- **Source:** [BYD unveils 2nd-gen blade battery, shattering charging speed records](https://cnevpost.com/2026/03/05/byd-unveils-2nd-gen-blade-battery/), Phate Zhang, CnEVPost, 2026-03-05 (accessed 2026-10-27)
- **Quote (tool):** "just nine minutes from 10% to 97%." / "The remaining 3% capacity is reserved for regenerative braking." / "Ten BYD models will be the first to feature the battery." / "Vehicles equipped with the new battery can utilize roughly 4.8 million existing public charging piles."
- **Source:** [BYD unveils Blade Battery 2.0: 10-70% in 5 mins, 10-97% in 9 mins…](https://carnewschina.com/2026/03/05/byd-unveils-blade-battery-2-0/), Liu Miao, CarNewsChina, 2026-03-05 (accessed 2026-10-27)
- **Quote (tool):** each gun has a "maximum output of 1500 kW" at 1000V. The 10–97% table runs "8m 45s to 9m 23s" by model.
- **Note:** [EVCS (Mark Kane, 2026-03-06)](https://evchargingstations.com/chargingnews/byd-flash-charging-1-5-mw/), tool: current "up to 1,500 A", voltage "up to 1,000 V", 10→70% = "7.2C average". Cold: 20→97% in 12 min at "−30°C / -22°F extreme cold for 24h". Models: Denza N9, Denza Z9GT, Fang Cheng Bao 3, Ti7, Great Tang, Seal 07, Sealion 06, Song Ultra, Yangwang U7, Yangwang U8L. The EVCS table has small internal inconsistencies (Seal 07 4:51 vs 5:01). Still LFP chemistry (search summary, 🟡).

### B3. The one outside look: InsideEVs at a BYD-run gen 1 demo

- **Status:** ✅ (tool) for what the reporter saw. 🟡 as "independent": BYD staff ran it.
- **Source:** [BYD's 5-Minute EV Fast Charging: We Tried It. It's A Game-Changer](https://insideevs.com/news/758625/byd-megawatt-charging-demo-china/), Patrick George, InsideEVs, 2025-05-07 (accessed 2026-10-27)
- **Quote (tool):** "The Han L sedan used in the test started at 13%." / "leaped to that speed almost immediately" / "quickly tapered off to about 767 kW" / "held steady at 633 kW" / "In a little under five minutes, the BYD folks called it: 60.10%, while still maintaining a charge speed of 463 kW." / "BYD's staff plugged the car in" / "Where it would've gone after that, I do not know."
- **Note:** The article converts the added range to "262 miles (421 km)". That is the car's **CLTC-based** estimate, not EPA miles. 🧮 P3: about 39 kWh in about 5 min ≈ **480 kW average**, half the 1,000 kW headline. **Even BYD's own charge tapers**, which is a great visual (the 1,002 kW spike, then the slide).
- **Weak leads (❌ for the script):** a viral clip with a "746 kW" peak (search summary only). An Alibaba buying guide's "650–750 kW average" has no source.

### B4. Station count

- **Status:** 🟡. The numbers are solid, but "stations" vs "chargers" varies by outlet.
- **Source:** [BYD to deploy 100 flash chargers in Europe by the end of 2026](https://carnewschina.com/2026/10/13/byd-to-deploy-100-flash-chargers-in-europe-by-the-end-of-2026/), Denis Bobylev, CarNewsChina, 2026-10-13 (accessed 2026-10-27)
- **Quote (tool):** "The Shenzhen-headquartered automaker currently operates 12,165 flash chargers across China." / "BYD will deploy 100 flash chargers in Europe by the end of 2026." / "a target of 3,000 flash chargers in Europe by the end of 2027"
- **Source:** [BYD's flash charging network reaches 10,000 stations](https://cnevpost.com/2026/08/28/byd-flash-charging-10000-stations/), Lei Kang, CnEVPost, 2026-08-28 (accessed 2026-10-27)
- **Quote (tool):** "has opened its 10,000th flash charging station in China in Shenzhen" / "The network is open to electric vehicles from other brands." / the 5,000th opened on April 1.
- **Source:** [BYD Hits 2,000 Highway Megawatt Flash-Charging Stations Ahead of Annual Target](https://chinaevhome.com/2026/09/24/byd-hits-2000-highway-megawatt-flash-charging-stations-ahead-of-annual-target/), Jame, China EV Home, 2026-09-24 (accessed 2026-10-27)
- **Quote (tool):** "deployed 11,586 Megawatt Flash-Charging stations nationwide" (as of Sept. 24) / "completed its 2,000th Megawatt Flash-Charging highway station"
- **Note:** Script-safe line: "BYD says it has built more than ten thousand of these chargers in China." Pace: 4,239 by early March 2026 (CarNewsChina, B2), 5,000 on 2026-04-01, 10,000 on about 2026-08-27, 12,165 by 2026-10-13. The 20,000 target by year-end looks hard at that pace (my inference).

### B5. On-site storage batteries ("buffer batteries")

- **Status:** ✅ (tool) that stations use storage. 🟡 for the sizes.
- **Source:** CarNewsChina, Liu Miao, 2026-03-05 (B2)
- **Quote (tool, paraphrase by the tool):** "Flash charging stations use energy storage batteries to avoid overloading the grid." They are built in a "station-within-a-station" model, recharging their storage from an existing public fast-charging station. CEO Wang Chuanfu said such charging "would inevitably strain the power grid". The target includes "18,000 station-within-a-station sites".
- **Source:** [Megawatt ultra-fast charging: impressive in theory, challenging in practice for EV owners](https://carnewschina.com/2025/04/09/megawatt-ultra-fast-charging-impressive-in-theory-challenging-in-practice-for-ev-owners/), Liu Miao, CarNewsChina, 2025-04-09 (accessed 2026-10-27)
- **Quote (tool):** "Their flash charging stations will have 1.5 MWh energy storage systems for off-peak electricity usage." / "once the stored energy is depleted, subsequent vehicles will not be able to benefit from the same ultra-fast charging speeds." / 1 MW "requires a sustained 1000V and 1000A, conditions that are often difficult to maintain consistently" / liquid-cooled chargers "can cost anywhere from 80,000 to 120,000 yuan (11,200 to 16,800 USD) per unit".
- **Note:** The gen 2 storage size isn't confirmed. A leak report says storage "doubled… more than 20 vehicles" ([CarNewsChina, 2026-02-02](https://carnewschina.com/2026/02/02/byds-next-gen-megawatt-charger-leaks-1500-kw-power-1500-a-current/), snippet, unconfirmed). Gen 1's 1.5 MWh appears in one outlet only.

### B6. Outside China

- **Status:** ✅ (tool).
- **Source:** [BYD deploys first 1,500 kW German flash charging station in 3,000-site European push](https://carnewschina.com/2026/06/09/byd-deploys-first-1500-kw-german-flash-charging-station-in-3000-site-european-push/), Adrian Leung, CarNewsChina, 2026-06-09 (accessed 2026-10-27)
- **Quote (tool):** "up to 1,500 kW". The station entered operation in May 2026.
- **Note:** Not in the US. The first BYD-badged flash-charging model for Europe, the Atto 8, is due in Q1 2027 (B4 source).

---

## Z. Other Chinese claims (the strongest two, plus one lead)

### Z1. Zeekr 7X: the strongest independent test of a Chinese fast-charging car

- **Status:** ✅ (tool). Tested by an outsider.
- **Source:** [Watch The World's Fastest-Charging EV Hit 80% In 9 Minutes](https://insideevs.com/news/749125/worlds-fastest-charging-ev-zeekr-7x/), Suvrat Kothari, InsideEVs, 2025-01-30 (accessed 2026-10-27)
- **Quote (tool):** "Kyle Conner, also the host of the YouTube channel Out Of Spec Reviews" / "10-80% in about 9 minutes and 45 seconds" / "a 75-kilowatt-hour lithium-iron-phosphate (LFP) battery" / "hit a peak of 460 kW" / "a Zeekr-owned charging station rated for a whopping 840 kilowatts" / "0-100% in just over 22 minutes"
- **Note:** Useful contrast: **an independent test hit 10→80% in under 10 minutes**, about 2.5–3× faster than a Model Y. It's a real number to set against the 5-minute claims.

### Z2. Zeekr 1.2 MW chargers and the 2026 Zeekr 001 (claims)

- **Status:** 🟡 (claims).
- **Source:** [Chinese EV charges as fast as an ICE takes to refuel](https://www.carscoops.com/2025/10/chinese-ev-charges-as-fast-as-an-ice-takes-to-refuel/), Brad Anderson, Carscoops, 2025-10-08 (accessed 2026-10-27)
- **Quote (tool):** "Zeekr claims the new and improved 001 supports charging speeds of up to 1,140 kW." / "Zeekr's updated 001 can charge from 10-80 percent in a mere 7 minutes." / "new 900-volt electric architecture" / "don't rush to take a stopwatch to verify it"
- **Note:** The 1.2 MW charger was announced in March 2025 at the China EV100 Forum (paultan.org, The Driven, snippet). It's another "some cars" example. Zeekr and BYD are both Chinese brands.

### Z3. CATL third-generation Shenxing battery: 10→80% in 3 min 44 s (battery-maker claim)

- **Status:** 🟡 (claim, relayed by press). The CATL release page was too long to read the specs.
- **Source:** [CATL unveils 3rd-gen Shenxing LFP battery, charging 10-80% in 3 min 44 seconds](https://carnewschina.com/2026/04/21/catl-unveils-3rd-gen-shenxing-lfp-battery-charging-10-80-in-3-min-44-seconds/), CarNewsChina, 2026-04-21 (search summary, not opened)
- **Quote (snippet):** 10–80% "3 minutes 44 seconds", 10–98% "6 minutes 27 seconds", 10–98% in "9 minutes" at -30 °C. CATL claims 0.25 mΩ internal resistance and >90% SOH after 1,000 ultra-fast cycles.
- **Source (release record):** [CATL Unveils Six Major Innovations](https://www.aap.com.au/aapreleases/cision20260421ae39812/), CATL via PR Newswire/AAP, 2026-04-22 (accessed 2026-10-27)
- **Quote (tool):** "CATL today hosted its Super Technology Day in Beijing, unveiling third-generation Shenxing Superfast Charging Battery."
- **Note:** It's a battery, not a car on sale. Don't use it in the hook. Li Auto, XPeng and Huawei claims were not researched in depth: BYD + Zeekr cover the story.

---

## T. Tesla

### T1. Model 3/Y: 250 kW peak, and Tesla's "miles in 15 minutes"

- **Status:** 🟡 (Tesla figures via a secondary site; tesla.com 403).
- **Source:** [2026 Tesla Model 3: all versions compared](https://evchargingstations.com/chargingnews/2026-tesla-model-3-all-versions-compared/), Mark Kane, EVCS, 2026-02-09 (updated 2026-10-20) (accessed 2026-10-27)
- **Quote (tool):** "Tesla provides a maximum amount of range that can be replenished within 15 minutes of charging." Table: RWD up to 170 mi, Premium RWD up to 195, Premium AWD up to 185, Performance up to 162. Peak DC up to 225 kW (RWD) or 250 kW (others). "Tesla does not report battery capacity for its vehicles."
- **Note:** Search summaries of tesla.com/modely show "up to 169 or 182 miles" in 15 min, with a footnote based on driving at a constant 65 mph and "may vary" with Supercharger type, state of charge, battery temperature and weather (snippet). **Fact-checker:** open tesla.com in a browser. Script-safe: "Tesla says up to about 170 to 195 miles in 15 minutes." [That's ≈ 11–13 mi per minute, Tesla's best case.]

### T2. Real 10→80% sessions for a Model Y

- **Status:** 🟡 (several tests disagree; the range is safe).
- **Source:** [2026 Tesla Model Y RWD Charging Test: Peak Power Isn't Everything](https://www.evercars.com/resources/tesla-model-y-rwd-charging-test), Evercars, 2026-05-27 (accessed 2026-10-27)
- **Quote (tool):** "We preconditioned the battery before our session" / "arrived at a 400kW Alpitronic unit" / "the Model Y pulled 221kW" / "the total time came out to 31 minutes and 14 seconds" / "at an average of 116kW" / "down to just 42kW at the finish line"
- **Source:** [11 Minutes To 80%: There's A New Quickest-Charging EV In America](https://insideevs.com/news/796468/mercedes-amg-gt-fast-charging/), Rob Stumpf, InsideEVs, "May 21" (the page shows no year; the context, V4 at 500 kW and the Volvo EX60, implies 2026) (accessed 2026-10-27)
- **Quote (tool):** Tesla Model Y "about 27 minutes", described as "real-world performance".
- **Note:** Not a Supercharger in the Evercars case (non-Tesla 400 kW unit). Script-safe: "**about half an hour** from 10 to 80 percent", or "**25 to 30 minutes**". Peak 221–250 kW, average about 116 kW: **the taper halves the average**.

### T3. V4 Superchargers: 500 kW, but only for 800 V cars (the Cybertruck)

- **Status:** ✅ (tool).
- **Source:** [Tesla commissions 500 kW V4 Superchargers](https://www.electrive.com/2025/09/30/tesla-commissions-500-kw-v4-superchargers), Chris Randall, electrive, 2025-09-30 (accessed 2026-10-27)
- **Quote (tool):** "up to 500 kW for the Cybertruck" / "up to 1.2 MW for the Semi electric truck" / "the other electric car models will remain at a maximum charging power of 250 kW at the new location." Location: Redwood City, California.
- **Source:** [Tesla to solely build V4 power units in the US as V3 production phased out](https://www.electrive.com/2026/03/17/tesla-to-solely-build-v4-power-units-in-the-us-as-v3-production-phased-out), Cora Werwitzke, electrive, 2026-03-17 (accessed 2026-10-27)
- **Quote (tool):** "charging power of up to 500 kW at V4 stalls" / "the Cybertruck and 800-volt electric vehicles from other manufacturers" / "Production of V3 power cabinets has been discontinued after more than seven years and 15,000 units"
- **Source:** [Tesla V4 Supercharger Adds 40% Battery Range In 10 Minutes](https://insideevs.com/news/697139/tesla-v4-supercharger-atlanta-georgia/), Suvrat Kothari, InsideEVs, 2023-11-20 (accessed 2026-10-27)
- **Quote (tool):** the V4 post sticker "states a rating of 1,000 volts and 615 amps" / the cable is "measuring 10 feet in length" / with a Model 3 it "pumped out 255 kW".

### T4. 400 V vs 800 V at Tesla

- **Status:** ✅ (tool).
- **Source:** [Tesla Considering 800-Volt Architecture For Cybertruck And Semi](https://insideevs.com/news/581272/tesla-considering-800-volt-architecture-cybertruck-semi/), Dan Mihalascu, InsideEVs, 2022-04-21 (accessed 2026-10-27)
- **Quote (tool, Drew Baglino on Tesla's Q1 2022 call):** "For the smaller platform vehicles like 3 and Y, there's some wins and losses with 800 volts." / "But for the 3/Y platform where we've got everything running, the benefit is questionably small." / "On bigger vehicles... the current requirements go up."
- **Source:** [Tesla V4 Supercharger locations now output up to 325 kW](https://www.greencarreports.com/news/1145628_tesla-v4-supercharger-locations-now-output-up-to-325-kw), Stephen Edelstein, Green Car Reports, 2025-01-30 (accessed 2026-10-27)
- **Quote (tool):** "The Cybertruck is the only vehicle in the automaker's lineup that currently boasts 800-volt charging."
- **Note:** "Model 3/Y are 400 V" is Baglino's framing (3/Y on the lower-voltage platform). A spec-sheet figure wasn't found. Script-safe: "Most Teslas run on about 400 volts."

### T5. 800 V alone didn't make the Cybertruck fast (myth-buster)

- **Status:** ✅ (tool), for March 2024 on a 250 kW charger.
- **Source:** [The Tesla Cybertruck Doesn't Charge Any Faster Than A Rivian](https://insideevs.com/reviews/711268/telsa-cybertruck-charging-speed/), Mack Hogan, InsideEVs, 2024-03-06 (accessed 2026-10-27)
- **Quote (tool):** "The Tesla Cybertruck is the first Tesla built on an 800-volt architecture." / "accepted 206 kW from the 250-kW charger for the first few minutes" / "The full 11-to-80% charge took exactly 45 minutes" / "it still charges roughly as quickly as a Rivian R1T or Ford F-150 Lightning."
- **Note:** That was before V4's 325/500 kW. The point stands: **voltage helps, but the battery decides.**

---

## W. Why charging slows (battery science)

### W1. Lithium plating is the main limit on fast charging

- **Status:** ✅ (tool).
- **Source:** [Another reason why batteries can't charge in minutes](https://www.sciencedaily.com/releases/2021/12/211202153918.htm), DOE/Argonne National Laboratory via ScienceDaily, 2021-12-03 (accessed 2026-10-27)
- **Quote (tool):** "Plating is one of the main causes of impaired battery performance during fast charging," said Argonne battery scientist Daniel Abraham. / "the lithium ions tend to aggregate on top of the anode's surface, resulting in a 'plating' effect"
- **Source (lead, DOE workshop summary):** energy.gov VTO pages (snippet; the page I tried returned 404): "There are numerous challenges that limit such extreme fast charging at the cell level, including Li plating, rapid temperature rise, and possible particle cracking. Of these, Li plating is thought to be the primary culprit."
- **Source (report record):** [Enabling Fast Charging: A Technology Gap Assessment](https://www.osti.gov/biblio/1416167), DOE EERE / INL, ANL, NREL, INL/EXT-17-41638, 2017-10-31 (accessed 2026-10-27; full text not parsed). The journal version (Ahmed et al., *J. Power Sources* 367, 2017) lists the need for "advanced models and methods to detect and prevent lithium plating" (snippet).
- **Plain language for the script:** "Push lithium in too fast and it piles up on the surface instead of soaking in. That's lithium plating, and it wears the battery out." ✅ for the meaning.

### W2. The taper: why the last 20–30% is slow

- **Status:** 🟡. The mechanism is textbook (constant current, then constant voltage near full), but I found **no national-lab or university page** that states it plainly. Industry pages only (recharged.com, cars24, ampcontrol, snippet).
- **Measured evidence (✅):** InsideEVs's BYD numbers (B3: 1,002 → 463 kW) and Evercars's Model Y (T2: 221 → 42 kW at 80%). AFDC: "Charging power varies by vehicle and battery state of charge." ([AFDC, Electric Vehicle Charging Stations](https://afdc.energy.gov/fuels/electricity-stations), DOE, undated, tool)
- **Script-safe:** "The fuller the battery, the more the car slows the charge to protect it." Show the curves, and attribute no single cause. Don't claim "most lithium cells top out at 4.2 V per cell" in voice (unsourced here).

### W3. Cold makes fast charging slower; preconditioning helps

- **Status:** ✅ (tool) for INL. 🟡 for Recurrent (company data).
- **Source:** [EV charging in cold temperatures could pose challenges for drivers](https://www.techbriefs.com/component/content/article/33002-ev-charging-in-cold-temperatures-could-pose-challenges-for-drivers), Tech Briefs (reporting INL research), 2018-09-21 (accessed 2026-10-27)
- **Quote (tool):** "a fleet of Nissan Leafs operated as taxis over roughly 500 Direct Current Fast Charge (DCFC) events" / "When an EV battery was charged at 77 degrees, a DCFC charger might charge it to 80 percent capacity in 30 minutes." / "But at 32 degrees, the battery's state of charge was 36 percent less after the same amount of time." / "Under the coldest conditions, the rate of charging was roughly three times slower than at warmer temperatures." / "cold temperatures impact the electrochemical reactions within the cell"
- **Source:** [Can electric cars charge in cold weather?](https://www.recurrentauto.com/research/study-ev-charging-speeds-in-cold-temperatures), Scott Case, Recurrent, 2024-01-18 (accessed 2026-10-27)
- **Quote (tool):** "9 minutes longer on average, not including time to warm the battery if it is very cold." / without preconditioning, "the first 30-45 minutes of your charging session may not add any charge"
- **Note:** Old Leafs (no active battery heating) are a worst case. Modern cars precondition. BYD claims only +3 min at −30 °C (B2, claim).

### W4. Heat helps the chemistry (briefly), which is why cars warm the battery first

- **Status:** 🟡 (press coverage of a peer-reviewed 2019 *Joule* paper; the Penn State release wasn't opened).
- **Lead:** Penn State (Chao-Yang Wang): heating a cell to about 60 °C during a roughly 10-minute charge avoided lithium plating. Wang: "Taking this battery to the extreme of 60 degrees Celsius is forbidden in the battery arena" (search summary of ScienceAlert/CleanTechnica). A DOE slide: raising temperature to about 60 °C "effectively eliminated lithium plating during 6C charging" (snippet).
- **Note:** That backs "a warm battery charges faster" and explains preconditioning. Keep any number out of the voice unless re-sourced.

### W5. C-rate in one line

- **Status:** 🧮 / ✅ (BYD uses the term).
- **Note:** 1C fills the battery in an hour. 10C would fill it in 6 minutes. BYD gen 1 claims "10C" peak (B1), and gen 2 averages "7.2C" for 10→70% (B2, EVCS). Check: 60% ÷ (5/60 h) = 7.2C ✓. A Model Y peaks at about 3C [250 kW ÷ about 78 kWh, the capacity estimated by EVCS] and averages about 1.5C for 10→80% [70% ÷ (27/60 h)]. 🧮

---

## E. Heat and cables

### E1. P = V × I, and heat grows with current squared

- **Status:** ✅ (tool).
- **Source:** [Electric Power](http://hyperphysics.gsu.edu/hbase/electric/elepow.html), HyperPhysics, R. Nave, Georgia State University, undated (accessed 2026-10-27)
- **Quote (tool):** "P = VI" / "Power = Voltage x Current" / "The fact that the power dissipated in a given resistance depends upon the square of the current"
- **Source:** TechCrunch, Tim De Chant, 2025-03-21 (B1)
- **Quote (tool):** "Automakers have been pursuing ever higher voltages because higher voltages generates less heat, allowing more power to be delivered safely and efficiently." / the cables "would have to be incredibly thick" / cables on 350 kW chargers "are wrapped in liquid cooling, further increasing their bulk."

### E2. Above about 250 A, charging cables need liquid cooling

- **Status:** ✅ (tool), from a patent (a company document, not a standard).
- **Source:** [EP 3 770 925 A1, Heavy-current charging cable for charging an electric vehicle](https://data.epo.org/publication-server/rest/v1.2/patents/EP3770925NWA1/document.html), ABB Schweiz AG, European Patent Office, published 2021-01-27 (accessed 2026-10-27)
- **Quote (tool):** "Non-cooled charging cable are typically used for charging current up to 250 A" / "as otherwise the charging cable becomes too large, heavy and stiff for the user." / "Such liquid cooling is necessary for high-current fast EV chargers" / "Thus, active liquid cooling is essential"
- **Source:** [Electric vehicles could fully recharge in under 5 minutes with new charging station cable design](https://stories.purdue.edu/electric-vehicles-could-fully-recharge-in-under-5-minutes-with-new-charging-station-cable-design/), Kayla Wiles, Purdue University, 2021-11-10 (accessed 2026-10-27)
- **Quote (tool):** "The most advanced chargers in the industry deliver only currents up to 520 amperes." / chargers "rely on liquid cooling systems to remove heat from within their wires." / scaling up needs "larger conductive wires and more liquid coolant", making the cable "heavier and difficult for customers to handle."
- **Note:** The 520 A figure dates from 2021. Tesla's V4 post is rated 615 A (T3), and BYD's charger runs 1,000–1,500 A (B1, B2). The megawatt truck standard (SAE J3271) defines liquid-cooled setups up to 3,000 A (emobility-engineering, snippet, 🟡).

---

## U. The US situation

### U1. A 100% tariff on Chinese EVs

- **Status:** ✅ (tool).
- **Source:** [FACT SHEET: President Biden Takes Action to Protect American Workers and Businesses from China's Unfair Trade Practices](https://bidenwhitehouse.archives.gov/briefing-room/statements-releases/2024/05/14/fact-sheet-president-biden-takes-action-to-protect-american-workers-and-businesses-from-chinas-unfair-trade-practices/), The White House (archived), 2024-05-14 (accessed 2026-10-27)
- **Quote (tool):** "The tariff rate on electric vehicles under Section 301 will increase from 25% to 100% in 2024."
- **Note:** It was finalised 2024-09-13 and took effect 2024-09-27 (law-firm summaries, snippet). Search summaries say it's still in force in 2026, with other tariffs possibly stacked on top (secondary, 🟡). Say "a 100 percent tariff". Don't give a combined rate.

### U2. The connected-vehicle rule

- **Status:** ✅ (tool).
- **Source:** [Commerce Finalizes Rule to Secure Connected Vehicle Supply Chains from Foreign Adversary Threats](https://www.bis.gov/press-release/commerce-finalizes-rule-secure-connected-vehicle-supply-chains-foreign-adversary-threats), US Department of Commerce, Bureau of Industry and Security, 2025-01-14 (accessed 2026-10-27)
- **Quote (tool):** "The software-related prohibitions will take effect for Model Year 2027." / "The hardware-related prohibitions will take effect for Model Year 2030." / it "prohibits manufacturers with a sufficient nexus to the PRC or Russia from selling new connected vehicles" … "even if the vehicle was made in the United States."
- **Note:** The rule took effect 2025-03-17 (BIS/Gibson Dunn, snippet). It's the bigger wall: even a US-built BYD would be blocked. In September–October 2026 Trump said he'd be "okay" with Chinese plants in the US if they hire Americans, but the rule hasn't changed (Automotive World / autoevolution, search summaries, 🟡). **Don't say it in voice unless re-sourced.** BYD sells no passenger cars in the US. It builds buses in Lancaster, CA (secondary, 🟡).

### U3. The fastest public chargers in the US

- **Status:** ✅ / 🟡.
- **Tesla V4:** up to 500 kW for the Cybertruck and 800 V cars. Other Teslas get 250 kW (T3, ✅).
- **Ionna:** Alpitronic HYC400 units, "charging power of up to 400 kW" with two DC points (electrive, 2025, snippet, 🟡).
- **"Widely available" US chargers:** "deliver only 350 kilowatts" (TechCrunch, 2025-03-21, B1, tool, ✅ as of March 2025).
- **AFDC:** "A DC charging unit can provide up to 500 kW." / "many EVs on the roads today are not capable of charging at rates higher than 200 kW." / "The Megawatt Charging System (MCS) is under development for DC charging up to 3.75 MW" ([AFDC](https://afdc.energy.gov/fuels/electricity-stations), DOE, undated, tool, ✅).
- **Note:** The last AFDC line is a strong payoff fact: **in the US, the car is usually the bottleneck, not the charger.**

### U4. US-market cars with 800 V-class fast charging

- **Status:** 🟡 (mostly maker claims compiled by InsideEVs).
- **Source:** [Fastest Charging Electric Vehicles](https://insideevs.com/features/713032/fastest-charging-electric-vehicles/), InsideEVs, updated "May 20" (no year shown; 2026 per context) (accessed 2026-10-27)
- **Quote (tool, table):** Kia EV6 10–80% "17–18 min", Hyundai Ioniq 5 "18 min", Lucid Gravity "23 min" ("Lucid says"), Lotus Emeya "18 min claimed; 14 min tested", Mercedes-AMG GT 4-Door "Up to 600" kW.
- **Source:** InsideEVs, Rob Stumpf (T2)
- **Quote (tool):** the AMG GT 4-Door "can charge from 10% to 80% in just 11 minutes" on "a 600-kilowatt EV DC fast charger", which "barely exist outside of semi-truck chargers today." Most owners use chargers of "250-400 kW today."
- **Note:** Script-safe: "The quickest cars sold here take about 15 to 20 minutes, and the chargers top out around 400 kilowatts for most of them." The AMG is a claim on hardware almost nobody can use.

---

## G. The grid side

### G3. The average US home

- **Status:** ✅ (tool).
- **Source:** [How much electricity does an American home use?](https://www.eia.gov/tools/faqs/faq.php?id=97&t=3), US Energy Information Administration, last updated 2024-01-08 (accessed 2026-10-27)
- **Quote (tool):** "In 2022, the average annual amount of electricity sold to (purchased by) a U.S. residential electric-utility customer" "was 10,791 kilowatthours (kWh), an average of about 899 kWh per month."
- **Note:** Newer secondary figures (865 kWh/month in 2024) exist but weren't opened. 🧮 P5 gives the homes comparison.

---

## P. Physics working (our calculations, 🧮)

**Inputs:** P = V × I and heat ∝ I² (E1). BYD 1,000 V / 1,000 A / 1,000 kW (B1) and 1,500 kW / up to 1,500 A (B2). Han L 83.2 kWh (B1 note). EIA 10,791 kWh/yr (G3). Pump cap 10 gal/min (G1). EPA average new-vehicle real-world fuel economy MY2024: "a record high 27.2 mpg", and "1.7 mpg lower" without BEVs and PHEVs ([EPA Automotive Trends highlights](https://www.epa.gov/automotive-trends/highlights-automotive-trends-report), EPA, updated 2026-02-19, tool) [→ about 25.5 mpg for non-plug-ins]. CLTC ≈ 35% above EPA (C3).

### P1. Current at each power level

| Case | Power | Voltage | Current I = P / V |
|---|---|---|---|
| BYD gen 1 | 1,000 kW | 1,000 V | **1,000 A** (BYD states it) |
| BYD gen 2 | 1,500 kW | 1,000 V | **1,500 A** (EVCS states it) |
| Same 1,000 kW on a 400 V car | 1,000 kW | 400 V | **2,500 A** |
| Tesla Model 3/Y peak | 250 kW | about 400 V (assumption, T4) | **about 625 A** |
| Tesla V4 post rating | (615 kW theoretical) | 1,000 V | 615 A (sticker, T3) |

### P2. Why higher voltage = less heat

- Heat in the cable = I²R. For the same cable (same R) and the same 1,000 kW: at 400 V, I = 2,500 A → heat ∝ 6,250,000. At 1,000 V, I = 1,000 A → heat ∝ 1,000,000. **Ratio 6.25×.**
- Rule of thumb: **double the voltage, halve the current, a quarter of the heat.**
- Even 1,000 A is 4× the about 250 A that an uncooled cable handles (E2), so BYD's cable must be liquid-cooled. CarNewsChina confirms "liquid-cooled chargers" (B5).

### P3. Average power vs peak power

- **BYD (InsideEVs demo):** 13% → 60.1% = 47.1% of 83.2 kWh ≈ **39 kWh** (gross; usable may be about 80 kWh, giving about 38 kWh) in "a little under five minutes" (about 4.9 min) → 39 kWh ÷ (4.9/60 h) ≈ **about 480 kW average**. That's about half the 1,002 kW peak. The exact SOC-to-kWh mapping is unknown, so say "about half".
- **Model Y (Evercars):** peak 221 kW, average 116 kW → **about half** too (T2, measured).
- **Takeaway:** headline kW is a peak. Every car's average is about half of it.

### P4. Miles added per minute (best cases, apples-to-apples caveats)

| Vehicle / source | Claim or test | Miles added | Time | Mi/min |
|---|---|---|---|---|
| BYD Han L, "400 km in 5 min" (B1) | claim, CLTC | 249 mi CLTC [≈ 184 mi EPA-like] | 5 min | 50 CLTC [≈ 37 EPA-like] |
| BYD Han L, InsideEVs demo (B3) | BYD-run test, car's CLTC estimate | 262 mi (CLTC-based) | about 5 min | about 52 CLTC [≈ 39 EPA-like] |
| Tesla Model 3 Premium RWD (T1) | Tesla claim, 65 mph basis | 195 mi | 15 min | 13 |
| Tesla Model 3 Performance (T1) | Tesla claim | 162 mi | 15 min | 11 |
| Gas car at the 10 gpm cap | 🧮 | 10 gal × 25.5 mpg = 255 mi | 1 min of pumping | **about 255** |

- **Honest framing:** at the pump nozzle, gas still adds range **several times faster** than even BYD's claim. The 5-minute claim closes the gap for a **stop**, not for the flow. Caveats: battery size (a bigger pack takes more kW to add the same %), the SOC window (10→70% skips the slow end), weather (W3), and CLTC vs EPA.
- **Energy flow (optional, 🟡 input):** 10 gal/min × 33.7 kWh/gal (EPA's MPGe basis, secondary sources only) = 337 kWh/min ≈ **20 MW** of chemical energy, about 13× BYD's 1.5 MW. The EV wastes far less: "EVs convert over 77% of the electrical energy from the grid to power at the wheels" vs "about 12%–30%" for gasoline ([fueleconomy.gov](https://www.fueleconomy.gov/feg/evtech.shtml), DOE/EPA, undated, tool). Too dense for a Short. Use only if the script wants "a gas pump is a 20-megawatt hose".

### P5. Charger vs homes

- Average home: 10,791 kWh ÷ 8,760 h = **1.23 kW** average draw.
- 1,000 kW ÷ 1.23 kW ≈ **810 homes**. 1,500 kW ÷ 1.23 ≈ **1,220 homes**.
- Script-safe: "**One of these chargers draws as much power as about a thousand American homes**" (with 1,000 kW: "about 800"; with 1,500 kW: "about 1,200"). Caveat: that's against **average** home use, not peak (homes peak higher on hot afternoons).
- **Buffer battery:** a 1.5 MWh station battery (B5, one outlet) could feed 1,000 kW for about 1.5 h, or about 38 Han L-sized top-ups of about 39 kWh, before it relies on the grid feed. That's ideal-case arithmetic.

### P6. Pumping time

- A 15-gallon fill at the 10 gal/min cap = **1.5 min minimum** of pumping. At 8 gpm, about 1.9 min. Plus paying and the nozzle → "two to three minutes" (G2) is consistent. The tank size of 15 gal is an **assumption** (not sourced; typical midsize sedans/SUVs run about 12–19 gal).
- BYD's 5 min to 70% ≈ **2–3× a fill-up's pumping time**, and about the same as a full stop with paying. That's why the hook says "about" and "claim".

---

## C. Caveats the script must carry

### C1. "Claim" vs "tested"

| Claim | Who says | Outside test? |
|---|---|---|
| BYD gen 1, 400 km / 5 min, 1,000 kW | BYD (B1) | One BYD-run demo: 1,002 kW peak, 13→60% in under 5 min (B3) |
| BYD gen 2, 10→70% in 5 min, 1,500 kW | BYD (B2) | **None found** |
| Zeekr 7X, 10→80% in 9:45 | Out of Spec (Z1) | **Yes, independent** |
| Zeekr 001 (2026 MY), 10→80% in 7 min | Zeekr (Z2) | None found |
| CATL Shenxing gen 3, 10→80% in 3:44 | CATL (Z3) | None (battery only) |
| Tesla, up to 162–195 mi in 15 min | Tesla (T1) | Tests: Model Y 10→80% in about 27–31 min (T2) |

### C2. State-of-charge window

BYD's "5 minutes" is 10→70%, not empty→full (B2). Tesla's "15 minutes" is a best-case range figure at 65 mph (T1). Every number skips the slow top end.

### C3. CLTC vs EPA

- **Status:** 🟡 (InsideEVs rule of thumb).
- **Source:** [How To Convert Conflicting EV Range Test Cycles: EPA, WLTP, CLTC](https://insideevs.com/features/343231/heres-how-to-calculate-conflicting-ev-range-test-cycles-epa-wltp-nedc/), Eric Loveday, InsideEVs, updated 2025-01-13 (accessed 2026-10-27)
- **Quote (tool):** "The WLTP figure to be about 22 percent higher than EPA, and the CLTC number about 35% higher than EPA."
- **Note:** The ratio varies by model. In voice, avoid converting BYD's km to miles at all. Use percent and minutes.

---

## M. Myths (for hooks or comment replies)

1. **"A faster charger means faster charging."** Mostly the car decides. AFDC: "many EVs on the roads today are not capable of charging at rates higher than 200 kW" (U3). A Model 3/Y at a 500 kW V4 still gets 250 kW (T3).
2. **"800 volts makes a car charge fast."** It helps (less current, less heat, P2), but the Cybertruck, Tesla's first 800 V car, charged 11→80% in 45 minutes in 2024, no faster than a 400 V Rivian (T5). The battery's chemistry and cooling decide.
3. **"BYD charges a car in 5 minutes."** It's 10→70% in 5 min (claim). The full 10→97% takes about 9 min (B2). The 1,000 kW peak lasted moments in the only outside look (B3).
4. **"400 km in 5 minutes = 250 US miles."** That's a CLTC range figure, about 35% optimistic vs EPA (C3).
5. **"Fast charging is just a bigger plug."** The limit is inside the battery: lithium plating (W1) and heat. That's why BYD advertises lower internal resistance (B1) and why chargers taper (B3, T2).
6. **"Cold weather kills fast charging."** Partly true: INL saw up to about 3× slower in the cold on old Leafs (W3). With preconditioning, Recurrent found about 9 min longer on average at 0 °F (W3).
7. **"A megawatt charger would black out the neighborhood."** BYD pairs stations with storage batteries that refill from the grid slowly (B5). One charger ≈ the average draw of about 800–1,200 homes (P5).

---

## Angles and hooks (suggested)

**Recommended: Angle 1, "Same road trip, two plugs"** (the owner's story). Hook: "In China, some electric cars now claim to charge in about the time it takes to fill a gas tank." Next line pins it: "BYD says five minutes, from ten to seventy percent." Beats: two cars plug in → the Tesla ramps to 250 kW and then slides (T2) → cut-open: power = volts × amps, with Tesla about 400 V vs BYD about 1,000 V (P1) → more amps = heat squared, so cables go liquid-cooled (E2, P2) → inside the battery: lithium piles up if you push too hard, so every car tapers, even BYD's (W1, B3) → BYD's trick: higher voltage + cooling + cells built to take about 10C (B1, W5) → the station: a megawatt ≈ about a thousand homes, so a battery sits behind the charger (P5, B5) → payoff: a 100% tariff and a software ban keep these cars out of the US, and most US cars can't use more than about 250 kW anyway (U1–U3) → open question: does 5 minutes matter if your Tesla takes 25 while you grab a coffee?

**Angle 2, "The hose problem."** Hook: "A gas pump moves about ten gallons a minute. To match it, an EV charger would need a cable as thick as your arm, unless you change the voltage." Physics-first: P = VI, 2,500 A vs 1,000 A, 6.25× the heat (P2).

**Angle 3, "The charger isn't the slow part."** Hook: "Plug a Tesla into a 500-kilowatt charger and it takes 250. The charger isn't the slow part." Myth-led (M1, M2), ending on BYD's cell-side fix.

---

## Most visual true details for a cut-open charging bay

1. **The cable cross-section.** Copper conductors wrapped in coolant channels. Orange coolant loops back to a chiller in the charger cabinet. Uncooled cables top out about 250 A, and BYD's runs 1,000–1,500 A (E2, B2).
2. **Two current arrows.** The same 1,000 kW drawn as a fat 2,500 A arrow at 400 V vs a slim 1,000 A arrow at 1,000 V. A heat glow 6.25× brighter on the fat one (P2).
3. **The buffer battery cabinet** behind the BYD charger. It fills slowly from a thin grid line and empties fast into the car. The "station within a station" (B5).
4. **The detail-box charge curve.** BYD: 1,002 → 767 → 633 → 463 kW over about 5 min. Tesla: 221 kW sliding to 42 kW at 80% (B3, T2). Both curves fall, at different heights.
5. Optional: inside a cell, lithium ions **queuing on the anode surface** (orange flecks) instead of slipping in (W1). This is what the car's computer is avoiding when it slows down.

---

## Hedges the script must use

| Claim | Say | Don't say | Why |
|---|---|---|---|
| BYD speed | "BYD says five minutes, from ten to seventy percent" | "a full charge in five minutes", "400 miles in five minutes" | Claim, SOC window, CLTC (B2, C3) |
| Gas comparison | "about the time it takes to fill a gas tank" + the 5-min line, or "close to a stop at the pump" | "as fast as gas", "faster than gas" | A fill-up is about 2–3 min. Pumping adds range faster (G2, P4) |
| BYD power | "up to a megawatt", "up to 1,500 kilowatts" | "it charges at a megawatt" | The peak is brief: 1,002 kW then 463 kW (B3) |
| Independence | "BYD says", "in a demo BYD ran" | "tests prove" | No independent gen 2 test (C1) |
| Station count | "more than ten thousand in China, BYD says" | an exact count as fact | Stations vs chargers (B4) |
| Tesla time | "about half an hour, 10 to 80 percent" / "Tesla says up to about 190 miles in 15 minutes" | "Teslas take an hour" | T1, T2 |
| Tesla voltage | "most Teslas run on about 400 volts" | "Tesla doesn't do 800 volts" | The Cybertruck is 800 V (T4) |
| Grid | "about as much power as a thousand homes use on average" | "a thousand homes at once" without "average" | P5 |
| US block | "a 100 percent tariff, and a rule that bans their software" | "Chinese EVs are illegal in the US" | U1, U2. The rule targets connected-vehicle tech from MY2027 |
| Plating | "lithium piles up on the surface instead of soaking in" | "the battery catches fire if you charge fast" | W1 |

---

## Illustrative items for the post description (🎭, if used)

- The two drivers, the shared road trip, and the side-by-side chargers. Suggested line: "Illustrative: the road trip and side-by-side charging scene are a dramatization. Charging figures are the makers' claims or published tests (see sources)."
- If the script uses the 15-gallon tank or 25.5 mpg in a comparison: "Gas comparison assumes a 15-gallon fill at the federal 10-gallon-per-minute pump limit."

---

## Open items for the fact-checker

1. Open tesla.com/modely and /model3 in a browser: confirm the "miles in 15 minutes" figures and the 65 mph footnote (T1).
2. Open the GasBuddy/Cuebiq PDF (G2) and find "2-3 minutes". If it isn't there, fall back to G1 + P6.
3. Find a lab or university source for the CC-CV taper (W2), or keep the script to "the car slows the charge to protect the battery".
4. Look again for any independent test of BYD gen 2 (1,500 kW) before publish. None was found as of 2026-10-27.
5. Re-check the latest BYD station count right before publish (B4). It moves weekly.
6. Check whether any 2026 change to the Section 301 tariff or the connected-vehicle rule happened (U1, U2). Search summaries mention a Supreme Court tariff ruling (IEEPA, not Section 301) and Trump's openness to US plants, neither confirmed by me.
