# Sources: flying-car

Researcher draft, 2026-10-27. No script yet. The fact-checker sets final statuses. Every status below is the researcher's starting confidence.

Owner-approved angle: what it would take for a real flying car to work, told as one driver's morning trying to fly to work. Each obstacle teaches one piece of physics. It ends on an open question. Owner-approved hook: "Flying your car to work sounds easy until you try to leave the driveway."

Everything was accessed on 2026-10-27. **How to read the quotes:**

- **(tool)** means the web tool's small model returned the quote from the page. Re-open and re-quote before ✅. No quote in this file was read word for word from a PDF by me: the fetch tool can't parse PDFs here and `pdftoppm` isn't installed.
- **(snippet)** means I saw it only in a search-result summary and didn't open the page. Lead only (🟡 at best).
- **🧮** means our own calculation. The inputs are sourced and the working is shown in section P.
- Numbers in **[brackets]** are my arithmetic or inference.
- "Ton" in the voice means the US short ton (2,000 lb = 907 kg). Two tons = 4,000 lb = 1,814 kg.

---

## Key facts in one screen

1. **Hovering costs far more power than the draft says.** Momentum theory (P1–P4): holding up a 4,000 lb car on four 4-ft fans takes about **940 hp in a perfect world** and **about 1,350–1,570 hp** with real fan losses. With 5-ft fans it takes about 1,080–1,260 hp. The draft's "700 hp" is too low. 🧮
2. **The fans blow about 70–90 mph at the fan and faster below it.** Momentum theory says the air keeps speeding up under the fan, to twice the speed at the fan in the far wake (Georgia Tech notes). An FAA field survey of three eVTOLs under 6,500 lb measured outwash of **almost 100 mph 41 ft from the pad** and **over 60 mph at 100 ft**. 🧮 + ✅
3. **A big EV battery lasts about 4–9 minutes of hover, not ten.** An 85 kWh pack at about 1.1 MW electrical gives **about 4.6 min**, and 131 kWh gives about 7 min. 🧮
4. **Small fans are the root problem.** A Robinson R44 helicopter (2,400 lb) hangs from one 33-ft rotor. Four 4-ft fans have **about 1/17 of that area** (50 ft² vs 855 ft²). Lifting a 4,000 lb car on them means about **28 times the R44's disk loading**, about 3 times the power for the same weight, and much faster air. 🧮
5. **Wings are the cheap way to stay up.** A Cessna 172 (2,558 lb) cruises on about 135 hp (75% of 180 hp). Hovering the same weight on four 4-ft fans would take about 690 hp. That's **about 5 times more**. 🧮
6. **Flying cars have flown, and one was certified in 1956.** The Taylor Aerocar was certified by the CAA in 1956. The Klein Vision AirCar got a Slovak certificate of airworthiness in 2022. The Samson Switchblade flew in November 2023. Alef released video of its ultralight test car taking off vertically in February 2025. **Most of the ones that have flown need a runway.** ✅
7. **"Lots of concepts":** the Vertical Flight Society's directory passed **1,100 electric VTOL designs from more than 450 designers** (March 2025). Most are air taxis, not cars, so phrase it carefully (A1). ✅
8. **US rules:** you need a pilot certificate with the right category rating (powered-lift is its own category). The only no-license path is a Part 103 ultralight: one seat, under 254 lb empty, 5 gallons of fuel, 55 knots. A car can't qualify. ✅
9. **Your driveway:** I found no federal rule that bans landing on your own property outright. The FAA wants notice for new landing areas, and local zoning and state agencies have their own say. Saying "it's illegal" is ❌. Saying "you'd need more than the FAA's permission" is 🟡.
10. **The Tesla Roadster (news hook, 2026-10-15):** the car jumped and flipped using fan suction and cold-gas thrusters at a SpaceX test site in Texas. It "briefly" launched into the air (NBC). That was not sustained flight. Production is "2028" per Musk. ✅ as news context only.

---

## Draft lines: corrected numbers

