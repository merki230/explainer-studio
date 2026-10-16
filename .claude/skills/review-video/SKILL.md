---
name: review-video
description: Visually review a video's layout by rendering one still per scene and checking each against the house style. Use after changing a spec, scene, or overlay, or when the user asks how a video looks.
---

# Review video

1. `yarn check <slug>`: fix any ERROR first.
2. `yarn stills <slug>` (add `--frames=a,b,c` for specific moments) and Read every PNG in
   `out/<slug>/raw/stills/`.
3. For each still, run the review checklist at the end of `brand/style-guide.md`, and check:
   - Overlays don't overlap each other, the title block, or the captions; at most one card on screen at a time.
   - Callout leader lines point at the thing they name.
   - Text is readable at phone size (nothing tiny, enough contrast on the panel).
   - The subject of the beat is obvious within a second; nothing important is cropped by the
     9:16 frame.
   - 3D frames aren't black or empty (see Troubleshooting in README.md).
4. Report issues per scene with a concrete fix (e.g. "callout y 0.38 → 0.33"), apply them if asked,
   and re-render the stills to confirm.
