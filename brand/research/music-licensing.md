# Music and SFX licensing: ElevenLabs Music and Sound Effects in our masters

Research date: 2026-10-16. Question: can ElevenLabs Music and Sound Effects output, baked into the master, go on YouTube Shorts, TikTok and Instagram Reels, monetised later? Nothing was generated and nothing was spent. Tags: **[official]** (ElevenLabs or platform page), **[secondary]** (press, blogs, community), **[analysis]** (my reading, not sourced). Source IDs (M1 ...) point to the list at the end. ElevenLabs' legal pages limit verbatim quoting through my fetch tool, so a few cells are quoted in short pieces. Where I could not get exact wording, the cell is marked "paraphrase". **Not legal advice.**

**How the documents stack** [official]: the Music Terms (M1) are "Model-Specific / Service Terms" that sit on top of the Terms of Service (M3); where they conflict, the Music Terms win. Sound Effects made in the web app fall under the ElevenCreative Terms, Exhibit 4 (M4). All three were last updated **09 October 2026**.

---

## 1. Commercial use, per tier

### Music (M1 Exhibit A "Music Commercial Rights Table", M2, M6, M7)

| Tier (list price/month, M6) | Commercial use | Streaming distribution (DSPs) | Attribution | Eligibility | Monthly download limit | HQ download (WAV / 192 kbps) |
|---|---|---|---|---|---|---|
| Free | **No** (M3 § 1(c): "you may only use the Services for non-commercial purposes") | Prohibited | "Required (denote Eleven Music when distributing)" | "For Individual Use Only" | none listed | no |
| Starter ($6) | Yes: "All online and offline commercial use permitted, except film, TV, radio, and Studio Games" | **"Prohibited"** | "No Attribution Required" | "For Individual Use Only" | 30 min | no |
| Creator ($22) | Same as Starter | Permitted | None | "For Individual Use Only" | 250 min | no |
| Pro ($99) | Same as Starter | Permitted | None | "For Individual Use Only" | 500 min | yes |
| Scale ($299) | Same as Starter | Permitted | None | fewer than 10 employees (paraphrase) | 1,500 min | yes |
| Business ($990) | Same as Starter | Permitted | None | fewer than 50 employees (paraphrase) | 4,000 min | yes |
| Enterprise Music | "All online and offline commercial use permitted." | Permitted | None (custom co-branding possible) | none | custom | yes |

- Pricing page (M6): Starter lists "Commercial License" and "Music commercial use"; higher tiers say "Everything in [lower tier], plus". Prices are list prices; the page showed first-month promotions on 2026-10-16, so check the exact amount in the account **[unverified]**.
- Eleven Music API page (M2): "Songs are available for broad commercial use on all paid plans." "Film, TV, and large studio game rights require an Enterprise plan."
- Help centre (M5): "All paid plans include a commercial license, provided you're not using Beta Services." The music docs (M8) do not call Music a beta.
- "Studio Game" is a monetised game that isn't indie; "film, TV, radio" are broadcast and screen uses. **Social video is not excluded on any paid tier.** [analysis]
- **What "Music Streaming Distribution" means.** The definition (M1 § 4.8(g)): "means making Output available on a music streaming platform", including through a distributor or by "allowing a third party to do so" (paraphrase). The definition names no platform. ElevenLabs' own YouTube page (M7) says "Generated music can be used commercially on the starter+ plans", but also that this excludes "streaming". A Short is a video, not a release on a music service, so I read Starter as covering us. But TikTok and YouTube let other users reuse a post's audio ("original sound", "use this sound"). That could be read as "allowing a third party" to make the track available. **[analysis, unverified]** On **Creator and above** the question goes away, because streaming distribution is permitted.

### Sound Effects (M4 Exhibit 4, M9)

- ElevenLabs' Sound Effects page (M9) **[official]**: "Yes, all ElevenLabs Sound Effects are royalty free and can be used in commercial projects." "Our paid plans do not require attribution and can be used in commercial projects." The free plan "requires attribution to elevenlabs.io".
- ElevenCreative Terms, Exhibit 4 § 2 (M4) **[official]**: "You may use, reproduce, modify, distribute, publicly perform, and display Output", "for commercial purposes only where your plan permits commercial use". This is allowed in films, trailers, ads, videos, games and apps, **only when the sound is combined with other material** (paraphrase). You may not sell, license or distribute a sound **on its own**, as sample files, or "as part of any sound, sample, effects, or music library".
- The ElevenAPI Terms (M10) say nothing specific about Sound Effects. The ToS (M3) and the plan's commercial right then apply. **[official, silence noted]**
- So: **every paid tier, Starter included**, may use generated SFX in our videos. No credit is needed.

