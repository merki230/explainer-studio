// Fast sanity check for every video (or one): resolves cues against the
// transcript and flags common mistakes (stale timings, missing audio or
// sources, unsupported claims), without opening the Studio.
//
// usage: yarn check [slug]
//
// Long-form (horizontal) videos: `## chapter` and `> Short hook:` lines of script.txt are skipped when comparing words;
// the chapters recorded in transcript.json must match them (and be >= 3, each >= 10 s, YouTube's rule); each Short in
// `spec.shorts` is resolved and checked like a video (hook timings, scenes, files, length).
// Chapter cards (style guide § 11.5.1): an entry for chapter 1 is an error, so is a chapter's first scene with a
// transition other than slide/follow, a question that differs from the heading or fits no size, and a hold outside
// 2.0 to 3.0 s; `show: false` and a chapter gap shorter than CHAPTER_BREAK_FRAMES are warnings.
import {existsSync, readFileSync} from 'node:fs';
import {cardText} from '../src/components/chapterCardLayout';
import {auditionWarning, soundFiles} from '../src/components/soundMix';
import {transitionInto} from '../src/scenes/transitions';
import {deriveShort, resolveShortTimeline} from '../src/shorts';
import {CHAPTER_BREAK_FRAMES, FADE, FPS} from '../src/theme';
import {CARD_HOLD_RANGE, chapterCardFrames, chapterGap, resolveTimeline} from '../src/timeline';
import {VIDEOS} from '../src/videos';
import {listVideos, parseScript, spokenOf, stripTags} from './lib.mjs';

const norm = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '');
const only = process.argv[2];
let failed = false;

for (const folder of listVideos()) {
  if (!VIDEOS[folder]) console.warn(`! src/videos/${folder}/ is not registered in src/videos/index.ts`);
}

