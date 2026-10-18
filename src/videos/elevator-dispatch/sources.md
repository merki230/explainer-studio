# Sources: elevator-dispatch (No. 003)

Researcher draft, 2026-10-17. The statuses are the researcher's **starting** confidence. The fact-checker sets the final ones.
Everything was accessed on 2026-10-17. Quotes are verbatim. When a sentence ran too long, it is quoted in pieces joined by "…".

**Access notes for the fact-checker:**

- (1) The research tool could not read PDFs (no text extraction, and `pdftoppm` is not installed for the Read tool). Every quote below comes from an HTML page. PDFs that look useful are listed as **leads**, not sources: the Aalto/Siikonen planning paper, the Mitsubishi ΣAI-2200C brochure, the KONE Polaris and Destination brochures, CIBSE Guide D excerpts, and the Washington L&I elevator safety leaflet.
- (2) elevatorworld.com, architectmagazine.com and nytimes.com returned 403 or blocked the tool. Anything that relies on them is marked as a lead, 🟡 or ❌.
- (3) The best independent sources are the Peters Research web editions of peer-reviewed congress papers (ELEVCON, published in the IAEE *Elevator Technology* books). Richard Peters is a lift-traffic consultant who builds simulation software, not a manufacturer. Patents (Otis, Inventio/Schindler, KONE) show a **claimed method**, not necessarily what a product does today. Say "one maker's design" if a patent detail is spoken.

Angle (owner-approved): you press the call button in a lobby with several elevators, and one particular car arrives, sometimes not the closest. Who decided, and how? A group controller knows every car's position, direction, stops and load, estimates how long each car would take (and what it would cost everyone else), and assigns the best one. Older systems used simpler rules. Optional twist: destination dispatch.

Owner-chosen hook: "When you press that button, a computer is already deciding which elevator gets you, and it's not always the closest one."

---

## Fact-check ruling on the revised `script.txt` (17 lines, owner-approved; fact-checker, 2026-10-17)

Current ruling. It supersedes the table for the first draft below, which is kept for its evidence. Line numbers here are the revised script's.

| Line | Claim as scripted | Status | Entry | Ruling |
| --- | --- | --- | --- | --- |
| 1 | "a computer's already picking your elevator, and it's not always the closest one" | ✅ | A1, A3 | PASS |
| 2-3 | closest car has a stop first; a farther one could come straight to you | ✅ | A3 | PASS (Peters Fig. 2) |
| 4 | "Many systems pick by time instead of distance, so sometimes the farther car gets the job" | ✅ | A3, B1 | PASS. Hedge applied. Peters ETA: "the decision is made based on time rather than distance". |
| 5 | knows every car's position and direction; "it can weigh each one to see how full it is" | ✅ | A2 | PASS |
| 6 | seconds to reach you, counting stops already promised | ✅ | B1 | PASS |
| 7 | "Some systems also add up how much your stop would delay everyone else" | ✅ | B2 | PASS |
| 8 | "In those systems, every car gets a score, and the lowest one gets you" | ✅ | B3 | PASS. "Those systems" now points at the delay-counting systems and the scored methods (Otis, Inventio, Smith & Peters). |
| 9 | four elevators, five floors calling, 1,024 | ✅ | B6 | PASS (five separate calls) |
| 10 | "most systems keep re-deciding as new calls come in" | ✅ | B5 | PASS (Peters: "Most systems will re-allocate calls") |
| 11 | "It can even change its mind late in the game." | ✅ | B5 | PASS. "Can" is the hedge; re-allocation is sourced, and the KONE patent keeps selecting until the car must decelerate. |
| 12 | "In one maker's design, it only locks in a car once that car has to start braking for your floor." | 🟡 | B5 | PASS as attributed. Exact-fit option: "In one maker's patent, it only locks in a car once that car has to start braking for your floor." The source is one KONE patent ("not made until the elevator is so close ... it must begin to decelerate in order to stop"), a claimed method, not a product spec. The twice-a-second figure is gone, so the "e.g." problem is resolved. |
| 13 | "Since around 1990, some buildings have had you enter your floor in the lobby, and they tell you which elevator to take" | ✅ | C1, C5 | PASS (Schindler 2024 timeline, 1990; "around" covers 1992/1995 variants) |
| 14 | "That lets the system group people going to the same floors, so each car makes fewer stops" | ✅ | C2 | PASS |
| 15 | "It can be confusing, especially the first time, and in hotels, where almost everyone is new." | 🟡 | C4 | FIX: "...and in hotels, where many riders are new." Peters 2006: "in buildings with transient population, for example hotels, there is more likely to be confusion"; NPR: "a lot of inexperienced riders". "Almost everyone" is unsourced and overstates it. |
| 16 | "Button or keypad, the computer's picking for everyone at once, which can mean you wait longer" | ✅ | B8, C3 | PASS. Peters 2014 "some passengers will wait longer" (conventional); Peters 2006 "the passenger will sometimes wait longer to be picked up" (keypad). |
| 17 | "a farther car shows up, it was probably the one the computer scored lowest" | ✅ | B3 | PASS. "Probably" is the needed hedge. |

**Verdict: PASS** (no ❌). One required fix (line 15, "many riders are new"). One optional (line 12, "patent"). No company is named in the voice; nothing legally sensitive.

---

## First-draft ruling (superseded; evidence kept)

Opened directly this pass: Peters 2014 (dispatching), Smith & Peters 2002, Peters 2006, Otis US4363381A, KONE US7513337, Inventio US4878562A, Schindler 150-years timeline, and the Washington L&I leaflet (PDF, read via the saved file). Still 403: both Elevator World pages (`?p=78363`, `?p=39544`), so neither is used. The CIBSE PDF returned no text, and nothing in the script depends on it (D3 is not in the script). Several pages were read through a summarizing fetch tool. Quotes marked "re-confirmed" below matched in that read; the rest are the researcher's quotes and are unchanged.