## 2. Limits

| Limit | What the terms say | Affects us? |
|---|---|---|
| Attribution | Free only (M1 Exhibit A; M5; M9) | No, on any paid tier |
| Platform restrictions | None. No platform is named anywhere in the Music Terms (M1). Media Rights cover "synchronization with audiovisual content" (paraphrase, § 4.8(d)) | No |
| "Not in content monetised on X" | No such clause found in M1, M3, M4 | No |
| Exclusivity | ToS § 10 (M3): "the Output generated by you using the Services may not be unique across users"; "Two different parties may receive the same or similar Output" | **Yes**: we have no exclusive rights, so we can't register our own track in Content ID either (§ 3) |
| Ownership | Music Terms § 2.2 (M1): "you retain any and all rights in and to your Input and Output" | OK. ElevenLabs also holds a "perpetual and irrevocable", "nonexclusive" licence over Inputs and Outputs to run and improve its services (ToS § 4(d), M3) |
| Registering with Content ID, distributors, PROs, copyright offices | **No clause either way** in M1, M3, M4, M10 | No ban on us. Also nothing stops *other* users from doing it (§ 3) |
| Prompts | No artist, songwriter, song, album, label or publisher names, no substantial lyrics (M1 § 2.1, paraphrase); no imitating a recording artist's voice (§ 3.3) | Fine: our beds are instrumental and generic |
| Music libraries, resale | You may not build or feed a "Music Library" without written permission (M1 § 4.2, paraphrase), and no standalone SFX (M4 Ex. 4 § 2) | No: we only put audio in our own videos |
| Eligibility | Free to Pro: "For Individual Use Only" | **Check:** if the channel is run by a company with staff, Scale (< 10 employees) is the first tier that fits [analysis] |
| Beta features | "content generated using Beta Services cannot be used for any commercial purpose" (M5) | Don't use any feature marked beta or alpha in the UI |

## 3. Content ID risk

**Does ElevenLabs register or fingerprint generated tracks?** No evidence that it does.
- The Music Terms, ToS, ElevenCreative and ElevenAPI Terms contain **no** clause about Content ID or fingerprinting, and none about registering Output (M1, M3, M4, M10) **[official, silence]**.
- ElevenLabs screens **uploads** (finetune audio, audio references) "for copyright compliance" (M8). I found nothing saying it screens or registers **outputs** **[official / unverified]**.
- § 3.4 (M1): ElevenLabs "may mark Output as AI-generated but does not warrant" a watermark or provenance signal. That is an AI marker (provenance), not a Content ID reference.

**Label partners.** Eleven Music launched (Aug 2025) with Merlin and Kobalt licensing the training data **[secondary, M11]**. UMG signed in Sept 2026, but for a *new* fan-remix platform that "will be distinct and offered separately from our existing music products", meaning the Music API and the ElevenMusic app (M12) **[official]**. None of these deals says the partners fingerprint generated tracks. **[unverified]**

**Could our uploads still get claimed?** Yes, through other people rather than ElevenLabs **[analysis]**:
1. **Look-alike outputs.** Output "may not be unique across users" (M3 § 10). Creator and higher tiers may release tracks to music services through distributors, and some distributors offer Content ID. Another user could therefore register a track that sounds like ours. YouTube's rules exclude this: "You must have exclusive rights to the material in the reference file", and "Content licensed non-exclusively from a third party" is ineligible (M13). Those rules depend on the claimant being honest, though, so a wrong claim can still be made.
2. **Shared, ready-made audio.** ElevenLabs offers pre-made tracks that everyone can download, marketed as "royalty free with no copyright claimed" (M7). It also runs a community Sound Effects library (M4 § 4) that anyone can take from. Shared audio is the most likely to be uploaded and registered by someone else. **Generate our own; never use library tracks.**
3. **SFX themselves are not Content ID material**: YouTube lists "sound effects", "soundbeds" and "production loops" as ineligible (M13) **[official]**.

**Reported false claims.** I found **no** report, official or community, of a Content ID claim on Eleven Music output (searched 2026-10-16; Reddit is poorly indexed) **[secondary, absence of evidence only]**. A music-library vendor's blog says some AI music tools have registered their own output in Content ID. It names no tool, and the vendor competes with these tools **[secondary, low weight, M14]**.

