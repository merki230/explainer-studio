import React, {useMemo} from 'react';
import {AbsoluteFill, Audio, Easing, interpolate, Sequence, useCurrentFrame, useVideoConfig} from 'remotion';
import {AdCard} from './components/AdCard';
import {Attribution, ATTRIBUTION_FADE} from './components/Attribution';
import {Callout} from './components/Callout';
import {CHART_FADE, ChartCard} from './components/ChartCard';
import {Captions} from './components/Captions';
import {CARD_BLUR, CARD_BLUR_SCALE, cardRamp, ChapterCard} from './components/ChapterCard';
import {ease} from './components/card';
import {FootageOpening} from './components/FootageOpening';
import {footageUrl} from './footageAssets';
import {Chip} from './components/Chip';
import {Counter} from './components/Counter';
import {SearchBar} from './components/SearchBar';
import {audioUrl} from './audioAssets';
import {MusicBed, Sfx} from './components/Sound';
import {DETAIL_FADE, DetailBox} from './components/DetailBox';
import {FULLSCREEN_FADE, FullScreen} from './components/FullScreen';
import {NameTag, TAG_FADE} from './components/NameTag';
import {PriceTag, PRICE_TAG_FADE} from './components/PriceTag';
import {NoteStaff} from './components/NoteStaff';
import {PLACE_FADE, PlaceLabel} from './components/PlaceLabel';
import {Statement, STATEMENT_FADE} from './components/Statement';
import {STICKER_FADE, StickerCard} from './components/StickerCard';
import {TITLE_FADE, TITLE_HOLD, TitleBlock} from './components/TitleBlock';
import {SCENES} from './scenes';
import {labCameraEnd, labCameraStart} from './scenes/SectionLabScene';
import {sectionCameraEnd, sectionCameraStart, TIME_PASSES} from './scenes/SectionRoomScene';
import {wheelCameraEnd, wheelCameraStart} from './scenes/WheelSliceScene';
import {carCameraEnd, carCameraStart, carCarry} from './scenes/CarSliceScene';
import {towerCameraEnd, towerCameraStart} from './scenes/TowerSliceScene';
import {hotelCameraEnd, hotelCameraStart} from './scenes/HotelLobbyScene';
import {streetCameraEnd, streetCameraStart} from './scenes/StreetSliceScene';
import {highwayCameraEnd, highwayCameraStart} from './scenes/HighwaySliceScene';
import {musicalCameraEnd, musicalCameraStart} from './scenes/MusicalRoadScene';
import {cityCameraEnd, cityCameraStart} from './scenes/CitySliceScene';
import {driveUnitCameraEnd, driveUnitCameraStart} from './scenes/DriveUnitScene';
import {raceCameraEnd, raceCameraStart, raceCarry} from './scenes/RaceSliceScene';
import {chargeCameraEnd, chargeCameraStart} from './scenes/ChargeSliceScene';
import {teardownCameraEnd, teardownCameraStart} from './scenes/TeardownSliceScene';
import {reportCameraEnd, reportCameraStart, reportCarry} from './scenes/ReportSliceScene';
import {dcCameraEnd, dcCameraStart, dcCarry} from './scenes/DatacenterSliceScene';
import {townCameraEnd, townCameraStart, townCarry} from './scenes/TownSliceScene';
import {cityTwinCameraEnd, cityTwinCameraStart, cityTwinCarry} from './scenes/CityTwinScene';
import {recordsCameraEnd, recordsCameraStart} from './scenes/RecordsSliceScene';
import {REVEALS} from './scenes/openingReveal';
import type {Framing} from './three/section/SectionCamera';

