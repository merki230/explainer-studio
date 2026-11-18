# Sources: crash-detect (No. 020)

Researcher draft, 2026-11-16. There's no script yet, so the claims follow the owner-approved story order. **Story:** a phone sits in a cup holder during a crash. Several sensors must agree before it believes a crash happened, then it counts down and calls 911. The statuses are my starting confidence. The fact-checker sets the final ones.

**Owner-approved angle (2026-11-16):** how a phone tells a car crash from a dropped phone.
**Hook direction (replaced mid-task, per coordinator):** "Drop your phone and nothing happens. Crash your car with it in the cup holder, and it calls 911." **Read section H (hook check) before scripting.** The hook holds with "can" and a supported-phone scope. It is too flat as written in three places: "nothing happens" (the source says "shouldn't"), "in the cup holder" (no source names that spot; none requires a mount either), and "it calls 911" (only if nobody answers the countdown, and not every crash is detected).

Everything was accessed on 2026-11-16. **How to read the quotes** (same rules as `light-countdown/sources.md`):

- **(tool)** means the web tool's small model returned the quote from the page, and I asked for exact words. Re-open and re-quote before ✅. **(summary)** means the tool paraphrased; it is not a quote.
- **(snippet)** means I saw it only in a search-result summary and didn't open the page. It's a lead only (🟡 at best).
- **🧮** means our own arithmetic.
- **Couldn't open:** the WSJ article and video (Yahoo mirror redirects to a video page); the Colorado Sun original (I used KUNC's republication of the same story, credited to the Colorado Sun); Dayton Daily News on Kings Island (HTTP 429); Deccan Herald on Samsung (403); Zendrive's blog (DNS failure); the Google Store article on crash detection (body didn't load). **Not found:** any Apple or Google statement on where the phone must sit in the car (no mount requirement either); any official count of crashes detected, calls placed, or lives saved; a g-force number for Pixel; any official Samsung phone crash-detection feature.
- **No politics, no privacy beat.** The microphone line (claim 9) is technical; keep it that way.

---

## FACT-CHECK of script v1 (fact-checker, 2026-11-16)

