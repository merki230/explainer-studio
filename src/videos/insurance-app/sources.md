# Sources: insurance-app

Researcher draft, 2026-10-29. No script yet, so claims follow the agreed beat order: the trip starts → the app works out you're the driver → hard brake / fast start / sharp turn (accelerometer, gyroscope) → speed and time of day (GPS, clock) → phone handling → events become a score, the score becomes a price → ending: who else may be scoring you (carmakers → data brokers → insurers). Statuses are the researcher's starting confidence; the fact-checker sets the final ones.

Owner-agreed angle: one driver, one ordinary trip, a phone in the cupholder running the insurer's usage-based-insurance (UBI) app. Working hook: "Your insurance app can tell when you brake too hard, and it doesn't need your car to do it." **Verdict in section H: the hook holds, with one word to change ("too hard" → "hard"). Read H before scripting.**

Everything was accessed on 2026-10-29. **How to read the quotes** (same rules as `byd-price/sources.md`):

- **(tool)** means the web tool's small model returned the quote from the page. Re-open and re-quote before ✅.
- **(snippet)** means seen only in a search-result summary; the page was not opened. A lead only (🟡 at best).
- **🧮** means our own calculation; inputs sourced, working shown.
- **Company claim** = an insurer's, carmaker's or vendor's own statement (fine for "they say" lines; the voice doesn't name the company as a citation). **Independent** = regulator, court, peer-reviewed paper, journalist's own finding, Consumer Reports testing.
- **Patents** show how a vendor *can* do it, not proof that a specific app does it today. Script them as "one patent describes…" or as the general method, never as "your app does exactly this".
- **Could not open:** nytimes.com (blocked; used KBB's same-day write-up of the Kashmir Hill story), wyden.senate.gov (403; used press coverage), texasattorneygeneral.gov (402 on both press releases), jdpower.com and businesswire.com (403; used CBT News's write-up of the J.D. Power release), allstate.com (timed out 3×; used Allstate's newsroom instead), ecfr.gov (redirect to a captcha; used the Federal Register text), web.archive.org (blocked), and the PDFs of the FTC complaint, the NAIC/CMT presentation, the Chu et al. paper and the 2026 NHTSA phase-in rule (binary, no text extracted).

---

## Fact-check pass 1 (2026-10-29, pre-script)

Re-opened at the primary and re-quoted exactly: Allstate newsroom (2 pages), Consumer Reports, State Farm, Progressive (Snapshot + FAQ), both FTC releases, CBT News, LexisNexis page, Cornell LII (10 CCR 2632.5 and the 49 USC 30101 note carrying Pub. L. 114-94 §§24301–24302), Federal Register 2024-29862, NAIC, Google Patents (US10672249, US9398423), ar5iv review, The Record, Carrier Management, Repairer Driven News, CarComplaints, The Register, KBB, congress.gov S. 766 as reported.
**Still not opened:** nytimes.com (blocked by the tool), jdpower.com (403 again), transportation.gov and public-inspection PDF for the 2026 EDR rule (403 / binary), allstate.com Drivewise FAQ (timeout), Texas AG pages, senate.gov, the FTC complaint PDF, the govinfo copy of Pub. L. 114-94 (page truncated before Division B).
**Real NYT URL:** `https://www.nytimes.com/2024/03/11/technology/carmakers-driver-tracking-insurance.html`, headline "Automakers Are Sharing Consumers' Driving Behavior With Insurance Companies". Found as the href on the University of Chicago news-clipping page (news.uchicago.edu); the NYT page itself was not opened, so cite it only for the headline and date, and take the facts from KBB.

**Hook:** "Your insurance app can tell when you brake hard, and it doesn't need your car to do it." Reaches ✅ only if "your" becomes "some" or "an" (see table below). With "your" it claims every insurer's app, and State Farm's needs a beacon.

| Claim (script wording) | Status | Hedge that makes it safe |
| --- | --- | --- |
| Some insurance apps detect hard braking from the phone alone | ✅ | Progressive FAQ: "sudden changes in speed (hard brakes and rapid accelerations)"; app needs no device ("no need to wait for the device ... or to plug it in"). Say "an insurance app", not "your". |
| Allstate counts hard braking at more than 7 mph in one second | 🟡 | The 7 mph line is the methodology of Allstate's Best Drivers report, built on Arity connected-driving data. The page does not say it is the live app/rating threshold. Say "Allstate's driving report counts…". |
| Programs count hard braking at about 6 to 8 mph in a second | ✅ | CR 2021: "Many of the programs" use "a deceleration of 6 to 8 mph over the course of 1 second". CR also lists Allstate, American Family, Nationwide, Progressive, Travelers, USAA at "somewhere between 6 and 10 mph per second" (2021). |
| A normal stop at a red light counts as a hard brake | 🟡 | CR did not say the 6.6 mph/s stop was flagged. CR said ordinary maneuvers "would register as hard braking" under the 6–8 range, and Kelly Funkhouser (CR) called the stop "just a typical stop at a stop sign or red light". Say "Consumer Reports said a normal stop can register as hard braking under those thresholds" (2021). |
| State Farm counts phone distraction when car moving, phone moving, screen on | ✅ | Attribute: "one insurer's app". |
| Progressive: only about 2 in 10 drivers get an increase | ✅ (company) | "Progressive says only about 2 in 10 get an increase". Excludes NC, HI, NY, MT; not in CA. Undated. |
| $328 average saving | 🟡 | Page says both "save an average of $328 a year" (heading: "at program completion") and "Customers who renewed ... and earned a Snapshot discount". Only among those who earned it. Don't say "average driver saves". |
| FTC (2025-01-16) alleges GM sold driving data to consumer reporting agencies, whose reports insurers used to deny insurance and set rates | ✅ | "the FTC alleged". Commission vote on the complaint was 3-0-2. Language: "such as every instance of hard braking, late night driving, and speeding"; "sometimes as often as every three seconds" (location). |
| FTC final order (2026-01-14): 5-year ban on GM sharing geolocation/driver-behavior data with consumer reporting agencies; 20-year consent requirement | ✅ | Vote 2-0. No admission language on the page; say "settled", never "GM admitted". |
| 20% of customers use UBI (J.D. Power) | 🟡 | Via CBT News only. "20% of all customers" in a survey of recent quote-shoppers (n = 12,437, Jan 2025–Jan 2026). Say "J.D. Power's 2026 shopper survey found about one in five…". |
| California bars insurers' devices from collecting location | ✅ | 10 CCR 2632.5(c)(2)(F)(i)(5)(a). Has an emergency-roadside exception. Do not claim this is why apps are unavailable in CA (no source says so). |
| Crash recorder keeps 5 s before a crash | ✅ | Federal Register 2024-12-18 quotes 5 s at 2 Hz as the current rule. |
| 20 s phasing in from Sept 2028 | 🟡 | The 2024 rule says "The compliance date is September 1, 2027". The 2028–2031 phase-in is from a search summary of the 2026 final rule (FR 2026-09849); I could not open it. Say "a newer rule raises it to 20 seconds, starting with some cars in 2028" only after the PDF is read. |
| Driver Privacy Act covers only event-data-recorder data | ✅ | Enacted text (Pub. L. 114-94, div. B, title XXIV, §24302, via Cornell's 49 USC 30101 note): "Any data retained by an event data recorder" (EDR defined by 49 CFR 563.5). §24301 is only the short title. |

**Legally sensitive (say "the FTC alleged/says", never state as our finding):** GM/OnStar (settled consent order, no admission; MDL 3115 allegations); LexisNexis and Verisk (named as recipients in Carrier Management/KBB/The Record; Verisk stated it "no longer receives this data"; LexisNexis page still sells automaker/app data, a product description, not proof about any car); Allstate/Arity (Texas allegations, Allstate disputes); Progressive, State Farm, Allstate (company claims; attribute, never "they secretly"). Honda, Hyundai, Kia, Mitsubishi: do not name in the voice. Ford's denial is in the KBB piece.

## Script check (2026-10-29, first draft, 17 lines)

| Line | Claim | Status | Fix |
| --- | --- | --- | --- |
| 1 | An insurance app senses hard braking without the car | ✅ | none ("an", "hard") |
| 3 | Plug-in boxes exist; phone has its own motion sensors | ✅ | Progressive FAQ describes a plug-in device vs the app; review paper on phone sensors. The line only says "might picture", so no claim that all insurers dropped boxes. |
| 4 | Phone feels the car slow | ✅ | general method (review paper) |
| 5 | CR 2021: many programs count about 6 to 8 mph in one second | ✅ | CR: "Many of the programs" define it as "a deceleration of 6 to 8 mph over the course of 1 second" (2021-10-07) |
| 6 | CR said a normal stop like yours can count | 🟡 | OK as "can". CR said routine maneuvers "would register as hard braking" under that range and Funkhouser called a 6.6 mph/s stop "a typical stop at a stop sign or red light"; CR did not report an app flagging it. Optional safer: "a typical stop at a red light can fall in that range." |
| 7 | Gyroscope feels the swing; sharp turns count | 🟡 | "Sharp turns count" ✅ (NAIC "hard cornering"; State Farm shows sharp turns). "Gyroscope" is the general method (CMT patent, Arity allegation), not any app's spec. Optional: "the phone's motion sensors feel the car swing". |
| 8 | "You glance at the phone" | REQUIRED fix | State Farm's rule needs the phone "moving within the vehicle" and the screen on. A glance doesn't move the phone. Use "pick up the phone" (or "you pick the phone up while the car is moving"). |
| 9 | One insurer's app: car moving, phone moving, screen on | ✅ | exact State Farm quote |
| 10 | "When you park, those moments are saved as events, and over weeks they add up to a score" | REQUIRED fix | No source for "when you park" (upload/save timing) or "over weeks". Progressive says the discount is credited at renewal, usually after about six months. Safe: "Those moments are logged as events, and they feed into a score." "Score" is supported only for distraction (CMT patent) and Allstate/Progressive rating language; keep it general. |
| 11 | Score feeds price; one insurer says up to 30 percent | ✅ | State Farm: "up to 30%" (footnote: may exceed 30%, NY capped). "feeds into your price" is Progressive/State Farm rate language. |
| 12 | Another insurer says about 2 in 10 see a rate increase | ✅ | Progressive, exact; excludes NC, HI, NY, MT, not in CA |
| 13 | Some drivers never installed an app | ✅ | FTC GM case |
| 14 | FTC alleged GM sold driving data, including every hard brake, to data brokers | REQUIRED fix | FTC wording: data sold to "consumer reporting agencies", "such as every instance of hard braking, late night driving, and speeding". The FTC release does not say "data brokers" (LexisNexis/Verisk as brokers come from Carrier Management/KBB). Use "to consumer reporting agencies" or "to companies that sell reports to insurers". Legally sensitive (GM): "alleged" kept, good. |
| 15 | FTC said insurers used those reports to set rates; GM settled | ✅ | Complaint: reports "used by insurance companies to deny insurance and set rates"; final order 2026-01-14, 2-0, no admission. Don't say "admitted". |
| 16 | At least one data broker still advertises driving data from carmakers to insurers | ✅ | LexisNexis Telematics OnDemand (©2026): "driving behavior data from U.S. automakers, mobile apps and 3rd party services that participate in our telematics exchange"; a "consumer reporting agency product". Unnamed, good. The page shows an advertised product, not which carmakers are in it today. "Even so" ties it to GM; GM did end its LexisNexis/Verisk sharing in 2024, so "Even so" is fair. |
| 17 | "an insurance app may not be the only thing keeping count" | REQUIRED fix (soften) | Hedged, but it still implies cars are counting your stop now; no source shows any carmaker currently feeding insurers (the struck claim). Safe, sourced version: "…an insurance app isn't the only thing that has been keeping count" (FTC: GM's cars did, until 2024). |

**Verdict: FAIL** until the four REQUIRED fixes (lines 8, 10, 14, 17) are made; the rest passes. Re-check after the rewrite.

## Script check, revision 2 (2026-10-29, 17 lines)

Round-1 fixes (old lines 8, 10, 14, 17) are applied. New opens this round: State Farm (word search), FTC 2025-01-16 release (re-read), LexisNexis page.

| Line | Claim | Status | Fix |
| --- | --- | --- | --- |
| 1 | App senses hard braking without the car | ✅ | none |
| 3 | No box needed; phone has motion sensors | ✅ | Progressive FAQ: no device to "plug in" for the app |
| 4 | Phone feels the car slow | ✅ | general method |
| 5 | CR 2021: for many programs hard braking = 6 to 8 mph in one second | ✅ | exact CR wording; "about" removal is fine |
| 6 | CR said a normal stop like yours can count | 🟡 OK | CR: routine maneuvers "would register as hard braking" under 6–8 (no app flagged the 6.6 stop). Acceptable with "can". |
| 7–8 | Pick up phone; one insurer's app logs distraction (moving car, moving phone, screen on) | ✅ | State Farm exact |
| 9 | Each moment saved as an event, events feed into a score | 🟡 OK | State Farm page: "driving events" shown after each trip and "braking scores"; it defines no overall score. "Events" ✅; "a score" is only per category. Safer: "the events become scores". Not blocking. |
| 10 | Score affects price; one insurer says up to 30% | ✅ | State Farm "up to 30%" (may exceed 30%, NY capped) |
| 11 | Another insurer says about 2 in 10 see a rate increase | ✅ | Progressive, exact |
| 12 | "the FTC says their driving data still reached insurers" | REQUIRED fix | Say "alleges", not "says": it is a settled allegation. Also the FTC's wording is that reports built from the data were "used by insurance companies"; "reached insurers" is a fair paraphrase only with "alleges". The FTC says "some consumers were unaware that they had been signed up". |
| 13 | FTC alleged GM collected every hard brake | REQUIRED fix | The release uses "every instance of hard braking, late night driving, and speeding" as an example of data that "would be sold", and does not separately say GM collected every one. Use "such as hard braking" or drop "every": "The FTC alleged that General Motors collected driving data from its connected cars, such as hard braking." Legally sensitive (GM). |
| 14 | Agency said GM sold that data to companies that sell reports to insurers | ✅ | FTC: "sold it to third parties, including consumer reporting agencies" |
| 15 | FTC said insurers used those reports to set rates | ✅ | FTC: reports "were used by insurance companies to deny insurance and set rates" |
| 16 | GM settled | ✅ | final order 2026-01-14, 2-0, no admission |
| 17 | At least one such company still advertises carmakers' driving data to insurers | ✅ | LexisNexis (unnamed, good): "driving behavior data from U.S. automakers, mobile apps and 3rd party services"; product "can help insurers better assess risk exposure and more accurately price a policy" (©2026). Product listing, not proof of current flows. |

**Verdict: FAIL** until lines 12 and 13 are fixed (two small wording changes). All else passes.

## Script check, revision 3 (2026-10-29, final wording)

**Verdict: PASS.** Lines 12 and 13 now say "alleges/alleged"; line 1 is the approved hook ("an insurance app", "brake hard"); lines 6, 9, 10, 14, 15, 17 re-read and supported by the sources already opened. Residual 🟡 (allowed with attribution, none blocking): line 6 (CR said routine maneuvers "would register as hard braking"; no app flagged the 6.6 mph/s stop); lines 9–10 ("scores" rests on State Farm's "braking scores" and "how you drive determines how much you save"; no overall score is defined); lines 14–15 ("said" follows the "alleged" in line 13, so the allegation framing carries). Legally sensitive: GM (lines 13–16, settled, no admission), the unnamed report sellers (lines 14–17; LexisNexis page is a product listing, not proof of current data flows).

## Script check, revision 4 (2026-10-29, 16 lines, driver-story rewrite)

No new pages opened; all support from sources opened earlier in this check.

| Line | Claim | Status | Fix |
| --- | --- | --- | --- |
| 1 | Hook | ✅ | none |
| 3 | Phone's own motion sensors feel every stop | ✅ | general method (review paper); "every" is figurative, fine |
| 5 | For many programs, 6 to 8 mph in one second = hard braking | ✅ | CR 2021: "Many of the programs"; the year comes in line 6 |
| 6 | CR in 2021 said a normal stop like yours can count | 🟡 OK | CR: routine maneuvers "would register as hard braking" under 6–8; no app flagged the 6.6 stop. "Can" is right. |
| 7–8 | Pickup while car moving; one insurer's app counts distraction when phone moving + screen on | ✅ | State Farm's three conditions, split across two lines |
| 9 | "Every stop and every pickup is saved, and the app turns them into scores" | REQUIRED fix | No source says every stop is saved. Programs log events that cross a threshold (State Farm shows "driving events", braking scores). Use: "Every stop that crosses the line, and every pickup, is saved as an event, and the events become scores." |
| 10 | Those scores help set your price | 🟡 OK | State Farm "how you drive determines how much you save"; Progressive "Your rate may increase with high-risk driving". "Scores" is State Farm's per-category braking scores. "Help" is the right hedge. |
| 11 | One insurer: up to 30 percent | ✅ | State Farm (may exceed 30%, NY capped) |
| 12 | "Another says about 2 in 10 drivers end up paying more" | REQUIRED fix | Progressive: "only about 2 out of 10 drivers actually get an increase" (rate). "Paying more" changes the meaning (the sign-up discount also expires on renewal). Use "see their rate go up". |
| 13 | The app isn't the only way this data has reached insurers | 🟡 OK | FTC allegations; Verisk's own statement that it "received driving data" from GM, Honda, Hyundai and "may have provided" reports; KBB/NYT driver's LexisNexis file. Stated as fact but line 14 attributes it right after. If you want it safer: "…may have reached insurers." |
| 14 | FTC alleged GM took braking and speeding data straight from its cars | REQUIRED fix | "Took" implies non-consensual and is not the FTC's verb (it says "collected"; also alleges confusing enrollment). Legally sensitive (GM). Use: "The FTC alleged that General Motors collected braking and speeding data straight from its connected cars." |
| 15 | Agency said GM sold it to companies that make reports for insurers; insurers used the reports to set rates | ✅ | FTC: "sold it to third parties, including consumer reporting agencies"; reports "were used by insurance companies to deny insurance and set rates" |
| 16 | GM settled; at least one of those companies still advertises driving data from carmakers to insurers | ✅ | Final order 2026-01-14 (no admission). LexisNexis (unnamed; named as a GM partner by Carrier Management) page ©2026: "driving behavior data from U.S. automakers", product "can help insurers ... price a policy". Listing, not proof of current flows. |

**Verdict: FAIL** until lines 9, 12 and 14 are fixed (wording only). Rest passes.

## Script check, revision 5 (2026-10-29, 15 lines)

**Verdict: PASS.** The three revision-4 fixes are applied (hard stop/pickup saved; "see their rate go up"; "collected ... from their connected cars"). Lines 5, 7, 8, 11, 12, 15 ✅ (CR 2021 "Many of the programs"; State Farm conditions; Progressive 2 in 10; State Farm 30%; FTC GM allegations; LexisNexis page ©2026). 🟡, allowed: line 6 (CR said routine maneuvers "would register"; no app flagged the 6.6 stop), lines 9–10 ("scores" = State Farm braking scores; "help set your price" = State Farm/Progressive rate language; "either way" = State Farm "increase or decrease at each renewal"), line 13 (the FTC lists braking, late-night and speeding data as data to be sold; "collected" matches its verb). Line 14 reads "sold it ... who then used those reports": "who" must read as the insurers; if the planned "sold that data" edit lands, still ✅ (FTC: reports "were used by insurance companies to deny insurance and set rates"). Legally sensitive: GM (13–15, settled, no admission), unnamed report sellers (14–15).

## On-screen check of av-script.md (2026-10-29)

1. **Callout `HARD BRAKE` / `A normal stop` on a pin at the red-light stop: overstates CR. Required change.** CR said such stops "would register as hard braking" under the 6–8 mph/s range and never showed an app flagging a stop. A planted pin plus a flat label shows it as logged. Safe: callout `COULD COUNT AS` / `HARD BRAKING` (2021 in captions or sub-line `CONSUMER REPORTS, 2021` is optional; no brand needed). The pin may stay only as the illustrative device (🎭, disclosed); if it reads as "the app logged it", make it a ghost/outline pin until a real hard brake.
2. **Lines 14–15 picture (second car → report company → insurer): acceptable** as an illustration of an allegation if: voice keeps "alleged" / "the agency said"; generic car (no GM shape, badge, grille), no brand, logo, `GM` or `SOLD` label; the picture shows only what the FTC alleged (data collected from connected cars, sold to consumer reporting agencies, reports used by insurers to set rates); no orange or flow after "settled" and none implying current flows; the "never installed an app" car must not imply all drivers. **Publish disclosure must say:** "Illustrative: the second car, its data path, the report company and the insurer are a generic re-enactment of the FTC's allegations against General Motors (alleged in a January 2025 complaint; settled by a January 2026 consent order, with no admission). They show no real vehicle or company." Plus the usual line that the stop timing, arrow, pins, app screen, scores and price marker are invented.
3. **Numbers:** `6–8 MPH` / `LOST IN ONE SECOND` ✅ (CR 2021, "many programs"; voice says "Many programs"; add `MANY PROGRAMS` if space allows, since CR also found named insurers at 6–10). `UP TO` `30 % SAVED` ✅ (one insurer's claim; the voice says "one insurer"; "up to" must stay, the fine print says it can exceed 30%). `ABOUT` `2 IN 10 · RATE UP` ✅ (Progressive's own figure; "about" must stay; excludes NC, HI, NY, MT).

## Script check, line 17 (2026-10-30): "Would a cheaper rate be worth having every trip scored?"

**Verdict: 🟡 acceptable, safer with "tracked".** "Every trip recorded" is supported: Progressive's app "detects movement of a certain speed and distance to determine when a trip starts. No action is necessary on the part of the user." State Farm: "After each trip, the State Farm app shows you a map of your route and driving events." "Scored" rests on State Farm's per-category "braking scores" and line 9's "scores" (🟡; no overall score is defined). Safer: "every trip tracked". "Cheaper rate" is a premise some drivers don't get (Progressive: about 2 in 10 see an increase; line 11 already says so). Both opened earlier in this check.

## Script check, proposed speed line (2026-10-30)

Proposed: "The phone's GPS also tracks your speed, and the same insurer counts driving 8 miles an hour or more over the limit." / "Each of those moments is saved, and the app turns them into scores."
- **Same insurer:** ✅. Both rules are on State Farm's Drive Safe & Save Mobile page: "The app shows you when you've exceeded the speed limit by 8 miles per hour or more." and "Phone distraction will appear in the app when these three things happen at the same time".
- **"Counts": REQUIRED change.** The page says the app "shows you" speeding; it does not say it counts toward the rate. Use "flags" or "shows you": "…and the same insurer's app flags driving 8 miles an hour or more over the limit."
- **"GPS also tracks your speed":** ✅ as the general method (Wahlström et al.: "The standard update rate of smartphone-embedded GNSS receivers is currently 1 [Hz]"). State Farm's page does not say what sensor measures speed (its app also pairs with a beacon), so keep "the phone's GPS" separate from "the same insurer" or say "the phone's GPS gives your speed".
- **"Each of those moments is saved":** 🟡 OK. The page says the app "shows you" speeding and shows driving events after each trip; whether speeding is stored as an event is not stated. "Logged" or "shown" is no safer; keep, or use "Each of those moments shows up in the app".

## Script check, revision 6 (2026-10-30): lines as quoted by the coordinator

script.txt on disk still showed the previous 19-line version when checked, so only the quoted new/changed lines were checked; confirm the file matches.

| Line | Status | Note / required wording |
| --- | --- | --- |
| L1 "can tell how you drive, and it doesn't need your car" | ✅ | Progressive FAQ: "a variety of factors related to your driving"; app needs no plug-in device. "An insurance app", not "your". |
| L3 motion sensors and GPS, "every stop and every mile" | ✅ | General method (review paper: phone sensors, GNSS ~1 Hz). "Every" is figurative. |
| L4 "the app notices the trip begin on its own" | 🟡 OK | Progressive: "detects movement of a certain speed and distance to determine when a trip starts. No action is necessary on the part of the user." That is one insurer's app; State Farm's pairs with a beacon. Fine as the story's generic app; "one insurer's app" is the fully hedged version. |
| L8 pickup while moving | ✅ | State Farm conditions |
| L10 same insurer flags 8 mph or more over the limit | ✅ | State Farm: "The app shows you when you've exceeded the speed limit by 8 miles per hour or more." Same page as the distraction rule, so "same insurer" holds if L9 stays "one insurer's app" (State Farm). "Flags" is right; "counts" would not be. |
| L11 "Some programs also look at the time of day you drive" | ✅ | Progressive FAQ "the time of day you drive"; NAIC "time of day" (updated 9/1/2026) |
| L12 "Each trip is saved, and the app turns what it saw into scores" | 🟡 OK | State Farm shows driving events "after each trip" and "braking scores"; Progressive collects trip data. "Saved" and "scores" are not stated in those words; "recorded" is safer than "saved". No overall score defined. |

**Verdict: PASS** (no required fix on these lines). Legally sensitive: unchanged (GM lines, unnamed report sellers).

## Script check, revision 7 (2026-10-30): final polish as described

The polish had not landed in script.txt when read (still the 19-line revision-6 text), so this clears the described wording: "tracks every mile" ✅ (general method); "notices the trip has started without you tapping anything" ✅ (Progressive: "No action is necessary on the part of the user", one insurer's app); "also flags any time you're over the speed limit by 8 miles an hour or more" ✅ (State Farm "shows you when you've exceeded…", same insurer as the distraction line); "Each trip is recorded, and the app turns it into scores" 🟡 OK (State Farm events after each trip, braking scores). "Some programs look at the time of day, like this drive home at 5:40" ✅ for time of day (Progressive FAQ, NAIC); **the 5:40 is an invented example (🎭): add it to the post's "Illustrative:" line, and don't show or voice it as a penalty** (no source says an evening commute counts against anyone; Allstate's late-night window is snippet-only). **Verdict: PASS** (no required fix beyond the 5:40 disclosure); re-read the file once it lands.

## On-screen check, draft 3 (2026-10-30)

- **`5:40 PM.` ink statement card (line 5 / scene 7):** ✅ as shown. Time of day is a factor programs measure (Progressive FAQ "the time of day you drive"; NAIC "time of day"); 5:40 PM is an invented example (🎭): the post's "Illustrative:" line must name it ("the 5:40 PM drive home"). Keep it ink, no orange, no pin, no penalty cue; also the title tag `NO. 012 · THE DRIVE HOME · 5:40 PM` is the same illustrative time.
- **Counter `8 MPH` / `OR MORE OVER THE LIMIT` (line 11 / scene 13):** ✅. Matches State Farm: "exceeded the speed limit by 8 miles per hour or more". Voice says "the same insurer's app", so the number is attributed. Not showing the driver speeding is right (the app only flags). Don't add orange or a pin to the signs.
- **Callout `TRIP STARTED` / `No tap` (line 4 / scene 6):** ✅ for one insurer's app. Progressive: "detects movement of a certain speed and distance to determine when a trip starts. No action is necessary on the part of the user." The phone waking by itself is part of the invented app screen (🎭, already disclosed); no threshold is shown, good (none is published).

---

## Key facts in one screen

1. **Phone-only programs exist.** Progressive's app "detects movement of a certain speed and distance to determine when a trip starts" (company). Allstate's report defines hard braking as decelerating "more than 7 mph in one second" (company, 2024). State Farm's app pairs with a small Bluetooth beacon, not the car's computer (company). 🧮 7 mph in one second ≈ 0.32 g.
2. **Sensors (independent + patents):** phones sample the accelerometer and gyroscope "typically … 10 Hz or higher" (CMT patent, 2020); phone GPS updates at about 1 Hz (Wahlström et al., IEEE T-ITS, 2017). The phone isn't fixed in the car, so the app has to work out which way is "forward" (review paper; orientation patents).
3. **Driver or passenger:** Progressive says the app "should be able to determine who is the driver" and lets you correct trips (company). A TrueMotion (now CMT) patent describes telling the driver's seat from the twist you make getting in ("A user typically turns at least 45 degrees when entering the car"), the reach for the seat belt, and turn forces (patent, 2016). Small academic studies put driver/passenger classifiers at about 85–87% (2011–2013, few users).
4. **Phone handling:** State Farm counts distraction when "The vehicle is moving," the phone "is moving within the vehicle," and "The phone screen is on" (company). A CMT patent detects screen taps from tiny gyroscope rotations, "e.g., 0.2-0.7 radians/s", sampled at e.g. "100 Hz" (patent, 2020).
5. **Speed and clock:** State Farm flags going "8 miles per hour or more" over the limit; Allstate counts "over 80 mph" (company). Allstate's late-night window is snippet-only (11 p.m.–4 a.m. weekdays); NAIC lists "time of day" among UBI data (regulator).
6. **Price:** Progressive: average $164 sign-up discount (new customers), $328 average savings for those who earned a discount, "only about 2 out of 10 drivers actually get an increase" (company, page live 2026). State Farm: "up to 30%," and the rate "may increase or decrease at each renewal" (company). NAIC: UBI "can also lead to higher premiums" (regulator, 2021, modified 2025).
7. **Adoption:** J.D. Power 2026 Shopping Study: UBI "used by 20% of all customers"; 30% of recent shoppers (survey of 12,437 quote-shoppers, Jan 2025–Jan 2026). Read the scope: it's a shopper survey, not all US drivers.
8. **Accuracy:** Consumer Reports (2021) found programs define hard braking as 6–8 mph in 1 second, and a 6.6 mph/s stop was "just a typical stop at a stop sign or red light"; app-only programs "can't always tell whether you're driving your own car or riding in someone else's." No independent study of false-event rates found (❌).
9. **Carmakers → brokers → insurers:** NYT (Kashmir Hill, 2024-03-11, via KBB): a Chevy Bolt driver's LexisNexis file listed 640 trips with speeding, hard braking and sharp accelerations; his premium had risen 21%. FTC (2025-01-16 complaint; final order 2026-01-14, 2-0): GM/OnStar allegedly sold driving data to consumer reporting agencies whose reports were "used by insurance companies to deny insurance and set rates"; five-year ban on sharing with consumer reporting agencies, 20-year consent requirement. GM ended Smart Driver in April 2024. Verisk stopped taking GM/Honda/Hyundai data in spring 2024. Federal class action (MDL 3115, N.D. Ga.) largely survived dismissal in April 2026. Texas sued GM (Aug 2024) and Allstate/Arity (Jan 2025, alleging a tracking SDK inside apps like GasBuddy and Life360); both are allegations.
10. **Still running:** LexisNexis's Telematics OnDemand page (©2026) still sells "driving behavior data from U.S. automakers, mobile apps" to insurers.
11. **Law:** The Driver Privacy Act (2015) covers data in an event data recorder (EDR) as defined in 49 CFR 563.5; its Senate report doesn't mention apps or telematics. California allows insurers' devices to collect only miles driven, not location (10 CCR 2632.5). EDRs today: 5 s of pre-crash data at 2 Hz; a 2024 rule raises it to 20 s at 10 Hz, now phased in from 2028.

---

## H. The hook: "Your insurance app can tell when you brake too hard, and it doesn't need your car to do it."

| Part | Evidence | Status |
| --- | --- | --- |
| Fact-check 2026-10-29 | **Hook reaches ✅ with "an/some" in place of "your".** Progressive FAQ (opened): "sudden changes in speed (hard brakes and rapid accelerations)" for Snapshot generally, mobile app needs no device ("no need ... to plug it in"); the FAQ does not itself say the hard-brake measure is phone-only, so the phone-only part rests on that plus the review paper. Allstate's 7 mph line is report methodology (see claim 6, 🟡). | ✅ "an insurance app"; 🟡 "your" |
| "Your insurance app can tell when you brake…" | The phone's accelerometer measures the deceleration directly (review paper: harsh braking is detected "whenever the estimated longitudinal acceleration falls below" a threshold). Insurers count it: Allstate's 7 mph in one second; Progressive measures "hard brakes and rapid accelerations"; State Farm shows "fast, hard stops". | ✅ (general method, independent) + company claims |
| "…too hard" | "Too hard" is the insurer's line, not a safety line. CR found a 6.6 mph/s stop was "just a typical stop at a stop sign or red light", inside the 6–8 mph/s range programs use. Saying "too hard" endorses the threshold. | 🟡 change to "brake hard" (or "what it counts as braking hard") |
| "…and it doesn't need your car to do it" | Progressive and Allstate have phone-only apps; Allstate dropped plug-in devices (snippet, 2023). State Farm's app uses a beacon stuck in the car, but the beacon isn't the car's computer. The car contributes nothing. | ✅ for phone-only programs; avoid implying *every* program is beacon-free |

**Verdict:** keep the hook with one change: "Your insurance app can tell when you brake hard, and it doesn't need your car to do it." Optional stronger second line, using the CR finding: "…and its idea of 'hard' is a normal stop at a red light." (🟡, CR 2021, attribute: "Consumer Reports found…"; the CR test is 5 years old, so phrase it as a past finding.)

**The ending ("who else is scoring you"):** supported, with careful wording.

- ✅ "One carmaker's connected cars sent driving data to data brokers, who sold reports to insurers" (FTC final order 2026; GM ended it in 2024). Naming GM is allowed if the line is about GM's own product (OnStar Smart Driver); keep it as "the FTC says".
- ✅ "Regulators banned it for five years" (GM only).
- 🟡 "Other carmakers did too": only via Senate letter/press (Honda, Hyundai → Verisk, stopped 2024) and LexisNexis's page logos. Don't name them in the voice; say "the FTC says one carmaker…" or "brokers still advertise data from automakers" (✅, LexisNexis page).
- ❌ "Your car is scoring you right now." No source shows any specific carmaker currently feeding insurers; LexisNexis's page shows the product exists, not who's in it today.

**Honest alternative angles (pick one):**

- **A (agreed, recommended):** the trip, event by event, ending on the cars. Hook as above. Close: "And some drivers never installed the app. The FTC says one carmaker's cars sent the same kind of data to brokers, who sold it to insurers."
- **B (the twist you make getting in):** "Before you start the engine, your insurance app may already know you're the driver: from the way you twist as you sit down." Strongest picture, but it rests on a patent (🟡: "one patent describes…"); no insurer says publicly that it uses entry-twist detection.
- **C (the cost of a normal stop):** "To your insurance app, a normal stop at a red light can count as braking hard." CR 2021 (🟡, attributed, dated). Good contrarian hook; keep A's structure.

---

## 1. The app starts a trip on its own

- **Script (expected):** "You don't press start. The app notices you're moving fast enough, far enough, and starts recording."
- **Status:** ✅ verified (company claim, attributed)
- **Source:** [Snapshot FAQ](https://www.progressive.com/auto/discounts/snapshot/snapshot-faq/), Progressive, undated page, live 2026 (accessed 2026-10-29)
- **Quote (tool):** "The mobile app detects movement of a certain speed and distance to determine when a trip starts. No action is necessary on the part of the user."
- **Note:** No threshold given. Don't invent "15 mph" or similar. Company claim.

## 2. The phone samples its motion sensors many times a second; GPS about once a second

- **Script (expected):** "Many times a second, it reads its motion sensors. About once a second, GPS."
- **Status:** 🟡 plausible (patent + 2017 review; not a specific app's spec)
- **Source:** [US10672249B2: Determining, scoring, and reporting mobile phone distraction of a driver](https://patents.google.com/patent/US10672249), Cambridge Mobile Telematics, filed 2019-05-06, granted 2020-06-02 (accessed 2026-10-29)
- **Quote (tool):** "3-axis accelerometer readings (typically gathered at a rate of 10 Hz or higher)" / "3-axis gyroscope readings (typically gathered at a rate of 10 Hz or higher)"
- **Source:** [Smartphone-based Vehicle Telematics: A Ten-Year Anniversary](https://ar5iv.labs.arxiv.org/html/1611.03618), Wahlström, Skog & Händel, IEEE Transactions on Intelligent Transportation Systems, 2017 (Exeter repository dates it 2017-04-04; arXiv preprint 1611.03618, 2016-11) (accessed 2026-10-29)
- **Quote (tool):** "The standard update rate of smartphone-embedded GNSS receivers is currently" 1 Hz.
- **Note:** The 1 Hz figure is from 2016–17. Say "about once a second", not a fresh spec. Peer-reviewed review = independent.

## 3. The phone isn't fixed in the car, so the app first works out which way is forward

- **Script (expected):** "The phone could be lying any way up in the cupholder. So first it works out which way the car is pointing."
- **Status:** ✅ verified (independent review) / 🟡 for any specific method
- **Source:** [Smartphone-based Vehicle Telematics: A Ten-Year Anniversary](https://ar5iv.labs.arxiv.org/html/1611.03618), Wahlström et al., IEEE T-ITS, 2017 (accessed 2026-10-29)
- **Quote (tool):** "the smartphone cannot be assumed to be fixed with respect to the vehicle." / "the process is complicated by the fact that the smartphone-to-vehicle orientation may change at any time during a trip."
- **Source (method lead):** [US 2017/0023379: Opportunistic calibration of a smartphone orientation in a vehicle](https://patents.justia.com/patent/20170023379), Justia (snippet: maps "from the smartphone to the vehicle's frame of reference" using GPS, magnetometer, accelerometer) (page not opened)
- **Note:** US8862486 (TrueMotion) describes using gravity for "down" and the braking maximum "along a longitudinal axis" (snippet). Good visual: the phone finds "down" from gravity and "forward" from the first stops.

## 4. The app decides whether you're the driver or a passenger (insurer says)

- **Script (expected):** "It also has to decide whether you're driving or just riding along."
- **Status:** ✅ verified (company claim, attributed)
- **Source:** [Snapshot FAQ](https://www.progressive.com/auto/discounts/snapshot/snapshot-faq/), Progressive, live 2026 (accessed 2026-10-29)
- **Quote (tool):** "the mobile app should be able to determine who is the driver and only collect trip data for that person." / if two people are registered, "we provide the opportunity, in the app, to correct the trip information."
- **Source:** [US10672249B2](https://patents.google.com/patent/US10672249), CMT, 2020 (accessed 2026-10-29)
- **Quote (tool):** a classifier "estimates, for car trips, whether the user of the device was a passenger or driver" "based on both the sensor data as well as other contextual information, such as the start and end locations of the trip." / "Historical user-labeled trips can provide a corpus of examples of passenger trips"
- **Note:** "should be able to" is Progressive's own hedge. Keep it ("the app tries to tell…").

## 5. How it can tell: the twist you make getting in, the seat-belt reach, turn forces (patent)

- **Script (expected):** "One patent describes it: drivers usually get in on the left, so they twist one way sitting down, and reach left for the seat belt."
- **Status:** 🟡 plausible (patent; no insurer confirms it uses this today)
- **Source:** [US9398423B2: Methods and systems for driver identification](https://patents.google.com/patent/US9398423), TrueMotion Inc. (now Cambridge Mobile Telematics), priority 2012-12-26, granted 2016-07-19 (accessed 2026-10-29)
- **Quote (tool):** "A user typically turns at least 45 degrees when entering the car" / "there is a unique counter clockwise rotation in this yaw axis due to the nature of the movement" / "For the driver, there is a leftward rotation when reaching for the seatbelt" / "the magnitude of the adjusted centripetal acceleration is greater for left turns" / "the start time associated with the driving event can be preceded by a walking event"
- **Source (independent, accuracy):** [Smartphone-based Vehicle Telematics](https://ar5iv.labs.arxiv.org/html/1611.03618), Wahlström et al., 2017
- **Quote (tool):** "The dynamics of the two former motions will typically differ depending on which side of the vehicle the user entered from." / limitation: "they are susceptible to variations in the motion behavior of each individual."
- **Note:** Academic accuracy figures (snippet only, not opened): TEXIVE (arXiv 1307.1756, 2013) 87.18%; Chu et al. (Duke/MSR/UIUC) ">85% … 6 users in 2 different cars". Small studies; don't quote a number in the voice. US-centric (left-hand drive) is correct for the audience.

## 6. Hard braking = a speed drop of about 7 mph within one second (insurer definition)

- **Script (expected):** "Lose more than seven miles an hour in one second, and that's a hard brake."
- **Status:** 🟡 plausible. Fact-check 2026-10-29: the quote is exact, but it is the methodology line of Allstate's Best Drivers report ("anonymized connected driving data from ... Arity"; "Arity powers the optional safe driving features in Allstate's mobile app"). The page does not say this is the live app or pricing threshold. ✅ for "many programs, about 6–8 mph in a second" (CR). Hedged wording: "Allstate's driving report counts it as hard braking when…".
- **Source:** [Allstate finds Hawaii, Minnesota and Washington are home to America's safest drivers](https://www.allstatenewsroom.com/news/bestdrivers2024/), Allstate newsroom, 2024-07-11 (accessed 2026-10-29)
- **Quote (tool):** "Hard braking is calculated when a customer decelerates more than 7 mph in one second."
- **Source (independent, range):** [What You're Giving Up When You Let Your Car Insurer Track You…](https://www.consumerreports.org/money/car-insurance/how-car-insurance-telematics-discounts-really-work-a1549580662/), Kaveh Waddell, Consumer Reports, 2021-10-07 (accessed 2026-10-29)
- **Quote (tool):** programs "define 'hard braking events'" as "a deceleration of 6 to 8 mph over the course of 1 second."
- **🧮:** 7 mph = 3.13 m/s; 3.13 m/s² ÷ 9.81 m/s² ≈ **0.32 g**. Usable on screen as a gauge value if the director wants.
- **Note:** The Allstate definition is from its Best Drivers report methodology, not a policy document; the app's live threshold may differ. Progressive's old plug-in-device FAQ ("faster than 7 mph/second") is known only from third-party copies (Christensen Hymas, Daily Dot) and the 404'd progressive.com page (❌ for Progressive specifically). Safe voice: "many programs count it at about seven miles an hour in one second" (✅ via CR range + Allstate).

## 7. A normal stop can count as a hard brake (Consumer Reports test)

- **Script (expected, optional):** "Consumer Reports found a normal stop at a red light can cross that line."
- **Status:** 🟡 plausible (independent, but 2021; attribute and date-hedge)
- **Source:** [CR, 2021-10-07](https://www.consumerreports.org/money/car-insurance/how-car-insurance-telematics-discounts-really-work-a1549580662/) (accessed 2026-10-29)
- **Quote (tool):** a tester braked at 6.6 mph in one second, which CR called "just a typical stop at a stop sign or red light." / CR's experts warn drivers might "simply roll through stop signs."
- **Note:** 6.6 mph/s is under Allstate's 7 but inside the 6–8 range. Say "can", not "will".
- **Fact-check 2026-10-29:** CR re-opened. Exact: "When one tester braked to slow her car at a rate of 6.6 mph in 1 second, she found the force unremarkable." The "typical stop" quote is attributed to Kelly Funkhouser, CR's head of connected and automated vehicles ("It was just a typical stop at a stop sign or red light," "where you have someone behind you so you don't want to just coast the whole way there."). CR does **not** say any app flagged that stop; it says that under the 6–8 definition many routine maneuvers "would register as hard braking". Script it as CR's statement about the thresholds, not as a test result that an app flagged a normal stop. The "roll through stop signs" line is CR's own illustration, not an expert quote. Also: CR names Allstate, American Family, Nationwide, Progressive, Travelers, USAA as defining it "somewhere between 6 and 10 mph per second"; Farmers, Liberty Mutual, State Farm would not share.

## 8. Rapid acceleration and sharp turns are counted too

- **Script (expected):** "Same for pulling away too fast, and taking a turn too sharp."
- **Status:** ✅ verified (company claims + regulator)
- **Source:** [Drive Safe & Save Mobile](https://www.statefarm.com/customer-care/download-mobile-apps/drive-safe-and-save-mobile), State Farm, live 2026 (accessed 2026-10-29)
- **Quote (tool):** "Quick acceleration can make cars more difficult to control." / "You'll see along your route if you make any quick, sharp turns."
- **Source:** [Telematics (Insurance Topics)](https://content.naic.org/insurance-topics/telematics), NAIC, last updated 2026-09-01 (accessed 2026-10-29)
- **Quote (tool):** "rapid acceleration, hard braking, hard cornering, and air bag deployment."
- **Fact-check 2026-10-29:** NAIC re-opened (last updated 9/1/2026): "Telematics devices measure numerous elements of interest to underwriters, including miles driven, time of day," ... "rapid acceleration, hard braking, hard cornering, and air bag deployment." Progressive FAQ: "sudden changes in speed (hard brakes and rapid accelerations)". The State Farm "quick, sharp turns" quote was not re-opened; use NAIC for cornering. NAIC says "devices" and lists mobile applications elsewhere on the page, so it is a general statement, not about one app.
- **Note:** The gyroscope sensing cornering is the general method (review paper; the Arity SDK data list alleged in claim 22 includes "gyroscopic data"). No public acceleration or cornering threshold found (❌ for any number).

## 9. GPS gives speed, and speed against the limit

- **Script (expected):** "GPS gives your speed, and the app checks it against the limit."
- **Status:** ✅ verified (company claims)
- **Source:** [Drive Safe & Save Mobile](https://www.statefarm.com/customer-care/download-mobile-apps/drive-safe-and-save-mobile), State Farm (accessed 2026-10-29)
- **Quote (tool):** "The app shows you when you've exceeded the speed limit by 8 miles per hour or more."
- **Source:** [Allstate Best Drivers 2024](https://www.allstatenewsroom.com/news/bestdrivers2024/), Allstate, 2024-07-11
- **Quote (tool):** "High-speed driving is calculated when a customer drives over 80 mph;"
- **Note:** Two different rules from two insurers (relative to limit vs absolute 80 mph). If the script uses one number, attribute it ("one insurer flags 8 over the limit").

## 10. The clock counts: late-night driving

- **Script (expected):** "And the clock: a trip after midnight can count against you."
- **Status:** 🟡 plausible (time of day ✅; the exact window snippet-only)
- **Source:** [Snapshot FAQ](https://www.progressive.com/auto/discounts/snapshot/snapshot-faq/), Progressive (accessed 2026-10-29)
- **Quote (tool):** Snapshot measures "the time of day you drive."
- **Source:** [NAIC Telematics](https://content.naic.org/insurance-topics/telematics), 2026-09-01
- **Quote (tool):** "miles driven, time of day, where the vehicle is driven"
- **Source (snippet):** [Drivewise FAQ](https://www.allstate.com/help-support/drivewise-support/faqs), Allstate. Search summary: highest risk "weekdays 11 p.m. – 4 a.m. and weekends 11 p.m. – 5 a.m." Page timed out three times; not opened.
- **Note:** Progressive's "midnight to 4 a.m." is from third-party reviews only (compare.com, MoneyGeek) (❌ as a Progressive claim). Safe: "late at night".

## 11. Phone handling: moving car + phone moving in the car + screen on

- **Script (expected):** "Pick the phone up while the car's moving, screen on, and that's logged as distraction."
- **Status:** ✅ verified (company claim, attributed)
- **Source:** [Drive Safe & Save Mobile](https://www.statefarm.com/customer-care/download-mobile-apps/drive-safe-and-save-mobile), State Farm (accessed 2026-10-29)
- **Quote (tool):** "Phone distraction will appear in the app when these three things happen at the same time:" "The vehicle is moving," "The phone recording the trip is moving within the vehicle, and" "The phone screen is on."
- **Source:** [Snapshot FAQ](https://www.progressive.com/auto/discounts/snapshot/snapshot-faq/), Progressive
- **Quote (tool):** the mobile app "considers handheld phone use behind the wheel." / "Snapshot collects phone usage only while you're driving, and does not know who you're calling or otherwise contacting."
- **Source:** [Allstate Drivewise 25%](https://www.allstatenewsroom.com/news/drivewise-25/), Allstate, 2024-04-17
- **Quote (tool):** "phone handling is calculated when a customer's smartphone is in use while a trip is in progress."

## 12. It can feel your taps (patent)

- **Script (expected, optional):** "One patent goes further: every tap on the screen twitches the phone a tiny bit, and the gyroscope feels it."
- **Status:** 🟡 plausible (patent, not a confirmed product feature)
- **Source:** [US10672249B2](https://patents.google.com/patent/US10672249), CMT, granted 2020-06-02 (accessed 2026-10-29)
- **Quote (tool):** tap-induced rotation rate "is small (e.g., 0.2-0.7 radians/s)." / gyroscope sampled "at a high sampling rate of, for example 100 Hz." / "there is a range of plausible tapping frequencies from 5 taps a second to a few seconds per tap." / "the detector may not determine the existence of a tapping event unless the screen is in an active state" / uses "the phone's screen state ('on' signifies interaction) and/or the phone's phone-lock state"
- **Note:** Also: "distraction score can depend on speed, time-of-day, day-of-week, season, road type, weather conditions". Good visual; must be "one patent describes", not "your app does".

## 13. It doesn't listen to calls or read messages (myth)

- **Script (expected, optional):** "It knows the screen was on. It doesn't know who you were texting."
- **Status:** ✅ verified (company claim, attributed)
- **Source:** [Snapshot FAQ](https://www.progressive.com/auto/discounts/snapshot/snapshot-faq/), Progressive
- **Quote (tool):** "does not know who you're calling or otherwise contacting."
- **Note:** Only Progressive's statement. Don't generalise to all apps without "insurers say".

## 14. Events become a score, the score becomes the renewal price, and it can go up

- **Script (expected):** "At renewal, the events become a score, and the score becomes your price. Up or down."
- **Status:** ✅ verified (company claims + regulator)
- **Source:** [Snapshot](https://www.progressive.com/auto/discounts/snapshot/), Progressive, page live 2026 (accessed 2026-10-29)
- **Quote (tool):** "Your rate may increase with high-risk driving." "But, only about 2 out of 10 drivers actually get an increase." Footnote †: "Excludes the following states: NC, HI, NY, and MT. Snapshot not available in CA."
- **Source:** [Snapshot FAQ](https://www.progressive.com/auto/discounts/snapshot/snapshot-faq/), Progressive
- **Quote (tool):** riskier driving "may result in a higher rate at renewal — depending on the state you live in and when you signed up for Snapshot."
- **Source:** [Drive Safe & Save Mobile](https://www.statefarm.com/customer-care/download-mobile-apps/drive-safe-and-save-mobile), State Farm
- **Quote (tool):** "it may increase or decrease at each renewal."
- **Source (regulator):** [Want Your Auto Insurer to Track Your Driving?](https://content.naic.org/article/consumer-insight-want-your-auto-insurer-track-your-driving-understanding-usage-based-insurance), NAIC, 2021-09-08 (modified 2025-03-26)
- **Quote (tool):** "While the commercials for UBI promote the discounts drivers can receive, it can also lead to higher premiums."
- **Fact-check 2026-10-29:** Progressive Snapshot page re-opened; "Your rate may increase with high-risk driving. But, only about 2 out of 10 drivers actually get an increase." and footnote † "Excludes the following states: NC, HI, NY, and MT. Snapshot not available in CA." exact. FAQ adds "Participation discount not available in Hawaii and New York" and that the program "does vary in a few states". State Farm "it may increase or decrease at each renewal" exact (full: "Changes in your driving will be reflected in your adjusted amount, so it may increase or decrease at each renewal."). Status ✅ as attributed company claims.
- **Note:** "2 out of 10" is Progressive's own figure, undated, and doesn't apply in NC, HI, NY, MT. CR 2021 listed which insurers could raise rates at that time; outdated, don't use the list.

## 15. The discount numbers (one insurer)

- **Script (expected, optional):** "Sign up and you get a discount. Drive 'well' and it can grow; one big insurer says up to 30%."
- **Status:** ✅ verified (company claims)
- **Source:** [Snapshot](https://www.progressive.com/auto/discounts/snapshot/), Progressive, live 2026
- **Quote (tool):** "$164 Average discount at program sign up‡" (‡ "For new Progressive customers only. Discount will expire upon renewal of policy.") / "Customers who renewed their policy, and earned a Snapshot discount, saved an average of $328.*"
- **Source:** [Drive Safe & Save Mobile](https://www.statefarm.com/customer-care/download-mobile-apps/drive-safe-and-save-mobile), State Farm
- **Quote (tool):** "how you drive determines how much you save – up to 30%." Footnote: "Premium adjustment may exceed 30% and vary state to state (NY capped at 30%)."
- **Fact-check 2026-10-29:** Status 🟡 for $328. The page words it two ways: body "drivers who save with Snapshot save an average of $328 a year.*" and heading "$328 Average discount at program completion*" (the renewal sentence sits under it). The "$328 a year" and the renewal wording do not quite match; no date range. The asterisk footnote is "SNAPSHOT NOT AVAILABLE IN CA OR FROM ALL AGENTS." $164 is exact and ✅ (new customers only; expires on renewal). State Farm footnote exact: "Premium adjustment may exceed 30% and vary state to state (NY capped at 30%)"; program not available in CA and RI, may not be in NC.
- **Note:** $328 is only among drivers who *earned* a discount (survivor average). No date range given. Pick one insurer's numbers per line; don't name the company in the voice.

## 16. About one in five US auto-insurance customers is on a UBI program (survey)

- **Script (expected, optional):** "About one in five drivers in a big US survey is on one of these programs."
- **Status:** 🟡 plausible (scope: J.D. Power shopper survey; secondary write-up)
- **Source:** [Digital is the new front door for auto insurance](https://www.cbtnews.com/digital-is-the-new-front-door-for-auto-insurance/), CBT News, 2026-06-04, reporting J.D. Power's 2026 U.S. Insurance Shopping Study (accessed 2026-10-29)
- **Quote (tool):** UBI policies "are used by 20% of all customers." / "Moreover, 30% of recent shoppers and 34% of those buying from a new insurer are enrolled in UBI," / based "on responses from 12,437 insurance customers," who requested a quote in the prior six months; fielded January 2025–January 2026.
- **Fact-check 2026-10-29:** CBT News re-opened: "are used by 20% of all customers" (excerpt of a longer sentence); "30% of recent shoppers and 34% of those buying from a new insurer are enrolled in UBI"; 12,437 customers; study covers customers who sought a quote from a competing insurer in the prior six months; fielded January 2025–January 2026; byline date June 4, 2026. jdpower.com 403 again, so stays 🟡 (secondary). Hedged wording: "J.D. Power's shopper survey found about one in five customers on usage-based insurance."
- **Note:** The J.D. Power release itself (jdpower.com/business/press-releases/2026-us-insurance-shopping-study/) returned 403. The sample is people who shopped for a quote, so "20% of all customers" is J.D. Power's wording; don't turn it into "20% of US drivers". NAIC committee draft (2023) cites "approximately 16 million U.S. drivers" (snippet, third-party, not opened) (❌).

## 17. Insurers can be wrong about who drove (accuracy limits)

- **Script (expected, optional):** "And it can get you wrong: a ride in a friend's car can land on your score."
- **Status:** 🟡 plausible (independent but 2021; company's own correction feature)
- **Source:** [CR, 2021-10-07](https://www.consumerreports.org/money/car-insurance/how-car-insurance-telematics-discounts-really-work-a1549580662/)
- **Quote (tool):** app-only programs "can't always tell whether you're driving your own car or riding in someone else's" / they may register texting when you're a passenger; you can usually recategorize a drive, though some insurers require a call.
- **Source:** [Snapshot FAQ](https://www.progressive.com/auto/discounts/snapshot/snapshot-faq/), Progressive: "we provide the opportunity, in the app, to correct the trip information."
- **Note:** **No independent study measuring false-event or passenger-misread rates in insurer apps was found (❌ for any rate).** Academic driver/passenger accuracy ~85–87% is from small 2011–2013 prototypes (claim 5).

## 18. A carmaker's cars sent driving data to brokers, who sold reports to insurers (FTC)

- **Script (expected):** "Some drivers never installed an app. The FTC says one carmaker's connected cars recorded hard braking, speeding and late-night driving, and the data ended up with brokers who sold it to insurers."
- **Status:** ✅ verified (regulator; allegations, settled)
- **Source:** [FTC Takes Action Against General Motors for Sharing Drivers' Precise Location and Driving Behavior Data Without Consent](https://www.ftc.gov/news-events/news/press-releases/2025/01/ftc-takes-action-against-general-motors-sharing-drivers-precise-location-driving-behavior-data), FTC, 2025-01-16 (accessed 2026-10-29)
- **Quote (tool):** "every instance of hard braking, late night driving, and speeding" / reports "used by insurance companies to deny insurance and set rates." / GM's enrollment process was "confusing and misleading" / location data "every three seconds for some users."
- **Source:** [FTC Finalizes Order Settling Allegations that GM and OnStar Collected and Sold Geolocation Data Without Consumers' Informed Consent](https://www.ftc.gov/news-events/news/press-releases/2026/01/ftc-finalizes-order-settling-allegations-gm-onstar-collected-sold-geolocation-data-without-consumers), FTC, 2026-01-14 (accessed 2026-10-29)
- **Quote (tool):** "a five-year ban on GM disclosing consumers' geolocation and driver behavior data to consumer reporting agencies" / GM must "obtain affirmative express consent from consumers prior to collecting, using, or sharing connected vehicle data" (20-year order, "some exceptions such as for providing location data to emergency first responders") / "The Commission voted 2-0 to approve the final order and complaint"
- **Fact-check 2026-10-29 (both FTC releases re-opened).** Exact: complaint release dated January 16, 2025; Commission "voted 3-0-2 to accept the proposed consent agreement for public comment" (the researcher's "2-0" belongs to the final order only). Data "such as every instance of hard braking, late night driving, and speeding" was sold to consumer reporting agencies, "which were used by insurance companies to deny insurance and set rates" (the reports were used that way; the FTC does not name insurers). Enrollment "was confusing and misleading". Location monitored "sometimes as often as every three seconds" (not "for some users"). Final order, January 14, 2026: "a five-year ban on GM disclosing consumers' geolocation and driver behavior data" to consumer reporting agencies; affirmative express consent "for the entire 20-year life of the order", "some exceptions such as for providing location data to emergency first responders"; vote 2-0. No admission language on the page. Status ✅ with "the FTC alleged" wording. The complaint PDF was not opened.
- **Note:** Legally sensitive. These are FTC **allegations** settled by consent order; reporting (Repairer Driven News, 2026-01-27) notes no admission. Script as "the FTC says" / "the FTC alleged". Naming GM in the voice is OK only because the story is about its own product (OnStar Smart Driver); otherwise "one carmaker". The FTC releases don't name the brokers; LexisNexis and Verisk are named in GM's own statement (claim 20) and the NYT/KBB reporting.

## 19. One driver's file: 640 trips, every hard brake, a 21% rise (NYT reporting)

- **Script (expected, optional):** "One driver asked a data broker for his file. It listed 640 trips: every hard brake, every fast start."
- **Status:** 🟡 plausible (NYT not opened; same-day secondary)
- **Source (primary, not opened):** [Automakers Are Sharing Consumers' Driving Behavior With Insurance Companies](https://www.nytimes.com/2024/03/11/technology/carmakers-driver-tracking-insurance.html), Kashmir Hill, The New York Times, 2024-03-11. URL taken from the href on news.uchicago.edu's clipping page (the tool cannot open nytimes.com); headline matches. Fact-check 2026-10-29: KBB links to NYT in text only, no href. Use the NYT link only for the headline/date; facts come from KBB. Search summaries of other outlets give "more than 130 pages" for the report versus KBB's "258 pages": don't quote a page count.
- **Source:** [Your Car May Snitch On Your Driving, Raise Your Insurance Costs](https://www.kbb.com/car-news/your-car-may-snitch-on-your-driving-raise-your-insurance-costs), Sean Tucker, Kelley Blue Book, 2024-03-11 (accessed 2026-10-29)
- **Quote (tool):** his LexisNexis report "included the dates of 640 trips, their start and end times, the distance driven." / insurance bill rose 21% in 2022 / Ford said it "does not transmit any connected vehicle data" to LexisNexis or Verisk.
- **Fact-check 2026-10-29 (KBB re-opened):** exact: "Kenn Dahl (real name, job not Beach) saw his car insurance bill jump 21% in 2022." "Reading it was a shock – 258 pages, it 'included the dates of 640 trips, their start and end times, the distance driven'…", continuing with an accounting of speeding, hard braking and sharp accelerations. The car is a "Chevrolet Bolt". KBB is a rewrite of the NYT story, so the 640/21% figures are 🟡 attributed ("according to the New York Times"). Legally sensitive (LexisNexis, GM): "his report listed 640 trips", never "GM caused his rate rise".
- **Note:** Search summaries of the NYT add "an accounting of any speeding, hard braking or sharp accelerations" and "258-page" report (snippet). Fact-checker: confirm from an NYT copy. The 21% rise had multiple factors per the agent ("a factor"); don't say the data *caused* it.

## 20. GM ended the program and cut off the brokers in 2024

- **Script (expected):** "That carmaker shut the program down in 2024."
- **Status:** ✅ verified
- **Source:** [GM Ends OnStar Driver Safety Program After Privacy Complaints](https://www.carriermanagement.com/news/2024/04/25/261534.htm), David Welch, Bloomberg via Carrier Management, 2024-04-25 (accessed 2026-10-29)
- **Quote (tool):** GM "ended Smart Driver, the company said in a statement Wednesday." / OnStar "had cut deals with LexisNexis and Verisk to share personal driving data"
- **Source:** [FTC finalizes 20-year GM, OnStar data collection order](https://www.repairerdrivennews.com/2026/01/27/ftc-finalizes-20-year-gm-onstar-data-collection-order/), Lurah Lowery, Repairer Driven News, 2026-01-27
- **Quote (tool):** GM "ended its relationships with LexisNexis and Verisk," (citing GM's release)
- **Fact-check 2026-10-29:** Carrier Management exact: "With complaints piling up in recent weeks, GM ended Smart Driver, the company said in a statement Wednesday." (2024-04-25, David Welch); "OnStar had cut deals with LexisNexis and Verisk to share personal driving data". Repairer Driven News: "ended its relationships with LexisNexis and Verisk." (attributed to GM's release; no admission or denial language). The Record (2024-06-11, Suzanne Smalley): Verisk statement "no longer receives this data from these automakers to generate Reports" and "no longer provides Reports to insurers"; Verisk "may have provided" reports. ✅.
- **Note:** GM's spokesperson gave 2024-03-20 as the date sharing stopped (snippet, Detroit Free Press via search).

## 21. A broker stopped; another still advertises car and app driving data to insurers

- **Script (expected):** "Brokers still advertise driving data from automakers and phone apps to insurers."
- **Status:** ✅ verified (company page, live 2026)
- **Source:** [LexisNexis Telematics OnDemand](https://risk.lexisnexis.com/products/telematics-ondemand), LexisNexis Risk Solutions, page ©2026 (accessed 2026-10-29)
- **Quote (tool):** "It is designed to deliver timely, normalized driving behavior data from U.S. automakers, mobile apps" "that participate in our telematics exchange." / "LexisNexis Telematics OnDemand is a consumer reporting agency product."
- **Source:** [Data broker shuts down product related to driver behavior patterns](https://therecord.media/data-broker-shuts-product-driver-patterns), Suzanne Smalley, The Record, 2024-06-11 (accessed 2026-10-29)
- **Quote (tool):** Verisk "received driving data from vehicles manufactured by General Motors, Honda, and Hyundai." / "Verisk no longer receives this data from these automakers to generate Reports" "and also no longer provides Reports to insurers."
- **Note:** The LexisNexis page shows Kia and Mitsubishi logos (tool). **Do not name those carmakers in the voice or say they currently share data**; a logo isn't evidence of current flows. Senators Wyden and Markey (2024-07-26) reported Honda (97,000 cars, $25,920) and Hyundai (1.7 million cars, $1,043,315.69) data sales to Verisk (press coverage only; senate.gov 403) 🟡.

## 22. Lawsuits and state action (status as of 2026-10)

- **Script (expected):** none needed. If used: "It's now in court."
- **Status:** 🟡 plausible (status details secondary)
- **Source:** [GM OnStar Class Action Lawsuit Will Proceed in Court](https://m.carcomplaints.com/news/2026/gm-onstar-class-action-lawsuit-proceed-in-court.shtml), David A. Wood, CarComplaints.com, 2026-05-03 (accessed 2026-10-29)
- **Quote (tool):** MDL No. 3115, N.D. Ga., Judge Thomas Thrash; more than 40 claims allowed to continue, including Stored Communications Act, Fair Credit Reporting Act and Federal Wiretap Act allegations. Search summaries date the order 2026-04-22 and say FCRA claims against LexisNexis and Verisk survived (snippet, Bloomberg Law).
- **Source (Texas v. Allstate/Arity):** [Allstate accused of quietly paying app makers for driver data](https://www.theregister.com/2025/01/14/allstate_accused_of_paying_app/), Thomas Claburn, The Register, 2025-01-14 (accessed 2026-10-29)
- **Quote (tool):** data included "mobile phone geolocation data, accelerometer data;" and "gyroscopic data"; apps named: Routely, Life360, GasBuddy, Fuel Rewards. Allstate: "Arity helps consumers get the most accurate auto insurance price."
- **Note:** Texas sued GM on 2024-08-13 (Deceptive Trade Practices Act) and Allstate/Arity on 2025-01-13 (Texas Data Privacy and Security Act, the first AG suit under a state comprehensive privacy law, per WilmerHale, snippet). The AG pages returned 402. Status: an unvetted tracker (texasdatalaw.com, 2026-10-13, snippet) says an April 2025 order dismissed claims for lack of personal jurisdiction and appeals were pending in May 2026; **not verified (❌ for any status claim)**. All are allegations; Allstate and GM dispute them.

## 23. The Driver Privacy Act covers the crash recorder, not phone apps (myth)

- **Script (expected, optional):** "The federal law people point to covers the car's crash recorder. Not your phone."
- **Status:** ✅ verified for scope / ❌ for "no federal law covers apps" (no source found stating that)
- **Source:** [Senate Report 114-147, Driver Privacy Act of 2015](https://www.govinfo.gov/content/pkg/CRPT-114srpt147/html/CRPT-114srpt147.htm), U.S. Senate Commerce Committee, 2015-09-28 (accessed 2026-10-29)
- **Quote (tool):** "The bill would establish that the owner or lessee of a motor vehicle owns the data contained within the vehicle's EDR." / "S. 766 would use the definition of EDR in section 563.5 of title 49 of the Code of Federal Regulations."
- **Fact-check 2026-10-29 (enacted text):** [49 U.S.C. 30101 notes, Cornell LII](https://www.law.cornell.edu/uscode/text/49/30101) reproduces Pub. L. 114–94, div. B, title XXIV, subtitle C, part I. §24301 is only the short title ("This part may be cited as the 'Driver Privacy Act of 2015'"). §24302(a): "Any data retained by an event data recorder" "regardless of when the motor vehicle in which it is installed was manufactured" "is the property of the owner" (lessee for leased vehicles); EDR defined by "section 563.5 of title 49, Code of Federal Regulations". §24302(b): data "may not be accessed by a person other than an owner or a lessee" unless a court authorizes it, the owner/lessee consents, a federal investigation/inspection (49 USC 1131(a), 30166), emergency medical response, or traffic safety research. The EDR rule's statutory basis is §24303 (per the 2024 Federal Register). The govinfo copy of the Public Law was truncated before Division B, so the Cornell US Code note is the opened source. Scope claim ✅. The "no federal law covers apps" part stays ❌ (no source).
- **Note:** Enacted as FAST Act (2015-12-04), Pub. L. 114-94. The report doesn't mention smartphone apps or telematics (tool). App data is governed by the program terms you accept, FCRA when a consumer reporting agency is involved, and state law.

## 24. California: insurers' devices may only count miles, not where you go

- **Script (expected, optional):** none in the main story; possible pinned comment ("Why it's not offered in California").
- **Status:** ✅ verified
- **Source:** [Cal. Code Regs. tit. 10, § 2632.5: Rating Factors](https://www.law.cornell.edu/regulations/california/10-CCR-2632.5), Cornell LII (accessed 2026-10-29)
- **Quote (tool):** "An insurer shall only use a technological device to collect information for determining actual miles driven under the Second Mandatory Factor." / "An insurer shall not use a technological device to collect or store information about the location of the insured vehicle."
- **Fact-check 2026-10-29:** Cornell re-opened; both sentences exact, at §2632.5(c)(2)(F)(i)(5)(a). Exception (b): "Nothing in this section shall prevent a motor club or insurer from using a technological device to collect information about the location of the insured vehicle as part of an emergency road service" program. No source says the rule is why Snapshot/Drivewise Mobile are unavailable in CA (Drivewise page: "not available in California and Alaska"); don't state the cause.
- **Note:** Matches Progressive's "Snapshot not available in CA" and State Farm's "Not available in CA and RI" (company). Currency of the Cornell copy not dated on page; Justia copy current through 2024-12-27 (snippet).

## 25. Contrast: a crash recorder keeps about 5 seconds before a crash; the app logs every trip

- **Script (expected, optional):** "Your car's crash recorder keeps five seconds before a crash. The app keeps every trip."
- **Status:** ✅ for "5 seconds before a crash" (today's rule). 🟡 for the 2028–2031 phase-in (2026 final rule FR 2026-09849 not opened: transportation.gov 403, public-inspection PDF binary; only search summaries). Fact-check 2026-10-29: Federal Register 2024-29862 re-opened; exact: "extending the capture and recording period for timed data metrics from 5 seconds of pre-crash data at a sample rate of 2 Hz" ... "to 20 seconds of pre-crash data at a sample rate of 10 Hz" and "The compliance date is September 1, 2027." (that date was later replaced, per search summaries only). Safe voice: "keeps about five seconds".
- **Source:** [Federal Register 89 FR, 2024-12-18, Event Data Recorders final rule (2024-29862)](https://www.govinfo.gov/content/pkg/FR-2024-12-18/html/2024-29862.htm), NHTSA (accessed 2026-10-29)
- **Quote (tool):** "extend the EDR recording period for timed data metrics from 5 seconds of pre-crash data at a frequency of 2 Hz" to "20 seconds of pre-crash data at a frequency of 10 Hz." / "In most cases, data are captured during events meeting a pre-determined threshold of severity." / statutory basis: "section 24303 of the Fixing America's Surface Transportation Act (FAST Act)."
- **Note:** The 2024 rule's original compliance date (2027-09-01) was replaced: a final rule published 2026-05-18 (FR doc 2026-09849) phases in 20 s from **2028-09-01** (25%) to 100% on 2031-09-01 (snippets; PDF not readable). So "about five seconds" is right for cars on the road today; "soon twenty" is the honest add-on. Also: EDRs only keep data around a triggering event; the app "logs every trip" is supported by Progressive's automatic trip detection (claim 1) and KBB's 640-trip file (claim 19, cars).

---

## Myths and what the evidence says (hook material)

| Myth | Evidence | Use |
| --- | --- | --- |
| "It has to plug into your car." | Phone-only apps (Progressive, Allstate); the accelerometer is in the phone. | The working hook. ✅ |
| "Hard braking means slamming the brakes." | CR 2021: a 6.6 mph/s stop was "just a typical stop at a stop sign or red light"; programs use 6–8 mph/s. | 🟡, attributed. |
| "It can only save you money." | Progressive: "about 2 out of 10 drivers actually get an increase"; State Farm "may increase or decrease"; NAIC "can also lead to higher premiums". | ✅ |
| "It listens to your calls / reads your texts." | Progressive: "does not know who you're calling"; it uses screen state and motion. | ✅ attributed. |
| "If you didn't sign up, your driving isn't scored." | FTC GM case; LexisNexis still sells automaker and mobile-app data. | ✅ (ending). |
| "Federal law protects your driving data." | Driver Privacy Act = EDR data only. | ✅ for scope. |
| "The car's black box records everything." | EDR keeps seconds around a crash (5 s now, 20 s phasing in from 2028). | ✅ |

## Visual beats for the director (what the phone "feels")

1. **Getting in (driver detection):** the phone in a pocket swings through a ~45° counter-clockwise twist as the driver sits, then a small leftward jerk for the seat belt. Detail box: a yaw dial turning, a "DRIVER?" chip flipping to "DRIVER". (Patent, 🟡: on-screen it's the general idea, no claim text.)
2. **Red light (hard brake):** the cupholder phone; an orange arrow pushes forward as the car slows; a speed readout drops 31 → 24 mph in one second, gauge needle crosses a 0.32 g line, an event pin drops on the route map. 🧮 values illustrative (🎭) unless tied to the 7 mph/s definition.
3. **Turn + phone pickup (gyroscope + screen):** at a corner the phone's gyroscope ring spins up ("hard cornering" pin); later the driver lifts the phone: three chips light in sequence (car moving ✓, phone moving ✓, screen on ✓) → "distraction" pin; tiny tap ripples on the gyro trace.
4. **Ending (no app at all):** a car with no phone; a thin orange line runs from the car's antenna to a broker building to an insurer, ending on a long scrolling file of trips (the 640-trip report).

## Numbers with scope (copy-paste safe)

- Hard brake: >7 mph in 1 s (Allstate definition, 2024); 6–8 mph in 1 s typical range (CR, 2021). 🧮 ≈ 0.32 g.
- Speeding: 8+ mph over the limit (State Farm, 2026 page); >80 mph (Allstate, 2024).
- Sensors: accelerometer/gyroscope "typically 10 Hz or higher" (CMT patent, 2020); GPS ~1 Hz (review, 2017).
- Price: $164 average sign-up discount, new customers; $328 average among those who earned a discount; ~2 in 10 get an increase (Progressive page, live 2026, excludes NC, HI, NY, MT). Up to 30% (State Farm, 2026 page).
- Adoption: 20% of customers, 30% of recent shoppers (J.D. Power 2026 Shopping Study, n = 12,437, Jan 2025–Jan 2026).
- FTC v. GM: complaint 2025-01-16; final order 2026-01-14; 5-year ban on sharing with consumer reporting agencies; 20-year consent requirement.
- EDR: 5 s pre-crash at 2 Hz (current); 20 s at 10 Hz phasing in 2028-09-01 → 2031-09-01.

## On-screen app name check (2026-10-30)

Invented on-screen app name: **"Tallo"**. Checked through web searches only (App Store/Google Play results, trademark aggregators, insurer, insurtech, telematics, car and fintech names).

- **"Tallo" is taken, in the US, by an app.** Tallo is a free student career platform (tallo.com, formerly STEM Premier, now part of Stride, Inc.), with an app and "2 million+" users. Sources: [Tallo help center](https://help.tallo.com/how-does-the-dashboard-work), [Tallo about page](https://tallo.com/about-us/), [Business Wire, 2020-07-08](https://www.businesswire.com/news/home/20200708005220/en/Surpassing-Million-Users-Tallo-Surges-Leading-Student-Career), [Stride, 2026](https://www.stridelearning.com/news/tallo-wins-2026-edtech-award-for-hiring-internships-and-apprenticeship-solution/). Not opened, only seen in search results (titles and summaries).
- **No collision found in insurance, cars, driving or finance.** Searches for "Tallo" with insurance, telematics, car, fintech or bank turned up only other names (Talage, Tala, Trov). Trademark aggregators showed Indian "TALLO" filings for clothing (registerkaro.in, apps #6970545/#6970546) and no US record. **The USPTO search itself (tmsearch.uspto.gov) was not opened**, since it's a script-driven search page; aggregator results are not a clearance.
- **Risk:** low legally, but a real US app with a teen and young-adult audience would be shown "tracking your driving". Recommend renaming.

Alternatives (same checks: plain-name search, plus the name with app/insurance/car/finance; no USPTO search opened):

| Name | Found | Verdict |
| --- | --- | --- |
| **Corlo** (recommended) | Only Lago del Corlo, a reservoir in Veneto, Italy. No app, insurer, car or finance brand. | Clean. Two syllables, reads "car"-adjacent without being a word. |
| **Tovra** | Only two small villages in Arkhangelsk Oblast, Russia (Wikipedia). No app or brand. | Clean. |
| **Mervo** | No exact hits (near misses: servo, MERV filter rating). | Clean. |

Rejected while checking: **Orvio** (existing iOS social app, listed on mwm.ai), **Plimo** (Korean plant-care app on Google Play), **Nelvo** (no hits, but too close to Novo, a US car-insurance brand at novo.us).
