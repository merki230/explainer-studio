# Brand changelog

Every change to `brand.md` or `style-guide.md` gets a line here: date, what changed, why (pointing to a `feedback.md` entry or a research section). Nothing changes silently.

## style-guide v0.18.4 · 2026-11-02 · Long-form thumbnail

Brand-director spec on the main session's request. It fills § 11.9's "not specced yet". No owner decision involved; the owner picks the text and approves the render. Values 🧪.

- **New § 11.9.1, Thumbnail (long-form):**
  - **Basis:** YouTube Help `answer/72431`, read 2026-11-02 (3840 × 2160 recommended, ≥ 640 wide, JPG/PNG, ≤ 2 MB mobile / 50 MB desktop, verified account).
  - **Grid and output:** 1280 × 720 design units, rendered at 3840 × 2160 PNG, plus a 1280 JPG ≤ 2 MB.
  - **Picture:** one moment from the video, 100% 3D (never the stock opening), at the house angle, with the orange system visible. No overlays from the video.
  - **Layout:** text in the left third, subject at x 470 to 1220; keep-outs bottom-right x ≥ 1060, y ≥ 610 (duration badge) and top-right x ≥ 1140, y ≤ 140 (hover icons).
  - **Small-size reading:** key elements ≥ 30 units; `routeScale` ×2.5 and cut ink ×1.5 for the still only; checked at 168 × 94 and 320 × 180.
  - **Text:** ≤ 4 words, true and hedged as the video is; Archivo 800 108 units, `ink` with the paper halo, x 64, ≤ 3 lines, right edge ≤ 470.
  - **Never:** logos, number, "Part 1", arrows, circles, emoji, faces, red or yellow highlights, borders, non-theme colours.
- **Also changed:**
  - **§ 10 Cover:** long-form gets a custom thumbnail.
  - **§ 11.9:** points to § 11.9.1.
- **`datacenter-water/publish.md` § Thumbnail filled:**
  - the `THUMB` framing and state from frame 2711;
  - text options: A "Mostly, it goes up." (recommended), B "Where does it go?"; "Where does the water go?" is rejected (5 words);
  - the production steps per role.

## style-guide v0.18.3 · 2026-11-02 · No. 014 theme tokens reviewed (`TWINS`, `WINTER`)

Brand-director review of the scene-builder's new `theme.ts` tokens for `hybrid-city`. No owner decision involved; values 🧪. The brand-director doesn't edit code, so the scene-builder applies the changes. New rows in § 1 Location palettes.

- **`TWINS.gasPaint`: adjusted, `#5d6168` → `#6b7078`** (217°, 6%, 45%). The old value was a near-twin of FRIEND's car `#575c64` and only ≈ 4 points of lightness above `CITY.asphalt`. The new one is ≈ 25 points under YOU's car, so the twins still differ by value. Fallback: `#5d6168`, aliased to FRIEND's token. The scene-builder's stills still showed both twins pale, so a re-still is needed.
- **`WINTER`: approved, with conditions.** Every token is ≤ 30% saturation. `bark` (27°, 6%) is far under the band's saturation floor, so nothing reads as orange.
  - Lit `snow` and `frost` must pass the § 2 whites check (≤ 244, no 255). If they fail, set `snow` to `#e4e8ec`.
  - **`flake` aliased to `snow`** (`#f4f6f8` is over 244).
  - `slush` may alias `HIGHWAY.wheelPathWet`.
  - Keep the snowbanks out of the pale hybrid's silhouette.
  - `skyTint` is allowed (a multiply on the existing `sky`).

## style-guide v0.18.2 · 2026-11-02 · Sticker card (`hybrid-city` F3 / N7)

Brand-director spec on the director's F3 request, relayed by the main session. No owner decision involved; values 🧪.

**§ 6, new row "Sticker card" (`StickerCard`):** two cars' city and highway MPG, built from the house parts.
- **Layout:** detail-box frame, 696 × 440 at x 120, top y 330; an `MPG` tab; `GAS` / `HYBRID` columns with paint squares; `CITY` / `HWY` rows; Archivo 800 120 px digits; one `inkSub` rule.
- **Not the EPA label:** no logos, seals, header wording, colour bands, icons, combined figure or fine print. No model, maker, trim, year or price.
- **Colour:** ink, paper, inkSub and the paint tokens only. No orange.
- **Emphasis:** ink boxes (≤ 2, draw 12 frames, may move 12 frames), a row dim to `inkSub` (10 frames), and an unlabelled bars-mode bracket.
- **Motion:** in with an 8 px rise over 10 frames; numbers land on their column's spoken word (CITY, then HWY 4 frames later); out over 10 frames.
- **Its two uses in No. 014:** (A) the flip, boxes on 37 then 51; (B) the card returns in A's end state, CITY dims, the 51 box moves to 44, and a bracket joins 37 and 44.
- **Rules:** it is the frame's one card; captions continue (≥ 270 px clear); it never shares the frame with the title block (if the owner keeps the title block up, the card drops under it). ≤ 2 appearances per video.

**Also:** One idea per frame list and checklist 8 updated.

## style-guide v0.18.1 · 2026-11-02 · Footage never committed; chapter-card hold range (main session corrections)

Corrections relayed by the main session; no new owner decision. Values 🧪.

- **§ 11.6.1 Storage:** the GitHub repo is public (`merki230/explainer-studio`), and the Pexels and Pixabay licences ban redistributing the file on its own. So stock footage is **never committed**. The working clip lives in `src/videos/<slug>/footage/`, git-ignored (the main session added the ignore rule and updated CLAUDE.md). The evidence PDFs are git-ignored too. Only the licence record in `sources.md` § Footage is in git, and the clip is rebuilt from it (URL, timecodes, SHA-256, grade). This replaces v0.18's "in git while the repo is private".
- **§ 11.5.1 Chapter card hold:** the range is **2.0 to 2.7 s** (was 2.0 to 3.0); the default stays 2.5. Tooling found that with the frame timings, a 3.0 s hold fades out after the narrator resumes at Q + 117. At 2.7 s the fade ends exactly at Q + 117. The `ChapterCardSpec.hold` comment is updated to match.
- **§ 11.5.1, tooling's deviation recorded:** the scene layer scales up +4% during the blur ramp (`CARD_BLUR_SCALE`) to hide the blur's edge band. It stays unless the owner vetoes it after seeing it.

## style-guide v0.18, brand.md v0.15 · 2026-11-02 · Real opening shot on long videos; Shorts 100% 3D (owner decision)

Owner decision of 2026-11-02, relayed by the main session (✅). Logged in `feedback.md` ("Owner decision · real opening shot on long videos"). Values by the brand-director (🧪). New research: `research/stock-footage.md` (SF§): Pexels and Pixabay licence terms read 2026-11-02, YouTube's Content ID eligibility, lens-match analysis, licences refused.

**style-guide § 11.6.1, new "The real opening: real to section":**
- **Scope:** long-form only, first shot only, no real pixel after F96, hard cap F120. Optional.
- **Clip criteria:**
  - truthful (a real data center with rooftop towers and a steam plume, nothing passed off as one);
  - no logos, signage, names or plates;
  - no identifiable operator or site;
  - no faces, crowds, protest or meeting imagery;
  - no text;
  - ≥ 1920 × 1080 (4K preferred), 30 or 60 fps, ≥ 6 s of steady push or orbit;
  - pitch 8 to 24°, building face at 15 to 45°;
  - Day light, not golden hour;
  - plume not blown;
  - title zone quiet.
- **Licences:** CC0; Pexels and Pixabay licences; CC BY 4.0 with credit. Refused: NC, ND, SA, editorial, unread sites.
- **Licence record:** in `sources.md` § Footage.
- **Content ID checks:** paid-stock search, reverse search, audio stripped, Private upload and Studio Checks before scheduling.
- **Storage proposal:** original in `out/<slug>/raw/footage/`; the working clip, graded, 4.5 s and ≤ 20 MB, in `src/videos/<slug>/footage/` in git, moved out if the repo goes public. (Superseded by v0.18.1: never in git.)
- **Grade:** whites ≤ 244, blacks ≥ `cutLine`, saturation −30%, reserved-band hues capped at 50% saturation, sky matched to Day `sky` within ΔE00 6, the live vignette and grain shared with the 3D.
- **Camera match:** solved keyframes, 3D corners within 8 px.
- **The reveal:** F0 to F54 real; F54 to F66 ink section line; F66 to F96 facade wipe, matched cross-fade and surroundings falling away; F84 to F102 orange dot tell; F96 to F138 dolly-zoom to 26° and the one glide to the house angle.
- **Rules:** the camera never stops, no freeze frame, frame-accurate determinism.
- **Title block:** unchanged from F0.
- **Sound:** none from the clip.
- **Disclosure:** footage credit always; illustrative clause.

**Exceptions noted elsewhere:**
- style-guide: intro line, § 3 The Section, § 3 Assets, § 8 Angle, § 10 Description, § 11.6 Opening, § 11.8 (no footage in Shorts), § 11.9 upload, checklist 1, new checklist 17.
- brand.md: § Promise difference 3, § Long-form (new "Real opening shot" row), § Shorts (Picture: 100% 3D), § Sourcing policy (footage bullet), § What we never do (new footage row; camera and asset rows point to it).

## style-guide v0.17, brand.md v0.14.1 · 2026-11-02 · Full-frame chapter card on long videos (owner decision)

Owner decision of 2026-11-02, relayed by the main session (✅); `feedback.md` ("Owner decision · full-frame chapter card"). Values by the brand-director, 🧪.

