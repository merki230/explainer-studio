# Sources: flock-camera

Researcher draft, 2026-11-03. There's no script yet, so the claims follow the agreed beat order: a car passes the pole → the camera wakes and takes stills (infrared at night) → the plate is read (OCR) → **the reveal: the car itself is described** (make, color, type, roof rack…) → search by description, even with no plate → the data path (solar, battery, cellular, upload, cloud) → how long it's kept and who decides → ending: a factual question to the viewer. Statuses are the researcher's starting confidence. The fact-checker sets the final ones.

Owner-agreed angle (2026-11-03): how Flock Safety's license-plate cameras recognise a car, including without the plate. Working hook B: "Flock cameras don't just read your plate. They can describe your whole car." **Verdict in section H: "describe your whole car" is not Flock's wording and overstates it. Use one of the replacements there.**

Everything was accessed on 2026-11-03. **How to read the quotes** (same rules as `insurance-app/sources.md`):

- **(tool)**: the web tool's small model returned the quote from the page. Re-open and re-quote before ✅.
- **(PDF text)**: I read the PDF's own text in full (Read tool). These quotes are exact.
- **(snippet)**: seen only in a search-result summary; the page wasn't opened. A lead only (🟡 at best).
- **Company claim (Flock)**: Flock's own statement. Script it as "Flock says…" or "the company's materials describe…", never as the narrator's fact. **Legally sensitive:** Flock is a named company in active public debate. Every Flock row below gives its exact wording and date. Keep the attribution in the voice.
- **Independent**: a US government document (DOJ/NIJ, DHS S&T).

**Owner guardrails (they apply to every row):** only how it works. No police cases or anecdotes, no immigration, no crime statistics or effectiveness claims, no "should towns have them", no politics. Flock's pages carry numbers like "1M+ cases supported in 2025" and "20% of cleared cases", and the NIJ guide has case stories and accuracy rates. **None of these may be used.** They're left out on purpose.

**Couldn't open or read:** amp.newsobserver.com (blocked by the tool; source of the 2024 Flock presentation quote "decals, bumper stickers, back and top racks"), minervapark.gov (403), flocksafety.com/devices/falcon-sr and the Flock "future of investigations" article (both 404), Google Patents (search page returned nothing, and **no Flock patent was found or opened**), the 2023 Flock blog post with "catalogs unique identifying features" (known only from a third-party glossary), and Flock's press release for "20 billion scans a month" (never found).

**Dating caution (Flock pages):** Flock's site shows two dates on many posts, "Published" and a later date beside the byline. Its LPR Policy says "Last Updated: June 30, 2026", yet it already states a 7-day default that Flock's own 2026-08-13 post announces as new. The page was probably edited without the date changing. **Don't quote a Flock page's date as the date of a retention claim. Use the 2026-08-13 announcement as the date of the change.**

---

## Script check (fact-checker, 2026-11-03, script.txt as of this date, 14 lines)

**Re-check 6 (12-line merged script): FAIL on one small fix, line 9 only. Everything else passes.** Line 9 puts our own mechanism ("the labels can match without the plate") inside "the company says". Flock says only "vehicle identification fills the gap" and "This works even when the vehicle does not have a readable plate". Fix: **"So, the company says, a paper, covered or missing plate doesn't stop it from finding the car. The labels can match without the plate."** (two sentences; the second is our explanation). Line status: 1-3 ✅/guess; 4 ✅ ("image analytics (not car registration data)", Langley letter, undated); 5 🟡 hedged general method (NIJ/DHS not re-read by me); 6 ✅ general method (cars196, Google, JIMET color; "newer" advisory only); 7 ✅ (KRS definition: make, color, date, time, GPS); 8 🟡 our explanation built on DHS + KRS, hedged with "can", allowed; 9 as above; 10-11 ✅ (2026-08-13, 2026-09-01 and 2026-07-27 posts); 12 ✅.

**Re-check 5 (mechanism rewrite, 13 lines, superseded): FAIL. Line 9 is ❌ as worded; lines 7, 8, 10 need wording fixes.** M3 quotes (cars196, Google) re-opened and exact. M4's DHS quote and the NIJ/DHS PDFs could not be re-read by me (binary). Flock still legally sensitive: lines 1, 2, 4, 11, 12 stay attributed.

| Line | Status | Fix (exact) |
| --- | --- | --- |
| 1-3 | ✅ / guess | None. |
| 4 | 🟡 | Letter says "based on image analytics (not car registration data)"; "taken as you pass" is not in it (it is true of Flock stills per the 2026-10-19 blog). Allowed. Better: "But a company letter says the details come from image analytics, not car registration data." |
| 5-6 | 🟡 hedged general method ("can") | None. NIJ/DHS not re-read by me. Allowed. |
| 7 | 🟡 | "Huge" is not shown (sets I opened: ~16,000 images). "Tell what kind of car yours is" overclaims accuracy and sits next to Flock lines, implying Flock's method (Flock says only "proprietary machine learning"). Also "new part" (advisory). Fix: **"The car is the newer part: software trained on large sets of labeled car photos can learn to tell a car's make and color."** |
| 8 | 🟡, roof rack ❌ in the narrator's voice | KRS lists make, model, color, date, time, GPS, plate number; roof rack is only Flock's claim (Evidence Policy, letter). Line 2's attribution does not carry to line 8. Fix: **"So a car can become data: the plate text, labels like make and color, and the time and place it passed."** (Roof rack stays in line 2 as the company's claim.) |
| 9 | ❌ as worded | Flock's claim ("vehicle identification fills the gap") put in the narrator's voice as a certainty ("doesn't hide the car"); the causal "because" is our inference, and several cars can share the same labels. Fix: **"So, the company says, a paper, covered or missing plate doesn't stop it finding the car: the labels can match without the plate."** |
| 10 | 🟡 | DHS supports query by criteria, time and place for plate characters only; "every saved sighting" implies unrestricted reach (Flock: access is per customer, sharing off by default). Fix: **"A search by description can then filter the saved sightings to the ones whose labels match, for a certain place and time."** |
| 11-12 | ✅ | None (scope and date match the 2026-08-13 and 2026-09-01 posts). |
| 13 | ✅ | None. |

**Final check (11-line script, superseded): PASS, no ❌.** Lines 1-4, 6, 8-10 ✅ or no claim (line 4 "a company letter" is the undated Langley letter; line 9 and 10 match the 2026-08-13, 2026-09-01 and 2026-07-27 posts; line 6 matches the LPR page). Line 5 stays 🟡 (hedged general method; NIJ/DHS PDFs not re-read by the fact-checker). Line 7 🟡 advisory: "they say" is fair for the 2026-02-06 Flock blog ("It can read paper, temporary, and covered plates") and the "Not All LPRs" page, but the blog is not a "product page"; "the company says" is safer. Line 11 presumes a camera near the viewer, which "If there's one near you" handles.

**Re-check 3 (script rewritten for tone, 12 lines, superseded): FAIL until lines 4 and 9 are fixed; no ❌ elsewhere.** Documents named in the voice: the Langley letter (undated; Los Gatos and Sussex copies), the Flock LPR product page and "Not All LPRs" page, the Evidence Policy, and several blog posts. "The company's own documents" (line 2) fairly covers that mix: make/color on the LPR page, roof rack in the Evidence Policy and the letter. "The documents" (line 4) and "the same documents" (line 9) do not: line 4's "not car registration data" is in one source only (the letter), and line 9's cell and cloud facts come from different pages (Meet Flock FAQ ©2022, Evidence Policy, letter).

| Line | Status | Fix (exact) |
| --- | --- | --- |
| 1-3 | ✅ / n/a | None. Line 3 is a guess. |
| 2 | ✅ | None. Optional: "materials" for "documents". |
| 4 | 🟡 over-pluralised | **"A company letter says the make and color come from the photo itself, not from car registration data."** (Only the Langley letter says it; undated.) |
| 5 | 🟡 general method, hedged | None. NIJ/DHS PDFs still not re-read by me. |
| 6 | ✅ | "The company's product pages" is right: LPR page "make, color, and body type" and the "Not All LPRs" page "make, color, body type". |
| 7 | ✅ | Optional: "they say" → "the company says" (no clear referent). |
| 8 | ✅ | None. |
| 9 | ❌ as worded ("the camera on your street" is an unsupported fact about the viewer, and "same documents" is wrong) | **"The company's materials say its cameras connect over a cell network and send the photos to the cloud."** Still a joined inference (LTE enabled + "transmits and stores the images in the cloud"), attributed. Dropping "encrypted" removes no risk. |
| 10 | ✅ | None. Scope and date match the 2026-08-13 and 2026-09-01 posts. |
| 11 | 🟡 | "Policy" is too narrow: "Customers also control how long their data is kept" and "in accordance with their policies and legal requirements" are blog posts. **"The company says whoever runs the camera can pick a different number, within the law."** "Within the law" is fair. |
| 12 | 🟡 advisory | Presumes a camera near the viewer. **"If there's a Flock camera near you, do you know which number it uses?"** (Flock named only if the owner allows; else "If there's one near you, do you know which number it uses?") |

