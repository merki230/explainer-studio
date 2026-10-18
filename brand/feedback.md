# Feedback log

One entry per published exhibit. This is where brand rules get proven or overturned: a rule moves from 🧪 to ✅ (or gets changed) only when entries here support it, and every change is then recorded in `CHANGELOG.md`.

What goes in an entry:
- **Owner's notes:** what the owner liked, disliked, or wants to try next. Quote them.
- **Viewer comments:** recurring themes, with counts where possible ("7 comments asked for the source"). Quote one or two.
- **Numbers:** per platform, taken at 72 h and again at 14 days. Views (note that YouTube counts replays as views since 2025-03-31, P§4), average watch time, % watched to the end, shares, and swipe-away rate where the platform shows it. Blank cells are fine; made-up numbers are not.
- **Rule changes proposed:** which rule in `brand.md` or `style-guide.md`, what the proposal is, and which line of evidence above supports it. The owner approves before the rule changes.

Research citations: `brand/research/platforms.md` (P§), `brand/research/landscape.md` (L§).

---

## No. 001 · Is your phone listening? (`phone-listening`): rough-cut review (not published)

- **Reviewed:** 2026-10-15, owner in Remotion Studio · **Stage:** rough cut, The Section look · **Slices:** living room, Night → Day (time passes) · **Cast:** YOU, FRIEND

**Owner's notes** (paraphrased by the main session)

- The night→day blend made FRIEND jump: "abrupt, not smooth".
- Camera-angle changes felt abrupt (hard cuts between framings).
- During the research and wake-word part: "we still see both mannequins, it's kind of boring; animation is also what people want to see".

**What we're changing** (✅ owner approved; CHANGELOG v0.9.1)

| Rule (file § name) | Change | Note |
|---|---|---|
| style-guide § 8 Motion principles, brand.md § Structure | Something meaningful moves at least every 2 to 3 s; never two people sitting still under narration; every mechanism beat gets a visual of it | Note 3 |
| style-guide § 8 Glide, Cuts and dissolves | Framing changes within a location glide (0.5 to 1.0 s, cubic in-out); hard cuts rare | Note 2 |
| style-guide § 4 Time passes, § 8 Auto rule | Render once, blend light and colour; never double-expose moving things | Note 1 |
| style-guide § 3 Object cut-aways | The section look on objects (a phone cut open, its wake-word chip); non-system glows not orange | Note 3 |
| style-guide § 3 The Lab, brand.md § Structure | A reusable cut-open test room for "researchers found" beats; `follow`/`slide` between locations | Note 3 |

---

## Channel profiles: bio and description review (not a video)

- **Reviewed:** 2026-10-16, owner, on `channel-kit.md` § 3 (v0.10.1 copy)

**Owner's notes** (quoted as relayed by the main session)

- "those descriptions are just like AI. We should describe our channel like a passionate [person], does not need to be long. It should be enough for people to understand what we do and not how."

**What we're changing** (✅ owner direction, relayed by the main session; CHANGELOG v0.10.1)

| Rule (file § name) | Change | Note |
|---|---|---|
| brand.md § Channel identity, Bio promise → Profile copy | No fixed opening line, no "sourced", no "cut open in 3D": what the viewer gets, not how it's made, in a spoken voice; YouTube 1 to 3 sentences + one optional "what's coming" line, bios one line (two at most) | The note |
| brand.md § Channel identity, Disclosure | The AI-voice line leaves the YouTube About text; the per-post AI label on all three stays | The note ("not how") |
| channel-kit.md § 3 | Rewritten: 3 options per field, one recommended | The note |

---

## No. 001 · Is your phone listening? (`phone-listening`): sound mix review (not published)

- **Reviewed:** 2026-10-16, owner, on headphones · **Stage:** sound pass (voice, music bed, click, hum, whoosh)

**Owner's notes** (quoted as relayed by the main session)

- The narrator felt "isolated" from the music: "the only thing in my ears".
- Room reverb on the voice (`yarn voice:room`), light and strong: both rejected. "use the voice without the room".
- Music bed about 9 dB under the voice, no ducking (spec `music: {level: -14, duckDb: 0}`, take C ≈ −16.7 LUFS, voice ≈ −22 LUFS): "right".

**What we're changing** (✅ owner decision; CHANGELOG v0.10.1)