- **style-guide § 11.5.1, new "Chapter card (full frame, silent)":** chapters 2 and later; the narrator asks the question at the end of the previous chapter, then the scene dims (mood's `paper` scrim 72%) and blurs (16 px) while still moving; label `CHAPTER n` Mono 700 28 px, question = the `##` heading, Archivo 800 80 px / 1.0 (72 px min, ≤ 2 lines), left x 144, right edge ≤ 1536, centred on y 500; timings in frames from the question's end (Q + 6 dim, card in by Q + 24, hold 75 frames, out by Q + 111, voice back at Q + 117); chapter change (`slide`/`follow`) under the card; no place/time line (a place label may follow in the new chapter); captions off, nothing else on screen, no orange on the card; no new colour. Director field: `VideoSpec.chapters[]` narrowed (`chapter` ≥ 2, `question` for a manual break, `hold`, `sound`, `show: false`); `place`, `time`, `askedAt` dropped. Notes for tooling: a real voice gap at each `##`, YouTube chapter timestamps at the card.
- **style-guide § 11.5:** the corner chapter card (x 144, y 120, held 3 s; "no chapter bumpers, no numbers on screen") **retired**, replaced by a pointer; name-tag and place-label rows no longer refer to it.
- **style-guide § 11.6 Transitions:** chapter `slide`/`follow` runs under the card. **§ 11.7 Sound:** +4 dB swell under the card, the music step at Q + 24 (a per-chapter bed changes there), optional soft tone 18 to 20 dB under the voice as a named exception to § 9's "no stingers", no whoosh on the slide under a card. **§ 11.8:** Shorts get no card; their title block carries the chapter's question. **Checklist 16** updated.
- **brand.md § Long-form, Chapters:** one sentence pointing to the card. **§ Voice, Answer straight:** clarified that the silent card is picture, not a tease; the new chapter answers in its first sentences.

## style-guide v0.16.1 · 2026-11-01 · § 11 size floor wins (scene-builder question)

Brand-director decision, no owner decision involved; values 🧪. § 11.5 had sizes under § 11.2's 26 px floor. **The floor wins** (TV and inline-portrait legibility, LF§2); hierarchy comes from weight and `inkSub`, not size. Raised to 26 px: title block / chapter card line 2 (Mono 600, tracking 0.18em → 0.12em, ≤ 46 characters; was 20 px), callout sub-line (was 22), place-label sub (was 22), counter sub (was 22), price-tag sub (was 24), chart bar labels (was 24). As built, recorded: DETAIL and chart tabs Mono 700 26 px; statement `high` top y 300; caption pages fill up to 2 lines.

## brand.md v0.14, style-guide v0.16, channel-kit · 2026-11-01 · Open decisions 9 and 10 settled (owner decision)

Owner answers of 2026-11-01, relayed by the main session (✅); `feedback.md` (long-form entry, update). **9:** YouTube branding watermark **on, entire video**, on long videos only (YouTube shows it only on landscape video): brand.md § Channel identity, channel-kit (watermark spec, assets table, setup checklist step 4), style-guide § 11.2 and § 11.9 upload checklist. **10:** burned-in house captions **on** for long videos, **no YouTube caption file**, for Part 1, compare later: brand.md § Structure, Long-form (new Captions row), style-guide § 11.4 and § 11.9. Both rows removed from brand.md Open decisions and noted as settled in its intro.

## brand.md v0.14, style-guide v0.16 · 2026-11-01 · Long-form: horizontal YouTube videos, Shorts from chapters (owner decision)

Owner decisions of 2026-11-01, relayed by the main session (✅): long-form YouTube videos of ≥ 5 min, **horizontal** (TV and desktop), vertical Shorts cut from their chapters for TikTok, Instagram and Shorts; the first is the two-part data center series (water, then electricity). Logged in `feedback.md` ("Owner decision · long-form, horizontal, Shorts from chapters"). New research: `research/long-form.md` (SMPTE safe areas, YouTube chapters and end screens, Shorts related-video link, Netflix/BBC caption rules, narration pace, crop vs re-render). Values by the brand-director, 🧪.

- **brand.md § Promise, Platforms:** long-form on YouTube added (✅ owner decision).
- **brand.md § Structure, new subsection "Long-form":** guided investigation on one thread; hook by ≈ 30 s (question by ≈ 20 s, stakes, payoff picture; never "in this video I'll…"); 3 to 5 chapters, one question each, each ending on the next question, = YouTube chapter markers, each standing alone as a Short; re-hook every 60 to 90 s; belief named then corrected, once; opening paid off; ending = honest trade-off + one-sentence tease, no outro, no loop; ≥ 5 min, ≈ 150 wpm, plan 800 to 900 words at our measured 150 to 168 wpm, length from story never padding; same voice rules; `## chapter` and `> Short hook:` lines in `script.txt`. **Shorts from chapters:** one chapter → one 45 to 60 s Short with its own hook line, chapter's next-question cut, loops to frame 0, vertical re-render, title block with the long video's number and chapter, link via YouTube's related video and one TikTok/Instagram caption line. The old "Long-form, later, uses the same steps with 2 or 3 questions" line replaced.
- **brand.md § Naming:** long videos take the next number (+ `PART n`); their Shorts carry the long video's number and `CH. n`, no own number.
- **brand.md § What we never do:** horizontal readable rectangle x 144 to 1776, y 120 to 960; no intro, sting, "in this video", subscribe request, recap or "thanks for watching" on long videos.
- **brand.md Open decisions:** new 9 (YouTube watermark on long videos; stays off, recommendation on) and 10 (burned-in captions on long videos; default on). Channel identity's watermark row points to 9.
- **style-guide § 11, new "Horizontal format":** 1920 × 1080, 30 fps; action-, title-safe and the house readable rectangle; watermark corner; sizes ×1.0 to ×1.1 (angle per pixel); captions 52 px, x 144, bottom y 960, ≤ 42 characters, ≤ 2 lines; every overlay positioned; **chapter card** = the title block reused, no full-screen card; fov ≈ 14.8 vertical (26° across), angle unchanged; wider slices (≈ 5.6 × 2.6, 70 to 80% of width), two-shot staging, pushes ≈ 0.75×, glides 0.8 to 1.2 s, scenes 4 to 8 s, slides from the right; ≈ 12 s end-screen hold, right half clear; sound unchanged, own music only; **Shorts re-rendered vertical, never cropped**, every scene with a vertical staging; export; checklist item 16. § 10 Frame row and the header point to it.

## style-guide v0.15 · 2026-10-29 · Whole near-side wheels on cut-open cars (owner decision)

Owner decision of 2026-10-29, relayed by the main session (✅). Logged in `feedback.md` ("Owner decision · whole wheels on cut-open cars"). § 3 new row: near-side wheels stay whole (full tire and rim in front of the cut face); a wheel is cut only when the hidden system is in it (e.g. the tire-pressure sensor). Default for new car videos; posted videos unchanged.

## style-guide v0.15 as built · 2026-10-29 · The Lab · teardown, No. 011's new opening

Scene-builder's as-built values, recorded in § 3 The Lab: teardown dressing; no rule change. The owner moved the opening from the twin lot into the teardown room. 8.0 × 7.0 m is now the single-car size; a second car widens the room to x ≈ 8.0 (≈ 9.7 with a crate) and stands on four stands, a low grey shop dolly (4.0 × 2.05 m, castors, top 0.15 m, no text) or its tires; shop stool; one working tool-chest drawer (0.3 m, 0.4 s); the mechanic = grey extra with the `charge-slice` actions; crates may feed a raised car. Title block `NO. 011 · THE LAB · 1:20 PM`; no place label.

## style-guide v0.15 as built · 2026-10-29 · Real car models (No. 011)

Scene-builder's as-built values, recorded in § 3 Real car models; no rule change: house wheelbase kept (axles ±1.35), lengths 4.43 / 4.66 units, roof cuts 1.36 / 1.44; hood and cowl ≈ 7 cm high (inverter clearance); tires 10–14 % over the real 18 in share, rim faces `aero5` / `twin10`; seats on the floor, heads 1–3 cm under the roof cut; Model 3 greenhouse all black incl. the C-pillar sail, high-mount brake lamp a deck bar; no Seal 06 front light bar; nose cues show only in profile (tail-on camera); flush handles and lower door crease not drawn; tails a flat extruded slab.

## style-guide v0.15 correction · 2026-10-29 · Seal 06 EV dimensions

Fact-checker (`byd-price/sources.md` claim 20): the priced Seal 06 EV is the 2027 model year (launched 2026-08), 4,870 × 1,890 × 1,495 mm, wheelbase 2,820. § 3 Real car models updated (wheelbase ≈ 0.579 L, overhangs ≈ 0.20 / 0.22, height ≈ 0.307 L); Model 3 filing figures 4,720 × 1,848 × 1,442, wheelbase 2,875; "same length" note replaced: the BYD is about 3 % longer and taller with a shorter wheelbase, "about the size of" holds.

## style-guide v0.15, brand.md v0.13.6 · 2026-10-29 · Real car models from No. 011 (owner decision)

Owner change of 2026-10-29, relayed by the main session (✅): the recognisable cars are wanted now, for No. 011 ("the opening is weak, let's go for realistic ones"). Logged in `feedback.md` ("Owner decision · recognisable real car models", update). Dimensions: Model 3 Highland from auto-data.net / basenor.com (4,720 × 1,850 × 1,441, wheelbase 2,875, overhangs 868 / 977); Seal 06 EV from Wikipedia and CarNewsChina (4,720 × 1,880 × 1,495, wheelbase 2,820; closed front, lower trapezoidal intake, sharp LED headlamps, full-width tail light bar, flush handles). Values 🧪.

- **style-guide § 3, new row "Real car models":** for cars the voice names as the story's product, drawn to resemble the real model in `RealCar` / `SlicedCar`; proportions as ratios of length; Model 3 cues (grille-less nose, slim headlamps, fastback, dark glass roof, C-shaped tail lamps, smooth flanks) and Seal 06 cues (closed low front, trapezoidal intake, taller greenhouse, body-coloured roof to check, sharp shoulder crease, full-width tail bar); invented wheels; paints kept; banned list; the cut's inside stays generic; same shape in every location and for the ghost; tags unchanged; still check "told apart by silhouette alone". The hatch stays generic. § 3 Generic devices points to it.
- **brand.md:** Open decision 8 settled (row removed, noted in the intro); § What we never do's device row carries the cars-only exception and the disclosure wording.

## style-guide v0.14.2 · 2026-10-29 · Car price tag (No. 011 N9)

Brand-director decision on the director's N9 request (relayed by the main session): two price callouts would break § 6's one-card rule beside the title block. No owner decision involved; values 🧪.

- **style-guide § 6, new row "Car price tag":** the car name tag with up to three lines (name Inter 700 26 px ≤ 18 characters, maker as spoken plus model; price Inter 800 32 px; sub Inter 600 22 px `inkSub`), ≤ 440 px wide, a tag not a card, ≤ 2, once per video, may share the frame with the title block, never with a card. Not in the first second: name on the spoken car name, price lines on the spoken price; out together over 10 frames. Placement left at x 120, ≥ 24 px under the title block, clear of car bodies; drop line 3 before overlapping. Checklist 7.
- **Changed from the director's proposal:** line 1 carries the maker as spoken (`BYD SEAL 06 EV`, `TESLA MODEL 3 RWD`, a fact-checker OK needed, since only the maker is added); the yuan line in `inkSub`, not ink; the price lines enter on the spoken price, not with the tag.

## brand.md v0.13.5 · 2026-10-29 · Recognisable real car models (owner decision, spec pending)

Owner decision of 2026-10-29, relayed by the main session (✅). Logged in `feedback.md` ("Owner decision · recognisable real car models").

- (Superseded the same day by brand.md v0.13.6: now from No. 011.) **brand.md Open decisions, new row 8:** after No. 011 ships, cars the story names get recognisable silhouettes of the real products (Model 3, BYD Seal features as listed), built in `RealCar` / `SlicedCar`, never downloaded models; the Section look stays. How far "recognisable" goes is open for the brand-director to spec (style-guide § 3) before the scene-builder starts; logos, wordmarks, badges and maker typefaces stay banned.
- **brand.md What we never do:** the "signature shape" ban notes the coming exception; it still holds until the spec exists.
- **Publish copy:** the "cars are generic designs" disclosure line changes for videos that use these cars (publisher).
- brand.md header to v0.13.5.

## v0.13.4 · 2026-10-28 · Profile copy and sourcing rules amended for the new bio and captions (owner answers)

Owner answers of 2026-10-28 to the brand-director's v0.13.3 questions, relayed by the main session (✅). Logged in `feedback.md` ("Profiles and captions"). brand.md header → v0.13.4.

- **brand.md § Channel identity, Profile copy** rewritten: what the visitor gets; one shared bio on all three (`How everyday things secretly work. Cars, roads and gadgets, in 3D.`); YouTube = the bio + at most two short sentences; "in 3D" allowed as a format tag, no other process words; the bio's list allowed, no other lists of three; no schedule, no link. Retires the 2026-10-16 "no 3D" rule, the pronoun split and the chosen texts (kept as history in channel-kit). channel-kit § 3 rule bullets match.
- **YouTube description variant D** live as written; B moved to history.
- **brand.md § Sourcing policy:** full sources and the specific "Illustrative: [what is invented]." line go in the YouTube description; TikTok and Instagram captions, after the hook question, the tease and the poll question, always end with `Sources: YouTube description.`, preceded by `Illustrative scene.` when the video has invented specifics (owner, same day, keeping the publisher brief's condition). channel-kit § 5 TikTok line 7 and Instagram line 6 added.

## v0.13.3 · 2026-10-28 · One bio on all three; a post caption pattern (owner decisions)

Owner decisions of 2026-10-28, relayed by the main session (✅). Logged in `feedback.md` ("Profiles and captions"). Why: ≈ 0.7 followers per 1,000 views (TikTok profile snapshot); the old bio didn't say what a visitor gets.

- **Bio.** channel-kit § 3: variant D, `How everyday things secretly work. Cars, roads and gadgets, in 3D.` (66 characters by count; brief said 67), on TikTok and Instagram and as the YouTube opening. TikTok A and Instagram B kept as history. Header dated.
- **YouTube description.** channel-kit § 3: variant D proposed (221 characters): the bio plus "Each short video picks one thing you use all the time, like the sensor inside your tire or the number on a highway exit, and shows the part you never see." No schedule, no link. Owner to approve; B stays live until then.
- **Caption pattern** (TikTok and Instagram captions; the start of the YouTube description): (1) the hook question; (2) a tease, never the mechanism; (3) the poll question; last, "Illustrative scene." Longer illustrative details stay in the YouTube description. New posts and the four posts getting polls (`ev-charging`, `one-pedal`, `ev-acceleration`, `mile-markers`). No brand file holds captions yet, so it is recorded only in `feedback.md` and here.
- **Not yet amended, owner to confirm:** brand.md § Channel identity, Profile copy ("no 3D", no lists of three, pronouns per platform; the "really up to" shared wording) and § Sourcing policy (the "Illustrative: [what is invented]." line right after the hook, and the "Sources: …" line in the post description).

## v0.13.2 · 2026-10-28 · Polls pick a side: two opposite answers by default (owner decision)

Owner decisions of 2026-10-28, relayed by the main session (✅), refining v0.13.1: "We need to create those questions in a way that pushes people to choose a side", then "That might be more if the question needs it." Logged in `feedback.md` ("All posts: a poll on every publication", § The poll's form). Replaces the publisher brief's earlier "one neutral question, 2 to 4 answers, one may be an opt-out".

- **Question:** about what viewers argue about in that video. Owner lesson the same day: on `one-pedal`, ask directly about regen braking, because that is what the comments argued about.
- **Answers:** two opposite ones by default ("Love it" / "Hate it", "Electric" / "Gas"); more only when the debate really has more camps, each a real side; never a middle option or an opt-out; wording fair to every side; the same answers on every platform and in the pinned-comment emoji fallback. Why two by default: it pushes a choice.
- **More than two answers:** a platform whose sticker takes only two (Instagram [unverified, as relayed]) uses the pinned-comment version. channel-kit.md § 5 Instagram line says so; its other poll lines take the text from `publish.md` and don't describe the answers.
- To watch, added: the vote split (near 50/50 = a real argument).

## v0.13.1 · 2026-10-28 · A poll on every post (owner decision)

Owner decision of 2026-10-28, relayed by the main session (✅): "For all our next publications we should add a poll." Why: the TikTok profile (2026-10-28: 257 followers, 11.5K likes, ≈ 360K+ views over 9 videos, `one-pedal` ≈ 220K of them) turns reach into very few follows (≈ 0.7 per 1,000 views); a poll is one of several levers discussed, the only one decided. Logged in `feedback.md` ("All posts: a poll on every publication" and a profile-snapshot row in § Platform numbers). Whether it moves follows is 🧪. brand.md and style-guide.md unchanged (neither has a posting checklist).

- **Posting checklist.** channel-kit.md § 5: one "on every upload/post/reel" line per platform. YouTube: poll post linking the Short, right after it. TikTok: poll sticker at posting or afterwards on the posted video (owner observation, 2026-10-28, correcting the earlier "before posting only"). Instagram: sticker on the Reel or on a Story sharing it; pinned-comment emoji version where no sticker is available. Poll text comes from `publish.md` (publisher, `.claude/agents/publisher.md` § Task 5, updated by the main session). Header dated.
- **Sticker placement** (brand-director value, 🧪): sky band x 120 to 888, y 288 to 430, never over the captions or the title block (style-guide § 6 and § 7), timed to the last scene only. Why: brand.md § What we never do bars overlay text in the first second other than the title block's question and the captions.
- **Untimable sticker → pinned-comment poll** (✅ owner decision, 2026-10-28, relayed by the main session). If the TikTok or Instagram editor can't time the sticker, the post gets no sticker and uses the pinned-comment emoji poll instead. Why: owner, keep the first second clean. channel-kit § 5 TikTok line 6 and Instagram line 5.
- Platform mechanics come from the publisher brief and are not yet in `brand/research/platforms.md` [unverified].
- First post with a poll: No. 010 `ev-charging`.

## v0.14.1 · 2026-10-28 · No. 011 as built (scene-builder, stills verified)

Values from the scene-builder's No. 011 build to v0.14, relayed by the main session. Facts only; no owner decisions.

- **Teardown grid** (§ 3): **10 × 7 cells (6.0 × 4.2 m)** in an **8.0 × 7.0 m** room (was 8 × 6 in 8.0 × 6.0): 52 near-true-scale parts with exactly 3 of 4 lit didn't fit 48 cells. **Four axle stands**, two per side. **The hatch** is the crossover section at scale 0.9 (no cut hatch exists). Scene `teardown-slice` (The Lab · teardown).
- **"Made by" glow on uncut parts** (§ 5): a thin per-mesh silhouette line plus a per-mesh halo, no single hull per part (a hull read as an orange tile).
- **`LAB[mood].tape`** (§ 1) in `theme.ts`: Day `#9ea4ab`, Night `#5d6372`. **`CHARGE.cloud` `#f5f7f9`** passed the whites check on a Day still (cloud peak 218). **`chargers: false`**: charge port off, no charge level on the modules.
- ChartCard `bars` mode built as specified (§ 6, no change).
- Header updated to v0.14.1.

## v0.14 · 2026-10-28 · No. 011 builds (bars chart, teardown Lab, "made by" glow); No. 010 leftovers

Brand-director decisions for No. 011 `byd-price`'s missing builds N1, N2 and N6 (`src/videos/byd-price/av-script.md`), requested by the main session before the scene-builder starts, plus No. 010 values built without a guide entry (read in `src/theme.ts` `CHARGE` / `EXTRA_B`, `src/three/real/ChargeSite.tsx`, `src/scenes/ChargeSliceScene.tsx`, `src/videos/ev-charging/av-script.md` "As built"). Logged in `feedback.md` ("No. 011 · byd-price: brand decisions before the build"). Owner taste already settled for this video: the Section look, orange only for the hidden system. No code changed; values 🧪.

- **Chart card, bars mode** (N6). style-guide § 6 new row: no orange (cost and price aren't the system); TESLA = hatched reference bar (paper, 3 px ink outline, 45° hatch), BYD = solid ink; 48 px bars, 480 px reference length from a per-row 3 px zero rule at x 168, names in a left column (not at the bar ends, so the gap stays clean), row labels at full width (≤ 30 characters, `TO BUILD · 2023 SEAL`, `TO BUY · 2026 SEAL 06`); **each row on its own scale, nothing running between rows** (no shared rule, gridline or guide; fact-checker's condition); an optional 22 px bar label (`ABOUT HALF`); a square bracket under the subject bar (3 px, 8 px legs), exact when it names a measured stretch (`ABOUT 15% LESS`), sized by eye to 0.75 of the reference when it names an unmeasured part (`PART OF THE REST`); a two-line **footnote** inside the card, Inter 600 **24 px** `inkSub` under a 1 px rule (card grows to 620). Bars grow from the left by a clip reveal, 0.6 s cubic, never a scale. Folded in the fact-checker's "Bars card requirements" (`byd-price/av-script.md`) relayed by the main session mid-task. § 1 Never orange and checklist 2 updated.
- **The Lab, teardown dressing** (N1). § 3 new row: a re-dress of The Lab, not a new location; team name "The Lab · teardown"; **no place label** (place labels name real places only); block scaled to the car (8.0 × 6.0, walls 3.0); `LAB.floor` with a floor-tape grid (new `LAB.tape`, Day `#9ea4ab` / Night `#5d6372`, 0.03 m, 0.6 m cells); the shell on galvanized axle stands; parts real, grouped by system; Day rig, no practicals; nothing readable (no supplier, maker or analyst names); unlit = bought in, no mark, dims × 0.8; an ink scan line, ≈ 1 s; a re-dress inside a video is a `slide`.
- **"Made by" glow** (N1, N2). § 5 new row: a lit part gets an orange cut-edge line (vibration path weight, distance-scaled) and a 25% orange halo, bloomed; its surfaces and its `cut` cut face stay as they are. Replaces the A/V script's "orange edge and cut face" and "panels' faces glow", which would break § 1 Never orange (cut faces). Light-up 0.3 s, surge 45% / +3% / 0.4 s, fade 0.5 s.
- **No. 010 values recorded.** § 1 `CHARGE`: `curb` `#a9a59f`, `clockFace` `#eceae4`, `clockInk` `#24262c`, `cloud` `#f5f7f9` (check with the whites rule; fallback `#eef0f3`), `cloudNight` `#2c3554`. § 3 new row Set props: the curb (2.0 × 0.3 × 0.24 m) and the station clock (r 0.42 m, no numerals, story time, spins in a time-lapse). § 8 new row: the twin-section framings `twin` 38, `stack` 31 (42 for No. 010's frame 0), `wide` 56, `emptyBay` 21; push speed above the cap at these distances noted for the owner. § 8 The cast: `EXTRA_B` (skin `#6e4630`, hair `#1a120c`, trousers `#4b505a`) for a second extra acting separately (owner, No. 010: "two different-looking extras"). `teslaPaint`, `bydPaint` and `ghost` were already in v0.13.
- **Ghost outline:** second use noted (No. 011's US ending); still owner to confirm as a house convention.
- Header updated to v0.14.

## v0.13 · 2026-10-27 · No. 006–010 values recorded; tags on cars, place label, chart card, motion check

Brand-director decisions for values that came up in No. 006 to No. 010 and were built or shipped without a guide entry, plus the owner's motion check of 2026-10-27 (✅). Read in `src/theme.ts`, `src/components/PlaceLabel.tsx`, `src/scenes/HighwaySliceScene.tsx`, `.claude/agents/visual-reviewer.md`, `README.md` (No. 006–010 rows), `src/videos/{mile-markers,ev-charging}/av-script.md`. Logged in `feedback.md` ("No. 006–010: production values for the record"). No code changed; theme edits go to the scene-builder through the main session. Values 🧪; rows marked "owner to confirm" are proposals.

- **Name tags on cars** (No. 010 D5, approved with adjustments). style-guide § 6 new row: leader from the roof's highest point; the square in the car's paint with a **2 px `ink` outline** instead of 3 px `paper` (the pearl grey `#cdd1d4` vanishes on the Day sky with a paper outline); the name as spoken, ≤ 12 characters; in the sky above the lane. No. 010: `BYD` and `TESLA`, both left at x 120, 120 px above the roofs, ≥ 24 px under the title block, 0.3 → 3.8 s. Checklist 7.
- **Place label** (`PlaceLabel`, new). § 6 new row: Inter 700 30 px, 0.14em, ink on a 10 px paper halo; **rule on** (3 px ink, 8 px under, drawing left to right); sky band x 120, top y 300; hold ≥ 1.2 s; counts as the card; places only. Why the rule: the section-drawing sheet title, and it tells the label apart from a callout and a caption. One-idea rule and checklist 8 list it.
- **Status green.** § 1 token row `signalGreen` `#1fcf9f` and a rule row: green-in-life go/on/flowing lights (signal, drag tree, cluster arrows, charge-port light), steady, flat. **Heater pilot lamp = `warning`** (amber in life → the warning rule), as built.
- **Lamps on vehicles.** § 1 row: `tailLight` running, `brakeLit` `#e00208` braking (owner fix No. 006) and rear hazards, front hazards and light bars `warning`, 1.4 Hz on the video clock; three reds by job, `brakeLit`'s 10° band clearance accepted (owner-asked, small lit lens). `signalRed` / `brakeLit` and `sneaker` added to the constant table.
- **Palettes.** § 1 Location palettes gains wet `HIGHWAY` (No. 008), `CITY` (No. 006), `CAR.bodies.friend` (No. 008), `REAL.rust` / `rustDark` / `copper` (No. 006), `RACE` (No. 007) and `CHARGE` (No. 010). **No. 010 values:** `teslaPaint` `#cdd1d4` ✓, `bydPaint` `#34465c` ✓, `coolant` `#8ea3ad` ✓, `coolantFlow` `#d9e3e7` ✓, port light `signalGreen` `#1fcf9f` ✓, **`bayGreen` changed `#7f9480` → `#5c9d72`** (the as-built 9% sage didn't read as a green bay; China bays only), **new `CHARGE.ghost` `#24262c`** (Day; Night uses `cut`).
- **Open checks settled.** `lineYellow` `#d6bc45` stays as a named exception (flat paint, no warm practical on the Night highway); fallback `#c9b65a` (under the band's saturation floor) if a Night still reads below 45°. `tailLight` stays separate from `leakRed`; aliasing still the owner's call.
- **Subject pool at Night** (`carLight`). § 2 new row: the Night `figureLight` `#9fb3e8` on the subject only, × ≈ 1.8, never warm, no visible source.
- **Real road furniture.** § 3 new row: MUTCD shapes and sizes, generic legends; D10-3 marker 12 × 24 / 36 / 48 in by digit count, stacked digits, one post, 4 ft up; exit guide sign with the `EXIT nn` plaque. **Overpass 700** is now the road-sign face (§ 6 fonts), live from No. 009; No. 005 keeps Inter.
- **Ghost outline.** § 3 new row: dashed 3 px, dash 16 / gap 10 px, no fill, draws 0.8 s, fades 0.7 s; "not here". Owner to confirm as a house convention.
- **The ruler.** § 5 new row: a count along the ground as the system, orange, on the ground in road space, ticks, zero node on the cut face, weight `VIB_R` scaled with camera distance; numbers stay in ink counters.
- **Detail box for an off-screen screen** (No. 009 dispatch map). § 6 new row: allowed when the voice names who sees it; leader to the on-screen source; generic; orange only for the system's mark.
- **Chart card** (No. 007; curves No. 010). § 6 new row: shape-only, one tick, no axis numbers, the orange data line as the system's mark, ink end labels. § 1 "Never orange" row now lists the in-card marks (ad edge, chart line, dispatch circle). Checklist 2.
- **The motion check** (✅ owner decision 2026-10-27). § 8 motion principle 4 and checklist 14: wheels forward (≤ half a spoke gap a frame), props move with the world, the same object across cuts, stopped-car lamps. **Open for the owner:** scope of "stopped cars show lit brake or hazard lamps" against No. 010's parked, lamps-off cars; recommended: road stops and breakdowns only.
- Header updated to v0.13.

## v0.12 · 2026-10-18 · Location palettes, the "feel it" shake, louder subject sounds, self-made SFX (owner decisions, No. 005)

Owner decisions of 2026-10-18 from No. 005 `rumble-strips`, relayed by the main session (✅); values 🧪, read in `src/theme.ts`, `src/scenes/{HighwaySliceScene,CarSliceScene}.tsx`, `src/three/section/SectionCamera.tsx`, `src/components/soundMix.ts`, `src/videos/rumble-strips/spec.ts`, `scripts/sfx-rumble.mjs`. Logged in `feedback.md` ("No. 005 · rumble-strips: owner decisions in production"). No code changed.

- **Location palettes.** style-guide § 1: new "Location palettes" table with `HIGHWAY` (asphalt, wheel paths, milled faces, white and yellow lines `#d6bc45`, gravel, grass, galvanized steel, sign green `#14674a` / white `#e9e8e2` / ink `#18191c`, tail light `#e23a52` and lens `#6a1d29`, headlight `#eef1ff`), `DESERT` (sand, sandDark, scrub, scrubDark, all ≤ 21% saturation) and `CAST_NEUTRAL` (`#8f8b85` / `#57544f`). None in the reserved band. Two open checks written under the table: `lineYellow` clears the band by only 9° (the palette's clearance is 15°) at 64% saturation; `tailLight` (351°) is a near-twin of `leakRed` (350°). Both for the owner; values unchanged.
- **Grey extra behind tinted glass.** style-guide § 8 The cast: a row for `CAST_NEUTRAL` and an exception to "clothes stay cool or mid hues": the slate extra read as YOU's blue through tinted glass at Night; a 4%-saturation warm grey doesn't.
- **Vibration path radius.** style-guide § 5 Glow: core 0.0225 (1.25 × 0.018), halo at the same ratio, so the path reads at phone size. Owner-approved.
- **The "feel it" shake** (new motion tool). style-guide § 8 new row: seeded per-frame tremble of the camera and the object, only while the cause is happening; a kick on onset (up to 3×, 0.35 s); music dips ≈ 11 dB; never in slow motion; captions and 2D overlays stay still; as-built amplitudes and the props (`shake`, `shakeKick`, `music.dips`). § 5 "Only the system moves fast" and § 8 motion principle 3 name it as the one exception. Checklist 14. Why: owner, "I want viewer to feel it… the animation should be in a way the viewer can feel it or remember it"; after preview 5, "It's perfect".
- **Effect sound level exception.** style-guide § 9 SFX: when the sound is the story's subject, it may sit ≈ 10 dB under the voice (No. 005 rumble), with the music dipped; not a new default, 12 to 19 dB stays. No. 005's levels added to "Used so far". Why: owner, "much higher and much more brutal".
- **Self-made SFX first for physical sounds** (lesson). style-guide § 9 new "Making a sound" row: try a physics-based self-made sound (`yarn sfx:click`, `yarn sfx:rumble`) before a generator. Why: the ElevenLabs roar takes sounded "like a phone vibrating on a wood table"; the self-made rumble won.
- **Pending asset.** style-guide § 6 fonts: highway sign lettering in Overpass (OFL), approved, deferred to the next highway video; No. 005 signs use Inter 700.
- Header updated to v0.12.

## v0.11.3 · 2026-10-18 · Real red indicators (owner decision, No. 004 onward)

Owner decision of 2026-10-18, relayed by the main session (✅); value 🧪. Logged in `feedback.md` ("No. 004 · water-meter: leak-indicator colour").

- **Real red indicators.** Real water meters have a red leak-indicator triangle. style-guide § 1: proposed token `leakRed` (constant table) and a new "Real red indicators" row: only red parts that are red on the real object (meter leak triangles and similar), flat (no emissive, no glow, bloom, halo, spill or dots), orange instead if the part is the hidden system. Value `#ef3957` (350°, 85%, 58%), reusing `channels.red` so the brand has one red: 28° from `#ff5b14`, 65° from `warning`, 18° below the reserved band. The A/V script's `#c62828` (0°) was adjusted: only 8° from the band and 18° from orange. Fallback `#c8203d` (same hue, darker), owner's call. § 2 Bloom row, checklist 2, header.

## v0.11.2 · 2026-10-18 · Music from the start, real-world SFX, posting time (owner decisions)

Owner decisions of 2026-10-18, relayed by the main session (✅); values 🧪. Logged in `feedback.md` ("No. 003 · elevator-dispatch: sound decisions" and § Platform numbers). v0.11.1 is unchanged otherwise.

- **Music start.** style-guide § 9 Music: "enters after the hook (≥ 3 s)" → the music is present from the start and may begin at frame 0 with a short fade-in (No. 003: `startAt: 0, fadeIn: 1.5`). Why: on No. 003 the owner found the 3 s entry too late; the opening felt thin. Kept: about 9 dB under the dry voice, steady, no duck; the music ends in silence on the last frame (the loop), now written into the row (it was applied in the specs but not stated in § 9). Principle ✅, values 🧪.
- **SFX.** style-guide § 9 SFX: "Three sounds only … nothing else beyond click, hum and whoosh" → short real-world sounds for actions seen on screen (button presses, doors, chimes, air), each about 12 to 19 dB under the voice, no music stingers, risers or impacts, never under a statement card. Click, hum (about 20 dB under, unchanged) and whoosh stay as standing sounds. The values used so far are listed as examples (file-level spec offsets, with dB under the voice computed from the LUFS noted in the specs): No. 002 hiss −28, chime −10; No. 003 press −15/−18, ding −10/−12, doors −18.5. Why: the row lagged behind practice; No. 002 shipped hiss and chime and No. 003 press, ding and doors, all owner-approved. Principle ✅, values 🧪.
- **Posting time.** `feedback.md` § Platform numbers gains a "Posted at" column (date, local time, time zone); No. 002 filled as "2026-10-17, about 19:00, owner's local time (America/Chicago?)", time zone unconfirmed. Posting time is now a variable to test: a midday post against an evening post over the next videos. No rule changes.
- style-guide header updated to v0.11.2.

## v0.11.1 · 2026-10-16 · Warning lights in yellow (owner decision, No. 002 onward)

Owner decision of 2026-10-16, relayed by the main session (✅); value 🧪. Logged in `feedback.md` ("No. 002 · tire-sensor: warning-light colour"). v0.11 is committed and unchanged.

- **Warning lights.** Real dashboard lamps such as the tire-pressure light are amber, which would read as the system. Dashboard warning icons and device indicator lights are now a **warning yellow**, distinct from `orange`; orange stays the hidden system (in No. 002, the tire sensor's radio signal). style-guide § 1: proposed token `warning` `#eedd2b` (constant table), reusing the light channels' yellow so the brand has one yellow (55°: 37° from `#ff5b14`, 15° above the reserved band, the channel palette's clearance); fallback `#f2c81f` (48°) if it reads too lemon, owner's call. New "Warning lights" row next to the orange rule: where it applies, unlit = `ledOff`, flat emissive, no bloom, halo, spill, dots or flicker; an indicator is orange only when it is the hidden system (§ 5 Bleed). The tire-pressure icon is a tire cross-section, so it fits The Section; drawn as the generic symbol. "No orange on non-system parts" row points to it; § 2 Bloom row; checklist 2; header. The ISO 2575 colour note is not yet checked in `brand/research/`.

## v0.11 · 2026-10-16 · Coloured light channels, surprise-first opening, American spelling (owner decisions, No. 002 onward)

Owner decisions of 2026-10-16, relayed by the main session (✅); values 🧪. Logged in `feedback.md` ("No. 002 · fiber-sharing: owner decisions before production"). v0.10.1 is committed and unchanged.

- **Coloured light channels (WDM).** No. 002 shows many wavelengths sharing one fibre as distinct colours, not all orange. style-guide § 1: the orange rule gains one exception; new "Light channels" row: only inside a fibre or optical component (wavelength channels, mux/demux, splitter), in 3D or a detail box; never on people, set, screens or any overlay; no spill light. Palette (proposed tokens `channels.*`, both moods): red `#ef3957`, the viewer's channel `orange` `#ff5b14`, yellow `#eedd2b`, lime `#85d926`, cyan `#20ccdf`, violet `#7c5ff2`, magenta `#e444b4`; all non-orange hues outside the reserved band (≥ 15° from it) and ≥ 25° from the cast tops (YOU 225°, FRIEND 150°, MOM 283°). Channels run inside a dark fibre body so they read on Day. Only the viewer's channel blooms and carries the dots (§ 2 Bloom row updated). Accuracy: the light is infrared, so the video says once that the colours are added (preferred: one voice clause by the scriptwriter; fallback: a callout `COLORS ADDED`). brand.md § What we never do, orange row: exception noted. Checklist 2.
- **Surprise-first opening** (supersedes the black screen-bookend opening for new videos; No. 001 keeps its opening). Source: `docs/playbook.md` backlog "Hook in the first second". Frame 0 is the surprise image (not black, no fade-in); the first spoken sentence carries the surprise, from ≈ 0.3 s; the question is spoken by ≈ 5 to 6 s; the title block shows the question from frame 0 (line 1 the question, line 2 `NO. 002 · THE [PLACE] · time`), holding to ≈ 0.8 s after it is spoken; the last shot ends on frame 0's picture so the replay loops. The screen-bookend is an optional tool: on a new video without the black; a black pair on a new video is the owner's call. brand.md § Hook patterns (rewritten; examples 1 and 3 now carry the surprise in the first sentence), § Structure steps 1, 2, 3, 7 and "The loop" paragraph (replaces "The screen-bookend loop"), § Naming Format, Title, Timing rows, § What we never do first-second row (title question and first-line captions allowed). style-guide § 6 Title block, § 8 new "The opening and the loop" table, screen-bookend section marked optional, Cuts row, § 9 SFX click, checklist 1, 5, 12.
- **Spelling.** brand.md had no spelling rule; new § Voice row: American English in voice, captions, on-screen text and post copy ("fiber", "color"); brand docs and code keep their own spelling.

## v0.10.1 · 2026-10-15 · Channel identity, handle correction, channel kit (owner decisions)

Owner decisions relayed by the main session (✅). No `feedback.md` entry (nothing published).

- **Handle correction.** `@secretlyworks` is not free on YouTube and `@howitsecretlyworks` is taken there; v0.3 to v0.10 recorded both as owned, which was wrong. brand.md § Name: the handle is unsettled, placeholder `@[HANDLE]`; rule: one identical handle on all three, the first free from `@secretly.works`, `@thesecretlyworks`, `@secretlyworkshq`, `@secretly_works`. The name "Secretly Works" is unchanged.
- **New § Channel identity** in brand.md: profile picture = symbol only (✅); lockup for the banner (✅); no schedule, no link (✅); bio promise line and the AI-voice line in the YouTube About text (🧪).
- **New `channel-kit.md`:** platform specs with sources (YouTube official; TikTok and Instagram limits unverified, help centres not loadable), handle candidates with format rules, copy in two variants per bio with a recommendation, asset list for the scene-builder, setup checklist. The v0.8 Instagram bio proposal in § Name is superseded by it.

Added 2026-10-16 (owner decisions relayed by the main session, ✅; values 🧪):

- **Title timing on wake-bookend openings.** The title block enters at ≈ 2.8 s, after the wake finishes, instead of ≈ 1.0 s. Why: at 1.0 s it sat on the wake moment. The ≈ 1.0 s default stays for any other opening. style-guide § 6 title block, § 8 first-app-action row, checklist 5 and 12, header; brand.md § Hook patterns, § Structure step 1 and § Naming of videos, Timing row.
- **Screen placement on full-frame screens** (closes the v0.9 open item in style-guide § 8). On the bookends' lock and app screens (e.g. lock, search): nothing readable above y 520, lock clock centred at ≈ y 640, all text at x ≤ 888 with long rows truncated. Why: above y 520 is the title block's zone and the top rail; past x 888 is the right rail. New § 8 "Screen placement" row; checklist 12. The kit as read in v0.9 (lock clock ≈ y 560, status-bar clock ≈ y 67) breaks it until changed (scene-builder).
- **Handle candidates.** `@secretly.works` is unavailable and dropped. `@thesecretlyworks` (owner found it available) is first, pending confirmation on all three; fallbacks in order `@secretlyworkshq`, `@secretly_works`. Placeholder `@[HANDLE]` stays until confirmed. brand.md § Name; channel-kit.md § 2 (table, notes, why-this-order) and § 5 (before-you-start step 1, TikTok step 2: the period caveat removed).
- **Handle confirmed: `@thesecretlyworks`** (✅ owner decision; the owner checked it is free on YouTube, TikTok and Instagram). Supersedes the "Handle candidates" bullet above. Every `@[HANDLE]` replaced; "pending confirmation" removed; `@secretlyworkshq` and `@secretly_works` kept only as a one-line history. The existing Instagram account is renamed from `@secretlyworks` to `@thesecretlyworks`; the owner accepts that the old handle is freed. brand.md § Name (text and table); channel-kit.md header, § 2 (rewritten: one handle, rename note, history), § 3 (three handle lines), § 5 (before-you-start step 1, YouTube step 2, TikTok step 2, Instagram step 1 with the rename and the freed handle).
- **Logo: mark C, the "S-line", in the Night palette** (✅ owner decision; values 🧪). A hatched rounded square with an orange S-shaped hidden path, a dot at each end, on a dark navy ground; full spec from the comparison canvas (viewBox 120: square 18/18/84, rx 12, ink stroke 3.6; path `M80 38 C 40 26, 36 54, 60 60 S 82 92, 40 84`, stroke 7.5, round caps; dots r 5.5 at (80, 38) and (40, 84); ground `#0d1322`, hatch `#111830` with `#3a4668` lines, 6-unit pattern at 45°, width 1.8; ink `#efe9df`; line `#ff5b14`, the one `orange` of style-guide § 1; the canvas's `#ff6a24` was a comparison value, not an owner choice). Why: the orange line is the hidden system, consistent with "orange is reserved for the hidden system"; settles the brand-director's earlier "no orange in the symbol" suggestion in favour of the owner's choice. brand.md § Channel identity (new Logo row; profile-picture row no longer "pending"); channel-kit.md header and § 4 (new "The symbol" spec, the assets are made from it; export checks on hatch width and the circle crop).
- **No "Full sources: link in profile"** (✅ owner decision) until a profile link exists; the one-line "Sources: …" stays. Why: the profiles have no link (brand.md § Channel identity), so the line would point at nothing. Comes back when a link exists. brand.md § Sourcing policy; style-guide § 10 Description row and header; `research/platforms.md` rule 14 (a dated note added, research unchanged).
- **YouTube watermark** (✅ owner decision): `watermark-300.png` is made but stays switched off on YouTube until long-form exists. Why: it shows only in landscape view, so Shorts wouldn't carry it; CLAUDE.md: no on-screen watermark. brand.md § Channel identity (new row); channel-kit.md § 1 (recommendation → decision), § 4 asset row, § 5 YouTube step 4.
- **The y 520 rule applies only to full-frame bookend screens**, not to the § 6 full-frame screen box (✅ owner decision; closes the question). The box keeps its own layout (DETAIL tab at y 288). style-guide § 8 Screen placement row, § 6 Full-frame screen row, checklist 12, header.
- **Shadows: soft PCF** (value change by the scene-builder, pilot fix pass; 🧪). Canvas `shadows="soft"`, 1024 map, bias −0.0004 (was −0.0006), normalBias 0.02 (was 0.01); the "radius 4" value dropped. Why: plain PCF with radius 4 drew shadow edges as stepped bands at close range; § 2 already asked for "PCF soft, 1024". style-guide § 2 Shadows row, § 4 note under the light table, header.
- **X-ray opening timing and edge** (value change by the scene-builder, pilot fix pass; 🧪). Opens top-down over a fixed 0.45 s (`XRAY_OPEN`), finishing exactly when the route enters the wall, instead of "≈ 10% of the route's length"; reveal edge is a hatched cut-face band 0.055 units wide with an ink line on both edges; the cavity is shaded, its soft front fading in from the wall colour. Why: at pilot route speed 10% was ≈ 2 frames and read as a pop. style-guide § 5 X-ray row, header.

Added 2026-10-16 (owner feedback, `feedback.md` "Channel profiles", and owner decisions relayed by the main session; ✅):

- **Profile copy: what, not how.** Owner: the § 3 descriptions were "just like AI"; describe the channel "like a passionate [person] ... what we do and not how". brand.md § Channel identity: the "Bio promise" row (every bio opens with "How everyday things secretly work, cut open in 3D." and says the videos are sourced) is replaced by a "Profile copy" row (spoken voice, what the viewer gets, no 3D / sourcing / AI voice / style / process; YouTube 1 to 3 sentences + one optional "what's coming" line; bios one line, two at most; banned phrases listed). The "Disclosure" row drops the AI-voice line from the YouTube About text; the per-post AI label on all three platforms still applies (§ Sourcing policy, channel-kit § 5). channel-kit.md header and § 3 rewritten: rules at the top, 3 options per field (YouTube description, TikTok bio, Instagram name and bio). Keywords and the trailer note unchanged.
- **Profile texts chosen** (✅ owner choice): YouTube description B ("we"), TikTok bio A ("I"), Instagram name A ("Secretly Works") and bio B (no pronoun). The mixed pronouns are the owner's choice, not an inconsistency. channel-kit.md § 3: the chosen entries are marked ✅ and listed first in each field, the other variants are kept as alternatives with their letters, and the "One channel" rule is updated. brand.md § Channel identity, Profile copy row: the chosen texts and the pronoun note are added; the status for the texts is now ✅.
- **Banner tagline** (✅ owner decision): the YouTube banner carries "How everyday things secretly work" in Inter 600 under the wordmark, inside the safe area (x 507 to 2053, y 508 to 931 at 2560 × 1440). It is the only readable text besides the lockup. This replaces "the lockup is the only readable thing" and "no tagline unless the owner asks". brand.md § Channel identity, Lockup row; channel-kit.md § 4 (banner asset row and the banner paragraph).
- **Research only, no rule changed:** new `research/music-licensing.md` (owner-approved check, nothing generated or spent): ElevenLabs Music output is commercially licensed on every paid tier, and Creator+ is recommended because Starter prohibits "Music Streaming Distribution"; Sound Effects output is licensed on any paid tier, inside the video only; no attribution; nothing found registering output in Content ID. So it meets style-guide § 9's "generator" condition as written, with 8 conditions listed there.
- **Whoosh on slide transitions** (✅ owner decision, approved plan; values 🧪): one short, airy whoosh at the start of a slide transition, about 12 to 18 dB under the voice, no impacts or risers. "Nothing else" now means nothing beyond click, hum and whoosh. The row names the implementation (spec `music` field; `sfx` overlay with `cue`/`at`/`volume` dB/`loop`/`fade`/`until`, README "Sound"). Why: part of the owner-approved sound plan (relayed by the main session). style-guide § 9 SFX row. Also `research/music-licensing.md` condition 4: the generation record is the tooling's automatic `src/videos/<slug>/audio-log.md` (one per video, committed, append-only: date, plan, endpoint, model, prompt, length, path, sha256) instead of per-track entries in `public/assets/LICENSES.md`, which gets one pointer line per video.
- **Sound mix: one mix on headphones** (✅ owner decision, `feedback.md` "No. 001 sound mix"; numbers 🧪). On headphones the narrator sounded "isolated" from the music, "the only thing in my ears". A room reverb on the voice (`yarn voice:room`, light and strong) was rejected: "use the voice without the room". The fix was level, confirmed "right" by the owner. style-guide § 9 Music row: "16 to 20 dB under the voice" → **about 9 dB under the voice, steady (no duck), set by measured loudness**; spec `level ≈ (voice LUFS − 9) − track LUFS`, `duckDb: 0` (No. 001: `music: {level: -14, duckDb: 0}`, take C ≈ −16.7 LUFS, voice ≈ −22 LUFS); the reference bed style is the chosen prompt in `src/videos/phone-listening/music.txt`. Kept: enters after the hook (≥ 3 s), no drums, no competing melody. New **Voice processing** row: the voice stays dry, `yarn voice:room` is not the default. SFX row: the lock click is self-made (synthesised, no licence; ElevenLabs gave near-silent clicks twice), hum and whoosh are ElevenLabs; No. 001's spec offsets recorded (whoosh −18 dB, hum −32 dB, click −6 dB, file-level, not measured against the voice). Header.

## v0.10 · 2026-10-15 · Objects realistic, people stylized (owner decisions, realism test)

From the realism test (stills in `out/review/realism-test/`, code in `src/three/real/`): a realistic phone (aluminium frame, glass, live screen) and a teardown cut-away (PCB, chips, a labelled battery, a "Wake-word chip" tag) next to the stylized cast. Owner decisions relayed by the main session (✅); no `feedback.md` entry (nothing published). Built values read in `src/theme.ts` (`REAL`), `src/three/real/{RealPhone,PhoneTeardown}.tsx`, `useStudioEnv.ts` and `public/assets/LICENSES.md`; values stay 🧪, unbuilt ones are placeholders.

- **Objects realistic, people stylized.** World objects as real as we can build them (physically based glass, metal, fabric, wood; CC0 HDRI reflections; contact shadows / AO; real detail where the eye goes, teardowns like repair photos); the cast stays stylized; cut faces, ink edges and hatch stay. brand.md header, § Promise difference 3, § What we never do (realistic-humans row). style-guide header, look-in-one-line, § 1 "Realistic object colours" (`REAL` tokens), § 2 "Environment reflections" (Poly Haven *Studio Small 09* 1k, gain 1.5, reflections only, never a background) and "Contact shadows and ambient occlusion" (N8AO, not built), § 3 new rows (the rule; materials split into objects, with the built PBR values, and cast/cut faces; rounded edges and shadows split cast vs objects), object cut-away inside now realistic, living-room furniture marked "to rebuild realistically", The Lab equipment realistic. Checklist 15.
- **Glints allowed.** Small pure-white glints on glass and metal edges may reach 255 and are masked from the whites check; no surface may be pure white. Placeholder for "small" (🧪): ≤ 12 px across each, ≤ 0.5% of the object's pixels. brand.md § What we never do (clipped whites row); style-guide § 1 pure-white row, § 2 whites row, checklist 4.
- **Generic devices.** No logos, wordmarks or makers' signature shapes (phone camera = one plain strip; invented chip legends). brand.md § What we never do (new row); style-guide § 3 new row, checklist 3.
- **Assets.** CC0 first (Poly Haven, ambientCG); every asset in `public/assets/LICENSES.md` with source, author, licence; credits in the post description when the licence requires them; new dependencies only with owner approval (N8AO approved). brand.md § What we never do (new row); style-guide § 3 new row, § 10 Description, checklist 15.
- **No orange on non-system parts** of realistic objects (flex cables black `#1b1c1f`; gold pads `#b49f5e` below 60% saturation; no amber LEDs or labels). brand.md § What we never do (orange row); style-guide § 1 new row, checklist 2.
- **Also:** missing Why cells filled in style-guide § 3 (materials, rounded edges, shadows, screen light).

**Seen on `after-3-teardown-lit.png`, for the scene-builder (not decided here):** the "Wake-word chip" tag is a grey filled box in sentence case, not the § 6 callout (uppercase Inter 700 26 px label on a 10 px `paper` halo, no card, elbow leader). The cloud-and-lock icon above the phone is outside any § 6 overlay type.

## v0.9.1 · 2026-10-15 · Motion, glides, single-render time passes, object cut-aways, The Lab (owner decisions, pilot rough-cut review)

From the owner's Studio review of the pilot's rough cut (`feedback.md`, No. 001 rough-cut review): the night→day blend made FRIEND jump; hard cuts between framings felt abrupt; the research and wake-word part showed two still mannequins ("kind of boring"). Decisions ✅ owner approved, relayed by the main session; values not built yet are 🧪 placeholders.

- **Motion rule** (style-guide § 8 Motion principles item 0; brand.md § Structure "Show it moving", step 4): something meaningful moves at least every 2 to 3 s; never two people sitting still under narration; every mechanism beat gets a visual of that mechanism. "Meaningful" defined (🧪) so it can be checked: gestures, glides, the route, a mechanism animating, a card entering; breathing, blinks and drift don't count. New checklist 14 (Studio playback).
- **Camera** (§ 8): new **Glide** row, framing changes within a location are a 0.5 to 1.0 s cubic in-out glide that may exceed the push limit during the glide only (placeholders: default 0.8 s, one per scene). Cuts row: hard cuts rare (placeholder ≤ 2 per video outside the bookend lock). Easing row: glides cubic, slow moves sine. Checklist 13.
- **Time passes** (§ 4, § 8 Auto rule): render once and blend light and colour; never double-expose moving things. Replaces v0.9's crossfade of two renders. The auto rule's "same location, other mood → `dissolve`" becomes a time-passes beat. Checklist 4.
- **Object cut-aways** (§ 3, new row): the section look on objects (a phone cut open, its wake-word chip); non-system glows not orange (placeholder `screenLight` or none).
- **The Lab** (§ 3, new row; § 8 Follow the line; brand.md § Structure, step 2, § What we never do reuse row): a recurring cut-open test room for "researchers found" beats (bench of phones, robot arms, test rig, set counter, wall meter), re-dressed per study; `follow`/`slide` between locations; a legible set counter counts as the frame's one card (🧪).
- **Also:** missing Why cells filled for § 8 Scene length, Easing and Determinism (table had 3 of 4 columns).

- **Object cut-aways vs the X-ray cap** (style-guide § 5, § 3, ✅ owner decision): object cut-aways do not count toward the X-ray's once-per-video limit; a cut-away shows an object opened up, the X-ray shows the hidden system running through the set.

**Code to change (scene-builder, not done here):** time passes as a single render with blended lights and palette (today two renders crossfaded); the auto rule's same-location mood change; a glide between framings; object cut-aways; The Lab slice and a real `follow` move onto it.

## v0.9 · 2026-10-15 · No source text on screen, company names, production process (owner decisions); build stage 3 as built

Owner decisions relayed by the main session (✅). No `feedback.md` entry (nothing published). Stage 3 values were read in `src/scenes/{transitions.ts,SectionRoomScene.tsx}`, `src/Explainer.tsx`, `src/three/section/LivingRoomSlice.tsx`, `src/components/{FullScreen,ScreenBookend,Callout,Statement,TitleBlock,DetailBox}.tsx`, `src/components/screenKit.ts` and `src/theme.ts`; they stay 🧪.

**Owner decisions**
- **No source lines on screen.** The v0.6 attribution line is retired ("it felt like a footnote in the middle of a story"); Open decision 5 is reversed to "never on screen" (number not reused). Sources go in the post description only; spoken attribution stays where the story needs it ("researchers found", "FTC staff said"). brand.md: § Open decisions note, § Promise difference 2, § Voice "Attribute, don't hedge", § Structure one-idea-per-frame and step 6, § Sourcing policy (on-screen bullet replaced by three bullets), § What we never do (the attribution-limits row becomes "any source text on screen"). style-guide.md: § 1 `inkSub` and never-orange list, § 6 fonts, attribution row replaced by a "No source text" row, statement row, one-idea-per-frame paragraph, § 7 attribution row removed, checklist 5 and 9.
- **Company names in the voice:** allowed when the story is about that company's own product ("Apple and Google say that check runs on the phone"), never as a citation. New § Voice row "Company names" and a § What we never do row. Replaces the earlier "no companies named in the script" rule, which lived outside `brand/` (brand.md had no row for it).
- **Production process:** rough cut → polish beat by beat → final pass, owner reviews in Remotion Studio. brand.md § Structure now points to `docs/playbook.md` § How a video is built (not copied).

**Stage 3 as built (style-guide.md)**
- **§ 8 Transitions:** five named kinds: `continue` (same location and mood, the camera carries on, no dissolve), `slide` (18 frames, next slice from below, cubic), `follow` (24 frames, sine, orange seam line; a 2D stand-in until a second slice exists), `dissolve` (12 frames, legacy), `cut`; the auto rule written out. Cuts-and-dissolves row: the time-passes beat no longer uses the dissolve.
- **§ 4 Time passes:** a 1.5 s cubic crossfade of the two moods' renders of the same slice (`moodFrom` → `mood`, from `moodAt`, default 0.3 s); continues the camera; captions switch colour at the midpoint.
- **§ 8 Screen bookends** as built: frame 0 black, dark 0.2 s, wake 8 frames; screen drawn at full frame height (≈ 1008 × 1920, black sides); pull-back default 1.4 s (42 frames) to the scene framing from camera distance 2.6, the 2D screen fading into the 3D phone over the last 30%; push-in default 1.2 s (36 frames); lock in 2 frames at 6 frames before the end, 4-frame black hold. Checklist 12.
- **§ 6 Full-frame screen:** own row: paper scrim 94%, the detail box enlarged to y 288 to ≈ 1030 (≈ 378 × 714 px), whole screen from the kit, 10-frame fade with 8 px rise, captions continue, counts as the one card; cap of 2 unchanged (bookends excluded). § 7 row added.
- **§ 8 Phone-screen kit:** `assistant` app (mic button, waveform, one line); mic indicator `mic: 'on'` neutral, `'system'` orange (the second allowed "system's mark" on a screen). Checklist 2.
- **§ 5 X-ray:** now a section cut-away in the wall face (clipped rectangle, hatched reveal edges, ink line, dark cavity), opening top-down; replaces v0.8's fade to 30% opacity. New token `cavity` (Night `#0a0e1a`, Day `#7d7870`) in § 1. Checklist 10.
- **§ 6 / § 7 Sky band:** statement top edge y 288; two-line statements use `place: 'low'`. Checklist 5.
- **§ 6 Callout:** restyled as a drawing label: ink elbow leader, Inter 700 26 px uppercase with a 10 px paper halo, no card, optional Inter 600 20 px sub-line. Checklist 8.
- **§ 5 Route ends:** start and end hidden inside the bodies, coming out behind the shoulders, low arc just above the router; never crosses a body. Checklist 10.

**Also corrected to match the code (values, not in the brief):** title block top edge y 340 → **300** (the code's comment: at 340 it sat on the cut wall tops); path core `orange` in both moods (was Night `orangeCore`; `orangeCore` row marked unused); runner light 1.2 / reach 1.6 → **0.6 / 1.2**.

**Open, recorded in the guide (not decided here):**
- Night `cavity` `#0a0e1a` is darker than Night `bg` `#0d1322`, against § 2 "nothing darker than `bg`". To check on a Night still; keep as a named exception or lift it (owner's call).
- Opening-screen layout: the kit's lock-screen clock sits at ≈ y 560 (digits from ≈ y 460) and app screens' status-bar clock at ≈ y 67, against § 8 "clock ≈ y 640, nothing readable above y 520". To check on a still against the title block.
- Pull-back default 1.4 s (42 frames) vs the guide's 18 to 30 frames: kept as a 🧪 target to judge in the Studio.

## v0.8.2 · 2026-10-15 · The screen-bookend loop (owner decision)

Relayed by the main session as an approved owner decision (✅). No `feedback.md` entry (nothing published). Why: the pilot opened at Night and ended in Day, so the replay jumped; a screen bookend is mood-agnostic, reusable for every story, and frames each video on the phone where the "secret" shows up.

- **New standard opening and ending, ✅ owner decision:** every video opens on a full-frame phone screen waking (black → lock screen → the first app action), then the camera pulls back out of the screen into the slice; it ends on a phone locking (soft click, screen goes black). First and last frames both black. **Replaces** v0.8's loop (the last shot's phone locks in the slice and the cut, or a 12-frame dissolve with no phone, lands on the room's first frame).
- **brand.md:** § Hook patterns (first frame is now the black screen waking, not the slice; title block still at ≈ 1 s; black-first-frame swipe cost is 🧪); § Structure steps 1 and 7 and a new "screen-bookend loop" paragraph (the loop-line rule kept, 🧪); § Naming Timing why; § What we never do: "any text in the first second" → "any overlay text", the phone's own UI in the bookend is picture; the camera-inside-a-room row notes the bookend screen is a 2D layer.
- **style-guide.md:** § 8 "Intro and loop" → "The screen-bookend loop" with beat values (all 🧪): wake 0.3 s, lock screen lit by ≈ 0.4 s with the clock at ≈ y 640 and nothing readable above y 520, first app action ≈ 1.0 to 2.2 s, pull-back 18 to 30 frames with the screen shrinking onto its phone while the camera goes couch → wide (wide by ≈ 3 s), closing push-in in the last ≈ 1.5 s, lock in 2 frames, ≥ 4 black frames; § 8 cuts and dissolves (the dissolve no longer serves the loop; missing Why cell filled); § 1 pure black allowed for the off screen; § 6 title block enters over the opening screen; § 6 detail box full-frame cap; § 9 SFX "dry" → "soft" click at the end; checklist 1, 3, 5, 12.
- **Full-frame screen cap:** the bookends **do not count** toward "a full-frame screen at most twice per video". Brand-director's call: the cap guards the slice as the frame during the story; the bookends are the fixed frame of every video, and counting them would spend the whole allowance on structure and leave none for the story's key screen.
- **Reconciled, not changed:** "Outside, always" and "Phones face their owners" stay ✅ as they were: the full-frame screen is a 2D layer that shrinks onto (or grows from) its phone while the 3D camera stays outside the slice.

## v0.8.1 · 2026-10-15 · Build stages 1 and 2a folded into the style guide (owner approved, commit b501dde)

Relayed by the main session: the owner approved stages 1 (slice, cast, moods) and 2a (framing and overlays) of The Section. Every value below was read in `src/theme.ts`, `src/three/section/{SectionCamera,cutLook,LivingRoomSlice,SectionStage,Figure}.tsx`, `src/scenes/SectionRoomScene.tsx` and `src/components/{Captions,NameTag,TitleBlock,Statement,Attribution}.tsx`, `sectionStyle.ts`. Values stay 🧪 unless noted. Only `style-guide.md` changes.

- **§ 3 The section look, ✅ owner decision:** an ink line on every cut edge (`cutLine #24262c`, 0.011 units, unlit) and a fine 45° hatch on cut faces (spacing 0.045, lines 13% darker, fading below ≈ 2 px); nothing else outlined. New rows: what the wide frame shows; the living-room furniture as built.
- **§ 3, § 7, § 8 Camera vs focal band, resolved for the framing (✅ owner decision, stage 2a):** wide framing look (−0.2, 1.36, 0), distance 12.75, camera ≈ (5.45, 4.90, 10.87), fov 26°; couch framing look (0, 0.92, −0.45), distance 8.0. Sky band to ≈ y 430, room ≈ y 430 to 1540, subject ≈ y 820 to 1180, cut ground the bottom ≈ 20%. v0.8's focal band (y 420 to 1040) is replaced. Defaults push 0.04 units/s, drift ±0.08 on a 25 s sine.
- **§ 1 Tokens:** `cutLine`, `screenLight`, `shoe`, `glasses`, `leaf`, `leafDark`, `pot`, `ledOff`; per mood `appliance`, `ceramic`, `shelf`, `shade`, `rug`, `ui`, `window`; Day `trim` `#f7f6f2` → `#e2e1dc`.
- **§ 2, § 4 Light:** per-mood exposure and roll-off (Night 1.4 / 0.88, Day 0.64 / 0.74); sky and window divided by the exposure; soft focus 0.35; Day key 0.95 → 0.8; new Day bounce `#fff7ee` 0.7 from (4, 1.5, 3), no shadows; Night lamp at 1.2 × 0.9 with linear falloff, shade `#c4ae8a`, emissive 0.096 (0.8 at spec clipped to white); lamp breathes ±3% over 4.5 s; shadow values. Night subject floor (p50 ≥ 30%) unchanged; the rim is being added to meet it.
- **§ 6 Overlays as built:** captions grow with the words, page break at 5 words, punctuation or a 0.3 s silence, 6 px overdamped settle; name tag 120 px above the head (never above y 470), leader ends 10 px short, 10 px paper halo; statement stacked halo; attribution 24 px / 1.2 with a 14 px halo; title block 37 px / 1.15, 6 px rise. **Owner decision, stage 2a review: statement cards and the title block sit in the sky band by default** (statement placement being built; low and high stay as alternatives).
- **§ 8 Cast as built (✅ owner approved, stage 1):** sleeves to the wrist (forearm r 0.058), small hands (r 0.045) with a scrolling thumb, MOM's bob and glasses geometry, blinks every 3 to 5 s (the first within 3 s), nod, weight shift.
- **§ 7 Known overlap, open:** a 2-line caption page (≈ y 1045 to 1188) covers the bottom of the subject zone (to ≈ 1180) at the wide framing; checked on stills next.
- Checklist 1, 5 and 11 updated.

## v0.8 · 2026-10-15 · The Section replaces the Plaster Museum (owner decision)

Relayed by the main session: the owner approved `proposals/visual-identity-v1.md` rev. 2 with **frame A, The Section**, all 15 summary lines with their recommendations, after seeing the mock-up `section-frame.html`; plus one owner addition, **phones face their owners, never the camera**. Background: the owner chose a reference video's style (@wealthy_path, coloured characters with name tags, real phone screens, several locations), then said our first mock-ups (`story-styles.html`) felt "like a copy", so the frame became ours. No `feedback.md` entry (nothing published). The decisions are ✅ owner decision; **every value is 🧪 until the pilot's stills are judged** (noted at the top of the style guide).

**How values were set.** Where the approved proposal and the mock-up differ, the mock-up wins on *values* (it is what the owner saw), the proposal wins on *rules*. Mock-up values adopted: camera fov 26° at ≈ (4.6, 3.6, 8.6) → (0.05, 0.75, −0.15) (proposal: 24°, 32° yaw, −18°); slice 3.4 × 2.4, walls 0.18; Night and Day palettes and lights (incl. Day couch blue `#6f8fd1`, not the proposal's sage); YOU `#2f55c9`, FRIEND `#2e9a63`; one `cut` colour for every cut face, ground included (proposal had a separate `#cfc6b8`); overlay ink/paper per mood (Night ink = `cut`); caption 50 px with a 12 px left rule; tag colour square 26 px with a paper outline; detail box 324 to 360 px with a DETAIL tab and shadow; title block as a bordered paper box with a sub-line "SECTION A–A · time"; statement letter-spacing −0.03em; attribution Mono 600 24 px 0.18em; X-ray at 30% opacity; node dots r 0.035; route along the ground's cut face; breathing ±0.012. Mock-up values **not** adopted because they break a rule: the orange-coloured current caption word (`#ffb27a` / `#e14d0f`, reserved band; approved line 5 says no highlight) and the dimmed word preview; tags in JetBrains Mono (approved line 10 says Inter); right margin elements to x 960 and captions at y ≈ 1363 (safe zone x ≤ 888, y ≤ 1248); statement at ≈ 119 px across 840 px (too wide for the safe zone; 88 px kept); `#ffffff` shelf in Day (no pure white; `#f7f6f2`); "9:41 PM" in the title (never 9:41).

**style-guide.md rewritten as v0.8 "The Section".** § 1 palette (new tokens `cut`, `eye`, per-mood `bg`, `sky`, `wall`, `floor`, `soft`, `wood`, `trim`, `device`, `earth`, `ink`, `paper`, `inkSub`, `capBg`; the orange rule and the **reserved band** hue 8–40°, sat ≥ 60%, lightness 35–75%); § 2 light and finish (Day whites check kept, Night floor, selective bloom, single `useFrame` exception); § 3 the slice (outside always; geometry; materials; **phones face their owners**; screen light); § 4 moods (Night/Day lights, default Day, one time-passes beat); § 5 the orange system (glow with node dots, route through wall and ground, bleed and tell kept, **X-ray** once per video, **trace**); § 6 overlays (margin-note captions, drawing-label tags, detail box, statement, attribution, title block, counter; one idea per frame); § 7 layout; § 8 camera, transitions (follow the line, section slide), motion, cast, phone-screen kit, intro and loop; § 9 sound (torch click → phone-lock click); § 10 unchanged (v0.7 length). **Review checklist rewritten** (12 checks for the new frame).

**brand.md.** Header; Open decisions 2 (mascot → no mascot, the cast) and 7 (lens → retired, X-ray) settled, rows removed, numbers not reused; cadence row notes the higher build cost; § Promise one sentence and difference 3 (The Section, ✅); § Audience "Not for: kids" (dollhouse guard); § Voice register, point-at-screen why, banned words (no character speaks); § Hook first frame; § Structure: new "Several locations" paragraph, the step table's third column rewritten (slice, journey, X-ray, trace, phone-lock loop); **§ Mascot replaced by § The cast** (YOU, FRIEND, MOM, extras; dot eyes; never speaks; tags; phones face owners); § Naming of videos (title block, first scene only, sub-line = section and story time; per-scene label retired; "No. 014" example → No. 001); § Name and the proposed bio drop "museum"/"exhibit"; § What we never do: orange rule, no camera inside a room, no screen to the camera or real brands, no pills or underlined/orange caption words, Day whites, no speaking characters, dot-eye faces, reuse rule restated for slices.

**Retired** (were 🧪 or ✅ for the museum): plaster on everything and "one material"; plaster/museum/plate/label-card tokens; `MuseumSet`, wall plate, glass lens; "no screens with UI" and `plasterGlass`; faceless figures; "one accent, nothing else coloured"; the museum brightness values (skylight 0.42, exposure 0.86, shoulder 0.82, vignette 0.34; the ✅ applied to that look) and the p95 check; wall stain line and wash ("stains stay" → trace); Fraunces, orange-italic caption word, paper cards with square-corner `cardStyle`; exhibit sub-line, per-scene label and its crossfade rule; the night guard and torch sting; the 12-frame dissolve between locations; the eye-level 40° camera presets.

**Kept:** safe zones; one idea per frame; statement and attribution rules; writing, sourcing, sound, export, length; determinism; theme tokens only; no pure white/black surfaces; rounded edges and blob shadows; selective bloom, grain, shallow focus; scene length, cut spacing, easing; motion principles; no realistic faces; new locations every video.

**The proposal file** is marked "ACCEPTED, merged into v0.8"; v0.8 wins where they differ.

**Outside `brand/` (not changed here, reported):** files that still describe the Plaster Museum are listed in the brand-director's v0.8 report to the main session.

## v0.7 · 2026-10-15 · Length becomes a soft rule (owner decision)

Relayed by the main session as an approved owner decision. No `feedback.md` entry (nothing published yet).

- **The hard "never over 59 s" cap is removed; Open decision 3 (Length) is settled** (row removed; number not reused). New rule, ✅ owner decision: length follows the idea, most Shorts land around **30 to 60 s** (was "about 25 to 45 s"); **over 60 s is allowed when the story needs it, provided the video has no licensed (Content ID-claimable) music**; music we make ourselves is fine. Revisit when TikTok Creator Rewards (≥ 1 min, P§3, S19) is within reach. Why: YouTube blocks Shorts over 1 min with any active Content ID claim (P§3, S8), and our videos carry no third-party music.
- Files: brand.md (§ Open decisions, § Audience "in under a minute" → "in about a minute", § Structure); style-guide.md (§ 9 Licensing: adds "music we make ourselves", with the condition that the tool's terms grant commercial multi-platform rights and nothing is registered in Content ID, per P§5; § 10 Length); `research/script-references.md` R§3 note.
- **Not part of v0.7:** the visual-identity proposal `brand/proposals/visual-identity-v1.md` is a draft awaiting approval and changes nothing yet.
- **Outside `brand/`:** `CLAUDE.md`, `.claude/agents/scriptwriter.md`, `voice.md`, `researcher.md` and `.claude/skills/new-video/SKILL.md` already state 30–60 s with the over-60 condition. `README.md` line 38 still says "150–170 words is about 60 seconds" (an old word-count target, not the cap).

## v0.6 · 2026-10-15 · One idea per frame, statement cards, on-screen attribution (owner decisions from a reference video)

The owner shared a reference video (kinetic typography on black, @black.box.facts3 on TikTok, why metal "smells"). It reads clearer than our pilot because every frame carries one idea, key phrases are set large as statements, and sources are named quietly on screen ("a hypothesis from the researchers"). The owner keeps the Plaster Museum and borrows three things, all ✅ owner decision; the values that implement them are 🧪. No `feedback.md` entry (the pilot is not published). Nothing is built yet.

**1. One idea per frame** (brand.md § Structure, § What we never do; style-guide § 7, § 6, checklist 9)
- At most one card at a time (callout, search bar, ad card, counter, statement card) besides the exhibit label and captions; the next enters only after the previous has left. Empty space: the subject spans ≤ 60% of the focal band's width, nothing readable within 48 px of it except its own callout (🧪).
- **The `ILLUSTRATIVE` watermark comes off the picture.** 🎭 specifics are now disclosed by a description line "Illustrative: [what is invented]." right after the hook line, plus the AI label already on all three platforms. Watermark removed from style-guide § 1 (`inkLabel`), § 4 (never-orange list), § 5 (fonts, its type row, was ✅ studio rule), § 6 (its position row), and brand.md § Sourcing policy; § 10 Description row gains the illustrative line. Note: no platform label says "illustrative" (P§6), so the description line is the real disclosure.

**2. Statement cards** (style-guide § 5, § 6, § 7; brand.md § Structure)
- Large Fraunces 600, 96 px / 1.05, `ink` with `textHalo`, no box, sentence case with a full stop ("One household."), ≤ 4 words, ≤ 2 lines, ≤ 16 characters a line. Positions: low (bottom edge y 1000, default) or high (top edge y 500), x 192 to 888. At most 2 per video, ≥ 6 s apart, not in the first 3 s. Hold from the first word to 0.8 s after the last (or the next word), 1.2 to 3.0 s; fade in 12 frames with a 6 px rise, fade out 12 frames, cubic in-out, no pop. Optional engraved-on-the-wall variant for wide shots.
- **Captions suppressed while the card is up** (chosen over running both): the card already shows the exact spoken words to muted viewers (L§2), and the same words twice is two things saying one idea. Consequence: a statement phrase needs a beat after it in `performance.txt`.

**3. On-screen attribution line** (brand.md § Sourcing policy, Open decisions, § Promise, § Structure step 6, § What we never do; style-guide § 1, § 5, § 6, § 7, checklist 10)
- **Reverses v0.1 to v0.5 "sources never on screen"; Open decision 5 is settled** (row removed; number not reused). Full sources stay in the post description.
- JetBrains Mono 500, 20 px, letter-spacing 0.14em, uppercase, `inkMuted`. Under a statement card (24 px below it) or alone with its bottom edge at y 1024, above the caption band. At most 2 per video; ✅ claims, or 🟡 spoken with that attribution; never 🎭. Wording: who + year ("FTC staff report, 2017"), matching `sources.md`, no URL, no title, no "Source:", ≤ 36 characters. Fade 10 frames, no movement; alone it holds for its claim's sentence, ≥ 2 s.

**4. Motion principles, 🧪 pending build** (style-guide § 8). Owner feedback: "everything feels static except the camera; the mannequins barely move". Something is always alive (figure breathing and weight shifts, gestures on cue, dust in the light beam; orange ambient life such as the LED pulse only once the system is active); motion calm and slow; the orange stays the only fast-moving thing. Values follow once the owner approves the motion plan.

**Outside `brand/` (not changed here, reported):** `CLAUDE.md` § Sources ("marked illustrative (🎭, with the watermark on)", "Sources go in the post description, not on screen") and § Style ("The 'ILLUSTRATIVE' watermark stays on videos that use invented specifics"); `docs/sources-format.md` ("not on screen", 🎭 watermark); the watermark in the code and in `phone-listening/spec.ts`.

## v0.5 · 2026-10-15 · New writing recipe and narrator delivery (owner feedback on the pilot script)

The owner rejected the pilot script's style: "sounds too AI ... adding detail just to make it longer ... I find this style annoying when watching a video", shared two reference scripts, approved the 7-step recipe ("go"), and asked for an American narrator. No `feedback.md` entry (the pilot is not published); the material is in the new `research/script-references.md` (R§). The look is unchanged.

**1. New research file** `research/script-references.md`: the owner's two reference transcripts (excerpts), the analysis, the recipe (R§3), the banned AI patterns (R§4) and the pilot redrafted in the new style (R§5, not fact-checked). Source: YouTube transcripts shared by the owner, 2026-10-15.

**2. brand.md § Voice and tone rewritten.**
- ✅ owner feedback: **no padding** (every sentence adds new information; padding test), **no AI patterns** (banned list 1 to 6: fragment chains, lists of three for rhythm, fake reveals, filler, a hedge in every sentence, every sentence 4 to 6 words).
- 🧪: sentences mostly 10 to 20 words, short ones only to land a point (replaces "most under 10 words, fragments allowed"); one concrete story; talk to the viewer for their experience, narrate like a reporter for a story; point at what's on screen; answer straight; fairness; banned list 7 to 9 (signposts, slogan endings, loose comparisons).
- **Attribute, don't hedge** replaces "Hedge when the source hedges": say who claims it; hedge only where the source hedges. A 🟡 claim can be spoken with its attribution, not only with "can/often". Sourcing policy and § What we never do updated to match.
- **Numbers:** "one number per video at most, rounded" → any number that tells the story, each ✅ sourced. Same change in style-guide § 5 Counter.
- New "sounds AI vs sounds human" pairs (pilot vs R§5); the 5 on-brand and 5 off-brand lines replaced. Reference text is now R§5, not the pilot's `script.txt`.
- § Promise "calibrated honesty ('probably not')" and the § Naming platform-title example ("Your phone isn't listening. Probably not.") reworded: both used the hedge-and-fake-reveal pattern.

**3. brand.md § Hook patterns.** Hook = recipe steps 1 to 3 (moment, surprising fact, question by ≈ 6 s). Patterns now: the lived moment, the dated event, the role, the finding, the wrong recipient. Dropped: "the gentle denial" ("…Probably not." is a fake reveal plus hedge) and "the exhibit card" (a fragment chain). Numbering 1 to 5 kept for `feedback.md`. All 🧪.

**4. brand.md § Structure of a video.** The 5-part table with seconds and per-part word counts (8 to 14 / 20 to 30 / 40 to 55 / 45 to 55 / 12 to 20) and the 140-to-160-word target are removed. Now the 7 recipe steps, each mapped to what the exhibit does (plaster, orange reveal, stains, torch off). **No word-count target; Shorts ≈ 25 to 45 s**, ≤ 59 s kept (Open decision 3). Long-form later: 2 or 3 questions. Loop kept only where it reads naturally. All 🧪.

**5. style-guide.md § 9 Sound.** Voice row split into: **Narrator: American English** (✅ owner feedback); model `eleven_v4` by default, stability 0.4 to 0.5 starting point (🧪); pacing from punctuation and ellipses (v4 has no `speed`); audio tags only where a human narrator would pause or react, at most ≈ 1 per 3 sentences, never comic tags (`[laughs]`, `[sarcastic]`); tags only in the performance text, never in captions; always audition 2 to 3 takes and pick by ear (all 🧪 except American).

**Outside `brand/` (not changed here, reported):** `CLAUDE.md` § Style ("150–170 words ≈ 60 s", "Short, spoken sentences"), `.claude/agents/scriptwriter.md` and `.claude/skills/new-video/SKILL.md` (150–170 words, hedge 🟡 with "can/often"), `.claude/agents/researcher.md` ("about 160 words") and `docs/sources-format.md` (🟡 "Only with hedged wording") still state the old rules.

## v0.4 · 2026-10-15 · Reconciled with the Exhibit No. 001 build (scene-builder review round 2)

Every value below was read in code (`theme.ts`, `MuseumPost.tsx`, `MuseumStage.tsx`, `LivingRoom.tsx`, `PhoneScene.tsx`, `RoomScene.tsx`, `ProfilesScene.tsx`, `Mannequin.tsx`, `Chip.tsx`, `AdCard.tsx`, `Explainer.tsx`, `phone-listening/spec.ts`). The look is unchanged; nothing new moves to ✅.

**1. Whites rule made measurable** (style-guide § 2, checklist 1; brand.md § What we never do)
- v0.3's "brightest plaster 85 to 90% (RGB 217 to 230), nothing clipped" named no method. Measured with numpy on the approved build (scene-builder): p95 ≈ 88%, but the brightest near-neutral plaster is 242 to 244 (94.9 to 95.7%), and no pixel is 255. The old number was a p95, not a maximum, so the approved stills broke the rule as written.
- New rule, on a full-scale still with cards, captions and glow masked, Rec. 709 luma: **p95 ≤ 90%, brightest near-neutral pixel (max − min channel ≤ 30) ≤ 96%, zero pixels at 255,255,255**. The look stays ✅ owner feedback; the thresholds are 🧪 (set on one build).
- Checked in `MuseumPost`: the shoulder is linear (keeps 45% above 0.82 after × 0.86), not an asymptote, so it does not stop clipping. Lit 1.0 → 0.838; the approved 95.7% needs ≈ 1.31 in; 255 needs ≈ 1.42 (≈ 8% headroom). v0.3's "pure white lands at ≈ 0.90" was wrong and is removed.

**2. Tokens** (§ 1, § 2, § 3): `plasterGlass #fcf7ee` (screen glass, roughness 0.7, lit +9.3% over body plaster; the screen is no longer `plasterShade`); `lightSky`, `lightGround`, `lightKey`, `lightFill`, `lightRim` (closes the v0.2 "guide wins" item). Every colour in the guide now names a token. `plasterFloor` also used for the phone lens; `plasterShade` for earpiece, home bar, lens ring, keyboard well.

**3. Phone exhibit** (§ 3, § 4, § 8): phone detail (lens ring, earpiece without shadow, side button, home bar); camera presets `front` → `close` → `screen`, each starting where the previous ends; route core **0.012** at phone distance (0.02 is for the room at ≈ 6 units: scale with distance); new § 4 row **Screen recording**: edge trace 1.2 s, scan band every 1.5 s, outbound route 0.8 s with no stain, edge glow holds 1 s then fades to a stain frame (radius 0.007) that `screenStain` carries into later shots.

**4. Living room** (§ 3, § 4, § 6, § 7, § 8): plaster laptop on the table (lid open, screen to camera, bleed 0.3); `devicesAt` (flicker ≈ 0.5 s, ramp 0.3 s, hold); `householdAt` (router bleed ×1.35, wash 0.40 → 0.50, LED grows; only brightens); camera `devices`. Plate 0.40 × 0.22 at two `ROOM.plateSpots` (−0.87, 1.95) and (−0.68, 2.3), auto-picked per shot to stay inside x 120 to 888 and off the label. Plate only on wide shots (No. 001: 4a, 9b), 🧪.

**5. Overlays and figures** (§ 1, § 3, § 5, § 7): ad-card icon is an outlined plaster mug (SVG, `plaster` fill, `inkMuted` stroke) on the `plasterShade` square; `Chip` `delay` (scene 1 uses 1.0 s, so "no label text in the first second" is now built; closes the v0.2 item); `Chip` skips its entry when the label equals the previous scene's; `Bust` rebuilt from Mannequin parts, pedestal 0.8 → 0.7.

**6. Crossfade reconciled** (§ 8): `FADE` 12 and `Easing.inOut(Easing.cubic)` now in code; closes the v0.2 item. Known limit recorded in § 7: the outgoing scene stays opaque under the dissolve, so two different labels draw over each other for 12 frames. Rule for the director, 🧪: prefer identical label text across a crossfade (checklist 8).

**7. Label sub-line** (brand.md § Naming; style-guide § 5): the sub-line names a place, time or category and **stays the same across consecutive scenes of the same type**, changing only where the type changes (No. 001: 1 to 3 `A PHONE`, 4a to 5b `EVENING`, 6a to 7 `ONE HOME`, 8 `SCALE`, 9a `A PHONE`, 9b `EVENING`), as the director aligned it. New row: the first scene's label enters at ≈ 1 s. Both 🧪. Example sub-line in the guide changed from "2 A.M." to "EVENING".

## v0.3 · 2026-10-15 · Three owner decisions: name, brightness, pilot number

All three came from the owner directly (no `feedback.md` entry yet; the pilot is not published).

**1. Name: Secretly Works, `@secretlyworks`** (brand.md title, § Promise, § Name, Open decisions; style-guide.md title)
- "WORKING TITLE" replaced by "Secretly Works" everywhere in `brand/` except the v0.1 history below, which describes the placeholder as it was.
- § Name candidates replaced by a short § Name: the chosen name, handles per platform with status. The Instagram account (`@secretlyworks`, "Secretly Works | Tech in 3D") and both YouTube channels (`@secretlyworks`, `@howitsecretlyworks`) are the owner's own, so the "possibly the owner's placeholder" rows in `research/landscape.md` §6 are confirmed. **One open item: the TikTok handle still needs an in-app check** (it could not be verified from outside, L§6).
- Proposed Instagram bio, 🧪 until approved: "How everyday things secretly work. One 3D exhibit at a time, sources in every post." (83 characters; the current "Everyday tech, opened up in 3D" narrows the topic to tech).
- Open decisions: row 1 removed; rows keep their numbers so "Open decision 3 / 5" references in both documents still resolve.

**2. Brightness as built is approved** (style-guide.md § 2; brand.md § What we never do)
- Owner looked at the current renders (walls ≈ 70 to 80%, plaster highlights ≈ 88 to 90%, nothing clipped) and said it is right. Skylight 0.42, exposure 0.86, shoulder 0.82, vignette 0.34 and the 85 to 90% ceiling move from 🧪 to **✅ owner feedback**, as one rule "Brightness, as built", plus the vignette and skylight rows. **Don't raise brightness in future.** Every other rule stays 🧪.

**3. Pilot approved as Exhibit No. 001** (brand.md § Naming of exhibits)
- `phone-listening` is No. 001; numbering starts there in publication order. "No. 014" stays in the examples as a mock-up value. The pilot's `spec.ts` (chip and plate) still says No. 014; that is the director's change, listed in the report.

## v0.2 · 2026-10-15 · Reconciled with the R3F build (scene-builder review round 1)

The scene-builder ported the Plaster Museum to `src/` and had to tune several values by eye. Every value below was verified in code before the guide changed. Where the built value won it is adopted (🧪); where the guide wins, the code change is listed at the end for the scene-builder. No owner feedback yet, so nothing moves to ✅ except studio rules.

**Adopted from the build (style-guide.md)**
- § 1: new token `orangeStainLine #dc8250` for the thin stain line (the old `orangeStain #e8702a` stays for lit surfaces, unused so far). Every colour row now names its `theme.ts` token; the five light colours are marked as inline in `MuseumLights` with no token yet. `cardShadow` and `textHalo` added as tokens.
- § 2: skylight 0.34 → **0.42** (wide shot read muddy at 0.34); vignette 0.46 → **0.34** (0.46 greyed the corners; ≈ 11% dark at the corners now); shadows radius 5 → **9**, bias −0.0004 → **−0.0008**, plus **normalBias 0.02** (acne on curved plaster); penumbra stays 0.75 (0.95 darkened the wall; it is cone falloff, not shadow softness). Light table now states the `intensity × π` multiplier (default 0.9, living room 0.84) and the per-scene key positions, including the room key at (1.3, 5.8, 4.6) → (0, 1.1, −0.5) so the wall is even and the table top not hot. Grain seeding described as built (`frame % 97`). Focus line given per camera preset.
- § 2: **`MuseumPost.tsx` is the single documented `useFrame` exception; no other `useFrame`** recorded as a ✅ studio rule (ESLint enforces it everywhere else).
- § 3: bevel segments 3 by default, **5** on couch, cushions and the pedestal phone; blob shadow height 4 to 16 mm; figure radii as built (forearm 0.062, shin 0.085); set dimensions as built (plinth at z 0.15, wall face z −0.93). Phone exhibit has **no screen UI** (plaster phone, recessed screen, one mic light).
- § 4: halo 0.07 at 22% → **2.6 × core (0.052) at 20%**; route draw 3 s → **1.7 to 3 s** (default 1.8; the mock-up's 3 s felt slow in a 4 s scene); bleed lights restated on `OrangeLight`'s 0–1 scale (screen 0.3, router 1.3, runner 1.2, mic 0.35) so lit plaster stays under 90%; the tell flickers 20 to 80% for ≈ 1 s then ramps 0.5 s, starting 1.5 s before the route; wall wash 0.55 → **0.40** (0.55 blew the wall past the exposure ceiling), plane 2.4 × 1.8; stain line **radius 0.010, flat, opacity 0.7, soft tube 0.03 at 0.12, on the wall plane behind the figures** (a lit tube on the route read as a cable in front of them); LED at mid-draw; glow fades to stain over 0.8 s. Matched tiles use `orange` × 0.62 albedo so they land on `#ff5b14` after the key light and bloom (added to the checklist). Search-bar strike recorded as the one orange allowed on a card.
- § 5: captions 62 → **64 px**; 16 px plaster halo (`textHalo`) and a 1 px ink edge on the orange word (orange on an orange-lit wall needed an edge); card type sizes for callout, search bar, ad card and counter written in; watermark `inkMuted` → `inkLabel` at 0.75; plate title thin-spaced (U+2009), not 3 spaces.
- § 6 and § 7: one card style (`card.ts`) for every overlay; callout leader 2 px `inkMuted`, hollow ring r 6 px, `place: 'side' | 'above'`, cards clamped to x 120 to 888 automatically; captions anchored by the bottom edge (single line centred at y 1152, bottom ≈ 1188). Exhibit label is **one label per scene**, entering with its scene. Wall plate: default 0.56 × 0.31 at (−1.15, 0.98) kept for the phone exhibit; living room **(−0.96, 1.95), 0.44 × 0.24** (the default spot is behind the couch).
- § 8: camera described by the built presets (wide, push, table; push starts where wide ends so the dissolve is invisible) instead of the mock-up's drift rates; dolly easing sine in-out, captions and label on overdamped springs.

**Guide wins (code to change, scene-builder)**
- § 8 Transitions: **12 frames, cubic in-out.** `theme.FADE` is still 8 and `FadeIn` in `src/Explainer.tsx` is linear. 8 is the pre-museum starter value (it is in the last commit, before the museum work) and was never tuned by eye; a 0.27 s linear fade reads as a softened cut, the museum wants a dissolve. 🧪: shorten to 8 if the first review stills show two readable cards overlapping mid-dissolve.
- § 7 Exhibit label: in the first scene the label should not appear before ≈ 1 s (brand.md § Structure); `Chip` currently enters at frame 4 of every scene and has no delay prop.
- § 1: light colours should get `theme.ts` tokens (studio rule: no inline colours).

**brand.md**
- § Structure, Reveal: "draws itself across the room over about 3 s" → "over 2 to 3 s", to match the built draw time (1.7 to 1.8 s in the living room, 3 s reserved for a route that crosses the whole frame).

## v0.1 · 2026-10-15 · First version, from the brand workshop

Created `brand.md`, `style-guide.md`, `feedback.md`, `CHANGELOG.md`.

**Decided by the owner (treated as given)**
- Topic: how everyday things secretly work, broad (objects, services, habits, systems), not only tech.
- Platforms: TikTok, YouTube Shorts, Instagram Reels; one master file for all three; English first, other languages later.
- Visual direction: **The Plaster Museum** (direction A of the round-2 direction board). Matte off-white plaster, museum lighting (skylight plus one warm spot, soft shadows, vignette, light grain, shallow focus). The hidden system is the only colour: one signal orange `#ff5b14` that glows, bleeds onto the plaster, and leaves a stain. Stains stay. Each video is a numbered exhibit ("No. 014 · The Living Room"); the chip becomes an exhibit label; captions in Fraunces with the current word in orange italic; small labels in JetBrains Mono; all geometry rounded; whites at 85 to 90%, never clipped (a brighter version was rejected as "too bright").
- Rejected looks: dark navy with glowing arcs (too common), pop-up book, lens-only. A glass lens may be used occasionally as a reveal technique, not as the identity.
- Rules stay flexible: each tagged 🧪 testing or ✅ proven with a one-line why; changes go through `feedback.md` and this changelog.

**Defaults written in, not yet confirmed by the owner (all 🧪, listed under "Open decisions" in brand.md)**
- Channel name: placeholder "WORKING TITLE"; candidate table in brand.md (How Things Secretly Work, Moonlit Mechanics, Backstage of Everything, The Hidden Exhibit, Museum of Everyday Things). Handles not checked here; need an in-app check on all three platforms.
- Mascot: a silent night guard, a small plaster figure with a torch; the beam can be the orange reveal; torch click-on/click-off is the sting and the loop point; never in the first 3 s; never speaks. Alternative: no mascot.
- Length: 59 s or less (platforms.md §3: YouTube blocks Shorts over 1 min with any Content ID claim; TikTok Creator Rewards needs ≥ 1 min, revisit later).
- AI-voice label: on, on all three platforms (platforms.md §6).
- Sources: in the post description, never on screen (owner's choice; landscape.md §4 had argued for an on-screen chip).
- Added by the brand-director as defaults: cadence 3 to 5 exhibits a week (landscape.md §4); lens at most once per video and never in consecutive exhibits; crossfade 12 frames; music 16 to 20 dB under voice; loudness −14 LUFS / −1 dBTP (platforms.md rule 9).

**Values taken from the direction board mock-up** (`museumScene`, three.js r149 units; to be re-tuned in R3F): palette hexes, light rig (hemisphere 0.34, key spot 1.0, fill 0.15, rim 0.2), post-processing (exposure 0.86, knee at 0.82, vignette 0.46, grain 0.035, tilt 0.75, bloom 1.0), plaster roughness 0.92/0.95, orange path (core 0.02 `#ffb27a`, halo 0.07 at 22%), stain values, label and plate typography, camera fov 40° and drift.

**Layout values taken from platforms.md** (§1 and §2): safe rectangle x 120 to 888, y 288 to 1248; label top 340; captions centred at y 1152, 696 px wide; watermark top 300 left 120; focal band y 420 to 1040; export settings from platforms.md rules 7 to 15.
