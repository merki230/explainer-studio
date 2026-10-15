import React, {useMemo} from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {AdCard} from './components/AdCard';
import {Callout} from './components/Callout';
import {Captions} from './components/Captions';
import {Chip} from './components/Chip';
import {Counter} from './components/Counter';
import {SearchBar} from './components/SearchBar';
import {SCENES} from './scenes';
import {fonts} from './fonts';
import {FADE, FPS, theme} from './theme';
import {resolveTimeline, type ResolvedOverlay} from './timeline';
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

const FadeIn: React.FC<{children: React.ReactNode; enabled: boolean}> = ({children, enabled}) => {
  const frame = useCurrentFrame();
  const opacity = enabled ? interpolate(frame, [0, FADE], [0, 1], {extrapolateRight: 'clamp'}) : 1;
  return <AbsoluteFill style={{opacity}}>{children}</AbsoluteFill>;
};

const Overlay: React.FC<{o: ResolvedOverlay}> = ({o}) => {
  switch (o.type) {
    case 'callout':
      return <Callout {...o} />;
    case 'search':
      return <SearchBar {...o} />;
    case 'ad':
      return <AdCard {...o} />;
    case 'counter':
      return <Counter {...o} />;
    default:
      return null;
  }
};

const Watermark: React.FC<{text: string}> = ({text}) => (
  <div
    style={{
      position: 'absolute',
      top: 70,
      right: 60,
      fontFamily: fonts.mono,
      fontSize: 18,
      letterSpacing: '0.3em',
      color: theme.muted,
      opacity: 0.6,
    }}
  >
    {text}
  </div>
);

export const Explainer: React.FC<ExplainerProps> = ({videoId}) => {
  const {spec: video, transcript} = getVideo(videoId);
  const timeline = useMemo(() => timelineFor(videoId), [videoId]);
  const last = timeline.scenes.length - 1;
  return (
    <AbsoluteFill style={{backgroundColor: theme.bg}}>
      {timeline.scenes.map((s, i) => {
        const Scene = SCENES[s.scene];
        if (!Scene) throw new Error(`Unknown scene "${s.scene}". Register it in src/scenes/index.ts.`);
        // Each scene overlaps the next by FADE frames so the next one can fade in on top.
        const duration = s.endFrame - s.startFrame + (i < last ? FADE : 0);
        return (
          <Sequence key={i} from={s.startFrame} durationInFrames={duration} name={`${i + 1}. ${s.scene}`}>
            <FadeIn enabled={i > 0}>
              <Scene durationInFrames={duration} {...s.props} />
              {s.chip ? <Chip text={s.chip.text} color={s.chip.color} /> : null}
              {s.overlays.map((o, k) => (
                <Sequence key={k} from={o.startFrame - s.startFrame} name={o.type}>
                  <Overlay o={o} />
                </Sequence>
              ))}
            </FadeIn>
          </Sequence>
        );
      })}
      <Captions words={transcript.words} />
      {video.watermark ? <Watermark text={video.watermark} /> : null}
      {transcript.audio ? <Audio src={staticFile(transcript.audio)} /> : null}
    </AbsoluteFill>
  );
};
