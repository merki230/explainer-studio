# ElevenLabs skills (vendored)

Copied from https://github.com/elevenlabs/skills at commit 32f48f6 (2026-10-14), MIT licence
(`ELEVENLABS-LICENSE`). Reviewed before install: documentation only, no scripts.

Installed: text-to-speech, speech-to-text, voice-isolator, sound-effects, music, dubbing.
Skipped: agents, speech-engine, voice-changer, setup-api-key (not used for videos).

Studio rules when using them:
- Call the REST API from our own `scripts/` (Node `fetch`). Do not run the `curl ... | sh` CLI
  installer or `pip install` from their installation pages.
- The API key lives in `.env` (`ELEVENLABS_API_KEY`); never print it.
- Every generation costs credits: ask before running one unless the task says so.

To update: re-clone the repo, diff against these folders, review, then copy.