**Re-check 2026-11-03 (script then 13 lines, superseded): PASS, no ❌.** Line numbers below the re-check table refer to the earlier 14-line script and are kept as the record of the first pass. Re-check table (13-line script):

| Line | Text (short) | Status |
| --- | --- | --- |
| 1-2 | "don't just read your plate" / "Flock says … make, color and even a roof rack" | ✅ |
| 3 | "You'd guess a camera on a pole … registration records" | n/a, a guess; pole is imagery |
| 4 | "Flock says … not from car registration data" | ✅ Flock: "based on image analytics (not car registration data)" (Langley letter, Sussex page, undated) |
| 5 | "most plate readers use infrared so the letters stand out" | 🟡 general method (NIJ 2012: "most systems incorporate an illuminator"). NIJ/DHS PDFs still not re-read by me. Hedged correctly, not attributed to Flock. Allowed. Would be ✅ after a PDF re-read of NIJ p. 6 |
| 6 | "The company says its software also reads the body type" | ✅ LPR page: "make, color, and body type" |
| 7 | "Flock says its plate cameras don't use facial recognition or identify the driver" | ✅ "Flock LPR cameras do not use facial recognition or identify drivers." (2026-10-19) |
| 8 | "Even when the plate is paper, covered or missing, Flock says it can still pick out the car" | ✅ "vehicle identification fills the gap"; "does not have a readable plate" |
| 9 | "Flock says a user can search by description alone and save that search as an alert" | ✅ blog: "vehicle descriptions alone"; letter: "'Save Search' … set up alerts" |
| 10 | "Flock says the camera sends the photos, encrypted, over a cell connection to the cloud" | 🟡 inference (LTE enabled + "transmits and stores the images in the cloud, fully encrypted"); attributed, no opened sentence joins them. Allowed with the attribution; ✅ if reworded "Flock says its cameras are LTE enabled and send the photos, encrypted, to the cloud" |
| 11 | "used to be thirty days, and since August 2026 it's seven for new police customers" | ✅ scope and date match the 2026-08-13 and 2026-09-01 posts. Note "Flock's default" is right (customer owns the data) |
| 12 | "Flock says whoever runs the camera can pick a different number" | ✅ "Customers also control how long their data is kept"; "Local agencies set their LPR data retention period…" |
| 13 | "Do you know which number the camera near you uses?" | n/a, a question; no claim |

**First-pass verdict (superseded): FAIL (blocked until lines 5, 6, 10, 12 and 13 were reworded; wording below).** Every Flock row is **legally sensitive** (named company in active public debate): keep "Flock says" and Flock's own nouns.

**Re-open log.** Re-opened and re-quoted today (web tool): Flock blog "How Flock LPR cameras work" (2026-10-19), Flock guardrails post (Langley; "Published: August 13, 2026", page also shows November 3, 2026), private-sector post (2026-09-01 / 2026-10-27), "Customers own and control" (2026-07-27 / 2026-10-27), Flock LPR page, Flock Evidence Policy ("Last Updated: August 12, 2026"), Flock blog "Not All LPRs are Equal" (2026-02-06 / 2026-07-24), Meet Flock FAQ, Sussex County VA page with the Langley letter (undated). **Could not re-read:** the NIJ 2012 PDF, the DHS 2007 PDF and the Los Gatos Flock letter PDF (the tool returns compressed binary; no PDF text extractor is installed). Their quotes below are the researcher's "(PDF text)" and stay unconfirmed by me. The same Langley letter text on the Sussex page was re-read, so the Flock-letter wording is covered by that page.

