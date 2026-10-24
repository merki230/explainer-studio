# Sources: self-checkout (No. 007)

Researcher draft, 2026-10-24. Fact-check pass 2026-10-24: statuses below marked "(fact-check)" are final. I re-opened the pages for A2, A5, B2, D2, D4, E1, E3, G1 (and A1, A4, D1, F1 spot checks). Not re-opened: IBM brochure (D1), US7533799, Toshiba brochure, Sam's Club, Grocery Dive (none are used by the current script).

**Fact-check summary for the current script (11 lines):** no ❌ in the script. Fixes needed on lines 1, 4, 5, 7, 9 (see the "Script line map" at the end).
Everything was accessed on 2026-10-24. Quotes are verbatim. When a sentence ran too long, it is quoted in pieces joined by "…".

**Access notes for the fact-checker:**

- (1) The research tool returns patent text in short excerpts (it caps each quote at about 125 characters). Every patent quote below is the tool's verbatim excerpt from the Google Patents HTML page. Several patent pages are longer than the tool reads in one pass (the last 15 to 30% of the text was not read). Please re-quote from a browser where marked.
- (2) Patents show a **claimed or described design**, not proof that a store's machine works that way today. Each patent entry is worded "one maker's patent describes…". Product sheets (NCR, Diebold Nixdorf, Toshiba) are stronger evidence of shipped behavior, but they are marketing documents.
- (3) Could not read: `patents.google.com/patent/US20080061139A1` (server error twice), `patents.google.com/patent/US9033227` and `US12657565` (not on the tool's allowlist), the USPTO PDF of US9033227 (binary). The Business Wire original of NCR's 2018 release returned a newsroom listing, so the iXtenso republication is used (C1).
- (4) Pages fetched once on ncrvoyix.com under the slug "ncr-is-saying-goodbye-to-the-infamous-unexpected-item-in-the-bagging-area" now show an unrelated 2024 WSJ repost. Don't cite that URL.

**Owner direction (binding, from the brief):** mechanism first; loss prevention gets at most one factual line; no "help or catch you" framing; the script says "some/many self-checkouts", never all.

**Brand rule:** no maker is named in the voice (NCR, Toshiba, Diebold Nixdorf, Fujitsu, ECR Software, IBM, Mettler Toledo, Walmart, Sam's Club are sources only). The story is about the machine, not one company's product.

---

## A. What the scale is

### A1. On many self-checkouts, the bagging shelf sits on a weighing scale (a "security scale")

- **Script (likely):** "On many self-checkouts, the shelf where you put your bags is a scale."
- **Status:** ✅ verified (fact-check): NCR data sheet "Security scale for weight verification" re-quoted from the PDF (under "Extensive Security"); LP Magazine quote re-quoted. Supports "many/a lot of"; no source measures how many. Use "many" or "a lot of", never "every" (see section C).
- **Source (product sheet):** [NCR FastLane SelfServ Checkout (Release 5.5), data sheet](https://www.ncr.com/content/dam/ncrcom/content-type/datasheets/16RET4983_NCR_FastLane_SelfServ_Checkout_ds_HR.pdf), NCR Corporation, © 2016 (accessed 2026-10-24)
- **Quote:** "Security scale for weight verification"
- **Source (patent):** [US6990463B2, Self-checkout system](https://patents.google.com/patent/US6990463B2/en), NCR Corp. (now NCR Voyix), priority 2001-12-26 (accessed 2026-10-24)
- **Quote:** "The bagging area 54 includes the scale 16 that is supported on a scale shelf 52." / "The scale 16 provides a security check of items bagged against those items scanned."
- **Source (trade press):** [Self-Checkout Reaches Critical Mass](https://losspreventionmedia.com/self-checkout-reaches-critical-mass/), Loss Prevention Magazine, 2006-01-02 (accessed 2026-10-24)
- **Quote:** "an internal scale tracks additional weight and queries the database for corroboration."
- **Note:** "Security scale" and "bagwell scale" are the industry names. The 2006 article is old but describes the principle in plain language.

### A2. The sensor inside is a load cell (a strain-gauge weighing element)

- **Script (likely):** "Under the shelf there's a load cell, a block of metal that bends very slightly under weight, and a sensor glued to it reads the bend."
- **Status (fact-check):** 🟡 plausible for script line 4 "there's a load cell that weighs the whole platform". "Load cell" ✅ (US7040455 re-quoted: "the sensors are load cells, although known weight measuring sensors and transducers may be used"). "Weighs the whole platform" ✅ in substance: same patent, "the surface area of the checkout area has a scale underneath it" and "The weight differential at each sensor may be accumulated to determine a total weight"; US7841522: security scale platter "weighs the bag and the bag's contents". Caveat: that patent's design has **four** load cells, so singular "a load cell" is one design's simplification, and US7347367 says only "Security scale 24 weighs items", no load cell. Hedged wording for ✅: "there are load cells that weigh the whole platform". The NCR 7709-K710 page lists strain-gauge pods and does **not** say "load cell" (re-checked). Earlier researcher note follows. Researcher: ✅ verified for "load cell" (two NCR patents). 🟡 for "strain gauge": the only support is an NCR parts list for one security scale kit, which lists "Strain Gauge" pods. The plain-English "metal that bends slightly" is the general definition of a strain-gauge load cell, **not in any opened self-checkout source**. If spoken, the fact-checker should add a general engineering source (e.g. a load-cell maker's explainer) or keep it to "a load cell, the same kind of sensor that's in a bathroom scale" (also unsourced; ❌ until sourced).
- **Source (patent):** [US7533799B2, Weight scale fault detection](https://patents.google.com/patent/US7533799), NCR Corporation (now NCR Voyix), application 11/639,075 (about 2006; the page states no explicit priority date) (accessed 2026-10-24)
- **Quote:** "at least one weight detector, such as a pressure sensor or a load cell sensor"
- **Source (patent):** [US7040455B2, System and method for tracking items at a scale of a self-checkout terminal](https://patents.google.com/patent/US7040455), NCR Corp. (now NCR Voyix), priority 2001-09-10, granted 2006-05-09 (accessed 2026-10-24)
- **Quote:** "the sensors are load cells, although known weight measuring sensors and transducers may be used"
- **Source (parts list):** [7709-K710 Security Scale Countertop](https://onlinehelp.ncrvoyix.com/Kits/HTML/7709/TopicsKits/K710/7709-K710.htm), NCR Voyix online help (kit for the NCR SelfServ 90 kiosk), undated (accessed 2026-10-24)
- **Quote:** "This kit provides the components to install a security scale integrated to the NCR SelfServ™ 90 Kiosk." / "R5 Pods With 50 Durometer Mount, Polyimide Strain Gauge Backing"

### A3. One patented design puts four load cells at the corners, which can even tell where on the shelf an item landed

- **Script (likely):** Optional visual only: four orange points at the corners of the shelf.
- **Status:** 🟡 plausible. One NCR patent describes it for a self-checkout scale area. It is not shown to be the standard bagging-scale build. Safe for the **picture** (four corner sensors is a common scale layout), but don't say "the machine knows where you put it".
- **Source:** US7040455B2, as in A2
- **Quote:** "the sensors are comprised of four load cells located proximately at the corners of a rectangular scale area" / "each load cell measures the weight of the item in direct proportion to the distance between the item and a load cell." / "The convergence of the distances from the load cells identifies a location for the item"
- **Note:** This patent says "checkout area" with "a scale underneath it", not "bagging area". The tool did not find the words "security scale" in its text.

### A4. It measures the change in weight each time something is added or removed

- **Script (likely):** "It doesn't check what's in the bag. It only watches the number change: when you set an item down, the weight should go up by about what that item weighs."
- **Status:** ✅ verified (fact-check) for script line 5 ("checks how much the weight went up") as "one maker's patents describe detecting a weight increase on placement and a weight decrease on removal". This is the core mechanism and matches every scale-based source opened (A1, B1). Re-quoted: US6032128 "a weight increase associated with placement of the item on the post-scan shelf 42b" and "a weight decrease associated with removal of the item from the post-scan shelf 42b" (this fetch shows the shelf wording; the "grocery bag 40" wording below was read by the researcher). US7841522: "verify that each increase in the weight of the bag and contents is within an expected weight range."
- **Source (patent):** [US6032128A, Method and apparatus for detecting item placement and item removal during operation of a self-service checkout terminal](https://patents.google.com/patent/US6032128), NCR Corp. (now NCR Voyix), priority 1997-12-15, granted 2000-02-29 (accessed 2026-10-24)
- **Quote:** "detecting a weight increase associated with placement of the item in the grocery bag 40" / "detecting a weight decrease associated with removal of the item from the grocery bag 40."
- **Source (patent):** [US7841522B2, Apparatus, system, and method for measuring light-weight purchase items](https://patents.google.com/patent/US7841522), IBM (now Toshiba Global Commerce Solutions), priority 2006-11-28, granted 2010-11-30 (accessed 2026-10-24)
- **Quote:** "For example, the self-checkout system may direct the customer to place each scanned purchase item in a bag." / "The bag may be in operable communication with a security scale platter that weighs the bag and the bag's contents."
- **Note:** "It doesn't check what's in the bag" is our framing of "weighs the bag and the bag's contents" plus the same-weight gap in E2. Fine as explanation; keep it calm.

### A5. The scale waits for the number to settle before it judges (one design: ten readings within 0.02 lb, inside 150 ms)

- **Script (likely):** "It waits for the reading to settle, so a sloshing bottle or a bump against the machine can throw it off."
- **Status (fact-check):** 🟡 plausible for script line 5 "once the reading settles". All three quotes re-opened and confirmed in US6215078 (ten readings within 150 ms; 0.02 pounds; "due to sloshing"). It is **one** 1998 NCR design, and the script states it flatly. Hedged wording for ✅: "once the reading settles, on many scales" or "a good scale waits until the reading settles". Researcher: ✅ verified as one NCR patent's design (1998). Speak it as how these scales "can" work or "one design", or keep only the plain idea ("it waits for the number to stop moving"). Don't give the 0.02 lb / 150 ms figures as universal.
- **Source (patent):** [US6215078B1, Method and apparatus for determining a stable weight measurement for use in a security software application of a self-service checkout terminal](https://patents.google.com/patent/US6215078), NCR Corporation (now NCR Voyix), priority 1998-12-22, granted 2001-04-10 (accessed 2026-10-24)
- **Quote:** "each of the ten consecutive current measured weight values must be obtained within 150 milliseconds of one another" / "a predetermined tolerance range, such as 0.02 pounds, of the previous-stable-weight value" / "typically produce varying weight values when initially placed in the bagging area due to sloshing"

---

## B. Where the expected weight comes from

### B1. Scanning the barcode looks the item up, and the record includes an expected weight

- **Script (likely):** "When you scan the barcode, the machine looks the item up, and next to the price is a weight."
- **Status:** ✅ verified (researcher) as "the terminal retrieves an expected weight for each scanned item from a weight database" (several makers' patents). "Next to the price" is our image (🎭-light; the record is a database entry, not literally next to the price). Prefer "along with the price, it pulls up what the item should weigh."
- **Source (patent):** [US6155486A, Method and apparatus for operating a security system of a self-service checkout terminal](https://patents.google.com/patent/US6155486), NCR Corp. (now NCR Voyix), priority 1999-02-08, granted 2000-12-05 (accessed 2026-10-24)
- **Quote:** "retrieve an expected weight value for each item that is scanned or otherwise entered from a weight database"
- **Source (patent):** [US8452660B2, Self-checkout security system and method therefor](https://patents.google.com/patent/US8452660B2/en), Fujitsu Frontech North America Inc., priority 2006-06-06, granted 2013-05-28 (accessed 2026-10-24)
- **Quote:** "To verify the item identification, SCO unit 100 typically obtains the item's expected weight or weights from," … "for example, a database of known or expected weights of items for sale in the retail location."

### B2. Many systems learn the weights from earlier shoppers' purchases (a "self-learning" weight database)

- **Script (likely):** "And that weight usually wasn't typed in by anyone. The machine learned it from every shopper who bought that item before you."
- **Status (fact-check):** line 3 ("a number many systems keep adjusting from past purchases") ✅ verified: NCR sheet "self-learning and self adjusting weight database" (re-quoted, under "Extensive Security"); DN EASY ONE "Self-learning weight data base" (re-quoted; the sheet names the feature, does not explain it); US8843397 "a plurality of weights for an item are captured each time an item is weighed at a checkout station", "dynamically updated over time", applies to self-service checkout; US7044370 automatic update from repeated weighings; LP Magazine: a "weight-learning database software program that is constantly running in the background". Line 1 hook ("it learned what your groceries should weigh from the shoppers before you", on "a lot of self-checkouts") 🟡 **mild overstatement**: (a) "a lot of" is unquantified; the sources show several makers offer the feature, not how many stores run it; (b) "learned from the shoppers before you" is a fair gloss only where the system self-learns (NCR/DN sheets, US8843397, US7044370); US7620568 updates the stored weight only after a barcode and RFID match, and US7044370 also has operator-set values and attendant overrides that are not written back; (c) the sheets don't say how learning works. Hedged wording for ✅: "On a lot of self-checkouts, the bagging shelf is a scale, and on many of them the weight it expects keeps getting adjusted by the shoppers before you." (Or keep the hook and put "many" on the learning: "...and on many, it learned what your groceries should weigh from the shoppers before you.") Researcher text follows. Researcher: ✅ verified (researcher) for "several makers sell self-checkouts with a self-learning weight database" (NCR and Diebold Nixdorf product sheets) and "patents describe updating each item's stored weight from repeated weighings" (ECR Software, NCR). 🟡 for "usually wasn't typed in by anyone" and "every shopper before you": sources say self-learning/self-adjusting; one patent also lets the operator set tolerances, and new items may start from a first weighing or an attendant. Safe wording: "On many machines, that weight is learned: the system records what the item weighed for shoppers before you and keeps adjusting."
- **Source (product sheet):** NCR FastLane SelfServ Checkout data sheet, as in A1
- **Quote:** "Item integrity via self-learning and self adjusting weight database"
- **Source (product sheet):** [DN Series EASY ONE](https://www.jarltech.com/sites/default/files/documents/product/datasheet/en/EASY_ONE_EN.pdf), Diebold Nixdorf product sheet (distributor copy, Jarltech), v1.0-032024 (accessed 2026-10-24)
- **Quote:** "Self-learning weight data base"
- **Source (product sheet, same wording):** [DN Series EASY eXpress product card](https://dieboldnixdorf.com.br/wp-content/uploads/2024/06/DN_Product-Card_EASY-eXpress.pdf), Diebold Nixdorf, v1.0-032022 (accessed 2026-10-24)
- **Quote:** "Self-learning weight data base"
- **Source (patent):** [US7044370B2, Checkout system with a flexible security verification system](https://patents.google.com/patent/US7044370B2/en), ECR Software Corp., priority 2001-07-02, granted 2006-05-16 (accessed 2026-10-24)
- **Quote:** "the security information of an item stored in the database may be automatically updated by the computer software." / "each item's weight information stored in the database may be updated through repeated weight" / "the system may then create a record for the new item and record the measured weight in the database"
- **Source (patent):** [US8843397B2, Self-learning an item's weight range](https://patents.google.com/patent/US8843397), NCR Corp. (now NCR Voyix), priority 2012-03-29, granted 2014-09-23 (accessed 2026-10-24)
- **Quote:** "Weights for items during transactions with an enterprise are recorded and plotted in a data store." / "a plurality of weights for an item are captured each time an item is weighed at a checkout station"
- **Source (patent):** [US7620568B1, Self-checkout system](https://patents.google.com/patent/US7620568), NCR Corp. (now NCR Voyix), priority 2003-12-08, granted 2009-11-17 (accessed 2026-10-24)
- **Quote:** "includes a weight learning database (WLDB), which stores a predetermined weight for each item stocked by the store."
- **Note:** **Strongest surprise candidate.** Why it's done this way (one line, optional): weighing every product up front was tried and was too slow. Loss Prevention Magazine (A1): "The idea was to measure or weigh every single stock-keeping unit (SKU)" … "in practice it simply slowed down transaction productivity". **Fact-check: ❌ do not use this.** Re-opened: the "slowed down transaction productivity" sentence is about early *measuring* (a laser-scanned box dimension tool), not weighing every SKU, and the article says that practice "was not widely adopted". The two fragments are related but not the same point. Not in the current script.

### B3. Weights drift, and the database has to cope (a watered houseplant weighs more)

- **Script (likely):** Optional: "A product's weight can change, a watered plant, a new package, so the stored weight is a range, not one number."
- **Status:** ✅ verified (researcher) as "one maker's patent gives the watered houseplant as an example of an item whose weight varies". "New package" is ❌ (not in an opened source).
- **Source:** US8452660B2 (Fujitsu), as in B1
- **Quote:** "A mismatch in the two weights maybe the result of a change in product weight" / "a product's weight can vary with time, such as a houseplant which is watered during the day"

---

## C. Not every self-checkout has a scale (binding: say "some/many")

### C1. Makers have been moving some models away from weight checks toward camera-based item recognition (maker's claim, 2018)

- **Script (likely):** "Some newer machines skip the scale entirely and use cameras that recognize the item on the scanner."
- **Status:** ✅ verified (researcher) as attributed: the market-leading maker said in 2018 its latest models were "moving away from weight-based detection". 🟡 for how many US stores have done so: no count found. Keep "some newer machines".
- **Source:** [NCR is saying goodbye to the infamous "unexpected item in the bagging area"](https://ixtenso.com/design/ncr-is-saying-goodbye-to-the-infamous-unexpected-item-in-the-bagging-area.html), iXtenso (republished NCR release), 2018-02-02 (accessed 2026-10-24)
- **Quote:** "The latest NCR models are moving away from weight-based detection systems to intelligent image scanners" … "that can recognize items placed on the scanner." / "As well as removing the pain of the weight-based security alert, these scanners have the additional benefit"
- **Note:** The same release says NCR had "a 73 percent market share according to RBR's Global EPOS and Self-Checkout 2017 study" (global, 2017). Not for the voice (brand rule). Original: Business Wire, 2018-01-16 (`businesswire.com/news/home/20180116005390/en/`), not readable in the tool.

### C2. On current machines the security scale is an add-on module, not a given

- **Script (likely):** Supports "some/many" rather than "all". Not spoken on its own.
- **Status:** ✅ verified (researcher) for "Diebold Nixdorf sells the security scale as something added to the side of the unit, in 1, 2 or 4 scale versions" and "Toshiba's weight security is configurable". This shows a store chooses the setup. It does **not** prove any given US chain removed scales.
- **Source:** DN Series EASY ONE, as in B2
- **Quote:** "For further flexibility, a cash rack can be added underneath and a security scale to the side." / "1, 2 or 4 bagging security scale with different heights and design options (with pedestal or cash rack)"
- **Source:** [Toshiba Checkout Environment for Consumer-Service Software](https://tgcs04.toshibacommerce.com/cs/groups/internet/documents/document/dg9z/njyw/~edisp/prod.tos660092.pdf), Toshiba Global Commerce Solutions, brochure RTW12529-USEN-01, 2012-12 (accessed 2026-10-24)
- **Quote:** "configurable, weight-based security with adjustable tolerances."

### C3. Scan-and-go: some US shoppers scan on their phone and skip the machine (and the scale) altogether

- **Script (likely):** "And at some stores you scan everything with your phone and just show a receipt at the door."
- **Status:** ✅ verified (researcher) for Sam's Club Scan & Go (US). The source does not mention scales; "no scale" follows from there being no checkout machine at all (phone scan, receipt at the door). Sam's Club also pilots camera checks at the exit (10 clubs, 2024).
- **Source:** [Scan & Go Helps Create a Safe Shopping Experience for Sam's Club Members](https://corporate.walmart.com/about/samsclub/news/2020/04/30/scan-go-helps-create-a-safe-shopping-experience-for-sams-club-members), Sam's Club / Walmart Inc., 2020-04-30 (accessed 2026-10-24)
- **Quote:** "Scan the UPC barcode on your items as you shop in-club and checkout directly on the Sam's Club app." / "simply show your digital receipt to the associate at the door and head out!"
- **Source:** [AI-powered convenience: The evolution of Scan & Go](https://tech.walmart.com/content/walmart-global-tech/en_us/blog/post/skip-the-checkout-line-with-scan-and-go-at-sams-club.html), Walmart Global Tech blog, staff writer, 2024-01-31 (accessed 2026-10-24)
- **Quote:** "Members use their phones to scan items as they shop and pay for them within the app." / "We're using AI, and more specifically computer vision, to streamline how our members exit our clubs." / "As they walk, our exit technology captures images of carts and analyzes them."
- **Note:** Naming Sam's Club in the voice would be OK only if the line is about its own product (Scan & Go). Simpler: "some stores".

### C4. Costco: owner's observation only (not citable)

- **Script (likely):** Don't name Costco.
- **Status:** ❌ unsupported. Three searches found no reporting, Costco page, or patent describing whether Costco's self-checkouts have a bagging scale. The owner's sighting is a personal observation and can guide the script's "some", but it can't be cited.
- **Note:** The brief says the owner "has personally seen one at Costco". The researcher read this as a self-checkout **without** a bagging scale. If it meant a scale-equipped one, the conclusion is the same: not citable. Please confirm with the owner which one it was (see report).

### C5. Cameras are being added alongside (or instead of) scales: one line

- **Script (likely):** "More and more stores also add cameras that watch for items that never got scanned."
- **Status:** ✅ verified (researcher) for "some US grocers (e.g. Kroger, 2020) use computer-vision cameras at self-checkout to detect unscanned items". "More and more" is 🟡 (trade press says "increasingly", not a measured trend). Use "some stores also use cameras…".
- **Source:** [As self-checkout expands in grocery, here are 4 ways the technology is leveling up](https://www.grocerydive.com/news/as-self-checkout-expands-in-grocery-here-are-4-ways-the-technology-is-leve/620122/), Catherine Douglas Moran and Sam Silverstein, Grocery Dive, 2022-03-14 (accessed 2026-10-24)
- **Quote:** "In 2020, Kroger signed on with Irish artificial intelligence firm Everseen" / "uses computer vision cameras to detect if a shopper didn't scan an item"
- **Note:** This is the single loss-prevention line the owner allows. Don't add a second.

---

## D. The comparison: match or "unexpected item"

### D1. The measured change must fall inside a tolerance window around the expected weight

- **Script (likely):** "It doesn't need an exact match. It allows a window around the expected weight, and anything outside that window is an 'unexpected item'."
- **Status (fact-check):** ✅ verified for script lines 6-7 (window around the expected weight): US6032128 "within a predetermined tolerance range of" and US7044370 "the measured weight must fall within a weight-tolerance range", per-item TOL set by operator, re-quoted; US7841522 "within an expected weight range". "Unexpected item" as the on-screen message is real: NCR's 2018 release (C1, iXtenso) calls it the "infamous 'unexpected item in the bagging area'" (re-quoted). Pairing it with "outside the window" is our explanation, acceptable. Researcher: ✅ verified (researcher) for "a match means within a tolerance range" (NCR, ECR Software patents; IBM and Toshiba product literature: "adjustable" tolerances). "Unexpected item" as the name of the out-of-window result is the familiar on-screen message, not quoted in these sources; that pairing is our explanation (🟡). Fine for the voice as explanation.
- **Source:** US6032128A (NCR), as in A4
- **Quote:** "within a predetermined tolerance range of, the magnitude of a second weight value"
- **Source:** US7044370B2 (ECR Software), as in B2
- **Quote:** "the measured weight must fall within a weight-tolerance range defined by the security weight" / "Each item, preferably, has a different TOL value set by the operator." / "This global-tolerance variable proportionately affects the tolerance of all items in the store."
- **Source:** [IBM Self Checkout (brochure)](https://public.dhe.ibm.com/software/retail/marketing/brochures/self/sco_uke_0198.pdf), IBM, 2003-10 (accessed 2026-10-24)
- **Quote:** "Security scale checks weight of each item" / "Adjustable weight security tolerances"
- **Note:** **No per-item tolerance number was found** in any opened source. The 0.3 lb and 2.5 lb figures in US8452660B2 are thresholds for a **whole order** weighed on a separate audit/floor scale, not for one item on the bagging shelf. Don't use them as "the scale allows 0.3 lb". The 0.02 lb in A5 is a stability filter, not a match tolerance.

### D2. Precision: one maker's bagging scale doesn't weigh anything under about 0.04 lb (18 g) and tops out at 30 lb

- **Script (likely):** "One maker's bagging scale can't register anything lighter than about eighteen grams, and it has to hold thirty pounds of groceries."
- **Status (fact-check):** ✅ verified, spec table re-read on the page: minimum allowable weight 0.040 lb / 0.018 kg, maximum 30.000 lb / 13.610 kg (with bagrack). Not used in the current script. Researcher: ✅ verified as one NCR security scale's spec (US units: 0.040 lb / 30 lb; metric 0.018 kg / 13.61 kg). Say "one bagging scale" or "some", not "every". For a US audience, "about four hundredths of a pound" is awkward. "Under about an ounce" would be ❌ as worded (0.04 lb is 0.64 oz, so "less than an ounce" is ✅ only as "anything lighter than about two-thirds of an ounce"). Recommended: skip the number and use D3's trade-off.
- **Source:** NCR 7709-K710 Security Scale Countertop, as in A2
- **Quote (tool summary of the spec table; the fact-checker should re-read the table):** capacity with bagrack "minimum 0.040 lb (0.018 kg), maximum 30.000 lb (13.610 kg)"

### D3. Why light items cause trouble: a scale built for a full bag can't resolve something very light, so some systems stop checking them

- **Script (likely):** "A scale strong enough for a full bag of groceries is too coarse to notice a pack of gum, so some machines don't weigh-check very light items at all."
- **Status:** ✅ verified (researcher) for the trade-off and "some self-checkout systems have reduced interventions for light-weight items" (IBM/Toshiba patent background) and "some items are so light as to have no appreciable weight", e.g. gift cards and greeting cards (Fujitsu patent). 🟡 for "don't weigh-check them at all": the IBM text says "reduced interventions" by not verifying them on the platter (tool summary), so "some machines don't check very light items" is fair; "never check" is not. "A pack of gum" is our example (the patent uses a drill bit), so 🎭-light. Safer: "a greeting card" or "a gift card" (both in Fujitsu).
- **Source:** US7841522B2 (IBM, now Toshiba), as in A4
- **Quote:** "The security scale platter must have the capacity to measure the weight of a bag full" / "the security scale platter may therefore lack the resolution to distinguish purchase items" / "The security scale platter may be unable to distinguish the drill bit" / "Some self-checkout systems have reduced interventions for light-weight purchase items"
- **Source:** US8452660B2 (Fujitsu), as in B1
- **Quote:** "Some items are so light as to have no appreciable weight." / "items of no appreciable weight, such as gift cards and greeting cards"
- **Note:** The same Fujitsu patent assigns such items a "negligible weight, such as 0.0" (tool summary; re-quote).

### D4. When the check fails, the transaction pauses and an attendant is called

- **Script (likely):** "When the number's outside the window, the screen stops you and calls the attendant."
- **Status (fact-check):** 🟡 plausible for script line 7 "the machine pauses and calls an attendant". Pause ✅ (US6155486, re-quoted: scanners "are not re-enabled so as to suspend the customer's transaction until the weight discrepancy is resolved"; US6032128 "the checkout procedure may be suspended after step 108"). Attendant ✅ but often **second step**: US6032128 pages personnel only when a log threshold is exceeded; US7044370 first tells the customer to take the items out, rescan and reweigh, and "if verification keeps failing, the system notifies a store attendant"; US7347367 "alerts the operator". So "pauses and calls an attendant" is flat. Hedged wording for ✅: "the machine pauses, and if you can't clear it, it calls an attendant."
- **Source:** US6032128A (NCR), as in A4
- **Quote (re-quoted by fact-check):** "pages or otherwise summons the retailer's personnel in order to assist the user" / "the checkout procedure may be suspended"
- **Source:** US7841522B2, as in A4
- **Quote:** "the self-checkout system may notify store personnel to intervene and manually verify the identity of the purchase item."
- **Source:** US6155486A (NCR), as in B1
- **Quote (re-quoted, fact-check):** scanners "are not re-enabled so as to suspend the customer's transaction until the weight discrepancy is resolved."

---

## E. The everyday triggers (which are documented)

| Trigger | Status | Basis |
| --- | --- | --- |
| A bump against the machine | ✅ | E1 (NCR patent) |
| Sloshing liquids | ✅ | A5 (NCR patent) |
| Lifting an item or bag off the shelf before you're done | ✅ | E3 (NCR patents) |
| Very light items not registering | ✅ | D3 |
| Item weight differs from the stored weight | ✅ | B3 (Fujitsu) |
| Air conditioning, wind | ✅ | E1 (NCR patents) |
| Not bagging an item / skipping bagging | ✅ | F1 |
| Leaning on or resting a hand on the shelf | 🟡 | Not named in any opened source. It follows directly from E1 (any added force reads as weight), so "anything that presses on the shelf, even your hand" is reasonable explanation, but not a quoted fact. |
| Placing your own reusable bag on the shelf | 🟡 | The "Use My Own Bag" button exists (F2), which implies an unannounced bag would be read as weight. No opened source says so directly. |
| Leaving an item on the scanner | ❌ | No source. (Some machines also have a scale in the scanner bed, see G1, but no opened source ties this to the alert.) |

### E1. Anything that pushes on the scale, even a bump, reads as a weight change; so do air drafts

- **Script (likely):** "The scale can't tell a can of soup from your elbow. Anything that presses on it changes the number."
- **Status (fact-check):** ✅ verified for script line 8 ("a bump or a draft from the air conditioning"). Re-quoted from US6215078: "if a customer bumps into the self-service checkout terminal, the weight scale may actually register a weight change" and "the cycling of the retail store's air conditioning system can cause changes in the measured weight". "Draft" is our word for it; wind is also in US7347367 ("Wind and other atmospheric disturbances in the vicinity of a self-service checkout system can fool security systems") and US7620568 ("when a hard wind blows against the security scale"). Researcher: ✅ verified (researcher) for bumps and air conditioning/wind (NCR patents). "Your elbow" or "your hand" is 🟡 (our example of a press; not named in sources). Safe: "Even bumping the machine changes the number."
- **Source:** US6215078B1 (NCR), as in A5
- **Quote:** "if a customer bumps into the self-service checkout terminal, the weight scale may actually register a weight change" / "the cycling of the retail store's air conditioning system can cause changes in the measured weight" (second quote from the tool summary; re-quote)
- **Source:** [US7347367B2, System and method of verifying item placement on a security scale](https://patents.google.com/patent/US7347367), NCR Corp. (now NCR Voyix), priority 2004-02-13, granted 2008-03-25 (accessed 2026-10-24)
- **Quote:** "Wind and other atmospheric disturbances in the vicinity of a self-service checkout system can fool security systems"
- **Source:** US7620568B1 (NCR), as in B2
- **Quote (re-checked by fact-check, partial):** error signal can fire incorrectly "when a hard wind blows against the security scale."

### E2. It knows only weight: two items of the same weight look identical to it

- **Script (likely):** Optional, for the "one idea to keep": "It never sees the item. It only knows the weight went up by the right amount."
- **Status:** ✅ verified (researcher) (NCR patent background).
- **Source:** US7040455B2 (NCR), as in A2
- **Quote:** "items having the same weight as one or more items placed on the checkout area may be exchanged without detection."
- **Note:** Don't frame this as a theft tip. Use it only to land "it's a scale, not an eye".

### E3. Taking something off the shelf is also checked (bags have to stay on the scale until you pay)

- **Script (likely):** "Lift a bag off too early and the weight drops, which looks to the machine like something leaving without being paid for."
- **Status (fact-check):** 🟡 plausible for script line 9 "Lift a bag off before you pay, and the weight drops, which stops the machine too". Supported: removal is detected as a weight decrease (US6032128 step 98: scale "detects the item being removed from either the post-scan shelf 42b or from one of the grocery bags 40"; US7620568 "detect placement of items into and out of the bag wells"). Consequence in US6032128 is for removing the wrong or just-weighed item: terminal "instructs the user that the wrong item was removed", logs it, and may summon personnel past a threshold. US12136077 only says bags are kept on the scale ("maintained in contact with the scale 110 during the checkout process"); it says nothing about a removed bag, and I found no source that says lifting a bag before paying stops the machine (voided-item section of US6032128 was in the unread tail). Hedged wording for ✅: "Lift a bag off before you pay, and the weight drops, which can trip the machine too." (or "which counts as a change too"). Researcher: ✅ verified (researcher) for "removal is detected as a weight decrease and matched against scanned items" (NCR) and "bags stay in contact with the scale during checkout" (Toshiba). "Looks like something leaving without being paid for" is 🟡 interpretation; safe: "and the machine stops to ask why."
- **Source:** US6032128A (NCR), as in A4
- **Quote:** "detecting a weight decrease associated with removal of the item from the grocery bag 40." / "the processing unit 26 retrieves a weight value from the transaction level weight database"
- **Source (patent):** [US12136077B2, System, apparatus and article of manufacture for moveable bagging systems in self-checkout systems](https://patents.google.com/patent/US12136077), Toshiba Global Commerce Solutions, priority 2019-02-13, granted 2024-11-05 (accessed 2026-10-24)
- **Quote:** "the bags storing the scanned items are maintained in contact with the scale 110 during the checkout process." / "In this way, the self-checkout system can verify that the scanned items are the ones placed into the bag."

---

## F. The buttons

### F1. "Skip bagging" (not bagging an item) asks the attendant for approval and, in one design, is counted in a security log

- **Script (likely):** "And the skip-bagging button doesn't switch the check off. It asks the attendant, and some machines keep count of how often you press it."
- **Status:** ✅ verified (researcher) as "NCR patents describe it": approval request to the attendant (2004 application, abandoned) and a security-log count that can flag a transaction for audit (1999 patent, granted). 🟡 for today's machines: no current manual opened. Spoken safely as "some machines…" or "one maker's design…". Keep the tone factual, not a warning.
- **Source (patent):** US6155486A (NCR), as in B1
- **Quote:** "configured to allow the customer opt out of placing his or her items in the post-scan area 17" / "does track the number of occasions in which the customer opts out of placing the item" / "increments an electronic security log value" / "to determine if the customer's transaction needs to be audited or otherwise investigated"
- **Quote (why people skip):** "a relatively bulky item such as a fifty-pound bag of dog food"
- **Source (patent application):** [US20050283402A1, System and method of facilitating remote interventions in a self-checkout system](https://patents.google.com/patent/US20050283402A1/en), NCR Corp. (now NCR Voyix), filed 2004-06-22, published 2005-12-22, abandoned 2010 (accessed 2026-10-24)
- **Quote:** "fails to bag a purchased item, triggering an approval request to the attendant station."
- **Note:** **Good payoff candidate** (lived frustration: "why does skip bagging still call someone?"). The security-log count is the one surprising extra; it is one design from 1999, so attribute it.

### F2. "Use my own bag": the button exists; what it does inside is not sourced

- **Script (likely):** "Press 'own bag' before you put it down, so the machine expects the extra weight." (**Don't script the mechanism yet.**)
- **Status:** ✅ verified (researcher) that a "Use My Own Bag" button exists on at least one maker's software (Toshiba, 2012). ❌ unsupported for what it does: no opened source says whether it zeroes (tares) the scale, records the bag's weight, or flags the attendant. About twelve searches (patents, maker docs, retailer FAQs) found nothing citable. Forum posts describe it but are not sources.
- **Source:** Toshiba Checkout Environment brochure, as in C2
- **Quote:** "to use their own or store-bought reusable ecology bags" … "by pressing the "Use My Own Bag" button."
- **Note:** Safe spoken version: "That's why some machines have an 'own bag' button: your bag weighs something too." The first half is ✅ (button exists); the reason is 🟡 (our inference from A4: any added weight is read as an item). Leads to try in a browser: US9033227 ("Methods and systems for performing security weight checks at checkouts"), US20080061139A1 ("Self-checkout terminal including scale with remote reset"), an NCR or Toshiba user/operator guide.

---

## G. The other scale(s)

### G1. Some machines also have a scale built into the scanner bed, used for produce and (in some designs) to check scanned items too

- **Script (likely):** Probably not spoken. If needed: "Some machines have a second scale right under the scanner glass, the one that weighs your bananas."
- **Status:** ✅ verified (researcher) for "a produce scale integrated with the scanner" (NCR patent; NCR data sheet "Integrated scale for produce"). 🟡 for "the scanner scale also checks barcoded items": one Fujitsu patent background says a terminal "may" verify the expected weight against the scanner scale. Not shown as standard.
- **Source:** US6032128A (NCR), as in A4
- **Quote (re-quoted, fact-check):** "the product scale 12 is integrated with the scanner 14." NCR data sheet "Integrated scale for produce" re-quoted (in "Key features", presented as produce weighing, not security). Fujitsu "verify the item's expected weight against the weight measured by Scanner Scale 120" re-quoted. Not in the current script.
- **Source:** NCR FastLane SelfServ Checkout data sheet, as in A1
- **Quote:** "Integrated scale for produce"
- **Source:** US8452660B2 (Fujitsu), as in B1
- **Quote:** "SCO unit 100 may verify the item's expected weight against the weight measured by Scanner Scale 120." / "Next, SCO unit 100 instructs the customer to place the item in a bag in bagging area 130."
- **Note:** Some setups add a third, separate audit scale for full bags ("an optional security scale and secondary bagging area", Fujitsu) or a cart floor scale. Out of scope.

---

## H. Payoff facts the viewer can check next time

| Candidate | Status | Entry | How the viewer checks it |
| --- | --- | --- | --- |
| Set a bottle down and wait a beat: the scale waits for the number to stop moving before it judges | ✅ (one design) | A5 | Watch the screen pause after a drink goes down. |
| The weight it expects was learned from shoppers before you | ✅ as "many machines" | B2 | Not checkable at the till; best as the surprise, not the payoff. |
| Lift a bag before paying and the machine stops you | ✅ | E3 | Very checkable (most people already have). |
| Bump the machine and it can complain | ✅ | E1 | Checkable, but don't encourage it. |
| "Skip bagging" calls the attendant, it doesn't switch the scale off | ✅ (patents) | F1 | Checkable. |

**Recommended payoff:** "Next time it complains, look at what last touched the shelf: the scale only knows the number changed." It ties E1, E3 and A4 together and is checkable, with no theft tip.

---

## Myths and what the evidence says

| Myth | What the evidence says | Entry |
| --- | --- | --- |
| "Every self-checkout weighs your stuff." | Many do; some newer models use image recognition instead, the scale is an add-on module, and scan-and-go has no machine at all. | C1–C3 |
| "It has a camera that sees what you bagged." | On scale machines the check is weight only; the same weight means the same item to it. Cameras are a separate, newer layer. | A4, E2, C5 |
| "The weight was entered by the store for every product." | Many systems learn weights from past sales and keep adjusting; weighing every item up front was tried and was too slow. | B2 |
| "It needs an exact match." | It allows a tolerance window, adjustable by the store and per item. | D1 |
| "It weighs your whole bag every time." | It reads the change after each item, once the number has settled. | A4, A5 |
| "Skip bagging turns off the security." | In the designs found, it asks the attendant to approve, and one design logs how often you use it. | F1 |
| "Light items are always checked." | A scale built for a full bag can't resolve very light items, and some systems stop checking them. | D3 |

## Script line map (fact-check, final script of 11 lines)

| Line | Claim | Status | Entry | Fix (exact wording) |
| --- | --- | --- | --- | --- |
| 1 | Bagging shelf is a scale on "a lot of" self-checkouts | ✅ | A1 | none |
| 1 | "it learned what your groceries should weigh from the shoppers before you" | 🟡 | B2 | "...and on many, it learned what your groceries should weigh from the shoppers before you." |
| 3 | Barcode pulls up expected weight | ✅ | B1 | none |
| 3 | "a number many systems keep adjusting from past purchases" | ✅ | B2 | none |
| 4 | "a load cell that weighs the whole platform" | 🟡 | A2 | "there are load cells that weigh the whole platform" (patent design has four) |
| 5 | "once the reading settles" | 🟡 | A5 | "once the reading settles, on many scales" (one 1998 patent design) |
| 5 | scale checks how much the weight went up | ✅ | A4 | none |
| 6 | window around expected weight | ✅ | D1 | none |
| 7 | "unexpected item" message | ✅ | D1, C1 | none |
| 7 | "pauses and calls an attendant" | 🟡 | D4 | "the machine pauses, and if you can't clear it, it calls an attendant" |
| 8 | bump or AC draft changes the number | ✅ | E1 | none |
| 9 | lifted bag drops weight "which stops the machine too" | 🟡 | E3 | "which can trip the machine too" |
| 10, 11 | rhetorical, no factual claim | n/a | | none |

**Re-check of the revised script (fact-check, 2026-10-24):** line 1 is now only "On a lot of self-checkouts, the bagging shelf is a scale." Lines 1, 3, 4, 5, 7, 9 re-read against the entries above. Final statuses for the revised wording:

| Line | Revised claim | Final status | Entry | Note |
| --- | --- | --- | --- | --- |
| 1 | "On a lot of self-checkouts, the bagging shelf is a scale." | ✅ | A1 | Learned-weight claim moved out. |
| 3 | "a number many systems learned from the shoppers who bought it before you" | ✅ | B2 | "Many systems" matches the sources' own scope: NCR and Diebold Nixdorf sheets (self-learning), US8843397 (weights captured each time an item is weighed at a checkout), US7044370 (updated from repeated weighings). Caveat kept in B2: no count of how many stores run it, and some designs only update after a barcode/RFID match (US7620568). Do not strengthen to "most" or "every". |
| 4 | "sensors called load cells weigh the whole platform" | ✅ | A2 | US7040455 (four load cells, "a scale underneath it", weight accumulated). Plural matches the patent. |
| 5 | "the scale checks how much the weight went up" | ✅ | A4 | Settle idea dropped, so the A5 hedge is no longer needed. |
| 7 | "'unexpected item' and the machine pauses, and if you can't clear it, it calls an attendant" | ✅ | D4, D1 | Matches US6155486 (pause), US7044370 (rescan first, then notify attendant). |
| 9 | "if you lift a bag off before you pay, the weight drops, which can trip the machine too" | 🟡 | E3 | Allowed because "can" is a hedge. The weight drop on removal is sourced (US6032128, US7620568); no opened source names lifting a bag before payment specifically. Do not change "can" to "will". |

Lines 2, 6, 8, 10, 11 unchanged: ✅ or rhetorical as in the first map. No ❌ in the revised script.

No company is named in the script (brand rule met). Legal flags: none new; the patent-based claims name no maker in the voice. Costco (C4): owner's sighting is not citable and stays out.

## Suggested angles and hooks (all say "some/many")

1. **The learned weight (pattern 5, "the wrong recipient"; strongest surprise).**
   Hook: "On a lot of self-checkouts, the shelf you put your bags on is a scale, and it learned what your groceries should weigh from the shoppers who bought them before you."
   Question (by ~5 s): "So how does it decide something's 'unexpected'?"
   Facts: A1, B1, B2, A4, D1, E1, E3.

2. **The lived moment (pattern 1; most recognizable).**
   Hook: "When a self-checkout says 'unexpected item in bagging area', it hasn't seen anything; on many machines it's a scale noticing a number that changed by the wrong amount."
   Question: "What number was it expecting, and where did it get it?"
   Facts: A4, B1, B2, D1, E1, E3, F1. Careful: "hasn't seen anything" must stay tied to "on many machines" (camera layers exist, C5).

3. **The elbow (pattern 3, "the role"; shortest path to the frustration).**
   Hook: "On many self-checkouts, the bagging shelf is a scale so sensitive that bumping the machine can set it off, because all it knows is how much weight just changed."
   Question: "So what is it actually comparing that weight against?"
   Facts: E1, A5, A4, B1, B2, D3.

**Proposed one-sentence surprise:** "On many self-checkouts, the bagging shelf is a scale that only watches the weight change, and the weight it expects for each item was learned from the shoppers who bought it before you."

## 7-step outline (about 45–55 s; American English)

| Step | Beats (not script) | Entries |
| --- | --- | --- |
| 1. Surprise | The bagging shelf on many self-checkouts is a scale; frame 0: the cut-open checkout, load cell under the shelf lit orange. | A1, A2 |
| 2. Specific | It doesn't see your groceries; it reads the change in weight each time something lands or leaves. | A4 |
| 3. Question | "So how does it know what a can of soup should weigh?" | — |
| 4. Mechanism | Scan → lookup → expected weight (learned from earlier shoppers, keeps adjusting) → item lands → number settles → inside the window or not → attendant. Light items: too light to register, so some machines skip them. | B1, B2, A5, D1, D3, D4 |
| 4b. Triggers | Bump, a bag lifted early, a bottle still sloshing: all just numbers. "Own bag" button exists because your bag weighs something too (🟡). Skip-bagging asks the attendant. | E1, E3, A5, F2, F1 |
| 4c. Not all | Some newer machines use cameras on the scanner instead, and some stores let you scan on your phone. | C1, C3 |
| 5. Keep | "It's a scale, not an eye." (Rephrase; avoid the "not X, but Y" slogan shape.) | E2 |
| 6. Attribute | No company names; "the makers' own patents describe…" if needed. | — |
| 7. Turn back | "Next time it complains, look at what last touched the shelf." End on frame 0. | E1, E3 |

## 3D scene list (The Section)

1. **Frame 0:** a self-checkout cut in half from the side: scanner glass, bagging shelf, and under the shelf a realistic load cell (or four, at the corners, A3 as picture only), lit orange.
2. **The scan:** a can passes the scanner; a detail box shows a generic item record with price and an expected weight range (🎭 numbers, disclosed).
3. **The learned weight:** a ghosted queue of grey extras placing the same can, each adding a dot to a small bell-curve chart that becomes the range (B2; the bell graph is in NCR's patent US8843397).
4. **The landing:** YOU sets the can down; a needle/readout wobbles, then settles (A5); the number lands inside the window (the window and readout are the system, so orange).
5. **The triggers:** an elbow bump, a bag lifted, a bottle sloshing; each one moves the readout out of the window and the screen stops.
6. **Light item:** a greeting card lands; the readout doesn't move (D3).
7. **Not all:** a second, newer checkout with a camera over the scanner and no shelf scale; a phone scanning a barcode (C1, C3).
8. **Payoff and loop:** glide back to frame 0.

## Legal flags

| Name | Where | Risk | Why |
| --- | --- | --- | --- |
| NCR / NCR Voyix, Fujitsu, IBM / Toshiba, ECR Software, Mettler Toledo, Diebold Nixdorf | A–G | Low | Patents and product sheets, cited only as sources. **Do not name them in the voice.** A patent is a described design, not proof of current practice. |
| Kroger, Everseen | C5 | Low | Trade-press fact (Grocery Dive). Not needed in the voice; say "some stores". |
| Sam's Club / Walmart | C3 | Low | Their own product pages. Name only if the line is about Scan & Go itself. |
| Costco | C4 | — | No source; don't name. |
| "Skip bagging is logged" | F1 | Low–medium | True of one 1999 patent design; say "some machines" or "one design" so it isn't read as a claim about a specific store. Calm tone. |
