# Explainer Studio

Vertical (1080×1920, 30 fps) 3D explainer videos in the "how it secretly works" style, built with
Remotion 4 + React Three Fiber. Every video shares one visual system; a new video is mostly a new
script and a new `spec.ts`.

## Layout

```
src/
  videos/<slug>/        one folder per video
    script.txt          voiceover text (source of truth for words)
    spec.ts             scene + overlay layout, keyed to cues in the script
    transcript.json     word timings, GENERATED, never hand-edit
    sources.md          every claim in the script, with its source and status
    publish.md          titles, description with sources, hashtags (made by the publisher)
  videos/index.ts       registry: every video, one Remotion composition each
  scenes/               full-frame scenes (registered in scenes/index.ts)
  three/                reusable 3D parts (Stage, CameraRig, Mannequin, Arc, ...)
  components/           2D overlays (Callout, SearchBar, AdCard, Counter, Chip, Captions)
  theme.ts              palette, frame size, FPS, FADE (pure, safe to import from Node)
  fonts.ts              font loading (browser only)
  timeline.ts           cue → frame resolution
public/<slug>/          voiceover.mp3 for that video
scripts/                CLI tools behind the yarn commands
out/                    renders and stills (git-ignored)
```

## Commands (yarn 4, Node 24)

- `yarn new <slug>`: scaffold a video folder and register it
- `yarn timings <slug>`: estimated word timings from script.txt (no audio)
- `yarn voiceover <slug>`: ElevenLabs TTS + timings (costs money; needs `.env`, ask first)
- `yarn from-whisper <slug> <whisper.json>`: timings from a human recording
- `yarn check [slug]`: resolve all cues, flag stale transcripts and too-short scenes
- `yarn stills <slug>`: one PNG per scene in `out/<slug>/stills/` (read them to review layout)
- `yarn render <slug>`: final `out/<slug>.mp4`
- `yarn verify`: typecheck + lint + check. Run before calling any change done.

## Rules

- **Determinism.** Every visual is a pure function of `useCurrentFrame()`. No `useFrame` from R3F, no
  `Math.random()` (use `random('seed')` from remotion), no `Date.now()`, no CSS transitions/animations.
  ESLint enforces most of this.
- **Cues, not seconds.** Scenes start on a `cue` (the first words of a phrase, as spoken). Overlays use
  `cue` or `at` (seconds into the scene). Cues survive re-recording; absolute times don't.
- After editing `script.txt`, regenerate timings (`yarn timings <slug>`) or `yarn check` will warn.
- Overlay `x`/`y` are fractions of the frame (0.5, 0.5 = centre). Keep text clear of the captions band
  (around y 0.70–0.80) and the top chip.
- Colours come from `theme`, fonts from `fonts`. Don't hard-code new colours in a video; add them to the
  theme if they're truly needed, since the shared look is the brand.
- New scene: `src/scenes/XScene.tsx` taking `{durationInFrames, ...props}`, register in
  `src/scenes/index.ts` (both `SCENES` and `SceneName`). Reuse `three/` parts before writing new ones.
- New overlay type: component in `src/components/`, add to `OverlaySpec` in `types.ts` and the switch in
  `Explainer.tsx`.
- Visual changes are verified by looking at frames: run `yarn stills <slug>` and read the PNGs.
  Typecheck passing does not mean it looks right.

## How we work

- **Plan first.** Propose a plan and wait. Write code only after the user says to code, and commit only
  after the user says to commit. These are two separate permissions.
- **The main session orchestrates.** It plans with the user, sends each task to the agent that owns it
  (`.claude/agents/`), checks what comes back, and reports. Agents stay in their own area and never commit.
  Tasks that can run side by side (e.g. two scenes) use separate git worktrees.

| Agent           | Owns                                                    |
| --------------- | ------------------------------------------------------- |
| researcher      | `sources.md`: facts, sources, angles                    |
| scriptwriter    | `script.txt`                                            |
| fact-checker    | statuses in `sources.md` (read-only on everything else) |
| voice           | voiceover and timings                                   |
| director        | `spec.ts`                                               |
| scene-builder   | `src/scenes`, `src/three`, `src/components`             |
| visual-reviewer | nothing (renders stills and reports)                    |
| publisher       | `publish.md` and the cover frame                        |
| tooling         | `scripts/`, deps, config                                |

New video pipeline: researcher → scriptwriter → fact-checker (**PASS** needed) → **user approves the
script** → voice → director → scene-builder (only if a scene is missing) → visual-reviewer (**SHIP**
needed) → publisher → **user approves and commits**.

## Sources

Every video has `src/videos/<slug>/sources.md` (format in `docs/sources-format.md`). Any specific number,
named company, study, or "they do X" claim needs a ✅ verified source, unless it is hedged (🟡) or marked
illustrative (🎭, with the watermark on). Never invent a URL or quote. Sources go in the post description,
not on screen. `yarn check` warns about a missing sources.md and any ❌ claims.

## Style of the videos

- 150–170 words ≈ 60 s. Hook in the first sentence. Short, spoken sentences.
- One idea per scene; a scene change roughly every 3–6 s.
- Calm, factual tone. The "ILLUSTRATIVE" watermark stays on videos that use invented specifics.
