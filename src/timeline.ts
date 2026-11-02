import {END_SCREEN_HOLD} from './theme';
import type {Chapter, OverlaySpec, SceneSpec, VideoSpec, Word} from './types';

const norm = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '');

/** Index of the first word where `cue` matches, searching from `from`. */
export const findCue = (words: Word[], cue: string, from = 0): number => {
  const tokens = cue.split(/\s+/).map(norm).filter(Boolean);
  const normed = words.map((w) => norm(w.text));
  for (let i = from; i <= normed.length - tokens.length; i++) {
    if (tokens.every((t, k) => normed[i + k] === t)) return i;
  }
  throw new Error(
    `Cue "${cue}" not found in the transcript (searched from word ${from}). ` +
      `Check the spelling against src/data/transcript.json.`,
  );
};

export type ResolvedOverlay = OverlaySpec & {startFrame: number};
export type ResolvedScene = Omit<SceneSpec, 'overlays'> & {
  startFrame: number;
  endFrame: number;
  overlays: ResolvedOverlay[];
};

/** Silence kept after the last word: `tail`, else 1.2 s (horizontal videos: the 12 s end-screen hold, style guide § 11.6). */
export const defaultTail = (video: VideoSpec) => video.tail ?? (video.format === 'horizontal' ? END_SCREEN_HOLD : 1.2);

export const totalSeconds = (video: VideoSpec, words: Word[]) =>
  words.length ? words[words.length - 1].end + defaultTail(video) : 5;

/**
 * Where scene cues start searching. A normal video leaves both 0. A Short (src/shorts.ts) puts its hook line's words
 * first: `afterHook` is the index of the first chapter word (cues of scene 1 on look there), `firstScene` where the
 * first scene's own overlay cues look (0 for a hook scene, `afterHook` for a chapter scene running under the hook).
 */
export type CueStart = {
  afterHook?: number;
  firstScene?: number;
  /**
   * The transcript's chapters. Given (a horizontal long-form video, not a Short), each chapter from 2 on gets a card
   * (`chapterCardFrames`) and its first scene starts at Q + 30, under the card.
   */
  chapters?: Chapter[];
};

/** Default hold of a chapter card in seconds, and its allowed range (style guide § 11.5.1). */
export const CARD_HOLD = 2.5;
export const CARD_HOLD_RANGE: [number, number] = [2.0, 3.0];

/**
 * One chapter card's frames (style guide § 11.5.1), all absolute and keyed to `q`, the frame where the previous
 * chapter's last word ends. The card is silent: the narrator resumes at `resume` (= q + CHAPTER_BREAK_FRAMES when the
 * voiceover has the full gap).
 */
export type ChapterCardFrames = {
  chapter: number;
  /** The card's text: the spec's `question` or the `##` heading (a `\n` is a manual line break). */
  question: string;
  /** Q. */
  q: number;
  /** Captions start a 6-frame fade-out (Q + 6); they stay off until `resume`. */
  captionsOut: number;
  /** Scrim and blur ramp 0 → full over 12 frames, `rampIn` → `rampIn + 12` (Q + 6 → Q + 18). */
  rampIn: number;
  /** Label rises in over 12 frames from here (Q + 9), the question from `questionIn` (Q + 12). */
  labelIn: number;
  questionIn: number;
  /** The card is fully in, the music step (Q + 24): a sound cue (`sound`) and the next music bed enter here. */
  musicStep: number;
  /** Hold in frames (75 by default), then label and question fade out over 12 frames from `outStart` (Q + 99). */
  hold: number;
  outStart: number;
  /** Scrim and blur ramp down over 15 frames from here (Q + 102). */
  clearStart: number;
  clearEnd: number;
  /** The chapter's first scene starts here (Q + 30), under the card. */
  sceneAt: number;
  /** The frame of the chapter's first word. */
  resume: number;
  sound?: string;
  /** dB relative to the voice for `sound` (default -19). */
  soundVolume?: number;
};

export const CARD_FRAMES = {
  captionsOut: 6,
  rampIn: 6,
  rampLen: 12,
  labelIn: 9,
  questionIn: 12,
  inLen: 12,
  musicStep: 24,
  outLen: 12,
  clearLag: 3,
  clearLen: 15,
  sceneAt: 30,
};