**What it means for over 60 s.** A Short over 1 min with "an active Content ID claim, regardless of the policy, will be blocked" (platforms.md § 3, S8). Disputing a claim takes time, so even a false claim blocks the Short until it is released. ElevenLabs meets the § 9 condition "registers nothing in Content ID" as far as public sources show. The leftover risk comes from third parties and is low, but it is not zero. **[analysis]**

## 4. Disclosure

- **ElevenLabs:** no attribution on paid tiers. The terms do require you to follow each platform's AI rules. § 4.4 (M1): on "any streaming platform, digital service provider, or content-hosting service, you are responsible for complying with that platform's policies on the disclosure of AI-generated content, including any labeling, metadata, or tagging requirements." Also: "no marking ElevenLabs applies satisfies your disclosure obligations" (§ 3.4, paraphrase).
- **YouTube** (M15): creators must disclose AI content that "Creates music that's the main focus of the video"; the list of examples starts with "AI generated music". Our bed sits 16 to 20 dB under the voice (style-guide § 9), so it is not the main focus. The AI label we already set on every video (voice; style-guide § 10) covers it either way. Hitting the AI label switch is enough; YouTube may show its player label "for AI-generated music". **[official; the "main focus" reading is analysis]**
- **TikTok, Instagram:** the per-post AI label we already turn on covers AI audio (platforms.md § 6). Nothing more is needed. **[official via platforms.md; music not called out separately]**
- **Description:** no "music by ElevenLabs" credit is required on paid tiers. Not adding one also keeps the description short. **No disclosure is needed beyond our existing AI label.**

## 5. Cancelling later

- Music Terms § 1.5 (M1) **[official]**: for self-serve plans, after a downgrade or cancellation, "Output remains subject to the plan in effect when that Output was created". Tracks made on a paid tier keep that tier's rights.
- Help centre (M5) **[official]**: "Content generated during a paid subscription can be used commercially, and indefinitely". But: "Content created outside of a paid subscription (before or after) cannot be used commercially".
- Upgrades: § 1.5 says "all Output in your account at the time of the upgrade are subject to the upgraded plan". This goes further than the help centre, and for music the Music Terms take precedence. Don't rely on it: **generate final audio only while a paid plan is active.** [analysis]
- ToS § 14 (M3): "You are responsible for exporting any Content you wish to retain before your access to a Service ends." Keep local copies; the account library can go.
- The same terms apply to SFX: they are made under the plan's commercial right, and the help centre's "indefinitely" covers them. No SFX-specific clause found. **[official, general]**

## 6. Alternatives if ElevenLabs fails

