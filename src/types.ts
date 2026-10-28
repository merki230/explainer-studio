import type {AdCardProps} from './components/AdCard';
import type {AttributionProps} from './components/Attribution';
import type {CalloutProps} from './components/Callout';
import type {ChartCardProps} from './components/ChartCard';
import type {CounterProps} from './components/Counter';
import type {DetailBoxProps} from './components/DetailBox';
import type {FullScreenProps} from './components/FullScreen';
import type {NameTagProps} from './components/NameTag';
import type {NoteStaffProps} from './components/NoteStaff';
import type {PlaceLabelProps} from './components/PlaceLabel';
import type {SearchBarProps} from './components/SearchBar';
import type {StatementProps} from './components/Statement';
import type {TitleBlockProps} from './components/TitleBlock';
import type {SceneName} from './scenes';

export type Word = {text: string; start: number; end: number};
/** `audio` is relative to the video folder, e.g. `audio/voiceover.mp3` (null before there is a voice). */
export type Transcript = {audio: string | null; words: Word[]};

/**
 * When something starts. Prefer `cue` — the first words of the phrase it
 * should land on. Cues survive re-recording the voiceover; seconds don't.
 *  - scenes:   `cue` or absolute `start` (seconds)
 *  - overlays: `cue` or `at` (seconds after the scene starts)
 */
export type Timing = {cue?: string; at?: number};

/**
 * A sound effect (style guide § 9): plays `src/videos/<slug>/audio/sfx/<name>.mp3` from its `cue` or `at`.
 * A negative `at` counts back from the scene's cut (`at: -0.2` = 0.2 s before the scene ends; on the
 * last scene, before the video ends), so the lock click can sit at the very end. It plays to the end
 * of the file (past the scene's cut if needed) unless `until` stops it. A missing file is skipped with
 * a console warning.
 */
export type SfxOverlay = {
  type: 'sfx';
  /** File name without `.mp3`, in `audio/sfx/` of the video folder. */
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
 * One quiet music bed per video (style guide § 9), from `audio/music.mp3` in the video folder by default. It fades
 * in from `startAt`, ducks while words are spoken, loops if shorter than the video, and fades out to
 * silence on the last frame. A missing file is skipped with a console warning.
 */
export type MusicSpec = {
  /** Path relative to the video folder. Default `audio/music.mp3`. */
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
   * Audition mode, for comparing takes in the Studio: file names (no extension) in `audio/` of the video folder,
   * e.g. `['music-a', 'music-b', 'music-c']`. Each plays as its own timeline track ("Music A", ...)
   * with the same curve (start, fades, level, ducking); `src` is not played. Each take gets an on/off
   * checkbox in the Studio props panel (`musicAudition`). Renders and stills play only the first
   * entry (with a console warning). Remove it once a take is chosen.
   */
  audition?: string[];
  /**
   * Timed dips (video seconds), e.g. while the tires are on the grooves: the bed sits `db` lower
   * (dB down; the sign is ignored) from `from` to `to`, easing down over `fade` s before `from` and back
   * up over `fade` s after `to` (default 0.25, sine). Overlapping dips take the deepest. On top of the
   * fades and the ducking. Omit for none.
   */
  dips?: {from: number; to: number; db: number; fade?: number}[];
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
  /**
   * Carry the card across the cuts that follow (No. 010): it stays on screen as one element, still
   * running (a counter's clock doesn't restart, nothing blinks), through every next scene joined by
   * `continue`, `glide` or `cut`, until its `until` (a cue or seconds after *this* scene starts, which
   * may lie in a later scene). Without `until` it leaves before the first `slide`, `follow` or
   * `dissolve`, or at the video's end. For cards that don't point into the picture: `counter`,
   * `chart`, `place`, `statement`, `title`; anchored overlays (callout, tag, detail, ...) ignore it.
   */
  carry?: boolean;
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
    | ({type: 'staff'} & NoteStaffProps)
    | ({type: 'chart'} & ChartCardProps)
    | ({type: 'place'} & PlaceLabelProps)
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

/**
 * A purpose-made cover still (README "Covers"): one frozen frame of a scene, a hook line in the sky
 * band and, optionally, a magnified phone screen. No captions, title block or tags. Registered as its
 * own still composition `<slug>-cover` (1080 × 1920), outside the video's render flow.
 * Everything readable and the subject stay inside the safe rectangle (x 120–888, y 288–1248), which
 * also sits inside the 3:4 grid crop (y 240–1680).
 */
export type CoverSpec = {
  /**
   * The hook, statement look (Archivo 800, `ink`, `paper` halo), ≤ 2 lines, left-aligned at x 120.
   * A `\n` forces the line break; otherwise it breaks where the two lines are most even. The size
   * fits the widest line to `width` (capped at `size`).
   */
  text: string;
  /** Largest type size in px (default 150). */
  size?: number;
  /** Text block's top edge in px (default 288, the safe zone's top). */
  top?: number;
  /** Width the text may fill from x 120 (default 768: to x 888). */
  width?: number;
  /** The scene behind (default 'section-room'). */
  scene?: SceneName;
  /** The scene's props, as in a SceneSpec (mood, ui, gestures, route, trace, realism, ...). */
  props?: Record<string, unknown>;
  /**
   * The camera: one framing held still (look-at and distance at the fixed angle). Shorthand for
   * `props.camera: {from: camera}`; the idle drift is off on covers.
   */
  camera?: {look: [number, number, number]; distance: number};
  /** Seconds into the scene to freeze on (default 2): late enough for `at: -1` poses and screens to settle. */
  at?: number;
  /** A detail box on a phone (section-room only), drawn fully in. Same props as the overlay. */
  detail?: DetailBoxProps;
};

export type VideoSpec = {
  /** Test video (the `lab` sandbox): no "estimated timings" warning in `yarn check`; `yarn render` needs `--force`. */
  sandbox?: boolean;
  /** Cover still (see CoverSpec). Omit for none. */
  cover?: CoverSpec;
  /** Seconds of silence kept after the last word. */
  tail?: number;
  /** Small tag at the top-left of the safe zone. Set null to hide. */
  watermark?: string | null;
  /** Burned-in captions (default true). False only for test sandboxes that review bare frames. */
  captions?: boolean;
  /** Music bed (see MusicSpec). Omit for no music. */
  music?: MusicSpec;
  /**
   * Voice file override, for A/B-ing a processed voice: `src` is a file name in `audio/` of the video folder
   * (e.g. `'voiceover-room.mp3'`) played instead of `transcript.audio`. Timings still come from
   * `transcript.json`, so it must be the same take. A missing file falls back to `transcript.audio`
   * with a console warning.
   */
  voice?: {src?: string};
  /**
   * How every wheel in the video turns, for scenes that don't set their own `wheels` (`three/real/wheelMotion.ts`).
   * Omit it: new videos get 'forward' (rolling the right way, never strobing backward). 'legacy' exists only to
   * keep posted videos (No. 001–008) rendering exactly as published; never use it in a new video.
   */
  wheels?: 'legacy' | 'forward';
  scenes: SceneSpec[];
};
