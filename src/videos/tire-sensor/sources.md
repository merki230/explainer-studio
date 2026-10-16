# Sources: tire-sensor (No. 002)

Researcher draft, 2026-10-16. The statuses are the researcher's **starting** confidence. The fact-checker sets the final ones.
Everything was accessed on 2026-10-16. Quotes are verbatim. When a sentence ran too long, it is quoted in pieces joined by "…".

**Access notes for the fact-checker:**

- (1) The research tool could not read PDFs. Every quote below comes from an HTML page: the govinfo HTML edition of the 2005 Federal Register rule, Cornell LII's copy of 49 CFR 571.138, and the HTML pages of NHTSA notices, makers and trade press.
- (2) ecfr.gov and federalregister.gov redirected to an "unblock" page, so the regulation was read on Cornell LII (`law.cornell.edu/cfr/text/49/571.138`). Please confirm the wording on eCFR in a browser.
- (3) nhtsa.gov, schradertpms.com, brakeandfrontend.com and counterman.com returned 403. Anything that relies on them is marked as a lead or 🟡.

Angle (owner-approved): the tire-pressure light comes on. How does the car know the pressure inside a spinning tire? Inside each wheel there is a small battery-powered radio sensor with its own ID. Twist: some cars have no sensor at all and detect a soft tire because it spins faster.

---

## Fact-check of script.txt (fact-checker, 2026-10-16)

Opened directly this session: eCFR 49 CFR 571.138 (ecfr.gov versioner API, current text), NHTSA 2012 notice (govinfo), 70 FR 18136 (govinfo, first 100k characters), Continental Tires, Tire Review, Tomorrow's Technician (GM tips; RF theory), Mazda CX-5 manual, NXP NTM88, Schneier (abstract reproduction). Not readable: USENIX PDF (binary, no text extraction; the USENIX listing page has no abstract), Counterman (403), Discount Tire (page text empty).

| # | Script wording | Status | Fix (exact wording) |
| --- | --- | --- | --- |
| 1 | "four little radios inside your tires" (sentences 1 and 12), and the new hook "Inside each of your tires, a little radio wakes up as you drive away." | ❌ as worded; ✅ once hedged | Universal "your tires" is false for indirect-TPMS cars (A3, C1), and the script itself says so in sentence 10. Hook: "In many cars, a little radio inside each tire wakes up as you drive away." Sentence 12: "...a little radio is probably waiting behind that valve for the wheel to turn." ("Many" is ✅: Continental says direct systems are the most common, a vendor claim, see B1.) "Four" is only right for a four-wheel car with direct TPMS; "each tire" avoids it. |
| 2 | "usually behind the valve" | 🟡 | Sources say "often": Continental "A sensor in each tire (often in the valve stem)". "Usually" rests only on a Brake & Front End snippet that was not opened (403). Use "often behind the valve where you pump in the air." |
| 3 | "every minute or less" | 🟡 | Tire Review: "15, 30 or 60 second intervals" (supports it). Tomorrow's Technician: "once every 30-120 seconds" on average (contradicts "or less"). Use "every minute or so" (✅ against both). |
| 4 | "Once a tire is about a quarter low, US rules give the car 20 minutes to switch on the warning light." | 🟡 | eCFR S4.2(a) confirmed verbatim (see A2). Two gaps. (a) The threshold is 25% below the recommended cold pressure **or** the Table 1 floor (20 psi for standard passenger tires), "whichever is higher", so "about a quarter" is correct only with "about" (keep it). (b) The 20 minutes is a **driving** time: S6(d)(2) "total cumulative time of 20 minutes ... not necessarily continuously"; the 2005 rule says "within 20 minutes of additional travel within a speed range of 50-100 km/hr". A parked car gets no clock. Use: "Once a tire is about a quarter low, US rules require the warning light within 20 minutes of driving." |
| 5 | "US safety regulators found mid-2000s cars with the warning were about half as likely to run on a badly low tire." | ✅ | NHTSA 2012: 23.1% of MY 2004-2007 vehicles without TPMS vs 11.8% with TPMS had at least one severely underinflated tire (25% or more below recommended cold pressure); 11.8/23.1 = 0.51; NHTSA's own estimate is a "55.6-percent reduction". "Mid-2000s" for 2004-2007 is fair. "Badly low" = the report's "severely underinflated". Do not extend to crashes. |
| 6 | "Short bursts save power, so the battery can last up to about ten years." | 🟡 | "Up to about ten years" is ✅ (Tire Review "up to 10 years"; GM "10-year/150,000-mile"; Fuji "8-10 years"). "Short bursts" is not in any opened source. What is sourced is not transmitting all the time: Tire Review "Not transmitting a signal all of the time saves battery life, allowing some batteries to last up to 10 years"; Tomorrow's Technician "If a TPMS sensor transmitted all the time, a sensor would not last very long." Use: "Staying quiet most of the time saves power, so the battery can last up to about ten years." (If the "short burst" imagery stays in sentences 6 and 7, it is an unsourced description of duration; low risk but not ✅.) |
| 7 | "Some cars have no tire sensors and spot a soft tire because it spins slightly faster." | ✅ | Continental: indirect TPMS "use the vehicle's ABS wheel speed sensors"; a low tire "rotates faster than the others"; 70 FR 18136 fn. 7: systems "detect and compare differences in the rotational speed of a vehicle's wheels". The mechanism (smaller rolling radius) is in no opened primary source, but the script does not state it. "Slightly" is a fair everyday word. |
| 8 | "wakes it once the wheel turns"; "Parked, it sleeps" | ✅ | Tomorrow's Technician: "When the tire starts to roll, tiny accelerometers cause the sensor to wake up and start broadcasting at regular intervals." Tire Review: sleep after 10-20 minutes stationary. Note some makes wait for about 40 km/h (Fuji, B5), so "once the wheel turns" is the simple version. In the hook, "wakes up as you drive away" is fine. |
| 9 | "a battery, a pressure sensor, a motion sensor, a tiny computer and a radio" | ✅ | NXP NTM88 bullets (8-bit MCU, 315/434 MHz RF transmitter, accelerometer, 100-1500 kPa pressure range); Continental "battery-powered". |
| 10 | "Each burst carries the sensor's own ID" | ✅ | Mazda "Each tire pressure sensor has a unique ID signal code"; GM "Each sensor has its own unique ID number"; Tire Review is hedged ("Some signals also include information that identifies the sensor"). The 2010 paper's "static 32 bit identifiers" is quoted from Schneier's copy only. Wording "carries" is OK; "every" is avoided in the script. |
| 11 | "US rules" / warning light mandate | ✅ | eCFR S7.3 "all vehicles manufactured on or after September 1, 2007 must comply" (A3). |

