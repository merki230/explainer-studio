# Sources: ev-winter (No. 017)

Researcher draft, 2026-11-09. There's no script yet, so the claims follow the owner-agreed beat order: hook → belief ("the cold drains the battery") → reveal (the heater, not the cold battery, takes most of it) → why a gas car's heat is free (engine waste heat through the coolant) → why an EV's isn't (traction battery) → the cold battery's own share (chemistry, regen, charging) → short trips vs highway → helpers (heat pump, preheating on the plug, seat and wheel heaters) → the range comes back → fairness (gas cars lose some too). The statuses are the researcher's starting confidence. The fact-checker sets the final ones.

Owner-agreed angle (2026-11-09): vertical Short, US audience, calm "how it secretly works". Hook: "A gas car heats you with heat it was going to throw away. An EV has to pay for every degree." **Read section H (hook check) before scripting: the hook holds, with one wording caveat.**

Everything was accessed on 2026-11-09 unless noted. **How to read the quotes** (same rules as `ev-cost/sources.md`):

- **(tool)** means the web tool's small model returned the quote from the page. Re-open and re-quote before ✅.
- **(snippet)** means I saw it only in a search-result summary and didn't open the page. It's a lead only (🟡 at best).
- **(carried)** means the quote comes from an earlier video's sources.md and I didn't re-open it today.
- **🧮** means our own calculation. The inputs are sourced and the working is shown.
- **Company claim** means a company's statement about its own product. **Fleet-data company** means Recurrent or Geotab: private firms publishing telematics analyses of many brands. They're not neutral like EPA/DOE or national labs, so attribute them ("one study of 30,000 US EVs…") and don't voice their numbers as government facts.
- **Couldn't open:** nrel.gov (DNS failure; the lab's site has moved to nlr.gov, and the one PDF I reached there came back as unreadable binary, so the NREL/Hanon Kia Soul paper is 🟡 from snippets); AAA Colorado (403); MDPI (403: the 2026 heat pump vs resistive heater dyno paper is snippet only); inl.gov (403); energy.gov Energy Saver heat-pump pages (404); motorbiscuit (DNS). **Not found:** any neutral measured watts figure for a seat or steering-wheel heater (only forums and blogs, so ❌ for a number); any neutral, measured EV heat-pump COP at specific deep-cold temperatures (only a fleet company's "3–4 units" claim, lab simulations, and building heat-pump field data); a source that says exactly how many °F the battery chemistry alone costs at highway vs city speeds.

---

## FACT-CHECK of script v1 (fact-checker, 2026-11-09)

**Verdict: PASS (no ❌), with two wording fixes required before voice (L7, L11) and four recommended (L3 source, L5, L6, L9/L10).** Everything below was re-opened today; quotes marked "(re-quoted)" were returned by the page fetch tool, whose small model sometimes paraphrases, so the quote is exact only where it says "exact". Legally sensitive: none of the voice lines name a company or person (the generic attributions are fine). Named-company risk is in the description only: Recurrent and Geotab are private firms with commercial interests; Consumer Reports and AAA are named in the description.

| Line | Claim | Status | Fix |
| --- | --- | --- | --- |
| L1 | Gas car heats the cabin with engine waste heat | ✅ | None. Ford patent US9631547, exact: "Conventional vehicles use waste heat from the engine as the sole source of heating for the passenger compartment." fueleconomy.gov atv exact: "most of the fuel's energy is lost in the engine, primarily as heat" (68–72% combined). |
| L1 | EV makes its heat from the same battery that drives it | ✅ | None as worded (while driving). fueleconomy.gov atv-ev: "all heat must be provided by electricity"; NREL abstract (osti 1248970) exact: "no engine waste heat is available"; Recurrent: heaters "generally draw energy from the high voltage battery". The owner's original "pays for every degree" is gone, good. |
| L2 | "You've probably heard the cold drains the battery" | 🟡 framing | Fine: "probably" hedges it; no survey measures the belief. |
| L3 | One lab test, 20 degrees, about 40% less range heater on | ✅ | "20 degrees" is Fahrenheit by ear for US viewers: fine. AAA (newsroom 2019-02-07), exact: "the average driving range is decreased by 41 percent" at 20°F with HVAC, vs 75°F, five EVs, dynamometer. "One lab test" maps to exactly one source (AAA 2019). |
| L3 | ...and 12 with it off | ✅ (source corrected) | **The AAA newsroom page does not contain the 12% figure.** It says only that cold and hot cases were run "both when using HVAC and not". The 12% is on fueleconomy.gov (EPA/DOE, citing the 2019 AAA study): "When the cabin heater is not used, EV fuel economy is 8% lower at 20°F than at 75°F" / range "about 12% lower". Cite fueleconomy.gov for the 12 in the description; don't credit it to the AAA release. Optional voice fix for parallel units: "...about 40 percent with the heater on, and about 12 with it off." |
| L4 | "Most of that loss was the heater" | ✅ (+🧮) | 41 − 12 = 29 of 41 points ≈ 70%; fueleconomy.gov exact: "About two-thirds of the extra energy consumed is used to heat the cabin." Scope is AAA's mixed cycle, lab, mostly resistive heaters. Holds as worded because L3 sets the scope ("in one lab test"). |
| L5 | Cold slows the battery | ✅ | Recurrent: "Chemical and physical reactions in the battery occur more slowly in cold temperatures." (closest-sentence, tool) ; fueleconomy.gov exact: "Battery performance decreases in cold weather". |
| L5 | ...recovers less energy when braking | ✅ | fueleconomy.gov exact: "This also affects the performance of the regenerative braking system on hybrids, plug-in hybrids, and electric vehicles." Recurrent exact: "Regenerative braking may also be limited by your battery management system if the battery is cold". |
| L5 | ...so it charges slower | 🟡 | The only measured source is DC fast charging: INL/Energy Policy abstract exact: "DCFC charging rate can deteriorate considerably in cold temperatures" (old Leafs). Recurrent: "many cars limit the charging voltage when the battery is cold" (exact wording as returned, so "voltage" is the page's word). fueleconomy.gov has **no** charging-speed statement. Hedged wording for ✅: "so it fast-charges slower and recovers less energy when braking." |
| L6 | "the heater costs more" | 🟡 (dangling) | "Costs more" than what is not stated: right after L5 a listener hears "more than the cold battery", which AAA/EPA support (two-thirds vs one-third) but only in that test. Fix: "Still, the heater costs more range than the cold battery does, and it runs by the minute, not the mile." |
| L6 | "runs by the minute, not the mile" | ✅ framing | 🧮 C3 (a fixed 3–5 kW draw costs about a third as much per mile at three times the speed; heater 3–5 kW is Geotab's figure but the voice line has no number). CR's own explanation: "short trips... the need to reheat the cabin". |
| L7 | Testers lost about a quarter of range on the highway | ✅ | CR (updated 2025-02-14), exact: "cold weather depletes about 25 percent of range when cruising at 70 mph" — winter test at about 16°F vs mid-60s weather. |
| L7 | ...and half on short trips | 🟡 | **Not the same test.** CR exact (partial): "In the past, we found that short trips in the cold with frequent stops and the need to reheat the cabin after a parking pause sap 50 percent of the range." No date, no temperature, no vehicles given. The "So" and one "testers" subject merge two tests into one. Fix wording for ✅: "So testers lost about a quarter of their range cruising on the highway in the cold, and earlier testing found about half on short trips." (Lighter: "...and in earlier testing, about half on short trips.") Also drop "So" or keep it: it isn't a logical consequence of L6 unless the clock framing carries it. |
| L8 | Heat pump moves heat in from outside instead of making it | ✅ attributed | Recurrent 2025, exact: "A heat pump works by transferring heat from the outside air, even in cold conditions." Mechanism is standard physics; no attribution needed in the voice. |
| L8 | ...but helps less in deep cold | ✅ attributed | Recurrent 2025, exact: "It's worth noting that heat pump benefits diminish as temps drop toward 0F"; page also says heat pumps become "about as efficient as a resistive heater" (exact). Not unattributed 🟡: it holds without a hedge because it is unquantified. Still true if "deep cold" stays vague; don't add a temperature or a "3–4 times" figure. MDPI 2026 dyno paper: 403 again, still snippet-only (🟡 lead). NREL/Hanon SAE 2018-01-0066: nrel.gov DNS still dead; a search shows the paper exists (Meyer, Lustbader et al., "Range Extension Opportunities While Heating a Battery Electric Vehicle", Kia Soul BEV with PTC or heat pump with PTC backup), but I did not see the ~50%/~30% conditions, so they stay 🟡 leads and out of the voice. |
| L9 | Preheating while plugged in takes heat from the wall, not range | ✅ | fueleconomy.gov exact: "preheating the cabin while plugged into the charger can extend your vehicle's range". AAA exact: "Make time to 'pre-heat' or cool down the inside of the vehicle while still connected to the charger." CR: precondition "when connected to the charger" rather than draining the battery; Jan 2025 test, 3 EVs, single digits, 5–7% better efficiency. Recurrent exact: "So, as much as possible, you want to warm up your car while it's still charging." No source says "from the wall" word for word: it is the plain meaning of "while plugged in". Wording risk: "that heat" has no clear antecedent (L8's heat pump). Fix: "Preheating while plugged in runs the heater off the wall, not your range." |
| L10 | Heated seats help too | ✅ | fueleconomy.gov exact: "using the seat warmers instead of the cabin heater can save energy and extend range." NREL abstract exact: zonal heating "5.5% to 28.5% reduction in cabin heating energy", "6.9% to 18.7% improvement in EV range" in simulation (no numbers in the voice). |
| L10 | ...testers using only those got uncomfortably cold | ✅ (wording note) | CR exact: "For trial two, the climate system was shut off and only the heated seats and steering wheel were used." / "all test drivers commented how uncomfortably cold the interior of the car was". It was seats **and wheel**, three EVs, 23–31°F, 130-mile mostly highway round trip: a **different CR test** from L7's 16°F cruise and from the undated short-trip figure. One organisation, one article, so "testers" maps to one source, but it is not the same test. Fix for accuracy: "...but testers who used only the seat and wheel heaters got uncomfortably cold." The same test found 7–8% higher efficiency with the climate off; omitting that is fair since the line says "help". |
| L11 | Range comes back in spring | 🟡 | Recurrent 2025 (exact): "As the ice melts and the temperatures rise, your vehicle's expected range at full charge returns to normal." It is a statement, not a result I could see in the text (the page's charts are images I couldn't read). |
| L11 | ...no lasting harm to the battery | 🟡 attributed | Recurrent exact: "No, any range loss from winter weather is temporary and there is no long term detriment to your battery." Company claim; no neutral/measured source found. |
| L11 | "Fleet data shows" | 🟡 overclaim | The 30,000-vehicle dataset (exact: "real-world driving data from more than 30,000 vehicles in the US") supports the 78%/70% retention figures; the recovery and no-harm sentences are Recurrent's statements, not shown results. Fix for ✅ attributed: "One study of 30,000 EVs says the range comes back in spring, with no lasting harm to the battery." Alternative: "Analysts of fleet data say the loss is temporary: the range comes back in spring." Do not say "shows". |
| L12 | Closing question | n/a | No claim. |

**Re-check of script v3 (fact-checker, 2026-11-09): PASS, no ❌, no required fixes.** The v1 fixes (L7, L11) are applied and now match the sources. Line by line:

- L3 "fell only 12 percent with the heater off, and about 40 percent with it on": ✅ (12% via fueleconomy.gov citing AAA 2019; 41% AAA). "Only" is editorial but fair: 12 is the smaller number and the line's point. Description must credit the 12 to fueleconomy.gov.
- L4 "Most of that was the heater": ✅ (29 of 41 points, about 70%; EPA/DOE "about two-thirds of the extra energy"). Scope carried by L3's "one lab test".
- L5 "so braking recovers less energy": ✅ (fueleconomy.gov regen sentence; Recurrent). The v1 "charges slower" risk is gone.
- L6 "the heater runs the whole drive, so short trips hurt most": ✅ framing (🧮 C3; CR's 25% vs 50%). The dangling "costs more" is gone.
- L7 "Test drivers... about a quarter... on the highway, and earlier tests found about half on short trips": ✅ for 25% (CR, ~16°F, 70 mph); 🟡 for 50% (CR "in the past", undated) but hedged by "earlier", so allowed. Optional precision: "in the cold" after "highway".
- L8 "A heat pump cuts that cost by moving heat in from outside...": ✅ attributed (Recurrent: "transferring heat from the outside air"; "benefits diminish as temps drop toward 0F"; 10% more range at 32°F). "Cuts that cost" is supported qualitatively; no number voiced.
- L9 "Preheating while plugged in runs the heater off the wall": ✅ (fueleconomy.gov, AAA, CR, Recurrent; "wall" = grid power while charging). The "that heat" ambiguity is gone. Nuance not voiced: a weak 120 V outlet may not cover a big heater (unsourced, don't add).
- L10 "Heated seats and steering wheels help, but test drivers using only those got uncomfortably cold": ✅ (fueleconomy.gov; CR "only the heated seats and steering wheel were used", "uncomfortably cold"). Different CR test from L7, same article: fine.
- L11 "One study of 30,000 EVs says the range returns in spring, without lasting harm": ✅ attributed (Recurrent, a company analysis it calls its "2025/2026 winter study"; the recovery and no-harm lines are its statements). "30,000" understates the source's "more than 30,000", which is true but loose: optional exact wording "One study of more than 30,000 EVs says...".

**Re-check of script v5 (fact-checker, 2026-11-09): PASS, no ❌. One wording recommendation (L11).** L1–L7 changed only in small ways (L3 lost "only", L6 now "draws power every minute"): ✅ as in the v3 note; "every minute" is the same clock framing (🧮 C3). L8–L12:

- L8 "That lost range returns in spring, without lasting harm to the battery, one study of 30,000 EVs says": ✅ attributed (Recurrent, as in v3). Attribution at the end of the sentence is fine. "30,000" vs source's "more than 30,000": optional exact wording.
- L9 "Until then, a heat pump moves heat in from outside instead of making it, but helps less in deep cold": ✅ attributed (Recurrent mechanism and "diminish as temps drop toward 0F"). "Until then" implies the heat pump helps in winter, which Recurrent supports (about +10% range at 32°F).
- L10 "Seat and steering-wheel heaters help too, but test drivers using only those got uncomfortably cold": ✅ (fueleconomy.gov; CR seats-and-wheel test).
- L11 "So the simplest fix is preheating while plugged in, using wall power instead of the battery": ✅ for the mechanism and the advice (fueleconomy.gov, AAA, CR, Recurrent all recommend it). 🟡 for "simplest fix": CR calls preconditioning "set it and forget it... little to no drawbacks" (supports simple), but its measured gain was only 5–7% efficiency, and the Kia EV9 showed less predicted range, so "fix" overclaims after a 25–50% loss. Recommended wording: "So the usual advice is to preheat while plugged in, using wall power instead of the battery." ("Simplest fix" alone would be 🟡; "the usual advice" is ✅: AAA, EPA and CR all give it.)
- L12 "Do you warm your car before unplugging?": no claim.

**Generic attributions map check (v1, still valid):** "one lab test" = AAA 2019 (one source, but the 12% is via fueleconomy.gov); "testers" (L7, L10) = Consumer Reports, one article, **three different tests** (16°F highway cruise; undated earlier short-trip testing; 23–31°F seats-and-wheel test), so the description must cite the CR article and not imply one dataset; "fleet data" (L11) = Recurrent (commercial; attribute as "one study"). None misleading once the L7 and L11 wording is fixed.

**Description lines needed (publisher):** AAA 2019 lab test (20°F vs 75°F, five EVs); fueleconomy.gov for the heater-off 12% and "two-thirds"; Consumer Reports winter testing (updated 2025-02-14: 25% at 70 mph at about 16°F; earlier undated short-trip testing: 50%; seat/wheel-only test at 23–31°F); Recurrent Nov 2025 (heat pump, temporary loss); ORNL/NREL and Ford patent for the waste-heat claim.

---

## Key facts (one screen)

1. **The loss is real, and most of it is the heater.** In AAA's lab test at **20°F**, average range fell **41% with the heater on** but only **12% with it off** (AAA 2019, 5 EVs, vs 75°F). The EPA/DOE site: "About two-thirds of the extra energy consumed is used to heat the cabin." ✅
2. **Real-world fleet data is milder:** about **78% of range kept at 32°F** and **70% at 20°F** (Recurrent, 30,000+ US EVs, 34 models, published 2025-11-19). At **5°F**, about **54% of rated range** (Geotab, 4,200 EVs, data from 2020, republished 2025). 🟡 attributed (fleet-data companies)
3. **A gas engine throws away most of its fuel as heat:** "Engine Losses" of **68–72%** of the fuel's energy on the combined cycle, "primarily as heat" (fueleconomy.gov). The cabin heater runs on hot engine coolant through a small radiator behind the dash (the heater core) (GM patent); Ford's patent: "Conventional vehicles use waste heat from the engine as the sole source of heating." ✅
4. **An EV's motor wastes little**, so there's little heat to borrow: the electric drive loses "15% to 20%" vs "64% to 75%" for a gas engine (fueleconomy.gov). The cabin heat "is typically provided by the traction battery" (ORNL/MAHLE, 2016). ✅
5. **The heater draws about 3,000–5,000 watts** (Geotab). 🧮 That's roughly **half again** the power the car needs to drive in EPA city driving, and about **a fifth to a third** on the EPA highway cycle. 🟡 (fleet-company figure, our math)
6. **The heater runs on the clock, not the odometer**, so short, slow trips suffer most: CR measured **~25% range loss at 70 mph** at about 16°F, but **~50% on short trips** with stops and re-heating. In the cold, the most efficient speed **doubles from ~19 to ~37 mph** (Geotab model). ✅ CR / 🟡 Geotab
7. **The cold battery matters too, but less:** chemistry slows, regen braking is limited, and fast charging slows (INL: up to **~3× slower** in the coldest conditions, 2018, old Leafs). Geotab: battery sluggishness "has far less impact on range than auxiliary load." ✅ / 🟡
8. **It's not damage:** "any range loss from winter weather is temporary" (Recurrent). ✅ attributed
9. **Helpers:** a **heat pump** moves heat in from outside air instead of making it: "3–4 units of heat" per unit of electricity (Recurrent's figure). It adds about **10% range at 32°F** in fleet data, but the benefit "diminish[es] as temps drop toward 0F". **Preheating on the plug** helps (CR 2025: efficiency up about 5–7%). **Seat and wheel heaters** use far less than heating the air (NREL: zonal heating cut heating energy 5.5–28.5% and added 6.9–18.7% range), but CR found switching the cabin heat off for seats and wheel alone gained only 7–8% at 23–31°F, and the testers were "uncomfortably cold." ✅ / 🟡
10. **Gas cars lose too:** about **15% worse mpg at 20°F** in city driving, and up to **24% on 3–4-mile trips** (fueleconomy.gov). ✅

---

## Numbers we'd put on screen (max 5, rounded, °F and miles)

| # | On screen | Source / working | Status |
| --- | --- | --- | --- |
| 1 | **20°F, heater on: about 40% less range. Heater off: about 12%.** | AAA 2019 lab test (claims 2–3) | ✅ (scope: 2019 models, lab, vs 75°F) |
| 2 | **Gas engine: about 70% of the fuel's energy lost, mostly as heat** | fueleconomy.gov, combined 68–72% (claim 4) | ✅ |
| 3 | **EV heater: about 3,000–5,000 watts** | Geotab (claim 8) | 🟡 (fleet company) |
| 4 | **Highway: about −25% / short trips: about −50%** | Consumer Reports, about 16°F (claim 9) | ✅ (CR) |
| 5 | **Heat pump: about +10% range at 32°F** | Recurrent 2025 (claim 14) | 🟡 attributed |

**Description line (draft for the publisher):** "Range figures: AAA lab test of 5 EVs at 20°F vs 75°F (2019); Recurrent analysis of 30,000+ US EVs (Nov 2025); Consumer Reports winter testing (updated Feb 2025). Engine energy losses: fueleconomy.gov (EPA/DOE). Heater power: Geotab. Range loss in the cold is temporary."

---

## H. Hook check: "A gas car heats you with heat it was going to throw away. An EV has to pay for every degree."

| Part | Evidence | Status |
| --- | --- | --- |
| "A gas car heats you with heat…" | GM patent: coolant pump "circulates coolant through the engine 110, the heater core 120"; "Heat is transferred from coolant circulating through the heater core to air passing through". Ford patent: "Conventional vehicles use waste heat from the engine as the sole source of heating for the passenger compartment." (claim 5) | ✅ |
| "…it was going to throw away" | fueleconomy.gov: "most of the fuel's energy is lost in the engine, primarily as heat"; 68–72% engine losses combined. Recurrent: "Most ICE vehicles just use the waste heat from the engine". 🧮 On the EPA highway cycle the engine sheds roughly 36–39 kW, about ten times what a cabin heater needs (C1). | ✅ (+ 🧮) |
| "An EV has to pay…" | ORNL/MAHLE abstract: "Without the waste heat available from the engine of a conventional automobile" / "this energy is typically provided by the traction battery". NREL: "no engine waste heat is available". (claims 6–7) | ✅ |
| "…for every degree" | **Mostly fair, slightly absolute.** (a) A heat pump pays for **less than** a degree's worth: it moves in outside heat and pays only for running the pump (claim 14). (b) Some EVs reuse a little motor and battery heat (Recurrent: "very little waste heat", not none). (c) Preheating on the plug pays from the **wall**, not the range (claim 15). So the EV still pays for its heat in electricity, but not always from the battery, and not one-for-one. (d) The gas car's heat isn't perfectly free either: on a cold start the coolant is cold, so the heat comes late, and the blower fan runs on electricity from the engine (fueleconomy.gov: engine warm-up costs mpg on short trips, claim 17). | 🟡 rhetoric |

**Verdict:** the first sentence is ✅ as worded. "Pays for every degree" is fair as a contrast but literally overstated (heat pumps, preheating). **Honest versions, in order of preference:**

1. "A gas car heats you with heat it was going to throw away. An EV has to make its heat from the same battery that drives it." (✅ as worded; plugged-in preheating is the later twist, and the line is about driving)
2. "…An EV has to pay for its heat, out of the battery that drives it." (✅)
3. Keep the owner's line, and let the heat-pump beat later pay it off ("…unless it can borrow heat from outside", claim 14). (🟡 acceptable: the next beats correct the absolute)

## B. Belief check: "the cold drains the battery"

- **Status:** ✅ as a common belief (attributed); ✅ that it's only part of the story.
- **Source:** [To what degree does temperature impact EV range?](https://www.geotab.com/ie/blog/ev-range), Charlotte Argue, Geotab, 2025-10-15 (first published 2020-05-25)
- **Quote (tool):** "People often assume range loss in cold temperatures is due to reduced battery performance." / "While lithium-ion batteries are more sluggish in extreme temperatures" … "this has far less impact on range than auxiliary load." / "the major offender for causing range loss in cold and hot temperatures is auxiliary load."
- **Note:** No survey measures the belief, so don't say "most people think". "You've probably heard the cold drains an EV's battery" is 🟡 framing, fine. The belief is **half right**, so don't call it a myth outright: the cold battery does cost range (claim 10). The honest reveal is "**much** of the lost range is the heater", or "**most**, in AAA's test at 20°F" (claim 3).

---

## 1. Range loss in winter is real (setup)

- **Script (expected):** "On a freezing day, an electric car can lose a big chunk of its range."
- **Status:** ✅ verified
- **Source:** [Fuel Economy in Cold Weather](https://www.fueleconomy.gov/feg/coldweather.shtml), fueleconomy.gov (EPA/DOE), undated, live 2026
- **Quote (tool):** EV "fuel economy can drop roughly 39% in mixed city and highway driving" / "range can drop by 41%." / "Estimates for EVs are based on a 2019 study by AAA"
- **Note:** The fueleconomy.gov page gives no temperature for the 39/41% line (see the ev-cost fact-check, 2026-11-05). The temperature comes from AAA's own release (claim 2): 20°F, heater on, vs 75°F.

## 2. AAA lab test: 41% less range at 20°F with the heater on

- **Script (expected):** "At 20 degrees, with the heater on, one lab test found range dropped about 40 percent."
- **Status:** ✅ verified (AAA, independent)
- **Source:** [Icy Temperatures Cut Electric Vehicle Range Nearly in Half](https://newsroom.aaa.com/2019/02/cold-weather-reduces-electric-vehicle-range/), AAA Newsroom, 2019-02-07
- **Quote (tool):** "41 percent" (when the HVAC system heats the cabin at 20°F) / "for every 100 miles of combined urban/highway driving, the range at 20°F would be reduced to 59 miles." / compared to driving at "an outside temperature of 75°F." / "climate controlled test cell and state of the art chassis dynamometer." / heat use at 20°F adds "almost $25 more for every 1,000 miles"
- **Note:** Scope: 5 EVs of the 2018–19 model years (BMW i3s, Chevy Bolt, Nissan Leaf, Tesla Model S 75D, VW e-Golf, per news coverage, snippet), lab dynamometer, heater running throughout. Newer cars (more heat pumps, better battery heating) do better in the real world (claim 12). Tesla disputed the result at the time (Electrek, snippet). Say "one lab test" or "AAA found", and keep "about 40". Don't voice the $25 (2019 prices).

## 3. Heater off, the same cold costs much less (the split)

- **Script (expected):** "With the heater off, the same cold cost only about 12 percent. Most of the loss was the heater."
- **Status:** ✅ verified (EPA/DOE citing AAA) / 🧮 for "most"
- **Source:** [Fuel Economy in Cold Weather](https://www.fueleconomy.gov/feg/coldweather.shtml), fueleconomy.gov
- **Quote (tool):** "When the cabin heater is not used, EV fuel economy is 8% lower at 20°F than at 75°F." / "Driving range is about 12% lower." / "About two-thirds of the extra energy consumed is used to heat the cabin."
- **🧮 Split:** 41% loss with heater, 12% without → about 29 of the 41 points (≈ 70%) come from heating, ≈ 30% from the cold car itself (battery, denser air, stiffer fluids and tires). Energy-based, the EPA/DOE says two-thirds. Both agree: **about two-thirds heater, one-third cold car**, in AAA's 20°F lab test.
- **Note:** That split holds for AAA's test cycle (mixed city/highway, cars with mostly resistive heaters). On the highway the heater's share is smaller, and on short trips it's bigger (claim 9). Heat-pump cars shift it too. **Safe wording:** "In AAA's test, about two-thirds of the extra energy went to heat." Not "the battery has nothing to do with it".

## 4. A gas engine loses most of its fuel energy as heat

- **Script (expected):** "A gas engine turns most of its fuel into heat, not motion."
- **Status:** ✅ verified (EPA/DOE)
- **Source:** [Where the Energy Goes: Gasoline Vehicles](https://www.fueleconomy.gov/feg/atv.shtml), fueleconomy.gov, undated, live 2026
- **Quote (tool):** "most of the fuel's energy is lost in the engine, primarily as heat" / "Smaller amounts of energy are lost through engine friction, pumping air into and out of the engine" / diagram labels: City "Engine Losses (71% to 75%)", Highway "Engine Losses (64%-69%)", Combined "Engine Losses (68% to 72%)" / "Only about 12%–30% of the energy from the fuel you put in a conventional vehicle" reaches the road (paraphrase boundary: the tool returned this as one sentence fragment)
- **Note:** "Engine losses" include some friction and pumping, so say "most of it leaves as heat", not "70% is heat". Recurrent's "75%-85% … lost as heat" (company blog) is higher than the EPA/DOE figure: use the EPA/DOE one.

## 5. A gas car's cabin heat comes from hot engine coolant

- **Script (expected):** "The coolant that carries that heat away runs through a little radiator behind the dashboard. A fan blows across it, and that's your heat."
- **Status:** ✅ verified (manufacturers' patents)
- **Source:** [US10245921B2, System and method for controlling coolant flow through a heater core of a vehicle…](https://patents.google.com/patent/US10245921B2/en), GM Global Technology Operations LLC, filed 2017-06-12, granted 2019-04-02
- **Quote (tool):** "The heater core is used to heat air flowing to the passenger cabin of the vehicle..." / "Heat is transferred from coolant circulating through the heater core to air passing through the heater core..." / "Typically, a blower is used to force the air through the heater core and into a duct that supplies air..." / "the cooling system 112 is used to absorb heat from the engine" / "the coolant pump 116 circulates coolant through the engine 110, the heater core 120"
- **Source:** [US9631547B2, PHEV heating modes to provide cabin comfort](https://patents.google.com/patent/US9631547), Ford Global Technologies LLC, filed 2013-03-07, granted 2017-04-25
- **Quote (tool):** "Conventional vehicles use waste heat from the engine as the sole source of heating for the passenger compartment." / with battery electric vehicles, "there is no longer any waste heat available so that other means of heating the passenger compartment" are needed.
- **Note:** "Little radiator behind the dashboard" is our plain-words gloss of "heater core" (a heat exchanger in the dash HVAC box). Fine for the voice. The heat arrives only once the engine warms up (claim 17).

## 6. An EV's motor makes little waste heat

- **Script (expected):** "An electric motor wastes so little that there's almost no heat to borrow."
- **Status:** ✅ verified (EPA/DOE, NREL) / ✅ attributed (Recurrent)
- **Source:** [Where the Energy Goes: Electric Cars](https://www.fueleconomy.gov/feg/atv-ev.shtml), fueleconomy.gov, undated
- **Quote (tool):** "An EV electric drive system is only responsible for a 15% to 20% energy loss compared to 64% to 75% for a gasoline engine."
- **Source:** [Climate Control Load Reduction Strategies for Electric Drive Vehicles in Cold Weather](https://www.osti.gov/biblio/1248970), Jeffers, Chaney, Rugh (NREL), *SAE Int. J. Passeng. Cars – Mech. Syst.* 9(1), 2016-04-05, doi:10.4271/2016-01-0262
- **Quote (tool):** "Heating is even more detrimental to EV range than cooling because no engine waste heat is available."
- **Source:** [Winter EV range loss](https://www.recurrentauto.com/research/winter-ev-range-loss), Andrew Garberson, Recurrent, 2025-11-19
- **Quote (tool):** "Electric cars produce very little waste heat compared to traditional gas-powered cars" (opening clause of a longer sentence)
- **Note:** "Little", not "none": the motor, inverter and battery do warm up, and some EVs route that heat to the cabin or battery (Steinstraeter 2021: "less waste heat is available from the powertrain"). Never say "an EV makes no heat".

## 7. The EV's heater runs on the traction battery

- **Script (expected):** "So an EV makes its heat from the same battery that drives it."
- **Status:** ✅ verified (ORNL co-authored paper; Recurrent)
- **Source:** [Design and Testing of a Thermal Storage System for Electric Vehicle Cabin Heating](https://www.osti.gov/biblio/1261301), Wang, Wolfe, Craig (MAHLE Behr), LaClair, Gao, Abdelaziz (ORNL), SAE World Congress 2016, OSTI 1261301
- **Quote (tool):** "Without the waste heat available from the engine of a conventional automobile" / "this energy is typically provided by the traction battery" / "the driving range of an EV can be reduced very significantly during winter months"
- **Source:** Recurrent 2025 (claim 6)
- **Quote (tool):** "The heaters that keep the car warm generally draw energy from the high voltage battery" (opening clause) / "The major reason that EVs lose range in the winter is due to cabin heating to keep the driver and passengers warm."
- **Source (peer-reviewed, Germany):** [Effect of low temperature on electric vehicle range](https://portal.fis.tum.de/en/publications/effect-of-low-temperature-on-electric-vehicle-range/), Steinstraeter, Heinrich, Lienkamp (TU Munich), *World Electric Vehicle Journal* 12(3):115, 2021, doi:10.3390/wevj12030115
- **Quote (tool, abstract):** "On the one hand, the energy demand of cabin heating needs to be supplied by the vehicle's battery" / "since less waste heat is available from the powertrain, which could be used to cover heating demands." / "The results show that the range can decrease by up to 31.9% due to heating"
- **Note:** Both resistive heaters and heat pumps draw on the high-voltage battery while driving. The exception is preheating on the plug (claim 15).

## 8. How much power the heater draws, vs driving

- **Script (expected):** "Heating the air takes about three to five kilowatts. In slow city driving, that's about half again what it takes to move the car."
- **Status:** 🟡 (Geotab figure, fleet company) / 🧮 for the comparison
- **Source:** [To what degree does temperature impact EV range?](https://www.geotab.com/ie/blog/ev-range), Geotab, 2025-10-15
- **Quote (tool):** "Heating the cabin air can draw 3000-5000 watts"
- **Cross-check (neutral):** fueleconomy.gov atv-ev: "In very cold conditions, auxiliary electrical losses can account for more than 40% of energy use in city driving." (tool; the page also gives >25% highway, >33% combined)
- **Cross-check (company, SAE presentation):** [Vehicle Cabin Energy Management Considerations in Electric Vehicles](https://saemobilus.sae.org/content/12841), Zachary Edel, ThermoAnalytics, SAE Thermal Management Systems Digital Summit, 2020-11-04. Quote (tool): "The HVAC only case required 3334 W of power while the HVAC and heated panels case required only 942 W of power." (one modeled case)
- **🧮 Comparison (C2):** EPA city cycle: 6.1 kW to drive vs 3–5 kW heat → heat adds 49–82%. EPA highway cycle: 16.3 kW vs 3–5 kW → adds 18–31%. "More than 40% of energy use in city driving" (DOE) matches: 4 ÷ (6.1 + 4) ≈ 40%.
- **Note:** Peak draw at warm-up is higher (forum reports of 6–9 kW: ❌ unsourced, don't voice). Use "about three to five kilowatts", or a picture instead of a number: "about as much as three space heaters" is 🎭 (a typical US space heater is 1,500 W: not sourced here, so either source it or skip it).

## 9. The heater runs on the clock: short, slow trips lose most

- **Script (expected):** "The heater runs by the minute, not by the mile. On the highway, it's spread over a lot of miles. On short trips around town, it can eat half your range."
- **Status:** ✅ verified (Consumer Reports) / 🟡 (Geotab model) / 🧮
- **Source:** [How Much Do Cold Temperatures Affect an EV's Driving Range?](https://www.consumerreports.org/cars/hybrids-evs/how-much-do-cold-temperatures-affect-an-evs-driving-range-a5751769461/), Jeff S. Bartlett with Devin Pratt, Consumer Reports, updated 2025-02-14
- **Quote (tool):** "cold weather depletes about 25 percent of range when cruising at 70 mph" (vs mid-60s weather; test at about 16°F) / short cold-weather trips with frequent stops and cabin reheating "sap 50 percent of the range" / "Supplying cabin heat is a major draw, and there's the impact of maintaining battery temperature."
- **Source:** [EV range: the impact of speed and temperature](https://www.geotab.com/blog/ev-range-impact-of-speed-and-temperature/), Charlotte Argue, Geotab, 2023-11-30
- **Quote (tool):** sedan range peaks at 68°F at "a sluggish speed of about 19 mph", at 32°F the optimal speed is "doubled to 37 mph." / "At low speeds, a 10 degree change in temperature will have a much larger impact on range"
- **Source:** Recurrent 2025: "It takes more energy to warm up a cold car than to keep a warm car warm" (tool)
- **🧮 Per mile (C3):** a 4 kW heater costs 0.20 kWh per mile at 20 mph but 0.067 kWh per mile at 60 mph: a third as much per mile at three times the speed.
- **Note (fact-checker, 2026-11-09):** CR's 50% short-trip figure is from earlier testing and the article gives no date, temperature or vehicles (confirmed), so it is a different test from the ~25% at ~16°F: status 🟡 (attributed, "earlier testing"); the 25% is ✅. Say "earlier testing found about half on short trips". Don't voice "19 and 37 mph" (it's a constant-speed model). The safe ✅ line: "On the highway, Consumer Reports measured about a quarter less range. On short trips with stops, about half." Fairness: highway driving has its own penalty (drag), so the EV still uses more energy per mile at 70 mph; it's the **percentage lost to cold** that's smaller.

## 10. The cold battery itself: slower chemistry and weaker regen

- **Script (expected):** "The cold does slow the battery's chemistry, and it can't take back as much energy when you slow down. That costs range too, just less."
- **Status:** ✅ attributed (Recurrent, Geotab) / ✅ (fueleconomy.gov for regen) / ✅ peer-reviewed (Steinstraeter, Germany)
- **Source:** Recurrent 2025 (claim 6). Quote (tool): "Chemical and physical reactions in the battery occur more slowly in cold temperatures."
- **Source:** fueleconomy.gov cold weather. Quote (tool): "Battery performance decreases in cold weather" / "This also affects the performance of the regenerative braking system on hybrids, plug-in hybrids, and electric vehicles."
- **Source:** Steinstraeter et al. 2021 (claim 7). Quote (tool): "a limited capability to recuperate at low temperatures serves to protect the battery from accelerated aging" / range down "by up to 21.7% due to limited recuperation," / "which gives a combined maximum range decrease of approximately 50% under cold conditions." (BMW i3 and Tesla Model 3 data, Munich, 125+ trips)
- **Source:** CR 2025 (claim 9): "there's the impact of maintaining battery temperature." Many EVs spend battery energy warming the battery itself.
- **Note:** Two honest caveats for the script. (1) Steinstraeter's 21.7% is a **maximum** for one dataset in Germany, and it's large: the cold battery's share is not trivial in stop-and-go driving. (2) Some of the "cold car" loss is the car heating its own battery, which is heater energy too. So the cleanest line is "**much** of the loss is heat", or "most, in AAA's test", never "it's all the heater".

## 11. Charging is slower in the cold

- **Script (expected, optional):** "And a cold battery charges slower, so warm it before a fast charge."
- **Status:** ✅ (INL via Tech Briefs, carried) / ✅ peer-reviewed abstract / 🟡 (Recurrent)
- **Source:** [Empirical analysis of electric vehicle fast charging under cold temperatures](https://www.osti.gov/pages/biblio/1477732-empirical-analysis-electric-vehicle-fast-charging-under-cold-temperatures), Motoaki, Yi, Salisbury (INL), *Energy Policy* 122, 2018-07-24, doi:10.1016/j.enpol.2018.07.036
- **Quote (tool, abstract):** "DCFC charging rate can deteriorate considerably in cold temperatures"
- **Source (carried from `ev-charging/sources.md` W3, accessed 2026-10-27):** [EV charging in cold temperatures could pose challenges for drivers](https://www.techbriefs.com/component/content/article/33002-ev-charging-in-cold-temperatures-could-pose-challenges-for-drivers), Tech Briefs (reporting INL), 2018-09-21. Quote (tool): "But at 32 degrees, the battery's state of charge was 36 percent less after the same amount of time." / "Under the coldest conditions, the rate of charging was roughly three times slower than at warmer temperatures."
- **Source:** Recurrent 2025. Quote (tool): "To protect the high voltage battery, many cars limit the charging voltage when the battery is cold." (wording as returned; "voltage" may mean "rate", so the fact-checker should re-open it)
- **Note:** INL's data is old Nissan Leafs (no active battery heating), a worst case. With preconditioning, Recurrent found about 9 minutes longer on average (carried, 2024-01-18). Optional for a Short; it was covered in No. 012 `ev-charging`.

## 12. Real-world fleet numbers (milder than the lab)

- **Script (expected, optional):** "In real driving, a study of 30,000 US EVs found they kept about 70 percent of their range at 20 degrees."
- **Status:** 🟡 attributed (fleet-data company)
- **Source:** [Winter EV range loss](https://www.recurrentauto.com/research/winter-ev-range-loss), Andrew Garberson, Recurrent, 2025-11-19
- **Quote (tool):** "real-world driving data from more than 30,000 vehicles in the US." / "At 32F, on average, EVs retain 78% of their maximum range. Even at 20F, cars retain an average of 70% of their maximum range." / the best model keeps "88% of its maximum range at 32F," the worst "69%."
- **Source (0°F-ish):** Geotab 2025 (claim 8). Quote (tool): "At -15 C (5 F), EVs drop to 54% of their rated range"; "anonymised data from 5.2 million trips taken by 4,200 EVs representing 102 different make/model/year combinations"
- **Note:** Baselines differ: Recurrent compares with "maximum range" at ideal temperatures (70–80°F), Geotab with **rated** range, AAA with 75°F in a lab. Don't put them side by side as one series. Geotab's dataset dates from 2020 (older cars, fewer heat pumps). Recurrent hasn't published a 0°F number. Recurrent's "range" is estimated from the cars' own telematics, not measured drives.

## 13. The lost range comes back when it warms up

- **Script (expected):** "And it isn't damage. When it warms up, the range comes back."
- **Status:** ✅ attributed (Recurrent) / logically consistent with AAA's and fueleconomy.gov's framing (temporary operating loss)
- **Source:** Recurrent 2025 (claim 12)
- **Quote (tool):** "No, any range loss from winter weather is temporary and there is no long term detriment to your battery."
- **Note:** That's about the **winter range drop**. It's not a claim that cold never affects battery life: a very cold battery limits charging and regen precisely to protect it from aging (Steinstraeter, claim 10). "It isn't damage" ✅; "cold is good for the battery" ❌ (not sourced here).

## 14. Heat pumps move heat instead of making it, and fade in deep cold

- **Script (expected):** "Some EVs have a heat pump. Instead of making heat, it pulls heat in from the cold air outside, like a fridge running backwards. It can get several units of heat for each unit it uses. But the colder it gets, the less it helps."
- **Status:** ✅ attributed for the mechanism and fleet result (Recurrent) / 🟡 for "3–4 units" (Recurrent's figure, not measured in a car at a stated temperature) / 🟡 for deep cold (snippet-level lab work, building-heat-pump data)
- **Source:** [Heat pumps](https://recurrentauto.com/research/heat-pumps), Brandon August, Recurrent, 2024-11-25
- **Quote (tool):** "This method is very similar to air conditioning, but inverted." / "Thus, the heat pump is 3-4 times more efficient." / "For an EV however, there is very little waste heat." / "Heat pumps are way more efficient until the temperature drops far below freezing." / "verified data vehicles with heat pumps show an improvement in winter range of 8-10% near 30F."
- **Source:** Recurrent 2025 (claim 12). Quote (tool): "A heat pump works by transferring heat from the outside air, even in cold conditions." / "For every unit of electricity consumed, a heat pump can generate 3-4 units of heat" (opening clause) / heat pumps "extend EV range by 10% at 32F." / "It's worth noting that heat pump benefits diminish as temps drop toward 0F" (opening clause; the page says they become "about as efficient as a resistive heater")
- **Source (company page, undated):** [Is cabin heat reducing your winter EV range?](https://www.recurrentauto.com/research/hvac-is-killing-your-range), Recurrent. Quote (tool): heat pumps are "more energy efficient until around 10F." / "But, even at 14F, there is still a range benefit to using a heat pump."
- **Lead (snippet, MDPI 403):** Humphries & Loiselle-Lapointe, "Analysis of Heating System Impacts on Battery Electric Vehicle Operation at Cold Temperatures", *World Electric Vehicle Journal* 17(4):168, 2026 (expanded EVS38 paper). Two same-model BEVs (2022 with heat pump, 2020 with resistive heater) on a dynamometer in Ottawa: the heat pump was more efficient "especially at 0 °C"; at −10 °C (14°F) "the heat pump used more energy than the PTC heater on cold-start but was more efficient than the PTC heater once the cabin was warmed up." 🟡 until opened.
- **Lead (snippet, NREL PDF unreadable):** Meyer (Hanon), Lustbader (NREL) et al., SAE 2018-01-0066, Kia Soul EV: "~50% reduction in range when a positive temperature coefficient (PTC) (electric resistance) heater is used, and a ~30% improvement from the PTC range when a heat pump (HP) is utilized." Conditions not seen. 🟡
- **Principle (building heat pumps, not cars):** Gibb et al., "Coming in from the cold: Heat pump efficiency at low temperatures", *Joule* 2023, doi:10.1016/j.joule.2023.08.005, via [IIR news](https://iifiir.org/en/news/heat-pump-efficiency-at-low-temperatures), 2023-09-22. Quote (tool): "heat pumps were two to three times more efficient than oil and gas heating systems" (0°C to about −15°C) / near −30°C, "efficiencies around 1.5 times higher". Use only to back "they still work in the cold, just less well". Never as a car figure.
- **Note:** **Script-safe:** "can get several times more heat than the electricity it uses" (🟡 attributed to Recurrent, or hedge "can"), "the colder it gets, the less it helps; near zero it's about like a plain heater" (✅ attributed, Recurrent). **Don't** voice "3 to 4 times" as fact, don't say heat pumps "stop working", and don't claim a specific COP at a specific °F. Many heat-pump EVs still carry a resistive heater for the coldest conditions (NREL/Hanon snippet on the Kia Soul: "PTC is kept as backup"): 🟡, so leave it out or attribute it.

## 15. Preheating while plugged in: the heat comes from the wall

- **Script (expected):** "Warm the car while it's still plugged in, and that heat comes from the wall, not your range."
- **Status:** ✅ verified (EPA/DOE, AAA, CR)
- **Source:** fueleconomy.gov cold weather. Quote (tool): "preheating the cabin while plugged into the charger can extend your vehicle's range"
- **Source:** AAA 2019 (claim 2). Quote (tool): "Make time to “pre-heat” or cool down the inside of the vehicle while still connected to the charger."
- **Source:** CR 2025 (claim 9). Quote (tool): "our experts further advise to precondition the cabin/battery when connected to the charger." The January 2025 test at single-digit temperatures (cabin warmed to 72°F while plugged in): efficiency up about 5–7% across three AWD EVs (the article's own wording is "5 and 6 percent" and "7 percent"); the Acura ZDX and Tesla Model 3 predicted 16 and 10 more miles. The Kia EV9 showed **less** predicted range despite better efficiency.
- **Source:** Recurrent 2025. Quote (tool): "It takes more energy to warm up a cold car than to keep a warm car warm" / "Preconditioning is available in most EVs using your phone’s app or by setting up a departure time."
- **Note:** "From the wall, not your range" is a fair plain-words version of "while plugged in": the energy is drawn while connected, so the battery starts full and warm. One nuance: a weak Level 1 (120 V) outlet may not keep up with a big heater, so part can still come from the battery (❌ not sourced, don't voice either way). "Most EVs can do it from an app" ✅ attributed (Recurrent). "Preheat the battery before a fast charge" ✅ (CR: "takes energy and can take half an hour or more", per tool summary, not quoted).

## 16. Seat and steering-wheel heaters: heat you, not the air

- **Script (expected):** "Heated seats and a heated wheel warm you directly, for a fraction of the power."
- **Status:** ✅ for "use less energy than heating the cabin" (EPA/DOE, NREL) / ❌ for any watts figure / 🟡 "a fraction" (one modeled case, ThermoAnalytics)
- **Source:** fueleconomy.gov cold weather. Quote (tool): "using the seat warmers instead of the cabin heater can save energy and extend range."
- **Source:** NREL, Jeffers et al. 2016 (claim 6). Abstract (tool summary): zonal heating "cut cabin heating energy by 5.5% to 28.5% during a 20-minute warm-up"; the best zonal approach "improved EV range by 6.9% to 18.7% over baseline heating". (Summary wording, not a quote: re-quote before ✅.)
- **Source:** ThermoAnalytics/SAE 2020 (claim 8): HVAC only 3,334 W vs HVAC plus heated panels 942 W, same comfort (one optimized model).
- **Counterweight (CR 2025, claim 9):** at 23–31°F on a 130-mile mostly highway trip, climate off with seats and wheel only: "The cars displayed between 7 and 8 percent higher efficiency with the climate system off, which is notable." / "all test drivers commented how uncomfortably cold the interior of the car was." CR's takeaway: "the nominal benefit isn't worth the compromise."
- **Note:** **Important for honesty:** seat heaters are a **helper**, not a fix. The fair line: "Turn the cabin down a few degrees and let the seat and wheel heaters do the rest" (CR's own tip, seen only in a search snippet: "68º F instead of 75º F, for example"). Don't say "turn the heat off and use your seat". Watts per seat (forums: 40–100 W) ❌, don't voice.

## 17. Gas cars lose mileage in the cold too (fairness)

- **Script (expected):** "Gas cars lose mileage in the cold too, about 15 percent around town, more on short trips."
- **Status:** ✅ verified (EPA/DOE, ORNL analysis)
- **Source:** fueleconomy.gov cold weather
- **Quote (tool):** "a conventional gasoline car's gas mileage is roughly 15% lower at 20°F than it would be at 77°F." / "It can drop as much as 24% for short (3- to 4-mile) trips." / "expect conventional gasoline vehicles to suffer a 10% to 20% fuel economy loss in city driving" / "a 15% to 33% loss on short trips." / "Engine and transmission friction increases in cold temperatures due to cold engine oil and other drive-line fluids." / "It takes longer for your engine to reach its most fuel-efficient temperature." / hybrids: "Their fuel economy can drop about 30% to 34% under these conditions."
- **Note:** Scope: city driving, 20°F vs 77°F (EV figures use a 75°F baseline: close enough for a voice line, but don't put both on one chart as "same test"). The page cites an ORNL analysis and SAE 2013-01-1462 (Lohse-Busch et al., Argonne). Gas cars also lose on short trips, for the **same underlying reason in reverse**: the engine hasn't warmed up yet, so there's no free heat at first either.

---

## Our calculations (🧮)

Inputs: EPA ratings for the 2026 Chevrolet Equinox EV FWD (117 city / 100 highway MPGe) and Equinox FWD gas (26 city / 29 highway mpg) from [fueleconomy.gov](https://www.fueleconomy.gov/feg/bymodel/2026_Chevrolet_Equinox.shtml) (carried from `ev-cost/sources.md`, re-opened by the fact-checker 2026-11-05; not re-opened today). EPA test-cycle average speeds: city (FTP) 21.2 mph, highway (HWFET) 48.3 mph (carried from `hybrid-city/sources.md`). 33.7 kWh = 1 gallon of gasoline: "the energy in a gallon of gasoline equals the energy in 33.7 kilowatt hours (kWh) of electricity", attributed to the EPA ([AAA Club Alliance, What is MPGe](https://cluballiance.aaa.com/the-extra-mile/series/the-extra-mile-magazine/what-is-mpge-and-how-is-it-derived), 2023-04-25, tool; fueleconomy.gov itself not found stating it: 🟡). Heater 3–5 kW (Geotab, claim 8). The pair is an **example**, not the subject: keep the model out of the voice.

- **C1. How much heat a gas engine sheds.** Highway: 48.3 mph ÷ 29 mpg = 1.666 gal/h × 33.7 = **56 kW of fuel**; engine losses 64–69% → **36–39 kW**, mostly heat. City: 21.2 ÷ 26 = 0.815 gal/h × 33.7 = **27.5 kW**; losses 71–75% → **≈ 20 kW**. A 3–5 kW cabin heat demand is **about a tenth** of the highway waste heat and **a sixth to a quarter** in town. Caveats: cycle averages (idle and stop time vary); a cold engine sheds less usable heat for the first minutes; the 3–5 kW is Geotab's EV figure and we assume a similar cabin needs similar heat. **Script use:** "a gas engine throws off many times the heat you need." Don't voice kW.
- **C2. EV heater vs driving power.** City: 33.7 ÷ 117 = 0.288 kWh/mi × 21.2 mph = **6.1 kW** to drive → a 3–5 kW heater adds **49–82%**. Highway: 33.7 ÷ 100 = 0.337 kWh/mi × 48.3 mph = **16.3 kW** → adds **18–31%**. EPA kWh figures are wall-side (they include charging losses), so the battery-side driving power is somewhat lower and the heater's share slightly **higher** than shown. Cross-check: DOE's ">40% of energy use in city driving", ">25% highway" in very cold conditions (claim 8). ✓
- **C3. Heater per mile.** 4 kW (🎭 midpoint) ÷ 20 mph = **0.20 kWh/mi**; ÷ 60 mph = **0.067 kWh/mi**. Against EPA driving energy (0.29 city, 0.34 highway kWh/mi): **+69% in town vs +20% on the highway.** Matches CR's 50% short-trip vs 25% highway range loss in direction and rough size.
- **C4. The AAA split.** 41% (heater on) vs 12% (heater off) at 20°F → heating ≈ **29 points ≈ 70%** of the range loss. EPA/DOE (energy-based): "about two-thirds". → "About two-thirds heater, one-third cold car" in that test.
- **C5. Illustrative car, 250 miles in mild weather (🎭 round number).** 32°F, real-world average (Recurrent 78%): **≈ 195 mi**. 20°F real-world (Recurrent 70%): **≈ 175 mi**. 20°F lab, heater on throughout (AAA 59%): **≈ 148 mi**. 5°F (Geotab 54% of rated): **≈ 135 mi**. Baselines differ (claim 12), so show one at a time, labeled with its source, or use only Recurrent's pair.

---

## Myths (hook and comment material)

| Myth | What the evidence says | Status |
| --- | --- | --- |
| "The cold drains the battery." | Half right. In AAA's 20°F test, heater off cost 12% of range, heater on 41%: about two-thirds of the extra energy went to heat (EPA/DOE). Geotab: battery sluggishness "has far less impact on range than auxiliary load." | ✅ (B, claims 2–3) |
| "Winter permanently kills EV batteries." | The winter range drop is temporary: "there is no long term detriment to your battery" (Recurrent). The car limits charging and regen when cold precisely to protect the battery. | ✅ attributed (claims 10, 13) |
| "Gas cars don't care about the cold." | About 15% worse mpg at 20°F in town, up to 24% on 3–4-mile trips; hybrids 30–34%. | ✅ (claim 17) |
| "EVs lose half their range in winter." | It depends on trip and car. Real-world fleet average at 20°F: about 70% kept (Recurrent). CR: about 25% lost at 70 mph, about 50% on short stop-and-go trips. Lab worst case at 20°F with the heater on: 41% lost (AAA). | ✅ / 🟡 (claims 2, 9, 12) |
| "Heat pumps don't work in the cold." | They work below freezing, still beat a plain heater at 14°F (Recurrent), and fade toward 0°F, where they're "about as efficient as a resistive heater". | 🟡 attributed (claim 14) |
| "Just use the heated seat and turn off the heat." | Seats and wheel use far less power than heating air (DOE: "can save energy and extend range"), but CR found only 7–8% better efficiency at 23–31°F with the climate off, and testers were "uncomfortably cold." Turn the cabin down a bit instead. | ✅ (claim 16) |
| "Preheating wastes energy." | Preheating on the plug draws from the grid, and the car starts warm (DOE, AAA, CR: 5–7% better efficiency in CR's test). It isn't free, it just doesn't come out of the range. | ✅ (claim 15) |
| "An EV makes no heat at all." | It makes a little: electric drive losses are 15–20% (DOE), and some cars reuse it. Just not nearly enough to heat a cabin. | ✅ (claim 6) |

## Angles (2–3, with hook sentences)

- **A (owner-agreed, recommended): the free heat a gas car throws away.** Hook (honest version): "A gas car heats you with heat it was going to throw away. An EV has to make its heat from the battery that drives it." Picture: two cut-open cars side by side at 20°F. The gas car's engine glows orange, with most of the orange pouring out of the radiator and exhaust and a thin branch running through the heater core into the cabin. The EV's floor battery sends an orange line to a small heater, and the range gauge ticks down.
- **B: the heater runs on the clock.** Hook: "In winter, an electric car's biggest drain isn't the miles. It's the minutes." (✅ as framing; supported by CR 25% vs 50% and C3.) Picture: a clock and an odometer on the dash; on a slow city loop the clock spins and the gauge drops, on the highway the miles fly by and the gauge barely moves.
- **C: warm it from the wall.** Hook: "The cheapest heat an electric car can get is the heat it makes before you unplug." (🟡: "cheapest" is our inference from claim 15, so "the best heat" or "the heat that costs no range" is safer ✅.) Picture: a garage at dawn, orange current flowing from the wall into the car's heater, the battery gauge staying full.

**Backup hooks (inside angle A):**

1. "Most of the range an electric car loses in the cold isn't the cold battery. It's keeping you warm." (✅ with AAA scope; "much of" is safer for real-world)
2. "Your gas car's heater is free. It runs on heat the engine was going to throw away anyway." (✅; sets up the EV contrast)
3. "An electric car in winter isn't losing range to the cold. It's spending it on you." (🟡 rhetoric: the cold battery takes about a third, so pair with the "partly" beat)

## Visual notes for the director

- **Recurring objects:** one generic gas sedan and one generic EV (no badges), cut open, same size, side by side or in alternating cuts. Gas car: engine block, coolant hoses, radiator at the front, heater core behind the dash, blower fan. EV: battery floor, motor at the axle, a small heater box behind the dash (and, for the heat-pump beat, a compressor and an outside heat exchanger at the front).
- **Orange = the hidden system** (house rule): **heat flow**. Gas car: a fat orange flow from the engine, most of it leaving through the radiator grille and exhaust (thrown away), and a thin branch through the heater core to the cabin (free). EV: a thin orange line from the battery to the heater, with a range gauge or battery bar draining in step. Keep the cold neutral blue-grey, not orange.
- **Thermometer in °F** as a small chip (20°F). Range in miles. Round numbers only (about 40%, about 12%).
- **The split beat:** one range bar at 20°F, split into a small "cold car" slice (≈ one-third) and a larger "heat" slice (≈ two-thirds), labeled "one lab test" in the voice, not on screen.
- **Clock vs odometer (angle B):** a slow city loop with a clock face spinning; a highway run with the odometer rolling. Wheels roll forward (motion rule).
- **Heat pump:** faint orange wisps pulled **in** from the cold outside air into the compressor and pushed into the cabin (moving heat, not making it). As the thermometer drops toward 0°F, the wisps thin out.
- **Preheat:** a garage at night, cable plugged in, orange from the wall socket to the cabin, battery bar full. Then unplug and drive off warm.
- **Seat heater:** a small orange glow in the seat and wheel only, with the cabin air staying grey. One beat.
- **Phone face rule:** if the preheat is started from a phone app, the phone faces its owner, and the screen is read through the detail box.
- **Avoid:** an ice-covered or cracked battery (implies damage, ❌); "battery frozen"; brand logos; kW numbers on screen beyond one heater chip; a "40% more energy" card (wrong math: a 39% efficiency drop is ≈ 64% more energy per mile, see `ev-cost` claim 17); putting AAA, Recurrent and Geotab percentages on one chart (different baselines).

## Script-safe lines (✅ as worded; 🟡 noted; °F and miles)

1. "A gas car heats you with heat it was going to throw away. An EV has to make its heat from the same battery that drives it." (✅; the owner's "pays for every degree" is 🟡, see H)
2. 🟡 "You've probably heard the cold drains an electric car's battery. That's only part of it." (framing; Geotab: "People often assume…")
3. "In one lab test at 20 degrees, range dropped about 40 percent with the heater on, and about 12 percent with it off." (✅ AAA 2019)
4. "About two-thirds of the extra energy went to heating the cabin." (✅ EPA/DOE citing AAA; say "in that test" if context is unclear)
5. "A gas engine loses most of its fuel's energy as heat." (✅ fueleconomy.gov)
6. "Coolant carries that heat through a little radiator behind the dashboard, and a fan blows it at you." (✅ GM patent; "little radiator" = heater core)
7. "An electric motor wastes so little that there's almost no heat to borrow." (✅ DOE 15–20% vs 64–75%)
8. 🟡 "Heating the air can take three to five kilowatts. Around town, that's about half again what it takes to move the car." (Geotab + 🧮 C2; or drop the number: "Around town, heat can be a big share of everything the car uses", ✅ DOE ">40% of energy use in city driving")
9. "The heater runs by the minute, not the mile." (✅ framing, C3)
10. "On the highway, testers measured about a quarter less range in the cold. On short trips with stops, about half." (✅ CR, 2025 update. Brand rule: "testers" or "one consumer group" in the voice, Consumer Reports in the description)
11. "The cold battery costs some range too. Its chemistry slows down, and it can't take back as much energy when you brake." (✅ fueleconomy.gov + Recurrent)
12. 🟡 "And a cold battery charges more slowly." (✅ INL abstract: "can deteriorate considerably")
13. "It isn't damage. When it warms up, the range comes back." (✅ attributed: Recurrent "temporary")
14. 🟡 "A heat pump doesn't make heat. It pulls it in from the cold air outside, and it can get several times more heat than the electricity it uses." (mechanism ✅; "several times" is Recurrent's 3–4 with "can")
15. "But the colder it gets, the less a heat pump helps. Near zero, it's about like a plain heater." (✅ attributed, Recurrent)
16. "Warm the car while it's still plugged in, and the heat comes from the wall, not your range." (✅ DOE, AAA, CR)
17. "Heated seats and a heated wheel warm you, not the air, and use less energy." (✅ DOE "can save energy")
18. "Gas cars lose mileage in the cold too, about 15 percent around town." (✅ fueleconomy.gov, 20°F city)

**Not script-safe:** "it's all the heater" / "the battery has nothing to do with it" (❌, claims 3, 10); "EVs lose half their range in winter" as a general fact (❌, only short trips per CR); "heat pumps stop working in the cold" (❌); "a heat pump is 3–4 times more efficient" as fact (🟡 company figure, hedge it); any seat-heater watts figure (❌); "turn off the heat and use the seat heater" (contradicted by CR's comfort finding); "cold is good for the battery" (❌); "uses 40% more energy in the cold" (❌ math); kW of gas waste heat in the voice (🧮, too fiddly); naming Tesla, GM, Ford, Recurrent or Geotab in the voice as citations (brand rule: attribute as "one lab test", "one study of 30,000 US EVs", "the EPA").
