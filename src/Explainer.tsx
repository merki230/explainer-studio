import React, {useMemo} from 'react';
import {AbsoluteFill, Audio, Easing, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {AdCard} from './components/AdCard';
import {Attribution, ATTRIBUTION_FADE} from './components/Attribution';
import {Callout} from './components/Callout';
import {Captions} from './components/Captions';
import {Chip} from './components/Chip';
import {Counter} from './components/Counter';
import {SearchBar} from './components/SearchBar';
import {NameTag, TAG_FADE} from './components/NameTag';
import {Statement, STATEMENT_FADE} from './components/Statement';
import {TITLE_FADE, TITLE_HOLD, TitleBlock} from './components/TitleBlock';
import {SCENES} from './scenes';
import {clickOffFrame, type ClickOff} from './scenes/clickOff';
import {fonts} from './fonts';
import {FADE, FPS, theme, type Mood} from './theme';
import {findCue, resolveTimeline, type ResolvedOverlay, type ResolvedScene} from './timeline';
import type {Word} from './types';
import {VIDEOS} from './videos';

export type ExplainerProps = {videoId: string};

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

const FadeIn: React.FC<{children: React.ReactNode; enabled: boolean}> = ({children, enabled}) => {
  const frame = useCurrentFrame();
  const opacity = enabled
    ? interpolate(frame, [0, FADE], [0, 1], {extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)})
    : 1;
  return <AbsoluteFill style={{opacity}}>{children}</AbsoluteFill>;
};

/** Frames an overlay takes to fade out before its `until`. */
const OVERLAY_EXIT = 8;
const exitFrames = (o: ResolvedOverlay) =>
  o.type === 'statement'
    ? STATEMENT_FADE
    : o.type === 'attribution'
      ? ATTRIBUTION_FADE
      : o.type === 'tag'
        ? TAG_FADE
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

type SceneContext = {props: Record<string, unknown>; durationInFrames: number; offset: number; mood: Mood};

const Overlay: React.FC<{o: ResolvedOverlay; scene: SceneContext}> = ({o, scene}) => {
  const mood = scene.mood;
  switch (o.type) {
    case 'callout':
      return <Callout {...o} />;
    case 'search':
      return <SearchBar {...o} />;
    case 'ad':
      return <AdCard {...o} />;
    case 'counter':
      return <Counter {...o} />;
    case 'statement':
      return <Statement {...o} mood={mood} />;
    case 'attribution':
      return <Attribution {...o} mood={mood} />;
    case 'title':
      return <TitleBlock {...o} mood={mood} />;
    case 'tag':
      return <NameTag {...o} mood={mood} scene={scene} />;
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

export const Explainer: React.FC<ExplainerProps> = ({videoId}) => {
  const result = useMemo(() => safeTimelineFor(videoId), [videoId]);
  if (!result.timeline) return <ErrorCard videoId={videoId} message={result.error} />;
  return <ExplainerBody videoId={videoId} timeline={result.timeline} />;
};

const ExplainerBody: React.FC<{videoId: string; timeline: ReturnType<typeof timelineFor>}> = ({videoId, timeline}) => {
  const {spec: video, transcript} = getVideo(videoId);
  const last = timeline.scenes.length - 1;
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
  return (
    <AbsoluteFill style={{backgroundColor: theme.museum}}>
      {timeline.scenes.map((s, i) => {
        const Scene = SCENES[s.scene];
        if (!Scene) throw new Error(`Unknown scene "${s.scene}". Register it in src/scenes/index.ts.`);
        // Each scene overlaps the next by FADE frames so the next one can fade in on top.
        const duration = s.endFrame - s.startFrame + (i < last ? FADE : 0);
        return (
          <Sequence key={i} from={s.startFrame} durationInFrames={duration} name={`${i + 1}. ${s.scene}`}>
            <FadeIn enabled={i > 0}>
              <Scene durationInFrames={duration} startFrame={s.startFrame} {...s.props} />
              {s.overlays.map((o, k) => {
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
                          props: {...s.props, startFrame: s.startFrame},
                          durationInFrames: duration,
                          offset: o.startFrame - s.startFrame,
                          mood: moodOf(s),
                        }}
                      />
                    </FadeOut>
                  </Sequence>
                );
              })}
            </FadeIn>
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
      <Captions
        words={transcript.words}
        suppress={quiet}
        moods={timeline.scenes.map((s) => ({from: s.startFrame, mood: moodOf(s)}))}
      />
      {video.watermark ? <Watermark text={video.watermark} /> : null}
      {transcript.audio ? <Audio src={staticFile(transcript.audio)} /> : null}
    </AbsoluteFill>
  );
};
