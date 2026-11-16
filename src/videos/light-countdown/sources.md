# Sources: light-countdown (No. 019)

Researcher draft, 2026-11-12. There's no script yet, so the claims follow the owner-approved beat order. **Step 1:** in China, many traffic lights show drivers a countdown, and map apps can count down a red light too. **Step 2:** how the app knows. It may not be connected to the light; it can work the timing out from when cars stop and start at that corner. **Step 3:** why US lights don't count down for drivers: the rule, the studies, and the hardware (actuated signals don't know their own green length). The statuses are my starting confidence. The fact-checker sets the final ones.

Owner-approved angle (2026-11-12): one story in three steps. Hook direction: "In China, your map app can count down a red light, and it might not even be connected to the light." **Read section H (hook check) before scripting. The hook holds with "might" or "doesn't need to be"; it fails as "isn't connected" stated flat.**

Everything was accessed on 2026-11-12. **How to read the quotes** (same rules as `home-heat/sources.md`):

- **(tool)** means the web tool's small model returned the quote from the page. Re-open and re-quote before ✅. **(verbatim)** means I asked for word-for-word text and the tool returned it as exact. Europe PMC abstract quotes came from the API's `abstractText` field and are exact.
- **(snippet)** means I saw it only in a search-result summary and didn't open the page. It's a lead only (🟡 at best).
- **(via review)** means I took the finding from Pan et al. 2023 (claim 20), a peer-reviewed review, and didn't open the original study.
- **Chinese quotes** are given in Chinese, with my English gloss. The gloss is mine, not the source's.
- **🧮** means our own calculation.
- **Couldn't open:** the official MUTCD 11th Edition Part 4 PDF (it downloaded, but no PDF renderer was available, so the 11th-edition section numbers come from an unofficial HTML mirror; the 2009 edition HTML on mutcd.fhwa.dot.gov opened fine and has the same wording); the Federal Register 2009 MUTCD final rule (redirects to a bot check); Taylor & Francis / Informa and ScienceDirect abstract pages (403; I used Europe PMC instead); the Clemson preprint of Fayazi & Vahidi (TLS certificate error) and the core.ac.uk thesis (403); the Audi press release (audi-mediacenter now redirects to a 404); Traffic Technology Today and ITS International (403); SWOV (bot check); PubMed (cookies). **Not found:** any accuracy percentage published by Amap or Baidu; a national figure for how many US signals are actuated; a primary source for the "portable temporary light with no network still gets a countdown" story (one secondary article only); the original Lum & Halim (Singapore) abstract.
- **Politics:** I left out on purpose a 2026 news thread about a government in the region restricting the Amap app over security concerns. It contains one useful technical sentence (an official saying the app's countdown there isn't fed by official data), but the story is political, so it's not a source for this video. Nothing below depends on it.

---

## Re-check of L5: detection types (fact-checker, 2026-11-12)

**Verdict: PASS.** No ❌, no voice change needed. Line: "...because road sensors decide when the green ends, often just seconds before the light changes." Picture will show an in-pavement loop and a pole camera. Legally sensitive: none (no company or person named).

1. **"Road sensors" covers video and radar: ✅ as a plain gloss.** FHWA's Traffic Detector Handbook, Third Edition, Vol. I (FHWA-HRT-06-108, Oct 2006, [fhwa.dot.gov](https://www.fhwa.dot.gov/publications/research/operations/its/06108/), opened 2026-11-12, tool) says it covers "traffic sensors for signalized intersections and freeways", names "inductive loop detectors, magnetic sensors and detectors, video image processors, microwave radar sensors", and says "Sensor types include both in-roadway and over-roadway sensors." Vol. II (FHWA-HRT-06-139, [page](https://www.fhwa.dot.gov/publications/research/operations/its/06139/)) has the same Foreword wording. So loops (in-roadway) and video and radar (over-roadway) are all "traffic sensors" for signals. "Road sensors" is read as "sensors at the road", which includes the pole camera. Caveat: a listener may hear "in the road" only; the picture showing both fixes that. Don't add "in the pavement" or "buried" anywhere. The handbook is from 2006; it lists types and doesn't give a share of US signals using each, so say nothing about "most use cameras".
2. **"Decide when the green ends" for video detection: ✅ with the existing hedges.** All detector types do the same job for an actuated phase: a detector sends vehicle calls to the controller. FHWA Traffic Signal Timing Manual ch. 5 (claim 22, opened earlier): intervals "called and extended in response to vehicle detectors", with no restriction on detector type; the Detector Handbook ch. 4 (opened: [06108/04.cfm](https://www.fhwa.dot.gov/publications/research/operations/its/06108/04.cfm), tool) says "When a vehicle passes over the loop, a call is output by the electronics unit to the controller", the loop version of that same call. I did not open a page saying in as many words that video and radar detectors call and extend greens; that rests on the Timing Manual's type-neutral "vehicle detectors" (🟡 inference, a safe one). The earlier caveat still stands: a green can also end by reaching maximum green, so "decide" is fair but not exclusive, and "often just seconds" is Hurwitz's one-to-four-seconds statement (OSU 2017; claim 23), not a detector-specific finding.
3. **Description:** add the Detector Handbook (Vol. I) and the Timing Manual ch. 5 as sources for the L5 sensors claim.
4. **Not used:** a search summary mentioning Wisconsin DOT and FHWA Traffic Monitoring Guide text on video and radar detection (snippets only, not opened). Lead only.

---

## Re-check of script v6, L7-L14 (fact-checker, 2026-11-12)

**Verdict: PASS.** No ❌, no REQUIRED fixes. No new pages opened; rulings rest on quotes already re-opened below (Amap patent CN114463969A, Sina 2024, Jimu 2026, arXiv 2507.14190v1, OSU release, MUTCD-independent). Legally sensitive: none named in the voice ("a map app", "the app's maker"); the description must still attribute the no-connection claim to Amap.

| Line | Status | Ruling |
| --- | --- | --- |
| L7 "Instead, the app can learn the timing from the cars." | ✅ as hedged | "Can" carries it (Amap 2026 also lists historical data and a "visual" model, so no "only"). "Instead" follows L6's "without needing a connection", which is Amap's own claim; Amap also runs police pilots, so "needing" (L6) is the load-bearing word, not L7. Keep. |
| L8 "When the light turns green, the waiting cars start to move." | ✅ | Plain traffic fact. Dropping "one after another" removes the "together" risk; no claim about spacing. Keep. |
| L9 "The app sees that moment on the phones of drivers using it." | ✅ | Sina 2024 (exact): uses whether Amap users at the intersection are moving or waiting, "including stop and start times". "Drivers using it" is the right scope. |
| L10 "Over many days, those starts repeat with the same gap, and that gap is the light's cycle." | ✅ for lights that repeat | Patent: multi-day trajectories, "a unique period in the quantity distribution information"; BMW patent: green starts are an integer multiple of the cycle time. "Same gap" is true only for steady lights, and L13-L14 scope it. Flat, but not misleading in sequence. **Optional (not required):** "...repeat with the same gap on a steady light, ..." only if the owner wants the scope earlier; it costs about 3 words. |
| L11 "Once it knows the gap, the app can count down to the next green." | ✅ as hedged | "Can" carries the patent-vs-product difference. Keep. |
| L12 (unchanged) | ✅ number / 🟡 preprint | Same ruling as v3: "a similar method" now has a clear antecedent in L7-L11. Preprint, metric unnamed in the abstract; keep "timing estimates". |
| L13 "Both kinds of countdown work best on lights that keep a steady schedule." | 🟡 → ✅ as worded | OSU (Hurwitz): timers "work well at fixed-time signals", "may not be practical for actuated"; Nanjing expert: fixed timing easier and more accurate for the app. "Both kinds" = a countdown on the light (L1) and the app's (L6). Comparative "work best" is the right strength; don't change to "only work". Cite OSU and Nanjing in the description. |
| L14 "Many US lights don't, because they wait for your car." | 🟡 | "Don't" = don't keep a steady schedule. "Many" is a hedge (no national share; never "most"). "Wait for your car" is a plain gloss of actuated control (FHWA: phases "called and extended in response to vehicle detectors"). Keep; don't add "can't". |

**Required fixes: none.** Optional: L10 scope phrase above. Do not add "always" or "every" anywhere in L8-L11.

---

## Re-check of script v4 (fact-checker, 2026-11-12)

**Verdict: PASS.** No ❌, no required fixes. One recommended one-word fix (L7). L5 and L6 match my earlier rulings exactly. No new pages opened; rulings rest on quotes already re-opened above (MUTCD 2009 §4D.26 ¶16-17, Sina 2024, Amap patent, OSU release, Pan et al. 2023). Legally sensitive: none named in the voice ("a map app", "the app's maker"); the description must still attribute the no-connection claim to Amap.

| Line | Status | Ruling / exact fix |
| --- | --- | --- |
| L3 "US rules count a countdown on a green light as a warning ..." | ✅ (slight gloss) | §4D.26 ¶16 lists "vehicular countdown displays" among "pre-yellow warning" displays. The manual doesn't say "green"; a countdown on the green phase is the only one that warns of the yellow, so the gloss is right. Keep. |
| L4 "The rulebook says research found warnings like that increase crashes, though studies ... disagree" | ✅ attributed | ¶17 (exact): "found by research to increase the frequency of crashes". "The rulebook says" keeps it the manual's claim (it cites no study). Pan et al. 2023 for "disagree". Don't add "countdowns cause crashes". |
| L7 "Instead, the app works out the timing from the cars at that corner." | 🟡 → ✅ hedged | Flat. Amap's 2026 statement adds historical data and a "visual" model, and Amap has police pilots, so "Instead" and "works out ... from the cars" are broader than the sources. **Fix (recommended): "Instead, the app can work out the timing from the cars at that corner."** |
| L9 "Some of those drivers are running the app, so it sees the moment their phones start to move." | ✅ | Sina 2024 (exact): uses whether Amap users at the intersection are moving or waiting, "including stop and start times". "Some" is the right scope. |
| L10 "Those moments come in bursts, one for every green." | ✅ / 🟡 loose | Patent: first car starts, others at small offsets, per cycle. "One for every green" assumes an app user in the queue; fine as a plain picture. Optional: "one for each green". |
| L11 "...learns the gap between the bursts, which is the light's cycle." | ✅ for lights that repeat | Patent: multi-day data, "a unique period in the quantity distribution"; BMW patent: green starts are an integer multiple of the cycle. Scoped by L15-16. "Learns" fine. |
| L15 "Either kind of countdown works best on a light that repeats on a schedule." | 🟡 → ✅ as worded | OSU (Hurwitz): timers "work well at fixed-time signals", "may not be practical for actuated"; Nanjing expert: fixed timing easier and more accurate for the app. "Works best" is the comparative reading; keep, don't change to "only works". Cite OSU and Nanjing in the description. |
| L16 "And many US lights don't, because they wait for your car." | 🟡 | "Many" is a hedge (no national share; never "most"). "Wait for your car" is a plain gloss of actuated control (FHWA: phases "called and extended in response to vehicle detectors"; also pedestrians). Keep; don't add "can't". |

---

## FACT-CHECK of script v3 (fact-checker, 2026-11-12)

**Verdict: FAIL (no ❌ claims, one required wording fix: L5 "couldn't").** Four more are recommended (L5 "decide", L6 attribution, L11 "can", L13 scope note). Re-opened this session: ScienceDaily / Oregon State release 2017-10-31 (twice, to get the exact words and who is quoted) and the official 2009 FHWA MUTCD Part 4D HTML (§4D.26 ¶16-17, exact, again). Other quotes rest on the v1 re-opening (patent, arXiv, Sina, Pan et al., Nanjing expert), not re-fetched.

**What the Oregon State release says (tool, re-opened; the three phrases are quoted from the page):** David Hurwitz, OSU College of Engineering, corresponding author of the study, is the person quoted. Countdown timers "work well at fixed-time signals" (the release notes fixed-time is recommended where speeds are low and pedestrian traffic heavy), but "they may not be practical for actuated signals", because "a light typically changes only one to four seconds after the decision to change it is made", which leaves "not enough time for a countdown timer to be of value". It is one researcher's statement in a university release about a simulator study of a green countdown. It isn't a measured finding of that study, and it doesn't define "actuated" or say "sensors".

**Required fix (1):**

- **L5** "And many US lights couldn't count down anyway, because road sensors decide when the green ends." "Couldn't" is an absolute the source doesn't give: Hurwitz says "may not be practical". Two things in the file also cut against "couldn't": Audi's in-car countdown in Las Vegas (GovTech, claim 13) and the EnLighten app (claim 13; IEEE Spectrum: "Some lights are harder to predict than others") both show countdowns at lights with real-time signal feeds or probabilities. Your fallback is right. Use **"And many US lights would struggle to count down anyway, because road sensors help decide when the green ends."** "Would struggle to" matches "may not be practical" (🟡 → ✅ as hedged). Two small reasons for "help decide" (recommended, same length): sensors feed the controller (FHWA Traffic Signal Timing Manual ch. 5: phases "called and extended in response to vehicle detectors"), and a phase can also end by reaching its maximum green ("max out"), not only by a gap in cars. "Many" stays a hedge (no national share; never "most"). "Road sensors" is a fair gloss (loops, cameras, radar); don't say "in the road" if the picture shows cameras.

**Recommended fixes:**

- **L6** "Researchers say that decision often comes just one to four seconds before the light changes." The number and direction are right: the source's "changes only one to four seconds after the decision" is the same as "the decision comes one to four seconds before the change". **"Often" is fair, and safer than the source's "typically"** (a weaker claim), so keep it. The attribution is the weak part: the speaker is one Oregon State researcher, not "researchers" (plural), in a 2017 release, and it's his statement, not a finding. 🟡. Fix (same length): **"An Oregon State researcher says that decision typically comes just one to four seconds before the light changes."** (or "One researcher says that decision often comes ..."). Naming a university as the source of a quote is attribution, not a company citation. If the plural stays, the description must name Oregon State and Hurwitz and say it is a statement. Don't use "found" or "studies show".
- **L11** "Once it knows that rhythm, the app counts down to the next green." Flat statement of the patent/2024 mechanism, with no "can" now that v2's hedge is gone. Amap's own description (Sina 2024, Sohu 2024: past stop-and-go patterns; patent: period in the start-time distribution) supports it. But Amap's 2026 statement adds historical data, real-time flow and a "visual" model, and L7 attributes only the no-connection claim. 🟡. Fix (one word): **"Once it knows that rhythm, the app can count down to the next green."**
- **L13** see the table; add the OSU quote to the description list. Fine as written.

**"timing" in L12: it can go, but I'd keep it.** It saves about 0.3 s. Facts: the abstract's "more than 75% of estimations ... less than five seconds of error" doesn't name a metric (body: 82.7% cycle length, 76.4% phase, online, tool's reading), so "timing estimates" is already a loose label. Without "timing", "estimates" has no object, and a listener will hear it as the app's countdown accuracy, which nobody has published (not found for Amap or Baidu). So the word does real scoping work. If you need seconds, cut elsewhere (below). Also keep "a similar method", "one research team" and "about 10,000" (✅: 10,000 online, "over 10,000" offline). Still 🟡 (preprint, not peer reviewed; tested estimating light timing, not the countdown drivers see). If it is voiced "In a preprint," it's optional.

**Trim options to reach about 70 s (v3 is about 222 words; at about 3 words a second that's about 74 s of speech plus pauses, so about 77 s).** Aim to cut about 18-20 words, all fact-safe:

- **Cut L3** "US rules keep countdowns off the lights drivers watch." (9 words, about 3 s). It repeats L1 ("in the US, that's not allowed"). L2 "so why not here?" then goes straight to L4 "The rulebook says...", which answers it. "Rulebook" has a clear antecedent in L1's "not allowed" and L2's question. Nothing later depends on L3. Safest cut.
- **Cut or merge L8** into L9 (14 words, about 4 s): "When a light turns green, phones in the waiting cars start moving one after another, and the app notices." Keep "one after another" (patent: first car, then the other starts at offsets). Check this with the director; it may lose a beat.
- **Don't cut** L2 (the pivot), L12 (the credibility number), or L4's "though studies of countdowns disagree" (the fairness balance for the manual's crash claim).
- L3 cut + L8/L9 merge is about 7 s, so about 70 s.

**Legally sensitive:** none named in the voice (a map app, its maker, one research team). If L6 names "Oregon State", it's a university and a quote, attributed; description-only risk as before (Amap/Alibaba product claim, preprint authors' employers, FHWA).

### Addendum: owner's v3 edits (L6 merged into L5, L7 opens "Meanwhile")

- **Merged L5** "And many US lights couldn't count down anyway, because road sensors decide when the green ends, often just seconds before it changes." **Still FAIL on "couldn't"** (same required fix as above). "Often just seconds before it changes" is fair for OSU's "typically ... only one to four seconds after the decision": "often" is weaker than "typically", and "just seconds" (not a number) is a loose but true gloss of one to four. 🟡 only because the line is now unattributed narrator voice for one researcher's statement (Hurwitz, OSU 2017 release). That's acceptable with the hedges; the description must cite the release. Exact wording: **"And many US lights would struggle to count down anyway, because road sensors help decide when the green ends, often just seconds before it changes."** Optional attribution if wanted: "..., an Oregon State researcher says." Don't add the number "one to four" unattributed, and don't swap "often" for "always".
- **L7** "Meanwhile in China, a map app can even count down a red light without needing a connection to it, its maker says." ✅ No new claim; "Meanwhile" is only a transition (no simultaneity claim that matters). Attribution "its maker says" kept. Sources as in the table above.
- Cutting L6 removes the plural "Researchers say" problem. Timing: that cut saves about 4 s of the roughly 7 s needed; L3 cut alone would reach about 70 s.

### Line table (script v3)

| Line | Claim | Status | Fix / note |
| --- | --- | --- | --- |
| L1 | In China, many traffic lights count down for drivers | ✅ | Pan et al. 2023 "widely used in China"; "many" right. |
| L1 | In the US, that's not allowed | ✅ | MUTCD §4D.06 ¶02 (2009 official, exact): "Letters or numbers (including those associated with countdown displays) shall not be displayed ... as part of a vehicular signal indication." "That" = countdown for drivers (set by "for drivers"). |
| L2 | A countdown sounds helpful, so why not here? | ✅ framing | No claim beyond L1. |
| L3 | US rules keep countdowns off the lights drivers watch | ✅ | §4D.06 ¶02 and §4D.26 ¶16 ("vehicular countdown displays ... shall not be used at a signalized location", re-opened this session, exact). Repeats L1; first trim candidate. |
| L4 | The rulebook says research found warnings before the yellow increase crashes | ✅ attributed | §4D.26 ¶17 (re-opened, exact): "signal displays ... that convey a 'pre-yellow warning' have been found by research to increase the frequency of crashes." "Warnings before the yellow" = "pre-yellow warning"; "the rulebook says" keeps it the manual's claim. The manual cites no study. Do not add "countdowns cause crashes". |
| L4 | ...though studies of countdowns disagree | ✅ | Pan et al. 2023 (v1, exact): "The conclusions of the extant literature reasonably vary"; "no studies have used the number of traffic collisions or collision rate." Chiou & Chang 2010 and Long et al. 2011 show both directions. |
| L5 | Many US lights couldn't count down anyway | ❌-risk → required fix (🟡) | Source says "may not be practical". **"would struggle to count down anyway."** "Many" 🟡 hedge (no share). |
| L5 | ...because road sensors decide when the green ends | 🟡 | FHWA: phases "called and extended in response to vehicle detectors"; max-out also ends a green. **"help decide."** |
| L6 | Researchers say that decision often comes just one to four seconds before the light changes | ✅ number / 🟡 attribution | OSU release (re-opened): "a light typically changes only one to four seconds after the decision to change it is made." One researcher (Hurwitz), a statement not a finding. "Often" ≤ "typically", fair. **"An Oregon State researcher says ... typically ..."** |
| L7 | In China, a map app can even count down a red light | ✅ | Amap since 2022-05 (Jimu); Baidu Maps too (claim 5). |
| L7 | ...without needing a connection to it, its maker says | ✅ attributed | Amap: "不依赖信号灯硬件接入"; "并不是接入了交警的信号灯数据" (Jimu, v1 exact). City pilots exist (Sina), so "needing" is right. |
| L8 | Every time a light turns green, the waiting cars start moving, one after another | ✅ | Patent CN114463969A: first-started vehicle, then "offset duration of the starting time of other sample vehicles". Plain traffic fact; "every time" is a loose everyday gloss, fine. |
| L9 | The app notices the moment phones running it start moving at that corner | ✅ | Sina 2024 (Amap, exact): uses "是行驶还是等待的状态，包括启停时间" (moving or waiting, including stop and start times) of many Amap users at the intersection. Patent: trajectory data of vehicles waiting at the light. Present tense is Amap's own description; scope fine (no "only"). |
| L10 | Over many days, those start times line up in a repeating rhythm, which is the light's cycle | ✅ (patent) for fixed-cycle lights | Patent: multi-day trajectories, "a unique period in the quantity distribution information"; BMW patent: "the time between the starts of greens of a phase must be an integer multiple of the cycle time"; arXiv "semi-fixed cycles". Holds for lights that repeat; L13 scopes it. "Line up" is a fair plain gloss of the start-offset distribution piling at the period. |
| L11 | Once it knows that rhythm, the app counts down to the next green | 🟡 | Amap 2024 and patent ✅; the 2026 description adds more inputs. **"can count down".** |
| L12 | One research team tested a similar method at about 10,000 intersections in China | ✅ number / 🟡 preprint | arXiv 2507.14190v1: "10,000 randomly sampled intersections across mainland China" (online); "over 10,000" offline. "Similar method" correct (different team). |
| L12 | ...more than three in four timing estimates were within five seconds | ✅ as the abstract words it / 🟡 | Abstract (exact): "more than 75% of estimations demonstrating less than five seconds of error." Metric unnamed. Keep "timing" (scopes what is estimated); it can go, saving about 0.3 s, but then the line reads as countdown accuracy. |
| L13 | Counting down works best on lights that repeat on a schedule | ✅ attributed in the description / 🟡 as unattributed voice | OSU (re-opened): timers "work well at fixed-time signals"; Nanjing expert: fixed-phase timing "更容易估算，准确度也会更高" (v1); Fayazi "fixed-time"; arXiv "semi-fixed cycles". Direct support for "works well at"; "best" is the comparative reading with "may not be practical" for actuated. Upgrades my v1 "easiest" concern: with the OSU line, "works best" is fair. |
| L13 | ...and a light that waits for your car doesn't | 🟡 | "Doesn't" = doesn't repeat on a schedule and so isn't suited to a countdown. Absolute only if heard as "never". In-car services still predict some such lights with probabilities (GovTech/Audi, EnLighten). Acceptable as a contrast sentence; don't add "can't". |
| L14 | Do the lights near you wait for your car, or run on a timer? | ✅ | Question; pre-timed and actuated both exist (FHWA). |

---

## Re-check of script v2 (fact-checker, 2026-11-12)

**Verdict: PASS.** No ❌, no required fixes. v1's required fixes (L4, L10) and recommended fixes (L3, L5, L6, L8, L11 first half, L13) are applied and match the wordings above. Two optional wording rulings below. No new sources opened; the rulings rest on the quotes already re-opened in the v1 section. Legally sensitive: none (no company or person named in the voice).

| Line | Status | Ruling |
| --- | --- | --- |
| L1 "in the US, that's not allowed" | ✅ | "That" = countdowns on lights drivers watch; MUTCD §4D.06 ¶02 (2009 official, exact). Scope is set by "for drivers". Keep. |
| L5 "which is how the app can count down" | 🟡 → ✅ as hedged | Patent mechanism; "can" carries it. Keep. |
| L7 "it's the walk signals that count down" | ✅ | §4E.07 ¶01. No "only". Keep. |
| L8 "national manual ... keeps countdowns off the lights drivers watch" | ✅ | §4D.06 ¶02, §4D.26 ¶16. Keep. |
| L9 green countdown = warning; research found warnings increase crashes | ✅ attributed | §4D.26 ¶16 lists "vehicular countdown displays" among "pre-yellow warning" displays; ¶17: "found by research to increase the frequency of crashes". "Says" keeps it the manual's claim, not ours. The manual cites no study, and L10 correctly follows with "mixed". Keep both lines in that order. |
| L10 "Studies of countdowns are mixed, though." | ✅ | Pan et al. 2023 (exact). Placement before the examples works. |
| L11a "Some drivers went through the yellow faster at a green countdown" | 🟡 | Still via Pan et al. 2023 (Ma et al. 2010, original unopened). Wording matches the source's scope. Fine unattributed; "studies" is implied by L10. |
| L11b "a red countdown got cars moving sooner at green" | ✅ facts / 🟡 wording | Chiou & Chang 2010: RSCD "reduces start-up delay". But "sooner" can be heard as "before the green", the early-start myth (Greece 24%, Long et al.), and the effect faded. **Fix (recommended):** "while a red countdown got cars moving faster once the light turned green." |
| L12 "the app's guess" | 🟡 | The method is explained in L4-5, so my hook-check condition is met and "guess" is allowed. But Amap calls it calculation and prediction, and L6 says "timing estimates". **Fix (recommended):** "...and the app's estimate is too." Also reads more cleanly after L6. |

**Optional:** L12 "easiest on a light that repeats" stays 🟡 (inference from the Nanjing expert and OSU 1-4 s, not a measured result); "easiest" is the right hedge. L13 "Many" stays a hedge, never "most".

---

## FACT-CHECK of script v1 (fact-checker, 2026-11-12)

**Verdict: FAIL (no ❌ claims, but two wording fixes are required before voice: L4 and L10). Six more are recommended: L3, L5, L6, L8, L11, L13.** Everything below was re-opened on 2026-11-12. "(re-quoted)" means the page-fetch tool's small model returned the text, so it is exact only where I say "exact". **Official 2023 PDF: not confirmed.** `mutcd.fhwa.dot.gov/pdfs/11th_Edition/part4.pdf` and the Indiana Part 4 PDF both came back as compressed binary, and no PDF renderer (pdftoppm) is installed here. What I did open: the official 2009 FHWA HTML (§4D.06 ¶02, §4D.26 ¶16–17, §4E.07, all re-quoted) and the unofficial 11th-edition mirror (§4E.01 ¶02, §4F.17 ¶14–15, re-quoted). The 2023 section numbers (4E.01, 4F.17, 4I.04) therefore rest on the mirror, which says it mirrors Revision 1. A search summary says Revision 1 took effect 2026-03-05 (not opened). Someone with a PDF reader should confirm the three numbers before they go in the description. The voice never says a section number, so this blocks nothing.

**Legally sensitive:** none of the voice lines names a company or person ("a map app", "its maker", "one research team"). Description-only risk: Amap/Alibaba (a product claim, attributed to Amap), the preprint's authors (NavInfo, Autohome, Baidu staff), FHWA/MUTCD (government, no risk beyond accuracy). Don't name Amap in the voice unless the story is its product, and then keep "its maker says".

**Required fixes (exact replacement wording):**

1. **L4** "Look at the cars waiting at this red, which all pull away together when it turns green." Queued cars don't move together. The Amap patent (re-quoted, CN114463969A) finds "the starting vehicle that is first started" and then measures "the offset duration of the starting time of other sample vehicles", i.e. the starts are staggered, and the pattern is in the offsets. "All pull away together" is unsourced and contradicts the mechanism the next line relies on. Replace with: **"Look at the cars waiting at this red, which pull away one after another when it turns green."** (Shorter alternative: "...which start moving as soon as it turns green.") The picture then matches the patent: a first car, then the rest at small offsets.
2. **L10** "It says warnings like that have been found by research to increase crashes." The manual's Support sentence is about "pre-yellow warning" displays. §4D.26 ¶17 (2009 official HTML, re-quoted exact): "The use of signal displays (other than warning beacons mounted on advance warning signs) that convey a "pre-yellow warning" have been found by research to increase the frequency of crashes." ¶16 lists "flashing green signal indications, vehicular countdown displays, or other similar displays". After L9 ("keeps countdowns off the lights drivers watch"), "warnings like that" reads as all countdowns, but a red countdown isn't a warning that the green is ending, and L11 then credits a red countdown with a benefit. The scope also needs "the manual says" attribution kept. Replace with: **"For the green, it says warnings that the light is about to change have been found by research to increase crashes."** (Shorter: "It says warnings that a green is ending have been found by research to increase crashes.") Do not add "countdowns cause crashes": Pan et al. 2023 (re-quoted, exact) says "no studies have used the number of traffic collisions or collision rate." L12 ("the evidence on countdowns is mixed") is the right follow-up and must stay.

**Recommended fixes:**

- **L3** "...count down a red light without being connected to it, its maker says." ✅ attributed. Amap's words are "不依赖信号灯硬件接入" (doesn't depend on a hardware connection) and "并不是接入了交警的信号灯数据" (not plugged into the traffic police's signal data), both re-quoted (exact) from the Jimu piece. But Amap also runs pilots with traffic police (Sina, claim 6), and Baidu uses both routes. "Without being connected" reads as "never connected". Safer, same length: **"...a map app can even count down a red light without needing a connection to it, its maker says."**
- **L5** "Over many days, those starts repeat on the light's cycle, and the app counts down to the next green." The mechanism is ✅ in the patent (multi-day trajectories, "a preset period mining algorithm" over the offset distribution), but it's a patent, and Amap's 2026 description (re-quoted) says the product combines "历史交通数据、实时车流信息与路口信号规律" (historical data, real-time flow, signal patterns) in an AI model. The script states the patent as how the app works. 🟡. Hedged wording, same length: **"Over many days, those starts repeat on the light's cycle, which is how the app can count down to the next green."** ("Can" carries it; or "its patent describes" if there's room.)
- **L6** "One research team tested this at about 10,000 Chinese intersections, and more than three in four estimates were within five seconds." ✅ numbers, 🟡 as voiced. Opened arXiv 2507.14190v1 (re-quoted): the abstract says "more than 75% of estimations demonstrating less than five seconds of error" and doesn't say which quantity. The body's online results are 82.7% (cycle length) and 76.4% (signal phase) within 5 s (the tool's reading; the paper never ties the abstract line to either), at "10,000 randomly sampled intersections across mainland China". Offline: "over 10,000 intersections" (Beijing 5,241, Shanghai 2,987, Shenzhen 2,076). Two issues. (a) "tested this" implies Amap's own method; the paper's method is the same idea (stop-to-start moments, multi-day stacking, FFT) but from a different team's navigation platform. (b) It's a preprint (not peer reviewed), and it tested estimating the light's timing, not the countdown shown to drivers. Replace with: **"One research team tested a similar method at about 10,000 Chinese intersections, and more than three in four estimates were within five seconds."** Keep "one research team"; "in a preprint" is optional. 🟡 is right; don't upgrade.
- **L8** "Back in the US, only walk signals count down." The MUTCD side is ✅ (§4E.07 ¶01 official 2009, re-quoted: "pedestrian change interval is more than 7 seconds" requires a countdown display), but "only" is an absolute: some US cars show a countdown on the dashboard (ScienceDaily/Oregon State, re-quoted: "the onboard clocks are allowed in the U.S."; GovTech on Audi, claim 13), and I found no source ruling out every other signal type (bike signals, rail or transit signals, local exceptions). The script's scope "the lights drivers watch" (L9) is right; L8 isn't scoped. Replace with: **"Back in the US, it's the walk signals that count down."** (Or "On US streets, walk signals count down." Either way, no "only".) Note also that §4E.07 ¶06 (re-quoted) says the countdown runs only during the flashing hand, "shall not be used during the walk interval", so don't show it counting during the walking person.
- **L11** "In studies, some drivers sped up to beat a green countdown, and a red one got cars moving faster at green." Second half ✅: Chiou & Chang 2010 (Europe PMC, re-quoted exact): "RSCD effectively reduces start-up delay, saturated headway, and cumulative start-up delay". Note the same abstract says the early-start effect faded ("the ratios soon return to their before-RSCD levels"), so don't add "and it was safe". First half 🟡 as seen only via Pan et al. 2023 (re-quoted exact): Ma et al. 2010 found "GSCD encouraged motorists to pass the stop-line during the amber time with greater speed." That is passing through the yellow faster, and "encouraged", not "to beat" (a motive). I could not open the original (Ma, Liu & Yang, *Journal of Transportation Engineering* 136(11): 1049–55, 2010, per search metadata; the ASCE page wasn't opened). Replace with: **"In studies, drivers went through the yellow faster at a green countdown, and a red one got cars moving faster at green."** (Same length, source's scope.) Fix claim 19's citation too: it lists no venue for Ma et al. 2010.
- **L13** "...like the phone trick, a countdown works best on a light that repeats on a schedule." 🟡 inference: the Nanjing expert says fixed-phase timing is "更容易估算，准确度也会更高" (easier to estimate, more accurate; re-quoted, claim 10), and Oregon State says an actuated light changes "only one to four seconds after the decision to change it is made". No source says a countdown "works best" on fixed lights. Replace with: **"There's a practical side too, because like the phone trick, a countdown is easiest on a light that repeats on a schedule."**

**Safe trims (script runs about 82 s; target about 75 s; about 240 words, so roughly 3 words per second):**

- **Trim A (safest, about 4.5 s):** cut L7, "Busier corners do better, because more cars give the app more to learn from." No later line depends on it; L13–L14 carry the repeat/learn idea on their own. If it stays, use "Busier corners tend to do better" (see the line table).
- **Trim B (about 3 s):** shorten L13 to **"Like the phone trick, a countdown is easiest on a light that repeats on a schedule."** (drops "There's a practical side too, because"). The L12 → L13 hand-off still works.
- **Trim C (about 2 s):** shorten L11 to **"In studies, drivers went through the yellow faster at a green countdown, and a red one got cars moving faster."**
- **Not recommended:** cutting L2 (the question is the pivot into L3), L12 (the fairness line that makes L10 safe), or L6 (the credibility number). A + B + C is about 9.5 s, so about 72 s; A + B alone is about 7.5 s, so about 74.5 s.

### Line by line

| Line | Claim | Status | Fix |
| --- | --- | --- | --- |
| L1 | In China, many traffic lights count down for drivers | ✅ | Pan et al. 2023 (re-quoted exact): "countdown signal lights are widely used in China"; the review says common in big cities "though not at every intersection". "Many" is right; no share exists. |
| L1 | In the US, they're not allowed to | ✅ (with "for drivers") | MUTCD §4D.06 ¶02 (2009 official, re-quoted exact): "Letters or numbers (including those associated with countdown displays) shall not be displayed" ... "as part of a vehicular signal indication." 11th ed. §4E.01 ¶02 same (mirror). "Not allowed" is right ("illegal" would be loose). The MUTCD is the federal standard that states adopt, some with edits; "the US" is fine as a plain gloss. |
| L2 | A countdown sounds helpful, so why doesn't the US allow it? | 🟡 framing | No claim beyond L1. No survey says drivers find it helpful, but "sounds helpful" doesn't assert one. Fine. |
| L3 | A map app in China can count down a red light | ✅ | Amap since 2022-05 (Jimu, re-quoted exact: "高德于2022年5月推出"); about 500,000 intersections; Baidu Maps too (claim 5). |
| L3 | ...without being connected to it, its maker says | ✅ attributed / 🟡 wording | Amap: "不依赖信号灯硬件接入"; "并不是接入了交警的信号灯数据". **Fix:** "without needing a connection to it". Amap runs police pilots; the split is undisclosed. |
| L4 | Cars waiting at a red all pull away together | 🟡 → required fix | Patent: first car, then offsets of the others. **Required:** "...pull away one after another when it turns green." |
| L5 | Over many days, those starts repeat on the light's cycle | ✅ (patent) | CN114463969A (re-quoted): multi-day trajectories, "a unique period in the quantity distribution information", DFT as an example. Needs a fixed-cycle light (L13). |
| L5 | ...and the app counts down to the next green | 🟡 | Patent ≠ the shipped product (2026 description adds historical data, real-time flow, a "visual" model). **Fix:** "which is how the app can count down to the next green." |
| L6 | One research team tested this at about 10,000 Chinese intersections | ✅ number / 🟡 "this" | arXiv: "road tests at 10,000 randomly sampled intersections across mainland China"; offline "over 10,000" in three cities. Different team and platform. **Fix:** "a similar method". Preprint, not peer reviewed. |
| L6 | More than three in four estimates within five seconds | ✅ as the abstract words it / 🟡 | Abstract (re-quoted exact): "more than 75% of estimations demonstrating less than five seconds of error". Metric not named in the abstract; body 82.7% cycle length, 76.4% phase (online). Say "estimates", not "countdowns". Attribution "one research team" correct. |
| L7 | Busier corners do better | ✅ | Sina 2024-02-02 (re-quoted exact): "这个路口车流量越多，红绿灯的倒计时读秒也就会越准确。"; The Paper/Nanjing expert (claim 10): denser data at busier intersections, less precise at quiet ones. The arXiv paper doesn't state it (re-checked: no volume claim), though its tables show higher accuracy at rush hour. "Tend to do better" is safer. |
| L7 | ...because more cars give the app more to learn from | ✅ | Same sources: "数据密度更高，算法估算的精度也更高" (denser data, better estimates). Expert and reporter statements, not a measured study; fine unattributed as a plain mechanism. |
| L8 | Only walk signals count down (US) | 🟡 | Walk signals ✅ (§4E.07 ¶01). "Only" overreaches (dashboards; other signals unchecked). **Fix:** "it's the walk signals that count down." |
| L9 | The US signal manual keeps countdowns off the lights drivers watch | ✅ | §4D.06 ¶02 and §4D.26 ¶16 ("vehicular countdown displays ... shall not be used at a signalized location", re-quoted exact). 11th ed.: §4E.01 ¶02, §4F.17 ¶14 (mirror). Official 2023 PDF not readable here. |
| L10 | It says warnings like that have been found by research to increase crashes | 🟡 → required fix | Support sentence is about "pre-yellow warning" displays (§4D.26 ¶17; 11th ed. §4F.17 ¶15, mirror, re-quoted: "have been found by research to increase the frequency of crashes"). The manual cites no study. **Required:** "For the green, it says warnings that the light is about to change have been found by research to increase crashes." |
| L11 | Some drivers sped up to beat a green countdown | 🟡 | Via Pan et al. 2023 only (Ma et al. 2010: passed the stop line "during the amber time with greater speed"). **Fix:** "went through the yellow faster at a green countdown". |
| L11 | A red countdown got cars moving faster at green | ✅ | Chiou & Chang 2010 (Europe PMC, re-quoted exact): RSCD "effectively reduces start-up delay, saturated headway, and cumulative start-up delay". Early-start effect faded; not claimed. |
| L12 | The evidence on countdowns is mixed | ✅ | Pan et al. 2023 (re-quoted): "The conclusions of the extant literature reasonably vary"; "no studies have used the number of traffic collisions or collision rate." Keep it; it balances L10. |
| L13 | A countdown works best on a light that repeats on a schedule | 🟡 inference | Nanjing expert (fixed timing "更容易估算"), Fayazi "fixed-time", OSU 1–4 s. **Fix:** "is easiest on". |
| L13 | ...like the phone trick | ✅ | arXiv "semi-fixed cycles"; Fayazi 2015 "for fixed-time traffic lights"; Amap patent needs a repeating period. |
| L14 | Many American lights change on demand, with road sensors that stretch the green while cars keep coming | ✅ mechanism / 🟡 "many" | FHWA Traffic Signal Timing Manual ch. 5 (re-quoted): "actuated control consists of intervals that are called and extended in response to vehicle detectors"; "Modern traffic signal controllers do not explicitly support signal timing for pre-timed operation" and are "designed for actuated operation". The page gives no share (re-checked). I found no national share either; a search summary hints at roughly 80,000 fully or semi actuated of 330,000+ signals, from mismatched sources, unopened, don't use. "Many" is a hedge, not a number; keep it, never "most". "Sensors" is safe (loops, cameras and radar all exist). |
| L15 | Do the lights near you run on a timer, or wait for your car? | ✅ | Question, no claim. Both exist (pre-timed vs actuated, FHWA). |

**Also verified or corrected in the entries above:**

- Claim 8 (arXiv): add that the abstract's 75% is not tied to a metric; body online figures are 82.7% cycle length and 76.4% phase (tool's reading). The existing note "10,000 intersections across mainland China" matches the paper's "10,000 randomly sampled intersections".
- Claim 19: Ma, Liu & Yang 2010 is *Journal of Transportation Engineering* 136(11): 1049–55 (search metadata, ASCE DOI 10.1061/(ASCE)TE.1943-5436.0000181; abstract not opened).
- Claim 14 and 15 (11th ed.): section numbers 4E.01 ¶02 and 4F.17 ¶14/¶15 re-confirmed on the mirror this session; 4I.04 was not re-opened (the script doesn't need the 7-second number). Official PDF still unconfirmed (see the header of this section).

---

## H. Hook check: "In China, your map app can count down a red light, and it might not even be connected to the light."

| Part | Evidence | Status |
| --- | --- | --- |
| "In China ... map app can count down a red light" | Amap launched its traffic-light countdown in May 2022 (Jimu News 2026-05-20, claim 3); it now covers about 500,000 intersections in mainland China, Hong Kong, Macau and Taiwan (Amap via Jimu). Baidu Maps has one too (claim 5). | ✅ |
| "your map app" | A US viewer's map app (Google, Apple, Waze) doesn't do this. Amap itself claims that "海外主流导航产品均未提供大规模的信号灯精确倒计时服务" (mainstream overseas navigation products offer no large-scale precise countdown; Amap's claim via Jimu, claim 3). Say "a map app in China" or "drivers' map apps in China". If "your" stays, it has to be the role pattern ("Drive in China, and your map app..."). | 🟡 wording |
| "...might not even be connected to the light" | Amap: the countdown "不依赖信号灯硬件接入" (doesn't depend on a hardware connection to the signal) and "并不是接入了交警的信号灯数据" (isn't plugged into traffic police signal data) (Jimu, claim 3). Amap also says signal-system data is "not necessary" but improves coverage and accuracy, and it runs pilots with traffic police in several cities (claim 6). Baidu uses **both** routes (claim 5). Neither company says how the two split ("均未披露，这两种数据的具体占比", Sina/IT Times, claim 6). | ✅ with "might" / "doesn't need to be" / "doesn't have to be". ❌ as "isn't connected" stated flat for every light |
| What it uses instead | Amap's patent: trajectory data of sample vehicles waiting at the light, the offsets of their start times, and the period that shows up in those offsets (CN114463969A, claim 7). Amap 2024: "过往车主的行驶启停规律" (past drivers' stop-and-go patterns). Amap 2026: an AI model over historical traffic data, real-time flow and "路口信号规律", plus a "visual" spatio-temporal model (claim 3). | ✅ for "when cars stop and start". 🟡 for "**only** from phones": the 2026 description adds historical data and a "visual" model whose input isn't explained |

**Verdict:** the owner's hook is ✅ with the hedge it already has ("might not even be"). Two wording rules. (1) Say "a map app in China" (or use the role pattern), not a bare "your map app", because a US viewer's app doesn't do this. (2) For the mechanism, say "it can work out the timing from when cars stop and start at that corner" (✅, Amap patent and Amap's 2024 description). Don't say "it only uses phones", "it's never connected", or "it's guessing" as the narrator's fact. Amap calls it calculation and prediction, not guessing. "Guess" is fine as framing only if the next line explains the method.

## B. Belief check: "a countdown on the light would make driving safer" / "the app must be wired to the light"

- **Belief 1, "the app must be wired to the light":** this is what the hook busts. ✅ (claims 3, 6, 7).
- **Belief 2, "countdowns are obviously safer, so why doesn't the US have them":** the evidence is mixed. A green countdown made some drivers stop more and others push through on yellow and red. A red countdown cuts start-up delay but tempts early starts. US rules ban vehicle countdowns because research tied "pre-yellow warning" displays to more crashes (claims 14–21). No survey measures either belief, so don't say "most people think". "You'd think a countdown would help" is fine framing.

---

## Step 1: The countdown in China

## 1. Countdown signals are widely used in China

- **Script (expected):** "In China, many traffic lights show drivers how many seconds are left."
- **Status:** ✅ verified (peer-reviewed review)
- **Source:** [Impact of countdown signals on traffic safety and efficiency: a review and proposal](https://www.maxapress.com/article/doi/10.48130/DTS-2023-0016), Fuquan Pan, Jingzhou Yang, Lixia Zhang, Changxi Ma, Jinshun Yang, Pingxia Zhang, *Digital Transportation and Safety* 2(3): 200–210, published 2023-09-28
- **Quote (tool):** "countdown signal lights are widely used in China" / abstract: "These signals have been adopted by only a few countries, and the number of cities that use them is limited."
- **Note:** "Many" is the honest word. No source gives a share of Chinese intersections. Of the 46 papers the review covers, 32 are from China, which shows where the devices are studied, not how many exist. The review also notes Chinese national standards "do not cite the methods of using and setting countdown signals" (tool), so there's no single national rule for them.

## 2. China's red-countdown devices: what drivers see

- **Script (expected, optional):** "Some count down the red, some the green."
- **Status:** ✅ verified (the studies name both kinds)
- **Source:** Pan et al. 2023 (claim 1). The review treats green signal countdown displays (GSCD) and red signal countdown displays (RSCD) separately. Chiou & Chang 2010 (claim 16) studied both.
- **Note:** For the picture only. The video's story is the red countdown (the app counts down the red). Don't describe one standard Chinese signal head; designs vary.

## 3. Amap's countdown: launched May 2022, about 500,000 intersections, and Amap says it doesn't depend on a connection to the light

- **Script (expected):** "Amap, a map app in China, counts down red lights at about half a million intersections, and the company says it doesn't need a connection to the lights to do it."
- **Status:** ✅ verified (Amap statements reported by Jimu News and TMTPost; attribute to Amap)
- **Source:** [高德地图是怎样预测红绿灯的？谜底揭晓：这项技术全球首创，即将"出国"](https://news.qq.com/rain/a/20260520A09FFW00), Wu Changhua (吴昌华), Jimu News (极目新闻, Chutian Metropolis Daily), via Tencent News, 2026-05-20
- **Quote (tool):** "并不是接入了交警的信号灯数据，而是运用AI大模型计算、模拟倒计时，实现对信号灯变化的预测。" (Not plugged into the traffic police's signal data; it uses a large AI model to calculate and simulate the countdown and predict signal changes.) / "红绿灯倒计时是阿里巴巴旗下高德于2022年5月推出的产品功能" (launched by Alibaba-owned Amap in May 2022) / "高德介绍，这项红绿灯预测技术是通过AI大模型，对历史交通数据、实时车流信息与路口信号规律进行综合计算，从而实现不依赖信号灯硬件接入的倒计时模拟，系全球首创。" (Amap says it combines historical traffic data, real-time traffic flow and each intersection's signal patterns, so the countdown "doesn't depend on a hardware connection to the light"; Amap calls it a world first.) / "覆盖红绿灯路口近50万个" (nearly 500,000 intersections) / "由于各国交通信号系统标准各异、设备数据开放程度不同，海外主流导航产品均未提供大规模的信号灯精确倒计时服务。" (Amap's claim that mainstream overseas navigation apps offer no large-scale precise countdown.)
- **Source:** [Amap Expands AI-Powered Traffic Light Countdown Function to Overseas Markets](https://en.tmtpost.com/news/7995038), TMTPost, 2026-05-20 (no author shown)
- **Quote (tool):** "Introduced in May 2022, the proprietary system utilizes advanced artificial intelligence" / "and crowd-sourced vehicle trajectory data to simulate and calculate real-time signal changes" / "without relying on direct official system integration." / "The application provides active countdown displays across all navigation modes—including driving, cycling, and walking—" / "cover approximately 500,000 intersections across the Greater China region."
- **Note:** Scope: the 500,000 covers mainland China, Hong Kong, Macau and Taiwan, as of May 2026, and it's Amap's own number. "World first" is Amap's marketing claim: never voice it as fact (Claim 9 shows researchers estimating signal timing from probe data in 2015). The 2026 statement also mentions a "视觉时空序列模型（VSTM）" that adds "视觉时序感知" (visual time-series perception). Neither article says where the visual input comes from (one lead: an arXiv paper says "in-vehicle cameras can identify countdown timers", claim 8). So the honest wording is "from how traffic moves", not "only from phones". Earlier coverage gave smaller numbers: "近240个城市的8万多个红绿灯路口" (about 240 cities, 80,000+ intersections; Sohu 2024-01-24, claim 7), so the coverage grew fast. Use the 2026 figure with "about" and "the company says".

## 4. The app counts down to the next green, can warn before it changes, and shows how many cycles you'll wait

- **Script (expected, optional):** "In a jam, it can even tell you how many reds you'll sit through."
- **Status:** 🟡 (secondary for the 5-second warning; TMTPost for multi-cycle)
- **Source:** TMTPost 2026 (claim 3). Quote (tool): "while predicting precise multi-cycle wait times during rush-hour congestion."
- **Source:** [高德地图官方首度揭秘：红绿灯倒计时功能是如何实现的？](https://www.sohu.com/a/753910283_121124363), Sohu, 2024-01-24 (header source 交流科技圈; footer credits the WeChat account "IoT物联网技术"; author masked). Paraphrase from the tool: the feature shows "等待红灯具体轮数" (how many red cycles you'll wait) and plays a voice alert about 5 seconds before green.
- **Note:** The Sohu piece is a repost summarizing Amap's official video. Fine for product features, weak as a source. "Precise" is TMTPost's wording, not a measured accuracy.

## 5. Baidu Maps uses two routes: inference from anonymized location data, and official signal data in 30+ cities

- **Script (expected):** "Baidu Maps does it two ways: it works out each light's cycle from anonymous location data, and in some cities the traffic police send it the light's real status."
- **Status:** ✅ verified (Baidu's own Apollo site)
- **Source:** [一文解码百度地图红绿灯倒计时](https://www.apollo.auto/news/apollo-self-driving/9189), Baidu Apollo (reposted from Baidu Maps Open Platform), 2023-03-17
- **Quote (tool):** "百度地图基于海量的脱敏位置服务数据，计算得出每个路口红绿灯的周期时长和绿信比" (from massive anonymized location data, Baidu computes each intersection's cycle length and green ratio) / "将交通信号控制平台的红绿灯灯态数据，共享给百度地图，再精准实时推送给百度地图的用户" (the traffic signal control platform's light-status data is shared with Baidu Maps and pushed to users in real time) / "已在西安、兰州等30多个城市实现全城数以千计的路口红绿灯灯态独家上线百度地图APP" (Xi'an, Lanzhou and 30+ cities, thousands of intersections each) / on the inferred route: "算法可能无法完美模拟和还原真实世界，从而导致存在部分难以完全消除的误差" (the algorithm may not perfectly reproduce the real world, leaving some errors that are hard to eliminate fully)
- **Note:** "Anonymized location data" is Baidu's own word (脱敏). Say it neutrally if at all ("anonymous location data from phones"). No privacy beat. The "30+ cities" is as of March 2023. Baidu says it was first to launch the feature ("百度地图最早推出了红绿灯倒计时功能"), its own claim, not needed. A 2023 IT Home figure of "1 billion countdown reminders a day" for Baidu is a snippet only (❌ for the voice).

## 6. Amap: signal data isn't required, but city pilots improve accuracy; neither company discloses the split

- **Script (expected):** "In a few cities, the police feed it the real timing; elsewhere, it works it out."
- **Status:** ✅ verified (reporting that quotes Amap) / 🟡 for "elsewhere" (no split disclosed)
- **Source:** [高德、百度地图的红绿灯读秒是怎么"算"出来的？](https://finance.sina.cn/stock/relnews/hk/2024-02-02/detail-inafrvhi1115093.d.html?from=wap), Sina (credited 腾讯美股; the text matches IT Times reporting), 2024-02-02
- **Quote (tool):** "虽然并非必须有红绿灯系统数据才能提供读秒服务，但高德地图方面表示，与城市官方机构的合作，可以进一步提升红绿灯倒计时服务的覆盖度和准确度。" (Signal-system data isn't necessary to provide the countdown, but Amap says city partnerships further improve coverage and accuracy.) / "目前，高德地图已经与西安、兰州、泉州、济宁、北京亦庄等地公安交警机构展开相关试点合作。" (pilots with traffic police in Xi'an, Lanzhou, Quanzhou, Jining and Beijing Yizhuang) / "高德地图、百度地图方面均未披露，这两种数据的具体占比问题。" (neither discloses the share of each kind of data)
- **Source:** Sohu 2024-01-24 (claim 4). Quote (tool): "高德也会和各地交管部门合作，例如烟台市与高德地图的合作" (Yantai) / "这意味着一部分红绿灯的倒计时是直接从数据源头获取的，准确度很高。" (some countdowns come straight from the source and are very accurate)
- **Note:** This is the fairness line ("In fairness, in some cities the police do send the timing"). Because the split is undisclosed, never say "most lights are guessed" or "only a few are connected". The Sina piece itself says: "更多的是利用大数据、人工智能等技术'算'出来的" ("more of it" is calculated): a reporter's characterization, 🟡 if voiced; attribute ("reporters who looked into it found most of it is calculated").

---

## Step 2: How the app knows

## 7. Amap's patent: find the period in when waiting cars start moving

- **Script (expected):** "Amap's patent describes it: take the cars that waited at a red, note when each one started moving, and the timing repeats with the light's cycle."
- **Status:** ✅ verified (patent)
- **Source:** [CN114463969A, Traffic light period duration mining method, electronic equipment and computer program product](https://patents.google.com/patent/CN114463969A/en), Autonavi Software Co Ltd (Amap), filed 2021-12-22, published 2022-05-10, granted as CN114463969B 2023-05-16 (Google Patents English machine translation)
- **Quote (tool):** "trajectory data of sample vehicles parked for waiting for a target traffic light" / "determining a starting sample vehicle that is first started within the target time period" / "determining the offset duration of the starting time of other sample vehicles" / "counting quantity distribution information of the sample vehicles on the offset duration dimension" / "determining a unique period in the quantity distribution information by using a preset period mining algorithm" / one option is "an existing filtering algorithm (such as discrete fourier transform)" / Background: cycle data "generally depends on the period of the traffic lights provided by a traffic control office" and "the range of roads covered by the traffic light data which can be obtained by the method is limited"
- **Source (same method, Amap's own description):** Sohu 2024-01-24 (claim 4). Quote (tool): "依赖过往车主的行驶启停规律，运用云端大数据算法推算出具体红绿灯读秒时间" (relies on past drivers' stop-and-go patterns; cloud big-data algorithms work out the countdown)
- **Source (reporting):** Sina 2024-02-02 (claim 6). Quote (tool): "高德地图并非接入红绿灯系统数据，而是利用大量在路上的高德地图用户在红绿灯路口是行驶还是等待的状态，包括启停时间等计算出每个路口4个方向上红绿灯变化的规律。" (Amap isn't plugged into signal-system data; it uses whether many Amap users at the intersection are moving or waiting, including stop and start times, to work out the pattern for all four directions.)
- **Note:** The picture is the whole video: cars at a red all start moving in bursts, the bursts repeat every cycle, and stacking many days of start times shows the rhythm. The patent text is a machine translation. Quote it in the description by number, never in the voice. The patent also explains **why**: official cycle data covers too few roads. That's the neutral reason the app had to infer it. Naming Amap is fine (its own product). A second Amap patent ("红灯时长挖掘方法", filed 2022-03-17, per IT Times, claim 10) covers red duration; I didn't open it.

## 8. Researchers estimate signal timing from stop-to-start moments at scale (China, 2025): over 75% within 5 seconds

- **Script (expected):** "One team tested it on about 10,000 intersections in three Chinese cities, and more than three in four estimates were within five seconds."
- **Status:** ✅ verified (preprint) / 🟡 for the voice (not peer-reviewed; authors include company staff)
- **Source:** [Traffic Signal Phase and Timing Estimation with Large-Scale Floating Car Data](https://arxiv.org/html/2507.14190v1), Mingcheng Liao, Zebang Feng, Miao Fan, Shengtong Xu, Haoyi Xiong, arXiv:2507.14190v1, 2025-07-14
- **Quote (verbatim):** "with more than 75% of estimations demonstrating less than five seconds of error." / the key feature is "the timestamp of the stop-to-start transition near the intersection." / the method targets "signals with semi-fixed cycles in mainland China." / prior work assumed "fixed schedules and basic intersection designs for specific times and locations." / "in-vehicle cameras can identify countdown timers"
- **Results (tool):** offline, about 10,300 intersections (Beijing 5,241; Shanghai 2,987; Shenzhen 2,076): cycle length within ±5 s for 91.3%, within ±3 s for 81.5%; online road test on 10,000 intersections across mainland China: cycle length 82.7% within ±5 s.
- **Note:** Affiliations: NavInfo (a Chinese map-data company), Autohome, Baidu, ANU, Beijing Institute of Graphic Communication. Attribute as "one research team", not "Baidu found". Preprint, not peer-reviewed. "Semi-fixed cycles" ties straight into step 3: it works because the lights repeat. This is the best accuracy number available. Neither Amap nor Baidu publishes one.

## 9. The same idea in the US: researchers estimated San Francisco red lights from city bus GPS (2015), and a carmaker patented it

- **Script (expected):** "Researchers did the same in San Francisco back in 2015, using only the city buses' GPS pings, and estimated how long the reds lasted."
- **Status:** ✅ verified (journal abstract via index; patent)
- **Source:** Fayazi, Vahidi, Mahler, Winckler, "Traffic Signal Phase and Timing Estimation From Low-Frequency Transit Bus Data", *IEEE Transactions on Intelligent Transportation Systems* 16(1): 19–28, 2015-02. Abstract opened via an [index page](https://manuscript.isc.ac/Inventory/49/48796.htm) (IEEE and the Clemson preprint wouldn't open).
- **Quote (tool):** "The objective of this paper is to demonstrate the feasibility of estimating traffic signal phase and timing" / "fairly accurately, cycle times and the duration of reds for fixed-time traffic lights." / "Furthermore, we also estimate the start of greens in real time by monitoring the movement of buses across intersections." / (tool summary) buses report only about every 200 m and pass a given intersection only every 5 to 10 minutes.
- **Source:** [US9183743B2, Systems and methods for estimating traffic signal information](https://patents.google.com/patent/US9183743B2/en), Bayerische Motoren Werke AG; inventors Ardalan Vahidi, S. Alireza Fayazi, Grant Mahler, Andreas Winckler; filed 2013-10-31, granted 2015-11-10
- **Quote (tool):** "positioning system data is obtained from a plurality of vehicles." / "A duration of a red phase of the traffic signal is estimated based on the stop duration of each of the subset" / "the time between the starts of greens of a phase must be an integer multiple of the cycle time" / "Direct access to signal timing plans and the real-time state of the signal is prohibitively difficult"
- **Note:** The key qualifier is "**fixed-time** traffic lights" (step 3 again). 200 m ≈ 660 ft. Visual: a bus icon pinging every 660 ft. "A carmaker" is fine in the voice; don't name BMW (it's a patent citation, not the story's product). The patent's "integer multiple of the cycle time" line is the cleanest explanation of the trick.

## 10. Accuracy in practice: most lights covered, errors up to 5 seconds in one reporter's test, and more traffic means better estimates

- **Script (expected):** "It isn't perfect. One reporter's test in Shanghai found it was off by as much as five seconds at some lights."
- **Status:** ✅ verified (IT Times reporting, one test) / ✅ for the traffic-volume point (Baidu's own caveat plus a university expert)
- **Source:** [红灯还亮着，地图AI就叫我开车了！](https://www.woshipm.com/it/5754562.html), IT Times (IT时报, WeChat vittimes), republished on Woshipm, 2023-02-15
- **Quote (tool):** "来回8公里，途经共32个红绿灯。" (8 km round trip, 32 traffic lights) / "在90%以上红绿灯路口都能提供红绿灯倒计时服务" (countdowns at over 90% of the lights) / "个别路口极端情况下误差高达5秒。" (at some intersections, in extreme cases, errors up to 5 seconds) / expert 任立: "很多城市的红绿灯配时在每天的早晚会发生变化，而有些路口在一些时段车辆很少，这些复杂多变的道路情况都会影响AI和大数据分析的准确度。" (many cities change light timing between morning and evening, and some intersections have few cars at times; these affect the accuracy)
- **Source:** Sina 2024-02-02 (claim 6). Quote (tool): "误差小的就放出来给用户，误差大的就不放出来。" (small-error countdowns are shown; large-error ones aren't) / "也不是绝对的百分百精准" (not 100% accurate) / "这个路口车流量越多，红绿灯的倒计时读秒也就会越准确。" (the more traffic at an intersection, the more accurate)
- **Source:** [大学·问丨红绿灯倒计时读秒，导航软件如何实现"隔空投送"？](https://m.thepaper.cn/newsDetail_forward_25414736), The Paper (澎湃新闻), from Modern Express (现代快报), 2023-11-24; expert Wang Zhengli (王正礼), associate professor, Nanjing University School of Engineering Management
- **Quote (tool):** "在车流量较大的红绿灯路口，数据密度更高，算法估算的精度也更高。" (busier intersections, denser data, better estimates) / "而在车流量较小的红绿灯路口，估算的精度就会降低。"
- **Note:** Scope: one reporter, two apps, 32 lights in two Shanghai districts, early 2023. The article's headline ("The red light was still on, and the map AI told me to go") is good comment bait, but it's a headline. Voice only "off by as much as five seconds at some lights, in one reporter's test" (✅). 8 km ≈ 5 miles.

## 11. How GPS alone tells a red from a green

- **Script (expected):** "From the phone's location alone, a red looks like a car that stops near the line and sits still, and a green looks like that car pulling away, at the same moment as the cars around it."
- **Status:** ✅ verified (patents, university expert) / 🧮 inference for the "same moment as the cars around it" gloss
- **Source:** BMW patent (claim 9): red duration from each vehicle's "stop duration" at the intersection; "the duration of the red phase may be estimated as the maximum observed during a time period" in light traffic (tool); green starts repeat at multiples of the cycle.
- **Source:** Amap patent (claim 7): vehicles "parked for waiting", the first one to start, the others' start offsets.
- **Source:** The Paper / Nanjing University (claim 10). Quote (tool): the algorithm plots "一天内各个时段经过同一路口的不同车辆速度画在一个二维坐标系中" (the speeds of different vehicles through the same intersection across the day, on a 2D chart) / "红、绿、蓝三辆车的停车时长所占用的时间段，就是该红绿灯的红灯时段。" (the time span the three cars spend stopped is the red phase)
- **Source:** arXiv 2025 (claim 8): "the timestamp of the stop-to-start transition near the intersection."
- **Note:** Caveats the voice can skip but a commenter may raise: a stop can also be a jam, a turn, a pickup; the patents filter with many vehicles and many days; the BMW patent says drivers who treat yellow as red inflate the observed red. The phone doesn't see the color. It sees a stop and a start. That's the whole trick, and it's ✅.

## 12. Google infers cycle length and green split from Google Maps driving trends, but for city engineers, not for drivers

- **Script (expected, optional):** "Google's Green Light project reads the same stop-and-go patterns from Google Maps to work out a light's cycle, but it sends that to city engineers, not to your screen."
- **Status:** ✅ verified (Google Research page; company's own product, so naming it is allowed, but it's optional)
- **Source:** [Green Light](https://sites.research.google/greenlight/), Google Research, undated (page says "Launched in 2023")
- **Quote (tool):** "Green Light uses AI and Google Maps driving trends" / "we can infer existing traffic light parameters including: cycle length, transition time, green split" / "patterns of starting and stopping, average wait times at a traffic light" / "No additional hardware purchase, installation or maintenance required." / "Green Light is now available in over 100 cities worldwide"
- **Note:** This proves the US-side point: the same inference is done with US phone data (Green Light lists US cities, e.g. Seattle and Boston via coverage, snippet). It doesn't count down for drivers. Its "30% fewer stops" is Google's own early number (🟡, leave out). Name Google only if the line is about Green Light itself (brand rule). Easy to cut.

## 13. Western in-car countdowns use the city's signal feed: Audi Traffic Light Information (Las Vegas, 2016)

- **Script (expected, optional):** "Some cars in the US do show a countdown, on the dashboard, using timing the city sends them."
- **Status:** ✅ verified (GovTech; Miovision company page)
- **Source:** [Ready, set, go: Luxury cars count down to when red lights turn green](https://www.govtech.com/fs/ready-set-go-luxury-cars-count-down-to-when-red-lights-turn-green.html), Skip Descant, GovTech, 2017-09-05
- **Quote (tool):** "TLI displays the time remaining until the signal changes to green in the driver instrument cluster." / the car "receives real-time signal information from the Traffic Management Center" / "The car receives the signal data via the on-board 4G LTE data connection." / Traffic Technology Services "worked with RTC to make the signal data available to Audi's Traffic Light Information system."
- **Source:** [V2X](https://miovision.com/v2x/), Miovision (company page, undated)
- **Quote (tool):** "A time-to-green (TTG) countdown informs drivers when a traffic signal will turn green" / "Traffic Light Information (TLI) found in Audi, Lamborghini, Bentley and Porsche vehicles" / "covering over 70,000 intersections across 8 countries"
- **Source (lead):** [EnLighten tells you when your traffic light is going to change](https://www.engadget.com/2014/01/10/enlighten-tells-you-when-your-traffic-light-is-going-to-change/), Kelly Hodgkins, Engadget, 2014-01-10. Quote (tool): "A countdown timer ticks off the seconds, while a chime alerts you right before the light is about to change." Nine towns at launch. [App to Driver: Stop Daydreaming and Get Ready to Roll](https://spectrum.ieee.org/app-to-driver-stop-daydreaming-and-get-ready-to-roll-), Philip E. Ross, IEEE Spectrum, 2015-04-28: "Some lights are harder to predict than others" (tool).
- **Note:** The Western route is the opposite of the hook: the city sends the data. The 70,000 is Miovision's own number for its whole V2X service in North America and Europe (company claim, 🟡 if voiced; leave the number out). The Audi press release is gone (404), so the 2016 Las Vegas launch rests on GovTech ("At this time TLI is exclusive to the Las Vegas market", tool) plus coverage. Name Audi only if the line is about its feature. "Some cars" is safer and enough.

---

## Step 3: Why US lights don't count down for drivers

## 14. US walk signals must count down when the flashing hand lasts more than 7 seconds

- **Script (expected):** "In the US, walk signals have to count down when the flashing hand lasts more than seven seconds."
- **Status:** ✅ verified (MUTCD 2009, official FHWA HTML) / ✅ for the 11th edition via mirror (same wording)
- **Source:** [MUTCD 2009 Edition, Chapter 4E. Pedestrian Control Features](https://mutcd.fhwa.dot.gov/htm/2009/part4/part4e.htm), FHWA, Section 4E.07 Countdown Pedestrian Signals, Standard ¶01
- **Quote (tool):** "All pedestrian signal heads used at crosswalks where the pedestrian change interval is more than 7 seconds shall include" a countdown display "in order to inform pedestrians of the number of seconds remaining in the pedestrian change interval."
- **Source (11th Edition, 2023, unofficial mirror):** [Part 4I Pedestrian Control Features](https://roundabout-tech.github.io/mutcd-docs/part-4i-pedestrian-control-features/), §4I.04 Countdown Pedestrian Signals, ¶01 (mirror of MUTCD 11th Edition, Revision 1). Quote (tool): "All pedestrian signal heads used at crosswalks where the pedestrian change interval is more than 7 seconds" ... "shall include a pedestrian change interval countdown display."
- **Note:** The **"pedestrian change interval" is the flashing hand**, not the walking person. The countdown runs only during the flashing hand ("Countdown displays shall not be used during the walk interval", MoDOT EPG citing §4I.04, tool). Wording: "walk signals at crosswalks must count down" overclaims; keep "when the flashing hand lasts more than seven seconds", or say "most new walk signals count down" (🟡: no compliance-date or share source opened). The brief's "required on new US walk signals" is 🟡 as worded. The rule is ✅; how fast old heads were replaced isn't sourced. Fact-checker: confirm §4I.04 in the official PDF.

## 15. Numbers on a vehicle signal are not allowed (MUTCD)

- **Script (expected):** "But the federal rulebook for US traffic lights says no numbers on the lights drivers watch, countdowns included."
- **Status:** ✅ verified (2009 official HTML; 11th edition via mirror and search snippet of the official PDF)
- **Source:** [MUTCD 2009 Edition, Chapter 4D. Traffic Control Signal Features](https://mutcd.fhwa.dot.gov/htm/2009/part4/part4d.htm), FHWA, Section 4D.06 Signal Indications – Design, Illumination, Color, and Shape, Standard ¶02
- **Quote (verbatim, first part; the rest per the tool):** "Letters or numbers (including those associated with countdown displays) shall not be displayed" ... "as part of a vehicular signal indication."
- **Source (11th Edition, December 2023):** same sentence in §4E.01 Signal Indications – Design, Illumination, Color, and Shape, ¶02 ([mirror](https://roundabout-tech.github.io/mutcd-docs/part-4e-traffic-control-signal-indications/), tool). The official [Part 4 PDF](https://mutcd.fhwa.dot.gov/pdfs/11th_Edition/part4.pdf) appeared in search with the same sentence (snippet), but I couldn't render it.
- **Note:** "Federal rulebook" is a fair plain gloss of the MUTCD (FHWA's national standard). Say "US rules" or "the federal traffic-signal manual". Don't name the MUTCD in the voice unless needed. It's description material. States adopt it, some with amendments (California has its own MUTCD, which carries the same sentence, snippet).

## 16. ...and countdowns before yellow are banned because research tied them to more crashes

- **Script (expected):** "The manual bans anything that warns drivers the green is about to end, vehicle countdowns included, because research found those warnings increase crashes."
- **Status:** ✅ verified (MUTCD's own Support statement; attribute to the manual)
- **Source:** MUTCD 2009 (claim 15), Section 4D.26 Yellow Change and Red Clearance Intervals
- **Quote (verbatim, ¶16 Standard):** "signal displays that are intended to provide a "pre-yellow warning" interval, such as flashing green signal indications," "vehicular countdown displays, or other similar displays, shall not be used at a signalized location."
- **Quote (verbatim, ¶17 Support):** "The use of signal displays (other than warning beacons mounted on advance warning signs) that convey a "pre-yellow warning" have been found by research to increase the frequency of crashes."
- **Source (11th Edition):** §4F.17 Yellow Change and Red Clearance Intervals, ¶14 (Standard) and ¶15 (Support), same wording ([mirror](https://roundabout-tech.github.io/mutcd-docs/part-4f-steady-stop-and-go-operation-of-traffic-control-signals/), tool).
- **Note:** Attribute it: "the manual says research found..." (✅). The manual doesn't cite which research, and its Support line is about "pre-yellow warning" displays in general (flashing green included), not countdowns alone. So don't say "studies proved countdowns cause crashes" as the narrator's fact. Pan et al. 2023 found **no** reviewed countdown study that used crash counts (claim 20). That's the honest tension, and it makes a good fairness line (claim 21). The rule came from an FHWA interpretation (#4-246, 2002, on flashing green countdowns; title only, snippet), written into the 2009 edition.

## 17. Study, China (2011): countdown timers went with more red-light running

- **Script (expected):** "At four intersections in China, researchers found more drivers ran the red where there was a countdown."
- **Status:** ✅ verified (Europe PMC abstract, exact)
- **Source:** Long K, Han LD, Yang Q, "Effects of countdown timers on driver behavior after the yellow onset at Chinese intersections", *Traffic Injury Prevention* 12(5): 538–544, 2011-10, PMID 21972865 ([Europe PMC record](https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=DOI:10.1080/15389588.2011.593010&resultType=core&format=json); DOI 10.1080/15389588.2011.593010)
- **Quote (exact):** "There was a strong correlation between the presence of countdown timers and an increase in red light violations." / timers may lead to "increased entrance into the intersection during the later portions of the yellow and even the red"
- **Note:** Four videotaped intersections, compared with and without timers. "Correlation" and "may" are the source's hedges: say "found more red-light running where there were timers" (✅), not "timers cause". The countdowns here are at the signal (green and yellow), not in an app.

## 18. Study, Taiwan (2010): green countdowns widened the dilemma zone; red countdowns cut start-up delay

- **Script (expected):** "Researchers in Taiwan found the two kinds pull opposite ways: a green countdown widened the zone where drivers can't decide, and a red countdown got the line moving faster."
- **Status:** ✅ verified (Europe PMC abstract, exact)
- **Source:** Chiou YC, Chang CH, "Driver responses to green and red vehicular signal countdown displays: Safety and efficiency aspects", *Accident Analysis and Prevention* 42(4): 1057–1065, 2010, PMID 20441813 ([Europe PMC record](https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=DOI:10.1016/j.aap.2009.12.013&resultType=core&format=json))
- **Quote (exact):** "although GSCD can reduce late-stopping ratio, the dilemma zone is increased by about 28 m" / "creating a potential risk of rear-end crashes" / "RSCD effectively reduces start-up delay, saturated headway, and cumulative start-up delay" / "RSCD is clearly less controversial and more beneficial than GSCD."
- **Note:** 28 m ≈ 92 ft (🧮). The authors are at National Chiao Tung University (now NYCU); search coverage puts the sites in Hsinchu County and Taipei (snippet). "Researchers in Taiwan" is enough; a place name only, no politics. The abstract (search snippet) also says the red countdown's effect on early starts faded ("the ratios soon return to their before-RSCD levels"); not in my exact quotes, so 🟡. **This is the best single study for the video:** it shows the trade-off in one sentence.

## 19. Other countries: Singapore (effect faded), China (faster through yellow), Greece (early starts), US simulator (more stopping)

- **Script (expected, pick at most one):** "In Singapore, red-light running dropped after green countdowns went in, then crept back to where it was."
- **Status:** 🟡 (via review) for Singapore, China 2010, Greece / ✅ for the US simulator (university release)
- **Source (via review, Pan et al. 2023, claim 20):** Lum & Halim 2006, Singapore, *Transportation Research Part F* 9: 29–41: "the violation numbers returned to almost pre-GSCD level." (tool) Ma et al. 2010, China: "GSCD encouraged motorists to pass the stop-line during the amber time with greater speed." (tool) Papaioannou & Politis 2014, Komotini, Greece: "the percentage of the violations of the early start at the intersection with SCD was observed to 24%" (tool) vs under 1% at a non-countdown intersection (tool summary).
- **Source:** [Countdown timers at traffic signals may improve safety](https://www.sciencedaily.com/releases/2017/10/171031151242.htm), Oregon State University via ScienceDaily, 2017-10-31; study: Islam, Wyman & Hurwitz, *Transportation Research Part F* 51 (2017), doi 10.1016/j.trf.2017.08.010
- **Quote (tool):** the clock "counted down the final 10 seconds of a green indication" (driving simulator) / the timer "increased the probability that a driver in the dilemma zone would stop by an average of just over 13 percent" / "traffic signal countdown timers are not used in the U.S."
- **Note:** The Oregon result is the fairness counterweight: in a simulator, US drivers stopped more with a green countdown. Simulator, not the road. Greece's 24% is a red countdown's early-start effect, the "go at 1" myth. The ScienceDaily headline is the university's framing. Don't say "studies show countdowns are safe" or "unsafe". The evidence is mixed (claim 20).

## 20. The 2023 review: evidence is mixed, and no study used crash counts

- **Script (expected):** "A 2023 review of the research said the evidence still isn't enough to know whether they help or hurt."
- **Status:** ✅ verified
- **Source:** Pan et al. 2023 (claim 1)
- **Quote (tool):** "some studies propose that countdown signals reinforce traffic safety" / "others consider that such signals adversely affect traffic safety" / "causes difficulty in completely assessing the benefits and disadvantages of countdown signals" / "no studies have used the number of traffic collisions or collision rate."
- **Note:** 46 papers: China 32, India 5, Malaysia 2, Thailand 2, one each from Singapore, Korea, the US, the UK and Greece (tool). The review cites the MUTCD rule too: "vehicular countdown displays or other similar displays are not to be used at signalized locations" (tool). Fair one-liner: "the research is split" (✅).

## 21. Fairness: the US ban rests on "pre-yellow warning" research, while countdown studies themselves are mixed

- **Script (expected, optional):** "In fairness, the studies are split: some found drivers stopped more, others found they pushed through."
- **Status:** ✅ (claims 16–20)
- **Note:** Both sides in one line: Chiou & Chang (red countdown cuts delay; green widens the dilemma zone), Long et al. (more red running), Oregon State (more stopping in a simulator). Don't take a side; don't call the US rule right or wrong. That's a policy judgment, and it's off-brand.

## 22. Many US lights are actuated: detectors call and extend the green, so its length isn't fixed

- **Script (expected):** "Many American lights don't run on a fixed clock. Sensors in the road call the green and stretch it while cars keep coming, so the light itself doesn't know how long the green will last."
- **Status:** ✅ verified for the mechanism (FHWA) / 🟡 for "many" (no national share found)
- **Source:** [Traffic Signal Timing Manual, Chapter 5](https://ops.fhwa.dot.gov/publications/fhwahop08024/chapter5.htm), FHWA Office of Operations (FHWA-HOP-08-024, 2008; archived, replaced by NCHRP Report 812, 2015)
- **Quote (tool):** pre-timed: "A signal control in which the cycle length, phase plan, and phase times are predetermined and fixed." / actuated: "actuated control consists of intervals that are called and extended in response to vehicle detectors." / gap out: "the phase terminates due to a lack of vehicle calls within a specific period of time." / max out: "the phase terminates due to reaching the designated maximum green time for the phase." / "Modern traffic signal controllers do not explicitly support signal timing for pre-timed operation" ... "they are designed for actuated operation" / "Fully-actuated control is ideally suited to isolated intersections" "where the traffic demands and patterns vary widely"
- **Source (lead, snippet, not opened):** an older state-level FHWA-era inventory of isolated intersections: 17% pretimed, 26% semi-actuated, 48% fully actuated, 9% volume-density. One agency, old, unopened. ❌ for the voice.
- **Note:** "Many" is 🟡 but well supported in spirit (controllers are built for actuated operation). Don't say "most US lights" or give a share. "Sensors in the road" fits the common case (inductive loops); many places use cameras or radar now. "Sensors" alone is safe. The brand's on-brand line 4 ("a sensor cut into the asphalt") is the same idea.

## 23. Why that breaks a countdown: an actuated light decides only seconds before it changes

- **Script (expected):** "At those lights, the decision to end the green can come just one to four seconds before it changes, so there's nothing to count down."
- **Status:** ✅ attributed (Oregon State) / ✅ for "fixed timing is easier to estimate" (Nanjing University expert; arXiv; Fayazi)
- **Source:** ScienceDaily / Oregon State 2017 (claim 19). Quote (tool): at actuated intersections, "a light typically changes only one to four seconds after the decision to change it is made."
- **Source:** The Paper / Nanjing University (claim 10). Quote (tool): "固定相位的信号灯配时会更容易估算，准确度也会更高。" (fixed-phase timing is easier to estimate and more accurate) / "而动态的信号灯配时（也就是红绿灯配时方案会随着实时车流状态而改变），估算会更难，准确度也会更低。" (dynamic timing, which changes with real-time traffic, is harder and less accurate)
- **Source:** Fayazi et al. 2015 (claim 9): estimates are for "fixed-time traffic lights"; arXiv 2025 (claim 8): "signals with semi-fixed cycles in mainland China".
- **Source (re-opened 2026-11-12, tool):** same ScienceDaily page; the speaker is David Hurwitz (OSU College of Engineering, corresponding author). Quotes: timers "work well at fixed-time signals"; "they may not be practical for actuated signals"; "a light typically changes only one to four seconds after the decision to change it is made"; "not enough time for a countdown timer to be of value". It's his statement in a release, not a measured result. Voice it as "an Oregon State researcher says", with "would struggle", not "couldn't".
- **Note:** This is the step-3 payoff and ties the video together. The phone trick works because a fixed-time light repeats, and the same thing makes a roadside countdown easy. An actuated light doesn't repeat, which makes both hard. Keep it as physics, not a policy judgment. Don't say "China's lights are all fixed-time": no source. "Semi-fixed cycles" in the arXiv paper is the most you can say ("the lights that research tested in China mostly repeat on a schedule", 🟡). The in-car services predict actuated signals with probabilities. EnLighten's makers said "Some lights are harder to predict than others" (claim 13).

## 24. An in-car countdown is not a countdown on the signal

- **Script (expected, optional):** "The rule covers the light on the pole, which is why some cars can still show a countdown on the dashboard."
- **Status:** 🟡 (ScienceDaily statement; MUTCD scope not opened directly)
- **Source:** ScienceDaily / Oregon State 2017 (claim 19). Tool summary: onboard vehicle clocks are permitted in the US, unlike signal-mounted timers. The Audi feature shows the time to green "in the driver instrument cluster" (GovTech, claim 13).
- **Note:** The MUTCD sentence says "as part of a vehicular signal indication" (claim 15). An in-car display isn't one, so the logic holds (🧮 reading of the rule). Mark 🟡 until a source says so explicitly. Optional line.

## 25. Numbers and conversions

- **Status:** 🧮
- 28 m = 91.9 ft ≈ **92 ft** (Chiou & Chang). 200 m = 656 ft ≈ **660 ft** (bus pings). 8 km = 4.97 mi ≈ **5 miles** (IT Times test). 500,000 = **half a million** (Amap, 2026). 75% = **three in four** (arXiv, "more than"). 13 percent: Oregon State's figure is an increase in the **probability** of stopping, "by an average of just over 13 percent"; don't turn it into "13% fewer crashes".

---

## Key facts (one screen)

1. **China:** countdown signals are "widely used in China" (2023 review). Amap has counted down lights since May 2022, now about 500,000 intersections (Amap, 2026). Baidu Maps too. ✅
2. **Not wired in, or not always:** Amap says the countdown "doesn't depend on a hardware connection to the light" and isn't plugged into the traffic police's signal data. It also runs city pilots that improve accuracy. Baidu uses both routes (30+ cities with official feeds, 2023). Neither discloses the split. ✅ / 🟡 (split)
3. **The trick:** Amap's patent takes cars waiting at a red, notes when each starts, and finds the repeating period in those start times (CN114463969A). A phone doesn't see the color. It sees a stop and a start. ✅
4. **Accuracy:** one reporter's Shanghai test: countdowns at 90%+ of 32 lights, off by up to 5 s at some (2023). A research team: more than 75% of estimates within 5 s, about 10,000 intersections (2025 preprint). Busier corners mean better estimates. ✅ / 🟡 (preprint)
5. **US research did it first on buses:** San Francisco red durations and cycle times from bus GPS, "for fixed-time traffic lights" (IEEE T-ITS 2015). ✅
6. **US rules:** walk signals must count down when the flashing hand lasts more than 7 s (MUTCD 4E.07 / 4I.04). Numbers on vehicle signals: "shall not be displayed" (4D.06 / 4E.01). Pre-yellow warnings including "vehicular countdown displays" are banned because research found they "increase the frequency of crashes" (4D.26 / 4F.17). ✅
7. **Studies:** China 2011: "strong correlation" between timers and more red-light violations. Taiwan 2010: green countdown widened the dilemma zone "by about 28 m" (92 ft), red countdown "effectively reduces start-up delay". Greece: 24% early starts. Oregon simulator 2017: 13% more likely to stop. Review 2023: mixed; no study used crash counts. ✅ / 🟡 (via review)
8. **Hardware:** US controllers "are designed for actuated operation". Detectors call and extend the green, and an actuated light "typically changes only one to four seconds after the decision to change it is made". Fixed timing is "easier to estimate". ✅

## Numbers we'd put on screen (max 5)

| # | On screen | Source | Status |
| --- | --- | --- | --- |
| 1 | **~500,000 intersections** (Amap's countdown, 2026) | Jimu/TMTPost quoting Amap (claim 3) | ✅ attributed |
| 2 | **Off by up to 5 s** at some lights (one test, Shanghai, 2023) | IT Times (claim 10) | ✅ (scope) |
| 3 | **7 s**: US walk signals count down when the flashing hand is longer | MUTCD (claim 14) | ✅ |
| 4 | **+92 ft** dilemma zone with a green countdown (Taiwan, 2010) | Chiou & Chang (claim 18) | ✅ |
| 5 | **1–4 s**: how long before an actuated light changes it decides | Oregon State (claim 23) | ✅ attributed |

---

## Myths (hook and comment material)

| Myth | What the evidence says | Status |
| --- | --- | --- |
| "The app is hooked up to the traffic light." | Sometimes (city pilots, Baidu's official feeds in 30+ cities). Amap says its countdown doesn't depend on a hardware link and works the timing out from traffic (claims 3, 5–7). | ✅ |
| "It's just a guess." | It's a statistical estimate from many cars and many days. Over 75% within 5 s in one large test; small-error countdowns are shown, large-error ones withheld (claims 8, 10). It can be wrong by seconds. | ✅ / 🟡 |
| "The US has no countdowns." | Walk signals must count down when the flashing hand lasts more than 7 s (claim 14). Only vehicle signals can't. | ✅ |
| "Countdowns on car lights are illegal in the US." | The federal manual says numbers "shall not be displayed" on vehicle signals (claim 15). "Illegal" is loose: it's a traffic-control-device standard agencies must follow, not a law drivers break. Say "not allowed". | ✅ / 🟡 wording |
| "Countdowns obviously make intersections safer." | Mixed: more red-light running in one Chinese study, a wider dilemma zone in Taiwan, more stopping in a US simulator; no study used crash counts (claims 17–20). | ✅ |
| "You can go when the red hits 1." | Early starts rose to 24% at a Greek countdown intersection (via review). An app's countdown can be off by up to 5 s (claim 10). | 🟡 / ✅ |
| "The US could just bolt countdowns onto its lights." | Many US lights are actuated: the green's length depends on detectors, and the change is decided 1–4 s ahead (claims 22–23). | ✅ (🟡 "many") |
| "Traffic lights run on timers." | Fixed-time lights do. US controllers "are designed for actuated operation" (claim 22). | ✅ |
| "Google Maps could do this in the US tomorrow." | Google already infers cycle length from Maps data (Green Light), but for cities, not drivers. Amap says overseas apps lack the feature because signal standards and data access differ (its claim). Actuated lights are the harder physics (claims 3, 12, 23). | 🟡 (speculative; don't voice the "could") |
| "China's roadside countdowns are all wired to the controller." | Unverified lead: some Chinese countdown units are said to "learn" the previous cycle instead. No source found. | ❌ (don't use) |
| "A portable temporary light with no network still gets a countdown in the app." | One secondary repost of Amap's video says so (Sohu 2024). No primary source. | 🟡 (don't voice; at most "even temporary lights", attributed, after the fact-checker) |

## Angles (2–3, with hook sentences)

- **A (owner-approved, recommended): the app that learned the light from traffic.** Hook: "In China, a map app can count down a red light, and it doesn't even need to be connected to the light." (✅) The story: drivers in China see a countdown on the pole and on their phone → how the phone knows: cars stop, cars start, the starts repeat every cycle → the US: walk signals count down, car lights can't, because the rule says so, the studies are split, and many US lights don't know their own timing. Payoff line: the trick works only on a light that repeats, and that's also why a countdown is easy in one place and hard in the other.
- **B: the US-first angle (the rulebook).** Hook: "American walk signals count down, but the lights drivers watch never do, and that's on purpose." (✅ MUTCD 4E.07 + 4D.06 + 4D.26) Strong for US viewers and comment bait ("why not?"). The China app becomes the "here's what it looks like" beat. Weaker surprise than A, but it starts on the viewer's own street.
- **C: the light that decides at the last second.** Hook: "At many American lights, the decision to end the green comes just a few seconds before it changes, so there's nothing to count down." (✅ attributed, Oregon State; "many" 🟡) Visual and true, but it's a supporting mechanism, best as A's step-3 payoff.

## Visual notes for the director

- **One cut-open intersection, used twice.** First as a Chinese-style corner (signal head with a red countdown digit display beside it, generic, no signage text or flags), then re-dressed as a US corner (signal with no numbers, walk signal with a countdown, a detector loop cut into the asphalt). Same camera framing makes the comparison read instantly. Keep everything neutral: no flags, no city names on signs, no police imagery.
- **Phones face their owners.** A driver at the red; the map app's countdown read through the detail box (a red light icon with a seconds counter, generic UI, no Amap logo unless the owner wants it; the brand rule allows naming the product in the voice, but logos on screen are a separate call).
- **The hidden system (orange):** each waiting car carries a small orange dot (its phone's location). When the light goes green, the dots peel away in a burst. Track the "start moments" as orange ticks falling onto a timeline under the slice. Cycle after cycle, the ticks pile up in evenly spaced stacks: the rhythm of the light appears out of the traffic. That's the Amap patent's "quantity distribution on the offset dimension", drawn as a histogram. Then a thin orange line connects the stacks' spacing to the countdown on the phone.
- **Red vs green from GPS:** a speed-vs-time trace per car: flat at zero (stopped) then rising (moving). Several cars' flat segments line up into one band = the red. Motion every 2–3 s: a new car rolls up, stops, the band grows.
- **The Lab beat (researchers):** a San Francisco-style bus (generic) pinging its location every 660 ft as a pulse; a few pings near the light reveal "stopped" vs "moving". Or a wall map with 10,000 intersection dots lighting up, three in four turning green-check (the 75% within 5 s).
- **The US rulebook beat:** a pedestrian head counting down 9-8-7 on the flashing hand (legal). Then the vehicle head; numbers try to appear beside the red and are refused (they flicker and vanish). One statement card at most: "Numbers on car signals: not allowed". No legal text on screen.
- **The studies beat:** two cars approaching a green countdown at 3-2-1: one brakes (stops), one speeds up through yellow into red. A dashed zone on the road grows by 92 ft (the dilemma zone). Keep it to one image; the voice carries "the research is split".
- **The actuated payoff:** cut-open road showing the inductive loop and a cable to the controller cabinet (cut open: a controller box). Each car crossing the loop sends an orange pulse that pushes the green's end further out (extend). When the gap between cars gets long enough, the cabinet decides, and only then does the light go yellow. A countdown display beside it can't settle on a number: digits flicker, then blank. Contrast: the fixed-time light's countdown ticks steadily.
- **Loop:** end on frame 0's picture (the driver at the red, phone showing the countdown).
- **Avoid:** flags, maps of countries, police or camera-surveillance imagery, any China-vs-US scoreboard, privacy "tracking" visuals (no red eyes, no crosshairs on cars), app logos unless approved, a "world first" card, the 30% Google number, and any on-screen source text.

---

## Script-safe lines (✅ as worded unless noted; US units)

1. "In China, many traffic lights show drivers how many seconds are left." (✅ Pan et al. 2023: "widely used in China")
2. "A map app there can count down a red light too." (✅ Amap since May 2022; Baidu Maps)
3. "Amap, one of China's big map apps, says its countdown doesn't need a connection to the light." (✅ Jimu 2026: "不依赖信号灯硬件接入"; attribute to Amap)
4. "Instead, it works out the timing from when cars stop and start at that corner." (✅ Amap patent CN114463969A; Amap 2024 "启停规律")
5. "Your phone can't see the color of the light. What it can see is your car stopping, and then pulling away at the same moment as the cars around you." (✅ patents; "at the same moment" 🧮 gloss of start-time clustering)
6. "Do that for thousands of cars over many days, and the moments they pull away repeat on a rhythm, which is the light's cycle." (✅ Amap patent: period in the start-offset distribution; BMW patent: green starts "an integer multiple of the cycle time")
7. "In some cities, the traffic police do send the app the real timing." (✅ Amap pilots in Xi'an, Lanzhou, Quanzhou, Jining, Beijing Yizhuang; Baidu official feeds in 30+ cities, 2023)
8. "It isn't perfect: in one reporter's test in Shanghai, it was off by as much as five seconds at some lights." (✅ IT Times 2023; scope kept)
9. 🟡 "One research team tested the method on about 10,000 intersections in China, and more than three in four estimates landed within five seconds." (preprint, 2025; attribute "one research team")
10. "Researchers in the US did something similar back in 2015, estimating how long San Francisco's reds lasted from the city buses' GPS." (✅ Fayazi et al., IEEE T-ITS 2015, "for fixed-time traffic lights")
11. "In the US, walk signals have to count down when the flashing hand lasts more than seven seconds." (✅ MUTCD 4E.07 / 4I.04)
12. "But the federal manual for traffic lights says no numbers on the lights drivers watch." (✅ MUTCD 4D.06 / 4E.01)
13. "It bans vehicle countdowns along with anything that warns the green is about to end, and it says research found those warnings increase crashes." (✅ MUTCD 4D.26 / 4F.17, attributed)
14. "At four intersections in China, researchers found more red-light running where there was a countdown." (✅ Long et al. 2011, "strong correlation")
15. "Researchers in Taiwan found a green countdown widened the zone where drivers can't decide whether to stop by about 90 feet, while a red countdown got the line moving sooner." (✅ Chiou & Chang 2010: "about 28 m"; "reduces start-up delay")
16. "In a US driving simulator, a green countdown made drivers more likely to stop." (✅ Oregon State 2017; simulator)
17. "A 2023 review of the research called the evidence too thin to say whether countdowns help or hurt." (✅ Pan et al. 2023; paraphrase of "difficulty in completely assessing the benefits and disadvantages", so keep "called" or say "said it's hard to tell")
18. 🟡 "Many American lights don't run on a fixed clock: sensors in the road call the green and stretch it while cars keep coming." (FHWA mechanism ✅; "many" unquantified)
19. "At those lights, the decision to end the green can come just one to four seconds before it changes." (✅ attributed to Oregon State: "typically ... one to four seconds")
20. "A light that repeats is easy to count down, and easy for a phone to learn; a light that decides as it goes is hard for both." (✅ Nanjing University expert: fixed timing "更容易估算"; Fayazi "fixed-time"; arXiv "semi-fixed cycles"; OSU 1–4 s)
21. 🟡 "Some cars in the US can show a countdown on the dashboard, using timing the city sends them." (GovTech/Audi; Miovision; the "rule doesn't cover dashboards" logic is 🟡)

**Not script-safe:** "the app isn't connected to the light" stated flat (❌ for every light; use "doesn't need to be"); "it only uses phones" (🟡, Amap 2026 adds historical data and a "visual" model); "it's guessing" as the narrator's fact (Amap calls it calculation; use "works out"); "world first" (Amap's claim, ❌ as fact; US researchers did it in 2015); any Amap or Baidu accuracy percentage (none published, ❌); "countdowns cause crashes" or "countdowns are proven safe" (❌; mixed evidence; the MUTCD line is about "pre-yellow warning" displays and must be attributed); "most US lights are actuated" or any share (❌, no national figure); "China's lights are all fixed-time" (❌); "countdowns are illegal" (🟡; "not allowed" is the accurate word); "the US banned countdowns" without "for drivers" (❌; walk signals require them); the portable-light story (🟡, one secondary source); Google's "30% fewer stops" (company's early figure); Miovision's "70,000 intersections" in the voice (company claim); naming BMW, Miovision or TTS in the voice (citations, not the story's product); any privacy, surveillance, trade or policy framing.

## Hook variants (approved direction)

1. "In China, a map app can count down a red light, and it doesn't even need to be connected to the light." (✅ Amap via Jimu: "不依赖信号灯硬件接入"; Sina: signal data "并非必须". "Doesn't need to be" is the honest form of "might not even be".)
2. "Drive in China, and your map app can tell you how long a red light has left, even if it isn't wired to that light." (✅ with "can" and "even if": the role pattern makes "your map app" true; the "if" carries the undisclosed split.)
3. "In China, a map app can count down a red light it might not even be connected to, just by watching when cars at that corner stop and start." (✅ "might not"; "just by watching" is ✅ for the patent method, 🟡 against Amap's 2026 description, which adds historical data and a "visual" model. Drop "just" if the fact-checker wants it tighter.)
