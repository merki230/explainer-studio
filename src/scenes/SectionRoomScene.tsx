import React from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Figure} from '../three/section/Figure';
import {LivingRoomSlice, SLICE} from '../three/section/LivingRoomSlice';
import {projectToFrame, SectionCamera, sectionCameraAt, type Framing} from '../three/section/SectionCamera';
import {SectionLights, SectionStage} from '../three/section/SectionStage';
import type {Gesture} from '../three/rig';
import type {CastName, Mood} from '../theme';

type V3 = [number, number, number];

/**
 * Framings at the fixed angle. 'wide': the slice as an object (stage 2a, owner): a strip of sky over
 * the cut wall tops (back corner ≈ y 430), the room in the middle, the cut ground in the bottom
 * ≈ 20% (floor's front edge ≈ y 1540 on average). Camera ≈ (5.45, 4.90, 10.87).
 * 'couch': the two people on the couch; at 8.0 a seated figure fills ≈ 40% of the frame height,
 * the closest a push may come (§ 8).
 */
export const SECTION_FRAMINGS: Record<'wide' | 'couch', Framing> = {
  wide: {look: [-0.2, 1.36, 0], distance: 12.75},
  couch: {look: [0.0, 0.92, -0.45], distance: 8.0},
};

/** A camera move at the fixed angle: from one framing to another (truck/crane via `look`, push via `distance`). */
export type SectionMove = {from: Framing; to?: Framing};

export type SectionGesture = Gesture & {figure: CastName};

export type SectionRoomSceneProps = {
  durationInFrames: number;
  /** Night (lit room, lamp on) or Day (default, § 4). */
  mood?: Mood;
  /**
   * 'wide' or 'couch' (a slow push from there, see `push`), or a custom move between two framings.
   * The angle never changes (§ 8).
   */
  camera?: keyof typeof SECTION_FRAMINGS | SectionMove;
  /** Push speed for a preset framing, units/s toward the subject (≤ 0.06; 0 = hold). */
  push?: number;
  /** Idle truck drift, ± units (≤ 0.15; 0 = none). */
  drift?: number;
  /** Who sits where: [left seat, right seat]; null leaves a seat empty. Default FRIEND left, YOU right. */
  cast?: [CastName | null, CastName | null];
  /**
   * Cue-driven poses: `{figure, pose, at, target?, hold?, blend?}` with `figure` the cast name
   * ('friend', 'you', ...). Poses: 'idle', 'scroll', 'lean-in', 'lift-phone', 'look-up', 'turn-to',
   * 'glance-down'. `at` seconds into the scene (negative: already in it); `hold` seconds before easing
   * back (omit to hold); `blend` seconds (default 0.6). Targets default to the router (`look-up`) and
   * the other person's head (`turn-to`).
   */
  gestures?: SectionGesture[];
  /**
   * Each person's phone screen: a number (0 locked, 1 on), or `{at}`: locked until `at` seconds into
   * the scene, then on (0.3 s). Default: on.
   */
  screens?: Partial<Record<CastName, number | {at: number}>>;
  /** Router LED in orange, 0–1 (the system; stage 2 drives it). */
  led?: number;
  /** Laptop on the coffee table (lid toward the couch). */
  laptop?: boolean;
  /** Breathing, blinks, weight shifts, head drift, thumbs, the lamp's ±3% (default on). */
  life?: boolean;
  /** Focus line of the post pass, fraction of the frame from the top (default 0.5: the look-at). */
  focusY?: number;
  /** The scene's first frame in the video (set by Explainer): keeps idle motion continuous across cuts. */
  startFrame?: number;
};

/** The scene's camera move (framings and drift) from its props. */
const cameraMove = (p: Partial<SectionRoomSceneProps>, durationInFrames: number, fps: number) => {
  const camera = p.camera ?? 'wide';
  const push = p.push ?? 0.04;
  if (typeof camera === 'string') {
    const from = SECTION_FRAMINGS[camera] ?? SECTION_FRAMINGS.wide;
    return {from, to: {look: from.look, distance: from.distance - push * (durationInFrames / fps)}};
  }
  return {from: camera.from, to: camera.to ?? camera.from};
};

