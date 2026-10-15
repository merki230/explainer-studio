import type {AdCardProps} from './components/AdCard';
import type {CalloutProps} from './components/Callout';
import type {CounterProps} from './components/Counter';
import type {SearchBarProps} from './components/SearchBar';
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

export type OverlaySpec = Timing &
  (
    | ({type: 'callout'} & CalloutProps)
    | ({type: 'search'} & SearchBarProps)
    | ({type: 'ad'} & AdCardProps)
    | ({type: 'counter'} & CounterProps)
  );

export type SceneSpec = {
  scene: SceneName;
  cue?: string;
  start?: number;
  /** Small monospace label at the top of the frame. */
  chip?: {text: string; color?: string};
  /** Passed straight to the scene component. */
  props?: Record<string, unknown>;
  overlays?: OverlaySpec[];
};

export type VideoSpec = {
  /** Seconds of silence kept after the last word. */
  tail?: number;
  /** Small tag in the top-right corner. Set null to hide. */
  watermark?: string | null;
  scenes: SceneSpec[];
};
