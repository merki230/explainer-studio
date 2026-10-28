# Production playbook

How a Secretly Works video gets made, and what the pilot (Exhibit No. 001, `phone-listening`) taught us.
Living document: update it whenever a step causes rework, so the next video doesn't repeat it.

## How a video is built (owner-approved, 2026-10-15)

0. **Picture before voice** (owner, 2026-10-16): before recording, the director writes an A/V script
   (`src/videos/<slug>/av-script.md`, one row per sentence: on screen, motion, transition, overlay, new or
   existing part). Lines that are hard to show, too long for one shot or rushed get reworded, and the
   pauses in `performance.txt` are placed on the cuts. Changing words after the paid voice take is the
   expensive way.
   The A/V script must vary the framing (owner, 2026-10-18, No. 003): open close on the action the first line
   names (e.g. the finger on the button), then reveal; mix close, medium and wide every scene or two; keep the
   wide shot for when the whole picture is the point. A video held in one wide view loses attention.
1. **Rough cut:** the whole video with the real voice, the right beats and camera moves, simple
   placeholders where effects aren't finished. The owner reviews it in Remotion Studio for structure
   and pacing.
2. **Polish beat by beat:** take one beat to final quality, owner reviews it in the Studio, lock it,
   move to the next. A locked beat is only reopened for something serious.
3. **Final pass:** one full watch in the Studio, then render the MP4.

## The order that avoids rework

1. **Decide the look before building anything.** Use a browser comparison page (2–3 options, same moment,
   shared scrubber) and let the owner pick by eye. Then judge 2–3 real stills in the chosen look before
   building a whole video in it.
   _Pilot lesson:_ the look changed three times mid-pilot (Plaster Museum → reference-style interior →
   The Section). Each change threw away scene work.
2. **Settle the writing style with samples first.** Show the owner 2–3 short style samples (about 40 s
   each, same facts) before a full script.
   _Pilot lesson:_ a 145–160 word target made the writer pad, and the owner rejected the result as "too
   AI". The brand now has no word-count target.
3. **Research → script → fact-check → owner approval.** Loop script and fact-check until the verdict is
   PASS, then ask the owner. Fix 🟡 claims by **attributing** them ("FTC staff said in 2017…"), not by
   hedging every sentence.
4. **Voice before layout timing.** The estimated timings (`yarn timings`) run long. Lay out scenes on
   estimates if you need to start early, but expect one re-timing pass after the real take. Seconds-based
   props (`tellAt`, `devicesAt`, `micAt`…) are the ones to re-time; cues re-time themselves.
5. **Layout → components → review → fix → render.** Every review round lists only issues a viewer
   would notice, in priority order, each with a concrete fix and an owner.
6. **Owner review in Remotion Studio before any final render.** Start `yarn studio`, give the owner the
   local URL, and collect feedback while scrubbing with sound. Render the MP4 only after the owner signs off
   in the Studio. Then the owner watches the file on a phone, and we commit.

## Rules that changed, and where they live

When a brand rule changes, the old wording usually survives elsewhere. Every time so far it was in
`CLAUDE.md`, the scriptwriter, researcher and voice agents, `.claude/skills/new-video`, `README.md` or
`docs/sources-format.md`. The brand-director lists stale files outside `brand/`, and the main session
updates them in the same step. Before closing a rule change, grep the repo for the old phrase.

## Voice and ElevenLabs

- **One take, the directed one** (owner, 2026-10-17): `yarn voiceover <slug> --take directed` from `performance.txt`, then `yarn voiceover:use <slug> directed`. No plain comparison take.
- Check the plan first. Free plans can't use library voices through the API (402 `paid_plan_required`)
  and don't allow commercial use. The account is now on a paid plan.
- `ELEVENLABS_VOICE_ID` in `.env` **overrides** `voice.json`. If a take uses the wrong voice, check `.env`.
- Record auditions as takes (`yarn voiceover <slug> --take <name>`), and switch for free with
  `yarn voiceover:use`.
- Audio tags and pauses go in `performance.txt` only. Captions always take their words and punctuation
  from `script.txt`.
- The current voice reads at about 166–175 wpm.
- Word timings can misplace the boundary between two words (e.g. a number looks too short and the next
  word too long). A suspicious duration means **listen**, not re-record: the owner checked "2018" and it
  was fine.

### Music and sound effects (ElevenLabs)