type CameraFn = (p: Record<string, unknown>, durationInFrames: number, fps: number) => Framing;
/** Scenes whose camera can continue or glide from the previous scene of the same kind. */
const CAMERAS: Record<string, {start: CameraFn; end: CameraFn}> = {
  'section-room': {start: sectionCameraStart as CameraFn, end: sectionCameraEnd as CameraFn},
  'section-lab': {start: labCameraStart as CameraFn, end: labCameraEnd as CameraFn},
  'wheel-slice': {start: wheelCameraStart as CameraFn, end: wheelCameraEnd as CameraFn},
  'car-slice': {start: carCameraStart as CameraFn, end: carCameraEnd as CameraFn},
  'tower-slice': {start: towerCameraStart as CameraFn, end: towerCameraEnd as CameraFn},
  'hotel-lobby': {start: hotelCameraStart as CameraFn, end: hotelCameraEnd as CameraFn},
  'street-slice': {start: streetCameraStart as CameraFn, end: streetCameraEnd as CameraFn},
  'highway-slice': {start: highwayCameraStart as CameraFn, end: highwayCameraEnd as CameraFn},
  'musical-road': {start: musicalCameraStart as CameraFn, end: musicalCameraEnd as CameraFn},
  'city-slice': {start: cityCameraStart as CameraFn, end: cityCameraEnd as CameraFn},
  'drive-unit': {start: driveUnitCameraStart as CameraFn, end: driveUnitCameraEnd as CameraFn},
  'race-slice': {start: raceCameraStart as CameraFn, end: raceCameraEnd as CameraFn},
  'charge-slice': {start: chargeCameraStart as CameraFn, end: chargeCameraEnd as CameraFn},
  'teardown-slice': {start: teardownCameraStart as CameraFn, end: teardownCameraEnd as CameraFn},
  'report-slice': {start: reportCameraStart as CameraFn, end: reportCameraEnd as CameraFn},
  'datacenter-slice': {start: dcCameraStart as CameraFn, end: dcCameraEnd as CameraFn},
  'town-slice': {start: townCameraStart as CameraFn, end: townCameraEnd as CameraFn},
  'city-twin': {start: cityTwinCameraStart as CameraFn, end: cityTwinCameraEnd as CameraFn},
  'records-slice': {start: recordsCameraStart as CameraFn, end: recordsCameraEnd as CameraFn},
};
import {transitionInto, type Transition} from './scenes/transitions';
import {clickOffFrame, type ClickOff} from './scenes/clickOff';
import {fonts} from './fonts';
import {useFormat} from './format';
import {deriveShort, resolveShortTimeline, type ShortAudio} from './shorts';
import {FADE, FPS, theme, type Mood} from './theme';
import {WHEEL_SCENES} from './three/real/wheelMotion';
import {findCue, resolveTimeline, type ChapterCardFrames, type ResolvedOverlay, type ResolvedScene} from './timeline';
import type {OpeningSpec, Word} from './types';
import {VIDEOS} from './videos';

/** Chapter-card sound cue level, dB re voice (style guide § 11.7: 18 to 20 dB under). */
const CARD_SOUND_DB = -19;

export type ExplainerProps = {
  videoId: string;
  /** A Short cut from chapter `short` of the (horizontal) video `videoId`: composition `<slug>-short-<n>` (src/shorts.ts). */
  short?: number;
  /**
   * Music audition only (`music.audition` in the spec): take name → on/off, shown as checkboxes in the
   * Studio props panel. Unticked takes are muted. Ignored by renders and stills (first take only).
   */
  musicAudition?: Record<string, boolean>;
};

const getVideo = (videoId: string) => {
  const entry = VIDEOS[videoId];
  if (!entry) throw new Error(`Unknown video "${videoId}". Register it in src/videos/index.ts.`);
  return entry;
};

/**
 * What a composition plays: the video itself, or (`short`) the vertical Short derived from one of its chapters
 * (derived spec and words, plus how its voice is assembled).
 */
const viewOf = (videoId: string, short?: number) => {
  const entry = getVideo(videoId);
  if (short === undefined)
    return {spec: entry.spec, transcript: entry.transcript, shortAudio: undefined as ShortAudio | undefined};
  const d = deriveShort(entry, short, FPS);
  return {spec: d.spec, transcript: d.transcript, shortAudio: d.audio};
};

export const timelineFor = (videoId: string, short?: number) => {
  if (short === undefined) {
    const {spec, transcript} = getVideo(videoId);
    return resolveTimeline(spec, transcript.words, FPS, {chapters: transcript.chapters});
  }
  return resolveShortTimeline(deriveShort(getVideo(videoId), short, FPS), FPS);
};

/** Like timelineFor, but a broken video yields its error instead of throwing. */
export const safeTimelineFor = (
  videoId: string,
  short?: number,
): {timeline: ReturnType<typeof timelineFor>; error?: undefined} | {timeline?: undefined; error: string} => {
  try {
    return {timeline: timelineFor(videoId, short)};
  } catch (e) {
    return {error: e instanceof Error ? e.message : String(e)};
  }
};

/** Duration of the error card composition for a broken video. */
export const ERROR_CARD_FRAMES = 5 * FPS;

const ErrorCard: React.FC<{videoId: string; message: string}> = ({videoId, message}) => (
  <AbsoluteFill
    style={{
      backgroundColor: '#fff',
      color: '#111',
      padding: 80,
      justifyContent: 'center',
      fontFamily: 'monospace',
    }}
  >
    <div style={{fontSize: 40, fontWeight: 700, color: '#b00020'}}>Video "{videoId}" is broken</div>
    <div style={{fontSize: 30, marginTop: 32, whiteSpace: 'pre-wrap'}}>{message}</div>
    <div style={{fontSize: 22, marginTop: 40, color: '#666'}}>Run `yarn check` for details.</div>
  </AbsoluteFill>
);