| Line | Claim as scripted | Status | Entry | Fix (exact wording) |
| --- | --- | --- | --- | --- |
| 1 | "a computer is already deciding which elevator gets you" | ✅ | A1, B5 | none |
| 1 | "it's not always the closest one" | ✅ | A3 | none. Support: even Peters' simplest rule is "the closest car that can stop in time"; the Otis patent treats a car "going away from the call" as unavailable; Peters says a full car should bypass landing calls. Say "not always", never "never" or "usually". |
| 1 (short hook) | "A computer picks which elevator comes for you, and it's not always the closest one." | ✅ | A1, A3 | none. Same support, same scope. Dropping "when you press that button" loses nothing sourced. |
| 2-3 | closest car has a stop first, a farther one could come straight to you | ✅ | A3 | none. Peters 2014 Fig. 2, verbatim. |
| 4 | "The computer goes by time" | 🟡 | A3, B1 | "Many systems go by time, and sometimes that means the farther car gets you." Time-based ETA is documented (Peters; Smith & Peters; patents use weighted sums), but Peters says nothing on how widespread it is, and the simplest rule is distance-based. |
| 4 | "sometimes that means the farther car gets you" | ✅ | A3 | none. "Sometimes" is the safe form. Peters poses Fig. 2 and doesn't answer it, so the line rests on the mechanisms above, not a worked example. |
| 5 | "knows where every car is and which way it's moving" | ✅ | A2 | none |
| 5 | "it weighs each one to tell how full it is" | 🟡 | A2 | "it can weigh each one to tell how full it is." Load weighing is sourced (Inventio, Peters "Load weighing needs to be properly calibrated", NPR), but not that every car has it. |
| 6 | seconds to reach you, counting stops already promised | ✅ | B1 | none. "Seconds" is fine; the 10 s per stop is Peters' example and isn't spoken. |
| 7 | "Some systems also add up how much your stop would delay everyone else" | ✅ | B2 | none. Smith & Peters: "calculates the System Degradation Factor of the allocation for every other passenger in the system". "Some" matches the scope. |
| 8 | "Every car gets a score, and the lowest one gets you" | 🟡 | B3 | "In those systems, every car gets a score, and the lowest one gets you." Otis ("lowest summation"), Inventio ("lowest cost of operation") and Peters ("lowest ETA") agree, but the nearest-car and collective rules don't score cars, and the Inventio "lowest cost" line is from the patent's background (prior art). |
| 9 | "four elevators and five floors calling ... 1,024 ways" | ✅ | B6 | none. Peters: "With four elevators and five calls, there are four to the power of five, 1024 possible options." 4^5 = 1,024. "Five floors calling" is fine only as five separate calls; don't picture two buttons on one floor. |
| 10 | "Most systems keep re-deciding as new calls come in" | ✅ | B5 | none. Peters: "Most systems will re-allocate calls to account for this." |
| 11 | "In one maker's design, that's about twice a second, until a car has to start slowing down for you" | 🟡 | B5 | "In one maker's patent, the example is twice a second, until a car has to start slowing down for you." Re-confirmed: "keeps continuously selecting, e.g. at half-second intervals" and "must begin to decelerate in order to stop". The patent gives it as an example ("e.g."), and a patent is a claimed method, not a product spec. As scripted it is allowed (attributed to one maker), but "patent ... example" is the exact fit. Not ✅ as a rate for any real product. |
| 12 | "Since around 1990, some buildings ask for your floor in the lobby and tell you which elevator to take" | ✅ | C1, C5 | none. Schindler's 2024 timeline (re-confirmed): "World's first hall call destination system, Miconic 10, is launched." (1990). "Around" covers the 1990/1992/1995 spread in other sources. |
| 13 | groups people going to the same floors, fewer stops per car | ✅ | C2 | none. "Same floors", not "nearby floors". |
| 14 | "it can confuse first-timers, especially in hotels" | ✅ | C4 | none. Peters 2006 (re-confirmed): "in buildings with transient population, for example hotels, there is more likely to be confusion." |
| 15 | "the computer's picking for everyone at once" | ✅ | B2, C2 | none |
| 15 | "which can mean you wait a little longer" | 🟡 | B8, C3 | "which can mean you wait longer." Peters 2014: "some passengers will wait longer"; Peters 2006 (re-confirmed): "the passenger will sometimes wait longer to be picked up." No source gives a size, so "a little" is unsourced. |
| 16 | "it's the one that scored lowest" | 🟡 | B3 | "it was probably the one that scored lowest." A farther car can also arrive because the nearer one is full, out of service, or the building runs a simpler rule. Stays 🟡 until line 8 carries "In those systems". |

**Legally sensitive:** none named in the voice. Schindler (Miconic 10) is not named in this script. Makers appear only in sources as patents, product pages and papers; keep "one maker's" and don't add a name. A patent is a claimed method, not proof of a product.

**Verdict: PASS** (no ❌). Wording fixes for the scriptwriter before the user approves: lines 4, 5, 8, 15 and 16 (needed, they read as universal claims the sources support only as "many/some"), and line 11 (recommended, it is already attributed).

---

## A. The decision exists: a group controller picks the car

### A1. In a bank of elevators, one part of the control system decides which car answers which call ("dispatching")

