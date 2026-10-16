import type {AdCardProps} from './components/AdCard';
import type {AttributionProps} from './components/Attribution';
import type {CalloutProps} from './components/Callout';
import type {CounterProps} from './components/Counter';
import type {DetailBoxProps} from './components/DetailBox';
import type {FullScreenProps} from './components/FullScreen';
import type {NameTagProps} from './components/NameTag';
import type {SearchBarProps} from './components/SearchBar';
import type {StatementProps} from './components/Statement';
import type {TitleBlockProps} from './components/TitleBlock';
import type {SceneName} from './scenes';

export type Word = {text: string; start: number; end: number};
export type Transcript = {audio: string | null; words: Word[]};

/**
 * When something starts. Prefer `cue` — the first words of the phrase it
 * should land on. Cues survive re-recording the voiceover; seconds don't.
 *  - scenes:   `cue` or absolute `start` (seconds)
 *  - overlays: `cue` or `at` (seconds after the scene starts)
 */
export type Timing = {cue?: string; at?: number};

/**
 * A sound effect (style guide § 9): plays `public/<slug>/sfx/<name>.mp3` from its `cue` or `at`.
 * A negative `at` counts back from the scene's cut (`at: -0.2` = 0.2 s before the scene ends; on the
 * last scene, before the video ends), so the lock click can sit at the very end. It plays to the end
 * of the file (past the scene's cut if needed) unless `until` stops it. A missing file is skipped with
 * a console warning.
 */
export type SfxOverlay = {
  type: 'sfx';
  /** File name without `.mp3`, in `public/<slug>/sfx/`. */
  name: string;
  /** dB relative to the voice (gain 1). Default 0 (the file's own level). The hum: -20. */
  volume?: number;
  /** Seconds cut from the start of the file. Default 0. */
  trim?: number;
  /** Loop the file (a hum under a long stretch); give it an `until`. Default false. */
  loop?: boolean;
  /** Seconds of linear fade in, and out before `until`. Default 0 (hard). */
  fade?: number;
};

/**
 * One quiet music bed per video (style guide § 9), from `public/<slug>/music.mp3` by default. It fades
 * in from `startAt`, ducks while words are spoken, loops if shorter than the video, and fades out to
 * silence on the last frame. A missing file is skipped with a console warning.
 */
export type MusicSpec = {
  /** `public/`-relative path. Default `<slug>/music.mp3`. */
  src?: string;
  /** Seconds into the video when the fade-in starts. Default 3 (after the hook). */
  startAt?: number;
  /** Seconds of fade-in. Default 2. */
  fadeIn?: number;
  /** Seconds of fade-out, ending silent on the last frame. Default 1.5. */
  fadeOut?: number;
  /** dB relative to the voice. Default -18 (the 16–20 dB window). */
  level?: number;
  /** Extra dB of dip while words are spoken (150 ms attack, 300 ms release). Default 4. */
  duckDb?: number;
  /** Seconds cut from the start of the file. Default 0. */
  trim?: number;
  /**
   * Audition mode, for comparing takes in the Studio: file names (no extension) in `public/<slug>/`,
   * e.g. `['music-a', 'music-b', 'music-c']`. Each plays as its own timeline track ("Music A", ...)
   * with the same curve (start, fades, level, ducking); `src` is not played. Each take gets an on/off
   * checkbox in the Studio props panel (`musicAudition`). Renders and stills play only the first
   * entry (with a console warning). Remove it once a take is chosen.
   */
  audition?: string[];
};

export type OverlaySpec = Timing & {
  /**
   * When the overlay leaves: a cue (it has faded out by the cue's first word) or seconds after the
   * scene starts. It fades out over 8 frames ending there, and always before the scene's cut (so the
   * next scene's start cue, or any time past the cut, means "gone just before the cut").
   * Omit to keep it until the scene ends (it then ghosts through the crossfade).
   * `statement` and `attribution` time themselves when `until` is omitted and they start on a `cue`
   * (style guide § 7): a statement holds until 0.8 s after its last word or the next word, whichever
   * comes first (1.2–3.0 s); an attribution holds to the end of the sentence (at least 2.0 s).
   * They fade out over 12 and 10 frames. `title` holds its `hold` (2.5 s) and `tag` 2.0 s, then fade
   * over 10 frames. Overlays take the scene's mood (v0.8 colours).
   */
  until?: string | number;
} & (
    | ({type: 'callout'} & CalloutProps)
    | ({type: 'search'} & SearchBarProps)
    | ({type: 'ad'} & AdCardProps)
    | ({type: 'counter'} & CounterProps)
    | ({type: 'statement'} & StatementProps)
    | ({type: 'attribution'} & AttributionProps)
    | ({type: 'title'} & TitleBlockProps)
    | ({type: 'tag'} & NameTagProps)
    | ({type: 'detail'} & DetailBoxProps)
    | ({type: 'screen'} & FullScreenProps)
    | SfxOverlay
  );

export type SceneSpec = {
  scene: SceneName;
  cue?: string;
  start?: number;
  /**
   * Exhibit label at the top of the frame: serif `title` plus a small mono `text` line.
   * `delay`: seconds into the scene before it enters (default 0; ≈ 1.0 on the first scene), or,
   * when the previous scene has a label, before its changed text swaps.
   * The label is one element across cuts: identical labels hold still; a changed line swaps
   * (old text out, new text in, over the 12-frame cut) while the card stays.
   */
  chip?: {text: string; title?: string; color?: string; delay?: number};
  /** Passed straight to the scene component. */
  props?: Record<string, unknown>;
  overlays?: OverlaySpec[];
};

export type VideoSpec = {
  /** Seconds of silence kept after the last word. */
  tail?: number;
  /** Small tag at the top-left of the safe zone. Set null to hide. */
  watermark?: string | null;
  /** Burned-in captions (default true). False only for test sandboxes that review bare frames. */
  captions?: boolean;
  /** Music bed (see MusicSpec). Omit for no music. */
  music?: MusicSpec;
  /**
   * Voice file override, for A/B-ing a processed voice: `src` is a file name in `public/<slug>/`
   * (e.g. `'voiceover-room.mp3'`) played instead of `transcript.audio`. Timings still come from
   * `transcript.json`, so it must be the same take. A missing file falls back to `transcript.audio`
   * with a console warning.
   */
  voice?: {src?: string};
  scenes: SceneSpec[];
};