**Verdict: FAIL (no ❌ claims, but two wording fixes are required before voice: L5 and L9). Four more are optional.** Lines 1-2 (owner-approved hook) need no change. Re-opened this session (tool = the page-fetch tool's small model; exact only where marked): Apple Support 104959 (re-quoted, exact), Apple Newsroom iPhone 14 release (re-quoted, exact), TechCrunch 2022-10-10 (re-quoted, exact), MacRumors 2022-09-30 (re-quoted, exact), KUNC/Colorado Sun 2023-01-04 (re-quoted, exact), ABC7 2022-10-10 (re-quoted, exact).

**Legally sensitive:** Apple is named in L10 (a company claim about its own product: "Apple says", attributed, fine). No other company or person in the voice. Don't voice Pixel or Google; the script doesn't.

**Settled questions**

- **L5 scope and 256 g.** "Up to 256 times the pull of gravity" is ✅ for the iPhone 14: Apple Newsroom 2022-09-07, "a new dual-core accelerometer capable of detecting G-force measurements of up to 256Gs" (G = standard gravity, so the gloss is right; "measures" for "capable of detecting" is fair; it's the sensor's range, not a crash's force). But the script says "iPhone 14 or later". Apple's 2022 release covers the iPhone 14 only. I found no Apple page confirming 256 g for iPhone 15 or 16 (only a retailer listing; not a source). The feature's scope ("14 or later") is ✅ (Apple Support 104959: "iPhone 14 or later (all models) with iOS 16 or later."). **REQUIRED:** the number must not be pinned to "or later".
- **L7 airbags, windows up.** ✅. TechCrunch (exact): "the barometer, which detects the change in pressure that occurs when airbags are deployed." and "if the car's windows are down, the change in barometric pressure will be too subtle to impact the reading." Apple Newsroom (exact): the barometer "can now detect cabin pressure changes". MacRumors gives the windows-up condition only as the WSJ's outline of sensors (paraphrase), so TechCrunch carries "if the windows are up" by contraposition. Script says "change", not rise: fine.
- **L8 microphone once driving.** ✅. MacRumors 2022-09-30 (exact, attributed to Apple): "The microphones are only turned on when driving is detected, and no actual sound is recorded, Apple says." TechCrunch doesn't say when the microphone is on (re-checked), so MacRumors is the source; the description should cite it.
- **L9 "A dropped phone gets the jolt but none of the other signs."** 🟡 as framing; the absolute "none" is the problem. TechCrunch's own example is a drop *in a moving car* ("simply dropping the phone in a moving car shouldn't accidentally trigger the feature"). There GPS shows high speed and the microphone is on, so a dropped phone can have other signs. Also, no source says a drop reaches the jolt level that counts; "gets the jolt" is unsourced as a size. Fair for a drop at home or on the pavement, not for every drop. **REQUIRED (minimal, one word):** "A dropped phone gets the jolt but usually not the other signs." (Keep "gets the jolt"; it is plain framing, 🟡.)
- **L10 "more than a million hours".** ✅ Apple Newsroom (exact): "Advanced Apple-designed motion algorithms trained with over a million hours of real-world driving and crash record data" (MacRumors also relays it as Apple's statement). "Apple says" keeps it attributed. "Taught the phone those signs" is a plain gloss of "trained algorithms"; fine. TechCrunch does not mention the million hours; don't cite it for that.
- **L11 roller coasters and ski slopes.** ✅ for "set off automatic 911 calls", ✅ for "first months". Roller coasters: ABC7 2022-10-10 (exact): "They've received at least six iPhone emergency calls since the new smartphone went on sale in September." and "The feature has set off false alarms for emergency personnel near Cincinnati's Kings Island amusement park." (also mentions Six Flags Great America near Chicago). Ski: KUNC/Colorado Sun 2023-01-04 (exact): "During a mid-December weekend the dispatchers at the Summit County 911 Center fielded 71 automated crash notifications" and "All of the automated 911 calls from skiers pouring into ski town emergency call centers this month". So October 2022 to January 2023, within about four months of the September 2022 launch. KUNC doesn't mention roller coasters; ABC7 doesn't mention skiers, so cite both. The ski notifications came from iPhones and Apple Watches (claim 19), so "set off automatic 911 calls" is fair for both groups.
- **L12-L13 timing and siren.** ✅ timing (Apple Support, exact): "When a severe car crash is detected, your iPhone or Apple Watch sounds an alarm and displays an alert for 10 seconds." / "If you're unresponsive, your device automatically calls emergency services after a 30-second countdown." / "During this countdown, your device makes loud whoops to get your attention." / "If you're able, you can choose to call emergency services or dismiss the alert." "Siren" is a gloss of "loud whoops"; 🟡, optional fix below. Don't voice 20 s or 40 s (older figure, and arithmetic).
- **L14 911 and the message.** ✅ with a note. The Apple page never says "911" (it says "emergency services"; "a single emergency number will be automatically dialed" where a country has several). 911 for the US is supported by Apple's VP ("false calls to 9-1-1", TechCrunch exact), ABC7 and KUNC (calls to 911 centers). Message: Apple Support (exact): "This message informs emergency services that your Apple device detected a severe car crash and that you're unresponsive." The page doesn't give the message's literal words, so "a message that there's been a severe crash" is a faithful paraphrase. Location (exact): the call "also shares your estimated latitude and longitude coordinates with a search radius." Whether the location is in the spoken message or sent alongside isn't stated; "with your location" doesn't say which, fine.
- **L15 texts, "if set up".** ✅ with a condition. Apple Support (exact): "If you've added emergency contacts, your device sends a message to share your location and let them know that you've been in a severe car crash." (Footnote: contacts aren't notified if Messages isn't the selected text app.) Apple doesn't say "text"/SMS; "message" is its word. "Your emergency contacts" already presupposes you have some, so the condition needn't be voiced; it is an optional hedge below.

**Required fixes (exact minimal wording)**

1. **L5:** "On an iPhone 14, one is a motion sensor that measures jolts up to 256 times the pull of gravity." (One change: drops "or later"; the 256 g figure is sourced to the iPhone 14 only. The "iPhone 14 or later" scope for the feature itself is fine and is sourced; if the director wants it voiced, L2/L3 could carry it, but nothing requires it.)
2. **L9:** "A dropped phone gets the jolt but usually not the other signs."

**Optional fixes (not required; the wording stays 🟡/✅ without them)**

- **L13** "loud siren" → "loud whoops" (Apple's word) or "a loud alarm". The siren is a gloss; a viewer won't be misled.
- **L15** add "if you've set any up": "It also texts your emergency contacts, if you've set any up." (Apple's condition; costs about 1 s.) Fine to leave in the description instead.
- **L4** "several of its sensors agree" is TechCrunch's "multiple data points at once", fair. Apple's Drance also called G-force "mostly" the core signal (search snippet only, not opened, so not used); never say "all of them must fire".
- **L2** "in the cup holder": 🟡 picture only (no source names a position and none requires a mount; Apple's engineers put phones "in many different places throughout the car"). Fine for the owner-approved hook; don't claim it was tested in a cup holder, and don't voice "only works in a cup holder" in any later line.

### Line table (script v1)

| Line | Claim | Status | Fix / note |
| --- | --- | --- | --- |
| L1 | Drop your phone and nothing should happen | ✅ | TechCrunch: dropping a phone in a moving car "shouldn't accidentally trigger the feature". "Should" matches. Owner-approved; no change. |
| L2 | Crash your car with it in the cup holder, and it can call 911 | ✅ / 🟡 cup holder | "Can" ✅ (Apple Support, call after countdown; US 911 via TechCrunch, ABC7, KUNC). Cup holder is a picture, not a sourced position. Owner-approved; no change. |
| L3 | How does the phone tell a crash from a drop? | ✅ | Question. |
| L4 | It waits until several of its sensors agree | ✅ | TechCrunch: "need to detect multiple data points at once"; Apple VP: "sensor fusion". Apple never says how many. |
| L5 | On an iPhone 14 or later, one is a motion sensor that measures jolts up to 256 times the pull of gravity | 🟡 → required fix | 256 g ✅ for iPhone 14 (Apple Newsroom, exact); no Apple source for 15/16. **"On an iPhone 14, ..."** |
| L6 | Another is GPS, which shows the car moving fast and then suddenly stopping | ✅ | TechCrunch: "the GPS to determine that the user is traveling at high speeds"; MacRumors: "Readings can be used to detect speeds prior to a crash" and sudden stop of movement (WSJ outline). Apple Newsroom: "the GPS for additional input for speed changes". |
| L7 | A third feels the air pressure in the car change when the airbags fire, if the windows are up | ✅ | TechCrunch (exact) as above; Apple Newsroom "cabin pressure changes". "Change" not "rise": correct. |
| L8 | The microphone listens for the sound of a crash once the phone knows you're driving | ✅ | MacRumors (Apple says): "only turned on when driving is detected". TechCrunch: "monitor for the sounds of a crash". |
| L9 | A dropped phone gets the jolt but none of the other signs | 🟡 → required fix | Absolute; TechCrunch's own drop example is in a moving car. **"...but usually not the other signs."** |
| L10 | Apple says it taught the phone those signs with more than a million hours of driving and crash data | ✅ attributed | Apple Newsroom (exact): "over a million hours of real-world driving and crash record data". |
| L11 | In the first months after launch, roller coasters and ski slopes set off automatic 911 calls | ✅ | ABC7 2022-10-10 (at least six calls, Kings Island) and KUNC/Colorado Sun 2023-01-04 (71 automated crash notifications, Summit County, mid-December weekend; "automated 911 calls from skiers"). Cite both. |
| L12 | It sounds an alarm and shows an alert for 10 seconds | ✅ | Apple Support (exact). |
| L13 | Then it counts down for 30 seconds with a loud siren | ✅ / 🟡 "siren" | Apple: "30-second countdown", "loud whoops". Optional: "loud whoops". |
| L13 | ...and you can still cancel | ✅ | Apple: "you can choose to call emergency services or dismiss the alert." |
| L14 | If nobody does, it calls 911 | ✅ | Apple: "your device makes a call to emergency services at the end of the countdown" if unresponsive; 911 = US emergency number (not named on Apple's page; TechCrunch/ABC7/KUNC). |
| L14 | ...and plays a message that there's been a severe crash, with your location | ✅ | Apple: the looped message says the device "detected a severe car crash and that you're unresponsive"; the call shares coordinates. |
| L15 | It also texts your emergency contacts | ✅ with a condition | Apple: "If you've added emergency contacts, your device sends a message..." Optional: "if you've set any up". |
| L16 | Has your phone ever sounded that alarm when you weren't in a crash? | ✅ | Question. |

**Description sources to carry:** Apple Support 104959; Apple Newsroom 2022-09-07; TechCrunch 2022-10-10; MacRumors 2022-09-30; ABC7 2022-10-10; KUNC/Colorado Sun 2023-01-04. Not used by the script, so keep out of the description: Google Pixel help, Samsung, WSJ junkyard test, satellite, 185-call figure.

---

## H. Hook check: "Drop your phone and nothing happens. Crash your car with it in the cup holder, and it calls 911."

| Part | Evidence | Status |
| --- | --- | --- |
| "Drop your phone and nothing happens" | TechCrunch 2022 (claim 11): the system "need[s] to detect multiple data points at once, so simply dropping the phone in a moving car shouldn't accidentally trigger the feature." Apple via MacRumors (claim 9): "The microphones are only turned on when driving is detected." Crash Detection is only for "severe car crashes" (Apple support, claim 3). iPhone has no fall detection of its own (that is Apple Watch, not covered here). No source says "nothing happens" flat; the source word is "shouldn't". | 🟡: fair as an everyday picture. Safer: "Drop your phone, and it shouldn't do a thing" or "Drop your phone, and it knows that's not a crash." |
| "Crash your car with it in the cup holder" | No Apple or Google page names a position, and none requires a mount (Apple support re-checked: "does not say where the iPhone must be in the car"; Google support: same). Apple's engineers: "We put iPhones in many different places throughout the car" while collecting crash data (TechCrunch, claim 6). One lead: Zendrive (a third-party telematics company, not Apple or Google) reportedly tested phones "in a mount, in a pocket, or in a cup holder" (snippet, not opened). | 🟡: the cup holder is a fair picture of "a phone loose in the car" because nothing requires a mount. Don't claim it was tested in a cup holder. |
| "...and it calls 911" | Apple: "If you're unresponsive, your device automatically calls emergency services after a 30-second countdown" (claim 12). Google: if you don't respond within 60 seconds, the phone tries to call emergency services (claim 13). In the US that's 911 (Apple's own VP says "false calls to 9-1-1", claim 6; Kings Island and Summit County calls went to 911, claims 18–19). But: only if you don't answer or cancel; only on supported phones (claim 1–2); "Crash Detection cannot detect all car crashes" (claim 15); WSJ junkyard test had misses (claim 16). | 🟡 → ✅ as "it can call 911" with "if you don't answer". ❌ as a flat promise for every crash and every phone. |

**Verdict:** the direction works with three small hedges: "can", a phone scope ("newer iPhones and Pixels" or "an iPhone 14 or later"), and the countdown ("if you don't answer"). The countdown is a natural part of the story anyway (beat 4), so the hook doesn't have to carry it if the next lines do. Hook variants are at the end.

## B. Beliefs to bust (myths)

1. **"A phone that drops on the floor would call 911."** No. It needs several signals at once (TechCrunch: "multiple data points at once"), the microphone only listens once driving is detected (Apple via MacRumors), and the GPS speed-then-sudden-stop isn't there. ✅ for "shouldn't" (claims 9, 11). This is the video's core.
2. **"It calls the moment you crash."** No. It sounds an alarm, shows an alert, counts down, and you can cancel. iPhone: 10-second alert, then a 30-second countdown with "loud whoops"; Pixel: 60 seconds (claims 12–13). ✅
3. **"It catches every crash."** No. Apple: "Crash Detection cannot detect all car crashes." Google: "Your phone may not be able to detect all crashes." A minor fender bender didn't trigger an Apple VP's own phone (claim 15). ✅
4. **"It's only a car thing, so it never misfires."** Roller coasters and ski falls set it off in 2022–23 (claims 18–19). ✅ Keep neutral.
5. **"No bars, no help."** On iPhone 14 or later, the crash notification "may be communicated" by satellite in the US and other listed countries (claim 14). 🟡 as hedged ("may").
6. **"It needs Location Services turned on."** Apple: the call shares your location "regardless of whether you have enabled Location Services" (claim 12). ✅ (Apple adds that location sharing varies by country.)

No survey measures any of these beliefs, so never say "most people think".

---

## Step 1: Which phones do it (US)

## 1. iPhone 14 and later, and Apple Watch Series 8 and later (also SE 2nd gen and Ultra), have Crash Detection, on by default

- **Script (expected):** "On an iPhone 14 or later, this is switched on out of the box."
- **Status:** ✅ verified
- **Source:** [Use Crash Detection on iPhone or Apple Watch to call for help in an accident](https://support.apple.com/en-us/104959), Apple Support, published 2026-05-07
- **Quote (tool):** "iPhone 14 or later (all models) with iOS 16 or later." / "On supported iPhone and Apple Watch models, Crash Detection is turned on by default." / "Your iPhone or Apple Watch can connect you to emergency services after a severe car crash, even if you're unresponsive."
- **Note:** Watch models (summary): Series 8 or later, SE (2nd generation), Ultra or later, watchOS 9 or later. The setting to turn it off is "Call After Severe Crash" under Emergency SOS (summary). Naming Apple is fine: the story is about its product.

## 2. Google Pixel phones (Pixel 4a and later) have Car Crash Detection in the US; it is set up in the Personal Safety app

- **Script (expected):** "Pixel phones have a version too."
- **Status:** 🟡 (official page is internally inconsistent, and a 2026 Google post adds a conflicting footnote)
- **Source:** [Get help in an emergency using your Pixel phone](https://support.google.com/pixelphone/answer/7055029?hl=en), Google Pixel Phone Help, no date shown (© 2026)
- **Quote (tool):** "On Pixel 4a and later, including Fold, Car Crash Detection is available:" / country list (tool, unquoted): Australia, Austria, Belgium, Canada, Denmark, France, Germany, India, Ireland, Italy, Japan, Netherlands, Norway, Portugal, Singapore, Spain, Sweden, Switzerland, Taiwan, UK, US / "Car Crash Detection is interoperable between Pixel Watches and Pixel phones if paired through Bluetooth."
- **Source (conflict):** [Explore the newest features coming to your Pixel devices in the June drop](https://blog.google/products-and-platforms/devices/pixel/june-2026-pixel-drop/), Mayra Fajardo, Google Keyword blog, 2026-06-16
- **Quote (tool):** "If your Pixel detects a severe car crash" ... "will call emergency services and simultaneously notify your chosen emergency contacts." / footnote 9: Car Crash Detection "only supported on Pixel Watch 2, Pixel Watch 3, Pixel Watch 4." / footnote 10: "Requires Bluetooth connection between Pixel phone and Pixel Watch."
- **Note:** The same help page also heads the after-crash section "Pixel 3 & later, including Pixel Fold". The June 2026 footnote probably scopes only the new watch-to-phone Emergency Sharing integration, but it reads as if crash detection is watch-only; I couldn't settle it. **It only works in the country of the phone's SIM, not while roaming, and not in Airplane mode or Battery Saver** (summary of the help page; exact: "Car Crash Detection doesn't work in Airplane mode, or when Battery Saver is on."). On by default: the page doesn't say; it describes a setup step, and it needs location, physical activity and microphone permissions (summary). Launched on Pixel in 2019 (9to5Google, Ben Schoon, 2022-09-07, [link](https://9to5google.com/2022/09/07/google-pixel-car-crash-detection/), tool: "Car Crash Detection has been available since 2019 on Pixel smartphones."). **Script advice:** if Pixel is named, say "Pixel phones have a version too" and keep every number (sensor, countdown) tied to the brand it comes from. Safest: tell the story on an iPhone and mention Pixel once.

## 3. Crash types: front, side, rear-end, rollover, in passenger vehicles

- **Script (expected, optional):** "front, side, rear or a rollover"
- **Status:** ✅ verified
- **Source:** Apple Support 104959 (claim 1)
- **Quote (tool):** "such as front-impact, side-impact, and rear-end collisions, and rollovers" / "Sensor data from your devices is used to detect severe car crashes."
- **Note:** Vehicles named (summary): sedans, minivans, SUVs, pickup trucks. "Severe" is Apple's word every time; keep it.

## 4. Samsung: no official phone crash-detection feature found

- **Script:** none. Don't mention Samsung.
- **Status:** ❌ for any claim that Samsung phones do it
- **Source:** none official. Leads only (snippets): a 2024 Smartprix piece about a "Car Crash Detect Wakeup" sensor found in Galaxy firmware that Samsung "had not yet enabled"; an April 2026 Samsung Community user post saying the S26 has no active crash detection. Samsung's One UI 8.5 announcements (Samsung Newsroom, opened via search summary) don't mention it.
- **Note:** Don't say "Samsung doesn't have it" either; I couldn't confirm a negative from an official page. Just leave Samsung out.

---

## Step 2: The sensors, and why several must agree

## 5. iPhone 14's sensors: a high-g accelerometer (up to 256 g) and a high dynamic range gyroscope, plus barometer, GPS and microphone; algorithms trained on over a million hours of driving and crash record data

- **Script (expected):** "Inside, a motion sensor can measure a jolt of up to 256 g, and Apple says its software learned from more than a million hours of driving and crash records."
- **Status:** ✅ verified (Apple press release)
- **Source:** [Apple introduces iPhone 14 and iPhone 14 Plus](https://www.apple.com/newsroom/2022/09/apple-introduces-iphone-14-and-iphone-14-plus/), Apple Newsroom, 2022-09-07
- **Quote (tool):** "a new dual-core accelerometer capable of detecting G-force measurements of up to 256Gs" / "a new high dynamic range gyroscope" / the barometer "can now detect cabin pressure changes" / the microphone "can recognize loud noises typified by severe car crashes" / "Advanced Apple-designed motion algorithms trained with over a million hours of real-world driving and crash record data"
- **Note:** Scope: iPhone 14 (2022). The "256 g" is the sensor's measuring range, not the force of a crash; don't say "a crash hits 256 g". "Trained with" is Apple's claim; attribute ("Apple says"). GPS in the release (summary): adds input for speed changes. Apple Watch Series 8 release (2022-09-07, [link](https://www.apple.com/newsroom/2022/09/apple-reveals-apple-watch-series-8-and-the-new-apple-watch-se/)) gives no g number; it says (tool) "data was collected from these new motion sensors at professional crash test labs."

## 6. Apple's engineers: "no silver bullet"; phones placed all over test cars in crash labs; sensor fusion to avoid false 911 calls

- **Script (expected):** "No single sensor decides. Apple's engineers put iPhones all over cars in crash labs to learn what a real crash looks like to each one."
- **Status:** ✅ verified (on-record interview)
- **Source:** [Apple offers a deeper dive into Crash Detection](https://techcrunch.com/2022/10/10/apple-offers-a-deeper-dive-into-crash-detection/), Brian Heater, TechCrunch, 2022-10-10
- **Quote (tool):** Ron Huang, VP Sensing & Connectivity: "There's no silver bullet, in terms of activating crash detection" / "We put iPhones in many different places throughout the car" / Kaiann Drance, VP Worldwide iPhone Product Marketing: "That's part of the sensor fusion and accuracy, because we don't want to be doing a lot of false calls to 9-1-1 when they're not necessary." / Apple implied more than "dozens" of crashes and "'thousands' of its own devices were used" / "We also look at DATA from the Department of Transportation or the NHTSA" ... "to understand what kinds of crashes are the leading causes of injuries."
- **Note:** Data came from phones on crash dummies, on the car and in mounts, plus cameras (summary). "Apple worked with a number of crash labs to gather the necessary data" (summary of the article's words). Name the engineers only if the script needs a person; "Apple's engineers" is enough. **Visual:** a crash-test sled with phones dotted around the cabin is a good Lab scene (style-guide "The Lab").

## 7. The barometer feels the air-pressure jump when airbags fire, but not if the windows are down

- **Script (expected):** "When the airbags fire, the air pressure in the cabin jumps for an instant, and the phone's barometer feels it."
- **Status:** ✅ verified for "detects the pressure change when airbags deploy"; 🟡 for "jumps for an instant" (no source describes the shape or size of the change)
- **Source:** TechCrunch 2022-10-10 (claim 6)
- **Quote (tool):** "the barometer, which detects the change in pressure that occurs when airbags are deployed." / "if the car's windows are down, the change in barometric pressure will be too subtle to impact the reading."
- **Source:** [Apple Responds to Video Testing Crash Detection Feature With Junkyard Vehicles](https://www.macrumors.com/2022/09/30/apple-responds-to-crash-detection-test/), Joe Rossignol, MacRumors, 2022-09-30 (relaying Apple's statement)
- **Quote (tool, re-checked 2026-11-16):** the earlier quote was not returned verbatim; the re-open gave only a paraphrase: the barometer can register an air-pressure change when airbags deploy with the windows up (the page is relaying the WSJ's outline of the sensors, not a direct Apple quote). Cite TechCrunch for the exact words on airbags and windows.
- **Note:** Safe wording: "the pressure in the cabin changes" or "the air pressure shifts". Don't give a number (none found) and don't say "rises" unless the fact-checker finds a source for the direction; airbags inflating in a closed cabin pushing pressure up is physics-plausible but unsourced here (🟡). The windows-down caveat is a nice fairness detail and shows why one sensor alone can't decide.

## 8. GPS: speed before the crash, then a sudden stop

- **Script (expected):** "GPS shows the car was moving fast and then stopped dead."
- **Status:** ✅ verified
- **Source:** MacRumors 2022-09-30 (claim 7)
- **Quote (tool):** "Readings can be used to detect speeds prior to a crash and any sudden lack of movement"
- **Source:** TechCrunch 2022-10-10 (claim 6). Quote (tool): "the GPS to determine that the user is traveling at high speeds"
- **Note:** No speed threshold is published; don't give one.

## 9. Microphone: listens for the loud sound of a crash, and only once driving is detected

- **Script (expected):** "Once it knows you're driving, the microphone listens for the bang of a crash."
- **Status:** ✅ verified (Apple's statement relayed by MacRumors; TechCrunch)
- **Source:** MacRumors 2022-09-30 (claim 7). Quote (tool): "The microphones are only turned on when driving is detected"
- **Source:** TechCrunch 2022-10-10. Quote (tool): "the microphone to monitor for the sounds of a crash"
- **Source:** Apple Newsroom 2022-09-07 (claim 5). Quote (tool): the microphone "can recognize loud noises typified by severe car crashes"
- **Note:** MacRumors also relays (summary) that the microphones don't record sound. Keep it technical; no privacy beat. This line is a direct answer to the drop myth: at home on the kitchen floor, the phone hasn't decided you're driving.

## 10. How the phone knows it's in a car: CarPlay or Bluetooth, road and engine noise, nearby Wi-Fi routers flashing past

- **Script (expected, optional):** "It even notices Wi-Fi networks rushing past the window."
- **Status:** ✅ verified for CarPlay/Bluetooth (quote); 🟡 for the noise and Wi-Fi details (summary only)
- **Source:** TechCrunch 2022-10-10. Quote (tool): "Bluetooth and Carplay are also used to determine that you're in a car, though neither are strictly necessary for the feature."
- **Note:** The tool's summary says Huang also cited road and engine noise and "rapid changes in nearby Wi-Fi routers"; I don't have those exact words. Re-quote before voicing. Apple's junkyard response (claim 16) shows the driving context matters: parked cars, no CarPlay, short drive, no alert.

## 11. Why a dropped phone doesn't trigger it: it needs several signals at once

- **Script (expected):** "A drop is one hard jolt. A crash is a jolt, a sudden stop from speed, a pressure change and a bang, all at once."
- **Status:** ✅ verified for "multiple data points at once" and "dropping shouldn't trigger"; 🟡 for the four-signal list as a recipe (Apple never says all four are required)
- **Source:** TechCrunch 2022-10-10 (claim 6)
- **Quote (tool):** "The system does, however, need to detect multiple data points at once, so simply dropping the phone in a moving car shouldn't accidentally trigger the feature."
- **Note:** The source's example is a drop *in a moving car*, which is even stronger than a drop at home. Apple doesn't publish which combination is needed, and the barometer can miss with windows down (claim 7), so never say "all five sensors must fire". Safe: "several signals have to agree" / "it waits for more than one sign". "A drop is one hard jolt" is a plain gloss (🟡, unsourced as a number; fine as framing).

---

## Step 3: What happens next

## 12. iPhone: alarm and alert for 10 seconds, then a 30-second countdown with loud whoops, then it calls emergency services, plays a looped message with your location, and texts your emergency contacts

- **Script (expected):** "It sounds an alarm and counts down. If nobody touches it, it calls 911 and plays a message saying there's been a crash, with your location."
- **Status:** ✅ verified
- **Source:** Apple Support 104959 (claim 1)
- **Quote (tool):** "When a severe car crash is detected, your iPhone or Apple Watch sounds an alarm and displays an alert for 10 seconds." / "If you're unresponsive, your device automatically calls emergency services after a 30-second countdown." / "During this countdown, your device makes loud whoops to get your attention." / "If you're able, you can choose to call emergency services or dismiss the alert." / looped message: "it plays a looped audio message to emergency responders and out loud over your device speakers." / "The message plays in the primary language of the country that you're in and repeats at five second intervals." / "The call will share your location regardless of whether you have enabled Location Services." / "your device sends a message to share your location and let them know that you've been in a severe car crash."
- **Note:** The message says a severe crash was detected and you're unresponsive, with estimated coordinates (summary). Contacts are messaged only if you've set up emergency contacts (and Messages is the text app; summary). Total time 🧮 about 40 s (10 + 30); say "counts down" and avoid the total, or "about 40 seconds" only as 🧮 with the fact-checker's OK. **Older numbers differ:** Apple's 2022 Watch release said "after a 10-second countdown"; the Colorado Sun (claim 19) said "a 20-second countdown". Use the current support page (2026-05-07). "Emergency services" = 911 in the US (claims 6, 18, 19).

## 13. Pixel: vibrates, sounds an alarm, asks if you need help; 60 seconds to respond; then speakerphone, a call to emergency services that says a crash happened and shares your approximate location

- **Script (expected, optional):** "A Pixel gives you a minute."
- **Status:** ✅ verified (for Pixel phones where available, claim 2)
- **Source:** Google Pixel Phone Help 7055029 (claim 2)
- **Quote (tool):** "If you respond within 60 seconds, you can choose to call emergency services or cancel the call." / "Your phone will turn on speaker phone automatically." / "This call uses Android's Emergency Location Service and may transmit info about where you are and what happened."
- **Note:** The message repeats and you can talk over it (summary). Weak network or an ongoing call may stop the call (summary). Since the June 2026 drop, it also notifies emergency contacts at the same time (claim 2, blog).

## 14. No cell signal: on iPhone 14 or later, the crash notification may go by satellite (US included)

- **Script (expected, optional):** "With no bars, a newer iPhone can try to send the alert by satellite."
- **Status:** 🟡 (Apple's own "may")
- **Source:** Apple Support 104959 (claim 1). Quote (tool): "Crash Detection notifications to emergency services may be communicated by the Emergency SOS via satellite system."
- **Source:** [Use Emergency SOS via satellite on your iPhone](https://support.apple.com/en-us/101573), Apple Support, published 2026-10-05
- **Quote (tool):** "an automatic Crash Detection or Fall Detection notification to emergency services may be communicated" (by an iPhone 14 or later, outside cellular and Wi-Fi coverage) / "iPhone 14 or later (all models)" / country list ends "Mexico, the Netherlands, New Zealand, Norway, Portugal, Spain, Switzerland, the U.K., and the U.S."
- **Note:** Launched in the US and Canada in November 2022 (Apple Newsroom 2022-09-07, tool: "Emergency SOS via satellite will be available to users in the US and Canada in November."). It's a notification by satellite, not a voice call; don't say "calls 911 by satellite". Pixel's crash section doesn't mention satellite (tool); say nothing about Pixel and satellite.

---

## Step 4: Limits and false alarms (fairness)

## 15. It can't catch every crash; a minor fender bender doesn't count

- **Script (expected):** "It's built for severe crashes, so a fender bender won't set it off, and both companies say it can miss some crashes."
- **Status:** ✅ verified
- **Source:** Apple Support 104959. Quote (tool): "Crash Detection cannot detect all car crashes."
- **Source:** Google Pixel Phone Help 7055029. Quote (tool): "Your phone may not be able to detect all crashes." / "High-impact activities could also trigger Car Crash Detection."
- **Source:** TechCrunch 2022-10-10. Quote (tool), Drance on a rear-end fender bender in New York: "My crash detection did not go off, because it's just one of those minor things"
- **Note:** "won't set it off" is one anecdote plus "severe" in every Apple description; safer: "isn't meant for a fender bender" (🟡 → ✅ as worded).

## 16. WSJ junkyard test (2022): it caught some crashes, not all; Apple said parked cars gave the phone too few signals

- **Script (expected, optional):** "When reporters crashed junkyard cars, the phones caught only some of them, and Apple said a parked car doesn't give the phone enough signals."
- **Status:** ✅ verified (MacRumors relaying WSJ and Apple's spokesman); WSJ original not opened
- **Source:** MacRumors 2022-09-30 (claim 7)
- **Quote (tool):** Apple's spokesman said "the testing conditions in the junkyard didn't provide enough signals to the iPhone" (to trigger the alert)
- **Note (summary):** Joanna Stern (WSJ) had a demolition-derby driver hit two unoccupied parked cars (a 2003 Ford Taurus and a 2008 Dodge Caravan) in Michigan; the iPhone 14 and Apple Watch Ultra detected only some crashes. Apple cited no CarPlay/Bluetooth connection and too little driving before the crash. Device-by-vehicle results differ between outlets; don't give them. This is the best real-world proof that *agreement* is the mechanism: a big hit alone wasn't enough.

## 17. Apple tuned it after false alarms: iOS 16.1.2 "Crash Detection optimizations" (Nov 2022)

- **Script (expected, optional):** "Apple tuned it with an update that fall."
- **Status:** ✅ verified (release notes); 🟡 for what changed (Apple didn't say)
- **Source:** [Apple Releases iOS 16.1.2 With Carrier Improvements and Crash Detection Optimizations](https://www.macrumors.com/2022/11/30/apple-releases-ios-16-1-2/), Juli Clover, MacRumors, 2022-11-30
- **Quote (tool):** "Crash Detection optimizations on iPhone 14 and iPhone 14 Pro models"
- **Source:** [Apple Responds to False Crash Detection Report](https://www.macrumors.com/2023/02/03/apple-responds-to-false-crash-detection-report/), Joe Rossignol, MacRumors, 2023-02-03
- **Quote (tool):** Apple is "aware that in some specific scenarios these features have triggered emergency services" / the feature has "already contributed to saving several lives."
- **Note:** Summit County's officials said the update didn't visibly cut ski calls at first (KUNC/Colorado Sun, claim 19). Don't claim the fix worked. "Saving several lives" is Apple's own claim; if used, attribute ("Apple says") and don't round it into a number.

## 18. Roller coasters (Oct 2022): at least six automatic 911 calls from riders near Kings Island, Ohio

- **Script (expected, optional):** "In its first fall, riders on roller coasters in Ohio set off automatic 911 calls."
- **Status:** ✅ verified (ABC7, local TV); WSJ original not opened
- **Source:** [iPhone 14 glitch is calling 911 while people ride rollercoasters](https://abc7news.com/post/iphone-14-theme-park-911-rollercoaster/12312377/), ABC7 News (no author shown), 2022-10-10
- **Quote (tool):** "at least six iPhone emergency calls" / "near Cincinnati's Kings Island amusement park"
- **Note:** The WSJ broke it (snippets: Warren County Communications Center; also Six Flags Great America near Chicago; Apple: "a million hours of crash data, real-world driving and crash-test labs"). Those details are snippet-only (🟡). Keep it neutral; a roller coaster is a fair picture of "big jolts plus speed then stop", so it shows why the design is hard.

## 19. Ski slopes (winter 2022–23): 71 automatic crash calls to one Colorado 911 center in a weekend, none emergencies; 185 in a later 10-day stretch

- **Script (expected, optional):** "One Colorado 911 center got 71 automatic crash calls from skiers in a single weekend."
- **Status:** ✅ verified for 71 (Colorado Sun via KUNC); ✅ for 185 (MacRumors relaying the NYT)
- **Source:** [Colorado ski town emergency dispatch centers fielding dozens of automated 911 calls from skiers](https://www.kunc.org/2023-01-04/colorado-ski-town-emergency-dispatch-centers-fielding-dozens-of-automated-911-calls-from-skiers), Jason Blevins, The Colorado Sun (republished by KUNC), 2023-01-04
- **Quote (tool):** "fielded 71 automated crash notifications from skiers' iPhones and Apple watches" / "None of them involved an emergency." / "begins a 20-second countdown in which users can cancel the 911 call." / Marc Wentworth, Vail public safety communications: "So the technology can be helpful." (two iPhones called at once; both users had been in car crashes)
- **Source:** MacRumors 2023-02-03 (claim 17). 185 crash notifications from January 13 to January 22 (2023), Summit County (summary of the article's figures; tool).
- **Note:** Scope: Summit County, Colorado, mid-December 2022 weekend, four ski areas. Phones *and* watches. The "20-second countdown" is the reporter's 2022 figure; Apple's current page is 10 + 30 (claim 12); don't voice 20. Fairness: Vail's two real crash calls are the balancing detail. No mocking; dispatchers' time is the real cost, and that can be said once neutrally.

## 20. Lives saved / calls made: no official numbers

- **Script:** none, or "Apple says it has already helped save lives" (attributed).
- **Status:** ❌ for any number. 🟡 for Apple's attributed "contributed to saving several lives" (claim 17).
- **Note:** Individual rescue stories exist (9to5Google relays a 2021 Pixel case: farm equipment overturned, owner unconscious, the phone had already contacted emergency services; "potentially saving the man's life", tool). One anecdote; no aggregate. No medical claims.

---

## Angles (2–3)

1. **The jury in the cup holder (recommended).** A crash isn't one signal; it's several that agree. Hook: "Drop your phone and it shrugs it off, but crash with it in the cup holder and it can call 911, because it waits for more than one sign." Mechanism: jolt (accelerometer), sudden stop from speed (GPS), cabin pressure change (barometer, airbags), the bang (microphone, only on once driving is detected). Picture: four orange traces lighting one by one, a verdict only when they line up.
2. **The airbag gives it away.** The least-known sensor: the barometer feels the airbags fire, which no drop can fake, and open windows can hide it. Hook: "Your phone can tell your airbags just went off without seeing them; it feels the air in the car change."
3. **Built in a crash lab.** Apple's engineers put phones all over test cars in crash labs, then had to tune out roller coasters and ski falls. Hook: "Before your phone could recognize a crash, engineers had to crash cars full of phones." Fairness beat built in (claims 6, 17–19).

## Visual notes (The Section, cut-open car)

- **Frame 0:** the cut-open car cabin, phone standing in the cup holder, screen facing the driver (style-guide: phones face their owners). Optional split for the hook: a kitchen floor with the same phone dropped, nothing lit, then the cabin.
- **Sensors as orange traces** (orange = the hidden system): four thin lines out of the phone: a spike (accelerometer), a speed line that falls off a cliff (GPS), a pressure bump (barometer), a sound burst (microphone, its trace starts only after a small "driving" tick). For the drop: only the spike fires; the others stay flat and grey. For the crash: all four light, then a single orange "agree" pulse.
- **Airbag pressure change:** airbag blooms, a soft ring of air pressure expands through the closed cabin and reaches the phone. Optional fairness shot: windows down, the ring leaks out (claim 7).
- **Countdown screen through the detail box:** generic UI, no Apple or Google look, no logos: a large countdown number, a "Crash detected" line, a slider to call and a cancel button. Show the alarm with a visual pulse (sound design: a siren whoop is fine, self-made). Then a call icon and a location pin.
- **Satellite (optional):** a thin orange line up from the car to a satellite when the bars drop.
- **The Lab (optional angle 3):** crash sled with phones taped around the cabin and dummy, cameras on the wall.
- **Wheels roll forward;** the crash should read as a believable front impact, no gore, no injured cast; the mannequin stays still, upright, then the phone does the talking.

## Script-safe lines

Each is ✅ or 🟡 with the hedge shown. Claims in brackets.

1. "Drop your phone, and it shouldn't do a thing." [11, 🟡 → ✅ with "shouldn't"]
2. "Crash with a newer iPhone in the cup holder, and it can call 911 for you if you don't answer." [1, 12; cup holder 🟡 as a picture, no position required]
3. "No single sensor decides; Apple's engineers say several signals have to agree." [6, 11]
4. "The motion sensor feels the jolt, and on an iPhone 14 it can measure up to 256 g." [5]
5. "GPS shows the car was moving fast, then stopped dead." [8]
6. "When the airbags fire, the air pressure in the cabin changes, and the phone's barometer feels it, as long as the windows are closed." [7]
7. "Once it knows you're driving, the microphone listens for the bang of a crash." [9]
8. "A drop is one hard jolt, with no sudden stop from speed and no airbag." [11, framing 🟡]
9. "Then it sounds an alarm and counts down, so you can cancel." [12, 13]
10. "If nobody touches it, it calls 911, plays a message that there's been a crash, and gives your location." [12; US = 911]
11. "With no bars, a newer iPhone may send the alert by satellite instead." [14, 🟡 "may"]
12. "Apple says it learned what a crash looks like from more than a million hours of driving and crash records." [5, attributed]
13. "It's meant for severe crashes, and both companies say it won't catch every one." [3, 15]
14. "In fairness, roller coasters and ski falls set it off in its first winter, and Apple tuned it with an update." [17–19]
15. "Pixel phones have a version too, and they give you a minute to answer." [2, 13; 🟡 Pixel scope]

**Don't say:** "every phone does this", "it never misfires", "it always calls", "a crash hits 256 g", "calls 911 by satellite", "it records you", any Samsung claim, any lives-saved number, "a 20-second countdown".

## Hook variants (owner's direction)

1. "Drop your phone and it shouldn't do a thing, but crash your car with an iPhone in the cup holder, and it can call 911 by itself." [11, 1, 12]
2. "Your phone can tell a crash from a drop: drop it and nothing should happen, crash with it in the cup holder and it can call 911 if you don't answer." [11, 12]
3. "Drop your phone on the floor and it shrugs it off, yet crash your car with it in the cup holder and a newer iPhone or Pixel can call 911 for you." [11, 1, 2, 12; Pixel 🟡]

Shortest honest form of the owner's exact line: **"Drop your phone and nothing should happen. Crash your car with it in the cup holder, and it can call 911."** (two changes: "should", "can"). Scope the phone in the next sentence ("On an iPhone 14 or later...") and the countdown in beat 4.
