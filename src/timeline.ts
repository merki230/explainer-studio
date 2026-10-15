import type {OverlaySpec, SceneSpec, VideoSpec, Word} from './types';

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

export const totalSeconds = (video: VideoSpec, words: Word[]) =>
  words.length ? words[words.length - 1].end + (video.tail ?? 1.2) : 5;

export const resolveTimeline = (video: VideoSpec, words: Word[], fps: number) => {
  const total = totalSeconds(video, words);
  let cursor = 0;

  const starts = video.scenes.map((s, i) => {
    if (i === 0) {
      if (s.cue) cursor = findCue(words, s.cue, 0);
      return {t: 0, wordIdx: cursor};
    }
    if (s.cue) {
      cursor = findCue(words, s.cue, cursor);
      return {t: words[cursor].start, wordIdx: cursor};
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

  return {scenes, durationInFrames: Math.max(1, Math.round(total * fps))};
};