**Re-check of the revised script (214 words, 2026-10-16):** All earlier fixes are applied as given (items 1-4, 6 now hedged as recommended). Two new items:

| # | Script wording | Status | Fix |
| --- | --- | --- | --- |
| 12 | "A spinning wheel can't have a wire running to it, so the answer is a small sensor with its own battery" | 🟡 | The absolute "can't" is too strong. Opened: Wikipedia "Direct TPMS" says only "battery-powered, self-contained units" and "designed to use as little power as possible to give maximum battery life"; it does not say a wire is impossible. A search found a patent saying devices in rotating bodies "are not easily supplied with power" (not opened) and noted older two-wire/inductive designs exist. No opened source supports "can't". Use: "Running a wire to a spinning wheel is impractical, so the answer is a small sensor with its own battery, often behind the valve..." The alternative "No wire can reach a spinning wheel" has the same problem. Common-sense framing is fine with "impractical"; no citation then needed beyond the Wikipedia battery line. |
| 13 | "in a quick message" / "Each message carries the sensor's own ID" | ✅ | "Quick" is mild and matches the sourced low-duty idea (Tire Review/TT: not transmitting all the time); no duration claim. ID per Mazda/GM/Tire Review (item 10). |

**Re-check of the reworked opening (2026-10-16):** "it's hard to run a wire to a spinning wheel ... So each tire gets a small sensor with its own battery" is 🟡-hedged and accepted as equivalent to "impractical" (no absolute claim; battery-powered self-contained sensors per Wikipedia "Direct TPMS"). "Each tire gets a small sensor" is a general statement, but it follows "In many cars" and sentence 10 covers the indirect exception. "The radio itself" replaces "a radio" in the parts list: same ✅ (NXP RF transmitter). Verdict: PASS.

**Re-check of the spoken-English polish (2026-10-16):** all PASS.

| Line | Wording | Status | Note |
| --- | --- | --- | --- |
| 9 | "It stays quiet most of the time to save power, and that's how the battery lasts up to about ten years." | ✅ | Tire Review: "Not transmitting a signal all of the time saves battery life, allowing some batteries to last up to 10 years." "Up to" is kept, so dropping "can" is fine. |
| 10 | "Once a tire's about a quarter low, US rules say the warning light's gotta come on within 20 minutes of driving." | 🟡 (hedged, passes) | Same as item 4: "about", "of driving" kept; the threshold is 25% or the Table 1 floor, whichever is higher. "Gotta" = "has to", same meaning as "require". |
| 11 | "Some cars don't have tire sensors at all…" | ✅ | NHTSA 70 FR 18136 fn. 7 and Continental (indirect TPMS uses ABS wheel-speed sensors). "Some" hedges. |
| 12 | "When US safety officials checked mid-2000s cars, the ones with the warning were about half as likely to have a badly low tire." | ✅ | NHTSA 2012: 23.1% vs 11.8% with at least one severely underinflated tire (25% or more below), MY 2004-2007. "Have a badly low tire" is closer to the measurement than "run on". |

**Legally sensitive:** none of the spoken claims name a company or a person. NHTSA is named as "US safety regulators" (government, low risk). The sentence 2 "the answer is a small sensor" and sentence 8 "some cars" avoid naming makers. Keep Continental, NXP, Mazda, GM out of the voice (CLAUDE.md: no company as citation).

**Verdict (revised script): PASS once item 12 uses "impractical" instead of "can't" (a 🟡 hedge, not a ❌). Earlier verdict: BLOCKED** on item 1 (hook and closing line, universal "your tires"). Items 2, 3, 4, 6 are 🟡 and pass with the hedged wording above; the script as it stands uses the unhedged versions of 2, 3, 4 and 6.

---

## A. The law: why every new car has one

### A1. US law: the TREAD Act (2000) told NHTSA to require a low-pressure warning