- `yarn music <slug> --take <name> [--prompt "..."] [--seconds N]`: instrumental bed into
  `out/<slug>/raw/music/<name>.mp3`. Prompt defaults to `src/videos/<slug>/music.txt`, length to the
  composition duration (as Root renders it) rounded up to a whole second. `yarn music:use <slug> <name>` copies it to `src/videos/<slug>/audio/music.mp3` (free).
- `yarn sfx <slug> <name> --prompt "..." [--seconds N] [--take <t>]`: one effect into
  `src/videos/<slug>/audio/sfx/<name>.mp3` (`--take` writes `out/<slug>/raw/sfx/` for auditions). Existing files are never overwritten.
- `yarn sfx:click <slug> [--name click] [--force]`: free, local. Self-made deterministic phone-lock click (0.35 s) encoded to
  `src/videos/<slug>/audio/sfx/<name>.mp3`; same samples every run; refuses to overwrite without `--force`; no `audio-log.md` entry.
- `yarn sfx:rumble <slug> [--name roar-synth] [--out <file>] [--seconds 4] [--lufs -15] [--pitch 1] [--reso 110] [--cutoff 500] [--drive 0] [--attack 0]` (brutal: `--lufs -12 --drive 4 --attack 6 --reso 130 --cutoff 1200`; high: add `--pitch 2.1 --reso 220`): free, local. Deterministic rumble-strip roar (88 impacts/s, low-passed, mono, 4 s) for auditions in `out/<slug>/raw/sfx/<name>.mp3`; never writes into `src/`; no `audio-log.md` entry. Measure with `loudnorm ... print_format=json`.
- `yarn sfx:whine <slug> [--name whine] [--out <file>] [--from 900] [--to 200] [--seconds 3] [--lufs -18] [--noise 0.3] [--curve 1.6]`: free, local. Deterministic EV regen-braking whine: a clean tone with two inharmonic partials (x2.76, x5.4) gliding down from `--from` to `--to` Hz, plus low road/tire noise (`--noise` 0-1; 0 = off). `--curve` shapes the glide (1 linear, >1 drops fast then settles, <1 holds then drops). Mono, low-passed at 4 kHz, for auditions in `out/<slug>/raw/sfx/<name>.mp3`; never writes into `src/`; no `audio-log.md` entry.
- `yarn sfx:charge <slug> [--name charge] [--out <file>] [--from 300] [--to 700] [--seconds 2.5] [--lufs -20]`: free, local. Deterministic rising "battery filling" tone: a clean sine gliding up (exponential, eased at both ends) with two slowly shimmering partials (x2, x3), no noise, low-passed at 3 kHz, mono. Audition in `out/<slug>/raw/sfx/<name>.mp3`; never writes into `src/`; no `audio-log.md` entry.
- `yarn sfx:engine|hiss|throttle|skid|thump|steer <slug> [--name <kind>] [--out <file>] [--seconds N] [--lufs L] [--from A] [--to B] [--peak P] [--pitch X] [--clunk C]` (all one script, `scripts/sfx-drive.mjs`; header lists the model per kind): free, local, deterministic, physical car sounds (No. 008). `engine`: four-cylinder, `--from/--to` rpm, `--peak` rpm swell (cruise: defaults; idle `--from 800 --to 800`; drop `--from 2200 --to 900`; flare `--from 1200 --to 1200 --peak 4000 --seconds 2`). `hiss`: seamless-loop wet tire hiss, `--pitch` = speed. `throttle`: 0.25 s motor whirr (opens 220 to 480 Hz; shut `--from 480 --to 160`). `skid`: wet scrub, no squeal. `thump`: brake thump. `steer`: power-steering motor. Rising EV whine: `yarn sfx:whine <slug> --name whine-rise --from 200 --to 900` (the whine script already glides up when `--from` < `--to`). Clips under 4 s are measured repeated, so the LUFS is the level while the sound plays. Output `out/<slug>/raw/sfx/<name>.mp3`; copy into `src/videos/<slug>/audio/sfx/` by hand; no `audio-log.md` entry.
  - No. 007 additions (same script): `--cyl 8` = cross-plane V8 (firing Hz = rpm*cyl/120, plus crank-revolution orders for the burble, deeper). `--shifts N [--idle S] [--peak shiftRpm] [--from idleRpm]` = drag run: idle, rev to ~3000, launch, N upshifts each with a throttle-lift dip (rpm falls to 70-82% of the shift rpm in 0.28 s, level dips). Run: `yarn sfx:engine <slug> --name v8-run --cyl 8 --shifts 7 --from 750` (11 s); idle `--cyl 8 --from 750 --to 750 --seconds 4`; revs `--cyl 8 --from 900 --to 900 --peak 4500 --seconds 2.5`. Shift clunks reuse thump: `sfx:thump <slug> --name shift-clunk --pitch 1.8 --seconds 0.3 --lufs -22` (gas) and `--name shift-clunk-ev --pitch 2.4 --lufs -28`. Dry tire and road roar: `sfx:hiss <slug> --dry` (loop) and `--dry --from 0.6 --to 1.4 --seconds 10` (rises with speed, no loop; `--from/--to` are speed multipliers). No whine.
  - No. 009 additions: `--die` = gas-engine stall (4-cyl, default 2.2 s): 0.3 s cruise, rpm sags, firings drop out (seeded, growing share, each with a muffled intake cough), rpm and level fall to nothing by about 2 s. Run: `yarn sfx:engine <slug> --name engine-die --die` (-20 LUFS).
