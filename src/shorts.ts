// Shorts cut from a long-form video's chapters (brand.md § Shorts cut from chapters, style guide § 11.8).
// Pure (no React, no browser APIs): the Root, Explainer and `yarn check` all use it.
//
// A Short is built from the long video's spec and transcript, never from a crop:
//   [ hook line (own voice file) ][ gap ][ the chapter's words from `from` to `until` (the long voice, trimmed) ]
// Its derived spec is a normal vertical VideoSpec over derived words, so cues, overlays, captions, ducking and
// the timeline all work unchanged. Scenes keep their cues; each plays with its `vertical` staging.
import {findCue, resolveTimeline} from './timeline';
import type {Chapter, HookVoice, SceneSpec, ShortSpec, Transcript, VideoSpec, Word} from './types';

export const SHORT_GAP = 0.35;
/** Seconds of the voice kept before the first word and after the last (breath), never into a neighbouring word. */
const PAD_IN = 0.08;
const PAD_OUT = 0.15;

export type ShortAudio = {
  /** The hook line's file (relative to the video folder), or null (estimated timings: silent). */
  hook: string | null;
  /** Frames the hook line's audio may run before the chapter's voice takes over. */
  hookFrames: number;
  /** The long video's voice file (relative to the video folder), or null. */
  voice: string | null;
  /** Frame of the long voice file where the Short's slice starts. */
  voiceFrom: number;
  /** Frame of the Short where that slice starts. */
  voiceAt: number;
  /** Length of the slice in frames. */
  voiceFrames: number;
};

export type DerivedShort = {
  short: ShortSpec;
  chapter: Chapter;
  /** A normal vertical video spec over `transcript`. */
  spec: VideoSpec;
  /** The hook words (from 0) followed by the chapter's words moved after them; `audio` is null (see `audio`). */
  transcript: Transcript;
  audio: ShortAudio;
  /** Index in `transcript.words` of the first chapter word. */
  firstChapterWord: number;
  /** The chapter's scenes (in the long spec, as `#<n> <scene>`) that carry no `vertical` staging yet. */
  unstaged: string[];
};

export const shortId = (slug: string, n: number) => `${slug}-short-${n}`;

/** Parse `<slug>-short-<n>` (or null). */
export const parseShortId = (id: string): {slug: string; n: number} | null => {
  const m = id.match(/^(.*)-short-(\d+)$/);
  return m ? {slug: m[1], n: Number(m[2])} : null;
};

const merge = (scene: SceneSpec): SceneSpec => {
  const {vertical, ...rest} = scene;
  return {
    ...rest,
    ...(vertical?.chip ? {chip: vertical.chip} : {}),
    props: vertical?.props ? {...scene.props, ...vertical.props} : scene.props,
    overlays: vertical?.overlays ?? scene.overlays,
  };
};

