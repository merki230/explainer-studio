# Explainer Studio

Vertical 3D explainer videos ("how it secretly works" style) built with
**Remotion + React Three Fiber**: simple 3D scenes, sharp UI callouts, an AI
voiceover, and word-synced captions. Everything is code, so every video
looks the same and a new one is mostly a new script.

Demo render: [`docs/preview.mp4`](docs/preview.mp4) (silent, estimated timings).

## Setup

Requires Node 24 (`nvm use`) and Yarn 4 (`corepack enable`).

```bash
yarn install
cp .env.example .env  # only needed for AI voiceovers
yarn studio           # opens the editor at http://localhost:3000
```

The demo video (`phone-listening`) plays right away with **estimated** timings and no audio.

## Layout

Each video lives in its own folder and is its own composition in the Studio:

```
src/videos/<slug>/script.txt       the voiceover text
src/videos/<slug>/spec.ts          scenes + overlays, keyed to cues in the script
src/videos/<slug>/transcript.json  word timings (generated)
public/<slug>/voiceover.mp3        the audio
```

Shared building blocks (`src/scenes`, `src/three`, `src/components`, `src/theme.ts`) are used by every video.

## Making a video

1. **Create it:** `yarn new my-topic` scaffolds `src/videos/my-topic/` and registers it.
2. **Write the script** in `script.txt`. 150–170 words is about 60 seconds. Put the hook in the first sentence.
3. **Get word timings**, using one of these:
   - Preview without audio: `yarn timings my-topic`
   - AI voice (ElevenLabs, key in `.env`): `yarn voiceover my-topic`
   - Your own recording: see the comments in `scripts/whisper-to-transcript.mjs`
     Every factual claim gets a source in `sources.md` ([format](docs/sources-format.md)); the sources go in
     the post description.
4. **Lay out scenes** in `spec.ts`. Each scene starts on a `cue`, which is the first words of a phrase in
   the voiceover, and runs until the next scene. Overlays start on a `cue` or `at` seconds into their scene.
   Cues keep working when you re-record the voiceover.
5. **Check it:** `yarn check my-topic` resolves every cue; `yarn stills my-topic` writes one PNG per scene
   to `out/my-topic/stills/`. Fine-tune overlay `x`/`y` (fractions of the 1080×1920 frame) in the Studio.
6. **Render:** `yarn render my-topic` writes `out/my-topic.mp4`.

`yarn verify` runs typecheck, lint and check together.

## Working with Claude Code

`CLAUDE.md` holds the project rules and the team workflow. `.claude/agents/` holds one agent per job
(researcher, scriptwriter, fact-checker, voice, director, scene-builder, visual-reviewer, publisher,
tooling), and `.claude/skills/` holds three workflows:

- `/new-video`: topic → script → timings → scene layout → visual check
- `/new-scene`: build and register a new reusable scene
- `/review-video`: render stills and review every scene against the house style

## What's included

| Piece                                                                                                                                          | File              |
| ---------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| Scenes: `phone` (CSS lock screen), `room` (couch, two mannequins, Wi-Fi arcs), `profiles` (two busts + data dots), `tiles` (colour-tile field) | `src/scenes/`     |
| 3D parts: mannequin, head, living room, glowing arc, ripple, camera dolly                                                                      | `src/three/`      |
| Overlays: chip, callout, search bar, ad card, counter, captions                                                                                | `src/components/` |
| Colours, fonts, frame size, fade length                                                                                                        | `src/theme.ts`    |
| Cue → frame resolution                                                                                                                         | `src/timeline.ts` |

`room` props: `camera: 'wide' | 'push' | 'table'`, `arcs`, `arcsAt`, `facing`.

## Adding a scene

1. Create `src/scenes/MyScene.tsx`. It receives `durationInFrames` plus your props.
2. Drive **all** motion from `useCurrentFrame()`. Never use R3F's `useFrame`
   or `Math.random()`; use `random('seed')` from remotion so renders are
   repeatable. `yarn lint` catches both.
3. Register it in `src/scenes/index.ts` and add it to the `SceneName` union.

A good prompt for Claude: _"Add a scene called `router` to this Remotion
project: a 3D router on a desk with packets flying out to 5 devices in a
semicircle. Use the existing Stage, CameraRig, Arc and theme."_

## Troubleshooting

- **Black 3D frames when rendering:** the GL renderer is set to `angle` in
  `remotion.config.ts`. Try `yarn render <slug> --gl=swangle`, or
  uncomment `setConcurrency(1)`.
- **"Cue not found":** the cue words must match the transcript exactly
  (case and punctuation are ignored). Check `src/videos/<slug>/transcript.json`, or run `yarn check` to list them all.
