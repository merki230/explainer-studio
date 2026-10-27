import React, {useMemo} from 'react';
import {AbsoluteFill, Audio, Easing, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {AdCard} from './components/AdCard';
import {Attribution, ATTRIBUTION_FADE} from './components/Attribution';
import {Callout} from './components/Callout';
import {CHART_FADE, ChartCard} from './components/ChartCard';
import {Captions} from './components/Captions';
import {Chip} from './components/Chip';
import {Counter} from './components/Counter';
import {SearchBar} from './components/SearchBar';
import {audioUrl} from './audioAssets';
import {MusicBed, Sfx} from './components/Sound';
import {DETAIL_FADE, DetailBox} from './components/DetailBox';
import {FULLSCREEN_FADE, FullScreen} from './components/FullScreen';
import {NameTag, TAG_FADE} from './components/NameTag';
import {NoteStaff} from './components/NoteStaff';
import {Statement, STATEMENT_FADE} from './components/Statement';
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
};
import {transitionInto, type Transition} from './scenes/transitions';
import {clickOffFrame, type ClickOff} from './scenes/clickOff';
import {fonts} from './fonts';
import {FADE, FPS, theme, type Mood} from './theme';
import {WHEEL_SCENES} from './three/real/wheelMotion';
import {findCue, resolveTimeline, type ResolvedOverlay, type ResolvedScene} from './timeline';
import type {Word} from './types';
import {VIDEOS} from './videos';

