# Sources: fiber-sharing (No. 002)

Researcher draft, 2026-10-16; fact-checked 2026-10-16 against the written `script.txt` (see "Fact-check of the written script" below, which overrides the per-entry statuses where they differ).
All sources were accessed 2026-10-16. Quotes are verbatim; long sentences are quoted in pieces joined by "…".
Per-entry "Script (likely)" lines are the researcher's earlier suggestions, in American spelling ("fiber", "neighbors"); the written script is the reference.
Entries are in the order the recommended structure would use them (see "Suggested angles" at the end).

> **Topic pivot (owner, 2026-10-16):** No. 002 is now **"how a beam of light is coded into packets and back"**; its entries start at **41** (section "Light to packets" at the end of this file). The street/sharing material (entries 1–24, the fact-check table just below, which was written for that earlier script, and the "Suggested angles" section) and the New York to London journey (entries 25–40 and its section) are **Saved for a later video (journey / sharing)**, not deleted. Entries reused by the new angle: 2 and 25 (infrared), 12 (PON wavelengths), 14 (GPON line rates), 15–17 and 24 (DWDM colours), 5–6 and 9–10 (broadcast, labels, 125 µs frames), 27 (packets and the 1,500-byte limit), 37 (light at about two-thirds c).

Access notes for the fact-checker:

- The ITU-T PDFs (G.984.1 etc.) downloaded but could not be read in the research tool (no PDF text layer available). ITU facts below therefore rest on ITU **summary pages** (opened) and on vendor documents that restate the standard (Cisco, Viavi). If a human can open `T-REC-G.984.1-200803-I` clause 12 ("Split ratio") and clause 15 ("Security"), please confirm 3 and 7 against it.
- The DEF CON 34 speakers page (`defcon.org/html/defcon-34/dc-34-speakers.html`) reset the connection three times. The Black Hat slides PDF was over the size limit. Entry 8 rests on Hackaday (opened) only.
- Business Wire returned 403; entry 18 uses a verbatim repost of the same press release on silicon.co.uk.

Fact-checker access result for the ITU primaries (2026-10-16): the G.984.1 PDF and EPUB downloaded but the tool could not extract their text (compressed streams; no PDF renderer available). **Confirmed from the ITU HTML pages (opened):** G.984.1 (03/2008) has clause 12 "Split ratio" and clause 15 "Security" (table of contents), and its summary gives 2.4 Gbit/s down and 1.2 or 2.4 Gbit/s up. G.984.3 (03/2008) has 8.1 "Downstream GTC frame structure", 8.2 "Upstream burst structure", 7.4 "Dynamic bandwidth assignment" and clause 12 "Security" (12.2 "Encryption system"; Annex A.2 "AES mechanism") (table of contents only). **Not confirmed from the ITU text itself:** the split-ratio numbers in clause 12, the exact clause wording on broadcast, the 125 µs frame, BWmap placement, and the wavelength ranges (G.984.2). Those rest on Cisco, EIB and the Broadband Forum models, which were opened. Someone with a PDF reader should skim G.984.1 clauses 12 and 15 and G.984.3 clause 8.1 before publishing; no claim below changes if they agree with Cisco.

## Fact-check of the written script, No. 002 "light to packets" (2026-10-16)

Script checked: `script.txt` as written 2026-10-16 (15 sentences, about 280 words). Sources opened by the fact-checker this pass: FOA (transceiver, lasers, dB, telecom pages), Cisco GPON explainer and GPON SFP data sheet, D-Link DPN-100, Juniper (overview and 400ZR table), Skylane Optics, Marvell and Ericsson and FutureWei patents (Google Patents), EE Times (Maxim), NetApp KB, RFC 9293, Wikipedia (Fiber-optic communication, Internet backbone, Reed-Solomon), TeleGeography. New supporting entries are **59 to 62** at the end of the "Light to packets" section.

Verdict: **BLOCKED** on one item, the last sentence (row 15 below), which is false as worded for viewers whose last link is not a fiber box on a wall (mobile, cable, DSL). One short wording fix clears it. Everything else is ✅ or 🟡 with a listed hedge; the REQUIRED hedges (rows 1, 8, 16) must also be applied before approval.