/** Where a cast member sits (their seat), or undefined if they are not in this scene. */
export const seatOf = (p: Partial<SectionRoomSceneProps>, who: CastName): V3 | undefined => {
  const cast = p.cast ?? ['friend', 'you'];
  const i = cast.indexOf(who);
  return i < 0 ? undefined : SLICE.seats[i];
};

/**
 * Frame position (px) of the top of a seated person's head at a frame of the scene, for labels
 * that point at people (name tags). Uses the scene's own camera maths; the rest pose's head.
 */
export const headTopOnScreen = (
  p: Partial<SectionRoomSceneProps>,
  who: CastName,
  o: {frame: number; fps: number; durationInFrames: number},
): [number, number] | undefined => {
  const seat = seatOf(p, who);
  if (!seat) return undefined;
  const {from, to} = cameraMove(p, o.durationInFrames, o.fps);
  const cam = sectionCameraAt({
    from,
    to,
    frame: o.frame,
    fps: o.fps,
    durationInFrames: o.durationInFrames,
    drift: p.drift ?? 0.08,
    clockOffset: (p.startFrame ?? 0) / o.fps,
  });
  return projectToFrame(cam, [seat[0], seat[1] + 1.49, seat[2] - 0.05]);
};

const ramp = (t: number, a: number, b: number) =>
  interpolate(t, [a, b], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

/** A living room cut open and seen from outside at the fixed 3/4 angle, with two of the cast on the couch. */
export const SectionRoomScene: React.FC<SectionRoomSceneProps> = ({
  durationInFrames,
  mood = 'day',
  camera = 'wide',
  push = 0.04,
  drift = 0.08,
  cast = ['friend', 'you'],
  gestures = [],
  screens = {},
  led = 0,
  laptop = false,
  life = true,
  focusY = 0.5,
  startFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const clockOffset = startFrame / fps;
  const clock = t + clockOffset;

  const {from, to} = cameraMove({camera, push}, durationInFrames, fps);

  const lamp = life ? 1 + 0.03 * Math.sin((clock / 4.5) * Math.PI * 2) : 1;
  const headOf = (seat: V3): V3 => [seat[0], seat[1] + 1.3, seat[2] + 0.02];
  const routerLook: V3 = [SLICE.router[0], SLICE.router[1] + 0.02, SLICE.router[2] + 0.1];
  const people = cast
    .map((who, i) => (who ? {who, seat: SLICE.seats[i], other: SLICE.seats[1 - i]} : null))
    .filter((p): p is {who: CastName; seat: V3; other: V3} => p !== null);

  return (
    <SectionStage mood={mood} post={{focusY}}>
      <SectionCamera from={from} to={to} durationInFrames={durationInFrames} drift={drift} clockOffset={clockOffset} />
      <SectionLights mood={mood} lamp={lamp} lampAt={SLICE.lampLight} />
      <LivingRoomSlice mood={mood} led={led} lamp={lamp} laptop={laptop} />
      {people.map(({who, seat, other}) => {
        const s = screens[who];
        const screenOn = s === undefined ? 1 : typeof s === 'number' ? s : ramp(t, s.at, s.at + 0.3);
        const mine: Gesture[] = gestures
          .filter((g) => g.figure === who)
          .map((g) => ({
            pose: g.pose,
            at: g.at,
            hold: g.hold,
            blend: g.blend,
            target: g.target ?? (g.pose === 'look-up' ? routerLook : g.pose === 'turn-to' ? headOf(other) : undefined),
          }));
        return (
          <Figure
            key={who}
            who={who}
            mood={mood}
            position={seat}
            gestures={mine}
            screenOn={screenOn}
            life={life}
            clockOffset={clockOffset}
          />
        );
      })}
    </SectionStage>
  );
};
