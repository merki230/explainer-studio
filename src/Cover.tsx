import React from 'react';
import {AbsoluteFill, Sequence, useVideoConfig} from 'remotion';
import {CoverText, ThumbText} from './components/CoverText';
import {DetailBox} from './components/DetailBox';
import {SCENES} from './scenes';
import {WHEEL_SCENES} from './three/real/wheelMotion';
import type {SectionRoomSceneProps} from './scenes/SectionRoomScene';
import type {Mood} from './theme';
import {VIDEOS} from './videos';

export type CoverProps = {videoId: string; /** a Short's cover (chapter number): `spec.shorts[].cover` */ short?: number};

/**
 * A video's cover still (`spec.cover`, see CoverSpec): its scene frozen at `at` seconds with the
 * camera held still, an optional detail box drawn fully in (no fade), and the hook line on top.
 * No captions, title block, tags or sound. Registered in Root as `<slug>-cover`. A horizontal video's cover is its
 * YouTube thumbnail (style guide § 11.9.1): the same frozen scene with the `ThumbText` block (`yarn cover` renders it
 * at 3840 × 2160 to `release/thumbnail.png`, plus `thumbnail-1280.jpg`).
 */
export const Cover: React.FC<CoverProps> = ({videoId, short}) => {
  const {fps, width, height} = useVideoConfig();
  const cover = short === undefined ? VIDEOS[videoId]?.spec.cover : VIDEOS[videoId]?.spec.shorts?.find((s) => s.chapter === short)?.cover;
  if (!cover) return null;
  const sceneName = cover.scene ?? 'section-room';
  const Scene = SCENES[sceneName];
  const frame = Math.round((cover.at ?? 2) * fps);
  const durationInFrames = frame + 1;
  const props: Record<string, unknown> = {
    // a posted video's wheel pin (`VideoSpec.wheels`), as Explainer hands it to the video's scenes
    ...(VIDEOS[videoId].spec.wheels && WHEEL_SCENES.includes(sceneName) ? {wheels: VIDEOS[videoId].spec.wheels} : {}),
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
      {/* a horizontal video's cover is its YouTube thumbnail (§ 11.9.1): the thumbnail text block */}
      {width > height ? (
        <ThumbText text={cover.text} mood={mood} />
      ) : (
        <CoverText text={cover.text} size={cover.size} top={cover.top} width={cover.width} mood={mood} />
      )}
    </AbsoluteFill>
  );
};
