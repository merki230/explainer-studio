# Feedback log

One entry per published exhibit. This is where brand rules get proven or overturned: a rule moves from 🧪 to ✅ (or gets changed) only when entries here support it, and every change is then recorded in `CHANGELOG.md`.

What goes in an entry:
- **Owner's notes:** what the owner liked, disliked, or wants to try next. Quote them.
- **Viewer comments:** recurring themes, with counts where possible ("7 comments asked for the source"). Quote one or two.
- **Numbers:** per platform, taken at 72 h and again at 14 days. Views (note that YouTube counts replays as views since 2025-03-31, P§4), average watch time, % watched to the end, shares, and swipe-away rate where the platform shows it. Blank cells are fine; made-up numbers are not.
- **Rule changes proposed:** which rule in `brand.md` or `style-guide.md`, what the proposal is, and which line of evidence above supports it. The owner approves before the rule changes.

Research citations: `brand/research/platforms.md` (P§), `brand/research/landscape.md` (L§).

---

## Platform numbers, all videos

One row per video, platform and snapshot; add new rows at the bottom, never overwrite an older snapshot. Numbers exactly as the owner reports them; "/" = the platform doesn't show it or it wasn't reported. **% watched** = average watch ÷ video length (computed here). Snapshot = time since posting. **Posted at** = date, local time and time zone of the post (added 2026-10-18).

| Video | Length | Platform | Posted at | Snapshot | Views | Likes | Followers gained | Avg watch | % watched | Full watch / retention | Skip / swipe-away | Other |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| No. 001 `phone-listening` | / | all | / | not yet reported | pending | pending | pending | pending | pending | pending | pending | pending |
| No. 002 `tire-sensor` | 81 s | TikTok | 2026-10-17, about 19:00, owner's local time (America/Chicago, confirmed by the owner 2026-10-18) | ≈ 12 h (2026-10-17/18) | 12.5K | 205 | 11 | 25.7 s | 32% | full 5.57% · retention 32% | / | total play 91h23m49s |
| No. 002 `tire-sensor` | 81 s | Instagram | 2026-10-17, about 19:00, owner's local time (America/Chicago, confirmed by the owner 2026-10-18) | ≈ 12 h | 2,148 | 38 | 2 | 36 s | 44% | / | skip 18.1% | 2 reposts |
| No. 002 `tire-sensor` | 81 s | YouTube Shorts | 2026-10-17, about 19:00, owner's local time (America/Chicago, confirmed by the owner 2026-10-18) | ≈ 12 h | 1,195 | 23 | / | 0:38 | 47% | / | swiped away 28% | total watch time "8.9" (unit not shown, probably hours) |

Reading notes: YouTube views include replays (P§4). TikTok's "retention 32%" matches its average watch ÷ length, so it's probably the same figure, not a separate one. YouTube's "8.9" doesn't square with its average: 8.9 h ÷ 1,195 views ≈ 27 s, not 38 s; confirm the unit (or the denominator YouTube uses) at the 72 h snapshot.

**Posting time is a variable to test** (owner, 2026-10-18). No. 002 went out in the evening (about 19:00 local; the time zone, America/Chicago, is unconfirmed: owner to confirm). Over the next videos, compare a midday post against an evening post, same snapshot times, and note the time in "Posted at" for every row. One video per slot is not enough to conclude anything; no rule until several posts per slot are in.

---

## No. 003 · elevator-dispatch (`elevator-dispatch`): sound decisions (not published)

- **Decided:** 2026-10-18, owner, relayed by the main session · **Applies to:** No. 003 onward

**Owner's notes** (as relayed)

- The music entering at 3 s (the § 9 default) was too late on No. 003: the opening felt thin. Music from the first second, short fade-in (spec `startAt: 0, fadeIn: 1.5`).
- The § 9 SFX row ("nothing else beyond click, hum and whoosh") is out of date: No. 002 shipped hiss and chime, No. 003 press, ding and doors, all approved.

**What we're changing** (✅ owner decision; values 🧪; CHANGELOG v0.11.2)