- **Script (likely):** "When you press that button, a computer is already deciding which elevator gets you."
- **Status:** ✅ verified (researcher) for "a control system decides which elevator serves which call". ✅ for "a computer" (microprocessor-based group controller since at least Otis's 1979 patent filing). "Already deciding" fits both immediate and continuous allocation (B5).
- **Source:** [Elevator Dispatching](https://wordpress.peters-research.com/index.php/papers/elevator-dispatching/), Richard D. Peters, Peters Research Ltd, presented at ELEVCON Paris 2014, published in *Elevator Technology 9* (IAEE, ed. A. Lustig), 2014 (accessed 2026-10-17)
- **Quote:** "Dispatching is the part of the elevator control which chooses which elevator serves which call."
- **Source (KONE patent, background):** [US7513337B2, Elevator system](https://patents.google.com/patent/US7513337), Kone Corp (assignee), priority 2005-09-27, granted 2009-04-07 (accessed 2026-10-17)
- **Quote:** "tries to determine which one of the elevators in the elevator group will be best able to serve the person" / "The process of determining which elevator will be suitable for the user is termed call allocation."
- **Source (Otis patent):** [US4363381A, Relative system response elevator call assignments](https://patents.google.com/patent/US4363381A/en), Otis Elevator Co (assignee), inventor Joseph Bittar, priority 1979-12-03, granted 1982-12-14 (accessed 2026-10-17)
- **Quote:** "An elevator control system employes microprocessor-based group controller which communicates with the cars of the elevator system" (sic, "employes")
- **Fact-checker re-quote (Otis US4363381A, opened):** "assigned to cars on the basis of a summation of relative system response factors for each car"; "the time it takes for the elevator to provide service already assigned to it"; "going away from the call"; "if the car is not available, most of the considerations with respect to this car are bypassed"; "the respective car being full but having a car call registered within it for the landing of the call". Replaces the earlier paraphrase.
- **Note:** Industry words: "group control", "group supervisory control", "dispatcher", "call allocation". For a general audience: "the building's elevator computer" or "a controller". Scope: a lobby with **several** elevators. A single elevator has nothing to choose.

### A2. What the controller knows: where each car is, which way it's going, the stops it already has, and how full it is

- **Script (likely):** "It knows where every car is, which way it's heading, every stop it has already promised, and roughly how full it is."
- **Status:** ✅ verified (researcher) for position, stops, load and calls (two patents, Peters). ✅ for direction (Otis patent and Peters example). "Roughly how full" is fair: the car is weighed (load weighing), not counted.
- **Source (Inventio/Schindler patent, background):** [US4878562A, Group control for elevators with load dependent control of the cars](https://patents.google.com/patent/US4878562), Inventio AG (assignee), priority 1987-10-20, granted 1989-11-07 (accessed 2026-10-17)
- **Quote:** "from at least the distance between the floor and the car position indicated by a selector," … "the intermediate stops to be expected within this distance and the instantaneous car load," … "a sum proportional to the loss of time of the waiting passengers at the floors and in the car."
- **Source (Otis patent):** US4363381A, as in A1
- **Quote (factors in the summation):** "the respective car being full but having a car call registered within it" / "the respective car having no other need to travel"
- **Note (Otis, tool summary of the description, re-quote before use):** the summation counts "the time it takes for the elevator to provide service already assigned to it before it will be able to service the call in question", and a car moving away from the call is treated as unavailable for it.
- **Source (Peters 2014):** as in A1
- **Quote (load):** "should include a load bypass function in order to avoid stopping for landing calls when the elevator is full."
- **Source (press):** [Smart Elevators: A Faster Way Up and Down](https://text.npr.org/6799860), Jim Zarroli, NPR *Morning Edition*, 2007-01-11 (accessed 2026-10-17)
- **Quote:** "Smart elevators can also calculate the weight of their passengers to prevent too many people from getting on."
- **Note:** The Inventio quote describes earlier prior art (US 4,718,520) in the patent's background. It is the clearest single list of inputs.

### A3. It's not always the closest car, and here's the textbook case

- **Script (likely):** "The closest car is heading your way but has a stop to make first, while a car farther away could come straight to you."
- **Status:** ✅ verified (researcher) for the dispatching dilemma as Peters poses it (closest car with a stop vs farther car going straight). ✅ for "decided on time, not distance" (ETA, B1). ✅ (fact-checker) for the bare words "not always the closest": no source says them verbatim, but each opened method skips the closest car in some case. Peters' own simplest rule is "the closest car that can stop in time"; Otis treats a car "going away from the call" as unavailable and bypasses "most of the considerations" for it; Peters: a full car should bypass landing calls. Safe as "not always"; keep it out of "usually" or "often". Recommended spoken support: show the Peters case.
- **Source:** Peters 2014, as in A1 (Section 1, Figure 2)
- **Quote:** "There is a down landing call at level 4." / "Car B is travelling in the right direction and is the closest car; but has a stop for a car call at level 6." / "Car A is further away, but could go straight to the call." / "Should Car A or Car B be "allocated" to the call?"
- **Source (time, not distance):** Peters 2014 (Section 3.2)
- **Quote:** "very similar, except that the decision is made based on time rather than distance."
- **Note:** Peters poses the question and doesn't give the answer for Figure 2 (it depends on the objective). So the script must not say "the computer always sends Car A". Safe: "and sometimes the farther car gets the job." Three sourced reasons the closest car loses: it has stops first (Peters), it's moving the other way (Otis A2 note), it's full (Peters load bypass, A2).

### A4. Older and simpler systems: "collective" control and "nearest car"

- **Script (likely):** "Older systems used a simple rule: each car sweeps up every call in one direction, then turns around." / "The simplest rule just sends the nearest car that can still stop in time."
- **Status:** ✅ verified (researcher)
- **Source:** Peters 2014, as in A1
- **Quote (collective):** "All landing calls, and the resulting car calls in one direction are served" … "then the car reverses and serves calls in the opposite direction."
- **Quote (nearest car):** "One of the simplest group collective algorithms is based on allocating the closest car that can stop in time for the landing call."
- **Quote (Peters' example):** "cars A, B and C are 15 m, 10 m, and 5 m away in distance from the 7 down landing call respectively."
- **Note:** "Older" is our framing. Peters presents nearest car as **simple**, not as obsolete, and doesn't date it. Safe: "the simplest rule". Collective control (up and down buttons on each floor) is still the norm in most buildings. "Collective" is jargon, so describe it rather than naming it.

---

## B. How the decision is made

### B1. It estimates how long each car would take to reach you (ETA) and picks the fastest

- **Script (likely):** "For each car, it works out how many seconds it would take to reach you, counting every stop on the way."
- **Status:** ✅ verified (researcher)
- **Source:** Peters 2014, as in A1 (Section 3.2, Figure 6)
- **Quote:** "Car A would be 15 seconds away from the landing call if it travelled there directly." / "However, it has to stop at level 8 for a car call and a time allowance is made for the stop, in this instance 10 seconds." / "Car C has the lowest ETA and so receives the allocation."
- **Source (Smith & Peters 2002, on ETA systems):** [ETD Algorithm with Destination Dispatch and Booster Options](https://wordpress.peters-research.com/?p=962), Rory Smith (ThyssenKrupp Elevator) and Richard Peters (Peters Research), ELEVCON Milan 2002, *Elevator Technology 15* (IAEE); also *Elevator World* 2002-07; web version 2009 (accessed 2026-10-17)
- **Quote:** "reduces waiting time by selecting the elevator in a group that can answer a hall call in the lowest amount of time"
- **Note:** A "10 seconds per stop" figure is Peters' worked example ("in this instance"), not a standard. Don't say "every stop costs 10 seconds". 🎭 if shown as a number on screen.

### B2. Better systems also count the delay to everyone already riding or waiting (a "cost" for each car)

- **Script (likely):** "Then it asks a harder question: if this car stops for you, how much later does everyone already on board get where they're going?"
- **Status:** ✅ verified (researcher). Peer-reviewed congress paper by a manufacturer's engineer (ThyssenKrupp, now TK Elevator) and an independent consultant; Mitsubishi's product page says the same in marketing words; Inventio patent background (A2) counts waiting passengers' and riders' lost time.
- **Source:** Smith & Peters 2002, as in B1
- **Quote:** "aims to minimize total passenger journey time" / "the system also calculates the System Degradation Factor of the allocation for every other passenger in the system." / "the delay that the new passenger will cause to passenger k." / "the system degradation to all the other users of elevator e, plus the estimated time to destination for the new passenger"
- **Source (manufacturer):** [ΣAI-2200C, Key Benefits](https://mitsubishi-electric.vn/en/thang-may/he-thong-giam-sat-va-dieu-khien/ai-2200c), Mitsubishi Electric Vietnam, product page, undated (accessed 2026-10-17)
- **Quote:** "The optimal car allocation based on the evaluation minimizes irritation of all passengers." / "evaluates not only actual waiting time but also psychological waiting time"
- **Source (Inventio patent):** as in A2 ("a sum proportional to the loss of time of the waiting passengers at the floors and in the car.")
- **Note:** This is the heart of the video: the controller gives each car a "price" for taking your call and the cheapest car wins. "Cost" is the industry word (Inventio: "lowest cost of operation"; Otis: "lowest summation"). In plain words: "a score".

### B3. The car with the lowest score gets the call

- **Script (likely):** "Every car gets a score, and the car with the lowest one gets you."
- **Status:** ✅ verified (researcher), from three makers' patents. Patents show the method each claims, so "the car with the lowest score" is the general idea, not one product's code.
- **Source (Inventio):** US4878562A, as in A2
- **Quote:** "an assignment command is stored in an assignment memory of the elevator with the lowest cost of operation."
- **Source (Otis, 1988):** [EP0342008A2, Weighted relative system response elevator car assignment system](https://patents.google.com/patent/EP0342008A2/en), Otis Elevator Co, priority 1988-05-11, published 1989-11-15 (accessed 2026-10-17)
- **Quote:** "assigning each registered hall call to the car provided with the lowest summation of relative system response factors" / "use bonuses and penalties to even out the waiting times and greatly reduce, if not eliminate, large waiting times"

### B4. What it optimizes: waiting time, time to destination, and sometimes energy

- **Script (likely):** "Depending on the building, it's tuned to cut waiting, total trip time, or even energy."
- **Status:** ✅ verified (researcher) for waiting time and time to destination (Peters), long waits (Otis), and energy (Mitsubishi product page). 🟡 for "tuned by the building": the KONE source that says the objective changes with traffic (Elevator World, "KONE Polaris Hybrid") returned 403. Its wording is from the search snippet only (lead).
- **Source:** Peters 2014, as in A1
- **Quote:** "passenger based quality of service measures, e.g. waiting time and time to destination"
- **Source (energy, manufacturer):** Mitsubishi ΣAI-2200C page, as in B2
- **Quote:** "if multiple cars have the same traveling distance, this system chooses the car that requires the least energy." / "Car allocation that maximizes operational efficiency does not necessarily translate to energy efficiency."
- **Source (KONE patent):** [US6644442B1, Method for immediate allocation of landing calls](https://patents.google.com/patent/US6644442), Kone Corp, (search snippet only, not opened; lead)
- **Snippet (not opened):** "Allocation may aim at minimizing passengers' waiting time, passengers' traveling time, the number of times the elevator will stop"
- **Lead (403):** Elevator World, "KONE Polaris Hybrid" (`elevatorworld.com/?p=39544`), snippet: "the traffic pattern is used in selecting the optimization objective during each 15-min. interval".

### B5. It keeps re-deciding while you wait: in one maker's design, about every half second, until a car must start slowing down

- **Script (likely):** "And it doesn't decide just once. In some systems, it re-checks about twice a second, and only locks in a car when that car has to start slowing down for your floor."
- **Status:** 🟡 plausible (researcher). Re-allocation is ✅ ("most systems", Peters). The half-second figure is **one example in one KONE patent** ("e.g."), so speak it only hedged and attributed ("in one maker's design" or "some systems"), never as a universal rate. No source found for a typical industry rate.
- **Source:** Peters 2014, as in A1
- **Quote:** "While these calls are being served other calls will be entered that will change the optimum solution." / "Most systems will re-allocate calls to account for this."
- **Source (KONE patent):** US7513337B2, as in A1
- **Quote:** "In continuous allocation, the control system 13 keeps continuously selecting, e.g. at half-second intervals," … "a suitable elevator for the user." / "the actual selection of an elevator is not made until the elevator is so close to the floor of the call" … "it must begin to decelerate in order to stop."
- **Note:** This is a strong visual: the orange line from the controller jumps between cars, then locks when a car starts braking. The arrow above the door that lights at the last moment is the visible tell. That last point (the hall lantern lighting late) is **not** sourced. Don't say it.

### B6. Why it's hard: the options multiply fast

- **Script (likely):** "With just four elevators and five calls, there are 1,024 ways to answer them."
- **Status:** ✅ verified (researcher). It is arithmetic (4⁵), stated by Peters.
- **Source:** Peters 2014, as in A1
- **Quote:** "the number of different ways the system could answer the calls grows exponentially." / "With four elevators and five calls, there are four to the power of five, 1024 possible options."
- **Note:** Good hook number (D1). "Calls" means separate button presses on different floors or directions, not people. Say "five calls" or "five floors calling", not "five people".

### B7. Rush hour changes the rules (morning up-peak)

- **Script (likely):** Optional: "At nine in the morning, when everyone arrives at once, some systems split the building into zones and send each car to its own block of floors."
- **Status:** ✅ verified (researcher) for "morning up-peak is a stream from the ground floor" and "some systems divide the building into sectors". 🎭 for "nine in the morning" (illustrative time).
- **Source:** Peters 2014, as in A1
- **Quote:** "In morning up-peak traffic there is often a stream of people arriving at the ground floor." / "the building is divided up into sectors; an elevator is sent to the top of each sector in turn."
- **Note:** Peters says this reduces stops per round trip and raises handling capacity (tool paraphrase; re-quote before using the "why"). Fact-checker: the "sectors" quote may belong to Peters' down-peak discussion, not up-peak (the re-read put "an elevator is sent to the top of each sector in turn" in a down-peak context). Treat the sector claim as 🟡 and don't use it. Not in the script.

### B8. In fairness: grouping can make some people wait longer

- **Script (likely):** Fairness beat: "In fairness, the best choice for the whole building can mean you wait a little longer."
- **Status:** ✅ verified (researcher)
- **Source:** Peters 2014, as in A1
- **Quote:** "Giving priority to co-incident calls does not always improve quality of service; some passengers will wait longer."
- **Source (destination control):** Peters 2006, as in C3 ("the passenger will sometimes wait longer to be picked up")

---

## C. The twist: destination dispatch (you type your floor in the lobby)

### C1. How it works: you enter your floor before boarding, and a screen tells you which elevator to take

- **Script (likely):** "In some newer office towers, there's no up button at all. You type your floor on a keypad, and it tells you which elevator to take."
- **Status:** ✅ verified (researcher)
- **Source:** NPR 2007, as in A2
- **Quote:** "Instead of pushing a button to go up or down, passengers first select the floor they want." / "Then they are directed to the elevator that will take them to their destination with the fewest number of stops." / "Enter the floor number and the keypad directs you to a particular elevator." / "The first thing you notice about the Miconic 10 is that it has no up and down buttons."
- **Source:** Smith & Peters 2002, as in B1
- **Quote:** "passengers register their destination floors at landings." / "The system then tells the passenger which elevator to use."
- **Source (manufacturer):** [KONE Destination Solutions](https://kone.co.uk/existing-buildings/smart-solutions/destination-solutions), KONE UK, product page, undated (accessed 2026-10-17)
- **Quote:** "Unlike conventional lift control systems which only register the desired travel direction," … "our destination control system takes into account desired destination floors and the number of waiting passengers"

### C2. It groups people going to the same or nearby floors, so cars make fewer stops

- **Script (likely):** "Because it knows where everyone is going before they get in, it puts people headed to the same floors in the same car, so each car makes fewer stops."
- **Status:** ✅ verified (researcher) for "same destinations" and "fewer stops". 🟡 for "nearby floors" (no opened source says "nearby"; a trade description of Otis CompassPlus says adjacent floors, search snippet only). Say "the same floors".
- **Source:** Smith & Peters 2002, as in B1
- **Quote:** "a destination control input enables the system to group together the people traveling to common destinations."
- **Source:** [Understanding the Benefits and Limitations of Destination Control](https://wordpress.peters-research.com/?p=1145), Richard D. Peters, ELEVCON Helsinki 2006, *Elevator Technology 16* (IAEE); web version 2009 (accessed 2026-10-17)
- **Quote:** "the elevators are making fewer stops, so their round trip is faster."
- **Source (press, quoting Schindler):** NPR 2007, as in A2
- **Quote:** "It allows us to group people going to common destinations." / "So, therefore, the elevators stop at less floors as they go through the building,"

### C3. What it improves (mainly the morning rush) and what it costs

- **Script (likely):** "It shines in the morning rush, when everyone starts from the lobby." / "The catch: you might wait a little longer for your car, but the ride is shorter."
- **Status:** ✅ verified (researcher) for "biggest gain at up-peak, less at lunchtime" and "you may wait longer, but the trip is shorter". ✅ for the simulation result as "in one simulation" only. ❌ for any single headline percentage (see C5).
- **Source:** Peters 2006, as in C2
- **Quote:** "destination control improves up peak performance dramatically" / "Improvements in up peak performance are unlikely to be repeated at other peak times." / "the passenger will sometimes wait longer to be picked up" / "destination control is of less benefit during the lunch period."
- **Quote (simulation):** the conventional system is "saturating at around 0:40 when the intensity of the traffic reaches 95 persons per 5 minutes." / "This system is still working comfortably at over 110 persons per 5 minutes."
- **Source:** Smith & Peters 2002, as in B1
- **Quote:** "during up peak traffic, the improvements in journey time arising from grouping are dramatic" / "At other times, for example at lunchtime, the grouping is less significant"
- **Note:** 95 vs 110+ is one simulated building, not a general gain. Turning it into "16% more" is our own arithmetic, so don't. Peters also notes that because the passenger is told a car at once, "the system is committed" (no re-allocation), which is the trade-off against B5.

### C4. Trade-offs for people: confusing at first, especially for visitors, and some cars have no floor buttons inside

- **Script (likely):** "It confuses first-timers, and in some buildings there are no floor buttons inside the car at all."
- **Status:** ✅ verified (researcher) for "confusing at first, more so in hotels" (NPR, Peters). ✅ for "some systems use lobby panels only" (KONE: the "traditional" destination system uses destination panels only, while the hybrid keeps normal car panels). 🟡 for the exact words "no buttons inside": KONE implies it, Peters says no car call is needed. Say "some cars have no floor buttons inside", not "all".
- **Source:** NPR 2007, as in A2
- **Quote:** "Smart elevators can be tough for users to figure out at first." / "That can be confusing at a place like a hotel, where you have a lot of inexperienced riders."
- **Source:** Peters 2006, as in C2
- **Quote:** "in buildings with transient population, for example hotels, there is more likely to be confusion." / "and thus there is no need for the passenger to register a car call."
- **Source:** KONE Destination Solutions, as in C1
- **Quote:** "With the traditional destination control system elevators are called using destination operating panels only," … "while with the hybrid - using destination operating panels in the main entrance floors" … "as well as normal car operating panels in the lift cars."
- **Note:** A Wikipedia limitation is a nice detail but is tagged "citation needed" in places, so don't use it: the system can't tell a group from one person when only one of them types the floor.

### C5. Who introduced it and when: the idea in the early 1960s, Schindler's Miconic 10 in about 1990

- **Script (likely):** "Schindler launched the first one, called Miconic 10, in 1990." Probably as a description line only. If spoken, it's a story about Schindler's own product, so the name is allowed (brand.md § Company names), but it isn't needed.
- **Status:** ✅ verified (researcher) for "Schindler's own 2024 annual report dates the Miconic 10 launch to 1990 and calls it the world's first hall-call destination system". 🟡 for the year in general: other sources say 1992 (a Schindler history snippet, not opened) and 1995 (old Wikipedia text). Wikipedia today says 1990. "Around 1990" or "in the early 1990s" is safe. ✅ for "the idea is older: an engineer named Port in Sydney, early 1960s" (Peters 2006).
- **Source:** [150 years Schindler (timeline)](https://reports.schindler.com/en/2024/report/group-review/150-years-schindler), Schindler Group, Annual Report 2024, undated page (accessed 2026-10-17)
- **Quote:** "World's first hall call destination system, Miconic 10, is launched." (timeline entry for 1990)
- **Source:** Peters 2006, as in C2
- **Quote:** "Destination control is not a new concept, it was first conceived by an engineer named Port from Sydney in the early 1960's [1]."
- **Source (secondary):** [Destination dispatch](https://en.wikipedia.org/wiki/Destination_dispatch), Wikipedia (accessed 2026-10-17)
- **Quote:** "The first destination dispatch to be introduced was the Miconic 10 system, introduced in 1990 by Schindler Group."
- **Lead (403):** Elevator World interview "Past, Present and Future" (`elevatorworld.com/?p=78363`): the search snippet says the first Miconic 10 building was the Hamburg Electric Company headquarters in 1990. ❌ until opened. Leo Port was later Lord Mayor of Sydney (Wikipedia); his "lift-control system received a merit award for Australian design in 1969" ([Australian Dictionary of Biography](https://adb.anu.edu.au/biography/port-leo-weiser-11444), Shirley Fitzgerald, 2002). The ADB does not say it was destination control.
- **Note:** Vendor percentages, none independently verified, none for the voice: Schindler PORT page "Improve your building's elevator traffic management by up to 50%" ([schindler.com](https://www.schindler.com/en/elevators/destination-control/port-elevator.html), opened, 🟡 vendor claim, vague metric); Schindler "up to 30%" shorter up-peak journeys (brochure snippet, ❌ not opened); Otis "as much as 50 percent faster" (2017 press release via Benzinga, ❌ not opened); KONE "20–100%" up-peak handling capacity (brochure snippet; KONE's HTML page does not contain it, ❌); Wikipedia "25% … 30%" (cites an archived ThyssenKrupp page, ❌ not opened).

### C6. Fewer stops also means less energy (manufacturers' claim)

- **Script (likely):** Optional: "Fewer stops also saves energy, the makers say."
- **Status:** 🟡 plausible (researcher): attributed manufacturers' claim in reputable press, no independent measurement found.
- **Source:** NPR 2007, as in A2
- **Quote:** "Manufacturers say smart elevators are faster, easier and even more energy efficient than older elevators." / "And because smart elevators make fewer stops, they use less energy."
- **Note:** NPR also reports "Manufacturers concede that smart elevators aren't practical in buildings that are less than 10 stories." That's a useful scope limit (2007, makers' view).

---

## D. Hook and payoff facts

### D1. Four elevators and five calls: 1,024 possible plans

- See B6. ✅. The best sourced number for a hook ("over a thousand ways").

### D2. The controller re-picks your car about twice a second (one maker's design)

- See B5. 🟡, hedged and attributed only.

### D3. Typical wait-time targets (e.g. "about 30 seconds in offices")

- **Script (likely):** "Office buildings are usually designed so a car arrives every 20 to 30 seconds."
- **Status:** 🟡 plausible (researcher), and **recommended to skip**. The common "30 seconds" is a design **interval** (time between cars at the lobby during the morning rush), not the average wait. The two are often confused. The only opened source is a wiki. CIBSE Guide D and the Property Council of Australia guideline were not opened.
- **Source:** [Lifts for office buildings](https://www.designingbuildings.co.uk/wiki/Lifts_for_office_buildings), Designing Buildings Wiki, last edited 2020-10-02 (accessed 2026-10-17)
- **Quote:** "20 to 30 seconds provides a range from standard to prestige." / "Waiting times are not the same as average interval times:" / "75% car loading of a 30 second average interval time equals 22.5 seconds waiting time." / "It is waiting times that are the driver of public perception and are of interest to letting agents."
- **Leads (not opened):** CIBSE Guide D chapter PDF (`cibse.org/media/5a4lpbwp/chapter-3-4-9-a2.pdf`); Mitsubishi ΣAI-2200C brochure (defines a long wait as 60 seconds or more, search snippet only).

### D4. By 2007, NPR reported about 600 destination systems in North America (from one maker)

- **Status:** ✅ verified (researcher) as "Schindler had installed about 600 in North America by 2007". Too dated and too narrow for the voice. Description only, if at all.
- **Source:** NPR 2007, as in A2
- **Quote:** "Schindler has installed about 600 of the systems in North America."

---

## E. Myths

### E1. "Pressing the call button again makes it come faster"

- **Script (likely):** Possible turn-it-back line: "So pressing it again won't help; your call was already counted the first time."
- **Status:** ✅ verified (fact-checker, opened 2026-10-17). Not in the current script (line 16 doesn't say it).
- **Source:** [Elevator safety leaflet F621-084-000](https://www.lni.wa.gov/forms-publications/F621-084-000.pdf), Washington State Department of Labor & Industries with the Elevator Escalator Safety Foundation, publication date 07-2006 (accessed 2026-10-17)
- **Quote:** Myth: "Pushing the hall call button repeatedly will make the elevator appear faster." Truth: "The call is registered just once; repeated button-pushing won't bring an elevator sooner." Tip: "Push the elevator call button once for the direction you want to go."
- **Note:** Opened the whole leaflet: no contradictory line found (the earlier search summary was wrong). It is a 2006 safety-education leaflet, so say "elevator-safety educators say" if spoken, not a universal technical claim. Newsweek (Martin Lindstrom, 2024-04-17, opened) treats it as common knowledge ("even though we know it won't make the elevator arrive faster?") but quotes no expert, so it is not a source.

### E2. "The door-close button doesn't work"

- **Status:** 🟡 as attributed. **Out of scope** (it's inside the car, not the dispatch decision). Recommend leaving it out. The popular version ("most door-close buttons are fake") overstates what the source said.
- **Source:** ['Door Close' Buttons On Most Elevators Don't Actually Work](https://cbsnews.com/amp/boston/news/door-close-elevator-button-dont-work-placebo), CBS Boston, 2016-10-31, reporting the *New York Times* (2016-10-27, not opened, tool blocked) (accessed 2026-10-17)
- **Quote:** "functional close-door buttons have been phased out since the passage of the Americans With Disabilities Act in 1990." / "Federal law requires that the doors stay open long enough for those with crutches or a wheelchair to get in the elevator." / "The riding public would not be able to make those doors close any faster."
- **Note:** The quote is from Karen Penafiel, National Elevator Industry Inc. In many elevators the button does work after the minimum open time, and fire and service modes use it. The "80% don't work" figure is unsupported (a fact-check traced it to a 2023 Reddit post; search snippet only).

### E3. "The elevator always sends the nearest car"

- **Status:** ✅ as a myth to correct (see A3, B1–B3). Nearest car is only the simplest rule. Modern controllers decide on estimated time and the effect on other riders.

### E4. "Pressing both up and down gets you a car faster"

- **Status:** ❌ unsupported. No opened source. A common trick, and probably counter-productive (it adds a call another car may stop for), but there's no source, so don't script it.

---

## Myths and what the evidence says

| Myth | What the evidence says | Entry |
| --- | --- | --- |
| "It sends the closest elevator." | Only the simplest rule does that. Controllers estimate time, count stops already promised, skip full cars and cars going the wrong way, and many weigh the delay to everyone else. | A3, A4, B1–B3 |
| "Pressing the button again speeds it up." | The call is registered once and then allocated. Extra presses aren't an input to any method found (direct source not yet opened). | E1, B5 |
| "Once a car is assigned, that's final." | In conventional systems, most controllers keep re-allocating as new calls come in (one maker's patent: about every half second, until a car must slow down). Destination systems are the exception: once you're told a car, it's committed. | B5, C3 |
| "Destination dispatch is just a fancy keypad." | Knowing destinations in advance lets the system group riders, cutting stops. The gain is biggest in the morning rush and small at lunch. | C2, C3 |
| "The door-close button is fake." | Overstated. US accessibility rules set a minimum open time, so it can't beat that, but it isn't always disconnected. Out of scope here. | E2 |

## Suggested angles and hooks (within the agreed angle)

All open on the same moment (pressing the call button in a lobby with several elevators) and give the same answer. The question lands by about 5 s.

0. **Owner's hook (pattern 5 shape, told as a lived moment).** "When you press that button, a computer is already deciding which elevator gets you, and it's not always the closest one." Question: "So who decides, and how?" Facts: A1, A3. Note: "not always the closest" is the 🟡 line in A3. The fact-checker should rule on it, or the script can make it concrete right after ("the closest car has a stop to make first").

1. **The farther car (pattern 1, the lived moment).**
   Hook: "The elevator that's closest to you is often not the one the building sends, because it's already promised to stop somewhere first."
   Question (by ~5 s): "So when you press the button, how does the building pick a car?"
   Facts: A3, B1. Problem: "often" is unsourced (no source gives a frequency). Use "sometimes" or "isn't always".

2. **A thousand ways (pattern 4, the finding).**
   Hook: "With just four elevators and five calls, there are over a thousand ways to answer them, and the building has to pick one almost instantly."
   Question: "So who makes that choice when you press the button?"
   Facts: B6, B5. Strong number, ✅. "Almost instantly" is not sourced as a speed. Safer: "and it picks one while you're still waiting".

3. **No up button (pattern 5, the wrong recipient).**
   Hook: "In some office lobbies there's no up button anymore; you type your floor, and the building tells you which elevator to take."
   Question: "So who's deciding which elevator you get?"
   Facts: C1, C2, then back to group control. Risk: it leads with the twist, so most viewers' everyday elevator becomes the second half.

## 7-step outline (about 60–70 s spoken; American English)

| Step | What the words do (draft beats, not script) | Entries |
| --- | --- | --- |
| 1. Surprise | Owner's hook: "When you press that button, a computer is already deciding which elevator gets you, and it's not always the closest one." Frame 0: the cut-open building, YOU at the lobby button, one car lit orange. | A1, A3 |
| 2. The surprise made specific | The textbook case. Look at the shafts: the closest car is coming your way but has a stop first, and a car farther up could come straight down. | A3 |
| 3. Question (by ~5–6 s) | "So who decides which one comes, and how?" | — |
| 4. Answer, then mechanism | Answer: a controller that watches every car: where it is, which way it's going, the stops it has promised, and how heavy it is. For each car it works out how long it would take to reach you, counting every stop on the way. Better systems also count how much your stop would delay the people already riding. Every car gets a score, and the lowest wins. It keeps re-deciding as new calls come in (in one maker's design about twice a second) and locks in a car when it has to start braking. Optional number: four cars and five calls already make 1,024 possible plans. | A1, A2, B1, B2, B3, B5, B6 |
| 4b. Twist (optional, ~10–12 s) | Some newer towers skip the up button: you type your floor, it groups people going to the same floors, and tells you which car to take. Fewer stops, biggest gain in the morning rush. In fairness, it confuses first-timers, and you might wait a little longer for a shorter ride. | C1–C4 |
| 5. One idea to keep | "The elevator isn't coming for you; it's coming for everyone at once, and you're one line in the math." (Avoid "not X, but Y". The scriptwriter should rephrase.) | B2 |
| 6. Attribute | In-line where needed: "elevator engineers call it dispatching", "in one maker's design". No maker named except optionally Schindler for the Miconic 10. | A1, B5, C5 |
| 7. Turn it back | "So next time a farther car shows up first, that was the controller's call, and pressing the button again won't change it." (Second half needs E1 ✅, else cut it.) End on frame 0: lobby, YOU, chosen car lit. | A3, E1 |

Length: steps 1–4 and 5–7 run about 50 s; the destination-dispatch twist adds about 10–15 s, which takes it past 60 s (allowed only without licensed music).

## 3D scene list (The Section)

1. **Frame 0, the cut-open tower.** A mid-rise office building sliced front to back, three or four shafts side by side (off-white cut faces, ink edge, hatch on the concrete). Cars at different heights, one with riders. YOU at the lobby call button, a few grey extras waiting. One car lit with an orange outline (the chosen car). The title block shows the question.
2. **The dilemma.** Camera glides up the shafts. Car B (closest) moving toward the lobby with a small marker at the floor where it must stop. Car A higher up with no stops. A detail box shows the call panel (realistic, brushed steel, the down arrow lit; no brand).
3. **The controller.** A realistic controller cabinet in the machine room at the top of the slice (or a rack in the basement). Orange lines run from it to every car and to the lobby button.
4. **What it knows.** Each car gets a small orange tag as it's named: an arrow (direction), stop dots (promised stops), a fill bar (load from the car's weighing). One tag at a time (one idea per frame), or a single detail box.
5. **The scores.** Orange lines from the controller to each car, each with a countdown in seconds (🎭 illustrative values). Car B's number grows when its stop is added, and a ghost line shows the riders inside being delayed. The lowest-scoring car's line thickens and the car lights up.
6. **Re-deciding.** A second call appears on a higher floor. The orange assignment flicks from one car to another, then locks (a small lock or brighter glow) as the chosen car starts braking.
7. **Optional, the 1,024 plans.** Pull back to the whole slice. Many faint orange paths fan out from the controller, and a Counter overlay ticks to 1,024.
8. **Optional twist, destination keypad.** The lobby slice again, with a realistic touchscreen keypad on a pedestal. YOU types a floor; a detail box shows the screen with a car letter (🎭 "C"). Three people heading to nearby floors are drawn into the same car by orange lines; a second car takes another group. Each car's stop markers are fewer.
9. **Payoff and loop.** Glide back down to the lobby: YOU, the button, the chosen car lit, frame 0's picture.

Orange use: only the controller's decision lines, tags and the chosen car's outline. The call-button light and the hall arrow must not be orange (style rule: orange is reserved for the hidden system). Use the button's real white or the theme's non-orange accent.

## Legal flags

| Name | Where | Risk | Why |
| --- | --- | --- | --- |
| Schindler (Miconic 10, PORT; Inventio patent) | C1, C5, A2 | Low | Product history from Schindler's own annual report. Naming it in the voice is allowed only as "the story of its product" (Miconic 10). Don't repeat its percentages. |
| Otis, KONE, Mitsubishi Electric, ThyssenKrupp/TK Elevator | A–C | Low | Patents, product pages, a congress paper. Sources only, **not named in the voice**. A patent is a claimed method, not proof of current product behavior: say "one maker's design". |
| Peters Research (Richard Peters, Rory Smith) | throughout | Low | Independent consultant's congress papers. Cite as "elevator engineers" in the voice if at all. |
| NPR, CBS Boston (via NYT), Newsweek, Designing Buildings Wiki | various | Low | Press and wiki, cited as such. |
| National Elevator Industry Inc. (Karen Penafiel) | E2 | Low | Quoted via CBS. Out of scope. |