- `yarn sfx:cruise <slug> day|night` (`scripts/sfx-cruise.mjs`, No. 009): dry tire roar (`hiss --dry`, pitch 1.5 day / 1.25 night, night low-passed 1.6 kHz) plus a distant 1800 rpm four-cylinder (same as `engine --die`), mixed in Node (local ffmpeg has no filters). `day` 25.4 s, plays straight through scenes 1-6 (one copy, no loop; fades out over the last 1 s). `night` 3.6 s, engine swells +9 dB over 1.8 s to near `engine-die`'s level, then fades out over 0.3 s as `engine-die` starts; roar fades over the last 1.2 s. Level is measured on the lead-in before the swell. Volumes in spec: day -18 (20 under), night -17 (21 under).
- `yarn sfx:gravel|hazard|phone|night|diesel <slug> [--name] [--out] [--seconds] [--lufs]` (one script, `scripts/sfx-road.mjs`, header lists the models; No. 009 roadside sounds, free, deterministic, physical only; same output rules as `sfx:engine`). Recipes used for `mile-markers` (levels are the measured LUFS in the files):
  - `gravel --name gravel-stop` (3.2 s, -24): stone-crunch grains at 220/s x speed, speed falls to 0 at 2.7 s. `--speed` scales the start speed.
  - `hazard --name hazard-cabin` (7.14 s = 10 flashes, -32, seamless loop) and `hazard --outside --lufs -35 --name hazard-outside` (low-passed through the body). Tick at the contacts closing (lamp on, t = k/1.4 s), softer clack half a cycle later. The ticks are sparse and peaky, so the LUFS is low; set the spec `volume` against it. 1.4 Hz = `HAZARD_HZ`; start the file on a video time that is a multiple of 0.7143 s so ticks land on the lamp edges.
  - `phone --part dial|ring|connect|all [--cycles N]`: `phone-dial` (0.52 s, three DTMF digits 9-1-1), `phone-ring --part ring --cycles 2` (8 s, 440+480 Hz, 2 s on / 4 s off / 2 s on), `phone-connect --part connect` (0.2 s click), all -24 LUFS through a 350-3300 Hz speaker band. `--part all` joins dial, 0.6 s, ringback.
  - `night --name night-bed` (16 s, -28, seamless loop, 1.2 s cross-fade): low wind with slow gusts and three distant crickets (`--crickets 0..1`, default 0.6).
  - `diesel --name diesel-stop` (5 s, -22): inline-six pickup arriving and stopping at 3.2 s, air-brake hiss at the stop, optional light squeal (`--squeal 0..1`, default 0.2) in the last 0.5 s before the stop, idle after.
  - Copy the chosen takes by hand into `src/videos/<slug>/audio/sfx/`.
