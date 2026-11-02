# Long-form research: horizontal YouTube videos and Shorts cut from them

Research date: 2026-11-01. Tags as in `platforms.md`: **[official]** (platform or standards body page), **[secondary]** (a third party reporting an official source), **[analysis]** (my arithmetic or a house choice). Source IDs (LF-S1 …) point to the list at the end. Cited from `brand.md` and `style-guide.md` as **LF§**.

**Biggest caveat.** YouTube publishes **no safe-zone template for organic landscape video** (none found, as with Shorts in P§1). The player-UI bands in § 2 are measured by reasoning from how the player behaves, not from a Google file. The TV and broadcast numbers (§ 1) are standards; the YouTube numbers are a house reading.

---

## 1. Broadcast safe areas (1920 × 1080)

| Area | Definition | In our frame | Source |
|---|---|---|---|
| Action-safe | 93% of width and height, centred | x 67 to 1853, y 38 to 1042 | **[official]** SMPTE ST 2046-1:2009 (LF-S1) |
| Title-safe | 90% of width and height, centred | x 96 to 1824, y 54 to 1026 | **[official]** SMPTE ST 2046-1:2009; RP 2046-2 uses the same 90% for 16:9 (LF-S1, LF-S2) |
| Legacy 80% title area | deprecated except for CEA-708 caption formatting | x 192 to 1728, y 108 to 972 | **[official]** as described in RP 2046-2 (LF-S2) |

Modern TVs rarely overscan, but some still do, and the YouTube TV app draws its own overlays (§ 2), so title-safe is the floor for readable text, not the target.

## 2. YouTube's player over a landscape video **[analysis]**

What can sit on top of the picture, from how the players behave (no official pixel figures found):

| Where | What covers it | When |
|---|---|---|
| Bottom ≈ 10% (desktop, mobile landscape) | Progress bar, control row and their dark gradient | On hover, tap or pause; hides during playback |
| Bottom ≈ 25% (TV app) | Title, progress bar, suggested row | On pause or any remote press |
| Top ≈ 10% (fullscreen desktop, embeds, TV) | Video title, channel, icons (watch later, share) at top right | On hover or pause |
| Bottom-right corner | The channel's **branding watermark** (YouTube shows it only on landscape videos, `brand.md` § Channel identity) and, in the last 5 to 20 s, **end-screen elements** | Watermark: the whole video or its end; end screen: the last 5 to 20 s |
| Centre | Play/pause glyph on tap | Brief |

**Phones fill-cropping.** A 20:9 phone in landscape shows a 16:9 video pillarboxed; pinch-to-fill crops it to 20:9: visible height = 1920 ÷ (20/9) = **864 px**, so **108 px** are lost at the top and the bottom. Anything readable inside **y 108 to 972** survives the fill. (Arithmetic; the pinch-to-fill behaviour is general knowledge, not checked on a Google page.)

**Inline portrait player.** A phone held upright plays a landscape video in a strip about 390 pt wide: the 1920 frame shows at ≈ 0.2 scale, so a 52 px caption reads at ≈ 10 pt. Small but legible; text under ≈ 26 px (≈ 5 pt there) is lost. Hence the 26 px floor kept from the vertical guide.

**House readable rectangle** (used in style-guide § 11): **x 144 to 1776, y 120 to 960**. Top 120 clears the hover title band (≈ 108) and the 20:9 fill-crop (108); bottom 960 clears the control row (≈ y 972 up) and the 20:9 crop; sides 144 sit 48 px inside title-safe so left-aligned text keeps a margin on an overscanning TV. Bottom-right **x ≥ 1560, y ≥ 780** stays free of readable overlays for the watermark.

## 3. YouTube features the format relies on

| Feature | Rule | Source |
|---|---|---|
| Chapters | "Make sure that the first timestamp you list starts with 00:00"; "at least three timestamps listed in ascending order"; "the minimum length for video chapters is 10 seconds". Timestamps go in the description | **[official]** YouTube Help, "Video chapters" (LF-S3, read 2026-11-01) |
| End screens | Only in the last **5 to 20 s**; the video must be **≥ 25 s**; up to 4 elements on 16:9, at least one a video or playlist | **[official]** YouTube Help, "Add end screens to videos" (LF-S4); one secondary report says end screens may now need YPP, not confirmed |
| Shorts → long video link | One **"related video"** link per Short, to any video on the same channel; set in YouTube Studio (desktop) or at upload | **[secondary]** Search Engine Land, Tubefilter (2023-08/09, LF-S5, LF-S6); YouTube's blog speaks of it only in general terms. Click-through reported as low (one guide: ≈ 0.05%, anecdotal) |
| Links on TikTok and Instagram | Not clickable in captions | P§3 (unverified there too) |

## 4. Captions for TV and desktop

