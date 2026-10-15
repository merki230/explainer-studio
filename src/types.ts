import type {AdCardProps} from './components/AdCard';
import type {AttributionProps} from './components/Attribution';
import type {CalloutProps} from './components/Callout';
import type {CounterProps} from './components/Counter';
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
  scenes: SceneSpec[];
};
