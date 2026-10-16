# Publish: phone-listening (Exhibit No. 001)

Handle: `@thesecretlyworks` on all three. Master: `out/phone-listening/phone-listening.mp4` (about 55 s). Text below is one version for all three platforms (under 2,200 characters), except the title.

## Title

My friend searched coffee machines. I got the ad.

Use it as the YouTube Shorts title. TikTok and Instagram have no title field, so it isn't used there.

## Description

Your friend scrolls coffee machines on your couch, and the next morning your phone shows you one.

Illustrative: the couch, the friend and the coffee machine are an example, not a real case.

It might not be your mic. Devices on one home network often share a public address, and ad platforms use that to guess who belongs to one household.

Sources: FTC staff report on cross-device tracking (2017), Panoptispy study of Android apps (2018), Apple and Google documentation on wake-word detection.

### Sources (YouTube description, full names)

- US Federal Trade Commission: Cross-Device Tracking: An FTC Staff Report (2017) https://www.ftc.gov/system/files/documents/reports/cross-device-tracking-federal-trade-commission-staff-report-january-2017/ftc_cross-device_tracking_report_1-23-17.pdf
- Proceedings on Privacy Enhancing Technologies: Panoptispy: Characterizing Audio and Video Exfiltration from Android Applications (2018) https://petsymposium.org/popets/2018/popets-2018-0030.php
- Northeastern Global News: Is your smartphone spying on you? (2018) https://news.northeastern.edu/2018/07/06/is-your-smartphone-spying-on-you/
- Apple Machine Learning Research: Hey Siri: An On-device DNN-powered Voice Trigger for Apple's Personal Assistant (2017) https://machinelearning.apple.com/research/hey-siri
- Google Assistant Help: How Google Assistant is designed for your privacy (undated) https://support.google.com/assistant/answer/11091714?hl=en

On TikTok and Instagram, use the description up to and including the one-line "Sources:" and leave out this list (links are not clickable there, and the channel has no profile link yet).

## Hashtags

#privacy #wifi #adtargeting #howthingswork

(4, within Instagram's cap of 5. On YouTube add #shorts only if you want; the Shorts shelf does not need it.)

## Pinned comment

Sources are in the description if you want to read them. Has an ad ever followed someone else's search at your place? I'd like to hear what it was.

## Cover

- **TikTok and Instagram:** upload `out/phone-listening/cover.png`, the purpose-made cover (`spec.cover`; rebuild with `yarn cover phone-listening`). It shows "Is your phone listening?", the couch, YOU's phone with the coffee-machine ad, and the orange line from the router to the phone. The text and subject sit inside the 3:4 grid crop.
<!-- youtube-frame: 1490 -->
- **YouTube Shorts:** if the app only lets you pick a frame from the video, pick **49.7 s (frame 1490)**: the couch, the ad in the detail box, the orange trace, and the short caption "your phone.".

## Per-platform checklist (before pressing publish)

- **All three:** upload the clean master `out/phone-listening/phone-listening.mp4`, not a file downloaded from another app. No in-app music or sounds. Public.
- **YouTube:** Altered or synthetic content: **Yes**. Audience: not made for kids. Paste the title and the full description with the sources list. Cover: upload `cover.png` if the app allows it, otherwise pick frame 1490 (49.7 s; `youtube-frame.png` in the same folder).
- **TikTok:** More options, AI-generated content: **on**. Upload the cover from `out/phone-listening/cover.png`. Caption: hook line, "Illustrative" line, "Sources:" line, hashtags.
- **Instagram:** Advanced settings, AI label: **on**. Upload the cover from `out/phone-listening/cover.png` (keep text inside the 3:4 crop). Same caption as TikTok.
- No "Full sources: link in profile" line anywhere (no profile link yet).
- No asset-credit line: every asset in `public/assets/LICENSES.md` is CC0, which needs no credit.
- Paste the pinned comment right after posting and pin it (YouTube and TikTok; on Instagram pin it as a comment from the account).
