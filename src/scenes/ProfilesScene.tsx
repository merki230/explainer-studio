import React, {useMemo} from 'react';
import {Easing, interpolate, random, useCurrentFrame, useVideoConfig} from 'remotion';
import * as THREE from 'three';
import {theme} from '../theme';
import {DustMotes} from '../three/Atmosphere';
import {Bust} from '../three/Mannequin';
import {BlobShadow, MuseumLights, MuseumSet, MuseumStage} from '../three/MuseumStage';
import {OrangeLight, OrangePath, OrangeWash} from '../three/OrangePath';
import {raw} from '../three/plaster';
import {CameraRig} from '../three/Stage';
import {WallPlate} from '../three/WallPlate';
import {clickOffFrame, clickOffLevel, type ClickOff} from './clickOff';

type V3 = [number, number, number];

export type ProfilesSceneProps = {
  durationInFrames: number;
  /** Seconds into the scene when the link between the two people starts drawing. */
  linkAt?: number;
  /** Seconds the link takes to draw. */
  linkDuration?: number;
  /** Seconds the link glows after it completes before fading to its stain. Omit to keep it glowing. */
  glowFor?: number;
  /** Data points that drift in and gather on the link (0 for none). */
  points?: number;
  /** Half the distance between the two busts (world units). */
  spread?: number;
  /** Wall plate text. Omit for a bare wall. */
  plate?: {number: string; title: string};
  /**
   * Open with the stain already on the wall (stain line + wall wash at full): a look at the busts
   * after the reveal. Stains never fade within a video. The link still draws over it unless `link` is false.
   */
  stained?: boolean;
  /** Draw the glowing link (default true). With `stained` and `link: false`, only the stains are there. */
  link?: boolean;
  /** Torch click-off for the loop point (see RoomScene): glow, dots and bleed off in 2 frames; stains stay. */
  clickOff?: ClickOff;
  /** Turntable: both busts (and pedestals) turn slowly, in degrees per second (0 = still; 2–4 is calm). */
  turntable?: number;
  /** Turntable angle at the scene's start (degrees), to continue a turn from the previous shot. */
  turntableFrom?: number;
  /** Dust motes drifting in the key light's beam (default on). */
  dust?: boolean;
  /** The scene's first frame in the video (set by Explainer): keeps the dust continuous across cuts. */
  startFrame?: number;
};

