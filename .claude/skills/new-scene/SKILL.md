---
name: new-scene
description: Build a new reusable scene (3D or 2D) for the explainer videos and register it. Use when a video beat needs a visual the existing scenes in src/scenes/ can't express.
---

# New scene

1. Read `src/scenes/index.ts` and one close existing scene (`RoomScene.tsx` for 3D, `PhoneScene.tsx`
   for CSS/2D) plus the parts in `src/three/` (Stage, CameraRig, Mannequin, Arc, LivingRoom).
   Reuse them; extend a part with a prop before duplicating it.
2. Create `src/scenes/<Name>Scene.tsx`:
   - Props: `{durationInFrames: number, ...}` with defaults, exported as `<Name>SceneProps`, and a
     one-line doc comment on what it shows.
   - All motion from `useCurrentFrame()` + `interpolate`/`spring`. Seeded `random('…')` only.
   - Colours from `theme`, fonts from `fonts`. Simple shapes and soft lighting, matching the
     low-poly mannequin look.
   - Leave room for the top chip and the captions band (y ≈ 0.70–0.80 of 1920).
3. Register it in `src/scenes/index.ts` in both `SCENES` and `SceneName`.
4. Show it: temporarily use it in a video's spec (or the one that needs it), run `yarn verify` and
   `yarn stills <slug>`, and look at the frame. For motion, use `--frames=` to grab start/middle/end.
   Iterate until it reads clearly at phone size.
5. Add the scene and its props to the "What's included" table in README.md.
