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

| Piece                                                                                                                                                                                                                                                                                                                                                       | File              |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| Scenes (all in the Plaster Museum look): `phone` (plaster phone on a pedestal: orange mic light, or the screen being recorded and sent out), `room` (living room, two mannequins, laptop, orange network reveal, per-device lights), `profiles` (two busts on pedestals, orange link, data points), `tiles` (plaster tile field, matched tiles turn orange) | `src/scenes/`     |
| Plaster Museum kit: `MuseumStage` (canvas + post), `MuseumLights`, `MuseumSet` (plinth, floor, wall), `PlasterBox`, `BlobShadow`, `WallPlate`, `plaster()`, `roundedBox()`, `roundedCylinder()`, `stainMaterial()`, `stainSurface()`, `raw()`                                                                                                               | `src/three/`      |
| 3D parts: `Mannequin` (seated plaster figure with phone), `Bust` (faceless bust with shoulders and arm stubs, on a pedestal), `LivingRoom` (with a laptop), `OrangePath` / `OrangeLight` / `OrangeWash`, `CameraRig`; plain `Stage`, `Arc` (no bloom, for non-museum canvases)                                                                              | `src/three/`      |
| Post: `MuseumPost` (orange-only bloom, soft focus band, exposure + highlight roll-off, vignette, grain)                                                                                                                                                                                                                                                     | `src/three/`      |
| Overlays, all paper exhibit cards (`components/card.ts`): chip (exhibit label), callout, search bar, ad card, counter; captions (serif, current word orange)                                                                                                                                                                                                | `src/components/` |
| Colours (plaster + one orange, style-guide token names), frame size, fade length, platform safe zone                                                                                                                                                                                                                                                        | `src/theme.ts`    |
| Fonts: Fraunces (serif) + JetBrains Mono, `fontsReady()` for canvas drawing                                                                                                                                                                                                                                                                                 | `src/fonts.ts`    |
| Cue → frame resolution                                                                                                                                                                                                                                                                                                                                      | `src/timeline.ts` |

`room` props:

| Prop           | Type                                                     | Default                    | What it does                                                                                                                                                                                                                                                                                      |
| -------------- | -------------------------------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `camera`       | `'wide' \| 'push' \| 'table' \| 'devices' \| CameraMove` | `'wide'`                   | Camera move: whole exhibit, people + router (starts exactly where `wide` ends, so wide → push crossfades invisibly), close on the phones, `devices` (low and wide: both phones, the laptop and the router between the label and the captions), or a custom `{from, to, lookFrom, lookTo, focusY}` |
| `arcs`         | `boolean`                                                | `false`                    | Reveal the network: orange route phone A → router → phone B, router LED, wall wash, data dots                                                                                                                                                                                                     |
| `arcsAt`       | `number` (s)                                             | `0.3`                      | When the route starts drawing                                                                                                                                                                                                                                                                     |
| `pathDuration` | `number` (s)                                             | `1.8`                      | How long the route takes to draw                                                                                                                                                                                                                                                                  |
| `tellAt`       | `number` (s)                                             | `arcsAt - 1.5` when `arcs` | Phone A flickers orange, then holds (the tell). Negative = already lit. Works without `arcs`                                                                                                                                                                                                      |
| `glowFor`      | `number` (s)                                             | keep glowing               | Glow time after the route completes; then glow and dots fade, leaving the stain line on the wall                                                                                                                                                                                                  |
| `stained`      | `boolean`                                                | `false`                    | Start with the stains in place (wall stain, wall wash, LED): a later look at the room                                                                                                                                                                                                             |
| `facing`       | `boolean`                                                | `false`                    | Heads turn toward each other (eased in over 0.8 s from `facingAt`)                                                                                                                                                                                                                                |
| `facingAt`     | `number` (s)                                             | `0`                        | When the heads start to turn                                                                                                                                                                                                                                                                      |
| `devicesAt`    | `[number, number, number]` (s)                           | none                       | When phone B ("you"), the laptop and phone A light up, in that order: a short flicker, then hold. Overrides `tellAt` and the reveal's screen. Negative = already lit                                                                                                                              |
| `householdAt`  | `number` (s)                                             | none                       | "One home": the router's light (+35%) and the wall wash (0.40 → 0.50) brighten over 0.5 s and stay                                                                                                                                                                                                |
| `plate`        | `{number, title}`                                        | none                       | Engraved wall plate, e.g. `{number: 'No. 014', title: 'The Living Room'}`                                                                                                                                                                                                                         |
| `plateAt`      | `[x, y]` (wall units)                                    | auto                       | Where the plate hangs. Auto: the first of `ROOM.plateSpots` that stays inside x 120–888 and off the label for this camera move                                                                                                                                                                    |