export const deriveShort = (video: {spec: VideoSpec; transcript: Transcript}, n: number, fps: number): DerivedShort => {
  const {spec, transcript} = video;
  const short = spec.shorts?.find((s) => s.chapter === n);
  if (!short) throw new Error(`The spec has no short for chapter ${n} (add {chapter: ${n}} to spec.shorts).`);
  const chapters = transcript.chapters ?? [];
  const chapter = chapters[n - 1];
  if (!chapter) {
    throw new Error(
      `Chapter ${n} is not in transcript.json (${chapters.length} chapters). Put "## question" lines in script.txt and run "yarn timings".`,
    );
  }
  const words = transcript.words;
  const chapterEnd = chapters[n]?.word ?? words.length;
  const first = short.from ? findCue(words, short.from, chapter.word) : chapter.word;
  const end = short.until ? findCue(words, short.until, first + 1) : chapterEnd;
  if (first < chapter.word || end > chapterEnd || end <= first) {
    throw new Error(`Short ${n}: "from"/"until" must lie inside chapter ${n} (words ${chapter.word} to ${chapterEnd - 1}).`);
  }
  const body = words.slice(first, end);
  const fromSec = body[0].start;
  const untilSec = body[body.length - 1].end;

  // the hook line: its own voice, from the `> Short hook:` line
  let hook: HookVoice | undefined;
  if (chapter.hook) {
    hook = transcript.hooks?.[String(n)];
    if (!hook) throw new Error(`Short ${n}: chapter ${n} has a hook line but transcript.json has no timings for it. Run "yarn timings <slug>".`);
  } else if (short.hookScene) {
    throw new Error(`Short ${n}: hookScene is set but chapter ${n} has no "> Short hook:" line in script.txt.`);
  }
  const hookWords: Word[] = hook?.words ?? [];
  const gap = short.gap ?? SHORT_GAP;
  const hookEnd = hookWords.length ? hookWords[hookWords.length - 1].end + gap : 0;
  const firstWordAt = hookWords.length ? hookEnd : 0.15;
  const shift = firstWordAt - fromSec;
  const derivedWords: Word[] = [
    ...hookWords,
    ...body.map((w) => ({...w, start: +(w.start + shift).toFixed(3), end: +(w.end + shift).toFixed(3)})),
  ];

  // scenes: those of the long video that run inside [fromSec, untilSec); the one running at `from` is clipped
  const long = resolveTimeline(spec, words, fps);
  const keep = long.scenes
    .map((s, i) => ({s, i}))
    // compared in frames: a scene ending a fraction of a frame past `from` would otherwise survive as a 1-frame clip
    .filter(({s}) => s.endFrame > Math.round(fromSec * fps) && s.startFrame < Math.round(untilSec * fps));
  if (!keep.length) throw new Error(`Short ${n}: no scene of the long video runs inside the chapter.`);
  const hookScene: SceneSpec | undefined = short.hookScene ? {...short.hookScene, start: 0} : undefined;
  const scenes: SceneSpec[] = keep.map(({i}, k) => {
    const orig = spec.scenes[i];
    const staged = merge(orig);
    if (k === 0) {
      // clipped at `from`: it starts at 0 under the hook line (or at the chapter's first word after a hook scene)
      const clipped = {...staged, start: hookScene ? firstWordAt : 0};
      delete clipped.cue;
      return clipped;
    }
    if (!orig.cue && typeof orig.start === 'number') return {...staged, start: orig.start + shift};
    return staged;
  });
  if (hookScene) scenes.unshift(hookScene);

  const music = short.music === undefined ? spec.music : (short.music ?? undefined);
  const derived: VideoSpec = {
    ...spec,
    format: 'vertical',
    shorts: undefined,
    cover: short.cover,
    tail: short.tail ?? 1.2,
    music,
    voice: undefined,
    scenes,
  };

  const prev = words[first - 1];
  const next = words[end];
  const padIn = Math.max(0, Math.min(PAD_IN, prev ? fromSec - prev.end : PAD_IN));
  const padOut = Math.max(0, Math.min(PAD_OUT, next ? next.start - untilSec : PAD_OUT));
  const voiceFrom = Math.round((fromSec - padIn) * fps);
  const audio: ShortAudio = {
    hook: hook?.audio ?? null,
    hookFrames: Math.round(firstWordAt * fps),
    voice: transcript.audio,
    voiceFrom,
    voiceAt: Math.round((firstWordAt - padIn) * fps),
    voiceFrames: Math.max(1, Math.round((untilSec + padOut) * fps) - voiceFrom),
  };
  return {
    short,
    chapter,
    spec: derived,
    transcript: {audio: null, words: derivedWords},
    audio,
    firstChapterWord: hookWords.length,
    unstaged: keep.filter(({i}) => !spec.scenes[i].vertical).map(({i}) => `#${i + 1} ${spec.scenes[i].scene}`),
  };
};

/** The Short's timeline (scene frames, duration). */
export const resolveShortTimeline = (d: DerivedShort, fps: number) =>
  resolveTimeline(d.spec, d.transcript.words, fps, {
    afterHook: d.firstChapterWord,
    firstScene: d.short.hookScene ? 0 : d.firstChapterWord,
  });
