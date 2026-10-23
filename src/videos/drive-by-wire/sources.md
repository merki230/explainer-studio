# Sources: drive-by-wire (No. 008)

Researcher draft, 2026-10-22. Written before the script exists, so each entry gives a *likely* line. The fact-checker sets the final statuses; where a later fact-check table differs from an entry, the table wins.

## Fact-check of script.txt (13 lines), 2026-10-22: verdict PASS (no ❌; four 🟡 lines with spoken fixes)

Re-opened this session through the web tool (a small model returns the quotes, capped at 125 characters; the nhtsa.gov PDFs stayed unreadable). Re-quoted for A1–A4, B3, C1, C3, D1; B1 only partly. Statuses below override the "likely line" statuses in the entries.

| Line | Claim | Status | Entry | Fix (spoken) |
| --- | --- | --- | --- | --- |
| 1–2 | "Your gas pedal isn't connected to your engine. Not with a cable, anyway, it's wired to a computer." | 🟡 for line 1 alone; ✅ with line 2 and line 4 | A1, A2 | Acceptable as a hook: line 2 narrows "connected" to "cable" at once, and line 4 supplies "most new cars" within about 10 s. For a viewer with an older car, line 1 is untrue for those seconds (NHTSA 2012: "a few vehicle models" still mechanical; pre-2000s cars have cables). Not a blocker. Cheap fix that keeps the rhythm: "Your gas pedal probably isn't connected to your engine." |
| 3 | "who decides how fast you go?" | n/a | n/a | Question, no claim. |
| 4 | "In most new cars the computer does, because the pedal is only a sensor." | ✅ | A1, A3 | NHTSA 2012: "most of the mechanical components linking the pedal to the throttle... are supplanted by electronic components"; CRS: "sensors send signals to onboard computers that determine how far to open the throttle". "Most" is NHTSA's own scope. No percentage is spoken. |
| 5 | "a small motor opens the throttle on the computer's command" | ✅ | A4 | NHTSA lists "sensors, electric motors, a control module, and connecting wires". The motor-on-the-valve detail is generic engineering. Valid for gas cars; EVs have no throttle. |
| 6, 8 | Skid on a wet curve with foot on the gas; shoe catches both pedals | 🎭 hypothetical scenes, no claim | n/a | Both are everyday scenarios, not statistics. Line 8 should not be read as "this is common"; it isn't. |
| 7 | "Every new US car since 2011 has stability control that can cut engine power by itself." | 🟡 | B3 | 49 CFR 571.126: S3 covers vehicles of 4,536 kg (10,000 lb) GVWR or less; S8.4 "All vehicles manufactured on or after September 1, 2011 must comply"; S4 requires "a means to modify engine torque, as necessary, to assist the driver in maintaining control". "Every new US car since 2011" is ✅ (cars and light trucks are covered; production-date basis). "Cut" is stronger than "modify". Spoken fix: "that can cut back engine power by itself" or "that can pull back engine power by itself". Also, the rule requires the capability, not that it use the throttle motor; the line does not claim that. |
| 9 | "Brake override makes the car ignore the gas" | 🟡 | C3 | NHTSA 2012: the override "causes the engine control system to ignore or reduce the commanded throttle input". Fix: "makes the car ignore or cut the gas". Not instant (NPRM: a delay "on the order of one second"; optional below 10 mph); some makers (Mazda CX-30 manual) let drivers switch it off. "Don't test it on the road" is a safe framing. |
| 10 | "Every new US car has had it since the 2018 models, though no law made carmakers add it." | ✅ | C3 | NHTSA 2019 (84 FR 21309): "as of model year 2018, all light vehicles for sale in the U.S. market have been voluntarily equipped with a BTO system", and NHTSA withdrew the proposed requirement. Scope is "all light vehicles" (same class as "car" in colloquial use). "It" refers to brake override in line 9. "No law" is true of federal law (FMVSS 124 has no such requirement; the proposal was withdrawn); I did not search state laws. Optionally say "no federal rule". NHTSA did not itself say "since", it said "as of MY 2018", which is how the line reads. |
| 11 | "If the pedal sensor fails, the car usually drops into a reduced-power limp mode." | 🟡 | C1 | NHTSA 2012: "They often have 'limp home' modes which restrict the throttle opening to a small range when a fault occurs." "Often" is not "usually", and the source says "a fault", not specifically a pedal sensor fault (the NPRM separately says the system can override the pedal if its signals exceed design limits). I could not open NHTSA's DOT HS 812 557, which would settle the pedal-sensor case. Spoken fix: "If the pedal sensor fails, the car often drops into a reduced-power limp mode." (✅). |
| 12 | "Steering may be wired next, and at least one new pickup in the US already steers this way." | ✅ for the pickup; "may be wired next" is a hedged opinion | D1 | Cybertruck owner's manual (en_US): "Cybertruck uses steer-by-wire technology, which means that there is no mechanical connection" between wheel and wheels; InsideEVs 2024 teardown confirms. Caveat: "new" is not sourced to a 2026 sales page (search found no confirmation of current sales; a 2026 model-year reference sits only on a low-quality site). The Cybertruck has been on sale in the US since late 2023, which fits "new" for a viewer, but the publisher should not cite it as a 2026 sales fact. "May ... next" is forward-looking and carried by the Mercedes 2027 EQS option (D2; US option availability 🟡). Name legal flag: Tesla (not named in the voice). |
| 13 | "Would you trust a steering wheel that isn't connected to your wheels?" | 🟡 as to sense, no factual error | D1 | Alone, "isn't connected" could mean no link of any kind. The echo of line 2 ("wired to a computer") and line 12 ("steers this way") mostly carry it, and the Cybertruck has a wired link plus redundant sensors and actuators ("controlled by multiple redundant sensors and actuators"). Acceptable. Safer sense-fix: "Would you trust a steering wheel with no shaft to your wheels?" or "...that isn't mechanically connected to your wheels?" |

### Recheck of the approved 12-line script (line numbers are the new ones), 2026-10-22: PASS

All four earlier 🟡 spoken fixes are applied. This table supersedes the 13-line table above where they differ.

| New line | Claim | Status | Note |
| --- | --- | --- | --- |
| 1 | "Your gas pedal isn't connected to your engine." | 🟡 alone, ✅ with line 2 | "Most new cars" now follows in the very next line, so the scope gap is about 3 s. Acceptable. |
| 2 | "In most new cars it's just a sensor, wired to a computer instead of a cable." | ✅ | A1–A3: NHTSA "primary connection... is electronic"; CRS "rather than a mechanical cable". |
| 3 | Question | no claim | Wording "opens up the engine" is loose but asserts nothing. |
| 4 | Small motor opens the throttle when the computer tells it to | ✅ | A4, A3. |
| 5, 7 | Skid scene; shoe catches both pedals | 🎭 scenarios | no claim. |
| 6 | "Every new US car since 2011 has stability control, and it can cut back engine power by itself." | ✅ | B3: GVWR 10,000 lb or less; S8.4 from 2011-09-01; "means to modify engine torque". "Cut back" matches "modify". |
| 8 | "ignore or cut the gas" | ✅ | C3: "ignore or reduce the commanded throttle input". |
| 9 | "Every new US car has had it since the 2018 models, though no federal rule made carmakers add it." | ✅ | C3, 2019 withdrawal. "Federal" removes the state-law gap. |
| 10 | "if something in this system fails mid-drive, the car often drops into a reduced-power limp mode" | ✅ | C1: "often have 'limp home' modes... when a fault occurs". Now matches the source's scope. |
| 11 | "Steering may go the same way, and at least one new pickup in the US already steers by wire." | ✅ | D1. "Steers by wire" is the manual's term; no "new" sales-page source (see earlier note), acceptable. |
| 12 | "You already trust a computer with your pedal, but would you trust one with your steering?" | 🟡 minor | Opinion/rhetorical. "You already trust..." is true for most new cars, not an older car with a cable. Optional: "Chances are you already trust...". The "no mechanical link" sense now rests on "by wire" in line 11, which is fine. |

