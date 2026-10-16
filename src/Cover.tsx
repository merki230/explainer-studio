import React from 'react';
import {AbsoluteFill, Sequence, useVideoConfig} from 'remotion';
import {CoverText} from './components/CoverText';
import {DetailBox} from './components/DetailBox';
import {SCENES} from './scenes';
import type {SectionRoomSceneProps} from './scenes/SectionRoomScene';
import type {Mood} from './theme';
import {VIDEOS} from './videos';

export type CoverProps = {videoId: string};

/**
 * A video's cover still (`spec.cover`, see CoverSpec): its scene frozen at `at` seconds with the
 * camera held still, an optional detail box drawn fully in (no fade), and the hook line on top.
 * No captions, title block, tags or sound. Registered in Root as `<slug>-cover`.
 */
export const Cover: React.FC<CoverProps> = ({videoId}) => {
  const {fps} = useVideoConfig();
  const cover = VIDEOS[videoId]?.spec.cover;
  if (!cover) return null;
  const sceneName = cover.scene ?? 'section-room';
  const Scene = SCENES[sceneName];
  const frame = Math.round((cover.at ?? 2) * fps);
  const durationInFrames = frame + 1;
  const props: Record<string, unknown> = {
    ...cover.props,
    drift: 0,
    ...(cover.camera ? {camera: {from: cover.camera}} : {}),
  };
  const mood: Mood = props.mood === 'night' ? 'night' : 'day';
  return (
    <AbsoluteFill>
      {/* a Sequence starting `frame` frames early shows the scene at `at` s (a Freeze is clamped to this 1-frame composition) */}
      <Sequence from={-frame}>
        <Scene {...props} durationInFrames={durationInFrames} />
        {cover.detail && sceneName === 'section-room' ? (
          <DetailBox
            {...cover.detail}
            mood={mood}
            scene={{props: props as Partial<SectionRoomSceneProps>, durationInFrames, offset: 0}}
          />
        ) : null}
      </Sequence>
      <CoverText text={cover.text} size={cover.size} top={cover.top} width={cover.width} mood={mood} />
    </AbsoluteFill>
  );
};