/** Frames an overlay takes to fade out before its `until`. */
const OVERLAY_EXIT = 8;
const exitFrames = (o: ResolvedOverlay) =>
  o.type === 'place'
    ? PLACE_FADE
    : o.type === 'statement'
      ? STATEMENT_FADE
      : o.type === 'attribution'
        ? ATTRIBUTION_FADE
        : o.type === 'pricetag'
          ? PRICE_TAG_FADE
          : o.type === 'tag' || o.type === 'detail' || o.type === 'screen' || o.type === 'chart' || o.type === 'sticker'
            ? Math.max(TAG_FADE, DETAIL_FADE, FULLSCREEN_FADE, CHART_FADE, STICKER_FADE)
            : o.type === 'title'
              ? TITLE_FADE
              : OVERLAY_EXIT;

/** A scene's mood (v0.8): its `mood` prop, else Day (the default, style guide § 4). */
const moodOf = (s: {props?: Record<string, unknown>}): Mood => (s.props?.mood === 'night' ? 'night' : 'day');

/**
 * Seconds at which a statement or attribution with no `until` leaves (style guide § 7), or
 * undefined for other overlays. Without a cue: 2.0 s after it starts.
 */
const autoEnd = (o: ResolvedOverlay, from: number, words: Word[]): number | undefined => {
  const start = o.startFrame / FPS;
  // the title block holds ≈ 2.5 s, then fades 10 frames; a name tag holds 2.0 s (≥ 1.5 s, § 6)
  if (o.type === 'title') return start + (o.hold ?? TITLE_HOLD) + TITLE_FADE / FPS;
  if (o.type === 'tag') return start + 2.0 + TAG_FADE / FPS;
  if (o.type !== 'statement' && o.type !== 'attribution') return undefined;
  if (!o.cue) return start + 2.0;
  const i = findCue(words, o.cue, from);
  if (o.type === 'statement') {
    const n = o.text.split(/\s+/).filter(Boolean).length;
    const last = Math.min(words.length - 1, i + n - 1);
    const next = words[last + 1];
    const end = Math.min(words[last].end + 0.8, next ? next.start : Infinity);
    return Math.max(start + 1.2, Math.min(start + 3.0, end));
  }
  let k = i;
  while (k < words.length - 1 && !/[.?!]$/.test(words[k].text)) k++;
  return Math.max(start + 2.0, words[k].end);
};

/**
 * Frame (absolute) by which an overlay with `until` has faded out: the cue's first word, or
 * seconds after the scene starts. Never later than the scene's cut (or `limit`, the end of the run
 * a carried card rides through), so it is gone before the next scene fades in; never before the
 * overlay has fully entered.
 */
export const overlayEnd = (
  o: ResolvedOverlay,
  s: ResolvedScene,
  words: Word[],
  limit: number = s.endFrame,
): number | undefined => {
  const from = Math.max(
    0,
    words.findIndex((w) => Math.round(w.start * FPS) >= s.startFrame),
  );
  let end: number;
  if (o.until === undefined) {
    const auto = autoEnd(o, from, words);
    if (auto === undefined) return undefined;
    end = Math.round(auto * FPS);
  } else if (typeof o.until === 'string') {
    end = Math.round(words[findCue(words, o.until, from)].start * FPS);
  } else {
    end = s.startFrame + Math.round(o.until * FPS);
  }
  return Math.max(o.startFrame + 12 + exitFrames(o), Math.min(end, limit));
};

/** Overlay types that may ride across cuts (`carry`): cards that don't point into the picture. */
const CARRY_TYPES = ['counter', 'chart', 'place', 'statement', 'title', 'sticker'];
/** Whether an overlay is carried across the cuts after its scene (an anchored place label isn't). */
const isCarried = (o: ResolvedOverlay) =>
  !!o.carry && CARRY_TYPES.includes(o.type) && !(o.type === 'place' && o.anchor);

const FadeOut: React.FC<{children: React.ReactNode; at?: number; frames?: number}> = ({
  children,
  at,
  frames = OVERLAY_EXIT,
}) => {
  const frame = useCurrentFrame();
  const opacity =
    at === undefined
      ? 1
      : interpolate(frame, [at - frames, at], [1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.inOut(Easing.cubic),
        });
  return <AbsoluteFill style={{opacity}}>{children}</AbsoluteFill>;
};

type SceneContext = {
  props: Record<string, unknown>;
  durationInFrames: number;
  offset: number;
  mood: Mood;
  name: string;
};