export type ExplainerProps = {
  videoId: string;
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

export const timelineFor = (videoId: string) => {
  const {spec, transcript} = getVideo(videoId);
  return resolveTimeline(spec, transcript.words, FPS);
};

/** Like timelineFor, but a broken video yields its error instead of throwing. */
export const safeTimelineFor = (
  videoId: string,
): {timeline: ReturnType<typeof timelineFor>; error?: undefined} | {timeline?: undefined; error: string} => {
  try {
    return {timeline: timelineFor(videoId)};
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
  o.type === 'statement'
    ? STATEMENT_FADE
    : o.type === 'attribution'
      ? ATTRIBUTION_FADE
      : o.type === 'tag' || o.type === 'detail' || o.type === 'screen' || o.type === 'chart'
        ? Math.max(TAG_FADE, DETAIL_FADE, FULLSCREEN_FADE, CHART_FADE)
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
 * seconds after the scene starts. Never later than the scene's cut, so it is gone before the
 * next scene fades in; never before the overlay has fully entered.
 */
export const overlayEnd = (o: ResolvedOverlay, s: ResolvedScene, words: Word[]): number | undefined => {
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
  return Math.max(o.startFrame + 12 + exitFrames(o), Math.min(end, s.endFrame));
};

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

type SceneContext = {props: Record<string, unknown>; durationInFrames: number; offset: number; mood: Mood; name: string};

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
    case 'detail':
      return <DetailBox {...o} mood={mood} scene={scene} />;
    case 'screen':
      return <FullScreen {...o} mood={mood} scene={scene} />;
    case 'staff':
      return <NoteStaff {...o} mood={mood} scene={scene} />;
    case 'chart':
      return <ChartCard {...o} mood={mood} />;
    case 'sfx':
      // sounds play outside the scene's layers (see SceneSounds), so a click can outlast the cut
      return null;
    default:
      return null;
  }
};

const Watermark: React.FC<{text: string}> = ({text}) => (
  <div
    style={{
      position: 'absolute',
      top: 300,
      left: 120,
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

/** Absolute start frame of a sound effect: its cue or `at`; a negative `at` counts back from the cut. */
const sfxStart = (o: ResolvedOverlay, s: ResolvedScene) =>
  o.type === 'sfx' && !o.cue && (o.at ?? 0) < 0
    ? Math.min(s.endFrame - 1, Math.max(s.startFrame, s.endFrame + Math.round((o.at ?? 0) * FPS)))
    : o.startFrame;

export const Explainer: React.FC<ExplainerProps> = ({videoId, musicAudition}) => {
  const result = useMemo(() => safeTimelineFor(videoId), [videoId]);
  if (!result.timeline) return <ErrorCard videoId={videoId} message={result.error} />;
  return <ExplainerBody videoId={videoId} timeline={result.timeline} musicAudition={musicAudition} />;
};

/** Where content starts (in) or ends (out) for a moving transition, as a fraction of the frame. */
const offsetFor = (t: Transition): [number, number] =>
  t.kind === 'slide'
    ? [0, 1]
    : t.direction === 'down'
      ? [0, 1]
      : t.direction === 'up'
        ? [0, -1]
        : t.direction === 'left'
          ? [-1, 0]
          : [1, 0];

/** The route crossing the seam of a 'follow' move: a short orange line at the edge it moves across. */
const SeamLine: React.FC<{t: Transition; edge: 'in' | 'out'; level: number}> = ({t, edge, level}) => {
  const [ox, oy] = offsetFor(t);
  const vertical = oy !== 0;
  // incoming: the line starts at the edge it comes in by; outgoing: at the edge it leaves by
  const atStart = edge === 'in' ? (vertical ? oy < 0 : ox < 0) : vertical ? oy > 0 : ox > 0;
  const len = 360;
  const style: React.CSSProperties = vertical
    ? {left: t.at * 1080 - 3, width: 6, height: len, top: atStart ? 1920 - len : 0}
    : {top: t.at * 1920 - 3, height: 6, width: len, left: atStart ? 1080 - len : 0};
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
    x += (1 - p) * ox * 1080;
    y += (1 - p) * oy * 1920;
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
    x -= q * ox * 1080;
    y -= q * oy * 1920;
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

/** Frames a scene mounts ahead of its start in the Studio preview. */
const PREMOUNT = Math.round(1.5 * FPS);

const ExplainerBody: React.FC<{
  videoId: string;
  timeline: ReturnType<typeof timelineFor>;
  musicAudition?: Record<string, boolean>;
}> = ({videoId, timeline, musicAudition}) => {
  const {spec: video, transcript} = getVideo(videoId);
  const last = timeline.scenes.length - 1;
  // `voice.src` overrides the voice file (same take, so the transcript timings still hold); a missing
  // file falls back to `transcript.audio`.
  const overrideUrl = video.voice?.src ? audioUrl(videoId, `audio/${video.voice.src}`) : null;
  const baseUrl = transcript.audio ? audioUrl(videoId, transcript.audio) : null;
  const voiceUrl = overrideUrl ?? baseUrl;
  if (video.voice?.src && !overrideUrl && baseUrl) {
    console.warn(`[sound] voice.src ${video.voice.src} missing: playing ${transcript.audio} instead.`);
  }
  // Captions are suppressed while a statement card is up (style guide § 5, § 7).
  const quiet = useMemo(
    () =>
      timeline.scenes.flatMap((s) =>
        s.overlays
          .filter((o) => o.type === 'statement')
          .map((o) => [o.startFrame, overlayEnd(o, s, transcript.words) ?? s.endFrame] as [number, number]),
      ),
    [timeline, transcript.words],
  );
  // Transitions (§ 8): how each scene comes in, and the props each scene gets (a scene that
  // continues the previous one starts its camera where the previous one ended).
  const plan = useMemo(() => {
    const into: (Transition | undefined)[] = timeline.scenes.map((s, i) =>
      i === 0 ? undefined : transitionInto(timeline.scenes[i - 1], s),
    );
    const props: Record<string, unknown>[] = [];
    timeline.scenes.forEach((s, i) => {
      const own = {...(s.props ?? {})};
      // a posted video's wheel pin (`VideoSpec.wheels`) reaches every wheel scene that doesn't set its own
      if (video.wheels && own.wheels === undefined && WHEEL_SCENES.includes(s.scene)) own.wheels = video.wheels;
      const t = into[i];
      const cam = CAMERAS[s.scene];
      if ((t?.kind === 'continue' || t?.kind === 'glide') && cam && timeline.scenes[i - 1].scene === s.scene) {
        const prev = timeline.scenes[i - 1];
        const end = cam.end({...props[i - 1], startFrame: prev.startFrame}, prev.endFrame - prev.startFrame, FPS);
        own.cameraFrom = end;
        // state a continuing scene carries on from the last one (car-slice 'ev': the wheels' turn and the road)
        if (s.scene === 'car-slice') Object.assign(own, carCarry({...props[i - 1], startFrame: prev.startFrame}, prev.endFrame - prev.startFrame, FPS));
        // race-slice: each car's place on the strip, its wheels' turn, the V8's crank and the race clock
        if (s.scene === 'race-slice') Object.assign(own, raceCarry({...props[i - 1], startFrame: prev.startFrame}, prev.endFrame - prev.startFrame, FPS));
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
  }, [timeline, video.wheels]);
  return (
    <AbsoluteFill style={{backgroundColor: theme.museum}}>
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
                if (o.type === 'sfx') return null;
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
      {video.captions === false ? null : (
        <Captions
          words={transcript.words}
          suppress={quiet}
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
      )}
      {video.watermark ? <Watermark text={video.watermark} /> : null}
      {voiceUrl ? <Audio src={voiceUrl} /> : null}
      {video.music ? (
        <MusicBed
          slug={videoId}
          music={video.music}
          words={transcript.words}
          durationInFrames={timeline.durationInFrames}
          fps={FPS}
          takes={musicAudition}
        />
      ) : null}
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
