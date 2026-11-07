# Sources: ev-cost (No. 016)

Researcher draft, 2026-11-05. There's no script yet, so the claims follow the owner-approved beat order: hook → belief → cost per mile (home at the average rate, home off-peak, DC fast charger, gas) → why fast charging costs more → maintenance (oil, brakes, tires) → catch-up point (home vs fast) → ending question. The statuses are the researcher's starting confidence. The fact-checker sets the final ones.

Owner-approved angle: **the plug.** Hook: "An EV can cost less per mile than a gas car, or more. It comes down to which plug you use." **Read section H (hook check) and section B (belief check) before scripting. The belief beat as briefed is contradicted by survey data.**

## FACT-CHECK (2026-11-05): verdict per script line (15 lines in `script.txt`)

Checked against the actual `script.txt`, not the researcher's "expected" lines below. Where a claim section below says "Script (expected)", the line numbers here win. Re-opened by the fact-checker this session: EIA gas and electricity, fueleconomy.gov (Equinox page, cold weather, label, atv-ev), AFDC maintenance, DOE FOTW 1190, Pew, AAA newsroom release, EV Infrastructure News Q3, mgrid.org Q3 write-up, Cars.com (EV article 2026-03-26, gas specs), KBB gas Equinox page, Electrek, TLT, Auto Remarketing. **Could not read (binary PDF, no extractor):** AAA fact sheet and brochure, National Grid rate guide. Those were checked through search summaries that match the researcher's quotes (🟡 on the opening, not ✅).

| Line | Claim | Status | Verdict | Fix |
| --- | --- | --- | --- | --- |
| 1 | An EV can cost less or more per mile depending on the plug | 🧮 / 🟡 | PASS | Keep "can". Fast vs gas margin is thin (16.7¢ vs 15.4¢) and flips by state or membership |
| 2 | Some say cheaper, others costlier | ✅ | PASS | Pew 2024-06-27 re-opened: 36% cheaper, 28% more, 32% same |
| 3 | Gas compact SUV about 15¢/mile at today's prices | ✅ inputs / 🧮 | PASS | $4.153 ÷ 27 mpg = 15.38¢ (EIA week of 2026-11-02, re-opened; EPA 27 mpg re-opened). Re-check EIA on render date |
| 4 | Home at average US rate about 6¢ | ✅ inputs / 🧮 | PASS | 0.31 × 18.16¢ = 5.63¢ (EIA Aug 2026 re-opened; EPA 31 kWh/100 mi re-opened). Rounds to 6 |
| 5 | Public fast charger about 17¢ | 🟡 / 🧮 | PASS (conditional) | 0.31 × 54.0¢ = 16.74¢, math fine. 54¢ is Paren's figure seen only through trade press (EV Infrastructure News and mgrid.org both say $0.540). Paren's own report was not reachable. Description must say "Paren US average, Q3 2026". If wanted as ✅, voice "about seventeen, by one industry survey" |
| 6 | Question: why do fast chargers cost more | n/a | PASS | No claim, but it presumes fast charging costs more than home: true on per-kWh price (54¢ vs 18¢) |
| 7 | Many pay a utility fee set by their busiest 15 minutes of the month | 🟡 | PASS | Mechanism confirmed (NREL: demand charge is set by the maximum 15-minute average in the billing month). "Many" is fair but no source counts the share: some utilities exempt fast chargers (ChargedEVs, older). Do not change "many" to "most" or "every" |
| 8 | Average fast charger sits idle most of the day | 🟡 | PASS (conditional) | 15.9% = "Share of time ports were in use, third quarter of 2026" (mgrid.org chart caption, Paren data). So idle ~84% of the time, "most of the day" holds. Definition is one chart caption, not Paren's methodology. Keep "sits idle", don't say "one hour in six" |
| 9 | No oil changes; brakes last longer because the motor does much of the slowing | ✅ | PASS | AFDC: "Brake wear is significantly reduced due to regenerative braking"; DOE FOTW 1190 lists engine oil among parts a BEV lacks. Script already says "much of", not "most" |
| 10 | EV is heavier, so can wear tires sooner | 🟡 | PASS | Hedged with "can". J.D. Power via Auto Remarketing: "EV tires naturally wear faster due to greater vehicle weight and higher torque". TLT 2026-09: rule of thumb ~20% faster, but also "5% to 20%", and some claim slower. "Heavier" is not sourced for this pair (fueleconomy.gov lists no weight): add a curb-weight source or keep it generic |
| 11 | EV costs about $6,000 more to buy | 🟡 | PASS (conditional) | Cars.com 2026-03-26 (opened): Equinox EV LT 1 FWD $36,795 incl. $1,800 destination. KBB gas Equinox LT page (opened): $30,795, destination not stated on the page; GM Authority (403, snippet only) says $30,795 includes $1,995 destination. Gap $6,000. Older prices give $5,700 (Electrek $36,495 vs $30,795). Cars.com gas specs: $28,800 before destination. All round to "about six thousand". Description: "MSRP, incl. destination, no incentives" |
| 12 | Home charging: savings cover the gap in about 3 years | 🧮 / 🟡 | PASS (conditional) | $6,000 ÷ (9.75¢ fuel + 3.68¢ maintenance = 13.43¢) = 44,700 mi = 2.98 yr at 15,000 mi/yr. AAA cross-check 2.8 yr. Fuel only: 4.1 yr. Maintenance saving is AAA's $1,954 − $1,402 (compact SUV, includes tires). Voice does not say "15,000 miles a year": the description must |
| 13 | Fast chargers only: takes about 17 years | 🧮 / 🟡 | PASS (conditional, fragile) | 15.38 − 16.74 = −1.36¢ fuel; +3.68¢ maintenance = 2.32¢/mi → 258,000 mi = 17.2 yr. **Entirely driven by the maintenance saving**: on fuel alone it never catches up, and at a 2.7¢ saving it is about 30 years. Recommended hedge: "Charge only at fast chargers, and it can take about seventeen." Description must list every assumption |
| 14 | AAA found EVs lose value faster, which can eat into those savings | ✅ | PASS | AAA 2026-09-15 (opened): "EV medium sedans had about twice the depreciation of gas-powered models"; "those savings were often outweighed by higher depreciation, fees and finance costs". Compact SUV $5,298 vs $3,568 (search summary of the brochure). Scope: AAA's sample models, 5 years/75,000 miles. Keep "can" |
| 15 | Question | n/a | PASS | No claim |

**Overall: PASS (no ❌).** Lines 5, 8, 11, 13 are 🟡 and need the description lines below; line 13 should take the hedge "can". **Legally sensitive:** line 14 names AAA (attributed finding, accurate). Rule tension for the main session: `CLAUDE.md` says never name a company as a citation, and AAA is named in the voice as one. `docs/sources-format.md` allows spoken attribution where the story needs it, and the line is ✅ without it, so "Studies of ownership costs found..." would also work. Paren and Chevrolet are in the description only. No other company is named in the voice.