const Overlay: React.FC<{o: ResolvedOverlay; scene: SceneContext}> = ({o, scene}) => {
  const mood = scene.mood;
  switch (o.type) {
    case 'callout':
      return <Callout {...o} mood={mood} scene={scene} />;
    case 'search':
      return <SearchBar {...o} />;
    case 'ad':
      return <AdCard {...o} />;
    case 'counter':
      return <Counter {...o} mood={mood} />;
    case 'statement':
      return <Statement {...o} mood={mood} />;
    case 'attribution':
      return <Attribution {...o} mood={mood} />;
    case 'title':
      return <TitleBlock {...o} mood={mood} />;
    case 'tag':
      return <NameTag {...o} mood={mood} scene={scene} />;
    case 'pricetag':
      return <PriceTag {...o} mood={mood} scene={scene} />;
    case 'detail':
      return <DetailBox {...o} mood={mood} scene={scene} />;
    case 'screen':
      return <FullScreen {...o} mood={mood} scene={scene} />;
    case 'staff':
      return <NoteStaff {...o} mood={mood} scene={scene} />;
    case 'chart':
      return <ChartCard {...o} mood={mood} />;
    case 'place':
      return <PlaceLabel {...o} mood={mood} scene={scene} />;
    case 'sticker':
      return <StickerCard {...o} mood={mood} />;
    case 'sfx':
      // sounds play outside the scene's layers (see SceneSounds), so a click can outlast the cut
      return null;
    default:
      return null;
  }
};

const Watermark: React.FC<{text: string}> = ({text}) => {
  const {safe} = useFormat();
  return (
    <div
      style={{
        position: 'absolute',
        top: safe.top + 12,
        left: safe.left,
        fontFamily: fonts.mono,
        fontWeight: 600,
        fontSize: 20,
        letterSpacing: '0.14em',
        color: theme.inkLabel,
        opacity: 0.75,
      }}
    >
      {text}
    </div>
  );
};

/** Absolute start frame of a sound effect: its cue or `at`; a negative `at` counts back from the cut. */
const sfxStart = (o: ResolvedOverlay, s: ResolvedScene) =>
  o.type === 'sfx' && !o.cue && (o.at ?? 0) < 0
    ? Math.min(s.endFrame - 1, Math.max(s.startFrame, s.endFrame + Math.round((o.at ?? 0) * FPS)))
    : o.startFrame;

export const Explainer: React.FC<ExplainerProps> = ({videoId, short, musicAudition}) => {
  const result = useMemo(() => safeTimelineFor(videoId, short), [videoId, short]);
  const label = short === undefined ? videoId : `${videoId}-short-${short}`;
  if (!result.timeline) return <ErrorCard videoId={label} message={result.error} />;
  return <ExplainerBody videoId={videoId} short={short} timeline={result.timeline} musicAudition={musicAudition} />;
};

/** Where content starts (in) or ends (out) for a moving transition, as a fraction of the frame. */
const offsetFor = (t: Transition): [number, number] =>
  t.kind === 'slide'
    ? t.sideways
      ? [1, 0] // horizontal videos: the next sheet enters from the right (§ 11.6)
      : [0, 1]
    : t.direction === 'down'
      ? [0, 1]
      : t.direction === 'up'
        ? [0, -1]
        : t.direction === 'left'
          ? [-1, 0]
          : [1, 0];

/** The route crossing the seam of a 'follow' move: a short orange line at the edge it moves across. */
const SeamLine: React.FC<{t: Transition; edge: 'in' | 'out'; level: number}> = ({t, edge, level}) => {
  const {width: W, height: H} = useVideoConfig();
  const [ox, oy] = offsetFor(t);
  const vertical = oy !== 0;
  // incoming: the line starts at the edge it comes in by; outgoing: at the edge it leaves by
  const atStart = edge === 'in' ? (vertical ? oy < 0 : ox < 0) : vertical ? oy > 0 : ox > 0;
  const len = 360;
  const style: React.CSSProperties = vertical
    ? {left: t.at * W - 3, width: 6, height: len, top: atStart ? H - len : 0}
    : {top: t.at * H - 3, height: 6, width: len, left: atStart ? W - len : 0};
  return (
    <div
      style={{
        position: 'absolute',
        ...style,
        background: theme.orange,
        boxShadow: `0 0 18px ${theme.orange}`,
        opacity: level,
      }}
    />
  );
};

/** Moves a scene in or out with its transition (slide, follow), or fades it in (dissolve). */
const Transitioned: React.FC<{
  children: React.ReactNode;
  into?: Transition;
  out?: Transition;
  span: number;
}> = ({children, into, out, span}) => {
  const frame = useCurrentFrame();
  const {width: W, height: H} = useVideoConfig();
  const sine = Easing.inOut(Easing.sin);
  const cubic = Easing.inOut(Easing.cubic);
  let x = 0;
  let y = 0;
  let opacity = 1;
  let seamIn = 0;
  let seamOut = 0;
  if (into && (into.kind === 'slide' || into.kind === 'follow')) {
    const p = interpolate(frame, [0, into.frames], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: into.kind === 'follow' ? sine : cubic,
    });
    const [ox, oy] = offsetFor(into);
    x += (1 - p) * ox * W;
    y += (1 - p) * oy * H;
    if (into.kind === 'follow')
      seamIn =
        1 -
        interpolate(frame, [into.frames, into.frames + 8], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
  }
  if (into?.kind === 'dissolve') {
    opacity = interpolate(frame, [0, into.frames], [0, 1], {extrapolateRight: 'clamp', easing: cubic});
  }
  if (out && (out.kind === 'slide' || out.kind === 'follow')) {
    const q = interpolate(frame, [span, span + out.frames], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: out.kind === 'follow' ? sine : cubic,
    });
    const [ox, oy] = offsetFor(out);
    x -= q * ox * W;
    y -= q * oy * H;
    if (out.kind === 'follow')
      seamOut = interpolate(frame, [span - 8, span], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  }
  return (
    <AbsoluteFill style={{opacity, transform: x || y ? `translate(${x}px, ${y}px)` : undefined}}>
      {children}
      {into?.kind === 'follow' && seamIn > 0 ? <SeamLine t={into} edge="in" level={seamIn} /> : null}
      {out?.kind === 'follow' && seamOut > 0 ? <SeamLine t={out} edge="out" level={seamOut} /> : null}
    </AbsoluteFill>
  );
};