- `yarn sfx:contactor|cabfan|pump|latch|heater|heaterfan|station <slug> [--name] [--out] [--seconds] [--lufs]` (one script, `scripts/sfx-charger.mjs`, header lists the models; No. 010 charging-station sounds, free, deterministic, physical only, no whine, whoosh or riser; same output rules as `sfx:engine`). Recipes used for `ev-charging` (levels are the target LUFS, measured on the clip repeated to 4 s):
  - `contactor --name contactor-close` (0.7 s, -29): heavy relay slam, 62 Hz body thud plus noise burst, two quieter contact bounces at 11 and 23 ms, a metallic click on top (1.9 k and 3.4 k case resonances). `--part open --lufs -31 --name contactor-open`: softer, lower (48 Hz), one release clack. `--pitch X` scales the click resonances. Peaky, so the LUFS is low (the -22 default failed the -1.5 dBTP check); set the spec `volume` against it.
  - `cabfan` (8 s, -30, seamless loop, 1 s cross-fade): air 180-3200 Hz with a slow wobble, low rumble 45-130 Hz, a 2.5 % amplitude flutter at 47 Hz (no tone). Steady, so fade it in from the spec (`fade`).
  - `pump` (8 s, -34, seamless loop): 72 Hz motor hum with 144 and 216 Hz partials (whole cycles per loop), a soft 300-900 Hz flow texture and low rumble. Fixed pitch; for "working harder" step the spec `volume` up, never the pitch.
  - `latch --name latch-in` (0.3 s, -26): plastic snap at 2.4 k then a lower metal clack 28 ms later and a 190 Hz body thump. `--part out --name latch-out`: clack first, softer (the release).
  - `heater --name heater-click` (0.9 s, -28): rocker-switch click with a 380 Hz body, then three soft thermal ticks of the housing between 0.25 and 0.85 s.
  - `heaterfan` (6 s, -32, seamless loop): small ceramic-heater fan, air 350-4200 Hz plus 100/200 Hz motor body. No whistle.
  - `station --name station-bed` (20 s, -32, seamless loop, 2 s cross-fade): light wind with slow gusts, six faint far car/truck passes, a thin steady far hum. Start it at the video's start; loop under each location.
  - Copy the chosen takes by hand into `src/videos/<slug>/audio/sfx/`. Preview all in order with 1 s gaps: decode each to wav with `npx remotion ffmpeg` (the bundled build has no filters or pipes), join in Node, encode to `out/<slug>/raw/sfx/preview.mp3`.
- Both cost credits: ask the owner first. `--dry-run` prints the request (no key) and writes nothing; `--help`
  lists the options.
- Every generated file is appended to `src/videos/<slug>/audio-log.md` (date, plan, endpoint, model, prompt,
  length, path, sha256). It is generated, never hand-edited, and committed: it is our proof in a Content ID
  dispute and of the plan at creation. The plan is "Creator" (owner-provided; `ELEVENLABS_PLAN` overrides).
- Licence conditions (`brand/research/music-licensing.md`): generate only while a paid plan is active (Creator+
  for music) and not with beta features; our own generations only, never ElevenLabs' ready-made tracks or
  community SFX; instrumental, no artist, song, label or lyrics in prompts (the script refuses obvious
  patterns, it is not a guarantee); never register a track in Content ID, a distributor or a PRO; keep the AI
  label on; dispute any claim at once with the log. SFX never go out as standalone files.

- `yarn voice:room <slug> [--wet <dB>] [--size <0..1>] [--width <0..1>] [--out <name>]`: free, local. Adds a light
  small-room reverb (wet -18 dB, ~15 ms predelay, RT60 ~0.4 s) to `voiceover.mp3` so the narrator sits in the
  music's space; writes stereo `src/videos/<slug>/audio/voiceover-room.mp3` (input untouched, same sample length,
  loudness matched within 0.5 LU, deterministic). Point the spec at it only when the owner prefers it; no `audio-log.md` entry.

## Staged builds

- Big visual changes are built in stages, with owner-judged stills after each stage: set and cast first,
  then overlays and screens, then transitions and polish.
- Preview new work in the sandbox video `lab` (`src/videos/lab/`, `sandbox: true`; `yarn render` refuses it without `--force`) so a video's real layout isn't touched
  until the look is approved.
- One video with a broken cue must not stop every other video from rendering (fixed in `Root`: broken
  videos render an error card).

## Wheels: forward by default, legacy only for posted videos (owner, 2026-10-27)

- Wheels that look like they spin backward must never appear in a new video, and posted videos must never change.
- Every scene that turns a road wheel takes `wheels` (`highway-slice`, `city-slice`, `street-slice`,
  `musical-road`, `car-slice`, `race-slice`, `drive-unit`, `wheel-slice`). The default, 'forward', means the wheel
  turns the right way, and its drawn turn is capped under the rim's 30 fps alias limit: 26° a frame for 5 spokes,
  13° for the 10-blade turbine. Above the cap the spokes smear and the tread slips; the road keeps the real distance.