### Answers to the researcher's open items

- **Paren Q3 2026, 54¢:** confirmed as $0.540/kWh by two independent write-ups (EV Infrastructure News, mgrid.org); Paren's report itself still not opened. Whether free chargers are excluded is **not stated for Q3**. The Q1 2026 write-up (evchargingstations.com) says the headline $0.53 excludes free chargers ("excluding free chargers, which would bring the average down to $0.49/kWh". The wording is garbled: "excluding" there plainly means "including", since the free-inclusive figure is the lower one). So the headline is the paid average. The script says "public fast charger", which is fine.
- **Utilization 15.9%:** only definition found: "Share of time ports were in use, third quarter of 2026" (mgrid.org caption). No methodology beyond that (for example, whether it is per port or per station, or how out-of-service ports count).
- **Equinox gap:** see line 11. About $6,000 (range $5,700 to $6,300 depending on date and whether destination is included).
- **"Many" demand charge:** fair, not quantifiable. See line 7.
- **39% cold figure (advisory):** fueleconomy.gov says "fuel economy can drop roughly 39% in mixed city and highway driving, and range can drop by 41%" and attributes it to a 2019 AAA study. The page gives **no temperature** for it. The only stated EV temperature is 20°F, for the separate no-heater 8% line. Not in the script, so no action. Keep the temperature out of any future line.
- **EPA rule on charging losses (advisory):** the cited 40 CFR 600.116-12 paragraph (c)(8) covers **plug-in hybrids** (hybrids with plug-in capability), not BEVs. For BEVs paragraph (a) points to SAE J1634. An EPA test-procedure summary hosted by ORNL (2017 draft, found via search, not opened) says recharge energy includes charger losses. So "losses are inside 31 kWh/100 mi" is 🟡: likely right for BEVs, but do not cite (c)(8) for it. The fueleconomy.gov label page says nothing about losses. The script doesn't use this claim.

---

Everything was accessed on 2026-11-05 unless noted. **How to read the quotes** (same rules as `hybrid-city/sources.md`):

- **(tool)** means the web tool's small model returned the quote from the page. Re-open and re-quote before ✅.
- **(pdf)** means I read the PDF text directly (AAA fact sheet and brochure, National Grid rate guide). These quotes are exact.
- **(snippet)** means I saw it only in a search-result summary and didn't open the page. It's a lead only (🟡 at best).
- **🧮** means our own calculation. The inputs are sourced and the working is shown.
- **Company claim** means a company's statement about its own product or prices. **Independent** means EIA, EPA/DOE (fueleconomy.gov, AFDC, energy.gov), national labs, AAA, Consumer Reports, Pew, or peer-reviewed work.
- **Paren** is a private EV-charging data company. Its quarterly price survey is the only national fast-charging price series I found. I read it only through trade-press coverage, because Paren's own report wasn't reachable, so it stays 🟡 until the fact-checker opens the original.
- **Couldn't open or not found:** chevrolet.com (403), Edmunds (403), GM Authority (403), the J.D. Power and BusinessWire releases (403), and NREL's site (DNS failure, since renamed). I found no neutral national **off-peak** residential rate (claim 4 is 🎭), no neutral cost figure for a **DC fast charger's equipment** or a **home Level 2 install** (only contractor estimates, ❌), and no national measured figure for **EV tire wear** (claim 13 is 🟡).

---

## Numbers we'd put on screen (max 5, rounded)

One pair throughout: **2026 Chevrolet Equinox EV FWD vs 2026 Chevrolet Equinox FWD (gas)**. Same maker, same nameplate, both on one fueleconomy.gov page. The model goes in the description only, never on screen or in the voice.

| # | On screen | Working (🧮) | Inputs and dates | Status |
| --- | --- | --- | --- | --- |
| 1 | **Gas: about 15¢ a mile** | $4.153 ÷ 27 mpg = 15.4¢ | EIA weekly US regular, 2026-11-02; EPA 27 mpg combined | ✅ inputs / 🧮 |
| 2 | **Home charging: about 6¢ a mile** | 31 kWh/100 mi × 18.16¢ = 5.6¢ | EIA US residential average, Aug 2026 (released 2026-10-23); EPA 31 kWh/100 mi | ✅ inputs / 🧮 |
| 3 | **Fast charger: about 17¢ a mile** | 31 kWh/100 mi × 54.0¢ = 16.7¢ | Paren US DC fast-charging average, Q3 2026 (reported 2026-10-13) | 🟡 (Paren via trade press) / 🧮 |
| 4 | **Catch-up: about 3 years at home vs about 17 at a fast charger** | ~$6,000 price gap ÷ (fuel + maintenance saving per mile) at 15,000 mi/yr: home ≈ 45,000 mi; fast ≈ 258,000 mi | See claim 15 | 🟡 / 🧮 (assumption-heavy, so state them in the description) |
| 5 (optional) | **Overnight off-peak: about 3¢ a mile** | 31 kWh/100 mi × 10¢ = 3.1¢ | 10¢/kWh is an **illustrative** off-peak rate. No national average exists | 🎭 |

**Description line (draft for the publisher):** "Per-mile figures: 2026 Chevrolet Equinox EV FWD (31 kWh/100 mi) vs Equinox FWD gas (27 mpg), EPA ratings. Gas $4.15/gal (EIA, Nov 2, 2026). Home electricity 18.2¢/kWh (EIA US residential average, Aug 2026). Fast charging 54¢/kWh (Paren US average, Q3 2026). Catch-up assumes 15,000 miles a year and a ~$6,000 price gap at MSRP. Illustrative: the 10¢/kWh off-peak rate."

---

## H. Hook check: "An EV can cost less per mile than a gas car, or more. It comes down to which plug you use."

| Part | Evidence | Status |
| --- | --- | --- |
| "can cost less per mile" | Home at the national average: 5.6¢ vs gas 15.4¢ (🧮, numbers 1–2). AAA 2026: EV charging costs "about 66%–70% lower than fuel costs for traditional gas vehicles" at 18¢/kWh home charging. | ✅ |
| "or more" | Fast charger at the Q3 2026 national average: 16.7¢ vs gas 15.4¢ combined (🧮). On the highway, where road-trip fast charging happens: 18.2¢ vs 14.3¢ (🧮, claim 7). **The margin is thin on the combined cycle (~1.3¢).** It depends on the state (Paren Q2 2026: $0.428/kWh in Nebraska to $0.856 in Hawaii), on memberships (lower prices), and on gas prices (AAA: gas was up 31.8% vs 2025). | 🟡 as "can". It's true at national averages today, not everywhere. Never say "always more" |
| "which plug you use" | It's a fair simplification: the price per kWh is set by where you charge (home rate vs public fast-charger price). | ✅ (framing) |

