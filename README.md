# Explainer Studio

Vertical 3D explainer videos ("how it secretly works" style) built with
**Remotion + React Three Fiber**: simple 3D scenes, sharp UI callouts, an AI
voiceover, and word-synced captions. Everything is code, so every video
looks the same and a new one is mostly a new script.

Demo render: [`docs/preview.mp4`](docs/preview.mp4) (silent, estimated timings).

## Setup

```bash
npm install
npm run studio        # opens the editor at http://localhost:3000
```

The demo plays right away with **estimated** timings and no audio.

## Making a video

1. **Write the script** in `script.txt`. 150–170 words is about 60 seconds.
   Put the hook in the first sentence.
2. **Get word timings**, using one of these:
   - Preview without audio: `npm run timings`
   - AI voice (ElevenLabs):
     `ELEVENLABS_API_KEY=xxx ELEVENLABS_VOICE_ID=yyy npm run voiceover`
     This writes `public/voiceover.mp3` and `src/data/transcript.json` in one call.
   - Your own recording: see the comments in `scripts/whisper-to-transcript.mjs`
3. **Lay out scenes** in `src/video.ts`. Each scene starts on a `cue`, which
   is the first words of a phrase in the voiceover, and runs until the next
   scene. Overlays start on a `cue` or `at` seconds into their scene. Cues
   keep working when you re-record the voiceover.
4. **Tune positions in the Studio.** Overlay `x`/`y` are fractions of the
   1080×1920 frame (0.5, 0.5 is the centre).
5. **Render:** `npm run render` writes `out/video.mp4`. For a quick
   single-frame check, run `npm run still`.

## What's included

| Piece | File |
|---|---|
| Scenes: `phone` (CSS lock screen), `room` (couch, two mannequins, Wi-Fi arcs), `profiles` (two busts + data dots), `tiles` (colour-tile field) | `src/scenes/` |
| 3D parts: mannequin, head, living room, glowing arc, ripple, camera dolly | `src/three/` |
| Overlays: chip, callout, search bar, ad card, counter, captions | `src/components/` |
| Colours, fonts, frame size, fade length | `src/theme.ts` |
| Cue → frame resolution | `src/timeline.ts` |

`room` props: `camera: 'wide' | 'push' | 'table'`, `arcs`, `arcsAt`, `facing`.

## Adding a scene

1. Create `src/scenes/MyScene.tsx`. It receives `durationInFrames` plus your props.
2. Drive **all** motion from `useCurrentFrame()`. Never use R3F's `useFrame`
   or `Math.random()`; use `random('seed')` from remotion so renders are
   repeatable.
3. Register it in `src/scenes/index.ts` and add it to the `SceneName` union.

A good prompt for Claude: *"Add a scene called `router` to this Remotion
project: a 3D router on a desk with packets flying out to 5 devices in a
semicircle. Use the existing Stage, CameraRig, Arc and theme."*

## Troubleshooting

- **Black 3D frames when rendering:** the GL renderer is set to `angle` in
  `remotion.config.ts`. Try `npx remotion render ... --gl=swangle`, or
  uncomment `setConcurrency(1)`.
- **"Cue not found":** the cue words must match the transcript exactly
  (case and punctuation are ignored). Check `src/data/transcript.json`.
