import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {fonts} from '../fonts';
import {theme} from '../theme';

export type PhoneSceneProps = {
  durationInFrames: number;
  time?: string;
  date?: string;
  /** Orange "mic in use" dot next to the notch. */
  micDot?: boolean;
};

/** A tilted phone on a lock screen, done in CSS so the text stays razor sharp. */
export const PhoneScene: React.FC<PhoneSceneProps> = ({
  durationInFrames,
  time = '9:41',
  date = 'Tuesday, March 3',
  micDot = false,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 18, mass: 0.9}});
  const drift = interpolate(frame, [0, durationInFrames], [0, 1]);
  const float = Math.sin(frame / 22) * 10;
  const pulse = 0.5 + 0.5 * Math.abs(Math.sin((frame / fps) * Math.PI));

  return (
    <AbsoluteFill style={{background: 'radial-gradient(120% 80% at 50% 30%, #3b3766 0%, #1d1b35 60%, #111024 100%)'}}>
      {/* floor shadow */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 1490,
          width: 640,
          height: 90,
          transform: 'translateX(-50%)',
          borderRadius: '50%',
          background: 'rgba(0,0,0,0.45)',
          filter: 'blur(30px)',
          opacity: enter,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 330,
          width: 600,
          height: 1180,
          transform: `translateX(-50%) translateY(${interpolate(enter, [0, 1], [220, 0]) + float}px) perspective(2400px) rotateX(${14 - drift * 4}deg) rotateY(${-16 + drift * 6}deg) rotateZ(-7deg)`,
          opacity: enter,
          borderRadius: 86,
          border: '16px solid #16152b',
          boxShadow: 'inset 0 0 0 3px #3e3c66, 30px 50px 90px rgba(0,0,0,0.55)',
          background: 'linear-gradient(165deg, #6a63b8 0%, #4a4592 45%, #2c2862 100%)',
          overflow: 'hidden',
          fontFamily: fonts.sans,
          color: '#fff',
        }}
      >
        {/* glare */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(120deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0) 40%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 26,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 170,
            height: 46,
            borderRadius: 23,
            background: '#0d0c1c',
          }}
        />
        {micDot ? (
          <div
            style={{
              position: 'absolute',
              top: 41,
              left: 'calc(50% + 105px)',
              width: 16,
              height: 16,
              borderRadius: 8,
              background: theme.accent,
              opacity: pulse,
              boxShadow: `0 0 18px ${theme.accent}`,
            }}
          />
        ) : null}
        <div style={{position: 'absolute', top: 34, left: 52, fontWeight: 600, fontSize: 30}}>{time}</div>
        <div
          style={{
            position: 'absolute',
            top: 210,
            width: '100%',
            textAlign: 'center',
            fontWeight: 600,
            fontSize: 38,
            opacity: 0.9,
          }}
        >
          {date}
        </div>
        <div
          style={{
            position: 'absolute',
            top: 250,
            width: '100%',
            textAlign: 'center',
            fontWeight: 400,
            fontSize: 210,
            letterSpacing: '-0.02em',
          }}
        >
          {time}
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 22,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 200,
            height: 9,
            borderRadius: 5,
            background: 'rgba(255,255,255,0.8)',
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
