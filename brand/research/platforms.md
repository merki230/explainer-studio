# Platform research: TikTok, YouTube Shorts, Instagram Reels

Research date: 2026-10-15. "Seen" means the date I loaded the page; many help pages carry no date of their own. Numbers are tagged **[official]** (platform page), **[secondary]** (third party reading or reporting an official source), or **[analysis]** (my reasoning or a house choice, not sourced). Source IDs like (S3) point to the list at the end.

**Biggest caveat.** None of the three platforms publishes an *organic* (non-ad) safe zone. Every pixel number below comes from the platforms' **ad** templates. The ad UI is a superset of the organic UI (it adds a CTA button or a sponsor line), so these zones are conservative for organic posts. That is the right way to be wrong.

---

## 1. Safe zones (1080 × 1920)

"Reserve" = band the UI may cover. Keep text, logos, and the 3D subject out of it.

| Platform | Top | Bottom | Left | Right | Status and source |
|---|---|---|---|---|---|
| TikTok | 240 px (12.5%) | 660 px (34.4%) | 120 px (11.1%) | 120 px, plus a ~180 px button column from y = 840 down | **[secondary]**: Socialync's reading of TikTok's In-Feed safe-zone file (drawn at 720×1280, scaled), read 2026-10-11 (S2, S3). TikTok itself gives no pixel numbers, only downloadable files, and says the zone shrinks with longer captions (S6, S7) |
| YouTube Shorts | 288 px (15%) | 672 px (35%) | 48 px (4.4%) | 192 px (17.8%) | **[secondary]**: measured from Google's official 1080×1920 vertical-video PNG by Adkit (updated 2026-09-10) and Socialync (2026-10-11); both agree (S2, S4). Google's page only says overlays move "depending on the format, campaign type and screen" (S5) |
| Instagram Reels | 14% (≈ 269 px) | 35% (672 px) | 6% (≈ 65 px) | 6% (≈ 65 px) | **[official]**: Meta Ads Guide, Instagram Reels (S1). Note: Meta's 6% sides do not cover the right action rail; Meta's own figure is what it is, but treat the right side as unsafe anyway (see combined zone) |

What each band holds (descriptive, **[analysis]** from the templates and general UI knowledge): top = status bar, Following/For You or Reels tabs, search, camera; right = like/comment/share/save/remix rail and the spinning audio disc; bottom = username, caption, music ticker, CTA on ads, and the progress/scrub bar at the very bottom.

