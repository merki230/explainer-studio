// Text-to-speech + word timestamps in ONE call (ElevenLabs "with-timestamps").
// Writes src/videos/<slug>/audio/voiceover.mp3 and src/videos/<slug>/transcript.json.
// COSTS CREDITS (one character per character sent, tags included).
//
// usage:
//   yarn voiceover <slug>                 write the live files
//   yarn voiceover <slug> --take <name>   write out/<slug>/raw/voices/<name>.mp3 + .transcript.json instead
//   yarn voiceover:use <slug> <name>      copy a take into place (no API call, see use-take.mjs)
//   yarn voiceover <slug> --hook <n>     a Short's hook line (long-form): audio/short-<n>-hook.mp3 + transcript.json `hooks.<n>`
//   yarn voiceover <slug> --by-chapter [--chapter <n>] [--gap <s>] [--join]   long-form: one request per chapter (below)
//   yarn voiceover ... --dry-run          print the text that would be sent (and the chapters), spend nothing
//   yarn voiceover --text "Hello. [pause] World." --take _test   ad-hoc text (needs --take; uses slug "_adhoc")
//
// Text: src/videos/<slug>/performance.txt when it exists (the same words as script.txt plus audio
// tags like [pause], [curious] and ellipses), otherwise script.txt. Tags never reach transcript.json.
// Long-form scripts: `## chapter` and `> Short hook:` lines are never sent or timed; the chapters (first word of
// each) are recorded in transcript.json. `--hook <n>` sends only chapter n's `> Short hook:` text (from
// performance.txt when it has that line, else script.txt) in the same voice, to its own file, so hook lines can be
// recorded later in the same session; `--take` works with it too.
//
// --by-chapter (long-form, helpers in voiceover-chapters.mjs): each `## ` chapter is its own request (a 7-minute take in one
// request risks tone drift, the 10,000-character limit of eleven_v4, and re-recording everything to fix one chapter).
// Same text rules as above (performance.txt when present; hook lines never sent). Continuity: eleven_v4 supports request
// stitching (checked against the ElevenLabs docs, 2026-11-02; only eleven_v3 does not), so a full run sends
// `previous_request_ids` (the last 3 request ids of the run) and `next_text` (start of the next chapter). `--chapter <n>`
// re-records one chapter with `previous_text`/`next_text` from its neighbours instead, because saved request ids expire
// after 2 hours. Each chapter is saved at once to out/<slug>/raw/voices/chapters/<take|live>/ch<n>.mp3 + .json (words with
// script spelling, request id); a failed run keeps the finished chapters. When all chapters exist they are joined with
// `--gap <s>` (default 3.9 s = 117 frames, style-guide § 11.5.1 chapter card) between the last word of a chapter and the first word of the next: silence already in the takes (trailing/leading, [pause] tags) counts, only the rest is added. A 10 ms fade-in and 25 ms fade-out on each piece (no clicks), into
// audio/voiceover.mp3 and transcript.json (each chapter's times offset by the audio length before it plus the gaps; chapter
// records as in the one-shot path). With --take the join goes to voices/<name>.mp3 + .transcript.json. `--join` re-joins
// the saved chapters without any request (free; e.g. to change --gap). --dry-run lists every chapter's text, size and request.
//
// Settings, highest priority first: env (ELEVENLABS_VOICE_ID, ELEVENLABS_MODEL_ID), then
// src/videos/<slug>/voice.json {voiceId, modelId?, stability?, similarityBoost?}, then defaults
// (model eleven_v4). Eleven v4 accepts only stability + similarity_boost; style/speed are sent
// only for older models. Put ELEVENLABS_API_KEY in .env (see .env.example).
import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {alignmentToWords, CHAPTER_BREAK_S} from './voiceover-chapters.mjs';
import {
  apiKey, hookAudioPath, norm, parseScript, readVoiceConfig, spokenOf, stripTags, videoPaths, withScriptText, writeTranscript,
} from './lib.mjs';

const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(name);
  if (i < 0) return undefined;
  const v = args[i + 1];
  args.splice(i, v === undefined ? 1 : 2);
  return v ?? '';
};
const take = flag('--take');
const adhoc = flag('--text');
const hookArg = flag('--hook');
const chapterArg = flag('--chapter');
const gapArg = flag('--gap');
const byChapter = args.includes('--by-chapter');
if (byChapter) args.splice(args.indexOf('--by-chapter'), 1);
const joinOnly = args.includes('--join');
if (joinOnly) args.splice(args.indexOf('--join'), 1);
const dryRun = args.includes('--dry-run');
if (dryRun) args.splice(args.indexOf('--dry-run'), 1);
const usage =
  'yarn voiceover <slug> [--take <name>] [--hook <chapter>] [--dry-run]\n       yarn voiceover <slug> --by-chapter [--chapter <n>] [--gap <s>] [--join] [--take <name>] [--dry-run]';
const gap = gapArg === undefined ? CHAPTER_BREAK_S : Number(gapArg);
const chapter = chapterArg === undefined ? null : Number(chapterArg);
if (!Number.isFinite(gap) || gap < 0 || gap > 10 || (chapter !== null && (!Number.isInteger(chapter) || chapter < 1))) {
  console.error(`--gap is seconds (0..10); --chapter is a chapter number. usage: ${usage}`);
  process.exit(1);
}
if ((gapArg !== undefined || chapter !== null || joinOnly) && !byChapter) {
  console.error(`--gap, --chapter and --join only work with --by-chapter. usage: ${usage}`);
  process.exit(1);
}
if (byChapter && (adhoc || hookArg !== undefined)) {
  console.error(`--by-chapter can't be combined with --text or --hook. usage: ${usage}`);
  process.exit(1);
}
if (take === '' || args.includes('--take')) {
  console.error(`--take needs a name. usage: ${usage}`);
  process.exit(1);
}