/**
 * Gate for the captions at a chapter card (§ 11.5.1): the page on screen fades out over 6 frames from Q + 6, and no
 * caption shows until the chapter's first word (`off` = [Q + 6, first word) per card).
 */
const CaptionGate: React.FC<{off: [number, number][]; children: React.ReactNode}> = ({off, children}) => {
  const frame = useCurrentFrame();
  const gone = off.find(([a, b]) => frame >= a && frame < b);
  if (!gone) return <>{children}</>;
  if (frame >= gone[0] + CAPTIONS_OUT) return null;
  return <AbsoluteFill style={{opacity: 1 - ease(frame, gone[0], gone[0] + CAPTIONS_OUT)}}>{children}</AbsoluteFill>;
};
const CAPTIONS_OUT = 6;

/**
 * The scene layer: every scene, carried card and exhibit label. With chapter cards (§ 11.5.1) it is blurred (CSS
 * `filter: blur()` on this layer only; the scrim and the card are drawn above it, outside), in step with the card's
 * ramp. Without cards it adds nothing, so vertical videos and Shorts render exactly as before.
 */
const SceneLayer: React.FC<{cards: ChapterCardFrames[]; children: React.ReactNode}> = ({cards, children}) => {
  const frame = useCurrentFrame();
  if (!cards.length) return <>{children}</>;
  const ramp = Math.max(...cards.map((c) => cardRamp(frame, c)));
  // The blur fades the layer's own edges into the background; a slight scale (≤ 4%, with the ramp) keeps them off screen.
  return (
    <AbsoluteFill
      style={
        ramp > 0
          ? {filter: `blur(${CARD_BLUR * ramp}px)`, transform: `scale(${1 + CARD_BLUR_SCALE * ramp})`}
          : undefined
      }
    >
      {children}
    </AbsoluteFill>
  );
};

/** Frames a scene mounts ahead of its start in the Studio preview. */
const PREMOUNT = Math.round(1.5 * FPS);

/** A Short's voice: its hook line from frame 0, then the long video's voice from `voiceFrom`, placed at `voiceAt`. */
const ShortVoice: React.FC<{videoId: string; audio: ShortAudio}> = ({videoId, audio}) => {
  const hookUrl = audio.hook ? audioUrl(videoId, audio.hook) : null;
  const voiceUrl = audio.voice ? audioUrl(videoId, audio.voice) : null;
  return (
    <>
      {hookUrl ? (
        <Sequence durationInFrames={Math.max(1, audio.voiceAt)} name="hook voice">
          <Audio src={hookUrl} />
        </Sequence>
      ) : null}
      {voiceUrl ? (
        <Sequence from={audio.voiceAt} durationInFrames={audio.voiceFrames} name="chapter voice">
          <Audio src={voiceUrl} trimBefore={audio.voiceFrom} />
        </Sequence>
      ) : null}
    </>
  );
};

const RealOpening: React.FC<{slug: string; opening: OpeningSpec}> = ({slug, opening}) => {
  const reveal = REVEALS[slug];
  const url = footageUrl(slug, opening.footage);
  if (!url) return null;
  return (
    <Sequence
      durationInFrames={Math.max(1, Math.min(Math.round(opening.until * FPS), 4 * FPS))}
      name="real opening"
    >
      <FootageOpening src={url} masks={opening.masks} reveal={reveal} />
    </Sequence>
  );
};

