---
name: new-video
description: Create a new explainer video from a topic or a draft script. Scaffolds the folder, writes or tightens the script, lays out scenes and overlays in spec.ts, and verifies with stills. Use when the user wants to start a new video.
---

# New video

Input: a topic, an angle, or a draft script. Ask for the topic if none was given.

1. **Slug.** Pick a short kebab-case slug (e.g. `wifi-router-tracking`), then run `yarn new <slug>`.
2. **Script** in `src/videos/<slug>/script.txt`:
   - 150–170 words (≈60 s). Count them.
   - Sentence 1 is the hook: a surprising claim or a question the viewer has had.
   - Short spoken sentences, one idea each, concrete images ("same couch", not "proximity").
   - End on a payoff line that reframes the hook.
   - Every factual claim needs an entry in `sources.md` (format: `docs/sources-format.md`). Make claims
     only with ✅ sources, hedge 🟡 ones, and mark invented specifics 🎭 illustrative.
   - If the user gave a draft, tighten it but keep their voice. Show the script and get approval
     before laying out scenes; it's the cheapest thing to change.
3. **Timings:** `yarn timings <slug>` (estimated). Don't run `yarn voiceover` unless the user asks: it costs money.
4. **Spec** in `src/videos/<slug>/spec.ts`. Use `src/videos/phone-listening/spec.ts` as the reference.
   - Split the script into beats; one scene per beat, each starting on a `cue` copied from the script.
   - Reuse existing scenes (`src/scenes/index.ts`) and their props first. If a beat truly needs a new
     scene, list it and use the `new-scene` skill rather than squeezing it in.
   - A `chip` per scene (short, mono label). Overlays only where they add information.
5. **Verify:** `yarn verify`, then `yarn stills <slug>` and look at every PNG (see `review-video`).
   Fix overlaps and placement by adjusting `x`/`y`/`dx`/`dy`, then re-run stills.
6. Report: the script, the beat → scene table, and anything still placeholder.