const paths = adhoc ? null : videoPaths(args[0], usage);
if (adhoc && !take) {
  console.error('--text requires --take <name> so live files are never touched.');
  process.exit(1);
}

const hook = hookArg === undefined ? null : Number(hookArg);
if (hook !== null && (!Number.isInteger(hook) || hook < 1 || adhoc)) {
  console.error(`--hook needs a chapter number (1, 2, ...) and a slug. usage: ${usage}`);
  process.exit(1);
}

const cfg = paths ? readVoiceConfig(paths) : {};
const voiceId = process.env.ELEVENLABS_VOICE_ID ?? cfg.voiceId ?? '21m00Tcm4TlvDq8ikWAM';
const modelId = process.env.ELEVENLABS_MODEL_ID ?? cfg.modelId ?? 'eleven_v4';
const isV4 = modelId.startsWith('eleven_v4');

const hasPerf = !adhoc && existsSync(paths.performance);
const scriptText = adhoc ? '' : readFileSync(paths.script, 'utf8');
let source = 'script.txt';
let text;
if (adhoc) {
  text = adhoc.trim();
  source = '--text';
} else if (hook !== null) {
  // the hook line of chapter `hook`: performance.txt's version (with tags) when it has one, else script.txt's
  const fromScript = parseScript(scriptText).chapters[hook - 1]?.hook;
  const fromPerf = hasPerf ? parseScript(readFileSync(paths.performance, 'utf8')).chapters[hook - 1]?.hook : undefined;
  if (!fromScript) {
    console.error(`script.txt has no "> Short hook:" line under chapter ${hook}.`);
    process.exit(1);
  }
  text = (fromPerf ?? fromScript).trim();
  source = `${fromPerf ? 'performance.txt' : 'script.txt'} (chapter ${hook} Short hook)`;
} else if (hasPerf) {
  text = spokenOf(readFileSync(paths.performance, 'utf8')).trim();
  source = 'performance.txt';
} else text = spokenOf(scriptText).trim();

const voice_settings = {stability: cfg.stability ?? 0.5, similarity_boost: cfg.similarityBoost ?? 0.75};
if (!isV4) voice_settings.style = 0.2;

if (byChapter) {
  const {runByChapter} = await import('./voiceover-chapters.mjs');
  await runByChapter({
    paths, take, cfg, voiceId, modelId, isV4, dryRun, gap, chapter, joinOnly, voice_settings, scriptText,
    perfText: hasPerf ? readFileSync(paths.performance, 'utf8') : null,
  });
  process.exit(0);
}

if (dryRun) {
  console.log(`DRY RUN (nothing sent). Text from ${source}, ${text.length} characters:\n\n${text}\n`);
  if (hook === null && !adhoc) {
    const {chapters} = parseScript(scriptText);
    chapters.forEach((c, i) => console.log(`chapter ${i + 1} starts at spoken word ${c.tokens}: ${c.title}${c.hook ? '  (Short hook)' : ''}`));
  }
  process.exit(0);
}
const key = apiKey();

console.log(`Voice ${voiceId}, model ${modelId}, text from ${source} (${text.length} characters).`);

const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/with-timestamps`, {
  method: 'POST',
  headers: {'xi-api-key': key, 'Content-Type': 'application/json'},
  body: JSON.stringify({text, model_id: modelId, voice_settings}),
});
if (!res.ok) {
  console.error(`ElevenLabs ${res.status}: ${await res.text()}`);
  process.exit(1);
}
const used = res.headers.get('x-character-count');
const data = await res.json();

// Character alignment -> words (skips [tags] and ellipses, see voiceover-chapters.mjs).
const cleaned = alignmentToWords(data.alignment);

// The words must match the script word for word, or cues and "yarn check" break.
// When the counts match, use script.txt's spelling and punctuation (captions page on punctuation).
let rounded = cleaned;
if (paths && hook !== null) {
  rounded = withScriptText(cleaned, parseScript(scriptText).chapters[hook - 1].hook).words;
} else if (paths && existsSync(paths.script)) {
  rounded = withScriptText(cleaned, scriptText).words;
}
const expected = stripTags(text).split(' ').map(norm).filter(Boolean);
const got = rounded.map((w) => norm(w.text));
if (expected.join(' ') !== got.join(' ')) {
  console.warn(`WARNING: transcript words differ from the text sent (${got.length} vs ${expected.length} words).`);
}

const audio = Buffer.from(data.audio_base64, 'base64');
const doc = {audio: hook !== null ? hookAudioPath(hook) : 'audio/voiceover.mp3', words: rounded};
let audioOut;
let transcriptOut;
if (take) {
  const dir = adhoc ? 'out/voices/_test' : paths.takesDir;
  mkdirSync(dir, {recursive: true});
  audioOut = `${dir}/${take}.mp3`;
  transcriptOut = `${dir}/${take}.transcript.json`;
  writeFileSync(transcriptOut, JSON.stringify(doc, null, 2));
} else {
  mkdirSync(paths.audioDir, {recursive: true});
  audioOut = hook !== null ? `${paths.dir}/${doc.audio}` : paths.audioFile;
  transcriptOut = paths.transcript;
  if (hook !== null) {
    // only this chapter's hook entry changes
    const current = JSON.parse(readFileSync(paths.transcript, 'utf8'));
    writeTranscript(paths, {audio: current.audio, words: current.words}, {...current.hooks, [hook]: doc});
  } else writeTranscript(paths, doc);
}
writeFileSync(audioOut, audio);
console.log(
  `Wrote ${audioOut} and ${transcriptOut} (${rounded.length} words, ${rounded.at(-1)?.end}s). Characters used: ${used ?? 'unknown'}.`,
);