for (const [slug, {spec, transcript}] of Object.entries(VIDEOS)) {
  if (only && slug !== only) continue;
  const errors: string[] = [];
  const warnings: string[] = [];
  const words = transcript.words;

  // Script edited but timings not regenerated?
  const scriptFile = `src/videos/${slug}/script.txt`;
  if (existsSync(scriptFile)) {
    const scriptWords = spokenOf(readFileSync(scriptFile, 'utf8')).split(/\s+/).map(norm).filter(Boolean);
    const said = words.map((w) => norm(w.text)).filter(Boolean);
    if (scriptWords.join(' ') !== said.join(' ')) {
      warnings.push(`script.txt and transcript.json differ. Run "yarn timings ${slug}" (or redo the voiceover).`);
    }
  }

  // performance.txt (audio tags + ellipses) must say the same words as script.txt.
  const perfFile = `src/videos/${slug}/performance.txt`;
  if (existsSync(perfFile) && existsSync(scriptFile)) {
    const perf = stripTags(spokenOf(readFileSync(perfFile, 'utf8')))
      .split(' ')
      .map(norm)
      .filter(Boolean)
      .join(' ');
    const script = spokenOf(readFileSync(scriptFile, 'utf8')).split(/\s+/).map(norm).filter(Boolean).join(' ');
    if (perf !== script) warnings.push('performance.txt (minus tags and ellipses) differs from script.txt.');
  }

  // Chapters (long-form script layout): transcript.json must say what script.txt says.
  const parsed = existsSync(scriptFile) ? parseScript(readFileSync(scriptFile, 'utf8')) : null;
  const chapters = transcript.chapters ?? [];
  if (parsed && parsed.chapters.length) {
    const same =
      parsed.chapters.length === chapters.length &&
      parsed.chapters.every(
        (c, i) => c.title === chapters[i].title && (c.hook ? stripTags(c.hook) : undefined) === chapters[i].hook,
      );
    if (!same)
      warnings.push(
        `script.txt's ## chapters / > Short hook lines and transcript.json's differ. Run "yarn timings ${slug}" (or redo the voiceover).`,
      );
    if (parsed.lead > 0)
      warnings.push(
        `${parsed.lead} spoken words come before the first "##" heading (chapter 1 should open the script).`,
      );
    if (chapters.length && chapters.length < 3)
      warnings.push(`${chapters.length} chapter(s): YouTube chapter markers need at least 3.`);
    chapters.forEach((c, i) => {
      const next = chapters[i + 1];
      const end = next ? next.start : (words.at(-1)?.end ?? 0);
      if (end - (i === 0 ? 0 : c.start) < 10)
        warnings.push(`chapter ${i + 1} ("${c.title}") is under 10 s (YouTube chapter markers need >= 10 s).`);
      if (c.hook && !transcript.hooks?.[i + 1])
        warnings.push(`chapter ${i + 1} has a Short hook line but no hook timings. Run "yarn timings ${slug}".`);
      const hv = transcript.hooks?.[i + 1];
      if (
        hv &&
        c.hook &&
        hv.words
          .map((w) => norm(w.text))
          .filter(Boolean)
          .join(' ') !== c.hook.split(/\s+/).map(norm).filter(Boolean).join(' ')
      ) {
        warnings.push(
          `chapter ${i + 1}'s hook timings differ from its "> Short hook:" text (stale). Run "yarn timings ${slug}" or re-record it.`,
        );
      }
      if (hv?.audio && !existsSync(`src/videos/${slug}/${hv.audio}`))
        errors.push(`hook audio src/videos/${slug}/${hv.audio} is missing.`);
    });
  } else if (spec.format === 'horizontal') {
    warnings.push(
      'horizontal video, but script.txt has no "## chapter question" lines (needed for chapters and Shorts).',
    );
  }
  if (spec.shorts?.length && spec.format !== 'horizontal')
    warnings.push(
      'spec.shorts is set on a video that is not format: "horizontal" (Shorts are cut from long-form videos).',
    );

  const sourcesFile = `src/videos/${slug}/sources.md`;
  if (!existsSync(sourcesFile)) warnings.push('no sources.md yet (see docs/sources-format.md).');
  else {
    const unsupported = (readFileSync(sourcesFile, 'utf8').match(/\*\*Status:\*\*\s*❌/g) ?? []).length;
    if (unsupported) warnings.push(`${unsupported} unsupported (❌) claim(s) in sources.md.`);
  }

  if (!transcript.audio) {
    if (!spec.sandbox) warnings.push('no audio yet (estimated timings).');
  } else if (!existsSync(`src/videos/${slug}/${transcript.audio}`)) {
    errors.push(`audio file src/videos/${slug}/${transcript.audio} is missing.`);
  }

  const aw = auditionWarning(spec.music);
  if (aw) warnings.push(aw);

  // Music / sfx files a video asks for (missing ones are skipped in renders).
  for (const {src, from} of soundFiles(spec)) {
    if (!existsSync(`src/videos/${slug}/${src}`))
      warnings.push(`${from}: src/videos/${slug}/${src} is missing (skipped in renders).`);
  }

  try {
    const tl = resolveTimeline(spec, words, FPS, {chapters: transcript.chapters});
    tl.scenes.forEach((s, i) => {
      const secs = (s.endFrame - s.startFrame) / FPS;
      if (s.endFrame - s.startFrame <= FADE * 2) {
        warnings.push(`scene ${i + 1} (${s.scene}) is only ${secs.toFixed(2)}s long.`);
      }
    });
    // Chapter cards (§ 11.5.1): horizontal long-form videos only.
    const chs = transcript.chapters ?? [];
    for (const c of spec.chapters ?? []) {
      const heading = chs[c.chapter - 1]?.title;
      if (c.chapter < 2)
        errors.push(
          `chapters: an entry for chapter ${c.chapter}: chapter 1 has no card (the title block carries its question).`,
        );
      else if (spec.format === 'horizontal' && chs.length && !heading)
        errors.push(`chapters: chapter ${c.chapter} is not in the transcript (${chs.length} chapters).`);
      if (c.show === false)
        warnings.push(`chapters: chapter ${c.chapter} has show: false (no card; an owner decision, § 11.5.1).`);
      if (
        c.question !== undefined &&
        heading !== undefined &&
        c.question.replace(/\n/g, ' ').replace(/\s+/g, ' ') !== heading.replace(/\s+/g, ' ')
      ) {
        errors.push(
          `chapters: chapter ${c.chapter} question "${c.question.replace(/\n/g, '\\n')}" must equal the ## heading "${heading}" apart from line breaks.`,
        );
      }
      if (c.hold !== undefined && (c.hold < CARD_HOLD_RANGE[0] || c.hold > CARD_HOLD_RANGE[1])) {
        errors.push(
          `chapters: chapter ${c.chapter} hold ${c.hold} s is outside ${CARD_HOLD_RANGE[0]} to ${CARD_HOLD_RANGE[1]} s.`,
        );
      }
      if (c.sound && !existsSync(`src/videos/${slug}/audio/sfx/${c.sound}.mp3`)) {
        warnings.push(
          `chapters: chapter ${c.chapter} sound "${c.sound}": src/videos/${slug}/audio/sfx/${c.sound}.mp3 is missing.`,
        );
      }
    }
    if (spec.format === 'horizontal') {
      chs.forEach((ch, i) => {
        if (i === 0) return;
        const n = i + 1;
        const gap = chapterGap(words, ch, FPS);
        if (gap < CHAPTER_BREAK_FRAMES) {
          warnings.push(
            `chapter ${n}: the word gap at its boundary is ${gap} frames, under ${CHAPTER_BREAK_FRAMES} (the card needs the silent break; redo the voiceover with the chapter break).`,
          );
        }
      });
      for (const card of chapterCardFrames(spec, words, FPS, chs)) {
        if (!cardText(card.question)) {
          errors.push(
            `chapter ${card.chapter}: "${card.question.replace(/\n/g, ' ')}" does not fit the card (2 lines of ≈ 30 characters at 80 px, 33 at 72 px); send the heading back to the scriptwriter.`,
          );
        }
        const si = tl.scenes.findIndex((s) => s.startFrame === card.sceneAt);
        if (si < 1) {
          errors.push(
            `chapter ${card.chapter}: no scene starts on the chapter's first words (its cue), so nothing changes under the card (Q + 30 = frame ${card.sceneAt}).`,
          );
          continue;
        }
        const kind = transitionInto(tl.scenes[si - 1], tl.scenes[si], 'horizontal').kind;
        if (kind !== 'slide' && kind !== 'follow') {
          errors.push(
            `chapter ${card.chapter}: its first scene (${si + 1}, ${tl.scenes[si].scene}) comes in by "${kind}"; under a chapter card it must be slide or follow (§ 11.5.1).`,
          );
        }
        if (card.outStart + 12 > card.resume) {
          warnings.push(
            `chapter ${card.chapter}: the card is still fading out (frame ${card.outStart + 12}) after the narrator resumes (frame ${card.resume}); shorten its hold.`,
          );
        }
      }
    }
    const secs = tl.durationInFrames / FPS;
    console.log(`${slug}: ${tl.scenes.length} scenes, ${words.length} words, ${secs.toFixed(1)}s`);
  } catch (e) {
    errors.push((e as Error).message);
    console.log(`${slug}:`);
  }

  // Shorts cut from chapters: each is its own vertical composition, checked like a video.
  for (const sh of spec.shorts ?? []) {
    const label = `${slug}-short-${sh.chapter}`;
    try {
      const d = deriveShort({spec, transcript}, sh.chapter, FPS);
      const tl = resolveShortTimeline(d, FPS);
      const secs = tl.durationInFrames / FPS;
      const note = transcript.audio ? '' : ' (estimated)';
      console.log(`  ${label}: ${tl.scenes.length} scenes, ${secs.toFixed(1)}s${note}`);
      if (secs < 45 || secs > 60) warnings.push(`${label} runs ${secs.toFixed(1)}s (a Short is 45 to 60 s, brand.md).`);
      if (!d.chapter.hook)
        warnings.push(`${label}: chapter ${sh.chapter} has no "> Short hook:" line (a Short opens on its own hook).`);
      else if (!d.audio.hook && transcript.audio)
        warnings.push(`${label}: hook line not voiced yet (yarn voiceover ${slug} --hook ${sh.chapter}, voice agent).`);
      if (d.unstaged.length)
        warnings.push(
          `${label}: no \`vertical\` staging yet for scene ${d.unstaged.join(', ')} (the director adds it).`,
        );
      for (const {src, from} of soundFiles(d.spec)) {
        if (!existsSync(`src/videos/${slug}/${src}`))
          warnings.push(`${label} ${from}: src/videos/${slug}/${src} is missing (skipped in renders).`);
      }
    } catch (e) {
      errors.push(`${label}: ${(e as Error).message}`);
    }
  }

  warnings.forEach((w) => console.log(`  warn  ${w}`));
  errors.forEach((e) => console.log(`  ERROR ${e}`));
  if (errors.length) failed = true;
}

if (only && !VIDEOS[only]) {
  console.error(`No registered video "${only}".`);
  failed = true;
}
process.exit(failed ? 1 : 0);