/**
 * The chapter cards of a horizontal video: chapters 2 and later whose spec doesn't say `show: false`. Empty for a
 * vertical video or without `chapters` (Shorts never pass them). Pure: the same words give the same frames.
 */
export const chapterCardFrames = (
  video: VideoSpec,
  words: Word[],
  fps: number,
  chapters?: Chapter[],
): ChapterCardFrames[] => {
  if (video.format !== 'horizontal' || !chapters) return [];
  return chapters.flatMap((ch, i) => {
    const n = i + 1;
    const spec = video.chapters?.find((c) => c.chapter === n);
    if (n < 2 || spec?.show === false || ch.word < 1 || !words[ch.word]) return [];
    const q = Math.round(words[ch.word - 1].end * fps);
    const hold = Math.round((spec?.hold ?? CARD_HOLD) * fps);
    const outStart = q + CARD_FRAMES.musicStep + hold;
    return [
      {
        chapter: n,
        question: spec?.question ?? ch.title,
        q,
        captionsOut: q + CARD_FRAMES.captionsOut,
        rampIn: q + CARD_FRAMES.rampIn,
        labelIn: q + CARD_FRAMES.labelIn,
        questionIn: q + CARD_FRAMES.questionIn,
        musicStep: q + CARD_FRAMES.musicStep,
        hold,
        outStart,
        clearStart: outStart + CARD_FRAMES.clearLag,
        clearEnd: outStart + CARD_FRAMES.clearLag + CARD_FRAMES.clearLen,
        sceneAt: q + CARD_FRAMES.sceneAt,
        resume: Math.round(words[ch.word].start * fps),
        sound: spec?.sound,
        soundVolume: spec?.soundVolume,
      },
    ];
  });
};

/** The word gap, in frames, at a chapter boundary (previous chapter's last word end to the first word's start). */
export const chapterGap = (words: Word[], ch: Chapter, fps: number) =>
  ch.word < 1 ? Infinity : Math.round(words[ch.word].start * fps) - Math.round(words[ch.word - 1].end * fps);

export const resolveTimeline = (video: VideoSpec, words: Word[], fps: number, from: CueStart = {}) => {
  const total = totalSeconds(video, words);
  let cursor = from.afterHook ?? 0;

  const cards = chapterCardFrames(video, words, fps, from.chapters);
  // a chapter's first scene (the one cued on the chapter's first word) starts under the card, at Q + 30
  const underCard = (wordIdx: number) => {
    const ch = from.chapters?.findIndex((c) => c.word === wordIdx);
    const card = ch === undefined ? undefined : cards.find((c) => c.chapter === ch + 1);
    return card ? card.sceneAt / fps : undefined;
  };

  const starts = video.scenes.map((s, i) => {
    if (i === 0) {
      if (s.cue) cursor = findCue(words, s.cue, 0);
      return {t: 0, wordIdx: s.cue ? cursor : (from.firstScene ?? cursor)};
    }
    if (s.cue) {
      cursor = findCue(words, s.cue, cursor);
      return {t: underCard(cursor) ?? words[cursor].start, wordIdx: cursor};
    }
    if (typeof s.start === 'number') return {t: s.start, wordIdx: cursor};
    throw new Error(`Scene ${i} ("${s.scene}") needs a "cue" or a "start".`);
  });

  const scenes: ResolvedScene[] = video.scenes.map((s, i) => {
    const start = starts[i].t;
    const end = i + 1 < starts.length ? starts[i + 1].t : total;
    const startFrame = Math.round(start * fps);
    const endFrame = Math.max(startFrame + 1, Math.round(end * fps));

    const overlays = (s.overlays ?? []).map((o) => {
      const t = o.cue ? words[findCue(words, o.cue, starts[i].wordIdx)].start : start + (o.at ?? 0);
      const f = Math.round(t * fps);
      return {...o, startFrame: Math.min(Math.max(f, startFrame), endFrame - 1)};
    });

    return {...s, startFrame, endFrame, overlays};
  });

  return {scenes, durationInFrames: Math.max(1, Math.round(total * fps)), chapterCards: cards};
};