- **Script (likely):** "After a US law in 2000, every new car had to warn you about a low tire." (Usually not needed in the voice. Useful for the description.)
- **Status:** ✅ verified (researcher)
- **Source:** [Federal Motor Vehicle Safety Standards; Tire Pressure Monitoring Systems; Controls and Displays (final rule), 70 FR 18136](https://www.govinfo.gov/content/pkg/FR-2005-04-08/html/05-6741.htm), NHTSA, Federal Register, 2005-04-08, p. 18139 (accessed 2026-10-16)
- **Quote:** "Congress enacted the TREAD Act on November 1, 2000." / "to require a warning system in new motor vehicles to indicate to the operator when a tire is significantly under inflated."
- **Note:** The TREAD Act came out of the 2000 tire recalls. This rule text doesn't mention them, so that link is **not sourced here**. Leave the backstory out unless someone sources it.

### A2. The threshold: a warning within 20 minutes once a tire is 25% below the recommended pressure

- **Script (likely):** "The light has to come on when a tire is about a quarter below the pressure on the door sticker."
- **Status:** 🟡 plausible (fact-checker). The S4.2(a) wording and S3 placard definition are now confirmed verbatim on ecfr.gov (also Table 1 values 140/160/200/240 kPa = 20/23/29/35 psi). The 20 minutes is cumulative **driving** time in the S6 test, so say "20 minutes of driving". Original researcher note: US only. "About a quarter" is fair for "25 percent". The rule also sets a minimum activation pressure (Table 1) and uses whichever of the two is higher, so "about a quarter" is the safe way to say it.
- **Source:** [49 CFR § 571.138, Standard No. 138; Tire pressure monitoring systems](https://www.law.cornell.edu/cfr/text/49/571.138), Cornell LII copy of the eCFR, current text (accessed 2026-10-16)
- **Quote (S4.2(a)):** "Illuminate a low tire pressure warning telltale not more than 20 minutes after the inflation pressure" … "is equal to or less than either the pressure 25 percent below the vehicle manufacturer's recommended cold inflation pressure"
- **Quote (S3, placard):** "Vehicle Placard and Tire inflation pressure label" … "the sources of information for the vehicle manufacturer's recommended cold tire inflation pressure"
- **Source (same threshold, any combination of tires):** 70 FR 18136, as in A1
- **Note:** The "door sticker" is the vehicle placard, usually on the driver's door jamb. The rule calls it the "placard" and doesn't name its location, so "on the door sticker" is 🟡 everyday wording. "Within 20 minutes" means the light can come on a while after the pressure drops. That is a good detail if the script wants it.

### A3. Since the 2008 model year (all vehicles built from 1 September 2007), on light vehicles up to 10,000 lb

- **Script (likely):** "Since 2008, every new car sold in the US has had one."
- **Status:** ✅ verified (researcher) as "every new car (light vehicle) built since September 2007 / since the 2008 model year". "Every new car" is the everyday version of "passenger cars, multipurpose passenger vehicles, trucks, and buses" with a GVWR of 10,000 lb or less, excluding vehicles with dual wheels on an axle.
- **Source:** 49 CFR 571.138 (Cornell LII), as in A2
- **Quote (S7.3):** "Except as provided in S7.7, all vehicles manufactured on or after September 1, 2007" … "must comply with all requirements of this standard."
- **Quote (S2, paraphrased by the tool; the fact-checker should re-quote):** the application covers vehicles with a GVWR of "4,536 kilograms (10,000 pounds) or less."
- **Source (phase-in):** 70 FR 18136, as in A1, p. 18138
- **Quote:** "20 percent of a vehicle manufacturer's light vehicles are required to comply with the standard" … "70 percent during the period from September 1, 2006 to August 31, 2007, and all light vehicles thereafter."
- **Source (model-year framing):** [NHTSA Survey to Assess Tire Pressure Monitoring Rule](https://ohsonline.com/articles/2009/05/18/nhtsa-survey-to-assess-tire-pressure-monitoring-rule.aspx), Occupational Health & Safety (1105 Media), 2009-05-18 (accessed 2026-10-16)
- **Quote:** "The 2008 model year was the first in which all new light vehicles" … "were equipped with Tire Pressure Monitoring Systems (TPMS)."
- **Note:** Scope is the US only. The rule requires a warning system, not specifically a sensor in each wheel. Indirect systems are allowed if they meet the test (C1). So "every new car has a sensor in each wheel" would be ❌.

### A4. EU: all new passenger cars since 1 November 2014

- **Script (likely):** Optional: "Europe followed in 2014."
- **Status:** ✅ verified (researcher) for "new passenger cars (category M1) registered in the EU since 1 November 2014". 🟡 for any EU threshold number: the UN R64/R141 test values (often given as a 20% loss) were **not** verified, so don't say a European percentage.
- **Source:** [Commission Regulation (EU) No 523/2012 of 20 June 2012, Article 3](https://www.legislation.gov.uk/eur/2012/523/article/3), legislation.gov.uk (UK National Archives copy of the EU text) (accessed 2026-10-16)
- **Quote:** "With effect from 1 November 2014, national authorities shall prohibit the registration, sale and entry into service" … "of vehicles of category M1 which are not fitted with a TPMS complying with the relevant requirements" … "laid down in UNECE Regulation No 64, 02 series of amendments, corrigendum 1."
- **Note:** Today the requirement sits in UN Regulation No. 141 (in force since 22 January 2017, per the UN treaty listing; lead only, not opened) and in the EU General Safety Regulation 2019/2144 (not opened). Cite EUR-Lex for the current EU text if the script uses Europe. The EUR-Lex page for 2018/1593 came back empty in the tool.

---

## B. The sensor inside the wheel (direct TPMS)

### B1. Many cars have a pressure sensor in each wheel that radios its reading to a receiver

- **Script (likely):** "Inside each wheel, there's a small sensor that measures the air pressure and radios it to the car."
- **Status:** ✅ verified (researcher)
- **Source:** 70 FR 18136, as in A1, p. 18139 (footnote 7)
- **Quote:** "Direct TPMSs have a pressure sensor in each wheel that transmits pressure information to a receiver."
- **Source:** [Tire Pressure Monitoring System (TPMS)](https://www.continental-tires.com/car/tire-knowledge/tire-care-maintenance/tire-pressure/monitoring-systems), Continental Tires, undated page (accessed 2026-10-16)
- **Quote:** "A sensor in each tire (often in the valve stem)" / "This data is coded and transmitted in a high-frequency signal to a receiver." / "These are the most common tire-pressure monitoring systems because they are the most accurate."
- **Note:** "Most common" is Continental's claim, and Continental sells direct sensors. The script can say "many cars" or "most cars" only with that caveat. "Many cars" is ✅ safe. No independent market-share figure was found.

### B2. Where it sits: usually on the back of the valve stem, inside the tire; some are strapped to the rim

- **Script (likely):** "It's bolted to the inside of the valve, where you pump the air in."
- **Status:** 🟡 (fact-checker): ✅ for "often in the valve stem" (Continental re-quoted: "mounted on the rim and integrated into the valve"); "usually" is not supported by an opened source. Researcher status: ✅ verified (researcher) for "often on the valve stem, inside the tire". 🟡 for "banded to the rim": the only primary support is a patent's "mounted to either the tire or rim", and banded sensors are described (in leads only) as older and less common. Don't show a banded sensor as the norm.
- **Source:** Continental Tires, as in B1
- **Quote:** "A sensor in each tire (often in the valve stem)" (the page also describes "Battery-powered sensors" on the rim, built into the valve; the fact-checker should re-quote this second phrase exactly)
- **Source (patent):** [US10525780B2, Apparatus and method for detecting vehicle motion in a tire pressure monitoring system](https://patents.google.com/patent/US10525780B2/en), Schrader Electronics Ltd. (assignee), priority 2015-12-22, granted 2020-01-07 (accessed 2026-10-16)
- **Quote:** "the TPMS device can be mounted to either the tire or rim of the respective wheel."
- **Source (trade press, GM service):** [GM TPMS Service Tips](https://www.tomorrowstechnician.com/gm-tpms-service-tips/), Andrew Markel, Tomorrow's Technician (Babcox Media), 2016-05-26 (accessed 2026-10-16)
- **Quote:** "Aim at the sidewall below the valve stem and not at the stem."
- **Lead (not opened, 403):** Brake & Front End, "The Ins and Outs of Indirect and Direct TPMS": the search snippet says the sensor is usually at the base of the valve stem and that some are banded to the wheel's drop center. If the fact-checker can open it, it would make the banded detail ✅.

### B3. What's inside: a battery, a pressure sensor, a temperature sensor, a motion sensor, a tiny computer and a radio

- **Script (likely):** "Inside is a battery, a pressure sensor, a tiny computer and a radio transmitter."
- **Status:** ✅ verified (researcher) for pressure, an accelerometer, a microcontroller, an RF transmitter and an LF receiver on one chip (NXP's own pages). ✅ for "battery-powered" (Continental, B2) and temperature (Continental: "measures the actual pressure and temperature"). The NXP feature bullets don't list temperature, though its spec table shows a temperature tolerance.
- **Source:** [NTM88 Tire Pressure Monitor Sensor family](https://www.nxp.com/products/NTM88), NXP Semiconductors, product page, undated (newest listed documents dated 2024-10-09) (accessed 2026-10-16)
- **Quote:** "8-bit MCU/S08 core with SIM, interrupt and debug/monitor" / "Internal 315/434 MHz RF transmitter" / "Internal 125 kHz LF receiver" / "A field-proven dual-axis accelerometer architecture; the XZ axis offers motion detection and tire localization capabilities" / "Small footprint in a 4 mm x 4 mm package"
- **Source:** [FXTH87 Tire Pressure Monitor Sensor Family](https://www.nxp.com/products/FXTH87), NXP, product page (discontinued part) (accessed 2026-10-16)
- **Quote:** "Internal 315/434 MHz RF transmitter" / "NTM88 is the recommend family for new designs as the FXTH87 family is discontinued."
- **Source:** Continental Tires, as in B1
- **Quote:** "measures the actual pressure and temperature"
- **Note:** The 4 mm × 4 mm figure is the **chip**, not the whole sensor (the sensor adds a battery, an antenna, a housing and the valve). Don't say "the sensor is 4 mm". "The chip at its heart is about the size of a fingernail's corner" would be our own comparison, so 🎭 or cut. The page also notes NXP's MEMS sensor line moved to STMicroelectronics on 2026-02-02. That doesn't matter for the script. Lead, not verified: Infineon's SP37 chip (product brief via search) integrates pressure, acceleration, temperature, an 8051 MCU and a 315/434 MHz transmitter. The fact-checker could add it as a second maker.

### B4. Radio frequency: about 315 MHz (North America and much of Asia) or 433 MHz (Europe)

- **Script (likely):** Probably not spoken. If it is: "It broadcasts on a radio band close to the one your car key uses." ❌ (key fob comparison unsourced; don't use).
- **Status:** ✅ for "TPMS sensor chips transmit at 315 or 434 MHz" (NXP). 🟡 for the regional split: supported only by trade press, and a GM service bulletin (lead) shows some US vehicles switched to 433 MHz. Say "two bands, depending on the market" if needed.
- **Source:** NXP NTM88, as in B3
- **Quote:** "Internal 315/434 MHz RF transmitter"
- **Source (trade press):** [Mobiletron introduces dual frequency TPMS sensor](https://www.autobiz.ie/aftermarket/mobiletron-introduces-dual-frequency-trms-sensor), Autobiz.ie, 2019-02-12 (accessed 2026-10-16)
- **Quote:** "allows for both 433MHz (European applications) and 315MHz (American & Asian applications)"
- **Leads (PDF, not read):** NXP AN5136 (a TPMS receiver must run at "315 MHz or 434 MHz"). NHTSA-hosted GM bulletin MC-10204776 (some vehicles changed from 315 to 433 MHz "to implement the same TPMS communication frequency worldwide"; "315 MHz and 433 MHz … are NOT interchangeable").

### B5. It sleeps when the car is parked and wakes when the wheel starts turning

- **Script (likely):** "When the car is parked, it sleeps. When the wheel starts turning, a motion sensor wakes it up and it starts reporting."
- **Status:** ✅ verified (researcher) for "sleeps when stationary, transmits while the wheel turns, to save battery". ✅ as attributed for "some systems stay silent until the car passes about 40 km/h", which is one automaker's 2005 description, not a universal rule. 🟡 for exact intervals (they vary by car).
- **Source (automaker comment in the federal rule):** 70 FR 18136, as in A1, p. 18168 (NHTSA summarising Fuji Heavy Industries' comment)
- **Quote:** "Fuji's comments made similar arguments, stating that in order to provide a reasonable battery life (8-10 years)" … "for the wheel-mounted pressure sensors and transmitters, it and other vehicle manufacturers have designed their TPMSs" … "to have the wheel sensors remain inactive until wheel rotation is above 40 kph."
- **Source (patent background):** Schrader patent US10525780B2, as in B2
- **Quote:** "The TPMS may therefore adopt a “sleep” mode to conserve battery energy when the vehicle is stationary."
- **Source (trade press):** [TPMS Signal Science: Why You Should Go Outside](https://www.tirereview.com/tire-pressure-monitoring-system-signal-science/), Tire Review Staff, Tire Review (Babcox Media), 2015-01-11 (accessed 2026-10-16)
- **Quote:** "When it's moving, it's transmitting information in 15, 30 or 60 second intervals depending on the application." / "When a vehicle is not moving for a defined period of time, usually between 10 to 20 minutes, the sensors will go into a rest or sleep mode." / "Accelerometers and specific programming tell the sensors to transmit at specific intervals and speeds." / "When a sensor is not turning, it's typically not transmitting information."
- **Note:** This is the best visual beat: the wheel turns, the sensor wakes, and an orange pulse goes out. Safe wording: "about once a minute while you drive" is ✅ for "15, 30 or 60 seconds depending on the car" only if said as "every minute or less". The 40 km/h detail comes from one 2005 automaker comment. If spoken, attribute it ("some cars"). Lead, not used: an unofficial copy of a Land Rover service manual (lrman.ru) describes every 60 s while driving and once every 13 hours parked, but it is not an official source.

### B6. It transmits in short bursts partly because radio rules and the battery limit it

- **Script (likely):** Optional: "It only speaks in short bursts, because the battery has to last for years."
- **Status:** ✅ verified (researcher), as attributed to an automaker's 2005 comment.
- **Source:** 70 FR 18136, as in A1, p. 18147 (NHTSA summarising Hyundai/Kia's comment)
- **Quote:** "Hyundai stated that delivery frequency for data from the direct TPMS tire pressure sensor" … "to the main control unit can take as long as three minutes," … "which is a function of Federal Communications Commission (FCC) requirements" … "that limit signal transmissions and the capacity of the battery in the sensor."
- **Source:** Tire Review, as in B5
- **Quote:** "Not transmitting a signal all of the time saves battery life, allowing some batteries to last up to 10 years."

### B7. The battery lasts up to about 10 years

- **Script (likely):** "Its battery is built to last up to about ten years."
- **Status:** ✅ verified (researcher) as "up to about 10 years" (three independent sources: an automaker's 2005 comment "8-10 years", Tire Review "up to 10 years", GM service tips "10-year/150,000-mile"). Don't say "always 10 years". Lifetimes vary (leads say 5 to 10).
- **Source:** 70 FR 18136, p. 18168, as in B5 ("a reasonable battery life (8-10 years)")
- **Source:** Tire Review, as in B6 ("allowing some batteries to last up to 10 years")
- **Source:** GM TPMS Service Tips, as in B2
- **Quote:** "These sensors have a 10-year /150,000-mile (240,000 km) battery life."

### B8. The battery is sealed in, so a dead battery usually means a new sensor

- **Script (likely):** "When the battery dies, you usually replace the whole sensor."
- **Status:** 🟡 plausible (fact-checker, 2026-10-16: Counterman still 403, Discount Tire page text empty; a web search returned several consistent summaries but no opened page. Not in the current script, so it does not block). Researcher note: Several trade and retail sources say it, but **none was opened directly**. Counterman returned 403 and Discount Tire's product page loaded without its text. The wording below comes from search-result snippets. The fact-checker should open one of them in a browser before ✅.
- **Source (not opened):** Counterman (Babcox), `https://www.counterman.com/?p=117570`, snippet: "On most applications, the battery is molded into the TPMS sensor assembly so it cannot be replaced separately. Consequently, if the battery is run down or dead, the entire TPMS sensor has to be replaced"
- **Source (not opened):** Discount Tire, TPMS sensor product pages (e.g. `https://www.discounttire.com/buy-accessories/schrader-tpms-sensor/p/98860`), snippet: "The battery inside the TPMS sensor is not removeable. When the battery life has come to an end, a new TPMS sensor will be required."
- **Note:** Safe wording until verified: "in most sensors, the battery is sealed inside" (attributed to "mechanics" or kept out). Not needed for the core story.

### B9. Each sensor sends its own ID number, so the car knows which wheel is which

- **Script (likely):** "Every sensor sends its own ID number with each reading, so the car knows which tire is talking."
- **Status:** ✅ verified (researcher) for "each sensor has a unique ID" (automaker manual, GM service article, research). ✅ for "IDs are matched to wheel positions" (GM). "Which tire is talking" is imagery, fine.
- **Source (automaker owner's manual):** [Tire Pressure Monitoring System (2019 CX-5 owner's manual)](https://www.mazdausa.com/static/manuals/2019/cx5/contents/05120202.html), Mazda North American Operations, 2019 manual (accessed 2026-10-16)
- **Quote:** "Each tire pressure sensor has a unique ID signal code." / "The signal code must be registered with the TPMS before it can work."
- **Source:** GM TPMS Service Tips, as in B2
- **Quote:** "Each sensor has its own unique ID number."
- **Source:** Tire Review, as in B5
- **Quote:** "Some signals also include information that identifies the sensor and the health of the battery."
- **Note:** The script names no automaker. Mazda and GM are sources only.

### B10. After a tire rotation, some cars need to relearn which ID is on which corner

- **Script (likely):** "That's why, after a tire rotation, some cars have to relearn which sensor is on which corner."
- **Status:** ✅ verified (researcher) for "some cars" (GM service article). Many newer cars locate the sensors automatically (NXP's accelerometer "tire localization"; Continental's "automatic tire identification"), so "every car" would be ❌.
- **Source:** GM TPMS Service Tips, as in B2
- **Quote:** "Technicians should use a TPMS tool that can reset the sensor positions after rotation." / "When the TPMS tool is used in activate mode, it produces a low-frequency transmission that activates the sensor."
- **Source:** Mazda 2019 CX-5 manual, as in B9
- **Quote:** "whenever tires or wheels are changed, such as changing to and from winter tires."
- **Source (automatic location):** NXP NTM88, as in B3 ("the XZ axis offers motion detection and tire localization capabilities"). Continental lists "automatic tire identification" among TPMS software functions (tool summary; the fact-checker should re-quote).
- **Note:** This is the low-frequency (125 kHz) wake-up: a shop tool "knocks" on the sensor and it answers with its ID. That's a nice optional visual.

### B11. Built for a harsh place: rated from -40 to 125 °C, with a motion sensor that reads hundreds of g

- **Script (likely):** "It lives inside a wheel that can spin more than ten times a second, and its chip is rated from forty below to over two hundred degrees Fahrenheit."
- **Status:** ✅ verified (researcher) for the chip spec: operating range "-40 to +125 °C", and the passenger-car variants' accelerometer ranges up to "+550g" (from the NXP table; the tool flagged the column order as inferred). ❌ for any spoken figure of the force a wheel actually puts on the sensor (e.g. "hundreds of times gravity at highway speed"): no published source was found. A tool estimate of about 350 to 400 g at 120 km/h is **our own calculation**, so don't use it. ❌ for "ten times a second" (our own arithmetic). Cut it, or mark it 🎭.
- **Source:** NXP NTM88, as in B3 (specification table)
- **Quote:** "-40 to +125 °C" / accelerometer range "-175 to +550g" (NTM88H125, Passenger Car/Light Duty)
- **Note:** Safe spoken version: "Its chip is built to keep working from forty below to well past boiling." That is ✅ (125 °C is above 100 °C). Or: "its motion sensor is built to read forces of hundreds of g" (✅ to the spec, but jargon; probably skip). The audience test says skip "g".

---

## C. The twist: cars without a sensor (indirect TPMS)

### C1. Some cars have no pressure sensor at all and use the ABS wheel-speed sensors instead

- **Script (likely):** "Some cars don't have a sensor in the tire at all. They use the wheel-speed sensors from the anti-lock brakes."
- **Status:** ✅ verified (researcher)
- **Source:** 70 FR 18136, as in A1, p. 18139
- **Quote:** "rely on the wheel speed sensors, typically a component of an anti-lock braking system," … "to detect and compare differences in the rotational speed of a vehicle's wheels,"
- **Source:** Continental Tires, as in B1
- **Quote:** "These TPMS use the vehicle's ABS wheel speed sensors."

### C2. A soft tire is slightly smaller, so it spins slightly faster than the others

- **Script (likely):** "A soft tire is a little smaller, so it has to spin a little faster to keep up, and the car notices."
- **Status:** ✅ verified (researcher) for "a low tire rotates faster than the others, and the system flags it" (Continental). 🟡 for "smaller, so": the radius mechanism is stated in a Nira Dynamics description (lead via search) and implied by "roll-radius approaches" in its patent. Continental states only the faster rotation. Safe: "a soft tire spins slightly faster than the others".
- **Source:** Continental Tires, as in B1
- **Quote:** "A flat tire rotates faster than the others, which the system detects and flags."
- **Source (patent):** [US8554498B2, Method, system and computer program for estimation of the pressure](https://patents.google.com/patent/US8554498), Nira Dynamics AB, priority 2007-03-16, granted 2013-10-08 (accessed 2026-10-16)
- **Quote:** "roll-radius approaches cannot solve the problem with diffusion, when all four wheels slowly become under-inflated." / "When the tire pressure drops, the tire spring-constants decrease which affects the spectrum of the wheel speed signal."
- **Note:** Continental's "flat tire" is loose. The car flags a low tire, not only a flat one.

### C3. The weak spot: if all four tires lose air together, speed comparison alone can't see it

- **Script (likely):** "The catch: if all four tires go soft together, they still spin at the same speed, so newer systems also listen to how each tire vibrates."
- **Status:** ✅ verified (researcher) for "comparing wheel speeds alone can't detect all four tires slowly losing air" (Nira patent), and for "in 2005 most indirect systems couldn't meet the four-tire test" (NHTSA). ✅ for "newer systems add vibration analysis" (Nira patent describes the "vibration spectrum approach"). ❌ for "indirect systems today can't detect four low tires": systems sold in the US must pass the four-tire test (A2), so they can.
- **Source:** 70 FR 18136, as in A1, p. 18148
- **Quote:** "Most indirect and hybrid TPMSs cannot currently meet the four-tire, 25-percent under-inflation detection threshold"
- **Source:** Nira patent US8554498B2, as in C2
- **Quote:** "roll-radius approaches cannot solve the problem with diffusion, when all four wheels slowly become under-inflated." / "the spring-damper dynamics in the tire changes with air pressure."
- **Note:** "Currently" means 2005. The honest story is that the simple speed trick misses an even loss, so makers added a second trick (vibration), and the US rule forces a four-tire test. Keep it to one sentence or cut it. Indirect systems also need recalibrating after tires are inflated or rotated (Honda's Canadian manual, lead: the page returned HTTP 500). A US court vacated NHTSA's first (2002) rule partly over this blind spot (*Public Citizen v. Mineta*, 2003, as summarised in search results; not opened).

---

## D. Why it matters (one fact)

### D1. Before the rule, about a quarter of cars had a badly under-inflated tire

- **Script (likely):** "Before the rule, a US survey found about one car in four had a tire at least a quarter low."
- **Status:** ✅ verified (researcher). US survey of 11,500+ vehicles, reported in NHTSA's 2002 rule. Survey year about 2001 (not stated in the quote; don't say a year).
- **Source:** 70 FR 18136, as in A1, p. 18146
- **Quote:** "NHTSA conducted a tire pressure survey that inspected over 11,500 vehicles," … "which reported that 26 percent of passenger cars and 29 percent of light trucks had at least one tire" … "that was 25 percent or more below the recommended inflation pressure for that vehicle"

### D2. With the sensor, cars were about half as likely to have a badly low tire (NHTSA, 2012)

- **Script (likely):** "NHTSA later found cars with the system were about half as likely to be driving on a badly low tire." (**Recommended single "why it matters" fact.**)
- **Status:** ✅ verified (researcher) as "about half as likely" (23.1% vs 11.8%, a 55.6% reduction, model years 2004–2007, US). Use "about half", not "55.6% safer": the study measured tire pressure, not crashes.
- **Source:** [Technical Report Evaluating the Effectiveness of Tire Pressure Monitoring Systems (TPMS) in Proper Tire Pressure Maintenance (notice of report)](https://www.govinfo.gov/content/pkg/FR-2012-11-19/html/2012-27994.htm), NHTSA, Federal Register Vol. 77 No. 223, 2012-11-19 (accessed 2026-10-16)
- **Quote:** "23.1 percent of the MY 2004-2007 vehicles without TPMS had at least one severely underinflated tire." / "the presence of TPMS on a vehicle of model years 2004 to 2007 is estimated to result in a 55.6-percent reduction"
- **Quote (fuel, if wanted):** "TPMS is estimated to save a typical passenger car 9.32 gallons of fuel" / "During 2011 TPMS is estimated to have saved $511 million across the vehicle fleet through reduced fuel consumption."
- **Source (2024 restatement):** [NHTSA Tire-Related Surveys: Results and Implications (DOT HS 813 617)](https://rosap.ntl.bts.gov/view/dot/80057), NHTSA, 2024-11-01, abstract (accessed 2026-10-16)
- **Quote:** "Low tire pressure has been shown to be an issue of safety and of fuel economy."
- **Note:** The 2024 abstract (per the tool's paraphrase) calls it "55.6 percent effective" for direct TPMS. Use the 2012 notice's wording. The 9.32 gallons covers the first eight years for a typical car. Too fiddly for the voice.

### D3. Why low pressure is dangerous: the tire overheats

- **Script (likely):** "A badly low tire overheats, and that can make it fail."
- **Status:** ✅ verified (researcher). This is the federally required owner's-manual sentence.
- **Source:** 49 CFR 571.138 S4.5(a) (Cornell LII), as in A2
- **Quote:** "Driving on a significantly under-inflated tire causes the tire to overheat and can lead to tire failure."

### D4. NHTSA projected about 120 lives a year (a 2005 projection, not a measured count)

- **Script (likely):** Probably not. If used: "NHTSA estimated it would save about 120 lives a year."
- **Status:** 🟡 plausible. A real NHTSA figure, but a 2005 **projection** ("would be prevented"), not a measured outcome. Speak it only as "NHTSA estimated …" with the year.
- **Source:** 70 FR 18136, as in A1, p. 18137
- **Quote:** "we expect that a resulting 119-121 fatalities would be prevented each year."

---

## E. Hook facts and the calm privacy note

### E1. The warning light is a cut-open tire

- **Script (likely):** "That little symbol is a cut-open tire: the tread at the bottom, the bulging sides, and an exclamation mark inside."
- **Status:** ✅ verified (researcher), from reputable consumer press. The regulation requires a "Low Tire Pressure" symbol from Table 1 of FMVSS 101 (571.101), but the image wasn't read. **This fits The Section perfectly:** the dashboard symbol is itself a cross-section.
- **Source:** [Exclamation Point Light in Your Car? What the Tire Pressure Warning Means](https://cars.com/articles/2010/08/do-you-know-what-this-symbol-means), Jared Gall, Cars.com, dated 2026-10-02 (updated article, original URL 2010) (accessed 2026-10-16)
- **Quote:** "The TPMS light looks like the cross-section of a tire, with tread at the bottom" / "an exclamation point between the (slightly bulging) sidewalls."
- **Source (rule):** 49 CFR 571.138 S4.3 (Cornell LII, tool summary): the telltale must use one of the "Low Tire Pressure" symbols in Table 1 of Standard No. 101.

### E2. Each sensor broadcasts its ID in the clear, and researchers have shown cars can be recognised by it

- **Script (likely):** Optional, calm: "Those ID numbers aren't encrypted, and in 2026 researchers showed a $100 receiver by the road could pick them up and recognise the same car coming back."
- **Status:** ✅ verified (researcher) as attributed to researchers (IMDEA Networks press release on a peer-reviewed paper accepted at IEEE/IFIP WONS 2026). ✅ for the 2010 USENIX finding (static 32-bit IDs, about 40 m, tracking feasible) as reproduced from the abstract. Keep the tone calm: researchers showed it's **possible**. No source shows it's being done to drivers at scale.
- **Source:** [Your car's tire sensors could be used to track you](https://networks.imdea.org/your-cars-tire-sensors-could-be-used-to-track-you/), IMDEA Networks Institute (news release), 2026-02-25 (accessed 2026-10-16). Paper: Lizarribar, Scalingi, Giustiniano et al., "Can't Hide Your Stride: Inferring Car Movement Patterns from Passive TPMS Measurements", IEEE WONS 2026.
- **Quote:** "these tire sensors also send a unique ID number in clear, unencrypted wireless signals." / "they collected more than six million tire sensor messages from over 20,000 cars." / "The necessary equipment costs only $100 per receiver." / "signals can be captured from moving cars and from distances greater than 50 meters"
- **Source (2010):** "Security and Privacy Vulnerabilities of In-Car Wireless Networks: A Tire Pressure Monitoring System Case Study", Rouf, Miller, Mustafa, Taylor, Oh, Xu, Gruteser, Trappe, Seskar, 19th USENIX Security Symposium, 2010-08 ([listing](https://www.usenix.org/conference/usenixsecurity10/security-and-privacy-vulnerabilities-car-wireless-networks-tire-pressure); PDF `http://www.usenix.org/events/sec10/tech/full_papers/Rouf.pdf`, not readable in the tool). Abstract as reproduced on [Schneier on Security, "Hacking Wireless Tire-Pressure Monitoring System"](https://www.schneier.com/?p=10787), 2016-09-16 (accessed 2026-10-16).
- **Quote:** "We show that eavesdropping is easily possible at a distance of roughly 40m from a passing vehicle." / "reverse-engineering of the underlying protocols revealed static 32 bit identifiers" / "vehicles can be tracked through these identifiers"
- **Source (project page):** [Securing In-Car Wireless Sensor Networks](https://usslab.org/projects/CarWSN/carwsn.html), USS Lab (the authors' group), undated (accessed 2026-10-16)
- **Quote:** "TPMS wireless signals can be intercepted 40 meters away using a simple receiver"
- **Fact-checker (2026-10-16):** The USENIX PDF is binary to the tool (no text extracted) and the USENIX listing page has no abstract, so the 2010 quotes stay verified only through Schneier's reproduction (re-opened, quotes match). Status for the 2010 finding: 🟡 until someone reads the PDF in a browser. Not in the current script.
- **Note:** The USENIX quotes are from a blog reproducing the abstract. The fact-checker should open the PDF directly. 2010 hardware may not match today's sensors, so prefer the 2026 IMDEA study for anything current. The 2010 paper also showed spoofed warnings ("can easily send false readings and trigger a car's dashboard warning display", project page). That's alarming and out of scope, so keep it out. **Legal: name no automaker or sensor maker in the privacy beat.**

### E3. The spare isn't monitored

- **Script (likely):** Not in the core story. Myth material.
- **Status:** ✅ verified (researcher), for the US federal requirement (some cars monitor the spare anyway).
- **Source:** 70 FR 18136, as in A1, p. 18160
- **Quote:** "we have decided not to require the TPMS to monitor the pressure in a spare tire"

### E4. The light isn't a substitute for checking

- **Script (likely):** Possible step 7: "The rule itself says the light isn't a substitute for checking your tires."
- **Status:** ✅ verified (researcher)
- **Source:** 49 CFR 571.138 S4.5(a) (Cornell LII), as in A2
- **Quote:** "Each tire, including the spare (if provided), should be checked monthly when cold" / "Please note that the TPMS is not a substitute for proper tire maintenance, and it is the driver's responsibility" … "to maintain correct tire pressure, even if under-inflation has not reached the level to trigger" … "illumination of the TPMS low tire pressure telltale."

### E5. The light often comes on on cold mornings

- **Status:** ❌ unsupported (no source opened). It's a common and probably true lead (cold air drops pressure), but no claim or number (e.g. "1 psi per 10 °F") has been verified. Don't script it without a source.

---

## Myths and what the evidence says

| Myth | What the evidence says | Entry |
| --- | --- | --- |
| "The light means you have a flat." | It means a tire is about 25% or more below the recommended pressure (or below a minimum), and it can come on up to 20 minutes later. That is low enough to overheat a tire, but not necessarily flat. | A2, D3 |
| "The car feels the pressure through the wheel or the axle." | Many cars have a battery-powered radio sensor inside each tire. Others infer it from wheel speed. Nothing on the axle measures air pressure. | B1, C1 |
| "Every car has a sensor in each tire." | The law requires a warning, not a sensor. Some cars use the ABS wheel-speed trick instead. | A3, C1 |
| "The sensor is powered by the car or by the spinning wheel." | It runs on its own battery for up to about 10 years and sleeps when parked to save it. | B5–B7 |
| "If the light's off, my tires are fine." | The rule itself says check monthly when cold. The light is not a substitute, and it doesn't watch the spare. | E3, E4 |
| "Indirect systems can't see four low tires." | Simple speed comparison can't, which is why newer systems add vibration analysis. US systems must pass a four-tire test. | C3 |
| "Tire sensors are GPS trackers." | They contain no GPS. Researchers showed their unencrypted ID can be picked up by a nearby receiver (about 40–50 m), which can recognise a car passing that spot. | E2 |

## Suggested angles and hooks (within the agreed angle)

All three open on the same moment (the light) and give the same answer. They differ in what the first sentence leads with.

1. **The tiny radio (agreed direction; pattern 5, "the wrong recipient", told as a lived moment).**
   Hook: "There's a tiny radio with its own battery inside each of your tires, and when that orange light comes on, it's because one of them just told on a tire."
   Question (by ~5 s): "So how does your car know the pressure inside a wheel that's spinning?"
   Facts: B1, B3, B5, B9. Note: "orange light" on the dashboard clashes with the brand rule that orange is reserved for the hidden system (see open questions).

2. **The cut-open symbol (pattern 1, "the lived moment"; the most on-brand).**
   Hook: "That little dashboard light is a drawing of a tire cut in half, and the reason it just came on is a radio hidden inside that tire."
   Question: "How does your car know what's happening inside a tire spinning at highway speed?"
   Facts: E1, B1, B5. It ties the logo-like symbol to The Section look, and the loop ends on the symbol.

3. **The sleeping sensor (pattern 3, "the role").**
   Hook: "Every time you pull out of your driveway, four little radios inside your tires wake up and start reporting to your car."
   Question: "What are they saying, and how does the car know which tire is which?"
   Facts: B5, B9, B10. Strongest on mechanism, weaker on the "light came on" moment.

## 7-step outline (about 55–70 s spoken; American English)

| Step | What the words do (draft beats, not script) | Entries |
| --- | --- | --- |
| 1. Surprise | "There's a tiny radio with its own battery living inside each of your tires." Frame 0: the cut-open wheel, sensor lit. | B1, B3 |
| 2. The surprising fact, made specific | The tire light comes on. Since the 2008 model year, US law has required that warning on every new car, once a tire is about a quarter low. | A2, A3, E1 |
| 3. Question (by ~5–6 s) | "So how does your car know the pressure inside a wheel that's spinning?" | — |
| 4. Answer, then mechanism | Answer: a sensor on the back of the valve, inside the tire. Look at the valve: battery, pressure sensor, small computer, radio. Parked, it sleeps. When the wheel starts turning, a motion sensor wakes it, and every minute or so it radios a short burst through the rubber to a receiver in the car. Each burst carries the sensor's own ID number, so the car knows which corner is talking (and why some cars must relearn after a rotation). The battery is built to last up to about ten years. One reading at about 25% low, and the light comes on. | B2, B3, B5, B6, B7, B9, B10, A2 |
| 4b. Twist (optional, ~8 s) | "Some cars don't have a sensor at all. A soft tire spins slightly faster than the others, and the anti-lock brake sensors notice." One clause on the four-tire blind spot, or cut it. | C1, C2, (C3) |
| 5. One idea to keep | "The light doesn't guess; one of four little radios told it." (Avoid the "not X, but Y" slogan shape; the scriptwriter should rephrase.) Or the NHTSA fact: cars with the system were about half as likely to be driving on a badly low tire. | D2 |
| 6. Attribute | In-line: "NHTSA found…", "the federal rule says…". No company names. | D2, E4 |
| 7. Turn it back | "So next time it lights up, check the tires that day, because a badly low tire overheats." (The rule says the light is no substitute for a monthly check.) End on frame 0: the wheel and sensor, or the symbol. | D3, E4 |

Optional calm privacy line (would push past 60 s, owner's call): E2.

## 3D scene list (The Section)

1. **Frame 0, the cut-open wheel.** A realistic wheel and tire sliced in half (off-white cut faces, ink edge, hatch on the rubber), seen in 3/4 view. The sensor sits on the back of the valve stem inside the air cavity, lit. The title block shows the question.
2. **The car, cut open (side section).** YOU driving at night, the tire-light glow on the dashboard. A detail box shows the cluster with the cut-tire symbol (E1).
3. **Sensor X-ray / teardown.** The sensor pulled out into a detail box, realistic like a repair photo: coin cell, circuit board, chip, antenna, valve. Each part gets a label as it's named.
4. **Wake-up.** The car is parked and the sensor dark (sleep). The wheel starts to turn and the sensor wakes. A first orange pulse goes out through the rubber and the wheel arch.
5. **The orange journey.** Orange radio arcs from all four wheels to one receiver box in the car body (a cut-open slice of the car from above). Each pulse carries a small tag with an ID (🎭 invented numbers, e.g. "ID 4F2A…", disclosed as illustrative).
6. **The soft tire.** One tire slowly loses air. Its pulse changes, the receiver matches the ID to "rear left", and the dashboard light comes on.
7. **Twist, the indirect car.** A second car with no sensor. The ABS ring and pickup at each hub, and one wheel visibly spinning faster (a speed counter on the wheel, 🎭 values).
8. **Payoff and loop.** A glide back to the cut-open wheel and sensor (frame 0's picture).

Optional: **The Lab** for D2 (a bench of tires with gauges, two counters: "without the system" and "with it", about half), and a roadside receiver for E2.

## Legal flags

| Name | Where | Risk | Why |
| --- | --- | --- | --- |
| NHTSA, US Congress (TREAD Act), EU Commission | A, D | Low | Government texts, quoted accurately with dates. |
| NXP, Continental, Schrader (patent), Nira Dynamics (patent) | B, C | Low | Maker pages and patents, cited only as sources. **Do not name them in the voice.** A patent shows a claimed method, not current practice. |
| Mazda, GM (manuals, service article), Fuji Heavy Industries / Subaru, Hyundai/Kia (rule comments) | B5–B10 | Low | Cited as sources for how systems work. Not named in the voice. |
| IMDEA Networks, USENIX authors (Rouf et al.) | E2 | Low | Academic. Say "researchers showed it's possible". Don't say cars "are being tracked". |
| Cars.com, Tire Review, Tomorrow's Technician, OH&S, Autobiz | various | Low | Trade and consumer press, cited as such. |