`phone` props:

| Prop          | Type                                     | Default   | What it does                                                                                                                                                                                                         |
| ------------- | ---------------------------------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `camera`      | `'front' \| 'close' \| 'screen' \| move` | `'front'` | Slow push. Each preset starts where the previous ends (front → close → screen), so up to three phone shots in a row read as one move. Or a custom `{from, to, lookFrom, lookTo, focusY}`                             |
| `micDot`      | `boolean`                                | `false`   | Orange mic light by the front camera                                                                                                                                                                                 |
| `micAt`       | `number` (s)                             | `0.6`     | When the mic light flickers on (then pulses slowly)                                                                                                                                                                  |
| `screenRec`   | `boolean`                                | `false`   | The screen is recorded: an orange line traces the screen edge (1.2 s), a scan band sweeps it every 1.5 s, a route leaves the top and runs off-frame, bleed 0.3; after 1 s the edge glow fades to a matte stain frame |
| `screenRecAt` | `number` (s)                             | `0.3`     | When the edge starts tracing. Negative = already under way                                                                                                                                                           |
| `screenStain` | `boolean`                                | `false`   | Start with the stain frame on the screen and nothing live (a later look at the same phone)                                                                                                                           |
| `plate`       | `{number, title}`                        | none      | Engraved wall plate                                                                                                                                                                                                  |

`profiles` props: `linkAt` (s, `0.3`), `linkDuration` (s, `1.2`), `glowFor` (s, keep glowing), `points` (data points, `16`), `spread` (half the distance between busts, `0.72`), `plate` (`{number, title}`, none).

`tiles` props: `cols` (`12`), `rows` (`22`), `matched` (share of tiles that turn orange, `0.14`), `matchAt` (s, `1.0`), `matchDuration` (s, `2.4`: the wave crosses the field front to back).

Overlays: `callout` takes `place: 'side' | 'above'` (card beside the anchor, or centred above it) and keeps its card inside x 120–888; `search` `y` is the bar's centre.

Scene chips are exhibit labels: `chip: {title: 'No. 014 · The Living Room', text: 'One network'}` (title in serif, text in small mono). `delay` (s, default 0) holds the label back, e.g. `delay: 1.0` on a video's first scene.
Keep all text inside the platform safe zone (`SAFE` in `theme.ts`: x 120–888, y 288–1248). Captions sit centred on y = 0.60.

## Adding a scene

1. Create `src/scenes/MyScene.tsx`. It receives `durationInFrames` plus your props.
2. Drive **all** motion from `useCurrentFrame()`. Never use R3F's `useFrame`
   or `Math.random()`; use `random('seed')` from remotion so renders are
   repeatable. `yarn lint` catches both.
3. Register it in `src/scenes/index.ts` and add it to the `SceneName` union.

A good prompt for Claude: _"Add a scene called `router` to this Remotion
project: a 3D router on a desk with packets flying out to 5 devices in a
semicircle. Use MuseumStage, MuseumLights, MuseumSet, CameraRig, OrangePath and theme."_

## Troubleshooting

- **Black 3D frames when rendering:** the GL renderer is set to `angle` in
  `remotion.config.ts`. Try `yarn render <slug> --gl=swangle`, or
  uncomment `setConcurrency(1)`.
- **"Cue not found":** the cue words must match the transcript exactly
  (case and punctuation are ignored). Check `src/videos/<slug>/transcript.json`, or run `yarn check` to list them all.