| # | Script line | Status | Entry | Note / exact fix |
| --- | --- | --- | --- | --- |
| 1 | "Before you saw this video, it was turned into blinking light and back into a picture." | 🟡 as written; ✅ with fix | 59, 58 | Backbone and long-distance links are fiber (FOA: "the entire telephone backbone is fiber optics"; Wikipedia: fiber "largely replaced copper wire communications in backbone networks in the developed world"; CRS: about 95% of intercontinental traffic on subsea fiber). So a video served to essentially any viewer crossed fiber somewhere. But no source says "every video", metro and data-centre links are not separately sourced, and "Before you saw this video" asserts it with certainty about each viewer. Fix (17 words, about 5.8 s at 2.92 w/s, so the question still starts before 6 s): "On its way to you, this video was turned into blinking light and back into a picture." REQUIRED. Do not use "Somewhere on its way to you" (18 words, 6.2 s). Note the light is turned back into bits and the device then builds the picture; fine as a lay hook because the script explains it. |
| 2 | "So how do you turn a picture into light, and light back into a picture?" | n/a | n/a | Question, no claim. |
| 3 | "It takes a chip at each end of a fiber, both following the same rules for every flash." | ✅ | 58, 41, 48 | A transmitter at one end and a receiver at the other (FOA); "same rules" = the standard both ends follow. |
| 4 | "Say you send a friend a photo, and it reaches the box on your wall by Wi-Fi." | 🎭 | addendum note | Wi-Fi is radio (no number claimed). That the viewer's home has a fiber box is illustrative. Disclose: "Illustrative: a home with fiber; many homes use cable, DSL or mobile." |
| 5 | "Inside, a laser flashes bright for each 1 and dim for each 0." | ✅ | 41 | FOA (opened): lasers "are biased at the threshold then modulated with small current changes to get large changes in light output", so a 0 is dim, not dark. "Bright and dim" is the more accurate choice; FOA's simpler line is "turned off for a 0". Keep "dim". |
| 6 | "Before that, the bits are packed into frames that start with a fixed pattern, and spare bits for repairs can be added." | 🟡 | 52, 55, 62 | Generic wording is acceptable. Facts: the downstream GPON frame starts with a fixed 32-bit PSync pattern (Marvell patent, opened; Cisco: "Indicates the start of every PCBd") and is 125 µs. Upstream (your box) sends bursts that begin with a preamble and delimiter set by the exchange (patent search excerpts only, not opened as text; Cisco: "Upstream frames are sent as bursts" with "PLOu"), so "start with a fixed pattern" is true in spirit for both but the exact fixed pattern is downstream. "Can be added" is correctly hedged (FEC is optional; Cisco says its product supports FEC downstream only). For ✅ with no caveat: "frames that start with a marker pattern". Leave as is if the owner prefers. |
| 7 | "The real light is infrared, so the colors you see here are ours." | ✅ | 2, 25 | Eye 380 to 700 nm (NASA); GPON 1290 to 1500 nm (Cisco). |
| 8 | "Long-distance links also shift the light's wave and use two orientations, so one flash can carry 8 bits." | 🟡 | 56, 61 | Numbers ✅: DP-16QAM = 4 bits per polarization x 2 polarizations; 400ZR line rate 478.750 Gbps / 59.84375 GBd = 8.0 (Juniper table, opened; Skylane table: 16QAM 4 bits, 25G, 200G, PDM). Scope problems: (a) DP-16QAM is 400ZR, reach 40 km unamplified or 120 km amplified (Juniper), i.e. links between cities, not all long-distance links; (b) "shift the light's wave" covers phase only, but 16QAM also varies strength (amplitude) (Juniper: "QAM adds amplitude variation to phase states"). REQUIRED hedge. Fixed wording: "Some faster links between cities also change the light's strength and timing in its wave, and use two orientations, so one flash can carry 8 bits." (If length matters: "Faster links between cities also vary the light's wave and use two orientations, so one flash can carry 8 bits.") "Flash" for a symbol: acceptable as a lay word (see 61), 🟡. |
| 9 | "At your friend's box, a light sensor turns each flash into a tiny current, even when a bit is only a few thousand particles of light." | 🟡 | 48, 49 | Photodiode ✅ (FOA). Arithmetic checked, see 49: -28 dBm = 1.585 µW; photon energy at 1490 nm = 1.333 x 10^-19 J; 1.189 x 10^13 photons/s; / 2.48832 x 10^9 bits/s = about 4,800 photons per bit on average. Correct, and "a few thousand" holds also at -27 dBm (about 6,000). Two caveats: it is the receiver's rated limit (worst case), and the average over 1s and 0s (a "1" is about twice that). Say "even when" (as written, correct) and keep "a few thousand"; do not say "exactly". Also see row 16. |
| 10 | "A chip checks that current once per bit, calling it a 1 above a set level and a 0 below." | ✅ | 50, 60 | EE Times (Maxim): the sampling circuit "compares the instantaneous voltage of the input waveform to the decision threshold"; above it "indicates that a binary one was sent". Patent US6275959 background: "A given sample is assumed to be a logic one if it exceeds the threshold, or logic zero otherwise." The current is first converted to a voltage; "checks that current" is a fair lay simplification. No textbook page could be opened (Agrawal's Rochester slides returned 404), so the sources are an engineering article and a patent background; acceptable for a mechanism that is standard design. |
| 11 | "With no clock wire, the chip keeps time from the light's changes, so the sender scrambles the bits to keep them changing." | ✅ | 51, 62 | Ericsson patent: "Clock and Data Recovery (CDR) works best when there is high enough transition density in the signal."; Marvell patent: "the downstream transmission frame for GPON is scrambled". True for downstream, which is the receiving end the script is describing. Upstream GPON scrambling is not claimed and not sourced. |
| 12 | "The fixed pattern, every 125 millionths of a second, tells it where each frame starts." | ✅ | 52 | Downstream: Cisco "A downstream GPON frame has a fixed length of 125 μs" and "Physical synchronization field. Indicates the start of every PCBd."; Marvell "fixed 32-bit pattern ... that begins every PCBd". Correct for the friend's box (downstream). |
| 13 | "Repair bits fix small errors on the spot, and a packet that's still damaged is thrown away and sent again." | ✅ (one hedge) | 53, 54, 55 | Repair: FutureWei patent (opened) "detect and correct errors", "An RS(n, k) code can correct up to (n-k)/2 (random) symbol errors"; RS(255,239) = 16 parity bytes, so up to 8 bad bytes per block; Cisco: FEC "Does not require data retransmission." and is one-way. Thrown away: NetApp "Bad CRC: frame is dropped". Sent again: RFC 9293 "TCP uses retransmission". Hedge: resending happens at the sender via TCP or similar (QUIC; not sourced), not by every protocol (live UDP video does not resend). "Still damaged" is correct sequencing (fix first, drop if beyond repair). Optional precision: "and the sender sends it again". |
| 14 | "Then the packets are rebuilt into the photo on her phone." | ✅ | 27, 54 | RFC 791 "pieces that can be later reassembled". In reality the photo passes through the messaging service's servers (journey trap 2); "her phone" is the destination, fine. |
| 15 | "So a moment ago, the picture on your screen was millions of flashes of light, too fast and too faint for any eye, and a chip on a wall read every one." | ❌ as worded | 59, 49, 43, 62 | Three problems. (a) "a chip on a wall" is false for any viewer whose last link is mobile radio, cable coax or DSL; and on every path a chip other than one on a wall also read the light (routers, data centres, exchange). The fiber box on a wall is only the example friend's. (b) The referent shifts: the story's photo reaches "her phone", but this line says "your screen". (c) "read every one" is the ideal; errors occur and are repaired or resent (FEC, CRC, TCP). "Millions" is safe (a 3 MB photo is 24 million bits, 🎭, entry 57; a video is far more). "Too fast" ✅ (0.4 ns per bit, entry 43); "too faint" is true at the receiver (microwatts) and the light is invisible regardless. Recommended fix, 8 words after the comma instead of 9: "So a moment ago, the picture on your screen was millions of flashes of light, too fast and too faint for any eye, and chips along the way read every one." Alternative that keeps the friend story and the wall: "…the photo on her phone was millions of flashes of light, too fast and too faint for any eye, and a chip on her wall read every one." (✅ as the story's example; loses the loop to the hook's "this video".) |
| 16 | Implied single trip: sentences 4, 5 and 9 read as if the flashes your laser makes are the flashes her sensor receives | 🟡 REQUIRED fix | 12, 58 | Not true. The light your box sends (1310 nm, 1.244 Gb/s upstream) ends at the exchange; light is turned back into bits and sent on as new light (other wavelengths, 1490 nm and 2.488 Gb/s on the last downstream link) at every stop, and the photo also passes through servers. Sentence 3 says "a chip at each end of a fiber", which is correct per link, but sentence 9 ("At your friend's box") reads as the far end of your fiber. Minimal fix, 5 words added: sentence 9 begins "At the far end of a fiber, like your friend's box, a light sensor turns each flash into a tiny current…" and the last line uses "chips along the way" (row 15). No other change needed. |
| 17 | Named companies or people anywhere in the script | ✅ none | n/a | Legally sensitive items: none. the script names no company or person. Vendors, patent holders (Ericsson, Marvell, FutureWei) and the research bodies appear only here and in the post description; cite the patents as "described in patent US...", not "X says". |

Ruling summary for the owner's nine questions: (1) hook ✅ with the 17-word fix; (2) last line needs the fix above, BLOCKED until applied; (3) arithmetic correct, about 4,800 photons per bit on average (6,000 at -27 dBm), "a few thousand" stands; (4) "flash" acceptable as lay language for a symbol, 🟡, with the scope fix for line 8; (5) ✅ via EE Times and a patent background, textbook not reachable; (6) generic wording OK, 🟡; (7) ✅ with a TCP hedge; (8) yes, fix needed (line 16); (9) ✅, keep "dim".

Observation outside fact-checking: about 280 words is about 95 s at 2.92 words/s; `CLAUDE.md` says Shorts run 30 to 60 s and over 60 s only when the story needs it. Left for the scriptwriter and owner.

### Re-check of the rewritten script (264 words, 14 sentences), 2026-10-16

The table above was for the earlier 280-word script and is superseded where it differs. Verdict: **BLOCKED on one word** ("guarantees"); one REQUIRED placement fix; the rest ✅ or 🟡 with hedges.

| Script line | Status | Entry | Fix |
| --- | --- | --- | --- |
| "On its way to you, this video was turned into blinking light and back into a picture." | ✅ | 59 | Applied as recommended. |
| "stored on a server as 1s and 0s called bits, and leaves through a small plug-in laser module." | 🟡 | 72 | FOA: server-access links "may be on copper up to 10G"; switch links are fiber. Wording for ✅: "and moves onto fiber through small plug-in laser modules." |
| "A chip packs the bits into frames that start with a marker pattern and can carry spare repair bits. It scrambles them too, so the light keeps changing." (placed at the server) | 🟡 REQUIRED | 51, 52, 55, 62 | The opened sources (Marvell, Cisco, FutureWei, Ericsson) are GPON: the exchange laser sending down to the home box. Nothing opened covers server modules (Ethernet 64b/66b and RS-FEC appear only in search excerpts). Generic wording is true in spirit but not ✅ as placed. Minimal fix: "On the last stretch, from your local exchange to your home, a chip packs the bits into frames that start with a marker pattern and can carry spare repair bits. It scrambles them too, so the light keeps changing." The router clause then sits better before this sentence. |
| "The laser flashes bright for each 1 and dim for each 0, billions of bits a second." | ✅ | 41, 43 | GPON 2.488 Gb/s down (1.244 up, "over a billion"); data-centre modules 400G. "Billions" holds for the downstream and module links. |
| "each router reads it into bits and resends it as new light" | 🟡 | 73 | "Each" over-promises (optical switching, copper links). Wording for ✅: "and routers along the way read it into bits and send it on as new light." |
| "With no clock wire, it keeps the beat from the changes the scrambling guarantees." | ❌ as worded | 51 | Ericsson patent: random-looking data has "a low probability of long runs"; scrambling makes changes likely, not guaranteed (the same patent notes a scrambler can still emit long runs). Fix: "…it keeps the beat from the changes, which the scrambling keeps coming." |
| "The flashes come like Morse code with no gaps, so the marker pattern shows where each frame begins." | 🟡 analogy OK | 52 | Acceptable as an analogy for the continuous downstream stream (upstream bursts do have gaps; the script is at the box on the wall, so downstream). Morse differs (variable-length marks, pauses). Cleaner: "The flashes arrive as one unbroken stream, like Morse code with no pauses, so…". |
| "a packet still damaged is thrown away and sent again" | 🟡 acceptable | 54 | Right for on-demand video over TCP or QUIC (RFC 9293 "TCP uses retransmission"; QUIC not sourced). Live calls do not resend. Optional: "and usually sent again". |
| "In the box on your wall…", "reach your phone by Wi-Fi" | 🎭 | 4, 70 | Illustrative for viewers with a fiber home; disclose in the post. |
| "A chip boosts that current" | 🟡 | 48 | Amplifier stage is standard but only the APD gain is sourced; acceptable. |
| Last line "chips along the way read every one" | ✅ | 59 | Applied. |

### Re-check of the full rewrite (522 words, 26 sentences), 2026-10-16

Supersedes the two tables above where they differ. Verdict: **PASS** (no ❌). Four REQUIRED hedges (marked) must be applied before approval. Earlier fixes survived: hook, "usually sent again", "which the scrambling keeps coming", Morse "no pauses", exchange placement, "chips along the way read every one".

| Script line | Status | Entry | Fix |
| --- | --- | --- | --- |
| "often stored on a server's flash drives" | 🟡 hedged by "often" | 78 | Netflix Open Connect (one CDN) uses SSDs; fine as worded. |
| "software, often helped by the network card, cuts it into numbered packets, each addressed like an envelope" | ✅ | 78, 65 | Linux kernel docs (TSO/GSO); RFC 791 addresses; TCP sequence numbers. |
| "move onto fiber through small plug-in laser modules" | ✅ | 72, 78 | Hedge applied (server-access copper, FOA). |
| "In many modules, a chip first cleans up the signal, then a driver…" | 🟡 hedged by "many" | 79 | Driver ✅ (FOA); retimer chip only in search excerpts. |
| "a tiny crystal that glows when current flows through it" | 🟡 REQUIRED | 79 | The light is infrared, so "glows" suggests visible light before the script says otherwise. TU Graz: electrons and holes "recombine and emit light". Fix: "a tiny crystal that gives off light when current flows through it". Mirror-smooth ends: cleaved crystal faces (TU Graz) fit edge-emitting lasers; VCSELs and DFBs use layered mirrors or gratings, so this is the simple-laser picture (🟡, acceptable). |
| "Many fast modules in data centers use four brightness levels, so each flash carries two bits." | ✅ | 80 | Viavi: PAM4 "four amplitude levels, each containing two bits", used in hyperscale 400G. |
| "A tiny lens usually focuses the beam…" | 🟡 REQUIRED | 81 | Source shows lenses or direct coupling (one research design); "usually" is unsourced. Fix: "A tiny lens often focuses the beam…". |
| "about nine thousandths of a millimeter wide" | ✅ | 81 | 9 µm = 0.009 mm; FOA "only about 9 microns". "Inside a strand about as thin as a hair": BIPT. |
| "each link reaches only a few hundred meters to tens of kilometers" | 🟡 REQUIRED | 84 | Sourced reaches: SR8 100 m (multimode), DR4 500 m, FR4 2 km, LR4 10 km, 400ZR 40 km unamplified / 120 km amplified. "A few hundred" overstates the short end; "tens of kilometers" understates the long end. Fix: "so each link reaches only about a hundred meters to over a hundred kilometers". |
| "Two amplifiers turn that trickle into clean electrical steps, and a chip decides whether each one is a 1 or a 0" (router) | 🟡 REQUIRED | 82 | TIA plus limiting amplifier are real (TI, Semtech) but are on-off receivers; the PAM4 modules the script just described use linear amplification and a DSP, deciding among four levels. Fix: "In many modules, two amplifiers turn that trickle into clean electrical steps, and a chip decides whether each one is a 1 or a 0." |
| "at up to hundreds of billions of lookups a second" | ✅ | 83 | Techzine: "more than 435 billion so-called lookups per second" (2023 vendor chip family). "Up to" is the right hedge; lookups, not packets. |
| "closest match in its table of routes" | ✅ | 83 | RFC 1812 §2.2.5.2 longest matching prefix. |
| "Then a new laser sends the packet on as fresh light." | ✅ | 73, 84 | Regeneration at routers; "routers along the way" hedge survived. |
| "Two amplifiers clean up that current" (home box) | ✅ | 86 | Semtech ONU chipset: limiting amplifier plus separate TIA. |
| "the packets are put back in order to become the picture you're watching" | 🟡 optional | 67, 68 | Skips the video decoder. Fuller: "…put back in order and decoded into the picture you're watching." |

Legally sensitive: none; no company or person is named.

---

## Fact-check of the written script, old street-sharing draft (2026-10-16) · Saved for a later video (journey / sharing)

Verdict: **PASS** (no ❌). Required hedges are marked REQUIRED; they are 🟡 items the script must hedge or reword before approval.

| Script line | Status | Entry | Note / fix |
| --- | --- | --- | --- |
| "Your fiber carries your neighbors' internet too." | 🟡 | 5 | True for a shared (PON) line: the downstream light reaching your box carries every home's frames (Cisco: "Downstream packets are forwarded as broadcasts"). Not true of point-to-point home fiber, and no source gives how common PON is. REQUIRED: name the case, e.g. "On a shared fiber line, your fiber carries your neighbors' internet too." |
| "an unpowered splitter divides one fiber into branches" | ✅ | 4 | Viavi "unpowered or passive". |
| "very often 32, one for each home" | ✅ | 3 | EIB: "up to 64 customers" … "very often to 32 customers". "One for each home" is the idealised case; fine. G.984.1 clause 12 not text-verified. |
| "The exchange sends every home the same data, and this box keeps only the frames labeled for it." | ✅ | 5, 6 | Cisco: broadcast; ONT "filters the received data based on the GEM port ID". Note: this is also the line of the 2026 hack (entry 8); not in the script, fine. |
| "The standard also lets the network encrypt each home's share." | ✅ | 7 | Cisco: "GPON utilizes the AES128 algorithm to encrypt data packets"; BBF model: per-GEM-port, downstream, default false. G.984.3 clause 12 "Security / Encryption system" confirmed by heading only. "Lets" is correctly worded (optional); do not change to "encrypts". |
| "Going up, the homes take turns" | ✅ | 9 | Cisco TDMA. |
| "every 125 millionths of a second the exchange tells each box exactly when to send" | 🟡 | 9, 10 | Frame length 125 µs and BWmap inside the downstream frame header (PCBd) are in Cisco; the OLT "sends updates in each frame" is Cisco's, but "every frame" is partly inference, and a given box need not get a grant in every frame. "Exactly" is fine for start/stop times, "each box" and "every" over-promise. Recommended: "every 125 millionths of a second the exchange sends the schedule for who sends when." (✅.) |
| "two colors of light your eyes can't see, in the same fiber" | ✅ | 2, 12 | GPON 1290–1330 nm up, 1480–1500 nm down (Cisco), outside the eye's 380–700 nm (NASA). Applies to basic GPON; XGS-PON is 1270/1577 nm (Viavi), also infrared. Optional GPON video-overlay wavelengths exist in other ITU texts and were not checked. |
| "many long links share by color alone" | 🟡 | 24 | "Many" has qualitative support only (Arelion: DWDM "especially suitable" for long distance; euNetworks live route, entry 17; Corning page not openable, 403). "Alone" is wrong in spirit: each color is itself time-shared and links also add fiber pairs (entry 18). REQUIRED: drop "alone", e.g. "Past the exchange, long links share by color." |
| "a passive piece of glass combining dozens of colors into one fiber" | 🟡 | 15 | Passive ✅ (Cisco ONS 15216 "suite of passive components", up to 96 channels). "Glass" not stated by Cisco; Lightwave describes AWGs as "silica-on-silicon PLC" (silica = glass); thin-film-filter muxes also use glass. A fair lay description, but unsourced word. Recommended for ✅: "a passive optical filter combining dozens of colors into one fiber". "Glass piece" is acceptable if the owner prefers the image. |
| "In 2026, researchers in London sent more than 1,200 colors through 39 kilometers of fiber already in the ground, carrying 450 terabits a second." | ✅ | 19 | NICT 2026-06-01: "up to 1,273 individual wavelength channels", 39 km "most of it running underground", UCL to Telehouse, London, 450 Tb/s, OFC 2026 post-deadline 2026-03-19. "More than 1,200" is a safe floor for "up to 1,273". The 39 km is a looped route (UCL to Telehouse and back), not 39 km point to point; "through 39 kilometers" is fine. Safest "in the ground": "installed". |
| "your street shares its fiber by taking turns, and many links beyond it share by color" | 🟡 | 9, 24 | Same hedge as above. "Taking turns" fits upstream and, loosely, downstream (time-sliced broadcast); the colors on the street are used to separate up from down, not homes. Consider "many long links" to match the earlier line. |
| "the same light has just reached every house on your splitter, and your box kept only yours" | ✅ | 5, 6 | Broadcast to all ONTs on the splitter; each ONT keeps its own GEM ports. Assumes a PON (the script has set that up) and says "kept" for the box's normal behavior; a modified box can keep more (entry 8, not in script). |

Rulings on the scriptwriter's three flags: (1) "piece of glass" is a fair lay image for an AWG or filter mux but unsourced; use "passive optical filter" for ✅ (entry 15). (2) "many" is supportable only qualitatively (entry 24); drop "alone". (3) The 125 µs claim is right for the downstream frame and its BWmap but reword as above.

Legally sensitive: none of the script names a company or person. Entry 8 (researchers' hack) is not in the script. Named bodies appear only here and in the post description (NICT, UCL, Cisco, Viavi, EIB).

---

## 1. A fiber is a glass thread about as thin as a hair

- **Script (likely):** "…a single thread of glass about as thin as a hair."
- **Status:** ✅ verified (as "about as thin as a hair").
- **Source:** [Fibre optic](https://bipt.be/consumers/fibre-optic), BIPT (Belgian Institute for Postal Services and Telecommunications, the telecom regulator), undated page (accessed 2026-10-16)
- **Quote:** "An optical fibre is a very thin glass filament (125 micrometre, about as thin as human hair) with a plastic jacket."
- **Note:** 125 µm is the glass cladding; the light travels in a core of about 9 µm inside it (vendor "9/125" labels; not separately sourced here, so don't say "9 microns"). Say "about as thin as a hair", not "thinner than a hair": hair widths vary and the regulator says "about".

## 2. The light in the fiber is infrared, invisible to the eye

- **Script (likely):** "The colors are real, but they're infrared, so you'd never see them." Also matters for the visuals (see open question on colour).
- **Status:** ✅ verified for both numbers; the comparison is a simple inference from them (the fact-checker should confirm it is acceptable as worded).
- **Source:** [Visible Light](https://science.nasa.gov/ems/09_visiblelight/), NASA Science, last updated 2023-08-04 (accessed 2026-10-16)
- **Quote:** "Typically, the human eye can detect wavelengths from 380 to 700 nanometers."
- **Source:** [Infrared Waves](https://science.nasa.gov/ems/07_infraredwaves/), NASA Science, last updated 2023-08-03 (accessed 2026-10-16)
- **Quote:** "the human eye cannot see it, but humans can detect it as heat."
- **Source (wavelengths actually used):** GPON 1480–1500 nm and 1290–1330 nm (Cisco, entry 12); the 2026 record used 1,264.0 nm to 1,617.8 nm (NICT, entry 19).
- **Note:** Every wavelength used in fiber networks is roughly twice the longest wavelength the eye can see. "Colors of light" is the usual lay term for wavelengths, and fine to say, but the on-screen colours are a visualisation, not what the light looks like.

## 3. One fiber from the exchange is split to many homes: up to 64, very often 32

- **Script (likely):** "Somewhere under your street, the one fiber from the exchange is split, often 32 ways, sometimes 64, one branch per home."
- **Status:** ✅ verified for "up to 64" and "often 32". 🟡 for any specific street or provider (split ratios vary by operator; "your street" must stay hedged with "often" or "up to"). ❌ for "128 homes" as a typical figure (only the standard's upper limit for newer systems).
- **Source:** [How does a Gigabit Passive Optical Network (GPON) work?](https://www.eib.org/en/stories/what-is-gpon), European Investment Bank, 2020-04-29 (accessed 2026-10-16)
- **Quote:** "distributed to up to 64 customers" … "very often to 32 customers"
- **Source:** [Understand GPON Technology](https://www.cisco.com/c/en/us/support/docs/switches/catalyst-pon-series/216230-understand-gpon-technology.html), Cisco, Document ID 216230, rev. 3.0 updated 2023-12-06 (first released 2021-08-20) (accessed 2026-10-16)
- **Quote:** "Usually 1:32 ratio." / "Split ratio: Restricted by path loss, PON with passive splitters (16,32, or 64 way split)"
- **Source (older industry data):** [Ovum: Split Ratios for Passive Optical Networks Decline](https://bbcmag.com/ovum-split-ratios-for-passive-optical-networks-decline/), Broadband Communities magazine, 2011-07-19 (accessed 2026-10-16)
- **Quote:** "Generally, these networks support "split ratios" of 1 to 32 or 1 to 64."
- **Source (upper limit, 10G systems):** [What is XGS-PON?](https://viavisolutions.com/en-us/xgs-pon), Viavi Solutions, page dated 2026-10-14 (accessed 2026-10-16)
- **Quote:** "the OLT downstream wavelength can be split to provide service to as many as 128 end devices (ONT)"
- **Note:** The official GPON standard is ITU-T G.984.1 (03/2008, in force with amendments to 04/2012); clause 12 is "Split ratio". It was not readable here (see access notes). The number of homes on a real splitter is an operator choice; UK forum posts say Openreach uses 1:32, but no Openreach document was found, so don't name an operator.

## 4. The splitter is passive: no power, just glass

- **Script (likely):** "The splitter has no power and no chip; it's a piece of glass that copies the light into every branch."
- **Status:** ✅ verified for "unpowered / passive". 🟡 for "no chip": a PLC splitter is itself a small glass chip (planar lightwave circuit), so "no electronics" is the accurate phrase. "Copies the light" is a lay simplification of "splits the light's power" (each branch gets a fraction of the power, the same signal); acceptable, but "divides the same light into every branch" is more exact.
- **Source:** Viavi, What is XGS-PON?, as in 3
- **Quote:** "the unpowered or passive state of the fiber and its splitting or combining components"
- **Source:** Cisco, Understand GPON Technology, as in 3
- **Quote:** "PON with passive splitters (16,32, or 64 way split)" / "The OLT is connected to the optical splitter through a single optical fiber"
- **Note:** Some street cabinets also hold powered equipment; the splitter itself is passive. Don't say "the cabinet has no power".

## 5. Downstream, every home on the splitter receives the same data, its neighbors' included

- **Script (likely):** "The light coming down that fiber carries everyone's internet, and every home on the splitter receives all of it."
- **Status:** ✅ verified.
- **Source:** Cisco, Understand GPON Technology, as in 3 (Downstream Packet Walk)
- **Quote:** "Downstream packets are forwarded as broadcasts, with the same data sent to all the same ONU/ONT"
- **Source:** Viavi, What is XGS-PON?, as in 3
- **Quote:** "The XGS-PON OLT broadcasts the same data to all ONT in the network"
- **Note:** OLT = the equipment at the exchange ("optical line terminal"); ONT/ONU = the box on the wall at home. Both GPON and the newer XGS-PON work this way. This is the hook fact.

## 6. Each home's box keeps only the frames labelled for it and drops the rest

- **Script (likely):** "The box on your wall reads a number on every frame, keeps the ones with its own number, and throws the rest away."
- **Status:** ✅ verified.
- **Source:** Cisco, Understand GPON Technology, as in 3 (Downstream Packet Walk, step 4)
- **Quote:** "ONT/ONU filters the received data based on the GEM port ID contained in the GEM PDU header"
- **Source (press, plain language):** [Hacking Fiber To The Home](https://hackaday.com/2026/08/13/hacking-fiber-to-the-home/), Zoe Skyforest, Hackaday, 2026-08-13 (accessed 2026-10-16)
- **Quote:** "Light (and thus, data) for many subscribers flows into the home"
- **Note:** The "number" is the GEM port ID (a label in each frame's header). "Trusted to throw it away" is fair framing: nothing in the fiber stops the box from keeping it; see 7 and 8.

## 7. The standard can encrypt each home's share, but it is a per-connection setting

- **Script (likely, fairness beat):** "In fairness, the standard lets the network encrypt each home's share, but it's a switch the operator sets, connection by connection."
- **Status:** ✅ verified for "GPON uses AES" and for "encryption is a per-connection setting that can be on or off". ❌ for a flat "your data is encrypted" (no source says every operator turns it on; the industry data model's default is off). ✅ for "in GPON, only the downstream can be encrypted".
- **Source:** Cisco, Understand GPON Technology, as in 3 (Line Encryption)
- **Quote:** "A risk is that unauthorized ONUs receive downstream data meant for authorized ONUs." / "To combat this, GPON utilizes the AES128 algorithm to encrypt data packets."
- **Source (industry standard data model):** [bbf-xpongemtcont YANG module, revision 2024-04-23](https://www.netconfcentral.org/modules/bbf-xpongemtcont/2024-04-23/source/raw/), Broadband Forum (TR-385), mirrored on netconfcentral.org (accessed 2026-10-16)
- **Quote:** leaf `downstream-aes-indicator`, `default "false"`: "Used to designate whether Advanced Encryption Standard (AES) should be enabled/disabled for this G-PON" … "Encapsulation Method (GEM) port for the downstream direction." / leaf `upstream-aes-indicator`: "This is not applicable for G-PON. Any configured value will be ignored."
- **Source (same body, management channel):** [bbf-xponani YANG module, revision 2024-04-23](https://netconfcentral.org/modules/bbf-xponani/2024-04-23/source/raw), Broadband Forum (accessed 2026-10-16)
- **Quote:** "For G-PON, this applies in the downstream direction." / "For XG-PON, XGS-PON, NG-PON2 and 50G-PON, this applies to both the upstream and downstream directions."
- **Source (XGS-PON cipher):** [A.5 justification for G.9807.1 referencing NIST SP 800-38A](https://www.itu.int/itu-t/workprog/wp_a5_out.aspx?isn=6109), ITU-T work programme, undated form (accessed 2026-10-16)
- **Quote:** "establishes the underlying block cipher, AES, operating in the Counter (CTR) mode."
- **Source (key size, academic):** [Pilot-Based Key Distribution and Encryption for Secure Coherent Passive Optical Networks](https://arxiv.org/html/2311.02554v3), Wang et al., arXiv v3, 2023-12-25 (accessed 2026-10-16)
- **Quote:** "the AES-128 and AES-256 have been employed by the XGS-PON and 50G-PON" / "illegal ONUs can eavesdrop on the broadcast DS signal of other ONUs."
- **Note:** A data model's default is not proof of what operators do; it shows encryption is a setting, off unless configured. Most web traffic is also encrypted end to end (HTTPS) regardless of the fiber layer; Hackaday says so too ("A great deal of traffic is encrypted these days, which provides a layer of safety."). A fair script says both. Safe wording: "the standard lets the network scramble each home's share".

## 8. In 2026, researchers modified their own fiber box to keep every frame, and saw data meant for neighbors

- **Script (likely, optional):** "This summer, two security researchers reprogrammed their own fiber box to keep every frame instead of dropping them, and on their network they could see data meant for the homes around them."
- **Status:** 🟡 plausible, attributed to press reporting. The Hackaday article (opened) supports it. The primary sources (DEF CON 34 abstract; Black Hat USA 2026 slides "gpwn: Wiretapping Fiber") could not be opened (see access notes). A search excerpt of the DEF CON abstract mentions "Hardware that costs about $100" and a neighbor's "DNS, SIP calls" traffic; **not verified, do not use** until opened. Two different author names appear (Jayasimha and Vibhu at DEF CON per Hackaday; "Iyengar" in the Black Hat PDF filename), so name nobody.
- **Source:** Hackaday, Hacking Fiber To The Home, as in 6
- **Quote:** "were able to hack an ONU to forward every single frame it receives" … "downstream data intended for other homes in their immediate neighborhood."
- **Leads, not opened:** DEF CON 34 talk "gpwn: Wiretapping fiber (GPON) ISP deployments from the comfort of your home" (defcon.org, August 2026); Black Hat USA 2026 slides at `i.blackhat.com/BH-USA-26/Presentations/US-26-Iyengar-gpwn-Wiretapping_Fiber-Aug-05_v2-email.pdf` (over 10 MB); gpwn.io; github.com/gpwn-org/gpwn-toolkit (opened: "Authorized security research only.").
- **Note:** Legally and tonally sensitive (see Legal flags). The finding depends on the operator leaving downstream encryption off for those connections (a researcher's Hackaday comment says encryption "must be enabled on a port by port basis"; comment, not article). If used, pair it with 7's fairness line and say "on their network", never "your neighbors can read your data". Brand: no how-to detail.

## 9. Upstream, homes take turns: the exchange gives each box its time slot

- **Script (likely):** "Going up, they can't all talk at once, so the exchange tells each box exactly when it may send."
- **Status:** ✅ verified.
- **Source:** Cisco, Understand GPON Technology, as in 3 (Upstream Packet Walk)
- **Quote:** "Upstream packet transmission occurs through TDMA (time division multiple access)" / "ONT/ONU sends traffic upstream based on granted time slot." / "BWmap - Field notifies very ONU of upstream bandwidth allocation." / "Specifies the start and end upstream time slots for the T-CONTs of each ONU."
- **Source:** Viavi, What is XGS-PON?, as in 3
- **Quote:** "a Time Division Multiplexing (TDM) approach has to be adopted for upstream wavelength transmission"
- **Note:** "very" in the Cisco quote is Cisco's typo for "every"; quote as is. Slots change with demand ("DBA enables an OLT module to monitor for congestion on the PON network in real-time.", same page).

## 10. The schedule is refreshed every 125 microseconds (8,000 times a second)

- **Script (likely):** "The exchange sends that schedule every 125 millionths of a second, 8,000 times a second."
- **Status:** 🟡 (fact-check 2026-10-16; wording for ✅: "every 125 millionths of a second the exchange sends the schedule for who sends when"). Cisco supports 125 µs frames with the BWmap inside the downstream frame header; "every frame" and "tells each box" are partly inference (a box need not receive a grant in every frame). G.984.3 clause 8.1 exists but its text was unreadable. 🟡 for "8,000 times a second": arithmetic (1 s / 125 µs = 8,000), not a quoted figure. A search excerpt also names an "8-KHz Superframe Counter" (not opened). Fact-checker: accept the arithmetic or keep "every 125 millionths of a second".
- **Source:** Cisco, Understand GPON Technology, as in 3
- **Quote:** "A downstream GPON frame has a fixed length of 125 μs" / "Each upstream GPON frame has a fixed length of 125 μs."
- **Note:** The BWmap sits in the downstream frame's header (Cisco: "BWmap - Field notifies very ONU of upstream bandwidth allocation."), so "every frame carries the schedule" is fair for GPON.

## 11. The exchange measures how far away each home is, so the turns don't collide

- **Script (likely):** "It even measures how far away each home is and delays the nearer ones, so every burst arrives in line."
- **Status:** ✅ verified.
- **Source:** Cisco, Understand GPON Technology, as in 3 (Ranging)
- **Quote:** "In order to prevent data conflict (collisions), the OLT must be able to precisely measure the distance" … "between itself and each ONU to provide a proper time slot to facilitate data upstream." / "this OLT requires a proper equalization delay (EqD) for each ONU based on physical reach"
- **Note:** "Delays the nearer ones" is the lay reading of "equalization delay … based on physical reach". Reach: "Maximum fiber distance between send/receive (S/R) and receive/send (R/S) points: 20 km" (same page).

## 12. Down and up travel on different colors (wavelengths) in the same fiber

- **Script (likely):** "Down and up don't even use the same color of light."
- **Status:** ✅ verified.
- **Source:** Cisco, Understand GPON Technology, as in 3
- **Quote:** "Wavelengths range from 1290 - 1330 nm in the upstream direction and from 1480 - 1500 nm in the downstream direction." / "GPON adopts WDM to transmit data of different upstream/downstream wavelengths over the same ODN."
- **Source (XGS-PON):** Viavi, What is XGS-PON?, as in 3
- **Quote:** "XGS-PON operates at a downstream wavelength of 1577 nm and the upstream wavelength of 1270 nm."
- **Note:** The common shorthand is 1490 nm down / 1310 nm up for GPON (Wikipedia, citing ITU-T G.984.2); Cisco gives ranges. On screen, show "a different colour", not nanometre numbers.

## 13. A faster system can be added on the same fiber, on two more colors

- **Script (likely):** "And when the operator upgrades to 10 gigabits, it can light the same fiber with two more colors, without digging up the street."
- **Status:** ✅ verified for "can co-exist on the same fiber, without changes to the passive parts". 🟡 for "without digging up the street" (the sources say the fiber plant/ODN is reused; "digging" is our paraphrase; fine as imagery, but "without new fiber" is closer).
- **Source:** Viavi, What is XGS-PON?, as in 3
- **Quote:** "XGS-PON can co-exist on the same fiber plant as G-PON without changes to the passive architecture"
- **Source:** [10G PON](https://www.calix.com/technologies/10g-pon.html), Calix, undated page (accessed 2026-10-16)
- **Quote:** "XGS-PON, NG-PON2, and GPON can co-exist on the same fiber, allowing you to introduce 10G-PON into your existing network"
- **Note:** Vendor pages (Viavi is a test-equipment maker, Calix an equipment vendor). The ITU G.9807.1 (02/2023) summary also refers to systems "coexisting on the same optical distribution network (ODN)" (entry 14). This is the bridge from the street (time sharing) to the backbone (colour sharing).

## 14. How much the street shares: GPON 2.5 Gbit/s down, XGS-PON 10 Gbit/s both ways

- **Script (likely):** "That whole street shares about 2.5 gigabits a second on the older system, or 10 on the newer one."
- **Status:** ✅ verified for the line rates. 🟡 for any per-home figure: dividing by 32 (≈ 78 Mbit/s each if all homes pulled at once) is our own calculation and ignores that homes rarely all download at once; don't put it on screen as a fact.
- **Source:** Cisco, Understand GPON Technology, as in 3
- **Quote:** "Rate: 1.24416 Gigabits/s up, 2.48832 Gigabits/s down"
- **Source:** [G.9807.1 (02/2023) summary](https://www.itu.int/dms_pubrec/itu-t/rec/g/T-REC-G.9807.1-202302-I!!SUM-HTM-E.htm), ITU-T, 2023-02 (accessed 2026-10-16)
- **Quote:** "Recommendation ITU-T G.9807.1 describes a 10-Gigabit-capable symmetric passive optical network (XGS-PON) system" … "at the nominal data rate of 10 Gbit/s" … "both in the downstream and the upstream directions." / "to reduce the impact on other systems coexisting on the same optical distribution network (ODN)."
- **Source:** [G.984.1 (03/2008) summary](https://www.itu.int/dms_pubrec/itu-t/rec/g/T-REC-G.984.1-200803-I!!SUM-HTM-E.htm), ITU-T, 2008-03 (accessed 2026-10-16)
- **Quote:** "describes a flexible optical fibre access network capable of supporting the bandwidth requirements"
- **Note:** The G.984.1 summary was only partly quotable in the tool; per the tool's paraphrase it gives 2.4 Gbit/s down and 1.2 or 2.4 Gbit/s up. Use Cisco's figures.

## 15. Past the exchange, fibers share by color: dozens of channels, combined and split by passive optics

- **Script (likely):** "Past the exchange, the big fibers share a different way: each signal gets its own color, and a passive piece of glass combines up to 96 of them into one fiber and splits them apart at the other end."
- **Status:** 🟡 (fact-check 2026-10-16). ✅ for "passive mux/demux, up to 96 channels in the C-band, no power" (one vendor's product) and the ITU grid. 🟡 for "piece of glass": the Cisco page does not say what the parts are made of; AWGs are "silica-on-silicon PLC" (Lightwave, https://www.lightwaveonline.com/home/article/16668415/array-waveguide-gratings, opened), so it is a fair lay image but unsourced. Wording for ✅: "a passive optical filter". 🟡 for "the big fibers" / "many links": see entry 24.
- **Source:** [Cisco ONS 15216 DWDM System](https://www.cisco.com/c/en/us/products/optical-networking/ons-15216-dwdm-system/index.html), Cisco, undated product page (accessed 2026-10-16)
- **Quote:** "The Cisco ONS 15216 DWDM System is a suite of passive components" / "Support for up to 96 channels in the C-band" / "Passive operation, eliminating power requirements and optimizing reliability"
- **Source (standard grid):** [G.694.1 (10/2020) summary](https://www.itu.int/dms_pubrec/itu-t/rec/g/T-REC-G.694.1-202010-I!!SUM-HTM-E.htm), ITU-T, 2020-10 (accessed 2026-10-16)
- **Quote:** "provides a frequency grid for dense wavelength division multiplexing (DWDM) applications." / "supports a variety of channel spacings ranging from 12.5 GHz to 100 GHz" … "and wider."
- **Note:** Don't name Cisco in the voice (citation, not the story's product). "96" is one product's maximum, not an industry figure; "dozens" or "around a hundred" is safer spoken. DWDM = dense wavelength-division multiplexing.

## 16. Today's commercial systems use about 10 THz of the fiber's spectrum

- **Script (likely):** none directly; supports the "labs use four times more" line in 19.
- **Status:** ✅ verified, attributed to NICT.
- **Source:** [A new world record for optical data transmission: 450 Tb/s over a metropolitan network](https://www.nict.go.jp/en/press/2026/06/01-1.html), NICT (Japan's National Institute of Information and Communications Technology), 2026-06-01 (accessed 2026-10-16)
- **Quote:** "Conventional commercial systems use up to about 10 THz of bandwidth, covering the C- and L-bands." / "The new system uses the O-, E-, S-, C- and L-bands together, more than quadrupling the available bandwidth"

## 17. One color can carry 1.6 terabits a second in live commercial networks (2024)

- **Script (likely):** "Each of those colors can now carry 1.6 terabits a second on its own."
- **Status:** ✅ verified for "1.6 Tb/s on one wavelength, carrying commercial traffic, Europe, November 2024". 🟡 for "now" as an industry norm: it is the newest generation, not what every link uses.
- **Source:** [euNetworks First to Deploy 1.6 Tb/s Coherent Solution in Europe with Ciena's WaveLogic 6 Extreme](https://www.silicon.co.uk/press-release/eunetworks-first-to-deploy-1-6-tb-s-coherent-solution-in-europe-with-cienas-wavelogic-6-extreme), press release (euNetworks / Ciena) reposted by Silicon UK, 2024-11-11 (accessed 2026-10-16). Original on Business Wire (403 in the tool).
- **Quote:** "Our successful deployment of the first 1.6 Tb/s wavelength in Europe using Ciena's WaveLogic 6 Extreme" / "was carried out on euNetworks' production network, sending commercial traffic over the company's 281km route from Amsterdam to Düsseldorf."
- **Note:** Company press release, self-described "first in Europe". Don't name the companies in the voice. Arelion ran a 1.6 Tb/s live-network field trial in the US in August 2024 (Business Wire, not opened; lead only).

## 18. Scale-up: one subsea cable, 12 fiber pairs, 250 terabits a second (2021)

- **Script (likely, optional):** "Under the Atlantic, one cable with 12 pairs of these fibers was built to carry 250 terabits a second."
- **Status:** ✅ verified, as the owner's claim (design capacity, 2021).
- **Source:** [Google's Dunant subsea cable is now ready for service](https://cloud.google.com/blog/products/infrastructure/googles-dunant-subsea-cable-is-now-ready-for-service/), Chris Ciauri, Google Cloud blog, 2021-02-03 (accessed 2026-10-16)
- **Quote:** "Dunant is the first long-haul subsea cable to feature a 12 fiber pair space-division multiplexing (SDM) design, and will deliver record-breaking capacity of 250 terabits per second (Tbps) across the ocean—enough to transmit the entire digitized Library of Congress three times every second."
- **Quote:** "(twelve, rather than six or eight in past generations of subsea cables)"
- **Note:** "Record-breaking" was true in 2021; newer cables have more pairs. Don't call it the biggest today. The Library of Congress comparison is Google's own and Google-specific; if used, it names Google as a citation, which brand.md forbids unless the beat is about Dunant itself. Recommend not using the subsea beat in a Short (see angles).

## 19. The 2026 record: 450 terabits a second, 1,273 colors, through fiber already under London

- **Script (likely):** "This year, researchers sent 1,273 colors at once through 39 kilometers of ordinary fiber already in the ground in London, 450 terabits a second."
- **Status:** ✅ verified (re-opened by the fact-checker) for 450 Tb/s, "up to 1,273" channels (script's "more than 1,200" is a safe floor), 39 km, field-deployed legacy fiber, London, OFC 2026 post-deadline 2026-03-19 (press release 2026-06-01). 🟡 for "ordinary": the release compares to single-mode records but does not say outright that this link is single-mode; "fiber already in the ground" is safest, with the release's own limit "most of it running underground" (the 39 km is a looped route UCL to Telehouse and back).
- **Source:** NICT press release, as in 16
- **Quote:** "has demonstrated a record-breaking 450 terabits per second (Tb/s) optical transmission" / "the first time such a rate has been achieved over a field-deployed legacy fiber." / "The wideband WDM signal contained up to 1,273 individual wavelength channels across the O-, E-, S-, C- and L-bands," / "The signal was sent over 39 km of fiber, most of it running underground,"
- **Note:** Route: UCL campus to the Telehouse data centre in London Docklands, looped back. Partners: NICT with UCL, Aston University, Lightera Laboratories, Nokia Bell Labs and the University of Bristol. Presented at the OFC 2026 post-deadline session, 2026-03-19. A record in a research experiment, not a service anyone can buy. This is the best The Lab beat: "researchers found" with a counter.

## 20. Earlier records (for accuracy, not for the script)

- **Status:** ✅ verified (402 Tb/s, 2024; 430 Tb/s, 2025). Lead only (1.02 Pb/s, 2025).
- **Source:** [World Record 402 Tb/s Transmission in a Standard Commercially Available Optical Fiber](https://www.nict.go.jp/en/press/2024/06/26-1.html), NICT, 2024-06-26 (accessed 2026-10-16)
- **Quote:** "a new data-rate record of 402 terabits per second in a standard commercially available optical fiber." / "up to 1,505 channels"
- **Source:** [Novel Transmission Technique Enables World Record 430 Tb/s](https://www.nict.go.jp/en/press/2025/11/11-1.html), NICT, 2025-11-11 (accessed 2026-10-16)
- **Quote:** "single-mode transmission in the E/S/C/L bands with three-mode transmission in the O band."
- **Note:** The 402 Tb/s run used more channels (1,505) over 50 km of lab fiber; 2026 has fewer channels but more total and runs in the ground. The 430 Tb/s run mixes modes. A 2025 NICT/Sumitomo result of 1.02 petabits per second used a special 19-core fiber (ISPreview and FBA reports, not opened): a different kind of fiber, so don't say "one fiber has carried a petabit" without saying "special multi-core fiber". These are why the script should say "this year's record over fiber already in the ground" rather than "the fastest fiber ever".

## 21. Everyday unit for scale (optional, derived)

- **Script (likely, optional):** "That's enough for about 30 million 4K streams at once."
- **Status:** 🟡 derived. Input ✅: a streaming service recommends 15 Mbit/s for 4K. The division (450 Tb/s ÷ 15 Mbit/s = 30 million) is our own calculation, which brand practice treats with caution (see phone-listening entry 4, option B). If used: say "about", keep the input in the post description, and let the fact-checker rule. Recommend skipping it: the "1,273 colors" image carries the scale without arithmetic.
- **Source:** [Internet connection speed recommendations](https://help.netflix.com/en/node/306), Netflix Help Center, undated (accessed 2026-10-16)
- **Quote:** "15 Mbps or higher" (Ultra HD / 4K)
- **Note:** Naming Netflix in the voice would be a citation; don't. "A 4K stream" is enough.

## 22. Subsea cables carry almost all intercontinental traffic (myth-check only)

- **Script (likely):** none recommended.
- **Status:** 🟡 plausible, attribute only. TeleGeography confirms the popular "over 99%" line but says it rests on 2013 US data.
- **Source:** [Do Submarine Cables Account For Over 99% of Intercontinental Data Traffic?](https://resources.telegeography.com/2023-mythbusting-part-3), Alan Mauldin, TeleGeography, 2023-05-04 (accessed 2026-10-16)
- **Quote:** "We can confirm that this is true. However, we can't do precise calculations without data for intercontinental satellite traffic." / "We're only talking about U.S. international capacity here—not the total global capacity—and in relation to satellites." / "The most recent data is for 2013, released in 2015."

## 23. Illustrative specifics (🎭)

- **Script (likely):** the evening moment ("9:12 PM, you press play"), the street of houses, the exact count of houses drawn on screen, the label numbers shown on frames, the box on the wall dropping specific frames.
- **Status:** 🎭 illustrative. Disclose in the post: "Illustrative: the street, the homes and the labels on the data are an example; real split ratios vary by provider."
- **Note:** If the street shows 32 houses, that is the common case (entry 3), not a claim about the viewer's street. Use "often" in the voice.

## 24. Long links commonly share a fiber by color (added by the fact-checker)

- **Script:** "Past the exchange, many long links share by color alone" / "many links beyond it share by color."
- **Status:** 🟡 plausible. Qualitative support only; no source quantifies "many". "Alone" is not supported (see note). Hedged wording that would be ✅: "Past the exchange, long links often share a fiber by color."
- **Source:** [What is DWDM?](https://arelion.com/knowledge-hub/what-is-guides/what-is-dwdm), Arelion (network operator), undated (accessed 2026-10-16)
- **Quote:** DWDM sends several signals at different wavelengths over one fiber and is "especially suitable and cost-effective for long distance transmission" (the page names terrestrial and subsea use; the tool returned this as a short quote, check wording when publishing).
- **Source:** euNetworks / Ciena press release, entry 17: a 1.6 Tb/s wavelength on a live 281 km production route.
- **Note:** A Corning page ("long-haul terrestrial networks have largely migrated to … DWDM") came up in search but returned 403, so it is not used. "Alone" is wrong in spirit: each wavelength is itself shared in time by many signals, and subsea cables also add fiber pairs (entry 18, 12 pairs). The mux is passive but real long links also use powered amplifiers; the script only claims the combiner is passive.

---

## Journey angle: New York to London (researcher addendum, 2026-10-16) · Saved for a later video (journey / sharing)

Owner brief (via the coordinator): "I'm in New York, sending a message to my friend in London. How does everything go through the same pipeline, since there's no fiber dedicated from my home to my friend's house in London?" Entries 25 to 40 trace that trip hop by hop. Entries 1 to 24 stay valid and are reused as parts of the journey (the street: 3–14; colors: 2, 15–17, 24; the record: 19). Statuses are the researcher's starting confidence. All sources accessed 2026-10-16.

Two accuracy traps for the scriptwriter (details in entries 27 and 39):

- **A short text fits in one packet.** A standard packet carries up to 1,500 bytes (entry 27). "Your message is cut into packets" is honest for a photo, a voice note or a video, not for "hi". Recommend the story sends a **photo** (or a voice note).
- **Messages travel via the app's servers.** A chat message goes from your phone to the messaging service's servers and from there to your friend; it does not travel straight from your home to hers, and the servers need not be in London. No source was gathered on any specific app's server locations (and naming one would make the story about its product). Safe framing: "your photo heads for London" without claiming a direct house-to-house path, or say once "through the app's servers".

## 25. The real light is infrared, so the colors on screen are added (source row for the voice clause)

- **Script (likely):** "The real light is infrared, so we've given each channel a color." (style-guide v0.11 § 1, preferred disclosure)
- **Status:** ✅ verified. Both halves are sourced: network wavelengths are 1,264 to 1,618 nm (NICT 2026) and 1,290 to 1,500 nm for GPON (Cisco); the eye detects 380 to 700 nm (NASA), and NASA says the eye cannot see infrared. "We've given each channel a color" describes our own visual, which needs no source.
- **Source:** [Visible Light](https://science.nasa.gov/ems/09_visiblelight/), NASA Science, last updated 2023-08-04 (accessed 2026-10-16)
- **Quote:** "Typically, the human eye can detect wavelengths from 380 to 700 nanometers."
- **Source:** [Infrared Waves](https://science.nasa.gov/ems/07_infraredwaves/), NASA Science, last updated 2023-08-03 (accessed 2026-10-16)
- **Quote:** "the human eye cannot see it, but humans can detect it as heat."
- **Source:** [A new world record for optical data transmission: 450 Tb/s over a metropolitan network](https://www.nict.go.jp/en/press/2026/06/01-1.html), NICT, 2026-06-01 (accessed 2026-10-16)
- **Quote:** "spanning 42.4 THz of bandwidth (1,264.0 nm to 1,617.8 nm)" (tool-returned excerpt; also in entry 19)
- **Source:** Cisco, Understand GPON Technology, as in 3
- **Quote:** "Wavelengths range from 1290 - 1330 nm in the upstream direction and from 1480 - 1500 nm in the downstream direction."
- **Note:** "Infrared" is the right word: every wavelength above sits beyond 700 nm. Don't say "heat": telecom light is near-infrared and isn't felt as heat. Same facts as entry 2, restated as a dedicated row because the voice now says it.

## 26. Hop 2: one box at the exchange gathers many streets onto one shared uplink

- **Script (likely):** "At the exchange, one box gathers dozens of streets like yours and sends all of it up one shared link."
- **Status:** ✅ for "one exchange box has 48 PON ports and a 400 Gb/s uplink" (one product, 2023). 🟡 for any home count: 48 ports × 32 homes ≈ 1,500 homes is our calculation (it assumes 1:32 splits on every port). ❌ for a sourced "customers per uplink" ratio or an operator's oversubscription figure: none found. Keep it qualitative ("dozens of streets", "one shared link").
- **Source:** [Adtran offers SDX 6330 disaggregated 10G Combo PON OLT](https://www.lightwaveonline.com/fttx/pon-systems/article/14288818/adtran-offers-sdx-6330-disaggregated-10g-combo-pon-olt), Stephen Hardy, Lightwave, 2023-01-26 (accessed 2026-10-16)
- **Quote:** "The SDX 6330 provides 48 Combo PON ports as well as 25/100/400 Gigabit Ethernet networking ports." / "The 400G uplink port capabilities are an industry first, Adtran asserts."
- **Source (one fiber from the OLT to each splitter):** Cisco, Understand GPON Technology, as in 3
- **Quote:** "The OLT is connected to the optical splitter through a single optical fiber"
- **Note:** Vendor equipment, not a description of any operator's network. Other vendor pages claim "20,000+ ONTs" per chassis (FS.com, not opened: empty page). Don't name the vendor in the voice. "Dozens of streets" follows from 48 PON ports per box with one street splitter per port; that is an inference, so "many streets" is the safest wording.

## 27. Hop 3: the message is cut into packets of up to 1,500 bytes, each with addresses

- **Script (likely):** "Your photo leaves as hundreds of small packets, each up to 1,500 bytes, and each one carries your address and your friend's."
- **Status:** ✅ for "IP packets carry a source and a destination address" (RFC 791) and "the maximum IP packet on Ethernet is 1,500 octets (bytes)" (RFC 894). ✅ for "large data is broken into pieces that are later reassembled" (RFC 791). 🟡 for "hundreds": a 1 MB photo ÷ 1,500 bytes ≈ 700 packets is our calculation (it ignores headers and compression); "hundreds" is safe for a typical phone photo, but no source states a photo size. "Your friend's address" is literally the destination server's address (see trap 2 above); "where it's going" is the safest phrase.
- **Source:** [RFC 791: Internet Protocol](https://www.rfc-editor.org/rfc/rfc791), J. Postel, IETF, September 1981 (accessed 2026-10-16)
- **Quote:** "transmitting blocks of data called datagrams from sources to destinations" … "sources and destinations are hosts identified by fixed length addresses" / "to break a datagram into an almost arbitrary number of pieces that can be later reassembled"
- **Source:** [RFC 894: A Standard for the Transmission of IP Datagrams over Ethernet Networks](https://www.rfc-editor.org/rfc/rfc894), C. Hornig, IETF, April 1984 (accessed 2026-10-16)
- **Quote:** "thus the maximum length of an IP datagram sent over an Ethernet is 1500 octets."
- **Note:** The RFC's preceding clause says "minimum length of the data field … is 1500 octets", a well-known wording slip in RFC 894; quote only the "maximum length" clause. 1,500 bytes is the standard Ethernet MTU; some links use larger "jumbo" frames internally, and the home-side path often carries a little less. "Up to 1,500 bytes" is accurate. A "packet" in lay terms = an IP datagram; the RFC calls the cutting step "fragmentation", but in practice apps and TCP choose packet sizes up front (TCP segmentation is not sourced here; "cut into packets" is fine as a lay description).

## 28. No circuit is reserved: each packet is handled on its own (vs the old phone network)

- **Script (likely):** "The old phone network set up a line for your call; the internet reserves nothing, and every router simply passes each packet along, one at a time, onto links everyone shares."
- **Status:** ✅ for the internet half (RFC 791: "no connections or logical circuits"; each datagram handled independently). 🟡 for the phone half: the Computer History Museum describes 1965 data over a "dedicated telephone line" and calls telephone lines "inefficient, wasteful of bandwidth" for data, and the Internet Society history (Leiner et al., not openable: 403 and archive blocked) says Kleinrock argued for "packets rather than circuits". No opened source states plainly that a phone call held a dedicated circuit for its whole length; that is textbook knowledge (Wikipedia "Circuit switching": "for the duration of a telephone call", lead only). A fact-checker with access should open the ISOC page.
- **Source:** RFC 791, as in 27, § 1.4
- **Quote:** "There are no connections or logical circuits (virtual or otherwise)." / "The internet protocol treats each internet datagram as an independent entity unrelated to any other internet datagram."
- **Source:** [Internet History of 1960s](https://www.computerhistory.org/internethistory/1960s/), Computer History Museum, undated (accessed 2026-10-16)
- **Quote:** "They connect the TX-2 at MIT to the Q-32 in Santa Monica via a dedicated telephone line with acoustic couplers." / "…telephone lines work for data, but are inefficient, wasteful of bandwidth, and expensive." / "As Kleinrock predicts, packet switching offers the most promising model for communication between computers."
- **Lead (not opened):** [Brief History of the Internet](https://www.internetsociety.org/internet/history-internet/brief-history-internet/), Leiner, Cerf, Clark, Kahn, Kleinrock et al., Internet Society (1997, also arXiv cs/9901011, 1999): search excerpts show "communications using packets rather than circuits" and "the circuit switched telephone system was totally inadequate for the job". Not quoted as verified.
- **Note:** RFC 791 is the 1981 IPv4 standard; IPv6 keeps the same connectionless model (not separately sourced). This entry is the heart of the owner's question ("no fiber dedicated from my home to my friend's house"). Safe ✅ wording: "Nothing along the way is reserved for your message; each packet is passed along on its own."

## 29. Router hops from New York to London

- **Script (likely):** "…passed from router to router, maybe a dozen or more times, before it reaches London."
- **Status:** ❌ unsupported for any New York–London hop count. No traceroute study of this route was found. A 2004 study of CAIDA skitter traces reported a mean route length of about 15.6 hops (search excerpt from the PDF, not opened as text; data year not stated in the abstract), and a RIPE dataset excerpt says most paths are at most 15 hops; both are general, old or unopened. Recommend no number in the voice; if the owner wants one, the honest route is 🎭 illustrative ("a traceroute we ran from New York showed N hops") or a fresh measurement someone runs and records.
- **Source (abstract only, opened):** [Describing and Simulating Internet Routes](https://arxiv.org/abs/cs/0411051), Leguay, Latapy, Friedman, Salamatian, arXiv, 2004-11-16 (accessed 2026-10-16)
- **Quote:** "over seven million route traces produced by CAIDA's skitter infrastructure"
- **Note:** The "15.57 hops" figure appears only in a search excerpt of the full text; not verified. Hop counts depend on the networks involved and on how many routers hide from traceroute.

## 30. Hop 4: long-haul links share by color, and each color carries many people's packets

- **Script (likely):** "On the long-haul fiber, your packets ride one color among dozens, mixed in with everyone else's."
- **Status:** ✅ for "dozens of colors per fiber" (entry 15: up to 96 C-band channels, one product) and "one color carries 1.6 Tb/s of commercial traffic" (entry 17). 🟡 for "mixed in with everyone else's": follows from 28 (packets from many sources share links) and 17 (one wavelength carrying a carrier's commercial traffic), but no source says in so many words that one wavelength carries many users' packets. The fact-checker's entry 24 ruling applies: don't say "by color alone".
- **Sources:** entries 15, 17, 24, 28.
- **Note:** For the visual: the viewer's packets travel in the orange channel; the other six palette colours are other channels (style-guide v0.11 § 1). Within the orange channel, other people's packets should also travel (grey or orange dots that aren't "yours"?): a director's question, flagged for the owner, because "your channel" is itself shared.

## 31. Hop 5: the Atlantic. One transatlantic cable: 16 fiber pairs, up to 400 Tb/s (2023)

- **Script (likely):** "One of the cables to England has 16 pairs of fibers and can carry up to 400 terabits a second."
- **Status:** ✅ verified, as the operator's own figures (design maximum, ready for service October 2023).
- **Source:** [Orange announces the launch of the AMITIE subsea cable offering a unique and robust transatlantic solution with ultra low latency](https://newsroom.orange.com/orange-announces-the-launch-of-the-amitie-subsea-cable-offering-a-unique-and-robust-transatlantic-solution-with-ultra-low-latency?lang=eng), Orange newsroom, 2023-10-18 (accessed 2026-10-16)
- **Quote:** "a total length of 6,800 km" / "16 fiber pairs" / "a maximum capacity of 400 Tbps" / "Lynn near Boston (USA), Le Porge near Bordeaux (France) and Bude (England)" / "world's busiest route"
- **Note:** It lands near Boston, not New York; "one of the cables between the US and England" is accurate. Place-like name only (AMITIE), per the brief; the operator and partners (Orange, Meta, Microsoft, Vodafone, Aqua Comms per Converge Digest) are not named in the voice. "Maximum capacity" is design capacity, not traffic carried. The press release's "world's busiest route" is the operator's phrase; attribute it or skip it.
- **Newer and planned:** a 24-fiber-pair transatlantic cable (New Jersey to Brean, UK, "more than 500 Tbps", target 2029) was announced in September 2026 per search results (DatacenterDynamics, TotalTele; **not opened**, lead only). Earlier generation: 12 pairs (entry 18, 2021). So "12 to 24 pairs" for modern and planned cables is supportable once the 24-pair announcement is opened; today ✅ only "16 pairs" (2023) and "12 pairs" (2021).

## 32. Each cable has several fiber pairs, shared by several companies; one fiber per direction

- **Script (likely):** "Inside, each pair of fibers sends one way on one strand and back on the other, and different companies share the same cable."
- **Status:** ✅ verified.
- **Source:** [Undersea Telecommunication Cables: Technology Overview and Issues for Congress](https://www.everycrsreport.com/files/2022-09-13_R47237_a284971dfaed5fa65bc26fe860ed7d5d2985d242.html), Jill C. Gallagher, Congressional Research Service, R47237, 2022-09-13 (accessed 2026-10-16), p. 8
- **Quote:** "Undersea cables can carry multiple fiber pairs, enabling numerous providers to use the same cable." / "Most cables transmit in one direction on one fiber in a pair and in the reverse direction on the other."
- **Note:** This is another sharing layer for the story: the cable is shared by owners (pairs), each pair by colors, each color by packets.

## 33. The deep-sea cable is about as wide as a garden hose

- **Script (likely):** "Across the ocean floor, the cable is about as wide as a garden hose."
- **Status:** ✅ verified (as "typically", "for most of its journey").
- **Source:** [Submarine Cable Frequently Asked Questions](https://www2.telegeography.com/submarine-cable-faqs-frequently-asked-questions), TeleGeography, page dated 2026 (accessed 2026-10-16)
- **Quote:** "For most of its journey across the ocean, a cable is typically as wide as a garden hose." / "Nearer to the shore cables are buried under the seabed for protection." … "in the deep sea they are laid directly on the ocean floor." / "These glass fibers are wrapped in layers of plastic (and sometimes steel wire) for protection."
- **Note:** Near shore the cable is thicker (armored) and buried. TeleGeography is a telecom research firm; citing it in the description is fine; in the voice no attribution is needed for a physical description.

## 34. Repeaters every 50 to 85 km boost the light, powered from the shore

- **Script (likely):** "Every 50 to 80 kilometers or so, a repeater on the seabed boosts the light, powered by electricity sent down the cable from the shore."
- **Status:** ✅ for "repeaters boost the signal" and "powered by a constant direct current from power feed equipment at the landing stations" (CRS). ✅ for "spans of 54 and 56 km in two deployed cables, 84 km average on one 2021 transatlantic cable, about 79 repeaters" (DTU paper, with a rendering caveat). 🟡 for a general "every 50 to 80 km": spacing varies by design; say "roughly every 50 to 85 kilometers" or "every few dozen kilometers".
- **Source:** CRS R47237, as in 32, pp. 5–8
- **Quote:** "power feed equipment (PFE) that provides a constant direct electrical current through the cable to power repeaters." / "Repeaters are powered by a constant direct current passed down a conductor near the center of the cable." / "repeaters boost the signal with optical amplifiers using semiconductor laser pumps"
- **Source:** [Spatial Distribution of Data Capacity for the Reduction of Number of Repeaters in Ultra Long-Haul Links](https://arxiv.org/html/2401.16997v2), Swain, Schou, Yankov, Galili, Oxenløwe (Technical University of Denmark), arXiv v2, 2024-08-30 (accessed 2026-10-16)
- **Quote:** "involve span lengths of 56 km and 54 km respectively." / "an average 84 km repeater spacing" (for the 12-pair cable of entry 18) / "Electrical power supplied from the ends of the submarine cable is a critical resource."
- **Note:** The arXiv HTML rendered some digits doubled ("8484"); the tool read them as 84, 79 and 44. The fact-checker should confirm in the PDF before "84 km" or "79 repeaters" are spoken. "Often 15 kV" feed voltages are also in this paper (same caveat). A transatlantic cable therefore carries roughly 80 or more repeaters; say "dozens of repeaters" unless confirmed.

## 35. The landing station: where the cable comes ashore and hands off to land networks

- **Script (likely):** "On the English coast, the cable comes ashore at a landing station and joins the land networks to London."
- **Status:** ✅ verified for what a landing station does. ✅ for "one cable lands at Bude, England" (entry 31). 🟡 for "joins the networks to London" (general; the route from any landing site to London isn't sourced).
- **Source:** CRS R47237, as in 32, p. 5
- **Quote:** "A cable landing station is an on-shore facility where undersea cables arrive and terminate." / "They receive signals from the undersea cable and transmit signals inland to terrestrial networks"
- **Note:** The CRS (2022) counted "486 commercial undersea telecommunication cable systems and 1,306 landing stations" worldwide (estimates as of April 2022, p. 1); TeleGeography's 2026 FAQ says "more than 600 active and planned submarine cables". Use the newer figure if a global count is wanted.

## 36. How much intercontinental traffic goes by subsea cable (better sources than entry 22)

- **Script (likely):** "Almost all of the data that crosses oceans travels through cables like this one."
- **Status:** 🟡 plausible, attribute or hedge. Three sources give 95 to 99% with different scopes and none measures it directly. Best wording: "almost all traffic between continents" (no number), or attributed: "a US congressional report puts it at about 95% of intercontinental internet traffic". ✅ for TeleGeography's narrower 2026 statement that satellites carry 0.37% of US international capacity (FCC data).
- **Source:** CRS R47237, as in 32, p. 1 (attributed there to industry experts)
- **Quote:** "carries about 95% of intercontinental global internet traffic" … "99% of transoceanic digital communications (e.g., voice, data, internet)"
- **Source:** [Dive into the Deep Sea: A View of the Subsea Cable Ecosystem](https://enisa.europa.eu/news/dive-into-the-deep-sea-a-view-of-the-subsea-cable-ecosystem), ENISA (EU Agency for Cybersecurity), 2023-08-31 (accessed 2026-10-16)
- **Quote:** "More than 97% of the world's internet traffic passes through subsea cables at some point."
- **Source:** TeleGeography FAQ, as in 33 (2026)
- **Quote:** "challenging to determine precisely how much of all international traffic is still carried via satellite." / "satellites account for just 0.37% of all U.S. international capacity"
- **Note:** ENISA's "world's internet traffic … at some point" is broader and looser than the CRS figure; avoid it in the voice. Entry 22 (TeleGeography 2023: the 99% line rests on 2013 US data) still stands.

## 37. Light in fiber travels at about two-thirds the speed of light in a vacuum

- **Script (likely):** "In glass, light slows to about two-thirds of its top speed, roughly 200,000 kilometers a second."
- **Status:** ✅ for "about two-thirds of c" (peer-reviewed, as "∼2/3c"). 🟡 for "200,000 km/s": arithmetic (2/3 × 299,792 ≈ 200,000); a search excerpt of the companion paper gives 204,000 km/s (not opened as text). Say "about 200,000 kilometers a second".
- **Source:** [cISP: A Speed-of-Light Internet Service Provider](https://ar5iv.labs.arxiv.org/html/1809.10897), Bhattacherjee, Abdu Jyothi, Bozkurt, Tirmazi, Aqeel, Aguirre, Chandrasekaran, Godfrey, Laughlin, Maggs, Singla, arXiv 1809.10897 (2018; published at USENIX NSDI 2022, not re-checked) (accessed 2026-10-16)
- **Quote:** "This gap stems from the speed of light in fiber being ∼2/3c"
- **Note:** Related: [Dissecting Latency in the Internet's Fiber Infrastructure](https://arxiv.org/abs/1811.10737), Bozkurt et al., arXiv 2018 (abstract opened: "multiply line-of-sight distance by 2.1, then divide by the speed of light in fiber"), i.e. real routes are much longer than straight lines.

## 38. New York to London round trip: about 60 to 70 milliseconds

- **Script (likely):** "Your packets reach London in about a thirtieth of a second, and the round trip takes about 70 milliseconds."
- **Status:** ✅ for "about 70 ms round trip, transatlantic, on one large carrier's backbone, monthly average to August 2026" (Verizon). ✅ for "under 59 ms round trip on the fastest dedicated route, 2015" (Equinix/Hibernia press release). 🟡 for "one way about 35 ms / a thirtieth of a second": half the round trip, arithmetic, and it's network transit only (the app's servers add time; trap 2). 🟡 for the single-site 2026 probe (63.8 ms average, one round of pings).
- **Source:** [IP Latency Statistics](https://www.verizon.com/business/terms/latency/), Verizon Business, undated page with monthly data to August 2026 (accessed 2026-10-16)
- **Quote:** Trans Atlantic row, August 2026: 70.347 ms (table value as read by the tool; check on publication) / "Data is collected from designated routers in key network hubs world-wide, in 5-minute intervals." / "90ms or less for transatlantic round trips between London and New York." (SLA)
- **Source:** [Equinix Connects Hibernia Express Sub-Sea Cable between New York and London](https://newsroom.equinix.com/2015-11-03-Equinix-Connects-Hibernia-Express-Sub-Sea-Cable-between-New-York-and-London), Equinix press release, 2015-11-03 (accessed 2026-10-16)
- **Quote:** "providing unprecedented round-trip latency transmission of sub-58.95ms."
- **Source (single probe round):** [New York, USA → London, UK RTT](https://hatsnet.io/docs/network/latency/pairs/nyc-lon-rtt), Hats Network, probe round 2026-10-16 (accessed 2026-10-16)
- **Quote:** "New York to London averaged 63.8 ms" (also gives a 54.69 ms theoretical fiber floor over a 5,585.2 km geodesic; "A probe round is not an SLA.")
- **Source (one cable, operator):** Orange AMITIE press release, as in 31
- **Quote:** "Their respective latencies of 38ms (Ashburn - Paris) for Dunant and 34ms (Bordeaux - New York) for AMITIE" (one-way or round trip not stated)
- **Note:** Don't name Verizon or Equinix in the voice (citations). Safe ✅ voice line: "a round trip between New York and London takes about 70 milliseconds" or "under a tenth of a second". End-to-end delivery of a chat message also includes the app's servers and the phone waking up; no source gives a figure, so don't claim "your friend sees it in 35 milliseconds".

## 39. Hop 7: the London side, the same in reverse down to your friend's shared fiber

- **Script (likely):** "In London, it all happens in reverse, down to a splitter on your friend's street, where her box keeps her packets and drops everyone else's."
- **Status:** ✅ for the mechanism (entries 3, 5, 6 are not country-specific: GPON is an ITU standard; EIB is European). 🟡 for "your friend's street has a PON": UK full-fiber builds commonly use GPON/XGS-PON, but only forum posts were found for UK operators (entry 3 note); hedge with "if she has fiber, it's likely a shared line too" or simply make the friend's home a fiber home (🎭 illustrative).
- **Sources:** entries 3, 5, 6, 12.
- **Note:** Trap 2 again: in reality the photo reaches the messaging service first and is then sent on to her phone; whether that hop is in London is unknown. The story's "the same in reverse" remains fair as the last mile.

## 40. "Nothing on the way is yours": the sharing at every layer (synthesis for the key line)

- **Script (likely):** "From your street to hers, not one strand of glass is reserved for you."
- **Status:** ✅ as a synthesis of sourced parts: street fiber shared by every home on the splitter (5); the internet reserves no circuits (28); subsea pairs shared by several providers (32). 🟡 for the absolute "not one strand": some businesses lease dedicated fibers or wavelengths (not researched); for a home user on a PON and the public internet the line holds. ❌ for "shared with millions of others at every hop": no source counts users per hop; "millions" would be our inference (400 Tb/s ÷ 15 Mbit/s ≈ 27 million 4K streams, entry 21 method). Use "everyone else's" instead of "millions".
- **Note:** Recommended last line and hooks are in the Journey section at the end.

---

## Myths and the strongest counter-evidence

| Myth | What the evidence says | Entry |
| --- | --- | --- |
| "Fiber is a private line straight to my house." | On a PON, one fiber from the exchange is split passively, very often 32 ways and up to 64 (EIB 2020; Cisco). Every home on it receives the same downstream data. | 3, 5 |
| "Fiber can't be tapped; GPON is 'virtually impossible to eavesdrop'." (BWNFiber, vendor blog, 2024-08-17: "Therefore, it is virtually impossible to eavesdrop, wiretap, and other hacking attacks.") | Downstream is a broadcast; separation rests on each box dropping others' frames and on AES, which is a per-connection setting (default off in the Broadband Forum data model). In 2026 researchers showed a modified box keeping neighbors' frames on their network (Hackaday). HTTPS still protects most content. | 5, 6, 7, 8 |
| "Encryption makes it all safe." | GPON can encrypt downstream only; upstream encryption is "not applicable for G-PON" (Broadband Forum). XGS-PON can encrypt both ways. | 7 |
| "Different colors of light" means visible colors. | Fiber networks use roughly 1,260 to 1,620 nm; the eye sees 380 to 700 nm (NASA). The "colors" are infrared. | 2 |
| "One fiber, one connection." | One backbone fiber carries dozens of wavelengths commercially (up to 96 in one product), each up to 1.6 Tb/s (2024); a 2026 lab record sent up to 1,273 at once. | 15, 17, 19 |
| "The record speed is what the internet runs at." | Commercial systems use about 10 THz of spectrum; the 2026 record used 42.4 THz, more than four times as much (NICT). Records are experiments. | 16, 19 |
| "99% of all internet traffic crosses the ocean in cables." | The figure is about intercontinental traffic, and TeleGeography says it rests on 2013 US data. Most traffic never leaves its region. | 22 |
| "The splitter in the street is a powered box." | The splitter is passive (Viavi); a cabinet may hold other powered gear. | 4 |

## Legal flags (named companies and people)

| Name | Where | Risk | Why |
| --- | --- | --- | --- |
| DEF CON / Black Hat researchers (Jayasimha, Vibhu; "Iyengar" in a slide filename) | 8 | **Medium-high** | Security findings about real ISP networks, primary sources not opened, two sets of names. Name nobody; say "security researchers", "on their network", 2026. No method detail. |
| Any ISP or operator (Openreach, CityFibre, etc.) | 3 | **High if named** | Split ratios and encryption settings for named operators came only from forums. Never name an operator or imply a specific operator leaves encryption off. |
| BWNFiber (vendor blog) | Myths | Medium | Quoting it as "wrong" names a company; keep it in this file only, don't cite it in the post. |
| Cisco, Viavi, Calix, Broadband Forum | 3–15 | Low | Technical documentation, quoted as such. Not named in the voice. |
| euNetworks, Ciena | 17 | Low | Their own press release. Not named in the voice. |
| Google (Dunant) | 18 | Low-medium | Own claim; naming it in the voice would be a citation unless the beat is about its cable. Recommend not using. |
| NICT, UCL, Aston, Lightera, Nokia Bell Labs, Bristol | 19, 20 | Low | Research institutes' own release. "Researchers in London" is enough in the voice. |
| Netflix | 21 | Low | Only as an input figure in the description, if 21 is used at all. |
| NASA, BIPT, EIB, ITU-T, TeleGeography | 1–3, 14, 15, 22 | Low | Public bodies and standards; quote accurately. |

---

## Suggested angles and hooks · Saved for a later video (journey / sharing)

Recommended: **angle C, the street, then the road** (PON for the hook, DWDM for the payoff). Working title: **No. 002 · The Street** (alternative: "The Splitter").

**A. The broadcast on your street** (pattern 5, "the wrong recipient"). The surprise: your fiber delivers your neighbors' internet to your box too, and your box is trusted to drop it. Facts: 3, 5, 6, 7 (fairness), 8 (optional). Strongest hook of the three, lived by anyone with fiber, easy to picture (one beam reaching every house). Weakness on its own: answers "how is it private?" more than the owner's "how many share one fiber?", and leans on security, which needs care.

**B. The colors under the road** (pattern 4, "the finding"). The surprise: one hair-thin fiber carried 1,273 separate colors at once in 2026, through fiber already under London. Facts: 1, 2, 15, 16, 17, 19. Most directly answers the owner's question and gives The Lab a beat. Weakness: no lived moment; the hook is a number, and "colors" clashes with the orange rule (open question 1).

**C. Combined: taking turns on your street, colors under the road** (recommended). Open on A's surprise (lived, concrete, lands in the first sentence), answer the owner's question with the two sharing tricks in physical order (the street shares by time; the road shares by color), and use B's record as the scale-up. One question carries it: "how do that many homes share one thread of glass?" It follows the orange out of the room: home → street → splitter → exchange → under the road → The Lab → back home.

### Hook first-line options (full spoken sentences, surprise first)

Timing estimates at the pilot's pace (about 2.7 words a second); the question must land by about 5 s, so a short question follows straight after.

1. "The fiber that brings the internet into your home brings your neighbors' internet too, and the little box on your wall is trusted to throw theirs away." (26 words, about 9.5 s; too long for the question by 5 s. Shorter cut: "The fiber into your home carries your neighbors' internet too." 10 words, about 3.7 s, then "So how does one strand of glass serve a whole street?")
2. "Right now, the light reaching your home is also reaching up to 63 of your neighbors, carrying all of your data with it." (23 words; "up to 63" from the 1:64 maximum, entry 3; consider "thirty-one others" with "often" instead, which is the more common case.)
3. "One thread of glass, about as thin as a hair, is carrying your whole street's internet at once, and none of it is meant to be shared." (27 words; the last clause is framing, check it against the padding test.)

Recommended: option 1's shorter cut plus the question, so the surprise lands at about 3.7 s and the question by about 6 s. The title block (or the playbook's "title shows the question from frame 0") is the director's and brand-director's call.

### Suggested 7-step structure (recommended angle C, about 60 to 75 s)

1. **Open (concrete moment):** 9 PM, you press play on a video at home. Screen wakes on the video starting. First line: the surprise (hook option 1, short cut). [🎭 23, ✅ 5]
2. **Surprising fact:** somewhere under the street, the one fiber from the exchange is split, often 32 ways, and every home receives the same light. [3, 4, 5]
3. **Question:** "So how does one strand of glass serve a whole street without everyone's data getting mixed up?" (or "…how many homes can share one strand of glass?")
4. **Answer, then mechanism (physical order):**
   a. Down: every box receives everything, reads the label on each frame, keeps its own, drops the rest. [6] Fairness: the standard lets the network encrypt each home's share, but it's a per-connection setting. [7] (Optional: the 2026 researchers. [8])
   b. Up: they take turns; the exchange sends a schedule every 125 millionths of a second, after measuring how far each home is. [9, 10, 11]
   c. Down and up use different colors in the same fiber, and a faster system can join on two more. [12, 13]
   d. Past the exchange, color does the sharing: a passive piece of glass combines dozens of colors into one fiber; each can carry 1.6 Tb/s. [15, 17] Researchers in London this year sent up to 1,273 colors at once through fiber already in the ground: 450 Tb/s. [19] (The Lab.)
5. **One idea to keep:** "On your street, homes share one fiber by taking turns; under the road, they share it by color." (Check against banned pattern 8; it is a parallel, not "not X but Y".)
6. **Attribute throughout:** "researchers in London", "the standard", no companies.
7. **Turn it back:** something to notice: the next time you see a fiber box on a pole or in a cabinet, it may be splitting one beam into a few dozen homes, yours among them; then the box on your wall drops the rest (loops to the hook). Placement of splitters in cabinets or on poles is **not sourced** (forum only), so the safe line is "somewhere between your home and the exchange".

### 3D scenes the story implies ("The Section"; orange = the hidden system)

1. **Bookend open:** phone or TV screen wakes on a video starting, 9 PM (Night).
2. **The home, cut open:** YOU on the couch; on the wall, the fiber box (ONT) with its thin cable into the floor. Realistic object, generic, no brand.
3. **The street, cut open (wide):** a row of houses sliced, the road and pavement cut to show ducts; one orange line from the exchange end reaching a splitter, then branching to every house. All houses light at once (the broadcast).
4. **The splitter, X-ray:** a sealed closure in the ground cut open; inside, one fiber in, 32 out; the orange divides evenly. "No power" shown by no cable to it.
5. **The box on the wall, cut away:** frames arrive as orange dots with label marks; matching ones pass through, others fall away (drop). Fairness beat: a padlock-like scramble on the dots (no text).
6. **Up the street, taking turns:** each house's box sends a short orange burst in its slot; the bursts arrive at the exchange lined up with gaps, never overlapping. A pulse from the exchange (the schedule) precedes each round.
7. **The exchange (OLT), cut open:** a rack, many street fibers arriving.
8. **Under the road (backbone):** a duct cut open, one fiber cut in section, many parallel lanes of light (colour handling: open question 1) merging through a passive combiner block.
9. **The Lab:** a bench of lasers and a spool, re-dressed as the London experiment; a wall counter climbs to 1,273 channels / 450 Tb/s; a map card of the 39 km loop is optional (one card at a time).
10. **Back home, closing bookend:** the video plays; push into the screen; lock; black.

---

## Open questions for the owner

1. **Colour vs the orange rule (style-guide § 1, ✅ owner decision).** WDM is "many colours in one fiber", but our system may only be orange, never "a colour per idea". Options: (a) all channels orange, told apart by lanes, spacing or dot rhythm, with the narration saying "colors" (recommended: the real light is invisible infrared anyway, entry 2, so any hues would be invented); (b) a one-off exception for this video (an identity-level change, owner only); (c) avoid the word "colors" and say "wavelengths" (less clear for viewers). Researcher does not choose; flagged for the owner and brand-director.
2. **The security beat (entry 8).** Include "researchers reprogrammed their own box and saw data meant for neighbors" (strong, current, 🟡, primary sources not yet opened, legally sensitive), or keep only the fairness line about per-connection encryption (✅)? Recommendation: keep the fairness line; add the 2026 research only once the fact-checker opens the DEF CON / Black Hat primaries.
3. **Length.** The combined angle needs about 60 to 75 s to do the street and the road without padding. Recommendation: allow up to about 75 s (allowed with self-made music); if the owner prefers under 60 s, cut 4c (colors on the street) and keep 4d.
4. **Hook timing vs the black wake bookend.** Playbook backlog (2026-10-16) says the first frame should carry the payoff and the title should show the question from frame 0; brand.md still has the black wake frame and the title at about 2.8 s. Which applies to No. 002? (Owner decision; affects the director, not the facts.)
5. **Spelling and audience.** American narrator, so "fiber" in the voice and captions; the post description too? (Most sources are British/European spelling "fibre".)

---

## Journey angle: myths, legal flags, hooks, outline, scenes (researcher addendum, 2026-10-16) · Saved for a later video (journey / sharing)

This section supersedes "Suggested angles and hooks" above for the New York to London version; the street material (angle C) becomes steps 1 to 3 of the journey. Open questions 1 (colour) and 4 (hook timing) above are settled by style-guide v0.11 § 1 and brand.md § Hook patterns.

### Extra myths for the journey

| Myth | What the evidence says | Entry |
| --- | --- | --- |
| "There's a line between me and the person I'm messaging." | The internet sets up "no connections or logical circuits"; each packet is handled on its own (RFC 791, 1981). | 28 |
| "International traffic goes by satellite." | Satellites carry 0.37% of US international capacity (TeleGeography 2026, FCC data); a US congressional report says cables carry about 95% of intercontinental internet traffic. | 36 |
| "Undersea cables are huge pipes." | In the deep sea a cable is "typically as wide as a garden hose" (TeleGeography). | 33 |
| "Light in fiber travels at the speed of light." | About two-thirds of it (cISP paper), and routes are longer than straight lines (Bozkurt et al.). | 37 |
| "The message goes straight from my phone to hers." | Chat apps relay through their servers (general knowledge, not sourced here; trap 2). | 39 |

### Extra legal flags

| Name | Where | Risk | Why |
| --- | --- | --- | --- |
| AMITIE (cable), Orange and partners | 31, 38 | Low | Place-like cable name allowed by the brief; the operator's own release; don't name the owners in the voice. |
| Verizon, Equinix/Hibernia, Hats Network | 38 | Low | Their own published measurements; description only. |
| Adtran | 26 | Low | Trade press on its product; description only. |
| TeleGeography, CRS, ENISA, IETF, NASA, Computer History Museum, DTU and cISP researchers | 25–37 | Low | Research, government and standards bodies. |
| Any messaging app | 39 | Medium if named | Naming an app would make the story about its product and invite claims about its servers; keep "your photo" generic. |

### Surprising, concrete facts for the hook (all ✅ unless noted)

1. Nothing between your phone and London is reserved for you: the internet sets up "no connections or logical circuits" (28), your street's fiber is shared by every home on the splitter (5), and even the ocean cable's fiber pairs are shared by several companies (32).
2. The cable that carries it across the Atlantic is, for most of the way, about as wide as a garden hose (33), with up to 400 Tb/s of capacity in one 2023 cable (31).
3. The round trip New York to London takes about 70 milliseconds (38), with light slowed to about two-thirds of its top speed in the glass (37).

### Hook first-line options (surprise first, full spoken sentences, question by about 5 to 6 s)

At about 2.7 words a second, 14 words take about 5 s.

1. "Send a photo from New York to London, and not one strand of glass on the way is yours." (19 words, about 7 s; or the shorter "Not one strand of glass between New York and London is yours." 12 words, about 4.5 s.) Question straight after: "So how does your photo find its way through everyone else's?" [40, 28, 5]
2. "Your photo to London crosses the Atlantic inside a cable about as wide as a garden hose, sharing it with everyone else's." (22 words, about 8 s; too long for the question by 6 s unless trimmed: "Your photo to London crosses the ocean in a cable as wide as a garden hose." 16 words, about 6 s.) [33]
3. "There's no wire from your home to your friend's in London; your photo shares every inch of the way." (19 words, about 7 s.) [28, 40]

Recommended: option 1's short cut ("Not one strand of glass between New York and London is yours.") over frame 0 showing the fiber full of colored channels with the orange one among them, then the question. It is the owner's own question turned into the surprise.

### Strong last line (loops to frame 0)

- "From your street to hers, not one strand of glass was yours, and your photo still got there in a fraction of a second." (✅ with 40's 🟡 caveat; "a fraction of a second" is safe, a specific end-to-end time is not.)
- Alternative, noticing: "So the next time a photo lands instantly from the other side of the ocean, it took turns, borrowed a color and crossed the Atlantic in a cable about as wide as a garden hose." (Lists three steps; check against banned pattern 2 since it is content, not rhythm.)

### Updated 7-step outline (journey, about 85 to 95 s)

Where it lands: seven hops at about one beat each, plus hook and ending, come to roughly 230 to 250 words, about 85 to 95 s at the pilot's pace. Cut hop 2 (aggregation) and the repeater line first if it runs long; the story still holds at about 75 s.

1. **Open, surprise first (frame 0 = the fiber with channels, orange among them):** "Not one strand of glass between New York and London is yours." [40, 25 for the colors]
2. **The moment and the surprising fact:** you, in New York, send a photo to your friend in London; on your own street, the fiber is already shared by every home on the splitter, and they all receive the same light. [🎭 23, 3, 5]
3. **Question (by about 6 s):** "So how does your photo find its way through everyone else's traffic?"
4. **Answer, then the journey in physical order:**
   a. Packets: the photo leaves as hundreds of packets, up to 1,500 bytes each, each with where it's going; nothing on the way is reserved. [27, 28] Contrast once with the old phone line (🟡 28).
   b. Your street: your box takes its turn to send, on a schedule from the exchange. [9, 10]
   c. The exchange: one box gathers many streets onto one shared link. [26] (cut first if long)
   d. Routers pass each packet along, one at a time. [28] (no hop count, 29 ❌)
   e. Long-haul fiber: your packets ride one color among dozens; the voice clause "the real light is infrared, so we've given each channel a color". [15, 17, 25, 30]
   f. The Atlantic: one of the cables to England has 16 fiber pairs, up to 400 Tb/s, shared by several companies; most of the way it is as wide as a garden hose, with repeaters every 50 to 85 km powered from shore. [31, 32, 33, 34] Light is slowed to about two-thirds of its top speed. [37]
   g. Landing station on the English coast, then London's networks. [35]
   h. Her street: the same in reverse; her box keeps her packets and drops the rest. [39, 6]
5. **One idea to keep:** "Every stretch of the trip is shared; your photo just takes its turn, its color and its address." (check against banned patterns 2 and 8) [40]
6. **Attribute throughout:** "the internet's founding standard", "a US congressional report", "researchers in London" (if the 2026 record stays as a scale beat, 19); no companies in the voice.
7. **Turn it back:** about 70 ms for a round trip [38], then the last line, ending on frame 0's picture.

Optional scale beat (only if length allows): the 2026 London record, 450 Tb/s over more than 1,200 colors in fiber already in the ground [19], as The Lab. It fits naturally after 4e or 4g, but the journey is complete without it.

### Updated 3D scene list (The Section; viewer's channel orange, style-guide v0.11 § 1)

1. **Frame 0, the fiber cut open:** a fiber in section with seven channel colours in their lanes, the viewer's orange one glowing with travelling dots (other dots inside the orange lane = other people's packets, see open question 2). Title block shows the question.
2. **The New York home, cut open:** YOU on the couch at night, phone (facing YOU), photo sent; the box on the wall (ONT).
3. **The street, cut open:** row of houses, ducts, splitter; the box sends its burst in its turn (orange burst in a row of grey ones).
4. **The exchange, cut open:** the OLT rack, many street fibers in, one fat uplink out.
5. **A router rack (data centre slice):** packets as small blocks with an address mark, each passed along one at a time onto shared links.
6. **Under the road, long-haul fiber cut open:** a passive mux combining the seven channel colours; the orange packets join their colour.
7. **The landing station (US side), cut open:** the cable leaving the shore into the sea.
8. **The ocean floor, cable cut open:** a garden-hose-thin cable on the seabed; inside, fiber pairs; a repeater with an orange pulse of boosted light; power shown as a thin line from shore. Camera follows the orange along the cable.
9. **The landing station, English coast:** cable ashore, hand-off to land fiber.
10. **The London street, cut open:** the splitter; FRIEND's box keeps the orange packets and drops the others; FRIEND's phone lights.
11. **Return to frame 0:** the camera pushes back into the fiber with the channels (the loop).

Optional: **The Lab** for the 2026 London record (bench, spool, counter to 450 Tb/s).

### Open questions for the owner (journey version)

1. **Photo, not text.** A short text fits in one packet (27). Can the story send a photo (or a voice note) so "hundreds of packets" is honest? (Recommended: a photo.)
2. **The app's servers.** Real messages go through the messaging service's servers, which may not be in London (trap 2). Accept "your photo heads for London" without claiming a direct path, or add one clause, "through the app's servers"? (Recommended: one short clause, or show a generic server rack as the router scene.)
3. **Inside the orange channel.** "Your channel" is itself shared by other people's packets (30). Show other dots in the orange lane (more accurate, but orange then also marks other people's data), or only the viewer's dots (cleaner, less accurate)? A visual rule question for the owner and brand-director.
4. **Length.** The journey lands at about 85 to 95 s. Accept, or cut to about 75 s by dropping the exchange beat and the repeater line?
5. **The 2026 record beat.** Keep the London lab record (strong The Lab beat) or drop it so the video is purely the journey? (Recommended: drop it unless the length allows; the cable beat already carries the scale.)
6. **A hop count.** No sourced New York–London hop count exists (29). Leave numbers out (recommended), or run and record a real traceroute as a disclosed illustrative example?

---

## Light to packets: how a photo becomes light and comes back (No. 002, current topic, researcher addendum, 2026-10-16)

Owner brief (via the coordinator): "how the beam of light is coded or interpreted into packets and vice versa." The trip traced here: a photo leaves the phone, the home fiber box (ONT) turns bits into light, the light crosses the fiber, a photodiode turns it back into current, a chip decides 1 or 0, recovers the clock, finds the frame, checks and fixes errors, and the packets become the photo again. Example link: GPON (the shared home fiber of entries 3–14), because the ONT is the box on the viewer's wall; long links get the coherent "twist" (entry 56). Statuses are the researcher's starting confidence. All sources accessed 2026-10-16.

Arithmetic convention: numbers derived by us (bit durations, photons per bit, photo timings) are 🟡 and show their working. Physical constants used: h = 6.626 × 10⁻³⁴ J·s, c = 2.998 × 10⁸ m/s (standard CODATA values; no page opened for them).

Notes on what is and isn't used here:

- **The phone itself sends to the box by Wi-Fi (radio), not light.** The light starts at the ONT on the wall (or the router's optic). The script should say the photo "leaves your home as light", not "leaves your phone as light".
- **GPON doesn't use 8b/10b or 64b/66b.** It uses plain on/off (NRZ) light, scrambled (entry 51). 64b/66b belongs to 10G-and-faster Ethernet optics (data centre links); it was found only in search excerpts (Intel docs redirect away from the tool), so it is 🟡 and kept out of the main story.

## 41. Bits to light: the laser is on for a 1 and (almost) off for a 0

- **Script (likely):** "The box on your wall turns your photo into light by switching a laser on for every 1 and down for every 0."
- **Status:** ✅ verified for "light for a 1, off for a 0" (FOA). ✅ for the nuance that lasers are not fully switched off: they are "biased at the threshold" and modulated by small current changes (FOA), so a 0 is dim, not dark. 🟡 for "GPON uses NRZ" (on-off, one level per bit): stated in ITU-T G.984.2 per patents and vendor material, not opened. Safe voice: "on for a 1, nearly off for a 0" or "bright for a 1, dim for a 0".
- **Source:** [Fiber Optic Transmitters and Receivers](https://www.thefoa.org/tech/ref/appln/transceiver.html), The Fiber Optic Association (FOA Reference Guide), © 1999–2022 (accessed 2026-10-16)
- **Quote:** "The transmitter takes an electrical input and converts it to an optical output from a laser diode or LED." / a laser "transmits light for a 1 and is turned off for a 0." (tool-returned excerpt)
- **Source:** [Fiber Optic Transmitter Sources: Lasers and LEDs](https://www.thefoa.org/tech/ref/appln/LEDs-lasers.html), FOA, © 1999–2012 (accessed 2026-10-16)
- **Quote:** "Lasers are biased at the threshold then modulated with small current changes to get large changes in light output."
- **Note:** The FOA is a non-profit professional body for fiber technicians; its reference guide is a recognised training text. Visual: the orange beam pulses bright/dim, never black, if the director wants it exact.

## 42. The lasers: DFB for long and precise links, Fabry-Perot for short ones, VCSELs for short multimode links

- **Script (likely):** "In the box is a laser chip smaller than a grain of salt…" (❌, size not sourced) / "…a laser built to shine at one precise wavelength."
- **Status:** ✅ for the plain-words types (FOA). 🟡 for "the home fiber box uses a 1310 nm DFB laser in burst mode": seen on one retailer-reviewed product page (androidpimp, 2024) and a search excerpt of another vendor sheet; FOA notes short, slower links often use 1310 nm Fabry-Perot lasers, so the laser type in the viewer's box varies. Say "a laser" without a type in the voice. ❌ for any chip size ("grain of salt"): not sourced.
- **Source:** FOA, Transmitter Sources, as in 41
- **Quote:** "DFB lasers, which are used in long distance and DWDM systems" / "The narrower spectral width of DFB lasers minimizes chromatic dispersion for use on the longest links." / "OSP networks that are short and not so high speed generally use 1310nm F-P lasers" / "LEDs and VCSELs are fabricated on semiconductor wafers such that they emit light from the surface of the chip" / VCSELs have "only been feasible for ~850nm sources, the wavelength used for multimode fiber"
- **Source (an ONT module spec, secondary):** [OFS-GS-001 GPON SFP ONU](https://www.androidpimp.com/tech-news/ofs-gs-001-gpon-sfp-onu/), androidpimp, published 2024-03-19, updated 2024-09-29 (accessed 2026-10-16)
- **Quote:** laser type "DFB"; "1310nm-TX"; "1490nm-RX"; receiver "APD"; RX sensitivity "< -28.0 dBm"; Transmitter Power "0.0~ 5.0 dBm"
- **Source (an ONT module spec, vendor):** [DPN-100 GPON SFP ONT module](https://dlink.ru/mn/products/1383/1871.html), D-Link, undated (accessed 2026-10-16)
- **Quote:** transmitter "Typical: 1310 nm"; receiver "Typical: 1490 nm"; receiver sensitivity "Max.: -28 DBm"; average output optical power "Min.: 0.5 dBm" … "Max.: 5 dBm"
- **Note:** Plain words: DFB = a laser with a built-in grating that makes it shine at one very precise wavelength; Fabry-Perot = simpler laser, emits from the chip's edge, broader spectrum; VCSEL = shines out of the chip's top surface, cheap, used for short multimode links at about 850 nm (data centres). The grating part of the DFB definition was only in search excerpts (patents, Illinois lecture), so in the voice say "one precise wavelength" (FOA's "narrowest spectral width").

## 43. How fast: about 2.5 billion bits a second down, 1.2 billion up, each bit lasting 0.4 to 0.8 billionths of a second

- **Script (likely):** "Coming in, the light carries about two and a half billion bits a second, so each bit lasts about 400 trillionths of a second."
- **Status:** ✅ for the line rates (Cisco, entry 14). 🟡 for the bit durations (arithmetic): downstream 1 ÷ 2.48832 × 10⁹ = **402 picoseconds** (0.4 ns); upstream 1 ÷ 1.24416 × 10⁹ = **804 picoseconds** (0.8 ns). Both are "less than a billionth of a second". 🟡 for "blinks billions of times a second": the light changes level at most once per bit, and only when the bit value changes, so "carries billions of bits a second" is exact; "blinks billions of times" is a fair image but slightly overstated.
- **Source:** Cisco, Understand GPON Technology, as in 3
- **Quote:** "Rate: 1.24416 Gigabits/s up, 2.48832 Gigabits/s down"
- **Note:** The line rate includes framing and FEC overhead (entries 52, 55), so the photo's own data moves somewhat slower. XGS-PON runs at about 10 Gb/s both ways (entry 14), giving about 100 ps per bit (🟡 arithmetic); use GPON for the main numbers since it is the story's example.

## 44. Each bit is a flash about 8 centimeters long inside the glass

- **Script (likely):** "At that speed, each bit is a flash of light about eight centimeters long, racing down the fiber."
- **Status:** 🟡 arithmetic from two sourced inputs: light in fiber at about two-thirds of c, about 200,000 km/s (entry 37, cISP paper: "∼2/3c"), times the 402 ps bit (entry 43): 2.0 × 10⁸ m/s × 402 × 10⁻¹² s ≈ **0.08 m (8 cm)** downstream; upstream 804 ps ≈ **16 cm**. "About" is required (the speed depends on the fiber's refractive index).
- **Sources:** entries 37 and 43.
- **Note:** A strong, picturable fact: a 20 km fiber holds roughly 250,000 downstream bits in flight at once (20,000 m ÷ 0.08 m; 🟡 arithmetic, not for the voice unless the fact-checker accepts it).

## 45. Why infrared: the glass is clearest at those wavelengths

- **Script (likely):** "It's infrared because that's where glass is clearest; the real light is invisible, so we've given it a color."
- **Status:** ✅ verified (FOA "windows"). The infrared and "we've given it a color" rows are entries 2 and 25 (✅); GPON wavelengths are entry 12.
- **Source:** [Optical Fiber](https://www.thefoa.org/tech/ref/basic/fiber.html), FOA, © 1999–2018 (accessed 2026-10-16)
- **Quote:** "Fiber optic systems transmit in the "windows" created between the absorption bands at 850 nm, 1300 nm and 1550 nm," … "where physics also allows one to fabricate lasers and detectors easily."
- **Note:** All three windows are beyond the eye's 700 nm limit (NASA, entry 2/25). Up and down use different infrared colours on GPON (1310 up, 1490 down, entry 12), shown as two separate orange-family pulses or one orange beam each way (director's call within style-guide v0.11 § 1).

## 46. The light fades slowly: a fraction of a decibel per kilometer

- **Script (likely):** "The glass is so clear that after a kilometer, the light has lost only about a tenth of its strength."
- **Status:** ✅ for "about 0.4 dB/km at 1310 nm and 0.25 dB/km at 1550 nm" (FOA, typical singlemode). 🟡 for "lost only about a tenth": 0.4 dB = 10^(−0.04) ≈ 0.91, i.e. about 9% lost per km at 1310 nm; at 1550 nm about 6% (arithmetic). Corning's SMF-28 Ultra maxima (0.32 / 0.18 dB/km) appeared only in search excerpts (PDF 403), not used.
- **Source:** FOA, Optical Fiber, as in 45
- **Quote:** singlemode attenuation "@1310/1550 nm" listed as "0.4/0.25 dB/km" (tool-returned table value)
- **Note:** Over a 20 km home link that is about 8 dB at 1310 nm before the splitter's own loss (arithmetic; splitter loss not sourced). The power budget ties to entry 49: the box sends about 1 to 3 mW (0 to 5 dBm, entry 42) and the far end needs only about 1.6 µW.

## 47. The pulses smear out as they travel (dispersion)

- **Script (likely):** "Over distance, each flash also smears out a little, which is why long links use lasers with a very pure color."
- **Status:** ✅ verified.
- **Source:** FOA, Optical Fiber, as in 45
- **Quote:** "Dispersion refers to the widening or spreading of pulses of light as they travel down an optical fiber."
- **Source:** FOA, Transmitter Sources, as in 41
- **Quote:** "The narrower spectral width of DFB lasers minimizes chromatic dispersion for use on the longest links."
- **Note:** Coherent receivers undo dispersion digitally (entry 56: Juniper, "The DSP applies inverse mathematical filters to reverse this distortion").

## 48. Light to current: a photodiode, often an avalanche photodiode that multiplies the signal

- **Script (likely):** "At the other end, a photodiode turns each flash into a tiny electric current, and this kind multiplies it inside the chip."
- **Status:** ✅ for "receivers use photodiodes to turn light into an electrical signal" (FOA) and "an APD has internal gain from a reverse voltage" (Hamamatsu). 🟡 for "the GPON box uses an APD": product specs (entry 42) say APD; not every module does (PIN photodiodes are also used; not sourced here).
- **Source:** FOA, Transmitters and Receivers, as in 41
- **Quote:** "Receivers use semiconductor detectors (photodiodes or photodetectors) to convert optical signals to electrical signals." / APDs are "biased at high voltage to create gain in the photodiode."
- **Source:** [APD (avalanche photodiodes)](https://www.hamamatsu.com/us/en/product/optical-sensors/apd.html), Hamamatsu Photonics, undated product page (accessed 2026-10-16)
- **Quote:** "APDs are photodiodes with internal gain produced by the application of a reverse voltage." / "They have a higher signal-to-noise ratio (SNR) than PIN photodiodes"
- **Note:** Plain words: a PIN photodiode turns each photon it catches into (at most) one electron; an APD's strong voltage makes each freed electron knock loose more, an "avalanche", so a fainter flash still gives a readable current. The "knock loose" mechanism was in search excerpts (impact ionization), not an opened page; keep the voice to "multiplies it". Long-wavelength receivers use InGaAs detectors (FOA, search excerpt only; not quoted).

## 49. The receiver works with about 1.6 millionths of a watt, a few thousand photons per bit

- **Script (likely):** "It can read the light even when only about a millionth of a watt arrives, a few thousand photons for each bit."
- **Fact-check 2026-10-16:** arithmetic re-done and correct. The Cisco −28 dBm is the exchange (OLT) receiver at 1260 to 1360 nm and 1.244 Gb/s (opened), not the home box; the home-box figure is D-Link's "Max.: -28 DBm" at 1490 nm (opened; vendor module spec; vendor sheets also list −27 dBm for Class B+ ONUs, not opened). 10^(−2.8) mW = 1.585 µW; hc/λ = 6.626e-34 × 2.998e8 ÷ 1.490e-6 = 1.333e-19 J; 1.585e-6 ÷ 1.333e-19 = 1.19e13 photons/s; ÷ 2.48832e9 = about 4,780 per bit on average (about 6,000 at −27 dBm). Status for the script's "even when a bit is only a few thousand particles of light": 🟡 derived by us, accepted; it is the receiver's rated limit (worst case) and an average over 1s and 0s (a "1" carries roughly twice).
- **Status:** ✅ for "receiver sensitivity −28 dBm" (Cisco datasheet for the exchange end; D-Link and another spec for the home end). ✅ for "0 dBm = 1 mW; −30 dBm = 1 µW" (FOA). 🟡 arithmetic for the rest: −28 dBm = 10^(−2.8) mW ≈ **1.6 µW**. Photons per bit at that power, downstream (1490 nm, 2.48832 Gb/s): photon energy hc/λ ≈ 1.33 × 10⁻¹⁹ J, so 1.6 × 10⁻⁶ W ÷ 1.33 × 10⁻¹⁹ J ≈ 1.2 × 10¹³ photons/s, ÷ 2.49 × 10⁹ bits/s ≈ **4,800 photons per bit on average** (about twice that per "1" bit, since 0s carry almost none). Upstream at the exchange (1310 nm, 1.244 Gb/s): ≈ **8,400 photons per bit**. These are at the sensitivity limit; real links usually arrive a little stronger.
- **Source:** [Cisco GPON SFP Data Sheet](https://www.cisco.com/c/en/us/products/collateral/interfaces-modules/transceiver-modules/datasheet-c78-736392.html), Cisco, 2020-10-23 (accessed 2026-10-16)
- **Quote:** Class B+ module: transmit "1480" to "1500" nm, receive "1260" to "1360" nm, transmit power "1.5" to "5" dBm, receiver sensitivity "-28" dBm; downstream "2.488" Gb/s, upstream "1.244" Gb/s (table values)
- **Source:** D-Link DPN-100, as in 42 (home end): receiver sensitivity "Max.: -28 DBm"
- **Source:** [Measuring Power in dB and dBm](https://www.thefoa.org/tech/ref/testing/test/dB.html), FOA, © 1999–2020 (accessed 2026-10-16)
- **Quote:** "Thus a source with a power level of 0 dBm has a power of 1 milliwatt." / "Receivers: -30 dBm (1 microwatt)."
- **Note:** Hook-grade, but every derived number is ours: the fact-checker must accept the arithmetic or the script keeps only "about a millionth of a watt" (✅-adjacent: −28 dBm is within a factor of 1.6 of FOA's "−30 dBm (1 microwatt)"). Comparison: the laser sends about 1 to 3 mW (0 to 5 dBm), so roughly a thousandth of what left arrives at the edge of the budget (arithmetic).

## 50. A chip decides 1 or 0 by comparing the current to a threshold

- **Script (likely):** "A chip samples that current once per bit and asks one question: above the line or below it? Above is a 1, below is a 0."
- **Status:** ✅ verified (fact-check 2026-10-16) via entry 60: an engineering article (EE Times, Maxim) and a patent background, both opened, state that the receiver compares the sampled value to a decision threshold and calls it a 1 above and a 0 below. No textbook page could be opened. Earlier researcher note, now superseded: 🟡 plausible. Standard textbook receiver design (decision circuit / threshold), but no opened source stated it in those words. Indirect support: FOA says the bit error rate is "practically an inverse function of S/N" (excerpt), and receiver specs give sensitivity at a stated error rate (BER 10⁻¹⁰, search excerpts of module sheets). The fact-checker should open a textbook or university page (e.g. an MIT OCW optical communications lecture) before this becomes ✅.
- **Source:** FOA, Transmitters and Receivers, as in 41
- **Quote:** BER is "practically an inverse function of S/N." (tool-returned excerpt)
- **Note:** Sampling "once per bit at the middle" depends on clock recovery (entry 51). Visual: a horizontal threshold line; orange current pulses above it light a "1".

## 51. No clock wire: the receiver pulls the timing out of the light, so the bits are scrambled to keep changing

- **Script (likely):** "There's no separate clock in the fiber; the chip takes its rhythm from the changes between 1s and 0s, so the sender scrambles the bits to make sure they keep changing."
- **Status:** ✅ for "clock and data recovery needs enough transitions; scrambling or line coding keeps DC balance and avoids long runs of identical bits" (Ericsson patent, describing standard practice). ✅ for "GPON downstream is scrambled with x⁷+x⁶+1 after an unscrambled sync pattern" as described in a Marvell patent restating the GPON standard (ITU-T G.984.3 not opened; 🟡 until it is). 🟡 for "64b/66b on 10G Ethernet optics adds a 2-bit sync header per 64 bits and ensures transitions for the CDR" (Intel docs, search excerpts only; three fetch attempts redirected). "No separate clock in the fiber" is ✅ by construction (one fiber carries only the data light; entries 3, 12) and by the Ericsson quote.
- **Source:** [US8995562B2, Method and apparatus providing protection and DC balance in a communication system](https://patents.google.com/patent/US8995562B2/en), Telefonaktiebolaget LM Ericsson, priority 2010-02-15, granted 2015-03-31 (accessed 2026-10-16)
- **Quote:** "Clock and Data Recovery (CDR) works best when there is high enough transition density in the signal." / "This potentially improves the Direct Current (DC) balance of the signal" / "potentially reduces the risk of having long runs of Contiguous Identical Digits (CID)" / "Calculated over time, a random data signal has good DC balance and a low probability of long runs of CID."
- **Source:** [US7983308B1, Method and apparatus for data frame synchronization](https://patents.google.com/patent/US7983308B1/en), Marvell International, priority 2006-11-28, granted 2011-07-19 (accessed 2026-10-16)
- **Quote:** "a frame synchronous scrambling polynomial (e.g., x 7 +x 6 +1)" … "following an unscrambled PSYNC field 206 of the frame overhead 202"
- **Note:** Plain words: a long run of identical bits looks like a steady light, and the receiver's internal clock would drift with nothing to lock to; scrambling mixes the bits with a known pattern so 1s and 0s alternate often, and the receiver unscrambles them. 8b/10b (1G Ethernet) and 64b/66b (10G+ Ethernet) solve the same problem with extra bits instead of (or as well as) scrambling; GPON uses scrambling, no extra bits. Patents describe the standard but are company documents; cite "the GPON standard, as described in…" in the post.

## 52. Finding where a frame starts: a fixed sync pattern every 125 microseconds

- **Script (likely):** "Every 125 millionths of a second, the light carries the same 32-bit pattern, and the box uses it to find where each frame begins."
- **Status:** ✅ for "a physical synchronization field marks the start of every downstream frame" (Cisco) and "frames are 125 µs" (Cisco, entry 10). 🟡 for "32-bit pattern 0xB6AB31E0" (Marvell patent restating G.984.3; standard not opened). 🟡 for the Ethernet equivalent: a 7-byte alternating preamble and a 1-byte start frame delimiter 10101011 (Wikipedia, citing IEEE 802.3-2018; not opened as primary).
- **Source:** Cisco, Understand GPON Technology, as in 3
- **Quote:** "Physical synchronization field. Indicates the start of every PCBd." / "A downstream GPON frame has a fixed length of 125 μs"
- **Source:** Marvell patent US7983308B1, as in 51
- **Quote:** "the PSYNC field is a 32-bit spatial pattern used by the ONT/ONU logic to find the beginning of the frame." / "the PSYNC field 206 is a fixed 32-bit pattern, with a coding of 0Xb6ab31e0 that begins every PCBd."
- **Source (Ethernet, secondary):** [Ethernet frame](https://en.wikipedia.org/wiki/Ethernet_frame), Wikipedia (accessed 2026-10-16), citing IEEE 802.3-2018
- **Quote:** "a seven-octet (56-bit) preamble and one-octet (8-bit) start frame delimiter (SFD)." / "allowing receivers to synchronize their clock at the bit-level." / the SFD "ends with a 1 instead of 0, to break the bit pattern of the preamble."
- **Note:** The PSYNC pattern is sent unscrambled so it is always recognisable (entry 51). Visual: a distinctive orange pulse pattern repeating like a metronome. Inside each GPON frame, data travels in GEM frames carrying the port label of entry 6; Ethernet frames ride inside those.

## 53. Inside each packet: where it's from, where it's going, the data, and a check number

- **Script (likely):** "Each packet carries where it came from and where it's going, a slice of your photo, and a check number at the end; if the numbers don't match, the packet is thrown away."
- **Status:** ✅ for addresses (RFC 791, entry 27) and the 1,500-byte limit (RFC 894, entry 27). ✅ for "a receiver recalculates the check, and a frame with a bad CRC is dropped" (NetApp knowledge base). 🟡 for "a 32-bit CRC at the end of every Ethernet frame" (Wikipedia citing IEEE 802.3). ✅ for TCP's own checksum (RFC 9293, entry 54).
- **Source:** [What are the ethernet CRCs and how they work](https://kb.netapp.com/on-prem/ontap/OHW/OHW-KBs/What_are_the_ethernet_CRCs_and_how_they_work), NetApp Knowledge Base, undated (© 2026) (accessed 2026-10-16)
- **Quote:** "CRC is calculated and appended" / "NIC FW checks CRC against payload" / "Bad CRC: frame is dropped"
- **Source:** Wikipedia, Ethernet frame, as in 52
- **Quote:** the FCS is "a four-octet cyclic redundancy check (CRC) that allows detection of corrupted data." / the header "contains destination and source MAC addresses as its first two fields."
- **Source:** RFC 791 and RFC 894, as in 27
- **Note:** "Where it's going" is the next device's or the server's address, not the friend's phone (journey trap 2). The CRC detects errors; it does not fix them (that is FEC, entry 55).

## 54. Anything still missing is sent again (TCP), in one line

- **Script (likely):** "And if a packet still goes missing, your phone simply sends it again."
- **Status:** ✅ verified for "TCP detects lost or damaged data and retransmits". 🟡 for "your phone": TCP runs end to end between the devices (and servers) involved; some apps use other transports (QUIC over UDP has its own retransmission; not researched). "The sender sends it again" is safest.
- **Source:** [RFC 9293: Transmission Control Protocol (TCP)](https://www.rfc-editor.org/rfc/rfc9293), W. Eddy (ed.), IETF, August 2022 (accessed 2026-10-16)
- **Quote:** "TCP reliability consists of detecting packet losses (via sequence numbers) and errors (via per-segment checksums)" / "TCP uses retransmission to ensure delivery of every segment." / "The TCP checksum is never optional."
- **Note:** RFC 9293 (2022) replaces RFC 793 (1981). The page showed only the copyright year; August 2022 is the RFC's publication month (fact-checker to confirm).

## 55. Fixing errors without asking: forward error correction adds 16 check bytes to every 239

- **Script (likely):** "The exchange can also add extra check bytes, about 16 for every 239, so the box can repair damaged bits on its own without asking for them again."
- **Status:** ✅ for "GPON can use FEC, a one-way scheme with no feedback" (Cisco). 🟡 for "RS(255,239): 239 data bytes + 16 parity bytes" (FutureWei patent restating ITU-T G.984.3; standard not opened). 🟡 for overhead: 16 ÷ 255 ≈ **6.3% of the line** (or 16 ÷ 239 ≈ 6.7% added; arithmetic). 🟡 for "repairs on its own": a Reed-Solomon code with 16 parity bytes corrects up to 8 damaged bytes per codeword (standard coding theory; not sourced here, so say "repairs some damaged bits"). FEC is optional in GPON ("can take advantage of"), so "can add" not "adds".
- **Source:** Cisco, Understand GPON Technology, as in 3
- **Quote:** "GPON can take advantage of FEC, which enables the RX end to check for error bits in the transmission." / "FEC is unidirectional and does not support error information feedback."
- **Source:** [US9942003B2, Adaptive forward error correction (FEC) in passive optical networks (PONs)](https://patents.google.com/patent/US9942003B2/en), FutureWei Technologies, priority 2015-09-04, granted 2018-04-10 (accessed 2026-10-16)
- **Quote:** "In a GPON, ITU-T G.984.3, which is incorporated herein by reference, specifies RS(255,239) as the PON FEC code" / "the number of parity bytes of the codeword is 16 bytes" / "The basic operation of an FEC scheme involves adding redundancy bytes (e.g., parity bits) to data using a code."
- **Note:** 10G PONs use a stronger code (RS(248,216) downstream per search excerpts on XG-PON; not opened). Cisco's wording "check for error bits" undersells FEC; the patent's "adding redundancy bytes" is the clearer source for "fix".

## 56. The modern twist on long links: coherent light carries 8 bits per symbol, decoded by a DSP chip

- **Script (likely):** "On the long links between cities, the light does more than switch on and off: its brightness, its timing in the wave and its orientation each carry information, so every symbol holds 8 bits, almost 60 billion times a second, and a chip rebuilds the signal in real time."
- **Fact-check 2026-10-16:** see entry 61 (scope: 400ZR reaches 40 to 120 km, "some links between cities", not all long-distance links; "flash" for a symbol is a lay word, 🟡; the script's "shift the light's wave" omits amplitude).
- **Status:** ✅ for "coherent receivers capture amplitude, phase and polarization, not just brightness; a DSP is the core" (Juniper). ✅ for "400ZR: DP-16QAM at 59.84375 GBd, 478.750 Gb/s line rate" (Juniper spec table, OIF 400ZR column). 🟡 for "8 bits per symbol": 16QAM = 4 bits per symbol (Juniper's table, not a quotable sentence) × 2 polarizations = 8; checked by arithmetic 59.84375 GBd × 8 = 478.75 Gb/s, exactly the sheet's line rate. ✅ for "200 GBaud, 1.6 Tb/s on one wavelength" (Lightwave, 2023 product launch; deployed 2024, entry 17).
- **Source:** [Coherent optics overview](https://www.juniper.net/documentation/us/en/hardware/coherent-optics-cables-guide/optics-coherent/topics/topic-map/coherent-optics-overview.html), Juniper Networks documentation, undated (accessed 2026-10-16)
- **Quote:** "This enables the receiver to capture a wave's amplitude, phase, and polarization rather than just its brightness." / "using phase and amplitude to overcome the physical limitations of traditional on-off signaling." / "coherent detection introduces a Local Oscillator (LO) to mix with the incoming signal." / "Dual Polarization Phase Shift Keying (DP-QPSK) is a modulation technique that encodes 2 bits per symbol." / "The Digital Signal Processor (DSP) is the core of a coherent transceiver."
- **Source:** [JCO400-QDD-ZR-M optical parameters](https://www.juniper.net/documentation/ke-apps/hct/optStdParams/stdHtml/JCO400-QDD-ZR-M.html), Juniper Networks, undated (accessed 2026-10-16)
- **Quote:** modulation "DP-16QAM"; signaling rate "478.750Gbps, (59.84375GBd), +/-20ppm"; "1x400 Gigabit Ethernet"; reach "120km (amplified)"
- **Source:** [Ciena introduces single-carrier 1.6-Tbps WaveLogic 6 coherent optical engines](https://www.lightwaveonline.com/optical-tech/transmission/article/14290118/ciena-introduces-singlecarrier-16tbps-wavelogic-6-coherent-optical-engines), Stephen Hardy, Lightwave, 2023-02-21 (accessed 2026-10-16)
- **Quote:** "The 200-Gbaud WL6e will enable 1.6-Tbps transmission at metro reaches" / "The WaveLogic devices are based on 3-nm technology."
- **Note:** Juniper's DP-QPSK sentence counts 2 bits per symbol per polarization (other sources say 4 for both); avoid quoting it in the voice. "Phase" in plain words: where in its wave cycle the light is; "polarization": the direction the light wave vibrates. The OIF 400ZR IA itself (2020) was not opened; Juniper's table labels its column "OIF 400ZR". Don't name Ciena or Juniper in the voice.

## 57. Back to a photo: about 24 million bits, about 2,000 packets, about 20 milliseconds on the wire

- **Script (likely):** "A 3-megabyte photo is about 24 million bits, roughly 2,000 packets, and on the wire it takes about a fiftieth of a second to leave your home."
- **Status:** 🎭 for "a 3-megabyte photo" (illustrative; third-party pages put a 12 MP phone photo at about 1.5 to 5 MB depending on format and model, none opened, no Apple figure found). 🟡 arithmetic for the rest: 3,000,000 bytes × 8 = **24,000,000 bits**; ÷ 1,500 bytes per packet ≈ **2,000 packets** (a floor; headers make it slightly more); upstream at 1.24416 Gb/s ≈ **19 ms** if the box had the line to itself (it shares it, entry 9, so in practice longer); downstream to the friend's box at 2.48832 Gb/s ≈ **10 ms**. Each packet of 1,500 bytes is 12,000 flashes of light (bits) (arithmetic).
- **Sources:** entries 27 (1,500 bytes), 43 (line rates).
- **Note:** Disclose in the post: "Illustrative: the 3 MB photo." Don't claim total send time: Wi-Fi, the app's servers and the shared line (entries 9, 39) all add to it.

## 58. And in reverse

- **Script (likely):** "At your friend's end, the same steps run backwards: light, current, 1s and 0s, frames, packets, and finally the photo."
- **Status:** ✅ as a synthesis of 41–55 (every link has a transmitter at one end and a receiver at the other: FOA, "a transmitter on one end of a fiber and a receiver on the other end", search excerpt from the FOA data link page; the transceiver page itself describes both). Each hop on the way repeats the light-to-bits-to-light cycle at every router (not separately sourced; 🟡 if spoken: "and every router on the way does this again").

## 59. Backbone and long-distance internet links are fiber (support for the hook and the last line)

- **Script:** "Before you saw this video, it was turned into blinking light and back into a picture." / "…a chip on a wall read every one."
- **Status:** ✅ for "internet backbone and long-distance links are optical fiber". 🟡 for "any given video crossed fiber": a deduction from the backbone sources, no source says it of every video. ❌ for "a chip on a wall read every one" as a claim about the viewer (see the table, row 15). Metro and data-centre links and mobile backhaul (some of it microwave radio) are not separately sourced; the hook does not need them.
- **Source:** [Fiber Optic Telecommunications](https://www.thefoa.org/tech/ref/appln/telecom.html), The Fiber Optic Association, undated (accessed 2026-10-16)
- **Quote:** "Today, with the exception of some rugged or remote locations, the entire telephone backbone is fiber optics." (Do not quote the same page's "has always been based on a fiber optic backbone": early internet links used copper and radio.)
- **Source:** [Fiber-optic communication](https://en.wikipedia.org/wiki/Fiber-optic_communication), Wikipedia (secondary; accessed 2026-10-16)
- **Quote:** "optical fibers have largely replaced copper wire communications in backbone networks in the developed world" / "the telecommunications industry has laid a vast network of intercity and transoceanic fiber communication lines"
- **Source:** CRS R47237, as in 32 and 36 (about 95% of intercontinental internet traffic by subsea cable).
- **Note:** Hook wording that is supported: "On its way to you, this video was turned into blinking light and back into a picture." Last line: a mobile viewer's last receiver is a phone radio, a cable viewer's is coax, a DSL viewer's is copper; only the story's friend has a box on a wall.

## 60. A receiver compares the sample to a threshold to decide 1 or 0

- **Script:** "A chip checks that current once per bit, calling it a 1 above a set level and a 0 below."
- **Status:** ✅ verified (engineering article and patent background; no textbook reached).
- **Source:** [A second look at jitter: Calculating bit error rates](https://www.eetimes.com/a-second-look-at-jitter-calculating-bit-error-rates/), Justin Redd (Maxim Integrated), EE Times, year 2002 as reported by the fetch tool (accessed 2026-10-16)
- **Quote:** "The sampling circuit compares the instantaneous voltage of the input waveform to the decision threshold" / the receiver must decide "whether the sampled value represents a binary one or zero" / above the threshold "it indicates that a binary one was sent".
- **Source:** [US6275959B1](https://patents.google.com/patent/US6275959), background section, Google Patents (accessed 2026-10-16)
- **Quote:** "the decision circuit samples the detected bit stream and determines whether each bit is a one or a zero" / "A given sample is assumed to be a logic one if it exceeds the threshold, or logic zero otherwise."
- **Note:** The current is first turned into a voltage; "checks that current" is a lay simplification. "Set level": the threshold is adjustable and best near the midpoint of the 1 and 0 levels. Agrawal's Rochester OPT428 slides (a search lead) returned 404; a textbook (Agrawal, Keiser) would make this a stronger ✅ but is not required.

## 61. "One flash can carry 8 bits": DP-16QAM

- **Script:** "Long-distance links also shift the light's wave and use two orientations, so one flash can carry 8 bits."
- **Status:** ✅ for 8 bits per dual-polarization 16QAM symbol (arithmetic on opened sources). 🟡 for "long-distance links" (400ZR reach 40 km unamplified, 120 km amplified) and for "flash" meaning a symbol. 🟡 for "shift the light's wave" (phase only; 16QAM also varies amplitude). Hedged wording for ✅: "Some faster links between cities also change the light's strength and timing in its wave, and use two orientations, so one flash can carry 8 bits."
- **Source:** [JCO400-QDD-ZR-M optical parameters](https://www.juniper.net/documentation/ke-apps/hct/optStdParams/stdHtml/JCO400-QDD-ZR-M.html), Juniper Networks (accessed 2026-10-16)
- **Quote:** "OIF 400ZR IA compliant 400GE coherent optical module"; "DP-16QAM"; "478.750Gbps, (59.84375GBd)"; "40km (unamplified)" and "120km (amplified)". 478.750 ÷ 59.84375 = 8.000 bits per symbol.
- **Source:** [Coherent optics part 1](https://www.skylaneoptics.com/en/blog/articles/coherent-optics-part1), Skylane Optics (vendor blog; accessed 2026-10-16)
- **Quote:** table row 16QAM: 4 bits per symbol, 25G symbol rate, 200G bit rate, PDM "YES"; "These two states can be independently modulated and detected." (25 GBd × 4 × 2 polarizations = 200G, consistent with 4 bits per polarization.)
- **Source:** Juniper, Coherent optics overview, as in 56
- **Quote:** "Quadrature Amplitude Modulation (QAM) adds amplitude variation to phase states, allowing higher data rates."
- **Note:** "Flash": the script defines a flash as what a bit looks like in the first half (a bright pulse for 1, dim for 0). In a coherent link a symbol is a short stretch of light held at a chosen strength, wave timing and orientation, not an on/off flash. Acceptable as a lay word if the owner wants one noun; "pulse of light" is no more accurate. Juniper's own "DP-QPSK encodes 2 bits per symbol" sentence counts differently from the 4-bits-per-polarization convention; do not quote it. The 8 bits is for the 400ZR format; other links carry fewer or more per symbol.

## 62. Direction matters: scrambling, fixed frame pattern and FEC as sourced are downstream GPON facts

- **Script:** sentences 6, 11, 12, 13.
- **Status:** ✅ for downstream (the friend's box, which is the receiver the script describes). 🟡 for upstream (your box): bursts begin with a preamble and delimiter set by the exchange (patent search excerpts only, not opened as text); upstream scrambling is not claimed and not sourced; FEC upstream is optional in the standard (not sourced) and Cisco's explainer says its product supports FEC downstream only.
- **Source:** Cisco, Understand GPON Technology, as in 3
- **Quote:** "Upstream frames are sent as bursts, which are comprised of the upstream physical layer overhead (PLOu)" / "Psync (4 byte length) - Physical synchronization field. Indicates the start of every PCBd." / "A downstream GPON frame has a fixed length of 125 μs" / "Supports FEC in the downstream direction only." / FEC "Does not require data retransmission." / "FEC is unidirectional and does not support error information feedback."
- **Source:** Marvell US7983308B1, as in 51
- **Quote:** "the PSYNC field 206 is a fixed 32-bit pattern, with a coding of 0Xb6ab31e0 that begins every PCBd." / "the downstream transmission frame for GPON is scrambled using a frame synchronous scrambling polynomial (e.g., x 7 +x 6 +1)"
- **Source:** Ericsson US8995562B2, as in 51
- **Quote:** "Clock and Data Recovery (CDR) works best when there is high enough transition density in the signal."
- **Source:** FutureWei US9942003B2, as in 55
- **Quote:** "The redundancy of FEC allows receivers in the PON 100 to detect and correct errors in transmitted data" / "An RS(n, k) code can correct up to (n−k)/2 (random) symbol errors" / RS(255,239), 16 parity bytes.
- **Note:** Because the script tells the story from the receiver's side ("at your friend's box"), the downstream facts fit. The generic sentence 6 ("frames that start with a fixed pattern") is fine as a generic claim. Cite patents in the post as "described in patent US…", not by company.

---

### Myths for the light-to-packets angle

| Myth | What the evidence says | Entry |
| --- | --- | --- |
| "The light in the fiber is visible, like a glowing strand." | It is infrared, beyond what the eye can see; the colours in the video are added. | 2, 25, 45 |
| "A 0 is no light at all." | Lasers are kept just above their threshold and modulated; a 0 is dim, not dark (FOA). | 41 |
| "Fiber is perfect, so there are no errors." | Light fades and smears (0.25–0.4 dB/km, dispersion); systems add check numbers (CRC), repair codes (FEC) and resending (TCP). | 46, 47, 53–55 |
| "The fiber carries a clock signal too." | No; the receiver recovers timing from the changes in the data, which is why bits are scrambled or coded. | 51 |
| "Faster fiber means blinking faster." | Long links now also encode data in the light's phase, amplitude and polarization: 8 bits per symbol on 400ZR. | 56 |
| "Your phone sends light." | Your phone sends radio (Wi-Fi) to the box; the box makes the light. | addendum note |

### Legal flags for this angle

| Name | Where | Risk | Why |
| --- | --- | --- | --- |
| Cisco, Juniper, Ciena, Hamamatsu, D-Link, NetApp | 41–56 | Low | Their own technical documents; description only, never in the voice. |
| Ericsson, Marvell, FutureWei (patents) | 51, 52, 55 | Low | Patents restating a public standard; cite as "described in patent USxxxx" in the post, not as "Ericsson says". |
| androidpimp (retailer review site) | 42 | Low-medium | Weak secondary source for a product spec; prefer the D-Link page in the post. |
| FOA, IETF, Wikipedia | 41–54 | Low | Wikipedia only as secondary for Ethernet framing; replace with IEEE 802.3 if someone can open it. |

### Hook facts (2–3 surprising, concrete)

1. Each bit coming into your home lasts about 0.4 billionths of a second, a flash about 8 cm long in the glass (43, 44; 🟡 arithmetic on ✅ inputs).
2. The box on your wall can read light as faint as about 1.6 millionths of a watt, a few thousand photons per bit (49; 🟡 arithmetic on ✅ −28 dBm).
3. There's no clock in the fiber: the receiver takes the beat from the data itself, so the bits are deliberately scrambled to keep it flickering (51; ✅ mechanism, 🟡 GPON specifics).

### Hook first-line options (surprise first; question by about 5 to 6 s)

1. "Every photo you send leaves your home as flashes of invisible light, each one lasting less than a billionth of a second." (20 words, about 7 s; shorter: "Your photo leaves home as flashes of light shorter than a billionth of a second." 14 words, about 5 s.) Question: "So how does a blinking light turn back into your photo?" [41, 43]
2. "The box on your wall reads the internet from light so faint that each bit is just a few thousand photons." (20 words, about 7 s; needs the fact-checker to accept entry 49's arithmetic.) [49]
3. "Inside your fiber, each bit of your photo is a flash of light about eight centimeters long." (16 words, about 6 s.) [44]

Recommended: option 1's short cut over frame 0 (the fiber cut open, orange pulses racing through), then the question.

### Strong last line, light to packets (loops to frame 0)

- "A moment ago, the photo on your friend's screen was 24 million flashes of light too fast and too faint for any eye, and a chip on her wall read every one." (🎭 on the 3 MB photo behind "24 million"; "read every one" is fair with FEC and resending; alternative without the number: "millions of flashes".)
- Shorter: "Your friend's photo was light a moment ago, and a chip on her wall turned it back, one flash at a time."

### Updated 7-step outline (light to packets, about 75 to 90 s)

Where it lands: eight mechanism beats (laser, fiber, photodiode, threshold, clock, frame, packet check, coherent) at one or two sentences each, plus hook and ending, come to roughly 200 to 240 words, about 75 to 90 s. Without the coherent twist (step 4h) it is about 65 to 75 s.

1. **Open, surprise first (frame 0 = the fiber cut open, orange pulses racing):** "Your photo leaves home as flashes of light shorter than a billionth of a second." [41, 43]
2. **The concrete moment:** you send a photo; it goes over Wi-Fi to the box on your wall, and the box turns it into light. [41, addendum note]
3. **Question:** "So how do flashes of light turn back into your photo?"
4. **Answer, then the mechanism in physical order:**
   a. The laser: on for a 1, nearly off for a 0, about 1.2 billion bits a second going out (2.5 billion coming in). [41, 42, 43]
   b. The fiber: each bit is a flash about 8 cm long; infrared because glass is clearest there ("so we've given it a color"); it fades and smears a little each kilometer. [44, 45, 25, 46, 47]
   c. The photodiode: the flash becomes a tiny current, from light as faint as about a millionth of a watt. [48, 49]
   d. The decision: above the line is a 1, below is a 0. [50 🟡]
   e. The clock: there isn't one in the fiber; the chip keeps time from the changes, which is why the bits are scrambled. [51]
   f. The frame: a fixed pattern every 125 millionths of a second says "a frame starts here". [52]
   g. The packet: addresses, a slice of the photo, a check number; damaged bits repaired by extra check bytes, missing packets sent again. [53, 54, 55]
   h. (Optional twist) Long links: the light's brightness, phase and orientation carry 8 bits per symbol, decoded by a DSP chip. [56]
5. **One idea to keep:** "Fiber doesn't carry your photo; it carries billions of flashes, and chips at each end agree on what they mean." (check against banned pattern 8, "not X but Y"; rephrase if the scriptwriter reads it as a slogan.) [41–55]
6. **Attribute throughout:** "the standard", "engineers", no companies; numbers we derived are said as "about".
7. **Turn it back:** about 2,000 packets for one photo, then the last line ending on frame 0's picture. [57 🟡/🎭]

### Updated 3D scene list (The Section; orange = the hidden system; style-guide v0.11 § 1 for light channels)

1. **Frame 0, the fiber cut open:** a glass fiber in section (core, cladding, jacket), orange pulses racing through, a 0 shown as a dim gap, not black. Title block shows the question.
2. **The home, cut open:** YOU sends a photo; the phone's Wi-Fi reaches the box on the wall (radio shown as non-orange? director's call; it isn't light in the fiber).
3. **The home box cut open, the laser chip:** realistic module (generic, no brand): circuit board, a tiny laser in a metal can, the fiber pigtail; the laser pulses orange in time with a bit stream.
4. **Inside the fiber with pulses:** close-up, flashes about 8 cm long travelling, slowly fading and smearing over distance (dispersion shown as pulses widening).
5. **The photodiode cut open:** at the far end, light hits a detector; in the X-ray (once per video), a cascade of electrons multiplies (APD). Current shown as orange.
6. **The chip deciding 1/0:** a waveform crossing a threshold line; samples land in the middle of each bit; a metronome-like clock locks onto the transitions; a scrambled pattern unscrambles.
7. **Bits assembling into a packet:** the sync pattern lights up, then bits slot into a frame: address blocks, a slice of the photo, the check number; a damaged block repaired by FEC; one bad packet dropped and re-sent.
8. **The Lab (optional, coherent twist):** a bench with a coherent module; the light shown as a rotating wave with brightness, phase and orientation; a constellation of 16 points on a screen-free detail box (no real UI).
9. **The packet into the photo:** packets stack into the image on FRIEND's phone (phone faces FRIEND; the photo is read through a detail box).
10. **Loop back to frame 0:** push into the fiber with pulses.

### Open questions for the owner (light-to-packets)

1. **The coherent twist (step 4h).** Keep it (a strong "modern twist", +10 to 15 s, The Lab beat) or save it for a later video? (Recommended: keep one sentence if the video is allowed to reach about 85 s; otherwise cut.)
2. **Our arithmetic as hooks.** The strongest hooks (402 ps per bit, 8 cm flashes, a few thousand photons per bit) are our calculations on sourced inputs (🟡). OK to say them with "about", once the fact-checker accepts the working? Or keep to sourced phrasing ("less than a billionth of a second", "about a millionth of a watt")?
3. **The 3 MB photo.** Illustrative (🎭) and disclosed in the post, or avoid a size and say "millions of bits"?
4. **"On and off" vs "bright and dim".** Say "on for a 1, off for a 0" (simple, what FOA says) and show a dim 0, or say "bright and dim" for accuracy?
5. **Length.** About 75 to 90 s with the coherent twist; about 65 to 75 s without. Which?
6. **Title.** The place where it happens: "The Box on the Wall" or "The Fiber" (brand rule: title is the place or object, 1 to 3 words)? Owner's call.

---

## This video's own journey: picture to bits and back (researcher addendum, 2026-10-16)

Owner brief (via the coordinator): the script follows **this video's own journey**, naming each transformation ("the video is turned into 1s and 0s called bits"). Entries 59 to 70 source the stages before the light and after it; entries 41 to 58 cover the light itself. Statuses are the researcher's starting confidence. All sources accessed 2026-10-16. Arithmetic is ours and marked 🟡 with its working.

Accuracy notes for the scriptwriter:

- **The viewer watches on YouTube, TikTok or Instagram**, so "this video" reaches them from the platform's servers, re-encoded by the platform. Its bitrate on their screen is the platform's choice; the YouTube figures below are YouTube's *upload* recommendations, a fair stand-in for "a 1080p video", not a measurement of this video in their feed.
- **The platforms often deliver over QUIC (HTTP/3) rather than TCP.** Not researched here. QUIC also numbers its packets and resends lost data, but entry 67's RFC quotes are TCP's. Safe voice: "each packet is numbered", without naming TCP.
- **Phones often use a shared-subpixel layout**, so "each pixel has a red, a green and a blue light" is a simplification (entry 69). Say "tiny red, green and blue lights".

## 59. A video is a series of still frames, commonly 24 to 60 a second

- **Script (likely):** "This video is really a stack of still pictures, thirty every second."
- **Status:** ✅ verified for "ordered frames at a fixed rate" (IEEE) and for 30 fps being a standard rate (YouTube lists 24, 25 and 30 as standard frame rates). 🟡 for "this video is 30 fps": true of our renders (`CLAUDE.md`: 30 fps), but the platform may re-encode it. Our own frame rate needs no external source.
- **Source:** [Video sequences](https://technav.ieee.org/topic/video-sequences/), IEEE Technology Navigator, undated (accessed 2026-10-16)
- **Quote:** "Video sequences are ordered collections of image frames captured at a fixed temporal rate"
- **Source:** [YouTube recommended upload encoding settings](https://support.google.com/youtube/answer/1722171?hl=en), YouTube Help, undated (accessed 2026-10-16)
- **Quote:** "Content should be encoded and uploaded in the same frame rate it was recorded." / common frame rates "24, 25, 30, 48, 50, 60 frames per second"
- **Note:** Our master is 1080 × 1920 at 30 fps (project spec, `CLAUDE.md`), so for this video "thirty pictures a second" is exact at upload.

## 60. Each frame is a grid of about 2 million pixels (1080 × 1920)

- **Script (likely):** "Each picture is a grid of about two million dots called pixels."
- **Status:** 🟡 arithmetic on our own spec: 1,080 × 1,920 = **2,073,600 pixels** ("about 2 million"). The definition "a frame is a grid of pixels" is standard but I found no opened, quotable authority in the time spent (Cambridge and University of Catania material appeared only in search excerpts or unreadable PDFs). The fact-checker should add one (any imaging textbook or a W3C/ISO definition).
- **Source:** project spec, `CLAUDE.md` ("Vertical (1080×1920, 30 fps)").
- **Note:** "This video" is literally 1080 × 1920; no outside source is needed for the size, only for the general definition of a pixel.

## 61. Each pixel is three numbers, red, green and blue, each from 0 to 255

- **Script (likely):** "Every pixel is stored as three numbers, how much red, green and blue, each from 0 to 255."
- **Status:** ✅ for "r, g, b components, 0 to 255" (W3C CSS Color 4) and "a byte is an integer from 0 to 255" (NIST). 🟡 for "this video is stored as RGB": compressed video is actually stored as brightness plus two colour-difference values (YCbCr) with colour at reduced resolution; YouTube recommends BT.709 and "4:2:0" chroma subsampling. RGB is the fair lay version and is what the screen uses at the end (entry 69).
- **Source:** [CSS Color Module Level 4](https://www.w3.org/TR/css-color-4/), W3C Candidate Recommendation Draft, 2026-10-09 (accessed 2026-10-16), § 5.1
- **Quote:** "The first three arguments specify the r, g and b (red, green, and blue) components of the color, respectively." / "For r, g and b: 0% = 0.0, 100% = 255.0"
- **Source:** [byte (glossary)](https://csrc.nist.gov/glossary/term/byte), NIST Computer Security Resource Center, undated (accessed 2026-10-16)
- **Quote:** "An integer from the set {0, 1, 2, …, 255}." (from FIPS 204) / "A sequence of eight bits." (from FIPS 197-upd1)
- **Source (video's actual colour format):** YouTube Help, as in 59: recommends BT.709 for SDR and "4:2:0" chroma subsampling (tool-returned values).
- **Note:** 3 × 256 levels gives 256³ ≈ 16.7 million colours (🟡 arithmetic). Don't put "16.7 million colours" on screen as a sourced fact unless the fact-checker accepts the arithmetic.

## 62. Numbers become bits: a bit is a 1 or a 0, a byte is 8 bits, and 255 is 11111111

- **Script (likely):** "Each of those numbers is written in 1s and 0s called bits, eight to a byte; 255 is eight 1s in a row."
- **Status:** ✅ for "a byte is a sequence of eight bits" and "a byte holds 0 to 255" (NIST, entry 61). 🟡 for "255 = 11111111" (binary arithmetic: 128+64+32+16+8+4+2+1 = 255; trivially checkable, but ours). 🟡 for "a bit is a 1 or a 0": standard, but the NIST "octet = eight binary digits" entry appeared only in a search excerpt; the fact-checker should open [csrc.nist.gov/glossary/term/octet](https://csrc.nist.gov/glossary/term/octet) or a bit definition.
- **Source:** NIST glossary, byte, as in 61
- **Quote:** "A group of eight bits that is treated either as a single entity or as an array of eight individual bits." (from NIST SP 800-67 Rev. 2)
- **Note:** A pixel at 8 bits per colour is 24 bits (3 bytes); one 1080 × 1920 frame is about 6.2 MB uncompressed (2,073,600 × 3 bytes = 6,220,800 bytes; 🟡).

## 63. Uncompressed, this video would be about 187 megabytes every second, more than a home fiber line can send

- **Script (likely):** "Uncompressed, that's about 187 million bytes every second, more than the whole fiber line out of a home can carry."
- **Status:** 🟡 arithmetic on ✅ inputs: 1,080 × 1,920 pixels × 3 bytes × 30 frames/s = **186,624,000 bytes/s ≈ 187 MB/s ≈ 1.49 Gb/s**. GPON's whole upstream is 1.244 Gb/s and downstream 2.488 Gb/s (entry 14, Cisco), so raw video would overflow the upstream on its own (🟡 comparison). With the 4:2:0 format video really uses (1.5 bytes per pixel instead of 3), raw is about 93 MB/s (≈ 0.75 Gb/s).
- **Sources:** entries 60, 61, 59 (inputs); entry 14 (GPON rates).
- **Note:** Hook-grade, but ours: keep "about" and let the fact-checker rule. The 4:2:0 caveat matters if anyone checks: say "as plain red, green and blue numbers" to make the 187 MB/s exact for the stated assumption.

## 64. Compression keeps a full picture now and then and only the changes in between, shrinking it about 100 to 200 times

- **Script (likely):** "So the video is compressed: every so often a full picture, and in between only what moved, which makes it around a hundred to two hundred times smaller."
- **Status:** ✅ for the mechanism (IEEE: I-frames as full pictures, P/B-frames sending motion vectors and the residual difference). ✅ for "YouTube recommends 8 Mbps for 1080p at standard frame rates, H.264". 🟡 for the ratio: 1,493 Mb/s raw ÷ 8 Mb/s ≈ **187×** (RGB assumption) or ≈ 93× against 4:2:0 raw (arithmetic). "Roughly 100 times" (the brief's figure) is the safe, conservative version. ✅ for "newer codecs need about half the bitrate" (HEVC vs H.264, IEEE). 🟡 for "a full picture every half second" on YouTube: YouTube asks for a "GOP of half the frame rate", and a GOP (group of pictures) starts with an I-frame (IEEE: I-frames "serve as random access points"); our reading, not YouTube's words.
- **Source:** [Video compression](https://technav.ieee.org/topic/video-compression/), IEEE Technology Navigator, undated (accessed 2026-10-16)
- **Quote:** "Video compression is the process of reducing the data volume of a video signal" / "Temporal compression targets the high degree of similarity between successive frames." / "A motion-compensated coder divides a frame into macroblocks, searches for the corresponding block in a reference frame," … "records the displacement as a motion vector, and transmits only the residual difference." / "Intraframe-coded frames, called I-frames, rely entirely on spatial compression" … "serve as random access points in a video stream."
- **Source:** YouTube Help, as in 59
- **Quote:** "1080p 8 Mbps 12 Mbps" (standard / high frame rate, SDR; table values) / "Video codec: H.264." / closed GOP with a "GOP of half the frame rate"
- **Source:** [High Efficiency Video Coding](https://technav.ieee.org/topic/high-efficiency-video-coding/), IEEE Technology Navigator, undated (accessed 2026-10-16)
- **Quote:** "High Efficiency Video Coding (HEVC), also designated ITU-T H.265 and ISO/IEC 23008-2, is a video compression standard" … "designed to reduce bitrate by approximately 50 percent compared to its predecessor H.264/AVC" … "at equivalent perceptual quality."
- **Source (standard):** [H.264 (06/2026) summary](https://www.itu.int/dms_pubrec/itu-t/rec/h/T-REC-H.264-202606-I!!SUM-HTM-E.htm), ITU-T, 2026-06 (accessed 2026-10-16)
- **Quote:** "developed in response to the growing need for higher compression of moving pictures" / "allows motion video to be manipulated as a form of computer data"
- **Note:** AV1 was not researched (no opened source). Visual: the full frame flashes as a keyframe, then only moving blocks (orange) update. Don't name a codec in the voice unless the owner wants it; "compressed" is enough.

## 65. Bits into packets: up to 1,500 bytes, each with addresses, a number and checksums

- **Script (likely):** "The compressed video is cut into packets of up to 1,500 bytes, and each one gets a label: where it's from, where it's going, its number in the line, and a checksum to catch damage."
- **Status:** ✅ for the 1,500-byte limit and addresses (entry 27: RFC 894, RFC 791). ✅ for "IP header checksum, rechecked at each hop" (RFC 791) and "TCP header: ports, sequence number, checksum" (RFC 9293). 🟡 for "this video" travelling over TCP (platforms often use QUIC; see the notes above). 🟡 arithmetic for counts: at 8 Mb/s, one second of 1080p is 1,000,000 bytes, about **670 packets** (÷ 1,500); a 75-second video ≈ 75 MB ≈ **50,000 packets** (floors; headers add a few percent).
- **Source:** [RFC 791: Internet Protocol](https://www.rfc-editor.org/rfc/rfc791), IETF, September 1981 (accessed 2026-10-16), § 3.1
- **Quote:** (Header Checksum) "Since some header fields change (e.g., time to live), this is recomputed and verified at each point" / (addresses) see entry 27
- **Source:** [RFC 9293: Transmission Control Protocol (TCP)](https://www.rfc-editor.org/rfc/rfc9293), IETF, 2022 (accessed 2026-10-16), § 3.1
- **Quote:** "The source port number." / "The destination port number." / "The sequence number of the first data octet in this segment (except when the SYN flag is set)." / "The checksum field is the 16-bit ones' complement of the ones' complement sum of all 16-bit words in the header and text."
- **Note:** Entries 53 (CRC on each Ethernet frame) and 54 (retransmission) also apply. "Its number in the line" is a lay reading of the sequence number (which counts bytes, not packets); acceptable, or say "a number that keeps them in order".

## 66. Packets into frames on the light

- **Status:** ✅, reusing entries 52 (sync pattern, 125 µs frames), 6 (the port label each home's box looks for), 55 (FEC check bytes) and 41–51 (the light). No new source.

## 67. At the phone: packets put back in order by their numbers

- **Script (likely):** "At your end, the packets arrive out of order, and their numbers put them back in line."
- **Status:** ✅ for TCP (RFC 793). 🟡 for "arrive out of order" as the normal case (it can happen, the standard plans for it; "may arrive out of order" is exact). Same QUIC caveat as 65.
- **Source:** [RFC 793: Transmission Control Protocol](https://www.rfc-editor.org/rfc/rfc793), IETF, September 1981 (accessed 2026-10-16), § 1.5
- **Quote:** "The TCP must recover from data that is damaged, lost, duplicated, or delivered out of order" / "At the receiver, the sequence numbers are used to correctly order segments that may be received out of order"
- **Note:** RFC 793 is obsoleted by RFC 9293 (2022), which keeps the mechanism; the clearer sentence is in 793. Cite both in the post.

## 68. A chip built for video rebuilds the pictures (hardware decoder)

- **Script (likely):** "A part of your phone's chip built just for video unpacks the changes and rebuilds every frame."
- **Status:** ✅ for "phone chips include dedicated video decoders", as one maker's example (Apple A17 Pro, 2023: "a dedicated AV1 decoder"). 🟡 as a general claim about all phones: Android exposes hardware-accelerated codecs through MediaCodec (developer pages too large for the tool to reach the method text; not quoted). Safe voice: "a part of your phone's chip built for video" (no brand).
- **Source:** [Apple unveils iPhone 15 Pro and iPhone 15 Pro Max](https://www.apple.com/newsroom/2023/09/apple-unveils-iphone-15-pro-and-iphone-15-pro-max/), Apple Newsroom, 2023-09-12 (accessed 2026-10-16)
- **Quote:** "A17 Pro includes a dedicated AV1 decoder, enabling more efficient, high-quality video experiences for streaming services."
- **Note:** Don't name Apple in the voice (citation). Decoding = undoing the compression of entry 64: start from the last full picture, move blocks by their motion vectors, add the residual.

## 69. Back to pixels: the screen lights tiny red, green and blue sub-pixels

- **Script (likely):** "Each pixel's three numbers set how bright its tiny red, green and blue lights shine, and your eye blends them into one colour."
- **Status:** ✅ for "an RGB-stripe display uses red, green and blue subpixels for each pixel" (OLED-Info). 🟡 for "every phone": many phone OLEDs use PenTile (RGBG), with "only two subpixels per pixel" and shared reds and blues (same source). Safe voice: "tiny red, green and blue lights" (not "three per pixel"). 🟡 for "your eye blends them" (standard, not sourced here).
- **Source:** [Pentile OLEDs: introduction and market status](https://www.oled-info.com/pentile), OLED-Info, last updated 2025-12-06 (accessed 2026-10-16)
- **Quote:** "In RGBG Pentiledisplays there are only two subpixels per pixel, with twice as many green pixels than red and blue ones." / "Samsung uses Pentile t chnology in virtually all of their Super AMOLED displays" (typos as on the page)
- **Source:** OLED-Info, TCL CSOT Real RGB story, 2025-09-27 (same site; tool-returned excerpt)
- **Quote:** "This architecture uses full 3 subpixels, red, green and blue, for each pixel."
- **Note:** OLED-Info is a specialist trade site. Don't name Samsung in the voice. The screen step closes the loop: numbers (61) back to light, visible light this time (the fiber's was infrared, entry 25), a neat contrast for the script: "light again, but this time light you can see" (✅ by entries 2/25 + this one).

## 70. The last hop is radio, but nearly all the way is fiber: "most of its trip as light"

- **Script (likely):** "Only the last few meters, from the box to your phone, are radio; nearly all the rest of the way, this video traveled as light."
- **Status:** ✅ for the pieces: the telephone and internet backbones are fiber, and wireless networks connect into the system by fiber (FOA, 2026); middle-mile networks that carry data long distances are built with fiber (NTIA, 2023); intercontinental traffic goes by subsea fiber cable (entry 36, CRS: about 95%). 🟡 for the synthesis "most of its trip as light": no source measures the share of a video's path that is fiber. It holds by distance (a Wi-Fi hop is metres; a mobile hop is the distance to the nearest mast, typically far less than the route behind it; mast distance not sourced). Safe ✅-leaning wording: "almost all of the way, it traveled as light through glass", or "except the last hop, it traveled as light". ❌ for a percentage.
- **Source:** [Telecommunications Networks](https://www.thefoa.org/tech/ref/appln/telecom.html), The Fiber Optic Association, © 2026 (accessed 2026-10-16)
- **Quote:** "Today, with the exception of some rugged or remote locations, the entire telephone backbone is fiber optics." / "The Internet has always been based on a fiber optic backbone." / "Telcos use fiber to connect all their central offices and long distance switches" / wireless antennas "are connected into the communications system using fiber optic cables" (the page adds wireless networks are "not completely wireless")
- **Source:** [Biden-Harris Administration Awards Nearly $50 Million to Expand and Strengthen Regional and National Internet Networks](https://broadbandusa.ntia.gov/node/8260), NTIA (US Department of Commerce), 2023-09-06 (accessed 2026-10-16)
- **Quote:** "Middle mile Internet infrastructure carries large amounts of data over long distances" / "Middle mile networks are the interstate highways of the Internet" / "All projects use future-proof fiber as the primary technology."
- **Source:** CRS R47237, entry 36: "carries about 95% of intercontinental global internet traffic"
- **Note:** The viewer's own access line may not be fiber (cable or DSL homes; mobile data). Fiber's share of fixed broadband was reported at about half across the OECD in 2025 (OECD release, 403 in the tool; not used). So say "the last hop", not "the fiber to your home", unless the story assumes a fiber home (🎭, entry 23).

### Suggested order for "this video's journey" (for the scriptwriter)

59 frames → 60 pixels → 61 numbers → 62 bits → 63 too big raw → 64 compressed → 65 packets → 66 frames on the light → 41–51 laser, fiber, photodiode, 1/0, clock → 52, 55 frame found, errors fixed → 67 packets reordered → 68 decoder → 69 pixels lit → 70 "most of the way as light" as the closing line. The NIST, W3C, IETF, IEEE and FOA sources are all non-commercial and fit the voice's "the standard says" framing.

---

## Device by device: the part inside each one that does the work (researcher addendum, 2026-10-16)

Owner brief (via the coordinator): walk this video's journey **device by device**, from where it is stored to the viewer's screen, naming the part inside each device that does the work, and keep only details that help a viewer understand. Entries 71 to 77 add the components; earlier entries are reused where they already cover a device. All sources accessed 2026-10-16. Name no company in the voice (all vendors here are description-only sources).

| # | Device | Part that does the work | Entries |
| --- | --- | --- | --- |
| 1 | Creator's phone or computer | camera sensor (light → numbers), video encoder (compression) | 71, 59–64 |
| 2 | Server in a data centre | storage of compressed bits; network card with a plug-in optical transceiver (laser module) | 72 |
| 3 | Routers on the way | forwarding chip reads the destination address; line cards with optical modules (light → bits → light) | 73 |
| 4 | Local exchange (OLT) | a laser module per PON port sending downstream | 74 (reuses 26, 49) |
| 5 | Box on your wall (ONT) | photodiode + receiver chip; Ethernet out; often combined with the Wi-Fi router | 75 (reuses 48–52) |
| 6 | Wi-Fi router | radio chip and antennas | 76 |
| 7 | Your phone | Wi-Fi radio; hardware video decoder in the main chip; red, green and blue sub-pixels | 77 (reuses 67–69) |

## 71. The creator's device: a camera sensor turns light into numbers, an encoder compresses them

- **Script (likely):** "It started on a camera sensor, rows of tiny light detectors turning light into electrical signals, and a chip built for video compressed them."
- **Status:** ✅ for "CMOS sensors convert light into electrical signals using rows of photodiodes with amplifiers" (Canon). ✅ for "Apple devices give apps direct access to hardware encoders and decoders" (Apple developer docs), as one maker's example. 🟡 for "turned into pixel values": the sensor's signal is digitised into numbers (standard; the analog-to-digital step was only in search excerpts, Sony document unreadable). Safe voice: "turning light into electrical signals, then into numbers". Note: **this video** was not filmed; it is rendered in 3D on a computer (`CLAUDE.md`: Remotion + React Three Fiber), so the camera-sensor step applies to a filmed video, not ours. Our frames start as numbers computed by the renderer, then encoded. The owner should decide which origin the script tells (open question).
- **Source:** [CMOS Sensors (Canon Science Lab)](https://global.canon/en/technology/s_labo/light/003/05.html), Canon Inc., undated (accessed 2026-10-16)
- **Quote:** "semiconductor image sensors that convert light into electrical signals." / "CMOS sensors contain rows of photodiodes coupled with individual amplifiers" / "The photodiodes accumulate electrical charge when exposed to light," / "those charges are then converted to voltage, amplified and transmitted as electrical signals."
- **Source:** [Video Toolbox](https://developer.apple.com/documentation/videotoolbox), Apple Developer Documentation, undated (© 2026) (accessed 2026-10-16; read via the page's .md export)
- **Quote:** "Work directly with hardware-accelerated video encoding and decoding capabilities." / "VideoToolbox is a low-level framework that provides direct access to hardware encoders and decoders."
- **Note:** A neat symmetry for the script: a photodiode starts the journey (camera sensor) and a photodiode reads the fiber (entry 48). ✅ by Canon + FOA, if the filmed-video origin is used.

## 72. The data centre server: stored as compressed bits, sent out through a plug-in laser module

- **Script (likely):** "This video sits on a server in a data centre as compressed bits, and it leaves through a plug-in module the size of a pack of gum with a laser inside." ("pack of gum" ❌, not sourced; say "a small plug-in module".)
- **Status:** ✅ for "data centres connect switches over fiber; only some server-to-switch links are copper" (FOA, 2026). ✅ for "400G QSFP-DD modules are hot-pluggable optical transceivers for data centre connectivity, over multimode or single-mode fiber" (Cisco). ✅ for "a transceiver has a laser to send and a photodetector to receive" (FOA data links, entry 41). 🟡 for "the server's own network card uses an optical module": the FOA says server-to-switch links "may be on copper up to 10G", so the first hop out of the server can be copper; the switch uplinks are fiber. Safe voice: "within the data centre, it moves to fiber through small plug-in laser modules". 🟡 for "stored on a server in a data centre" for this video: platforms host on their servers and caches (general; no platform-specific source sought, and naming one would be a citation).
- **Source:** [Data Centers](https://www.thefoa.org/tech/ref/appln/datacenters.html), FOA, © 2026 (accessed 2026-10-16)
- **Quote:** "The data center is comprised of switches connecting the users to servers" / "The switch racks connect to Interconnection and SAN switches generally over fiber optics." / "Of all these connections, generally only the server-access switch connections may be on copper up to 10G."
- **Source:** [Cisco 400G QSFP-DD Cable and Transceiver Modules Data Sheet](https://www.cisco.com/c/en/us/products/collateral/interfaces-modules/transceiver-modules/datasheet-c78-743172.html), Cisco, updated 2026-03-03 (accessed 2026-10-16)
- **Quote:** "The QSFP-DD modules are our new generation of 400G transceiver modules based on a QSFP-DD form factor." / a module described as "a hot pluggable optical transceiver compliant with 400G Ethernet." / reach values (table): SR8 up to 100 m on OM4 multimode; DR4 500 m, FR4 2 km, LR4 10 km on single-mode
- **Source:** [Fiber Optic Data Links](https://www.thefoa.org/tech/ref/appln/datalink.html), FOA, © 1999–2022 (accessed 2026-10-16)
- **Quote:** "In the transmitter, a source driver sends current through a source, typically a laser" / "At the receiver, the light pulse is converted to an electrical pulse by a photodetector"
- **Note:** Visual: a realistic, generic plug-in module (no brand) sliding into a switch port, a tiny orange laser pulse at its fiber end. SFP/QSFP names are for the description only.

## 73. Routers: a forwarding chip reads each packet's destination, and every port turns light into bits and back into light

- **Script (likely):** "At every router, a module turns the light back into bits, a forwarding chip reads where the packet is going and picks the next link, and another module turns it back into light."
- **Status:** ✅ for "a router chooses the next hop for each packet from its routing table" (RFC 1812). ✅ for "router line cards carry custom forwarding chips (packet forwarding engines) and ports that take pluggable optical transceivers" (Juniper, one vendor's line cards). ✅ for "long links regenerate the signal with datalinks in series" (FOA). 🟡 for "every router converts light → bits → light": follows from the above (ports take optical transceivers; the forwarding decision is made by a chip, i.e. electronically), but no single source states it for every router; some links pass through optical switches without conversion (not researched). Safe voice: "at a router, the light is turned back into bits so a chip can read the address, then sent on as fresh light."
- **Source:** [RFC 1812: Requirements for IP Version 4 Routers](https://www.rfc-editor.org/rfc/rfc1812), F. Baker (ed.), IETF, June 1995 (accessed 2026-10-16)
- **Quote:** "This choice, called relaying or forwarding depends upon a route database within the router." (§ 2.2.3) / "The route database is also called a routing table or forwarding table." (§ 2.2.3) / "Chooses a next-hop destination for each IP datagram, based on the information in its routing database." (§ 2.3)
- **Source:** [PTX10004 Line Card Components and Descriptions](https://www.juniper.net/documentation/us/en/hardware/ptx10004/ptx10008/topics/concept/line-card-ptx10k-lc201.html), Juniper Networks documentation, undated (accessed 2026-10-16)
- **Quote:** "The line card houses five Juniper Networks' custom ASICs, and each ASIC houses two Packet Forwarding Engines." / "The 36 QSFP56-DD ports support a speed of up to 400 Gbps" / "The ports support QSFP+, QSFP28, QSFP56-DD, and 400G-ZR transceivers." / "offers a line rate throughput of 28.8 Tbps"
- **Source:** FOA, Fiber Optic Data Links, as in 72
- **Quote:** "Extremely long cable plant lengths may require regeneration using repeaters, essentially datalinks in series."
- **Note:** Plain words: "line card" = a removable board of ports; "forwarding chip" = the custom chip that looks up each packet's address. One line card handling 28.8 Tb/s is a vivid number (✅ Juniper) but names a vendor; say "a single board in a big router handles tens of terabits a second" (✅ paraphrase). Router hop counts remain unsourced (entry 29 ❌).

## 74. The local exchange (OLT): a laser module per street, broadcasting downstream

- **Script (likely):** "At the exchange, a big box has a laser for each street, sending everyone's data down the shared fiber in infrared."
- **Status:** ✅ for the OLT module: transmits 1480–1500 nm downstream, 1.5 to 5 dBm, receives upstream at 1260–1360 nm (Cisco GPON SFP datasheet, entry 49). ✅ for "one OLT box has 48 PON ports" (entry 26, one product). ✅ for "one fiber from the OLT to each splitter" and "downstream broadcast" (entries 4, 5; Cisco). 🟡 for "a laser for each street": one PON port per splitter tree (entries 3, 26), but a "street" is our framing; "for each group of homes" is safer.
- **Sources:** entries 3, 5, 26, 49 (Cisco GPON SFP datasheet: "Class B+ (SFP-GPON-B)" transmit "1480" to "1500" nm; receiver sensitivity "-28" dBm).
- **Note:** The OLT module is the same plug-in format as the data-centre modules (SFP), which makes a visual rhyme: the same kind of small laser module at the server, the routers and the exchange.

## 75. The box on your wall (ONT): a photodiode and a receiver chip turn light into bits, then out over Ethernet

- **Script (likely):** "The box on your wall has a light sensor and a chip that turn the flashes back into bits, then hand them to your Wi-Fi router, often in the same box."
- **Status:** ✅ for "the ONT moves the signal from optical to electrical and has an Ethernet port for your router" (City of Anacortes municipal fiber operator). ✅ for "some operators supply an ONT with integrated Wi-Fi" (same page). ✅ for photodiode/APD and the receiver chain (entries 48–52; ONT spec "APD", entry 42 🟡). 🟡 for "often in the same box": one operator's offer is sourced, not how common combined units are. Safe voice: "sometimes it's the same box as your Wi-Fi router".
- **Source:** [Access Fiber Equipment](https://www.anacorteswa.gov/1138/Access-Fiber-Equipment), City of Anacortes, Washington (municipal fiber provider), undated (accessed 2026-10-16)
- **Quote:** "Its primary function is to transfer your Internet signal from the optical domain to the electrical." (on the ONT; the page describes a single RJ-45 Ethernet port for your own router, tool paraphrase) / the managed Wi-Fi plan provides "a Nokia Gateway 3 ONT with integrated Wi-Fi router technology" (search-result excerpt of the same page; the fetched page described it as an ONT with built-in Wi-Fi routing, four Ethernet ports and dual-band Wi-Fi)
- **Note:** The exact "Nokia Gateway 3 … integrated Wi-Fi" wording came from the search excerpt; the fetched text paraphrased it. The fact-checker should re-open the page for the verbatim line. Don't name Nokia in the voice.

## 76. The Wi-Fi router: a radio and antennas turn bits into radio waves

- **Script (likely):** "Your Wi-Fi router turns the bits into radio waves for the last few meters."
- **Status:** ✅ verified (UK Health Security Agency): Wi-Fi uses radio waves instead of cables, devices have antennas that transmit and receive, around 2.4, 5 and 6 GHz. 🟡 for "a radio chip" (the chip itself is not in this source; patents describe the digital-to-analog and up-conversion path; not cited). "Radio" alone is ✅.
- **Source:** [Wi-Fi: radio waves and health](https://www.gov.uk/government/publications/wireless-networks-wi-fi-radio-waves-and-health/wi-fi-radio-waves-and-health), UK Health Security Agency, last updated 2025-02-19 (accessed 2026-10-16)
- **Quote:** Wi-Fi networks use "radio waves instead of connecting cables" / "Wi-Fi devices must be equipped with antennas that transmit and receive radio waves" / signals in "both the user device and the router (access point)" / "radio frequency (RF) bands near 2.4, 5 and 6 gigahertz (GHz)."
- **Note:** Distance of the last hop ("a few meters") is typical home use, not sourced; "across the room" is safer imagery. For a mobile viewer, the last hop is a cell mast connected by fiber (entry 70, FOA).

## 77. Your phone: the Wi-Fi radio receives it, a video decoder in the main chip rebuilds the frames, the screen lights the sub-pixels

- **Script (likely):** "Your phone's antenna catches the radio waves, a part of its main chip built for video rebuilds every frame, and the screen lights its tiny red, green and blue lights."
- **Status:** ✅ for antennas in user devices (UKHSA, entry 76). ✅ for a dedicated hardware video decoder in a phone chip (Apple A17 Pro, entry 68) and Apple's documentation of "hardware encoders and decoders" (entry 71). ✅/🟡 for sub-pixels (entry 69: RGB stripe ✅; PenTile on many phones 🟡, so "tiny red, green and blue lights"). ✅ for reordering by sequence numbers (entry 67, with the QUIC caveat). 🟡 for "main chip (SoC)": the A17 Pro is Apple's phone system-on-chip and the release places the decoder in it ("A17 Pro includes a dedicated AV1 decoder"); generalising to all phones is 🟡.
- **Sources:** entries 67, 68, 69, 71, 76.
- **Note:** End-of-journey contrast: light again, but visible this time (entries 2/25 vs 69).

### Myths and plain-words notes for the device walk

| Myth | What the evidence says | Entry |
| --- | --- | --- |
| "The internet is wireless." | Wi-Fi covers only the last hop; wireless antennas connect to the network by fiber ("not completely wireless", FOA). | 70, 76 |
| "Data centres run on copper cables." | Switch-to-switch links are "generally over fiber optics"; only some server-to-switch links are copper (FOA, 2026). | 72 |
| "Routers pass light straight through." | A router reads each packet's address with a chip, so the light is turned into bits at the port and sent on as fresh light (🟡 synthesis). | 73 |

### Couldn't source (device walk)

- The analog-to-digital step inside a camera sensor (Sony document unreadable; Edmund Optics and Canon UK 403). Canon's "converted to voltage, amplified and transmitted as electrical signals" stops short of "numbers".
- That a server's own network card uses an optical module (FOA says server links may be copper up to 10G).
- That every router converts light → bits → light (no single source; supported by synthesis).
- How common combined ONT + Wi-Fi boxes are.
- A sourced "radio chip" description for Wi-Fi routers from an official vendor page (only patents and a 410 page found).
- Any size comparison for transceiver modules ("pack of gum").

### Updated device-walk outline (for the scriptwriter; about 75 to 90 s)

1. Frame 0 + hook (entry 43/44 or 63 hook, surprise first).
2. **Creator's device** (one line): light → sensor → numbers → compressed by a chip built for video [71, 61–64]. Or, for our rendered video: "computed as numbers, then compressed".
3. **Data centre server** (one line): stored as compressed bits, leaves through a small plug-in laser module [72].
4. **Packets** (one line): cut into packets with addresses and numbers [65].
5. **Routers** (one or two lines): light → bits, a chip reads the address, fresh light out [73].
6. **Exchange** (one line): a laser per group of homes, broadcasting in infrared [74, 5, 25].
7. **The box on your wall** (two lines): photodiode, 1/0 decision, clock, frames found, errors fixed [75, 48–55].
8. **Wi-Fi router** (one line): bits → radio waves [76].
9. **Your phone** (two lines): radio in, packets reordered, decoder rebuilds frames, sub-pixels light [77, 67–69].
10. Last line: "except the last hop, it traveled as light" [70].

### 3D scenes for the device walk (The Section; each device cut open, the working part shown realistic and generic)

1. Creator's phone cut open: the camera sensor module (or, for our rendered video, a computer's chip); orange where the video is.
2. Data-centre slice: a server rack, a switch, a plug-in laser module with an orange pulse at its tip.
3. Router slice: a line card in a chassis, modules on the front edge, the forwarding chip lighting as each packet is read.
4. The exchange: the OLT shelf, one module per fiber to the street.
5. The box on the wall cut open: photodiode, receiver chip, Ethernet port (and Wi-Fi antennas if combined).
6. The Wi-Fi router: antennas radiating (radio shown in a non-orange style? it carries the hidden system, so orange per style-guide; director's call).
7. The phone cut open: antenna, the main chip with the video decoder block highlighted, the screen's red, green and blue sub-pixels in a detail box.

### Open questions for the owner (device walk)

1. **Origin of "this video".** It was rendered in 3D, not filmed. Start the journey at "a computer turned scenes into numbers" (true of this video) or at a camera sensor (true of most videos, not ours)? (Recommended: our own origin; it is honest and unusual.)
2. **Level of detail per device.** Ten devices at one line each come to about 75 to 90 s. Drop the data-centre or exchange line if it runs long?
3. **Radio colour.** Is the Wi-Fi hop drawn in orange (it carries the video, the hidden system) or in a different style to mark "not light"? Style-guide v0.11 § 1 covers light channels only.

---

## Final structure: gaps sourced part by part (researcher addendum, 2026-10-16)

Owner's agreed structure (via the coordinator): server → plug-in optical module (electricity to light) → router (light to bits, address lookup, light again) → exchange to home (GPON) → the box on the wall → the phone. Entries 78 to 86 fill only the gaps; for each part, **"Say"** is a plain-words line for the voice and **"Record"** is the technical name for our files. All sources accessed 2026-10-16. Arithmetic is ours (🟡). No company in the voice.

## 78. The server: stored on solid-state drives; packets built by the operating system and often finished by the network card

- **Say:** "The video sits on a server's flash drives. Software cuts it into numbered, addressed packets, the network card often does the last of the cutting, and they leave as electrical signals."
- **Record:** storage on SSD (NAND flash); TCP/IP stack in the OS builds headers; TCP Segmentation Offload (TSO) lets the NIC split a large chunk into MSS-sized segments; Generic Segmentation Offload (GSO) does the same in software when the NIC can't.
- **Status:** ✅ for "the device (NIC) can segment one large frame into multiple frames" and "GSO is a pure software offload" (Linux kernel docs). So the answer to the brief's question is **both**: the operating system's network stack writes the headers (addresses, sequence numbers), and with TSO the NIC does the final split (🟡 for "often": TSO is common on server NICs, but how often it's enabled isn't sourced). ✅ for "one large content-delivery network stores video on solid-state drives" (Netflix Open Connect, description only). 🟡 for "this video" on SSD: platform storage isn't public; say "a server's drives" or "flash drives" with the hedge "often".
- **Source:** [Segmentation Offloads](https://docs.kernel.org/networking/segmentation-offloads.html), The Linux Kernel documentation, undated (accessed 2026-10-16)
- **Quote:** "TCP segmentation allows a device to segment a single frame into multiple frames with a data payload size" … (the size is set in `skb_shinfo()->gso_size`) / GSO is "a pure software offload that is meant to deal with cases where device drivers" cannot perform the hardware offloads
- **Source:** [Open Connect Appliances](https://openconnect.netflix.com/en/appliances/), Netflix Open Connect, © 2026 (accessed 2026-10-16)
- **Quote:** storage "Solid State Drive" (both appliance types); storage appliance "Up to 120 TB"; "Network flexibility to connect at 6x10Gbps LAG or up to 2x100Gbps"
- **Source (electrical in):** [Fiber Optic Data Links](https://www.thefoa.org/tech/ref/appln/datalink.html), FOA, © 1999–2022 (accessed 2026-10-16)
- **Quote:** "In operation, the fiber optic datalink gets an electrical pulse input from an electronic system."
- **Note:** The server's first link may be copper to a nearby switch (FOA, entry 72); the light can start at the server's module or at the switch. Say "within a few meters, the signal reaches a plug-in laser module".

## 79. Inside the plug-in module, transmit side: a chip cleans and retimes, a driver turns bits into current, a laser turns current into light

- **Say:** "Inside the plug-in module, a chip first cleans up and re-times the electrical signal, a driver turns each bit into a pulse of current, and a laser chip smaller than a grain of sand turns that current into light." (size ❌, see status; use "a tiny laser chip")
- **Record:** retimer / CDR or PAM4 DSP (module host side); laser driver (or modulator driver); laser diode (DFB, EML or VCSEL; silicon-photonic modulators in some DR4 modules); TOSA (transmitter optical subassembly).
- **Status:**
  - Laser driver: ✅ (FOA: "a source driver sends current through a source, typically a laser"; Semtech GPON chip: "combined burst mode laser driver and limiting amplifier").
  - Retimer/DSP in modules: 🟡. Marvell markets PAM4 "retimer DSP" chips for pluggable optical transceivers (product brief PDFs unreadable; search excerpts only), and a TI deck (search excerpt) shows CDRs in 10G modules. The CDR concept itself is ✅ (entry 51, Ericsson patent). Safe voice: "a chip cleans up and re-times the signal".
  - Laser diode, how current becomes light: ✅ (TU Graz course): current injects electrons and holes, they recombine and emit light; mirrors from the cleaved crystal; above a threshold current the emission becomes stimulated (laser). Lasers are biased just above threshold and modulated (FOA, entry 41).
  - "Smaller than a grain of sand": ❌ not sourced.
- **Source:** [Laser Diode (PHT.301 Physics of Semiconductor Devices)](https://lampz.tugraz.at/~hadley/psd/L15/laser_diode.php), Graz University of Technology, course page, undated (accessed 2026-10-16)
- **Quote:** "When it is forward biased, electrons are injected into the conduction band of the active region" / "These recombine and emit light." / "they can just use the reflection from the cleaved surface of the crystal" / "This is why laser diodes have a threshold current density." / "a photon stimulates an electron to fall from the conduction band to the valence band"
- **Source:** FOA, Fiber Optic Data Links, as in 78
- **Quote:** "In the transmitter, a source driver sends current through a source, typically a laser"
- **Source:** [GN25L98](https://www.semtech.com/products/signal-integrity/laser-drivers-transceivers/gn25l98), Semtech, undated product page (accessed 2026-10-16)
- **Quote:** "GN25L98 is a low-cost combined burst mode laser driver and limiting amplifier designed for gigabit passive optical network" … "optical networking unit (ONU) applications." / "A low-cost integrated avalanche photodiode (APD) controller enables a complete receive solution." / "The GN25L98 forms a low-cost chipset with the GN25L53 transimpedance amplifier (TIA)."
- **Plain words for the laser:** "Electric current pushes electrons into a tiny crystal; each time one drops into place it gives off a bit of light, and two mirror-smooth ends bounce that light back and forth until it builds into a laser beam."

## 80. PAM4: modern data-centre modules use four brightness levels, 2 bits per flash

- **Say:** "Inside data centres, the laser doesn't just switch between bright and dim; it uses four brightness levels, so each flash carries two bits."
- **Record:** PAM4 (4-level pulse amplitude modulation); 400GBASE-DR4 (IEEE 802.3bs): 4 lanes × 100G PAM4 on single-mode fiber, 1310 nm, 500 m; per-lane signalling 53.125 GBd (≈ 106.25 Gb/s line rate per lane).
- **Status:** ✅ for "four amplitude levels, each carrying two bits", "used for 400G Ethernet in hyperscale data centres", "FEC on both optical and electrical links" (Viavi). ✅ for "400G DR4: 500 m on single-mode fiber" (Cisco datasheet, entry 72). 🟡 for "53.125 GBd per lane, 1310 nm": only in vendor datasheet PDFs (FS, ATOP, Naddod) seen through search excerpts, not opened; it is consistent with 100G per lane at 2 bits per symbol plus FEC overhead (🟡 arithmetic: 53.125 GBd × 2 = 106.25 Gb/s).
- **Source:** [What is PAM4?](https://viavisolutions.com/en-uk/what-pam4), Viavi Solutions, page dated 2026-10-15 (accessed 2026-10-16)
- **Quote:** PAM4 is "utilizing four amplitude levels, each containing two bits, to double the bandwidth" / NRZ "uses just two signal levels (1 or 0)," while PAM4 "utilizes four discrete signal levels (0, 1, 2, 3) with each representing 2 bits of information." / "The adoption of this standard allowed hyperscale data centers to transition from 100G to 400G PAM4 Ethernet," / "Both the optical and electrical links use forward error correcting codes (FEC) to protect the link from errors."
- **Note:** The home GPON line stays two-level (entry 41); PAM4 is a data-centre detail. Visual: four stacked brightness bands of orange in the detail box.

## 81. Into the glass: a lens focuses the light into a core about 9 microns wide, inside 125 microns of glass

- **Say:** "A tiny lens focuses the beam into the fiber's core, a channel of glass about nine thousandths of a millimeter wide, inside a strand about as thin as a hair."
- **Record:** lens-coupled TOSA; single-mode fiber (ITU-T G.652): core ≈ 9 µm, cladding 125 µm.
- **Status:** ✅ for core "only about 9 microns" (FOA) and cladding 125 µm "about as thin as human hair" (BIPT, entry 1). ✅ for "TOSAs couple the laser to the fiber either directly or through lenses; a lens-coupled design achieved under 3 dB loss" (Optoelectronics Letters, 2021, one research design). 🟡 for "a tiny lens in every module": common design, but some modules butt-couple or use silicon-photonic couplers (search excerpts). "About nine thousandths of a millimeter" = 9 µm (🟡 unit conversion).
- **Source:** [Optical Fiber](https://www.thefoa.org/tech/ref/basic/fiber.html), FOA, © 1999–2018 (accessed 2026-10-16)
- **Quote:** "Singlemode fiber has a much smaller core, only about 9 microns, so that the light travels in only one ray (mode.)"
- **Source:** [A novel dual-lens-coupling system for DFB laser based on hybrid integration](https://journal.hep.com.cn/ol/EN/10.1007/s11801-021-0143-1), Wei, Sun, Xue, He, Sun, Liu, Cao, Optoelectronics Letters 17(7), 395–399, 2021 (accessed 2026-10-16)
- **Quote:** "The capability for a low coupling loss of less than 3 dB between the laser and fiber was demonstrated." / "The alignment and fixing of the lenses are simple to manipulate and highly accurate"
- **Source:** BIPT, entry 1: "125 micrometre, about as thin as human hair"
- **Note:** Why infrared: entry 45 (FOA "windows" at 850, 1300, 1550 nm) and entry 46 (0.4 / 0.25 dB/km) cover it; no new source needed. Hook-grade contrast: the core is roughly a fourteenth of the strand's width (9 ÷ 125, 🟡).

## 82. The router's receive side: photodiode, then an amplifier that turns tiny current into voltage, then a limiter, then a chip that decides the bits

- **Say:** "At the router, a light sensor turns each flash into a trickle of current, one amplifier turns that into a voltage, another squares it up, and a chip decides: one or zero."
- **Record:** photodiode (PIN/APD) → transimpedance amplifier (TIA) → limiting amplifier (LA) → CDR (or PAM4 DSP) → bits; ROSA (receiver optical subassembly).
- **Status:** ✅ for TIA and limiting amplifier as real parts of optical receivers (TI: "limiting-transimpedance amplifier, used in optical receivers", for "PIN" and "APD" receivers; Semtech: GPON chipset of a limiting amplifier with a separate TIA). 🟡 for the plain-words functions ("turns current into voltage"; "output swing independent of input"; "the CDR makes the timing and level decisions"): stated in an Analog Devices application note seen only through search excerpts (three fetch attempts timed out). "Transimpedance" means exactly current-in, voltage-out (TI lists a transimpedance value in kΩ), so "turns current into voltage" is safe. Photodiode ✅ (entry 48). Deciding 1/0 ✅/🟡 (entries 50, 51).
- **Source:** [ONET8531T](https://www.ti.com/product/ONET8531T), Texas Instruments, product page (accessed 2026-10-16)
- **Quote:** "11.3-Gbps 5-kΩ limiting transimpedance amplifier with RSSI" / "a high-speed and high-gain limiting-transimpedance amplifier, used in optical receivers" / applications "SFP+ Optical Receivers," "PIN Preamplifier-Receivers," "APD Preamplifier Receivers"
- **Source:** Semtech GN25L98, as in 79
- **Note:** For the router, the module may use a PAM4 DSP instead of a simple CDR (entry 80); "a chip decides" covers both.

## 83. The forwarding chip: looks up the destination in a table, longest match wins, hundreds of billions of lookups a second

- **Say:** "Then a chip built for one job reads the packet's destination, finds the closest match in a table of routes, and picks the exit; the newest can do hundreds of billions of these lookups every second."
- **Record:** forwarding ASIC / network processor (packet forwarding engine); FIB (forwarding information base, a copy of the routing table); longest-prefix match; often implemented in TCAM.
- **Status:** ✅ for "routing/forwarding table; most specific (longest) match wins; choose next hop per packet" (RFC 1812). ✅ for "custom forwarding ASICs on router line cards" (Juniper, entry 73). ✅ for "more than 435 billion lookups per second" on a 2023 router/switch chip family (Techzine, reporting a vendor launch; **lookups, not packets**, and the article doesn't say which chip). ❌ for "billions of packets per second" as a sourced figure (none found). 🟡 for TCAM (forum answers and generic explainers only; Cisco CEF docs didn't open).
- **Source:** [RFC 1812](https://www.rfc-editor.org/rfc/rfc1812), IETF, June 1995 (accessed 2026-10-16)
- **Quote:** "The route database is also called a routing table or forwarding table." (§ 2.2.3) / "Routers must use the most specific matching route (the longest matching network prefix) when forwarding traffic." (§ 2.2.5.2) / "Chooses a next-hop destination for each IP datagram, based on the information in its routing database." (§ 2.3)
- **Source:** [Cisco introduces new SiliconOne processors for AI infrastructure](https://www.techzine.eu/news/infrastructure/107856/cisco-introduces-new-siliconone-processors-for-ai-infrastructure/), Floris Hulshoff Pol, Techzine, 2023-06-21 (accessed 2026-10-16)
- **Quote:** "delivers more than 435 billion so-called lookups per second" (article also cites a "5-nanometer 51.2Tbps SiliconOne G200")
- **Note:** Plain words: "longest match wins" = like a postal sorter reading country, then city, then street, and using the most detailed line it has a rule for (our analogy, not sourced; fine as an illustration). Don't name the chip or vendor in the voice.

## 84. Why routers make fresh light: the light fades and smears, and each module type only reaches so far

- **Say:** "Each link only reaches so far before the light grows too faint and blurry to read, from a few hundred meters to over a hundred kilometers, so at each router the signal is read and sent out again as fresh light."
- **Record:** regeneration (optical-electrical-optical); attenuation and dispersion (entries 46, 47); module reach classes: SR8 100 m (multimode), DR4 500 m, FR4 2 km, LR4 10 km (single-mode), 400ZR 40 km unamplified / 120 km amplified.
- **Status:** ✅ for the reach values (Cisco 400G datasheet, entry 72; Juniper 400ZR, entry 56). ✅ for fading (0.4 / 0.25 dB/km) and smearing (FOA, entries 46, 47). ✅ for "long links need regeneration, datalinks in series" (FOA, entry 73). 🟡 for "at each router the signal is regenerated": follows from routers reading packets electronically (entries 73, 83); amplified long-haul links also boost light without regenerating (entry 34), so "at each router" is right, "only at routers" would not be. "Over a hundred kilometers": 400ZR's 120 km amplified ✅.
- **Sources:** entries 34, 46, 47, 56, 72, 73.
- **Note:** For the phrase "noise": receivers need enough light over the noise (FOA: BER "practically an inverse function of S/N", entry 50). "Too faint and blurry" covers attenuation + dispersion in plain words.

## 85. The exchange to the home: already sourced

- **Status:** ✅, reusing entries 3–6 (shared fiber, broadcast, labels), 12 (wavelengths), 41–47 (laser and fiber), 49 (OLT module, −28 dBm), 51 (scrambling, clock), 52 (sync pattern every 125 µs), 55 (FEC), 74 (OLT laser per port). No new source.

## 86. The box on the wall: photodiode → TIA → limiting amplifier → clock and data recovery → frame sync → FEC decode

- **Say:** "In the box on your wall, a light sensor catches the flashes, two amplifiers turn them into a clean electrical signal, a chip finds the beat and decides each bit, spots the start of each frame, and repairs any damaged bits."
- **Record:** BOSA (bidirectional optical subassembly: 1310 nm laser + 1490 nm APD); APD → TIA → limiting amplifier (Semtech GN25L98 + GN25L53 class chipset) → CDR → GTC frame sync on PSYNC → RS(255,239) FEC decode → GEM port filtering → Ethernet out.
- **Status:** ✅ for "GPON ONU chipsets combine a burst-mode laser driver and limiting amplifier, with an APD controller, paired with a separate TIA" (Semtech). ✅ for APD (entry 42 spec, entry 48), PSYNC frame start (52, Cisco ✅ / pattern value 🟡), FEC (55, Cisco ✅ / RS code 🟡), CDR concept (51, ✅), GEM port filtering (6, ✅), Ethernet out (75, ✅). 🟡 for the CDR being a separate block in the ONT: Semtech's page doesn't mention CDR; in practice clock recovery sits in the receiver chain or the PON chip (not sourced). Say "a chip finds the beat" without naming where.
- **Sources:** Semtech GN25L98 (as in 79); entries 6, 42, 48, 51, 52, 55, 75.
- **Note:** BOSA appeared only in Semtech's target applications ("BOSA-on-board ONUs", search excerpt); keep it in our records, not in the voice.

### Plain-words lines, part by part (for the scriptwriter)

| Part | Say (plain words) | Record (technical) | Entry |
| --- | --- | --- | --- |
| Server storage | "flash drives in a server" | SSD (NAND) | 78 |
| Packet building | "software cuts it into numbered, addressed packets; the network card often finishes the cutting" | OS TCP/IP stack + NIC TSO (or GSO) | 78, 65 |
| Module: retimer | "a chip cleans up and re-times the signal" | CDR / retimer / PAM4 DSP | 79 |
| Module: driver | "a driver turns each bit into a pulse of current" | laser driver | 79 |
| Module: laser | "a tiny crystal turns current into light, bounced between two mirror-smooth ends" | laser diode (DFB/EML/VCSEL) | 79 |
| Module: PAM4 | "four brightness levels, two bits per flash" | PAM4, 400G-DR4 | 80 |
| Module: lens and core | "a tiny lens focuses it into a core about nine thousandths of a millimeter wide" | lens-coupled TOSA; SMF core 9 µm, cladding 125 µm | 81 |
| Router: receive | "a light sensor, an amplifier that turns current into voltage, another that squares it up, a chip that decides one or zero" | PD → TIA → LA → CDR/DSP | 82 |
| Router: lookup | "a chip reads the destination and finds the closest match in a table of routes" | forwarding ASIC, FIB, longest-prefix match (TCAM) | 83 |
| Router: why fresh light | "the light fades and blurs, each link reaches only so far" | attenuation, dispersion, reach classes, OEO regeneration | 84 |
| Box on the wall | "a light sensor, two amplifiers, a chip that finds the beat, spots each frame and repairs damaged bits" | BOSA, APD, TIA, LA, CDR, PSYNC, RS FEC | 86 |

### Couldn't source (final-structure gaps)

- How often servers enable TCP Segmentation Offload, and what any video platform stores its videos on (only one CDN's appliances found).
- An opened page stating that pluggable modules contain a retimer/CDR or PAM4 DSP (Marvell product briefs unreadable; TI deck search excerpt only).
- 400G-DR4 at 53.125 GBd per lane, 1310 nm, from an opened page (vendor datasheet PDFs only).
- The plain-words functions of the TIA ("current into voltage") and limiting amplifier from an opened page (Analog Devices note timed out three times; the "transimpedance" definition supports it).
- "Billions of packets per second" for a forwarding chip (only "435 billion lookups per second"); TCAM use from an official page.
- Where clock recovery sits inside an ONT.
- Any size comparison for a laser chip ("grain of sand").