**Verdict:** the hook holds **because of "can"**. Keep "can". A fair viewer will argue "at my Supercharger membership price it's cheaper than gas" or "gas is $3 where I live". Both are true and both fit "can". The safest wording keeps the hook as it is and adds the scope in the description.

## B. Belief check: "most people think an EV is always cheaper to run" (❌ as briefed)

- **Status:** ❌ unsupported as worded. The survey evidence says the opposite: Americans are split.
- **Source:** [About 3 in 10 Americans would seriously consider buying an electric vehicle](https://www.pewresearch.org/short-reads/2024/06/27/about-3-in-10-americans-would-seriously-consider-buying-an-electric-vehicle/), Pew Research Center, 2024-06-27 (survey of 8,638 US adults, May 13–19, 2024)
- **Quote (tool):** "Americans are split in their perceptions of the cost of charging or fueling these vehicles." / "Some 36% say EVs cost less to charge than gas-powered vehicles do to fuel," / "while 28% say EVs cost more and 32% think the costs are about the same."
- **Lead only (snippet, not opened):** a Bumper.com survey (April 2026, 2,228 people, reported by CarPro/CleanTechnica): 67.4% believed switching would make "no difference" to annual fuel or charging costs.
- **Note:** this is a decision for the owner or main session, not a value tweak (see report). Options that are ✅ against Pew: (a) "Ask around and you'll hear both: EVs are dirt-cheap to run, or they cost more than gas. Both can be true." (b) "Some people swear an EV is cheaper to run. Others say it costs more. They can both be right." (c) Drop "most people" and state the claim as a common line: "You've probably heard an EV is always cheaper to run." That's 🟡 framing, not a statistic. **Recommend (b): the split belief is itself the setup for "it depends on the plug".**

---

## 1. US average gasoline price

- **Script (expected):** "Gas is about four fifteen a gallon right now."
- **Status:** ✅ verified (EIA, weekly)
- **Source:** [Gasoline and Diesel Fuel Update](https://www.eia.gov/petroleum/gasdiesel/), US Energy Information Administration, released 2026-11-03 (data for week of 2026-11-02)
- **Quote (tool, table row):** "U.S. 4.284 4.269 4.153" (weeks of 10/19/26, 10/26/26, 11/02/26, $/gal regular)
- **Source (12-month average, same level):** [AAA: New Vehicle Ownership Costs Hit $12,863 Annually](https://newsroom.aaa.com/2026/09/aaa-new-vehicle-ownership-costs-hit-12863-annually/), AAA Newsroom, 2026-09-15
- **Quote (tool):** "the regular-grade gasoline used by nearly all YDC vehicles averaged $4.152 per gallon" / "Gas prices are up 31.8% compared to 2025, while electricity prices rose only 7.8%"
- **Note:** Scope: US, regular, all regions. The price moves weekly, so re-check it on the render date and say "about" in the voice. Gas is unusually high in 2026 (AAA: +31.8% vs 2025), which **helps** home charging and **narrows** the fast-charging gap. Don't explain why gas is high (politics).

## 2. US average residential electricity price

- **Script (expected):** "At the average home rate, about 18 cents a kilowatt-hour…"
- **Status:** ✅ verified (EIA)
- **Source:** [Electric Power Monthly, Table 5.6.A: Average Price of Electricity to Ultimate Customers by End-Use Sector](https://www.eia.gov/electricity/monthly/epm_table_grapher.php?t=epmt_5_6_a), EIA, released 2026-10-23 (data for August 2026)
- **Quote (tool, row):** "U.S. Total 18.16 17.57" (residential, ¢/kWh, Aug 2026 and Aug 2025)
- **Source (annual):** [Short-Term Energy Outlook: Electricity](https://www.eia.gov/outlooks/steo/report/elec_coal_renew.php), EIA, released 2026-10-06
- **Quote (tool, table row "Residential electricity price (cents per Kilowatthour)"):** 2025: 17.3; 2026 (forecast): 18.2; 2027 (forecast): 18.7
- **Source (AAA uses the same):** [AAA Your Driving Costs 2026 fact sheet](https://newsroom.aaa.com/wp-content/uploads/2026/09/AAA_YDC-Fact-Sheet_2026.pdf) (pdf): "Electric vehicle charging costs are based on a rate increased to 18 cents/kilowatt hour."
- **Note:** August is a summer month (often higher). The 2026 annual forecast of 18.2¢ agrees, so "about 18 cents" is safe. State rates vary widely (not checked state by state here).

## 3. Efficiency of the pair: 31 kWh/100 mi vs 27 mpg (EPA)

- **Script (expected):** none directly. It drives every per-mile number.
- **Status:** ✅ verified (EPA/DOE)
- **Source:** [2026 Chevrolet Equinox](https://www.fueleconomy.gov/feg/bymodel/2026_Chevrolet_Equinox.shtml), fueleconomy.gov, undated page, live 2026
- **Quote (tool, table):** "Equinox EV FWD | Automatic (A1), Electricity | 108 MPGe | 117 | 100 | 31 kWh/100 mi"; "Equinox FWD | 4 cyl, 1.5 L, Automatic (variable gear ratios), Regular Gasoline | 27 MPG | 26 | 29 | 3.7 gal/100 mi"; "Equinox EV AWD (11 kW Charger) | 103 MPGe | … | 33 kWh/100 mi"; "Equinox AWD | 26 MPG | 25 | 29"
- **Note:** The EV is the larger vehicle (longer wheelbase, from my own knowledge, ❌ unsourced here), so it's a "same name, same price class" pair, not twins. Say "a popular electric SUV and its gas version" in the description, not "identical". Highway: EV 100 MPGe; gas 29 mpg (used in claim 7).

## 4. Home charging cost per mile (average rate) and overnight off-peak

- **Script (expected):** "Plugged in at home, that's about 6 cents a mile. On a cheap overnight rate, it can be closer to 3."
- **Status:** ✅ 🧮 (average rate) / 🎭 (off-peak figure)
- **🧮 Average:** 0.31 kWh/mi × $0.1816 = **$0.056/mi ≈ 6¢**.
- **🧮 Off-peak (illustrative):** 0.31 × $0.10 = **$0.031/mi ≈ 3¢**. 10¢/kWh is a round illustrative number.
- **Source (TOU rates exist, no national figure):** [Charging Electric Vehicles at Home](https://afdc.energy.gov/fuels/electricity-charging-home), DOE Alternative Fuels Data Center, undated
- **Quote (tool):** "Some utilities offer residential time-of-use rates or other rate incentives for charging infrastructure owners." / costs depend on "the time of day and length of time the charging station is used."
- **Source (AAA, home charging, compact SUV, 15,000 mi/yr):** [Your Driving Costs 2026 brochure](https://newsroom.aaa.com/wp-content/uploads/2026/09/8-YDC-Brochure_2026-1.pdf), AAA, 2026-09
- **Quote (pdf, "Cost per Year 15k mi/yr", Compact SUV):** "fuel $771 $2,382 $1,731" (Electric / Gas / Hybrid). 🧮 That's 5.1¢/mi EV vs 15.9¢/mi gas, which matches our pair.
- **❌ National off-peak average:** not found. All figures seen are utility tariffs or vendor blogs (snippets: 6–12¢ typical; Con Edison lists 2.49¢ midnight–8 a.m. "not reflect[ing] various surcharges"). **Don't voice a specific off-peak number as a fact.** Use "can be closer to 3 cents" with "Illustrative: off-peak rate of 10¢/kWh" in the description, or skip it.

## 5. Public DC fast-charging price (national average)

- **Script (expected):** "At a public fast charger, the national average is about 54 cents a kilowatt-hour."
- **Status:** 🟡 plausible (fact-checker re-opened EV Infrastructure News and mgrid.org: both say $0.540/kWh. Paren's own report still not opened. Company survey, not government. Free chargers: not stated for Q3; the Q1 write-up says the headline is the paid average)
- **Source:** [US fast charging network surpasses 80,000 ports in Q3 2026, Tesla's market share dips below 50%](https://www.evinfrastructurenews.com/charging-installation/us-fast-charging-network-q3-2026-tesla-market-share), Molly Green, EV Infrastructure News (Informa), 2026-10-13
- **Quote (tool):** "the national average in the US reaching US$0.540/kWh." / "For non-members, Tesla charging rose 15% over 2026, reaching US$0.569/kWh and by 9% for members to US$0.396." / "Utilisation remained very steady quarter-on-quarter, at 15.9% in Q3 and 15.8% in Q2." / "the majority of operators (72.9%) use fixed pricing, and 27.1% offer time-of-use tariffs."
- **Source (Q2 2026):** [US EV fast charging market rebounds in Q2, Paren reports](https://www.evinfrastructurenews.com/public-charging/us-ev-fast-charging-market-rebounds-in-q2-paren-reports), EV Infrastructure News, 2026-07-14
- **Quote (tool):** "Average public DC fast charging prices increased to US$0.538/kWh nationally." / "Hawaii remained the highest-priced market at US$0.856/kWh," / "Nebraska recorded the lowest average price at US$0.428/kWh."
- **Note:** Scope: US, public DC fast chargers, Q3 2026. One summary (snippet) says Paren's Q1 2026 figure excluded free chargers ($0.53 vs $0.49 with free ones included), so 54¢ is probably the **paid** average. The fact-checker should confirm on Paren's report. Don't name Tesla in the voice (brand rule, and no brand fights). Memberships lower the price (Tesla member $0.396), which is fair comment material.

## 6. Per-minute pricing is rare now

- **Script (expected, optional):** "A few chargers bill by the minute instead. Then a slow-charging car pays more."
- **Status:** ✅ for "rare" (2.3% of stations, Q2 2026, Paren via trade press, 🟡 on the source) / ❌ for "a slow car pays more" (logical, but no source opened says it)
- **Source:** [US EV fast charging market rebounds in Q2, Paren reports](https://www.evinfrastructurenews.com/public-charging/us-ev-fast-charging-market-rebounds-in-q2-paren-reports), EV Infrastructure News, 2026-07-14
- **Quote (tool):** "Fixed per-kilowatt-hour pricing accounted for 70.7% of qualifying stations," / "time-of-use pricing representing 27.0% and per-minute billing 2.3%."
- **Note:** Per-minute pricing is now a footnote. Recommend leaving it out of a 60 s Short. Electrify America's own pricing page says only "Pricing for DC fast charging is determined by charger location, your plan, and the amount of energy delivered" and "Idle fees may be imposed for parking time after your charging session has ended" (company page, tool). Idle fees are a real extra but small; skip.

## 7. Fast charging vs gas per mile: combined and highway

- **Script (expected):** "At a fast charger, that same mile costs about 17 cents. That's more than gas."
- **Status:** 🟡 🧮 (inputs ✅ except the Paren price 🟡). True at national averages on the dates stated. Thin margin on the combined cycle
- **🧮 Combined:** fast 0.31 × $0.540 = **16.7¢** vs gas $4.153 ÷ 27 = **15.4¢** → fast charging costs ~1.3¢/mi (≈ 9%) more.
- **🧮 Highway (road trips):** EV 100 MPGe → 33.7 kWh/100 mi (EPA: 33.7 kWh = 1 gallon equivalent; I didn't find this on an opened page this session, so it's 🟡). Fast 0.337 × $0.540 = **18.2¢** vs gas $4.153 ÷ 29 = **14.3¢** → fast is ~27% more.
- **🧮 Sensitivity:** fast charging beats gas below roughly 50¢/kWh on the combined cycle (break-even 15.4¢ ÷ 0.31 = 49.6¢/kWh). So in a cheap state (Nebraska $0.428 → 13.3¢) or with a membership, fast charging is **cheaper** than gas. Gas at $3.50 would be 13.0¢/mi, and fast charging would then cost about 30% more.
- **Note:** **Say "can cost more than gas", never "costs more".** It's best framed on the road trip: "On a road trip, a fast charger can cost more per mile than gas." That's the strongest and fairest version (highway numbers).

## 8. Why fast charging costs more (1): the demand charge

- **Script (expected):** "A fast charger's power bill isn't just for the electricity. The utility also charges for the single biggest spike of the month, even if it happened in one 15-minute session."
- **Status:** ✅ verified (utility's own rate document: a company describing its own tariff. Plus NREL peer-reviewed work for the general effect)
- **Source:** [EV Phase-In Rate Guide, v1.2](https://www.nationalgridus.com/media/pdfs/bus-ways-to-save/ev/cm10692_ev_phase-in_rate_guide.pdf), National Grid (Upstate New York), 2026-07
- **Quote (pdf):** "The demand on a customer bill uses the customer's highest (peak) measured demand over any 15-minute interval during the billing period." / "In the example bill below, the peak demand was 411 kW, and the demand charge rate was $13.08 / kW, so the total distribution delivery demand charge for that month was 411 kW x $13.08 per kW = $5,382." / "New EV charging sites may have a low load factor, meaning they have high demand (kW) during the billing period but don't experience that demand very often. This can lead to higher costs relative to the amount of energy (kWh) used." / sample standard demand rate, SC-3 Secondary: "$15.62" per kW.
- **Source:** [Electricity rates for electric vehicle direct current fast charging in the United States](https://www.osti.gov/biblio/1543251-electricity-rates-electric-vehicle-direct-current-fast-charging-united-states), Muratori, Kontou, Eichman, *Renewable and Sustainable Energy Reviews* 113, 2019 (NREL)
- **Quote (tool, abstract):** "ranging from less than 0.10 cents to over 2 dollars per kilowatt-hour" / "The main driver of cost is low utilization" / "Low utilization leads to significantly higher electricity cost, particularly for rates with demand charges"
- **Source:** [Technology solutions to mitigate electricity cost for electric vehicle DC fast charging](https://www.osti.gov/biblio/1507680), Muratori et al., *Applied Energy* 242, 2019 (NREL)
- **Quote (tool, abstract):** "In particular, electricity demand charges can significantly impact electricity cost for fast charging applications." / "However, DCFC has also been shown to be potentially more expensive compared to residential or workplace charging."
- **🧮 Picture:** one 150 kW charger running flat-out for 15 minutes sets the month's peak: 150 kW × $15.62 = **$2,343** demand charge that month (National Grid's sample SC-3 rate), whether one car came or a thousand. This is 🎭 as a generic example ("one utility's sample rate"). Don't present it as typical.
- **Note:** Not every station pays demand charges, and some utilities offer EV rates that soften them (the National Grid document itself is one). Say "many fast chargers pay…", not "every". The plain-words mechanism is solid: you pay for the **spike**, not just the energy.

## 9. Why fast charging costs more (2): chargers sit idle most of the time

- **Script (expected):** "And the average fast charger is in use only about one hour in six, so the fixed costs get spread over fewer sales."
- **Status:** 🟡 (Paren via trade press) / 🧮 (15.9% ≈ one hour in six, rounded 1/6.3). Fact-check: definition found in one chart caption, "Share of time ports were in use, third quarter of 2026" (mgrid.org). So "sits idle most of the day" ✅-ish as 🟡; the script doesn't say "one hour in six"
- **Source:** [EV Infrastructure News](https://www.evinfrastructurenews.com/charging-installation/us-fast-charging-network-q3-2026-tesla-market-share), 2026-10-13
- **Quote (tool):** "Utilisation remained very steady quarter-on-quarter, at 15.9% in Q3 and 15.8% in Q2."
- **Note:** Paren's definition of "utilization" (time in use vs energy vs capacity) wasn't checked, so the fact-checker should confirm it before "one hour in six" is voiced. "Fixed costs spread over fewer sales" is standard economics, consistent with NREL's "main driver of cost is low utilization".

## 10. Why fast charging costs more (3): the equipment and a convenience premium

- **Script (expected):** "Plus the hardware is expensive, and you're paying for speed."
- **Status:** 🟡 for the qualitative "expensive hardware" / ❌ for any dollar figure / 🟡 for "convenience premium" (no independent source states it)
- **Source (qualitative, NREL):** Applied Energy 2019 above: DCFC "potentially more expensive compared to residential or workplace charging."
- **❌ Equipment cost:** only vendor and contractor estimates found (snippets: $43,000–$250,000 per 150 kW port, widely inconsistent). California's program offers "up to $55,000 per 150 kW port" as an incentive (snippet), which is a subsidy, not a cost. **No dollar figure in the script.**
- **Note:** For a ✅ line, keep it to the demand charge and the low utilization (claims 8–9). They're the surprising, sourced mechanism.

## 11. Maintenance: no oil changes

- **Script (expected):** "There are no oil changes, ever."
- **Status:** ✅ verified (DOE/Argonne)
- **Source:** [FOTW #1190: Battery-Electric Vehicles Have Lower Scheduled Maintenance Costs than Other Light-Duty Vehicles](https://www.energy.gov/cmei/vehicles/articles/fotw-1190-june-14-2021-battery-electric-vehicles-have-lower-scheduled), DOE Vehicle Technologies Office, 2021-06-14
- **Quote (tool):** "The estimated scheduled maintenance cost for a light-duty battery-electric vehicle (BEV) totals 6.1 cents per mile" / "a conventional internal combustion engine vehicle (ICEV) totals 10.1 cents per mile" / a BEV lacks "an ICEV's engine oil, timing belt, oxygen sensor, spark plugs and more"
- **Source:** [Maintenance and Safety of Electric Vehicles](https://afdc.energy.gov/vehicles/electric-maintenance), DOE AFDC, undated
- **Quote (tool):** "all-electric vehicles require less maintenance because they have fewer moving parts and fluids to change." / "fewer fluids, such as engine oil, that require regular maintenance."
- **Underlying study:** Burnham et al., *Comprehensive Total Cost of Ownership Quantification for Vehicles with Different Size Classes and Powertrains*, ANL/ESD-21/4, Argonne, 2021-04-01, [OSTI 1780970](https://www.osti.gov/biblio/1780970) (abstract opened: "Electric and electrified powertrains have lower maintenance and repair costs than internal combustion engine" "(ICE) powertrains for all vehicle sizes, relative to vehicle price.")
- **Note:** "No oil changes" is ✅ for a battery-electric car. "Ever" is fine for engine oil. EVs still have coolant, brake fluid and a reduction-gear lubricant, so "no fluids" ❌. The 6.1 vs 10.1¢ figures are **2021, scheduled maintenance only**.

## 12. Maintenance: brakes last longer because regen does most of the slowing

- **Script (expected):** "The brakes last longer, because the motor does most of the slowing down and turns it back into charge."
- **Status:** ✅ verified (DOE) / 🟡 "most of the slowing" (no US measurement of the share; see `one-pedal/sources.md` notes)
- **Source:** [Maintenance and Safety of Electric Vehicles](https://afdc.energy.gov/vehicles/electric-maintenance), DOE AFDC, undated
- **Quote (tool):** "Brake wear is significantly reduced due to regenerative braking."
- **Source:** [Where the Energy Goes: Electric Cars](https://www.fueleconomy.gov/feg/atv-ev.shtml), fueleconomy.gov, undated
- **Quote (tool):** EVs "recover some energy that would otherwise be lost in braking."
- **Source (carried over from `one-pedal/sources.md` F1, accessed there 2026-10-21, not re-opened today):** Hicks W, Green DC, Beevers S, *Environmental Pollution* 336:122400, 2023, [doi:10.1016/j.envpol.2023.122400](https://doi.org/10.1016/j.envpol.2023.122400)
- **Quote (tool, abstract):** "the results show that RBS would reduce brake wear by between 64 and 95%."
- **Note:** That's a modeling study (UK), so attribute it: "one study estimates…". "The motor does most of the slowing" is 🟡. The ✅ phrasing is "the motor does much of the slowing" or "brake wear drops a lot". Plain-words mechanism: lift off, the motor runs as a generator, its resistance slows the car, and the pads barely touch. For the owner's earlier preference, see the one-pedal video (same mechanism, don't repeat the long version).

## 13. Maintenance: a heavier car may wear tires faster

- **Script (expected):** "But they're heavier, so tires can wear out sooner."
- **Status:** 🟡 plausible (widely stated by industry. No neutral measured US figure opened)
- **Source:** [EV owners' unrealistic tire expectations lead to lower satisfaction, J.D. Power finds](https://www.autoremarketing.com/ar/analysis/ev-owners-unrealistic-tire-expectations-lead-to-lower-satisfaction-j-d-power-finds), Auto Remarketing staff, 2024-03-25 (reporting J.D. Power's 2024 U.S. OE Tire Customer Satisfaction Study)
- **Quote (tool):** "The reality is EV tires naturally wear faster due to greater vehicle weight and higher torque." (the article's wording, paraphrasing the J.D. Power release, which I couldn't open: 403)
- **Source:** [Wear of electric vehicle tires](https://www.stle.org/files/TLTArchives/2026/09_September/Worldwide.aspx), R. David Whitby, *TLT* (Society of Tribologists and Lubrication Engineers), 2026-09
- **Quote (tool):** "One fleet study found electric and hybrid vehicle tires lasted about 6,350 fewer miles on average." EV and hybrid tires "can wear about 20% faster than comparable gasoline or diesel-vehicle tires." Other sources put it "from roughly 5% to 20%."
- **Counterweight (AAA, includes one set of replacement tires):** AAA 2026 maintenance, repair and tires, per year at 15k mi (pdf): Compact SUV "maintenance $1,402 $1,954 $1,506"; Medium sedan "$1,602 $1,827 $1,619"; Medium SUV "$1,784 $1,829 $1,902"; Pickup "$1,618 $1,788 $1,539" (Electric / Gas / Hybrid). AAA's fact sheet defines the category as including "one set of replacement tires".
- **Note:** The "~20%" figure is a rule of thumb (Michelin is quoted in the trade press: snippet). The fleet study is unnamed, so ❌ for its numbers in the voice. **Script with "can" and no number.** The fair summary: tires can go sooner, and even counting them, AAA still finds EV maintenance lower in all four segments it compared (narrowly for medium SUVs: $1,784 vs $1,829).

## 14. The EV usually costs more to buy (the price gap)

- **Script (expected):** "But the electric one usually costs more up front. For this pair, about six thousand dollars."
- **Status:** 🟡 plausible (manufacturer site blocked. Fact-check update: Cars.com article of 2026-03-26 (opened) gives EV LT 1 FWD $36,795 incl. $1,800 destination; KBB gas LT page (opened) $30,795, destination not stated, GM Authority snippet says it includes $1,995. Gap ≈ $6,000, range $5,700–$6,300 by date. MSRP, not transaction price)
- **Source (EV):** [2026 Chevy Equinox EV gets slight price bump and more](https://electrek.co/2025/10/07/2026-chevy-equinox-ev-gets-slight-price-bump-and-more/), Peter Johnson, Electrek, 2025-10-07
- **Quote (tool):** "The base 2026 LT FWD trim starts at $36,495 with up to 319 miles of range, including a $1,395 destination fee." (= $35,100 before destination, 🧮)
- **Source (gas):** [2026 Chevrolet Equinox specs](https://www.cars.com/research/chevrolet-equinox-2026/specs), Cars.com, live 2026
- **Quote (tool):** FWD LT "Starting MSRP" "$28,800"
- **🧮 Gap:** $35,100 − $28,800 = **$6,300** before destination. With destination, using the snippet-only $1,995 gas destination: $36,495 − $30,795 = $5,700. **Round to "about $6,000".**
- **Note:** Cars.com's Equinox **EV** page still shows $34,995 (the 2025 price), so prices on listings lag. The fact-checker should open chevrolet.com's build-and-price in a browser. Dealer discounts vary a lot (snippet: one gas Equinox listing $1,000 off MSRP). Tax credits and incentives are **out of scope (politics)**: don't mention them, and keep "MSRP" in the description. "Usually costs more up front" ✅ in general: AAA's 2026 EV comparison shows higher EV finance charges and taxes in every segment it compared, which tracks a higher price (pdf: finance "$1,208" EV vs "$933" gas, compact SUV).

## 15. Catch-up point: home charging vs fast charging

- **Script (expected):** "Charge mostly at home, and the savings cover that gap in about three years. Charge mostly at fast chargers, and it takes about 17, longer than most people keep a car."
- **Status:** 🟡 🧮 (sourced inputs, our model. Every assumption must go in the description)
- **Assumptions (all stated):** 15,000 mi/yr (AAA's and EPA's label basis: "EPA assumes annual mileage of 15,000 miles", fueleconomy.gov [label explainer](https://www.fueleconomy.gov/feg/label/learn-more-electric-label.shtml), tool); EV 31 kWh/100 mi, gas 27 mpg (EPA combined, claim 3); gas $4.153/gal (EIA 2026-11-02); home 18.16¢/kWh (EIA Aug 2026); fast 54.0¢/kWh (Paren Q3 2026); price gap $6,000; maintenance saving 3.7¢/mi = ($1,954 − $1,402) ÷ 15,000 (AAA 2026 compact SUV, gas minus EV, pdf). No discounting, no price changes over time, and **no depreciation, insurance or registration differences** (see pitfalls).
- **🧮 Per-mile saving vs gas (15.38¢):**
  - Home, average rate: fuel 15.38 − 5.63 = 9.75¢ + maintenance 3.68¢ = **13.4¢/mi** → $6,000 ÷ 0.134 = **≈ 44,700 mi ≈ 3.0 years**.
  - Home, off-peak 10¢ (🎭): 15.38 − 3.10 = 12.28 + 3.68 = **16.0¢/mi** → **≈ 37,600 mi ≈ 2.5 years**.
  - Fast charger, national average: 15.38 − 16.74 = −1.36¢ + 3.68¢ = **2.3¢/mi** → **≈ 258,000 mi ≈ 17 years**. On fuel alone it **never** catches up; only the maintenance saving moves it.
  - Fuel-only, home average (if the script skips maintenance): $6,000 ÷ 0.0975 = **≈ 61,500 mi ≈ 4.1 years**.
- **Cross-check (AAA 2026, independent, home charging at 18¢):** compact SUV fuel + maintenance per year: EV $771 + $1,402 = $2,173 vs gas $2,382 + $1,954 = $4,336 → EV saves **$2,163/yr** (pdf, 🧮). At a $6,000 gap → 2.8 years. That agrees with our 3.0.
- **Note:** "About three years vs about seventeen" is the punchline. Voice "years", not miles, and say "if you drive about 15,000 miles a year". The fast-charging case is 100% fast charging, an extreme. Most drivers mix. A fair middle: 50/50 home/fast → fuel ≈ 11.2¢/mi, saving 4.2 + 3.7 = 7.9¢ → ≈ 76,000 mi ≈ 5 years (🧮). **The big caveat a fair viewer will raise: depreciation** (claim 18). Phrase the catch-up as "the running-cost savings cover the price gap", not "the EV is cheaper overall".

## 16. Ending: "Where do you charge?"

- **Script (expected):** "So where do you charge?"
- **Status:** n/a (question, no claim)
- **Note:** Pairs well with a poll for the publisher: "Home / Work / Fast chargers / I drive gas".

---

## Pitfalls and real-world gaps (a fair viewer would argue these)

## 17. Cold weather raises the EV's energy use a lot

- **Script (expected, optional):** "In freezing weather, an EV can use about 40% more energy per mile, mostly to heat the cabin."
- **Status:** ✅ verified (EPA/DOE) for the figures. Watch the wording
- **Source:** [Fuel Economy in Cold Weather](https://www.fueleconomy.gov/feg/coldweather.shtml), fueleconomy.gov, undated
- **Quote (tool):** EV "fuel economy can drop roughly 39% in mixed city and highway driving" and "range can drop by 41%." / "About two-thirds of the extra energy consumed is used to heat the cabin." / "When the cabin heater is not used, EV fuel economy is 8% lower at 20°F than at 75°F."
- **Note:** A 39% **drop in MPGe** means **~64% more kWh per mile** (1 ÷ 0.61), 🧮. So "uses 40% more energy" is **wrong** math. Say "efficiency can drop by about 40% at 20°F", or "a winter mile can cost over half again as much". **Scope gap:** the tool reading found the 20°F vs 75°F comparison stated only for the no-heater 8% line. The page context implies the 39% is the same test with the heater on, but the fact-checker must confirm the temperature before "20°F" or "freezing" is voiced (🟡 until then). Gas cars lose too (≈15% in city driving at 20°F; `hybrid-city/sources.md` claim 18). At the home average, a 20°F mile ≈ 9¢ (🧮), still well under gas. At a fast charger ≈ 27¢ (🧮).

## 18. Depreciation can wipe out the running-cost savings (AAA 2026)

- **Script (expected, optional fairness line):** "And the running costs aren't the whole bill. AAA found EVs lose value faster."
- **Status:** ✅ verified (AAA, 2026)
- **Source:** [AAA: New Vehicle Ownership Costs Hit $12,863 Annually](https://newsroom.aaa.com/2026/09/aaa-new-vehicle-ownership-costs-hit-12863-annually/), AAA Newsroom, 2026-09-15
- **Quote (tool):** "charging costs for EVs about 66%–70% lower than fuel costs for traditional gas vehicles" / "those savings were often outweighed by higher depreciation, fees and finance costs." / "EV medium sedans had about twice the depreciation of gas-powered models" / "gas-powered medium sedans cost $10,582 per year to own — $3,080 less than comparable EV medium sedans"
- **Source:** AAA 2026 brochure, p. 3 (pdf), total cost per year at 15k mi: Medium sedan "$13,662 $10,582 $10,204"; Compact SUV "$11,888 $11,656 $11,201"; Medium SUV "$14,332 $14,431 $13,698"; Pickup "$17,414 $16,626 $16,117" (Electric / Gas / Hybrid). Depreciation, compact SUV: "$5,298 $3,568 $3,845".
- **Note:** This is the biggest "it's not that simple" point, and it sits **outside** the approved angle (the plug). In the compact SUV segment (our pair's class), EV and gas total costs are almost level ($11,888 vs $11,656), and the EV is cheaper in medium SUVs. Hybrids are cheapest in all four. **Recommend:** don't open this in a 60 s Short. Add one line in the description ("Running costs only. AAA's 2026 study finds faster EV depreciation can offset the savings") so nobody can say we hid it. **Never say "an EV pays for itself"**.

## 19. Charging losses at home (the "10–15% you never see")

- **Script (expected, optional):** none recommended.
- **Status:** ✅ that losses exist (DOE) / 🟡 that EPA's kWh/100 mi already includes them. Fact-check: the (c)(8) paragraph quoted below covers plug-in hybrids, not BEVs, so it does not support the BEV claim; BEVs follow paragraph (a) / SAE J1634. Not used in the script
- **Source:** [Where the Energy Goes: Electric Cars](https://www.fueleconomy.gov/feg/atv-ev.shtml), fueleconomy.gov, undated
- **Quote (tool):** "energy is lost in converting alternating current (AC) from the electrical grid to direct current (DC)"; diagram labels: "Energy Lost in Charging the Battery (16%)" city, 10% highway.
- **Source:** [FOTW #1045: 77%-82% of Energy Put into an Electric Car is Used to Move the Car Down the Road](https://www.energy.gov/eere/vehicles/articles/fotw-1045-september-3-2018-77-82-energy-put-electric-car-used-move-car-down), DOE, 2018-09-03
- **Quote (tool):** "with an energy loss of about 16% from the wall power to the battery during charging."
- **Source:** [40 CFR § 600.116-12](https://www.law.cornell.edu/cfr/text/40/600.116-12), EPA fuel-economy test rule (Cornell LII copy of the eCFR), current text
- **Quote (tool):** (c)(8) "Measure and record AC watt-hours throughout the recharging procedure." / positioned "to account for any losses in the charging system."
- **Note:** **Important for our math:** the EPA rating is based on AC energy from the wall, so **charging losses are already inside 31 kWh/100 mi**. Don't add another 10–15% (that would double-count). The (c) paragraph text was returned by the tool, and I didn't confirm which vehicle types paragraph (c) covers, so 🟡 until the fact-checker reads it. A forum-level counterclaim exists (some say kWh/100 mi is battery-side): treat as unresolved but likely fine. Level 1 (120 V wall outlet) charging loses more than Level 2 (ADAC Germany found 12.7–24.2% on a household socket vs 5.1–7% on an 11 kW wallbox: snippet, European). **Viewer comment risk:** "you forgot charging losses". Answer: the EPA number includes them.

## 20. Gas prices swing, and the answer swings with them

- **Status:** ✅ (AAA: gas +31.8% vs 2025) / 🧮
- **Note:** At $4.15 gas, home charging saves ~10¢/mi and fast charging costs ~1.4¢/mi more (combined). At $3.50 gas (🎭 round number): gas 13.0¢. Home still saves ~7.3¢/mi, while fast charging costs ~3.7¢/mi more. The **home** conclusion is robust. The **fast-vs-gas** conclusion flips in cheap-charging states or with memberships. Keep "can" everywhere.

## 21. Home charger installation (an extra up-front cost)

- **Status:** ❌ for any dollar figure (only contractor and retailer estimates found: snippets $900–$3,500 all-in)
- **Note:** Many owners use a regular 120 V outlet (Level 1) with no install. Don't add an install cost to the gap in the voice. Optionally, in the description: "excludes home-charger installation, which varies".

---

## Myths (hook and comment material)

| Myth | What the evidence says | Status |
| --- | --- | --- |
| "An EV is always cheaper to run." | At home, yes by a lot (≈6¢ vs 15¢/mi). At the national-average fast charger, slightly more than gas (≈17¢) and clearly more on highway trips (≈18¢ vs 14¢). It flips by state and with memberships. | ✅ / 🧮 (claims 4, 7) |
| "Most people think EVs are cheaper to run." | Pew 2024: 36% say cheaper to charge, 28% say more expensive, 32% about the same. Americans are split. | ✅ (B) |
| "Fast chargers are just gouging." | Many pay demand charges set by their single biggest 15-minute spike, and the average fast charger was in use 15.9% of the time (Q3 2026), so fixed costs land on fewer sessions. NREL: "The main driver of cost is low utilization". | ✅ / 🟡 (claims 8–9) |
| "EPA numbers ignore charging losses, so add 15%." | The EPA test measures AC energy at the wall during recharging, "to account for any losses in the charging system." Losses are already in kWh/100 mi. | 🟡 (claim 19) |
| "EVs need no maintenance." | Less, not none: no oil, spark plugs or timing belt, and much less brake wear. But tires can wear faster and still cost money. AAA still finds EV maintenance + tires lower in all 4 segments it compared. | ✅ / 🟡 (claims 11–13) |
| "Regen means the brakes never wear." | Brake wear is "significantly reduced" (DOE). One modeling study: 64–95% less. Not zero. | ✅ (claim 12) |
| "Lower running costs mean an EV is cheaper to own." | AAA 2026: faster EV depreciation often outweighs fuel savings. Total cost is near-level for compact SUVs, the EV costs more for medium sedans, and hybrids are cheapest in all 4 segments. | ✅ (claim 18) |
| "Winter barely matters." | In the cold with the heater on, EV efficiency can drop ~39% (≈64% more kWh per mile). The temperature (likely 20°F) still needs confirming. | ✅ figure / 🟡 scope (claim 17) |

## Angles (2–3, with hook sentences)

- **A (approved, recommended): three plugs, one mile.** Hook: "An EV can cost less per mile than a gas car, or more. It comes down to which plug you use." Picture: one cut-open car at three "pumps" in a row (house outlet, fast charger, gas pump), each with a running cents-per-mile counter: 6¢, 17¢, 15¢.
- **B: the 15-minute spike.** Hook: "The most expensive electricity your EV can buy is at a fast charger, and a big part of the price comes from one 15-minute spike." (✅ claim 8.) Picture: the station's power line with a meter that latches on the month's highest needle and turns it into a dollar bill. Strong "secretly works" mechanism, but less about the viewer's wallet.
- **C: the catch-up clock.** Hook: "An electric car costs more to buy. Charge it at home, and it can earn that back in about three years. Charge it at fast chargers, and it may never." (🟡 claim 15.) Picture: a price-gap bar draining like a fuel gauge, fast at the house plug and barely moving at the fast charger.

**Alternative hooks inside angle A:**

1. "Same car, same mile: six cents, or seventeen. The only difference is where you plugged in." (🟡 because of the Paren price)
2. "On a road trip, a fast charger can cost more per mile than gas. Plug in at home overnight, and it's a fraction." (🟡 / 🎭 for "overnight")

## Visual notes for the director

- **Recurring object:** one generic compact electric SUV (no badge), cut open: battery floor, motor at the axle, brake discs visible. The gas twin is a ghost silhouette at the pump.
- **Orange = the hidden system** (house rule): the money/energy flow. Orange current from the house plug (thin, slow, cheap), from the fast charger (thick, fast, with a "spike meter" behind it), and orange heat at the brake pads only on the gas twin.
- **Cents-per-mile counters** tick per mile as the wheels roll forward (motion rule). Show 6¢ / 17¢ / 15¢ as small chips, not big dashboards. Round numbers only.
- **Demand charge beat:** a utility meter with a "max" needle that sticks at the highest point while cars come and go. The bill is the needle times a rate. Keep it to one image.
- **Maintenance beat (one quick beat):** oil drain plug with a cross (no oil), brake pads staying thick while the motor glows orange on lift-off, a tire tread wearing slightly faster ("can").
- **Catch-up beat:** a price-gap bar ($6,000) draining over a year counter: 3 years at the house plug vs a bar that barely moves at the fast charger (17).
- **Avoid:** brand logos, the network's name or colors on chargers, tax-credit stickers, and a "40% more energy in winter" card (wrong math; claim 17).

## Script-safe lines (✅ as worded; 🟡 noted)

1. "An EV can cost less per mile than a gas car, or more. It comes down to which plug you use." (🟡 → fine with "can")
2. "Some people swear an EV is cheaper to run. Others say it costs more. They can both be right." (✅ against Pew)
3. "Plugged in at home, at the average US rate, that's about six cents a mile." (🧮, EIA Aug 2026 + EPA)
4. "A gas version of the same SUV, at today's prices, is about fifteen cents a mile." (🧮, EIA 2026-11-02 + EPA)
5. 🟡 "At a public fast charger, at the national average price, it's about seventeen." (Paren via trade press)
6. 🟡 "On a road trip, a fast charger can cost more per mile than gas." (🧮 highway numbers)
7. "Many fast chargers pay a fee for their single biggest spike of the month, even if it lasted fifteen minutes." (✅ National Grid + NREL. Keep "many")
8. 🟡 "And the average fast charger sits unused most of the day." (15.9% utilization. Paren's definition is unchecked)
9. "There are no oil changes." / "Brake wear drops a lot, because the motor does much of the slowing." (✅ DOE)
10. 🟡 "But the extra weight can wear tires out sooner." (industry consensus, no number)
11. 🟡 "This pair costs about six thousand dollars more for the electric one." (MSRP, before incentives. Description must say so)
12. 🟡 "Charge mostly at home, and at fifteen thousand miles a year the savings cover that gap in about three years. Charge mostly at fast chargers, and it's closer to seventeen." (🧮 with stated assumptions)
13. 🟡 "In the cold, with the heater on, the government says an EV's efficiency can drop by more than a third." (39%, fueleconomy.gov; temperature scope to confirm; don't say "uses 40% more")

**Not script-safe:** "most people think EVs are always cheaper" (❌, Pew); "fast charging always costs more than gas" (❌); "an EV pays for itself" (❌, AAA depreciation); any fast-charger equipment or home-install dollar figure (❌); "uses 40% more energy in the cold" (❌ math); "add 15% for charging losses" (double-counts, claim 19); any national off-peak rate as fact (🎭 only); tax credits, incentives, tariffs, brand comparisons (out of scope).