| Line | Claim | Status | Required fix (exact wording) |
| --- | --- | --- | --- |
| 1 | "Flock cameras don't just read your plate." | ✅ company claim, carried by "Flock says" in line 2 | None. Source: LPR page / "Not All LPRs": "not just plate text". |
| 2 (hook) | "Flock says they can also pick out your car's make, color and even a roof rack." | ✅ | None. Make/color: LPR page "captures license plates and key vehicle characteristics, such as make, color, and body type". Roof rack: Evidence Policy "various other objective vehicle characteristics (e.g., roof rack)" and Langley letter "objects (roof rack, bumper stickers, etc.)". "Pick out" = identify; fair. |
| 3 | "a camera on a pole" | 🟡 not sourced in what I opened (Flock says "infrastructure-free", "solar-powered"); generic imagery | None needed (framing, not a Flock claim). |
| 4 | "You might guess it reads your plate and then checks registration records" | n/a, a guess the narrator sets up | None. |
| 5 | "Flock says the make and color come from the photo itself, not from any records." | 🟡 as worded ("any records" is broader than Flock). ✅ with the fix | Flock's words: "based on image analytics (not car registration data)" (Langley letter, Sussex page, undated; Los Gatos copy per researcher). Fix: **"Flock says the make and color come from the photo itself, not from car registration data."** Also: the Evidence Policy and the 2026-10-19 blog say nothing about registration data, so this rests on the undated letter only. The blog says only that the system "processes those images for details like the vehicle's make, color". |
| 6 | "infrared makes the letters glow, and software turns them into text" (general method, no Flock attribution) | 🟡 | NIJ 2012 and DHS 2007 do support the general method (researcher's PDF text, p. 6: the IR illuminator "causes a strong reflection on the license plate that creates a great deal of contrast between the letters/ numbers"; p. 11: "The plate's reflection will be very bright to the camera"), but I could not re-read them. Problems: (a) "glow" is not in the source. The plate reflects the infrared light, so the plate looks bright and the letters stand out by contrast. "Glow" suggests the letters emit light and, for the viewer, light you can see (NIJ: humans "see no light"). (b) NIJ says "most systems incorporate an illuminator" and "IR-based systems", not all. (c) "that photo" ties it to Flock's photo, and Flock's only IR claim is "uses infrared technology to capture images at night" (Meet Flock, ©2022). So it is not shown that Flock's day photos work this way. Fix: **"Reading the plate is the old part: most plate readers use infrared so the letters stand out, and software turns them into text."** (Name the NIJ and DHS documents in the description.) |
| 7 | "the body type" | ✅ (Flock says) | Source: LPR page "make, color, and body type"; "Not All LPRs": "make, color, body type, and distinguishing features". "Finds" is fair for "identify". Advisory (not blocking): "new part" implies Flock's software is new or first. No source says so, and Flock is not shown to be first. Safer: "The added part is the rest of the photo, where Flock says its software also finds the body type." |
| 8 | "Flock says these cameras don't use facial recognition or identify the driver." | ✅ | Exact Flock: "Flock LPR cameras do not use facial recognition or identify drivers." (2026-10-19, re-opened). Scope is Flock's **LPR** cameras; Flock also sells video cameras. Advisory: say "Flock says its plate cameras don't use facial recognition or identify drivers." Keep "Flock says". |
| 9 | "Reading the car still works when the plate is paper, covered or missing, Flock says." | ✅ | "It can read paper, temporary, and covered plates, and when plate reads are limited, vehicle identification fills the gap." and "This works even when the vehicle does not have a readable plate." (2026-02-06 blog); letter: "vehicles with a paper license plate and vehicles with the absence of a license plate". It is a Flock capability claim; the attribution stays at the end. |
| 10 | "So someone can search by description alone, and Flock says they can save it as an alert." | 🟡 the search half is the narrator's fact | Flock: "Investigators can continue working cases using vehicle descriptions alone" (2026-02-06 blog); letter: "'Save Search' based on description of vehicles … without the need for a license plate, and set up alerts based on vehicle description". Fix: **"So, Flock says, someone can search by description alone and save it as an alert."** (Letter is undated; "Vehicle Fingerprint" is the older name, not spoken.) |
| 11 | "Behind that search, Flock says, the photos go by cell connection to a cloud server." | 🟡 | No opened sentence says the photos travel over cell. Parts: "Flock cameras are solar-powered and LTE enabled" (Meet Flock, ©2022); Evidence Policy: the camera "transmits and stores the images in the cloud, fully encrypted"; letter: "On device machine processing to limit LTE bandwidth consumption". Joining them is an inference. Also "behind that search" implies the search runs on that cloud (not shown). Fix (becomes ✅): **"Flock says its cameras are LTE enabled and send the photos, encrypted, to the cloud."** Acceptable to keep the current line if the owner accepts the inference. Not blocking by itself. |
| 12 | "There, Flock used to keep them for thirty days by default, and since August 2026 the default is seven." | ❌ as worded (scope and actor) | (a) **Scope:** Flock's private-sector post: "The new seven-day default retention period applies only to new law enforcement customers"; the guardrails post: "Existing customers will keep their current, democratically approved retention periods"; private-sector customers "retain the terms established for their accounts". So "the default is seven" is true for new police customers only. (Other Flock pages say "default retention period is 7 days" without that limit; the narrower post is the controlling one.) (b) **Actor:** Flock says the customer owns the data ("Data collected through Flock systems belongs to the customer operating those systems"; "Customers also control how long their data is kept"). Flock hosts the photos but says it set the default ("we set the default ALPR retention period to 30 days, unless state or local policy decided on a shorter or longer period"). "Flock used to keep them" puts the decision and the possession on Flock. The date is right: announced 2026-08-13 (page also shows 2026-11-03, so cite the 2026-08-13 "Published" date). Fix: **"There, Flock's default setting used to be thirty days. Since August 2026 it's seven days for new police customers."** |
| 13 | "Your town can pick a different number, though." | ❌/🟡 as worded | Customers are not only towns: Flock names "a law enforcement agency, business, school, or community organization" (2026-07-27 post) and sells to HOAs; Flock: "Local agencies set their LPR data retention period based on agency policy and applicable law". State law can also fix the period. Also existing customers keep whatever they had. Fix: **"Whoever runs the camera can pick a different number, though, within the law."** Line 14 then: **"Do you know which number they chose?"** ("it" has no referent after the change.) |
| 14 | "Do you know which one it chose?" | follows line 13 | See line 13. |

**Other notes.** "Flock says" must stay on lines 5, 9, 10, 11 in the voice (and in the voiceover's tone: no sarcasm on the denial in line 8). Disclose illustrative visuals (car, plate, typed search) in the description. Do not use the Evidence Policy's date as a retention-change date; use 2026-08-13.

**Re-check after the reword:** lines 5, 6, 10, 11, 12, 13, 14 need one more pass by the fact-checker. No other change is needed.

---

## Key facts in one screen

1. **The plate part is old, standard ALPR (independent).** An infrared camera with an invisible pulsing illuminator makes the plate glow, then OCR software compares shapes with letters it knows (NIJ, 2012). DHS S&T (2007) gives four phases: normalize, locate the plate, OCR, heuristics.
2. **The surprise (Flock says).** Flock's software also describes the vehicle: "vehicle color, vehicle type, vehicle make and objects (roof rack, unique hubcap, etc.)", "based on image analytics (not car registration data)" (Flock sole-source letter signed by CEO Garrett Langley, undated). Other wordings: "objects (roof rack, bumper stickers, etc.)" (another Langley letter) and "make, color, body type, and distinguishing features — not just plate text" (Flock site, 2026). The current product name is **Vehicle Signature®**. "Vehicle Fingerprint" is the older, patent-claimed name ("our patented Vehicle Fingerprint Technology").
3. **No plate needed (Flock says).** "Ability to 'Save Search' based on description of vehicles … without the need for a license plate, and set up alerts based on vehicle description." Also "This works even when the vehicle does not have a readable plate" (2026).
4. **Search (Flock says).** Filters by "vehicle color, vehicle type, vehicle manufacturer, partial or full license plate, state of license plate, and object detection". Plain-English search ("FreeForm"): "plain-language search, instead of rigid filters". Flock says Vehicle Signature and FreeForm "can recognize thousands of unique vehicle characteristics".
5. **Then and now (independent vs Flock).** In 2012 the NIJ described a separate color "overview" camera so that *a person* could look at the photo and tell "if the vehicle is a car, truck, SUV". Flock says its machine vision now pulls color, type and make out of the image itself.
6. **Hardware (Flock says).** Motion-triggered stills ("captures a series of still images"), "infrared technology to capture images at night", "solar-powered and LTE enabled", a battery good for "approximately several days", under 5 lb, "a solar panel of 60W or less", and "on device machine processing to limit LTE bandwidth consumption". It also says it needs no reflective plate to trigger.
7. **Data path (Flock says).** Stored "only … temporarily" on the camera, encrypted (AES-256 on the device, TLS 1.2+ in transit), sent to Amazon Web Services ("AWS Government Cloud" per the LPR Policy), then deleted automatically by an "AWS S3 Lifecycle Policy".
8. **Retention (Flock says, changed 2026-08-13).** The old default was "30 days, unless state or local policy decided on a shorter or longer period". The new default and recommendation is **7 days**. "Existing customers will keep their current, democratically approved retention periods". The 7-day default applies "only to new law enforcement customers" (private-sector customers keep their terms). Customers can raise or lower it, and Flock offers "extended retention for up to one year" with an elected official's or governing body's approval.
9. **Who controls it (Flock says).** The customer (a city, police agency, HOA or business) "owns" the data. "Data sharing is off by default". Every law-enforcement search needs "a documented search reason and required offense type". Flock says it doesn't sell data. **Surprise:** Flock says it uses "less than one percent" of LPR images, "stripped of all metadata", to improve its machine learning.
10. **What Flock says it doesn't do.** "Flock LPR cameras do not use facial recognition or identify drivers", and it shows "still images at specific cameras and specific moments in time", not continuous movement.
11. **Scale (Flock says).** "trusted by more than 6,000 communities, 5,000 law enforcement agencies, and 1,000 businesses" (Flock blog, 2026-07-27). "20 billion scans a month" is ❌ (no primary source opened).

---

## H. The hook: "Flock cameras don't just read your plate. They can describe your whole car."

| Part | Evidence | Status |
| --- | --- | --- |
| "don't just read your plate" | Flock (site, 2026): "Identify vehicles using make, color, body type, and distinguishing features — not just plate text". Flock LPR page: "captures license plates and key vehicle characteristics, such as make, color, and body type". | ✅ (company claim; say "Flock says" in the second sentence or right after) |
| "describe" | Flock's own verbs are "analyze", "identify", "recognize", "captures … characteristics". The 2024 presentation (via News & Observer, not opened) speaks of data "showing a car's decals, bumper stickers, back and top racks". "Describe" is a fair paraphrase of "vehicle description" (Flock: "Save Search based on description of vehicles"). | 🟡 OK as a paraphrase |
| "your whole car" | **Not Flock's wording, and it overstates.** No source says the system describes everything about a car. The lists are named attributes (make, color, type, body type, plate state, objects such as roof racks, hubcaps, bumper stickers). "Thousands of unique vehicle characteristics" is the broadest Flock claim, and it covers the whole system, not one car. "Damage" is ❌ (claim 7). | ❌ as worded |

**Verdict:** keep the shape and swap "your whole car" for Flock's own nouns. Recommended (each ✅ as a company claim, attributed):

1. **"Flock cameras don't just read your plate. Flock says they also pick out your car's make, color and body type, down to a roof rack."** (closest to hook B; every noun is in Flock's materials)
2. "Flock's cameras are sold as plate readers, but the company says they can find your car with no plate at all, by its color, its make, or the rack on its roof."
3. "A Flock camera reads your plate, and then, the company says, it describes the car around it: the make, the color, the roof rack."

Don't say "your whole car", "every detail", "dents" or "damage". If the second sentence carries "Flock says", the hook stays fair.

## Angles (2–3)

- **A (agreed, recommended): the plate is the old part.** Hook 1 above. The beat: the plate read is the standard infrared-and-OCR trick every ALPR uses (NIJ), and the new part is the software describing the car itself (Flock). Then the data path and retention. Close on the factual question.
- **B: then vs now.** "In 2012, a Justice Department guide said a plate reader needed a second, color camera so that a person could see whether the car was a red sedan or a black pickup. Flock says its software now reads that by itself." Strong picture (a person squinting at a photo, then the detail box filling itself in). The NIJ is cited for an old method, Flock for its own claim. Doesn't claim Flock was first.
- **C: the trip of one photo.** "The photo of your car leaves the pole over a cell signal, sits on Amazon's servers, and Flock says it's deleted after seven days, unless your town picked a different number." Best for the data-path half. Needs care with the retention wording (claim 15).

**Ending (a factual question, no opinion):** "Flock's default is seven days, but your town can choose another number. Do you know which one it picked?" No source is needed for the question itself. The premise is ✅ (claims 15–16). **Lead, not opened:** many agencies publish a Flock "transparency portal" (e.g. `transparency.flocksafety.com/los-gatos-ca-pd` appeared in search). Open it before any line says "you can look it up".

## Myths (good for hooks) and what the evidence says

| Myth | Evidence | Status |
| --- | --- | --- |
| "They only read plates." | Flock's own materials list color, make, type and objects, and searches with no plate (claims 5–9). | ✅ company claim |
| "They use facial recognition." | Flock (2026-10-19): "Flock LPR cameras do not use facial recognition or identify drivers." | ✅ company claim (it's Flock's denial; attribute it) |
| "They film everything, 24/7 video." | Flock (2026-10-19): the LPR camera "captures a series of still images" when a vehicle passes and shows "still images at specific cameras and specific moments in time". Note: Flock also sells separate video cameras. | ✅ company claim, LPR only |
| "The data is kept forever." | The default is now 7 days and was 30 before 2026-08-13. Customers can change it, up to one year extended with approval. Deletion is automatic (claims 15–17). | ✅ company claim |
| "They clock your speed or send tickets." | Only a search summary of a Minerva Park, Ohio page quoting Flock: it doesn't "capture vehicle speeds" (page 403, not opened). Not on any Flock page I opened. | ❌ (lead only) |
| "The plate has to reflect light to be read." | Standard IR ALPR does rely on the plate's strong reflection (NIJ). But Flock says its trigger is motion, "without the need for a reflective plate" (letter). | ✅ both, attributed |
| "Flock sells your data." | Flock: "Flock does not sell customer data or share it without authorization." That's a company claim. Flock does use "less than one percent" of images, stripped, for machine learning (claim 19). | ✅ company claim |

---

## 1. Plate readers read the plate with an infrared camera and an invisible light

- **Script (expected):** "At night, the camera lights the plate with infrared you can't see, so the letters stand out."
- **Status:** 🟡 plausible (fact-checker 2026-11-03: the NIJ PDF could not be re-read by the tool, so the quotes are the researcher's, unconfirmed). Say "most plate readers use infrared so the letters stand out", not "glow" and not tied to Flock's photos.
- **Source:** [License Plate Recognition (LPR) Systems: Function, Performance, and Considerations for Law Enforcement Agencies](https://www.ojp.gov/redirect-legacy/ncjrs/pdffiles1/nij/nlectc/238827.pdf) (catalog page: [NIJ, NCJ 238827](https://nij.ojp.gov/index%2ephp/library/publications/license-plate-recognition-systems-lprs-function-performance-and-considerations)), National Institute of Justice / NLECTC Small, Rural, Tribal and Border Regional Center, US DOJ, 2012-06 (accessed 2026-11-03)
- **Quote (PDF text, p. 6):** "The IR camera looks for a series of letters/numbers at all times and most systems incorporate an illuminator to light up the license plate and make it more readable. This IR illuminator is essentially a pulsing light (with a beam not visible to the human eye). It causes a strong reflection on the license plate that creates a great deal of contrast between the letters/ numbers"
- **Quote (PDF text, p. 11):** "IR-based systems should be able to capture plates in complete darkness. The plate's reflection will be very bright to the camera because of the illuminator, even though human beings see no light."
- **Note:** This is the general method (2012, US systems), not a Flock spec. For Flock's own night claim, see claim 11. Safe wording: "plate readers" or "systems like this", with Flock named only for claim 11.

## 2. Software reads the letters by matching shapes (OCR)

- **Script (expected):** "Software then compares the shapes with letters it knows, and turns the plate into text."
- **Status:** ✅ verified (independent, general method)
- **Source:** NIJ 2012 (as claim 1)
- **Quote (PDF text, p. 6):** "After the IR camera captures an image, computer software analyzes it and uses OCR to determine the characters. The software first looks at the image, then compares the shapes within the image to determine if the shapes look like any of the fonts/letters/numbers in the computer's 'dictionary.'"
- **Source:** [SAVER TechNote: License Plate Recognition](https://dhs.gov/sites/default/files/publications/LPRTech_TN_1007-508.pdf), US DHS Science and Technology Directorate (prepared by SPAWAR Systems Center Charleston), 2007-10 (accessed 2026-11-03)
- **Quote (PDF text, p. 2):** "The software usually operates in four phases: normalizing the image, locating the license plate, OCR, and high-level heuristics." / "The LPR system literally searches the image for things that look like characters." / heuristics: "in a given state, the license plate always has three letters followed by a dash and four numbers. This can be used as a test"
- **Note:** The DHS "child who knows his/her ABCs, but cannot read whole words" analogy is a good visual (letters lit one at a time, then joined into a plate).

## 3. Old systems needed a person to look at a color photo to tell the vehicle type

- **Script (expected, angle B):** "A 2012 Justice Department guide said plate readers came with a second, color camera, so that a person could see whether it was a car, a truck or an SUV."
- **Status:** ✅ verified (independent)
- **Source:** NIJ 2012 (as claim 1)
- **Quote (PDF text, p. 6):** "The majority of LPR systems sold in the United States consist of a multi-camera setup wherein a single unit consists of a color overview camera and an infrared (IR) camera." / "This camera has a wide field of view so that users can look at the image and tell if the vehicle is a car, truck, SUV, semi, trailer or something else. Depending on the lighting, this color image can also provide an idea of the color of the vehicle." / "'Am I looking for a red car or a black pickup truck?'"
- **Note:** The "users can look" part is what makes the contrast. It describes US systems in 2012 in general. Don't say "until Flock" or "Flock was first" (no source; Flock only claims to be the "only" system with its *combination* of features, claim 5).

## 4. A Flock camera wakes on motion and takes still photos, with no reflective plate needed

- **Script (expected):** "Flock says the camera wakes when it senses a car moving and takes a burst of still photos."
- **Status:** ✅ verified (company claim, attributed)
- **Source:** [How Flock License Plate Reader Cameras Work: What They Capture, What They Don't, and the Guardrails Around Their Use](https://www.flocksafety.com/blog/how-flock-license-plate-reader-cameras-work-what-they-capture-what-they-dont-and-the-guardrails-around-their-use), Flock Safety blog (no author shown), 2026-10-19 (accessed 2026-11-03)
- **Quote (tool):** "When a vehicle passes a Flock LPR camera, the camera captures a series of still images." / "Each time a vehicle passes by a camera, it creates a separate sighting."
- **Source:** [Flock Evidence Policy](https://www.flocksafety.com/legal/flock-evidence-policy), Flock Safety, "Last Updated: August 12, 2026" (accessed 2026-11-03)
- **Quote (tool):** "The camera uses motion detection to detect when a vehicle moves past it." / "It captures an image of that vehicle."
- **Source:** [Sole Source Letter for Flock Safety ALPR Cameras and Solution](https://weblink.losgatosca.gov/Weblink/0/edoc/1416851/Attachment%202%20-%20Sole%20Source%20Letter%20for%20Flock%20Safety%20Cameras%20and%20Solution.pdf), Flock Safety, signed Garrett Langley, CEO; undated; "Attachment 2" in Town of Los Gatos, CA public records (accessed 2026-11-03)
- **Quote (PDF text):** "Utilizes motion capture to start and stop recording without the need for a reflective plate"
- **Note:** The letter is **undated** (the town's records system shows no date in the file). Treat it as an older Flock sales document and don't give it a year. "Burst" is our word. Flock says "a series of still images".

## 5. The reveal: Flock's software also describes the car (color, type, make, objects such as a roof rack)

- **Script (expected):** "Flock says its software also pulls the car's make, color and body type out of the photo, down to a roof rack."
- **Status:** ✅ verified (company claim, attributed) for make, color, body type, roof rack (LPR page, Evidence Policy and Sussex letter re-opened 2026-11-03). 🟡 for "not from any records": Flock's words are only "(not car registration data)", from the undated Langley letter. Say "not from car registration data". **Legally sensitive: quote as Flock's description.**
- **Source:** Flock sole-source letter, Los Gatos (as claim 4), undated
- **Quote (PDF text):** "Machine vision to analyze vehicle license plate, state recognition, vehicle color, vehicle type, vehicle make and objects (roof rack, unique hubcap, etc.) based on image analytics (not car registration data)"
- **Source:** [Flock Safety](https://sussexcountyva.gov/department/sheriffs-department/flock-safety/), Sussex County, VA Sheriff's Department page carrying a Flock letter signed "Garrett Langley CEO, Flock Safety"; page undated (image path suggests 2025-04, unconfirmed) (accessed 2026-11-03)
- **Quote (tool):** "Patented proprietary machine vision to analyze vehicle license plate, state recognition, and vehicle attributes" / "vehicle attributes such as color, type, make and objects (roof rack, bumper stickers, etc.)" / "based on image analytics (not car registration data)"
- **Source:** [License Plate Readers (LPR)](https://www.flocksafety.com/devices/lpr-cameras), Flock Safety, page ©2026, live 2026-11-03 (accessed 2026-11-03)
- **Quote (tool):** "captures license plates and key vehicle characteristics, such as make, color, and body type" / "Flock FreeForm® and Vehicle Signature can recognize thousands of unique vehicle characteristics"
- **Source:** [Not All LPRs Are Created Equal](https://www.flocksafety.com/video/not-all-lprs-are-created-equal), Flock Safety, undated, live 2026-11-03 (accessed 2026-11-03)
- **Quote (tool):** "Identify vehicles using make, color, body type, and distinguishing features — not just plate text"
- **Source:** Flock Evidence Policy (as claim 4), 2026-08-12
- **Quote (tool):** "Flock builds our in-house, proprietary machine learning technology which is capable of identifying types of vehicles," "license plate information, and various other objective vehicle characteristics (e.g., roof rack)."
- **Note:** "Not car registration data" is a strong, safe detail: the description comes from the picture, not from a DMV lookup. Only "roof rack" appears in every Flock wording. "Bumper stickers" is in one Langley letter (Sussex), and "unique hubcap" in the other (Los Gatos). "Make" vs "model": Flock's documents say "make". Don't say "model" in the voice (only the third-party 2023 quote says "model").

## 6. The name: "Vehicle Fingerprint", now "Vehicle Signature"

- **Script (expected, optional):** "Flock calls this a vehicle's signature."
- **Status:** ✅ verified (company claim) for both names. 🟡 for "renamed" (no Flock page says the old name was retired)
- **Source:** Flock sole-source letter, Los Gatos (as claim 4)
- **Quote (PDF text):** "Ability to 'Save Search' based on description of vehicles using out patented Vehicle Fingerprint Technology without the need for a license plate, and set up alerts based on vehicle description" [sic, "out" for "our"]
- **Source:** [FAQ / Meet Flock](https://resources.flocksafety.com/meetflock/), Flock Safety, ©2022 (accessed 2026-11-03)
- **Quote (tool):** "focus on vehicular evidence, including license plates and a detailed Vehicle Fingerprint ™"
- **Source:** [Not All License Plate Readers are Equal: When Plate Data Fails, How Do Investigations Continue?](https://www.flocksafety.com/blog/not-all-license-plate-readers-are-equal-when-plate-data-fails-how-do-investigations-continue), Flock Safety blog, published 2026-02-06 (byline date 2026-07-24) (accessed 2026-11-03)
- **Quote (tool):** "Flock LPRs support real-time alerts using Vehicle Signature®"
- **Note:** **"Patented" is Flock's claim. No Flock patent was found or opened (❌ for any patent detail).** Don't say "Flock patented it" in the voice. "Flock calls it…" is safe. The current product name is Vehicle Signature, so use that if a name is spoken. "Fingerprint" is the older marketing name.

## 7. Damage, dents or other visible changes are among the attributes

- **Script (expected):** "…even a dent."
- **Status:** ❌ unsupported. **Cut it.**
- **Note:** No Flock page I opened mentions damage or dents. Leads only: a search summary of a Flock product page ("alterations, damage, covered plates") whose URL never surfaced; Wikipedia's "mismatching colors, bumper stickers, dents" cites 2021 news stories (GovTech and KTVL, which I opened, don't mention it; CBS LA wasn't opened); a competitor's review (spot.ai) mentions "damage". If the owner wants "damage", the fact-checker must find a Flock primary first.

## 8. It still finds the car with a partial, paper, covered or missing plate (Flock says)

- **Script (expected):** "Flock says that works even when the plate is covered, paper, or missing."
- **Status:** ✅ verified (company claim, attributed)
- **Source:** Flock blog "Not All License Plate Readers are Equal…" (as claim 6), 2026
- **Quote (tool):** "It can read paper, temporary, and covered plates" / "when plate reads are limited, vehicle identification fills the gap" / "This works even when the vehicle does not have a readable plate."
- **Source:** Flock sole-source letter, Los Gatos (as claim 4)
- **Quote (PDF text):** "Machine vision to capture and identify characteristics of vehicles with a paper license plates and vehicles with the absence of a license plate"
- **Source:** Flock "Not All LPRs Are Created Equal" (as claim 5)
- **Quote (tool):** "Continue investigations when plates are temporary, covered, partial, or missing"

## 9. Search by description: filters, saved searches, alerts, plain-English search

- **Script (expected):** "So a user can search for a color and a body type with a roof rack, with no plate at all, and Flock says they can save that search as an alert."
- **Status:** ✅ verified (company claim, attributed)
- **Source:** Flock sole-source letter, Los Gatos (as claim 4)
- **Quote (PDF text):** "Web based footage retrieval tool with filtering capabilities such as vehicle color, vehicle type, vehicle manufacturer, partial or full license plate, state of license plate, and object detection" / "'Save Search' based on description of vehicles … without the need for a license plate, and set up alerts based on vehicle description"
- **Source:** Flock LPR page (as claim 5), ©2026
- **Quote (tool):** "Search full, partial, and temporary plates, or use Vehicle Signature to generate investigative leads" / "FreeForm enables proactive and reactive search and alerts through natural language input."
- **Source:** Flock blog "Not All License Plate Readers are Equal…" (as claim 6)
- **Quote (tool):** "Flock FreeForm™ supports plain-language search, instead of rigid filters."
- **Note:** Flock gives no example query. Any typed search shown on screen ("silver SUV roof rack") is 🎭 and goes in the "Illustrative:" line. The word "investigative leads" points at police use. Keep the voice on the mechanism ("a user can search").

## 10. Alerts compare each read with lists (hot lists)

- **Script (expected, optional):** "Each read is checked against lists of plates, and Flock's policy says vehicle descriptions too."
- **Status:** ✅ verified (company claim) / ✅ general method (NIJ)
- **Source:** [LPR Policy](https://www.flocksafety.com/legal/lpr-policy), Flock Safety, "Last Updated: June 30, 2026" (accessed 2026-11-03)
- **Quote (tool):** "LPR alert: a notification generated by an LPR system indicating that a vehicle passed an LPR camera" "with a license plate or vehicle characteristics that match data held by the National Crime Information Center," "the National Center for Missing and Exploited Children, or other database or hot list."
- **Source:** NIJ 2012, p. 7 (PDF text): "Agencies can have a database of license tags, often called a 'hot list' … downloaded into the LPR software."
- **Note:** Optional, because it leans toward police use. If used, keep it to the comparison step (one line, no outcome). No crime or alert numbers.

## 11. Flock says it uses infrared at night

- **Script (expected):** "Flock says its cameras switch to infrared at night."
- **Status:** ✅ verified (company claim). The tool quote is short, and the page is dated ©2022 only
- **Source:** [FAQ / Meet Flock](https://resources.flocksafety.com/meetflock/), Flock Safety, ©2022 (accessed 2026-11-03)
- **Quote (tool):** "Flock Safety uses infrared technology to capture images at night"
- **Note:** None of Flock's 2026 pages I opened repeat it. "Switch to" is our verb. Safer: "Flock says it uses infrared at night". A lead, not used: a 2022 teardown (cehrp.org, not opened) says night images are good for the plate "and not much else". Don't use it without opening it.

## 12. Solar panel, battery, cellular (LTE): no wires to the pole

- **Script (expected):** "There are no wires. Flock says a small solar panel charges a battery that lasts several days, and the photos leave over a cell connection."
- **Status:** ✅ verified (company claim)
- **Source:** FAQ / Meet Flock (as claim 11), ©2022
- **Quote (tool):** "Flock cameras are solar-powered and LTE enabled" / "Flock Safety cameras also have a built-in battery that provides approximately several days of uninterrupted usage." / "Depending on how much sunlight is available on an average day, a solar panel is used to recharge the battery."
- **Source:** Flock sole-source letter, Los Gatos (as claim 4)
- **Quote (PDF text):** "Wireless deployment of license plate reading cameras with integrated cellular communication weighing less than 5lbs and able to be powered solely by a solar panel of 60W or less"
- **Source:** [Flock Safety Product Hub](https://flocksafety.com/product), Flock Safety, ©2026 (accessed 2026-11-03)
- **Quote (tool):** "Detect threats and capture actionable evidence with solar-powered devices."
- **Note:** "No wires" is 🟡: Flock says "Wireless deployment" and "powered solely by a solar panel". Some installs may use mains power, which Flock doesn't say either way. Say "Flock says it can run on solar alone". The clock syncs over LTE (Evidence Policy, tool: "The Flock LPR device syncs its clock with the LTE network.").

## 13. Much of the processing happens on the camera, to save cellular data

- **Script (expected, optional):** "Flock says part of the work happens on the camera itself, so less has to go over the cell network."
- **Status:** ✅ verified (company claim)
- **Source:** Flock sole-source letter, Los Gatos (as claim 4); same line on the Sussex County page
- **Quote (PDF text):** "On device machine processing to limit LTE bandwidth consumption"
- **Note:** Flock doesn't say *which* steps run on the camera (plate OCR? attributes?). Don't split it on screen as "OCR on camera, attributes in cloud". Keep it as "part of the work".

## 14. The photo is stored on the camera only briefly, encrypted, and sent to Amazon's cloud

- **Script (expected):** "The photos sit on the camera only until they're uploaded, encrypted, to Amazon's cloud."
- **Status:** ✅ verified (company claim)
- **Source:** Flock Evidence Policy (as claim 4), 2026-08-12
- **Quote (tool):** "On the camera itself, data is only stored temporarily until it is uploaded to the cloud." / "encrypted in transit using TLS 1.2 or higher." / "AES-256 encryption at rest with our cloud provider, Amazon Web Services."
- **Source:** Flock LPR Policy (as claim 10)
- **Quote (tool):** "LPR data is stored briefly on the camera and then transferred to the AWS Government Cloud."
- **Source:** Flock blog "How Flock License Plate Reader Cameras Work…" (as claim 4), 2026-10-19
- **Quote (tool):** "Data is encrypted on the device with AES-256, travels to the cloud over TLS 1.2 or higher,"
- **Note:** Naming Amazon in the voice cites a company that isn't the story's subject. Brand rule: name a company only for its own product. **Say "a cloud server" in the voice.** Amazon/AWS can go in the description.

## 15. How long it's kept: 7 days by default since August 2026, 30 days before; customers can change it

- **Script (expected):** "Flock says the default is now seven days. It used to be thirty, and the town or agency can set a different number."
- **Status:** 🟡 plausible, fact-checker 2026-11-03: ✅ only as "Flock's default setting used to be thirty days; since August 2026 it's seven for new police customers". "The default is seven" for everyone is ❌ (scope: new law-enforcement customers only; existing and private-sector customers keep their terms). Re-opened: all three Flock posts below. **Legally sensitive and recently changed: script the wording exactly.**
- **Source:** [Flock Updates Privacy, Accountability, Security, and Transparency Safeguards](https://flocksafety.com/blog/flock-guardrails-address-lpr-privacy-concerns-and-police-transparency), Garrett Langley (CEO), Flock Safety blog, published 2026-08-13 (page also shows 2026-11-03) (accessed 2026-11-03)
- **Quote (tool):** "we set the default ALPR retention period to 30 days, unless state or local policy decided on a shorter or longer period." / "updating our recommendation and default to a 7-day retention." / "Existing customers will keep their current, democratically approved retention periods." / "Our analysis shows that over 90% of searches without a full plate are done within a week."
- **Source:** [Customers Own and Control Their Flock Data](https://www.flocksafety.com/blog/customers-own-and-control-their-flock-data), Flock Safety blog (no author), published 2026-07-27 (page also shows 2026-10-27) (accessed 2026-11-03)
- **Quote (tool):** "Customers also control how long their data is kept." / "For Flock license plate reader camera data, the default retention period is 7 days," / "customers can configure retention in accordance with their policies and legal requirements where applicable."
- **Source:** [What Flock's Privacy and Security Updates Mean for Private Sector Customers](https://www.flocksafety.com/blog/what-flocks-privacy-and-security-updates-mean-for-private-sector-customers), Flock Safety blog, published 2026-09-01 (page also shows 2026-10-27) (accessed 2026-11-03)
- **Quote (tool):** "The new seven-day default retention period applies only to new law enforcement customers" / "private-sector customers retain the terms established for their accounts."
- **Note:** **Scope matters.** 7 days is the *default for new law-enforcement customers* since 2026-08-13. Existing customers keep what they had, often 30 days, and private-sector customers keep their terms. So **"Flock keeps your car for 7 days" is ❌.** Safe: "Flock's default is now seven days, and each town or agency can choose another number." Also safe: "Until this August the default was thirty." Avoid "this August" if the video publishes in 2027. Say "in August 2026". The 90% figure is about searches, not crime. It's OK as a Flock claim but optional.

## 16. Customers can keep it longer, up to a year, with an elected body's approval

- **Script (expected, optional):** "Flock says customers can keep it for up to a year, with approval from an elected official or governing body."
- **Status:** ✅ verified (company claim)
- **Source:** Flock Evidence Policy (as claim 4), 2026-08-12
- **Quote (tool):** "Flock's standard retention period is seven (7) calendar days from the date of capture." / "Flock defaults to permanently deleting all data after seven (7) days on a rolling basis" / "Flock will offer an extended retention for up to one year"
- **Source:** Flock LPR Policy (as claim 10)
- **Quote (tool):** "LPR data is hard deleted on a rolling 7-day basis by default" / "this may be increased or decreased on a case-by-case basis" / "if a different schedule is required by a customer's law or policy."
- **Note:** The tool paraphrased the approval condition ("with approval from an elected official or governing body"). **Re-quote it exactly before ✅.** State law can also set limits (Flock: "retention periods are set within the local law"). Don't list states (not researched).

## 17. After that, deletion is automatic and permanent

- **Script (expected):** "After that, Flock says, a timer on the server deletes it automatically, and it can't be recovered."
- **Status:** ✅ verified (company claim)
- **Source:** [How Does Flock Handle License Plate Data Deletion?](https://www.flocksafety.com/blog/how-does-flock-handle-license-plate-data-deletion), Chris Colwell (SVP, Customer Experience), Flock Safety blog, published 2026-06-02 (page also shows 2026-08-13) (accessed 2026-11-03)
- **Quote (tool):** "It's an automated AWS S3 Lifecycle Policy that runs continuously and irreversibly." / "A lifecycle policy automatically expires objects once they pass the retention period configured for your agency." / "Once an object is permanently deleted, it cannot be recovered" / "the retention window is set by your contract and local rules, not by Flock."
- **Note:** Exceptions: "Data may be retained longer when required by law, subject to a legal hold". Data saved as evidence for a case (Flock's "Evidence Mode", 2026-08-13) is kept longer. If the line says "deleted", add "unless it's saved as evidence", or keep it to "by default".

## 18. Who can see it: the customer owns it, sharing is off by default, every search needs a reason

- **Script (expected):** "Flock says the data belongs to the town or business that bought the camera, sharing is off unless they turn it on, and every police search has to log a reason."
- **Status:** ✅ verified (company claim)
- **Source:** Flock blog "Customers Own and Control Their Flock Data" (as claim 15)
- **Quote (tool):** "Data collected through Flock systems belongs to the customer operating those systems," / "Customers determine who within their organization can view or search their data." / "Where sharing is available, it is disabled by default," / "Flock does not claim ownership of customer data, use it for advertising, or sell it to third parties."
- **Source:** Flock blog "How Flock License Plate Reader Cameras Work…" (as claim 4), 2026-10-19
- **Quote (tool):** "Data sharing is off by default." / "Every law enforcement search must include a documented search reason and required offense type" / "Flock does not sell customer data or share it without authorization."
- **Source:** Flock LPR Policy (as claim 10)
- **Quote (tool):** "Customers choose whether to share LPR data with other customers in accordance with their laws and policies." / "Flock Safety has designated CJIS-certified engineers who are able to access CJIS data"
- **Note:** Flock itself has engineers with access (LPR Policy), so "only your town can see it" is ❌. Keep it to "the customer decides who else sees it". Customers include HOAs and businesses (Flock HOA page: "Law enforcement only gains access if your HOA opts in"). "Every search has to log a reason" is a 2026 Flock requirement. Media reports dating it from January aren't confirmed.

## 19. Flock uses under 1% of images, stripped of identifying data, to train its software

- **Script (expected, optional surprise):** "Flock's policy says it keeps less than one percent of the photos, stripped of identifying data, to train its software."
- **Status:** ✅ verified (company claim). Legally sensitive: quote exactly
- **Source:** Flock LPR Policy (as claim 10), "Last Updated: June 30, 2026"
- **Quote (tool):** "Additionally, Flock uses a fraction of LPR images (less than one percent)," "which are stripped of all metadata and identifying information, solely for the purpose of improving Flock Services through machine learning."
- **Note:** The policy doesn't say "keeps" or for how long. Use "uses", not "keeps". This is how the attribute recognition gets better, so it links the reveal to the data path. Good for the "fair side" line too.

## 20. What Flock says the LPR camera doesn't do: no facial recognition, no driver ID, no live tracking

- **Script (expected, optional fairness line):** "In fairness, Flock says these cameras don't use facial recognition, and they show still photos at one spot, not a live map of where a car goes."
- **Status:** ✅ verified (company claim)
- **Source:** Flock blog "How Flock License Plate Reader Cameras Work…" (as claim 4), 2026-10-19
- **Quote (tool):** "Flock LPR cameras do not use facial recognition or identify drivers." / "Flock LPR can't show continuous movement between sightings or real-time vehicle location." / "Flock LPR shows still images at specific cameras and specific moments in time."
- **Note:** It's Flock's own denial. Say "Flock says". The NIJ guide describes how separate sightings can be put together into a map (DHS 2007: "From this data, a tracking map can be created"). Don't imply Flock's "can't show continuous movement" means a route can't be rebuilt from several sightings. Better to leave the tracking question out (guardrail: no debate).

## 21. How many: more than 6,000 communities (Flock says)

- **Script (expected, optional):** "Flock says its cameras are in more than 6,000 communities."
- **Status:** ✅ verified (company claim, US, 2026)
- **Source:** Flock blog "Customers Own and Control Their Flock Data" (as claim 15), 2026-07-27
- **Quote (tool):** "is trusted by more than 6,000 communities, 5,000 law enforcement agencies, and 1,000 businesses."
- **Note:** "Trusted by" means customers, not a camera count. Say "used in" or "Flock says it works with more than 6,000 communities". The Flock LPR page adds "49 states" and "10x Larger LPR network than the nearest competitor" (company claims; skip the comparison). **"20 billion vehicle scans a month" is ❌:** only Wikipedia and press repeat it, and no Flock primary was opened.

## 22. One camera can handle up to 30,000 vehicles a day (Flock says)

- **Script (expected, optional):** "Flock says one solar camera can process up to 30,000 vehicles a day."
- **Status:** ✅ verified (company claim, undated)
- **Source:** Flock sole-source letter, Los Gatos (as claim 4)
- **Quote (PDF text):** "Ability to capture and process up to 30,000 vehicles per day with a single camera powered exclusively by solar power"
- **Note:** It's a capacity claim, not a measured average. Keep "up to". It's also undated, so it may be from an older hardware generation.

---

## Mechanism (neutral): addendum 2026-11-03

Owner direction (via coordinator): the script **explains how it works** by following one car through the system (photo → plate read → car recognized → attributes saved with time and place → search matches them → kept a set number of days), not by reporting what Flock's documents say. The rows below let the narrator state the general mechanism in its own voice. **Flock** is then named only where the line is about Flock's own product (claims 4–22 above, still attributed).

## M1. In law, a plate reader turns images of vehicles and plates into computer-readable data, including make, model and color

- **Script (expected):** "A plate reader turns the picture into data: the plate number, and the car's make, model and color."
- **Status:** ✅ verified (independent: US state statute). Fact-checker 2026-11-03: the statute page returns a PDF the tool can't decode; a search summary of the official page confirmed the definition (make, model, color, date and time, GPS, plate number) and "Effective July 15, 2026". Roof rack is **not** in the statute.
- **Source:** [KRS 189.632, Automated license plate reader](https://apps.legislature.ky.gov/law/Statutes/statute.aspx?id=57500), Kentucky Revised Statutes (Kentucky Legislative Research Commission), created 2026 Ky. Acts ch. 71, sec. 1, effective 2026-07-15 (accessed 2026-11-03)
- **Quote (PDF text):** "'Automated license plate reader' or 'ALPR' means a system of one (1) or more automated high-speed cameras used in combination with data processing to convert images of vehicles and license plates into computer-readable data;" / "'Captured license plate data' means the vehicle characteristics captured by an ALPR, including the: 1. Global positioning system device coordinates; 2. Date and time; 3. Photographs of the license plate and vehicle; 4. License plate number; and 5. Vehicle make, model, and color;"
- **Note:** This is the best neutral line for the reveal. A 2026 US law already treats make, model and color as part of what a plate reader captures. It's a definition, not a claim that every system does it. Don't name Kentucky in the voice unless needed. If it is named: "one state's law defines…". Kentucky's 90-day cap (subsection 4) is a fact about one state's law. Optional, and only if the script wants "a set number of days" from a neutral source (don't frame it as a debate).

## M2. Each read is stored with the date, time and location

- **Script (expected):** "Each sighting is saved with the time and the camera's place."
- **Status:** ✅ verified (independent)
- **Source:** KRS 189.632 (as M1): date and time and GPS coordinates are part of "captured license plate data" (quote above).
- **Source:** DHS SAVER TechNote, 2007-10 (as claim 2)
- **Quote (PDF text, p. 3):** "Each LPR has a known location and can provide the exact time a specific vehicle was observed." / "the location and license plate is recorded for every stationary or moving vehicle encountered by the officer's mobile LPR system."
- **Source (Flock, own product):** Flock LPR Policy (as claim 10) lists LPR data as "License plate image", "Vehicle image", "Vehicle characteristics (e.g. color, make)", "License plate number", "License plate state", "Date", "Time", "Camera location" (tool).
- **Note:** The NIJ 2012 PDF (read in full) doesn't state the time/location record in one quotable line. Use DHS and KRS for this.

## M3. Recognizing make, model and color: software trained on large sets of labeled car photos

- **Script (expected):** "The software learned this from huge sets of car photos, each one labeled with its make, model or color, until it could label a new car on its own."
- **Status:** ✅ verified for the general method "software trained on labeled car photos can learn make/model" (fact-checker re-opened TFDS cars196 and Google's Supervised Learning page 2026-11-03: quotes below exact). 🟡 for "huge": the sets I opened are 16,185 images (cars196) and 5,500 cars + 2,800 trucks (DOT report, which does not say "labeled"); "several million" and "large set of labeled" are from preprints I did not re-open. Say "large sets". 🟡 for any claim about *which* method a given vendor uses (Flock only says "proprietary machine learning", claim 5)
- **Source:** [cars196 (Stanford Cars) dataset catalog](https://www.tensorflow.org/datasets/catalog/cars196), TensorFlow Datasets (Google), live 2026-11-03. Dataset paper: Krause, Stark, Deng & Fei-Fei, "3D Object Representations for Fine-Grained Categorization", 4th IEEE Workshop on 3D Representation and Recognition (3dRR-13), Sydney, 2013 (accessed 2026-11-03)
- **Quote (tool, full description):** "The Cars dataset contains 16,185 images of 196 classes of cars. The data is split into 8,144 training images and 8,041 testing images" / "Classes are typically at the level of Make, Model, Year, e.g. 2012 Tesla Model S or 2012 BMW M3 coupe."
- **Source:** [Real Time Classification of Vehicle Types and Modes using Image Analysis and Data Fusion](https://rosap.ntl.bts.gov/view/dot/53604), Huynh, Mullen & Mejia, Center for Connected Multimodal Mobility (Clemson / Univ. of South Carolina), US DOT ROSA P repository, 2019-03-01 (accessed 2026-11-03)
- **Quote (tool):** "The resulting database was used for training and testing the Cascade classifiers and the CNN." / "using a data set consisting of 5,500 car and 2,800 truck images" / "the CNN achieved higher accuracy (97%) in vehicle classification"
- **Source:** [Supervised Learning](https://developers.google.com/machine-learning/intro-to-ml/supervised), Google for Developers, Intro to Machine Learning, undated (accessed 2026-11-03)
- **Quote (tool):** "Examples that contain both features and a label are called labeled examples." / "The label is the "answer," or the value we want the model to predict." / "After you create a model, the model predicts the label from the features."
- **Source (color, peer-reviewed proceedings):** [Vehicle Color Recognition in The Surveillance with Deep Convolutional Neural Networks](https://www.atlantis-press.com/proceedings/jimet-15/25843863), Su, Shao, Zhou, Zhang & Mei, Proceedings of JIMET-15 (Atlantis Press), 2015-12, DOI 10.2991/jimet-15.2015.147 (accessed 2026-11-03)
- **Quote (tool):** "The main challenge of vehicle color recognition is to find the dominant color." (The abstract also says the CNN was tested on data "collected from city surveillance equipment"; the tool paraphrased this, so re-quote before use.)
- **Source (preprints, 🟡, supporting only):** [Nafzi, Brauckmann & Glasmachers, "Vehicle Shape and Color Classification Using Convolutional Neural Network"](https://ar5iv.labs.arxiv.org/html/1905.08612), arXiv 1905.08612 (2019, IDEMIA / Ruhr-University Bochum), quote (tool): "The training of Convolutional Neural Networks (CNNs) requires in general a large set of representative labeled image data." They trained "1447 classes" for make/model and 10 color classes. [Dehghan et al., "View Independent Vehicle Make, Model and Color Recognition Using Convolutional Neural Network"](https://arxiv.org/abs/1702.01721), arXiv 1702.01721 (2017, Sighthound), quote (tool): "trained on a large dataset of several million images which are labeled through a semi-automated process."
- **Note:** The 97% (DOT report) is a car-vs-truck lab result. **Don't use it in the voice** (accuracy and effectiveness are off-limits, and it would be misread as a Flock figure). "Huge sets" is fair: the 16,185-image academic set is small next to the "several million" in a commercial preprint (🟡). Don't put a number on Flock's training set (none is published). Flock's own line, "less than one percent" of its images used for machine learning (claim 19), can follow as "Flock says…".

## M4. Searching by description = matching the stored labels, plus time and place

- **Script (expected):** "Search for a color, a body type and a roof rack, and the system returns every saved sighting whose labels match, with the time and the place."
- **Status:** ✅ verified (independent for query-by-criteria; Flock for its own attribute and plain-English search)
- **Source:** DHS SAVER TechNote, 2007-10 (as claim 2)
- **Quote (PDF text, p. 3):** "A more sophisticated system will contain database tools and mapping and query capabilities. These advanced interfaces allow the user to inquire about license plates based on particular criteria such as license plates starting with the letter A, containing the numbers 3 and 7, and seen between 8 p.m. and 10 p.m. at a specific address."
- **Source (Flock, own product):** the Los Gatos letter's filters "vehicle color, vehicle type, vehicle manufacturer, partial or full license plate, state of license plate, and object detection" (claim 9). "Flock FreeForm™ supports plain-language search, instead of rigid filters." (claim 9)
- **Note:** DHS shows the general idea (filter stored reads by criteria, time and place) for plate characters. Extending it to stored attribute labels is our explanation, built on M1 (attributes are part of the stored data) + DHS (query by criteria). That's fair, but any typed query shown on screen is 🎭. For plain-English search, attribute it: "Flock says users can type it in plain English." No neutral source describes how FreeForm works inside, so don't explain it.

## M5. Triggered by motion, still photos (optional)

- **Status:** ✅ Flock only (claim 4). **No neutral source found** saying ALPR cameras in general are motion-triggered. The NIJ 2012 guide says the opposite of a generic rule: "The IR camera looks for a series of letters/numbers at all times". So the motion trigger must stay "Flock says" or be shown without words.

## Script-safe lines, narrator's own voice (mechanism)

1. "A plate reader can turn the photo into data: the plate number, and the car's make, model and color." (M1; "can", since it's one law's definition)
2. "At night, the camera lights the plate with infrared you can't see, so the letters glow for the camera." (claim 1)
3. "Software matches the shapes against letters it knows and turns the plate into text." (claim 2)
4. "To recognize the car itself, the software was trained on large sets of car photos, each labeled with its make, model or color, until it could label a new car on its own." (M3)
5. "Each sighting is saved with the time and the camera's place." (M2)
6. "Searching by description just means asking for every saved sighting whose labels match, at a certain place and time." (M4)
7. 🟡 (our inference from sources) "That's why the plate isn't needed: the labels can match on their own." (M1 + M4; for Flock specifically, claim 8 "Flock says it still works when the plate is covered or missing")
8. Flock-specific, attributed: "Flock says its cameras wake on motion and take a burst of stills." (claim 4) / "Flock's default is seven days, and each town or agency can choose another number." (claim 15)

**Still not safe:** a training-set size for Flock, any accuracy figure, "every plate reader does this" (M1 is one state's definition, so say "a plate reader can"), explaining how FreeForm works inside.

---

## Visual notes for the director

- **The pole:** a slim black pole by a road edge, a small dark camera box near the top, and a small tilted solar panel above it (Flock: solar under 60 W, unit under 5 lb, claim 12). No brand or logo on screen (the voice names Flock). No real town or road sign.
- **The passing car:** the hero car rolls past (wheels forward, per the house rule). The camera "wakes" on motion (a status light, claim 4) and takes a short series of stills: 3–4 frame outlines peel off the camera.
- **Night beat (optional):** the scene darkens, and an invisible IR pulse is shown as a faint orange cone. The plate lights up white in the camera's view while the human-eye view stays dark (NIJ: "human beings see no light", claim 1).
- **Plate read:** the detail box shows the plate. The letters light up one by one (DHS: OCR finds characters, then heuristics join them, claim 2). Plate text is 🎭 (an invented plate, no real state design).
- **The reveal (detail box):** after the plate, the box fills with attribute chips: COLOR · MAKE · BODY TYPE · ROOF RACK (claim 5). Then the plate chip greys out, and the attribute chips still match (claim 8). Don't show "DAMAGE" or "DENT" (claim 7 ❌), and don't show a brand logo for "make". Use a generic word or a blank badge.
- **Then vs now (angle B):** a 2012-style screen with a color photo and a person (YOU or an extra) squinting at it, then a cut to the box filling itself in.
- **Data path (orange = the hidden system):** a small orange packet leaves the camera, goes up to a generic cell tower, then into a cut-open server slice (generic, no Amazon logo), and lands in a search screen where typed words filter the car (🎭 query). Retention: a calendar strip with a 7-day bar and a dimmed 30-day bar behind it, then a soft "delete" sweep at the end of the bar (claims 15, 17).
- **Sharing:** a closed gate or toggle shown OFF by default (claim 18). No police figures, no arrests, no maps of a route.
- **Ending:** back to frame 0, the pole and the car passing, with the question in the title block or a statement card. No orange flourish after the question.
- **Disclose (🎭):** the car, the plate text, the road, the typed search, the camera's look and the exact sequence on screen are illustrative, not a real camera or case.

## Script-safe lines (starting confidence, fact-checker to confirm)

1. "Flock cameras don't just read your plate. Flock says they also pick out your car's make, color and body type, down to a roof rack." (claims 5, H)
2. "Plate readers light the plate with infrared you can't see, so the letters glow for the camera." (claim 1, general method)
3. "Software then matches the shapes against letters it knows and turns your plate into text." (claim 2)
4. "Flock says its software reads the color, type and make from the picture itself, not from registration records." (claim 5: "based on image analytics (not car registration data)")
5. "Flock says it still works when the plate is paper, covered, or missing." (claim 8)
6. "A user can search by description, with no plate, and Flock says they can save that search as an alert." (claim 9)
7. "Flock says the camera runs on a small solar panel and a battery, and sends its photos over a cell connection." (claim 12)
8. "The photos sit on the camera only until they're uploaded, encrypted, to a cloud server." (claim 14)
9. "Flock's default is now seven days. Until August 2026 it was thirty, and each town or agency can choose another number." (claim 15)
10. "After that, Flock says, the server deletes it automatically, unless it's been saved as evidence." (claim 17)
11. "Flock says the data belongs to the customer, and sharing is off unless they switch it on." (claim 18)
12. "In fairness, Flock says these cameras don't use facial recognition." (claim 20)
13. Ending: "Flock's default is seven days, but your town can pick a different number. Do you know which one it chose?" (claims 15–16)

**Not safe:** "describe your whole car", "dents/damage", "Flock patented it" (as our fact), "Flock keeps your data for 7 days", "only your town can see it", "20 billion scans", "Flock was the first to…", any accuracy rate, case or crime figure.