### Second recheck, reworded script (lines 5–8, 10, 11), 2026-10-23: PASS

Lines 1–4, 9 and 12 are as in the recheck above (line 3 is now "So what actually happens when you press down?", no claim). This table supersedes the earlier ones for these lines.

| Line | Claim | Status | Note |
| --- | --- | --- | --- |
| 5 | "That means the computer can also cut your power, even while your foot is still pressing down." | ✅ | The "means" follows from lines 2 and 4 (computer sets the throttle) and is shown by B3 (stability control must "modify engine torque") and C3 (override "ignore or reduce"). No source for any other cut-power case; none is claimed. |
| 6 | "…stability control can do exactly that, and every new US car since 2011 has it." | ✅ | B3: 10,000 lb GVWR or less; S8.4 from 2011-09-01. "Exactly that" = cut power with the foot down; the rule says "modify engine torque", which includes reducing it. |
| 7 | "It can also happen if you brake hard and your shoe catches the gas pedal too." | ✅ | "It" = the computer cutting power; C3 brake override. The scenario is hypothetical. |
| 8 | "That's brake override, which makes the car ignore or cut the gas…" | ✅ | C3: "ignore or reduce the commanded throttle input". "That's brake override" correctly names only the brake case (line 7), not stability control. Safety framing kept. |
| 9 | "it" now = brake override from line 8 | ✅ | C3 / 2019 withdrawal, as before. |
| 10 | "if part of this system fails while you're driving, the car often drops into limp mode, with reduced power." | ✅ | C1: "often have 'limp home' modes which restrict the throttle opening to a small range when a fault occurs". "Part of this system" is within the source's "a fault". |
| 11 | "Steering could be next, and at least one new pickup in the US already steers by wire." | ✅ | D1; "could" is a hedged opinion. "New" currency caveat as before. |

### Third check, rewritten gas-and-electric script (12 lines), 2026-10-23: PASS (no ❌), with three 🟡 lines that need a hedge word

This table supersedes all earlier ones. The gas-car claims are ✅ from NHTSA/CFR texts opened. The EV half of lines 1, 5, 6, 7 and 10 rests on thinner sources (see below).