| Rule (file § name) | Change | Note |
|---|---|---|
| style-guide § 9 Music | Present from the start: may begin at frame 0 with a short fade-in; still about 9 dB under the dry voice, steady, no duck; ends in silence on the last frame | Note 1 |
| style-guide § 9 SFX | Short real-world sounds for actions on screen (presses, doors, chimes, air), about 12 to 19 dB under the voice, no stingers, risers or impacts, never under a statement card; values so far listed | Note 2 |

**To watch once published:** skip/swipe-away in the first 1 to 2 s against No. 002 (music from 3 s); any comments about the music or the sounds.

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

## No. 002 · The Tire (`tire-sensor`): first numbers (published)

- **Published:** 2026-10-17/18 on TikTok, Instagram, YouTube Shorts · **Snapshot:** ≈ 12 h after posting (numbers in § Platform numbers above)
- **Length:** 81 s · **Words:** 233 · **Opening:** surprise-first (v0.11); spoken question "So why would a tire need its own radio?" at 6.2 to 8.6 s (`transcript.json`), later than the ≈ 5 to 6 s target
- **Slices:** wheel cut-away, car, other car, The Lab, all Day · **Cast:** YOU, MOM, two extras

**Owner's notes**

- "Don't change any rule yet; we need insight from more videos first." (owner decision, relayed by the main session)

**Viewer comments:** not yet reported. Still to watch: the yellow warning light read as the system (entry above).

**Where the average viewer is when they leave** (average watch against `transcript.json`; an average, not a drop-off curve)

| Platform | Avg watch | Words being spoken then |
|---|---|---|
| TikTok | 25.7 s | "a motion sensor, a tiny computer" (the list of the sensor's parts, 24.0 to 28.6 s) |
| Instagram | 36 s | "every minute or so, it sends the car…" (35.7 s) |
| YouTube | 38 s | "a quick radio message" (38.0 s) |

The sleep-and-wake line runs ≈ 29 to 33 s; the ID line ends at 44.5 s and the battery line at 50.7 s, so those two come after all three averages.

**Main session's reading: hypotheses to test, not decisions**

| # | Hypothesis | Evidence so far | What would confirm it |
|---|---|---|---|
| H1 | The hook holds | Instagram skip 18.1%, YouTube swiped away 28% | Similar or lower skip/swipe-away on No. 003 and later; TikTok's own swipe figure if it can be found |
| H2 | Viewers leave mid-video, around 26 to 38 s (≈ 32 to 47% of the video), in the most detailed stretch: the sensor's parts, sleep and wake, ID, battery | The three averages above | A retention curve showing the drop there (not only the average); the same pattern on later videos at the same point in the mechanism |
| H3 | Very few reach the end and the loop | TikTok full watch 5.57% | Full-watch or end-retention figures on Instagram and YouTube; later videos |
| H4 | Possible future direction, only if more videos confirm H2 and H3: shorter videos (≈ 45 to 60 s) with the strongest fact earlier | Not tested | Compare videos of different length and fact order |
| H5 | 🧪 Niche to test, not adopted: "hidden technology inside ordinary objects". Recipe: (1) an object everyone owns but never thinks about; (2) a hidden technology inside it nobody suspects; (3) one surprise that fits in a sentence; (4) a real-life payoff the viewer can check | Owner, 2026-10-18: No. 002 (the tire's radio) "very surprising" to many viewers, judged from comments, views and likes (comments not yet logged here) | Judged on 2 to 3 more videos that follow the recipe, starting with No. 004 (water/gas meter: a radio read by a passing vehicle), against § Platform numbers (views, likes, followers gained, % watched, skip/swipe-away) and the comments. Candidate objects: `docs/video-ideas.md` |

**Comparison to come:** No. 003 (`elevator-dispatch`) deliberately stays at its current length, ≈ 93 s, by owner decision. Its numbers will show whether a longer video loses viewers at the same point in the mechanism, or at the same second.

**H5 note (owner, 2026-10-18):** test only. No change to the topic or to any rule in `brand.md` until the H5 videos are in; then propose (or drop) it here and record the decision in `CHANGELOG.md`. To log: the No. 002 comments behind "very surprising" (counts and one quote), so H5 has viewer evidence and not only the owner's reading.

**Rule changes proposed:** none (owner decision above).

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