| Rule (file § name) | Change | Note |
|---|---|---|
| style-guide § 9 Music | 16 to 20 dB under → about 9 dB under, steady (no duck), level set per track from measured LUFS; reference bed prompt in `src/videos/phone-listening/music.txt` | Notes 1 and 3 |
| style-guide § 9 Voice processing (new) | The voice stays dry; `yarn voice:room` is not the default | Note 2 |
| style-guide § 9 SFX | Lock click self-made (synthesised; ElevenLabs gave near-silent clicks twice); hum and whoosh ElevenLabs; No. 001 offsets recorded | Sound pass |

---

## No. 002 · fiber-sharing (`fiber-sharing`): owner decisions before production (not published)

- **Decided:** 2026-10-16, owner, relayed by the main session · **Applies to:** No. 002 onward (No. 001 unchanged)

**Owner's notes** (as relayed)

- Many wavelengths share one fibre: show them as **distinct colours**, not all orange. The viewer's own channel stays orange; the real light is infrared, so the video must not imply the colours are real.
- **Hook in the first second** (`docs/playbook.md` backlog): frame 0 opens on the surprise image, the first line carries the surprise, the question lands by about 5 to 6 s, the title block shows the question from frame 0, the end still loops into frame 0. The black screen-bookend opening is no longer the default. Background: No. 001's surprise landed at 6.6 s and its question at 9.1 s; many viewers swipe at 1 to 2 s.
- American "fiber" in voice, captions and post copy.

**What we're changing** (✅ owner decision; values 🧪; CHANGELOG v0.11)

| Rule (file § name) | Change | Note |
|---|---|---|
| style-guide § 1 orange rule, new Light channels row; § 2 Bloom; brand.md § What we never do (orange) | Channel palette (7 hues, the viewer's channel orange) only inside a fibre or optical component; no spill, no bloom on the others; the video says once the colours are added | Note 1 |
| brand.md § Hook patterns, § Structure steps 1 to 3 and 7, The loop, § Naming; style-guide § 6 Title block, § 8 The opening and the loop, screen-bookend optional | Surprise image at frame 0; surprise in the first sentence; question spoken by ≈ 5 to 6 s and in the title block from frame 0; last shot ends on frame 0's picture | Note 2 |
| brand.md § Voice, new Spelling row | American spelling in voice, captions, on-screen text, post copy | Note 3 |

**To watch once published:** swipe-away at 1 to 2 s against No. 001 (the black opening), and comments asking whether the light is really coloured.

---

## No. 002 · tire-sensor (`tire-sensor`): warning-light colour (not published)

- **Decided:** 2026-10-16, owner, relayed by the main session · **Applies to:** No. 002 onward

**Owner's notes** (as relayed)

- Real dashboard warning lights such as the tire-pressure icon are amber, but orange is reserved for the hidden system. Show dashboard and indicator warning lights in a **warning yellow**, distinct from the system orange; keep orange for the hidden system (here, the tire sensor's radio signal).

**What we're changing** (✅ owner decision; value 🧪; CHANGELOG v0.11.1)

| Rule (file § name) | Change | Note |
|---|---|---|
| style-guide § 1 new Warning lights row, constant tokens; § 2 Bloom; checklist 2 | Proposed token `warning` `#eedd2b` (the channels' yellow) for dashboard icons and device indicator lights; flat, never blooms or glows like the system; the tire-pressure icon is a tire cross-section, fitting The Section | The note |

**To watch once published:** comments reading the yellow light as part of the system, or saying the light "should be orange/amber".

---

## Template

### No. 000 · Title (`<slug>`)

- **Published:** YYYY-MM-DD
- **Length:** 00 s · **Words:** 000 · **Hook pattern:** (brand.md § Hook patterns, 1 to 5)
- **Slices:** how many, which moods (Night / Day) · **Cast:** who appeared · **X-ray used:** yes / no
- **Anything new tried:** (a rule bent on purpose, a new scene, a new hook)

**Owner's notes**

-

**Viewer comments** (themes, counts, one quote each)

-

**Numbers** (72 h / 14 d)

| Platform | Views | Avg watch time | % watched to end | Shares | Swipe-away / skip % |
|---|---|---|---|---|---|
| TikTok | / | / | / | / | / |
| YouTube Shorts | / | / | / | / | / |
| Instagram Reels | / | / | / | / | / |

**Rule changes proposed**

| Rule (file § name) | Proposal | Evidence | Owner decision |
|---|---|---|---|
| | | | pending |

---