**Epidemic Sound Creator** covers music and SFX on "social media platforms, websites, and podcasts", "Monetize 1 channel per platform"; you must safelist (connect) the channels before publishing; videos published during the subscription stay cleared after you cancel, but anything published later "is not cleared" (M16, official). Price ≈ **$9.99/month billed annually ($119.88/year) or $17.99 monthly** **[secondary, M17; the official page didn't render prices]**. Its catch is that you keep paying to post new videos. **Freesound CC0** is free for SFX: "you can do pretty much what you want with the sound", with no credit needed; avoid CC BY-NC, because "you can't earn any money with the piece of work you create" (M18). Both are already allowed by style-guide § 9.

---

## Verdict

- **Music: OK, yes, on Creator ($22) or higher.** Starter is commercially licensed too, but it prohibits "Music Streaming Distribution", and reuse of our audio by other users on TikTok and Shorts arguably falls under that. Creator removes the ambiguity. Not on Free. Pro is only needed for WAV / 192 kbps downloads, and a bed 16 to 20 dB under the voice doesn't need them.
- **SFX: OK, yes, on any paid tier (Starter and up).** Only inside the video, never as standalone files.
- **It meets style-guide § 9** "a generator whose terms grant commercial multi-platform rights and that registers nothing in Content ID": the rights are granted (§ 1), no platform limits (§ 2), and nothing is registered as far as public sources show (§ 3). **No rule change is needed.**

**Conditions we must follow**
1. Generate only while a paid plan is active (Creator+ for music), and only via features not marked beta. Keep local copies of every file.
2. Generate our own tracks; never use ElevenLabs' ready-made downloadable tracks or community SFX.
3. Instrumental beds; no artist, song, label or lyric in prompts.
4. Keep a generation record for every generated track and sound. The tooling writes it automatically to `src/videos/<slug>/audio-log.md`, one per video: generated, committed, append-only (never hand-edit or rewrite past lines), with date, account plan, endpoint, model, prompt, length, file path and sha256. `public/assets/LICENSES.md` (owned by the scene-builder) gets one line per video pointing to that video's audio-log. It is our proof if a claim comes, and our proof of plan if cancelled.
5. Don't register the track ourselves (Content ID, distributors, PROs). We lack exclusive rights (M3 § 10, M13), and a registration could claim our own other posts.
6. Keep the AI label on, on all three platforms (already the rule). No extra credit line.
7. If a claim appears on a Short over 60 s: dispute it at once with the record from condition 4.
8. If the channel later runs as a company with staff, re-check eligibility (Free to Pro say "For Individual Use Only").

---

## Sources (all seen 2026-10-16)

| ID | Source | Date | URL | Key quote |
|---|---|---|---|---|
| M1 | ElevenLabs, Music Terms (incl. Exhibit A, Music Commercial Rights Table) | updated 2026-10-09 | https://elevenlabs.io/music-terms (same text served at /music-rights) | "Output remains subject to the plan in effect when that Output was created" |
| M2 | ElevenLabs, Eleven Music API page | undated | https://elevenlabs.io/eleven-music-api | "Songs are available for broad commercial use on all paid plans." (links an /eleven-music-v1-terms page that returns 404) |
| M3 | ElevenLabs, Terms of Service | updated 2026-10-09 | https://elevenlabs.io/terms-of-use | "the Output generated by you using the Services may not be unique across users" |
| M4 | ElevenLabs, ElevenCreative Terms, Exhibit 4 Sound Effects | updated 2026-10-09 | https://elevenlabs.io/creative-terms | "for commercial purposes only where your plan permits commercial use" |
| M5 | ElevenLabs Help, Can I publish the content I generate on the platform? | undated | https://elevenlabs.io/docs/help-center/legal/can-i-publish-the-content-i-generate-on-the-platform | "Content generated during a paid subscription can be used commercially, and indefinitely" |
| M6 | ElevenLabs, Pricing | seen 2026-10-16 | https://elevenlabs.io/pricing | Starter: "Commercial License", "Music commercial use" |
| M7 | ElevenLabs, Music for YouTube page | undated | https://elevenlabs.io/music/youtube | "Generated music can be used commercially on the starter+ plans" |
| M8 | ElevenLabs Docs, Music capability | undated | https://elevenlabs.io/docs/overview/capabilities/music | "Every uploaded reference is screened for copyright compliance." |
| M9 | ElevenLabs, Commercial sound effects page | undated | https://elevenlabs.io/sound-effects/commercial | "all ElevenLabs Sound Effects are royalty free and can be used in commercial projects" |
| M10 | ElevenLabs, ElevenAPI Terms | updated 2026-10-09 | https://elevenlabs.io/elevenapi-terms | Music via API: "The ElevenLabs Music Terms supply additional definitions." |
| M11 | Implicator.ai, Eleven Music launch with Merlin and Kobalt deals [secondary] | 2025-08 | https://www.implicator.ai/elevenlabs-sidesteps-lawsuits-with-rare-licensing-deal-in-ai-music-launch/ | licensing deals "from Merlin Network and Kobalt Music Group already signed" |
| M12 | ElevenLabs Blog, UMG agreement | 2026-09-10 | https://elevenlabs.io/blog/umg | "The new platform will be distinct and offered separately from our existing music products" |
| M13 | YouTube Help, Content eligible for Content ID | undated | https://support.google.com/youtube/answer/2605065?hl=en | "You must have exclusive rights to the material in the reference file"; ineligible: "Content licensed non-exclusively from a third party", sound effects, soundbeds |
| M14 | Thematic, AI music for YouTube [secondary, vendor] | undated | https://hellothematic.com/ai-music-for-youtube/ | some AI music tool providers registered their output with Content ID (no tool named) |
| M15 | YouTube Help, Disclosing use of GenAI content | undated | https://support.google.com/youtube/answer/14328491?hl=en | "Creates music that's the main focus of the video." |
| M16 | Epidemic Sound, Creator plan | undated | https://www.epidemicsound.com/our-plans/creator-plan/ | "Monetize 1 channel per platform" |
| M17 | Photutorial, Epidemic Sound pricing [secondary] | 2026 | https://photutorial.com/epidemic-sound-pricing | $9.99/month annual, $17.99 monthly |
| M18 | Freesound FAQ | undated | https://freesound.org/help/faq/ | CC0: "you can do pretty much what you want with the sound" |