| # | Draft says | Evidence says | Status | Suggested wording |
|---|---|---|---|---|
| 1 | Four corner fans, "about two tons" | Fine for "your car": the average new US vehicle weighs about 4,354 lb (MY2024, Jalopnik citing EPA, 🟡). Real flying-car prototypes are lighter: AirCar prototype 1,000 kg (2,205 lb), Terrafugia Transition 1,800 lb, Pivotal Helix about 158 kg (348 lb) empty | ✅ for "a car weighs about two tons" (🟡 until the EPA figure is opened); 🎭 for the four-fan car | "Your car weighs about two tons." Use 4,000 lb in the math. Don't imply a real prototype is two tons |
| 2 | Air down at "close to 100 mph" | 🧮 70–90 mph at the fans (5-ft or 4-ft fans, 4,000 lb). Ideal theory says the jet doubles below the fan, to about 140–175 mph. A 2026 paper (snippet) says simple theory under-predicts eVTOL wakes by 2–4 times | 🧮 | "around 100 mph" works and is conservative. Avoid "exactly" |
| 3 | Downwash blows trash cans across the lawn | No source for trash cans (🎭). FAA measured eVTOL outwash at almost 100 mph at 41 ft and more than 60 mph at 100 ft. The FAA research says to keep people out where outwash exceeds 34.5 mph | 🎭 + ✅ | Trash cans as illustration. True line: "Test aircraft have blown nearly 100-mile-an-hour gusts 40 feet away." Strong, hedgeable comparison: Category 1 hurricane winds start at 74 mph (NHC). Compare as "gusts as strong as a hurricane's winds", not as sustained winds |
| 4 | Noise "more like a helicopter than a car" | ❌ as a measured claim. No published noise data exists for a car-sized vehicle hovering on small fans. Big-rotor air taxis in cruise are quiet (Joby: 45.2 dBA at 1,640 ft, processed). Research says higher disk loading and smaller, faster rotors are louder (🟡). Pivotal: about 70 dB(A) from 100–150 ft for a 1-seat ultralight (company-attributed, NASA test) | ❌ / 🟡 | Drop the helicopter comparison, or hedge it: "Small fans spinning that hard are loud." If a number is wanted: "even a one-seat ultralight measures about as loud as a vacuum cleaner from 100 feet". The vacuum comparison is not sourced, so either find a source or don't use it |
| 5 | Hover power "about a 700-hp engine at full throttle" | 🧮 4,000 lb on four 4-ft fans: about 940 hp ideal, about 1,350 hp at figure of merit 0.7 (about 1,570 hp at 0.6). With 5-ft fans: about 750 hp ideal, about 1,080 hp real | 🧮 | "more than a thousand horsepower, just to hang in the air" |
| 6 | Battery lasts "about ten minutes" hovering | 🧮 85 kWh: about 4.6 min. 131 kWh: about 7.1 min. With bigger 5-ft fans: 5.7–8.8 min. With all fan and motor losses, usable charge and reserves included, it's shorter | 🧮 | "a battery that drives you all day would hover you for about five minutes" |
| 7 | Wings help; some fold | ✅ AirCar, Switchblade, ASKA A5 and Terrafugia all fold or deploy wings. 🧮 Wing-borne flight takes about 1/5 of the hover power (Cessna comparison) | ✅ / 🧮 | "Wings hold you up for about a fifth of the power, but they need a runway." The runway part is ✅ for AirCar, Switchblade, PAL-V and Transition, not for Alef |
| 8 | FAA: certificate, licence, where you can land | Pilot certificate required (61.3). Category ratings include "Powered-lift" (61.5). Ultralight exception: single occupant, under 254 lb empty, 5 gal, 55 kt (103.1, 103.7). The 2024 powered-lift rule and SFAR (Part 194) apply. VFR reserve for powered-lift: rotorcraft 20 min if it can land vertically along the whole route, otherwise airplane 30 min day / 45 min night (194.302 + 91.151). Driveway: no federal ban found. FAA notice for landing areas (snippet) plus local zoning | ✅ / 🟡 | "You'd need a pilot's license, and your town gets a say in whether your driveway is a landing pad." Don't say "it's illegal" |
| 9 | Lots of concepts, some flown | See A1–A9 | ✅ | See A1 for the strongest accurate phrasing |
| 10 | Tesla Roadster | Shown 2026-10-15: fan "suction" plus cold-gas thrusters, ramp loop, jumps over cars, "briefly" airborne. Musk: production 2028. No independent verification | ✅ as news | Never explain how it works. If mentioned at all: "Tesla's new Roadster can jump. Staying up is the hard part." Naming Tesla in the voice is the main session's call (the story isn't about its product) |

---

## P. Physics working (our calculations, 🧮)

**Inputs and assumptions (stated once):**