const seg = (x: number, a: number, b: number) =>
  interpolate(x, [a, b], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

// 0.7 (was 0.8): the shoulders sit below the caption line, not across it (review round 2).
const PEDESTAL = 0.7;
const SCALE = 1.2;
/** Head centre height of a Bust with this pedestal and scale. */
const HEAD_Y = PEDESTAL + 0.62 * SCALE;

/**
 * Two faceless busts on pedestals, linked by an orange route; data points drift
 * in and gather on it. "To an ad company, that's one household."
 */
export const ProfilesScene: React.FC<ProfilesSceneProps> = ({
  durationInFrames,
  linkAt = 0.3,
  linkDuration = 1.2,
  glowFor,
  points = 16,
  spread = 0.72,
  plate,
  stained = false,
  link = true,
  clickOff,
  turntable = 0,
  turntableFrom = 0,
  dust = true,
  startFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const offAt = clickOffFrame(clickOff, durationInFrames, fps);
  const on = clickOffLevel(frame, offAt);

  const done = linkAt + linkDuration;
  const p = link ? seg(t, linkAt, done) : 0;
  const glow = (glowFor === undefined ? 1 : 1 - seg(t, done + glowFor, done + glowFor + 0.8)) * on;
  const flow = p >= 1 ? (t - done) * 0.3 : undefined;
  // The stain: the line and the wall wash (wash spreads over the second half of the draw, as in the room).
  const stain = stained ? 1 : p;
  const wash = stained ? 1 : seg(p, 0.5, 0.85);

  // The route: from one head, up over the gap, to the other.
  const hy = HEAD_Y + 0.05;
  const legs: V3[][] = [
    [
      [-spread + 0.2, hy, 0.05],
      [-spread * 0.45, hy + 0.42, 0.05],
      [spread * 0.45, hy + 0.42, 0.05],
      [spread - 0.2, hy, 0.05],
    ],
  ];
  // Its stain sits on the wall behind, a little higher (it's further away).
  const w = -0.925;
  const stainLegs: V3[][] = [
    [
      [-spread - 0.05, hy + 0.15, w],
      [-spread * 0.5, hy + 0.62, w],
      [spread * 0.5, hy + 0.62, w],
      [spread + 0.05, hy + 0.15, w],
    ],
  ];
  const hub: V3 = [0, hy + 0.45, 0.05];

  // Data points: scattered around the busts, each drifts onto its own spot on
  // the route once it is drawn and is absorbed there (the route carries them).
  const routeKey = JSON.stringify(legs[0]);
  const route = useMemo(
    () => new THREE.CatmullRomCurve3((JSON.parse(routeKey) as V3[]).map((q) => new THREE.Vector3(...q))),
    [routeKey],
  );
  const dots = useMemo(
    () =>
      new Array(points).fill(0).map((_, i) => {
        const side = i % 2 === 0 ? -1 : 1;
        return {
          from: new THREE.Vector3(
            side * (0.5 + random(`pd-x${i}`) * 1.0),
            HEAD_Y - 0.5 + random(`pd-y${i}`) * 1.4,
            -0.5 + random(`pd-z${i}`) * 1.0,
          ),
          to: route.getPointAt((i + 0.5) / points),
          delay: random(`pd-d${i}`) * 0.9,
          ph: random(`pd-p${i}`) * 6.28,
        };
      }),
    [points, route],
  );
  const dotMat = useMemo(() => new THREE.MeshBasicMaterial({color: raw(theme.orange), transparent: true}), []);
  const appear = seg(t, linkAt + 0.2, linkAt + 0.8);
  dotMat.opacity = appear * glow;
  const washY = hy + 0.4;
  const spin = ((turntableFrom + turntable * t) * Math.PI) / 180;

  return (
    <MuseumStage post={{focusY: 0.42}}>
      <CameraRig
        from={[-0.1, 1.75, 6.2]}
        to={[0.1, 1.7, 5.75]}
        lookFrom={[0, 1.32, 0]}
        lookTo={[0, 1.32, -0.05]}
        durationInFrames={offAt === undefined ? durationInFrames : Math.min(durationInFrames, offAt)}
      />
      <MuseumLights target={[0, 1.2, 0]} />
      {dust ? <DustMotes from={[1.5, 7, 3.5]} to={[0, 1.2, 0]} clockOffset={startFrame / fps} /> : null}
      <MuseumSet />
      {plate ? <WallPlate number={plate.number} title={plate.title} position={[-1.15, 0.98, -0.925]} /> : null}
      <Bust position={[-spread, 0, 0]} pedestal={PEDESTAL} scale={SCALE} turn={0.45} spin={spin} />
      <Bust position={[spread, 0, 0]} pedestal={PEDESTAL} scale={SCALE} turn={-0.45} spin={spin} />
      <BlobShadow position={[-spread, 0.004, 0]} size={[1.0, 1.0]} opacity={0.44} />
      <BlobShadow position={[spread, 0.004, 0]} size={[1.0, 1.0]} opacity={0.44} />

      {/* the wall wash behind the busts, under the stain line: the same stain as the room's (§ 4) */}
      <OrangeWash position={[0, washY, w - 0.001]} size={[2.4, 1.8]} amount={wash} strength={0.4} />
      <OrangePath
        legs={legs}
        stainLegs={stainLegs}
        progress={p}
        stainProgress={stain}
        glow={glow}
        flow={flow}
        radius={0.022}
        // No light at the drawing head: the route starts on a head, and a light that close burns a
        // near-white fleck into the plaster (review round 3). The hub light below gives the bleed.
        runner={false}
      />
      <OrangeLight position={hub} intensity={1.4 * seg(p, 0.4, 0.7) * glow} reach={2.4} />

      {dots.map((d, i) => {
        const g = seg(t, done - 0.4 + d.delay, done + 0.5 + d.delay);
        const pos = d.from.clone().lerp(d.to, g);
        pos.y += Math.sin(t * 1.3 + d.ph) * 0.04 * (1 - g);
        const size = 1 - seg(g, 0.75, 1);
        return (
          <mesh
            key={i}
            position={pos}
            scale={size}
            material={dotMat}
            userData={{glow: true}}
            visible={appear * glow * size > 0.01}
          >
            <sphereGeometry args={[0.02, 12, 10]} />
          </mesh>
        );
      })}
    </MuseumStage>
  );
};