| Item | Value | Source |
|---|---|---|
| Characters per line | **42**, max **2 lines** | **[official]** Netflix English (USA) Timed Text Style Guide, last change 2025-12-19 (LF-S7) |
| Reading speed | up to **20 characters/s** (adult) | **[official]** same (LF-S7) |
| Line width | ≤ **68%** of a 16:9 frame's width; captions within the central 75% horizontally, 90% vertically; 2 lines max | **[secondary]** Clevercast's reading of the BBC subtitle guidelines (LF-S8); BBC page not reachable from here |
| Reading speed | **160 to 180 wpm** | **[secondary]** same (LF-S8) |
| Size | No primary figure found. Third-party pages report the BBC limits line height to ≈ 8% of video height online and a 44 px minimum for HD: **unverified**, not used |

**Sizing by angle [analysis].** What matters is the angle a letter takes at the viewer's eye:

| Setup | 1 px of the frame on screen | Viewing distance | 26 px label ≈ |
|---|---|---|---|
| Vertical video on a phone (≈ 70 mm wide shows 1080 px) | 0.065 mm | 300 mm | 0.0056 rad |
| Horizontal on a 13–14" laptop (≈ 300 mm shows 1920 px) | 0.156 mm | 600 mm | 0.0068 rad |
| Horizontal on a 55" TV (≈ 1,210 mm shows 1920 px) | 0.63 mm | 2,500 mm | 0.0066 rad |

So a pixel size from the 1080-wide vertical guide gives about the same (slightly larger) angular size in the 1920-wide frame on a laptop or a TV at normal distance. Sizes can carry over at **×1.0 to ×1.1**; there is no need to blow type up for TV. The inline portrait player (§ 2) sets the floor instead.

## 5. Narration length

- House measurement: our narrator runs **≈ 2.5 to 2.8 words/s = 150 to 168 wpm** (style-guide § 9 Pacing, from transcripts). At that rate **750 words ≈ 4:28 to 5:00**, **850 words ≈ 5:04 to 5:40**.
- Industry rule of thumb for narration: ≈ 150 to 160 wpm **[secondary, vendor pages; no primary study found]**.
- So a "≥ 5 min" video needs ≈ **800 to 900 words** at our pace; the owner's "5 min ≈ 750 words" assumes exactly 150 wpm. `yarn timings` is the check.

## 6. Reframing a horizontal scene to vertical **[analysis]**

| Method | What you get | Verdict |
|---|---|---|
| **Crop** the 1920 × 1080 master | A 9:16 window is **608 × 1080** px; filling 1080 × 1920 means a **1.78×** upscale (soft on a phone held at 30 cm, where our 1080-wide frames are judged). Overlays, captions and tags land where the 16:9 layout put them, mostly outside the window or in the vertical UI bands (P§1). Side-by-side stagings lose one side. The long lens's composition (a wide slice) becomes a tight slice with no sky band for the title block | Rejected |
| **Re-render** with the vertical camera | Same scenes, props, cast, voice and timings; the camera uses the vertical framings (fov, distances), side-by-side stagings stack (the twin-section convention), overlays use the vertical layout (style-guide § 6–7). Native 1080 × 1920, all vertical rules hold | **Recommended.** Cost: render time and a vertical framing per scene; Remotion renders are free and deterministic |

## Sources

- LF-S1: SMPTE ST 2046-1:2009, *Safe Areas for Widescreen Image Display*, https://pub.smpte.org/doc/st2046-1/20091123-pub/st2046-1-2009.pdf (seen 2026-11-01)
- LF-S2: SMPTE RP 2046-2:2009, https://pub.smpte.org/latest/rp2046-2/rp2046-2-2009.pdf (seen 2026-11-01)
- LF-S3: YouTube Help, "Video chapters", https://support.google.com/youtube/answer/9884579 (read 2026-11-01)
- LF-S4: YouTube Help, "Add end screens to videos", https://support.google.com/youtube/answer/6388789 (seen 2026-11-01, via search)
- LF-S5: Search Engine Land, "YouTube enables linking between Shorts and long-form videos", https://searchengineland.com/youtube-enables-linking-shorts-long-form-videos-430655 (seen 2026-11-01)
- LF-S6: Tubefilter, "YouTube's 'related links' connect Shorts, long-form videos, and live streams", 2023-09-01, https://tubefilter.com/2023/09/01/youtube-related-links-multi-format-creators-shorts-live-long-form/ (seen 2026-11-01)
- LF-S7: Netflix Partner Help, "English (USA) Timed Text Style Guide", https://partnerhelp.netflixstudios.com/hc/en-us/articles/217350977-English-USA-Timed-Text-Style-Guide (read 2026-11-01)
- LF-S8: Clevercast, "BBC Subtitling Guidelines", https://clevercast.com/bbc-subtitling-guidelines (read 2026-11-01)
