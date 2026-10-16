# Production playbook

How a Secretly Works video gets made, and what the pilot (Exhibit No. 001, `phone-listening`) taught us.
Living document: update it whenever a step causes rework, so the next video doesn't repeat it.

## How a video is built (owner-approved, 2026-10-15)

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
  `out/music/<slug>/<name>.mp3`. Prompt defaults to `src/videos/<slug>/music.txt`, length to the
  composition duration (as Root renders it) rounded up to a whole second. `yarn music:use <slug> <name>` copies it to `public/<slug>/music.mp3` (free).
- `yarn sfx <slug> <name> --prompt "..." [--seconds N] [--take <t>]`: one effect into
  `public/<slug>/sfx/<name>.mp3` (`--take` writes `out/sfx/` for auditions). Existing files are never overwritten.
- `yarn sfx:click <slug> [--name click] [--force]`: free, local. Self-made deterministic phone-lock click (0.35 s) encoded to
  `public/<slug>/sfx/<name>.mp3`; same samples every run; refuses to overwrite without `--force`; no `audio-log.md` entry.
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
  music's space; writes stereo `public/<slug>/voiceover-room.mp3` (input untouched, same sample length,
  loudness matched within 0.5 LU, deterministic). Point the spec at it only when the owner prefers it; no `audio-log.md` entry.

## Staged builds

- Big visual changes are built in stages, with owner-judged stills after each stage: set and cast first,
  then overlays and screens, then transitions and polish.
- Preview new work in a sandbox video (`src/videos/lab-<name>/`) so a video's real layout isn't touched
  until the look is approved.
- One video with a broken cue must not stop every other video from rendering (fixed in `Root`: broken
  videos render an error card).

## Studio playback vs the rendered file

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
- [ ] **Hook in the first second, from No. 002 on** (owner, 2026-10-16; the pilot keeps its opening). Many viewers
  swipe at 1–2 s. The pilot opens on setup: black frame, wake, "Your friend spends the evening…". The surprise
  lands at 6.6 s and the question at 9.1 s, past the brand's ~6 s target. Next time: the first line and the first
  frame carry the payoff ("Your phone just showed you an ad for a coffee machine you never searched…"), the
  question lands by ~5 s, and the title shows the question from frame 0. Check the hook at the script stage, before
  voice, by timing the first sentence. The black screen-bookend open is up for review alongside this (brand.md
  § Hook patterns, owner decision).

## Loudness

`yarn render` ends with a two-pass loudnorm to -14 LUFS / -1.5 dBTP (`scripts/normalize.mjs`); the raw mix is kept as `out/<slug>.raw.mp4`. A voice-led mix at about -22 LUFS can't reach -14 in linear mode without the true peak passing the limit, so loudnorm runs dynamic (pilot: -21.8 to -14.3 LUFS, -4.2 to -1.2 dBTP after AAC). Video is stream-copied; frame count and A/V sync are checked.
