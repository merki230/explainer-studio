import React from 'react';
import {AbsoluteFill, Composition} from 'remotion';
import {fonts} from '../fonts';
import {CAST, MOODS, section} from '../theme';
import {BANNER, bannerSvg, lockupSvg, MARK, symbolSvg} from './mark';

// Stills-only compositions for brand/assets/ (channel-kit § 4). Own entry point (src/brand/index.ts),
// so they stay out of the video registry, Root and `yarn render`. Rendered by src/brand/export.ts.

/** Profile picture: the mark fitted to the 640 px circle crop, hatch thickened (see export report). */
export const PROFILE = {scale: 0.88, hatchWidth: 2.75};

const Svg: React.FC<{svg: string}> = ({svg}) => (
  <AbsoluteFill>
    <div style={{width: '100%', height: '100%', lineHeight: 0}} dangerouslySetInnerHTML={{__html: svg}} />
  </AbsoluteFill>
);

/** profile-800 drawn at `size` with the platforms' circle mask (review only). */
const ProfileCheck: React.FC<{size: number; scale?: number; hatchWidth?: number}> = ({size, ...o}) => (
  <AbsoluteFill style={{borderRadius: '50%', overflow: 'hidden'}}>
    <Svg svg={symbolSvg({...PROFILE, ...o, size})} />
  </AbsoluteFill>
);

/** Outlines of the TV, desktop, tablet and mobile crops (channel-kit § 1), on transparent. */
const BannerOverlay: React.FC = () => {
  const colors = [section.cut, MOODS.day.sky[0], CAST.friend.top, section.screenLight];
  return (
    <AbsoluteFill>
      {BANNER.crops.map((c, i) => {
        const inset = 3; // every outline drawn just inside its box
        return (
          <div
            key={c.name}
            style={{
              position: 'absolute',
              left: c.x0 + inset,
              top: c.y0 + inset,
              width: c.x1 - c.x0 - 2 * inset,
              height: c.y1 - c.y0 - 2 * inset,
              border: `${i === 3 ? 6 : 4}px ${i === 1 ? 'dashed' : 'solid'} ${colors[i]}`,
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                position: 'absolute',
                ...(i === 3
                  ? // Mobile: outside the box's left edge, in the gap to the tablet line, read bottom to top,
                    // so it stays clear of the lockup and tagline inside the safe area.
                    {
                      right: 'calc(100% + 18px)',
                      bottom: 10,
                      writingMode: 'vertical-rl',
                      transform: 'rotate(180deg)',
                      whiteSpace: 'pre',
                      lineHeight: 1.3,
                    }
                  : {left: 14, ...(i === 0 ? {top: 14} : i === 1 ? {top: -46} : {bottom: -46}), whiteSpace: 'nowrap'}),
                fontFamily: fonts.mono,
                fontWeight: 700,
                fontSize: 28,
                letterSpacing: '0.08em',
                color: colors[i],
              }}
            >
              {i === 3 ? c.name.replace(/\s{2,}/, '\n') : c.name}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/** Banner with the overlay on top (review only, written to out/brand/). */
const BannerReview: React.FC = () => (
  <AbsoluteFill>
    <Svg svg={bannerSvg()} />
    <BannerOverlay />
  </AbsoluteFill>
);

type Still = {id: string; w: number; h: number; el: React.ReactNode};

export const STILLS: Still[] = [
  {id: 'profile-800', w: 800, h: 800, el: <Svg svg={symbolSvg({...PROFILE, size: 800})} />},
  {id: 'profile-check-98', w: 98, h: 98, el: <ProfileCheck size={98} />},
  {id: 'profile-check-110', w: 110, h: 110, el: <ProfileCheck size={110} />},
  {id: 'banner-2560x1440', w: 2560, h: 1440, el: <Svg svg={bannerSvg()} />},
  {id: 'banner-check-overlay', w: 2560, h: 1440, el: <BannerOverlay />},
  {id: 'watermark-300', w: 300, h: 300, el: <Svg svg={symbolSvg({size: 300, ground: false, mono: MARK.ink})} />},
  {id: 'lockup-dark-1600x400', w: 1600, h: 400, el: <Svg svg={lockupSvg({width: 1600, height: 400, pad: 0.12})} />},
  {
    id: 'lockup-light-1600x400',
    w: 1600,
    h: 400,
    el: <Svg svg={lockupSvg({width: 1600, height: 400, pad: 0.12, ink: MARK.inkDay, id: 'lt'})} />,
  },
  {id: 'symbol-1024', w: 1024, h: 1024, el: <Svg svg={symbolSvg({size: 1024, ground: false})} />},
  // Review only (out/brand/, not brand/assets/).
  {id: 'review-banner-overlay', w: 2560, h: 1440, el: <BannerReview />},
  {id: 'review-banner-plain', w: 2560, h: 1440, el: <Svg svg={bannerSvg({tagline: null})} />},
  // The spec as drawn (scale 1, hatch 1.8) and each fix alone, at 98 px, to judge PROFILE against.
  {id: 'review-check-98-spec', w: 98, h: 98, el: <ProfileCheck size={98} scale={1} hatchWidth={1.8} />},
  {id: 'review-check-98-scaled', w: 98, h: 98, el: <ProfileCheck size={98} hatchWidth={1.8} />},
  {id: 'review-check-98-hatch', w: 98, h: 98, el: <ProfileCheck size={98} scale={1} />},
  {
    id: 'review-profile-full',
    w: 800,
    h: 800,
    el: <Svg svg={symbolSvg({size: 800})} />,
  },
];

export const BrandRoot: React.FC = () => (
  <>
    {STILLS.map((s) => (
      <Composition
        key={s.id}
        id={s.id}
        component={() => <>{s.el}</>}
        durationInFrames={1}
        fps={30}
        width={s.w}
        height={s.h}
      />
    ))}
  </>
);