- 'legacy' reproduces No. 001–008 exactly (backward on cars driving away, strobing at speed). It exists only so
  posted videos render byte-identical. They pin it once at the top of `spec.ts` (`wheels: 'legacy'`), and Explainer
  and Cover pass it on to their wheel scenes. Never set it in a new video, and never change the legacy code path.
- A new part or scene with a rolling wheel uses the helpers in `src/three/real/wheelMotion.ts` (`capSpeed` /
  `capRevs`, `cappedTravel`, `wheelSmear`, `spokesOf`). Check its direction on a frame pair (f, f+1), not on one still.
- When you change wheel code, prove it with `cmp` on stills of every posted wheel video, before vs after.


Heavy 3D can stutter in Remotion Studio's live playback (brief freezes at scene changes) while the
rendered file is perfectly smooth. When the owner reports a hitch, render a half-size test file first
(`npx remotion render <slug> out/<slug>-preview.mp4 --scale=0.5`, a few minutes) and compare. Only a
hitch that is also in the file is a real video problem.

## Reviews

- `yarn stills` wipes its output folder on every run. Read the PNGs before the next run, or copy them out.
- There's no pixel-measuring tool yet, so brightness checks are by eye (see backlog).
- Ask reviewers for a verdict (SHIP/FIX) and at most 5 fixes, in priority order.

## Tool gotchas

- Headless Chrome screenshots of artifact pages hang on this machine. Syntax-check the page script with
  `node --check` and ask the owner to report anything broken.
- Remotion's bundled ffmpeg is a minimal build (no `fps`/`tile` filters, no image2 muxer). To pull frames
  from a reference video, use one frame per call:
  `npx remotion ffmpeg -ss <s> -i <video> -frames:v 1 -f image2pipe -c:v mjpeg - > frame.jpg`.
- The permission rule protecting `.env.*` also blocks `.env.example` (see backlog).
- An agent stopped by an API or credit error keeps its context. Resume it with a message instead of
  starting over.

## Analysing a reference video

Pull 7–14 frames across its length (command above), read them, then write down what it does better,
what not to copy, and what to borrow, cheapest first. Always check the result against "does this make us
look like them?"

## Backlog of process improvements

- [ ] Pixel-measuring dev dependency so `yarn check` can test brightness automatically.
- [ ] `yarn captions <slug>`: export an `.srt` from `transcript.json` for YouTube uploads.
- [ ] Narrow the `.env.*` read-deny rule so `.env.example` stays editable (owner decision pending).
- [ ] Brand assets: logo, YouTube banner, platform bios (owner questions pending).
- [ ] Research addendum on the reference channel (@wealthy_path): size, cadence, cast, sourcing.
- [ ] Exhibit No. 002 candidates: see `sources.md` angle "The Screen".
- [x] **Hook in the first second, from No. 002 on** (done 2026-10-16: now brand.md § Hook patterns and style-guide § 6 and § 8, v0.11) (owner, 2026-10-16; the pilot keeps its opening). Many viewers
  swipe at 1–2 s. The pilot opens on setup: black frame, wake, "Your friend spends the evening…". The surprise
  lands at 6.6 s and the question at 9.1 s, past the brand's ~6 s target. Next time: the first line and the first
  frame carry the payoff ("Your phone just showed you an ad for a coffee machine you never searched…"), the
  question lands by ~5 s, and the title shows the question from frame 0. Check the hook at the script stage, before
  voice, by timing the first sentence. The black screen-bookend open is up for review alongside this (brand.md
  § Hook patterns, owner decision).

## Loudness

`yarn render` ends with a two-pass loudnorm to -14 LUFS / -1.5 dBTP (`scripts/normalize.mjs`); the raw mix is kept as `out/<slug>/raw/<slug>.raw.mp4`; the final is `src/videos/<slug>/release/<slug>.mp4` (git-ignored). `release/` also holds `cover.png` (`yarn cover <slug>`) and `youtube-frame.png` (`yarn package <slug>`), both in git next to `publish.md`; everything else (takes, stills, review) lives in `out/<slug>/raw/`. A voice-led mix at about -22 LUFS can't reach -14 in linear mode without the true peak passing the limit, so loudnorm runs dynamic (pilot: -21.8 to -14.3 LUFS, -4.2 to -1.2 dBTP after AAC). Video is stream-copied; frame count and A/V sync are checked.
