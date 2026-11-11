# Sources: home-heat (No. 018)

Researcher draft, 2026-11-11. There's no script yet, so the claims follow the owner-approved beat order: hook (a heat pump puts more heat into the house than the electricity it uses) → belief ("nothing can be more than 100% efficient") → the house on one cold night, three ways to heat it: **make** heat from electricity (space heater, baseboard), **make** heat from fuel (gas furnace, heat exchanger, vent), **move** heat (heat pump) → how it pulls heat out of freezing air → what it costs it in deep cold (lower COP, defrost, aux strips) → the same choice in an EV (one line) → turn it back on the viewer. The statuses are my starting confidence. The fact-checker sets the final ones.

Owner-approved angle (2026-11-11): "Make heat vs move heat". One US house on one cold night. Hook direction: "A heat pump puts more heat into your house than the electricity it uses." **Read section H (hook check) before scripting: the hook holds as worded. "More than 100% efficient" needs a careful framing.**

Everything was accessed on 2026-11-11 unless noted. **How to read the quotes** (same rules as `ev-winter/sources.md`):

- **(tool)** means the web tool's small model returned the quote from the page. Re-open and re-quote before ✅. **(verbatim)** means I asked the tool for word-for-word text and it returned it as exact.
- **(snippet)** means I saw it only in a search-result summary and didn't open the page. It's a lead only (🟡 at best).
- **(carried)** means the quote comes from an earlier video's sources.md and I didn't re-open it today.
- **🧮** means our own calculation. The inputs are sourced and the working is shown.
- **Canada:** Natural Resources Canada (NRCan) is a national government agency, neutral, and has the clearest plain-language explanation of the heat pump cycle, defrost and backup heat I could open. Its measured numbers are from Canadian tests (Ottawa). The physics is the same in the US. For the voice, "one government test house" or "Canadian government tests" is fine; convert °C to °F (done below).
- **Couldn't open:** every energy.gov Energy Saver page (electric resistance heating, heat pump systems, air-source heat pumps, furnaces and boilers: all 404 again, both old and new URLs); web.archive.org (tool blocked); the Joule paper itself (Elsevier/Cell 403, so it's via IIR and Canary Media coverage); every PDF I tried came back as unreadable compressed binary: EIA RECS tables (HC 6.1, State Space Heating, State Space Heating Fuels, the xlsx too), NREL/NLR cold-climate field report 84745 (over 10 MB), PNNL Cold Climate Heat Pump Challenge field report, CEE Minnesota field reports, ACEEE 2016/2024 papers, NRCan EBCx fact sheet, R-410A SDS. **Not found:** a neutral US government source I could open for "electric resistance heating is 100% efficient" (the DOE sentence exists, seen only as a snippet); a neutral source for the 1,500 W space-heater figure (retail/consumer press only); US field-measured COP at a specific °F that I could read (the US field reports are PDFs I couldn't parse, so the US numbers are rating floors; measured numbers are Canadian or from coverage of the Joule meta-study).

---

## FACT-CHECK of script v1 (fact-checker, 2026-11-11)

**Verdict: FAIL (no ❌ claims, but two wording fixes are required before voice: L9 and L10). Five more fixes are recommended: L1, L4, L5, L7, L11.** Everything below was re-opened on 2026-11-11. Quotes marked "(re-quoted)" came from the page-fetch tool, whose small model sometimes paraphrases or shortens, so they are exact only where I say "exact". Legally sensitive: none of the voice lines names a company or a person ("one government test house" names no agency). Named-company and agency risk is in the description only: NRCan/NRC, Trane (a company glossary), Recurrent (a private firm with commercial interests), ENERGY STAR (EPA).

**Required fixes (exact replacement wording):**

1. **L9** (defrost): the source never says "freezing nights" or "cold, damp". The researcher's "cold, damp" was a paraphrase, and NRCan (re-quoted) says frost forms when the outdoor temperature "falls to near or below freezing" and that "The amount of frost buildup depends on the outdoor temperature and the amount of moisture in the air." So "On freezing nights, frost builds" is too narrow (near freezing counts too) and too absolute (dry cold builds little). Replace with: **"On cold, damp nights, frost can build on the outdoor coil, so the heat pump briefly runs as an air conditioner to melt it."** ("Briefly" is framing: NRCan gives no duration, so keep it without a number.)
2. **L10** (backup strips): NRCan (re-quoted): "Supplementary heating may also be required when the heat pump is defrosting." Strips in the ductwork are what an all-electric system has ("heat pump operations are supplemented with electric resistance elements located in the ductwork"); dual-fuel homes use a gas furnace and some homes have nothing. The script states it as certain and universal. Replace with: **"Meanwhile, if the house has backup strips in the ducts, they can heat the air like a space heater."** Equivalent shorter option: **"Meanwhile, backup strips in the ducts can kick in and heat the air like a space heater."** ("Like a space heater" is ✅: ACHR, re-quoted, auxiliary electric resistance "may operate at a coefficient of performance (COP) at or near 1.0".)

**Recommended fixes:**

- **L1:** "because most of that heat was already outside". At the mild COP of 3, two thirds of the heat comes from outside, so "most" holds. At the script's own L8 number (COP 1.5 at 6 below), only one third does, so "most" fails there and the line reads as a general rule. Safer, exact by the energy balance Qh = Qc + W (OpenStax): **"...because the extra heat was already outside."** or **"...because much of that heat was already outside."**
- **L4:** see the detailed ruling below. Recommended: **"A gas furnace makes heat too, and a standard 80 percent one wastes a fifth of its fuel's energy, much of it up the vent."** ("Standard" instead of "older": see below.)
- **L5:** the source (ACHR) says the evaporating refrigerant is "typically" 10°-20°F colder than the outdoor air. The script drops "typically" and adds "night". Recommended: **"...with a liquid in its outdoor coil usually kept 10 to 20 degrees colder than the air."** (In a running system pressure sets that temperature, so "kept" is loose but fine for the picture; do not give the coil a number.)
- **L7:** "one government test house". Fair attribution (see below), but US viewers will hear "our government". Recommended: **"So at a mild 40 degrees, one Canadian government test house got about three units of heat per unit of electricity."** The "night" is not in the source (it is an average at that outdoor temperature); it's harmless because COP follows outdoor temperature, not the clock, but "at a mild 40 degrees" is exact. L8 then reads "At 6 below zero, the same house..." (no change).
- **L11:** ✅ for the facts; the "choice" is the carmaker's, not the driver's, and some EVs use only a resistive heater. Optional precision: **"Electric cars have the same two options: make heat, or move it."** Not required.

### Rulings on the points the brief asked about

**L4 "an older one rated 80 percent loses a fifth of that heat, much of it up the vent": 🟡 as worded, ✅ with the recommended wording.**
- AFUE is the share of the fuel's energy that becomes heat for the house. Trane (company glossary, re-quoted exact): "This means 80% of the energy used by this furnace is becoming heat while 20% of it is being wasted." and "AFUE, or Annual Fuel Utilization Efficiency, measures how efficiently a furnace converts fuel to heat."
- "Loses a fifth of that heat": defensible if "that heat" means the heat the burner makes (a fifth of what's burned never reaches the house), but the source says "energy used", i.e. fuel, and "that heat" can also be heard as the heat delivered. Wording with the source's own noun ("a fifth of its fuel's energy") is exact; "that heat" is loose, not wrong. Not a ❌.
- "Much of it up the vent": ✅ qualitatively, 🟡 for a split. PNNL Building America Solution Center, Combustion Furnaces (re-quoted): "Because so much of the heat goes up the flue" (Category I furnaces); the same page says ≥80% AFUE furnaces today are induced-draft or direct-vent. Trane names "a chimney, leaks out of the system" and does not say "vent". No source gives the split, and AFUE also counts standby and cycling losses (search summary of retail sources only, not usable). "Much of it" is the right hedge. Don't say "most" or "all of it".
- "an older one rated 80 percent": 80% non-condensing furnaces are still sold (PNNL: "all ≥80% AFUE furnaces available today are induced draft fan equipped or direct-vent furnaces"), so "older" is loose. Use "standard" or "non-condensing".

**L5 liquid "kept 10 to 20 degrees colder than the night air": ✅ with "typically"; the script dropped the hedge.** ACHR News, Heat Pump Cycle Fundamentals, 2022-07-18 (re-quoted, shortened by the tool): the evaporating refrigerant in the outdoor coil is "typically 10°-20°F colder" than the outdoor air. NRCan's page does not state this (re-checked: it has no "kept colder than outdoor air" text; its only colder-than line is about the ground loop). The ACHR figure is trade press, one source, so it stays ✅ attributed/hedged ("usually"). "Night" isn't in the source (harmless).

**L7–L8 "one government test house" and the numbers: ✅ for the numbers, ✅ for "government" (fair), with caveats.**
- NRCan/NRC/CMHC, Cooling and Heating Season Performance Assessment of a cold climate air source heat pump at the Canadian Centre for Housing Technology, 2013-09 (re-quoted): "In heating, the COP ranged from an average of 1.5 at -21.1°C outdoor temperature to 3.0 at +4.9°C". +4.9°C = 40.8°F ("a mild 40-degree" is fair); −21.1°C = −5.98°F ("6 below zero" is exact). The houses are unoccupied research houses with simulated occupancy ("Occupancy is simulated by computer controlled operation of lights and appliances"), in Ottawa. The page names NRCan and NRC authors but does not say who owns the house. A web search (not a primary page I could quote) describes the Canadian Centre for Housing Technology as a joint facility of the National Research Council, Natural Resources Canada and CMHC, three federal bodies. So "government test house" is fair; "Canadian government" is more exact. The COP values are averages over the heating season at those outdoor temperatures, from one cold-climate (premium) unit, 2013.
- "more than a space heater" (L8): 1.5 > 1 ✅. Scope note: NRCan's own range for typical units at −8°C (18°F) is "1.1 to 3.7", and Recurrent says EV heat pump benefits "diminish as temps drop toward 0F, at which point they are about as efficient as a resistive heater". So 1.5 at −6°F is a good unit's average, not a guarantee. The script's "one ... test house" scope carries it; don't generalise to "heat pumps at 6 below".
- US field data: could not open. nrel.gov and research-hub.nrel.gov fail DNS from here (the lab moved to nlr.gov). NREL/TP-5500-84745 (Winkler and Ramaraj, 2023, "Field Validation of Air-Source Heat Pumps for Cold Climates"): the OSTI abstract page opened (osti.gov/biblio/1973090) and heatpumpdata.energy.gov opened, but **neither gives a COP at any temperature**; they say only that airside and power measurements at 5-second intervals quantified "capacity, coefficient of performance (COP), and auxiliary heater energy consumption" at mostly Pacific Northwest sites (13 systems, per a search summary). The COP-by-temperature numbers are inside the PDF, which I could not read. The PNNL cold-climate sizing page opened (basc.pnnl.gov) and has no field COP values either (only the ENERGY STAR floor "COP at 5°F ≥ 1.75 (when operating at maximum capacity)"). NEEP: not opened (the specification PDF is unreadable; the PNNL page repeats its 1.75). So **no US field data supports or contradicts the 3.0 and 1.5 figures**; they rest on the Canadian test, with the ENERGY STAR floor (≥1.75 at 5°F, a lab minimum for labeled models only) consistent with 1.5 at −6°F.

**L9 defrost: 🟡 as worded, ✅ with the required fix.** NRCan, Heating and cooling with a heat pump (date modified 2025-12-24, re-quoted): "First, the reversing valve switches the device to the cooling mode." / "This sends hot gas to the outdoor coil to melt the frost." / "While this is happening, the heat pump is cooling the air in the ductwork." / "The amount of frost buildup depends on the outdoor temperature and the amount of moisture in the air." / "The cycle can be initiated every 30, 60 or 90 minutes" (from the earlier check). "Runs as an air conditioner" is a fair gloss of "switches ... to the cooling mode". The "cold, damp" in the researcher's note is not NRCan's wording.

**L10 backup strips: 🟡 as worded, ✅ with the required fix.** See the fix list. The NRCan 2013 test also shows it in practice: the unit "included a 10 kW (34,000 Btu/h) backup electric resistance heater, which served to temper the cooler supply air" during defrost (re-quoted).

**L11 EV link: ✅ attributed.** Recurrent (re-quoted): heat pumps work "by transferring heat from the outside air, even in cold conditions" and "The heaters that keep the car warm generally draw energy from the high voltage battery". fueleconomy.gov (EPA/DOE, re-quoted): "all heat must be provided by electricity" (the page does not mention heat pumps or resistance heaters in EVs, so it supports the make-heat half only). The same make-or-move choice exists in EVs as two designs; the line voices no number.

**Researcher's open items:**
- **EIA 13% heat-pump share (not in the script): stays 🟡.** A search summary says HC 6.1 lists heat pump 16.13 million of 123.53 million homes (13.1% is the tool's own division) and ductless 1.06 million separately; I could not read the PDFs (State Space Heating and HC 6.1 both returned compressed binary) and the HTML page has no table. Don't use it in the voice until a reader opens the table.
- **NRCan cutoff temperature: ✅ (re-quoted).** "Cut-off temperature: The minimum operating temperature for the heat pump" and "for newer models, the minimum operating temperature can range from between -15°C to -25°C" = 5°F to −13°F. "Below this temperature, only the supplementary heating system operates" (the tool's quote is from the ground-source section, so use it only for the cutoff idea). Not in the script.
- **Also re-checked:** ENERGY STAR key criteria (exact): "COP at 5° F ≥ 1.75, measured in accordance with Appendix M1 H42 test." (no version or date on the page). EIA 66324 (re-quoted): 42% electricity, 47% natural gas, 2024 (not in the script).

### Line by line

| Line | Claim | Status | Fix |
| --- | --- | --- | --- |
| L1 | A heat pump puts more heat in than the electricity it uses | ✅ | None. OpenStax exact: COP_hp "is always greater than 1" (claims 8–9 below). |
| L1 | ...because most of that heat was already outside | 🟡 | True at COP 3 (two thirds), not at COP 1.5 (one third, L8's own number). "...because the extra heat was already outside." |
| L2 | "nothing is supposed to beat 100 percent" | 🟡 framing | No survey of the belief, and "sounds impossible" doesn't claim one. Fine. |
| L3 | For making heat the limit is 100%; a space heater gets 1 unit per unit | ✅ | None. Canary Media (2023, Joule study): "Fossil-fuel and electric-resistance heating hit a thermodynamic limit at 100 percent efficiency, or a COP of 1." DOE sentence still snippet-only (404). |
| L4 | A gas furnace makes heat | ✅ | None. |
| L4 | Older one rated 80% "loses a fifth of that heat" | 🟡 | Source says energy/fuel: "a fifth of its fuel's energy". See ruling. |
| L4 | ...much of it up the vent | 🟡 (✅ for "much") | PNNL: "so much of the heat goes up the flue" (Category I). No source gives a split; keep "much". |
| L4 | "older one rated 80 percent" | 🟡 | 80% units are still sold; say "standard". |
| L5 | A heat pump moves heat in with a liquid in its outdoor coil | ✅ | NRCan: "The liquid refrigerant absorbs heat from the outdoor air and boils". |
| L5 | Liquid kept 10 to 20 degrees colder than the night air | ✅ attributed (hedge dropped) | ACHR 2022: "typically 10°-20°F colder" than outdoor air. Say "usually"; "night" is not in the source. |
| L6 | Heat flows from the air into the liquid | ✅ | NRCan: refrigerant "absorbs heat from the outdoor air". |
| L6 | A compressor squeezes it hot enough to warm the house | ✅ | NRCan: "The vapour is then compressed, reducing its volume and causing it to heat up." (It compresses the vapor; "it" is loose but fine.) |
| L7 | A government test house | ✅ | Federal joint facility (NRC, NRCan, CMHC; search summary). Say "Canadian". |
| L7 | At a mild 40 degrees, about three units per unit of electricity | ✅ | NRCan/NRC 2013: COP 3.0 at +4.9°C (40.8°F), an average, one cold-climate unit. "Night" not in the source (harmless). |
| L8 | At 6 below zero, the same house still got one and a half | ✅ | Same source: 1.5 at −21.1°C (−6°F). |
| L8 | ...more than a space heater | ✅ | 1.5 > 1. Not a guarantee for other units (NRCan 1.1 to 3.7 at 18°F). |
| L9 | On freezing nights, frost builds on the outdoor coil | 🟡 | Source: "near or below freezing" and moisture-dependent. **Required:** "On cold, damp nights, frost can build..." |
| L9 | ...so the heat pump briefly runs as an air conditioner to melt it | ✅ (briefly 🟡 framing) | NRCan: "switches the device to the cooling mode" ... "hot gas to the outdoor coil to melt the frost". No duration given; keep no number. |
| L10 | Backup strips in the ducts heat the house like a space heater while it defrosts | 🟡 | NRCan: "Supplementary heating may also be required when the heat pump is defrosting." **Required:** "Meanwhile, if the house has backup strips in the ducts, they can heat the air like a space heater." |
| L11 | An electric car faces the same choice, making heat or moving it | ✅ attributed | Recurrent (heat pump "transferring heat from the outside air"; heaters "draw energy from the high voltage battery"); fueleconomy.gov "all heat must be provided by electricity". |
| L12 | Closing question | n/a | No claim. |

**Description lines needed (publisher):** NRCan/NRC/CMHC test-house paper (Sager, Armstrong, Szadkowski, 2013-09: COP 3.0 at 41°F, 1.5 at −6°F, one cold-climate unit in an unoccupied Ottawa research house); NRCan, Heating and cooling with a heat pump (modified 2025-12-24: mechanism, defrost, backup strips); ACHR News 2022-07-18 (10°–20°F colder; COP near 1.0 with auxiliary heat); Canary Media 2023-09-13 (Joule study; COP 1 limit); OpenStax College Physics 2e § 15.5; Trane glossary (AFUE definition) and PNNL Building America Solution Center (flue losses); Recurrent 2025-11-19 and fueleconomy.gov (EV link). Illustrative: none claimed.

---

## Re-check of script v3 (fact-checker, 2026-11-11)

**Verdict: PASS.** No ❌ and no required fixes. All v1 required fixes are in the script (L9 defrost wording, the L10 backup-strips line cut). I did not re-open the pages today, because no claim now rests on a source I hadn't already opened for the v1 check on the same day. Quotes and numbers are the ones recorded in the v1 section above. Legally sensitive: none. The voice names no company, agency or person ("one Canadian government test house" names no agency). Named-source risk stays in the description only (NRCan/NRC/CMHC, Trane, ACHR, PNNL, Recurrent).

**Line by line (v3 numbering, 14 lines; the old backup-strips line is gone, so old L11 to L12 are now L11 to L14):**

| Line | Claim | Status | Source / note |
| --- | --- | --- | --- |
| L1 | A heat pump puts more heat in than the electricity it uses, because the extra heat was already outside | ✅ | OpenStax: COP_hp "is always greater than 1"; Qh = Qc + W. "The extra heat" is exact at any COP, and my v1 fix is applied. |
| L2 | "nothing is supposed to beat 100 percent" | 🟡 framing | No claim about what people believe is made beyond "sounds impossible". Fine. |
| L3 | Making heat is capped at 100 percent; a space heater gets one unit of heat per unit of electricity | ✅ | Canary Media 2023 (Joule study): "Fossil-fuel and electric-resistance heating hit a thermodynamic limit at 100 percent efficiency, or a COP of 1." The DOE sentence is still snippet-only, but it isn't needed. "That's true when you make heat" is scoped correctly: it makes the "true" about making heat, not about all heating. |
| L4 | A gas furnace makes heat too | ✅ | Patent US5859363 (burner heats the heat exchanger); the claim is plain. |
| L5 | A standard furnace rated 80 percent wastes a fifth of its fuel's energy, much of it up the vent | ✅ (✅ definition, 🟡 "much of it" kept hedged) | Trane glossary: "80% of the energy used by this furnace is becoming heat while 20% of it is being wasted." PNNL BASC: "so much of the heat goes up the flue". No source gives the split, so "much of it" is the right hedge. Do not change it to "most" or "all". "Standard" holds: 80% non-condensing units are still sold (PNNL). |
| L6 | A heat pump moves heat in from outside instead | ✅ | NRCan: refrigerant "absorbs heat from the outdoor air"; OpenStax "additional heat transfer of Qc from the outside". |
| L7 | The liquid in the outdoor coil is usually kept 10 to 20 degrees colder than the air | ✅ attributed | ACHR News 2022: evaporating refrigerant is "typically 10°-20°F colder" than the outdoor air. "Usually" carries the source's hedge. One trade-press source. |
| L8 | Heat flows from the air into the liquid, and a compressor squeezes it until it's hot enough to warm the house | ✅ | NRCan: "absorbs heat from the outdoor air and boils" / "The vapour is then compressed ... causing it to heat up." Optional precision only: "squeezes it" refers back to the liquid, but the compressor squeezes the vapor. Not wrong enough to require a change. |
| L9 | At a mild 40 degrees, one Canadian government test house got about three units of heat per unit of electricity | ✅ | NRCan/NRC 2013: COP "3.0 at +4.9°C" = 40.8°F. "About three" and "mild 40" are exact. One cold-climate unit, an average at that outdoor temperature. "Government" rests on a search summary (federal joint facility: NRC, NRCan, CMHC). The paper itself names NRCan and NRC authors. Fair. |
| L10 | At 6 below zero, the same house got one and a half, which still beats a space heater | ✅ | Same source: COP 1.5 at −21.1°C = −5.98°F. 1.5 > 1 is arithmetic. Scope stays "the same house". This is one good unit's average, not a guarantee for every heat pump (NRCan's own range for typical units at 18°F is 1.1 to 3.7). Do not widen this line to "heat pumps at 6 below". |
| L11 | That outdoor coil can also collect frost on cold, damp nights | ✅ hedged | NRCan: frost forms when outdoor temperature "falls to near or below freezing", and "The amount of frost buildup depends on the outdoor temperature and the amount of moisture in the air." "Can" carries the hedge. |
| L12 | To melt the frost, the heat pump briefly runs as an air conditioner | ✅ ("briefly" is framing) | NRCan: "the reversing valve switches the device to the cooling mode" ... "sends hot gas to the outdoor coil to melt the frost." No duration is given, so keep it without a number. The line is conditional on frost, so dropping "can" is fine. |
| L13 | Electric cars face the same choice, between a plain heater that makes heat and a heat pump that moves it | ✅ attributed (🟡 on "choice") | Recurrent (carried from ev-winter, re-opened in v1): heat pumps work "by transferring heat from the outside air"; the other heaters "generally draw energy from the high voltage battery". fueleconomy.gov: "all heat must be provided by electricity" (supports the make-heat half only). The "choice" is the carmaker's, not the driver's, and some EVs have only a resistive heater. The line says "face", which is fine for the two designs. If the owner wants it tighter: **"Electric cars come in both kinds: a plain heater that makes heat, or a heat pump that moves it."** Not required. The new "Even" adds no claim. |
| L14 | "does your house make its heat, or move it?" | n/a | Question, no claim. |

**Drift check against the v1 rulings:**

- Every number in the voice is unchanged and sourced: 100 percent, one unit per unit, 80 percent, a fifth, 10 to 20 degrees, 40 degrees, three units, 6 below zero, one and a half. No new number, company or person was added.
- No dropped hedge: "usually" (L7), "much of it" (L5), "can" (L11), "one ... test house" and "the same house" (L9 to L10) are all there.
- With the backup-strips line cut, nothing voiced is now contradicted by an omitted caveat. The video does not claim a heat pump heats the house during defrost, and it does not say heat pumps work at every temperature. No cutoff-temperature claim is made. L10's "6 below" is scoped to the test house.
- L1 and L10 are consistent: the "extra heat was already outside" holds at COP 1.5 (one third from outside) as well as COP 3.
- L3 and L5 are consistent: a furnace "makes heat too" and is below 100 percent, while L3's "100 percent" limit applies to making heat. No contradiction.

**Fixes: none required. Optional, with exact wording:**

1. L8 (precision): "...and a compressor squeezes **the vapor** until it's hot enough to warm the house."
2. L13 (precision): "Electric cars come in both kinds: a plain heater that makes heat, or a heat pump that moves it."

**Description lines (publisher):** the v1 list stands, minus the backup-strips use. ACHR's "COP at or near 1.0" quote is no longer needed. Keep NRCan (test-house paper, 2013-09, and the heat-pump guide, modified 2025-12-24), ACHR News 2022-07-18 (10°-20°F colder), Canary Media 2023-09-13, OpenStax § 15.5, Trane (AFUE), PNNL BASC (flue losses), Recurrent 2025-11-19 and fueleconomy.gov. Illustrative: none claimed.

---

## FACT-CHECK of script v5 (fact-checker, 2026-11-11)

**Verdict: FAIL (no ❌ claims; one wording fix is required before voice: L9).** L1 and L11–L16 are unchanged from v3/v4, so I did not re-check them. L3–L10 were re-checked by re-opening NRCan, OpenStax College Physics 2e (§ 15.3) and OpenStax University Physics vol. 2 (§ 3.6) on 2026-11-11. Quotes are from the page-fetch tool (its small model may shorten); I flag which were returned word for word. Legally sensitive: none. The voice names no company, agency or person ("one Canadian government test house" names no agency). NRCan and OpenStax are description-only.

**Required fix (exact replacement wording):**

1. **L9:** the script says "The electricity **only** runs the compressor, and the rest came in from outside." Two problems. (a) "Only" is false as a statement about the machine: the outdoor fan and the indoor blower also draw electricity (NRCan: during defrost "the outdoor fan is turned off", so a fan exists and runs otherwise; tool summary). (b) "The rest" is ambiguous: it can be heard as "the rest of the electricity" or as "everything the compressor doesn't produce". The energy balance is Qh = Qc + W (OpenStax § 15.5): the house gets the outdoor heat **plus** the work put in, so the compressor's electricity also ends up as heat in the house, and what came from outside is the heat beyond the electricity. Replace with: **"The electricity runs the compressor, and the rest of the heat comes in from outside."** (Drops "only", names "the heat", present tense. Still fits in the same time. "Mostly runs the compressor" would also be true, but no source gives the compressor's share of the power, so leave out any share word.) This is consistent with L1 ("more heat than the electricity it uses, because the extra heat was already outside").

**Optional wording (not required):**

- **L4:** "heat **always** flows from warmer to colder" is ✅ for any single transfer, and the loop obeys it at every step (air to colder liquid in L6, hot gas to cooler house in L8). A sharp viewer may think of a fridge or the heat pump itself moving heat the other way. OpenStax's own wording carries the hedge "spontaneously", and NRCan says "naturally" and "counter the natural flow of heat". Safer, same length: **"...and heat flows by itself from warmer to colder."** The script's later "moves it" then reads as the machine doing work against that flow, which is the truth.

**Rulings on the points asked:**

- **L3, L4, L6 "30 degrees" / "30-degree air" (🎭 as an example temperature, ✅ for what is claimed about it).** It's a scenario number, not a measurement, and it's within a range the sources cover. Unit is °F (US audience); say "30 degrees" and show °F on screen. "Even 30-degree air holds heat" rests on claim 10: NRCan (tool): "even when outdoor temperatures are cold, a good deal of energy is still available that can be extracted" and the air at −18°C (0°F) holds "85% of the heat contained at 21°C" (counted from absolute zero); IEEE Spectrum: "There is heat in the air even in subzero temperatures." 30°F is warmer than the sourced 0°F, so the claim holds with margin. "To that liquid, 30-degree air is warm" is reasoning from claim 11: the coil liquid is "typically 10°-20°F colder" than the air (ACHR), so at 30°F air the liquid is about 10–20°F, and the air is the warmer body. "Warm" is relative to the liquid, which the line says. ✅ as reasoning (🧮 inference from ACHR). Optional description line: "Illustrative: 30°F is an example outdoor temperature." A disclosure isn't required: no claim depends on 30 being a measured value.
- **L4 "heat always flows from warmer to colder": ✅.** OpenStax College Physics 2e, § 15.3 (tool, returned as exact): "Heat transfer occurs spontaneously from higher- to lower-temperature bodies but never spontaneously in the reverse direction." and "It is impossible for any process to have as its sole result heat transfer from a cooler to a hotter object." NRCan (tool): "A heat pump uses additional electrical energy to counter the natural flow of heat." (exact), and the page also says heat "naturally flows from places with higher temperature to locations with lower temperatures" (the tool confirms the wording matches but embedded in a longer sentence starting "In a similar manner"; not exact-verified as a standalone sentence). The quotable line is OpenStax's. "Always" is tighter than the source's "spontaneously" (see the optional fix).
- **L6 "boils into a gas": ✅ as a plain gloss.** NRCan (tool): "The liquid refrigerant absorbs heat from the outdoor air and boils, becoming a low-temperature vapour." A vapour is the gas phase of the refrigerant. NRCan's next steps also say "hot gas" ("the reversing valve sends the gas, which is now hot, to the indoor coil"), so "gas" is the page's own word later. "Low-temperature" is dropped, which is fine: it's the viewer's picture of 10–20°F liquid.
- **L7 "a compressor squeezes the gas, which heats it up": ✅.** NRCan (tool): "The vapour is then compressed, reducing its volume and causing it to heat up." (exact). Textbook: OpenStax University Physics vol. 2, § 3.6 (tool): "work is done on it and its temperature increases" (adiabatic compression of an ideal gas). It compresses the vapour (gas), not the liquid, so "the gas" is correct here.
- **L7 "the way air warms in a bike pump": 🟡 (physics sound, no source I could open that names a bike pump).** Searches (not primary pages I could quote) say compression is the main source of the air's heat in a fast stroke and piston-barrel friction adds to the barrel's warmth, so the barrel/valve is warmed by both. The line says "air warms", not "the pump gets hot", so it's correct: the air is warmed by compression. The Harvard science demonstration page (adiabatic heating, thermistor in a pump valve) returned 403 and the Macmillan textbook page was unreachable, and OpenStax University Physics has no bike pump. A pedantic viewer can note friction. Ruling: **allowed as an everyday simile (🟡, not a claim that needs ✅), but it's the first trim candidate** (see trims). If kept and a hedge is wanted, "the way air warms in a bike pump" is already fine, because "air warms" is the true half.
- **L8 "hotter than your living room, so its heat flows out into the house": ✅ (two-source chain).** NRCan (tool, exact): "Finally, the reversing valve sends the gas, which is now hot, to the indoor coil, which is the condenser." and "The heat from the hot gas is transferred to the indoor air, causing the refrigerant to condense into a liquid." NRCan does **not** compare the gas's temperature to the room's (the tool confirms the sentence isn't there). The comparison follows from the second law (the L4 quote): heat leaves the gas for the room spontaneously only if the gas is warmer, so "hotter than your living room" is necessary, not extra. 🧮-style inference, sound. The NRCan sentences support "its heat flows out into the house" word for word in substance.
- **L9: see the required fix.** The "rest came in from outside": ✅ by Qh = Qc + W (OpenStax § 15.5 (carried, exact in v1): "you get an additional heat transfer of Qc from the outside at no cost"). The compressor's own work also becomes heat in the house, so "the rest" of the **heat** is the correct reading. "Only" is the error.
- **L10 "A space heater has to make all its heat, one unit for each unit of electricity": ✅ (claim 3, unchanged).** Canary Media (2023, Joule study): "Fossil-fuel and electric-resistance heating hit a thermodynamic limit at 100 percent efficiency, or a COP of 1." Scope: "has to make all its heat" is the make-vs-move point. No number beyond "one unit for each unit".

**Line by line (v5, 16 lines):**

| Line | Claim | Status | Source / fix |
| --- | --- | --- | --- |
| L1 | More heat in than electricity used, because the extra heat was already outside | ✅ (unchanged) | OpenStax COP_hp "always greater than 1"; Qh = Qc + W. |
| L2 | "nothing is supposed to beat 100 percent" | 🟡 framing (unchanged) | No survey of the belief; "sounds impossible" doesn't claim one. |
| L3 | Air at 30 degrees holds heat | ✅ | NRCan "a good deal of energy is still available"; IEEE Spectrum "heat in the air even in subzero temperatures". Question form. 30 is an example (🎭, margin vs the sourced 0°F). |
| L4 | Even 30-degree air holds heat | ✅ | Claim 10, as above. |
| L4 | Heat always flows from warmer to colder | ✅ | OpenStax § 15.3 "spontaneously ... never spontaneously in the reverse direction"; NRCan "natural flow of heat". Optional: "flows by itself". |
| L5 | That's why it keeps the liquid in its outdoor coil colder than the air, usually by 10 to 20 degrees | ✅ attributed (unchanged) | ACHR 2022 "typically 10°-20°F colder". "Usually" carries the hedge. The "That's why" is sound: heat flows only if the liquid is colder. |
| L6 | To that liquid, 30-degree air is warm | ✅ reasoning | 🧮 from ACHR (liquid about 10–20°F at 30°F air). |
| L6 | Heat flows in and it boils into a gas | ✅ | NRCan "absorbs heat from the outdoor air and boils, becoming a low-temperature vapour". Gas = vapour. |
| L7 | A compressor squeezes the gas, which heats it up | ✅ | NRCan "compressed ... causing it to heat up"; OpenStax Univ. Physics § 3.6. |
| L7 | ...the way air warms in a bike pump | 🟡 | Physics sound (compression is the main heating of the air; friction warms the barrel). No source naming a bike pump opened. Trim candidate. |
| L8 | The gas is hotter than your living room | ✅ | Follows from L4's law plus NRCan "hot gas ... transferred to the indoor air". NRCan doesn't compare temperatures. |
| L8 | ...so its heat flows out into the house | ✅ | NRCan "The heat from the hot gas is transferred to the indoor air". |
| L9 | The electricity only runs the compressor | 🟡 | Fans also draw power. **Required:** "The electricity runs the compressor, and the rest of the heat comes in from outside." |
| L9 | ...and the rest came in from outside | ✅ (as the fix words it) | Qh = Qc + W: the compressor's work also becomes house heat; the rest of the heat is from outside. |
| L10 | A space heater has to make all its heat, one unit per unit of electricity | ✅ | Canary Media / Joule (claim 3). |
| L11–L14 | Mild 40 degrees about three; −6 about 1.5; frost; defrost | ✅ (unchanged, passed v3) | NRCan/NRC 2013; NRCan defrost. |
| L15 | Electric cars come in the same two kinds | ✅ attributed (unchanged) | Recurrent; fueleconomy.gov. |
| L16 | Closing question | n/a | No claim. |

**Consistency check:** L5's "usually 10 to 20 degrees colder" at the script's 30-degree air gives a liquid below freezing, which is exactly why L13 says the coil "can collect frost" on cold, damp nights, so L5/L6/L13 agree. L1's "extra heat was already outside" and L9's fix agree. Nothing in L3–L10 contradicts L11–L16.

**Trims (about 86 s now, target about 75 s; roughly 250 words, so about 30 words to cut; none removes a hedge; savings are word counts, my estimate):**

1. **L7: cut ", the way air warms in a bike pump"** (about 7 words, 2.5 s). Also removes the only 🟡 simile. Result: "Then a compressor squeezes the gas, which heats it up."
2. **L3: "And how can 30-degree air hold any heat?"** (about 6 words saved). The "outside" is already in the hook.
3. **L13–L14 merged: "And on cold, damp nights, that outdoor coil can collect frost, so the heat pump briefly runs as an air conditioner to melt it."** (about 3 words saved, keeps "can", "cold, damp", "briefly".)
4. **L8: "Now the gas is hotter than your living room, so its heat flows into the house."** ("out" dropped, 1 word.) Optional.
5. **L11: "...about three units of heat per unit of electricity."** (2 words.) Keeps "one Canadian government test house" and "about".
6. **L15 (the biggest saving, an owner beat):** cut to "Electric cars come in both kinds, a plain heater that makes heat or a heat pump that moves it." (about 3 words), or cut L15 entirely (about 20 words, 7 s) if 1 and 2–5 aren't enough. The owner approved the EV line in the angle, so ask before cutting it.

Rough total of 1–5: about 20 words (7 s, to about 79 s). With L15 cut: about 71 s. Don't cut L12 ("which still beats a space heater") or "the same house" in L12: they carry the scope hedge and the make-vs-move payoff.

**Description lines (publisher), new for v5:** NRCan, Heating and cooling with a heat pump (modified 2025-12-24): cycle, "counter the natural flow of heat", "even when outdoor temperatures are cold, a good deal of energy is still available"; OpenStax College Physics 2e § 15.3 (second law statement) and § 15.5 (Qh = Qc + W); OpenStax University Physics vol. 2 § 3.6 (compression raises temperature). Illustrative: "30 degrees is an example outdoor temperature." (optional).

---

## Re-check of script v6 (fact-checker, 2026-11-11)

**Verdict: PASS.** No ❌, no required fixes. Reviewed against the v5 section (NRCan, OpenStax, Canary, ACHR, all re-opened earlier today); no new source was needed, because every changed line rests on a quote already recorded above. Legally sensitive: none (no company, agency or person is named in the voice).

**Rulings on the changed lines:**

| Line | Claim | Status | Note |
| --- | --- | --- | --- |
| L5 | A liquid in the outdoor coil is kept colder than the air, usually by 10 to 20 degrees | ✅ attributed | ACHR 2022 "typically 10°-20°F colder". "Usually" carries the hedge. "A liquid" (not "the liquid") is fine as a first mention. |
| L6 | The liquid boils into a gas | ✅ | NRCan: "absorbs heat from the outdoor air and boils, becoming a low-temperature vapour". Gas = vapour. |
| L8 | "Now the gas is hotter than your living room, so it can heat the house." | ✅ | Ruling: **fine as worded, better than v5.** The temperature comparison follows from the second-law quote (OpenStax § 15.3: heat goes spontaneously only from hotter to colder), and NRCan: "The heat from the hot gas is transferred to the indoor air". "Can heat" is the correct modal (the claim is capability, not a measured flow), and the old "its heat flows out" is no longer asserted. NRCan doesn't compare temperatures (inference, as in v5). |
| L9 | "The electricity runs the compressor, and the rest of the heat comes in from outside." | ✅ | My v5 fix, applied exactly. Qh = Qc + W (OpenStax § 15.5). |
| L10 | "A space heater brings nothing in, so it makes all its heat, one unit for each unit of electricity." | ✅ | Ruling: **fine as worded.** Canary Media (Joule study): resistance heating hits "a COP of 1". "Brings nothing in" is the make-vs-move contrast: a resistance element takes no heat from outside, so all its heat comes from the electricity. "One unit for each unit" is COP 1, same as v5 claim 3. The "so" is sound logic, not a dropped hedge. |

**Whole-script check with both frost lines gone: holds.**

- Nothing voiced says or implies a heat pump never frosts or never defrosts. No line says "always works", "at any temperature" or "no backup". The video simply doesn't cover defrost. An omission, not a false claim.
- The exceptions are carried only by scope words that are still there: L11 "one Canadian government test house" (an average at that outdoor temperature), L12 "the same house", L1 "the extra heat was already outside" (true at COP 1.5 and 3). Defrost and backup strips are the reason the real-world average is 1.5 and not higher, and they are already inside that measured average, so no number overstates.
- L1's hook ("more heat than the electricity it uses") holds over a night or a season. A few minutes of defrost pull heat out of the house but don't flip the hook (see Section H, 🟡 nuance, unchanged).
- Cut lines leave no orphan: L4 to L9 read in order (air holds heat, liquid colder, boils, compressor, hot gas, electricity vs outside heat) and the bike-pump simile and the only 🟡 simile are gone.
- Carried unchanged: L1 to L4, L11 to L14 (✅ as in v3/v5). L4 "always" optional fix ("flows by itself") still optional.

**Fixes: none required.** Optional only: L4 "...and heat flows by itself from warmer to colder." (precision, see v5).

**Description (publisher):** if frost isn't in the video, don't add a defrost line to the voice. A pinned-comment or description note is fine if wanted: "Heat pumps do periodically defrost the outdoor coil; NRCan, Heating and cooling with a heat pump (modified 2025-12-24)." Illustrative: "30 degrees is an example outdoor temperature" (optional).

---

## Re-check of script v7, L13 only (fact-checker, 2026-11-11)

**Verdict: PASS (one hedge recommended, not required).** No ❌. Re-opened NRCan, Heating and cooling with a heat pump (natural-resources.canada.ca/energy-efficiency/energy-star/heating-cooling-heat-pump) today (tool quotes). Legally sensitive: none (no company or person named; NRCan is description-only).

L13: "The colder it gets, the less heat a heat pump gives, and newer models shut off somewhere between 5 above and 13 below zero, letting backup heat take over."

| Part | Status | Source / note |
| --- | --- | --- |
| "The colder it gets, the less heat a heat pump gives" | ✅ | NRCan: "As this temperature drops, the ability of the heat pump to absorb heat also drops." / "reduced heating capacity at very cold temperatures". Also COP 3.0 to 1.5 in L11-L12. |
| "newer models" | ✅ | NRCan: "For newer models, this can range from between -15°C to -25°C." |
| "shut off" | ✅ | NRCan uses it: "Most air-source systems shut off at one of three temperatures"; "An outdoor temperature sensor shuts the heat pump off when the temperature falls below the pre-set limit." Also "below which they are unable to operate". |
| "between 5 above and 13 below zero" | ✅ | -15°C = 5°F, -25°C = -13°F. The °C range is the minimum operating temperature (cut-off). NRCan says it "can range", and "somewhere between" carries that. Some systems are set to shut off higher, at the economic balance point, but the claim is about newer models' limit, so fine. |
| "letting backup heat take over" | 🟡 as stated for every house | NRCan: "Below this temperature, only the supplementary heating system operates." / "a supplemental system must be used". NRCan says "supplementary", not "backup" (same thing; "backup" is the usual US word). Not every house has one, so "any backup heat" or "backup heat, if there is any" is the hedge. |

**L12 consistency: no contradiction.** The test house works at -6°F (-21.1°C), which is inside "5 above to 13 below" but above most of the way down: the unit is a cold-climate model whose cut-off is lower than -21°C, so it hasn't shut off. "Somewhere between" is exactly this. Caveat: a listener may ask "why did the house work at 6 below if models shut off up to 5 above?" The range makes the answer plain (newer ones go to -13), so no fix needed. Do not write "at 5 above" or "by 5 above".

**Backup clause: dropping it is acceptable, but it costs a little.** "Shut off" alone is true and sourced, but the viewer may hear "the house goes cold", which is wrong where backup exists and true where it doesn't. Keeping "any backup heat takes over" is the more accurate picture and costs about 5 words. If cut for time, nothing is false, just less complete. Keep the hedge "any" if kept.

**Shortest accurate version (19 words):** "Newer heat pumps can shut off between 5 above and 13 below zero, and any backup heat takes over."
- Drops "the colder it gets, the less heat it gives": already shown by 3 units (L11) falling to 1.5 (L12), so nothing is lost in sense. If it must stay: "The colder it gets, the less heat it gives, and newer models can shut off between 5 above and 13 below zero, leaving it to any backup heat." (28 words, ✅.)
- Without the backup clause (13 words): "Newer heat pumps can shut off between 5 above and 13 below zero." Accurate, mild omission as above.
- "Can" (not "will") is deliberate: NRCan gives a range of cut-off settings, not a fixed value.

**Description (publisher):** NRCan, Heating and cooling with a heat pump (modified 2025-12-24): cut-off "-15°C to -25°C" for newer models; "only the supplementary heating system operates" below it. Keep claims 14, 16, 17 as they are.

---

## Re-check of script v9 (fact-checker, 2026-11-11)

**Verdict: PASS.** No ❌, no fix required. Based on the NRCan quotes re-opened for v7 earlier today (claims 14 and 17 above); no new source needed. Legally sensitive: none (no company or person named; NRCan is description-only).

| Line | Claim | Status | Note |
| --- | --- | --- | --- |
| L2 | "That sounds impossible." | n/a | Framing, no fact. |
| L3 | "How can the air outside hold any heat when it's 30 degrees?" | n/a | A question; L4 answers it (✅, claim 10). "30 degrees" is the example temperature (optional "Illustrative" note, see v6). |
| L13 | "As it gets colder, the heat pump can pull less and less heat out of the air." | ✅ | NRCan: "As this temperature drops, the ability of the heat pump to absorb heat also drops." Scope matches; "can" is a safe modal; the "less and less" is the same trend as the source. Also PNNL BASC (claim 14). |
| L14 | "Newer ones can shut off somewhere between 5 above and 13 below zero, and any backup heat takes over." | ✅ | NRCan: newer models "-15°C to -25°C" = 5°F to -13°F; "Below this temperature, only the supplementary heating system operates." "Can" and "somewhere between" carry the range; "any" carries "not every house has backup". Same wording as the v7 ruling's shortest version. |

**Fit with L12 (-6°F, COP 1.5): no contradiction.** -6°F is inside the 5 to -13°F band, and the cold-climate test unit was still running at -21.1°C, so its cutoff is lower. "Somewhere between" and "can" allow that. L13 to L14 also reads as a consistent chain: capacity falls (COP 3 to 1.5), then at the cutoff the unit stops. Do not add "at 5 above" or "by 5 above". Only caveat: "Newer ones" has no antecedent noun beyond "the heat pump" in L13, which is fine for the ear (a heat pump, newer ones).

**Fixes: none.**

---

## Re-check of script v10, L13-L15 (fact-checker, 2026-11-11)

**Verdict: PASS (no ❌). Two wording hedges recommended (L13, L15); neither is a blocker.** NRCan, Heating and cooling with a heat pump (natural-resources.canada.ca/energy-efficiency/energy-star/heating-cooling-heat-pump) re-opened today (tool quotes). Legally sensitive: none (no company or person named; NRCan is description-only).

| Line | Claim | Status | Source / fix |
| --- | --- | --- | --- |
| L13 | As it gets colder, a heat pump pulls less and less heat out of the air | ✅ | NRCan: "the ability of the heat pump to absorb heat also drops"; "reduced heating capacity at very cold temperatures". |
| L13 | ...until it shuts off | 🟡 (universal, source hedges) | NRCan: "the vast majority of air-source heat pumps have a minimum operating temperature," "below which they are unable to operate." So "vast majority" is not "all". **Hedged wording (makes ✅): "...until most of them shut off."** Alternative: "...until it reaches its limit and shuts off." Keep "most" if the line must stay short. |
| L13 | "until" implies a cause? | ✅ no false cause | "Until" reads as sequence: capacity drops, then the unit stops at its minimum. NRCan gives both ("ability to absorb heat also drops"; cut-off = "minimum operating temperature"; the sensor "shuts the heat pump off when the temperature falls below the pre-set limit"). It does not say the falling output *causes* the shut-off: the cut-off is a pre-set limit, partly a setting ("set by your installation contractor", often at the economic balance point, i.e. where backup is cheaper). The script doesn't claim output hits zero, so no change is needed. Do not write "because it can't pull any heat". |
| L14 | On newer heat pumps, that can happen somewhere between 5 above and 13 below zero | ✅ | NRCan: "For newer models, this can range from between -15°C to -25°C" = 5°F to -13°F (exact conversions). "Can" and "somewhere between" carry the range. "That" = the shut-off in L13, so L14 adds the "newer" scope that L13 lacks. |
| L14 | ...and backup heat, if there is any, takes over | ✅ | NRCan: "Below this temperature, only the supplementary heating system operates." "If there is any" carries "not every house has one" ("most air-source installations require a supplementary heating source" is "most", not all). "Backup" = NRCan's "supplementary" (US usage). |
| L15 | Electric cars heat the cabin the same two ways, with a plain heater that makes heat or a heat pump that moves it | 🟡 | Both designs exist (Recurrent: heat pumps work "by transferring heat from the outside air"; other heaters "generally draw energy from the high voltage battery"; fueleconomy.gov: "all heat must be provided by electricity"). "The same two ways" can be heard as "every EV has both"; some EVs have only a resistance heater, and the choice is the carmaker's. As a statement that two kinds exist, it holds. **Hedged wording (makes ✅): "Electric cars heat the cabin one of the same two ways: a plain heater that makes heat, or a heat pump that moves it."** Or: "Electric cars come in both kinds: a plain heater that makes heat, or a heat pump that moves it." |

**Fit with L12:** no contradiction. -6°F is inside the 5 to -13°F band, and the test unit was still running at -21.1°C, so its cut-off is lower; "newer ones ... can ... somewhere between" allows that. L13 now says "a heat pump" (any) and L14 narrows to "newer", which is the right order: the general rule hedged by "most", then the newer-model range.

**Exact fixes (recommended, not required):**

1. **L13:** "As it gets colder, a heat pump pulls less and less heat out of the air, until **most of them** shut off." (Or keep "it" and add "most": "until, on most, it shuts off.")
2. **L15:** "Electric cars heat the cabin **one of** the same two ways, with a plain heater that makes heat or a heat pump that moves it."

If both are left as written the video is not false, only a universal where the source says "vast majority", and a "same two ways" that a listener may read as "every EV has both".

---

## Key facts (one screen)

1. **A heat pump delivers more heat than the electrical energy it uses.** Physics textbook: the heat delivered equals the heat drawn from outside plus the work put in, so the COP "is always greater than 1" and "You only pay for W, and you get an additional heat transfer of Qc from the outside at no cost" (OpenStax *College Physics 2e*). ✅
2. **Resistance heaters and furnaces top out at 100%.** "Fossil-fuel and electric-resistance heating hit a thermodynamic limit at 100 percent efficiency, or a COP of 1" (Canary Media, reporting the 2023 *Joule* study). ✅ attributed
3. **Typical COP, mild weather: about 3.** Measured at a Canadian government test house: COP 3.0 at 41°F, falling to 1.5 at −6°F (NRCan/NRC, 2013). NRCan's guide: COP "typically ranges from between 2.0 and 5.4" at 46°F, and "1.1 to 3.7" at 18°F. Textbook: "about 2 to 4". ✅
4. **Very cold: about 1.5 to 2, still above 1.** US rating floor for the ENERGY STAR cold-climate label: "COP at 5° F ≥ 1.75". The *Joule* meta-study of seven field studies (coverage): COP 2 to 3 where January averages stay above 23°F; units tested in Finland at −22°F "ran with a COP of 1.5 or higher". ✅ (rating floor) / 🟡 attributed (coverage of the paper)
5. **How it gets heat from freezing air:** the refrigerant in the outdoor coil runs "typically 10°-20°F colder" than the outdoor air (ACHR News), so heat flows into it and boils it. A common refrigerant "boils at -48.5 °C" (−55°F) at normal pressure (IEEE Spectrum). NRCan: "The liquid refrigerant absorbs heat from the outdoor air and boils, becoming a low-temperature vapour." / "The vapour is then compressed, reducing its volume and causing it to heat up." ✅
6. **Defrost:** frost builds on the outdoor coil; "the reversing valve switches the device to the cooling mode", the outdoor fan stops, and hot refrigerant melts the frost, every 30, 60 or 90 minutes or on demand (NRCan). While it defrosts, it's cooling the air in the ducts, so backup heat tempers it. ✅
7. **Aux heat:** "electric resistance elements located in the ductwork" (NRCan) take over below the balance point and during defrost; with them on, the system runs "at or near 1.0" COP (ACHR). PNNL's DOE-funded guide: "This electric resistance backup is an inefficient and typically expensive form of heat." ✅
8. **Gas furnace:** a burner heats the inside of a heat exchanger; the house air passes over the outside, and the exhaust goes out the vent (furnace patent: "two circulating air systems"). 80% AFUE: "80% of the energy used by this furnace is becoming heat while 20% of it is being wasted" (Trane glossary, company). Condensing furnaces (two heat exchangers) cool the exhaust under 140°F so its water vapor condenses and "releases extra heat"; >90% AFUE; PVC vent (PNNL BASC). Old natural-draft furnaces: "usually 70% or less". ✅
9. **US homes:** "Natural gas was the main heating fuel in 47% of homes" and electricity in 42% (2024, Census ACS via EIA). Heat pumps were the main heating equipment in about 13% of homes in 2020 (EIA RECS, snippet). Electric-heated homes "tend to be in the warmer parts of the country" (EIA). ✅ / 🟡 (13%)
10. **🧮 Same heat, three machines:** to put 100,000 Btu (one therm's worth) of heat into the house: resistance ≈ **29 kWh**; heat pump at COP 3 ≈ **10 kWh**, at COP 1.75 ≈ **17 kWh**; furnace at 95% AFUE ≈ **1.05 therms** of gas, at 80% ≈ **1.25 therms** (the extra quarter-therm goes up the vent).

---

## Numbers we'd put on screen (max 5, rounded, °F and US units)

| # | On screen | Source / working | Status |
| --- | --- | --- | --- |
| 1 | **Space heater: 1 unit of electricity → 1 unit of heat** | OpenStax / Canary "COP of 1" (claims 3, 4) | ✅ |
| 2 | **Heat pump at about 40°F: 1 unit of electricity → about 3 units of heat** | NRCan test house, COP 3.0 at 41°F (claim 12) | ✅ (one test house; "about") |
| 3 | **Furnace, 80%: about 1 in 5 units of gas heat goes up the vent** | Trane (company glossary) + PNNL BASC categories (claims 6, 7) | ✅ as definition / 🟡 "up the vent" (most, not all, of the loss) |
| 4 | **Near 0°F: still about 1.5 to 2 units of heat** | ENERGY STAR ≥ 1.75 at 5°F; NRCan 1.5 at −6°F (claim 13) | ✅ |
| 5 | **US homes: gas 47%, electric 42%** | EIA/ACS 2024 (claim 1) | ✅ |

**Description line (draft for the publisher):** "Heat pump physics: OpenStax College Physics 2e (2022). COP measurements: Natural Resources Canada test house (2013) and heat-pump guide; ENERGY STAR cold-climate criteria; Gibb et al., Joule (2023), via Canary Media. Refrigerant and defrost: IEEE Spectrum (2024), ACHR News (2022), NRCan. Furnaces: PNNL Building America Solution Center. US heating fuels: EIA (2025)."

---

## H. Hook check: "A heat pump puts more heat into your house than the electricity it uses."

| Part | Evidence | Status |
| --- | --- | --- |
| "…more heat into your house than the electricity it uses" | OpenStax (verbatim): COP_hp "is always greater than 1—that is, a heat pump always has more heat transfer Qh than work put into it." Measured: COP 1.5 to 3.0 from −6°F to 41°F at a government test house (claim 12). | ✅ as worded |
| Exceptions a commenter could raise | (a) **Defrost**: for a few minutes it pumps heat **out** of the house to melt the outdoor coil (claim 15); CEE field data called the defrost COP "near 0" (snippet). (b) **Aux strips** on: those parts run at COP 1 (claim 16). (c) **Below the cutoff** (newer models: about 5°F to −13°F, NRCan) the heat pump stops and backup does all the heating (claim 17). Over a whole night or a season, the heat pump still delivers more than it uses, unless it's so cold it hands over to the strips. | 🟡 nuance, not a contradiction |
| The belief: "nothing can be more than 100% efficient" | True for **making** heat: "Fossil-fuel and electric-resistance heating hit a thermodynamic limit at 100 percent efficiency, or a COP of 1" (Canary). A heat pump doesn't make most of its heat; it moves it: "You only pay for W, and you get an additional heat transfer of Qc from the outside at no cost" (OpenStax). Energy is conserved: Qh = Qc + W. | ✅ |

**Verdict:** the owner's hook is ✅ as worded. The honest resolution of the "100%" belief is **"it isn't making that heat, it's moving it in from outside"**, not "it beats physics". **Wording rules:** say "more heat than the electricity it uses" (✅) or "about three times the heat, on a mild night" (✅ with scope). **Avoid** "300% efficient" as the narrator's fact (it's a common marketing phrasing: a COP of 3 compared with resistance's 100%; fine only as "that's why you'll see heat pumps called 300% efficient", 🟡), "free heat" without "from outside" (the electricity isn't free), and "breaks the laws of physics" (❌).

## B. Belief check: "nothing can be more than 100% efficient"

- **Status:** ✅ as the thing to bust, with the right framing. No survey measures the belief, so don't say "most people think". "You'd think nothing can beat 100 percent" or "it sounds impossible" is fine framing.
- **Source:** see claims 3–4 and H. The belief is **right about making heat** (heaters, furnaces) and **wrong about moving it**. That's the whole video.

---

## 1. How US homes are heated

- **Script (expected):** "About half of American homes heat with gas, and about four in ten with electricity."
- **Status:** ✅ verified (EIA, Census ACS 2024 data)
- **Source:** [Electricity use is becoming more common for residential heating](https://www.eia.gov/todayinenergy/detail.php?id=66324), EIA Today in Energy, 2025-10-10
- **Quote (tool):** "In 2024, 42% of U.S. households reported that electricity was their main space heating fuel" / "Natural gas was the main heating fuel in 47% of homes last year, a decline from 49% in 2010."
- **Cross-check (snippet):** [Winter Fuels Outlook 2025–2026](https://www.eia.gov/outlooks/steo/report/perspectives/2025/10-winterfuels/2025_winter_fuels.pdf), EIA, 2025-10: natural gas 46%, electricity 43%, propane 5%, heating oil 3%; "96% of U.S. homes are primarily heated with one of four fuels". PDF unreadable; the HTML report page returned nothing. 🟡
- **Source (where):** [Winter residential energy expenditures vary by heating fuel](https://www.eia.gov/todayinenergy/detail.php?id=66364), EIA, 2025-10-15. Quote (tool): homes heating mainly with electricity "tend to be in the warmer parts of the country". The 66324 article (tool): propane, heating oil and wood "were more common in homes exposed to the coldest temperatures" (RECS 2020).
- **Note:** Scope: US households, 2024, main heating fuel, self-reported (ACS). "Electricity" includes heat pumps **and** resistance (baseboard, electric furnaces, space heaters as main heat). Don't subtract claim 2 from this to get a "resistance share": different surveys and years (ACS 2024 vs RECS 2020).

## 2. How many homes use a heat pump

- **Script (expected, optional):** "About one home in eight heats mainly with a heat pump."
- **Status:** 🟡 (snippet; the EIA tables are PDFs I couldn't read; re-checked 2026-11-11, still unreadable, so still 🟡; a search summary repeats 16.13 of 123.53 million. Not in script v1)
- **Source:** [Highlights for space heating in U.S. homes by state, 2020](https://www.eia.gov/consumption/residential/data/2020/state/pdf/State%20Space%20Heating.pdf), EIA RECS 2020
- **Quote (snippet, search-indexed table text):** "Totala All homes 123.53 74.42 60% 16.13 13% 9.29 8% …" (i.e. 123.53 million homes; central furnace 74.42 million, 60%; heat pump 16.13 million, 13%; steam or hot-water boiler 9.29 million, 8%, per the search tool's reading of the columns)
- **Note:** Scope: US housing units, main heating equipment, 2020. Shares are of all homes, including those without heat. The search tool also says RECS lists ductless (mini-split) heat pumps separately (about 1.06 million), so "about 13–14%" may be the total; unconfirmed. The EIA's own [Energy Explained](https://www.eia.gov/energyexplained/use-of-energy/homes.php) page didn't contain the figure. Fact-checker: open HC 6.1 in a PDF reader before ✅. **Optional for the script**: the story doesn't need it.

## 3. A space heater turns every watt into heat (COP 1)

- **Script (expected):** "A space heater or a baseboard turns electricity straight into heat, one unit of heat for each unit of electricity."
- **Status:** ✅ verified (physics + reporting) / 🟡 for the DOE sentence (snippet only)
- **Source:** [Heat pumps outperform boilers and furnaces — even in the cold](https://www.canarymedia.com/articles/heat-pumps/heat-pumps-outperform-boilers-and-furnaces-even-in-the-cold), Alison F. Takemura, Canary Media, 2023-09-13
- **Quote (tool):** "Fossil-fuel and electric-resistance heating hit a thermodynamic limit at 100 percent efficiency, or a COP of 1."
- **Source (snippet, couldn't open, 404):** [Electric Resistance Heating](https://www.energy.gov/energysaver/electric-resistance-heating), DOE Energy Saver. Search-indexed sentence: "Electric resistance heating is 100% energy efficient in the sense that all the incoming electric energy is converted to heat." 🟡 until the page loads.
- **Source (trade press):** [Heat Pump Cycle Fundamentals](https://www.achrnews.com/articles/162493-heat-pump-cycle-fundamentals), Yoni Butbul, ACHR News, 2022-07-18. Quote (tool): with electric-resistance auxiliary heat, "the system may operate at a coefficient of performance (COP) at or near 1.0."
- **Note:** "100%" is at the point of use, in the house. Counting the power plant, the picture changes (claim 22, fairness). The DOE hedge "in the sense that…" is the honest framing.

## 4. A typical space heater is 1,500 watts

- **Script (expected, optional):** "A typical space heater on high draws 1,500 watts."
- **Status:** 🟡 (consumer press and retail listings; no government source found)
- **Source:** [How Much Electricity Does a Space Heater Use?](https://www.familyhandyman.com/article/how-much-electricity-does-a-space-heater-use/), Family Handyman, undated
- **Quote (snippet):** "Electric space heaters for home use are usually rated for 1,500 watts at max power. That's according to Ace Hardware, in partnership with Lasko"
- **Cross-check (retail listings, snippet):** many 120 V heaters listed as "1500 Watts / 120 Volts, 5,118 BTU per hour" (5,118 = 1,500 × 3.412, EIA conversion, claim 20).
- **Note:** Use only as a picture ("a space heater on high"), or 🎭. Don't voice it as a sourced fact unless the fact-checker finds a neutral source.

## 5. A gas furnace keeps the flame and exhaust away from the room air

- **Script (expected):** "A gas furnace burns the gas inside a metal heat exchanger. The house air blows across the outside of it and never touches the flame, and the exhaust goes out the vent."
- **Status:** ✅ verified (patent + CPSC recall)
- **Source:** [US5859363A, Device and method for smoke testing of gas furnace heat exchangers](https://patents.google.com/patent/US5859363A/en), Larry Michael Gouge, filed 1997-07-01, granted 1999-01-12
- **Quote (tool):** "Gas furnaces comprise two circulating air systems: (1) the living space air circulating system" … "(2) the gas exhaust circulating system which passes hot combustion products through the interior of the heat exchanger." / "if cracks or holes develop in the heat exchanger, these harmful products of combustion may leak from the interior of the heat exchanger into the living space air circulating system."
- **Source:** [CPSC, York International Corporation Announce Recall of Gas Furnaces](https://www.cpsc.gov/Recalls/2001/CPSC-York-International-Corporation-Announce-Recall-of-Gas-Furnaces), US CPSC, 2001-09-06. Quote (tool): "A separated heat exchanger tube could result in leakage of flue gasses, including carbon monoxide"
- **Note:** Mechanism only. Don't make it a safety scare (no CO beat unless the story needs it; it's off-angle). The recall names a company: description only, not voice. "Never touches the flame" is a plain gloss of "two circulating air systems"; ✅ as gloss.

## 6. AFUE: what 80% means

- **Script (expected):** "An older furnace rated 80 percent turns 80 percent of the gas into heat for the house. The other fifth is lost, most of it up the vent."
- **Status:** ✅ (definition) / 🟡 for "most of it up the vent" (sources say chimney is the main named loss, but don't give a split)
- **Source (company glossary, definition only):** [What is AFUE?](https://www.trane.com/residential/en/resources/glossary/what-is-afue.html), Trane, undated (© 2026)
- **Quote (tool):** "AFUE, or Annual Fuel Utilization Efficiency, measures how efficiently a furnace converts fuel to heat." / "This means 80% of the energy used by this furnace is becoming heat while 20% of it is being wasted." / losses: "heat escapes through a chimney, leaks out of the system" or an inefficient burner; ductwork losses aren't counted.
- **Source (neutral, snippet):** energy.gov Furnaces and Boilers (404 for me): AFUE is how efficiency is measured, and the FTC requires new furnaces to display it; condensing sealed-combustion systems 90% to 98.5%. 🟡
- **Note:** A company glossary is fine for a definition (no product claim) but don't name it in the voice. AFUE is a **seasonal lab rating** of the appliance; it ignores duct losses and the blower's electricity. "80%" is today's non-condensing class (BASC: Category 1 induced draft "typically have efficiencies of 80% to 86%", claim 7). Keep cost out.

## 7. Condensing furnaces: more of the heat, by condensing the exhaust's water vapor

- **Script (expected, optional):** "Newer furnaces add a second heat exchanger that cools the exhaust until its water vapor condenses, which gets them past 90 percent and lets the vent be a plastic pipe."
- **Status:** ✅ verified (PNNL Building America Solution Center, DOE-funded) / ✅ trade press
- **Source:** [Combustion Furnaces](https://basc.pnnl.gov/resource-guides/combustion-furnaces), Building America Solution Center, PNNL (DOE), last updated 2021-01-21
- **Quote (tool):** condensing furnaces use two heat exchangers: "more heat is extracted from combustion gases than in other furnace types." / water vapor condenses on the secondary heat exchanger, and "as it condenses, the water releases extra heat." / Category IV exhaust is "under 140°F"; "The vent pipe for Category IV furnaces can be made of PVC" / "efficiencies of >90% AFUE" / "natural draft furnaces have very low Annual Fuel Utilization Efficiency (AFUE) ratings, usually 70% or less." / "Category 1 induced draft furnaces typically have efficiencies of 80% to 86%." / condensate "is highly acidic (pH ≤3)."
- **Source:** [How a Condensing Gas Furnace Works](https://www.achrnews.com/articles/154030-how-a-condensing-gas-furnace-works), Lianna Schwalenberg, ACHR News, 2024-01-14. Quote (tool): "All high-efficiency condensing gas furnaces have the unique feature of two heat exchangers." / "the flue pipe of a high-efficiency furnace must be PVC."
- **Note:** Include only if it helps the story (the brief allows it). A strong visual: a hot metal flue on the old furnace vs a cool white plastic pipe with a drip of water on the new one. The ACHR article also mentions a future federal minimum (2028): that's policy, **leave it out**.

## 8. A heat pump moves heat instead of making it

- **Script (expected):** "A heat pump doesn't make most of its heat. It moves it in from the cold air outside."
- **Status:** ✅ verified (NRCan, OpenStax)
- **Source:** [Heating and cooling with a heat pump](https://natural-resources.canada.ca/energy-efficiency/energy-star/heating-cooling-heat-pump), Natural Resources Canada (ENERGY STAR Canada), last modified 2025-12-24
- **Quote (tool):** "A heat pump is an electrically driven device that extracts heat from a low temperature place" / it "uses additional electrical energy to counter the natural flow of heat."
- **Source:** [College Physics 2e, § 15.5 Applications of Thermodynamics: Heat Pumps and Refrigerators](https://openstax.org/books/college-physics-2e/pages/15-5-applications-of-thermodynamics-heat-pumps-and-refrigerators), Paul Peter Urone and Roger Hinrichs, OpenStax (Rice University), 2022-07-13
- **Quote (verbatim):** "You only pay for W, and you get an additional heat transfer of Qc from the outside at no cost"
- **Note:** "Doesn't make **most** of its heat" is exact: the compressor's electricity also ends up as heat in the house (Qh = Qc + W). "Doesn't make heat" alone is a slight overstatement; 🟡.

## 9. More heat out than electricity in: the COP

- **Script (expected):** "So it can put more heat into the house than the electricity it uses. Engineers call the ratio the coefficient of performance."
- **Status:** ✅ verified
- **Source:** OpenStax (claim 8). **Quote (verbatim):** COP_hp "is always greater than 1—that is, a heat pump always has more heat transfer Qh than work put into it." / Tool summary: Qh = Qc + W; COP_hp = Qh / W; "Real heat pumps" typically have COP of "about 2 to 4" (tool).
- **Source:** NRCan (claim 8). Quote (tool): "The COP is a ratio between the rate at which the heat pump transfers thermal energy" [and the electrical power required]; a COP of 3 means 3 kW of heat for 1 kW of electricity.
- **Note:** The voice needn't say "coefficient of performance". "For every unit of electricity, about three units of heat on a mild night" (claim 12) is the picture. COP is measured at one moment and one temperature; seasonal ratings (HSPF2) average it. Keep HSPF out.

## 10. Even freezing air holds heat

- **Script (expected, optional):** "Even at zero degrees, outdoor air still holds heat to give, because 'cold' is only colder than us."
- **Status:** ✅ attributed (NRCan; IEEE Spectrum) / 🟡 for the 85% figure in the voice (needs a careful frame)
- **Source:** NRCan (claim 8). Quote (tool): "even when outdoor temperatures are cold, a good deal of energy is still available." The page's example (tool summary): air at −18°C (0°F) holds about 85% of the heat content of air at 21°C (70°F).
- **Source:** [Heat Pumps Take on Cold Climates](https://spectrum.ieee.org/cold-climate-heat-pump-2667345568), Emily Waltz, IEEE Spectrum, 2024-02-26. Quote (tool): "There is heat in the air even in subzero temperatures."
- **Note:** The 85% is measured from absolute zero (−460°F). It's a great comment-bait fact but easy to misread ("so 0°F air is nearly as warm as a room?"). If used, say "still holds most of its heat, counted from absolute zero", or leave the number out. Not needed for the core.

## 11. How it pulls heat from air below freezing: the refrigerant runs colder still

- **Script (expected):** "The trick is a liquid kept colder than the winter air. In the outdoor coil it runs 10 to 20 degrees colder than the air, so even freezing air warms it and makes it boil. The compressor then squeezes that vapor until it's hot enough to heat the house."
- **Status:** ✅ verified (trade press + NRCan + reporting)
- **Source:** ACHR News, Butbul 2022 (claim 3). Quote (tool): "the temperature of the evaporating refrigerant in the outdoor coil is typically 10°-20°F colder" [than the outdoor air]. / "Driving the refrigerant pressure higher will result in a higher temperature gas at the compressor outlet."
- **Source:** NRCan (claim 8). Quote (tool): "The liquid refrigerant absorbs heat from the outdoor air and boils, becoming a low-temperature vapour." / "The vapour is then compressed, reducing its volume and causing it to heat up." / "The reversing valve controls the direction of flow of the refrigerant in the heat pump."
- **Source:** IEEE Spectrum, Waltz 2024 (claim 10). Quote (tool): "A common refrigerant, called R410a, boils at -48.5 °C." / "The outdoor air passes over a heat exchanger containing a fluid, or refrigerant, that has a very low boiling point."
- **Note:** −48.5°C = **−55°F**, at normal air pressure. Data sheets vary (−48.5 to −52.7°C; search snippets of SDSs). Newer US systems use R-454B, boiling about −50.9°C (−60°F) at 1 atm ([Kaltra property table](https://kaltra.com/r454b-refrigerant), tool: "Boiling point @ 1atm [°C]" "-50.9"). **Wording caution:** inside a running system the boiling temperature is set by pressure, so it doesn't boil at −55°F in the coil; it boils at whatever temperature the low pressure sets, 10–20°F below the outdoor air. Safe voice: "a refrigerant that boils at about 55 below zero at normal pressure" (✅) or "kept 10 to 20 degrees colder than the air outside" (✅). Don't say "the coil is 55 below". Name no refrigerant in the voice; it's not needed.

## 12. Typical COP on a mild winter night: about 3

- **Script (expected):** "On a mild night, around 40 degrees, a heat pump can deliver about three units of heat for every unit of electricity."
- **Status:** ✅ verified (NRCan measured; NRCan guide range; textbook range)
- **Source:** [Cooling and Heating Season Performance Assessment of a cold climate air source heat pump at the Canadian Centre for Housing Technology](https://natural-resources.canada.ca/maps-tools-publications/publications/cooling-heating-season-performance-assessment-cold-climate-air-source-heat-pump-canadian-centre-housing-technology), J. Sager (NRCan), M. Armstrong (NRC), F. Szadkowski (NRCan), 2013-09
- **Quote (tool):** "the COP ranged from an average of 1.5 at -21.1°C outdoor temperature to 3.0 at +4.9°C"
- **Source:** NRCan guide (claim 8). Quote (tool): "At 8°C, the coefficient of performance (COP) of air-source heat pumps typically ranges from between 2.0 and 5.4." / "At –8°C, COPs can range from 1.1 to 3.7."
- **Source:** Canary Media 2023 (claim 3). Quote (tool): heat pumps "can routinely achieve COPs of 3 to 4."
- **Note:** Conversions: +4.9°C = **41°F**; −21.1°C = **−6°F**; 8°C = **46°F**; −8°C = **18°F**. Scope: one cold-climate unit in an unoccupied, instrumented test house in Ottawa, 2013. "About three" at about 40°F is ✅ for that unit; the NRCan range shows units vary widely (2 to 5.4 at 46°F). Say "about three" or "two to four", not "always three".

## 13. Very cold: COP about 1.5 to 2, still more than 1

- **Script (expected):** "Near zero, it gets less, about one and a half to two units of heat per unit of electricity. Still more than a space heater."
- **Status:** ✅ verified (ENERGY STAR rating floor; NRCan measured) / 🟡 attributed (Joule study via coverage)
- **Source:** [Air Source Heat Pumps: Key Product Criteria](https://www.energystar.gov/products/air_source_heat_pumps/key-product-criteria), ENERGY STAR (EPA), undated (no version shown)
- **Quote (tool):** "COP at 5° F ≥ 1.75, measured in accordance with Appendix M1 H42 test." / "Percent of Heating Capacity at 5°F ≥ 70% of that at 47°F."
- **Source:** NRCan/NRC 2013 (claim 12): "an average of 1.5 at -21.1°C" (−6°F).
- **Source:** Canary Media 2023 (claim 3), reporting Gibb et al., *Joule* 2023 (seven field studies, three continents). Quote (tool): at January mean temperatures above −5°C (23°F), heat pumps "still hum along with a COP of 2 to 3." / units tested in Finland at −30°C (−22°F) "ran with a COP of 1.5 or higher."
- **Source:** [Heat pump efficiency at low temperatures](https://iifiir.org/en/news/heat-pump-efficiency-at-low-temperatures), International Institute of Refrigeration, 2023-09-22. Quote (tool): "heat pumps were two to three times more efficient than oil and gas heating systems in homes and offices." (0°C to about −15°C) / near −30°C, "efficiencies around 1.5 times higher than oil and gas heating systems."
- **Source (lead, not opened):** NEEP Cold Climate ASHP Specification ([v3.0 PDF](https://neep.org/sites/default/files/ColdClimateAir-sourceHeatPumpSpecification-Version3.0FINAL.pdf)): "Coefficient of Performance (COP) at 5°F ≥ 1.75 (when operating at maximum capacity)" (snippet; the PNNL BASC page, claim 17, quotes the same line, tool).
- **Note:** The ENERGY STAR number is a **minimum to earn the cold-climate label**, measured in a lab, not a typical field value. Say "to earn the cold-climate label, a heat pump must still deliver at least 1.75 units of heat per unit of electricity at 5 degrees" (✅; not "heat pumps sold for cold climates", which overclaims: unlabeled models needn't meet it), or "about one and a half to two" (✅ with NRCan + ENERGY STAR). Older, non-cold-climate units can fall to about 1 (NRCan range 1.1–3.7 at 18°F). Joule numbers via coverage: 🟡, attribute ("a study of field data from three continents").

## 14. It also delivers less heat, not just less efficient heat, as it gets colder

- **Script (expected):** "And the colder it gets, the less heat it can pull in at all."
- **Status:** ✅ verified (PNNL BASC; ENERGY STAR; OpenStax)
- **Source:** [Cold Climate Heat Pump Sizing and Selection](https://basc.pnnl.gov/resource-guides/cold-climate-heat-pump-sizing-and-selection), Building America Solution Center, PNNL (DOE), last updated 2024-05-14
- **Quote (tool):** "the unit's heating capacity drops below its rated capacity once the outdoor temperature drops below the mid-40's or so." / "the colder it is outside, the more difficult it is for the heat pump to extract heat from the outside air." / balance point: "Indicates the lowest outdoor temperature at which the unit can provide all the home's heating needs." / "When outdoor temperatures are below the balance point, the heat pump cannot fully meet the home's heating needs without a backup heat source."
- **Source:** OpenStax (verbatim): "In other words, heat pumps do not work as well in very cold climates as they do in more moderate climates."
- **Note:** Two different things fall in the cold: **efficiency** (COP) and **capacity** (Btu per hour). The house also needs more heat as it gets colder, so the two curves cross at the balance point. Visual gift (see director notes).

## 15. The defrost cycle: it briefly runs as an air conditioner

- **Script (expected):** "On a cold, damp night, frost builds on the outdoor coil. So every so often the heat pump runs backwards for a few minutes, sending heat outside to melt it."
- **Status:** ✅ verified (NRCan guide + NRCan test house) for the mechanism; 🟡 for "freezing nights" (fact-check 2026-11-11: NRCan says "near or below freezing" and moisture-dependent, and never uses the words "cold" or "damp"; say "cold, damp nights ... frost can build")
- **Source:** NRCan guide (claim 8). Quote (tool): "First, the reversing valve switches the device to the cooling mode." / the outdoor fan is turned off and hot refrigerant goes to the outdoor coil to melt the frost (tool summary) / "The cycle can be initiated every 30, 60 or 90 minutes, depending on the climate and the design of the system." / demand-based controls start it only when needed / during defrost, "the heat pump is cooling the air in the ductwork"
- **Source:** NRCan/NRC 2013 (claim 12). Quote (tool): during defrost, "the indoor supply air temperature dropped in order to defrost the outdoor unit."; the system "included a 10 kW (34,000 Btu/h) backup electric resistance heater" which tempered the cooler supply air during defrost.
- **Source (snippet, CEE Minnesota, Home Energy magazine 2018, PDF unreadable):** during defrost, "This results in a COP near 0, because almost all of the heat goes to the outdoor unit." 🟡
- **Source (why frost forms):** ACHR claim 11: the coil runs 10–20°F colder than the air, so below about 40°F outdoors its surface can be below freezing, and moisture in the air freezes on it (🧮 inference from the 10–20°F figure; frost itself ✅ NRCan).
- **Note:** "A few minutes": NRCan doesn't give a duration in what I saw (manufacturer pages say 5–15 minutes: company, ❌ for the voice unless the fact-checker finds a neutral source). Safe: "for a few minutes" is 🟡; "briefly" is ✅ framing. Steam rising from the outdoor unit during defrost is normal (manufacturer pages only, ❌ as a claim, ✅ as a visual).

## 16. Aux heat: resistance strips in the ductwork

- **Script (expected):** "When it can't keep up, or while it defrosts, backup strips in the ducts switch on. They're the same as a space heater: one unit of heat per unit of electricity."
- **Status:** ✅ verified for strips = COP near 1 (ACHR, NRCan); 🟡 for "during defrost" as a fact for every house (fact-check 2026-11-11: NRCan says "Supplementary heating **may** also be required when the heat pump is defrosting"; hedge it: "if the house has backup strips ... they can")
- **Source:** NRCan guide (claim 8). Quote (tool): in all-electric systems, "heat pump operations are supplemented with electric resistance elements located in the ductwork." / "Thermal Balance Point: The temperature below which the heat pump does not have enough capacity" [to meet the heating needs alone].
- **Source:** PNNL BASC (claim 14). Quote (tool): "This electric resistance backup is an inefficient and typically expensive form of heat." / backup traditionally "ensured the home could still be heated at cooler outdoor temperatures (e.g., below 35°F)."
- **Source:** ACHR News (claim 3): with auxiliary heat, "the system may operate at a coefficient of performance (COP) at or near 1.0."
- **Source:** IEEE Spectrum (claim 10). Quote (tool): "At that point, an auxiliary heat source kicks on, which is less efficient."
- **Note:** Many US thermostats show "AUX" or "EM HEAT" when the strips run (common knowledge; no source opened: ❌ for a voice claim, fine as a visual of a generic thermostat). Some homes use a gas furnace as backup instead ("dual fuel"; NRCan's "economic balance point", tool). Optional.

## 17. Below a cutoff, the heat pump stops

- **Script (expected, optional):** "Most models have a lowest temperature they'll run at; newer ones go down to about 5 below or colder."
- **Status:** ✅ verified (NRCan) / ✅ trade press for prototypes
- **Source:** NRCan guide (claim 8). Quote (tool): "the vast majority of air-source heat pumps have a minimum operating temperature." For newer models typically between −15°C and −25°C (tool summary). "Cut-Off Temperature": "the minimum operating temperature for the heat pump."
- **Source:** [8 Manufacturers Complete Heat Pump Challenge](https://achrnews.com/articles/163556-8-manufacturers-complete-heat-pump-challenge), ACHR News, 2024-10-23. Quote (tool): prototypes in lab tests "operating at temperatures as low as –15°F"; field tests at "23 residential sites located across 10 states and two Canadian provinces"; units "reliably provided heat with little assistance from auxiliary elements, even during the coldest winter periods."
- **Note:** −15°C to −25°C = **5°F to −13°F**. The DOE challenge is a government program; don't make it a policy beat. Optional.

## 18. Same choice in an EV (link to No. 017)

- **Script (expected, one line):** "Electric cars face the same choice: a plain heater, or a heat pump that pulls warmth in from outside."
- **Status:** ✅ attributed (carried)
- **Source (carried from `ev-winter/sources.md` claim 14, accessed 2026-11-09):** [Winter EV range loss](https://www.recurrentauto.com/research/winter-ev-range-loss), Recurrent, 2025-11-19. Quote (tool): "A heat pump works by transferring heat from the outside air, even in cold conditions." / "It's worth noting that heat pump benefits diminish as temps drop toward 0F"
- **Source (carried, ev-winter fact-check L1):** [Where the Energy Goes: Electric Cars](https://www.fueleconomy.gov/feg/atv-ev.shtml), fueleconomy.gov (EPA/DOE). Quote (carried): "all heat must be provided by electricity".
- **Note:** Brand rule: no "in our previous video". "Electric cars face the same choice" works as a standalone line. No numbers needed.

## 19. Heat pumps also cool: it's an air conditioner that can run both ways

- **Script (expected, optional):** "In summer, the same machine runs the other way and cools the house."
- **Status:** ✅ verified (NRCan)
- **Source:** NRCan guide (claim 8): "The reversing valve controls the direction of flow of the refrigerant in the heat pump." (tool); the page covers both heating and cooling cycles.
- **Note:** Helps the "move heat" idea: the viewer already owns a heat mover (fridge, AC). "Like an air conditioner running backwards" ✅ framing (ev-winter used "similar to air conditioning, but inverted", Recurrent, carried).

## 20. Energy units (for the calculations)

- **Status:** ✅ verified (EIA)
- **Source:** [British thermal units (Btu)](https://www.eia.gov/energyexplained/units-and-calculators/british-thermal-units.php), EIA Energy Explained, undated
- **Quote (tool):** "1 kilowatthour=3,412 Btu" / "1 therm=100,000 Btu" / "1 cubic foot=1,036 Btu" (natural gas) / propane "1 gallon=91,452 Btu" / heating oil "1 gallon=138,500 Btu"

## 21. Same heat, three machines (energy only, no prices)

- **Script (expected):** "To put the same heat into the house, a space heater needs about three times the electricity a heat pump uses on a mild night."
- **Status:** 🧮 (inputs ✅)
- **Working (C1):** target 100,000 Btu of heat delivered (one therm's worth).
  - Resistance (COP 1): 100,000 ÷ 3,412 = **29.3 kWh**.
  - Heat pump, COP 3.0 (41°F, claim 12): **9.8 kWh**. COP 1.75 (5°F, ENERGY STAR floor): **16.7 kWh**. COP 1.5 (−6°F, claim 12): **19.5 kWh**.
  - Furnace, 95% AFUE: 100,000 ÷ 0.95 = 105,300 Btu = **1.05 therms** of gas (5,300 Btu lost). 80% AFUE: **1.25 therms** (25,000 Btu lost, a fifth of what's burned). 70% (old natural draft, claim 7): **1.43 therms**.
- **Note:** **Costs: left out on purpose.** Electricity and gas prices vary several-fold by state and season, so "which is cheapest" depends on the house; any cost line would need a named state, year and price source, and the brief says to avoid it. Safe energy-only voice: "about a third of the electricity" (✅ at COP 3), "less than a space heater even near zero" (✅, COP > 1 down to the cutoff). Don't compare kWh with therms in the voice (apples and oranges for viewers). Also: AFUE is seasonal, COP here is at one temperature: fine for a picture, not for a precise ranking.

## 22. Fairness: counting the power plant

- **Script (expected, optional fairness line):** "In fairness, the power plant loses heat too, so the electricity was never 100 percent to begin with."
- **Status:** ✅ (EIA method and worked examples) / 🟡 for any single US average (not found today)
- **Source:** [What is the efficiency of different types of power plants?](https://www.eia.gov/tools/faqs/faq.php?id=107&t=3), EIA FAQ, undated
- **Quote (tool):** "divide the equivalent Btu content of a kWh of electricity (3,412 Btu) by the heat rate" / worked examples: a heat rate of 10,500 Btu gives 33%, 7,500 Btu gives 45% (tool summary).
- **Note:** This is the honest counterweight to "space heaters are 100% efficient". It's also the reason a heat pump at COP 1.5 roughly breaks even with a good gas furnace on **fuel burned** if the power comes from a gas plant (🧮: 1.5 × 45% ≈ 0.68 vs 0.95). It drifts toward grid and climate talk, which the brief rules out, so **keep it to one neutral line or leave it out**. Never say what the grid "should" be.

---

## Myths (hook and comment material)

| Myth | What the evidence says | Status |
| --- | --- | --- |
| "Nothing can be more than 100% efficient." | True for making heat (heaters, furnaces top out at a COP of 1, Canary/Joule). A heat pump moves most of its heat in from outside; "You only pay for W" (OpenStax). Energy is conserved: heat out = outdoor heat + electricity. | ✅ (H, claims 8–9) |
| "Heat pumps don't work in the cold." | They run well below freezing: COP 1.5 at −6°F in a government test house; cold-climate units must still reach COP 1.75 at 5°F; units in Finland at −22°F ran at 1.5 or higher (Joule, via coverage). They do lose efficiency and capacity, and most have a cutoff (newer: about 5°F to −13°F). | ✅ / 🟡 (claims 13, 14, 17) |
| "A space heater is 100% efficient, so it's the cheapest heat." | 100% at the plug (DOE, snippet), but a heat pump gets 2–3 units of heat from the same electricity in most winter weather. Fair side: heating one room with a space heater while the rest of the house stays cool can use less energy overall than heating the whole house (common advice; **not sourced today**, ❌ for the voice). Cost depends on local prices. | ✅ / ❌ for the zone-heating point (claims 3, 12, 21) |
| "Heat pumps are just electric heaters." | Only the backup strips are. The heat pump itself moves heat with a compressor and refrigerant (NRCan). | ✅ (claims 8, 16) |
| "Cold air has no heat in it." | Air at 0°F still holds about 85% of the heat that 70°F air holds, counted from absolute zero (NRCan). | 🟡 (framing, claim 10) |
| "The steam from my outdoor unit means it's broken." | Defrost: the unit briefly reverses to melt frost (NRCan). Steam is normal (manufacturer pages only). | ✅ mechanism / ❌ steam claim (claim 15) |
| "A 95% furnace beats a heat pump because 95 is close to 100." | At the house, a heat pump at COP 2–3 delivers 200–300 units per 100 units of energy bought; the furnace delivers 95. Counting power-plant losses narrows the gap (claim 22). | ✅ / 🧮 |
| "The furnace heats the air with the flame." | The flame and exhaust stay inside the heat exchanger; house air only touches its outside (patent, CPSC recall). | ✅ (claim 5) |

## Angles (2–3, with hook sentences)

- **A (owner-approved, recommended): make heat vs move heat.** Hook: "A heat pump puts more heat into your house than the electricity it uses." (✅) Picture: one cut-open house on a 20°F night. The space heater's coil glows (1 in, 1 out). The furnace's flame stays inside the heat exchanger; most orange goes into the house air, a thin orange stream goes up the vent. The heat pump's outdoor coil pulls faint orange wisps out of the cold air and the loop carries them inside: one unit of electricity in, three units of heat out.
- **B: the frost trick.** Hook: "On a freezing night, a heat pump sometimes turns into an air conditioner, on purpose." (✅ NRCan: "switches the device to the cooling mode") Picture: frost creeping over the outdoor coil, the loop reverses, steam lifts off, the duct strips glow orange for a moment. It's a smaller idea; better as the mechanism beat inside A than as the whole video.
- **C: the liquid colder than winter.** Hook: "The heat pump outside your house runs a liquid that boils at about 55 below zero, which is how it finds heat in freezing air." (✅ IEEE Spectrum, with the "at normal pressure" caution in claim 11) Picture: a thermometer on the outdoor coil reading colder than the air, orange flowing from the air into the coil. Strong and visual, but it needs the pressure caveat, so A stays the frame and C becomes beat 4.

**Hook variants inside the approved direction (A):**

1. "A heat pump puts more heat into your house than the electricity it uses, because most of that heat was already outside." (✅; gives the answer in the first breath, brand's "answer straight")
2. "On a mild winter night, a heat pump can turn one unit of electricity into about three units of heat in your house." (✅ with "can" and "mild": NRCan COP 3.0 at 41°F, range 2.0–5.4 at 46°F)
3. "A space heater turns every watt into heat, and that's the best it can ever do. A heat pump does about three times better, without breaking any law of physics." (✅ with "about" and mild-weather scope; ≤ 2 short sentences, check for the "not X but Y" pattern before using)

## Visual notes for the director

- **One house, cut open, one cold night (20°F chip, °F).** Three heating systems shown one at a time in the same house (or three identical houses in a row if the director prefers a side-by-side). Orange = **heat** (the hidden system). The cold outside is neutral blue-grey, not orange.
- **Space heater / baseboard (cut open):** a nichrome coil or ceramic element inside a grille, a small fan behind it. What moves: a thin line of electricity (neutral) from the wall becomes orange glow and air ripples. Counter beside it: 1 in → 1 out.
- **Gas furnace (cut open, basement):** burner row with blue flames at the bottom; flames fire into the heat-exchanger tubes (clamshell or tube bank); a blower below pushes grey house air across the **outside** of the tubes, it leaves orange up the supply duct; exhaust (grey-orange) leaves through the inducer fan and up the vent. Old 80% furnace: metal flue pipe with a visible stream of orange escaping (about a fifth). Optional condensing furnace: a second, finned heat exchanger, a white PVC pipe, water dripping into a drain line, almost no orange leaving. **Never** show the flame touching room air.
- **Heat pump (cut open, two parts):** outdoor unit = a big fan on top, a wraparound finned coil, a compressor (black dome) and a reversing valve; copper line set through the wall; indoor coil in the air handler with the blower. What moves: refrigerant dots in a loop. Outdoors, cold blue liquid enters the coil, picks up faint orange wisps from the air (thermometer on the coil reads colder than the air, e.g. air 20°F, coil 5°F), turns to vapor; compressor squeezes it, it glows brighter orange; indoors it gives its orange to the air and turns back to liquid; an expansion valve drops it cold again. Counter: 1 electricity in → about 3 heat out (thin neutral line to the compressor, fat orange flow into the house).
- **The cold drops:** the thermometer chip slides from 40°F to 5°F; the wisps outside thin; the counter goes 3 → about 1.75 → 1.5; the indoor flow narrows. Capacity vs house-need: two bars crossing at the balance point.
- **Defrost:** white frost creeping over the outdoor coil fins; outdoor fan stops; the loop's dots reverse direction (reversing valve clicks); frost melts and steam lifts off; inside, the duct heater strips glow orange for the moment. Then back to normal flow. Good 3–4 s beat.
- **Aux strips:** a row of glowing coils in the duct above the indoor coil; the counter reads 1 in → 1 out while they're on. A generic thermostat (no brand) may show "AUX" (visual only).
- **EV line:** a quick cut to a generic cut-open EV from No. 017 with its small heat pump at the front pulling the same wisps in. One beat.
- **Phone rule:** if a thermostat app appears, the phone faces its owner and the screen is read through the detail box.
- **Avoid:** prices or $ on screen; brand logos; "300%" as a big card; refrigerant names; flames in contact with the room air; a CO-leak scare; politics (gas bans, rebates, the 2028 furnace rule); kWh vs therms on one chart; the 85% "cold air" number without "from absolute zero".

## Script-safe lines (✅ as worded unless noted; °F and US units)

1. "A heat pump puts more heat into your house than the electricity it uses." (✅ OpenStax COP > 1; NRCan)
2. 🟡 "That sounds impossible, since nothing is supposed to beat 100 percent." (framing; no survey of the belief)
3. "A space heater or a baseboard turns electricity straight into heat, one unit of heat for each unit of electricity, and that's as good as making heat gets." (✅ Canary/Joule "limit at 100 percent efficiency, or a COP of 1"; DOE snippet)
4. "A gas furnace burns its fuel inside a metal heat exchanger, so the flame never touches the air you breathe, and the exhaust goes out the vent." (✅ patent US5859363, CPSC)
5. "An older furnace rated 80 percent turns 80 percent of the gas into heat for the house; the other fifth is lost, much of it up the vent." (✅ definition; "much of it" not "all of it")
6. "Newer furnaces cool the exhaust until its water vapor condenses, which gets them past 90 percent." (✅ PNNL BASC)
7. "A heat pump doesn't make most of its heat. It moves it in from the cold air outside." (✅ NRCan, OpenStax)
8. "Even freezing air still has heat in it." (✅ NRCan, IEEE Spectrum)
9. "The liquid in the outdoor coil is kept 10 to 20 degrees colder than the air, so even freezing air warms it and makes it boil." (✅ ACHR News, NRCan)
10. "Then a compressor squeezes that vapor until it's hot enough to heat the house." (✅ NRCan, ACHR)
11. 🟡 "It uses a refrigerant that boils at about 55 below zero at normal air pressure." (✅ IEEE Spectrum for R-410A −48.5°C; "at normal air pressure" must stay in)
12. "On a mild night around 40 degrees, one government test measured about three units of heat for every unit of electricity." (✅ NRCan/NRC 2013, COP 3.0 at 41°F)
13. "At 6 below zero, the same test still measured one and a half." (✅ NRCan/NRC 2013, COP 1.5 at −6°F)
14. "To earn the federal cold-climate label, a heat pump must still deliver at least 1.75 units of heat per unit of electricity at 5 degrees." (✅ ENERGY STAR criteria; it's a lab rating floor, and only labeled models must meet it)
15. "The colder it gets, the less heat it can pull in, and the house needs more." (✅ PNNL BASC)
16. "On cold, damp nights frost builds on the outdoor coil, so the heat pump briefly runs as an air conditioner, sending heat outside to melt it." (✅ NRCan "switches the device to the cooling mode")
17. "When it can't keep up, or while it defrosts, backup heating strips in the ducts switch on, and those work just like a space heater." (✅ NRCan "electric resistance elements located in the ductwork"; ACHR "COP at or near 1.0")
18. "About half of American homes heat with gas, and about four in ten with electricity." (✅ EIA/ACS 2024: 47% and 42%)
19. 🟡 "About one home in eight heats mainly with a heat pump." (EIA RECS 2020, snippet: 13%; re-check)
20. "Electric cars face the same choice: a plain heater, or a heat pump that pulls warmth in from outside." (✅ attributed, carried from ev-winter)
21. 🧮 "To put the same heat into the house on a mild night, a space heater needs about three times the electricity of a heat pump." (COP 1 vs COP 3, claim 21)
22. 🟡 "In fairness, power plants lose heat too, so the electricity was never 100 percent to begin with." (EIA FAQ worked examples 33–45%; optional, keep neutral)

**Not script-safe:** "a heat pump is 300% efficient" as narrator's fact (🟡 marketing phrasing; use "three units of heat per unit of electricity"); "heat pumps make free heat" (❌, the electricity is paid for; "heat from outside at no cost" is OpenStax's wording for the outdoor part only); "breaks the laws of physics" (❌); "heat pumps stop working below freezing" (❌); "heat pumps work at any temperature" (❌, cutoff, claim 17); "space heaters are the cheapest heat" or any cost ranking (❌, prices vary by state; left out); "the coil is 55 below zero" (❌, pressure sets the boiling point in a running system); "a space heater uses 1,500 watts" as a sourced fact (🟡, retail only); "defrost takes 5 to 15 minutes" (❌, company pages only); "13% of homes" as ✅ (🟡 until the table is opened); any policy (gas bans, rebates, tax credits, the 2028 furnace standard) or utility/brand promotion; naming NRCan, ENERGY STAR, Trane, a refrigerant maker or a utility in the voice as a citation (say "one government test", "the federal efficiency label for cold climates", "engineers").
