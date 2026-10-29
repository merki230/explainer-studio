# Sources: byd-price

Researcher draft, 2026-10-28. No script yet, so claims follow the agreed beat order (price gap → battery is the biggest part → Tesla buys cells, BYD makes them → Blade/cell-to-body → the widening beat → the trade-off → why US drivers see neither). Statuses are the researcher's starting confidence; the fact-checker sets the final ones.

Owner-agreed angle: one story, "BYD makes the car's parts itself." The battery is the worked example; one short beat widens to motor, power electronics, chips, ships. Ending: what the trade-off costs (LFP energy density, range), and why US drivers see neither the price nor the car. Working hook: "A BYD costs half a Tesla, and the biggest reason is a battery BYD builds itself." **Verdict on the hook is in section H: "half" survives only for one narrow pair, and the battery is not shown to be "the biggest reason". Read H before scripting.**

Everything was accessed on 2026-10-28 unless marked. **How to read the quotes** (same rules as `ev-charging/sources.md`):

- **(tool)** means the web tool's small model returned the quote from the page. Re-open and re-quote before ✅.
- **(snippet)** means seen only in a search-result summary; the page was not opened. Lead only (🟡 at best).
- **🧮** means our own calculation; inputs sourced, working shown in section P.
- **Company claim** = BYD's or Tesla's own statement. **Independent** = analyst, teardown firm, regulator, journalist's own finding.
- **Currency:** prices are Chinese list prices in yuan. Dollar figures are the source's own conversion unless marked 🧮. CnEVPost's 2026-10-01 conversion (235,500 yuan = $34,970) implies about 6.73 yuan per dollar; I use that rate for 🧮 conversions.
- **CLTC range:** Chinese range figures read about 35% higher than EPA (InsideEVs rule of thumb, `ev-charging` C3). Never say CLTC km as "miles" without the caveat.
- Could not open: iea.org (403), the UBS 2020 battery page (404), the ICCT 2019 PDF (403), apnews.com (blocked), cell.com full text of the Gorsch et al. 2025 paper (403), tesla.cn (no price in the returned text), the Kiel Institute policy brief PDF (used the Institute's press release on idw-online instead).

---

## Key facts in one screen

1. **Price gap in China (list prices, 2026):** Tesla Model 3 RWD **235,500 yuan ($34,970)**, unchanged as of 2026-10-01. BYD Seal 06 EV (about Model 3 size) **from 109,900 yuan** (about $16,100–16,500) = **47%** of the Model 3. But the like-for-like pairs are wider than "half": Seal 06 EV top trim 155,900 yuan (64 kWh, 630 km CLTC) = **66%**; Seal 07 EV (bigger, 69 kWh, 240 kW) 169,900 yuan = **72%**; the 2025 Seal (BYD's direct Model 3 rival) was 175,800 vs 231,900 yuan in Aug 2024 = **76%**.
2. **BYD's cheapest car vs the cheapest Tesla in China:** second-gen Seagull from **65,900 yuan ($9,810)** (2026-10-20) = **28%** of a Model 3 RWD. Different class (a 4.2 m city hatchback, 30–39 kWh).
3. **Independent teardown (UBS, Seal, 2023):** **75% of the Seal's parts made by BYD**, including the battery; the Seal is **15% cheaper to make** than a Shanghai-built Model 3 and about **35%** cheaper than a European-built VW ID.3. UBS put the gap "primarily" down to BYD's integration of components.
4. **Independent teardown (Caresoft, Seagull, 2024):** "Body panels, light clusters, motors, batteries, power electronics, and more are all made in-house, by BYD itself."
5. **Battery = biggest cost item:** S&P Global Mobility (2026-02): batteries are "30-40% of the total cost of an electric vehicle". BNEF (2025): BEV cells are about **80%** of pack price.
6. **Chemistry cost:** BNEF 2025 survey: LFP packs **$81/kWh** vs NMC **$128/kWh** (all segments, global average). China pack average **$84/kWh**; North America 44% higher.
7. **Tesla buys its cells:** Tesla's FY2025 10-K: "we rely on suppliers such as Panasonic and ... (CATL) for these cells"; Tesla intends "in the long term" to "supplement" them with its own cells. **No public share for Tesla's in-house (4680) cells found.** Tesla also makes its own **packs and drive units** and has its own structural-battery design, so the real contrast is the **cell**, not the whole battery.
8. **Same chemistry in China:** Tesla moved standard-range cars to LFP "globally" (2021), and the China-built Model 3 RWD uses CATL's LFP-family cells (media report, 2023). So in China, **both cars run on iron-phosphate cells; the difference is who makes them.**
9. **Trade-off:** LFP stores less energy for its weight, so less range per kWh (Electrek 2021; AP 2024; Gorsch et al. 2025 teardown: Tesla's 4680 "beat out BYD's in energy density").
10. **Other reasons, honestly:** scale (BYD 2.26 million BEVs in 2025 vs Tesla 1.64 million), price war (BYD cut up to 34% in May 2025), direct subsidies to BYD (Kiel: €2.1 bn in 2022, 3.5% of revenue), industry support (CSIS: $230.9 bn, 2009–2023, mostly buyer rebates and tax breaks that also apply to Tesla's China-built cars). Labor: both comparison cars are built in China.
11. **US:** the +100% Section 301 duty on Chinese EVs is still in the live US tariff schedule (USITC HTS 9903.91.03, accessed 2026-10-28); Commerce's connected-vehicle rule bans Chinese-linked software from MY2027. BYD sells no passenger cars in the US; it builds buses and trucks in Lancaster, CA. **No reliable estimate of a US price for an imported BYD exists** (❌).

---

## H. The hook: "A BYD costs half a Tesla, and the biggest reason is a battery BYD builds itself."

| Part | Evidence | Status |
|---|---|---|
| "A BYD costs half a Tesla" | True only for **base Seal 06 EV (109,900 yuan) vs base Model 3 RWD (235,500 yuan)** = 47%, in China, list prices, 2026. The Seal 06 base has a smaller battery (52.9 or 64.3 kWh; trim pairing not stated) and less range (530 km CLTC vs 606 km CLTC for the Model 3 RWD, 2024 figure). At matched range (630 km) it's 66%. BYD's closer rivals (Seal 07, the Seal) are 72–76%. "Half" is a cherry-pick unless scoped. | 🟡 only as "a BYD the size of a Model 3 starts at about half the price, in China" |
| "…and the biggest reason is a battery BYD builds itself" | **Not supported as worded.** No source isolates the battery as "the biggest reason" for the price gap. UBS says the cost edge is "primarily" BYD's **integration of components** (75% in-house, battery included), and puts the cost-to-make gap vs a Shanghai Model 3 at **15%**, not 50%. In China the Model 3 RWD also uses **LFP cells** (from CATL), so chemistry isn't the difference there; making the cell in-house is. | ❌ as worded; 🟡 as "analysts say the biggest reason is that BYD makes most of its parts, starting with the battery" |
| "half the price" vs "half the cost" | UBS's 15% (cost to make) vs the 47–76% list-price gaps: most of the retail gap is spec, pricing and margin, not proven manufacturing cost. Don't imply "half the cost to build". | — |

**Honest alternative hooks (recommended, pick one):**

- **A (closest to the agreed angle):** "In China, a BYD the size of a Tesla Model 3 starts at about half the price. Analysts who took one apart found BYD makes about three-quarters of its parts itself, starting with the battery." (✅ for each piece if scoped and attributed.)
- **B (the surprise, strongest):** "A Tesla built in China and a BYD run on the same kind of battery. Tesla buys its cells. BYD makes its own." (🟡 → ✅ once the CATL-LFP Model 3 RWD fact is confirmed from a Chinese MIIT filing or Tesla China spec page.) **Fact-checker, 2026-10-28: hook B stays 🟡, not ✅.** "Same kind of battery" (LFP) is well supported but only by secondary press for the current car; "Tesla buys its cells" is ✅ in general (10-K) but for the China-built car it rests on press reports naming CATL (claim 12). Neither Tesla's China spec page nor an MIIT entry naming the cell supplier could be opened. Safe as scripted only with an attribution or hedge ("Chinese auto press reports Tesla buys them from CATL"), or soften to "Tesla buys its cells from suppliers like Panasonic and CATL" (✅, claim 6) and drop the China-car-specific claim.
- **C (number-led):** "Three out of four parts in this BYD were made by BYD. Analysts say that's why it costs less to build than a Model 3." (✅ attributed to UBS; "less" = 15%.)

---

## 1. In China, a BYD the size of a Model 3 starts at about half the price

- **Script (expected):** "In China, a BYD the size of a Tesla Model 3 starts at about half the price."
- **Status:** 🟡 plausible (✅ for the two list prices; 🟡 for "the size of" as like-for-like)
- **Source:** [Tesla gives Model 3 minor upgrades in China, keeps prices unchanged](https://cnevpost.com/2026/10/01/tesla-gives-model-3-minor-upgrades-in-china/), Phate Zhang, CnEVPost, 2026-10-01 (accessed 2026-10-28)
- **Quote (tool):** "The Model 3 Rear-Wheel Drive still starts at 235,500 yuan ($34,970)." / "the Long Range Rear-Wheel Drive starts at 259,500 yuan." / Long Range AWD and Performance "start at 285,500 yuan and 339,500 yuan, respectively."
- **Source:** [BYD's new EV sedan is the size of a Tesla Model 3, half the price](https://electrek.co/byds-new-ev-sedan-size-of-tesla-model-3-half-the-price), Peter Johnson, Electrek, 2026-08-12 (accessed 2026-10-28)
- **Quote (tool):** "The new Seal 06 EV starts at 109,900 yuan ($16,500)." / "The Model 3 RWD starts at 235,500 yuan ($35,000)" / the car "is about the same size as the Tesla Model 3." / "second-generation Blade LFP batteries" / "a CLTC range of either 530 km (329 miles) or 630 km (391 miles)"
- **Source:** [The 2027 BYD Seal 06 launches in China…starting from 14,700 USD](https://carnewschina.com/2026/08/12/the-2027-byd-seal-06-launches-in-china-featuring-flash-charging-and-disus-c-starting-from-14700-usd/), Liu Miao, CarNewsChina, 2026-08-12 (accessed 2026-10-28)
- **Quote (tool):** "The EV models are priced between 109,900 yuan (16,100 USD) and 155,900 yuan (22,900 USD)." / "two LFP battery options for 52.868 kWh and 64.315 kWh" / "measures 4870mm in length, 1890mm in width, and 1495mm in height" / "The upgraded motor delivers a maximum power of 240 kW (322 hp)"
- **Note:** 109,900 ÷ 235,500 = **47%** 🧮. Top Seal 06 EV 155,900 ÷ 235,500 = **66%** 🧮. Caveats the script must respect: (1) China, list prices, 2026; (2) the base Seal 06 likely has the smaller battery and 530 km CLTC (the article doesn't pair trims to batteries); (3) the 240 kW figure is not tied to a trim; (4) the Model 3 is 4,720 mm long (not sourced here; Electrek's "about the same size" is the claim). Electrek's 2026-08-12 headline itself frames it as "half the price". **Fact-checker update (open items 2 and 3, 2026-10-28):** (a) **Trim pairing, resolved at the range level.** Chinese launch coverage lists the EV trims with CLTC range in the trim name: 530 km at 109,900 (Comfort), 119,900 (Smart), 129,900 (Premium); 630 km at 132,900 (Smart), 142,900 (Premium), 155,900 (Flagship) ([ifanr, 2026-08](https://www.ifanr.com/1674738) and [Autohome news, 2026-08](https://www.autohome.com.cn/news/202608/1316364.html), both (tool), both give "第二代刀片电池" and no kWh). So the **109,900 trim is the 530 km version.** Which battery (52.868 or 64.315 kWh) it carries is **not stated in anything I opened**; the 52.9 kWh pairing is an inference from the two lists being in the same order (elektroquatsch, CarNewsChina and Digital Trends list the packs and ranges without pairing them). Don't state a kWh for the base trim. (b) **Model 3 RWD range is now 634 km CLTC, not 606 km**: CarNewsChina 2025-01-10 (claim 12) reports 606 → 634 km at 235,500 yuan; a Chinese review dated 2026-08-08 (search result, not opened) still lists 235,500 yuan and 634 km for the 2026 model. I found no Tesla China page to confirm. So the matched-range pair is Seal 06 EV 630 km at 132,900 yuan (13,290 万) vs Model 3 RWD 634 km at 235,500 = **56%** 🧮, not the 66% above (66% is the top Flagship trim; 630 km starts at 132,900). The base 109,900 trim has 104 km less range (530 vs 634 km CLTC). Electrek's Model 3 range figure (606 km CLTC) is from 2024 (claim 2). **Don't say "half a Tesla" without "the size of a Model 3" and "starts at".** "Half the price" ≠ half the cost to make (claim 8).

## 2. Closer rivals are about a quarter cheaper, not half

- **Script (optional, for honesty):** "Its closest rivals cost about a quarter less."
- **Status:** ✅ (tool) for the prices; 🧮 for the ratios
- **Source:** [BYD launches Seal 07 EV and updated Sealion 06 EV…](https://cnevpost.com/2026/03/06/byd-launches-seal-07-ev-updated-sealion-06-ev/), Lei Kang, CnEVPost, 2026-03-06 (accessed 2026-10-28)
- **Quote (tool):** "starting prices of 169,900 yuan ($24,600) and 189,900 yuan" / "equipped with a 69-kWh battery pack" / "a 240-kW single motor" / "measures 4,995 mm in length, 1,910 mm in width, and 1,495 mm in height"
- **Source:** [BYD undercuts Tesla Model 3 prices by nearly $10K with new Seal EV](https://electrek.co/2024/08/08/byd-undercuts-tesla-model-3-prices-8k-new-seal-ev), Peter Johnson, Electrek, 2024-08-08 (accessed 2026-10-28)
- **Quote (tool):** the 2025 Seal EV "will start at 175,800 yuan, or about $24,500" / the Model 3 "starts at 231,900 yuan, or around $32,300" / Seal "up to 317 miles (510 km) CLTC range" / Model 3 RWD "rated with up to 377 miles (606 km) range in China"
- **Note:** Seal 07 EV ÷ Model 3 RWD (2026) = 169,900 ÷ 235,500 = **72%** 🧮 (bigger car, more battery). 2025 Seal ÷ Model 3 (Aug 2024) = 175,800 ÷ 231,900 = **76%** 🧮. These are the like-for-like pairs; they are what a sceptical commenter will post.

## 3. BYD's cheapest car vs the cheapest Tesla

- **Script (expected):** "BYD's cheapest car, the Seagull, costs less than a third of the cheapest Tesla in China, but it's a much smaller car."
- **Status:** ✅ (tool) as scoped
- **Source:** [BYD launches larger second-gen Seagull from $9,810, adds flash charging](https://cnevpost.com/2026/10/20/byd-launches-second-gen-seagull/), Lei Kang, CnEVPost, 2026-10-20 (accessed 2026-10-28)
- **Quote (tool):** "65,900 yuan ($9,810) to 99,900 yuan" / "a 30.1-kWh battery pack" (entry) and "a 39.2-kWh battery pack" / "a CLTC range of 320 km" (entry) / "measuring 4,205 mm in length, 1,810 mm in width and 1,570 mm in height"
- **Source (earlier model and price-war context):** [Chinese EV stocks tumble after BYD slashes prices as much as 34%](https://fortune.com/asia/2025/05/26/chinese-ev-stocks-tumble-after-byd-slashes-prices-as-much-as-34), Danny Lee and Bloomberg, Fortune, 2025-05-26 (accessed 2026-10-28)
- **Quote (tool):** the Seagull was cut to "55,800 yuan ($7,780)" / "discounts on 22 of its electric and plug-in hybrid models"
- **Note:** 65,900 ÷ 235,500 = **28%** 🧮 ("less than a third"). The cheapest Tesla in China is the Model 3 RWD (claim 1); Tesla said on 2026-03-27 it "has no plans to introduce a cheaper version of the Model 3 to the Chinese market" (CnEVPost tag page summary, tool; article not opened). Battery chemistry of the second-gen Seagull is not stated in the article (the first-gen was LFP per AP, claim 9). **US comparison (optional):** the cheapest US Tesla, Model 3 Standard, "costs $38,630 with the $1,390 destination fee and $250 order fee both included" ([Motor1, Chris Perkins, 2025-10-07](https://www.motor1.com/news/775005/tesla-model-3-standard/), tool); base $36,990 (several outlets, snippet).

## 4. The battery is the most expensive part of an EV

- **Script (expected):** "The battery is the most expensive part of an electric car, around a third of what it costs to build."
- **Status:** ✅ (tool) as attributed to analysts; 🟡 for "a third" (sources say 30–40%; older ones 25–40%)
- **Source:** [Lithium-ion battery price 2025 — Trends and forecast](https://autotechinsight.spglobal.com/shop/product/5003692/lithium-ion-battery-price-2025-trends-and-forecast), S&P Global Mobility (AutoTechInsight), 2026-02-17 (accessed 2026-10-28)
- **Quote (tool):** "EV batteries account for 30-40% of the total cost of an electric vehicle."
- **Source:** [How can China make EVs that sell for less than $20,000?](https://www.marketplace.org/story/2024/09/09/how-can-china-make-evs-that-sell-for-less-than-20000/), Jennifer Pak, Marketplace, 2024-09-09 (accessed 2026-10-28)
- **Quote (tool):** Bill Russo (Automobility): "If you can control and scale the most expensive component of an electric vehicle" / "Vertical integration means you are your own supplier of the critical ingredients that go into the electric vehicle cake"
- **Note:** The share falls as packs get cheaper and depends on pack size. Goldman Sachs (2022, snippet): "30% portion of the price of a mass-market electric vehicle", falling to "15-20%" in 2030–2040. Benchmark data via Visual Capitalist (2024, snippet): 16–32% by model. Script-safe: "the battery is the single most expensive part" (✅) and "analysts put it at about a third of the cost" (🟡, hedge kept). 🧮 cross-check in P2: a 64 kWh LFP pack at 2025 average prices ≈ $5,200–5,400, about a quarter of a top Seal 06 EV's $22,900 sticker.

## 5. Most of a battery's cost is the cells

- **Script (optional):** "And most of that is the cells inside."
- **Status:** 🟡 (BNEF figure via a trade outlet; BNEF's own release doesn't give cell figures)
- **Source:** [BloombergNEF: Lithium-ion battery pack prices drop worldwide…](https://www.evinfrastructurenews.com/ev-technology/bloomberg-nef-lithium-ion-battery-pack-prices-drop-worldwide-ev-applications-hit-by-higher-materials-cost), Molly Green, EV Infrastructure & Energy News, 2025-12-10 (accessed 2026-10-28)
- **Quote (tool):** "the cost of BEV cells was $79/kWh, which represented 80% of the total pack price."
- **Note:** Attributed to BNEF's 2025 survey (paywalled). ICCT (2019 PDF, 403, snippet only): "typical cell-level costs making up from 70% to 76% of pack-level cost". Consistent. This is why "who makes the cell" matters more than "who assembles the pack".

## 6. Tesla buys its battery cells from suppliers

- **Script (expected):** "Tesla buys most of its battery cells from suppliers like Panasonic and CATL."
- **Status:** ✅ (tool) for "relies on suppliers such as Panasonic and CATL" (Tesla's own filing); 🟡 for "most" (Tesla gives no split)
- **Source:** [Tesla, Inc. Form 10-K for fiscal year 2025](https://www.sec.gov/Archives/edgar/data/1318605/000162828026003952/tsla-20251231.htm), Tesla / SEC EDGAR, filed 2026-01-29 (accessed 2026-10-28)
- **Quote (tool):** "Currently, we rely on suppliers such as Panasonic and Contemporary Amperex Technology Co. Limited (CATL) for these cells." / "In the long term, we intend to supplement cells from our suppliers with cells manufactured by us" / "We have developed close relationships with key partners that supply battery cells" / "we have developed a new proprietary lithium-ion battery cell" / "import tariffs by the US government and the provisions of the OBBBA could significantly increase battery cell expenses"
- **Note:** "Supplement … with cells manufactured by us" supports "most cells come from suppliers" in spirit; no 4680 share was found anywhere (searched 10-K, earnings coverage, forums). **❌ for any number** on Tesla's in-house share. LG Energy Solution is a widely reported Tesla supplier (Shanghai, 2022–2023 reports, snippet) but is not named in the 10-K sentence; say "suppliers like Panasonic and CATL". Company statement (Tesla's own filing).

## 7. Tesla also makes its own packs and motors (keep the contrast honest)

- **Script (implicit):** the contrast must be "Tesla buys the cells", not "Tesla buys the battery" or "Tesla buys its parts".
- **Status:** ✅ (tool), Tesla's own filing
- **Source:** Tesla FY2025 10-K (claim 6)
- **Quote (tool):** "We also produce several vehicle components at our Gigafactories, such as battery modules and packs and drive units" / "vertically integrated business model" / "our in-house lithium refinery in Texas" / "developed a method to integrate batteries directly with vehicle body structures without separate battery packs" / "our own in-house, custom designed inference chips"
- **Note:** Tesla calls itself vertically integrated, makes packs and drive units (motors), designs its own self-driving chip and has a structural battery design. **So "BYD builds the pack into the floor" is not unique to BYD**, and "BYD makes its own motor" is not a contrast with Tesla. The clean, true contrast is the **cell** (and, less clearly, power chips and most smaller parts).

## 8. Analysts who tore down a BYD Seal: 75% of parts made by BYD; 15% cheaper to make than a Shanghai Model 3

- **Script (expected):** "When analysts at UBS took apart a BYD Seal, they found BYD had made about three-quarters of its parts, battery included."
- **Status:** ✅ (tool) as attributed to UBS (independent analyst teardown, 2023)
- **Source:** [BYD Seal Has 35% Cost Edge Over European EVs, UBS Report Says](https://yicaiglobal.com/news/chinas-byd-seal-has-25-cost-advantage-over-european-north-american-evs-ubs-report-shows), Zhang Yushuo, Yicai Global, 2023-09-06 (accessed 2026-10-28)
- **Quote (tool):** "Seventy-five percent of the Seal's components, including the battery, are produced by Shenzhen-based BYD." / "15 percent cheaper to make than the Tesla Model 3" / "BYD's vertically integrated component system and advanced technology" / outside suppliers include "some Qualcomm auto chips."
- **Source:** [BYD's manufacturing costs in EU could be 25% lower than rivals: UBS](https://technode.com/2023/09/06/byds-manufacturing-costs-in-eu-could-be-25-lower-than-rivals-ubs/), Jill Shen, TechNode, 2023-09-06 (accessed 2026-10-28)
- **Quote (tool):** "75% of the auto parts" made in-house, "ranging from batteries to power semiconductors" / the Seal is "15% more cost-efficient than locally made offerings by the US automaker" / "$10,500 less to produce" than a European-built VW ID.3 / UBS attributed the gap "primarily to BYD's technological and engineering integration of vehicle components."
- **Note:** UBS's report itself is not public; both outlets relay it. The teardown car was a 2022–2023 Seal; figures are 2023. **Key honesty point:** UBS's cost-to-make gap vs Tesla is 15%, and the Model 3 compared is built in Shanghai (same labor market, same supply base). So the retail "half" in claim 1 is mostly spec and pricing, not proven cost. Bloomberg's UBS video (2023-09-19) exists but wasn't opened. A BYD "over 70% of parts" figure circulates as a company claim on explainer sites (snippet, ❌ as BYD's own words). Lumafield and Zerodha's "about 75%" (snippet) likely echo UBS.

## 9. Caresoft's Seagull teardown: almost nothing outsourced

- **Script (expected, widening beat):** "Engineers who tore down BYD's cheapest car found the motors, the power electronics, even the body panels and lights, all made by BYD."
- **Status:** ✅ (tool), independent teardown firm (Caresoft Global), relayed by InsideEVs and AP
- **Source:** [American Test Of $11,500 BYD Seagull: 'This Doesn't Come Across Cheap'](https://insideevs.com/news/710364/byd-detroit-import-seagull-caresoft/), Kevin Williams, InsideEVs, 2024-02-27 (accessed 2026-10-28)
- **Quote (tool):** "Not much, if anything, on the Seagull is outsourced to a third-party supplier." / "Body panels, light clusters, motors, batteries, power electronics, and more are all made in-house, by BYD itself." / "This imported Seagull wasn't made to pass U.S. crash standards."
- **Source:** [Small, well-built Chinese EV called the Seagull poses a big threat to the US auto industry](https://fox5sandiego.com/news/business/ap-small-well-built-chinese-ev-called-the-seagull-poses-a-big-threat-to-the-us-auto-industry/amp/), Tom Krisher and Ken Moritsugu, Associated Press (via FOX 5 San Diego), 2024 (page shows "2 years ago"; photo dated 2024-04-10; apnews.com blocked) (accessed 2026-10-28)
- **Quote (tool):** "By having that all in-house and vertically integrated, there's an incredible advantage that they have," (Terry Woychowski, Caresoft) / "Higher U.S. labor costs are a part of the equation." / US safety compliance would "add a couple thousand dollars to the cost." / its lithium iron phosphate batteries have lower range than most current lithium-ion batteries (tool paraphrase of AP).
- **Note:** **No Caresoft dollar-level cost breakdown is public** (Autoline commenters were still waiting for it, snippet). So the teardown supports "BYD makes almost everything" but gives **no number** for how much that saves. ❌ for any Caresoft cost figure.

## 10. BYD makes its own iron-phosphate (LFP) "Blade" cells, and the pack is part of the car's floor

- **Script (expected):** "BYD makes its own cells, long flat iron-phosphate 'blades', and in cars like the Seal the battery's lid is the floor of the car."
- **Status:** ✅ (tool) as BYD's description (company claim)
- **Source:** [BYD SEAL arrives in Europe Setting the Standard in Breakthrough Technology and Stunning Design](https://www.byd.com/us/news-list/BYD-SEAL-arrives-in-Europe-Setting-the-Standard-in-Breakthrough-Technology-and-Stunning-Design.html), BYD, 2023-09-01 (accessed 2026-10-28)
- **Quote (tool):** "Cell-to-Body means the battery is incorporated within the entire vehicle structure." / "It integrates the battery pack's top cover with the traditional body floor structure." / "The CTB battery system serves as a source of energy, as well as a structural component." / the Blade Battery uses "lithium iron-phosphate (LFP) as a cathode material." / "The Blade Battery was developed in-house by BYD" / "torsional stiffness of a massive 40,500 Nm/degree."
- **Source (independent, cell design):** [Teardown Reveals Secrets of Electric Vehicle Battery Designs](https://chenected.aiche.org/2025/05/teardown-reveals-secrets-electric-vehicle-battery-designs), Stephanie Pappas, AIChE ChEnected, 2025-05-23, reporting Gorsch et al., *Cell Reports Physical Science*, doi:10.1016/j.xcrp.2025.102453, 2025-03-06 (RWTH Aachen / Fraunhofer FFB) (accessed 2026-10-28)
- **Quote (tool):** BYD Blade: prismatic, stacked electrodes, "lithium iron phosphate" chemistry; Tesla 4680: cylindrical, tabless, NMC811 (tool paraphrase); Tesla's battery "beat out BYD's in energy density."
- **Note:** Who makes the cells: the Caresoft (claim 9) and UBS (claim 8) teardowns both say the battery is BYD's own (independent). BYD's battery maker is its subsidiary FinDreams Battery (Substack/explainer, snippet; not needed in voice). Second-gen Blade (2026) is still LFP-family per BYD/press (`ev-charging` B2: "Still LFP chemistry", 🟡); some outlets say the long Blade 2.0 is LMFP (manganese-doped), snippet. Script-safe: "iron-phosphate cells". **Visual:** cells laid edge-to-edge across the floor, the pack lid doubling as the cabin floor (sandwich: lid, blades, tray). Don't say BYD is the only maker that builds the battery into the body: Tesla's 10-K describes the same idea (claim 7).

## 11. Iron-phosphate packs cost much less per kWh than nickel ones

- **Script (expected):** "Iron-phosphate packs cost about a third less per kilowatt-hour than nickel-based ones."
- **Status:** ✅ (tool) for BNEF's averages
- **Source:** [Lithium-Ion Battery Pack Prices Fall to $108 per Kilowatt-Hour, Despite Rising Metal Prices: BloombergNEF](https://about.bnef.com/insights/clean-transport/lithium-ion-battery-pack-prices-fall-to-108-per-kilowatt-hour-despite-rising-metal-prices-bloombergnef/), BloombergNEF, 2025-12-09 (accessed 2026-10-28)
- **Quote (tool):** "Average LFP battery pack prices across all segments came in at $81/kWh" while "nickel manganese cobalt (NMC) packs were at $128/kWh" / "lithium-ion battery pack prices have dropped 8% since 2024 to a record low of $108 per kilowatt-hour" / "Battery electric vehicles (BEVs) packs were the cheapest in the transport segment at $99/kWh" / "Average battery pack prices were lowest in China, at $84/kWh." / "Pack prices in the North America and Europe were 44% and 56% higher."
- **Source (IEA, secondary):** [Global Lithium-Ion Battery Market Surpassed $150 Billion in 2025: IEA](https://www.mercomindia.com/global-lithium-ion-battery-market-surpassed-150-billion-in-2025-iea), Melvin Mathew, Mercom, 2026-02-20 (accessed 2026-10-28)
- **Quote (tool):** "LFP batteries were on average more than 40% cheaper than NMC alternatives." / "LFP accounted for over half of EV batteries" / "Battery pack prices in China were 30% lower than in the U.S. and 35% lower than in Europe."
- **Note:** $81 ÷ $128 = 63%, i.e. LFP about **37% cheaper** per kWh 🧮 (BNEF, all segments incl. storage, global, 2025). IEA (via Mercom; iea.org 403): "more than 40% cheaper". Script-safe: "about a third cheaper per kilowatt-hour" or "roughly 40 percent cheaper, the IEA says". **But this is a chemistry gap, not a BYD-vs-Tesla gap in China** (claim 12).

## 12. In China, the Tesla runs on iron-phosphate cells too, bought from CATL

- **Script (possible twist):** "The Model 3 built in China uses iron-phosphate cells too. Tesla buys them."
- **Status:** 🟡 plausible (fact-checked 2026-10-28: LFP chemistry well supported by MIIT-linked 2020 report, Tesla's 2021 statement and 2025 press; CATL as supplier is repeated press reporting 2020–2025, no Tesla/MIIT/CATL primary confirmation found; see update below)
- **Source:** [Tesla moving Model 3 Standard Range to LFP cells…](https://electrek.co/2021/10/21/tesla-moving-model-3-standard-range-to-lfp-cells-fremont-cell-production-closer/), Fred Lambert, Electrek, 2021-10-21 (accessed 2026-10-28)
- **Quote (tool, Tesla Q3 2021 shareholder deck as quoted):** "For standard range vehicles, we are shifting to Lithium Iron Phosphate (LFP) battery chemistry globally."
- **Source:** [Tesla to equip revamped Model 3 in China with CATL's new battery, report says](https://cnevpost.com/2023/06/29/tesla-to-equip-revamped-model-3-catl-m3p-battery-report/), Phate Zhang, CnEVPost, 2023-06-29 (accessed 2026-10-28)
- **Quote (tool):** "the rear-wheel drive base model will use CATL's new M3P lithium iron phosphate battery" / capacity "from 60 kWh to 66kWh." (attributed to "local media 36kr", "industry chain sources")
- **Fact-checker update, 2026-10-28 (open item 1). Final status: 🟡 plausible. Not ✅.** Opened and quoted (all (tool) quotes; re-quote before use):
  - [Specs of upgraded Tesla Model 3 revealed by Chinese regulator](https://carnewschina.com/2023/09/12/specs-of-upgraded-tesla-model-3-revealed-by-chinese-regulator/), Jiri Opletal, CarNewsChina, 2023-09-12: "The RWD single-motor variant will be equipped with an LFP battery from CATL". Headline says the specs come from the regulator (MIIT), but the sentence itself carries no filing attribution.
  - [New Tesla Model 3 Emerges In Regulatory Filing In China](https://insideevs.com/news/686350/new-tesla-model3-regulatory-filing-china/), Mark Kane, InsideEVs, 2023-09-12: "the entry-level version is powered by batteries supplied by CATL (LFP type, we assume)". So the MIIT-filing report names CATL as supplier; **LFP is InsideEVs' own assumption**, not the filing's.
  - [Tesla Model 3 price increased by 490 USD in China, added 28 km range](https://carnewschina.com/2025/01/10/tesla-model-3-price-increased-by-490-usd-in-China-added-28-km-range/), Denis Bobylev, CarNewsChina, 2025-01-10: "a new 62.5 kWh LFP battery", 634 km CLTC (up from 606 km), supplier CATL, trim priced 235,500 yuan. No source attributed for the battery detail.
  - [Tesla to launch new Model 3 variant with updated battery and longer range in China](https://carnewschina.com/2025/07/16/tesla-to-launch-new-model-3-variant-with-updated-battery-and-longer-range-in-china/), Jiri Opletal, CarNewsChina, 2025-07-16: standard RWD uses "a lithium-iron phosphate (LFP) battery from CATL, which has a 62.5 kWh capacity". The article does not attribute the specs; the regulator is credited only for the Model 3+ images. The new Long Range RWD (Model 3+) uses an LG NMC pack (search summary, not opened), so "the Model 3 RWD" must mean the **base** RWD.
  - [Tesla permitted to produce LFP battery-powered Model 3 in China](https://autonews.gasgoo.com/articles/ev/tesla-permitted-to-produce-lfp-battery-powered-model-3-in-china-70017246), Gasgoo, 2020-06-12: a catalogue "issued by China's Ministry of Industry and Information Technology (MIIT)" shows the approved Model 3 uses "lithium iron phosphate (LFP) batteries"; Ping An Securities said CATL "will serve as the battery supplier to Tesla's China-built Model 3s fitted with LFP batteries" (an analyst's view, not confirmation). This is the strongest regulatory-linked item: LFP in an MIIT catalogue entry, 2020, for the Standard Range car.
  - **Could not get:** Tesla's own China spec page (tesla.cn/model3 returned only the title; no spec text); the MIIT catalogue itself (no direct entry found or opened); any Tesla statement naming CATL for the China-built Model 3 (Tesla's 10-K names CATL as a cell supplier in general, claim 6, not for this car). A Chinese search summary (not opened) says MIIT files do **not** name the cell supplier, which fits InsideEVs' wording.
  - **Verdict by part:** (a) China-built base Model 3 RWD uses LFP cells: strong and consistent from 2020 (MIIT via Gasgoo) through 2025 (CarNewsChina), plus Tesla's own 2021 "LFP globally" statement for standard range; still secondary press for the current car. (b) The supplier is CATL: 🟡, repeated in press since 2020, never confirmed by Tesla or CATL in anything I opened. (c) Tesla buys cells (rather than making them): Tesla's 10-K, ✅ in general (claim 6); that it buys these specific cells rests on (b).
  - **Hedged wording that is safe:** "Tesla's China-built Model 3 uses iron-phosphate cells that, according to Chinese auto press, come from CATL." Without "according to…", it stays 🟡.
- **Note (researcher, kept):** This is the strongest, least-known fact in the file and it **undercuts the working hook's chemistry framing**: in the China price pair (claim 1), both cars use iron-phosphate cells; one maker builds them, the other buys them. ~~To reach ✅: find Tesla China's spec page or the MIIT catalogue entry for the current Model 3 RWD cell supplier.~~ (Tried; not reachable, see update above.) Side lead (❌ for script): BYD reportedly supplied Blade packs to Tesla's Berlin plant for some Model Ys from 2022–2023 (CarNewsChina, Electrek 2022, snippet); **never confirmed by either company**.

## 13. The widening beat: chips and power electronics

- **Script (expected):** "BYD even makes the power chips that run its motors."
- **Status:** ✅ (tool) for BYD-designed SiC module in the Han and BYD MCUs across its lineup (2021); 🟡 for "every BYD today"
- **Source:** [BYD to spin off semiconductor business for A-share listing](https://cnevpost.com/2021/05/12/byd-to-spin-off-semiconductor-business-for-a-share-listing/), Phate Zhang, CnEVPost, 2021-05-12 (accessed 2026-10-28)
- **Quote (tool):** "a complete automotive IGBT industry chain including design, manufacturing, packaging and vehicle application" / "The first SiC power module developed by its in-house has been applied to BYD's new flagship luxury sedan Han model." / "BYD Semiconductor's automotive-grade MCU has been loaded in batch on BYD's full range of models." / "BYD directly holds 72.3 percent of the shares"
- **Note:** 2021 data. TechNode (claim 8) confirms UBS saw in-house "power semiconductors" in the 2023 Seal: that is the independent anchor. Exceptions exist: UBS noted "some Qualcomm auto chips" (claim 8). Script-safe: "BYD makes the power chips that drive its motors" (✅ via UBS/TechNode); avoid "all its chips". BYD's own site says it masters "电池、电机、电控" (battery, motor, electronic control) core tech ([BYD Innovation page](https://www.bydglobal.com/en/InnovationByd.html), undated, tool), company claim.

## 14. The widening beat: car-carrier ships

- **Script (expected):** "It even runs its own fleet of car-carrier ships."
- **Status:** ✅ (tool) for "runs a fleet of eight"; 🟡 for "owns" (at least one is chartered)
- **Source:** [BYD completed its massive fleet, now able to export 1 million cars a year](https://carnewschina.com/2025/10/02/byd-completed-its-massive-fleet-now-able-to-export-1-million-cars-a-year-but-not-just-from-china/), Jiri Opletal, CarNewsChina, 2025-10-02 (accessed 2026-10-28)
- **Quote (tool):** "completed its massive fleet of eight vessels and reached an annual transport capacity of over 1 million cars" / "BYD ships have a capacity of 7,200 or 9,000 cars based on the type of vessel."
- **Source:** [BYD Shenzhen, world's largest car carrier, ready for operation](https://cnevpost.com/2025/01/17/byd-shenzhen-car-carrier-ready-operation/), Phate Zhang, CnEVPost, 2025-01-17 (accessed 2026-10-28)
- **Quote (tool):** "with a capacity of 9,200 vehicles" / BYD Explorer No.1 "was chartered to BYD by another owner." / "The report did not mention the ship's owner, though it appears to be Shenzhen-based BYD."
- **Note:** Say "runs its own fleet" or "ships its cars on its own fleet", not "owns". Capacity figures vary (7,000 / 7,200 / 9,000 / 9,200).

## 15. Seats: NOT BYD-made (cut from the widening beat)

- **Script (brief suggested "seats"):** "BYD makes the seats" — **do not use.**
- **Status:** ❌ unsupported (the evidence says otherwise)
- **Source:** [BYD, French auto parts maker Forvia open seat plant in Thailand](https://cnevpost.com/2024/07/23/byd-forvia-open-seat-plant-thailand/), Lei Kang, CnEVPost, 2024-07-23 (accessed 2026-10-28)
- **Quote (tool):** "BYD and Faurecia established Shenzhen Faurecia Automotive Parts Co Ltd, which is majority-owned by the latter." / the plant "will produce automotive seats for BYD's Thailand plant"
- **Note:** BYD's seats come (at least in part) from a joint venture majority-owned by Forvia, a French supplier. Gasgoo reports a 70/30 Faurecia/BYD split (snippet). No source shows BYD making its own seats. Swap in "body panels and lights" (Caresoft, claim 9) instead.

## 16. The trade-off: iron-phosphate stores less energy, so less range per pound

- **Script (expected):** "The catch: iron-phosphate cells hold less energy for their weight, so the same size battery goes less far."
- **Status:** ✅ (tool) qualitatively; ❌ for any Wh/kg number in voice (sources disagree)
- **Source:** Electrek, Fred Lambert, 2021-10-21 (claim 12)
- **Quote (tool, paraphrase by the tool):** LFP batteries are cheaper and safer but store less energy for their size, which reduces efficiency and range.
- **Source:** AP via FOX 5 (claim 9): BYD's lithium iron phosphate batteries "have lower range than most current lithium-ion batteries" (tool paraphrase).
- **Source:** AIChE ChEnected on Gorsch et al. 2025 (claim 10): Tesla's 4680 (NMC811) "beat out BYD's in energy density."
- **Note:** Wh/kg figures vary by source and by cell vs pack (LFP cell ~90–205, NMC ~150–300 Wh/kg in trade tables, snippet; BYD says the long Blade 2.0 reaches 190–210 Wh/kg, CarNewsChina 2026-03-10 headline, snippet). BYD's answer is packing: the Blade layout raised pack space use "by over 50%" vs older LFP packs (2020 launch claim, snippet). Range in the China pair is close anyway (Seal 06 top 630 km vs Model 3 RWD 606 km CLTC) because BYD fits more kWh; say "less range per pound", not "less range". Also a real trade-off: the 2026 Blade pack is hard to repair (8-hour teardown, heavy adhesive; [InsideEVs, Rob Stumpf, "May 18", 2026 per linked source](https://insideevs.com:443/news/796219/byd-blade-battery-teardown-results/), tool).

## 17. Other cost reasons (one honest line)

- **Script (expected):** "Scale, a price war and state support help too."
- **Status:** ✅ (tool) for each fact below; 🟡 for how much each one explains (no source splits the gap)
- **Scale:** [Tesla loses BEV crown to BYD in 2025…](https://cnevpost.com/2026/01/02/tesla-q4-2025-global-deliveries/), CnEVPost, 2026-01-02 (search summary; Tesla "about 1.64 million" in 2025, BYD about 2.26 million BEVs; **snippet, not opened**, 🟡). **Fact-checker update 2026-10-28 (open item 4): opened, now ✅ (tool).** Phate Zhang, CnEVPost, 2026-01-02: BYD's full-year 2025 BEV sales "reached 2,256,714 units", surpassing "Tesla's 1,636,129 units for the first time"; PHEV sales 2,288,709. Wording: "BYD sold about 2.26 million fully electric cars in 2025, Tesla about 1.64 million" (BEV only, global, deliveries). The article does not state BYD's 4.6 million total (that figure is not verified here; leave it out). BYD's 4.6 million total includes plug-in hybrids; don't compare it with Tesla's BEV-only count.
- **Price war:** Fortune/Bloomberg 2025-05-26 (claim 3): cuts "of as much as 34%" on 22 models; dealer stock at "3.5 million cars, or 57 inventory days" (tool paraphrase).
- **Direct subsidies to BYD:** [Kiel Institute press release](https://idw-online.de/de/news831597), Kiel Institute for the World Economy via idw, 2024-04-10 (accessed 2026-10-28). Quote (tool): "Direct subsidies amounted to approximately EUR 220 million in 2020, rising to EUR 2.1 billion in 2022." / "In terms of business revenues, direct subsidies increased from 1.1 percent in 2020 to 3.5 percent in 2022." / "BYD benefits from subsidies to battery producers through lower input prices" / "BYD receives significantly more purchase premiums for electric cars in China compared to other domestic manufacturers" (and, per the release, foreign makers producing locally such as Tesla) / "the figures clearly understate the true scale and scope of green technology subsidies in China". Kiel Policy Brief No. 173, "Foul Play?" (PDF not opened).
- **Industry-wide support:** [The Chinese EV Dilemma: Subsidized Yet Striking](https://www.csis.org/blogs/trustee-china-hand/chinese-ev-dilemma-subsidized-yet-striking), Scott Kennedy, CSIS, 2024-06-20 (revised 2024-06-28) (accessed 2026-10-28). Quote (tool): "From 2009 to 2023, we calculate that Chinese government support cumulatively totaled $230.9 billion." / "The buyer's rebate and sales tax exemption have accounted for the vast majority of support for the industry." / "the average support per vehicle has fallen from $13,860 in 2018 to just under $4,800 in 2023" / "these data still constitute a conservative estimate".
- **Buyer tax break now halved, applies to Tesla too:** [China further reduces tax incentives for EVs](https://www.electrive.com/2026/09/04/china-further-reduces-tax-incentives-for-evs/), Jasmin Apitzsch-Krause, electrive, 2026-09-04 (accessed 2026-10-28). Quote (tool): EVs "have been subject to a purchase tax reduction of 50 per cent instead of a full exemption" / "The effective tax rate is thus five per cent, with the relief capped at 15,000 yuan per vehicle."
- **Labor:** AP 2024 (claim 9): "Higher U.S. labor costs are a part of the equation." In the China price pair, **both cars are built in China** (Model 3 in Shanghai, claim 8), so labor doesn't explain the BYD-vs-Tesla gap there; it does explain part of the gap vs US-built cars. No current, sourced per-hour comparison found (only a 2017 Automotive News China figure, snippet, ❌).
- **Note (politically sensitive):** facts only, no framing. Script-safe single line: "Scale, a price war and government support help too." If subsidies are named, attribute: "a German institute counted about two billion euros of direct subsidies to BYD in 2022" (✅). Don't say "subsidies explain the price" or "BYD sells at a loss" (no source).

## 18. US drivers can't buy one: tariff, software rule, no dealers

- **Script (expected):** "In the US, you won't see the price or the car: Chinese-built EVs face a 100 percent tariff, and a federal rule bans their connected-car software from 2027 models."
- **Status:** ✅ tariff (now confirmed in the live tariff schedule); ✅ rule; 🟡 "BYD sells no passenger cars in the US" (secondary sources only, but consistent)
- **Source:** [FACT SHEET: President Biden Takes Action…](https://bidenwhitehouse.archives.gov/briefing-room/statements-releases/2024/05/14/fact-sheet-president-biden-takes-action-to-protect-american-workers-and-businesses-from-chinas-unfair-trade-practices/), The White House (archived), 2024-05-14 (reused from `ev-charging` U1, accessed 2026-10-27)
- **Quote (tool):** "The tariff rate on electric vehicles under Section 301 will increase from 25% to 100% in 2024."
- **Source:** [USITC Harmonized Tariff Schedule search, heading 9903.91.03](https://hts.usitc.gov/reststop/search?keyword=9903.91.03), US International Trade Commission, current edition (accessed 2026-10-28)
- **Quote (tool):** "effective with respect to entries on or after September 27, 2024, articles the product of China, as provided for in subdivision (d) of U.S. note 31 to this subchapter" / "The duty provided in the applicable subheading + 100%"
- **Source:** [Commerce Finalizes Rule to Secure Connected Vehicle Supply Chains…](https://www.bis.gov/press-release/commerce-finalizes-rule-secure-connected-vehicle-supply-chains-foreign-adversary-threats), US Department of Commerce, BIS, 2025-01-14 (reused from `ev-charging` U2 / v2 10b, re-opened 2026-10-27)
- **Quote (tool):** "The software-related prohibitions will take effect for Model Year 2027." / it "prohibits manufacturers with a sufficient nexus to the PRC or Russia from selling new connected vehicles" … "even if the vehicle was made in the United States."
- **Source:** [A Tour of BYD's Factory in Lancaster, California](https://legal-planet.org/2026/03/18/a-tour-of-byds-factory-in-lancaster-california/), Evan George, Legal Planet (UC Berkeley/UCLA law schools), 2026-03-18 (accessed 2026-10-28)
- **Quote (tool):** BYD "does manufacture a wide range of electric buses and big-rig trucks in the U.S." / stations for "trucks, transit buses, and school buses" / "recently rebranded in the U.S. as RIDE" / BYD "does not sell these consumer vehicles in the United States."
- **Source:** [Why Can't You Buy A BYD In America?](https://motor1.com/features/811958/why-cant-you-buy-a-byd-in-america/), Dan Mihalascu, Motor1, "Oct 15" (2026 per context) (reused from `ev-charging` v2 10a): "largely shut out of the US market"; Stella Li "ruled out expanding the company's passenger-car business into the United States under current conditions".
- **Fact-checker update 2026-10-28 (open item 6): not resolved.** The USITC search page (re-opened) shows heading 9903.91.03 only as "articles the product of China, as provided for in subdivision (d) of U.S. note 31"; the note text is not on that page, so EVs on the list is **not** confirmed there. A search of ustr.gov returned the Federal Register notice 89 FR 76581 (2024-09-18), whose search summary lists HTS 8703.80.00 at 100% (2024), but the PDF came back as unreadable binary and the USTR press release (2024-09-13) I opened does not mention EVs. So the 100% EV tariff rests on the White House fact sheet (✅ as quoted) and an unopened USTR notice (snippet only). Fine for the script as "100 percent tariff", attribute to the 2024 Section 301 action.
- **Note:** This **resolves the `ev-charging` open item**: the +100% Section 301 heading is still in the current HTS. I did not open note 31(d) to see the product list; the White House fact sheet ties the 100% to EVs. Don't give a combined rate (a 2.5% base car duty and possible Section 232 auto duties stack on top; not verified here). Wording per `ev-charging`: "doesn't sell its **passenger** cars here" (it builds buses and trucks in Lancaster, CA). The rule bans software, not owning a car; don't say "illegal". The rule applies to China-linked makers' cars even if built in the US, so a US BYD plant wouldn't fix it (inference from BIS's wording, ✅ for the wording).

## 19. What a BYD would cost in the US

- **Script:** avoid a number.
- **Status:** ❌ unsupported (no reliable estimate found)
- **Note:** Searched analyst and press estimates: only forum doubling math ("BYD would still have the cheapest EV in the US, even with a 100% tariff", Motley Fool discussion board, snippet) and AP's statement that it "likely would sell for more than 12 grand if imported" (2024, tool paraphrase). The 100% duty applies to the customs value, not the Chinese sticker price, and US crash compliance would "add a couple thousand dollars" (Caresoft via AP, claim 9). If the script wants a picture, use 🎭: "Illustrative: doubling the Chinese price only shows the tariff's size; it is not an estimate of a US price." Recommended: skip.

---

## P. Our calculations (🧮)

**P1. Price ratios (China, list, yuan):** Seal 06 EV base 109,900 ÷ Model 3 RWD 235,500 = 0.467. Seal 06 EV top 155,900 ÷ 235,500 = 0.662. Seal 07 EV 169,900 ÷ 235,500 = 0.721. 2025 Seal 175,800 ÷ 2024 Model 3 231,900 = 0.758. Seagull (2nd gen) 65,900 ÷ 235,500 = 0.280. Dollar equivalents at 6.73 yuan/$ (CnEVPost 2026-10-01 rate): 109,900 ≈ $16,300; 155,900 ≈ $23,200; 169,900 ≈ $25,200; 65,900 ≈ $9,790; 235,500 = $34,970.

**P2. What the battery is worth in the Seal 06 EV:** 64.3 kWh × $84/kWh (China pack average, all chemistries, BNEF 2025) ≈ $5,400; × $81/kWh (LFP average, global, all segments) ≈ $5,210. Against the top EV trim's $22,900 (CarNewsChina conversion) ≈ 23–24% of the sticker. A China Model 3 RWD with a 60–66 kWh LFP pack would carry a similar market-price pack (~$5,000–5,500), **so at market prices the two batteries cost about the same; BYD's in-house saving is whatever margin a cell supplier would charge, and no source puts a number on it.** Assumptions: average prices stand in for actual contract prices; BYD's internal cost is unknown.

**P3. LFP vs NMC:** $81 ÷ $128 = 0.633 → LFP packs about 37% cheaper per kWh (BNEF 2025, global, all segments).

---

## M. Myths (good for hooks and comment replies)

1. **"BYD is cheap because it uses a cheap battery chemistry."** In China, Tesla's base Model 3 uses iron-phosphate cells too (claim 12, 🟡). The difference is who makes them.
2. **"Tesla makes its own batteries."** Tesla makes packs, and some of its own 4680 cells, but its 2025 annual report says it relies on suppliers "such as Panasonic and CATL" for cells (claim 6). No share for in-house cells is public.
3. **"Building the battery into the car's floor is BYD's secret."** Tesla's 10-K describes integrating batteries "directly with vehicle body structures" too (claim 7). The cells are the difference.
4. **"A BYD is half the cost of a Tesla to build."** UBS's teardown put the Seal at 15% cheaper to make than a Shanghai Model 3 (claim 8). The retail gap is wider because of spec, pricing and the price war.
5. **"It's all subsidies."** Direct subsidies to BYD were 3.5% of revenue in 2022 (Kiel), and most industry support went to buyer rebates and tax breaks (CSIS), which Tesla's China-built cars also got. Kiel and CSIS both say their counts understate the total (claim 17). Support is real; it isn't shown to be the main cause of the BYD–Tesla gap in China.
6. **"BYD makes literally everything."** Not seats (Forvia JV, claim 15), not tires and glass (Wikipedia mirror, snippet, ❌), some Qualcomm chips (claim 8), and at least one of its ships is chartered (claim 14). UBS's figure is three-quarters.
7. **"Cheap means flimsy."** Caresoft: "This doesn't come across cheap" (headline, claim 9). The Seagull it tested wasn't built to US crash standards, though.

---

## Angles (2–3, each with a hook)

**Angle 1 (recommended): "Same battery, different maker."** Hook: "In China, a Tesla Model 3 and a BYD the same size run on the same kind of battery. One costs about twice as much. Tesla buys its cells. BYD makes its own." Beats: price pair, scoped (claim 1) → the battery is the most expensive part, mostly cells (4, 5) → Tesla's filing: we rely on Panasonic and CATL (6) → BYD's blades, made in-house, and the pack lid is the floor (10) → UBS teardown: three-quarters of the Seal is BYD-made, 15% cheaper to build (8) → widening beat: motors, power electronics, power chips, body panels, lights, even a car-carrier fleet (9, 13, 14) → trade-off: less energy per pound, hard-to-repair pack (16) → one honest line: scale, price war, state support (17) → US: +100% tariff and the software rule (18). Needs claim 12 at ✅ for the hook.

**Angle 2: "Three out of four parts."** Hook: "Analysts took apart a BYD and found that three out of every four parts were made by BYD, down to the chips that drive the motor." Teardown-led; the battery is the first and biggest example. Safest (✅ via UBS).

**Angle 3: "The price you'll never see."** Hook: "There's an electric car that costs about $16,000 in China. In America, you can't buy it at any price." US-led; then why it's cheap (in-house parts), then why it's blocked. Uses claim 1 (scoped), 8, 18. Risk: drifts into a trade story; the owner's angle is how BYD makes parts.

---

## Angle check: does the evidence support "BYD makes it itself" as the main reason?

- **Supported, attributed:** UBS (independent) puts BYD's cost advantage down "primarily" to integration of components, with 75% of parts in-house; Caresoft (independent) found almost nothing outsourced; Bill Russo (Automobility) frames it the same way. "BYD makes most of its own parts, and analysts say that's the main reason it builds cars more cheaply" is ✅ with attribution.
- **Not supported:** that the **battery specifically** is "the biggest reason", or that it explains a **50%** price gap. No source isolates the battery's share; UBS's whole-car cost gap vs a Shanghai Model 3 is 15%; and the China Model 3 RWD also uses LFP. Teardowns point to **integration overall**, not one part.
- **Other causes the teardowns and reporting raise:** scale, labor (only vs US/Europe-built cars, not vs the Shanghai Model 3), price war/margins, subsidies (direct to BYD and buyer-side). None of these is shown to outweigh integration, and none is quantified against it by an independent source.
- **Bottom line:** keep the story "BYD makes the car's parts itself", use the battery as the first and biggest example (not "the reason"), scope the price to "a BYD the size of a Model 3 starts at about half the price, in China", and say UBS's number out loud or leave cost numbers out. The working hook as worded fails on both halves.

---

## Hedges the script must use

| Claim | Say | Don't say | Why |
|---|---|---|---|
| Price | "In China, a BYD the size of a Model 3 starts at about half the price" | "A BYD costs half a Tesla" | Only the base Seal 06 vs base Model 3 is ~half (1, 2) |
| Cost | "UBS found it costs about 15% less to build than a Model 3" or no number | "half the cost to build" | 8 |
| Battery | "the battery is the most expensive part, and BYD makes its own cells" | "the battery is why it's half the price" | H |
| Tesla | "Tesla buys its cells from suppliers like Panasonic and CATL" | "Tesla buys its batteries" / "Tesla makes nothing itself" | Tesla makes packs and motors (6, 7) |
| Chemistry | "iron-phosphate cells, cheaper per kilowatt-hour" | "BYD uses cheap batteries and Tesla doesn't" | China Model 3 uses LFP too (12) |
| Widening | "motors, power electronics, power chips, body panels, lights, even its own fleet of ships" | "seats", "everything", "owns its ships" | 13, 14, 15 |
| Trade-off | "less energy per pound" | a Wh/kg number; "less range" flat | 16 |
| Subsidies | "government support helps too" / attributed Kiel figure | "it's all subsidies", "sold at a loss" | 17 |
| US | "a 100 percent tariff and a ban on their connected-car software"; "doesn't sell its passenger cars here" | a US price; "illegal"; "doesn't sell cars here" | 18, 19 |

---

## Open items for the fact-checker

1. Confirm the China Model 3 RWD's current cell maker and chemistry (MIIT catalogue or Tesla China spec page); this decides whether Angle 1's hook is ✅ (claim 12).
2. Pair the Seal 06 EV's 109,900-yuan trim with its battery and range (BYD China page or CnEVPost launch article) (claim 1).
3. Find a 2025–2026 CLTC range for the China Model 3 RWD (the 606 km figure is from 2024) (claims 1–2).
4. Open the CnEVPost 2026-01-02 deliveries article to move the scale figures from snippet to ✅ (claim 17).
5. If the script names a percentage for the battery's share, keep it attributed ("analysts put it at 30 to 40 percent") (claim 4).
6. Optional: open USITC note 31(d) to confirm EVs are on the 9903.91.03 list (the White House fact sheet already says so) (claim 18).

### Fact-checker results, 2026-10-28

1. **Done, 🟡.** LFP in the China-built base Model 3 RWD: well supported (MIIT-catalogue report 2020; CarNewsChina 2023 and 2025). CATL as supplier: press reports only (InsideEVs 2023 relaying the MIIT filing, CarNewsChina 2023/2025, Gasgoo/Ping An 2020). No Tesla China spec page (page text not returned), no MIIT entry opened, no Tesla/CATL statement. **Hook B stays 🟡** (claim 12, hook section H).
2. **Done.** 109,900 yuan = the 530 km CLTC trim (ifanr, Autohome, 2026-08). Battery size for that trim not stated anywhere I opened; do not say 52.9 kWh in the script.
3. **Done.** Model 3 RWD is 634 km CLTC since 2025-01-10 (CarNewsChina), still listed at 634 km in a 2026-08 Chinese review (search result, not opened). Replace 606 km everywhere. Matched-range pair: 630 km Seal 06 at 132,900 vs 235,500 = 56% 🧮.
4. **Done, ✅.** BYD 2,256,714 BEVs vs Tesla 1,636,129 in 2025 (CnEVPost 2026-01-02). The "4.6 million" BYD total is not in that article.
5. **Noted, no change.** Keep "analysts put it at 30 to 40 percent" (S&P Global Mobility, claim 4); not re-opened (the S&P page is a product page; the quote is a tool result from the first pass, 🟡 until re-quoted).
6. **Partly done, not resolved.** See claim 18 update.

---

## Script check, revision 3 (fact-checker, 2026-10-29, 12-line script.txt; current)

"Expected answer" beat restored. Lines 1-2 and 6-12 are the old revision-2 lines 1-2 and 4-11 (renumbered +1 from line 6), unchanged. The revision-2 table and on-screen ruling below still apply with line numbers shifted (the bars card now covers script lines 9-10).

| Line | Script wording | Status | Notes / fix |
|---|---|---|---|
| 3 | "The usual answer is subsidies and cheap labor." | ✅ as a statement of the common explanation, not of fact about BYD | Re-opened Marketplace, Jennifer Pak, 2024-09-09 (tool): the piece's subtitle names "subsidies, fierce competition" among the reasons; an EU Commission probe found "preferential financing, direct grants, cheap land"; "Another reason Tesla and Chinese brands can make increasingly affordable EVs is because of China's hardworking and low-paid labor force." It lists four drivers (subsidies, competition, labor, supply chain/vertical integration), so "the usual answer" is slightly narrower than the source; acceptable as the line is setting up a rebuttal. Optional softer: "A common answer is subsidies and cheap labor." The line makes no claim that BYD's labor is cheaper than Tesla's. |
| 4 | "Subsidies do help, but Tesla builds the Model 3 in China too, and the teardown pointed mainly to the parts." | ✅ | Unchanged from the cleared wording. Shanghai build (TechNode); UBS "primarily ... integration of vehicle components"; subsidies Kiel/CSIS. Note the Marketplace piece says low-paid labor helps Tesla's China-built cars too, which fits "Tesla builds the Model 3 in China too" as a rebuttal of labor. Subsidies are not rebutted for Tesla (Kiel: Tesla also gets purchase premiums), so "do help" is the right hedge. |
| 5 | "Of those, the battery is the costliest part, and industry analysts put it at 30 to 40 percent of an electric car's cost." | ✅ | "Of those" = the parts (line 4); Russo "most expensive component", S&P Global Mobility "30-40% of the total cost" (re-quoted). Not "the reason" for the gap, so within section H. |

**Polish pass (2026-10-29), three lines re-read:**

| Line | Script wording | Status | Notes |
|---|---|---|---|
| 3 | "People tend to credit subsidies and cheap labor." | ✅ | Marketplace (Pak, 2024-09-09, tool): subsidies and "low-paid labor force" given as reasons. "People tend to credit" is the right strength; the earlier "usual answer" overreach is gone. Still no claim BYD's labor is cheaper than Tesla's. |
| 5 | "The battery is the most expensive part, and industry analysts put it at 30 to 40 percent of an electric car's cost." | ✅ | Russo (Marketplace, 2024-09-09): "the most expensive component of an electric vehicle"; S&P Global Mobility "30-40% of the total cost" (re-quoted). "The part" follows line 4's "the parts", so no "of those" is needed. Stated as fact, but it is a single-analyst quote; acceptable, no counter-source found. |
| 9 | "But that first teardown found the BYD costs only about 15 percent less to build than a Model 3 made in China." | ✅ | UBS Seal vs Shanghai-built Model 3 (TechNode, re-opened). "The BYD" = the Seal of line 2 via "that first teardown" (line 8's Seagull and line 1's Seal 06 are different cars; the bars-card labels `2023 SEAL` / `2026 SEAL 06` carry this on screen). |

**Verdict: PASS.** No REQUIRED fix.

---

## Script check, revision 2 (superseded for lines 3-5; 11-line script.txt)

Closer and ships line cut; labor dropped. Line numbers are the new ones. No new sources opened; all quotes are those already in claims 1, 4, 6, 8, 9, 10, 17, 18 (first pass plus this session's TechNode and S&P re-quotes).

| Line | Script wording | Status | Notes / fix |
|---|---|---|---|
| 1 | "In China, a BYD the size of a Tesla Model 3 starts at about half the price." | 🟡 (hedge-table wording) | Unchanged. |
| 2 | "...about three quarters of that car's parts, starting with the battery." | ✅ | UBS Seal teardown, 75% incl. battery. Optional fix from rev 1 applied. |
| 3 | "Subsidies help, but Tesla builds the Model 3 in China too, and the teardown pointed mainly to the parts." | ✅ | "Cheap labor" removed. Shanghai build ✅ (TechNode). "The teardown" = UBS, "primarily ... integration of vehicle components". Subsidies ✅ Kiel/CSIS (claim 17). Previous required fix met. |
| 4 | "The battery matters most, since analysts put it at 30 to 40 percent of an electric car's cost." | 🟡 | S&P "30-40% of the total cost" ✅ (re-quoted). **REQUIRED small fix:** "matters most" is not sourced and reads as "the battery is the biggest reason for the price gap", which section H marks ❌ (no source isolates the battery; both cars use iron-phosphate cells). The sourced claim is "most expensive part" (Russo: "the most expensive component"; claim 4). Use: "The battery is the costliest part, and analysts put it at 30 to 40 percent of an electric car's cost." Keep "analysts put" (Goldman and Benchmark are lower). |
| 5 | "Tesla's annual report says it buys its battery cells from suppliers like Panasonic and CATL." | ✅ | 10-K "we rely on suppliers such as Panasonic and ... CATL for these cells". Don't add "all/most". |
| 6 | "BYD makes its own cells, which are long, flat iron-phosphate blades, and it builds the pack into the car's floor." | ✅ cells and chemistry; 🟡 floor | Floor = BYD's own cell-to-body claim, stated for the Seal. Optional: "in cars like the Seal". Not unique to BYD (Tesla 10-K); line doesn't say so. |
| 7 | "A different teardown found BYD made its own motors and the electronics that run them, even the body panels and lights." | ✅ | Caresoft Seagull (InsideEVs): "Body panels, light clusters, motors, batteries, power electronics ... made in-house". |
| 8 | "But that first teardown found the BYD costs only about 15 percent less to build than a Model 3 made in China." | ✅ | UBS: Seal "15% more cost-efficient" than Shanghai-built Model 3 (2023, estimate; report not public). Clarity only: "the BYD" = the Seal of line 2, not the Seagull of line 7 or the Seal 06 of line 1; "that first teardown" resolves it. Optional "that Seal". |
| 9 | "Part of the remaining price gap comes from the cheapest trim's shorter range and China's price war." | 🟡 | Uses the wording proposed in rev 1; "part" is the hedge. Range: 530 km (109,900 trim) vs Model 3 634 km CLTC ✅ (claim 1). Price war ✅ (BYD cuts up to 34%, Fortune 2025-05-26), not tied by any source to this car. Neither is quantified or shown as a cause by a source, so keep "part". Don't strengthen. Note the 15% and the "remaining gap" refer to different BYD models (Seal vs Seal 06). |
| 10 | "You can't buy one in the US." | 🟡 | BYD sells no passenger cars in the US (Legal Planet 2026-03-18: "does not sell these consumer vehicles in the United States"; Motor1). It does sell buses and trucks, so "one" must mean the passenger car; previous line ends on "price war", so the antecedent is loose. Optional: "BYD doesn't sell its passenger cars in the US." Not an exact legal claim (no ban on owning one). |
| 11 | "There's a 100 percent tariff, and a ban on Chinese-linked car software starts with 2027 models." | ✅ | Tariff: White House 2024-05-14 (Section 301, EVs 25% to 100%); rule: BIS "software-related prohibitions will take effect for Model Year 2027". Optional scope: "a 100 percent tariff on Chinese-made EVs". Causal "keep it out" is gone. Sensitive: trade policy, facts only. |

**Hedges-table compliance:** no "half the cost", no seats/everything/owns ships, no Wh/kg, no US price; line 4's "matters most" is the one exception to the Battery row ("the battery is the most expensive part").

**Legally sensitive:** BYD, Tesla, Panasonic, CATL named. UBS and Caresoft not named in the script ("analysts", "a different teardown").

**Final update (same day, script re-read):** line 4 now "The battery is the costliest part, and analysts put it at 30 to 40 percent of an electric car's cost." = ✅ (Russo: "the most expensive component"; S&P "30-40% of the total cost"; the "matters most" fix is applied). Line 7 "makes" = ✅ (Caresoft's source sentence is also present tense, "are all made in-house"; the teardown car was a 2024 Seagull). Line 8 "That first teardown found the car costs only about 15 percent less to build than a Model 3 made in China." = ✅ (UBS Seal vs Shanghai Model 3; "the car" resolves to line 2's car).

**Verdict: PASS.** No ❌ left in the script; remaining 🟡 are lines 1, 6 (floor), 9, 10, hedged as the sources allow. Optional tweaks only (lines 6, 10, 11).

**Line 3 now:** "industry analysts put it at 30 to 40 percent" = ✅ (S&P Global Mobility is an industry research firm; re-quoted).

### On-screen ruling: the bars card (av-script.md draft 2, scenes 12-13, script lines 7-8)

Fact-checker, 2026-10-28. **Ruling: acceptable with conditions (CONDITIONAL PASS).** Two different BYD models on one chart is not a lie only if the card never lets them read as one car or one like-for-like pair.

- **Why it is risky:** the `TO BUILD` row is the 2023 BYD Seal vs a Shanghai-built Model 3 (UBS estimate, claim 8). The `TO BUY` row is the 2026 Seal 06 EV base trim (109,900 yuan) vs Model 3 RWD base (235,500 yuan), China list prices, a smaller and cheaper car with unknown build cost (claim 1). Both bars are labelled `BYD`, so a viewer reads one car with a 15% cost edge and a 53% price edge. The voice discloses "the car" and "the cheapest trim", but the picture has to as well.
- **Required on the card:**
  1. **Row labels name the model and year**, as plain card text (not a citation, no firm named): `TO BUILD · 2023 SEAL` and `TO BUY · 2026 SEAL 06`. No "UBS" or any firm on screen.
  2. **Footnote (small, on the card, whole time it shows):** "Different BYD models. Cost: 2023 estimate. Price: China list, cheapest trim." (If room allows: "Price: China list, cheapest Seal 06 vs Model 3 RWD".)
  3. **`TO BUILD` row:** TESLA full, BYD at 85% of its length (100 minus 15). Gap label exactly `ABOUT 15 % LESS`, matching the voice. Not `15 %`, not `15 % CHEAPER`, not "half the cost". Optional end label on the Tesla bar: `MODEL 3 · MADE IN CHINA` (sourced: Shanghai).
  4. **`TO BUY` row:** BYD bar drawn at **47%** of the Tesla bar (109,900 ÷ 235,500 = 0.467, P1). The av-script's "stops at about half" is fine as geometry only if it is 47%, not 50% and not the 56% or 66% pairs. **No number or "47 %" / "56 %" on the bar**; the voice's "about half" is enough. If a label is wanted, only `ABOUT HALF`, tied to "cheapest trim" in the voice. **Never "56 %" or "half the price" on the bar**: 56% is a different pair (630 km trim) and would contradict "cheapest trim".
  5. **Bracket label:** do **not** use `NOT FROM BUILD COST` (❌). It states a cause no source gives: the Seal 06's build cost is unknown and may be lower than the Seal's, so the whole price gap could be partly cost. Use **`THE REST`** (the brand-director's alternative; ✅ as pure arithmetic of two drawn bars) or `PART OF THE REST`. Do not size the bracket as a measured quantity, and add no cause names on the card (range and price war stay in the voice, where "part" hedges them).
  6. **Bars not to scale across rows:** no axis, no values (already the spec). Fine.
- **Do not:** put the two rows in one shared scale or draw a single BYD bar split into "cost" and "other"; show the 15% on the Seal 06; use `BYD` labelling without the model row labels.
- **Publisher (🎭 / sources in the description):** add "Illustrative: the bars are shapes. Build-cost bar: an analyst teardown estimate (2023) of the BYD Seal vs a Shanghai-built Model 3. Price bar: 2026 China list prices, cheapest BYD Seal 06 EV vs Tesla Model 3 rear-wheel drive. They are different BYD models."
- **Verdict on the card:** PASS once items 1, 2, 4 and 5 are in the av-script/spec; if the footnote and model labels are cut for space, **BLOCKED** (the card then misleads).

---

## Script check, revision 1 (superseded, kept for the record; 12-line script)

Re-opened this pass: TechNode (UBS) and the S&P Global Mobility page, both (tool) quotes confirmed. Yicai Global refused the connection (ECONNREFUSED), so its wording is from the first pass only. Not re-opened: the Tesla 10-K, BYD, Caresoft/InsideEVs, White House and Commerce pages (first-pass quotes stand, (tool)).

TechNode this pass: UBS's "evidence lab that took apart the Seal electric car" found it "15% more cost-efficient" than Tesla's Model 3; "75% of the auto parts" "made in-house", "ranging from batteries to power semiconductors"; the Model 3 compared is the "locally made offerings by the US automaker at its Shanghai facility"; "UBS attributed the gap primarily to BYD's technological and engineering integration of vehicle components." (The article title frames "the gap" around the 25% EU comparison, so "the gap" may be the gap to European rivals, not the Tesla gap. Say "UBS", don't stretch it.)

| Line | Script wording | Claims | Status | Fix |
|---|---|---|---|---|
| 1 | "In China, a BYD the size of a Tesla Model 3 starts at about half the price." | Seal 06 EV 109,900 vs Model 3 RWD 235,500 yuan = 47% (claim 1); "about the same size" (Electrek) | 🟡 (wording is exactly the hedge in the table; ✅ for both prices) | None. Keep "starts at", "in China". The 109,900 trim is the 530 km version; the matched-range pair is 56% (not in script). |
| 2 | "Analysts who took one apart found BYD makes about three quarters of its parts itself, starting with the battery." | UBS teardown of the Seal: 75% of parts in-house incl. battery (claim 8) | ✅ for UBS, Seal, 2023 | Optional: "three quarters of that car's parts" (the figure is one Seal, 2023, and a different model from line 1's Seal 06). "Starting with the battery" is narration, source says "ranging from batteries to power semiconductors". |
| 3 | "Cheap labor and subsidies help, but this Tesla is built in China too, and the analysts pointed mainly to the parts." | (a) Tesla built in China: ✅ (TechNode, Shanghai). (b) subsidies help: ✅ Kiel (BYD direct subsidies EUR 2.1 bn in 2022) and CSIS, but Tesla's China-built cars get the buyer-side support too. (c) "analysts pointed mainly to the parts": UBS "primarily" integration of components, ✅ for UBS. (d) "cheap labor helps": only AP's "Higher U.S. labor costs are a part of the equation" (vs US-built cars); no source that BYD's labor is cheaper than Tesla's in China, and the line itself concedes this. | 🟡 | REQUIRED (small): do not let "cheap labor" stand as an unattributed cause. Safest: drop it ("Subsidies help, but...") or scope it ("Cheaper labor helps against US-built cars, but..."). Also "the analysts" must read as UBS's cost finding (see line 9), not an explanation of the whole retail gap: the UBS source explains the 15% cost gap and the EU gap, not the 47% price gap. Line 9 supplies that scope, which is acceptable if line 3 keeps "the analysts" tied to the teardown in line 2 (it does). |
| 4 | "Analysts put the battery at 30 to 40 percent of an electric car's cost." | S&P Global Mobility 2026-02: "EV batteries account for 30-40% of the total cost of an electric vehicle" (claim 4) | ✅ re-quoted (tool) this pass | None required. Note other analysts are lower (Goldman 30% falling to 15-20%; Benchmark 16-32%, snippets), so "analysts put" is right, but "the analysts" or "some analysts" would be wrong. Keep "Analysts put". |
| 5 | "Tesla's annual report says it buys its cells from suppliers like Panasonic and CATL." | Tesla FY2025 10-K: "Currently, we rely on suppliers such as Panasonic and ... CATL for these cells" (claim 6) | ✅ (first-pass tool quote; company filing) | None. Does not say Tesla buys all its cells; the 10-K also says it intends to supplement them with its own. Line 5 doesn't claim "all". Do not add "all" or "most". |
| 6 | "BYD makes its own cells, long flat iron-phosphate blades, and builds the pack into the car's floor." | Blade "developed in-house by BYD", LFP cathode, CTB pack lid = body floor (BYD, company claim); Caresoft and UBS say the battery is BYD's own (claims 8, 9, 10) | ✅ for in-house cells and LFP; 🟡 for "builds the pack into the car's floor" (BYD's own description; cell-to-body is stated for the Seal, not verified for every BYD or for the Seal 06 in line 1) | Optional hedge: "in cars like the Seal, builds the pack into the floor". Don't imply Tesla doesn't (its 10-K describes the same idea, claim 7); the line doesn't. |
| 7 | "Engineers who took apart another BYD found its motors, power electronics, body panels and lights were BYD's too." | Caresoft Seagull teardown (InsideEVs 2024-02-27): "Body panels, light clusters, motors, batteries, power electronics, and more are all made in-house, by BYD itself." (claim 9) | ✅ | None. "Another BYD" = the Seagull, correct. Caresoft's findings carry no cost number; the line has none. |
| 8 | "It even runs its own fleet of car-carrier ships." | Fleet of eight vessels (CarNewsChina 2025-10-02); at least one is chartered (CnEVPost) (claim 14) | 🟡 as "runs its own fleet" (the hedge table allows this wording; "owns" would be ❌) | None if "runs" stays. "Its own fleet" slightly overstates a mix of owned and chartered; if challenged, "runs a fleet of car-carrier ships". |
| 9 | "In fairness, the first analysts found their BYD costs only about 15 percent less to build than a China-made Model 3." | UBS: Seal "15% more cost-efficient" than the Shanghai-built Model 3 (TechNode, re-opened); Yicai: "15 percent cheaper to make than the Tesla Model 3" (first pass) (claim 8) | ✅ for UBS, Seal vs Shanghai Model 3, 2023, as an estimate | None required. "First analysts" = UBS, the line-2 teardown (✅: both outlets say UBS's lab took it apart). "China-made" is supported ("at its Shanghai facility"). "Only" is an editorial reading of a 15% figure; acceptable. Caveats to know: 2023 data; the report isn't public (two outlets relay it); the Seal compared is a bigger, pricier car than line 1's Seal 06, whose list-price gap to a Model 3 was 24% (2025 Seal 175,800 vs 231,900 yuan), so the 15% (cost) and 47% (price) gaps are for different BYD models. |
| 10 | "The rest of the price gap comes from features, pricing and China's price war." | Causes of the gap beyond cost to build: spec/range (claim 1: base trim 530 km vs Model 3 634 km, ✅ ifanr/Autohome); price war (BYD cut up to 34% on 22 models, May 2025, Fortune, ✅, but not tied to the Seal 06's 2026 price); "features": no source compares features; "pricing": circular | ❌ as worded (flat causal claim; no source apportions the gap or names these as its causes). Sourced only as a hedged, partial statement. | REQUIRED. Do not use "the rest ... comes from". The scriptwriter's "most of the rest" is worse: it adds a quantity no source gives. Hedged wording that would make it 🟡/✅: "Part of the rest comes from lower range on the cheapest trim and China's price war." (✅ range pair; ✅ price war exists) or "No analyst has split out the rest; trim, pricing and China's price war all play a part." Drop "features" (unsourced; "range" or "trim" is sourced). |
| 11 | "In the US, a 100 percent tariff and a ban on Chinese-linked car software from 2027 models keep it out." | 100% Section 301 on Chinese EVs (White House 2024-05-14 ✅; USITC heading 9903.91.03 present, note 31(d) EV list not confirmed, claim 18); Commerce rule: software prohibitions from Model Year 2027 (BIS ✅); BYD sells no passenger cars in the US (Legal Planet, Motor1) | ✅ for tariff and rule; 🟡 for "keep it out" as a single-cause statement (Motor1: "largely shut out"; BYD's Stella Li ruled out US passenger-car expansion "under current conditions") | None required. Optional: "largely keep it out". Don't add "illegal". Legally/politically sensitive (trade policy); facts only, as now. |
| 12 | "So when one car costs far less than another, ask who made its parts." | Conclusion; rests on UBS "primarily ... integration of components" and Bill Russo (claims 8, 4) | 🟡 (advice, but implies parts are the main driver of price gaps; UBS supports it for cost to build, not for retail price) | None. Acceptable because line 9-10 concede the cost vs price difference. If line 10 is hedged as above, the ending stays honest. |

**Hedges-table compliance:** Lines 1, 5, 7, 8, 9 use the table's wording. Line 10 breaks the Cost/Price rows (price gap ≠ proven cost). No line says "half the cost", "seats", "everything", "owns its ships", a Wh/kg number or a US price.

**Legally sensitive (named companies/people):** BYD, Tesla, Panasonic, CATL (lines 1-9); UBS is not named in the script (spoken as "analysts"), which is safer. Line 3 puts labor and subsidies next to BYD; keep to the attributed Kiel/CSIS facts. No named individuals in the script.

**Script verdict: FAIL on line 10 only** (see REQUIRED fixes). Line 3 needs a small fix ("cheap labor"). All other lines are inside the sources and the hedges table. Re-check after the scriptwriter changes lines 3 and 10; expect PASS.