- Air density at sea level, standard day: ρ = 1.225 kg/m³ (0.002377 slug/ft³). [Check with NASA Glenn's model, tool: "p = 2116 * [(T + 459.7)/ 518.6]^5.256" and "r = p / [1718 * (T + 459.7)]". At T = 59 °F: r = 2116 / (1718 × 518.7) ≈ 0.002375 slug/ft³ ≈ 1.224 kg/m³.] Source: [Earth Atmosphere Model, English units](https://www.grc.nasa.gov/www/k-12/airplane/atmos.html), NASA Glenn, undated (accessed 2026-10-27).
- g = 9.81 m/s². 1 hp = 745.7 W. 1 m/s = 2.237 mph.
- Fan size: **assumption**. Four open fans that fit within a car's footprint (about 6 ft × 16 ft). Case 1: 4-ft (1.22 m) diameter each, total disk area 4.67 m² (50.3 ft²). Case 2: 5-ft (1.52 m), total 7.30 m² (78.5 ft²). Ducts and overlap are ignored.
- Figure of merit (FM), the hover efficiency compared with ideal: 0.6–0.7. Source: Bauersfeld & Scaramuzza (P1), tool: "Typical propellers achieve a figure of merit between 0.5 [38] and 0.7 [39]." The NASA (Silva & Johnson) definition, snippet: FM is the "ratio of ideal induced power to actual power in hover".
- Motor + inverter efficiency 0.9: **assumption, not sourced**. Used only for battery time.

### P1. The formulas (momentum theory)

- **Source:** [Range, Endurance, and Optimal Speed Estimates for Multicopters (HTML v3)](https://arxiv.org/html/2109.04741v3), Leonard Bauersfeld & Davide Scaramuzza, arXiv, 2021-09-10, rev. 2024-04-24 (accessed 2026-10-27)
- **Quote (tool):** Eq. 4: "v_{i,h} = √(T_h / (2ρA_prop))". Eq. 5 gives hover power as thrust × induced velocity divided by the figure of merit: "P_h = N_r T_h v_{i,h} / η_P".
- **Source:** [Blade Element Theory for Rotor in Hover and Climb (lecture notes)](https://sankar.gatech.edu/AE6070/Blade.Element.Theory.doc), L. Sankar, Georgia Tech AE6070, undated (accessed 2026-10-27)
- **Quote (tool):** "Induced velocity far downstream in the rotor wake, called downwash, is twice that at the rotor disk, called inflow."
- **Note on the brief's formula:** The brief wrote ideal power as "T·v/2". That's right only if v is the *far-wake* speed (2·v_i). Using the speed at the fan, ideal power = T·v_i. Same number.

### P2. Induced velocity (air speed through the fans)

| Case | Weight | Thrust T | Disk area A | v_i = √(T/2ρA) | Far wake 2·v_i |
|---|---|---|---|---|---|
| Car, 4-ft fans | 4,000 lb (1,814 kg) | 17,795 N | 4.67 m² | **39.4 m/s = 88 mph** | 79 m/s = 176 mph |
| Car, 5-ft fans | 4,000 lb | 17,795 N | 7.30 m² | **31.6 m/s = 71 mph** | 63 m/s = 141 mph |
| Light flying car, 4-ft fans | 2,205 lb (1,000 kg, AirCar prototype mass) | 9,810 N | 4.67 m² | 29.3 m/s = 65 mph | 131 mph |
| R44 helicopter (check) | 2,400 lb (1,089 kg) | 10,679 N | 79.5 m² (33-ft rotor) | 7.4 m/s = 17 mph | 33 mph |

Working (car, 4-ft fans): 2ρA = 2 × 1.225 × 4.670 = 11.44; T/(2ρA) = 17,795 / 11.44 = 1,555; √1,555 = 39.4 m/s.

### P3. Hover power

| Case | Ideal P = T·v_i | Real, FM 0.7 | Real, FM 0.6 |
|---|---|---|---|
| Car, 4-ft fans | 702 kW = **941 hp** | 1,003 kW = **1,345 hp** | 1,170 kW = 1,569 hp |
| Car, 5-ft fans | 561 kW = 753 hp | 802 kW = 1,076 hp | 936 kW = 1,255 hp |
| Light flying car (1,000 kg), 4-ft fans | 287 kW = 385 hp | 410 kW = 550 hp | 479 kW = 642 hp |
| R44 (check) | 79 kW = 106 hp | 151 hp | 177 hp |
| 2,400 lb on four 4-ft fans | 326 kW = 437 hp | **625 hp** | 729 hp |

- **Sanity check against a real aircraft:** the R44 comes out at about 150–180 hp for its main rotor. Robinson rates the engine "Derated to 225 hp for takeoff and 205 hp continuous", which also has to cover the tail rotor and transmission. That's consistent, so the method is in the right range.
- **The same weight on small fans:** 2,400 lb on four 4-ft fans takes about 625 hp against the R44's 205 hp continuous. That's **about 3 times** the power. ✅ inputs, 🧮 result.
- **Scaling:** power grows with weight^1.5. Double the weight and you need about 2.8 times the power.
- **Disk loading:** car 4,000 lb / 50.3 ft² = **79.6 lb/ft²**. R44 2,400 lb / 855 ft² = **2.8 lb/ft²**. That's **about 28 times**.
- **For comparison only (not in the voice):** the most powerful mass-market EV figure I found is Tesla's Model S Plaid at "a total output of 1,020 horsepower" ([KBB, Sean Tucker, 2021-06-11](https://www.kbb.com/car-news/tesla-model-s-plaid-arrives-with-1020-horsepower-390-mile-range), tool). So the hover power for a 4,000 lb car is at or above the very top of what road EVs make, and it has to be held, not used in a 2-second burst. I didn't source how long an EV pack can sustain peak power. Don't claim it.

### P4. Battery time in hover

Electrical power = shaft power / 0.9 (assumption).

| Case | Electrical power | 85 kWh pack | 131 kWh pack |
|---|---|---|---|
| Car, 4-ft fans, FM 0.7 | 1,114 kW | **4.6 min** | 7.1 min |
| Car, 4-ft fans, FM 0.6 | 1,300 kW | 3.9 min | 6.0 min |
| Car, 5-ft fans, FM 0.7 | 891 kW | 5.7 min | 8.8 min |

- **Pack sizes (🟡, secondary sources):** Chevrolet Equinox EV, 85 kWh usable (spec sites and Ars Technica, snippet; chevrolet.com returned 403). Ford F-150 Lightning Extended Range, 131 kWh usable: "net (usable) battery capacity of 98 kWh in the Standard Range Battery and 131 kWh in the Extended Range Battery" ([InsideEVs](https://insideevs.com/news/555338/ford-f150-lightning-battery-capacity/), snippet, not opened). Re-open one OEM source before ✅. The spoken line can stay unspecific: "a battery that drives you all day".
- **Real-world check:** the Pivotal Helix (one seat, about 158 kg empty) carries a "9-kilowatt-hour battery" and can "cruise up to 32 kilometers (20 miles)". Pilots land "with at least 20 percent charge remaining" ([IEEE Spectrum, Lawrence Ulrich, 2025-09-11](https://spectrum.ieee.org/pivotal-helix), tool).
- **Reserves make it worse:** US rules require 20–45 minutes of reserve flying (G4). A pack that hovers for 5 minutes can't legally plan a hover-only trip. Note: the reserve is counted "at normal cruising speed", which for a winged design is wing-borne, so this is a fair point for a wingless four-fan car but not for every design.

### P5. Wings against hover

- **Source:** [Cessna 172 Skyhawk fact sheet](https://www.aopa.org/go-fly/aircraft-and-ownership/aircraft-fact-sheets/cessna-172), AOPA, undated (accessed 2026-10-27)
- **Quote (tool):** "Lycoming IO-360-L2A, 180 hp" / "2,558 lb" (maximum gross weight) / "124 kt/4.26 hr (9.9 gph)" "@ 75% power, best economy"
- **🧮:** cruise ≈ 0.75 × 180 = **135 hp** for 2,558 lb. Hovering 2,558 lb (11,383 N) on four 4-ft fans: v_i = √(11,383 / 11.44) = 31.5 m/s. P_ideal = 359 kW = 481 hp, and FM 0.7 gives **about 690 hp**. That's **about 5 times** the cruise power.
- **Note:** This compares a light plane with a fan car, not the same vehicle. "About a fifth of the power" is a fair rounded claim, with the inputs sourced.

### P6. Hedge on the physics

- **Status:** 🟡. Momentum theory is the textbook first estimate, and real numbers are worse (FM < 1). A 2026 peer-reviewed paper analysing the FAA DWOW data (Ison, *Collegiate Aviation Review*, snippet only) says momentum theory "consistently underestimated eVTOL wake velocities by factors of 2 to 4". That supports "around 100 mph" being conservative. Not opened.

---

## A. "There are a lot of flying-car concepts, and some have flown"

**Strongest accurate phrasing (recommended):** "Engineers have drawn more than a thousand designs for aircraft that take off straight up, and a handful of real road-going flying cars have actually flown. Most of those need a runway." Alternative with history: "Flying cars have been flying since 1949. One was even certified in 1956. None has made it into your driveway."

Don't say "a thousand flying cars": the VFS count is electric VTOL designs, mostly air taxis.

### A1. More than 1,100 electric VTOL designs tracked

- **Status:** ✅ (tool) for the count. 🟡 if worded as "flying cars".
- **Source:** [Press Release: VFS Electric VTOL Directory Hits 1,100 Designs](https://vtol.org/news/press-release-vfs-electric-vtol-directory-hits-1-100-designs), Vertical Flight Society, 2025-03-18 (accessed 2026-10-27)
- **Quote (tool):** "Hits 1,100 Designs" … from "more than 450 designers" … "many defunct designs preserved for the record."
- **Note:** It counts concepts, including defunct ones, and doesn't say how many have flown or how many are roadable. I found no 2026 update. Earlier milestones (snippet): 1,000 in April 2024, 600 in January 2022.

### A2. Taylor Aerocar: flew 1949, certified 1956

- **Status:** ✅ (tool).
- **Source:** [Taylor, Molt (1912-1995) / Aerocar essay 20930](https://historylink.org/File/20930), Rita Cipalla, HistoryLink.org, 2019-12-03 (accessed 2026-10-27)
- **Quote (tool):** "makes its first public flight in Longview on December 8, 1949." / "is certified as airworthy by the Civil Aeronautics Administration in 1956." / "its wings and tail are removed and stowed in a trailer-like compartment." / "Taylor was never able to find an aircraft company or automobile manufacturer to mass produce the Aerocar."
- **Note:** Great myth-buster: flying cars are not new. "Anywhere from five to seven Aerocars were produced" (tool).

### A3. Klein Vision AirCar (Slovakia): flew between two cities in 2021, certificate of airworthiness in 2022

- **Status:** ✅ (tool), secondary outlets. Dezeen and The Engineer returned 403.
- **Source:** [Civil Aviation Authority Issues AirCar Certificate of Airworthiness](https://stateaviationjournal.com/index.php/international-news/civil-aviation-authority-issues-aircar-certificate-of-airworthiness), State Aviation Journal, 2022-01-25 (accessed 2026-10-27)
- **Quote (tool):** "the official Certificate of Airworthiness by the Slovak Transport Authority" / "70 hours of rigorous flight testing" / "1000kg 2-seat dual-mode prototype" / "1.6L BMW engine"
- **Source:** [Flying car completes test flight between airports](https://www.tbsnews.net/world/flying-car-completes-test-flight-between-airports-269260?amp), TBS Report (reporting the BBC), 2021-07-02 (accessed 2026-10-27)
- **Quote (tool):** "a 35-minute flight" between "international airports in Nitra and Bratislava, Slovakia" / car to aircraft takes "two minutes and 15 seconds"
- **Note:** The flight date was 2021-06-28 per several outlets (snippet). STA director René Molnár (AFP via snippet): a "special certificate of airworthiness". Commercial production needs a type certificate. It needs a **runway** (fixed wing, propeller). It's not a US approval.

### A4. Samson Switchblade: first flight in November 2023

- **Status:** ✅ (tool).
- **Source:** ['Huge milestone': Switchblade, a flying sports car, successfully completes first test flight](https://www.wbng.com/2023/12/02/huge-milestone-switchblade-flying-sports-car-successfully-completes-first-test-flight), Jordan Gartner, Gray News (WBNG), 2023-12-02 (accessed 2026-10-27)
- **Quote (tool):** "the flight took off from the Grant County Airport in Washington state" / "flew to an altitude of 500 feet" / "remained airborne for nearly six minutes" / "Its wings and tail fold in, protecting them while in driving mode." / "over 2,300 reservations"
- **Note:** It takes off from an **airport**. Road classification as a three-wheel motorcycle/autocycle comes from a Samson presentation to New Mexico legislators and a trade caption (snippet, 🟡). Driving needs a car or motorcycle licence; flying needs a pilot certificate (press, snippet).

### A5. Alef: FAA Special Airworthiness Certificate (2023, limited), vertical-takeoff video (February 2025)

- **Status:** ✅ (tool).
- **Source:** [Alef Becomes the First Car Certified to Fly (press release)](https://www.airframer.com/news/release/alef-becomes-the-first-car-certified-to-fly), Alef via Airframer, 2023-06-27 (accessed 2026-10-27)
- **Quote (tool):** "Alef's Special Airworthiness Certificate therefore limits the locations and purpose for which Alef is permitted to fly." / "Alef's flying car is 100% electric, drivable on public roads and has vertical takeoff and landing capabilities."
- **Source:** [A flying car prototype just got an airworthiness certificate from the FAA](https://abc30.com/amp/post/flying-car-alef-automotive-model-a-federal-aviation-administration/13458438/), Chris Isidore (CNN Wire via ABC30), 2023-07-03 (accessed 2026-10-27)
- **Quote (tool):** certificate "allowing for limited purposes that include exhibition, research and development" / FAA: "not the first aircraft of its kind"
- **Source:** [alef aeronautics' drivable flying car takes flight for the first time](https://www.designboom.com/technology/alef-aeronautics-drivable-flying-car-takes-flight-first-time-02-20-2025/), Matthew Burgos, designboom, 2025-02-20 (accessed 2026-10-27)
- **Quote (tool):** the video is the "first publicly released video of a car driving and taking off vertically" / CEO Jim Dukhovny: "the first documented, verifiable flight of a flying car (an actual car, with vertical takeoff, non-tethered)."
- **Note:** The test vehicle is the ultralight **Model Zero**, not the Model A. The road was closed for the test. The certificate is dated 2023-06-12 (snippet, CBS via search) and names the aircraft "Armada Model Zero" (snippet). Claimed Model A specs, all Alef claims: "200-mile road range and 110-mile flying range", about $300,000, low-speed vehicle (about 25 mph on roads). Weight: 385 kg / 850 lb appears only on weak sites (❌ for the script). "First car certified to fly" is Alef's claim, and the FAA disputes "first". Don't repeat it.

### A6. PAL-V Liberty (Netherlands): road-approved gyroplane

- **Status:** ✅ (tool) for the description. 🟡 for the current certification status (not checked for 2026).
- **Source:** [EASA defines PAL-V Liberty roadable gyrocopter certification pathway](https://aopa.org/news-and-media/all-news/2021/february/25/easa-defines-pal-v-liberty-roadable-gyrocopter-certification-pathway), David Tulis, AOPA, 2021-02-25 (accessed 2026-10-27)
- **Quote (tool):** "a gyrocopter that transforms into a roadable three-wheeled vehicle" / "the first flying car to get road permission for Europe" (company) / "Takeoff roll is said to be 590 feet and landing roll is 100 feet." / "Useful load is 542 pounds."
- **Note:** It needs a strip of about 590 ft. MTOW 910 kg (2,002 lb) per search summary (snippet).

### A7. Terrafugia Transition (US): flew in 2009, FAA special LSA certificate in 2021, then US operations wound down

- **Status:** ✅ (tool).
- **Source:** [Terrafugia pulls US plug on Transition flying car](https://aopa.org/news-and-media/all-news/2021/february/16/terrafugia-pulls-us-plug-on-transition-flying-car), David Tulis, AOPA, 2021-02-16 (accessed 2026-10-27)
- **Quote (tool):** FAA "granted a special LSA airworthiness certificate for the twin-boom, pusher-prop design on January 26" / "was still awaiting federal approval to drive on public roadways" / "80 to 100 employees" "have been let go"
- **Note:** The 2009 first flight of the proof-of-concept is Wikipedia-only (snippet). NHTSA granted FMVSS exemptions in 2011 (tires, polycarbonate windows, airbags, stability control), per Wikipedia and PopSci (snippet, 🟡). A good "why it's hard" fact: car safety rules and aircraft weight limits pull in opposite directions. The 1,800-lb weight "reflects Department of Transportation automobile safety and environmental rules" (tool, AOPA).

### A8. ASKA A5 (US): FAA special airworthiness certificate, 2023

- **Status:** ✅ (tool).
- **Source:** [ASKA's A5 'flying car' prototype earns special airworthiness certification from FAA](https://www.militaryaerospace.com/commercial-aerospace/article/14296081/askas-a5-flying-car-prototype-earns-special-airworthiness-certification-from-faa), Military & Aerospace Electronics, 2023-07-10 (accessed 2026-10-27)
- **Quote (tool):** "was awarded certificate of authorization (COA) and special airworthiness certification by the FAA" / "Six independent motor systems for flight" / "ASKA is hybrid with batteries and a range extender engine that charges the batteries in-flight." / "open the wings, taxi towards a helipad or runway, then take off."
- **Note:** The article also says the certificate "signals that ASKA A5 has successfully met all FAA safety requirements". That's company language and overstates a special (experimental-type) certificate. Don't repeat it. No weight published (❌). I found no 2025–2026 status.

### A9. XPeng / Aridge "Land Aircraft Carrier" (China): a van that carries a detachable 2-seat aircraft

- **Status:** ✅ (tool) for status. 🟡 for the Dubai flight (snippet).
- **Source:** [Xpeng flying car unit gets certification boost as China unveils eVTOL compliance list](https://cnevpost.com/2026/07/22/xpeng-aridge-certification-boost-evtol-compliance-list/), Phate Zhang, CnEVPost, 2026-07-22 (accessed 2026-10-27)
- **Quote (tool):** "Aridge is currently advancing the airworthiness certification of its modular Land Aircraft Carrier flying car." / "had received 7,000 pre-orders" / "less than 2 million yuan ($294,410)"
- **Note:** A public crewed flight over Dubai took place in October 2025 under a UAE special flight permit (Al Arabiya 2025-10-13 returned 403; Bloomberg via GDN, snippet). The type certificate is still pending, and per search summaries deliveries have slipped to 2027 (snippet). The aircraft and car are separate machines, so it's arguably not "a flying car".

### A10. Pivotal BlackFly / Helix (US): sold today, no licence needed, but not a car

- **Status:** ✅ (tool).
- **Source:** IEEE Spectrum, 2025-09-11 (see P4).
- **Quote (tool):** "weighing just under 158 kilograms" / it "conforms with the FAA's rules for ultralight aircraft" / "cruise up to 32 kilometers (20 miles) at a software-limited 103-kilometer-per-hour (64 mile-per-hour) top speed"
- **Note:** 158 kg ≈ 348 lb, above Part 103's 254-lb empty limit (G2). The difference may come from Part 103's exclusion of "safety devices" or from an FAA exemption. I didn't resolve it. Don't put the weight next to the 254-lb rule in the script. One seat, daylight, no congested areas, no road use.

### A11. Air taxis are not cars

- **Status:** 🟡. Joby and Archer (piloted air taxis) and Beta are working through FAA type certification. As of late October 2026, search summaries conflict on whether any eVTOL holds a full FAA type certificate (one report claims Joby on 2026-06-18, and later reports contradict it). ❌ for any script line about "the first certified eVTOL". Not needed.

---

## B. Tesla Roadster (news context only; never explain how it works)

### B1. The October 15, 2026 demo

- **Status:** ✅ (tool) for what reporters saw and what Musk said.
- **Source:** [Elon Musk shows off 'flying' Tesla Roadster after years of delays](https://www.nbcnews.com/tech/tech-news/elon-musk-shows-flying-tesla-roadster-years-delays-rcna603905), Chris Perez, NBC News, 2026-10-16 (accessed 2026-10-27)
- **Quote (tool):** it can "briefly launch itself into the air" / landed "in a cloud of condensation" / Musk: "Well, it worked!" / "it's not necessarily a safety-optimized car." (Tesla: a second run "jumped 27 feet".)
- **Source:** [Tesla reveals SpaceX-powered Roadster that flies and falls with style](https://techcrunch.com/2026/10/15/tesla-reveals-spacex-powered-roadster-that-flies-and-falls-with-style/), Sean O'Kane, TechCrunch, 2026-10-15 (accessed 2026-10-27)
- **Quote (tool):** "a mixture of high-powered fans and thrusters to drive up an inverted ramp, spin around, and ease itself to a landing on the pavement below." Musk: "This will be the actual car that's on the roads," and Tesla will build it in 2028.
- **Source:** ['Well, it worked': Elon Musk unveils new Tesla Roadster that can fly](https://www.euronews.com/2026/10/16/well-it-worked-elon-musk-unveils-new-tesla-roadster-that-can-fly), Nathan Rennolds, Euronews, 2026-10-16 (accessed 2026-10-27)
- **Quote (tool):** Lars Moravy (Tesla): a "fan suction system" can "pull up to 2 Gs in order to make the car go upside down." Musk: "altitude control thrusters and main thrusters in the rear, so it can basically fly like a rocket."
- **Note:** NBC says the thrusters are cold-gas. No outlet reports hover time or height beyond the 27-ft jump. NBC: the Rocket trim "is not approved for public roads". CNN returned 451. Reports conflict on whether anyone was inside. Safe framing: **it jumps and lands on thrusters; it doesn't hover or cruise.** That makes a perfect contrast with the physics: a short burst of stored gas is not hours of lift.

### B2. The build-up: 2018 thruster tweets and the 2025 Rogan tease

- **Status:** ✅ (tool).
- **Source:** [Musk Says SpaceX Package for Tesla Roadster Will Include Rocket Thrusters](https://fortune.com/2018/06/10/musk-tesla-roadster-spacex-rocket-thrusters), David Z. Morris, Fortune, 2018-06-10 (accessed 2026-10-27)
- **Quote (tool):** "SpaceX option package for new Tesla Roadster will include ~10 small rocket thrusters arranged seamlessly around car." / "Note, gas contained would be ultra high pressure air in a SpaceX rocket COPV bottle."
- **Source:** [Elon Musk Teases Tesla Flying Car (title per URL)](https://gizmodo.com/elon-musk-tesla-flying-car-2000680264), Matt Novak, Gizmodo, 2025-10-31 (accessed 2026-10-27)
- **Quote (tool, Gizmodo's transcription of the Joe Rogan podcast):** "One thing I can guarantee is that this product demo will be unforgettable." / "the future was supposed to have flying cars, but we don't have flying cars," / "can't do the unveil before the unveil"
- **Note:** The Roadster was first unveiled in 2017 with production promised for 2020 (NBC, tool). The 2018 follow-up, "*will* definitely enable it to fly short hops, but maybe..." (snippet), was not opened.

---

## C. Downwash and outwash

### C1. FAA field survey: almost 100 mph at 41 ft, over 60 mph at 100 ft

- **Status:** ✅ (tool), via trade press summarising the FAA report. The report PDF couldn't be parsed here.
- **Source (report record):** [Electric Vertical Takeoff and Landing (eVTOL) Downwash and Outwash Surveys, DOT/FAA/TC-24/42](https://rosap.ntl.bts.gov/view/dot/79065), Muia, Stanley, Anderson et al., FAA William J. Hughes Technical Center, 2024-12-01 (accessed 2026-10-27)
- **Quote (tool, abstract):** DWOW "can pose significant risks to people and property." / "current research on the effects and mitigation of DWOW is limited."
- **Source (figures):** [FAA research recommends extended 'downwash caution area' for urban vertiports](https://www.urbanairmobilitynews.com/uam-infrastructure/faa-research-recommends-extended-downwash-caution-area-for-urban-vertiports), Philip Butterworth-Hayes, Urban Air Mobility News, 2025-01-07 (accessed 2026-10-27)
- **Quote (tool):** "The highest instantaneous maximum measured was almost 100 mph at 41 ft from the TLOF (touch down and lift off) center." / "The highest moving 3-second 95th percentile was 84 mph at 23 ft from the TLOF center." / "Speeds of more than 60 mph were measured at 100 ft from the TLOF center." / "The DCA should be operational when and wherever DWOW velocities exceed 34.5 mph."
- **Note:** The aircraft were "under 6,500 lbs" (snippet of the report's key findings). These eVTOLs have much bigger rotors than a car's corner fans, so a fan car would likely blow harder (P2, P6). The trade claims of "hurricane-force" and "two to three times helicopter outwash" are blog-level (lowaltitudeeconomy.aero, 2026-03-16). Use them only as leads. **Fact-checker:** if possible, open the PDF (rosap link + /dot_79065_DS1.pdf) and confirm the three numbers.

### C2. Hurricane comparison

- **Status:** ✅ for the scale. 🟡 for the comparison (gust vs sustained).
- **Source:** [Saffir-Simpson Hurricane Wind Scale](https://www.nhc.noaa.gov/aboutsshws.php), NOAA National Hurricane Center, undated (accessed 2026-10-27)
- **Quote (tool):** Category 1: "74-95 mph" / Category 2: "96-110 mph"
- **Note:** The scale uses sustained winds, while the FAA figures are gusts or 3-second values. Say "gusts as strong as hurricane winds", not "a hurricane in your yard".

---

## D. Noise

### D1. Big-rotor air taxi in cruise: quiet

- **Status:** ✅ attributed (Joby, NASA data). Not a car-sized vehicle.
- **Source:** [Joby says results from NASA acoustic testing is a 'game changer' for its eVTOL](https://verticalmag.com/news/joby-nasa-acoustic-testing-game-changer-evtol/), Vertical Magazine, 2022-05 (snippet, not opened; other outlets agree)
- **Quote (snippet):** flyover at 100 knots, 500 m (1,640 ft): "45.2 dBA" (derived by processing for spreading and attenuation). Takeoff and landing: below 65 dBA at 100 m (330 ft).
- **Note:** Re-open before ✅. This shows how good big, slow rotors can be, which is exactly what a car-sized fan design can't have.

### D2. Small personal eVTOL: about 70 dBA at 100–150 ft (company-attributed)

- **Status:** 🟡 (company claim of NASA test).
- **Source:** [NASA Acoustic Study](https://www.pivotal.aero/newsroom/perspectives/nasa-acoustic-study), Soummya Datta, Pivotal, undated (© 2026) (accessed 2026-10-27)
- **Quote (tool):** "The research shows the Pivotal BlackFly produces 70 dBA flyover noise at 100 feet."
- **Note:** IEEE Spectrum (tool): Helix "about 70 decibels of sound to the ground from a 150-foot flight altitude" (CEO, attributed to NASA testing; the article was corrected once on noise). Pivotal: hover is louder than cruise ("significantly lower" in cruise), with no hover number.

### D3. Helicopters: louder

- **Status:** ✅ (tool), but these are different helicopters and conditions.
- **Source:** [Helicopter results](https://www.fs.usda.gov/t-d/programs/im/sound_measure/helo_results.shtml), USDA Forest Service, undated (accessed 2026-10-27)
- **Quote (tool):** "the Kaman Kmax with no load is listed as having a noise level of 82.5 dBA" "for a flyover at 492 feet (150 meters)" / "roughly equivalent to 92 dBA at 165 feet"
- **Source:** [Helicopter noise in Los Angeles](https://pbssocal.org/updaily/socal_focus/health/helicopter-noise-los-angeles-lapd-34715.html), Eddie North-Hager, PBS SoCal, 2011-06-28 (accessed 2026-10-27)
- **Quote (tool):** LAPD AStar "produces about 87 decibels at 500 feet."

### D4. Why small fans are louder

- **Status:** 🟡 (snippets of acoustic research).
- **Leads:** Fulton & Gandhi, VFS Forum 82 (2026), minimum A-weighted noise "primarily governed by broadband noise sensitivity to disk loading and solidity" ([VFS proceedings](https://proceedings.vtol.org/82/proceedingsPaper?paper=204), snippet). Smith, Gandhi & Niemiec (RPI/Penn State): "smaller faster spinning rotors … produce more tonal peaks at higher frequencies which results in penalties in A-weighted noise" (snippet).
- **Note:** That supports "small fans working this hard are loud". It does **not** support a dB number for a fan car, or "louder than a helicopter". **Draft line 4 as written: ❌.**

---

## G. US rules

### G1. You need a pilot certificate, and powered-lift is its own category

- **Status:** ✅ (tool).
- **Source:** [14 CFR § 61.3](https://www.law.cornell.edu/cfr/text/14/61.3) and [§ 61.5](https://www.law.cornell.edu/cfr/text/14/61.5), Cornell LII (eCFR), current (accessed 2026-10-27)
- **Quote (tool):** 61.3(a): "No person may serve as a required pilot flight crewmember of a civil aircraft of the United States, unless that person:" (a)(1) "Has in the person's physical possession or readily accessible in the aircraft..." [a pilot certificate]. 61.5(b)(1): "(i) Airplane." … "(v) Powered-lift."
- **Note:** Which rating depends on the design. Winged roadables like the AirCar, Switchblade and Transition fly as airplanes. A Transition-type LSA can be flown on a sport pilot certificate (my inference, not sourced). Vertical-lift designs will likely be powered-lift.

### G2. The only no-licence path is a 254-lb one-seater

- **Status:** ✅ (tool).
- **Source:** [14 CFR § 103.1](https://www.law.cornell.edu/cfr/text/14/103.1), [§ 103.7](https://www.law.cornell.edu/cfr/text/14/103.7), Cornell LII (accessed 2026-10-27)
- **Quote (tool):** "manned operation in the air by a single occupant;" / "Weighs less than 254 pounds empty weight, excluding floats and safety devices" / "Has a fuel capacity not exceeding 5 U.S. gallons;" / "Is not capable of more than 55 knots calibrated airspeed at full power in level flight" / 103.7(b): operators "are not required to meet any aeronautical knowledge, age, or experience requirements to operate those vehicles" "or to have airman or medical certificates."

### G3. The 2024 powered-lift rule

- **Status:** ✅ (tool, Federal Register metadata via search). The FAA newsroom returned 403.
- **Source:** [Integration of Powered-Lift: Pilot Certification and Operations; Miscellaneous Amendments Related to Rotorcraft and Airplanes, 89 FR 92296](https://govinfo.gov/content/pkg/FR-2024-11-21/pdf/2024-24886.pdf), FAA, Federal Register, 2024-11-21 (snippet, PDF not parsed)
- **Quote (tool, 14 CFR 194.301):** "persons operating powered-lift must continue to comply with rules applicable" "to all aircraft in parts 91, 135, and 136 of this chapter" ([Cornell LII](https://www.law.cornell.edu/cfr/text/14/194.301))
- **Note:** Permanent amendments plus a ten-year SFAR (Part 194). The FAA released it in October 2024 and published it on 2024-11-21. It covers pilot certification and operating rules, not your driveway.

### G4. Low flying and fuel reserves for powered-lift

- **Status:** ✅ (tool).
- **Source:** [14 CFR § 194.302 table](https://www.law.cornell.edu/cfr/text/14/194.302), [§ 91.119](https://www.law.cornell.edu/cfr/text/14/91.119), [§ 91.151](https://www.law.cornell.edu/cfr/text/14/91.151), Cornell LII (accessed 2026-10-27)
- **Quote (tool):** 194.302: "Under § 91.119(d) of this chapter, a powered-lift may be operated in vertical-lift flight mode at less than the minimums" [if without hazard and on FAA-prescribed routes/altitudes]. A powered-lift able to land vertically along the route "may use the VFR fuel requirements outlined in § 91.151(b)". 91.151(b): rotorcraft must be able to fly "after that for at least 20 minutes." 91.151(a): airplanes "at least 30 minutes" by day, "at least 45 minutes" at night. 91.119 lead-in: the minimums apply "Except when necessary for takeoff or landing".
- **Note:** Over congested areas the normal minimum is 1,000 ft above the highest obstacle within 2,000 ft (91.119(b), tool paraphrase).

### G5. Taking off from your driveway

- **Status:** 🟡. I found no federal rule that says you may never land on your own property. ❌ for "it's illegal".
- **Source (snippets, FAA pages 403):** [FAA FAQ: What procedures must I follow to build a private-use facility?](https://www.faa.gov/faq/what-procedures-must-i-follow-build-private-use-facility): private-use facilities must comply with 14 CFR Part 157 (notice), and filing with the FAA doesn't replace the duty to notify the state aviation agency and "comply with any local law, ordinance, or state and federal regulations" (snippet). FAA heliport determination letters "in no way preempt or waive any ordinances, laws, or regulations of any government body" (snippet, city document).
- **Note:** Script-safe line: "You'd need a pilot's license, and your town gets a say on whether your driveway can be a landing pad." The FAA's own downwash research (C1) is the physical reason a driveway is a bad pad: the caution zone (over 34.5 mph) reaches well past 100 ft for current eVTOLs, so it would cover the neighbours. That is 🧮/inference: the FAA didn't study driveways.

### G6. On the road: car safety rules

- **Status:** 🟡 (snippets). Terrafugia needed NHTSA exemptions from FMVSS 110, 126, 205 and 208 (petition 2010, granted 2011, per Wikipedia and PopSci). The Switchblade is registered as a three-wheel motorcycle/autocycle, per Samson's presentation to New Mexico legislators. Alef planned "low-speed vehicle" status (CNN, tool, A5).
- **Note:** A good one-liner if needed: "To fly, it has to be light. To drive, it has to pass crash rules. Those pull in opposite directions." That's an inference from A7 ("1,800-pound weight" reflects auto rules), 🟡.

---

## H. Myths (for hooks or comment replies)

1. **"Flying cars don't exist."** False. The Aerocar was certified in 1956 (A2), the AirCar got a Slovak certificate in 2022 (A3), and the Switchblade flew in 2023 (A4). The truer line is that they exist but none is practical from your driveway.
2. **"Tesla's Roadster flies."** It jumped and landed using fans and cold-gas thrusters. NBC: "briefly launch itself into the air" (B1). No hover or cruise was shown.
3. **"Better batteries will fix it."** Only partly. Hover power is set by weight and fan area (P3). Batteries add minutes, but the noise and downwash come from the same small-fan physics (C1, D4).
4. **"eVTOLs are whisper-quiet."** That's true for big-rotor air taxis in cruise at altitude (45.2 dBA at 1,640 ft, D1). Hover near the ground is louder, and small fans are louder still (D2, D4).
5. **"A flying car would let you skip traffic straight from home."** Most flying cars that have actually flown need a runway (A3, A4, A6, A7). You'd need a pilot certificate (G1), and local rules apply (G5).

---

## Angles and hooks (suggested)

**Recommended: Angle 1, "The driveway problem"** (owner's angle). Hook: "Flying your car to work sounds easy until you try to leave the driveway." Beats: fans scream (air at about 100 mph, P2) → yard gets blasted (C1) → the power meter pegs past 1,000 hp (P3) → battery is good for about five minutes (P4) → wings fix it but need a runway (P5, A3–A4) → the law wants a licence and your town gets a say (G1, G5) → there are more than a thousand designs and some fly (A1–A5) → open question: tiny fans, a giant battery, or a runway, which would you give up?

**Angle 2, "The fan size problem."** Hook: "A helicopter holds itself up with a 33-foot rotor. A flying car has to do it with fans that fit inside a parking space." Payoff: 28× the disk loading, 3× the power, much faster air, more noise (P3, C1, D4).

**Angle 3, "Jumping isn't flying"** (news-led, company named; main session decides). Hook: "A car just left the ground on a rocket thruster. Keeping it up there is the part nobody has solved." Risk: it leans on Tesla, and we can't explain its system.

---

## Most visual true details for a cut-open slice

1. **The air column.** Under each fan the air speeds up and the column narrows to about half the fan's area, with the far wake moving twice as fast as the air at the fan (P1, Georgia Tech). Orange arrows that lengthen as they fall.
2. **Disk size overlay.** A 33-ft helicopter rotor disk drawn over the car, against four 4-ft fans. Same job, about 1/17 the area, 28× the disk loading (P3).
3. **The outwash ring on the lawn.** A ring where the wind tops 34.5 mph (the FAA caution threshold), with 60 mph still showing at 100 ft for real test aircraft. It reaches the neighbours (C1).
4. **The battery gauge.** An 85 kWh pack draining in about 4–5 minutes at about 1.1 MW, next to the same pack lasting all day on the road (P4).
5. Optional: wings unfolding from the body (the AirCar transforms in 2 min 15 s, A3) with a runway appearing under it.

---

## Hedges the script must use

| Claim | Say | Don't say | Why |
|---|---|---|---|
| Downwash speed | "around 100 mph" | "exactly 100 mph", "hurricane in your yard" | 🧮 range 70–90 mph at the fan, faster below. FAA gusts are not sustained winds (C2) |
| Power | "more than a thousand horsepower" | "700 horsepower" | 🧮 1,080–1,570 hp real (P3) |
| Battery | "about five minutes" | "ten minutes" | 🧮 4–9 min (P4) |
| Noise | "small fans working that hard are loud" | "louder than a helicopter", any dB for a fan car | No measurement exists (D4) |
| Concepts | "more than a thousand designs for aircraft that take off straight up" | "a thousand flying cars" | The VFS count is eVTOLs, mostly air taxis (A1) |
| Flown | "a handful of road-going ones have flown; most need a runway" | "flying cars are certified in the US" | US approvals are special/experimental or LSA, not standard type certificates (A5, A7, A8) |
| Driveway | "your town gets a say" | "it's illegal" | No federal ban found (G5) |
| Licence | "you'd need a pilot's license" | "anyone can fly one" | Only a 254-lb one-seat ultralight is exempt (G2) |
| Tesla | "it jumps", "it briefly leaves the ground" | "it flies", "it hovers", or any how-it-works claim | B1 |
| Alef | "a prototype has taken off vertically on video" | "the first car certified to fly" | The FAA disputes "first" and the certificate is limited (A5) |

---

## Illustrative items for the post description (🎭, if used)

- The driver, the morning commute, the four-fan two-ton car, and the trash cans.
- The fan sizes (4 ft / 5 ft) behind the numbers. Suggested line: "Illustrative: the four-fan car and its fan sizes are made up. Power, airflow and battery figures are our momentum-theory estimates (sources and working in the description)."

---

## Open items for the fact-checker

1. Open the FAA DWOW report PDF (C1) and confirm the 100 mph / 41 ft, 84 mph / 23 ft, 60 mph / 100 ft, 34.5 mph and "under 6,500 lbs" figures.
2. Re-open Joby/NASA (D1) and an OEM battery spec (P4) before giving them ✅.
3. EPA Automotive Trends report: confirm the average new-vehicle weight for MY2024 (4,354 lb is via Jalopnik).
4. Pivotal Helix weight against the Part 103 254-lb limit (A10): unresolved.
5. Check the physics tables in P2–P4 by hand. All figures use ρ = 1.225 kg/m³, FM 0.6–0.7, and motor efficiency 0.9 (assumption).
