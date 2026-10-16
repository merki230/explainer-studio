# sources.md format

Every video has `src/videos/<slug>/sources.md`. The researcher creates it, the fact-checker sets the
statuses, and the publisher turns it into the **Sources** list in the post description.

One section per claim, in script order:

```markdown
## 1. Ad networks link devices that share a home IP address

- **Script:** "To an ad company, that looks like one household."
- **Status:** ✅ verified
- **Source:** [Cross-Device Tracking: An FTC Staff Report](https://www.ftc.gov/...), FTC, 2017-01 (accessed 2026-10-15)
- **Quote:** "…exact words from the source that support the claim…"
- **Note:** Optional: scope, caveats, or the hedged wording needed.
```

## Statuses

| Status          | Meaning                                                       | Allowed in the script?                                           |
| --------------- | ------------------------------------------------------------- | ---------------------------------------------------------------- |
| ✅ verified     | A source the fact-checker opened supports the claim as worded | Yes                                                              |
| 🟡 plausible    | Supported with caveats                                        | Only with attribution ("the FTC says") or the source's own hedge |
| ❌ unsupported  | No source, or the source says otherwise                       | No. Cut it, or mark it illustrative                              |
| 🎭 illustrative | Deliberately invented example (a fake IP, a round number)     | Yes, with an "Illustrative: …" line in the post description      |

## Rules

- Any specific number, named company or person, study, or "they do X" claim needs a ✅ entry.
- Never invent a URL or quote. A claim with no source stays ❌.
- Sources appear in the post description only, never on screen. Spoken attribution ("researchers found",
  "Apple and Google say") stays in the script where the story needs it.
