# Secretly Works: channel kit

v0.1, 2026-10-15; updated 2026-10-16 (handle, logo, watermark: owner decisions; § 3 copy rewritten after owner feedback); 2026-10-28 (a poll on every post, § 5; one bio on all three, § 3; owner decisions). Owner: brand-director. The copy, asset specs and setup steps for the YouTube, TikTok and Instagram profiles. Rules for the profile come from brand.md § Channel identity; this file holds the values. Profile copy: the owner picked one variant per field on 2026-10-16 (✅, § 3). The logo is chosen (mark C, the "S-line", Night palette, § 4); the assets below are specs, not files yet.

Tags: **[official]** = the platform's own help or developer page; **[secondary]** = third-party guide (the official page was not loadable or doesn't state it); **[analysis]** = our reasoning. All pages seen **2026-10-15**. TikTok's and Instagram's help centres render with JavaScript and returned no text to the fetch tool, so their character limits are **unverified**: check them in the app's Edit profile screen (it refuses over-long text).

## 1. Platform specs

### Profile picture (all three show it as a circle)

| | Upload | Shown at | Formats, file size | Source |
|---|---|---|---|---|
| YouTube | No size stated officially; **800 × 800** is the common recommendation **[secondary]** | **98 × 98 px** **[official]** | JPG, GIF, BMP or PNG, no animated GIFs; **≤ 15 MB** **[official]** | [YouTube Help 10456525](https://support.google.com/youtube/answer/10456525?hl=en); 800 × 800: [joinotto](https://joinotto.com/blog/youtube-profile-picture-guide/) |
| TikTok | Square; size not found | Circle | **Unverified** (help page not loadable) | [TikTok Help, Adding a profile photo](https://support.tiktok.com/en/getting-started/setting-up-your-profile/adding-a-profile-photo) (no text returned) |
| Instagram | Square; stored at **320 × 320** | **110 × 110** on mobile | **[secondary]**, guides disagree on desktop size | [firstpier](https://www.firstpier.com/resources/instagram-profile-picture-size) |

**One file for all three: 800 × 800 PNG** [analysis]. It is above every reported size, far under 15 MB, and the circle crop is the same everywhere.

**Circle crop** [analysis]: the corners of the square are never seen. Keep the symbol inside a **centred circle of 640 px diameter** (80%), so it clears the circle edge and Instagram's story ring. At 98 px on screen, 1 px = 8 px of the 800 master, so **no stroke or gap thinner than 16 px** in the master (2 px on screen). Background fills the whole square (no transparency: platforms put their own white or black behind transparent pixels).

### YouTube banner

| Spec | Value | Source |
|---|---|---|
| Minimum upload | **2048 × 1152 px, 16:9** | [official] [10456525](https://support.google.com/youtube/answer/10456525?hl=en) |
| Recommended | **2560 × 1440 px** ("especially for TV") | [official] same page |
| File size | **≤ 6 MB** | [official] same page |
| Format | Not stated for the banner; PNG or JPG is standard | unverified |
| Text and logo safe area | **1235 × 338 px at 2048 × 1152** | [official] same page |
| Same safe area at 2560 × 1440 | **1546 × 423 px, centred: x 507 to 2053, y 508 to 931** (the official figure × 1.25 gives 1544 × 423, which matches the guides) | [analysis]; [async.com](https://async.com/blog/youtube-banner-size/) |
| TV | The whole 2560 × 1440 | [secondary] async.com, [b2w](https://www.b2w.tv/blog/youtube-banner-size-guidelines?hsLang=en) |
| Desktop | Centre strip **2560 × 423** (y 508 to 931) | [secondary] same |
| Tablet | Centre **1855 × 423** (x 352 to 2207) | [secondary] same |
| Mobile | Centre **1546 × 423** (= the safe area) | [secondary] same |
| Avoid | Shadows, borders and frames | [official] 10456525 |

Desktop also overlays link icons in the strip's bottom-right corner; we have no links, so nothing appears there [secondary, async.com].

### YouTube video watermark (branding image)

| Spec | Value | Source |
|---|---|---|
| Size | Square, **minimum 150 × 150 px** | [official] [10456525](https://support.google.com/youtube/answer/10456525?hl=en) |
| File size | **< 1 MB** | [official] same |
| Format | Not stated on the page; PNG with transparency is the usual choice | unverified |
| When shown | Last 15 s, from a custom start time, or the whole video | [official] same |
| Where | Landscape view on computers and mobile; not clickable on mobile; not on made-for-kids videos | [official] same |

It is a player overlay, not part of our master, and it shows only in landscape view, so our vertical Shorts would not carry it. **✅ Owner decision (2026-10-16): make the file (`watermark-300.png`, § 4) but leave it switched off on YouTube until long-form exists** (CLAUDE.md says "No on-screen watermark").

### Names, handles, bios

| Field | YouTube | TikTok | Instagram |
|---|---|---|---|
| Display name | API: **30 characters** max (`brandingSettings.channel.title`, [official, YouTube Data API](https://developers.google.com/youtube/v3/docs/channels)); guides say 100. Change **twice per 14 days** ([official, 2657964](https://support.google.com/youtube/answer/2657964?hl=en)) | **30 characters**, change once per 7 days (**[secondary]**, guides conflict: [socialz](https://socialz.ai/blog/how-to-change-your-name-on-tiktok)) | **30 characters** (**[secondary]**, unverified); change **twice per 14 days** (official snippet, Meta Verified article, [help.instagram.com](https://help.instagram.com/2994759677322122/)) |
| Handle | **3 to 30 characters**; letters and numbers; `_ - . ·` allowed but not first or last; not case-sensitive ([official, 11585688](https://support.google.com/youtube/answer/11585688?hl=en)); change twice per 14 days ([official, 2657964](https://support.google.com/youtube/answer/2657964?hl=en)) | **2 to 24 characters**; letters, numbers, `_` and `.`; change once per 30 days (**[secondary]**, [onlypult](https://onlypult.com/blog/how-to-change-tiktok-username)) | **30 characters**; letters, numbers, `.` and `_` (**[secondary]**, unverified) |
| Bio / description | **1,000 characters** ([official, Data API](https://developers.google.com/youtube/v3/docs/channels)); the first ≈ 100 to 150 show in search previews ([secondary, influencermarketinghub](https://influencermarketinghub.com/youtube-character-limits/)) | **80 characters** widely reported, some accounts report 160 (**[secondary], conflicting**). We write ≤ 80 | **150 characters** (**[secondary]**, unverified) |
| Keywords | **500 characters in total**, space-separated, phrases in quotes ([official, Data API](https://developers.google.com/youtube/v3/docs/channels)) | none | none |

## 2. Handle

**The handle is `@thesecretlyworks` on all three platforms.** ✅ Owner decision, 2026-10-16: the owner checked it is free on YouTube, TikTok and Instagram. The channel **name** stays "Secretly Works".

| Handle | Length | YouTube | TikTok | Instagram |
|---|---|---|---|---|
| `@thesecretlyworks` | 16 | ✅ free (owner); format allowed, 3 to 30 characters ([official, 11585688](https://support.google.com/youtube/answer/11585688?hl=en)) | ✅ free (owner); fits 2 to 24 (secondary) | ✅ free (owner); fits 30 (secondary). The existing account is **renamed from `@secretlyworks`** (§ 5) |

Handles are not case-sensitive on YouTube (official) or Instagram (secondary). Why this one [analysis]: it keeps the name whole with no punctuation people forget when it is said aloud.

**Instagram rename, ✅ owner decision:** the existing account moves from `@secretlyworks` to `@thesecretlyworks` so all three match. The owner accepts that `@secretlyworks` is then freed and anyone may claim it.

History: `@secretlyworks` was not free on YouTube and `@howitsecretlyworks` was taken there (owner, 2026-10-15); `@secretly.works` was unavailable (owner, 2026-10-16). `@secretlyworkshq` and `@secretly_works` were the fallbacks, no longer needed.

## 3. Copy, ready to paste

Character counts include spaces; ↵ marks a line break. Rewritten 2026-10-16 after owner feedback ("those descriptions are just like AI ... enough for people to understand what we do and not how", `feedback.md`). The rules for this copy (brand.md § Channel identity, Profile copy):

- **What the visitor gets.** The everyday things they'll see and what those secretly do. **"in 3D" is allowed as a format tag** (✅ owner decision, 2026-10-28); no other process words: no sourcing, no AI-voice line, no style, no tools. The AI disclosure is the per-post platform label (§ 5, every upload).
- **Short.** YouTube: the bio, plus at most two short sentences. TikTok and Instagram: the bio, one line. Search words go in the keywords field, not the description.
- **Spoken.** Read it aloud; if a real person wouldn't say it to a friend, rewrite it. None of: "Ever wondered", "dive into", "unlock", "the hidden world of", "Join us", "Your daily dose of", lists of three (except the bio's "Cars, roads and gadgets", ✅ owner decision, 2026-10-28), colon or em-dash taglines, an opening question answered by the next line, emoji strings, exclamation marks (brand.md § Voice, banned patterns).
- **One channel, one bio** (✅ owner decision, 2026-10-28): the same bio on all three accounts, and the YouTube description opens with it. The 2026-10-16 pronoun split ("we" / "I" / none) is retired.

The ✅ entry in each field is the owner's choice (2026-10-16, or 2026-10-28 where dated); the other variants stay below as alternatives, with their original letters.

**2026-10-28 (✅ owner decision): one bio on all three accounts, variant D:** `How everyday things secretly work. Cars, roads and gadgets, in 3D.` (66 by this file's count; the brief said 67; fits TikTok's 80 and Instagram's 150). Why: ≈ 0.7 followers per 1,000 views (`feedback.md` § Platform numbers), and the old bios didn't say what a visitor gets. The rules above and brand.md § Channel identity, Profile copy were amended to fit it (✅ owner decision, CHANGELOG v0.13.4). The 2026-10-16 choices below are history.

### YouTube

- **Channel name:** `Secretly Works` (14)
- **Handle:** `@thesecretlyworks` (§ 2)

**Description, variant D (✅ owner decision, 2026-10-28, live; 221 characters, no pronoun).** Opens with the bio; no schedule, no link.

```
How everyday things secretly work. Cars, roads and gadgets, in 3D. Each short video picks one thing you use all the time, like the sensor inside your tire or the number on a highway exit, and shows the part you never see.
```

History: **description, variant B** (owner choice 2026-10-16, replaced by D 2026-10-28; 208 characters, "we").

```
We make short videos about the everyday things around you and what they're really up to. Pretty much anything you touch on a normal day has a story going on inside it, and that's the part we love showing you.
```

Alternatives:

**Description, variant A (257 characters, "I").**

```
Every video here takes something you use all the time and shows you what it's really up to. I love finding out how ordinary things work, and the answer is usually more interesting than you'd guess.

First up is your phone, and whether it's listening to you.
```

(Its "First up" line dates: after No. 002, replace it with the newest video's subject or delete it.)

**Description, variant C (161 characters, no pronoun).**

```
Short videos about the everyday things around you and what they're really up to. Most of the stuff you use without thinking is doing a lot more than you'd guess.
```

**Channel keywords** (152 of 500). In Studio, enter them one at a time (each phrase as one keyword); in the API form they look like this:

```
"Secretly Works" "how things work" "how it works" explained explainer "3D animation" "everyday things" "hidden systems" "ad tracking" technology science
```

**Channel trailer (optional, later).** Not needed at launch; it only shows to non-subscribers on the channel page. Once No. 001 to No. 003 are out: a 20 to 30 s cut made from them, opening bookend (phone wakes, pull back into the slice), the orange leaving through the wall in one video and arriving in another's slice, closing bookend (phone locks). One spoken line, no new claims: "Every video opens an everyday place and follows the hidden system running through it." Uses only approved footage; the director and scene-builder build it, the owner approves.

### TikTok

- **Name:** `Secretly Works` (14)
- **Username:** `@thesecretlyworks` (§ 2)
- **Bio, variant D (✅ owner decision, 2026-10-28; 66, no pronoun):** `How everyday things secretly work. Cars, roads and gadgets, in 3D.`
- History: variant A (owner choice 2026-10-16, replaced 2026-10-28; 57, "I") `I love showing you what everyday things are really up to.`
- Alternatives: variant B (57) `Short videos about what everyday things are really up to.`; variant C (58) `The everyday stuff around you, and what it's really doing.`

All three fit TikTok's lowest reported limit (80).

### Instagram

- **Name field** (searchable; ≤ 30, unverified): variant A `Secretly Works` (14) (✅ owner choice, 2026-10-16). Alternatives: variant B `Secretly Works | How It Works` (29); variant C `Secretly Works | Explainers` (27). It replaces the current "Secretly Works | Tech in 3D", which narrows the topic to tech (brand.md § Promise).
- **Username:** `@thesecretlyworks` (§ 2; renamed from `@secretlyworks`)
- **Bio, variant D (✅ owner decision, 2026-10-28; 66, no pronoun):** `How everyday things secretly work. Cars, roads and gadgets, in 3D.`
- History: variant B (owner choice 2026-10-16, replaced 2026-10-28; 80, no pronoun) `Short videos about the everyday things around you and what they're really up to.`
- Alternatives: variant A (98, "I") `The everyday things around you are up to a lot more than you'd guess, and I love showing you what.`; variant C (96, two lines) `What the everyday things around you are really up to.` ↵ `First up, whether your phone is listening.` (line 2 dates: update or drop it after No. 002)
- **Category:** **Education** (alternative: *Science, Technology & Engineering*). Category lists change in-app; pick the closest match. Show the category on the profile: off (it adds a line and says less than the bio) [analysis].

## 4. Asset list (for the scene-builder)

### The symbol: mark C, the "S-line", Night palette (✅ owner decision, 2026-10-16)

The spec every asset below is made from (values from the owner's comparison canvas; 🧪 until the exports are reviewed). A hatched rounded square (a cut face) with an orange S-shaped hidden path running through it, a dot at each end, on a dark navy ground. The orange line **is** the hidden system, so the symbol keeps "orange is reserved for the hidden system" (style-guide § 1). This settles the brand-director's earlier "no orange in the symbol" suggestion in favour of the owner's choice.

| Part | Value (viewBox `0 0 120 120`) |
|---|---|
| Ground | Full canvas, `#0d1322` (Night `bg`) |
| Square | x 18, y 18, size 84 × 84, rx 12; fill: hatch pattern; stroke ink, width 3.6 |
| Hatch | Background `#111830`; lines `#3a4668`, width 1.8, on a 6-unit pattern rotated 45° |
| Path | `M80 38 C 40 26, 36 54, 60 60 S 82 92, 40 84`, stroke width 7.5, round caps, no fill |
| Dots | r 5.5 at (80, 38) and (40, 84), line colour |
| Ink | `#efe9df` (`cut`) |
| Line (path and dots) | `#ff5b14` (`orange`, style-guide § 1): one orange across the channel. The comparison canvas used `#ff6a24`, a canvas value, not a separate owner choice |

Checks for the exports [analysis, against § 1's circle-crop numbers; not decided here]: at 800 px (6.67 px per unit) the hatch lines are 12 px, under the 16 px floor (they are texture, the square's 24 px stroke and the 50 px path carry the read; confirm on `profile-check-98.png`); the square's rounded corners reach ≈ 54 units from the centre, past the 640 px safe circle (48 units) but inside the 800 px crop, so either scale the mark to ≈ 0.88 for the profile picture or accept corners near the ring, judged on the check files.

### Exports

All in `brand/assets/`, made from the spec above. Colours from `src/theme.ts` (style-guide § 1) where a token exists; the hatch colours `#111830` / `#3a4668` are logo-only values with no theme token.

| File | Size | Format | Use | Notes |
|---|---|---|---|---|
| `symbol.svg` | vector | SVG | Master of the symbol | Source for every PNG below |
| `lockup.svg` | vector | SVG | Master of symbol + "Secretly Works" wordmark | Wordmark in the brand fonts (Archivo 800 or Inter, style-guide § 6); outlined to paths |
| `profile-800.png` | 800 × 800 | PNG, opaque, sRGB | Profile picture on all three | Symbol inside the centred 640 px circle; full-bleed background; no stroke or gap under 16 px; no text |
| `profile-check-98.png` | 98 × 98 | PNG | Review only, not uploaded | `profile-800.png` scaled down with a circle mask; must still read |
| `profile-check-110.png` | 110 × 110 | PNG | Review only, not uploaded | Same, Instagram's mobile size |
| `banner-2560x1440.png` | 2560 × 1440 | PNG, ≤ 6 MB | YouTube banner | Lockup, with the tagline "How everyday things secretly work" (Inter 600) under the wordmark, centred inside x 507 to 2053, y 508 to 931; no other text; nothing readable outside that box; background fills the whole canvas (TV shows all of it); no shadows, borders or frames. If over 6 MB, export `banner-2560x1440.jpg` at quality ≥ 90 instead |
| `banner-check-overlay.png` | 2560 × 1440 | PNG, transparent | Review only | Outlines of the TV, desktop, tablet and mobile crops (§ 1) to lay over the banner |
| `watermark-300.png` | 300 × 300 | PNG, transparent, < 1 MB | YouTube branding image: **made, but switched off on YouTube until long-form exists** (✅ owner decision, 2026-10-16) | Symbol only, one colour; 2× the 150 px minimum so it stays sharp |
| `lockup-dark-1600x400.png` | 1600 × 400 | PNG, transparent | Lockup on dark backgrounds (other uses) | Light ink (`cut` `#efe9df`) |
| `lockup-light-1600x400.png` | 1600 × 400 | PNG, transparent | Lockup on light backgrounds | Dark ink (`ink` Day `#1b1d22`) |
| `symbol-1024.png` | 1024 × 1024 | PNG, transparent | General use | Symbol only |

Banner background (TV sees the full 2560 × 1440): a flat mood `bg` or a wide Section render with nothing readable in it is the brand-director's suggestion; the choice is the owner's, with the logo direction. Readable text on the banner: the lockup plus **one tagline, "How everyday things secretly work"**, in Inter 600 under the wordmark, inside the safe area (x 507 to 2053, y 508 to 931) (✅ owner decision, 2026-10-16). The tagline is the only readable text besides the lockup: no schedule, no link, no other line.

## 5. Setup checklist for the owner

Where an account already exists (brand.md § Name: an Instagram account and a YouTube channel named "Secretly Works"), skip the "create" step and update it.

### Before you start
1. **Claim the handle first** (§ 2): `@thesecretlyworks` on all three, the same day (the owner checked it is free on each; claim it before anyone else can).
2. Have the final `profile-800.png` and `banner-2560x1440.png` and this file open.
3. Use one business email for all three (not a personal one), with two-factor sign-in on each.

### YouTube
1. Create the channel as a **Brand Account** under that email (lets you add managers later; the channel name is independent of your Google name). Skip if it exists.
2. YouTube Studio → Customization → Profile: **Name** `Secretly Works`; **Handle** `@thesecretlyworks`. Both can change only twice in 14 days, so paste carefully.
3. Same page: paste **Description** (variant chosen). **Links: none. Contact email:** optional.
4. Upload **picture** `profile-800.png` and **banner** `banner-2560x1440.png`; check the device previews. **Video watermark: leave it off.** `watermark-300.png` is made and kept in `brand/assets/`, but it stays switched off on YouTube until long-form exists (✅ owner decision, 2026-10-16; it only shows in landscape view, so Shorts wouldn't carry it).
5. Settings → Channel → Basic info: paste the **keywords**.
6. Settings → Channel → Advanced settings: **Audience: "No, set this channel as not made for kids."**
7. Settings → Upload defaults → Advanced settings: **Category: Education**.
8. Verify the channel with a phone number (Settings → Channel → Feature eligibility).
9. On every upload: **Altered or synthetic content → Yes** (brand.md § Sourcing policy, AI label on all three; costs nothing, P§6).
10. On every upload: **a poll** (✅ owner decision, 2026-10-28): a poll post (Posts tab) with the question and answers from `publish.md`, linking the Short, published right after it.

### TikTok
1. Sign up in the app with the business email. Keep it a **personal (creator) account**, not Business: the Business music library is restricted, and third-party guides say Business accounts can't join Creator Rewards [secondary, unverified].
2. Profile → Edit profile → **Username** `thesecretlyworks` (the same as on the other two). Changeable once per 30 days. If TikTok refuses it after all, stop and tell the brand-director before changing any platform (one handle on all three, § 2).
3. **Name** `Secretly Works`; **Bio** (variant chosen); **photo** `profile-800.png`. Website: none.
4. Settings → Privacy: **Private account off** (public).
5. On every post: More options → **AI-generated content: on** (brand.md § Sourcing policy).
6. On every post: **the poll sticker, added at posting or afterwards on the posted video** (✅ owner decision, 2026-10-28; adding it after posting works, owner observation 2026-10-28; text from `publish.md`), in the sky band (x 120 to 888, y 288 to 430), never over the captions or the title block, timed to the last scene only (🧪 values); if the editor can't time it, no sticker: use the pinned-comment emoji poll from `publish.md` (✅ owner decision, 2026-10-28: the first second stays clean).
7. On every post: **the caption from `publish.md`**: hook question, tease, poll question, then `Illustrative scene.` (when the video has invented specifics) and always `Sources: YouTube description.` (brand.md § Sourcing policy).

### Instagram
1. Log in to the existing "Secretly Works" account and, in Edit profile, **rename the Username from `secretlyworks` to `thesecretlyworks`**. ✅ Owner decision: the old handle `@secretlyworks` is freed by the rename and anyone may claim it; the owner accepted that. Old links to `@secretlyworks` stop working.
2. Settings → Account type and tools → **Switch to professional account → Creator**; **Category: Education**; display category on profile: off. Professional accounts are public.
3. Edit profile: **Name** (variant chosen, replacing "Secretly Works | Tech in 3D"), **Bio** (variant chosen), **photo** `profile-800.png`. Links: none.
4. On every reel: Advanced settings → **AI label: on** (required for a realistic AI voiceover, P§6).
5. On every reel: **the poll sticker** (✅ owner decision, 2026-10-28; text from `publish.md`), placed and timed as on TikTok, or on a Story that shares the Reel; if the sticker can't be timed, isn't available, or the poll has more answers than the sticker takes (two), the pinned-comment emoji poll from `publish.md` instead (✅ owner decisions, 2026-10-28).
6. On every reel: **the caption from `publish.md`**, as on TikTok (§ 5 TikTok, line 7).

### Avoid
1. Linking or cross-posting from personal accounts (personal Facebook, a personal TikTok, a personal YouTube channel) or connecting the profiles to unrelated pages. If Instagram asks to connect a Facebook Page, skip it unless a channel Page exists.
2. Uploading a file downloaded from another app; always the clean master (brand.md § What we never do).
3. In-app music or sounds on any post (brand.md § What we never do).
4. A posting schedule or a link in any bio or on the banner (owner decision).
5. Renaming the channel or handle after launch (each platform limits changes, and old links break).
6. Bought followers, follow-for-follow, or engagement groups.