| Line | Claim | Status | Fix (spoken) |
| --- | --- | --- | --- |
| 1 | "In most new cars, the gas pedal doesn't move anything under the hood." | ✅ | Gloss of NHTSA 2012 "the primary connection between the pedal and the engine throttle is electronic" (springs at the pedal/throttle remain, but the pedal doesn't move the throttle). "Most" is NHTSA's scope for gas cars; the EV half rests on A5 (Wikipedia, patent), and "most new cars" covers it. |
| 2, 3, 4 | Question; pedal is only a sensor telling a computer; gas car's computer has a small motor open the throttle | ✅ | A1–A4 (CRS, NHTSA). Line 4 is scoped "in a gas car". |
| 5 | "An electric car has no throttle, and its computer sets how much power the motor sends." | 🟡 | A5. "Computer sets motor power": Wikipedia ("In electric vehicles, this system controls the electric motors"; pedal input to power inverters) and Hitachi patent. "No throttle" is true of a throttle valve (no engine intake), but no source opened says so, and Wikipedia itself calls the EV system "throttle-by-wire". Fix: "An electric car has no throttle valve, and its computer sets how much power the motor gets." |
| 6 | "Either way, the computer can also cut your power with your foot still down." | 🟡 | Gas: ✅ (stability control "modify engine torque"; brake override "ignore or reduce"). EV: only search leads (a Tesla spokesperson quote on brake override reported by Green Car Reports; EV stability-control patents), none opened. Fix: "In most cars, the computer can also cut your power with your foot still down." |
| 7 | "If you skid on a wet curve, stability control can do that, and every new US car since 2011 has it." | ✅ for "every new US car since 2011 has it"; 🟡 for "can do that" in an EV | 49 CFR 571.126: S3 covers passenger cars, MPVs, trucks, buses at 10,000 lb GVWR or less; no powertrain exclusion and EVs/hybrids are not mentioned; S4 says "a means to modify engine torque, as necessary" and does not define "engine". So EVs are covered by applicability and the torque wording is an inference for motors, not a stated rule. Fine if line 6 gets "in most cars". No company named. |
| 8 | Brake hard, shoe catches the gas pedal | 🎭 scenario | no claim. |
| 9 | "Brake override makes the car ignore or cut the gas, and please don't test that on the road." | ✅ | C3: "ignore or reduce". NHTSA 2019 says "all light vehicles... voluntarily equipped" (so includes EVs as light vehicles). This line no longer claims "every" or "since 2018". |
| 10 | "…the car often drops into limp mode, with reduced power." | 🟡 | C1: NHTSA 2012: "They often have 'limp home' modes... when a fault occurs" (written about gas ETC). For EVs, only a search lead (an NHTSA-hosted filing describing an EV "drive-by-brake" limp mode, not opened). Fix: "…the car can drop into limp mode, with reduced power." ("Often" is the source's word for gas cars; "can" holds for both.) |
| 11 | "Steering could be next, and at least one new pickup in the US already steers by wire." | ✅ | D1. |
| 12 | "Would you trust a computer with your steering, the way most of us do with the gas?" | ✅ | Opinion/rhetorical; "most of us" matches "most new cars" (A1). |

### Fourth check, new opening (lines 1, 3, 6), 2026-10-23: PASS

| Line | Claim | Status | Note |
| --- | --- | --- | --- |
| 1 | "Push the gas pedal in most new cars, and you're only asking a computer for power." | ✅ | "Asking" frames A3 (CRS: sensors send signals to computers that "determine how far to open the throttle"); "most" is NHTSA's scope (A1); EV half via A5. |
| 3 | "Normally it says yes, because the pedal is only a sensor telling the computer how far you pressed." | ✅ | Framing of A3. "Normally yes" is the unremarkable default (the computer sets the throttle from the pedal signal); no statistic is claimed. |
| 6 | "Either way, in most cars the computer can also say no, cutting your power with your foot still down." | ✅ | "In most cars" is the hedge asked for in the third check; gas case is B3/C3 ✅, EV half is 🟡 leads, covered by "most". |

### Fifth check, changed opening (lines 1–3), 2026-10-23: PASS

| Line | Claim | Status | Note |
| --- | --- | --- | --- |
| 1 | "Most new cars won't speed up just because you press the gas." | 🟡 | Supported as "a press is a request the computer can refuse": stability control "modify engine torque" (B3), brake override "ignore or reduce" (C3), "ETC could override the accelerator pedal assembly" (NHTSA 2012, partial quote). But in ordinary driving a press does speed the car up, so read flat it overstates. Fix: "Most new cars won't always speed up when you press the gas." (✅) |
| 2 | "A computer has to say yes first, so what happens when it says no?" | ✅ | A3: sensors signal computers that "determine how far to open the throttle". Framing plus a question. |
| 3 | "Normally it does say yes, because the pedal is only a sensor telling the computer how far you pressed." | ✅ | As in the fourth check; it resolves the hedge in line 1. |

**Not sourced (asked, 2026-10-23):** "most new cars use electric power steering, a motor that helps you turn, while the wheel stays mechanically linked". No source for electric power steering share was opened in this check or by the researcher. ❌ until sourced; do not speak a share ("most") for EPS without one.

**Legally sensitive (none named in the voice):** NHTSA/NASA/DOT (low, public bodies), Tesla (D1, low, own-manual description), Toyota (C4, medium if named; not in this script), Mercedes, Lexus, Nissan (low). The script names no company.

**Not in the script, so not at risk:** Toyota runaway investigations (C4), eco mode (E1), two-sensor count (B1), EV torque (A5).

**Verdict: PASS.** No ❌. Recommended spoken edits before voice: line 7 "cut back", line 9 "ignore or cut", line 11 "often". Line 1 "probably" and line 13 "mechanically" are optional.

---

Agreed angle (owner): in most modern gas cars the accelerator is electronic throttle control (ETC). The pedal is a position sensor; a computer (the engine control unit) reads it and decides how far a small motor opens the throttle. There's no cable. Twist: steer-by-wire, where a few new cars have no mechanical link from the steering wheel to the wheels. Debate: what if the electronics fail (redundancy, limp mode, brake override)? Payoff: pressing the gas is a request, not a command. Audience 98% US.

Owner's hook: "Your gas pedal isn't connected to your engine." **Verdict: 🟡 as worded, ✅ with two small changes** (A1, A2):

- add the scope **"In most new cars"** (NHTSA in 2012: mechanical throttles "superseded by ETC", only "a few vehicle models" left), and
- make "connected" mean **physically** (NHTSA: "the primary connection between the pedal and the engine throttle is electronic"; some springs remain). Either say "isn't physically connected" / "has no cable to your engine", or keep "isn't connected" and resolve it in the very next line ("It's connected by a wire, to a computer").

Safe spoken hook: **"In most new cars, your gas pedal isn't physically connected to your engine."** Alternative that keeps the owner's rhythm: "In most new cars, your gas pedal isn't connected to your engine. Not with a cable, anyway."

Everything was accessed on 2026-10-22. Quotes are verbatim as returned. A long quote is given in pieces joined by "…" or "/".

**Access notes for the fact-checker:**

- (1) **Read directly:** nothing. My PDF renderer (pdftoppm) isn't installed, so no PDF could be read directly this session.
- (2) **Read through the web tool (a small model returned the quotes as verbatim, capped at 125 characters each; re-open and re-quote before ✅):**
  - Federal Register on govinfo HTML: the 2012 FMVSS 124 NPRM (FR Doc. 2012-9065, both halves read) and the 2019 withdrawal (FR Doc. 2019-09820);
  - 49 CFR 571.126 on Cornell LII (FMVSS 126, stability control);
  - CRS report R41205 (2010) via EveryCRSReport (first 100,000 of 312,000 characters; the rest is mostly image data and appendices);
  - the DOT 2011 NHTSA-NASA press release (repost on autosafety.org);
  - IEEE Spectrum (2011 NASA findings; 2013 Infiniti Q50);
  - Reuters via Claims Journal (2013 verdict);
  - the Cybertruck owner's manual (tesla.cn mirror, en_US);
  - InsideEVs (2024), Electrek (2026), Jalopnik (2026), Autotrader.ca (2025);
  - NHTSA recalls API (14V583);
  - a Kia US owner's manual page; a Hitachi patent on Google Patents.
- (3) **Not readable (403 / compressed PDF):**
  - nhtsa.gov PDFs and pages (the Toyota ETC technical assessment, vehicle characterization, and NHTSA's 2018–2020 "Functional Safety Assessment of a Generic Accelerator Control System With Electronic Throttle Control" series, DOT HS 812 557 and siblings, the best general source on pedal sensors, which I couldn't open);
  - federalregister.gov (bot check); justia (403);
  - National Academies TRB Special Report 308 (reader is JavaScript only);
  - transportation.gov (403); mercedes-benz.com (403); autonews.com (403); tomorrowstechnician.com (403).

  Anything resting only on these is a lead or 🟡.

**Corrections and cautions for the brief:**

| Brief said | What the sources say | Entry |
| --- | --- | --- |
| "Isn't connected" | Fair only as "not **mechanically/physically** connected". NHTSA: the primary connection is "electronic"; springs remain. | A2 |
| "Most" cars, a share/date | No federal share found. NHTSA said in 2012 mechanical throttles were "superseded by ETC", with "a few vehicle models" left. One maker's switch dates: 2002 (Camry), 2005 (Corolla). **No percentage can be spoken.** | A1 |
| Brake override "required" after 2009–2010 | **Never required.** NHTSA proposed it in 2012, then withdrew the proposal in 2019 because "as of model year 2018, all light vehicles for sale in the U.S. market have been voluntarily equipped". | C3 |
| "NHTSA/NASA found no electronic cause" | ✅ as attributed, but it was **one maker's** system (Toyota, 2011), and NASA said this "does not mean it could not occur". A 2013 Oklahoma jury found against the maker in one software case, which was then settled. Keep the line generic or leave it out. | C4 |
| Steer-by-wire "a few new cars" in the US | Only **one** production vehicle confirmed on US roads with no mechanical link (an electric pickup, Cybertruck). Others: Mercedes EQS 2027 (option; US availability of the option unconfirmed), Lexus RZ (Europe/Japan; not in the US, "regulatory hurdles"), Infiniti Q50 (2014-on, but it kept a backup clutch to a real shaft). "A few new cars" holds worldwide, not as a US count. | D1–D3 |
| Slight delay when pressing | ❌ no source for a built-in pedal delay. What *is* sourced: eco modes soften the response, and brake override may wait "on the order of one second". | E1, C3 |
| Rev limits, cruise control | ❌ not sourced this session (common knowledge, but no primary quote). Stability control **is** sourced: the federal rule requires it to be able to "modify engine torque". | B3 |

---

## Index: claims the script is likely to make

| # | Claim | Status | Entry |
| --- | --- | --- | --- |
| 1 | In most new cars the gas pedal has no mechanical link (cable) to the engine | ✅ (NHTSA 2012, CRS 2010) | A1, A2 |
| 2 | The pedal is a sensor; it sends a signal to a computer | ✅ | A3 |
| 3 | The computer decides how far to open the throttle | ✅ (CRS) | A3 |
| 4 | A small electric motor opens the throttle | ✅ (NHTSA lists "electric motors"; throttle-side motor named by Bosch-spec lead only) | A4 |
| 5 | Pedals (and throttles) use two sensors that must agree | ✅ for one maker (CRS); 🟡 as "most cars" | B1 |
| 6 | The computer can ignore the pedal if the sensor signal looks wrong | ✅ (NHTSA 2012) | B1 |
| 7 | Every new US car since Sept 2011 must have stability control that can cut engine power | ✅ (FMVSS 126) | B3 |
| 8 | Eco mode: same pedal press, gentler response | ✅ for one maker's manual; 🟡 general | E1 |
| 9 | If something fails, "limp home" mode: throttle limited to a small opening | ✅ (NHTSA 2012: "often") | C1 |
| 10 | Serious fault: falls back to idle | ✅ for one maker (CRS) | C2 |
| 11 | Press brake and gas together: the brake wins (brake override) | ✅ | C3 |
| 12 | Every new US light vehicle has brake override (since MY 2018), voluntarily, not by law | ✅ (NHTSA 2019) | C3 |
| 13 | Brake override followed the 2009–2010 unintended-acceleration investigations | ✅ attributed (DOT 2011, NHTSA 2012) | C3, C4 |
| 14 | Federal investigators and NASA found no electronic cause (in one maker's cars) | ✅ attributed; scope: Toyota 2011 | C4 |
| 15 | In EVs there's no throttle at all; the pedal asks for torque | 🟡 (patent; general engineering) | A5 |
| 16 | A few new cars have no mechanical link from steering wheel to wheels | ✅ worldwide; 🟡 as a US count | D1–D3 |
| 17 | They stay safe with doubled motors/signal paths and backup power | ✅ (maker docs, teardown, press) | D1, D2 |
| 18 | If a steer-by-wire fault is detected, the truck warns you and cuts drive power | ✅ (owner's manual) | D1 |
| 19 | A share/percentage of cars with ETC | ❌ none found | A1 |
| 20 | Built-in pedal delay in all cars | ❌ none found | E1 |

---

## A. The pedal isn't mechanically connected

### A1. In most new cars, mechanical throttle links have been replaced by electronic throttle control

- **Script (likely):** "In most new cars, your gas pedal isn't connected to your engine."
- **Status:** ✅ for "most new cars" (tool-quoted; re-quote). NHTSA's own words in 2012; logically more true since, but I found no later federal count. 🟡 for "every"/"nearly every" (trade press only, see note). ❌ for any percentage.
- **Source:** [Federal Motor Vehicle Safety Standards; Accelerator Control Systems, NPRM (FR Doc. 2012-9065)](https://www.govinfo.gov/content/pkg/FR-2012-04-16/html/2012-9065.htm), NHTSA, 2012-04-16 (accessed 2026-10-22)
- **Quote (tool):** "Now that mechanical accelerator controls have been superseded by ETC" / "Currently, there are a few vehicle models that still have mechanical throttle controls,"
- **Source (dates, one maker):** [Unintended Acceleration in Passenger Vehicles (R41205)](https://www.everycrsreport.com/files/20100426_R41205_4aeb8e4d9b01cc000e436ec36e0559e5ba117a75.html), Suzanne M. Kirchhoff and David Randall Peterman, Congressional Research Service, 2010-04-26 (accessed 2026-10-22)
- **Quote (tool):** "the model year 2002 Camrys, in which Toyota had introduced an electronic throttle" / "introduction of the electronic throttle in those vehicles in model year 2005" (Corolla)
- **Source (2019 view):** [Federal Motor Vehicle Safety Standards; Accelerator Control Systems, withdrawal (FR Doc. 2019-09820, 84 FR 21309)](https://www.govinfo.gov/content/pkg/FR-2019-05-14/html/2019-09820.htm), NHTSA, 2019-05-14 (accessed 2026-10-22)
- **Quote (tool):** "Modern ETC systems have become highly complex, software-driven systems that are fully integrated with electronic powertrain controls" (p. 21310)
- **Note:**
  - Trade press (leads, not opened: Tomorrow's Technician returned 403) says "virtually every manufacturer has an electronic throttle system on board every make and model" (search snippet). Enough to say "most"; not enough for "every".
  - First production use: 1980s (Wikipedia lead; 1988 BMW 7 Series per trade snippet). Not for the voice.
  - US scope: NHTSA's statement is about the US market (the rule's subject). I found no evidence of a mechanical-throttle new car sold in the US in 2026, but I didn't verify that there are none.

### A2. "Not connected" is fair only as "not mechanically connected": the link is electronic

- **Script (likely):** "There's no cable. Just a wire to a computer."
- **Status:** ✅ (tool-quoted; re-quote). Scope: "most" of the mechanical parts, not all; return springs remain at the pedal and throttle.
- **Source:** 2012 NPRM, as in A1
- **Quote (tool):** "In an ETC or "throttle-by-wire" system, the driver still uses an accelerator pedal to modulate drivetrain output." / "However, most of the mechanical components linking the pedal to the throttle on the engine now are supplanted by electronic components including sensors, electric motors, a control module, and connecting wires." / "Some mechanical parts, particularly springs, are still employed, but the primary connection between the pedal and the engine throttle is electronic."
- **Source:** CRS R41205, as in A1
- **Quote (tool):** ETC uses "sensors, rather than a mechanical cable or rods attached to an accelerator, are used to control the throttle."
- **Note:** "Isn't connected to your engine" alone is 🟡 (it *is* connected electrically). Fix in the hook ("physically") or in the next line ("by a wire, to a computer"). Both are ✅.

### A3. The pedal is a sensor; a computer decides how far to open the throttle

- **Script (likely):** "The pedal is just a sensor. It tells a computer how far you pressed, and the computer decides how much air the engine gets."
- **Status:** ✅ (tool-quoted; re-quote).
- **Source:** CRS R41205, as in A1
- **Quote (tool):** "the sensors send signals to onboard computers that determine how far to open the throttle."
- **Source:** 2012 NPRM, as in A1
- **Quote (tool, proposed definition, partial):** "Electronic throttle control means an accelerator control system in which movement of the driver-operated control" (the rest, paraphrased by the tool: is translated into throttle actuation at least partly by electronic rather than mechanical means)
- **Note:** "How much air" is a gloss (the throttle is an air valve). Safe; the scriptwriter can say "how far to open the throttle" if the fact-checker wants the source's words.

### A4. A small electric motor opens the throttle valve

- **Script (likely):** "A tiny motor at the engine turns the throttle open."
- **Status:** ✅ that ETC uses "electric motors" (NHTSA). The detail that the motor sits on the throttle body and turns the valve is standard engineering but rests on product listings only (leads). Phrase it as "a small motor opens the throttle", which NHTSA's list supports.
- **Source:** 2012 NPRM, as in A1 (quote in A2: "sensors, electric motors, a control module, and connecting wires")
- **Lead (not a source):** Bosch Motorsport electronic throttle body listings (resellers, e.g. [Fastlane Spares](https://fastlanespares.co.nz/products/bosch-motorsport-60mm-dbw-electronic-throttle-body)): "a throttle valve driven by an electric motor" and "Two redundant sensors control the throttle position" (search snippet). Useful for the scene-builder's model, not for citing.

### A5. Electric cars have no throttle; the pedal asks for torque

- **Fact-check 2026-10-23, script line 2 now reads "In most new cars, and in every electric one, it's only a sensor, wired to a computer instead of a cable."** Status: 🟡 for "every electric one"; ✅ would need the wording below. No NHTSA, DOE or SAE page was readable or found that states it for EVs (a DOE-specific search returned nothing from energy.gov). What I opened:
  - [Drive by wire](https://en.wikipedia.org/wiki/Drive_by_wire), Wikipedia (tertiary), accessed 2026-10-23: "In electric vehicles, this system controls the electric motors." Throttle-by-wire is described as running propulsion "without any mechanical connections, such as cables." Pedal input goes to the power inverters. Describes the design in general; does not say "every EV".
  - Hitachi patent US5650700A (below): torque command computed "in response to said accelerator pedal position". One design, 1997.
  - Search-snippet leads only (not opened, not citable): USPTO patents describing an EV powertrain controller that reads the pedal and signals the inverter/motor controller; the evkx.net glossary (403) on "accelerator map and torque-request map".
  - Why "every" fails: it is a universal over all EVs; I found no counterexample, but no source covers all, and the sources are one tertiary page and patents. Also, an electric car has no throttle, so "wired to a computer instead of a cable" is true in substance, but nobody to cite says "all".
  - **Spoken fix (✅/🟡-safe):** "In most new cars, gas or electric, it's only a sensor, wired to a computer instead of a cable." (the "most" scope covers both; the EV half is supported by Wikipedia and the patent as the standard design). Or: "In most new cars, electric ones too, it's only a sensor..." Avoid "every electric one".
- **Earlier researcher status:** 🟡. One patent describes it (tool-quoted). It's the standard design, but I have no regulator or review source. Keep it as a one-line aside or cut it.
- **Source:** [US5650700A, Electric vehicle torque controller](https://patents.google.com/patent/US5650700A/en), Hitachi Ltd, published 1997-07-22 (accessed 2026-10-22)
- **Quote (tool):** "a torque reference calculator unit 80 calculates a torque reference τR" / "based on the output of the accelerator pedal position detector 70" / claim 1: "a torque command calculator which calculates a torque command in response to said accelerator pedal position"
- **Note:** No. 006 (one-pedal) already showed the EV pedal; the hook says "engine", so EVs are outside it. Fine as an aside.

---

## B. The computer has the final say

### B1. Redundant sensors: two signals that must agree; the computer ignores signals that look wrong

- **Script (likely):** "Most pedals have two sensors. If they disagree, the computer doesn't trust either."
- **Status:**
  - ✅ (tool-quoted) for **one maker**: "Toyota accelerators and throttles each have two sensors that must work together" (CRS).
  - ✅ (tool-quoted) for the general principle: ETC "generally" has "fault checking and control redundancy", and can override the pedal "if signals from the pedal position sensor exceed design limits" (NHTSA).
  - 🟡 for "most pedals have two sensors" as a general count. The right primary source (NHTSA DOT HS 812 557, 2018) was unreadable. Spoken fix: "**The pedal usually has two sensors**" is still 🟡; "**The system double-checks the pedal**" is ✅.
- **Source:** CRS R41205, as in A1
- **Quote (tool):** "Electronic throttles are engineered with redundant components in an effort to create a reliable, fail-safe system." / "Toyota accelerators and throttles each have two sensors that must work together for the car to operate."
- **Source:** 2012 NPRM, as in A1
- **Quote (tool):** "ETC systems generally are designed with fail-safe characteristics such as fault checking and control redundancy" / "ETC could override the accelerator pedal assembly if signals from the pedal position sensor exceed design limits."
- **Supporting (one maker, a defect):** [NHTSA recall 14V-583 (recalls API)](https://api.nhtsa.gov/recalls/campaignNumber?campaignNumber=14V583), NHTSA, report received 2014-09-22 (accessed 2026-10-22). Tool paraphrase: if "one of two throttle position sensors" loses its signal, "the engine control module enters fail-safe mode and partially closes the throttle". 6,562 hybrids. Shows the two-sensor design on the throttle side. **Don't use in the voice** (it's a defect story about a named maker).
- **Lead:** [Functional Safety Assessment of a Generic Accelerator Control System With Electronic Throttle Control in Gasoline-Fueled Vehicles (DOT HS 812 557)](https://www.nhtsa.gov/sites/nhtsa.dot.gov/files/documents/812557_safety-assessmt-gen-accelerator-control-system-elec-throttle-control-gas-engs.pdf), Van Eikema Hommes and Becker, NHTSA/Volpe, 2018-07 (403). If the fact-checker can open it, it should settle the two-sensor count and the list of other systems that request torque.

### B2. The computer can command the engine without moving the throttle, and blends other inputs

- **Script (likely):** Not spoken directly; backs "the computer has the last word".
- **Status:** ✅ (tool-quoted; re-quote).
- **Source:** 2012 NPRM, as in A1
- **Quote (tool):** "Fuel injection and ignition timing are among factors that can be varied without any change in throttle position." / "brake-throttle override is an electronic function of the engine control system."

### B3. Every new US light vehicle since Sept 2011 must have stability control that can cut engine power on its own

- **Script (likely):** "And if the car starts to slide, it can cut your power even with your foot to the floor."
- **Status:** ✅ (tool-quoted; re-quote). A strong, US-wide, checkable fact.
- **Source:** [49 CFR § 571.126, Standard No. 126; Electronic stability control systems for light vehicles](https://www.law.cornell.edu/cfr/text/49/571.126), Cornell Law School LII (current CFR text), undated (accessed 2026-10-22)
- **Quote (tool):** S4 definition, attribute (5): "That has an algorithm to determine the need, and a means to modify engine torque, as necessary," "to assist the driver in maintaining control of the vehicle; and" / S8.4: "All vehicles manufactured on or after September 1, 2011 must comply with this standard."
- **Note:**
  - Scope (fact-checked 2026-10-22): S3 covers vehicles with a GVWR of 4,536 kg (10,000 lb) or less, so "every new car" is ✅; "cut" is 🟡 (the rule says "modify engine torque"), use "cut back". Say "every new car". Phase-in 55% → 75% → 95% from Sept 2008 (S8.1–S8.3, tool).
  - The rule demands a means to "modify engine torque", not specifically a throttle motor. Don't say "the law requires electronic throttle". Say "the car can cut power".
  - **Traction control, cruise control, rev limiters:** ❌ no source opened this session. Cut them from the voice, or the fact-checker sources them (DOT HS 812 557 is the likely place). Stability control alone makes the point.

---

## C. What if it fails?

### C1. Limp-home mode: on a fault, the throttle is held to a small opening

- **Script (likely):** "If a sensor fails, the car goes into 'limp mode': just enough power to get you off the road."
- **Status:** ✅ (tool-quoted; re-quote). NHTSA says "often", so say "most cars" or "usually", not "every".
- **Source:** 2012 NPRM, as in A1
- **Quote (tool):** "They often have "limp home" modes which restrict the throttle opening to a small range when a fault occurs." / "limp-home modes can adjust engine operation to prevent stalling and to provide enough power"
- **Note:** "Just enough power to get you off the road" is a gloss of "enough power" (the sentence continues; the tool cut it). Re-quote the full sentence before keeping "off the road". Many dashboards call it "reduced engine power" (GM service-bulletin wording, search snippet only).

### C2. A serious fault can drop the engine to idle

- **Script (likely):** Optional: "On a serious fault, it just drops to idle."
- **Status:** ✅ for one maker (CRS); 🟡 as general. NHTSA's 2012 NPRM confirms BTO and fail-safe may "return it to idle" in some vehicles.
- **Source:** CRS R41205, as in A1
- **Quote (tool):** "in the case of a serious malfunction, the vehicle is engineered to revert to idle mode."

### C3. Brake override: press brake and gas together, the brake wins. Every new US light vehicle has it, voluntarily

- **Script (likely):** "Press the brake and the gas at the same time, and the computer ignores the gas."
- **Status:** ✅ (tool-quoted; re-quote). **Correction to the brief:** it was never made law. NHTSA proposed requiring it (2012) and withdrew the proposal (2019) because every maker had adopted it.
- **Source:** 2012 NPRM, as in A1
- **Quote (tool):** "Generally, it works by continuously checking the position of the brake and accelerator pedals" / "it invokes the override function which causes the engine control system to ignore or reduce the commanded throttle input" / "BTO will engage as soon as the driver applies the brake pedal" / "there may be a delay built into the system on the order of one second" / "The BTO system may check conditions such as vehicle speed, engine revolutions per minute (RPM)," / "This proposed equipment requirement makes BTO engagement optional below 16 km/h (10 mph)." / "As of model year 2012, all but two light vehicle manufacturers have incorporated brake-throttle override" / NASA, as cited: "When the brake can override the throttle command it provides a broad defense against unintended engine power"
- **Source:** 2019 withdrawal, as in A1
- **Quote (tool):** "as of model year 2018, all light vehicles for sale in the U.S. market have been voluntarily equipped with a BTO system." / "NHTSA does not find that there is presently a safety need for a BTO requirement in FMVSS No. 124." (p. 21310)
- **Source (link to the investigations):** [U.S. Department of Transportation Releases Results from NHTSA-NASA Study of Unintended Acceleration in Toyota Vehicles (DOT 16-11), repost](https://www.autosafety.org/us-department-transportation-releases-results-nhtsa-nasa-study-unintended-acceleration-toyota-vehicl/), US DOT (reposted by the Center for Auto Safety), 2011-02-08 (accessed 2026-10-22)
- **Quote (tool):** NHTSA planned to "Propose rules, by the end of 2011, to require brake override systems"
- **Note:**
  - Spoken "ignores the gas" is ✅ ("ignore or reduce"). "Instantly" is ❌ (up to about a second; may not engage below 10 mph or at some speeds/RPMs).
  - **Safety flag:** don't invite viewers to test it while driving. If the "checkable" beat stays, frame it as "it's in your car", not "try it".
  - One maker's manual describes a version that drivers can switch on or off ([Mazda CX-30 manual, general/EU edition](https://owners-manual.mazda.com/gen/en/cx-30/cx-30_8jr4eo20f/contents/05050110.html): "Operation of the brake override system can be turned on or off."). Not US-verified; another reason not to say "always".
  - The 2010 CRS report: one maker would make it "a standard feature on 2011 model year vehicles", and such systems "are already standard on certain makes" (tool). Context only.

### C4. Federal investigators, with NASA, found no electronic cause of high-speed runaway (one maker's cars, 2011)

- **Script (likely):** Optional, in the debate: "After a wave of runaway-car complaints around 2010, federal investigators and NASA engineers took the electronics apart, and found no electronic cause."
- **Status:** ✅ (tool-quoted; re-quote) **as attributed and scoped**: Toyota's ETC, 2011; "large throttle openings". 🟡 if generalised to "electronic throttles are safe". Keep it neutral: no brand in the voice.
- **Source:** DOT release, as in C3
- **Quote (tool):** "NASA engineers found no electronic flaws in Toyota vehicles capable of producing the large throttle openings" / the known causes were "sticking" accelerator pedals and "a design flaw that enabled accelerator pedals to become trapped by floor mats" / Secretary LaHood: "There is no electronic-based cause for unintended high-speed acceleration in Toyotas."
- **Source:** 2012 NPRM, as in A1
- **Quote (tool):** "NASA was not able to identify an electronic cause of large, unintended throttle openings."
- **Source (the caveat):** [NASA Can't Find Unintended Acceleration Causes in Toyota's Electronic Throttle Control System](https://spectrum.ieee.org/nasa-cant-find-unintended-acceleration-causes-in-toyotas-electronic-throttle-control-system-), Robert N. Charette, IEEE Spectrum, 2011-02-09 (accessed 2026-10-22)
- **Quote (tool):** "Proof for the hypothesis that the ETCS-i caused the large throttle opening UAs" could not be found / "[t]his does not mean it could not occur." / one failure mode "can cause the throttle to jump to 15 degrees in certain conditions and may not generate a DTC" and "can be removed by releasing the accelerator pedal or overridden by the braking system."
- **Source (the later dispute):** [Toyota Settles Acceleration Case After $3M Verdict](https://www.claimsjournal.com/news/southcentral/2013/10/28/239062.htm), Jessica Dye (Reuters), Claims Journal, 2013-10-28 (accessed 2026-10-22)
- **Quote (tool):** "A jury in Oklahoma on Thursday ordered the company to pay $3 million in compensatory damages" / "The lawsuit alleged that software defects in the electronic throttle control system" / Toyota: "While we strongly disagree with the verdict, we are satisfied that the parties reached a mutually acceptable agreement"
- **Note:**
  - **Neutrality:** the fair one-liner is "investigators found no electronic cause, and every new car now lets the brake override the gas." Don't say "it was the drivers" (NHTSA named pedal sticking and floor-mat entrapment; driver error appears in press summaries only).
  - The National Academies (TRB Special Report 308, 2012) backed NHTSA's decision to close the investigation (press summaries; NAP reader unreadable). Lead only.
  - **Legal flag:** a named company in a safety story. Keep it unnamed in the voice; if the post description cites the DOT release, the name appears there, which is accurate and public.

---

## D. Twist: steer-by-wire

### D1. One electric pickup sold in the US steers with no mechanical connection, backed by redundant sensors and actuators

- **Script (likely):** "And a few new cars have gone further: the steering wheel isn't connected to the wheels either."
- **Status:** ✅ (tool-quoted; re-quote) for this vehicle (Tesla Cybertruck, US, since late 2023). The story is about its own product, so naming is allowed, but not needed: "one new pickup" works.
- **Source:** [Cybertruck Owner's Manual: Steering Wheel (en_US)](https://tesla.cn/ownersmanual/cybertruck/en_us/GUID-46420EE2-F6B0-4E95-88D5-E50CB3061101.html), Tesla (manual mirror on tesla.cn; tesla.com returned 403 in No. 007), undated (accessed 2026-10-22)
- **Quote (tool):** "Cybertruck uses steer-by-wire technology, which means that there is no mechanical connection" (between the steering wheel and the wheels, per the tool) / "Instead, sensors in the steering column communicate electronically with the steering racks." / "The steer-by-wire system is controlled by multiple redundant sensors and actuators." / "In the unlikely case that Cybertruck detects an issue, an alert displays on the touchscreen, a chime sounds," / "and Cybertruck gradually reduces drive torque while informing you to pull over." / "This alert indicates a possible issue with one of the redundant systems."
- **Source:** [Tesla Cybertruck Teardown Continues With A Look At Its Steer-By-Wire System](https://insideevs.com/news/717617/cybertruck-teardown-steering-by-wire/), Andrei Nedelea, InsideEVs, 2024-04-26 (accessed 2026-10-22)
- **Quote (tool):** "no mechanical link between the steering wheel and the wheels" / "has two motors for redundancy" / "the backup motor can take over and keep the steering system alive"
- **Note:** The two motors' separate power sources (48 V and the high-voltage battery) appear in search snippets only (lead). Say "backup motors", not "backup batteries", unless re-sourced.

### D2. A 2027 luxury EV offers steer-by-wire with doubled actuators, two signal paths and backup power; US availability of the option unconfirmed

- **Script (likely):** Backs "a few new cars" and the "how they stay safe" beat.
- **Status:** ✅ (tool-quoted; re-quote) for the design. 🟡 for the US: the 2027 EQS reaches US dealers in the second half of 2026, but I found no source saying the steer-by-wire **option** is offered in the US.
- **Source:** [Mercedes confirms steer-by-wire for 2026 EQS with questionable steering wheel](https://electrek.co/2026/04/02/mercedes-steer-by-wire-yoke-steering-wheel-eqs-2026/), Fred Lambert, Electrek, 2026-04-02 (accessed 2026-10-22)
- **Quote (tool):** "Steer-by-wire eliminates the mechanical connection between the steering wheel and the front wheels entirely." / if the primary system fails, "rear-axle steering and targeted individual wheel braking can still keep the car controllable." (Tool summary of the rest: a doubled set of actuators, two signal channels, a backup power supply.)
- **Source:** [2027 Mercedes-Benz EQS Drives Farther, Charges Faster And Has Available Steer-By-Wire](https://www.jalopnik.com/2147205/2027-mercedes-benz-eqs-faster-charging-more-range-and-steer-by-wire/), Daniel Golson, Jalopnik, 2026-04-13 (accessed 2026-10-22)
- **Quote (tool):** "the EQS with the new steer-by-wire option." / "Mercedes says the 2027 EQS will reach dealers in the U.S. in the second half of this year." / "the design utilizes a redundant system architecture." / "These two signal paths ensure steering capability is always guaranteed."
- **Note:** The Mercedes Group page ([Steer-by-wire becomes reality in the new EQS](https://group.mercedes-benz.com/technology/innovation/development/steer-by-wire.html)) returned 403. It's the primary source for the redundancy detail; the fact-checker should try it.

### D3. Earlier and elsewhere: one 2014 sedan steered by wire but kept a backup shaft; one EV crossover has it in Europe, not the US

- **Script (likely):** Not spoken; backs "a few" and keeps "no mechanical link" honest.
- **Status:** ✅ (tool-quoted; re-quote).
- **Source:** [Top Tech Cars 2013: Infiniti Q50](https://spectrum.ieee.org/infiniti-q50), Lawrence Ulrich, IEEE Spectrum, 2013-03-29 (accessed 2026-10-22)
- **Quote (tool):** "The Infiniti Q50 changes direction without any mechanical connection between the steering wheel and the front wheels." / "There's even a physical backup: Under a failure, a clutch engages to restore a driver's mechanical control." / "Nissan has done the same thing by providing three independent electronic controllers."
- **Source:** [2026 Lexus RZ First Drive Review + Video](https://www.autotrader.ca/editorial/expert-reviews/lexus/rz/2026-lexus-rz-first-drive-review-plus-video/), Dan Ilika, Autotrader.ca, 2025-07-08 (accessed 2026-10-22)
- **Quote (tool):** "the system isn't yet available in Canada or the United States, with regulatory hurdles holding it back"
- **Note:**
  - The Q50 had a real steering shaft that a clutch could lock in. So it had "no mechanical connection" in normal driving but a mechanical **backup**. Don't count it as "no link at all".
  - **Regulation (FMVSS):** I found no US rule that requires or bans a mechanical steering link, and no NHTSA statement specific to steer-by-wire. The only lead is the Lexus "regulatory hurdles" line (a reviewer's words, not a regulator's). ❌ for any spoken regulatory claim. Leave regulation out of the voice.
  - **Spoken wording:** "a few new cars" ✅ worldwide (pickup, EQS, RZ, plus Chinese models, not opened). If the line implies the US: "**at least one new pickup in the US**" ✅, or "a few new cars" 🟡.

---

## E. Things a viewer can notice

### E1. Eco mode: the same press gives a gentler response

- **Script (likely):** "Switch to eco mode and the same press gets you less. Your foot didn't change. The computer's answer did."
- **Status:** ✅ for one maker's US manual (tool-quoted; re-quote). 🟡 as "most cars". Good for the payoff ("a request, not a command"), and checkable.
- **Source:** [Kia owner's manual: Drive mode (en_US, model code SG2)](https://ownersmanual.kia.com/full_webhelp/SG2/2023/en_US/topics/chapter6_11_1.html), Kia, 2023 (accessed 2026-10-22)
- **Quote (tool):** "When the Drive Mode is set to ECO mode, the engine and transmission control logic are changed to maximize fuel efficiency." / "The acceleration response may be slightly reduced as the accelerator pedal is depressed moderately." / "When the accelerator pedal is deeply depressed for a few seconds:" "The system will be limited, judging that the driver wants to speed up."
- **Note:**
  - The page doesn't name the model (only the code SG2 in the URL). Cite it as "a 2023 US owner's manual"; don't name a model unless the fact-checker identifies it.
  - **"Slight delay when pressing": ❌.** No source says cars add a built-in lag. Don't claim it. The sourced, noticeable versions are: eco mode softens the response (E1), and brake override may take "on the order of one second" (C3).
  - Lead (not a source): aftermarket "throttle response controllers" are sold on the premise that factory pedal maps feel slow (vendor blogs). It's a myth lead, not a fact.

---

## Myths and what the evidence says

| Myth | What the evidence says | Entry |
| --- | --- | --- |
| "The gas pedal pulls a cable that opens the engine." | In most new cars there's no cable: a sensor, a computer and a small motor. | A1–A4 |
| "Floor it and you get full power, always." | The computer can cut power: stability control must be able to "modify engine torque", brake override ignores the gas, eco modes soften it. | B3, C3, E1 |
| "If the electronics fail, the car runs away." | Designed to fail toward less power: fault checking, redundant sensors, limp mode, idle fallback. Investigators found no electronic cause of high-speed runaway in the cars they studied (2011). | B1, C1, C2, C4 |
| "Brake override is required by law." | No. NHTSA proposed it, then withdrew the proposal because every new light vehicle already had it by MY 2018. | C3 |
| "Steer-by-wire means no backup." | The systems shipping now use doubled motors or signal paths and backup power; one fault-handling mode warns you and cuts drive power. | D1, D2 |
| "Every new car is steer-by-wire now." | Only a few; in the US, one pickup confirmed. | D1–D3 |

## Hook facts (surprising, concrete)

1. **No cable:** in most new cars the gas pedal talks to a computer, not the engine (✅ A1–A3).
2. **The brake always wins:** every new US light vehicle ignores the gas if you're on the brake, and no law requires it (✅ C3).
3. **By law, the car can cut your power:** every new US car since 2011 must be able to reduce engine torque by itself to keep you from sliding (✅ B3).
4. **One pickup has no steering shaft at all** (✅ D1).
5. **Eco mode:** same foot, different answer (✅ one maker, E1).

## Suggested angles and hooks (within the agreed angle)

1. **The request (owner's angle; the lived moment).**
   Hook: "In most new cars, your gas pedal isn't physically connected to your engine."
   Question: "So who's actually opening the throttle?"
   Facts: A1–A4, B1, C3, B3, D1. Status: ✅ with "physically".
2. **The brake always wins (the finding).**
   Hook: "Press the brake and the gas at the same time, and every new car in America ignores the gas."
   Question: "So who decided that, and what else is it ignoring?"
   Facts: C3, C4, A1, B3. Status: ✅ ("every new light vehicle", MY 2018 on; "ignores or reduces"). Risk: it invites viewers to try it; needs the "don't try it" care.
3. **Who's driving (the wrong recipient).**
   Hook: "When you press the gas, you're not opening anything. You're asking."
   Facts: A3, E1, B3, D1. Status: ✅ (framing, no claim). Close to the payoff, so the ending must not repeat it word for word.

## 7-step outline (one story: one driver pressing the gas; about 40–50 s)

| Step | What the words do (draft beats, not script) | Entries |
| --- | --- | --- |
| 1. Surprise | "In most new cars, your gas pedal isn't physically connected to your engine." Frame 0: YOU's gas car cut open at a city light turning green; YOU's foot on the pedal; the space between pedal and engine is empty except a thin wire. | A1, A2 |
| 2. Specific fact | No cable since well before 2012 in most cars: just a sensor and a wire to a computer. | A1, A2, A3 |
| 3. Question (by ~5 s) | "So who's actually opening the throttle?" | none |
| 4. Answer, then mechanism | The engine computer. YOU presses: the pedal sensor (two signals, double-checked) reports how far; the computer weighs it and tells a small motor how far to open the throttle. "Look at the throttle": the valve turns, lit orange. It can say less: if the car starts to slide, stability control cuts power (every new US car since 2011); in eco mode, the same press gets less. | A3, A4, B1, B3, E1 |
| 5. One idea to keep (the debate) | "And if it breaks?" Signals that disagree get ignored; limp mode holds the throttle to a crack; foot on the brake and the gas is ignored, on every new US car, though no law requires it. It followed the runaway-car investigations around 2010, where investigators and NASA found no electronic cause. | B1, C1, C3, C4 |
| 6. Twist | A few new cars go further: steer-by-wire, no shaft from wheel to wheels, kept safe with backup motors and redundant sensors; on a fault, it warns you and cuts power. | D1, D2 |
| 7. Turn it back | "Next time you press the gas, you're not opening anything. You're asking." End on frame 0: same green light, YOU's foot, the throttle opening in orange. | A3 |

## Scene list (The Section; reuse No. 006's kit)

**Focus objects for realism:**

- **Accelerator pedal module:** a plastic hanging pedal with a sealed sensor housing at the pivot and a 6-pin connector (two sensor circuits). No brand.
- **Electronic throttle body:** an aluminium housing with a round butterfly valve, a small DC motor and gear train under a black cover, and a connector. No brand (shape per the Bosch-style listing, A4 lead).
- **Engine control unit:** a flat finned box with two big connectors, in the engine bay.
- **Steering rack (for D):** a steering column ending in a sensor box with no shaft below it; a rack with two motors.

**Colour:** orange is the hidden system: the wire, the signal pulses, the throttle motor, the computer's decisions. The brake override is the moment the orange throttle signal is cut.

1. **Frame 0: `car-slice`, a new gas variant at a `city-slice` light (`road: 'city'`).** The 'ev' variant's pedal-box layout with an engine bay instead of the motor: pedal, wire, ECU box, throttle body on the intake. `variant: 'indirect'` is a gas car with no orange but no engine cut-open, so a **new variant (e.g. 'gas') is needed**: scene-builder work. Title block with the question.
2. **Pedal detail box (`framing: 'pedals'`-style).** The pedal sensor; two orange traces moving together (B1).
3. **The wire run (`framing: 'wide'`).** One pulse travels pedal → ECU → throttle body (A3).
4. **Throttle detail box.** The butterfly valve turning, motor lit orange (A4). The one X-ray beat.
5. **The computer says less (`city-slice`, wet patch or curve).** The car twitches; the throttle closes while YOU's foot stays down (B3). Optional eco-mode inset: same press, smaller valve opening (E1).
6. **Limp mode (`car-slice` wide).** One pedal trace goes flat; the valve locks at a crack; a dashboard light (the EV dashboard from No. 006 reskinned) (C1).
7. **Brake override (`car-slice`, `framing: 'pedals'`).** Both feet down; the orange signal to the throttle cut; valve back to idle (C3). Caption-safe, no "try this".
8. **Twist: steer-by-wire (`car-slice` variant or a simple cut-away column).** The steering wheel with the column ending at a sensor box, a gap, then a rack with two motors; one motor fails, the other carries on (D1, D2). A new prop.
9. **Loop to frame 0.** Same green light, YOU's foot, throttle opening in orange.

## Legal flags

| Name | Where | Risk | Why |
| --- | --- | --- | --- |
| NHTSA, NASA, US DOT, CRS | A, B, C | Low | Regulators and Congress's research service. Say "federal investigators", "US rules". |
| Toyota (2009–2011 investigations, 2013 verdict) | C4, A1, B1 | **Medium if named** | A safety story with litigation history. Keep the maker unnamed in the voice; the post can cite the DOT release (public, accurate). Don't imply driver blame or a cover-up. |
| Nissan/Infiniti (recall 14V-583; Q50) | B1, D3 | Low if unnamed | The recall is a defect; don't use it in the voice. The Q50 is history only. |
| Tesla (Cybertruck steer-by-wire) | D1 | Low | Own-product description from its manual; naming allowed but unneeded ("one new pickup"). Don't mention steering recalls or failures (none sourced). |
| Mercedes-Benz, Lexus | D2, D3 | Low | Product descriptions; unnamed in the voice. |
| Kia, Mazda (manuals), Hitachi (patent), Bosch (listing lead) | E1, C3, A5, A4 | Low | Product docs; unnamed. |

## Open questions for the owner

1. **Hook wording.** "In most new cars, your gas pedal isn't physically connected to your engine." (✅), or keep "isn't connected" (🟡 alone) and resolve it at once with "Not with a cable, anyway" / "It's connected by a wire, to a computer" (✅ as a pair)? Recommendation: the second. It keeps your line's punch and is honest by second 3.
2. **"Most" vs "nearly every".** NHTSA's own words support "most" (2012: "a few" models still mechanical); "nearly every" rests on trade press. Recommendation: "most".
3. **Name the 2010 investigations?** Recommendation: one generic line ("after a wave of runaway-car complaints around 2010, investigators and NASA found no electronic cause, and now the brake always wins"), no maker named. Or cut it and keep only brake override.
4. **Steer-by-wire wording for US viewers.** Only one vehicle is confirmed on US roads with no link. Options: "a few new cars" (true worldwide, 🟡 if heard as US) or "at least one new pickup" (✅). Recommendation: "a few new cars around the world, including one pickup in the US"; or simply "a few new cars", with the post description listing them.
5. **The "checkable" beat.** The best is eco mode (safe to notice). Brake override is surprising but invites risky testing. Recommendation: show brake override, but don't tell viewers to try it; use eco mode as the "notice it yourself" line.
6. **Gas-car variant.** The scene needs a new `car-slice` gas variant (engine bay, throttle body, ECU) and a steer-by-wire prop. Scene-builder work; you approve before it's dispatched.