Conflicts worth knowing:
- Third-party guides give other numbers (e.g. "top/bottom 10%", "150 px all round", Adkit's own earlier 241/381 px YouTube figure seen in a search snippet). The table uses only numbers traced back to the official template files.
- TikTok: "the longer the caption, the smaller the safe zone will be" (S7). A long TikTok description expands upward over the video.

### Combined safe zone (strictest value on each edge) **[analysis]**

| Edge | Reserve | Set by |
|---|---|---|
| Top | **288 px** (0.150) | YouTube |
| Bottom | **672 px** (0.350) → content must end at **y = 1248** | YouTube / Instagram |
| Left | **120 px** (0.111) | TikTok |
| Right | **192 px** (0.178) → content must end at **x = 888** | YouTube (also clears TikTok's 180 px rail) |

**Safe rectangle: x 120–888, y 288–1248 (768 × 960 px).** Its centre is x = 504, not 540, because the right reserve is wider. For centred elements use symmetric 192 px sides (x 192–888, 696 px wide).

---

## 2. Our current layout vs the combined zone

Measured from the code (S-code: `src/components/Captions.tsx`, `src/components/Chip.tsx`, `src/Explainer.tsx`):

| Element | Current placement (from code) | Approx. box | Inside combined zone? |
|---|---|---|---|
| Captions | centre at `0.74 × 1920` = y 1421 (`translateY(-50%)`), left/right 60 px, 62 px font, 1.2 line height, padding 10/16 | 1 line ≈ y 1371–1471; 2 lines ≈ y 1333–1508; up to x 60–1020 | **No.** Entirely inside the bottom reserve (below 1248) on all three platforms; long lines also run under the right rail (x > 888) |
| Chip | **`top: 200`** (not 70–130 as in the brief), centred, 26 px mono, 12 px padding | ≈ y 200–256 | **No.** Inside the top reserve on Instagram (269) and YouTube (288); top 40 px under TikTok's 240 |
| Watermark | `top: 70`, `right: 60`, 18 px mono | ≈ y 70–92, right edge x 1020 | **No.** Inside the top reserve on all three and inside the right reserve |

### Recommended positions **[analysis]**

| Element | New placement | Frame fraction | Notes |
|---|---|---|---|
| Captions | Keep centred, **left/right 192 px**; **centre at y = 1152** (or anchor the box's bottom edge at y = 1232, i.e. `bottom: 688`) | x 0.178–0.822; y centre 0.600 (bottom-anchored: bottom edge 0.642) | A 2-line page (≈ 175 px) centred at 1152 spans ≈ 1065–1240, just inside 1248. Bottom anchoring is safer because 2-line pages grow upward. Check that 3 words at 62 px fit in 696 px; drop to ~56 px if they wrap often |
| Chip | **`top: 340`**, centred | y 0.177 | Box ≈ y 340–396 |
| Watermark | **`top: 300`, `left: 120`**, left-aligned (move off the right edge) | x 0.111, y 0.156 | Sits above the chip with ~18 px gap. Alternative: drop it; the platform already shows the handle |
| 3D subject / focal action | keep the subject between **y ≈ 420 and 1040** and x 120–888 | y 0.22–0.54 | Between chip and captions **[analysis]** |
| Cover text | inside x 120–888, y 288–1248 | | Also survives the 3:4 centre crop used on Instagram and TikTok profile grids (1080×1440 = y 240–1680) **[secondary]** (S18; Instagram 3:4 grid per third-party guides only) |

Code changes belong to whoever owns `src/components/` (not done here).

---

## 3. Specs

| | TikTok | YouTube Shorts | Instagram Reels |
|---|---|---|---|
| Max length | 10 min via the posting API (S11) **[official]**; in-app uploads reported up to 60 min **[secondary, conflicting]** | **3 min** (square or vertical, uploads from 2024-10-15) (S8) **[official]** | **3 min** in app (Mosseri, 2025-01-18, S9) **[secondary]**; API accepts 3 s–15 min (S10) **[official]** |
| Length that matters for us | Creator Rewards only pays on videos "of at least 1 minute" (S19, terms updated 2026-07-20) **[official]** | **Over 1 min + any active Content ID claim = blocked worldwide** (S8) **[official]** | none found |
| Resolution | ≥ 540×960 for ads (S6); API 360–4096 px (S11) | 1080×1920 recommended for vertical (S5) | max 1920 px columns, 9:16 recommended (S10) |
| fps | 23–60 (S11) **[official]** | upload at source fps; 30 fps fine (S13) | 23–60 (S10) **[official]** |
| File size | API ≤ 4 GB (S11); ads ≤ 500 MB (S6) | no limit stated in the spec page | API ≤ 300 MB (S10) |
| Bitrate | ads ≥ 516 kbps (S6) | 1080p SDR 24–30 fps: **8 Mbps** recommended; H.264 High, 4:2:0; AAC-LC 48 kHz (S13) **[official]** | VBR, **25 Mbps max**; AAC ≤ 48 kHz, 128 kbps, mono/stereo (S10) **[official]** |
| Loudness | not documented | not documented by YouTube; widely reported as normalising down to about **−14 LUFS** (S38) **[secondary]** | not documented |
| Cover | pick a frame (API `video_cover_timestamp_ms`, S12); custom upload on desktop web, JPG/PNG **3:4** (S18, 2024-01-16) **[secondary]** | pick any frame in the mobile app; **custom upload for YPP channels only** (YouTube blog, 2026-07-24, S16) **[official]** | pick a frame or upload an image (API `cover_url`, JPEG ≤ 8 MB, 9:16 recommended, S10) **[official]**; grid shows a 3:4 crop **[secondary]** |
| Title | none (caption only) | **100 chars** (S14) **[official]**; description **5,000** (S14) | none (caption only) |
| Caption / description | API: **2,200** UTF-16 units (S12) **[official]**; in-app reported 4,000 **[secondary, date unclear]** | 5,000 (S14) | **2,200** chars, 20 @-tags (S10) **[official]** |
| Hashtags | no official cap found | >60 hashtags → all ignored; up to 3 shown by the title (S15) **[official]** | **5 per post/reel** (Instagram, reported 2025-12-18, S17) **[secondary]**; API page still says 30 (S10) — conflict, use 5 |
| Clickable links | not in captions **[unverified]** | not clickable in Shorts descriptions or comments since 2023-08-31 (S41) **[secondary]** | not clickable in captions **[unverified]** |

Loudness note: AES TD1008 (2021) recommends **−18 LUFS** for speech-led online content (S39), which is quieter than the −14 LUFS convention. No platform documents a target, so this is a house choice (see rules).

---

## 4. What the algorithms reward

**Official statements**
- **TikTok.** Recommendations weigh user interactions highest; "a strong indicator of interest, such as whether a user finishes watching a longer video from beginning to end" outweighs weaker signals; "neither follower count nor whether the account has had previous high-performing videos are direct factors" (TikTok newsroom, 2020-06-18, S20). Captions, sounds, and hashtags are "video information" signals (S20).
- **TikTok creative guidance (ads, June 2025):** "Introduce your content proposition in the first 3 seconds"; "Prioritize your hook in the first 6 seconds"; text at "5-10 words per second" (S21). Our 3-word caption pages at narration speed fit this.
- **YouTube Shorts.** "Capture attention in the first few seconds to prevent viewers from scrolling"; "Post Shorts regularly to build an audience" (YouTube blog, 2025-04-08, S22). Since **2025-03-31** a Shorts view counts every time it "starts to play or replay, with no minimum watch time"; the old metric is now "engaged views", which still decides YPP (S23). So loops inflate the public view count, but money follows engaged views.
- **Instagram.** Ranking uses your activity, history with the poster, "information about the reel" (audio, visuals, popularity), and info about the poster. Instagram shows **less** of "low-resolution or watermarked reels", reels "already posted on Instagram", and reels with borders, muted audio, or mostly text (Instagram, 2023-05-31, S24).
- **Instagram originality (2026-04-30):** accounts that mostly repost others' work lose recommendations; adding a watermark or changing speed does not make content original (S25). Your **own** logo is fine: "if it's your own logo, don't worry about it" (Mosseri via Social Media Today, 2024-10-23, S26). Other apps' watermarks reduce reach (Instagram @creators, 2021, S27). **Always upload the clean master, never a file downloaded from TikTok.**
- **YouTube monetisation:** the July 2025 "inauthentic content" policy targets "AI-generated content made with generic or unoriginal templates" and "Image slideshows, templated storylines … with minimal or no narrative, commentary, or educational value" (S32). Using AI "to edit your video scripts or generate a unique background visual" is allowed (S32). Our risk is the *templated* part; vary scenes and keep real explanatory value.

**Not officially stated (treat as folklore):** "Mosseri's top 3 signals are watch time, likes per reach, sends per reach" (2025) appears only in marketing blogs; "60% completion threshold"; ideal posting frequency numbers; "trending sounds boost reach". I found no platform source for these.

**Looping.** No platform guidance found. Practical point **[analysis]**: on YouTube a replay now counts as a view (S23), and finishing a video is TikTok's strongest stated signal (S20), so a last line that flows back into the first frame helps on both.

**Original audio vs trending sounds.** Because we burn our music into the file, it posts as "original sound" everywhere. That is the only cross-platform-safe option (section 5).

---

## 5. Music and sound licensing (same file to all three)

**Core rule [analysis, backed by the sources below]:** each platform's in-app library is licensed for use *inside that app*. Music added in TikTok's editor is not cleared for the same file on YouTube or Instagram. Anything **baked into our master** must be licensed by us for all three platforms.

- **TikTok:** "Businesses cannot use the general music library for commercial usage"; the Commercial Music Library (≈1 million pre-cleared tracks) is for business content (TikTok Ads Help, updated July 2025, S33). It says nothing about use outside TikTok, so don't bake CML tracks into the master.
- **YouTube Shorts library:** "populated with music tracks from record label partners"; adding one creates "a special Content ID claim"; songs added outside the Shorts tools "are eligible for standard copyright claims" (S34). Not portable, and claims are deadly on Shorts over 1 min (S8).
- **Instagram / Meta Sound Collection:** third-party sources say it is royalty-free but only for use on Meta products. I could not load Meta's terms, so this is **[unverified]**. Don't use it for a cross-posted master.
- **YouTube Audio Library (non-Shorts):** whether tracks may be used off YouTube is **unclear**; it depends on each track's licence. **[unverified]**; avoid unless the track is CC BY.

**Recommended sources for the master file**
1. **Epidemic Sound, Creator plan:** publish "on social media platforms, websites, and podcasts"; "Monetize 1 channel per platform"; not for client work or digital ads (S35, seen 2026-10-15). Fits one channel per platform. Safelist the YouTube channel so Content ID doesn't claim (the platform list and safelisting are from third-party summaries, so check them in the dashboard).
2. **SFX: Freesound filtered to CC0:** "you can do pretty much what you want with the sound"; CC BY needs credit; avoid CC BY-NC because ad revenue counts as commercial (S37).
3. **Pixabay Music/SFX:** free, no attribution required, can't redistribute standalone (S36). Caveat: some Pixabay tracks are reported to trigger Content ID claims **[unverified]**, which is risky for Shorts over 60 s.

Avoid: anything "free" from unknown YouTube channels, AI-music tools whose terms don't grant commercial multi-platform rights, and any track registered in Content ID by a third party.

---

## 6. AI disclosure and sourcing

**We use an AI voiceover. That changes the answer on Instagram for sure, and probably on TikTok.**

| Platform | Rule | Our case |
|---|---|---|
| Instagram / Facebook | Meta "may require an AI label when content has photorealistic video or realistic-sounding audio". Its list of examples that need a label includes **"A reel narrated with a realistic AI-generated voiceover"**. A cartoon-style video needs none. "There may be penalties for content shared without a label when it is required" (Meta Help, "Updated: 21 weeks ago" as of 2026-10-15, ≈ May 2026, S30) **[official]** | **Label required.** Turn on the AI label when posting |
| TikTok | TikTok has "required creators to label realistic AIGC for over a year" and auto-labels via C2PA Content Credentials (newsroom, 2024-05-09, S31) **[official]**. The API has `is_aigc`, which adds "Creator labeled as AI-generated" (S12) | A realistic synthetic voice is realistic audio. **Turn the label on** (TikTok doesn't define "realistic", so labelling is the safe reading) |
| YouTube | Disclose content that is realistic and could mislead, e.g. making "a real person appear to say or do something they didn't do". Exempt: unrealistic or animated content, "Production assistance" (scripts), and "Cloning one's own voice to create voice overs or dubs". "Labels may appear in the expanded description for non-music AI-generated audio". Disclosure does not limit audience or monetisation (YouTube Help, undated, seen 2026-10-15, S28) **[official]**. The 2024 launch post listed "synthetically generating a person's voice to narrate a video" (S29, 2024-03-18) | **Grey zone.** A generic AI narrator isn't a real person, and our 3D is not photorealistic. Ticking "altered content" costs nothing (S28), so **disclose** for consistency |

**C2PA tip [analysis]:** if our render or TTS pipeline ever writes Content Credentials, TikTok may auto-label (S31). That's harmless because we label anyway.

**Citing sources**
- No platform has a citation rule. Best practice **[analysis]**: give one short source line in the description, e.g. "Sources: FTC 2024, Meta patent US…", plus a full source list on a stable page (site or Linktree) linked from each profile. On YouTube, Shorts description links aren't clickable (S41), so use the channel link or a pinned comment with plain-text source names.
- YouTube can show up to 3 hashtags by the title; don't add unrelated tags (S15).
- On sensitive topics (health, finance, news), YouTube's AI label shows more prominently (S28, per the help page). Strong sourcing matters most there.

---

## Rules for our style guide

**Frame and layout (1080 × 1920, 30 fps)**
1. Combined safe rectangle: **x 120–888, y 288–1248**. Nothing that must be read goes outside it.
2. Captions: centred, **192 px side margins (696 px wide)**, **bottom edge ≤ y 1232** (`bottom: 688`), or centre at **y = 0.60** if keeping centre anchoring. Max 2 lines, 3 words per page (unchanged).
3. Chip: **top 340 px** (y 0.177), centred.
4. Watermark: **top 300 px, left 120 px**, left-aligned, or remove it. Never in the right 192 px or the top 288 px.
5. 3D subject: focal action within **y 420–1040**.
6. Cover/thumbnail text: inside the safe rectangle; it then survives the 3:4 grid crop.

**Export**
7. H.264 High, 4:2:0, MP4 (moov at front), **1080×1920, 30 fps, ~8–12 Mbps VBR** (YouTube's 8 Mbps recommendation; stays under Instagram's 25 Mbps cap). Keep the file **under 300 MB** (Instagram API cap). 60 s at 10 Mbps ≈ 75 MB.
8. Audio: AAC, **48 kHz, stereo, 128 kbps or more**.
9. Loudness (house choice, no platform target): **−14 LUFS integrated, −1 dBTP true peak**. Voice-first mix.

**Length**
10. Default **61–70 s** if we want TikTok Creator Rewards (≥ 1 min). If a video is over 60 s, **its music must have zero Content ID risk**, or YouTube blocks the Short. Otherwise cap at **59 s**.

**Upload**
11. Upload the clean master to each platform. Never re-upload a file downloaded from another app.
12. Turn on the AI label on **all three** (TikTok AI-generated label, YouTube "altered or synthetic content", Instagram AI label).
13. Title (YouTube) ≤ **100 chars**, hook in the first ~40. **3–5 hashtags** on every platform (Instagram cap is 5).
14. Description: hook line, a one-line "Sources:" summary, and "Full sources: link in profile". Keep it **≤ 2,200 chars** so one text works everywhere.
15. Cover: upload a custom cover on Instagram and TikTok (desktop); on YouTube pick a frame until we're in YPP.

**Music**
16. Bake in only music and SFX we hold a multi-platform licence for: **Epidemic Sound Creator plan** (YouTube channel safelisted) and **Freesound CC0** for SFX. No in-app library sounds in the master; no CC BY-NC.

**Hook**
17. Content proposition **by 3 s**, hook complete **by 6 s** (TikTok guidance); make the last line loop into the first frame.

---

## Sources

| ID | Publisher, title | Date | URL | Key quote |
|---|---|---|---|---|
| S1 | Meta, Ads Guide: Instagram Reels video | undated, seen 2026-10-15 | https://www.facebook.com/business/ads-guide/update/video/instagram-reels | "leaving at least 14% of the top, 35% of the bottom, and 6% on each side" |
| S2 | Socialync, Safe zones tool | read 2026-10-11 | https://www.socialync.io/tools/safe-zones | TikTok 240/660/120/120; YouTube 288/672/48/192; Instagram 14%/35%/6% |
| S3 | Socialync, TikTok safe zone | read 2026-10-11 | https://www.socialync.io/tools/safe-zones/tiktok | button column "180 px wide, starting 840 px from the top"; TikTok's file "does not print the width of the button column" |
| S4 | Adkit, YouTube Shorts safe zones | updated 2026-09-10 | https://adkit.so/tools/safe-zones/youtube | "Measured from the official 1080 × 1920 transparent PNG" |
| S5 | Google Ads Help, video ad specs | undated, seen 2026-10-15 | https://support.google.com/google-ads/answer/13547298?hl=en-GB | "Overlays, call to actions and buttons may appear in different places depending on the format, campaign type and screen." |
| S6 | TikTok Ads Help, Auction In-Feed Ads | last updated June 2026 | https://ads.tiktok.com/help/article/tiktok-auction-in-feed-ads?lang=en | "The safe zone size is determined by the dimension (vertical, horizontal, or square)"; size "Less than or equal to 500 MB"; bitrate "More than or equal to 516 kbps" |
| S7 | TikTok Ads Help, Reservation In-Feed Ads | last updated July 2025 | https://ads.tiktok.com/help/article/tiktok-reservation-in-feed-ads-reach-frequency?lang=en | "the longer the caption, the smaller the safe zone will be." |
| S8 | YouTube Help, Understand three-minute YouTube Shorts | undated, seen 2026-10-15 | https://support.google.com/youtube/answer/15424877?hl=en | "Shorts longer than one minute that have an active Content ID claim, regardless of the policy, will be blocked on YouTube." |
| S9 | Social Media Today, Instagram expands Reels to 3 minutes | 2025-01-18 | https://www.socialmediatoday.com/news/instagram-officially-expands-reels-length-3-minutes/737766/ | "Starting today, you can upload Reels to Instagram up to three minutes long." |
| S10 | Meta for Developers, IG User Media reference | undated, seen 2026-10-15 | https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-user/media | "VBR, 25Mbps maximum"; "300MB maximum"; "Maximum 2200 characters, 30 hashtags, and 20 @ tags." |
| S11 | TikTok for Developers, Media transfer guide | updated 2026-08-04 | https://developers.tiktok.com/doc/content-posting-api-media-transfer-guide | "Minimum of 23 FPS"; "Maximum of 4GB"; longest video via the API "is 10 minutes" |
| S12 | TikTok for Developers, Direct Post reference | undated, seen 2026-10-15 | https://developers.tiktok.com/doc/content-posting-api-reference-direct-post | "The maximum length is 2200 in UTF-16 runes."; is_aigc: "Set to true if the video is AI generated content." |
| S13 | YouTube Help, Recommended upload encoding settings | undated, seen 2026-10-15 | https://support.google.com/youtube/answer/1722171?hl=en | 1080p SDR standard frame rate: 8 Mbps; AAC-LC, 48 kHz (secondary summary of the table) |
| S14 | YouTube Help, title and description limits | undated, seen 2026-10-15 | https://support.google.com/youtube/answer/57407?hl=en | "Video titles have a character limit of 100 characters"; "Video descriptions have a character limit of 5,000 characters" |
| S15 | YouTube Help, Hashtags | undated, seen 2026-10-15 | https://support.google.com/youtube/answer/6390658?hl=en | "If a video or playlist has more than 60 hashtags, we'll ignore each hashtag on that content." |
| S16 | YouTube Blog, custom thumbnail updates | 2026-07-24 | https://blog.youtube/news-and-events/youtube-studio-custom-thumbnail-updates/ | "YouTube Partner Program creators can start uploading custom thumbnails for Shorts." |
| S17 | Social Media Today, Instagram hashtag limits | 2025-12-18 | https://www.socialmediatoday.com/news/instagram-implements-new-limits-on-hashtag-use/808309/ | "Instagram will gradually update the number of hashtags that you can include in a caption for a reel or post to five." |
| S18 | RouteNote, TikTok custom covers | 2024-01-16 | https://routenote.com/blog/upload-tiktok-thumbnail/ | "must be JPG, JPEG or PNG, and 3:4 ratio" |
| S19 | TikTok, Creator Rewards Program Terms (US) | last update 2026-07-20 | https://www.tiktok.com/legal/page/global/creator-rewards-program-us/en | "a duration of at least 1 minute publicly posted on the Platform" |
| S20 | TikTok Newsroom, How TikTok recommends videos #ForYou | 2020-06-18 | https://newsroom.tiktok.com/en-us/how-tiktok-recommends-videos-for-you/ | "neither follower count nor whether the account has had previous high-performing videos are direct factors" |
| S21 | TikTok Ads Help, Creative best practices | last updated June 2025 | https://ads.tiktok.com/help/article/creative-best-practices | "Prioritize your hook in the first 6 seconds to boost engagement and increase watch time." |
| S22 | YouTube Blog, Getting started with Shorts | 2025-04-08 | https://blog.youtube/creator-and-artist-stories/your-guide-to-getting-started-with-youtube-shorts/ | "Capture attention in the first few seconds to prevent viewers from scrolling." |
| S23 | Digital Music News, Shorts view counting | 2025-03-27 | https://www.digitalmusicnews.com/2025/03/27/how-does-youtube-shorts-count-views-2025/ | "count a view whenever a Short starts to play or replay, with no minimum watch time requirements." |
| S24 | Instagram, Instagram Ranking Explained | 2023-05-31 | https://about.instagram.com/blog/announcements/instagram-ranking-explained | shows less of "low-resolution or watermarked reels" |
| S25 | TechCrunch, Instagram restricts reach of aggregators | 2026-04-30 | https://techcrunch.com/2026/04/30/instagram-restricts-reach-of-content-aggregators-in-new-crackdown/ | original = "content someone wholly created or reflects their unique perspective" |
| S26 | Social Media Today, own logo on Reels is OK | 2024-10-23 | https://www.socialmediatoday.com/news/instagram-clarifies-including-your-own-logo-on-a-reel-is-ok/730852/ | "if it's your own logo, don't worry about it" |
| S27 | Tubefilter, Reels with TikTok watermark less discoverable | 2021-02-10 | https://tubefilter.com/2021/02/10/instagram-reels-with-tiktok-watermark-less-discoverable/ | content "that is visibly recycled from other applications" (via search snippet, page not opened) |
| S28 | YouTube Help, Disclosing altered or synthetic content | undated, seen 2026-10-15 | https://support.google.com/youtube/answer/14328491?hl=en | "Cloning one's own voice to create voice overs or dubs" (listed as minor); "Labels may appear in the expanded description for non-music AI-generated audio" |
| S29 | YouTube Blog, Disclosing AI-generated content | 2024-03-18 | https://blog.youtube/news-and-events/disclosing-ai-generated-content | "synthetically generating a person's voice to narrate a video" |
| S30 | Meta Help, How to identify AI content | "Updated: 21 weeks ago" (≈ May 2026) | https://www.meta.com/en-gb/help/artificial-intelligence/1783222608822690/ | "A reel narrated with a realistic AI-generated voiceover" |
| S31 | TikTok Newsroom, Partnering to advance AI transparency | 2024-05-09 | https://newsroom.tiktok.com/partnering-with-our-industry-to-advance-ai-transparency-and-literacy?lang=en | "have required creators to label realistic AIGC for over a year" |
| S32 | YouTube Help, Channel monetisation policies | policy change 2025-07-15, seen 2026-10-15 | https://support.google.com/youtube/answer/1311392?hl=en | "AI-generated content made with generic or unoriginal templates" |
| S33 | TikTok Ads Help, Commercial Music Library | last updated July 2025 | https://ads.tiktok.com/help/article/commercial-music-library?lang=en | "Businesses should instead use the Commercial Music Library for all commercial TikTok activities" |
| S34 | YouTube Help, Manage Shorts as a rights holder | undated, seen 2026-10-15 | https://support.google.com/youtube/answer/13053317?hl=en | "This Shorts audio library is populated with music tracks from record label partners" |
| S35 | Epidemic Sound, Creator plan | undated, seen 2026-10-15 | https://www.epidemicsound.com/our-plans/creator-plan/ | "Monetize 1 channel per platform"; "The Creator plan doesn't cover licensing for digital ads." |
| S36 | Pixabay, Content License summary | undated, seen 2026-10-15 | https://pixabay.com/service/license-summary/ | "Use Content without having to attribute the author" |
| S37 | Freesound, FAQ | undated, via search 2026-10-15 | https://freesound.org/help/faq/ | CC0: "you can do pretty much what you want with the sound" |
| S38 | Wikipedia, Audio normalization | undated, via search 2026-10-15 | https://en.wikipedia.org/wiki/Audio_normalization | −14 LUFS described as YouTube's preferred level (secondary, unofficial) |
| S39 | Production Advice, AES TD1008 explained | 2021-10-01 | https://productionadvice.co.uk/td1008/ | "For speech-only and "Assorted" content, the recommended online Distribution Loudness is -18 LUFS." |
| S41 | Tubefilter, Shorts links no longer clickable | 2023-08-10 | https://tubefilter.com/2023/08/10/youtube-shorts-comments-spam/ | links in Shorts descriptions "will no longer be clickable" from 2023-08-31 (via search snippet) |

(S40 intentionally unused: I could not load Meta's Sound Collection terms.)

Note on quotes: pages were read through a summarising fetch tool, so quotes are as returned by that tool. Re-check the exact wording on S1, S28, and S30 before quoting them on screen.