const ExplainerBody: React.FC<{
  videoId: string;
  short?: number;
  timeline: ReturnType<typeof timelineFor>;
  musicAudition?: Record<string, boolean>;
}> = ({videoId, short, timeline, musicAudition}) => {
  const {spec: video, transcript, shortAudio} = viewOf(videoId, short);
  const {format} = useFormat();
  const last = timeline.scenes.length - 1;
  // `voice.src` overrides the voice file (same take, so the transcript timings still hold); a missing
  // file falls back to `transcript.audio`.
  // a Short has no `transcript.audio` of its own: its hook line and a slice of the long voice are placed below
  const overrideUrl = video.voice?.src ? audioUrl(videoId, `audio/${video.voice.src}`) : null;
  const baseUrl = transcript.audio ? audioUrl(videoId, transcript.audio) : null;
  const voiceUrl = overrideUrl ?? baseUrl;
  if (video.voice?.src && !overrideUrl && baseUrl) {
    console.warn(`[sound] voice.src ${video.voice.src} missing: playing ${transcript.audio} instead.`);
  }
  // Transitions (§ 8): how each scene comes in, and the props each scene gets (a scene that
  // continues the previous one starts its camera where the previous one ended).
  const plan = useMemo(() => {
    const into: (Transition | undefined)[] = timeline.scenes.map((s, i) =>
      i === 0 ? undefined : transitionInto(timeline.scenes[i - 1], s, format),
    );
    const props: Record<string, unknown>[] = [];
    timeline.scenes.forEach((s, i) => {
      const own = {...(s.props ?? {})};
      // the wide frame: scenes frame, project and place their anchors for 1920 × 1080 (vertical props stay as given)
      if (format === 'horizontal' && own.format === undefined) own.format = format;
      // a posted video's wheel pin (`VideoSpec.wheels`) reaches every wheel scene that doesn't set its own
      if (video.wheels && own.wheels === undefined && WHEEL_SCENES.includes(s.scene)) own.wheels = video.wheels;
      // the real opening's reveal (§ 11.6.1): the first scene's camera rides the clip's track and glides out of it
      if (i === 0 && video.opening && short === undefined && format === 'horizontal' && REVEALS[videoId] && own.reveal === undefined)
        own.reveal = REVEALS[videoId];
      const t = into[i];
      const cam = CAMERAS[s.scene];
      if ((t?.kind === 'continue' || t?.kind === 'glide') && cam && timeline.scenes[i - 1].scene === s.scene) {
        const prev = timeline.scenes[i - 1];
        const end = cam.end({...props[i - 1], startFrame: prev.startFrame}, prev.endFrame - prev.startFrame, FPS);
        own.cameraFrom = end;
        // state a continuing scene carries on from the last one (car-slice 'ev': the wheels' turn and the road)
        if (s.scene === 'car-slice')
          Object.assign(
            own,
            carCarry({...props[i - 1], startFrame: prev.startFrame}, prev.endFrame - prev.startFrame, FPS),
          );
        // race-slice: each car's place on the strip, its wheels' turn, the V8's crank and the race clock
        if (s.scene === 'race-slice')
          Object.assign(
            own,
            raceCarry({...props[i - 1], startFrame: prev.startFrame}, prev.endFrame - prev.startFrame, FPS),
          );
        // report-slice: the second car's wheel turn (the road runs on)
        if (s.scene === 'report-slice')
          Object.assign(
            own,
            reportCarry({...props[i - 1], startFrame: prev.startFrame}, prev.endFrame - prev.startFrame, FPS),
          );
        // datacenter-slice: every fan's, meter's and disc's turn so far (nothing jumps at the cut)
        if (s.scene === 'datacenter-slice')
          Object.assign(own, dcCarry({...props[i - 1], startFrame: prev.startFrame}, prev.endFrame - prev.startFrame, FPS));
        // town-slice: the DC instance's fans and meter
        if (s.scene === 'town-slice')
          Object.assign(own, townCarry({...props[i - 1], startFrame: prev.startFrame}, prev.endFrame - prev.startFrame, FPS));
        // city-twin (No. 014): each twin's road, wheel turn and crank
        if (s.scene === 'city-twin')
          Object.assign(own, cityTwinCarry({...props[i - 1], startFrame: prev.startFrame}, prev.endFrame - prev.startFrame, FPS));
        // 'auto' turns a continue into a glide when this scene's framing is too far from where the
        // last one ended to continue smoothly (a preset with the same look-at keeps pushing instead)
        const start = cam.start(own, s.endFrame - s.startFrame, FPS);
        const sameLookPreset =
          typeof own.camera !== 'object' && start.look.every((v, k) => Math.abs(v - end.look[k]) < 1e-6);
        const gap = Math.hypot(...start.look.map((v, k) => v - end.look[k])) + Math.abs(start.distance - end.distance);
        const asked = own.transition ?? 'auto';
        const glide = t.kind === 'glide' || (asked === 'auto' && !sameLookPreset && gap > 0.05);
        if (glide) {
          into[i] = {...t, kind: 'glide'};
          own.cameraGlide = (own.glide as number | undefined) ?? 0.8;
        }
      }
      props.push(own);
    });
    return {into, props};
  }, [timeline, video.wheels, video.opening, short, videoId, format]);
  // Carried cards (`carry`): each scene's run of following scenes joined by continue, glide or cut
  // ends at this frame (a slide, follow or dissolve, or the video's end, stops it).
  const carryLimit = useMemo(
    () =>
      timeline.scenes.map((_, i) => {
        let j = i;
        while (j < last && ['continue', 'glide', 'cut'].includes(plan.into[j + 1]?.kind ?? '')) j++;
        return {frame: timeline.scenes[j].endFrame, toEnd: j === last};
      }),
    [timeline, plan, last],
  );
  // Captions are suppressed while a statement card is up (style guide § 5, § 7).
  const quiet = useMemo(
    () =>
      timeline.scenes.flatMap((s, i) =>
        s.overlays
          .filter((o) => o.type === 'statement')
          .map((o) => {
            const limit = isCarried(o) ? carryLimit[i].frame : s.endFrame;
            return [o.startFrame, overlayEnd(o, s, transcript.words, limit) ?? limit] as [number, number];
          }),
      ),
    [timeline, transcript.words, carryLimit],
  );
  // The wide frame: captions pull in to x 1040 while a full-frame screen is up (§ 11.5).
  const narrow = useMemo(
    () =>
      format !== 'horizontal'
        ? []
        : timeline.scenes.flatMap((s) =>
            s.overlays
              .filter((o) => o.type === 'screen')
              .map((o) => [o.startFrame, overlayEnd(o, s, transcript.words) ?? s.endFrame] as [number, number]),
          ),
    [format, timeline, transcript.words],
  );
  // Chapter cards (§ 11.5.1): horizontal long-form videos only (the timeline resolves none for a Short or a vertical video).
  const chapterCards = timeline.chapterCards;
  // Captions are off from each card's Q + 6 (6-frame fade-out) until the chapter's first word.
  const captionsOff = useMemo(
    () => chapterCards.map((c) => [c.captionsOut, c.resume] as [number, number]),
    [chapterCards],
  );
  // The real opening (§ 11.6.1) sits above the scenes, but the title block must be up from F0: on a long video with an
  // opening, title overlays render in their own layer above the footage (and under the captions).
  const openingOn = !!video.opening && short === undefined && format === 'horizontal';
  const onTop = (o: ResolvedOverlay) => openingOn && o.type === 'title';
  /** The carried cards (`top`: only the titles that sit above the opening; else every other carried card). */
  const carriedCards = (top: boolean) =>
    timeline.scenes.flatMap((s, i) =>
          s.overlays.map((o, k) => {
            if (o.type === 'sfx' || onTop(o) !== top) return null;
            if (!isCarried(o) && !(top && onTop(o))) return null;
            // a title above the opening that isn't carried ends with its own scene, as it would inside it
            const lim = isCarried(o) ? carryLimit[i] : {frame: s.endFrame, toEnd: i === last};
            const end =
              o.until === undefined && lim.toEnd && overlayEnd(o, s, transcript.words, lim.frame) === undefined
                ? undefined
                : (overlayEnd(o, s, transcript.words, lim.frame) ?? lim.frame);
            return (
              <Sequence
                key={`carry-${i}-${k}`}
                from={o.startFrame}
                durationInFrames={end === undefined ? undefined : end - o.startFrame}
                name={`${o.type} (carried)`}
              >
                <FadeOut at={end === undefined ? undefined : end - o.startFrame} frames={exitFrames(o)}>
                  <Overlay
                    o={o}
                    scene={{
                      props: {...plan.props[i], startFrame: s.startFrame},
                      durationInFrames: s.endFrame - s.startFrame,
                      offset: o.startFrame - s.startFrame,
                      mood: moodOf(s),
                      name: s.scene,
                    }}
                  />
                </FadeOut>
              </Sequence>
            );
          }),
        );
  return (
    <AbsoluteFill style={{backgroundColor: theme.museum}}>
      <SceneLayer cards={chapterCards}>
        {timeline.scenes.map((s, i) => {
          const Scene = SCENES[s.scene];
          if (!Scene) throw new Error(`Unknown scene "${s.scene}". Register it in src/scenes/index.ts.`);
          // Each scene overlaps the next for the length of the next one's transition (0 for a continue or a cut).
          const span = s.endFrame - s.startFrame;
          const out = plan.into[i + 1];
          const duration = span + (i < last && out ? out.frames : 0);
          const props = plan.props[i];
          return (
            // premountFor: in the Studio (ignored when rendering) each scene mounts, hidden, 1.5 s before
            // it starts, so its WebGL canvas, shaders, environment and textures are ready when it
            // shows (no freeze at the cut)
            <Sequence
              key={i}
              from={s.startFrame}
              durationInFrames={duration}
              name={`${i + 1}. ${s.scene}`}
              premountFor={PREMOUNT}
            >
              <Transitioned into={plan.into[i]} out={out} span={span}>
                <Scene durationInFrames={duration} startFrame={s.startFrame} {...props} />
                {s.overlays.map((o, k) => {
                  if (o.type === 'sfx' || isCarried(o) || onTop(o)) return null;
                  const end = overlayEnd(o, s, transcript.words);
                  return (
                    <Sequence
                      key={k}
                      from={o.startFrame - s.startFrame}
                      durationInFrames={end === undefined ? undefined : end - o.startFrame}
                      name={o.type}
                    >
                      <FadeOut at={end === undefined ? undefined : end - o.startFrame} frames={exitFrames(o)}>
                        <Overlay
                          o={o}
                          scene={{
                            props: {...props, startFrame: s.startFrame},
                            durationInFrames: duration,
                            offset: o.startFrame - s.startFrame,
                            mood: moodOf(s),
                            name: s.scene,
                          }}
                        />
                      </FadeOut>
                    </Sequence>
                  );
                })}
              </Transitioned>
            </Sequence>
          );
        })}
        {/*
        Carried cards (`carry`) sit outside the scenes: one element from their start to their end,
        across the continue, glide and cut joins between, so a counter keeps running and never blinks.
      */}
        {carriedCards(false)}
        {/*
        The exhibit label sits outside the scene crossfades, so it is one continuous element:
        an identical label holds still across a cut, a changed one swaps only its changed text,
        and it fades with the cut only into a scene that has no label.
      */}
        {timeline.scenes.map((s, i) => {
          if (!s.chip) return null;
          const prev = timeline.scenes[i - 1]?.chip;
          const next = timeline.scenes[i + 1];
          const span = s.endFrame - s.startFrame;
          const fadesOut = !!next && !next.chip;
          // A scene with `clickOff` (the loop point) takes the label with it: it fades over the same
          // 2 frames as the orange, so the held frames match the video's first frame (no label yet).
          const sceneDuration = span + (next ? FADE : 0);
          const offAt = clickOffFrame(s.props?.clickOff as ClickOff | undefined, sceneDuration, FPS);
          return (
            <Sequence
              key={`label-${i}`}
              from={s.startFrame}
              durationInFrames={span + (fadesOut ? FADE : 0)}
              name={`label ${i + 1}`}
            >
              <Chip
                {...s.chip}
                previous={prev}
                exitAt={offAt ?? (fadesOut ? span : undefined)}
                exitFrames={offAt === undefined ? FADE : 2}
              />
            </Sequence>
          );
        })}
      </SceneLayer>
      {/* Real opening (§ 11.6.1): long-form only, first shot only. It sits above the scenes; the title block above it. */}
      {video.opening && short === undefined && format === 'horizontal' ? (
        <RealOpening slug={videoId} opening={video.opening} />
      ) : null}
      {openingOn ? carriedCards(true) : null}
      {chapterCards.map((c) => {
        const at = [...timeline.scenes].reverse().find((s) => s.startFrame <= c.sceneAt) ?? timeline.scenes[0];
        return <ChapterCard key={`chapter-${c.chapter}`} card={c} mood={moodOf(at)} />;
      })}
      {video.captions === false ? null : (
        <CaptionGate off={captionsOff}>
          <Captions
            words={transcript.words}
            suppress={quiet}
            narrow={narrow}
            moods={timeline.scenes.flatMap((s) => {
              const from = s.props?.moodFrom as Mood | undefined;
              if (!from || from === moodOf(s)) return [{from: s.startFrame, mood: moodOf(s)}];
              // the time-passes blend: captions change colours at its midpoint
              const at = (s.props?.moodAt as number | undefined) ?? 0.3;
              return [
                {from: s.startFrame, mood: from},
                {from: s.startFrame + Math.round((at + TIME_PASSES / 2) * FPS), mood: moodOf(s)},
              ];
            })}
          />
        </CaptionGate>
      )}
      {video.watermark ? <Watermark text={video.watermark} /> : null}
      {voiceUrl ? <Audio src={voiceUrl} /> : null}
      {shortAudio ? <ShortVoice videoId={videoId} audio={shortAudio} /> : null}
      {video.music ? (
        <MusicBed
          slug={videoId}
          music={video.music}
          words={transcript.words}
          durationInFrames={timeline.durationInFrames}
          fps={FPS}
          takes={musicAudition}
          cards={chapterCards}
        />
      ) : null}
      {chapterCards.map((c) =>
        c.sound ? (
          <Sfx
            key={`card-sound-${c.chapter}`}
            slug={videoId}
            o={{type: 'sfx', name: c.sound, volume: c.soundVolume ?? CARD_SOUND_DB}}
            from={c.musicStep}
            fps={FPS}
          />
        ) : null,
      )}
      {timeline.scenes.flatMap((s, i) =>
        s.overlays.map((o, k) => {
          if (o.type !== 'sfx') return null;
          const from = sfxStart(o, s);
          const end = o.until === undefined ? undefined : overlayEnd(o, s, transcript.words);
          const length = end === undefined ? timeline.durationInFrames - from : Math.max(1, end - from);
          return <Sfx key={`sfx-${i}-${k}`} slug={videoId} o={o} from={from} length={length} fps={FPS} />;
        }),
      )}
    </AbsoluteFill>
  );
};
