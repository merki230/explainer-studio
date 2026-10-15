# Sources: phone-listening (Exhibit No. 001)

Researcher draft, 2026-10-15. Fact-checked 2026-10-15 (statuses below are the fact-checker's final ones; the FTC report, Panoptispy paper, Experian pages, Northeastern article and RFC 5737 were opened directly).
All sources were accessed 2026-10-15. All quotes are verbatim. Where a sentence was too long, it is quoted in pieces joined by "…".

## Fact-check summary (current script, 147 words, plus on-screen text)

Re-check after script revision (137 words): **PASS**, no ❌ remains. The on-screen sub-line "In one ad company's graph · US" is still 🟡 ("data company" is safer). The original BLOCKED note follows for history: one line (final sentence, "only needs"). Rows marked 🟡 are allowed only with the hedged wording given; the 126 million line and the "Regulators" line should be reworded as shown.

| Script line / on-screen text | Status | Entry | Fix |
|---|---|---|---|
| "Your phone is not listening to you. Probably not." | 🟡 | 1, 1b | Fine as worded; "Probably not" is the hedge. Study is Android-only, 2018. |
| "Researchers went looking for apps that secretly record you." (revised) | ✅ | 1 | Matches the paper's scope (images, video, audio, p. 33). Still Android-only, 2018, unstated. |
| "They found none sending audio." | ✅ | 1 | Verbatim: "no apps appeared to exfiltrate audio in our tests" (p. 40). Add "in their tests" if room. |
| "They did find analytics code inside some apps recording the screen." (revised) | ✅ | 1, 6d | Paper p. 47: third-party libraries record video of the screen; "instead" removed. Android, 2018 still unstated; acceptable. |
| "Same Wi-Fi. Same evening. Same couch." | ✅ as imagery | 2b | FTC p. 3 supports "IP + time of day" and "geolocation adds certainty". |
| "You never searched it. Your friend did." | 🟡 | 2 | A scenario, not a reported case. Keep it framed as the explanation that can fit ("So how did it know?"). |
| "Every device on your Wi-Fi often shares the same public address." | ✅ | 2 | FTC p. 3: "devices on the same local network often have the same public IP address". "often" is the source's word. Caveats (CGNAT, IPv6, VPN) in the note of 2. |
| "To an ad company, that can look like one household." | ✅ | 3 | FTC p. 3: "might infer ... belong to the same household". "can look" matches "might infer". |
| "Your friend's search can become your ad." | 🟡 | 2 | "can" is right. No source shows a visiting guest's search reaching a host; FTC p. 7 shows cross-person leakage between people in one household. |
| "Companies mix what you log into with what they guess." | ✅ | 6c | FTC p. 4: "companies often combine deterministic and probabilistic techniques". Script drops "often"; acceptable, but "often" is safer. |
| "Regulators have found this often happens without people knowing." | cut | 6b | Removed from the script; entry 6b kept for reuse. |
| "Now zoom out. One data company says it has 126 million US households on its map." (revised) | ✅ | 4 | Attributed ("says"), "data company", "US households". The "multiply that living room" implication is gone. |
| "It feels like mind reading." | ✅ | 6e | A feeling, not a claim. Nothing stronger implied. |
| "It isn't." / "It doesn't need your voice." | ✅ | 1, 2, 3 | Cross-device linking needs no audio (FTC p. 3). |
| "Sharing a Wi-Fi can be enough." (revised; was "It only needs to know…" ❌) | ✅ | 2 | "Can" matches FTC p. 3 ("might infer"). |
| On screen: counter 126,000,000 / "In one ad company's graph · US" | 🟡 | 4 | Number ✅ (Experian-reported, 2025-2026). Sub-line: Experian is a data and credit-reporting company, so "one data company's graph" is safer than "ad company". "US" is correct and must stay. |
| On screen: router callout "Same Wi-Fi / IP 203.0.113.42" | 🎭 | 5 | RFC 5737 documentation range, assigned to no one. ILLUSTRATIVE watermark must stay. |
| On screen: mic callout "Mic in use / Shows when an app uses the mic" | ✅ | 1c | iOS 14+ and Android 12+ only. Do not add "always" or "never lies". |
| On screen: search bar "coffee machine / NEVER SEARCHED" | 🎭 | 2 | Invented example, same as the spoken scenario. Needs the ILLUSTRATIVE watermark. |

---

## 1. No published test has caught apps secretly recording audio

- **Script:** "Your phone is not listening to you. Probably not." / "Researchers went looking for apps that secretly record what you say. They found none sending audio. They did find some apps recording the screen instead."
- **Status:** 🟡 plausible. "Probably not" is the hedge the evidence calls for. Do not make it stronger. "Found none sending audio" is ✅ (verified in the PDF, p. 40). "Went looking for apps that secretly record what you say" is 🟡: the paper's goal is exfiltration of "images, video, and audio" (p. 33), not speech only. "Some apps recording the screen instead" is 🟡: see 6d.
- **Source:** [Panoptispy: Characterizing Audio and Video Exfiltration from Android Applications](https://petsymposium.org/popets/2018/popets-2018-0030.php) (PDF: https://petsymposium.org/popets/2018/popets-2018-0030.pdf), Pan, Ren, Lindorfer, Wilson, Choffnes (Northeastern University and UC Santa Barbara), Proceedings on Privacy Enhancing Technologies, 2018 issue 4, pp. 33–50 (accessed 2026-10-15)
- **Quote:** "covering 17,260 apps from Google Play, AppChina, Mi.com, and Anzhi." / "We did not find any true positive audio files in our extracted dataset, i.e., no apps appeared to exfiltrate audio in our tests."
- **Source (lay summary):** [Is your smartphone spying on you?](https://news.northeastern.edu/2018/07/06/is-your-smartphone-spying-on-you/), Bill Ibelle, Northeastern Global News, 2018-07-06 (accessed 2026-10-15)
- **Quote:** "analyzed more than 17,000 of the most popular apps on the Android operating system." / "the researchers found no evidence of recorded conversations."
- **Checked (PDF opened directly):** the audio quote is on p. 40 (printed 40 of 33–50); the 17,260 count is in the abstract (p. 33); "9,100 apps (53% of our total dataset)" and the Monkey sentence are on p. 39; the "audio recording into a different format" caveat is on p. 46 (§8 Limitations). The Northeastern article quotes were re-verified.
- **Note:** Scope: Android only, apps from 2017–2018, four app stores. The study was Android-only, so "your phone" (an iPhone too) is broader than the evidence; the authors say iOS is future work (p. 47). Only 9,100 apps were tested while running ("We dynamically analyzed 9,100 apps (53% of our total dataset)"). Each test was automated and short ("interacting with an app using Monkey for 5,000 user events (lasting for 16 minutes at most)"). The authors say their method has blind spots: "an app could transform an audio recording into a different format … that our system does not detect." In short, they found no evidence of listening, which is not the same as proving there is none. Safe wording: "a study of more than 17,000 apps found none secretly recording." Do not say "proved".

## 1b. Researchers say they can't rule it out

- **Script:** Supports "Probably not." Use this if the script explains why the answer isn't "no".
- **Status:** ✅ verified
- **Source:** [Is my phone listening in? On the feasibility and detectability of mobile eavesdropping](https://depositonce.tu-berlin.de/items/38977cdb-a0a0-4c34-b1da-c3761cfbec5a/full), Jacob Leon Kröger and Philip Raschke (TU Berlin), DBSec 2019, Springer LNCS, pp. 102–120 (accessed 2026-10-15)
- **Quote:** "While confirming a lack of empirical evidence, we cannot rule out the possibility" … "sophisticated large-scale eavesdropping attacks being successful and remaining undetected."
- **Note:** This is the honest counterweight to 1. Together, 1 and 1b are the evidence for "probably".

## 1c. Phones show a light when an app uses the microphone

- **Script:** Not spoken. On screen: the mic dot and the callout "Mic in use" / "Shows when an app uses the mic" (the director has already replaced "This dot never lies").
- **Status:** ✅ verified for "shows when an app uses the mic" (iOS 14+, Android 12+). The old sub-line "This dot never lies" was ❌ unsupported and is gone. Apple and Android quotes re-opened and confirmed verbatim by the fact-checker. Note: the screen shows a generic "Mic in use" for a phone; keep it to iOS 14+/Android 12+ scope in the post description.
- **Source:** [About the orange and green indicators in your iPhone status bar](https://support.apple.com/en-us/108331), Apple Support, published 2026-05-27 (accessed 2026-10-15)
- **Quote:** "With iOS 14 or later, an orange dot, an orange square, or a green dot indicates when the microphone or camera is being used by an app." / "An orange indicator means the microphone is being used by an app on your iPhone."
- **Source:** [Behavior changes: all apps (Android 12)](https://developer.android.com/about/versions/12/behavior-changes-all), Android Developers, Google, undated page (accessed 2026-10-15)
- **Quote:** "On devices that run Android 12 or higher, when an app accesses the microphone or camera, an icon appears in the status bar."
- **Note:** Only iOS 14+ and Android 12+. Android's platform docs ([Privacy indicators](https://source.android.com/docs/core/permissions/privacy-indicators), updated 2026-10-09) say the icon is shown for *nonsystem* app use and only when "The microphone is unmuted", so system components are excluded. 1b says undetected attacks can't be ruled out. **"This dot never lies" overclaims.** Recommend the director change the sub-line to something like "Shows when an app uses the mic" (that is the director's file, spec.ts).

## 2. Devices on the same Wi-Fi share one public IP address, and ad platforms use that to link them

- **Script:** "You never searched it. Your friend did. Same Wi-Fi." / "Every device on your Wi-Fi often shares the same public address." / "Your friend's search can become your ad." / "It doesn't need your voice. It only needs to know who shares your Wi-Fi." On screen: search bar "coffee machine / NEVER SEARCHED" and router callout "Same Wi-Fi / IP 203.0.113.42".
- **Status:** ✅ verified for "every device on your Wi-Fi often shares the same public address" (source word "often") and for "doesn't need your voice". 🟡 for "your friend's search can become your ad" and for the scenario "You never searched it. Your friend did." No source documents that chain end to end, and a one-evening guest is a weaker match than a housemate (the Tapad patent weights a link by sightings on one network "within a period of time (e.g., seven days)"). Keep "can". 🎭 for the coffee-machine search bar (invented example; ILLUSTRATIVE watermark). ❌ for "It only needs to know who shares your Wi-Fi": the FTC calls IP matching "a common method", one of several (logins, same unusual site combinations, geolocation). Safe wording: "Sharing a Wi-Fi can be enough."
- **Source:** [Cross-Device Tracking: An FTC Staff Report](https://www.ftc.gov/system/files/documents/reports/cross-device-tracking-federal-trade-commission-staff-report-january-2017/ftc_cross-device_tracking_report_1-23-17.pdf), US Federal Trade Commission, January 2017, printed p. 3 (PDF p. 9; the researcher's "p. 4" was wrong) (accessed 2026-10-15)
- **Quote:** "A common method of probabilistic tracking is IP address matching." … "Because devices on the same local network often have the same public IP address, the ad platform might infer that a computer, smartphone, and tablet that use the same public IP address belong to the same household."
- **Source (company patent):** [US11314838B2, System and method for analyzing user device information](https://patents.google.com/patent/US11314838B2), Tapad Inc. (assignee), Google Patents, priority 2011-11-15, granted 2022-04-26 (accessed 2026-10-15)
- **Quote:** "an identifier for the network (e.g., an IP address for the network, such as the IP address for a Wi-Fi router)" / "the weight for the connection 602 may be increased if device identifier A and device identifier B are seen … on the same residential network within a period of time (e.g., seven days)."
- **Source (peer-reviewed):** [A Privacy Analysis of Cross-device Tracking](https://www.usenix.org/conference/usenixsecurity17/technical-sessions/presentation/zimmeck), Zimmeck, Li, Kim, Bellovin, Jebara, 26th USENIX Security Symposium, 2017-08 (accessed 2026-10-15)
- **Quote:** "the similarity of IP addresses and Internet history for a user's devices gives rise to a matching rate of F-1 = 0.91"
- **Quote (cross-person, same source, p. 7):** "A teen who does not want her parents to know she is gay may be surprised to learn that her browsing behavior on her mobile device informs ads that appear on the household computer." This is the closest FTC support for "one person's search can show up on another person's device in the same home". It is a hypothetical in the report, not a measured case.
- **Exceptions worth knowing (not in the script):** (1) Carrier-grade NAT puts many subscribers behind one public IPv4 address: RFC 6888 describes "a public IPv4 address would be shared by many subscribers" and a CGN as "used to share the same IPv4 address among several subscribers" ([RFC 6888](https://www.rfc-editor.org/rfc/rfc6888), IETF, April 2013). So the same IP can also match strangers, which makes the link weaker, not stronger. (2) IPv6 gives devices their own addresses, and Experian's Digital Graph page says it covers "both IPv4 and IPv6". (3) A VPN hides the home address. So "often" is correct and "always" would be wrong. Do not change "often" to "every" or "always".
- **Note:** The FTC's wording is "might infer". The script should keep that probabilistic tone, which "can look like" in claim 3 already does. A patent shows a method a company claimed, not proof that it is in use today. The Zimmeck figure comes from a 126-person experimental dataset, not from industry. Don't quote 0.91 or "91%" on screen.

## 2b. Time of day is part of the signal ("Same evening")

- **Script:** "Same evening. Same couch."
- **Status:** ✅ verified, as "can".
- **Source:** FTC Cross-Device Tracking Staff Report, as in 2, printed p. 3
- **Quote:** "if a consumer's smartphone uses the same public IP address as her work computer during business hours, and then uses the same public IP address as her home computer during non-business hours, an ad platform might infer that the work computer, smartphone, and home computer belong to the same consumer." / "If the platform has access to geolocation information for the three devices, it may be able to ascribe more certainty to this inference."
- **Note:** This is the cleanest primary source for "IP plus time of day". "Same couch" stands for location: the FTC says geolocation can add certainty. Nothing says ad companies know about couches. It's fine as imagery.

## 3. "Household" is the industry's own unit, and ads can be shown to a whole household

- **Script:** "To an ad company, that can look like one household." / "Your phone. Your laptop. Your friend's phone. One home."
- **Status:** ✅ verified for "can look like one household" (FTC: "might infer"). 🟡 for the list "Your phone. Your laptop. Your friend's phone. One home." as a literal case: it is the FTC's computer/smartphone/tablet example applied to a guest. Fine as imagery with "can".
- **Source:** FTC Cross-Device Tracking Staff Report, as in 2, printed p. 3
- **Quote:** "the ad platform might infer that a computer, smartphone, and tablet that use the same public IP address belong to the same household."
- **Source (industry, trade press):** [The Trade Desk's Paula Bacariza Perez on Identity Graphs & The Graph of Graphs](https://www.exchangewire.com/tradertalk/2026/02/19/the-trade-desks-paula-bacariza-perez-on-identity-graphs-the-graph-of-graphs), Dana Lee, ExchangeWire, 2026-02-19 (accessed 2026-10-15)
- **Quote:** "households, linking devices and personas based on shared patterns like IP addresses." / "Devices are a deterministic construct, while personas and households are probabilistic"
- **Source (targeting the whole household):** Tapad patent US11314838B2, as in 2
- **Quote:** "or show an ad to everyone in the household of a gardener"
- **Note:** Industry names: "identity graph", "device graph", "household graph". The ExchangeWire quote is an executive describing identity graphs in general in an interview, not company documentation. The patent's example names a real retailer. Don't repeat it in the video.

## 4. Scale: "One company says its map covers 126 million homes" and the on-screen counter

- **Script (current):** "Now multiply that living room. One company says its map covers 126 million homes." On-screen counter: "126,000,000", sub-line "In one ad company's graph · US". (An earlier draft used an invented 12,000,000 and "Matched by network"; both are gone and were ❌.)
- **Status (126 million):** 🟡 plausible. The figure itself is ✅: Experian states "126 million U.S. households" for its identity graph, on a page published 2025-01-06 and updated 2026-10-05 (opened directly), and its Digital Graph product sheet (PDF, created 2025-08-20, opened directly) shows "126M households". The caveats are in the wording: (a) it is a vendor's own marketing claim, so "one company says" is correct and must stay; (b) the unit is "U.S. households" (Experian's identity graph, "rooted in verified offline data"), and 126M is about 99% of the US total (about 127.5M, Census 2021), so it reads as "nearly every US home", not as a count of Wi-Fi matches; (c) Experian's sheet lists its signals as "CTV IDs, hashed emails, and cookieless IDs such as Unified ID 2.0 and ID5", with no mention of IP or Wi-Fi. "Multiply that living room" followed by 126 million implies the Wi-Fi mechanism scales to that figure. No source says so. (d) "Homes" is looser than "households" and "ad company" is looser than "data company". (e) Not "current" beyond what Experian publishes: it is a 2025-2026 claim, unaudited.
- **Hedged wording that makes it ✅:** "One data company says its graph covers 126 million U.S. households." Drop "multiply that living room" or put the pause before it so it does not read as 126 million Wi-Fi matches. Keep "US" on screen.
- **Status (spoken line "millions of homes", old draft):** superseded.
- **Option A, vendor household graph (recommended if a real number is wanted):** [Introducing Experian's data marketplace](https://www.experian.com/blogs/marketing-forward/experian-unveils-new-data-marketplace-revolutionizing-addressability-across-display-mobile-and-ctv/), Experian, published 2025-01-06, updated 2026-10-05 (accessed 2026-10-15)
- **Quote:** "126 million U.S. households, 250 million individuals, and more than four billion active digital IDs."
- **Supporting:** [Experian Digital Graph: Solving signal fragmentation](https://www.experian.com/blogs/marketing-forward/experian-digital-graph-next-generation-signal-fragmentation-advertising/), Experian, published 2024-06-13, updated 2026-10-05: "as well as both IPv4 and IPv6, which are becoming more and more prevalent." The [Digital Graph product sheet (PDF)](https://www.experian.com/content/dam/marketing/na/assets/ems/marketing-services/documents/product-sheets/Graph_product_sheet.pdf), Experian, 2025-08, lists "126M households".
- **Note on A:** This is a company's own marketing claim (US, 2025–2026), not an audit. It counts households in Experian's identity graph. **No source says those 126M were "matched by network" (IP) alone**, so the old sub-line "Matched by network" was ❌ and has been replaced by "In one ad company's graph · US" (🟡, see status above). The fact-checker opened the Experian pages and the product sheet; the figure is as quoted. It names a company in the post description (see legal flags).
- **Option B, neutral baseline (no company named):** [Computer and Internet Use in the United States: 2021 (ACS-56)](https://www2.census.gov/library/publications/2024/demo/acs-56.pdf), Daniela Mejía, US Census Bureau, 2024-06 (accessed 2026-10-15)
- **Quote:** "90 percent had a broadband internet subscription" (Highlights: among all US households, 2021). Table 1 gives 127,545 thousand total households (about 127.5 million, US, 2021).
- **Note on B:** Census "broadband" includes cellular data plans, so it isn't the same as home Wi-Fi. Don't multiply 90% by 127.5M on screen: that is our own calculation, not a published figure. If B is used, the honest counter is "127,000,000 US homes" with sub "US households, 2021". The point is "this is roughly every home", not "all of these are matched".
- **Option C:** 🎭 illustrative. Keep a round number under the ILLUSTRATIVE watermark, e.g. "millions" with no exact digits. Recommended only if the owner wants no company named.
- **Researcher recommendation:** A, with the corrected sub-line. Brand rule: one number per video, rounded, ✅ only.

## 5. On-screen IP address "84.112.7.20"

- **Script:** Not spoken. On screen in the router callout: now "IP 203.0.113.42" (was `84.112.7.20`).
- **Status:** 🎭 illustrative and now safe: 203.0.113.0/24 is the RFC 5737 documentation block ("No end party is to be assigned these addresses", opened and confirmed by the fact-checker). The ILLUSTRATIVE watermark must stay on. The old 84.112.7.20 belonged to a real ISP's customer range and must not return. IPv4 only: do not let the on-screen text imply that IPv6 homes behave the same.
- **Source:** [RIPE NCC RDAP lookup for 84.112.7.20](https://rdap.db.ripe.net/ip/84.112.7.20), RIPE NCC, record last changed 2021-12-14 (accessed 2026-10-15)
- **Quote:** "84.112.1.0 - 84.112.128.255" / country "AT" / name "UPC" / remarks "Magenta Telekom"
- **Source (replacement range):** [RFC 5737: IPv4 Address Blocks Reserved for Documentation](https://www.rfc-editor.org/rfc/rfc5737), IETF, 2010-01 (accessed 2026-10-15)
- **Quote:** "Three IPv4 unicast address blocks are reserved for use in examples in specifications and other documents." / "The blocks 192.0.2.0/24 (TEST-NET-1), 198.51.100.0/24 (TEST-NET-2), and 203.0.113.0/24 (TEST-NET-3) … are provided for use in documentation."
- **Note:** 84.112.7.20 is in a block registered to an Austrian consumer ISP (UPC / Magenta Telekom). It could belong to a real household right now. A video about tracking shouldn't point at a real subscriber's address, and showing it invites "that's my IP" comments. Recommend **203.0.113.42** (or any address in 203.0.113.0/24), which can never be assigned to anyone. That is a director change in spec.ts. The ILLUSTRATIVE watermark stays on either way.

## 6. Other claims the expanded script is likely to make

### 6a. "Ads follow you across your devices"

- **Status:** ✅ verified, as "companies can link your devices" (not in the current script; kept for reuse).
- **Source:** [FTC Releases New Report on Cross-Device Tracking](https://www.ftc.gov/news-events/news/press-releases/2017/01/ftc-releases-new-report-cross-device-tracking), FTC press release, 2017-01-23 (accessed 2026-10-15)
- **Quote:** "cross-device tracking associates multiple devices with the same consumer and links a consumer's activity across her devices"

### 6b. "You were never told" / people don't know it happens

- **Script:** "Regulators have found this often happens without people knowing."
- **Status:** 🟡 plausible. The finding is real and "often" is the FTC's word, but: (1) "Regulators" is plural; it is one US regulator, and the document is an FTC **staff** report (from a 2015 workshop plus staff research), not a Commission ruling or an enforcement finding; (2) it is from 2017; (3) "this" in the script refers to a friend's search becoming your ad, whereas the FTC finding is about cross-device tracking generally. Hedged wording that makes it ✅: "A US regulator found in 2017 that tracking across devices often happens without people knowing."
- **Source:** FTC press release, as in 6a (opened; the sentence is confirmed, FTC page dated 2017-01-23)
- **Quote:** "cross-device tracking often takes place without consumers' knowledge."
- **Source:** FTC Staff Report, as in 2, printed p. 7 (PDF p. 13)
- **Quote:** "Consumers may also be unaware of the potential scope of cross-device tracking."
- **Source:** FTC Staff Report, printed p. 6 and p. 8
- **Quote:** "the practice of cross-device tracking is often not obvious, consumers may be surprised to find that their browsing behavior on one device will inform the ads they see on another device." (p. 6) / "FTC staff's review of privacy policies for one hundred top websites found minimal explicit disclosure to consumers" (p. 8; "only three" of 100 mentioned third-party cross-device tracking).
- **Note:** The p. 8 policy review is the only hard measurement, and it covers privacy policies of 100 top websites in 2016, not people's awareness.

### 6c. "Companies mix login data with guesses"

- **Script:** "Companies mix what you log into with what they guess."
- **Status:** ✅ verified. Deterministic = "through a consumer-identifying characteristic, such as a login" (p. 2-3); probabilistic = "infer which consumer is using a device, even when a consumer has not logged into a service" (p. 3). "Guess" is a lay word for "infer". The script drops "often", which is acceptable but "often" is the source's hedge.
- **Source:** FTC Staff Report, as in 2, printed p. 4 (PDF p. 10)
- **Quote:** "To improve the accuracy of their cross-device tracking models, companies often combine deterministic and probabilistic techniques."

### 6d. "What the Northeastern study found instead: apps recording the screen"

- **Script:** "They did find some apps recording the screen instead."
- **Status:** 🟡 plausible. The finding is real (verified in the PDF) but the script wording drops three qualifiers: it is Android only; the recording is done by third-party analytics libraries inside apps, not by the app makers' own listening code; and it is from 2018 (Google was notified and the named app removed the library). "Instead" implies a trade for audio, which the paper does not claim. Counts: of 21 cases of media in app traffic, the paper calls 12 leaks (Table 5), a handful of them screen captures (GoPuff/Appsee video, SAHIC/TestFairy screenshots, Hound screenshot), so "some" is fair. Hedged wording that makes it ✅: "They did find some apps recording the screen, through analytics code inside them."
- **Source:** Panoptispy, as in 1, printed p. 47 (Conclusion), opened directly
- **Quote:** "Importantly, we find that third-party libraries record a video of a user's interaction with an app"
- **Source:** Northeastern Global News, as in 1
- **Quote:** "We found that every app has the ability to record your screen and anything you type," (David Choffnes)
- **Note on that quote:** it says "ability", not that every app does. Do not use it to say apps do record the screen. The paper itself says the screen-capture APIs "have other uses besides recording the screen" (p. 42).
- **Note:** The paper names the analytics vendor and the app involved (Appsee, GoPuff). Don't name them in the video. That was 2018, and Google was notified.

### 6e. "It feels like mind reading": the frequency illusion

- **Script:** "It feels like mind reading. It isn't."
- **Status:** ✅ for the script as worded: "feels like" is a feeling, not a claim, and the script does not assert the frequency illusion as the cause. The frequency illusion itself stays 🟡 if it is ever added: it explains *part* of the feeling, and no source measures how much of the "my phone heard me" effect it explains. The Language Log post is a 2005 linguist's blog, not a study.
- **Source:** [Just between Dr. Language and I](https://languagelog.ldc.upenn.edu/myl/languagelog/archives/002386.html), Arnold Zwicky, Language Log (reprinting his ADS-L post), 2005-08-07 (accessed 2026-10-15)
- **Quote:** "once you've noticed a phenomenon, you think it happens a whole lot, even "all the time"."
- **Note:** Also called the Baader-Meinhof phenomenon. Use it as a hedge only: "Some of it is just noticing."

### 6f. Meta and Apple deny using the mic for ads

- **Status:** ✅ verified *that they say so*. Don't present it as proof.
- **Source:** [Facebook Does Not Use Your Phone's Microphone for Ads or News Feed Stories](https://about.fb.com/news/h/facebook-does-not-use-your-phones-microphone-for-ads-or-news-feed-stories/), Meta Newsroom, 2016-06-02, updated 2023-04-05 (accessed 2026-10-15)
- **Quote:** "Facebook does not use your phone's microphone to inform ads or to change what you see in News Feed."
- **Source:** [Our longstanding privacy commitment with Siri](https://www.apple.com/newsroom/2025/01/our-longstanding-privacy-commitment-with-siri/), Apple Newsroom, 2025-01-08 (accessed 2026-10-15)
- **Quote:** "Apple has never used Siri data to build marketing profiles, never made it available for advertising,"
- **Note:** These are company statements. Use them only for myth context, if at all.

---

## Myths and the strongest counter-evidence

| Myth | What the evidence says | Source |
|---|---|---|
| "My phone's mic is always on, sending what I say to advertisers." | The largest academic test (17,260 Android apps, 2018) found no app sending audio. Researchers say it can't be fully ruled out (1b). | 1, 1b |
| "Then how did it know? It must have heard me." | Your devices, and everyone's on your Wi-Fi, share one public IP. Ad platforms may treat them as one household (FTC 2017). Someone else's search can colour your ads. | 2, 3 |
| "A marketer admitted it: Cox Media Group's 'Active Listening'." | In 2023–24, 404 Media reported a CMG pitch deck claiming it could "target adverts based on what potential customers said out loud near device microphones" ([404 Media, Joseph Cox, 2024-08-26](https://www.404media.co/heres-the-pitch-deck-for-active-listening-ad-targeting/)). The reporting covers a *sales claim*. No source found shows the product worked as pitched, and Google removed CMG from its Partners Program after being asked. **This is the strongest pro-myth evidence. It is legally sensitive and should not be in a 60-second script.** | lead only, not fact-checked |
| "Siri was caught listening for ads; Apple paid $95M." | Apple settled *Lopez v. Apple* (N.D. Cal.) for $95M over **unintended Siri activations**. Apple "denies all of the allegations" ([NBC Bay Area, 2026-02-20](https://www.nbcbayarea.com/news/tech/apple-settlement-95-million-payments/4040274/)) and says it "has never used Siri data to build marketing profiles" (6f). A settlement is not a finding. | 6f; lead only |
| "The mic dot proves nothing is listening." | The dot is real on iOS 14+ and Android 12+ (1c). It is a strong signal, but not proof (1b, and the Android caveats in 1c). | 1c |
| "A small experiment proved phones listen." | Leads only, not sourced here: Vice's 2018 five-day personal test claimed yes. Wandera's 2019 two-room test (reported by BBC, Help Net Security) found no pet-food ads and no data spikes. Both are small and neither is peer-reviewed. I could not open a primary Wandera source, so don't cite either. | ❌ not sourced |

## Suggested angles and hooks

1. **The roommate, not the microphone** (current script; brand pattern 1, "the gentle denial"). Hook: "Your phone is not listening to you. Probably not." Turn: "You never searched it. Your friend did. Same Wi-Fi." Facts: 1, 2, 3 (FTC "same public IP address belong to the same household").
2. **The router is the snitch** (pattern 3, "the wrong recipient"). Hook: "Your Wi-Fi router has one address. Every phone in your home wears it." Turn: "To an ad company, everyone on it looks like one household." Facts: 2 (FTC "same local network often have the same public IP address"; Tapad patent "IP address for a Wi-Fi router"), 2b (time of day). Payoff and loop: "…so it's not listening. It's counting who's home. Your phone is not listening to you."
3. **They looked for ears and found eyes** (pattern 2, "the impossible coincidence"; a twist, but riskier). Hook: "Researchers tested 17,000 apps for secret listening. They found something else." Facts: 1 and 6d (screen recording by third-party libraries, 2018). Weaker on the coffee-machine story. Better as a future exhibit, "No. 0xx · The Screen".

## Legal flags (named companies and people)

Risk levels from the fact-checker (low / medium / high), for entries that will appear in the post description. The script and screen name no company; the description will.

| Name | Where | Risk | Why |
|---|---|---|---|
| Experian | 4, Legal | **Medium** | The only company the spoken 126 million line points at. Source is its own marketing. Risk is implying Experian matches households by Wi-Fi/IP, which its own sheet does not say. Describe as "Experian says its identity graph covers 126 million U.S. households". |
| Tapad (patent), Experian (owner) | 2, 3 | Low-medium | A patent is a claimed method, not proof of practice. Cite as "Tapad patent US11314838B2". |
| US FTC | 2, 3, 6b | Low | Government report; quote accurately, say "staff report", date it 2017. |
| Northeastern / UC Santa Barbara researchers (Pan, Ren, Lindorfer, Wilson, Choffnes) | 1, 6d | Low | Peer-reviewed. Do not say "proved". Android only, 2018. |
| Kröger and Raschke (TU Berlin) | 1b | Low | Academic. |
| The Trade Desk, Paula Bacariza Perez | 3 | Low-medium | Individual named in trade-press interview about identity graphs in general. Not in the script; cite only if needed. |
| Apple, Google (Android) | 1c | Low | Own support pages, quoted as such. |
| Meta, Apple (denials) | 6f | Medium | Company statements and a settlement with no admission. Not in the script. |
| Cox Media Group (404 Media), Joseph Cox | table | **High** | Unproven allegation in press reporting. Keep out. |
| GoPuff, Appsee, TestFairy, SAHIC | 6d, paper | **High** | Named in the paper as having screen-recorded; 2018, since changed. Do not name. |
| Home Depot (in the patent example) | 3 | Medium | Real retailer in a patent example. Do not repeat. |
| Magenta Telekom / UPC | 5 | Low now | The IP is replaced by 203.0.113.42, so nothing points at them; keep it that way. |

- **Experian** (claim 4, option A): we cite its own marketing number. Don't say or imply on screen that Experian matches people "by Wi-Fi". The sub-line "Matched by network" has already been replaced.
- **Tapad / Experian** (patent, claims 2–3): a patent shows a claimed method, not current practice. In the description, cite it as "Tapad patent US11314838B2", not as "Tapad does X".
- **The Trade Desk** (claim 3): an executive interview in trade press, describing identity graphs in general.
- **Cox Media Group**: unproven allegations in press reporting. Keep it out of the script.
- **Apple / Meta**: company denials and a settlement with no admission of wrongdoing. Keep "settled" separate from "admitted".
- **Magenta Telekom / UPC Austria**: the current on-screen IP is in their customer range. Replace it (claim 5).
- **Home Depot and GoPuff/Appsee** appear inside sources as examples. Don't repeat them.
- Recommendation: the script names **no** companies. Named sources appear only in the post description.
